/**
 * meta.js — meta-progression glue for Candle Quest.
 *
 * Public API (consumed by app.js and the mode modules):
 *   initMeta()                       — render characters/inventory/achievements, wire clicks
 *   getEffects() -> {xpMult, xpMultTimed, scenarioXpMult, firstTradeXpMult,
 *                    hintDiscount, quizTimeBonus, streakShield, replayForgive, hintTokens}
 *   awardXP(base, tags?) -> {amount, mult, leveledUp, ...addXP result}
 *   hintsLeft() -> number,  useHint() -> bool
 *   bumpDaily(sourceId, n?)          — progress today's daily challenge ('quiz'|'charts'|'replay')
 *   dailyChallenge() -> {id,label,target,nav}
 *   dailyProgress() -> {count, target, doneToday}
 *   renderDailyCard()
 *   awardItem(id) -> bool            — grant + ceremony on first copy
 *   unlockCharacterCeremony(id)
 *   grantAchievementChecked(id) -> bool
 *   checkUnlocks()                   — level/achievement-based character unlocks
 *   checkItemDrops()                 — stat-based item drops
 *   renderCharacters(), renderInventory(), renderAchievements()
 *   todayISO() -> 'YYYY-MM-DD'
 */

import { characters } from '../data/characters.js';
import { items, rarities } from '../data/items.js';
import { lessons } from '../data/lessons.js';
import {
  state, addXP, save, hasItem, grantItem, unlockCharacter, setActiveCharacter,
  grantAchievement, recordStat, touchDaily, streakAlive, isLessonDone,
} from './state.js';
import { toast, openModal, confettiBurst } from './ui.js';

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export const ACHIEVEMENTS = [
  { id: 'first-lesson',  name: 'First Steps',          desc: 'Complete your first Academy lesson.' },
  { id: 'track-v1',      name: 'Model Citizen',        desc: 'Finish every lesson in the V1 track.' },
  { id: 'track-v2',      name: 'Profiler in Training', desc: 'Finish every lesson in the V2 track.' },
  { id: 'track-gxt',     name: 'Expansion Framer',     desc: 'Finish every lesson in the GxT track.' },
  { id: 'perfect-run',   name: 'Flawless Gauntlet',    desc: 'Score 10/10 in a Quiz Gauntlet run.' },
  { id: 'scenario-10',   name: 'Tape Reader',          desc: 'Answer 10 chart scenarios correctly.' },
  { id: 'streak-7',      name: 'Seven Candles',        desc: 'Hold a 7-day daily streak.' },
  { id: 'first-boss',    name: 'Demon Slayer',         desc: 'Defeat your first boss.' },
  { id: 'all-bosses',    name: 'Clear the Book',       desc: 'Defeat all four bosses.' },
  { id: 'replay-5r',     name: 'Paid for Patience',    desc: 'Bank +5R total in the Replay Trainer.' },
  { id: 'flawless-chop-zone',      name: 'Untouched by Chop',   desc: 'Defeat The Chop Zone without losing a round.' },
  { id: 'flawless-fomo-demon',     name: 'Immune to FOMO',      desc: 'Defeat the FOMO Demon without losing a round.' },
  { id: 'flawless-revenge-trader', name: 'Beyond Tilt',         desc: 'Defeat The Revenge Trader without losing a round.' },
  { id: 'flawless-market-maker',   name: 'The Perfect Exam',    desc: 'Defeat The Market Maker without losing a round.' },
];

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Perk effects                                                        */
/* ------------------------------------------------------------------ */

/** Extra XP multipliers from tag-specific items: itemId -> tag it boosts. */
const ITEM_TAG_BOOSTS = {
  'cisd-trigger': 'entries',
  'asia-range-map': 'session',
  'driver-clock': 'time',
  'order-block-anvil': 'continuation',
  'expansion-sail': 'alignment',
  'dol-lodestone': 'bias',
};

