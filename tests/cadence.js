/* ═══════════════════════════════════════════════════════════════
   CADENCE — the block you are in, the habits, the month and the
   training log, every one of them a figure and dots.

   The clock is frozen at Friday 25 September 2026, 10:20, so which
   block is running and which are behind you is a fact about the
   fixture rather than about the hour the suite happens to run.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');
const { PNG } = require('pngjs');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
  isMobile: true, hasTouch: true, locale: 'en-GB', colorScheme: 'dark' };
const URL = `${BASE}/cadence/`;
const DPR = 2;

const freeze = (at) => `(() => {
  const F = new Date('${at}').getTime(); const R = Date;
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;

const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
/* A computed colour is `rgb()`, `rgba()` or — for a colour-mix —
   `color(srgb r g b / a)` in 0..1. A digit match reads the last as black. */
const rgbaOf = (s) => {
  let m = /color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/.exec(s);
  if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
  m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(s);
  return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
};
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]));

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });

  async function ctx(opts = {}) {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze(opts.at || '2026-09-25T10:20:00'));
    if (opts.init) await c.addInitScript(opts.init);
    const page = await c.newPage();
    const errs = [], off = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('request', (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) off.push(r.url()); });
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    return { c, page, errs, off };
  }
  const store = (page, k) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), k);
  const sheetUp = (page) => page.waitForSelector('#cdSheet.is-open', { timeout: 2000 }).then(() => true, () => false);
  const closeSheet = async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(320); };
  const shoot = async (page) => {
    const png = PNG.sync.read(await page.screenshot());
    return (x, y) => { const i = (Math.round(y * DPR) * png.width + Math.round(x * DPR)) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
  };

  /* Text read on composited pixels: the ground is the MOST COMMON pixel in
     the element's own box, the ink is its computed colour laid over that
     ground. Anything inside a pane's faded ends is skipped — a word the
     mask is dissolving is not a word anybody is asked to read. */
  async function inkFloor(page, sel) {
    const items = await page.$$eval(sel, (es) => es.map((e) => {
      const r = e.getBoundingClientRect(), p = e.closest('.cd-pane'), pr = p && p.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, c: getComputedStyle(e).color, t: e.textContent.trim().slice(0, 24),
        faded: pr ? (r.top < pr.top + 10 || r.bottom > pr.bottom - 30) : false };
    }).filter((i) => i.w > 0 && i.h > 0 && !i.faded && i.y + i.h < innerHeight));
    const png = PNG.sync.read(await page.screenshot());
    let worst = { r: 99 };
    const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    items.forEach((it) => {
      /* On a gradient every ground pixel is a slightly different colour and
         every fully-inked one is identical, so a bare mode can pick the ink.
         The glyphs are taken out first — anything near the ink, raw or laid
         over the box's own edge — and the ground is the commonest of what is
         left, read in steps of four. */
      const px = [], x0 = Math.ceil(it.x * DPR), x1 = Math.floor((it.x + it.w) * DPR) - 1;
      const y0 = Math.ceil(it.y * DPR), y1 = Math.floor((it.y + it.h) * DPR) - 1;
      const get = (x, y) => { const i = (y * png.width + x) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) px.push(get(x, y));
      const edge = [];
      for (let x = x0; x <= x1; x++) edge.push(get(x, y0), get(x, y1));
      edge.sort((p, q) => lum(p) - lum(q));
      const ink = rgbaOf(it.c), inkOnEdge = over(ink, edge[edge.length >> 1]);
      const n = {};
      px.forEach((p) => {
        if (d(p, ink) < 40 || d(p, inkOnEdge) < 40) return;
        const k = p.map((c) => c >> 2).join(',');
        (n[k] = n[k] || []).push(p);
      });
      const keys = Object.keys(n);
      const best = keys.length ? n[keys.sort((a, b) => n[b].length - n[a].length)[0]] : [edge[edge.length >> 1]];
      const g = [0, 1, 2].map((i) => Math.round(best.reduce((t, p) => t + p[i], 0) / best.length));
      const r = ratio(over(rgbaOf(it.c), g), g);
      if (r < worst.r) worst = { r: +r.toFixed(2), t: it.t, ground: g, ink: it.c };
    });
    return { n: items.length, worst };
  }

  /* A DOT is a graphic, so it is held to 3:1 against the sky beside it.
     Its strongest pixel is what is read — the middle of a filled dot, the
     ring of a hollow one — against the ground a little to its left, clear
     of any glow. The measurement is the drawing, never the class. */
  async function dotRatios(page, sel, off = 15) {
    const boxes = await page.$$eval(sel, (es) => es.map((e) => {
      const r = e.getBoundingClientRect(), host = e.closest('[data-state], .cd-it, .cd-hr');
      return { x: r.left, y: r.top, w: r.width, h: r.height, st: host ? (host.dataset.state || host.className) : '' };
    }).filter((b) => b.w > 0 && b.y + b.h < innerHeight));
    const png = PNG.sync.read(await page.screenshot());
    const get = (x, y) => { const i = (y * png.width + x) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
    return boxes.map((b) => {
      const g = get(Math.round((b.x + b.w / 2 - off) * DPR), Math.round((b.y + b.h / 2) * DPR));
      let best = 1, px = g;
      for (let y = Math.floor(b.y * DPR); y <= Math.ceil((b.y + b.h) * DPR); y++)
        for (let x = Math.floor(b.x * DPR); x <= Math.ceil((b.x + b.w) * DPR); x++) {
          const p = get(x, y), r = ratio(p, g);
          if (r > best) { best = r; px = p; }
        }
      return { st: b.st, r: +best.toFixed(2), px, g };
    });
  }
  const heroOf = (page) => page.evaluate(() => {
    const t = (id) => { const e = document.getElementById(id); return e.getClientRects().length ? e.textContent : ''; };
    return [t('cdHeroK'), t('cdHeroN'), t('cdHeroS'), t('cdThenN')];
  });
  const shown = (page, sel) => page.$eval(sel, (e) => e.getClientRects().length > 0);
  const listOf = (page) => page.$$eval('.cd-it', (ls) => ls.map((l) => l.dataset.id));

  console.log('\n── the day is the block you are in ──');
  {
    const { c, page, errs, off } = await ctx();
    ok('the middle of the screen is the block running: its part of life and the clock, its name, what is left and when it ends',
      (await heroOf(page)).join('|') === 'Now · Work · 10:20|Deep work|1h 40m left · until 12:00|Lunch at 12:30', await heroOf(page));
    ok('and the line over it is in that part of life\'s own colour', (await page.$eval('#cdHeroK', (e) => getComputedStyle(e).color)) === 'rgb(232, 198, 124)');
    const sizes = await page.evaluate(() => {
      const all = [...document.querySelectorAll('#cdVDay *')].filter((e) => e.childElementCount === 0 && e.textContent.trim() && e.getClientRects().length);
      return { name: parseFloat(getComputedStyle(document.getElementById('cdHeroN')).fontSize), top: Math.max(...all.map((e) => parseFloat(getComputedStyle(e).fontSize))) };
    });
    ok('the name is the biggest thing on the screen', sizes.name === 46 && sizes.top === 46, sizes);

    /* How far through, drawn: 10:20 is 80 of Deep work's 180 minutes. The
       width is read off the drawing, not off the style that made it. */
    const bar = await page.evaluate(() => {
      const t = document.getElementById('cdBar').getBoundingClientRect(), f = document.getElementById('cdBarI');
      return { p: f.getBoundingClientRect().width / t.width, bg: getComputedStyle(f).backgroundColor, sh: getComputedStyle(f).boxShadow };
    });
    ok('the line under it is how far through the block you are', Math.abs(bar.p - 80 / 180) < .005, bar.p);
    const glow = rgbaOf(bar.sh);
    ok('drawn in the block\'s colour, and lit', bar.bg === 'rgb(232, 198, 124)' && !!glow && Math.hypot(glow[0] - 232, glow[1] - 198, glow[2] - 124) < 2, bar);

    /* The block in the middle and the one after it are said once. */
    ok('the list is the rest of the day, in time order — the block you are in and the next are not said twice',
      (await listOf(page)).join() === 's0,s1,s5,s8,s9', await listOf(page));
    const times = await page.$$eval('.cd-it .cd-rt', (ts) => ts.map((t) => t.textContent));
    ok('every row carries its start', times.join() === '07:00,07:30,14:00,21:30,22:30', times);

    /* THE CHECK. One white round control, and it ticks the block in the middle. */
    const go = await page.$eval('#cdGo', (b) => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
      return { w: r.width, cx: r.left + r.width / 2, b: r.bottom, bg: cs.backgroundColor, rad: cs.borderRadius, l: b.getAttribute('aria-label'), p: b.getAttribute('aria-pressed') }; });
    ok('the one white control is a round check at the foot of the screen', go.w === 64 && Math.abs(go.cx - 195) < 1 && go.b > 780 && go.bg === 'rgb(243, 245, 247)' && go.rad === '50%', go);
    ok('and it is named for the block it ticks', go.l === 'Mark Deep work kept' && go.p === 'false', go);
    await page.click('#cdGo');
    ok('pressing it keeps the block you are in', (await store(page, 'cad.log.v1'))['2026-09-25'].s3 === 1);
    const kept = await page.$eval('#cdGo', (b) => ({ p: b.getAttribute('aria-pressed'), l: b.getAttribute('aria-label'), bg: getComputedStyle(b).backgroundColor }));
    ok('and it lights in the block\'s own colour, and says so', kept.p === 'true' && kept.l === 'Deep work kept. Untick' && kept.bg === 'rgb(232, 198, 124)', kept);
    ok('today\'s dot in the week fills part way', (await page.getAttribute('.cd-wd[data-d="2026-09-25"]', 'data-state')) === 'part');
    await page.click('#cdGo');
    ok('pressing it again unticks it', !((await store(page, 'cad.log.v1'))['2026-09-25'] || {}).s3
      && (await page.getAttribute('#cdGo', 'aria-pressed')) === 'false');

    /* The name opens the block, and so does the line after it. */
    await page.click('#cdHeroN');
    ok('the name opens the block you are in', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Deep work');
    await closeSheet(page);
    await page.click('#cdThen');
    ok('and the one after it opens that one', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Lunch');
    await closeSheet(page);

    /* A row's dot ticks it, the tick survives a reload. */
    const dotOf = () => page.$eval('.cd-it[data-id="s0"] .cd-dot', (b) => ({ p: b.getAttribute('aria-pressed'), bg: getComputedStyle(b.firstElementChild).backgroundColor, t: b.textContent.trim() }));
    const before = await dotOf();
    await page.click('.cd-it[data-id="s0"] .cd-dot');
    const after = await dotOf();
    ok('a row\'s dot is its check: pressing it keeps the block', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('and says so by filling, not with a word', before.t === '' && after.t === '' && before.p === 'false' && after.p === 'true' && before.bg !== after.bg, { before, after });
    ok('and it fills with the block\'s own colour', after.bg === 'rgb(125, 207, 216)', after.bg);
    await page.reload(); await page.waitForTimeout(150);
    ok('and survives a reload', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));

    /* THE WEEK. A dot over a letter, Monday first. */
    const wk = await page.$$eval('.cd-wd', (ws) => ws.map((w) => ({ d: w.dataset.d, l: w.textContent, st: w.dataset.state, p: w.getAttribute('aria-pressed'), c: getComputedStyle(w.querySelector('.cd-wl')).color })));
    ok('the week is seven dots over their letters, Monday first', wk.map((w) => w.l).join('') === 'MTWTFSS' && wk[0].d === '2026-09-21', wk.map((w) => w.l));
    ok('today\'s letter is the ink and it is the one chosen', wk[4].c === 'rgb(243, 245, 247)' && wk[4].p === 'true' && wk[3].c !== wk[4].c, wk[4]);
    ok('days before the record began make no claim, and nor do days to come',
      wk.slice(0, 4).every((w) => w.st === 'quiet') && wk[4].st === 'part' && wk.slice(5).every((w) => w.st === 'future'), wk.map((w) => w.st));

    /* Another day has no clock on it: the middle is what that day kept. */
    await page.click('.cd-wd[data-d="2026-09-24"]');
    ok('yesterday is named, and its middle is what it kept', (await heroOf(page)).join('|') === 'Yesterday · 24 Sep|0 of 7|kept · 6h planned|', await heroOf(page));
    ok('and with no clock there is no check, no line and no next', !(await shown(page, '#cdGo')) && !(await shown(page, '#cdBar')) && !(await shown(page, '#cdThen')));
    ok('every block of that day is in the list, and every one is behind you',
      (await page.$$eval('.cd-it', (ls) => ls.length === 7 && ls.every((l) => l.classList.contains('is-past')))));
    ok('yesterday can still be ticked', await page.$$eval('.cd-dot', (bs) => bs.length > 0 && bs.every((b) => !b.disabled)));
    await page.click('.cd-wd[data-d="2026-09-26"]');
    ok('tomorrow says what is planned', (await heroOf(page)).join('|') === 'Tomorrow · 26 Sep|4 blocks|planned · 2h|', await heroOf(page));
    ok('a day ahead cannot be ticked', await page.$$eval('.cd-dot', (bs) => bs.length > 0 && bs.every((b) => b.disabled)));
    await page.click('.cd-wd[data-d="2026-09-27"]');
    ok('any other day is its weekday', (await page.textContent('#cdHeroK')) === 'Sunday · 27 Sep');
    await page.click('.cd-wd[data-d="2026-09-25"]');

    /* Every state of a row's dot is a graphic held to 3:1, and a missed one
       is a grey with no channel standing out — never a red. */
    const dots = await dotRatios(page, '.cd-it .cd-dot i');
    const has = (w) => dots.some((d) => d.st.indexOf(w) >= 0);
    ok('every dot holds 3:1 against the sky beside it, kept, missed or still to come',
      has('is-done') && has('is-past') && dots.some((d) => d.st.indexOf('is-past') < 0 && d.st.indexOf('is-done') < 0) && dots.every((d) => d.r >= 3), dots);
    /* Read as what the dot ADDS to the sky under it: a translucent grey laid
       over a blue night carries the blue through, so the bare pixel is not
       the dot's colour. A neutral adds about the same to every channel; a
       hue does not. */
    const miss = dots.find((d) => d.st.indexOf('is-past') >= 0 && d.st.indexOf('is-done') < 0);
    const add = miss && miss.px.map((v, i) => v - miss.g[i]);
    ok('and a missed dot is a grey, never a red', !!add && (Math.max(...add) - Math.min(...add)) / Math.max(...add) < .25, { miss, add });
    const bpx = await dotRatios(page, '#cdBarI', 120);
    ok('the line of how far through holds 3:1 against the sky', bpx.length === 1 && bpx[0].r >= 3, bpx);

    /* Finishing a training block asks what it was. */
    await page.click('.cd-it[data-id="s1"] .cd-dot');
    ok('ticking the gym asks what you trained', await sheetUp(page));
    await page.click('[data-k="weights.push"]');
    await page.click('[data-k="rest.rest"]');
    const rest = await page.$$eval('[data-k][aria-pressed="true"]', (bs) => bs.map((b) => b.dataset.k));
    ok('rest clears the rest', rest.join() === 'rest.rest', rest);
    ok('and a rest day is not asked how hard or how long',
      await page.$eval('[data-e="Hard"]', (b) => b.getBoundingClientRect().height === 0));
    await page.click('[data-k="weights.push"]');
    const back = await page.$$eval('[data-k][aria-pressed="true"]', (bs) => bs.map((b) => b.dataset.k));
    ok('and picking a lift clears rest', back.join() === 'weights.push', back);
    await page.click('[data-k="weights.core"]');
    await page.click('[data-e="Hard"]');
    await page.click('[data-m="60"]');
    ok('the foot names what it will file', (await page.textContent('#cdLiftGo')) === 'Log Push + Core');
    await page.click('#cdLiftGo');
    await page.waitForTimeout(320);
    const tr = (await store(page, 'cad.train.v1'))['2026-09-25'].s1;
    ok('the session is filed against the block', tr && tr.k.join() === 'weights.push,weights.core' && tr.e === 'Hard' && tr.m === 60, tr);
    ok('and rides the row\'s own line, in the session\'s colour', (await page.textContent('.cd-it[data-id="s1"] .cd-rn')) === 'Gym · Push + Core'
      && (await page.$eval('.cd-it[data-id="s1"] .cd-rw', (e) => getComputedStyle(e).color)) === 'rgb(242, 161, 132)');

    await page.click('.cd-it[data-id="s1"] .cd-dot');
    ok('unticking takes the session off', !((await store(page, 'cad.train.v1'))['2026-09-25'] || {}).s1);

    ok('the day makes no request off this origin', off.length === 0, off);
    ok('no page errors on the day', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the middle, between blocks and at the ends ──');
  {
    const { c, page } = await ctx({ at: '2026-09-25T12:15:00' });
    ok('between two blocks the middle is the next one and how soon', (await heroOf(page)).join('|') === 'Next · Rest · 12:15|Lunch|in 15m · at 12:30|Emails and calls at 14:00', await heroOf(page));
    ok('and with nothing running there is no line of how far through', !(await shown(page, '#cdBar')));
    ok('the check ticks the next one', (await page.getAttribute('#cdGo', 'aria-label')) === 'Mark Lunch kept');
    ok('and the list leaves out the two in the middle', (await listOf(page)).join() === 's0,s1,s3,s8,s9', await listOf(page));
    ok('today with nothing kept yet makes no claim in the week: it is not over',
      (await page.getAttribute('.cd-wd[data-d="2026-09-25"]', 'data-state')) === 'quiet');
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T06:40:00' });
    ok('before the first block, the middle says it is next', (await heroOf(page)).join('|') === 'Next · Rest · 06:40|Wake up|in 20m · at 07:00|Gym at 07:30', await heroOf(page));
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T07:40:00' });
    ok('while the gym runs it is the middle of the screen', (await heroOf(page)).join('|') === 'Now · Body · 07:40|Gym|50m left · until 08:30|Deep work at 09:00', await heroOf(page));
    await page.click('#cdGo');
    ok('and the check asks what you trained', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'What did you train?');
    ok('having kept it', (await store(page, 'cad.log.v1'))['2026-09-25'].s1 === 1);
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T23:10:00' });
    ok('after the last, the middle is what today kept', (await heroOf(page)).join('|') === 'Today · 23:10|0 of 7|kept · nothing left today|', await heroOf(page));
    ok('with no check and nothing to open', !(await shown(page, '#cdGo')) && (await page.$eval('#cdHeroN', (b) => b.disabled)));
    ok('and every block is back in the list', (await listOf(page)).length === 7);
    await c.close();
  }
  {
    const { c, page } = await ctx({ init: `localStorage.setItem('cad.week.v1', JSON.stringify([{ id: 'm1', n: 'Gym', d: [0], s: 420, e: 480 }]));` });
    ok('a day with nothing on says so', (await heroOf(page)).join('|') === 'Today · 25 Sep|Nothing on||', await heroOf(page));
    ok('and offers the way to put something on it', !(await shown(page, '#cdGo')) && /Add a block/.test(await page.textContent('#cdAgenda')));
    await c.close();
  }

  console.log('\n── the sentence ──');
  {
    const { c, page, errs } = await ctx();
    const P = (t) => page.evaluate((t) => window.cadence.parse(t), t);
    let r = await P('walk weekdays 7:45 for 30 mins');
    ok('"walk weekdays 7:45 for 30 mins"', r.n === 'Walk' && r.days.join() === '0,1,2,3,4' && r.s === 465 && r.e === 495, r);
    r = await P('Gym mon wed fri 6:30 to 8');
    ok('"Gym mon wed fri 6:30 to 8"', r.n === 'Gym' && r.days.join() === '0,2,4' && r.s === 390 && r.e === 480, r);
    r = await P('wake at 7');
    ok('a time with no length is a moment, today', r.n === 'Wake' && r.s === 420 && r.e === 420 && r.days.join() === '4', r);
    r = await P('meeting 9 to 5');
    ok('"9 to 5" reads as the afternoon', r.s === 540 && r.e === 1020, r);
    r = await P('read now');
    ok('"now" is the clock, rounded to five', r.n === 'Read' && r.s === 620, r);
    r = await P('call mum in 20 mins');
    ok('"in 20 mins" counts from now', r.s === 640 && r.n === 'Call mum', r);
    r = await P('stretch after training for 15 minutes');
    ok('"after training" finds the gym through the keyword table', r.s === 510 && r.e === 525 && r.n === 'Stretch' && r.after === 'Gym', r);
    r = await P('lunch after the concert');
    ok('an anchor it cannot place stays in the name', r.s === null && /concert/.test(r.n), r);
    r = await P('yoga every sat and sun at 9am for an hour');
    ok('days joined by "and", with a meridiem and "an hour"', r.days.join() === '5,6' && r.s === 540 && r.e === 600 && r.n === 'Yoga', r);

    const K = (n) => page.evaluate((n) => window.cadence.kind(n), n);
    ok('"work out" is training, not work', (await K('Work out')) === 'train' && (await K('Deep work')) === 'work');
    ok('"walk the dog" is a walk', (await K('Walk the dog')) === 'walk');

    /* Through the sheet: the sentence fills the form, Add files the shape. */
    await page.click('#cdAdd');
    await sheetUp(page);
    await page.fill('.cd-say', 'journal daily 21:00 for 20 mins');
    ok('the preview says what it read', /Journal · every day · 21:00–21:20/.test(await page.textContent('#cdPrev')));
    ok('and the form below follows it', (await page.inputValue('#cdFN')) === 'Journal' && (await page.inputValue('#cdFS')) === '21:00');
    await page.click('#cdFSave');
    await page.waitForTimeout(320);
    const wk = await store(page, 'cad.week.v1');
    const j = wk.find((b) => b.n === 'Journal');
    ok('the new block is written in full', j && j.d.length === 7 && j.s === 1260 && j.e === 1280 && typeof j.id === 'string' && j.p === '', j);
    ok('and drawn on the day', (await page.$$eval('.cd-rn', (ns) => ns.map((n) => n.textContent))).includes('Journal'));

    /* Delete has a way back. */
    await page.click(`.cd-it[data-id="${j.id}"] .cd-rb`);
    await sheetUp(page);
    await page.click('#cdFDel');
    await page.waitForTimeout(320);
    ok('delete takes it off', !(await store(page, 'cad.week.v1')).some((b) => b.n === 'Journal'));
    await page.click('#cdToastU');
    ok('and undo puts it back', (await store(page, 'cad.week.v1')).some((b) => b.n === 'Journal'));

    /* Off this day takes the block you are in out of the middle: the next
       one takes its place, and it is struck in the list below. */
    await page.click('#cdHeroN');
    await sheetUp(page);
    await page.click('#cdTOff');
    ok('off this day is filed for the date', (await store(page, 'cad.off.v1'))['2026-09-25'].s3 === 1);
    await closeSheet(page);
    ok('a block off for the day leaves the middle, and the next one takes it', (await heroOf(page))[1] === 'Lunch', await heroOf(page));
    ok('and it is struck in the list', await page.$eval('.cd-it[data-id="s3"]', (e) => e.classList.contains('is-off')));
    ok('and says Off where its time was', (await page.textContent('.cd-it[data-id="s3"] .cd-rt')) === 'Off');
    ok('no page errors in the sentence', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the week, habits, month, training ──');
  {
    /* The record begins on Monday the 21st. Tuesday is absent from it —
       a day in the record with nothing kept, which is the one day that
       draws hollow. */
    const seed = `(() => { if (!localStorage.getItem('cad.train.v1')) {
      localStorage.setItem('cad.log.v1', JSON.stringify({
        '2026-09-21': { s0: 1, s1: 1, s3: 1 },
        '2026-09-23': { s0: 1, s1: 1, s3: 1, s4: 1, s5: 1, s8: 1, s9: 1 },
        '2026-09-24': { s0: 1, s2: 1 }, '2026-09-25': { s1: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({
        '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } },
        '2026-09-25': { s1: { k: ['weights.legs'], e: 'Hard', m: 60 } } }));
    } })();`;
    const { c, page, errs, off } = await ctx({ init: seed });

    const wk = await page.$$eval('.cd-wd', (ws) => Object.fromEntries(ws.map((w) => [w.dataset.d.slice(8), w.dataset.state])));
    ok('a dot a day: filled for a whole day, a quieter fill for part of one, hollow for a day you kept nothing, faint for one to come',
      wk['21'] === 'part' && wk['22'] === 'none' && wk['23'] === 'whole' && wk['24'] === 'part' && wk['25'] === 'part' && wk['26'] === 'future', wk);
    const wd = await dotRatios(page, '.cd-wd i', 12);
    const W = Object.fromEntries(wd.map((d) => [d.st, d]));
    ok('every claim a week dot makes holds 3:1 against the sky', ['whole', 'part', 'none'].every((s) => W[s] && W[s].r >= 3), W);
    ok('and a day to come is fainter than any of them', W.future.r < W.none.r && W.future.r < W.part.r, { future: W.future.r, none: W.none.r });

    await page.click('.cd-tab[data-v="hab"]');
    const train = await page.$eval('.cd-hr[data-h="train"]', (e) => ({ t: e.textContent, on: e.classList.contains('is-on') }));
    ok('Train is kept by the session filed today', /Kept by a session/.test(train.t) && train.on, train);
    const hues = await page.$$eval('.cd-hr .cd-hr-b i', (ns) => ns.map((n) => getComputedStyle(n).boxShadow.match(/rgba?\([^)]+\)/)[0]));
    ok('six habits, six colours: colour says which', hues.length === 6 && new Set(hues).size === 6, hues);
    const fns = await page.$$eval('.cd-hr .cd-fn', (fs) => fs.map((f) => f.children.length));
    ok('every habit carries a fortnight of dots', fns.length === 6 && fns.every((n) => n === 14), fns);
    await page.click('.cd-hr[data-h="mind"] .cd-hr-b');
    ok('Mind ticks on a press of its dot', (await store(page, 'cad.hab.v1'))['2026-09-25'].mind === 1);
    await page.click('.cd-hr[data-h="steps"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="10,000"');
    ok('a mark sets the dial', (await page.textContent('#cdNumV')).startsWith('10,000'));
    await page.click('#cdNumGo');
    await page.waitForTimeout(320);
    ok('the figure is saved', (await store(page, 'cad.hab.v1'))['2026-09-25'].steps === 10000);
    ok('and drawn on its row, with its unit', (await page.textContent('.cd-hr[data-h="steps"] .cd-hr-v')) === '10,000steps');
    const last = await page.$eval('.cd-hr[data-h="steps"] .cd-fn i:last-child', (i) => ({ on: i.classList.contains('is-on'), bg: getComputedStyle(i).backgroundColor }));
    ok('and today, the last of its fortnight, is lit in the habit\'s colour', last.on && last.bg === 'rgb(125, 207, 216)', last);
    await page.click('.cd-hr[data-h="water"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="+0.5"');
    await page.click('#cdShB .cd-chip >> text="+0.25"');
    ok('the bumps add, without float drift', (await page.textContent('#cdNumV')).startsWith('0.75'));
    await closeSheet(page);
    ok('the figure at the top counts today', (await page.textContent('#cdHabT')) === '3 of 6'
      && (await page.getAttribute('#cdHabDots', 'aria-label')) === '3 of 6 habits kept today');
    const head = await page.$$eval('#cdHabDots i', (is) => is.map((i) => i.classList.contains('is-on') ? getComputedStyle(i).backgroundColor : ''));
    ok('and under it is a dot a habit, each lit in its own colour as it is kept',
      head.length === 6 && head.filter(Boolean).length === 3 && head[0] === 'rgb(242, 161, 132)' && head[1] === 'rgb(183, 165, 255)' && head[2] === 'rgb(125, 207, 216)', head);
    await page.click('.cd-hr[data-h="steps"] .cd-hr-n');
    ok('the name opens the habit\'s record', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Steps');
    await closeSheet(page);

    await page.click('#cdHabAdd');
    await sheetUp(page);
    await page.fill('#cdHN', 'Cold plunge');
    await page.click('#cdHGo');
    await page.waitForTimeout(320);
    ok('a habit of yours is added at the foot', (await page.$$eval('.cd-hr', (h) => h.map((x) => x.dataset.h))).length === 7);
    ok('and the figure at the top takes a seventh', (await page.$$eval('#cdHabDots i', (is) => is.length)) === 7 && (await page.textContent('#cdHabT')) === '3 of 7');

    await page.click('.cd-tab[data-v="mon"]');
    ok('the month is September, and the line above it is the year', (await page.textContent('#cdMonT')) === 'September'
      && (await page.textContent('#cdMonK')) === '2026');
    ok('it counts the days kept and the days trained', (await page.textContent('#cdMonCap')) === '4 days kept · 2 trained');
    ok('it draws thirty days', (await page.$$eval('.cd-mc[data-day]', (cs) => cs.length)) === 30);
    ok('the grid is a whole rectangle', (await page.$$eval('.cd-mgrid > *', (cs) => cs.length)) % 7 === 0);
    ok('a month still to come cannot be opened', await page.$eval('#cdMonN', (b) => b.disabled));
    ok('today is marked', await page.$eval('.cd-mc[data-day="2026-09-25"]', (e) => e.classList.contains('is-today')));
    const M = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => [c.dataset.day.slice(8), {
      st: c.dataset.state, k: !!c.querySelector('.cd-mk'), s: c.querySelector('.cd-ms') && getComputedStyle(c.querySelector('.cd-ms')).backgroundColor }])));
    ok('a day before the record draws no dot at all: it is not a day you missed', !M['10'].k && M['10'].st === 'quiet', M['10']);
    ok('a day in the record draws the week\'s own dot', M['21'].st === 'part' && M['22'].st === 'none' && M['23'].st === 'whole' && M['22'].k, { 21: M['21'], 22: M['22'], 23: M['23'] });
    ok('a day you ran carries a second dot, in the run colour', M['24'].s === 'rgb(125, 207, 216)' && M['25'].s === 'rgb(242, 161, 132)' && !M['23'].s, { 24: M['24'], 25: M['25'] });
    ok('a day still to come draws no dot yet', !M['27'].k && M['27'].st === 'future', M['27']);
    const mc = await inkFloor(page, '.cd-mc[data-day] b');
    ok('every date holds 4.5:1 on what is behind it', mc.n === 30 && mc.worst.r >= 4.5, mc);
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    const ds = await page.textContent('#cdShB');
    ok('a pressed day reads itself back', /Thursday 24 September/.test(await page.textContent('#cdShT')) && /Easy/.test(ds) && /2 of/.test(ds), ds.slice(0, 120));
    await closeSheet(page);

    await page.click('.cd-tab[data-v="lift"]');
    ok('the figure is the sessions in thirty days', (await page.textContent('#cdLiftT')) === '2' && (await page.textContent('#cdLiftS')) === 'sessions');
    const lr = await page.$$eval('#cdLiftStrip i', (is) => is.map((i) => i.classList.contains('is-lit') ? getComputedStyle(i).backgroundColor : ''));
    ok('under it, thirty dots, a day each, lit in the colour of what was trained on it',
      lr.length === 30 && lr.filter(Boolean).length === 2 && lr[28] === 'rgb(125, 207, 216)' && lr[29] === 'rgb(242, 161, 132)', lr.slice(26));
    ok('and the dots say it to a screen reader', (await page.getAttribute('#cdLiftStrip', 'aria-label')) === '2 sessions in the last thirty days');
    const figs = await page.$$eval('.cd-figs b', (bs) => bs.map((b) => b.textContent));
    ok('the figures are days trained, the average length and this week', figs.join('|') === '2|53m|2', figs);
    ok('the line under the dots names the last session', (await page.textContent('#cdLiftK')) === 'Last · Legs · Fri 25');
    const cols = await page.$$eval('.cd-weeks > span', (ss) => ss.map((s) => ({ n: +s.dataset.n, dots: s.children.length, cls: s.className })));
    ok('twelve weeks, a dot a session, the week in progress last',
      cols.length === 12 && cols[11].n === 2 && cols[11].dots === 2 && /is-this/.test(cols[11].cls), cols.slice(9));
    ok('and a week with none is one hollow dot, not an empty space', /is-zero/.test(cols[0].cls) && cols[0].dots === 1, cols[0]);
    const kinds = await page.$$eval('.cd-kinds b', (bs) => bs.map((b) => b.textContent));
    ok('what you trained, by name', kinds.includes('Legs') && kinds.includes('Easy'), kinds);

    ok('habits, month and training make no request off this origin', off.length === 0, off);
    ok('no page errors across the views', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── layout, on every view ──');
  {
    /* A long day, so the day's pane has somewhere to scroll to. */
    const long = JSON.stringify(['Wake up', 'Gym', 'Deep work', 'Lunch', 'Emails and calls', 'Walk', 'Study', 'Meal prep', 'Read', 'Journal', 'Stretch', 'Wind down']
      .map((n, i) => ({ id: 'L' + i, n, d: [0, 1, 2, 3, 4, 5, 6], s: 360 + i * 75, e: 360 + i * 75 + 45 })));
    const { c, page, errs } = await ctx({ init: `localStorage.setItem('cad.week.v1', '${long}');
      localStorage.setItem('cad.hab.v1', JSON.stringify({ '2026-09-24': { steps: 8000, mind: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({ '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } } }));` });
    const WORDS = {
      day: '.cd-tab, .cd-wl, #cdHeroK, #cdHeroN, #cdHeroS, .cd-tcap, #cdThenN, .cd-rn, .cd-rt',
      hab: '#cdVHab .cd-hcap, #cdHabT, #cdHabCap, .cd-hr-t, .cd-hr-v, .cd-hr-s > span:last-child, #cdHabAdd',
      mon: '#cdMonK, #cdMonT, #cdMonCap, .cd-dows span, .cd-legend span, .cd-mc b',
      lift: '#cdVLift .cd-hcap, #cdLiftT, #cdLiftS, #cdLiftK, .cd-figs b, .cd-figs span, .cd-lbl, .cd-wax span, .cd-kinds b, .cd-kinds span, .cd-recent b, .cd-recent span, .cd-recent time'
    };
    for (const v of ['day', 'hab', 'mon', 'lift']) {
      await page.click(`.cd-tab[data-v="${v}"]`);
      await page.waitForTimeout(80);
      const drawn = await page.$$eval('main > section', (ss) => ss.filter((s) => s.getBoundingClientRect().height > 0).length);
      ok(`${v}: exactly one view is drawn`, drawn === 1, drawn);
      ok(`${v}: the tab says which`, (await page.getAttribute(`.cd-tab[data-v="${v}"]`, 'aria-current')) === 'page');
      const small = await page.$$eval('button', (bs) => bs.filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(b).visibility !== 'hidden' && (r.width < 43.5 || r.height < 43.5);
      }).map((b) => (b.className || b.id) + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height)));
      ok(`${v}: every press target is 44px`, small.length === 0, small);
      const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth
        || [...document.querySelectorAll('*')].some((e) => e.scrollWidth > e.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(e).overflowX)));
      ok(`${v}: nothing scrolls sideways`, !wide);
      const ink = await inkFloor(page, WORDS[v]);
      ok(`${v}: every word holds 4.5:1 on what is behind it`, ink.n > 4 && ink.worst.r >= 4.5, ink);
      /* The four words are the top of the screen, and nothing scrolls up
         under them. */
      const pt = await page.$eval(`section:not([hidden]) .cd-pane`, (p) => p.getBoundingClientRect().top);
      const nb = await page.$eval('.cd-nav', (b) => b.getBoundingClientRect().bottom);
      ok(`${v}: the pane starts below the four words`, pt >= nb - .5, { pt, nb });
    }

    await page.click('.cd-tab[data-v="day"]');
    await page.waitForTimeout(80);
    /* The check floats over the foot of the day, so the pane clears it: at
       the end of its travel the last row stops above it. */
    await page.$eval('#cdDayPane', (p) => { p.scrollTop = p.scrollHeight; });
    await page.waitForTimeout(60);
    const clear = await page.evaluate(() => ({ row: document.querySelector('.cd-it:last-child').getBoundingClientRect().bottom,
      go: document.getElementById('cdGo').getBoundingClientRect().top, moved: document.getElementById('cdDayPane').scrollTop }));
    ok('the check never sits on a row, even at the end of a long day', clear.moved > 0 && clear.row <= clear.go, clear);
    await page.$eval('#cdDayPane', (p) => { p.scrollTop = 0; });
    const px = await shoot(page);
    const lay = await page.evaluate(() => {
      const r = (e) => e.getBoundingClientRect(), plus = document.getElementById('cdAdd'), gear = document.getElementById('cdGear');
      const white = [...document.querySelectorAll('button')].filter((b) => b.getClientRects().length && getComputedStyle(b).backgroundColor === 'rgb(243, 245, 247)').map((b) => b.id || b.className);
      return { nav: r(document.querySelector('.cd-nav')), plus: { t: r(plus).top, r: r(plus).right, bg: getComputedStyle(plus).backgroundColor, c: getComputedStyle(plus).color },
        gear: { l: r(gear).left, t: r(gear).top }, week: r(document.getElementById('cdRibbon')).top, hero: r(document.getElementById('cdHeroN')).top, white };
    });
    const top = px(195, 4), foot = px(195, 836);
    ok('the ground is the sky: near-black at the top, a slate night at the foot',
      Math.max(...top) < 16 && lum(foot) > lum(top) * 3 && foot[2] > foot[0], { top, foot });
    ok('the four words are the top of the screen, between settings and add',
      lay.nav.top < 60 && lay.gear.l < 30 && lay.plus.r > 360 && lay.plus.t < 60 && lay.gear.t < 60, lay);
    ok('add is a glyph in the ink, not a second white round', lay.plus.bg === 'rgba(0, 0, 0, 0)' && lay.plus.c === 'rgb(243, 245, 247)', lay.plus);
    ok('and the one white control on the day is the check', lay.white.join() === 'cdGo', lay.white);
    ok('the week sits between the words and the block you are in', lay.nav.bottom < lay.week && lay.week < lay.hero, lay);
    ok('there is one face, and it is dark, and no hour changes it',
      (await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)) === 'dark'
      && !(await page.getAttribute('html', 'data-mode')) && !(await page.getAttribute('html', 'data-tide')));
    ok('no page errors', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the record ──');
  {
    /* A damaged record is repaired, not discarded — and written back. */
    const init = `(() => { if (!sessionStorage.getItem('planted')) { sessionStorage.setItem('planted', 1);
      localStorage.setItem('cad.week.v1', JSON.stringify([{ id: 'x1', n: 'Kept', d: [4], s: 600, e: 660 }, 7, null, { n: 'No days', d: [] }, { id: 'x2', n: 'Also kept', d: [4, 9], s: 700, e: 690 }]));
      localStorage.setItem('cad.log.v1', JSON.stringify({ '2026-09-25': { x1: 1 }, 'garbage': 5 }));
      localStorage.setItem('cad.mode.v1', 'light');
    } })();`;
    const { c, page, errs } = await ctx({ init });
    const wk = await store(page, 'cad.week.v1');
    ok('a damaged week keeps the good blocks', wk.length === 2 && wk[0].n === 'Kept' && wk[1].n === 'Also kept', wk);
    ok('and repairs the bad fields', wk[1].d.join() === '4' && wk[1].e === 700, wk[1]);
    ok('a damaged log keeps its days', JSON.stringify(await store(page, 'cad.log.v1')) === '{"2026-09-25":{"x1":1}}');
    ok('the key that chose between two faces is swept, not left', (await page.evaluate(() => localStorage.getItem('cad.mode.v1'))) === null);

    /* A backup carries every record, and restoring puts it back. */
    await page.click('#cdGear');
    await sheetUp(page);
    ok('settings no longer offers a face to choose', !(await page.$('#cdShB [data-m]')));
    await page.evaluate(() => { navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); }; });
    await page.click('#cdBak');
    const bak = JSON.parse(await page.evaluate(() => window.__copied));
    ok('a backup carries every record', bak.app === 'cadence' && ['week', 'log', 'off', 'hab', 'train', 'defs'].every((k) => k in bak), Object.keys(bak));
    bak.week.push({ id: 'x3', n: 'Restored', d: [4], s: 800, e: 830 });
    await page.fill('#cdRestore', JSON.stringify(bak));
    await Promise.all([page.waitForNavigation(), page.click('#cdRestoreGo')]);
    await page.waitForTimeout(150);
    ok('restoring writes it back', (await page.$$eval('.cd-rn', (ns) => ns.map((n) => n.textContent))).includes('Restored'));
    ok('no page errors in the record', errs.length === 0, errs);
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
