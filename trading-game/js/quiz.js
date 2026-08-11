/**
 * quiz.js — Quiz Gauntlet: 10 timed questions, difficulty ramp, streak
 * multiplier, 50/50 hints, streak-shield support, results screen.
 *
 * Public API:
 *   initQuiz() — wire the screen. Call once at boot.
 */

import { quizbank } from '../data/quizbank.js';
import { recordStat, hasItem } from './state.js';
import { toast, confettiBurst, animateNumber } from './ui.js';
import { awardXP, getEffects, hintsLeft, useHint, bumpDaily, grantAchievementChecked, checkItemDrops } from './meta.js';

const $ = (id) => document.getElementById(id);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const RUN_LENGTH = 10;
const BASE_TIME = 20; // seconds per question
const XP_BY_DIFF = { novice: 8, trader: 12, master: 16 };

let run = null; // active run state
let raf = 0;

function sample(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) out.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  return out;
}

function buildRun() {
  const by = (d) => quizbank.filter((q) => q.difficulty === d);
  return [...sample(by('novice'), 4), ...sample(by('trader'), 3), ...sample(by('master'), 3)];
}

/* ------------------------------------------------------------------ */
/* Timer                                                               */
/* ------------------------------------------------------------------ */

function startTimer(seconds, onExpire) {
  const timerEl = $('quiz-timer');
  const barWrap = $('quiz-timer-bar');
  const fill = barWrap.querySelector('.fill');
  const t0 = performance.now();
  const total = seconds * 1000;
  cancelAnimationFrame(raf);
  function frame(t) {
    const left = Math.max(0, total - (t - t0));
    const secs = Math.ceil(left / 1000);
    timerEl.textContent = `0:${String(secs).padStart(2, '0')}`;
    fill.style.transform = `scaleX(${left / total})`;
    const low = left < total * 0.25;
    timerEl.classList.toggle('low', low);
    barWrap.classList.toggle('low', low);
    if (left <= 0) { onExpire(); return; }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* ------------------------------------------------------------------ */
/* Run flow                                                            */
/* ------------------------------------------------------------------ */

function startRun() {
  const fx = getEffects();
  run = {
    questions: buildRun(),
    index: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    xp: 0,
    shieldAvailable: fx.streakShield > 0 || hasItem('streak-shield'),
    shieldUsed: false,
    perQTime: BASE_TIME + fx.quizTimeBonus,
    stopTimer: null,
    answered: false,
    qStart: 0,
  };
  showQuestion();
}

function multiplier() {
  return Math.min(2, 1 + run.streak * 0.1);
}

function updateHead() {
  $('quiz-progress').textContent = `Question ${Math.min(run.index + 1, RUN_LENGTH)} / ${RUN_LENGTH}`;
  $('quiz-mult').textContent = `×${multiplier().toFixed(1)}`;
}

function showQuestion() {
  const q = run.questions[run.index];
  run.answered = false;
  run.qStart = performance.now();
  updateHead();
  $('quiz-question-text').textContent = q.question;
  const opts = $('quiz-options');
  opts.replaceChildren();

  q.options.forEach((opt, oi) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'quiz-option';
    b.dataset.oi = oi;
    b.innerHTML = `<span class="opt-key">${'ABCD'[oi]}</span><span>${opt}</span>`;
    b.addEventListener('click', () => answer(oi));
    opts.appendChild(b);
  });

  const hintBtn = document.createElement('button');
  hintBtn.type = 'button';
  hintBtn.className = 'btn btn-ghost btn-sm btn-hint mt-2';
  hintBtn.id = 'quiz-hint-btn';
  hintBtn.textContent = `50 / 50 hint (${hintsLeft()} left today)`;
  hintBtn.disabled = hintsLeft() <= 0;
  hintBtn.addEventListener('click', () => applyHint(q, hintBtn));
  opts.appendChild(hintBtn);

  run.stopTimer = startTimer(run.perQTime, () => answer(-1));
}

function applyHint(q, btn) {
  if (run.answered || !useHint()) return;
  const wrong = [0, 1, 2, 3].filter((i) => i !== q.answerIndex);
  sample(wrong, 2).forEach((i) => {
    const el = $('quiz-options').querySelector(`[data-oi="${i}"]`);
    if (el) { el.disabled = true; el.style.opacity = '0.3'; }
  });
  btn.disabled = true;
  btn.textContent = `50 / 50 used (${hintsLeft()} left today)`;
}

function answer(oi) {
  if (!run || run.answered) return;
  run.answered = true;
  if (run.stopTimer) run.stopTimer();
  const q = run.questions[run.index];
  const isCorrect = oi === q.answerIndex;
  const timeUsed = (performance.now() - run.qStart) / 1000;
  const opts = $('quiz-options');
  const hintBtn = $('quiz-hint-btn');
  if (hintBtn) hintBtn.remove();

  [...opts.children].forEach((c) => {
    c.disabled = true;
    const i = Number(c.dataset.oi);
    if (i === q.answerIndex) c.classList.add('correct');
    else if (i === oi) c.classList.add('wrong');
  });

  let shieldNote = '';
  if (isCorrect) {
    run.correct++;
    run.streak++;
    run.bestStreak = Math.max(run.bestStreak, run.streak);
    const fast = timeUsed < run.perQTime * 0.5 ? 2 : 0;
    const gained = Math.round(XP_BY_DIFF[q.difficulty] * multiplier()) + fast;
    run.xp += gained;
    recordStat(`cat:${q.category}`);
    recordStat('quizCorrect');
  } else if (run.shieldAvailable && !run.shieldUsed) {
    run.shieldUsed = true;
    shieldNote = '<span class="badge badge-warn mt-2">Streak Shield absorbed the miss — multiplier preserved</span>';
  } else {
    run.streak = 0;
  }
  updateHead();

  const ex = document.createElement('div');
  ex.className = 'quiz-explain pop-in';
  ex.innerHTML = `
    <span class="verdict" style="color:${isCorrect ? 'var(--bull)' : 'var(--bear)'}">${
      oi === -1 ? 'Time expired.' : isCorrect ? 'Correct.' : 'Wrong.'}</span>
    ${q.explanation} ${shieldNote}
    <button class="btn btn-primary btn-block mt-4" id="quiz-next-btn">${run.index + 1 >= RUN_LENGTH ? 'See results' : 'Next question'}</button>`;
  opts.appendChild(ex);
  const nextBtn = ex.querySelector('#quiz-next-btn');
  nextBtn.focus();
  nextBtn.addEventListener('click', () => {
    run.index++;
    if (run.index >= RUN_LENGTH) finishRun();
    else showQuestion();
  });
}

function finishRun() {
  const { correct, xp, bestStreak } = run;
  $('quiz-progress').textContent = 'Run complete';
  $('quiz-timer').textContent = '—';
  $('quiz-timer').classList.remove('low');
  $('quiz-timer-bar').classList.remove('low');
  $('quiz-timer-bar').querySelector('.fill').style.transform = 'scaleX(0)';

  const res = awardXP(xp || 5, ['quiz', 'time']);
  $('quiz-question-text').textContent = correct >= 8 ? 'Gauntlet crushed.' : correct >= 5 ? 'Solid run.' : 'The rules need more reps.';
  const opts = $('quiz-options');
  opts.innerHTML = `
    <div class="quiz-results pop-in" style="grid-column:1/-1">
      <div class="big-score ${correct >= 8 ? 't-grad' : ''}"><span id="quiz-final-score">0</span> / ${RUN_LENGTH}</div>
      <div class="result-stats">
        <div><p class="t-label">XP earned</p><p class="t-num" id="quiz-final-xp">0</p></div>
        <div><p class="t-label">Best streak</p><p class="t-num">${bestStreak}</p></div>
        <div><p class="t-label">Multiplier peak</p><p class="t-num">×${Math.min(2, 1 + bestStreak * 0.1).toFixed(1)}</p></div>
      </div>
      <div class="row mt-5" style="justify-content:center;gap:var(--sp-3)">
        <button class="btn btn-primary btn-lg" id="quiz-again-btn">Run it again</button>
        <button class="btn btn-ghost btn-lg" data-nav="home">Home</button>
      </div>
    </div>`;
  animateNumber($('quiz-final-score'), correct, { from: 0, ms: 800 });
  animateNumber($('quiz-final-xp'), res.amount, { from: 0, ms: 900, prefix: '+' });
  if (correct >= 8 && !reducedMotion()) confettiBurst();
  if (correct === RUN_LENGTH) grantAchievementChecked('perfect-run');
  toast(`Gauntlet complete: ${correct}/${RUN_LENGTH} · +${res.amount} XP`, 'xp', 3600);
  bumpDaily('quiz');
  checkItemDrops();
  $('quiz-again-btn').addEventListener('click', startRun);
  run = null;
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

export function initQuiz() {
  // Timer bar under the quiz head
  const head = document.querySelector('.quiz-head');
  const bar = document.createElement('div');
  bar.className = 'quiz-timer-bar';
  bar.id = 'quiz-timer-bar';
  bar.innerHTML = '<div class="fill" style="transform:scaleX(0)"></div>';
  head.insertAdjacentElement('afterend', bar);

  $('quiz-start-btn').addEventListener('click', startRun);

  // Keyboard: 1-4 / A-D answer while a question is live
  document.addEventListener('keydown', (e) => {
    if (!run || run.answered) return;
    if (document.getElementById('screen-quiz').classList.contains('active') === false) return;
    if (e.target.closest('input, textarea')) return;
    const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
    const oi = map[e.key.toLowerCase()];
    if (oi !== undefined) {
      const el = $('quiz-options').querySelector(`[data-oi="${oi}"]`);
      if (el && !el.disabled) el.click();
    }
  });

  // Leaving the screen mid-run pauses nothing but stops the timer cleanly
  document.addEventListener('screenchange', (e) => {
    if (e.detail.screen !== 'quiz' && run && run.stopTimer) {
      run.stopTimer();
      if (!run.answered) answer(-1);
    }
  });
}
