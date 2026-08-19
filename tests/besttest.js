const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + (x ? '  ' + x : '')); } };
/* A ledger where each session gets a stated number of wins and losses,
   so the three conditions can be exercised one at a time. */
const make = (spec) => {
  const ev = [{ id: 1, k: 'deposit', date: '2026-06-01', amt: 10000 }];
  let id = 2, d = 0;
  for (const [sess, wins, losses] of spec) {
    const put = (amt) => { d++; ev.push({ id, k: 'trade', seq: id++,
      date: `2026-07-${String((d % 28) + 1).padStart(2, '0')}`,
      amt, risk: 100, sym: 'ES', sess, mode: 'reversal' }); };
    for (let i = 0; i < wins; i++) put(100);
    for (let i = 0; i < losses; i++) put(-100);
  }
  return { events: ev };
};
(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });

  /* Always the app's own answer, never a re-implementation of the rule
     in the test — otherwise the test agrees with itself, not the app. */
  const load = async (spec) => {
    await p.evaluate(v => localStorage.setItem('ledger.v1', JSON.stringify(v)), make(spec));
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    return p.evaluate(() => ({
      winner: bestCandle(),
      shown: document.getElementById('cpOpen').textContent,
      hidden: document.getElementById('cpBest').hidden,
    }));
  };

  let r = await load([['02:00', 7, 1], ['06:00', 3, 3], ['22:00', 2, 2]]);
  ok('names the clear winner', r.winner === '02:00', JSON.stringify(r));
  ok('badge shown exactly when the panel is on the winner',
     r.hidden === (r.winner !== r.shown), JSON.stringify(r));

  r = await load([['02:00', 4, 1], ['06:00', 1, 3]]);
  ok('silent under six trades', r.winner === null, JSON.stringify(r));

  r = await load([['02:00', 5, 3], ['06:00', 5, 4]]);       // +2R against +1R
  ok('silent when best by less than an R', r.winner === null, JSON.stringify(r));

  r = await load([['02:00', 2, 6], ['06:00', 1, 7]]);       // nothing profitable
  ok('silent when no candle is profitable', r.winner === null, JSON.stringify(r));

  r = await load([['02:00', 9, 1], ['06:00', 2, 4]]);
  ok('a strong winner still qualifies', r.winner === '02:00', JSON.stringify(r));

  await p.evaluate(() => localStorage.removeItem('ledger.v1'));
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  ok('hidden on the sample ledger', await p.locator('#cpBest').evaluate(e => e.hidden));
  ok('sample ledger has no winner at all', await p.evaluate(() => bestCandle()) === null);

  ok('no page errors', errs.length === 0, errs.join(' | '));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
