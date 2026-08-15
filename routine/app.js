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
  const P   = window.RITUAL_PHOTOS;
  const KEY = 'ritual.v1';
  const $   = (s, r = document) => r.querySelector(s);

  /* ═══════════════════════════════════════════
     STATE
     ═══════════════════════════════════════════ */

  let state = load();
  let blocks = D.buildRoutine(state.profile, new Date().getDay());

  /* The routine differs by weekday now, so a session left open across
     midnight would otherwise keep yesterday's shift on screen. */
  let blocksFor = todayKey();

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  }

  function rebuildIfNewDay() {
    const k = todayKey();
    if (k === blocksFor) return;
    blocksFor = k;
    blocks = D.buildRoutine(state.profile, new Date().getDay());
    counselIdx = -1;          // indices point into a different day's array
    counselAnchor = '';
  }

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

  /* Parse a YYYY-MM-DD key back to a local Date. Deliberately not
     new Date(str) — that parses as UTC and lands on the wrong day west of
     Greenwich, which is exactly where this is being used. */
  function dateOf(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function stepDay(key, n) {
    const d = dateOf(key);
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }

  /* ── which day is on screen ──
     The log has always been keyed by date and has always held history;
     there was simply never a way to look at any of it, and no way to fix a
     day you forgot to tick. */
  let viewDay = dayKey();
  const isToday = () => viewDay === dayKey();

  function entry(key) {
    if (!state.log[key]) state.log[key] = { blocks: [], habits: [] };
    return state.log[key];
  }
  const didHabit = (id, key) => !!(state.log[key] && state.log[key].habits.includes(id));
  const didBlock = (k, day)  => {
    const d = day || viewDay;
    return !!(state.log[d] && state.log[d].blocks.includes(k));
  };

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
     XP — derived, never stored
     ═══════════════════════════════════════════
     Every value below is recomputed from state.log, the same contract as
     goalPct(). Nothing is persisted, so there is no migration and any
     history already logged counts retroactively. An id can appear at most
     once per day in the log, so repeat-tapping can't farm XP. */

  const xpFor = (habit) => habit.needle ? D.REWARD.NEEDLE_XP : D.REWARD.BASE_XP;

  /* The most a domain can earn in one perfect day. */
  function domainCeiling(domain) {
    return state.habits
      .filter((h) => h.domain === domain)
      .reduce((sum, h) => sum + xpFor(h), 0);
  }

  /* Level cost scales with that ceiling, so a domain carrying one habit
     levels at the same pace as one carrying three. */
  function domainStep(domain) {
    const ceiling = domainCeiling(domain);
    return ceiling ? ceiling * D.REWARD.DAYS_PER_LEVEL : 0;
  }

  function domainXP(domain) {
    let xp = 0;
    for (const key in state.log) {
      const ids = state.log[key].habits || [];
      for (const id of ids) {
        const h = state.habits.find((x) => x.id === id);
        if (h && h.domain === domain) xp += xpFor(h);
      }
    }
    return xp;
  }

  function domainLevel(domain) {
    const step = domainStep(domain);
    return step ? Math.floor(domainXP(domain) / step) + 1 : 1;
  }

  /* Progress through the current level, for the bar. */
  function domainProgress(domain) {
    const step = domainStep(domain);
    if (!step) return { into: 0, step: 0, pct: 0 };
    const into = domainXP(domain) % step;
    return { into, step, pct: Math.round((into / step) * 100) };
  }

  /* Highest tier whose level threshold has been reached. */
  function tierFor(level) {
    let tier = D.REWARD.TIERS[0], index = 1;
    D.REWARD.TIERS.forEach((t, i) => {
      if (level >= t.level) { tier = t; index = i + 1; }
    });
    return { tier, index };
  }

  /* ═══════════════════════════════════════════
     COUNSEL — who speaks on Today, and what they say
     ═══════════════════════════════════════════ */

  /* How many days of history exist at all, so "never kept" can be reported
     truthfully instead of as a meaningless large number. */
  function logSpan() {
    const keys = Object.keys(state.log);
    if (!keys.length) return 0;
    const oldest = keys.sort()[0];
    const [y, m, d] = oldest.split('-').map(Number);
    const days = Math.round((Date.now() - new Date(y, m - 1, d).getTime()) / 86400000);
    return Math.max(0, Math.min(days, 400));
  }

  /* Days since any habit in this domain was last kept. A domain never kept
     at all reports the age of the log rather than infinity — total neglect
     is exactly the case the cold warning exists for, so it must not fall
     through to a neutral line. */
  function daysSinceDomain(domain) {
    const ids = state.habits.filter((h) => h.domain === domain).map((h) => h.id);
    if (!ids.length) return 0;
    const span = logSpan();
    for (let i = 0; i <= span; i++) {
      const k = shiftDay(-i);
      if (ids.some((id) => didHabit(id, k))) return i;
    }
    return span;
  }

  /* Which domain owns a block, via the habits anchored to it. Most of the
     working day has no owner — work, reset and evening carry no habit — so
     this returns null often and the caller falls back. */
  function blockDomain(key) {
    const h = state.habits.find((x) => x.anchor === key);
    return h ? h.domain : null;
  }

  const weakestDomain = () => ORDER.reduce((lo, d) =>
    domainLevel(d) < domainLevel(lo) ? d : lo, ORDER[0]);

  /* Stable within a day, different across days — so the line doesn't
     reshuffle on the 30-second tick and read as noise. */
  function pickLine(lines, salt) {
    const key = dayKey() + '|' + salt;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return lines[hash % lines.length];
  }

  /* Which block the bubble is currently describing. Starts at the block
     happening now and steps forward on tap. */
  let counselIdx = -1;
  let counselAnchor = '';   // the current block when the index was last reset

  function counselBlock() {
    const cur = currentBlock();
    const anchor = cur ? cur.key : '';

    /* Reset only when the underlying moment actually moves on. renderToday
       runs every 30 seconds; resetting on every render would snap the user
       back mid-walk and feel broken. */
    if (anchor !== counselAnchor) {
      counselAnchor = anchor;
      counselIdx = cur ? blocks.indexOf(cur) : 0;
    }
    if (counselIdx < 0 || counselIdx >= blocks.length) counselIdx = 0;
    return blocks[counselIdx] || null;
  }

  function advanceCounsel() {
    if (!blocks.length) return;
    counselIdx = (counselIdx + 1) % blocks.length;
    renderCounsel();
  }

  function counselFor(block) {
    const C = D.COUNSEL;
    const now = nowMin();
    const today = dayKey();
    if (!block) return null;

    const owned = blockDomain(block.key);
    const domain = owned || weakestDomain();
    const lines = C.LINES[domain];
    if (!lines) return null;

    const habits = state.habits.filter((h) => h.domain === domain);
    const anyDone = habits.some((h) => didHabit(h.id, today));
    const best = habits.reduce((m, h) => Math.max(m, streak(h.id)), 0);
    const cold = daysSinceDomain(domain);

    const wake = D.toMin(state.profile.wake);
    let sleep = D.toMin(state.profile.sleep);
    if (sleep <= wake) sleep += 1440;
    const through = Math.max(0, Math.min(1, (now - wake) / (sleep - wake)));

    const done   = didBlock(block.key);
    const ahead  = now < block.start;
    const past   = now >= block.end;

    /* Where the block sits relative to now decides what is worth saying.
       Blocks nobody owns fall through to the domain-level lines. */
    let cond, n = 0;
    if (!owned) {
      if (cold >= C.COLD_AFTER)                 { cond = 'cold'; n = cold; }
      else if (C.MILESTONES.includes(best))     { cond = 'streak'; n = best; }
      else if (!anyDone && through >= C.LATE_AT) cond = 'late';
      else if (anyDone)                          cond = 'done';
      else                                       cond = 'idle';
    } else if (ahead)      cond = 'next';
    else if (done)         cond = 'done';
    else if (past)         cond = 'missed';
    else                   cond = 'now';

    const line = pickLine(lines[cond], domain + ':' + block.key + ':' + cond)
      .replace('{n}', n);
    return { domain, cond, line, block, ahead, past, done };
  }

  /* The art is only replaced when the character or its tier actually
     changes. renderToday() runs every 30 seconds; re-injecting the SVG on
     each tick would restart every animation and make it visibly hitch. */
  let counselArtKey = '';

  function renderCounsel() {
    const c = counselFor(counselBlock());
    const host = $('#counsel');
    if (!c || !host) return;

    const level = domainLevel(c.domain);
    const { index } = tierFor(level);
    const artKey = c.domain + ':' + index;

    if (artKey !== counselArtKey) {
      $('#counselArt').innerHTML = window.RITUAL_CREATURES.svg(c.domain, index);
      counselArtKey = artKey;
    }

    $('#counselWho').textContent =
      D.REWARD.CHARACTERS[c.domain].name + ' · ' + D.DOMAINS[c.domain].label;
    $('#counselLine').textContent = c.line;

    const when = c.ahead ? 'Next' : c.past ? 'Earlier' : 'Now';
    $('#counselWhen').textContent =
      when + ' · ' + fmtTime(c.block.start) + ' ' + c.block.title;
    host.classList.toggle('is-ahead', !!c.ahead);
  }

  /* ═══════════════════════════════════════════
     RENDER — TODAY
     ═══════════════════════════════════════════ */

  function currentBlock() {
    const n = nowMin();
    return blocks.find((b) => n >= b.start && n < b.end) || null;
  }

  const DAY_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS   = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];

  const CAM_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M3 8.5h3.2l1.4-2h7.8l1.4 2H21v10H3z"/>' +
      '<circle cx="12" cy="13" r="3.4"/>' +
    '</svg>';

  /* The timeline for the day being viewed. A past day is rebuilt from that
     date's weekday, which the per-weekday shift work already supports. */
  let pastBlocks = null, pastBlocksFor = '';
  function dayBlocks() {
    if (isToday()) return blocks;
    if (pastBlocksFor !== viewDay) {
      pastBlocksFor = viewDay;
      pastBlocks = D.buildRoutine(state.profile, dateOf(viewDay).getDay());
    }
    return pastBlocks;
  }

  function renderToday() {
    rebuildIfNewDay();
    const live  = isToday();
    const now   = nowMin();
    const cur   = live ? currentBlock() : null;
    const d     = dateOf(viewDay);
    const bl    = dayBlocks();

    $('#view-today').classList.toggle('viewing-past', !live);

    /* header. Anything that only means something *now* — the clock, the
       current block, the progress bar — is hidden on a past day rather than
       shown with today's values against yesterday's timeline. */
    $('#heroDate').textContent = DAY_LONG[d.getDay()] + ' · ' + d.getDate() + ' ' + MONTHS[d.getMonth()];

    if (live) {
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
    } else {
      $('#heroGreet').innerHTML =
        DAY_LONG[d.getDay()] + ',<br><em>' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</em>';
    }

    $('#dayLabel').textContent = live ? 'tap to complete' : 'looking back';
    $('#dayNext').disabled = live;

    /* phase pills */
    const phases = [];
    bl.forEach((b) => { if (!phases.includes(b.phase)) phases.push(b.phase); });
    $('#phases').innerHTML = phases.map((p) => {
      const bs = bl.filter((b) => b.phase === p);
      const isNow  = live && cur && cur.phase === p;
      const isPast = !live || bs.every((b) => now >= b.end);
      return '<div class="phase ' + (isNow ? 'now' : isPast ? 'done' : '') + '">' + escapeHtml(p) + '</div>';
    }).join('');

    /* stats */
    const doneToday   = bl.filter((b) => didBlock(b.key)).length;
    const needleIds   = state.habits.filter((h) => h.needle).map((h) => h.id);
    const needleDone  = needleIds.filter((id) => didHabit(id, viewDay)).length;
    const best        = state.habits.reduce((m, h) => Math.max(m, streak(h.id)), 0);
    $('#statBlocks').innerHTML = doneToday + '<small>/' + bl.length + '</small>';
    $('#statNeedle').innerHTML = needleDone + '<small>/' + needleIds.length + '</small>';
    $('#statStreak').textContent = best;

    /* timeline */
    let html = '';
    let seamPlaced = !live;                 // no "now" marker on a past day
    bl.forEach((b) => {
      if (!seamPlaced && now < b.start) {
        html += seam();
        seamPlaced = true;
      }
      const done  = didBlock(b.key);
      const isNow = live && cur && cur.key === b.key;
      const past  = !live || now >= b.end;
      const tags  = state.habits.filter((h) => h.anchor === b.key);
      const wants = tags.length > 0;        // a block carrying a habit wants proof
      const shot  = wants ? P.url(viewDay, b.key) : null;

      /* Three states, and they must stay tellable apart: proven, done but
         unproven, and not done yet. */
      const tail = shot
        ? '<div class="block-check">✓</div>'
        : done
          ? '<div class="block-check' + (wants ? ' unverified' : '') + '">✓</div>'
          : wants
            ? '<div class="block-cam">' + CAM_ICON + '</div>'
            : '<div class="block-check">✓</div>';

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
            (shot ? '<div class="block-shot"><img src="' + shot + '" alt="" /></div>' : '') +
          '</div>' +
          tail +
        '</button>';
    });
    if (!seamPlaced) html += seam();
    $('#timeline').innerHTML = html;

    renderCounsel();
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
      const dom = D.DOMAINS[h.domain] || { label: h.domain };
      const lit = spotClass(h.domain);
      /* The habit's own block, if it has one — trading does not, which is
         exactly why the camera also lives here. */
      const anchor = h.anchor || ('habit:' + h.id);
      const shot   = P.has(today, anchor);
      return '<div class="habit-cell">' +
        '<button class="habit' + (on ? ' done' : '') + lit + '" data-habit="' + h.id + '" ' +
              'data-domain="' + h.domain + '" aria-pressed="' + on + '">' +
        '<div class="habit-top">' +
          '<div class="habit-id">' +
            '<div class="habit-name">' + escapeHtml(h.name) + '</div>' +
            '<div class="overline habit-dom">' + escapeHtml(dom.label) + '</div>' +
          '</div>' +
          '<div class="habit-dot">✓</div>' +
        '</div>' +
        '<div class="habit-streak">' +
          '<span class="habit-streak-n">' + s + '</span>' +
          '<span class="overline">day' + (s === 1 ? '' : 's') + '</span>' +
        '</div>' +
        '<div class="week">' + weekHits(h.id).map((w) =>
          '<div class="week-pip' + (w.hit ? ' hit' : '') + (w.today ? ' today' : '') + '"></div>').join('') +
        '</div>' +
      '</button>' +
      '<button class="habit-cam' + (shot ? ' shot' : '') + '" data-cam="' + escapeHtml(anchor) + '" ' +
              'aria-label="' + (shot ? 'See the photo for ' : 'Photograph ') + escapeHtml(h.name) + '">' +
        CAM_ICON +
      '</button>' +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     RENDER — GOALS
     ═══════════════════════════════════════════ */

  function renderGoals() {
    $('#goals').innerHTML = state.goals.map((g) => {
      const dom = D.DOMAINS[g.domain] || { label: g.domain };
      const pct = goalPct(g);
      const linked = g.habits
        .map((id) => state.habits.find((h) => h.id === id))
        .filter(Boolean);

      const char = D.REWARD.CHARACTERS[g.domain];
      return '<button class="goal' + (g.needle ? ' needle' : '') + '" ' +
              'data-go="reward:' + g.domain + '" ' +
              'aria-label="' + escapeHtml(g.name) + ' — see ' +
                escapeHtml(char ? char.name : dom.label) + '">' +
        '<div class="goal-top">' +
          '<div>' +
            '<div class="goal-domain">' + escapeHtml(dom.label) + '</div>' +
            '<div class="goal-name">' + escapeHtml(g.name) + '</div>' +
            '<div class="goal-why">' + escapeHtml(g.why) + '</div>' +
          '</div>' +
          '<div class="goal-pct">' + pct + '<small>%</small></div>' +
        '</div>' +
        '<div class="goal-bar"><div class="goal-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="goal-foot">' +
          (g.needle ? '<span class="needle-flag">◆ Needle mover</span>' : '') +
          linked.map((h) => '<span class="tag">' + escapeHtml(h.name) + '</span>').join('') +
        '</div>' +
      '</button>';
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
        '<div class="rem-domain-l">' +
          escapeHtml(D.DOMAINS[k].label) +
        '</div>' +
        (g ? '<div class="rem-domain-g">' + escapeHtml(g.name) + '</div>' : '') +
      '</div>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     RENDER — REWARD
     ═══════════════════════════════════════════ */

  const ORDER = ['body', 'mind', 'money', 'meaning'];

  function renderReward() {
    const levels = ORDER.map(domainLevel);
    $('#rewardTotal').textContent = levels.reduce((a, b) => a + b, 0);

    /* Name the domain that is furthest behind — the whole point of
       splitting them is to make neglect visible. With nothing behind,
       say so rather than blaming whichever happens to sort first. */
    const min = Math.min.apply(null, levels);
    const max = Math.max.apply(null, levels);
    const behind = ORDER.filter((_, i) => levels[i] === min);
    $('#rewardWeakest').textContent = (min === max)
      ? 'all even'
      : behind.map((d) => D.DOMAINS[d].label).join(' & ');

    $('#creatures').innerHTML = ORDER.map((dom) => {
      const level = domainLevel(dom);
      const { tier, index } = tierFor(level);
      const prog = domainProgress(dom);
      const char = D.REWARD.CHARACTERS[dom];

      return '<button class="crt-cell' + spotClass(dom) + '" data-domain="' + dom + '" ' +
              'data-go="habits:' + dom + '" ' +
              'aria-label="' + escapeHtml(char.name) + ' — see the ' +
                escapeHtml(D.DOMAINS[dom].label) + ' habits">' +
        '<div class="crt-art">' + window.RITUAL_CREATURES.svg(dom, index) + '</div>' +
        '<div class="crt-meta">' +
          '<div class="crt-top">' +
            '<span class="crt-name">' + escapeHtml(char.name) + '</span>' +
            '<span class="crt-lvl">' + level + '</span>' +
          '</div>' +
          '<div class="overline crt-dom">' + escapeHtml(D.DOMAINS[dom].label) + '</div>' +
          '<div class="goal-bar"><div class="goal-bar-fill" style="width:' + prog.pct + '%"></div></div>' +
          '<div class="overline crt-tier">' + escapeHtml(tier.name) + '</div>' +
        '</div>' +
      '</button>';
    }).join('');
  }

  /* ═══════════════════════════════════════════
     CROSS-LINKS — one domain, followed across tabs
     ═══════════════════════════════════════════
     The four domains were split across three tabs with no way to get from
     one view of a domain to another. A character now leads to the habits
     feeding it, and a goal leads to the character it is building. */

  let spotlight = null;    // domain arrived-at via a link, briefly highlighted
  let spotlightT;

  /* Applied while rendering, so a re-render mid-spotlight keeps it rather
     than dropping the highlight halfway through. */
  const spotClass = (domain) =>
    !spotlight ? '' : domain === spotlight ? ' spot' : ' dim';

  function clearSpotlight() {
    clearTimeout(spotlightT);
    spotlight = null;
  }

  function followDomain(view, domain) {
    clearTimeout(spotlightT);
    spotlight = domain;
    show(view);
    renderHabits(); renderReward();
    /* Self-clearing: a highlight that stayed would read as a filter with
       no visible way to switch it off. */
    spotlightT = setTimeout(() => {
      spotlight = null;
      renderHabits(); renderReward();
    }, 2800);
  }

  /* ═══════════════════════════════════════════
     INTERACTION
     ═══════════════════════════════════════════ */

  /* Levels before and after a change, so a crossing can be announced. */
  const levelSnapshot = () => ORDER.map(domainLevel);

  function announce(fallback, before, after) {
    for (let i = 0; i < ORDER.length; i++) {
      if (after[i] > before[i]) {
        const dom = ORDER[i];
        const crossed = D.REWARD.TIERS.some((t) => t.level === after[i]);
        showAscend(dom, after[i], crossed);
        pulseCreature(dom);
        return;
      }
    }
    if (fallback) toast(fallback);
  }

  /* ── the level-up moment ──
     Levels are rare — four perfect days in a domain — so this earns the
     screen. The overlay never takes pointer events, so it cannot swallow
     a tap; any tap dismisses it early and still lands on what is under it. */
  let ascendT;

  function showAscend(domain, level, crossed) {
    const host = $('#ascend');
    const char = D.REWARD.CHARACTERS[domain];
    const { tier, index } = tierFor(level);
    if (!host || !char) { toast(char ? char.name + ' — level ' + level : 'Level up'); return; }

    $('#ascendArt').innerHTML  = window.RITUAL_CREATURES.svg(domain, index);
    $('#ascendDom').textContent  = D.DOMAINS[domain].label;
    $('#ascendName').textContent = char.name;
    $('#ascendLvl').textContent  = 'Level ' + level;
    $('#ascendTier').textContent = crossed ? tier.name : '';

    host.classList.toggle('crossed', !!crossed);
    /* restart the entry animation even if one is still playing */
    host.classList.remove('on');
    void host.offsetWidth;
    host.classList.add('on');

    clearTimeout(ascendT);
    ascendT = setTimeout(hideAscend, crossed ? 3600 : 2600);
  }

  function hideAscend() {
    clearTimeout(ascendT);
    const host = $('#ascend');
    if (host) host.classList.remove('on');
  }

  /* Only worth animating if the tab is actually on screen. No badge, no
     backlog — open Reward later and it is simply already there. */
  function pulseCreature(domain) {
    if (!$('#view-reward').classList.contains('on')) return;
    const el = document.querySelector('.crt-cell[data-domain="' + domain + '"]');
    if (!el) return;
    el.classList.remove('leveled');
    void el.offsetWidth;
    el.classList.add('leveled');
  }

  function toggleBlock(key) {
    const before = levelSnapshot();
    const e = entry(viewDay);
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
    renderToday(); renderHabits(); renderGoals(); renderReward();
    announce(i > -1 ? 'Unmarked' : 'Done', before, levelSnapshot());
  }

  /* Set a block done, rather than flipping it — a photo is evidence it
     happened, so it can only ever mean done. */
  function markBlockDone(key, day) {
    const e = entry(day);
    if (e.blocks.indexOf(key) === -1) e.blocks.push(key);
    state.habits.filter((h) => h.anchor === key).forEach((h) => {
      if (e.habits.indexOf(h.id) === -1) e.habits.push(h.id);
    });
  }

  function markHabitDone(hid, day) {
    const e = entry(day);
    if (e.habits.indexOf(hid) === -1) e.habits.push(hid);
  }

  function toggleHabit(id) {
    /* acting on a habit means you have arrived — drop the arrival highlight */
    clearSpotlight();
    const before = levelSnapshot();
    const e = entry(dayKey());
    const i = e.habits.indexOf(id);
    if (i > -1) e.habits.splice(i, 1); else e.habits.push(id);
    save();
    renderHabits(); renderToday(); renderGoals(); renderReward();
    /* stays silent on an ordinary tap, speaks only on a level crossing */
    announce('', before, levelSnapshot());
  }

  /* ═══════════════════════════════════════════
     PHOTO EVIDENCE
     ═══════════════════════════════════════════
     A photo is proof, so it can only ever mean "done" — it sets completion
     rather than toggling it. Removing the photo is the inverse and clears
     the completion with it. Ticking on the Habits tab still works and
     records the same completion *without* proof, which the timeline then
     shows as unverified; that is the escape hatch for the day you genuinely
     trained and had no phone. */

  const HABIT_PREFIX = 'habit:';

  const blockTitle = (key) => {
    const b = dayBlocks().find((x) => x.key === key);
    return b ? b.title : key;
  };

  /* Which days must stay warm: the timeline's day, and today for the
     Habits tab, which always shows today regardless of the timeline. */
  const warmDays = () => [viewDay, dayKey()];

  let shotFor = null;                 // { day, key } awaiting a file

  function openCamera(day, key) {
    if (!P.supported) { toast('Photos are not available here'); return; }
    shotFor = { day: day, key: key };
    const input = $('#shotInput');
    input.value = '';                 // so re-taking the same shot still fires
    input.click();
  }

  function onShotChosen(ev) {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file || !shotFor) return;
    const t = shotFor;
    shotFor = null;

    toast('Saving…');
    P.put(t.day, t.key, file).then(() => {
      const before = levelSnapshot();
      if (t.key.indexOf(HABIT_PREFIX) === 0) markHabitDone(t.key.slice(HABIT_PREFIX.length), t.day);
      else markBlockDone(t.key, t.day);
      save();
      renderToday(); renderHabits(); renderGoals(); renderReward();
      announce('Logged', before, levelSnapshot());
    }).catch((err) => {
      /* Say which of the two it was — "something went wrong" is useless when
         one is fixable by freeing space and the other never will be. */
      toast(/unreadable|encode/.test(String(err && err.message))
        ? 'That photo could not be read'
        : 'Could not save — storage may be full');
    });
  }

  /* ── viewer ── */
  let viewing = null;

  function openViewer(day, key) {
    const url = P.url(day, key);
    if (!url) return;
    const row = P.peek(day, key);
    viewing = { day: day, key: key };

    $('#viewerImg').src = url;
    $('#viewerTitle').textContent = key.indexOf(HABIT_PREFIX) === 0
      ? habitName(key.slice(HABIT_PREFIX.length))
      : blockTitle(key);

    const d = dateOf(day);
    const at = row && row.at ? new Date(row.at) : null;
    /* abbreviated — the overline's letter-spacing wraps a full date onto two
       lines and pushes the title off the bar */
    $('#viewerWhen').textContent =
      DAY_LONG[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) +
      (at ? ' · ' + fmtTime(at.getHours() * 60 + at.getMinutes()) : '');

    $('#viewer').hidden = false;
  }

  function closeViewer() {
    $('#viewer').hidden = true;
    /* drop the decoded image rather than leaving it held by the element */
    $('#viewerImg').removeAttribute('src');
    viewing = null;
  }

  const habitName = (hid) => {
    const h = state.habits.find((x) => x.id === hid);
    return h ? h.name : 'Photo';
  };

  function removeShot() {
    if (!viewing) return;
    const t = viewing;
    closeViewer();
    P.del(t.day, t.key).then(() => {
      const e = entry(t.day);
      if (t.key.indexOf(HABIT_PREFIX) === 0) {
        const hid = t.key.slice(HABIT_PREFIX.length);
        const j = e.habits.indexOf(hid);
        if (j > -1) e.habits.splice(j, 1);
      } else {
        const i = e.blocks.indexOf(t.key);
        if (i > -1) e.blocks.splice(i, 1);
        state.habits.filter((h) => h.anchor === t.key).forEach((h) => {
          const j = e.habits.indexOf(h.id);
          if (j > -1) e.habits.splice(j, 1);
        });
      }
      save();
      renderToday(); renderHabits(); renderGoals(); renderReward();
      toast('Removed');
    }).catch(() => toast('Could not remove that photo'));
  }

  /* ── the day pager ── */
  function goDay(n) {
    /* YYYY-MM-DD compares correctly as a string, and the future is not
       something you can have done yet. */
    const next = stepDay(viewDay, n);
    if (next > dayKey()) return;
    viewDay = next;
    P.releaseExcept(warmDays());
    P.warm(viewDay).then(() => { renderToday(); renderHabits(); });
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
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  /* The sheet edits the shift for *this weekday*. A shift pattern isn't one
     time, and editing the day you're looking at is also how an occasional
     extra shift gets added without a separate screen for it. */
  function openSetup() {
    const wd = new Date().getDay();
    const sh = D.shiftFor(state.profile, wd);
    $('#inName').value    = state.profile.name;
    $('#inWake').value    = state.profile.wake;
    $('#inWorkout').value = state.profile.workout;
    $('#inSleep').value   = state.profile.sleep;
    $('#inWs').value      = sh ? sh.start : '';
    $('#inWe').value      = sh ? sh.end   : '';
    $('#shiftDay').textContent = DAY_NAMES[wd] + '’s shift';
    $('#scrim').classList.add('on');
  }
  const closeSetup = () => $('#scrim').classList.remove('on');

  function saveSetup() {
    const wd = new Date().getDay();
    const ws = $('#inWs').value;
    const we = $('#inWe').value;

    if ((ws && !we) || (we && !ws)) { toast('Set both shift times, or neither for a day off'); return; }
    if (ws && we && D.toMin(ws) === D.toMin(we)) { toast('That shift is zero hours long'); return; }

    const p = {
      name:    ($('#inName').value || '').trim().slice(0, 40) || 'you',
      wake:    $('#inWake').value    || state.profile.wake,
      workout: $('#inWorkout').value || state.profile.workout,
      sleep:   $('#inSleep').value   || state.profile.sleep,
      week:    Object.assign({}, state.profile.week),
    };
    if (D.toMin(p.workout) < D.toMin(p.wake)) { toast('The gym can\'t be before you wake'); return; }

    p.week[wd] = (ws && we) ? { start: ws, end: we } : null;

    state.profile = p;
    state.setupDone = true;
    blocks = D.buildRoutine(p, wd);
    blocksFor = todayKey();
    counselIdx = -1; counselAnchor = '';
    save();
    closeSetup();
    renderAll();
    toast((ws && we) ? 'Day rebuilt' : 'Marked as a day off');
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

  function renderAll() { renderToday(); renderHabits(); renderGoals(); renderReminder(); renderReward(); }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */

  document.addEventListener('click', (ev) => {
    /* Any tap clears the level-up overlay early — it takes no pointer
       events, so this runs *and* the tap still reaches its real target. */
    hideAscend();

    const nav = ev.target.closest('.nav-btn');
    if (nav) {
      /* only pay for a re-render if there is actually a highlight to drop —
         renderReward re-injects four SVGs and this fires on every nav tap */
      if (spotlight) { clearSpotlight(); renderHabits(); renderReward(); }
      return show(nav.dataset.view);
    }

    /* a character → its habits, a goal → its character */
    const go = ev.target.closest('[data-go]');
    if (go) {
      const [view, domain] = go.dataset.go.split(':');
      return followDomain(view, domain);
    }

    /* the viewer sits over everything — resolve its buttons before anything
       underneath gets a look at the tap */
    if (ev.target.closest('#viewerClose'))  return closeViewer();
    if (ev.target.closest('#viewerRemove')) return removeShot();
    if (ev.target.closest('#viewerRetake')) {
      const t = viewing; closeViewer();
      if (t) openCamera(t.day, t.key);
      return;
    }

    if (ev.target.closest('#dayPrev')) return goDay(-1);
    if (ev.target.closest('#dayNext')) return goDay(1);

    /* the camera on a habit card — a sibling of the card, never a child of
       it, so this cannot also toggle the card underneath */
    const cam = ev.target.closest('[data-cam]');
    if (cam) {
      const key = cam.dataset.cam;
      const today = dayKey();
      return P.has(today, key) ? openViewer(today, key) : openCamera(today, key);
    }

    const block = ev.target.closest('[data-block]');
    if (block) {
      const key = block.dataset.block;
      /* a block carrying a habit wants proof; everything else just ticks */
      if (state.habits.some((h) => h.anchor === key)) {
        return P.has(viewDay, key) ? openViewer(viewDay, key) : openCamera(viewDay, key);
      }
      return toggleBlock(key);
    }

    const habit = ev.target.closest('[data-habit]');
    if (habit) return toggleHabit(habit.dataset.habit);

    if (ev.target.closest('#counsel')) return advanceCounsel();
    if (ev.target.closest('#btnSetup')) return openSetup();
    if (ev.target.closest('#btnSave'))  return saveSetup();
    if (ev.target.closest('#btnCancel')) return closeSetup();
    if (ev.target.id === 'scrim') return closeSetup();
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (viewing) return closeViewer();
    closeSetup();
  });

  $('#shotInput').addEventListener('change', onShotChosen);

  /* Photos are read once into memory up front, because renderToday() is
     synchronous and runs on a timer while IndexedDB is not. */
  P.persist();
  P.warm(dayKey()).then(() => { renderToday(); renderHabits(); });

  renderAll();
  show('today');
  if (!state.setupDone) setTimeout(openSetup, 700);

  /* keep the clock, now-marker and day bar honest */
  setInterval(() => { if ($('#view-today').classList.contains('on')) renderToday(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAll(); });

  /* Offline. Deferred so precaching the shell never competes with the
     first paint, and silent on failure — an app that cannot register a
     worker still works, it just needs the network. */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    setTimeout(() => { navigator.serviceWorker.register('sw.js').catch(() => {}); }, 1200);
  }

})();
