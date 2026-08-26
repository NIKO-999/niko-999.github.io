/* ═══════════════════════════════════════════════════════════════
   SCHEDULE — the poster, the sentence, and the promise.

   This app shares nothing with the rest of the site, so nothing else
   in the suite covers a line of it. Three things are worth measuring
   and are measured here rather than looked at:

     · the CONTRAST. It is white type from 9px up, over a gradient,
       under a translucent card. The reference it was drawn from runs
       its own times at about 2.9:1 — this repo has shipped that
       mistake before and the only thing that catches it is sampling
       the composited pixel.
     · the PARSER. A table of sentences with the answer written down,
       driven through the field a thumb actually types into.
     · that NOTHING LEAVES. The whole claim of the app is that a
       spoken sentence becomes a scheduled class without a server.
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
   actually receives, after the gradient, the glass and the card have
   all had their turn. Reading the CSS would only prove what was typed. */
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + .05) / (y + .05);
};

/* A phone, and a real one — the app has no other layout. */
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/* Sentence in, schedule out. Every row here has been said out loud at
   a phone; the awkward ones are the point — no meridiem at all, a
   spelled-out time, two days at once, a room that is a name. */
const SAID = [
  ['Analytical Chemistry Tuesday 8 to 11 in room 1509',
    { days: 'TUE', name: 'Analytical Chemistry', s: '8:00 AM', e: '11:00 AM', room: '1509' }],
  ['Add Ethics on Monday and Wednesday from 9 to 10:30 in 7307',
    { days: 'MON WED', name: 'Ethics', s: '9:00 AM', e: '10:30 AM', room: '7307' }],
  /* No meridiem anywhere, and the two readings are both legal English.
     An afternoon class is the only sane one, and nothing in the
     sentence says so — the scoring does. */
  ['STS Monday 1:30 to 3',
    { days: 'MON', name: 'STS', s: '1:30 PM', e: '3:00 PM', room: '' }],
  ['Art Appreciation Monday 7:30 to 9',
    { days: 'MON', name: 'Art Appreciation', s: '7:30 AM', e: '9:00 AM', room: '' }],
  ['CWTS 2 Friday 12 to 3 PM soc hall',
    { days: 'FRI', name: 'CWTS 2', s: '12:00 PM', e: '3:00 PM', room: 'Soc Hall' }],
  ['I have KSAF on Saturday from three to four',
    { days: 'SAT', name: 'KSAF', s: '3:00 PM', e: '4:00 PM', room: '' }],
  ['put Biology Lab on Thursday at half past one for 90 minutes',
    { days: 'THU', name: 'Biology Lab', s: '1:30 PM', e: '3:00 PM', room: '' }],
  ['schedule Physics every Tuesday at 8 for 2 hours',
    { days: 'TUE', name: 'Physics', s: '8:00 AM', e: '10:00 AM', room: '' }],
  /* "weekdays" set the days AND stayed in the name, so this shipped a
     subject called "Calculus Weekdays" five times over. */
  ['Calculus weekdays 10 to 11',
    { days: 'MON TUE WED THU FRI', name: 'Calculus', s: '10:00 AM', e: '11:00 AM', room: '' }],
  /* The filler list must not eat a word that is part of the name. */
  ['Introduction to Chemistry Monday 8 to 9',
    { days: 'MON', name: 'Introduction to Chemistry', s: '8:00 AM', e: '9:00 AM', room: '' }],
  ['Ethics tues 9 to 1030',
    { days: 'TUE', name: 'Ethics', s: '9:00 AM', e: '10:30 AM', room: '' }],
  ['Statistics Friday eight thirty to ten',
    { days: 'FRI', name: 'Statistics', s: '8:30 AM', e: '10:00 AM', room: '' }],
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

  /* ── every request, counted ── */
  const asked = [];
  page.on('request', (r) => asked.push(r.url()));

  await page.goto(`${BASE}/schedule/index.html`, { waitUntil: 'networkidle' });

  console.log('\n── the poster ──');

  ok('it opens with the week on it', await page.$$eval('.row[data-id]', (r) => r.length) === 18);
  ok('and the days run Monday first', await page.$$eval('.day-name',
    (n) => n.map((x) => x.textContent).join(' ')) === 'MON TUE WED THU FRI SAT');

  /* ── side by side means the same box ──
     Within a card, the times are one column and the names are another.
     Sized per ROW instead of per CARD they step in and out by a few
     pixels down the card, which reads as a wobble because it is one. */
  const cols = await page.$$eval('.day-card', (cards) => cards.map((c) => {
    const rows = [...c.querySelectorAll('.row[data-id]')];
    const edge = (sel, side) => rows.map((r) => Math.round(r.querySelector(sel).getBoundingClientRect()[side]));
    return { t: edge('.t', 'right'), n: edge('.n', 'left'), rooms: rows.every((r) => r.querySelector('.r')) };
  }));
  ok('the times in a card share one right edge',
    cols.every((c) => new Set(c.t).size === 1), cols.map((c) => c.t));
  ok('and the names share one left edge',
    cols.every((c) => new Set(c.n).size === 1), cols.map((c) => c.n));

  /* A day whose rows carry no room drops the column rather than leaving
     a zero-width track with a gap on either side of it. */
  ok('a day with no rooms has no room column',
    await page.$$eval('.day-card.no-room .r', (r) => r.length) === 0);

  /* ── the rail joins its dots ──
     The line is drawn per day, so the join is the thing that can break:
     the first segment has to start at the first dot and the last has to
     stop at the last one, or the rail overshoots into the padding. */
  const rail = await page.evaluate(() => {
    const days = [...document.querySelectorAll('.day')];
    const seg = (el, which) => {
      const s = getComputedStyle(el, '::before');
      const r = el.getBoundingClientRect();
      return which === 'top' ? r.top + parseFloat(s.top) : r.bottom - parseFloat(s.bottom);
    };
    const dot = (el) => {
      const s = getComputedStyle(el, '::after');
      return el.getBoundingClientRect().top + parseFloat(s.top);
    };
    const f = days[0], l = days[days.length - 1];
    return { headGap: Math.abs(seg(f, 'top') - dot(f)), tailGap: Math.abs(seg(l, 'bottom') - dot(l)) };
  });
  ok('the rail starts at the first dot', rail.headGap < 1.5, rail);
  ok('and stops at the last one', rail.tailGap < 1.5, rail);

  /* ── contrast, on real pixels ──
     Sampled the length of the poster, because the sky is lightest at
     the bottom and that is where the card has the least to work with.
     Every string on this screen is small text, so 4.5:1 is the bar for
     all of it — there is no 3:1 large-text exemption anywhere here. */
  console.log('\n── contrast ──');
  const { PNG } = require('pngjs');
  const dpr = 2;

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
  await page.click('#scMic');
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
  await page.fill('#scSheetBody .field', 'Zoology');
  await page.waitForTimeout(40);
  ok('a sentence missing its day and time cannot be added',
    await page.$eval('#scSheetBody .btn.go', (b) => b.disabled));
  await page.fill('#scSheetBody .field', 'Monday 8 to 9');
  await page.waitForTimeout(40);
  ok('and one missing its name cannot either',
    await page.$eval('#scSheetBody .btn.go', (b) => b.disabled));

  /* Two days named, two rows written — a timetable entry is per-day. */
  await page.fill('#scSheetBody .field', 'Pharmacology Tuesday and Friday 8 to 11 in room 1509');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('two days named writes two rows',
    await page.$$eval('.row[data-id]', (r) => r.length) === 20);
  ok('and it lands in time order inside the day',
    await page.$$eval('.day:nth-child(2) .row[data-id] .n', (n) => n.map((x) => x.textContent))
      .then((v) => v.join('|') === 'Analytical Chemistry|Pharmacology|PMLSP 2|PMLSP 2'));

  /* ── nothing deletes without a way back ── */
  console.log('\n── the way back ──');
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('undo puts the schedule back', await page.$$eval('.row[data-id]', (r) => r.length) === 18);

  await page.fill('#scSheetBody .field', 'delete Ethics').catch(() => {});
  await page.click('#scMic');
  await page.waitForTimeout(120);
  await page.fill('#scSheetBody .field', 'delete Ethics');
  await page.waitForTimeout(60);
  await page.click('#scSheetBody .btn.go');
  await page.waitForTimeout(420);
  ok('a spoken delete takes both of them',
    await page.$$eval('.row[data-id]', (r) => r.length) === 16);
  await page.click('#scToast button');
  await page.waitForTimeout(320);
  ok('and that is undoable too', await page.$$eval('.row[data-id]', (r) => r.length) === 18);

  /* ── a damaged store is repaired, not thrown away ── */
  console.log('\n── the store ──');
  await page.evaluate(() => {
    localStorage.setItem('sched.v1', JSON.stringify({
      title: 'Kept', sub: 7,
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
  ok('and a broken subtitle does not take the title with it',
    await page.$eval('#scTitle', (e) => e.textContent) === 'Kept');

  /* ── the live line ── */
  console.log('\n── now ──');
  await page.evaluate(() => localStorage.removeItem('sched.v1'));
  /* A Tuesday, mid-morning: Analytical Chemistry runs 8 to 11, so at
     9:30 exactly one row is live and the one before it is not. */
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
    (n) => n.map((x) => x.textContent)).then((v) => v.length === 1 && v[0] === 'TUE'));
  ok('exactly one class is live', await page.$$eval('.row.is-now',
    (r) => r.map((x) => x.querySelector('.n').textContent))
    .then((v) => v.length === 1 && v[0] === 'Analytical Chemistry'));

  /* The hero is read part by part rather than as one string, because
     its whole design is that the figure holds ONE shape whatever the
     state — a clock time, never a duration that grows a unit and
     reflows the head every time it crosses an hour. */
  const hero = await page.evaluate(() => ({
    state: document.getElementById('scLiveState').textContent,
    num: document.getElementById('scLiveNum').textContent,
    unit: document.getElementById('scLiveUnit').textContent,
    of: document.getElementById('scLiveOf').textContent,
  }));
  ok('the hero counts the running class down', hero.state === 'Now · until'
    && hero.num === '11:00' && hero.unit === 'AM'
    && hero.of === 'Analytical Chemistry · 1 h 30 m left', hero);

  /* ── one lit surface ──
     The accent is spent on the day you are in and nothing else. Six
     coloured subjects would make the rail a chart of nothing, and the
     rule is only worth writing down if something measures it. */
  const lit = await page.evaluate(() => {
    const px = (el) => getComputedStyle(el).backgroundImage + '|' + getComputedStyle(el).backgroundColor;
    const cards = [...document.querySelectorAll('.day-card')];
    const today = document.querySelector('.day.is-today .day-card');
    return {
      today: px(today),
      others: [...new Set(cards.filter((c) => c !== today).map(px))],
    };
  });
  ok('today is the one card painted differently',
    lit.others.length === 1 && lit.today !== lit.others[0], lit);
  ok('and it carries the crest that marks it',
    /svg\+xml/.test(lit.today) && !/svg\+xml/.test(lit.others[0]));

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
  const small = await page.$$eval('.mic, .ghost, .row, .pick, .btn', (els) => els
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

  ok('no page errors through any of it', errs.length === 0, errs);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
