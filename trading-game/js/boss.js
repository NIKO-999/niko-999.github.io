/**
 * boss.js — Boss battles: select grid, intro, battle loop with HP bars,
 * victory/defeat states and reward ceremonies.
 *
 * Public API:
 *   initBoss() — wire the screen. Call once at boot.
 *   refreshBossGrid() — re-render locks (e.g. after level-up/import).
 */

import { bosses } from '../data/bosses.js';
import { quizbank } from '../data/quizbank.js';
import { scenarios } from '../data/scenarios.js';
import { ChartEngine } from './chart-engine.js';
import { state, defeatBoss, recordStat } from './state.js';
import { toast, openModal, confettiBurst } from './ui.js';
import {
  awardXP, awardItem, unlockCharacterCeremony, grantAchievementChecked,
  checkUnlocks, checkItemDrops, holdCelebrations, releaseCelebrations,
} from './meta.js';
import { generateForScenario } from './scenarios.js';

const $ = (id) => document.getElementById(id);
const ROMAN = ['I', 'II', 'III', 'IV'];

let battle = null;   // active battle state
let stageEngine = null; // ChartEngine for scenario rounds (created per round)

/* ------------------------------------------------------------------ */
/* Round resolution                                                    */
/* ------------------------------------------------------------------ */

function resolveRound(round) {
  if (round.type === 'quiz') {
    const q = quizbank.find((x) => x.id === round.ref);
    return { kind: 'question', q: q.question, options: q.options, answer: q.answerIndex, explain: q.explanation, category: q.category };
  }
  if (round.type === 'question') {
    return { kind: 'question', q: round.q, options: round.options, answer: round.answer, explain: round.explain };
  }
  // scenario round — always MCQ scenarios in the data, shown with a live chart
  const sc = scenarios.find((x) => x.id === round.ref);
  return {
    kind: 'scenario', sc,
    prompt: round.prompt,
    q: sc.question.prompt, options: sc.question.options, answer: sc.question.answer, explain: sc.rationale,
  };
}

/* ------------------------------------------------------------------ */
/* Select grid                                                         */
/* ------------------------------------------------------------------ */

export function refreshBossGrid() {
  const grid = $('boss-select-grid');
  grid.replaceChildren();
  bosses.forEach((b, bi) => {
    const defeated = state.bossesDefeated.includes(b.id);
    const locked = state.level < b.unlockLevel && !defeated;
    const card = document.createElement('article');
    card.className = `boss-card glass${locked ? ' locked' : ' card-hover'}`;
    card.innerHTML = `
      <div class="row" style="gap:var(--sp-3);align-items:flex-start">
        <div class="boss-portrait" style="width:64px;height:64px;flex:none">${b.portrait}</div>
        <div class="grow">
          <span class="badge ${defeated ? 'badge-bull' : locked ? 'badge-locked' : 'badge-bear'}">${
            defeated ? 'Defeated' : locked ? `Unlocks at level ${b.unlockLevel}` : `Boss ${ROMAN[bi]}`}</span>
          <h3 class="t-h2 mt-2">${b.name}</h3>
          <p class="t-xs" style="color:var(--text-dim)">${b.epithet}</p>
        </div>
      </div>
      <p class="t-sm mt-2">${b.lore}</p>
      <button class="btn ${locked ? 'btn-ghost' : 'btn-primary'} mt-2" ${locked ? 'disabled' : ''}>${
        defeated ? 'Rematch' : locked ? `Locked — level ${b.unlockLevel}` : 'Challenge'}</button>`;
    if (!locked) card.querySelector('button').addEventListener('click', () => showIntro(b));
    grid.appendChild(card);
  });
}

function showIntro(boss) {
  const body = document.createElement('div');
  body.className = 'ceremony';
  body.innerHTML = `
    <div class="cere-icon big" style="--rarity:var(--bear)">${boss.portrait}</div>
    <h3>${boss.name}</h3>
    <p class="t-label mt-2">${boss.epithet}</p>
    <p class="cere-flavor">${boss.intro}</p>
    <div class="cere-perk">${boss.rounds.length} rounds · You have ${boss.playerHp} lives · Correct answers strike the boss, mistakes strike you</div>
    <button class="btn btn-danger btn-lg mt-5" id="boss-begin-btn">Begin the battle</button>`;
  const close = openModal({ title: 'Boss Battle', body });
  body.querySelector('#boss-begin-btn').addEventListener('click', () => { close(); startBattle(boss); });
}

/* ------------------------------------------------------------------ */
/* Battle loop                                                         */
/* ------------------------------------------------------------------ */

/** Swap between the select grid and the arena so mid-battle the encounter is
    the only thing on screen (mirrors the academy track-list/lesson pattern). */
