const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + (x ? '  ' + x : '')); } };
const SEED = () => {
  const ev = [{ id: 1, k: 'deposit', date: '2026-07-01', amt: 10000, note: 'Opening' }];
  const T = (id, date, amt, o) => Object.assign({ id, k: 'trade', seq: id, date, amt, risk: 100 }, o);
  ev.push(T(2, '2026-08-13',  240, { sym: 'GBPUSD', setup: 'CISD',  mode: 'reversal',     sess: '02:00', note: 'Waited for the sweep.\n\nHeld through the retrace.', checks: ['a','b','c','d','e'] }));
  ev.push(T(3, '2026-08-12', -100, { sym: 'NQ',     setup: 'Sweep', mode: 'continuation', sess: '06:00', note: 'No SMT and I took it anyway.', checks: ['a','b','c'] }));
  ev.push(T(4, '2026-08-11',    0, { sym: 'XAUUSD', setup: 'SMT',   mode: 'reversal',     sess: '22:00', note: 'Set up exactly as written, not at the desk.', out: 'missed' }));
  ev.push(T(5, '2026-08-10',  180, { sym: 'ES',     setup: 'CISD',  mode: 'reversal',     sess: '18:00' }));  // no note
  ev.push(T(6, '2026-07-27',  180, { sym: 'ES',     setup: 'CISD',  mode: 'reversal',     sess: '18:00', note: 'V-shape, in and out inside the hour.' }));
  localStorage.setItem('ledger.v1', JSON.stringify({ events: ev }));
};
(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await p.evaluate(SEED);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);

  ok('the rail has a Log tab', await p.locator('[data-view="log"]').count() === 1);
  await p.locator('[data-view="log"]').click();
  await p.waitForTimeout(400);

  const rows = () => p.locator('.lg').count();
  ok('shows only trades with a note by default', await rows() === 4, String(await rows()));
  ok('the noteless trade is excluded', !(await p.locator('#logList').textContent()).includes('No note on this one'));
  ok('meta counts shown of total', /4 of 5/.test(await p.locator('#logMeta').textContent()),
     await p.locator('#logMeta').textContent());

  console.log('\n── order and grouping ──');
  const first = await p.locator('.lg .lg-sym').first().textContent();
  ok('newest first', first === 'GBPUSD', first);
  const months = await p.evaluate(() => [...document.querySelectorAll('.lg-month b')].map(e => e.textContent));
  ok('grouped by month', JSON.stringify(months) === JSON.stringify(['August 2026', 'July 2026']), JSON.stringify(months));
  const aug = await p.locator('.lg-month em').first().textContent();
  ok('the month carries its own R', /R across 3/.test(aug), aug);

  console.log('\n── what an entry says ──');
  const e1 = await p.locator('.lg').first();
  ok('names the session from the profile', (await e1.textContent()).includes('London'));
  ok('shows the R, not the dollars', (await e1.locator('.lg-r').textContent()).trim() === '+2.40R');
  ok('keeps the paragraph break', (await e1.locator('.lg-note').evaluate(x => getComputedStyle(x).whiteSpace)) === 'pre-wrap');
  /* "n of m", where m is what THAT trade was judged against — its own
     stored figure if it has one, otherwise today's list. Hardcoding it
     means the test breaks the day a line is added to the method. */
  const j1 = await p.evaluate((id) => {
    const e = logged().find(x => String(x.id) === String(id));
    return e ? { on: (e.checks || []).length,
                 of: e.of || CHECKLISTS[e.mode].length } : null;
  }, await e1.getAttribute('data-id'));
  ok('shows the rules ticked',
     (await e1.locator('.lg-rules').textContent()).includes(`${j1.on} of ${j1.of}`),
     await e1.locator('.lg-rules').textContent());
  ok('pips match the count', await e1.locator('.lg-pips i.on').count() === j1.on);

  console.log('\n── filters ──');
  await p.locator('#logOut button[data-out="loss"]').click(); await p.waitForTimeout(300);
  ok('losses only', await rows() === 1 && (await p.locator('.lg-sym').textContent()) === 'NQ');
  await p.locator('#logOut button[data-out="missed"]').click(); await p.waitForTimeout(300);
  ok('missed only — and missed trades are reachable', await rows() === 1
     && (await p.locator('.lg-sym').textContent()) === 'XAUUSD', String(await rows()));
  await p.locator('#logOut button[data-out="all"]').click(); await p.waitForTimeout(300);

  await p.locator('#logSetup').selectOption('CISD'); await p.waitForTimeout(300);
  ok('by setup', await rows() === 2, String(await rows()));
  await p.locator('#logSetup').selectOption(''); await p.waitForTimeout(250);
  await p.locator('#logMode').selectOption('continuation'); await p.waitForTimeout(300);
  ok('by type', await rows() === 1);
  await p.locator('#logMode').selectOption(''); await p.waitForTimeout(250);
  await p.locator('#logSess').selectOption('02:00'); await p.waitForTimeout(300);
  ok('by candle', await rows() === 1);
  await p.locator('#logSess').selectOption(''); await p.waitForTimeout(250);

  ok('setup list is built from what you have traded',
     JSON.stringify(await p.evaluate(() => [...document.getElementById('logSetup').options].map(o => o.value)))
       === JSON.stringify(['', 'CISD', 'SMT', 'Sweep']));

  await p.locator('#logOnly').click(); await p.waitForTimeout(300);
  ok('the toggle brings noteless trades in', await rows() === 5, String(await rows()));
  ok('and says so on the row', (await p.locator('#logList').textContent()).includes('No note on this one'));
  await p.locator('#logOnly').click(); await p.waitForTimeout(300);

  console.log('\n── search and opening ──');
  await p.locator('#q').fill('sweep'); await p.waitForTimeout(400);
  ok('the topbar search reads note text', await rows() === 2, String(await rows()));
  await p.locator('#q').fill(''); await p.waitForTimeout(400);

  await p.locator('.lg').first().click(); await p.waitForTimeout(500);
  ok('a row opens that trade', await p.locator('#tSym').inputValue() === 'GBPUSD');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);

  ok('no page errors', errs.length === 0, errs.join(' | '));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
