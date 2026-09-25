/* ═══════════════════════════════════════════════════════════════
   CADENCE — the day as a dial, the habits, the month and the training
   log, every one of them drawn as rings.

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

  /* Where every mark on the dial points, read off the DRAWING rather than
     off the numbers that made it: each path's own end points, turned back
     into minutes about the dial's centre. A round cap reaches half the
     stroke past a path's end, so what is drawn is that far outside it. */
  const readDial = (page) => page.evaluate(() => {
    const C = 150, R = 108, CAPM = 6 / R / (2 * Math.PI) * 1440;
    const toMin = (x, y) => { let a = Math.atan2(x - C, C - y); if (a < 0) a += 2 * Math.PI; return a / (2 * Math.PI) * 1440; };
    const svg = document.getElementById('cdDialSvg'), box = svg.getBoundingClientRect();
    const arcs = [...svg.querySelectorAll('.cd-a')].map((p) => {
      const L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L), m = p.getPointAtLength(L / 2);
      return { id: p.dataset.id, cls: p.getAttribute('class').replace('cd-a ', ''), s: toMin(a.x, a.y) - CAPM, e: toMin(b.x, b.y) + CAPM,
        mid: toMin(m.x, m.y), mx: box.left + m.x, my: box.top + m.y, r: [Math.hypot(a.x - C, a.y - C), Math.hypot(b.x - C, b.y - C)],
        stroke: getComputedStyle(p).stroke, filter: getComputedStyle(p).filter };
    });
    const dots = [...svg.querySelectorAll('.cd-m')].map((d) => ({ id: d.dataset.id, cls: d.getAttribute('class').replace('cd-m ', ''),
      m: toMin(+d.getAttribute('cx'), +d.getAttribute('cy')), r: Math.hypot(d.getAttribute('cx') - C, d.getAttribute('cy') - C),
      fill: getComputedStyle(d).fill, filter: getComputedStyle(d).filter }));
    const h = svg.querySelector('.cd-hand circle');
    const labels = Object.fromEntries([...svg.querySelectorAll('.cd-dl')].map((t) => [t.textContent, { x: +t.getAttribute('x') - C, y: +t.getAttribute('y') - C }]));
    return { arcs, dots, hand: h && toMin(+h.getAttribute('cx'), +h.getAttribute('cy')), labels, box: { l: box.left, t: box.top } };
  });
  const midOf = (page) => page.evaluate(() => ['cdMidK', 'cdMidT', 'cdMidN', 'cdMidS'].map((id) => document.getElementById(id).textContent));

  console.log('\n── the day, as a dial ──');
  {
    const { c, page, errs, off } = await ctx();
    const names = await page.$$eval('.cd-it .cd-rn', (ns) => ns.map((n) => n.textContent));
    ok('Friday lists its seven blocks in time order',
      names.join('|') === 'Wake up|Gym|Deep work|Lunch|Emails and calls|Read|Wind down', names);
    ok('the top says which day it is', (await page.textContent('#cdDate')) === 'Friday 25 Sep');
    const mid = await midOf(page);
    ok('the middle of the dial is the clock, the block it is inside, and what is left of it',
      mid.join('|') === 'Today|10:20|Deep work|1h 40m left', mid);
    ok('and the block is named in its own colour', (await page.$eval('#cdMidN', (e) => getComputedStyle(e).color)) === 'rgb(232, 198, 124)');
    const sum = await page.evaluate(() => ['cdSumK', 'cdSumP'].map((id) => document.getElementById(id).textContent));
    ok('the line under it counts what is kept and what is planned', sum.join('|') === '0 of 7 kept|6h 15m planned', sum);
    ok('the dial is one picture with a written label, never hidden from a screen reader',
      (await page.getAttribute('#cdDial', 'role')) === 'img'
      && (await page.getAttribute('#cdDial', 'aria-label')) === 'Friday 25 September, 0 of 7 kept. Now: Deep work, 1h 40m left');

    /* THE GEOMETRY. Midnight at the top and the day running clockwise, and
       every block an arc that starts and stops on its own minutes — with the
       two minutes a side that leave a hairline between two blocks that meet. */
    const g = await readDial(page);
    const L = g.labels;
    ok('the hours run clockwise from midnight at the top',
      L['00'].y < -100 && Math.abs(L['00'].x) < 1 && L['06'].x > 100 && L['12'].y > 100 && L['18'].x < -100, L);
    const A = Object.fromEntries(g.arcs.filter((a) => a.cls.indexOf('is-lit') < 0).map((a) => [a.id, a]));
    const want = { s1: [450, 510], s3: [540, 720], s4: [750, 795], s5: [840, 900] };
    ok('every block is an arc that starts and stops on its own minutes',
      Object.keys(want).every((id) => A[id] && Math.abs(A[id].s - (want[id][0] + 2)) < 1 && Math.abs(A[id].e - (want[id][1] - 2)) < 1),
      Object.keys(want).map((id) => [id, A[id] && +A[id].s.toFixed(1), A[id] && +A[id].e.toFixed(1)]));
    ok('a block too short for its own caps is a dot on its middle, never an arc drawn backwards',
      A.s8 && /is-short/.test(A.s8.cls) && Math.abs(A.s8.mid - 1305) < 1, A.s8);
    const D = Object.fromEntries(g.dots.map((d) => [d.id, d]));
    ok('a moment is a dot at its minute', D.s0 && D.s9 && Math.abs(D.s0.m - 420) < .5 && Math.abs(D.s9.m - 1350) < .5, D);
    ok('every mark sits on the one ring', g.arcs.every((a) => a.r.every((r) => Math.abs(r - 108) < .5)) && g.dots.every((d) => Math.abs(d.r - 108) < .5));
    ok('the hand points at now', Math.abs(g.hand - 620) < .5, g.hand);
    const lit = g.arcs.find((a) => a.cls.indexOf('is-lit') >= 0);
    ok('the block running now is lit as far as the clock and dim for the rest',
      lit && lit.id === 's3' && Math.abs(lit.s - 542) < 1 && Math.abs(lit.e - 620) < 1 && A.s3.cls === 'is-ahead', { lit, s3: A.s3 && A.s3.cls });
    ok('a block behind you and not kept is the neutral, and one still to come is dim',
      A.s1.cls === 'is-miss' && D.s0.cls === 'is-miss' && A.s4.cls === 'is-ahead' && A.s5.cls === 'is-ahead' && D.s9.cls === 'is-ahead',
      [A.s1.cls, D.s0.cls, A.s4.cls, D.s9.cls]);
    ok('colour says which part of life: the lit arc is work\'s gold', !!lit && rgbaOf(lit.stroke).slice(0, 3).join() === '232,198,124', lit && lit.stroke);
    const missed = rgbaOf(A.s1.stroke);
    ok('and a missed block is a grey with no channel standing out — never a red',
      Math.max(...missed.slice(0, 3)) - Math.min(...missed.slice(0, 3)) < 6, A.s1.stroke);

    /* Every state of an arc is a graphic, held to 3:1 on composited pixels
       against the sky just outside the ring at the same hour. */
    const arcRatios = async () => {
      const d = await readDial(page), px = await shoot(page);
      return d.arcs.filter((a) => a.cls.indexOf('is-short') < 0).map((a) => {
        const t = a.mid / 1440 * 2 * Math.PI;
        const gx = d.box.l + 150 + 119 * Math.sin(t), gy = d.box.t + 150 - 119 * Math.cos(t);
        return { id: a.id, st: a.cls, r: +ratio(px(a.mx, a.my), px(gx, gy)).toFixed(2) };
      });
    };
    const arcsAtLoad = await arcRatios();

    /* The dot ticks, the tick survives a reload, and the dial agrees. */
    const dotOf = () => page.$eval('.cd-it[data-id="s0"] .cd-dot', (b) => ({ p: b.getAttribute('aria-pressed'), bg: getComputedStyle(b.firstElementChild).backgroundColor, t: b.textContent.trim() }));
    const before = await dotOf();
    await page.click('.cd-it[data-id="s0"] .cd-dot');
    const after = await dotOf();
    ok('the dot is the check: pressing it keeps the block', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('and says so by filling, not with a word', before.t === '' && after.t === '' && before.p === 'false' && after.p === 'true' && before.bg !== after.bg, { before, after });
    ok('and it fills with the block\'s own colour', after.bg === 'rgb(125, 207, 216)', after.bg);
    const k0 = (await readDial(page)).dots.find((d) => d.id === 's0');
    ok('the dial agrees: the moment is filled and it glows', k0.cls === 'is-kept' && rgbaOf(k0.fill).slice(0, 3).join() === '125,207,216' && /cdGl/.test(k0.filter), k0);
    ok('the tick is filed under the date', (await store(page, 'cad.log.v1'))['2026-09-25'].s0 === 1);
    await page.reload(); await page.waitForTimeout(150);
    ok('and survives a reload', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('the summary counts it', (await page.textContent('#cdSumK')) === '1 of 7 kept');
    const todayRing = await page.$eval('.cd-wd[data-d="2026-09-25"]', (b) => ({ p: b.dataset.p, dash: b.querySelector('.cd-wr-a') && b.querySelector('.cd-wr-a').getAttribute('stroke-dasharray') }));
    ok('and today\'s ring in the week closes by a seventh', todayRing.p === '14.29' && todayRing.dash === '14.29 100', todayRing);

    /* Another day: the middle says how much of it was kept, and the ring has
       no hand, because the clock is not on it. */
    await page.click('.cd-wd[data-d="2026-09-24"]');
    ok('yesterday is named, and its middle is what it kept', (await midOf(page)).join('|') === 'Yesterday|0/7||kept · 24 September', await midOf(page));
    const y = await readDial(page);
    ok('a day behind you has no hand, and every block on it is behind you', y.hand == null && y.arcs.every((a) => a.cls.indexOf('is-miss') >= 0) && y.arcs.length > 3, y.arcs.map((a) => a.cls));
    ok('yesterday can still be ticked', await page.$$eval('.cd-dot', (bs) => bs.length > 0 && bs.every((b) => !b.disabled)));
    await page.click('.cd-wd[data-d="2026-09-26"]');
    ok('tomorrow says what is planned', (await midOf(page)).join('|') === 'Tomorrow|4||planned · 26 September', await midOf(page));
    ok('and the line under it counts blocks rather than kept', (await page.textContent('#cdSumK')) === '4 blocks');
    ok('a day ahead cannot be ticked', await page.$$eval('.cd-dot', (bs) => bs.length > 0 && bs.every((b) => b.disabled)));
    ok('and every arc on it is still to come', (await readDial(page)).arcs.every((a) => a.cls.indexOf('is-ahead') >= 0));
    await page.click('.cd-wd[data-d="2026-09-27"]');
    ok('any other day is its weekday', (await page.textContent('#cdMidK')) === 'Sunday');
    await page.click('.cd-wd[data-d="2026-09-25"]');

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
    ok('and the row wears it, in the session\'s colour', (await page.textContent('.cd-it[data-id="s1"] .cd-rs')) === 'Push + Core · 60m'
      && (await page.$eval('.cd-it[data-id="s1"] .cd-rw', (e) => getComputedStyle(e).color)) === 'rgb(242, 161, 132)');
    const kept = (await readDial(page)).arcs.find((a) => a.id === 's1');
    ok('and its arc is kept, and glows', kept.cls === 'is-kept' && /cdGl/.test(kept.filter), kept);

    const ar = arcsAtLoad.concat(await arcRatios());
    const states = new Set(ar.map((a) => a.st));
    ok('every arc holds 3:1 against the sky beside it, whatever state it is in',
      ['is-miss', 'is-ahead', 'is-lit', 'is-kept'].every((st) => states.has(st)) && ar.every((a) => a.r >= 3), ar);

    /* Unticking a training block takes its session with it. */
    await page.click('.cd-it[data-id="s1"] .cd-dot');
    ok('unticking takes the session off', !((await store(page, 'cad.train.v1'))['2026-09-25'] || {}).s1);

    ok('the day makes no request off this origin', off.length === 0, off);
    ok('no page errors on the day', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the middle, between blocks and at the ends ──');
  {
    const { c, page } = await ctx({ at: '2026-09-25T12:15:00' });
    const g = await readDial(page);
    const A = Object.fromEntries(g.arcs.map((a) => [a.id + (a.cls.indexOf('is-lit') >= 0 ? '+' : ''), a]));
    ok('between two blocks the middle says the next one and how soon', (await midOf(page)).join('|') === 'Today|12:15|Lunch|In 15m', await midOf(page));
    ok('and the hand sits in the space between their arcs', g.hand > A.s3.e && g.hand < A.s4.s, { hand: g.hand, deep: A.s3.e, lunch: A.s4.s });
    ok('and nothing is running', !g.arcs.some((a) => a.cls.indexOf('is-lit') >= 0) && !(await page.$('.cd-it.is-now')));
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T06:40:00' });
    ok('before the first block, the middle says it is next', (await midOf(page)).join('|') === 'Today|06:40|Wake up|In 20m', await midOf(page));
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T23:10:00' });
    const m = await midOf(page);
    ok('after the last, the middle says so and names nothing', m.join('|') === 'Today|23:10||Nothing left today'
      && (await page.$eval('#cdMidN', (e) => e.getBoundingClientRect().height)) === 0, m);
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

    /* Off this day strikes the row and leaves its hours empty on the ring. */
    await page.click('.cd-it[data-id="s3"] .cd-rb');
    await sheetUp(page);
    await page.click('#cdTOff');
    ok('off this day is filed for the date', (await store(page, 'cad.off.v1'))['2026-09-25'].s3 === 1);
    await closeSheet(page);
    ok('and the row is struck', await page.$eval('.cd-it[data-id="s3"]', (e) => e.classList.contains('is-off')));
    ok('and says Off where its hours were', (await page.textContent('.cd-it[data-id="s3"] .cd-rt')) === 'Off');
    ok('an off block leaves its hours empty on the dial', !(await page.$('#cdDialSvg [data-id="s3"]')) && !!(await page.$('#cdDialSvg [data-id="s4"]')));
    ok('an off block leaves the count', (await page.textContent('#cdSumK')) === '0 of 7 kept');
    ok('no page errors in the sentence', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── habits, month, training ──');
  {
    const seed = `(() => { if (!localStorage.getItem('cad.train.v1')) {
      localStorage.setItem('cad.log.v1', JSON.stringify({
        '2026-09-21': { s0: 1, s1: 1, s3: 1 },
        '2026-09-22': { s0: 1, s2: 1, s3: 1, s4: 1, s5: 1, s8: 1 },
        '2026-09-23': { s0: 1, s1: 1, s3: 1, s4: 1, s5: 1, s8: 1, s9: 1 },
        '2026-09-24': { s0: 1, s2: 1 }, '2026-09-25': { s1: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({
        '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } },
        '2026-09-25': { s1: { k: ['weights.legs'], e: 'Hard', m: 60 } } }));
    } })();`;
    const { c, page, errs, off } = await ctx({ init: seed });

    /* Every date in the week is a small ring closed by the share of its day
       that was kept: three of seven on the 21st, six on the 22nd, all of the
       23rd — which is the one drawn whole and lit — and nothing on a day
       still to come. The drawn arc is read back, not the number it came from. */
    const wk = await page.$$eval('.cd-wd', (ws) => Object.fromEntries(ws.map((w) => {
      const a = w.querySelector('.cd-wr-a');
      return [w.dataset.d.slice(8), { p: w.dataset.p, dash: a && a.getAttribute('stroke-dasharray'), whole: !!(a && a.classList.contains('is-whole')), f: a && getComputedStyle(a).filter }];
    })));
    ok('the week is seven rings, each closed by the share of its day that was kept',
      wk['21'].dash === '42.86 100' && wk['22'].dash === '85.71 100' && wk['24'].dash === '28.57 100' && !wk['26'].dash && wk['26'].p === '0', wk);
    ok('and only a whole day is a whole ring, and lit', wk['23'].whole && !wk['23'].dash && /drop-shadow/.test(wk['23'].f) && !wk['22'].whole, wk['23']);

    await page.click('.cd-tab[data-v="hab"]');
    const train = await page.$eval('.cd-hr[data-h="train"]', (e) => ({ t: e.textContent, on: e.classList.contains('is-on') }));
    ok('Train is kept by the session filed today', /Kept by a session/.test(train.t) && train.on, train);
    const hues = await page.$$eval('.cd-hr .cd-hr-n b', (ns) => ns.map((n) => getComputedStyle(n, '::before').backgroundColor));
    ok('six habits, six colours: colour says which', hues.length === 6 && new Set(hues).size === 6, hues);
    const rings = await page.$$eval('.cd-hr-b', (bs) => bs.map((b) => b.querySelectorAll('.cd-sg').length));
    ok('every habit is a fortnight round its own ring', rings.length === 6 && rings.every((n) => n === 14), rings);
    await page.click('.cd-hr[data-h="mind"] .cd-hr-b');
    ok('Mind ticks on a press', (await store(page, 'cad.hab.v1'))['2026-09-25'].mind === 1);
    await page.click('.cd-hr[data-h="steps"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="10,000"');
    ok('a mark sets the dial', (await page.textContent('#cdNumV')).startsWith('10,000'));
    await page.click('#cdNumGo');
    await page.waitForTimeout(320);
    ok('the figure is saved', (await store(page, 'cad.hab.v1'))['2026-09-25'].steps === 10000);
    ok('and drawn in the middle of its ring', /10,000/.test(await page.textContent('.cd-hr[data-h="steps"] .cd-hr-v')));
    const seg = await page.$eval('.cd-hr[data-h="steps"] .cd-sg:last-of-type', (p) => ({ lit: p.classList.contains('is-lit'), s: getComputedStyle(p).stroke }));
    ok('and today, the last part of its fortnight, is lit in the habit\'s colour', seg.lit && seg.s === 'rgb(125, 207, 216)', seg);
    await page.click('.cd-hr[data-h="water"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="+0.5"');
    await page.click('#cdShB .cd-chip >> text="+0.25"');
    ok('the bumps add, without float drift', (await page.textContent('#cdNumV')).startsWith('0.75'));
    await closeSheet(page);
    ok('the ring at the top counts today', (await page.textContent('#cdHabT')) === '3/6'
      && (await page.getAttribute('#cdHabRing', 'aria-label')) === '3 of 6 habits kept today');
    const head = await page.$$eval('#cdHabSvg .cd-sg', (ps) => ps.map((p) => p.classList.contains('is-lit') ? getComputedStyle(p).stroke : ''));
    ok('and is cut into a part a habit, each lit in its own colour as it is kept',
      head.length === 6 && head.filter(Boolean).length === 3 && head[0] === 'rgb(242, 161, 132)' && head[1] === 'rgb(183, 165, 255)' && head[2] === 'rgb(125, 207, 216)', head);

    /* A habit of your own joins the list. */
    await page.click('#cdHabAdd');
    await sheetUp(page);
    await page.fill('#cdHN', 'Cold plunge');
    await page.click('#cdHGo');
    await page.waitForTimeout(320);
    ok('a habit of yours is added at the foot', (await page.$$eval('.cd-hr', (h) => h.map((x) => x.dataset.h))).length === 7);
    ok('and the ring at the top takes a seventh part', (await page.$$eval('#cdHabSvg .cd-sg', (ps) => ps.length)) === 7);

    await page.click('.cd-tab[data-v="mon"]');
    ok('the month is September, and the line above it is the year', (await page.textContent('#cdMonT')) === 'September'
      && (await page.textContent('#cdMonK')) === '2026');
    const cells = await page.$$eval('.cd-mc[data-day]', (cs) => cs.length);
    ok('it draws thirty days', cells === 30, cells);
    ok('the grid is a whole rectangle', (await page.$$eval('.cd-mgrid > *', (cs) => cs.length)) % 7 === 0);
    ok('a month still to come cannot be opened', await page.$eval('#cdMonN', (b) => b.disabled));
    ok('today is marked', await page.$eval('.cd-mc[data-day="2026-09-25"]', (e) => e.classList.contains('is-today')));
    const bead = await page.$eval('.cd-mc[data-day="2026-09-24"] .cd-bead', (e) => ({ kc: e.style.getPropertyValue('--kc'), f: getComputedStyle(e).fill }));
    ok('a day you ran wears a bead in the run colour at the top of its ring', bead.kc === 'var(--k-run)' && bead.f === 'rgb(125, 207, 216)', bead);
    const mr = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => {
      const a = c.querySelector('.cd-mr-a');
      return [c.dataset.day.slice(8), { cls: c.className.replace('cd-mc', '').trim(), ring: !!c.querySelector('svg'), dash: a && a.getAttribute('stroke-dasharray'), whole: !!(a && a.classList.contains('is-whole')) }];
    })));
    ok('a day before the record draws no ring at all: it is not a day you missed', mr['10'].cls === 'is-quiet' && !mr['10'].ring, mr['10']);
    ok('every day is a ring closed by how much of it was kept',
      mr['24'].dash === '28.57 100' && mr['21'].dash === '42.86 100' && mr['22'].dash === '85.71 100', { d21: mr['21'], d22: mr['22'], d24: mr['24'] });
    ok('and only a whole day is whole, and lit', mr['23'].whole && mr['23'].cls === 'is-whole' && !mr['22'].whole, mr['23']);
    ok('a day still to come is not a ring yet', mr['27'].cls === 'is-future' && !mr['27'].ring, mr['27']);
    /* Every date's figure is read on composited pixels, inside its ring. */
    const mc = await inkFloor(page, '.cd-mc[data-day] b');
    ok('every date holds 4.5:1 on what is behind it', mc.n === 30 && mc.worst.r >= 4.5, mc);
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    const ds = await page.textContent('#cdShB');
    ok('a pressed day reads itself back', /Thursday 24 September/.test(await page.textContent('#cdShT')) && /Easy/.test(ds) && /2 of/.test(ds), ds.slice(0, 120));
    await closeSheet(page);

    await page.click('.cd-tab[data-v="lift"]');
    ok('the ring counts the sessions in thirty days', (await page.textContent('#cdLiftT')) === '2'
      && (await page.getAttribute('#cdLiftRing', 'aria-label')) === '2 sessions in the last thirty days');
    const lr = await page.$$eval('#cdLiftSvg .cd-sg', (ps) => ps.map((p) => p.classList.contains('is-lit') ? getComputedStyle(p).stroke : ''));
    ok('thirty parts, a day each, lit in the colour of what was trained on it',
      lr.length === 30 && lr.filter(Boolean).length === 2 && lr[28] === 'rgb(125, 207, 216)' && lr[29] === 'rgb(242, 161, 132)', lr.slice(26));
    const figs = await page.$$eval('.cd-figs b', (bs) => bs.map((b) => b.textContent));
    ok('the figures are days trained, the average length and this week', figs.join('|') === '2|53m|2', figs);
    ok('the line under the ring names the last session', (await page.textContent('#cdLiftK')) === 'Last · Legs · Fri 25');
    ok('the week in progress is the last column', await page.$eval('.cd-weeks i:last-child', (i) => i.classList.contains('is-this')));
    const kinds = await page.$$eval('.cd-kinds b', (bs) => bs.map((b) => b.textContent));
    ok('what you trained, by name', kinds.includes('Legs') && kinds.includes('Easy'), kinds);

    ok('habits, month and training make no request off this origin', off.length === 0, off);
    ok('no page errors across the views', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── layout, on every view ──');
  {
    const { c, page, errs } = await ctx({ init: `localStorage.setItem('cad.hab.v1', JSON.stringify({ '2026-09-24': { steps: 8000, mind: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({ '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } } }));` });
    const WORDS = {
      day: '.cd-tab, #cdDate, .cd-wd-l, .cd-wd-r b, #cdMidK, #cdMidT, #cdMidN, #cdMidS, .cd-sum span, .cd-rn, .cd-rt, .cd-rs',
      hab: '#cdDate, #cdVHab .cd-mid-k, #cdHabT, #cdHabCap, .cd-hr-n b, .cd-hr-s, .cd-hr-v, #cdHabAdd',
      mon: '#cdMonK, #cdMonT, #cdMonCap, .cd-dows span, .cd-legend span, .cd-mc b',
      lift: '#cdLiftT, #cdLiftK, .cd-figs b, .cd-figs span, .cd-lbl, .cd-wax span, .cd-kinds b, .cd-kinds span, .cd-recent b, .cd-recent span, .cd-recent time'
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
      /* Every word on the screen, on the pixels it is actually drawn over:
         the light at the top, a tile, a disc. */
      const ink = await inkFloor(page, WORDS[v]);
      ok(`${v}: every word holds 4.5:1 on what is behind it`, ink.n > 4 && ink.worst.r >= 4.5, ink);
      /* A pane ends where the nav begins, so no row runs under the words. */
      const pb = await page.$eval(`section:not([hidden]) .cd-pane`, (p) => p.getBoundingClientRect().bottom);
      const nt = await page.$eval('.cd-nav', (b) => b.getBoundingClientRect().top);
      ok(`${v}: the pane stops above the nav`, pb <= nt + .5, { pb, nt });
    }

    await page.click('.cd-tab[data-v="day"]');
    await page.waitForTimeout(80);
    const px = await shoot(page);
    const lay = await page.evaluate(() => {
      const r = (e) => e.getBoundingClientRect(), plus = document.getElementById('cdAdd'), cs = getComputedStyle(plus);
      return { nav: r(document.querySelector('.cd-nav')).bottom, plus: { t: r(plus).top, r: r(plus).right, w: r(plus).width, bg: cs.backgroundColor, rad: cs.borderRadius },
        week: r(document.getElementById('cdRibbon')).top, dial: r(document.getElementById('cdDial')).top };
    });
    /* THE SKY is the ground on every screen and carries no colour of its
       own: near-black at the top, a slate night at the foot. */
    const top = px(195, 4), foot = px(195, 836);
    ok('the ground is the sky: near-black at the top, a slate night at the foot',
      Math.max(...top) < 16 && lum(foot) > lum(top) * 3 && foot[2] > foot[0], { top, foot });
    ok('the one white control is the add, round, at the top right',
      lay.plus.bg === 'rgb(243, 245, 247)' && lay.plus.rad === '50%' && lay.plus.t < 70 && lay.plus.r > 360 && lay.plus.w === 44, lay.plus);
    ok('the four words are the foot of the screen', lay.nav >= 844 - 12, lay);
    ok('the week sits above the dial', lay.week < lay.dial, lay);
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