function setArenaOpen(open) {
  $('boss-arena').classList.toggle('hidden', !open);
  $('boss-select-grid').classList.toggle('hidden', open);
  const head = document.querySelector('#screen-bosses .screen-head');
  if (head) head.classList.toggle('hidden', open);
}

function exitArena() {
  destroyStageEngine();
  battle = null;
  setArenaOpen(false);
  refreshBossGrid();
  window.scrollTo({ top: 0, behavior: 'auto' });
  // Leaving the arena is the "collect" moment — any queued level-up / trader /
  // relic ceremonies may now take the stage, one at a time.
  releaseCelebrations();
}

function startBattle(boss) {
  const perHit = Math.ceil(boss.hp / boss.rounds.length);
  battle = {
    boss,
    bossHp: boss.hp,
    playerHp: boss.playerHp,
    round: 0,
    wins: 0,
    perHit,
    crit: Math.round(perHit * 1.35),
    results: [],
    roundStart: 0,
  };
  const arena = $('boss-arena');
  setArenaOpen(true);
  $('boss-portrait').innerHTML = boss.portrait;
  $('boss-name').textContent = boss.name;
  $('boss-tag').textContent = boss.epithet;
  renderHp();
  renderDots();
  arena.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderRound();
}

function renderHp() {
  const b = battle;
  $('boss-hp-text').textContent = `${Math.max(0, b.bossHp)} / ${b.boss.hp}`;
  $('boss-hp-bar').querySelector('.bar-fill').style.width = `${Math.max(0, (b.bossHp / b.boss.hp) * 100)}%`;
  $('player-hp-text').textContent = `${Math.max(0, b.playerHp)} / ${b.boss.playerHp}`;
  $('player-hp-bar').querySelector('.bar-fill').style.width = `${Math.max(0, (b.playerHp / b.boss.playerHp) * 100)}%`;
}

function renderDots() {
  const dots = $('boss-round-dots');
  dots.replaceChildren();
  battle.boss.rounds.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'round-dot';
    if (i < battle.results.length) d.classList.add(battle.results[i] ? 'won' : 'lost');
    else if (i === battle.round) d.classList.add('current');
    dots.appendChild(d);
  });
}

function destroyStageEngine() {
  if (stageEngine) { stageEngine.destroy(); stageEngine = null; }
}

