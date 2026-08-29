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
     What a person sees the first time they open this, and it is a
     STARTER rather than anybody's actual week.

     IT USED TO BE MINE. Wake, Train, Walk and Down around a real shift
     pattern and real trading hours, seeded from routine/data.js — which
     meant every person who was ever sent this link opened it and found
     somebody else's life already filled in, down to which days they
     worked. That is not a first-run experience, it is a disclosure, and
     it shipped because the file that made a good default for one person
     was never asked whether it made a good default for a stranger.

     What survives is the argument for having a seed at all: the first
     open should be a week with a shape rather than an empty frame with
     instructions in it. So it is five blocks a day that most people
     recognise, at times most people could live with, and every row is
     one tap from being right. Nothing in it says anything about anyone.

     The old week is not gone — it moved to tests/schedule.js, which is
     where a fixture belongs. It was doing two jobs and only one of them
     was a default.

     A block CAN carry a place, and none of these do. It rides inside
     the name when there is one, rather than taking a column of its
     own — most blocks have none, and a fourth track standing empty
     all week is worse than no track. */
  var SEED = {
    title: 'Daily Process',
    sub: 'Up at 6:00 · down at 22:45',
    items: [0, 1, 2, 3, 4, 5, 6].reduce(function (all, d) {
      return all.concat([
        { d: d, s: 360,  e: 390,  r: '', n: 'Wake' },
        { d: d, s: 390,  e: 450,  r: '', n: 'Train' },
        { d: d, s: 465,  e: 510,  r: '', n: 'Walk' },
        { d: d, s: 1275, e: 1305, r: '', n: 'Read' },
        { d: d, s: 1365, e: 1380, r: '', n: 'Down' }
      ]);
    }, [])
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

  /* ── which card is face-on ──
     null means today, and it RESOLVES rather than stores: a deck that
     remembered Friday across midnight would open on Friday, and the
     one thing this screen must never be wrong about is which day you
     are in. Swiping sets it for the session and nothing writes it to
     storage — where you left the deck is not a preference, it is where
     your thumb happened to stop. */
  var openDay = null;
  function scOpenDay() {
    var t = new Date().getDay();
    if (openDay === null) return t;
    return ORDER.indexOf(openDay) >= 0 ? openDay : t;
  }

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

  /* ═══════════════════════════════════════════════════════════
     WHAT KIND OF THING A BLOCK IS

     A glyph per row, worked out from the name you typed. Nothing to
     set, nothing to pick: a schedule you have to decorate is a schedule
     you stop keeping.

     DRAWN TO THE BAR'S IDIOM — stroke, round caps, no fill, a 24 box at
     1.8 — and JUDGED AT 22PX, which is the size a row draws them. That
     is not a formality. The first sheet had `drive` and `rest` as the
     same silhouette (a body with no wheels under it is a sofa), `clean`
     reading as a pencil with a plus beside it, and eat, coffee and cook
     as three bowls with steam over them told apart only by which way a
     handle pointed. All four looked fine at 88px. Two glyphs with one
     silhouette is worse than a glyph missing, because the row is then
     confidently wrong.

     Four are the tally's own, reused verbatim rather than redrawn —
     two dumbbells on one app is the mistake the Steps footprint taught.
     Train is the exception: its plates are taller here, because on the
     tally it sits inside a ring that frames it and on a bare row a
     6-unit-tall dumbbell in a 24 box reads as a dash. */
  /* One footprint, drawn twice at the same scale. A second print drawn
     small by hand lost the taper that makes the first one read, and two
     shapes nearly the same but not quite look like a mistake rather
     than a pair.

     PLACED SO THE STROKE FITS. FOOT spans y 3.0 to 19.4 in the 24 box;
     at .62 that is 10.2 tall, and an earlier translate of -1.5 put the
     upper print's top edge at y 0.4 — half a 1.8 stroke past the
     viewBox, so the tally's ring clipped a flat line across the top of
     it. These numbers leave 0.7 of clearance at every edge.

     IT LIVES HERE BECAUSE TWO SCREENS DRAW IT: the tally's Steps card
     and the week's Walk row are the same idea, so they are the same
     drawing rather than two of them. */
  var FOOT = 'M15.1 3.1c1.9 1.2 2.4 4.3 1.6 6.7-.5 1.6-1.5 2.4-1.8 3.9-.3 1.6.5 2.9-.3 4.4'
    + '-.9 1.7-3.3 2-4.7.7-1.5-1.3-1.4-3.4-1-5.2.4-1.9.2-2.7-.4-4.5-.9-2.6-.1-5.6 2.1-6.7'
    + '1.5-.8 3.1-.6 4.5.7z';
  var STEPS = '<g transform="translate(-2.6 -.2) scale(.62)"><path d="' + FOOT + '"/></g>'
    + '<g transform="translate(7.4 9.6) scale(.62)"><path d="' + FOOT + '"/></g>';

  var BLOCK_ICON = {
    train: '<path d="M6.5 7.6v8.8M3.5 9.8v4.4M17.5 7.6v8.8M20.5 9.8v4.4M6.5 12h11"/>',
    read: '<path d="M12 6.6v12.8M12 6.6C10.4 5.1 8.3 4.6 4 5.1v12.8c4.3-.5 6.4 0 8 1.5'
        + 'M12 6.6C13.6 5.1 15.7 4.6 20 5.1v12.8c-4.3-.5-6.4 0-8 1.5"/>',
    eat: '<path d="M3.5 12.5h17a8.5 8.5 0 01-17 0zM9 5.4v3.1M12.5 4.4v4.1M16 6v2.5"/>',
    water: '<path d="M12 3.4c0 0 5.6 6.1 5.6 9.6a5.6 5.6 0 01-11.2 0C6.4 9.5 12 3.4 12 3.4z"/>',

    /* THE FOOTPRINTS, and they are the tally's Steps card verbatim. The
       two are the same idea at two sizes, so they are one drawing. It
       replaced a walking stick-figure that was the third stick-figure
       on the sheet — walk, run and stretch were one silhouette in three
       poses, which is the collision this file keeps re-learning. */
    walk: STEPS,
    /* A SHOE IN MOTION: tilted toe-up, with three speed lines behind
       it. It replaced a static side-on trainer, and the tilt is doing
       most of the work — an upright shoe is footwear, a tilted one with
       marks trailing it is running, which is the thing the row names.

       SIZE IS THE ONLY LEVER LEFT. The reference is about ten strokes
       and the row draws this at 22px, so everything that stays has to
       be as big as the box allows: the body is scaled 1.12 and shifted,
       putting its ink at 0.6..22.8 across and 3.2..18.1 down, which is
       inside the 24 box with the 1.8 stroke and nothing to spare.

       WHAT DID NOT SURVIVE: a ground line under the shoe, which read as
       a stray underline, and the sole seam inside it, which read as a
       smudge — the same 3.4-unit floor every interior detail on this
       sheet has run into. A closed midsole band failed the same way
       five times over before that floor was written down. */
    run: '<g transform="translate(-1.5 -1.3) scale(1.12)">'
       + '<path d="M8.4 4.8c1.1 1.6 1 3.4-.4 4.7L6.9 10.7l5.8 5.8h5.5'
       + 'a2.7 2.7 0 000-5.4h-.7L15.3 7.3c-2.4 1-5-.1-6.9-2.5z"/></g>'
       + '<path d="M1.7 4.8h3.2M1.5 9.6h2.8M2 14.2h2.2"/>',
    cycle: '<circle cx="5.6" cy="16.4" r="3.6"/><circle cx="18.4" cy="16.4" r="3.6"/>'
         + '<path d="M5.6 16.4l4.4-7.4h4.6l-2.4 7.4h6.2M12.4 9h3.4"/>',
    swim: '<circle cx="16.4" cy="7.2" r="1.9"/>'
        + '<path d="M4 11.6l4.4-2.4 4 3.2 3.4-1.2M2.6 17.6c1.6 0 1.6 1.4 3.2 1.4s1.6-1.4 3.2-1.4'
        + '1.6 1.4 3.2 1.4 1.6-1.4 3.2-1.4 1.6 1.4 3.2 1.4"/>',
    /* Wheels, or it is the bed below it. */
    drive: '<path d="M3.6 15.8v-2l1.9-4.6A2 2 0 017.4 8h9.2a2 2 0 011.9 1.2l1.9 4.6v2'
         + 'M3.6 13.8h16.8"/>'
         + '<circle cx="7.4" cy="16.4" r="2"/><circle cx="16.6" cy="16.4" r="2"/>',
    travel: '<path d="M2.8 13.4l18.4-6.6-3.6 8-5-1.4-3.2 5.4-1.2-4.6z"/>',

    sleep: '<path d="M20 14.8A8.2 8.2 0 019.4 4.2 8.2 8.2 0 1020 14.8z"/>',
    wake: '<path d="M3.4 18.6h17.2M7.2 18.6a4.8 4.8 0 019.6 0M12 3.6v2.8'
        + 'M5.4 8.2l1.9 1.9M18.6 8.2l-1.9 1.9"/>',
    sun: '<circle cx="12" cy="12" r="4.4"/>'
       + '<path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6'
       + 'M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
    meditate: '<circle cx="12" cy="5.2" r="2.2"/>'
            + '<path d="M12 8.8v4.4M12 13.2l-3.6 1.9M12 13.2l3.6 1.9'
            + 'M6.4 18.8c0-2.1 2.5-3.8 5.6-3.8s5.6 1.7 5.6 3.8z"/>',
    stretch: '<circle cx="12" cy="4.6" r="2"/>'
           + '<path d="M12 8v5.4M4.6 9.6l7.4 1.4 7.4-1.4M12 13.4l-3.6 7M12 13.4l3.6 7"/>',
    /* The headboard standing at the left end is what tells it from the car. */
    rest: '<path d="M3.4 19.6V8.4M3.4 14.4h17.2v5.2M20.6 14.6v5'
        + 'M6.6 14.4v-2.2a1.8 1.8 0 011.8-1.8h8.4a1.8 1.8 0 011.8 1.8v2.2"/>',

    work: '<path d="M4.4 6.2h15.2v9.2H4.4zM2.4 18.4h19.2"/>',
    trading: '<path d="M3.4 19.6h17.2M6.2 15.4l3.8-4.8 3.4 2.8 5.4-6.6M14.6 6.8h4.2v4.2"/>',
    code: '<path d="M8.4 8L4 12l4.4 4M15.6 8L20 12l-4.4 4M13.6 5.2l-3.2 13.6"/>',
    write: '<path d="M4 20l1-4.2L16 4.8l3.2 3.2L8.2 19zM14 6.8l3.2 3.2M4 20l4.2-1"/>',
    plan: '<path d="M5.4 4.4h13.2v15.2H5.4zM8.6 9.2l1.6 1.6 3-3M8.6 15h6.8"/>',
    email: '<path d="M3.4 6.2h17.2v11.6H3.4zM3.4 6.6l8.6 6.6 8.6-6.6"/>',
    call: '<path d="M8.2 3.6L11 8l-2.2 2a12.6 12.6 0 005.2 5.2l2-2.2 4.4 2.8v3a1.8 1.8 0 01-2 1.8'
        + 'C10.6 19.6 4.4 13.4 3.4 5.6a1.8 1.8 0 011.8-2h3z"/>',
    meeting: '<circle cx="9" cy="7.8" r="3"/><circle cx="17.2" cy="8.6" r="2.3"/>'
           + '<path d="M3.2 19a5.8 5.8 0 0111.6 0M16 13.8a4.8 4.8 0 014.8 4.8"/>',
    study: '<path d="M2.6 9.4L12 5l9.4 4.4L12 13.8zM6.6 11.4V16c0 0 2.2 1.9 5.4 1.9s5.4-1.9 5.4-1.9'
         + 'v-4.6M21.4 9.4v5"/>',
    /* A NOTE, NOT A CURRENCY SIGN. A $ on a British schedule is the app
       having an opinion about somebody's money. */
    money: '<path d="M2.6 7.2h18.8v9.6H2.6zM5.8 10.2v3.6M18.2 10.2v3.6"/>'
         + '<circle cx="12" cy="12" r="2.6"/>',

    coffee: '<path d="M4.2 8.6h12v5.6a4.2 4.2 0 01-4.2 4.2H8.4a4.2 4.2 0 01-4.2-4.2z'
          + 'M16.2 10.2h1.6a2.3 2.3 0 010 4.6h-1.6M7.2 3.2v2.4M11.4 2.8v2.8M15.4 3.2v2.4"/>',
    /* A toque, because a pan is a third bowl with steam over it. */
    cook: '<path d="M6.6 13.2v6.2h10.8v-6.2M6.6 16.4h10.8'
        + 'M7 13.4a3.5 3.5 0 01.2-6.8 3.7 3.7 0 019.6-.6 3.5 3.5 0 010 7"/>',
    shower: '<path d="M12 3.4a4.2 4.2 0 00-4.2 4.2M3.6 7.6h16.8M7 11.6v1.8M10.4 11v2'
          + 'M13.6 11.6v1.8M17 11v2M8.6 16.4v1.8M12 15.8v2.2M15.4 16.4v1.8"/>',
    /* Not a broom: at 22px a broom is a diagonal line with a smudge on
       the end. Two sparkles is what everything means "tidy" with, and it
       survives the size because it is two solid shapes and no detail. */
    clean: '<path d="M10 3.6l1.7 4.6 4.6 1.7-4.6 1.7L10 16.2 8.3 11.6 3.7 9.9l4.6-1.7z'
         + 'M17.6 13.8l.9 2.5 2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9z"/>',
    shop: '<path d="M5.4 7.8h13.2l-1.2 12H6.6zM9 7.8V5.6a3 3 0 016 0v2.2"/>',
    home: '<path d="M3.4 11.2L12 4.2l8.6 7M6 9.8v9.8h12V9.8"/>',
    garden: '<path d="M12 20.4v-7.6M12 12.8c0-4 2.6-7.4 7-8.2.6 4.6-2 8.2-7 8.2z'
          + 'M12 15.2C8.6 15.2 6 13 5.4 9.4c3.6.6 6 3 6.6 5.8z"/>',
    pet: '<ellipse cx="6.4" cy="9.6" rx="2.1" ry="2.7"/><ellipse cx="17.6" cy="9.6" rx="2.1" ry="2.7"/>'
       + '<ellipse cx="10" cy="5.6" rx="1.9" ry="2.4"/><ellipse cx="14" cy="5.6" rx="1.9" ry="2.4"/>'
       + '<path d="M12 12.6c3.4 0 5.4 2.4 5.4 4.6s-2 3.4-5.4 3.4-5.4-1.2-5.4-3.4 2-4.6 5.4-4.6z"/>',
    health: '<path d="M12 20.2C12 20.2 3.6 14.6 3.6 9.4A4.3 4.3 0 0112 7.5a4.3 4.3 0 018.4 1.9'
          + 'c0 5.2-8.4 10.8-8.4 10.8z"/>',

    music: '<circle cx="6.6" cy="17.6" r="2.8"/><circle cx="17" cy="15.6" r="2.8"/>'
         + '<path d="M9.4 17.6V6.4l10.4-2.2v11.4M9.4 9.4l10.4-2.2"/>',
    podcast: '<path d="M4.4 14.6v-2.4a7.6 7.6 0 0115.2 0v2.4'
           + 'M3 14h3.2v6H4.6A1.6 1.6 0 013 18.4zM21 14h-3.2v6h1.6a1.6 1.6 0 001.6-1.6z"/>',
    game: '<path d="M8.4 11h-3.2M6.8 9.4v3.2M15.6 10.6h.1M18 13h.1'
        + 'M8 6.6h8a5.4 5.4 0 015.3 6.4l-.7 3.6a3 3 0 01-5.4 1.2l-.9-1.2h-3.6l-.9 1.2'
        + 'a3 3 0 01-5.4-1.2l-.7-3.6A5.4 5.4 0 018 6.6z"/>',
    /* The play triangle is the only thing separating this from the
       laptop — both are a lit rectangle on a base at 22px. */
    watch: '<path d="M3.4 5.6h17.2v11.2H3.4zM8.4 20.4h7.2M12 16.8v3.6'
         + 'M10.4 8.8l4.4 2.4-4.4 2.4z"/>',
    photo: '<circle cx="12" cy="13.4" r="4"/>'
         + '<path d="M3.4 7.6h4l1.8-2.6h5.6l1.8 2.6h4v12H3.4z"/>',

    /* THE FALLBACK IS A CLOCK, and it is the only honest one: everything
       in this list is a block with a start and an end, so a shape saying
       no more than "a scheduled thing" is exactly right for one whose
       kind the app cannot work out. A question mark would be the app
       telling you it does not understand your own schedule. */
    block: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7v5.4l3.6 2.2"/>'
  };

  /* ── ORDERED, AND THE ORDER IS THE WHOLE MECHANISM ──
     First hit wins, so every pair where one phrase contains another has
     to be listed the long way round. Each of these was a real collision
     before it was a line here:

       "walk the dog"   pet must beat walk
       "work out"       train must beat work
       "school run"     drive must beat run
       "water plants"   garden must beat water
       "meal prep"      cook must beat eat
       "edit photos"    photo must beat write

     AND "TRAIN" IS THE GYM, NOT THE RAILWAY. It is genuinely both, and
     this app's own schedule ships a Train block that is a gym session —
     so the gym wins and the railway is reached by "commute", "travel"
     or "flight". A word that means two things has to be decided, and the
     decision belongs here in the open rather than in whichever entry
     happened to be typed first.

     A LIST, NOT A REGEX PER ENTRY. Names are matched on word
     boundaries, so "read" does not fire on "bread" and "up" does not
     fire on "supper" — a substring match looked fine on the seed and
     mislabels the moment anybody types a real sentence. */
  var ICON_MATCH = [
    ['pet', ['walk the dog', 'the dog', 'dog', 'cat', 'puppy', 'pet', 'vet']],
    ['garden', ['water plants', 'plants', 'garden', 'gardening', 'allotment', 'yard']],
    ['drive', ['school run', 'commute', 'drive', 'driving', 'car', 'taxi', 'lift']],
    ['cook', ['meal prep', 'food prep', 'cook', 'cooking', 'bake', 'baking', 'kitchen']],
    ['train', ['gym', 'work out', 'workout', 'weights', 'lifting', 'train', 'training',
               'session', 'exercise', 'crossfit', 'boxing']],
    ['work', ['deep work', 'desk', 'office', 'admin', 'work', 'focus', 'shift']],
    ['run', ['run', 'running', 'jog', 'jogging', 'sprint', 'marathon', '5k', '10k']],
    ['walk', ['walk', 'walking', 'stroll', 'hike', 'hiking', 'steps']],
    ['cycle', ['cycle', 'cycling', 'bike', 'ride', 'spin']],
    ['swim', ['swim', 'swimming', 'pool', 'laps']],
    ['stretch', ['stretch', 'stretching', 'yoga', 'mobility', 'warm up', 'warmup', 'pilates']],
    ['meditate', ['meditate', 'meditation', 'breathe', 'breathwork', 'mindful',
                  'pray', 'prayer', 'stillness']],
    ['photo', ['edit photos', 'photos', 'photo', 'camera', 'shoot', 'photography']],
    ['read', ['read', 'reading', 'book', 'chapter']],
    ['study', ['study', 'revise', 'revision', 'course', 'class', 'lecture', 'lesson',
               'learn', 'school', 'uni', 'homework']],
    ['write', ['write', 'writing', 'journal', 'diary', 'blog', 'essay', 'notes', 'note']],
    ['code', ['code', 'coding', 'dev', 'program', 'debug', 'repo', 'build', 'ship']],
    ['trading', ['trading', 'trade', 'trades', 'market', 'markets', 'charts', 'chart',
                 'invest', 'stocks']],
    ['money', ['money', 'budget', 'bank', 'bills', 'invoice', 'accounts', 'finance', 'tax']],
    ['plan', ['plan', 'planning', 'review', 'checklist', 'to-do', 'todo', 'prep',
              'organise', 'organize', 'sort out']],
    ['email', ['email', 'emails', 'inbox', 'mail']],
    ['call', ['call', 'calls', 'phone', 'ring']],
    ['meeting', ['meeting', 'meet', 'standup', 'stand-up', 'catch up', 'catch-up',
                 '1:1', 'interview', 'team', 'sync']],
    ['coffee', ['coffee', 'cafe', 'café', 'espresso', 'brew', 'tea']],
    ['eat', ['breakfast', 'brunch', 'lunch', 'dinner', 'supper', 'meal', 'eat',
             'food', 'fuel', 'snack']],
    ['water', ['water', 'hydrate', 'hydration', 'drink']],
    ['wake', ['wake', 'get up', 'morning', 'rise', 'alarm', 'sunrise']],
    ['sleep', ['sleep', 'bed', 'bedtime', 'down', 'night', 'nap', 'lights out']],
    ['rest', ['rest', 'break', 'recover', 'recovery', 'relax', 'chill', 'downtime']],
    ['shower', ['shower', 'bath', 'wash', 'shave', 'groom', 'skincare']],
    ['clean', ['clean', 'cleaning', 'tidy', 'chores', 'laundry', 'dishes',
               'hoover', 'vacuum']],
    ['shop', ['shop', 'shopping', 'groceries', 'grocery', 'store', 'errand', 'errands']],
    ['health', ['doctor', 'dentist', 'gp', 'therapy', 'physio', 'appointment',
                'medicine', 'health', 'meds']],
    ['travel', ['travel', 'flight', 'fly', 'airport', 'trip', 'journey']],
    ['home', ['home', 'house', 'family', 'kids']],
    ['music', ['music', 'guitar', 'piano', 'practice', 'band', 'sing', 'choir']],
    ['podcast', ['podcast', 'audiobook', 'listen', 'audio']],
    ['game', ['game', 'games', 'gaming', 'xbox', 'playstation', 'switch']],
    ['watch', ['tv', 'film', 'movie', 'netflix', 'series', 'watch']],
    ['sun', ['sun', 'outdoors', 'outdoor', 'outside', 'fresh air', 'daylight']]
  ];

  /* Built once. Forty-one entries at a few keywords each is a couple of
     hundred regexes, and the row loop runs on every paint. */
  var ICON_RE = ICON_MATCH.map(function (pair) {
    return [pair[0], pair[1].map(function (k) {
      return new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        + '([^a-z0-9]|$)');
    })];
  });

  function scIconFor(name) {
    var s = String(name || '').toLowerCase();
    for (var i = 0; i < ICON_RE.length; i++) {
      var res = ICON_RE[i][1];
      for (var j = 0; j < res.length; j++) {
        if (res[j].test(s)) return ICON_RE[i][0];
      }
    }
    return 'block';
  }

  function scRender() {
    var today = new Date().getDay();
    painted = new Date().toDateString();

    $('scTitle').textContent = state.title;
    $('scSub').textContent = state.sub;
    $('scSub').hidden = !state.sub;

    var rail = $('scRail');
    rail.textContent = '';

    /* ── every day, always ──
       The rail used to skip a day with nothing on it, because a column
       of empty cards was six rows of furniture. A DECK cannot skip:
       the seven cards are the week's spine, and a Tuesday that vanishes
       because you cleared it leaves six cards and no way to put
       anything back on the day that went. An empty card says "nothing
       yet" and is one tap from fixing that.

       Monday first, and not today first. A week whose leftmost card
       moves every morning has no shape to remember — you scroll to
       today, and where today sits IS information. */
    $('scEmpty').hidden = state.items.length > 0 || view === 'ring';

    var open = scOpenDay();

    ORDER.forEach(function (d) {
      var rows = scByDay(d);
      var isOpen = d === open;
      var li = scEl('li', 'day' + (d === today ? ' is-today' : '')
        + (isOpen ? ' is-open' : ''));
      li.dataset.d = d;
      /* The two faces of the card turn together, so they sit inside one
         box that is transformed rather than being transformed apart. */
      var flip = scEl('div', 'wk-flip');
      var front = scEl('div', 'wk-front');

      var head = scEl('div', 'wk-h');
      var dn = scEl('button', 'day-name', isOpen ? FULL[d] : ABBR[d]);
      /* On the open card the name adds a block, which is what it has
         always done; on a shut one it means what the rest of that card
         means. One word with two answers depending on a state you
         cannot see would be worse than either. */
      dn.setAttribute('aria-label', isOpen
        ? 'Add a block on ' + FULL[d] : 'Open ' + FULL[d]);
      dn.addEventListener('click', function () {
        if (d === scOpenDay()) scEditSheet(null, d); else scDeckGo(d);
      });
      head.appendChild(dn);
      /* ── the turn ──
         Only on the open card: a 76px sliver has nothing to show on its
         back, and a control that appears on seven cards to be useful on
         one is six pieces of furniture. */
      if (isOpen) {
        var turn = scEl('button', 'wk-turn');
        turn.setAttribute('aria-label', 'Objectives for ' + FULL[d]);
        turn.innerHTML = OBJ_MARK;
        turn.addEventListener('click', function () { scFlip(d, true); });
        head.appendChild(turn);
      }
      /* Committed hours, opposite the name. It is the one figure a card
         can carry for nothing — the rows are already here to add up —
         and it is what makes a card comparable to the card beside it. */
      var mins = rows.reduce(function (a, it) { return a + (it.e - it.s); }, 0);
      if (mins) {
        head.appendChild(scEl('span', 'wk-hrs',
          (mins / 60).toFixed(mins % 60 ? 1 : 0) + ' hrs'));
      }
      front.appendChild(head);

      /* The shut cards get bars: duration as length, the session breaks
         as gaps, no words. Built for every card whether or not it is
         open, so a swipe moves one class instead of running a render. */
      var mini = scEl('div', 'wk-mini');
      scSessions(rows).forEach(function (g, gi) {
        if (gi) mini.appendChild(document.createElement('hr'));
        g.rows.forEach(function (it) {
          var b = scEl('i', blockLog[scDay(scDateOfDow(d))]
            && blockLog[scDay(scDateOfDow(d))][it.id] ? 'is-done' : null);
          /* Floored at 34%: below about a third a bar stops reading as
             a bar and reads as a dot, and a fifteen-minute Down drew
             one. */
          b.style.width = Math.max(34, Math.min(100, (it.e - it.s) / 5)) + '%';
          mini.appendChild(b);
        });
      });
      front.appendChild(mini);

      /* ── you OPEN a card by pressing it ──
         It used to open by being nearest the middle of the scroller
         after a swipe, and that was geometry standing in for an
         intention: a scroller stops at 0, so the first card could never
         reach the middle and Monday was unopenable. It was then
         reachable only through a special case for the ends, and Tuesday
         only after the deck reflowed and you swiped a second time. A
         press says which day you meant, and none of that arithmetic has
         to be right.

         A REAL BUTTON sized to the card, not a click handler on the
         <li>: it is focusable, it has a name, and a keyboard reaches
         every day of the week. It is a SIBLING of the rows rather than
         their ancestor, because a button inside a button is invalid and
         collapses to one press while looking exactly right. */


      var card = scEl('div', 'day-card');

      if (!rows.length) {
        var free = scEl('button', 'row is-free');
        free.appendChild(scEl('span', 'n', 'Nothing yet'));
        free.addEventListener('click', function () { scEditSheet(null, d); });
        card.appendChild(free);
      }

      /* The session headings are interleaved with the rows rather than
         wrapping them: a row's own grid is what aligns the glyph, the
         time and the name, and nesting each session in a box of its own
         would give three separate grids that agree only by luck. */
      var head3 = {};
      scSessions(rows).forEach(function (g) { head3[g.rows[0].id] = g; });

      rows.forEach(function (it) {
        if (head3[it.id]) {
          var g = head3[it.id];
          var sh = scEl('div', 'wk-sh'
            + (d === today && scNowMin() >= g.s.a && scNowMin() < g.s.b
               ? ' is-live' : ''));
          sh.appendChild(scEl('b', null, g.s.k));
          sh.appendChild(scEl('i'));
          sh.appendChild(scEl('em', null, String(g.rows.length)));
          /* aria-hidden: the rows below carry their own full day and
             time in their labels, so a screen reader meeting this would
             hear the day sliced twice. It is a visual grouping. */
          sh.setAttribute('aria-hidden', 'true');
          card.appendChild(sh);
        }
        var row = scEl('button', 'row');
        row.dataset.id = it.id;
        row.dataset.s = it.s;
        row.dataset.e = it.e;

        /* WHAT KIND, above HOW LONG. Both live in the measure's own
           52px, so the left gutter answers the two things about a block
           that are not its name and the name loses no width to either.
           Rendering it in its own column instead was built and looked
           at: it pushes the name 34px right and leaves the measure's
           little rule floating in the middle of a gutter, detached from
           anything.

           aria-hidden, because the name is the next thing in the row
           and a screen reader announcing "coffee, coffee" is the glyph
           charging twice for one fact. */
        var kind = scIconFor(it.n);
        var ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        ic.setAttribute('class', 'ic');
        ic.setAttribute('viewBox', '0 0 24 24');
        ic.setAttribute('aria-hidden', 'true');
        /* Named on the element. The glyphs are anonymous paths, so
           without this there is no way to assert from the outside that
           "walk the dog" reached the paw and not the walker — and the
           ordering of ICON_MATCH is the entire mechanism. */
        ic.setAttribute('data-icon', kind);
        ic.innerHTML = BLOCK_ICON[kind];
        row.appendChild(ic);

        /* ── the measure is gone, and this is what replaced it ──
           It was a rule as long as the block is, and it was the one
           thing this list said that a list cannot. What killed it is
           that the row now PRINTS the range: with `10:00–18:00` sitting
           on the line above, a 52px bar and a 3px stub were saying a
           second time what the numbers already say, and on a normal
           morning almost every block is short enough that the rule read
           as a stray dash beside the glyph rather than as a length.

           But it was also the ONLY mark on this screen for a block the
           tally has counted, so removing it silently would have made a
           finished block identical to an untouched one. That state moves
           onto a tick beside the glyph — drawn only when the block is
           done, so an ordinary row's gutter holds one thing. */
        if (blockLog[scDay(scDateOfDow(d))]
            && blockLog[scDay(scDateOfDow(d))][it.id]) {
          var tk = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          tk.setAttribute('class', 'tick');
          tk.setAttribute('viewBox', '0 0 24 24');
          tk.setAttribute('aria-hidden', 'true');
          tk.innerHTML = '<path d="M4.5 12.8l5.2 5.2L19.5 6"/>';
          row.appendChild(tk);
        }

        /* A block the tally has counted reads as done HERE too. The
           two records must never disagree about the same morning —
           that was the whole reason the link runs both ways. */
        var bd = scDay(scDateOfDow(d));
        if (blockLog[bd] && blockLog[bd][it.id]) row.classList.add('is-done');

        /* THE TIME GOES ABOVE THE NAME, and in the source as well as in
           the grid. It used to sit in a third column at the right
           margin, so reading a row meant going across to the edge and
           back for every line; stacked, a row reads down in one
           movement \u2014 when, then what. Appended in this order because a
           screen reader and a tab order follow the source, and a time
           announced after the name it is drawn above is the same
           mistake pointing the other way. */
        row.appendChild(scEl('span', 't', scHHMM(it.s) + '\u2013' + scHHMM(it.e)));
        var n = scEl('span', 'n', it.n);
        if (it.r) n.appendChild(scEl('em', null, it.r));
        row.appendChild(n);
        row.setAttribute('aria-label',
          it.n + ', ' + FULL[d] + ' ' + scRangeLong(it.s, it.e) + (it.r ? ', ' + it.r : '') + '. Edit.');
        /* ── tap edits, a long press ticks ──
           The week is where you CHANGE the schedule, so the tap keeps
           doing what it always did. Marking a block done is the tally's
           job and it stays the tally's job; this is the same act
           reachable from the row it is about, for the mornings when
           the block in front of you is the one you just finished.

           550ms, and it cancels on any movement over 10px. Without the
           move guard every scroll of the deck that starts on a row
           fires it — the finger is on a row for the whole gesture, and
           the gesture is a scroll. `moved` is checked rather than
           pointercancel because a scroll inside .day-card does not
           always cancel the pointer on the row it began in. */
        var held = null, hx = 0, hy = 0, moved = false, fired = false;
        var drop = function () {
          if (held) { clearTimeout(held); held = null; }
        };
        row.addEventListener('pointerdown', function (ev) {
          hx = ev.clientX; hy = ev.clientY; moved = false; fired = false;
          drop();
          held = setTimeout(function () {
            held = null;
            if (moved) return;
            fired = true;
            var bd = scDay(scDateOfDow(d));
            var was = !!(blockLog[bd] && blockLog[bd][it.id]);
            if (!scSetBlockDone(bd, it, d, !was)) {
              scToast('That day is not open yet', false);
              return;
            }
            /* Haptic where there is one. A long press with no
               acknowledgement is indistinguishable from a press that
               did not register, and the row only redraws a frame
               later. */
            if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
            scRender();
            scToast(was ? it.n + ' unticked' : it.n + ' done', false);
          }, 550);
        });
        row.addEventListener('pointermove', function (ev) {
          if (Math.abs(ev.clientX - hx) > 10 || Math.abs(ev.clientY - hy) > 10) {
            moved = true;
            drop();
          }
        });
        row.addEventListener('pointerup', drop);
        row.addEventListener('pointercancel', function () { moved = true; drop(); });
        row.addEventListener('click', function () {
          /* A long press has already done its work; without this the
             finger lifting then opens the editor on top of the tick.
             An explicit flag rather than an inference from the timer:
             `held` is null after an ordinary tap too, so a check on it
             would swallow every click. */
          if (fired) { fired = false; return; }
          scEditSheet(it, d);
        });
        /* A long press reaches neither a keyboard nor a screen reader,
           and it is deliberately NOT the only way to tick a block: the
           tally does the same thing with a plain press and always did.
           This is a shortcut from the row the block is on, not a
           feature that lives here. */
        card.appendChild(row);
      });

      front.appendChild(card);
      flip.appendChild(front);
      /* Built for every card, not only the open one, for the same
         reason the rows are: opening a day moves a class and nothing
         re-renders, so whatever the new card needs has to be there
         already. */
      flip.appendChild(scObjBack(d));
      li.appendChild(flip);
      /* OUTSIDE the flip, so it is not turned away with the front: a
         shut card is pressed to be opened whichever way its faces
         happen to be pointing. */
      var face = scEl('button', 'wk-face');
      face.setAttribute('aria-label', 'Open ' + FULL[d]);
      face.addEventListener('click', function () { scDeckGo(d); });
      li.appendChild(face);
      rail.appendChild(li);
    });

    /* Seven dots. With two cards on screen and five off it, nothing
       else on the page says how many there are or where you stand. */
    var dots = scEl('div', 'wk-dots');
    dots.setAttribute('aria-hidden', 'true');
    ORDER.forEach(function (d) {
      dots.appendChild(scEl('i', d === open ? 'on' : null));
    });
    /* Replaced, not appended. scRender runs on every edit and on the
       half-minute tick that crosses midnight, and an insertBefore with
       no removal leaves a new row of dots under the last one every
       time — silent, and only visible after a few edits. */
    var was = document.querySelector('.wk-dots');
    if (was) was.parentNode.removeChild(was);
    /* After the WINDOW. Inside it they would be clipped along with the
       track, and they are an indicator of the deck rather than part of
       it. */
    var win = $('scDeckWin');
    win.parentNode.insertBefore(dots, win.nextSibling);

    scDeckFit(rail, dots);
    scDeckJump();

    scLive();
  }

  /* ── the deck's height is measured, never set ──
     The gap between the top of the rail and the top of the bar, less
     what the dots take. Written as a constant it would be the same
     number in a place that cannot see the hero reflow, the notch
     change, or the type scale move — and it would be wrong on the first
     phone that did any of those. */
  /* ── the open card is centred by MOVING THE TRACK ──
     Not by scrolling. A scroller clamps at 0, so the first card could
     never reach the middle, and the three fixes for that each behaved
     differently in Safari — the last of them silently, because a
     shorthand it could not parse simply vanished. A transform is one
     number: half the window minus the middle of the card, measured
     inside the track. It cannot clamp and there is nothing for an
     engine to leave out.

     `offsetLeft` is safe here where it was not before: the rail is the
     card's offsetParent, so it is a position INSIDE the track, which is
     exactly the space the transform moves. */
  function scDeckCentre() {
    var win = $('scDeckWin'), rail = $('scRail');
    var mine = rail.querySelector('.day.is-open');
    if (!mine || !win.clientWidth) return;

    /* ── WORKED OUT, not read off the page ──
       Reading `offsetLeft` and `offsetWidth` here is wrong and it was
       wrong quietly: the card's width is transitioned from 76px to
       268px, so a read taken the instant the class moves still
       describes the layout BEFORE it, and the deck centred each card
       where the previous one had been. Measured at 96px out on every
       day of the week, with the applied transform -551 where -455 was
       right — a constant error, which is what an off-by-one layout
       looks like when every card is the same size.

       The three widths are tokens, so this is arithmetic on numbers the
       stylesheet owns: index of the open card, shut cards and gaps
       before it, then half an open card. Nothing to be stale. */
    var cs = getComputedStyle(rail);
    var shut = parseFloat(cs.getPropertyValue('--wk-shut'));
    var open = parseFloat(cs.getPropertyValue('--wk-open'));
    var gap = parseFloat(cs.getPropertyValue('--wk-gap'));
    if (!(shut > 0 && open > 0)) return;
    var i = [].indexOf.call(rail.children, mine);
    var x = win.clientWidth / 2 - (i * (shut + gap) + open / 2);
    rail.style.transform = 'translateX(' + Math.round(x) + 'px)';
  }

  /* Arriving at the screen is instant — a week that appears already
     mid-animation looks like it was left running while you were
     somewhere else. Only a press animates. */
  function scDeckJump() {
    var rail = $('scRail');
    rail.style.transition = 'none';
    scDeckCentre();
    /* Read back to force the style to land before the transition is
       restored, or the browser coalesces both and animates anyway. */
    void rail.offsetWidth;
    rail.style.transition = '';
  }

  /* Open a day and bring it to the middle. The classes move first and
     the centring runs after, because opening takes a card from 76px to
     268px and the track's own layout changes with it. */
  function scDeckGo(d) {
    if (d === scOpenDay()) return;
    openDay = d;
    scDeckOpen();
    scDeckCentre();
  }

  function scDeckOpen() {
    var open = scOpenDay();
    var rail = $('scRail');
    [].forEach.call(rail.children, function (li) {
      var d = +li.dataset.d;
      var mine = d === open;
      li.classList.toggle('is-open', mine);
      var nm = li.querySelector('.day-name');
      if (nm) {
        nm.textContent = mine ? FULL[d] : ABBR[d];
        nm.setAttribute('aria-label',
          (mine ? 'Add a block on ' : 'Open ') + FULL[d]);
      }
      /* The face is put away by CSS on the open card rather than
         removed, so all this has to do is keep the NAME honest: a stale
         "Open Friday" on the card that is already open tells a screen
         reader the wrong thing about the one card it is on. */
      var fc = li.querySelector('.wk-face');
      if (fc) fc.setAttribute('aria-label', 'Open ' + FULL[d]);
    });
    var dots = document.querySelector('.wk-dots');
    if (dots) {
      [].forEach.call(dots.children, function (i, n) {
        i.classList.toggle('on', ORDER[n] === open);
      });
    }
  }

  function scDeckFit(rail, dots) {
    var win = $('scDeckWin');
    var bar = document.querySelector('.bar');
    var top = win.getBoundingClientRect().top;
    var floor = bar ? bar.getBoundingClientRect().top : window.innerHeight;
    /* The dots' own margin is not in its height, and the bar's glass
       pill reaches above the box `getBoundingClientRect` reports for it
       — so the first measurement left the dots sitting inside the bar.
       Read the margin rather than adding a number that happens to work
       at this type scale. */
    var give = 24;
    if (dots) {
      var ds = getComputedStyle(dots);
      give = dots.getBoundingClientRect().height
        + parseFloat(ds.marginTop || 0) + parseFloat(ds.marginBottom || 0) + 18;
    }
    /* On the WINDOW, because that is the box with a fixed size; the
       track inside it is as tall as the window and as wide as it needs
       to be. */
    win.style.height = Math.max(260, floor - top - give) + 'px';
  }

  /* ── morning, afternoon, evening ──
     Noon and five o'clock, which is where the words already sit in
     English rather than anywhere this app decided. A session with
     nothing in it is dropped rather than drawn empty: an "Afternoon"
     heading over no rows is furniture, and on a real week at least one
     of the three is empty most days. */
  var SESSION = [
    { k: 'Morning',   a: 0,    b: 720 },
    { k: 'Afternoon', a: 720,  b: 1020 },
    { k: 'Evening',   a: 1020, b: 1440 }
  ];
  function scSessions(rows) {
    return SESSION.map(function (s) {
      return { s: s, rows: rows.filter(function (it) {
        return it.s >= s.a && it.s < s.b; }) };
    }).filter(function (g) { return g.rows.length; });
  }

  /* ═══════════════════════════════════════════════════════════
     THE OBJECTIVES

     What the day is FOR, as against what is on it. The schedule says
     when things happen; this says which two or three of them actually
     matter, in the order they should be done. It lives on the back of
     the day's own card because it is the same day seen from the other
     side, and a second screen for three lines would be a tab you stop
     opening.

     ── PER DATE, not per weekday ──
     The schedule repeats: every Monday has the same shape, which is
     what makes it a shape. An objective does not — "the thing that
     matters today" is a decision you take on the day, and one that
     repeated every Monday would be a routine wearing an objective's
     clothes. So these are keyed by the real date, and a card in the
     deck shows the objectives of the date that weekday falls on THIS
     week.

     ── AND THEY ARE ORDERED ──
     Position is priority and the first is the frog: the one you would
     rather not start. Nothing here sorts itself — the order is the
     decision, and re-ranking is a press.
     ═══════════════════════════════════════════════════════════ */

  /* A flag on a post: the thing you are heading for. Drawn rather than
     labelled, like every other glyph on this screen. */
  var OBJ_MARK = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M6 21V4M6 4.6h11.5l-2.3 3.7 2.3 3.7H6"/></svg>';

  var OBJ_KEY = 'sched.obj.v1';
  var objLog = {};   /* date -> [{ id, n, tgt, done }] */

  function scObjLoad() {
    objLog = scReadJSON(OBJ_KEY, {});
    if (!objLog || typeof objLog !== 'object' || Array.isArray(objLog)) objLog = {};
    /* ── kept to a window, unlike the schedule ──
       This is one record per DATE, so left alone it grows forever, and
       an objective from March is not a record anybody wants back — it
       is a decision that was taken and is over. Ninety days is long
       enough to look back over a season and short enough that the key
       cannot quietly become the biggest thing in this browser.

       Repaired rather than rejected: a damaged day is dropped and the
       rest of the record survives, because the days are independent and
       throwing the object away would take a season with it. */
    var cut = new Date();
    cut.setDate(cut.getDate() - 90);
    var floor = scDay(cut);
    Object.keys(objLog).forEach(function (k) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || k < floor
          || !Array.isArray(objLog[k])) { delete objLog[k]; return; }
      objLog[k] = objLog[k].filter(function (o) {
        return o && typeof o === 'object' && typeof o.n === 'string' && o.n;
      }).map(function (o) {
        return { id: o.id || scRand(10, HEX_A), n: String(o.n).slice(0, 60),
                 done: !!o.done };
      });
      if (!objLog[k].length) delete objLog[k];
    });
  }
  function scObjSave() { scWriteJSON(OBJ_KEY, objLog); }

  function scObjFor(day) { return objLog[day] || []; }

  /* Five, and the ceiling is the feature. A list of twelve objectives
     is a schedule with the times taken off — the whole point is that
     naming the two or three that matter costs you the rest. */
  var OBJ_MAX = 5;

  /* ── a SENTENCE, not a name and a number ──
     "Call a hundred clients" is the objective; there is no field for
     how much, because the amount is already in the words and a form
     that asked for it separately would make you take a decision apart
     to type it in. The glyph is worked out from the same sentence, so
     nothing is set twice. */
  function scObjAdd(day, name) {
    name = String(name || '').trim();
    if (!name) return false;
    var all = objLog[day] || (objLog[day] = []);
    if (all.length >= OBJ_MAX) return false;
    all.push({ id: scRand(10, HEX_A), n: name.slice(0, 60), done: false });
    scObjSave();
    return true;
  }
  function scObjDrop(day, id) {
    if (!objLog[day]) return;
    objLog[day] = objLog[day].filter(function (o) { return o.id !== id; });
    if (!objLog[day].length) delete objLog[day];
    scObjSave();
  }
  /* Re-ranking is one move and it is always the same move: make this
     the frog. Up-and-down arrows on a list of at most five is four
     presses to do what one should. */
  function scObjFirst(day, id) {
    var all = objLog[day];
    if (!all) return;
    var i = all.findIndex(function (o) { return o.id === id; });
    if (i <= 0) return;
    all.unshift(all.splice(i, 1)[0]);
    scObjSave();
  }
  function scObjToggle(day, id) {
    var all = objLog[day];
    if (!all) return;
    all.forEach(function (o) { if (o.id === id) o.done = !o.done; });
    scObjSave();
  }

  /* ── the back of the card ──
     Glyphs and figures, and deliberately no prose. A row of writing
     here would be the schedule again with the times taken off; what
     you want at a glance is WHICH thing and HOW MUCH, and both of
     those are drawn. The name is still on the element for a screen
     reader — the tally cards made exactly this trade and the rule that
     came out of it was that the glyph may BE the name on screen, and
     must never be the only place the name exists.

     Rank in the gutter, and the first is the accent: the frog is
     whatever you would rather not start, and this screen's only job is
     to keep saying which one that is. */
  function scObjBack(d) {
    var day = scDay(scDateOfDow(d));
    var back = scEl('div', 'wk-back');

    /* ── the foil edge ──
       A light that travels round the rim. It is a real element rather
       than a pseudo because it needs a CHILD: the ring is a mask on the
       outer box, and the thing that turns has to be masked BY it —
       rotating the mask itself would swing a rectangular ring round on
       its corner. Two boxes, one turning inside the other's shape. */
    var foil = scEl('i', 'ob-foil');
    foil.setAttribute('aria-hidden', 'true');
    foil.appendChild(scEl('i'));
    back.appendChild(foil);

    var head = scEl('div', 'wk-h');
    /* NOT `.day-name`. The front already owns that class, and a second
       one per card made every query for the week's day names return two
       — the deck read as "Tuesday, Tuesday" and today counted twice
       against the rule that says what the accent is spent on. It is
       also plain ink here: the frog's rank is this face's one live
       thing, and a red heading over it would be two. */
    var t = scEl('button', 'ob-day', FULL[d]);
    t.setAttribute('aria-label', 'Back to ' + FULL[d] + '\u2019s schedule');
    t.addEventListener('click', function () { scFlip(d, false); });
    head.appendChild(t);
    var turn = scEl('button', 'wk-turn');
    turn.setAttribute('aria-label', 'Back to the schedule');
    turn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M4 7h16M4 12h16M4 17h10"/></svg>';
    turn.addEventListener('click', function () { scFlip(d, false); });
    head.appendChild(turn);
    back.appendChild(head);

    var list = scEl('ol', 'ob-list');
    var all = scObjFor(day);
    all.forEach(function (o, i) {
      var li = scEl('li');
      var b = scEl('button', 'ob' + (o.done ? ' is-done' : '')
        + (i === 0 ? ' is-frog' : ''));
      /* SMALL, and it is a marker rather than a picture: the sentence
         beside it is what you read, and a 30px glyph next to fifteen
         words made the drawing the loudest thing on a face whose whole
         job is the words. */
      var kind = scIconFor(o.n);
      var ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ic.setAttribute('class', 'ob-ic');
      ic.setAttribute('viewBox', '0 0 24 24');
      ic.setAttribute('aria-hidden', 'true');
      ic.setAttribute('data-icon', kind);
      ic.innerHTML = BLOCK_ICON[kind];
      b.appendChild(ic);

      b.appendChild(scEl('span', 'ob-t', o.n));

      /* The tick is a mark that APPEARS, the same as a finished block
         on the front: an untouched row's gutter holds one thing. */
      var tk = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      tk.setAttribute('class', 'ob-tick');
      tk.setAttribute('viewBox', '0 0 24 24');
      tk.setAttribute('aria-hidden', 'true');
      tk.innerHTML = '<path d="M4.5 12.8l5.2 5.2L19.5 6"/>';
      b.appendChild(tk);

      /* Everything the drawing says, said. Without this a screen reader
         meets a list of buttons called "1" and "2". */
      b.setAttribute('aria-label', (i + 1) + '. ' + o.n
        + (i === 0 ? ', the main one' : '') + '. '
        + (o.done ? 'Done' : 'Not done') + '. Tap to mark.');
      b.setAttribute('aria-pressed', o.done ? 'true' : 'false');
      b.addEventListener('click', function () {
        scObjToggle(day, o.id);
        scRender();
        scFlip(d, true, true);
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    back.appendChild(list);

    if (all.length < OBJ_MAX) {
      var add = scEl('button', 'ob-add');
      add.setAttribute('aria-label', 'Add an objective for ' + FULL[d]);
      add.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
        + '<path d="M12 5v14M5 12h14"/></svg>';
      add.addEventListener('click', function () { scObjSheet(d, day); });
      back.appendChild(add);
    }
    /* The one line of prose on this face, and only when there is
       nothing else on it: a blank card with a plus on it says what to
       press and not what the thing is for. */
    if (!all.length) {
      back.appendChild(scEl('p', 'ob-empty',
        'What today is for. Two or three, hardest first.'));
    }
    return back;
  }

  /* ── adding one, and re-ranking it ──
     One sheet for the whole of it: a field to add, and every objective
     already there with the two things you would want to do to it. A
     separate edit screen for a list of at most five would be a second
     place for the same five things to disagree.

     Delete is final here and there is no bin, which is the reminders'
     exception rather than a new one: a bin protects a record you cannot
     rebuild, and an objective you have taken off today's card is a
     decision you have just changed your mind about. */
  function scObjSheet(d, day) {
    scSheet('Objectives \u00b7 ' + FULL[d], function (body) {
      var all = scObjFor(day);
      if (all.length) {
        body.appendChild(scEl('span', 'label', 'On the card'));
        all.forEach(function (o, i) {
          var row = scEl('div', 'ob-edit');
          var kind = scIconFor(o.n);
          var ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          ic.setAttribute('class', 'ic');
          ic.setAttribute('viewBox', '0 0 24 24');
          ic.setAttribute('aria-hidden', 'true');
          ic.innerHTML = BLOCK_ICON[kind];
          row.appendChild(ic);
          row.appendChild(scEl('span', 'ob-e-n', o.n));
          /* One move, always the same move: make this the frog. Up and
             down arrows on five rows is four presses to do what one
             should, and the only rank anybody actually argues about is
             which one is first. */
          if (i > 0) {
            row.appendChild(scBtn('off', 'First', function () {
              scObjFirst(day, o.id);
              scClose();
              scRender();
              scFlip(d, true, true);
            }));
          }
          row.appendChild(scBtn('bad', 'Remove', function () {
            scObjDrop(day, o.id);
            scClose();
            scRender();
            scFlip(d, true, true);
          }));
          body.appendChild(row);
        });
      }

      body.appendChild(scEl('span', 'label', 'Add one'));
      /* ONE field. Say the whole thing — "Call a hundred clients" — and
         the glyph comes out of the same sentence. A second box for the
         amount would be asking you to take a decision apart in order to
         type it in, and then to keep the two halves in step. */
      var f = scEl('input', 'field');
      f.type = 'text';
      f.placeholder = 'Call a hundred clients\u2026';
      f.maxLength = 60;
      body.appendChild(f);

      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Done', scClose));
      acts.appendChild(scBtn('go', 'Add', function () {
        if (!scObjAdd(day, f.value)) {
          scToast(f.value.trim() ? 'Five is the most' : 'Give it a name', false);
          return;
        }
        scClose();
        scRender();
        scFlip(d, true, true);
      }));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); }, 260);
    });
  }

  /* Turning is a class, and the state is not stored: an objective is
     for today and a card found face-down tomorrow morning would be the
     app remembering the wrong half of a decision. */
  function scFlip(d, on, quiet) {
    var li = $('scRail').querySelector('.day[data-d="' + d + '"]');
    if (!li) return;
    li.classList.toggle('is-flipped', !!on);
    if (!quiet && navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
  }

  /* The live pass touches classes and one line of text, never the DOM's
     shape — it runs every half minute, and rebuilding the card that
     often would fight a finger that is in the middle of scrolling it. */
  function scLive() {
    if (new Date().toDateString() !== painted) { scRender(); return; }

    /* The ring and the tally are different drawings of the same
       half-minute pass, and each is the only thing on screen when it is
       up — so the one that is showing repaints and the rest of this
       function has nothing to do.

       The tally's guard is not just an optimisation. Everything below
       un-hides the hero, and this runs every thirty seconds: without
       the early return the week's figure comes back on top of the
       tally half a minute after you switch to it, which is the sort of
       fault that only appears if you sit and look at the screen. */
    if (view === 'ring') { scPaintRing(); scPaintRingList(); return; }
    if (view === 'tally') { scPaintTally(); return; }
    if (view === 'friends') { scPaintFriends(); return; }

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

  /* ═══════════════════════════════════════════════════════════
     THEMES

     Seven complete token sets. Every one of them was measured on
     composited pixels at the size the type actually ships — 4.5:1 or
     it is not in this list. The greys are per-theme rather than shared
     for exactly that reason: --dim reads 8.9:1 on white and 1.4:1 on
     indigo, so a palette that reuses another palette's greys has not
     been checked, it has been guessed.

     The numbers in each note are the worst piece of type on that
     ground, and they are the argument: every dark theme here reads
     better than the white one that ships, because a saturated hue on
     near-black has room a saturated hue on white does not.
     ═══════════════════════════════════════════════════════════ */

  var THEMES = [
    { id:'paper', name:'Paper', kind:'light', note:'White. 4.7:1',
      t:{ '--paper':'#ffffff', '--ink':'#111111', '--dim':'#4a4a4a', '--spent':'#737373',
          '--red':'#e2231a', '--hair':'#dcdcdc', '--tick-off':'#ececec',
          '--bad':'#e2231a',
          '--on-red':'#ffffff',
          '--g0':'#ffffff', '--g1':'transparent', '--g2':'transparent' } },

    { id:'nebula', name:'Nebula', kind:'dark', note:'Violet on indigo. 6.7:1',
      t:{ '--paper':'#0A0B2E', '--ink':'#F4F1FF', '--dim':'#BDB6E8', '--spent':'#9A92CE',
          '--red':'#C08BFF', '--hair':'#2A2A5C', '--tick-off':'#26264F',
          '--bad':'#FF7A85',
          '--on-red':'#0A0B2E',
          '--g0':'#0A0B2E', '--g1':'rgba(78,42,190,.55)', '--g2':'rgba(160,60,190,.30)' } },

    { id:'ember', name:'Ember', kind:'dark', note:'Coral on indigo. 8:1',
      t:{ '--paper':'#0C0D33', '--ink':'#FFF1EA', '--dim':'#F3C2AC', '--spent':'#D79C82',
          '--red':'#FF8A5B', '--hair':'#2E2A5E', '--tick-off':'#282652',
          '--bad':'#FF4A6B',
          '--on-red':'#0C0D33',
          '--g0':'#0C0D33', '--g1':'rgba(220,90,50,.34)', '--g2':'rgba(90,40,150,.42)' } },

    { id:'aurora', name:'Aurora', kind:'dark', note:'Green on near-black. 8.6:1',
      t:{ '--paper':'#04141A', '--ink':'#E8FBF4', '--dim':'#9FD9C7', '--spent':'#7FBBA9',
          '--red':'#4FE0A8', '--hair':'#123038', '--tick-off':'#102A31',
          '--bad':'#FF8A8A',
          '--on-red':'#04141A',
          '--g0':'#04141A', '--g1':'rgba(18,150,130,.40)', '--g2':'rgba(30,90,150,.34)' } },

    { id:'solar', name:'Solar', kind:'dark', note:'Amber, no blue anywhere. 7.9:1',
      t:{ '--paper':'#15100A', '--ink':'#FFF6E6', '--dim':'#E2C89C', '--spent':'#BFA47C',
          '--red':'#FFB020', '--hair':'#3A2E1C', '--tick-off':'#332818',
          '--bad':'#FF8A7A',
          '--on-red':'#15100A',
          '--g0':'#15100A', '--g1':'rgba(200,120,20,.34)', '--g2':'rgba(120,50,10,.40)' } },

    { id:'ice', name:'Ice', kind:'dark', note:'Pale cyan on slate. 7.2:1',
      t:{ '--paper':'#0D1420', '--ink':'#EAF3FB', '--dim':'#A9C2D8', '--spent':'#8AA5BD',
          '--red':'#5CC8F8', '--hair':'#233246', '--tick-off':'#1E2C3E',
          '--bad':'#FF8A8A',
          '--on-red':'#0D1420',
          '--g0':'#0D1420', '--g1':'rgba(40,110,180,.42)', '--g2':'rgba(90,90,190,.28)' } },

    { id:'plum', name:'Plum', kind:'dark', note:'Rose on aubergine. 6.7:1',
      t:{ '--paper':'#1A0B1F', '--ink':'#FCEDF5', '--dim':'#DDAEC6', '--spent':'#BC8CA6',
          '--red':'#FF6FA5', '--hair':'#3B1F42', '--tick-off':'#341B3B',
          '--bad':'#FFA07A',
          '--on-red':'#1A0B1F',
          '--g0':'#1A0B1F', '--g1':'rgba(160,30,110,.40)', '--g2':'rgba(90,30,140,.38)' } },

    /* ── the light six ──
       A light theme cannot simply reuse a dark one's accent. There the
       accent is the pale colour standing off a near-black page; here the
       pale colour is the WASH — where it belongs, since a gradient is
       never asked to be legible — and the accent is the deep end of the
       same hue. The reference palettes prove why: their pale hues
       measure 1.49:1 and 2.74:1 on their own grounds and cannot carry a
       word between them.

       So the wash, the accent and the ink are one hue at three depths,
       and the page reads as one thing rather than as white with a tint
       dropped on it. The gradient is weighted to the FOOT, because that
       is the third of the screen with nothing to read in it. */
    { id:'blush', name:'Blush', kind:'light', note:'Peach on white. 5.2:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#1C110D', '--dim':'#4A3229', '--spent':'#6A5047',
          '--red':'#C0402A', '--hair':'#E9DCD6', '--tick-off':'#F0E4DE',
          '--bad':'#A81438', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(248,138,100,1)',
          '--g2':'rgba(150,142,138,.34)', '--g3':'rgba(190,104,78,.92)' } },

    { id:'slate', name:'Slate', kind:'light', note:'Blue-grey on white. 7.2:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#111524', '--dim':'#333A52', '--spent':'#4E5772',
          '--red':'#2F4DA8', '--hair':'#DCDFE7', '--tick-off':'#E7E9EF',
          '--bad':'#B01430', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(88,112,132,1)',
          '--g2':'rgba(96,110,132,.36)', '--g3':'rgba(52,66,102,.92)' } },

    { id:'linen', name:'Linen', kind:'light', note:'Warm neutral. 6.7:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#191410', '--dim':'#463C34', '--spent':'#665A50',
          '--red':'#7A4A2E', '--hair':'#E6E0D9', '--tick-off':'#EFEAE4',
          '--bad':'#A81438', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(196,166,128,1)',
          '--g2':'rgba(160,148,134,.32)', '--g3':'rgba(152,132,108,.90)' } },

    { id:'mist', name:'Mist', kind:'light', note:'Cyan into teal. 6.1:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#0B1819', '--dim':'#28403F', '--spent':'#455E5E',
          '--red':'#0F6E6A', '--hair':'#D8E4E4', '--tick-off':'#E5EDED',
          '--bad':'#B01430', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(88,184,184,1)',
          '--g2':'rgba(104,152,172,.34)', '--g3':'rgba(52,110,140,.90)' } },

    { id:'bloom', name:'Bloom', kind:'light', note:'Pink into lilac. 7:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#1B0F1A', '--dim':'#4A2A3E', '--spent':'#6A4860',
          '--red':'#9B2C70', '--hair':'#EBDCE6', '--tick-off':'#F2E7EE',
          '--bad':'#B8241C', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(246,132,176,1)',
          '--g2':'rgba(178,158,224,.34)', '--g3':'rgba(150,110,206,.90)' } },

    { id:'sand', name:'Sand', kind:'light', note:'Gold into bronze. 5.9:1',
      t:{ '--paper':'#FFFFFF', '--ink':'#191509', '--dim':'#443C22', '--spent':'#63593E',
          '--red':'#8A5A0B', '--hair':'#E9E2CE', '--tick-off':'#F1ECDD',
          '--bad':'#AE1B2E', '--on-red':'#FFFFFF',
          '--g0':'#FFFFFF', '--g1':'rgba(242,184,68,1)',
          '--g2':'rgba(176,158,116,.34)', '--g3':'rgba(186,146,72,.90)' } },
  ];

  var THEME_KEY = 'sched.theme.v1';
  var theme = 'paper';

  function scTheme(id) {
    var t = null;
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) t = THEMES[i];
    return t || THEMES[0];
  }

  /* Written as inline custom properties on the root, which is the one
     place that beats the stylesheet's :root without !important and
     without a second copy of every rule. Nothing else in the app knows
     a theme exists — every colour it draws already came from a token,
     which is what the previous pass was for. */
  /* Every token a theme is allowed to set, named once. scPaint CLEARS
     all of them before writing the new set — without that, a token one
     theme names and another does not is inherited from whatever was up
     last: switch from a light theme that sets --g3 to a dark one that
     does not, and the dark page keeps the light one's third wash. The
     symptom is a colour that only appears in one order of clicks, which
     is close to impossible to find by looking. */
  var TOKENS = ['--paper', '--ink', '--dim', '--spent', '--red', '--hair',
                '--tick-off', '--on-red', '--bad',
                '--g0', '--g1', '--g2', '--g3'];

  function scPaint(id, save) {
    var t = scTheme(id);
    theme = t.id;
    var r = document.documentElement.style;
    TOKENS.forEach(function (k) { r.removeProperty(k); });
    for (var k in t.t) if (t.t.hasOwnProperty(k)) r.setProperty(k, t.t[k]);

    /* The browser's own chrome — the status bar, the URL bar, the
       overscroll gutter — takes its colour from these two and nothing
       else. Left on white under a dark theme the page ends in a bright
       band the design never asked for. */
    var cs = document.querySelector('meta[name="color-scheme"]');
    if (cs) cs.setAttribute('content', t.id === 'paper' ? 'light' : 'dark');
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', t.t['--g0']);

    /* The ring draws itself in SVG, and SVG takes a literal — so it has
       to be told to read the tokens again. The rail is pure CSS and has
       already changed by the time this line runs. */
    if (view === 'ring') scPaintRing();
    if (typeof scPaintTabFace === 'function') scPaintTabFace();
    if (save) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) {} }
    /* Your face and your crown are drawn on your friends' screens out
       of the two hexes in your record, so a palette they never see
       still has to reach them. Debounced with everything else — the
       theme picker stays open while you compare thirteen of them, and
       thirteen presses must not be thirteen writes. */
    if (save) scPush();
  }

  /* ═══════════════════════════════════════════════════════════
     THE TALLY

     Five things a day, and the list is CODE, NOT DATA — fixed,
     identical, not editable by anyone, the same rule the habits screen
     holds its six under. Here it is load-bearing rather than tidy: the
     whole point of these five is that they are the same five for
     everybody, so a leaderboard over them compares like with like. A
     list you could edit is two people quoting unrelated numbers at each
     other.

     `from` names the blocks that satisfy an item. Two blocks may feed
     one: an outdoor walk and something read are both Mind, and either
     is enough.

     `kind` is the difference between doing a thing and recording a
     number. Both are one tick — the tick means YOU LOGGED IT, never
     that you hit a target. That is what keeps the quantities off the
     wire when the friends half lands, and it is what stops this
     ranking people on how far they walked.
     ═══════════════════════════════════════════════════════════ */

  var TICK_KEY = 'sched.tick.v1';
  var LOG_KEY = 'sched.log.v1';

  /* One glyph per item, and like TALLY itself this is CODE rather than
     data: the five are fixed and identical for everybody, so their
     marks can be too. Drawn to the bar's idiom — stroke, round caps,
     no fill, a 24 box.

     THE GLYPH IS THE NAME NOW. The card used to carry `Steps` at 17px
     bold in one corner and nothing in the other; with a mark opposite
     it, the two were the same thing said twice, and the word was the
     half that could go. The name has not gone from the card's
     ACCESSIBLE name — the aria-label below still opens with it — so
     this is a change to what is drawn and not to what is said.

     Steps is two prints rather than one, and both are the same path
     scaled: a footprint drawn small a second time lost the taper that
     makes the first one read, and two shapes that are nearly the same
     but not quite look like a mistake instead of a pair. The first cut
     placed them at .55 and they came out as specks on the real card —
     the enlargement said they were fine, which is exactly why a glyph
     is judged at the size it is drawn.

     FOOT and STEPS themselves are defined up beside BLOCK_ICON, because
     the week's Walk row draws the same footprints and a `var` assigned
     further down the file than the object that reads it is `undefined`
     at the moment the object is built. */

  var TALLY_ICON = {
    t: '<path d="M6.5 9v6M3.5 10.5v3M17.5 9v6M20.5 10.5v3M6.5 12h11"/>',
    m: '<path d="M12 6.6v12.8M12 6.6C10.4 5.1 8.3 4.6 4 5.1v12.8c4.3-.5 6.4 0 8 1.5'
       + 'M12 6.6C13.6 5.1 15.7 4.6 20 5.1v12.8c-4.3-.5-6.4 0-8 1.5"/>',
    p: STEPS,
    f: '<path d="M3.5 12.5h17a8.5 8.5 0 01-17 0zM9 5.4v3.1M12.5 4.4v4.1M16 6v2.5"/>',
    w: '<path d="M12 3.4c0 0 5.6 6.1 5.6 9.6a5.6 5.6 0 01-11.2 0C6.4 9.5 12 3.4 12 3.4z"/>'
  };

  var TALLY = [
    { id: 't', n: 'Train', s: 'Gym, a run, a session', k: 'do',  from: ['Train'] },
    { id: 'm', n: 'Mind',  s: 'Walk, read, listen',    k: 'do',  from: ['Walk', 'Read'] },
    { id: 'p', n: 'Steps', s: 'Log the number',        k: 'num', unit: '', dp: 0 },
    /* `neu` — a number you do NOT want more of. Every other figure on
       this screen gets called "your best"; doing that to a calorie count
       calls your biggest day a win, which is the opposite of what the
       number is for. Same figure, named without the praise. */
    { id: 'f', n: 'Fuel',  s: 'Log what you ate',      k: 'num', unit: ' kcal', dp: 0, neu: 1 },
    { id: 'w', n: 'Water', s: 'Log what you drank',    k: 'num', unit: ' L', dp: 1 }
  ];

  /* Two records, not one, and they are different KINDS of thing: which
     blocks of your week you finished, and which of the five you logged.
     A block can be done and feed nothing (Trading); an item can be
     logged with no block behind it (Steps). Folding them together would
     make one of the two a special case of the other, and neither is. */
  /* tickLog, not `tick` — the half-minute interval handle further down
     this file is already called that, and two `var tick` in one IIFE
     scope is one binding: `tick = setInterval(...)` wrote a number over
     the day's record, and the first press threw "Cannot create property
     on number '1'". tests/names.js catches duplicate declarations at the
     TOP level and these are inside the wrapper, so nothing saw it.
     Named to pair with blockLog, which is the other half of the same
     record. */
  var tickLog = null;      /* { '2026-09-01': { t:1, p:'8420' } } */
  var blockLog = null;  /* { '2026-09-01': { <block id>: 1 } } */

  /* Local date, never toISOString(). toISOString is UTC, so anywhere
     west of Greenwich it hands back YESTERDAY for most of the evening —
     which would file a tickLog under the wrong day and break a streak
     silently, in the one direction nobody would think to check. */
  function scDay(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + scPad(d.getMonth() + 1) + '-' + scPad(d.getDate());
  }

  function scDayBack(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return scDay(d);
  }

  /* Two days, then the day shuts for good. Long enough to catch an
     evening you missed; short enough that nobody fills in a fortnight
     on a Sunday night, which is the only thing that keeps a shared
     number worth reading. Today counts as day 0. */
  var BACKFILL = 2;
  function scTallyOpen(day) {
    for (var i = 0; i <= BACKFILL; i++) if (scDayBack(i) === day) return true;
    return false;
  }

  /* The DATE this weekday most recently was, looking back over the
     backfill window only. The schedule is a weekly template with no
     dates in it, so a block on Tuesday has to be resolved to a real
     Tuesday before anything can be filed against it — and the only
     Tuesdays that can still be written to are the two days behind
     today. Anything older resolves to today's date and is refused by
     scTallyOpen on the way in, rather than quietly writing to a day
     that has shut. */
  function scDateOfDow(dow) {
    for (var i = 0; i <= BACKFILL; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === dow) return d;
    }
    return new Date();
  }

  function scTickLoad() {
    var read = function (k) {
      try {
        var raw = JSON.parse(localStorage.getItem(k) || '{}');
        return (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
      } catch (e) { return {}; }
    };
    tickLog = read(TICK_KEY);
    blockLog = read(LOG_KEY);
  }
  function scTickSave() {
    try {
      localStorage.setItem(TICK_KEY, JSON.stringify(tickLog));
      localStorage.setItem(LOG_KEY, JSON.stringify(blockLog));
    } catch (e) {}
  }

  function scTicked(day, id) {
    var d = tickLog[day];
    return !!(d && d[id]);
  }

  /* ── the link runs both ways ──
     Finishing the Train block ticks Train, and ticking Train marks the
     Train block finished. It was one-directional at first and that left
     two records disagreeing about the same morning: the tally said you
     trained and the week still showed the block undone. Whichever end
     you touch, both ends move. */
  function scItemsFor(name) {
    return TALLY.filter(function (it) {
      return it.from && it.from.indexOf(name) >= 0;
    });
  }
  function scBlocksFor(item, dow) {
    if (!item.from) return [];
    return scByDay(dow).filter(function (b) { return item.from.indexOf(b.n) >= 0; });
  }

  function scSetTick(day, id, val) {
    if (!scTallyOpen(day)) return false;
    if (!tickLog[day]) tickLog[day] = {};
    if (val) tickLog[day][id] = val; else delete tickLog[day][id];
    if (!Object.keys(tickLog[day]).length) delete tickLog[day];

    /* Carry it back to the week, but only for a day whose weekday we
       can resolve — the schedule is a weekly template, so a tickLog on a
       past date still maps onto that date's own day of the week. */
    var item = TALLY.filter(function (x) { return x.id === id; })[0];
    if (item && item.from) {
      var dow = new Date(day + 'T12:00:00').getDay();
      if (!blockLog[day]) blockLog[day] = {};
      scBlocksFor(item, dow).forEach(function (b) {
        if (val) blockLog[day][b.id] = 1; else delete blockLog[day][b.id];
      });
      if (!Object.keys(blockLog[day]).length) delete blockLog[day];
    }
    scTickSave();
    scPush();
    return true;
  }

  function scSetBlockDone(day, block, dow, val) {
    if (!scTallyOpen(day)) return false;
    if (!blockLog[day]) blockLog[day] = {};
    if (val) blockLog[day][block.id] = 1; else delete blockLog[day][block.id];
    if (!Object.keys(blockLog[day]).length) delete blockLog[day];

    scItemsFor(block.n).forEach(function (item) {
      /* An item fed by two blocks stays ticked while EITHER is done —
         unticking Walk must not undo Mind if Read was also finished. */
      var any = scBlocksFor(item, dow).some(function (b) {
        return blockLog[day] && blockLog[day][b.id];
      });
      if (!tickLog[day]) tickLog[day] = {};
      if (any) tickLog[day][item.id] = 1; else delete tickLog[day][item.id];
      if (!Object.keys(tickLog[day]).length) delete tickLog[day];
    });
    scTickSave();
    scPush();
    return true;
  }

  /* scStreak lives with the counting in FRIENDS now, because the
     leaderboard has to count everybody the same way and there were
     about to be two implementations of it — one walking tickLog for
     you and one walking a record for a friend. The day those two
     disagree the board is wrong and nothing on it says so. */

  /* ── missed its window ──
     The app already knows Train was 06:30 to 07:30 and that it is nine
     o'clock; saying "Tap" there throws that away. Only for items with
     blocks behind them — nothing schedules when you drink water — and
     only for today, because on a backfilled day every window has
     passed and marking all five late would say nothing. */
  function scLate(item) {
    if (!item.from) return false;
    var now = scNowMin();
    var mine = scBlocksFor(item, new Date().getDay());
    if (!mine.length) return false;
    return mine.every(function (b) { return b.e <= now; });
  }

  function scPaintTally() {
    var day = scDay();
    var got = tickLog[day] || {};
    var n = TALLY.filter(function (it) { return got[it.id]; }).length;

    var st = scStreak();
    $('scStreakNum').textContent = '';
    $('scStreakNum').appendChild(document.createTextNode(String(st)));
    $('scStreakNum').appendChild(scEl('i', null, st === 1 ? 'day' : 'days'));
    $('scTallyCap').textContent = n + ' of ' + TALLY.length + ' today';

    var grid = $('scTallyGrid');
    grid.textContent = '';
    TALLY.forEach(function (it, i) {
      var on = !!got[it.id], late = !on && scLate(it);
      var c = scEl('button', 'ty-card' + (on ? ' on' : '') + (late ? ' late' : ''));
      c.dataset.item = it.id;

      /* A RING, and it is the app's own instrument at a smaller scale.
         This screen and the Ring view were two unrelated drawings of
         the same day; five small ones make them the same thing said
         twice at two sizes rather than twice in two languages.

         The glyph is a <g> inside the ring's own 64 box rather than a
         nested <svg>: translate(20 20) centres the 24-unit drawing, and
         one element is one element. */
      c.insertAdjacentHTML('beforeend',
        '<svg class="ty-ring" viewBox="0 0 64 64" aria-hidden="true">'
        + '<circle class="ty-track" cx="32" cy="32" r="26"/>'
        + (on ? '<circle class="ty-arc" cx="32" cy="32" r="26"/>' : '')
        + '<g class="ty-i" transform="translate(20 20)">' + TALLY_ICON[it.id] + '</g>'
        + '</svg>');
      var body = scEl('span', 'ty-body');
      c.appendChild(body);
      body.appendChild(scEl('span', 'ty-nm', it.n));

      /* Once it is done the line under it says where it came from, not
         what to do — a prompt still showing under a finished thing is
         the screen not noticing you did it. */
      var via = null;
      if (on && it.from) {
        var b = scBlocksFor(it, new Date().getDay()).filter(function (x) {
          return blockLog[day] && blockLog[day][x.id];
        })[0];
        if (b) via = 'from ' + b.n;
      }
      /* THE FIGURE, small, under the name. The ring says whether and
         this says how much — and without it Steps, Fuel and Water were
         three rings that had swallowed the only number anybody logs
         them for. A do-item has no figure, so it says where its tick
         came from instead, and an item whose window has passed says so
         in one word: `Missed its window` does not fit a fifth of a
         phone and the fact is worth more than the sentence. */
      body.appendChild(scEl('span', 'ty-sub',
        it.k === 'num' && on ? String(got[it.id]) + (it.unit || '')
          : (via || (on ? 'logged' : (late ? 'missed' : '')))));

      c.setAttribute('aria-label', it.n + ', ' + (on ? 'logged' : 'not yet')
        + (on && it.k === 'num' ? ', ' + got[it.id] + (it.unit || '') : '')
        + (late ? ', missed its window' : '') + '. ' + it.s + '.');
      c.addEventListener('click', function () { scTallyTap(it, day); });

      /* SIBLINGS, NOT NESTED. A button inside a button is invalid and
         collapses to one target, so the row is one press and the strip
         beside it is its own — the mark logs, the record opens the
         record. Wrapped in a <div class="ty-row"> so the two sit on one
         line while staying two elements. */
      var hist = scEl('button', 'ty-hist');
      hist.type = 'button';
      hist.innerHTML = scStripSvg(scHist(it.id));
      hist.setAttribute('aria-label', it.n + ', open 26 weeks of history');
      hist.addEventListener('click', function () { scOpenHist(it); });

      var row = scEl('div', 'ty-row');
      row.appendChild(c);
      row.appendChild(hist);
      grid.appendChild(row);
    });

    var best = scBest();
    $('scTallyFoot').textContent = st
      ? 'Longest streak ' + best + (best === 1 ? ' day.' : ' days.')
      : 'Log one thing and the run starts.';
  }

  function scBest() {
    var best = 0, run = 0, days = Object.keys(tickLog).sort();
    for (var i = 0; i < days.length; i++) {
      if (i && (new Date(days[i] + 'T12:00:00') - new Date(days[i - 1] + 'T12:00:00'))
               <= 86400000 + 3600000) run++;
      else run = 1;
      if (run > best) best = run;
    }
    return best;
  }

  /* ═══════════════════════════════════════════════════════════
     THE RECORD BEHIND A ROW

     Twenty-six weeks of one item, and there is no retention rule to
     raise for it: tickLog is never pruned, so the only limit here is how
     long you have had the app. The 30 in the friends half is a different
     number answering a different question — how much gets PUSHED, not
     how much is kept.
     ═══════════════════════════════════════════════════════════ */

  var HIST = 182;                    /* 26 weeks, and the strip fits it */

  function scHist(id) {
    var out = [], d = new Date();
    d.setDate(d.getDate() - (HIST - 1));
    for (var i = 0; i < HIST; i++) {
      var rec = tickLog[scDay(d)], v = rec && rec[id];
      out.push({ on: !!v, raw: parseFloat(v) || 0, dow: d.getDay() });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }

  /* Weeks run across, weekdays run down. The FIRST day's own weekday
     sets the column offset — without it every column is a rolling seven
     days and the row a given day sits in drifts, which destroys the one
     thing this shape is good for: a habit that always dies on a Sunday
     showing up as a row. */
  function scCalGeom(days, cell, gap) {
    var off = days.length ? days[0].dow : 0;
    var cols = Math.ceil((days.length + off) / 7);
    return {
      W: cols * (cell + gap) - gap,
      H: 7 * (cell + gap) - gap,
      x: function (i) { return (Math.floor((i + off) / 7) * (cell + gap)).toFixed(2); },
      y: function (i) { return (days[i].dow * (cell + gap)).toFixed(2); }
    };
  }

  /* Centred on the cell it belongs to, so a grown copy stays concentric
     with the block it is the light for. */
  function scCalRect(g, i, cell, w, fill) {
    var d = (w - cell) / 2;
    return '<rect x="' + (g.x(i) - d).toFixed(2) + '" y="' + (g.y(i) - d).toFixed(2)
      + '" width="' + w.toFixed(2) + '" height="' + w.toFixed(2)
      + '" rx="' + (w * .3).toFixed(2) + '" fill="' + fill + '"/>';
  }

  function scStripSvg(days) {
    var cell = 3.6, g = scCalGeom(days, cell, 1.1), out = '';
    days.forEach(function (d, i) {
      out += scCalRect(g, i, cell, cell, d.on ? 'var(--ink)' : 'var(--tick-off)');
    });
    return '<svg viewBox="0 0 ' + g.W + ' ' + g.H + '" aria-hidden="true">'
      + out + '</svg>';
  }

  /* ── the glow ──
     ONE FILTER, NOT ONE HUNDRED AND EIGHTY-TWO. Every lit day is drawn
     into a <g>, that group is duplicated and blurred, and the copy goes
     behind. Each block gets its own falloff — which is the ask — at the
     cost of one filter pass over a panel that does not move. The sketch
     before this put a larger low-alpha rect behind each cell instead:
     same idea, hard edges, and a hard edge is exactly what makes a glow
     read as cartoon.

     TWO PASSES, because one is not a glow. A tight bright core hugging
     each block AND a wide faint one under all of them is what a light
     source does; a single blur is either a halo or a shadow and never
     reads as both. Measured against three single-pass tunings on the
     real panel in both polarities.

     IT IS POLARITY-DEPENDENT AND THAT IS THE DESIGN. In a dark palette
     --ink is near-white, so the blurred copy is a genuine emissive
     bloom. In a light one --ink is near-black and the same layer is a
     contact shadow. Both are what "lit" means in that polarity — ink on
     paper under a lamp glows by casting — and seven of the thirteen
     palettes are dark, so both halves are the real product. The only
     literal glow available on a white page is painting the marks in the
     accent, and that costs the rule this screen just bought: one mark
     means one thing, at all three sizes it is drawn.

     A WIDER HALO WAS MEASURED AND REJECTED. At blur 3.2 grown 14% the
     falloff reaches into the gaps and greys out the unlit days, so the
     misses stop being visible — which is the one thing a record of
     showing up must never lose. */
  var GLOW = [{ blur: 3.6, op: .3, grow: 1.1 }, { blur: 1.1, op: .5, grow: 1 }];

  function scCalSvg(days) {
    var cell = 9.4, pad = 9, g = scCalGeom(days, cell, 2.5);
    var off = '', lit = '', lay = [], defs = '';
    GLOW.forEach(function () { lay.push(''); });
    days.forEach(function (d, i) {
      if (!d.on) { off += scCalRect(g, i, cell, cell, 'var(--tick-off)'); return; }
      GLOW.forEach(function (L, n) {
        lay[n] += scCalRect(g, i, cell, cell * L.grow, 'var(--ink)');
      });
      lit += scCalRect(g, i, cell, cell, 'var(--ink)');
    });
    var body = '';
    GLOW.forEach(function (L, n) {
      /* The filter region has to be bigger than the box it filters or
         the blur is clipped at the edge of each group's bounds, which
         puts a straight line through the falloff. */
      defs += '<filter id="tyG' + n + '" x="-40%" y="-40%" width="180%" height="180%">'
        + '<feGaussianBlur stdDeviation="' + L.blur + '"/></filter>';
      body += '<g filter="url(#tyG' + n + ')" opacity="' + L.op + '">' + lay[n] + '</g>';
    });
    return '<svg class="ty-cal" viewBox="' + (-pad) + ' ' + (-pad) + ' '
      + (g.W + pad * 2).toFixed(2) + ' ' + (g.H + pad * 2).toFixed(2)
      + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'
      + '<defs>' + defs + '</defs>' + off + body + lit + '</svg>';
  }

  /* THE THREE FIGURES ARE NOT THE SAME THREE FOR EVERY ITEM, and they
     cannot be: two of the five are ticks and three are numbers. A tick
     has no average to take, so its figures are about shape — the longest
     streak, whether you are on one now, and what it works out at a week,
     which is the honest summary of a habit that was never meant to be
     daily. */
  /* One glyph per FIGURE, drawn at 12px beside a 10.5px caption. That
     is half the size a row's glyph gets, so the floor this file keeps
     running into bites twice as hard: two or three strokes each and no
     interior detail at all.

     A flame for the streak was the obvious first choice and it is a
     teardrop at this size — which is already Water's mark on the same
     screen. Three blocks in a row is what a streak actually is, and it
     cannot be mistaken for anything else here. */
  var STAT_ICON = {
    streak: '<path d="M3 9h4.2v6H3zM9.9 9h4.2v6H9.9zM16.8 9h4.2v6h-4.2z"/>',
    now: '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="8.4"/>',
    week: '<path d="M4 5.6h16v14.8H4zM4 10.4h16M8.4 3.2v4.4M15.6 3.2v4.4"/>',
    /* Two waves: the "approximately" sign, which is what an average is. */
    avg: '<path d="M3 9.4c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0'
       + 'M3 16.2c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/>',
    /* A peak rather than an up arrow: an arrow says MORE, and the
       figure beside this one is the top rather than a direction. */
    peak: '<path d="M2.6 19.4l6.6-9.4 4 4.6 3.6-6 4.6 10.8z"/>'
  };

  function scHistStats(item, d) {
    var kept = d.filter(function (x) { return x.on; });
    var best = 0, run = 0, now = 0, i;
    for (i = 0; i < d.length; i++) { run = d[i].on ? run + 1 : 0; if (run > best) best = run; }
    for (i = d.length - 1; i >= 0 && d[i].on; i--) now++;

    if (item.k === 'do') {
      return { kept: kept.length, rows: [
        { v: String(best), cap: 'longest streak', ic: 'streak' },
        { v: String(now), cap: now === 1 ? 'day on now' : 'days on now', ic: 'now' },
        { v: (kept.length / (d.length / 7)).toFixed(1), cap: 'days a week', ic: 'week' }
      ] };
    }
    var dp = item.dp || 0;
    var fmt = function (v) {
      return v.toLocaleString('en-GB',
        { minimumFractionDigits: dp, maximumFractionDigits: dp });
    };
    var sum = 0, top = 0;
    kept.forEach(function (x) { sum += x.raw; if (x.raw > top) top = x.raw; });
    var unit = (item.unit || '').trim();
    return { kept: kept.length, unit: unit, rows: [
      { v: fmt(kept.length ? sum / kept.length : 0), cap: 'average a day',
        ic: 'avg', unit: 1 },
      { v: fmt(top), cap: item.neu ? 'your highest' : 'your best',
        ic: 'peak', unit: 1 },
      { v: String(best), cap: 'longest streak', ic: 'streak' }
    ] };
  }

  var histBack = null;    /* what to hand focus back to on close */

  function scOpenHist(item) {
    var d = scHist(item.id), st = scHistStats(item, d);
    var p = $('scTyPanel');
    p.textContent = '';

    var head = scEl('div', 'ty-head');
    var t = scEl('span', 'ty-title', item.n);
    t.id = 'scTyTitle';
    head.appendChild(t);
    head.appendChild(scEl('span', 'ty-span', '26 weeks'));
    p.appendChild(head);
    p.insertAdjacentHTML('beforeend', scCalSvg(d));

    var stats = scEl('div', 'ty-stats');
    st.rows.forEach(function (r) {
      var cell = scEl('div');
      var b = scEl('b', null, r.v);
      if (r.unit && st.unit) b.appendChild(scEl('i', null, st.unit));
      cell.appendChild(b);
      /* The glyph goes on the CAPTION, not the figure. Beside a 22px
         number it would be a second thing competing at that size; beside
         10.5px words it is what lets the three be told apart before they
         are read. aria-hidden, because the caption is the next thing in
         the same line. */
      var cap = scEl('span');
      cap.insertAdjacentHTML('beforeend',
        '<svg viewBox="0 0 24 24" aria-hidden="true">' + STAT_ICON[r.ic] + '</svg>');
      cap.appendChild(document.createTextNode(r.cap));
      cell.appendChild(cap);
      stats.appendChild(cell);
    });
    p.appendChild(stats);
    p.appendChild(scEl('p', 'ty-hint',
      st.kept + ' of ' + HIST + ' days · tap anywhere to close'));

    histBack = document.activeElement;
    $('scTyVeil').hidden = false;
    p.focus();
  }

  function scCloseHist() {
    if ($('scTyVeil').hidden) return;
    $('scTyVeil').hidden = true;
    $('scTyPanel').textContent = '';
    if (histBack && histBack.focus) histBack.focus();
    histBack = null;
  }

  function scTallyTap(item, day) {
    if (item.k === 'do') {
      scSetTick(day, item.id, scTicked(day, item.id) ? 0 : 1);
      scPaintTally();
      if (view === 'list') scRender();
      return;
    }
    scNumSheet(item, day);
  }

  function scNumSheet(item, day) {
    scSheet(item.n, function (body) {
      var f = scEl('input', 'field');
      f.type = 'text';
      f.inputMode = 'decimal';
      f.placeholder = item.s;
      f.value = (tickLog[day] && tickLog[day][item.id]) || '';
      body.appendChild(f);
      body.appendChild(scEl('p', 'hint',
        'The number stays on this phone. Only whether you logged it is '
        + 'ever shared.'));
      /* scBtn and scClose, which are what the other four sheets use.
         This was written as a bare `go` class and a `scCloseSheet` that
         does not exist — the class would have rendered an unstyled
         button and the call would have thrown on the one path nobody
         looks at twice, which is the press that saves your number. */
      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Cancel', scClose));
      acts.appendChild(scBtn('go', 'Save', function () {
        scSetTick(day, item.id, f.value.trim() || 0);
        scClose();
        scPaintTally();
      }));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); }, 260);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     FRIENDS

     The one part of this app that reaches a network. Everything else
     here is a promise that nothing leaves the browser, and this is the
     exception you turn on yourself — with a screen that says what goes
     and a way back off that actually deletes.

     UNTIL YOU TURN IT ON THERE IS NO URL, and with no URL `scApi`
     returns before it builds a request. That is not a nicety: the
     suite counts every request the page makes and fails on one that
     leaves the origin, so the default has to be genuinely inert rather
     than merely quiet.

     THE FRIEND LIST LIVES HERE, in this browser, and the server has no
     endpoint that would return it. You hold your friends' codes and
     ask for each record by code, so what the server sees is a stream
     of unrelated reads with no graph behind it. It would be one line
     shorter to ask it "who are my people" and that one line is the
     whole difference.
     ═══════════════════════════════════════════════════════════ */

  /* Four keys, four different things — and the split is the same
     argument the rest of this app makes. Where the server is and who
     you are on it is configuration. The friend list is the graph. The
     peer cache is disposable. Your logs are the only one of the four
     you would miss, and folding it in with the cache is how a stale
     fetch takes it with it. */
  var NET_KEY = 'sched.net.v1';
  var FRIEND_KEY = 'sched.friends.v1';
  var PEER_KEY = 'sched.peer.v1';
  var POST_KEY = 'sched.post.v1';

  /* ── the server this copy of the app is paired with ──
     It was blank, and every person had to be told a `.workers.dev`
     address and type it into a box before friends did anything. That is
     a URL nobody can check and everybody mistypes, and it made joining
     a conversation rather than a tap.

     Naming it here does NOT make the app chatty. `scApi` still returns
     before it builds a request when there is no url, and nothing on the
     week, the ring or the tally calls it — the first request of any
     kind happens when somebody opens the Friends tab. The suite still
     counts every request the main page makes and still fails on one
     that leaves the origin, which is the assertion that keeps this
     honest rather than the empty string was.

     Deploying your own copy means changing this line and nothing else.
     An empty string puts the app back to asking. */
  var HOME = 'https://sched.nikorapullin.workers.dev';

  var net = { url: '', code: '', key: '', name: '', pic: '', on: false };
  /* One attempt per visit. A claim that fails offline must not become a
     request every time the tab is painted. */
  var joining = false;
  var friends = [];   /* [{ code, name }] — the graph, and it stays here  */
  var peers = {};     /* code -> the last record fetched, so this paints offline */
  var posts = [];     /* your own log entries */

  function scReadJSON(k, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }
  function scWriteJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function scNetLoad() {
    var n = scReadJSON(NET_KEY, null);
    if (n && typeof n === 'object') {
      for (var k in net) if (net.hasOwnProperty(k) && typeof n[k] === typeof net[k]) net[k] = n[k];
    }
    friends = scReadJSON(FRIEND_KEY, []);
    if (!Array.isArray(friends)) friends = [];
    peers = scReadJSON(PEER_KEY, {});
    if (!peers || typeof peers !== 'object') peers = {};
    posts = scReadJSON(POST_KEY, []);
    if (!Array.isArray(posts)) posts = [];
  }
  function scNetSave() { scWriteJSON(NET_KEY, net); }

  /* crypto, never Math.random. The key is the only thing between your
     code — which you hand out on purpose — and somebody posting as
     you, and a browser's Math.random is a fast PRNG seeded per page,
     not a source of secrets.

     Both alphabets divide 256 exactly (32 and 16), so the modulo is
     uniform. An alphabet of, say, 36 would bias the first four letters
     upward, which is the sort of thing that is invisible and stays
     wrong. */
  var CODE_A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   /* no I, O, 0, 1 */
  var HEX_A = '0123456789abcdef';
  function scRand(n, alphabet) {
    var a = new Uint8Array(n);
    crypto.getRandomValues(a);
    var out = '';
    for (var i = 0; i < n; i++) out += alphabet.charAt(a[i] % alphabet.length);
    return out;
  }

  /* Every request in the app goes through here, and the first line is
     the promise: no URL, no request. */
  function scApi(path, opts, done) {
    done = done || function () {};
    if (!net.url) return done(null, 'off');
    var o = opts || {};
    var h = {};
    if (o.auth) h.Authorization = 'Bearer ' + net.key;
    if (o.json) h['Content-Type'] = 'application/json';
    if (o.bin) h['Content-Type'] = 'application/octet-stream';
    fetch(net.url + path, { method: o.method || 'GET', headers: h, body: o.body })
      .then(function (r) {
        return r.json().then(
          function (j) { done(r.ok ? j : null, r.status); },
          function () { done(null, r.status); });
      }, function () { done(null, 'offline'); });
  }

  function scImgURL(id) { return net.url ? net.url + '/v1/img/' + id : ''; }

  /* ── joining ──
     The client draws its own code and key and claims the code. A 409
     is a collision on a 32^8 space rather than an error worth showing
     anybody, so it retries; anything else is the URL being wrong,
     which is the one thing the person in front of it can fix. */
  function scJoin(url, name, done) {
    net.url = String(url || '').trim().replace(/\/+$/, '');
    net.name = String(name || '').trim().slice(0, 24) || 'You';
    var tries = 0;
    var go = function () {
      var code = scRand(8, CODE_A), key = scRand(32, HEX_A);
      scApi('/v1/claim', {
        method: 'POST', json: true,
        body: JSON.stringify({ code: code, key: key })
      }, function (okd, status) {
        if (okd) {
          net.code = code; net.key = key; net.on = true;
          scNetSave();
          scPushNow();
          return done(true);
        }
        if (status === 409 && ++tries < 4) return go();
        /* The URL is cleared on the way out. Left set, every later
           call would keep firing at a host that is not the server —
           which is a page quietly making requests off its origin, the
           exact thing the rest of this file is careful about. */
        net.url = '';
        done(false, status);
      });
    };
    go();
  }

  /* Off, and it means off. The record and the write key are deleted
     server-side, then everything about it goes from this browser.
     Nothing else in this app deletes without a bin; a bin protects a
     record you cannot rebuild, and this is somebody asking to be off a
     server — the copy that matters never left. */
  function scLeave(done) {
    var after = function () {
      net = { url: '', code: '', key: '', name: '', pic: '', on: false };
      friends = []; peers = {}; posts = [];
      scNetSave();
      scWriteJSON(FRIEND_KEY, friends);
      scWriteJSON(PEER_KEY, peers);
      scWriteJSON(POST_KEY, posts);
      done();
    };
    if (!net.on || !net.code) return after();
    scApi('/v1/rec/' + net.code, { method: 'DELETE', auth: true }, after);
  }

  /* ── pushing ──
     The whole record at a time, debounced. Ticking five boxes in ten
     seconds is one write rather than five, which is the difference
     between a free tier that lasts and one that does not. */
  var pushT = null;
  function scPush() {
    if (!net.on || !net.code) return;
    clearTimeout(pushT);
    pushT = setTimeout(scPushNow, 1500);
  }

  function scPushNow() {
    if (!net.on || !net.code) return;
    clearTimeout(pushT);
    var cs = getComputedStyle(document.documentElement);
    scApi('/v1/rec/' + net.code, {
      method: 'PUT', auth: true, json: true,
      body: JSON.stringify({
        name: net.name,
        /* The two colours, so a friend's face and crown are drawn in
           THEIR palette on your screen. Sending the theme's id instead
           would mean this app could never gain a theme without every
           friend's copy going grey until they updated. */
        acc: cs.getPropertyValue('--red').trim(),
        ink: cs.getPropertyValue('--on-red').trim(),
        pic: net.pic || '',
        days: scMyDays(),
        /* `local` is stripped HERE, and the first version did not do
           it. A post carries the full data URL of its own photograph so
           your own feed draws instantly and still draws with no signal
           — that is a second copy of the picture, base64, and base64 is
           a third bigger again. Pushed whole it went up inside the JSON
           beside the id of the very same image, and two photographs
           would have put the record past the worker's 96KB ceiling and
           started failing every write with a 413.
           The comment on the field said "this is never sent". That is
           the second time today a comment has been the only place an
           intention existed. */
        logs: posts.slice(-30).map(function (q) {
          return { id: q.id, at: q.at, day: q.day, item: q.item, cap: q.cap, img: q.img };
        }),
        at: Date.now()
      })
    });
  }

  function scPullAll(done) {
    done = done || function () {};
    if (!net.url || !friends.length) return done();
    var left = friends.length;
    friends.forEach(function (f) {
      scApi('/v1/rec/' + f.code, {}, function (rec) {
        /* A failed fetch keeps the cached copy. Blanking a friend
           because the train went into a tunnel would empty the board
           and read as them having stopped. */
        if (rec) peers[f.code] = rec;
        if (!--left) { scWriteJSON(PEER_KEY, peers); done(); }
      });
    });
  }

  /* ── an invitation is a LINK, and the link carries the server ──
     The code alone is not portable. It names a row in one KV namespace,
     so handing somebody `K7PQ2M4X` is only an invitation if they are
     already pointed at the same worker — and the app they open has no
     way to know that they are. It worked here because every copy of
     this app shares one HOME, which is a coincidence of there being one
     deployment rather than a property of the design. Deploy a second
     one and every code becomes ambiguous with no error to show for it:
     the read simply misses and says "nobody has that code".

     So the invitation is a URL that carries both, and `at` is written
     ONLY when the server is not HOME — a link that names the default
     is a link that goes stale the day the default moves, and pinning
     every invitation to today's address is how a rename becomes a
     broken link in everybody's messages.

     IT IS THE HASH, not a query string. Both survive GitHub Pages, but
     a query is sent to the server in the request line and a fragment
     never leaves the browser. A friend code in somebody's access log
     is a small thing that this app has spent every other decision not
     doing. */
  function scLinkFor(code) {
    var at = net.url || HOME;
    /* From href rather than origin + pathname: opened off the disk,
       `location.origin` is the string "null" and the link comes out as
       nonsense rather than as nothing. */
    var base = location.href.replace(/[#?].*$/, '');
    return base + '#add=' + code
      + (at && at !== HOME ? '&at=' + encodeURIComponent(at) : '');
  }

  /* One reader for both doors: what the URL was opened with, and what
     somebody pasted into `Theirs`. They take the same strings for the
     same reason — a person handed a link pastes the link, and a person
     told a code over a table types the code. Refusing either would be
     a field that knows which half of the exchange you had. */
  function scInviteIn(s) {
    s = String(s || '').trim();
    if (!s) return null;
    /* Case-insensitive on the parameter names: `Theirs` is set to
       autocapitalize for the code, which is what somebody typing one
       wants, and it reaches a pasted link's `add=` on the way past. */
    var m = /[#?&]add=([A-Za-z0-9]{4,12})/i.exec(s);
    if (m) {
      var at = /[#?&]at=([^&\s]+)/i.exec(s);
      var url = '';
      try { url = at ? decodeURIComponent(at[1]) : ''; } catch (e) { url = ''; }
      /* Only http(s), and only ever as the address of an API. A link is
         a thing strangers send you, so the one field in it that becomes
         a fetch target is the one field worth being strict about. */
      if (!/^https?:\/\/[^\s]+$/.test(url)) url = '';
      return { code: m[1].toUpperCase(), at: url.replace(/\/+$/, '') };
    }
    if (/^[A-Za-z0-9]{4,12}$/.test(s)) return { code: s.toUpperCase(), at: '' };
    return null;
  }

  /* Read at boot, redeemed on arrival at the tab, and cleared either
     way. It is deliberately NOT acted on where it is read: the app
     makes no request until somebody is on the friends screen, and an
     invitation that joined a server from the wiring would be the one
     hole in that. */
  var invite = null;

  function scAddFriend(code, done) {
    var inv = scInviteIn(code);
    if (!inv) return done(false, 'that is not a code');
    if (inv.at && net.url && inv.at !== net.url)
      return done(false, 'that link is for another server');
    code = inv.code;
    if (code === net.code) return done(false, 'that one is yours');
    if (friends.some(function (f) { return f.code === code; }))
      return done(false, 'already on your list');
    scApi('/v1/rec/' + code, {}, function (rec) {
      if (!rec) return done(false, 'nobody has that code');
      friends.push({ code: code, name: rec.name || code });
      peers[code] = rec;
      scWriteJSON(FRIEND_KEY, friends);
      scWriteJSON(PEER_KEY, peers);
      done(true, rec.name || code);
    });
  }

  function scDropFriend(code) {
    friends = friends.filter(function (f) { return f.code !== code; });
    delete peers[code];
    scWriteJSON(FRIEND_KEY, friends);
    scWriteJSON(PEER_KEY, peers);
  }

  /* ── counting, once, for everybody ──
     Mine used to be counted by walking tickLog and a peer's would have
     been counted by walking their record: two implementations of "how
     many ticks in thirty days" on the same leaderboard. The day they
     disagree the board is simply wrong and nothing on it says so. One
     function, and my own days are shaped into the same object a peer
     sends before it is asked. */
  function scMyDays() {
    var days = {};
    for (var i = 0; i < 30; i++) {
      var d = scDayBack(i), t = tickLog[d];
      /* The COUNT, never which five. The board and the strip both only
         ever need how many, so sending the items themselves would be
         spending something for nothing. */
      if (t) { var n = Object.keys(t).length; if (n) days[d] = n; }
    }
    return days;
  }

  /* Ticks over a rolling window, never all-time — all-time means
     whoever started first wins permanently and nobody new can catch
     up. */
  function scCount(days, n) {
    var t = 0;
    for (var i = 0; i < n; i++) t += (days && days[scDayBack(i)]) || 0;
    return t;
  }

  /* Days you logged ANYTHING, running back from today. Today not being
     logged yet does not break it — at nine in the morning it has not
     failed, it has not happened, and a streak that resets every
     midnight is a streak nobody keeps. */
  function scRunOf(days) {
    var n = 0;
    for (var i = 0; i < 3650; i++) {
      if (days && days[scDayBack(i)]) n++;
      else if (i > 0) break;
    }
    return n;
  }

  function scStreak() { return scRunOf(scMyDays()); }
  function scTicksIn(n) { return scCount(scMyDays(), n); }

  /* ── a friend's colour on your page ──
     Their accent was chosen against THEIR ground and is about to be
     drawn on yours. Thirteen themes each way is 169 pairings and
     nobody has looked at any of them: the crown was measured over four
     rounds, and every one of those measurements was of your own accent
     on your own page, which is the one case that cannot go wrong.

     So it is mixed toward your ink, one step at a time, and stops at
     the first step that clears 3:1 — the bar for a graphic, WCAG
     1.4.11. On a pairing that already clears it, which is most of
     them, nothing moves and it is exactly their colour.

     THE GROUND HERE IS AN APPROXIMATION and that is said out loud,
     because this app has been wrong about precisely this before, on
     precisely this glyph: reasoning about a colour against a token
     instead of against the pixel cost four rounds. --g0 is the flat
     base and the page draws three washes over it, so what the eye gets
     is always a little worse than what this arithmetic says.

     So all 169 were measured on composited pixels rather than argued
     about. Aiming at a bare 3.0 here, 26 of them come out UNDER 3:1 on
     screen — worst 2.92:1, solar's amber on five different grounds.
     Aiming at 3.4, none do: the worst measured is 3.25:1 and 97 of the
     169 never move at all, which is the point. It dilutes only as far
     as the page forces. */
  var CROWN_MIN = 3.4;   /* 3:1 plus the 0.4 the washes were measured to take */

  function scRGB(c) {
    c = String(c || '').trim();
    var m = c.match(/^#([0-9a-f]{3})$/i);
    if (m) return [0, 1, 2].map(function (i) {
      return parseInt(m[1].charAt(i) + m[1].charAt(i), 16);
    });
    m = c.match(/^#([0-9a-f]{6})$/i);
    if (m) return [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); });
    /* getComputedStyle hands back `rgb(255, 0, 0)`, never a hex — and a
       hex-only reader silently returned NaN for it once, which fell
       through to solid ink and looked like a deliberate choice. */
    m = c.match(/^rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(/[\s,\/]+/).filter(Boolean).slice(0, 3).map(parseFloat);
      if (p.length === 3 && p.every(function (x) { return !isNaN(x); })) {
        /* `color(srgb .5 .2 .1)` and modern rgb() both serialise 0–1 in
           some browsers. Anything with no channel above 1 is that. */
        var unit = p.every(function (x) { return x <= 1; });
        return p.map(function (x) { return Math.round(unit ? x * 255 : x); });
      }
    }
    return null;
  }

  function scLum(rgb) {
    var f = function (c) {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }

  function scRatio(a, b) {
    var x = scLum(a), y = scLum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  function scCrown(hex) {
    var acc = scRGB(hex);
    if (!acc) return 'var(--red)';
    var cs = getComputedStyle(document.documentElement);
    var ground = scRGB(cs.getPropertyValue('--g0'));
    var ink = scRGB(cs.getPropertyValue('--ink'));
    if (!ground || !ink) return hex;
    for (var t = 0; t <= 1.0001; t += 0.05) {
      var mix = acc.map(function (c, i) { return Math.round(c + (ink[i] - c) * t); });
      if (scRatio(mix, ground) >= CROWN_MIN)
        return 'rgb(' + mix[0] + ', ' + mix[1] + ', ' + mix[2] + ')';
    }
    /* Their accent and your ink both invisible on your ground is not a
       thing any pair of these themes produces, but falling through to
       your own accent is a colour that certainly reads, and a crown
       that reads in the wrong palette beats one that does not read. */
    return 'var(--red)';
  }

  /* ── the two seams the screen paints from ── */
  function scFriendsPeers() {
    return friends.map(function (f) {
      var r = peers[f.code] || null;
      return {
        code: f.code,
        name: (r && r.name) || f.name || f.code,
        ticks: r ? scCount(r.days, 30) : 0,
        streak: r ? scRunOf(r.days) : 0,
        acc: r && r.acc, ink: r && r.ink, pic: r && r.pic,
        cold: !r
      };
    });
  }

  function scFeedItems() {
    var out = posts.map(function (p) { return { p: p, who: net.name || 'You', me: true }; });
    friends.forEach(function (f) {
      var r = peers[f.code];
      if (!r || !Array.isArray(r.logs)) return;
      r.logs.forEach(function (p) {
        out.push({ p: p, code: f.code, who: r.name || f.name || f.code,
                   acc: r.acc, ink: r.ink, pic: r.pic });
      });
    });
    return out.sort(function (a, b) { return (b.p.at || 0) - (a.p.at || 0); });
  }

  /* ── the screen ── */
  function scPaintFriends() {
    var me = {
      name: net.on ? (net.name || 'You') : 'You',
      me: true, ticks: scTicksIn(30), streak: scStreak()
    };
    var all = [me].concat(net.on ? scFriendsPeers() : [])
      .sort(function (a, b) { return b.ticks - a.ticks; });

    var list = $('scFriendList');
    list.textContent = '';
    all.forEach(function (p, i) {
      var li = scEl('li', 'fr-row' + (p.me ? ' is-me' : ''));
      li.appendChild(scEl('span', 'fr-rank', String(i + 1)));
      li.appendChild(scPicOf(38, p));
      var n = scEl('span');
      var nm = scEl('span', 'fr-n', p.name);
      /* The crown, on whoever leads, in their own accent. With one row
         it is yours — which is not a trophy, it is the mark saying who
         is top, and it would be strange for it to appear only once
         somebody else arrives. */
      if (i === 0) {
        var c = scEl('span', 'fr-crown');
        if (!p.me && p.acc) c.style.setProperty('--crown', scCrown(p.acc));
        c.innerHTML = '<svg viewBox="0 0 24 20" aria-hidden="true">'
          + '<path d="M2 6l4.6 3.6L12 2l5.4 7.6L22 6l-1.8 11H3.8L2 6z"/></svg>';
        var w = scEl('span', 'fr-nw');
        w.appendChild(nm); w.appendChild(c);
        n.appendChild(w);
      } else n.appendChild(nm);
      n.appendChild(scEl('span', 'fr-s', p.cold
        ? 'not fetched yet'
        : p.streak + (p.streak === 1 ? ' day' : ' days') + ' showing up'));
      li.appendChild(n);
      li.appendChild(scEl('span', 'fr-t', String(p.ticks)));
      /* A row is a button only when there is somebody behind it. A
         name you can press that opens nothing is worse than a name you
         cannot. */
      if (!p.me) {
        li.classList.add('is-tap');
        li.setAttribute('role', 'button');
        li.tabIndex = 0;
        var open = function () { scFriendSheet(p); };
        li.addEventListener('click', open);
        li.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
      }
      list.appendChild(li);
    });

    /* ── the two quiet actions ──
       These were a filled accent button and a bordered one, side by
       side, directly under a three-row list. Two blocks of solid colour
       for things you do about once a week each, louder than the board
       they were about. A line of type at the foot of the list is the
       same tap and does not compete with anything. */
    var add = $('scFriendAdd');
    add.textContent = '';
    if (net.on) {
      /* The action first, because arriving here already did the setting
         up. The sentence under it is what the turn-on sheet used to
         say — it stays on the board rather than being shown once and
         pressed through, since nobody presses through it any more. */
      add.appendChild(scLink('Add a friend', scAddSheet));
      add.appendChild(scEl('p', 'fr-note',
        'Your name, picture, ticks and logs are on the server. '
        + 'Remove yourself any time in Settings.'));
    } else if (joining) {
      add.appendChild(scEl('p', 'fr-note', 'Setting up…'));
    } else {
      /* Only reached when the claim could not be made — offline, or a
         server that is not there. The manual sheet is still the way to
         point it somewhere else. */
      add.appendChild(scEl('p', 'fr-note',
        'Could not reach the server. Nothing has left this browser.'));
      add.appendChild(scLink('Try again', function () {
        joining = false; scArriveFriends(); scPaintFriends();
      }));
      add.appendChild(scLink('Use another server', scNetSheet));
    }

    var feed = $('scFeed');
    feed.textContent = '';
    var items = net.on ? scFeedItems() : [];
    if (!net.on) {
      feed.appendChild(scEl('p', 'fr-note',
        'A log is a photograph and a line about one of the five — yours and '
        + 'your friends’ together. It arrives when you turn friends on.'));
    } else {
      feed.appendChild(scLink('Write one', scLogSheet));
      if (!items.length) {
        feed.appendChild(scEl('p', 'fr-note',
          'Nothing logged yet. A photograph and a line about one of the five.'));
      } else {
        items.slice(0, 40).forEach(function (it) { feed.appendChild(scPost(it)); });
      }
    }
  }

  /* A line of type that is a button. The glyph is drawn rather than
     typed, so it lines up with the label's cap height at any size and
     cannot be selected as part of the text.

     TWO GLYPHS, and the difference carries meaning. A `+` is for the
     three that make something exist — a friend, a log, an account on a
     server. `Your code` makes nothing; it shows you a string you
     already have. Given the plus as well it read as a fourth thing to
     create, on a row directly under the one that adds people.

     It still gets a glyph rather than none, because the label has to
     start where the others do — a bare line of text sitting 21px left
     of the two above it looks like a different kind of control. */
  function scLink(label, fn, glyph) {
    var b = scEl('button', 'fr-link');
    b.type = 'button';
    b.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="'
      + (glyph === 'go' ? 'M5 2l5 5-5 5' : 'M7 2v10M2 7h10') + '"/></svg>';
    b.appendChild(document.createTextNode(label));
    b.addEventListener('click', fn);
    return b;
  }

  /* ── which stop ──
     Remembered, and in its own key. The schedule is the record and this
     is a preference about looking at it, which is the same argument
     `sched.view.v1` already makes for itself — and folding a preference
     into the record is how a damaged one takes the other down. */
  var FRSTOP_KEY = 'sched.fr.v1';
  var frStop = 'board';

  function scFrStop(v, save) {
    frStop = v === 'feed' ? 'feed' : 'board';
    $('scFrPane').hidden = frStop !== 'board';
    $('scFeed').hidden = frStop !== 'feed';
    [].forEach.call(document.querySelectorAll('.fr-stop'), function (t) {
      var on = t.dataset.stop === frStop;
      t.classList.toggle('on', on);
      t.setAttribute('aria-current', on ? 'page' : 'false');
    });
    if (save) { try { localStorage.setItem(FRSTOP_KEY, frStop); } catch (e) {} }
  }

  /* ── refreshing ──
     THIS IS NOT IN scPaintFriends, and the first version was. A paint
     that fetches and a fetch that repaints is a loop, and it did not
     even need a server to close it: with nobody on your list scPullAll
     has nothing to wait for and calls back SYNCHRONOUSLY, so the first
     paint recursed until the stack went. The screen came out with its
     buttons and no rows, which reads as an empty leaderboard rather
     than as a crash.

     So arriving at the screen fetches, and drawing it only draws. The
     board is painted from the cache first either way — a spinner over
     figures that are a minute old would be showing you less than the
     figures do. */
  var pulling = false;
  function scFriendsRefresh() {
    if (pulling || !net.on || !friends.length) return;
    pulling = true;
    scPullAll(function () {
      pulling = false;
      if (view === 'friends') scPaintFriends();
    });
  }

  /* ── arriving at the friends tab ──
     A code is claimed here rather than behind a button. Somebody sent a
     link, and being handed a `.workers.dev` address to type before
     anything works is the wrong first minute — the code and key are
     generated on the device either way, and neither is a decision
     anybody can make a better version of by being asked.

     WHAT LEAVES STAYS ON THE SCREEN. The old flow put that on the sheet
     you pressed through, on the argument that a paragraph you merely
     arrive at is a disclaimer while one on a sheet is a decision. With
     the sheet gone the sentence has to live on the board, where it is
     visible every time rather than once.

     One attempt per visit: a claim that fails offline must not fire
     again on every repaint, and the manual sheet is still there under
     it for a URL that needs correcting. */
  function scArriveFriends() {
    /* A server chosen by hand outranks the built-in one. Without that,
       "Use another server" would be overruled by HOME on the next
       visit, and the sheet would look like it had done nothing.

       An invitation outranks both, but ONLY for somebody who has not
       joined yet. A link is how you reach a server you were never
       going to type, so on a first open it decides; once you are on
       one, your own record and your existing friends are there and a
       link cannot move you off it without silently orphaning them. */
    var where = (!net.on && invite && invite.at) || net.url || HOME;
    if (net.on) return scRedeem(scFriendsRefresh);
    if (!where || joining) return scFriendsRefresh();
    joining = true;
    scJoin(where, net.name, function (okd) {
      joining = false;
      if (!okd) { if (view === 'friends') scPaintFriends(); return; }
      scRedeem(function () {
        if (view === 'friends') scPaintFriends();
        scFriendsRefresh();
      });
    });
  }

  /* ── redeeming the link you arrived on ──
     One attempt, and the invitation is spent BEFORE the request rather
     than in the callback: a fetch that fails offline must not leave a
     pending add that fires again on the next repaint, and adding the
     same person twice is a thing `scAddFriend` refuses politely enough
     that the second attempt would look like it worked.

     It says what happened either way. An add that succeeds silently is
     indistinguishable from a link that did nothing, and the whole
     point of this is that the person tapping it never had to
     understand what it was. */
  function scRedeem(done) {
    done = done || function () {};
    var inv = invite;
    if (!inv || !net.on) return done();
    invite = null;
    scAddFriend(inv.code, function (okd, msg) {
      scToast(okd ? msg + ' added' : msg, false);
      if (view === 'friends') scPaintFriends();
      done();
    });
  }

  function scPost(it) {
    var p = it.p;
    var card = scEl('article', 'po');
    var head = scEl('div', 'po-h');
    head.appendChild(scPicOf(26, it));
    var who = scEl('span');
    who.appendChild(scEl('span', 'po-n', it.who));
    var it2 = TALLY.filter(function (x) { return x.id === p.item; })[0];
    who.appendChild(scEl('span', 'po-s',
      (it2 ? it2.n + ' · ' : '') + scAgo(p.at)));
    head.appendChild(who);
    card.appendChild(head);
    if (p.img) {
      var wrap = scEl('div', 'po-img');
      var im = document.createElement('img');
      im.src = it.me && p.local ? p.local : scImgURL(p.img);
      im.alt = p.cap || '';
      im.loading = 'lazy';
      wrap.appendChild(im);
      card.appendChild(wrap);
    }
    if (p.cap) card.appendChild(scEl('p', 'po-c', p.cap));
    return card;
  }

  /* Relative, and it stops at the day. "3 weeks ago" is a number
     nobody reads as a duration; past a week the date is the useful
     thing and this is a feed, not a diary. */
  function scAgo(at) {
    if (!at) return '';
    var s = Math.max(0, Math.round((Date.now() - at) / 1000));
    if (s < 90) return 'just now';
    var m = Math.round(s / 60);
    if (m < 60) return m + 'm ago';
    var h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    var d = Math.round(h / 24);
    if (d < 8) return d + 'd ago';
    return new Date(at).toDateString().slice(4, 10);
  }

  /* ── turning it on ── */
  function scNetSheet() {
    scSheet(net.on ? 'Friends' : 'Turn on friends', function (body) {
      if (!net.on) {
        body.appendChild(scEl('p', 'hint',
          'This is the only part of the app that reaches a network, and it is '
          + 'off until you do this. It needs a server of your own — the '
          + 'worker in this project, on your own Cloudflare account. Paste its '
          + 'address.'));
        var u = scEl('input', 'field');
        u.type = 'url';
        u.placeholder = 'https://sched.you.workers.dev';
        u.value = net.url || '';
        body.appendChild(scEl('span', 'label', 'Your server'));
        body.appendChild(u);
        var nf = scEl('input', 'field');
        nf.type = 'text';
        nf.placeholder = 'What your friends call you';
        nf.maxLength = 24;
        nf.value = net.name || '';
        body.appendChild(scEl('span', 'label', 'Name'));
        body.appendChild(nf);

        /* Said plainly and in full, on the screen where it starts. A
           sentence about privacy under a button that has already been
           pressed is a disclaimer; here it is a decision. */
        body.appendChild(scEl('p', 'hint',
          'What goes: your name, your two theme colours, your picture, how many '
          + 'of the five you ticked on each of the last thirty days, and any log '
          + 'you write — photograph and caption. What never goes: your week, '
          + 'your blocks, and the numbers behind Steps, Fuel and Water. Your '
          + 'friend list stays on this phone; the server is never told who you '
          + 'have added.'));

        var acts = scEl('div', 'acts');
        acts.appendChild(scBtn('off', 'Not now', scClose));
        var join = scBtn('go', 'Turn it on', function () {
          if (!/^https?:\/\/.+/.test(u.value.trim())) {
            scToast('That does not look like an address', false); return;
          }
          join.disabled = true;
          join.textContent = 'Asking…';
          scJoin(u.value, nf.value, function (okd, status) {
            if (!okd) {
              join.disabled = false;
              join.textContent = 'Turn it on';
              scToast(status === 'offline'
                ? 'Could not reach that address'
                : 'That address did not answer as the worker', false);
              return;
            }
            scClose();
            scPaintFriends();
            scToast('On. Your code is ' + net.code, false);
          });
        });
        acts.appendChild(join);
        body.appendChild(acts);
        return;
      }

      /* Here it is a reference, not the thing you came for — the copy
         button lives on Add a friend, which is where a code is
         actually wanted. This is the settings page: it says what your
         code is because that is a thing you might come looking for,
         and then it gets out of the way. */
      body.appendChild(scEl('span', 'label', 'Your code'));
      body.appendChild(scEl('p', 'fr-code', net.code));

      body.appendChild(scEl('div', 'menu-rule'));
      var nm = scEl('button', 'menu-item');
      nm.appendChild(document.createTextNode('Name'));
      nm.appendChild(scEl('span', 'sub-note', net.name || 'not set'));
      nm.addEventListener('click', function () {
        scTextSheet('Name', 'Name', net.name, function (v) {
          net.name = (v || '').slice(0, 24) || 'You';
          scNetSave();
          scPushNow();
        });
      });
      body.appendChild(nm);

      var off = scEl('button', 'menu-item bad');
      off.appendChild(document.createTextNode('Turn friends off'));
      off.appendChild(scEl('span', 'sub-note',
        'Deletes your record and your logs from the server. This one is final.'));
      off.addEventListener('click', function () {
        scSheet('Turn friends off?', function (b2) {
          b2.appendChild(scEl('p', 'hint',
            'Your record, your logs and your pictures are deleted from the '
            + 'server, and the code goes back in the pool. Your week, your '
            + 'ticks and your streak are untouched — they never left. '
            + 'There is no bin for this, because the copy that matters is the '
            + 'one still here.'));
          var a4 = scEl('div', 'acts');
          a4.appendChild(scBtn('off', 'Stay on', scClose));
          a4.appendChild(scBtn('bad', 'Turn it off', function () {
            scLeave(function () {
              scClose();
              scPaintFriends();
              scToast('Off. Nothing of yours is up there.', false);
            });
          }));
          b2.appendChild(a4);
        });
      });
      body.appendChild(off);
    });
  }

  /* ── the swap ──
     Both codes, in the one place the exchange actually happens. `Your
     code` used to be its own row on the board, directly under `Add a
     friend` — two rows for the two halves of a single act, and the
     board carrying a control that is only ever wanted while you are
     adding somebody. Adding a friend IS the swap: you give them
     yours, they give you theirs.

     It leaves the board with exactly one action on it, and the friends
     settings — your name, and turning it off — move to the app's own
     settings, where Rename and the backup already live. */
  function scAddSheet() {
    scSheet('Add a friend', function (body) {
      body.appendChild(scEl('span', 'label', 'Yours'));
      var row = scEl('div', 'fr-swap');
      row.appendChild(scEl('span', 'fr-code', net.code));
      /* SHARE, not Copy, and what goes is the link — the code is still
         printed beside it because a code is what you say out loud
         across a table, and that is a different exchange from sending
         somebody a message.

         The share sheet first where there is one: on the phone this app
         is for, `Copy` means finding the thread yourself afterwards.
         It resolves on cancel as well as on send and there is no
         difference visible to us, so neither one toasts — a "Link
         copied" after somebody backed out of the share sheet is the app
         claiming something that did not happen. */
      row.appendChild(scBtn('off', 'Share', function () {
        var link = scLinkFor(net.code);
        if (navigator.share) {
          try {
            navigator.share({ title: 'Daily Process', text: link })
              .then(function () {}, function () {});
            return;
          } catch (e) {}
        }
        var done = function () { scToast('Link copied', false); };
        if (navigator.clipboard && navigator.clipboard.writeText)
          navigator.clipboard.writeText(link).then(done, done);
        else done();
      }));
      body.appendChild(row);
      /* No caption under it. `Yours` over a code beside a button that
         says Copy is a sentence already, and the paragraph explaining
         that a code reads and never writes belongs where somebody is
         deciding whether to turn this on — not on the sheet they open
         forty times to swap one. */
      body.appendChild(scEl('span', 'label', 'Theirs'));
      var f = scEl('input', 'field');
      f.type = 'text';
      f.autocapitalize = 'characters';
      f.spellcheck = false;
      /* It takes a pasted LINK as readily as a code, because half the
         people using this sheet were sent one. A field that accepts
         only the code makes somebody edit a URL down by hand on a
         phone, having been given exactly the thing it needs. */
      f.placeholder = 'Their code, or a link they sent';
      body.appendChild(f);
      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Cancel', scClose));
      acts.appendChild(scBtn('go', 'Add', function () {
        scAddFriend(f.value, function (okd, msg) {
          if (!okd) { scToast(msg, false); return; }
          scClose();
          scPaintFriends();
          scToast(msg + ' added', false);
        });
      }));
      body.appendChild(acts);
      setTimeout(function () { f.focus(); }, 260);
    });
  }

  /* ── a friend ──
     Their seven days, their board figures, and everything they have
     logged. The strip is the one thing here the leaderboard cannot
     say: a total of 97 is the same number whether it came from a
     fortnight of everything or thirty days of one. */
  function scFriendSheet(p) {
    scSheet(p.name, function (body) {
      var r = peers[p.code] || {};

      /* TWO FIGURES, not one hero and a caption. The total was 30px
         with `ticks in thirty days · 20 days showing up` running under
         it as one sentence — which put the two numbers you came to
         compare at different sizes, one of them inside prose. They are
         the same kind of thing, so they get the same treatment and sit
         side by side.

         The face went with it. The sheet's own title is their name, so
         a 60px portrait under it was the third time in six inches that
         the screen said who this is. */
      var pair = scEl('div', 'fp-pair');
      var fig = function (n, cap) {
        var d = scEl('div');
        d.appendChild(scEl('b', '', String(n)));
        d.appendChild(scEl('span', '', cap));
        pair.appendChild(d);
      };
      fig(p.ticks, 'ticks · 30 days');
      fig(p.streak, p.streak === 1 ? 'day showing up' : 'days showing up');
      body.appendChild(pair);

      body.appendChild(scEl('span', 'label fp-k', 'Last seven days'));
      var strip = scEl('div', 'fp-week');
      for (var i = 6; i >= 0; i--) {
        var day = scDayBack(i);
        var n = (r.days && r.days[day]) || 0;
        var cell = scEl('span', 'fp-d' + (n ? ' on' : ''));
        /* A disc per day, and its SIZE says how many of the five. A day
           with none is a flat neutral at the smallest size — never a
           red one. That is the habits screen's rule and its reason: a
           wash of red across a week somebody missed is a judgement
           about them, and a smaller mark is a fact.

           It was seven bars of different heights, which is a chart, and
           a chart of seven numbers between 0 and 5 is more apparatus
           than the numbers deserve. A row of discs is read at a glance
           and measured by nobody.

           SIZE RATHER THAN OPACITY, and that is not a taste call. The
           first cut varied the alpha of their accent from .42 to 1 and
           was measured across every theme against a spread of peer
           accents: solar's amber at .42 came out at 1.30:1 on the white
           page. Opacity could never have fixed it either — that amber
           at FULL strength is about 1.9:1 on white, so the accent
           itself is the problem and diluting it only made a bad number
           worse. Size costs no contrast at all: every disc is drawn at
           the one strength scCrown has already solved to clear 3:1 on
           your page, and the count moves the diameter instead. */
        var bar = scEl('i');
        if (n && p.acc) bar.style.background = scCrown(p.acc);
        bar.style.width = (n ? 46 + (Math.min(n, 5) - 1) * 13.5 : 46) + '%';
        var hold = scEl('span', 'fp-hold');
        hold.appendChild(bar);
        cell.appendChild(hold);
        /* Two letters, not one. One gives W T F S S M T across a week,
           where two of the T's are different days and so are both S's —
           a strip whose whole job is telling you which day is which. */
        cell.appendChild(scEl('span', 'fp-w',
          ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(day + 'T12:00:00').getDay()]));
        cell.title = n + (n === 1 ? ' tick' : ' ticks');
        strip.appendChild(cell);
      }
      body.appendChild(strip);

      var logs = (Array.isArray(r.logs) ? r.logs : []).slice().reverse();
      body.appendChild(scEl('span', 'label fp-k', logs.length ? 'Their logs' : 'No logs yet'));
      logs.slice(0, 20).forEach(function (q) {
        body.appendChild(scPost({ p: q, who: p.name, acc: p.acc, ink: p.ink, pic: p.pic }));
      });

      /* `Remove`, and nothing else. It carried a two-line explanation
         of what removing does — on a sheet you opened to look at
         somebody, about the one control there you are least likely to
         press. Removing a friend takes them off a list; it is not the
         kind of delete that needs warning about, and the sheet says so
         by not saying anything. */
      body.appendChild(scEl('div', 'menu-rule'));
      var rm = scEl('button', 'menu-item bad fp-rm');
      rm.appendChild(document.createTextNode('Remove'));
      rm.addEventListener('click', function () {
        scDropFriend(p.code);
        scClose();
        scPaintFriends();
        scToast(p.name + ' removed', false);
      });
      body.appendChild(rm);
    });
  }

  /* ── writing one ── */
  function scLogSheet() {
    scSheet('Write a log', function (body) {
      var chosen = '';
      var shot = null;      /* the data URL, for the preview and the upload */

      var prev = scEl('div', 'lg-prev');
      prev.hidden = true;
      body.appendChild(prev);

      var file = scEl('input', 'pic-file');
      file.type = 'file';
      file.accept = 'image/*';
      file.addEventListener('change', function () {
        var f = file.files && file.files[0];
        if (!f) return;
        scShot(f, function (url) {
          if (!url) { scToast('That image could not be read', false); return; }
          shot = url;
          prev.textContent = '';
          var im = document.createElement('img');
          im.src = url; im.alt = '';
          prev.appendChild(im);
          prev.hidden = false;
        });
      });
      body.appendChild(file);

      body.appendChild(scEl('span', 'label', 'About'));
      var row = scEl('div', 'lg-row');
      TALLY.forEach(function (t) {
        var b = scEl('button', 'lg-c');
        b.type = 'button';
        b.textContent = t.n;
        b.addEventListener('click', function () {
          chosen = chosen === t.id ? '' : t.id;
          [].forEach.call(row.querySelectorAll('.lg-c'), function (c) {
            c.classList.toggle('on', c === b && chosen === t.id);
          });
        });
        row.appendChild(b);
      });
      body.appendChild(row);

      body.appendChild(scEl('span', 'label', 'Caption'));
      var cap = scEl('textarea', 'field');
      cap.rows = 3;
      cap.maxLength = 240;
      body.appendChild(cap);

      var acts = scEl('div', 'acts');
      acts.appendChild(scBtn('off', 'Add a photo', function () { file.click(); }));
      var post = scBtn('go', 'Post it', function () {
        var text = cap.value.trim();
        if (!text && !shot) { scToast('A photograph or a line, at least', false); return; }
        post.disabled = true;
        post.textContent = 'Posting…';
        var finish = function (imgId) {
          posts.push({
            id: scRand(10, HEX_A), at: Date.now(), day: scDay(),
            item: chosen, cap: text, img: imgId || '',
            /* The local copy, so your own post draws instantly and
               still draws with no signal. The id is what a friend
               fetches; this is never sent. */
            local: imgId ? shot : ''
          });
          posts = posts.slice(-30);
          scWriteJSON(POST_KEY, posts);
          scPushNow();
          scClose();
          scPaintFriends();
          scToast('Posted', false);
        };
        if (!shot) return finish('');
        scUpload(shot, function (id) {
          if (!id) {
            post.disabled = false;
            post.textContent = 'Post it';
            scToast('The picture would not upload', false);
            return;
          }
          finish(id);
        });
      });
      acts.appendChild(post);
      body.appendChild(acts);
      setTimeout(function () { cap.focus(); }, 260);
    });
  }

  /* 900px square at 0.78, which lands well inside the worker's 400KB
     ceiling for anything a phone camera produces. Bigger is not free:
     it is a photograph going up a mobile connection to be looked at in
     a 350px column. */
  function scShot(file, done) {
    var fr = new FileReader();
    fr.onerror = function () { done(null); };
    fr.onload = function () {
      var img = new Image();
      img.onerror = function () { done(null); };
      img.onload = function () {
        var S = 900, c = document.createElement('canvas');
        c.width = S; c.height = S;
        var side = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img,
          (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
        try { done(c.toDataURL('image/jpeg', 0.78)); } catch (e) { done(null); }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  /* A data URL is base64 text; the worker wants the bytes. Decoded
     here rather than posted as a string, because base64 is a third
     bigger and the 400KB ceiling is on what arrives. */
  function scUpload(dataURL, done) {
    var bin;
    try {
      var b64 = dataURL.slice(dataURL.indexOf(',') + 1);
      var raw = atob(b64);
      bin = new Uint8Array(raw.length);
      for (var i = 0; i < raw.length; i++) bin[i] = raw.charCodeAt(i);
    } catch (e) { return done(null); }
    scApi('/v1/img?code=' + net.code, { method: 'POST', auth: true, bin: true, body: bin },
      function (r) { done(r && r.id); });
  }

  /* Which view is up, remembered. Its own key: the schedule is the
     record and this is a preference about looking at it, and folding a
     preference into the record is how a damaged one takes the other
     down with it. */
  var VIEW_KEY = 'sched.view.v1';
  var view = 'list';

  /* Three stops, cycled by one button. A fifth control on the bar would
     be wrong — the orrery learned that on a row of five — and these are
     three ways of looking at the same day rather than three places to
     go, which is exactly what a cycle is for. */
  var VIEWS = ['list', 'ring', 'tally', 'friends'];

  function scSetView(v, save) {
    view = VIEWS.indexOf(v) >= 0 ? v : 'list';
    var ring = view === 'ring', tal = view === 'tally', fr = view === 'friends';

    /* The history sits OUTSIDE the tally section, so hiding the section
       would leave it up over whatever you switched to. */
    scCloseHist();

    $('scRing').hidden = !ring;
    $('scTally').hidden = !tal;
    $('scFriends').hidden = !fr;
    $('scRail').hidden = ring || tal || fr;
    $('scDeckWin').hidden = ring || tal || fr;
    /* The dots are a SIBLING of the rail, not a child — the rail is the
       scroller, and a page indicator that scrolls sideways with the
       cards it indicates is not an indicator. So it has to be hidden
       with it: left alone it sat on the friends board and the tally
       under a week that was not on screen. */
    var wkd = document.querySelector('.wk-dots');
    if (wkd) wkd.hidden = ring || tal || fr;
    /* Coming back to the week: re-measure, because the window's own
       rect was zero for as long as it was hidden, and re-centre, because its
       transform went with it. */
    if (!(ring || tal || fr)) {
      scDeckFit($('scRail'), wkd);
      scDeckJump();
    }
    /* The ring's own middle says the state and the figure, and the
       tally has a hero of its own. Leaving the week's above either says
       it twice, and the louder of the two is the one that is not the
       point of the screen. */
    $('scLive').hidden = ring || tal || fr;
    $('scLiveOf').hidden = ring || tal || fr;
    $('scEmpty').hidden = ring || tal || fr || state.items.length > 0;

    /* The tab you are on, lit. The old single button had to draw the
       NEXT view rather than the current one — a control that shows its
       own state reads as a status light — and the cost of that was
       that nothing on screen ever said where you were. Four tabs say
       both, and cost the same strip. */
    [].forEach.call(document.querySelectorAll('.tab[data-view]'), function (t) {
      var on = t.dataset.view === view;
      t.classList.toggle('on', on);
      t.setAttribute('aria-current', on ? 'page' : 'false');
    });

    if (save) { try { localStorage.setItem(VIEW_KEY, view); } catch (e) {} }
    if (ring) { scPaintRing(); scPaintRingList(); }
    else if (tal) scPaintTally();
    /* ARRIVING claims, drawing only draws — the same split the refresh
       already keeps. A paint that fetched would recurse the first time
       it ran, which is a bug this file has already had once. */
    else if (fr) { scPaintFriends(); scFrStop(frStop, false); scArriveFriends(); }
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
    else $('scAdd').focus();
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
    /* The bar's microphone is gone, so the live state is on the sheet's
       own button now — and it may not be on screen when this runs. */
    var s2 = document.querySelector('.say');
    if (s2) s2.classList.remove('is-live');
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

      /* ── the speak button, and it is not optional ──
         Speech used to start one way only: the bar's microphone called
         this sheet with auto set. With that control gone there would be
         NO route to it at all — the sheet would silently become a text
         box, and the feature this app was built around would still be
         in the code, unreachable. It lives here now. */
      if (SR) {
        var say = scEl('button', 'say');
        var mk = function (live) {
          say.textContent = '';
          say.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/>'
            + '<path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
          say.appendChild(document.createTextNode(live ? 'Listening…' : 'Say it'));
          say.classList.toggle('is-live', !!live);
        };
        mk(false);
        say.addEventListener('click', function () {
          if (rec) { scStopVoice(); mk(false); return; }
          listen();
          mk(true);
        });
        body.appendChild(say);
      }

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

      /* ── listening, as a function ──
         It was inline and reachable one way only: scVoiceSheet(true),
         called by the bar's microphone. With that control gone the
         whole block would have been dead code and the sheet would have
         become a text box, silently. It is a function now, called from
         the auto path and from the sheet's own speak button. */
      function listen() {
        heard.hidden = false;
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
          if (part) heard.appendChild(scEl('span', 'partial', (fin ? ' ' : '') + part));
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
          clearTimeout(recTimer);
          rec = null;
          var sb = document.querySelector('.say');
          if (sb) sb.classList.remove('is-live');
          $('scSheetTitle').textContent = finalText.trim() ? 'Heard' : 'Say it, or type it';
          if (finalText.trim()) { field.value = finalText.trim(); show(field.value); }
          else if (!heard.hidden && !/microphone|connection|catch/.test(heard.textContent)) {
            heard.textContent = 'Nothing heard. Type it below, or press Say it again.';
          }
        };

        try {
          rec.start();
          /* Some browsers never fire onend when nothing is said at all. */
          recTimer = setTimeout(scStopVoice, 15000);
        } catch (e) {
          heard.textContent = 'Could not start the microphone. Type it below.';
          rec = null;
        }
      }

      if (SR && auto) { listen(); return; }
      heard.hidden = true;
      setTimeout(function () { field.focus(); }, 340);
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
      /* ── the other direction ──
         The tally ticks Train and the week agrees. This is the same
         edge walked the other way: finish the block here and the item
         ticks. It lives in the editor rather than on the row because
         the row IS a button and a button inside a button is invalid —
         the same trap the folding panels have a rule about.

         EVERY BLOCK NOW, not only the three that feed one of the five.
         The restriction was written when the measure filling solid was
         the only mark a done block had, and the measure existed to
         agree with the tally \u2014 so a "done" on Trading really was a
         state nothing on the screen would draw. The row draws a tick
         for ANY done block now, so there is no longer a reason to
         refuse it for Trading, Work or Wake.

         The day still has to be open for backfill. That rule is about
         not filling in a fortnight on a Sunday night, which has nothing
         to do with which item a block feeds, and it stays. */
      if (!isNew) {
        var bDay = scDay(scDateOfDow(day));
        if (scTallyOpen(bDay)) {
          var done = !!(blockLog[bDay] && blockLog[bDay][item.id]);
          var fed = scItemsFor(item.n).map(function (x) { return x.n; }).join(' and ');
          /* A TOGGLE, not a third action. As an scBtn it carried
             flex:1, which does nothing outside a flex parent, so it sat
             156px wide above two 172px buttons \u2014 visibly failing to
             line up with the row it looked like it belonged to. */
          var tog = scEl('button', 'mark' + (done ? ' is-on' : ''));
          tog.type = 'button';
          tog.appendChild(document.createTextNode('Done today'));
          tog.insertAdjacentHTML('beforeend',
            '<svg viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M4.5 12.8l5.2 5.2L19.5 6"/></svg>');
          tog.setAttribute('aria-pressed', done ? 'true' : 'false');
          tog.addEventListener('click', function () {
            scSetBlockDone(bDay, item, day, !done);
            scClose();
            if (view === 'tally') scPaintTally(); else scRender();
            /* Only name what it fed when it fed something. Dropping the
               gate without this leaves "Counted toward " with nothing
               after it on every block that feeds nothing. */
            scToast(done ? 'Unmarked'
              : fed ? 'Counted toward ' + fed : 'Marked done', false);
          });
          body.appendChild(scEl('span', 'label', 'Today'));
          body.appendChild(tog);
        }
      }

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

  /* ═══════════════════════════════════════════════════════════
     YOUR PICTURE

     A face by default, and a photograph over it if you choose one.

     THE FACE IS DERIVED, NOT STORED. It is your accent with the colour
     that palette already uses ON its accent drawn on top, so changing
     theme changes your face and there is nothing to keep in step. It
     also cannot fail a contrast check: accent-against-on-accent is the
     exact pairing every palette here was measured on before it
     shipped, and the worst of the thirteen is Paper's own 4.68:1.

     The geometry is measured off the reference rather than remembered.
     A first pass drawn from memory came out a generic smiley — eyes
     half again too big and too close together, mouth twice the weight
     and nearly centred. As fractions of a 100 box:

       eyes    cx 22 and 84, cy 35, r 5
       mouth   43 to 92, dipping to 70, stroke 4.5

     THE OFFSET IS THE WHOLE CHARACTER OF IT. The mouth's left end
     starts nearer the middle than the left eye does and its right end
     runs past the right eye entirely, so the face reads as glancing
     sideways rather than as a symmetrical smiley. Centre it and it
     stops being this face.

     A stroked arc with round caps, never a filled crescent: the weight
     then scales with the tile instead of collapsing to a smear at the
     26px a feed uses. */
  var PIC_KEY = 'sched.pic.v1';
  var myPic = null;

  function scFaceIn(px, acc, ink) {
    var NS = 'http://www.w3.org/2000/svg';
    var mk = function (n, a) {
      var e = document.createElementNS(NS, n);
      for (var k in a) if (a.hasOwnProperty(k)) e.setAttribute(k, a[k]);
      return e;
    };
    var cs = getComputedStyle(document.documentElement);
    var red = acc || cs.getPropertyValue('--red').trim();
    var on = ink || cs.getPropertyValue('--on-red').trim();
    var s2 = mk('svg', { viewBox: '0 0 100 100' });
    s2.setAttribute('aria-hidden', 'true');
    s2.appendChild(mk('rect', { x: 0, y: 0, width: 100, height: 100, fill: red }));
    s2.appendChild(mk('circle', { cx: 22, cy: 35, r: 5, fill: on }));
    s2.appendChild(mk('circle', { cx: 84, cy: 35, r: 5, fill: on }));
    s2.appendChild(mk('path', { d: 'M43 62 Q67 78 92 60', fill: 'none', stroke: on,
      'stroke-width': 4.5, 'stroke-linecap': 'round' }));
    var w = scEl('span', 'pic');
    w.style.width = px + 'px'; w.style.height = px + 'px';
    w.appendChild(s2);
    return w;
  }

  function scFace(px) { return scFaceIn(px, null, null); }

  /* One person's picture at one size: the photograph if there is one,
     the face out of their palette if there is not. */
  function scPicIn(px, src, acc, ink) {
    if (!src) return scFaceIn(px, acc, ink);
    var w = scEl('span', 'pic');
    w.style.width = px + 'px'; w.style.height = px + 'px';
    var i = document.createElement('img');
    i.src = src; i.alt = '';
    w.appendChild(i);
    return w;
  }

  function scPic(px) { return scPicIn(px, myPic, null, null); }

  function scPicOf(px, p) {
    if (p.me) return scPic(px);
    return scPicIn(px, p.pic ? scImgURL(p.pic) : '', p.acc, p.ink);
  }


  /* IndexedDB, not localStorage, and the reason is written down two
     apps over: a picture in localStorage shares a 5MB budget with the
     record, so the day it is too big it does not fail by itself — it
     takes the schedule with it. The trading app keeps its chart images
     the same way and for the same reason. */
  function scPicDB(fn) {
    var r = indexedDB.open('schedPic', 1);
    r.onupgradeneeded = function () {
      if (!r.result.objectStoreNames.contains('pic')) r.result.createObjectStore('pic');
    };
    r.onsuccess = function () { fn(r.result); };
    r.onerror = function () { fn(null); };
  }
  function scPicLoad(done) {
    try {
      scPicDB(function (db) {
        if (!db) return done();
        var q = db.transaction('pic').objectStore('pic').get('me');
        q.onsuccess = function () { myPic = q.result || null; done(); };
        q.onerror = function () { done(); };
      });
    } catch (e) { done(); }
  }
  function scPicSave(v, done) {
    myPic = v;
    try {
      scPicDB(function (db) {
        if (!db) return done && done();
        var st = db.transaction('pic', 'readwrite').objectStore('pic');
        if (v) st.put(v, 'me'); else st.delete('me');
        st.transaction.oncomplete = function () { done && done(); };
      });
    } catch (e) { done && done(); }
    /* The copy your friends see is a separate upload, and only if you
       have friends on. Taking the photograph away clears the id rather
       than leaving the old one up: the face is what a cleared id draws,
       and it is the answer you just chose. */
    if (!net.on) return;
    if (!v) { net.pic = ''; scNetSave(); scPush(); return; }
    scUpload(v, function (id) {
      if (!id) return;
      net.pic = id;
      scNetSave();
      scPushNow();
    });
  }

  function scPicSheet() {
    scSheet('Your picture', function (body) {
      var row = scEl('div', 'pic-row');
      row.appendChild(scPic(76));
      /* Both, always: what you have now and what your theme gives you
         if you take it away. A picker that shows only the current state
         makes removing a photo feel like deleting something rather than
         going back to a default. */
      if (myPic) {
        var d = scFace(76);
        d.classList.add('is-off');
        row.appendChild(d);
      }
      body.appendChild(row);
      body.appendChild(scEl('p', 'hint', myPic
        ? 'Yours now, and the face your theme gives you if you take it away.'
        : 'Your theme draws this. Change palette and it changes with you.'));

      var file = scEl('input', 'pic-file');
      file.type = 'file';
      file.accept = 'image/*';
      file.addEventListener('change', function () {
        var f = file.files && file.files[0];
        if (!f) return;
        scPicCrop(f, function (url) {
          if (!url) { scToast('That image could not be read', false); return; }
          scPicSave(url, function () {
          scClose(); scPaintTabFace(); scToast('Picture set', false);
        });
        });
      });
      body.appendChild(file);

      var acts = scEl('div', 'acts');
      if (myPic) acts.appendChild(scBtn('off', 'Use the face', function () {
        scPicSave(null, function () {
          scClose(); scPaintTabFace(); scToast('Back to the face', false);
        });
      }));
      acts.appendChild(scBtn('go', myPic ? 'Choose another' : 'Choose a photo',
        function () { file.click(); }));
      body.appendChild(acts);

      body.appendChild(scEl('p', 'hint',
        'A picture is the first thing this app would ever send anywhere, and it '
        + 'only would once you add a friend. The face never leaves — it is drawn '
        + 'from the palette you already picked.'));
    });
  }

  /* Cropped square and scaled down before it is stored. A phone camera
     hands over four megapixels; kept whole that is several megabytes
     sitting in a database to be drawn at 26 pixels. 256 is twice what
     the largest use needs, which is the margin a retina screen wants
     and nothing more. */
  function scPicCrop(file, done) {
    var fr = new FileReader();
    fr.onerror = function () { done(null); };
    fr.onload = function () {
      var img = new Image();
      img.onerror = function () { done(null); };
      img.onload = function () {
        var S = 256, c = document.createElement('canvas');
        c.width = S; c.height = S;
        var side = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img,
          (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, S, S);
        try { done(c.toDataURL('image/jpeg', 0.82)); } catch (e) { done(null); }
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
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

      /* Your picture, first: it is the one row in here that is about
         you rather than about the app. */
      var pr = scEl('button', 'menu-item pic-item');
      pr.appendChild(scPic(38));
      var pl = scEl('span');
      pl.appendChild(document.createTextNode('Your picture'));
      pl.appendChild(scEl('span', 'sub-note', myPic ? 'A photo' : 'Drawn from your theme'));
      pr.appendChild(pl);
      pr.addEventListener('click', scPicSheet);
      body.appendChild(pr);

      /* ── the theme row ──
         A swatch, not a word. "Aurora" tells you nothing you can act
         on; a disc of the ground with the accent drawn on it is the
         choice itself, at the size a thumb needs.

         Split light from dark and labelled. Thirteen chips in one
         undifferentiated block is a colour chart; the first thing
         anyone deciding wants is the half they are in, and it is the
         only grouping the set actually has.

         It applies on press and stays open, because you are comparing —
         a picker that closes on the first tap makes you reopen it
         thirteen times to see thirteen themes. */
      var row = scEl('div', 'themes');
      var hint = scEl('p', 'hint');
      hint.style.marginTop = '2px';

      var chip = function (t) {
        var b = scEl('button', 'theme' + (t.id === theme ? ' on' : ''));
        b.type = 'button';
        b.dataset.theme = t.id;
        var disc = scEl('i', 'swatch');
        /* The same three washes the page itself gets, on a 34px disc, so
           the chip is a photograph of the theme rather than a label for
           it. --g3 is missing on the older sets and resolves to
           transparent, which is what they draw. */
        disc.style.background =
          'radial-gradient(140% 92% at 8% 116%, ' + (t.t['--g1'] || 'transparent') + ' 0%, transparent 74%),' +
          'radial-gradient(120% 66% at 100% -12%, ' + (t.t['--g2'] || 'transparent') + ' 0%, transparent 70%),' +
          'radial-gradient(125% 84% at 96% 112%, ' + (t.t['--g3'] || 'transparent') + ' 0%, transparent 72%),' +
          t.t['--g0'];
        disc.style.borderColor = t.t['--hair'];
        var dot = scEl('u');
        dot.style.background = t.t['--red'];
        disc.appendChild(dot);
        b.appendChild(disc);
        b.appendChild(scEl('span', 'theme-n', t.name));
        b.setAttribute('aria-label', t.name + '. ' + t.note);
        b.setAttribute('aria-pressed', t.id === theme ? 'true' : 'false');
        b.addEventListener('click', function () {
          scPaint(t.id, true);
          [].forEach.call(row.querySelectorAll('.theme'), function (c) {
            var on = c.dataset.theme === t.id;
            c.classList.toggle('on', on);
            c.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          hint.textContent = t.name + ' \u00b7 ' + t.note + ' on the smallest type';
        });
        return b;
      };

      [['Light', 'light'], ['Dark', 'dark']].forEach(function (grp) {
        var mine = THEMES.filter(function (t) { return t.kind === grp[1]; });
        if (!mine.length) return;
        row.appendChild(scEl('span', 'theme-h', grp[0]));
        var g = scEl('div', 'theme-g');
        mine.forEach(function (t) { g.appendChild(chip(t)); });
        row.appendChild(g);
      });

      var lab = scEl('span', 'label', 'Theme');
      lab.style.marginTop = '2px';
      body.appendChild(lab);
      body.appendChild(row);
      hint.textContent = scTheme(theme).name + ' \u00b7 ' + scTheme(theme).note + ' on the smallest type';
      body.appendChild(hint);

      var rule = scEl('div', 'menu-rule');
      body.appendChild(rule);

      /* Friends, where the app's other settings are. It used to be
         reached from a row on the board itself, which put a control
         you want about once a month directly under the leaderboard —
         and the one thing anybody actually opened it for, your code,
         is now on Add a friend where the swap happens. */
      item('Friends', net.on ? 'On \u00b7 ' + net.code : 'Off', '', scNetSheet);

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
  try {
    var sv = localStorage.getItem(VIEW_KEY);
    if (VIEWS.indexOf(sv) >= 0) view = sv;
  } catch (e) {}

  /* The ticks, before the first paint for the same reason the theme is:
     the tally can be the view you left it on, and it opening empty and
     filling in a frame later reads as having lost the day. */
  scTickLoad();
  scObjLoad();

  try {
    var fs2 = localStorage.getItem(FRSTOP_KEY);
    if (fs2 === 'board' || fs2 === 'feed') frStop = fs2;
  } catch (e) {}

  /* Whether friends are on, and who is on your list. Reading it makes
     no request — with no URL stored, scApi returns before it builds
     one — so an app nobody has turned this on for behaves exactly as
     it did before any of this existed. */
  scNetLoad();

  /* ── the link somebody was sent ──
     Read here and NOT acted on here. Reading a hash costs nothing and
     reaches nothing; the join and the add happen on arrival at the
     friends tab, through the same path every other visit takes, so the
     rule that this app makes no request until you are on that screen
     holds for an invitation exactly as it does for an ordinary open.

     The hash is stripped the moment it is read. Left in the address
     bar it is redeemed again on every reload — spent, so it adds
     nothing, but it also means a bookmark of this page is somebody
     else's invitation forever. `replaceState` rather than assigning
     `location.hash`, which would push a history entry and make Back
     into a no-op that looks broken. */
  var hash = location.hash || '';
  if (hash) {
    invite = scInviteIn(hash);
    if (invite) {
      view = 'friends';
      try {
        history.replaceState(null, '', location.href.replace(/#.*$/, ''));
      } catch (e) {}
    }
  }

  /* The picture is read asynchronously and nothing waits for it: the
     face is a complete answer on its own, so a photograph arriving a
     frame later replaces a real thing rather than filling a hole. */
  scPicLoad(function () { scPaintTabFace(); });

  /* Before the first paint, so the app opens in its theme rather than
     flashing white on the way to it. scTheme falls back to Paper on a
     stored id that no longer exists — it is a preference and there is
     nothing in it worth repairing. */
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) scPaint(saved, false);
  } catch (e) {}

  scRender();
  scSetView(view, false);

  [].forEach.call(document.querySelectorAll('.tab[data-view]'), function (t) {
    t.addEventListener('click', function () { scSetView(t.dataset.view, true); });
  });
  [].forEach.call(document.querySelectorAll('.fr-stop'), function (t) {
    t.addEventListener('click', function () { scFrStop(t.dataset.stop, true); });
  });
  $('scTabYou').addEventListener('click', scMenuSheet);

  /* The face in the You tab is redrawn whenever the palette moves,
     because it is derived from it — a tab holding last theme's face is
     the one place the derivation would be visible as a bug. */
  function scPaintTabFace() {
    var f = $('scTabFace');
    if (!f) return;
    f.textContent = '';
    var p2 = scPic(21);
    while (p2.firstChild) f.appendChild(p2.firstChild);
  }
  scPaintTabFace();

  /* Add opens the sheet that takes a sentence spoken OR typed. It does
     not auto-listen: the microphone used to be a separate control, so
     pressing it WAS the decision to speak. This one is the general
     "add" and starting the microphone on every press would ask for a
     permission prompt from somebody who meant to type. */
  $('scAdd').addEventListener('click', function () {
    if (rec) { scStopVoice(); return; }
    scVoiceSheet(false);
  });
  $('scScrim').addEventListener('click', scClose);

  $('scTitle').addEventListener('click', function () {
    scTextSheet('Rename', 'Title', state.title, function (v) { state.title = v || 'Schedule'; });
  });
  $('scSub').addEventListener('click', function () {
    scTextSheet('Subtitle', 'Subtitle', state.sub, function (v) { state.sub = v; });
  });

  /* The history takes Escape FIRST. Both can be open at once — the
     number sheet is reachable from a row whose strip is also pressable —
     and closing the thing underneath while the thing on top stays up is
     the wrong one every time. */
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (!$('scTyVeil').hidden) { ev.preventDefault(); scCloseHist(); return; }
    if (sheetOpen) { ev.preventDefault(); scClose(); }
  });

  /* Tap anywhere, the panel included — it says so on the panel, and a
     card you have finished reading is a card you want gone rather than
     one you want to hunt a cross on. */
  $('scTyVeil').addEventListener('click', scCloseHist);

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
