/**
 * app.js — Candle Quest bootstrap + integrator.
 * Wires the shell (router, HUD, home dashboard, settings) to state and
 * initializes every game mode module.
 */

import { initRouter, setXpBar, setRing, toast, confettiBurst, openModal } from './ui.js';
import {
  state, onChange, levelProgress, rankTitle, streakAlive, itemCount,
  exportSave, importSave, resetState, RANKS,
} from './state.js';
import { initMeta, renderDailyCard, renderCharacters, renderInventory, renderAchievements, checkUnlocks, MODE_LOCKS, queueCelebration } from './meta.js';
import { characters } from '../data/characters.js';
import { bosses } from '../data/bosses.js';
import { lessons } from '../data/lessons.js';
import { initAcademy, refreshAcademy } from './academy.js';
import { initQuiz } from './quiz.js';
import { initScenarios } from './scenarios.js';
import { initReplay } from './replay.js';
import { initBoss, refreshBossGrid } from './boss.js';

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ */
/* Mode gating                                                         */
/* ------------------------------------------------------------------ */

function applyModeLocks() {
  document.querySelectorAll('#home-mode-grid .mode-card').forEach((card) => {
    const nav = card.dataset.nav;
    const req = MODE_LOCKS[nav];
    const locked = req && state.level < req;
    card.classList.toggle('locked', !!locked);
    let badge = card.querySelector('.mode-lock-badge');
    if (locked && !badge) {
      badge = document.createElement('span');
      badge.className = 'badge badge-locked mode-lock-badge';
      card.querySelector('.grow').prepend(badge);
    }
    if (badge) {
      if (locked) badge.textContent = `Unlocks at level ${req}`;
      else badge.remove();
    }
  });
}

// Capture-phase gate so locked modes toast instead of navigating.
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-nav]');
  if (!t) return;
  const req = MODE_LOCKS[t.dataset.nav];
  if (req && state.level < req) {
    e.stopPropagation();
    e.preventDefault();
    toast(`Reach level ${req} to unlock ${t.dataset.nav === 'bosses' ? 'Boss Battles' : 'the Replay Trainer'}. Earn XP in the Academy and Quiz Gauntlet.`, 'info', 3600);
  }
}, true);

/* ------------------------------------------------------------------ */
/* HUD + home dashboard                                                */
/* ------------------------------------------------------------------ */

/** The nearest thing the player hasn't unlocked yet — gives the hero's stat
    cluster a forward-looking hook. */
function nextUnlockText() {
  const lvl = state.level;
  const cands = [];
  for (const [nav, req] of Object.entries(MODE_LOCKS)) {
    if (lvl < req) cands.push({ level: req, label: nav === 'bosses' ? 'Boss Battles' : 'Replay Trainer' });
  }
  for (const b of bosses) {
    if (!state.bossesDefeated.includes(b.id) && lvl < b.unlockLevel) cands.push({ level: b.unlockLevel, label: b.name });
  }
  for (const ch of characters) {
    if (!state.unlockedCharacters.includes(ch.id) && ch.unlock.type === 'level') cands.push({ level: ch.unlock.value, label: ch.name });
  }
  const nextRank = RANKS.find((r) => r.minLevel > lvl);
  if (nextRank) cands.push({ level: nextRank.minLevel, label: `Rank — ${nextRank.title}` });
  cands.sort((a, b) => a.level - b.level);
  return cands.length
    ? `${cands[0].label} at level ${cands[0].level}`
    : 'Everything unlocked. Stay consistent.';
}

function renderHeroStats() {
  const lessonsDone = lessons.filter((l) => state.lessonProgress[l.id]).length;
  const el = (id) => $(id);
  if (!el('home-stat-lessons')) return;
  el('home-stat-lessons').textContent = `${lessonsDone} / ${lessons.length}`;
  const played = state.stats.scenariosPlayed || 0;
  const correct = state.stats.scenarioCorrect || 0;
  el('home-stat-scen').textContent = played ? `${Math.min(100, Math.round((correct / played) * 100))}%` : '—';
  el('home-stat-quiz').textContent = String(state.stats.quizCorrect || 0);
  const r = (state.stats.replayRx100 || 0) / 100;
  el('home-stat-replay').textContent = `${r >= 0 ? '+' : ''}${r.toFixed(2)}R`;
  el('home-next-unlock-text').textContent = nextUnlockText();
}

