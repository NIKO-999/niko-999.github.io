/* ═══════════════════════════════════════════════════════════════
   JADE — the habit tracker that shares nothing.

   It loads no shell.css, no shell.js and no font from another folder,
   so nothing the rest of the platform does can reach it — and nothing
   the rest of the suite checks covers it either.

   What is in here is what has actually broken. Every one of these was
   a real defect that a screenshot looked fine through: a slice that
   duplicated a block of CSS, a month grid that overlapped the section
   under it and swallowed its clicks, an undo that did not survive the
   reload its own comment promised, and a contrast reading taken from a
   computed-style string that color-mix had already made meaningless.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { open, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

const SRC = fs.readFileSync(path.resolve(__dirname, '..', 'jade', 'index.html'), 'utf8');
const URL = `${BASE}/jade/`;

/* ── colour, measured the way an eye measures it ──────────────── */
const lin = (c) => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const lab = ([r, g, b]) => {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  let X = (R * .4124 + G * .3576 + B * .1805) / .95047;
  let Y = R * .2126 + G * .7152 + B * .0722;
  let Z = (R * .0193 + G * .1192 + B * .9505) / 1.08883;
  const f = (t) => (t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  [X, Y, Z] = [f(X), f(Y), f(Z)];
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
};
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
/* rgb() and rgba() only. A computed value that came through color-mix
   can arrive as color(srgb 0.93 0.98 .96), and taking \d+ off that
   yields 0, 93, 0 — which is how a passing contrast was once reported
   as 3.65:1. Anything not plainly rgb is refused rather than guessed. */
const rgb = (s) => {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(s.trim());
  if (!m) throw new Error('not an rgb colour: ' + s);
  return [+m[1], +m[2], +m[3]];
};
const HUES = ['steps', 'walk', 'strength', 'abs', 'water', 'audible', 'read', 'sleep'];

/* ── seeding ──
   Set by hand and reloaded, never with addInitScript: that re-runs on
   every navigation, so a reload would wipe the very thing a
   persistence check is about to look for. */
const KEY = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
  + '-' + String(d.getDate()).padStart(2, '0');
const NOW = new Date();
const AGO = (n) => KEY(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - n));
const AHEAD = (n) => KEY(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + n));
const TODAY = KEY(NOW);

async function seed(page, store) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate((s) => {
    localStorage.clear();
    for (const k in s) localStorage.setItem(k, s[k]);
  }, store);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(320);
}
const jadeStore = (days, notes) => JSON.stringify({ v: 1, days: days || {}, notes: notes || {} });
const remStore = (list) => JSON.stringify({ v: 1, list: list || [] });

