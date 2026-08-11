/**
 * scenarios.js — Chart Scenarios mode. Picks a scenario definition from
 * data/scenarios.js, generates a matching chart via market-gen, renders it
 * with ChartEngine and grades MCQ or click-on-chart answers against the
 * generator's ground-truth meta.
 *
 * Public API:
 *   initScenarios() — wire the screen. Call once at boot.
 *   generateForScenario(sc, seed?) -> {candles, annotations, meta, smtCandles, tf}
 *     (shared with boss.js for scenario rounds)
 *   validateClick(sc, gen, click) -> bool
 */

import { scenarios } from '../data/scenarios.js';
import { ChartEngine } from './chart-engine.js';
import { generatePattern, generateCandles, mulberry32 } from './market-gen.js';
import { recordStat, state } from './state.js';
import { awardXP, bumpDaily, grantAchievementChecked, checkItemDrops, hintsLeft, useHint } from './meta.js';

const $ = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ */
/* Scenario -> generator mapping                                       */
/* ------------------------------------------------------------------ */

const TYPE_MAP = {
  swingPoint: 'swingPoint', cisd: 'cisd', fvg: 'fvg',
  londonReversal: 'londonReversal', nyReversal: 'nyReversal',
  protectedSwing: 'protectedSwing', largeOpposingRun: 'largeOpposingRun',
  continuation: 'continuation', smt: 'smt',
  ohlc: 'swingPoint', chase: 'continuation', counterTrend: 'swingPoint',
  profileExam: 'londonReversal',
};

const r2 = (x) => Math.round(x * 100) / 100;

/** Consolidation + fake breakout for the chop-trap scenario (no ground truth needed — MCQ).
    The bait candle is scaled to the coil's own range (close ~7% above the high,
    wick ~15% above) so the trap looks temptingly plausible — not like a data error. */
function genChopTrap(seed) {
  const rng = mulberry32(seed);
  const candles = generateCandles({ seed, count: 48, tf: 15, start: 480, drift: 0, vol: 0.16 });
  let hi = -Infinity, lo = Infinity;
  for (let i = 4; i < 40; i++) { hi = Math.max(hi, candles[i].h); lo = Math.min(lo, candles[i].l); }
  const range = Math.max(hi - lo, 0.4);
  // Walk price into the upper third of the coil so the poke starts close to it.
  let price = candles[38].c;
  const rampTarget = hi - range * 0.2;
  for (let i = 39; i <= 40; i++) {
    const c = candles[i];
    c.o = r2(price);
    c.c = r2(price + (rampTarget - price) * 0.55 + (rng() - 0.5) * range * 0.06);
    c.h = r2(Math.max(c.o, c.c) + rng() * range * 0.05);
    c.l = r2(Math.min(c.o, c.c) - rng() * range * 0.05);
    price = c.c;
  }
  // The bait: closes a hair above the coil high with a realistic upper wick.
  const b = candles[41];
  b.o = r2(price);
  b.c = r2(hi + range * 0.07);
  b.h = r2(hi + range * 0.15);
  b.l = r2(Math.min(b.o, b.c) - range * 0.04);
  price = b.c;
  // Fade back inside the coil — the closure had no follow-through.
  for (let i = 42; i < 48; i++) {
    const c = candles[i];
    c.o = r2(price);
    const drift = (lo + range * 0.45 - c.o) * 0.32 + (rng() - 0.5) * range * 0.08;
    c.c = r2(c.o + drift);
    c.h = r2(Math.max(c.o, c.c) + rng() * range * 0.06);
    c.l = r2(Math.min(c.o, c.c) - rng() * range * 0.06);
    price = c.c;
  }
  return {
    candles,
    annotations: [
      { type: 'zone', i1: 4, i2: 41, p1: hi, p2: lo, label: 'Consolidation' },
      { type: 'textMarker', index: 41, price: candles[41].h, text: 'Fake CISD', dir: 'up', color: '#f4506c' },
    ],
    meta: { patternType: 'chopTrap', seed, direction: 'either' },
  };
}

