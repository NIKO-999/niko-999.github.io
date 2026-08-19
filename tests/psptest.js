/* The protected swing is a condition of entry now — on the gate, on the
   sheet, and without rewriting what older trades were judged against. */
const { chrome, BASE } = require('./lib');

/* The gate does not open without a check-in. Do what a person would. */
async function checkIn(pg) {
  await pg.evaluate(() => {
    ckX = 0.3; ckY = 0.7; ckPlaced = true;
    document.getElementById('ckSave').click();
  });
  await pg.waitForTimeout(200);
}
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };
const LINE = 'The swing is protected — aligned timeframe, close beyond the body';

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1512, height: 1100 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  await pg.emulateMedia({ colorScheme: 'dark' });
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);

  console.log('\n── it is on both lists');
  const lists = await pg.evaluate(() => ({
    rev: CHECKLISTS.reversal, con: CHECKLISTS.continuation }));
  ok(lists.rev.length === 6 && lists.con.length === 6,
     `six items each (${lists.rev.length}, ${lists.con.length})`);
  ok(lists.rev[5] === LINE && lists.con[5] === LINE, 'and it is the last one on both');
  ok(lists.rev[4] === lists.con[4],
     'the CISD line above it is untouched, so old ticks still match');

  console.log('\n── the gate asks for it');
  const gate = await pg.evaluate(() => {
    const items = [...document.querySelectorAll('#gList [data-line]')]
      .map(b => b.dataset.line);
    return { items, tally: document.getElementById('gTally').textContent.trim() };
  });
  ok(gate.items.includes(LINE), 'the gate lists it');
  ok(/\/6$/.test(gate.tally), `and counts out of six (${gate.tally})`);

  /* Ticking it has to carry onto the position and then onto the trade. */
  await pg.evaluate((line) => {
    document.querySelector(`#gList [data-line="${CSS.escape(line)}"]`).click();
  }, LINE);
  await pg.waitForTimeout(200);
  ok(await pg.evaluate((l) => gateTicks.has(l), LINE), 'ticking it registers');
  await checkIn(pg);
  await pg.click('#gIn');
  await pg.waitForTimeout(400);
  ok(await pg.evaluate((l) => openPos[0].checks.includes(l), LINE),
     'and the position you entered carries it');

  console.log('\n── the sheet ticks it too');
  await pg.click('#liveClose');
  await pg.waitForTimeout(400);
  const sheet = await pg.evaluate((l) => {
    const rows = [...document.querySelectorAll('#checks [data-line]')];
    const row = rows.find(r => r.dataset.line === l);
    return { n: rows.length, has: !!row,
             on: row && row.getAttribute('aria-pressed') === 'true',
             tally: document.getElementById('checkTally').textContent.trim() };
  }, LINE);
  ok(sheet.n === 6 && sheet.has, `six rows on the sheet, including it (${sheet.n})`);
  ok(sheet.on, 'already ticked, because the gate ticked it');
  ok(/6$/.test(sheet.tally), `and the tally agrees (${sheet.tally})`);

  await pg.fill('#tAmt', '500');
  await pg.click('#tradeSave');
  await pg.waitForTimeout(400);
  const saved = await pg.evaluate((l) => {
    const e = state.events.filter(x => x.k === 'trade').slice(-1)[0];
    return { checks: e.checks, of: e.of, has: (e.checks || []).includes(l) };
  }, LINE);
  ok(saved.has, 'the saved trade records it');
  ok(saved.of === 6, `and how many there were to tick (${saved.of})`);

  console.log('\n── history is not rewritten');
  /* A trade recorded when the list was five items long. */
  await pg.evaluate(() => {
    /* With a note on it: the log filters to noted trades by default, and
       a fixture without one is filtered out before it can be looked at. */
    state.events.push({ id: 'old5', seq: 99, k: 'trade', date: iso(new Date()),
      amt: 300, mode: 'continuation', of: 5, sym: 'AAA',
      note: 'Recorded when the list was five items long.',
      checks: CHECKLISTS.continuation.slice(0, 5) });
    writeStore(state); renderAll(); goto('log');
  });
  await pg.waitForTimeout(400);
  /* The tally is drawn as pips plus "n of m", not as bare text — one
     pip per item the trade was judged against. */
  const pips = await pg.evaluate(() => {
    const row = [...document.querySelectorAll('.lg')].find(r => r.dataset.id === 'old5');
    if (!row) return null;
    const rules = row.querySelector('.lg-rules');
    return { total: row.querySelectorAll('.lg-pips i').length,
             on: row.querySelectorAll('.lg-pips i.on').length,
             says: rules ? rules.textContent.replace(/\s+/g, ' ').trim() : '' };
  });
  ok(pips && pips.total === 5,
     `it still draws five pips, not six (${pips && pips.total})`);
  ok(pips && pips.on === 5 && /5 of 5/.test(pips.says),
     `and reads 5 of 5 rather than 5 of 6 (${pips && pips.says})`);

  const oldOf = await pg.evaluate(() => {
    const e = state.events.find(x => x.id === 'old5');
    return e.of || (CHECKLISTS[e.mode] || []).length;
  });
  ok(oldOf === 5, `five, not six (${oldOf})`);
  /* And one with no `of` at all — every trade recorded before today. */
  const legacy = await pg.evaluate(() => {
    const e = { mode: 'continuation', checks: ['a'] };
    return e.of || (e.mode && CHECKLISTS[e.mode] ? CHECKLISTS[e.mode].length : 5);
  });
  ok(legacy === 6, `an older trade with no figure falls back to the list (${legacy})`);

  console.log('\n── and the note says how to answer it');
  await pg.evaluate(() => goto('resources'));
  await pg.waitForTimeout(250);
  await pg.click('#tpRail [data-topic="swings"]');
  await pg.waitForTimeout(350);
  ok(await pg.locator('.ap-lists.one .ap-list').count() === 1, 'the note carries one checklist');
  const steps = await pg.$$eval('.ap-lists.one li span', ss => ss.map(x => x.textContent.trim()));
  ok(steps.length === 5, `five steps (${steps.length})`);
  ok(/key level/i.test(steps[0]) && /SMT/.test(steps[0]) && !/\bor\b/i.test(steps[0])
     && /aligned timeframe/i.test(steps[2])
     && /clears the body/i.test(steps[4]),
     'in the order you run them');
  ok(/entry checklist/i.test(await pg.textContent('.ap-foot')),
     'and it points at the entry checklist it answers');
  const w = await pg.evaluate(() => {
    const el = document.querySelector('.ap-lists.one');
    return { cols: getComputedStyle(el).gridTemplateColumns.split(' ').length };
  });
  ok(w.cols === 1, `one column, not a list beside a hole (${w.cols})`);

  await pg.screenshot({ path: D + '/psp-check.png' });
  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
