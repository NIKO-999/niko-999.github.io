'use strict';

/**
 * RITUAL — app state, storage and rendering.
 *
 * Storage is local only. Everything you type stays in this browser
 * under the key below; nothing is sent anywhere and nothing personal
 * is committed to the repo.
 */

(function () {

  const D   = window.RITUAL_DATA;
  const KEY = 'ritual.v1';
  const $   = (s, r = document) => r.querySelector(s);

  /* ═══════════════════════════════════════════
     STATE
     ═══════════════════════════════════════════ */

  let state = load();
  let blocks = D.buildRoutine(state.profile);

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        return {
          profile:   Object.assign({}, D.PROFILE, s.profile || {}),
          habits:    s.habits && s.habits.length ? s.habits : D.HABITS,
          goals:     s.goals  && s.goals.length  ? s.goals  : D.GOALS,
          log:       s.log || {},
          setupDone: !!s.setupDone,
        };
      }
    } catch (e) { /* corrupt or unavailable storage — fall through to defaults */ }
    return { profile: Object.assign({}, D.PROFILE), habits: D.HABITS, goals: D.GOALS, log: {}, setupDone: false };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Could not save — storage is full or blocked'); }
  }

  /* ── dates ── */
  const dayKey = (d) => {
    const x = d || new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  };
  const shiftDay = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); };

  function entry(key) {
    if (!state.log[key]) state.log[key] = { blocks: [], habits: [] };
    return state.log[key];
  }
  const didHabit = (id, key) => !!(state.log[key] && state.log[key].habits.includes(id));
  const didBlock = (k)       => !!(state.log[dayKey()] && state.log[dayKey()].blocks.includes(k));

  /* ── clock ──
     Minutes since midnight, pushed past 1440 in the small hours so a
     wind-down block that crosses midnight still reads as "now". */
  function nowMin() {
    const d = new Date();
    const m = d.getHours() * 60 + d.getMinutes();
    return (m < 240) ? m + 1440 : m;
  }

  const fmtTime = (min) => {
    const m = ((min % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };

  /* ── streaks ──
     Counts back from today. Today not being done yet doesn't break a
     streak — the day isn't over. */
  function streak(id) {
    let n = 0;
    let i = didHabit(id, dayKey()) ? 0 : 1;
    for (; i < 400; i++) {
      if (didHabit(id, shiftDay(-i))) n++;
      else break;
    }
    return n;
  }

  function weekHits(id) {
    const out = [];
    for (let i = 6; i >= 0; i--) out.push({ hit: didHabit(id, shiftDay(-i)), today: i === 0 });
    return out;
  }

  /* Goal progress — share of the last 7 days its habits were kept. */
  function goalPct(goal) {
    const ids = goal.habits.filter((id) => state.habits.some((h) => h.id === id));
    if (!ids.length) return 0;
    let hit = 0, total = 0;
    for (let i = 0; i < 7; i++) {
      const k = shiftDay(-i);
      ids.forEach((id) => { total++; if (didHabit(id, k)) hit++; });
    }
    return Math.round((hit / total) * 100);
  }

  /* ═══════════════════════════════════════════
     RENDER — TODAY
     ═══════════════════════════════════════════ */

  function currentBlock() {
    const n = nowMin();
    return blocks.find((b) => n >= b.start && n < b.end) || null;
  }

  function renderToday() {
    const now = nowMin();
    const cur = currentBlock();
    const d   = new Date();
    const today = dayKey();

    /* header */
    const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    $('#heroDate').textContent = days[d.getDay()] + ' · ' + d.getDate() + ' ' + months[d.getMonth()];

    const hr = d.getHours();
    const greet = hr < 5 ? 'Still up' : hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    $('#heroGreet').innerHTML = greet + ',<br><em>' + escapeHtml(state.profile.name || 'you') + '</em>';
    $('#heroClock').textContent = fmtTime(d.getHours() * 60 + d.getMinutes());
    $('#heroNow').textContent = cur ? cur.title : 'Open time';

    /* day progress, wake → sleep */
    const wake = D.toMin(state.profile.wake);
    let sleep  = D.toMin(state.profile.sleep);
    if (sleep <= wake) sleep += 1440;
    const pct = Math.max(0, Math.min(100, ((now - wake) / (sleep - wake)) * 100));
    $('#dayFill').style.width = pct.toFixed(1) + '%';
    $('#dayPct').textContent  = Math.round(pct) + '% of the day';
    const left = Math.max(0, sleep - now);
    $('#dayLeft').textContent = left > 60
      ? Math.floor(left / 60) + 'h ' + (left % 60) + 'm left'
      : left + 'm left';

    /* phase pills */
    const phases = [];
    blocks.forEach((b) => { if (!phases.includes(b.phase)) phases.push(b.phase); });
    $('#phases').innerHTML = phases.map((p) => {
      const bs = blocks.filter((b) => b.phase === p);
      const isNow  = cur && cur.phase === p;
      const isPast = bs.every((b) => now >= b.end);
      return '<div class="phase ' + (isNow ? 'now' : isPast ? 'done' : '') + '">' + escapeHtml(p) + '</div>';
    }).join('');

    /* stats */
    const doneToday   = blocks.filter((b) => didBlock(b.key)).length;
    const needleIds   = state.habits.filter((h) => h.needle).map((h) => h.id);
    const needleDone  = needleIds.filter((id) => didHabit(id, today)).length;
    const best        = state.habits.reduce((m, h) => Math.max(m, streak(h.id)), 0);
    $('#statBlocks').innerHTML = doneToday + '<small>/' + blocks.length + '</small>';
    $('#statNeedle').innerHTML = needleDone + '<small>/' + needleIds.length + '</small>';
    $('#statStreak').textContent = best;

    /* timeline */
    let html = '';
    let seamPlaced = false;
    blocks.forEach((b) => {
      if (!seamPlaced && now < b.start) {
        html += seam();
        seamPlaced = true;
      }
      const done = didBlock(b.key);
      const isNow = cur && cur.key === b.key;
      const past  = now >= b.end;
      const tags  = state.habits.filter((h) => h.anchor === b.key);

      html +=
        '<button class="block ' + (isNow ? 'now ' : '') + (past && !done ? 'past ' : '') + (done ? 'done' : '') + '" ' +
                'data-block="' + b.key + '" aria-pressed="' + done + '">' +
          '<div class="block-time">' + fmtTime(b.start) + '</div>' +
          '<div class="block-body">' +
            '<div class="block-title">' + escapeHtml(b.title) + '</div>' +
            '<div class="block-sub">' + escapeHtml(b.intent) + '</div>' +
            (tags.length
              ? '<div class="block-tags">' + tags.map((h) =>
                  '<span class="tag' + (h.needle ? ' needle' : '') + '">' + escapeHtml(h.name) + '</span>').join('') +
                '</div>'
              : '') +
          '</div>' +
          '<div class="block-check">✓</div>' +
        '</button>';
    });
    if (!seamPlaced) html += seam();
    $('#timeline').innerHTML = html;
  }

  const seam = () =>
    '<div class="now-seam">' +
      '<div class="now-seam-dot"></div>' +
      '<div class="now-seam-l">NOW</div>' +
      '<div class="now-seam-rule"></div>' +
    '</div>';

  /* ═══════════════════════════════════════════
     RENDER — HABITS
     ═══════════════════════════════════════════ */

  function renderHabits() {
    const today = dayKey();
    const done = state.habits.filter((h) => didHabit(h.id, today)).length;
    $('#habitsNote').textContent = done + ' of ' + state.habits.length + ' kept today';

    $('#habits').innerHTML = state.habits.map((h) => {
      const on = didHabit(h.id, today);
      const s  = streak(h.id);
      return '<button class="habit' + (on ? ' done' : '') + '" data-habit="' + h.id + '" aria-pressed="' + on + '">' +
        '<div class="habit-top">' +
          '<div class="habit-name">' + escapeHtml(h.name) + '</div>' +
          '<div class="habit-dot">✓</div>' +
        '</div>' +
        '<div class="habit-streak">' +
          '<span class="habit-streak-n">' + s + '</span>' +
          '<span class="overline">day' + (s === 1 ? '' : 's') + '</span>' +
        '</div>' +
        '<div class="week">' + weekHits(h.id).map((w) =>
          '<div class="week-pip' + (w.hit ? ' hit' : '') + (w.today ? ' today' : '') + '"></div>').join('') +
        '</div>' +
      '</button>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     RENDER — GOALS
     ═══════════════════════════════════════════ */

  function renderGoals() {
    $('#goals').innerHTML = state.goals.map((g) => {
      const dom = D.DOMAINS[g.domain] || { label: g.domain, color: 'var(--ink-mute)' };
      const pct = goalPct(g);
      const linked = g.habits
        .map((id) => state.habits.find((h) => h.id === id))
        .filter(Boolean);

      return '<div class="goal' + (g.needle ? ' needle' : '') + '">' +
        '<div class="goal-top">' +
          '<div>' +
            '<div class="goal-domain" style="color:' + dom.color + '">' + escapeHtml(dom.label) + '</div>' +
            '<div class="goal-name">' + escapeHtml(g.name) + '</div>' +
            '<div class="goal-why">' + escapeHtml(g.why) + '</div>' +
          '</div>' +
          '<div class="goal-pct">' + pct + '<small>%</small></div>' +
        '</div>' +
        '<div class="goal-bar"><div class="goal-bar-fill" style="width:' + pct + '%;background:' + dom.color + '"></div></div>' +
        '<div class="goal-foot">' +
          (g.needle ? '<span class="needle-flag">◆ Needle mover</span>' : '') +
          linked.map((h) => '<span class="tag">' + escapeHtml(h.name) + '</span>').join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     RENDER — REMINDER
     ═══════════════════════════════════════════ */

  function renderReminder() {
    const R = D.REMINDER;
    $('#essayTitle').textContent = R.essayTitle;
    $('#essayBody').textContent  = R.essayBody;
    $('#remLabel').textContent   = R.vLabel;
    $('#remHead').textContent    = R.head;
    $('#remSub').textContent     = R.sub;
    $('#remFoot').textContent    = R.foot;

    /* The horizon is a real date, not a slogan. */
    const d = new Date();
    d.setDate(d.getDate() + 180);
    const months = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];
    $('#remDate').textContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

    /* Each domain carries whichever goal you set for it — the reminder
       is yours, not a stock quote. */
    const order = ['mind', 'money', 'body', 'meaning'];
    $('#remDomains').innerHTML = order.map((k) => {
      const g = state.goals.find((x) => x.domain === k);
      return '<div>' +
        '<div class="rem-domain-l" style="color:' + D.DOMAINS[k].color + '">' +
          escapeHtml(D.DOMAINS[k].label) +
        '</div>' +
        (g ? '<div class="rem-domain-g">' + escapeHtml(g.name) + '</div>' : '') +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     INTERACTION
     ═══════════════════════════════════════════ */

  function toggleBlock(key) {
    const e = entry(dayKey());
    const i = e.blocks.indexOf(key);
    if (i > -1) e.blocks.splice(i, 1); else e.blocks.push(key);

    /* Completing a block keeps the habits anchored to it — the whole
       point of anchoring them there. */
    const anchored = state.habits.filter((h) => h.anchor === key);
    anchored.forEach((h) => {
      const j = e.habits.indexOf(h.id);
      if (i > -1) { if (j > -1) e.habits.splice(j, 1); }
      else if (j === -1) e.habits.push(h.id);
    });

    save();
    renderToday(); renderHabits(); renderGoals();
    toast(i > -1 ? 'Unmarked' : 'Done');
  }

  function toggleHabit(id) {
    const e = entry(dayKey());
    const i = e.habits.indexOf(id);
    if (i > -1) e.habits.splice(i, 1); else e.habits.push(id);
    save();
    renderHabits(); renderToday(); renderGoals();
  }

  /* ── views ── */
  function show(view) {
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('on', v.id === 'view-' + view));
    document.querySelectorAll('.nav-btn').forEach((b) => {
      const on = b.dataset.view === view;
      b.classList.toggle('on', on);
      b.setAttribute('aria-current', on ? 'page' : 'false');
    });
    const stage = $('#view-' + view);
    if (stage) stage.scrollTop = 0;
  }

  /* ── setup sheet ── */
  function openSetup() {
    $('#inName').value    = state.profile.name;
    $('#inWake').value    = state.profile.wake;
    $('#inWorkout').value = state.profile.workout;
    $('#inWs').value      = state.profile.workStart;
    $('#inWe').value      = state.profile.workEnd;
    $('#inSleep').value   = state.profile.sleep;
    $('#scrim').classList.add('on');
  }
  const closeSetup = () => $('#scrim').classList.remove('on');

  function saveSetup() {
    const p = {
      name:      ($('#inName').value || '').trim().slice(0, 40) || 'you',
      wake:      $('#inWake').value    || state.profile.wake,
      workout:   $('#inWorkout').value || state.profile.workout,
      workStart: $('#inWs').value      || state.profile.workStart,
      workEnd:   $('#inWe').value      || state.profile.workEnd,
      sleep:     $('#inSleep').value   || state.profile.sleep,
    };
    if (D.toMin(p.workEnd) <= D.toMin(p.workStart)) { toast('Work end must be after work start'); return; }
    if (D.toMin(p.workStart) <= D.toMin(p.wake))    { toast('Wake up before work starts'); return; }
    if (D.toMin(p.workout)  <  D.toMin(p.wake))     { toast('Workout can\'t be before you wake'); return; }

    state.profile = p;
    state.setupDone = true;
    blocks = D.buildRoutine(p);
    save();
    closeSetup();
    renderAll();
    toast('Routine rebuilt');
  }

  /* ── toast ── */
  let toastT;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), 1700);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderAll() { renderToday(); renderHabits(); renderGoals(); renderReminder(); }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */

  document.addEventListener('click', (ev) => {
    const nav = ev.target.closest('.nav-btn');
    if (nav) return show(nav.dataset.view);

    const block = ev.target.closest('[data-block]');
    if (block) return toggleBlock(block.dataset.block);

    const habit = ev.target.closest('[data-habit]');
    if (habit) return toggleHabit(habit.dataset.habit);

    if (ev.target.closest('#btnSetup')) return openSetup();
    if (ev.target.closest('#btnSave'))  return saveSetup();
    if (ev.target.closest('#btnCancel')) return closeSetup();
    if (ev.target.id === 'scrim') return closeSetup();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeSetup();
  });

  renderAll();
  show('today');
  if (!state.setupDone) setTimeout(openSetup, 700);

  /* keep the clock, now-marker and day bar honest */
  setInterval(() => { if ($('#view-today').classList.contains('on')) renderToday(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAll(); });

})();
