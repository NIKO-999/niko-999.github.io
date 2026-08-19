/* A deleted trade has to be gettable back — with its chart. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

const CHART = `(async () => {
  const c = document.createElement('canvas');
  c.width = 900; c.height = 500;
  const g = c.getContext('2d');
  g.fillStyle = '#0d1117'; g.fillRect(0, 0, 900, 500);
  g.fillStyle = '#3fb950'; g.fillRect(60, 150, 300, 200);
  return await new Promise(r => c.toBlob(r, 'image/png'));
})()`;

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  pg.on('dialog', d => d.accept());
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });

  console.log('\n── it is not there until it is needed');
  ok(await pg.isHidden('#binBtn'), 'no bin icon on a ledger nothing has been deleted from');

  /* A real trade, recorded through the sheet, with a chart and a note. */
  await pg.evaluate(async (mk) => {
    liven();
    openTrade(iso(new Date()));
    await takeShot(new File([await eval(mk)], 'c.png', { type: 'image/png' }));
    document.getElementById('tSym').value = 'AAA';
    document.getElementById('tSetup').value = 'CISD';
    document.getElementById('tRisk').value = '250';
    document.getElementById('tAmt').value = '875';
    document.getElementById('tNote').value = 'The one I did not mean to lose.';
    document.getElementById('tradeSave').click();
    await new Promise(r => setTimeout(r, 500));
  }, CHART);
  const id = await pg.evaluate(() => state.events.filter(e => e.k === 'trade').slice(-1)[0].id);
  ok(await pg.evaluate((id) => !!state.events.find(e => String(e.id) === String(id)), id),
     'the trade is in the ledger');
  ok(await pg.evaluate(async (id) => !!(await SHOTS.get(id)), id), 'and its chart is stored');

  console.log('\n── deleting it');
  await pg.evaluate((id) => { const e = state.events.find(x => String(x.id) === String(id));
    openTrade(e.date, e.id); }, id);
  await pg.click('#tradeDelete');
  await pg.waitForTimeout(400);

  ok(!(await pg.evaluate((id) => !!state.events.find(e => String(e.id) === String(id)), id)),
     'it leaves the ledger');
  ok(await pg.evaluate((id) => state.bin.some(r => String(r.id) === String(id)), id),
     'and lands in the bin instead of nowhere');
  ok(await pg.evaluate(async (id) => !!(await SHOTS.get(id)), id),
     'its chart is kept — a restore that lost the picture is half a restore');
  ok(await pg.isVisible('#binBtn'), 'the bin icon appears');
  ok((await pg.textContent('#binN')).trim() === '1', 'showing how much is in it');
  ok(/recover it from the bin/i.test(await pg.textContent('#say')),
     'and it says so rather than "deleted"');

  /* It has to survive a reload — an in-memory bin is not a bin. */
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  ok(await pg.isVisible('#binBtn'), 'the bin survives a reload');
  ok(await pg.evaluate((id) => state.bin.some(r => String(r.id) === String(id)), id),
     'with the record still in it');

  console.log('\n── getting it back');
  await pg.click('#binBtn');
  await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => document.getElementById('bin').open), 'the icon opens the bin');
  ok(await pg.locator('.bin-row').count() === 1, 'one row in it');
  const what = await pg.textContent('.bin-what b');
  ok(/AAA/.test(what) && /CISD/.test(what), `named so you can tell which it was (${what.trim()})`);
  ok(/ago|just now/.test(await pg.textContent('.bin-when')), 'and when it went');
  await pg.waitForFunction(() =>
    /url\(/.test(document.querySelector('.bin-thumb').style.backgroundImage), null, { timeout: 4000 })
    .then(() => ok(true, 'with its chart drawn beside it'))
    .catch(() => ok(false, 'with its chart drawn beside it'));

  await pg.screenshot({ path: D + '/bin-open.png' });

  await pg.click('[data-back]');
  await pg.waitForTimeout(400);
  ok(await pg.evaluate((id) => !!state.events.find(e => String(e.id) === String(id)), id),
     'Restore puts it back in the ledger');
  ok(await pg.evaluate((id) => !state.bin.some(r => String(r.id) === String(id)), id),
     'and takes it out of the bin');
  ok(await pg.isHidden('#binBtn'), 'the icon goes away with the last record');

  const back = await pg.evaluate((id) => {
    const e = state.events.find(x => String(x.id) === String(id));
    return { note: e.note, amt: e.amt, sym: e.sym, setup: e.setup, shot: e.shot,
             hasDelAt: 'delAt' in e };
  }, id);
  ok(back.note === 'The one I did not mean to lose.' && back.amt === 875
     && back.sym === 'AAA' && back.setup === 'CISD',
     'everything it held came back with it');
  ok(!back.hasDelAt, 'and it does not carry the bin\'s bookkeeping back into the ledger');
  ok(await pg.evaluate(async (id) => !!(await SHOTS.get(id)), id), 'the chart came back too');

  console.log('\n── a ledger row goes the same way');
  await pg.evaluate(() => {
    goto('settings');
    document.getElementById('fKind').value = 'deposit';
    document.getElementById('fAmt').value = '500';
    document.getElementById('flowForm').dispatchEvent(new Event('submit', { cancelable: true }));
  });
  await pg.waitForTimeout(300);
  const nBefore = await pg.evaluate(() => state.events.length);
  await pg.locator('#ledger .drop').first().click();
  await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => state.events.length) === nBefore - 1, 'the row leaves the ledger');
  ok(await pg.evaluate(() => state.bin.length) === 1, 'and it is in the bin');
  ok(await pg.isVisible('#binBtn'), 'the icon is back');

  console.log('\n── and out for good, when asked twice');
  await pg.click('#binBtn');
  await pg.waitForTimeout(250);
  await pg.click('[data-forget]');
  await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => state.bin.length) === 0, 'the ✕ removes it for good');
  ok(await pg.isHidden('#binBtn'), 'and the icon goes with it');

  console.log('\n── the sweep');
  const swept = await pg.evaluate(async () => {
    liven();
    const old = { id: 'old1', k: 'trade', out: 'win', date: '2020-01-01', amt: 100, seq: 1 };
    const fresh = { id: 'new1', k: 'trade', out: 'win', date: '2020-01-02', amt: 100, seq: 2 };
    state.bin = [
      Object.assign({}, old, { delAt: Date.now() - 40 * 86400000 }),
      Object.assign({}, fresh, { delAt: Date.now() - 2 * 86400000 }),
    ];
    await SHOTS.put('old1', new Blob(['x']));
    writeStore(state);
    binSweep();
    return { ids: state.bin.map(r => r.id), shot: !!(await SHOTS.get('old1')) };
  });
  ok(swept.ids.length === 1 && swept.ids[0] === 'new1',
     `anything past 30 days is swept (${swept.ids.join(',')})`);
  ok(!swept.shot, 'and its chart with it, rather than left occupying space');

  console.log('\n── a backup carries it');
  const bk = await pg.evaluate(() => {
    const payload = JSON.parse(JSON.stringify({ events: state.events, bin: bin() }));
    return { hasBin: Array.isArray(payload.bin), n: payload.bin.length };
  });
  ok(bk.hasBin && bk.n === 1, 'the bin is in the export payload');
  const older = await pg.evaluate(() => {
    /* A backup written before the bin existed must not be able to wipe
       one, and must not crash on restore either. */
    const parsed = { events: [], res: [] };
    return { bin: Array.isArray(parsed.bin) ? parsed.bin : [] };
  });
  ok(Array.isArray(older.bin) && older.bin.length === 0,
     'and an older backup restores to an empty one rather than undefined');

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
