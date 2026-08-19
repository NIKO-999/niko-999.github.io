const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const P = `${BASE}/trading/index.html`;
const ok = [], bad = [];
const T = (n, c, d) => (c ? ok : bad).push(n + (c ? '' : '  →  ' + d));

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  pg.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.location().url || '')) errs.push('console: ' + m.text() + ' @' + (m.location().url||'')); });
  await pg.goto(P, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);

  T('no page errors on load', errs.length === 0, errs.join(' | '));

  // ── calendar columns: does every day sit under its real weekday?
  await pg.click('[data-view=calendar]');
  await pg.waitForTimeout(200);
  const colCheck = await pg.evaluate(() => {
    const out = [];
    for (const [y, m] of [[2026, 1], [2026, 2], [2026, 7], [2026, 10], [2026, 0]]) {
      cursor = new Date(y, m, 1); renderCalendar();
      const cols = +getComputedStyle(document.getElementById('grid')).getPropertyValue('--cols');
      const heads = [...document.querySelectorAll('#dow span')].map(s => s.textContent);
      const cells = [...document.querySelectorAll('#grid > *')];
      const rows = [];
      cells.forEach((c, i) => { (rows[Math.floor(i / cols)] ||= [])[i % cols] = c; });
      let wrong = null;
      cells.forEach((c, i) => {
        if (!c.dataset.date) return;
        const col = i % cols;
        const real = new Date(c.dataset.date + 'T00:00:00').getDay();
        const want = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][real];
        if (heads[col] !== want && !wrong) wrong = `${c.dataset.date} is a ${want} but sits under ${heads[col]}`;
      });
      out.push({ ym: `${y}-${m + 1}`, cols, wrong, n: cells.filter(c => c.dataset.date).length });
    }
    return out;
  });
  colCheck.forEach(r => T(`columns correct ${r.ym} (${r.n} days, ${r.cols} cols)`, !r.wrong, r.wrong));

  // ── TWR edge cases
  const twr = await pg.evaluate(() => {
    const run = evs => { state = { events: evs.map((e, i) => ({ id: 'x' + i, seq: i + 1, ...e })) };
      const t = totals(); return { twr: t.twr, wiped: t.wiped, profit: t.profit }; };
    return {
      preflow: run([{ k: 'trade', date: '2026-01-01', amt: 1000 }, { k: 'deposit', date: '2026-01-02', amt: 5000 }]),
      noflow:  run([{ k: 'trade', date: '2026-01-01', amt: 1000 }]),
      wiped:   run([{ k: 'deposit', date: '2026-01-01', amt: 1000 }, { k: 'trade', date: '2026-01-02', amt: -1500 },
                    { k: 'deposit', date: '2026-01-03', amt: 2000 }, { k: 'trade', date: '2026-01-04', amt: 300 }]),
      zeroWd:  run([{ k: 'deposit', date: '2026-01-01', amt: 1000 }, { k: 'trade', date: '2026-01-02', amt: 200 },
                    { k: 'withdraw', date: '2026-01-03', amt: 1200 }, { k: 'trade', date: '2026-01-04', amt: 800 }]),
      normal:  run([{ k: 'deposit', date: '2026-01-01', amt: 1000 }, { k: 'trade', date: '2026-01-02', amt: 100 }]),
      // same-day flow vs trade, entered in both orders — must agree
      orderA:  run([{ k: 'deposit', date: '2026-01-01', amt: 1000 },
                    { k: 'trade',   date: '2026-01-02', amt: 500 },
                    { k: 'deposit', date: '2026-01-02', amt: 9000 }]),
      orderB:  run([{ k: 'deposit', date: '2026-01-01', amt: 1000 },
                    { k: 'deposit', date: '2026-01-02', amt: 9000 },
                    { k: 'trade',   date: '2026-01-02', amt: 500 }]),
    };
  });
  T('pre-flow profit → return is undefined, not +0.0%', twr.preflow.twr === null, JSON.stringify(twr.preflow));
  T('no flows at all → undefined', twr.noflow.twr === null, JSON.stringify(twr.noflow));
  T('account wiped → −100%, not worsening on a win', twr.wiped.twr === -100 && twr.wiped.wiped, JSON.stringify(twr.wiped));
  T('withdrawal to exactly zero → undefined, not a silent 20%', twr.zeroWd.twr === null, JSON.stringify(twr.zeroWd));
  T('ordinary ledger → +10.0%', Math.abs(twr.normal.twr - 10) < 1e-9, JSON.stringify(twr.normal));
  T('same-day flow order does not change TWR',
    twr.orderA.twr === twr.orderB.twr, `${twr.orderA.twr} vs ${twr.orderB.twr}`);

  // ── flows and missed stay out of performance
  const clean = await pg.evaluate(() => {
    state = { events: [
      { id: 'a', seq: 1, k: 'deposit', date: '2026-01-01', amt: 1000 },
      { id: 'b', seq: 2, k: 'trade', date: '2026-01-02', amt: 100 },
      { id: 'c', seq: 3, k: 'trade', date: '2026-01-03', amt: -50 },
      { id: 'd', seq: 4, k: 'trade', date: '2026-01-04', amt: 0, out: 'missed' },
      { id: 'e', seq: 5, k: 'withdraw', date: '2026-01-05', amt: 200 },
    ] };
    const t = totals();
    // radars must see the same clean set: no flows, no missed setups
    state.events.push({ id: 'f', seq: 6, k: 'trade', date: '2026-01-06', amt: 90, risk: 45, sess: '02:00' });
    const rr = radarRows(SESSIONS, e => e.sess);
    return { n: t.n, wr: t.winRate, profit: t.profit, dd: t.dd,
             radarN: rr.reduce((s, r) => s + r.n, 0), radarR: rr.find(r => r.k === '02:00').R };
  });
  T('missed + flows excluded from trade count', clean.n === 2, JSON.stringify(clean));
  T('win rate 50% on 2 trades', clean.wr === 50, JSON.stringify(clean));
  T('profit = 50 (flows cancel)', clean.profit === 50, JSON.stringify(clean));
  T('max drawdown 50 (withdrawal is not a loss)', clean.dd === 50, JSON.stringify(clean));
  T('radar counts only graded, non-missed trades', clean.radarN === 1, JSON.stringify(clean));
  T('radar R is amt/risk', clean.radarR === 2, JSON.stringify(clean));

  // ── the journal, driven for real
  await pg.evaluate(() => { localStorage.clear(); });
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  // the app lands on Metrics now; the calendar is its own section
  await pg.click('[data-view=calendar]');
  await pg.waitForTimeout(200);
  await pg.click('#todayM');

  // open a day via its "+ trade" strip
  const firstDay = await pg.evaluate(() => document.querySelector('.day-new').dataset.date);
  await pg.click('.day-new');
  await pg.waitForTimeout(150);
  T('sheet opens from a day cell', await pg.isVisible('#sheet'), 'dialog not shown');
  T('date prefilled from the clicked day', await pg.inputValue('#tDate') === firstDay,
    `${await pg.inputValue('#tDate')} vs ${firstDay}`);
  /* Scoped to THIS sheet, and stated as the rule rather than as a
     count: every field label on it carries an icon. A bare count broke
     the moment a second dialog reused the same field markup, and it
     would have broken again on the next row added here. */
  const icoTally = await pg.evaluate(() => ({
    labels: document.querySelectorAll('#sheet .sheet-b .field label').length,
    icons:  document.querySelectorAll('#sheet .sheet-b .field label .ic svg').length,
  }));
  T('every field label carries an icon',
    icoTally.labels > 0 && icoTally.icons === icoTally.labels, JSON.stringify(icoTally));
  T('session dropdown is populated',
    await pg.$$eval('#tTime option', o => o.length) === 6, 'options');
  /* Read from the app, not written down here. The list gains a line when
     the method does, and a test that hardcodes its length fails on the
     day the method improves — which teaches you to ignore the test. */
  const N = await pg.evaluate(() => CHECKLISTS.continuation.length);
  T('checklist rendered', await pg.$$eval('#checks button', b => b.length) === N, 'rows');
  T(`tally starts at 0/${N}`, (await pg.textContent('#checkTally')) === `0/${N}`, await pg.textContent('#checkTally'));
  T('type defaults to continuation',
    await pg.getAttribute('#modeCont', 'aria-pressed') === 'true', 'not pressed');
  const contRules = await pg.$$eval('#checks button', b => b.map(x => x.dataset.line));
  await pg.click('#modeRev'); await pg.waitForTimeout(80);
  const revRules = await pg.$$eval('#checks button', b => b.map(x => x.dataset.line));
  T('reversal shows a different list', JSON.stringify(contRules) !== JSON.stringify(revRules),
    'same list both ways');
  T('reversal requires HTF SMT', revRules.some(r => /SMT/.test(r)), revRules.join(' | '));
  // Both lists walk the same funnel, so some steps are word-for-word the
  // same question and some are not. A shared step has to survive a swap;
  // one unique to a type has to be dropped, or the record would claim you
  // confirmed something the sheet never showed you.
  const shared = contRules.filter(r => revRules.includes(r));
  const onlyCont = contRules.filter(r => !revRules.includes(r));
  T('the two lists share their common steps', shared.length >= 2, shared.join(' | '));
  T('and differ where the trade differs', onlyCont.length >= 2, onlyCont.join(' | '));

  await pg.click('#modeCont'); await pg.waitForTimeout(60);
  await pg.click(`#checks button[data-line="${onlyCont[0].replace(/"/g, '&quot;')}"]`);
  await pg.waitForTimeout(60);
  await pg.click('#modeRev'); await pg.waitForTimeout(60);
  T('ticks unique to one type are dropped on swap',
    (await pg.textContent('#checkTally')) === `0/${N}`, await pg.textContent('#checkTally'));
  await pg.click('#modeCont'); await pg.waitForTimeout(60);
  await pg.click(`#checks button[data-line="${shared[0].replace(/"/g, '&quot;')}"]`);
  await pg.waitForTimeout(60);
  await pg.click('#modeRev'); await pg.waitForTimeout(60);
  T('a step both lists ask survives the swap',
    (await pg.textContent('#checkTally')) === `1/${N}`, await pg.textContent('#checkTally'));
  await pg.click(`#checks button[data-line="${shared[0].replace(/"/g, '&quot;')}"]`);
  await pg.waitForTimeout(60);
  await pg.click('#modeCont'); await pg.waitForTimeout(60);
  T('and the sheet is back to clean',
    (await pg.textContent('#checkTally')) === `0/${N}`, await pg.textContent('#checkTally'));

  await pg.fill('#tSym', 'GBPUSD');
  await pg.selectOption('#tTime', '18:00');
  await pg.fill('#tRisk', '100');
  await pg.fill('#tAmt', '250');
  await pg.fill('#tSetup', 'CISD');
  await pg.fill('#tNote', 'Swept Asia high, waited for the shift.');
  await pg.waitForTimeout(100);
  T('R multiple shown as +2.50R', (await pg.textContent('#rHint')).trim() === '+2.50R', await pg.textContent('#rHint'));

  await pg.click('#checks button:nth-child(1) , #checks li:nth-child(1) button');
  await pg.click('#checks li:nth-child(3) button');
  await pg.waitForTimeout(80);
  T('tally follows the ticks', (await pg.textContent('#checkTally')) === `2/${N}`, await pg.textContent('#checkTally'));

  // attach an image through the real picker
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC', 'base64');
  await pg.setInputFiles('input[type=file]', { name: 'chart.png', mimeType: 'image/png', buffer: png });
  await pg.waitForTimeout(500);
  T('chart image attached', await pg.$eval('#tShot', e => e.classList.contains('has')), 'no .has');

  await pg.click('#tradeSave');
  await pg.waitForTimeout(500);
  T('sheet closed after save', !(await pg.isVisible('#sheet')), 'still open');

  const saved = await pg.evaluate(() => {
    const e = JSON.parse(localStorage.getItem('ledger.v1')).events.find(x => x.k === 'trade');
    return e;
  });
  T('persisted with session', saved && saved.sess === '18:00', JSON.stringify(saved));
  T('persisted with type', saved && saved.mode === 'continuation', JSON.stringify(saved && saved.mode));
  T('persisted with risk', saved && saved.risk === 100, JSON.stringify(saved));
  T('persisted checklist as TEXT not indices',
    saved && Array.isArray(saved.checks) && saved.checks.length === 2 && typeof saved.checks[0] === 'string',
    JSON.stringify(saved && saved.checks));
  T('sample data cleared on first real entry',
    await pg.evaluate(() => JSON.parse(localStorage.getItem('ledger.v1')).events.length) === 1, 'extra events');

  // ── re-open the same trade from its card
  await pg.click('.tcard');
  await pg.waitForTimeout(600);
  T('card reopens the trade', (await pg.textContent('#sheetTitle')) === 'Edit trade', await pg.textContent('#sheetTitle'));
  T('fields restored', (await pg.inputValue('#tSym')) === 'GBPUSD' && (await pg.inputValue('#tRisk')) === '100',
    await pg.inputValue('#tSym'));
  T('notes restored', (await pg.inputValue('#tNote')).startsWith('Swept Asia'), await pg.inputValue('#tNote'));
  T('session restored', (await pg.inputValue('#tTime')) === '18:00', await pg.inputValue('#tTime'));
  T('checklist restored', (await pg.textContent('#checkTally')) === `2/${N}`, await pg.textContent('#checkTally'));
  T('type restored', await pg.getAttribute('#modeCont', 'aria-pressed') === 'true', 'wrong type');
  T('chart restored from IndexedDB', await pg.$eval('#tShot', e => e.classList.contains('has')), 'no image');
  T('delete offered when editing', await pg.isVisible('#tradeDelete'), 'hidden');

  // edit it and confirm we UPDATE rather than duplicate
  await pg.fill('#tAmt', '400');
  await pg.click('#tradeSave');
  await pg.waitForTimeout(400);
  const after = await pg.evaluate(() => JSON.parse(localStorage.getItem('ledger.v1')).events);
  T('editing updates in place, no duplicate', after.length === 1 && after[0].amt === 400,
    JSON.stringify(after.map(e => e.amt)));

  // ── search
  await pg.fill('#q', 'gbpusd');
  await pg.waitForTimeout(150);
  T('search keeps the match', await pg.$$eval('.tcard', n => n.length) === 1, 'cards');
  await pg.fill('#q', 'zzzz');
  await pg.waitForTimeout(150);
  T('search hides non-matches', await pg.$$eval('.tcard', n => n.length) === 0, 'cards');
  await pg.fill('#q', '');
  await pg.waitForTimeout(150);

  // ── delete
  pg.on('dialog', d => d.accept());
  await pg.click('.tcard');
  await pg.waitForTimeout(400);
  await pg.click('#tradeDelete');
  await pg.waitForTimeout(400);
  T('delete removes the trade',
    await pg.evaluate(() => JSON.parse(localStorage.getItem('ledger.v1')).events.length) === 0, 'still there');

  T('no page errors through the whole run', errs.length === 0, errs.join(' | '));

  await pg.screenshot({ path: '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad/cal.png' });
  await b.close();
  console.log('PASS ' + ok.length + '\n' + ok.map(s => '  ✓ ' + s).join('\n'));
  console.log('\nFAIL ' + bad.length + '\n' + bad.map(s => '  ✗ ' + s).join('\n'));
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
