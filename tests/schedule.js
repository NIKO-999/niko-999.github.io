/* ═══════════════════════════════════════════════════════════════
   SCHEDULE — the poster, the sentence, and the promise.

   This app shares nothing with the rest of the site, so nothing else
   in the suite covers a line of it. Three things are worth measuring
   and are measured here rather than looked at:

     · the CONTRAST. Type from 9px up on paper. The design this was
       drawn from set finished blocks at #b4b4b4 and times at #8c8c8c,
       which measure 2.0:1 and 3.2:1 on white — both look right in a
       picture and neither is readable. The check samples composited
       pixels and is polarity-agnostic, because this app has been
       light and dark and may be again.
     · the PARSER. A table of sentences with the answer written down,
       driven through the field a thumb actually types into.
     · that NOTHING LEAVES. The whole claim of the app is that a
       spoken sentence becomes a block on the sheet without a server.
       That is not a design note, it is an assertion: every request
       the page makes is counted, and one to somewhere else fails the
       run. It is what refuses a model or an API key added later to
       make the parser cleverer.
   ═══════════════════════════════════════════════════════════════ */
const { open, BASE } = require('./lib.js');

/* ── OPENING THE OBJECTIVES THE WAY A PERSON DOES ──
   There is no control in the head any more: the row on the day is the
   whole of the access, and which press opens it depends on what is on
   the day. An empty day draws a ghost card and pressing it goes
   straight to the sheet with the field on it; a day with objectives
   opens on a DOUBLE tap, which is the week row's own gesture and
   Showing up's own gesture.

   Fired as two synchronous clicks rather than through `dblclick`,
   because scDoubleTap is a 260ms timer on the element and two clicks
   in one task is exactly what it is waiting for — and because this
   has to work on whichever page object the caller is holding. */
const openObj = async (pg) => {
  await pg.evaluate(() => {
    const g = document.querySelector('.obs-c.is-ghost');
    if (g) { g.click(); return; }
    const c = document.querySelector('.obs-c');
    if (c) { c.click(); c.click(); }
  });
  await pg.waitForTimeout(560);
};

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

/* WCAG contrast off a composited screenshot pixel — the colour the eye
   actually receives, after the ground, the card and any wash over it
   have had their turn. Reading the CSS proves only what was typed. */
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + .05) / (y + .05);
};

/* CIE Lab distance. Comparing two hexes tells you they differ; it does
   not tell you a person can see the difference, and this repo already
   measures a palette this way on the habits screen for exactly that
   reason. Twelve is the floor used there. */
const toLab = (rgb) => {
  const f = (c) => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  const [r, g, b] = rgb.map(f);
  const g2 = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const X = g2((.4124 * r + .3576 * g + .1805 * b) / .95047);
  const Y = g2(.2126 * r + .7152 * g + .0722 * b);
  const Z = g2((.0193 * r + .1192 * g + .9505 * b) / 1.08883);
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
};
const deltaE = (a, b) => {
  const [A, B] = [toLab(a), toLab(b)];
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

/* A phone, and a real one — the app has no other layout.

   THE LOCALE IS PINNED, and that is not tidiness. Every printed time
   now follows the phone's own clock, so an unpinned context measures
   whatever machine the suite is on: the same assertion reads
   "09:00–11:00" here and "9:00–11:00 AM" on a box set to en-US, and
   the one that fails is the machine rather than the app. en-GB is
   24-hour, which is what the person this is built for uses. The
   12-hour half is measured on its own context further down. */
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
  /* THE PHONE IS DARK. The app follows the device, and Playwright's
     device is light unless told otherwise — so without this every
     pixel measurement below was taken on the light face while every
     figure in it was written for the dark one. The light face is
     measured on its own context at the foot of the file. */
  colorScheme: 'dark',
  isMobile: true, hasTouch: true, locale: 'en-GB' };

/* ── A FIXED JACKET IS NOT A REQUEST ABOUT YOU ──
   Mind's Popular list is six lines written into the app: the same six
   on every phone, chosen before anybody opened it. Its covers
   therefore carry nothing — an ISBN typed into this repo, and a list
   of numeric show ids — where a SEARCH carries the one thing that is
   yours, which is what you typed.

   So every off-origin check in this file allows these two exact
   SHAPES and nothing else. Never a HOST: openlibrary.org serves the
   search and covers.openlibrary.org serves the jackets, so "it went
   to Open Library" would wave through the request those checks exist
   to catch. An id list of digits and commas cannot smuggle a title. */
const ART = [
  /^https:\/\/covers\.openlibrary\.org\/b\/isbn\/[0-9Xx]{10,13}-M\.jpg\?default=false$/,
  /^https:\/\/itunes\.apple\.com\/lookup\?id=[0-9,]+$/,
];
const isArt = (u) => ART.some((r) => r.test(u));

/* A 1x1 gif, so a jacket that loads logs no console error. The egress
   here is blocked outright, and a blocked image is a fact about this
   sandbox rather than about the app — page.on('request') still records
   the URL, so the off-origin checks see it either way. */
const GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
const jackets = (pg) => pg.route('https://covers.openlibrary.org/**',
  (r) => r.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));

/* Sentence in, day out. Every row here is something you would actually
   say at a phone about your own day; the awkward ones are the point —
   no meridiem at all, a spelled-out time, several days at once, a
   place that is a word rather than a code. */
const SAID = [
  ['Train every day 6:30 to 7:30 at the gym',
    { days: 'MON TUE WED THU FRI SAT SUN', name: 'Train', s: '06:30', e: '07:30', room: 'Gym' }],
  ['Add Walk on Monday and Wednesday from 7:45 to 8:30',
    { days: 'MON WED', name: 'Walk', s: '07:45', e: '08:30', room: '' }],
  /* No meridiem anywhere, and both readings are legal English. An
     afternoon block is the only sane one, and nothing in the sentence
     says so — the scoring does. */
  ['Admin Monday 1:30 to 3',
    { days: 'MON', name: 'Admin', s: '13:30', e: '15:00', room: '' }],
  ['Trading weekdays 9 to 10:30',
    { days: 'MON TUE WED THU FRI', name: 'Trading', s: '09:00', e: '10:30', room: '' }],
  ['Shift Friday 12 to 3 PM in the shop',
    { days: 'FRI', name: 'Shift', s: '12:00', e: '15:00', room: 'Shop' }],
  ['I have football on Saturday from three to four',
    { days: 'SAT', name: 'Football', s: '15:00', e: '16:00', room: '' }],
  ['put Meal prep on Sunday at half past one for 90 minutes',
    { days: 'SUN', name: 'Meal Prep', s: '13:30', e: '15:00', room: '' }],
  ['schedule Physio every Tuesday at 8 for 2 hours',
    { days: 'TUE', name: 'Physio', s: '08:00', e: '10:00', room: '' }],
  /* "weekends" set the days AND stayed in the name, so the same bug
     shipped a block called "Long walk weekends" twice over. */
  ['Long walk weekends 10 to 11',
    { days: 'SAT SUN', name: 'Long Walk', s: '10:00', e: '11:00', room: '' }],
  /* The filler list must not eat a word that is part of the name. */
  ['Back to back calls Monday 8 to 9',
    { days: 'MON', name: 'Back to Back Calls', s: '08:00', e: '09:00', room: '' }],
  ['Read tues 9 to 1030',
    { days: 'TUE', name: 'Read', s: '09:00', e: '10:30', room: '' }],
  ['Stretch Friday eight thirty to ten',
    { days: 'FRI', name: 'Stretch', s: '08:30', e: '10:00', room: '' }],
];

(async () => {
  const { browser, page, errs } = await open(PHONE);
  await jackets(page);

  /* Speech is a browser service that headless Chromium cannot run, and
     leaving it defined means the sheet opens listening and errors half
     a second later. Deleting it drives the typed path instead — which
     is the same parser, reached the same way. */
  await page.addInitScript(() => {
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;
  });

  /* ── the week these assertions were written against ──
     This used to be the app's own SEED, and it was one person's real
     week: a shift pattern, trading hours, the lot. It made a fine
     fixture and a terrible default — every stranger sent the link
     opened it and found somebody else's life filled in — so the app
     ships a generic starter now and the specific week lives here, which
     is where a fixture belongs.

     Everything below still measures against it: 47 blocks, a Walk that
     feeds Mind, a Trading that feeds nothing, a Work shift long enough
     to prove a range prints, and a Tuesday with no shift on it. Ids are
     left off on purpose — scClean fills them in, so this also exercises
     the repair path on every run. */
  const WEEK = {
    title: 'Daily Process',
    sub: 'Up at 5:45 · down at 22:45',
    items: [].concat(
      [0, 1, 2, 3, 4, 5, 6].reduce((all, d) => all.concat([
        { d, s: 345, e: 375, r: '', n: 'Wake' },
        { d, s: 390, e: 450, r: '', n: 'Train' },
        { d, s: 465, e: 510, r: '', n: 'Walk' },
        { d, s: 1365, e: 1380, r: '', n: 'Down' },
      ]), []),
      [{ d: 0, s: 540, e: 630, r: '', n: 'Trading' },
       { d: 1, s: 540, e: 630, r: '', n: 'Trading' },
       { d: 2, s: 540, e: 660, r: '', n: 'Trading' },
       { d: 3, s: 540, e: 660, r: '', n: 'Trading' },
       { d: 4, s: 540, e: 630, r: '', n: 'Trading' },
       { d: 5, s: 525, e: 585, r: '', n: 'Trading' },
       { d: 6, s: 525, e: 585, r: '', n: 'Trading' }],
      [{ d: 0, s: 660, e: 1020, r: '', n: 'Work' },
       { d: 1, s: 780, e: 1260, r: '', n: 'Work' },
       { d: 4, s: 720, e: 1320, r: '', n: 'Work' },
       { d: 5, s: 600, e: 1080, r: '', n: 'Work' },
       { d: 6, s: 600, e: 1080, r: '', n: 'Work' }],
      [{ d: 0, s: 1275, e: 1305, r: '', n: 'Read' },
       { d: 1, s: 1275, e: 1305, r: '', n: 'Read' },
       { d: 2, s: 1275, e: 1305, r: '', n: 'Read' },
       { d: 3, s: 1275, e: 1305, r: '', n: 'Read' },
       { d: 4, s: 1320, e: 1350, r: '', n: 'Read' },
       { d: 5, s: 1275, e: 1305, r: '', n: 'Read' },
       { d: 6, s: 1275, e: 1305, r: '', n: 'Read' }]
    ),
  };
  /* ── this page is pointed AWAY from the real server ──
     The app now carries the address of a live worker and claims a code
     the moment the Friends tab is opened. This page visits that tab
     several times, so without this it would create a record on a real
     server on every run — which it did, once, before this line existed.

     Same-origin on purpose rather than a blocked host: the claim 404s,
     friends stays off, and the "nothing leaves this origin" count below
     stays exactly as strict as it was. The friends half is exercised on
     its own page further down, against a worker running in this
     process. */
  await page.addInitScript(([w, nowhere]) => {
    if (!localStorage.getItem('sched.v1')) {
      localStorage.setItem('sched.v1', JSON.stringify(w));
    }
    if (!localStorage.getItem('sched.net.v1')) {
      localStorage.setItem('sched.net.v1', JSON.stringify({
        url: nowhere, code: '', key: '', name: '', pic: '', on: false }));
    }
    /* ── THE INTRO IS MARKED SEEN FOR EVERY OTHER SECTION ──
       It opens over the whole app on a first visit, which is every
       fresh context this file makes, and it is a full-screen surface
       at z-index 70. Left unset, every assertion below that presses
       anything would be pressing the intro. The section that is
       actually about it clears this key on its own page.

       Seeded only when ABSENT, like the two above: an init script runs
       on every navigation, and written unconditionally it would put
       the key back between a test clearing it and the reload that
       test is making. That exact bug cost four hundred lines of
       chasing once already. */
    if (!localStorage.getItem('sched.tour.v1')) {
      localStorage.setItem('sched.tour.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
    }
  }, [WEEK, `${BASE}/schedule/nofriends`]);
  /* Answered here rather than left to the static server, and answered
     with 200. Left to the server a POST gets 405; answered with 404 it
     is still a failed fetch, and Chromium logs any failed fetch as a
     console error — which the last assertion in this file counts, and
     which carries no URL in its text, so it cannot be filtered by path
     either. A 200 makes the claim succeed against a stand-in, so this
     page also exercises the board in its ON state rather than only its
     failure state. The real worker is exercised properly further down,
     against the actual worker file running in this process. */
  await page.route(`${BASE}/schedule/nofriends/**`, (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: '{"ok":true}' }));

  /* ── every request, counted ── */
  const asked = [];
  page.on('request', (r) => asked.push(r.url()));

  await page.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });

  console.log('\n── the poster ──');

  /* ── ONE DAY, AND THE WEEK IS A STRIP ──
     Seven cards on a track is gone. What is asserted now is what
     replaced it: seven chips Monday first, the one you are on marked,
     today marked separately, and the day drawn in full underneath. */
  const SEEDED = 47;
  ok('it opens on today, drawn in full',
    await page.$$eval('.row[data-id]', (r) => r.length)
      === await page.evaluate((d) => JSON.parse(localStorage.getItem('sched.v1'))
        .items.filter((i) => i.d === d).length, new Date().getDay()));
  const ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
  const from = new Date().getDay();
  /* MONDAY FIRST, and it is the deck's own reason kept: a strip that
     began on today would move every morning, so the week would have no
     shape to remember and Thursday would sit somewhere different each
     time you looked. Where today sits is itself information. */
  ok('the week is Monday first, whatever day it is',
    await page.$$eval('.st-d b', (n) => n.map((x) => x.textContent).join(' '))
      === [1, 2, 3, 4, 5, 6, 0].map((d) => ABBR[d]).join(' '));
  ok('...with today the chip that is on, and the day it draws',
    (await page.$$eval('.st-d.is-on', (d) => d.map((x) => +x.dataset.d)))
      .join() === String(from)
    && await page.$eval('#scHdDay', (e) => e.textContent) === FULL[from]);
  ok('...and every day has a chip, including one you have cleared',
    await page.$$eval('.st-d', (d) => d.length) === 7);

  /* ── side by side means the same box ──
     Within a card, the times are one column and the names are another.
     Sized per ROW instead of per CARD they step in and out by a few
     pixels down the card, which reads as a wobble because it is one.

     MEASURED ON A DAY THAT IS NOT TODAY, and that is not tidiness. A
     finished block draws no time, `is-past` is set on today's card
     alone, and a shut card draws no rows at all — so the only card
     that can supply a column is today's, and only while it still has
     un-elapsed blocks on it. Run at 23:00 there are none, every list
     comes back empty, and the check fails on the CLOCK rather than on
     the layout. Its own comment warns about exactly this shape and it
     was still standing in it. Another day's card has no past rows by
     construction, at any hour. */
  /* Dispatched rather than pressed: the deck is a window over a track,
     so a card two days out is clipped and a real click waits forever
     for it to become visible. What is being measured is the layout of
     an open card, not the reachability of a shut one — the press
     target has its own check further down. */
  await page.evaluate(() => document.querySelector('.st-d:not(.is-on)').click());
  await page.waitForTimeout(460);
  const cols = await page.$$eval('.day-card', (cards) => cards.map((c) => {
    const rows = [...c.querySelectorAll('.row[data-id]')];
    const edge = (sel, side) => rows.map((r) => Math.round(r.querySelector(sel).getBoundingClientRect()[side]));
    /* The TIMES are read off the rows that draw one. A finished block
       has none, and a box that is not drawn reports 0 — so on today's
       card, at any hour with a block behind it, this was comparing
       nothing against a real column. It passed for months because the
       clock had to be inside the right window for a row to be past AND
       for this file to reach here, which is exactly the shape of a
       check that only sometimes runs. The NAMES stay every row. */
    const shown = rows.map((r) => r.querySelector('.t').getClientRects().length > 0);
    return { t: edge('.t', 'right').filter((v, i) => shown[i]), n: edge('.n', 'left') };
  }));
  /* `<= 1` and then a card that actually HAS times: a shut card draws
     none, so it now contributes an empty list rather than a column of
     zeros, and `=== 1` fails on the empty one while `<= 1` alone would
     pass on a screen with no times drawn anywhere. */
  ok('the times in a card share one right edge',
    cols.every((c) => new Set(c.t).size <= 1)
    && cols.some((c) => c.t.length > 1), cols.map((c) => c.t));
  ok('and the names share one left edge',
    cols.every((c) => new Set(c.n).size === 1), cols.map((c) => c.n));
  /* Back to today, so nothing below reads a week left where this
     found it. */
  await page.evaluate(() => [...document.querySelectorAll('.st-d')]
    .find((b) => +b.dataset.d === new Date().getDay()).click());
  await page.waitForTimeout(460);

  /* The place rides INSIDE the name rather than taking a column of
     its own, so an empty one costs nothing and there is no track to
     collapse. Both branches are checked; the second one is added
     further down, after a block with a place has been spoken in. */
  ok('no block starts with a place, and none is drawn',
    await page.$$eval('.row .n em', (e) => e.length) === 0);

  /* ── the measure is gone, and the row still says how long ──
     It was a rule as long as the block is, and it had three assertions
     here holding it to being ordered by duration rather than merely
     drawn. What replaced it is not another mark: the row PRINTS the
     fact in words rather than in a bar.

     The FORM of the printing moved with the gutter. It was the whole
     range on the line above the name; the time is a 54px column now,
     which a range does not fit, so it is the START there and the
     LENGTH on the line under the name. Start-plus-length is the same
     statement as start-to-end, and it is what these hold — the old
     assertions were replaced rather than deleted, because what they
     protect is that a row still says how long the block is. */
  const spans = await page.$$eval('.row[data-id]', (rows) => rows.map((r) => {
    const d = r.querySelector('.dur');
    return {
      n: r.querySelector('.n').firstChild.textContent,
      s: +r.dataset.s, e: +r.dataset.e,
      t: r.querySelector('.t').textContent,
      d: d ? d.textContent : null,
      /* THE BOX, NOT THE STRING. A length hidden by CSS still returns
         its textContent, so a check reading the text alone passes on a
         build where not one of them is drawn — which is exactly the
         build the rule below creates on half the rows. */
      dv: !!d && d.getClientRects().length > 0,
      done: r.classList.contains('is-done'),
      past: r.classList.contains('is-past'),
      now: r.classList.contains('is-now'),
    };
  }));
  const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':'
    + String(m % 60).padStart(2, '0');
  /* durAhead / durGone, not ahead / behind: `behind` is already
     declared in this scope eight hundred lines down, and a second one
     is a SyntaxError that takes the whole file before an assertion
     runs. This repo's oldest bug in test-file clothes, caught by
     node --check rather than by "0 assertions across 1 files". */
  const durAhead = spans.filter((s) => !s.done && !s.past);
  ok('every block prints its start in the gutter and its length below',
    spans.length > 4 && durAhead.length > 1
    && spans.every((s) => /^\d\d:\d\d$/.test(s.t))
    && durAhead.every((s) => s.dv && /\d/.test(s.d)),
    spans.slice(0, 3));

  /* ── AND A BLOCK BEHIND YOU HAS NO LENGTH ──
     A length is what you PLAN against, and there is nothing left to
     plan about a morning that has happened: done or missed, the figure
     carries nothing and the tag beside it is the whole of what the row
     still has to say.

     This does NOT reverse the rule that put the start back on a
     finished row, and the difference is the COLUMN. The start lives in
     a gutter, so hiding it leaves a hole and three holes down a
     morning read as missing data. The length is a property inline with
     the tags, so taking it out closes up.

     Both directions, and both are needed: "nothing behind you draws
     one" passes on a build that draws no lengths at all, and the half
     above passes on one that draws every last one.

     IT PLANTS THE TWO STATES RATHER THAN WAITING FOR THEM. Written as
     a filter over whatever happened to be on screen it read `gone: []`
     and failed — is-past is set on TODAY's rows alone, and the day
     open here need not be today, so the check only had something to be
     true of at certain hours on certain days. That is the shape this
     file has now recorded four times. WHEN the app sets those classes
     is asserted elsewhere and at length; what is claimed here is only
     that a row wearing one draws no length, so the honest measurement
     is to put the class on, read the box, and take it off again —
     inside one evaluate, so nothing is left on the page. */
  /* A row that is NEITHER done nor past, because the check plants
     those classes itself and needs a row whose length is drawn to
     begin with. It took the FIRST row, which at some hours is already
     behind you — so `before` came back false and the check failed on
     the CLOCK rather than on the rule. That is the fifth time this
     file has recorded that shape, and the answer is the same one
     every time: measure a row the hour cannot reach. */
  const durGone = await page.$$eval('.row[data-id]', (rows) => {
    const r = rows.find((x) => !x.classList.contains('is-done')
      && !x.classList.contains('is-past'));
    if (!r) throw new Error('no row still ahead to read a length off');
    const d = r.querySelector('.dur');
    const box = () => d.getClientRects().length > 0;
    const out = { before: box() };
    r.classList.add('is-done'); out.done = box(); r.classList.remove('is-done');
    r.classList.add('is-past'); out.past = box(); r.classList.remove('is-past');
    out.after = box();
    return out;
  });
  ok('and a block already done or gone by draws no length at all',
    durGone.before && !durGone.done && !durGone.past && durGone.after
    && durAhead.every((s) => s.dv),
    { durGone, ahead: durAhead.map((s) => [s.n, s.d, s.dv]) });
  /* Present is not enough — a constant string is also present, which is
     the shape of the failure the measure's own check was written for.
     So both halves have to be the block's REAL figures, and both have
     to vary down the card. */
  ok('and the start and the length are the block’s real ones',
    spans.every((s) => s.t === hhmm(s.s))
    && new Set(spans.map((s) => s.t)).size > 5
    && new Set(spans.map((s) => s.d)).size > 2,
    spans.slice(0, 3));
  /* THE GUTTER IS THE TIME AND THE GLYPH COLUMN IS THE GLYPH. Two
     columns now, and each holds exactly one thing: column 1 is the
     start, column 2 is the icon and — only on a done row — its tick.
     The point of the check is unchanged, that nothing else creeps into
     the left of a row, and it now has two columns to say it about. */
  /* rowCols, not cols: `cols` is already declared in this scope for
     the day cards forty lines up, and a second const of that name is
     a SyntaxError that takes the whole file down before one assertion
     runs — which is this repo's oldest bug wearing test-file clothes.
     It reported as "0 assertions across 1 files". */
  const rowCols = await page.$$eval('.row[data-id]', (rows) => rows.map((r) => {
    const at = (n) => [...r.children]
      .filter((e) => getComputedStyle(e).gridColumnStart === String(n))
      .map((e) => e.getAttribute('class'));
    return { one: at(1), two: at(2) };
  }));
  const gutter = rowCols.map((c) => c.two);
  ok('the time column holds the start and nothing else',
    rowCols.length > 4
    && rowCols.every((c) => c.one.length === 1 && c.one[0] === 't'),
    rowCols.filter((c) => c.one.length !== 1 || c.one[0] !== 't').slice(0, 4));
  const okGut = (g) => g.length === 1 ? g[0] === 'ic'
    : g.length === 2 && g.includes('ic') && g.includes('tick');
  /* The payload is the rows that FAILED, not the rows that look odd by
     some second rule — an extra of `[]` beside a red line tells you
     nothing, which is what the first cut of this printed. */
  ok('and the gutter carries the glyph alone unless the block is done',
    gutter.every(okGut), gutter.filter((g) => !okGut(g)).slice(0, 4));

  /* ── contrast, on real pixels ──
     Sampled the length of the poster, because the sky is lightest at
     the bottom and that is where the card has the least to work with.
     Every string on this screen is small text, so 4.5:1 is the bar for
     all of it — there is no 3:1 large-text exemption anywhere here. */
  console.log('\n── contrast ──');
  const { PNG } = require('pngjs');
  const dpr = 2;

  /* The sweep is hidden for this pass, and that is a NARROWING, so it
     needs its reason and its replacement.

     This check samples a band of the row and compares it to the row's
     text colour. That proxy assumes the row's background is uniform,
     which it was until a 2px line started crossing it: the sample then
     lands on solid red about half a percent of the time and reports
     1.89:1 for a mark that is under a glyph for roughly fifteen
     milliseconds. Judging the palette through a moving object measures
     the object, not the palette.

     What replaces it is stricter, not weaker, and lives in the sweep
     section below: the same row is sampled ACROSS its width with the
     sweep running, and the proportion of background that fails has to
     stay under three percent. A wash that got wider, darker or slower
     fails that immediately; a hairline does not. */
  await page.addStyleTag({ content: '.row.is-now::after{display:none !important}' });

  /* This SCROLLS rather than taking one full-page shot, and the
     difference is the whole measurement. The sky is position:fixed, so
     its gradient spans the VIEWPORT — the lightest part of it is
     wherever the bottom of the screen currently is, and every row
     passes through that band on the way up. A full-page screenshot
     stretches the gradient over the whole document instead and only
     ever puts the last few rows on the light end, which is a picture no
     phone ever shows. */
  const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
  const worst = { r: 99, of: null };

  for (let top = 0; top < pageH; top += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(60);
    const png = PNG.sync.read(await page.screenshot());
    const at = (x, y) => {
      const i = (png.width * Math.round(y) + Math.round(x)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    /* Each row's own TEXT colour against its own background, sampled
       across the row. It cannot assume white any more: most of the
       week is White on Dark Green and the day you are in is Dark Green
       on Spring Green, so a check written around one polarity would
       pass the lit card without ever looking at it.

       Opacity is folded in by hand. It never shows up in the computed
       colour, so a row faded to .5 measures exactly as well as one at
       full strength — which is how a dimmed row sails through a
       contrast check that only reads CSS. */
    const boxes = await page.$$eval('.row[data-id]', (rows) => rows.map((r) => {
      const b = r.getBoundingClientRect();
      const spans = [...r.querySelectorAll('.t, .r, .n')];
      return {
        x: b.left, y: b.top, w: b.width, h: b.height,
        n: r.querySelector('.n').textContent,
        op: parseFloat(getComputedStyle(r).opacity) || 1,
        inks: [...new Set(spans.map((s) => getComputedStyle(s).color))]
          .map((c) => c.match(/[\d.]+/g).slice(0, 3).map(Number)),
      };
    }));
    /* The bar is fixed over the foot of the screen and its icons are
       pure white, so a row underneath it samples the icon rather than
       the card — 1.00:1, and nothing to do with the palette. Those rows
       are measured on the pass where they are in the clear. */
    const barTop = await page.$eval('.bar', (e) => e.getBoundingClientRect().top);
    for (const b of boxes) {
      if (b.y < 0 || b.y + b.h > barTop) continue;   /* only what is on screen and clear */
      /* Every sampled pixel, not just the lightest one: which extreme
         is the worst case flips with the polarity of the text, and
         both polarities are on this screen at once. */
      /* INSIDE the row's own fill, not at its edge. A row is a card
         with a 14px radius and the running one carries a 1.5px accent
         ring; a sample 4px in and 3px up lands on the ring where it
         curves round the corner, and the check then reports the mark
         as the ground the words are on — 3.28:1 against a colour no
         text is ever drawn over. Measured where the text is. */
      for (let dx = 16; dx < b.w - 16; dx += 3) {
        const p = at((b.x + dx) * dpr, (b.y + b.h - 7) * dpr);
        for (const ink of b.inks) {
          const seen = ink.map((v, i) => v * b.op + p[i] * (1 - b.op));
          const r = ratio(seen, p);
          if (r < worst.r) { worst.r = r; worst.of = b.n; worst.px = p; worst.ink = seen; worst.at = top; }
        }
      }
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    [...document.querySelectorAll('style')].forEach((s) => {
      if (/is-now::after\{display:none/.test(s.textContent)) s.remove();
    });
  });
  ok(`every row clears 4.5:1 at every scroll position (worst ${worst.r.toFixed(2)}:1 on "${worst.of}")`,
    worst.r >= 4.5, worst);

  /* The dimmed things are dimmed by WEIGHT, not by alpha — so a past
     class is the only text on the card that is allowed to drop, and
     nothing else may quietly acquire an opacity later. */
  const alphas = await page.$$eval('.row[data-id] .t, .row[data-id] .r, .row[data-id] .n',
    (els) => els.map((e) => getComputedStyle(e).color));
  ok('no row text is dimmed with alpha', alphas.every((c) => !/rgba/.test(c) || /, *1\)$/.test(c)),
    [...new Set(alphas)]);

  /* ── the sentence ── */
  console.log('\n── the sentence ──');
  await page.click('#scAdd');
  await page.waitForTimeout(120);

  for (const [said, want] of SAID) {
    await page.fill('#scSheetBody .field', said);
    await page.waitForTimeout(40);
    const got = await page.$eval('#scSheetBody .parsed', (e) => ({
      days: e.querySelector('.p-day').textContent,
      name: e.querySelector('.p-name').textContent,
      meta: e.querySelector('.p-meta').textContent,
    })).catch(() => null);
    const right = got
      && got.days === want.days
      && got.name === want.name
      && got.meta.startsWith(`${want.s} to ${want.e}`)
      && (want.room ? got.meta.endsWith(want.room) : !/·/.test(got.meta));
    ok(`“${said}”`, right, { got, want });
  }

  /* Half a sentence must not become half a class. */
  await page.fill('#scSheetBody .field', 'Stretching');
  await page.waitForTimeout(40);
  ok('a sentence missing its day and time cannot be added',
    await page.$eval('#scSheetBody .btn.go', (b) => b.disabled));
  await page.fill('#scSheetBody .field', 'Monday 8 to 9');
  await page.waitForTimeout(40);
  ok('and one missing its name cannot either',
    await page.$eval('#scSheetBody .btn.go', (b) => b.disabled));

  /* ── COUNTED IN THE STORE, NOT ON THE SCREEN ──
     One day is drawn, so a count of rows on screen is a count of
     today. What these are about is the WEEK — a sentence naming two
     days writing two rows, a delete taking every day a block is on —
     so they read the record, which is where the week lives. */
  const inWeek = () => page.evaluate(() =>
    (JSON.parse(localStorage.getItem('sched.v1') || '{}').items || []).length);
  /* Two days named, two rows written — a repeating block is per-day. */
  await page.fill('#scSheetBody .field', 'Physio Tuesday and Friday 8 to 9 at the clinic');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('two days named writes two rows', await inWeek() === SEEDED + 2);
  /* Found by the day's own DATA, not by position and not by label.
     Position went first: the week rotates with the clock, so
     .day:nth-child(2) is a different weekday every day and a test
     written against it passes or fails depending on when it runs.

     The label replaced it and carried the same class of bug one level
     down. A SHUT card prints the abbreviation and the OPEN one prints
     the full day name, so `textContent === 'TUE'` finds nothing on
     the one day of the week when Tuesday happens to be the card that
     is open — `find` returns undefined and the next line reads
     querySelectorAll off it. It sat here until a container's clock
     rolled past midnight into a Tuesday and took the whole file down
     with a crash forty assertions before the thing it was testing.
     The same trap is written up in CLAUDE.md against week-render,
     which threw on 'wednesday' for exactly this reason.

     `data-d` is the weekday the card was BUILT for. It does not move
     when the card opens, and there is no day of the week on which
     this reads differently. */
  const DOW = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };
  /* ── PRESS THE DAY, THEN READ IT ──
     One day is drawn, so a day other than the one you are on has to
     be asked for. The chip carries the weekday it was built for, the
     same way the card did, and it does not move. */
  const rowsOf = async (abbr) => {
    await page.evaluate((d) => {
      const b = [...document.querySelectorAll('.st-d')]
        .find((x) => x.dataset.d === String(d));
      if (!b) throw new Error('no chip for weekday ' + d);
      b.click();
    }, DOW[abbr]);
    await page.waitForTimeout(180);
    return page.$$eval('.row[data-id] .n', (n) => n.map((x) => x.firstChild.textContent));
  };
  ok('and it lands in time order inside the day',
    await rowsOf('TUE').then((v) => v.join('|') === 'Wake|Train|Walk|Physio|Trading|Read|Down'),
    await rowsOf('TUE'));

  /* The other branch: a block spoken in with a place shows it, beside
     its own name and nowhere else. */
  /* Both of them, which is two days: press each and read its own. */
  ok('the blocks that gained a place show it',
    await (async () => {
      const seen = [];
      for (const d of ['TUE', 'FRI']) {
        await rowsOf(d);
        seen.push(...await page.$$eval('.row .n em', (e) => e.map((x) => x.textContent)));
      }
      await rowsOf('TUE');
      return seen.length === 2 && seen.every((x) => x === 'Clinic');
    })());

  /* ── nothing deletes without a way back ── */
  console.log('\n── the way back ──');
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('undo puts the week back', await inWeek() === SEEDED);

  /* Work is on five of the seven days, so one sentence has to take all
     five — a delete that stopped at the first match would look like it
     had worked. */
  await page.click('#scAdd');
  await page.waitForTimeout(120);
  await page.fill('#scSheetBody .field', 'delete Work');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('a spoken delete takes every day it is on', await inWeek() === SEEDED - 5);
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('and that is undoable too', await inWeek() === SEEDED);

  /* ── a damaged store is repaired, not thrown away ── */
  console.log('\n── the store ──');
  await page.evaluate(() => {
    localStorage.setItem('sched.v1', JSON.stringify({
      title: 'Kept', sub: 7, view: {},
      items: [
        { id: 'a', d: 1, s: 480, e: 540, r: '', n: 'Survivor' },
        { id: 'b', d: 9, s: 480, e: 540, r: '', n: 'Bad day' },
        { id: 'c', d: 2, s: 600, e: 300, r: '', n: 'Ends before it starts' },
        { id: 'd', d: 2, s: 600, e: 660, r: '', n: '' },
        'not an object',
      ],
    }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  ok('the readable rows survive a damaged store',
    await inWeek() === 1
    && (await page.$$eval('.st-d', (b) => b.length)) === 7);
  /* `sub` is a key this app USED to keep and no longer reads, and
     `view` is a key it never had. Both are in the damaged store on
     purpose: a repair that only tolerates the shape it writes today
     throws a title away the first time the format moves. */
  ok('and a stray key from another version does not take the title with it',
    await page.$eval('#scTitle', (e) => e.textContent) === 'Kept');

  /* ── the live line ── */
  console.log('\n── now ──');
  await page.evaluate(() => localStorage.removeItem('sched.v1'));
  /* A Tuesday, mid-morning. Trading runs 9 to 11 on the open days, so
     at 9:30 exactly one row is live and the three before it are not. */
  await page.addInitScript(() => {
    const FROZEN = new Date('2026-09-01T09:30:00').getTime();
    const R = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends R {
      constructor(...a) { super(...(a.length ? a : [FROZEN])); }
      static now() { return FROZEN; }
    };
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  ok('today is the only day marked', await page.$$eval('.st-d[aria-current="date"]',
    (n) => n.map((x) => +x.dataset.d)).then((v) => v.length === 1 && v[0] === 2));

  /* ── "now" ──
     Read HERE rather than up with the rest of the sentences, because
     it is the one phrase whose answer moves: against the real clock
     the expected times would have to be computed the same way the app
     computes them, which is a test agreeing with itself. On the frozen
     Tuesday 09:30 they are literals.

     Three claims, and each fails for its own reason: the clock is
     taken from now, an hour is the default the way a bare "at 9" gets
     one, and the word is STRUCK OUT — "Watching podcast now" was
     landing a block called "Watching Podcast Now". */
  await page.click('#scAdd');
  await page.waitForTimeout(140);
  const nowSaid = async (text) => {
    await page.fill('#scSheetBody .field', text);
    await page.waitForTimeout(60);
    return page.$eval('#scSheetBody .parsed', (e) => ({
      days: e.querySelector('.p-day').textContent,
      name: e.querySelector('.p-name').textContent,
      meta: e.querySelector('.p-meta').textContent,
    })).catch(() => null);
  };
  const n1 = await nowSaid('Watch a podcast now');
  ok('“now” is a time, and it brings an hour with it',
    n1 && n1.days === 'TUE' && /^09:30 to 10:30/.test(n1.meta), n1);
  ok('...and the word does not end up in the name',
    n1 && !/now/i.test(n1.name), n1);
  /* It carries its own day. Saying "now" on a Tuesday and being asked
     which day is the app not having listened. */
  const n2 = await nowSaid('Watch a podcast today now');
  ok('...and a day said as well does not double it',
    n2 && n2.days === 'TUE' && /^09:30 to 10:30/.test(n2.meta), n2);
  const n3 = await nowSaid('Read now for 90 minutes');
  ok('...and a length said after it is honoured',
    n3 && /^09:30 to 11:00/.test(n3.meta), n3);
  const n4 = await nowSaid('Read now for 2 hours');
  ok('...in hours as well as minutes',
    n4 && /^09:30 to 11:30/.test(n4.meta), n4);
  /* An explicit clock time still wins: somebody who says both is
     correcting themselves, and the digits are the correction. */
  /* Both halves, because they fail apart: the explicit clock has to
     win the TIME, and the word still has to leave the name and still
     has to supply the day. It landed a block called "Read Now" that
     did not know which day it was on — the app hearing the word and
     using none of it. */
  const n5 = await nowSaid('Read now at 3');
  ok('...and a real time said with it wins the clock',
    n5 && /^15:00 to 16:00/.test(n5.meta), n5);
  ok('...while the word still leaves the name and still says the day',
    n5 && n5.days === 'TUE' && !/now/i.test(n5.name), n5);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(160);
  /* ── morning, afternoon, evening ──
     Noon and five o'clock. A session with nothing in it is not drawn:
     an "Afternoon" heading over no rows is furniture, and on a real
     week at least one of the three is empty most days — the seeded
     Tuesday has no shift on it, which is what makes that testable
     rather than merely stated. */
  /* The count each heading used to PRINT is gone, so the grouping is
     measured off the card instead: walk forward from each heading to
     the next one. That is the stronger check of the two — the printed
     figure could agree with itself while the rows under it did not. */
  /* Each session is a box now — the heading and its rows share a
     .wk-sess, which is what the board lays out as a column — so the
     rows under a heading are the rows in its box. */
  const sess = await page.$$eval('.wk-sh', (h) => h.map((x) => {
    const n = x.parentElement.querySelectorAll('[data-id]').length;
    return { k: x.querySelector('b').textContent, n,
             live: x.classList.contains('is-live') };
  }));
  /* A SUBSEQUENCE of the three, not all three. The seeded Tuesday has
     no shift on it, so it genuinely has nothing between noon and five —
     asserting all three here would have been the test insisting on data
     the fixture deliberately does not have. */
  const ORDER3 = ['Morning', 'Afternoon', 'Evening'];
  ok('the open day is cut into sessions, in order',
    sess.length > 0 && sess.every((x) => ORDER3.includes(x.k))
    && sess.map((x) => ORDER3.indexOf(x.k))
       .every((v, i, a) => i === 0 || v > a[i - 1]), sess);
  ok('...each with rows under it, and every row under one of them',
    sess.every((x) => x.n > 0)
    && sess.reduce((a, x) => a + x.n, 0)
       === await page.$$eval('.row[data-id]', (r) => r.length), sess);
  /* 10:12 on the frozen clock, so Morning is the live one and the other
     two must NOT be. A rule that marked every session would pass an
     "is it marked" check and say nothing. */
  ok('...and only the session you are in takes the accent',
    sess.filter((x) => x.live).map((x) => x.k).join() === 'Morning', sess);

  /* ── an empty session is DROPPED, and both directions are checked ──
     Watching it disappear alone would pass on code that never drew an
     afternoon at all, so the heading is made to appear first. The
     seeded Tuesday has nothing between noon and five, which is what
     makes it the right day to put something into. */
  const heads = () => page.$$eval('.wk-sh b',
    (b) => b.map((x) => x.textContent).join());
  ok('the open day has no afternoon to start with',
    (await heads()) === 'Morning,Evening', await heads());
  await page.evaluate(() => {
    const w = JSON.parse(localStorage.getItem('sched.v1'));
    w.items.push({ d: 2, s: 840, e: 900, r: '', n: 'Lunch', id: 'zz1' });
    localStorage.setItem('sched.v1', JSON.stringify(w));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(220);
  ok('...one block after noon and the heading appears, in its place',
    (await heads()) === 'Morning,Afternoon,Evening', await heads());
  await page.evaluate(() => {
    const w = JSON.parse(localStorage.getItem('sched.v1'));
    w.items = w.items.filter((it) => it.id !== 'zz1');
    localStorage.setItem('sched.v1', JSON.stringify(w));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(220);
  ok('...and take it away and the heading goes rather than showing a zero',
    (await heads()) === 'Morning,Evening', await heads());

  /* ── THE SHUT CARDS, THE BLEED AND THE DOTS WENT WITH THE DECK ──
     A card at 76px that had to be stopped from printing its hours over
     its neighbour, and seven dots saying which of seven you were on,
     were both answers to having seven cards on screen at once. There
     is one day now and a strip that says which. */
  ok('exactly one class is live', await page.$$eval('.row.is-now',
    (r) => r.map((x) => x.querySelector('.n').textContent))
    .then((v) => v.length === 1 && v[0] === 'Trading'));
  ok('and the morning behind it is marked done',
    await page.$$eval('.row.is-past .n', (r) => r.map((x) => x.textContent).join('|'))
      .then((v) => v === 'Wake|Train|Walk'));

  /* ── a finished block SPENDS its time, and the check moved with it ──
     It used to be drawn above the name and was removed outright: the
     figure is what you plan against, and there is nothing left to plan
     about a morning that has happened. With the time in a 54px column
     that removal leaves a HOLE, and three holes down a morning read as
     missing data rather than as a day emptying out.

     So the claim is now made in weight: a finished row's time drops to
     --spent with the rest of the row. Both halves are still asserted
     and both sets still have to be non-empty — "every past time is
     spent" passes on a rule that greyed every time on the card, and on
     a day with nothing behind you it passes by finding nothing at all.

     MEASURED AS A COMPUTED COLOUR against the two tokens rather than
     as a class, for the reason the old check gave: what is claimed is
     what is drawn. */
  const times = await page.$$eval('.week.is-today .row[data-id]', (rows) => {
    const css = getComputedStyle(document.documentElement);
    const spent = css.getPropertyValue('--spent').trim();
    const dim = css.getPropertyValue('--dim').trim();
    const probe = document.createElement('span');
    document.body.appendChild(probe);
    const norm = (v) => { probe.style.color = v; return getComputedStyle(probe).color; };
    const want = { spent: norm(spent), dim: norm(dim),
                   ink: norm(css.getPropertyValue('--ink').trim()) };
    const col = (r) => {
      const e = r.querySelector('.t');
      return { drawn: e.getClientRects().length > 0,
               c: getComputedStyle(e).color };
    };
    const out = { want,
      gone: rows.filter((r) => r.classList.contains('is-past')).map(col),
      /* The running row is its own case and always was: --dim over the
         sweep's 13% wash measures under 4.5:1, which is why the whole
         row's figures go to --ink there. Folding it in with "ahead"
         would make this check fail on the hour and pass the rest of
         the day, which is the shape this file keeps warning about. */
      now: rows.filter((r) => r.classList.contains('is-now')).map(col),
      kept: rows.filter((r) => !r.classList.contains('is-past')
                            && !r.classList.contains('is-now')).map(col) };
    probe.remove();
    return out;
  });
  ok('a finished block spends its time, and everything ahead keeps it in --dim',
    times.gone.length > 0 && times.kept.length > 0
    && times.gone.every((v) => v.drawn && v.c === times.want.spent)
    && times.kept.every((v) => v.drawn && v.c === times.want.dim)
    && times.now.every((v) => v.drawn && v.c === times.want.ink), times);

  /* And only TODAY. Every other day is a plan rather than a record —
     a Monday with its mornings rubbed out would be the app claiming
     the week only runs forwards — so another day is pressed and read,
     which is the only way to see one now. */
  await page.evaluate(() => document.querySelector('.st-d:not(.is-on)').click());
  await page.waitForTimeout(220);
  ok('...and no other day in the week loses one',
    await page.$eval('.week', (w) => !w.classList.contains('is-today'))
    && await page.$$eval('.row[data-id] .t',
      (t) => t.length > 0 && t.every((x) => getComputedStyle(x).display !== 'none')));
  await page.evaluate(() => [...document.querySelectorAll('.st-d')]
    .find((b) => +b.dataset.d === new Date().getDay()).click());
  await page.waitForTimeout(220);

  /* The running row is 13px wider than the rest so its rule can reach
     into the margin. Its columns still have to line up with every other
     row — and this is the only place in the file guaranteed to HAVE a
     running row, because the clock is frozen inside one. The check at
     the top of the file sees it only when the real time happens to fall
     inside a block, which is how a 13px step went unnoticed. */
  const align = await page.evaluate(() => {
    const day = document.querySelector('.week.is-today');
    const rows = [...day.querySelectorAll('.row[data-id]')];
    const shown = rows.map((r) => r.querySelector('.t').getClientRects().length > 0);
    const edge = (sel, side) => rows
      .map((r) => Math.round(r.querySelector(sel).getBoundingClientRect()[side]));
    /* The glyph's LEFT and the time's, since the measure that used to
       hold this column is gone. Both still have to be one number: the
       running row reaches 13px further left for its rule and has to
       grow rather than slide, and a plain width:100% moves the whole
       box instead. */
    /* The TIME's column is read off the rows that draw one. A finished
       block has no time now, and a box that is not drawn reports left
       0 — comparing it against a real column is comparing nothing
       against something. The GLYPH is still every row, because every
       row has one and that is the column the narrowing could hide. */
    return { t: edge('.t', 'left').filter((v, i) => shown[i]),
             m: edge('.ic', 'left') };
  });
  ok('the running row keeps the column it is in',
    align.t.length > 1 && new Set(align.t).size === 1
    && new Set(align.m).size === 1, align);

  /* ── reduced motion ──
     Checked HERE, where a running row is guaranteed. The sweep must
     not be built, and the row must still be marked: an effect that
     degrades to nothing has not been disabled, it has removed the
     mark. Paused would be worse than absent — a red line frozen
     partway across a row reads as a bug. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const calm = await page.evaluate(() => {
    /* THE ONE WITH A REAL BOX. Every card carries its rows and only
       the open one draws them, so a bare `.row.is-now` can land on a
       shut card, whose rows are 76px of nothing. */
    const row = [...document.querySelectorAll('.row.is-now')]
      .find((r) => r.getBoundingClientRect().width > 40);
    const a = getComputedStyle(row, '::after');
    const w = (r) => +getComputedStyle(r.querySelector('.n')).fontWeight;
    /* The weight is read RELATIVE to a row that is not running, never
       against a literal. It was `=== '700'`, and the day the base rows
       went from 500 to 700 that assertion started passing on a screen
       where the running row was no heavier than anything round it —
       the check would have found nothing and said so in green. What is
       being claimed is "heavier than its neighbours", so that is what
       is measured. */
    const other = [...document.querySelectorAll('.row[data-id]')]
      .find((r) => !r.classList.contains('is-now')
        && r.getBoundingClientRect().width > 40);
    /* ── THE ACCENT IS ASKED FOR, NEVER TYPED ──
       This was the literal rgb(226, 35, 26), which was the shipped
       red — and the shipped palette is Lime now, so the assertion was
       measuring a colour that is nowhere on the page. Read off the
       root it holds whatever the palette is, which is the claim being
       made: the running row wears the ACCENT. */
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim();
    /* ── THE MARK IS A PROGRESS LINE ──
       A 3px track under the row, filled by the fraction of the block
       that has gone. There is nothing to disable under reduced motion
       because nothing animates: the width is set on the same
       half-minute pass that marks the rows behind you, so the mark
       STEPS rather than sliding. */
    const pr = row.querySelector('.row-prog');
    const fill = pr && pr.querySelector('i');
    return { display: a.display, anim: a.animationName,
             track: pr ? getComputedStyle(pr).display : null,
             fillBg: fill ? getComputedStyle(fill).backgroundColor : null,
             fillPct: fill ? fill.style.width : null,
             fillAnim: fill ? getComputedStyle(fill).animationName : null,
             accent: accent,
             weight: w(row), plain: other ? w(other) : null };
  });
  const hexRGB = (h) => 'rgb(' + h.replace('#', '').match(/\w\w/g)
    .map((x) => parseInt(x, 16)).join(', ') + ')';
  /* Both directions. "Nothing animates" passes on a row with no mark
     at all, so the track has to be there and filled in the accent. */
  /* `display` on a pseudo-element with no `content` is whatever the
     default is rather than `none`, so it says nothing about whether
     one is generated — what is claimed is that no animation runs, and
     that is what is read. */
  ok('the running row draws a progress track and nothing on it animates',
    calm.track === 'block' && calm.anim === 'none' && calm.fillAnim === 'none',
    calm);
  ok('the track is filled in the accent, to a real fraction',
    calm.fillBg === hexRGB(calm.accent)
    && /^\d+(\.\d+)?%$/.test(calm.fillPct || '')
    && parseFloat(calm.fillPct) > 0 && parseFloat(calm.fillPct) <= 100, calm);
  ok('and the row is still marked without it', calm.weight > calm.plain, calm);

  /* ── AND ITS CONTENT SITS WHERE EVERY OTHER ROW'S DOES ──
     Kept from the pill that briefly replaced this rule, because it
     guards the mechanism that was here all along and was never
     checked. The row reaches 13px LEFT for its rule and has to grow by
     the same amount rather than slide: with a plain width:100% the
     negative margin moves the whole box, the right edge lands 13px
     inside every other row, and the time column steps out of the one
     alignment this design is built on. It only shows while something
     is actually running, which is how it went unseen for months — and
     it is one character away at any time. */
  const nowCols = await page.evaluate(() => {
    const now = document.querySelector('.row.is-now');
    const plain = [...document.querySelectorAll('.row[data-id]')]
      .find((r) => !r.classList.contains('is-now'));
    const at = (r, sel) => { const e = r.querySelector(sel);
      return e ? +e.getBoundingClientRect().x.toFixed(1) : null; };
    return { nowIc: at(now, '.ic'), plainIc: at(plain, '.ic'),
             nowN: at(now, '.n'), plainN: at(plain, '.n'),
             nowRight: +now.getBoundingClientRect().right.toFixed(1),
             plainRight: +plain.getBoundingClientRect().right.toFixed(1) };
  });
  ok('a running row\'s glyph and name sit where every other row\'s do',
    Math.abs(nowCols.nowIc - nowCols.plainIc) < 1
    && Math.abs(nowCols.nowN - nowCols.plainN) < 1, nowCols);
  ok('...and it grows leftward rather than sliding, so the right edge holds',
    Math.abs(nowCols.nowRight - nowCols.plainRight) < 1, nowCols);
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  /* ── nothing under the span but the span ──
     There was a hero here: a state, a 44px clock time and a sentence,
     then a 10px label riding the dot. All of it said what the open
     card says four inches below — the running block is the one row
     wearing the accent and a sweep — and the dot already says where in
     the day that is. Asserted as the ABSENCE of the elements rather
     than of their text, because an emptied node still reserves a line,
     and by measuring that the deck starts within a head's height of
     the top rather than trusting a class. */
  const quiet = await page.evaluate(() => ({
    parts: ['.live', '.caption', '#scLiveOf', '#scLiveState']
      .filter((s2) => document.querySelector(s2)),
    headBottom: Math.round(document.querySelector('.head').getBoundingClientRect().bottom),
    running: [...document.querySelectorAll('.row.is-now .n')]
      .map((n) => n.textContent).join(),
  }));
  ok('the head carries no second copy of the running block',
    quiet.parts.length === 0 && quiet.headBottom < 200, quiet);
  ok('...and the open card is where it is said', quiet.running === 'Trading', quiet);

  /* ── THE HEAD IS THE DAY ──
     It was an uppercase app name over a date line with the day's span
     under both. The name is a screen reader's heading now and nothing
     drawn; what is up here is the day at 30px over one quiet line —
     the date, what is on it, and the clock.

     Read RELATIVE, never as a px literal: a figure typed into a test
     stops meaning anything the day the type moves. */
  const head = await page.evaluate(() => {
    const px = (el) => parseFloat(getComputedStyle(el).fontSize);
    const t = document.querySelector('.title');
    const row = [...document.querySelectorAll('.row[data-id] .n')][0];
    const day = document.getElementById('scHdDay');
    return { title: t.getBoundingClientRect().width,
             day: px(day), sub: px(document.getElementById('scHdDate')),
             row: px(row), text: day.textContent,
             ic: !!document.querySelector('.h-ic svg') };
  });
  ok('the app\u2019s own name is not drawn on the screen at all',
    head.title <= 1, head);
  ok('...and the day is, at more than twice a block\u2019s name',
    head.day > head.row * 1.8 && /^[A-Z][a-z]+$/.test(head.text), head);
  ok('...over one quieter line, beside a glyph saying which screen',
    head.sub < head.day && head.ic, head);
  ok('the head names the date, what is on it, and the clock',
    await page.$eval('#scHdDate',
      (e) => /^\d+ [A-Z][a-z]{2} \u00b7 .+ \u00b7 \d/.test(e.textContent)),
    await page.$eval('#scHdDate', (e) => e.textContent));

  /* ── THE SPAN WENT WITH THE DECK ──
     A scale of the day's first minute to its last, with a dot on it
     saying where the clock was — the divider the hero used to hang
     off, and the last thing above the fold that was not the day
     itself. What it drew is the ROW that is running, four inches
     lower and on the block it is actually about, so the head is the
     day and one line under it now. Its dot, its ends, its cast and
     its written label all go; the running row's own checks stay. */
  /* ── a block’s name is its row’s subheading ──
     The name is what you scan for. It was 14px/500 — the same volume as
     the time beside it — and these say it now outranks both its own
     time and the place inside it. */
  const rowType = await page.evaluate(() => {
    const r = [...document.querySelectorAll('.row[data-id]')]
      .find((x) => !x.classList.contains('is-now') && !x.classList.contains('is-past'));
    const px = (el) => parseFloat(getComputedStyle(el).fontSize);
    return { n: px(r.querySelector('.n')),
             w: +getComputedStyle(r.querySelector('.n')).fontWeight,
             t: px(r.querySelector('.t')) };
  });
  /* 600, not 700, and the figure moved with the rules coming out: the
     hairlines were carrying the separation and the name was carrying
     the emphasis, so with them gone the name is the only thing on the
     row at full strength. What is claimed is still rank — three steps,
     800 running, 600 ahead, 500 done — and the running row's own step
     is measured against a plain row up in the reduced-motion block
     rather than against a literal. */
  ok('the block’s name outranks its time', rowType.n > rowType.t
    && rowType.w >= 600, rowType);
  /* ── THE SUB IS THE DATE, THE HOURS AND THE CLOCK ──
     The ordinal went with the sentence it was part of: the day is the
     title now, at 30px, so the line under it has no weekday to agree
     with and "1st" over "Tuesday" was the same word twice. What it
     says instead is the one thing the head could not say before —
     how much of the day is committed — which is also the figure a day
     off changes, and which a count of rows could never carry.

     The teen check went with the ordinal: 11, 12 and 13 are what a
     naive `n % 10` gets wrong, and nothing here writes one now. */
  ok('the head names the date, the hours and the clock',
    await page.$eval('#scHdDate', (e) => e.textContent) === '1 Sep \u00b7 5 hrs \u00b7 09:30',
    await page.$eval('#scHdDate', (e) => e.textContent));
  /* Moved and moved back, because every assertion below was written
     under the Tuesday 09:30 freeze and leaving the page on another
     day would silently change what they measure. */
  const freeze = async (iso) => {
    await page.addInitScript((f) => {
      const R = Date;
      // eslint-disable-next-line no-global-assign
      Date = class extends R {
        constructor(...a) { super(...(a.length ? a : [f])); }
        static now() { return f; }
      };
    }, new Date(iso).getTime());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
  };
  await freeze('2026-09-12T09:30:00');
  ok('...and it follows the day you are on',
    await page.$eval('#scHdDay', (e) => e.textContent) === 'Saturday'
    && await page.$eval('#scHdDate', (e) => /^12 Sep \u00b7 /.test(e.textContent)),
    await page.$eval('#scHdDate', (e) => e.textContent));
  await freeze('2026-09-01T09:30:00');
  ok('...and the clock is back where the rest of this file left it',
    await page.$eval('#scHdDate', (e) => e.textContent) === '1 Sep \u00b7 5 hrs \u00b7 09:30');

  /* ── where, in the accent ──
     Nothing in the seed has a place on it, so the seed cannot prove
     this — the <em> is never built and a check for it would pass by
     finding nothing. One is written in here on purpose. */
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('sched.v1'));
    s.items.find((i) => i.n === 'Trading' && i.d === 2).r = 'Desk';
    /* One on a block that is already behind you — on a normal morning
       most of the day is, so a place that only shows its colour while
       something is running has not shipped the colour, it has shipped a
       highlight on the running row. */
    s.items.filter((i) => i.n === 'Train').forEach((i) => { i.r = 'Gym'; });
    localStorage.setItem('sched.v1', JSON.stringify(s));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(200);

  const whereRGB = (t) => t.trim().startsWith('#')
    ? t.trim().match(/\w\w/g).map((h) => parseInt(h, 16))
    : t.match(/[\d.]+/g).slice(0, 3).map(Number);

  const where = await page.evaluate(() => {
    const em = document.querySelector('.row.is-now .n em');
    if (!em) return null;
    const root = getComputedStyle(document.documentElement);
    return { text: em.textContent,
             colour: getComputedStyle(em).color,
             red: root.getPropertyValue('--red').trim(),
             /* The grey it used to be. Naming it is what stops the pair
                below passing on a page where the place never took a
                colour at all. */
             dim: root.getPropertyValue('--dim').trim() };
  });
  ok('a block’s place shows up beside its name', where && where.text === 'Desk', where);
  ok('and takes the accent — the colour today’s heading takes',
    where && String(whereRGB(where.colour)) === String(whereRGB(where.red))
    && String(whereRGB(where.colour)) !== String(whereRGB(where.dim)), where);

  /* A place is an identity; done is a state. Fading the one with the
     other is the mistake the habits screen has a whole rule against —
     colour there says WHICH, never whether. And on a normal morning
     most of the day is behind you, so a place that only shows its
     colour while something is running has not shipped a colour, it has
     shipped a highlight on the running row. */
  const doneWhere = await page.evaluate(() => {
    const em = document.querySelector('.row.is-past .n em');
    return em ? { text: em.textContent, colour: getComputedStyle(em).color,
                  name: getComputedStyle(em.parentElement).color } : null;
  });
  ok('a finished block still says where it was, in the same colour',
    doneWhere && doneWhere.text === 'Gym'
    && String(whereRGB(doneWhere.colour)) === String(whereRGB(where.colour)), doneWhere);
  ok('while its name goes quiet around it',
    doneWhere && doneWhere.name !== doneWhere.colour, doneWhere);

  /* AND WITH THE ACCENT MOVED. The pair above passes on a page where
     the place is written as the literal #e2231a rather than as the
     token — on the shipped palette those are the same red, which is
     exactly the copy-that-drifts the sweep’s wash shipped as for
     twelve palettes. secMoved, not `moved`: the sweep’s own
     accent-moved check further down already owns that name in this
     scope, and a duplicate const is a SyntaxError that takes the whole
     file’s assertions with it. */
  const secMoved = await page.evaluate(() => {
    const em = document.querySelector('.row.is-now .n em');
    document.documentElement.style.setProperty('--red', '#4FE0A8');
    const got = getComputedStyle(em).color;
    document.documentElement.style.removeProperty('--red');
    return got;
  });
  ok('the place follows the accent when the accent is changed under it',
    String(whereRGB(secMoved)) === String([79, 224, 168]), { secMoved });

  /* ── NOTHING ON THIS SCREEN IS A HUE EXCEPT A TAG ──
     This used to count the accent: it was a colour you turned on a
     wheel, and the claim was that it marked today, the running block,
     a place and what you trained, and nothing else. There is no accent
     — every one of those marks is the INK now — so counting "what is
     red" would match every white thing on the page and report the
     whole screen as a stray. It did, on the first run after the change.

     The claim that replaced it is the one the app is actually making:
     colour says WHICH, so anything with a hue in it belongs to a TAG.
     Measured as channel SPREAD rather than as a named colour, because
     the point is not which hue it is — grey, white and black all have a
     spread of zero, and anything else has to be inside a tag, a workout
     card, or the one danger colour the app keeps for warnings.

     Both directions: strays fail it, and so does finding no tags at
     all, since a screen that had lost its colour entirely would
     otherwise pass by having nothing to object to. */
  const hues = await page.evaluate(() => {
    const chan = (s) => {
      const n = (s.match(/[\d.]+/g) || []).map(Number);
      if (!n.length) return null;
      const a = n.length > 3 ? n[3] : 1;
      if (a < 0.06) return null;         /* invisible: not a colour claim */
      return /^color\(/.test(s) ? n.slice(0, 3).map((v) => Math.round(v * 255))
                                : n.slice(0, 3);
    };
    const spread = (c) => c ? Math.max(...c) - Math.min(...c) : 0;
    const bad = getComputedStyle(document.documentElement)
      .getPropertyValue('--bad').trim().toLowerCase();
    const out = { tags: 0, stray: [] };
    /* NO VISIBILITY FILTER. It had one, and it reported `tags: 0,
       stray: 0` — a pass-shaped zero: at this point in the file the
       week is not the view that is up, so every element under it has
       no client rects and the scan looked at nothing at all. What is
       being claimed is about the colours the app DECLARES on that
       screen, which is true whether or not it happens to be on. */
    for (const el of document.querySelectorAll('.week *, .poster > .head *')) {
      const cs = getComputedStyle(el);
      /* .is-now is in this list now, and it is the one entry here that
         is not a tag. Colour on this screen says WHICH, and the chip
         says which block is running — the same kind of claim, and the
         only one you set yourself. It is named rather than waved
         through by its hue, so a second coloured object cannot arrive
         beside it unnoticed. */
      const inTag = el.closest('.wk-sh b, .ty-card .tg, .wo-p, .wc, .is-now, .row .st, .row .wo');
      const hue = Math.max(spread(chan(cs.color)),
                           spread(chan(cs.backgroundColor)),
                           spread(chan(cs.borderTopColor)));
      /* 14, not 1: the greys are hue-neutral but not channel-identical
         — #b4b4ba has a spread of 6 — and a threshold under that would
         report every piece of dim type on the screen. */
      if (hue < 14) continue;
      if (inTag) { out.tags++; continue; }
      /* --bad is the one hue the app keeps for itself, and it is a
         warning rather than a tag. Named so it cannot creep. */
      if (cs.color.toLowerCase() === bad) continue;
      out.stray.push((el.className || el.tagName) + ':'
        + (el.textContent || '').slice(0, 14));
    }
    return out;
  });
  ok('every hue on the week belongs to a tag or to Now, and there is at least one',
    hues.tags > 0 && hues.stray.length === 0, hues);

  /* ── the progress line ──
     The sweep is gone: a 68px trail of the accent crossing the row
     every 2.8 seconds, for ever, and the only thing moving on a screen
     where nothing else does. What replaced it says something the sweep
     never did — how much of the block is LEFT.

     THE POINT OF THE OLD CHECK SURVIVES, INVERTED. It sampled the row
     twice 700ms apart and required the pixels to DIFFER, because a
     sweep that is present and still looks correct in a screenshot.
     Here the claim is the opposite one, and it is the claim worth
     holding: a screen nobody is touching is a screen that does not
     move. Same measurement, other direction.

     And the fill is checked against the clock rather than merely being
     non-zero: a track stuck at 100% or at 1% is present, coloured and
     wrong, which is exactly the shape of failure the sweep's own check
     was written for. */
  console.log('\n── the progress line ──');
  const nowRow = await page.$('.row.is-now');
  const pa = await nowRow.screenshot();
  await page.waitForTimeout(900);
  const pb = await nowRow.screenshot();
  ok('the running row does not move', pa.equals(pb));

  const prog = await page.evaluate(() => {
    const row = document.querySelector('.row.is-now');
    if (!row) return null;
    const fill = row.querySelector('.row-prog > i');
    if (!fill) return { NOFILL: true };
    const s = +row.dataset.s, e = +row.dataset.e;
    const d = new Date();
    const now = d.getHours() * 60 + d.getMinutes();
    return { pct: parseFloat(fill.style.width),
             want: (now - s) / Math.max(1, e - s) * 100,
             anim: getComputedStyle(fill).animationName,
             dur: getComputedStyle(fill).transitionDuration };
  });
  ok('and its fill is where the clock says it should be',
    prog && prog.pct >= 0 && prog.pct <= 100
    && Math.abs(prog.pct - prog.want) < 4, prog);
  /* A TRANSITION WOULD MAKE IT SLIDE, which is the thing this
     replaced. The app has a global transition on everything, so the
     duration is what has to be zero — `transitionProperty` comes back
     as "all" whether or not anything moves. */
  ok('nothing on it animates or transitions',
    prog && prog.anim === 'none' && parseFloat(prog.dur) === 0, prog);

  /* ── AND THE LENGTH BECOMES A COUNTDOWN WHILE IT RUNS ──
     The bar was accurate and nobody could tell, which is what was
     reported: "I swear I've just seen it at halfway" about a fill
     measuring 38.3% that was exactly right. With no figure anywhere on
     the row there was nothing to check it against, and a bar between a
     third and a half is genuinely hard to read.

     It REPLACES the length rather than joining it: on the row that is
     running, the length is the one figure you can do nothing with.

     Asserted against the CLOCK rather than as a pattern, because
     "37 min left" is a string any constant could satisfy — and
     against the fill beside it, since the two are one fact drawn
     twice and the bug worth catching is them disagreeing. */
  const cd = await page.evaluate(() => {
    const row = document.querySelector('.week.is-today .row.is-now');
    if (!row) throw new Error('no running row on today to read a countdown off');
    const d = row.querySelector('.dur');
    const f = row.querySelector('.row-prog > i');
    const t = new Date();
    return { txt: d ? d.textContent : null,
             drawn: !!d && d.getClientRects().length > 0,
             s: +row.dataset.s, e: +row.dataset.e,
             now: t.getHours() * 60 + t.getMinutes(),
             pct: parseFloat(f.style.width) };
  });
  const mins = (txt) => {
    const h = /(\d+)\s*h/.exec(txt), m = /(\d+)\s*min/.exec(txt);
    return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
  };
  ok('the running row counts down instead of printing its length',
    cd.drawn && / left$/.test(cd.txt)
    && mins(cd.txt) === cd.e - cd.now
    && mins(cd.txt) !== cd.e - cd.s, cd);
  /* One fact, two drawings: what is left plus what has gone is the
     whole block, so the figure and the fill have to agree. */
  ok('...and it agrees with the fill beside it',
    Math.abs((1 - mins(cd.txt) / (cd.e - cd.s)) * 100 - cd.pct) < 2,
    { left: mins(cd.txt), span: cd.e - cd.s, pct: cd.pct });

  /* ── IT TICKS ──
     A figure that is right once is a constant. Moved and moved BACK,
     because every assertion below this point was written under the
     Tuesday 09:30 freeze — and read against each frozen clock's own
     arithmetic rather than by subtracting ten, so it holds whichever
     block the second time lands in. */
  await freeze('2026-09-01T09:40:00');
  const cd2 = await page.evaluate(() => {
    const row = document.querySelector('.week.is-today .row.is-now');
    if (!row) return null;
    const t = new Date();
    return { txt: (row.querySelector('.dur') || {}).textContent,
             e: +row.dataset.e, now: t.getHours() * 60 + t.getMinutes() };
  });
  await freeze('2026-09-01T09:30:00');
  ok('...and it moves with the clock rather than being written once',
    cd2 && / left$/.test(cd2.txt) && mins(cd2.txt) === cd2.e - cd2.now
    && cd2.txt !== cd.txt, { at930: cd.txt, at940: cd2 });

  /* A row that has not started draws no track: a bar on a block you
     have not reached is a claim that you have. Both directions, since
     "no other row has one" passes on a build with no tracks at all. */
  const tracks = await page.evaluate(() => {
    const drawn = (r) => {
      const p = r.querySelector('.row-prog');
      return !!p && p.getClientRects().length > 0;
    };
    const rows = [...document.querySelectorAll('.week.is-today .row[data-id]')];
    return { now: rows.filter((r) => r.classList.contains('is-now')).map(drawn),
             rest: rows.filter((r) => !r.classList.contains('is-now')).map(drawn) };
  });
  ok('only the running row draws a track',
    tracks.now.length > 0 && tracks.rest.length > 0
    && tracks.now.every(Boolean) && !tracks.rest.some(Boolean), tracks);

  /* ── AND NOTHING IN THE WEEK ANIMATES AT ALL ──
     The sweep was the last of it. Asserted over every element AND its
     two pseudo-elements, because the sweep itself was a `::after` and
     a scan of `querySelectorAll('*')` cannot reach one — that exact
     blind spot let a previous version of this report "nothing is
     animating" while the thing it was about went unlooked at. */
  const stillWeek = await page.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('.week *')) {
      if (e.getClientRects().length === 0) continue;
      for (const pseudo of [null, '::before', '::after']) {
        const n = getComputedStyle(e, pseudo).animationName;
        if (n && n !== 'none') out.push((e.className || e.tagName) + (pseudo || '') + ' ' + n);
      }
    }
    return out;
  });
  ok('nothing in the week animates, pseudo-elements included',
    stillWeek.length === 0, stillWeek);


  /* ═══ the objectives ═══
     What the day is FOR, as against what is on it. Per DATE rather
     than per weekday — the schedule repeats and a decision about today
     does not.

     THEY ARE A SHEET NOW, NOT THE BACK OF A CARD. A face you have to
     turn a panel over to find is a feature named nowhere: it needed a
     card of the intro to say it existed, and every engine bug this app
     has had about a composited layer drawing through a backface came
     from that one mechanism. A sheet is what every other secondary
     surface here already uses, and it draws in two dimensions.

     Asserted as the ABSENCE of the machinery, not just of the markup:
     a flip left in place but never triggered would pass a check that
     only looked for `.is-flipped`. */
  console.log('\n── the objectives ──');

  const noFlip = await page.evaluate(() => {
    const w = document.querySelector('.week');
    const c = document.querySelector('.day-card');
    return { faces: document.querySelectorAll('.wk-front, .wk-back, .wk-flip').length,
             flipped: w ? w.classList.contains('is-flipped') : null,
             persp: w ? getComputedStyle(w).perspective : null,
             style3d: c ? getComputedStyle(c.parentElement).transformStyle : null,
             card: !!c };
  });
  ok('there is no flip: no faces, no perspective, no preserve-3d',
    noFlip.card && noFlip.faces === 0 && noFlip.flipped === false
    && noFlip.persp === 'none' && noFlip.style3d === 'flat', noFlip);
  /* ── THE ROW IS THE WAY IN, AND THE CORNER GLYPH IS GONE ──
     The objectives lived behind a 19px mark in the head's top-right
     corner. A glyph in a corner names nothing: you had to be told the
     feature was there, and it took a card of the intro to say so.
     They are cards ON the day now, under the week strip, and the row
     is the whole of the access.

     Asserted as the ABSENCE of the control, not merely of its glyph —
     a button left in place with an empty span would pass a check that
     only looked for the mark. */
  const noTurn = await page.evaluate(() => ({
    btn: document.querySelectorAll('#scHdTurn, .wk-turn').length,
    glyph: document.querySelectorAll('.tn-g, .tn-foil, .ob-foil').length,
    strip: !!document.getElementById('scObjStrip'),
  }));
  ok('the top-right control is gone and the row is what replaced it',
    noTurn.btn === 0 && noTurn.glyph === 0 && noTurn.strip, noTurn);

  /* Pressed by hand rather than through goTo, which is declared four
     hundred lines below this — a helper hoisted into a block it is
     defined after is a ReferenceError, not a convenience. */
  const openDow = async (dow) => {
    await page.evaluate((d) => {
      const b = [...document.querySelectorAll('.st-d')]
        .find((x) => +x.dataset.d === d);
      if (b) b.click();
    }, dow);
    await page.waitForTimeout(420);
  };

  /* ── THE EMPTY DAY IS A GHOST CARD ──
     Three empty states were rendered over the real app. Drawing
     NOTHING is silent — the row vanishes and there is no way in,
     which is exactly the hole the corner glyph was filling. A bare
     plus chip says add something without saying what for. The ghost
     is a real card's box with a dashed edge and a greyed tag: the
     SHAPE of the missing thing, so it teaches the feature by being
     it.

     Both halves, because each passes on the other's bug — "a ghost is
     drawn" passes on a row that draws one over a day that has
     objectives, and "no ghost with objectives" passes on a row that
     never draws one at all. */
  await openDow(4);
  const ghost = await page.evaluate(() => {
    const g = document.querySelector('.obs-c.is-ghost');
    const w = document.getElementById('scObjStrip');
    if (!g) return { none: true, hidden: w ? w.hidden : null };
    const cs = getComputedStyle(g), r = g.getBoundingClientRect();
    const t = getComputedStyle(g.querySelector('.obs-t'));
    return {
      drawn: r.width > 60 && r.height > 28,
      edge: cs.borderTopStyle,
      says: g.querySelector('.obs-n').textContent,
      /* A STATE IS NEVER COLOURED: the ghost names no objective, so
         its tag makes no claim about which kind of thing this is and
         has to be a grey with no channel standing out. That rule is
         the whole of what stops this screen having an opinion. */
      tag: t.color,
      cards: document.querySelectorAll('.obs-c').length,
      add: document.querySelectorAll('.obs-add').length,
    };
  });
  const spread3 = (c) => {
    const n = (c.match(/[\d.]+/g) || []).map(Number).slice(0, 3)
      .map((v) => (v <= 1 ? v * 255 : v));
    return Math.max(...n) - Math.min(...n);
  };
  /* ── A CLOSED EDGE, NOT A ROW OF MARKS ──
     It was dashed on the usual reading, that a broken edge draws a
     thing that is not there yet. On the phone it is a row of short
     marks rather than an edge — the loudest thing about a card whose
     job is to be quiet — and at 14px of radius the dashes break across
     the corners, so the box does not close. Reported as exactly that.

     What still says the card is empty is that it has no GROUND: no
     fill and no shadow where every other card in this app has both,
     which is read without reading an outline at all. */
  ok('an empty day draws one ghost card, closed, saying what it is for',
    ghost.drawn && ghost.edge === 'solid'
    && /what matters/i.test(ghost.says) && ghost.cards === 1, ghost);
  ok('...and its tag is a grey, because a state is never coloured',
    spread3(ghost.tag) < 12, { tag: ghost.tag, spread: spread3(ghost.tag) });
  /* The ghost IS the add control on an empty day, so a second one
     beside it would be two targets for one action — the arrangement
     Showing up removed once already. */
  ok('...and the plus is not drawn beside it, because the ghost is it',
    ghost.add === 0, ghost);

  /* ── AND NO EDGE IN THE APP IS BROKEN ──
     The ghost and the plus are the only outlined boxes here and they
     sit side by side, so a dashed one against a solid one reads as a
     mistake in the drawing rather than as two states. Stated over
     EVERY element on every view rather than as two selectors, which is
     the rule this file already keeps about conic gradients: a
     treatment comes back one element at a time, and a check naming the
     two that have it now walks straight past the third.

     Every side, because a border-bottom is as dashed as a border-top
     and a check reading one of the four is three quarters blind. */
  /* ── AND IT HAS TO HAVE SEEN AN OUTLINED BOX ──
     "No edge is broken" is vacuously true of a screen with no drawn
     borders at all, which is the shape of the check that finds nothing
     and passes for it. The two outlined boxes are the ghost and the
     plus, and exactly one is on screen at a time — the ghost IS the
     add control on an empty day — so what is counted is drawn borders
     rather than either selector. Proved by planting a dashed edge and
     watching the scan report it; the first attempt aimed at .obs-add
     on an empty day, found nothing, and looked exactly like a blind
     check. */
  const brokenEdge = [];
  let outlined = 0;
  /* NOT 'friends': arriving at that board claims a code and makes the
     first request this page is allowed to make, and the assertion this
     whole file is built around is that the week and the tally reach
     nothing. A check that has to break the app's central promise to
     run is a check that has to be narrower. */
  for (const v of ['week', 'tally']) {
    await page.evaluate((vv) => {
      localStorage.setItem('sched.view.v1', vv);
    }, v);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(360);
    const seen = await page.evaluate((vv) => {
      const out = []; let solid = 0;
      for (const e of document.querySelectorAll('*')) {
        if (e.getClientRects().length === 0) continue;
        const c = getComputedStyle(e);
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
          const st = c['border' + side + 'Style'];
          if (st === 'dashed' || st === 'dotted') {
            out.push(vv + ' ' + (e.getAttribute('class') || e.tagName)
              + ' border-' + side.toLowerCase() + ': ' + st);
          } else if (st === 'solid'
            && parseFloat(c['border' + side + 'Width']) > 0) solid++;
        }
      }
      return { out: out, solid: solid };
    }, v);
    brokenEdge.push(...seen.out);
    outlined += seen.solid;
  }
  await page.evaluate(() => { localStorage.setItem('sched.view.v1', 'week'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(360);
  await openDow(4);
  ok('no edge anywhere in the app is broken, and some were looked at',
    brokenEdge.length === 0 && outlined > 0, { brokenEdge, outlined });

  /* ── THE ROW IS THE ONE THING IN THIS APP THAT SCROLLS SIDEWAYS ──
     "Nothing in this app scrolls sideways" was written after a 212px
     board column put a session off the side of the phone and clipped
     "Morning" to "ng" at the left edge. That rule is right and it
     holds everywhere else; this element is a deliberate, approved
     exception, and naming it HERE is what keeps the check live rather
     than relaxing it — the general sweep at the foot of this file
     excludes this id and nothing else.

     It is affordable here because there is nothing to lose off the
     edge: at most five cards, and having two or three is the point of
     the feature. And it BLEEDS to the screen edge, so a cut card is
     cut by the screen and reads as "there is more" rather than as a
     card that has been clipped — measured as the row reaching past
     the poster's own padding. */
  const bleed = await page.evaluate(() => {
    const w = document.getElementById('scObjStrip');
    const card = document.querySelector('.day-card');
    return { row: w.getBoundingClientRect().left,
             card: card.getBoundingClientRect().left,
             ox: getComputedStyle(w).overflowX };
  });
  ok('the row bleeds past the padding, so a cut card is cut by the screen',
    bleed.ox === 'auto' && bleed.row < bleed.card - 8, bleed);

  /* ── DRAWN ON THE WEEK AND NOWHERE ELSE ──
     `[hidden]` HAS TO BE SAID ONCE A THING TAKES A DISPLAY, and this
     app has now shipped that bug five times — the rail, the page
     dots, the toast and the intro each had the attribute set
     correctly throughout while an author `display` outranked the
     browser's own rule. Measured as the BOX, because reading the
     property is what missed it every one of those times. */
  const elsewhere = [];
  for (const v of ['tally', 'friends']) {
    await page.click(`.tab[data-view="${v}"]`);
    await page.waitForTimeout(420);
    elsewhere.push(await page.$eval('#scObjStrip',
      (w) => ({ v: 1, boxes: w.getClientRects().length })));
  }
  await page.click('.tab[data-view="list"]');
  await page.waitForTimeout(420);
  const onWeek = await page.$eval('#scObjStrip', (w) => w.getClientRects().length);
  ok('the row is drawn on the week and on no other screen',
    onWeek > 0 && elsewhere.every((e) => e.boxes === 0),
    { onWeek, elsewhere });

  /* ── AND THE GHOST OPENS THE SHEET ──
     One press from the row to the place you write one, which is the
     whole answer to how you reach objectives without a corner glyph. */
  await openDow(2);
  await page.click('.obs-c.is-ghost');
  await page.waitForTimeout(560);
  /* MEASURED AS A BOX, never as a class: what is claimed is that the
     objectives are on screen, and a sheet that has the open class and
     no height is not. */
  const opened = await page.evaluate(() => {
    const s = document.getElementById('scSheet');
    const r = s ? s.getBoundingClientRect() : null;
    return { drawn: !!r && r.height > 100 && r.width > 100,
             title: (document.getElementById('scSheetTitle') || {}).textContent,
             field: document.querySelectorAll('.sheet input[type=text]').length };
  });
  ok('pressing the ghost opens the sheet, with the field already on it',
    opened.drawn && /objectives/i.test(opened.title || '') && opened.field === 1,
    opened);

  /* ── THE WEEK IS BEHIND A SCRIM, NOT BEHIND A BACKFACE ──
     Everything that used to be asserted here was about a bug the flip
     created: the running row's sweep was an infinite transform, hence
     its own compositor layer, and a composited descendant of a
     backface-hidden ancestor is not reliably culled with it — on iOS
     the whole running row came through the objectives face MIRRORED.
     It was guarded three times, with `backface-visibility`, then
     `visibility`, then `opacity`, because the first two are paint-time
     properties and the bug lives in a layer the compositor draws
     without consulting the paint tree.

     None of that can happen to a sheet. What replaces those checks is
     the one thing that has to be true of any surface over another: the
     week is still there, and it is behind a scrim rather than gone —
     a sheet that removed what is under it would lose your scroll
     position every time you glanced at the objectives. */
  const behind = await page.evaluate(() => {
    const w = document.querySelector('.week');
    const s = document.getElementById('scScrim');
    const sheet = document.getElementById('scSheet');
    const z = (e) => +getComputedStyle(e).zIndex || 0;
    return { week: !!w && !w.hidden && w.getBoundingClientRect().height > 100,
             scrim: !!s && !s.hidden,
             over: !!s && !!sheet && z(sheet) >= z(s) };
  });
  ok('the week is still under it, behind the scrim',
    behind.week && behind.scrim && behind.over, behind);

  /* ── THE ROW IS STILL THERE UNDER THE SHEET ──
     It used to be a control in the head that had to stay drawn and
     named while its own sheet was up, because a control that vanishes
     under what it opened is one you cannot find your way back from.
     The row inherits that claim: the objectives you are editing have
     to still be on the day behind the sheet, or closing it lands you
     somewhere that looks like the edit did nothing. */
  const rowUnder = await page.evaluate(() => {
    const w = document.getElementById('scObjStrip');
    const r = w.getBoundingClientRect();
    return { drawn: !w.hidden && r.height > 20,
             cards: document.querySelectorAll('.obs-c').length };
  });
  ok('the objectives row is still on the day behind the sheet',
    rowUnder.drawn && rowUnder.cards >= 1, rowUnder);

  /* ── writing one ── */
  /* The first add comes from the ghost card, which opens the sheet
     with its field already on it; every one after that comes back
     through scObjRedraw's list view, which has its own Add another.
     One helper for both, so the path a person actually takes is the
     path the test takes. */
  const addObj = async (text) => {
    if (await page.$('.ob-add')) {
      await page.click('.ob-add');
      await page.waitForTimeout(420);
    }
    await page.fill('.sheet input[type=text]', text);
    await page.click('.sheet .btn.go');
    await page.waitForTimeout(520);
  };
  await addObj('Call a hundred clients');
  await addObj('Walk the dog before it gets dark');

  const obs = await page.$$eval('.ob', (b) => b.map((x) => ({
    text: x.querySelector('.ob-t').textContent,
    icon: x.querySelector('.ob-ic').getAttribute('data-icon'),
    frog: x.classList.contains('is-frog'),
    label: x.getAttribute('aria-label'),
  })));
  /* A SENTENCE, and the whole of it. There is no field for how much —
     the amount is already in the words, and a form that asked for it
     separately would make you take a decision apart to type it in. */
  ok('an objective is written out in full',
    obs.length === 2 && obs[0].text === 'Call a hundred clients'
    && obs[1].text === 'Walk the dog before it gets dark', obs);
  /* The glyph comes out of the same sentence, through the app's own
     keyword table — so nothing is set twice and "walk the dog" reaches
     the paw rather than the walker. */
  ok('...with a glyph worked out from those same words',
    obs[0].icon === 'call' && obs[1].icon === 'pet', obs.map((o) => o.icon));
  const icSize = await page.$eval('.ob-ic', (e) => ({
    w: Math.round(e.getBoundingClientRect().width),
    t: Math.round(document.querySelector('.ob-t')
      .getBoundingClientRect().width),
  }));
  /* SMALL, and a marker rather than a picture: the sentence is the
     thing you read, and a glyph that competes with the text it labels
     has stopped labelling it. */
  /* The glyph is the ROW's glyph now — the same 20px mark the
     schedule's rows carry, since an objective is one of the same
     cards — and the sentence still has the width. */
  ok('...small beside it, not competing with it',
    icSize.w <= 22 && icSize.t > icSize.w * 3, icSize);
  ok('the first is the main one, and it is the only one marked',
    obs.filter((o) => o.frog).length === 1 && obs[0].frog, obs);
  /* ── EVERY glyph takes the accent ──
     They were --dim with only the first in red, and marking one of five
     as important said the other four were not. The list is the
     important thing. What that costs is the frog's colour signal, so it
     is carried by stroke WEIGHT and a step of type weight instead —
     quieter than it was, and asserted rather than assumed. */
  const obMarks = await page.evaluate(() => {
    /* Guarded rather than assumed. This threw once — `getComputedStyle`
       on a null — because the row it wanted was not on screen, and a
       TypeError takes the whole file down with no assertion count and
       no evidence about WHY. A missing element is a fact worth
       reporting, so it is reported. */
    const el = (s) => document.querySelector(s);
    const probe = { frog: !!el('.ob.is-frog .ob-ic'),
                    rest: !!el('.ob:not(.is-frog):not(.is-done) .ob-ic'),
                    obs: [...document.querySelectorAll('.ob')]
                      .map((o) => o.className) };
    if (!probe.frog || !probe.rest) return { PROBE: probe };
    const g = (s) => getComputedStyle(document.querySelector(s));
    const frog = g('.ob.is-frog .ob-ic');
    const rest = g('.ob:not(.is-frog):not(.is-done) .ob-ic');
    /* THE ROOT, not the heading. This read its expected value off
       MAIN OBJECTIVES, which was the accent — and the day every title
       in the app went white it would have started asserting that the
       glyphs are --dim. A check that reads what it expects off another
       piece of the design moves with that piece. */
    const red = 'rgb(' + getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim().replace('#', '').match(/\w\w/g)
      .map((x) => parseInt(x, 16)).join(', ') + ')';
    /* The list's heading is the SHEET's title now, so that is what is
       read. `.ob-head b` is gone with the face that had a heading of
       its own, and reading a missing element threw a TypeError that
       took the file down with no assertion count at all. */
    const head = g('#scSheetTitle').color;
    return { frog: frog.stroke, rest: rest.stroke, red, head,
      fw: parseFloat(frog.strokeWidth), rw: parseFloat(rest.strokeWidth),
      ft: g('.ob.is-frog .ob-t').fontWeight,
      rt: g('.ob:not(.is-frog):not(.is-done) .ob-t').fontWeight,
      ink: getComputedStyle(document.documentElement)
        .getPropertyValue('--ink').trim(),
      words: [...document.querySelectorAll(
        '.ob:not(.is-done) .ob-t')].map((t) =>
        getComputedStyle(t).color) };
  });
  ok('every objective\u2019s glyph is in the accent, not just the first',
    obMarks.frog === obMarks.rest && obMarks.rest === obMarks.red, obMarks);
  ok('...so the first is told apart by weight instead',
    obMarks.fw > obMarks.rw && +obMarks.ft > +obMarks.rt, obMarks);
  /* ── AND THE WORDS ARE THE GLYPHS' LESSON AGAIN ──
     The frog had --ink to itself over four --dim rows, which said the
     other four were the ones that did not matter. Every objective you
     have not done is full strength, and the step of weight is the
     whole of what marks the first. Held against the resolved --ink
     rather than a literal, since thirteen palettes move it. */
  ok('every objective\u2019s words are full strength, not just the first',
    obMarks.words.length > 1
    && new Set(obMarks.words).size === 1
    && obMarks.words[0] === await page.evaluate((h) => {
      const p = document.createElement('i');
      p.style.color = h; document.body.appendChild(p);
      const c = getComputedStyle(p).color; p.remove(); return c;
    }, obMarks.ink), obMarks.words);
  ok('...and never by a rank number',
    (await page.$$eval('.ob-n', (n) => n.length)) === 0);

  /* ── THE SHEET NAMES IT, AND THE ACCENT GOES WITH THE FACE ──
     The heading was the one in this app that kept the accent: it named
     a list you had to turn something over to reach, and the colour
     said the list under it was the one you CHOSE rather than the one
     you scheduled. There is nothing to turn over now — the sheet's
     own title bar names it, in the treatment every other sheet in the
     app uses, and a red title on one sheet out of eight would be the
     exception with its reason gone.

     What the accent still marks is the MARKS: every objective's glyph
     wears it, which is the half of that rule about the record rather
     than about a heading. */
  ok('the sheet names the list, and the marks under it keep the accent',
    (await page.$eval('#scSheetTitle', (e) => e.textContent))
      === 'Main objectives' && obMarks.rest === obMarks.red
      && obMarks.frog === obMarks.red, obMarks);

  /* ── re-ranking is one move, and always the same move ── */
  await page.click('.ob-add');
  await page.waitForTimeout(420);
  await page.click('.sheet .ob-edit .btn.off');
  await page.waitForTimeout(560);
  const ranked = await page.$$eval('.ob-t',
    (t) => t.map((x) => x.textContent));
  ok('making one the main objective moves it up, and nothing else moves',
    ranked[0] === 'Walk the dog before it gets dark'
    && ranked[1] === 'Call a hundred clients', ranked);

  /* ── ticking ── */
  await page.click('.ob >> nth=0');
  await page.waitForTimeout(460);
  ok('an objective ticks where it stands',
    await page.$eval('.ob', (b) => b.classList.contains('is-done')
      && b.getAttribute('aria-pressed') === 'true'));
  ok('...and the sheet stays up while you do it',
    await page.$eval('#scSheet', (s) => s.getBoundingClientRect().height > 100));
  /* ── EVERY TICK IN THIS APP IS THE ACCENT ──
     There are four and they are all the same claim: a done objective, a
     done block, a picked workout, and Done today. This one was --ink,
     which on the one face in the app that is not flat made a ticked-off
     objective the same colour as the words it was ticking off. Asked
     for as the resolved --red rather than a literal, since the wheel
     turns it to anything. */
  const obTick = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
      .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
    const t = document.querySelector('.ob.is-done .ob-tick');
    return { stroke: t && getComputedStyle(t).stroke,
      shown: t && +getComputedStyle(t).opacity,
      box: getComputedStyle(document.querySelector('.ob.is-done .ob-box'))
        .backgroundColor,
      accent: rgb('--red'), ink: rgb('--ink') };
  });
  /* THE MARK IS THE CIRCLE, and the tick is the ink on it — which is
     what every other check in this app is now. The accent is still
     what says the thing happened; it has moved from the stroke to the
     ground under it. */
  ok('...and the mark it draws is the accent, like every other tick',
    obTick.shown === 1 && obTick.box === obTick.accent
    && obTick.stroke !== obTick.accent, obTick);
  const objStore = await page.evaluate(() => {
    const o = JSON.parse(localStorage.getItem('sched.obj.v1') || '{}');
    const d = new Date();
    const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
      + '-' + String(d.getDate()).padStart(2, '0');
    return { keys: Object.keys(o), k, mine: o[k] };
  });
  ok('...saved under the DATE, not the weekday',
    objStore.keys.length === 1 && objStore.keys[0] === objStore.k
    && objStore.mine.length === 2 && objStore.mine[0].done === true,
    JSON.stringify(objStore));

  /* ── THE RARE CARD WAS THE LAST THING THAT DID NOT MATCH ──
     The face was a sheen of the accent inside a card with a foil rim,
     and three assertions held that gradient to being mixed from the
     palette rather than written in hex. The whole app became cards on
     a ground, and a panel behind a list of cards is the
     frame-inside-a-frame this project keeps taking back out — so the
     back is the same page as the front showing a different list, and
     the turn is the whole of what says which. What survives is with
     the tile above: nothing in this app sheens any more.

     WHAT SURVIVES IS THE MEASUREMENT: an objective still has to be
     readable on whatever it is drawn on, which is now a card on the
     page rather than words on a wash. Measured on composited pixels,
     and polarity-agnostic. */
  const obInk = await (async () => {
    const box = await page.$eval('.ob:not(.is-done) .ob-t', (e) => {
      const b = e.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const png = PNG.sync.read(await page.screenshot());
    const px = [];
    for (let dy = 1; dy < box.h - 1; dy++) {
      for (let dx = 1; dx < box.w - 1; dx++) {
        const i = (png.width * Math.round((box.y + dy) * dpr)
          + Math.round((box.x + dx) * dpr)) << 2;
        px.push([png.data[i], png.data[i + 1], png.data[i + 2]]);
      }
    }
    const lum = (c) => {
      const f = c.map((v) => { v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
    };
    const ls = px.map(lum).sort((a, b) => a - b);
    const lo = ls[Math.floor(ls.length * 0.05)];
    const hi = ls[Math.floor(ls.length * 0.95)];
    return Math.round(((Math.max(lo, hi) + 0.05) / (Math.min(lo, hi) + 0.05)) * 100) / 100;
  })();
  ok('an objective on its card still clears 4.5:1', obInk >= 4.5, obInk);

  /* ── THE FOIL WENT WITH THE CARD ──
     The face was a sheen inside a card with a light travelling round
     its rim — a masked ring with a conic gradient turning in it, and
     five assertions holding the ring, the loop, the square and the
     pause. What the objectives are now is the page, a heading and a
     list of the same cards every other screen is made of, so there is
     no rim to turn and nothing here to hold. The one thing worth
     keeping from it is stated with the tile above: nothing in this
     app sheens or foils any more. */
  /* ── closing ── */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(520);
  ok('and Escape puts it away, leaving the schedule',
    await page.$eval('#scSheet', (s) => s.hidden
      || s.getBoundingClientRect().height < 40)
    && await page.$eval('.week', (w) => w.getBoundingClientRect().height > 100));
  /* It is NOT remembered. An objective is for today, and a sheet found
     open tomorrow morning is the app having kept the wrong half of a
     decision — the same claim the flip's own check made about a card
     found face-down. */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(340);
  ok('...and the sheet is never found open on the next visit',
    await page.$eval('#scSheet', (s) => s.hidden
      || s.getBoundingClientRect().height < 40));
  /* WITHOUT OPENING ANYTHING, which is the whole change. The
     objectives are drawn on the day, so what was written is on screen
     at rest — a check that had to open a sheet to find them would be
     testing the sheet. */
  const survived = await page.$$eval('.obs-c:not(.is-ghost) .obs-n',
    (n) => n.map((x) => x.textContent));
  ok('...though what was written on it survives, on the day itself',
    survived.length === 2, survived);

  /* ── ONE TAP TICKS ──
     The cheap half of the gesture, and the one somebody does every
     day. Measured through the RECORD as well as the class, because a
     card that takes the accent and writes nothing is a tick that is
     lost on the next reload. */
  /* Asserted as the TOGGLE and as the record AGREEING with it, never
     as "it becomes done". Sections above this one have already ticked
     the first objective, so a check that assumed the card started
     undone would pass or fail on what ran before it — which is this
     file's own lesson about checks that only hold in one state,
     arriving as a fixture rather than as a clock. It reads the card's
     OWN id out of the record, so it cannot be satisfied by some other
     objective having moved. */
  const ticked = await (async () => {
    const id = await page.$eval('.obs-c', (c) => c.dataset.id);
    const before = await page.$eval('.obs-c', (c) => c.classList.contains('is-done'));
    await page.click('.obs-c');
    await page.waitForTimeout(480);
    const after = await page.$eval('.obs-c', (c) => c.classList.contains('is-done'));
    const filed = await page.evaluate((oid) => {
      const o = JSON.parse(localStorage.getItem('sched.obj.v1') || '{}');
      const d = new Date();
      const k = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
                 String(d.getDate()).padStart(2, '0')].join('-');
      const hit = (o[k] || []).find((x) => x.id === oid);
      return hit ? !!hit.done : null;
    }, id);
    return { id, before, after, filed };
  })();
  ok('one tap on a card flips it, and the record follows',
    ticked.after === !ticked.before && ticked.filed === ticked.after, ticked);
  /* Put back, so the sections below this one meet the day they expect.
     A check that changes the state of the app has to put it back. */
  await page.click('.obs-c');
  await page.waitForTimeout(480);

  /* ── AND TWO OPEN THE EDITOR ──
     Asserted as the EDITOR rather than as any sheet: a double tap that
     opened the read-only list would look identical from outside and
     would have taken the way to re-rank and remove with it. */
  await openObj(page);
  const editor = await page.evaluate(() => ({
    rows: document.querySelectorAll('.sheet .ob-edit').length,
    field: document.querySelectorAll('.sheet input[type=text]').length,
    first: document.querySelectorAll('.sheet .ob-edit .btn.off').length,
  }));
  ok('...and two open the editor, where you add, re-rank and remove',
    editor.rows === 2 && editor.field === 1 && editor.first === 1, editor);
  /* AND PUT AWAY AGAIN. A section that leaves a sheet open hands the
     next one a screen with the sheet's own white text sitting behind
     the tab bar — which is exactly how the bar's contrast sweep came
     back at 1.62:1 against a bar that had not changed. The same
     lesson as the overflow check needing its own context: a check
     that changes the state of the app has to put it back. */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(480);

  /* Each view is its own labelled tab, so a view is asked for by
     name rather than reached by pressing a cycling button until it
     turns up. A test that counts presses has to be re-counted every
     time a stop is added, and the one time it is not, it silently
     measures the wrong screen. */
  /* ── TWO TAPS ON A SHOWING UP TILE ──
     The tile is one control: a tap logs and two open the twenty-six
     weeks. It was a long press, and the reason it is not is that a
     hold is invisible — nothing on a tile can say "hold me", and the
     card that had to be built to teach it could teach either gesture.

     Driven through the real handler rather than by calling the
     function behind it, and the wait afterwards clears the 260ms the
     first tap is deferred by. */
  const holdCard = async (id) => {
    await page.dblclick(`.ty-card[data-item="${id}"]`);
    await page.waitForTimeout(420);
  };

  /* ── TWO TAPS ON A WEEK ROW ──
     A tap ticks a block off and two open the editor. Driven through
     the real handler, and the wait clears the 260ms the first tap is
     deferred by. */
  const dblRow = async (sel) => {
    await page.dblclick(sel);
    await page.waitForTimeout(420);
  };

  const show = async (v) => {
    for (let i = 0; i < 3; i++) {
      const at = await page.evaluate(() => ({
        tally: !document.getElementById('scTally').hidden,
        friends: !document.getElementById('scFriends').hidden,
        rail: !document.getElementById('scWeek').hidden,
      }));
      if ((v === 'tally' && at.tally)
          || (v === 'friends' && at.friends) || (v === 'list' && at.rail)) return;
      await page.evaluate((want) => {
        const t = document.querySelector('.tab[data-view="' + want + '"]');
        if (t) t.click();
      }, v);
      await page.waitForTimeout(180);
    }
    throw new Error('could not reach view ' + v);
  };

  /* ── one view at a time, MEASURED rather than asked ──
     `hidden` works by a UA rule of `display: none`, and any author
     `display` beats it. The rail was a plain block for its whole life,
     so setting `hidden` did what it looked like it did; the day it
     became `display: flex` for the deck the attribute silently stopped
     meaning anything, and the week stayed on screen under the friends
     board and the tally. Nothing threw, and the property was still
     being set exactly as before.

     So this asks the LAYOUT, not the property: a real box with real
     area is on screen whatever the attribute says. Reading `.hidden`
     here would have passed throughout the bug — which is precisely
     what the old check did. */
  const onScreen = async () => page.evaluate(() => {
    const box = (id) => {
      const el = document.getElementById(id) || document.querySelector(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    };
    return { rail: box('scWeek'), tally: box('scTally'),
             friends: box('scFriends') };
  });
  for (const [v, want] of [['list', 'rail'],
                           ['tally', 'tally'], ['friends', 'friends']]) {
    await show(v);
    await page.waitForTimeout(160);
    const on = await onScreen();
    ok(`on ${v}, ${want} is the only view drawing`,
      on[want] && ['rail', 'tally', 'friends']
        .filter((k) => k !== want).every((k) => !on[k]), { v, on });
    /* The dots were a sibling of the rail rather than a child, so
       they were a second thing to hide and were the half left behind.
       There is one section per view now and nothing beside it. */
  }
  await show('list');
  await page.waitForTimeout(160);

  /* ── leaving the week and coming back lands on today ──
     Hiding the rail resets its scrollLeft to 0 and fires a scroll event
     on the way out, which the deck's settle handler read as a swipe to
     Monday. Nothing was visibly wrong at the moment it happened — the
     only symptom is the card you find when you return, which is why it
     needs a check that leaves and comes back rather than one that looks
     at the deck standing still. */
  const openName = () => page.$$eval('#scHdDay',
    (d) => d.map((x) => x.textContent).join());
  ok('the week opens on today to begin with',
    (await openName()) === 'Tuesday', await openName());
  for (const away of ['friends', 'tally']) {
    await show(away);
    await page.waitForTimeout(200);
    await show('list');
    await page.waitForTimeout(280);
    ok(`...and is still on today after a trip to ${away}`,
      (await openName()) === 'Tuesday', await openName());
  }
  /* ONE press, and it either opened that day or it did not. The deck
     used to open whichever card ended up nearest the middle of the
     scroller, so this helper scrolled and then corrected — geometry
     standing in for an intention, and a test that had to model the
     geometry to say anything. A press is the whole mechanism now. */
  const goTo = async (dow) => {
    const hit = await page.evaluate((d) => {
      const b = [...document.querySelectorAll('.st-d')]
        .find((x) => +x.dataset.d === d);
      if (!b) return false;
      b.click();
      return true;
    }, dow);
    if (!hit) return false;
    await page.waitForTimeout(420);
    return +(await page.$eval('.week', (e) => e.dataset.d)) === dow;
  };

  /* ── every day opens, in one press ──
     This is the reason the deck stopped opening by geometry. Nearest-
     to-centre cannot choose the first card or the last: a scroller
     stops at 0, and with the open card at 268px against 76px
     neighbours the middle of the rail at that point sits over the THIRD
     card. Monday and Sunday were not awkward, they were unreachable,
     and Tuesday took two swipes. Every day is checked, not just the
     ends, because the ends were only where it showed first. */
  for (const dow of [1, 2, 3, 4, 5, 6, 0]) {
    ok(`one press opens ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow]}`,
      await goTo(dow), await openName());
  }
  /* ── THE DECK'S OWN GEOMETRY WENT WITH THE DECK ──
     Centring a card by moving a track, a window measured against the
     painted floor of the bar and re-measured on every viewport move,
     a press target over each shut card, and a width transition
     between two lengths: five sections of this file, each of them a
     fix for a problem the deck created. One day is drawn now and the
     column it sits in is a flex child, so there is no arithmetic left
     to get wrong and nothing to assert about it.

     What was worth keeping is below: pressing a day opens that day,
     the choice survives leaving the week, and every day is its own
     date. */
  /* ── a day you swiped to survives the trip too ──
     The deck's scrollLeft is reset by hiding it, so coming back has to
     put the open card in the middle again — otherwise the day you chose
     is still `is-open` and 268px wide, sitting off the left of the
     screen with Monday in front of it. Today passes this trivially,
     because centring on today is what a fresh render does anyway; only
     a day you moved to can tell the difference. */
  ok('pressing a card opens it', await goTo(5) && (await openName()) === 'Friday',
    await openName());
  await show('tally');
  await page.waitForTimeout(220);
  await show('list');
  await page.waitForTimeout(320);
  ok('...and it is still the open one after leaving the week',
    (await openName()) === 'Friday', await openName());
  const centred = await page.evaluate(() => {
    const win = document.getElementById('scWeek');
    const el = win.querySelector('.day-card');
    const r = el.getBoundingClientRect(), b = win.getBoundingClientRect();
    return Math.round(Math.abs((r.left + r.width / 2) - (b.left + b.width / 2)));
  });
  ok('...and its rows are on screen where the day you left was',
    centred <= 6, centred);
  /* Put the week back on today for everything that follows. */
  ok('...and it goes back to today when asked', await goTo(2)
    && (await openName()) === 'Tuesday', await openName());

  /* And the card it lands on is one you can actually reach: a deck left
     scrolled to Monday puts today's rows in a 76px column whose own
     container is display:none, so every row measures zero and nothing
     on this screen can be pressed. */
  ok('...with today drawn wide enough to hold its rows',
    await page.$eval('.week', (d) => d.getBoundingClientRect().width) > 200);
  ok('...and its rows on screen',
    await page.$eval('.week.is-today .row[data-id]',
      (r) => { const b = r.getBoundingClientRect();
               return b.width > 100 && b.height > 20; }));

  /* ── EVERY card is its own date ──
     scObjBack resolved a card through scDateOfDow, which is the TICK
     path's resolver: it looks back over the two-day backfill window
     and then returns TODAY. So every card more than two days behind,
     and every day still ahead, read and WROTE today's objectives —
     Friday's card showed today's list, and adding one to Friday added
     it to today.

     The deck is the Monday-first week containing today, so that is
     what a card's date means now. Planted on this week's Monday and
     on this week's Friday, and each has to turn up on its own card
     and on no other. Today is a Tuesday, so one is behind and one is
     ahead — the two halves the old resolver got wrong for different
     reasons. */
  await page.evaluate(() => {
    const iso = (off) => { const d = new Date();
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + off);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
        + '-' + String(d.getDate()).padStart(2, '0'); };
    const o = JSON.parse(localStorage.getItem('sched.obj.v1') || '{}');
    o[iso(0)] = [{ id: 'om', n: 'Monday only', done: false }];
    o[iso(4)] = [{ id: 'of', n: 'Friday only', done: false }];
    localStorage.setItem('sched.obj.v1', JSON.stringify(o));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(260);
  const perDay = await (async () => {
    const out = [];
    for (const d of [0, 1, 2, 3, 4, 5, 6]) {
      await goTo(d);
      /* Read off the ROW rather than out of a sheet. The objectives
         are drawn on the day now, so what this section is about —
         every day carrying its own DATE's list — is visible without
         opening anything, and a walk that opened and shut a sheet
         seven times was measuring the sheet. */
      out.push(await page.evaluate(() => ({
        day: document.getElementById('scHdDay').textContent,
        obj: [...document.querySelectorAll('.obs-c:not(.is-ghost) .obs-n')]
          .map((t) => t.textContent).join('|'),
      })));
    }
    await goTo(2);
    return out;
  })();
  const byName = Object.fromEntries(perDay.map((r) => [r.day, r.obj]));
  ok('a past day’s card carries that day’s objectives',
    byName.Monday === 'Monday only', byName);
  ok('...a day still to come carries its own',
    byName.Friday === 'Friday only', byName);
  ok('...and neither has leaked onto today',
    !/Monday only|Friday only/.test(byName.Tuesday || ''), byName);


  /* ── the bar ──
     Four labelled stops in a glass pill, and the one control that ADDS
     as its own circle beside it. What is asserted is the property, not
     the styling: the pill is translucent and blurred, the tabs carry no
     fill of their own, and the add button is the only filled thing. */
  console.log('\n── the bar ──');
  const bar = await page.evaluate(() => {
    const g = (el) => { const s2 = getComputedStyle(el);
      return { bw: parseFloat(s2.borderTopWidth) + parseFloat(s2.borderLeftWidth),
               bg: s2.backgroundColor, r: s2.borderRadius,
               w: Math.round(el.getBoundingClientRect().width) }; };
    const pill = getComputedStyle(document.querySelector('.tabs'));
    return { tabs: [...document.querySelectorAll('.tab')].map(g),
             prime: g(document.querySelector('.prime')),
             blur: pill.backdropFilter || pill.webkitBackdropFilter,
             tint: pill.backgroundColor };
  });
  const clear = (b2) => b2.bw === 0 && /rgba\(0, 0, 0, 0\)|transparent/.test(b2.bg);
  /* EXACTLY ONE tab carries a fill, and it is the one you are on. The
     first version of this asserted that none of them did and failed on
     the lit tab — which was the assertion being wrong rather than the
     bar. The lozenge is the whole point: at 10px a label that only
     shifts grey is a difference you have to go looking for. */
  ok('exactly one tab is lit, and the rest carry no fill of their own',
    bar.tabs.filter(clear).length === bar.tabs.length - 1, bar.tabs);
  ok('the add button is the one filled control, and it is round',
    !clear(bar.prime) && /50%/.test(bar.prime.r) && bar.prime.w >= 52, bar.prime);

  /* THE PILL IS GLASS, and both halves of that are checked. A blur with
     no tint puts row text straight behind a 10px label; a tint with no
     blur is just a translucent bar and does the same. It needs both. */
  ok('the pill is blurred', /blur\(\d/.test(bar.blur || ''), bar);
  ok('and tinted, not merely transparent',
    /rgba?\(|color\(/.test(bar.tint) && !/rgba\(0, 0, 0, 0\)/.test(bar.tint), bar);

  /* And the labels survive a row passing underneath, which is the only
     state a fixed bar is about. Swept rather than sampled once: one
     scroll offset misses the row that breaks it by four pixels. */
  const swept = await (async () => {
    /* ── THE STATE IS ESTABLISHED, NOT INHERITED ──
       This is about the bar with the WEEK behind it, and it ran on
       whatever the previous section happened to leave up: a sheet was
       open, its --spent text sat behind the "Today" label, and the
       sweep reported 1.62:1 against a bar that had not changed. Three
       runs went into the number before the payload was made to say
       which label and what was behind it — which is the fix worth
       keeping as much as the Escape is. */
    await page.keyboard.press('Escape');
    await page.waitForTimeout(420);
    await page.evaluate(() => document.getElementById('scTabWeek').click());
    await page.waitForTimeout(420);
    let low = 99, at = 0, worst = null;
    for (let y = 0; y <= 200; y += 25) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(60);
      const png = PNG.sync.read(await page.screenshot());
      const px = (x, yy) => { const i = (png.width * Math.round(yy * dpr)
        + Math.round(x * dpr)) << 2; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
      for (const el of await page.$$('.tab span:last-child')) {
        const b2 = await el.boundingBox(); if (!b2) continue;
        const col = (await el.evaluate((e) => getComputedStyle(e).color))
          .match(/[\d.]+/g).slice(0, 3).map(Number);
        const lab = await el.evaluate((e) => e.textContent);
        const near = (q) => Math.abs(q[0] - col[0]) + Math.abs(q[1] - col[1])
                          + Math.abs(q[2] - col[2]) < 110;
        for (let x = 2; x < b2.width - 2; x += 3) {
          for (let yy = 1; yy < b2.height - 1; yy += 1) {
            let ok2 = true;
            for (let d = -2; d <= 2 && ok2; d++)
              if (near(px(b2.x + x + d, b2.y + yy)) || near(px(b2.x + x, b2.y + yy + d))) ok2 = false;
            if (!ok2) continue;
            const r = ratio(col, px(b2.x + x, b2.y + yy));
            /* WHICH label and WHAT was behind it. Without this the
               failure is a bare number and the state that produced it
               has to be guessed at — which cost three runs. Read from
               the pixel buffer rather than the page, because an await
               inside this loop is a round trip per improving sample. */
            if (r < low) { low = r; at = y;
              worst = { lab, col, bg: px(b2.x + x, b2.y + yy) }; }
          }
        }
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const sheetUp = await page.evaluate(() => {
      const s = document.getElementById('scSheet');
      return !!s && !s.hidden;
    });
    return { low: +low.toFixed(2), at, worst, sheetUp };
  })();
  ok(`a label clears 4.5:1 with a row behind it (worst ${swept.low}:1 at ${swept.at}px)`,
    swept.low >= 4.5, swept);

  /* The view survives a reload. Its own key, not folded into the
     schedule: the schedule is the record and this is a preference about
     looking at it, and a damaged record must not take the view with it
     or the other way round. */
  await show('tally');
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(220);
  ok('the tally is still up after a reload',
    await page.evaluate(() => !document.getElementById('scTally').hidden));
  ok('and it is remembered under its own key, away from the schedule',
    await page.evaluate(() => localStorage.getItem('sched.view.v1') === 'tally'
      && !/view/.test(localStorage.getItem('sched.v1') || '')));

  /* ── the ring is gone, and its stored value with it ──
     It drew today as a dial with the running span lit — a second answer
     to the question the week's own card already answers. Nobody may be
     stranded on a view that no longer exists, so a stored 'ring' has to
     fall through to the week rather than leaving a blank screen with a
     bar on it. */
  await page.evaluate(() => localStorage.setItem('sched.view.v1', 'ring'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(220);
  ok('a view that no longer exists lands on the week, not on nothing',
    await page.evaluate(() => {
      const r = document.getElementById('scWeek').getBoundingClientRect();
      return r.width > 1 && r.height > 1
        && !document.querySelector('#scRing, #scTabRing, .sr-wrap');
    }));

  /* Back to a clock inside no block, which the section below inherits.
     It was set here for the ring's own between-blocks case; the freeze
     stays because later assertions were written under it. */
  await page.evaluate(() => {
    const FROZEN = new Date('2026-09-01T14:00:00').getTime();
    const R = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends R {
      constructor(...a) { super(...(a.length ? a : [FROZEN])); }
      static now() { return FROZEN; }
    };
  });
  await show('list');
  await page.waitForTimeout(220);

  /* ── the tabs ──
     It was one button cycling four stops, and the assertion here used
     to be about the cycle's ORDER. There is no cycle: each view is its
     own labelled tab and the one you are on is lit, which is the thing
     the cycling button could never do — its icon had to draw the NEXT
     view, so nothing on screen ever said where you were. */
  const tabs = await page.evaluate(() => {
    const out = [];
    for (const t of document.querySelectorAll('.tab[data-view]')) {
      t.click();
      out.push({ want: t.dataset.view,
                 lit: [...document.querySelectorAll('.tab.on')].map((x) => x.dataset.view) });
    }
    return out;
  });
  ok('every view has its own tab and lights only that one',
    tabs.length === 3 && tabs.every((t) => t.lit.length === 1 && t.lit[0] === t.want), tabs);
  ok('and each one is labelled',
    await page.$$eval('.tab span:last-child',
      (e) => e.map((x) => x.textContent).join(' ')) === 'Week Today Friends');

  /* The ground is a gradient the palette can reach, which on the
     shipped palette resolves to the flat white page it has always been.
     Sampled off a real pixel in a corner nothing is drawn in. */
  await show('list');
  await page.waitForTimeout(180);
  /* ── ASKED FOR, not hardcoded ──
     This sampled (376, 300), which was empty margin when the week was a
     column and is now inside a card: the deck bleeds to both screen
     edges, so the far right at that height is a shut day drawing its 4%
     wash and the sample came back 247,247,247. The fault was the fixed
     coordinate, not the ground — a point picked once for one layout is
     a point that silently starts measuring something else.
     The dots are centred with real page either side of them, so the
     page is asked where its own ground is. */
  const corner = await (async () => {
    /* Sampled beside the day strip, which has real page either side
       of it — the dots it used to be read next to went with the deck. */
    const at = await page.evaluate(() => {
      const d = document.querySelector('.strip').getBoundingClientRect();
      return { x: Math.round(d.left + 2), y: Math.round(d.bottom + 4) };
    });
    const png = PNG.sync.read(await page.screenshot());
    const i = (png.width * Math.round(at.y * dpr) + Math.round(at.x * dpr)) << 2;
    return [png.data[i], png.data[i + 1], png.data[i + 2]];
  })();
  /* ── AND THE DEFAULT GROUND IS THE ONE THE STYLESHEET CARRIES ──
     It was "still flat white paper", asserted as every channel at 255.
     Seven light palettes came out of THEMES in one pass and the base
     :root went with them, so what ships now is near-black with a lime
     wash weighted to the foot. Asserted as DARK with the wash in it
     rather than as three exact numbers: the sample is taken beside the
     page dots, which is inside the gradient, so a literal would be a
     number nobody could re-derive. */
  ok('the default ground is the near-black the stylesheet ships',
    corner.every((c) => c < 90) && Math.max.apply(null, corner) > 4, corner);

  /* ── the bar sits IN the ground, not on it ──
     The gradient is weighted to the foot of the page, which is exactly
     where the bar is — and a bar filled with the flat base colour cuts
     a hard band across the strongest part of it. Both paint the same
     wash `fixed` and both are positioned against the viewport, so the
     two have to resolve to the same pixels at the seam.

     Driven with a wash pushed onto :root rather than with a shipped
     theme, because on the default palette everything is white and the
     assertion would pass on a bar that was still flat. */
  const seam = await (async () => {
    await page.evaluate(() => {
      const r = document.documentElement.style;
      r.setProperty('--g1', 'rgba(246,132,176,1)');
      r.setProperty('--g3', 'rgba(150,110,206,.9)');
    });
    await page.waitForTimeout(160);
    const box = await page.$eval('.bar', (b) => {
      const r = b.getBoundingClientRect();
      return { top: r.top, left: r.left, width: r.width };
    });
    const png = PNG.sync.read(await page.screenshot());
    const at = (x, y) => {
      const i = (png.width * Math.round(y * dpr) + Math.round(x * dpr)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    /* Clear of the 1px hairline on either side, and away from the
       buttons — the far left of the bar is always bare ground. */
    const x = box.left + 6;
    const above = at(x, box.top - 4);
    const below = at(x, box.top + 5);
    return { above, below,
             drift: Math.max(...above.map((c, i) => Math.abs(c - below[i]))) };
  })();
  /* Six of 255 per channel. The wash is a gradient, so the two samples
     are nine pixels apart on it and are not expected to be identical —
     they are expected to be continuous. A flat bar measures in the
     tens. */
  ok(`the bar carries the same wash as the page (${seam.drift}/255 across the seam)`,
    seam.drift <= 6, seam);
  await page.evaluate(() => {
    document.documentElement.style.removeProperty('--g1');
    document.documentElement.style.removeProperty('--g3');
  });

  /* ══ what kind of thing a block is ═════════════════════════
     A glyph per row, worked out from the name you typed. The DRAWING is
     judged by eye at 22px — a check cannot tell you a car reads as a
     car. What a check can hold is everything around it, and all of it
     fails silently: a keyword pointing at a glyph that does not exist
     draws an empty box, an ordering mistake draws the confidently wrong
     glyph, and an <svg> with no width fills its parent at 300x150 while
     still drawing correctly.

     Driven through the app's own store and its own renderer, never by
     calling the matcher — scIconFor lives inside the IIFE, and a test
     that reaches past the wrapper is testing a function rather than the
     screen. */
  console.log('\n── what kind of thing a block is ──');
  {
    const src = require('fs').readFileSync(
      require('path').join(__dirname, '..', 'schedule', 'app.js'), 'utf8');
    const cut = (from, to) => src.slice(src.indexOf(from), src.indexOf(to));
    const all = (s, re) => [...s.matchAll(re)].map((m) => m[1]);
    const drawn = all(cut('var BLOCK_ICON = {', 'var ICON_MATCH'), /^\s{4}([a-z]+):/gm);
    const named = [...new Set(all(cut('var ICON_MATCH = [', 'var ICON_RE'),
      /\['([a-z]+)', \[/g))];

    ok('every glyph a keyword points at is actually drawn',
      named.every((k) => drawn.includes(k)),
      named.filter((k) => !drawn.includes(k)));
    /* The other direction, and it is the one that rots: a glyph nothing
       can reach is dead weight that looks like coverage. `block` is the
       fallback and is reached by returning it, not by a keyword. */
    ok('and every glyph drawn can actually be reached',
      drawn.every((k) => k === 'block' || named.includes(k)),
      drawn.filter((k) => k !== 'block' && !named.includes(k)));
    ok('and there are enough of them to be worth having',
      drawn.length >= 38, drawn.length);

    /* Each of these was a real collision before it was a line in the
       table. First hit wins, so every pair where one phrase contains
       another has to be listed the long way round — and "Train" is the
       gym rather than the railway, which is a DECISION and belongs
       somewhere it can be asserted. */
    const TRY = [
      ['Walk the dog', 'pet'], ['Walk', 'walk'],
      ['Work out', 'train'], ['Deep work', 'work'],
      ['School run', 'drive'], ['Run', 'run'],
      ['Water plants', 'garden'], ['Water', 'water'],
      ['Meal prep', 'cook'], ['Dinner', 'eat'],
      ['Edit photos', 'photo'], ['Journal', 'write'],
      ['Train', 'train'], ['Flight to Milan', 'travel'],
      /* Word boundaries. "bread" contains "read" and "grunt" contains
         "run"; a substring match looked perfect on the seed and
         mislabels the moment anybody types a real sentence. */
      ['Bread', 'block'], ['Grunt', 'block'],
      ['Xylophone recital', 'block'],
    ];
    await page.evaluate((TRY) => {
      const raw = JSON.parse(localStorage.getItem('sched.v1'));
      raw.items = TRY.map((t, i) => ({ id: 'ic' + i, d: 2, s: 400 + i * 20,
                                       e: 415 + i * 20, r: '', n: t[0] }));
      localStorage.setItem('sched.v1', JSON.stringify(raw));
      localStorage.setItem('sched.view.v1', 'list');
    }, TRY);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(280);

    const got = await page.evaluate(() => [...document.querySelectorAll('.row[data-id]')]
      .map((r) => {
        const ic = r.querySelector('.ic');
        const b = ic.getBBox();
        const box = ic.getBoundingClientRect();
        return {
          n: r.querySelector('.n').textContent,
          icon: ic.getAttribute('data-icon'),
          hidden: ic.getAttribute('aria-hidden'),
          marks: ic.children.length,
          /* Half the 1.8 stroke by hand — getBBox reports the path and
             not the ink it is drawn with. */
          fits: [+(b.x - 0.9).toFixed(2), +(b.y - 0.9).toFixed(2),
                 +(b.x + b.width + 0.9).toFixed(2), +(b.y + b.height + 0.9).toFixed(2)],
          w: Math.round(box.width), h: Math.round(box.height),
        };
      }));

    const wrong = got.filter((g, i) => g.icon !== TRY[i][1])
      .map((g, i) => g.n + ' → ' + g.icon);
    ok('the name decides the glyph, and the order decides the ties',
      wrong.length === 0, wrong);
    ok('a name it cannot place gets the clock, never an empty box',
      got.filter((g) => g.icon === 'block').every((g) => g.marks >= 1), got);
    /* An inline <svg> with no width or height falls back to 300x150 and
       fills its parent — silently, and while still drawing the right
       glyph. It has happened once on this screen already. */
    ok('and every glyph is 20px, not the 300x150 an unsized svg becomes',
      got.every((g) => g.w === 20 && g.h === 20), got.map((g) => [g.w, g.h]));
    /* The Steps footprint shipped drawn half a stroke outside its own
       viewBox and the ring clipped a flat line across the top of it. */
    ok('and every glyph is inside its own 24 box, stroke included',
      got.every((g) => g.fits[0] >= 0 && g.fits[1] >= 0
                    && g.fits[2] <= 24 && g.fits[3] <= 24),
      got.filter((g) => g.fits[0] < 0 || g.fits[1] < 0
                     || g.fits[2] > 24 || g.fits[3] > 24).map((g) => [g.icon, g.fits]));
    ok('and it is hidden from a screen reader, which has the name already',
      got.every((g) => g.hidden === 'true'), got[0]);
  }

  /* Put the real week back — everything after this reads the shipped
     blocks by name. */
  await page.evaluate(() => localStorage.removeItem('sched.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  /* ── the tally ──
     Five things a day. Nearly everything below is a MECHANISM rather
     than an appearance: the two records agreeing about one morning, a
     day shutting after two, and a streak that does not reset at
     midnight. None of those show up in a screenshot.

     Driven from a clean slate on the frozen Tuesday, and through the
     real controls — the view button, the real cards, the real editor. */
  console.log('\n── the tally ──');
  await page.evaluate(() => {
    localStorage.removeItem('sched.tick.v1');
    localStorage.removeItem('sched.log.v1');
    localStorage.setItem('sched.view.v1', 'tally');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  const tal = await page.evaluate(() => ({
    up: !document.getElementById('scTally').hidden,
    rail: document.getElementById('scWeek').hidden,
    cards: document.querySelectorAll('.ty-card').length,
    cap: document.getElementById('scTallyCap').textContent,
  }));
  ok('the tally is a third view and it replaces the week',
    tal.up && tal.rail, tal);
  /* SIX, and it was five for a year: Sleep is the number that explains
     the other five, and the only one of them you did not do. */
  ok('six cards, and the list is not editable from anywhere',
    tal.cards === 6, tal);
  ok('and nothing is logged on a fresh day', tal.cap.startsWith('0 of 6 today'), tal);

  /* ── the glyph is the name ──
     The card used to carry `Steps` at 17px bold in one corner and
     nothing in the other. With a mark opposite it the two said the
     same thing, and the word was the half that could go.

     WHAT MUST NOT GO WITH IT is the name in the ACCESSIBLE name — a
     screen reader arriving at this grid would otherwise be handed five
     buttons called "logged" and "Tap". So the check is in two halves:
     nothing draws the word, and every card still says it. */
  const marks = await page.evaluate(() => [...document.querySelectorAll('.ty-card')]
    .map((c) => ({
      item: c.dataset.item,
      svg: !!c.querySelector('.ic'),
      paths: c.querySelectorAll('.ic path').length,
      /* getBBox on the <g> is in the glyph's OWN 24-unit space, before
         the translate that centres it in the ring — so this is the
         drawing measured against the box it was drawn for. Half the
         1.8 stroke is added by hand, because getBBox reports the path
         and not the ink. */
      fits: (() => { const b = c.querySelector('.ic').getBBox(), h = 0.9;
                     return [+(b.x - h).toFixed(2), +(b.y - h).toFixed(2),
                             +(b.x + b.width + h).toFixed(2),
                             +(b.y + b.height + h).toFixed(2)]; })(),
      /* The ring became the circle check beside the card — a sibling,
         because a button inside a button is invalid. */
      ring: !!c.parentElement.querySelector('.chk'),
      label: c.getAttribute('aria-label'),
      sub: c.querySelector('.props .pill').textContent,
    })));
  ok('every card carries a glyph', marks.every((m) => m.svg), marks.map((m) => m.item));
  /* Steps is TWO prints and every other glyph is one drawing. An
     assertion on the count is what stops the pair quietly becoming a
     single foot again. */
  ok('and Steps is a pair of them',
    marks.find((m) => m.item === 'p').paths === 2,
    marks.map((m) => m.item + ':' + m.paths).join());
  ok('and every one of them has a check beside it', marks.every((m) => m.ring));
  /* THE CLIPPING CHECK. Steps sat half a stroke above its own viewBox
     and the ring cut a flat line across the top print — visible, and
     invisible to every other assertion here, because the element was
     present, the right size and the right shape. A drawing that leaves
     the box it was drawn for is decidable from the geometry, so it is
     decided rather than looked at. */
  ok('no glyph is drawn outside the 24-unit box it was drawn for',
    marks.every((m) => m.fits[0] >= 0 && m.fits[1] >= 0
      && m.fits[2] <= 24 && m.fits[3] <= 24),
    marks.map((m) => m.item + ':' + m.fits.join()).join(' '));
  /* The card is the toggle now, so its name leads with what a press
     DOES and the item's own name follows it. Asserted as that exact
     shape rather than as "the name appears somewhere", which passes on
     a label that has stopped saying what the control is for. */
  ok('and every card still SAYS its name, after what pressing it does',
    ['Train', 'Mind', 'Steps', 'Fuel', 'Water']
      .every((n, i) => new RegExp('^(Log|Unlog) ' + n + '\\b').test(marks[i].label)),
    marks.map((m) => m.label.slice(0, 18)).join(' | '));

  /* ── the figure under the ring ──
     A ring says WHETHER and nothing else, so on its own it swallowed
     the only number anybody logs Steps, Fuel and Water for. Asserted
     on the drawn text and on the accessible name, because the first
     version of this screen had the figure in neither. */
  {
    await page.evaluate((d) => {
      localStorage.setItem('sched.tick.v1',
        JSON.stringify({ [d]: { t: 1, p: '12480', w: '2.5' } }));
      localStorage.setItem('sched.view.v1', 'tally');
    }, await page.evaluate(() => {
      const x = new Date();
      return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0')
        + '-' + String(x.getDate()).padStart(2, '0');
    }));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(260);
    const figs = await page.evaluate(() => {
      const g = (id) => {
        const c = document.querySelector('.ty-card[data-item="' + id + '"]');
        return { sub: c.querySelector('.props .pill').textContent,
                 label: c.getAttribute('aria-label') };
      };
      return { p: g('p'), w: g('w'), f: g('f'), t: g('t') };
    });
    ok('a logged number is written under its ring',
      figs.p.sub === '12480' && figs.w.sub === '2.5 L', JSON.stringify(figs));
    ok('...and is in the accessible name too',
      figs.p.label.indexOf('12480') > 0 && figs.w.label.indexOf('2.5 L') > 0,
      figs.p.label);
    /* A do-item has no figure, so its line says where the tick came
       from instead — and an item with nothing logged says nothing
       rather than prompting under a ring that already reads as empty. */
    ok('a thing with no number says where its tick came from',
      figs.t.sub === 'logged' || figs.t.sub.indexOf('from ') === 0, figs.t.sub);
    ok('and one with nothing logged says so, and no number', figs.f.sub === 'not yet', figs.f.sub);
    /* PUT THE DAY BACK. This block seeds three ticks to have figures to
       read, and everything below it opens by asserting a fresh day —
       leaving them seeded broke three assertions that had nothing to do
       with this one. A check that changes the state it ran in owes the
       next one the state it found. */
    await page.evaluate(() => {
      localStorage.removeItem('sched.tick.v1');
      localStorage.removeItem('sched.log.v1');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(260);
  }

  /* The glyph is now the only thing naming the card, so it is a
     graphic that carries meaning: 3:1, WCAG 1.4.11. Measured on
     composited pixels in BOTH card states, because a logged card
     inverts to ink-on-paper and the two are different problems — and
     the opacity is not in the token, so nothing but the pixel knows
     what the eye gets. */
  {
    const { PNG: PNG2 } = require('pngjs');
    const lum2 = ([r, g, b]) => {
      const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
      return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
    };
    const ratio2 = (a, b) => {
      const [x, y] = [lum2(a), lum2(b)].sort((m, n) => n - m);
      return (x + .05) / (y + .05);
    };
    let low = { r: 99 };
    const png = PNG2.sync.read(await page.screenshot());
    const at = (x, y) => {
      const i = (png.width * Math.round(y * 2) + Math.round(x * 2)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    for (const m of await page.$$('.ty-card')) {
      const g = await m.$('.ic');
      const bx = await g.boundingBox();
      const on = await m.evaluate((e) => e.classList.contains('on'));
      /* The card's own ground, sampled clear of the glyph and clear of
         the border; then the stroke, as the pixels furthest from it. */
      const ground = at(bx.x + bx.width + 34, bx.y + bx.height / 2);
      const px = [];
      for (let x = 1; x < bx.width - 1; x++)
        for (let y = 1; y < bx.height - 1; y++) px.push(at(bx.x + x, bx.y + y));
      const gl = lum2(ground);
      px.sort((a, c) => Math.abs(lum2(c) - gl) - Math.abs(lum2(a) - gl));
      const ink = px.slice(0, 24)
        .reduce((z, q) => q.map((c, i) => z[i] + c), [0, 0, 0]).map((c) => c / 24);
      const r = +ratio2(ink, ground).toFixed(2);
      if (r < low.r) low = { r, on };
    }
    ok('the glyph clears 3:1 on the card, measured on pixels',
      low.r >= 3, JSON.stringify(low));
  }

  /* THE LIST IS CODE, NOT DATA. It is what makes a leaderboard over it
     mean anything, so the storage must not carry it — a list that round
     -trips through localStorage is a list a damaged record can change,
     and the whole argument for these five is that they are the same
     five for everyone. */
  /* THE CHECK LOGS AND THE CARD OPENS THE RECORD. Both used to log,
     with the strip beside them opening the history; the strip went with
     the tile, so the two remaining controls each took one job. */
  /* AWAITED, because the first tap of a possible double is deferred:
     a press does not log on the frame it lands, it logs 260ms later
     once nothing has followed it. Read synchronously this came back
     null, on a tap that worked. */
  const stored = await page.evaluate(async () => {
    document.querySelector('.ty-card[data-item="t"]').click();
    await new Promise((r) => setTimeout(r, 420));
    return localStorage.getItem('sched.tick.v1');
  });
  /* Ticking Train opens the workout deck over this screen. Nothing
     below cares which workout it was, so it is dismissed — but it has
     to be dismissed, because the scrim under a sheet takes every press
     that lands on it. */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(360);
  ok('a tick stores the day and the id, and never the list itself',
    /^\{"\d{4}-\d{2}-\d{2}":\{"t":1\}\}$/.test(stored), { stored });

  await page.waitForTimeout(150);
  const linked = await page.evaluate(() => ({
    card: document.querySelector('.ty-card[data-item="t"]').parentElement.className,
    via: document.querySelector('.ty-card[data-item="t"] .props .pill').textContent,
    cap: document.getElementById('scTallyCap').textContent,
    log: localStorage.getItem('sched.log.v1'),
  }));
  ok('ticking an item ticks the block behind it',
    /is-|on/.test(linked.card) && linked.via === 'from Train'
    && /\{"\d{4}-\d{2}-\d{2}":\{".+":1\}\}/.test(linked.log), linked);
  ok('and the count moves with it', linked.cap.startsWith('1 of 6 today'), linked);

  /* ── the link runs the OTHER way too ──
     This is the half that was missing, and the failure it caused is the
     quiet kind: the tally said you had trained and the week still drew
     the block undone. Two records disagreeing about the same morning.
     Driven through the real editor, because that is where the control
     had to go — the row is a <button> and a button inside a button is
     invalid, the same trap the folding panels have a rule about. */
  await show('list');
  await page.evaluate(() => {
    [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Walk')).click();
      /* TWICE: the editor is behind a double tap now. */
      [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Walk')).click();
  });
  await page.waitForTimeout(360);
  const hasToggle = await page.evaluate(() => {
    const m = document.querySelector('.sheet .mark');
    const r = m && m.getBoundingClientRect();
    const f = document.querySelector('.sheet .field').getBoundingClientRect();
    return m ? { text: m.textContent.trim(), on: m.classList.contains('is-on'),
                 pressed: m.getAttribute('aria-pressed'),
                 /* Same box as every other control on the form. As an
                    scBtn it carried flex:1 outside a flex parent and
                    drew 156px wide beside two 172px buttons. */
                 sameWidth: Math.round(r.width) === Math.round(f.width),
                 sameHeight: Math.round(r.height) === Math.round(f.height) } : null;
  });
  ok('a block that feeds one of the five can be marked done in its editor',
    hasToggle && /Done today/.test(hasToggle.text), hasToggle);
  ok('and the toggle is the same box as the fields above it',
    hasToggle && hasToggle.sameWidth && hasToggle.sameHeight, hasToggle);
  /* ── A FILLED CONTROL IS WHITE, AND SO IS THE BUTTON UNDER IT ──
     The accent is for the RECORD — a done block on its row, a done
     objective, a kept day on the tally. A form control is chrome, and
     a sheet whose day chips are white and whose Done toggle and Save
     button are coloured reads as two systems on one form. Measured
     against a day chip in the same sheet AND against the accent, so
     the assertion fails from either side. */
    const onLook = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      const m = document.querySelector('.sheet .mark');
      const was = m.classList.contains('is-on');
      if (!was) m.classList.add('is-on');
      const bg = getComputedStyle(m).backgroundColor;
      if (!was) m.classList.remove('is-on');
      const chip = [...document.querySelectorAll('.sheet .pick')]
        .find((c) => c.getAttribute('aria-pressed') === 'true');
      const go = document.querySelector('.sheet .btn.go');
      return { bg, chip: chip && getComputedStyle(chip).backgroundColor,
        go: go && getComputedStyle(go).backgroundColor,
        accent: rgb('--red'), ink: rgb('--ink') };
    });
    /* ── AND NOW THE ACCENT IS THE INK ──
       This used to hold the two APART: filled controls were white and
       the accent was the hue you turned on a wheel, so `bg !== accent`
       was the whole point. There is no hue any more — every mark the
       app spends on itself is the ink — so the claim inverts, and it
       is still worth making: all three filled controls are one colour,
       and that colour is the ink rather than something near it. */
    ok('Done today, Save and the day chips are one white fill',
      onLook.bg === onLook.ink && onLook.chip === onLook.ink
      && onLook.go === onLook.ink && onLook.accent === onLook.ink, onLook);

  /* ── the asset queries are the assets' own fingerprints ──
     A layout fix was reported still broken twice after it shipped, and
     both times the file on the server was correct: app.js had updated
     on the phone and app.css had not. They are two files with two
     caches and iOS offers no reliable way to bypass one, so "hard
     refresh and see" is not a fix — a changed URL is.

     A hand-bumped number would rot the first time somebody edits the
     CSS and forgets, which is a stale version that LOOKS like
     versioning. So the query has to be the content's own hash, and this
     recomputes it and prints what to paste in when it drifts. */
  {
    const crypto = require('crypto'), fs = require('fs'), pth = require('path');
    const here = (n) => pth.join(__dirname, '..', 'schedule', n);
    const html = fs.readFileSync(here('index.html'), 'utf8');
    const stale = ['app.css', 'app.js'].map((n) => {
      const want = crypto.createHash('sha1')
        .update(fs.readFileSync(here(n))).digest('hex').slice(0, 8);
      const got = (html.match(new RegExp(n.replace('.', '\\.') + '\\?v=([a-f0-9]{8})')) || [])[1];
      return got === want ? null : `${n} should be ?v=${want}, index.html says ?v=${got}`;
    }).filter(Boolean);
    ok('the cache-busting queries match what they name', stale.length === 0, stale);
  }

  /* ── the two time fields, and the box the control keeps ──
     They overflowed their row on iOS through FOUR attempted fixes, all
     of them about grid track sizing. It was never the track. Measured
     on the phone that had it: the tracks came out correct at 175px, the
     field's `width` computed to 175px as told, and its BORDER BOX was
     205px — box-sizing came back content-box in spite of the `*` reset
     at the top of app.css, because Safari's natively-appearing control
     keeps its own metrics. 175 of content plus 28 padding plus 2 border
     is 205, and two of those overflow by 30, which is what it said.

     The proof that it is APPEARANCE rather than specificity: on that
     phone `.grid2 .field` set min-width and max-width in one rule, and
     max-width applied while min-width came back 45px.

     THIS is measurable here, which the track theory never was — that is
     the whole reason four fixes shipped unverified. Chromium sizes the
     control to fit, so no layout assertion could tell the presence of a
     fix from its absence; these read the two properties the control was
     overriding, and both are wrong the moment the fix goes. */
  {
    const fields = await page.evaluate(() => {
      const g = document.querySelector('.sheet .grid2');
      const gb = g.getBoundingClientRect();
      const track = parseFloat(getComputedStyle(g).gridTemplateColumns.split(' ')[0]);
      return [...g.children].map((e) => {
        const s = getComputedStyle(e), r = e.getBoundingClientRect();
        return { box: s.boxSizing, look: s.webkitAppearance || s.appearance,
                 drawn: Math.round(r.width), track: Math.round(track),
                 over: Math.round(r.right - gb.right) };
      });
    });
    ok('the time fields are sized by their border box, not their content',
      fields.length === 2 && fields.every((f) => f.box === 'border-box'), fields);
    ok('and the native appearance is dropped, which is what hands the box over',
      fields.every((f) => f.look === 'none'), fields);
    /* The consequence, and the thing a person actually sees: what is
       drawn is the track, not the track plus the control's padding. */
    ok('so what is drawn is the track itself, and nothing runs past the row',
      fields.every((f) => f.drawn === f.track && f.over <= 0), fields);
  }
  ok('and it says off before it is pressed',
    hasToggle && hasToggle.on === false && hasToggle.pressed === 'false', hasToggle);

  await page.evaluate(() => document.querySelector('.sheet .mark').click());
  await page.waitForTimeout(400);
  const back = await page.evaluate(() => ({
    done: [...document.querySelectorAll('.row.is-done .n')]
      .map((e) => e.textContent.replace(/[A-Z]{2,}$/, '').trim()),
    tick: localStorage.getItem('sched.tick.v1'),
  }));
  ok('marking the block done ticks the item it feeds',
    /"m":1/.test(back.tick), back);
  ok('and the week draws that block as done', back.done.indexOf('Walk') >= 0, back);

  /* EVERY BLOCK GETS THE TOGGLE, including one that feeds none of the
     five. It used to be refused for Trading on the grounds that a done
     state there had no reader — true when the measure filling solid was
     the only mark, and the measure existed to agree with the tally. The
     row draws a tick for any done block now, so the state is visible
     and the refusal was the leftover. */
  await page.evaluate(() => {
    [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Trading')).click();
      /* TWICE: the editor is behind a double tap now. */
      [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Trading')).click();
  });
  await page.waitForTimeout(360);
  const feedsNothing = await page.evaluate(() => {
    const m = document.querySelector('.sheet .mark');
    return { has: !!m, text: m && m.textContent.trim() };
  });
  ok('and so does a block that feeds none of them', feedsNothing.has, feedsNothing);

  /* BEFORE and after, not the state afterwards. Walk was marked done a
     few lines up and its item is already ticked, so reading the whole
     log here would fail on somebody else's tick — the assertion is that
     marking Trading changes NOTHING, which only a delta can say. */
  const tickWas = await page.evaluate(() => localStorage.getItem('sched.tick.v1'));
  await page.evaluate(() => document.querySelector('.sheet .mark').click());
  await page.waitForTimeout(420);
  const trad = await page.evaluate(() => ({
    /* The tick is the mark the measure used to be, and it is what makes
       a done Trading block a state you can see. */
    ticked: [...document.querySelectorAll('.row.is-done')]
      .map((r) => [r.querySelector('.n').textContent.replace(/[A-Z]{2,}$/, '').trim(),
                   !!r.querySelector('.tick')]),
    tick: localStorage.getItem('sched.tick.v1'),
  }));
  ok('a done block that feeds nothing draws its tick',
    trad.ticked.some((t) => t[0] === 'Trading' && t[1]), trad.ticked);
  ok('and marking it moves nothing on the tally',
    trad.tick === tickWas, { was: tickWas, now: trad.tick });

  /* Put it back, so the rows below this see the week they expect. */
  await page.evaluate(() => {
    [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Trading')).click();
      /* TWICE: the editor is behind a double tap now. */
      [...document.querySelectorAll('.week.is-today .row[data-id]')]
      .find((r) => r.querySelector('.n').textContent.startsWith('Trading')).click();
  });
  await page.waitForTimeout(360);
  await page.evaluate(() => document.querySelector('.sheet .mark').click());
  await page.waitForTimeout(400);

  /* ── missed its window ──
     The app knows Train ran 06:30 to 07:30 and that it is 09:30. Saying
     "Tap" there throws away a fact it is already holding. Mind must NOT
     be late on the same clock: Read runs at 21:15 and still could. */
  await page.evaluate(() => {
    localStorage.removeItem('sched.tick.v1');
    localStorage.removeItem('sched.log.v1');
    localStorage.setItem('sched.view.v1', 'tally');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const late = await page.evaluate(() => {
    const g = (id) => {
      const c = document.querySelector('.ty-card[data-item="' + id + '"]');
      return { late: c.parentElement.classList.contains('late'), s: c.querySelector('.props .pill').textContent };
    };
    return { t: g('t'), m: g('m'), w: g('w') };
  });
  /* One word, not a sentence: the line under a ring is a fifth of a
     phone wide and `Missed its window` does not fit it. The fact is
     still on the card's accessible name in full. */
  ok('a block whose window has passed says so', late.t.late
    && late.t.s === 'missed', late);
  ok('but one that can still be satisfied does not', !late.m.late, late);
  ok('and an item with no block behind it never can', !late.w.late, late);

  /* ── the streak ──
     Days you logged ANYTHING, and TODAY NOT BEING LOGGED YET DOES NOT
     BREAK IT. At half past nine the day has not failed, it has not
     happened — and a run that resets every midnight is a run nobody
     keeps. Written straight into storage so a real history exists to
     count, which no amount of clicking in one session can make. */
  const streak = await page.evaluate(() => {
    const pad = (n) => (n < 10 ? '0' : '') + n;
    const day = (back) => { const d = new Date(); d.setDate(d.getDate() - back);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    const rec = {};
    /* Yesterday and the four before it, and nothing today. */
    for (let i = 1; i <= 5; i++) rec[day(i)] = { t: 1 };
    localStorage.setItem('sched.tick.v1', JSON.stringify(rec));
    return day(0);
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const run = await page.evaluate(() => ({
    fig: document.getElementById('scStreakNum').textContent,
    foot: document.getElementById('scTallyFoot').textContent,
  }));
  ok('an unlogged today does not break the run', run.fig === '5days', run);
  /* STREAK, not run — one word for it, everywhere. The panel a TICK's
     row opens says "longest streak", and the foot of the same screen
     saying "longest run" for the same idea is the screen using two
     names for one thing in one glance. */
  ok('and the longest streak is counted, and says “days” only when it is many',
    run.foot === 'Longest streak 5 days.', run);

  /* ── two days, then the day shuts ──
     Unlimited backfill makes a shared number fiction — somebody fills
     in a fortnight on a Sunday night. Asserted on the MECHANISM rather
     than on a control being hidden: the write itself has to be refused,
     or a route that skips the control still gets in. */
  const shut = await page.evaluate(() => {
    const pad = (n) => (n < 10 ? '0' : '') + n;
    const day = (back) => { const d = new Date(); d.setDate(d.getDate() - back);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    const before = localStorage.getItem('sched.tick.v1');
    return { open: day(2), closed: day(3), before };
  });
  ok('a day three back is outside the window', shut.closed !== shut.open, shut);

  /* ══ the history a row opens ══════════════════════════════
     Twenty-six weeks of one item, over the page. Everything here is a
     MECHANISM: how many filters draw the glow, which weekday a column
     lands on, which of the three figures each kind of item gets. None
     of those move in a screenshot of a panel that looks correct.

     Seeded with a real half-year, because the shape of the data is what
     the panel is drawing and an empty one proves nothing. */
  console.log('\n── the history a row opens ──');
  await page.evaluate(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const day = (n) => { const d = new Date(); d.setDate(d.getDate() - n);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    const P = { t: (i) => i % 3 !== 0, m: (i) => i % 7 !== 5,
                p: (i) => i % 4 !== 2, f: (i) => i > 168 ? false : i % 4 !== 1,
                w: (i) => i % 2 === 0 };
    const V = { p: (i) => String(5200 + i * 31), f: (i) => String(1780 + i * 6),
                w: (i) => (1.1 + (i % 20) / 10).toFixed(1) };
    const out = {};
    for (let i = 0; i < 182; i++) {
      const r = {};
      Object.keys(P).forEach((k) => { if (P[k](i)) r[k] = V[k] ? V[k](i) : 1; });
      if (Object.keys(r).length) out[day(i)] = r;
    }
    localStorage.setItem('sched.tick.v1', JSON.stringify(out));
    localStorage.setItem('sched.view.v1', 'tally');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  /* ══════════════════════════════════════════════════════
     THE CARD THAT TEACHES THE GESTURE

     A double tap is invisible: nothing on a tile can say "press me
     twice", and a gesture nobody is told about is a feature that does
     not exist. So there is a card, and it has to be checked for the
     three things that make it one rather than furniture.

     ── AND USING THE GESTURE IS AN EXIT ──
     Somebody who has just opened a record by double tapping has
     learned it more thoroughly than any button press could say. That
     is asserted where it happens, below, because a hint that outlives
     its own lesson is exactly the furniture this app keeps removing. */
  /* ── CLEARED AND RELOADED, BECAUSE EVERY CONTEXT SEEDS IT SEEN ──
     The card dims the whole app and takes every press, so the init
     script marks it seen for the same reason it marks the intro seen.
     This is the one section that wants it, so it is the one section
     that asks for it back. */
  await page.evaluate(() => localStorage.removeItem('sched.hint2.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await show('tally');
  await page.waitForTimeout(300);

  const hint = await page.evaluate(() => {
    /* Measured as a BOX, never as the hidden property. A full-screen
       surface at z-index 68 whose author `display` outranks the
       browser's own [hidden] rule takes every press on the app behind
       it, invisibly — the rail, the dots, the toast and the intro have
       each been through exactly that. */
    const s = document.getElementById('scHint');
    const h = document.querySelector('.gh-card');
    if (!h || s.hidden) return { up: false };
    const sr = s.getBoundingClientRect();
    const r = h.getBoundingClientRect();
    const anim = [];
    h.querySelectorAll('.gh-ic svg *').forEach((e) =>
      e.getAnimations().forEach((a) => anim.push(a.playState)));
    return {
      up: sr.width > 300 && sr.height > 300,
      w: Math.round(r.width),
      says: /double tap/i.test(h.textContent),
      /* Two exits and BOTH say which they are. That is not the hidden
         third state the intro refuses: what it refuses is a way out
         that quietly means "ask me tomorrow" while nothing says so. */
      ok: !!h.querySelector('.gh-ok'),
      never: !!h.querySelector('.gh-never'),
      anim: anim.length,
      running: anim.filter((x) => x === 'running').length,
    };
  });
  ok('a card comes UP over Showing up and says the gesture is two taps',
    hint.up && hint.says && hint.w > 200, hint);
  ok('...and it moves, because a still picture cannot show a gesture',
    hint.anim > 0 && hint.running === hint.anim, hint);
  ok('...and it offers both a close and a never again, each named',
    hint.ok && hint.never, hint);

  /* ── "GOT IT" IS FOR THIS VISIT AND THE OTHER ONE IS FINAL ──
     Both halves, because each passes on the other's bug: a build where
     "Got it" wrote the key would never show it again, and one where
     "Don't show again" did not write it would show it for ever. */
  await page.evaluate(() => document.querySelector('.gh-ok').click());
  await page.waitForTimeout(220);
  const shutNow = await page.evaluate(() => ({
    gone: document.getElementById('scHint').hidden
      && document.getElementById('scHint').getBoundingClientRect().width < 2,
    key: localStorage.getItem('sched.hint2.v1'),
  }));
  ok('“Got it” puts the card away without marking it seen for ever',
    shutNow.gone && shutNow.key === null, shutNow);
  /* Leaving the stop and coming back is a new visit, which is what
     "for now" has to mean if it is to mean anything. */
  await page.evaluate(() => document.getElementById('scTyPat').click());
  await page.waitForTimeout(240);
  await page.evaluate(() => document.getElementById('scTyUp').click());
  await page.waitForTimeout(280);
  ok('...and it is back on the next visit',
    await page.evaluate(() => !!document.querySelector('.gh-card')));
  /* Put away again, and WAITED for: it is a modal, so everything below
     presses tiles that are behind it until it has gone. A check that
     leaves a surface over the screen is a check that breaks the next
     one, which this file has now paid for twice. */
  await page.evaluate(() => document.querySelector('.gh-ok').click());
  await page.waitForFunction(() => document.getElementById('scHint').hidden,
    null, { timeout: 4000 });
  await page.waitForTimeout(160);


  /* ── two targets, and neither inside the other ──
     A <button> inside a <button> is invalid and collapses to one press,
     which would silently make one of them unreachable while looking
     exactly right.

     ── ONE CONTROL A TILE: TAP LOGS, HOLD OPENS THE RECORD ──
     It was the other way round: the card opened the history on a plain
     press and a check beside it logged, which put the rare thing on
     the big target and the daily one on a 20px circle. So the whole
     tile logs now and the twenty-six weeks are behind a hold, and the
     circle is DRAWN rather than pressed — with the card logging too it
     would have been two targets for one action on a 145px tile, which
     is the arrangement this screen removed once already.

     `pointer-events: none` is asserted beside the markup, because a
     span still swallows the press that lands on it and the press that
     lands on it is the one aimed at the mark saying what it will do. */
  const rows = await page.evaluate(() => {
    const r = [...document.querySelectorAll('.ty-row')];
    return {
      n: r.length,
      nested: r.some((x) => x.querySelector('button button')),
      cards: r.every((x) => !!x.querySelector(':scope > .ty-card')),
      chkTag: [...new Set(r.map((x) => x.querySelector('.chk').tagName))],
      chkDead: r.every((x) =>
        getComputedStyle(x.querySelector('.chk')).pointerEvents === 'none'),
      taps: r.map((x) => {
        const a = x.querySelector('.ty-card').getBoundingClientRect();
        return Math.round(Math.min(a.width, a.height));
      }),
      labels: r.map((x) => x.querySelector('.ty-card').getAttribute('aria-label')),
      pressed: r.map((x) => x.querySelector('.ty-card').getAttribute('aria-pressed')),
      hist: r.map((x) => {
        const h = x.querySelector('.ty-hist');
        return h ? h.getAttribute('aria-label') : null;
      }),
    };
  });
  ok('six tiles, each one card', rows.n === 6 && rows.cards, rows);
  ok('and nothing on a tile is a button inside a button', !rows.nested, rows);
  ok('the circle is drawn rather than pressed',
    rows.chkTag.join('') === 'SPAN' && rows.chkDead, rows);
  ok('the card clears 44px for a thumb', rows.taps.every((a) => a >= 44), rows.taps);
  /* The card IS the toggle, so it says what a press does and carries
     the state — and it still speaks the figure, because "logged" alone
     throws away the one thing you came to the screen to read. */
  ok('the card says it logs, and says where it stands',
    rows.labels.every((l) => /^(Log|Unlog) /.test(l || ''))
    && rows.pressed.every((p) => p === 'true' || p === 'false'), rows.labels);

  /* ── AND THE GESTURE IS NEVER THE ONLY WAY IN ──
     A double tap reaches a pointer and nothing else: a keyboard sends
     one activation per press and a screen reader's own gestures are
     already taken. So the route has to exist as a real control.
     Asserted as focusable and NAMED, not merely present: a button with
     no accessible name is one a screen reader announces as nothing. */
  /* Named rather than worded alike: Mind opens a wall rather than the
     26-week map the other five share, and its own control says so
     rather than claiming a span it does not draw. */
  ok('every tile carries a real history control for a keyboard, and it is named',
    rows.hist.length === 6
    && rows.hist.every((l) => /26 weeks of history/.test(l || '') || /Mind/.test(l || '')),
    rows.hist);
  const reach = await page.evaluate(() => {
    const h = document.querySelector('.ty-hist');
    h.focus();
    const r = h.getBoundingClientRect();
    return { focused: document.activeElement === h,
             w: Math.round(r.width), h: Math.round(r.height) };
  });
  ok('...and it is reachable and drawn once focused, never display:none',
    reach.focused && reach.w > 20 && reach.h > 10, reach);
  await page.evaluate(() => document.activeElement.blur());

  /* ── PRESSED THE WAY A THUMB PRESSES IT ──
     A hold, driven as real pointer events, because the handler is what
     has to open the panel rather than a call to the function behind
     it. 700ms clears the 550 the gesture waits for. */
  /* ── THE TWO GESTURES, EACH ASSERTED NOT TO DO THE OTHER'S JOB ──
     Both halves, because each passes on the other's bug: a build where
     the tap still opened the history passes "a hold opens it", and one
     where the hold does nothing passes "a tap logs". Steps is used
     because it is a NUMBER — tapping it opens the sheet that asks for
     one, so the tap has a visible answer that is not the history. */
  const gest = await page.evaluate(() => ({
    veil: !document.getElementById('scTyVeil').hidden,
    logged: !!document.querySelector('.ty-row[data-item="p"].is-on'),
  }));
  /* 260 is EXACTLY what the double tap defers a first press by, so
     this waited for the deferral and then asserted the thing the
     deferral does — a check decided by whichever of the two won the
     frame. Past it, not on it. */
  await page.click('.ty-card[data-item="p"]');
  await page.waitForTimeout(500);
  const tapped = await page.evaluate(() => ({
    veil: !document.getElementById('scTyVeil').hidden,
    sheet: !document.getElementById('scSheet').hidden,
  }));
  ok('a tap on a tile logs it and does NOT open the record',
    !tapped.veil && tapped.sheet, { gest, tapped });
  /* The tap above left a sheet up; it has to be gone before anything
     else is measured, or the next check reads THAT one. */
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForFunction(() => document.getElementById('scSheet').hidden,
    null, { timeout: 4000 });
  await page.waitForTimeout(160);

  /* ── AND THE FIRST TAP WAITS ──
     A second press cannot be recognised without waiting for it, so a
     log lands 260ms after the finger leaves rather than on the frame.
     That is the cost of the gesture and it is asserted, not assumed: a
     build that acted immediately would open the number sheet on the
     first tap of a double and the second would land on the sheet. */
  const deferred = await page.evaluate(async () => {
    const was = !document.getElementById('scSheet').hidden;
    document.querySelector('.ty-card[data-item="f"]').click();
    const at0 = !document.getElementById('scSheet').hidden;
    await new Promise((r) => setTimeout(r, 420));
    return { was, at0, after: !document.getElementById('scSheet').hidden };
  });
  ok('...and the first tap waits for a possible second',
    deferred.was === false && deferred.at0 === false
    && deferred.after === true, deferred);
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForFunction(() => document.getElementById('scSheet').hidden,
    null, { timeout: 4000 });
  await page.waitForTimeout(160);

  /* ── AND THE SHEET HAS TO BE GONE BEFORE THE NEXT GESTURE ──
     Waited for rather than slept past. Escape left the number sheet up
     for longer than the 240ms this first allowed, so the hold that
     followed put its pointerdown on the SCRIM and its pointerup on the
     card — which reported as the hold not working, on an app where it
     works. A check that leaves a surface over the screen is a check
     that breaks the next one. */
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForFunction(() =>
    document.getElementById('scSheet').hidden
    && document.getElementById('scScrim').hidden, null, { timeout: 4000 });
  await page.waitForTimeout(200);

  await holdCard('p');
  const holdRes = await page.evaluate(() => ({
    veil: !document.getElementById('scTyVeil').hidden,
    cells: document.querySelectorAll('.ty-cal rect').length,
    sheet: !document.getElementById('scSheet').hidden,
  }));
  /* AND THE HOLD MUST NOT ALSO DO THE TAP'S JOB. The click that ends
     the gesture is swallowed by an explicit flag; without it the
     finger lifting logs the thing you were only looking at. */
  ok('two taps open the record and do NOT log it',
    holdRes.veil && holdRes.cells > 100 && !holdRes.sheet, holdRes);
  /* USING IT IS THE THIRD EXIT, and the best one: the card exists to
     teach a gesture, and the gesture has just been used. */
  ok('...and using the gesture retires the card that taught it',
    await page.evaluate(() => localStorage.getItem('sched.hint2.v1')) === '1');
  /* Using it wrote the key, so the screen is clear for what follows —
     but said out loud rather than relied on, because the assertion
     above is what makes it true and an assertion is not a fixture. */
  await page.evaluate(() => localStorage.setItem('sched.hint2.v1', '1'));
  await page.evaluate(() => document.getElementById('scTyVeil').click());
  await page.waitForTimeout(240);

  await holdCard('p');

  /* ── ONE FILTER, NOT ONE HUNDRED AND EIGHTY-TWO ──
     The whole argument for drawing the glow this way is that every lit
     day gets its own falloff at the cost of a fixed number of filter
     passes. Counting filters against lit days is what says so, and it
     is exactly what a screenshot cannot say: the sketch that put a
     larger low-alpha rect behind each cell looked nearly identical. */
  const glow = await page.evaluate(() => {
    const cal = document.querySelector('.ty-cal');
    const kids = [...cal.children].filter((e) => e.tagName !== 'defs');
    return {
      filters: cal.querySelectorAll('defs filter').length,
      blurs: [...cal.querySelectorAll('feGaussianBlur')]
        .map((e) => +e.getAttribute('stdDeviation')),
      groups: cal.querySelectorAll('g[filter]').length,
      lit: cal.querySelectorAll('rect[fill*="--red"]').length,
      /* Order matters: the blurred copies have to be painted BEFORE the
         solid marks or the glow sits on top of what it is lighting. */
      lastIsSolid: kids[kids.length - 1].tagName === 'rect',
      groupsBeforeSolid: kids.findIndex((e) => e.tagName === 'g') <
                         kids.findIndex((e, i) => e.tagName === 'rect' && i > 40),
    };
  });
  ok('the glow is a fixed number of filter passes, not one per day',
    glow.filters === 2 && glow.groups === 2 && glow.lit > 200, glow);
  ok('and it is two passes — a tight core and a wide falloff',
    glow.blurs.length === 2 && Math.max(...glow.blurs) > Math.min(...glow.blurs) * 2,
    glow.blurs);
  ok('and the blurred copies are painted behind the solid marks',
    glow.lastIsSolid, glow);

  /* ── ONE MARK, THREE SIZES, ONE COLOUR ──
     The ring, the strip beside it and the calendar it opens are the
     same claim drawn at three scales, so they move together or the
     screen says one thing in two colours. It was --ink at all three,
     which on a page whose ink is white made a kept day and a piece of
     type the same object.

     Asked for as the RESOLVED accent rather than a literal — the wheel
     turns it to anything — and the unlit mark is measured in the same
     breath, because a rule that painted everything the accent would
     pass a check that only looked at the lit ones. Losing the misses
     is the one thing a record of showing up must never do. */
  const tyMark = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const hex = (k) => cs.getPropertyValue(k).trim().toLowerCase();
    const rgb = (h) => 'rgb(' + h.replace('#', '').match(/\w\w/g)
      .map((x) => parseInt(x, 16)).join(', ') + ')';
    /* The ring is the circle check, filled on a kept item, and the
       row's own strip is gone with the tile — so the calendar in the
       history sheet is the whole of the record this measures. */
    const a1 = document.querySelector('.ty-row.is-on > .chk');
    const c1 = document.querySelector('.ty-cal');
    if (!a1 || !c1) return { probe: [!!a1, !!c1] };
    const arc = getComputedStyle(a1).backgroundColor;
    const cal = [...c1.querySelectorAll(':scope > rect')].map((r) => r.getAttribute('fill'));
    return { red: rgb(hex('--red')), off: rgb(hex('--tick-off')), arc,
      calLit: cal.filter((f) => f === 'var(--red)').length,
      calOff: cal.filter((f) => f === 'var(--tick-off)').length,
      other: cal.filter((f) => f !== 'var(--red)' && f !== 'var(--tick-off)') };
  });
  ok('the check and the calendar both draw a kept day in the accent',
    tyMark.arc === tyMark.red && tyMark.calLit > 0
    && tyMark.other.length === 0, tyMark);
  ok('...and a missed one is still drawn, in neither',
    tyMark.calOff > 0 && tyMark.red !== tyMark.off, tyMark);

  /* ── weeks across, weekdays DOWN ──
     Without the first day's own weekday as a column offset, every
     column is a rolling seven days and the row a given day sits in
     drifts — which destroys the one thing the shape is good for. The
     assertion is that today lands on today's weekday row. */
  const grid = await page.evaluate(() => {
    /* `:scope > rect` — the DAYS, not the glow. The blurred copies are
       grown and therefore offset by half the difference, so counting
       every rect in the svg finds fourteen rows rather than seven and
       picks a glow rect as "today". They live inside a <g>; the days do
       not. */
    const cal = document.querySelector('.ty-cal');
    const days = [...cal.querySelectorAll(':scope > rect')];
    const ys = [...new Set(days.map((r) => +r.getAttribute('y')))].sort((a, b) => a - b);
    const last = days[days.length - 1];
    if (!last) return { EMPTY: cal.outerHTML.slice(0, 300), n: cal.children.length };
    return { rows: ys.length, cells: days.length,
             todayRow: ys.indexOf(+last.getAttribute('y')),
             dow: new Date().getDay() };
  });
  ok('the calendar is seven rows deep and today sits on today’s weekday',
    grid.rows === 7 && grid.todayRow === grid.dow && grid.cells === 182, grid);

  /* ══════════════════════════════════════════════════════════
     A DAY OFF

     The week is a template and that is what makes it a shape. What it
     could not say is that THIS Monday is not: a holiday, a swapped
     shift, an injury. The only tool was deleting the block, which
     changes every Monday there will ever be.

     Two halves, and the first needs no new record at all:

     — A day the item was never ON the schedule is not a day you missed
       it. The strip read tickLog and nothing else, so Train on a
       three-day-a-week schedule drew four misses every week for ever.
     — And a block can be off for ONE date, which is the exception the
       first half cannot express.
     ══════════════════════════════════════════════════════════ */
  console.log('\n── a day off ──');
  {
    /* EVERYTHING THIS SECTION WRITES IS PUT BACK. It replaces the week
       and the whole tick log, and every section below reads both — a
       fixture that leaves the furniture where it found it is the
       difference between this and a dozen unrelated failures. */
    const kept = await page.evaluate(() => ['sched.v1', 'sched.tick.v1']
      .map((k) => [k, localStorage.getItem(k)]));

    /* Train on three weekdays only, which the starter week does not
       do — the seed puts every block on every day, so the derivable
       half is invisible on it and a check written against the seed
       would pass on code that never looked at the schedule. */
    const shape = await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('sched.v1'));
      const keep = [1, 3, 5];
      st.items = st.items.filter((it) => it.n !== 'Train' || keep.indexOf(it.d) >= 0);
      localStorage.setItem('sched.v1', JSON.stringify(st));
      /* Every Train day ticked, so what is left to measure is the days
         it was not on. */
      const pad = (n) => String(n).padStart(2, '0');
      const log = {};
      for (let i = 0; i < 182; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        if (keep.indexOf(d.getDay()) < 0) continue;
        log[d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())] = { t: 1 };
      }
      localStorage.setItem('sched.tick.v1', JSON.stringify(log));
      localStorage.removeItem('sched.off.v1');
      localStorage.setItem('sched.view.v1', 'tally');
      return st.items.filter((it) => it.n === 'Train').map((it) => it.d);
    });
    ok('the fixture trains three days a week, not seven',
      shape.join(',') === '1,3,5', shape);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await holdCard('t');
    await page.waitForTimeout(300);

    const read = () => page.evaluate(() => {
      const cal = document.querySelector('.ty-cal');
      const rects = [...cal.querySelectorAll(':scope > rect')];
      const w = rects.map((r) => +(+r.getAttribute('width')).toFixed(2));
      const full = Math.max(...w);
      return {
        cells: rects.length,
        lit: rects.filter((r) => r.getAttribute('fill') === 'var(--red)').length,
        miss: rects.filter((r) => r.getAttribute('fill') === 'var(--tick-off)'
          && +r.getAttribute('width') === full).length,
        skip: rects.filter((r) => r.getAttribute('fill') === 'var(--tick-off)'
          && +r.getAttribute('width') < full).length,
        /* Every small mark is the NEUTRAL. A third state drawn in a
           third colour would be the app inventing a judgement for the
           one state that is not one. */
        smallLit: rects.filter((r) => r.getAttribute('fill') === 'var(--red)'
          && +r.getAttribute('width') < full).length,
        figs: [...document.querySelectorAll('.ty-stats b')].map((b) => b.textContent),
        hint: document.querySelector('.ty-hint').textContent,
      };
    });
    const three = await read();
    /* 182 days, 78 of them a Mon/Wed/Fri. The exact split moves with
       what weekday the suite runs on, so this asserts the SHAPE: every
       cell is one of the three states, the skipped ones are about four
       sevenths of the window, and none of them is lit. */
    ok(`a day it was never on is drawn small and neutral (${three.skip} of ${three.cells})`,
      three.cells === 182 && three.skip > 90 && three.skip < 115
      && three.lit + three.miss + three.skip === 182 && three.smallLit === 0, three);
    /* The strip beside the row drew the same three states and is gone
       with the tile, so the calendar is the only place they are drawn
       and the assertion above is the whole of it. */
    /* THE FIGURES ARE ABOUT YOU, NOT ABOUT THE SCHEDULE. Every Train
       day ticked and none missed: seven days a week out of the days it
       was on, a streak that never breaks, and a foot that counts the
       days it was on rather than 182. Counted as misses these read
       3.0, a longest streak of 1, and "78 of 182". */
    ok(`with every session kept, it says seven days a week (${three.figs.join(' / ')})`,
      three.figs[2] === '7.0' && +three.figs[0] > 20 && +three.figs[1] > 20, three.figs);
    ok(`and the foot counts the days it was on, not 182 (${three.hint})`,
      /^\d+ of \d+ days/.test(three.hint)
      && +three.hint.split(' of ')[1].split(' ')[0] === three.lit
      && +three.hint.split(' of ')[1].split(' ')[0] < 182, three.hint);

    /* ── AND THE EXCEPTION, WHICH THE SCHEDULE CANNOT EXPRESS ──
       One block, one date. Planted through the key rather than pressed,
       because the control is measured on the week below and what is
       being checked here is that the record reaches the figures. */
    await page.keyboard.press('Escape');
    await page.waitForTimeout(160);
    await page.evaluate(() => {
      const st = JSON.parse(localStorage.getItem('sched.v1'));
      const train = st.items.filter((it) => it.n === 'Train');
      const pad = (n) => String(n).padStart(2, '0');
      const off = {}, tick = JSON.parse(localStorage.getItem('sched.tick.v1'));
      /* The most recent day Train was on, which is a day the fixture
         ticked — so this is a KEPT day being taken out of the record
         rather than a miss, and the lit count has to fall. */
      for (let i = 0; i < 14; i++) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const b = train.filter((x) => x.d === d.getDay())[0];
        if (!b) continue;
        const k = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
        off[k] = { [b.id]: 1 };
        delete tick[k];
        break;
      }
      localStorage.setItem('sched.off.v1', JSON.stringify(off));
      localStorage.setItem('sched.tick.v1', JSON.stringify(tick));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await holdCard('t');
    await page.waitForTimeout(300);
    const one = await read();
    ok(`one block off for one date moves one cell (${three.skip} → ${one.skip})`,
      one.skip === three.skip + 1 && one.lit === three.lit - 1
      && one.miss === three.miss, { three, one });
    /* THE STREAK IS SKIPPED OVER, NOT BROKEN. That is the whole point:
       a day you were never going to train is not a day you failed to,
       so it neither breaks a run nor extends one. Counted as a miss
       this reads a longest streak in single figures. */
    /* THE STREAK RUNS THROUGH IT. The day taken out is the most recent
       one Train was on, so counted as a miss "days on now" would be 0
       and the week rate would fall under seven. Skipped, the run
       carries on across it — one day shorter, because there is one
       fewer day in it, which is a different thing from broken. */
    ok(`and the streak runs through it rather than breaking (${one.figs.join(' / ')})`,
      one.figs[2] === '7.0' && +one.figs[1] > 20
      && +one.figs[0] === +three.figs[0] - 1, { three, one });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(160);

    await page.evaluate((rows) => {
      localStorage.removeItem('sched.off.v1');
      rows.forEach(([k, v]) => {
        if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
      });
    }, kept);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    ok('and the week and the record are put back for what follows',
      await page.evaluate(() => JSON.parse(localStorage.getItem('sched.v1'))
        .items.filter((it) => it.n === 'Train').length === 7
        && !localStorage.getItem('sched.off.v1')));
  }

  /* ── AND ON THE WEEK, WHERE YOU SET IT ── */
  {
    /* Put back at the end, view included. The section after this one
       opens a tally strip, and a block that leaves the app on the week
       hands it a screen with no .ty-row on it — which reports as a
       thirty-second timeout rather than as a fixture that did not tidy
       up after itself. */
    const held = await page.evaluate(() => ['sched.tick.v1', 'sched.log.v1', 'sched.view.v1']
      .map((k) => [k, localStorage.getItem(k)]));
    await page.evaluate(() => localStorage.setItem('sched.view.v1', 'list'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(360);
    const open = async (name) => {
      await page.evaluate((n) => {
        [...document.querySelectorAll('.week.is-today .row[data-id]')]
          .find((r) => r.querySelector('.n').textContent.startsWith(n)).click();
      /* TWICE: the editor is behind a double tap now. */
      [...document.querySelectorAll('.week.is-today .row[data-id]')]
          .find((r) => r.querySelector('.n').textContent.startsWith(n)).click();
      }, name);
      await page.waitForTimeout(420);
    };
    /* Marked DONE first, so the exclusivity below is a state being
       cleared rather than a state that was never set. */
    await open('Train');
    await page.click('.sheet .mark:not(.mark-off)');
    await page.waitForTimeout(520);
    const marks = await page.evaluate(() => ({
      done: !!JSON.parse(localStorage.getItem('sched.log.v1') || '{}')[
        Object.keys(JSON.parse(localStorage.getItem('sched.log.v1') || '{}'))[0]],
      hrs: document.getElementById('scHdDate').textContent }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await open('Train');
    const sheet = await page.evaluate(() => ({
      order: [...document.querySelectorAll('.sheet .mark')].map((m) => m.textContent.trim()),
      /* A control's HEADING is part of what it says. It went in below
         the workout picker once, under a label reading TRAINED, and
         read as a second thing to train. */
      heads: [...document.querySelectorAll('.sheet .label')].map((l) => l.textContent),
      /* Not a tick. Every tick in this app is the accent and they all
         say one thing — this happened. A day off is the only state on
         the screen that is not a claim about doing anything. */
      bar: document.querySelector('.sheet .mark-off svg path').getAttribute('d') }));
    ok('Off sits under the day\u2019s own heading, beside Done and above Trained',
      sheet.order[0] === 'Done today' && sheet.order[1] === 'Off this day'
      && sheet.heads.indexOf('This day') < sheet.heads.indexOf('Trained')
      && !/l\d/.test(sheet.bar), sheet);

    await page.click('.sheet .mark-off');
    await page.waitForTimeout(560);
    const off = await page.evaluate(() => {
      const r = [...document.querySelectorAll('.week.is-today .row[data-id]')]
        .find((x) => x.querySelector('.n').textContent.startsWith('Train'));
      const cs = getComputedStyle(r.querySelector('.n'));
      const log = JSON.parse(localStorage.getItem('sched.log.v1') || '{}');
      return { cls: r.className, line: cs.textDecorationLine,
        hrs: document.getElementById('scHdDate').textContent,
        tick: !!r.querySelector('.tick'),
        done: Object.keys(log).some((d) => Object.keys(log[d]).length),
        off: !!localStorage.getItem('sched.off.v1') };
    });
    ok('a block off for the day is struck out, never removed',
      off.off && /is-off/.test(off.cls) && /line-through/.test(off.line), off);
    /* A block that is not on cannot be running and cannot be behind
       you: both of those are claims about a thing that was going to
       happen. */
    ok('...and it is neither running nor behind you',
      !/is-now/.test(off.cls) && !/is-past/.test(off.cls), off);
    /* Done and off are opposite claims about one block on one day, so
       setting either clears the other — both standing would leave a row
       struck out AND ticked. */
    ok('...and it clears the done mark rather than standing beside it',
      !off.done && !off.tick, off);
    ok(`...and it comes out of the day\u2019s hours (${marks.hrs} → ${off.hrs})`,
      off.hrs !== marks.hrs, { marks, off });

    /* ── IT REACHES FURTHER FORWARD THAN DONE DOES ──
       You cannot mark something done before it happens; a day off is
       exactly the thing you set in advance. Measured on a day the
       strip reaches that is not today — Done is refused there and Off is
       not, which is the whole difference between the two resolvers. */
    const ahead = await page.evaluate(() => {
      /* THE WEEKDAY WHOSE MOST RECENT OCCURRENCE IS FOUR DAYS BACK,
         worked out rather than picked. scDateOfDow looks BACKWARD over
         the two-day window, so "the far end of the deck" is not the
         same thing as "outside the window" — on a Tuesday the deck's
         last card is Sunday and Sunday was two days ago, which IS open.
         Four back is outside it on every day of the week. */
      const w = (new Date().getDay() + 3) % 7;
      [...document.querySelectorAll('.st-d')]
        .find((b) => +b.dataset.d === w).click();
      return w;
    });
    await page.waitForTimeout(520);
    /* Two clicks, because the row's editor is behind a double tap now.
       Dispatched back to back rather than through page.dblclick, since
       this section is driving a day that is not today. */
    await page.evaluate(() => {
      const r = document.querySelector('.row[data-id]');
      r.click(); r.click();
    });
    await page.waitForTimeout(440);
    const far = await page.evaluate(() => ({
      marks: [...document.querySelectorAll('.sheet .mark')].map((m) => m.textContent.trim()),
      heads: [...document.querySelectorAll('.sheet .label')].map((l) => l.textContent) }));
    /* AND DONE IS NOT OFFERED THERE, WHICH IT WAS. scDateOfDow falls
       back to TODAY for a weekday outside the two-day window, and the
       comment on it said scTallyOpen refuses that on the way in —
       scTallyOpen(today) is true, so it never did. "Done today" drew on
       all seven cards, and pressing it on Friday's card from a Tuesday
       marked TODAY done, for Friday's block, which then rendered back
       through the same fallback and looked entirely correct. A round
       trip through one wrong answer is self-consistent, which is why
       nothing ever showed. */
    ok(`a card Done cannot reach still offers Off (weekday ${ahead})`,
      far.marks.indexOf('Off this day') >= 0
      && far.marks.indexOf('Done today') < 0, far);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    /* ── AND THE TOAST IS NOT A WHITE SLAB ──
       It was --ink on --paper, which inverted the page — right for
       exactly as long as the page was white. The day the light
       palettes went it became a full-width white bar over a near-black
       screen, on every save. It is the sheet's own surface now, with
       the sheet's own hairline: the same answer that replaced the 3px
       white strip above the workout deck. */
    const toast = await page.evaluate(() => {
      const t = document.getElementById('scToast') || document.querySelector('.toast');
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      return { bg: getComputedStyle(t).backgroundColor, fg: getComputedStyle(t).color,
        ink: rgb('--ink'), paper: rgb('--paper') };
    });
    ok('the toast wears the page rather than inverting it',
      toast.bg !== toast.ink && toast.fg === toast.ink, toast);

    await page.evaluate((rows) => {
      localStorage.removeItem('sched.off.v1');
      rows.forEach(([k, v]) => {
        if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
      });
    }, held);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
  }


  /* ── the three figures are not the same three for every item ──
     Two of the five are ticks and three are numbers: a tick has no
     average to take. And Fuel is the one number you do NOT want more
     of, so calling its biggest day "your best" would be praise for the
     wrong thing. */
  const figs = {};
  /* Mind is not in this loop any more: it opens a wall of covers
     rather than the tick/number heat map every other item shares, and
     its own shape is tested where it is built. */
  for (const id of ['p', 'f', 'w', 't']) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
    await holdCard(id);
    await page.waitForTimeout(200);
    figs[id] = await page.evaluate(() => ({
      title: document.querySelector('.ty-title').textContent,
      caps: [...document.querySelectorAll('.ty-stats span')].map((e) => e.textContent),
      units: [...document.querySelectorAll('.ty-stats b i')].map((e) => e.textContent),
      hint: document.querySelector('.ty-hint').textContent,
    }));
  }
  /* ── A STREAK IS A TICK'S FIGURE, AND ONLY A TICK'S ──
     It sat on the numbers too, where it counted the days you RECORDED
     one rather than anything about the number — for Sleep, the longest
     run of nights you remembered to type a figure in. That is a fact
     about your logging, and the foot of the same panel already states
     it better as "121 of 182 days". Asserted as ABSENT from every
     number, because putting it back is one line. */
  ok('a streak is a tick’s figure and no number carries one',
    figs.t.caps.includes('longest streak')
    && ['p', 'f', 'w'].every((k) => !figs[k].caps.includes('longest streak')),
    Object.fromEntries(Object.entries(figs).map(([k, f]) => [k, f.caps])));
  ok('a tick gets shape rather than an average it cannot have',
    figs.t.caps.join('|') === 'longest streak|days on now|days a week', figs.t.caps);
  /* THE MIDDLE, THE TOP AND THE BOTTOM OF ONE DISTRIBUTION — three
     readings of the same quantity, which is what the ticks' three are
     of a shape. And all three carry the unit, or 2,631 and 2.7 are
     unreadable beside each other. */
  ok('a number gets the middle, the top and the bottom of its own spread',
    figs.p.caps.join('|') === 'average a day|your best|your lowest'
    && figs.f.caps.join('|') === 'average a day|your highest|your lowest',
    [figs.p.caps, figs.f.caps]);
  ok('but a calorie count’s biggest day is not called your BEST',
    figs.f.caps[1] === 'your highest'
    && !Object.values(figs).some((f) => f.caps.includes('your best') && f.title === 'Fuel'),
    figs.f.caps);
  ok('and the unit rides the figure, so 2,631 and 2.7 are not read alike',
    figs.f.units.length === 3 && figs.f.units[0] === 'kcal'
    && figs.w.units[0] === 'L' && figs.t.units.length === 0,
    { f: figs.f.units, w: figs.w.units, t: figs.t.units });
  ok('and the span is the same 26 weeks on every one of them',
    Object.values(figs).every((f) => / of 182 days/.test(f.hint)), figs.w.hint);

  /* The glyph check below reads whatever is currently open, and the
     loop above leaves Water's — a NUMBER's three, which is the shape
     this check is about. Reopened explicitly so it does not depend on
     which item the loop happened to visit last. */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  await holdCard('w');
  await page.waitForTimeout(200);

  /* ── a glyph per figure ──
     Drawn at 12px beside a 10.5px caption, which is half the size the
     row glyphs get — so the same two things are checked as there, for
     the same reasons: an unsized inline <svg> falls back to 300x150 and
     fills its parent while still drawing correctly, and a shape drawn
     outside its own viewBox is clipped silently. */
  {
    const marks = await page.evaluate(() => [...document.querySelectorAll('.ty-stats span')]
      .map((s) => {
        const g = s.querySelector('svg');
        if (!g) return null;
        const b = g.getBBox(), r = g.getBoundingClientRect();
        return { cap: s.textContent.trim(), hidden: g.getAttribute('aria-hidden'),
                 w: Math.round(r.width), h: Math.round(r.height),
                 fits: [+(b.x - 1.05).toFixed(2), +(b.y - 1.05).toFixed(2),
                        +(b.x + b.width + 1.05).toFixed(2),
                        +(b.y + b.height + 1.05).toFixed(2)] };
      }));
    ok('every figure’s caption carries a glyph',
      marks.length === 3 && marks.every(Boolean), marks);
    ok('and each is 12px, not the 300x150 an unsized svg becomes',
      marks.every((m) => m && m.w === 12 && m.h === 12), marks);
    ok('and each is inside its own 24 box, stroke included',
      marks.every((m) => m && m.fits[0] >= 0 && m.fits[1] >= 0
        && m.fits[2] <= 24 && m.fits[3] <= 24),
      marks.filter((m) => m && (m.fits[0] < 0 || m.fits[2] > 24)));
    ok('and it is hidden from a screen reader, which has the caption',
      marks.every((m) => m && m.hidden === 'true'), marks);
    /* The captions across the two kinds each get their own mark, so a
       copy-paste that gave two figures the same glyph is caught.
       Collected over every item rather than the one on screen. */
    const paths = {};
    for (const id of ['t', 'p', 'f']) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      await holdCard(id);
      await page.waitForTimeout(200);
      (await page.evaluate(() => [...document.querySelectorAll('.ty-stats span')]
        .map((s) => [s.textContent.trim(),
                     s.querySelector('svg').innerHTML.slice(0, 40)])))
        .forEach(([cap, d]) => { paths[cap.replace(/^\d+ /, '')] = d; });
    }
    const kinds = Object.keys(paths);
    ok('every caption either kind can show is marked', kinds.length === 7, kinds);
    /* SEVEN CAPTIONS, SIX MARKS, and the pair is deliberate: "your best"
       and "your highest" are the same figure, named without the praise
       on the one number you do not want more of. They share a glyph
       because they ARE one — asserting seven distinct marks would be
       asserting that the wording change made it a different figure. */
    ok('and the marks are six, because two of the captions are one figure',
      new Set(Object.values(paths)).size === 6,
      Object.entries(paths).map(([k, v]) => k + ' → ' + v.slice(0, 18)));
    /* AND THE TOP AND THE BOTTOM ARE MIRRORS, which is the one place
       this file's rule about two glyphs sharing a silhouette does not
       apply: they sit side by side and are the two ends of one figure,
       so reading as a pair is the point. Asserted as distinct anyway —
       a mirror is not a copy, and pointing both at the peak is the
       copy-paste this whole block exists to catch. */
    ok('and the peak and the trough are a mirrored pair, not the same path',
      paths['your lowest'] !== paths['your best']
      && paths['your lowest'].includes('M2.6 4.6')
      && paths['your best'].includes('M2.6 19.4'),
      { low: paths['your lowest'], best: paths['your best'] });
    ok('and it is the best/highest pair that shares one',
      paths['your best'] === paths['your highest']
      && paths['your best'] !== paths['average a day'],
      { best: paths['your best'], highest: paths['your highest'] });
  }

  /* ── the misses have to stay visible ──
     A wider halo was measured and rejected because its falloff reached
     into the gaps and greyed the unlit days out. That is the one thing
     a record of showing up must never lose, so it is measured on
     composited pixels rather than trusted to the constants. */
  {
    const { PNG: PNG3 } = require('pngjs');
    const png = PNG3.sync.read(await page.screenshot());
    const at = (x, y) => { const i = (png.width * Math.round(y * 2)
      + Math.round(x * 2)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
    const lin = (c) => { c /= 255;
      return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
    const lum = (p) => .2126 * lin(p[0]) + .7152 * lin(p[1]) + .0722 * lin(p[2]);
    const cell = await page.evaluate(() => {
      const cal = document.querySelector('.ty-cal');
      const b = cal.getBoundingClientRect();
      const vb = cal.viewBox.baseVal;
      const s = Math.min(b.width / vb.width, b.height / vb.height);
      const ox = b.x + (b.width - vb.width * s) / 2 - vb.x * s;
      const oy = b.y + (b.height - vb.height * s) / 2 - vb.y * s;
      /* An unlit day and a lit one, taken from the SVG's own geometry
         rather than eyeballed off the picture. */
      const pick = (want) => [...cal.querySelectorAll('rect')].find((r) =>
        (r.getAttribute('fill') || '').includes(want));
      /* Null-tolerant, and that is not defensive noise: pick() looks
         the marks up BY FILL, so the day the lit mark's colour moves it
         finds nothing — and a bare r.getAttribute then throws inside
         page.evaluate, which takes the whole FILE down rather than
         failing one assertion. It did exactly that when the marks went
         from --ink to the accent: two hundred assertions after this
         point never ran, and the output read as a crash. A check that
         cannot fail cleanly cannot be trusted to have run. */
      const mid = (r) => r && ({ x: ox + (+r.getAttribute('x') + 4.7) * s,
                                 y: oy + (+r.getAttribute('y') + 4.7) * s });
      return { off: mid(pick('tick-off')), on: mid(pick('--red')) };
    });
    const found = !!(cell.off && cell.on);
    const panel = found ? at(cell.off.x, cell.off.y - 26) : [0, 0, 0];
    const off = found ? at(cell.off.x, cell.off.y) : [0, 0, 0];
    const on = found ? at(cell.on.x, cell.on.y) : [0, 0, 0];
    const sep = Math.abs(lum(off) - lum(panel));
    /* .2 between lit and unlit, and it was .3 when the mark was --ink.
       White is a free win there; the accent is not, and the number that
       replaces it is the one the wheel actually guarantees — every
       accent sits at a luminance of at least .26 and --tick-off at .035.
       Written to the floor rather than to what lime happens to measure,
       which is .75. */
    ok('a missed day is still a mark, not swallowed by its neighbours’ glow',
      found && sep > .02 && Math.abs(lum(on) - lum(off)) > .2,
      { found, panel, off, on, sep: +sep.toFixed(3) });
  }

  /* ── it closes, three ways, and never outlives its view ──
     The panel lives OUTSIDE the tally section, which is what stops the
     section's `hidden` from stranding it — and is exactly why leaving
     the view has to close it by hand. */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(160);
  const shutEsc = await page.evaluate(() => document.getElementById('scTyVeil').hidden);
  await holdCard('t');
  await page.waitForTimeout(180);
  await page.click('.ty-veil', { position: { x: 6, y: 6 } });
  await page.waitForTimeout(160);
  const shutTap = await page.evaluate(() => document.getElementById('scTyVeil').hidden);
  const stranded = await page.evaluate(() => {
    document.querySelector('.ty-row .ty-card').click();
    document.querySelector('.tab[data-view="list"]').click();
    return { veil: document.getElementById('scTyVeil').hidden,
             gone: document.getElementById('scWeek').getBoundingClientRect().height > 1 };
  });
  ok('escape closes it, and takes the panel before the sheet',
    shutEsc === true, { shutEsc });
  ok('and tapping the page behind it closes it too', shutTap === true, { shutTap });
  ok('and leaving the view cannot strand it over another screen',
    stranded.veil && stranded.gone, stranded);

  /* ── every string on the glass, all the way round the wheel ──
     MEASURED, NEVER READ OFF THE CASCADE. The panel is --g0 at 82% over
     a blurred page over whatever the theme's own three washes put
     there; the arithmetic only knows about --g0, and this repo has
     already shipped one thing that passed the arithmetic and measured
     2.92:1 on screen.

     AND POLARITY-AGNOSTIC, OR NONE. It was written when seven of the
     thirteen palettes were light, and taking a low percentile as ink
     and a high one as ground compared the track against itself on over
     half of them — this repo has made that exact mistake in three
     separate harnesses, the last reporting a label at 1.05:1 that was
     really 7.64:1. Ground is the most common pixel in the patch and
     ink is whatever is furthest from it in luminance, which is right
     whichever way round it is. It stays that way with one dark page,
     because what was wrong was the mechanism rather than the answer.

     THIRTEEN PALETTES BECAME A WHEEL, so this walks the wheel instead.
     The ground no longer moves and the accent reaches this glass
     through --g1, the wash the page itself is painted with — so the
     hues below are the thing that varies, and there are more of them
     than there were palettes. */
  {
    const { PNG: PNG4 } = require('pngjs');
    const palettes = [0, 33, 66, 100, 124, 160, 200, 240, 270, 300, 316, 340];

    /* lum and ratio are this file's own, at the top — one definition of
       the arithmetic, so a fix to it reaches every measurement here. */
    const pair = (png, b) => {
      const seen = new Map(), px = [];
      for (let y = Math.round(b.y * 2); y < Math.round((b.y + b.height) * 2); y++)
        for (let x = Math.round(b.x * 2); x < Math.round((b.x + b.width) * 2); x++) {
          const i = (png.width * y + x) << 2;
          const p = [png.data[i], png.data[i + 1], png.data[i + 2]];
          px.push(p);
          const k = (p[0] >> 2) + ',' + (p[1] >> 2) + ',' + (p[2] >> 2);
          const e = seen.get(k);
          if (e) e.n++; else seen.set(k, { n: 1, p });
        }
      let ground = null;
      seen.forEach((e) => { if (!ground || e.n > ground.n) ground = e; });
      const gl = lum(ground.p);
      let ink = ground.p, far = -1;
      px.forEach((p) => { const d = Math.abs(lum(p) - gl); if (d > far) { far = d; ink = p; } });
      return ratio(ink, ground.p);
    };

    /* 4.5:1 for the type, 3:1 for the marks. */
    const WANT = [['.ty-title', 4.5], ['.ty-span', 4.5], ['.ty-stats b', 4.5],
                  ['.ty-stats span', 4.5], ['.ty-hint', 4.5]];
    const low = {};
    for (const theme of palettes) {
      /* The view goes back with every reload. The block above this one
         leaves the app on the RING — it proves the panel cannot be
         stranded by switching there — so without this the first
         palette reloads onto a screen with no rows and waits 30s for a
         strip that is not on it. */
      await page.evaluate((t) => {
        localStorage.setItem('sched.accent.v1', String(t));
        localStorage.setItem('sched.view.v1', 'tally');
      }, theme);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(240);
      await holdCard('f');
      await page.waitForTimeout(220);
      const png = PNG4.sync.read(await page.screenshot());
      for (const [sel, want] of WANT) {
        const r = pair(png, await page.locator(sel).first().boundingBox());
        if (!low[sel] || r < low[sel].r) low[sel] = { r: +r.toFixed(2), theme, want };
      }
      const cal = await page.locator('.ty-cal').boundingBox();
      const r = pair(png, { x: cal.x + cal.width * .45, y: cal.y + cal.height * .3,
                            width: 26, height: 20 });
      if (!low.marks || r < low.marks.r) low.marks = { r: +r.toFixed(2), theme, want: 3 };
      await page.keyboard.press('Escape');
    }
    const bad = Object.entries(low).filter(([, v]) => v.r < v.want);
    ok('every string and mark on the glass clears its ratio, at all '
      + palettes.length + ' points on the wheel', bad.length === 0, low);
  }

  await page.evaluate(() => {
    localStorage.removeItem('sched.accent.v1');
    localStorage.setItem('sched.view.v1', 'tally');
    localStorage.removeItem('sched.tick.v1');
    localStorage.removeItem('sched.log.v1');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  /* ── the rounding rule, and the things it lets through ──
     Rounded corners are the exception in this app, and the exceptions
     are named in app.css. Worth measuring, because an exception nothing
     checks is just a rule that stopped being true — the next rounded
     surface would inherit these ones' permission silently. Everything
     not on the list stays square. */
  const round = await page.evaluate(() => {
    const r = (el) => parseFloat(getComputedStyle(el).borderTopLeftRadius);
    const q = (sel) => document.querySelector(sel);
    const others = ['.row', '.day-card', '.sheet', '.btn', '.field',
                    '.poster', '.toast', '.day-name']
      .map((sel) => { const e = q(sel); return e ? [sel, r(e)] : null; })
      .filter(Boolean).filter(([, v]) => v > 0);
    return { cards: [...document.querySelectorAll('.ty-card')].map(r),
             pill: r(q('.tabs')), tab: r(q('.tab')), panel: r(q('.ty-panel')),
             prime: getComputedStyle(q('.prime')).borderRadius,
             face: getComputedStyle(q('.tab-face')).borderRadius,
             others };
  });
/* ONE exception now, not two. The tally's cards were the other, and
     they were argued for on the grounds that a photograph could one day
     BE the card — nothing ever posted one there, and the screen is five
     rings now. An exception that stops being needed should be given
     back rather than kept, so this asserts the cards are SQUARE. */
  ok('the named exceptions are rounded — the bar’s pill and its tabs',
    round.pill >= 20 && round.tab >= 15, round);
  /* The second, and it is NAMED in app.css rather than smuggled in
     under the two circles' permission: a pane of glass held above the
     page, where a square corner would read as a crop of the page rather
     than as a separate object. */
  ok('and the glass a row opens, which is the other one',
    round.panel >= 20, round);
  ok('and the tally has handed its exception back',
    round.cards.length === 6 && round.cards.every((v) => v === 0), round.cards);
  ok('and the two circles are circles — the add button and your picture',
    /50%/.test(round.prime) && /50%/.test(round.face), round);
  /* EVERYTHING IS A CARD NOW, and a card has corners. What the rule
     became is a SCALE: every radius in the app is one of a short list,
     so a stray 9px or 20px is still a slip. */
  const SCALE = [5, 8, 12, 14, 16, 18, 22, 26];
  ok('and everything else that is rounded takes a radius from the scale',
    round.others.every(([, v]) => SCALE.includes(v)), round.others);

  /* ── AND THE SAME RULE FOR SHADOW, WHICH HAS ONE EXCEPTION ──
     The idiom is a Swiss timetable and nothing in it casts. The day
     card is the one thing that does, on the argument written beside
     it in app.css: a timetable is printed ON the paper, and the deck
     is a hand of cards HELD above it. An exception nothing checks is
     just a rule that stopped being true, which is exactly why the
     rounding list above exists — so this is the same list for the
     other half of the idiom.

     Read as "casts something", not as a string: the value carries
     three shadows and the inset specular hairline, and a check
     written against the literal would fail on any tuning of it while
     passing on a card that had quietly stopped casting. */
  const shade = await page.evaluate(() => {
    /* A CAST IS A BLUR, and that distinction is the whole check. An
       inset value is a highlight drawn inside the box, and an outer
       one with no blur — `0 0 0 1px` — is a RING: a hairline border
       written as a shadow, which is what the toast uses for its edge
       and what several surfaces here would use if asked. Counting
       either as a cast makes this assert "has a box-shadow", which is
       not the rule. Only an outer shadow with a real blur throws
       anything. */
    const cast = (sel) => { const e = document.querySelector(sel);
      if (!e) return null;
      const v = getComputedStyle(e).boxShadow;
      if (!v || v === 'none') return 0;
      return v.split(/,(?![^(]*\))/)
        .filter((part) => !/inset/.test(part))
        .filter((part) => {
          const px = part.match(/-?[\d.]+px/g) || [];
          return px.length >= 3 && parseFloat(px[2]) > 0;
        }).length;
    };
    /* `.wk-front` and `.wk-back` are gone with the flip; the sheet is
       the surface that used to be the back, and it is the one thing on
       this screen genuinely above the page. */
    return { face: cast('.wk-front'), toast: cast('.toast'),
      row: cast('.row'), tyRow: cast('.ty-row'), back: cast('.wk-back'),
      others: ['.day-card', '.poster', '.ty-card', '.chk']
        .map((sel) => [sel, cast(sel)])
        .filter(([, v]) => v > 0) };
  });
  /* TWO named exceptions, and the second was already here unnamed. The
     day card casts because the deck is a hand of cards held above the
     page rather than a region printed on it. The toast casts for the
     same reason and always did — it is a transient surface over the
     whole app, and it had no note beside it saying so, which is how
     an exception becomes a precedent nobody argued for. */
  /* ── AND NOW NOTHING ON THE WEEK CASTS BUT THE TOAST ──
     The rows were the card material for one design and stopped being
     cards when the time became a column: a slab with a gutter outside
     it puts the figure and the name it belongs to on two different
     surfaces, so the rows are hairline-separated rows on one sheet.

     The toast is the whole of what is left, and it is the ORIGINAL
     exception rather than a new one — a transient surface over the
     app, which is the one thing on this screen that is genuinely
     above the page rather than on it.

     Asserted in both directions. "The toast casts" alone passes on a
     build where everything casts, which is the state this replaced. */
  ok('the toast is the only thing on the week that casts',
    shade.toast >= 1 && shade.row === 0 && shade.tyRow === 0
    && !shade.face && !shade.back, shade);
  ok('...and the scroller, the poster and the press targets inside a card cast nothing',
    shade.others.length === 0, shade);

  /* Put the week back, and clear what this section wrote. Everything
     after it reads .row, and a section that leaves the app on another
     view hands the next one a screen with no rows on it — which reports
     as thirteen unrelated failures and a timeout. */
  await page.evaluate(() => {
    localStorage.removeItem('sched.tick.v1');
    localStorage.removeItem('sched.log.v1');
    localStorage.setItem('sched.view.v1', 'list');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const restored = await page.evaluate(() => ({
    rail: document.getElementById('scWeek').hidden,
    tally: document.getElementById('scTally').hidden,
    rows: document.querySelectorAll('.row[data-id]').length,
    view: localStorage.getItem('sched.view.v1'),
    sched: (localStorage.getItem('sched.v1') || '').slice(0, 40),
  }));
  ok('and the week is back for what follows', !restored.rail, restored);

  /* ── themes ──
     Seven palettes, and the whole point of the exercise is that each is
     a COMPLETE set rather than an accent swapped on a white page. So
     every one is driven through the real picker and then measured on
     composited pixels, exactly as the shipped palette is at the top of
     this file — a grey that reads 8.9:1 on white is 1.4:1 on indigo,
     and a palette that reuses another palette's greys has not been
     checked, it has been guessed. */
  /* ── your picture ──
     A face by default, drawn from the palette rather than stored. The
     claim being checked is that it is DERIVED: change theme and the
     face has to change with it, or it is a copy of a token and this
     repo has now paid for four of those. */
  console.log('\n── your picture ──');
  await show('list');
  await page.click('#scTabYou');
  await page.waitForTimeout(340);
  const pic = await page.evaluate(() => {
    const el = document.querySelector('.pic-item .pic');
    const cs = getComputedStyle(el);
    return { round: cs.borderRadius,
             marks: el.querySelectorAll('svg circle, svg path').length,
             tile: el.querySelector('svg rect').getAttribute('fill'),
             on: el.querySelector('svg circle').getAttribute('fill'),
             me: getComputedStyle(document.documentElement).getPropertyValue('--me').trim(),
             dim: getComputedStyle(document.documentElement)
               .getPropertyValue('--tick-off').trim(),
             fig: getComputedStyle(document.documentElement)
               .getPropertyValue('--spent').trim() };
  });
  ok('your picture is round', pic.round === '50%', pic);
  /* ── A SILHOUETTE, NOT A FACE ──
     It was a coloured disc with two eyes and a mouth — a face per
     person, generated from a colour they picked. A picture of NOBODY
     is what an empty avatar should be; a generated face is a small
     claim about somebody who has not made one. Two marks now, a head
     and a pair of shoulders. */
  ok('and with no photo it is a silhouette — a head and a pair of shoulders',
    pic.marks === 2, pic);
  /* ── AND IT IS THE FLAT NEUTRAL, NOT A COLOUR ──
     There is no swatch row any more, so a face drawn from a chosen
     colour would be drawn from a colour nobody chose. This app's rule
     is that colour says WHICH; with nothing left to say it takes the
     neutral pair every other mark on a neutral surface uses.

     Asserted as NOT --me as well as as the neutral, because "it is
     grey" passes on a build where --me happens to be grey. */
  ok('drawn in the flat neutral, and not in any colour of yours',
    pic.tile.toLowerCase() === pic.dim.toLowerCase()
    && pic.on.toLowerCase() === pic.fig.toLowerCase()
    && pic.tile.toLowerCase() !== pic.me.toLowerCase(), pic);

  /* MOVED, because the line above passes on a face painted with the
     shipped hex typed in as a literal. */
  const faceMoved = await page.evaluate(() => {
    document.documentElement.style.setProperty('--tick-off', '#4FE0A8');
    document.documentElement.style.setProperty('--spent', '#04141A');
    document.querySelector('.pic-item').click();
    const el = document.querySelector('.sheet .pic svg');
    const got = { tile: el.querySelector('rect').getAttribute('fill'),
                  on: el.querySelector('circle').getAttribute('fill') };
    document.documentElement.style.removeProperty('--tick-off');
    document.documentElement.style.removeProperty('--spent');
    return got;
  });
  ok('and it follows those tokens when they are changed under it',
    faceMoved.tile === '#4FE0A8' && faceMoved.on === '#04141A', faceMoved);

  /* ── THE SHOULDERS RUN OFF THE BOTTOM EDGE ──
     Which is the whole of what makes it a person rather than a
     lollipop: the picture is clipped to a circle, so a figure that
     ended inside the box would read as two separate shapes. Asserted
     on the path, so a later tidy-up cannot quietly tuck it in — the
     arc has to reach the 100 the viewBox ends at. */
  const fig = await page.evaluate(() => {
    const d = document.querySelector('.sheet .pic svg path').getAttribute('d');
    const c = document.querySelector('.sheet .pic svg circle');
    return { d, head: { cy: +c.getAttribute('cy'), r: +c.getAttribute('r') } };
  });
  ok('the shoulders run off the bottom edge, and the head sits clear of them',
    /100/.test(fig.d) && fig.head.cy + fig.head.r < 60, fig);

  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForTimeout(340);

  console.log('\n── the accent ──');
  await page.waitForTimeout(200);

  /* ── THIRTEEN PALETTES BECAME ONE GROUND AND A WHEEL ──
     Every one of the thirteen moved --paper, --ink and both greys
     together, so each was a page to solve and a page to measure — and
     twelve of them were the shipped page with a different hue over it.
     What is chosen now is the hue and nothing else, which is why this
     is a wheel: a list of thirteen names is a list somebody else wrote,
     and there was never a reason yours had to be on it.

     Asserted as the ABSENCE of the chips as well as the presence of the
     wheel. A picker that drew both would pass a check on either. */
  await page.click('#scTabYou');
  await page.waitForTimeout(320);
  /* ── THERE IS NO WHEEL, AND NOTHING SETS A COLOUR ──
     It was the sixth rounded thing in the app and it set the one hue
     the app spent on itself: every tick, every filled control, the
     progress line and today's own name. Those are the INK now, so the
     wheel has nothing to set and a control that sets nothing is a
     setting you can get wrong and never see.

     What is coloured is a TAG, and a tag's colour says WHICH thing it
     is — the three sessions, the six items on Showing up, the nine
     workouts. None of those is a preference, so none of them belongs
     in Settings.

     Asserted as ABSENT in three ways, because each passes on the
     others' bug: no wheel, no chips left over from the thirteen
     palettes that preceded it, and no stored key deciding a colour
     nothing draws. */
  const noWheel = await page.evaluate(() => ({
    wheel: document.querySelectorAll('.cw, .cw-wrap, .cw-mid, .cw-k').length,
    chips: document.querySelectorAll('.theme, .theme-h').length,
    accKey: localStorage.getItem('sched.accent.v1'),
    oldKey: localStorage.getItem('sched.theme.v1'),
    /* And the label that named it. A wheel removed while its heading
       stays is a Settings screen with a section that is not there. */
    labels: [...document.querySelectorAll('.sheet .label')]
      .map((l) => l.textContent),
  }));
  ok('there is no wheel, no palette chips and no stored accent',
    noWheel.wheel === 0 && noWheel.chips === 0
    && noWheel.accKey === null && noWheel.oldKey === null
    && !noWheel.labels.some((l) => /accent/i.test(l)), noWheel);

  /* ── THE TOKENS ARE THE APP'S, AND NOTHING SETS THEM ──
     FIXED, MOVES and readTokens went with the wheel: they existed to
     watch which tokens a press on the ring was allowed to change, and
     nothing changes any token now.
     There was a wheel, and this whole section drove it: press the
     ring, watch --red and --on-red move and every other token hold
     still, then measure all 360 hues against the page. There is no
     wheel — the accent is the ink — so what is left to hold is that
     the two are ONE colour rather than two that happen to match, and
     that nothing in Settings can change it. */
  const tone = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const g = (k) => cs.getPropertyValue(k).trim().toLowerCase();
    return { red: g('--red'), ink: g('--ink'),
             on: g('--on-red'), paper: g('--paper'), bad: g('--bad') };
  });
  ok('the accent IS the ink, and what sits on it is the page',
    tone.red === tone.ink && tone.on === tone.paper, tone);
  /* DANGER IS STILL NOT THE ACCENT, and with the accent neutral that
     is easier rather than harder — --bad is now the only hue the app
     spends on itself, and it has to stay visibly apart from the ink
     it sits beside. */
  ok('danger is visibly not the accent', tone.bad !== tone.red, tone);

  /* ══════════════════════════════════════════════════════
     THE TWO THINGS YOU CHOOSE A COLOUR FOR

     The accent went and the chrome went neutral with it, which left
     two objects that turn out to have a WHICH after all: your face,
     which is which PERSON, and the Now chip, which is the one thing
     happening. Both are set from a row of eight swatches.

     THE DISCIPLINE IS THAT NOTHING ELSE READS THEM. This is one press
     away from being the wheel again under another name, and the only
     thing keeping it from being that is how few rules consume the two
     tokens. So the first assertion is that the chrome did not move:
     --red is still the ink, and a title, a tick and a filled control
     are all still neutral. */
  const pick = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const g = (k) => cs.getPropertyValue(k).trim().toLowerCase();
    return { me: g('--me'), live: g('--live'), red: g('--red'), ink: g('--ink') };
  });
  ok('the two chosen colours exist and neither is the ink',
    /^#[0-9a-f]{6}$/.test(pick.me) && /^#[0-9a-f]{6}$/.test(pick.live)
    && pick.me !== pick.ink && pick.live !== pick.ink, pick);
  /* A COLOUR EACH, which is the whole reason there are two tokens. One
     shared token passes every check written about either one on its
     own, and the bug it hides is the two moving together. */
  ok('...and they are two settings, not one', pick.me !== pick.live, pick);
  ok('and the chrome is still neutral', pick.red === pick.ink, pick);

  /* ── AND THEY ARE DRAWN WHERE THEY ARE SET ──
     A token nothing consumes is a setting you can get wrong and never
     see. Both are read off what is actually PAINTED: the chip's own
     background, and the face's own fill attribute, which is written by
     scFaceIn at build time rather than styled — so a repaint does not
     reach it and a check reading a stylesheet would not either. */
  const drawnIn = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const hex = (k) => cs.getPropertyValue(k).trim().toLowerCase();
    const num = (t) => (t.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const paint = (h) => { const d = document.createElement('div');
      d.style.color = h; document.body.appendChild(d);
      const c = num(getComputedStyle(d).color); d.remove(); return c; };
    const chip = document.querySelector('.st.is-now, .pill.is-now');
    const face = document.querySelector('#scTabFace svg rect');
    /* ── THE HUE, NOT THE HEX ──
       The chip is a 22% wash now rather than a solid, so its computed
       background is the colour composited over the row and can never
       equal --live as written. What is being claimed is that the chip
       carries THAT hue and not some other one, so the two are compared
       as directions: the channel a colour leads on, and by how much.
       A check against the literal would have to be rewritten every
       time the wash moves, which is how a check stops meaning what it
       says. */
    const lead = (c) => c.indexOf(Math.max(...c));
    const live = paint(hex('--live'));
    const got = chip ? num(getComputedStyle(chip).backgroundColor) : null;
    const bg = num(getComputedStyle(document.body).backgroundColor);
    return { chip: got, live, bg,
             sameLead: got ? lead(got) === lead(live) : false,
             moved: got ? got.some((v, i) => Math.abs(v - bg[i]) > 6) : false,
             face: face ? face.getAttribute('fill').toLowerCase() : null,
             wantFace: hex('--me') };
  });
  ok('the Now chip carries the colour set for it, and is not bare page',
    drawnIn.chip !== null && drawnIn.sameLead && drawnIn.moved, drawnIn);
  /* Your face is the flat neutral now and makes no colour claim, so
     what is asserted is that it is NOT drawn in either of the two
     colours this screen still has. */
  ok('...and your face is in neither of them',
    drawnIn.face !== null && drawnIn.face !== drawnIn.wantFace, drawnIn);

  /* ── AND THERE IS NO COLOUR TO PICK AT ALL ──
     One row of eight swatches was left, `Your colour`, drawing your
     own face. The face is a silhouette in the flat neutral now, so
     the swatches set a colour nothing on screen used — a control for
     a decision that no longer exists.

     Both halves: no row, and no label naming one. "There is no row"
     passes on a Settings sheet that failed to build at all, so the
     sheet is asserted to have its other rows. */
  await page.evaluate(() => document.getElementById('scTabYou').click());
  await page.waitForTimeout(360);
  const pkRows = await page.evaluate(() => ({
    rows: [...document.querySelectorAll('.pk-row')].length,
    labels: [...document.querySelectorAll('.sheet .label')].map((l) => l.textContent),
    items: document.querySelectorAll('.sheet .menu-item').length,
  }));
  ok('Settings carries no swatches at all, and no label for them',
    pkRows.rows === 0 && pkRows.items > 0
    && !pkRows.labels.some((l) => /colour|color|Now/i.test(l)), pkRows);

  /* ── AND A STORED ONE IS REMOVED, NOT IGNORED ──
     A preference for a control that no longer exists is a second
     record of a decision nothing can act on — the same answer the
     stored palette name, the subtitle key and the old rating scale
     all got. Asserted as GONE rather than merely unread. */
  /* meSwept, not swept: `swept` is already declared in this scope and
     a second one is a SyntaxError that takes the whole file down
     before an assertion runs. This repo's oldest bug in test-file
     clothes, and the third time in one session — caught by node
     --check rather than by "0 assertions across 1 files". */
  const meSwept = await page.evaluate(() => {
    localStorage.setItem('sched.me.v1', 'solar');
    return true;
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(420);
  ok('a colour stored by an older build is swept on boot',
    meSwept && await page.evaluate(() =>
      localStorage.getItem('sched.me.v1') === null));

  /* ── THE SWATCH CHECKS WENT WITH THE SWATCHES ──
     Sixteen hexes were measured here, eight per face, each held to
     4.5:1 for the label on it and 3:1 against the page. There is no
     row to press any more, so both are checks on a control that does
     not exist — kept, they would be sixteen assertions about nothing,
     and this file's own rule is that a check which cannot see its
     subject is worse than none.

     What the pair-per-face lesson was FOR survives one screen over:
     the tags are still nine hexes doubled for the two faces, and are
     still measured that way below. */

  /* ── AND A NAME THIS BUILD DOES NOT HAVE FALLS THROUGH ──
     What is stored is the swatch's NAME, so it can resolve to a
     different hex on each face — and a name outlives the code that
     wrote it, the way sched.view.v1 and sched.ty.v1 both do. A colour
     that resolves to nothing is a blank chip and an invisible face. */
  /* Nothing writes this key any more and boot removes it, so what is
     asserted is the one thing that still matters about it: --me
     resolves to a real hex whatever is in storage. It is still pushed
     with your record, so a peer drawing you from a token that came
     back empty would draw you as nothing at all. */
  await page.evaluate(() => {
    localStorage.setItem('sched.me.v1', 'chartreuse');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(420);
  const fell = await page.evaluate(() => {
    const c = getComputedStyle(document.documentElement);
    return { me: c.getPropertyValue('--me').trim() };
  });
  ok('the colour your record carries resolves to a real hex regardless',
    /^#[0-9a-f]{6}$/i.test(fell.me), fell);

  /* ── A KEY NOTHING READS ANY MORE IS SWEPT, NOT LEFT ──
     The same rule the old palette name and the stored theme key keep:
     a stored preference for a control that no longer exists is a
     second record of a decision nothing can act on, so it is removed
     on boot rather than merely ignored. */
  await page.evaluate(() => { localStorage.setItem('sched.live.v1', 'blue'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(420);
  ok('the old Now key is swept on boot, not just ignored',
    await page.evaluate(() => localStorage.getItem('sched.live.v1') === null));

  /* ── AND THE TAGS ARE THE ONLY COLOUR LEFT ──
     Nine of them: three sessions and six things you keep. Each is one
     hex, drawn as a ring at 46% and a label mixed 62% toward the ink,
     so what has to be measured is what is DRAWN rather than the hex —
     a colour that reads on paper can be invisible on the same page as
     an outline.

     THE LABEL IS MEASURED AGAINST THE TAG'S OWN FILL, not against the
     page. The tag was an outline and is a translucent wash now, so
     what sits behind the words is the hue at 22% composited over
     whatever the tag is on — which is darker than the page on one face
     and lighter on the other, and is the ground the text actually has
     to clear. Measuring against the page instead would flatter every
     tag on the dark face and fail every one on the light. */
  const tags = await page.evaluate(() => {
    /* ── BOTH SERIALISATIONS, OR THE CHECK MEASURES ITS OWN PARSER ──
       Chrome returns a resolved color-mix as `color(srgb r g b / a)`
       with the channels 0..1, and a plain colour as rgb()/rgba() with
       them 0..255. Read naively, 0.97 comes back as a channel value of
       one and every tag measures 1.07:1 against a near-black page —
       which is what this reported before it was fixed, on tags that are
       plainly legible in a screenshot. This file already carries the
       same lesson about the sweep's wash. */
    const chan = (s) => {
      const n = (s.match(/[\d.]+/g) || []).map(Number);
      const c = /^color\(/.test(s) ? n.slice(0, 3).map((v) => Math.round(v * 255))
                                   : n.slice(0, 3);
      const a = /^color\(/.test(s) ? (n.length > 3 ? n[3] : 1)
                                   : (n.length > 3 ? n[3] : 1);
      return { c, a };
    };
    const over = (fg, bg) => fg.c.map((v, i) => Math.round(v * fg.a + bg.c[i] * (1 - fg.a)));
    const out = [];
    const ground = chan(getComputedStyle(document.body).backgroundColor);
    const look = (el, where) => {
      const cs = getComputedStyle(el);
      /* The FILL carries an alpha, so what is drawn is the wash
         composited over what is behind it — and what is behind it is
         the card, not the page. Read off the parent rather than
         assumed: a tag on a card and a tag on the page have different
         grounds and the same declaration. */
      let bg = ground, p = el.parentElement;
      while (p) {
        const c = chan(getComputedStyle(p).backgroundColor);
        if (c.a > 0) { bg = { c: over(c, ground), a: 1 }; break; }
        p = p.parentElement;
      }
      const fill = { c: over(chan(cs.backgroundColor), bg), a: 1 };
      out.push({ where,
                 label: over(chan(cs.color), fill),
                 fill: fill.c,
                 page: bg.c,
                 on: fill.c });
    };
    document.querySelectorAll('.wk-sh b').forEach((e) => look(e, 'session ' + e.textContent));
    document.querySelectorAll('.ty-card .tg').forEach((e) => look(e, 'item ' + e.textContent));
    document.querySelectorAll('.st.is-now, .pill.is-now')
      .forEach((e) => look(e, 'now ' + e.textContent));
    return out;
  });
  const tagLow = tags.reduce((a, x) => Math.min(a, ratio(x.label, x.on)), 99);
  ok(`every tag's label clears 4.5:1 on its own fill (worst ${tagLow.toFixed(2)}:1)`,
    tags.length >= 2 && tagLow >= 4.5,
    tags.map((x) => x.where + ' ' + ratio(x.label, x.on).toFixed(2)));

  /* ── A TINT AND A LABEL, WHICH IS THE THIRD ANSWER ──
     Solid first, and the loudest object on a page whose whole job is
     the words. Then an outline, which was reported from the phone as
     exactly what it was: a pill corner with nothing in it. Both are
     the same mistake at opposite ends — a tag's colour has to read as
     an AREA, because the point of it is catching which session a row
     is in without reading the word, and an outline gives the colour a
     perimeter instead.

     Asserted in both directions, because each half passes on the
     other's bug: there has to BE a fill, and it has to be translucent
     rather than the solid pill coming back. And no border, since a
     ring plus a wash is the outline treatment with something added
     behind it rather than the thing that replaced it. */
  const tint = await page.evaluate(() =>
    /* ── ALL THREE, AND THAT IS THE POINT OF THE LIST ──
       The Now chip was the holdout: the one filled chip in the app, on
       the argument that the one thing happening earns the one solid
       treatment. Beside a Morning tag it just read as a different
       component. Naming the three here is what stops one of them
       drifting back. */
    [...document.querySelectorAll('.wk-sh b, .ty-card .tg, .st.is-now, .pill.is-now')]
    .map((e) => {
      const cs = getComputedStyle(e);
      const n = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number);
      const a = /^color\(/.test(cs.backgroundColor)
        ? (n.length > 3 ? n[3] : 1) : (n.length > 3 ? n[3] : 1);
      return { w: e.textContent, a, border: cs.borderTopWidth };
    }));
  ok(`every tag is a wash and a label, never an outline and never a slab `
    + `(${tint.length} of them)`,
    tint.length >= 3
    && tint.every((t) => t.a > .05 && t.a < .5 && t.border === '0px'), tint);

  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForTimeout(300);

  /* show(), not one click. A single press put the rail back when the
     button had two stops; with three it lands on the tally instead and
     every .row below this vanishes — which reports as a broken app
     rather than as a test that left the furniture where it found it. */
  await show('list');
  ok('and the rail is back for what follows',
    await page.evaluate(() => !document.getElementById('scWeek').hidden));

  /* ── the thumb ──
     A check only sees what is on screen. Measuring this with no sheet
     open reads the bar and the rows and calls it done — the day picker
     and the sheet's buttons are never looked at, and the seven chips
     were in fact under the floor when this was first written. */
  /* ══════════════════════════════════════════════════════
     A TAP TICKS, TWO TAPS EDIT, AND EVERY ROW SAYS WHERE IT STANDS

     The week had it the wrong way round: a tap opened the editor and a
     long press ticked, which put the rare thing on the easy gesture.
     You edit a block a few times ever and tick one most mornings.

     Both directions, because each passes on the other's bug: a build
     that still opened the editor on one tap passes "two taps edit",
     and one where the second press did nothing passes "a tap ticks". */
  /* ── AND THE WEEK HAS ITS OWN CARD, WITH ITS OWN SCENE ──
     Two screens went to a double tap and neither gesture can announce
     itself, so each gets a card. A KEY EACH, because they are two
     lessons: learning that two taps open a tile's stats does not teach
     you that two taps edit a block.

     THE SCENES MUST DIFFER. The tile's draws the gesture, because what
     it teaches is a press; this one draws what the press produces, a
     sheet coming up. Two cards running one animation would be the app
     saying the same thing twice and meaning two different things. */
  console.log('\n── the card that teaches the week ──');
  await page.evaluate(() => localStorage.removeItem('sched.hintw.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(420);
  await show('list');
  await page.waitForTimeout(300);
  const wkHint = await page.evaluate(() => {
    const surf = document.getElementById('scHint');
    const c = document.querySelector('.gh-card');
    if (!c || surf.hidden) return { up: false };
    const sr = surf.getBoundingClientRect();
    const anim = [];
    c.querySelectorAll('.gh-ic svg *').forEach((e) =>
      e.getAnimations().forEach((a) => anim.push(a.animationName)));
    return { up: sr.width > 300 && sr.height > 300,
             says: /double tap/i.test(c.textContent),
             tick: /tick/i.test(c.textContent),
             anim: [...new Set(anim)],
             ok: !!c.querySelector('.gh-ok'),
             never: !!c.querySelector('.gh-never') };
  });
  ok('a card comes up over the week and names both gestures',
    wkHint.up && wkHint.says && wkHint.tick, wkHint);
  ok('...with its own scene, not the tile card\u2019s ripple',
    wkHint.anim.length > 0 && wkHint.anim.every((n) => !/gh-r[12]/.test(n)),
    wkHint);
  ok('...and both ways out', wkHint.ok && wkHint.never, wkHint);
  /* Its own key: dismissing this one for good must not silence the
     other, and the tile's key is untouched here. */
  await page.evaluate(() => document.querySelector('.gh-never').click());
  await page.waitForFunction(() => document.getElementById('scHint').hidden,
    null, { timeout: 4000 });
  const keys = await page.evaluate(() => ({
    wk: localStorage.getItem('sched.hintw.v1'),
    ty: localStorage.getItem('sched.hint2.v1') }));
  ok('“Don’t show again” marks THIS card seen and leaves the other alone',
    keys.wk === '1' && keys.ty === '1', keys);
  await page.waitForTimeout(160);

  console.log('\n── two taps on the week ──');
  await show('list');
  await page.waitForTimeout(220);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.st-d')]
      .find((x) => x.dataset.d === String(new Date().getDay()));
    if (b) b.click();
  });
  await page.waitForTimeout(260);

  const tapRow = async () => {
    await page.click('.week.is-today .row[data-id]');
    await page.waitForTimeout(440);
  };
  const rowState = () => page.evaluate(() => {
    const r = document.querySelector('.week.is-today .row[data-id]');
    return { done: r.classList.contains('is-done'),
             word: (r.querySelector('.st') || {}).textContent,
             sheet: !document.getElementById('scSheet').hidden };
  });
  const before = await rowState();
  await tapRow();
  const afterTap = await rowState();
  ok('a tap on a week row ticks it and does NOT open the editor',
    afterTap.done !== before.done && !afterTap.sheet, { before, afterTap });
  ok('...and the row then says Completed',
    afterTap.done ? afterTap.word === 'Completed' : true, afterTap);
  await tapRow();                                  /* back where it was */
  await page.waitForTimeout(120);

  await dblRow('.week.is-today .row[data-id]');
  ok('two taps open the editor',
    await page.evaluate(() => !document.getElementById('scSheet').hidden));
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForFunction(() => document.getElementById('scSheet').hidden,
    null, { timeout: 4000 });
  await page.waitForTimeout(160);

  /* ── AND A GESTURE IS NEVER THE ONLY WAY IN ──
     A double tap reaches a pointer and nothing else. The check beside
     the row is the keyboard's tick; this is its edit. */
  const rowEd = await page.evaluate(() => {
    const e = document.querySelector('.week.is-today .rowwrap .row-ed');
    if (!e) return null;
    e.focus();
    const r = e.getBoundingClientRect();
    return { label: e.getAttribute('aria-label'),
             focused: document.activeElement === e,
             w: Math.round(r.width), h: Math.round(r.height) };
  });
  ok('every row carries a real edit control for a keyboard',
    rowEd && /^Edit /.test(rowEd.label) && rowEd.focused
    && rowEd.w > 20 && rowEd.h > 10, rowEd);
  await page.evaluate(() => document.activeElement.blur());

  /* ── FOUR STATES, AND THE COLOUR MAPPING IS ASKED OF THE PAGE ──
     Planted rather than waited for: In progress needs a block running
     and Missed needs one behind you, so a check that waited for the
     clock would only run at certain hours — which this file has been
     bitten by three times. The WORDS come from the app on a real tick
     above; this is the CSS that dresses them.

     Not yet is the one that must stay neutral. A tag takes a hue when
     it names something that happened, and a thing you have not got to
     has not happened; Missed is the reversal that was asked for, and
     it is the only red tag in the app. */
  const dress = await page.evaluate(() => {
    const r = document.querySelector('.week.is-today .row[data-id]');
    const t = r.querySelector('.st');
    const cs = getComputedStyle(document.documentElement);
    const paint = (h) => { const d = document.createElement('div');
      d.style.color = h; document.body.appendChild(d);
      const c = getComputedStyle(d).color; d.remove(); return c; };
    const num = (c) => { const n = (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      return /^color\(/.test(c) ? n.map((x) => x * 255) : n; };
    const spread = (c) => { const v = num(c);
      return v.length === 3 ? Math.max(...v) - Math.min(...v) : 0; };
    const lead = (c) => { const v = num(c); return v.indexOf(Math.max(...v)); };
    const was = t.className;
    const out = {};
    ['is-ok', 'is-now', 'is-bad', 'is-todo'].forEach((k) => {
      t.className = 'st ' + k;
      const g = getComputedStyle(t);
      out[k] = { spread: Math.round(spread(g.color)), lead: lead(g.color) };
    });
    t.className = was;
    out.badLead = lead(paint(cs.getPropertyValue('--bad').trim()));
    out.okLead = lead(paint(cs.getPropertyValue('--st-ok').trim()));
    return out;
  });
  ok('Not yet is a grey with no channel standing out',
    dress['is-todo'].spread <= 12, dress);
  ok('Completed is green, and Missed is the app\u2019s own red',
    dress['is-ok'].spread >= 14 && dress['is-ok'].lead === dress.okLead
    && dress['is-bad'].spread >= 14 && dress['is-bad'].lead === dress.badLead
    && dress['is-bad'].lead !== dress['is-ok'].lead, dress);
  ok('...and In progress is a colour of its own too',
    dress['is-now'].spread >= 14, dress);

  console.log('\n── the thumb ──');
  await dblRow('.week.is-today .row[data-id]');
  ok('the edit sheet is up to be measured',
    await page.$$eval('.pick', (p) => p.length) === 7);
  /* `.theme` is in this list because a hardcoded list of what to
     measure silently skips what is not in it, and this repo has been
     bitten by that twice — a test file the suite never ran, and a
     reduced-motion check that read three layers by name while a fourth
     animated straight past it. */
  const small = await page.$$eval('.mic, .ghost, .row, .pick, .btn, .cw', (els) => els
    .map((e) => ({ c: e.className, h: e.getBoundingClientRect().height }))
    .filter((e) => e.h > 0 && e.h < 44));
  ok('every control clears 44px', small.length === 0, small);

  /* ── the promise ── */
  console.log('\n── nothing leaves ──');
  const away = asked.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
  ok('the page asks for nothing off this origin', away.length === 0, away);
  const own = asked.filter((u) => u.startsWith(BASE));
  ok('and everything it does ask for is its own folder',
    own.every((u) => u.startsWith(`${BASE}/schedule/`)), own.filter((u) => !u.startsWith(`${BASE}/schedule/`)));

  /* The apps have no dependencies, and this one has no shell either —
     it is the whole reason it can be copied out on its own. */
  const src = await fetch(`${BASE}/schedule/index.html`).then((r) => r.text());
  ok('the markup names no shared file and no CDN',
    !/shell\.(css|js)|\/arc\/|https?:\/\/(?!localhost|127)/.test(src));
  ok('and it touches no other app’s storage key',
    await page.evaluate(() => ['ledger.v1', 'habits.v1', 'reminders.v1', 'backtest.v1', 'checkin.v1']
      .every((k) => localStorage.getItem(k) === null)));

  /* ═══════════════════════════════════════════════════════════
     FRIENDS

     Driven against the REAL worker. Playwright answers every request
     to the fake host by calling `worker.fetch` with a Map for KV, so
     the app talks to the code that will be deployed and the round trip
     is genuine — no account, no network, no wrangler.

     ON ITS OWN PAGE, deliberately. The section above counts every
     request the main page makes and fails on one that leaves the
     origin, and that assertion is the app's whole promise. Turning
     friends on here would poison it, and relaxing its filter to let
     this through would quietly relax it for everything else too. The
     promise is "off until you turn it on", so the page that never
     turns it on is the one that has to prove it.

     BOTH CLOCKS ARE FROZEN to the same instant. The page files a day
     under its own local date and the worker trims to a window from its
     own clock; freezing only one of the two measures a five-day skew
     rather than the app, and the first run of this reported an empty
     board for exactly that reason. */
  console.log('\n── friends ──');
  {
    const worker = (await import('file://' + require('path')
      .resolve(__dirname, '..', 'worker', 'index.js'))).default;

    const FROZEN = new Date('2026-09-01T09:30:00').getTime();
    const RealDate = Date;
    globalThis.Date = class extends RealDate {
      constructor(...a) { super(...(a.length ? a : [FROZEN])); }
      static now() { return FROZEN; }
    };

    const store = new Map();
    const env = { SCHED: {
      async get(k, type) {
        if (!store.has(k)) return null;
        const v = store.get(k);
        if (type === 'arrayBuffer') return v;
        return typeof v === 'string' ? v : new TextDecoder().decode(new Uint8Array(v));
      },
      async put(k, v) { store.set(k, v); },
      async delete(k) { store.delete(k); },
    } };

    const HOST = 'https://sched.test.workers.dev';
    const day = (off) => {
      const d = new Date(FROZEN);
      d.setDate(d.getDate() - off);
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
        + '-' + String(d.getDate()).padStart(2, '0');
    };

    /* Somebody already on the server, so adding a friend is a real
       fetch of a real record rather than a fixture handed to the page. */
    /* Two counts a day now: how many of the five they ticked, and how
       many of their blocks they kept. Never which five and never which
       blocks — the schedule itself has still never left a phone. */
    const days = {};
    for (let i = 0; i < 12; i++) days[day(i)] = { t: (i % 5) + 1, b: (i % 4) + 1 };
    store.set('key:JADE2K7P', 'x'.repeat(64));
    store.set('rec:JADE2K7P', JSON.stringify({
      code: 'JADE2K7P', name: 'Rae', acc: '#0F6E6A', ink: '#ffffff', pic: '',
      days, at: FROZEN - 60000,
      logs: [{ id: 'a1', at: FROZEN - 3600e3, day: day(0), item: 'm',
               cap: 'Eight miles before the light came up.', img: '' }],
    }));

    const fp = await browser.newPage({ ...PHONE });
    const ferrs = [];
    fp.on('pageerror', (e) => ferrs.push(String(e)));
    fp.on('console', (m) => { if (m.type() === 'error') ferrs.push(m.text()); });
    await jackets(fp);
    const paths = [];
    await fp.route(HOST + '/**', async (route) => {
      const r = route.request();
      paths.push(r.method() + ' ' + new URL(r.url()).pathname);
      const res = await worker.fetch(new Request(r.url(), {
        method: r.method(), headers: r.headers(),
        body: ['GET', 'HEAD'].includes(r.method()) ? undefined : r.postDataBuffer(),
      }), env);
      await route.fulfill({ status: res.status,
        headers: Object.fromEntries(res.headers),
        body: Buffer.from(await res.arrayBuffer()) });
    });
    await fp.addInitScript((host) => {
      const F = new Date('2026-09-01T09:30:00').getTime(), R = Date;
      window.Date = class extends R {
        constructor(...a) { super(...(a.length ? a : [F])); }
        static now() { return F; }
      };
      delete window.SpeechRecognition;
      delete window.webkitSpeechRecognition;
      /* The intro is marked seen here too: it is a full-screen
         surface on a first visit and this page presses things. */
      if (!localStorage.getItem('sched.tour.v1')) {
        localStorage.setItem('sched.tour.v1', '1');
        localStorage.setItem('sched.hint2.v1', '1');
        localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      }
      /* Pointed at the worker running in THIS process, not the live one
         the app ships with. Everything below is a real round trip
         through the real worker file, and none of it touches a server
         anybody else can see.

         ONLY IF ABSENT. An init script runs on every navigation, and
         this page reloads halfway through — written unconditionally it
         put the record back to on:false with no code, throwing away the
         claim the test had just made, and the failure surfaced four
         hundred lines later as a log post that never landed. */
      if (!localStorage.getItem('sched.net.v1')) {
        localStorage.setItem('sched.net.v1', JSON.stringify({
          url: host, code: '', key: '', name: 'Niko', pic: '', on: false }));
      }
      /* A share sheet that records instead of opening one. Chromium has
         no navigator.share, so without this the button falls to the
         clipboard branch and the link is only readable through a
         permission grant — and the branch a phone takes goes untested,
         which is the one that matters. */
      window.__shared = [];
      navigator.share = function (d) { window.__shared.push(d); return Promise.resolve(); };
    }, HOST);
    const fetched = [];
    fp.on('request', (r) => fetched.push(r.url()));
    await fp.goto(`${BASE}/schedule/`, { waitUntil: 'networkidle' });
    await fp.evaluate(async () => { await document.fonts.ready; });

    const tab = async (v) => {
      await fp.click(`.tab[data-view="${v}"]`);
      await fp.waitForTimeout(220);
    };
    /* The board and the feed are two stops now, so a test that wants
       the feed has to go to it. Driven by name rather than by counting
       presses — the same reason the view helper above exists. */
    const stop = async (v) => {
      await fp.click(`.fr-stop[data-stop="${v}"]`);
      await fp.waitForTimeout(240);
    };

    /* Two ticks of your own, so the board has a real figure on it
       rather than a zero that any code path would produce. */
    await tab('tally');
    /* BY ITEM, not by position. A row is two buttons now — the card
       logs and the strip beside it opens the history — so `#scTally
       button >> nth=1` is Train's STRIP rather than Mind's card, and
       the panel it opens then swallows every click after it. */
    await fp.click('.ty-card[data-item="t"]');
    await fp.waitForTimeout(500);
    /* Train now asks what you trained, so the deck is up over the
       tally and its scrim takes every press after it. Dismissed
       rather than answered: this section is about the board's
       figures, and the answer is not one of them. */
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(360);
    /* ── AND MIND IS DISMISSED THE WAY TRAIN IS, TWO LINES UP ──
       Mind asks what you read, so its picker comes up over the tally
       and takes every press after it. This waited 220ms and pressed
       on — which is UNDER the 260 the double tap defers a first press
       by, so the press had not landed yet and the sheet opened later,
       over whatever was pressed next. It survived on that race: the
       sheet was reliably late enough to miss the click behind it, and
       any change that moved either number by forty milliseconds broke
       it. Waited out and dismissed, like the deck above. */
    await fp.click('.ty-card[data-item="m"]');
    await fp.waitForTimeout(500);
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(360);
    /* A number nothing else in the app could produce, typed into
       Steps. The tick means YOU LOGGED IT and never what it was, and
       the only way to hold that claim is to go looking for the figure
       afterwards. */
    await fp.click('.ty-card[data-item="p"]');
    await fp.waitForTimeout(400);
    await fp.fill('.sheet input[type=text]', '18437');
    await fp.click('.sheet .btn.go');
    await fp.waitForTimeout(400);

    /* Scoped to ONE pane. Both halves stay in the DOM — the stop hides
       them with display:none — so an unscoped query returns the feed's
       actions alongside the board's whichever stop is up. */
    const glyphs = (where) => fp.$$eval(where + ' .fr-link', (b) => b.map((x) =>
      x.textContent.trim() + '|' + (x.querySelector('path').getAttribute('d')
        .indexOf('M7 2v10') === 0 ? 'plus' : 'go')).join(' '));

    /* ── nothing has left, and the tab has not been opened ──
       This used to read "friends is off out of the box", and off meant
       a person had to be told a .workers.dev address and type it in
       before anything worked. That is gone: the build carries a server
       and arriving at the tab claims a code.

       What survives is the half that was actually the promise — the
       week and the tally reach nothing at all. So the check
       moves to WHEN rather than whether, and it is stricter for it: a
       single request off this origin before the Friends tab is opened
       fails, and that is the line the app must not cross. */
    ok('the week and the tally have asked for nothing off origin',
      fetched.every((u) => u.startsWith(BASE) || u.startsWith('data:')
        || u.startsWith('blob:') || isArt(u)),
      fetched.filter((u) => !u.startsWith(BASE) && !isArt(u)));
    ok('and nothing has been claimed yet',
      await fp.evaluate(() => {
        const n = JSON.parse(localStorage.getItem('sched.net.v1') || 'null');
        return !n || !n.on;
      }));

    await tab('friends');
    await fp.waitForTimeout(900);

    /* ── arriving turns it on ── */
    ok('opening the tab claims a code, with nothing to type',
      paths.includes('POST /v1/claim'), paths);
    ok('you are on the board, out of your own ticks',
      await fp.$$eval('.fr-row', (r) => r.length) === 1);
    /* ── A PROFILE FIRST ──
       On a fresh claim there is no nickname, so the thing to do first
       is offered first: your row says "You", which is a label rather
       than a name, and a friend who adds you back sees a code. Setting
       one has to take the offer away — a "create a profile" that never
       leaves is a task you can never finish — so both states are
       measured here rather than only the empty one. */
    ok('and the action waiting is Add a friend',
      (await glyphs('#scFrPane')) === 'Add a friend|plus', await glyphs('#scFrPane'));
    ok('...with the board calling you by the name you set, not "You"',
      await fp.$eval('.fr-row.is-me .fr-n', (e) => e.textContent) === 'Niko');

    /* ── A PROFILE FIRST, when there is no name yet ──
       This fixture arrives already named, so the unnamed state is
       reached by taking the name away rather than by assuming it: on a
       fresh claim your row says "You", which is a label rather than a
       name, and a friend who adds you back sees a code. The thing to
       do first is offered first — and setting it has to take the offer
       away, because a "create a profile" that never leaves is a task
       you can never finish. Both states, because each passes on the
       other's bug. */
    const setName = async (v) => {
      await fp.evaluate((n) => {
        const r = JSON.parse(localStorage.getItem('sched.net.v1'));
        r.name = n;
        localStorage.setItem('sched.net.v1', JSON.stringify(r));
      }, v);
      await fp.reload({ waitUntil: 'networkidle' });
      await fp.waitForTimeout(700);
    };
    await setName('');
    /* ── A PROFILE FIRST, AND IT IS THE ONLY THING OFFERED ──
       Both used to be drawn, which is offering a choice that has one
       right answer: before a nickname there is nothing to add anybody
       TO — your row says "You" and a friend who adds you back sees a
       code. Add a friend is not on the screen at all until there is a
       profile, and the line under it says WHY the other action is
       missing rather than describing the field the sheet will show. */
    ok('...and with no name yet, a profile is the only thing offered',
      (await glyphs('#scFrPane')) === 'Create a profile|plus',
      await glyphs('#scFrPane'));
    ok('...with one line saying why the other action is not there',
      /^Create a profile to add a friend\.$/.test(
        await fp.$eval('#scFriendAdd .fr-note', (e) => e.textContent.trim())),
      await fp.$eval('#scFriendAdd .fr-note', (e) => e.textContent));
    ok('...and your row falls back to the label until you pick one',
      await fp.$eval('.fr-row.is-me .fr-n', (e) => e.textContent) === 'You');
    /* Put it back, because everything below this was written under it. */
    await setName('Niko');
    ok('...and setting one takes the offer away again',
      (await glyphs('#scFrPane')) === 'Add a friend|plus', await glyphs('#scFrPane'));
    /* The turn-on sheet used to carry the sentence about what leaves,
       on the argument that a paragraph you press through is a decision.
       Nobody presses through anything now, so it has to be on the board
       — visible every time rather than once. */
    /* ONE NOTE, NOT THREE. The board carried a description under each
       action as well, which is a screen reading as instructions for
       itself. What survives is the promise — it is not a description
       of a control, and it is the one sentence nobody may press past. */
    ok('and the board says what is on the server, in one line',
      await fp.$$eval('#scFriendAdd .fr-note', (e) => e.length) === 1
      && /ticks.+logs.+server.+Settings/i.test(
        await fp.$eval('#scFriendAdd .fr-note', (e) => e.textContent)),
      await fp.$eval('#scFriendAdd .fr-note', (e) => e.textContent));

    /* ── two stops, one screen ──
       The board and the feed were stacked under two letterspaced
       capital headings with a filled accent button under each. Only
       one is on screen now, and the control that reaches a half IS the
       heading for it — a label naming a section beside the thing that
       takes you there is the same word twice. */
    ok('only one half is on screen at a time',
      await fp.evaluate(() => document.getElementById('scFrPane').hidden
        !== document.getElementById('scFeed').hidden));
    ok('the board is the stop you arrive at',
      await fp.evaluate(() => !document.getElementById('scFrPane').hidden));
    /* SCOPED TO THE FRIENDS SECTION. Today wears the same .fr-stop —
       it is the same control and a second set of classes drawn to look
       identical is two places to keep one thing in step — and its two
       come FIRST in the document, so a bare selector reads "Showing
       up" and asks it which friends stop it is. */
    ok('and the lit stop says which one it is',
      await fp.$eval('.friends .fr-stop.on', (e) => e.dataset.stop) === 'board');
    await stop('feed');
    ok('the feed stop puts the feed up and the board away',
      await fp.evaluate(() => document.getElementById('scFrPane').hidden
        && !document.getElementById('scFeed').hidden));
    /* Remembered, and in its own key: the schedule is the record and
       this is a preference about looking at it, which is the same
       argument sched.view.v1 already makes for itself. */
    await fp.reload({ waitUntil: 'networkidle' });
    await fp.waitForTimeout(340);
    ok('and which stop you were on outlives a reload',
      await fp.evaluate(() => !document.getElementById('scFeed').hidden));
    await stop('board');

    /* Nothing on this screen is a filled block any more. Two solid
       rectangles for things done about once a week each, sitting under
       a three-row list, were louder than the board they were about. */
    ok('no action on the screen is a filled button',
      await fp.$$eval('.friends .btn', (b) => b.length) === 0);
    /* SCOPED TO THE PANE THAT IS UP. Both halves stay in the DOM and
       the stop hides one with display:none, so an unscoped query picks
       up the feed's own action at zero height and reports it as a
       control too small to press. It passed before only because friends
       were off and the feed had no action in it. */
    ok('and every one of them still clears 44px',
      await fp.$$eval('#scFrPane .fr-link, .friends .fr-stop', (b) => b.length > 0
        && b.every((x) => x.getBoundingClientRect().height >= 44)));
    const mine = await fp.evaluate(() => JSON.parse(localStorage.getItem('sched.net.v1')));
    ok('it claims a code', /^[A-Z0-9]{8}$/.test(mine.code || ''), mine.code);
    /* I, O, 0 and 1 are out of the alphabet on purpose: this is a
       string somebody reads down a phone. */
    ok('and the code cannot contain a character anyone would mishear',
      !/[IO01]/.test(mine.code), mine.code);
    ok('the write key is 32 hex and is not the code',
      /^[a-f0-9]{32}$/.test(mine.key || '') && mine.key !== mine.code);
    ok('the server stored the key HASHED, never as itself',
      store.get('key:' + mine.code) !== mine.key
      && String(store.get('key:' + mine.code)).length === 64);

    /* WITH NOBODY ON YOUR LIST, and that is the case this exists for.
       The first version fetched from inside the paint and repainted
       from inside the fetch — and with no friends the fetch calls back
       synchronously, so the very first paint recursed until the stack
       went. It came out as a board with its buttons and no rows, which
       reads as an empty leaderboard rather than as a crash. */
    ok('turning it on with nobody added still leaves you on the board',
      await fp.$$eval('.fr-row', (r) => r.length) === 1);
    ok('nothing threw doing it', ferrs.length === 0, ferrs);

    const rec = () => JSON.parse(store.get('rec:' + mine.code));
    ok('your record went up', !!store.get('rec:' + mine.code));
    ok('it carries the day COUNT, not which of the five',
      rec().days[day(0)].t === 3, JSON.stringify(rec().days));
    /* And the blocks the same way. A count says you showed up; a list
       says what your day is, and the second is the thing this app
       exists not to send. */
    ok('...and how many blocks were kept, never which ones',
      typeof rec().days[day(0)].b === 'number'
      && !/\bWake\b|\bTrading\b/.test(store.get('rec:' + mine.code)),
      JSON.stringify(rec().days[day(0)]));
    /* The tally holds Steps, Fuel and Water as numbers you typed. The
       tick means you logged it and never what it was, which is what
       keeps the quantities off the wire. */
    ok('the Steps figure is on this phone and nowhere in the record',
      (await fp.evaluate((d) => (JSON.parse(localStorage.getItem('sched.tick.v1'))
        || {})[d].p, day(0))) === '18437'
      && !JSON.stringify(rec()).includes('18437'), JSON.stringify(rec()));
    /* TWO NUMBERS AND NOTHING ELSE. It was one number, and the claim
       was that a day is a count rather than a shape — which still
       holds, it is just two counts now. Written as "every value is a
       number" it would pass on a day carrying a list of block names
       beside them, so what is asserted is the exact set of keys. */
    ok('and a day is two counts, never a shape',
      Object.values(rec().days).every((v) =>
        Object.keys(v).sort().join() === 'b,t'
        && typeof v.t === 'number' && v.t <= 5
        && typeof v.b === 'number'),
      JSON.stringify(rec().days));
    ok('it carries the two colours a friend draws you with',
      /^#/.test(rec().acc) && /^#/.test(rec().ink), rec().acc + ' ' + rec().ink);
    ok('it does not carry your week',
      !JSON.stringify(rec()).includes('Trading'));

    /* ── adding somebody ── */
    await fp.click('text=Add a friend');
    await fp.waitForTimeout(420);
    await fp.fill('.sheet input[type=text]', 'jade2k7p');
    await fp.click('.sheet .btn.go');
    await fp.waitForTimeout(900);
    ok('a code typed in lower case still finds them',
      await fp.$$eval('.fr-n', (n) => n.map((x) => x.textContent)).then((n) => n.includes('Rae')));
    ok('and the board ranks on ticks, not on who is you',
      await fp.$$eval('.fr-n', (n) => n[0].textContent) === 'Rae');

    /* THE GRAPH NEVER LEAVES. There is no endpoint that would return
       your people and this is what refuses one being added: everything
       the page has asked for is a record by code, an image, or the
       claim. */
    ok('the server was never told who is on your list',
      paths.every((p) => /^(POST \/v1\/claim|PUT \/v1\/rec\/|GET \/v1\/rec\/|POST \/v1\/img|GET \/v1\/img\/|DELETE \/v1\/rec\/)/.test(p)),
      paths.filter((p) => !/^(POST|PUT|GET|DELETE) \/v1\/(claim|rec|img)/.test(p)));
    ok('and your friend list is in this browser',
      await fp.evaluate(() => (JSON.parse(localStorage.getItem('sched.friends.v1')) || [])
        .map((f) => f.code).join() === 'JADE2K7P'));

    /* A `+` is for the actions that make something exist. `Your code`
       makes nothing — it shows you a string you already have — and
       given the plus as well it read as a fourth thing to create, on
       the row directly under the one that adds people. */
    /* ONE action on the board. `Your code` used to sit directly under
       this as a second row — two rows for the two halves of a single
       act. Adding a friend IS the swap, so both codes live on that
       sheet, and the friends settings moved to the app's own settings
       where Rename and the backup already are. */
    ok('the board carries one action and it is the + that adds somebody',
      await glyphs('#scFrPane') === 'Add a friend|plus', await glyphs('#scFrPane'));
    ok('and the composer keeps the +',
      await glyphs('#scFeed') === 'Write one|plus', await glyphs('#scFeed'));

    /* Both codes on one sheet, because that is the exchange. */
    await fp.click('text=Add a friend');
    await fp.waitForTimeout(460);
    ok('yours is on the sheet where you take theirs',
      await fp.$eval('.fr-swap .fr-code', (e) => e.textContent) === mine.code);
    /* Two assertions, not one `&&`. As a single line it reported a
       failure without saying which half, which is a check you cannot
       act on. */
    const swapBtn = await fp.$$eval('.fr-swap .btn', (b) => b.map((x) => x.textContent));
    const actBtn = await fp.$$eval('.sheet .acts .btn', (b) => b.map((x) => x.textContent));
    ok('...with the button that shares it beside the code', swapBtn.join() === 'Share', swapBtn);
    ok('...and the action row below belongs to adding THEM',
      actBtn.join() === 'Cancel,Add', actBtn);

    /* ── what Share actually hands over ──
       Read off the share sheet rather than the clipboard: it is the
       branch a phone takes, and it is the one place the link exists as
       a string before it goes to somebody. */
    await fp.click('.fr-swap .btn');
    await fp.waitForTimeout(260);
    const shared = await fp.evaluate(() => (window.__shared || []).slice());
    const link = (shared[0] || {}).text || '';
    ok('sharing hands over a link, not a bare code',
      shared.length === 1 && /^https?:\/\/.+#add=/.test(link), link);
    ok('...carrying your code', link.includes('#add=' + mine.code), link);
    ok('...and the server it is on, because a code alone names nothing',
      link.includes('&at=' + encodeURIComponent(HOST)), link);
    /* The whole reason the link exists: a code is a row in ONE KV
       namespace. Handed to somebody pointed elsewhere it is not wrong,
       it is absent — the read misses and the app says "nobody has that
       code". */
    ok('...and it is the fragment that carries them, never the query',
      link.indexOf('#') < link.indexOf('add=') && !/\?/.test(link), link);
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(420);

    /* And the settings for it are where the app's other settings are. */
    await fp.click('#scTabYou');
    await fp.waitForTimeout(460);
    ok('the settings menu says whether friends are on, and under what code',
      (await fp.$$eval('.menu-item', (b) => b.map((x) => x.textContent).join('\n')))
        .includes('Friends' + 'On \u00b7 ' + mine.code));
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(420);

    /* ── THE CROWN IS GOLD, WHOEVER IS WEARING IT ──
       It used to be the leader's OWN colour, solved through scCrown to
       clear 3:1 on your page. A crown in somebody's chosen violet says
       which PERSON, which the name beside it already says; gold says
       which PLACE, which is the only thing a crown is for.

       Asked of the page rather than written as a hex, and asserted as
       NOT the leader's colour as well — a build that had simply kept
       the old behaviour would pass "it is a colour" on its own. */
    const crown = await fp.$eval('.fr-crown', (e) => {
      const cs = getComputedStyle(document.documentElement);
      const paint = (h) => { const d = document.createElement('div');
        d.style.color = h; document.body.appendChild(d);
        const c = getComputedStyle(d).color; d.remove(); return c; };
      return { set: e.style.getPropertyValue('--crown'),
               fill: getComputedStyle(e.querySelector('svg')).fill,
               gold: paint(cs.getPropertyValue('--gold').trim()),
               theirs: paint('#0F6E6A') };
    });
    ok('the crown is gold, not the leader\u2019s own colour',
      crown.fill === crown.gold && crown.fill !== crown.theirs
      && crown.set === '', JSON.stringify(crown));
    /* ── AND SO DOES THEIR FACE, WHICH IT DID NOT ──
       A friend's face was drawn in the colour THEY chose, which was
       the whole reason `acc` travels with a record. There is no
       choosing one any more: the default avatar is the same
       silhouette for everybody, which is what a picture of somebody
       who has not set one should be.

       So it is asserted as the flat neutral AND as not their colour —
       "it is grey" on its own passes on a build where their accent
       happens to be grey, and this fixture's is a teal. Their colour
       has not stopped travelling: it is still what the almanac's lit
       days are drawn in, which is checked further down. */
    const faceFill = await fp.$eval('.fr-row .pic svg rect', (e) => e.getAttribute('fill'));
    const neutral = await fp.evaluate(() => getComputedStyle(document.documentElement)
      .getPropertyValue('--tick-off').trim());
    ok('their face is the same silhouette as everybody\u2019s, not their own colour',
      faceFill.toLowerCase() === neutral.toLowerCase()
      && faceFill.toLowerCase() !== '#0f6e6a', { faceFill, neutral });

    /* Measured on composited pixels, not argued from the token. Every
       one of the 169 reader-against-leader pairings was measured when
       this was written: aiming at a bare 3:1 puts 26 of them under it
       on screen, worst 2.92:1, because the page draws three washes over
       --g0 and the arithmetic only knows about --g0. The 3.4 the code
       aims at leaves the worst at 3.25:1 and leaves 97 of the 169
       exactly their own accent.

       THE SQUARE IS A LINE NOW. Thirteen reader pages became one, so
       what varies is the peer's accent and — through --g1 alone — the
       hue of the page it lands on. The readers below are hues rather
       than names, and that is a repair rather than a rename: this list
       said slate, blush, mist and linen, which were LIGHT palettes
       deleted a year before the wheel was. scTheme fell back to the
       first entry on every one of them, so all six pairings had been
       measuring the same page for a year. A name nothing matches is a
       check that has stopped running, and this file already says so
       about a skip keyed to a deleted id.

       Drop CROWN_MIN to 3.0 and this section is what says so. */
    {
      const { PNG } = require('pngjs');
      const WORST = [[124, '#FF6FA5'], [340, '#FF6FA5'], [124, '#5CC8F8'],
                     [200, '#0F6E6A'], [42, '#FFB020'], [340, '#FF8A5B']];
      let low = { r: 99 };
      for (const [reader, acc] of WORST) {
        /* THE SERVER'S COPY TOO, and the first version only wrote the
           cache. Arriving at the screen refreshes from the worker, so
           the planted accent was overwritten by the seeded one before
           a single pixel was read: all six pairings measured the same
           colour and dropping CROWN_MIN to 3.0 sailed through. */
        const seeded = JSON.parse(store.get('rec:JADE2K7P'));
        seeded.acc = acc;
        store.set('rec:JADE2K7P', JSON.stringify(seeded));
        await fp.evaluate(([t, a]) => {
          localStorage.setItem('sched.accent.v1', String(t));
          const c = JSON.parse(localStorage.getItem('sched.peer.v1'));
          c.JADE2K7P.acc = a;
          localStorage.setItem('sched.peer.v1', JSON.stringify(c));
          localStorage.setItem('sched.view.v1', 'friends');
        }, [reader, acc]);
        await fp.reload({ waitUntil: 'networkidle' });
        await fp.evaluate(async () => { await document.fonts.ready; });
        await fp.waitForTimeout(160);
        const box = await fp.$eval('.fr-crown', (e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        const png = PNG.sync.read(await fp.screenshot());
        const at = (x, y) => {
          const i = (png.width * Math.round(y * 2) + Math.round(x * 2)) << 2;
          return [png.data[i], png.data[i + 1], png.data[i + 2]];
        };
        const lum = ([r, g, b]) => {
          const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
          return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
        };
        const ratio = (a, b) => {
          const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
          return (x + .05) / (y + .05);
        };
        /* The ground is sampled 26px clear of the box, because the halo
           reaches 7px past it and is the same colour as the glyph.
           Sampling inside it would compare the mark against itself. */
        const ground = at(box.x + box.w + 26, box.y + box.h / 2);
        const px = [];
        for (let x = 3; x < box.w - 3; x++)
          for (let y = 3; y < box.h - 3; y++) px.push(at(box.x + x, box.y + y));
        const gl = lum(ground);
        px.sort((m, n) => Math.abs(lum(n) - gl) - Math.abs(lum(m) - gl));
        const mark = px.slice(0, 12)
          .reduce((s, q) => q.map((c, i) => s[i] + c), [0, 0, 0]).map((c) => c / 12);
        const r = +ratio(mark, ground).toFixed(2);
        if (r < low.r) low = { r, reader, acc };
      }
      ok('a friend’s crown clears 3:1 on your page, measured on pixels',
        low.r >= 3, JSON.stringify(low));
    }

    /* ── the smallest disc, and the unlit stop ──
       Two claims that only pixels can settle. The disc is the one that
       was WRONG: varying their accent's alpha put solar's amber at
       1.30:1 on the white page, and the pass that found it also found
       that opacity was never the lever — the amber is about 1.9:1 on
       white at full strength. Size carries the count now and every
       disc is the colour scCrown already solved.

       Measured POLARITY-AGNOSTICALLY, from the most common pixel in
       the box outward. The first version of the stop measurement took
       the 3rd percentile as ink and the 90th as ground, which assumes
       dark type on a light track — seven of the thirteen themes are
       dark, so on those it compared the track against itself and
       reported 1.05:1 for a control that actually measures 7.6:1. */
    {
      const { PNG } = require('pngjs');
      const lum = ([r, g, b]) => {
        const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
        return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
      };
      const ratio = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
        return (x + .05) / (y + .05);
      };
      let lowD = { r: 99 }, lowS = { r: 99 };
      for (const [reader, acc] of [[124, '#FFB020'], [340, '#FF6FA5'],
                                   [264, '#5CC8F8'], [42, '#FFB020']]) {
        const seeded = JSON.parse(store.get('rec:JADE2K7P'));
        seeded.acc = acc;
        /* Every day exactly ONE tick, so what is measured is the
           faintest mark this profile can draw. */
        seeded.days = {};
        for (let i = 0; i < 7; i++) seeded.days[day(i)] = { t: 1, b: 1 };
        /* A YEAR, because the profile is the almanac now and the
           check reads a cell of it. Every day lit at ONE, which is
           the faintest a lit day gets — and it is the same colour as
           a day with five on it, because the grid is binary. */
        seeded.year = '1'.repeat(371);
        store.set('rec:JADE2K7P', JSON.stringify(seeded));
        await fp.evaluate((t) => {
          localStorage.setItem('sched.accent.v1', String(t));
          localStorage.setItem('sched.view.v1', 'friends');
          localStorage.setItem('sched.fr.v1', 'board');
        }, reader);
        await fp.reload({ waitUntil: 'networkidle' });
        await fp.evaluate(async () => { await document.fonts.ready; });
        await fp.waitForTimeout(220);

        const png0 = PNG.sync.read(await fp.screenshot());
        const at0 = (x, y) => {
          const i = (png0.width * Math.round(y * 2) + Math.round(x * 2)) << 2;
          return [png0.data[i], png0.data[i + 1], png0.data[i + 2]];
        };
        const sb = await fp.$eval('#scFrFeed', (e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        const sp = [];
        for (let x = 10; x < sb.w - 10; x++)
          for (let y = 8; y < sb.h - 8; y++) sp.push(at0(sb.x + x, sb.y + y));
        const bag = {};
        sp.forEach((q) => { const k = q.join(); bag[k] = (bag[k] || 0) + 1; });
        const track = Object.entries(bag).sort((a, c) => c[1] - a[1])[0][0].split(',').map(Number);
        const tl = lum(track);
        const far = sp.slice().sort((m, n) => Math.abs(lum(n) - tl) - Math.abs(lum(m) - tl)).slice(0, 40);
        const glyph = far.reduce((z, q) => q.map((c, i) => z[i] + c), [0, 0, 0]).map((c) => c / 40);
        const rs = +ratio(glyph, track).toFixed(2);
        if (rs < lowS.r) lowS = { r: rs, reader };

        await fp.click('.fr-row.is-tap');
        await fp.waitForTimeout(540);
        /* A LIT cell of the almanac, not any cell. An unlit day is
           deliberately the flat neutral — "a day with none is never a
           red one" — so it makes no colour claim, and holding it to
           3:1 measures a mark that is not breaking the rule. That is
           how this once reported 1.18:1 against a design that was
           correct.

           It measured the thirty-day strip until the profile became a
           year; the claim is unchanged and the drawing moved, so the
           check moved with it rather than being deleted. The cells
           are about four pixels, so the sample is the centre. */
        const db = await fp.$$eval('.pf-yr i', (all) => {
          const e = all.filter((x) => x.style.background)[0];
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        if (!db) throw new Error('no lit day in the almanac to measure');
        const png = PNG.sync.read(await fp.screenshot());
        const at = (x, y) => {
          const i = (png.width * Math.round(y * 2) + Math.round(x * 2)) << 2;
          return [png.data[i], png.data[i + 1], png.data[i + 2]];
        };
        /* ── THE GROUND IS THE GAP, NOT THE ROW ABOVE ──
           This sampled 14px above the cell, which on this sheet lands
           on the MONTH LABELS — it read [140,140,148], which is
           --spent, so it measured the mark against a text colour and
           reported 1.28:1 on a mark drawn at the full accent. A check
           can be wrong about WHERE it looks as easily as about what it
           looks for, and the two are indistinguishable from the
           output; the Pattern axis made this exact mistake once
           already. The 2.5px gap between two cells is the sheet's own
           ground showing through and is five device pixels wide, so
           its centre is clean. */
        const rd = +ratio(at(db.x + db.w / 2, db.y + db.h / 2),
                          at(db.x + db.w + 1.25, db.y + db.h / 2)).toFixed(2);
        if (rd < lowD.r) lowD = { r: rd, reader, acc };
        await fp.keyboard.press('Escape');
        await fp.waitForTimeout(380);
      }
      ok('a lit day of the almanac clears 3:1 on your page, measured on pixels',
        lowD.r >= 3, JSON.stringify(lowD));
      ok('and the stop you are NOT on is still readable type',
        lowS.r >= 4.5, JSON.stringify(lowS));
    }
    {
      const seeded = JSON.parse(store.get('rec:JADE2K7P'));
      seeded.acc = '#0F6E6A';
      seeded.days = {};
      for (let i = 0; i < 12; i++) seeded.days[day(i)] = { t: (i % 5) + 1, b: (i % 4) + 1 };
      store.set('rec:JADE2K7P', JSON.stringify(seeded));
    }
    {
      const seeded = JSON.parse(store.get('rec:JADE2K7P'));
      seeded.acc = '#0F6E6A';
      store.set('rec:JADE2K7P', JSON.stringify(seeded));
    }
    await fp.evaluate(() => localStorage.removeItem('sched.accent.v1'));
    await fp.reload({ waitUntil: 'networkidle' });
    await fp.waitForTimeout(300);

    /* ── their page ── */
    await fp.click('.fr-row.is-tap');
    await fp.waitForTimeout(520);
    /* A YEAR, where this was thirty days and before that seven. The
       claim is unchanged — their page draws their record — and only
       the drawing moved, so the check moved with it rather than being
       deleted. 371 is 53 weeks, which is what makes the grid full
       columns of seven with no ragged end. */
    ok('their page shows a year of days',
      await fp.$$eval('.pf-yr i', (d) => d.length) === 371);
    /* Height says how many of the five and colour never says whether —
       the habits screen's rule. A day with nothing is the same shape,
       only shorter. */
    /* SIZE says how many, and every disc is drawn at full strength.
       The first cut varied the alpha of their accent instead and
       measured 1.30:1 on the white page for solar's amber — and
       opacity could never have fixed that, because the amber is about
       1.9:1 on white at FULL strength. Diluting a colour that already
       fails only makes the number worse. */
    /* ── AN OLD RECORD STILL READS ──
       Every record written before blocks were sent carries a bare
       NUMBER where this now expects two counts, and those records are
       on the server right now with up to thirty days left to live.
       Read as an object they give NaN in every figure they feed, so
       the shape is normalised on the way in — proven against a record
       in the old shape rather than trusted. */
    {
      const was = JSON.parse(store.get('rec:JADE2K7P'));
      const old2 = JSON.parse(JSON.stringify(was));
      old2.days = {};
      for (let i = 0; i < 5; i++) old2.days[day(i)] = 2;
      store.set('rec:JADE2K7P', JSON.stringify(old2));
      await fp.keyboard.press('Escape');
      await fp.waitForTimeout(200);
      await fp.reload({ waitUntil: 'networkidle' });
      await fp.waitForTimeout(800);
      const shown = await fp.$eval('.fr-row:not(.is-me) .fr-t', (e) => e.textContent);
      ok('a record from before blocks were sent still reads as a number',
        shown === '10', shown);
      store.set('rec:JADE2K7P', JSON.stringify(was));
      await fp.reload({ waitUntil: 'networkidle' });
      await fp.waitForTimeout(800);
      await fp.click('.fr-row.is-tap');
      await fp.waitForTimeout(540);
    }

    /* HEIGHT, now the strip is a month. A disc's diameter is bounded
       by the cell's width, and at thirty across a phone that is about
       four pixels — the smallest one measured 1.18:1 on the white page
       with nothing wrong but antialiasing. A bar's height is free of
       the count, so it can hold its colour at any width. */
    /* ── LIT OR NOT, AND NO RAMP ──
       The strip could say HOW MANY by height, because a bar's height
       is free of the count. A year grid cannot: every cell is the same
       box, and at four pixels across a phone a five-step ramp is
       invisible.

       It went in as an opacity ramp — which is exactly the mistake the
       paragraph above was written against, arriving again in the one
       drawing that cannot use the lever that replaced it. So the mark
       is binary: every lit day at the one strength scCrown solved to
       clear 3:1 on YOUR page, and an unlit one the flat neutral.

       Both halves, because "every cell is the same colour" is
       vacuously true of a grid with nothing lit in it. */
    const cells = await fp.$$eval('.pf-yr i', (b) => b.map((x) => ({
      bg: getComputedStyle(x).backgroundColor,
      o: getComputedStyle(x).opacity,
      lit: !!x.style.background })));
    const litSet = new Set(cells.filter((c) => c.lit).map((c) => c.bg));
    const dimSet = new Set(cells.filter((c) => !c.lit).map((c) => c.bg));
    ok('every lit day is the same colour at full strength, never a ramp',
      litSet.size === 1 && cells.every((c) => c.o === '1')
      && cells.filter((c) => c.lit).length > 30,
      { lit: [...litSet], op: [...new Set(cells.map((c) => c.o))] });
    ok('...and a day with nothing on it is one flat neutral, never a colour',
      dimSet.size <= 1, [...dimSet]);
    /* The day letters are GONE and the strip is thirty days. Two
       characters do not go in the nine pixels a month leaves per cell,
       and they were answering "which day is this" — a question about a
       week. Each cell still carries its own date in a title, which is
       what the letters were standing in for. Asserted as absence plus
       the thing that replaced it, because "no letters" alone passes on
       a strip that lost its cells too. */
    ok('a month has no room for day letters, and says the date instead',
      await fp.$$eval('.fp-w', (w) => w.length) === 0
      && await fp.$$eval('.fp-d', (d) =>
        d.every((x) => /^\d{4}-\d{2}-\d{2} · \d+ tick/.test(x.title))));
    /* ── WHAT THEY HAVE POSTED, AS A WALL ──
       It was every log drawn out in full one under another, which made
       the profile a second feed — and the feed is its own stop two taps
       away. A profile wants the shape of what somebody has done, so it
       is a grid, and the words are one press in. */
    ok('their posts are a wall of tiles rather than a second feed',
      await fp.$$eval('.sheet .fp-t', (t) => t.length) === 1
      && await fp.$$eval('.sheet .po', (p) => p.length) === 0);

    /* ── and one of them opens ── */
    await fp.click('.sheet .fp-t');
    await fp.waitForTimeout(320);
    const opened = await fp.evaluate(() => ({
      title: document.getElementById('scSheetTitle').textContent,
      posts: document.querySelectorAll('.sheet .po').length,
      cap: (document.querySelector('.sheet .po-c') || {}).textContent,
      /* A post is a card in the feed, where a stack of photographs
         needs a boundary; in a sheet the frame IS the sheet, and a
         bordered card inside one is the frame-inside-a-frame this
         project keeps taking out. Measured as the drawn border. */
      bare: parseFloat(getComputedStyle(
        document.querySelector('.sheet .po')).borderTopWidth) === 0,
      /* Nothing to press on somebody else's log: a control that exists
         and refuses is worse than one that is not there. */
      mine: document.querySelectorAll('.sheet .po .po-x').length,
      /* The sheet is one at a time in this app, so opening a post
         REPLACES the profile — and without a way back, closing lands
         on the board and the profile is two presses away again. */
      back: [...document.querySelectorAll('.sheet .menu-item')]
        .some((b) => /^Back to /.test(b.textContent)),
    }));
    ok('pressing a tile opens that post, bare and with no delete on it',
      opened.posts === 1 && opened.bare && opened.mine === 0
      && /light came up/.test(opened.cap || ''), opened);
    ok('...and it carries the way back to the profile it replaced',
      opened.title === 'Rae' && opened.back, opened);
    await fp.click('.sheet .menu-item');
    await fp.waitForTimeout(320);
    ok('...which really goes back to it',
      await fp.$$eval('.sheet .fp-t', (t) => t.length) === 1);
    /* `.label` is 9px accent capitals at .2em, which is right where a
       sheet is a form and is the only thing separating one field from
       the next. Here the headings sit over a figure and a row of discs
       that separate themselves, so the same treatment reads as two
       small alarms. Scoped to this sheet — restyling .label itself
       would quietly have changed every other sheet in the app.

       `.sheet .fp-k` and not `.fp-k`, and that shipped wrong for one
       round: .label and .menu-item are defined further down the file,
       so at equal specificity they win however the new rule is
       written. The sheet came out with two red capital headings and a
       hairline under Remove, with the new classes on the elements
       doing nothing at all. */
    const heads = await fp.$$eval('.sheet .fp-k', (e) => e.map((x) => {
      const cs = getComputedStyle(x);
      return { t: cs.textTransform, ls: cs.letterSpacing, size: cs.fontSize };
    }));
    /* EVERY heading on the sheet rather than a count of two. It was
       pinned to the two the old body happened to draw, and the
       profile has sections now that come and go with what somebody
       shared — a number here would have to be edited every time one
       is added, which is a check that tracks the code rather than the
       claim. At least one, because "none are letterspaced" is
       vacuously true of a sheet with no headings. */
    ok('the sheet\u2019s headings are not letterspaced capitals',
      heads.length >= 1 && heads.every((h) => h.t === 'none'
        && parseFloat(h.ls) <= 0 && parseFloat(h.size) >= 11), JSON.stringify(heads));
    ok('and Remove carries no hairline and no paragraph',
      await fp.$eval('.fp-rm', (e) => getComputedStyle(e).borderBottomWidth === '0px'
        && !e.querySelector('.sub-note')));
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(420);

    /* ── writing one ── */
    await stop('feed');
    await fp.click('text=Write one');
    await fp.waitForTimeout(420);
    await fp.evaluate(() => {
      const c = document.createElement('canvas');
      c.width = c.height = 1200;
      const g = c.getContext('2d');
      const grd = g.createLinearGradient(0, 0, 1200, 1200);
      grd.addColorStop(0, '#0f7b6c'); grd.addColorStop(1, '#e2231a');
      g.fillStyle = grd; g.fillRect(0, 0, 1200, 1200);
      return new Promise((res) => c.toBlob((bl) => {
        const dt = new DataTransfer();
        dt.items.add(new File([bl], 'shot.jpg', { type: 'image/jpeg' }));
        const f = document.querySelector('.sheet .pic-file');
        f.files = dt.files;
        f.dispatchEvent(new Event('change', { bubbles: true }));
        res();
      }, 'image/jpeg', 0.9));
    });
    await fp.waitForTimeout(800);
    ok('the photograph previews before you commit to it',
      await fp.$eval('.lg-prev', (e) => !e.hidden));
    await fp.click('.lg-c:has-text("Mind")');
    await fp.fill('.sheet textarea', 'Walked the long way round.');
    await fp.click('text=Post it');
    await fp.waitForTimeout(1400);

    ok('the picture went up as bytes', [...store.keys()].filter((k) => k.startsWith('img:')).length === 1);
    const post = rec().logs[rec().logs.length - 1];
    ok('the log names the picture by id', /^[a-f0-9]{24}$/.test(post.img || ''), post.img);
    /* A post keeps the whole data URL locally so your own feed draws
       instantly and still draws with no signal. Pushed whole that is a
       second copy of the picture, base64, and base64 is a third bigger
       again — two of them and the record is past the worker's 96KB
       ceiling and every write comes back 413. The comment on the field
       said it was never sent; for one round that was the only place
       that was true. */
    ok('and the record carries no copy of the picture itself',
      !JSON.stringify(rec()).includes('data:image')
      && JSON.stringify(rec()).length < 4096, JSON.stringify(rec()).length);
    ok('both logs are in the feed, newest first',
      await fp.$$eval('#scFeed .po .po-n', (n) => n.map((x) => x.textContent).join())
        === 'Niko,Rae');

    /* ── THE CAPTION LEADS, AND THE PICTURE OPENS ──
       The caption sat UNDER the photograph, which is where one goes on
       a printed page and the wrong way round here: the card crops to a
       square, so on a phone the words were most of a screen below the
       name that owns them and you read the picture with nothing to
       read it against.

       Measured as BOXES rather than source order, because a rule that
       reordered them visually would pass any check on the DOM — and
       the reverse, an element moved in the source and then pushed back
       by CSS, is the same bug from the other side. */
    const lead = await fp.evaluate(() => {
      const c = [...document.querySelectorAll('#scFeed .po')]
        .find((x) => x.querySelector('.po-img') && x.querySelector('.po-c'));
      if (!c) throw new Error('no feed post with both a caption and a picture');
      const cap = c.querySelector('.po-c').getBoundingClientRect();
      const img = c.querySelector('.po-img').getBoundingClientRect();
      const head = c.querySelector('.po-h').getBoundingClientRect();
      return { cap: cap.top, img: img.top, head: head.bottom,
               tag: c.querySelector('.po-img').tagName,
               named: !!c.querySelector('.po-img').getAttribute('aria-label') };
    });
    ok('the caption sits under the name and above the picture',
      lead.cap > lead.head && lead.cap < lead.img, lead);
    /* A real BUTTON, not a listener on the wrapper: focusable, named,
       and reachable from a keyboard. The post's delete is a sibling
       rather than an ancestor, so nothing nests — a button inside a
       button is invalid and collapses to one press. */
    ok('...and the picture is a real control, named for what it does',
      lead.tag === 'BUTTON' && lead.named, lead);

    await fp.click('#scFeed .po .po-img');
    await fp.waitForTimeout(420);
    const shown = await fp.evaluate(() => {
      const v = document.querySelector('.ph');
      if (!v) return null;
      const r = v.getBoundingClientRect();
      const im = v.querySelector('img');
      return { w: Math.round(r.width), h: Math.round(r.height),
               z: +getComputedStyle(v).zIndex,
               fit: getComputedStyle(im).objectFit,
               role: v.getAttribute('role'), modal: v.getAttribute('aria-modal'),
               cap: !!v.querySelector('.ph-c') };
    });
    /* CONTAIN, not cover. The card crops to a square and this is the
       screen that does not, which is the entire reason to press it —
       a viewer that crops the same way shows you nothing new. */
    ok('pressing it opens the whole picture, over everything, uncropped',
      shown && shown.w === 390 && shown.h === 844 && shown.fit === 'contain'
      && shown.z > 60 && shown.role === 'dialog' && shown.modal === 'true'
      && shown.cap, shown);

    /* ── AND IT IS REMOVED, NOT HIDDEN ──
       A full-screen surface put away with the `hidden` attribute has
       broken six times in this app — the rail, the dots, the toast,
       the intro, the objectives row — every one of them invisibly,
       because an author `display` outranks the browser's own rule and
       the attribute goes on being set correctly the whole time. An
       element that is not in the document cannot swallow a press.
       Asserted as the node being GONE rather than not drawn. */
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(360);
    ok('Escape takes the picture away, and takes it out of the document',
      await fp.evaluate(() => document.querySelectorAll('.ph').length === 0));
    /* Escape reached the picture and NOT the sheet under it, which is
       the history veil's own rule one layer up. */
    await fp.click('#scFeed .po .po-img');
    await fp.waitForTimeout(420);
    await fp.click('.ph');
    await fp.waitForTimeout(360);
    ok('...and so does a tap anywhere on it',
      await fp.evaluate(() => document.querySelectorAll('.ph').length === 0));

    /* ══════════════════════════════════════════════════════
       WHAT YOU SHARE

       This is the reversal of the app's oldest rule, so it is the
       part of the suite worth the most: the old line was that a COUNT
       may leave and a LIST never may, and books, sessions and
       objectives are all lists. What replaces it is NOTHING LEAVES
       UNLESS YOU TURNED IT ON — which is only a promise if every
       switch starts off and an off switch genuinely sends nothing. */
    await stop('board');
    /* ── A SHEET LEFT OPEN EATS THE NEXT PRESS ──
       Pressing a switch does NOT close the profile — it is a setting,
       not an answer — so the sheet is still up when the next step
       reaches for the row underneath it, and Playwright reports it as
       exactly that: the sheet's subtree intercepts pointer events.
       This file has already recorded the rule twice (the bar's
       contrast sweep, the Popular episode block) and it caught me a
       third time. Idempotent, so it is safe wherever it is called. */
    const openMe = async () => {
      await fp.keyboard.press('Escape');
      await fp.waitForTimeout(360);
      await fp.click('.fr-row.is-me');
      await fp.waitForTimeout(520);
    };
    await openMe();
    const pv = await fp.evaluate(() => ({
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      rows: [...document.querySelectorAll('.pv-row')].map((b) => ({
        on: b.getAttribute('aria-checked'),
        role: b.getAttribute('role'),
        name: (b.querySelector('.pv-t b') || {}).textContent,
      })),
      bio: document.querySelectorAll('.sheet textarea').length,
      stored: localStorage.getItem('sched.share.v1'),
    }));
    /* ── YOUR OWN ROW OPENS YOUR PROFILE ──
       It opened the code sheet. What somebody presses their own name
       to change is what a friend can SEE; the code is a thing you
       show once, and it is still behind Your code. */
    ok('your own row opens your profile, with a switch for each thing',
      pv.title === 'Your profile' && pv.rows.length === 4
      && pv.bio === 1
      && pv.rows.map((r) => r.name).join('|')
         === 'Showing up|Objectives|Workouts|Reading', pv);
    /* A real role="switch" with aria-checked, not a styled div: a
       control whose whole job is to say on or off has to say it to a
       screen reader too. */
    ok('...and every one of them is a switch, and every one starts OFF',
      pv.rows.every((r) => r.role === 'switch' && r.on === 'false'), pv.rows);

    /* Push with everything still off, and read what actually left. */
    await fp.click('.sheet .btn.go');
    await fp.waitForTimeout(900);
    const bare = rec();
    ok('with every switch off, a push carries none of it',
      bare.year === '' && Array.isArray(bare.goals) && bare.goals.length === 0
      && Array.isArray(bare.work) && bare.work.length === 0
      && Array.isArray(bare.mind) && bare.mind.length === 0,
      { year: bare.year, goals: bare.goals, work: bare.work, mind: bare.mind });
    /* AND THE COUNTS STILL GO, which is the half that would pass on a
       build where the push had simply broken. */
    ok('...while the board still gets what it always got',
      !!bare.days && Object.keys(bare.days).length > 0
      && typeof bare.name === 'string', Object.keys(bare.days || {}).length);

    /* ── ONE SWITCH SENDS ONE THING ──
       Asserted per switch rather than by turning them all on, because
       "everything arrives" passes on a build where any switch sends
       everything — which is the bug this whole screen exists to make
       impossible. */
    await openMe();
    await fp.click('.pv-row >> nth=0');          /* Showing up */
    await fp.waitForTimeout(800);
    const one = rec();
    ok('turning ONE on sends that one and still nothing else',
      typeof one.year === 'string' && one.year.length === 371
      && one.goals.length === 0 && one.work.length === 0
      && one.mind.length === 0,
      { len: (one.year || '').length, goals: one.goals.length,
        work: one.work.length, mind: one.mind.length });
    /* A year as one digit a day: 371 days written as a map of objects
       is about nine kilobytes of a record that shares a 96KB ceiling
       with thirty logs. */
    ok('...and the year is one digit a day, not a map of objects',
      /^[0-9]{371}$/.test(one.year || ''), (one.year || '').slice(0, 24));

    await fp.click('.pv-row >> nth=3');          /* Reading */
    await fp.waitForTimeout(800);
    const two = rec();
    ok('a second switch adds only its own',
      two.year.length === 371 && Array.isArray(two.mind)
      && two.goals.length === 0 && two.work.length === 0,
      { mind: two.mind.length, goals: two.goals.length, work: two.work.length });

    /* ── AND SWITCHING ONE BACK OFF TAKES IT DOWN ──
       An off switch has to send the EMPTY shape rather than omit the
       key: a reader cannot tell a field somebody turned off from a
       field this build did not have, and the first has to overwrite
       what is already on the server. Asserted on the stored record,
       because that is the copy a friend reads. */
    await fp.click('.pv-row >> nth=0');
    await fp.waitForTimeout(800);
    ok('switching one back off takes it off the server, not just off your screen',
      rec().year === '', rec().year);

    /* ── THE THREE THINGS WITH NO SWITCH ──
       The week, how a day felt, and the note on a Mind entry. A
       switch for these would imply they are on the table. Checked
       against the WHOLE record rather than a field, because "the key
       is absent" passes on a build that smuggles them somewhere else.

       The tokens are ones no title or name can contain, which is the
       lesson the note check already learned: its first version looked
       for the word "indexed", which is a word the test itself types
       into a search box, so it matched the app working correctly. */
    await fp.click('.pv-row >> nth=1');
    await fp.click('.pv-row >> nth=2');
    await fp.waitForTimeout(900);
    const all = JSON.stringify(rec());
    ok('the week, the rating and your notes never leave — with everything on',
      !/WEEKONLYZQX|RATEONLYZQX|NOTEONLYZQX/.test(all)
      && !/"items"/.test(all) && !/sched\.rate/.test(all), all.slice(0, 200));

    /* ── THE BIO IS ITS OWN SWITCH ──
       A sentence that exists only to be read by somebody else is
       shared by being written and taken back by being cleared. Both
       directions, because "a bio arrives" passes on a build with no
       way to remove one. */
    await openMe();
    await fp.fill('.sheet textarea', 'Chasing a 5k PB.');
    await fp.click('.sheet .btn.go');
    await fp.waitForTimeout(900);
    ok('writing a bio shares it', rec().bio === 'Chasing a 5k PB.', rec().bio);
    await openMe();
    await fp.fill('.sheet textarea', '');
    await fp.click('.sheet .btn.go');
    await fp.waitForTimeout(900);
    ok('...and clearing it takes it back down', rec().bio === '', rec().bio);
    /* ══════════════════════════════════════════════════════
       AND A WAY TO GO AND LOOK

       A row of switches tells you what you have agreed to; it does not
       tell you what somebody SEES. The preview draws through the
       friend sheet's own body — the same function, with the same
       payload the push builds — so it cannot drift from the thing it
       is a preview of, and that is the only way one is worth opening.

       Asserted as the switches DECIDING it, not merely as a screen
       that draws: turn two on and two off, and the two that are off
       have to be absent here. */
    await openMe();
    await fp.click('.pv-row >> nth=0');          /* Showing up on */
    await fp.waitForTimeout(500);
    await fp.click('.pv-row >> nth=1');          /* Objectives on  */
    await fp.waitForTimeout(500);
    await fp.click('.sheet >> text=See it as a friend does');
    await fp.waitForTimeout(700);
    const seen = await fp.evaluate(() => ({
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      yr: document.querySelectorAll('.pf-yr i').length,
      shelf: document.querySelectorAll('.pf-shelf').length,
      cols: document.querySelectorAll('.pf-cols').length,
      /* THE ONE CONTROL A PREVIEW MUST NOT HAVE. Removing yourself
         from your own preview is not a thing that can mean anything,
         and a control that exists and refuses is worse than one that
         is not there. */
      rm: document.querySelectorAll('.fp-rm').length,
      back: [...document.querySelectorAll('.sheet .menu-item')]
        .some((b) => /Back to your profile/.test(b.textContent)),
    }));
    ok('you can see your own profile the way a friend does',
      seen.title === 'As a friend sees you' && seen.yr === 371
      && seen.rm === 0 && seen.back, seen);
    /* Reading and Workouts are still off, so they are not drawn — the
       preview is of the PAYLOAD rather than of the record. */
    ok('...and what you have not turned on is not in it',
      seen.shelf === 0 && seen.cols === 0, seen);
    /* The way back is a level, not a close: without it, shutting the
       preview lands you on the board and the switches are two presses
       away again. */
    await fp.click('.sheet >> text=Back to your profile');
    await fp.waitForTimeout(600);
    ok('...and the way back returns to the switches rather than closing',
      await fp.evaluate(() =>
        (document.getElementById('scSheetTitle') || {}).textContent === 'Your profile'
        && document.querySelectorAll('.pv-row').length === 4));

    /* And this block puts the app back the way it found it, which is
       the whole of what went wrong above. */
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(360);

    /* ══════════════════════════════════════════════════════
       READING ONE: THE ALMANAC

       The other half, and each passes on the other's bug — a profile
       that draws everything passes any check about what is sent, and
       a push that sends everything passes any check about what is
       drawn. This plants a peer record directly, because what is
       asserted here is the DRAWING rather than the round trip, and
       the round trip is what the section above is for. */
    const FULL = {
      code: 'ZZPROF01', name: 'Sam Okafor', acc: '#5FA8FF', ink: '#0C0C0E',
      bio: 'Training for a half in April.', logs: [], at: Date.now(),
      year: '5'.repeat(200) + '0'.repeat(100) + '3'.repeat(71),
      goals: ['20k steps a day', 'Read 12 books', 'Sub-90 half'],
      work: [{ n: 'Push', c: '#e6412f', v: 14 }, { n: 'Pull', c: '#2f7fe6', v: 12 }],
      mind: [{ t: 'Atomic Habits', a: 'James Clear', c: '', k: 'read' },
             { t: 'Deep Work', a: 'Cal Newport', c: '', k: 'read' },
             { t: 'The Daily Stoic', a: 'Ryan Holiday', c: '', k: 'pod' }],
      days: {},
    };
    const plant = async (peer) => {
      /* ── INTO THE SERVER TOO, NOT JUST THE CACHE ──
         A friend on the list whose record is not on the stub is a
         friend the app then GOES AND FETCHES — and the worker answers
         404, which Chromium logs as a console error and the last
         assertion in this section counts. Three of them, from two
         plants across two reloads.

         Seeding both is also the more honest fixture: it exercises
         the real pull rather than only the copy kept for painting
         offline. */
      store.set('rec:' + peer.code, JSON.stringify(peer));
      await fp.evaluate((pr) => {
        const f = JSON.parse(localStorage.getItem('sched.friends.v1') || '[]')
          .filter((x) => x.code !== pr.code);
        f.push({ code: pr.code, name: pr.name });
        localStorage.setItem('sched.friends.v1', JSON.stringify(f));
        const ps = JSON.parse(localStorage.getItem('sched.peer.v1') || '{}');
        ps[pr.code] = pr;
        localStorage.setItem('sched.peer.v1', JSON.stringify(ps));
      }, peer);
      await fp.reload({ waitUntil: 'networkidle' });
      await fp.waitForTimeout(600);
      await stop('board');
      await fp.evaluate((c) => {
        const r = [...document.querySelectorAll('.fr-row')]
          .find((x) => (x.textContent || '').includes(c));
        if (!r) throw new Error('no row for ' + c);
        r.click();
      }, peer.name);
      await fp.waitForTimeout(600);
    };
    await plant(FULL);
    const prof = await fp.evaluate(() => {
      const cell = [...document.querySelectorAll('.pf-yr i')];
      const cs = cell.length ? getComputedStyle(cell[0]) : null;
      const grid = document.querySelector('.pf-yr');
      return {
        title: (document.getElementById('scSheetTitle') || {}).textContent,
        bio: (document.querySelector('.pf-bio') || {}).textContent,
        cells: cell.length,
        /* Laid down the column and across, which is what makes a row
           one weekday and a column one week. Written as a plain grid
           it fills across and a year reads as noise. */
        flow: grid ? getComputedStyle(grid).gridAutoFlow : null,
        rows: grid ? getComputedStyle(grid).gridTemplateRows.split(' ').length : 0,
        label: grid ? grid.getAttribute('aria-label') : null,
        role: grid ? grid.getAttribute('role') : null,
        goals: [...document.querySelectorAll('.pf-gt')].map((g) => g.textContent),
        shelf: document.querySelectorAll('.pf-shelf .mn-art').length,
        cols: [...document.querySelectorAll('.pf-col .fp-k')].map((k) => k.textContent),
        train: [...document.querySelectorAll('.pf-col')][0]
          ? [...document.querySelectorAll('.pf-col')][0]
              .querySelectorAll('.pf-lrow').length : 0,
      };
    });
    ok('a friend’s profile is a year of days, their goals, a shelf and two columns',
      prof.title === 'Sam Okafor'
      && prof.bio === 'Training for a half in April.'
      && prof.cells === 371 && prof.flow === 'column' && prof.rows === 7
      && prof.goals.length === 3 && prof.shelf === 3
      && prof.cols.join('|') === 'Training|Listening' && prof.train === 2, prof);
    /* role="img" with a written label: the grid is the only fact up
       there that nothing else repeats, so hiding it from a screen
       reader throws it away. */
    ok('...and the year is spoken as one picture rather than 371 marks',
      prof.role === 'img' && /\d+ of the last 371 days/.test(prof.label || ''),
      prof.label);

    /* ── A DAY WITH NOTHING ON IT IS NEVER A RED ONE ──
       The habits screen's rule and its reason: a wash of colour
       across a month somebody missed is a judgement about them. The
       COUNT moves the strength; the hue never moves at all. Measured
       on composited pixels, and the unlit cell is held to being a
       grey with no channel standing out. */
    const yr = await fp.evaluate(() => {
      const c = [...document.querySelectorAll('.pf-yr i')];
      const px = (e) => getComputedStyle(e).backgroundColor;
      return { lit: px(c[0]), unlit: px(c[210]),
               litOp: getComputedStyle(c[0]).opacity };
    });
    const chan = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const spread = (s) => { const n = chan(s); return Math.max(...n) - Math.min(...n); };
    ok('a day with nothing on it is a flat grey, never a colour',
      spread(yr.unlit) < 12 && spread(yr.lit) > 20, yr);

    /* ── AND A SECTION THEY DID NOT SHARE IS NOT DRAWN ──
       Not drawn empty, not drawn as a heading over nothing. Both
       directions in one pass, because "it draws what is there"
       passes on a build that draws every section always. */
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(400);
    await plant({ code: 'ZZPROF02', name: 'Quiet Pat', acc: '#8B72FF',
      ink: '#0C0C0E', bio: '', year: '', goals: [], work: [], mind: [],
      logs: [], days: {}, at: Date.now() });
    const quiet = await fp.evaluate(() => ({
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      bio: document.querySelectorAll('.pf-bio').length,
      yr: document.querySelectorAll('.pf-yr').length,
      goals: document.querySelectorAll('.pf-gt').length,
      shelf: document.querySelectorAll('.pf-shelf').length,
      cols: document.querySelectorAll('.pf-cols').length,
      /* The sheet is still a sheet: their name and the way out. */
      rm: document.querySelectorAll('.fp-rm').length,
    }));
    ok('somebody who shares nothing draws nothing, and the sheet still works',
      quiet.title === 'Quiet Pat' && quiet.bio === 0 && quiet.yr === 0
      && quiet.goals === 0 && quiet.shelf === 0 && quiet.cols === 0
      && quiet.rm === 1, quiet);
    await fp.keyboard.press('Escape');
    await fp.waitForTimeout(400);

    /* ── leaving ── */
    await stop('board');
    await fp.click('#scTabYou');
    await fp.waitForTimeout(460);
    await fp.click('.sheet >> text=Friends');
    await fp.waitForTimeout(460);
    ok('your code is on the friends settings too, as a reference',
      (await fp.$eval('.fr-code', (e) => e.textContent)) === mine.code);
    await fp.click('text=Turn friends off');
    await fp.waitForTimeout(420);
    await fp.click('.sheet .btn.bad');
    await fp.waitForTimeout(900);
    ok('leaving deletes your record from the server', !store.get('rec:' + mine.code));
    ok('and the write key with it', !store.get('key:' + mine.code));
    ok('and clears the friend list out of this browser',
      await fp.evaluate(() => localStorage.getItem('sched.friends.v1') === '[]'));
    /* Your week, your ticks and your streak never left, so leaving
       cannot take them. */
    ok('your own ticks are untouched — they were never up there',
      await fp.evaluate(() => {
        const t = JSON.parse(localStorage.getItem('sched.tick.v1') || '{}');
        return Object.keys(t.ticks || t).length > 0;
      }));
    ok('and the board still has you on it', await fp.$$eval('.fr-row', (r) => r.length) === 1);

    ok('no page errors through any of the friends half', ferrs.length === 0, ferrs);
    await fp.close();

    /* ═══ the other phone ═══
       Everything above is one device that was seeded with the server's
       address. This is the person it was sent TO: a fresh context, a
       browser that has never heard of this app, nothing in
       localStorage, and one link.

       It is the only assertion that can hold the feature, because every
       part of it is invisible from inside the sending phone — the hash
       being read, the server coming out of the link rather than out of
       the build, the add happening without anybody typing, and the URL
       being clean afterwards.

       THE LIVE SERVER IS ROUTED TO A REFUSAL, not left to the network.
       If the link is not read, `HOME` is the fallback and this test
       would quietly make a real request to the deployed worker — which
       is a test that reaches production and, worse, one that could pass
       while doing it. Aborted and counted, so the fallback is a
       failure rather than a round trip. */
    {
      const gp = await browser.newPage({ ...PHONE });
      const gerrs = [];
      gp.on('pageerror', (e) => gerrs.push(String(e)));
      gp.on('console', (m) => { if (m.type() === 'error') gerrs.push(m.text()); });

      const live = [];
      await gp.route('https://sched.nikorapullin.workers.dev/**', (route) => {
        live.push(route.request().url());
        return route.abort();
      });
      await gp.route(HOST + '/**', async (route) => {
        const r = route.request();
        const res = await worker.fetch(new Request(r.url(), {
          method: r.method(), headers: r.headers(),
          body: ['GET', 'HEAD'].includes(r.method()) ? undefined : r.postDataBuffer(),
        }), env);
        await route.fulfill({ status: res.status,
          headers: Object.fromEntries(res.headers),
          body: Buffer.from(await res.arrayBuffer()) });
      });
      /* NOTHING about FRIENDS is seeded. No net record, no url — the
         point is that the link is the only thing this browser is told.
         The intro is a different question: it is a full-screen surface
         on a first visit and this page presses a tab, so it is marked
         seen the same way every other page here marks it. */
      await gp.addInitScript(() => {
        localStorage.setItem('sched.tour.v1', '1');
        localStorage.setItem('sched.hint2.v1', '1');
        localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
        const F = new Date('2026-09-01T09:30:00').getTime(), R = Date;
        window.Date = class extends R {
          constructor(...a) { super(...(a.length ? a : [F])); }
          static now() { return F; }
        };
        delete window.SpeechRecognition;
        delete window.webkitSpeechRecognition;
      });

      /* Rae is back on the server — the phone above deleted its own
         record on the way out, not hers. */
      const url = `${BASE}/schedule/#add=JADE2K7P&at=${encodeURIComponent(HOST)}`;
      await gp.goto(url, { waitUntil: 'networkidle' });
      await gp.waitForTimeout(1400);

      ok('a link opens the app on the friends screen, with nothing pressed',
        !(await gp.$eval('#scFriends', (e) => e.hidden)));
      ok('...and the address it was sent to came out of the link',
        (await gp.evaluate(() =>
          (JSON.parse(localStorage.getItem('sched.net.v1') || '{}')).url)) === HOST, HOST);
      ok('...so the built-in server was never asked', live.length === 0, live);
      ok('...it claimed a code of its own on the way',
        await gp.evaluate(() => {
          const n = JSON.parse(localStorage.getItem('sched.net.v1') || '{}');
          return !!(n.on && /^[A-Z0-9]{8}$/.test(n.code));
        }));
      ok('...and the person who sent it is on the list, untyped',
        (await gp.evaluate(() => (JSON.parse(localStorage.getItem('sched.friends.v1')) || [])
          .map((f) => f.code).join())) === 'JADE2K7P');
      ok('...showing on the board by name',
        (await gp.$$eval('.fr-n', (n) => n.map((x) => x.textContent))).includes('Rae'));

      /* Left in the bar it is redeemed again on every reload — spent, so
         it adds nothing, but a bookmark of this page is then somebody
         else's invitation for as long as it exists. */
      ok('the link is taken out of the address bar once it is spent',
        !(await gp.evaluate(() => location.hash)));

      /* It is one invitation, not a standing instruction. The reload is
         the real test of that: `invite` is cleared before the request
         rather than in its callback, so a second pass cannot re-add. */
      await gp.reload({ waitUntil: 'networkidle' });
      await gp.waitForTimeout(900);
      ok('and reloading does not add them a second time',
        (await gp.evaluate(() => (JSON.parse(localStorage.getItem('sched.friends.v1')) || [])
          .length)) === 1);

      /* The other door into the same reader. Somebody who was sent a
         link and pasted the whole thing gets the same result as
         somebody who was told the code across a table. */
      await gp.evaluate(() => {
        localStorage.setItem('sched.friends.v1', '[]');
        localStorage.setItem('sched.peer.v1', '{}');
        /* A NICKNAME FIRST, because Add a friend is not on the screen
           until there is one — before a profile there is nothing to
           add anybody to. This phone got here through a LINK, which
           needs no profile and added its friend untyped; typing a code
           in is the other door, and that one asks you to exist first. */
        const n = JSON.parse(localStorage.getItem('sched.net.v1') || '{}');
        n.name = 'Sent';
        localStorage.setItem('sched.net.v1', JSON.stringify(n));
      });
      await gp.reload({ waitUntil: 'networkidle' });
      await gp.waitForTimeout(700);
      await gp.click('.tab[data-view="friends"]');
      await gp.waitForTimeout(400);
      await gp.click('text=Add a friend');
      await gp.waitForTimeout(460);
      await gp.fill('.sheet input[type=text]', url);
      await gp.click('.sheet .btn.go');
      await gp.waitForTimeout(900);
      ok('a whole link pasted into the field works as well as a code',
        (await gp.evaluate(() => (JSON.parse(localStorage.getItem('sched.friends.v1')) || [])
          .map((f) => f.code).join())) === 'JADE2K7P');

      /* A link naming a server you are not on is refused rather than
         followed. Following it would point an app with a record and a
         friend list on one server at another, orphaning both — and the
         read would then miss on every code already on the list. */
      await gp.click('text=Add a friend');
      await gp.waitForTimeout(460);
      await gp.fill('.sheet input[type=text]',
        `${BASE}/schedule/#add=QQQQ2222&at=${encodeURIComponent('https://elsewhere.example')}`);
      await gp.click('.sheet .btn.go');
      await gp.waitForTimeout(700);
      ok('...but a link to a different server is refused, not followed',
        (await gp.$eval('#scToast', (e) => e.textContent)).includes('another server')
        && (await gp.evaluate(() =>
          (JSON.parse(localStorage.getItem('sched.net.v1') || '{}')).url)) === HOST,
        await gp.$eval('#scToast', (e) => e.textContent));

      ok('no page errors on the phone that was sent the link',
        gerrs.length === 0, gerrs);
      await gp.close();
    }

    globalThis.Date = RealDate;
  }

  /* ── the same app on a 12-hour phone ──
     A format that follows the device cannot be checked on one device.
     Its own context at en-US, seeded and frozen exactly as the main
     one is, and every place a time is drawn has to come back with a
     meridiem — the head's clock, the span's ends, and a row.

     THE MERIDIEM IS ONCE PER RANGE, on the end. A row reading
     "9:00 AM–11:00 AM" is the second one taking the column the name
     needs, and with an end time known and a block under twelve hours
     the start already has only one reading. Both halves are asserted,
     because "it has a meridiem" passes on a row carrying two.

     And the EDIT FIELDS stay 24-hour whatever the phone shows:
     <input type="time"> takes that format and nothing else, so a
     sweep that reached them would break the sheet on exactly the
     phones this was written for. */
  {
    const up = await browser.newPage({ ...PHONE, locale: 'en-US' });
    await up.addInitScript(([w, f]) => {
      localStorage.setItem('sched.v1', JSON.stringify(w));
      localStorage.setItem('sched.view.v1', 'list');
      localStorage.setItem('sched.tour.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.net.v1', JSON.stringify({
        url: 'about:blank', code: '', key: '', name: '', pic: '', on: false }));
      const R = Date;
      // eslint-disable-next-line no-global-assign
      Date = class extends R {
        constructor(...a) { super(...(a.length ? a : [f])); }
        static now() { return f; }
      };
    }, [WEEK, new Date('2026-09-01T09:30:00').getTime()]);
    await up.goto(BASE + '/schedule/', { waitUntil: 'networkidle' });
    await up.waitForTimeout(400);
    const twelve = await up.evaluate(() => ({
      head: document.getElementById('scHdDate').textContent,
      row: [...document.querySelectorAll('.row[data-id] .t')]
        .map((t) => t.textContent),
    }));
    /* The span's own two ends went with the span; the head's clock
       and the rows' ranges are what a person reads a time off now. */
    ok('a 12-hour phone gets 12-hour times',
      /9:30 AM$/.test(twelve.head), twelve);
    const withMer = twelve.row.filter((t) => /[AP]M/.test(t));
    ok('...and a row carries the meridiem once, on the end',
      withMer.length === twelve.row.length && twelve.row.length > 1
      && twelve.row.every((t) => (t.match(/[AP]M/g) || []).length === 1
        && /[AP]M$/.test(t)), twelve.row);
    /* Twice: the editor is behind a double tap now. */
    await up.dblclick('.row[data-id]');
    await up.waitForTimeout(440);
    const fields = await up.$$eval('#scSheetBody input[type="time"]',
      (i) => i.map((x) => x.value));
    ok('...while the edit fields stay strict 24-hour, which is all they take',
      fields.length === 2 && fields.every((v) => /^\d{2}:\d{2}$/.test(v)), fields);
    await up.close();
  }

  /* ═══════════════════════════════════════════════════════════
     THE WORKOUT DECK

     Finish a training block and it asks what you trained: four kinds
     of session, and the one you press opens into its own. Everything
     here fails silently — a record filed under a key two cards share,
     a figure at 3:1 on the card's own ground, a deck whose back cards
     land square on top of the front one — so none of it is read off a
     declaration.
     ═══════════════════════════════════════════════════════════ */
  {
    /* Its own require and its own scale: the pair at the top of this
       file are block-scoped to the section that declared them. */
    const { PNG: PNG5 } = require('pngjs');
    const dpr5 = 2;
    const deck = async (theme) => {
      await page.evaluate((t) => {
        if (t !== null) localStorage.setItem('sched.accent.v1', String(t));
        else localStorage.removeItem('sched.accent.v1');
        localStorage.removeItem('sched.train.v1');
        localStorage.removeItem('sched.tick.v1');
        localStorage.removeItem('sched.log.v1');
        localStorage.setItem('sched.view.v1', 'tally');
      }, theme);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(320);
      await page.click('.ty-card[data-item="t"]');
      await page.waitForTimeout(560);
    };
    const face = () => page.evaluate(() => ({
      title: document.getElementById('scSheetTitle').textContent,
      chips: [...document.querySelectorAll('.wc-chips .wc-chip')].map((c) => c.textContent),
      on: [...document.querySelectorAll('.wc-chips .wc-chip')]
        .findIndex((c) => c.getAttribute('aria-pressed') === 'true'),
      cards: [...document.querySelectorAll('.wc')].map((c) => c.className),
      front: (document.querySelector('.wc.is-front') || {}).dataset,
      foot: [...document.querySelectorAll('.wc-foot button')]
        .map((b) => b.textContent.trim()).filter(Boolean),
      back: !!document.querySelector('.wc-back'),
    }));

    await deck(null);
    const one = await face();
    ok('ticking a training block asks what you trained',
      one.title === 'What did you train?'
      && one.chips.join('|') === 'All exercises|PPL|Run|Recovery', one);

    /* A DECK IS THREE CARDS AND ONE OF THEM IS PRESSABLE. The pair
       behind show an edge each; focusable, they are two tab stops that
       do nothing and two more things a screen reader has to walk past.

       AND THEY CARRY NO WORDS. They used to be the next two workouts
       in the group, drawn in full and clipped to the corner showing —
       so pressing a chip changed what was BEHIND the card as well as
       the card itself, and mid-deal another session's name and figures
       slid under the one you were reading. What they hold now is the
       front card's own surface — its hue and its swoop, one child
       each and no text at all — so the hand is three of the same card.
       The fan is 13 and 25 pixels, so a name drawn there could not be
       read and would be DOM the deck pays for on every draw. */
    const shape = await page.evaluate(() => {
      const all = [...document.querySelectorAll('.wc')];
      const front = document.querySelector('.wc.is-front');
      const r = front.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { n: all.length,
        tags: all.map((c) => c.tagName),
        hidden: all.filter((c) => c.getAttribute('aria-hidden') === 'true').length,
        onTop: front.contains(hit),
        behind: all.filter((c) => c !== front)
          .map((c) => c.childNodes.length + ':' + c.textContent.trim().length),
        only: all.filter((c) => c !== front)
          .every((c) => c.firstChild && c.firstChild.classList
            && c.firstChild.classList.contains('wc-sw')) };
    });
    ok('...as a stack of three, one of them a button, the front one on top',
      shape.n === 3 && shape.tags.filter((t) => t === 'BUTTON').length === 1
      && shape.hidden === 2 && shape.onTop, shape);
    ok('...and the two behind carry the swoop and not one word',
      shape.behind.join('|') === '1:0|1:0' && shape.only, shape);

    /* ── THE DEAL ──
       All three fly in, and the keyframes name `translate` and `scale`
       rather than `transform`. That is the whole assertion: b1 and b2
       ARE a transform — translate(15px, 11px) scale(.965) is what makes
       one the card behind — so keyframes touching `transform` replace
       it, the pair land square on the front card, and the deck arrives
       as a single card. Read as the resting transform surviving while
       the animation is running. */
    const deal = await page.evaluate(() => {
      const of = (s) => {
        const el = document.querySelector(s);
        const cs = getComputedStyle(el);
        return { name: cs.animationName, delay: cs.animationDelay,
          m: cs.transform, state: el.getAnimations().length };
      };
      return { b2: of('.wc.b2'), b1: of('.wc.b1'), front: of('.wc.is-front') };
    });
    const m1 = ((deal.b1.m.match(/matrix\(([^)]+)\)/) || [])[1] || '')
      .split(',').map(Number);
    ok('all three are dealt in, on their own delays',
      [deal.b2, deal.b1, deal.front].every((d) => d.name === 'wcDeal' && d.state > 0)
      && new Set([deal.b2.delay, deal.b1.delay, deal.front.delay]).size === 3, deal);
    /* ── AND THE DEAL DOES NOT FLATTEN THE TWO BEHIND ──
       Read as the resting transform surviving while the animation is
       running: b1 is offset AND turned, so the matrix has to carry a
       .965 scale, three degrees of rotation and a 13/9 translate. Any
       keyframe naming `transform` replaces all of that, the pair land
       square on the front card, and the deck arrives as one card with
       a heavier shadow — which is not a shape anybody would report.
       Decomposed rather than string-matched, because the six numbers
       are a product of three properties and a literal would have to be
       retyped every time one of them is nudged. */
    const scale1 = Math.hypot(m1[0], m1[1]);
    const turn1 = Math.atan2(m1[1], m1[0]) * 180 / Math.PI;
    ok(`...and the deal does not flatten the two behind onto the front card `
      + `(${scale1.toFixed(3)} at ${turn1.toFixed(1)}°)`,
      Math.abs(scale1 - .965) < .004 && Math.abs(turn1 - 3) < .3
      && m1[4] === 13 && m1[5] === 9, deal.b1.m);

    /* ── AND IT DEALS AGAIN ON EVERY KIND ──
       This asserted the opposite for a long time: the deck dealt once
       and every later draw put the same fold up with no entrance,
       because re-dealing on every press meant sitting through four
       entrances to compare four splits. That was right about draw()
       and wrong about WHICH draws.

       The four kinds are a HAND, and choosing between All exercises,
       PPL, Run and Recovery CASCADES it: the front card leaves first
       and the two behind follow it out, then the new hand lands back
       to front. What that level must not do is peel, which is the step
       through one hand below — and an effort, a length or a pick move
       the deck at all.

       THE STAGGER IS THE WHOLE OF IT, so it is asserted as three
       different delays rather than as a named animation: a cascade
       whose three cards share one delay is the block this replaced,
       and it would pass any check that only read the keyframes' name. */
    await page.click('.wc-chips .wc-chip:nth-child(2)');
    await page.waitForTimeout(60);
    const again = await page.evaluate(() => {
      const deck = document.querySelector('.wc-deck');
      const of = (s2) => {
        const e = deck.querySelector(s2);
        if (!e) return null;
        const cs = getComputedStyle(e);
        return { name: cs.animationName, delay: parseFloat(cs.animationDelay) };
      };
      return {
        out: ['.wc.is-out:not(.b1):not(.b2)', '.wc.is-out.b1', '.wc.is-out.b2'].map(of),
        into: ['.wc.is-front', '.wc.b1:not(.is-out)', '.wc.b2:not(.is-out)'].map(of),
        on: deck.classList.contains('is-cascading'),
        dealing: deck.classList.contains('is-dealing') };
    });
    const delays = (a) => a.map((x) => x && x.delay);
    ok('...and a press on another KIND cascades the whole hand out',
      again.on && !again.dealing
      && again.out.every((x) => x && x.name === 'wcCascOut')
      && again.into.every((x) => x && x.name === 'wcCascIn'), again);
    ok(`...front first out, back first in (${delays(again.out).join('/')} then `
      + `${delays(again.into).join('/')})`,
      again.out[0].delay < again.out[1].delay && again.out[1].delay < again.out[2].delay
      && again.into[0].delay > again.into[1].delay
      && again.into[1].delay > again.into[2].delay, again);
    await page.waitForTimeout(1800);
    await page.click('.wc-chips .wc-chip:nth-child(1)');
    await page.waitForTimeout(1800);

    /* ── THE SECOND LEVEL LIFTS, AND ONLY THE FRONT CARD MOVES ──
       Pressing a kind card replaced the front card outright, which
       after a dealt first level reads as dead rather than as restraint.
       Four entrances were rendered over the real sheet before this one
       — a lateral page, a short fold, the whole hand tightening, and
       this — and what settled it is that the other three all move
       something the deal already moved. The two behind carry no
       information, so anything they do is decoration; holding them
       perfectly still is the property being asserted.

       DRIVEN, not read off the stylesheet: a rule naming .is-front is
       only worth anything if the class is on the card the press
       produces, and the whole mechanism is a flag consumed by the next
       draw. */
    const lift = await page.evaluate(() => {
      document.querySelector('.wc.is-front').click();            /* into a group */
      const of = (sel) => {
        const el = document.querySelector(sel);
        const cs = getComputedStyle(el);
        return { name: cs.animationName, ms: parseFloat(cs.animationDuration) * 1000,
          n: el.getAnimations().length };
      };
      return { front: of('.wc.is-front'), b1: of('.wc.b1'), b2: of('.wc.b2'),
        deck: document.querySelector('.wc-deck').className,
        /* The keyframes, off the stylesheet, for the one thing a
           computed style cannot say: `transform` in a keyframe REPLACES
           the resting transform that makes the pair the cards behind.
           This rule only reaches .is-front today, and it uses the
           independent properties anyway so the next hand it is pointed
           at survives. */
        keys: [...document.styleSheets].flatMap((sh) => {
          try { return [...sh.cssRules]; } catch (e) { return []; }
        }).filter((r) => r.type === CSSRule.KEYFRAMES_RULE && r.name === 'wcTurn')
          .map((r) => [...r.cssRules].map((k) => k.style.cssText).join(' ')) };
    });
    await page.waitForTimeout(320);
    ok('stepping into a group lifts the front card in',
      lift.front.name === 'wcTurn' && lift.front.n > 0
      && /is-turning/.test(lift.deck), lift);
    ok('...and the two behind do not move at all',
      lift.b1.name === 'none' && lift.b2.name === 'none'
      && lift.b1.n === 0 && lift.b2.n === 0, lift);
    /* SHORTER AND SHALLOWER THAN THE DEAL, asserted as a relationship
       so a change to either curve keeps the claim meaningful: it has to
       read as the same object settling rather than as a second
       arrival. */
    const dealMs = await page.evaluate(() => {
      const el = document.createElement('i');
      el.className = 'wc is-front';
      const d = document.createElement('div');
      d.className = 'wc-deck is-dealing';
      d.appendChild(el); document.body.appendChild(d);
      const ms = parseFloat(getComputedStyle(el).animationDuration) * 1000;
      d.remove(); return ms;
    });
    /* Shorter than the deal, and it was "under half" for one round —
       an arbitrary line that the first visible version of this
       animation immediately failed. What the number has to hold is
       that the two are the same gesture at two sizes, not that one is
       any particular fraction of the other. */
    ok(`the lift is shorter than the deal (${lift.front.ms}ms against ${dealMs}ms)`,
      lift.front.ms > 0 && lift.front.ms < dealMs * .7, { lift: lift.front.ms, dealMs });
    ok('...and it names translate, never transform',
      lift.keys.length === 1 && /translate/.test(lift.keys[0])
      && !/transform/.test(lift.keys[0]), lift.keys);

    /* ── AND INSIDE A GROUP THE WHOLE HAND IS TAKEN OFF THE LEFT ──
       You are stepping THROUGH one hand here, not choosing another, so
       the hand you were on is taken off and the next comes over the
       top. THE HAND, not its top card: the two behind are the same
       card as the one in front, so taking only the front one off left
       two Chest slabs standing while a Push card slid in over them.

       The outgoing cards are KEPT rather than rebuilt: they carry the
       workout you were looking at, with its own name and its own
       colour, and the whole gesture is that THOSE cards are the ones
       going. Asserted by the front one's name, so a fresh element
       standing in for it would fail — and by every outgoing card
       sitting BEFORE every arriving one, since these are absolutely
       positioned siblings with no z-index and source order is the
       stacking order. The outgoing card used to go in last, on top of
       everything, and fade to nothing there: two names and two swoops
       legible at once, which is a card passing through another card
       rather than past it. Neither keyframe carries an opacity now, so
       the order is the only thing keeping the two hands from being
       double-exposed while they cross — which is why it is asserted
       here and why the fade is asserted ABSENT below. */
    /* .wc-n is the card's NAME. The first `b` on a card is the Est.
       time figure, which is the same "50 min" on both cards and would
       have made this pass on any element at all. */
    const was = await page.evaluate(() =>
      document.querySelector('.wc.is-front .wc-n').textContent);
    /* ── AND THE HAND IS ALL THE SAME CARD ──
       The two behind were grey slabs, which said "there are more of
       these" and left out WHICH these are: a stack of grey behind a red
       card is a stack of something else. They carry the front card's
       own hue and its own swoop now, so Chest is a hand of Chest.

       No WORDS on them, and that is the half that must not drift: the
       fan is 13 and 25 pixels, so a name drawn there cannot be read and
       is DOM the deck pays for on every draw. Read as the elements
       being EMPTY of text rather than as a class, and with the two
       still aria-hidden and still not buttons — a stack of focusable
       cards is two tab stops that do nothing. */
    const hand = (tag) => page.evaluate((t) => {
      const at = (s) => document.querySelector('.wc-deck .wc' + s + ':not(.is-out)');
      const back = [at('.b2'), at('.b1')];
      const front = at('.is-front');
      return { tag: t,
        hue: back.concat([front]).map((c) => c.style.getPropertyValue('--wc-hue')),
        swoop: back.concat([front]).map((c) => {
          const g = c.querySelector('.wc-sw');
          return g ? g.dataset.swoop : null;
        }),
        mute: back.every((c) => !c.textContent.trim()),
        loud: !!front.textContent.trim(),
        quiet: back.every((c) => c.getAttribute('aria-hidden') === 'true'
          && c.tagName === 'DIV') };
    }, tag);
    const hand0 = await hand('before');
    await page.evaluate(() =>
      document.querySelector('.wc-chips .wc-chip:nth-child(3)').click());
    const shuf = await page.evaluate(() => {
      const deck = document.querySelector('.wc-deck');
      const kids = [...deck.querySelectorAll('.wc')];
      const gone = kids.filter((c) => c.classList.contains('is-out'));
      const here = kids.filter((c) => !c.classList.contains('is-out'));
      const o = gone.find((c) => !c.classList.contains('b1')
        && !c.classList.contains('b2'));
      const nm = (c) => getComputedStyle(c).animationName;
      const dl = (c) => parseFloat(getComputedStyle(c).animationDelay);
      /* b2, b1, front in DOM order — so a rising delay down each list
         is the front card leaving first and the back card landing
         first, which is the peel. */
      return { on: deck.classList.contains('is-peeling'),
        went: gone.length, came: here.length,
        out: gone.every((c) => nm(c) === 'wcPeelOut'),
        into: here.every((c) => nm(c) === 'wcPeelIn'),
        outDelay: gone.map(dl), inDelay: here.map(dl),
        /* THE PIVOT IS ON THE FRONT CARD ALONE. On b1 or b2 it applies
           to their resting fan transform as well and drops them 14.1
           and 27.8px the instant the class lands, before a frame of
           the pass has run — measured on the real deck. */
        pivot: gone.map((c) => getComputedStyle(c).transformOrigin),
        name: o && o.querySelector('.wc-n').textContent,
        under: gone.length > 0 && here.length > 0
          && kids.indexOf(gone[gone.length - 1]) < kids.indexOf(here[0]),
        deaf: gone.every((c) => getComputedStyle(c).pointerEvents === 'none'),
        /* Each hand keeps its own fan: b2 behind b1 behind the front. */
        fan: [gone, here].every((h) => h[0].classList.contains('b2')
          && h[1].classList.contains('b1')
          && h[2].classList.contains('is-front') === (h === here)) };
    });
    ok(`a step inside a group peels the whole ${was} hand off`,
      shuf.on && shuf.went === 3 && shuf.out && shuf.name === was
      && shuf.under && shuf.deaf, { was, shuf });
    ok('...and the hand arriving is three cards, each with its own fan',
      shuf.came === 3 && shuf.into && shuf.fan, shuf);
    /* ONE AT A TIME, which is the whole of what a peel is: the cards
       leave front-first and land back-first, and a peel whose three
       cards share one delay is the block this replaced. */
    ok(`...one at a time (${shuf.outDelay.join('/')} out, ${shuf.inDelay.join('/')} in)`,
      shuf.outDelay[0] > shuf.outDelay[1] && shuf.outDelay[1] > shuf.outDelay[2]
      && shuf.inDelay[0] < shuf.inDelay[1] && shuf.inDelay[1] < shuf.inDelay[2], shuf);
    ok('...pivoting on the corner, and only the card that has no fan to swing',
      /^0(px)? /.test(shuf.pivot[2]) && shuf.pivot[0] === shuf.pivot[1]
      && shuf.pivot[0] !== shuf.pivot[2], shuf.pivot);
    /* ── OFF ONE SIDE, IN FROM THE OTHER, AND NEITHER OF THEM FADES ──
       Both halves measured on the composited box rather than read off
       the stylesheet: the animations are seeked to a third of the way
       through and the two cards' left edges are compared against the
       deck's own, so a keyframe that names the right property and the
       wrong sign fails. The old pass receded the outgoing card DOWN
       AND RIGHT onto the fan while fading it to nothing, which put two
       names on screen at once and then vanished one of them; it is
       taken off to the left now and the next one comes in from the
       right, at full strength end to end.

       The fade is asserted ABSENT rather than assumed gone — an
       opacity keyframe is one line to add back and it is the whole of
       what was wrong, so it is checked on the keyframes themselves,
       which is where it would reappear. */
    const cross = await page.evaluate(() => {
      const deck = document.querySelector('.wc-deck');
      /* The outgoing FRONT card, not whichever .is-out comes first:
         b2 is 25px right of it and both hands are three deep now. */
      const o = deck.querySelector('.wc.is-out:not(.b1):not(.b2)');
      const f = deck.querySelector('.wc.is-front');
      const anim = (el) => el.getAnimations();
      const fades = (el) => anim(el).some((a) =>
        a.effect.getKeyframes().some((k) => k.opacity != null));
      const faded = fades(o) || fades(f);
      anim(o).concat(anim(f)).forEach((a) => {
        a.pause(); a.currentTime = a.effect.getTiming().duration * .34;
      });
      const d = deck.getBoundingClientRect();
      const r = { faded, out: o.getBoundingClientRect().x - d.x,
        into: f.getBoundingClientRect().x - d.x,
        oOp: +getComputedStyle(o).opacity, fOp: +getComputedStyle(f).opacity };
      anim(o).concat(anim(f)).forEach((a) => a.finish());
      return r;
    });
    ok('...and it is taken off the LEFT while the next comes in from the right',
      cross.out < -40 && cross.into > 20, cross);
    ok('...at full strength the whole way — nothing on this pass fades',
      !cross.faded && cross.oOp === 1 && cross.fOp === 1, cross);
    /* SWEPT, and each card on its own animationend rather than one
       listener on the hand: the peel is staggered, so the card that
       finishes LAST is b2 at the back — a single listener on the front
       one fired at 1.24s and tore the other two off the screen
       mid-flight. On a timer as well, because an animation that never
       runs — a background tab — would otherwise leave a dead hand on
       the pile for the next press to stack on.

       WAITED OUT ON THE ANIMATIONS, not on a number of milliseconds.
       This was an 800ms wait, which was past the 600ms the pass used
       to take and is under the peel's 1.39s — and the durations have
       moved twice since, which is the whole argument for not writing
       one here at all. */
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.wc-deck .wc')].every((c) =>
        c.getAnimations().every((a) => a.playState === 'finished')),
      { timeout: 6000 });
    await page.waitForTimeout(120);
    ok('...and the hand taken off is swept whole, not left on the pile',
      await page.evaluate(() =>
        document.querySelectorAll('.wc-deck .wc').length === 3
        && !document.querySelector('.wc.is-out')));

    const hand1 = await hand('after');
    ok('the two behind are the card in front — its hue, its swoop, no words',
      [hand0, hand1].every((h) => new Set(h.hue).size === 1 && h.hue[0]
        && new Set(h.swoop).size === 1 && /^[a-f]$/.test(h.swoop[0])
        && h.mute && h.loud && h.quiet), { hand0, hand1 });
    /* AND THEY FOLLOW IT. Read as the hue and the swoop having MOVED
       across the pass, so a build that set them once at the deal and
       left them there fails — which is the shape the two behind had
       for their whole life before this. */
    ok(`...and the whole hand turns over with it (${hand0.hue[0]} to ${hand1.hue[0]})`,
      hand0.hue[0] !== hand1.hue[0], { hand0, hand1 });

    /* AND AN EFFORT, A LENGTH AND A PICK MOVE NOTHING. draw() runs on
       all three, and on every one of them the card in front is the SAME
       card with different figures on it — a deck that moved for a press
       on Hard would be answering a question nobody asked. */
    const quiet = {};
    for (const [what, sel] of [['an effort', '.wc-eff .wc-chip:nth-child(1)'],
                               ['a length', '.wc-mins .wc-min:nth-child(2)'],
                               ['a pick', '.wc.is-front']]) {
      await page.click(sel);
      await page.waitForTimeout(90);
      quiet[what] = await page.evaluate(() => ({
        front: getComputedStyle(document.querySelector('.wc.is-front')).animationName,
        cards: document.querySelectorAll('.wc-deck .wc').length }));
    }
    ok('an effort, a length and a pick move the deck not at all',
      Object.values(quiet).every((v) => v.front === 'none' && v.cards === 3), quiet);
    /* Coming back is a level change too and gets the same lift — but
       never the deal, which is a first-arrival event. */
    await page.click('.wc-back');
    await page.waitForTimeout(80);
    const home = await page.evaluate(() => ({
      name: getComputedStyle(document.querySelector('.wc.is-front')).animationName,
      b1: getComputedStyle(document.querySelector('.wc.b1')).animationName,
      deck: document.querySelector('.wc-deck').className }));
    ok('coming back lifts too, and still does not re-deal',
      home.name === 'wcTurn' && home.b1 === 'none'
      && !/is-dealing/.test(home.deck), home);
    await page.waitForTimeout(300);

    /* ── STEPPING IN ──
       A split is not a workout. The first press says which KIND of
       session, the second says which one — on the same three controls,
       so the chips have to be REBUILT rather than relabelled: four
       kinds and six body parts are different lengths, and a pass that
       only rewrites the text leaves a chip standing that selects an
       index nothing is at. */
    await page.click('.wc.is-front');
    await page.waitForTimeout(520);
    const two = await face();
    ok('pressing a kind opens it, and the chips become its own',
      two.title === 'All exercises' && two.chips.length === 6
      && two.chips.join('|') === 'Chest|Back|Shoulders|Arms|Legs|Abs'
      && two.back && two.foot.join('|') === '', two);

    /* ── A SESSION CAN BE MORE THAN ONE THING ──
       Pull and abs, legs and core: most people's actual session is a
       lift plus one small thing, and made to pick one they either lie
       or stop logging. So the card TOGGLES and the foot is the answer
       — which costs a press on a single pick and buys a screen where
       you can see what you are about to file.

       The control names what it will file, and the chips carry a tick
       for anything chosen, so a pick scrolled off the front is still
       visible without stepping through the deck to find it. */
    await page.click('.wc.is-front');
    await page.waitForTimeout(300);
    const pick1 = await page.evaluate(() => ({
      go: (document.querySelector('.wc-go') || {}).textContent,
      ticked: [...document.querySelectorAll('.wc-chip.is-picked')].map((c) => c.textContent.trim()),
      card: document.querySelector('.wc.is-front').classList.contains('is-picked'),
      stored: localStorage.getItem('sched.train.v1'),
    }));
    ok('pressing a card chooses it rather than filing it',
      pick1.go === 'Log Chest' && pick1.ticked.join('') === 'Chest' && pick1.card
      && !Object.keys(JSON.parse(pick1.stored || '{}')).length, pick1);

    await page.click('.wc-chips .wc-chip:nth-child(6)');           /* Abs */
    await page.waitForTimeout(300);
    await page.click('.wc.is-front');
    await page.waitForTimeout(300);
    const both = await page.evaluate(() => ({
      go: document.querySelector('.wc-go').textContent,
      ticked: [...document.querySelectorAll('.wc-chip.is-picked')].map((c) => c.textContent.trim()),
    }));
    ok('...and a second card adds to it rather than replacing it',
      both.go === 'Log Chest + Abs'
      && both.ticked.join('|') === 'Chest|Abs', both);

    /* Pressing a chosen card again takes it off — a toggle, or the
       only way out of a mis-tap is closing the sheet. */
    await page.click('.wc.is-front');
    await page.waitForTimeout(300);
    const off = await page.evaluate(() => ({
      go: document.querySelector('.wc-go').textContent,
      ticked: [...document.querySelectorAll('.wc-chip.is-picked')].map((c) => c.textContent.trim()),
    }));
    ok('...and pressing it again takes it off',
      off.go === 'Log Chest' && off.ticked.join('') === 'Chest', off);

    /* ── AND BOTH GO ON THE BLOCK, UNDER ONE RECORD ──
       One session, not two: the keys are joined in the same field, so
       every reader of this record goes through one place and a shape
       nothing else knows about cannot leak. */
    await page.click('.wc-chips .wc-chip:nth-child(6)');
    await page.waitForTimeout(280);
    await page.click('.wc.is-front');
    await page.waitForTimeout(280);
    await page.click('.wc-go');
    await page.waitForTimeout(460);
    const multi = await page.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem('sched.train.v1') || '{}');
      const day = Object.keys(raw)[0];
      return { days: Object.keys(raw).length,
        blocks: Object.keys(raw[day] || {}).length,
        rec: Object.values(raw[day] || {})[0] };
    });
    ok('two cards file as one session naming both',
      multi.days === 1 && multi.blocks === 1
      && multi.rec.k === 'bro.chest+bro.abs', multi);

    /* Filing closes the sheet, so everything below has to be put back
       where it found it: a clean record, the deck open, and stepped
       into the first group. */
    await deck(null);
    await page.click('.wc.is-front');
    await page.waitForTimeout(480);

    /* ── EVERY KEY IS QUALIFIED ──
       Legs is in two groups and Core is in two more. A bare 'legs' on
       disk names two cards with two colours, and the one it resolved
       to would be whichever came first in the list — which is not a
       decision anybody took. Walked across all four groups, because a
       collision is only visible from outside one of them. */
    const keys = [];
    for (let g = 0; g < 4; g++) {
      if (g) {
        await page.click('.wc-back');
        await page.waitForTimeout(360);
        await page.click(`.wc-chips .wc-chip:nth-child(${g + 1})`);
        await page.waitForTimeout(360);
        await page.click('.wc.is-front');
        await page.waitForTimeout(420);
      }
      const n = await page.$$eval('.wc-chips .wc-chip', (c) => c.length);
      for (let i = 0; i < n; i++) {
        await page.click(`.wc-chips .wc-chip:nth-child(${i + 1})`);
        await page.waitForTimeout(120);
        keys.push(await page.$eval('.wc.is-front', (e) => e.dataset.workout));
      }
    }
    ok(`every workout is stored under its own key (${keys.length} of them)`,
      keys.length === 18 && new Set(keys).size === 18
      && keys.every((k) => /^(bro|ppl|run|rec)\.[a-z]+$/.test(k))
      && keys.filter((k) => /\.legs$/.test(k)).length === 2, keys);

    /* ── EFFORT IS YOURS, AND THE MINUTES ONLY SUGGEST IT ──
       Two wrong answers came before this. A field somebody typed is
       the app holding an opinion about a session it knows nothing
       about; worked out from the time it is honest and still wrong,
       and said so in its own words — an Easy run at forty minutes
       came back "Moderate". So the minutes set where the control
       starts and a press moves it.

       THE ROW IS A SIBLING OF THE CARD, never a control inside it:
       the card is a <button>, and a button inside a button is invalid
       and collapses to one press while looking exactly right. */
    await page.click('.wc-back');
    await page.waitForTimeout(360);
    await page.click('.wc-chips .wc-chip:nth-child(1)');
    await page.waitForTimeout(360);
    await page.click('.wc.is-front');
    await page.waitForTimeout(420);
    const figs = [];
    for (let i = 0; i < 6; i++) {
      await page.click(`.wc-chips .wc-chip:nth-child(${i + 1})`);
      await page.waitForTimeout(120);
      figs.push(await page.$eval('.wc.is-front', (e) => [...e.querySelectorAll('.wc-top div')]
        .map((d) => d.querySelector('span').textContent + ' ' + d.querySelector('b').textContent)));
    }
    const said = figs.map((f) => f.join(' / '));
    const eff = (s) => (s.match(/Effort (\w+)/) || [])[1];
    const min = (s) => +(s.match(/Est\. time (\d+)/) || [])[1];
    ok('every card says how long and what that costs',
      said.every((s) => /^Est\. time \d+ min \/ Effort (Light|Moderate|Hard)$/.test(s)), said);
    ok('...and the minutes are what suggest it, on every card in the group',
      said.every((s) => eff(s) === (min(s) < 25 ? 'Light' : min(s) < 50 ? 'Moderate' : 'Hard'))
      && new Set(said.map(eff)).size === 3, said);

    const effRow = await page.evaluate(() => {
      const r = document.querySelector('.wc-eff-r');
      const b = [...r.querySelectorAll('.wc-ef')];
      return { names: b.map((x) => x.textContent),
        on: b.filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.textContent),
        card: document.querySelector('.wc.is-front .wc-top div:nth-child(2) b').textContent,
        outside: !document.querySelector('.wc .wc-eff-r'),
        labelled: r.getAttribute('aria-labelledby') === 'scEffLab' };
    });
    ok('the effort row stands outside the card, named, showing the suggestion',
      effRow.names.join('|') === 'Light|Moderate|Hard' && effRow.outside
      && effRow.labelled && effRow.on.length === 1
      && effRow.on[0] === effRow.card, effRow);

    await page.click('.wc-eff-r .wc-ef:nth-child(3)');
    await page.waitForTimeout(320);
    const overruled = await page.evaluate(() => ({
      card: document.querySelector('.wc.is-front .wc-top div:nth-child(2) b').textContent,
      on: [...document.querySelectorAll('.wc-eff-r .wc-ef')]
        .filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.textContent),
    }));
    ok('...and pressing one overrules it, on the card as well as the row',
      overruled.card === 'Hard' && overruled.on.join('') === 'Hard', overruled);

    /* ── AND WHAT YOU SAID SURVIVES THE NEXT CARD ──
       Both figures are seeded off the selection and both stop moving
       with it the moment a press says otherwise: an effort and a
       length are about the session you did, not about the card you
       happen to be looking at.

       This is where the two halves fought. The chip handler blanked
       the effort so the next card could suggest its own, and once a
       press could SAY one, the clear emptied it and the suggestion
       refused to refill it — because it had been told not to. The
       card came back with no Effort column at all. */
    await page.click('.wc-chips .wc-chip:nth-child(5)');           /* Legs, 60 */
    await page.waitForTimeout(320);
    const moved = await page.evaluate(() => {
      const f = document.querySelector('.wc.is-front');
      return f ? [...f.querySelectorAll('.wc-top div b')].map((x) => x.textContent) : null;
    });
    ok('...and an effort you pressed survives moving to the next card',
      moved && moved.length === 2 && moved[1] === 'Hard', moved);

    /* ── HOW LONG, AS A LADDER ──
       A field would be a keyboard for a number everybody rounds
       anyway: nobody trains for 47 minutes, they train for about three
       quarters of an hour. The card's own estimate is spliced into the
       rungs where it is not already one of them, so the suggestion is
       always reachable in one press and never a rung you cannot get
       back to. Legs is sixty, which IS a rung; the check that it is
       spliced is below, on a card that is not. */
    const ladder = await page.evaluate(() => {
      const r = document.querySelector('.wc-mins');
      const b = [...r.querySelectorAll('.wc-min')];
      return { rungs: b.map((x) => x.textContent),
        on: b.filter((x) => x.getAttribute('aria-pressed') === 'true')
          .map((x) => x.textContent),
        labelled: r.getAttribute('aria-labelledby') === 'scMinLab',
        outside: !document.querySelector('.wc .wc-mins'),
        spoken: b[0].getAttribute('aria-label') };
    });
    ok('the length is a ladder outside the card, suggesting the estimate',
      ladder.rungs.join(' ') === '15 20 30 45 60 75 90 120'
      && ladder.on.join('') === '60' && ladder.labelled && ladder.outside
      && ladder.spoken === '15 minutes', ladder);

    /* Shoulders is forty-five... which is also a rung. Arms is forty,
       which is NOT — so the ladder has to grow one and put it in
       order, or the suggestion would be a figure nothing on screen can
       select. */
    await page.click('.wc-chips .wc-chip:nth-child(4)');           /* Arms, 40 */
    await page.waitForTimeout(320);
    const spliced = await page.evaluate(() =>
      [...document.querySelectorAll('.wc-min')].map((x) => x.textContent));
    ok('...and an estimate that is not a rung is spliced in, in order',
      spliced.join(' ') === '15 20 30 40 45 60 75 90 120', spliced);

    /* ── AND A LENGTH YOU PRESS IS WHAT GOES ON THE CARD ──
       The card says "Est. time" for a figure nobody has touched and
       drops the word once you have: the ladder's suggestion is not a
       choice, and a card that called it Time would be the app putting
       words in your mouth. */
    const before = await page.$eval('.wc.is-front .wc-top div:first-child',
      (d) => d.textContent);
    await page.click('.wc-mins .wc-min:nth-child(6)');              /* 60 */
    await page.waitForTimeout(320);
    const after = await page.evaluate(() => ({
      fig: document.querySelector('.wc.is-front .wc-top div:first-child').textContent,
      on: [...document.querySelectorAll('.wc-min')]
        .filter((x) => x.getAttribute('aria-pressed') === 'true')
        .map((x) => x.textContent).join(''),
    }));
    ok('a length you press goes on the card, and drops the word Est.',
      /^Est\. time40 min$/.test(before) && after.fig === 'Time60 min'
      && after.on === '60', { before, after });

    /* ── THE SWOOP ──
       A curve through the card and nothing else: the wordmark this
       replaced said in ghost type what the 34px name at the bottom
       already says, and the eye reads a word whether or not it is
       meant to. Six drawings across twenty-two cards, assigned by
       character, so a deck three cards deep is never the same curve
       twice over.

       BOTH HALVES. That every card HAS one passes on a single drawing
       used everywhere, which is wallpaper; that six exist passes on a
       set nothing reaches. And the strokes have to be non-scaling —
       the failure there is silent, since the drawing stays correct
       and simply comes out several times too heavy. */
    const swoops = [];
    for (let g = 0; g < 4; g++) {
      if (g) {
        await page.click('.wc-back');
        await page.waitForTimeout(340);
        await page.click(`.wc-chips .wc-chip:nth-child(${g + 1})`);
        await page.waitForTimeout(340);
        await page.click('.wc.is-front');
        await page.waitForTimeout(400);
      } else {
        await page.click('.wc-back');
        await page.waitForTimeout(340);
        await page.click('.wc-chips .wc-chip:nth-child(1)');
        await page.waitForTimeout(340);
        await page.click('.wc.is-front');
        await page.waitForTimeout(400);
      }
      const n = await page.$$eval('.wc-chips .wc-chip', (c) => c.length);
      for (let i = 0; i < n; i++) {
        await page.click(`.wc-chips .wc-chip:nth-child(${i + 1})`);
        await page.waitForTimeout(110);
        swoops.push(await page.$eval('.wc.is-front .wc-sw', (e) => e.dataset.swoop));
      }
    }
    const drawn = await page.$eval('.wc.is-front .wc-sw', (e) => {
      const p = e.querySelector('path');
      const box = e.getBoundingClientRect();
      const d = p.getAttribute('d');
      return { n: e.querySelectorAll('path').length, d,
        stroke: getComputedStyle(p).vectorEffect,
        wide: box.width, tall: box.height };
    });
    ok(`every card carries a swoop, and there are six of them (${new Set(swoops).size})`,
      swoops.length === 18 && swoops.every((k) => /^[a-f]$/.test(k))
      && new Set(swoops).size === 6, swoops);
    ok('...drawn past both edges, filling the card, and not stroke-scaled',
      /^M-6 |^M106 /.test(drawn.d) && /106 |-6[ Z]/.test(drawn.d)
      && drawn.wide > 300 && drawn.tall > 200
      && (drawn.stroke === 'non-scaling-stroke' || !drawn.d.includes('sw-')), drawn);

    /* ── THE CARD'S OWN COLOUR, MEASURED ON THE CARD ──
       Every workout carries a literal hex, which is the one exception
       on this screen and the habits screen's argument: a colour that
       says WHICH thing this is has to be the same on every palette or
       it has stopped being that thing's colour. What it must never do
       is fail to be readable — these hues on --ink run from about
       2.6:1 to 4.1:1 raw, so the card mixes each toward its own
       --paper and this measures the result on composited pixels.

       BOTH POLARITIES. On a dark palette --ink is near-white and the
       card inverts, so a check written for a black card measures the
       one case that cannot go wrong. */
    for (const theme of [null, 264]) {
      await deck(theme);
      await page.click('.wc.is-front');                  /* into Bro split */
      await page.waitForTimeout(500);
      const worst = { fig: 99, glyph: 99, desc: 99, lab: 99, of: '' };
      for (let i = 0; i < 6; i++) {
        await page.click(`.wc-chips .wc-chip:nth-child(${i + 1})`);
        /* WAITED OUT ON THE ANIMATION, never on a number of
           milliseconds. This was 420ms, which was comfortably past the
           300ms the shuffle used to take — and the day the pass was
           slowed to 600ms so you could see one card leave and the next
           arrive, every sample here was taken with the card still
           sliding in from the right, a third of it off the screen. The
           figures came back 1.57:1 and it read as a contrast
           regression on a colour nothing had touched. */
        await page.waitForFunction(() =>
          [...document.querySelectorAll('.wc-deck .wc')].every((c) =>
            c.getAnimations().every((a) => a.playState === 'finished')));
        const at = await page.evaluate(() => {
          const c = document.querySelector('.wc.is-front');
          const box = (s) => { const r = c.querySelector(s).getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2,
              l: r.left, r: r.right, t: r.top, b: r.bottom }; };
          return { name: c.dataset.workout, card: c.getBoundingClientRect().toJSON(),
            fig: box('.wc-top div b'), lab: box('.wc-top div span'),
            g: box('.wc-g'), d: box('.wc-d') };
        });
        const png = PNG5.sync.read(await page.screenshot());
        const px = (x, y) => {
          const i2 = (png.width * Math.round(y * dpr5) + Math.round(x * dpr5)) << 2;
          return [png.data[i2], png.data[i2 + 1], png.data[i2 + 2]];
        };
        /* Ink and ground are taken from the SAME neighbourhood: the
           card's own gradient and its wordmark both move the ground
           under a figure, and a ratio against --ink read off the
           stylesheet would be measuring a colour that is nowhere on
           screen. Darkest and lightest pixel in a band through the
           mark is the honest pair, and it is polarity-agnostic. */
        const band = (b, pad) => {
          const out = [];
          for (let x = Math.round(b.l); x < b.r; x++) {
            for (let y = Math.round(b.t) - pad; y < b.b + pad; y++) out.push(px(x, y));
          }
          return out;
        };
        const worstOf = (b, pad) => {
          const s = band(b, pad).sort((p, q) => lum(p) - lum(q));
          return ratio(s[0], s[s.length - 1]);
        };
        const fig = worstOf(at.fig, 1), g = worstOf(at.g, 0), d = worstOf(at.d, 1);
        const lab = worstOf(at.lab, 1);
        if (fig < worst.fig) { worst.fig = fig; worst.of = at.name; }
        worst.glyph = Math.min(worst.glyph, g);
        worst.desc = Math.min(worst.desc, d);
        worst.lab = Math.min(worst.lab, lab);
      }
      const t = theme === null ? 'the lime it ships with' : 'hue ' + theme;
      ok(`the figures clear 4.5:1 on the card on ${t} (worst ${worst.fig.toFixed(2)}:1 on ${worst.of})`,
        worst.fig >= 4.5, worst);
      ok(`...the description too, over the wordmark behind it (${worst.desc.toFixed(2)}:1)`,
        worst.desc >= 4.5, worst);
      /* ── AND THE LABEL, WHICH NOTHING MEASURED UNTIL THE GROUND
             MOVED ──
         9.5px uppercase is the smallest type on the card and the
         weakest white on it, so it is the first thing a lighter ground
         breaks — and it was sitting at 4.58:1 before anything moved,
         which is a rounding error above the bar rather than a margin.
         The one piece of text on this surface that was not held was
         the one that needed holding. */
      ok(`...and the label over them, the smallest type on the card `
        + `(${worst.lab.toFixed(2)}:1)`,
        worst.lab >= 4.5, worst);
      ok(`...and the glyph clears 3:1 as a graphic (${worst.glyph.toFixed(2)}:1)`,
        worst.glyph >= 3, worst);
    }

    /* ── AND THE CARD HAS AN EDGE, LIT ON A CONE ──
       Without a ring the card is a slab against a page that is nearly
       the same black, and the two behind — which carry no words at all
       — have nothing but an edge to say they are there with.

       WHAT MAKES IT A FACET RATHER THAN A RIM IS THE SECOND ARC. A
       linear gradient's brightness is a function of position along one
       axis, so walking round the perimeter it rises once and falls
       once: one lit side, one dark one. A conic is a function of the
       ANGLE from the centre, so the light comes round the card and
       there are two bright arcs with dark between them, which is what
       a machined block does under one lamp.

       MEASURED AS THE RING'S OWN CONTRIBUTION — each edge pixel less
       the card's own ground 7px in along the same normal. A bare
       reading at the edge is mostly the WASH, and that is not a
       hypothetical: the first version of this check compared absolute
       perimeter values, and it worked only while the card was nearly
       black. The day the ground was lightened the wash swamped the
       ring, the linear rim it replaced scored .37 against a bar of
       .30, and the check had quietly stopped telling a cone from a
       sweep while still passing. It is the friends crown's lesson and
       the Workouts panel's, a third time: a thin mark over a coloured
       ground has to be measured as the DIFFERENCE it makes.

       Two halves, each catching a different reversion, both on
       composited pixels:

         LIT   the ring's brightest contribution — .49 here, .26 for
               the linear rim, and .03 with the ring deleted, which is
               the half that says a ring exists at all.
         ARCS  its brightest contribution at least a quarter-turn away
               from that, as a fraction of it — .44 here and .23 for
               the linear rim, which is the cone showing up as a
               number. The no-ring case scores .48 on this one and
               fails the other, which is why both are needed.

       SAMPLED ALONG THE STRAIGHT EDGES ONLY. The corner radius is
       22px, so a sample taken at 45 degrees lands where the ring is
       turning and half a pixel either way is off it. */
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.wc-deck .wc')].every((c) =>
        c.getAnimations().every((a) => a.playState === 'finished')));
    const lit = await page.evaluate(() =>
      document.querySelector('.wc.is-front').getBoundingClientRect().toJSON());
    const pngE = PNG5.sync.read(await page.screenshot());
    const atE = (x, y) => {
      const i = (pngE.width * Math.round(y * dpr5) + Math.round(x * dpr5)) << 2;
      return [pngE.data[i], pngE.data[i + 1], pngE.data[i + 2]];
    };
    const IN = .6, DEEP = 7, RAD = 30, PER = 6, ring = [];
    const pair = (x, y, nx, ny) =>
      ring.push(lum(atE(x, y)) - lum(atE(x + nx * DEEP, y + ny * DEEP)));
    for (let i = 0; i < PER; i++) {                               /* head */
      pair(lit.x + RAD + (lit.width - 2 * RAD) * (i + .5) / PER, lit.y + IN, 0, 1);
    }
    for (let i = 0; i < PER; i++) {                               /* trailing */
      pair(lit.right - IN,
        lit.y + RAD + (lit.height - 2 * RAD) * (i + .5) / PER, -1, 0);
    }
    for (let i = 0; i < PER; i++) {                               /* foot */
      pair(lit.right - RAD - (lit.width - 2 * RAD) * (i + .5) / PER,
        lit.bottom - IN, 0, -1);
    }
    for (let i = 0; i < PER; i++) {                               /* leading */
      pair(lit.x + IN,
        lit.bottom - RAD - (lit.height - 2 * RAD) * (i + .5) / PER, 1, 0);
    }
    const top5 = ring.indexOf(Math.max(...ring));
    let arc2 = -1;
    ring.forEach((v, i) => {
      const d = Math.min(Math.abs(i - top5), ring.length - Math.abs(i - top5));
      if (d >= ring.length / 4 && v > arc2) arc2 = v;
    });
    const arcs = arc2 / ring[top5];
    ok(`the card's edge catches a light its middle does not `
      + `(${ring[top5].toFixed(2)} over its own ground)`,
      ring[top5] >= .12, { brightest: ring[top5], at: top5 });
    ok(`...on a cone, so a second arc a quarter-turn away catches too `
      + `(${arcs.toFixed(2)} of the first)`,
      arcs >= .33, { arcs, arc2, brightest: ring[top5], at: top5 });

    /* ── IT LANDS ON THE BLOCK, AND IT STAYS THERE ── */
    await deck(null);
    await page.click('.wc.is-front');
    await page.waitForTimeout(460);
    await page.click('.wc-chips .wc-chip:nth-child(5)');           /* Legs */
    await page.waitForTimeout(420);
    await page.click('.wc.is-front');                              /* choose it */
    await page.waitForTimeout(320);
    await page.click('.wc-eff-r .wc-ef:nth-child(1)');             /* say Light */
    await page.waitForTimeout(320);
    await page.click('.wc-mins .wc-min:nth-child(7)');             /* say 90 */
    await page.waitForTimeout(320);
    await page.click('.wc-go');                                    /* file it */
    await page.waitForTimeout(460);
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('sched.train.v1') || '{}'));
    const one2 = Object.values(Object.values(stored)[0] || {})[0] || {};
    ok('picking one files it against that block, with what you said',
      Object.keys(stored).length === 1
      && one2.k === 'bro.legs' && one2.e === 'Light' && one2.m === 90, stored);

    /* ── EVERY RECORD WRITTEN BEFORE THE EFFORT EXISTED IS A BARE
       STRING ──
       Read as an object those give undefined for both figures: the
       card opens on nothing and the row draws no name. Normalised on
       the way in rather than migrated, because this browser owns the
       record and rewrites it the next time you touch that block. */
    const old = await page.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem('sched.train.v1'));
      const day = Object.keys(raw)[0], id = Object.keys(raw[day])[0];
      raw[day][id] = 'ppl.push';
      localStorage.setItem('sched.train.v1', JSON.stringify(raw));
      return { day, id };
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(340);
    const healed = await page.evaluate(([d, i]) =>
      JSON.parse(localStorage.getItem('sched.train.v1'))[d][i], [old.day, old.id]);
    ok('a record from before the effort existed is repaired, not thrown away',
      healed && healed.k === 'ppl.push' && healed.e === 'Hard', healed);

    /* ── AND THE WORD MOVED, NOT THE RECORD ──
       "Easy" became "Light" — a light day is a decision you took, and
       the word for it should not sound like a shrug. Every record
       written before that says Easy, and read as an unknown effort
       they would all be recomputed from the minutes, throwing away a
       choice somebody actually made. Renamed on the way in. */
    await page.evaluate(([d, i]) => {
      const raw = JSON.parse(localStorage.getItem('sched.train.v1'));
      raw[d][i] = { k: 'bro.legs', e: 'Easy' };
      localStorage.setItem('sched.train.v1', JSON.stringify(raw));
    }, [old.day, old.id]);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(340);
    const renamed = await page.evaluate(([d, i]) =>
      JSON.parse(localStorage.getItem('sched.train.v1'))[d][i], [old.day, old.id]);
    /* PLANTED ON LEGS, WHICH IS SIXTY MINUTES AND THEREFORE HARD.
       It was on Abs first, at twenty minutes — where a recompute would
       ALSO have said Light, so the check could not tell a rename from
       a record that was thrown away and rebuilt. The whole point is
       that the word moved and nothing else did, and a fixture whose
       two outcomes agree cannot see that. */
    ok('...and a record saying Easy is renamed rather than recomputed',
      renamed && renamed.k === 'bro.legs' && renamed.e === 'Light', renamed);
    await page.evaluate(([d, i]) => {
      const raw = JSON.parse(localStorage.getItem('sched.train.v1'));
      raw[d][i] = { k: 'bro.legs', e: 'Light' };
      localStorage.setItem('sched.train.v1', JSON.stringify(raw));
    }, [old.day, old.id]);

    await page.evaluate(() => localStorage.setItem('sched.view.v1', 'list'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(360);
    const row = await page.evaluate(() => {
      const r = [...document.querySelectorAll('.week.is-today .row[data-id]')]
        .find((x) => /Train/.test(x.querySelector('.n').firstChild.textContent));
      /* A TAG IN THE PROPS, not an em hanging off the name. It was
         the one loose piece of type on a row otherwise made of a name
         and two figures. */
      const em = r.querySelector('.props .wo');
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      const st = r.querySelector('.props .st');
      return { mark: em && em.textContent, label: r.getAttribute('aria-label'),
        /* ORDER: what you did, then whether you have finished. The
           workout sits closer to the block it belongs to. */
        order: em && st ? (em.compareDocumentPosition(st)
          & Node.DOCUMENT_POSITION_FOLLOWING) > 0 : null,
        colour: em && getComputedStyle(em).color,
        bg: em && getComputedStyle(em).backgroundColor,
        dim: rgb('--dim'), spent: rgb('--spent'), accent: rgb('--red') };
    });
    ok('and the row it happened on says what it was, through a reload',
      row.mark === 'Legs' && / Legs\.? /.test(row.label + ' '), row);
    ok('...as a tag before the state, not after it', row.order === true, row);
    /* ── AND IN THE WORKOUT'S OWN COLOUR ──
       It was the accent, then the ink when the accent went neutral.
       Which session this was is the purest WHICH there is, so it is
       what a tag's colour is for — and the tag is a wash under a
       label, so what is asserted is that neither is a grey: a hue has
       a spread across its channels and a neutral does not.

       Through a TOKEN per face rather than the card's literal hex. The
       card is the one surface here that does not follow the theme; a
       tag does, and read as a 22% wash the card colours came to
       3.36:1 on the light page. */
    /* ── BOTH SERIALISATIONS, OR IT MEASURES ITS OWN PARSER ──
       Chromium returns a resolved color-mix as `color(srgb r g b)`
       with the channels 0..1 and a plain colour as rgb() with them
       0..255. Read naively, a green at .34/.73/.58 has a "spread" of
       0.39 and reports as a grey — which is what this said, about a
       tag that is plainly green in a screenshot. This file already
       carries the same lesson twice. */
    const spread = (c) => {
      const n = (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      if (n.length !== 3) return 0;
      const v = /^color\(/.test(c) ? n.map((x) => x * 255) : n;
      return Math.max(...v) - Math.min(...v);
    };
    ok(`...in the workout's own colour, never a grey (${row.colour})`,
      row.colour !== null && spread(row.colour) >= 14
      && spread(row.bg) >= 4
      && [row.dim, row.spent, row.accent].indexOf(row.colour) < 0, row);
    ok('...and the old assertion cannot pass by accident',
      [row.accent, row.spent].indexOf(row.colour) < 0
      && row.colour !== row.dim, row);

    /* ── AND MEASURED ON A ROW THAT CANNOT BE BEHIND YOU ──
       The check above cannot fail at most hours, which is the shape
       this file already has a lesson about. `is-past` is set on
       `.week.is-today .row` alone, so a fixture on today's 06:30 Train
       resolves to --spent from about seven in the morning — and
       --spent is one of the two answers it accepts, so reverting the
       colour to --dim sails through it. Proven by doing exactly that.

       Any other card's rows are never past, at any hour, which is the
       same construction the one-right-edge check had to move to. The
       record is planted across a fortnight of dates under every block
       id on the week, so whichever date a given card resolves to is
       covered without this file working out the deck's arithmetic for
       itself. */
    await page.evaluate(() => {
      const pad = (n) => String(n).padStart(2, '0');
      const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1)
        + '-' + pad(d.getDate());
      /* From the STORE, not from the screen: one day is drawn, so
         the ids on it are one day's and the row read below is on
         another. */
      const ids = (JSON.parse(localStorage.getItem('sched.v1')).items || [])
        .map((b) => b.id);
      const train = {}, log = {};
      for (let k = -7; k <= 7; k++) {
        const d = new Date(); d.setDate(d.getDate() + k);
        train[iso(d)] = {}; log[iso(d)] = {};
        ids.forEach((id) => {
          train[iso(d)][id] = { k: 'bro.legs', e: 'Light', m: 60 };
          log[iso(d)][id] = 1;
        });
      }
      localStorage.setItem('sched.train.v1', JSON.stringify(train));
      localStorage.setItem('sched.log.v1', JSON.stringify(log));
      /* A PLACE, because the size below is a claim against one and the
         starter week has none typed on it. Put back with the rest. */
      const st = JSON.parse(localStorage.getItem('sched.v1'));
      st.items[0].r = 'Gym';
      localStorage.setItem('sched.v1', JSON.stringify(st));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(360);
    await page.evaluate(() => document.querySelector('.st-d:not(.is-on)').click());
    await page.waitForTimeout(240);
    const ahead = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      const r = document.querySelector('.week:not(.is-today) .row[data-id]');
      const em = r && r.querySelector('.props .wo');
      /* The tick is the circle check beside the row now, filled on a
         done block; it is a sibling, so it is found through the wrap. */
      const tk = r && r.parentElement.querySelector('.chk');
      /* The PLACE, on any row that has one — it and the session share a
         line, and the size is only a claim against something. */
      /* The place is on the first item in the week, which is not
         necessarily on the day being read — so it is measured off the
         type scale rather than off whichever row happens to carry
         one: a place is the row's own weight, a session a step down. */
      const place = [...document.querySelectorAll('.row .n')][0];
      return { past: r && r.classList.contains('is-past'),
        wo: em && getComputedStyle(em).color,
        size: em && parseFloat(getComputedStyle(em).fontSize),
        stSize: (() => { const t = r && r.querySelector('.props .st');
          return t ? parseFloat(getComputedStyle(t).fontSize) : null; })(),
        placeSize: place && parseFloat(getComputedStyle(place).fontSize),
        tick: tk && getComputedStyle(tk).backgroundColor,
        accent: rgb('--red'), ink: rgb('--ink'), dim: rgb('--dim') };
    });
    /* Its own hue rather than the accent, which is the ink now. A tag
       says WHICH, and which session this was is exactly that. */
    const spread2 = (c) => {
      const n = (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      if (n.length !== 3) return 0;
      const v = /^color\(/.test(c) ? n.map((x) => x * 255) : n;
      return Math.max(...v) - Math.min(...v);
    };
    ok('what you trained wears its own colour on a row that is not behind you',
      ahead.past === false && ahead.wo !== null && spread2(ahead.wo) >= 14
      && ahead.wo !== ahead.dim && ahead.wo !== ahead.accent, ahead);
    /* THE TICK IS THE SAME MARK, and the claim survives the accent
       going neutral — a done block and a kept day on the tally are one
       record seen from two screens, so they are one colour. What can no
       longer be asserted is that the colour is NOT the ink, because the
       accent IS the ink now; what is asserted instead is that it is
       not the dim, which is the mistake that would actually be made. */
    ok('...and so is the tick on a block the tally has counted',
      ahead.tick === ahead.accent && ahead.tick !== ahead.dim, ahead);
    /* ── AND IT IS THE STATE TAG'S SIZE, NOT THE NAME'S ──
       It used to be a note beside the name and a step down from it.
       It is a tag in the properties now, so what it has to match is
       the tag it sits beside — asked of the state tag rather than
       written as a number, so the two move together or this fails. */
    ok(`what you trained is the state tag's own size (${ahead.size} against ${ahead.stSize})`,
      ahead.size > 0 && ahead.stSize > 0 && ahead.size === ahead.stSize, ahead);
    ok('...and both are smaller than the row\u2019s name',
      ahead.size < ahead.placeSize, ahead);

    /* PUT BACK WHAT THE FORTNIGHT WROTE. The section below unticks
       today's Train and requires the whole train key to empty, which
       fifteen days of planted records make impossible — a fixture that
       leaves the furniture where it found it is the difference between
       this and thirteen unrelated failures. */
    await page.evaluate(([d, i]) => {
      localStorage.setItem('sched.train.v1',
        JSON.stringify({ [d]: { [i]: { k: 'bro.legs', e: 'Light', m: 60 } } }));
      localStorage.removeItem('sched.log.v1');
      const st = JSON.parse(localStorage.getItem('sched.v1'));
      st.items[0].r = '';
      localStorage.setItem('sched.v1', JSON.stringify(st));
    }, [old.day, old.id]);

    /* ── UNTICKING TAKES IT WITH IT ──
       The record is a fact ABOUT a finished block. Left behind on one
       that is no longer done it is a session the app remembers and the
       row cannot draw — and the next tick would open the deck already
       showing an answer nobody gave. */
    await page.evaluate(() => localStorage.setItem('sched.view.v1', 'tally'));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(360);
    await page.click('.ty-card[data-item="t"]');
    await page.waitForTimeout(420);
    const gone = await page.evaluate(() => ({
      /* The KEYS, not the string: scTrainSet deletes the day once its
         last block goes and the file is then "{}", which is falsy in
         intent and truthy in JavaScript. */
      train: Object.keys(JSON.parse(localStorage.getItem('sched.train.v1') || '{}')).length,
      open: !document.getElementById('scSheet').hidden,
    }));
    ok('unticking the block takes the workout off with it, and asks nothing',
      gone.train === 0 && !gone.open, gone);

    /* ── AND IT IS NEVER ASKED ABOUT AS TRAINING ──
       What counts as training is the keyword table's answer rather
       than a second list of words kept in step with it by hand. Mind
       is fed by Walk and Read, which reach the walk and read glyphs,
       so the WORKOUT deck must not appear here whatever else does.

       It used to assert that no sheet opened at all, which was true
       for exactly as long as Mind had nothing behind it. Mind has its
       own question now and its own sheet, so the claim narrows to the
       half that was always the point: a deck of workout cards is the
       wrong answer to "what did you put in your head". */
    await page.click('.ty-card[data-item="m"]');
    await page.waitForTimeout(560);
    const mind = await page.evaluate(() => ({
      open: !document.getElementById('scSheet').hidden,
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      deck: document.querySelectorAll('.sheet .wc').length,
      ticked: /"m"/.test(localStorage.getItem('sched.tick.v1') || ''),
    }));
    ok('Mind is ticked and asked about as MIND, never as training',
      mind.ticked && mind.open && mind.title === 'Mind' && mind.deck === 0, mind);
    /* AND PUT AWAY AGAIN. A section that leaves a sheet open hands the
       next one a screen with the sheet's own text behind the tab bar,
       which is how the bar's contrast sweep once came back at 1.62:1
       against a bar that had not changed. */
    await page.keyboard.press('Escape');
    await page.waitForTimeout(360);
    await page.evaluate(() => {
      localStorage.removeItem('sched.mind.v1');
      localStorage.removeItem('sched.tick.v1');
      localStorage.removeItem('sched.log.v1');
      localStorage.removeItem('sched.train.v1');
      localStorage.setItem('sched.view.v1', 'list');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
  }

  /* ═══════════════════════════════════════════════════════════
     THE WORKOUTS VIEW

     The second stop on Today: what you actually trained, as against
     the five you ticked. Everything here fails silently — a calendar
     that drops the days you missed, a panel per workout that EXISTS
     rather than per one you did, a usual day claimed off a single
     session, a calendar drawn for the wrong card — so none of it is
     read off a declaration.
     ═══════════════════════════════════════════════════════════ */
  {
    const { PNG: PNG5 } = require('pngjs');
    const dpr5 = 2;
    /* ── BOTH CLOCKS HAVE TO BE FROZEN TOGETHER ──
       This was `new Date()` — NODE's clock — while the page has been
       frozen at 2026-09-01 09:30 since line 1124. The two agreed on
       exactly one real day of the year, the day the fixture happened
       to be written: on any later one, back(2) lands AFTER the page's
       today, scWorkAll walks backwards from that today and never
       visits it, and one Chest silently disappears. It read 7 of 8,
       14 sessions of 15, and a 47-minute mean where 45 is the whole
       point of the fixture — and it failed on the CLOCK, at midnight,
       four hundred assertions from anything that had changed.

       The app was correct throughout; measured against a page told
       the same date, it draws 8. Read the page's own now, so the
       fixture cannot drift from the clock it is measured against. */
    const d0 = new Date(await page.evaluate(() => Date.now()));
    const back = (n) => {
      const x = new Date(d0); x.setDate(x.getDate() - n);
      return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0')
        + '-' + String(x.getDate()).padStart(2, '0');
    };

    const openWork = async (log) => {
      await page.evaluate((rec) => {
        if (rec) localStorage.setItem('sched.train.v1', JSON.stringify(rec));
        else localStorage.removeItem('sched.train.v1');
        localStorage.setItem('sched.view.v1', 'tally');
        localStorage.removeItem('sched.ty.v1');
      }, log);
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(340);
      await page.click('[data-tystop="work"]');
      await page.waitForTimeout(320);
    };

    /* ── THREE STOPS, AND EXACTLY ONE OF THEM IS ON SCREEN ──
       Measured as a BOX rather than as the hidden property. The rail
       and the page dots both had that bug — the attribute was set
       correctly throughout and a rule with its own `display` outranked
       the browser's [hidden] — and both times the check that missed it
       read the property. Pattern was the third chance to make it. */
    await openWork(null);
    const stops = await page.evaluate(() => {
      const box = (id) => {
        const r = document.getElementById(id).getBoundingClientRect();
        return r.width > 40 && r.height > 8;
      };
      return { names: [...document.querySelectorAll('[data-tystop]')]
                 .map((b) => b.textContent),
               on: [...document.querySelectorAll('[data-tystop]')]
                 .filter((b) => b.getAttribute('aria-current') === 'true')
                 .map((b) => b.dataset.tystop),
               up: box('scTyPane'), work: box('scWorkPane'),
               pat: box('scPatPane'),
               /* The hero's own label went with the stop that replaced
                  it: a word naming a section directly under the button
                  that opens that section is the same word twice. */
               lbl: document.querySelectorAll('.ty-lbl').length };
    });
    ok('Today has three stops and only the one you pressed is drawn',
      stops.names.join('|') === 'Showing up|Workouts|Pattern'
      && stops.on.join('') === 'work' && stops.work && !stops.up && !stops.pat
      && stops.lbl === 0, stops);

    /* An empty record draws no apparatus. A calendar of ninety unlit
       days under a zero is a screen telling you off for not using a
       feature you have not found yet. */
    const bare = await page.evaluate(() => ({
      none: !!document.querySelector('.wo-none'),
      cal: document.querySelectorAll('.wo-cal').length,
      panels: document.querySelectorAll('.wo-p').length,
    }));
    ok('with nothing logged it says so, and draws no calendar and no panels',
      bare.none && bare.cal === 0 && bare.panels === 0, bare);

    /* ── A REAL THIRTEEN WEEKS ──
       Chest on eight of one weekday, Back on five of another, one
       Pull. Enough for the usual-day claim to be true of two of them
       and false of the third, which is the only way to check it is a
       claim rather than a label. */
    const log = {};
    const put = (n, k, e, m) => {
      log[back(n)] = { ['b' + n]: { k, e: e || 'Hard', m: m || 45 } };
    };
    /* Chest comes out FIVE Hard and THREE Light, which averages to
       Moderate — a word that is in neither input. An average that can
       only return one of the values it was given is a pick.

       The MINUTES are the same argument twice: four at 30 and four at
       60 come out 45, which is in neither input and is not the card's
       own 50-minute estimate either. Reverting the panel to the
       estimate reads 50 and falls over here — which is the only thing
       that tells a mean from the figure it replaced. */
    for (let i = 0; i < 8; i++)
      put(2 + i * 7, 'bro.chest', i < 5 ? 'Hard' : 'Light', i < 4 ? 30 : 60);
    for (let i = 0; i < 5; i++) put(4 + i * 7, 'bro.back');
    /* Day 3, and not 9: nine is 2 + 7, which is Chest's second Friday,
       and one record per block per day means the Pull simply replaced
       it — seven Chests where the assertion says eight, and a fixture
       quietly measuring something other than what it describes. */
    put(3, 'ppl.pull');
    /* Outside the thirty-day window on purpose, so the no-share branch
       has something to be true of. */
    put(60, 'run.long');
    await openWork(log);

    const drawn = await page.evaluate(() => {
      /* The tile: the count in the swatch, the name, and the figures
         as pills — time first (said with Avg), effort, share when
         there is one, and the day it lands on or how long ago last. */
      const rows = [...document.querySelectorAll('.wo-p')].map((t) => {
        const pills = [...t.querySelectorAll('.props .pill')].map((p) => p.textContent);
        const figs = pills.slice(0, -1);
        return {
          k: t.dataset.workout,
          n: t.querySelector('.wo-sw b').textContent,
          w: t.querySelector('.wo-w').textContent,
          s: pills[pills.length - 1],
          open: t.getAttribute('aria-expanded') === 'true',
          cal: !!t.querySelector('.wo-cal'),
          f: figs.map((v) => v.replace(/^Avg /, '')),
          lab: figs[0] && figs[0].startsWith('Avg ') ? ['Avg'] : [],
          spoken: t.getAttribute('aria-label'),
          quiet: t.querySelector('.props').getAttribute('aria-hidden') === 'true',
        };
      });
      const dots = [...document.querySelectorAll('.wo-d')];
      return { fig: document.querySelector('.wo-head .ty-fig').textContent,
        months: [...document.querySelectorAll('.wo-mn')].map((m) => m.textContent),
        rows,
        cals: document.querySelectorAll('.wo-cal').length,
        lit: dots.filter((d) => d.classList.contains('is-on')).length,
        unlit: dots.filter((d) => !d.classList.contains('is-on')
          && !d.classList.contains('is-gap')).length,
        label: document.querySelector('.wo-cal').getAttribute('aria-label') };
    });
    ok('it counts every session and names three months',
      /^15/.test(drawn.fig) && drawn.months.length === 3
      && drawn.months.every((m) => /^[A-Z][a-z]{2}$/.test(m)), drawn);

    /* ── A PANEL PER WORKOUT YOU DID, NOT PER WORKOUT THAT EXISTS ──
       Twenty-two panels, nineteen of them reading zero, is a menu
       rather than a record — and the deck two taps away is already the
       menu. Most-done first, so the panel you look at is the thing you
       actually do. */
    ok('one panel per workout you actually did, most-done first',
      drawn.rows.length === 4
      && drawn.rows.map((t) => t.w + ' ' + t.n).join('|')
         === 'Chest 8|Back 5|Pull 1|Long 1', drawn.rows);

    /* ── THE CALENDAR BELONGS TO ONE CARD, AND EXACTLY ONE IS OPEN ──
       A picture with nine hues scattered through it says you were busy
       and nothing else. And the TOP one opens by itself: a first visit
       showing three shut rows hides the whole point behind a press
       nobody knows to make. */
    ok('the top panel is open, and it is the only one with a calendar',
      drawn.cals === 1 && drawn.rows[0].open && drawn.rows[0].cal
      && drawn.rows.slice(1).every((r) => !r.open && !r.cal), drawn.rows);

    /* ── THE DAYS YOU MISSED ARE DRAWN ──
       A calendar of only the days you trained is a list of wins with
       the gaps taken out. Both halves: eight lit for the open card,
       and an unlit day for every other day in those three months. */
    ok(`the misses are drawn too (${drawn.lit} lit, ${drawn.unlit} not)`,
      drawn.lit === 8 && drawn.unlit > 60, drawn);
    ok('...and the picture is spoken as the card it belongs to',
      /^Chest, 8 sessions over three months/.test(drawn.label), drawn.label);

    /* ── AND IT ONLY CLAIMS A USUAL DAY WHERE THERE IS ONE ──
       A majority of one is one. A weekday under a panel reading 1 is
       the app inventing a routine out of a single session, so under
       three it says how long ago instead. Both directions, because
       watching the claim appear passes on code that always claims. */
    ok('...saying which day it lands on only where three or more say so',
      /days$/.test(drawn.rows[0].s) && /days$/.test(drawn.rows[1].s)
      && /ago|today|yesterday|last week/.test(drawn.rows[2].s), drawn.rows);

    /* ── THE FIGURES ON THE RIGHT, ABOUT THE SESSION ──
       How long it takes, how hard it comes out, and what share of this
       month it is — where the left half is about the day.

       AVG IS SAID OUT LOUD on the time, because it is the one figure
       here somebody could read as this session's actual length. */
    ok('every panel carries its average time and its effort',
      drawn.rows.every((r) => /^\d+ min$/.test(r.f[0])
        && /^(Light|Moderate|Hard)$/.test(r.f[1])
        && r.lab.join('') === 'Avg'),
      drawn.rows.map((r) => r.lab.join('') + ' ' + r.f.join(' / ')));

    /* ── A TWO-PART SESSION IS ONE ROW, NAMED FOR BOTH ──
       Pull and core is one thing you do: it has its own length, its
       own days and its own place in the week, and split across a Pull
       panel and a Core panel none of that is anywhere. So the row is
       "Chest + Abs", timed as both — and it must NOT also appear as
       two rows of its own, which is the version this replaced. */
    /* ONE session on the record and nothing else, or the rest of the
       fixture's own Chest and Abs rows are indistinguishable from the
       combination being counted twice — which is the bug this is for. */
    await page.evaluate(() => {
      const raw = JSON.parse(localStorage.getItem('sched.train.v1') || '{}');
      const day = Object.keys(raw).sort()[0];
      localStorage.setItem('sched.train.v1',
        JSON.stringify({ [day]: { solo: { k: 'bro.chest+bro.abs', e: 'Hard' } } }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(340);
    await page.click('[data-tystop="work"]');
    await page.waitForTimeout(340);
    const joined = await page.evaluate(() => {
      const all = [...document.querySelectorAll('.wo-p')];
      const p = all.find((x) => x.dataset.workout.indexOf('+') >= 0);
      return { keys: all.map((x) => x.dataset.workout),
        w: p && p.querySelector('.wo-w').textContent,
        t: p && p.querySelector('.props .pill').textContent.replace(/^Avg /, '') };
    });
    ok('a two-part session is one row named for both, timed as both',
      joined.w === 'Chest + Abs'
      /* 50 for chest and 20 for abs: the length of a session is the
         length of everything in it. */
      && joined.t === '70 min', joined);
    ok('...and it is not also counted as two rows of its own',
      joined.keys.indexOf('bro.chest') < 0 && joined.keys.indexOf('bro.abs') < 0,
      joined.keys);
    await openWork(log);

    /* ── AND THE SHARE IS THIS MONTH'S ──
       Over thirteen weeks the figure barely moves, which makes it a
       fact about your history rather than about what you are training
       now. Thirty days is short enough to move when you change what
       you do. The shares have to sum to the whole, or the denominator
       is wrong — and the fixture is built so the month's split is not
       the window's: four Chests and four Backs inside thirty days
       against eight and five over the whole record. */
    const shares = drawn.rows.map((r) => r.f[2]).filter(Boolean);
    ok(`the share is this month's, and the shares add up (${shares.join(' ')})`,
      shares.every((v) => /^\d+% this month$/.test(v))
      && Math.abs(shares.reduce((n, v) => n + parseInt(v, 10), 0) - 100) <= 2,
      shares);

    /* ── THE EFFORT IS A REAL AVERAGE ──
       It is the one figure on this record you chose per session, so it
       is the one that can move. Chest is five Hard and three Light, and
       the panel says Moderate — a word in neither input, which is what
       tells an average from a pick. */
    ok('the effort is averaged, not picked',
      drawn.rows[0].f[1] === 'Moderate' && drawn.rows[1].f[1] === 'Hard',
      drawn.rows.map((r) => r.w + ' ' + r.f[1]));

    /* ── AND SO IS THE TIME ──
       Nothing on this record carried a duration until the sheet asked
       for one, so the figure was the card's own estimate wearing the
       word "Avg". Chest's eight are four 30s and four 60s: the panel
       has to read 45, which is neither of those and is not the 50 the
       card estimates. */
    ok('the time is the mean of what was logged, not the card\'s estimate',
      drawn.rows[0].f[0] === '45 min', drawn.rows[0].f);

    /* ── AND THE BLOCK IS SPOKEN ONCE ──
       Two glyphs and three figures read out as marks would charge
       twice for one fact, so the figures are aria-hidden and the whole
       panel carries one sentence. */
    ok('...spoken once in the panel\'s own label, not as five marks',
      drawn.rows[0].quiet
      && /45 minutes on average, usually moderate, \d+ per cent of this month/
         .test(drawn.rows[0].spoken), drawn.rows[0].spoken);

    /* A session with nothing in the last thirty days carries no share
       at all, rather than a 0% — "11 weeks ago" on the same panel has
       already said it, and a zero beside it is the app saying nothing
       twice. Held on a fixture row that is genuinely outside the
       window. */
    const old5 = drawn.rows.filter((r) => /weeks ago/.test(r.s));
    ok('...and a session you have not done this month carries no share',
      old5.length > 0 && old5.every((r) => r.f.length === 2), old5);

    /* ── PRESSING ANOTHER CARD MOVES THE CALENDAR INTO IT ──
       This is the whole mechanism, so it is driven rather than
       inspected: press Back and the picture has to become Back's, with
       five lit days rather than eight. */
    await page.click('.wo-p[data-workout="bro.back"]');
    await page.waitForTimeout(300);
    const moved = await page.evaluate(() => {
      const open = document.querySelector('.wo-p.is-open');
      return { k: open.dataset.workout,
        cals: document.querySelectorAll('.wo-cal').length,
        lit: document.querySelectorAll('.wo-d.is-on').length,
        inside: !!open.querySelector('.wo-cal') };
    });
    ok('pressing another card moves the calendar into it',
      moved.k === 'bro.back' && moved.cals === 1 && moved.inside
      && moved.lit === 5, moved);

    /* ── AND THE MARKS WEAR THE THEME'S ACCENT, NOT THE NINE HUES ──
       The workout cards carry a literal colour each, because a colour
       that says WHICH session this is has to be the same on every
       palette. Here nothing needs saying — the panel prints the name
       and the calendar belongs to one card — so a hue would be a
       second colour system down a screen that already has an accent,
       and on the shipped lime page it would draw the marks red.

       Measured on composited pixels, because the dot is 5px with a
       bloom under it: this repo has twice found a mark that passed the
       arithmetic and vanished on screen. */
    const hue = await page.evaluate(() => {
      const d = document.querySelector('.wo-d.is-on');
      const r = d.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2,
        want: getComputedStyle(document.documentElement)
          .getPropertyValue('--red').trim() };
    });
    const png5 = PNG5.sync.read(await page.screenshot());
    const at5 = (x, y) => {
      const i = (png5.width * Math.round(y * dpr5) + Math.round(x * dpr5)) << 2;
      return [png5.data[i], png5.data[i + 1], png5.data[i + 2]];
    };
    const hex5 = (h) => h.replace('#', '').match(/\w\w/g).map((x) => parseInt(x, 16));
    const dot = at5(hue.x, hue.y);
    const ground = at5(hue.x, hue.y - 30);
    const want = hex5(hue.want);
    ok(`a lit day is the page's own accent (${dot.join(',')} against ${want.join(',')})`,
      deltaE(dot, want) < 22 && ratio(dot, ground) >= 3, { dot, want, ground });

    /* ── AND THE OPEN PANEL IS RINGED IN IT TOO ──
       It went grey in the pass that put every title and every filled
       control back to white, and that pass was about CHROME. This ring
       is not chrome: it says which panel the calendar under it belongs
       to, and a calendar of the days you did that session is the
       record.

       Read off the SCREEN and never off the declaration: the computed
       box-shadow here serialises as `color(srgb 0.78 0.98 0.26 /
       0.34)` rather than an rgba, so a string check against --red's
       own hex passes on nothing and fails on everything.

       Measured as the ring's OWN contribution — the edge pixel less
       the panel's interior — because the ring is a third of the accent
       over a wash of --ink and the sum of the two is nobody's colour.
       IT WAS A SPREAD CHECK, and it cannot be one any more. The ring
       was a third of the accent and the accent was a hue, so the ring's
       contribution carried that hue's spread across the channels — 62
       on the lime it shipped with, against 0 for a grey. The accent is
       the INK now, so the honest question is no longer which channel
       leads but whether the ring is THERE: a difference the eye can
       find between the edge and the panel a few pixels in. Measured the
       same way, read differently. */
    const edge = await page.evaluate(() => {
      const o = document.querySelector('.wo-p.is-open').getBoundingClientRect();
      return { x: o.left + o.width / 2, t: o.top };
    });
    /* The ring is a spread OUTSIDE the tile — inside its top edge is
       the swatch in the session's own colour — so it is read one pixel
       above the box against the page a few pixels further up. */
    const ringPx = at5(edge.x, edge.t - 1);
    const inPx = at5(edge.x, edge.t - 7);
    const gave = ringPx.map((v, i) => v - inPx[i]);
    const spread = Math.max(...gave) - Math.min(...gave);
    const top = (a) => a.indexOf(Math.max(...a));
    const lift = Math.max(...gave);
    ok(`the open panel is ringed, and the ring is a real mark (+${lift})`,
      lift >= 40 && spread <= 12,
      { ringPx, inPx, gave, lift, spread, want });

    /* ── THE STOP IS REMEMBERED, UNDER ITS OWN KEY ──
       Which half of a screen you were last on is a preference about
       looking at the record; folding it into the record is how a
       damaged record takes the other down.

       WHICH PANEL WAS OPEN IS NOT REMEMBERED, deliberately: it is a
       position on a screen you are looking at, and one restored from
       last week opens on a session you have stopped doing. Asserted,
       because "not stored" is only visible from outside as the top one
       being open again. */
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(340);
    const kept5 = await page.evaluate(() => ({
      key: localStorage.getItem('sched.ty.v1'),
      inSchedule: /tystop/.test(localStorage.getItem('sched.v1') || ''),
      work: document.getElementById('scWorkPane').getBoundingClientRect().height > 8,
      open: (document.querySelector('.wo-p.is-open') || { dataset: {} }).dataset.workout,
    }));
    ok('the stop is still up after a reload, kept away from the schedule',
      kept5.key === 'work' && !kept5.inSchedule && kept5.work
      && kept5.open === 'bro.chest', kept5);

    await page.evaluate(() => {
      localStorage.removeItem('sched.train.v1');
      localStorage.removeItem('sched.ty.v1');
      localStorage.setItem('sched.view.v1', 'list');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
  }

  /* ═══════════════════════════════════════════════════════════
     PATTERN — THE RECORD READ BACK

     The third stop on Today, and the only screen in this app that
     ASKS for something. Everything here is measured on a planted
     record with a known answer, because the whole feature is one
     piece of arithmetic and "a number appeared" is what a broken one
     looks like too.
     ═══════════════════════════════════════════════════════════ */
  {
    const pctx = await browser.newContext(PHONE);
    const ppage = await pctx.newPage();
    const perrs = [];
    ppage.on('pageerror', (e) => perrs.push(String(e)));
    ppage.on('console', (m) => { if (m.type() === 'error') perrs.push(m.text()); });
    await jackets(ppage);
    const pAsked = [];
    ppage.on('request', (r) => pAsked.push(r.url()));

    /* Every fixture is a function of the day index, so the arithmetic
       it implies can be worked out on paper and written into the
       assertion rather than read off the screen and blessed. */
    const plant = async (spec) => {
      await ppage.evaluate((sp) => {
        const pad = (n) => (n < 10 ? '0' : '') + n;
        const day = (b) => { const d = new Date(); d.setDate(d.getDate() - b);
          return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
        const tick = {}, rate = {};
        // eslint-disable-next-line no-new-func
        const f = new Function('i', 'd', sp.body);
        for (let i = 1; i <= sp.n; i++) {
          const d = day(i), got = f(i, d);
          if (got.tick) tick[d] = got.tick;
          if (got.rate !== undefined) rate[d] = got.rate;
        }
        localStorage.setItem('sched.tick.v1', JSON.stringify(tick));
        localStorage.setItem('sched.rate.v2', JSON.stringify(rate));
        localStorage.setItem('sched.log.v1', '{}');
        localStorage.setItem('sched.view.v1', 'tally');
        localStorage.setItem('sched.ty.v1', 'pat');
        if (sp.week) localStorage.setItem('sched.v1', JSON.stringify(sp.week));
        else localStorage.removeItem('sched.v1');
        localStorage.setItem('sched.net.v1',
          JSON.stringify({ on: false, url: '', code: '' }));
        localStorage.setItem('sched.tour.v1', '1');
        localStorage.setItem('sched.hint2.v1', '1');
        localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      }, spec);
      await ppage.reload({ waitUntil: 'networkidle' });
      await ppage.waitForTimeout(320);
    };
    const readRows = () => ppage.evaluate(() => [...document.querySelectorAll('.pat-row')]
      .map((r) => ({ n: r.querySelector('.pat-nm').textContent,
                     v: r.querySelector('.pat-n').textContent,
                     bar: (() => { const b = r.querySelector('.pat-bar');
                       return b ? { side: b.className.replace('pat-bar ', ''),
                                    w: b.getBoundingClientRect().width } : null; })() })));

    await ppage.goto(`${BASE}/schedule/`, { waitUntil: 'networkidle' });

    /* ── THE FIGURE IS A DIFFERENCE OF MEANS, AND BOTH HALVES OF IT
           ARE ASSERTED ──
       Train ticked on twenty days rated Good, not ticked on twenty
       rated Rough. Mean 2 against mean 0 on a three-point scale, so
       the answer is exactly +2.0 and nothing else is in the record to
       be ranked beside it. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 1 };' });
    let rows = await readRows();
    ok('a thing on your good days and off your rough ones reads +4.0',
      rows.length === 1 && rows[0].n === 'Train' && rows[0].v === '+4.0', rows);

    /* And the same yes-side against a different no-side. A screen
       printing the MEAN OF THE DAYS IT WAS ON — which is the figure
       somebody reaches for first, and is not an answer to the
       question — reads +2.0 on both fixtures and cannot tell them
       apart. This one is 2 − 1. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 3 };' });
    rows = await readRows();
    ok('...and the same good days against ordinary ones read +2.0, '
      + 'which is what makes it a difference rather than an average',
      rows.length === 1 && rows[0].v === '+2.0', rows);

    /* The other direction, and the sign is on the number AND on the
       side of the axis the bar is drawn. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 1 : 5 };' });
    rows = await readRows();
    ok('a thing on your rough days reads −4.0 and draws left of the axis',
      rows.length === 1 && rows[0].v === '−4.0'
      && rows[0].bar && rows[0].bar.side === 'is-dn', rows);

    /* ── A DAY IT WAS NEVER ON IS NOT A DAY YOU MISSED IT ──
       The tally strip's own rule, and the thing this screen would get
       silently wrong. Sleep is logged on twenty days that split ten
       Good and ten Rough; on twenty MORE rated days it is not logged
       at all, and those are all Good.

       Read correctly — the unlogged days dropped from Sleep's
       arithmetic entirely — it is 5 − 1 = +4.0. Counted as a night
       below the middle it is 5 − (5·20 + 1·10)/30 = +1.3. The two
       fixtures differ only in what is done with a day that never
       asked the question. */
    await plant({ n: 40, body: `
      if (i <= 10) return { tick: { s: '8' }, rate: 5 };
      if (i <= 20) return { tick: { s: '5' }, rate: 1 };
      return { tick: {}, rate: 5 };` });
    rows = await readRows();
    const sleep = rows.filter((r) => /^Sleep/.test(r.n))[0];
    ok('a night you did not record is dropped from that figure, never '
      + 'counted as a short one', sleep && sleep.v === '+4.0', rows);
    /* And the split is printed at the item's own precision, off YOUR
       own middle rather than a target this app picked — half of your
       own record is also the only threshold that guarantees both
       sides have days on them. */
    ok('...and the row names the split it made, at your own middle',
      sleep && sleep.n === 'Sleep over 6.5 h', rows);

    /* ── AND A WEEKDAY THE BLOCK IS NOT ON IS THE SAME ANSWER ──
       Train three days a week, rated Good on the four days it is not
       scheduled. Counted as four misses a week the figure collapses;
       dropped, it is the +2.0 the ticks actually say. This is the
       `do` half of the rule the fixture above proves for a number. */
    const wk = { title: 'Daily Process', items: [] };
    for (let d = 0; d < 7; d++) {
      if (d === 1 || d === 3 || d === 5) {
        wk.items.push({ d, s: 390, e: 450, r: '', n: 'Train' });
      }
      wk.items.push({ d, s: 1275, e: 1305, r: '', n: 'Read' });
    }
    await plant({ n: 84, week: wk, body: `
      const dow = new Date(d + 'T12:00:00').getDay();
      const on = dow === 1 || dow === 3 || dow === 5;
      if (!on) return { tick: {}, rate: 5 };
      return { tick: i % 2 ? { t: 1 } : {}, rate: i % 2 ? 5 : 1 };` });
    rows = await readRows();
    const train = rows.filter((r) => r.n === 'Train')[0];
    ok('a day the block was never on is dropped too, so a three-day '
      + 'schedule is not four misses a week', train && train.v === '+4.0',
      rows);

    /* ── FIVE DAYS EITHER SIDE, OR IT IS NOT RANKED ──
       Two days against eighty is not a comparison, and a difference
       of means over a sample that small swings on one bad night and
       prints it as a finding. Both directions, because a floor that
       only ever refuses is indistinguishable from a factor that never
       worked. */
    await plant({ n: 40, body:
      'return { tick: i <= 4 ? { t: 1 } : {}, rate: i <= 4 ? 5 : 1 };' });
    ok('four days on one side of a thing is not enough to rank it',
      (await readRows()).length === 0);
    await plant({ n: 40, body:
      'return { tick: i <= 5 ? { t: 1 } : {}, rate: i <= 5 ? 5 : 1 };' });
    ok('...and five is', (await readRows()).length === 1);

    /* ── AND THE SCREEN SAYS HOW MANY MORE DAYS IT NEEDS ──
       Below the floor it has nothing to say, and the honest thing to
       do with nothing is to say what would fix it. Measured as the
       list being ABSENT rather than empty: a list with no rows still
       draws its axis. */
    await plant({ n: 13, body: 'return { tick: { t: 1 }, rate: (i % 3) + 1 };' });
    const few = await ppage.evaluate(() => ({
      say: (document.querySelector('.pat-none') || {}).textContent || '',
      list: !!document.querySelector('.pat-list'),
      ask: !!document.querySelector('#scPatPane .rt-row'),
    }));
    ok('under the floor it says how many more days, draws no list, and '
      + 'still asks about today',
      /Rate 1 more day\b/.test(few.say) && !few.list && few.ask, few);

    /* ── NOTHING EVER PRINTS −0.0 ──
       A lift of −0.04 is zero at one decimal place, and reading the
       sign off the raw number put a minus sign on nothing — which
       reads as a rendering fault rather than as a thing that makes no
       difference. A zero wears no sign and draws no bar; the axis
       runs through the row unbroken. */
    await plant({ n: 60, body:
      'return { tick: i % 2 ? { t: 1 } : {}, rate: (i % 3) + 1 };' });
    const zed = await readRows();
    ok('a factor that moves nothing prints a bare 0.0 and draws no bar',
      zed.length > 0 && zed.every((r) => !/−0\.0|\+0\.0/.test(r.v))
      && zed.filter((r) => r.v === '0.0').every((r) => !r.bar), zed);

    /* ── THE AXIS IS THE WHOLE OF WHAT SAYS UP OR DOWN ──
       Which side of it a bar sits on is the only thing carrying the
       direction, because a colour here would be this screen saying
       whether — the one thing it never does. So the axis has to be
       VISIBLE, and it went in as --g0, which is `var(--paper)`: the
       line was painted in the page it was drawn on and measured
       1.01:1 on screen. It looked like a faint line in a screenshot
       because the rows nearest zero drew a bar about a pixel wide,
       and a green sliver is not an axis.

       Measured as the brightest pixel in a band across where the
       axis is, against the ground a few pixels off it — never read
       off the declaration, since --hair and --tick-off both LOOK like
       the token for this and measure 1.27:1 and 1.60:1. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 1 };' });
    const geo = await ppage.evaluate(() => {
      const l = document.querySelector('.pat-list').getBoundingClientRect();
      const right = parseFloat(getComputedStyle(
        document.querySelector('.pat-list'), '::before').right);
      const r = document.querySelector('.pat-row').getBoundingClientRect();
      /* Six pixels up from the row's foot: clear of the bar, which
         takes the middle eight of a thirty-four pixel row, and INSIDE
         the axis. Written first as `height - 2` — the axis is inset
         two pixels top and bottom, so that is its excluded bottom
         EDGE, and every sample came back as bare page. It reported
         1.00:1 on an axis that is plainly there in a screenshot,
         which is the same failure as measuring the wrong machine:
         a check can be wrong about where it is looking as easily as
         about what it is looking for. */
      return { x: l.x + l.width - right, y: r.y + r.height - 6 };
    });
    const ppng = PNG.sync.read(await ppage.screenshot());
    const pAt = (x, y) => { const i = (ppng.width * Math.round(y * dpr)
      + Math.round(x * dpr)) << 2;
      return [ppng.data[i], ppng.data[i + 1], ppng.data[i + 2]]; };
    let axPx = [0, 0, 0];
    for (let dx = -3; dx <= 0; dx += 0.5) {
      const p = pAt(geo.x + dx, geo.y);
      if (lum(p) > lum(axPx)) axPx = p;
    }
    const axGround = pAt(geo.x + 16, geo.y);
    const axR = ratio(axPx, axGround);
    ok(`the axis is a mark you can see (${axR.toFixed(2)}:1 on composited `
      + 'pixels, against 1.01 for the token it went in as)',
      axR >= 3, { axPx, axGround, geo });

    /* ── LIT IS THE ACCENT, UNLIT IS THE FLAT NEUTRAL ──
       The accent on this app makes exactly one claim, that something
       happened, and what happened here is that you ANSWERED. How the
       day went is carried by HOW MANY are lit, never by a colour: a
       red mark for a bad day would be the screen grading you back, and
       this is the one screen that takes an opinion.

       Measured on composited pixels, and the accent is read off the
       root rather than written in: it is a wheel now, so a hex in a
       test measures nothing the day it turns. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 1 };' });
    await ppage.evaluate(() =>
      document.querySelectorAll('#scPatPane .rt')[2].click());
    await ppage.waitForTimeout(220);
    const markPx = await (async () => {
      const b = await ppage.evaluate(() => {
        const on = document.querySelector('#scPatPane .rt.is-on');
        const off = document.querySelector('#scPatPane .rt:not(.is-on)');
        const box = (e) => { const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height }; };
        return { on: box(on), off: box(off),
                 lit: document.querySelectorAll('#scPatPane .rt.is-on').length };
      });
      const png = PNG.sync.read(await ppage.screenshot());
      const at = (x, y) => { const i = (png.width * Math.round(y * dpr)
        + Math.round(x * dpr)) << 2;
        return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
      /* The brightest pixel inside each circle's own box: a lit one is
         a solid fill on a dark card, so the extreme IS the mark. */
      const peak = (k) => {
        let best = [0, 0, 0];
        for (let x = k.x + 10; x < k.x + k.w - 10; x += 1) {
          for (let y = k.y + 10; y < k.y + k.h - 10; y += 1) {
            const p = at(x, y);
            if (lum(p) > lum(best)) best = p;
          }
        }
        return best;
      };
      /* And the middle of each, because the two states differ by being
         FILLED or not: lit is a disc in the accent, unlit is a hollow
         ring in the flat neutral. That is the habits screen's rule —
         a kept mark takes the colour, a missed one stays hollow — and
         it is also what stops five filled circles at the foot of the
         card reading as a second set of the deck's page dots a few
         inches below. A brightest-pixel scan alone cannot see it: a
         filled unlit circle and a hollow one peak at the same grey. */
      const mid = (k) => at(k.x + k.w / 2, k.y + k.h / 2);
      return { on: peak(b.on), off: peak(b.off), lit: b.lit,
               onMid: mid(b.on), offMid: mid(b.off) };
    })();
    const accent = await ppage.evaluate(() => getComputedStyle(
      document.documentElement).getPropertyValue('--red').trim());
    const want = accent.replace('#', '').match(/../g).map((h) => parseInt(h, 16));
    ok(`pressing the third circle lights three, in the accent (${accent})`,
      markPx.lit === 3
      && markPx.on.every((v, i) => Math.abs(v - want[i]) <= 8), markPx);
    /* And the unlit one is a GREY, which is the whole of what stops
       this screen having an opinion: no channel of it stands out. */
    const spread = Math.max(...markPx.off) - Math.min(...markPx.off);
    ok(`...and an unlit one is a flat neutral, not a second colour `
      + `(spread ${spread})`, spread <= 12, markPx);
    /* Lit is FILLED and unlit is HOLLOW, read at the exact middle of
       each: the accent in one, the card's own ground in the other. */
    ok('a lit circle is a disc and an unlit one is a ring',
      markPx.onMid.every((v, i) => Math.abs(v - want[i]) <= 10)
      && lum(markPx.offMid) < lum(markPx.off) * 0.5, markPx);

    /* Pressing the circle you are already on takes the rating off, so a
       mis-tap has a way back without a second control to explain it. */
    const today = await ppage.evaluate(() => { const p = (n) => (n < 10 ? '0' : '') + n;
      const d = new Date();
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); });
    const wasSet = await ppage.evaluate((k) =>
      JSON.parse(localStorage.getItem('sched.rate.v2'))[k], today);
    await ppage.evaluate(() =>
      document.querySelectorAll('#scPatPane .rt')[2].click());
    await ppage.waitForTimeout(180);
    const now = await ppage.evaluate((k) => ({
      has: k in JSON.parse(localStorage.getItem('sched.rate.v2')),
      on: document.querySelectorAll('#scPatPane .rt.is-on').length,
    }), today);
    ok('pressing the circle you are on takes the day off again',
      wasSet === 3 && !now.has, { wasSet, now });
    ok('...and nothing is lit once it is cleared', now.on === 0, now);

    /* ── HOW YOU FELT NEVER LEAVES THE PHONE ──
       The record already says a COUNT means you showed up and a LIST
       means what your day is, and that the second is the thing this
       app exists not to send. How a day felt is further down that
       road than either.

       Two halves, because each passes on the other's bug: rating a
       day must not make a request at all, and a push that happens for
       some other reason must not be carrying one. The second is the
       check that was missing the two times a comment reading "this is
       never sent" was the only place the intention existed. */
    const HOSTX = 'https://pattern.invalid';
    const bodies = [];
    await ppage.route(HOSTX + '/**', async (route) => {
      const r = route.request();
      if (r.postData()) bodies.push(r.postData());
      await route.fulfill({ status: 200, contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' }, body: '{}' });
    });
    await ppage.evaluate((h) => {
      localStorage.setItem('sched.net.v1', JSON.stringify({
        on: true, url: h, code: 'PAT12345', key: 'f'.repeat(32), name: 'Pat' }));
      localStorage.setItem('sched.ty.v1', 'pat');
    }, HOSTX);
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(320);
    const markA = pAsked.length;
    await ppage.evaluate(() =>
      document.querySelectorAll('#scPatPane .rt')[3].click());
    await ppage.waitForTimeout(2200);          /* past the 1.5s push debounce */
    const sinceRate = pAsked.slice(markA).filter((u) => u.startsWith(HOSTX));
    ok('rating a day makes no request at all', sinceRate.length === 0, sinceRate);

    /* Now something that DOES push, so there is a real body to read.
       Mind rather than Train: ticking a training block opens the
       workout picker, and a sheet in the way is a different test. */
    await ppage.evaluate(() => document.getElementById('scTyUp').click());
    await ppage.waitForTimeout(200);
    await ppage.evaluate(() =>
      document.querySelector('.ty-card[data-item="m"]').click());
    await ppage.waitForTimeout(2400);
    const rated = await ppage.evaluate(() => localStorage.getItem('sched.rate.v2'));
    ok('and a push that does happen carries no rating in it',
      bodies.length > 0 && bodies.every((b) => !/rate|star|circle/i.test(b))
      && rated && rated !== '{}',
      { bodies: bodies.map((b) => b.slice(0, 160)), rated });

    /* ── YOUR COLOUR IS THE ONE SETTING THAT TRAVELS ──
       It is pushed with your record so a friend's board draws you in
       it, which is the whole argument for choosing it rather than
       deriving it. It used to send --red, and --red is the ink now —
       so left alone, every friend would draw you as a white disc and
       the setting would be one only you could see.

       Read off the BODY that actually went, because that is the only
       place the difference between the two tokens shows. */
    const sent = bodies.map((b) => { try { return JSON.parse(b); } catch (e) { return {}; } })
      .filter((b) => b.acc);
    const mine = await ppage.evaluate(() => ({
      me: getComputedStyle(document.documentElement)
        .getPropertyValue('--me').trim().toLowerCase(),
      red: getComputedStyle(document.documentElement)
        .getPropertyValue('--red').trim().toLowerCase() }));
    ok('a push carries the colour you chose, not the ink',
      sent.length > 0 && sent.every((b) => b.acc.toLowerCase() === mine.me)
      && mine.me !== mine.red,
      { acc: sent.map((b) => b.acc), mine });

    /* ── ONE PANE AT A TIME, MEASURED ──
       `hidden` works by a UA rule of `display: none`, and any author
       `display` beats it — which is how the week once stayed on
       screen underneath the friends board with the attribute being
       set correctly throughout. The third stop is a third chance to
       make that mistake, so this asks the LAYOUT. */
    await ppage.evaluate(() => {
      localStorage.setItem('sched.net.v1', JSON.stringify({ on: false, url: '', code: '' }));
    });
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(300);
    for (const [stop, id] of [['up', 'scTyPane'], ['work', 'scWorkPane'],
                              ['pat', 'scPatPane']]) {
      await ppage.evaluate((s) => document.querySelector('[data-tystop="' + s + '"]').click(), stop);
      await ppage.waitForTimeout(160);
      const drawn = await ppage.evaluate(() => ['scTyPane', 'scWorkPane', 'scPatPane']
        .filter((k) => { const r = document.getElementById(k).getBoundingClientRect();
          return r.width > 1 && r.height > 1; }));
      ok(`on ${stop}, ${id} is the only pane drawing`,
        drawn.length === 1 && drawn[0] === id, { stop, drawn });
    }

    /* ── AND A STORED STOP HAS TO FALL THROUGH ──
       The key outlives the code that wrote it, so a value naming a
       pane this build no longer has must mean the first one rather
       than a screen with a bar on it and nothing above the bar. Same
       rule sched.view.v1 already keeps, and the reason the list is
       written out rather than trusted. */
    await ppage.evaluate(() => localStorage.setItem('sched.ty.v1', 'ring'));
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(300);
    ok('a stop naming a pane that is gone falls through to the first',
      await ppage.evaluate(() => {
        const r = document.getElementById('scTyPane').getBoundingClientRect();
        return r.height > 8 && document.getElementById('scTyUp').classList.contains('on');
      }));

    /* ── A DAMAGED ENTRY IS DROPPED, THE RECORD IS NOT ──
       The days are what you cannot get back, and one bad value must
       not take a season of them with it. Repaired on the way in like
       every other store here, and asserted as the good days SURVIVING
       rather than as the bad one being refused — rejecting the whole
       object passes any check written the other way round. */
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 1 };' });
    await ppage.evaluate(() => {
      const r = JSON.parse(localStorage.getItem('sched.rate.v2'));
      const k = Object.keys(r).sort();
      r[k[0]] = 'good'; r[k[1]] = 9; r[k[2]] = null;
      localStorage.setItem('sched.rate.v2', JSON.stringify(r));
    });
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(320);
    const hurt = await ppage.evaluate(() => ({
      foot: document.querySelector('#scPatPane .ty-foot').textContent,
      rows: document.querySelectorAll('.pat-row').length,
    }));
    ok('three damaged days are dropped and the other thirty-seven read',
      /\b37 days\b/.test(hurt.foot) && hurt.rows === 1, hurt);

    /* ── THE SAME CONTROL IS AT THE FOOT OF TODAY'S CARD ──
       The foot of the day is where you are when the day is over, which
       Pattern is not: that screen is where you go to READ what your
       good days have in common. One control built once and used twice,
       because two drawings of one question is how they drift.

       AND ONLY ONCE THE DAY IS DONE. A question about how the day went
       asked at nine in the morning is a question you cannot answer, and
       one sitting under a card with five things still on it is a sixth
       thing on the list. Every block the day asked of you, ticked —
       so the ask is what you arrive at having finished, rather than a
       permanent row at the foot of the card.

       TODAY'S CARD AND NO OTHER. Every card is built for its own
       weekday, and a rating written from Friday's card on a Tuesday
       lands on today under a heading that says Friday — the round trip
       through one wrong answer that "Done today" made, self-
       consistently, for months. Asserted as a COUNT across all seven,
       because "it is on today's card" passes on a build that puts it
       on all of them. */
    const todayKey = await ppage.evaluate(() => {
      const p = (n) => (n < 10 ? '0' : '') + n; const d = new Date();
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    });
    /* Tick `keep` of today's blocks and reload. The week is read back
       out of the store rather than out of the fixture, because scClean
       mints an id for any block that has none and scLoad writes the
       cleaned shape back — the ids the log is keyed by are the ones on
       disk after a load, not the ones a fixture went in with. */
    const doBlocks = async (keep) => {
      await ppage.evaluate(({ k, n }) => {
        const wk = JSON.parse(localStorage.getItem('sched.v1'));
        const dow = new Date(k + 'T12:00:00').getDay();
        const mine = (wk.items || wk).filter((b) => b.d === dow);
        const log = {};
        mine.slice(0, n === null ? mine.length : n)
          .forEach((b) => { log[b.id] = 1; });
        localStorage.setItem('sched.log.v1', JSON.stringify({ [k]: log }));
        localStorage.setItem('sched.view.v1', 'list');
      }, { k: todayKey, n: keep });
      await ppage.reload({ waitUntil: 'networkidle' });
      await ppage.waitForTimeout(600);
      /* ONE DAY IS DRAWN, so "today's day and no other" is asked by
         walking the strip: press each day, and see which of the seven
         puts the row up. A count on one screen would pass on a build
         that drew it everywhere. */
      return ppage.evaluate(async () => {
        const asks = [];
        for (const b of [...document.querySelectorAll('.st-d')]) {
          b.click();
          await new Promise((r) => setTimeout(r, 60));
          if (document.querySelector('.rt-ask')) asks.push(b.dataset.d);
        }
        [...document.querySelectorAll('.st-d')]
          .find((b) => +b.dataset.d === new Date().getDay()).click();
        await new Promise((r) => setTimeout(r, 80));
        return ({
        asks,
        today: String(new Date().getDay()),
        marks: document.querySelectorAll('.week.is-today .rt').length,
        blocks: document.querySelectorAll('.week.is-today .row').length,
        done: document.querySelectorAll('.week.is-today .row.is-done').length,
        /* Inside the scroller, so on a long day it is what you arrive
           at having gone through everything. */
        inCard: !!document.querySelector('.week.is-today .day-card .rt-row'),
      }); });
    };
    await plant({ n: 40, body:
      'return { tick: i <= 20 ? { t: 1 } : {}, rate: i <= 20 ? 5 : 1 };' });
    const none = await doBlocks(0);
    ok('with the day still ahead of you, no card asks how it went',
      none.blocks > 1 && none.asks.length === 0, none);
    /* One short of the whole day. Both directions, because a gate that
       only ever refuses is indistinguishable from a row that was never
       built — and "all but one" is the case a count-based gate off by
       one would wave through. */
    const near = await doBlocks(-1);
    ok('...and one block short of finished still does not',
      near.asks.length === 0, near);
    const onCards = await doBlocks(null);
    ok('the ask is at the foot of today\'s card, and no other, once '
      + 'every block is done',
      onCards.asks.length === 1 && onCards.asks[0] === onCards.today
      && onCards.marks === 5 && onCards.inCard, onCards);

    /* Pattern's own ask is NOT gated, and must not be: a day you never
       finished is still a day you can say something about, and that
       screen is where you go to fill one in afterwards. The card's ask
       is a convenience at the end of a day, not the only door. */
    await ppage.evaluate(() => {
      localStorage.setItem('sched.log.v1', '{}');
      localStorage.setItem('sched.view.v1', 'tally');
      localStorage.setItem('sched.ty.v1', 'pat');
    });
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(450);
    ok('Pattern still asks about a day you did not finish',
      await ppage.evaluate(() =>
        document.querySelectorAll('#scPatPane .rt').length) === 5);
    await ppage.evaluate(() => localStorage.setItem('sched.view.v1', 'list'));
    await doBlocks(null);

    /* ── AND THE TWO PLACES ARE ONE RECORD ──
       A day rated four at the foot of the card had better be a day
       rated four on Pattern. */
    await ppage.evaluate(() =>
      document.querySelectorAll('.week.is-today .rt')[3].click());
    await ppage.waitForTimeout(300);
    await ppage.evaluate(() => {
      localStorage.setItem('sched.view.v1', 'tally');
      localStorage.setItem('sched.ty.v1', 'pat');
    });
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(450);
    ok('a day rated on the card reads the same on Pattern',
      await ppage.evaluate(() =>
        document.querySelectorAll('#scPatPane .rt.is-on').length) === 4);

    /* ── THE OLD THREE-POINT SCALE COMES ACROSS ONCE ──
       Rough, Fine and Good were 0, 1 and 2 under their own key, and
       those two scales SHARE the values 1 and 2 — a stored 1 is either
       the old Fine or one circle and the number does not say which. So
       v1 is converted and spent rather than read twice.

       The old key is asserted GONE rather than merely ignored: left
       there it is a second record of the same days that nothing reads,
       and the next migration to look at it would find it. Same shape
       as the stored palette name when the wheel landed. */
    await ppage.evaluate(() => {
      const p = (n) => (n < 10 ? '0' : '') + n;
      const day = (b) => { const d = new Date(); d.setDate(d.getDate() - b);
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); };
      localStorage.removeItem('sched.rate.v2');
      localStorage.setItem('sched.rate.v1', JSON.stringify({
        [day(1)]: 0, [day(2)]: 1, [day(3)]: 2, [day(4)]: 'x' }));
    });
    await ppage.reload({ waitUntil: 'networkidle' });
    await ppage.waitForTimeout(450);
    const moved = await ppage.evaluate(() => ({
      now: JSON.parse(localStorage.getItem('sched.rate.v2') || '{}'),
      old: localStorage.getItem('sched.rate.v1'),
    }));
    const vals = Object.keys(moved.now).sort().map((k) => moved.now[k]);
    ok('Rough, Fine and Good come across as one, three and five',
      vals.join(',') === '5,3,1' && Object.keys(moved.now).length === 3, moved);
    ok('...and the key they came from is spent, not left behind',
      moved.old === null, moved);

    ok('nothing threw anywhere on Pattern', perrs.length === 0, perrs);
    /* The whole screen, on every fixture above, reached nothing off
       this origin except the one stub it was pointed at on purpose. */
    ok('and Pattern asked for nothing off origin',
      pAsked.every((u) => u.startsWith(BASE) || u.startsWith(HOSTX)
        || u.startsWith('data:') || u.startsWith('blob:') || isArt(u)),
      pAsked.filter((u) => !u.startsWith(BASE) && !u.startsWith(HOSTX)
        && !isArt(u)));
    await pctx.close();
  }

  /* ═══════════════════════════════════════════════════════════
     THE INTRO

     Four cards on a first open, on its own page because it is the one
     screen in this file that only exists when a key is ABSENT — and
     every other section seeds that key precisely so the intro is not
     sitting on top of whatever they are pressing.
     ═══════════════════════════════════════════════════════════ */
  {
    const ictx = await browser.newContext(PHONE);
    const ipage = await ictx.newPage();
    const ierrs = [];
    ipage.on('pageerror', (e) => ierrs.push(String(e)));
    ipage.on('console', (m) => { if (m.type() === 'error') ierrs.push(m.text()); });
    await ipage.addInitScript(() => {
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
    });

    const fresh = async () => {
      await ipage.evaluate(() => localStorage.removeItem('sched.tour.v1'));
      await ipage.reload({ waitUntil: 'networkidle' });
      await ipage.waitForTimeout(360);
    };
    /* Measured as a BOX, never as the hidden property. The rail, the
       page dots and the toast have each had that bug — the attribute
       was being set correctly throughout and an author `display`
       outranked the browser's own [hidden] rule — and every time, the
       check that missed it read the property. This is a full-screen
       surface at z-index 70, so the failure is the whole app becoming
       unpressable behind something nobody can see. */
    const drawn = () => ipage.evaluate(() => {
      const r = document.getElementById('scTour').getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });
    const card = () => ipage.evaluate(() => {
      const t = document.getElementById('scTour');
      /* ── AGAINST THE WINDOW, NOT THE VIEWPORT ──
         The track is clipped by .tr-win, which is inset by the tour's
         own 22px padding, so the next card begins 22px BEFORE the
         screen edge and overlaps the viewport while drawing not one
         pixel of itself. Asked "is it inside innerWidth" this reported
         two cards on screen on a deck that was behaving perfectly.
         What "on screen" means here is overlap with the box that
         clips it. */
      const w = t.querySelector('.tr-win').getBoundingClientRect();
      const lit = [...t.querySelectorAll('.tr-slide')].filter((s) => {
        const r = s.getBoundingClientRect();
        return Math.min(r.right, w.right) - Math.max(r.left, w.left) > 1;
      });
      return { n: t.querySelectorAll('.tr-slide').length,
               title: t.querySelector('.tr-h').textContent,
               go: t.querySelector('.tr-go').textContent,
               step: t.querySelector('.tr-step').textContent,
               lit: lit.map((s) => s.dataset.card),
               live: [...t.querySelectorAll('.tr-slide')]
                 .filter((s) => s.getAttribute('aria-hidden') === 'false')
                 .map((s) => s.dataset.card),
               inert: [...t.querySelectorAll('.tr-slide')]
                 .filter((s) => s.inert).length };
    });

    await ipage.goto(`${BASE}/schedule/`, { waitUntil: 'networkidle' });
    await fresh();

    ok('the intro opens on a first visit', await drawn());

    /* ── FOUR CARDS, AND THE ORDER IS THE DESIGN ──
       It went in at six and two of them were the same card wearing
       different verbs. Both the count and the order are asserted
       because both are one line to change and neither would throw. */
    const first = await card();
    ok('four cards, in their order, objectives last',
      first.n === 4
      && [...await ipage.evaluate(() =>
          [...document.querySelectorAll('.tr-slide')].map((s) => s.dataset.card))]
        .join('|') === 'week|pattern|friends|obj', first);

    /* ── ONE CARD ON SCREEN, AND THE OTHERS OUT OF REACH ──
       A track that moves rather than a scroller leaves the other three
       laid out 390px off the side. Left in the tab order a keyboard
       walks straight into one of them and the focus ring goes with it,
       which looks exactly like the page having scrolled sideways. */
    ok('exactly one card is on screen, and it is the first',
      first.lit.length === 1 && first.lit[0] === 'week'
      && first.live.join('') === 'week' && first.inert === 3, first);
    ok('...and the button says Continue on it, not the last word',
      first.go === 'Continue' && first.step === 'Step 1 of 4', first);

    /* ── THE LAST CARD IS THE OBJECTIVES ONE ── */
    for (let i = 0; i < 3; i++) {
      await ipage.evaluate(() => document.querySelector('.tr-go').click());
      await ipage.waitForTimeout(400);
    }
    const last = await card();
    ok('the last card is the objectives one and starts the week',
      last.live.join('') === 'obj' && last.go === 'Start the week'
      && last.step === 'Step 4 of 4', last);

    /* ── THE POINTER IS GONE, AND SO IS WHAT IT POINTED AT ──
       That card drew a day card at its real proportions with the turn
       pill lit in a corner and a ring bleeding over the edge, because
       the objectives lived behind a control a sentence could only give
       the POSITION of. There is no back to a card and no pill in its
       corner, so the diagram was false twice over and the reason it
       existed went with them.

       Asserted as the element being absent AND as one object per
       card, because a figure merely emptied still reserves its box —
       which is the same shape as the hero the head used to carry. */
    ok('no card carries a second drawing beside its icon',
      await ipage.evaluate(() => document.querySelectorAll('.tr-fig').length === 0
        && [...document.querySelectorAll('.tr-slide')]
          .every((s) => s.querySelectorAll('svg').length === 1)));

    /* ── AND THE ICON MOVES ──
       A still picture can only say WHERE a thing is. A moving one says
       WHAT HAPPENS, which on the objectives card is the whole of what
       nobody guesses: a sheet comes up from the head.

       The count is asserted beside the state, for the reason the foil
       rim's own check had to be: a check that finds nothing must not
       pass, and "every animation is paused" is vacuously true of a
       card with no animations left on it. */
    const anim = await ipage.evaluate(() =>
      [...document.querySelectorAll('.tr-slide')].map((s) => {
        const a = [];
        s.querySelectorAll('.tr-ic svg *').forEach((e) =>
          e.getAnimations().forEach((x) => a.push(x.playState)));
        return { k: s.dataset.card, on: s.getAttribute('aria-hidden') === 'false',
                 n: a.length, run: a.filter((x) => x === 'running').length };
      }));
    ok('every card’s icon is a scene that moves',
      anim.length === 4 && anim.every((a) => a.n > 0), anim);
    /* ── AND ONLY THE ONE ON SCREEN IS RUNNING ──
       Three of the four are laid out off the side at all times, and a
       loop on one of them is a compositor pass a frame to draw what
       nobody can see. The rule is written on the SUBTREE rather than
       on a list of the elements in it, so the next scene added here is
       covered on the day it is added. */
    ok('...and the three off the side are paused',
      anim.filter((a) => a.on).every((a) => a.run === a.n && a.n > 0)
      && anim.filter((a) => !a.on).every((a) => a.run === 0 && a.n > 0), anim);

    /* ── AND THE ICON WEARS THE INK ──
       It was --red, on the argument that every drawing in this app
       that is not chrome wears the accent. There is no accent: colour
       says WHICH and only a tag says which, and a picture of a feature
       is chrome. Asked of the PAGE rather than written as a hex —
       three assertions in this file were once pinned to a shipped red
       and measured nothing the day it moved. */
    const glyph = await ipage.evaluate(() => getComputedStyle(
      document.querySelector('.tr-slide[data-card="obj"] .tr-ic svg')).stroke);
    const want = await ipage.evaluate(() => {
      const d = document.createElement('div');
      d.style.color = getComputedStyle(document.documentElement)
        .getPropertyValue('--ink').trim();
      document.body.appendChild(d);
      const c = getComputedStyle(d).color; d.remove(); return c;
    });
    ok(`every card's icon wears the ink (${glyph})`, glyph === want,
      { glyph, want });

    /* ── FINISHING MARKS IT SEEN ── */
    await ipage.evaluate(() => document.querySelector('.tr-go').click());
    await ipage.waitForTimeout(200);
    ok('pressing through the last card puts it away',
      !(await drawn())
      && await ipage.evaluate(() => localStorage.getItem('sched.tour.v1')) === '1');
    await ipage.reload({ waitUntil: 'networkidle' });
    await ipage.waitForTimeout(360);
    ok('...and it does not come back on the next open', !(await drawn()));

    /* ── AND SO DOES EVERY OTHER WAY OUT ──
       One meaning per control and no hidden third state: a way out
       that quietly means "ask me tomorrow" is a state nothing on
       screen tells you about. Both are checked, because "Don't show
       again" that merely closes passes any check that only watches
       the element go. */
    await fresh();
    await ipage.evaluate(() => document.querySelector('.tr-skip').click());
    await ipage.waitForTimeout(200);
    ok('“Don’t show again” closes it and marks it seen',
      !(await drawn())
      && await ipage.evaluate(() => localStorage.getItem('sched.tour.v1')) === '1');

    await fresh();
    await ipage.keyboard.press('Escape');
    await ipage.waitForTimeout(200);
    ok('...and so does Escape, rather than inventing a third answer',
      !(await drawn())
      && await ipage.evaluate(() => localStorage.getItem('sched.tour.v1')) === '1');

    /* ── WHICH IS ONLY AFFORDABLE BECAUSE IT IS NOT LOST ──
       Every way out is final, so Settings has to be able to play it
       again — and from the TOP, not from wherever it was abandoned. */
    await ipage.evaluate(() => document.getElementById('scTabYou').click());
    await ipage.waitForTimeout(340);
    const row = await ipage.evaluate(() => {
      const b = [...document.querySelectorAll('.menu-item')]
        .find((x) => /Show the intro/.test(x.textContent));
      if (b) b.click();
      return !!b;
    });
    await ipage.waitForTimeout(380);
    const again = await card();
    ok('Settings plays it again, from the first card',
      row && await drawn() && again.live.join('') === 'week'
      && again.step === 'Step 1 of 4', again);

    /* A swipe moves it, which is what the dots promise. */
    const box = await ipage.$eval('.tr-win', (e) => {
      const r = e.getBoundingClientRect();
      return { y: r.y + r.height / 2, l: r.x + 40, rr: r.x + r.width - 40 };
    });
    await ipage.mouse.move(box.rr, box.y);
    await ipage.mouse.down();
    await ipage.mouse.move(box.l, box.y, { steps: 8 });
    await ipage.mouse.up();
    await ipage.waitForTimeout(420);
    ok('a swipe moves it on a card', (await card()).live.join('') === 'pattern');

    /* ── THE COPY IS PLAIN, AND THAT INCLUDES HAVING NO DASHES ──
       It went in written the way the notes beside the code are
       written, which is the wrong register for a screen somebody
       reads once before they know what the app is. Asserted rather
       than trusted, because prose drifts back: an em dash is the
       shape of a second thought, and each of these four cards is
       allowed exactly one. */
    const copy = await ipage.evaluate(() =>
      [...document.querySelectorAll('.tr-slide')]
        .map((s) => s.querySelector('h3').textContent + ' '
          + s.querySelector('p').textContent)
        .concat([document.querySelector('.tr-go').textContent,
                 document.querySelector('.tr-skip').textContent]));
    ok('no card carries a dash of any kind',
      copy.every((t) => !/[—–]|(^|\s)-(\s|$)/.test(t)), copy);
    /* And it stays short. The reference this was drawn from runs two
       or three words on top and one sentence under it; six cards of
       this file's own voice is what it replaced. */
    const longest = Math.max(...copy.slice(0, 4).map((t) => t.length));
    ok(`and every card is one short sentence (longest ${longest} chars)`,
      longest <= 110, copy);

    await ipage.evaluate(() => document.querySelector('.tr-skip').click());
    await ipage.waitForTimeout(200);
    ok('nothing threw anywhere in the intro', ierrs.length === 0, ierrs);
    await ictx.close();

    /* ── AND EVERY SCENE IS COMPLETE AT REST ──
       Its OWN context, because reduced motion is a property of the
       device rather than of the page — and because a check that
       changes the state of the app is a check that has to be alone,
       which cost three runs of chasing a bar contrast figure that was
       measuring a sheet somebody had left open.

       THE CLAIM IS THE AMBIENT TRICKLE'S, THE OTHER WAY ROUND. That
       field is entirely a property of its own animation: its line has
       no opacity outside the keyframes, so `animation: none` would
       have left a static line at full strength, which is worse than
       absent. Here every keyframe set runs from a partial state TO the
       element's natural one, so switching them off has to leave four
       finished pictures rather than a caret at zero opacity, three
       bars scaled to nothing and a sheet parked below the page.

       Read off COMPUTED values rather than the keyframes: a scene is
       complete or it is not, and the declaration cannot say which. */
    const rctx = await browser.newContext(
      Object.assign({}, PHONE, { reducedMotion: 'reduce' }));
    const rpage = await rctx.newPage();
    await rpage.addInitScript(() => {
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
      localStorage.removeItem('sched.tour.v1');
    });
    await rpage.goto(`${BASE}/schedule/`, { waitUntil: 'networkidle' });
    await rpage.waitForTimeout(420);
    const rest = await rpage.evaluate(() => {
      const bad = [];
      let n = 0, anim = 0;
      document.querySelectorAll('.tr-slide').forEach((s) => {
        s.querySelectorAll('.tr-ic svg *').forEach((e) => {
          anim += e.getAnimations().length;
          const cs = getComputedStyle(e);
          n++;
          /* A hidden mark, a mark scaled away, and a mark parked off
             its own position are the three ways a keyframe set leaves
             a hole when it stops running. */
          if (+cs.opacity < .25) bad.push([s.dataset.card, 'opacity', cs.opacity]);
          /* ── DECLARED PLACEMENT IS NOT AN ANIMATION'S RESIDUE ──
             `getComputedStyle().transform` merges the SVG `transform`
             ATTRIBUTE, and the crown is placed with one: an outer <g>
             carries translate+scale so the inner one is free to
             animate, since keyframes naming a transform replace the
             resting position outright. Written without this the check
             reported the crown's own placement as a scene left
             incomplete, which is a check failing on the fix rather
             than on the bug. Only elements whose geometry comes from
             CSS alone are asked where they are. */
          if (e.hasAttribute('transform')) return;
          const m = new DOMMatrix(cs.transform === 'none' ? '' : cs.transform);
          if (Math.abs(m.a) < .6 || Math.abs(m.d) < .6)
            bad.push([s.dataset.card, 'scale', m.a, m.d]);
          if (Math.abs(m.e) > 1.5 || Math.abs(m.f) > 1.5)
            bad.push([s.dataset.card, 'offset', m.e, m.f]);
        });
      });
      return { n, anim, bad };
    });
    ok(`reduced motion stops all four scenes (${rest.n} marks)`,
      rest.n > 20 && rest.anim === 0, rest);
    ok('...and leaves every one of them complete', rest.bad.length === 0,
      rest.bad);
    await rctx.close();
  }

  /* ═══════════════════════════════════════════════════════════
     A LONG DAY SCROLLS

     Reported as "if I have multiple things on a day, it doesn't allow
     me to scroll downwards and go through everything", and it was
     exactly that. Inside `preserve-3d` the day card's two faces
     overlap exactly, and the one turned AWAY was taking the touch. The
     box was a real scroller throughout — `overflow-y: auto`, a
     scrollHeight 260px past its own clientHeight, and a script writing
     `scrollTop` moved it perfectly — so every property this suite
     could have read was correct while a finger did nothing.

     Which is why this drives a REAL TOUCH DRAG through CDP. A wheel is
     not the gesture that broke, and reading the computed overflow
     would have passed on the shipped bug every time.
     ═══════════════════════════════════════════════════════════ */
  {
    const sctx = await browser.newContext(PHONE);
    const spage = await sctx.newPage();
    const serrs = [];
    spage.on('pageerror', (e) => serrs.push(String(e)));
    spage.on('console', (m) => { if (m.type() === 'error') serrs.push(m.text()); });
    const cdp = await sctx.newCDPSession(spage);

    const heavy = (n) => spage.addInitScript((rows) => {
      localStorage.setItem('sched.tour.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.view.v1', 'list');
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
      const names = ['Wake', 'Train', 'Shower', 'Commute', 'Work', 'Coffee',
                     'Meeting', 'Lunch', 'Work', 'Walk', 'Shop', 'Cook',
                     'Read', 'Down'].slice(0, rows);
      const items = []; let id = 1;
      for (let d = 0; d < 7; d++) {
        let t = 360;
        for (const nm of names) {
          items.push({ id: 'b' + (id++), d, s: t, e: t + 45, r: '', n: nm });
          t += 60;
        }
      }
      localStorage.setItem('sched.v1',
        JSON.stringify({ title: 'Daily Process', items }));
    }, n);

    /* A finger, not a wheel: sixty pixels a frame up the middle of the
       card, which is what a thumb does and what the bug refused. */
    const dragUp = async (sel) => {
      const b = await spage.evaluate((s) => {
        const c = document.querySelector(s);
        c.scrollTop = 0;
        const r = c.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2),
                 y0: Math.round(r.y + r.height * 0.8),
                 y1: Math.round(r.y + r.height * 0.2) };
      }, sel);
      await cdp.send('Input.dispatchTouchEvent',
        { type: 'touchStart', touchPoints: [{ x: b.x, y: b.y0 }] });
      for (let i = 1; i <= 12; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove',
          touchPoints: [{ x: b.x, y: Math.round(b.y0 + (b.y1 - b.y0) * i / 12) }] });
        await spage.waitForTimeout(16);
      }
      await cdp.send('Input.dispatchTouchEvent',
        { type: 'touchEnd', touchPoints: [] });
      await spage.waitForTimeout(450);
      return spage.evaluate((s) => {
        const c = document.querySelector(s);
        return { top: c.scrollTop, max: c.scrollHeight - c.clientHeight };
      }, sel);
    };

    await heavy(14);
    await spage.goto(`${BASE}/schedule/`, { waitUntil: 'networkidle' });
    await spage.waitForTimeout(650);

    /* ── THE CONTROL COMES FIRST ──
       A plain scroller dropped on the same page, dragged the same way.
       Without it a zero here is indistinguishable from a harness that
       cannot dispatch a scrolling touch at all, and this whole section
       would pass or fail for reasons that have nothing to do with the
       app. It measured 124px while the day card measured 0. */
    await spage.evaluate(() => {
      const d = document.createElement('div');
      d.id = 'ctl';
      d.style.cssText = 'position:fixed;left:10px;top:200px;width:200px;'
        + 'height:200px;overflow-y:auto;z-index:99';
      d.innerHTML = '<div style="height:900px"></div>';
      document.body.appendChild(d);
    });
    const ctl = await dragUp('#ctl');
    await spage.evaluate(() => document.getElementById('ctl').remove());
    ok(`a touch drag scrolls a plain box in this browser (${ctl.top}px)`,
      ctl.top > 60, ctl);

    const long = await dragUp('.day-card');
    ok(`...and it scrolls a day with fourteen blocks on it `
      + `(${long.top} of ${long.max}px)`,
      long.max > 100 && long.top >= Math.min(long.max - 2, 300), long);

    /* ── THERE IS NO FACE TURNED AWAY ANY MORE ──
       This whole section was about a long day that would not scroll:
       the two faces of the day panel overlapped exactly, and inside
       `preserve-3d` the one turned AWAY was taking the touch —
       `backface-visibility: hidden` stops a face being drawn and does
       not stop it being hit. Four other fixes were built first and all
       four measured 0px; the answer was to put the turned-away face
       away.

       The objectives are a sheet now, so there is no second face to
       take the gesture and the fix is not a fix any more, it is an
       absence. What survives is the MEASUREMENT that found it: a real
       touch drag through CDP, against a control scroller on the same
       page, because a zero is otherwise indistinguishable from a
       harness that cannot dispatch a scrolling touch at all.

       Asserted round the sheet as well as at rest: opening one over
       the week and closing it must leave the card scrolling, which is
       the same round trip the turn used to make. */
    await openObj(spage);
    const overlay = await spage.evaluate(() => {
      const s = document.getElementById('scSheet');
      const c = document.querySelector('.day-card');
      return { sheet: !!s && s.getBoundingClientRect().height > 100,
               faces: document.querySelectorAll('.wk-front, .wk-back, .wk-flip').length
                    - document.querySelectorAll('#scSheetBody .wk-back').length,
               cardStill: !!c && c.getBoundingClientRect().height > 100 };
    });
    ok('the objectives open over the day rather than turning it over',
      overlay.sheet && overlay.faces === 0 && overlay.cardStill, overlay);
    await spage.keyboard.press('Escape');
    await spage.waitForTimeout(560);

    /* Still scrolls after a round trip, which is what the timer and
       the transitionend between them are for. */
    const after = await dragUp('.day-card');
    ok(`...and the card still scrolls after a turn there and back `
      + `(${after.top}px)`, after.top >= Math.min(after.max - 2, 300), after);

    /* ── A CARD WITH MORE UNDER THE FOLD SAYS SO ──
       The scrollbar is hidden, so the fix made those rows reachable
       without making them findable: the last one is cut clean at the
       edge and the card simply looks like it ends. Measured as the
       DIFFERENCE the mask makes to real pixels rather than as a class
       being present — a class is exactly what a mask that has stopped
       applying still has. */
    /* THE CONTENT IS PUT IN THE FADE, not hoped into it. At scrollTop 0
       the last drawn row happened to end 22px above the card's foot,
       so the whole 38px fade zone held nothing but the gap before the
       next row — both readings came back as bare card, 6 against 6,
       and the failure blamed the mask for a sample that never had
       anything to measure. Which row lands there is decided by row
       HEIGHT, and a row's height changes with whether its time is
       drawn, which changes with how much of today is behind you: it
       passed for months and broke when a container's clock rolled
       past midnight and nothing was past any more.

       Scrolled so the first row reaching into the zone has its bottom
       6px above the card's, which puts its two lines inside the fade
       at any row height and at any hour. */
    await spage.evaluate(() => {
      const c = document.querySelector('.day-card');
      c.scrollTop = 0;
      const cb = c.getBoundingClientRect().bottom;
      const next = [...c.querySelectorAll('.row[data-id]')]
        .find((r) => r.getBoundingClientRect().bottom > cb - 6);
      if (next) c.scrollTop += next.getBoundingClientRect().bottom - (cb - 6);
    });
    await spage.waitForTimeout(200);
    const foot = await spage.evaluate(() => {
      const r = document.querySelector('.day-card')
        .getBoundingClientRect();
      return { x: r.x, w: r.width, bot: r.bottom };
    });
    const brightest = async () => {
      const png = PNG.sync.read(await spage.screenshot());
      const at = (x, y) => { const i = (png.width * Math.round(y * dpr)
        + Math.round(x * dpr)) << 2;
        return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
      /* A BAND, not one line. It read a single row of pixels 26px up
         from the foot, which lands on a word only if the rows sit
         where they sat the day it was written — and a row's height
         changes with whether its time is drawn, which changes with
         how much of today is behind you. Run in the small hours, with
         nothing past and every row therefore taller, the line fell in
         the gap BETWEEN two rows and both readings came back as bare
         card: 6 against 6, which fails while saying nothing about the
         mask. The faded zone is 38px, so the band is scanned and the
         brightest thing in it is the mark. */
      /* DEEP in the fade, where it actually bites. The zone is 38px and
         the mask ramps across it — measured on this fixture the same
         line reads 255 unmasked, 240 at bot-36 and 161 at bot-24, so
         a band that starts at the top of the ramp measures the mask
         at its weakest and reports a difference of forty-odd on a
         mask that is plainly working. */
      let best = 0;
      for (let y = foot.bot - 28; y <= foot.bot - 14; y += 2) {
        for (let x = foot.x + 8; x < foot.x + foot.w - 8; x += 1) {
          const p = at(x, y);
          const L = .2126 * p[0] + .7152 * p[1] + .0722 * p[2];
          if (L > best) best = L;
        }
      }
      return best;
    };
    const withMask = await brightest();
    await spage.addStyleTag({ content: '.day-card.has-more{mask-image:none'
      + ' !important;-webkit-mask-image:none !important}' });
    await spage.waitForTimeout(150);
    const without = await brightest();
    /* The unmasked reading has to be BRIGHT before the difference means
       anything. A fixture with nothing under the fold gives two dark
       numbers 0 apart, and the message would then blame the mask for
       a fixture that never overflowed — so say which of the two is
       actually wrong. */
    ok(`there is something under the fold to fade (${without.toFixed(0)})`,
      without > 60, { withMask, without });
    /* A RATIO, not a difference: what the band lands on changed with
       the row's height (a pill line at 180 rather than a name at 255),
       and the mask takes the same share off either. Removing the mask
       reads 1.0. */
    ok(`the foot of an overflowing card is faded `
      + `(${withMask.toFixed(0)} against ${without.toFixed(0)} unmasked)`,
      withMask < without * .87, { withMask, without });

    /* And a day that fits carries no fade at all: a soft edge over
       nothing says there is more when there is not, which is the same
       lie the other way round. */
    await spage.evaluate(() => localStorage.removeItem('sched.v1'));
    await heavy(4);
    await spage.reload({ waitUntil: 'networkidle' });
    await spage.waitForTimeout(650);
    const shortDay = await spage.evaluate(() => {
      const c = document.querySelector('.day-card');
      return { over: c.scrollHeight - c.clientHeight,
               has: c.classList.contains('has-more') };
    });
    ok('a day that fits has no fade on it', !shortDay.has
      && shortDay.over <= 4, shortDay);

    ok('nothing threw anywhere on a long day', serrs.length === 0, serrs);
    await sctx.close();
  }

  /* ═══════════════════════════════════════════════════════════════
     THE LIGHT FACE
     Craft ships in two: the mode follows the device unless a chip
     says otherwise, and every token above has a light twin. The
     whole file up to here ran on a dark phone; this is the other
     phone, and it is its own context because a mode is decided at
     boot. ═════════════════════════════════════════════════════════ */
  console.log('\n── the light face ──');
  {
    const lctx = await browser.newContext({ ...PHONE, colorScheme: 'light' });
    const lpage = await lctx.newPage();
    const lerrs = [];
    lpage.on('pageerror', (e) => lerrs.push(String(e)));
    await lpage.addInitScript(([w, nowhere]) => {
      if (!localStorage.getItem('sched.v1')) {
        localStorage.setItem('sched.v1', JSON.stringify(w));
      }
      if (!localStorage.getItem('sched.net.v1')) {
        localStorage.setItem('sched.net.v1', JSON.stringify({
          url: nowhere, code: '', key: '', name: '', pic: '', on: false }));
      }
      if (!localStorage.getItem('sched.tour.v1')) {
        localStorage.setItem('sched.tour.v1', '1');
        localStorage.setItem('sched.hint2.v1', '1');
        localStorage.setItem('sched.hintw.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      /* AND THE GESTURE CARD, for the intro's own reason: it comes up
         over Showing up on a first visit, dims the whole app behind it
         and takes every press. Left unset, half this file would be
         measuring pixels through a 62% wash and clicking a surface
         rather than a tile. The section that is about it clears the
         key and reloads. */
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
      }
    }, [WEEK, `${BASE}/schedule/nofriends`]);
    await lpage.route(`${BASE}/schedule/nofriends/**`, (route) => route.fulfill({
      status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    await lpage.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await lpage.waitForTimeout(300);

    const face = () => lpage.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return { mode: document.documentElement.dataset.mode,
        key: localStorage.getItem('sched.mode.v1'),
        paper: cs.getPropertyValue('--paper').trim().toLowerCase(),
        ink: cs.getPropertyValue('--ink').trim().toLowerCase(),
        red: cs.getPropertyValue('--red').trim().toLowerCase(),
        scheme: cs.colorScheme };
    });
    const auto = await face();
    ok('with nothing stored the app follows the device, and this one is light',
      auto.mode === 'light' && auto.key === null && auto.paper === '#f7f7f9'
      && auto.ink === '#1a1a1f' && auto.scheme === 'light', auto);

    /* The wheel solves against the light ground here, so the accent
       is a DIFFERENT colour from the dark face's at the same angle. */
    const lum = (c) => {
      const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
      return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]);
    };
    const ratioL = (a, b) => { const x = lum(a), y = lum(b);
      return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    const hexL = (h) => h.replace('#', '').match(/\w\w/g).map((x) => parseInt(x, 16));
    ok('...and the accent is solved for THIS ground, not the dark one',
      auto.red !== '#897eff' && ratioL(hexL(auto.red), hexL(auto.paper)) >= 6,
      { red: auto.red, ratio: ratioL(hexL(auto.red), hexL(auto.paper)).toFixed(2) });

    const worst = [];
    for (const h of [0, 40, 60, 124, 200, 284, 330]) {
      await lpage.evaluate((x) => localStorage.setItem('sched.accent.v1', String(x)), h);
      await lpage.reload({ waitUntil: 'networkidle' });
      await lpage.waitForTimeout(200);
      const f = await face();
      worst.push({ h, red: f.red, r: +ratioL(hexL(f.red), hexL(f.paper)).toFixed(2) });
    }
    ok(`every hue tried clears 6:1 on the light page (worst ${Math.min(...worst.map((w) => w.r))}:1)`,
      worst.every((w) => w.r >= 5.95), worst);
    await lpage.evaluate(() => localStorage.removeItem('sched.accent.v1'));

    /* The rows are cards a step lighter than the page; the words are
       read against the CARD, on composited pixels. */
    await lpage.reload({ waitUntil: 'networkidle' });
    await lpage.waitForTimeout(400);
    /* ── A DAY THAT CANNOT BE BEHIND YOU ──
       This read `.row[data-id]:not(.is-past)` off whatever day was
       drawn, which is TODAY — and `is-past` is set on today's rows
       alone. Run after the last block of the seeded week the selector
       matched nothing and the next line took the whole file down with
       it, forty assertions before the end, on a page that was in no
       way broken. It failed on the CLOCK: green all day and a crash
       after 23:00.

       This file has now written that lesson down three times, and the
       answer is the same one every time — measure a day the hour
       cannot reach. Tuesday's card has no past row by construction,
       whatever time it is. */
    await lpage.evaluate(() => {
      const b = [...document.querySelectorAll('.st-d')]
        .find((x) => x.dataset.d === '2');
      if (!b) throw new Error('no chip for Tuesday');
      b.click();
    });
    await lpage.waitForTimeout(220);
    const rowInk = await lpage.evaluate(() => {
      const r = document.querySelector('.row[data-id]:not(.is-past)');
      if (!r) throw new Error('no un-elapsed row on the day that was pressed');
      const b = r.getBoundingClientRect();
      const cs = getComputedStyle(document.documentElement);
      const t = r.querySelector('.t');
      return { x: b.right - 6, y: b.top + b.height / 2,
        ink: getComputedStyle(r.querySelector('.n')).color,
        dim: t ? getComputedStyle(t).color : null,
        tokenDim: cs.getPropertyValue('--dim').trim() };
    });
    const { PNG: PNGL } = require('pngjs');
    const dprL = 2;
    const lpng = PNGL.sync.read(await lpage.screenshot());
    const lAt = (x, y) => { const i = (lpng.width * Math.round(y * dprL)
      + Math.round(x * dprL)) << 2;
      return [lpng.data[i], lpng.data[i + 1], lpng.data[i + 2]]; };
    const cardPx = lAt(rowInk.x, rowInk.y);
    const rgbL = (str) => str.match(/[\d.]+/g).slice(0, 3).map(Number);
    ok(`a name clears 7:1 on its card (${ratioL(rgbL(rowInk.ink), cardPx).toFixed(2)}:1)`,
      ratioL(rgbL(rowInk.ink), cardPx) >= 7, { rowInk, cardPx });
    ok(`and a pill's figure clears 4.5:1 there (${rowInk.dim
      ? ratioL(rgbL(rowInk.dim), cardPx).toFixed(2) : 'no time drawn'}:1)`,
      rowInk.dim !== null && ratioL(rgbL(rowInk.dim), cardPx) >= 4.5, { rowInk, cardPx });

    /* THE CHIP BEATS THE DEVICE. */
    await lpage.evaluate(() => localStorage.setItem('sched.mode.v1', 'dark'));
    await lpage.reload({ waitUntil: 'networkidle' });
    await lpage.waitForTimeout(300);
    const forced = await face();
    ok('a stored dark beats a light device',
      forced.mode === 'dark' && forced.paper === '#0c0c0e' && forced.scheme === 'dark', forced);
    await lpage.evaluate(() => localStorage.setItem('sched.mode.v1', 'sepia'));
    await lpage.reload({ waitUntil: 'networkidle' });
    await lpage.waitForTimeout(300);
    const junk = await face();
    ok('and a stored mode this build does not have falls back to the device',
      junk.mode === 'light' && junk.paper === '#f7f7f9', junk);

    /* THE STYLESHEET'S LIGHT COPY IS THE SCRIPT'S, token for token.
       app.css carries both faces for the first paint and app.js carries
       both sets for every paint after it; the two are the one thing in
       this app written down twice, and this holds the light pair the
       way the wheel check above holds the dark one. */
    const fsL = require('fs'), pathL = require('path');
    const cssText = fsL.readFileSync(pathL.join(__dirname, '..', 'schedule', 'app.css'), 'utf8');
    const jsText = fsL.readFileSync(pathL.join(__dirname, '..', 'schedule', 'app.js'), 'utf8');
    const lightCss = (cssText.match(/:root\[data-mode="light"\]\s*\{([^}]*)\}/) || ['', ''])[1];
    const cssTok = {};
    lightCss.replace(/(--[\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { cssTok[k] = v.trim().replace(/\s/g, '').toLowerCase(); });
    const lightJs = (jsText.match(/var LIGHT_SET = \{([\s\S]*?)\};/) || ['', ''])[1];
    const jsTok = {};
    lightJs.replace(/'(--[\w-]+)':\s*'([^']*)'/g, (m, k, v) => { jsTok[k] = v.trim().replace(/\s/g, '').toLowerCase(); });
    const drift = Object.keys(jsTok).filter((k) => cssTok[k] !== jsTok[k])
      .map((k) => k + ': css ' + cssTok[k] + ' / js ' + jsTok[k]);
    ok(`the stylesheet's light face is the script's, token for token (${Object.keys(jsTok).length} tokens)`,
      Object.keys(jsTok).length >= 20 && drift.length === 0, drift);

    /* ── AND THE TAGS ON THE LIGHT FACE ──
       Nine hexes a face and the dark one is measured up in the main
       run; a colour that clears on black can fail on paper, which is
       the whole reason there are two sets. Measured the same way, on
       the ground the tag actually sits on, with the ring composited
       over it because it carries an alpha. */
    const ltags = await lpage.evaluate(() => {
      const chan = (s) => {
        const n = (s.match(/[\d.]+/g) || []).map(Number);
        const c = /^color\(/.test(s) ? n.slice(0, 3).map((v) => Math.round(v * 255))
                                     : n.slice(0, 3);
        return { c, a: n.length > 3 ? n[3] : 1 };
      };
      const over = (fg, bg) => fg.c.map((v, i) => Math.round(v * fg.a + bg.c[i] * (1 - fg.a)));
      const g = chan(getComputedStyle(document.body).backgroundColor);
      return [...document.querySelectorAll('.wk-sh b')].map((e) => {
        const cs = getComputedStyle(e);
        /* Against the tag's OWN fill, and the fill against what is
           behind it — the same walk the dark face does. A deep hue at
           22% over a near-white card is a different ground from the
           same wash over a near-black one, and 22 was solved to clear
           4.5:1 on both. */
        let bg = g, p = e.parentElement;
        while (p) {
          const c = chan(getComputedStyle(p).backgroundColor);
          if (c.a > 0) { bg = { c: over(c, g), a: 1 }; break; }
          p = p.parentElement;
        }
        const fill = { c: over(chan(cs.backgroundColor), bg), a: 1 };
        return { w: e.textContent, label: over(chan(cs.color), fill), on: fill.c };
      });
    });
    const lLow = ltags.reduce((a, x) => Math.min(a, ratio(x.label, x.on)), 99);
    ok(`the light face's tags read too (label ${lLow.toFixed(2)}:1 on its own fill)`,
      ltags.length >= 2 && lLow >= 4.5,
      ltags.map((x) => x.w + ' ' + ratio(x.label, x.on).toFixed(2)));

    /* ── AND THE SWATCHES ARE GONE FROM HERE TOO ──
       Eight pairs were measured on this face, which is where the
       one-set-for-both mistake was caught: a chip bright enough to
       stand off a near-black page is about 2:1 against a white one.
       There is no row to press any more — the avatar is a silhouette
       in the flat neutral and nobody chooses a colour — so the check
       has no subject.

       WHAT IT WAS FOR IS ASSERTED INSTEAD: the face has to read on
       THIS face as well, and it is the one drawing that changed. The
       lesson the swatches taught is that the light face is the one
       nobody develops on and therefore the one that breaks. */
    const lface = await lpage.evaluate(() => {
      const L = (c) => { const v = c.map((x) => x / 255)
        .map((x) => x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4));
        return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
      const R = (a2, b2) => (Math.max(L(a2), L(b2)) + .05) / (Math.min(L(a2), L(b2)) + .05);
      const num = (t) => (t.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const paint = (h) => { const d = document.createElement('div');
        d.style.color = h; document.body.appendChild(d);
        const c = num(getComputedStyle(d).color); d.remove(); return c; };
      const sv = document.querySelector('#scTabFace svg');
      if (!sv) throw new Error('no face on the light page to measure');
      return { fig: R(paint(sv.querySelector('circle').getAttribute('fill')),
                      paint(sv.querySelector('rect').getAttribute('fill'))),
               marks: sv.querySelectorAll('circle, path').length };
    });
    ok(`the silhouette reads on the light face too (${lface.fig.toFixed(2)}:1)`,
      lface.fig >= 3 && lface.marks === 2, lface);
    /* ON SETTINGS, or the count is measured on a screen that never
       had a row and passes for it — which is exactly the vacuous
       check this file keeps having to catch. The sheet is asserted to
       have its other rows, so "no swatches" cannot pass on a sheet
       that failed to build. */
    await lpage.evaluate(() => document.getElementById('scTabYou').click());
    await lpage.waitForTimeout(420);
    const lset = await lpage.evaluate(() => ({
      rows: document.querySelectorAll('.pk-row').length,
      items: document.querySelectorAll('.sheet .menu-item').length }));
    ok('...and Settings on this face carries no swatches either',
      lset.rows === 0 && lset.items > 0, lset);
    await lpage.keyboard.press('Escape');
    await lpage.waitForTimeout(360);

    ok('nothing threw on the light face', lerrs.length === 0, lerrs);
    await lctx.close();
  }

  /* ══════════════════════════════════════════════════════
     HABITS OF YOUR OWN

     IN ITS OWN CONTEXT, because it writes a list that every other
     assertion about the tally counts against — a seventh tile would
     turn "0 of 6 today" into "0 of 7" four hundred lines above. */
  {
    console.log('\n── habits of your own ──');
    const hctx = await browser.newContext({ ...PHONE });
    const hp = await hctx.newPage();
    const herrs = [];
    hp.on('pageerror', (e) => herrs.push(String(e)));
    await hp.addInitScript(() => {
      ['sched.tour.v1', 'sched.hint2.v1', 'sched.hintw.v1']
        .forEach((k) => localStorage.setItem(k, '1'));
      localStorage.setItem('sched.view.v1', 'tally');
      localStorage.setItem('sched.ty.v1', 'up');
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
    });
    await hp.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await hp.waitForTimeout(500);

    /* ── THE WAY IN IS ON THE GRID, NOT IN THE BAR ──
       The bar holds three tabs and an add button at 390px, and a
       fourth would be the control that made the row too tight to
       press. */
    ok('the way in is the last thing on the grid',
      await hp.evaluate(() => {
        const a = document.querySelector('.ty-add');
        const g = document.querySelector('.ty-grid');
        return !!a && a === g.lastElementChild && /Add a habit/.test(a.textContent);
      }));

    await hp.click('.ty-add');
    await hp.waitForTimeout(500);
    /* ── ONE FIELD, AND NOTHING ELSE IS ASKED ──
       No preset list, which was decided rather than skipped: a grid of
       ready habits is the fastest way in and it tells you what to care
       about, which is the opposite of how the six were chosen. */
    const made = await hp.evaluate(() => ({
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      fields: document.querySelectorAll('.sheet input[type=text]').length,
      other: document.querySelectorAll('.sheet input:not([type=text]), .sheet textarea').length,
    }));
    ok('making one is a single field and no other question',
      made.title === 'New habit' && made.fields === 1 && made.other === 0, made);

    /* ── THE KIND COMES FROM THE NAME ──
       The same read a block's glyph already comes from, so
       "Journaling" is minutes and "Charting" is a number with nothing
       to pick. Three names and three different answers, because two
       that agreed would pass on a build that always says the same
       thing. */
    const guessed = [];
    for (const w of ['Journaling', 'Charting', 'Cold plunge']) {
      await hp.fill('.sheet input[type=text]', '');
      await hp.type('.sheet input[type=text]', w, { delay: 12 });
      await hp.waitForTimeout(220);
      guessed.push(await hp.evaluate(() => ({
        on: (document.querySelector('.hb-k.on') || {}).textContent,
        go: (document.querySelector('.sheet .btn.go') || {}).textContent,
      })));
    }
    ok('the kind is worked out from the name, and it is not one answer for all',
      guessed[0].on === 'Minutes' && guessed[1].on === 'A number'
      && guessed[2].on === 'A tick'
      && guessed[2].go === 'Add Cold plunge', guessed);

    /* ── AND CORRECTING IT STICKS ──
       The guess only moves while you have not said otherwise: once you
       have, typing on must not undo you. */
    await hp.click('.hb-k >> nth=1');
    await hp.waitForTimeout(150);
    await hp.type('.sheet input[type=text]', ' daily', { delay: 15 });
    await hp.waitForTimeout(220);
    ok('...and correcting it survives typing on',
      await hp.evaluate(() =>
        (document.querySelector('.hb-k.on') || {}).textContent === 'A number'));

    await hp.fill('.sheet input[type=text]', 'Cold plunge');
    await hp.waitForTimeout(200);
    await hp.click('.hb-k >> nth=0');
    await hp.waitForTimeout(150);
    await hp.click('.sheet .btn.go');
    await hp.waitForTimeout(700);
    const added = await hp.evaluate(() => ({
      stored: JSON.parse(localStorage.getItem('sched.habit.v1') || '[]'),
      names: [...document.querySelectorAll('.ty-card .ty-nm')].map((x) => x.textContent),
      cap: document.getElementById('scTallyCap').textContent,
    }));
    /* THE COUNT SAYS HOW MANY YOU HAVE, not a constant. Adding one
       makes today harder, and a figure that still said "of 6" would be
       the screen lying about what it is counting. */
    ok('adding one puts it on the grid and in the count',
      added.stored.length === 1 && added.stored[0].n === 'Cold plunge'
      && added.stored[0].k === 'do' && /^x/.test(added.stored[0].id)
      && added.names[6] === 'Cold plunge' && /of 7 today/.test(added.cap), added);

    /* ── AND IT LOGS LIKE ANY OTHER ──
       A tick ticks on one tap; a number opens the sheet that asks for
       one. Neither needed a branch — a habit of yours is a row of the
       same shape, which is the whole reason this was affordable. */
    await hp.click('.ty-card[data-item="x1"]');
    await hp.waitForTimeout(700);
    const ticked = await hp.evaluate(() => {
      const d = new Date();
      const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
        + '-' + String(d.getDate()).padStart(2, '0');
      return { rec: (JSON.parse(localStorage.getItem('sched.tick.v1') || '{}')[k] || {}).x1,
               sheet: !document.getElementById('scSheet').hidden,
               cap: document.getElementById('scTallyCap').textContent };
    });
    ok('a tick of yours ticks on one tap, and opens nothing',
      ticked.rec === 1 && !ticked.sheet && /^1 of 7/.test(ticked.cap), ticked);

    /* A second one, a number, to prove the kind decides the door. */
    await hp.evaluate(() => {
      const h = JSON.parse(localStorage.getItem('sched.habit.v1'));
      h.push({ id: 'x2', n: 'Charting', k: 'num', unit: 'R',
               hue: '--w-teal', neg: 1, aim: 0, cnt: 1 });
      localStorage.setItem('sched.habit.v1', JSON.stringify(h));
    });
    await hp.reload({ waitUntil: 'networkidle' });
    await hp.waitForTimeout(600);
    await hp.click('.ty-card[data-item="x2"]');
    await hp.waitForTimeout(700);
    ok('...and a number of yours opens the sheet that asks for one',
      await hp.evaluate(() => !document.getElementById('scSheet').hidden
        && (document.getElementById('scSheetTitle') || {}).textContent === 'Charting'));
    await hp.keyboard.press('Escape');
    await hp.waitForTimeout(420);

    /* ── NO TWO HABITS SHARE A SILHOUETTE ──
       "Two glyphs with one silhouette is worse than a glyph missing,
       because the row is then confidently wrong" — and the first cut
       drew Cold plunge and Charting with the same mark, because the
       keyword table knew `chart` and the name was `charting`. */
    const glyphs = await hp.evaluate(() =>
      [...document.querySelectorAll('.ty-card .ic')].map((x) => x.innerHTML));
    ok('no two tiles on the grid draw the same glyph',
      glyphs.length === 8 && new Set(glyphs).size === 8,
      { n: glyphs.length, distinct: new Set(glyphs).size });

    /* ── EVERYTHING ELSE IS LATER, AND ONLY FOR YOURS ──
       The six cannot be edited: each has a made thing behind it and
       nothing about them is a setting. Both directions, because "there
       is a way in" passes on a build that offers it everywhere. */
    await hp.evaluate(() => document.querySelector('.ty-hist[aria-label*="Cold plunge"]').click());
    await hp.waitForTimeout(600);
    ok('a habit of yours can be changed from its own record',
      await hp.evaluate(() => !!document.querySelector('.ty-edit')));
    await hp.keyboard.press('Escape');
    await hp.waitForTimeout(420);
    await hp.evaluate(() => document.querySelector('.ty-hist[aria-label*="Steps"]').click());
    await hp.waitForTimeout(600);
    ok('...and one of the six cannot, because none of it is a setting',
      await hp.evaluate(() => document.querySelectorAll('.ty-edit').length === 0));
    await hp.keyboard.press('Escape');
    await hp.waitForTimeout(420);

    /* ── TAKING ONE OFF KEEPS THE DAYS ──
       The habit goes; every day you logged on it stays where it is.
       That is this app's oldest rule about a record — the days are
       what you cannot get back — and it costs nothing here, because
       the tick log is keyed by id and simply stops being read. */
    await hp.evaluate(() => document.querySelector('.ty-hist[aria-label*="Cold plunge"]').click());
    await hp.waitForTimeout(600);
    await hp.click('.ty-edit');
    await hp.waitForTimeout(600);
    await hp.click('.sheet .menu-item.bad');
    await hp.waitForTimeout(700);
    const gone = await hp.evaluate(() => {
      const d = new Date();
      const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
        + '-' + String(d.getDate()).padStart(2, '0');
      return {
        left: JSON.parse(localStorage.getItem('sched.habit.v1') || '[]').map((h) => h.n),
        days: (JSON.parse(localStorage.getItem('sched.tick.v1') || '{}')[k] || {}).x1,
        names: [...document.querySelectorAll('.ty-card .ty-nm')].map((x) => x.textContent),
      };
    });
    ok('taking one off removes the habit and keeps every day you logged',
      gone.left.join() === 'Charting' && gone.days === 1
      && gone.names.indexOf('Cold plunge') < 0, gone);

    /* ── A DAMAGED ONE IS DROPPED AND THE REST SURVIVE ──
       Asserted as the good one SURVIVING rather than the bad one being
       refused: rejecting the whole list passes any check written the
       other way round, and the list is a year of somebody's habits. */
    await hp.evaluate(() => {
      localStorage.setItem('sched.habit.v1', JSON.stringify([
        { id: 'x2', n: 'Charting', k: 'num', unit: 'R', hue: '--w-teal' },
        { id: '', n: 'No id' }, { id: 'x9' }, 'not an object',
        { id: 'x8', n: 'Odd kind', k: 'seance' }]));
    });
    await hp.reload({ waitUntil: 'networkidle' });
    await hp.waitForTimeout(600);
    ok('a damaged habit is dropped and the record is not',
      await hp.evaluate(() => {
        const n = [...document.querySelectorAll('.ty-card .ty-nm')]
          .map((x) => x.textContent);
        const h = JSON.parse(localStorage.getItem('sched.habit.v1') || '[]');
        return n.indexOf('Charting') >= 0 && n.indexOf('Odd kind') >= 0
          && n.length === 8 && h.length === 5;
      }));
    /* An unknown kind falls to a TICK, which is the safe end: a tick
       can become a number later and no day is lost either way. */
    ok('...and a kind this build does not have falls through to a tick',
      await hp.evaluate(() => {
        const c = document.querySelector('.ty-card[data-item="x8"]');
        c.click();
        return true;
      }) && await (async () => { await hp.waitForTimeout(700);
        return hp.evaluate(() => document.getElementById('scSheet').hidden); })());

    ok('nothing threw through any of it', herrs.length === 0, herrs);
    await hctx.close();
  }

  /* ── NOTHING IN THIS APP SCROLLS SIDEWAYS ──
     The board was a horizontal scroller of 212px columns, so a third
     session sat off the side of the phone and the first was cut in
     half the moment you moved it. It was reported from the phone with
     "Morning" clipped to "ng" at the left edge, and the rule that came
     out of it is broader than the board: you never move a finger
     sideways to reach anything, because a thing you cannot see is a
     thing you have to go looking for.

     ITS OWN CONTEXT, at the foot of the file. Written into the middle
     of the run it pressed tabs and dismissed sheets, which left the
     next section measuring an edit sheet that was no longer open —
     three failures, none of them about overflow. A check that changes
     the state of the app is a check that has to be alone.

     A SCROLLER, not a clip: `text-overflow: ellipsis` puts scrollWidth
     over clientWidth on every truncated name in the app, so asking
     "is the content wider than the box" flags the whole design. What
     this asks is the one question that means a finger has to move —
     is this a horizontal scroll container with something outside it. */
  {
    const octx = await browser.newContext({ ...PHONE });
    const opage = await octx.newPage();
    const oerrs = [];
    opage.on('pageerror', (e) => oerrs.push(String(e)));
    await opage.addInitScript(([w, nowhere]) => {
      if (!localStorage.getItem('sched.v1')) localStorage.setItem('sched.v1', JSON.stringify(w));
      if (!localStorage.getItem('sched.net.v1')) {
        localStorage.setItem('sched.net.v1', JSON.stringify({
          url: nowhere, code: '', key: '', name: '', pic: '', on: false }));
      }
      if (!localStorage.getItem('sched.tour.v1')) localStorage.setItem('sched.tour.v1', '1');
      if (!localStorage.getItem('sched.hint2.v1')) localStorage.setItem('sched.hint2.v1', '1');
      if (!localStorage.getItem('sched.hintw.v1')) localStorage.setItem('sched.hintw.v1', '1');
    }, [WEEK, `${BASE}/schedule/nofriends`]);
    await opage.route(`${BASE}/schedule/nofriends/**`, (route) => route.fulfill({
      status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    await opage.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await opage.waitForTimeout(420);

    const scan = () => opage.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll('body *')) {
        if (e.getClientRects().length === 0) continue;
        const ox = getComputedStyle(e).overflowX;
        if (ox !== 'auto' && ox !== 'scroll') continue;
        const over = e.scrollWidth - e.clientWidth;
        if (over > 1) out.push((e.className || e.tagName) + ' +' + over);
      }
      return { over: out.slice(0, 6),
               doc: document.scrollingElement.scrollWidth
                  - document.scrollingElement.clientWidth };
    });

    const wide = [];
    /* Every view, because the app puts a screen away with `hidden` and
       an element that is not laid out reports nothing at all — a check
       that only visited the week would pass on a Today pane three
       columns wide. */
    for (const [name, sel] of [['week', '#scTabWeek'], ['today', '#scTabTally'],
                               ['friends', '#scTabFriends']]) {
      const hit = await opage.evaluate((s) => {
        const b = document.querySelector(s);
        if (!b) return false;
        b.click();
        return true;
      }, sel);
      if (!hit) { wide.push([name, 'NO TAB']); continue; }
      await opage.waitForTimeout(460);
      const found = await scan();
      if (found.over.length || found.doc > 1) wide.push([name, found]);
    }
    ok('no view scrolls sideways, and nothing on one is a scroller with more outside it',
      wide.length === 0, wide);

    /* ── AND THERE IS NO BOARD TO CHECK, WHICH IS THE POINT ──
       The week's second layout was where the sideways scrolling came
       from, and it is gone rather than fixed: it drew the same rows in
       narrower columns, so it was a second way to look at one thing.
       Asserted as ABSENT — a switcher that merely stopped being drawn
       would still leave the stored key deciding a layout nobody can
       reach, so the key is checked too. */
    const gone = await opage.evaluate(() => {
      localStorage.setItem('sched.wkview.v1', 'board');
      return true;
    });
    await opage.reload({ waitUntil: 'networkidle' });
    await opage.waitForTimeout(460);
    const after = await opage.evaluate(() => ({
      views: document.querySelectorAll('.views, .vw').length,
      board: document.querySelectorAll('.is-board').length,
      key: localStorage.getItem('sched.wkview.v1'),
      cols: (() => { const c = document.querySelector('.day-card');
        return c ? getComputedStyle(c).gridTemplateColumns : null; })(),
      rows: document.querySelectorAll('.day-card .row').length,
    }));
    const stillFits = await scan();
    ok('no view switcher anywhere, and a stored board falls through to the list',
      gone && after.views === 0 && after.board === 0 && after.key === null
      && after.rows > 0, after);
    ok('and the week still scrolls in one direction only',
      stillFits.over.length === 0 && stillFits.doc <= 1, stillFits);

    ok('nothing threw while measuring it', oerrs.length === 0, oerrs);
    await octx.close();
  }

  /* ═══ what you put in your head ═══
     Mind was the one tick on this screen with nothing behind it: a
     Walk or a Read block going green, and then no way to say what you
     read. It is the workout deck's question for a different subject.

     IN ITS OWN CONTEXT, and that is not tidiness. This section is the
     only one in the app that lets a request leave the origin, so it
     counts every request it makes — and it opens sheets and writes a
     record, which is exactly the kind of check that breaks the next
     one if it runs in the middle of the file. */
  {
    console.log('\n── what you put in your head ──');
    const mctx = await browser.newContext({ ...PHONE });
    const mpage = await mctx.newPage();
    const merrs = [];
    mpage.on('pageerror', (e) => merrs.push(String(e)));

    /* ── BOTH THIRD PARTIES ARE STUBBED, AND THAT IS DELIBERATE ──
       A test that hit Open Library would be slow, flaky, and would
       fail on a machine with no network — and it would be measuring
       somebody else's uptime rather than this app. What is asserted
       is the app's half of the contract: WHEN it asks, WHAT it sends,
       and that it still works when the answer never comes. */
    const sent = [];
    await mpage.route('https://openlibrary.org/**', (r) => {
      sent.push(r.request().url());
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ docs: [
          { title: 'Eat That Frog!', author_name: ['Brian Tracy'], cover_i: 1 },
          /* one with NO artwork, so the drawn cover is exercised */
          { title: 'No Excuses!', author_name: ['Brian Tracy'] },
          /* and one missing the field the mapper keys on, which a
             third-party shape is free to do and must not throw */
          { author_name: ['Nobody'] } ] }) });
    });
    /* A 1x1 gif, so a cover that loads logs no console error and the
       image path is genuinely exercised. */
    await mpage.route('https://covers.openlibrary.org/**', (r) => r.fulfill({
      status: 200, contentType: 'image/gif',
      body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') }));
    await mpage.route('https://itunes.apple.com/**', (r) => {
      sent.push(r.request().url());
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ results: [
          { collectionName: 'The Daily Stoic', artistName: 'Ryan Holiday',
            collectionId: 1200361736,
            artworkUrl600: 'https://covers.openlibrary.org/x.jpg' },
          /* one with NO id, which is the case that has to fall back to
             logging the show itself rather than opening an empty level */
          { collectionName: 'No Id Here', artistName: 'Nobody' } ] }) });
    });

    const mAsked = [];
    mpage.on('request', (r) => mAsked.push(r.url()));
    await mpage.addInitScript(() => {
      localStorage.setItem('sched.net.v1', JSON.stringify({ on: false, url: '', code: '' }));
      localStorage.setItem('sched.tour.v1', '1');
      localStorage.setItem('sched.hint2.v1', '1');
      localStorage.setItem('sched.hintw.v1', '1');
    });
    await mpage.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await mpage.waitForTimeout(500);

    const offOrigin = () => mAsked.filter((u) => !u.startsWith(BASE)
      && !u.startsWith('data:') && !u.startsWith('blob:'));

    /* The two jacket shapes are the file's own, at the top: a fixed
       public cover is not a request about you, and a SEARCH is. */
    const leaks = () => offOrigin().filter((u) => !isArt(u));

    /* ── THE TILE IS THE DOOR, AND IT IS THE ONLY ONE ──
       It hung off the tick of a Read or a Walk BLOCK, and that was
       wrong twice: it put a question about your day on a line in a
       timetable, and it could not be reached from the tile at all,
       because the tile's own door refuses when more than one block
       feeds the item and the seeded week feeds Mind from a Walk AND a
       Read. The sheet hangs off the press that says it HAPPENED, so a
       tile already ticked has to be unticked first — written
       idempotently, because which state it is in depends on what the
       assertions above did. */
    const mindTile = () => mpage.evaluate(() => {
      const c = document.querySelector('.ty-card[data-item="m"]');
      if (!c) throw new Error('no Mind tile on Today');
      /* ── READ THE RECORD, NEVER THE WORDS ON THE TILE ──
         This asked whether the tile's text matched any of "logged",
         "Frog", "indexed" or "Kept" — a list of the titles the
         assertions above happened to log. The moment one of them
         filed an episode called something else the helper decided the
         tile was off, pressed once, turned it off, and the sheet
         never opened. An identifier in a fixture is a reference
         nothing type-checks, and the failure is always green until it
         is not. The tick is a record; ask the record. */
      const t = JSON.parse(localStorage.getItem('sched.tick.v1') || '{}');
      const d = new Date();
      const k = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
                 String(d.getDate()).padStart(2, '0')].join('-');
      const was = !!(t[k] && t[k].m);
      c.click();
      return was;
    });
    const openMind = async () => {
      await mpage.click('.tab[data-view="tally"]');
      await mpage.waitForTimeout(460);
      if (await mindTile()) {       /* it was on: that press took it off */
        await mpage.waitForTimeout(460);
        await mindTile();           /* and this one puts it back */
      }
      await mpage.waitForTimeout(640);
    };
    await openMind();

    const sheet = await mpage.evaluate(() => ({
      title: (document.getElementById('scSheetTitle') || {}).textContent,
      kinds: [...document.querySelectorAll('.wc-chips .wc-chip')].map((c) => c.textContent),
      seg: !!document.querySelector('.wc-chips.is-seg'),
      note: document.querySelectorAll('.sheet textarea').length,
      /* ── THE LADDER IS NOT SHOWN YET ──
         It used to sit above the note on every visit, which read as
         one control too many on a screen meant to be a tap and a
         sentence. It is asked for now, on the press that means it. */
      rungs: document.querySelectorAll('.wc-min').length,
      /* ── SEARCH, THE SAME WORD FOR EVERY KIND ──
         The label and the placeholder used to name the kind: "Which
         book" over a field reading "Eat That Frog…". Both read as an
         instruction rather than an invitation. */
      label: (document.querySelector('.sheet .label') || {}).textContent,
      placeholder: (document.querySelector('.sheet input[type=text]') || {}).placeholder,
      /* ── AND SOMETHING TO PRESS BEFORE YOU HAVE TYPED ──
         An empty field over an empty list reads as broken rather than
         as waiting. */
      popular: [...document.querySelectorAll('.mn-res .mn-hit b')].map((b) => b.textContent),
      popLabel: (document.querySelector('.mn-res').previousElementSibling || {}).textContent,
      /* Real jackets, not six drawn rectangles: what was reported was
         "still only showing this no real covers", and the Popular
         list was the one place that had none. */
      popImg: document.querySelectorAll('.mn-res .mn-hit .mn-art img').length,
    }));
    ok('pressing Mind on Today asks what you put in your head',
      sheet.title === 'Mind'
      && sheet.kinds.join('|') === 'Read|Podcast|Walk|Journal'
      && sheet.seg && sheet.note === 1 && sheet.rungs === 0, sheet);
    ok('...and the field says SEARCH, not the name of a book',
      sheet.label === 'Search' && sheet.placeholder === 'Search…', sheet);
    ok('...and something is there to press before you have typed anything',
      sheet.popular.length === 6 && sheet.popLabel === 'Popular'
      && sheet.popular.includes('Eat That Frog!'), sheet);
    /* ── AND THEY WEAR REAL JACKETS ──
       Every one of the six is a book somebody would recognise by its
       cover, and a wall of drawn initials is what "no real covers"
       was reporting. Asserted as the COUNT, because the drawn cover
       sits underneath either way — a build that fetched none of them
       still draws six perfectly good rectangles. */
    ok('...and every one of them wears its own jacket',
      sheet.popImg === 6, sheet);
    /* The list itself is written into the app rather than fetched, so
       nothing about WHICH six is asked of anybody. What the jackets
       cost is the two shapes ART names — and a search, which is the
       only request here carrying something you typed, must not have
       happened. Checked before a single character is typed. */
    ok('...and drawing them has searched for nothing',
      leaks().length === 0, leaks());

    /* ── AND PICKING ONE KEEPS THE JACKET IT WAS SHOWING ──
       The Popular hit built its pick BY HAND with an empty cover,
       which was right for exactly as long as Popular had none — and
       on the day the jackets landed it was the one line that threw
       them away. The drawn cover underneath is what made it look
       deliberate rather than broken: reported as "the cover isn't
       showing once I click it". A hit that behaves differently
       depending on which list it came off is two objects wearing one
       shape, so this is now the search hit's own two lines. */
    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(360);
    ok('...and picking one keeps the jacket it was showing',
      await mpage.evaluate(() => {
        const p = document.querySelector('.mn-pick');
        return !!p && p.querySelectorAll('.mn-art img').length === 1
          && p.querySelector('b').textContent === 'Atomic Habits';
      }));
    await mpage.click('.mn-pick .btn.off');
    await mpage.waitForTimeout(360);

    /* ── TYPING REPLACES THE SUGGESTIONS, NOT THE OTHER WAY ROUND ──
       Once you start putting something in, that is what the list
       should be about. */
    await mpage.click('.sheet input[type=text]');
    await mpage.type('.sheet input[type=text]', 'e', { delay: 40 });
    await mpage.waitForTimeout(200);
    ok('one character clears the suggestions before the real search lands',
      await mpage.evaluate(() => document.querySelectorAll('.mn-res').length === 0
        || !document.querySelector('.mn-res .mn-hit b').textContent.includes('Atomic')));
    await mpage.fill('.sheet input[type=text]', '');
    await mpage.waitForTimeout(200);
    ok('and clearing the field back to empty brings them back',
      await mpage.evaluate(() =>
        [...document.querySelectorAll('.mn-res .mn-hit b')].some((b) => b.textContent === 'Atomic Habits')));

    /* ── THE PROMISE, AND IT IS THE WHOLE POINT OF THE SECTION ──
       This app reaches nothing off origin except the friends half.
       Mind adds one more door and it must stay SHUT until you
       actually search: not on boot, not on a render, and not on
       OPENING the sheet. Measured after the sheet is up and before a
       single key is typed.

       Popular's jackets are the one thing that leaves on open, and
       they are not that door: a fixed public list is the same request
       from every phone, and ART is what holds it to exactly that. */
    ok('opening the sheet has searched for nothing',
      leaks().length === 0, leaks());

    /* ── AND ONLY WHAT YOU TYPED LEAVES ──
       Not the block, not the date, not the tick, not the note. The
       whole request is checked rather than just its host, because
       "it went to Open Library" is true of a request carrying
       anything at all. */
    /* ── TYPED A CHARACTER AT A TIME, WHICH IS THE BUG ──
       The first version called the sheet's full redraw on every
       keystroke, so the input was destroyed and rebuilt between one
       character and the next — the caret and the focus went with it
       and only the last letter survived. It reported as "it cancels
       out my writing, I can only type one thing at a time".

       `fill` sets the value in one go and would have passed on the
       broken build. This types, and then asserts the FIELD still
       holds what was typed, still has focus, and still has the caret
       at the end — the three things a rebuild takes away. */
    await mpage.click('.sheet input[type=text]');
    await mpage.type('.sheet input[type=text]', 'brian tracy', { delay: 40 });
    await mpage.waitForTimeout(1300);
    const typing = await mpage.evaluate(() => {
      const f = document.querySelector('.sheet input[type=text]');
      return { v: f ? f.value : null, focused: document.activeElement === f,
               caret: f ? f.selectionStart : null };
    });
    ok('typing a title survives itself: the field is not rebuilt under the caret',
      typing.v === 'brian tracy' && typing.focused && typing.caret === 11, typing);
    const url = sent[0] || '';
    const qs = new URL(url).searchParams;
    ok('typing searches, and the request carries the query and nothing else',
      sent.length === 1 && url.startsWith('https://openlibrary.org/search.json')
      && qs.get('q') === 'brian tracy'
      && [...qs.keys()].sort().join(',') === 'fields,limit,q', { sent, url });

    const hits = await mpage.evaluate(() => ({
      rows: [...document.querySelectorAll('.mn-res .mn-hit')].map((b) => ({
        t: b.querySelector('b').textContent,
        img: b.querySelectorAll('.mn-art img').length,
        init: b.querySelector('.mn-art i').textContent,
      })),
      own: document.querySelectorAll('.mn-hit.is-own').length,
    }));
    /* The malformed third entry is dropped rather than drawn or
       thrown on — a shape this repo does not control changing must
       cost covers, never the screen. */
    ok('the results are drawn, and a malformed one is dropped rather than thrown on',
      hits.rows.length === 2 && hits.rows[0].t === 'Eat That Frog!', hits);
    /* ── THE DRAWN COVER IS UNDERNEATH, NOT A FALLBACK ──
       Every card has initials whether or not artwork loaded, so a
       blocked or broken image degrades to a real cover instead of a
       hole. */
    ok('a title with no artwork still gets a cover, drawn from its own initials',
      hits.rows[1].img === 0 && hits.rows[1].init === 'NE'
      && hits.rows[0].img === 1 && hits.rows[0].init === 'EF', hits.rows);
    ok('...and what you typed is offered whatever the search did',
      hits.own === 1, hits);

    /* Pick it, write a note, file it. */
    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(300);
    /* ── THE PICK REPLACES THE FIELD, AND CHANGE GIVES IT BACK ──
       Shown instead of the search box rather than under it: once you
       have chosen the thing, the box is the part you are done with.
       Both directions, because "the pick is drawn" passes on a sheet
       that draws it beside a field you can still type in. */
    const picked = await mpage.evaluate(() => ({
      t: (document.querySelector('.mn-pick b') || {}).textContent,
      field: document.querySelectorAll('.sheet input[type=text]').length,
    }));
    ok('picking one replaces the field with what you picked',
      picked.t === 'Eat That Frog!' && picked.field === 0, picked);
    await mpage.click('.mn-pick .btn.off');
    await mpage.waitForTimeout(320);
    ok('...and Change gives the field back, with the results still under it',
      await mpage.evaluate(() => document.querySelectorAll('.sheet input[type=text]').length === 1
        && document.querySelectorAll('.mn-res .mn-hit').length === 2));
    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(300);
    await mpage.fill('.sheet textarea', 'Bullet one. Bullet two. NOTEONLYZQX');
    const foot = await mpage.$eval('.sheet .btn.go', (b) => b.textContent);
    ok('the foot names what it is about to file',
      foot === 'Log Eat That Frog!', { foot });

    /* ── LOG ASKS FIRST, RATHER THAN SHOWING THE LADDER ALL ALONG ──
       Pressing it the first time does not file the record — it asks
       how long, in the ladder's own place at the foot, and a second
       press of a RUNG is what actually commits. */
    await mpage.click('.sheet .btn.go');
    await mpage.waitForTimeout(360);
    const asking = await mpage.evaluate(() => ({
      rungs: [...document.querySelectorAll('.wc-min')].map((c) => c.textContent),
      cols: (() => { const m = document.querySelector('.mn-mins');
        return m ? getComputedStyle(m).gridTemplateColumns.split(' ').length : 0; })(),
      on: (document.querySelector('.wc-min[aria-pressed="true"]') || {}).textContent,
      go: document.querySelectorAll('.sheet .btn.go').length,
      back: document.querySelectorAll('.acts .wc-back').length,
    }));
    ok('...and the ladder is exactly eight rungs, four across, with the estimate lit',
      asking.rungs.length === 8 && asking.cols === 4 && asking.on === '30'
      && asking.go === 0 && asking.back === 1, asking);

    /* ── AND THE BACK ARROW LEAVES WITHOUT FILING ──
       No Not now and no Take it off in this state, so the length
       question would otherwise be a dead end — pressing back has to
       return the normal foot with nothing recorded yet. */
    await mpage.click('.acts .wc-back');
    await mpage.waitForTimeout(320);
    ok('the way back leaves the question unanswered rather than filing anything',
      await mpage.evaluate(() =>
        document.querySelectorAll('.sheet .btn.go').length === 1
        && document.querySelectorAll('.wc-min').length === 0
        && !(localStorage.getItem('sched.mind.v1') || '').includes('Eat That Frog')));

    /* Ask again, and this time answer it. */
    await mpage.click('.sheet .btn.go');
    await mpage.waitForTimeout(360);
    await mpage.click('.wc-min >> nth=3');
    await mpage.waitForTimeout(620);

    const rec = await mpage.evaluate(() => {
      const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
      const day = Object.keys(o)[0];
      return { day, r: day ? o[day] : null };
    });
    /* ── ONE RECORD A DAY, NOT ONE A BLOCK ──
       Mind is one of the five things on Today rather than a property
       of a line in the timetable, so the record is keyed by DATE and
       nothing about a block appears in it. */
    ok('the record is filed under the date alone, with the kind, title, length and note',
      !!rec.r && rec.r.k === 'read' && rec.r.t === 'Eat That Frog!'
      && rec.r.a === 'Brian Tracy' && rec.r.b === 'Bullet one. Bullet two. NOTEONLYZQX'
      && rec.r.m === 30 && /^\d{4}-\d{2}-\d{2}$/.test(rec.day), rec);

    /* ── AND THE TILE SAYS WHAT IT WAS ──
       A record you can only see by opening a sheet is a record you
       stop keeping — the objectives' own argument, one feature along.
       The row tag this replaces went with the block-keyed record: it
       would have drawn the same book on the Walk row and the Read
       row, since neither is the thing the record is about. The tile
       you press is where it belongs.

       NOT at the figure's size: that is for a number, and a title at
       22px would be the loudest thing on a screen of six tiles. */
    const tile = await mpage.evaluate(() => {
      const c = document.querySelector('.ty-card[data-item="m"]');
      return { says: c ? c.textContent : '',
               val: c ? c.querySelectorAll('.pill.val').length : -1 };
    });
    ok('the Mind tile says what it was, at a label\u2019s size and not a figure\u2019s',
      /Eat That Frog!/.test(tile.says) && tile.val === 0, tile);

    /* ── A SEARCH THAT FAILS IS NOT AN ERROR STATE ──
       Every one of these is somebody else's server: it can be down,
       slow, blocked, or simply unreachable on a phone with no signal.
       The typed title is the base the feature stands on, so a failure
       has to leave you able to log — asserted by making the search
       fail outright. */
    await mpage.unroute('https://openlibrary.org/**');
    await mpage.route('https://openlibrary.org/**', (r) => r.abort());
    /* ── AND UNTICKING TAKES THE RECORD WITH IT ──
       A record about what you put in your head must not outlive the
       tick it hangs off, which is the rule unticking Train already
       keeps. openMind unticks before it ticks, so reaching the sheet
       again is itself the check: the day comes back EMPTY and the
       sheet opens on the field rather than on the pick. */
    await openMind();
    const cleared = await mpage.evaluate(() => ({
      rec: localStorage.getItem('sched.mind.v1'),
      field: document.querySelectorAll('.sheet input[type=text]').length,
      pick: document.querySelectorAll('.mn-pick').length,
    }));
    ok('unticking Mind takes the record with it, so the sheet opens empty',
      cleared.rec === '{}' && cleared.field === 1 && cleared.pick === 0, cleared);
    await mpage.fill('.sheet input[type=text]', 'something nobody indexed');
    await mpage.waitForTimeout(1400);
    const dead = await mpage.evaluate(() => ({
      say: (document.querySelector('.mn-say') || {}).textContent || '',
      own: document.querySelectorAll('.mn-hit.is-own').length,
      res: document.querySelectorAll('.mn-res .mn-hit').length,
      foot: (document.querySelector('.sheet .btn.go') || {}).textContent,
    }));
    ok('a search that cannot be reached still lets you log what you typed',
      dead.own === 1 && dead.res === 0 && /still logs/.test(dead.say), dead);
    await mpage.click('.mn-hit.is-own');
    await mpage.waitForTimeout(260);
    await mpage.click('.sheet .btn.go');   /* asks; the record has no length yet */
    await mpage.waitForTimeout(360);
    await mpage.click('.wc-min >> nth=3');
    await mpage.waitForTimeout(560);
    ok('...and that record is filed like any other',
      await mpage.evaluate(() => {
        const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
        const day = Object.keys(o)[0];
        return !!day && o[day].t === 'something nobody indexed';
      }));

    /* ── HOW IT WENT AND WHAT YOU WROTE NEVER LEAVE ──
       The note is the same claim the day's rating makes: a count says
       you showed up and a sentence says what your day IS, and the
       second is the thing this app exists not to send. Both halves,
       because each passes on the other's bug — nothing may be sent
       when you write one, and a push that happens for some other
       reason must not be carrying it. */
    /* The token has to be one no SEARCH TERM can contain, or the
       filter matches the app working correctly: the first version
       looked for "indexed", which is a word in the query the test
       itself types into the box. */
    const leaked = offOrigin().filter((u) => /NOTEONLYZQX|Bullet/i.test(
      decodeURIComponent(u)));
    ok('the note never leaves, on any request the app has made',
      leaked.length === 0, leaked);
    ok('...and nothing has been pushed at all outside the two searches',
      offOrigin().every((u) => u.startsWith('https://openlibrary.org/')
        || u.startsWith('https://covers.openlibrary.org/') || isArt(u)),
      offOrigin());

    /* ══════════════════════════════════════════════════════
       WHICH EPISODE

       The search names a SHOW; which episode is in the show's RSS,
       and a feed is XML from whoever hosts the podcast, almost never
       with a CORS header. This is the one thing in the app that has
       to go through the worker. */
    const pods = [];
    await mpage.route('**/v1/pod/**', (r) => {
      pods.push(r.request());
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ show: 'The Daily Stoic', art: '', items: [
          { t: 'The Obstacle Is The Way', d: 'Tue, 02 Sep 2026 06:00:00 GMT', s: 3723 },
          { t: 'On Anger', d: 'Mon, 01 Sep 2026 06:00:00 GMT', s: 2700 },
          /* one the feed gave no date or duration for: an absent fact
             is drawn as absent, never as "0 m" */
          { t: 'A short one', d: '', s: 0 } ] }) });
    });

    await openMind();
    await mpage.click('.wc-chip >> nth=1');            /* Podcast */
    await mpage.waitForTimeout(320);
    const beforeShow = pods.length;
    await mpage.click('.sheet input[type=text]');
    await mpage.type('.sheet input[type=text]', 'daily stoic', { delay: 30 });
    await mpage.waitForTimeout(1300);
    ok('searching for a show reaches the worker not at all',
      pods.length === beforeShow && beforeShow === 0, pods.length);

    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(900);

    /* ── AND WHAT LEAVES IS A NUMBER ──
       Not the day, not the tick, not the note, not your code, and no
       Authorization header — the worker cannot tell who asked because
       nothing in the request says. Checked as the whole URL and the
       headers rather than just the host: "it went to the worker" is
       true of a request carrying anything at all. */
    const asked = pods[0];
    ok('choosing a show asks the worker for episodes, by numeric id alone',
      pods.length === 1 && /\/v1\/pod\/1200361736$/.test(asked.url())
      && !asked.headers().authorization, asked ? asked.url() : null);

    const level = await mpage.evaluate(() => ({
      eps: [...document.querySelectorAll('.mn-hit.is-ep b')].map((x) => x.textContent),
      meta: [...document.querySelectorAll('.mn-hit.is-ep .mn-ht2 span')]
        .map((x) => x.textContent),
      just: document.querySelectorAll('.mn-hit.is-own').length,
      back: document.querySelectorAll('.mn-pick .wc-back').length,
      field: document.querySelectorAll('.sheet input[type=text]').length,
    }));
    ok('the episodes are drawn, with a way back and the show still loggable',
      level.eps.length === 3 && level.eps[0] === 'The Obstacle Is The Way'
      && level.just === 1 && level.back === 1 && level.field === 0, level);
    /* "1:02:03" is an hour and two minutes, and an episode the feed
       gave no duration for draws no figure rather than "0 m". */
    ok('...and a duration is read, while an absent one is simply absent',
      level.meta.length === 2 && /1 h 2 m/.test(level.meta[0])
      && /45 m/.test(level.meta[1]), level.meta);

    /* ── THE BACK ARROW IS A LEVEL, NOT A CLOSE ── */
    await mpage.click('.mn-pick .wc-back');
    await mpage.waitForTimeout(320);
    ok('the way back returns to the shows rather than closing the sheet',
      await mpage.evaluate(() =>
        document.querySelectorAll('.sheet input[type=text]').length === 1
        && document.querySelectorAll('.mn-hit.is-ep').length === 0
        && !document.getElementById('scSheet').hidden));

    /* ── AN EPISODE IS THE THING, THE SHOW IS WHAT IT IS BY ── */
    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(800);
    await mpage.click('.mn-hit.is-ep >> nth=0');
    await mpage.waitForTimeout(360);
    ok('the foot names the episode, not the show',
      (await mpage.$eval('.sheet .btn.go', (b) => b.textContent))
        === 'Log The Obstacle Is The Way');
    await mpage.click('.sheet .btn.go');   /* asks first */
    await mpage.waitForTimeout(360);
    await mpage.click('.wc-min >> nth=3');
    await mpage.waitForTimeout(620);
    const ep = await mpage.evaluate(() => {
      const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
      const day = Object.keys(o)[0];
      const c = document.querySelector('.ty-card[data-item="m"]');
      return { r: day ? o[day] : null, tile: c ? c.textContent : '' };
    });
    ok('the episode is filed as the thing and the show as what it is by',
      ep.r && ep.r.k === 'pod' && ep.r.t === 'The Obstacle Is The Way'
      && ep.r.a === 'The Daily Stoic'
      && /The Obstacle Is The Way/.test(ep.tile), ep);

    /* ── A SHOW WITH NO ID IS STILL AN ANSWER ──
       The second level needs a numeric id to ask for; without one the
       show is chosen directly rather than opening a level that could
       never fill. */
    await openMind();
    await mpage.click('.wc-chip >> nth=1');
    await mpage.waitForTimeout(320);
    await mpage.click('.sheet input[type=text]');
    await mpage.type('.sheet input[type=text]', 'daily stoic', { delay: 30 });
    await mpage.waitForTimeout(1300);
    await mpage.click('.mn-res .mn-hit >> nth=1');     /* the one with no id */
    await mpage.waitForTimeout(420);
    ok('a show the search gave no id for is picked outright',
      await mpage.evaluate(() =>
        (document.querySelector('.mn-pick b') || {}).textContent === 'No Id Here'
        && document.querySelectorAll('.mn-hit.is-ep').length === 0));

    /* ── AND THE FEED FAILING IS NOT A DEAD END ──
       The show is already a complete answer, so a worker that cannot
       be reached has to leave you able to log — the covers' rule one
       level down. */
    await mpage.unroute('**/v1/pod/**');
    await mpage.route('**/v1/pod/**', (r) => r.abort());
    await mpage.click('.mn-pick .btn.off');
    await mpage.waitForTimeout(320);
    await mpage.click('.mn-res .mn-hit >> nth=0');
    await mpage.waitForTimeout(1000);
    const dead2 = await mpage.evaluate(() => ({
      say: (document.querySelector('.mn-say') || {}).textContent || '',
      just: document.querySelectorAll('.mn-hit.is-own').length,
      eps: document.querySelectorAll('.mn-hit.is-ep').length,
    }));
    ok('a feed that cannot be read still leaves the show loggable',
      dead2.just === 1 && dead2.eps === 0 && /still logs/.test(dead2.say), dead2);
    await mpage.click('.mn-hit.is-own');
    await mpage.waitForTimeout(320);
    await mpage.click('.sheet .btn.go');   /* asks first */
    await mpage.waitForTimeout(360);
    await mpage.click('.wc-min >> nth=3');
    await mpage.waitForTimeout(620);
    ok('...and the show files like any other record',
      await mpage.evaluate(() => {
        const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
        const day = Object.keys(o)[0];
        return !!day && o[day].t === 'The Daily Stoic' && o[day].k === 'pod';
      }));

    /* ── A POPULAR SHOW OPENS ITS EPISODES TOO ──
       The same line that dropped the jacket dropped the ID, so a show
       pressed off Popular logged the show while the identical show
       pressed off the search opened its episodes. One object, two
       behaviours, decided by which list you happened to reach it
       from. Measured as the worker being asked for that show's own
       number, which is the only thing that could carry it. */
    await mpage.unroute('**/v1/pod/**');
    await mpage.route('**/v1/pod/**', (r) => {
      pods.push(r.request());
      return r.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ show: 'Huberman Lab', art: '', items: [
          { t: 'Sleep Toolkit', d: 'Mon, 01 Sep 2026 06:00:00 GMT', s: 3600 } ] }) });
    });
    await openMind();
    await mpage.click('.wc-chip >> nth=1');
    await mpage.waitForTimeout(400);
    const popPods = pods.length;
    await mpage.click('.mn-res .mn-hit >> nth=1');    /* Huberman Lab */
    await mpage.waitForTimeout(900);
    const popShow = await mpage.evaluate(() => ({
      eps: [...document.querySelectorAll('.mn-hit.is-ep b')].map((x) => x.textContent),
      back: document.querySelectorAll('.mn-pick .wc-back').length,
    }));
    ok('a show pressed off Popular opens its episodes, like a searched one',
      pods.length === popPods + 1
      && /\/v1\/pod\/1545953110$/.test(pods[pods.length - 1].url())
      && popShow.eps.length === 1 && popShow.back === 1, { popShow,
        url: pods.length ? pods[pods.length - 1].url() : null });
    /* ── AND IT PUTS THE RECORD BACK ──
       This opened the episode level and stopped, which left the day
       with no record at all — and the section below reads
       Object.keys(o)[0] to find a day to damage, so it wrote a key
       literally named "undefined" that the loader then dropped, and
       failed four assertions about a fall-through that was working
       perfectly. A check that changes the state of the app is a check
       that has to put it back. */
    await mpage.click('.mn-hit.is-ep >> nth=0');
    await mpage.waitForTimeout(360);
    await mpage.click('.sheet .btn.go');
    await mpage.waitForTimeout(360);
    await mpage.click('.wc-min >> nth=3');
    await mpage.waitForTimeout(620);
    ok('...and filing it leaves the day with a record again',
      await mpage.evaluate(() => {
        const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
        const day = Object.keys(o)[0];
        return !!day && /^\d{4}-\d{2}-\d{2}$/.test(day)
          && o[day].t === 'Sleep Toolkit' && o[day].a === 'Huberman Lab';
      }));

    /* ── A STORED KIND THIS BUILD NO LONGER HAS FALLS THROUGH ──
       The key outlives the code that wrote it, which is the rule
       sched.view.v1 and sched.ty.v1 already keep. And a damaged DAY
       is dropped while the record survives — asserted as the good day
       SURVIVING, because rejecting the whole object passes any check
       written the other way round. */
    const fell = await mpage.evaluate(() => {
      const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
      const day = Object.keys(o)[0];
      /* Three damaged things at once, and the record has to survive
         all three: a kind this build no longer has, a day that is not
         a date, and — the one that matters — a record written in the
         BLOCK-KEYED shape this feature shipped with first. */
      o[day] = { k: 'seance', t: 'Kept', a: '', c: '', b: '', m: 30 };
      o['not-a-date'] = { x: 1 };
      o['2026-01-02'] = { blockid7: { k: 'pod', t: 'Old shape', a: '', c: '', b: '' } };
      localStorage.setItem('sched.mind.v1', JSON.stringify(o));
      return true;
    });
    await mpage.reload({ waitUntil: 'networkidle' });
    await mpage.waitForTimeout(420);
    await mpage.click('.tab[data-view="tally"]');
    await mpage.waitForTimeout(460);
    const after = await mpage.evaluate(() => {
      const o = JSON.parse(localStorage.getItem('sched.mind.v1') || '{}');
      const day = Object.keys(o).find((k) => /^\d{4}/.test(k) && k !== '2026-01-02');
      const c = document.querySelector('.ty-card[data-item="m"]');
      return { kind: day ? o[day].k : null, kept: day ? o[day].t : null,
               junk: Object.keys(o).filter((k) => !/^\d{4}/.test(k)).length,
               old: o['2026-01-02'] ? o['2026-01-02'].t : null,
               drawn: c ? /Kept/.test(c.textContent) : false };
    });
    ok('a kind this build does not have falls through, and the record survives',
      fell && after.kept === 'Kept' && after.kind === 'read'
      && after.junk === 0 && after.drawn, after);
    /* ── AND THE BLOCK-KEYED SHAPE IS REPAIRED, NOT DISCARDED ──
       Written back rather than held in memory: a repair kept only in
       RAM is redone every boot and lost the moment anything else
       writes the key, which is how "repaired, not discarded" quietly
       becomes "discarded on the next write". Asserted by reading the
       STORED value after a reload. */
    ok('...and a record written keyed by block is repaired into the day\u2019s own',
      after.old === 'Old shape', after);

    /* ══════════════════════════════════════════════════════
       THE HISTORY IS A WALL

       Every other item on Showing up opens the same 26-week heat map;
       Mind opens a grid of covers instead, because a heat map of dots
       would throw away the one thing this record has that the others
       do not. Seeded directly into storage rather than logged through
       the sheet, because this is a check on how a RECORD renders, not
       on how one more gets made — that is every earlier assertion in
       this section. */
    const seeded = {
      '2026-09-03': { k: 'read', t: 'Eat That Frog!', a: 'Brian Tracy',
        c: 'https://covers.openlibrary.org/b/id/1-M.jpg', b: 'Chapter 3.', m: 45 },
      '2026-09-02': { k: 'pod', t: 'The Obstacle Is The Way', a: 'The Daily Stoic',
        c: '', b: '', m: 60 },
      /* Walk and Journal carry no title at all — there is nothing to
         search for, so nothing to draw an initial from. */
      '2026-09-01': { k: 'walk', t: '', a: '', c: '', b: 'Nice loop round the park.', m: 30 },
      '2026-08-30': { k: 'jrnl', t: '', a: '', c: '', b: '', m: 10 },
    };
    await mpage.evaluate((rec) => {
      localStorage.setItem('sched.mind.v1', JSON.stringify(rec));
    }, seeded);
    await mpage.reload({ waitUntil: 'networkidle' });
    await mpage.waitForTimeout(500);
    await mpage.click('.tab[data-view="tally"]');
    await mpage.waitForTimeout(420);
    /* The double tap the tile already carries for every other item —
       Mind gets no new gesture, only a different sheet on the far end
       of the same one. */
    await mpage.evaluate(() => {
      const c = document.querySelector('.ty-card[data-item="m"]');
      c.click(); c.click();
    });
    await mpage.waitForTimeout(500);

    const wall = await mpage.evaluate(() => ({
      open: !document.getElementById('scTyVeil').hidden,
      title: (document.getElementById('scTyTitle') || {}).textContent,
      count: (document.querySelector('.ty-span') || {}).textContent,
      tiles: document.querySelectorAll('.mn-hist-t').length,
      notes: document.querySelectorAll('.mn-hist-note').length,
      stats: [...document.querySelectorAll('.ty-stats b')].map((b) => b.textContent),
      dots: document.querySelectorAll('.ty-cal, .cal-cell').length,
    }));
    ok('double tapping Mind opens a wall, not the heat map',
      wall.open && wall.title === 'Mind' && wall.count === '4 entries'
      && wall.tiles === 4 && wall.dots === 0, wall);
    ok('...with the two entries that carry a note marked, and neither figure a streak',
      wall.notes === 2 && wall.stats.join('|') === '2 h 25 m|2', wall);

    /* ── EVERY TITLED ENTRY HAS ITS OWN COVER, EVERY TITLELESS ONE
       HAS THE KIND'S GLYPH ── */
    const tiles = await mpage.evaluate(() => [...document.querySelectorAll('.mn-hist-t')]
      .map((t) => ({
        init: (t.querySelector('.mn-art i') || {}).textContent || null,
        img: t.querySelectorAll('.mn-art img').length,
        glyph: t.querySelectorAll('.mn-art-ic').length,
        len: (t.querySelector('.mn-hist-ov span') || {}).textContent || '',
        label: t.getAttribute('aria-label'),
      })));
    ok('a titled entry draws its own cover, image or initials',
      tiles[0].init === 'EF' && tiles[0].img === 1 && tiles[0].glyph === 0
      && tiles[0].len === '45 m', tiles[0]);
    ok('...and a book with no artwork still has initials, not a blank tile',
      tiles[1].init === 'TW' && tiles[1].img === 0, tiles[1]);
    /* ── THE BUG A REAL RENDER CAUGHT ──
       scMindInit('') is a lone dot and scMindHue('') is one fixed
       value, so a Walk and a Journal entry — both titleless — drew
       the SAME blank dot on the SAME colour and were indistinguishable
       tiles. Keyed on the KIND for these two instead, with the kind's
       own glyph standing in for an initial. */
    ok('a titleless entry draws the KIND’s glyph, never a bare dot',
      tiles[2].init === null && tiles[2].glyph === 1
      && tiles[3].init === null && tiles[3].glyph === 1, [tiles[2], tiles[3]]);
    ok('...and the note is on the label whether or not it is on the cover',
      /with a note attached/.test(tiles[0].label)
      && !/with a note/.test(tiles[1].label)
      && /with a note attached/.test(tiles[2].label), tiles.map((t) => t.label));

    /* ── A TILE IS A WAY IN, NOT A SECOND READ-ONLY PICTURE ──
       The same editor a fresh log opens, given a past date. Reused
       rather than duplicated: a second sheet that only shows what a
       day holds would drift from the one that can change it. */
    await mpage.click('.mn-hist-t >> nth=2');   /* the walk, which has a note */
    await mpage.waitForTimeout(500);
    const opened = await mpage.evaluate(() => ({
      veilGone: document.getElementById('scTyVeil').hidden,
      sheetTitle: (document.getElementById('scSheetTitle') || {}).textContent,
      kind: (document.querySelector('.wc-chip.on') || {}).textContent,
      note: (document.querySelector('.sheet textarea') || {}).value,
    }));
    ok('tapping a tile closes the wall and opens that day in the editor',
      opened.veilGone && opened.sheetTitle === 'Mind' && opened.kind === 'Walk'
      && opened.note === 'Nice loop round the park.', opened);
    await mpage.keyboard.press('Escape');
    await mpage.waitForTimeout(360);

    /* ── AND AN EMPTY RECORD SAYS SO, RATHER THAN SHOWING AN EMPTY GRID ── */
    await mpage.evaluate(() => { localStorage.setItem('sched.mind.v1', '{}'); });
    await mpage.reload({ waitUntil: 'networkidle' });
    await mpage.waitForTimeout(500);
    await mpage.click('.tab[data-view="tally"]');
    await mpage.waitForTimeout(420);
    await mpage.evaluate(() => {
      const c = document.querySelector('.ty-card[data-item="m"]');
      c.click(); c.click();
    });
    await mpage.waitForTimeout(420);
    ok('nothing logged reads as a sentence, not as an empty grid',
      await mpage.evaluate(() => document.querySelectorAll('.mn-hist-t').length === 0
        && /Nothing logged yet/.test(document.querySelector('.ty-hint').textContent)));
    await mpage.keyboard.press('Escape');
    await mpage.waitForTimeout(360);

    ok('nothing threw through any of it', merrs.length === 0, merrs);
    await mctx.close();
  }

  /* ══════════════════════════════════════════════════════════════
     THE PRESS ANSWERS WHERE YOUR FINGER LANDED

     ITS OWN CONTEXT, at the foot of the file, for the reason the
     sideways-scroll check is here: this one presses every control on a
     view, which logs ticks, opens sheets and turns tabs. A check that
     changes the state of the app is a check that has to be alone.
     ══════════════════════════════════════════════════════════════ */
  {
    console.log('\n── the press answers where your finger landed ──');
    const { PNG } = require('pngjs');
    const pctx = await browser.newContext({ ...PHONE });
    const pp = await pctx.newPage();
    const perrs = [];
    pp.on('pageerror', (e) => perrs.push(String(e)));
    await pp.addInitScript(() => {
      ['sched.tour.v1', 'sched.hint2.v1', 'sched.hintw.v1']
        .forEach((k) => localStorage.setItem(k, '1'));
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
    });
    await pp.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await pp.waitForTimeout(500);

    /* ── ON A CONTROL THAT HAD NOTHING ──
       Seven selectors in the whole app answered a press before this,
       and the tally tiles were not among them. Pressed at a corner, so
       the reach below is measuring something other than a centre. */
    const tile = await pp.$('.ty-card') || await pp.$('.st-d');
    const tr = await tile.boundingBox();
    await pp.mouse.move(tr.x + 10, tr.y + 9);
    await pp.mouse.down();
    await pp.waitForTimeout(90);
    const born = await pp.evaluate(() => {
      const e = document.querySelector('.rp');
      if (!e) return null;
      const h = e.parentElement;
      const hr = h.getBoundingClientRect(), er = e.getBoundingClientRect();
      const cs = getComputedStyle(e), i = e.querySelector('i');
      const ics = getComputedStyle(i);
      return {
        host: h.className,
        /* Clipped TO the host: a circle reaching the far corner of a
           44px control is several times the control. */
        out: [er.left - hr.left, er.top - hr.top,
              hr.right - er.right, hr.bottom - er.bottom]
          .filter((v) => v < -0.6).length,
        ov: cs.overflow,
        rad: cs.borderRadius === getComputedStyle(h).borderRadius,
        tap: cs.pointerEvents,
        /* The reach is worked out per press, not a constant: the far
           corner FROM THE FINGER. A press at 10,9 of a 170x96 tile has
           to cover about 178px, which is 22 times the 8px seed. */
        rs: parseFloat(i.style.getPropertyValue('--rs')),
        want: Math.max(
          Math.hypot(10, 9), Math.hypot(hr.width - 10, 9),
          Math.hypot(10, hr.height - 9),
          Math.hypot(hr.width - 10, hr.height - 9)) / 8,
        anim: ics.animationName,
        op: parseFloat(ics.opacity),
      };
    });
    ok('a press on a control that had no response now makes one', !!born, born);
    ok('...clipped to the control, and to its own corners',
      born && born.out === 0 && born.ov === 'hidden' && born.rad
        && born.tap === 'none', born);
    ok('...reaching the far corner from the finger, not a constant',
      born && born.rs >= born.want - 0.05 && born.rs <= born.want + 2,
      born && { rs: born.rs, want: +born.want.toFixed(2) });
    await pp.mouse.up();

    /* ── AND IT IS SWEPT ──
       On the animation AND on a timer, so a host removed by the render
       the press caused cannot leave the wash on screen for good. */
    await pp.waitForTimeout(1600);
    ok('the wash is swept when the pass is over',
      await pp.evaluate(() => document.querySelectorAll('.rp').length) === 0);

    /* ── EVERY CONTROL, WHICH IS THE WHOLE OF THE ASK ──
       One delegated listener rather than a wiring per call site: a list
       of classes silently skips whatever is added next, which is the
       failure the flight-pause rule and the runner's own SUITE list
       have each already had. Asserted by pressing everything that is
       drawn on a view and requiring a wash on each. */
    const press = () => pp.evaluate(() => {
      const out = [];
      /* A CONTROL IS NOT ALWAYS A BUTTON, which is exactly what this
         check could not see when it was written: the friends board's
         rows are <li>, because a row is only pressable when somebody
         is behind it. So the net is the one the app itself writes
         down — a button, a switch, or the OUTERMOST box carrying
         `cursor: pointer` of its own. */
      const hosts = [...document.querySelectorAll('body *')].filter((h) => {
        if (!h.getClientRects().length) return false;
        if (h.getBoundingClientRect().width <= 8) return false;
        if (h.matches('button,[role="switch"]')) return true;
        if (h.closest('button,[role="switch"]')) return false;
        if (getComputedStyle(h).cursor !== 'pointer') return false;
        const par = h.parentElement;
        return !(par && getComputedStyle(par).cursor === 'pointer');
      });
      for (const h of hosts) {
        const r = h.getBoundingClientRect();
        h.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
          clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
        if (!h.querySelector('.rp')) {
          out.push((h.className.baseVal !== undefined ? h.className.baseVal
            : h.className) || h.tagName);
        }
        document.querySelectorAll('.rp').forEach((e) => e.remove());
      }
      return { n: hosts.length, out };
    });
    const missed = await press();
    ok('every control on the week answers a press, and there are some',
      missed.n > 6 && missed.out.length === 0, missed);

    /* ── INCLUDING THE ONE THAT IS NOT A BUTTON ──
       The friends board's row was the only thing in the app the first
       cut of this check could not see, because it presses buttons and
       the row is an <li>. Both halves: the net has to reach it, and it
       has to be there to be reached. */
    await pp.evaluate(() => document.querySelector('#scTabFriends').click());
    await pp.waitForTimeout(700);
    const fr = await press();
    const nonBtn = await pp.evaluate(() => {
      const li = document.querySelector('.fr-row.is-tap');
      if (!li) return null;
      const sp = li.querySelector('.fr-n') || li.firstElementChild;
      const r = sp.getBoundingClientRect();
      sp.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.left + 2, clientY: r.top + 2 }));
      const rp = document.querySelector('.rp');
      const host = rp && rp.parentElement;
      /* Pressed on a CHILD, and it has to resolve to the row rather
         than washing a 29px span in the middle of it. */
      const ok = !!host && host === li;
      document.querySelectorAll('.rp').forEach((e) => e.remove());
      return { ok, tag: li.tagName, host: host && host.className };
    });
    ok('the friends board answers too, row and all', fr.out.length === 0, fr);
    ok('...and its row is an <li>, pressed anywhere inside it',
      nonBtn && nonBtn.ok && nonBtn.tag === 'LI', nonBtn);
    await pp.evaluate(() => document.querySelector('#scTabWeek').click());
    await pp.waitForTimeout(500);

    /* ── AND THE RULE MUST NOT OVER-REACH ──
       `scTrainCard`'s own note says the pair fanned behind a workout
       show an edge each and CANNOT be pressed — and they carried
       `.wc`'s `cursor: pointer` anyway, which would have made the walk
       above wash a decoration. A response to a press that does nothing
       is worse than no response at all. */
    await pp.evaluate(() => document.querySelector('#scTabTally').click());
    await pp.waitForTimeout(500);
    await pp.evaluate(() => {
      const c = document.querySelector('.ty-card[data-item="t"]');
      if (c) c.click();
    });
    await pp.waitForTimeout(900);
    const fan = await pp.evaluate(() => {
      const b1 = document.querySelector('.wc.b1');
      if (!b1) return null;
      const cs = getComputedStyle(b1);
      const r = b1.getBoundingClientRect();
      b1.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.right - 4, clientY: r.bottom - 4 }));
      const out = { cur: cs.cursor, pe: cs.pointerEvents,
        washed: !!b1.querySelector('.rp') };
      document.querySelectorAll('.rp').forEach((e) => e.remove());
      return out;
    });
    ok('a card that cannot be pressed does not claim it can, and is not washed',
      fan && fan.cur !== 'pointer' && fan.pe === 'none' && !fan.washed, fan);
    await pp.keyboard.press('Escape');
    await pp.waitForTimeout(420);
    await pp.evaluate(() => document.querySelector('#scTabWeek').click());
    await pp.waitForTimeout(500);

    /* ── THE ROW'S OWN FILL IS GONE, NOT DOUBLED UP ──
       `.row:active { background: var(--tick-off) }` said the same thing
       the wash says and said it louder — and it took the "Not yet" tag
       on that row to 2.55:1 for as long as your finger was down, which
       is the number that decided this. Read off the rule rather than
       off a pressed pixel, because a wash sitting over the fill would
       measure as "something changed" either way. */
    const rowFill = await pp.evaluate(() => {
      for (const sh of document.styleSheets) {
        let rules; try { rules = sh.cssRules; } catch (e) { continue; }
        for (const r of rules) {
          if ((r.selectorText || '').trim() === '.row:active') {
            return r.style.getPropertyValue('background') || 'set';
          }
        }
      }
      return null;
    });
    ok('the row no longer fills on a press as well as washing', rowFill === null,
      { rowFill });

    /* ── NOTHING IS MADE AT ALL UNDER REDUCED MOTION ──
       The stylesheet hides it too, and that is deliberate belt and
       braces — but a node built and swept sixteen times a morning for
       something that was never going to be painted is waste, so the
       script refuses first. Asserted as the node being ABSENT rather
       than not drawn, which is what tells the two halves apart. */
    const rctx = await browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    const rp = await rctx.newPage();
    await rp.addInitScript(() => {
      ['sched.tour.v1', 'sched.hint2.v1', 'sched.hintw.v1']
        .forEach((k) => localStorage.setItem(k, '1'));
      localStorage.setItem('sched.net.v1',
        JSON.stringify({ on: false, url: '', code: '' }));
    });
    await rp.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
    await rp.waitForTimeout(500);
    const quiet = await rp.evaluate(() => {
      const h = document.querySelector('.row') || document.querySelector('button');
      const r = h.getBoundingClientRect();
      h.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
        clientX: r.left + 8, clientY: r.top + 8 }));
      return { rp: document.querySelectorAll('.rp').length, had: !!h };
    });
    ok('reduced motion makes no wash at all, rather than an invisible one',
      quiet.had && quiet.rp === 0, quiet);
    await rctx.close();

    /* ── AND IT CANNOT BE THE THING THAT BREAKS A RATIO ──
       The tightest pair in the app is `--spent` on the 9%-ink chip the
       "Not yet" tag and the ghost objective share: 4.82:1 before
       anything is drawn over it, a rounding error above the bar. Held
       to 4.5 the wash caps at 4.9% and is then too faint to be a press
       response at all.

       THE BAR IS THE PRESS STATE THE APP ALREADY HAD, and measuring it
       is what settled this: the fill this replaced took that same pair
       to 2.55:1. So the claim is that the wash is BETTER than what
       shipped, and that nothing else in the app goes near it.

       Both faces, because the one nobody develops on is the one that
       breaks — and computed on the wash's own arithmetic, which is a
       flat overlay of a known colour at a known alpha over a ground
       read off real pixels. Frozen at full coverage AND full alpha,
       a state the real pass never reaches since it fades the whole
       time it grows, so every figure here is an upper bound. */
    for (const face of ['dark', 'light']) {
      const cctx = await browser.newContext({ ...PHONE, colorScheme: face });
      const cp = await cctx.newPage();
      await cp.addInitScript(() => {
        ['sched.tour.v1', 'sched.hint2.v1', 'sched.hintw.v1']
          .forEach((k) => localStorage.setItem(k, '1'));
        localStorage.setItem('sched.net.v1',
          JSON.stringify({ on: false, url: '', code: '' }));
      });
      await cp.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });
      await cp.waitForTimeout(500);
      const spots = await cp.evaluate(() => {
        const out = [];
        document.querySelectorAll('button,[role="switch"]').forEach((h) => {
          if (!h.getClientRects().length) return;
          const hc = getComputedStyle(h).color;
          [h].concat([...h.querySelectorAll('*')]).forEach((n) => {
            if (![...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return;
            const r = n.getBoundingClientRect();
            if (r.width < 8 || r.height < 6) return;
            out.push({ fg: getComputedStyle(n).color, hostColor: hc,
              x: Math.round(r.left), y: Math.round(r.top),
              w: Math.round(r.width), h: Math.round(r.height),
              who: (h.className || h.tagName) + ' / '
                + (n.textContent || '').trim().slice(0, 10) });
          });
        });
        const rs = getComputedStyle(document.documentElement);
        return { out, ink: rs.getPropertyValue('--ink'),
          paper: rs.getPropertyValue('--paper'),
          a: parseFloat(rs.getPropertyValue('--rp-a')) };
      });
      const png = PNG.sync.read(await cp.screenshot());
      const at = (x, y) => { const i = (png.width * y + x) << 2;
        return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
      const hx = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec((h || '').trim());
        if (!m) return (h.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const n = parseInt(m[1], 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
      const nm = (c) => { const m = (c || '').match(/[\d.]+/g);
        return m ? m.slice(0, 3).map(Number) : null; };
      const ov = (c, w, a) => c.map((v, i) => a * w[i] + (1 - a) * v);
      const INK = hx(spots.ink), PAP = hx(spots.paper);
      let worst = { r: 99 }, seen = 0;
      spots.out.forEach((s) => {
        /* THE GROUND IS THE MOST COMMON PIXEL IN THE LABEL'S OWN BOX.
           A min/max over the box picks antialiased edge pixels at both
           ends and reported a shipped, passing screen at 4.02:1. */
        const t = new Map();
        for (let y = s.y * 2; y < (s.y + s.h) * 2 && y < png.height; y++)
          for (let x = s.x * 2; x < (s.x + s.w) * 2 && x < png.width; x++) {
            const k = at(x, y).join(','); t.set(k, (t.get(k) || 0) + 1);
          }
        let bk = '', bn = -1;
        t.forEach((n, k) => { if (n > bn) { bn = n; bk = k; } });
        const bg = bk.split(',').map(Number), fg = nm(s.fg);
        if (!fg) return;
        /* Only what clears the bar WITHOUT a press. The app ships a few
           captions under it that nothing has ever asserted, and holding
           the wash to those would be solving a constraint the app never
           had. */
        if (ratio(fg, bg) < 4.5) return;
        seen++;
        const hl = lum(nm(s.hostColor) || [255, 255, 255]);
        const w = Math.abs(hl - lum(INK)) <= Math.abs(hl - lum(PAP)) ? INK : PAP;
        const r = ratio(ov(fg, w, spots.a), ov(bg, w, spots.a));
        if (r < worst.r) worst = { r: +r.toFixed(2), who: s.who,
          base: +ratio(fg, bg).toFixed(2) };
      });
      /* A check that finds nothing must not pass. */
      ok(`${face}: the wash beats the fill it replaced on every label that passes`,
        seen > 8 && worst.r >= 3.9, { seen, worst, was: 2.55 });
      await cctx.close();
    }

    ok('nothing threw through any of it', perrs.length === 0, perrs);
    await pctx.close();
  }

  ok('no page errors through any of it', errs.length === 0, errs);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