export function getEffects() {
  const fx = {
    xpMult: 1, xpMultTimed: 1, scenarioXpMult: 1, firstTradeXpMult: 1,
    hintDiscount: 0, quizTimeBonus: 0, streakShield: 0, replayForgive: 0,
    hintTokens: 0, tagBoosts: {},
  };
  const ch = characters.find((c) => c.id === state.activeCharacter);
  if (ch) {
    const { key, value } = ch.perk.effect;
    if (key === 'xpMult') fx.xpMult *= value;
    else if (key === 'xpMultTimed') fx.xpMultTimed *= value;
    else if (key === 'scenarioXpMult') fx.scenarioXpMult *= value;
    else if (key === 'firstTradeXpMult') fx.firstTradeXpMult *= value;
    else if (key === 'hintDiscount') fx.hintDiscount += value;
    else if (key === 'quizTimeBonus') fx.quizTimeBonus += value;
    else if (key === 'streakShield') fx.streakShield += value;
    else if (key === 'replayForgive') fx.replayForgive += value;
  }
  for (const it of items) {
    if (!hasItem(it.id)) continue;
    if (it.perk.type === 'hintToken') fx.hintTokens += it.perk.value;
    else if (it.perk.type === 'streakShield') fx.streakShield += 1;
    else if (it.perk.type === 'xpBoost') {
      if (it.id === 'golden-wick' || it.id === 'crown-of-liquidity') fx.xpMult *= 1 + it.perk.value;
      else if (ITEM_TAG_BOOSTS[it.id]) fx.tagBoosts[ITEM_TAG_BOOSTS[it.id]] = (fx.tagBoosts[ITEM_TAG_BOOSTS[it.id]] || 0) + it.perk.value;
    }
  }
  return fx;
}

/**
 * Award XP with all active perk multipliers applied.
 * tags: e.g. ['scenario','time','session','entries','continuation','alignment','bias','boss','replay','lesson','quiz']
 */
export function awardXP(base, tags = []) {
  const fx = getEffects();
  let mult = fx.xpMult;
  if (tags.includes('time')) mult *= fx.xpMultTimed;
  if (tags.includes('scenario')) {
    mult *= fx.scenarioXpMult;
    const key = `firstScenario:${todayISO()}`;
    if (!state.stats[key]) {
      mult *= fx.firstTradeXpMult;
      state.stats[key] = 1; // marked; saved by addXP below
    }
  }
  for (const t of tags) if (fx.tagBoosts[t]) mult *= 1 + fx.tagBoosts[t];
  const amount = Math.max(1, Math.round(base * mult));
  const res = addXP(amount, tags[0] || 'xp');
  checkUnlocks();
  return { ...res, amount, mult };
}

/* ------------------------------------------------------------------ */
/* Hint tokens (daily pool)                                            */
/* ------------------------------------------------------------------ */

export function hintCapacity() {
  const fx = getEffects();
  return 1 + fx.hintTokens + (fx.hintDiscount > 0 ? 1 : 0);
}

export function hintsLeft() {
  const used = state.stats[`hintsUsed:${todayISO()}`] || 0;
  return Math.max(0, hintCapacity() - used);
}

export function useHint() {
  if (hintsLeft() <= 0) return false;
  recordStat(`hintsUsed:${todayISO()}`);
  return true;
}

/* ------------------------------------------------------------------ */
/* Daily challenge                                                     */
/* ------------------------------------------------------------------ */

const DAILY_DEFS = [
  { id: 'quiz',   label: 'Run one full Quiz Gauntlet',   target: 1, nav: 'quiz',   cta: 'Run Gauntlet' },
  { id: 'charts', label: 'Solve 3 chart scenarios',      target: 3, nav: 'charts', cta: 'Read Charts' },
  { id: 'replay', label: 'Complete one Replay session',  target: 1, nav: 'replay', cta: 'Start Replay' },
];

/** Level required to enter each gated mode (single source of truth — app.js
    imports this for its nav lock gate). */
export const MODE_LOCKS = { replay: 2, bosses: 3 };

/** Today's challenge — never points at a mode the player hasn't unlocked. */
export function dailyChallenge() {
  const iso = todayISO();
  const hash = [...iso].reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = DAILY_DEFS[hash % DAILY_DEFS.length];
  const unlocked = (d) => !MODE_LOCKS[d.nav] || state.level >= MODE_LOCKS[d.nav];
  if (unlocked(pick)) return pick;
  const pool = DAILY_DEFS.filter(unlocked);
  return pool.length ? pool[hash % pool.length] : DAILY_DEFS[0];
}

export function dailyProgress() {
  const ch = dailyChallenge();
  return {
    count: state.stats[`daily:${todayISO()}:${ch.id}`] || 0,
    target: ch.target,
    doneToday: state.lastDailyISO === todayISO(),
  };
}

