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
  /* Written out rather than taken off Intl. Every printed TIME in this
     app follows the phone, and these do not: they are three labels
     over a dot grid, and a locale that spells a month at full length
     puts "September" across a 118px column. */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
  /* THE SUBTITLE IS GONE, and the span is why. It only ever said "Up
     at 6:00 · down at 22:45" — which the span above now draws, with a
     dot on it saying where in that window you are. A sentence and a
     picture of the same fact, one under the other, is the duplication
     this project keeps having to take back out.

     scClean drops the field rather than carrying it forward: a stored
     string nothing renders and nothing can edit is not preserved data,
     it is a key that will outlive everyone who remembers what it was
     for. */
  var SEED = {
    title: 'Daily Process',
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
    var out = { title: SEED.title, items: [] };
    if (!raw || typeof raw !== 'object') return out;
    if (typeof raw.title === 'string') out.title = raw.title.slice(0, 60);
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
    /* ── AND THE REPAIR IS SAVED ──
       scClean mints an id for every block that has none, and without
       this those ids are new on every single load: blockLog and
       trainLog are keyed BY id, so a stored week that predates ids
       orphans its whole record on the next open, silently and
       repeatedly. Writing the cleaned shape back is what makes an id
       a fact about a block rather than a fact about this page view. */
    scSave();
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
    return scT(s) + scMerIf(s) + ' to ' + scT(e) + scMerIf(e);
  }

  /* Strict 24-hour, and it stays that way whatever the phone shows:
     this is the value an <input type="time"> takes and the format the
     parser reads back. What a PERSON sees goes through scT below. */
  function scHHMM(min) { return scPad(Math.floor(min / 60)) + ':' + scPad(min % 60); }

  /* ── the phone's own clock ──
     Asked by FORMATTING a known afternoon time and looking for
     letters, not by reading a locale off Intl. On iOS the 24-Hour Time
     switch in Settings changes what toLocaleTimeString draws while the
     locale stays whatever it was — so the only reliable question is
     what the device actually renders, which is the one this asks.
     Intl is the fallback for an engine whose toLocaleTimeString says
     nothing, and 24-hour is the last resort because it is the reading
     that cannot be ambiguous.

     Resolved ONCE: it cannot change without the page reloading, and a
     locale lookup per drawn row is sixteen of them a render. */
  var H12 = (function () {
    try {
      var t = new Date(2000, 0, 1, 13, 5).toLocaleTimeString();
      if (/\d/.test(t)) return /[ap]\.?\s?m/i.test(t);
    } catch (e) {}
    try {
      var o = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
      if (typeof o.hour12 === 'boolean') return o.hour12;
      if (o.hourCycle) return o.hourCycle === 'h11' || o.hourCycle === 'h12';
    } catch (e) {}
    return false;
  })();

  /* A time as the phone writes it, WITHOUT the meridiem — a separate
     call, because a range prints it once on the end rather than twice
     and an axis may not want it at all. */
  function scT(min) { return H12 ? sc12(min) : scHHMM(min); }
  /* '' on a 24-hour phone, so every caller can concatenate it blind. */
  function scMerIf(min) { return H12 ? ' ' + scMer(min) : ''; }

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
  /* ── "now" ──
     The one time word that needs no digits. Two patterns rather than
     one with an optional tail: an optional group after \bnow\b makes
     "now" and "now for 2 hours" the same match at the same index, and
     the one that wins is then whichever the engine backtracks to,
     which is not a thing to leave to the engine. */
  var RE_NOW_FOR = /\bnow\s*(?:for|,)?\s*(\d{1,3})\s*(hours?|hrs?|h|minutes?|mins?|m)\b/g;
  var RE_NOW = /\bnow\b/g;

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
    /* ── NOW, and an hour of it ──
       Scanned whatever else the sentence carries, and used for the
       time only if nothing else set one: an explicit clock beats it,
       because somebody who says both is correcting themselves and the
       digits are the correction. But the WORD is struck out either
       way, and it supplies the day either way — "read now at 3" was
       landing a block called "Read Now" that still did not know which
       day it was on, which is the app hearing the word and using none
       of it.

       An hour is the default, for the same reason a bare "at 9" gets
       one. Clamped to the end of the day rather than rolled over: a
       block from 23:40 to 00:40 is on two days and this app's whole
       record is one day per row. */
    var nowSeen = false, nowSpan = null;
    var nowScan = function (re, dur) {
      var mm;
      re.lastIndex = 0;
      while ((mm = re.exec(low))) {
        if (!free(mm.index, mm.index + mm[0].length)) continue;
        var len = dur ? (/^(h|hr|hour)/.test(mm[2]) ? +mm[1] * 60 : +mm[1]) : 60;
        if (!(len > 0 && len <= 480)) continue;
        mark(mm.index, mm.index + mm[0].length);
        nowSeen = true;
        var st = scNowMin();
        if (st < 1439) nowSpan = { s: st, e: Math.min(1440, st + len) };
        return true;
      }
      return false;
    };
    if (!nowScan(RE_NOW_FOR, true)) nowScan(RE_NOW, false);
    if (!span && nowSpan) span = nowSpan;

    if (span) { out.s = span.s; out.e = span.e; }
    /* "now" carries its own day. Saying it on a Tuesday and being asked
       which day is the app not having listened — and the day words are
       struck out long before this runs, so it can only be filled in
       here. */
    if (nowSeen && !out.days.length) out.days = [new Date().getDay()];

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

  /* ── ONE DAY, DRAWN IN FULL ──
     The deck is gone: seven cards on a track, a window that had to be
     measured against the painted floor of the bar, a transform that
     centred the open one, page dots, and a face over every shut card.
     All of it existed to put seven days on a phone at once, and all of
     it is what made this screen read as the old app underneath a new
     coat. The week is a strip of seven chips and the day you press is
     drawn as one list. */
  function scRender() {
    var today = new Date().getDay();
    painted = new Date().toDateString();
    $('scTitle').textContent = state.title;
    var d = scOpenDay();
    $('scWeek').classList.toggle('is-today', d === today);
    $('scWeek').dataset.d = d;
    scDate();
    scHeadTurn();

    /* ── the week is a strip ──
       Monday first, for the reason the deck had: a rail that began on
       today moves every morning, so the week has no shape to remember
       and Thursday sits somewhere different each time you look. */
    var strip = $('scDayStrip');
    strip.textContent = '';
    ORDER.forEach(function (n) {
      var b = scEl('button', 'st-d' + (n === d ? ' is-on' : ''));
      b.type = 'button';
      b.dataset.d = n;
      var when = new Date(scObjDay(n) + 'T12:00:00');
      b.appendChild(scEl('b', null, ABBR[n]));
      b.appendChild(scEl('i', null, String(when.getDate())));
      b.setAttribute('aria-label', FULL[n] + (n === today ? ', today' : ''));
      b.setAttribute('aria-current', n === today ? 'date' : 'false');
      b.setAttribute('aria-pressed', n === d ? 'true' : 'false');
      b.addEventListener('click', function () { scDeckGo(n); });
      strip.appendChild(b);
    });

    var views = $('scWkViews');
    views.textContent = '';
    views.appendChild(scViews(wkView, function (v) {
      wkView = v;
      try { localStorage.setItem(WKV_KEY, v); } catch (e) {}
      scRender();
    }));

    var rows = scByDay(d);
    $('scEmpty').hidden = state.items.length > 0;
    var card = $('scDayCard');
    card.textContent = '';
    if (!rows.length) {
      var free = scEl('button', 'row is-free');
      free.appendChild(scEl('span', 'n', 'Nothing yet'));
      free.addEventListener('click', function () { scEditSheet(null, d); });
      card.appendChild(free);
    }
      var head3 = {};
      scSessions(rows).forEach(function (g) { head3[g.rows[0].id] = g; });

      /* Each session in a box of its own now — the rows carry their
         own grids, so the argument against wrapping them went with the
         column the time used to sit in — and the box is what the board
         lays out as a column. */
      var sess = null;
      card.classList.toggle('is-board', wkView === 'board');
      rows.forEach(function (it) {
        if (head3[it.id]) {
          var g = head3[it.id];
          sess = scEl('div', 'wk-sess');
          card.appendChild(sess);
          var sh = scEl('div', 'wk-sh'
            + (d === today && scNowMin() >= g.s.a && scNowMin() < g.s.b
               ? ' is-live' : ''));
          /* The word alone. It carried a hairline running off it and a
             count of the rows under it; the count is a figure nobody
             acts on, and the rule was the same mark the rows have
             stopped drawing between themselves. */
          var pillb = scEl('b', { Morning: 'm', Afternoon: 'a', Evening: 'e' }[g.s.k] || '', g.s.k);
          sh.appendChild(pillb);
          sh.appendChild(scEl('span', 'c', String(g.rows.length)));
          /* aria-hidden: the rows below carry their own full day and
             time in their labels, so a screen reader meeting this would
             hear the day sliced twice. It is a visual grouping. */
          sh.setAttribute('aria-hidden', 'true');
          sess.appendChild(sh);
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
        /* Off, on this card's own date. Struck out rather than removed:
           a row that vanishes is a block you have to remember was ever
           there, and the whole point of an exception is that the shape
           underneath it is unchanged. */
        if (scOff(scObjDay(d), it.id)) row.classList.add('is-off');

        /* THE TIME GOES ABOVE THE NAME, and in the source as well as in
           the grid. It used to sit in a third column at the right
           margin, so reading a row meant going across to the edge and
           back for every line; stacked, a row reads down in one
           movement \u2014 when, then what. Appended in this order because a
           screen reader and a tab order follow the source, and a time
           announced after the name it is drawn above is the same
           mistake pointing the other way. */
        /* The meridiem ONCE, on the end, and only where the phone
           writes one at all — with an end time known and a block under
           twelve hours the start has one reading, and the column a
           second one would take is the one holding the name. */
        var tEl = scEl('span', 't',
          scT(it.s) + '\u2013' + scT(it.e) + scMerIf(it.e));
        var n = scEl('span', 'n', it.n);
        if (it.r) n.appendChild(scEl('em', null, it.r));
        /* What you trained, on the block it happened on. It rides the
           name rather than taking a column: it exists on about one row
           of a week, and a track held open across every other row for
           it is the third column the time was moved out of. */
        var wr = scTrainOf(bd, it.id);
        var wk = wr && scWorkName(wr.k);
        if (wk) n.appendChild(scEl('em', 'wo', wk));
        row.appendChild(n);
        /* ── the properties, as pills ──
           The range, the length, and a status word only when there is
           one: Now while the block runs, Done once it is ticked. The
           status is drawn by CSS off the row's own classes, so it can
           never disagree with the state that draws the rest. */
        var props = scEl('span', 'props');
        props.appendChild(tEl);
        props.appendChild(scEl('span', 'dur', scDurShort(it.e - it.s)));
        props.appendChild(scEl('span', 'st'));
        row.appendChild(props);
        row.setAttribute('aria-label',
          it.n + ', ' + FULL[d] + ' ' + scRangeLong(it.s, it.e)
          + (it.r ? ', ' + it.r : '') + (wk ? ', ' + wk : '') + '. Edit.');
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
        /* ONE tick, reached two ways: the check beside the row, and a
           long press on the row itself. The check is the one a keyboard
           and a screen reader can use; the long press is the shortcut
           it always was. */
        var tick = function () {
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
            /* Unticking takes the workout with it. The record is a fact
               ABOUT a finished block, so leaving it behind on one that
               is no longer done is a session the app remembers and the
               row cannot draw. */
            if (was) scTrainSet(bd, it.id, '');
            scRender();
            /* ── the deck, on the press that says it happened ──
               scSheet takes the toast down on its way up, so this is
               the toast rather than something after it: naming the
               block again under a sheet asking about that same block
               is the sentence and the picture this project keeps
               having to take back out. */
            if (!was && scIsTrain(it)) { scTrainAsk(it, d, bd); return; }
            scToast(was ? it.n + ' unticked' : it.n + ' done', false);
        };
        row.addEventListener('pointerdown', function (ev) {
          hx = ev.clientX; hy = ev.clientY; moved = false; fired = false;
          drop();
          held = setTimeout(function () {
            held = null;
            if (moved) return;
            fired = true;
            tick();
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
        /* ── THE CHECK, BESIDE THE ROW ──
           Craft's circle. A sibling of the row rather than a child,
           because a button inside a button is invalid and collapses to
           one press while looking exactly right; the wrapper lays the
           two over each other and the row leaves room for it. It IS
           the done-mark now — the tick that used to sit beside the
           glyph is this, moved to where a thumb expects it. */
        var wrap = scEl('div', 'rowwrap' + (row.classList.contains('is-done') ? ' is-done' : ''));
        var chk = scEl('button', 'chk');
        chk.type = 'button';
        chk.setAttribute('aria-label', (row.classList.contains('is-done') ? 'Untick ' : 'Tick ') + it.n);
        chk.setAttribute('aria-pressed', row.classList.contains('is-done') ? 'true' : 'false');
        chk.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.8l5.2 5.2L19.5 6"/></svg>';
        chk.addEventListener('click', function (ev) { ev.stopPropagation(); tick(); });
        wrap.appendChild(chk);
        wrap.appendChild(row);
        (sess || card).appendChild(wrap);
      });

      /* ── AND TODAY'S CARD ENDS BY ASKING ──
         The foot of the day is where you are when the day is over,
         which Pattern is not: that screen is where you go to READ what
         your good days have in common, so an ask living only there was
         an ask nobody was standing in front of.

         TODAY'S CARD AND NO OTHER. Every card is built for its own
         weekday, and a rating written from Friday's card on a Tuesday
         would land on today under a heading that says Friday — which
         is exactly the round trip through one wrong answer that
         "Done today" made, self-consistently, for months. scDowDate is
         the resolver that can say no, and this draws nothing when it
         does.

         Inside the scroller rather than under it, so on a long day it
         is the thing you arrive at having gone through everything,
         which is when the question makes sense to answer.

         AND ONLY ONCE THE DAY IS DONE. The question is what the day
         was like, which is not one you can answer at eight in the
         morning — and a control sitting under an unfinished list all
         day is one more thing on the card that is not the card. It
         arrives when the last block is ticked, which is the moment
         the day stops being a plan.

         It is a CONVENIENCE, not the only door: Pattern asks
         unconditionally, so a day you never finished is still a day
         you can rate. Gating the only ask in the app on finishing
         everything would make the record impossible to keep on exactly
         the days worth recording. */
    var rd = scDowDate(d);
    if (rd === scDay() && scDayDone(rd, d)) {
      card.appendChild(scRateRow(rd, 'How was today?', function () {
        scRender();
        scPaintTally();
      }));
    }
    if (!card.dataset.wired) {
      card.dataset.wired = '1';
      card.addEventListener('scroll', function () { scCardFade(card); });
    }
    /* The back is rebuilt with the front — an objective is per DATE,
       so the day you press decides which list this is. */
    var flip = $('scFlip');
    var was = flip.querySelector('.wk-back');
    if (was) flip.removeChild(was);
    flip.appendChild(scObjBack(d));
    scCardFade(card);
    scLive();
  }



  /* Open a day and bring it to the middle. The classes move first and
     the centring runs after, because opening takes a card from 76px to
     268px and the track's own layout changes with it. */
  function scDeckGo(d) {
    if (d === scOpenDay()) return;
    openDay = d;
    /* A day found face-down is the app having kept the wrong half of a
       decision, and that is truer still of the day BEFORE the one you
       just pressed. */
    scFlip(d, false, true);
    scRender();
  }


  function scCardFade(card) {
    if (!card) return;
    card.classList.toggle('has-more',
      card.scrollHeight - card.clientHeight - card.scrollTop > 4);
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
  /* 30 min, 2 h, 4.5 h — the figure a pill can carry. */
  function scDurShort(m) {
    if (m < 60) return m + ' min';
    var h = m / 60;
    return (h % 1 ? h.toFixed(1) : String(h)) + ' h';
  }

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

  /* ── a checklist and a target ──
     Reduced, and the reduction is the whole job: the reference has four
     ticked rows and a target with an arrow through it, which at the
     19px this is drawn at is a smudge with a hole in it. Two ticked
     rows, one ring and a centre — the fewest marks that still read as
     BOTH objects.

     The sheet's outline BREAKS where the target crosses it. Drawn
     through, the two shapes merge into one blob at this size; a gap of
     about a unit and a half is what makes them read as a disc in front
     of a page.

     The ring is r5 around a centre dot at r1.2, which leaves 3.8 units
     of the 24 box between them — above the 3.4 this repo measured as
     the floor before a closed shape fills in at row size. Two rings, as
     the reference has, would leave 3 and close up. */
  var OBJ_MARK = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    /* the page, broken at the lower right where the target sits */
    + '<path d="M14.2 10.2V4.9a1.4 1.4 0 00-1.4-1.4H4.4A1.4 1.4 0 003 4.9v13.7'
    + 'a1.4 1.4 0 001.4 1.4h4.3"/>'
    /* two rows, each a tick and a rule */
    + '<path d="M5.2 8.1l1.2 1.2 2.2-2.4M10.8 8.3h2.2"/>'
    + '<path d="M5.2 13.2l1.2 1.2 2.2-2.4M10.8 13.4h1.5"/>'
    /* ── the target, and an arrow still coming ──
       IN FLIGHT, not landed. Which changes the drawing: an arrow buried
       in the bullseye can be a bare shaft, because where it is going is
       obvious — one that has not arrived has to SAY which way it is
       pointing, so the head moves to the leading end and the fletching
       goes.

       And it needs somewhere to be. The target moved down and left to
       clear the top-right corner: at 19px the gap between an arrowhead
       and a ring is about a pixel and a half, and there is no room for
       it while the target sits in the corner the arrow comes from.

       The ring is a whole circle again — nothing crosses it now, so the
       break that stopped the two merging has nothing to do. */
    + '<circle cx="15.4" cy="17.4" r="4.4"/>'
    + '<circle cx="15.4" cy="17.4" r="1.15" fill="currentColor" stroke="none"/>'
    + '<path d="M23 9L19.2 12.8"/>'
    + '<path d="M19.2 12.8l.24-1.99M19.2 12.8l1.99-.24"/>'
    + '</svg>';

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
  /* ── THE DATE THIS CARD IS ──
     Not scDateOfDow, which is the TICK path's resolver: it looks back
     over the two-day backfill window only and then returns TODAY, so
     scTallyOpen can refuse a day that has shut rather than quietly
     filing against one that has not. That is right for a tick and
     wrong for this — every card more than two days behind, and every
     day still to come, was reading and writing TODAY's objectives.
     Friday's card showed today's list, and adding one to it added it
     to today.

     Objectives are per DATE and the deck is the Monday-first week
     containing today, so that is what this answers: this week's
     Monday, this week's Friday, behind you or ahead. A day still to
     come simply has none yet, which is the honest answer — you decide
     an objective on the day. */
  function scObjDay(dow) {
    var d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + ((dow + 6) % 7));
    return scDay(d);
  }

  function scObjBack(d) {
    var day = scObjDay(d);
    var back = scEl('div', 'wk-back');
    /* ── THE FACE IS HEADED, and it has no head of its own ──
       It carried the day name and a second turn control, both of
       which the page's own head now says: the day is up there at
       30px and the one control turns the panel both ways. What is
       left is the heading every other list in this app wears — small
       caps and a count — so the back reads as one of them rather
       than as a screen of its own. */
    var all = scObjFor(day);
    var oh = scEl('div', 'grp-h ob-head');
    oh.appendChild(scEl('b', 'pill', 'Main objectives'));
    if (all.length) oh.appendChild(scEl('span', 'c', String(all.length)));
    back.appendChild(oh);
    var list = scEl('ol', 'ob-list');
    all.forEach(function (o, i) {
      var li = scEl('li');
      var b = scEl('button', 'ob' + (o.done ? ' is-done' : '')
        + (i === 0 ? ' is-frog' : ''));
      /* The circle every row in this app is ticked by, drawn rather
         than pressed: the whole row is the button here, and a button
         inside a button is invalid and collapses to one press. */
      var box = scEl('i', 'ob-box');
      box.setAttribute('aria-hidden', 'true');
      box.innerHTML = '<svg class="ob-tick" viewBox="0 0 24 24">'
        + '<path d="M4.5 12.8l5.2 5.2L19.5 6"/></svg>';
      b.appendChild(box);
      var kind = scIconFor(o.n);
      var ic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ic.setAttribute('class', 'ob-ic');
      ic.setAttribute('viewBox', '0 0 24 24');
      ic.setAttribute('aria-hidden', 'true');
      ic.setAttribute('data-icon', kind);
      ic.innerHTML = BLOCK_ICON[kind];
      b.appendChild(ic);
      b.appendChild(scEl('span', 'ob-t', o.n));
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
      add.appendChild(scEl('span', null, all.length ? 'Add another' : 'Add one'));
      add.addEventListener('click', function () { scObjSheet(d, day); });
      back.appendChild(add);
    }
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
    var f = $('scFlip');
    if (!f) return;
    f.classList.toggle('is-flipped', !!on);
    scHeadTurn();
    if (!quiet && navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
  }
  /* ── THE TURN CONTROL IS IN THE HEAD ──
     There is one panel now rather than seven cards, so the control
     that turns it belongs to the screen rather than to a card — and
     it is the same control both ways round, which is what the two
     faces' corners used to have to agree about by hand. */
  function scHeadTurn() {
    var b = $('scHdTurn');
    if (!b) return;
    var on = $('scFlip').classList.contains('is-flipped');
    b.hidden = view !== 'list';
    b.classList.toggle('is-back', on);
    b.setAttribute('aria-expanded', on ? 'true' : 'false');
    b.setAttribute('aria-label', on
      ? 'Back to the schedule'
      : 'Objectives for ' + FULL[scOpenDay()]);
    if (!b.dataset.wired) {
      b.dataset.wired = '1';
      var g = document.createElement('span');
      g.className = 'tn-g';
      b.appendChild(g);
      b.addEventListener('click', function () {
        scFlip(scOpenDay(), !$('scFlip').classList.contains('is-flipped'));
      });
    }
    b.querySelector('.tn-g').innerHTML = on
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>'
      : OBJ_MARK;
  }

  /* ── which day it is, and what time ──
     "Saturday 29th · 16:19". The date went in as a bare figure and came
     back out: a lone number over a title reads as a count, and the day
     name it needs in order to BE a date was the thing that had been
     taken off it.

     24-hour, matching the span below it — a meridiem beside an axis
     written in 24-hour figures is two clocks on one screen.

     It runs on the live pass rather than the render, because the
     minute changes and the date does not. Half a minute of lag on a
     clock that only shows minutes is a clock that is right most of the
     time and never more than one minute wrong, which is the trade for
     not standing a second timer up beside the one that already runs. */
  function scOrd(n) {
    if (n % 100 >= 11 && n % 100 <= 13) return 'th';
    return ['th', 'st', 'nd', 'rd'][n % 10] || 'th';
  }
  var HEAD_ICON = {
    today: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/>'
      + '<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4'
      + 'M18.4 5.6L17 7M7 17l-1.4 1.4"/></svg>',
    week: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17"'
      + ' height="15" rx="2.5"/><path d="M3.5 10h17M8 3.5v3M16 3.5v3"/></svg>',
    tally: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7"'
      + ' height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13"'
      + ' width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
    friends: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.4"/>'
      + '<path d="M3 19c0-3.2 2.7-5 6-5s6 1.8 6 5"/>'
      + '<path d="M16.5 6.4a3.4 3.4 0 010 6.5M21 19c0-2.7-1.8-4.4-4.2-4.8"/></svg>'
  };
  /* ── THE HEAD SAYS WHICH SCREEN, WHICH DAY, AND WHAT IS ON IT ──
     A glyph tile, the name at 30px, and one line: the date, how many
     blocks, and the clock. The clock runs on the LIVE pass, which is
     why the whole line is written here rather than once at render. */
  function scDate() {
    var t = new Date(), now = scT(scNowMin()) + scMerIf(scNowMin());
    var ic = $('scHdIc'), day = $('scHdDay'), sub = $('scHdDate');
    if (view !== 'list') {
      day.textContent = view === 'tally' ? 'Today' : 'Friends';
      sub.textContent = FULL[t.getDay()] + ' ' + t.getDate() + ' '
        + MON[t.getMonth()] + ' \u00b7 ' + now;
      ic.innerHTML = HEAD_ICON[view === 'tally' ? 'tally' : 'friends'];
      return;
    }
    var d = scOpenDay(), cd = scObjDay(d);
    var when = new Date(cd + 'T12:00:00');
    /* HOURS, not a count of blocks. It is what the day card's own head
       carried, and it is the figure a day off changes: a block marked
       off for one date is not one of the day's hours, which a count of
       rows could never say. */
    var mins = scByDay(d).reduce(function (a2, it) {
      return a2 + (scOff(cd, it.id) ? 0 : it.e - it.s);
    }, 0);
    day.textContent = FULL[d];
    sub.textContent = when.getDate() + ' ' + MON[when.getMonth()]
      + (mins ? ' \u00b7 ' + (mins / 60).toFixed(mins % 60 ? 1 : 0) + ' hrs' : '')
      + ' \u00b7 ' + now;
    ic.innerHTML = HEAD_ICON[d === t.getDay() ? 'today' : 'week'];
  }


  /* The live pass touches classes and one line of text, never the DOM's
     shape — it runs every half minute, and rebuilding the card that
     often would fight a finger that is in the middle of scrolling it. */
  function scLive() {
    if (new Date().toDateString() !== painted) { scRender(); return; }

    /* The tally is a different drawing of the same half-minute pass
       and is the only thing on screen when it is up — so it repaints
       and the rest of this function has nothing to do.

       That guard is not just an optimisation. Everything below
       un-hides the hero, and this runs every thirty seconds: without
       the early return the week's figure comes back on top of the
       tally half a minute after you switch to it, which is the sort of
       fault that only appears if you sit and look at the screen. */
    if (view === 'tally') {
      /* The half-minute pass, so it must not force the stop back: it
         redraws whichever half is up and leaves the other alone. */
      if (tyStop === 'work') scPaintWork(); else scPaintTally();
      return;
    }
    if (view === 'friends') { scPaintFriends(); return; }

    var today = new Date().getDay(), now = scNowMin();
    var rows = document.querySelectorAll('.week.is-today .row');
    var live = null;
    for (var i = 0; i < rows.length; i++) {
      var el = rows[i], s = +el.dataset.s, e = +el.dataset.e;
      if (isNaN(s)) continue;
      /* A block that is not on today cannot be running and cannot be
         behind you: both of those are claims about a thing that was
         going to happen. */
      var skip = el.classList.contains('is-off');
      el.classList.toggle('is-past', !skip && e <= now);
      var on = !skip && s <= now && now < e;
      el.classList.toggle('is-now', on);
      /* The status pill says it in a word, and only while it is true. */
      var st = el.querySelector('.st');
      if (st) { st.textContent = on ? 'Now' : ''; st.classList.toggle('is-now', on); }
      if (on) live = el;
    }

    /* The clock and the dot are the two things up here that move with
       the clock, so both are repainted on the same half-minute pass
       the rows are.

       AND IT IS THE ONLY THING LEFT. There was a hero under the span —
       a state, a 44px clock time and a sentence, then a 10px label
       riding the dot — and each round of taking one out made the next
       one look like what it was: the running block is already the one
       row on the open card wearing the accent and a sweep, four inches
       below, and the dot already says where in the day that is. A head
       that repeats the card is a head you stop reading. */
    scDate();
  }



  /* ═══════════════════════════════════════════════════════════
     THE ACCENT

     Thirteen complete palettes came out of this file in one pass, and
     what replaced them is ONE ground and a wheel. Every one of the
     thirteen moved --paper, --ink and both greys together, so each was
     a page to solve and a page to measure — and twelve of them were
     the shipped page with a different hue washed over it. The ground
     is the Lime page's now, always; the only thing you choose is the
     colour on it.

     WHICH MAKES THE HUE THE WHOLE SETTING, and that is the argument
     for a wheel rather than a list. A list of thirteen names is a list
     somebody else wrote, and there was never a reason yours had to be
     on it.

     THE WHEEL PICKS A HUE AND THE APP OWNS THE LIGHTNESS. A free
     colour picker lets you choose #101010 for type on a near-black
     page, and "you chose it" is not an answer to a screen you cannot
     read. So every point on the wheel is SOLVED rather than taken: the
     hue at its fullest — the lightness at which sRGB holds the most of
     that colour — lifted until it clears 6:1 on this ground. 4.5 is
     the bar and this repo has now twice shipped 4.74 believing that
     was a margin; 6 is a margin. Measured at every one of the 360
     degrees, the worst point on the wheel is exactly 6.00:1 and the
     default is 17:1.

     The lightness therefore VARIES round the wheel, and it has to: a
     yellow at a blue's lightness is mud, and a blue at a yellow's is
     white. Holding one lightness for every hue was built and looked
     at — the greens survive it and everything from cyan round to red
     comes out pastel, which is a wheel of one colour and eleven
     tints.
     ═══════════════════════════════════════════════════════════ */

  /* OKLCH is the whole reason this can be one rule instead of thirteen
     hand-mixed sets: it is the one space where holding a number fixed
     and turning the hue gives colours that look like each other. The
     arithmetic is Björn Ottosson's, written out rather than fetched —
     the apps have no dependencies and this is twenty lines. */
  function scOkRGB(L, C, h) {
    var t = h * Math.PI / 180, a = C * Math.cos(t), b = C * Math.sin(t);
    var l = L + 0.3963377774 * a + 0.2158037573 * b;
    var m = L - 0.1055613458 * a - 0.0638541728 * b;
    var s = L - 0.0894841775 * a - 1.2914855480 * b;
    l = l * l * l; m = m * m * m; s = s * s * s;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  function scEnc(c) {
    c = c < 0 ? 0 : c > 1 ? 1 : c;
    return Math.round(255 * (c <= 0.0031308 ? 12.92 * c
      : 1.055 * Math.pow(c, 1 / 2.4) - 0.055));
  }
  /* The ground, once. Everything on the wheel is measured against this
     and nothing else, which is only true because there is one ground
     now — and is the whole reason the wheel can be SOLVED rather than
     sampled.

     scLum and scRatio are the friends board's, four hundred lines
     down, and this went in with a second pair of its own under the
     same two names. A duplicate declaration does not throw, it
     REPLACES, and the crown that reads them is on a screen you have to
     add somebody to reach: the first symptom would have been a
     friend's colour coming out wrong weeks later. It is the file's
     oldest bug and tests/names.js could not see it, because the whole
     app is inside an IIFE and that check read column zero. */
  var GROUND = [12, 12, 14];
  /* The most chroma sRGB holds at this lightness and hue. Bisection
     rather than the analytic boundary: the boundary is six plane
     intersections and this is four lines that cannot be got wrong. */
  function scOkFit(L, h) {
    var lo = 0, hi = 0.45, i, m, v;
    for (i = 0; i < 22; i++) {
      m = (lo + hi) / 2; v = scOkRGB(L, m, h);
      if (v[0] >= -1e-4 && v[0] <= 1.0001 && v[1] >= -1e-4 && v[1] <= 1.0001
        && v[2] >= -1e-4 && v[2] <= 1.0001) lo = m; else hi = m;
    }
    return lo;
  }

  /* Lime's own chroma, which is the cap. Uncapped, the cyans and
     magentas sit hard on the sRGB boundary with a channel at 0 and
     another at 255, and read as fluorescent beside a default that does
     not. A cap is one number and it is the default's own. */
  var A_C = 0.2073;
  /* 6:1, and the margin is the point — see above. */
  var A_MIN = 6;

  var scHueCache = {};
  /* The hue at its fullest, lifted until it is readable. Two steps,
     and the order matters: the cusp first, because that is the most of
     the colour there is, and the lift second, because a colour that
     cannot be read is not an accent whatever else it is. */
  /* ── LIGHT AND DARK ──
     Craft comes in two faces, so the wheel has two grounds to solve
     against. On the dark one the fullest colour is lifted until it
     clears the floor; on the light one it is LOWERED, because a hue at
     its fullest sits far above the white it has to read on. Same
     search, opposite direction, one cache per ground — a blue solved
     for black is a pale sky on white, and it had to not be shared. */
  var LIGHT_GROUND = [247, 247, 249];
  var scHueCacheL = {};
  function scAccentRGB(h) {
    h = ((Math.round(h) % 360) + 360) % 360;
    var light = scModeLive() === 'light';
    var cache = light ? scHueCacheL : scHueCache;
    if (cache[h]) return cache[h];
    var L = 0.5, best = -1, x, c, v;
    for (x = 0.05; x <= 0.995; x += 0.01) {
      c = scOkFit(x, h);
      if (c > best) { best = c; L = x; }
    }
    var ground = light ? LIGHT_GROUND : GROUND, step = light ? -0.0025 : 0.0025;
    for (x = 0; x < 400; x++) {
      c = Math.min(A_C, scOkFit(L, h));
      v = scOkRGB(L, c, h).map(scEnc);
      if (scRatio(v, ground) >= A_MIN || L >= 0.999 || L <= 0.05) break;
      L += step;
    }
    cache[h] = v;
    return v;
  }
  function scHex(v) {
    return '#' + v.map(function (c) {
      return (c < 16 ? '0' : '') + c.toString(16);
    }).join('');
  }
  function scMixed(v, a) {
    return scHex([Math.round(v[0] * a + 6 * (1 - a)),
                  Math.round(v[1] * a + 6 * (1 - a)),
                  Math.round(v[2] * a + 7 * (1 - a))]);
  }

  /* The ground, spelled out once. It is the Lime palette's, and it is
     also what app.css carries at :root so the first paint is right
     before this file runs — the one thing in this app written down
     twice, and tests/schedule.js holds the two in step. */
  /* Two complete sets, one per face. Both are also written in app.css
     — the dark one on :root for the first paint, the light one under
     [data-mode="light"] — and tests/schedule.js holds each pair in
     step, because the day one of them drifts is the day the page
     flashes the wrong colour for a frame on every open. */
  var DARK_SET = { '--paper': '#0C0C0E', '--ink': '#ffffff',
    '--dim': '#b4b4ba', '--spent': '#8c8c94',
    '--hair': 'rgba(255,255,255,.10)', '--tick-off': '#3A3A42', '--bad': '#ff7a7a',
    '--g0': '#0C0C0E', '--g2': 'transparent', '--g3': 'transparent',
    '--ground': '#0C0C0E',
    '--card': 'rgba(255,255,255,.06)', '--card-edge': 'rgba(255,255,255,.10)',
    '--card-shadow': '0 12px 28px -18px rgba(0,0,0,.9)',
    '--s-m-bg': '#F2B950', '--s-m-fg': '#2A1A00',
    '--s-a-bg': '#5FA8FF', '--s-a-fg': '#061C3A',
    '--s-e-bg': '#B98BFF', '--s-e-fg': '#23084A',
    '--done-bg': 'rgba(255,255,255,.10)' };
  var LIGHT_SET = { '--paper': '#F7F7F9', '--ink': '#1A1A1F',
    '--dim': '#5C5C66', '--spent': '#797984',
    '--hair': 'rgba(0,0,0,.10)', '--tick-off': '#E2E2E7', '--bad': '#C7382F',
    '--g0': '#F7F7F9', '--g2': 'transparent', '--g3': 'transparent',
    '--ground': '#F7F7F9',
    '--card': 'rgba(255,255,255,.92)', '--card-edge': '#ffffff',
    '--card-shadow': '0 10px 26px -16px rgba(15,15,25,.40)',
    '--s-m-bg': '#FFE3B3', '--s-m-fg': '#6A3E00',
    '--s-a-bg': '#CFE6FF', '--s-a-fg': '#0F3E7A',
    '--s-e-bg': '#E6D6FF', '--s-e-fg': '#4A2A8A',
    '--done-bg': 'rgba(60,40,100,.07)' };
  function scAccent(h) {
    var v = scAccentRGB(h);
    var light = scModeLive() === 'light';
    var t = {}, base = light ? LIGHT_SET : DARK_SET;
    for (var k in base) if (base.hasOwnProperty(k)) t[k] = base[k];
    t['--red'] = scHex(v);
    /* The wash IS the accent, at a fifth, on the dark face. The light
       face has its own sky and takes none. */
    /* NO WASH ON EITHER FACE. The ground is flat and neutral, so the
       accent appears where it means something and nowhere else. */
    t['--g1'] = 'transparent';
    /* Ink ON the accent. Dark face: the floor puts every accent at a
       luminance of at least .26, so a near-black clears 6:1 on all of
       them. Light face: the accent was lowered until it clears 6:1 on
       white, which is the same arithmetic saying white reads on it. */
    t['--on-red'] = light ? '#ffffff' : scMixed(v, 0.04);
    return t;
  }

  /* ── THE MODE ──
     Light, dark, or the phone's. Stored as a word under its own key
     and resolved to one of the two faces at paint time; 'auto' follows
     prefers-color-scheme and repaints when that changes. */
  var MODE_KEY = 'sched.mode.v1';
  /* ── LIST OR BOARD, per screen ──
     Two keys, because the week and Showing up are different lists and
     a board for one is not a board for the other. A stored value that
     is not one of the two falls through to the list. */
  var WKV_KEY = 'sched.wkview.v1', TYV_KEY = 'sched.tyview.v1';
  var wkView = 'list', tyView = 'list';
  try {
    wkView = localStorage.getItem(WKV_KEY) === 'board' ? 'board' : 'list';
    tyView = localStorage.getItem(TYV_KEY) === 'board' ? 'board' : 'list';
  } catch (e) {}
  var VIEW_ICON = {
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    board: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="10" rx="1.5"/>'
  };
  function scViews(cur, pick) {
    var v = scEl('div', 'views');
    v.setAttribute('role', 'group');
    v.setAttribute('aria-label', 'View');
    [['list', 'List'], ['board', 'Board']].forEach(function (o) {
      var b = scEl('button', 'vw' + (cur === o[0] ? ' is-on' : ''));
      b.type = 'button';
      b.dataset.view = o[0];
      b.setAttribute('aria-pressed', cur === o[0] ? 'true' : 'false');
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + VIEW_ICON[o[0]] + '</svg>';
      b.appendChild(document.createTextNode(o[1]));
      b.addEventListener('click', function () { if (cur !== o[0]) pick(o[0]); });
      v.appendChild(b);
    });
    return v;
  }
  var mode = 'auto';
  function scModeLive() {
    if (mode === 'light' || mode === 'dark') return mode;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light' : 'dark';
  }
  function scSetMode(m) {
    mode = m === 'light' || m === 'dark' ? m : 'auto';
    try { localStorage.setItem(MODE_KEY, mode); } catch (e) {}
    scPaint(hue, false);
    scRender();
  }
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
        if (mode === 'auto') { scPaint(hue, false); scRender(); }
      });
    } catch (e) {}
  }

  var ACCENT_KEY = 'sched.accent.v1';
  var THEME_KEY = 'sched.theme.v1';
  /* Lime, to the nearest degree. The default is a HUE now rather than
     a set of hexes, so there is one place a colour comes from. */
  var HUE0 = 284;   /* Craft's violet, to the nearest degree */
  var hue = HUE0;

  /* ── THE THIRTEEN NAMES SURVIVE AS THIRTEEN ANGLES ──
     A palette is a choice somebody made, and the half of it this app
     still has is the hue. Dropping everyone onto lime because the
     ground changed would throw that away for nothing; read once and
     the old key is spent, because a name that resolves to a number is
     not something to keep resolving. Same shape as Easy → Light: the
     word moved and the record did not. */
  var WAS = { lime: 124, nebula: 304, ember: 42, aurora: 164, solar: 75,
    ice: 230, plum: 359, crimson: 24, cobalt: 264, sepia: 68,
    fuchsia: 340, verdant: 93, iris: 285,
    /* The seven light ones went a year before the wheel did. Their
       accents were the same hues under different grounds. */
    paper: 124, blush: 340, slate: 230, linen: 42, mist: 230,
    bloom: 304, sand: 68 };

  function scHueOf(v) {
    v = Math.round(+v);
    return v >= 0 && v < 360 ? v : HUE0;
  }

  /* Written as inline custom properties on the root, which is the one
     place that beats the stylesheet's :root without !important and
     without a second copy of every rule. Nothing else in the app knows
     an accent setting exists — every colour it draws already came from
     a token, which is what an earlier pass was for. */
  var TOKENS = ['--paper', '--ink', '--dim', '--spent', '--red', '--hair',
                '--tick-off', '--on-red', '--bad',
                '--g0', '--g1', '--g2', '--g3',
                '--ground', '--card', '--card-edge', '--card-shadow',
                '--s-m-bg', '--s-m-fg', '--s-a-bg', '--s-a-fg', '--s-e-bg', '--s-e-fg',
                '--done-bg'];

  function scPaint(h, save) {
    hue = scHueOf(h);
    var t = scAccent(hue);
    var r = document.documentElement.style;
    /* Cleared before the new set is written. A token one set names and
       another does not would otherwise be inherited from whatever was
       up last — the symptom is a colour that only appears in one order
       of presses, which is close to impossible to find by looking. It
       matters less now that one function writes every token, and it
       stays because that is a fact about today's function rather than
       about the mechanism. */
    TOKENS.forEach(function (k) { r.removeProperty(k); });
    for (var k in t) if (t.hasOwnProperty(k)) r.setProperty(k, t[k]);
    document.documentElement.dataset.mode = scModeLive();

    /* The browser's own chrome — the status bar, the URL bar, the
       overscroll gutter — takes its colour from these two and nothing
       else. Left on white the page would end in a bright band the
       design never asked for. */
    var cs = document.querySelector('meta[name="color-scheme"]');
    if (cs) cs.setAttribute('content', scModeLive());
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', t['--g0']);

    /* The ring draws itself in SVG, and SVG takes a literal — so it has
       to be told to read the tokens again. The rail is pure CSS and has
       already changed by the time this line runs. */
    if (typeof scPaintTabFace === 'function') scPaintTabFace();
    if (save) { try { localStorage.setItem(ACCENT_KEY, String(hue)); } catch (e) {} }
    /* Your face and your crown are drawn on your friends' screens out
       of the two hexes in your record, so an accent they never see
       still has to reach them. Debounced with everything else — the
       wheel stays open while you drag through the whole circle, and a
       drag must not be three hundred writes. */
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
  var OFF_KEY = 'sched.off.v1';

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
    w: '<path d="M12 3.4c0 0 5.6 6.1 5.6 9.6a5.6 5.6 0 01-11.2 0C6.4 9.5 12 3.4 12 3.4z"/>',
    /* The crescent the Down block already wears, and the same drawing
       on purpose: the block is when you go to bed and this is how long
       you were there, so two glyphs for one subject would be the app
       telling apart two things that are not. */
    s: BLOCK_ICON.sleep
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
    { id: 'w', n: 'Water', s: 'Log what you drank',    k: 'num', unit: ' L', dp: 1 },
    /* ── THE SIXTH, AND THE ONE YOU DID NOT DO ──
       Every other item here is something you went and did; this is what
       happened while you were not deciding anything, and it is the
       number that explains the other five.

       Not `neu`. Fuel is the one figure on this screen where more is
       not better; a long night is a good night. Six rows fit a 390x844
       phone with 37px to spare, measured before it was written. */
    { id: 's', n: 'Sleep', s: 'Hours last night',      k: 'num', unit: ' h', dp: 1 }
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
  var offLog = null;    /* the same shape, and the opposite claim */

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

  /* ── THE SAME QUESTION, ABLE TO SAY NO ──
     scDateOfDow falls back to TODAY for a weekday outside the window,
     and the comment above it says that is safe because scTallyOpen
     refuses it on the way in. scTallyOpen(today) is true, so it never
     did: "Done today" drew on all seven cards, and pressing it on
     Friday's card from a Tuesday marked TODAY done — for Friday's
     block, which then rendered back through the same fallback and
     looked entirely correct. A round trip through one wrong answer is
     self-consistent, which is why nothing showed.

     Rendering keeps the fallback: a block's id is per weekday, so a
     card reading today's log finds nothing of its own in it. Writing
     has to be able to refuse. */
  function scDowDate(dow) {
    for (var i = 0; i <= BACKFILL; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === dow) return scDay(d);
    }
    return null;
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
    offLog = read(OFF_KEY);
    /* Pruned to the window anything draws it in, and FORWARD without
       limit: a day off is the one record here you write before it
       happens, so a cutoff on both sides would quietly drop the
       holiday you booked in June. */
    var floor = scDayBack(HIST);
    Object.keys(offLog).forEach(function (k) {
      if (k < floor) delete offLog[k];
    });
  }
  function scTickSave() {
    try {
      localStorage.setItem(TICK_KEY, JSON.stringify(tickLog));
      localStorage.setItem(LOG_KEY, JSON.stringify(blockLog));
      localStorage.setItem(OFF_KEY, JSON.stringify(offLog));
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════
     A DAY OFF

     The week is a template and that is what makes it a shape — every
     Monday the same. What it could not say is that THIS Monday is not:
     a holiday, a shift swapped, an injury. The only tool was deleting
     the block, which changes every Monday there will ever be.

     A block off on one date. Not a second schedule and not a range —
     one fact about one day, the same grain as a tick, which is why it
     is keyed and written exactly like blockLog.

     AND IT IS WRITTEN FORWARD. Every other record here is something
     that happened; this is the one you set before the day. So it takes
     the backfill window behind (correcting the last two days) and no
     limit at all ahead — but never further back than that, because a
     day off skips a day in the streak, and a record you can edit six
     months later is a leaderboard nobody can trust.
     ══════════════════════════════════════════════════════════ */
  function scOff(day, id) {
    var d = offLog[day];
    return !!(d && d[id]);
  }
  function scOffOpen(day) { return scTallyOpen(day) || day > scDay(); }

  function scSetOff(day, block, dow, val) {
    if (!scOffOpen(day)) return false;
    if (!offLog[day]) offLog[day] = {};
    if (val) offLog[day][block.id] = 1; else delete offLog[day][block.id];
    if (!Object.keys(offLog[day]).length) delete offLog[day];
    /* Done and off are opposite claims about the same block on the same
       day, so setting one clears the other. Both standing would leave a
       row that is struck out and ticked, and a record that says the
       block both happened and was not on. */
    if (val) scSetBlockDone(day, block, dow, false);
    scTickSave();
    return true;
  }

  /* ── A DAY IT WAS NEVER ON IS NOT A DAY YOU MISSED IT ──
     The strip read tickLog and nothing else, so a Train row on a
     schedule that trains three days a week drew four misses every week
     for ever — and a record that counts days you were never going to
     train is not a record of showing up, it is a picture of the number
     four.

     Only the two items FED BY BLOCKS can fail to apply. Steps, Fuel and
     Water are numbers you log, and nothing about the week excuses one.

     Judged against TODAY'S schedule for every day in the window,
     because the week is a template and this app keeps no history of it.
     The alternative is storing a copy of the shape every time it
     changes, which is a second record of the thing the first record IS
     — and it would be wrong in the other direction the moment anybody
     restored a backup. */
  function scApplied(item, day) {
    if (!item || !item.from) return true;
    var bs = scBlocksFor(item, new Date(day + 'T12:00:00').getDay());
    if (!bs.length) return false;
    return bs.some(function (b) { return !scOff(day, b.id); });
  }

  /* ── IS THE DAY DONE? ──
     Every block the day actually asked of you, ticked. A block marked
     OFF is not one of them — that is the whole point of a day off, and
     counting it would make an exception you granted yourself into a
     thing you failed to do.

     A day with nothing on it is NOT done, and that is deliberate
     rather than an oversight: "all of them" over an empty list is
     vacuously true, so an empty Tuesday would call itself finished at
     one minute past midnight. There has to be something to have
     finished. */
  function scDayDone(day, dow) {
    var mine = scByDay(dow).filter(function (b) { return !scOff(day, b.id); });
    if (!mine.length) return false;
    return mine.every(function (b) {
      return !!(blockLog[day] && blockLog[day][b.id]);
    });
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
    $('scTallyCap').textContent = n + ' of ' + TALLY.length + ' today \u00b7 '
      + st + (st === 1 ? ' day streak' : ' day streak');
    var grid = $('scTallyGrid');
    grid.textContent = '';
    var old = $('scTallyCap').nextElementSibling;
    if (old && old.classList.contains('views')) old.remove();
    $('scTallyCap').insertAdjacentElement('afterend', scViews(tyView, function (v) {
      tyView = v;
      try { localStorage.setItem(TYV_KEY, v); } catch (e) {}
      scPaintTally();
    }));
    grid.classList.toggle('is-board', tyView === 'board');
    /* The list is one column headed Today; the board is two, kept and
       still to do, and a row moves between them when it is pressed. */
    var cols = {};
    var col = function (key, word, live) {
      if (cols[key]) return cols[key];
      var c = scEl('div', 'wk-sess');
      var gh = scEl('div', 'grp-h');
      gh.appendChild(scEl('span', 'pill' + (live ? ' is-now' : ''), word));
      var cnt = scEl('span', 'c', '0');
      gh.appendChild(cnt);
      c.appendChild(gh);
      cols[key] = { el: c, cnt: cnt, n: 0 };
      grid.appendChild(c);
      return cols[key];
    };
    if (tyView === 'board') { col('on', 'Kept today', true); col('off', 'Still to do'); }
    else col('all', 'Today');
    TALLY.forEach(function (it, i) {
      var on = !!got[it.id], late = !on && scLate(it);
      var row = scEl('div', 'ty-row' + (on ? ' is-on' : '') + (late ? ' late' : ''));
      /* ── THE CHECK, then the card, then the record ──
         Three press targets and all three are siblings: a button
         inside a button is invalid and collapses to one press while
         looking exactly right. The check and the card log; the strip
         opens the history. */
      var chk = scEl('button', 'chk');
      chk.type = 'button';
      chk.setAttribute('aria-label', (on ? 'Unlog ' : 'Log ') + it.n);
      chk.setAttribute('aria-pressed', on ? 'true' : 'false');
      chk.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12.8l5.2 5.2L19.5 6"/></svg>';
      chk.addEventListener('click', function () { scTallyTap(it, day); });
      row.appendChild(chk);
      var c = scEl('button', 'ty-card');
      c.type = 'button';
      c.dataset.item = it.id;
      c.insertAdjacentHTML('beforeend',
        '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'
        + TALLY_ICON[it.id] + '</svg>');
      var body = scEl('span', 'ty-body');
      c.appendChild(body);
      body.appendChild(scEl('span', 'ty-nm', it.n));
      var via = null;
      if (on && it.from) {
        var b = scBlocksFor(it, new Date().getDay()).filter(function (x) {
          return blockLog[day] && blockLog[day][x.id];
        })[0];
        if (b) via = 'from ' + b.n;
      }
      var props = scEl('span', 'props');
      var word = it.k === 'num' && on ? String(got[it.id]) + (it.unit || '')
          : (via || (on ? 'logged' : (late ? 'missed' : 'not yet')));
      props.appendChild(scEl('span', 'pill' + (late ? ' is-late' : ''), word));
      /* Days on now, for a TICK and only a tick — a run on a number
         counts the days you remembered to type one in, which is a fact
         about your logging. Drawn from two, because "1 day" under a
         thing you just did is the check saying it twice. */
      if (it.k === 'do') {
        var run = 0, hist = scHist(it.id);
        for (var j = hist.length - 1; j >= 0; j--) {
          if (hist[j].on) run++;
          else if (hist[j].off) continue;
          else break;
        }
        if (run >= 2) props.appendChild(scEl('span', 'pill' + (run >= 7 ? ' is-run' : ''), run + ' days'));
      }
      body.appendChild(props);
      c.setAttribute('aria-label', it.n + ', ' + (on ? 'logged' : 'not yet')
        + (on && it.k === 'num' ? ', ' + got[it.id] + (it.unit || '') : '')
        + (late ? ', missed its window' : '') + '. ' + it.s + '.');
      c.addEventListener('click', function () { scTallyTap(it, day); });
      row.appendChild(c);
      var hist2 = scEl('button', 'ty-hist');
      hist2.type = 'button';
      hist2.innerHTML = scStripSvg(scHist(it.id));
      hist2.setAttribute('aria-label', it.n + ', open 26 weeks of history');
      hist2.addEventListener('click', function () { scOpenHist(it); });
      row.appendChild(hist2);
      var into = tyView === 'board' ? col(on ? 'on' : 'off') : col('all');
      into.el.appendChild(row);
      into.cnt.textContent = String(++into.n);
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
    var item = TALLY.filter(function (x) { return x.id === id; })[0];
    var out = [], d = new Date();
    d.setDate(d.getDate() - (HIST - 1));
    for (var i = 0; i < HIST; i++) {
      var day = scDay(d), rec = tickLog[day], v = rec && rec[id];
      /* A tick always wins. Train on a Sunday it is not scheduled is
         still a day you trained, and drawing it as "did not apply"
         would throw away the one thing the record is for. */
      out.push({ on: !!v, off: !v && !scApplied(item, day),
                 raw: parseFloat(v) || 0, dow: d.getDay() });
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

  /* ── THREE STATES, AND THE THIRD IS A SIZE ──
     Kept is the accent, missed is the flat neutral, and a day the thing
     was never on is the SAME neutral drawn small. Colour is not
     available for it: the rule on this screen is that a colour never
     says whether, and a third hue would be inventing a judgement for
     the one state that is not one. Size costs no contrast at all and
     reads instantly — a dot beside a square.

     Drawn rather than left out. A hole keeps the grid's geometry but
     scatters gaps through it that read as a rendering fault, and this
     record's whole job is that the days it does not light are still
     visible. */
  var OFF_W = .45;

  function scStripSvg(days) {
    var cell = 3.6, g = scCalGeom(days, cell, 1.1), out = '';
    days.forEach(function (d, i) {
      out += scCalRect(g, i, cell, d.off ? cell * OFF_W : cell,
        d.on ? 'var(--red)' : 'var(--tick-off)');
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

     IT IS A LITERAL GLOW NOW, because the marks are the ACCENT. This
     drew them in --ink for its whole life and the write-up said, in as
     many words, that the only literal glow available was to paint them
     in the accent — and that doing so would cost the rule that one
     mark means one thing at all three sizes it is drawn. It costs
     nothing of the sort: all three sizes moved together, so the ring,
     the strip and the calendar still say the same thing in the same
     colour. What was really being protected was the light polarity,
     where --ink is near-black and the blurred copy is a contact
     shadow rather than a bloom. Every palette is dark, the ground
     cannot change any more, and the accent is solved to sit at a
     luminance of at least .26 on it — so the emissive reading is the
     only one there is and the copy is genuinely light.

     A day you kept is the same claim as a block that is running: this
     happened. It is the same accent for the same reason.

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
      if (!d.on) {
        off += scCalRect(g, i, cell, d.off ? cell * OFF_W : cell,
          'var(--tick-off)');
        return;
      }
      GLOW.forEach(function (L, n) {
        lay[n] += scCalRect(g, i, cell, cell * L.grow, 'var(--red)');
      });
      lit += scCalRect(g, i, cell, cell, 'var(--red)');
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
     daily. A number has no shape and it has a SPREAD, so its three are
     the middle, the top and the bottom of one distribution. */
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
    peak: '<path d="M2.6 19.4l6.6-9.4 4 4.6 3.6-6 4.6 10.8z"/>',
    /* The peak mirrored, which is the one case this file's rule about
       two glyphs sharing a silhouette does not apply to: these two sit
       side by side and are the top and the bottom of the same figure,
       so reading as a pair is the point rather than a collision. */
    low: '<path d="M2.6 4.6l6.6 9.4 4-4.6 3.6 6 4.6-10.8z"/>'
  };

  /* ── A DAY THAT DID NOT APPLY IS SKIPPED, NOT COUNTED EITHER WAY ──
     It neither breaks a streak nor extends one, and it is out of the
     denominator. Counting it as a miss was the old behaviour and it
     made every figure here a report on the schedule rather than on
     you: three sessions a week read as 3.0 days a week out of seven
     and a longest streak that could never pass three. */
  function scHistStats(item, d) {
    var kept = d.filter(function (x) { return x.on; });
    var live = d.filter(function (x) { return !x.off; });

    /* ── A STREAK IS A TICK'S FIGURE, AND ONLY A TICK'S ──
       It sat on the numbers too, and on a number it counts the days
       you RECORDED one rather than anything about the number: for
       Sleep, the longest run of nights you remembered to type a figure
       in. That is a fact about your logging, not about your sleep —
       and the foot of this same panel already says it better, as "121
       of 182 days". Two statements of one thing, neither of them about
       the quantity the panel is for. */
    if (item.k === 'do') {
      var best = 0, run = 0, now = 0, i;
      for (i = 0; i < d.length; i++) {
        if (d[i].off) continue;
        run = d[i].on ? run + 1 : 0;
        if (run > best) best = run;
      }
      for (i = d.length - 1; i >= 0; i--) {
        if (d[i].off) continue;
        if (!d[i].on) break;
        now++;
      }
      return { kept: kept.length, live: live.length, rows: [
        { v: String(best), cap: 'longest streak', ic: 'streak' },
        { v: String(now), cap: now === 1 ? 'day on now' : 'days on now', ic: 'now' },
        /* Out of the days it was ON, not out of seven. */
        { v: (live.length ? kept.length / (live.length / 7) : 0).toFixed(1),
          cap: 'days a week', ic: 'week' }
      ] };
    }
    var dp = item.dp || 0;
    var fmt = function (v) {
      return v.toLocaleString('en-GB',
        { minimumFractionDigits: dp, maximumFractionDigits: dp });
    };
    /* ── THE THREE ARE ONE DISTRIBUTION: THE MIDDLE, THE TOP AND THE
           BOTTOM ──
       Which is the same argument the ticks' three make — theirs are
       three readings of a SHAPE over time, and a number has no shape,
       it has a spread. Over the days it was logged, never over the
       days it was not: a night you did not record is not a night of
       no sleep, and averaging one in would make every figure here a
       report on how often you open the app.

       AND THE BOTTOM IS NOT CALLED YOUR WORST. The top says "your
       highest" rather than "your best" on Fuel, because more is not
       better there; the bottom is named neutrally on ALL of them, for
       the reason this screen never colours anything to say you failed.
       Your shortest night is the half of the range that a highest on
       its own hides, and on Sleep it is the more useful half. */
    var sum = 0, top = 0, bot = 0;
    kept.forEach(function (x, n) {
      sum += x.raw;
      if (x.raw > top) top = x.raw;
      if (!n || x.raw < bot) bot = x.raw;
    });
    var unit = (item.unit || '').trim();
    return { kept: kept.length, live: live.length, unit: unit, rows: [
      { v: fmt(kept.length ? sum / kept.length : 0), cap: 'average a day',
        ic: 'avg', unit: 1 },
      { v: fmt(top), cap: item.neu ? 'your highest' : 'your best',
        ic: 'peak', unit: 1 },
      { v: fmt(bot), cap: 'your lowest', ic: 'low', unit: 1 }
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
    /* Out of the days it was ON. "121 of 182" on a three-day-a-week
       session is a fraction of a number nobody was ever aiming at. */
    p.appendChild(scEl('p', 'ty-hint',
      st.kept + ' of ' + st.live + ' days · tap anywhere to close'));

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
      var on = !scTicked(day, item.id);
      /* The return, not the intent: scSetTick refuses a day that has
         shut, and without this a refused tick still opened the deck —
         a question about a session the app had just declined to record. */
      if (!scSetTick(day, item.id, on ? 1 : 0)) return;
      /* Unticking Train takes the workout off the block it was on, the
         same as unticking the block itself: a record about a session
         must not outlive the session being marked done. */
      var fed = item.from ? scBlocksFor(item, new Date(day + 'T12:00:00').getDay()) : [];
      if (!on) fed.forEach(function (b) { scTrainSet(day, b.id, ''); });
      scPaintTally();
      if (view === 'list') scRender();
      /* ── the deck's third door, and the most literal one ──
         "Press Train and it asks what you trained" is the whole
         feature said in one sentence, and this card is where somebody
         actually presses Train.

         ONE BLOCK ONLY. This tick marks every block of that name on
         the day, so a week with two sessions on a Tuesday has two
         records and no way to say which card the answer is about —
         and asking twice in a row for one press is worse than not
         asking. Two sessions are picked from their own rows, where
         the question has an answer. */
      var only = fed.filter(scIsTrain);
      if (on && only.length === 1) scTrainAsk(only[0], only[0].d, day);
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
     week or the tally calls it — the first request of any
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
    /* EMPTY, never 'You'. It defaulted to 'You' and pushed it, so
       every person who had not set a name was literally CALLED "You"
       on the server — add one and the board reads "You" twice, which
       is what this cost. "You" is a label for your own row and is
       decided when the row is drawn; it is not a name and must not
       leave the browser. */
    net.name = String(name || '').trim().slice(0, 24);
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
  /* ── what a day of yours looks like to a friend ──
     TWO COUNTS AND NOTHING ELSE: how many of the five you ticked, and
     how many of your blocks you kept. Never which five and never which
     blocks — a count says you showed up, a list says what your day is,
     and the second is the thing this app exists not to send. The
     schedule itself has never left and does not now.

     `b` is the addition. Before it a friend could see you ticked three
     of the five and had no way to know whether you trained. */
  function scMyDays() {
    var days = {};
    for (var i = 0; i < 30; i++) {
      var d = scDayBack(i);
      var t = tickLog[d] ? Object.keys(tickLog[d]).length : 0;
      var b = blockLog[d] ? Object.keys(blockLog[d]).length : 0;
      if (t || b) days[d] = { t: t, b: b };
    }
    return days;
  }

  /* A day out of anybody's record, old shape or new. Every record
     written before blocks were sent carries a bare NUMBER — the tally
     count on its own — and those records are on the server right now
     with up to thirty days left to live. Reading one as an object
     gives NaN in every figure it feeds, so the shape is normalised on
     the way in rather than migrated on the way out: there is nothing
     here to migrate, because the writer is the phone that owns it and
     it will overwrite itself on the next push. */
  function scDayOf(v) {
    if (typeof v === 'number') return { t: v, b: 0 };
    return { t: (v && +v.t) || 0, b: (v && +v.b) || 0 };
  }

  /* Ticks over a rolling window, never all-time — all-time means
     whoever started first wins permanently and nobody new can catch
     up. */
  function scCount(days, n) {
    var t = 0;
    for (var i = 0; i < n; i++) t += scDayOf(days && days[scDayBack(i)]).t;
    return t;
  }

  function scBlocksIn(days, n) {
    var t = 0;
    for (var i = 0; i < n; i++) t += scDayOf(days && days[scDayBack(i)]).b;
    return t;
  }

  /* Days you logged ANYTHING, running back from today. Today not being
     logged yet does not break it — at nine in the morning it has not
     failed, it has not happened, and a streak that resets every
     midnight is a streak nobody keeps. */
  function scRunOf(days) {
    var n = 0;
    for (var i = 0; i < 3650; i++) {
      /* A day you did ANYTHING — a tick or a block. It counted ticks
         alone, which was the only thing recorded; a day you kept every
         block and touched none of the five was a day off. */
      var v = scDayOf(days && days[scDayBack(i)]);
      if (v.t || v.b) n++;
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
    /* THE CROWN SITS ON A CARD, NOT ON THE PAGE. The row is a wash of
       white over the ground now, and a crown solved against --g0
       measured 2.82:1 on the row it is actually drawn on. The card's
       own alpha is composited over the ground here, so the arithmetic
       knows about the surface it is being read off. */
    var cm = String(cs.getPropertyValue('--card')).match(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\)/);
    if (cm) {
      var ca = cm[4] === undefined ? 1 : +cm[4];
      ground = ground.map(function (g, i) { return Math.round(g + (+cm[i + 1] - g) * ca); });
    }
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
  /* A name a peer never chose. 'You' was this app's own default and it
     went to the server, so records out there carry it — and a friend
     called "You" beside your own row called "You" is a board that
     names nobody. It is read as unset and falls through to the code,
     which is unique and is the string you typed to add them. Nobody
     picks "You" as a nickname; the one person it could belong to is
     the one row that is not drawn from this. */
  function scPeerName(n) {
    n = String(n || '').trim();
    return (!n || n.toLowerCase() === 'you') ? '' : n;
  }

  function scFriendsPeers() {
    return friends.map(function (f) {
      var r = peers[f.code] || null;
      return {
        code: f.code,
        name: scPeerName(r && r.name) || scPeerName(f.name) || f.code,
        ticks: r ? scCount(r.days, 30) : 0,
        blocks: r ? scBlocksIn(r.days, 30) : 0,
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
        out.push({ p: p, code: f.code,
                   who: scPeerName(r.name) || scPeerName(f.name) || f.code,
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
      /* EVERY row opens something, including your own — it opens YOU,
         which is where your name is set. It used to be friends only, on
         the rule that a name you can press which opens nothing is worse
         than a name you cannot; your own row was the one that opened
         nothing, and the setting it needed was three taps away behind a
         link called "Your code". A board that says "You" twice is
         somebody who could not find the place to fix it. */
      {
        li.classList.add('is-tap');
        li.setAttribute('role', 'button');
        li.tabIndex = 0;
        var open = p.me ? scNetSheet : function () { scFriendSheet(p); };
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
      /* ── A PROFILE FIRST, AND IT IS THE ONLY THING OFFERED ──
         Before a nickname there is nothing to add anybody TO: your row
         says "You", which is a label rather than a name, and a friend
         who adds you back sees a code. Offering both was offering a
         choice that has one right answer, so Add a friend is not drawn
         at all until there is a profile to add them to — and it stops
         being offered the moment it is done, because a permanent
         "create a profile" on a screen where you already have one is a
         task you can never finish.

         The line under it says WHY the other action is missing rather
         than describing the field the sheet is about to show. Three
         sentences of explanation under two actions is a screen that
         reads as instructions for itself. */
      if (!net.name) {
        add.appendChild(scLink('Create a profile', scNameSheet));
        add.appendChild(scEl('p', 'fr-note', 'Create a profile to add a friend.'));
      } else {
        add.appendChild(scLink('Add a friend', scAddSheet));
      }
      /* ── AND THE PROMISE STAYS ──
         It used to be on the turn-on sheet, on the argument that a
         paragraph you press through is a decision and one you merely
         arrive at is a disclaimer. With that sheet gone the argument
         inverts and it lives here, where nobody presses past it. It is
         one line rather than two now — what leaves, and how to stop it
         — but it is not a description of a control and it does not go
         with them. */
      add.appendChild(scEl('p', 'fr-note',
        'Your ticks and logs are on the server. Remove yourself in Settings.'));
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
    [].forEach.call(document.querySelectorAll('[data-stop]'), function (t) {
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

  function scPost(it, bare) {
    var p = it.p;
    var card = scEl('article', 'po' + (bare ? ' is-bare' : ''));
    var head = scEl('div', 'po-h');
    head.appendChild(scPicOf(26, it));
    var who = scEl('span');
    who.appendChild(scEl('span', 'po-n', it.who));
    var it2 = TALLY.filter(function (x) { return x.id === p.item; })[0];
    who.appendChild(scEl('span', 'po-s',
      (it2 ? it2.n + ' · ' : '') + scAgo(p.at)));
    head.appendChild(who);
    /* ── ONLY ON YOURS ──
       There is nothing to press on somebody else's, so nothing is
       drawn on it: a control that exists and refuses is worse than one
       that is not there. */
    if (it.me) {
      var rm = scEl('button', 'po-x');
      rm.setAttribute('aria-label', 'Delete this log');
      rm.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">'
        + '<path d="M6 6l12 12M18 6L6 18"/></svg>';
      rm.addEventListener('click', function () { scPostGone(p); });
      head.appendChild(rm);
    }
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

  /* ── one post, on its own ──
     Opened from a tile on somebody's profile. The sheet is one at a
     time in this app, so it REPLACES the profile — which is why it
     carries the way back: without it, closing lands you on the board
     and the profile you were reading is two presses away again. */
  function scPostSheet(it, back) {
    scSheet(it.who, function (body) {
      body.appendChild(scPost(it, true));
      if (back) {
        body.appendChild(scEl('div', 'menu-rule'));
        var b = scEl('button', 'menu-item');
        b.appendChild(document.createTextNode('Back to ' + it.who));
        b.addEventListener('click', back);
        body.appendChild(b);
      }
    });
  }

  /* ── deleting one, and it ASKS ──
     This app's rule is that nothing deletes without a way back, and
     the one exception written down is the reminders — because a bin
     protects a record you cannot rebuild and a reminder you have dealt
     with is not a record of anything. A log is the other way round: it
     is a photograph and a line about a day, and the photograph is the
     part you cannot get back. There is no bin on this screen to put it
     in, so the ask is what stands in for one.

     The push is the whole record, so removing it here removes it from
     the server and out of every friend's feed on their next fetch.

     Nothing sweeps the picture and nothing needs to: the worker puts
     every image under a TTL two days past its own window, so a blob
     nothing points at expires by itself. The local data URL is inside
     the post and goes when the post does. */
  function scPostGone(p) {
    scSheet('Delete this log?', function (body) {
      body.appendChild(scEl('p', 'hint', p.img
        ? 'It goes from here and from your friends’ feeds, and the '
          + 'photograph with it. There is no bin for logs.'
        : 'It goes from here and from your friends’ feeds. There is no '
          + 'bin for logs.'));
      var go = scBtn('go', 'Delete it', function () {
        posts = posts.filter(function (q) { return q.id !== p.id; });
        scWriteJSON(POST_KEY, posts);
        scPushNow();
        scClose();
        scPaintFriends();
        scToast('Deleted', false);
      });
      var row = scEl('div', 'lg-row');
      row.appendChild(scBtn('', 'Keep it', scClose));
      row.appendChild(go);
      body.appendChild(row);
    });
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

  /* ── your name, and it is the whole profile ──
     One place, because there are two ways in: this settings sheet, and
     the board itself before you have set one. Two copies of a field
     that writes the same key is two places for it to drift. */
  function scNameSheet() {
    scTextSheet('Your name', 'Name', net.name, function (v) {
      net.name = (v || '').slice(0, 24);
      scNetSave();
      scPushNow();
      scPaintFriends();
    });
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
          'What goes: your name, your accent and your ink, your picture, how many '
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
      nm.addEventListener('click', scNameSheet);
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

      /* THIRTY, not seven. The record already holds thirty days and
         the two figures above are both about thirty, so a seven-day
         strip under them was answering a question nobody had asked and
         hiding three quarters of what is there.

         Two things had to change with the count, and both are the same
         arithmetic. The day letters went, because at thirty across a
         phone each cell is nine pixels and two characters do not go in
         nine — and they were telling a Tuesday from a Thursday, which
         is a question about a WEEK. And the mark went from a disc back
         to a BAR: a disc's diameter is bounded by the cell's width, so
         at thirty the smallest one is about four pixels and
         antialiasing alone took it to 1.18:1 on the white page. The
         suite caught that, not the eye.

         A bar's height is free of the count, so it holds its colour at
         any width — and the note that says a chart of seven numbers
         between 0 and 5 is more apparatus than the numbers deserve was
         written about SEVEN. Thirty days of them is a shape, and a
         shape is the thing you came to read. */
      /* ── THE STRIP IS THE BLOCKS ──
         It was the tally's five, which is what the record used to
         carry — and the two figures above are already about those
         five. The question you open somebody's profile with is
         whether they are doing the thing, and the thing is the
         blocks. The count rides the heading rather than taking a
         third figure: three at 26px do not go across a phone, and
         this one is about the picture under it. */
      var kh = scEl('div', 'fp-kh');
      kh.appendChild(scEl('span', 'label fp-k', 'Blocks kept'));
      kh.appendChild(scEl('em', null, String(p.blocks || 0)));
      body.appendChild(kh);
      var strip = scEl('div', 'fp-week is-month');
      var top = 0;
      for (var k = 0; k < 30; k++) {
        top = Math.max(top, scDayOf(r.days && r.days[scDayBack(k)]).b);
      }
      for (var i = 29; i >= 0; i--) {
        var day = scDayBack(i);
        var n = scDayOf(r.days && r.days[day]).b;
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
        /* A floor rather than a share: a day with nothing still has to
           be a mark, because a gap in the strip would be a day that is
           not there rather than a day with none on it. */
        /* Scaled against the busiest day in the window rather than a
           constant: five was the tally's ceiling and a day has as many
           blocks as it has. A floor, so a day with none is still a
           mark — a gap would be a day that is not there. */
        bar.style.height = (n ? 26 + (n / Math.max(1, top)) * 74 : 16) + '%';
        var hold = scEl('span', 'fp-hold');
        hold.appendChild(bar);
        cell.appendChild(hold);
        /* Two letters, not one. One gives W T F S S M T across a week,
           where two of the T's are different days and so are both S's —
           a strip whose whole job is telling you which day is which. */
        cell.title = day + ' · ' + n + (n === 1 ? ' tick' : ' ticks');
        strip.appendChild(cell);
      }
      body.appendChild(strip);

      /* ── WHAT THEY HAVE POSTED, AS A WALL ──
         It was every log drawn out in full, one under another, which
         made the profile a second feed — and the feed is a stop of its
         own two taps away. A profile wants the SHAPE of what somebody
         has done: a grid you take in at a glance, and one of them
         opens if you want the words.

         A log with no photograph still gets a tile, carrying its own
         first line. Dropping it would make the grid a photo album
         rather than a record of what they did, and the two are
         different claims about somebody. */
      var logs = (Array.isArray(r.logs) ? r.logs : []).slice().reverse();
      var lh = scEl('div', 'fp-kh');
      lh.appendChild(scEl('span', 'label fp-k', logs.length ? 'What they have posted' : 'Nothing posted yet'));
      if (logs.length) lh.appendChild(scEl('em', null, String(logs.length)));
      body.appendChild(lh);
      if (logs.length) {
        var grid = scEl('div', 'fp-grid');
        logs.slice(0, 24).forEach(function (q) {
          var t = scEl('button', 'fp-t' + (q.img ? '' : ' is-words'));
          t.setAttribute('aria-label', (q.cap || 'A log') + ', ' + scAgo(q.at)
            + '. Open it.');
          if (q.img) {
            var im = document.createElement('img');
            im.src = scImgURL(q.img);
            im.alt = '';
            im.loading = 'lazy';
            t.appendChild(im);
          } else {
            t.appendChild(scEl('span', null, q.cap || ''));
          }
          t.addEventListener('click', function () {
            scPostSheet({ p: q, who: p.name, acc: p.acc, ink: p.ink, pic: p.pic },
              function () { scFriendSheet(p); });
          });
          grid.appendChild(t);
        });
        body.appendChild(grid);
      }

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
  /* THREE, and the ring was the fourth. It drew today as a dial with
     the running span lit — a second answer to the question the week's
     own card already answers, on a screen you had to leave the week to
     see. What it added over the span in the head was the shape of one
     block, and the head now draws the shape of the whole day. A stored
     'ring' falls through to the list below, so nobody is stranded on a
     view that no longer exists. */
  var VIEWS = ['list', 'tally', 'friends'];

  function scSetView(v, save) {
    view = VIEWS.indexOf(v) >= 0 ? v : 'list';
    var tal = view === 'tally', fr = view === 'friends';

    /* The history sits OUTSIDE the tally section, so hiding the section
       would leave it up over whatever you switched to. */
    scCloseHist();

    $('scTally').hidden = !tal;
    $('scFriends').hidden = !fr;
    /* ONE SECTION PER VIEW, and `[hidden]` has to be said out loud
       once a thing takes a display — .week is a flex column, and an
       author display outranks the browser's own [hidden] rule. That
       has cost this app the rail, the dots, the toast and the intro,
       each in turn, so the check measures the BOX rather than the
       attribute. */
    $('scWeek').hidden = tal || fr;
    $('scEmpty').hidden = tal || fr || state.items.length > 0;
    /* The head is the day's on the week and the screen's elsewhere,
       and the turn control belongs to the week alone. */
    scDate();
    scHeadTurn();

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

    if (tal) { scPaintTally(); scTyStop(tyStop, false); }
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
              ? hits.map(function (h) {
                  return ABBR[h.d] + ' ' + scT(h.s) + scMerIf(h.s); }).join('  ·  ')
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
     THE WORKOUT DECK

     Finish a training block and it asks what you trained. Five cards
     dealt into a stack, one at the front and the two behind it
     peeking out at the corner.

     IT HANGS OFF THE TICK, NOT OFF THE TAP. Tap edits — that is a
     written rule and the week is where you change the schedule — so
     the moment to ask is the moment you mark the session done, which
     is the one press that already means "that happened". A workout
     nobody trained is not a record worth keeping.

     AND IT IS REACHABLE WITHOUT THE LONG PRESS. The row's press
     reaches neither a keyboard nor a screen reader, exactly as the
     tick does not, so the editor carries the same control — the
     shortcut lives on the row, the feature lives in the sheet.

     IT NEVER LEAVES THE BROWSER. The friends half pushes a COUNT of
     the blocks you finished, which is what somebody else needs to
     know whether you showed up. Which split you ran is a different
     question and nobody asked it: scPush is not called from here and
     the key is not in the pushed record.
     ═══════════════════════════════════════════════════════════ */

  /* ── ONE GLYPH, NOT FIVE ──
     Five drawings were made and every one of them was a different
     class of object — a barbell with an arrow, a figure on a rail, a
     squat, a torso, a shoe — which is the right rule when the glyph
     has to say WHICH. Here it does not: the card already says Push in
     34px type with a line under it explaining what that means, so a
     second thing saying the same word in pictures is the sentence and
     the picture this project keeps having to take back out.

     The weight is what all five have in common — it says this card is
     a session — so it is the Train row's own dumbbell, reused
     verbatim. Two dumbbells on one app is the mistake the Steps
     footprint taught.

     ONE PER GROUP, THEREFORE, AND NOT ONE PER WORKOUT: the weight is
     right for all four of a split and wrong on a cold plunge, so Run
     takes the row's shoe and Recovery its stretch. Three glyphs
     answering the only question a picture is left on this card —
     which of the three kinds of session this is. */
  var WORKOUT_ICON = {
    bro: BLOCK_ICON.train,
    ppl: BLOCK_ICON.train,
    run: BLOCK_ICON.run,
    /* ── RECOVERY HAS NONE, DELIBERATELY ──
       It had the row's stretching figure, which is a stick person —
       ruled out for these in capitals two comments up, and drawn at
       40px it is a circle on four sticks rather than a marker. It was
       also simply false on two of the four cards: a figure stretching
       over one whose line reads "Abs, obliques and lower back".

       Nothing honest replaces it. A rolled mat reads as a hook, a
       padlock or a capsule; a circular arrow is a refresh button; a
       foam roller is a battery; a dome is the wake glyph. Recovery is
       four sessions that have nothing in common except when you do
       them, so there is no object that is all four — and an empty slot
       is what this file already concluded about the ten lifts. The
       name is there at 34px with its line under it. */
    rec: ''
  };

  /* ── THE SWOOP ──
     A curve sweeping through the card, behind everything on it. Two
     things were tried here first and both were wrong. Four contour
     waves, stretched to the card's width with the stroke stretched
     with them, drew as black bars lying across it. The card's own
     name, blown up and cropped, was better and still wrong: it says
     in ghost type what the 34px line at the bottom already says at
     full strength, and the eye reads a word whether or not it is
     meant to.

     A curve carries no reading at all. It fills the empty middle, it
     gives the name something to sit on, and there is nothing in it to
     understand — which is the whole job.

     SIX OF THEM, AND WHICH ONE IS DATA. Twenty-two cards is too many
     for one drawing: every card the same is wallpaper, and the deck is
     three cards deep so two of them are always on screen together.
     They are assigned by CHARACTER rather than one each — the heavy
     lifts share the solid band, the runs share the open arcs, and
     recovery gets the quietest of them. Cards that are the same kind
     of session look the same on purpose.

     100x80 AGAINST A CARD THAT IS 354x284, which is the same ratio to
     within half a percent, so `slice` crops almost nothing and every
     curve keeps the shape it was drawn as. The paths run from -6 to
     106 on purpose: a curve that starts inside the card has a visible
     end, and a visible end is a shape sitting on the card rather than
     something the card is a window onto.

     THE STROKES ARE NON-SCALING. It is the waves' lesson kept: a
     stroke width in viewBox units is scaled by whatever the box is
     stretched to, and the failure is silent — the drawing is still
     correct and simply several times too heavy. */
  var SWOOP = {
    /* One band, and the name sits on it. */
    a: '<path class="sw-f" d="M-6 54C20 26 48 66 106 18V86H-6Z"/>',
    /* Two open arcs and nothing filled — the lightest of the six. */
    b: '<path class="sw-l" d="M-6 44C20 16 48 56 106 8"/>'
     + '<path class="sw-l" d="M-6 64C20 36 48 76 106 28"/>',
    /* The band with a hairline running off the top of it. */
    c: '<path class="sw-f" d="M-6 58C20 30 48 70 106 22V86H-6Z"/>'
     + '<path class="sw-l" d="M-6 44C20 16 48 56 106 8"/>',
    /* A crescent off the top-right corner, so the weight is opposite
       the name rather than under it. */
    d: '<path class="sw-f" d="M106 -6C60 -6 22 26 -6 78V-6Z"/>',
    /* Three nested hairlines. */
    e: '<path class="sw-l" d="M-6 40C22 12 50 52 106 4"/>'
     + '<path class="sw-l" d="M-6 56C22 28 50 68 106 20"/>'
     + '<path class="sw-l" d="M-6 72C22 44 50 84 106 36"/>',
    /* One thick tapering sweep, low and to the right. */
    f: '<path class="sw-s" d="M-6 66C24 34 46 74 106 14"/>'
  };

  /* ── AND A GLYPH FOR THE SESSION ITSELF ──
     WORKOUT_ICON above says which of the four KINDS this is and is the
     same on every card in a group. This is the other question — which
     one — and where it has an answer it takes the same 40px slot,
     because two glyphs on one card is the card saying twice over what
     it is and the words are what it is for.

     NOT A FIGURE, ANYWHERE IN HERE. A stick person bent into the shape
     of the muscle it means is the collision this file has run into
     four times: walk, run and stretch were one silhouette in three
     poses at 22px, and a body drawn to mean "arms" beside one drawn to
     mean "abs" is worse, because they differ by which limb is thicker.
     So: equipment, a shape of muscle with no body attached, or the
     SHAPE OF THE EFFORT.

     JUDGED AT 40PX AND DRAWN FOR IT. The first cut of these sat at
     26px beside the name and every one of the lifts was a smudge —
     two capital Ts for a bench press, a squiggle for an arm. The run
     profiles were the only four that survived, because they are three
     strokes each. Given the whole slot they are drawings rather than
     marks, and the ones that still could not be drawn honestly are
     simply not here.

     MISSING IS A STATE, NOT A GAP. Stretch has no mark that is not a
     figure, and a glyph that has to be explained is worse than the
     group's own: the name is beside it at 34px either way. */
  var KIND_ICON = {
    /* ── THE FOUR RUNS ARE PACE PROFILES ──
       A shallow wave, a plateau, a spike train, and a late rise held.
       They are the one place on this sheet where the drawing carries
       something the words do not: Tempo and Intervals are both hard,
       and they are hard in shapes you can see.

       ALL FOUR SIT ON THE SAME BASELINE AT y21, and the axis running
       left to right is the whole grammar. `easy` had its baseline at
       19.6 with the profile a parallel line above it: no figure and no
       ground, which at 40px is an equals sign rather than a run.

       AND TEMPO IS A PLATEAU, NOT A STEP. Drawn as rise-and-hold it
       was `long` shifted left — the same silhouette with the knee in a
       different place, which at this size is a parameter rather than a
       shape, and the two are adjacent cards in one group. A block you
       come down off is what a tempo run is anyway. */
    easy:  '<path d="M2.4 14.6q4.8-3 9.6 0t9.6 0"/>'
         + '<path d="M2.4 21h19.2" opacity=".4"/>',
    tempo: '<path d="M2.4 17h3.4l2.6-8.4h7.2l2.6 8.4h3.4"/>'
         + '<path d="M2.4 21h19.2" opacity=".4"/>',
    reps:  '<path d="M2.4 17h2.6l1.8-8.6h1.8L10.4 17h2.4l1.8-8.6h1.8L18.2 17h3.4"/>'
         + '<path d="M2.4 21h19.2" opacity=".4"/>',
    long:  '<path d="M2.4 17h12.2l3.2-7.6h3.8"/>'
         + '<path d="M2.4 21h19.2" opacity=".4"/>'
  };

  /* ── NOTHING ELSE IS IN THAT LIST, AND THAT IS THE RESULT RATHER
     THAN THE GAP ──
     Chest, Back, Shoulders, Arms, Legs, Abs, Push, Pull and Core were
     drawn twice over and cut both times. At 26px beside the name every
     one was a smudge. Redrawn for the 40px slot they were legible and
     wrong: the back's V-taper read as a SHIELD, the flexed arm as a
     squiggle, the bent leg as a hook, and the waist with two bands as
     a coffee bean.

     The run four work because a pace profile is not a picture of an
     object — it is the shape of the session, which is a thing a line
     can be. A lift has no equivalent: every honest drawing of one is a
     bar with plates on it, so ten of them would be one silhouette ten
     times. And a glyph that is confidently the wrong object is worse
     than none, because the card then says something false rather than
     nothing.

     A RAMP FOR THE INCLINE WALK AND A SNOWFLAKE FOR THE COLD WENT THE
     SAME WAY, later and for a softer reason: both were legible and
     both were stock. A right triangle is a set square and a six-barbed
     flake is the one in every icon set there has ever been — neither
     is wrong, and neither is worth the slot. The first ramp was also
     drawn MIRRORED, descending left to right against four pace
     profiles that all rise, which nobody spotted for two rounds.

     So the lifts wear the group's weight, which is true of all of
     them, and the name is beside it at 34px with the muscles named
     under it. If any of these come back it will be because somebody
     found a drawing, not because the gap looked untidy. */

  function scTrainSwoop(w) {
    var box = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    box.setAttribute('class', 'wc-sw');
    box.setAttribute('viewBox', '0 0 100 80');
    box.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    box.setAttribute('aria-hidden', 'true');
    /* Named on the element: the paths are anonymous curves, so this is
       the only thing a check outside this file can hold the pairing to. */
    box.setAttribute('data-swoop', w.sw);
    box.innerHTML = SWOOP[w.sw];
    return box;
  }

  var TRAIN_GROUPS = [
    { k: 'bro', n: 'All exercises', sw: 'a', c: '#e6412f', d: 'One body part a day.', of: [
      { k: 'chest', sw: 'a', n: 'Chest',     t: 50, c: '#e6412f',
        d: 'Press, fly and dip.' },
      { k: 'back',  sw: 'a', n: 'Back',      t: 50, c: '#2f7fe6',
        d: 'Rows, pulldowns and pull-ups.' },
      { k: 'delts', sw: 'c', n: 'Shoulders', t: 45, c: '#8a4fe0',
        d: 'Press and all three heads.' },
      { k: 'arms',  sw: 'c', n: 'Arms',      t: 40, c: '#e0761a',
        d: 'Biceps and triceps.' },
      { k: 'legs',  sw: 'f', n: 'Legs',      t: 60, c: '#17a06b',
        d: 'Quads, hamstrings, glutes and calves.' },
      { k: 'abs',   sw: 'd', n: 'Abs',       t: 20, c: '#14a2a2',
        d: 'Abs, obliques and lower back.' }
    ] },
    { k: 'ppl', n: 'PPL', sw: 'c', c: '#2f7fe6', d: 'Push, pull, legs and core.', of: [
      { k: 'push', sw: 'a', n: 'Push', t: 55, c: '#e6412f',
        d: 'Chest, shoulders and triceps.' },
      { k: 'pull', sw: 'a', n: 'Pull', t: 50, c: '#2f7fe6',
        d: 'Back, lats and biceps.' },
      { k: 'legs', sw: 'f', n: 'Legs', t: 60, c: '#8a4fe0',
        d: 'Quads, hamstrings, glutes and calves.' },
      { k: 'core', sw: 'd', n: 'Core', t: 20, c: '#17a06b',
        d: 'Abs, obliques and lower back.' }
    ] },
    { k: 'run', n: 'Run', sw: 'b', c: '#e08a12', d: 'Easy, tempo, intervals or long.', of: [
      { k: 'easy',  sw: 'b', n: 'Easy',      t: 40, c: '#17a06b',
        d: 'Conversational pace, flat.' },
      { k: 'tempo', sw: 'f', n: 'Tempo',     t: 35, c: '#e0761a',
        d: 'Comfortably hard, held.' },
      { k: 'reps',  sw: 'f', n: 'Intervals', t: 45, c: '#e6412f',
        d: 'Hard efforts, walked or jogged between.' },
      { k: 'long',  sw: 'b', n: 'Long',      t: 75, c: '#2f7fe6',
        d: 'Time on the feet, easy throughout.' }
    ] },
    { k: 'rec', n: 'Recovery', sw: 'e', c: '#14a2a2', d: 'Walk, stretch, core or cold.', of: [
      { k: 'incline', sw: 'e', n: 'Incline walk', t: 40, c: '#14a2a2',
        d: 'Steep, slow, nothing to prove.' },
      { k: 'stretch', sw: 'e', n: 'Stretch',      t: 20, c: '#8a4fe0',
        d: 'Mobility and long holds.' },
      { k: 'core',    sw: 'd', n: 'Core',         t: 20, c: '#17a06b',
        d: 'Abs, obliques and lower back.' },
      { k: 'cold',    sw: 'b', n: 'Cold',         t: 10, c: '#2f7fe6',
        d: 'Plunge or the end of a shower.' }
    ] }
  ];

  /* ── EFFORT IS YOURS, AND THE TIME ONLY SUGGESTS IT ──
     It went in as a fourth field somebody typed — Hard, Hard, Hard,
     Easy — which is the app holding an opinion about a session it
     knows nothing about. Then it was worked out from the minutes,
     which is honest and still wrong: forty minutes is a walk for one
     person and the hardest thing in their week for another, and an
     easy run at forty came back "Moderate" in its own words.

     So the minutes only set where the control STARTS. The number is a
     good guess and a bad verdict, and the difference between those two
     is one press. Twenty-five and fifty are the only figures in it. */
  /* LIGHT, not Easy. "Easy" is a verdict on the session and half the
     time an untrue one — a light day is a decision you took, and the
     word for it should not sound like a shrug. */
  var EFFORTS = ['Light', 'Moderate', 'Hard'];

  /* ── HOW LONG, AS A LADDER ──
     A field would be a keyboard for a number everybody rounds anyway:
     nobody trains for 47 minutes, they train for "about three quarters
     of an hour". Eight rungs covers a stretch and a two-hour session,
     and the card's own estimate is spliced in where it is not already
     one of them — so the suggestion is always reachable in one press
     and never a rung you cannot get back to. */
  var MINS = [15, 20, 30, 45, 60, 75, 90, 120];
  function scMinLadder(est) {
    var out = MINS.slice();
    if (out.indexOf(est) < 0) out.push(est);
    return out.sort(function (a, b) { return a - b; });
  }
  /* The length of a session is the length of everything in it: pull at
     fifty and core at twenty is seventy minutes, not fifty. */
  function scTrainMins(ws) {
    return ws.reduce(function (n, x) { return n + x.t; }, 0);
  }
  function scEffort(min) {
    return min < 25 ? EFFORTS[0] : min < 50 ? EFFORTS[1] : EFFORTS[2];
  }

  /* Flattened once, with each workout stamped with the group it came
     out of and the key it is stored under.

     THE KEY IS QUALIFIED, AND IT HAS TO BE. Legs is in two groups and
     Core is in two more, so a bare 'legs' on disk names two cards with
     two colours — and the one it resolved to would be whichever came
     first in this list, which is not a decision anybody took. */
  var WORKOUTS = [];
  TRAIN_GROUPS.forEach(function (grp) {
    grp.key = grp.k;
    grp.lab = 'Sessions';
    grp.val = String(grp.of.length);
    grp.of.forEach(function (w) {
      w.gk = grp.k;
      w.key = grp.k + '.' + w.k;
      w.lab = 'Est. time';
      w.val = w.t + ' min';
      WORKOUTS.push(w);
    });
  });

  function scWorkout(k) {
    for (var i = 0; i < WORKOUTS.length; i++) if (WORKOUTS[i].key === k) return WORKOUTS[i];
    return null;
  }
  function scTrainGroup(k) {
    for (var i = 0; i < TRAIN_GROUPS.length; i++) {
      if (TRAIN_GROUPS[i].k === k) return TRAIN_GROUPS[i];
    }
    return null;
  }

  var TRAIN_KEY = 'sched.train.v1';
  var trainLog = {};                 /* date -> blockId -> { k, e } */

  /* ── EVERY RECORD WRITTEN BEFORE THE EFFORT EXISTED IS A BARE
     STRING ──
     Read as an object those give undefined for both figures, and the
     card then opens on nothing and the row draws no name. Normalised
     on the way IN rather than migrated on the way out, which is the
     friends half's own answer to the same question: this browser owns
     the record and rewrites it the next time you touch that block, so
     there is nothing to migrate. */
  function scTrainRec(v) {
    if (typeof v === 'string') return { k: v, e: '', m: 0 };
    if (!v || typeof v !== 'object') return null;
    return { k: String(v.k || ''), e: String(v.e || ''), m: +v.m || 0 };
  }

  /* ── A SESSION CAN BE MORE THAN ONE THING ──
     Pull and abs, legs and core: most people's actual session is a
     lift plus one small thing, and made to pick one they either lie or
     stop logging. Stored as the keys joined with a plus in the SAME
     field rather than as a second one — every reader of this record
     goes through here, so a shape nothing else knows about cannot
     leak, and a record written before this is a list of one.

     ORDER IS PRESS ORDER, so "Pull + Abs" reads the way you chose it
     rather than the way the list happens to be sorted. */
  function scWorkoutsOf(k) {
    return String(k || '').split('+').map(scWorkout).filter(Boolean);
  }
  function scWorkName(k) {
    return scWorkoutsOf(k).map(function (w) { return w.n; }).join(' + ');
  }

  function scTrainLoad() {
    trainLog = scReadJSON(TRAIN_KEY, {});
    if (!trainLog || typeof trainLog !== 'object' || Array.isArray(trainLog)) trainLog = {};
    /* Ninety days, the objectives' window and the objectives' reason:
       this is one record per date, and which split you ran in March is
       not something anybody wants back.

       REPAIRED, NOT REJECTED — a damaged day is dropped and the rest
       survives. A key naming a workout this build no longer has goes
       with it: the card, the row's mark and the name all come out of
       WORKOUTS, so a kind that is not in it would draw a blank card
       and a row that says nothing. */
    var cut = new Date();
    cut.setDate(cut.getDate() - 90);
    var floor = scDay(cut);
    Object.keys(trainLog).forEach(function (day) {
      var rec = trainLog[day];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < floor
          || !rec || typeof rec !== 'object' || Array.isArray(rec)) {
        delete trainLog[day];
        return;
      }
      Object.keys(rec).forEach(function (id) {
        var r = scTrainRec(rec[id]);
        /* Repaired component by component: a record naming one workout
           this build still has and one it does not keeps the half that
           resolves rather than losing the session. */
        var ws = r && scWorkoutsOf(r.k);
        if (!ws || !ws.length) { delete rec[id]; return; }
        r.k = ws.map(function (w) { return w.key; }).join('+');
        /* Every record written before the rename says "Easy", and read
           as an unknown effort those would all be recomputed from the
           minutes — throwing away a choice somebody actually made. The
           word moved; the record did not. */
        if (r.e === 'Easy') r.e = 'Light';
        var est = scTrainMins(ws);
        if (EFFORTS.indexOf(r.e) < 0) r.e = scEffort(est);
        /* Every record written before the minutes existed has none, and
           the card's own estimate is the honest stand-in: it is what
           the app would have shown for it anyway. Clamped rather than
           rejected, because a nonsense figure is still a session. */
        if (!(r.m > 0)) r.m = est;
        r.m = Math.max(1, Math.min(600, Math.round(r.m)));
        rec[id] = r;
      });
      if (!Object.keys(rec).length) delete trainLog[day];
    });
    /* WRITTEN BACK, not just held. The old-shape records this repairs
       are on disk, and a repair that lives only in memory is redone on
       every boot and lost the moment anything else writes the key —
       which is how "repaired, not discarded" quietly becomes
       "discarded on the next write". */
    scTrainSave();
  }
  function scTrainSave() { scWriteJSON(TRAIN_KEY, trainLog); }

  function scTrainOf(day, id) {
    return (trainLog[day] && scTrainRec(trainLog[day][id])) || null;
  }
  function scTrainSet(day, id, k, e, m) {
    if (k) {
      if (!trainLog[day]) trainLog[day] = {};
      trainLog[day][id] = { k: k, e: e, m: m };
    } else if (trainLog[day]) {
      delete trainLog[day][id];
      if (!Object.keys(trainLog[day]).length) delete trainLog[day];
    }
    scTrainSave();
  }

  /* WHAT COUNTS AS TRAINING IS THE KEYWORD TABLE'S ANSWER, not a
     second list of words kept in step with it by hand. `train` is the
     gym on this app — a decision written down in the open beside the
     table — so anything the table sends there is a session, and
     adding "hyrox" to that one list makes the deck appear here too. */
  function scIsTrain(item) {
    return !!item && scIconFor(item.n) === 'train';
  }

  /* ── THE TWO BEHIND ARE MORE OF THE SAME CARD ──
     They were the NEXT TWO WORKOUTS in the group once, drawn in full
     and clipped to the corner showing — so pressing a chip changed
     what was behind the card as well as the card itself, the deck read
     as moving through the whole list, and mid-deal another session's
     name and figures slid under the one you were reading. That is
     still wrong and is not what this is. Then they were empty grey
     slabs, which said "there are more of these" and nothing else, and
     the thing they left out is WHICH these are: a stack of grey behind
     a red card is a stack of something else.

     They are the same card now — its hue, its ground, its swoop — so
     Chest is a hand of Chest and stepping to Push turns the whole hand
     over. No WORDS, and that is not a shortcut: the fan is 13 and 25
     pixels, so nothing but an edge is ever visible, and a name drawn
     where it cannot be read is DOM the deck pays for on every draw.
     What a card behind a card has to say is "there are more of THIS",
     and a surface is the whole of that sentence. */
  function scTrainBack(w, cls) {
    var card = scEl('div', 'wc ' + cls);
    card.style.setProperty('--wc-hue', w.c);
    card.setAttribute('aria-hidden', 'true');
    card.appendChild(scTrainSwoop(w));
    return card;
  }

  /* ── the card ──
     A <button>, and the only one in the deck: a stack of focusable
     cards is two tab stops that do nothing, and the pair behind show
     an edge each and cannot be pressed. */
  function scTrainCard(w, cls, pick, ef, mins) {
    var card = scEl(pick ? 'button' : 'div', 'wc' + (cls ? ' ' + cls : ''));
    /* Set on the element rather than as a class per workout: these are
       DATA — another one is a row in TRAIN_GROUPS — and a stylesheet
       that has to grow a rule alongside it is the same fact in two
       files, kept in step by hand. */
    card.style.setProperty('--wc-hue', w.c);
    card.dataset.workout = w.key;
    if (pick) {
      card.type = 'button';
      card.setAttribute('aria-label',
        'Trained ' + w.n + (mins ? ', ' + mins + ' minutes' : '')
        + (ef ? ', ' + ef.toLowerCase() : '') + '. ' + w.d);
    } else {
      card.setAttribute('aria-hidden', 'true');
    }

    /* Behind everything, and first in the source rather than pushed
       there with a z-index: it is the only absolutely positioned child
       in the card's own stacking context, so source order IS the depth
       and nothing has to be lifted over it. */
    card.appendChild(scTrainSwoop(w));

    var top = scEl('div', 'wc-top');
    /* The time, then what that costs. Effort is worked out from the
       minutes rather than set beside them — see scEffort. */
    /* ── EST. TIME UNTIL YOU SAY OTHERWISE ──
       The card shows its own estimate, labelled as one, until a length
       is actually chosen — and then it shows the SESSION's length and
       drops the word, because it has stopped being an estimate. The
       ladder's suggestion is not a choice: a card that said "Time" for
       a figure nobody had touched would be the app putting words in
       your mouth. */
    var figs = [[mins ? 'Time' : w.lab, mins ? mins + ' min' : w.val]];
    /* A group has no one duration, so it has no effort either — the
       cards inside it run from ten minutes to seventy-five. */
    if (ef) figs.push(['Effort', ef]);
    figs.forEach(function (pair) {
      var col = scEl('div');
      col.appendChild(scEl('span', null, pair[0]));
      col.appendChild(scEl('b', null, pair[1]));
      top.appendChild(col);
    });

    /* The session's own drawing where there is one, the group's where
       there is not, and NOTHING where neither has one — an empty 40px
       <svg> is a hole the layout still pays for. Named on the element,
       because these are anonymous paths and it is the only thing a
       check outside this file can hold the pairing to. */
    var mark = KIND_ICON[w.k] || WORKOUT_ICON[w.gk || w.k];
    if (mark) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      g.setAttribute('class', 'wc-g');
      g.setAttribute('viewBox', '0 0 24 24');
      g.setAttribute('aria-hidden', 'true');
      g.setAttribute('data-kind', KIND_ICON[w.k] ? w.k : (w.gk || w.k));
      g.innerHTML = mark;
      top.appendChild(g);
    }
    card.appendChild(top);

    card.appendChild(scEl('span', 'wc-n', w.n));
    card.appendChild(scEl('span', 'wc-d', w.d));
    if (pick) card.addEventListener('click', pick);
    return card;
  }

  /* ── the sheet, in two steps ──
     The deck answers WHICH KIND first and WHICH ONE second, on the
     same three controls: a chip row, a stack, and the front card.
     Stepping in swaps what the chips are and what the deck holds,
     which is why both are rebuilt by one draw() rather than by two
     builders that have to agree about the layout between them.

     THE STEP IS NOT REMEMBERED. Coming back to a block you already
     logged opens on ITS group with ITS card at the front, and a block
     with nothing on it opens on the three kinds — the state is read
     off the record every time rather than kept in a variable that
     outlives the sheet. */
  /* ── the sheet, in two steps ──
     The deck answers WHICH KIND first and WHICH ONE second, on the
     same three controls: a chip row, a stack, and the front card.
     Stepping in swaps what the chips are and what the deck holds,
     which is why both are rebuilt by one draw() rather than by two
     builders that have to agree about the layout between them.

     THE STEP IS NOT REMEMBERED. Coming back to a block you already
     logged opens on ITS group with ITS card at the front and ITS
     effort already chosen — the state is read off the record every
     time rather than kept in a variable that outlives the sheet. */
  function scTrainAsk(item, dow, day) {
    var rec = scTrainOf(day, item.id);
    /* ── WHAT IS ALREADY ON THE BLOCK, AS A SELECTION ──
       Order is press order, so "Pull + Abs" reads the way it was
       chosen. The group opened is the FIRST pick's, because that is
       the one somebody went looking for — abs is what you add to it. */
    var sel = rec ? scWorkoutsOf(rec.k).map(function (w) { return w.key; }) : [];
    var got = sel.length ? scWorkout(sel[0]) : null;
    var into = got ? scTrainGroup(got.gk) : null;
    var at = got ? into.of.indexOf(got) : 0;
    var ef = got ? rec.e : '';
    var mins = got ? rec.m : 0;
    /* Whether the figures were CHOSEN or merely suggested. Both are
       seeded off the selection, and both stop moving with it the
       moment a press says otherwise — an effort and a length are about
       the session you did, not about the card you are looking at. */
    var saidEf = !!ef, saidMin = !!mins;
    /* ── THE DEAL HAPPENS ONCE, WHEN THE SHEET OPENS ──
       draw() rebuilds the whole deck on every press — of a chip, of an
       effort, of a kind — and the cards are new elements each time, so
       the animation ran again on every one of them. Comparing four
       splits meant watching the same hand dealt four times, which is a
       control putting on a performance while you are trying to read
       it. The fold is the thing worth having; the deal is worth
       exactly one showing. */
    /* ── THE TWO LEVELS MOVE DIFFERENTLY, AND THAT IS THE POINT ──
       Between the four kinds you are choosing what SORT of session
       this was, so the hand comes apart and reassembles: the front
       card leaves first and the two behind follow it out, then the new
       hand lands back to front. A CASCADE.

       Inside a group you are stepping THROUGH one hand, so the cards
       come off the top one at a time — each lifts, arcs away, and the
       next is already there underneath. A PEEL. Cascading inside a
       group would say the four sessions were one stack; peeling
       between kinds would say you had started again.

       Both were chosen by playing seven candidates against each other
       in a lab running the real card, and both are the lab's own
       figures at 0.8x — which is where app.css's durations come from
       rather than from anybody's guess. The speed is a setting
       separate from the shape: it has moved twice and no keyframe
       moved with it.

       Four entrances then, and one variable rather than four flags: a
       draw is a deal, a lift, a cascade, a peel, or nothing. draw()
       also runs on an effort, a length and a pick, and on every one of
       those the card in front is the SAME card with different figures
       on it — a
       deck that moved for a press on Hard would be answering a question
       nobody asked. Set where the intent is and consumed by the next
       draw, so nothing else can inherit it. */
    var entr = 'deal';

    scSheet('What did you train?', function (body) {
      /* "What you did", not "one": a session can be a lift and one
         small thing, and copy that says pick ONE is the app telling
         you the answer has to be a lie. */
      body.appendChild(scEl('p', 'wc-sub',
        'Pick what you did and it goes on ' + item.n + '.'));

      var chips = scEl('div', 'wc-chips');
      var deck = scEl('div', 'wc-deck');
      var howHard = scEl('div', 'wc-eff');
      var foot = scEl('div', 'wc-foot');
      body.appendChild(chips);
      body.appendChild(deck);
      body.appendChild(howHard);
      body.appendChild(foot);

      function list() { return into ? into.of : TRAIN_GROUPS; }

      function suggest() {
        var est = sel.length
          ? scTrainMins(sel.map(scWorkout))
          : scTrainMins([list()[at]]);
        if (!saidEf) ef = scEffort(est);
        if (!saidMin) mins = est;
        return est;
      }

      function press(w) {
        return function () {
          /* Step one opens the group. */
          if (!into) { into = w; at = 0; ef = ''; entr = 'lift'; draw(); return; }
          /* ── STEP TWO TOGGLES, IT DOES NOT LOG ──
             It used to log on the press, which is one tap and made a
             second workout impossible: most people's real session is a
             lift plus one small thing, and made to pick one they lie
             or stop logging. So the card is a choice and the foot is
             the answer. Selecting one is a press and a press, which is
             the cost — and it buys a screen where you can see what you
             are about to file. */
          var i = sel.indexOf(w.key);
          if (i >= 0) sel.splice(i, 1); else sel.push(w.key);
          draw();
        };
      }

      function commit() {
        if (!sel.length) return;
        scTrainSet(day, item.id, sel.join('+'), ef, mins);
        scClose();
        if (view === 'tally') scPaintTally(); else scRender();
        scToast(scWorkName(sel.join('+')) + ' logged', false);
      }

      function draw() {
        var all = list();
        var w = all[at];
        /* THE MINUTES SET WHERE THE CONTROL STARTS, and only where a
           choice has not been made: moving to another card in the same
           group has to re-suggest, because sixty minutes of legs and
           ten minutes of cold are not the same session — but a press
           on the effort row must survive a redraw of the deck. */
        /* The selection suggests both figures until a press says
           otherwise, and it re-suggests as the selection changes: pull
           and core is seventy minutes where pull alone is fifty. */
        if (into) suggest();
        $('scSheetTitle').textContent = into ? into.n : 'What did you train?';

        /* THE CHIPS ARE REBUILT, NOT RELABELLED. The two levels have
           different lengths, so a pass that only rewrites the text
           leaves a chip standing on a group of four that selects an
           index nothing is at. */
        chips.textContent = '';
        all.forEach(function (x, i) {
          /* THE CHIP IS THE PAGER, NOT THE PICKER. It says which card
             is at the front; whether that card is CHOSEN is the card's
             own state, and a chip that meant both would be one control
             answering two questions. The tick is a readout of the
             selection so you can see a pick that is scrolled off the
             front without stepping through the deck to find it. */
          var picked = into && sel.indexOf(x.key) >= 0;
          var c = scEl('button', 'wc-chip' + (picked ? ' is-picked' : ''));
          c.type = 'button';
          if (picked) {
            c.insertAdjacentHTML('beforeend',
              '<svg viewBox="0 0 24 24" aria-hidden="true">'
              + '<path d="M4.5 12.8l5.2 5.2L19.5 6"/></svg>');
          }
          c.appendChild(document.createTextNode(x.n));
          c.setAttribute('aria-pressed', i === at ? 'true' : 'false');
          if (picked) c.setAttribute('aria-label', x.n + ', chosen');
          c.addEventListener('click', function () {
            if (at === i) return;
            at = i;
            /* A hand at the top level, one hand being stepped through
               inside a group. */
            entr = into ? 'peel' : 'cascade';
            /* Nothing is cleared here. This line used to blank the
               effort so the next card could suggest its own, and once
               a press could SAY an effort the two fought: the clear
               emptied it and the suggestion refused to refill it,
               because it had been told not to. suggest() owns both
               figures and knows which of them you have chosen. */
            draw();
          });
          chips.appendChild(c);
        });

        /* THE TWO BEHIND GO IN FIRST. These are absolutely positioned
           siblings with no z-index between them, so the stacking order
           IS the source order — written front-first the pair that make
           it a deck are painted over the card they are behind, and the
           whole thing reads as one card with a shadow. */
        /* Set BEFORE the cards go in, because it is what they match
           on — the cards are new elements every draw, so a class on the
           deck is what decides whether they arrive with anything. */
        deck.classList.toggle('is-dealing', entr === 'deal');
        deck.classList.toggle('is-turning', entr === 'lift');
        deck.classList.toggle('is-cascading', entr === 'cascade');
        deck.classList.toggle('is-peeling', entr === 'peel');

        /* ── THE WHOLE HAND GOES, NOT THE TOP CARD ──
           The two behind are the same card as the one in front now, so
           what leaves is a hand of Chest and what arrives is a hand of
           Push — the deck turns over rather than swapping its top
           card. Taking only the front one off left two Chest slabs
           standing while a Push card slid in over them, which is the
           thing this whole treatment is about seen from the other
           side.

           Kept rather than rebuilt: they carry the outgoing workout's
           own colour and its own swoop, and the whole gesture is that
           THOSE cards are the ones going away. Fresh elements would be
           a different hand pretending.

           textContent = '' detaches them along with everything else,
           which is what makes this work at all — an element removed
           and re-inserted starts its animation on insertion, so the
           pass begins exactly when the new hand is laid out rather
           than whenever the class happened to land. */
        var out = null;
        if (entr === 'cascade' || entr === 'peel') {
          /* ── A PRESS LANDING MID-PASS DROPS THE HAND ALREADY GOING ──
             These passes are a second and a half, so walking down the
             chips faster than that is ordinary rather than perverse —
             and without this the next draw marks the leaving hand
             `is-out` a second time, so six cards leave, then nine.
             The hand you have already left is not worth watching. */
          [].forEach.call(deck.querySelectorAll('.wc.is-out'), function (c) {
            c.parentNode.removeChild(c);
          });
          out = [].slice.call(deck.querySelectorAll('.wc'));
          out.forEach(function (c) {
            c.classList.remove('is-front', 'is-picked');
            c.classList.add('is-out');
          });
          if (!out.length) out = null;
        }
        entr = null;

        deck.textContent = '';
        /* ── THE HAND BEING TAKEN OFF GOES IN FIRST ──
           These are absolutely positioned siblings with no z-index
           between them, so source order IS the stacking order. The
           outgoing card used to go in LAST, on top of the whole deck,
           and it faded to nothing there — which is a card passing
           THROUGH the one that replaced it and then disappearing, and
           that is exactly what it was reported as.

           Under the arriving hand is where a hand taken off a deck
           actually is. Nothing fades now, so this order is the only
           thing keeping the two hands from being double-exposed while
           they cross — and b2 before b1 before the front inside each
           hand, so each keeps its own fan.

           Swept on animationend AND on a timer, because an animation
           that never runs — reduced motion, a background tab — would
           otherwise leave a dead hand on the pile for the next press
           to stack on. */
        if (out) {
          /* ── EACH CARD SWEEPS ITSELF ──
             It used to be one listener on the last card in the hand,
             which was right only while all three moved together. Both
             passes are staggered now and the card that finishes LAST
             is b2, at the back — so a single listener on the front one
             fired at 1.24s and tore the other two off the screen
             mid-flight. A card knows when its own animation is over.

             On a timer as well, because an animation that never runs —
             a background tab — would otherwise leave a dead hand on
             the pile for the next press to stack on. The timer has to
             outlast the longest card, which is the peel's b2 at
             .38 + .78 = 1.16s. Fire it early and it kills a card
             mid-flight, which is the bug the per-card listener above
             was fixing. */
          out.forEach(function (c) {
            deck.appendChild(c);
            var kill = function () {
              if (c.parentNode) c.parentNode.removeChild(c);
            };
            c.addEventListener('animationend', kill);
            setTimeout(kill, 1800);
          });
        }
        deck.appendChild(scTrainBack(w, 'b2'));
        deck.appendChild(scTrainBack(w, 'b1'));
        deck.appendChild(scTrainCard(w, 'is-front'
          + (into && sel.indexOf(w.key) >= 0 ? ' is-picked' : ''),
          press(w), into ? ef : '', saidMin ? mins : 0));

        /* ── HOW HARD IT WAS IS A ROW, NOT A FIELD ON THE CARD ──
           The card is a <button> and a control inside a button is
           invalid: it collapses to one press while looking exactly
           right, which is the trap the day cards and the tally rows
           have both had a rule about. So it is a SIBLING, and the
           card's own Effort figure is a readout of it.

           Drawn only at step two: a group is four sessions running
           from ten minutes to seventy-five and has no one effort. */
        howHard.textContent = '';
        if (into) {
          var lab = scEl('span', 'wc-eff-l', 'How hard was it?');
          lab.id = 'scEffLab';
          howHard.appendChild(lab);
          var row = scEl('div', 'wc-eff-r');
          row.setAttribute('role', 'group');
          row.setAttribute('aria-labelledby', 'scEffLab');
          EFFORTS.forEach(function (name) {
            var b = scEl('button', 'wc-chip wc-ef', name);
            b.type = 'button';
            b.setAttribute('aria-pressed', name === ef ? 'true' : 'false');
            b.addEventListener('click', function () {
              if (ef === name) return;
              ef = name;
              saidEf = true;
              draw();
            });
            row.appendChild(b);
          });
          howHard.appendChild(row);

          /* ── AND HOW LONG ──
             A ladder rather than a field: nobody trains for 47 minutes,
             they train for about three quarters of an hour, and a
             keyboard for a number everybody rounds anyway is a keyboard
             for nothing. The card's own estimate is spliced into the
             rungs where it is not already one, so the suggestion is
             always reachable in one press.

             BLED to the sheet's edges, because eight rungs do not fit
             across a phone and a row that stops inside the padding
             reads as a short list rather than one that continues. */
          var mlab = scEl('span', 'wc-eff-l', 'How long, in minutes?');
          mlab.id = 'scMinLab';
          howHard.appendChild(mlab);
          var mrow = scEl('div', 'wc-eff-r wc-mins');
          mrow.setAttribute('role', 'group');
          mrow.setAttribute('aria-labelledby', 'scMinLab');
          scMinLadder(suggest()).forEach(function (n) {
            var b = scEl('button', 'wc-chip wc-min', String(n));
            b.type = 'button';
            b.setAttribute('aria-pressed', n === mins ? 'true' : 'false');
            b.setAttribute('aria-label', n + ' minutes');
            b.addEventListener('click', function () {
              if (mins === n) return;
              mins = n;
              saidMin = true;
              draw();
            });
            mrow.appendChild(b);
          });
          howHard.appendChild(mrow);
        }

        foot.textContent = '';
        if (into) {
          /* ── A BACK ARROW, NOT THE WORDS "ALL KINDS" ──
             It was an underlined sentence sitting under the deck
             beside "Take it off", so the two ways out of the sheet
             read as a paragraph of options rather than as a way back
             and a delete. A back control is the one thing on a screen
             that never needs naming. */
          var back = scEl('button', 'wc-back');
          back.type = 'button';
          back.setAttribute('aria-label', 'All kinds');
          back.insertAdjacentHTML('beforeend',
            '<svg viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M15 4.5L7.5 12l7.5 7.5"/></svg>');
          back.addEventListener('click', function () {
            at = TRAIN_GROUPS.indexOf(into);
            into = null;
            sel = [];
            ef = '';
            /* Coming back is a level change, so it lifts. It is NOT a
               deal, even though the four kinds are what you land on:
               the deal is for choosing among them, and arriving back
               is one step of a movement you are already making. */
            entr = 'lift';
            draw();
          });
          foot.appendChild(back);
        }

        /* ── THE ANSWER IS THE FOOT, AND IT NAMES ITSELF ──
           "Log Pull + Abs" rather than "Done": the whole reason the
           card stopped logging on its own press is that a session can
           be more than one thing, so the control that files it has to
           say what it is about to file. */
        if (sel.length) {
          var go = scEl('button', 'wc-go', 'Log ' + scWorkName(sel.join('+')));
          go.type = 'button';
          go.addEventListener('click', commit);
          foot.appendChild(go);
        }

        /* Only where there is something to take off, and last: a
           control that undoes the answer sitting above the answer
           reads as one of the options. */
        if (scTrainOf(day, item.id)) {
          var clear = scEl('button', 'wc-clear', 'Take it off');
          clear.type = 'button';
          clear.addEventListener('click', function () {
            scTrainSet(day, item.id, '');
            scClose();
            if (view === 'tally') scPaintTally(); else scRender();
            scToast('Taken off', false);
          });
          foot.appendChild(clear);
        }
      }

      draw();
    });
  }

  /* ═══════════════════════════════════════════════════════════
     THE WORKOUTS VIEW

     What you actually trained, as against the five you ticked. It is
     the second stop on Today rather than a fourth tab: the bar holds
     three and an add control at 390px, and a fourth would be the
     control that made the row too tight to press. The two stops are
     the friends board's own pattern, and the CONTROL IS THE HEADING —
     a word naming a section beside the button that opens that section
     is the same word twice.

     IT DRAWS THE RECORD AND NOTHING ELSE. There is no weight here and
     there will not be: this app has never asked what you weigh, and a
     number you are asked for every morning is a different relationship
     with a screen than one that only ever says you showed up.
     ═══════════════════════════════════════════════════════════ */

  /* Thirteen weeks. The record is kept for ninety days, so this is all
     of it — and three month blocks is what fits across a phone at a
     dot size a thumb can still see. */
  var WORK_DAYS = 91;

  /* ── EVERY LOGGED SESSION, NEWEST FIRST, ONE ENTRY PER BLOCK ──
     A session can name more than one workout — Pull and abs is one
     session, not two — so the entry carries the LIST and the count of
     these is the count of sessions. Flattened to one row per component
     it would say you trained twice on a day you trained once, which is
     the figure this whole screen is about. */
  function scWorkAll() {
    var out = [];
    for (var i = 0; i < WORK_DAYS; i++) {
      var day = scDayBack(i);
      var rec = trainLog[day];
      if (!rec) continue;
      Object.keys(rec).forEach(function (id) {
        var r = scTrainRec(rec[id]);
        var ws = r && scWorkoutsOf(r.k);
        if (ws && ws.length) out.push({ day: day, ws: ws, e: r.e, m: r.m });
      });
    }
    return out;
  }
  /* ── A SESSION'S SIGNATURE IS THE WHOLE OF IT ──
     Pull and core is ONE thing you do, not two things that happened to
     land on the same block: it has its own length, its own days and its
     own place in the week, and split across a Pull panel and a Core
     panel none of that is anywhere. So the record groups on the joined
     key and the panel is called "Pull + Core".

     What that costs is that Pull alone and Pull + Core are different
     rows, which is right — they are different sessions — and it is why
     the order is press order: the same two chosen the same way always
     land on the same row. */
  function scWorkSig(h) {
    return h.ws.map(function (w) { return w.key; }).join('+');
  }

  /* ── THE DAY IT USUALLY LANDS ON ──
     "Fridays" is the one thing a list of dates says that a count does
     not: it is the SHAPE of your week rather than the size of it. Only
     claimed where one weekday actually holds a majority of the
     sessions — with three spread over three different days there is no
     usual day, and inventing one would be the app telling you
     something about yourself that it made up. */
  function scWorkDow(hits) {
    var by = [0, 0, 0, 0, 0, 0, 0];
    hits.forEach(function (h) { by[new Date(h.day + 'T12:00:00').getDay()]++; });
    var top = 0;
    for (var i = 1; i < 7; i++) if (by[i] > by[top]) top = i;
    /* THREE SESSIONS BEFORE IT WILL SAY ONE. A majority of one is one,
       and "Sundays" under a tile reading 1 is the app inventing a
       routine out of a single Sunday. Below that it says how long ago
       instead, which is the honest fact about a session you have done
       once. */
    return hits.length >= 3 && by[top] * 2 > hits.length ? FULL[top] + 's' : '';
  }

  /* ── THE DOT CALENDAR, AND IT BELONGS TO ONE WORKOUT ──
     Three months of dots with the days you did THAT session lit in its
     own colour. It is not a calendar of everything: a picture with
     nine hues scattered through it says you were busy and nothing
     else, and the question you open this screen with is whether you
     are actually doing the one thing you say you do.

     So it hangs off the card you press. Press Chest and the calendar
     is Chest's — which is the whole mechanism, and why the panel
     CONTAINS the row rather than sitting above it.

     The days you missed are drawn, at --tick-off. A calendar of only
     the days you trained is a list of wins with the gaps taken out,
     and losing the misses is the one thing a record of showing up must
     never do — the tally's own calendar is under the same rule. */
  function scWorkCal(hits, name) {
    var on = {};
    hits.forEach(function (h) { on[h.day] = 1; });

    var cal = scEl('div', 'wo-cal');
    /* Whole months, so the labels are months rather than "13 weeks
       ago". The oldest is clipped by the window and that is honest: it
       is where the record starts. */
    var first = new Date();
    first.setDate(first.getDate() - (WORK_DAYS - 1));
    var months = [];
    var cur = new Date(first.getFullYear(), first.getMonth(), 1);
    var end = new Date();
    while (cur <= end) {
      months.push(new Date(cur));
      cur.setMonth(cur.getMonth() + 1);
    }
    months = months.slice(-3);          /* three is what a phone holds */

    months.forEach(function (m) {
      var col = scEl('div', 'wo-m');
      col.appendChild(scEl('span', 'wo-mn', MON[m.getMonth()]));
      var grid = scEl('div', 'wo-g');
      /* MONDAY FIRST, the deck's own week. A calendar starting on
         Sunday beside a deck starting on Monday is two weeks on one
         app. */
      var lead = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
      for (var i = 0; i < lead; i++) grid.appendChild(scEl('i', 'wo-d is-gap'));
      var days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= days; d++) {
        var key = scDay(new Date(m.getFullYear(), m.getMonth(), d));
        /* The lit day's colour is the PAGE's accent and is set in the
           sheet, not here — see .wo-d.is-on. It was the session's own
           hue written inline, which put red marks on a lime page and
           ran a second colour system down a screen that already has an
           accent. */
        grid.appendChild(scEl('i', 'wo-d' + (on[key] ? ' is-on' : '')));
      }
      col.appendChild(grid);
      cal.appendChild(col);
    });
    cal.setAttribute('role', 'img');
    cal.setAttribute('aria-label', name + ', ' + hits.length
      + (hits.length === 1 ? ' session' : ' sessions')
      + ' over three months.');
    return cal;
  }

  /* ── ONE PANEL PER WORKOUT YOU HAVE ACTUALLY DONE ──
     Not one per workout that EXISTS. Twenty-two panels, nineteen of
     them reading zero, is a menu rather than a record — and the deck
     two taps away is already the menu.

     THE WHOLE PANEL IS THE BUTTON, and the calendar is inside it. A
     row that opens a picture drawn somewhere else on the page is two
     things to look at for one press; this way the panel simply grows,
     and what grew is under your thumb. */
  function scWorkPanel(sig, hits, most, month, open, pick) {
    var name = scWorkName(sig);
    var ws = scWorkoutsOf(sig);
    var col = ws[0] ? ws[0].c : '#888';
    var grp = ws[0] ? scTrainGroup(ws[0].key.split('.')[0]) : null;
    var mins = Math.round(hits.reduce(function (n, h) { return n + h.m; }, 0)
      / hits.length);
    var p = scEl('button', 'wo-p' + (open ? ' is-open' : ''));
    p.type = 'button';
    p.dataset.workout = sig;
    p.style.setProperty('--wo-c', col);
    p.setAttribute('aria-expanded', open ? 'true' : 'false');
    /* THE SWATCH IS THE SESSION'S OWN COLOUR — the one place this app
       keeps a literal hex, for the cards' own reason: a colour that
       says WHICH has to be the same at every angle of the wheel. */
    var sw = scEl('span', 'wo-sw');
    sw.appendChild(scEl('b', null, String(hits.length)));
    sw.appendChild(scEl('small', null, hits.length === 1 ? 'session' : 'sessions'));
    p.appendChild(sw);
    var txt = scEl('span', 'wo-tx');
    var w = scEl('span', 'wo-w');
    w.appendChild(scEl('i'));
    w.appendChild(document.createTextNode(name));
    txt.appendChild(w);
    if (grp) txt.appendChild(scEl('span', 'pill wo-gp', grp.n));
    p.appendChild(txt);
    var figs = scEl('span', 'props');
    figs.setAttribute('aria-hidden', 'true');
    var eff = scWorkEffort(hits);
    var mine = month.filter(function (h) { return scWorkSig(h) === sig; }).length;
    var share = month.length && mine ? Math.round(mine / month.length * 100) : 0;
    var dow = scWorkDow(hits);
    figs.appendChild(scEl('span', 'pill', 'Avg ' + mins + ' min'));
    if (eff) figs.appendChild(scEl('span', 'pill', eff));
    if (share) figs.appendChild(scEl('span', 'pill', share + '% this month'));
    figs.appendChild(scEl('span', 'pill', dow || scWorkAgo(hits[0].day)));
    p.appendChild(figs);
    if (open) p.appendChild(scWorkCal(hits, name));
    p.setAttribute('aria-label', name + ', ' + hits.length
      + (hits.length === 1 ? ' session' : ' sessions')
      + (dow ? ', usually ' + dow : ', last ' + scWorkAgo(hits[0].day))
      + '. ' + mins + ' minutes on average'
      + (eff ? ', usually ' + eff.toLowerCase() : '')
      + (share ? ', ' + share + ' per cent of this month\'s sessions' : '') + '. '
      + (open ? 'Showing its three months.' : 'Show its three months.'));
    p.addEventListener('click', pick);
    return p;
  }
  function scWorkEffort(hits) {
    var n = 0, sum = 0;
    hits.forEach(function (h) {
      var i = EFFORTS.indexOf(h.e);
      if (i >= 0) { sum += i; n++; }
    });
    return n ? EFFORTS[Math.round(sum / n)] : '';
  }

  /* ── AND THE TIME IS NOT ONE, WHICH IS WHY IT IS NOT CALLED ONE ──
     Nothing on this record carries a duration: the card's figure is an
     estimate and every session of a kind shares it, so an "average" of
     them is that estimate with a word in front of it that is not true.
     It is drawn as the time, and the clock beside it says which figure
     it is. If a real duration is ever logged this is where it goes. */
  var WORK_ICON = {
    /* The block glyph's own clock, reused rather than redrawn: two
       clocks on one app is the mistake the Steps footprint taught. */
    time: BLOCK_ICON.block,
    /* A bolt. Effort has no object to draw, and at 13px a bolt is the
       one shape that means it without a word. */
    lift: '<path d="M13.2 2.4L4.6 13.8h6.2l-1 7.8 8.6-11.4h-6.2z"/>'
  };

  function scWorkAgo(day) {
    var n = Math.round((new Date(scDay() + 'T12:00:00')
      - new Date(day + 'T12:00:00')) / 86400000);
    if (n <= 0) return 'today';
    if (n === 1) return 'yesterday';
    if (n < 7) return n + ' days ago';
    if (n < 14) return 'last week';
    return Math.floor(n / 7) + ' weeks ago';
  }

  /* Which panel is open. Not stored: it is a position on a screen you
     are looking at, not a preference — and one remembered from a week
     ago opens on a session you have stopped doing. */
  var workOpen = '';
  var workGroup = 'all';
  function scPaintWork() {
    var pane = $('scWorkPane');
    pane.textContent = '';
    var all = scWorkAll();
    if (!all.length) {
      pane.appendChild(scEl('p', 'wo-none',
        'Nothing here yet. Tick a training block and it asks what you '
        + 'trained; what you pick shows up here.'));
      return;
    }
    var by = {};
    all.forEach(function (h) {
      var sig = scWorkSig(h);
      (by[sig] || (by[sig] = [])).push(h);
    });
    var keys = Object.keys(by).sort(function (a, b) {
      return by[b].length - by[a].length
        || (by[b][0].day < by[a][0].day ? -1 : 1);
    });
    var floor = scDayBack(29);
    var month = all.filter(function (h) { return h.day >= floor; });
    var head = scEl('div', 'wo-head');
    var fig = scEl('b', 'ty-fig', String(all.length));
    fig.appendChild(scEl('i', null, all.length === 1 ? 'session' : 'sessions'));
    head.appendChild(fig);
    head.appendChild(scEl('span', null, '\u00b7 ' + keys.length
      + (keys.length === 1 ? ' kind' : ' kinds') + ' \u00b7 ' + month.length
      + ' this month'));
    pane.appendChild(head);
    /* ── the groups as a strip ──
       All, then only the groups you have actually done: a chip for a
       kind with nothing under it is a filter that empties the screen. */
    var groupOf = function (sig) {
      var w = scWorkoutsOf(sig)[0];
      return w ? w.key.split('.')[0] : '';
    };
    var groups = [];
    keys.forEach(function (k) {
      var g = groupOf(k);
      if (g && groups.indexOf(g) < 0) groups.push(g);
    });
    if (workGroup !== 'all' && groups.indexOf(workGroup) < 0) workGroup = 'all';
    if (groups.length > 1) {
      var strip = scEl('div', 'wo-strip');
      strip.setAttribute('role', 'group');
      strip.setAttribute('aria-label', 'Kind of session');
      [['all', 'All']].concat(groups.map(function (g) {
        var tg = scTrainGroup(g); return [g, tg ? tg.n : g];
      })).forEach(function (c) {
        var b = scEl('button', 'wo-c' + (workGroup === c[0] ? ' is-on' : ''), c[1]);
        b.type = 'button';
        b.dataset.wk = c[0];
        b.setAttribute('aria-pressed', workGroup === c[0] ? 'true' : 'false');
        b.addEventListener('click', function () {
          workGroup = c[0];
          scPaintWork();
        });
        strip.appendChild(b);
      });
      pane.appendChild(strip);
    }
    var shown = keys.filter(function (k) {
      return workGroup === 'all' || groupOf(k) === workGroup;
    });
    if (shown.indexOf(workOpen) < 0) workOpen = shown[0];
    var most = by[keys[0]].length;
    var list = scEl('div', 'wo-list');
    shown.forEach(function (k) {
      list.appendChild(scWorkPanel(k, by[k], most, month, k === workOpen,
        function () {
          if (workOpen === k) return;
          workOpen = k;
          scPaintWork();
        }));
    });
    pane.appendChild(list);
  }
  var RATE_KEY = 'sched.rate.v2';
  var RATE_OLD = 'sched.rate.v1';
  var rateLog = null;              /* { '2026-09-01': 4 } */
  var RATE_MAX = 5;

  /* Twelve weeks. Long enough that a factor can have five days either
     side of it — which is the floor below — and short enough to be
     about what you are doing rather than about your history. The
     tally's own window is 26 weeks and answers a different question:
     that one is the shape of one thing over time, this is a
     comparison, and a comparison over half a year is a comparison
     with somebody you no longer are. */
  var PAT = 84;
  /* Five on each side of a factor, or it is not ranked at all. Two
     days against eighty is not a comparison, it is two days — and a
     difference of means over a sample that small swings on one bad
     night and prints it as a finding. */
  var PAT_SIDE = 5;
  /* And fourteen rated days before the screen says anything. Below
     that it says how many more, which is honest and is also the only
     thing it can usefully do on its first open. */
  var PAT_FLOOR = 14;

  function scRateLoad() {
    var read = function (k) {
      try {
        var raw = JSON.parse(localStorage.getItem(k) || 'null');
        return (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : null;
      } catch (e) { return null; }
    };
    rateLog = read(RATE_KEY) || {};

    /* ── THE OLD SCALE COMES ACROSS ONCE ──
       Rough, Fine and Good were 0, 1 and 2; they are the bottom, the
       middle and the top of five now, which keeps their order and the
       even spacing they had. Only when there is nothing under the new
       key: a v2 record is the one somebody has been writing since, and
       a migration that ran twice would put months-old answers back
       over it. The old key is REMOVED rather than left — a number that
       resolves to another number is not something to keep resolving,
       and left there it is a second record of the same days that
       nothing reads. */
    if (!read(RATE_KEY)) {
      var was = read(RATE_OLD);
      if (was) {
        Object.keys(was).forEach(function (k) {
          var v = was[k];
          if (v === 0 || v === 1 || v === 2) rateLog[k] = [1, 3, 5][v];
        });
        scRateSave();
      }
    }
    try { localStorage.removeItem(RATE_OLD); } catch (e) {}

    /* A damaged entry is dropped and the rest of the record survives
       — the days are what you cannot get back, and one bad value must
       not take a season of them with it. */
    Object.keys(rateLog).forEach(function (k) {
      if (!scRateOK(rateLog[k])) delete rateLog[k];
    });
  }
  function scRateOK(v) {
    return typeof v === 'number' && v >= 1 && v <= RATE_MAX && v === Math.round(v);
  }
  function scRateSave() {
    try { localStorage.setItem(RATE_KEY, JSON.stringify(rateLog)); } catch (e) {}
  }
  function scRateOf(day) {
    var v = rateLog[day];
    return scRateOK(v) ? v : null;
  }
  /* The same window every other write on this app takes: today and
     the two behind it. A rating you can revise a month later is a
     rating about how the month went, which is not what any of this
     is measuring. */
  function scSetRate(day, v) {
    if (!scTallyOpen(day)) return false;
    if (v === null) delete rateLog[day]; else rateLog[day] = v;
    scRateSave();
    return true;
  }

  /* ── THE FACTORS ──
     One question per thing you log, and every one of them has to be
     answerable YES or NO on a given day — or not at all.

     THE THIRD ANSWER IS WHAT MAKES THE OTHER TWO WORTH HAVING. A day
     Train was never scheduled is not a day you skipped it; a night
     you did not record is not a short night. Both are dropped from
     that factor's arithmetic rather than counted as a no, which is
     the strip's own three states seen from the other side.

     A NUMBER IS SPLIT AT ITS OWN MIDDLE, never at a figure this app
     picked. Eight thousand steps is somebody else's target, and
     halving your own record is what guarantees both sides have days
     on them — which is the whole condition for a difference of means
     to say anything. */
  function scPatMids() {
    var mid = {}, floor = scDayBack(PAT - 1);
    TALLY.forEach(function (it) {
      if (it.k !== 'num') return;
      var vals = [];
      Object.keys(tickLog).forEach(function (day) {
        if (day < floor) return;
        var v = parseFloat(tickLog[day][it.id]);
        if (v > 0) vals.push(v);
      });
      vals.sort(function (a, b) { return a - b; });
      if (!vals.length) return;
      var h = vals.length >> 1;
      mid[it.id] = vals.length % 2 ? vals[h] : (vals[h - 1] + vals[h]) / 2;
    });
    return mid;
  }

  /* ── AND THE BLOCKS NOTHING ELSE ASKS ABOUT ──
     Train and Mind already carry Train, Walk and Read, so listing
     those blocks again would be one question asked twice under two
     names. What is left is everything the five never look at — the
     shift, the trading hours, the wind-down — and that is the half of
     this screen the tally could never have produced.

     BY NAME, not by id. A block's id is per weekday, so "Work" on a
     Monday and "Work" on a Tuesday are two records, and a factor
     built on one of them has twelve days in a twelve-week window. */
  function scPatBlocks() {
    var seen = {}, out = [];
    state.items.forEach(function (b) {
      if (seen[b.n] || scItemsFor(b.n).length) return;
      seen[b.n] = 1;
      out.push(b.n);
    });
    return out;
  }

  /* ── DOES THIS FACTOR HOLD ON THIS DAY? ──
     Yes, no, or NOT ASKED. Named apart from scRateRow below, which is
     the control that asks YOU: this one asks whether a THING held on a
     day, and confusing the two in a file this size is a reading trap. */
  function scPatHeld(f, day, mid) {
    var i, bs;
    if (f.item) {
      var raw = tickLog[day] && tickLog[day][f.item.id];
      if (f.item.k === 'do') {
        if (raw) return 1;
        return scApplied(f.item, day) ? 0 : -1;
      }
      var v = parseFloat(raw);
      if (!(v > 0) || mid[f.item.id] === undefined) return -1;
      return v >= mid[f.item.id] ? 1 : 0;
    }
    /* A block name: scheduled that weekday and not taken off, or the
       question was never put. */
    bs = scByDay(new Date(day + 'T12:00:00').getDay()).filter(function (b) {
      return b.n === f.block && !scOff(day, b.id);
    });
    if (!bs.length) return -1;
    for (i = 0; i < bs.length; i++) {
      if (blockLog[day] && blockLog[day][bs[i].id]) return 1;
    }
    return 0;
  }

  /* ── HOW FAR A THING MOVES A DAY ──
     The mean rating of the days it was on, less the mean of the days
     it was not. That is the whole statistic, and it is deliberately
     the simplest one that answers the question asked — anything with
     a coefficient in it would be a model, and a model you cannot see
     the working of is exactly the kind of answer this app refuses
     elsewhere.

     It says what your days have in common. It does not say what
     caused what, and the foot of the screen says so out loud rather
     than leaving it to be inferred from a bar. */
  function scPatRank() {
    var floor = scDayBack(PAT - 1), mid = scPatMids(), rated = [];
    Object.keys(rateLog).forEach(function (day) {
      if (day >= floor && day <= scDay()) rated.push(day);
    });

    var facts = [];
    TALLY.forEach(function (it) {
      facts.push({
        key: 'i:' + it.id, item: it,
        /* "Steps over 8,400", never "Steps 8,400+": the suffix hangs
           off a unit that already has a space in front of it, so
           "Sleep 7.5 h+" reads as a typo — and the name is dropped
           whole into the sentence at the top, where a word is a word
           and a plus sign is punctuation nobody speaks. */
        n: it.k === 'do' ? it.n
          : it.n + ' over ' + scPatMid(it, mid[it.id])
      });
    });
    scPatBlocks().forEach(function (n) {
      facts.push({ key: 'b:' + n, block: n, n: n });
    });

    var out = [];
    facts.forEach(function (f) {
      var yes = 0, ys = 0, no = 0, ns = 0;
      rated.forEach(function (day) {
        var a = scPatHeld(f, day, mid);
        if (a < 0) return;
        if (a) { yes++; ys += rateLog[day]; } else { no++; ns += rateLog[day]; }
      });
      if (yes < PAT_SIDE || no < PAT_SIDE) return;
      out.push({ key: f.key, n: f.n, item: f.item, block: f.block,
                 yes: yes, no: no, lift: ys / yes - ns / no });
    });
    out.sort(function (a, b) { return Math.abs(b.lift) - Math.abs(a.lift); });
    return { rows: out, rated: rated.length };
  }

  /* The split printed at the item's own precision, so "Sleep 7.2 h"
     and "Steps 8,400" both read as the figure you would have typed. */
  function scPatMid(it, v) {
    if (v === undefined) return '';
    var dp = it.dp || 0;
    return v.toLocaleString('en-GB',
      { minimumFractionDigits: dp, maximumFractionDigits: dp })
      + (it.unit || '');
  }

  /* ── THE ASK IS FIVE MARKS, AND IT IS IN TWO PLACES ──
     It was three chips on one screen. Five because the question has
     more than three honest answers in it and a row you fill is a
     control nobody has to be taught, and in TWO places because the
     screen that asks and the screen that reads the answer were the
     same screen: Pattern is where you go to see what your good days
     have in common, which is not where you are standing when a day
     ends.

     ONE CONTROL, built once and used twice. Two drawings of one
     question is how they drift, and a day rated four at the foot of
     the card had better be a day rated four on Pattern.

     Pressing the mark you are already on takes the day off again, so
     a mis-tap has a way back without a second control to explain it.

     THE FILLED ONES ARE THE ACCENT, which is this app's one claim:
     that something happened, and what happened is that you ANSWERED.
     The rest stay hollow. How the day went is carried by how many are
     filled, never by a colour — a red mark for a bad day would be the
     screen grading you back, and this is the one screen in the app
     that takes an opinion. */
  function scRateRow(day, ttl, after) {
    var wrap = scEl('div', 'rt-ask');
    if (ttl) wrap.appendChild(scEl('span', 'label', ttl));
    var row = scEl('div', 'rt-row');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', ttl || 'Rate this day');
    var now = scRateOf(day);
    for (var i = 1; i <= RATE_MAX; i++) {
      (function (n) {
        var b = scEl('button', 'rt' + (now !== null && n <= now ? ' is-on' : ''));
        b.type = 'button';
        b.dataset.rate = String(n);
        /* Spoken as what it DOES, not as where it sits in a row: "3"
           on its own is a number, and five buttons called 1 to 5 with
           no unit are five numbers. */
        b.setAttribute('aria-label',
          'Rate this day ' + n + ' out of ' + RATE_MAX);
        b.setAttribute('aria-pressed', now === n ? 'true' : 'false');
        b.innerHTML = RATE_DOT;
        b.addEventListener('click', function () {
          if (!scSetRate(day, now === n ? null : n)) {
            scToast('That day is not open yet', false);
            return;
          }
          if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
          if (after) after();
        });
        row.appendChild(b);
      }(i));
    }
    wrap.appendChild(row);
    return wrap;
  }

  /* ── A RING THAT FILLS, NOT A STAR ──
     One circle, and the two states are the same shape: hollow until
     you pick it, filled after. That is the habits screen's own rule —
     a kept mark takes the colour and a missed one stays hollow — and
     it is what keeps five circles in a row from reading as the deck's
     page dots, which are filled discs of the same family a few inches
     below. A second path for the outline would be a second thing to
     keep in step. */
  var RATE_DOT = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="8.8"/></svg>';

  function scPaintPat() {
    var pane = $('scPatPane');
    pane.textContent = '';
    var today = scDay();

    pane.appendChild(scRateRow(today, 'How was today?', scPaintPat));
    /* Yesterday only while it is unrated AND still open, so the row is
       a thing to catch rather than a second permanent control. Two
       days behind is inside the window too and is not offered: at
       that distance you are not remembering a day, you are guessing
       at one. */
    var y = scDayBack(1);
    if (scRateOf(y) === null && scTallyOpen(y)) {
      pane.appendChild(scRateRow(y, 'And yesterday?', scPaintPat));
    }

    var rank = scPatRank();
    if (rank.rated < PAT_FLOOR) {
      var left = PAT_FLOOR - rank.rated;
      pane.appendChild(scEl('p', 'pat-none', rank.rated
        ? 'Rate ' + left + (left === 1 ? ' more day' : ' more days')
          + ' and this starts reading. It needs both kinds to compare.'
        : 'Say how a day went and this fills in. It lines up everything '
          + 'you already log against the days you called good.'));
      return;
    }
    if (!rank.rows.length) {
      /* Rated enough days and still nothing to rank: every factor is
         lopsided — you kept everything, or logged one thing. Said as
         what is missing rather than as an error. */
      pane.appendChild(scEl('p', 'pat-none',
        'Nothing you log has enough days on both sides of it yet. It '
        + 'needs ' + PAT_SIDE + ' days with a thing and ' + PAT_SIDE
        + ' without.'));
      return;
    }

    /* ── THE SENTENCE ──
       The strongest thing in each direction, named. Never a
       manufactured claim about why: "is on your good days" is what
       the arithmetic actually found, and anything warmer than that is
       a sentence the data cannot pay for. */
    var up = null, dn = null;
    rank.rows.forEach(function (r) {
      if (r.lift > .05 && (!up || r.lift > up.lift)) up = r;
      if (r.lift < -.05 && (!dn || r.lift < dn.lift)) dn = r;
    });
    var say = scEl('p', 'pat-say');
    if (!up && !dn) {
      say.textContent = 'Nothing you log tells your days apart yet.';
    } else {
      if (up) {
        say.appendChild(scEl('b', null, up.n));
        say.appendChild(document.createTextNode(
          ' is on your good days more than anything else you log.'));
      }
      if (dn) {
        if (up) say.appendChild(document.createTextNode(' '));
        say.appendChild(scEl('b', null, dn.n));
        say.appendChild(document.createTextNode(' is on your rough ones.'));
      }
    }
    pane.appendChild(say);

    var gh = scEl('div', 'grp-h');
    gh.appendChild(scEl('span', 'pill', 'What moves a day, most first'));
    gh.appendChild(scEl('span', 'c', String(rank.rows.length)));
    pane.appendChild(gh);

    /* ── BOTH DIRECTIONS WEAR THE SAME COLOUR ──
       Which side of the zero line a bar is on is the whole of what
       says up or down, and it costs no contrast at all — the day-off
       dot's own argument. A red bar for the things on your rough days
       would be the one thing this app never does: colour saying
       whether. The number beside it carries the sign in words.

       Scaled against the LARGEST thing on your own list, not against
       a ceiling nobody set — the workouts ring's rule, for the same
       reason: the rows have to read against each other. */
    var most = Math.abs(rank.rows[0].lift) || 1;
    var list = scEl('ul', 'pat-list');
    rank.rows.forEach(function (r) {
      var li = scEl('li', 'pat-row');
      /* The glyph the thing already wears elsewhere: the tally's own
         for one of the five, the block's for a block. */
      var ic = r.item ? TALLY_ICON[r.item.id] : BLOCK_ICON[scIconFor(r.block)];
      li.insertAdjacentHTML('beforeend',
        '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (ic || '') + '</svg>');
      li.appendChild(scEl('span', 'pat-nm', r.n));
      var mid = scEl('span', 'pat-mid');
      mid.setAttribute('aria-hidden', 'true');
      li.appendChild(mid);
      /* ── THE SIGN COMES OFF THE ROUNDED FIGURE ──
         A lift of -0.04 is zero at one decimal place, and reading the
         sign off the raw number printed "−0.0" — a minus sign on
         nothing, which reads as a rendering fault rather than as a
         thing that makes no difference. Rounded first, and a zero
         wears no sign at all. */
      var fig = Math.abs(r.lift).toFixed(1);
      var nil = fig === '0.0';
      /* ── A ROW AT ZERO DRAWS NO BAR ──
         Scaled against the top of the list, a lift of .02 comes out
         about a pixel wide — a green speck sitting ON the axis, which
         made the axis look green on exactly the rows that have
         nothing to say. The figure beside it already reads 0.0, and
         an unbroken axis with nothing on it is what that looks like. */
      if (!nil) {
        var bar = scEl('span', 'pat-bar ' + (r.lift < 0 ? 'is-dn' : 'is-up'));
        bar.style.width = (Math.abs(r.lift) / most * 50).toFixed(2) + '%';
        mid.appendChild(bar);
      }
      li.appendChild(scEl('span', 'pat-n pill' + (r.lift >= .5 ? ' is-up' : ''),
        (nil ? '' : r.lift < 0 ? '−' : '+') + fig));
      /* Spoken as one sentence with its sample in it. The bar says
         nothing a screen reader can use and the bare figure says less
         — "+0.4" under a heading is a number about nothing. */
      li.setAttribute('aria-label', r.n + (nil
        ? ' makes no difference to a day'
        : ' moves a day ' + (r.lift < 0 ? 'down ' : 'up ') + fig)
        + ', from ' + r.yes + ' days with it and ' + r.no + ' without.');
      list.appendChild(li);
    });
    pane.appendChild(list);

    pane.appendChild(scEl('p', 'ty-foot',
      'From the ' + rank.rated + ' days you rated, out of the last twelve '
      + 'weeks. It says what your days have in common, never what caused '
      + 'what.'));
  }

  /* ═══════════════════════════════════════════════════════════
     THE INTRO

     Six cards on the first open, and the rule for what gets one is
     narrow: it has to be something you could not find by pressing
     around. A slide about the tab bar is a picture of the thing you
     are already looking at.

     Four of the six are genuinely invisible — a day card has a BACK,
     the add control takes a SENTENCE, a long press on a row ticks it,
     and Pattern is inert until you have rated some days. The other two
     are the shape of the week and the promise about where the data
     lives, and both are things you would otherwise have to be told by
     somebody.

     ── ONE MEANING PER CONTROL, AND NO HIDDEN THIRD STATE ──
     Continue advances; the last one starts the week. "Don't show
     again" leaves from any card. BOTH mark it seen, and Escape does
     what "Don't show again" does — a way out that quietly means "ask
     me tomorrow" is a third state nothing on screen tells you about,
     and a first-run screen that comes back after you dismissed it has
     stopped being an intro and become furniture.

     Which is affordable only because it is not lost: Settings carries
     "Show the intro" and it plays again from the top. Nothing here is
     a one-time gift.
     ═══════════════════════════════════════════════════════════ */

  var TOUR_KEY = 'sched.tour.v1';

  /* ── THE POINTER ──
     The objectives are the one thing in this app with no visible name
     anywhere: they live behind a pill in the corner of a card, and a
     sentence saying "top right" is a sentence you have to hold in your
     head while you go and look. So the card is DRAWN, at the
     proportions the real one has, with the pill lit in the accent and
     a ring round it. The picture is the instruction.

     Its rows are ruled lines rather than words. This is a diagram of
     WHERE something is, and legible text in it would invite reading
     the card instead of finding the corner.

     THE RING BLEEDS PAST THE CARD'S EDGE, and it has to. Centred on a
     pill that is itself in the corner, a ring big enough to clear the
     pill's own diagonal cannot also fit inside the card. Drawn small
     enough to fit it touches the pill and reads as a border on it
     rather than as a light around it, which is the one thing it is
     for. So the card is inset in the box and the halo is allowed out
     over the edge. */
  var TOUR_CARD = '<svg viewBox="0 0 168 116" class="tr-fig"'
    + ' role="img" aria-label="A day card, with the turn control in its'
    + ' top right corner">'
    /* the card itself, square, because every card in this app is */
    + '<rect x="8" y="14" width="152" height="92" fill="var(--g0)"'
    + ' stroke="var(--hair)" stroke-width="2"/>'
    /* the day name, top left, at the weight the real one wears */
    + '<rect x="20" y="26" width="44" height="8" rx="1" fill="var(--dim)"/>'
    /* two rows: the glyph gutter, then the time over the name */
    + '<g fill="var(--tick-off)">'
    + '<circle cx="27" cy="58" r="5"/>'
    + '<rect x="40" y="53" width="24" height="5" rx="1"/>'
    + '<rect x="40" y="62" width="62" height="6" rx="1"/>'
    + '<circle cx="27" cy="86" r="5"/>'
    + '<rect x="40" y="81" width="24" height="5" rx="1"/>'
    + '<rect x="40" y="90" width="48" height="6" rx="1"/>'
    + '</g>'
    /* and the corner it is about. The ring first and the pill over it,
       so the halo reads as light around the control rather than as a
       second object beside it. */
    + '<circle cx="139.5" cy="29.5" r="20" fill="none"'
    + ' stroke="var(--red)" stroke-width="2.4" opacity=".55"/>'
    + '<rect x="127" y="22" width="25" height="15" rx="7.5" fill="var(--red)"/>'
    + '</svg>';

  /* ── FOUR, AND THE COPY IS PLAIN ──
     It went in at six, in this file's own voice: "where today sits is
     itself information". That voice is right for the notes beside the
     code and wrong on a screen somebody reads once before they have
     any idea what the app is. A first open is not the place to be
     interesting. Two or three words on top, one plain sentence under
     it, and nothing clever in between.

     No dashes either. An aside set off mid-sentence is a second
     thought, and the whole job of these four cards is to have one
     thought each.

     ── AND NO TWO OF THEM MAY BE THE SAME CARD ──
     "Track your day" sat third, about holding a row to tick it off,
     and it was the first card again wearing a different verb: both of
     them were about the week and what you put on it. What replaced it
     is the only claim in the app that is not about the week at all,
     which is the record being read BACK to you.

     THE OBJECTIVES GO LAST because they are the one thing here nobody
     can find on their own, and the last card is the one still on
     screen when the intro ends. */
  var TOUR = [
    {
      k: 'week',
      t: 'Plan your week',
      s: 'Seven day cards. Add a block by typing it in plain words.',
      /* Three cards fanned. The front one is FILLED with the ground so
         it covers the one behind it: drawn as two outlines they cross,
         and the back card reads as a bracket rather than as a card. */
      i: '<rect x="10.4" y="4.2" width="11.4" height="16.6" rx="1.4"'
       + ' opacity=".42"/>'
       + '<rect x="2.6" y="6.8" width="12.8" height="14.6" rx="1.4"'
       + ' fill="var(--paper)"/>'
       + '<path d="M5.6 11.4h6.8M5.6 14.6h6.8M5.6 17.8h4"'
       + ' stroke-width="1.4"/>'
    },
    {
      k: 'pattern',
      t: 'It reads itself back',
      s: 'Rate how a day went and see what your best days have in '
       + 'common.',
      /* ── RANKED BARS OFF AN AXIS, AND IT IS NOT THE PANEL'S OWN
             SHAPE ──
         Pattern draws bars either side of a centre axis, because the
         side is what carries the direction. Drawn that way at 52px it
         does not read: the bar crossing the axis at its midpoint makes
         a plus sign, moving the crossing down makes a flag, and four
         bars close enough to fill the box merge into a blob. Three
         attempts, all rendered beside the other three glyphs, all
         worse than the ones next to them.

         So it is the panel's other true fact instead: bars ranked
         longest first off an axis at the side. That IS what the screen
         shows, it reads as a chart at a glance, and what it leaves out
         is a distinction nobody needs before they have seen the
         screen. It is the ten lift glyphs' lesson: when every honest
         drawing of a thing is illegible at the size it is drawn, draw
         a different true thing. */
      i: '<path d="M4.8 3.6v16.8" stroke-width="1.4" opacity=".6"/>'
       + '<path d="M4.8 8h14.6M4.8 13h10.4M4.8 18h6.2"'
       + ' stroke-width="2.8" stroke-linecap="butt"/>'
    },
    {
      k: 'friends',
      t: 'Compete with friends',
      s: 'Add a friend and see who shows up most. Nothing else leaves '
       + 'your phone.',
      /* The board's own crown, at the same silhouette, stroked rather
         than filled so it sits with the other three. */
      i: '<path d="M3 8.8l4.5 3.5L12 4.4l4.5 7.9L21 8.8L19.3 19H4.7L3 8.8z"/>'
    },
    {
      k: 'back',
      t: 'Flip for objectives',
      s: 'Each card has a back for the few things that really matter '
       + 'today.',
      fig: TOUR_CARD,
      /* The objectives mark the app already owns. Two glyphs for one
         subject is the app telling apart two things that are not. */
      i: 'OBJ'
    }
  ];

  var tourAt = 0;
  var tourFrom = null;      /* where the focus was before this took it */

  function scTourSeen() {
    try { return localStorage.getItem(TOUR_KEY) === '1'; } catch (e) { return true; }
  }
  /* Seen on the way OUT, whichever way you left. Written before the
     element goes, so a reload landing between the two cannot bring it
     back on a phone that has already read it. */
  function scTourSaw() {
    try { localStorage.setItem(TOUR_KEY, '1'); } catch (e) {}
  }

  function scTourClose() {
    scTourSaw();
    var el = $('scTour');
    el.hidden = true;
    el.textContent = '';
    document.body.style.overflow = '';
    if (tourFrom && tourFrom.focus) tourFrom.focus();
    tourFrom = null;
  }

  /* The track is laid out once and MOVED, never scrolled. That is the
     deck's own answer and it is here for the deck's own reasons: a
     scroll container clamps at 0, Safari drops trailing padding out of
     its scrollable width, and `flex: 0 0 max(...)` — a math function
     in a shorthand — can be thrown away by a parser without a word.
     A transform is the same number of pixels in every engine. */
  function scTourGo(i) {
    tourAt = Math.max(0, Math.min(TOUR.length - 1, i));
    var el = $('scTour');
    el.querySelector('.tr-track').style.transform =
      'translateX(' + (-tourAt * 100) + '%)';
    [].forEach.call(el.querySelectorAll('.tr-dot'), function (d, n) {
      d.classList.toggle('is-on', n === tourAt);
    });
    [].forEach.call(el.querySelectorAll('.tr-slide'), function (d, n) {
      /* Off-screen cards are taken out of the tab order and out of the
         accessibility tree. Left in, a keyboard tabs into a card that
         is 390px off the side and the focus ring goes with it. */
      d.setAttribute('aria-hidden', n === tourAt ? 'false' : 'true');
      d.inert = n !== tourAt;
    });
    /* Reached through the element rather than by id. It is built by
       scTourOpen, so an id fetch would be asking the markup for
       something the markup does not have — which tests/names.js
       refuses, and rightly: that is the shape of an id renamed out
       from under its reader.

       AND THE COMMENT CANNOT SPELL THE FETCH IT IS ABOUT. Written the
       obvious way, with the call quoted in prose, that check reads the
       comment and reports the very id this line exists to stop
       fetching. It is the CSS comment that broke the same rule by
       naming the close marker, one file over and in a different
       language. */
    el.querySelector('.tr-h').textContent = TOUR[tourAt].t;
    var go = el.querySelector('.tr-go');
    go.textContent = tourAt === TOUR.length - 1 ? 'Start the week' : 'Continue';
    el.querySelector('.tr-step').textContent =
      'Step ' + (tourAt + 1) + ' of ' + TOUR.length;
  }

  function scTourOpen() {
    var el = $('scTour');
    tourFrom = document.activeElement;
    el.textContent = '';

    /* The title lives OUTSIDE the track, so the dialog's accessible
       name is one node that changes rather than six that move. */
    var lbl = scEl('h2', 'tr-h', TOUR[0].t);
    lbl.id = 'scTourTitle';
    el.appendChild(lbl);

    var win = scEl('div', 'tr-win');
    var track = scEl('div', 'tr-track');
    TOUR.forEach(function (c) {
      var s = scEl('section', 'tr-slide');
      s.dataset.card = c.k;
      var ic = scEl('div', 'tr-ic');
      ic.insertAdjacentHTML('beforeend', c.i === 'OBJ' ? OBJ_MARK
        : '<svg viewBox="0 0 24 24" aria-hidden="true">' + c.i + '</svg>');
      s.appendChild(ic);
      /* The heading is repeated inside the card and hidden from a
         screen reader: the dialog's own label already says it, and
         hearing the title twice on every step is the duplication this
         project keeps taking back out. */
      var t = scEl('h3', 'tr-t', c.t);
      t.setAttribute('aria-hidden', 'true');
      s.appendChild(t);
      s.appendChild(scEl('p', 'tr-s', c.s));
      if (c.fig) s.insertAdjacentHTML('beforeend', c.fig);
      track.appendChild(s);
    });
    win.appendChild(track);
    el.appendChild(win);

    var dots = scEl('div', 'tr-dots');
    dots.setAttribute('aria-hidden', 'true');
    TOUR.forEach(function (c, n) {
      var d = scEl('i', 'tr-dot');
      d.addEventListener('click', function () { scTourGo(n); });
      dots.appendChild(d);
    });
    el.appendChild(dots);

    var foot = scEl('div', 'tr-foot');
    /* Spoken, never drawn: the dots say it to an eye and this says it
       to a screen reader, which is one fact told twice to two people
       rather than twice to one. */
    foot.appendChild(scEl('span', 'tr-step'));

    var go = scEl('button', 'btn go tr-go', 'Continue');
    go.type = 'button';
    go.addEventListener('click', function () {
      if (tourAt === TOUR.length - 1) scTourClose(); else scTourGo(tourAt + 1);
    });
    foot.appendChild(go);

    var skip = scEl('button', 'tr-skip', 'Don’t show again');
    skip.type = 'button';
    skip.addEventListener('click', scTourClose);
    foot.appendChild(skip);
    el.appendChild(foot);

    /* A swipe, with the move guard the week's long press needed: a
       drag that began on a card and travelled ten pixels is a swipe,
       and anything under that is a press that happened to wobble. */
    var x0 = null;
    win.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    win.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 40) return;
      scTourGo(tourAt + (dx < 0 ? 1 : -1));
    });
    win.addEventListener('pointercancel', function () { x0 = null; });

    el.hidden = false;
    document.body.style.overflow = 'hidden';
    tourAt = 0;
    scTourGo(0);
    el.focus();
  }

  document.addEventListener('keydown', function (e) {
    if ($('scTour').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); scTourClose(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); scTourGo(tourAt + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); scTourGo(tourAt - 1); }
  });

  /* ── THE STOP ──
     Its own key, like the friends board's: which half of a screen you
     were last on is a preference about looking at the record, and
     folding it into the record is how a damaged record takes the other
     down.

     A STORED STOP HAS TO FALL THROUGH. The key outlives the code that
     wrote it, so a value naming a pane this build no longer has is the
     first one — the same rule sched.view.v1 already keeps, and the
     reason the list is written out rather than trusted. */
  var TYSTOP_KEY = 'sched.ty.v1';
  var TYSTOPS = ['up', 'work', 'pat'];
  var tyStop = 'up';

  function scTyStop(v, save) {
    tyStop = TYSTOPS.indexOf(v) < 0 ? 'up' : v;
    $('scTyPane').hidden = tyStop !== 'up';
    $('scWorkPane').hidden = tyStop !== 'work';
    $('scPatPane').hidden = tyStop !== 'pat';
    [].forEach.call(document.querySelectorAll('[data-tystop]'), function (t) {
      var on = t.dataset.tystop === tyStop;
      t.classList.toggle('on', on);
      t.setAttribute('aria-current', on ? 'true' : 'false');
    });
    if (tyStop === 'work') scPaintWork();
    if (tyStop === 'pat') scPaintPat();
    if (save) { try { localStorage.setItem(TYSTOP_KEY, tyStop); } catch (e) {} }
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
      /* ── THIS DAY, AS AGAINST EVERY OTHER ONE LIKE IT ──
         Everything above edits the block for every week there will
         ever be. Everything here is about ONE date: whether it
         happened, whether it was on at all, and what it was.

         Two resolvers, because the two records reach different days.
         Done is filed against the last date this weekday was, inside
         the backfill window — you cannot mark something done before it
         happens. Off is a fact about the card you are looking at, so
         it uses the deck's own Monday-first week and reaches forward
         without limit. Reading Off through the backfill resolver would
         put Friday's day off on today's card, which is the objectives'
         own bug written a second time. */
      if (!isNew) {
        var bDay = scDowDate(day);
        var oDay = scObjDay(day);
        var canDone = !!bDay && scTallyOpen(bDay);
        var canOff = scOffOpen(oDay);
        if (canDone || canOff) body.appendChild(scEl('span', 'label', 'This day'));

        /* ── the other direction ──
           The tally ticks Train and the week agrees. This is the same
           edge walked the other way: finish the block here and the item
           ticks. It lives in the editor rather than on the row because
           the row IS a button and a button inside a button is invalid —
           the same trap the folding panels have a rule about.

           EVERY BLOCK NOW, not only the three that feed one of the five.
           The restriction was written when the measure filling solid was
           the only mark a done block had, and the measure existed to
           agree with the tally — so a "done" on Trading really was a
           state nothing on the screen would draw. The row draws a tick
           for ANY done block now, so there is no longer a reason to
           refuse it for Trading, Work or Wake.

           The day still has to be open for backfill. That rule is about
           not filling in a fortnight on a Sunday night, which has
           nothing to do with which item a block feeds, and it stays. */
        if (canDone) {
          var done = !!(blockLog[bDay] && blockLog[bDay][item.id]);
          var fed = scItemsFor(item.n).map(function (x) { return x.n; }).join(' and ');
          /* A TOGGLE, not a third action. As an scBtn it carried
             flex:1, which does nothing outside a flex parent, so it sat
             156px wide above two 172px buttons — visibly failing to
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
            if (done) scTrainSet(bDay, item.id, '');
            scClose();
            if (view === 'tally') scPaintTally(); else scRender();
            if (!done && scIsTrain(item)) { scTrainAsk(item, day, bDay); return; }
            /* Only name what it fed when it fed something. Dropping the
               gate without this leaves "Counted toward " with nothing
               after it on every block that feeds nothing. */
            scToast(done ? 'Unmarked'
              : fed ? 'Counted toward ' + fed : 'Marked done', false);
          });
          body.appendChild(tog);
        }

        /* ── AND THE OPPOSITE CLAIM, DIRECTLY UNDER IT ──
           Done says the block happened; off says it was never on. Same
           grain — one block, one date — so it is the same control
           twice, under the same heading, and setting either clears the
           other. It went in below the workout picker once and read as
           a second thing to train, because the heading above it said
           TRAINED. A control's heading is part of what it says. */
        if (canOff) {
          var isOff = scOff(oDay, item.id);
          var otog = scEl('button', 'mark mark-off' + (isOff ? ' is-on' : ''));
          otog.type = 'button';
          otog.appendChild(document.createTextNode('Off this day'));
          /* A BAR, NOT A TICK. Every tick in this app is the accent and
             they all say one thing — this happened. A day off is the
             only state on this screen that is not a claim about doing
             anything, so it takes neither the mark nor the colour. */
          otog.insertAdjacentHTML('beforeend',
            '<svg viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M5 12h14"/></svg>');
          otog.setAttribute('aria-pressed', isOff ? 'true' : 'false');
          otog.addEventListener('click', function () {
            scSetOff(oDay, item, day, !isOff);
            if (!isOff) scTrainSet(oDay, item.id, '');
            scClose();
            if (view === 'tally') scPaintTally(); else scRender();
            scToast(isOff ? 'Back on' : 'Off for the day', false);
          });
          body.appendChild(otog);
        }

        /* ── the deck's OTHER door, and it is the one that matters ──
           The row opens it on a long press, which reaches neither a
           keyboard nor a screen reader — the same split the tick
           itself has. This is where the feature actually lives; the
           press is a shortcut from the row it is about.

           Only on a block the app already calls training, and only
           on a day open for backfill, because both of those are
           conditions on the tick this record hangs off. */
        if (canDone && scIsTrain(item)) {
          var gr = scTrainOf(bDay, item.id);
          var got = gr && scWorkName(gr.k);
          var wob = scEl('button', 'mark' + (got ? ' is-on' : ''));
          wob.type = 'button';
          wob.appendChild(document.createTextNode(got || 'Pick a workout'));
          wob.insertAdjacentHTML('beforeend',
            '<svg viewBox="0 0 24 24" aria-hidden="true">'
            + '<path d="M9 5.5l6.5 6.5L9 18.5"/></svg>');
          wob.addEventListener('click', function () {
            scTrainAsk(item, day, bDay);
          });
          body.appendChild(scEl('span', 'label', 'Trained'));
          body.appendChild(wob);
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

     THE FACE IS DERIVED, NOT STORED. It is your accent with the
     colour the app already draws ON that accent on top, so turning
     the wheel turns your face and there is nothing to keep in step.
     It also cannot fail a contrast check: accent-against-on-accent is
     the pairing the accent solver is built around, and the worst of
     the 360 is 5.8:1.

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
        ? 'Yours now, and the face your accent gives you if you take it away.'
        : 'Your accent draws this. Turn the wheel and it turns with you.'));

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
      pl.appendChild(scEl('span', 'sub-note', myPic ? 'A photo' : 'Drawn from your accent'));
      pr.appendChild(pl);
      pr.addEventListener('click', scPicSheet);
      body.appendChild(pr);

      /* ── THE WHEEL ──
         Thirteen chips became a circle, and the circle is not a
         decoration on the same idea: a list can only offer what
         somebody put on it, and there was never a reason your colour
         had to be one of thirteen.

         IT IS DRAWN FROM THE SOLVED ACCENTS, NOT FROM HUE. A conic
         gradient of raw hues would show you a bright blue at the
         bottom and hand you the pale one the floor actually produces,
         which is a control that lies about its own output. Thirty-six
         stops, each of them the exact colour that angle gives — so
         what you press is what you get, and the wheel is a photograph
         of the setting rather than a diagram of colour.

         The middle is the PAGE, with the accent on it at the size a
         thumb is: the pairing is the thing being chosen, and a swatch
         beside the page rather than on it lets you judge the colour
         without judging the combination. It needs no JavaScript at
         all — it is the same three washes the body has, off the same
         tokens, so it repaints itself the instant scPaint writes. */
      /* ── LIGHT, DARK, OR THE PHONE'S ──
         Three chips, one lit. 'Auto' is the default and follows the
         system; the other two pin a face. Above the wheel, because the
         wheel's own middle is drawn off the live tokens and repaints
         the moment a chip is pressed — you see the accent on the face
         you just chose. */
      var mlab = scEl('span', 'label', 'Theme');
      mlab.style.marginTop = '2px';
      body.appendChild(mlab);
      var mrow = scEl('div', 'lg-row');
      [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].forEach(function (pair) {
        var ch = scEl('button', 'lg-c' + (mode === pair[0] ? ' on' : ''), pair[1]);
        ch.type = 'button';
        ch.dataset.mode = pair[0];
        ch.setAttribute('aria-pressed', mode === pair[0] ? 'true' : 'false');
        ch.addEventListener('click', function () {
          scSetMode(pair[0]);
          [].forEach.call(mrow.children, function (c) {
            var on = c.dataset.mode === mode;
            c.classList.toggle('on', on);
            c.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
        });
        mrow.appendChild(ch);
      });
      body.appendChild(mrow);

      var lab = scEl('span', 'label', 'Accent');
      lab.style.marginTop = '14px';
      body.appendChild(lab);

      var wrap = scEl('div', 'cw-wrap');
      var wheel = scEl('div', 'cw');
      var stops = [];
      for (var wi = 0; wi <= 36; wi++) {
        stops.push(scHex(scAccentRGB(wi * 10)) + ' ' + (wi * 10) + 'deg');
      }
      /* from -90deg? No: a conic gradient already starts at twelve
         o'clock, which is where hue 0 goes, and runs clockwise, which
         is the direction the knob's own arithmetic runs. Turning it
         would put two conventions in one control. */
      wheel.style.background = 'conic-gradient(' + stops.join(',') + ')';
      var mid = scEl('i', 'cw-mid');
      var knob = scEl('i', 'cw-k');
      knob.setAttribute('aria-hidden', 'true');
      wheel.appendChild(mid);
      wheel.appendChild(knob);
      wheel.tabIndex = 0;
      wheel.setAttribute('role', 'slider');
      wheel.setAttribute('aria-label', 'Accent colour');
      wheel.setAttribute('aria-valuemin', '0');
      wheel.setAttribute('aria-valuemax', '359');

      var hint = scEl('p', 'hint');
      hint.style.marginTop = '2px';

      /* The hex and its measured contrast, because those are the two
         things about this choice the picture cannot show you. The old
         hint named the palette and the worst type on it; with one
         ground the worst type never moves, so the number worth
         printing is the accent's own. */
      var say = function () {
        var v = scAccentRGB(hue);
        wheel.setAttribute('aria-valuenow', String(hue));
        wheel.setAttribute('aria-valuetext', scHex(v)
          + (hue === HUE0 ? ', the one it ships with' : ''));
        knob.style.transform = 'rotate(' + hue + 'deg) translateY(-72px)';
        hint.textContent = scHex(v) + ' · '
          + (Math.round(scRatio(v, scModeLive() === 'light' ? LIGHT_GROUND : GROUND) * 10) / 10)
          + ':1 against the page'
          + (hue === HUE0 ? ' · the one it ships with' : '');
      };
      /* Painted on every move and SAVED on the way up. A drag across
         the whole circle is three hundred pointermoves, and a write
         and a push on each of them is a write and a push you did not
         ask for — the colour you meant is the one your thumb stopped
         on. */
      var set = function (h, save) { scPaint(h, save); say(); };

      var at = function (e) {
        var r = wheel.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      };
      var drag = false;
      wheel.addEventListener('pointerdown', function (e) {
        drag = true;
        wheel.setPointerCapture(e.pointerId);
        set(at(e), false);
        e.preventDefault();
      });
      wheel.addEventListener('pointermove', function (e) {
        if (drag) set(at(e), false);
      });
      var up = function () { if (drag) { drag = false; set(hue, true); } };
      wheel.addEventListener('pointerup', up);
      wheel.addEventListener('pointercancel', up);
      /* A step of one degree is a step nobody can see, and 360 presses
         to cross the wheel is not a keyboard route — it is the
         appearance of one. Five, and fifteen with Page. */
      wheel.addEventListener('keydown', function (e) {
        var k = e.key, d = 0;
        if (k === 'ArrowRight' || k === 'ArrowUp') d = 5;
        else if (k === 'ArrowLeft' || k === 'ArrowDown') d = -5;
        else if (k === 'PageUp') d = 15;
        else if (k === 'PageDown') d = -15;
        else if (k === 'Home') { set(HUE0, true); e.preventDefault(); return; }
        if (!d) return;
        e.preventDefault();
        set((hue + d + 360) % 360, true);
      });

      wrap.appendChild(wheel);
      body.appendChild(wrap);
      say();
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
      /* Never lost. The intro marks itself seen whichever way you
         leave it, which is only affordable because it plays again
         from here — a first-run screen you can destroy in one press
         and never get back is a one-time gift, and this app does not
         give any others. */
      item('Show the intro', 'Six cards on what this app does', '', function () {
        scClose();
        scTourOpen();
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
     it in rather than flashing the list on the way to it. A bad
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
  scTrainLoad();
  scRateLoad();

  try {
    var fs2 = localStorage.getItem(FRSTOP_KEY);
    if (fs2 === 'board' || fs2 === 'feed') frStop = fs2;
    var ts2 = localStorage.getItem(TYSTOP_KEY);
    if (TYSTOPS.indexOf(ts2) >= 0) tyStop = ts2;
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
    var saved = localStorage.getItem(ACCENT_KEY);
    if (saved === null) {
      /* Once, and the old key is spent: a palette name resolves to an
         angle, and an angle is not something to keep resolving. Saved
         under the new key immediately, so this runs on exactly one
         boot per browser rather than on every one of them. */
      var old = localStorage.getItem(THEME_KEY);
      if (old && WAS[old] !== undefined) saved = String(WAS[old]);
      if (old) localStorage.removeItem(THEME_KEY);
      if (saved !== null) localStorage.setItem(ACCENT_KEY, saved);
    }
    /* The mode before the paint, and the paint ALWAYS: with two faces
       the stylesheet's :root can only carry one of them, and a page
       that opens on the other has to be written inline before the
       first render or the light face flashes dark. */
    var sm = localStorage.getItem(MODE_KEY);
    mode = sm === 'light' || sm === 'dark' ? sm : 'auto';
    scPaint(saved !== null ? saved : HUE0, false);
  } catch (e) { scPaint(HUE0, false); }

  scRender();
  scSetView(view, false);

  [].forEach.call(document.querySelectorAll('.tab[data-view]'), function (t) {
    t.addEventListener('click', function () { scSetView(t.dataset.view, true); });
  });
  [].forEach.call(document.querySelectorAll('[data-tystop]'), function (t) {
    t.addEventListener('click', function () { scTyStop(t.dataset.tystop, true); });
  });

  /* ── SCOPED BY THE DATA ATTRIBUTE, NOT BY THE CLASS ──
     Today's two stops wear .fr-stop as well, because they are the same
     control and a second set of classes drawn to look identical is two
     places to keep one thing in step. So this selector claimed them
     too: pressing Workouts also ran scFrStop with an undefined stop,
     which fell through to 'board' and cleared aria-current from every
     .fr-stop on the page — including the one you had just pressed. The
     panes still switched, so the only visible symptom was a screen
     reader being told nothing was current. */
  [].forEach.call(document.querySelectorAll('[data-stop]'), function (t) {
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

  /* ── LAST, AND AFTER THE FIRST PAINT ──
     The intro is a screen ABOUT the app, so the app has to be there
     behind it — opened before scPaintView the week is not built yet,
     and the card that says "press a day to open it" is sitting over an
     empty frame. It also has to come after scLive, which is what marks
     the rows behind you: a first open that flashed an unpainted page
     for a frame before covering it is worse than one that never showed
     it at all. */
  if (!scTourSeen()) scTourOpen();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
