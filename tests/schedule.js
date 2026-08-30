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
  isMobile: true, hasTouch: true, locale: 'en-GB' };

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

  const SEEDED = 47;
  ok('it opens with the week on it',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED);
  /* Today first, then the days after it — a daily process is opened
     to find out what is happening now, and on a Saturday a Monday-first
     week puts that four screens down. The frozen-clock pass below is a
     Tuesday, so this list is checked against the real clock instead of
     a literal. */
  const ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
  const from = new Date().getDay();
  /* ── MONDAY FIRST, and it used to be today first ──
     A rail that began on today was right for a scrolling column: the
     thing you want is at the top and the week runs away from it. A DECK
     cannot do that — its leftmost card would move every morning, so the
     week would have no shape to remember and Thursday would sit in a
     different place each time you looked. You scroll to today instead,
     and WHERE today sits is itself information. */
  const wantOrder = [1, 2, 3, 4, 5, 6, 0]
    .map((d) => (d === from ? FULL[d] : ABBR[d])).join(' ');
  ok('the week is Monday first, whatever day it is',
    await page.$$eval('.day-name', (n) => n.map((x) => x.textContent).join(' '))
      === wantOrder, wantOrder);
  /* The open card prints the day in full and the shut ones abbreviate:
     four uppercase characters is a label on a 76px card and a heading
     on a 268px one, and they are not the same job. */
  ok('...with today the one card that is open',
    await page.$$eval('.day.is-open', (d) => d.map((x) =>
      x.querySelector('.day-name').textContent)).then((v) =>
        v.length === 1 && v[0] === FULL[from]), FULL[from]);
  ok('...and every day has a card, including one you have cleared',
    await page.$$eval('.day', (d) => d.length) === 7);

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
  await page.evaluate(() => document.querySelector('.day:not(.is-today) .wk-face').click());
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
  await page.evaluate(() => document.querySelector('.day.is-today .wk-face').click());
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
     range, so the fact is on the screen in words rather than in a bar.
     That is what these check now — every row carries its own start and
     end, and the two are the real ones. */
  const spans = await page.$$eval('.row[data-id]', (rows) => rows.map((r) => ({
    n: r.querySelector('.n').firstChild.textContent,
    s: +r.dataset.s, e: +r.dataset.e,
    t: r.querySelector('.t').textContent,
  })));
  const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, '0') + ':'
    + String(m % 60).padStart(2, '0');
  ok('every block prints its own range where the rule used to be',
    spans.length === 47 && spans.every((s) => /^\d\d:\d\d–\d\d:\d\d$/.test(s.t)),
    spans.slice(0, 3));
  /* Present is not enough — a constant string is also present, which is
     the shape of the failure the measure's own check was written for. */
  ok('and the printed range is the block’s real start and end',
    spans.every((s) => s.t === hhmm(s.s) + '–' + hhmm(s.e))
    && new Set(spans.map((s) => s.t)).size > 5,
    spans.slice(0, 3));
  /* The gutter holds ONE thing now, which is the whole reason the rule
     went: a glyph and a 3px stub beside it read as a glyph with a stray
     dash. Nothing but the icon may be in that column on an ordinary
     row — a done row adds its tick, and that is the only exception. */
  const gutter = await page.$$eval('.row[data-id]', (rows) => rows.map((r) =>
    [...r.children].filter((e) => getComputedStyle(e).gridColumnStart === '1')
      .map((e) => e.getAttribute('class'))));
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
      for (let dx = 4; dx < b.w - 4; dx += 3) {
        const p = at((b.x + dx) * dpr, (b.y + b.h - 3) * dpr);
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

  /* Two days named, two rows written — a repeating block is per-day. */
  await page.fill('#scSheetBody .field', 'Physio Tuesday and Friday 8 to 9 at the clinic');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('two days named writes two rows',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED + 2);
  /* Found by LABEL, not by position. The week rotates with the clock
     now, so .day:nth-child(2) is a different weekday every day and a
     test written against it passes or fails depending on when it runs. */
  const rowsOf = (abbr) => page.evaluate((a) => {
    const day = [...document.querySelectorAll('.day')]
      .find((d) => d.querySelector('.day-name').textContent === a);
    return [...day.querySelectorAll('.row[data-id] .n')].map((n) => n.firstChild.textContent);
  }, abbr);
  ok('and it lands in time order inside the day',
    await rowsOf('TUE').then((v) => v.join('|') === 'Wake|Train|Walk|Physio|Trading|Read|Down'),
    await rowsOf('TUE'));

  /* The other branch: a block spoken in with a place shows it, beside
     its own name and nowhere else. */
  ok('the blocks that gained a place show it',
    await page.$$eval('.row .n em', (e) => e.map((x) => x.textContent))
      .then((v) => v.length === 2 && v.every((x) => x === 'Clinic')));

  /* ── nothing deletes without a way back ── */
  console.log('\n── the way back ──');
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('undo puts the week back',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED);

  /* Work is on five of the seven days, so one sentence has to take all
     five — a delete that stopped at the first match would look like it
     had worked. */
  await page.click('#scAdd');
  await page.waitForTimeout(120);
  await page.fill('#scSheetBody .field', 'delete Work');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('a spoken delete takes every day it is on',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED - 5);
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('and that is undoable too',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED);

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
    await page.$$eval('.row[data-id] .n', (n) => n.map((x) => x.textContent)).then((v) =>
      v.length === 1 && v[0] === 'Survivor'));
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
  ok('today is the only day marked', await page.$$eval('.day.is-today .day-name',
    (n) => n.map((x) => x.textContent)).then((v) => v.length === 1 && v[0] === 'Tuesday'));

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
  const sess = await page.$$eval('.day.is-open .wk-sh', (h) => h.map((x) => {
    let n = 0;
    for (let el = x.nextElementSibling; el && !el.classList.contains('wk-sh');
         el = el.nextElementSibling) if (el.dataset.id) n++;
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
       === await page.$$eval('.day.is-open .row[data-id]', (r) => r.length), sess);
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
  const heads = () => page.$$eval('.day.is-open .wk-sh b',
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

  /* ── the deck ── */
  ok('the shut cards carry bars rather than names, and the session breaks with them',
    await page.$$eval('.day:not(.is-open)', (d) => d.every((x) =>
      x.querySelectorAll('.wk-mini i').length > 0
      && x.querySelectorAll('.wk-mini hr').length > 0
      && getComputedStyle(x.querySelector('.day-card')).display === 'none')));
  /* At 76px the hours label does not wrap or clip — it runs straight
     out of the card and prints over the open one beside it. Overflow
     that ESCAPES its box is the kind a narrow column never warns you
     about, so it is measured rather than trusted. */
  const bleed = await page.$$eval('.day:not(.is-open)', (d) => d.map((x) => {
    const c = x.getBoundingClientRect();
    /* Walked rather than queried, and it STOPS at anything that clips.
       getBoundingClientRect reports an element's own box whether or not
       an ancestor is hiding most of it — the foil's turning square is
       578px inside a 76px card and draws none of it, so a flat
       querySelectorAll('*') reported six cards bleeding when nothing
       was. What is drawn is the question; a clipping box is where the
       drawing stops. */
    const over = (el) => {
      for (const k of el.children) {
        const r = k.getBoundingClientRect();
        if (r.width && r.right > c.right + 0.5) return true;
        const o = getComputedStyle(k).overflowX;
        if (o !== 'hidden' && o !== 'clip' && over(k)) return true;
      }
      return false;
    };
    return over(x);
  }));
  ok('and nothing inside a shut card draws outside it', bleed.every((b) => !b), bleed);
  ok('seven dots, with today lit',
    await page.$$eval('.wk-dots i', (i) => i.length === 7
      && i.filter((x) => x.classList.contains('on')).length === 1));
  /* scRender runs on every edit and on the tick that crosses midnight.
     Inserted without removing, the dots stack a new row under the last
     one every time — silent, and only visible after a few edits. */
  await page.evaluate(() => { window.scReRender && window.scReRender(); });
  ok('...and one row of them however many times the week redraws',
    await page.$$eval('.wk-dots', (d) => d.length) === 1);

  ok('exactly one class is live', await page.$$eval('.row.is-now',
    (r) => r.map((x) => x.querySelector('.n').textContent))
    .then((v) => v.length === 1 && v[0] === 'Trading'));
  ok('and the morning behind it is marked done',
    await page.$$eval('.row.is-past .n', (r) => r.map((x) => x.textContent).join('|'))
      .then((v) => v === 'Wake|Train|Walk'));

  /* ── a finished block has no time ──
     The figure is what you plan against and there is nothing left to
     plan about a morning that has happened, so the card empties out
     behind you as the day goes.

     MEASURED AS A BOX, never as a class or a computed `display`. This
     file has already had one check that read the property and was true
     throughout the bug it was watching for — what is claimed is that
     nothing is drawn, so nothing drawn is what is looked at.

     BOTH SIDES, and both have to be non-empty: "no past row draws a
     time" passes on a rule that hid every time on the card, and on a
     day with nothing behind you it passes by finding nothing at all. */
  const times = await page.$$eval('.day.is-today .row[data-id]', (rows) => {
    const drawn = (r) => r.querySelector('.t').getClientRects().length > 0;
    return { gone: rows.filter((r) => r.classList.contains('is-past')).map(drawn),
             kept: rows.filter((r) => !r.classList.contains('is-past')).map(drawn) };
  });
  ok('a finished block draws no time, and everything still ahead keeps one',
    times.gone.length > 0 && times.kept.length > 0
    && times.gone.every((v) => v === false)
    && times.kept.every((v) => v === true), times);

  /* And only TODAY. Every other card in the deck is a plan rather than
     a record — a Monday with its mornings rubbed out would be the deck
     claiming the week only runs forwards. */
  ok('...and no other day in the week loses one',
    await page.$$eval('.day:not(.is-today) .row[data-id] .t',
      (t) => t.length > 0 && t.every((x) => getComputedStyle(x).display !== 'none')));

  /* The running row is 13px wider than the rest so its rule can reach
     into the margin. Its columns still have to line up with every other
     row — and this is the only place in the file guaranteed to HAVE a
     running row, because the clock is frozen inside one. The check at
     the top of the file sees it only when the real time happens to fall
     inside a block, which is how a 13px step went unnoticed. */
  const align = await page.evaluate(() => {
    const day = document.querySelector('.day.is-today');
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
    const row = document.querySelector('.row.is-now');
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
      .find((r) => !r.classList.contains('is-now'));
    /* ── THE ACCENT IS ASKED FOR, NEVER TYPED ──
       This was the literal rgb(226, 35, 26), which was the shipped
       red — and the shipped palette is Lime now, so the assertion was
       measuring a colour that is nowhere on the page. Read off the
       root it holds whatever the palette is, which is the claim being
       made: the running row wears the ACCENT. */
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim();
    return { display: a.display, anim: a.animationName,
             rule: getComputedStyle(row).borderLeftColor,
             accent: accent,
             weight: w(row), plain: other ? w(other) : null };
  });
  const hexRGB = (h) => 'rgb(' + h.replace('#', '').match(/\w\w/g)
    .map((x) => parseInt(x, 16)).join(', ') + ')';
  ok('reduced motion does not build the sweep', calm.display === 'none', calm);
  ok('and the row is still marked without it',
    calm.rule === hexRGB(calm.accent) && calm.weight > calm.plain, calm);
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
    running: [...document.querySelectorAll('.day.is-open .row.is-now .n')]
      .map((n) => n.textContent).join(),
  }));
  ok('the head carries no second copy of the running block',
    quiet.parts.length === 0 && quiet.headBottom < 200, quiet);
  ok('...and the open card is where it is said', quiet.running === 'Trading', quiet);

  /* ── the head stays a label ──
     Read RELATIVE to the two figures around it, never as a px literal:
     a figure typed into a test stops meaning anything the day the type
     moves, and this file has already had one of those go quiet.

     What is claimed is rank, which is the thing that was nearly lost —
     a 38px wordmark was built here and taken back out, and this is what
     says it did not creep back. The name sits under the date it is
     printed beneath. */
  const head = await page.evaluate(() => {
    const px = (el) => parseFloat(getComputedStyle(el).fontSize);
    const t = document.querySelector('.title');
    const row = [...document.querySelectorAll('.day.is-open .row[data-id] .n')][0];
    return { title: px(t),
             when: px(document.querySelector('.hd-when')),
             row: px(row),
             fits: t.scrollWidth <= t.clientWidth + 1 };
  });
  /* Measured against a BLOCK'S NAME on the card, which is the thing
     you are meant to be reading. A 38px wordmark was built here once
     and taken back out; anything that outranks the schedule itself is
     the same mistake returning. */
  ok('the name is a label, not the top of the page',
    head.title <= head.row * 1.2 && head.fits, head);
  ok('...and the date sits under it, quieter', head.when < head.title, head);

  /* ── the date ──
     The one fact up here that nothing else on the screen carries. The
     day NAME is not with it and must not come back: today's card in
     the deck already prints it in the accent, and the reds scan above
     holds that to exactly one element. */
  /* The day name is BACK, and it is a reversal worth naming rather than
     quietly deleting the check that held the other way. It came off
     because today's card in the deck prints it in the accent and a
     lone name said twice means neither time. What brought it back is
     that the figure alone was not a date — a bare "29" over a title
     reads as a count. The rule it broke is intact: the head's copy is
     plain --dim, so the ACCENT still marks exactly one day name. */
  ok('the head names the day rather than showing a bare figure',
    await page.$eval('#scHdDate', (e) => /^[A-Z][a-z]+ \d/.test(e.textContent))
    && await page.$eval('#scHdDate',
      (e) => getComputedStyle(e).color !== 'rgb(226, 35, 26)'));

  /* ── the day's span ──
     A scale, so it is read as one: the ends are the day's OWN first and
     last minute rather than midnight to midnight, they are printed in
     24-hour time because a meridiem on an axis says what the position
     already says, and the dot is where the clock is between them.

     The dot's position is checked as ARITHMETIC on the seed rather
     than against a literal percentage — the frozen clock is 09:30 in a
     day that runs 05:45 to 23:00, and a percentage typed here would
     stop meaning anything the day the fixture moves. */
  const span = await page.evaluate(() => {
    const el = document.getElementById('scSpan');
    const rows = [...document.querySelectorAll('.day.is-today .row[data-id]')];
    const mins = (t) => { const m = /(\d+):(\d+)/.exec(t); return +m[1] * 60 + +m[2]; };
    return { a: document.getElementById('scSpanA').textContent,
             b: document.getElementById('scSpanB').textContent,
             an: document.getElementById('scSpanAn').textContent,
             bn: document.getElementById('scSpanBn').textContent,
             dot: parseFloat(document.getElementById('scSpanDot').style.left),
             fill: parseFloat(document.getElementById('scSpanFill').style.width),
             label: el.getAttribute('aria-label'),
             /* The times on the rows are the app's own render, so the
                span is checked against what the day actually says
                rather than against the fixture read a second time. */
             first: rows[0].querySelector('.t').textContent,
             last: rows[rows.length - 1].querySelector('.t').textContent,
             mins };
  });
  ok('the span runs from the day’s first block to its last',
    span.first.indexOf('05:45') === 0 && span.last.indexOf('23:00') > 0, span);
  /* ── the phone's own clock ──
     24-hour here because the context is pinned to en-GB, which is the
     half this person uses. The 12-hour half needs its own context and
     gets one at the foot of this file: a format that follows the
     device cannot be checked on one device. */
  ok('...written the way this phone writes a time',
    span.a === '05:45' && span.b === '23:00', span);
  ok('and it names both ends', span.an === 'Wake' && span.bn === 'Down', span);
  ok('the dot sits where the clock is between them',
    Math.abs(span.dot - (570 - 345) / (1380 - 345) * 100) < 0.5
    && Math.abs(span.fill - span.dot) < 0.001, span);
  /* It draws a picture, so it says the picture in words — the first and
     last block are the only facts on this screen nothing else repeats,
     and aria-hidden would have thrown them away. */
  /* ── the mark casts ──
     MEASURED ON COMPOSITED PIXELS, never off the declaration: a
     box-shadow written with a color-mix a browser cannot resolve
     drops the whole rule and reports the string all the same. Two
     samples on the page ABOVE the dot — one just outside its ring,
     one well clear of it — and the near one has to be tinted toward
     the accent while the far one is the page. Both halves matter: a
     bloom big enough to reach the far sample is a wash, not a glow. */
  {
    const at = await page.$eval('#scSpanDot', (e) => {
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top) };
    });
    const png = PNG.sync.read(await page.screenshot());
    const px = (x, y) => {
      const i = (png.width * Math.round(y * dpr) + Math.round(x * dpr)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    /* Redness against the other two channels, which is polarity-proof:
       it rises with the accent on a white page and on a black one. */
    const cast = (p) => p[0] - (p[1] + p[2]) / 2;
    const near = cast(px(at.x, at.y - 4));
    const far = cast(px(at.x, at.y - 26));
    ok(`the mark casts onto the page (${near.toFixed(0)} against ${far.toFixed(0)})`,
      near - far >= 8 && far < 8, { near, far });
  }

  ok('and it is spoken as well as drawn',
    /05:45 to 23:00/.test(span.label)
    && /Wake to Down/.test(span.label), span.label);

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
  /* ── the date reads as a date ──
     It was a bare 30px number over the title, which reads as a count.
     All three parts have to be there — a day name without an ordinal
     is the deck's own card, and an ordinal without a clock is a fact
     that never changes. Checked against the frozen date rather than a
     pattern, because "Tuesday 1st" is exactly the case an ordinal
     table gets wrong. */
  ok('the head names the day, the date and the clock',
    await page.$eval('#scHdDate', (e) => e.textContent) === 'Tuesday 1st · 09:30');
  /* 11, 12 and 13 are the three a naive `n % 10` puts an st, nd and rd
     on, and no frozen fixture can reach them from the 1st — so the
     clock is moved to one of them and moved back. The restore is not
     tidiness: every assertion below this was written under the Tuesday
     09:30 freeze, and leaving the page on a Friday in the middle of
     the month would silently change what they measure. */
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
  ok('...and the ordinal holds on a teen, where n % 10 does not',
    await page.$eval('#scHdDate', (e) => e.textContent) === 'Saturday 12th · 09:30',
    await page.$eval('#scHdDate', (e) => e.textContent));
  await freeze('2026-09-01T09:30:00');
  ok('...and the clock is back where the rest of this file left it',
    await page.$eval('#scHdDate', (e) => e.textContent) === 'Tuesday 1st · 09:30');

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

  /* ── one red, spent three ways ──
     The accent marks the day you are in, the block that is running, and
     where a block is — and nothing else. It was two; the place was
     added on top of a --sec of its own, and the second colour was taken
     back out in favour of the one already on the screen.

     Counted by KIND rather than by a total, because the total now
     depends on how many blocks happen to have a place typed on them and
     a check pinned to a number would have to be re-typed every time the
     seed changes. What is claimed is that nothing OUTSIDE those three
     kinds is ever red. Six coloured subjects would make the sheet a
     chart of nothing, and a rule is only worth writing down if
     something measures it. */
  const reds = await page.evaluate(() => {
    /* Asked for rather than typed, for the same reason as above: the
       palette this ships with has moved once and will again, and a
       literal here measures a colour that is nowhere on screen —
       which passes by finding nothing, in green. */
    const red = 'rgb(' + getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim().replace('#', '').match(/\w\w/g)
      .map((x) => parseInt(x, 16)).join(', ') + ')';
    const hit = [];
    document.querySelectorAll('.day-name, .row, .row .n, .row .n em, .row .t, '
      + '.title, .hd-when, .sp-t, .sp-ends span, .sp-fill, .sp-dot')
      .forEach((el) => {
        const s = getComputedStyle(el);
        if (s.color === red || s.backgroundColor === red || s.borderLeftColor === red)
          hit.push({ today: el.classList.contains('day-name'),
                     running: !!el.closest('.row.is-now'),
                     place: el.tagName === 'EM' && !el.classList.contains('wo'),
                     /* What you trained, which used to be a grey. It is
                        its own kind rather than folded in with the
                        place: both are an <em> inside .row .n, so a
                        check that asked only for the tag would call the
                        session a place and the scan would stop being
                        able to tell the two apart. */
                     did: el.classList.contains('wo'),
                     /* The span's dot is where you are in the day, which
                        is the running block seen one level up — the same
                        fact, so the same colour. Its TRACK and its spent
                        half are not, and are in the scan above to say so. */
                     now: el.id === 'scSpanDot',
                     what: el.className + ':' + (el.textContent || '').slice(0, 14) });
      });
    return hit;
  });
  ok('the red marks today, the running block, now, a place and what you '
    + 'trained — nothing else',
    reds.length > 0
    && reds.every((r) => r.today || r.running || r.place || r.now || r.did)
    && reds.filter((r) => r.today).length === 1
    && reds.filter((r) => r.now).length === 1
    && reds.some((r) => r.running) && reds.some((r) => r.place),
    /* Both halves of the claim in the payload, because they fail for
       opposite reasons and the message cannot tell you which: `stray`
       is something red that should not be, and a missing kind is the
       accent having quietly stopped marking something. Reporting only
       the strays printed an empty array when the place lost its
       colour — a failure whose evidence said nothing. */
    { stray: reds.filter((r) => !(r.today || r.running || r.place || r.now || r.did)),
      today: reds.filter((r) => r.today).length,
      running: reds.filter((r) => r.running).length,
      now: reds.filter((r) => r.now).length,
      place: reds.filter((r) => r.place).length });

  /* ── the sweep ──
     The running block carries a hairline that crosses it and keeps
     crossing it. "The element exists" is not the test — a sweep whose
     animation never starts, or whose keyframes cancel out, is present
     and still, and looks entirely correct in a screenshot. Two of the
     effects proposed alongside this one failed exactly that way. So
     the row is SAMPLED WHILE RUNNING and the frames have to differ. */
  console.log('\n── the sweep ──');
  const frames = await page.evaluate(() => new Promise((res) => {
    const row = document.querySelector('.row.is-now');
    if (!row) return res(null);
    const seen = new Set();
    const t0 = performance.now();
    (function tick() {
      /* getComputedStyle on a pseudo-element reports the animated
         transform as a live matrix, which is the value actually being
         composited rather than the one that was declared. */
      seen.add(getComputedStyle(row, '::after').transform);
      if (performance.now() - t0 < 900) requestAnimationFrame(tick);
      else res([...seen]);
    })();
  }));
  ok('the running block is actually moving', frames && frames.length > 4,
    frames && frames.slice(0, 3));
  ok('and it is a transform, so it never repaints',
    frames && frames.every((f) => /^matrix/.test(f)), frames && frames[0]);

  /* And it has to actually PAINT. A transform that keeps changing on an
     element nobody can see satisfies every check above — which is not
     hypothetical: the first build of this put the sweep at z-index -1,
     where it animated flawlessly behind the page's own white. Real
     pixels, two moments apart, have to differ. */
  const nowRow = await page.$('.row.is-now');
  const a = await nowRow.screenshot();
  await page.waitForTimeout(700);
  const b2 = await nowRow.screenshot();
  ok('and the row it is on visibly changes', !a.equals(b2));

  /* How much of the row the sweep is allowed to spoil. The trail is a
     13% wash and text over it measures about 7:1, so only the 2px line
     itself falls below the bar — roughly half a percent of a 340px
     row. The ceiling is one and a half percent, and it is calibrated
     rather than guessed: as built this measures 0.6%, a 20px line
     measures 5.6%, and a wash at 45% instead of 13% measures 2.2%.
     Three percent — the first number that looked reasonable — let that
     last one through, which is exactly the failure this is for. */
  const spoil = await (async () => {
    const box = await page.$eval('.row.is-now', (r) => {
      const b = r.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const png = PNG.sync.read(await page.screenshot());
    const ink = (await page.$eval('.row.is-now .t', (e) => getComputedStyle(e).color))
      .match(/[\d.]+/g).slice(0, 3).map(Number);
    let bad = 0, seen = 0;
    /* EVERY CSS PIXEL, and it was every other one. The leading edge is
       a 2px line, so at a step of two it lands on one sample or two
       depending on where it happens to be when the screenshot is
       taken — 0.83% or 1.67% of 120, with the 1.5% ceiling sitting
       exactly between them. The check was a coin flip on the phase of
       an infinite animation and it had nothing to do with the
       threshold: at a step of one the same line measures 0.4-0.8% of
       240 whichever way it falls, a 20px line still measures about 6%
       and a 45% wash about 2.2%, so the ceiling goes on discriminating
       and the measurement stops moving. */
    for (let dx = 6; dx < box.w - 6; dx += 1) {
      const i = (png.width * Math.round((box.y + box.h - 4) * dpr)
        + Math.round((box.x + dx) * dpr)) << 2;
      seen++;
      if (ratio(ink, [png.data[i], png.data[i + 1], png.data[i + 2]]) < 4.5) bad++;
    }
    return { pct: bad / seen * 100, seen };
  })();
  ok(`the sweep spoils ${spoil.pct.toFixed(1)}% of the row, under the 1.5% ceiling`,
    spoil.pct < 1.5, spoil);

  /* ── the sweep is ONE colour ──
     Its leading edge and its trailing wash are both meant to be the
     accent. They were two tokens holding the same colour — --red and a
     --red-rgb beside it carrying bare channels so the wash could take
     an alpha — and the comment on the second said, in as many words,
     that a palette colour retyped as a literal is a copy that drifts.
     It drifted the moment themes arrived: every theme set --red and
     none set --red-rgb, so on all twelve the edge followed the accent
     and the wash stayed 226,35,26. A mint hairline dragging a red
     smear, on a screen nobody thinks to re-check after a palette
     change.

     Asserted as a RELATIONSHIP rather than a value: whatever the accent
     is, the wash has to be made of it. A literal passes this on the
     shipped palette and fails on every theme, which is exactly the
     shape of the bug. */
  const oneColour = await page.evaluate(() => {
    const row = document.querySelector('.row.is-now');
    const a = getComputedStyle(row, '::after');
    /* Chrome serialises a resolved color-mix as color(srgb r g b / a)
       with the channels 0..1, and a plain colour as rgb()/rgba() with
       them 0..255. Both forms have to be read or the check passes on
       whichever one it happens to understand — which is how a test
       ends up measuring its own parser. */
    const chan = (t) => {
      const n = (t.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      return /^color\(/.test(t) ? n.map((c) => Math.round(c * 255)) : n;
    };
    const all = a.backgroundImage.match(/(?:rgba?|color)\([^)]*\)/g) || [];
    return { edge: chan(a.borderRightColor),
             wash: all.length ? chan(all[all.length - 1]) : null,
             raw: a.backgroundImage };
  });
  ok('the sweep’s wash is made of the same accent as its edge',
    oneColour.wash && oneColour.edge.every((c, i) =>
      Math.abs(c - oneColour.wash[i]) <= 2), oneColour);

  /* AND WITH THE ACCENT MOVED. The line above passes with the bug in
     it, because on the shipped palette the literal and the token hold
     the same red — the copy is only wrong once something changes it.
     A check that only ever runs on the default can never see a drifting
     copy, which is precisely why this one went out. */
  const moved = await page.evaluate(() => {
    document.documentElement.style.setProperty('--red', '#4FE0A8');
    const a = getComputedStyle(document.querySelector('.row.is-now'), '::after');
    const chan = (t) => {
      const n = (t.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      return /^color\(/.test(t) ? n.map((c) => Math.round(c * 255)) : n;
    };
    const all = a.backgroundImage.match(/(?:rgba?|color)\([^)]*\)/g) || [];
    const out = { edge: chan(a.borderRightColor),
                  wash: all.length ? chan(all[all.length - 1]) : null };
    document.documentElement.style.removeProperty('--red');
    return out;
  });
  ok('and it still is when the accent is changed under it',
    moved.wash && moved.edge.every((c, i) => Math.abs(c - moved.wash[i]) <= 2),
    moved);

  /* Spent on the one row that is running, like the red itself. */
  ok('nothing else on the sheet sweeps', await page.evaluate(() =>
    [...document.querySelectorAll('.row')].filter((r) =>
      getComputedStyle(r, '::after').animationName !== 'none').length) === 1);


  /* ═══ the objectives ═══
     The back of the day's card: what the day is FOR, as against what is
     on it. Per DATE rather than per weekday — the schedule repeats and
     a decision about today does not. */
  console.log('\n── the objectives ──');

  ok('the card starts face up', await page.$eval('.day.is-open',
    (d) => !d.classList.contains('is-flipped')));
  /* Both faces are in the document at once, so which one is SHOWING
     cannot be read off a property — it is which way the card is
     turned. */
  ok('...and both faces are built, one of them turned away',
    await page.$$eval('.day.is-open .wk-front, .day.is-open .wk-back',
      (f) => f.length) === 2);
  /* ── ON EVERY CARD, and DRAWN on the open one ──
     It was built `if (isOpen)` and the deck opens a card by toggling a
     class, so the control existed only on whichever day was open when
     the rail was last built: press any other day and its objectives
     were unreachable. Both halves are measured, because each passes on
     the other's bug — "seven exist" passes on seven drawn at once, and
     "one is drawn" passed for the whole life of the fault. */
  const turns = await page.evaluate(() => {
    const all = [...document.querySelectorAll('.wk-front .wk-turn')];
    return { built: all.length,
             drawn: all.filter((t) => t.getClientRects().length > 0).length,
             mine: all.filter((t) => t.closest('.day').classList.contains('is-open'))
               .every((t) => t.getClientRects().length > 0) };
  });
  ok('every day carries the turn control, and only the open one draws it',
    turns.built === 7 && turns.drawn === 1 && turns.mine, turns);

  /* Now that all seven exist, the pause rule has something to say: six
     conic gradients turning behind 76px cards would be a compositor
     pass a frame to draw what nobody can see. */
  ok('...and the six put away are not turning anything',
    await page.$$eval('.day:not(.is-open) .wk-front .tn-foil > i',
      (i) => i.length === 6
        && i.every((x) => getComputedStyle(x).animationPlayState === 'paused')));

  /* Reachable on a day that is not today, which is the whole point of
     the change: open another card and its control has to be the one
     that is drawn, named for ITS day. */
  /* Pressed by hand rather than through goTo, which is declared four
     hundred lines below this — a helper hoisted into a block it is
     defined after is a ReferenceError, not a convenience. */
  const openDow = async (dow) => {
    await page.evaluate((d) => {
      const li = [...document.querySelectorAll('#scRail .day')]
        .find((x) => +x.dataset.d === d);
      if (li && li.querySelector('.wk-face')) li.querySelector('.wk-face').click();
    }, dow);
    await page.waitForTimeout(420);
  };
  await openDow(4);
  ok('...and opening another day brings that day’s control with it',
    await page.$$eval('.wk-front .wk-turn', (all) => {
      const on = all.filter((t) => t.getClientRects().length > 0);
      return on.length === 1 && /Thursday/.test(on[0].getAttribute('aria-label'));
    }));
  await openDow(2);

  /* ── the pill wears what it opens ──
     Six affordances were rendered over the real card and what settled
     it is that none of the others said anything about the BACK. So
     the claim is not "it looks like a button" — it is that the pill
     carries the objectives face's own two marks, a sheen mixed from
     the palette and a rim that travels, and that the rim only turns
     where somebody can see it.

     The GROUND is read as a composited pixel, never off the cascade:
     it is four layers of color-mix over --paper, and a theme that
     resolved none of them would still report a background string. */
  const pill = await page.evaluate(() => {
    const t = document.querySelector('.day.is-open .wk-front .wk-turn');
    const f = t.querySelector('.tn-foil > i');
    const cs = getComputedStyle(t), fs = getComputedStyle(f);
    const mask = getComputedStyle(t.querySelector('.tn-foil'));
    const r = f.getBoundingClientRect();
    return {
      /* A ring is a mask with the middle taken out, and the composite
         is the whole mechanism: without `exclude` the turning square
         floods the pill and buries the glyph. */
      xor: (mask.maskComposite || mask.webkitMaskComposite || '')
        .split(',').map((v) => v.trim()).filter((v) => v !== 'exclude').length === 0,
      /* SQUARE, sized off the pill's height. A non-square leaves the
         ends unlit for part of every turn, which reads as a fault. */
      square: Math.abs(r.width - r.height) < 1 && r.height > t.getBoundingClientRect().height * 2,
      turning: fs.animationName === 'tnFoil' && fs.animationPlayState === 'running',
      sheen: (cs.backgroundImage.match(/gradient/g) || []).length,
      /* The BACK's control must not have one: that face already wears
         the card's own rim, and a second light 30px inside it is two
         lights on one object. */
      onBack: !!document.querySelector('.day.is-open .wk-back .tn-foil'),
    };
  });
  ok('the pill carries the objectives face’s sheen and its rim',
    pill.sheen >= 3 && pill.xor && pill.square, pill);

  /* ── and the BACK's control is not a second one ──
     The pill went on `.wk-turn` and reached both faces, so the way
     back to the schedule came up wearing a sheen chip on a sheen card
     — the same treatment twice, thirty pixels apart, on a face that
     already carries the card's own rim. Measured as the ground it
     actually paints, never as a class. */
  ok('...and the way back is a plain glyph, not a second pill',
    await page.$eval('.day.is-open .wk-back .wk-turn', (t) => {
      const cs = getComputedStyle(t);
      return !/gradient/.test(cs.backgroundImage) && !t.querySelector('.tn-foil');
    }));
  ok('...the rim turns, and only on the face you can see',
    pill.turning && !pill.onBack, pill);

  /* The glyph went from --dim on flat paper to --dim on four layers of
     wash. Measured on composited pixels rather than computed — this
     repo has shipped one thing that passed the arithmetic and read
     2.92:1 on screen — and to 3:1, because a glyph is a graphic. */
  {
    const b = await page.$eval('.day.is-open .wk-front .wk-turn',
      (e) => { const r = e.getBoundingClientRect();
               return { x: r.x, y: r.y, width: r.width, height: r.height }; });
    const png = PNG.sync.read(await page.screenshot({ clip: b }));
    const seen = new Map(), px = [];
    for (let i = 0; i < png.data.length; i += 4) {
      const p = [png.data[i], png.data[i + 1], png.data[i + 2]];
      px.push(p);
      const k = (p[0] >> 2) + ',' + (p[1] >> 2) + ',' + (p[2] >> 2);
      const e = seen.get(k);
      if (e) e.n++; else seen.set(k, { n: 1, p });
    }
    let ground = null;
    seen.forEach((e) => { if (!ground || e.n > ground.n) ground = e; });
    let ink = ground.p, far = -1;
    px.forEach((p) => { const d = Math.abs(lum(p) - lum(ground.p));
                        if (d > far) { far = d; ink = p; } });
    const r = +ratio(ink, ground.p).toFixed(2);
    ok(`the glyph still clears 3:1 on the sheen (${r}:1)`, r >= 3, { r, ground: ground.p });
  }

  await page.click('.day.is-open .wk-front .wk-turn');
  await page.waitForTimeout(700);
  ok('pressing it turns the card over', await page.$eval('.day.is-open',
    (d) => d.classList.contains('is-flipped')));

  /* ── and the pill's rim stops when its face turns away ──
     Written first as "paused on every card that is NOT open", which
     found nothing and failed for it: the control is built for the
     open card alone, so the shut cards have no rim to pause. The case
     that does exist is this one — the front is still in the document
     with the schedule turned away from you, and a conic gradient
     turning behind it costs a compositor pass a frame to draw what
     nobody can see. Same rule the card's own rim keeps, one level in.

     A check that finds nothing must not pass, which is why the count
     is asserted beside the state. */
  ok('...and the pill’s rim stops once its face is turned away',
    await page.$$eval('.day.is-open .wk-front .tn-foil > i',
      (i) => i.length === 1
        && getComputedStyle(i[0]).animationPlayState === 'paused'));

  /* ── and the pill is not DRAWN behind the back either ──
     backface-visibility held for everything on the front except this:
     the foil's turning square is an animated transform, so it is
     promoted to its own compositor layer, and a composited descendant
     of a backface-hidden ancestor is not reliably culled with it. On
     iOS the pill drew through the back MIRRORED — the back is a
     180-degree rotation, so a control 11px from the front's right edge
     landed on top of the day name on the left, and it reported as
     "the objective icon inside the title".

     Chromium does not reproduce it, so this asserts the property that
     makes it impossible rather than the symptom: a face turned away
     has no control to press, so nothing is drawn whichever way the
     engine would have culled it. A source check for the declaration
     would pass on a stylesheet where it had no effect. */
  ok('...and nothing of the front’s control is drawn behind the back',
    await page.$eval('.day.is-open .wk-front .wk-turn',
      (t) => getComputedStyle(t).visibility === 'hidden'
        && t.getClientRects().length > 0));
  /* MEASURED, not the class. backface-visibility is what makes this a
     card with a back rather than two panels that swap, and without it
     the schedule reads through the objectives mirror-imaged. */
  const facing = await page.evaluate(() => {
    const m = new DOMMatrix(getComputedStyle(
      document.querySelector('.day.is-open .wk-flip')).transform);
    return { a: Math.round(m.a * 100) / 100,
      back: getComputedStyle(document.querySelector('.day.is-open .wk-back'))
        .backfaceVisibility };
  });
  ok('...really turned, with the far side hidden rather than mirrored',
    facing.a <= -0.99 && facing.back === 'hidden', facing);
  ok('an empty back says what the face is for',
    (await page.$$eval('.day.is-open .ob-empty', (p) => p.length)) === 1);
  /* HEADED ANYWAY, and it was not. The argument for drawing the
     heading only over a list was sound and wrong about which nothing
     this is: an empty card is not a card with no heading, it is a card
     with no objectives yet, and the heading is the thing that says so.
     Without it the face opens on a plus and a sentence floating in a
     gradient, anchored to nothing. */
  ok('...and is headed all the same, so the empty face is still a list',
    (await page.$$eval('.day.is-open .ob-head b',
      (h) => h.map((x) => x.textContent).join())) === 'Main objectives');

  /* ── AND THE FRONT IS NOT DRAWN THROUGH IT ──
     The running row's sweep is an infinite transform animation, hence
     its own compositor layer, and a composited descendant of a
     backface-hidden ancestor is not reliably culled with it: on iOS the
     whole running row came through the objectives face MIRRORED, over
     the card you were reading. Chromium does not reproduce it, so this
     asserts the property that makes it impossible rather than the
     symptom — and it has to be checked AFTER the turn has settled,
     because the front is deliberately still visible for the first half
     of it. */
  ok('...with the front no longer drawn at all behind it',
    await page.$eval('.day.is-open .wk-front',
      (e) => getComputedStyle(e).visibility === 'hidden'));

  /* ── THE SAME CORNER ON BOTH FACES ──
     The control sat between the day and the hours on the front and at
     the end on the back, so you pressed one place to turn the card over
     and a different one to come back. Measured rather than eyeballed:
     the two controls have to land on the same pixels. */
  const corners = await page.evaluate(() => {
    /* LAYOUT coordinates, not client rects. The front sits inside a
       180-degree rotation while the card is turned over, so its rects
       come back MIRRORED — the control 11px from its own right edge
       reported 227px from the card's right, which is 238 minus 11: the
       same corner seen from behind. offsetLeft is unaffected by a
       transform, and "the same corner of its own face" is the claim
       being made anyway. */
    const box = (sel) => {
      const e = document.querySelector('.day.is-open ' + sel + ' .wk-turn');
      const h = e.parentElement;
      return { right: Math.round(h.offsetWidth - (e.offsetLeft + e.offsetWidth)),
               top: Math.round(e.offsetTop) };
    };
    return { f: box('.wk-front'), b: box('.wk-back') };
  });
  ok('the turn control is in the same corner on both faces',
    Math.abs(corners.f.right - corners.b.right) <= 1
    && Math.abs(corners.f.top - corners.b.top) <= 2, corners);

  /* ── writing one ── */
  const addObj = async (text) => {
    await page.click('.day.is-open .ob-add');
    await page.waitForTimeout(420);
    await page.fill('.sheet input[type=text]', text);
    await page.click('.sheet .btn.go');
    await page.waitForTimeout(520);
  };
  await addObj('Call a hundred clients');
  await addObj('Walk the dog before it gets dark');

  const obs = await page.$$eval('.day.is-open .ob', (b) => b.map((x) => ({
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
  const icSize = await page.$eval('.day.is-open .ob-ic', (e) => ({
    w: Math.round(e.getBoundingClientRect().width),
    t: Math.round(document.querySelector('.day.is-open .ob-t')
      .getBoundingClientRect().width),
  }));
  /* SMALL, and a marker rather than a picture: the sentence is the
     thing you read, and a glyph that competes with the text it labels
     has stopped labelling it. */
  ok('...small beside it, not competing with it',
    icSize.w <= 22 && icSize.t > icSize.w * 4, icSize);
  ok('the first is the main one, and it is the only one marked',
    obs.filter((o) => o.frog).length === 1 && obs[0].frog, obs);
  /* ── EVERY glyph takes the accent ──
     They were --dim with only the first in red, and marking one of five
     as important said the other four were not. The list is the
     important thing. What that costs is the frog's colour signal, so it
     is carried by stroke WEIGHT and a step of type weight instead —
     quieter than it was, and asserted rather than assumed. */
  const obMarks = await page.evaluate(() => {
    const g = (s) => getComputedStyle(document.querySelector(s));
    const frog = g('.day.is-open .ob.is-frog .ob-ic');
    const rest = g('.day.is-open .ob:not(.is-frog):not(.is-done) .ob-ic');
    /* THE ROOT, not the heading. This read its expected value off
       MAIN OBJECTIVES, which was the accent — and the day every title
       in the app went white it would have started asserting that the
       glyphs are --dim. A check that reads what it expects off another
       piece of the design moves with that piece. */
    const red = 'rgb(' + getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim().replace('#', '').match(/\w\w/g)
      .map((x) => parseInt(x, 16)).join(', ') + ')';
    const head = g('.day.is-open .ob-head b').color;
    return { frog: frog.stroke, rest: rest.stroke, red, head,
      fw: parseFloat(frog.strokeWidth), rw: parseFloat(rest.strokeWidth),
      ft: g('.day.is-open .ob.is-frog .ob-t').fontWeight,
      rt: g('.day.is-open .ob:not(.is-frog):not(.is-done) .ob-t').fontWeight,
      ink: getComputedStyle(document.documentElement)
        .getPropertyValue('--ink').trim(),
      words: [...document.querySelectorAll(
        '.day.is-open .ob:not(.is-done) .ob-t')].map((t) =>
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
    (await page.$$eval('.day.is-open .ob-n', (n) => n.length)) === 0);

  /* ── the face names itself, and the heading is a TITLE ──
     It was drawn in the accent, matching the glyphs under it. Every
     title in this app is white now and the accent is for the record,
     so the heading has to be told apart from the marks it heads —
     asserted from both sides: it is not the accent, and the glyphs
     under it still are. */
  ok('the list is headed, and the heading is not the accent the marks wear',
    (await page.$eval('.day.is-open .ob-head b', (e) => e.textContent))
      === 'Main objectives' && obMarks.head !== obMarks.red
      && obMarks.rest === obMarks.red, obMarks);

  /* ── re-ranking is one move, and always the same move ── */
  await page.click('.day.is-open .ob-add');
  await page.waitForTimeout(420);
  await page.click('.sheet .ob-edit .btn.off');
  await page.waitForTimeout(560);
  const ranked = await page.$$eval('.day.is-open .ob-t',
    (t) => t.map((x) => x.textContent));
  ok('making one the main objective moves it up, and nothing else moves',
    ranked[0] === 'Walk the dog before it gets dark'
    && ranked[1] === 'Call a hundred clients', ranked);

  /* ── ticking ── */
  await page.click('.day.is-open .ob >> nth=0');
  await page.waitForTimeout(460);
  ok('an objective ticks where it stands',
    await page.$eval('.day.is-open .ob', (b) => b.classList.contains('is-done')
      && b.getAttribute('aria-pressed') === 'true'));
  ok('...and the card stays turned over while you do it',
    await page.$eval('.day.is-open', (d) => d.classList.contains('is-flipped')));
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
    const t = document.querySelector('.day.is-open .ob.is-done .ob-tick');
    return { stroke: t && getComputedStyle(t).stroke,
      shown: t && +getComputedStyle(t).opacity,
      accent: rgb('--red'), ink: rgb('--ink') };
  });
  ok('...and the tick it draws is the accent, like every other tick',
    obTick.shown === 1 && obTick.stroke === obTick.accent
    && obTick.stroke !== obTick.ink, obTick);
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

  /* ── the rare card ──
     A sheen mixed from the palette and never a literal: thirteen themes
     move --red and --ink together, so a gradient written in hex would
     be somebody else's card on twelve of them. */
  const sheen = await page.$eval('.day.is-open .wk-back',
    (e) => getComputedStyle(e).backgroundImage);
  ok('the back is a gradient rather than a flat fill',
    (sheen.match(/gradient/g) || []).length >= 2, sheen.slice(0, 80));
  ok('...mixed from the palette, with no literal colour in it',
    !/#[0-9a-f]{3,8}/i.test(sheen), sheen.slice(0, 160));

  /* And it stays a SHEEN. Everything on this face is drawn at full
     strength, so the wash must not become a ground the words then have
     to fight. Measured on composited pixels, and polarity-agnostic —
     seven of the thirteen palettes are dark. */
  const obInk = await (async () => {
    const box = await page.$eval('.day.is-open .ob:not(.is-done) .ob-t', (e) => {
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
  ok('an objective on the rare card still clears 4.5:1', obInk >= 4.5, obInk);

  /* ── the foil edge ──
     A light that keeps going round the rim. The ring is a mask on the
     outer box and the thing that turns is masked BY it — rotating the
     ring itself would swing a rounded rectangle round on its corner. */
  const foil = await page.evaluate(() => {
    const f = document.querySelector('.day.is-open .ob-foil');
    const i = f && f.firstElementChild;
    if (!i) return null;
    const fs = getComputedStyle(f), is = getComputedStyle(i);
    return { mask: (fs.maskComposite || fs.webkitMaskComposite || ''),
      pad: fs.paddingTop, dur: parseFloat(is.animationDuration),
      count: is.animationIterationCount, play: is.animationPlayState,
      bg: is.backgroundImage.slice(0, 40),
      w: Math.round(i.getBoundingClientRect().width),
      h: Math.round(i.getBoundingClientRect().height) };
  });
  ok('the rim is a masked ring with something turning inside it',
    foil && /exclude|xor/.test(foil.mask) && parseFloat(foil.pad) > 0
    && /conic/.test(foil.bg), foil);
  ok('...and it LOOPS rather than running once',
    foil.dur > 0 && foil.count === 'infinite', foil);
  /* SQUARE, and sized off the card's height. A 200%-by-200% box is not
     square, and at 45 degrees a non-square leaves the ring's corners
     unlit for part of every turn — a gap crossing a corner reads as a
     fault rather than as a highlight. */
  ok('...turning a square, so no corner of the rim ever goes unlit',
    Math.abs(foil.w - foil.h) <= 2, foil);

  /* ── PAUSED unless the face is towards you ──
     Both faces of all seven cards are in the document at all times.
     Left running, that is seven rotating conic gradients, each in its
     own masked layer, costing a compositor pass a frame to draw
     something nobody can see. */
  ok('it runs on the card you are looking at', foil.play === 'running', foil.play);
  const asleep = await page.$$eval('.day:not(.is-flipped) .ob-foil > i',
    (n) => n.map((x) => getComputedStyle(x).animationPlayState));
  ok('...and is paused on every face that is turned away',
    asleep.length === 6 && asleep.every((p) => p === 'paused'), asleep);

  /* Still, not gone: the rim is the thing that was asked for, and what
     the setting turns off is the travelling. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(140);
  const foilStill = await page.$eval('.day.is-open .ob-foil > i', (i) => ({
    name: getComputedStyle(i).animationName,
    bg: /conic/.test(getComputedStyle(i).backgroundImage) }));
  ok('asked to sit still it stops travelling, and the rim stays',
    foilStill.name === 'none' && foilStill.bg, foilStill);
  await page.emulateMedia({ reducedMotion: null });
  await page.waitForTimeout(140);

  /* ── turning back ── */
  await page.click('.day.is-open .wk-back .wk-turn');
  await page.waitForTimeout(700);
  ok('and it turns back to the schedule',
    await page.$eval('.day.is-open', (d) => !d.classList.contains('is-flipped')));
  /* The turn is NOT remembered. An objective is for today, and a card
     found face-down tomorrow morning is the app having kept the wrong
     half of a decision. */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(340);
  ok('...and a card is never found face-down on the next visit',
    await page.$$eval('.day.is-flipped', (d) => d.length) === 0);
  ok('...though what was written on it survives',
    await page.$$eval('.day.is-open .ob', (b) => b.length) === 2);

  /* Each view is its own labelled tab, so a view is asked for by
     name rather than reached by pressing a cycling button until it
     turns up. A test that counts presses has to be re-counted every
     time a stop is added, and the one time it is not, it silently
     measures the wrong screen. */
  const show = async (v) => {
    for (let i = 0; i < 3; i++) {
      const at = await page.evaluate(() => ({
        tally: !document.getElementById('scTally').hidden,
        friends: !document.getElementById('scFriends').hidden,
        rail: !document.getElementById('scRail').hidden,
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
    return { rail: box('scDeckWin'), tally: box('scTally'),
             friends: box('scFriends'), dots: box('.wk-dots') };
  });
  for (const [v, want] of [['list', 'rail'],
                           ['tally', 'tally'], ['friends', 'friends']]) {
    await show(v);
    await page.waitForTimeout(160);
    const on = await onScreen();
    ok(`on ${v}, ${want} is the only view drawing`,
      on[want] && ['rail', 'tally', 'friends']
        .filter((k) => k !== want).every((k) => !on[k]), { v, on });
    /* The dots are a sibling of the rail rather than a child — a page
       indicator that scrolls sideways with the cards it indicates is
       not an indicator — so they are a second thing to hide, and they
       were the half that got left behind. */
    ok(`...and the deck's dots go with it`, on.dots === (want === 'rail'),
      { v, dots: on.dots });
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
  const openName = () => page.$$eval('.day.is-open .day-name',
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
      const li = [...document.querySelectorAll('#scRail .day')]
        .find((x) => +x.dataset.d === d);
      const f = li && li.querySelector('.wk-face');
      if (!f) return false;
      f.click();
      return true;
    }, dow);
    if (!hit) return false;
    await page.waitForTimeout(420);
    return +(await page.$eval('.day.is-open', (e) => e.dataset.d)) === dow;
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
  /* ── and it lands in the MIDDLE, including at the ends ──
     A scroller stops at 0, so without a lead-in the first card cannot
     be centred however far it is scrolled: Monday opened against the
     left edge while every other day sat in the middle. The room either
     side is half the difference between the rail and an open card, done
     in CSS — nothing depends on it being right now that a press is what
     opens a card, so it is arithmetic rather than a measured constant.

     Every day, not just the ends: the ends are where it showed, not the
     whole of it. Measured on composited geometry, because the value
     that matters is where the card actually is. */
  const offCentre = async () => page.evaluate(() => {
    const win = document.getElementById('scDeckWin');
    const o = win.querySelector('.day.is-open');
    const wb = win.getBoundingClientRect(), r = o.getBoundingClientRect();
    return Math.round(Math.abs((r.left + r.width / 2) - (wb.left + wb.width / 2)));
  });
  const strays = [];
  for (const dow of [1, 2, 3, 4, 5, 6, 0]) {
    await goTo(dow);
    const off = await offCentre();
    if (off > 2) strays.push(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow]
      + ' off by ' + off);
  }
  ok('every day, opened, sits in the middle of the deck',
    strays.length === 0, strays);

  /* And the shut cards are real buttons, which is what makes the week
     reachable without a swipe at all. */
  ok('every shut card is a named, focusable control',
    await page.$$eval('.day:not(.is-open) .wk-face', (f) => f.length === 6
      && f.every((x) => x.tagName === 'BUTTON'
        && /^Open \w+$/.test(x.getAttribute('aria-label') || ''))),
    await page.$$eval('.day:not(.is-open) .wk-face',
      (f) => f.map((x) => x.getAttribute('aria-label'))));
  /* On the open card it is put away — a transparent button over the
     rows would swallow every press meant for a block. */
  ok('...and the open card has none over its rows',
    await page.$eval('.day.is-open .wk-face',
      (f) => getComputedStyle(f).display) === 'none');
  await goTo(2);

  /* ── the card opens rather than jumping open ──
     76px to 268px in one frame, with the deck re-centring on it in the
     same frame, read as a snap on the end of your own swipe rather than
     as a card turning to face you. Both eased now. The width has to be
     a length in both states for there to be anything to interpolate,
     which is what is actually asserted — a transition naming `width`
     over an `auto` does nothing and looks identical in the stylesheet. */
  const ease = await page.evaluate(() => {
    const open = document.querySelector('.day.is-open');
    const shut = document.querySelector('.day:not(.is-open)');
    const a = getComputedStyle(open), b = getComputedStyle(shut);
    return { prop: a.transitionProperty, dur: a.transitionDuration,
             openW: a.width, shutW: b.width };
  });
  ok('the card animates its own width', /width/.test(ease.prop)
    && parseFloat(ease.dur) > 0, ease);
  ok('...and both states are a length, so there is something to animate',
    /^\d/.test(ease.openW) && /^\d/.test(ease.shutW)
    && parseFloat(ease.openW) > parseFloat(ease.shutW), ease);

  /* Motion is the entire subject of that rule, so this is a real
     setting rather than a formality. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(120);
  ok('...and asked to sit still, it does',
    await page.$eval('.day.is-open', (e) =>
      parseFloat(getComputedStyle(e).transitionDuration) === 0));
  await page.emulateMedia({ reducedMotion: null });
  await page.waitForTimeout(120);

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
    const win = document.getElementById('scDeckWin');
    const el = win.querySelector('.day.is-open');
    const r = el.getBoundingClientRect(), b = win.getBoundingClientRect();
    return Math.round(Math.abs((r.left + r.width / 2) - (b.left + b.width / 2)));
  });
  ok('...and back in the middle of the deck rather than off the side',
    centred <= 6, centred);
  /* Put the week back on today for everything that follows. */
  ok('...and the deck goes back to today when asked', await goTo(2)
    && (await openName()) === 'Tuesday', await openName());

  /* And the card it lands on is one you can actually reach: a deck left
     scrolled to Monday puts today's rows in a 76px column whose own
     container is display:none, so every row measures zero and nothing
     on this screen can be pressed. */
  ok('...with today drawn wide enough to hold its rows',
    await page.$eval('.day.is-open', (d) => d.getBoundingClientRect().width) > 200);
  ok('...and its rows on screen',
    await page.$eval('.day.is-today .row[data-id]',
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
  const perDay = await page.$$eval('.day', (days) => days.map((li) => ({
    day: li.querySelector('.ob-day').textContent,
    obj: [...li.querySelectorAll('.ob-t')].map((t) => t.textContent).join('|'),
  })));
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
    let low = 99, at = 0;
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
        const near = (q) => Math.abs(q[0] - col[0]) + Math.abs(q[1] - col[1])
                          + Math.abs(q[2] - col[2]) < 110;
        for (let x = 2; x < b2.width - 2; x += 3) {
          for (let yy = 1; yy < b2.height - 1; yy += 1) {
            let ok2 = true;
            for (let d = -2; d <= 2 && ok2; d++)
              if (near(px(b2.x + x + d, b2.y + yy)) || near(px(b2.x + x, b2.y + yy + d))) ok2 = false;
            if (!ok2) continue;
            const r = ratio(col, px(b2.x + x, b2.y + yy));
            if (r < low) { low = r; at = y; }
          }
        }
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    return { low: +low.toFixed(2), at };
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
      const r = document.getElementById('scDeckWin').getBoundingClientRect();
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
    const at = await page.evaluate(() => {
      const d = document.querySelector('.wk-dots').getBoundingClientRect();
      return { x: Math.round(d.left / 2), y: Math.round(d.top + d.height / 2) };
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
    corner.every((c) => c < 60) && Math.max.apply(null, corner) > 4, corner);

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
    ok('and every glyph is 22px, not the 300x150 an unsized svg becomes',
      got.every((g) => g.w === 22 && g.h === 22), got.map((g) => [g.w, g.h]));
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
    rail: document.getElementById('scRail').hidden,
    span: document.getElementById('scSpan').hidden,
    cards: document.querySelectorAll('.ty-card').length,
    cap: document.getElementById('scTallyCap').textContent,
  }));
  ok('the tally is a third view and it replaces the week',
    tal.up && tal.rail && tal.span, tal);
  ok('five cards, and the list is not editable from anywhere',
    tal.cards === 5, tal);
  ok('and nothing is logged on a fresh day', tal.cap === '0 of 5 today', tal);

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
      svg: !!c.querySelector('.ty-i'),
      paths: c.querySelectorAll('.ty-i path').length,
      /* getBBox on the <g> is in the glyph's OWN 24-unit space, before
         the translate that centres it in the ring — so this is the
         drawing measured against the box it was drawn for. Half the
         1.8 stroke is added by hand, because getBBox reports the path
         and not the ink. */
      fits: (() => { const b = c.querySelector('.ty-i').getBBox(), h = 0.9;
                     return [+(b.x - h).toFixed(2), +(b.y - h).toFixed(2),
                             +(b.x + b.width + h).toFixed(2),
                             +(b.y + b.height + h).toFixed(2)]; })(),
      ring: !!c.querySelector('.ty-ring'),
      label: c.getAttribute('aria-label'),
      sub: c.querySelector('.ty-sub').textContent,
    })));
  ok('every card carries a glyph', marks.every((m) => m.svg), marks.map((m) => m.item));
  /* Steps is TWO prints and every other glyph is one drawing. An
     assertion on the count is what stops the pair quietly becoming a
     single foot again. */
  ok('and Steps is a pair of them',
    marks.find((m) => m.item === 'p').paths === 2,
    marks.map((m) => m.item + ':' + m.paths).join());
  ok('and every one of them is inside a ring', marks.every((m) => m.ring));
  /* THE CLIPPING CHECK. Steps sat half a stroke above its own viewBox
     and the ring cut a flat line across the top print — visible, and
     invisible to every other assertion here, because the element was
     present, the right size and the right shape. A drawing that leaves
     the box it was drawn for is decidable from the geometry, so it is
     decided rather than looked at. */
  ok('no glyph is drawn outside the box the ring clips it to',
    marks.every((m) => m.fits[0] >= 0 && m.fits[1] >= 0
      && m.fits[2] <= 24 && m.fits[3] <= 24),
    marks.map((m) => m.item + ':' + m.fits.join()).join(' '));
  ok('and every card still SAYS its name',
    ['Train', 'Mind', 'Steps', 'Fuel', 'Water']
      .every((n, i) => marks[i].label.indexOf(n) === 0),
    marks.map((m) => m.label.slice(0, 12)).join(' | '));

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
        return { sub: c.querySelector('.ty-sub').textContent,
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
    ok('and one with nothing logged says nothing', figs.f.sub === '', figs.f.sub);
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
      const g = await m.$('.ty-i');
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
  const stored = await page.evaluate(() => {
    document.querySelector('.ty-card[data-item="t"]').click();
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
    card: document.querySelector('.ty-card[data-item="t"]').className,
    via: document.querySelector('.ty-card[data-item="t"] .ty-sub').textContent,
    cap: document.getElementById('scTallyCap').textContent,
    log: localStorage.getItem('sched.log.v1'),
  }));
  ok('ticking an item ticks the block behind it',
    /is-|on/.test(linked.card) && linked.via === 'from Train'
    && /\{"\d{4}-\d{2}-\d{2}":\{".+":1\}\}/.test(linked.log), linked);
  ok('and the count moves with it', linked.cap === '1 of 5 today', linked);

  /* ── the link runs the OTHER way too ──
     This is the half that was missing, and the failure it caused is the
     quiet kind: the tally said you had trained and the week still drew
     the block undone. Two records disagreeing about the same morning.
     Driven through the real editor, because that is where the control
     had to go — the row is a <button> and a button inside a button is
     invalid, the same trap the folding panels have a rule about. */
  await show('list');
  await page.evaluate(() => {
    [...document.querySelectorAll('.day.is-today .row[data-id]')]
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
    ok('Done today, Save and the day chips are one white fill',
      onLook.bg === onLook.ink && onLook.chip === onLook.ink
      && onLook.go === onLook.ink && onLook.bg !== onLook.accent, onLook);

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
    [...document.querySelectorAll('.day.is-today .row[data-id]')]
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
    [...document.querySelectorAll('.day.is-today .row[data-id]')]
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
      return { late: c.classList.contains('late'), s: c.querySelector('.ty-sub').textContent };
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
  /* STREAK, not run — one word for it, everywhere. The panel a row
     opens says "longest streak" beside four other figures, and the foot
     of the same screen saying "longest run" for the same idea is the
     screen using two names for one thing in one glance. */
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

  /* ── two targets, and neither inside the other ──
     A <button> inside a <button> is invalid and collapses to one press,
     which would silently make the strip un-openable while looking
     exactly right. The row is one element and the strip is its sibling,
     and that is the thing worth asserting. */
  const rows = await page.evaluate(() => {
    const r = [...document.querySelectorAll('.ty-row')];
    return {
      n: r.length,
      nested: r.some((x) => x.querySelector('button button')),
      pairs: r.every((x) => x.querySelector(':scope > .ty-card')
                         && x.querySelector(':scope > .ty-hist')),
      taps: r.map((x) => {
        const a = x.querySelector('.ty-card').getBoundingClientRect();
        const b = x.querySelector('.ty-hist').getBoundingClientRect();
        return [Math.round(Math.min(a.width, a.height)), Math.round(b.width)];
      }),
      labels: r.map((x) => x.querySelector('.ty-hist').getAttribute('aria-label')),
    };
  });
  ok('five rows, each a card and a strip side by side',
    rows.n === 5 && rows.pairs, rows);
  ok('and the strip is a SIBLING of the card, never nested inside it',
    !rows.nested, rows);
  ok('both halves of a row clear 44px for a thumb',
    rows.taps.every(([a, b]) => a >= 44 && b >= 44), rows.taps);
  ok('and the strip says what it opens, since it draws no words',
    rows.labels.every((l) => /history/.test(l || '')), rows.labels);

  /* Pressed the way a thumb presses it — the handler is what has to
     open the panel, not a call to the function behind it. */
  await page.click('.ty-row:has([data-item="p"]) .ty-hist');
  await page.waitForTimeout(220);

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
    const a1 = document.querySelector('.ty-row .ty-arc');
    const s1 = document.querySelector('.ty-hist svg');
    const c1 = document.querySelector('.ty-cal');
    if (!a1 || !s1 || !c1) return { probe: [!!a1, !!s1, !!c1] };
    const arc = getComputedStyle(a1).stroke;
    const fills = (root, sel) => [...root.querySelectorAll(sel)]
      .map((r) => r.getAttribute('fill'));
    const strip = fills(s1, 'rect');
    const cal = fills(c1, ':scope > rect');
    return { red: rgb(hex('--red')), off: rgb(hex('--tick-off')), arc,
      stripLit: strip.filter((f) => f === 'var(--red)').length,
      stripOff: strip.filter((f) => f === 'var(--tick-off)').length,
      calLit: cal.filter((f) => f === 'var(--red)').length,
      calOff: cal.filter((f) => f === 'var(--tick-off)').length,
      other: strip.concat(cal).filter((f) =>
        f !== 'var(--red)' && f !== 'var(--tick-off)') };
  });
  ok('the ring, the strip and the calendar all draw a kept day in the accent',
    tyMark.arc === tyMark.red && tyMark.stripLit > 0 && tyMark.calLit > 0
    && tyMark.other.length === 0, tyMark);
  ok('...and a missed one is still drawn, in neither',
    tyMark.stripOff > 0 && tyMark.calOff > 0 && tyMark.red !== tyMark.off, tyMark);

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
    await page.click('.ty-row:has([data-item="t"]) .ty-hist');
    await page.waitForTimeout(300);

    const read = () => page.evaluate(() => {
      const cal = document.querySelector('.ty-cal');
      const rects = [...cal.querySelectorAll(':scope > rect')];
      const w = rects.map((r) => +(+r.getAttribute('width')).toFixed(2));
      const strip = [...document.querySelector('.ty-hist svg').querySelectorAll('rect')]
        .map((r) => ({ w: +(+r.getAttribute('width')).toFixed(2), f: r.getAttribute('fill') }));
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
        stripSkip: strip.filter((s) => s.f === 'var(--tick-off)'
          && s.w < Math.max(...strip.map((x) => x.w))).length,
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
    /* stripSkip > 0 as well as equal: with the third mark drawn at the
       full size both counts are zero and an equality passes on the bug
       it is about. */
    ok('...and the strip beside the row draws it the same way',
      three.stripSkip > 0 && three.stripSkip === three.skip, three);
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
    await page.click('.ty-row:has([data-item="t"]) .ty-hist');
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
        [...document.querySelectorAll('.day.is-today .row[data-id]')]
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
      hrs: document.querySelector('.day.is-today .wk-hrs').textContent }));
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
      const r = [...document.querySelectorAll('.day.is-today .row[data-id]')]
        .find((x) => x.querySelector('.n').textContent.startsWith('Train'));
      const cs = getComputedStyle(r.querySelector('.n'));
      const log = JSON.parse(localStorage.getItem('sched.log.v1') || '{}');
      return { cls: r.className, line: cs.textDecorationLine,
        hrs: document.querySelector('.day.is-today .wk-hrs').textContent,
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
       exactly the thing you set in advance. Measured on a card the
       deck draws that is not today — Done is refused there and Off is
       not, which is the whole difference between the two resolvers. */
    const ahead = await page.evaluate(() => {
      /* THE WEEKDAY WHOSE MOST RECENT OCCURRENCE IS FOUR DAYS BACK,
         worked out rather than picked. scDateOfDow looks BACKWARD over
         the two-day window, so "the far end of the deck" is not the
         same thing as "outside the window" — on a Tuesday the deck's
         last card is Sunday and Sunday was two days ago, which IS open.
         Four back is outside it on every day of the week. */
      const w = (new Date().getDay() + 3) % 7;
      const cards = [...document.querySelectorAll('.day')];
      cards[(w + 6) % 7].querySelector('.wk-face').click();
      return w;
    });
    await page.waitForTimeout(520);
    await page.evaluate(() => {
      document.querySelector('.day.is-open .row[data-id]').click();
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
  for (const id of ['p', 'f', 'w', 't', 'm']) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(120);
    await page.click('.ty-row:has([data-item="' + id + '"]) .ty-hist');
    await page.waitForTimeout(200);
    figs[id] = await page.evaluate(() => ({
      title: document.querySelector('.ty-title').textContent,
      caps: [...document.querySelectorAll('.ty-stats span')].map((e) => e.textContent),
      units: [...document.querySelectorAll('.ty-stats b i')].map((e) => e.textContent),
      hint: document.querySelector('.ty-hint').textContent,
    }));
  }
  ok('every item’s longest run is called a STREAK',
    Object.values(figs).every((f) => f.caps.includes('longest streak')), figs.p);
  ok('a tick gets shape rather than an average it cannot have',
    figs.t.caps.join('|') === 'longest streak|days on now|days a week'
    && figs.m.caps.indexOf('average a day') < 0, [figs.t.caps, figs.m.caps]);
  ok('a number gets its average and its extreme',
    figs.p.caps[0] === 'average a day' && figs.p.caps[1] === 'your best', figs.p.caps);
  ok('but a calorie count’s biggest day is not called your BEST',
    figs.f.caps[1] === 'your highest'
    && !Object.values(figs).some((f) => f.caps.includes('your best') && f.title === 'Fuel'),
    figs.f.caps);
  ok('and the unit rides the figure, so 2,631 and 2.7 are not read alike',
    figs.f.units.length === 2 && figs.f.units[0] === 'kcal'
    && figs.w.units[0] === 'L' && figs.t.units.length === 0,
    { f: figs.f.units, w: figs.w.units, t: figs.t.units });
  ok('and the span is the same 26 weeks on every one of them',
    Object.values(figs).every((f) => / of 182 days/.test(f.hint)), figs.w.hint);

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
    /* The FIVE captions across the two kinds each get their own mark,
       so a copy-paste that gave two figures the same glyph is caught.
       Collected over every item rather than the one on screen. */
    const paths = {};
    for (const id of ['t', 'p', 'f']) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(120);
      await page.click('.ty-row:has([data-item="' + id + '"]) .ty-hist');
      await page.waitForTimeout(200);
      (await page.evaluate(() => [...document.querySelectorAll('.ty-stats span')]
        .map((s) => [s.textContent.trim(),
                     s.querySelector('svg').innerHTML.slice(0, 40)])))
        .forEach(([cap, d]) => { paths[cap.replace(/^\d+ /, '')] = d; });
    }
    const kinds = Object.keys(paths);
    ok('every caption either kind can show is marked', kinds.length === 6, kinds);
    /* SIX CAPTIONS, FIVE MARKS, and the pair is deliberate: "your best"
       and "your highest" are the same figure, named without the praise
       on the one number you do not want more of. They share a glyph
       because they ARE one — asserting six distinct marks would be
       asserting that the wording change made it a different figure. */
    ok('and the marks are five, because two of the captions are one figure',
      new Set(Object.values(paths)).size === 5,
      Object.entries(paths).map(([k, v]) => k + ' → ' + v.slice(0, 18)));
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
  await page.click('.ty-row:has([data-item="t"]) .ty-hist');
  await page.waitForTimeout(180);
  await page.click('.ty-veil', { position: { x: 6, y: 6 } });
  await page.waitForTimeout(160);
  const shutTap = await page.evaluate(() => document.getElementById('scTyVeil').hidden);
  const stranded = await page.evaluate(() => {
    document.querySelector('.ty-row .ty-hist').click();
    document.querySelector('.tab[data-view="list"]').click();
    return { veil: document.getElementById('scTyVeil').hidden,
             gone: document.getElementById('scDeckWin').getBoundingClientRect().height > 1 };
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
      await page.click('.ty-row:has([data-item="f"]) .ty-hist');
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
    round.cards.length === 5 && round.cards.every((v) => v === 0), round.cards);
  ok('and the two circles are circles — the add button and your picture',
    /50%/.test(round.prime) && /50%/.test(round.face), round);
  ok('and nothing else in the app is rounded at all',
    round.others.length === 0, round.others);

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
    rail: document.getElementById('scRail').hidden,
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
             red: getComputedStyle(document.documentElement).getPropertyValue('--red').trim() };
  });
  ok('your picture is round', pic.round === '50%', pic);
  ok('and with no photo it is the face — two eyes and a mouth',
    pic.marks === 3, pic);
  ok('drawn in the palette’s own accent',
    pic.tile.toLowerCase() === pic.red.toLowerCase(), pic);

  /* MOVED, because the line above passes on a face painted with the
     shipped red typed in as a literal. */
  const faceMoved = await page.evaluate(() => {
    document.documentElement.style.setProperty('--red', '#4FE0A8');
    document.documentElement.style.setProperty('--on-red', '#04141A');
    document.querySelector('.pic-item').click();
    const el = document.querySelector('.sheet .pic svg');
    const got = { tile: el.querySelector('rect').getAttribute('fill'),
                  on: el.querySelector('circle').getAttribute('fill') };
    document.documentElement.style.removeProperty('--red');
    document.documentElement.style.removeProperty('--on-red');
    return got;
  });
  ok('and it follows the palette when the palette is changed under it',
    faceMoved.tile === '#4FE0A8' && faceMoved.on === '#04141A', faceMoved);

  /* The mouth is offset, which is the whole character of it. Centred it
     is a generic smiley — asserted on the path so a later tidy-up
     cannot quietly symmetrise it. */
  const mouth = await page.evaluate(() => {
    const d = document.querySelector('.sheet .pic svg path').getAttribute('d');
    const n = d.match(/[\d.]+/g).map(Number);
    return { d, x0: n[0], x1: n[4], eyes: [...document.querySelectorAll('.sheet .pic svg circle')]
      .map((c) => +c.getAttribute('cx')) };
  });
  ok('the mouth is offset, not centred',
    (mouth.x0 + mouth.x1) / 2 > 55 && mouth.x1 > Math.max(...mouth.eyes), mouth);

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
  const wheelUp = await page.evaluate(() => {
    const w = document.querySelector('.cw');
    if (!w) return { chips: document.querySelectorAll('.theme').length };
    const r = w.getBoundingClientRect();
    const cs = getComputedStyle(w);
    return { chips: document.querySelectorAll('.theme').length,
      heads: document.querySelectorAll('.theme-h').length,
      w: Math.round(r.width), h: Math.round(r.height),
      left: r.left, right: r.right,
      round: cs.borderTopLeftRadius, touch: cs.touchAction,
      role: w.getAttribute('role'), now: w.getAttribute('aria-valuenow'),
      min: w.getAttribute('aria-valuemin'), max: w.getAttribute('aria-valuemax'),
      text: w.getAttribute('aria-valuetext'), tab: w.tabIndex,
      mid: !!w.querySelector('.cw-mid'),
      stops: (cs.backgroundImage.match(/rgb\([^)]*\)/g) || [])
        .map((v) => v.match(/\d+/g).map(Number)) };
  });
  ok('the thirteen chips are gone and one wheel is in their place',
    wheelUp.chips === 0 && wheelUp.heads === 0
    && wheelUp.w === 170 && wheelUp.h === 170 && wheelUp.mid, wheelUp);
  /* THE SIXTH ROUNDED THING, and it is named in app.css rather than
     smuggled in under the two circles' permission — the rule at the top
     of that file is that the exceptions are named. This one does not
     test the rule: a colour wheel that is not round is not one. */
  ok('...whole on a 390px sheet, round, and owning its own gesture',
    wheelUp.left >= 0 && wheelUp.right <= 390
    && /50%|85px/.test(wheelUp.round) && wheelUp.touch === 'none', wheelUp);
  /* A drag reaches neither a keyboard nor a screen reader, and this is
     the only way to set the colour — so unlike the row's long press it
     cannot be a shortcut, it has to BE the control. */
  ok('...and it is the slider it looks like, from a keyboard too',
    wheelUp.role === 'slider' && wheelUp.tab === 0
    && wheelUp.min === '0' && wheelUp.max === '359'
    && wheelUp.now === '124' && /^#[0-9a-f]{6},/.test(wheelUp.text), wheelUp);

  /* ── THE RING IS PAINTED FROM THE ACCENTS, NOT FROM HUE ──
     A conic gradient of raw hues shows a bright blue at the bottom and
     hands you the pale one the floor actually produces — a control that
     lies about its own output. Every stop is the exact colour that
     angle gives, so what you press is what you get.

     Proven against the thing it is not: the same hues at full
     saturation are measured right here, and the assertion is that the
     ring clears the bar where the rainbow does not. Without that half
     this passes on a rainbow whose stops happen to be bright. */
  const PAGE = [6, 6, 7];
  const hsl = (h) => {
    const f = (n) => {
      const k = (n + h / 30) % 12;
      return Math.round(255 * (0.5 - 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
    };
    return [f(0), f(8), f(4)];
  };
  const ringLow = wheelUp.stops.reduce((a, v) => Math.min(a, ratio(v, PAGE)), 99);
  const rawLow = wheelUp.stops.map((v, i) => ratio(hsl(i * 10), PAGE))
    .reduce((a, v) => Math.min(a, v), 99);
  ok(`every stop on the ring clears 6:1 on the page (worst ${ringLow.toFixed(2)}:1)`,
    wheelUp.stops.length >= 36 && ringLow >= 5.9, { ringLow, n: wheelUp.stops.length });
  ok(`...which a rainbow of the same hues does not (worst ${rawLow.toFixed(2)}:1)`,
    rawLow < 4.5, rawLow);

  /* ── AND THE HUE IS THE ONLY THING IT MOVES ──
     "Change the accent" is the whole ask. The ground, the ink and both
     greys are the app's colours now rather than a theme's, so a wheel
     that moved any of them would be the thirteen palettes back under
     one control. Held on every token the old sets were allowed to
     write. */
  const FIXED = ['--paper', '--ink', '--dim', '--spent', '--hair',
                 '--tick-off', '--bad', '--g0', '--g2'];
  const MOVES = ['--red', '--g1', '--on-red'];
  /* Spaces stripped, because a custom property comes back as the
     AUTHOR'S text: the stylesheet writes `rgba(120, 124, 132, .14)`
     and the solver writes the same colour without the spaces, and a
     string compare calls that a change. */
  const readTokens = () => page.evaluate((ks) => {
    const cs = getComputedStyle(document.documentElement);
    const o = {};
    ks.forEach((k) => { o[k] = cs.getPropertyValue(k).replace(/\s/g, '').toLowerCase(); });
    return o;
  }, FIXED.concat(MOVES));
  const before = await readTokens();

  /* Pressed rather than written into localStorage: what is being
     checked is the control, and a test that only ever sets the key
     proves the key works. */
  const spin = async (h) => {
    const box = await page.evaluate(() => {
      const b = document.querySelector('.cw').getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 - 13 };
    });
    const t = h * Math.PI / 180;
    await page.mouse.move(box.x + Math.sin(t) * box.r, box.y - Math.cos(t) * box.r);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(180);
  };
  await spin(264);
  const after = await readTokens();
  ok('a press on the ring moves the accent, its wash and the ink on it',
    MOVES.every((k) => before[k] !== after[k]) && /^#[0-9a-f]{6}$/.test(after['--red']),
    { before, after });
  ok('...and moves nothing else at all — the ground is the app\u2019s, not a theme\u2019s',
    FIXED.every((k) => before[k] === after[k]),
    FIXED.filter((k) => before[k] !== after[k]).map((k) => k + ' ' + before[k] + ' → ' + after[k]));

  /* The two things the picture cannot show you: what the colour is, and
     whether it can be read. The old hint named the palette and the
     worst type on it; with one ground the worst type never moves, so
     the number worth printing is the accent's own. */
  const said = await page.evaluate(() => ({
    hint: document.querySelector('.cw-wrap').nextElementSibling.textContent,
    now: document.querySelector('.cw').getAttribute('aria-valuenow'),
    knob: document.querySelector('.cw-k').style.transform }));
  ok('the wheel says the hex and its measured ratio, and the knob follows',
    said.hint.indexOf(after['--red']) === 0 && /\d(\.\d)?:1 against the page/.test(said.hint)
    && said.now === '264' && /rotate\(264deg\)/.test(said.knob), said);

  /* ── EVERY POINT ON THE WHEEL, ON THE PAGE ──
     Thirteen palettes were thirteen hand-mixed sets and each was
     measured. A wheel is 360 of them and none is hand-mixed, so what
     has to be true is a property of the solver rather than of a list —
     which is only worth claiming if it is measured somewhere it can
     fail. Twelve points, on real pixels, on the type the accent
     actually carries.

     The worst point on the wheel is hue 316 by arithmetic, so it is on
     the list by name rather than by luck. */
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForTimeout(300);
  const HUES = [0, 24, 60, 96, 124, 160, 200, 240, 264, 300, 316, 340];
  const spun = [];
  for (const h of HUES) {
    await page.evaluate((v) => localStorage.setItem('sched.accent.v1', String(v)), h);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(240);
    await page.click('#scTabYou');
    await page.waitForTimeout(300);

    /* WHAT SITS ON THE ACCENT, and it is your FACE now. This read the
       add button, which was the accent with --on-red on it — and the
       day every filled control went white that measurement became
       near-black on white, 18:1, a check that passes without looking at
       the accent at all. The face is the one place --on-red still
       lands: your accent as the ground with its features drawn on top,
       and it is pushed to your friends, so it is drawn on pages this
       one has never seen.

       It would have shipped broken: white on an amber accent measures
       1.9:1 and on a mint one 1.7:1 — a face with no eyes. */
    const [fg, bg] = await page.$eval('.tab-face svg', (svg) => [
      svg.querySelector('circle').getAttribute('fill'),
      svg.querySelector('rect').getAttribute('fill')]);
    const num = (v) => (v || '').trim().startsWith('#')
      ? v.trim().replace('#', '').match(/\w\w/g).map((x) => parseInt(x, 16))
      : (v.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const onAccent = ratio(num(fg), num(bg));

    const dangers = await page.evaluate(() => {
      const el = document.querySelector('.menu-item.bad');
      const sh = document.querySelector('.sheet');
      const root = getComputedStyle(document.documentElement);
      return [getComputedStyle(el).color, getComputedStyle(sh).backgroundColor,
              root.getPropertyValue('--red').trim()];
    });
    const accentRGB = dangers[2].startsWith('#')
      ? dangers[2].match(/\w\w/g).map((x) => parseInt(x, 16))
      : num(dangers[2]);
    const onBad = +ratio(num(dangers[0]), num(dangers[1])).toFixed(2);
    const dE = deltaE(num(dangers[0]), accentRGB);
    const onPage = +ratio(accentRGB, PAGE).toFixed(2);

    await page.evaluate(() => document.getElementById('scScrim').click());
    await page.waitForTimeout(320);

    const png = PNG.sync.read(await page.screenshot());
    const at = (x, y) => {
      const i = (png.width * Math.round(y * dpr) + Math.round(x * dpr)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    const rows = [];
    for (const sel of ['.title', '.hd-when', '.sp-t', '.sp-ends span',
                       '.ty-lbl', '.ty-cap', '.ty-foot']) {
      const el = await page.$(sel);
      if (!el) continue;
      const b3 = await el.boundingBox();
      if (!b3) continue;
      const col = num(await page.$eval(sel, (e) => getComputedStyle(e).color));
      rows.push({ sel, r: +ratio(col, at(b3.x + b3.width + 6, b3.y + b3.height / 2)).toFixed(2) });
    }
    const worst = rows.reduce((a, x) => (x.r < a.r ? x : a), rows[0]);
    spun.push({ h, worst, bad: rows.filter((x) => x.r < 4.5),
                onAccent: +onAccent.toFixed(2), onBad, dE, onPage });
  }

  const low = (k) => spun.reduce((a, x) => (x[k] < a[k] ? x : a), spun[0]);
  ok(`every piece of type clears 4.5:1 at every hue (worst ${low('onPage').worst.r}:1 `
    + `on ${low('onPage').worst.sel})`,
    spun.every((t) => t.bad.length === 0), spun.filter((t) => t.bad.length).map((t) => t.h + ': ' + JSON.stringify(t.bad)));
  /* THE FLOOR THE SOLVER AIMS AT, measured rather than computed. 6:1 is
     a margin over the 4.5 the type needs, and this repo has twice
     shipped 4.74 believing that was one. */
  ok(`the accent itself never drops under 6:1 on the page (worst ${low('onPage').onPage}:1 at hue ${low('onPage').h})`,
    spun.every((t) => t.onPage >= 5.9), spun.map((t) => t.h + ':' + t.onPage));
  ok(`what sits on the accent clears 4.5:1 at every hue (worst ${low('onAccent').onAccent}:1)`,
    spun.every((t) => t.onAccent >= 4.5), spun.map((t) => t.h + ':' + t.onAccent));

  /* ── DANGER IS NOT THE ACCENT, AND NOW YOU CAN PICK RED ──
     "Clear everything" reading as a highlight rather than a warning was
     a palette author's mistake to make; with a wheel it is one anybody
     can make in a second, so it is the APP that has to hold them apart.
     It does, and not by luck: --bad is a pale desaturated red and every
     solved accent sits at full chroma, so the nearest the whole wheel
     comes is ΔE 17.9 at hue 18. Measured in Lab rather than by
     comparing hexes — two colours can differ by a lot of hex and very
     little eye. */
  ok(`danger is visibly not the accent at any hue (nearest ΔE ${low('dE').dE.toFixed(1)} at hue ${low('dE').h})`,
    spun.every((t) => t.dE >= 12), spun.map((t) => t.h + ':' + t.dE.toFixed(1)));
  ok(`and danger clears 4.5:1 on the sheet (${low('onBad').onBad}:1)`,
    spun.every((t) => t.onBad >= 4.5), spun.map((t) => t.h + ':' + t.onBad));

  /* ── THE CHOICE SURVIVES A RELOAD, UNDER ITS OWN KEY ──
     An accent is a preference about looking at the record, not part of
     it — folding one into the other is how a damaged record takes the
     other down. */
  const kept = await page.evaluate(() => ({
    accent: getComputedStyle(document.documentElement)
      .getPropertyValue('--red').trim().toLowerCase(),
    key: localStorage.getItem('sched.accent.v1'),
    inSchedule: /accent|theme/.test(localStorage.getItem('sched.v1') || ''),
  }));
  ok('the accent is still up after a reload, and kept away from the schedule',
    kept.key === String(HUES[HUES.length - 1]) && !kept.inSchedule
    && /^#[0-9a-f]{6}$/.test(kept.accent) && kept.accent !== '#c8fa42', kept);

  /* ── A STORED PALETTE NAME BECOMES AN ANGLE ──
     A palette is a choice somebody made and the half of it this app
     still has is the hue. Dropping everyone onto lime because the
     ground changed would throw that away for nothing. Read once and the
     old key is spent — a name that resolves to a number is not
     something to keep resolving — which is asserted as the old key
     being GONE rather than merely ignored. Same shape as Easy → Light:
     the word moved, the record did not. */
  await page.evaluate(() => {
    localStorage.removeItem('sched.accent.v1');
    localStorage.setItem('sched.theme.v1', 'cobalt');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(240);
  const carried = await page.evaluate(() => ({
    hue: localStorage.getItem('sched.accent.v1'),
    old: localStorage.getItem('sched.theme.v1'),
    red: getComputedStyle(document.documentElement).getPropertyValue('--red').trim(),
  }));
  ok('a stored palette name comes back as its own hue, once',
    carried.hue === '264' && carried.old === null && carried.red !== '#c8fa42', carried);

  /* ── AND A HUE THAT MEANS NOTHING FALLS THROUGH ──
     The key outlives the code that wrote it. A stored value that is not
     a number on the circle has to mean the one it ships with, rather
     than NaN degrees — which resolves to a colour, silently, and would
     be the app opening on a page nothing chose. */
  await page.evaluate(() => localStorage.setItem('sched.accent.v1', 'plum'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(240);
  ok('a stored accent that is not an angle falls back to the one it ships with',
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--red').trim())
      === '#c8fa42');

  /* ── THE STYLESHEET AND THE SOLVER HAVE TO AGREE ──
     app.css carries a complete palette so the first paint is right
     before app.js runs. That is the one thing in this app written down
     twice, and the failure if they drift is the ugliest kind: clearing
     the stored key drops you onto a page that nothing can reproduce and
     nothing can get you back to. What is duplicated is now the OUTPUT
     of one function at one angle rather than a set somebody typed, so
     this reads the wheel's own 124 back off the page and holds the
     stylesheet to it. */
  await page.evaluate(() => { localStorage.removeItem('sched.accent.v1'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(240);
  const ships = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const keys = ['--paper', '--ink', '--dim', '--spent', '--red',
                  '--hair', '--tick-off', '--bad', '--on-red', '--g1', '--g2'];
    const root = {};
    keys.forEach((k) => { root[k] = cs.getPropertyValue(k).trim().toLowerCase(); });
    return root;
  });
  ok('clearing it falls back to the page the stylesheet itself carries',
    ships['--red'] === '#c8fa42' && ships['--paper'] === '#060607'
    && ships['--ink'] === '#ffffff', ships);
  /* NOTHING HAS RUN scPaint AT THIS POINT — the key is clear, so every
     token above came from the stylesheet. Turning the wheel to 124 and
     reading them again is therefore a comparison of the two copies
     rather than of one copy with itself, which is the whole claim. */
  await page.click('#scTabYou');
  await page.waitForTimeout(320);
  await spin(124);
  const solved = await page.evaluate((keys) => {
    const cs = getComputedStyle(document.documentElement);
    const o = {};
    keys.forEach((k) => { o[k] = cs.getPropertyValue(k).trim().toLowerCase(); });
    return o;
  }, Object.keys(ships));
  ok('...and the wheel\u2019s own 124 is that same page, token for token',
    Object.keys(ships).every((k) => ships[k].replace(/\s/g, '') === solved[k].replace(/\s/g, '')),
    Object.keys(ships).filter((k) => ships[k].replace(/\s/g, '') !== solved[k].replace(/\s/g, ''))
      .map((k) => k + ': css ' + ships[k] + ' / wheel ' + solved[k]));
  await page.evaluate(() => document.getElementById('scScrim').click());
  await page.waitForTimeout(300);

  /* show(), not one click. A single press put the rail back when the
     button had two stops; with three it lands on the tally instead and
     every .row below this vanishes — which reports as a broken app
     rather than as a test that left the furniture where it found it. */
  await show('list');
  ok('and the rail is back for what follows',
    await page.evaluate(() => !document.getElementById('scRail').hidden));

  /* ── the thumb ──
     A check only sees what is on screen. Measuring this with no sheet
     open reads the bar and the rows and calls it done — the day picker
     and the sheet's buttons are never looked at, and the seven chips
     were in fact under the floor when this was first written. */
  console.log('\n── the thumb ──');
  await page.click('.day.is-today .row[data-id]');
  await page.waitForTimeout(360);
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
    await fp.click('.ty-card[data-item="m"]');
    await fp.waitForTimeout(220);
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
      fetched.every((u) => u.startsWith(BASE) || u.startsWith('data:') || u.startsWith('blob:')),
      fetched.filter((u) => !u.startsWith(BASE)));
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

    /* ── their colours, not yours ── */
    const crown = await fp.$eval('.fr-crown', (e) => ({
      set: e.style.getPropertyValue('--crown'),
      fill: getComputedStyle(e.querySelector('svg')).fill,
    }));
    ok('the crown goes to the leader and takes THEIR accent',
      crown.set !== '' && crown.fill !== 'rgb(226, 35, 26)', JSON.stringify(crown));
    const faceFill = await fp.$eval('.fr-row .pic svg rect', (e) => e.getAttribute('fill'));
    ok('and so does their face', faceFill === '#0F6E6A', faceFill);

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
           smallest disc the strip can draw. */
        seeded.days = {};
        for (let i = 0; i < 7; i++) seeded.days[day(i)] = { t: 1, b: 1 };
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
        /* The smallest LIT bar, not the first one in the strip. An
           unlit day is deliberately the flat neutral — "a day with
           none is never a red one" — so it makes no colour claim and
           holding it to 3:1 measures the wrong mark. Over thirty days
           the first cell is usually empty, which is how this started
           reporting 1.18:1 against a rule it was not breaking. */
        const db = await fp.$$eval('.fp-d i', (all) => {
          const lit = all.filter((e) => e.style.background);
          const e = lit.sort((a, b) =>
            a.getBoundingClientRect().height - b.getBoundingClientRect().height)[0];
          if (!e) return null;
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        });
        if (!db) throw new Error('no lit bar in the strip to measure');
        const png = PNG.sync.read(await fp.screenshot());
        const at = (x, y) => {
          const i = (png.width * Math.round(y * 2) + Math.round(x * 2)) << 2;
          return [png.data[i], png.data[i + 1], png.data[i + 2]];
        };
        const rd = +ratio(at(db.x + db.w / 2, db.y + db.h / 2),
                          at(db.x + db.w / 2, db.y - 11)).toFixed(2);
        if (rd < lowD.r) lowD = { r: rd, reader, acc };
        await fp.keyboard.press('Escape');
        await fp.waitForTimeout(380);
      }
      ok('the smallest disc clears 3:1 on your page, measured on pixels',
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
    ok('their page shows seven days',
      await fp.$$eval('.fp-d', (d) => d.length) === 30);
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
    const discs = await fp.$$eval('.fp-d i', (b) => b.map((x) => ({
      w: x.style.height, o: getComputedStyle(x).opacity })));
    ok('the strip says how many by SIZE, never by a colour for missing',
      new Set(discs.map((d) => d.w)).size > 1
      && discs.every((d) => parseFloat(d.w) >= 16), JSON.stringify(discs));
    ok('and no disc is diluted to say it — opacity cannot rescue a light accent',
      discs.every((d) => d.o === '1'), JSON.stringify(discs.map((d) => d.o)));
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
    ok('the sheet\u2019s headings are not letterspaced capitals',
      heads.length === 2 && heads.every((h) => h.t === 'none'
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
      /* NOTHING is seeded. No net record, no url — the point is that the
         link is the only thing this browser is told. */
      await gp.addInitScript(() => {
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
      a: document.getElementById('scSpanA').textContent,
      b: document.getElementById('scSpanB').textContent,
      row: [...document.querySelectorAll('.day.is-open .row[data-id] .t')]
        .map((t) => t.textContent),
    }));
    ok('a 12-hour phone gets 12-hour times',
      /9:30 AM$/.test(twelve.head) && twelve.a === '5:45 AM'
      && twelve.b === '11:00 PM', twelve);
    const withMer = twelve.row.filter((t) => /[AP]M/.test(t));
    ok('...and a row carries the meridiem once, on the end',
      withMer.length === twelve.row.length && twelve.row.length > 1
      && twelve.row.every((t) => (t.match(/[AP]M/g) || []).length === 1
        && /[AP]M$/.test(t)), twelve.row);
    await up.click('.day.is-open .row[data-id]');
    await up.waitForTimeout(240);
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
      await page.click('[data-item="t"]');
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

       AND THEY ARE EMPTY. They used to be the next two workouts in the
       group, drawn in full and clipped to the corner showing — so
       pressing a chip changed what was BEHIND the card as well as the
       card itself, and mid-deal another session's name and figures
       slid under the one you were reading. A card behind a card
       carries no information: what it has to say is "there are more of
       these", and a slab at the right angle says that and nothing
       else. */
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
          .map((c) => c.childNodes.length + ':' + c.textContent.trim().length) };
    });
    ok('...as a stack of three, one of them a button, the front one on top',
      shape.n === 3 && shape.tags.filter((t) => t === 'BUTTON').length === 1
      && shape.hidden === 2 && shape.onTop, shape);
    ok('...and the two behind carry nothing at all',
      shape.behind.join('|') === '0:0|0:0', shape.behind);

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

       The four kinds are a HAND. Choosing between All exercises, PPL,
       Run and Recovery deals it again every time, because at that level
       you are choosing what sort of session this was and the deal is
       what that screen is. What must not deal is a step through one
       hand, which is the shuffle below — and an effort, a length or a
       pick, which do not move the deck at all. */
    await page.click('.wc-chips .wc-chip:nth-child(2)');
    await page.waitForTimeout(60);
    const again = await page.evaluate(() => {
      const nm = (s2) => {
        const e = document.querySelector(s2);
        return e ? getComputedStyle(e).animationName : null;
      };
      return { front: nm('.wc.is-front'), b1: nm('.wc.b1'), b2: nm('.wc.b2'),
        out: document.querySelectorAll('.wc.is-out').length,
        dealing: document.querySelector('.wc-deck').classList.contains('is-dealing') };
    });
    ok('...and a press on another KIND deals the whole hand again',
      again.dealing && [again.front, again.b1, again.b2]
        .every((n) => n === 'wcDeal') && again.out === 0, again);
    await page.waitForTimeout(600);
    await page.click('.wc-chips .wc-chip:nth-child(1)');
    await page.waitForTimeout(600);

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

    /* ── AND INSIDE A GROUP THE CARD GOES TO THE BACK ──
       You are stepping THROUGH one hand here, not choosing another, so
       the card in front is put down and the next is underneath it.

       The outgoing card is KEPT rather than rebuilt: it carries the
       workout you were looking at, with its own name and its own
       colour, and the whole gesture is that THAT card is the one being
       put down. Asserted by its name, so a fresh element standing in
       for it would fail — and by its position last in the deck, since
       these are absolutely positioned siblings with no z-index and
       source order is the stacking order. A card being put down that
       is painted UNDER the one it is uncovering has nothing to
       uncover. */
    /* .wc-n is the card's NAME. The first `b` on a card is the Est.
       time figure, which is the same "50 min" on both cards and would
       have made this pass on any element at all. */
    const was = await page.evaluate(() =>
      document.querySelector('.wc.is-front .wc-n').textContent);
    await page.evaluate(() =>
      document.querySelector('.wc-chips .wc-chip:nth-child(3)').click());
    const shuf = await page.evaluate(() => {
      const deck = document.querySelector('.wc-deck');
      const o = deck.querySelector('.wc.is-out');
      const kids = [...deck.querySelectorAll('.wc')];
      return { on: deck.classList.contains('is-shuffling'),
        out: o && getComputedStyle(o).animationName,
        name: o && o.querySelector('.wc-n').textContent,
        last: !!o && kids[kids.length - 1] === o,
        deaf: o && getComputedStyle(o).pointerEvents,
        front: getComputedStyle(deck.querySelector('.wc.is-front')).animationName,
        b1: getComputedStyle(deck.querySelector('.wc.b1')).animationName };
    });
    ok(`a step inside a group puts ${was} to the back of the stack`,
      shuf.on && shuf.out === 'wcOut' && shuf.name === was
      && shuf.last && shuf.deaf === 'none', { was, shuf });
    ok('...and it is not a deal — the two behind hold still',
      shuf.front === 'wcStep' && shuf.b1 === 'none', shuf);
    /* SWEPT, and on a timer as well as on animationend: an animation
       that never runs — a background tab — would otherwise leave a dead
       card on the pile, and the next press would put a second one on
       top of it. */
    await page.waitForTimeout(800);
    ok('...and the card put down is swept, not left on the pile',
      await page.evaluate(() =>
        document.querySelectorAll('.wc-deck .wc').length === 3
        && !document.querySelector('.wc.is-out')));

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
      const worst = { fig: 99, glyph: 99, desc: 99, of: '' };
      for (let i = 0; i < 6; i++) {
        await page.click(`.wc-chips .wc-chip:nth-child(${i + 1})`);
        await page.waitForTimeout(420);
        const at = await page.evaluate(() => {
          const c = document.querySelector('.wc.is-front');
          const box = (s) => { const r = c.querySelector(s).getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2,
              l: r.left, r: r.right, t: r.top, b: r.bottom }; };
          return { name: c.dataset.workout, card: c.getBoundingClientRect().toJSON(),
            fig: box('.wc-top div b'), g: box('.wc-g'), d: box('.wc-d') };
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
        if (fig < worst.fig) { worst.fig = fig; worst.of = at.name; }
        worst.glyph = Math.min(worst.glyph, g);
        worst.desc = Math.min(worst.desc, d);
      }
      const t = theme === null ? 'the lime it ships with' : 'hue ' + theme;
      ok(`the figures clear 4.5:1 on the card on ${t} (worst ${worst.fig.toFixed(2)}:1 on ${worst.of})`,
        worst.fig >= 4.5, worst);
      ok(`...the description too, over the wordmark behind it (${worst.desc.toFixed(2)}:1)`,
        worst.desc >= 4.5, worst);
      ok(`...and the glyph clears 3:1 as a graphic (${worst.glyph.toFixed(2)}:1)`,
        worst.glyph >= 3, worst);
    }

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
      const r = [...document.querySelectorAll('.day.is-today .row[data-id]')]
        .find((x) => /Train/.test(x.querySelector('.n').firstChild.textContent));
      const em = r.querySelector('.n em.wo');
      /* Every grey asked for rather than typed. The palette moved
         once already and a literal here measures a colour that is
         nowhere on the page. */
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      return { mark: em && em.textContent, label: r.getAttribute('aria-label'),
        colour: em && getComputedStyle(em).color,
        dim: rgb('--dim'), spent: rgb('--spent'), accent: rgb('--red') };
    });
    ok('and the row it happened on says what it was, through a reload',
      row.mark === 'Legs' && / Legs\.? /.test(row.label + ' '), row);
    /* THE ACCENT, or --spent once the block is behind you — and this
       fixture's Train is a 06:30, so which one it is depends on the
       hour the suite runs. Asserted as "the accent, or the grey a past
       row fades to" rather than as one hex for exactly that reason;
       what it must never be is --dim, which is what it was.

       It went from a grey on the argument that a fifth use would stop
       the red meaning anything. Counting uses was the wrong question:
       the accent makes one claim on this app — this happened — and
       what you trained is that sentence. */
    ok('...in the accent, or the grey a row behind you fades to',
      [row.accent, row.spent].indexOf(row.colour) >= 0
      && row.colour !== row.dim, row);

    /* ── AND MEASURED ON A ROW THAT CANNOT BE BEHIND YOU ──
       The check above cannot fail at most hours, which is the shape
       this file already has a lesson about. `is-past` is set on
       `.day.is-today .row` alone, so a fixture on today's 06:30 Train
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
      const ids = [...document.querySelectorAll('.row[data-id]')]
        .map((r) => r.dataset.id);
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
    const ahead = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const rgb = (k) => 'rgb(' + cs.getPropertyValue(k).trim().replace('#', '')
        .match(/\w\w/g).map((x) => parseInt(x, 16)).join(', ') + ')';
      const r = document.querySelector('.day:not(.is-today) .row[data-id]');
      const em = r && r.querySelector('.n em.wo');
      const tk = r && r.querySelector('.tick');
      /* The PLACE, on any row that has one — it and the session share a
         line, and the size is only a claim against something. */
      const place = [...document.querySelectorAll('.row .n em:not(.wo)')][0];
      return { past: r && r.classList.contains('is-past'),
        wo: em && getComputedStyle(em).color,
        size: em && parseFloat(getComputedStyle(em).fontSize),
        placeSize: place && parseFloat(getComputedStyle(place).fontSize),
        tick: tk && getComputedStyle(tk).stroke,
        accent: rgb('--red'), ink: rgb('--ink'), dim: rgb('--dim') };
    });
    ok('what you trained is the accent on a row that is not behind you',
      ahead.past === false && ahead.wo === ahead.accent
      && ahead.wo !== ahead.dim, ahead);
    /* THE TICK WENT THE SAME WAY, and for the same reason: a done
       block and a kept day on the tally are one record seen from two
       screens, so drawing them in two colours is the thing that has to
       be learned. It was --ink. */
    ok('...and so is the tick on a block the tally has counted',
      ahead.tick === ahead.accent && ahead.tick !== ahead.ink, ahead);
    /* ── AND IT IS SMALLER THAN THE PLACE IT SHARES A LINE WITH ──
       A place is where you have to be; a session is a note about what
       already happened. At one size the two read as one label broken in
       half. Asserted as a RELATIONSHIP rather than a pixel count, so a
       change to the type scale moves both and this still means what it
       says. */
    ok(`what you trained is a step smaller than a place (${ahead.size} against ${ahead.placeSize})`,
      ahead.size > 0 && ahead.placeSize > 0 && ahead.size < ahead.placeSize, ahead);

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
    await page.click('[data-item="t"]');
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

    /* ── AND IT IS ONLY ASKED ABOUT TRAINING ──
       What counts is the keyword table's answer rather than a second
       list of words kept in step with it by hand. Mind is fed by Walk
       and Read, which reach the walk and read glyphs, so ticking it
       must draw no deck at all. */
    await page.click('[data-item="m"]');
    await page.waitForTimeout(420);
    const mind = await page.evaluate(() => ({
      open: !document.getElementById('scSheet').hidden,
      ticked: /"m"/.test(localStorage.getItem('sched.tick.v1') || ''),
    }));
    ok('a block that is not training is ticked without being asked about',
      mind.ticked && !mind.open, mind);
    await page.evaluate(() => {
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
    const d0 = new Date();
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

    /* ── TWO STOPS, AND EXACTLY ONE OF THEM IS ON SCREEN ──
       Measured as a BOX rather than as the hidden property. The rail
       and the page dots both had that bug — the attribute was set
       correctly throughout and a rule with its own `display` outranked
       the browser's [hidden] — and both times the check that missed it
       read the property. */
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
               /* The hero's own label went with the stop that replaced
                  it: a word naming a section directly under the button
                  that opens that section is the same word twice. */
               lbl: document.querySelectorAll('.ty-lbl').length };
    });
    ok('Today has two stops and only the one you pressed is drawn',
      stops.names.join('|') === 'Showing up|Workouts'
      && stops.on.join('') === 'work' && stops.work && !stops.up
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
      const rows = [...document.querySelectorAll('.wo-p')].map((t) => ({
        k: t.dataset.workout,
        n: t.querySelector('.wo-n').textContent,
        w: t.querySelector('.wo-w').textContent,
        s: t.querySelector('.wo-s').textContent,
        open: t.getAttribute('aria-expanded') === 'true',
        cal: !!t.querySelector('.wo-cal'),
        f: [...t.querySelectorAll('.wo-fl b')].map((b) => b.textContent),
        lab: [...t.querySelectorAll('.wo-fl i')].map((b) => b.textContent),
        glyphs: t.querySelectorAll('.wo-fl svg').length,
        spoken: t.getAttribute('aria-label'),
        quiet: t.querySelector('.wo-f').getAttribute('aria-hidden') === 'true',
      }));
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
        && r.lab.join('') === 'Avg' && r.glyphs === 2),
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
        t: p && p.querySelector('.wo-fl b').textContent };
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
      const ring = document.querySelector('.wo-p.is-open .wo-ra');
      const rr = ring.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2,
        want: getComputedStyle(document.documentElement)
          .getPropertyValue('--red').trim(),
        ring: getComputedStyle(ring).stroke,
        rx: rr.left + rr.width / 2, ry: rr.top + 2 };
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
    ok('...and so is the ring, rather than the session\'s own colour',
      hue.ring === 'rgb(' + want.join(', ') + ')', hue);

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

  ok('no page errors through any of it', errs.length === 0, errs);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
