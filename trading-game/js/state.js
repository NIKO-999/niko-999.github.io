/**
 * state.js — versioned save + progression for Candle Quest. Zero deps. ES module.
 *
 * Public API:
 *   state                          — live singleton save object (mutate via helpers, then save())
 *   load() -> state                — read + migrate from localStorage (called automatically on import)
 *   save()                        — persist to localStorage + notify subscribers
 *   resetState() -> state          — wipe to defaults and persist
 *   xpForLevel(n) -> number        — total XP required to REACH level n (exponential curve)
 *   levelFromXP(xp) -> number
 *   levelProgress(xp) -> {level, into, needed, fraction}
 *   addXP(amount, reason?) -> {leveledUp, newLevel, oldLevel, total}
 *   rankTitle(level) -> string     — Novice ... Market Maker
 *   RANKS                          — [{minLevel, title}]
 *   touchDaily() -> {streak, extended, broken}  — call when today's daily is completed
 *   grantItem(id), hasItem(id)
 *   unlockCharacter(id), setActiveCharacter(id)
 *   grantAchievement(id) -> bool (newly granted)
 *   defeatBoss(id)
 *   setLessonDone(lessonId), isLessonDone(lessonId)
 *   recordStat(key, delta=1)       — increments state.stats[key]
 *   exportSave() -> string         — base64 JSON save code
 *   importSave(code) -> bool       — validate + adopt + persist
 *   onChange(fn) -> unsubscribe    — fn(state, meta) after every save()
 */

const STORAGE_KEY = 'candle-quest-save';
const SAVE_VERSION = 1;

/* ------------------------------------------------------------------ */
/* Default state                                                       */
/* ------------------------------------------------------------------ */

function defaultState() {
  return {
    version: SAVE_VERSION,
    xp: 0,
    level: 1,
    streak: 0,
    lastDailyISO: null,          // 'YYYY-MM-DD' of last completed daily
    unlockedCharacters: ['apprentice'],
    activeCharacter: 'apprentice',
    items: {},                   // { itemId: count }
    achievements: [],            // [achievementId]
    bossesDefeated: [],          // [bossId]
    lessonProgress: {},          // { lessonId: true }
    stats: {},                   // free-form counters: quizCorrect, scenariosPlayed, replayR...
  };
}

/* ------------------------------------------------------------------ */
/* Persistence + migration                                             */
/* ------------------------------------------------------------------ */

export let state = defaultState();

function migrate(raw) {
  // Migration stub: bump raw.version step by step as the schema evolves.
  // if (raw.version === 1) { raw.newField = ...; raw.version = 2; }
  const base = defaultState();
  const merged = { ...base, ...raw, version: SAVE_VERSION };
  // Ensure containers have the right shape even from corrupted saves.
  if (typeof merged.items !== 'object' || merged.items === null || Array.isArray(merged.items)) merged.items = {};
  if (!Array.isArray(merged.achievements)) merged.achievements = [];
  if (!Array.isArray(merged.bossesDefeated)) merged.bossesDefeated = [];
  if (!Array.isArray(merged.unlockedCharacters) || !merged.unlockedCharacters.length) merged.unlockedCharacters = base.unlockedCharacters;
  if (typeof merged.lessonProgress !== 'object' || merged.lessonProgress === null) merged.lessonProgress = {};
  if (typeof merged.stats !== 'object' || merged.stats === null) merged.stats = {};
  merged.xp = Math.max(0, Number(merged.xp) || 0);
  merged.level = levelFromXP(merged.xp);
  return merged;
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? migrate(JSON.parse(raw)) : defaultState();
  } catch {
    state = defaultState();
  }
  return state;
}

export function save(meta = {}) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage full/blocked */ }
  emit(meta);
}

export function resetState() {
  state = defaultState();
  save({ reason: 'reset' });
  return state;
}

/* ------------------------------------------------------------------ */
/* Pub/sub                                                             */
/* ------------------------------------------------------------------ */

const listeners = new Set();
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit(meta) { listeners.forEach((fn) => { try { fn(state, meta); } catch { /* listener error */ } }); }

/* ------------------------------------------------------------------ */
/* XP curve + levels                                                   */
/* ------------------------------------------------------------------ */

/** Total XP required to REACH level n. Level 1 = 0 XP. Exponential-ish curve. */
export function xpForLevel(n) {
  if (n <= 1) return 0;
  // 100 XP for level 2, growing ~18% per level.
  return Math.round(100 * (Math.pow(1.18, n - 1) - 1) / 0.18);
}

export function levelFromXP(xp) {
  let n = 1;
  while (xpForLevel(n + 1) <= xp && n < 99) n++;
  return n;
}

