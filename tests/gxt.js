/* ═══════════════════════════════════════════════════════════════
   GXT — the backtest journal. Drives the real page at a desktop size:
   runs the checklist, logs a backtest and a live trade, reads them back
   off the figures, the twelve weeks and the log, edits one, bins one,
   brings it back, and repairs a damaged store.

   The clock is frozen at Monday 2 November 2026, 10:00.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

const DESK = { viewport: { width: 1440, height: 900 }, locale: 'en-GB', colorScheme: 'dark' };
const URL = `${BASE}/gxt/`;
const freeze = (at) => `(() => {
  const F = new Date('${at}').getTime(); const R = Date;
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  async function ctx(seed) {
    const c = await browser.newContext(DESK);
    await c.addInitScript(freeze('2026-11-02T10:00:00'));
    if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('gxt.v1')) localStorage.setItem('gxt.v1', ${JSON.stringify(JSON.stringify(seed))}); })();`);
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:')) offOrigin.push(u); });
    await page.goto(URL); await page.waitForTimeout(250);
    return { c, page };
  }
  const store = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('gxt.v1') || 'null'));
  const stat = (page, s) => page.textContent(`.gx-stat[data-s="${s}"] b`);
  const pill = (page, k, v) => page.click(`.gx-step[data-k="${k}"] .gx-pill[data-v="${v}"]`);

  const { c, page } = await ctx();

  /* ── a first open ── */
  ok('six figures, the counts at nought', (await page.$$eval('.gx-stat b', (b) => b.map((x) => x.textContent))).join() === '0,0,0,—,—,—');
  ok('five checklist steps, in the order of the model',
    (await page.$$eval('.gx-step', (s) => s.map((x) => x.dataset.k))).join() === 'bias,lv,s1,s2,cisd');
  ok('the log says it is empty', /Nothing logged yet/.test(await page.textContent('#gxLog')));
  const grid = await page.$$eval('#gxGrid i', (i) => ({ n: i.length, now: i.filter((x) => x.classList.contains('is-now')).map((x) => x.dataset.d) }));
  ok('twelve weeks of days, today marked', grid.n === 84 && grid.now.join() === '2026-11-02', grid);
  ok('nothing can be logged before a bias is set', await page.$eval('#gxSave', (b) => b.disabled));

  const cols = await page.$$eval('.gx-cols > .gx-card', (s) => s.map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height), Math.round(r.width)]; }));
  ok('the checklist and the log are one box side by side',
    cols.length === 2 && cols[0][0] === cols[1][0] && cols[0][1] === cols[1][1] && Math.abs(cols[0][2] - cols[1][2]) <= 1, cols);
  ok('nothing scrolls sideways at 1440', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  /* ── a full-checklist backtest ── */
  await pill(page, 'bias', 'long');
  await pill(page, 'lv', 'dl'); await pill(page, 'lv', 'gap');
  await pill(page, 's1', '4h'); await pill(page, 's2', '30m'); await pill(page, 'cisd', 'y');
  ok('the score follows the ticks', /5 \/ 5/.test(await page.textContent('#gxScore')));
  ok('every step is marked met', await page.$$eval('.gx-step.is-met', (s) => s.length) === 5);
  await page.click('#gxRes button[data-v="w"]');
  await page.fill('#gxR', '3');
  await page.fill('#gxNote', 'Clean V off the 30m SMT');
  ok('the button says what it will file', (await page.textContent('#gxSave')) === 'Log backtest');
  await page.click('#gxSave');
  let st = await store(page);
  const e1 = st && st.e[0];
  ok('a backtest lands in the store with every answer', e1 && e1.t === 'bt' && e1.sym === 'NQ' && e1.bias === 'long'
    && e1.lv.join() === 'dl,gap' && e1.s1 === '4h' && e1.s2 === '30m' && e1.cisd === 'y' && e1.res === 'w' && e1.r === 3
    && e1.d === '2026-11-02' && e1.note === 'Clean V off the 30m SMT', e1);
  ok('the form goes back to blank', !(await page.$$eval('.gx-pill[aria-pressed="true"]', (p) => p.length)) && (await page.inputValue('#gxNote')) === '');
  ok('backtests read one', (await stat(page, 'bt')) === '1');

  /* ── a live trade that skipped the second SMT ── */
  await page.click('#gxType button[data-v="live"]');
  await page.click('#gxSym button[data-v="MES"]');
  ok('the button names a trade', (await page.textContent('#gxSave')) === 'Log trade');
  await pill(page, 'bias', 'short'); await pill(page, 'lv', 'h4h'); await pill(page, 's1', 'd'); await pill(page, 'cisd', 'y');
  await page.click('#gxRes button[data-v="l"]'); await page.fill('#gxR', '-1');
  await page.click('#gxSave');
  ok('a live trade is journaled', (await stat(page, 'live')) === '1');
  ok('the last kind and instrument are kept for the next entry',
    await page.$eval('#gxType button[data-v="live"]', (b) => b.getAttribute('aria-pressed')) === 'true'
    && await page.$eval('#gxSym button[data-v="MES"]', (b) => b.getAttribute('aria-pressed')) === 'true');
  ok('this week counts both', (await stat(page, 'wk')) === '2');
  ok('win rate is wins over wins and losses', (await stat(page, 'wr')) === '50%');
  ok('average R is the mean', (await stat(page, 'r')) === '+1.00');
  ok('the full checklist figure is only the full ones', (await stat(page, 'full')) === '100%'
    && /1 of 2/.test(await page.textContent('.gx-stat[data-s="full"] span')));
  ok('and beating the whole record is the one green figure', await page.$eval('.gx-stat[data-s="full"] b', (b) => b.classList.contains('gx-up')));
  const today = await page.$eval('#gxGrid i.is-now', (i) => ({ c: i.dataset.c, l: i.className }));
  ok('today carries two entries on the twelve weeks', today.c === '2' && /l2/.test(today.l), today);

  const rows = await page.$$eval('.gx-li', (r) => r.map((x) => ({ tag: x.querySelector('.gx-tag').textContent, w: x.querySelector('.gx-w').textContent, dots: x.querySelectorAll('.gx-dots .is-on').length, r: x.querySelector('.gx-r').textContent })));
  ok('the log shows both, with how many steps each met', rows.length === 2
    && rows.some((r) => r.tag === 'BT' && r.dots === 5 && r.r === '+3R' && /NQ Long/.test(r.w) && /Clean V/.test(r.w))
    && rows.some((r) => r.tag === 'LIVE' && r.dots === 4 && r.r === '-1R' && /MES Short/.test(r.w)), rows);
  await page.click('#gxFilt button[data-v="bt"]');
  ok('the filter narrows to backtests', (await page.$$eval('.gx-li', (r) => r.length)) === 1);
  await page.click('#gxFilt button[data-v="all"]');

  /* ── editing ── */
  await page.click('.gx-li:has(.gx-tag.is-live)');
  ok('pressing a row opens it in the checklist', (await page.textContent('#gxFormH')) === 'Editing trade'
    && await page.$eval('.gx-step[data-k="s1"] .gx-pill[data-v="d"]', (b) => b.getAttribute('aria-pressed')) === 'true');
  await pill(page, 's2', '1h');
  await page.click('#gxSave');
  st = await store(page);
  ok('an edit replaces rather than adds', st.e.length === 2 && st.e.find((e) => e.t === 'live').s2 === '1h');
  ok('and it now counts as a full checklist', /2 of 2/.test(await page.textContent('.gx-stat[data-s="full"] span')));

  /* ── the bin ── */
  await page.click('.gx-li:has(.gx-tag.is-live)');
  await page.click('#gxDel');
  ok('delete takes it off the log', (await page.$$eval('.gx-li', (r) => r.length)) === 1 && (await stat(page, 'live')) === '0');
  st = await store(page);
  ok('but keeps it in the store, binned', st.e.length === 2 && st.e.some((e) => e.del > 0));
  await page.click('#gxToast button');
  ok('undo puts it back', (await stat(page, 'live')) === '1');
  await page.click('.gx-li:has(.gx-tag.is-live)'); await page.click('#gxDel');
  await page.click('#gxFilt button[data-v="bin"]');
  ok('the bin shows what went', (await page.$$eval('.gx-li', (r) => r.length)) === 1);
  await page.click('.gx-li');
  ok('pressing a binned row restores it', (await stat(page, 'live')) === '1'
    && !(await page.$('#gxFilt button[data-v="bin"]')));

  /* A long log scrolls inside its card rather than growing the page. */
  await page.evaluate(() => { const st = JSON.parse(localStorage.getItem('gxt.v1')); const base = st.e[0];
    for (let i = 0; i < 40; i++) st.e.push(Object.assign({}, base, { id: 'z' + i, at: base.at - i })); localStorage.setItem('gxt.v1', JSON.stringify(st)); });
  await page.reload(); await page.waitForTimeout(200);
  const lc = await page.$$eval('.gx-cols > .gx-card', (s) => s.map((x) => Math.round(x.getBoundingClientRect().height)));
  const sc = await page.$eval('#gxLog', (l) => l.scrollHeight > l.clientHeight + 50);
  ok('a long log scrolls inside its card and the two stay one height', lc[0] === lc[1] && sc, { lc, sc });
  await page.evaluate(() => { const st = JSON.parse(localStorage.getItem('gxt.v1')); st.e = st.e.filter((e) => !/^z/.test(e.id)); localStorage.setItem('gxt.v1', JSON.stringify(st)); });
  await page.reload(); await page.waitForTimeout(200);

  ok('it survives a reload', await (async () => { await page.reload(); await page.waitForTimeout(200); return (await page.$$eval('.gx-li', (r) => r.length)) === 2; })());
  await c.close();

  /* ── a damaged store is repaired, not discarded ── */
  const old = Date.UTC(2026, 8, 1);
  const { c: c2, page: p2 } = await ctx({ v: 1, e: [
    { id: 'a', t: 'bt', d: '2026-10-30', at: Date.UTC(2026, 9, 30), bias: 'long', lv: ['dh', 'nope', 'dh'], s1: 'zz', res: 'w', r: '2' },
    { id: 'b', d: 'not a date' },
    null,
    { id: 'c', t: 'bt', d: '2026-09-01', at: old, bias: 'short', del: old },
  ] });
  const st2 = await store(p2);
  ok('a damaged entry costs itself and never the record', st2.e.length === 1 && st2.e[0].id === 'a'
    && st2.e[0].lv.join() === 'dh' && st2.e[0].s1 === '' && st2.e[0].r === 2, st2.e);
  ok('and a binned entry past thirty days is swept', !st2.e.some((e) => e.id === 'c'));
  await c2.close();

  ok('nothing leaves the browser', offOrigin.length === 0, offOrigin);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