/** Called by modes when their unit of work completes. */
export function bumpDaily(sourceId, n = 1) {
  const ch = dailyChallenge();
  if (sourceId !== ch.id) return;
  const p = dailyProgress();
  if (p.doneToday) return;
  const key = `daily:${todayISO()}:${ch.id}`;
  state.stats[key] = (state.stats[key] || 0) + n;
  save({ reason: 'stat', statKey: key });
  if (state.stats[key] >= ch.target) {
    const r = touchDaily();
    const bonus = 30 + Math.min(state.streak, 10) * 5;
    toast(`Daily challenge complete — streak ${r.streak} day${r.streak === 1 ? '' : 's'}. +${bonus} XP`, 'xp', 4200);
    awardXP(bonus, ['daily']);
    if (state.streak >= 7) {
      grantAchievementChecked('streak-7');
      if (!hasItem('streak-shield')) awardItem('streak-shield');
    }
  }
  renderDailyCard();
}

export function renderDailyCard() {
  const card = document.getElementById('home-daily');
  if (!card) return;
  const ch = dailyChallenge();
  const p = dailyProgress();
  const title = card.querySelector('h3');
  const desc = card.querySelector('p.t-sm');
  const btn = document.getElementById('home-daily-btn');
  if (p.doneToday) {
    title.textContent = 'Streak secured for today';
    desc.textContent = `You showed up. ${state.streak}-day streak alive — same time tomorrow. Consistency beats outcome.`;
    btn.textContent = 'Keep training';
    btn.dataset.nav = ch.nav;
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-ghost');
  } else {
    title.textContent = ch.label;
    desc.textContent = p.count > 0
      ? `Progress: ${p.count} / ${ch.target}. Finish before the close to keep the streak alive.`
      : 'Complete this drill before the close to keep your streak alive. Consistency beats outcome.';
    btn.textContent = ch.cta;
    btn.dataset.nav = ch.nav;
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-ghost');
  }
}

/* ------------------------------------------------------------------ */
/* Ceremonies                                                          */
/* ------------------------------------------------------------------ */

/* Ceremony queue: stacked unlocks (level-ups, boss rewards, trader/item
   ceremonies) present one at a time instead of clobbering each other's modal.
   Modes that show their own payoff panel (boss victory, quiz results, replay
   debrief) HOLD the queue so the panel gets its moment, then release it when
   the player clicks through — the reward hierarchy is never buried. */
const cereQueue = [];
let cereOpen = false;
let cereHeld = false;

function pushCeremony(title, body, onOpen = null) {
  cereQueue.push({ title, body, onOpen });
  nextCeremony();
}

/** Pause queued celebrations while a results / victory panel owns the screen. */
export function holdCelebrations() { cereHeld = true; }

/** Resume the queue (no-op if it was never held). */
export function releaseCelebrations() {
  if (!cereHeld) return;
  cereHeld = false;
  nextCeremony();
}

/** Queue an arbitrary celebration modal (used by the level-up flow in app.js).
    `onOpen` runs at the moment the modal actually opens (confetti, bursts). */
export function queueCelebration(title, body, onOpen = null) {
  pushCeremony(title, body, onOpen);
}

function nextCeremony() {
  if (cereOpen || cereHeld) return; // on screen or held; onClose/release chains the next
  if (!cereQueue.length) return;
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop && backdrop.classList.contains('open')) {
    // another modal (e.g. a session debrief) is up — wait for it
    setTimeout(nextCeremony, 700);
    return;
  }
  const { title, body, onOpen } = cereQueue.shift();
  cereOpen = true;
  if (onOpen) { try { onOpen(); } catch { /* cosmetic only */ } }
  const close = openModal({
    title, body,
    onClose: () => { cereOpen = false; setTimeout(nextCeremony, 180); },
  });
  const btn = body.querySelector('[data-cere-close]');
  if (btn) btn.addEventListener('click', close);
}

/* Safety net: any navigation releases a held queue so celebrations can never
   be stranded if the player leaves a results panel via the nav instead. */
document.addEventListener('screenchange', () => releaseCelebrations());

function ceremonyBody({ icon, rarityKey, name, kicker, flavor, perk, big = false }) {
  const r = rarities[rarityKey] || { label: 'Unlocked', color: '#38bdf8' };
  const wrap = document.createElement('div');
  wrap.className = 'ceremony';
  wrap.innerHTML = `
    <div class="cere-icon ${big ? 'big' : ''} rarity-glow pop-in" style="--rarity:${r.color}">${icon}</div>
    <span class="badge badge-rarity rarity-${rarityKey || 'rare'} mt-4" style="--rarity:${r.color}">${r.label}</span>
    <h3 class="t-grad">${name}</h3>
    ${kicker ? `<p class="t-label mt-2">${kicker}</p>` : ''}
    ${flavor ? `<p class="cere-flavor">${flavor}</p>` : ''}
    ${perk ? `<div class="cere-perk">${perk}</div>` : ''}
    <button class="btn btn-primary btn-lg mt-5" data-cere-close>Claim</button>`;
  return wrap;
}