/** Progress within current level: into/needed XP + fraction 0..1. */
export function levelProgress(xp = state.xp) {
  const level = levelFromXP(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const needed = ceil - floor;
  const into = xp - floor;
  return { level, into, needed, fraction: needed > 0 ? into / needed : 1 };
}

export function addXP(amount, reason = '') {
  const oldLevel = state.level;
  state.xp += Math.max(0, Math.round(amount));
  state.level = levelFromXP(state.xp);
  const leveledUp = state.level > oldLevel;
  save({ reason: reason || 'xp', xpGained: amount, leveledUp });
  return { leveledUp, newLevel: state.level, oldLevel, total: state.xp };
}

/* ------------------------------------------------------------------ */
/* Rank titles                                                         */
/* ------------------------------------------------------------------ */

export const RANKS = [
  { minLevel: 1,  title: 'Novice' },
  { minLevel: 3,  title: 'Chart Watcher' },
  { minLevel: 5,  title: 'Wick Reader' },
  { minLevel: 8,  title: 'Session Scout' },
  { minLevel: 11, title: 'Swing Hunter' },
  { minLevel: 14, title: 'Bias Caller' },
  { minLevel: 17, title: 'Liquidity Runner' },
  { minLevel: 20, title: 'Profiler' },
  { minLevel: 24, title: 'Precision Executor' },
  { minLevel: 28, title: 'Funded Trader' },
  { minLevel: 33, title: 'Consistency Keeper' },
  { minLevel: 38, title: 'Smart Money' },
  { minLevel: 44, title: 'Market Maker' },
];

export function rankTitle(level = state.level) {
  let title = RANKS[0].title;
  for (const r of RANKS) if (level >= r.minLevel) title = r.title;
  return title;
}

/* ------------------------------------------------------------------ */
/* Daily streak                                                        */
/* ------------------------------------------------------------------ */

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Call when today's daily challenge is completed. */
export function touchDaily() {
  const today = todayISO();
  if (state.lastDailyISO === today) return { streak: state.streak, extended: false, broken: false };
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  const broken = state.lastDailyISO !== null && state.lastDailyISO !== yesterday;
  state.streak = broken ? 1 : state.streak + 1;
  state.lastDailyISO = today;
  save({ reason: 'daily' });
  return { streak: state.streak, extended: true, broken };
}

/** True if the streak is currently alive (daily done today or yesterday). */
export function streakAlive() {
  if (!state.lastDailyISO) return false;
  const today = todayISO();
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  return state.lastDailyISO === today || state.lastDailyISO === yesterday;
}

/* ------------------------------------------------------------------ */
/* Items / characters / achievements / bosses / lessons / stats        */
/* ------------------------------------------------------------------ */

export function grantItem(id, count = 1) {
  state.items[id] = (state.items[id] || 0) + count;
  save({ reason: 'item', itemId: id });
}
export function hasItem(id) { return (state.items[id] || 0) > 0; }
export function itemCount() { return Object.values(state.items).reduce((a, b) => a + b, 0); }

export function unlockCharacter(id) {
  if (state.unlockedCharacters.includes(id)) return false;
  state.unlockedCharacters.push(id);
  save({ reason: 'character', characterId: id });
  return true;
}
export function setActiveCharacter(id) {
  if (!state.unlockedCharacters.includes(id)) return false;
  state.activeCharacter = id;
  save({ reason: 'characterSelect', characterId: id });
  return true;
}

export function grantAchievement(id) {
  if (state.achievements.includes(id)) return false;
  state.achievements.push(id);
  save({ reason: 'achievement', achievementId: id });
  return true;
}

export function defeatBoss(id) {
  if (!state.bossesDefeated.includes(id)) state.bossesDefeated.push(id);
  save({ reason: 'boss', bossId: id });
}

export function setLessonDone(lessonId) {
  state.lessonProgress[lessonId] = true;
  save({ reason: 'lesson', lessonId });
}
export function isLessonDone(lessonId) { return !!state.lessonProgress[lessonId]; }

export function recordStat(key, delta = 1) {
  state.stats[key] = (state.stats[key] || 0) + delta;
  save({ reason: 'stat', statKey: key });
}

/* ------------------------------------------------------------------ */
/* Export / import save (base64 JSON, unicode-safe)                    */
/* ------------------------------------------------------------------ */

export function exportSave() {
  const json = JSON.stringify(state);
  return btoa(String.fromCharCode(...new TextEncoder().encode(json)));
}

export function importSave(code) {
  try {
    const bytes = Uint8Array.from(atob(code.trim()), (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof parsed !== 'object' || parsed === null || typeof parsed.version !== 'number') return false;
    state = migrate(parsed);
    save({ reason: 'import' });
    return true;
  } catch {
    return false;
  }
}

/* Boot: hydrate from storage on module import. */
load();
