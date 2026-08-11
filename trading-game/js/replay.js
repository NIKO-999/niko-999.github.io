/**
 * replay.js — Replay Trainer: bar-by-bar playback of a generated session.
 * Player chooses Wait / Long / Short / Skip. Scored in R-multiples AND rule
 * compliance: profitable entries that break the model's rules (before 8:00 AM,
 * after 11:00 AM, no SMT present) score NEGATIVE — consistency over outcome.
 *
 * Public API:
 *   initReplay() — wire the screen. Call once at boot.
 */

import { ChartEngine, minutesToClock } from './chart-engine.js';
import { generatePattern } from './market-gen.js';
import { recordStat, state } from './state.js';
import { toast, openModal, animateNumber, confettiBurst } from './ui.js';
import { awardXP, getEffects, bumpDaily, grantAchievementChecked, checkItemDrops } from './meta.js';

const $ = (id) => document.getElementById(id);

const T_0800 = 840;   // minutes since 18:00 NY
const T_1100 = 1020;
const SPEEDS = [1100, 650, 320];
const SPEED_LABELS = ['1×', '2×', '4×'];

let engine = null;
let s = null; // session state
let timer = 0;

/* ------------------------------------------------------------------ */
/* Session setup                                                       */
/* ------------------------------------------------------------------ */

function newSession() {
  const kind = Math.random() < 0.5 ? 'londonReversal' : 'nyReversal';
  const opts = { seed: (Math.random() * 2 ** 31) | 0 };
  if (kind === 'nyReversal') opts.hour = Math.random() < 0.5 ? 6 : 10;
  const gen = generatePattern(kind, opts);
  s = {
    gen,
    kind,
    smtPresent: Math.random() < 0.72,
    smtAnnounced: false,
    cursor: 5,          // last revealed bar index
    playing: false,
    speedIdx: 0,
    position: null,     // {dir, entry, stop, target, risk, barIndex, time, violation}
    trades: [],
    totalR: 0,
    skipped: false,
    ended: false,
    forgivenessLeft: getEffects().replayForgive,
  };
  engine.opts.timeframeMinutes = 30;
  engine.opts.sessions = true;
  engine.clearAnnotations();
  engine.setSmtData(null);
  engine.setData(gen.candles);
  engine.revealUpTo(s.cursor);

  $('replay-start-btn').textContent = 'New Session';
  setRDisplay(0);
  updateClock();
  setControls(true);
  setCoach('Playback armed. The day will unfold bar by bar — remember: entries post 8:00 AM only, SMT is compulsory, nothing new after 11:00 AM.');
  $('replay-smt-chip').className = 'replay-smt';
  setPlaying(true);
}

/* ------------------------------------------------------------------ */
/* Playback                                                            */
/* ------------------------------------------------------------------ */

function setPlaying(on) {
  if (!s || s.ended) on = false;
  s && (s.playing = on);
  const btn = $('replay-play-btn');
  btn.innerHTML = on
    ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg> Pause'
    : '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13l11-6.5z"/></svg> Play';
  clearTimeout(timer);
  if (on) tick();
}

function tick() {
  clearTimeout(timer);
  if (!s || !s.playing || s.ended) return;
  timer = setTimeout(async () => {
    await step();
    tick();
  }, SPEEDS[s.speedIdx]);
}

async function step() {
  if (!s || s.ended) return;
  if (s.cursor >= s.gen.candles.length - 1) { endSession(); return; }
  s.cursor++;
  await engine.animateAppend();
  updateClock();
  onBarClose(s.cursor);
}

function updateClock() {
  const c = s.gen.candles[Math.min(s.cursor, s.gen.candles.length - 1)];
  $('replay-clock').textContent = `${minutesToClock(c.t)} NY`;
}