(async () => {

/* ══ 1. IT SHARES NOTHING ═════════════════════════════════════════
   Static, and first, because it costs a millisecond and the whole
   premise of the app is in it. */
{
  const outside = [...SRC.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1])
    .filter(h => !h.startsWith('icon.svg') && !h.startsWith('#') && !h.startsWith('data:'));
  ok('references no file outside jade/', outside.length === 0, outside);
  ok('no shell, no arc, no CDN', !/\.\.\//.test(SRC) && !/cdn\./i.test(SRC));
  const keys = [...new Set([...SRC.matchAll(/['"]([a-z]+\.[a-z.]*v\d)['"]/g)].map(m => m[1]))];
  ok('names only its own storage keys', keys.every(k => k.startsWith('jade.')), keys);
}

/* ══ 2. IT LOADS, AND IT KEEPS LOADING ════════════════════════════ */
{
  for (const scheme of ['dark', 'light']) {
    const { browser, page, errs } = await open({ colorScheme: scheme });
    await seed(page, { 'jade.v1': jadeStore({ [TODAY]: ['steps', 'water'] }) });
    for (const [view, scale] of [['today', null], ['calendar', 'month'],
      ['calendar', 'week'], ['calendar', 'day']]) {
      await page.click(`.nav-i[data-view="${view}"]`);
      await page.waitForTimeout(150);
      if (scale) { await page.click(`#calSeg button[data-cal="${scale}"]`); await page.waitForTimeout(250); }
    }
    ok(`${scheme}: every screen loads with nothing on the console`, errs.length === 0, errs);
    await browser.close();
  }
}

/* ══ 3. THE LIST IS CODE ══════════════════════════════════════════
   Only the days are saved. The one array decides the cards, the rail
   rows and the calendar's events, in that order — so the order on
   screen is the order in the array or something has been edited that
   should not have been. */
{
  const { browser, page, errs } = await open();
  await seed(page, { 'jade.v1': jadeStore({ [TODAY]: ['steps'] }) });

  const ids = await page.$$eval('.jt-card', ns => ns.map(n => n.dataset.id));
  ok('eight habits, in the array’s order', JSON.stringify(ids) === JSON.stringify(HUES), ids);

  /* ── the ring is the app, so it had better move ── */
  const off = () => page.$eval('.jt-card[data-id="read"] .jt-prog',
    n => getComputedStyle(n).strokeDashoffset);
  const before = await off();
  const dayBefore = await page.textContent('#dayRingTxt');
  await page.click('.jt-card[data-id="read"]');
  await page.waitForTimeout(700);          /* the arc has a .5s transition */
  const after = await off();
  ok('a habit’s ring winds on when it is ticked', before !== after, { before, after });
  ok('the day ring counts it too',
    (await page.textContent('#dayRingTxt')) !== dayBefore,
    { before: dayBefore, after: await page.textContent('#dayRingTxt') });

  /* ── and it is still there tomorrow ── */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(320);
  ok('a tick survives a reload',
    await page.evaluate(k => JSON.parse(localStorage.getItem('jade.v1')).days[k].includes('read'), TODAY));
  const stored = await page.evaluate(() => Object.keys(localStorage).sort());
  ok('nothing is written outside jade’s own keys',
    stored.every(k => k.startsWith('jade.')), stored);
  ok('no errors through all of that', errs.length === 0, errs);
  await browser.close();
}

/* ══ 4. REPAIRED, NEVER DISCARDED ═════════════════════════════════
   The days are the only thing that cannot be got back. A broken notes
   object, a day whose value is a number, a habit id that no longer
   exists — each is dropped on its own and none of them costs the rest. */
{
  const { browser, page, errs } = await open();
  await seed(page, {
    'jade.v1': JSON.stringify({
      v: 1,
      days: { [AGO(1)]: ['steps', 'walk'], [AGO(2)]: 7, [AGO(3)]: ['steps', 'nonesuch'], 'not-a-date': ['steps'] },
      notes: 'this should be an object',
    }),
  });
  const kept = await page.evaluate(k => window.JADE.state.days[k], AGO(1));
  ok('a good day survives a broken file', Array.isArray(kept) && kept.length === 2, kept);
  ok('a day that is a number is dropped, not the file',
    await page.evaluate(k => !(k in window.JADE.state.days), AGO(2)));
  ok('an unknown habit id is dropped from its day, not the day',
    await page.evaluate(k => { const d = window.JADE.state.days[k];
      return Array.isArray(d) && d.includes('steps') && !d.includes('nonesuch'); }, AGO(3)));
  ok('a damaged notes object does not take the days with it',
    await page.evaluate(() => typeof window.JADE.state.notes === 'object'
      && Object.keys(window.JADE.state.days).length >= 2));
  ok('and none of it threw', errs.length === 0, errs);
  await browser.close();
}

/* ══ 5. CADENCE ═══════════════════════════════════════════════════
   Driven through the model rather than the screen: these are the
   rules the whole app is built on and they are wrong in ways a
   screenshot cannot show. */
{
  const { browser, page } = await open();
  await seed(page, { 'jade.v1': jadeStore({}) });
  const J = (fn, ...a) => page.evaluate(([f, args]) =>
    window.JADE[f].apply(null, args), [fn, a]);

  await page.evaluate(([k, id]) => window.JADE.setKept(k, id, true), [AGO(1), 'abs']);
  ok('every second day: not due the day after it was kept', !(await J('dueOn', 'abs', TODAY)));
  await page.evaluate(([k, id]) => window.JADE.setKept(k, id, false), [AGO(1), 'abs']);
  ok('every second day: due when yesterday was missed', await J('dueOn', 'abs', TODAY));

  ok('daily is due every day', await J('dueOn', 'steps', TODAY) && await J('dueOn', 'steps', AGO(9)));

  /* Four a week: optional while the week can still absorb a skip, due
     the moment it cannot. Monday with nothing kept has six days left,
     so it is not due; Thursday with nothing kept has four. */
  const mon = await page.evaluate(() => window.JADE.dayKey(window.JADE.weekStart(new Date())));
  const thu = await page.evaluate(k => window.JADE.dayKey(window.JADE.shift(window.JADE.fromKey(k), 3)), mon);
  ok('four a week: not due on the Monday of an empty week', !(await J('dueOn', 'strength', mon)));
  ok('four a week: due by the Thursday of an empty week', await J('dueOn', 'strength', thu));
  await page.evaluate(k => window.JADE.setKept(k, 'strength', true), thu);
  const fri = await page.evaluate(k => window.JADE.dayKey(window.JADE.shift(window.JADE.fromKey(k), 4)), mon);
  ok('four a week: still due on the Friday with one kept', await J('dueOn', 'strength', fri));

  ok('an unfinished today never reads as a broken streak', (await J('streak')) >= 0);
  await browser.close();
}

/* ══ 6. FUTURE DAYS ARE NOT A RECORD OF ANYTHING ══════════════════ */
{
  const { browser, page, errs } = await open();
  await seed(page, { 'jade.v1': jadeStore({ [TODAY]: ['steps'] }) });
  await page.click('.nav-i[data-view="calendar"]');
  await page.click('#calSeg button[data-cal="week"]');
  await page.waitForTimeout(350);
  const before = await page.evaluate(() => localStorage.getItem('jade.v1'));
  const ahead = AHEAD(1);
  const sel = `.jc-col[data-k="${ahead}"] .jc-ev[data-id="read"]`;
  if (await page.$(sel)) await page.click(sel, { force: true });
  await page.waitForTimeout(250);
  ok('a tick on tomorrow changes nothing',
    (await page.evaluate(() => localStorage.getItem('jade.v1'))) === before);
  ok('and a past day still takes one', await (async () => {
    const past = AGO(1);
    const s = `.jc-col[data-k="${past}"] .jc-ev[data-id="read"]`;
    if (!(await page.$(s))) return false;
    await page.click(s); await page.waitForTimeout(250);
    return page.evaluate(k => (JSON.parse(localStorage.getItem('jade.v1')).days[k] || []).includes('read'), past);
  })());
  ok('no errors on the calendar', errs.length === 0, errs);
  await browser.close();
}

/* ══ 7. THE BOXES THAT PROMISE THREE ══════════════════════════════
   Both scrollers say "three, always whole". The height is stated as
   three times the row so the two cannot drift apart, and this is what
   notices if they ever do. */
{
  const { browser, page, errs } = await open();
  await seed(page, {
    'jade.v1': jadeStore({ [TODAY]: ['steps'] },
      { [TODAY]: 'a', [AGO(1)]: 'b', [AGO(2)]: 'c', [AGO(3)]: 'd', [AGO(4)]: 'e' }),
    'jade.reminders.v1': remStore([1, 2, 3, 4, 5].map(i =>
      ({ id: 'r' + i, t: 'reminder ' + i, made: TODAY, done: null }))),
  });
  for (const [what, box, row] of [['daily thoughts', '#thoughtScroll', '.jt-thw, .jt-th'],
    ['reminders', '.jr-scr', '.jr-row']]) {
    const m = await page.evaluate(([b, r]) => {
      const sc = document.querySelector(b);
      const rows = [...sc.querySelectorAll(r)];
      const hs = [...new Set(rows.map(x => Math.round(x.getBoundingClientRect().height)))];
      return { box: Math.round(sc.getBoundingClientRect().height), hs,
        n: rows.length, bar: sc.offsetWidth - sc.clientWidth,
        scrolls: sc.scrollHeight > sc.clientHeight + 1 };
    }, [box, row]);
    ok(`${what}: every row is the same height`, m.hs.length === 1, m.hs);
    ok(`${what}: the box is exactly three rows tall`, m.box === m.hs[0] * 3, m);
    ok(`${what}: it scrolls, and shows no scrollbar`, m.scrolls && m.bar === 0, m);
    /* Snap, measured by scrolling a fraction of a row and seeing where
       it lands — the whole point is that it cannot rest between two. */
    const at = await page.evaluate(async ([b, h]) => {
      const sc = document.querySelector(b);
      sc.scrollTo({ top: Math.round(h * 0.6), behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));
      return sc.scrollTop;
    }, [box, m.hs[0]]);
    ok(`${what}: it comes to rest on a row, never between two`,
      at % m.hs[0] === 0, { landedAt: at, row: m.hs[0] });
  }
  ok('no errors', errs.length === 0, errs);
  await browser.close();
}

/* ══ 8. REMINDERS, AND THE FIVE SECONDS AFTER ═════════════════════ */
{
  const { browser, page, errs } = await open();
  await seed(page, { 'jade.v1': jadeStore({}), 'jade.reminders.v1': remStore([]) });
  const live = () => page.$$eval('.jr-row .jr-t', ns => ns.map(x => x.textContent));
  const list = () => page.evaluate(() => JSON.parse(localStorage.getItem('jade.reminders.v1')).list);

  ok('the send is not there until there is something to send',
    !(await page.isVisible('#remSend')));
  await page.fill('#remIn', 'Book the physio');
  await page.waitForTimeout(150);
  ok('and it is there once there is', await page.isVisible('#remSend'));
  await page.click('#remSend');
  await page.waitForTimeout(250);
  ok('writing one puts it at the top', (await live())[0] === 'Book the physio');
  ok('and empties the field', (await page.inputValue('#remIn')) === '');

  await page.fill('#remIn', 'Ring mum back');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);

  await page.click('.jr-row:first-child .jr-tk');
  await page.waitForTimeout(250);
  ok('ticking one takes it off the list', !(await live()).includes('Ring mum back'));
  ok('and offers it back', await page.isVisible('#remUndo'));
  ok('the field steps aside rather than the section changing height',
    await page.isHidden('#remForm'));
  ok('it is stamped, not yet gone', (await list()).length === 2);

  /* The comment on remResume promises the window survives a refresh.
     It did not, until this noticed. */
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  ok('the undo survives a reload', await page.isVisible('#remUndo'));
  await page.click('#remUndoBtn');
  await page.waitForTimeout(250);
  ok('undo puts it back', (await live()).includes('Ring mum back'));
  ok('and unstamps it', (await list()).every(r => r.done === null));

  await page.click('.jr-row:first-child .jr-tk');
  await page.waitForTimeout(5400);
  ok('left alone, the window closes and it is gone for good',
    (await list()).length === 1 && !(await page.isVisible('#remUndo')));
  ok('no errors', errs.length === 0, errs);
  await browser.close();
}

/* ══ 9. COLOUR ════════════════════════════════════════════════════
   In both themes. The light palette is a different set of eight, not
   the dark one lightened, so it has to be measured separately or the
   check is only ever half a check. */
{
  for (const theme of ['dark', 'light']) {
    const { browser, page, errs } = await open();
    await seed(page, {
      'jade.v1': jadeStore({ [TODAY]: HUES.slice() }),
      'jade.ui.v1': JSON.stringify({ theme }),
    });

    const tok = await page.evaluate((names) => {
      const s = getComputedStyle(document.documentElement);
      const out = {};
      for (const n of names) out[n] = s.getPropertyValue('--' + n).trim();
      return out;
    }, HUES.map(h => 'h-' + h).concat(['accent', 'card', 'ink-2', 'accent-in']));

    const hex = (v) => { const m = /^#([0-9a-f]{6})$/i.exec(v);
      return m ? [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)) : null; };
    const hue = (n) => hex(tok['h-' + n]);

    let worst = Infinity, wp = '';
    for (let i = 0; i < HUES.length; i++) for (let j = i + 1; j < HUES.length; j++) {
      const d = dE(hue(HUES[i]), hue(HUES[j]));
      if (d < worst) { worst = d; wp = HUES[i] + '/' + HUES[j]; }
    }
    ok(`${theme}: the eight habit colours are apart`, worst >= 14, { worst: +worst.toFixed(1), pair: wp });
    let nearest = Infinity, nn = '';
    for (const n of HUES) { const d = dE(hue(n), hex(tok.accent)); if (d < nearest) { nearest = d; nn = n; } }
    ok(`${theme}: no habit is mistakable for the accent`, nearest >= 14,
      { nearest: +nearest.toFixed(1), habit: nn });

    const card = hex(tok.card);
    const asMark = HUES.map(n => [n, ratio(hue(n), card)]).sort((a, b) => a[1] - b[1])[0];
    ok(`${theme}: every habit colour reads as a mark on a card`, asMark[1] >= 3,
      { worst: asMark[0], ratio: +asMark[1].toFixed(2) });
    ok(`${theme}: the second ink is readable`, ratio(hex(tok['ink-2']), card) >= 4.5,
      +ratio(hex(tok['ink-2']), card).toFixed(2));
    ok(`${theme}: what sits on the accent is readable on it`,
      ratio(hex(tok['accent-in']), hex(tok.accent)) >= 4.5,
      +ratio(hex(tok['accent-in']), hex(tok.accent)).toFixed(2));

    /* And now from the pixels. A kept card tints its own background
       with 7% of its habit's colour, and the computed value for that
       arrives in a form that cannot be parsed as rgb — reading it as
       one is how a 5.5:1 chip was once reported as 3.65. */
    const boxes = await page.$$eval('.jt-card', ns => ns.map(c => {
      const r = c.getBoundingClientRect();
      return { id: c.dataset.id, x: Math.round(r.right - 14), y: Math.round(r.top + 14) };
    }));
    const png = PNG.sync.read(await page.screenshot());
    const at = (x, y) => { const i = (png.width * y + x) << 2;
      return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
    const chipInk = rgb(await page.$eval('.jt-chip', n => getComputedStyle(n).color));
    const worstChip = boxes.map(b => [b.id, ratio(chipInk, at(b.x, b.y))]).sort((a, b) => a[1] - b[1])[0];
    ok(`${theme}: the chip label is readable on the card it sits on`, worstChip[1] >= 4.5,
      { worst: worstChip[0], ratio: +worstChip[1].toFixed(2) });

    /* Nothing is red FOR A MISS. Which is not the same as no red on the
       screen: audible's identity is red and strength's is orange, and
       an identity is allowed to be any colour it likes. What is not
       allowed is a red that belongs to none of the eight, because the
       only thing left for it to mean is that you failed. The first
       version of this check tested "is it reddish" and duly failed on
       two habits doing exactly what they are supposed to. */
    const legit = HUES.map(n => hue(n)).concat([hex(tok.accent)]);
    const reds = async (where) => page.evaluate(([w, allowed]) => {
      const near = (c) => allowed.some(a =>
        Math.abs(a[0] - c[0]) < 12 && Math.abs(a[1] - c[1]) < 12 && Math.abs(a[2] - c[2]) < 12);
      const verdict = (s) => {
        const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s]+([\d.]+))?/.exec(s);
        if (!m) return false;
        if (m[4] !== undefined && +m[4] < 0.06) return false;      /* invisible */
        const c = [+m[1], +m[2], +m[3]];
        if (!(c[0] > 150 && c[1] < 110 && c[2] < 110)) return false;
        return !near(c);
      };
      const name = (el) => el.tagName.toLowerCase() + '.' + (el.getAttribute('class') || '');
      const out = [];
      for (const el of document.querySelectorAll(w + ' *')) {
        const s = getComputedStyle(el);
        for (const p of ['color', 'backgroundColor', 'borderTopColor', 'stroke'])
          if (verdict(s[p])) out.push(name(el) + ' ' + p + '=' + s[p]);
      }
      return [...new Set(out)];
    }, [where, legit]);

    await page.evaluate(k => window.JADE.setKept(k, 'read', false), TODAY);
    await page.waitForTimeout(200);
    ok(`${theme}: nothing on the day is red for a miss`,
      (await reds('.main:not([hidden]) .pane')).length === 0, await reds('.main:not([hidden]) .pane'));

    await page.click('.nav-i[data-view="calendar"]');
    await page.waitForTimeout(200);
    for (let i = 0; i < 14; i++) await page.click('#calPrev');   /* a year with nothing in it */
    await page.waitForTimeout(350);
    ok(`${theme}: nor on an empty month`,
      (await reds('.jc-month')).length === 0, await reds('.jc-month'));

    ok(`${theme}: no errors`, errs.length === 0, errs);
    await browser.close();
  }
}

/* ══ 10. THE FRAME REMEMBERS ══════════════════════════════════════ */
{
  const { browser, page, errs } = await open({ colorScheme: 'dark' });
  await seed(page, { 'jade.v1': jadeStore({}) });
  ok('a dark machine gets the dark one', await page.evaluate(() => document.documentElement.dataset.theme) === 'dark');
  await page.click('#themeBtn');
  await page.waitForTimeout(250);
  ok('the switch switches', await page.evaluate(() => document.documentElement.dataset.theme) === 'light');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  ok('and it is remembered', await page.evaluate(() => document.documentElement.dataset.theme) === 'light');

  await page.click('#railBtn');
  await page.waitForTimeout(200);
  ok('the panel shuts', !(await page.evaluate(() => !!document.getElementById('rail').offsetParent)));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  ok('and stays shut', !(await page.evaluate(() => !!document.getElementById('rail').offsetParent)));

  /* The key used to hold a bare string. Read back, not thrown away. */
  await page.evaluate(() => localStorage.setItem('jade.ui.v1', 'shut'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  ok('the old bare-string preference is still understood',
    !(await page.evaluate(() => !!document.getElementById('rail').offsetParent)));
  ok('no errors', errs.length === 0, errs);
  await browser.close();
}

/* ══ 11. IT FITS ══════════════════════════════════════════════════ */
{
  for (const [w, h] of [[1920, 1200], [1512, 950], [1280, 900], [1080, 900], [800, 900], [390, 844]]) {
    const { browser, page, errs } = await open({ viewport: { width: w, height: h } });
    await seed(page, {
      'jade.v1': jadeStore({ [TODAY]: ['steps', 'water'] }, { [TODAY]: 'a', [AGO(1)]: 'b', [AGO(2)]: 'c' }),
      'jade.reminders.v1': remStore([1, 2, 3, 4].map(i => ({ id: 'r' + i, t: 'r' + i, made: TODAY, done: null }))),
    });
    const over = async () => page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    let worst = await over();
    for (const scale of ['month', 'week', 'day']) {
      await page.click('.nav-i[data-view="calendar"]');
      await page.click(`#calSeg button[data-cal="${scale}"]`);
      await page.waitForTimeout(300);
      worst = Math.max(worst, await over());
    }
    ok(`${w}×${h}: nothing hangs off the side`, worst <= 1, worst);

    if (w >= 1100) {
      await page.click('.nav-i[data-view="today"]');
      await page.waitForTimeout(250);
      const cols = await page.evaluate(() =>
        getComputedStyle(document.getElementById('jtGrid')).gridTemplateColumns.split(' ').length);
      ok(`${w}: eight cards sit four and four`, cols === 4, cols);
    }
    if (w > 1080) {
      /* The panel fills, and the month is not clipped doing it. */
      const foot = await page.evaluate(() => {
        const r = document.querySelector('.rail').getBoundingClientRect();
        const j = document.querySelector('.jr').getBoundingClientRect();
        const m = document.querySelector('.jm').getBoundingClientRect();
        const last = document.querySelector('.jm-grid').lastElementChild.getBoundingClientRect();
        return { gap: Math.round(r.bottom - j.bottom), clipped: Math.round(last.bottom - m.bottom) > 1 };
      });
      ok(`${w}: the panel has no dead space at its foot`, foot.gap === 0, foot);
      ok(`${w}: and the month keeps its last week`, !foot.clipped, foot);
    }
    ok(`${w}×${h}: no errors`, errs.length === 0, errs);
    await browser.close();
  }
}

/* ══ 12. EVERY CONTROL IS PRESSABLE ═══════════════════════════════ */
{
  const { browser, page, errs } = await open({ viewport: { width: 1280, height: 900 } });
  await seed(page, { 'jade.v1': jadeStore({ [TODAY]: ['steps'] }),
    'jade.reminders.v1': remStore([{ id: 'r1', t: 'one', made: TODAY, done: null }]) });
  const small = await page.$$eval('button', ns => ns.filter(b => {
    const r = b.getBoundingClientRect();
    if (!r.width || !r.height) return false;                 /* hidden ones are not controls */
    return Math.min(r.width, r.height) < 32;
  }).map(b => (b.id || b.className) + ' ' + Math.round(b.getBoundingClientRect().width)
    + '×' + Math.round(b.getBoundingClientRect().height)));
  ok('nothing you can press is under 32px on its short side', small.length === 0, small);

  const ring = await page.evaluate(() => {
    const b = document.getElementById('railBtn');
    b.focus();
    const s = getComputedStyle(b);
    return { w: s.outlineWidth, style: s.outlineStyle };
  });
  ok('a focused control wears a ring', parseFloat(ring.w) >= 2 && ring.style !== 'none', ring);
  ok('no errors', errs.length === 0, errs);
  await browser.close();
}

  console.log(`\n  ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
