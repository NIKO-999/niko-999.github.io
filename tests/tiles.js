/* Where the numbers live.

   Metrics is the screen you open before trading, so it carries the
   clock, the gate, the money and the curve — and nothing that scores
   you. Every tile that used to stand there had a denominator, and a
   denominator is a scoreboard however it is worded: "6 of 10" does not
   read as six done, it reads as four missed.

   The four verdicts moved to the Log, which is somewhere you go on
   purpose to read back. */
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

  // ── metrics carries one figure ─────────────────────────────────
  const top = await labels('#metrics');
  ok('Metrics shows Net P/L and nothing else', top.length === 1 && top[0] === 'Net P/L', top);
  ok('and it is the full width of the row', await p.evaluate(() =>
    document.querySelector('#metrics .metric').classList.contains('wide')));
  ok('nothing on it carries a denominator', await p.evaluate(() =>
    ![...document.querySelectorAll('#metrics .metric b')].some(x => /\d\s*\/\s*\d/.test(x.textContent))));
  ok('the old results fold is gone entirely', await p.evaluate(() =>
    !document.getElementById('mtToggle') && !document.getElementById('mtBody')
    && !document.querySelector('.mt-fold')));

  const JUDGES = ['Win rate', 'Average R', 'Profit factor', 'Expectancy'];
  ok('none of the four verdicts is on Metrics', await p.evaluate((j) =>
    !j.some(x => document.getElementById('metricsSection').innerText.includes(x)), JUDGES));

  /* The clock, the gate and the curve are what the screen is for. */
  ok('the candle panel is still there', await p.locator('#cp').count() === 1);
  ok('and the curve, and both radars', await p.evaluate(() =>
    !!document.getElementById('curve') || !!document.querySelector('#metricsSection .chartbox')));

  // ── and the Log carries the four ───────────────────────────────
  await p.evaluate(() => goto('log'));
  await p.waitForTimeout(350);
  const onLog = await labels('#logStats');
  ok('all four are on the Log', JUDGES.every(j => onLog.includes(j)), onLog);
  ok('above the filters, not buried under them', await p.evaluate(() => {
    const s = document.getElementById('logStats').getBoundingClientRect();
    const f = document.querySelector('#logSection .lg-filters').getBoundingClientRect();
    return s.top < f.top;
  }));
  ok('open, not folded — reading them here is deliberate', await p.evaluate(() =>
    !document.getElementById('logStats').hidden
    && document.getElementById('logStats').offsetHeight > 40));

  // ── the sample is stated honestly, wherever they live ──────────
  ok('a small sample says so', await p.evaluate(() => {
    const t = totals();
    const txt = document.getElementById('logSample').textContent;
    return t.n > 0 && t.n < 30 ? /too few/.test(txt) : true;
  }), await p.locator('#logSample').textContent());

  await p.evaluate(() => {
    const ev = [{ id: uid(), k: 'deposit', date: '2026-01-01', amt: 20000, note: 'x' }];
    for (let i = 0; i < 40; i++) ev.push({ id: uid(), k: 'trade', date: '2026-03-0' + (i % 9 + 1),
      amt: i % 3 ? 200 : -150, risk: 100, sym: 'X', setup: 'CISD', mode: 'continuation' });
    state = { events: ev, bin: [] }; commit('many');
  });
  await p.waitForTimeout(400);
  ok('a bigger one stops apologising', await p.evaluate(() =>
    /enough to read/.test(document.getElementById('logSample').textContent)),
    await p.locator('#logSample').textContent());
  ok('and the figures updated with it', await p.evaluate(() => {
    const m = [...document.querySelectorAll('#logStats .metric')]
      .find(x => x.querySelector('span').textContent.trim() === 'Win rate');
    return /\d+%/.test(m.querySelector('b').textContent);
  }));

  // ── an empty ledger says nothing rather than 0.00 ──────────────
  await p.evaluate(() => { state = { events: [], bin: [] }; commit('empty'); });
  await p.waitForTimeout(350);
  ok('an empty ledger does not open a losing dashboard', await p.evaluate(() =>
    ![...document.querySelectorAll('#logStats .metric')].some(m => m.classList.contains('down'))));
  ok('and says so rather than showing zeros', await p.evaluate(() =>
    /Nothing recorded yet/.test(document.getElementById('logSample').textContent)));

  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