function onBarClose(i) {
  const c = s.gen.candles[i];
  const m = s.gen.meta;

  // SMT check becomes known once the session's reversal bar prints
  const revealIdx = m.sweepIndex ?? m.reversalIndex ?? m.lodIndex;
  if (!s.smtAnnounced && i >= revealIdx) {
    s.smtAnnounced = true;
    const chip = $('replay-smt-chip');
    chip.classList.add('show', s.smtPresent ? 'present' : 'absent');
    chip.textContent = s.smtPresent
      ? 'SMT check at the sweep: divergence PRESENT'
      : 'SMT check at the sweep: NO divergence';
    setCoach(s.smtPresent
      ? `The ${m.reversalTime || 'session'} sweep printed with SMT divergence against the correlated symbol. If the window is right, the model is open for business.`
      : 'The sweep printed but the correlated symbol confirmed it — no divergence. The model says: no SMT, no trade. Waiting IS the trade today.');
  }

  // Manage open position
  if (s.position) {
    const p = s.position;
    let exitR = null, exitReason = '';
    if (p.dir === 'long') {
      if (c.l <= p.stop) { exitR = -1; exitReason = 'stopped out'; }
      else if (c.h >= p.target) { exitR = 2; exitReason = 'target hit'; }
    } else {
      if (c.h >= p.stop) { exitR = -1; exitReason = 'stopped out'; }
      else if (c.l <= p.target) { exitR = 2; exitReason = 'target hit'; }
    }
    if (i >= s.gen.candles.length - 1 && exitR === null) {
      const raw = p.dir === 'long' ? (c.c - p.entry) / p.risk : (p.entry - c.c) / p.risk;
      exitR = Math.max(-1, Math.min(3, Math.round(raw * 100) / 100));
      exitReason = 'closed at end of day';
    }
    if (exitR !== null) closeTrade(exitR, exitReason, i);
  }
}

/* ------------------------------------------------------------------ */
/* Trading                                                             */
/* ------------------------------------------------------------------ */

function ruleViolation(t) {
  if (t < T_0800) return { code: 'before-8', label: 'Entry before 8:00 AM', rule: 'V1: “Entries should be post 8:00 AM.”' };
  if (t >= T_1100) return { code: 'after-11', label: 'Entry after 11:00 AM', rule: 'V1: “No trades post 11:00 AM.”' };
  if (!s.smtPresent) return { code: 'no-smt', label: 'No SMT divergence present', rule: 'V1: “SMT divergence is compulsory. No SMT → No trade.”' };
  return null;
}

function enter(dir) {
  if (!s || s.ended || s.position) return;
  const i = s.cursor;
  const c = s.gen.candles[i];
  const look = s.gen.candles.slice(Math.max(0, i - 5), i + 1);
  const entry = c.c;
  let stop, risk;
  if (dir === 'long') {
    stop = Math.min(...look.map((x) => x.l)) - 0.05;
    risk = Math.max(0.15, entry - stop);
    stop = entry - risk;
  } else {
    stop = Math.max(...look.map((x) => x.h)) + 0.05;
    risk = Math.max(0.15, stop - entry);
    stop = entry + risk;
  }
  const target = dir === 'long' ? entry + risk * 2 : entry - risk * 2;
  const violation = ruleViolation(c.t);
  s.position = { dir, entry, stop, target, risk, barIndex: i, time: c.t, violation };

  engine.addAnnotation({ type: 'levelLine', price: entry, i1: i, label: `${dir === 'long' ? 'Long' : 'Short'} ${entry.toFixed(2)}`, color: dir === 'long' ? '#2dd4a7' : '#f4506c' });
  engine.addAnnotation({ type: 'levelLine', price: stop, i1: i, label: 'Stop', color: '#f4506c' });
  engine.addAnnotation({ type: 'levelLine', price: target, i1: i, label: '2R target', color: '#38bdf8' });

  if (violation) {
    setCoach(`Position opened — but flagged: ${violation.label}. ${violation.rule} However this bar resolves, a rule break is a losing habit.`);
  } else {
    setCoach(`${dir === 'long' ? 'Long' : 'Short'} from ${entry.toFixed(2)}, stop at ${stop.toFixed(2)}, 2R target at ${target.toFixed(2)}. Now the market grades your patience.`);
  }
  updateControls();
}

