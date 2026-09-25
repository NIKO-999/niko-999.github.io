/* ═══════════════════════════════════════════════════════════════
   CADENCE — the day as one line of time, the habits, the month and
   the training log, under a night sky.

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
        faded: pr ? (r.top < pr.top + 10 || r.bottom > pr.bottom - 64) : false };
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

  console.log('\n── the day, as one line of time ──');
  {
    const { c, page, errs, off } = await ctx();
    const names = await page.$$eval('.cd-it .cd-tk-n', (ns) => ns.map((n) => n.textContent));
    ok('Friday draws its seven blocks in time order',
      names.join('|') === 'Wake up|Gym|Deep work|Lunch|Emails and calls|Read|Wind down', names);
    ok('the title says today, and the line above it says which day and the clock',
      (await page.textContent('#cdTitle')) === 'Today'
      && (await page.textContent('#cdDayK')) === 'Friday 25 September · 10:20');
    const sub = await page.textContent('#cdSub');
    ok('the line under it says how much is kept and how much is committed', sub === '0 of 7 kept · 6h 15m committed', sub);

    /* THE GEOMETRY. Every row's line of time is the scale's own width, and
       a block's bar starts at its own minute on that line. A mapping from
       minutes to pixels is solved off two bars and every other mark on the
       screen — bars, dots, gaps, the scale's figures, the clock — has to
       land on the same one. A row that drew its bar anywhere else, or a
       scale that disagreed with the rows, would be a Gantt that lies. */
    const geo = await page.evaluate(() => {
      const box = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width }; };
      const rows = [...document.querySelectorAll('.cd-it')].map((li) => ({
        n: li.querySelector('.cd-tk-n').textContent, seg: box(li.querySelector('.cd-seg')),
        dot: li.querySelector('.cd-seg').classList.contains('is-dot'), track: box(li.querySelector('.cd-track')),
        name: box(li.querySelector('.cd-tk-n')), now: li.querySelector('.cd-tnow') && box(li.querySelector('.cd-tnow')),
        words: [...li.querySelectorAll('.cd-tk-n, .cd-tk-m, .cd-tk-w')].map(box)
      }));
      const labels = [...document.querySelectorAll('#cdScale span')].map((s) => ({ t: s.textContent, x: (box(s).l + box(s).r) / 2, l: box(s).l }));
      const badge = document.getElementById('cdNowT');
      const gaps = [...document.querySelectorAll('.cd-gap')].map((g) => ({ b: box(g.querySelector('b')), p: box(g.querySelector('p')), t: g.querySelector('p').textContent }));
      const run = document.querySelector('.cd-it.is-now .cd-seg');
      return { rows, labels, scale: box(document.getElementById('cdScale')), badge: badge && { t: badge.textContent, x: (box(badge).l + box(badge).r) / 2 }, gaps,
        fill: run && run.firstElementChild.getBoundingClientRect().width / run.getBoundingClientRect().width };
    });
    const R = Object.fromEntries(geo.rows.map((r) => [r.n, r]));
    const k = (R['Deep work'].seg.l - R['Gym'].seg.l) / (540 - 450), x0 = R['Gym'].seg.l - k * 450;
    const at = (m) => x0 + k * m;
    ok('every row\'s line of time is exactly the scale\'s width',
      geo.rows.every((r) => Math.abs(r.track.l - geo.scale.l) < 1 && Math.abs(r.track.r - geo.scale.r) < 1), { scale: geo.scale, t: geo.rows.map((r) => [r.track.l, r.track.r]) });
    ok('and the span is the hour before the first block to the hour after the last',
      Math.abs(at(420) - geo.scale.l) < 1 && Math.abs(at(1380) - geo.scale.r) < 1, { l: at(420), r: at(1380), scale: geo.scale });
    const starts = { 'Lunch': 750, 'Emails and calls': 840, 'Read': 1290 };
    ok('every other bar starts at its own minute on the same line',
      Object.keys(starts).every((n) => Math.abs(R[n].seg.l - at(starts[n])) < 1), Object.keys(starts).map((n) => [n, R[n].seg.l, at(starts[n])]));
    ok('and is as long as the block is', Math.abs(R['Deep work'].seg.w - 4 * R['Lunch'].seg.w) < 1.5, [R['Deep work'].seg.w, R['Lunch'].seg.w]);
    ok('a moment is a dot at its minute, not a bar',
      R['Wake up'].dot && R['Wind down'].dot && Math.abs((R['Wind down'].seg.l + R['Wind down'].seg.r) / 2 - at(1350)) < 1,
      { dot: R['Wind down'].seg, want: at(1350) });
    const l13 = geo.labels.find((l) => l.t === '13:00');
    ok('the scale\'s figures sit over the minutes they name', l13 && Math.abs(l13.x - at(780)) < 1.5, { l13, want: at(780) });
    ok('there is no time gutter: every name starts where its line of time does',
      geo.rows.every((r) => Math.abs(r.name.l - r.track.l) < 1), geo.rows.map((r) => [r.name.l, r.track.l]));

    /* THE CLOCK is a mark on every track, one x down the whole page, and
       the scale's badge says it. It is never drawn over a word. */
    const nx = geo.rows.map((r) => r.now && (r.now.l + r.now.r) / 2);
    ok('every line of time carries the clock, at one x', nx.every((x) => x != null && Math.abs(x - nx[0]) < .5), nx);
    ok('and that x is 10:20 on the scale', Math.abs(nx[0] - at(620)) < 1 && geo.badge && geo.badge.t === '10:20' && Math.abs(geo.badge.x - nx[0]) < 1, { nx: nx[0], want: at(620), badge: geo.badge });
    const hit = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
    ok('and the clock never crosses a word', geo.rows.every((r) => r.words.every((w) => !hit(w, r.now))),
      geo.rows.filter((r) => r.words.some((w) => hit(w, r.now))).map((r) => r.n));
    ok('the scale does not print an hour under the clock\'s own figure',
      geo.labels.every((l) => Math.abs(l.x - geo.badge.x) > 30), geo.labels.map((l) => l.t));

    /* Every state of a bar is a graphic, held to 3:1 against its own row's
       ground on composited pixels: kept, behind you and not kept, running,
       and still ahead. Read at its far end, which on a running bar is the
       half still to come — once now and once after the gym is kept. */
    const readBars = async () => {
      const segs = await page.$$eval('.cd-it .cd-seg:not(.is-dot)', (ss) => ss.map((s) => {
        const r = s.getBoundingClientRect(), t = s.parentElement.getBoundingClientRect(), li = s.closest('.cd-it');
        return { n: li.querySelector('.cd-tk-n').textContent, st: li.className.replace('cd-it', '').trim() || 'ahead',
          x: r.right - Math.min(3, r.width / 2), y: (r.top + r.bottom) / 2, gx: r.left - t.left > 40 ? t.left + 4 : t.right - 4, gy: t.top - 5 };
      }).filter((s) => s.y < innerHeight - 120));
      const px = await shoot(page);
      return segs.map((s) => ({ n: s.n, st: s.st, r: +ratio(px(s.x, s.y), px(s.gx, s.gy)).toFixed(2) }));
    };
    const barsAtLoad = await readBars();

    /* A running block counts down, and its bar is filled to the minute. */
    const run = await page.$eval('.cd-it.is-now', (e) => e.textContent);
    ok('the running block counts down', /Deep work/.test(run) && /1h 40m left/.test(run), run);
    ok('and its bar is filled as far as the clock', Math.abs(geo.fill - (620 - 540) / 180) < .02, geo.fill);

    /* The gaps are the time nobody has claimed, drawn as exactly that stretch. */
    const gaps = geo.gaps.map((g) => g.t);
    ok('open time between blocks is measured', gaps.includes('30m free') && gaps.includes('45m free'), gaps);
    const g1 = geo.gaps[1];
    ok('a gap is drawn across exactly the stretch it measures', Math.abs(g1.b.l - at(510)) < 1 && Math.abs(g1.b.r - at(540)) < 1, { b: g1.b, l: at(510), r: at(540) });
    ok('and its figure sits beside the line, never on it', geo.gaps.every((g) => g.p.l >= g.b.r || g.p.r <= g.b.l), geo.gaps.map((g) => [g.b.l, g.b.r, g.p.l, g.p.r]));

    const past = await page.$$eval('.cd-it.is-past', (ls) => ls.length);
    ok('the blocks behind you are marked past', past === 2, past);
    const cats = await page.$$eval('.cd-it', (ls) => ls.map((l) => l.style.getPropertyValue('--cat')));
    ok('colour says which part of life: body, work, mind, rest',
      cats[1] === 'var(--c-body)' && cats[2] === 'var(--c-work)' && cats[5] === 'var(--c-mind)' && cats[0] === 'var(--c-rest)', cats);

    /* The stamp ticks and the tick survives a reload. The word is the same
       both ways; what changes is the ground. */
    const stampBg = () => page.$eval('.cd-it[data-id="s0"] .cd-stamp span', (s) => ({ t: s.textContent, bg: getComputedStyle(s).backgroundColor }));
    const before = await stampBg();
    await page.click('.cd-it[data-id="s0"] .cd-stamp');
    const after = await stampBg();
    ok('a stamp ticks its block', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('and says so with its ground, not a second word', before.t === 'Kept' && after.t === 'Kept' && before.bg !== after.bg, { before, after });
    ok('the tick is filed under the date', (await store(page, 'cad.log.v1'))['2026-09-25'].s0 === 1);
    await page.reload(); await page.waitForTimeout(150);
    ok('and survives a reload', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('the summary counts it', /1 of 7 kept/.test(await page.textContent('#cdSub')));

    /* Future days refuse a tick; the week moves the day. */
    await page.click('.cd-wd[data-d="2026-09-26"]');
    ok('tomorrow is named, and the line above it carries the weekday',
      (await page.textContent('#cdTitle')) === 'Tomorrow' && (await page.textContent('#cdDayK')) === 'Saturday 26 September');
    await page.click('.cd-wd[data-d="2026-09-27"]');
    ok('any other day is its weekday, and the line above does not repeat it',
      (await page.textContent('#cdTitle')) === 'Sunday' && (await page.textContent('#cdDayK')) === '27 September');
    ok('a day ahead cannot be ticked', await page.$$eval('.cd-stamp', (bs) => bs.length > 0 && bs.every((b) => b.disabled)));
    ok('and a day that is not today carries no clock', !(await page.$('.cd-tnow')) && !(await page.$('#cdNowT')));
    await page.click('.cd-wd[data-d="2026-09-25"]');

    /* Finishing a training block asks what it was. */
    await page.click('.cd-it[data-id="s1"] .cd-stamp');
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
    ok('and the row wears it', /Push \+ Core · 60m/.test(await page.textContent('.cd-it[data-id="s1"] .cd-tk-w')));

    const sr = barsAtLoad.concat(await readBars());
    const states = new Set(sr.map((s) => s.st));
    ok('every bar holds 3:1 on its row, whatever state it is in',
      ['is-past', 'is-now', 'ahead', 'is-done is-past'].every((st) => states.has(st)) && sr.every((s) => s.r >= 3), sr);

    /* Unticking a training block takes its session with it. */
    await page.click('.cd-it[data-id="s1"] .cd-stamp');
    ok('unticking takes the session off', !((await store(page, 'cad.train.v1'))['2026-09-25'] || {}).s1);

    ok('the day makes no request off this origin', off.length === 0, off);
    ok('no page errors on the day', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the clock in a gap ──');
  {
    const { c, page } = await ctx({ at: '2026-09-25T12:15:00' });
    const g = await page.evaluate(() => {
      const x = (e) => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right }; };
      const row = (n) => [...document.querySelectorAll('.cd-it')].find((l) => l.querySelector('.cd-tk-n').textContent === n);
      const t = document.querySelector('.cd-tnow');
      return { deep: x(row('Deep work').querySelector('.cd-seg')), lunch: x(row('Lunch').querySelector('.cd-seg')), now: t && (x(t).l + x(t).r) / 2,
        badge: document.getElementById('cdNowT').textContent, running: document.querySelectorAll('.cd-it.is-now').length };
    });
    ok('between two blocks, the clock sits in the space between their bars', g.now > g.deep.r && g.now < g.lunch.l, g);
    ok('and the scale says the time', g.badge === '12:15', g.badge);
    ok('and nothing is running', g.running === 0, g.running);
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
    ok('and drawn on the day', (await page.$$eval('.cd-tk-n', (ns) => ns.map((n) => n.textContent))).includes('Journal'));

    /* Delete has a way back. */
    await page.click(`.cd-it[data-id="${j.id}"] .cd-tk-b`);
    await sheetUp(page);
    await page.click('#cdFDel');
    await page.waitForTimeout(320);
    ok('delete takes it off', !(await store(page, 'cad.week.v1')).some((b) => b.n === 'Journal'));
    await page.click('#cdToastU');
    ok('and undo puts it back', (await store(page, 'cad.week.v1')).some((b) => b.n === 'Journal'));

    /* Off this day strikes the row, takes its bar away, and leaves its
       hour free. */
    await page.click('.cd-it[data-id="s3"] .cd-tk-b');
    await sheetUp(page);
    await page.click('#cdTOff');
    ok('off this day is filed for the date', (await store(page, 'cad.off.v1'))['2026-09-25'].s3 === 1);
    await closeSheet(page);
    ok('and the row is struck', await page.$eval('.cd-it[data-id="s3"]', (e) => e.classList.contains('is-off')));
    ok('an off block draws no bar', await page.$eval('.cd-it[data-id="s3"] .cd-seg', (e) => e.getBoundingClientRect().width === 0));
    const gp = await page.$$eval('.cd-gap p', (ps) => ps.map((p) => p.textContent));
    ok('and its time is counted as free', gp.includes('4h free'), gp);
    ok('an off block leaves the count', /of 7 kept/.test(await page.textContent('#cdSub')));
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

    await page.click('.cd-tab[data-v="hab"]');
    const train = await page.$eval('.cd-hr[data-h="train"]', (e) => ({ t: e.textContent, on: !!e.querySelector('.cd-chk.is-on') }));
    ok('Train is kept by the session filed today', /Kept by a session/.test(train.t) && train.on, train);
    const hues = await page.$$eval('.cd-hr .cd-hr-n', (ns) => ns.map((n) => getComputedStyle(n, '::before').backgroundColor));
    ok('six habits, six colours: colour says which', new Set(hues).size === 6, hues);
    const tapes = await page.$$eval('.cd-tape', (ts) => ts.map((t) => t.children.length));
    ok('every habit carries a fortnight', tapes.every((n) => n === 14), tapes);
    await page.click('.cd-hr[data-h="mind"] .cd-hr-b');
    ok('Mind ticks on a press', (await store(page, 'cad.hab.v1'))['2026-09-25'].mind === 1);
    await page.click('.cd-hr[data-h="steps"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="10,000"');
    ok('a mark sets the dial', (await page.textContent('#cdNumV')).startsWith('10,000'));
    await page.click('#cdNumGo');
    await page.waitForTimeout(320);
    ok('the figure is saved', (await store(page, 'cad.hab.v1'))['2026-09-25'].steps === 10000);
    ok('and drawn', /10,000/.test(await page.textContent('.cd-hr[data-h="steps"] .cd-hr-v')));
    const bar = await page.$eval('.cd-hr[data-h="steps"] .cd-tape i:last-child', (i) => ({ on: i.classList.contains('on'), h: i.getBoundingClientRect().height }));
    ok('and today stands full in its fortnight', bar.on && bar.h === 16, bar);
    await page.click('.cd-hr[data-h="water"] .cd-hr-b');
    await sheetUp(page);
    await page.click('#cdShB .cd-chip >> text="+0.5"');
    await page.click('#cdShB .cd-chip >> text="+0.25"');
    ok('the bumps add, without float drift', (await page.textContent('#cdNumV')).startsWith('0.75'));
    await closeSheet(page);
    ok('the caption counts today', /3 of 6 kept today/.test(await page.textContent('#cdHabCap')));

    /* A habit of your own joins the list. */
    await page.click('#cdHabAdd');
    await sheetUp(page);
    await page.fill('#cdHN', 'Cold plunge');
    await page.click('#cdHGo');
    await page.waitForTimeout(320);
    ok('a habit of yours is added at the foot', (await page.$$eval('.cd-hr', (h) => h.map((x) => x.dataset.h))).length === 7);

    await page.click('.cd-tab[data-v="mon"]');
    ok('the month is September, and the line above it is the year', (await page.textContent('#cdMonT')) === 'September'
      && (await page.textContent('#cdMonK')) === '2026');
    const cells = await page.$$eval('.cd-mc[data-day]', (cs) => cs.length);
    ok('it draws thirty days', cells === 30, cells);
    ok('the grid is a whole rectangle', (await page.$$eval('.cd-mgrid > *', (cs) => cs.length)) % 7 === 0);
    ok('a month still to come cannot be opened', await page.$eval('#cdMonN', (b) => b.disabled));
    ok('today is marked', await page.$eval('.cd-mc[data-day="2026-09-25"]', (e) => e.classList.contains('is-today')));
    const kc = await page.$eval('.cd-mc[data-day="2026-09-24"] em', (e) => e.style.getPropertyValue('--kc'));
    ok('a day you ran wears the run colour', kc === 'var(--k-run)', kc);
    const lv = await page.$$eval('.cd-mc[data-day]', (cs) => Object.fromEntries(cs.map((c) => [c.dataset.day.slice(8), c.className.replace('cd-mc', '').trim()])));
    ok('a day before the record is quiet, not a day you missed', lv['10'] === 'is-quiet', lv['10']);
    ok('a day is lit by how much of it was kept, in steps',
      lv['24'] === 'is-l1' && lv['21'] === 'is-l2' && lv['22'] === 'is-l3' && lv['23'] === 'is-l4', { d21: lv['21'], d22: lv['22'], d23: lv['23'], d24: lv['24'] });
    const whole = await page.$eval('.cd-mc[data-day="2026-09-23"]', (e) => getComputedStyle(e).backgroundColor);
    ok('and only a whole day turns white', whole === 'rgb(243, 245, 247)', whole);
    /* Every square's figure is read on composited pixels, lit or not. */
    const mc = await inkFloor(page, '.cd-mc[data-day]');
    ok('every date holds 4.5:1 on its own square, at every level', mc.n === 30 && mc.worst.r >= 4.5, mc);
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    const ds = await page.textContent('#cdShB');
    ok('a pressed day reads itself back', /Thursday 24 September/.test(await page.textContent('#cdShT')) && /Easy/.test(ds) && /2 of/.test(ds), ds.slice(0, 120));
    await closeSheet(page);

    await page.click('.cd-tab[data-v="lift"]');
    const figs = await page.$$eval('.cd-figs b', (bs) => bs.map((b) => b.textContent));
    ok('training counts the thirty days', figs[0] === '2' && figs[1] === '2' && figs[2] === '53m', figs);
    ok('the head names the last session', (await page.textContent('#cdLiftK')) === 'Last · Legs · Fri 25');
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
      day: '#cdDayK, #cdTitle, #cdSub, .cd-wd-l, .cd-wd-n, .cd-scale span, .cd-tk-n, .cd-tk-m, .cd-gap p, .cd-stamp span',
      hab: '#cdHabK, #cdHabCap, .cd-hr-n, .cd-hr-s, .cd-hr-v, .cd-chk, #cdHabAdd',
      mon: '#cdMonK, #cdMonT, #cdMonCap, .cd-dows span, .cd-legend span',
      lift: '.cd-figs b, .cd-figs span, .cd-lbl, .cd-wax span, .cd-kinds b, .cd-kinds span, .cd-recent b, .cd-recent span, .cd-recent time'
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
         the sky, the dusk under a title, a pill. */
      const ink = await inkFloor(page, WORDS[v]);
      ok(`${v}: every word holds 4.5:1 on what is behind it`, ink.n > 4 && ink.worst.r >= 4.5, ink);
      /* A pane ends where the light begins, so nothing is read on the glow. */
      const pb = await page.$eval(`section:not([hidden]) .cd-pane`, (p) => p.getBoundingClientRect().bottom);
      ok(`${v}: the pane stops above the glow`, pb <= 844 - 56 + .5, pb);
    }

    await page.click('.cd-tab[data-v="day"]');
    await page.waitForTimeout(80);
    const px = await shoot(page);
    const head = await page.evaluate(() => {
      const h = document.querySelector('#cdVDay .cd-head').getBoundingClientRect(), s = document.getElementById('cdSub').getBoundingClientRect();
      const nav = document.querySelector('.cd-nav').getBoundingClientRect(), add = getComputedStyle(document.getElementById('cdAdd')).backgroundColor;
      return { l: h.left, r: h.right, t: h.top, b: h.bottom, sub: s.bottom, nav: nav.bottom, add };
    });
    /* The colour lives in gradients: a dusk at the foot of the title card,
       and a sky that ends on the same warm light. */
    const dusk = px((head.l + head.r) / 2, head.b - 3), card = px(head.l + 30, head.t + 20);
    ok('the title sits on a dusk: night at the top of its card, peach at the foot', dusk[0] - dusk[2] > 50 && card[2] >= card[0], { dusk, card });
    ok('and no word is written on the peach', head.sub < head.b - 26, head);
    const skyTop = px(6, 30), skyFoot = px(195, 841);
    ok('the page is a sky, and it ends warm', skyFoot[0] > skyFoot[2] && skyTop[2] >= skyTop[0] && Math.abs(skyTop[0] - skyFoot[0]) > 20, { skyTop, skyFoot });
    ok('the nav is at the top, above the title', head.nav <= head.t, head);
    ok('the add control is the one white thing', head.add === 'rgb(255, 255, 255)', head.add);
    ok('there is one face, and it is dark',
      (await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)) === 'dark'
      && !(await page.getAttribute('html', 'data-mode')));
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
    ok('restoring writes it back', (await page.$$eval('.cd-tk-n', (ns) => ns.map((n) => n.textContent))).includes('Restored'));
    ok('no page errors in the record', errs.length === 0, errs);
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
