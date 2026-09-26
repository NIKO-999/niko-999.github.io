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
    const c = await browser.newContext(opts.vp ? { ...PHONE, viewport: opts.vp } : PHONE);
    await c.addInitScript(freeze(opts.at || '2026-09-25T10:20:00'));
    if (opts.init) await c.addInitScript(opts.init);
    const page = await c.newPage();
    const errs = [], off = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('request', (r) => { if (!r.url().startsWith(BASE) && !/^(data|blob):/.test(r.url())) off.push(r.url()); });
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

    /* The list is the whole day, the block in the middle and the next one
       included: it is where the day is read top to bottom. */
    ok('the list is the whole day in time order, the block you are in and the next included',
      (await listOf(page)).join() === 's0,s1,s3,s4,s5,s8,s9', await listOf(page));
    const times = await page.$$eval('.cd-it .cd-rt', (ts) => ts.map((t) => t.textContent));
    ok('every row carries its start', times.join() === '07:00,07:30,09:00,12:30,14:00,21:30,22:30', times);

    /* THE CHECK. One white round control, and it ticks the block in the middle. */
    const go = await page.$eval('#cdGo', (b) => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
      return { w: r.width, cx: r.left + r.width / 2, b: r.bottom, bg: cs.backgroundColor, rad: cs.borderRadius, l: b.getAttribute('aria-label'), p: b.getAttribute('aria-pressed') }; });
    ok('the one white control is a round check at the foot of the screen', go.w === 64 && Math.abs(go.cx - 195) < 1 && go.b > 780 && go.bg === 'rgb(243, 245, 247)' && go.rad === '50%', go);
    ok('and it is named for the block it ticks', go.l === 'Mark Deep work completed' && go.p === 'false', go);
    await page.click('#cdGo');
    /* It asks first, and the ask on its own keeps nothing. */
    ok('pressing it asks before it completes anything', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Complete Deep work?'
      && !(((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3);
    /* One rule under the head and none over the answers; the two answers
       the same box, and both drawn as a fill so neither reads smaller. */
    const ask = await page.evaluate(() => {
      const f = document.querySelector('#cdShB .cd-foot'), cs = f ? getComputedStyle(f) : null;
      const bs = [...document.querySelectorAll('#cdShB .cd-btn')].map((b) => { const r = b.getBoundingClientRect(), c = getComputedStyle(b); return { w: r.width, h: r.height, bg: c.backgroundColor, sh: c.boxShadow }; });
      return { rule: cs ? cs.boxShadow : 'missing', mt: cs ? cs.marginTop : 'missing', bs };
    });
    ok('the ask draws no second rule over its answers', ask.rule === 'none' && ask.mt === '0px', ask);
    ok('and Not yet and Complete are the same box, both filled', ask.bs.length === 2 && ask.bs[0].w === ask.bs[1].w && ask.bs[0].h === ask.bs[1].h
      && ask.bs.every((b) => b.bg !== 'rgba(0, 0, 0, 0)' && b.sh === 'none'), ask.bs);
    await page.evaluate(() => document.getElementById('cdGoNo') && document.getElementById('cdGoNo').click());
    await page.waitForTimeout(350);
    ok('and Not yet leaves the block as it was', !(await page.$eval('#cdSheet', (e) => e.classList.contains('is-open'))) && !(((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3
      && (await page.textContent('#cdHeroN')) === 'Deep work');
    await page.click('#cdGo');
    ok('an ordinary block is answered with Complete', (await page.textContent('#cdGoYes')) === 'Complete');
    await page.evaluate(() => document.getElementById('cdGoYes') && document.getElementById('cdGoYes').click());
    await page.waitForTimeout(350);
    ok('confirming keeps the block you are in', (((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3 === 1);
    /* Finished early is finished: the middle moves on and the kept block
       goes back into the list, where its own dot unticks it. */
    ok('and the middle moves on to what is next', (await heroOf(page)).join('|') === 'Next · Rest · 10:20|Lunch|in 2h 10m · at 12:30|Emails and calls at 14:00', await heroOf(page));
    ok('with the kept block back in the list, ticked', (await listOf(page)).includes('s3')
      && await page.$eval('.cd-it[data-id="s3"]', (e) => e.classList.contains('is-done')));
    ok('today\'s dot in the week fills part way', (await page.getAttribute('.cd-wd[data-d="2026-09-25"]', 'data-state')) === 'part');
    const toast = await page.$eval('#cdToast', (t) => ({ txt: document.getElementById('cdToastT').textContent, undo: !document.getElementById('cdToastU').hidden }));
    ok('it says so, with a way back', toast.txt === 'Completed Deep work' && toast.undo, toast);
    await page.evaluate(() => document.getElementById('cdToastU').click());
    ok('Undo puts the block back in the middle, unticked', !(((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3
      && (await page.textContent('#cdHeroN')) === 'Deep work' && (await page.getAttribute('#cdGo', 'aria-pressed')) === 'false');

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
    ok('yesterday is named, and its middle is what it kept', (await heroOf(page)).join('|') === 'Yesterday · 24 Sep|0 of 7|completed · 6h planned|', await heroOf(page));
    ok('and with no clock there is no check, no line and no next', !(await shown(page, '#cdGo')) && !(await shown(page, '#cdBar')) && !(await shown(page, '#cdThen')));
    ok('every block of that day is in the list, and every one is behind you',
      (await page.$$eval('.cd-it', (ls) => ls.length === 7 && ls.every((l) => l.classList.contains('is-past')))));
    /* One kept and the rest missed, so the rule is seen both ways; the
       tick is taken back after, or the week dots below read a kept day. */
    await page.click('.cd-it .cd-dot');
    const strk = await page.$$eval('.cd-it', (ls) => ls.map((l) => ({ done: l.classList.contains('is-done'),
      s: getComputedStyle(l.querySelector('.cd-rn')).textDecorationLine,
      tk: !!l.querySelector('.cd-rn .cd-tk') })));
    /* A kept row carries a tick beside its name, and it is drawn: pixels
       in its box that stand 3:1 off the sky beside the name. Read off the
       screen, because a tick the colour of the sky draws nothing. */
    /* Read defensively: a build with no tick must fail this check by name,
       not take the file down on a missing element. */
    const tkb = (await page.$$eval('.cd-it.is-done .cd-tk', (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })))[0] || { x: 0, y: 0, w: 0, h: 0 };
    const tkp = PNG.sync.read(await page.screenshot());
    const tget = (x, y) => { const i = (y * tkp.width + x) * 4; return [tkp.data[i], tkp.data[i + 1], tkp.data[i + 2]]; };
    const tsky = tget(Math.round((tkb.x + tkb.w + 14) * DPR), Math.round((tkb.y + tkb.h / 2) * DPR));
    let tdark = 0;
    for (let y = Math.floor(tkb.y * DPR); y < Math.ceil((tkb.y + tkb.h) * DPR); y++)
      for (let x = Math.floor(tkb.x * DPR); x < Math.ceil((tkb.x + tkb.w) * DPR); x++) if (ratio(tget(x, y), tsky) >= 3) tdark++;
    ok('a kept row draws a small tick beside its name, and only a kept row does',
      strk.every((x) => x.tk === x.done) && tdark >= 6 * DPR, { strk, tdark, tsky, tkb });
    await page.click('.cd-it.is-done .cd-dot');
    /* A missed name is dark grey: under the 4.5 every other word holds, and
       still over the 3:1 a mark is held to. */
    const mg = await inkFloor(page, '.cd-it.is-past:not(.is-done) .cd-rn');
    ok('a missed name is the dark grey, fainter than every other, and still 3:1 on the sky',
      mg.n > 0 && mg.worst.r >= 3 && mg.worst.r < 4.5, mg);
    ok('a block behind you that was missed is struck through, and a kept one is not',
      strk.some((x) => !x.done) && strk.some((x) => x.done) && strk.every((x) => (x.s === 'line-through') === !x.done), strk);
    ok('yesterday can still be ticked', await page.$$eval('.cd-dot', (bs) => bs.length > 0 && bs.every((b) => !b.disabled)));
    await page.click('.cd-wd[data-d="2026-09-26"]');
    ok('a day still to come strikes nothing through', await page.$$eval('.cd-it .cd-rn', (ns) => ns.length > 0 && ns.every((n) => getComputedStyle(n).textDecorationLine === 'none')));
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
       the dot's colour. What it adds to each channel is its COVERAGE of the
       room that channel had left — a white at 40% takes every channel 40%
       of the way to white, whatever the sky under it is. Read as a raw
       difference, the saturated day blue has far less room left in its
       blue than its red, and a correct grey read as red. A hue covers its
       channels unevenly on any sky; a neutral never does. */
    const miss = dots.find((d) => d.st.indexOf('is-past') >= 0 && d.st.indexOf('is-done') < 0);
    const add = miss && miss.px.map((v, i) => (v - miss.g[i]) / Math.max(1, 243 - miss.g[i]));
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
    ok('the check ticks the next one', (await page.getAttribute('#cdGo', 'aria-label')) === 'Mark Lunch completed');
    ok('and the list still carries the two in the middle', (await listOf(page)).join() === 's0,s1,s3,s4,s5,s8,s9', await listOf(page));
    ok('today with nothing kept yet makes no claim in the week: it is not over',
      (await page.getAttribute('.cd-wd[data-d="2026-09-25"]', 'data-state')) === 'quiet');
    await c.close();
  }
  /* The day sheet's caption sits centred between the head's rule and the
     next one, on a day with rows and on an empty one, where the next rule
     is the foot's. Measured off the words' own box, never the paragraph's. */
  {
    const capMid = (page) => page.evaluate(() => {
      const cap = document.querySelector('#cdShB .cd-cap'); if (!cap) return null;
      const rg = document.createRange(); rg.selectNodeContents(cap); const t = rg.getBoundingClientRect();
      const above = document.querySelector('#cdSheet .cd-sh-hd').getBoundingClientRect().bottom;
      const nx = cap.nextElementSibling; if (!nx) return null;
      const below = nx.getBoundingClientRect().top;
      return { up: +(t.top - above).toFixed(1), down: +(below - t.bottom).toFixed(1), next: nx.className };
    });
    for (const empty of [false, true]) {
      const { c, page } = await ctx(empty ? { init: () => localStorage.setItem('cad.week.v1', '[]') } : {});
      await page.click('.cd-tab[data-v="mon"]');
      await page.click('.cd-mc[data-day="2026-09-25"]');
      await sheetUp(page);
      await page.waitForTimeout(300);
      const m = await capMid(page);
      ok('the day caption is centred between its rules' + (empty ? ', on an empty day' : ''), !!m && m.up > 4 && Math.abs(m.up - m.down) <= 1.5, m);
      await c.close();
    }
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
    /* The press ticks AND opens the session sheet, so the answer says both. */
    const gyes = await page.evaluate(() => { const e = document.getElementById('cdGoYes'); return e ? { t: e.textContent, h: e.getBoundingClientRect().height, lh: parseFloat(getComputedStyle(e).lineHeight) || 0 } : null; });
    ok('a training block is answered with Completed · log session, on one line', !!gyes && gyes.t === 'Completed · log session' && gyes.h <= 60, gyes);
    await page.evaluate(() => document.getElementById('cdGoYes') && document.getElementById('cdGoYes').click());
    await page.waitForTimeout(350);
    ok('and the check, confirmed, asks what you trained', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'What did you train?');
    ok('having kept it', (await store(page, 'cad.log.v1'))['2026-09-25'].s1 === 1);
    await c.close();
  }
  {
    const { c, page } = await ctx({ at: '2026-09-25T23:10:00' });
    ok('after the last, the middle is what today kept', (await heroOf(page)).join('|') === 'Today · 23:10|0 of 7|completed · nothing left today|', await heroOf(page));
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

    /* There is no day off: the editor offers Done and nothing else, and
       a row never draws the word Off where its time goes. */
    await page.click('#cdHeroN');
    await sheetUp(page);
    ok('the editor has no Off this day toggle', !(await page.$('#cdTOff')) && !(await page.textContent('#cdShB')).includes('Off this day'));
    await closeSheet(page);
    ok('and no row says Off', (await page.$$eval('.cd-it .cd-rt', (ts) => ts.every((t) => t.textContent !== 'Off'))) && !(await page.$('.cd-it.is-off')));
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
    ok('Train is kept by the session filed today, and just says so', /Complete/.test(train.t) && !/Completed by/.test(train.t) && train.on, train);
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
      && (await page.getAttribute('#cdHabDots', 'aria-label')) === '3 of 6 habits completed today');
    const head = await page.$$eval('#cdHabDots i', (is) => is.map((i) => i.classList.contains('is-on') ? getComputedStyle(i).backgroundColor : ''));
    ok('and under it is a dot a habit, each lit in its own colour as it is kept',
      head.length === 6 && head.filter(Boolean).length === 3 && head[0] === 'rgb(242, 161, 132)' && head[1] === 'rgb(183, 165, 255)' && head[2] === 'rgb(125, 207, 216)', head);
    /* A tap anywhere on the row logs; a hold opens the record. Both are
       asked of the same row, because each passes on the other's bug. */
    await page.click('.cd-hr[data-h="fuel"] .cd-hr-n');
    ok('a tap on the name logs, it does not open the record', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Fuel' && !!(await page.$('#cdNumV')));
    await closeSheet(page);
    const nb = await page.$eval('.cd-hr[data-h="steps"] .cd-hr-n', (b) => { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await page.mouse.move(nb.x, nb.y); await page.mouse.down(); await page.waitForTimeout(650); await page.mouse.up();
    await page.waitForTimeout(80);
    ok('a long press opens the habit\'s record', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Steps' && !(await page.$('#cdNumV')));
    await closeSheet(page);
    ok('and the hold did not log anything as well', (await store(page, 'cad.hab.v1'))['2026-09-25'].steps === 10000);
    await page.focus('.cd-hr[data-h="steps"] .cd-hr-h');
    await page.keyboard.press('Enter');
    ok('a keyboard reaches the record through its own button', (await sheetUp(page)) && (await page.textContent('#cdShT')) === 'Steps' && !(await page.$('#cdNumV')));
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
    ok('it counts the days completed', (await page.textContent('#cdMonCap')) === '4 days completed', await page.textContent('#cdMonCap'));
    ok('it draws thirty days', (await page.$$eval('.cd-mc[data-day]', (cs) => cs.length)) === 30);
    ok('the grid is a whole rectangle', (await page.$$eval('.cd-mgrid > *', (cs) => cs.length)) % 7 === 0);
    ok('a month still to come cannot be opened', await page.$eval('#cdMonN', (b) => b.disabled));
    ok('today is marked', await page.$eval('.cd-mc[data-day="2026-09-25"]', (e) => e.classList.contains('is-today')));
    const M = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => [c.dataset.day.slice(8), {
      st: c.dataset.state, k: !!c.querySelector('.cd-mk'), h: [...c.querySelectorAll('.cd-mh')].map((i) => getComputedStyle(i).backgroundColor) }])));
    ok('a day before the record draws no dot at all: it is not a day you missed', !M['10'].k && M['10'].st === 'quiet', M['10']);
    ok('a day in the record draws the week\'s own dot', M['21'].st === 'part' && M['22'].st === 'none' && M['23'].st === 'whole' && M['22'].k, { 21: M['21'], 22: M['22'], 23: M['23'] });
    const onToday = await page.evaluate(() => JSON.parse(localStorage.getItem('cad.hab.v1'))['2026-09-25']);
    ok('each habit hit that day is a dot in its own colour', M['25'].h.includes('rgb(242, 161, 132)') && M['25'].h.includes('rgb(125, 207, 216)') && new Set(M['25'].h).size === M['25'].h.length, { 25: M['25'], onToday });
    ok('and a day before the record draws none', M['10'].h.length === 0, M['10']);
    const legend = await page.$$eval('#cdMonL span', (ss) => ss.map((s) => s.textContent));
    ok('the legend names the habits, not the kinds of training', legend.join('|') === 'Note|Train|Mind|Steps|Fuel|Water|Sleep|Cold plunge', legend);
    ok('there is no Training tab', !(await page.$('.cd-tab[data-v="lift"]')) && (await page.$$('.cd-tab')).length === 4);
    ok('a day still to come draws no dot yet', !M['27'].k && M['27'].st === 'future', M['27']);
    const mc = await inkFloor(page, '.cd-mc[data-day] b');
    ok('every date holds 4.5:1 on what is behind it', mc.n === 30 && mc.worst.r >= 4.5, mc);
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    const ds = await page.textContent('#cdShB');
    ok('a pressed day reads itself back', /Thursday 24 September/.test(await page.textContent('#cdShT')) && /Easy/.test(ds) && /2 of/.test(ds), ds.slice(0, 120));
    await closeSheet(page);

    ok('habits, month and training make no request off this origin', off.length === 0, off);
    ok('no page errors across the views', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── notes, and what the calendar says ──');
  {
    /* A Push session on Wednesday and a Pull on Tuesday. And a goal list
       left on the phone by the build that had goals: nothing reads it and
       nothing deletes it, because it is sentences somebody wrote. */
    const planted = [{ id: 'gw', t: 'week', w: 'g:weights', v: 2 }, { id: 'gt', t: 'task', n: 'Book the race', d: '2026-10-11', done: '' }];
    const init = `(() => { if (!sessionStorage.getItem('planted')) { sessionStorage.setItem('planted', 1);
      localStorage.setItem('cad.hab.v1', JSON.stringify({ '2026-09-24': { steps: 20500 }, '2026-09-22': { steps: 9000 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({ '2026-09-23': { '~day': { k: ['weights.push'], e: 'Hard', m: 60 } }, '2026-09-22': { '~day': { k: ['weights.pull'], e: 'Moderate', m: 45 } } }));
      localStorage.setItem('cad.goal.v1', JSON.stringify(${JSON.stringify(planted)}));
    } })();`;
    const { c, page, errs, off } = await ctx({ init });

    /* Goals are gone: asserted as the ABSENCE of the section and its door,
       and of the word, because an emptied list still draws its heading. */
    await page.click('.cd-tab[data-v="hab"]');
    const hab = await page.evaluate(() => ({ list: !!document.getElementById('cdGoals'), add: !!document.getElementById('cdGoalAdd'),
      word: /goal/i.test(document.getElementById('cdVHab').textContent), rows: document.querySelectorAll('#cdHab .cd-hr').length }));
    ok('the habits screen has no goals: no section, no way to add one, not the word', !hab.list && !hab.add && !hab.word && hab.rows > 0, hab);
    ok('a goal list already on the phone is left exactly as it was', JSON.stringify(await store(page, 'cad.goal.v1')) === JSON.stringify(planted), await store(page, 'cad.goal.v1'));
    /* A dated task used to hold the next month open. Nothing does now but
       an important note, and there is none. */
    await page.click('.cd-tab[data-v="mon"]');
    ok('a task dated ahead no longer opens the months ahead', await page.$eval('#cdMonN', (b) => b.disabled));
    await page.click('.cd-tab[data-v="hab"]');

    await page.click('.cd-tab[data-v="mon"]');
    const M = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => [c.dataset.day.slice(8), {
      note: c.classList.contains('has-note'),
      w: c.querySelector('.cd-mw') && c.querySelector('.cd-mw').textContent, wc: c.querySelector('.cd-mw') && getComputedStyle(c.querySelector('.cd-mw')).color }])));
    ok('a workout rides its day by name, in its kind\'s colour', M['23'].w === 'Push' && M['22'].w === 'Pull' && M['23'].wc === 'rgb(242, 161, 132)' && !M['24'].w, { 22: M['22'], 23: M['23'] });
    ok('the caption does not count goals', !/goal/i.test(await page.textContent('#cdMonCap')), await page.textContent('#cdMonCap'));
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    ok('and the day sheet does not list them', !/goal/i.test(await page.textContent('#cdShB')));
    await closeSheet(page);

    /* Notes: a line to a day, marked important to reach the calendar. */
    await page.click('.cd-tab[data-v="note"]');
    ok('there are four tabs and Notes is one', (await page.$$('.cd-tab')).length === 4 && (await page.getAttribute('.cd-tab[data-v="note"]', 'aria-current')) === 'page');
    ok('Add waits for words', await page.$eval('#cdNoteGo', (b) => b.disabled));
    await page.fill('#cdNoteIn', 'Race day, pack gels');
    await page.fill('#cdNoteD', '2026-09-28');
    await page.click('#cdNoteImp');
    await page.click('#cdNoteGo');
    await page.fill('#cdNoteIn', 'Felt strong on the run');
    await page.click('#cdNoteGo');
    const ns = await store(page, 'cad.note.v1');
    ok('two notes are written, one important and dated ahead', ns.length === 2 && ns.some((n) => n.d === '2026-09-28' && n.i === 1) && ns.some((n) => n.d === '2026-09-25' && n.i === 0), ns);
    const groups = await page.$$eval('.cd-ng > .cd-lbl', (ls) => ls.map((l) => l.textContent));
    ok('the day is the heading, the one ahead first', groups.join('|') === 'Coming up · Mon 28 Sep|Today', groups);
    ok('the composer clears and goes back to today', (await page.inputValue('#cdNoteIn')) === '' && (await page.inputValue('#cdNoteD')) === '2026-09-25');

    await page.click('.cd-tab[data-v="mon"]');
    const N = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => [c.dataset.day.slice(8), c.classList.contains('has-note')])));
    ok('an important note marks its day, even one still to come', N['28'], N['28']);
    ok('an ordinary note does not', !N['25']);
    await page.click('.cd-mc[data-day="2026-09-28"]');
    await sheetUp(page);
    ok('and the day reads it back', /Race day, pack gels/.test(await page.textContent('#cdShB')));
    await closeSheet(page);

    /* Marking from the list, and deleting from the sheet, which asks. */
    await page.click('.cd-tab[data-v="note"]');
    await page.click('.cd-ni:has-text("Felt strong") .cd-nstar');
    ok('the diamond marks a note important', (await store(page, 'cad.note.v1')).filter((n) => /Felt/.test(n.t))[0].i === 1);
    await page.click('.cd-ni:has-text("Felt strong") .cd-nt');
    await page.waitForSelector('#cdDoc');
    await page.click('#cdDocRm');
    await sheetUp(page);
    ok('deleting asks first, saying it is for good', /for good/.test(await page.textContent('#cdShB')) && (await store(page, 'cad.note.v1')).length === 2);
    await page.click('#cdNERmYes');
    await page.waitForTimeout(320);
    ok('and then the note is gone, and so is its page', (await store(page, 'cad.note.v1')).length === 1 && !(await page.$('#cdDoc')));

    ok('notes make no request off this origin', off.length === 0, off);
    ok('no page errors across notes', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── a note, opened ──');
  {
    /* A note written before blocks existed, one with a damaged block among
       good ones, and nothing else. */
    const init = `(() => { if (!sessionStorage.getItem('planted')) { sessionStorage.setItem('planted', 1);
      localStorage.setItem('cad.note.v1', JSON.stringify([
        { id: 'old', t: 'First line\\nSecond line', d: '2026-09-24', i: 0, at: 1 },
        { id: 'dmg', d: '2026-09-23', i: 0, at: 2, b: [{ k: 'h', r: [['Kept heading', 'o']] }, { k: 'zz', r: [] }, 7, { k: 'p', r: [['kept body', 'nope']] }] }
      ]));
    } })();`;
    const { c, page, errs, off } = await ctx({ init });
    const notes = await store(page, 'cad.note.v1');
    const old = notes.filter((n) => n.id === 'old')[0], dmg = notes.filter((n) => n.id === 'dmg')[0];
    ok('a note from before blocks reads as a body line a line', JSON.stringify(old.b) === '[{"k":"p","r":[["First line",""]]},{"k":"p","r":[["Second line",""]]}]', old.b);
    ok('a damaged block costs itself and the colour nobody has, never the note', JSON.stringify(dmg.b) === '[{"k":"h","r":[["Kept heading","o"]]},{"k":"p","r":[["kept body",""]]}]' && dmg.t === 'Kept heading\nkept body', dmg);

    await page.click('.cd-tab[data-v="note"]');
    ok('the list leads with a heading in weight', (await page.$eval('.cd-ni[data-n="dmg"] .cd-nt b', (b) => b.textContent).catch(() => null)) === 'Kept heading');
    await page.click('.cd-ni[data-n="old"] .cd-nt');
    await page.waitForSelector('#cdDoc.is-open');
    await page.waitForTimeout(320);
    const box = await page.$eval('#cdDoc', (d) => { const r = d.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    ok('pressing a note opens its whole page', box.join() === '0,0,390,844', box);
    ok('its lines are the note', (await page.$$eval('#cdDocEd .cd-nb', (b) => b.map((x) => x.textContent))).join('|') === 'First line|Second line');

    /* Everything from here is typed, the way a person would. */
    const ed = '#cdDocEd';
    const rec = async () => (await store(page, 'cad.note.v1')).filter((n) => n.id === 'old')[0].b;
    const settle = () => page.waitForTimeout(380);
    await page.click(`${ed} .cd-nb >> nth=0`);
    await page.keyboard.press('Home');
    await page.click('#cdDocKs [data-k="t"]');
    ok('a style lands on the line the caret is in', (await page.$eval(`${ed} .cd-nb`, (b) => b.dataset.k)) === 't'
      && (await page.getAttribute('#cdDocKs [data-k="t"]', 'aria-pressed')) === 'true');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Toilet checks');
    await settle();
    let b = await rec();
    ok('Return after a title is a body line, not a second title', b[1].k === 'p' && b[1].r[0][0] === 'Toilet checks' && b[2].r[0][0] === 'Second line', b);
    await page.click('#cdDocKs [data-k="h"]');
    await page.click('#cdDocHl [data-c="o"]');
    await settle();
    b = await rec();
    ok('a caret colours its whole line', b[1].k === 'h' && JSON.stringify(b[1].r) === '[["Toilet checks","o"]]', b[1]);
    await page.click('#cdDocHl [data-c="o"]');
    await settle();
    ok('and the same colour again takes it off', JSON.stringify((await rec())[1].r) === '[["Toilet checks",""]]');
    await page.click('#cdDocHl [data-c="o"]');

    /* A selection colours exactly what it holds. */
    await page.click(`${ed} .cd-nb >> nth=2`);
    await page.keyboard.press('End');
    for (let i = 0; i < 4; i++) await page.keyboard.press('Shift+ArrowLeft');
    await page.click('#cdDocHl [data-c="p"]');
    await settle();
    b = await rec();
    ok('a selection colours only the words it holds', JSON.stringify(b[2].r) === '[["Second ",""],["line","p"]]', b[2]);
    /* Collapsed first: the browser's own selection is blue, and read behind
       the words it is a ground the note never draws. */
    await page.keyboard.press('End');
    const hl = await inkFloor(page, '.cd-nb mark');
    ok('highlighted words hold 4.5:1 on their own wash', hl.n >= 2 && hl.worst.r >= 4.5, hl);

    /* A quote continues on Return and an empty one ends it. */
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.click('#cdDocKs [data-k="q"]');
    await page.keyboard.type('Grab rail loose');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Cord tied up');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('After');
    await settle();
    b = await rec();
    ok('a quote runs on and an empty one ends it', b.map((x) => x.k).join('') === 'thpqqp' && b[5].r[0][0] === 'After', b.map((x) => x.k + ':' + (x.r[0] || [''])[0]));
    const bar = await page.$eval(`${ed} .cd-nb.k-q`, (e) => getComputedStyle(e, '::before').width);
    ok('a quote draws its bar', bar === '3px', bar);

    /* Backspace at the head of a line joins it to the one above. */
    await page.keyboard.press('Home');
    await page.keyboard.press('Backspace');
    await settle();
    b = await rec();
    ok('Backspace at the start of a line joins it up', b.length === 5 && b[4].r.map((x) => x[0]).join('') === 'Cord tied upAfter', b.map((x) => x.k));
    ok('and the join leaves nothing on the page the record cannot say', (await page.$$eval(`${ed} *`, (es) => es.filter((e) => !/^(DIV|MARK|BR|FIGURE|IMG|BUTTON|svg|path)$/.test(e.tagName)).length)) === 0);

    /* A paste is words, split into lines, and never markup. */
    await page.keyboard.press('End');
    await page.evaluate(() => {
      const dt = new DataTransfer(); dt.setData('text/plain', ' one\ntwo\nthree'); dt.setData('text/html', '<b style="color:red">one</b>');
      document.getElementById('cdDocEd').dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    await settle();
    b = await rec();
    ok('a paste is its words, a line a line', b.length === 7 && b[4].r.map((x) => x[0]).join('') === 'Cord tied upAfter one' && b[5].r[0][0] === 'two' && b[6].r[0][0] === 'three', b.map((x) => x.r.map((y) => y[0]).join('')));
    ok('and brings no markup with it', !(await page.$(`${ed} b`)));

    /* A picture: in IndexedDB, never localStorage, with its shape kept. */
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR42mNk+M9QzwAEjDAGACCDAv8cI7IoAAAAAElFTkSuQmCC', 'base64');
    await page.setInputFiles('#cdDocFile', { name: 'a.png', mimeType: 'image/png', buffer: png });
    await page.waitForSelector(`${ed} .cd-nb-i`);
    await settle();
    b = await rec();
    const pic = b.filter((x) => x.k === 'i')[0];
    ok('a picture is a line naming its key and its shape', !!pic && /^p/.test(pic.p) && pic.w === 2 && pic.h === 1, pic);
    ok('and localStorage never holds the picture', !/data:image/.test(await page.evaluate(() => localStorage.getItem('cad.note.v1'))));
    const held = await page.evaluate((k) => new Promise((res) => { const rq = indexedDB.open('cad.pic', 1); rq.onsuccess = () => { const g = rq.result.transaction('p').objectStore('p').get(k); g.onsuccess = () => res(g.result ? g.result.size : 0); }; }), pic.p);
    ok('the picture is in the database', held > 0, held);
    ok('a picture is followed by a line to keep writing on', b[b.indexOf(pic) + 1] && b[b.indexOf(pic) + 1].k === 'p');

    await page.click('#cdDocBack');
    await page.waitForTimeout(200);
    ok('Back takes the page out of the document, not just out of sight', !(await page.$('#cdDoc')));
    ok('the list says the note carries a picture', /1 picture/.test(await page.textContent('.cd-ni[data-n="old"] .cd-nt')));

    await page.reload(); await page.waitForTimeout(200);
    await page.click('.cd-tab[data-v="note"]');
    await page.click('.cd-ni[data-n="old"] .cd-nt');
    await page.waitForSelector('#cdDoc.is-open');
    await page.waitForFunction(() => { const i = document.querySelector('.cd-nb-i img'); return i && i.naturalWidth > 0; }, null, { timeout: 3000 }).catch(() => {});
    const im = await page.$eval('.cd-nb-i img', (i) => ({ nw: i.naturalWidth, ar: getComputedStyle(i).aspectRatio }));
    ok('the picture comes back after a reload, in its own shape', im.nw === 2 && /2 \/ 1/.test(im.ar), im);
    await page.click('.cd-nb-x');
    await settle();
    ok('its cross takes the picture out', !(await rec()).some((x) => x.k === 'i'));

    /* A note emptied of everything goes when you leave it. */
    await page.click('#cdDocBack'); await page.waitForTimeout(200);
    await page.click('.cd-ni[data-n="dmg"] .cd-nt');
    await page.waitForSelector('#cdDoc.is-open');
    await page.click(ed);
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    ok('a note emptied of everything goes when you leave it', !(await store(page, 'cad.note.v1')).some((n) => n.id === 'dmg') && !(await page.$('#cdDoc')));

    ok('a note makes no request off this origin', off.length === 0, off);
    ok('no page errors in a note', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── layout, on every view ──');
  {
    /* A long day, so the day's pane has somewhere to scroll to. */
    const long = JSON.stringify(['Wake up', 'Gym', 'Deep work', 'Lunch', 'Emails and calls', 'Walk', 'Study', 'Meal prep', 'Read', 'Journal', 'Stretch', 'Wind down']
      .map((n, i) => ({ id: 'L' + i, n, d: [0, 1, 2, 3, 4, 5, 6], s: 360 + i * 75, e: 360 + i * 75 + 45 })));
    const { c, page, errs } = await ctx({ init: `localStorage.setItem('cad.week.v1', '${long}');
      localStorage.setItem('cad.hab.v1', JSON.stringify({ '2026-09-24': { steps: 8000, mind: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({ '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } } }));
      localStorage.setItem('cad.note.v1', JSON.stringify([{ id: 'n1', t: 'Race day, pack gels', d: '2026-09-28', i: 1, at: 1 }, { id: 'n2', t: 'Legs felt heavy', d: '2026-09-24', i: 0, at: 2 }]));` });
    const WORDS = {
      day: '.cd-tab, .cd-wl, #cdHeroK, #cdHeroN, #cdHeroS, .cd-tcap, #cdThenN, .cd-it:not(.is-past) .cd-rn, .cd-it.is-done .cd-rn, .cd-rt',
      hab: '#cdVHab .cd-hcap, #cdHabT, #cdHabCap, .cd-hr-t, .cd-hr-v, .cd-hr-s > span:last-child, #cdHabAdd',
      mon: '#cdMonK, #cdMonT, #cdMonCap, .cd-dows span, .cd-legend span, .cd-mc b, .cd-mw',
      note: '#cdVNote .cd-hcap, #cdNoteT, #cdNoteCap, .cd-ng > .cd-lbl, .cd-nt, #cdNoteImp'
    };
    for (const v of ['day', 'hab', 'mon', 'note']) {
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
    /* 10:20 is DAY, so the sky is a clear blue from top to foot. The night
       half of this is measured in its own section below. */
    ok('the ground is the sky, and at 10:20 it is a day blue from top to foot',
      (await page.getAttribute('html', 'data-sky')) === 'day' && top[2] > top[0] + 40 && foot[2] > foot[0] + 40, { top, foot });
    ok('the four words are the top of the screen, between settings and add',
      lay.nav.top < 60 && lay.gear.l < 30 && lay.plus.r > 360 && lay.plus.t < 60 && lay.gear.t < 60, lay);
    ok('add is a glyph in the ink, not a second white round', lay.plus.bg === 'rgba(0, 0, 0, 0)' && lay.plus.c === 'rgb(243, 245, 247)', lay.plus);
    ok('and the one white control on the day is the check', lay.white.join() === 'cdGo', lay.white);
    ok('the week sits between the words and the block you are in', lay.nav.bottom < lay.week && lay.week < lay.hero, lay);
    /* The hour moves the SKY and nothing else: there is still one face,
       white on a dark ground, so no token a word is drawn in ever changes. */
    ok('there is one face, and it is dark: the hour moves the sky and never the ink',
      (await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)) === 'dark'
      && !(await page.getAttribute('html', 'data-mode'))
      && (await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ink').trim())) === '#F3F5F7');
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
    ok('a backup carries every record', bak.app === 'cadence' && ['week', 'log', 'hab', 'train', 'defs', 'note'].every((k) => k in bak) && !('goal' in bak) && !('off' in bak), Object.keys(bak));
    bak.week.push({ id: 'x3', n: 'Restored', d: [4], s: 800, e: 830 });
    await page.fill('#cdRestore', JSON.stringify(bak));
    await Promise.all([page.waitForNavigation(), page.click('#cdRestoreGo')]);
    await page.waitForTimeout(150);
    /* Read off the store AND the screen: with the running block kept, the screen
       has moved on and it is drawn in the middle rather than in the list. */
    ok('restoring writes it back', (await store(page, 'cad.week.v1')).some((x) => x.n === 'Restored')
      && [...(await page.$$eval('.cd-rn', (ns) => ns.map((n) => n.textContent))), await page.textContent('#cdHeroN'), (await page.textContent('#cdThenN')).replace(/ at .*$/, '')].includes('Restored'));
    ok('no page errors in the record', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── a block is missed half an hour after it ends ──');
  {
    /* Deep work ends at 12:00. At 12:29 it is late, not missed: no strike.
       At 12:30 the half hour is up and it is struck. Read at both sides of
       the line, because a build that never strikes passes the first and
       one that strikes on the minute passes the second. */
    const at = async (t) => {
      const { c, page } = await ctx({ at: '2026-09-25T' + t + ':00' });
      const r = await page.$$eval('.cd-it', (ls) => ls.map((l) => ({ n: l.querySelector('.cd-rn').textContent, past: l.classList.contains('is-past'),
        s: getComputedStyle(l.querySelector('.cd-rn')).textDecorationLine })).find((x) => x.n === 'Deep work') || null);
      await c.close();
      return r;
    };
    const late = await at('12:29'), gone = await at('12:30');
    ok('a block 29 minutes past its end is not yet struck as missed', !!late && !late.past && late.s === 'none', late);
    ok('and at half an hour past it is', !!gone && gone.past && gone.s === 'line-through', gone);
  }

  console.log('\n── clearing the whole week ──');
  {
    /* One press empties the template, and it asks first. Both exits are
       read off the STORE: Keep leaves every block, Clear leaves none, Undo
       puts all of them back, and an empty week stays empty across a
       reload rather than being re-seeded with the starter week. */
    const { c, page, errs } = await ctx({});
    const before = (await store(page, 'cad.week.v1')).length;
    const logBefore = JSON.stringify(await store(page, 'cad.log.v1'));
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdWkClr'); await sheetUp(page);
    await page.click('#cdShB .cd-btn:not(.warn)');
    await page.waitForTimeout(250);
    ok('keeping them keeps every block', before > 0 && (await store(page, 'cad.week.v1')).length === before, before);
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdWkClr'); await sheetUp(page);
    await page.click('#cdClrYes');
    await page.waitForTimeout(250);
    ok('clearing takes every block off every day, and the list with them',
      (await store(page, 'cad.week.v1')).length === 0 && (await page.$$('.cd-it')).length === 0);
    ok('and what was already kept stays in the record', JSON.stringify(await store(page, 'cad.log.v1')) === logBefore);
    ok('it offers Undo', !(await page.$eval('#cdToastU', (u) => u.hidden)));
    await page.click('#cdToastU');
    await page.waitForTimeout(250);
    ok('and Undo puts every block back', (await store(page, 'cad.week.v1')).length === before);
    /* Pressed through the DOM rather than by Playwright: after a broken
       Undo the control is disabled, and a click on it would hang the file
       rather than fail the check that names the fault. */
    await page.click('#cdGear'); await sheetUp(page);
    await page.evaluate(() => document.getElementById('cdWkClr').click());
    await page.waitForTimeout(250);
    await page.evaluate(() => { const y = document.getElementById('cdClrYes'); if (y) y.click(); });
    await page.reload(); await page.waitForTimeout(300);
    ok('an empty week stays empty after a reload, not re-seeded', (await store(page, 'cad.week.v1')).length === 0);
    await page.click('#cdGear'); await sheetUp(page);
    ok('and with nothing left to clear, the control is off', await page.$eval('#cdWkClr', (b) => b.disabled));
    ok('no page errors clearing the week', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the sky follows the clock ──');
  {
    /* Four phases, each shot at its own frozen hour. What is held: which
       phase the root says it is in, what colour the foot actually is on
       screen, whether there are stars, and — at every phase — that a
       quiet label still clears its bar, because the sky may move in hue
       and never in how much light it gives the words on it. */
    const PHASES = [
      { at: '2026-09-25T06:00:00', sky: 'dawn' },
      { at: '2026-09-25T10:20:00', sky: 'day' },
      { at: '2026-09-25T19:00:00', sky: 'dusk' },
      { at: '2026-09-25T22:30:00', sky: 'night' }
    ];
    const seen = {};
    for (const ph of PHASES) {
      const { c, page, errs } = await ctx({ at: ph.at });
      const st = await page.evaluate(() => {
        const L = document.getElementById('cdStars'), cs = [...L.querySelectorAll('circle')];
        const tw = L.querySelector('.tw');
        return { sky: document.documentElement.dataset.sky, op: +getComputedStyle(L).opacity,
          n: cs.length, low: cs.filter((e) => parseFloat(e.getAttribute('cy')) > 50).length,
          big: cs.filter((e) => +e.getAttribute('r') > .9).length,
          tw: tw ? getComputedStyle(tw).animationPlayState : null,
          meta: document.querySelector('meta[name="theme-color"]').content };
      });
      const px = await shoot(page);
      const top = px(4, 2), foot = px(4, 840);
      seen[ph.sky] = { top, foot, op: st.op };
      ok(`${ph.sky}: the root says which part of the day it is`, st.sky === ph.sky, st);
      ok(`${ph.sky}: the browser's own bar wears the top of the sky`,
        /^rgb/.test(st.meta) && st.meta.match(/\d+/g).map(Number).every((v, i) => Math.abs(v - top[i]) <= 3), { meta: st.meta, top });
      /* The quiet label is the tightest pair on the screen: a THEN, the
         week's letters, the times down the list. Read on composited pixels
         over whatever the sky is doing behind them at this hour. */
      const ink = await inkFloor(page, '.cd-rt, .cd-wl, .cd-cap, .cd-it:not(.is-past) .cd-rn, .cd-it.is-done .cd-rn');
      ok(`${ph.sky}: every quiet word still holds 4.5:1 on the sky`, ink.n > 4 && ink.worst.r >= 4.5, ink);
      ok(`${ph.sky}: and the foot, where the list scrolls, holds it too`,
        ratio(over([243, 245, 247, .62], foot), foot) >= 4.5, { foot, r: +ratio(over([243, 245, 247, .62], foot), foot).toFixed(2) });
      ok(`${ph.sky}: no star sits under the list, and none is big enough to read as a day's dot`, st.n >= 60 && st.low === 0 && st.big === 0, st);
      if (ph.sky === 'night') {
        ok('night: the stars are out', st.op > .95, st);
        ok('night: near-black at the top, a deep blue at the foot',
          Math.max(...top) < 12 && foot[2] > foot[0] * 2.5 && foot[2] > foot[1] * 1.6 && lum(foot) > lum(top) * 3, { top, foot });
        ok('night: and a few of them twinkle', st.tw === 'running', st.tw);
      }
      if (ph.sky === 'day') {
        ok('day: no stars, and nothing animating behind the app', st.op === 0 && st.tw === 'paused', st);
      }
      if (ph.sky === 'dusk' || ph.sky === 'dawn') {
        ok(`${ph.sky}: a warm horizon — the foot leans red, where day and night lean blue`, foot[0] > foot[2], foot);
      }
      ok(`${ph.sky}: no page errors`, errs.length === 0, errs);
      await c.close();
    }
    ok('the day is the lightest sky at the top, and night the darkest',
      lum(seen.day.top) > lum(seen.dawn.top) && lum(seen.day.top) > lum(seen.dusk.top) && lum(seen.night.top) <= Math.min(lum(seen.dawn.top), lum(seen.dusk.top)), seen);

    /* The phases meet by degrees: halfway between day and dusk is a sky
       between the two, never a snap from one to the other. */
    {
      const { c, page } = await ctx({ at: '2026-09-25T18:15:00' });
      const px = await shoot(page), mid = px(4, 840);
      const d = seen.day.foot, k = seen.dusk.foot;
      ok('between two phases the sky is between them too', [0, 1, 2].every((i) => mid[i] >= Math.min(d[i], k[i]) - 2 && mid[i] <= Math.max(d[i], k[i]) + 2)
        && mid.some((v, i) => Math.abs(v - d[i]) > 4) && mid.some((v, i) => Math.abs(v - k[i]) > 4), { day: d, mid, dusk: k });
      await c.close();
    }
    /* Reduced motion keeps the stars and stops the twinkle. */
    {
      const { c, page } = await ctx({ at: '2026-09-25T22:30:00' });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const r = await page.evaluate(() => ({ an: getComputedStyle(document.querySelector('#cdStars .tw')).animationName, op: +getComputedStyle(document.getElementById('cdStars')).opacity }));
      ok('reduced motion: the stars stay and nothing twinkles', r.an === 'none' && r.op > .95, r);
      await c.close();
    }
  }

  console.log('\n── nothing leaks on a small phone ──');
  {
    /* The layout sweep found these by driving every screen at five sizes;
       these are the ones worth holding for ever, at the width that broke
       them. */
    /* A day carrying the most a cell can: every habit hit and the longest
       session name, so a cell that cannot hold it shows. */
    const init = `(() => { if (localStorage.getItem('cad.hab.v1')) return;
      localStorage.setItem('cad.hab.v1', JSON.stringify({ '2026-09-24': { train: 1, mind: 1, steps: 30000, fuel: 2400, water: 4, sleep: 9 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({ '2026-09-24': { '~day': { k: ['weights.full'], e: 'Hard', m: 60 } } }));
    })();`;
    const { c, page, errs } = await ctx({ vp: { width: 320, height: 568 }, init });
    /* Lines, not rects: a unit beside a figure is a second rect on the SAME
       line, so rects are clustered at half the font size first. */
    const lines = (sel) => page.$eval(sel, (e) => {
      const fs = parseFloat(getComputedStyle(e).fontSize);
      const r = document.createRange(); r.selectNodeContents(e);
      const bs = [...r.getClientRects()].filter((q) => q.width > 1).map((q) => q.bottom).sort((a, b) => a - b);
      const ls = []; bs.forEach((t) => { if (!ls.length || t - ls[ls.length - 1] > fs * .5) ls.push(t); });
      let gap = Infinity; for (let i = 1; i < ls.length; i++) gap = Math.min(gap, (ls[i] - ls[i - 1]) / fs);
      return { n: ls.length, gap: +gap.toFixed(2), lh: +(parseFloat(getComputedStyle(e).lineHeight) / fs).toFixed(2) };
    });
    for (const v of ['day', 'hab', 'mon', 'note']) {
      await page.click(`.cd-tab[data-v="${v}"]`);
      await page.waitForTimeout(120);
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      ok(`${v}: nothing runs off the side at 320`, w[0] <= w[1], w);
    }

    /* `1fr` is `minmax(auto, 1fr)`: a date's circle made its column grow. */
    await page.click('.cd-tab[data-v="mon"]');
    /* Equal is not enough: seven cells that all grew to 60px are equal and
       run off the grid. So the row has to fit, and nothing a cell draws may
       reach past its own box. */
    const mg = await page.$eval('.cd-mgrid', (g) => {
      const gr = g.getBoundingClientRect(), cs = [...g.children];
      const w = cs.slice(0, 7).map((x) => x.getBoundingClientRect().width);
      const spill = cs.filter((x) => { const r = x.getBoundingClientRect(); return [...x.querySelectorAll('*')].some((d) => { const q = d.getBoundingClientRect(); return q.width && (q.left < r.left - .5 || q.right > r.right + .5); }); }).length;
      return { w, fits: cs.every((x) => x.getBoundingClientRect().right <= gr.right + .5), spill };
    });
    ok('the fullest cell is carrying something to hold', await page.$eval('.cd-mc[data-day="2026-09-24"]', (x) => x.querySelectorAll('.cd-mh').length >= 4 && !!x.querySelector('.cd-mw')));
    ok('the month keeps seven equal columns inside the grid', Math.max(...mg.w) - Math.min(...mg.w) < 0.6 && mg.fits && mg.spill === 0, mg);

    /* A caption set at line-height 1 prints its second line on its first. */
    await page.click('.cd-mc[data-day="2026-09-25"]');
    await sheetUp(page);
    const cap = await lines('#cdSheet .cd-cap');
    ok('a wrapped caption does not print on itself', cap.lh >= 1.1 && (cap.n < 2 || cap.gap >= 1.08), cap);
    await closeSheet(page);

    /* The toast sits at left 50%, so without max-content it wraps at half
       the screen. */
    await page.click('.cd-tab[data-v="day"]');
    await page.click('.cd-it[data-id] .cd-rb');
    await sheetUp(page);
    const dayR = await page.$eval('#cdSheet', (sh) => { const r = sh.getBoundingClientRect(); return [...sh.querySelectorAll('.cd-chips.days .cd-chip')].map((b) => b.getBoundingClientRect()).filter((b) => b.width).every((b) => b.left >= r.left && b.right <= r.right + .5); });
    ok('seven day chips fit inside the sheet', dayR);
    await page.fill('#cdFN', 'Meal prep');
    await page.click('#cdFSave');
    await page.waitForTimeout(320);
    /* A toast with no Undo is the words alone, and they get the same room
       on the right as on the left: the padding was written for a toast
       whose right end is a button. */
    const bare = await page.$eval('#cdToast', (t) => { const r = t.getBoundingClientRect(), q = document.createRange(); q.selectNodeContents(document.getElementById('cdToastT'));
      const w = q.getBoundingClientRect(); return { txt: t.textContent.trim(), l: Math.round(w.left - r.left), r: Math.round(r.right - w.right) }; });
    ok('a toast with nothing to undo keeps its words off both edges', /(Added|Saved) Meal prep/.test(bare.txt) && bare.r >= 14 && Math.abs(bare.l - bare.r) <= 2, bare);
    await page.click('.cd-it[data-id] .cd-rb');
    await sheetUp(page);
    await page.click('#cdFDel');
    await page.waitForTimeout(320);
    const t = await lines('#cdToastT');
    ok('the toast says it on one line', t.n === 1, t);
    await page.click('#cdToastU');

    /* Eight rungs are a ladder of two even rows, never 4, 3 and one. */
    await page.click('.cd-it[data-id="s1"] .cd-dot');
    if (!(await sheetUp(page))) { await page.click('.cd-it[data-id="s1"] .cd-dot'); await sheetUp(page); }
    await page.click('[data-k="weights.push"]');
    const rows = await page.$$eval('[data-m]', (bs) => { const m = {}; bs.forEach((b) => { const k = Math.round(b.getBoundingClientRect().top); m[k] = (m[k] || 0) + 1; }); return Object.values(m); });
    ok('the length ladder is two rows of four', rows.join() === '4,4', rows);
    const go = await lines('#cdLiftGo');
    ok('a foot button that wraps keeps its leading', go.lh >= 1.1, go);
    ok('no page errors on a small phone', errs.length === 0, errs);
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