function closeTrade(rawR, reason, barIndex) {
  const p = s.position;
  s.position = null;
  let scoredR = rawR;
  let forgiven = false;
  if (p.violation) {
    if (s.forgivenessLeft > 0) {
      s.forgivenessLeft--;
      forgiven = true;
    } else {
      scoredR = -1; // consistency over outcome
    }
  }
  s.trades.push({ ...p, rawR, scoredR, reason, exitBar: barIndex, forgiven });
  s.totalR = Math.round((s.totalR + scoredR) * 100) / 100;
  setRDisplay(s.totalR);
  engine.markRegion(barIndex, scoredR >= 0 ? 'correct' : 'incorrect');

  if (p.violation && !forgiven) {
    const wouldHave = rawR > 0 ? ` The trade actually made +${rawR.toFixed(2)}R — and it still scores -1R.` : '';
    setCoach(`RULE VIOLATION — ${p.violation.label}. ${p.violation.rule}${wouldHave} Mark Douglas: consistency comes from the process, not from any single outcome.`);
    toast(`Rule violation: ${p.violation.label} — scored -1.00R`, 'error', 4200);
  } else if (forgiven) {
    setCoach(`The Discipline Monk absorbs one lapse — ${p.violation.label} forgiven, actual ${rawR >= 0 ? '+' : ''}${rawR.toFixed(2)}R kept. There is no second forgiveness today.`);
  } else {
    if (rawR > 0) {
      recordStat('replayValidEntries');
      setCoach(`Trade ${reason} for +${rawR.toFixed(2)}R — taken inside the window, with SMT. That is the model working.`);
    } else {
      setCoach(`Trade ${reason} for ${rawR.toFixed(2)}R. A compliant loss is tuition, not failure — the edge plays out over a series.`);
    }
  }
  updateControls();
}

function setRDisplay(r) {
  const el = $('replay-r-total');
  el.textContent = `${r >= 0 ? '+' : ''}${r.toFixed(2)}R`;
  el.classList.toggle('pos', r > 0);
  el.classList.toggle('neg', r < 0);
}

function setCoach(msg) {
  $('replay-feedback-text').textContent = msg;
}

/* ------------------------------------------------------------------ */
/* Session end                                                         */
/* ------------------------------------------------------------------ */

function skipDay() {
  if (!s || s.ended) return;
  s.skipped = s.trades.length === 0 && !s.position;
  setPlaying(false);
  engine.revealAll();
  while (s.cursor < s.gen.candles.length - 1) {
    s.cursor++;
    onBarClose(s.cursor); // resolve any open position bar-by-bar
  }
  updateClock();
  endSession();
}

function endSession() {
  if (!s || s.ended) return;
  s.ended = true;
  setPlaying(false);
  setControls(false);
  for (const a of s.gen.annotations) engine.addAnnotation(a);

  const violations = s.trades.filter((t) => t.violation && !t.forgiven).length;
  const validWin = s.trades.some((t) => !t.violation && t.rawR > 0);
  let xp = 30 + Math.max(0, Math.round(s.totalR * 20)) + (violations === 0 ? 40 : 0) + (validWin ? 20 : 0);
  let skipNote = '';
  if (s.skipped) {
    if (!s.smtPresent) { xp = 55; skipNote = 'You skipped a day with no SMT divergence — that is exactly the discipline the model demands.'; }
    else { xp = 12; skipNote = 'You skipped, but this day offered a compliant setup with SMT. Review the reversal the annotations now show.'; }
  }
  const res = awardXP(xp, ['replay', 'session']);
  recordStat('replaySessions');
  recordStat('replayRx100', Math.round(s.totalR * 100));
  if ((state.stats['replayRx100'] || 0) >= 500) grantAchievementChecked('replay-5r');
  bumpDaily('replay');
  checkItemDrops();
  if (s.totalR > 0 && violations === 0 && !s.skipped) confettiBurst({ count: 50 });

  const m = s.gen.meta;
  const body = document.createElement('div');
  body.innerHTML = `
    <p class="t-sm" style="color:var(--text-mid);line-height:1.6">
      ${s.kind === 'londonReversal' ? 'London reversal day' : `NY reversal day (${m.reversalTime})`} —
      the ${m.reversalTime || '2:00 AM'} sweep at bar ${(m.sweepIndex ?? m.reversalIndex) + 1} set the low of day.
      SMT divergence was ${s.smtPresent ? 'present: the day was tradeable after 8:00 AM' : 'ABSENT: the only compliant action was to stand down'}.
    </p>
    <div class="result-stats mt-4" style="display:flex;gap:var(--sp-5);justify-content:center;text-align:center">
      <div><p class="t-label">Session R</p><p class="t-num" style="font-size:var(--fs-lg);font-weight:700;color:${s.totalR >= 0 ? 'var(--bull)' : 'var(--bear)'}">${s.totalR >= 0 ? '+' : ''}${s.totalR.toFixed(2)}R</p></div>
      <div><p class="t-label">Trades</p><p class="t-num" style="font-size:var(--fs-lg);font-weight:700">${s.trades.length}</p></div>
      <div><p class="t-label">Violations</p><p class="t-num" style="font-size:var(--fs-lg);font-weight:700;color:${violations ? 'var(--bear)' : 'var(--bull)'}">${violations}</p></div>
      <div><p class="t-label">XP</p><p class="t-num" style="font-size:var(--fs-lg);font-weight:700">+${res.amount}</p></div>
    </div>
    ${skipNote ? `<p class="t-sm mt-4" style="color:var(--text-mid);line-height:1.6">${skipNote}</p>` : ''}
    <div class="trade-log">${s.trades.map((t) => `
      <div class="trade-row ${t.violation && !t.forgiven ? 'violation' : ''}">
        <span class="badge ${t.dir === 'long' ? 'badge-bull' : 'badge-bear'}">${t.dir.toUpperCase()}</span>
        <span>${minutesToClock(t.time)} · ${t.reason}${t.forgiven ? ' · forgiven' : ''}</span>
        <span class="t-num" style="color:${t.scoredR >= 0 ? 'var(--bull)' : 'var(--bear)'}">${t.scoredR >= 0 ? '+' : ''}${t.scoredR.toFixed(2)}R</span>
      </div>`).join('')}</div>
    ${violations ? `<div class="violation-callout">Rule violations score -1R even when the trade wins. The account you save is your own.</div>` : ''}
    <button class="btn btn-primary btn-block mt-5" id="replay-again-btn">Run another session</button>`;
  const close = openModal({ title: 'Session debrief', body });
  body.querySelector('#replay-again-btn').addEventListener('click', () => { close(); newSession(); });
  setCoach('Session over. Start another to keep the reps coming.');
}

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