export function generateForScenario(sc, seed = (Math.random() * 2 ** 31) | 0) {
  if (sc.patternType === 'chopTrap') return { ...genChopTrap(seed), tf: 15 };
  const type = TYPE_MAP[sc.patternType] || 'swingPoint';
  const direction = sc.bias === 'either' ? undefined : sc.bias;
  const opts = { seed, direction };
  if (type === 'nyReversal') opts.hour = sc.id === 'sc-ny-rev-10' ? 10 : 6;
  const out = generatePattern(type, opts);
  const tf = (type === 'londonReversal' || type === 'nyReversal') ? 30 : 15;

  // sc-smt-gate teaches "no divergence = no trade": make the correlated symbol
  // confirm the sweep so the SMT panel shows NO divergence.
  if (sc.id === 'sc-smt-gate' && out.smtCandles) {
    const i = out.meta.smtIndex;
    const s = out.smtCandles;
    if (out.meta.swingType === 'high') {
      let prior = -Infinity;
      for (let k = 0; k < i; k++) prior = Math.max(prior, s[k].h);
      s[i].h = prior + 0.3;
    } else {
      let prior = Infinity;
      for (let k = 0; k < i; k++) prior = Math.min(prior, s[k].l);
      s[i].l = prior - 0.3;
    }
    out.annotations = out.annotations.filter((a) => a.type !== 'smt');
    out.meta.divergence = 'none — both symbols confirmed the sweep';
  }
  return { ...out, tf };
}

/* ------------------------------------------------------------------ */
/* Click validation against ground truth                               */
/* ------------------------------------------------------------------ */

function priceRange(candles) {
  let hi = -Infinity, lo = Infinity;
  for (const c of candles) { hi = Math.max(hi, c.h); lo = Math.min(lo, c.l); }
  return hi - lo;
}

export function validateClick(sc, gen, click) {
  const m = gen.meta;
  const range = priceRange(gen.candles) || 1;
  switch (sc.question.target) {
    case 'swing-c2':
      return Math.abs(click.candleIndex - m.c2Index) <= 1;
    case 'cisd-level':
      return Math.abs(click.price - m.cisdLevel) <= range * 0.07;
    case 'fvg-zone': {
      const pad = range * 0.03;
      const lo = Math.min(m.fvgLow, m.fvgHigh) - pad;
      const hi = Math.max(m.fvgLow, m.fvgHigh) + pad;
      return click.price >= lo && click.price <= hi;
    }
    case 'protected-low':
      return Math.abs(click.candleIndex - m.obIndex) <= 1 ||
        Math.abs(click.price - m.protectedLevel) <= range * 0.05;
    default:
      return false;
  }
}

function targetIndexOf(sc, meta) {
  switch (sc.question.target) {
    case 'swing-c2': return meta.c2Index;
    case 'cisd-level': return meta.cisdIndex;
    case 'fvg-zone': return meta.fvgIndex;
    case 'protected-low': return meta.obIndex;
    default: return meta.c2Index ?? meta.lodIndex ?? 0;
  }
}

function xpTags(sc) {
  const tags = ['scenario'];
  if (['londonReversal', 'nyReversal', 'profileExam'].includes(sc.patternType)) tags.push('time', 'session');
  if (['continuation', 'chase'].includes(sc.patternType)) tags.push('continuation');
  if (['cisd', 'chopTrap'].includes(sc.patternType)) tags.push('entries');
  if (['ohlc', 'largeOpposingRun'].includes(sc.patternType)) tags.push('bias');
  return tags;
}

/* ------------------------------------------------------------------ */
/* Mode state                                                          */
/* ------------------------------------------------------------------ */

let engine = null;
let current = null; // { sc, gen, answered }
let lastId = null;

function pickScenario() {
  const pool = scenarios.filter((s) => s.id !== lastId);
  const sc = pool[(Math.random() * pool.length) | 0];
  lastId = sc.id;
  return sc;
}

const DIFF_LABEL = { 1: 'Fundamentals', 2: 'Intermediate', 3: 'Advanced' };

