/* The metrics landing screen.

   The four outcome figures are the noisiest numbers this app owns and
   none of them is a decision you can take at six in the morning. They
   are not deleted — they fold. What sits on top is the half of the
   screen you can act on, and none of it is ever painted as a verdict. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
};

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok('no page errors on load', errs.length === 0, errs);

  const labels = (sel) => p.evaluate((s) =>
    [...document.querySelectorAll(s + ' .metric')].map(m => m.querySelector('span').textContent.trim()), sel);

  // ── what is on top ─────────────────────────────────────────────
  const top = await labels('#metrics');
  ok('Net P/L still leads', top[0] === 'Net P/L', top);
  ok('and the rest are things you control', await (async () => {
    const want = ['Plan followed', 'Written up', 'Rehearsed', 'Checked in'];
    return want.every(w => top.includes(w));
  })(), top);
  const JUDGES = ['Win rate', 'Average R', 'Profit factor', 'Expectancy'];
  ok('none of the four verdicts is on the landing tiles',
     JUDGES.every(j => !top.includes(j)), top);

  /* A low figure here is a thing to go and do, not a thing to feel. */
  ok('and no tile on top is painted in the down colour', await p.evaluate(() =>
    [...document.querySelectorAll('#metrics .metric')]
      .filter(m => m.querySelector('span').textContent.trim() !== 'Net P/L')
      .every(m => !m.classList.contains('down'))));
  ok('their bars are never the down colour either', await p.evaluate(() =>
    [...document.querySelectorAll('#metrics .mbar i')].every(i => !i.classList.contains('down'))));

  // ── and where the four went ────────────────────────────────────
  ok('the fold exists, shut', await p.evaluate(() =>
    document.getElementById('mtBody').hidden
    && document.getElementById('mtToggle').getAttribute('aria-expanded') === 'false'));
  ok('the heading is still a heading, with the button inside it', await p.evaluate(() => {
    const t = document.getElementById('mtToggle');
    return t.tagName === 'BUTTON' && t.parentElement.tagName === 'H3'
        && t.getAttribute('aria-controls') === 'mtBody';
  }));
  ok('the trade count shows without opening it',
     /\d+ trade/.test(await p.locator('#mtN').textContent()));

  await p.click('#mtToggle'); await p.waitForTimeout(250);
  const inside = await labels('#mtOut');
  ok('all four are inside', JUDGES.every(j => inside.includes(j)), inside);
  ok('opening does not disturb what is on top',
     JSON.stringify(await labels('#metrics')) === JSON.stringify(top));
  ok('it remembers being opened', await (async () => {
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    return !(await p.evaluate(() => document.getElementById('mtBody').hidden));
  })());

  // ── the sample size is stated honestly ─────────────────────────
  ok('a small sample says so', await p.evaluate(() => {
    const t = totals();
    const txt = document.getElementById('mtSample').textContent;
    return t.n > 0 && t.n < 30 ? /too few/.test(txt) : true;
  }, await p.locator('#mtSample').textContent()));

  await p.evaluate(() => {
    /* Forty trades, so the caveat has to change its mind. */
    const ev = [{ id: uid(), k: 'deposit', date: '2026-01-01', amt: 20000, note: 'x' }];
    for (let i = 0; i < 40; i++) ev.push({ id: uid(), k: 'trade', date: '2026-03-0' + (i % 9 + 1),
      amt: i % 3 ? 200 : -150, risk: 100, sym: 'X', setup: 'CISD', mode: 'continuation' });
    state = { events: ev, bin: [] }; commit('many');
  });
  await p.waitForTimeout(400);
  ok('a bigger one stops apologising', await p.evaluate(() =>
    /enough to read/.test(document.getElementById('mtSample').textContent)),
    await p.locator('#mtSample').textContent());

  // ── the process figures are computed, not decorative ───────────
  await p.evaluate(() => {
    const ev = [{ id: uid(), k: 'deposit', date: '2026-01-01', amt: 20000, note: 'x' }];
    /* Ten trades: six with the whole checklist, three with a note. */
    for (let i = 0; i < 10; i++) ev.push({
      id: uid(), k: 'trade', date: '2026-03-0' + (i % 9 + 1), amt: 100, risk: 100,
      sym: 'X', setup: 'CISD', mode: 'continuation',
      of: 6, checks: new Array(i < 6 ? 6 : 3).fill(0).map((_, j) => CHECKLISTS.continuation[j]),
      note: i < 3 ? 'wrote it up' : '',
    });
    state = { events: ev, bin: [] }; commit('process');
  });
  await p.waitForTimeout(400);
  const val = (l) => p.evaluate((l) => {
    const m = [...document.querySelectorAll('#metrics .metric')]
      .find(x => x.querySelector('span').textContent.trim() === l);
    return m ? m.querySelector('b').textContent.trim() : null;
  }, l);
  ok('Plan followed counts full checklists', await val('Plan followed') === '6/10', await val('Plan followed'));
  ok('Written up counts notes', await val('Written up') === '3/10', await val('Written up'));

  await p.evaluate(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const day = (i) => { const d = new Date(t); d.setDate(d.getDate() - i); return iso(d); };
    ckState = { days: [0, 1, 2].map(i => ({ date: day(i), x: .3, y: .7, flags: [], note: '', at: 0 })) };
    ckWrite();
    btState = { runs: [0, 1].map(i => ({ id: 'r' + i, date: day(i), sess: '10:00', setup: 'CISD',
      mode: 'continuation', note: 'x', of: 6, checks: [], at: 0 })), bin: [] };
    btWrite();
    renderAll();
  });
  await p.waitForTimeout(350);
  ok('Checked in reads the check-in store', await val('Checked in') === '3', await val('Checked in'));
  ok('Rehearsed reads the backtest store', await val('Rehearsed') === '2', await val('Rehearsed'));
  ok('and neither is money', await p.evaluate(() =>
    !/\$/.test([...document.querySelectorAll('#metrics .metric')]
      .filter(m => ['Rehearsed', 'Checked in'].includes(m.querySelector('span').textContent.trim()))
      .map(m => m.textContent).join(' '))));

  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
