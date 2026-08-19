/* Recording an outcome — and in particular a scratch.

   The form could not save a trade that made nothing. `raw > 0` refused
   it, and the message said "enter the amount" to somebody looking at
   the amount they had just entered. Everything else in the app already
   knew what a flat trade was; only the form could not produce one. */
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

  /* A real ledger, not the sample — the demo is swapped out wholesale on
     the first real record, which makes counting events meaningless. */
  await p.evaluate(() => {
    state = { events: [{ id: uid(), k: 'deposit', date: '2026-08-01', amt: 5000, note: 'x' }], bin: [] };
    commit('seed');
  });
  await p.evaluate(() => goto('calendar'));
  await p.waitForTimeout(350);
  const openDay = async (i) => { await p.locator('.day-new').nth(i).click(); await p.waitForTimeout(280); };
  const trades = () => p.evaluate(() => state.events.filter(e => e.k === 'trade'));

  // ── the field says which magnitude it wants ────────────────────
  await openDay(2);
  ok('it asks for a Profit on a win', await p.evaluate(() => {
    document.getElementById('sideWin').click();
    return document.getElementById('tAmtLbl').textContent === 'Profit';
  }));
  ok('and for a Loss on a loss', await p.evaluate(() => {
    document.getElementById('sideLoss').click();
    return document.getElementById('tAmtLbl').textContent === 'Loss';
  }));
  await p.fill('#tRisk', '568');
  ok('a loss hints the risk, since that is the usual answer',
     await p.evaluate(() => document.getElementById('tAmt').placeholder) === '568.00');
  ok('but only as a hint — nothing is entered for you',
     await p.evaluate(() => document.getElementById('tAmt').value) === '');

  // ── the message names what belongs there ───────────────────────
  await p.click('#tradeSave'); await p.waitForTimeout(300);
  ok('an empty field is refused', await p.evaluate(() => document.getElementById('sheet').open));
  ok('and the refusal says 0 is allowed', await p.evaluate(() =>
    /Enter 0 if it scratched/.test(document.getElementById('tAmt').validationMessage)),
    await p.evaluate(() => document.getElementById('tAmt').validationMessage));
  ok('worded for the outcome you picked', await p.evaluate(() =>
    /lose/.test(document.getElementById('tAmt').validationMessage)));

  // ── a scratch saves ────────────────────────────────────────────
  await p.fill('#tAmt', '0');
  await p.click('#tradeSave'); await p.waitForTimeout(400);
  ok('a loss of 0 saves', await p.evaluate(() => !document.getElementById('sheet').open));
  const t1 = await trades();
  ok('exactly one trade recorded', t1.length === 1, t1.length);
  ok('stored as zero', t1[0].amt === 0, t1[0].amt);
  ok('and not as negative zero, which a ledger should never carry',
     await p.evaluate(() => !Object.is(state.events.find(e => e.k === 'trade').amt, -0)));
  ok('it reads back as flat rather than as a loss', await p.evaluate(() => {
    const e = state.events.find(x => x.k === 'trade');
    return (e.amt > 0 ? 'win' : e.amt < 0 ? 'loss' : 'flat') === 'flat';
  }));
  ok('the log renders it', await p.evaluate(async () => {
    goto('log');
    document.getElementById('logOnly').click();
    await new Promise(r => setTimeout(r, 250));
    const row = document.querySelector('#logList .lg');
    return !!row && /Flat/.test(row.innerText);
  }));

  // ── and a real loss still works ────────────────────────────────
  await p.evaluate(() => goto('calendar')); await p.waitForTimeout(300);
  await openDay(6);
  await p.click('#sideLoss');
  await p.fill('#tRisk', '568');
  await p.fill('#tAmt', '568');
  await p.click('#tradeSave'); await p.waitForTimeout(400);
  const t2 = await trades();
  ok('a loss of 568 is stored signed', t2.some(e => e.amt === -568), t2.map(e => e.amt));

  // ── a win of 0 too, and missed is unaffected ───────────────────
  await openDay(8);
  await p.click('#sideWin');
  await p.fill('#tAmt', '0');
  await p.click('#tradeSave'); await p.waitForTimeout(400);
  ok('a win of 0 saves as well', (await trades()).filter(e => e.amt === 0).length === 2);

  await openDay(10);
  await p.click('#sideMiss');
  ok('a missed setup still stops asking', await p.evaluate(() =>
    document.getElementById('tAmt').disabled && !document.getElementById('tAmt').required));
  await p.click('#tradeSave'); await p.waitForTimeout(400);
  ok('and saves with nothing typed', (await trades()).some(e => e.out === 'missed'));

  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