function newScenario() {
  const sc = pickScenario();
  const gen = generateForScenario(sc);
  current = { sc, gen, answered: false };

  engine.opts.timeframeMinutes = gen.tf;
  engine.opts.sessions = sc.gen.sessions !== false;
  engine.clearAnnotations();
  engine.setSmtData(gen.smtCandles || null);
  engine.setData(gen.candles);

  $('scenario-kind').textContent = `${sc.title} · ${DIFF_LABEL[sc.difficulty]} · ${sc.xp} XP`;
  $('scenario-prompt').textContent = sc.setup;
  const answers = $('scenario-answers');
  answers.replaceChildren();

  if (sc.question.kind === 'mcq') {
    $('scenario-hint').textContent = sc.question.prompt;
    sc.question.options.forEach((opt, oi) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-option';
      b.style.gridColumn = '1/-1';
      b.dataset.oi = oi;
      b.innerHTML = `<span class="opt-key">${'ABCD'[oi]}</span><span>${opt}</span>`;
      b.addEventListener('click', () => answerMcq(oi));
      answers.appendChild(b);
    });
    const hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'btn btn-ghost btn-sm btn-hint';
    hintBtn.style.gridColumn = '1/-1';
    hintBtn.textContent = `50 / 50 hint (${hintsLeft()} left today)`;
    hintBtn.disabled = hintsLeft() <= 0;
    hintBtn.addEventListener('click', () => {
      if (current.answered || !useHint()) return;
      const wrong = sc.question.options.map((_, i) => i).filter((i) => i !== sc.question.answer);
      wrong.sort(() => Math.random() - 0.5).slice(0, 2).forEach((i) => {
        const el = answers.querySelector(`[data-oi="${i}"]`);
        if (el) { el.disabled = true; el.style.opacity = '0.3'; }
      });
      hintBtn.disabled = true;
      hintBtn.textContent = `50 / 50 used (${hintsLeft()} left today)`;
    });
    answers.appendChild(hintBtn);
  } else {
    $('scenario-hint').textContent = 'Click directly on the chart to answer.';
    const instr = document.createElement('div');
    instr.className = 'click-instruction';
    instr.style.gridColumn = '1/-1';
    instr.innerHTML = `<span class="pulse-dot" aria-hidden="true"></span><span>${sc.question.prompt}</span>`;
    answers.appendChild(instr);
    const giveUp = document.createElement('button');
    giveUp.type = 'button';
    giveUp.className = 'btn btn-ghost';
    giveUp.style.gridColumn = '1/-1';
    giveUp.textContent = 'Reveal the answer (no XP)';
    giveUp.addEventListener('click', () => resolve(false, { gaveUp: true }));
    answers.appendChild(giveUp);
  }
}

function answerMcq(oi) {
  if (!current || current.answered) return;
  const { sc } = current;
  const answers = $('scenario-answers');
  [...answers.querySelectorAll('.quiz-option')].forEach((c) => {
    c.disabled = true;
    const i = Number(c.dataset.oi);
    if (i === sc.question.answer) c.classList.add('correct');
    else if (i === oi) c.classList.add('wrong');
  });
  resolve(oi === sc.question.answer, {});
}

function onChartClick(click) {
  if (!current || current.answered || current.sc.question.kind !== 'chartClick') return;
  const ok = validateClick(current.sc, current.gen, click);
  engine.markRegion(click.candleIndex, ok ? 'correct' : 'incorrect');
  resolve(ok, { click });
}

function resolve(correct, { gaveUp = false } = {}) {
  if (!current || current.answered) return;
  current.answered = true;
  const { sc, gen } = current;

  // Reveal the generator's ground-truth annotations
  for (const a of gen.annotations) engine.addAnnotation(a);
  const ti = targetIndexOf(sc, gen.meta);
  if (Number.isFinite(ti)) engine.markRegion(ti, correct ? 'correct' : 'incorrect');

  recordStat('scenariosPlayed');
  let xpLine = '';
  if (gaveUp) {
    xpLine = 'Answer revealed — no XP this time.';
  } else {
    const res = awardXP(correct ? sc.xp : 6, xpTags(sc));
    xpLine = `+${res.amount} XP`;
    if (correct) {
      recordStat('scenarioCorrect');
      if ((state.stats['scenarioCorrect'] || 0) >= 10) grantAchievementChecked('scenario-10');
    }
  }

  const answers = $('scenario-answers');
  const panel = document.createElement('div');
  panel.className = `scenario-result pop-in ${correct ? 'good' : 'bad'}`;
  panel.style.gridColumn = '1/-1';
  panel.innerHTML = `
    <span class="verdict" style="color:${correct ? 'var(--bull)' : 'var(--bear)'}">${
      gaveUp ? 'Revealed.' : correct ? 'Correct read.' : 'Not this time.'}</span>
    ${sc.rationale}
    <div class="scenario-badges">
      <span class="badge ${correct ? 'badge-bull' : ''}">${xpLine}</span>
      <span class="badge">${sc.title}</span>
    </div>
    <button class="btn btn-primary btn-block mt-4" id="scenario-next-btn">Next scenario</button>`;
  answers.appendChild(panel);
  panel.querySelector('#scenario-next-btn').focus();
  panel.querySelector('#scenario-next-btn').addEventListener('click', newScenario);

  if (!gaveUp) bumpDaily('charts');
  checkItemDrops();
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

export function initScenarios() {
  engine = new ChartEngine($('scenario-canvas'), {
    timeframeMinutes: 15,
    onCandleClick: onChartClick,
  });
  $('scenario-start-btn').addEventListener('click', newScenario);
}
