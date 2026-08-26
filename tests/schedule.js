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

/* A phone, and a real one — the app has no other layout. */
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

/* Sentence in, day out. Every row here is something you would actually
   say at a phone about your own day; the awkward ones are the point —
   no meridiem at all, a spelled-out time, several days at once, a
   place that is a word rather than a code. */
const SAID = [
  ['Train every day 6:30 to 7:30 at the gym',
    { days: 'MON TUE WED THU FRI SAT SUN', name: 'Train', s: '6:30 AM', e: '7:30 AM', room: 'Gym' }],
  ['Add Walk on Monday and Wednesday from 7:45 to 8:30',
    { days: 'MON WED', name: 'Walk', s: '7:45 AM', e: '8:30 AM', room: '' }],
  /* No meridiem anywhere, and both readings are legal English. An
     afternoon block is the only sane one, and nothing in the sentence
     says so — the scoring does. */
  ['Admin Monday 1:30 to 3',
    { days: 'MON', name: 'Admin', s: '1:30 PM', e: '3:00 PM', room: '' }],
  ['Trading weekdays 9 to 10:30',
    { days: 'MON TUE WED THU FRI', name: 'Trading', s: '9:00 AM', e: '10:30 AM', room: '' }],
  ['Shift Friday 12 to 3 PM in the shop',
    { days: 'FRI', name: 'Shift', s: '12:00 PM', e: '3:00 PM', room: 'Shop' }],
  ['I have football on Saturday from three to four',
    { days: 'SAT', name: 'Football', s: '3:00 PM', e: '4:00 PM', room: '' }],
  ['put Meal prep on Sunday at half past one for 90 minutes',
    { days: 'SUN', name: 'Meal Prep', s: '1:30 PM', e: '3:00 PM', room: '' }],
  ['schedule Physio every Tuesday at 8 for 2 hours',
    { days: 'TUE', name: 'Physio', s: '8:00 AM', e: '10:00 AM', room: '' }],
  /* "weekends" set the days AND stayed in the name, so the same bug
     shipped a block called "Long walk weekends" twice over. */
  ['Long walk weekends 10 to 11',
    { days: 'SAT SUN', name: 'Long Walk', s: '10:00 AM', e: '11:00 AM', room: '' }],
  /* The filler list must not eat a word that is part of the name. */
  ['Back to back calls Monday 8 to 9',
    { days: 'MON', name: 'Back to Back Calls', s: '8:00 AM', e: '9:00 AM', room: '' }],
  ['Read tues 9 to 1030',
    { days: 'TUE', name: 'Read', s: '9:00 AM', e: '10:30 AM', room: '' }],
  ['Stretch Friday eight thirty to ten',
    { days: 'FRI', name: 'Stretch', s: '8:30 AM', e: '10:00 AM', room: '' }],
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

  const SEEDED = 47;
  ok('it opens with the week on it',
    await page.$$eval('.row[data-id]', (r) => r.length) === SEEDED);
  /* Today first, then the days after it — a daily process is opened
     to find out what is happening now, and on a Saturday a Monday-first
     week puts that four screens down. The frozen-clock pass below is a
     Tuesday, so this list is checked against the real clock instead of
     a literal. */
  const ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const from = new Date().getDay();
  const wantOrder = Array.from({ length: 7 }, (_, i) => ABBR[(from + i) % 7]).join(' ');
  ok(`the week opens on today (${ABBR[from]}) and runs forward`,
    await page.$$eval('.day-name', (n) => n.map((x) => x.textContent).join(' ')) === wantOrder,
    wantOrder);

  /* ── side by side means the same box ──
     Within a card, the times are one column and the names are another.
     Sized per ROW instead of per CARD they step in and out by a few
     pixels down the card, which reads as a wobble because it is one. */
  const cols = await page.$$eval('.day-card', (cards) => cards.map((c) => {
    const rows = [...c.querySelectorAll('.row[data-id]')];
    const edge = (sel, side) => rows.map((r) => Math.round(r.querySelector(sel).getBoundingClientRect()[side]));
    return { t: edge('.t', 'right'), n: edge('.n', 'left') };
  }));
  ok('the times in a card share one right edge',
    cols.every((c) => new Set(c.t).size === 1), cols.map((c) => c.t));
  ok('and the names share one left edge',
    cols.every((c) => new Set(c.n).size === 1), cols.map((c) => c.n));

  /* The place rides INSIDE the name rather than taking a column of
     its own, so an empty one costs nothing and there is no track to
     collapse. Both branches are checked; the second one is added
     further down, after a block with a place has been spoken in. */
  ok('no block starts with a place, and none is drawn',
    await page.$$eval('.row .n em', (e) => e.length) === 0);

  /* ── the measure ──
     The one thing this design says that a list cannot: a rule as long
     as the block is. It is the whole reason this variant was picked,
     so it gets the assertion it deserves — the rendered widths have to
     be ORDERED by duration, not merely present. A rule that is drawn
     but constant is the failure this catches, and it looks completely
     fine in a screenshot. */
  const meas = await page.$$eval('.row[data-id]', (rows) => rows.map((r) => ({
    n: r.querySelector('.n').firstChild.textContent,
    mins: +r.dataset.e - +r.dataset.s,
    w: r.querySelector('.m').getBoundingClientRect().width,
  })));
  ok('every block carries a measure', meas.length === 47 && meas.every((m) => m.w >= 3), meas.slice(0, 3));
  ok('and the widths are ordered by duration', (() => {
    const by = [...meas].sort((a, b) => a.mins - b.mins);
    return by.every((m, i) => i === 0 || m.w >= by[i - 1].w - 0.01);
  })(), meas);
  /* Ordered is not enough on its own — a constant width is also
     "ordered". The longest has to be visibly longer than the shortest. */
  const span = { min: Math.min(...meas.map((m) => m.w)), max: Math.max(...meas.map((m) => m.w)) };
  ok(`the longest block reads far longer than the shortest (${span.min}px → ${span.max}px)`,
    span.max >= span.min * 8, span);

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
  await page.click('#scMic');
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
    (n) => n.map((x) => x.textContent)).then((v) => v.length === 1 && v[0] === 'TUE'));
  ok('exactly one class is live', await page.$$eval('.row.is-now',
    (r) => r.map((x) => x.querySelector('.n').textContent))
    .then((v) => v.length === 1 && v[0] === 'Trading'));
  ok('and the morning behind it is marked done',
    await page.$$eval('.row.is-past .n', (r) => r.map((x) => x.textContent).join('|'))
      .then((v) => v === 'Wake|Train|Walk'));

  /* The hero is read part by part rather than as one string, because
     its whole design is that the figure holds ONE shape whatever the
     state — a clock time, never a duration that grows a unit and
     reflows the head every time it crosses an hour. */
  /* The running row is 13px wider than the rest so its rule can reach
     into the margin. Its columns still have to line up with every other
     row — and this is the only place in the file guaranteed to HAVE a
     running row, because the clock is frozen inside one. The check at
     the top of the file sees it only when the real time happens to fall
     inside a block, which is how a 13px step went unnoticed. */
  const align = await page.evaluate(() => {
    const day = document.querySelector('.day.is-today');
    const edge = (sel, side) => [...day.querySelectorAll('.row[data-id]')]
      .map((r) => Math.round(r.querySelector(sel).getBoundingClientRect()[side]));
    return { t: edge('.t', 'right'), m: edge('.m', 'left') };
  });
  ok('the running row keeps the column it is in',
    new Set(align.t).size === 1 && new Set(align.m).size === 1, align);

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
    return { display: a.display, anim: a.animationName,
             rule: getComputedStyle(row).borderLeftColor,
             weight: getComputedStyle(row.querySelector('.n')).fontWeight };
  });
  ok('reduced motion does not build the sweep', calm.display === 'none', calm);
  ok('and the row is still marked without it',
    calm.rule === 'rgb(226, 35, 26)' && calm.weight === '700', calm);
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  const hero = await page.evaluate(() => ({
    state: document.getElementById('scLiveState').textContent,
    num: document.getElementById('scLiveNum').textContent,
    unit: document.getElementById('scLiveUnit').textContent,
    of: document.getElementById('scLiveOf').textContent,
  }));
  ok('the hero counts the running class down', hero.state === 'Now · until'
    && hero.num === '11:00' && hero.unit === 'AM'
    && hero.of === 'Trading · 1 h 30 m left', hero);

  /* ── one red, spent twice ──
     The accent marks the day you are in and the block that is running,
     and nothing else. Six coloured subjects would make the sheet a
     chart of nothing, and a rule is only worth writing down if
     something measures it. */
  const reds = await page.evaluate(() => {
    const red = 'rgb(226, 35, 26)';
    const hit = [];
    document.querySelectorAll('.day-name, .row, .row .n, .row .t, .row .m, .title, .sub').forEach((el) => {
      const s = getComputedStyle(el);
      if (s.color === red || s.backgroundColor === red || s.borderLeftColor === red)
        hit.push(el.className + ':' + (el.textContent || '').slice(0, 14));
    });
    return hit;
  });
  ok('the red marks today and the running block, and nothing else',
    reds.length === 3 && reds.filter((r) => /day-name/.test(r)).length === 1, reds);

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
    for (let dx = 6; dx < box.w - 6; dx += 2) {
      const i = (png.width * Math.round((box.y + box.h - 4) * dpr)
        + Math.round((box.x + dx) * dpr)) << 2;
      seen++;
      if (ratio(ink, [png.data[i], png.data[i + 1], png.data[i + 2]]) < 4.5) bad++;
    }
    return { pct: bad / seen * 100, seen };
  })();
  ok(`the sweep spoils ${spoil.pct.toFixed(1)}% of the row, under the 1.5% ceiling`,
    spoil.pct < 1.5, spoil);

  /* Spent on the one row that is running, like the red itself. */
  ok('nothing else on the sheet sweeps', await page.evaluate(() =>
    [...document.querySelectorAll('.row')].filter((r) =>
      getComputedStyle(r, '::after').animationName !== 'none').length) === 1);

  /* ── the ring ──
     The second view, still on the frozen Tuesday: Trading runs 9 to 11
     and it is 9:30, so exactly a quarter of the block is gone and the
     ring has a running span to draw. Everything below is a mechanism
     rather than an appearance — the two faults this feature actually
     shipped were a ring drawn the wrong way round and a mark that was
     not a unit of anything, and neither shows up in a screenshot you
     are not looking hard at. */
  console.log('\n── the ring ──');
  await page.click('#scView');
  await page.waitForTimeout(220);

  const upSwap = await page.evaluate(() => ({
    ring: !document.getElementById('scRing').hidden,
    rail: document.getElementById('scRail').hidden,
    hero: document.getElementById('scLive').hidden,
  }));
  ok('the ring replaces the rail rather than joining it',
    upSwap.ring && upSwap.rail, upSwap);
  /* The ring's own middle carries the state and the figure. Leaving the
     hero above it says both twice, and the louder of the two is the one
     that is not the point of the screen. */
  ok('and the hero goes with it, so nothing is said twice', upSwap.hero, upSwap);

  const ring = await page.evaluate(() => {
    const marks = [...document.querySelectorAll('#scRingSvg path')];
    const red = (p) => p.getAttribute('stroke') === '#e2231a';
    return {
      n: marks.length,
      lit: marks.filter(red).length,
      first: red(marks[0]),
      last: red(marks[marks.length - 1]),
      /* Where the lit run stops. On a ring drawn clockwise from twelve
         this is the boundary; on one drawn the other way round the lit
         marks are the TAIL of the array and this is 0. */
      edge: marks.findIndex((p) => !red(p)),
      key: document.getElementById('scRingKey').textContent,
      kick: document.getElementById('scRingKick').textContent,
      num: document.getElementById('scRingNum').textContent,
      unit: document.getElementById('scRingUnit').textContent,
      name: document.getElementById('scRingName').textContent,
    };
  });

  /* 9:30 inside a 9-to-11 block is a quarter gone, so three quarters of
     the marks are lit. Asserted as a proportion of whatever count the
     unit ladder chose, not as a number, so changing the ladder cannot
     silently make this vacuous. */
  ok(`three quarters of the ${ring.n} marks are lit at a quarter through`,
    ring.n > 4 && Math.abs(ring.lit / ring.n - 0.75) < 0.03, ring);

  /* THE DIRECTION. This shipped backwards: lighting the marks at
     k >= spent lights the HIGH angles, which is the arc running back up
     to twelve from the LEFT — an anti-clockwise countdown beside a
     clockwise figure, off the same number. Nothing about the element
     count, the lit count or the bounding box moves when it flips, so
     this is the only assertion that can catch it. */
  ok('and they run clockwise from twelve, not back to it',
    ring.first === true && ring.last === false && ring.edge === ring.lit, ring);

  /* A mark has to be worth a unit a person says. At a fixed 96 marks
     round the circle — which is what the prototype drew — a mark is 75
     seconds inside a two-hour block, so "four marks is an hour" is true
     of nothing. The printed key and the drawn count have to agree, and
     the unit has to be on the ladder. */
  const keyed = ring.key.match(/One mark is (?:a |an )?(\d+)?\s*(minute|minutes|hour)s? · (\d+) to go round/);
  ok('the key states a real unit and the count it actually drew',
    !!keyed && +keyed[3] === ring.n
    && [1, 5, 10, 15, 30, 60].includes(keyed[2] === 'hour' ? 60 : +keyed[1]),
    { key: ring.key, drew: ring.n });

  ok('the middle counts the running block down',
    ring.kick === 'Left of' && ring.num === '1:30' && ring.unit === 'hrs'
    && ring.name === 'Trading', ring);

  /* Asked for and removed. A countdown is about what is in front of
     you; how much of the day is already spent is another screen's job,
     and it was on this one. */
  ok('nothing on the ring says how much is behind you',
    !/behind you/i.test(await page.$eval('#scRing', (e) => e.textContent)));

  /* Today only, which is the whole reason the ring is not just the
     Countdown view with a circle on it. Tuesday's remaining blocks are
     Read and Down; Wednesday's Wake must not appear. */
  const restNames = await page.$$eval('#scRingList .sr-row b', (b) => b.map((x) => x.textContent));
  /* Wake is the first thing on EVERY day, so it is the one name that
     appears the moment the list steps over midnight. */
  ok('the list under it is today and stops there',
    restNames.length > 0 && !restNames.includes('Wake'), restNames);

  /* The pulse marks the leading edge — the one place on the drawing
     anything is going to happen and the one place the eye has no reason
     to look. It has to be an animation that is actually running, not an
     element that exists: a keyframe pair that cancels out is present,
     still, and perfect in a screenshot. */
  const ping = await page.evaluate(() => new Promise((res) => {
    const el = document.querySelector('.sr-ping');
    if (!el) return res(null);
    const seen = new Set();
    const t0 = performance.now();
    (function tick() {
      const s = getComputedStyle(el);
      seen.add(s.transform + '|' + s.opacity);
      if (performance.now() - t0 < 900) requestAnimationFrame(tick);
      else res({ frames: [...seen], name: s.animationName });
    })();
  }));
  ok('the pulse is actually running', ping && ping.frames.length > 4,
    ping && ping.frames.slice(0, 2));
  /* transform and opacity only. stroke-width or a filter here would
     repaint the whole ring twice a second, forever, on the one screen
     this app is meant to be left open on. */
  ok('and it is transform and opacity, so it composites',
    ping && ping.frames.every((f) => /^matrix|^none/.test(f)), ping && ping.frames[0]);
  ok('and it is the ring’s own keyframes, not the microphone’s',
    ping && ping.name === 'sr-ping', ping && ping.name);

  /* The pulse sits ON the boundary the marks draw. Built off the lit
     count instead of the same fraction, it would drift a mark at a time
     and nothing would say so. */
  const onEdge = await page.evaluate(() => {
    const el = document.querySelector('.sr-ping');
    const marks = [...document.querySelectorAll('#scRingSvg path')];
    const lit = marks.filter((p) => p.getAttribute('stroke') === '#e2231a');
    const b = lit[lit.length - 1].getBoundingClientRect();
    const p = el.getBoundingClientRect();
    return Math.hypot(b.x + b.width / 2 - (p.x + p.width / 2),
                      b.y + b.height / 2 - (p.y + p.height / 2));
  });
  ok(`the pulse sits on the last lit mark (${onEdge.toFixed(1)}px off)`, onEdge < 22, onEdge);

  /* Not paused — never built. A paused ping is a red circle frozen at
     whatever size the frame caught it, parked on the ring forever,
     which is worse than no effect at all. */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => document.getElementById('scView').click());
  await page.evaluate(() => document.getElementById('scView').click());
  await page.waitForTimeout(220);
  const still = await page.evaluate(() => ({
    ping: !!document.querySelector('.sr-ping'),
    marks: document.querySelectorAll('#scRingSvg path').length,
    lit: [...document.querySelectorAll('#scRingSvg path')]
      .filter((p) => p.getAttribute('stroke') === '#e2231a').length,
  }));
  ok('reduced motion does not build the pulse', still.ping === false, still);
  ok('and the ring still says everything it said',
    still.marks === ring.n && still.lit === ring.lit, still);
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  /* Real pixels. The middle sits inside the ring rather than on paper,
     and the marks pass behind nothing — but the unit key is 10px grey
     and that is exactly the size and weight this app has shipped at
     2:1 before. */
  await page.waitForTimeout(200);
  const ringInk = await (async () => {
    const png = PNG.sync.read(await page.screenshot());
    const at = (x, y) => {
      const i = (png.width * Math.round(y * dpr) + Math.round(x * dpr)) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]];
    };
    const out = [];
    for (const sel of ['#scRingKick', '#scRingNum', '#scRingName', '#scRingKey', '.sr-row b', '.sr-row span']) {
      const el = await page.$(sel);
      if (!el) continue;
      const b = await el.boundingBox();
      const col = (await page.$eval(sel, (e) => getComputedStyle(e).color))
        .match(/[\d.]+/g).slice(0, 3).map(Number);
      /* The ground just outside the type, on the same line — the colour
         the eye actually receives after everything over it has had its
         turn, not the one the cascade says. */
      out.push({ sel, r: ratio(col, at(b.x + b.width + 6, b.y + b.height / 2)) });
    }
    return out;
  })();
  ringInk.forEach((t) => ok(`${t.sel} clears 4.5:1 on the ring (${t.r.toFixed(1)}:1)`, t.r >= 4.5, t));

  /* The choice survives a reload. Its own key, not folded into the
     schedule: the schedule is the record and this is a preference about
     looking at it, and a damaged record must not take the view with it
     or the other way round. */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  ok('the ring is still up after a reload',
    await page.evaluate(() => !document.getElementById('scRing').hidden));
  ok('and it is remembered under its own key, away from the schedule',
    await page.evaluate(() => localStorage.getItem('sched.view.v1') === 'ring'
      && !/view/.test(localStorage.getItem('sched.v1') || '')));

  /* A ring that only knew the block you are in would be a dead grey
     circle for the ten hours this week has between Trading and Read.
     Between blocks it counts down the GAP, which is a span too. */
  await page.evaluate(() => {
    const FROZEN = new Date('2026-09-01T14:00:00').getTime();
    const R = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends R {
      constructor(...a) { super(...(a.length ? a : [FROZEN])); }
      static now() { return FROZEN; }
    };
    document.getElementById('scView').click();
    document.getElementById('scView').click();
  });
  await page.waitForTimeout(220);
  const gap = await page.evaluate(() => {
    const marks = [...document.querySelectorAll('#scRingSvg path')];
    const lit = marks.filter((p) => p.getAttribute('stroke') === '#e2231a').length;
    return { kick: document.getElementById('scRingKick').textContent,
             name: document.getElementById('scRingName').textContent,
             n: marks.length, lit };
  });
  ok('between blocks the ring counts the wait, not nothing',
    gap.kick === 'Until' && gap.n > 4 && gap.lit > 0 && gap.lit < gap.n, gap);

  await page.click('#scView');
  await page.waitForTimeout(180);
  ok('and the rail comes back when you switch away',
    await page.evaluate(() => !document.getElementById('scRail').hidden
      && document.getElementById('scRing').hidden));

  /* ── the ring takes its colour from the tokens ──
     SVG presentation attributes take a literal, so the marks were drawn
     with the palette's hex typed into the string — a copy of a token
     that drifts the moment the palette moves. Proven by moving it: push
     a colour nothing in this app uses onto :root, repaint, and the
     marks have to come back wearing it. Reverting scInk to the literals
     leaves them red and this falls over. */
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--red', 'rgb(0, 128, 255)');
    document.documentElement.style.setProperty('--tick-off', 'rgb(9, 9, 9)');
    document.getElementById('scView').click();
  });
  await page.waitForTimeout(220);
  const themed = await page.evaluate(() => {
    const m = [...document.querySelectorAll('#scRingSvg path')].map((p) => p.getAttribute('stroke'));
    return { lit: m.filter((c) => c === 'rgb(0, 128, 255)').length,
             off: m.filter((c) => c === 'rgb(9, 9, 9)').length,
             stale: m.filter((c) => /e2231a|ececec/i.test(c)).length,
             head: document.querySelector('#scRingSvg circle[fill]').getAttribute('fill') };
  });
  ok('the marks are drawn in whatever --red currently is',
    themed.lit > 0 && themed.off > 0 && themed.stale === 0
    && themed.head === 'rgb(0, 128, 255)', themed);

  /* And the ground is a gradient the palette can reach, which on the
     shipped palette resolves to the flat white page it has always been.
     Sampled off a real pixel in a corner nothing is drawn in. */
  await page.evaluate(() => {
    document.documentElement.style.removeProperty('--red');
    document.documentElement.style.removeProperty('--tick-off');
    document.getElementById('scView').click();
  });
  await page.waitForTimeout(180);
  const corner = await (async () => {
    const png = PNG.sync.read(await page.screenshot());
    const i = (png.width * Math.round(300 * dpr) + Math.round(376 * dpr)) << 2;
    return [png.data[i], png.data[i + 1], png.data[i + 2]];
  })();
  ok('the default ground is still flat white paper',
    corner.every((c) => c === 255), corner);

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
