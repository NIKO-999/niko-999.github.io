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
    const c = await browser.newContext(opts.desk ? { ...PHONE, viewport: opts.desk, isMobile: false, hasTouch: false }
      : opts.vp ? { ...PHONE, viewport: opts.vp } : PHONE);
    await c.addInitScript(freeze(opts.at || '2026-09-25T10:20:00'));
    /* The day's reflection comes up over the app on the first open of a
       date, which is every fresh context — so every section but its own
       marks today seen. Only when ABSENT: an init script runs on every
       navigation, and a check that clears the key would get it back. */
    if (!opts.reflect) await c.addInitScript(`(() => { if (localStorage.getItem('cad.refl.v1')) return;
      const d = new Date(), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      localStorage.setItem('cad.refl.v1', JSON.stringify({ [k]: { s: 1 } })); })();`);
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

    /* A GLYPH SAYS WHAT KIND OF THING A BLOCK IS, and the dot stays the
       dot. Asserted as both: a build that drew the glyph INSTEAD of the
       dot passes every glyph check, and one that drew neither passes none. */
    const gl = await page.$$eval('.cd-it', (ls) => ls.map((l) => {
      const d = l.querySelector('.cd-dot i'), g = l.querySelector('.cd-rb .cd-rg'), n = l.querySelector('.cd-rn');
      const r = (e) => e ? e.getBoundingClientRect() : null, dr = r(d), gr = r(g), nr = r(n);
      return { k: g ? g.dataset.g : null, svg: g ? g.innerHTML : '', dot: !!d && dr.width > 0, gw: gr ? gr.width : 0,
        order: !!(dr && gr && nr) && dr.right <= gr.left && gr.right <= nr.left, nx: nr ? nr.left : 0,
        gc: g ? getComputedStyle(g).color : '', dc: d ? getComputedStyle(d).boxShadow : '', past: l.classList.contains('is-past') && !l.classList.contains('is-done'),
        inName: !!n.querySelector('.cd-rg') };
    }));
    ok('every row keeps its dot and draws a glyph of its own kind between the dot and the name',
      gl.length === 7 && gl.every((x) => x.dot && x.gw === 18 && x.order && !x.inName)
      && gl.map((x) => x.k).join() === 'wake,train,work,eat,mail,read,sleep', gl);
    const bySvg = {};
    gl.forEach((x) => { (bySvg[x.svg] = bySvg[x.svg] || new Set()).add(x.k); });
    ok('two kinds never share a glyph, and one kind is always the same glyph',
      Object.values(bySvg).every((ks) => ks.size === 1) && Object.keys(bySvg).length === new Set(gl.map((x) => x.k)).size, Object.values(bySvg).map((s) => [...s]));
    ok('every name starts at the same x, whatever its glyph', new Set(gl.map((x) => Math.round(x.nx))).size === 1, gl.map((x) => x.nx));

    /* HOLD AND DRAG MOVES A BLOCK. Held still, the row lifts; dragged
       down 48px it is thirty minutes later, its length kept, the editor
       not opened, and Undo puts it back. A drag that starts at once is a
       scroll, and moves nothing. */
    {
      const wk0 = await store(page, 'cad.week.v1');
      const lunch = wk0.find((b) => b.n === 'Lunch');
      const box = await page.$eval(`.cd-it[data-id="${lunch.id}"] .cd-rb`, (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await page.mouse.move(box.x, box.y); await page.mouse.down();
      await page.mouse.move(box.x, box.y + 48, { steps: 6 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      const quick = (await store(page, 'cad.week.v1')).find((b) => b.id === lunch.id);
      await closeSheet(page);
      ok('a drag that starts at once is a scroll, and moves nothing', quick.s === lunch.s);
      await page.mouse.move(box.x, box.y); await page.mouse.down();
      await page.waitForTimeout(520);
      const lifted = await page.$eval(`.cd-it[data-id="${lunch.id}"]`, (e) => e.classList.contains('is-lift'));
      await page.mouse.move(box.x, box.y + 24, { steps: 3 });
      const mid = await page.textContent(`.cd-it[data-id="${lunch.id}"] .cd-rt`);
      await page.mouse.move(box.x, box.y + 48, { steps: 3 });
      await page.mouse.up();
      await page.waitForTimeout(250);
      const moved = (await store(page, 'cad.week.v1')).find((b) => b.id === lunch.id);
      const sheet = await page.$('#cdSheet.is-open');
      const toast = await page.textContent('#cdToastT');
      ok('held, the row lifts and its time follows the finger in five-minute steps', lifted && mid === '12:45', { lifted, mid });
      ok('let go, it starts thirty minutes later with its length kept, and the editor stays shut',
        moved.s === lunch.s + 30 && moved.e - moved.s === lunch.e - lunch.s && !sheet && toast === 'Lunch now starts at 13:00', { moved, toast, sheet: !!sheet });
      await page.click('#cdToastU');
      const back = (await store(page, 'cad.week.v1')).find((b) => b.id === lunch.id);
      ok('and Undo puts it back', back.s === lunch.s && back.e === lunch.e);
      /* Lifted and dropped back where it started: nothing changes, and
         the press that ends it is not a tap that opens the editor. */
      await page.waitForTimeout(3500);
      await page.mouse.move(box.x, box.y); await page.mouse.down();
      await page.waitForTimeout(520);
      await page.mouse.move(box.x, box.y + 24, { steps: 3 });
      await page.mouse.move(box.x, box.y, { steps: 3 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      const same = (await store(page, 'cad.week.v1')).find((b) => b.id === lunch.id);
      const opened = !!(await page.$('#cdSheet.is-open'));
      if (opened) await closeSheet(page);
      ok('lifted and put back where it was, nothing changes and the editor stays shut', same.s === lunch.s && !opened, { s: same.s, opened });
    }
    /* The glyph wears the dot's colour: a row still ahead is the block's
       own hue, a missed one is the same quiet grey its dot goes to. */
    ok('a glyph is its block\'s own colour, and a missed one goes grey with its dot',
      gl.filter((x) => !x.past).every((x) => x.dc.indexOf(x.gc) >= 0) && gl.some((x) => x.past)
      && gl.filter((x) => x.past).every((x) => x.gc === 'rgba(243, 245, 247, 0.4)'), gl.map((x) => [x.k, x.past, x.gc, x.dc]));
    /* A glyph is a graphic, held to 3:1 on the sky beside it — read off
       composited pixels, because a hue that draws nothing passes the rest. */
    const gbx = await page.$$eval('.cd-it:not(.is-past) .cd-rg', (es) => es.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }).filter((b) => b.y + b.h < innerHeight));
    const gpng = PNG.sync.read(await page.screenshot());
    const gget = (x, y) => { const i = (y * gpng.width + x) * 4; return [gpng.data[i], gpng.data[i + 1], gpng.data[i + 2]]; };
    const gr3 = gbx.map((b) => {
      const sky = gget(Math.round((b.x - 6) * DPR), Math.round((b.y + b.h / 2) * DPR));
      let best = 1;
      for (let y = Math.floor(b.y * DPR); y < Math.ceil((b.y + b.h) * DPR); y++)
        for (let x = Math.floor(b.x * DPR); x < Math.ceil((b.x + b.w) * DPR); x++) best = Math.max(best, ratio(gget(x, y), sky));
      return +best.toFixed(2);
    });
    ok('every glyph holds 3:1 against the sky beside it', gr3.length >= 3 && gr3.every((r) => r >= 3), gr3);

    /* AND THEY CAN BE TURNED OFF, and the dot never can. On by default;
       off takes every glyph away, keeps every dot, and gives the column
       back so the names move left rather than sitting after a gap. Held
       across a reload, then turned back on so the rest of the file reads
       the day it was written against. */
    const rowSnap = () => page.$$eval('.cd-it', (ls) => ls.map((l) => ({ g: !!l.querySelector('.cd-rg'), d: !!l.querySelector('.cd-dot i'), x: l.querySelector('.cd-rn').getBoundingClientRect().left })));
    await page.click('#cdGear'); await sheetUp(page);
    const gOn0 = await page.getAttribute('#cdGlyphOn', 'aria-pressed');
    await page.click('#cdGlyphOn'); await page.waitForTimeout(80);
    const gOff = await rowSnap();
    ok('glyphs are on until you turn them off, and off keeps every dot and takes every glyph',
      gOn0 === 'true' && (await page.getAttribute('#cdGlyphOn', 'aria-pressed')) === 'false' && (await store(page, 'cad.glyphoff.v1')) === true
      && gOff.length === 7 && gOff.every((r) => r.d && !r.g), { gOn0, gOff });
    ok('and the names move into the glyph\'s column rather than leaving a gap', gOff.every((r) => Math.abs(r.x - (gl[0].nx - 30)) < 1), { was: gl[0].nx, now: gOff.map((r) => r.x) });
    await closeSheet(page);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(200);
    ok('off stays off across a reload', (await rowSnap()).every((r) => r.d && !r.g));
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdGlyphOn'); await page.waitForTimeout(80);
    const gBack = await rowSnap();
    ok('and on again brings every glyph back beside its dot', (await store(page, 'cad.glyphoff.v1')) === false && gBack.every((r) => r.d && r.g && Math.abs(r.x - gl[0].nx) < 1), gBack);
    await closeSheet(page);

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
    /* THE TAP. Chromium has navigator.vibrate, so a recorder stands in
       for it; the switch's own flips are counted beside it, which is the
       iOS path. Recorded from before Not yet, because a tap on every
       press is the build this exists to refuse. */
    await page.evaluate(() => {
      window.__vib = []; window.__flip = 0;
      Object.defineProperty(navigator, 'vibrate', { configurable: true, value: (ms) => { window.__vib.push(ms); return true; } });
      const sw = document.querySelector('#cdBuzz input'); if (sw) sw.addEventListener('change', () => { window.__flip++; });
    });
    const buzzOf = () => page.evaluate(() => ({ vib: window.__vib.slice(), flip: window.__flip }));
    await page.evaluate(() => document.getElementById('cdGoNo') && document.getElementById('cdGoNo').click());
    await page.waitForTimeout(350);
    ok('Not yet does not tap the phone', JSON.stringify(await buzzOf()) === '{"vib":[],"flip":0}', await buzzOf());
    ok('and Not yet leaves the block as it was', !(await page.$eval('#cdSheet', (e) => e.classList.contains('is-open'))) && !(((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3
      && (await page.textContent('#cdHeroN')) === 'Deep work');
    await page.click('#cdGo');
    ok('an ordinary block is answered with Complete', (await page.textContent('#cdGoYes')) === 'Complete');
    await page.evaluate(() => document.getElementById('cdGoYes') && document.getElementById('cdGoYes').click());
    await page.waitForTimeout(350);
    ok('confirming keeps the block you are in', (((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3 === 1);
    ok('and Complete taps the phone once, through vibrate where there is one', JSON.stringify(await buzzOf()) === '{"vib":[12],"flip":0}', await buzzOf());
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

    /* WITH NO vibrate, WHICH IS AN IPHONE, the switch flips instead. And
       the switch is not a control: off screen, out of the tab order and
       out of the accessibility tree, or it is a checkbox nobody asked
       for sitting in the page. */
    await page.evaluate(() => { Object.defineProperty(navigator, 'vibrate', { configurable: true, value: undefined }); });
    await page.click('#cdGo');
    await page.evaluate(() => document.getElementById('cdGoYes') && document.getElementById('cdGoYes').click());
    await page.waitForTimeout(350);
    ok('without vibrate, Complete flips the hidden switch instead', JSON.stringify(await buzzOf()) === '{"vib":[12],"flip":1}', await buzzOf());
    const sw = await page.evaluate(() => {
      const l = document.getElementById('cdBuzz'), i = l && l.querySelector('input'), r = l ? l.getBoundingClientRect() : null;
      return l ? { sw: i.hasAttribute('switch'), type: i.type, tab: i.tabIndex, aria: l.getAttribute('aria-hidden'), off: r.right <= 0 || r.bottom <= 0 || getComputedStyle(l).opacity === '0',
        pe: getComputedStyle(l).pointerEvents, shown: getComputedStyle(l).display !== 'none' } : null;
    });
    ok('the switch is a switch, off screen, unreachable and unannounced, but still laid out', !!sw && sw.sw && sw.type === 'checkbox' && sw.tab === -1
      && sw.aria === 'true' && sw.off && sw.pe === 'none' && sw.shown, sw);
    await page.evaluate(() => document.getElementById('cdToastU').click());
    ok('and Undo puts it back again', !(((await store(page, 'cad.log.v1')) || {})['2026-09-25'] || {}).s3 && (await page.textContent('#cdHeroN')) === 'Deep work');

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
    ok('and a row\'s dot does not tap the phone', JSON.stringify(await buzzOf()) === '{"vib":[12],"flip":1}', await buzzOf());
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
    /* A running name too long for one line steps down until it fits on
       one, never cut; a short one keeps the full 46. */
    const { c, page } = await ctx({ init: `localStorage.setItem('cad.week.v1', JSON.stringify([{ id: 'r1', n: 'Putting room together', d: [4], s: 600, e: 660 }]));` });
    const fit = await page.evaluate(() => {
      const el = document.getElementById('cdHeroN'), r = el.getBoundingClientRect(), fs = parseFloat(getComputedStyle(el).fontSize), lh = parseFloat(getComputedStyle(el).lineHeight);
      return { t: el.textContent, fs, lines: Math.round(r.height / lh), cut: (() => { const g = document.createRange(); g.selectNodeContents(el); const t = g.getBoundingClientRect(), p = el.parentNode.getBoundingClientRect(); return t.left < p.left - .5 || t.right > p.right + .5 || t.right > r.right + .5; })(), inside: r.left >= 0 && r.right <= innerWidth };
    });
    /* And only as far as it has to: half a pixel bigger and it would no
       longer fit on one line. */
    const snug = await page.evaluate(() => {
      const el = document.getElementById('cdHeroN'), fs = parseFloat(el.style.fontSize), pc = getComputedStyle(el.parentNode);
      const room = el.parentNode.clientWidth - parseFloat(pc.paddingLeft) - parseFloat(pc.paddingRight);
      el.style.whiteSpace = 'nowrap'; el.style.fontSize = (fs + .5) + 'px';
      const over = el.scrollWidth > room;
      el.style.fontSize = fs + 'px'; el.style.whiteSpace = '';
      return { fs, over };
    });
    ok('it shrinks only as far as it must: half a pixel more would not fit', snug.fs > 28 && snug.over, snug);
    ok('a long running name shrinks to one line rather than wrapping or cutting', /Putting room together/.test(fit.t) && fit.fs < 46 && fit.fs >= 28 && fit.lines === 1 && !fit.cut && fit.inside, fit);
    await c.close();
  }
  {
    const { c, page } = await ctx({});
    ok('a short one keeps the full size', parseFloat(await page.$eval('#cdHeroN', (e) => getComputedStyle(e).fontSize)) === 46);
    await c.close();
  }
  {
    const { c, page } = await ctx({ init: `localStorage.setItem('cad.week.v1', JSON.stringify([{ id: 'm1', n: 'Gym', d: [0], s: 420, e: 480 }]));` });
    ok('a day with nothing on says so', (await heroOf(page)).join('|') === 'Today · 25 Sep|Nothing on||', await heroOf(page));
    ok('and offers the way to put something on it', !(await shown(page, '#cdGo')) && /Add a block/.test(await page.textContent('#cdAgenda')));
    await c.close();
  }

  console.log('\n── the page under the sky ──');
  {
    const { c, page } = await ctx({});
    /* Whatever the phone draws below the body shows the html's colour, so
       it has to be the sky's own foot rather than the black at its top. */
    const foot = await page.evaluate(() => {
      const sky = getComputedStyle(document.documentElement).getPropertyValue('--sky');
      const stops = sky.match(/rgb\([^)]*\)/g) || [];
      return { html: getComputedStyle(document.documentElement).backgroundColor, last: stops[stops.length - 1] };
    });
    ok('the page under the body is the colour of the sky\u2019s foot', !!foot.last && foot.html === foot.last, foot);
    /* With a sheet up the foot of the screen is the sheet, so the strip
       under the body has to be the sheet's colour — and go back after. */
    await page.click('#cdGear'); await sheetUp(page);
    const shFoot = await page.evaluate(() => ({ html: getComputedStyle(document.documentElement).backgroundColor, sheet: getComputedStyle(document.getElementById('cdSheet')).backgroundColor }));
    ok('with a sheet up the page under the body is the sheet\u2019s colour', shFoot.html === shFoot.sheet, shFoot);
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const back = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    ok('and it goes back to the sky\u2019s foot once the sheet is put away', back === foot.last, { back, last: foot.last });
    await c.close();
  }

  console.log('\n── the day\u2019s thought ──');
  {
    const { c, page, errs } = await ctx({ reflect: true });
    const rUp = await page.waitForSelector('#cdRf', { timeout: 2000 }).then(() => true, () => false);
    ok('the first open of a day shows its thought', rUp);
    /* A build that never shows it is opened from Settings rather than
       left to hang the file on a missing card. */
    if (!rUp) { await page.click('#cdGear'); await sheetUp(page); await page.click('#cdReflOpen'); await page.waitForTimeout(320); }
    const q1 = await page.textContent('#cdReflQ').catch(() => null);
    ok('it is the thought worked out for the date', q1 === await page.evaluate(() => window.cadence.reflect('2026-09-25')), q1);
    /* In the MIDDLE and read, never a sheet and never a field. */
    const geo = await page.evaluate(() => {
      const c = document.querySelector('.cd-rf-c'); if (!c) return null;
      const r = c.getBoundingClientRect();
      return { mid: Math.abs((r.top + r.bottom) / 2 - innerHeight / 2), fields: document.querySelectorAll('#cdRf textarea, #cdRf input').length,
        sheet: !document.getElementById('cdSheet').hidden };
    });
    ok('it is a card in the middle with nothing to type in', geo && geo.mid < 40 && geo.fields === 0 && !geo.sheet, geo);
    const qs = await page.evaluate(() => {
      const out = []; for (let i = 0; i < 40; i++) { const d = new Date(2026, 8, 25 + i); out.push(window.cadence.reflect(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))); }
      return { n: window.cadence.questions, qs: out };
    });
    ok('there are at least twenty-five, and no two days in a row share one', qs.n >= 25 && qs.qs.every((q, i) => i === 0 || q !== qs.qs[i - 1]) && new Set(qs.qs).size === qs.n, qs.n);
    ok('the first open marks today seen', (await store(page, 'cad.refl.v1'))['2026-09-25'].s === 1);
    /* An arrow, not a word: a glyph with no text drawn, still NAMED,
       and a box a thumb reaches. */
    const go = await page.evaluate(() => {
      const b = document.getElementById('cdReflOk'); if (!b) return null;
      /* offsetWidth, not the rect: the card scales in, and a box read
         mid-entrance is the transform rather than the layout. */
      return { text: b.textContent.trim(), name: b.getAttribute('aria-label'), svg: !!b.querySelector('svg'), w: b.offsetWidth, h: b.offsetHeight };
    });
    /* On the sky, not on a slab: the overlay is the hour's own gradient,
       the card draws no ground, and the arrow is a ring rather than a fill. */
    const look = await page.evaluate(() => {
      const rf = document.getElementById('cdRf'), c = document.querySelector('.cd-rf-c'), b = document.getElementById('cdReflOk');
      if (!rf || !c || !b) return null;
      const ring = getComputedStyle(b, '::before');
      return { sky: /gradient/.test(getComputedStyle(rf).backgroundImage), card: getComputedStyle(c).backgroundColor,
        fill: ring.backgroundColor, ring: ring.boxShadow };
    });
    ok('the thought sits on the sky with no card of its own, and the arrow is a ring',
      look && look.sky && /rgba\(0, 0, 0, 0\)|transparent/.test(look.card) && /rgba\(0, 0, 0, 0\)|transparent/.test(look.fill) && /inset/.test(look.ring), look);
    ok('it is put away by an arrow, named and at least 44px', go && go.text === '' && !!go.name && go.svg && go.w >= 44 && go.h >= 44, go);
    if (await page.$('#cdReflOk')) await page.click('#cdReflOk');
    ok('the arrow takes it out of the page', !(await page.$('#cdRf')));
    await page.reload(); await page.waitForTimeout(700);
    ok('and it does not come back the same day', !(await page.$('#cdRf')));
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdReflOpen'); await page.waitForTimeout(320);
    ok('Settings shows it again', (await page.textContent('#cdReflQ').catch(() => null)) === q1);
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    ok('Escape puts it away', !(await page.$('#cdRf')));
    ok('no page errors in the thought', errs.length === 0, errs);
    await c.close();
  }
  {
    /* A new date shows the next one, whatever the last one was. */
    const { c, page } = await ctx({ reflect: true, at: '2026-09-26T08:00:00', init: `localStorage.setItem('cad.refl.v1', JSON.stringify({ '2026-09-25': { s: 1 } }));` });
    const up = await page.waitForSelector('#cdRf', { timeout: 2000 }).then(() => true, () => false);
    ok('the next day opens on the next thought', up
      && (await page.textContent('#cdReflQ')) === await page.evaluate(() => window.cadence.reflect('2026-09-26')));
    await page.mouse.click(195, 40); await page.waitForTimeout(100);
    ok('a press outside the card puts it away', !(await page.$('#cdRf')));
    await c.close();
  }

  {
    /* A switch in Settings stops it arriving; the button beside it still
       shows today's. Both directions, because each passes on the other's
       bug: a switch that never stops it, and one that stops it for good. */
    const { c, page } = await ctx({ reflect: true, at: '2026-09-26T08:00:00' });
    await page.waitForSelector('#cdRf', { timeout: 2000 }).catch(() => {});
    await page.click('#cdReflOk').catch(() => {}); await page.waitForTimeout(100);
    await page.click('#cdGear'); await sheetUp(page);
    const on0 = await page.getAttribute('#cdRfOn', 'aria-pressed');
    ok('the morning thought is on until you turn it off', on0 === 'true', on0);
    await page.click('#cdRfOn');
    ok('the switch turns it off and says so', (await page.getAttribute('#cdRfOn', 'aria-pressed')) === 'false'
      && (await store(page, 'cad.rfoff.v1')) === true);
    await closeSheet(page);
    /* A new date, so the only thing keeping it away is the switch. */
    await page.evaluate(() => localStorage.setItem('cad.refl.v1', '{}'));
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(800);
    ok('turned off, a new open does not show it', !(await page.$('#cdRf')));
    /* On a build where it came up anyway, put it away so the next press
       reaches the gear: a check that crashes is not a check that fails. */
    if (await page.$('#cdRf')) { await page.click('#cdReflOk'); await page.waitForTimeout(100); }
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdReflOpen'); await page.waitForTimeout(200);
    ok('turned off, Today\u2019s thought still shows it on request', !!(await page.$('#cdRf')));
    await page.click('#cdReflOk'); await page.waitForTimeout(100);
    await page.click('#cdGear'); await sheetUp(page);
    await page.click('#cdRfOn');
    await closeSheet(page);
    await page.evaluate(() => localStorage.setItem('cad.refl.v1', '{}'));
    await page.reload({ waitUntil: 'load' });
    ok('turned back on, it comes back', await page.waitForSelector('#cdRf', { timeout: 2000 }).then(() => true, () => false));
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
    r = await P('Backtest charts in an hour');
    ok('"in an hour" counts from now, today, and leaves no word behind', r.s === 680 && r.e === 680 && r.n === 'Backtest charts' && r.days.join() === '4', r);
    r = await P('stretch in half an hour for 10 mins');
    ok('"in half an hour" is thirty minutes, and a stated length still counts', r.s === 650 && r.e === 660 && r.n === 'Stretch', r);
    r = await P('backtest charts in 1hr');
    ok('"in 1hr", run together, is an hour on', r.s === 680 && r.n === 'Backtest charts', r);
    r = await P('backtest charts in 45mins');
    ok('"in 45mins" is forty-five minutes on', r.s === 665 && r.n === 'Backtest charts', r);
    r = await P('read in 2 hours');
    ok('"in 2 hours" is two hours on', r.s === 740 && r.n === 'Read', r);
    r = await P('read in an hour at 3pm');
    ok('an explicit clock beats "in"', r.s === 900 && r.n === 'Read', r);
    r = await P('gym in 20 hours');
    ok('"in" past midnight is refused, not clamped', r.s === null && r.n === 'Gym', r);
    r = await P('stretch after training for 15 minutes');
    ok('"after training" finds the gym through the keyword table', r.s === 510 && r.e === 525 && r.n === 'Stretch' && r.after === 'Gym', r);
    r = await P('lunch after the concert');
    ok('an anchor it cannot place stays in the name', r.s === null && /concert/.test(r.n), r);
    r = await P('yoga every sat and sun at 9am for an hour');
    ok('days joined by "and", with a meridiem and "an hour"', r.days.join() === '5,6' && r.s === 540 && r.e === 600 && r.n === 'Yoga', r);

    const K = (n) => page.evaluate((n) => window.cadence.kind(n), n);
    ok('"work out" is training, not work', (await K('Work out')) === 'train' && (await K('Deep work')) === 'work');
    ok('"walk the dog" is a walk', (await K('Walk the dog')) === 'walk');
    /* The table reaches the names people actually type. Backtesting is
       charts and a warm-up is its own flame; a word the
       table cannot place stays the plain square rather than a guess. */
    const common = { 'Backtest charts': 'chart', 'Warm up': 'warm', 'Emails and calls': 'mail', 'Call mum': 'phone', 'Swim': 'swim',
      'Bike ride': 'cycle', 'Tennis': 'sport', 'Feed the dog': 'pet', 'Water plants': 'plant', 'Drink water': 'water', 'Podcast': 'listen',
      'Guitar': 'music', 'Coding': 'code', 'Journal': 'write', 'Sunlight': 'sun', 'Standup': 'talk', 'Budget': 'money', 'Plan the week': 'plan',
      'Meal prep': 'cook', 'Groceries': 'grocery', 'Laundry': 'laundry', 'Clean kitchen': 'clean', 'Shower': 'shower', 'Vitamins': 'meds',
      'Dentist': 'teeth', 'Family': 'people', 'Netflix': 'screen', 'Gaming': 'game', 'Hike': 'hike', 'Fishing': 'fish', 'Morning news': 'news', 'Brainstorm': 'idea', 'Sketch': 'art', 'Edit photos': 'photo',
      'Film content': 'film', 'Fly to Sydney': 'fly', 'Drive to work': 'car', 'Feed the baby': 'baby', 'Drinks with mates': 'drink',
      'Take out the bins': 'bin', 'Pack for trip': 'pack', 'Fix the sink': 'fix', 'Haircut': 'cut', 'Self care': 'heart', 'Birthday': 'gift',
      'Concert': 'ticket', 'Watch a show': 'screen',
      'Putting room together': 'furniture', 'Assemble IKEA desk': 'furniture', 'New sofa delivered': 'furniture', 'Move house': 'home',
      'Holiday': 'trip', 'Dance class': 'dance', 'Surf': 'surf', 'Beach day': 'beach',
      'Kmart': 'shop', 'Big W': 'shop', 'Westfield': 'shop', 'Op shop': 'shop', 'Coles': 'grocery', 'Woolies': 'grocery', 'Farmers market': 'grocery',
      'Check markets': 'chart', 'Bunnings run': 'fix', 'Parkrun': 'run', 'Footy': 'sport', 'BBQ': 'bbq', 'Camping': 'camp', 'Thredbo': 'ski',
      'School run': 'kids', 'Daycare pickup': 'kids', 'Tip run': 'bin', 'Coffee run': 'coffee', 'Bottle-o': 'drink', 'Maccas': 'eat', 'Rego': 'car',
      'Centrelink': 'money', 'Medicare': 'health', 'Chemist': 'meds', 'Uni': 'study', 'Zoo': 'ticket', 'Bushwalk': 'hike', 'Ferry': 'move',
      'Bubble bath': 'bath', 'Massage': 'bath', 'Brush teeth': 'teeth', 'Wedding': 'party', 'Birthday party': 'party', 'Baby shower': 'party',
      'Knitting': 'craft', 'Crossword': 'puzzle', 'Client presentation': 'present', 'Rest day': 'relax', 'Vote': 'vote', 'Stargazing': 'star',
      'Book club at Dave\'s': 'read', 'Qwerty': 'dot' };
    const got = {};
    for (const n of Object.keys(common)) got[n] = await K(n);
    ok('common task names reach their own kind, and the unplaceable stay plain', Object.keys(common).every((n) => got[n] === common[n]), got);
    {
      const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'cadence', 'index.html'), 'utf8');
      const kinds = [...src.match(/var KW = \[([\s\S]*?)\n  \];/)[1].matchAll(/\['(\w+)',/g)].map((m) => m[1]);
      const gsrc = src.match(/var GLYPH = \{([\s\S]*?)\n  \};/)[1];
      const glyph = Object.fromEntries([...gsrc.matchAll(/^\s+(\w+): '(.*)',?$/gm)].map((m) => [m[1], m[2]]));
      const cat = src.match(/var CAT = \{([\s\S]*?)\};/)[1];
      const vals = Object.values(glyph);
      ok('every kind has a glyph and a colour, and no two kinds draw the same glyph',
        kinds.length > 55 && kinds.every((k) => glyph[k] && new RegExp('\\b' + k + ': \'').test(cat)) && new Set(vals).size === vals.length,
        { kinds: kinds.length, missing: kinds.filter((k) => !glyph[k]) });
    }

    /* Through the sheet: the sentence fills the form, Add files the shape. */
    await page.click('#cdAdd');
    await sheetUp(page);
    await page.fill('.cd-say', 'journal daily 21:00 for 20 mins');
    ok('the preview says what it read', /Journal · every day · 21:00–21:20/.test(await page.textContent('#cdPrev')));
    ok('with reminders off the editor offers no reminder choice', !(await page.$('#cdFR')));
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
    /* At rest the composer is one line with nothing under it; touched, it
       opens; left empty, it shuts; left holding words, it stays open. */
    const nw = () => page.evaluate(() => ({ h: document.getElementById('cdNoteIn').getBoundingClientRect().height,
      row: !!document.querySelector('.cd-nw-r').getClientRects().length }));
    const nwRest = await nw();
    ok('the composer rests as one line with no controls under it', nwRest.h <= 46 && !nwRest.row, nwRest);
    await page.focus('#cdNoteIn');
    const nwOpen = await nw();
    ok('touching it opens it, controls and all', nwOpen.h >= 58 && nwOpen.row, nwOpen);
    await page.$eval('#cdNoteIn', (t) => t.blur());
    await page.waitForTimeout(40);
    const nwShut = await nw();
    ok('left empty, it shuts again', nwShut.h <= 46 && !nwShut.row, nwShut);
    await page.fill('#cdNoteIn', 'half a thought');
    await page.$eval('#cdNoteIn', (t) => t.blur());
    await page.waitForTimeout(40);
    ok('left holding words, it stays open', (await nw()).row);
    await page.fill('#cdNoteIn', '');
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

    /* The plus on Notes opens a blank page rather than the line at the
       top: a caret in a title, kept only once something is written. */
    ok('on Notes the plus says it makes a note', (await page.getAttribute('#cdAdd', 'aria-label')) === 'New note');
    await page.click('#cdAdd');
    /* A build where the plus does not open a page fails here by name
       rather than timing the file out. */
    const opened = await page.waitForSelector('#cdDoc.is-open', { timeout: 2000 }).then(() => true, () => false);
    ok('the plus on Notes opens a page', opened);
    if (opened) {
    const blank = await page.evaluate(() => {
      const ed = document.getElementById('cdDocEd'), s = getSelection();
      return { ks: [...ed.querySelectorAll('.cd-nb')].map((b) => b.dataset.k).join(), caret: ed.contains(s.anchorNode) && document.activeElement === ed,
        ph: getComputedStyle(ed.querySelector('.cd-nb'), '::before').content };
    });
    ok('it opens a blank page on a title, with the caret in it', blank.ks === 't' && blank.caret, blank);
    ok('and the empty title says what it is', blank.ph === '"Title"', blank.ph);
    ok('and the line composer is not what it focused', await page.evaluate(() => document.activeElement.id !== 'cdNoteIn'));
    await page.click('#cdDocBack');
    await page.waitForTimeout(80);
    ok('a page left blank leaves nothing behind', (await store(page, 'cad.note.v1')).length === 1);
    await page.click('#cdAdd');
    await page.waitForSelector('#cdDoc.is-open');
    await page.keyboard.type('Long run plan');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Easy for the first hour');
    await page.waitForTimeout(80);
    ok('the title loses its placeholder once written', (await page.$eval('#cdDocEd .cd-nb', (b) => getComputedStyle(b, '::before').content)) === 'none');
    await page.click('#cdDocBack');
    await page.waitForTimeout(80);
    const made = (await store(page, 'cad.note.v1')).filter((n) => /Long run/.test(n.t))[0];
    ok('a page written on is a note, today\'s, titled', made && made.d === '2026-09-25' && made.b[0].k === 't' && made.b[0].r[0][0] === 'Long run plan' && made.b.length === 2, made);
    }
    await page.click('.cd-tab[data-v="day"]');
    ok('everywhere else the plus still adds a block', (await page.getAttribute('#cdAdd', 'aria-label')) === 'Add a block');

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
    /* The body is a step down from the name and quieter, so the two never
       read as one size, whichever kind of line the name was. */
    const prev = await page.evaluate(() => ['dmg', 'old'].map((id) => {
      const c = document.querySelector('.cd-ni[data-n="' + id + '"]'), h = c.querySelector('.cd-nth'), b = c.querySelector('.cd-ntx');
      if (!h || !b) return null;
      const f = (e) => parseFloat(getComputedStyle(e).fontSize), a = (e) => { const m = getComputedStyle(e).color.match(/[\d.]+/g); return m.length > 3 ? +m[3] : 1; };
      return { id, h: h.textContent, b: b.textContent, hf: f(h), bf: f(b), hw: +getComputedStyle(h).fontWeight, ha: a(h), ba: a(b) };
    }));
    ok('a note\'s name leads, its body under it', prev[0] && prev[0].h === 'Kept heading' && prev[0].b === 'kept body' && prev[1] && prev[1].h === 'First line' && prev[1].b === 'Second line', prev);
    ok('the body is clearly smaller than the name, and quieter', prev.every((p) => p && p.hf - p.bf >= 4 && p.hw >= 700 && p.ba < p.ha), prev);
    await page.click('.cd-ni[data-n="old"] .cd-nt');
    await page.waitForSelector('#cdDoc.is-open');
    await page.waitForTimeout(320);
    const box = await page.$eval('#cdDoc', (d) => { const r = d.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
    ok('pressing a note opens its whole page', box.join() === '0,0,390,844', box);
    /* A note is a page of the app, so it wears the app's sky rather than a
       flat ground: the same gradient body draws, and on pixels the foot of
       the page lighter than just under its head — which a flat ground can
       never be. The head is a slice of the same sky. */
    const dsky = await page.evaluate(() => {
      const bi = (e) => getComputedStyle(e).backgroundImage;
      return { body: bi(document.body), doc: bi(document.getElementById('cdDoc')), top: bi(document.querySelector('.cd-doc-top')) };
    });
    const dpx = await shoot(page);
    const hb = await page.$eval('.cd-doc-top', (e) => e.getBoundingClientRect().bottom);
    const lum = (c) => c[0] + c[1] + c[2];
    ok('an open note has the same sky as the other pages', dsky.doc === dsky.body && dsky.top.indexOf(dsky.body) === 0 && lum(dpx(4, 836)) > lum(dpx(4, hb + 6)) + 12, { dsky, top: dpx(4, hb + 6), foot: dpx(4, 836) });
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

    /* Underline is its own mark: it reaches the way a colour does and
       keeps whatever colour the words already wear. */
    await page.keyboard.press('Home');
    for (let i = 0; i < 6; i++) await page.keyboard.press('Shift+ArrowRight');
    await page.click('#cdDocU');
    await settle();
    b = await rec();
    ok('underline takes exactly the words selected', JSON.stringify(b[2].r) === '[["Second","",1],[" ",""],["line","p"]]', b[2]);
    const ul = await page.$eval(`${ed} .cd-nb >> nth=2`, (e) => { const u = e.querySelector('u'); return u && { t: u.textContent, d: getComputedStyle(u).textDecorationLine }; }).catch(() => null);
    ok('and it is drawn as an underline', ul && ul.t === 'Second' && /underline/.test(ul.d), ul);
    await page.keyboard.press('End');
    for (let i = 0; i < 4; i++) await page.keyboard.press('Shift+ArrowLeft');
    await page.click('#cdDocU');
    await settle();
    ok('it keeps the colour it lands on', JSON.stringify((await rec())[2].r) === '[["Second","",1],[" ",""],["line","p",1]]', (await rec())[2]);
    ok('and says it is on', (await page.getAttribute('#cdDocU', 'aria-pressed')) === 'true');
    await page.click('#cdDocU');
    await settle();
    ok('pressed again it comes off and the colour stays', JSON.stringify((await rec())[2].r) === '[["Second","",1],[" ",""],["line","p"]]', (await rec())[2]);
    const hlRow = await page.$$eval('#cdDocHl > *', (xs) => xs.map((x) => x.getBoundingClientRect()).map((r) => [Math.round(r.left), Math.round(r.right), Math.round(r.height)]));
    ok('the tool row still fits the phone with every control at 44', hlRow.length === 8 && hlRow.every((r) => r[0] >= 0 && r[1] <= 390 && r[1] - r[0] >= 44 && r[2] >= 44), hlRow);

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
    ok('and the join leaves nothing on the page the record cannot say', (await page.$$eval(`${ed} *`, (es) => es.filter((e) => !/^(DIV|MARK|U|BR|FIGURE|IMG|BUTTON|svg|path)$/.test(e.tagName)).length)) === 0);

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

    /* The backup carries the picture, and restoring puts it back in the
       database before the note that names it loads. The blob is deleted
       first, so a restore that skipped the pictures leaves an empty box. */
    await page.click('#cdDocBack'); await page.waitForTimeout(200);
    await page.click('#cdGear'); await sheetUp(page);
    await page.evaluate(() => {
      navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
      navigator.clipboard.write = (items) => items[0].getType('text/plain').then((b) => b.text()).then((t) => { window.__copied = t; });
    });
    await page.click('#cdBak');
    await page.waitForFunction(() => !!window.__copied, null, { timeout: 3000 }).catch(() => {});
    const pbak = JSON.parse((await page.evaluate(() => window.__copied)) || '{}');
    ok('a backup carries the pictures a note names, as images', !!pbak.pic && /^data:image\//.test(pbak.pic[pic.p] || '') && Object.keys(pbak.pic).length === 1, Object.keys(pbak.pic || {}));
    await page.evaluate((k) => new Promise((res) => { const rq = indexedDB.open('cad.pic', 1); rq.onsuccess = () => { const tx = rq.result.transaction('p', 'readwrite'); tx.objectStore('p').delete(k); tx.oncomplete = res; }; }), pic.p);
    await page.fill('#cdRestore', JSON.stringify(pbak));
    await Promise.all([page.waitForNavigation(), page.click('#cdRestoreGo')]);
    await page.waitForTimeout(200);
    const back = await page.evaluate((k) => new Promise((res) => { const rq = indexedDB.open('cad.pic', 1); rq.onsuccess = () => { const g = rq.result.transaction('p').objectStore('p').get(k); g.onsuccess = () => res(g.result ? g.result.size : 0); }; }), pic.p);
    ok('and restoring puts the picture back in the database', back > 0, back);
    await page.click('.cd-tab[data-v="note"]');
    await page.click('.cd-ni[data-n="old"] .cd-nt');
    await page.waitForSelector('#cdDoc.is-open');
    await page.waitForFunction(() => { const i = document.querySelector('.cd-nb-i img'); return i && i.naturalWidth > 0; }, null, { timeout: 3000 }).catch(() => {});
    ok('so the restored note draws it', (await page.$eval('.cd-nb-i img', (i) => i.naturalWidth)) === 2);
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
    await page.evaluate(() => {
      navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
      navigator.clipboard.write = (items) => items[0].getType('text/plain').then((b) => b.text()).then((t) => { window.__copied = t; });
    });
    await page.click('#cdBak');
    await page.waitForFunction(() => !!window.__copied, null, { timeout: 3000 }).catch(() => {});
    const bak = JSON.parse(await page.evaluate(() => window.__copied));
    ok('a backup carries every record', bak.app === 'cadence' && ['week', 'log', 'hab', 'train', 'defs', 'note', 'refl'].every((k) => k in bak) && !('goal' in bak) && !('off' in bak), Object.keys(bak));
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

  /* ── the desktop: the figure on the left, the list on the right ── */
  {
    const { c, page, errs } = await ctx({ desk: { width: 1440, height: 900 } });
    const box = (sel) => page.$eval(sel, (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; });
    const hero = await box('#cdHero'), list = await box('#cdAgenda'), go = await box('#cdGo'), sec = await box('#cdVDay');
    ok('on a desktop the day is two columns, the figure left of the list', hero.r <= list.l && hero.b > list.t && list.w > 400, { hero, list });
    ok('the check sits under the figure, not under the list', Math.abs((go.l + go.r) / 2 - (hero.l + hero.r) / 2) <= 2 && go.r < list.l, { go, hero });
    /* Close under the block it keeps, not parked at the foot of the
       column half a screen away from the name it acts on. */
    const goT = await page.$eval('#cdGo .cd-go-t', (t) => ({ shown: t.getBoundingClientRect().width > 0, txt: t.textContent }));
    ok('on a desktop the check hangs just under the figure', go.t - hero.b >= 12 && go.t - hero.b <= 48, { gap: go.t - hero.b });
    ok('...and it is a pill with a word in it', go.w > go.h * 2 && go.h >= 44 && goT.shown && goT.txt === 'Complete', { go, goT });
    /* The figure stays where it is while the list scrolls past it. */
    await page.evaluate(() => { const L = document.getElementById('cdAgenda'); for (let i = 0; i < 3; i++) L.appendChild(L.lastElementChild.cloneNode(true)); for (let i = 0; i < 12; i++) L.appendChild(L.children[i % 7].cloneNode(true)); });
    await page.$eval('#cdDayPane', (p) => { p.scrollTop = 400; });
    await page.waitForTimeout(100);
    const hero2 = await box('#cdHero'), sc = await page.$eval('#cdDayPane', (p) => p.scrollTop);
    ok('the figure holds still while the list scrolls', sc > 200 && Math.abs(hero2.t - hero.t) <= 1, { sc, before: hero.t, after: hero2.t });
    await page.click('.cd-tab[data-v="hab"]');
    const ht = await box('#cdVHab .cd-hero'), hl = await box('#cdHab');
    ok('habits are two columns too', ht.r <= hl.l && ht.b > hl.t, { ht, hl });
    await page.click('.cd-tab[data-v="note"]');
    const nt = await box('#cdVNote .cd-hero'), nw = await box('#cdVNote .cd-nw'), nl = await box('#cdNotes');
    ok('the composer sits under the notes figure, left of the notes', nw.t >= nt.b && nw.t - nt.b < 60 && nw.r <= nl.l, { nt, nw, nl });
    await page.click('.cd-tab[data-v="mon"]');
    const mg = await box('#cdMonG');
    ok('the month keeps one column and gains room', mg.w >= 700 && mg.w <= 860, mg);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok('nothing runs off the side of a desktop', wide <= 0, wide);
    /* A sheet from the foot of a tall screen is a long reach for a
       pointer: here it is a dialog in the middle. */
    await page.click('.cd-tab[data-v="day"]');
    await page.click('#cdAdd');
    await sheetUp(page); await page.waitForTimeout(350);
    const sh = await box('#cdSheet');
    ok('a sheet is a dialog in the middle of a desktop', Math.abs((sh.t + sh.b) / 2 - 450) <= 2 && sh.b < 900 - 20 && Math.abs((sh.l + sh.r) / 2 - 720) <= 1, sh);
    await closeSheet(page);
    ok('no page errors on a desktop', errs.length === 0, errs);
    await c.close();

    /* And the phone is untouched: the list still runs under the figure. */
    const ph = await ctx();
    const h = await ph.page.$eval('#cdHero', (e) => e.getBoundingClientRect()), l = await ph.page.$eval('#cdAgenda', (e) => e.getBoundingClientRect());
    ok('on a phone the list still runs under the figure', l.top >= h.bottom, { h: h.bottom, l: l.top });
    const pg = await ph.page.$eval('#cdGo', (b) => { const r = b.getBoundingClientRect(), t = b.querySelector('.cd-go-t').getBoundingClientRect(); return { w: r.width, h: r.height, t: t.width, bot: innerHeight - r.bottom }; });
    ok('on a phone the check is still the round button at the thumb, with no word', Math.abs(pg.w - pg.h) < 1 && pg.t === 0 && pg.bot < 60, pg);
    await ph.c.close();
  }

  /* ── sync: one record on two devices, sealed before it leaves ──
     The real worker file runs here against a Map, and both contexts'
     requests to its URL are answered by it, so the round trip is the
     shipped client against the shipped server with nothing in between
     but a fake KV. The vault is decrypted HERE with the code alone —
     which proves the id and the key come from the code the way the app
     says, and that nothing else is needed to read it. */
  {
    const path = require('path');
    const worker = (await import('file://' + path.resolve(__dirname, '..', 'worker', 'index.js'))).default;
    const m = new Map();
    const env = { SCHED: { async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } } };
    const SYNC = 'https://sched.nikorapullin.workers.dev';
    const wire = async (c) => c.route(SYNC + '/**', async (route) => {
      const q = route.request();
      const res = await worker.fetch(new Request(q.url(), { method: q.method(), headers: q.headers(), body: q.postData() || undefined }), env);
      const h = {}; res.headers.forEach((v, k) => { h[k] = v; });
      await route.fulfill({ status: res.status, headers: h, body: await res.text() });
    });
    const until = async (fn, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = await fn(); if (v) return v; await new Promise((r) => setTimeout(r, 150)); } return null; };
    const vaultRec = () => { for (const [k, v] of m) if (k.startsWith('vault:')) return { k, v: JSON.parse(v) }; return null; };
    const openVault = async (code) => {
      const enc = new TextEncoder();
      const norm = code.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
      const base = await crypto.subtle.importKey('raw', enc.encode(norm), 'PBKDF2', false, ['deriveBits']);
      const b = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('cadence.sync.v1'), iterations: 150000, hash: 'SHA-256' }, base, 512));
      const id = Buffer.from(b.slice(32, 48)).toString('hex');
      const key = await crypto.subtle.importKey('raw', b.slice(0, 32), 'AES-GCM', false, ['decrypt']);
      const raw = m.get('vault:' + id); if (!raw) return null;
      const rec = JSON.parse(raw);
      /* A vault that does not decrypt FAILS the check that asked, never
         takes the file down: a throw here would read as a broken build. */
      try {
        const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(rec.iv, 'base64') }, key, Buffer.from(rec.ct, 'base64'));
        return { rev: rec.rev, data: JSON.parse(new TextDecoder().decode(pt)) };
      } catch (e) { return null; }
    };
    const notesOf = (page) => page.evaluate(() => localStorage.getItem('cad.note.v1') || '');
    const addNote = async (page, text) => {
      await page.click('.cd-tab[data-v="note"]');
      await page.fill('#cdNoteIn', text);
      await page.click('#cdNoteGo');
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
    };

    const phone = await ctx(); await wire(phone.c);
    const pp = phone.page;
    const before = phone.off.length;
    await pp.click('#cdGear'); await sheetUp(pp);
    ok('sync is off until you turn it on, and nothing has left', !!(await pp.$('#cdSyncOn')) && phone.off.length === before && m.size === 0, { off: phone.off });
    await pp.click('#cdSyncOn'); await pp.waitForTimeout(350);
    await pp.click('#cdSyncSuggest');
    await pp.click('#cdSyncMake');
    await pp.waitForSelector('#cdSyncCodeShow', { timeout: 15000 });
    const shown = (await pp.textContent('#cdSyncCodeShow')).trim();
    const code = shown.replace(/-/g, '');
    ok('turning it on shows a sixteen-character code in fours', /^[2-9A-HJKMNP-Z]{4}(-[2-9A-HJKMNP-Z]{4}){3}$/.test(shown), shown);
    const v1 = vaultRec();
    ok('the first copy lands as revision 1', v1 && v1.v.rev === 1, v1 && v1.v.rev);
    const plain = JSON.stringify(await pp.evaluate(() => localStorage.getItem('cad.week.v1')));
    const blockName = JSON.parse(JSON.parse(plain))[0].n;
    /* Read through the base64, because base64 of plain JSON hides a
       name from a string search as well as encryption does. */
    const seen = (v) => Buffer.from(v.ct, 'base64').toString('latin1');
    ok('the server holds ciphertext: not one block name is readable in it', !seen(v1.v).includes(blockName) && !JSON.stringify(v1.v).includes(blockName), blockName);
    const o1 = await openVault(code);
    ok('the code alone opens the vault, and it is the whole backup', o1 && o1.data.app === 'cadence' && Array.isArray(o1.data.week) && o1.data.week.length > 0);
    ok('the code itself never leaves: it is not in what the server stores', !JSON.stringify(v1.v).toLowerCase().includes(code.toLowerCase()), '');
    await closeSheet(pp);

    /* A change on the phone is pushed without being asked. */
    await pp.click('#cdGear'); await sheetUp(pp);
    await pp.click('#cdRfOn');
    await closeSheet(pp);
    const r2 = await until(() => { const v = vaultRec(); return v && v.v.rev >= 2 && v.v.rev; });
    ok('a change is pushed by itself', r2 === 2, r2);

    /* The desktop joins with the code and gets the phone's record. */
    const desk = await ctx({ desk: { width: 1440, height: 900 } }); await wire(desk.c);
    const dp = desk.page;
    await dp.click('#cdGear'); await sheetUp(dp);
    await dp.click('#cdSyncOn'); await dp.waitForTimeout(350);
    await dp.fill('#cdSyncCode', shown.toLowerCase());
    await Promise.all([dp.waitForEvent('load', { timeout: 15000 }), dp.click('#cdSyncJoin')]);
    await dp.waitForTimeout(300);
    const deskRf = await dp.evaluate(() => localStorage.getItem('cad.rfoff.v1'));
    const same = await dp.evaluate(() => localStorage.getItem('cad.week.v1')) === await pp.evaluate(() => localStorage.getItem('cad.week.v1'));
    ok('joining on the desktop brings the phone\'s record, typed in any case', deskRf === 'true' && same, { deskRf, same });

    /* The desktop writes; the phone picks it up when it comes back to the front. */
    await addNote(dp, 'Written at the desk');
    const r3 = await until(() => { const v = vaultRec(); return v && v.v.rev >= 3 && v.v.rev; });
    ok('the desktop\'s note is pushed', r3 === 3, r3);
    ok('...and it is sealed too', !seen(vaultRec().v).includes('Written at the desk'));
    await Promise.all([pp.waitForEvent('load', { timeout: 15000 }), pp.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))]);
    await pp.waitForTimeout(300);
    ok('the phone picks it up when it comes back to the front', (await notesOf(pp)).includes('Written at the desk'));

    /* Both write before either has seen the other: merged, not lost. */
    await addNote(dp, 'Desk second');
    await until(() => vaultRec().v.rev >= 4);
    await addNote(pp, 'Phone second');
    await pp.waitForEvent('load', { timeout: 20000 }).catch(() => null);
    const merged = await until(async () => { const o = await openVault(code); const t = o && JSON.stringify(o.data.note); return t && t.includes('Desk second') && t.includes('Phone second') && o; }, 20000);
    const phoneNotes = await notesOf(pp);
    ok('two devices writing at once are merged rather than one thrown away',
      !!merged && phoneNotes.includes('Desk second') && phoneNotes.includes('Phone second') && phoneNotes.includes('Written at the desk'),
      { rev: merged && merged.rev, phone: phoneNotes.slice(0, 200) });

    /* A picture goes beside the record, sealed on its own, and the other
       device fetches it; taking the picture out of the note takes it off
       the server. Read through the base64: a JPEG begins FF D8. */
    const idbHas = (page, k) => page.evaluate((k) => new Promise((res) => { const rq = indexedDB.open('cad.pic', 1); rq.onupgradeneeded = () => rq.result.createObjectStore('p'); rq.onsuccess = () => { const g = rq.result.transaction('p').objectStore('p').get(k); g.onsuccess = () => res(g.result ? g.result.size : 0); }; }), k).catch(() => 0);
    const picRecs = () => [...m.keys()].filter((k) => k.startsWith('vpic:'));
    await pp.click('.cd-tab[data-v="note"]');
    await pp.click('.cd-ni .cd-nt');
    await pp.waitForSelector('#cdDoc.is-open');
    const png2 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR42mNk+M9QzwAEjDAGACCDAv8cI7IoAAAAAElFTkSuQmCC', 'base64');
    await pp.setInputFiles('#cdDocFile', { name: 'a.png', mimeType: 'image/png', buffer: png2 });
    await pp.waitForSelector('#cdDoc .cd-nb-i');
    await pp.click('#cdDocBack'); await pp.waitForTimeout(200);
    const upKey = await until(() => picRecs()[0]);
    const pk = upKey && upKey.split(':')[2];
    const sealedPic = upKey && JSON.parse(m.get(upKey));
    ok('a picture in a note goes to the server on its own', !!upKey && /^p/.test(pk) && JSON.parse(m.get('vpix:' + upKey.split(':')[1])).includes(pk), picRecs());
    ok('...sealed: what the server holds is not a picture', !!sealedPic && Buffer.from(sealedPic.ct, 'base64')[0] !== 0xff && !(await notesOf(pp)).includes(sealedPic.ct.slice(0, 40)));
    ok('...and the record the vault holds names it without carrying it', !!pk && !JSON.stringify(vaultRec().v).includes(sealedPic.ct.slice(0, 40)));
    /* A picture that never went up leaves nothing for the rest to measure:
       fail by name rather than wait out every step on an undefined key. */
    if (pk) {
    await until(async () => { const o = await openVault(code); return o && JSON.stringify(o.data.note).includes(pk); });
    await dp.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    const deskPic = await until(async () => (await idbHas(dp, pk)) || false, 20000);
    ok('the other device fetches the picture and keeps it', deskPic > 0, deskPic);
    await pp.click('.cd-ni .cd-nt');
    await pp.waitForSelector('#cdDoc.is-open');
    await pp.click('#cdDoc .cd-nb-x');
    await pp.click('#cdDocBack'); await pp.waitForTimeout(200);
    const gonePic = await until(() => !picRecs().length);
    ok('taking the picture out of the note takes it off the server', !!gonePic, picRecs());
    } else ok('the other device fetches the picture, and deleting it takes it off the server', false, 'nothing went up');

    const ids = JSON.parse(await notesOf(pp)).map((n) => n.id);
    ok('two devices never mint one id, even on one frozen clock', ids.length === new Set(ids).size, ids);

    /* A code nobody has used is refused by name, and changes nothing. */
    const other = await ctx(); await wire(other.c);
    const op = other.page;
    await op.click('#cdGear'); await sheetUp(op);
    await op.click('#cdSyncOn'); await op.waitForTimeout(350);
    await op.fill('#cdSyncCode', 'ABCD-EFGH-JKMN-PQRS');
    await op.click('#cdSyncJoin');
    const said = await until(async () => { const t = await op.textContent('#cdToastT'); return /Nothing is synced/.test(t) && t; });
    ok('a code nobody has used says so and changes nothing', !!said && !(await op.evaluate(() => localStorage.getItem('cad.sync.v1'))), said);
    await other.c.close();

    /* Deleting the synced copy takes it off the server, and the other device lets go. */
    await pp.click('#cdGear'); await sheetUp(pp);
    await pp.click('#cdSyncOff'); await pp.waitForTimeout(350);
    await pp.click('#cdSyncOffAll');
    await until(async () => !vaultRec() && !(await pp.evaluate(() => localStorage.getItem('cad.sync.v1'))));
    ok('deleting the synced copy removes it from the server', !vaultRec() && !(await pp.evaluate(() => localStorage.getItem('cad.sync.v1'))));
    ok('...and this device keeps everything it had', (await notesOf(pp)).includes('Phone second'), JSON.parse(await notesOf(pp)).map((n) => n.id + ':' + n.t.slice(0, 20)));
    await dp.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    const let_go = await until(async () => !(await dp.evaluate(() => localStorage.getItem('cad.sync.v1'))));
    ok('the other device notices and turns sync off, keeping its record', !!let_go && (await notesOf(dp)).includes('Desk second'));
    /* A 409 is the protocol saying the other device moved first and a
       404 is a vault that was deleted — both are answers the client acts
       on, and Chromium logs any non-2xx as a console error with no URL
       in it. Those two, and only those, are the sync's own. */
    const real = (e) => e.filter((t) => !/status of (409|404)/.test(t));
    ok('no page errors while syncing', real(phone.errs).length === 0 && real(desk.errs).length === 0, { p: phone.errs, d: desk.errs });
    await phone.c.close(); await desk.c.close();

    /* A code you choose: long enough, typed any way, and never one
       somebody already has — taking it would hand you their record. */
    const setup = async (page) => { await page.click('#cdGear'); await sheetUp(page); await page.click('#cdSyncOn'); await page.waitForTimeout(350); };
    const A = await ctx(); await wire(A.c);
    await setup(A.page);
    await A.page.fill('#cdSyncMine', 'short code');
    const shortOff = await A.page.$eval('#cdSyncMake', (b) => b.disabled);
    await A.page.fill('#cdSyncMine', 'Rex and the morning run');
    const longOn = !(await A.page.$eval('#cdSyncMake', (b) => b.disabled));
    ok('a chosen code under twelve letters cannot be used, and a long one can', shortOff && longOn, { shortOff, longOn });
    await A.page.click('#cdSyncMake');
    await A.page.waitForSelector('#cdSyncCodeShow', { timeout: 15000 });
    const mineShown = (await A.page.textContent('#cdSyncCodeShow')).trim();
    ok('a chosen code is shown the way you typed it, and opens the vault',
      mineShown === 'Rex and the morning run' && !!(await openVault('Rex and the morning run')), mineShown);
    const B2 = await ctx({ desk: { width: 1280, height: 800 } }); await wire(B2.c);
    await setup(B2.page);
    await B2.page.fill('#cdSyncCode', 'rex AND the morning-run');
    await Promise.all([B2.page.waitForEvent('load', { timeout: 15000 }), B2.page.click('#cdSyncJoin')]);
    const joined = await B2.page.evaluate(() => JSON.parse(localStorage.getItem('cad.sync.v1') || 'null'));
    ok('it is joined however the capitals, spaces and dashes fall', joined && joined.code === 'rexandthemorningrun', joined);
    const C3 = await ctx(); await wire(C3.c);
    await setup(C3.page);
    await C3.page.fill('#cdSyncMine', 'REX and the Morning Run!');
    await C3.page.click('#cdSyncMake');
    const taken = await until(async () => { const t = await C3.page.textContent('#cdToastT'); return /already in use/.test(t) && t; });
    ok('a code somebody already has is refused rather than taken', !!taken && !(await C3.page.evaluate(() => localStorage.getItem('cad.sync.v1'))), taken);
    ok('no page errors choosing a code', real(A.errs).length === 0 && real(B2.errs).length === 0 && real(C3.errs).length === 0, { a: A.errs, b: B2.errs, c: C3.errs });
    await A.c.close(); await B2.c.close(); await C3.c.close();
  }

  /* ── reminders: sent at the minute, sealed on the phone ──
     iOS lets a page show a notification and never schedule one, so the
     worker sends them. The whole claim is that it can do that without
     reading them: the test is the phone's own push keys, generated HERE,
     so the queue is decrypted in this process the way the phone's
     browser would and nowhere else. The push service itself is faked at
     the page (headless Chromium has none) and at the worker's fetch. */
  {
    const path = require('path'), fs = require('fs');
    const worker = (await import('file://' + path.resolve(__dirname, '..', 'worker', 'index.js'))).default;
    const m = new Map();
    const env = { SCHED: { async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } } };
    const SYNC = 'https://sched.nikorapullin.workers.dev', EP = 'https://web.push.apple.com/QTEST';
    /* The page is frozen at 10:20 on the 25th and the worker throws
       away anything already gone by ITS clock, so the two are frozen
       together — the sync section's own rule. */
    const F = new Date('2026-09-25T10:20:00').getTime(), realNow = Date.now;
    Date.now = () => F;
    const ua = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    const uaPub = new Uint8Array(await crypto.subtle.exportKey('raw', ua.publicKey)), auth = crypto.getRandomValues(new Uint8Array(16));
    const init = `(() => {
      const pub = new Uint8Array(${JSON.stringify(Array.from(uaPub))}).buffer, au = new Uint8Array(${JSON.stringify(Array.from(auth))}).buffer;
      window.__subOpts = null; window.__unsub = 0;
      if (window.Notification) Notification.requestPermission = () => Promise.resolve('granted');
      if (window.PushManager) {
        PushManager.prototype.subscribe = function (o) { window.__subOpts = { uv: o.userVisibleOnly, k: Array.from(new Uint8Array(o.applicationServerKey)) };
          window.__sub = { endpoint: '${EP}', getKey: (n) => n === 'p256dh' ? pub : au, unsubscribe: () => { window.__unsub++; window.__sub = null; return Promise.resolve(true); } };
          return Promise.resolve(window.__sub); };
        PushManager.prototype.getSubscription = function () { return Promise.resolve(window.__sub || null); };
      }
    })();`;
    const P = await ctx({ init });
    const pushReqs = [];
    await P.c.route(SYNC + '/**', async (route) => {
      const q = route.request();
      pushReqs.push(q.method() + ' ' + new globalThis.URL(q.url()).pathname);
      const res = await worker.fetch(new Request(q.url(), { method: q.method(), headers: q.headers(), body: q.postData() || undefined }), env);
      const h = {}; res.headers.forEach((v, k) => { h[k] = v; });
      await route.fulfill({ status: res.status, headers: h, body: await res.text() });
    });
    const page = P.page;
    const until = async (fn, ms = 15000) => { const t = realNow(); while (realNow() - t < ms) { const v = await fn(); if (v) return v; await new Promise((r) => setTimeout(r, 150)); } return null; };
    const queueKey = () => [...m.keys()].find((k) => /^push:[0-9a-f]{32}$/.test(k));

    await page.waitForTimeout(1800);
    ok('reminders are off until you turn them on, and nothing has asked the server', pushReqs.length === 0 && !queueKey()
      && !(await page.evaluate(() => localStorage.getItem('cad.push.v1'))), pushReqs);
    await page.click('#cdGear'); await sheetUp(page);
    ok('Settings has a reminders switch, off', (await page.getAttribute('#cdPushOn', 'aria-pressed')) === 'false');
    await page.click('#cdPushOn');
    await page.waitForTimeout(350);
    const consent = await page.evaluate(() => ({ t: document.getElementById('cdShT').textContent, n: (document.querySelector('#cdShB .cd-note') || {}).textContent || '' }));
    ok('turning it on first says what leaves: the times, and nothing the server can read',
      /Remind me/.test(consent.t) && /times your blocks start/.test(consent.n) && /cannot read/.test(consent.n) && pushReqs.length === 0, consent);
    await page.click('#cdPushGo');
    const qk = await until(() => queueKey());
    ok('Turn on queues the next two weeks on the server', !!qk, [...m.keys()]);
    const toastT = await until(async () => { const t = await page.textContent('#cdToastT'); return /Reminders on/.test(t) && t; });
    ok('and says so', !!toastT, toastT);

    const keyRes = await worker.fetch(new Request(SYNC + '/v1/push/key'), env);
    const vapidPub = (await keyRes.json()).key;
    const u8 = (t) => new Uint8Array(Buffer.from(t.replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
    const so = await page.evaluate(() => window.__subOpts);
    ok('it subscribes with the worker\'s own signing key, for visible notifications only',
      !!so && so.uv === true && Buffer.from(so.k).equals(Buffer.from(u8(vapidPub))), so);

    const rec = qk ? JSON.parse(m.get(qk)) : { q: [] };
    const week = await store(page, 'cad.week.v1');
    const raw = qk ? m.get(qk) : '';
    /* Read THROUGH the base64: base64 of plain JSON hides a name from a
       string search exactly as well as encryption does, which is the
       sync check's own lesson. */
    const plain = raw + rec.q.map((x) => Buffer.from(x.b.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('latin1')).join('');
    /* Quoted, the way a name would sit in the JSON if it went out
       unsealed. Bare, a three-letter name like Gym turns up by chance in
       a hundred and seventy messages of random bytes. */
    const leaked = week.map((b) => b.n).filter((n) => plain.includes(JSON.stringify(n)));
    ok('the queue carries no block name the server could read', rec.ep === EP && rec.q.length > 0 && leaked.length === 0, { leaked, n: rec.q.length });

    /* RFC 8291, undone the way the phone's browser would. */
    const hk = async (salt, ikm, info, len) => new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info },
      await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']), len * 8));
    const open = async (b64) => {
      const b = u8(b64), salt = b.slice(0, 16), idlen = b[20], asPub = b.slice(21, 21 + idlen), ct = b.slice(21 + idlen);
      const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: await crypto.subtle.importKey('raw', asPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []) }, ua.privateKey, 256));
      const te = new TextEncoder(), cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let at = 0; a.forEach((x) => { o.set(x, at); at += x.length; }); return o; };
      const ikm = await hk(auth, ecdh, cat(te.encode('WebPush: info\0'), uaPub, asPub), 32);
      const cek = await hk(salt, ikm, te.encode('Content-Encoding: aes128gcm\0'), 16), nonce = await hk(salt, ikm, te.encode('Content-Encoding: nonce\0'), 12);
      const pt = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt']), ct));
      let end = pt.length - 1; while (end > 0 && pt[end] === 0) end--;
      return pt[end] === 2 ? JSON.parse(Buffer.from(pt.slice(0, end)).toString()) : null;
    };
    /* Every message opened, the way the phone would, each with its time.
       Tags say what a message is: `date.id` a block starting, `.ask` the
       question after it ends, `.th` a thought on a day with no reminder
       to ride. */
    const openAll = async () => { const r = JSON.parse(m.get(qk) || '{"q":[]}'); const out = []; for (const x of r.q) { const o = await open(x.b).catch(() => null); if (o) out.push(Object.assign({ at: x.t }, o)); } return out; };
    const all0 = await openAll();
    const isStart = (o) => /^\d{4}-\d\d-\d\d\.[^.]+$/.test(o.g);
    const firstStart = all0.find(isStart);
    const lunchAt = await page.evaluate(() => new Date(2026, 8, 25, 12, 30).getTime());
    ok('the first block reminder is the next block to start, at its minute, and only this phone can read it',
      all0.length === rec.q.length && !!firstStart && firstStart.t === 'Lunch' && /^Now · until \d\d:\d\d/.test(firstStart.b) && firstStart.at === lunchAt, { firstStart, lunchAt });
    ok('and the queue is soonest first, which is how the server reads it', rec.q.every((x, i) => !i || rec.q[i - 1].t <= x.t));
    const want = await page.evaluate((F) => {
      const wk = JSON.parse(localStorage.getItem('cad.week.v1')); let n = 0;
      for (let i = 0; i < 14; i++) { const d = new Date(2026, 8, 25 + i), dw = (d.getDay() + 6) % 7;
        wk.forEach((b) => { if (b.d.includes(dw) && new Date(2026, 8, 25 + i, 0, b.s).getTime() > F + 30e3) n++; }); }
      return n;
    }, F);
    ok('and there is one for every block start in the fourteen days', all0.filter(isStart).length === want, { got: all0.filter(isStart).length, want });

    /* The minute timer, at Lunch: the sealed bytes go to the push
       service, and they open to Lunch. */
    const realFetch = globalThis.fetch, sent = [];
    globalThis.fetch = async (u, o) => { sent.push({ u: String(u), b: new Uint8Array(o.body) }); return new Response('', { status: 201 }); };
    await worker.scheduled({ scheduledTime: lunchAt + 5000 }, env, { waitUntil() {} });
    globalThis.fetch = realFetch;
    const got = sent[0] ? await open(Buffer.from(sent[0].b).toString('base64')).catch(() => null) : null;
    ok('at 12:30 the worker sends it to the phone\'s push service, still sealed, and it opens to Lunch',
      sent.length === 1 && sent[0].u === EP && !!got && got.t === 'Lunch', { n: sent.length, got });

    /* A change to the week re-queues it, within a couple of seconds. */
    await closeSheet(page);
    await page.click('#cdAdd'); await sheetUp(page);
    await page.fill('.cd-say', 'stretch today 15:15 for 10 mins');
    await page.click('#cdFSave');
    const redone = await until(async () => { const r = JSON.parse(m.get(qk) || '{"q":[]}'); for (const x of r.q) { const o = await open(x.b).catch(() => null); if (o && o.t === 'Stretch') return x; } return null; }, 8000);
    const stretchAt = await page.evaluate(() => new Date(2026, 8, 25, 15, 15).getTime());
    ok('a block added to the week is queued without being asked', !!redone && redone.t === stretchAt, redone && redone.t);

    /* Each block says how early its reminder comes. Lunch set to ten
       minutes early is queued at 12:20 and says so; set to Off it is not
       queued at all. Both halves, because a build that ignored the
       setting passes neither and one that could only switch it off
       passes the second alone. */
    const lunchRow = async () => (await page.$$('.cd-it')).length && page.evaluate(() => {
      const it = [...document.querySelectorAll('.cd-it')].find((x) => x.querySelector('.cd-rn') && x.querySelector('.cd-rn').textContent === 'Lunch');
      return it ? it.dataset.id : null;
    });
    const findLunch = async () => { const r = JSON.parse(m.get(qk) || '{"q":[]}'); const out = []; for (const x of r.q) { const o = await open(x.b).catch(() => null); if (o && o.t === 'Lunch') out.push({ t: x.t, b: o.b }); } return out; };
    const setLead = async (lead) => {
      const lid = await lunchRow();
      if (!lid) return false;
      await page.click(`.cd-it[data-id="${lid}"] .cd-rb`); await sheetUp(page);
      if (!(await page.$(`#cdFR [data-r="${lead}"]`))) { await closeSheet(page); return false; }
      await page.click(`#cdFR [data-r="${lead}"]`);
      const pressed = await page.getAttribute(`#cdFR [data-r="${lead}"]`, 'aria-pressed');
      await page.click('#cdFSave');
      return pressed === 'true';
    };
    const chips = await (async () => { const lid = await lunchRow(); if (!lid) return null; await page.click(`.cd-it[data-id="${lid}"] .cd-rb`); await sheetUp(page);
      const c = await page.$$eval('#cdFR .cd-chip', (cs) => cs.map((x) => x.textContent + ':' + x.getAttribute('aria-pressed'))); await closeSheet(page); return c; })();
    ok('the editor offers when to be reminded, and an old block reads as at the start',
      !!chips && chips.join('|') === 'Off:false|At start:true|5 min:false|10 min:false|15 min:false|30 min:false', chips);
    const early = await setLead(10);
    const at1220 = await page.evaluate(() => new Date(2026, 8, 25, 12, 20).getTime());
    const lead10 = await until(async () => { const l = await findLunch(); return l.length && l[0].t === at1220 ? l : null; }, 8000);
    ok('ten minutes early is queued ten minutes early, and says how soon and at what time',
      early && !!lead10 && /^In 10 min · at 12:30(\n|$)/.test(lead10[0].b) && (await store(page, 'cad.week.v1')).find((b) => b.n === 'Lunch').r === 10, lead10);
    const off = await setLead(-1);
    const noLunch = await until(async () => (await findLunch()).length === 0 ? true : null, 8000);
    ok('and Off queues nothing for that block', off && !!noLunch);
    await setLead(0);
    await until(async () => { const l = await findLunch(); return l.length && l[0].t === lunchAt ? l : null; }, 8000);

    /* A BLOCK THAT ENDS UNTICKED ASKS, fifteen minutes on, and the tick
       takes the question back. Deep work runs to noon, so it asks at
       12:15 and carries the block it is about for the tap to open. */
    const wk2 = await store(page, 'cad.week.v1');
    const deep = wk2.find((b) => b.n === 'Deep work');
    const askAt = await page.evaluate(() => new Date(2026, 8, 25, 12, 15).getTime());
    const asks = (await openAll()).filter((o) => o.g === '2026-09-25.' + deep.id + '.ask');
    ok('a block that ends unticked asks fifteen minutes on, and carries the block to open',
      asks.length === 1 && asks[0].at === askAt && asks[0].t === 'Deep work' && asks[0].b === 'Did you do it? · ended 12:00' && asks[0].u === '#tick=2026-09-25.' + deep.id, asks);
    await closeSheet(page);
    await page.click(`.cd-it[data-id="${deep.id}"] .cd-dot`);
    const unasked = await until(async () => (await openAll()).some((o) => o.g === '2026-09-25.' + deep.id + '.ask') ? null : true, 8000);
    ok('and ticking it takes the question back off the queue', !!unasked);
    await page.click(`.cd-it[data-id="${deep.id}"] .cd-dot`);
    await until(async () => (await openAll()).some((o) => o.g === '2026-09-25.' + deep.id + '.ask') || null, 8000);

    /* The thought rides the first reminder of each day. Tomorrow's is
       worked out from tomorrow's date, so it is in the queue today. */
    const tomQ = await page.evaluate(() => window.cadence.reflect('2026-09-26'));
    const tomFirst = (await openAll()).filter((o) => /^2026-09-26\./.test(o.g))[0];
    ok("tomorrow's first reminder carries tomorrow's thought, as one notification rather than two",
      !!tomFirst && isStart(tomFirst) && tomFirst.b.split('\n')[1] === tomQ && (await openAll()).filter((o) => (o.b || '').includes(tomQ)).length === 1, { tomFirst, tomQ });

    await page.click('#cdGear'); await sheetUp(page);
    ok('with reminders on, Settings offers what they say, all on to start',
      (await page.getAttribute('#cdPushAsk', 'aria-pressed')) === 'true' && (await page.getAttribute('#cdPushTh', 'aria-pressed')) === 'true'
      && (await page.getAttribute('#cdQuiet', 'aria-pressed')) === 'false' && !(await page.isVisible('#cdQuietT')));
    await page.click('#cdPushTh');
    const noTh = await until(async () => (await openAll()).some((o) => (o.b || '').includes(tomQ)) ? null : true, 8000);
    ok("Today's thought off takes it out of every reminder", !!noTh);
    await page.click('#cdPushTh');
    await page.click('#cdPushAsk');
    const noAsk = await until(async () => { const a = await openAll(); return a.length && !a.some((o) => /\.ask$/.test(o.g)) ? true : null; }, 8000);
    ok('Ask if I did it off queues no questions at all', !!noAsk);
    await page.click('#cdPushAsk');

    /* Quiet hours drop what would land inside them, across midnight too. */
    await page.click('#cdQuiet');
    const mins = (t) => { const d = new Date(t); return d.getHours() * 60 + d.getMinutes(); };
    const quiet = await until(async () => { const a = await openAll(); return a.length && !a.some((o) => mins(o.at) >= 1320 || mins(o.at) < 420) ? a : null; }, 8000);
    ok('quiet hours start at 22:00 to 07:00 and nothing lands inside them', (await page.isVisible('#cdQuietT')) && !!quiet
      && (await page.inputValue('#cdQuietA')) === '22:00' && (await page.inputValue('#cdQuietB')) === '07:00');
    await page.fill('#cdQuietA', '12:00'); await page.dispatchEvent('#cdQuietA', 'change');
    await page.fill('#cdQuietB', '13:00'); await page.dispatchEvent('#cdQuietB', 'change');
    const noon = await until(async () => { const a = await openAll(); return a.length && !a.some((o) => mins(o.at) >= 720 && mins(o.at) < 780) && a.some((o) => mins(o.at) >= 1320) ? a : null; }, 8000);
    ok('and moving them moves what is dropped: noon to one, and the night is back', !!noon);
    await page.click('#cdQuiet');
    await closeSheet(page);


    /* Off takes the queue off the server and the subscription off the phone. */
    await page.click('#cdGear'); await sheetUp(page);
    ok('the switch shows reminders on', (await page.getAttribute('#cdPushOn', 'aria-pressed')) === 'true');
    await page.click('#cdPushOn');
    const gone = await until(async () => !m.has(qk) && (await page.evaluate(() => window.__unsub)) === 1 && !(await page.evaluate(() => localStorage.getItem('cad.push.v1'))));
    ok('turning it off deletes the queue and unsubscribes this phone', !!gone && !(qk.slice(5) in JSON.parse(m.get('push:ix') || '{}')));
    ok('and what the reminders say is put away with them', !(await page.isVisible('#cdPushAsk')));
    /* A tap on the question opens the app on the ask for that block.
       After Off, because a reload takes the faked subscription with it. */
    /* A query as well as the hash, or goto is a same-page jump and boot never reads it. */
    await page.goto(BASE + '/cadence/?from=push#tick=2026-09-25.' + deep.id);
    const askUp = await sheetUp(page);
    ok('opening from the question lands on Complete for that block, and spends the hash',
      askUp && (await page.textContent('#cdShT')) === 'Complete Deep work?' && (await page.evaluate(() => location.hash)) === '', await page.evaluate(() => location.hash));
    await closeSheet(page);
    /* K is the list the backup and the vault are both built from, so a
       subscription in it would copy one phone's address to another. */
    const kBlock = (fs.readFileSync(path.resolve(__dirname, '..', 'cadence', 'index.html'), 'utf8').match(/var K = \{[\s\S]*?\};/) || [''])[0];
    ok('and the subscription is this phone\'s alone: it is not in K, so neither backed up nor synced', /cad\.week\.v1/.test(kBlock) && !/cad\.push/.test(kBlock), kBlock);

    /* The service worker shows pushes, and its fetch handler asks the
       network FIRST: a cache-first document is how schedule/ ran
       yesterday's app. The sync server is never answered from it. */
    const sw = fs.readFileSync(path.resolve(__dirname, '..', 'cadence', 'sw.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const swFetch = (sw.split("addEventListener('fetch'")[1] || '').split("addEventListener('push'")[0];
    ok('the service worker shows pushes', /addEventListener\('push'/.test(sw) && /showNotification/.test(sw) && /addEventListener\('notificationclick'/.test(sw));
    ok('and its fetch handler goes to the network first, for this origin\'s GETs only',
      /respondWith\(fetch\(req\)/.test(swFetch) && /\.catch\([\s\S]*caches\.match/.test(swFetch) && /method !== 'GET'/.test(swFetch) && /origin !== self\.location\.origin/.test(swFetch), swFetch.slice(0, 200));
    ok('and a tap on a question hands its block to the app, open or not', /postMessage\(\{ tick:/.test(sw) && /openWindow\('\.\/' \+ u\)/.test(sw));
    ok('no page errors with reminders', P.errs.length === 0, P.errs);
    Date.now = realNow;
    await P.c.close();
  }

  /* ── no signal: the last copy that loaded opens ──
     The worker is registered on every open. Online it goes to the network
     first, so a changed page is served at once rather than an open late;
     offline the cached copy answers, the query a push opens with included. */
  {
    const O = await ctx();
    const ctl = await O.page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 10000 }).then(() => true, () => false);
    ok('the service worker is registered and controls the app, with reminders off', ctl && !(await O.page.evaluate(() => localStorage.getItem('cad.push.v1'))));
    await O.page.reload(); await O.page.waitForTimeout(300);
    await O.c.setOffline(true);
    await O.page.reload(); await O.page.waitForTimeout(400);
    const hero = await O.page.$eval('#cdHeroN', (e) => e.textContent.trim()).catch(() => '');
    ok('with no signal the app still opens on the day', hero === 'Deep work', hero);
    await O.page.goto(URL + '?from=push', { waitUntil: 'load' }).catch(() => {});
    await O.page.waitForTimeout(300);
    ok('and a cold open from a reminder does too', (await O.page.$eval('#cdHeroN', (e) => e.textContent.trim()).catch(() => '')) === 'Deep work');
    await O.c.setOffline(false);
    await O.c.route('**/cadence/', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><p id="swFresh">new build</p>' }));
    await O.page.goto(URL, { waitUntil: 'load' });
    ok('with a signal the network answers first, so a new build is never an open late', !!(await O.page.$('#swFresh')));
    await O.c.unroute('**/cadence/');
    await O.c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