function setControls(active) {
  ['replay-wait', 'replay-long', 'replay-short', 'replay-skip'].forEach((id) => { $(id).disabled = !active; });
  $('replay-play-btn').disabled = !active;
  $('replay-speed-btn').disabled = !active;
  if (active) updateControls();
}

function updateControls() {
  const inPos = !!(s && s.position);
  $('replay-long').disabled = inPos || !s || s.ended;
  $('replay-short').disabled = inPos || !s || s.ended;
}

export function initReplay() {
  engine = new ChartEngine($('replay-canvas'), { timeframeMinutes: 30 });

  // Inject transport row (play/pause + speed) above the action buttons
  const controls = $('replay-controls');
  const transport = document.createElement('div');
  transport.className = 'replay-speed';
  transport.innerHTML = `
    <button class="btn btn-ghost btn-sm" id="replay-play-btn" disabled>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13l11-6.5z"/></svg> Play
    </button>
    <button class="btn btn-ghost btn-sm" id="replay-speed-btn" disabled aria-label="Playback speed">Speed 1×</button>`;
  controls.insertAdjacentElement('beforebegin', transport);

  // SMT status chip inside the ticker card
  const ticker = document.querySelector('.replay-ticker');
  const chip = document.createElement('div');
  chip.id = 'replay-smt-chip';
  chip.className = 'replay-smt';
  ticker.insertAdjacentElement('afterend', chip);

  $('replay-start-btn').addEventListener('click', newSession);
  $('replay-play-btn').addEventListener('click', () => setPlaying(!s.playing));
  $('replay-speed-btn').addEventListener('click', () => {
    s.speedIdx = (s.speedIdx + 1) % SPEEDS.length;
    $('replay-speed-btn').textContent = `Speed ${SPEED_LABELS[s.speedIdx]}`;
    if (s.playing) tick();
  });
  $('replay-wait').addEventListener('click', async () => { setPlaying(false); await step(); });
  $('replay-long').addEventListener('click', () => enter('long'));
  $('replay-short').addEventListener('click', () => enter('short'));
  $('replay-skip').addEventListener('click', skipDay);
  setControls(false);

  document.addEventListener('screenchange', (e) => {
    if (e.detail.screen !== 'replay' && s && s.playing) setPlaying(false);
  });
}
