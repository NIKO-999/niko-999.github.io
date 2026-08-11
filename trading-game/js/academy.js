/**
 * academy.js — Academy mode: track browser, lesson renderer, check quizzes.
 *
 * Public API:
 *   initAcademy() — render tracks, wire navigation. Call once at boot.
 *   refreshAcademy() — re-render track progress (e.g. after import/reset).
 */

import { tracks, lessons } from '../data/lessons.js';
import { isLessonDone, setLessonDone } from './state.js';
import { toast } from './ui.js';
import { awardXP, grantAchievementChecked, checkItemDrops } from './meta.js';

const $ = (id) => document.getElementById(id);
const ROMAN = { v1: 'I', v2: 'II', gxt: 'III' };

const ordered = [...lessons].sort((a, b) => {
  const t = ['v1', 'v2', 'gxt'];
  return t.indexOf(a.track) - t.indexOf(b.track) || a.order - b.order;
});

let currentLesson = null;

/* ------------------------------------------------------------------ */
/* Track list                                                          */
/* ------------------------------------------------------------------ */

function trackProgress(trackId) {
  const ls = lessons.filter((l) => l.track === trackId);
  const done = ls.filter((l) => isLessonDone(l.id)).length;
  return { done, total: ls.length, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
}

function renderTracks() {
  const list = $('academy-track-list');
  list.replaceChildren();
  for (const tr of tracks) {
    const p = trackProgress(tr.id);
    const card = document.createElement('article');
    card.className = 'track-card glass';
    card.innerHTML = `
      <span class="badge badge-accent">Track ${ROMAN[tr.id] || ''}</span>
      <h3 class="t-h2 mt-2">${tr.title}</h3>
      <p class="t-sm mt-2">${tr.description}</p>
      <div class="bar" role="progressbar" aria-label="${tr.title} progress" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="bar-fill" style="width:${p.pct}%"></div>
      </div>
      <p class="t-xs mt-2" style="color:var(--text-dim)">${p.done} / ${p.total} lessons complete</p>
      <div class="lesson-list"></div>`;
    const listEl = card.querySelector('.lesson-list');
    for (const l of lessons.filter((x) => x.track === tr.id).sort((a, b) => a.order - b.order)) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = `lesson-row${isLessonDone(l.id) ? ' done' : ''}`;
      row.innerHTML = `
        <span class="lesson-check" aria-hidden="true">${isLessonDone(l.id)
          ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12.5 9.5 18 20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : `<span class="t-xs t-num">${l.order}</span>`}</span>
        <span class="grow" style="text-align:left">${l.title}</span>
        <span class="t-xs t-num lesson-mins" style="color:var(--text-dim)">${l.minutes} min</span>`;
      row.addEventListener('click', () => openLesson(l.id));
      listEl.appendChild(row);
    }
    list.appendChild(card);
  }
}

/* ------------------------------------------------------------------ */
/* Lesson renderer                                                     */
/* ------------------------------------------------------------------ */

function blockHTML(b) {
  switch (b.type) {
    case 'text': return `<p class="lesson-text">${b.html}</p>`;
    case 'callout': return `<div class="lesson-callout"><span class="callout-title">${b.title}</span>${b.html}</div>`;
    case 'rule': return `<div class="lesson-rule">${b.html}</div>`;
    case 'keypoints':
      return `<ul class="lesson-keypoints">${b.points.map((p) => `<li>${p}</li>`).join('')}</ul>`;
    case 'image':
      return `<figure class="lesson-figure">
        <img class="lesson-img" src="${b.src}" alt="${(b.caption || 'Framework chart diagram').replace(/"/g, '&quot;')}" loading="lazy">
        <figcaption>${b.caption || ''}</figcaption>
      </figure>`;
    default: return '';
  }
}