function renderRound() {
  const b = battle;
  const stage = $('boss-stage');
  destroyStageEngine();
  const r = resolveRound(b.boss.rounds[b.round]);
  b.current = r;
  b.roundStart = performance.now();
  renderDots();

  stage.innerHTML = `
    <p class="t-label">Round ${b.round + 1} of ${b.boss.rounds.length}</p>
    ${r.kind === 'scenario' ? `
      <p class="boss-q mt-2">${r.prompt}</p>
      <p class="boss-setup">${r.sc.setup}</p>
      <div class="chart-panel"><canvas id="boss-canvas" aria-label="Boss scenario chart"></canvas></div>
      <p class="boss-q mt-4">${r.q}</p>` : `
      <p class="boss-q mt-2">${r.q}</p>`}
    <div class="quiz-options mt-4" id="boss-options"></div>`;

  if (r.kind === 'scenario') {
    const gen = generateForScenario(r.sc);
    b.currentGen = gen;
    stageEngine = new ChartEngine($('boss-canvas'), { timeframeMinutes: gen.tf, sessions: r.sc.gen.sessions !== false });
    stageEngine.setSmtData(gen.smtCandles || null);
    stageEngine.setData(gen.candles);
  }

  const opts = $('boss-options');
  r.options.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.dataset.oi = oi;
    btn.innerHTML = `<span class="opt-key">${'ABCD'[oi]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => answerRound(oi));
    opts.appendChild(btn);
  });
}

function answerRound(oi) {
  const b = battle;
  const r = b.current;
  const correct = oi === r.answer;
  const fast = (performance.now() - b.roundStart) / 1000 < 10;
  b.results.push(correct);

  const opts = $('boss-options');
  [...opts.children].forEach((c) => {
    c.disabled = true;
    const i = Number(c.dataset.oi);
    if (i === r.answer) c.classList.add('correct');
    else if (i === oi) c.classList.add('wrong');
  });

  if (r.kind === 'scenario' && stageEngine && b.currentGen) {
    for (const a of b.currentGen.annotations) stageEngine.addAnnotation(a);
  }

  if (correct) {
    b.wins++;
    const dmg = fast ? b.crit : b.perHit;
    b.bossHp = Math.max(0, b.bossHp - dmg);
    if (b.round === b.boss.rounds.length - 1 && b.playerHp > 0) b.bossHp = 0; // finishing blow
    const bar = $('boss-hp-bar');
    bar.classList.add('hp-shake', 'hp-flash');
    setTimeout(() => bar.classList.remove('hp-shake', 'hp-flash'), 460);
    if (r.category) recordStat(`cat:${r.category}`);
    recordStat('quizCorrect');
  } else {
    b.playerHp = Math.max(0, b.playerHp - b.boss.selfDamage);
    const bar = $('player-hp-bar');
    bar.classList.add('hp-shake', 'hp-flash');
    setTimeout(() => bar.classList.remove('hp-shake', 'hp-flash'), 460);
  }
  renderHp();
  renderDots();

  const last = b.round >= b.boss.rounds.length - 1;
  const dead = b.playerHp <= 0;
  const ex = document.createElement('div');
  ex.className = 'quiz-explain pop-in';
  ex.innerHTML = `
    <span class="verdict" style="color:${correct ? 'var(--bull)' : 'var(--bear)'}">${
      correct ? (fast ? 'Critical hit — fast and correct.' : 'Direct hit.') : `${b.boss.name} strikes back.`}</span>
    ${r.explain}
    <button class="btn ${dead || last ? 'btn-danger' : 'btn-primary'} btn-block mt-4" id="boss-next-btn">${
      dead ? 'Face the outcome' : last ? 'Finish the battle' : 'Next round'}</button>`;
  opts.appendChild(ex);
  const nextBtn = ex.querySelector('#boss-next-btn');
  nextBtn.focus();
  nextBtn.addEventListener('click', () => {
    if (dead) endBattle(false);
    else if (last) endBattle(true);
    else { b.round++; renderRound(); }
  });
}

/* ------------------------------------------------------------------ */
/* Endings                                                             */
/* ------------------------------------------------------------------ */

function endBattle(victory) {
  const b = battle;
  destroyStageEngine();
  const stage = $('boss-stage');

  if (!victory) {
    stage.innerHTML = `
      <div class="boss-end">
        <h3 class="t-bear">Defeated</h3>
        <p>${b.boss.defeat}</p>
        <div class="row mt-5" style="justify-content:center;gap:var(--sp-3)">
          <button class="btn btn-danger btn-lg" id="boss-retry-btn">Retry the battle</button>
          <button class="btn btn-ghost btn-lg" id="boss-flee-btn">Back to boss select</button>
        </div>
      </div>`;
    $('boss-retry-btn').addEventListener('click', () => startBattle(b.boss));
    $('boss-flee-btn').addEventListener('click', exitArena);
    return;
  }

  const firstKill = !state.bossesDefeated.includes(b.boss.id);
  const flawless = b.playerHp === b.boss.playerHp;
  // The victory panel gets the screen to itself: every ceremony (level-up,
  // trader, relic) queues until "Collect and return" is clicked.
  holdCelebrations();
  defeatBoss(b.boss.id);
  confettiBurst({ count: 110 });
  const res = awardXP(firstKill ? b.boss.rewards.xp : Math.round(b.boss.rewards.xp * 0.3), ['boss']);
  // Item first so stat-based drop checks below see it as already owned (no
  // double award).
  if (firstKill && b.boss.rewards.itemId) awardItem(b.boss.rewards.itemId);
  if (firstKill && b.boss.rewards.characterId) unlockCharacterCeremony(b.boss.rewards.characterId);

  stage.innerHTML = `
    <div class="boss-end">
      <h3 class="t-grad">Victory</h3>
      <p>${b.boss.victory}</p>
      <div class="scenario-badges mt-4" style="justify-content:center">
        <span class="badge badge-bull">+${res.amount} XP${firstKill ? '' : ' (rematch rate)'}</span>
        ${flawless ? '<span class="badge badge-warn">Flawless — no rounds lost</span>' : ''}
      </div>
      <button class="btn btn-primary btn-lg mt-5" id="boss-done-btn">Collect and return</button>
    </div>`;

  grantAchievementChecked('first-boss');
  if (flawless) grantAchievementChecked(`flawless-${b.boss.id}`);
  if (bosses.every((x) => state.bossesDefeated.includes(x.id))) grantAchievementChecked('all-bosses');

  checkUnlocks();
  checkItemDrops();

  $('boss-done-btn').addEventListener('click', () => {
    exitArena();
    if (firstKill) toast(`${b.boss.name} defeated — the next demon awaits`, 'success', 3600);
  });
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

export function initBoss() {
  refreshBossGrid();
  $('boss-exit').addEventListener('click', exitArena);
  document.addEventListener('screenchange', (e) => {
    if (e.detail.screen === 'bosses' && !battle) refreshBossGrid();
    // leaving mid-battle forfeits nothing; arena stays for return
  });
}
