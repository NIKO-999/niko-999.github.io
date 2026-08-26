/* ═══════════════════════════════════════════════════════════════
   SCHEDULE — the week, and the sentence that fills it in.

   Standalone. Nothing here reads or writes anything belonging to
   another app on this site: one storage key, `sched.v1`, and no
   import of any kind. Everything is wrapped in this IIFE, so the only
   name that reaches the page is nothing at all.

   ── on the "backend" ──
   There isn't one, and there is nothing to build. Speech becomes text
   in the phone (SpeechRecognition, which every modern mobile browser
   ships), and text becomes a block on the rail in scParse below — a few
   hundred lines of matching, run on the device. So this app installs
   to a home screen, opens with no signal, costs nothing to host, and
   has no key that could leak.

   The one honest caveat, stated where the decision lives: dictation is
   NOT local. Chrome and Safari both send the audio to their own
   servers to transcribe it — the schedule never leaves the phone, but
   the few seconds of speech do. That is a property of the browser's
   API, not of this app, and it is why the typed field beside the
   microphone is not a fallback for old browsers but a first-class way
   in: type the same sentence, or use the keyboard's own dictation key,
   and the parser is identical.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var KEY = 'sched.v1';
  var $ = function (id) { return document.getElementById(id); };

  /* TODAY first, then the days after it. A weekly planner starts on
     Monday because you are laying a week out; a daily process is
     opened to find out what is happening now, and the answer should
     not be four screens down on a Saturday. Monday-first was the
     ordering while this was a class timetable and it is the one thing
     that did not survive becoming a day. */
  var ORDER = [1, 2, 3, 4, 5, 6, 0];
  var scWeek = function () {
    var t = new Date().getDay(), i = ORDER.indexOf(t);
    return ORDER.slice(i).concat(ORDER.slice(0, i));
  };
  var ABBR  = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var FULL  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ── the seed ──
     The day this was built around, so the first open is a week with a
     shape rather than an empty frame with instructions in it. Written
     once, on first run only — clearing everything does not bring it
     back, because a "clear" that refills itself is not one.

     The anchors are the ones already written down in this repo, in
     routine/data.js: up at 5:45, train at 6:30, down at 22:45, and a
     shift pattern that is different every day and absent on Tuesday
     and Wednesday. Everything else is laid around them. It is a
     starting shape, not a claim — every row is one tap from being
     right.

     A block CAN carry a place, and none of these do. It rides inside
     the name when there is one, rather than taking a column of its
     own — most blocks have none, and a fourth track standing empty
     all week is worse than no track. */
  var SEED = {
    title: 'Daily Process',
    sub: 'Up at 5:45 · down at 22:45',
    items: [].concat(
      /* the fixed part, which is the whole point of having one */
      [0, 1, 2, 3, 4, 5, 6].reduce(function (all, d) {
        return all.concat([
          { d: d, s: 345,  e: 375,  r: '', n: 'Wake' },
          { d: d, s: 390,  e: 450,  r: '', n: 'Train' },
          { d: d, s: 465,  e: 510,  r: '', n: 'Walk' },
          { d: d, s: 1365, e: 1380, r: '', n: 'Down' }
        ]);
      }, []),
      /* the screen time, moved to whatever the shift leaves open */
      [
        { d: 0, s: 540, e: 630, r: '', n: 'Trading' },
        { d: 1, s: 540, e: 630, r: '', n: 'Trading' },
        { d: 2, s: 540, e: 660, r: '', n: 'Trading' },
        { d: 3, s: 540, e: 660, r: '', n: 'Trading' },
        { d: 4, s: 540, e: 630, r: '', n: 'Trading' },
        { d: 5, s: 525, e: 585, r: '', n: 'Trading' },
        { d: 6, s: 525, e: 585, r: '', n: 'Trading' }
      ],
      /* the shift — different every day, and gone on the open ones */
      [
        { d: 0, s: 660, e: 1020, r: '', n: 'Work' },
        { d: 1, s: 780, e: 1260, r: '', n: 'Work' },
        { d: 4, s: 720, e: 1320, r: '', n: 'Work' },
        { d: 5, s: 600, e: 1080, r: '', n: 'Work' },
        { d: 6, s: 600, e: 1080, r: '', n: 'Work' }
      ],
      /* thirty minutes, after whatever the day turned out to be */
      [
        { d: 0, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: 1, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: 2, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: 3, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: 4, s: 1320, e: 1350, r: '', n: 'Read' },
        { d: 5, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: 6, s: 1275, e: 1305, r: '', n: 'Read' }
      ]
    )
  };

  /* ═══════════════════════════════════════════════════════════
     STORE
     ═══════════════════════════════════════════════════════════ */

  var state = null;
  var undoSnap = null;

  /* A damaged stored shape is repaired, not discarded. A bad title, or
     one unreadable row, must not cost a week's worth of building — the
     rows are independent of each other and of the header. */
  function scClean(raw) {
    var out = { title: SEED.title, sub: SEED.sub, items: [] };
    if (!raw || typeof raw !== 'object') return out;
    if (typeof raw.title === 'string') out.title = raw.title.slice(0, 60);
    if (typeof raw.sub === 'string') out.sub = raw.sub.slice(0, 90);
    var list = Array.isArray(raw.items) ? raw.items : [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      if (!it || typeof it !== 'object') continue;
      var d = +it.d, s = +it.s, e = +it.e;
      if (!(d >= 0 && d <= 6)) continue;
      if (!(s >= 0 && s < 1440) || !(e > s && e <= 1440)) continue;
      if (typeof it.n !== 'string' || !it.n.trim()) continue;
      out.items.push({
        id: typeof it.id === 'string' && it.id ? it.id : scId(),
        d: d | 0, s: s | 0, e: e | 0,
        r: typeof it.r === 'string' ? it.r.slice(0, 14) : '',
        n: it.n.trim().slice(0, 60)
      });
    }
    return out;
  }

  function scId() {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function scLoad() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (e) { raw = null; }
    if (raw === null) {
      state = scClean(SEED);
      scSave();
      return;
    }
    state = scClean(raw);
  }

  function scSave() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* Every mutation goes through here, so every mutation is undoable and
     there is no path that writes without offering the way back. */
  function scCommit(msg) {
    scSave();
    scRender();
    if (msg) scToast(msg);
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
  }

  function scMark() { undoSnap = JSON.stringify(state); }

  function scUndo() {
    if (!undoSnap) return;
    try { state = scClean(JSON.parse(undoSnap)); } catch (e) { return; }
    undoSnap = null;
    scSave();
    scRender();
    scToast('Put back');
  }

  /* ═══════════════════════════════════════════════════════════
     TIME
     ═══════════════════════════════════════════════════════════ */

  function scPad(n) { return (n < 10 ? '0' : '') + n; }

  function sc12(min) {
    var h = Math.floor(min / 60) % 24, m = min % 60;
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ':' + scPad(m);
  }

  function scMer(min) { return Math.floor(min / 60) % 24 < 12 ? 'AM' : 'PM'; }

  /* The meridiem is printed ONCE, on the end. Not a shortcut and not a
     borrowed habit from the reference: with an end time known and a
     block shorter than twelve hours, the start has one reading, so
     the second AM/PM carries no information. It costs about fifty
     pixels on a 390px screen — the difference between "Analytical
     Chemistry" on one line and on two — and the column it takes them
     from is the one holding the thing you are actually looking for.

     Where it would genuinely be ambiguous, it is not used: scRangeLong
     spells both out, and that is what goes to a screen reader and into
     the confirmation you are shown before anything is saved. */
  function scRange(s, e) { return sc12(s) + ' - ' + sc12(e) + ' ' + scMer(e); }

  function scRangeLong(s, e) {
    return sc12(s) + ' ' + scMer(s) + ' to ' + sc12(e) + ' ' + scMer(e);
  }

  function scHHMM(min) { return scPad(Math.floor(min / 60)) + ':' + scPad(min % 60); }

  function scFromHHMM(v) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(v || '').trim());
    if (!m) return null;
    var h = +m[1], mm = +m[2];
    if (h > 23 || mm > 59) return null;
    return h * 60 + mm;
  }

  function scSpan(mins) {
    if (mins < 60) return mins + ' min';
    var h = Math.floor(mins / 60), m = mins % 60;
    return h + ' h' + (m ? ' ' + m + ' m' : '');
  }

  function scNowMin() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  /* ═══════════════════════════════════════════════════════════
     THE PARSER

     One sentence in, zero or more blocks out. Everything below runs
     against a normalised copy whose LENGTH matches the original
     character for character, so a span matched on the lowercase mirror
     can be struck out of the original — which is what leaves the title
     behind with its capitals intact.
     ═══════════════════════════════════════════════════════════ */

  var DAY_WORDS = [
    [0, ['sundays', 'sunday', 'sun']],
    [1, ['mondays', 'monday', 'mon']],
    [2, ['tuesdays', 'tuesday', 'tues', 'tue']],
    [3, ['wednesdays', 'wednesday', 'weds', 'wed']],
    [4, ['thursdays', 'thursday', 'thurs', 'thur', 'thu']],
    [5, ['fridays', 'friday', 'fri']],
    [6, ['saturdays', 'saturday', 'sat']]
  ];

  var DAY_MAP = (function () {
    var m = {}, all = [];
    DAY_WORDS.forEach(function (row) {
      row[1].forEach(function (w) { m[w] = row[0]; all.push(w); });
    });
    all.sort(function (a, b) { return b.length - a.length; });
    return { map: m, re: new RegExp('\\b(' + all.join('|') + ')\\b', 'g') };
  })();

  var NUM = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12
  };
  var NUMW = Object.keys(NUM).join('|');

  /* Spoken time comes back in more shapes than typed time does. These
     run before anything else and only ever rewrite digits, so the words
     around them — the ones that become the title — are untouched. */
  function scNormalise(t) {
    var s = ' ' + t + ' ';
    var n = '(' + NUMW + '|\\d{1,2})';
    var val = function (w) { return NUM[String(w).toLowerCase()] || +w; };

    s = s.replace(new RegExp('\\bhalf past ' + n + '\\b', 'gi'),
      function (_, a) { return val(a) + ':30'; });
    s = s.replace(new RegExp('\\bquarter past ' + n + '\\b', 'gi'),
      function (_, a) { return val(a) + ':15'; });
    s = s.replace(new RegExp('\\bquarter (?:to|before) ' + n + '\\b', 'gi'),
      function (_, a) { var h = val(a) - 1; return (h < 1 ? 12 : h) + ':45'; });
    s = s.replace(new RegExp('\\b' + n + " o'?clock\\b", 'gi'),
      function (_, a) { return val(a) + ':00'; });
    s = s.replace(new RegExp('\\b' + n + '\\s+(thirty|fifteen|forty[- ]?five|forty)\\b', 'gi'),
      function (_, a, b) {
        var mm = /^thirty/i.test(b) ? '30' : /^fifteen/i.test(b) ? '15' : '45';
        return val(a) + ':' + mm;
      });
    s = s.replace(new RegExp('\\b(' + NUMW + ')\\b', 'gi'), function (w) { return val(w); });
    return s.slice(1, -1);
  }

  var HM = '(\\d{1,2}[:.]\\d{2}|\\d{3,4}|\\d{1,2})\\s*(a\\.?m\\.?|p\\.?m\\.?)?';
  var RE_RANGE = new RegExp(
    '\\b(?:from\\s+)?' + HM + '\\s*(?:-|–|—|to|till|til|until|thru|through)\\s*' + HM + '(?![\\d:])', 'g');
  var RE_AT_FOR = new RegExp(
    '\\b(?:at|starting(?:\\s+at)?|starts(?:\\s+at)?)\\s+' + HM +
    '\\s*(?:for|,)?\\s*(\\d{1,3})\\s*(hours?|hrs?|h|minutes?|mins?|m)\\b', 'g');
  var RE_AT = new RegExp('\\b(?:at|from|starting(?:\\s+at)?)\\s+' + HM + '\\b', 'g');

  function scHM(tok) {
    tok = String(tok).trim();
    var h, m = 0, c = /^(\d{1,2})[:.](\d{2})$/.exec(tok);
    if (c) { h = +c[1]; m = +c[2]; }
    else if (/^\d{3,4}$/.test(tok)) { h = +tok.slice(0, tok.length - 2); m = +tok.slice(-2); }
    else h = +tok;
    if (!(h >= 0 && h <= 24) || !(m >= 0 && m <= 59)) return null;
    return { h: h, m: m };
  }

  function sc24(h, mer) {
    if (mer === 'am') return h === 12 ? 0 : h;
    if (mer === 'pm') return h === 12 ? 12 : h + 12;
    return null;
  }

  function scMerOf(raw) {
    if (!raw) return null;
    return /^a/i.test(raw) ? 'am' : 'pm';
  }

  /* Half of every spoken time is missing its AM or PM — "one thirty to
     three" is how anybody says it. Rather than a table of rules about
     school hours, every reading that is POSSIBLE is scored and the best
     one wins: a positive duration under eight hours, starting inside
     waking hours, as short as the words allow, as early as the words
     allow. "8 to 11" comes out as the morning and "1:30 to 3" as the
     afternoon, out of the same four lines. */
  function scPick(a, b) {
    var aC = a.mer ? [sc24(a.h, a.mer)] : [sc24(a.h, 'am'), sc24(a.h, 'pm')];
    var bC = b.mer ? [sc24(b.h, b.mer)] : [sc24(b.h, 'am'), sc24(b.h, 'pm')];
    var best = null;
    for (var i = 0; i < aC.length; i++) {
      for (var j = 0; j < bC.length; j++) {
        var s = aC[i] * 60 + a.m, e = bC[j] * 60 + b.m;
        var dur = e - s;
        if (dur <= 0 || dur > 480 || e > 1440) continue;
        var score = 0;
        if (s >= 360 && s <= 1260) score += 100;   /* a waking hour */
        if (dur <= 240) score += 30;               /* a class, not a shift */
        score -= dur / 60;                         /* the tighter reading */
        score -= s / 600;                          /* the earlier one */
        if (!best || score > best.score) best = { s: s, e: e, score: score };
      }
    }
    return best;
  }

  /* A single time with no partner: same scoring, one hour long. */
  function scPickOne(a, len) {
    var aC = a.mer ? [sc24(a.h, a.mer)] : [sc24(a.h, 'am'), sc24(a.h, 'pm')];
    var best = null;
    for (var i = 0; i < aC.length; i++) {
      var s = aC[i] * 60 + a.m, e = s + len;
      if (e > 1440) continue;
      var score = (s >= 360 && s <= 1260 ? 100 : 0) - s / 600;
      if (!best || score > best.score) best = { s: s, e: e, score: score };
    }
    return best;
  }

  var ROOM_RES = [
    /\b(?:in|at)\s+(?:room|rm|lab)\.?\s*([a-z]{0,2}\d{2,5}[a-z]?)\b/g,
    /\b(?:room|rm)\.?\s*([a-z]{0,2}\d{2,5}[a-z]?)\b/g,
    /\b(?:in|at)\s+(?:the\s+)?([a-z][a-z']{1,11}\s+(?:hall|lab|laboratory|gym|gymnasium|building|bldg|centre|center|theatre|theater|annex))\b/g,
    /\b((?:soc|socio|gym|comp|sci)\s*hall)\b/g,
    /\b(?:in|at)\s+([a-z]{0,2}\d{3,5}[a-z]?)\b/g,
    /\b(\d{3,5})\b/g,
    /* A place that is a WORD rather than a code — "at the gym", "in the
       shop", "at home". Last, so a code always wins, and last for a
       second reason: it is the loosest pattern here and anything it
       claims is taken out of the name.

       It is also the normal case. Every rule above it came from a room
       number, and a day is not held in rooms — it is held in places
       that are just called what they are. */
    /\b(?:in|at)\s+(?:the\s+)?([a-z][a-z'’-]{2,14})\b/g
  ];

  /* What follows "at" is as often a time as a place, and none of these
     are somewhere you can stand. Without the list, "stretch in the
     morning" files itself under a location called Morning. */
  var NOT_A_PLACE = {
    morning: 1, afternoon: 1, evening: 1, night: 1, nights: 1, noon: 1,
    midnight: 1, midday: 1, dawn: 1, dusk: 1, weekend: 1, weekends: 1,
    weekday: 1, weekdays: 1, least: 1, most: 1, once: 1, twice: 1,
    first: 1, last: 1, start: 1, end: 1, half: 1, quarter: 1, past: 1,
    hour: 1, hours: 1, minute: 1, minutes: 1, mins: 1, same: 1, time: 1
  };

  var FILLER = {
    add: 1, adds: 1, 'new': 1, schedule: 1, scheduled: 1, put: 1, set: 1, create: 1,
    make: 1, i: 1, have: 1, ive: 1, got: 1, a: 1, an: 1, the: 1, my: 1, class: 1,
    classes: 1, subject: 1, 'for': 1, on: 1, at: 1, 'in': 1, from: 1, to: 1, and: 1,
    every: 1, each: 1, week: 1, weekly: 1, please: 1, it: 1, is: 1, called: 1,
    named: 1, entry: 1, block: 1, blocks: 1, of: 1, then: 1, also: 1, with: 1, starts: 1,
    starting: 1, start: 1, ends: 1, ending: 1, until: 1, am: 1, pm: 1, oclock: 1,
    room: 1, rm: 1, thanks: 1, please_: 1, um: 1, uh: 1
  };

  var SMALL = { and: 1, or: 1, of: 1, the: 1, to: 1, 'in': 1, 'for': 1, a: 1, an: 1, on: 1, at: 1 };

  function scTitleCase(s) {
    return s.split(/\s+/).map(function (w, i) {
      if (/[A-Z]/.test(w)) return w;                 /* already a decision — keep it */
      if (i && SMALL[w]) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  /* Strips filler from the ENDS of a run only. Stripping it everywhere
     turns "Introduction to Chemistry" into "Introduction Chemistry" —
     the words in the middle of a name are part of the name. */
  function scTrimFiller(run) {
    var w = run.split(/\s+/).filter(Boolean);
    while (w.length && FILLER[w[0].toLowerCase().replace(/[^a-z]/g, '')]) w.shift();
    while (w.length && FILLER[w[w.length - 1].toLowerCase().replace(/[^a-z]/g, '')]) w.pop();
    return w.join(' ');
  }

  function scParseOne(text) {
    var norm = scNormalise(String(text).replace(/[“”"]/g, '').trim());
    /* The mirror must be the same LENGTH, not merely lowercase — every
       span below is an index into both. Replacing only A-Z guarantees
       it where a locale-aware toLowerCase would not. */
    var low = norm.replace(/[A-Z]/g, function (c) { return c.toLowerCase(); });
    var used = new Uint8Array(norm.length);
    var mark = function (a, b) { for (var i = a; i < b; i++) used[i] = 1; };
    var free = function (a, b) {
      for (var i = a; i < b; i++) if (used[i]) return false;
      return true;
    };

    var out = { days: [], s: null, e: null, room: '', name: '', kind: 'add' };

    /* ── the verb, if there is one ── */
    var cmd = /^\s*(delete|remove|cancel|drop|clear|wipe|erase)\b/.exec(low);
    if (cmd) {
      out.kind = /^(clear|wipe|erase)$/.test(cmd[1]) ? 'clear' : 'delete';
      mark(cmd.index, cmd.index + cmd[0].length);
    }

    /* ── which days ── */
    var seen = {}, m;
    DAY_MAP.re.lastIndex = 0;
    while ((m = DAY_MAP.re.exec(low))) {
      if (!free(m.index, m.index + m[0].length)) continue;
      var d = DAY_MAP.map[m[1]];
      if (!seen[d]) { seen[d] = 1; out.days.push(d); }
      mark(m.index, m.index + m[0].length);
    }
    /* Every one of these has to be STRUCK OUT whether or not it ends up
       setting the days, because whatever is not struck out becomes the
       class name — "Calculus weekdays 10 to 11" was landing a subject
       called "Calculus Weekdays" on all five days. */
    var markAll = function (re) {
      var hit = false, mm;
      re.lastIndex = 0;
      while ((mm = re.exec(low))) {
        if (!free(mm.index, mm.index + mm[0].length)) continue;
        mark(mm.index, mm.index + mm[0].length);
        hit = true;
      }
      return hit;
    };
    var none = function () { return !out.days.length; };

    if (markAll(/\b(?:everyday|every day|daily|all week)\b/g) && none()) out.days = [1, 2, 3, 4, 5, 6, 0];
    if (markAll(/\bweekdays?\b/g) && none()) out.days = [1, 2, 3, 4, 5];
    if (markAll(/\bweekends?\b/g) && none()) out.days = [6, 0];
    if (markAll(/\btoday\b/g) && none()) out.days = [new Date().getDay()];
    if (markAll(/\btomorrow\b/g) && none()) out.days = [(new Date().getDay() + 1) % 7];
    out.days.sort(function (a, b) { return ORDER.indexOf(a) - ORDER.indexOf(b); });

    /* ── when ── */
    var span = null;
    RE_RANGE.lastIndex = 0;
    while ((m = RE_RANGE.exec(low))) {
      if (!free(m.index, m.index + m[0].length)) continue;
      var a = scHM(m[1]), b = scHM(m[3]);
      if (!a || !b) continue;
      a.mer = scMerOf(m[2]); b.mer = scMerOf(m[4]);
      span = scPick(a, b);
      if (span) { mark(m.index, m.index + m[0].length); break; }
    }
    if (!span) {
      RE_AT_FOR.lastIndex = 0;
      while ((m = RE_AT_FOR.exec(low))) {
        if (!free(m.index, m.index + m[0].length)) continue;
        var t = scHM(m[1]);
        if (!t) continue;
        t.mer = scMerOf(m[2]);
        var len = /^(h|hour|hours|hr|hrs)/.test(m[4]) ? +m[3] * 60 : +m[3];
        if (!(len > 0 && len <= 480)) continue;
        span = scPickOne(t, len);
        if (span) { mark(m.index, m.index + m[0].length); break; }
      }
    }
    if (!span) {
      RE_AT.lastIndex = 0;
      while ((m = RE_AT.exec(low))) {
        if (!free(m.index, m.index + m[0].length)) continue;
        var one = scHM(m[1]);
        if (!one) continue;
        one.mer = scMerOf(m[2]);
        span = scPickOne(one, 60);
        if (span) { mark(m.index, m.index + m[0].length); break; }
      }
    }
    if (span) { out.s = span.s; out.e = span.e; }

    /* ── where ── */
    for (var r = 0; r < ROOM_RES.length && !out.room; r++) {
      var re = ROOM_RES[r];
      re.lastIndex = 0;
      while ((m = re.exec(low))) {
        if (!free(m.index, m.index + m[0].length)) continue;
        if (NOT_A_PLACE[m[1]]) continue;
        out.room = norm.slice(m.index + m[0].indexOf(m[1]), m.index + m[0].indexOf(m[1]) + m[1].length);
        out.room = out.room.replace(/\s+/g, ' ').trim();
        if (/^[a-z ]+$/.test(out.room)) out.room = scTitleCase(out.room);
        mark(m.index, m.index + m[0].length);
        break;
      }
    }

    /* ── what is left is the name ── */
    var runs = [], cur = '';
    for (var i = 0; i < norm.length; i++) {
      if (used[i]) { if (cur.trim()) runs.push(cur); cur = ''; }
      else cur += norm[i];
    }
    if (cur.trim()) runs.push(cur);

    var parts = [];
    runs.forEach(function (run) {
      var cleaned = scTrimFiller(run.replace(/[.,!?;:]+/g, ' ').replace(/\s+/g, ' ').trim());
      if (cleaned) parts.push(cleaned);
    });
    out.name = scTitleCase(parts.join(' ').replace(/\s+/g, ' ').trim()).slice(0, 60);

    return out;
  }

  /* One utterance can carry more than one class. Split only on the
     joins that cannot be part of a day list — "and" on its own is
     "Monday and Wednesday" far more often than it is a second class. */
  function scParse(text) {
    var segs = String(text).split(/\s*(?:;|\band then\b|\balso,?\s|\bplus\b)\s*/i)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (!segs.length) return [];
    return segs.map(scParseOne);
  }

  /* What a parse still needs before it can become a row. */
  function scMissing(p) {
    if (p.kind === 'clear') return p.days.length ? null : 'which day to clear';
    if (p.kind === 'delete') return p.name ? null : 'which block to remove';
    var want = [];
    if (!p.name) want.push('what it is');
    if (!p.days.length) want.push('which day');
    if (p.s === null) want.push('what time');
    if (!want.length) return null;
    return want.length === 1 ? want[0]
      : want.slice(0, -1).join(', ') + ' and ' + want[want.length - 1];
  }

  /* ═══════════════════════════════════════════════════════════
     APPLYING A PARSE
     ═══════════════════════════════════════════════════════════ */

  function scMatches(p) {
    var needle = p.name.toLowerCase();
    return state.items.filter(function (it) {
      if (p.days.length && p.days.indexOf(it.d) < 0) return false;
      if (p.kind === 'clear') return true;
      return it.n.toLowerCase().indexOf(needle) >= 0;
    });
  }

  function scApply(list) {
    scMark();
    var added = 0, gone = 0;
    list.forEach(function (p) {
      if (p.kind === 'add') {
        p.days.forEach(function (d) {
          state.items.push({ id: scId(), d: d, s: p.s, e: p.e, r: p.room, n: p.name });
          added++;
        });
      } else {
        var kill = {};
        scMatches(p).forEach(function (it) { kill[it.id] = 1; });
        state.items = state.items.filter(function (it) {
          if (kill[it.id]) { gone++; return false; }
          return true;
        });
      }
    });
    var msg = added && gone ? added + ' added, ' + gone + ' removed'
      : added ? (added === 1 ? 'Added' : added + ' blocks added')
      : gone ? (gone === 1 ? 'Removed' : gone + ' removed')
      : 'Nothing changed';
    scCommit(msg);
  }

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */

  var painted = '';   /* the day the card was last drawn for */

  function scByDay(d) {
    return state.items.filter(function (it) { return it.d === d; })
      .sort(function (a, b) { return a.s - b.s || a.e - b.e; });
  }

  function scEl(tag, cls, txt) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (txt !== undefined) el.textContent = txt;
    return el;
  }

  function scRender() {
    var today = new Date().getDay();
    painted = new Date().toDateString();

    $('scTitle').textContent = state.title;
    $('scSub').textContent = state.sub;
    $('scSub').hidden = !state.sub;

    var rail = $('scRail');
    rail.textContent = '';

    /* A day with nothing on it is not drawn — a rail of empty cards is
       six rows of furniture. Today is the exception: the day you are in
       says so even when it is free. */
    var shown = scWeek().filter(function (d) { return scByDay(d).length || d === today; });
    $('scEmpty').hidden = state.items.length > 0 || view === 'ring';

    shown.forEach(function (d) {
      var rows = scByDay(d);
      var li = scEl('li', 'day' + (d === today ? ' is-today' : ''));
      var dn = scEl('button', 'day-name', ABBR[d]);
      dn.setAttribute('aria-label', 'Add a block on ' + FULL[d]);
      dn.addEventListener('click', function () { scEditSheet(null, d); });
      li.appendChild(dn);

      var card = scEl('div', 'day-card');

      if (!rows.length) {
        var free = scEl('button', 'row is-free');
        free.appendChild(scEl('span', 'n', 'Nothing today'));
        free.addEventListener('click', function () { scEditSheet(null, d); });
        card.appendChild(free);
      }

      rows.forEach(function (it) {
        var row = scEl('button', 'row');
        row.dataset.id = it.id;
        row.dataset.s = it.s;
        row.dataset.e = it.e;

        /* The measure: a rule as long as the block is. 52px is ten
           hours; floored at 3 because below that a rule stops being a
           mark and becomes a speck, capped at the column because ten
           hours is already the longest thing anyone puts in a day. */
        var m = scEl('i', 'm');
        m.style.width = Math.max(3, Math.min(52, (it.e - it.s) / 600 * 52)).toFixed(1) + 'px';
        row.appendChild(m);

        var n = scEl('span', 'n', it.n);
        if (it.r) n.appendChild(scEl('em', null, it.r));
        row.appendChild(n);
        row.appendChild(scEl('span', 't', scHHMM(it.s) + '\u2013' + scHHMM(it.e)));
        row.setAttribute('aria-label',
          it.n + ', ' + FULL[d] + ' ' + scRangeLong(it.s, it.e) + (it.r ? ', ' + it.r : '') + '. Edit.');
        row.addEventListener('click', function () { scEditSheet(it, d); });
        card.appendChild(row);
      });

      li.appendChild(card);
      rail.appendChild(li);
    });

    scLive();
  }

  /* The live pass touches classes and one line of text, never the DOM's
     shape — it runs every half minute, and rebuilding the card that
     often would fight a finger that is in the middle of scrolling it. */
  function scLive() {
    if (new Date().toDateString() !== painted) { scRender(); return; }

    /* The ring is a different drawing of the same half-minute pass, and
       it is the only thing on screen when it is up — so it repaints
       here and the rest of this function has nothing to do. */
    if (view === 'ring') { scPaintRing(); scPaintRingList(); return; }

    var today = new Date().getDay(), now = scNowMin();
    var rows = document.querySelectorAll('.day.is-today .row');
    var live = null;
    for (var i = 0; i < rows.length; i++) {
      var el = rows[i], s = +el.dataset.s, e = +el.dataset.e;
      if (isNaN(s)) continue;
      el.classList.toggle('is-past', e <= now);
      var on = s <= now && now < e;
      el.classList.toggle('is-now', on);
      if (on) live = el;
    }

    /* ── the hero ──
       Always the same three parts and always the same shape: a state,
       a CLOCK TIME as the figure, and what it is about underneath.

       The figure is a time rather than the countdown, which was the
       other candidate and is the more obviously useful number. A
       countdown cannot hold one shape — it is "42", then "1 h 30 m",
       then "in 2 h" — so at 58px it reflows the whole head every time
       it crosses an hour. A time is four or five glyphs forever, sets
       in tabular figures, and the duration still gets said, in the
       caption where changing width costs nothing. */
    var line = $('scLive');
    var mine = scByDay(today);
    var running = null, next = null;
    mine.forEach(function (it) {
      if (it.s <= now && now < it.e) running = it;
      else if (it.s > now && !next) next = it;
    });

    var state, at, of;
    if (running) {
      state = 'Now';
      at = running.e;
      of = running.n + ' · ' + scSpan(running.e - now) + ' left';
    } else if (next) {
      state = 'Next';
      at = next.s;
      of = next.n + ' · in ' + scSpan(next.s - now);
    } else {
      var ahead = null;
      for (var k = 1; k <= 7 && !ahead; k++) {
        var d = (today + k) % 7, list = scByDay(d);
        if (list.length) ahead = { d: d, it: list[0], k: k };
      }
      if (!ahead) { line.hidden = true; $('scLiveOf').hidden = true; return; }
      state = ahead.k === 1 ? 'Tomorrow' : FULL[ahead.d];
      at = ahead.it.s;
      of = ahead.it.n;
    }

    line.hidden = false;
    $('scLiveOf').hidden = false;
    line.classList.toggle('is-next', !running);
    $('scLiveState').textContent = running ? state + ' · until' : state;
    $('scLiveNum').textContent = sc12(at);
    $('scLiveUnit').textContent = scMer(at);
    $('scLiveOf').textContent = of;
  }

  /* ═══════════════════════════════════════════════════════════
     THE RING

     The same day the rail shows, drawn. It answers one question the
     list answers badly — how long until this is over — and it is
     scoped to TODAY on purpose: a ring is a picture of one span, and a
     list under it that runs into tomorrow is a second view wearing the
     first one's chrome.

     There is no "behind you today" line. It was there and it is gone:
     a countdown is about what is in front of you, and a figure telling
     you how much of the day you have already spent is a different
     screen's job.
     ═══════════════════════════════════════════════════════════ */

  var RING_C = 143, RING_R = 118;

  function srPol(r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return [RING_C + r * Math.cos(a), RING_C + r * Math.sin(a)];
  }

  /* A mark has to be a real unit of time or counting them is a guess.
     Fixed at 96 marks round the circle — which is what the prototype
     did — a mark is 75 seconds inside a two-hour block and seven
     minutes across a ten-hour gap, so "four marks is an hour" is true
     of nothing. The unit is picked from a ladder, the smallest that
     keeps the count under 60, and it is printed under the ring.
     No 2 in the ladder, deliberately. It fits — a two-hour block came
     out at sixty two-minute marks — but nobody thinks in two minutes,
     and sixty marks at 1.7px is close enough to a solid ring that the
     counting it exists for stops working. Every unit here is one a
     person actually says. */
  var TICK_UNITS = [1, 5, 10, 15, 30, 60];

  function scRingUnit(span) {
    for (var i = 0; i < TICK_UNITS.length; i++) {
      if (span / TICK_UNITS[i] <= 60) return TICK_UNITS[i];
    }
    return 60;
  }

  function scUnitWord(u) {
    if (u === 1) return 'a minute';
    if (u === 60) return 'an hour';
    return u + ' minutes';
  }

  /* What the ring is counting down. Three cases, and only the first is
     the obvious one:

       running   the block you are in
       waiting   the GAP to the next block — which is a span too, and
                 the reason the ring is not a dead grey circle for the
                 ten hours this week has between Trading and Read
       done      nothing left today

     A ring that only knew the first would be blank most of the day. */
  function scRingSpan() {
    var today = new Date().getDay(), now = scNowMin(), mine = scByDay(today);
    var running = null, next = null, prevEnd = 0;
    mine.forEach(function (it) {
      if (it.s <= now && now < it.e) running = it;
      else if (it.s > now && !next) next = it;
      if (it.e <= now) prevEnd = Math.max(prevEnd, it.e);
    });
    if (running) {
      return { kind: 'running', it: running, a: running.s, b: running.e,
               left: running.e - now };
    }
    if (next) {
      /* From the end of the last thing, or from the start of the day if
         nothing has run yet — never from midnight, which would put you
         40% through a wait before you woke up. */
      var from = prevEnd || Math.min(next.s, scNowMin());
      return { kind: 'waiting', it: next, a: Math.min(from, now), b: next.s,
               left: next.s - now };
    }
    return { kind: 'done' };
  }

  /* Read, not written in. The ring is SVG, and SVG presentation
     attributes take a literal — so a colour typed here is a copy of a
     token that drifts the moment the palette moves. Pulled off the
     element instead, once per paint, which is twice a minute. */
  function scInk(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function scPaintRing() {
    var svg = $('scRingSvg');
    if (!svg) return;
    var sp = scRingSpan(), now = scNowMin();
    var LIT = scInk('--red', '#e2231a'), OFF = scInk('--tick-off', '#ececec');

    $('scRing').classList.toggle('is-done', sp.kind === 'done');

    if (sp.kind === 'done') {
      svg.innerHTML = '<circle cx="' + RING_C + '" cy="' + RING_C + '" r="' + RING_R +
        '" fill="none" stroke="' + OFF + '" stroke-width="3"/>';
      $('scRingKick').textContent = 'Done';
      $('scRingNum').textContent = '—';
      $('scRingUnit').textContent = 'for today';
      $('scRingName').textContent = '';
      $('scRingKey').textContent = '';
      return;
    }

    var span = Math.max(1, sp.b - sp.a);
    var frac = Math.min(1, Math.max(0, (now - sp.a) / span));
    var unit = scRingUnit(span);
    var n = Math.max(4, Math.round(span / unit));
    /* k < remaining, NOT k >= spent. The second lights the HIGH angles,
       which is the arc running back up to twelve from the LEFT — so the
       ring counts down anti-clockwise off the same number the figure in
       the middle is counting down clockwise. It shipped that way in the
       prototype and only the screenshot said so. */
    var rem = (1 - frac) * n;

    var out = [];
    for (var k = 0; k < n; k++) {
      var deg = k / n * 360, lit = k < rem;
      var p0 = srPol(RING_R - 7, deg), p1 = srPol(RING_R + 7, deg);
      out.push('<path d="M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) +
        'L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + '" stroke="' +
        (lit ? LIT : OFF) + '" stroke-width="' +
        /* Every fourth mark heavier, so the eye counts in groups rather
           than reading a texture. */
        (k % 4 ? 1.7 : 2.8) + '"/>');
    }

    /* The leading edge — where the lit marks stop — is the only place on
       this drawing anything is going to happen, and it is the one place
       the eye has no reason to look.

       Placed on the LAST LIT MARK, not at (1-frac)·360. The raw angle is
       the boundary of the span and lands on the first UNLIT mark, a
       whole mark past the red — 30px on this ring, measured. On a
       quantised drawing the marker has to be quantised with it, or the
       two say different things about the same moment. It steps a mark
       at a time as a result, which is what the marks do. */
    var litN = Math.ceil(rem);
    var head = srPol(RING_R, (litN ? litN - 1 : 0) / n * 360);
    out.push('<circle cx="' + head[0].toFixed(2) + '" cy="' + head[1].toFixed(2) +
      '" r="4.5" fill="' + LIT + '"/>');
    if (!scStill()) {
      out.push('<circle class="sr-ping" cx="' + head[0].toFixed(2) + '" cy="' +
        head[1].toFixed(2) + '" r="9" fill="none" stroke="' + LIT + '" stroke-width="2"/>');
    }

    svg.innerHTML = out.join('');

    var f = scBigSpan(sp.left);
    $('scRingKick').textContent = sp.kind === 'running' ? 'Left of' : 'Until';
    $('scRingNum').textContent = f.n;
    $('scRingUnit').textContent = f.u;
    $('scRingName').textContent = sp.it.n;
    $('scRingKey').textContent = 'One mark is ' + scUnitWord(unit) +
      ' · ' + n + ' to go round';
  }

  /* A duration split so the unit can be set small. "1 h 30 m" is right
     in a row and wrong at 58px, where it reflows the middle of the ring
     every time it crosses an hour. */
  function scBigSpan(m) {
    if (m < 60) return { n: String(m), u: 'min' };
    var h = Math.floor(m / 60), r = m % 60;
    if (r) return { n: h + ':' + (r < 10 ? '0' : '') + r, u: 'hrs' };
    return { n: String(h), u: h === 1 ? 'hour' : 'hrs' };
  }

  function scStill() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function scPaintRingList() {
    var list = $('scRingList');
    if (!list) return;
    list.textContent = '';
    var today = new Date().getDay(), now = scNowMin();
    var sp = scRingSpan();
    var rest = scByDay(today).filter(function (it) {
      return it.s > now && !(sp.it && it.id === sp.it.id);
    });
    if (!rest.length) {
      var p = scEl('li', 'sr-none',
        sp.kind === 'done' ? 'Nothing else today.'
                           : 'Nothing else today once this is done.');
      list.appendChild(p);
      return;
    }
    rest.forEach(function (it) {
      var li = scEl('li');
      var b = scEl('button', 'sr-row');
      b.appendChild(scEl('b', null, it.n));
      b.appendChild(scEl('span', null,
        scHHMM(it.s) + ' · in ' + scSpan(it.s - now)));
      b.setAttribute('aria-label',
        it.n + ', ' + scRangeLong(it.s, it.e) + ', in ' + scSpan(it.s - now) + '. Edit.');
      b.addEventListener('click', function () { scEditSheet(it, today); });
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  /* Which view is up, remembered. Its own key: the schedule is the
     record and this is a preference about looking at it, and folding a
     preference into the record is how a damaged one takes the other
     down with it. */
  var VIEW_KEY = 'sched.view.v1';
  var view = 'list';

  function scSetView(v, save) {
    view = v === 'ring' ? 'ring' : 'list';
    var ring = view === 'ring';
    $('scRing').hidden = !ring;
    $('scRail').hidden = ring;
    /* The ring's own middle says the state and the figure. Leaving the
       hero above it says both twice, and the louder of the two is the
       one that is not the point of the screen. */
    $('scLive').hidden = ring;
    $('scLiveOf').hidden = ring;
    if (!ring) $('scEmpty').hidden = state.items.length > 0;
    else $('scEmpty').hidden = true;

    var btn = $('scView');
    btn.setAttribute('aria-label', ring ? 'Show the week' : 'Show the ring');
    $('scViewIcon').innerHTML = ring
      ? '<path d="M4 7h16M4 12h16M4 17h10"/>'
      : '<circle cx="12" cy="12" r="8"/><path d="M12 4v5"/>';
    if (save) { try { localStorage.setItem(VIEW_KEY, view); } catch (e) {} }
    if (ring) { scPaintRing(); scPaintRingList(); }
    else scLive();
  }

  /* ═══════════════════════════════════════════════════════════
     SHEET
     ═══════════════════════════════════════════════════════════ */

  var sheetOpen = false;
  var cameFrom = null;

  function scSheet(title, build) {
    /* Where the focus was before the sheet took it. Without this,
       closing drops focus back to the document and a keyboard or a
       screen reader restarts from the top of the page every time — you
       edit one row and lose your place in the week. */
    if (!sheetOpen) cameFrom = document.activeElement;
    var sheet = $('scSheet'), scrim = $('scScrim'), body = $('scSheetBody');
    /* The toast outranks the sheet in z-order, so it would sit on top of
       whatever field is under it. Opening a sheet is also an answer to
       the toast's offer — you went and did something else — so it goes
       rather than being reshuffled around the sheet. */
    scHideToast();
    $('scSheetTitle').textContent = title;
    body.textContent = '';
    build(body);
    scrim.hidden = false;
    sheet.hidden = false;
    requestAnimationFrame(function () {
      scrim.classList.add('is-open');
      sheet.classList.add('is-open');
      /* The sheet itself, not its first field: several of these open
         with a keyboard already coming up, and the ones that do focus
         their own field a moment later. */
      sheet.focus();
    });
    sheetOpen = true;
  }

  function scClose() {
    if (!sheetOpen) return;
    sheetOpen = false;
    scStopVoice();
    var sheet = $('scSheet'), scrim = $('scScrim');
    sheet.classList.remove('is-open');
    scrim.classList.remove('is-open');
    setTimeout(function () {
      if (sheetOpen) return;
      sheet.hidden = true;
      scrim.hidden = true;
    }, 300);
    /* Back where it came from, unless that row has just been deleted
       out from under it — then the bar is the honest place to land. */
    if (cameFrom && document.contains(cameFrom)) cameFrom.focus();
    else $('scMic').focus();
    cameFrom = null;
  }

  function scBtn(cls, label, fn) {
    var b = scEl('button', 'btn ' + cls, label);
    b.addEventListener('click', fn);
    return b;
  }

  function scToast(msg, undo) {
    var t = $('scToast');
    t.textContent = '';
    t.appendChild(scEl('span', null, msg));
    if (undo !== false && undoSnap) {
      var b = scEl('button', null, 'Undo');
      b.addEventListener('click', function () { scUndo(); scHideToast(); });
      t.appendChild(b);
    }
    t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('is-open'); });
    clearTimeout(scToast.t);
    scToast.t = setTimeout(scHideToast, 5200);
  }

  function scHideToast() {
    var t = $('scToast');
    t.classList.remove('is-open');
    clearTimeout(scToast.t);
    setTimeout(function () { if (!t.classList.contains('is-open')) t.hidden = true; }, 240);
  }

  /* ═══════════════════════════════════════════════════════════
     THE VOICE SHEET
     ═══════════════════════════════════════════════════════════ */

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null, recTimer = null;

  function scStopVoice() {
    clearTimeout(recTimer);
    if (rec) { try { rec.stop(); } catch (e) {} rec = null; }
    $('scMic').classList.remove('is-live');
  }

  function scVoiceSheet(auto) {
    scSheet(SR && auto ? 'Listening' : 'Say it, or type it', function (body) {
      var heard = scEl('div', 'heard');
      var field = scEl('input', 'field');
      field.type = 'text';
      field.placeholder = 'Train every day 6:30 to 7:30';
      field.autocapitalize = 'sentences';
      field.autocomplete = 'off';
      field.enterKeyHint = 'done';

      var preview = scEl('div', 'preview');
      var acts = scEl('div', 'acts');
      var go = scBtn('go', 'Add it', function () { commit(); });
      go.disabled = true;
      acts.appendChild(scBtn('off', 'Cancel', scClose));
      acts.appendChild(go);

      var hint = scEl('p', 'hint');
      hint.innerHTML = SR
        ? 'Or type it. <em>“Walk weekdays 7:45 to 8:30”</em>'
        : 'This browser has no speech button — use the microphone key on your keyboard, ' +
          'or type it. <em>“Walk weekdays 7:45 to 8:30”</em>';

      body.appendChild(heard);
      body.appendChild(field);
      body.appendChild(preview);
      body.appendChild(hint);
      body.appendChild(acts);

      var parsed = [];

      function show(text) {
        preview.textContent = '';
        parsed = text.trim() ? scParse(text) : [];
        var ok = 0;

        parsed.forEach(function (p) {
          var miss = scMissing(p);
          var card = scEl('div', 'parsed' + (p.kind === 'add' ? '' : ' is-gone'));
          if (miss) {
            card.appendChild(scEl('span', 'p-day', '?'));
            card.appendChild(scEl('span', 'p-name', p.name || 'That one'));
            card.appendChild(scEl('span', 'p-meta', 'Still needs ' + miss));
          } else if (p.kind === 'add') {
            ok++;
            card.appendChild(scEl('span', 'p-day', p.days.map(function (d) { return ABBR[d]; }).join(' ')));
            card.appendChild(scEl('span', 'p-name', p.name));
            card.appendChild(scEl('span', 'p-meta', scRangeLong(p.s, p.e) + (p.room ? '  ·  ' + p.room : '')));
          } else {
            var hits = scMatches(p);
            ok += hits.length ? 1 : 0;
            card.appendChild(scEl('span', 'p-day', hits.length ? '−' + hits.length : '0'));
            card.appendChild(scEl('span', 'p-name', p.kind === 'clear'
              ? 'Clear ' + p.days.map(function (d) { return FULL[d]; }).join(', ')
              : 'Remove ' + p.name));
            card.appendChild(scEl('span', 'p-meta', hits.length
              ? hits.map(function (h) { return ABBR[h.d] + ' ' + sc12(h.s); }).join('  ·  ')
              : 'Nothing on the card matches that'));
          }
          preview.appendChild(card);
        });

        go.disabled = ok === 0;
        go.textContent = parsed.length > 1 ? 'Add all' : parsed[0] && parsed[0].kind !== 'add' ? 'Do it' : 'Add it';
      }

      function commit() {
        var use = parsed.filter(function (p) { return !scMissing(p); });
        if (!use.length) return;
        scClose();
        scApply(use);
      }

      /* Once you are typing, what was heard is history — and an emptied
         transcript box is a grey slab sitting where the answer should
         be, so it leaves rather than blanking. */
      field.addEventListener('input', function () {
        heard.hidden = true;
        show(field.value);
      });
      field.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
      });

      /* No speech to report yet, so no box for it — the hint under the
         field already says what to do, and saying it twice in two
         different shapes reads as two different instructions. */
      if (!(SR && auto)) {
        heard.hidden = true;
        setTimeout(function () { field.focus(); }, 340);
        return;
      }

      /* ── listening ── */
      heard.textContent = 'Go ahead…';
      var finalText = '';

      rec = new SR();
      rec.lang = navigator.language || 'en-US';
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;

      rec.onresult = function (ev) {
        var fin = '', part = '';
        for (var i = 0; i < ev.results.length; i++) {
          var r = ev.results[i];
          if (r.isFinal) fin += r[0].transcript;
          else part += r[0].transcript;
        }
        finalText = fin;
        heard.hidden = false;
        heard.textContent = fin;
        if (part) {
          var p = scEl('span', 'partial', (fin ? ' ' : '') + part);
          heard.appendChild(p);
        }
        if (fin) { field.value = fin.trim(); show(field.value); }
      };

      rec.onerror = function (ev) {
        var why = ev.error === 'not-allowed' || ev.error === 'service-not-allowed'
          ? 'No microphone permission. Allow it in your browser settings, or type it below.'
          : ev.error === 'no-speech' ? 'Did not catch anything. Try again, or type it below.'
          : ev.error === 'network' ? 'Speech needs a connection. Type it below and it works offline.'
          : 'Speech stopped. Type it below.';
        heard.hidden = false;
        heard.textContent = why;
        $('scSheetTitle').textContent = 'Say it, or type it';
        scStopVoice();
        setTimeout(function () { field.focus(); }, 60);
      };

      rec.onend = function () {
        $('scMic').classList.remove('is-live');
        clearTimeout(recTimer);
        rec = null;
        $('scSheetTitle').textContent = finalText.trim() ? 'Heard' : 'Say it, or type it';
        if (finalText.trim()) { field.value = finalText.trim(); show(field.value); }
        else if (!heard.hidden && !/microphone|connection|catch/.test(heard.textContent)) {
          heard.textContent = 'Nothing heard. Type it below, or press the microphone again.';
        }
      };

      try {
        rec.start();
        $('scMic').classList.add('is-live');
        /* Some browsers never fire onend when nothing is said at all. */
        recTimer = setTimeout(scStopVoice, 15000);
      } catch (e) {
        heard.textContent = 'Could not start the microphone. Type it below.';
        rec = null;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     THE EDIT SHEET
     ═══════════════════════════════════════════════════════════ */

  function scEditSheet(item, day) {
    var isNew = !item;
    scSheet(isNew ? 'New block' : 'Edit', function (body) {
      var name = scEl('input', 'field');
      name.type = 'text';
      name.placeholder = 'What is it';
      name.value = item ? item.n : '';
      name.autocapitalize = 'words';

      var picked = {};
      if (item) picked[item.d] = 1; else picked[day === undefined ? new Date().getDay() : day] = 1;

      var picks = scEl('div', 'days-pick');
      scWeek().forEach(function (d) {
        var b = scEl('button', 'pick', ABBR[d]);
        b.type = 'button';
        b.setAttribute('aria-pressed', picked[d] ? 'true' : 'false');
        b.addEventListener('click', function () {
          /* Editing an existing row moves it; a new one can land on
             several days at once, which is what a timetable is. */
          if (!isNew) { picked = {}; picks.querySelectorAll('.pick').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); }); }
          picked[d] = picked[d] ? 0 : 1;
          b.setAttribute('aria-pressed', picked[d] ? 'true' : 'false');
        });
        picks.appendChild(b);
      });

      var times = scEl('div', 'grid2');
      var t1 = scEl('input', 'field'); t1.type = 'time'; t1.step = 300;
      var t2 = scEl('input', 'field'); t2.type = 'time'; t2.step = 300;
      t1.style.margin = '0'; t2.style.margin = '0';
      t1.value = scHHMM(item ? item.s : 480);
      t2.value = scHHMM(item ? item.e : 570);
      times.appendChild(t1); times.appendChild(t2);

      var room = scEl('input', 'field');
      room.type = 'text';
      room.placeholder = 'Where, if it matters';
      room.value = item ? item.r : '';

      body.appendChild(scEl('span', 'label', 'What'));
      body.appendChild(name);
      body.appendChild(scEl('span', 'label', isNew ? 'Days' : 'Day'));
      body.appendChild(picks);
      body.appendChild(scEl('span', 'label', 'From — to'));
      body.appendChild(times);
      body.appendChild(scEl('span', 'label', 'Where'));
      body.appendChild(room);

      var acts = scEl('div', 'acts');
      if (!isNew) acts.appendChild(scBtn('bad', 'Delete', function () {
        scMark();
        state.items = state.items.filter(function (o) { return o.id !== item.id; });
        scClose();
        scCommit('Removed');
      }));
      else acts.appendChild(scBtn('off', 'Cancel', scClose));

      acts.appendChild(scBtn('go', 'Save', function () {
        var s = scFromHHMM(t1.value), e = scFromHHMM(t2.value);
        var days = Object.keys(picked).filter(function (d) { return picked[d]; }).map(Number);
        if (!name.value.trim()) { name.focus(); return; }
        if (s === null || e === null || e <= s) { t2.focus(); scToast('The end has to be after the start', false); return; }
        if (!days.length) { scToast('Pick a day', false); return; }

        scMark();
        if (isNew) {
          days.forEach(function (d) {
            state.items.push({ id: scId(), d: d, s: s, e: e, r: room.value.trim(), n: name.value.trim() });
          });
        } else {
          item.d = days[0]; item.s = s; item.e = e;
          item.r = room.value.trim(); item.n = name.value.trim();
        }
        scClose();
        scCommit(isNew ? 'Added' : 'Saved');
      }));
      body.appendChild(acts);

      if (isNew) setTimeout(function () { name.focus(); }, 340);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     THE MENU
     ═══════════════════════════════════════════════════════════ */

  function scTextSheet(title, label, value, save) {
    scSheet(title, function (body) {
      var f = scEl('input', 'field');
      f.type = 'text';
      f.value = value;
      body.appendChild(scEl('span', 'label', label));
      body.appendChild(f);
      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Cancel', scClose));
      acts.appendChild(scBtn('go', 'Save', function () {
        scMark(); save(f.value.trim()); scClose(); scCommit('Saved');
      }));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); f.select(); }, 340);
    });
  }

  function scMenuSheet() {
    scSheet('Schedule', function (body) {
      var item = function (label, note, cls, fn) {
        var b = scEl('button', 'menu-item' + (cls ? ' ' + cls : ''));
        b.appendChild(document.createTextNode(label));
        if (note) b.appendChild(scEl('span', 'sub-note', note));
        b.addEventListener('click', fn);
        body.appendChild(b);
      };

      item('Rename', state.title, '', function () {
        scTextSheet('Rename', 'Title', state.title, function (v) { state.title = v || 'Schedule'; });
      });
      item('Subtitle', state.sub || 'none', '', function () {
        scTextSheet('Subtitle', 'Subtitle', state.sub, function (v) { state.sub = v; });
      });
      item('Copy a backup', 'Puts the whole schedule on the clipboard as text', '', function () {
        var text = JSON.stringify(state);
        var done = function () { scClose(); scToast('Copied. Paste it somewhere safe.', false); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { scPasteSheet(text); });
        } else scPasteSheet(text);
      });
      item('Restore a backup', 'Paste one back in', '', function () { scRestoreSheet(); });
      item('Clear everything', state.items.length + ' blocks. This one asks first.', 'bad', function () {
        scSheet('Clear everything?', function (b2) {
          var p = scEl('p', 'hint',
            'All ' + state.items.length + ' blocks go. Nothing is kept anywhere else, ' +
            'so take a backup first if you might want them.');
          b2.appendChild(p);
          var acts = scEl('div', 'acts');
          acts.appendChild(scBtn('off', 'Keep them', scClose));
          acts.appendChild(scBtn('bad', 'Clear it', function () {
            scMark();
            state.items = [];
            scClose();
            scCommit('Cleared');
          }));
          b2.appendChild(acts);
        });
      });

      var note = scEl('p', 'hint');
      note.style.marginTop = '18px';
      note.innerHTML = 'Everything lives in this browser and is never uploaded. ' +
        'Dictation is the exception — your phone sends those few seconds of audio to ' +
        'its own speech service to turn into text. Typing the same sentence does not.';
      body.appendChild(note);
    });
  }

  function scPasteSheet(text) {
    scSheet('Backup', function (body) {
      var f = scEl('textarea', 'field');
      f.rows = 6;
      f.value = text;
      body.appendChild(scEl('span', 'label', 'Copy this and keep it'));
      body.appendChild(f);
      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('go', 'Done', scClose));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); f.select(); }, 340);
    });
  }

  function scRestoreSheet() {
    scSheet('Restore', function (body) {
      var f = scEl('textarea', 'field');
      f.rows = 6;
      f.placeholder = 'Paste a backup here';
      body.appendChild(scEl('span', 'label', 'Paste it in'));
      body.appendChild(f);
      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Cancel', scClose));
      acts.appendChild(scBtn('go', 'Restore', function () {
        var raw = null;
        try { raw = JSON.parse(f.value); } catch (e) { scToast('That is not a backup', false); return; }
        var next = scClean(raw);
        if (!next.items.length) { scToast('Nothing readable in that', false); return; }
        scMark();
        state = next;
        scClose();
        scCommit('Restored ' + next.items.length + ' blocks');
      }));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); }, 340);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     WIRING
     ═══════════════════════════════════════════════════════════ */

  scLoad();

  /* Read before the first paint, so the app opens on the view you left
     it in rather than flashing the list on the way to the ring. A bad
     stored value falls through to the list; it is a preference and
     there is nothing here worth repairing. */
  try { if (localStorage.getItem(VIEW_KEY) === 'ring') view = 'ring'; } catch (e) {}

  scRender();
  scSetView(view, false);

  $('scView').addEventListener('click', function () {
    scSetView(view === 'ring' ? 'list' : 'ring', true);
  });

  $('scMic').addEventListener('click', function () {
    if (rec) { scStopVoice(); return; }
    scVoiceSheet(true);
  });
  $('scAdd').addEventListener('click', function () { scEditSheet(null); });
  $('scMenu').addEventListener('click', scMenuSheet);
  $('scScrim').addEventListener('click', scClose);

  $('scTitle').addEventListener('click', function () {
    scTextSheet('Rename', 'Title', state.title, function (v) { state.title = v || 'Schedule'; });
  });
  $('scSub').addEventListener('click', function () {
    scTextSheet('Subtitle', 'Subtitle', state.sub, function (v) { state.sub = v; });
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && sheetOpen) { ev.preventDefault(); scClose(); }
  });

  /* Half a minute is fine for a countdown printed to the minute, and it
     is one pass over a handful of rows. It stops entirely when the app
     is not on screen — a backgrounded tab ticking for hours is the kind
     of thing that shows up as battery. */
  var tick = null;
  function scStartTick() {
    clearInterval(tick);
    tick = setInterval(scLive, 30000);
    scLive();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(tick); else scStartTick();
  });
  scStartTick();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
