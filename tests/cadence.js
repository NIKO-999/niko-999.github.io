/* ═══════════════════════════════════════════════════════════════
   CADENCE — the day, the habits, the month and the training log.

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
  isMobile: true, hasTouch: true, locale: 'en-GB' };
const URL = `${BASE}/cadence/`;

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

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });

  async function ctx(opts = {}) {
    const c = await browser.newContext({ ...PHONE, colorScheme: opts.scheme || 'light' });
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

  console.log('\n── the day ──');
  {
    const { c, page, errs, off } = await ctx();
    const names = await page.$$eval('.cd-it .cd-tk-n', (ns) => ns.map((n) => n.textContent));
    ok('Friday draws its seven blocks in time order',
      names.join('|') === 'Wake up|Gym|Deep work|Lunch|Emails and calls|Read|Wind down', names);
    ok('the title says today, and the line above it says which day',
      (await page.textContent('#cdTitle')) === 'Today'
      && (await page.textContent('#cdEyebrow')) === 'Friday 25 September');
    const ring = await page.getAttribute('#cdRing', 'aria-label');
    ok('the ring says how far round the day you are', ring === '0 of 7 kept', ring);

    /* A running block carries the countdown, and then there is no second
       statement of "now" as a rule across the rail. */
    const run = await page.$eval('.cd-it.is-now', (e) => e.textContent);
    ok('the running block counts down', /Deep work/.test(run) && /1h 40m left/.test(run), run);
    ok('and no now-line is drawn beside a running block', !(await page.$('#cdNowL')));

    /* The gaps are the time nobody has claimed. */
    const gaps = await page.$$eval('.cd-gap p', (ps) => ps.map((p) => p.textContent));
    ok('open time between blocks is measured', gaps.includes('30m free') && gaps.includes('45m free'), gaps);

    const past = await page.$$eval('.cd-it.is-past', (ls) => ls.length);
    ok('the blocks behind you are marked past', past === 2, past);

    /* The stamp ticks and the tick survives a reload. */
    await page.click('.cd-it[data-id="s0"] .cd-stamp');
    ok('a stamp ticks its block', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('the tick is filed under the date', (await store(page, 'cad.log.v1'))['2026-09-25'].s0 === 1);
    await page.reload(); await page.waitForTimeout(150);
    ok('and survives a reload', await page.$eval('.cd-it[data-id="s0"]', (e) => e.classList.contains('is-done')));
    ok('the summary counts it', /1 of 7 kept/.test(await page.textContent('#cdSub')));

    /* Future days refuse a tick; the ribbon moves the day. */
    await page.click('.cd-rb[data-d="2026-09-27"]');
    ok('the ribbon opens another day', (await page.textContent('#cdTitle')).startsWith('Sunday'));
    ok('a day ahead cannot be ticked', await page.$$eval('.cd-stamp', (bs) => bs.length > 0 && bs.every((b) => b.disabled)));
    await page.click('.cd-rb[data-d="2026-09-25"]');

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

    /* Unticking a training block takes its session with it. */
    await page.click('.cd-it[data-id="s1"] .cd-stamp');
    ok('unticking takes the session off', !((await store(page, 'cad.train.v1'))['2026-09-25'] || {}).s1);
    await page.click('.cd-it[data-id="s1"] .cd-stamp');
    await sheetUp(page);
    await page.click('[data-k="weights.push"]');
    await page.click('#cdLiftGo');
    await page.waitForTimeout(320);

    ok('the day makes no request off this origin', off.length === 0, off);
    ok('no page errors on the day', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the now-line between blocks ──');
  {
    const { c, page } = await ctx({ at: '2026-09-25T12:15:00' });
    const order = await page.$$eval('#cdAgenda > li', (ls) => ls.map((l) =>
      l.id === 'cdNowL' ? 'NOW' : l.classList.contains('cd-gap') ? 'gap' : l.querySelector('.cd-tk-n').textContent));
    const i = order.indexOf('NOW');
    ok('in a gap, the now-line sits just before the next block', i > 0 && order[i + 1] === 'Lunch' && order[i - 1] === 'gap', order);
    ok('and says the time', (await page.textContent('#cdNowL')).trim() === '12:15');
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

    /* Off this day strikes the row and clears a tick. */
    await page.click('.cd-it[data-id="s3"] .cd-tk-b');
    await sheetUp(page);
    await page.click('#cdTOff');
    ok('off this day is filed for the date', (await store(page, 'cad.off.v1'))['2026-09-25'].s3 === 1);
    await closeSheet(page);
    ok('and the row is struck', await page.$eval('.cd-it[data-id="s3"]', (e) => e.classList.contains('is-off')));
    ok('an off block leaves the count', /of 7 kept/.test(await page.textContent('#cdSub')));
    ok('no page errors in the sentence', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── habits, month, training ──');
  {
    const seed = `(() => { if (!localStorage.getItem('cad.train.v1')) {
      localStorage.setItem('cad.log.v1', JSON.stringify({ '2026-09-24': { s0: 1, s2: 1 }, '2026-09-25': { s1: 1 } }));
      localStorage.setItem('cad.train.v1', JSON.stringify({
        '2026-09-24': { s2: { k: ['run.easy'], e: 'Light', m: 45 } },
        '2026-09-25': { s1: { k: ['weights.legs'], e: 'Hard', m: 60 } } }));
    } })();`;
    const { c, page, errs, off } = await ctx({ init: seed });

    await page.click('.cd-tab[data-v="hab"]');
    const train = await page.$eval('.cd-hr[data-h="train"]', (e) => ({ t: e.textContent, on: !!e.querySelector('.cd-chk.is-on') }));
    ok('Train is kept by the session filed today', /Kept by a session/.test(train.t) && train.on, train);
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
      && (await page.textContent('#cdEyebrow')) === '2026');
    const cells = await page.$$eval('.cd-mc[data-day]', (cs) => cs.length);
    ok('it draws thirty days', cells === 30, cells);
    ok('the grid is a whole rectangle', (await page.$$eval('.cd-mgrid > *', (cs) => cs.length)) % 7 === 0);
    ok('a month still to come cannot be opened', await page.$eval('#cdMonN', (b) => b.disabled));
    ok('today is marked', await page.$eval('.cd-mc[data-day="2026-09-25"]', (e) => e.classList.contains('is-today')));
    const bar = await page.$eval('.cd-mc[data-day="2026-09-24"] em', (e) => e.style.getPropertyValue('--kc'));
    ok('a day you ran wears the run colour', bar === 'var(--k-run)', bar);
    ok('a day before the record draws no ring', await page.$eval('.cd-mc[data-day="2026-09-10"] svg', (s) => s.children.length === 0));
    await page.click('.cd-mc[data-day="2026-09-24"]');
    await sheetUp(page);
    const ds = await page.textContent('#cdShB');
    ok('a pressed day reads itself back', /Thursday 24 September/.test(await page.textContent('#cdShT')) && /Easy/.test(ds) && /2 of/.test(ds), ds.slice(0, 120));
    await closeSheet(page);

    await page.click('.cd-tab[data-v="lift"]');
    const figs = await page.$$eval('.cd-figs b', (bs) => bs.map((b) => b.textContent));
    ok('training counts the thirty days', figs[0] === '2' && figs[1] === '2' && figs[2] === '53m', figs);
    ok('the week in progress is the last column', await page.$eval('.cd-weeks i:last-child', (i) => i.classList.contains('is-this')));
    const kinds = await page.$$eval('.cd-kinds b', (bs) => bs.map((b) => b.textContent));
    ok('what you trained, by name', kinds.includes('Legs') && kinds.includes('Easy'), kinds);

    ok('habits, month and training make no request off this origin', off.length === 0, off);
    ok('no page errors across the views', errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── layout, on every view and both faces ──');
  for (const scheme of ['light', 'dark']) {
    const { c, page, errs } = await ctx({ scheme });
    for (const v of ['day', 'hab', 'mon', 'lift']) {
      await page.click(`.cd-tab[data-v="${v}"]`);
      await page.waitForTimeout(80);
      const drawn = await page.$$eval('main > section', (ss) => ss.filter((s) => s.getBoundingClientRect().height > 0).length);
      ok(`${scheme} ${v}: exactly one view is drawn`, drawn === 1, drawn);
      const small = await page.$$eval('button', (bs) => bs.filter((b) => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(b).visibility !== 'hidden' && (r.width < 43.5 || r.height < 43.5);
      }).map((b) => (b.className || b.id) + ' ' + Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height)));
      ok(`${scheme} ${v}: every press target is 44px`, small.length === 0, small);
      const wide = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth
        || [...document.querySelectorAll('*')].some((e) => e.scrollWidth > e.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(e).overflowX)));
      ok(`${scheme} ${v}: nothing scrolls sideways`, !wide);
    }
    /* Contrast off the computed tokens, through a probe the browser has styled. */
    const cols = await page.evaluate(() => {
      const probe = (v) => { const d = document.createElement('div'); d.style.color = `var(${v})`; document.body.appendChild(d);
        const c = getComputedStyle(d).color; d.remove(); return c.match(/[\d.]+/g).slice(0, 3).map(Number); };
      return ['--bg', '--card', '--ink', '--ink2', '--ink3', '--accent', '--c-body', '--c-mind', '--c-work', '--c-rest',
        '--sky-t', '--sky-m', '--sky-b', '--earth', '--dock-ink', '--dock-acc', '--sun', '--on-sun'].reduce((o, k) => (o[k] = probe(k), o), {});
    });
    /* The page is a sky, not one colour: every stop of it is a ground
       something is read on, so the greys are held against all three. */
    const grounds = ['--bg', '--card', '--sky-t', '--sky-m', '--sky-b'];
    const worst = Math.min(...['--ink2', '--ink3'].flatMap((t) => grounds.map((g) => ratio(cols[t], cols[g]))));
    ok(`${scheme}: the two greys hold 4.5:1 on every stop of the sky and on a card`, worst >= 4.5, worst.toFixed(2));
    const cat = Math.min(...['--c-body', '--c-mind', '--c-work', '--c-rest', '--accent'].flatMap((t) => ['--sky-t', '--sky-m', '--sky-b'].map((g) => ratio(cols[t], cols[g]))));
    ok(`${scheme}: every category colour holds 4.5:1 on every stop of the sky`, cat >= 4.5, cat.toFixed(2));
    /* The tab bar draws no ground: its labels are read on the planet. */
    const dock = Math.min(ratio(cols['--dock-ink'], cols['--earth']), ratio(cols['--dock-acc'], cols['--earth']), ratio(cols['--on-sun'], cols['--sun']));
    ok(`${scheme}: the tab labels hold 4.5:1 on the earth, and the plus on the sun`, dock >= 4.5, dock.toFixed(2));

    /* Nothing you read is drawn over the horizon: the scroller ends above
       the limb, and the limb clears the tab row at both edges of the
       screen, so the line never runs behind a label. */
    await page.click('.cd-tab[data-v="day"]');
    await page.waitForTimeout(80);
    const hz = await page.evaluate(() => {
      const m = document.getElementById('cdMain').getBoundingClientRect();
      const e = document.querySelector('.cd-earth').getBoundingClientRect();
      const d = document.querySelector('.cd-tabs').getBoundingClientRect();
      const a = e.width / 2, b = e.height / 2, cx = e.left + a;
      const at = (x) => e.top + b * (1 - Math.sqrt(1 - ((x - cx) / a) ** 2));
      return { mainBottom: m.bottom, apex: e.top, edge: Math.max(at(0), at(innerWidth)), dockTop: d.top };
    });
    ok(`${scheme}: the day stops above the horizon`, hz.mainBottom <= hz.apex, hz);
    ok(`${scheme}: the limb clears the tab row at both edges`, hz.edge < hz.dockTop, hz);
    /* And it is fire on composited pixels, above a sky that is a gradient:
       sampled in the gutter the cards never reach. */
    const shot = PNG.sync.read(await page.screenshot());
    const px = (x, y) => { const i = (Math.round(y * 2) * shot.width + Math.round(x * 2)) * 4; return [shot.data[i], shot.data[i + 1], shot.data[i + 2]]; };
    const fire = px(195, hz.apex - 2);
    ok(`${scheme}: the limb is drawn in fire`, fire[0] - fire[2] > 120 && fire[0] > 200, fire);
    const skyTop = px(6, 60), skyLow = px(6, hz.mainBottom - 40);
    ok(`${scheme}: the sky is a gradient, not one colour`, Math.abs(skyTop[2] - skyLow[2]) + Math.abs(skyTop[0] - skyLow[0]) > 12, { skyTop, skyLow });
    ok(`${scheme}: the face follows the phone`, (await page.getAttribute('html', 'data-mode')) === scheme);
    ok(`${scheme}: no page errors`, errs.length === 0, errs);
    await c.close();
  }

  console.log('\n── the record ──');
  {
    /* A damaged record is repaired, not discarded — and written back. */
    const init = `(() => { if (!sessionStorage.getItem('planted')) { sessionStorage.setItem('planted', 1);
      localStorage.setItem('cad.week.v1', JSON.stringify([{ id: 'x1', n: 'Kept', d: [4], s: 600, e: 660 }, 7, null, { n: 'No days', d: [] }, { id: 'x2', n: 'Also kept', d: [4, 9], s: 700, e: 690 }]));
      localStorage.setItem('cad.log.v1', JSON.stringify({ '2026-09-25': { x1: 1 }, 'garbage': 5 }));
    } })();`;
    const { c, page, errs } = await ctx({ init });
    const wk = await store(page, 'cad.week.v1');
    ok('a damaged week keeps the good blocks', wk.length === 2 && wk[0].n === 'Kept' && wk[1].n === 'Also kept', wk);
    ok('and repairs the bad fields', wk[1].d.join() === '4' && wk[1].e === 700, wk[1]);
    ok('a damaged log keeps its days', JSON.stringify(await store(page, 'cad.log.v1')) === '{"2026-09-25":{"x1":1}}');

    /* A backup carries every record, and restoring puts it back. */
    await page.click('#cdGear');
    await sheetUp(page);
    await page.evaluate(() => { navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); }; });
    await page.click('#cdBak');
    const bak = JSON.parse(await page.evaluate(() => window.__copied));
    ok('a backup carries every record', bak.app === 'cadence' && ['week', 'log', 'off', 'hab', 'train', 'defs'].every((k) => k in bak), Object.keys(bak));
    bak.week.push({ id: 'x3', n: 'Restored', d: [4], s: 800, e: 830 });
    await page.fill('#cdRestore', JSON.stringify(bak));
    await Promise.all([page.waitForNavigation(), page.click('#cdRestoreGo')]);
    await page.waitForTimeout(150);
    ok('restoring writes it back', (await page.$$eval('.cd-tk-n', (ns) => ns.map((n) => n.textContent))).includes('Restored'));

    /* The chosen face beats the phone. */
    await page.click('#cdGear');
    await sheetUp(page);
    await page.click('#cdShB [data-m="dark"]');
    ok('Night overrides a light phone', (await page.getAttribute('html', 'data-mode')) === 'dark');
    await page.reload(); await page.waitForTimeout(100);
    ok('and is there before the first paint on the next load', (await page.getAttribute('html', 'data-mode')) === 'dark');
    ok('no page errors in the record', errs.length === 0, errs);
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
