/* Clicking a chart should open the chart, not the file browser. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const U = `${BASE}/trading/`;
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

/* A chart wider than any window it will be shown in, so "fits" and
   "full size" are genuinely different pictures. */
const PUT = (w = 1400, h = 780) => `(async () => {
  const c = document.createElement('canvas');
  c.width = ${w}; c.height = ${h};
  const g = c.getContext('2d');
  g.fillStyle = '#0d1117'; g.fillRect(0, 0, ${w}, ${h});
  g.fillStyle = '#3fb950';
  for (let i = 0; i < 40; i++) g.fillRect(20 + i * 34, 200 + (i % 7) * 30, 12, 90);
  const b = await new Promise(r => c.toBlob(r, 'image/png'));
  await takeShot(new File([b], 'chart.png', { type: 'image/png' }));
})()`;

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1280, height: 820 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));

  /* If anything still reaches for the file browser we want to know, not
     to sit waiting on a native dialog. */
  let chose = 0;
  pg.on('filechooser', (fc) => { chose++; fc.setFiles([]).catch(() => {}); });

  await pg.goto(U, { waitUntil: 'networkidle' });

  console.log('\n── an empty slot still goes looking');
  await pg.evaluate(() => openTrade(iso(new Date())));
  ok(await pg.isHidden('#shotActs'), 'no Replace/Remove with nothing to act on');
  await pg.click('#tShot');
  await pg.waitForTimeout(250);
  ok(chose === 1, 'clicking an empty slot opens the file browser');
  ok(await pg.isHidden('#lens'), 'and does not open the viewer');

  console.log('\n── a full slot opens the chart');
  await pg.evaluate(PUT());
  await pg.waitForFunction(() => shotBtn.classList.contains('has'), null, { timeout: 5000 });
  ok(await pg.isVisible('#shotActs'), 'Replace and Remove appear');
  ok((await pg.textContent('.shot-empty')).trim() === 'Click to open',
     'and the slot says what a click will do');

  const before = chose;
  await pg.click('#tShot');
  ok(await pg.isVisible('#lens'), 'clicking the chart opens the viewer');
  ok(chose === before, 'and never touches the file browser');
  ok(await pg.isVisible('#sheet'), 'the trade sheet is still underneath');

  /* Fitted: the picture is 1400 wide and the window is 1280. */
  const fit = await pg.evaluate(() => {
    const i = document.getElementById('lensImg');
    return { nat: i.naturalWidth, drawn: Math.round(i.getBoundingClientRect().width) };
  });
  ok(fit.nat === 1400, 'the viewer holds the full-resolution picture');
  ok(fit.drawn < fit.nat, `and fits it to the window (${fit.drawn} of ${fit.nat})`);
  ok(/full size/i.test(await pg.textContent('#lensHint')), 'the hint offers full size');

  console.log('\n── and full size when you ask');
  await pg.click('#lensImg');
  const zoom = await pg.evaluate(() =>
    Math.round(document.getElementById('lensImg').getBoundingClientRect().width));
  ok(zoom === 1400, `clicking the chart draws it 1:1 (${zoom})`);
  ok(await pg.evaluate(() => {
    const p = document.getElementById('lensPane');
    return p.scrollWidth > p.clientWidth;
  }), 'and it can be scrolled, rather than being cropped away');
  ok(/fit/i.test(await pg.textContent('#lensHint')), 'the hint now offers to fit it back');

  await pg.click('#lensImg');
  ok(await pg.evaluate(() =>
    Math.round(document.getElementById('lensImg').getBoundingClientRect().width)) < 1400,
     'clicking again fits it back');

  console.log('\n── the ways out');
  await pg.evaluate(() => document.getElementById('lensPane').click());
  ok(await pg.isHidden('#lens'), 'clicking the dark around it closes the viewer');
  ok(await pg.isVisible('#sheet'), 'and leaves the trade sheet open');

  await pg.click('#tShot');
  await pg.keyboard.press('Escape');
  ok(await pg.isHidden('#lens'), 'Esc closes the viewer');
  ok(await pg.isVisible('#sheet'), 'and the half-typed trade underneath survives it');

  await pg.click('#tShot');
  await pg.click('#lensX');
  ok(await pg.isHidden('#lens'), 'the close button closes it');

  console.log('\n── replace and remove');
  const b2 = chose;
  await pg.click('#shotSwap');
  await pg.waitForTimeout(250);
  ok(chose === b2 + 1, 'Replace is the one that goes looking for a file');

  await pg.click('#shotDrop');
  ok(!(await pg.evaluate(() => shotBtn.classList.contains('has'))), 'Remove takes it off');
  ok(await pg.isHidden('#shotActs'), 'and the two buttons go with it');
  ok((await pg.textContent('.shot-empty')).trim() === 'Click, paste or drop an image',
     'the slot asks for one again');
  ok(await pg.evaluate(() => shotDirty === true), 'and the removal is marked to be saved');

  console.log('\n── nothing is left pointing at a revoked picture');
  await pg.evaluate(PUT(600, 400));
  await pg.waitForFunction(() => shotBtn.classList.contains('has'), null, { timeout: 5000 });
  await pg.click('#tShot');
  ok(await pg.isVisible('#lens'), 'the viewer is open on the new chart');
  await pg.evaluate(PUT(500, 300));                  // replaced while it is open
  await pg.waitForTimeout(300);
  ok(await pg.isHidden('#lens'), 'replacing the chart closes the viewer over it');

  await pg.click('#tShot');
  await pg.evaluate(() => sheet.close());
  /* close is queued as a task rather than dispatched inline, so the
     handler has not run at the moment close() returns. WAIT for it
     rather than guessing at 120ms — the guess held when this file ran
     alone and lost the race once inside the full suite, which is the
     worst way for a check to fail: not on the thing it tests. */
  /* Both conditions, because dialog.close() flips .open synchronously
     but fires its `close` event as a task — and the src is dropped in
     that handler. Waiting on .open alone let the assertion read the
     src one tick too early, which is why it only ever lost the race
     inside the full suite. Bounded, so a regression times out and both
     checks below still fail rather than hanging. */
  await pg.waitForFunction(() => {
    const l = document.getElementById('lens');
    return (l.hidden || !l.open || getComputedStyle(l).display === 'none')
      && !document.getElementById('lensImg').getAttribute('src');
  }, null, { timeout: 5000 }).catch(() => {});
  ok(await pg.isHidden('#lens'), 'and closing the sheet closes it too');
  ok(await pg.isHidden('#sheet'), 'the sheet is closed');
  ok(await pg.evaluate(() => !document.getElementById('lensImg').getAttribute('src')),
     'the viewer is not holding a URL it no longer owns');

  console.log('\n── reading a trade can still see its chart');
  const id = await pg.evaluate(async () => {
    openTrade(iso(new Date()));
    const c = document.createElement('canvas');
    c.width = 300; c.height = 200;
    const b = await new Promise(r => c.toBlob(r, 'image/png'));
    await takeShot(new File([b], 'c.png', { type: 'image/png' }));
    document.getElementById('tAmt').value = '75';
    document.getElementById('tradeSave').click();
    await new Promise(r => setTimeout(r, 400));
    return state.events.filter(e => e.k).slice(-1)[0].id;
  });
  await pg.evaluate((id) => {
    const e = state.events.find(x => x.id === id);
    openTrade(e.date, e.id);
    sheet.classList.add('ro');
    sheet.querySelectorAll('input, select, textarea, button').forEach((el) => {
      if (el.id === 'sheetX' || el.id === 'tShot') return;
      el.disabled = true;
    });
  }, id);
  await pg.waitForFunction(() => shotBtn.classList.contains('has'), null, { timeout: 5000 });
  ok(!(await pg.evaluate(() => shotBtn.disabled)), 'a read-only sheet leaves the chart clickable');
  ok(await pg.isHidden('#shotActs'), 'but Replace and Remove are not offered');
  const b3 = chose;
  await pg.click('#tShot');
  ok(await pg.isVisible('#lens'), 'and it opens the chart');
  ok(chose === b3, 'without ever offering to go find another one');

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
