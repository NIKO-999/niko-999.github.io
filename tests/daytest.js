/* The day is the button now, and the Playbook is gone. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  pg.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });

  console.log('\n── the playbook is gone');
  const rail = await pg.$$eval('[data-view]', bs => bs.map(b => b.dataset.view));
  ok(!rail.includes('playbook'), `no rail button for it (${rail.join(' ')})`);
  ok(await pg.locator('#playbookSection').count() === 0, 'no section for it');
  ok(await pg.evaluate(() => typeof renderPlaybook === 'undefined'), 'no renderer for it');
  /* A stored route pointing at it must not land on a blank screen. */
  await pg.evaluate(() => goto('playbook'));
  ok(await pg.isVisible('#metricsSection'), 'an old route to it lands on the metrics');
  ok(await pg.isHidden('#calendarSection'), 'and nothing else is showing');
  /* The two helpers it left behind are still doing their job. */
  await pg.evaluate(() => goto('calendar'));
  ok(await pg.evaluate(() => pbR(3.5) === '+3.5R'), 'the R formatter survived it');
  ok(await pg.evaluate(() => /^22:00/.test(pbSess('22:00'))), 'and the candle namer');

  console.log('\n── a day opens a trade, with nothing telling you so');
  await pg.evaluate(() => { cursor = new Date(2026, 7, 1); renderCalendar(); });
  const label = await pg.textContent('.day-new');
  ok(label.trim() === '', `the "+ trade" caption is gone (${JSON.stringify(label)})`);
  ok(await pg.evaluate(() => {
    const b = document.querySelector('.day-new');
    return !!b && b.getAttribute('aria-label').startsWith('Record a trade on');
  }), 'but it still says so to a screen reader');

  /* It has to cover the cell, or "click anywhere on the day" is a lie. */
  const box = await pg.evaluate(() => {
    /* Not .blank. A month opening mid-week pads the grid with filler
       cells that carry .day, are aria-hidden and hold no button — this
       asked for "a day that is not today" and got one of those the
       first time August opened on a Saturday with the weekend shown. */
    const d = document.querySelector('.day:not(.today):not(.blank)');
    const b = d.querySelector('.day-new');
    const a = d.getBoundingClientRect(), c = b.getBoundingClientRect();
    return { dayW: Math.round(a.width), dayH: Math.round(a.height),
             btnW: Math.round(c.width), btnH: Math.round(c.height) };
  });
  /* inset:0 sits inside the 1px border, so 2px of slack in each axis.
     The delegated handler on .day catches those edge pixels anyway. */
  ok(box.dayW - box.btnW <= 2 && box.dayH - box.btnH <= 2,
     `it covers the whole cell (${box.btnW}×${box.btnH} of ${box.dayW}×${box.dayH})`);

  /* Clicking the middle of an empty day. */
  const cell = await pg.locator('#grid .day').nth(8);
  await cell.click({ position: { x: 60, y: 60 } });
  ok(await pg.isVisible('#sheet'), 'clicking an empty day opens a new trade');
  const on = await pg.inputValue('#tDate');
  const want = await cell.getAttribute('data-date');
  ok(on === want, `dated to the day you clicked (${on})`);
  ok((await pg.textContent('#sheetTitle')).trim() === 'Record a trade', 'as a new one, not an old one');
  await pg.evaluate(() => sheet.close());

  /* A day with a trade on it: the card wins, the space around it does not. */
  await pg.evaluate(async () => {
    goto('calendar');
    openTrade('2026-08-05');
    document.getElementById('tAmt').value = '300';
    document.getElementById('tSym').value = 'AAA';
    document.getElementById('tradeSave').click();
    await new Promise(r => setTimeout(r, 300));
    cursor = new Date(2026, 7, 1); renderCalendar();
  });
  await pg.waitForTimeout(200);
  ok(await pg.locator('#grid .tcard').count() === 1, 'the trade drew a card');
  await pg.locator('#grid .tcard').first().click();
  ok((await pg.textContent('#sheetTitle')).trim() === 'Edit trade',
     'clicking the card opens that trade, not a new one');
  await pg.evaluate(() => sheet.close());

  /* The header strip carries the date and the day's net. It is not a
     control, so pointer-events are off it and the click lands on the
     target underneath — which is the whole point of covering the cell. */
  const day5 = pg.locator('#grid .day[data-date="2026-08-05"]');
  await day5.click({ position: { x: 20, y: 8 } });
  ok((await pg.textContent('#sheetTitle')).trim() === 'Record a trade',
     'clicking the date at the top of a day that HAS a trade starts a new one');
  ok(await pg.inputValue('#tDate') === '2026-08-05', 'on that day');
  await pg.evaluate(() => sheet.close());

  console.log('\n' + (errs.length ? '  problems: ' + [...new Set(errs)].join(' | ')
                                  : '  ✓ no page errors, no 404s'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