export function awardItem(id) {
  const it = items.find((i) => i.id === id);
  if (!it) return false;
  const firstCopy = !hasItem(id);
  grantItem(id);
  renderInventory();
  if (firstCopy) {
    pushCeremony('New Relic', ceremonyBody({
      icon: it.icon, rarityKey: it.rarity, name: it.name,
      kicker: 'Relic acquired', flavor: it.flavor, perk: it.perk.desc,
    }), () => confettiBurst({ count: 60 }));
  } else {
    toast(`${it.name} — another copy added to your inventory`, 'info');
  }
  return firstCopy;
}

export function unlockCharacterCeremony(id) {
  const ch = characters.find((c) => c.id === id);
  if (!ch || !unlockCharacter(id)) return false;
  renderCharacters();
  pushCeremony('Trader Unlocked', ceremonyBody({
    icon: ch.avatar, rarityKey: 'epic', name: ch.name, big: true,
    kicker: ch.title, flavor: ch.lore, perk: ch.perk.desc,
  }), () => confettiBurst({ count: 70 }));
  return true;
}

export function grantAchievementChecked(id) {
  const fresh = grantAchievement(id);
  if (fresh) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    toast(`Achievement unlocked: ${a ? a.name : id}`, 'success', 3600);
    renderAchievements();
    checkUnlocks();
    checkItemDrops();
  }
  return fresh;
}

/* ------------------------------------------------------------------ */
/* Unlock + drop checks                                                */
/* ------------------------------------------------------------------ */

export function checkUnlocks() {
  for (const ch of characters) {
    if (state.unlockedCharacters.includes(ch.id)) continue;
    const u = ch.unlock;
    const met =
      (u.type === 'level' && state.level >= u.value) ||
      (u.type === 'achievement' && state.achievements.includes(u.value)) ||
      (u.type === 'boss' && state.bossesDefeated.includes(u.value));
    if (met) unlockCharacterCeremony(ch.id);
  }
}

function trackComplete(trackId) {
  const ls = lessons.filter((l) => l.track === trackId);
  return ls.length > 0 && ls.every((l) => isLessonDone(l.id));
}

/** Evaluate stat-based item drop conditions. Safe to call often. */
export function checkItemDrops() {
  const st = state.stats;
  const drop = (id, cond) => { if (cond && !hasItem(id)) awardItem(id); };
  drop('cisd-trigger', trackComplete('v1'));
  drop('compass-of-bias', trackComplete('v1') || state.bossesDefeated.includes('chop-zone'));
  drop('asia-range-map', trackComplete('v2'));
  drop('fractal-key', trackComplete('gxt'));
  drop('expansion-sail', trackComplete('gxt'));
  drop('smt-lens', (st['cat:smt'] || 0) >= 15);
  drop('liquidity-vial', (st['cat:liquidity'] || 0) >= 10);
  drop('ohlc-die', (st['cat:candle'] || 0) >= 10);
  drop('driver-clock', (st['cat:time'] || 0) >= 10);
  drop('dol-lodestone', (st['cat:bias'] || 0) >= 10);
  drop('fvg-prism', (st['scenarioCorrect'] || 0) >= 10);
  drop('protected-swing-sigil', (st['scenarioCorrect'] || 0) >= 20);
  drop('order-block-anvil', (st['replayValidEntries'] || 0) >= 5);
  drop('streak-shield', state.streak >= 7);
  drop('golden-wick', ['chop-zone', 'fomo-demon', 'revenge-trader', 'market-maker']
    .every((b) => state.achievements.includes(`flawless-${b}`)));
}

/* ------------------------------------------------------------------ */
/* Screen renderers                                                    */
/* ------------------------------------------------------------------ */