function renderHUD() {
  const p = levelProgress(state.xp);
  const rank = rankTitle(state.level);

  $('hud-level').textContent = state.level;
  $('hud-rank-title').textContent = rank;
  setRing($('hud-ring-fill'), p.fraction);
  setXpBar({
    fillEl: $('hud-xp-fill'), current: p.into, needed: p.needed,
    textEl: $('hud-xp-text'), barEl: $('hud-xp-bar'),
  });
  const streakEl = $('hud-streak');
  const live = streakAlive() && state.streak > 0;
  streakEl.classList.toggle('streak-live', live);
  streakEl.classList.toggle('streak-cold', !live);
  $('hud-streak-count').textContent = state.streak;
  $('hud-item-count').textContent = itemCount();
  $('hud-boss-count').textContent = state.bossesDefeated.length;

  $('home-level').textContent = state.level;
  $('home-rank-title').textContent = rank;
  setRing($('home-ring-fill'), p.fraction);
  setXpBar({ fillEl: $('home-xp-fill'), current: p.into, needed: p.needed });
  $('home-xp-text').textContent =
    `${Math.round(p.into)} / ${Math.round(p.needed)} XP to level ${state.level + 1}`;
  $('home-streak-badge').textContent = `\u{1F525} ${state.streak}-day streak`;
  $('home-items-badge').textContent = `${itemCount()} item${itemCount() === 1 ? '' : 's'} collected`;
  $('home-bosses-badge').textContent =
    `${state.bossesDefeated.length} boss${state.bossesDefeated.length === 1 ? '' : 'es'} defeated`;

  renderHeroStats();
  applyModeLocks();
}

/* Level-up rides the shared celebration queue: it waits its turn behind any
   open modal AND behind a held results/victory panel, so the payoff moment is
   seen before the modal chain begins. Confetti fires when the modal opens. */
function levelUpCelebration(level) {
  const newRank = rankTitle(level);
  const rankChanged = rankTitle(level - 1) !== newRank;
  const body = document.createElement('div');
  body.className = 'levelup-modal';
  body.innerHTML = `
    <p class="t-label">Level</p>
    <div class="lv-num t-grad pop-in">${level}</div>
    ${rankChanged
      ? `<p class="lv-rank">New rank: <span class="t-grad">${newRank}</span></p>`
      : `<p class="t-xs mt-2" style="color:var(--text-dim)">Rank: ${newRank}</p>`}
    <p class="t-sm mt-3" style="color:var(--text-mid)">The curve steepens from here. Keep the process tight.</p>
    <button class="btn btn-primary btn-lg mt-5" data-cere-close>Onward</button>`;
  queueCelebration(rankChanged ? 'New rank attained' : 'Level up', body, () => {
    confettiBurst({ count: 120 });
    const ring = $('home-level-ring');
    if (ring) {
      ring.classList.add('levelup-burst');
      setTimeout(() => ring.classList.remove('levelup-burst'), 1200);
    }
  });
}

/* ------------------------------------------------------------------ */
/* State subscription                                                  */
/* ------------------------------------------------------------------ */

onChange((s, meta) => {
  renderHUD();
  renderDailyCard();
  if (meta.leveledUp) {
    levelUpCelebration(s.level);
    checkUnlocks();
    refreshBossGrid();
  }
  if (meta.reason === 'import' || meta.reason === 'reset') {
    refreshAcademy();
    refreshBossGrid();
    renderCharacters();
    renderInventory();
    renderAchievements();
    toast(meta.reason === 'import' ? 'Save loaded — welcome back' : 'Fresh start — the market awaits', 'info');
  }
});

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

$('settings-export-btn').addEventListener('click', async () => {
  const code = exportSave();
  $('settings-save-code').value = code;
  try { await navigator.clipboard.writeText(code); toast('Save code copied to clipboard', 'success'); }
  catch { toast('Save code ready below — copy it manually', 'info'); }
});

$('settings-import-btn').addEventListener('click', () => {
  const code = $('settings-save-code').value;
  if (!code.trim()) { toast('Paste a save code first', 'error'); return; }
  if (importSave(code)) toast('Save imported successfully', 'success');
  else toast('Invalid save code', 'error');
});

$('settings-reset-btn').addEventListener('click', () => {
  const body = document.createElement('div');
  body.innerHTML = `
    <p class="t-sm" style="color:var(--text-mid);line-height:1.6">All XP, unlocks, relics, streaks and lesson progress will be wiped. This cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="reset-cancel-btn">Keep my progress</button>
      <button class="btn btn-danger" id="reset-confirm-btn">Reset everything</button>
    </div>`;
  const close = openModal({ title: 'Reset progress?', body });
  body.querySelector('#reset-cancel-btn').addEventListener('click', close);
  body.querySelector('#reset-confirm-btn').addEventListener('click', () => {
    close();
    resetState();
  });
});

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

initMeta();
initAcademy();
initQuiz();
initScenarios();
initReplay();
initBoss();
initRouter();
renderHUD();
renderDailyCard();
