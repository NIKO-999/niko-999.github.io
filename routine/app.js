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

  function renderToday() {
    rebuildIfNewDay();
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
      return '<button class="habit' + (on ? ' done' : '') + lit + '" data-habit="' + h.id + '" ' +
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
      '</button>';
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
    renderToday(); renderHabits(); renderGoals(); renderReward();
    announce(i > -1 ? 'Unmarked' : 'Done', before, levelSnapshot());
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

    const block = ev.target.closest('[data-block]');
    if (block) return toggleBlock(block.dataset.block);

    const habit = ev.target.closest('[data-habit]');
    if (habit) return toggleHabit(habit.dataset.habit);

    if (ev.target.closest('#counsel')) return advanceCounsel();
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

  /* Offline. Deferred so precaching the shell never competes with the
     first paint, and silent on failure — an app that cannot register a
     worker still works, it just needs the network. */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    setTimeout(() => { navigator.serviceWorker.register('sw.js').catch(() => {}); }, 1200);
  }

})();