export function renderCharacters() {
  const grid = document.getElementById('char-grid');
  if (!grid) return;
  grid.replaceChildren();
  for (const ch of characters) {
    const unlocked = state.unlockedCharacters.includes(ch.id);
    const active = state.activeCharacter === ch.id;
    const btn = document.createElement('button');
    btn.className = `char-card glass card-hover${active ? ' selected' : ''}${unlocked ? '' : ' locked'}`;
    btn.type = 'button';
    btn.setAttribute('aria-pressed', String(active));
    btn.innerHTML = `
      ${active ? '<span class="badge badge-accent char-active-tag">Active</span>' : ''}
      <span class="char-avatar" aria-hidden="true">${ch.avatar}</span>
      <h3 class="t-h3">${ch.name}</h3>
      <span class="badge mt-2">${ch.title}</span>
      <p class="char-perk">${unlocked ? ch.perk.desc : ch.lore}</p>
      ${unlocked ? `<p class="char-lore">${ch.lore}</p>` : `<p class="char-unlock-hint">Locked — ${ch.unlock.label}</p>`}`;
    btn.addEventListener('click', () => {
      if (!unlocked) { toast(`Locked: ${ch.unlock.label}`, 'info'); return; }
      if (active) { showCharacterModal(ch); return; }
      setActiveCharacter(ch.id);
      toast(`${ch.name} is now your active trader — ${ch.perk.desc}`, 'success', 3400);
      renderCharacters();
    });
    grid.appendChild(btn);
  }
}

function showCharacterModal(ch) {
  const body = ceremonyBody({
    icon: ch.avatar, rarityKey: 'epic', name: ch.name, big: true,
    kicker: ch.title, flavor: ch.lore, perk: ch.perk.desc,
  });
  const close = openModal({ title: 'Your Trader', body });
  body.querySelector('[data-cere-close]').textContent = 'Close';
  body.querySelector('[data-cere-close]').addEventListener('click', close);
}

export function renderInventory() {
  const grid = document.getElementById('inv-grid');
  if (!grid) return;
  grid.replaceChildren();
  for (const it of items) {
    const count = state.items[it.id] || 0;
    const owned = count > 0;
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `inv-item rarity-${it.rarity}${owned ? ' rarity-glow' : ' locked'}`;
    cell.style.setProperty('--rarity', rarities[it.rarity].color);
    cell.innerHTML = `
      <span class="inv-icon" aria-hidden="true">${it.icon}</span>
      <span class="inv-name">${it.name}</span>
      <span class="inv-count">${owned ? (count > 1 ? `Owned ×${count}` : 'Owned') : 'Not yet found'}</span>`;
    cell.addEventListener('click', () => {
      const body = document.createElement('div');
      body.className = 'ceremony';
      body.innerHTML = `
        <div class="cere-icon ${owned ? 'rarity-glow' : ''}" style="--rarity:${rarities[it.rarity].color};${owned ? '' : 'filter:grayscale(1);opacity:0.6'}">${it.icon}</div>
        <span class="badge badge-rarity rarity-${it.rarity} mt-4">${rarities[it.rarity].label}</span>
        <h3>${it.name}</h3>
        <p class="cere-flavor">${it.flavor}</p>
        <div class="cere-perk">${owned ? it.perk.desc : `How to earn: ${it.earned}`}</div>`;
      openModal({ title: owned ? 'Relic' : 'Undiscovered Relic', body });
    });
    grid.appendChild(cell);
  }
}

export function renderAchievements() {
  let wrap = document.getElementById('ach-section');
  if (!wrap) {
    const screen = document.getElementById('screen-inventory');
    wrap = document.createElement('div');
    wrap.id = 'ach-section';
    wrap.className = 'mt-6';
    wrap.innerHTML = `
      <div class="screen-head">
        <p class="t-label">Achievements</p>
        <h2 class="t-h2">Proof of process</h2>
      </div>
      <div class="ach-grid" id="ach-grid"></div>`;
    screen.appendChild(wrap);
  }
  const grid = document.getElementById('ach-grid');
  grid.replaceChildren();
  for (const a of ACHIEVEMENTS) {
    const earned = state.achievements.includes(a.id);
    const card = document.createElement('div');
    card.className = `ach-card${earned ? '' : ' locked'}`;
    card.innerHTML = `
      <span class="ach-dot" aria-hidden="true">${earned
        ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12.5 9.5 18 20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'}</span>
      <div>
        <h4>${a.name}</h4>
        <p>${a.desc}</p>
      </div>`;
    grid.appendChild(card);
  }
}

export function initMeta() {
  renderCharacters();
  renderInventory();
  renderAchievements();
  renderDailyCard();
  checkUnlocks();
}