function openLesson(id) {
  const lesson = ordered.find((l) => l.id === id);
  if (!lesson) return;
  currentLesson = lesson;
  const track = tracks.find((t) => t.id === lesson.track);
  $('academy-track-list').classList.add('hidden');
  const head = document.querySelector('#screen-academy .screen-head');
  if (head) head.classList.add('hidden');
  const view = $('academy-lesson-view');
  view.classList.remove('hidden');

  const content = $('academy-lesson-content');
  content.innerHTML = `
    <div class="lesson-meta">
      <span class="badge badge-accent">Track ${ROMAN[lesson.track]}</span>
      <span class="badge">${lesson.minutes} min read</span>
      ${isLessonDone(lesson.id) ? '<span class="badge badge-bull">Completed</span>' : ''}
    </div>
    <h2 class="t-h1 mt-4">${lesson.title}</h2>
    <p class="t-xs mt-2" style="color:var(--text-dim)">${track ? track.title : ''}</p>
    ${lesson.sections.map((s) => `
      <section class="lesson-section">
        <h3>${s.heading}</h3>
        ${s.blocks.map(blockHTML).join('')}
      </section>`).join('')}
    <div class="lesson-quiz" id="lesson-quiz"></div>`;

  renderLessonQuiz(lesson);
  updateLessonNav(lesson);
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function updateLessonNav(lesson) {
  const idx = ordered.indexOf(lesson);
  const prevBtn = $('lesson-prev');
  const nextBtn = $('lesson-next');
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx >= ordered.length - 1;
  prevBtn.onclick = () => { if (idx > 0) openLesson(ordered[idx - 1].id); };
  nextBtn.onclick = () => { if (idx < ordered.length - 1) openLesson(ordered[idx + 1].id); };
  nextBtn.textContent = idx < ordered.length - 1 ? `Next: ${ordered[idx + 1].title} →` : 'Curriculum complete';
}

/* ------------------------------------------------------------------ */
/* End-of-lesson quiz                                                  */
/* ------------------------------------------------------------------ */

function renderLessonQuiz(lesson) {
  const host = $('lesson-quiz');
  const answered = new Array(lesson.quiz.length).fill(null); // true/false per question
  host.innerHTML = `
    <p class="t-label">Check quiz</p>
    <h3 class="t-h2 mt-2">Prove it before you move on</h3>`;

  lesson.quiz.forEach((q, qi) => {
    const qEl = document.createElement('div');
    qEl.className = 'lesson-q';
    qEl.innerHTML = `<p class="lesson-q-prompt">${qi + 1}. ${q.q}</p>`;
    const opts = document.createElement('div');
    opts.className = 'quiz-options mt-2';
    q.options.forEach((opt, oi) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-option';
      b.innerHTML = `<span class="opt-key">${'ABCD'[oi]}</span><span>${opt}</span>`;
      b.addEventListener('click', () => {
        if (answered[qi] !== null) return;
        answered[qi] = oi === q.answer;
        [...opts.children].forEach((c, ci) => {
          c.disabled = true;
          if (ci === q.answer) c.classList.add('correct');
          else if (ci === oi) c.classList.add('wrong');
        });
        const ex = document.createElement('div');
        ex.className = 'lesson-q-explain';
        ex.innerHTML = `<strong style="color:${oi === q.answer ? 'var(--bull)' : 'var(--bear)'}">${oi === q.answer ? 'Correct.' : 'Not quite.'}</strong> ${q.explain}`;
        qEl.appendChild(ex);
        if (answered.every((a) => a !== null)) finishLessonQuiz(lesson, answered, host);
      });
      opts.appendChild(b);
    });
    qEl.appendChild(opts);
    host.appendChild(qEl);
  });
}

function finishLessonQuiz(lesson, answered, host) {
  const correct = answered.filter(Boolean).length;
  const total = answered.length;
  const firstTime = !isLessonDone(lesson.id);
  const base = 40 + 8 * total;
  const xpBase = firstTime ? Math.round(base * (0.5 + 0.5 * (correct / total))) : 12;
  const res = awardXP(xpBase, ['lesson']);
  setLessonDone(lesson.id);

  const banner = document.createElement('div');
  banner.className = 'lesson-done-banner pop-in';
  banner.textContent = `Lesson complete — ${correct}/${total} correct · +${res.amount} XP${firstTime ? '' : ' (review rate)'}`;
  host.appendChild(banner);
  toast(`+${res.amount} XP — ${lesson.title}`, 'xp');

  grantAchievementChecked('first-lesson');
  const trackLessons = lessons.filter((l) => l.track === lesson.track);
  if (trackLessons.every((l) => isLessonDone(l.id))) {
    grantAchievementChecked(`track-${lesson.track}`);
  }
  checkItemDrops();
  renderTracks(); // refresh ticks + progress bars behind the lesson view
  const meta = document.querySelector('#academy-lesson-content .lesson-meta');
  if (meta && !meta.querySelector('.badge-bull')) {
    meta.insertAdjacentHTML('beforeend', '<span class="badge badge-bull">Completed</span>');
  }
}

/* ------------------------------------------------------------------ */
/* Init                                                                */
/* ------------------------------------------------------------------ */

export function initAcademy() {
  renderTracks();
  $('academy-back').addEventListener('click', () => {
    $('academy-lesson-view').classList.add('hidden');
    $('academy-track-list').classList.remove('hidden');
    const head = document.querySelector('#screen-academy .screen-head');
    if (head) head.classList.remove('hidden');
    currentLesson = null;
    renderTracks();
  });
}

export function refreshAcademy() {
  renderTracks();
}
