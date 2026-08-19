/* Arc — end to end. Every assertion drives the real UI in a real
   browser: nothing is asserted against a function's return value that a
   person could not also see on screen. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const URL = `${BASE}/arc/`;

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + name); }
  else { fail++; console.log('  \x1b[31m✗ ' + name + '\x1b[0m' + (extra ? '  ' + extra : '')); }
};

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const shift = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  p.on('console', m => {
    /* The console message for a failed subresource never names the file,
       so it cannot be filtered here — the response hook above is what
       actually distinguishes a missing favicon from a missing script. */
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text());
  });

  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('arc.v1'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);

  console.log('\n── the examples ──');
  ok('opens with examples', await p.locator('#planTitle').textContent() === 'Example plan');
  const today = await p.evaluate(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });
  ok('today is the real today', (await p.locator('#chartAlt').textContent()).includes(
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })));
  const dotL = await p.locator('.now-dot').evaluate(e => parseFloat(e.style.left));
  ok('now-dot sits inside the window', dotL > 0 && dotL < 100, `at ${dotL}%`);

  console.log('\n── adding a goal ──');
  await p.locator('#newBtn').click();
  await p.waitForTimeout(300);
  ok('editor opens', await p.locator('#ed').evaluate(e => e.open));
  await p.locator('#edName').fill('Buy a house');
  await p.locator('#edFrom').fill(shift(30));
  await p.locator('#edTo').fill(shift(900));
  await p.locator('#edHorizon').selectOption('year');
  await p.locator('#edSave').click();
  await p.waitForTimeout(500);

  ok('editor closed on save', !(await p.locator('#ed').evaluate(e => e.open)));
  ok('examples were cleared by the first real goal',
    await p.locator('#planTitle').textContent() === 'Long-term plan');
  const names = () => p.evaluate(() => [...document.querySelectorAll('#list .list-name')].map(e => e.textContent));
  ok('the goal is the only one', JSON.stringify(await names()) === JSON.stringify(['Buy a house']),
    JSON.stringify(await names()));
  ok('it drew a bar', await p.locator('.bar').count() === 1);
  ok('axis stretched to reach it', await p.locator('#span').textContent().then(t => /years/.test(t)),
    await p.locator('#span').textContent());

  console.log('\n── it survives a reload ──');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  ok('still there after reload', JSON.stringify(await names()) === JSON.stringify(['Buy a house']));
  ok('still not the examples', await p.locator('#planTitle').textContent() === 'Long-term plan');

  console.log('\n── editing ──');
  await p.locator('.bar').first().click();
  await p.waitForTimeout(300);
  ok('a bar opens its own goal', await p.locator('#edName').inputValue() === 'Buy a house');
  ok('dates came back', await p.locator('#edFrom').inputValue() === shift(30));
  ok('horizon came back', await p.locator('#edHorizon').inputValue() === 'year');
  await p.locator('#edName').fill('Buy a flat');
  await p.locator('#edSave').click();
  await p.waitForTimeout(400);
  ok('rename applied, no duplicate', JSON.stringify(await names()) === JSON.stringify(['Buy a flat']),
    JSON.stringify(await names()));

  console.log('\n── the three shapes ──');
  await p.locator('#newBtn').click(); await p.waitForTimeout(250);
  await p.locator('#edName').fill('Prop firm payout');
  await p.locator('#edMoment').click();
  ok('a moment hides the end date', await p.locator('#edToF').evaluate(e => e.hidden));
  await p.locator('#edFrom').fill(shift(200));
  await p.locator('#edSave').click(); await p.waitForTimeout(400);
  ok('moment drew a diamond, not a bar', await p.locator('.milestone').count() === 1);
  ok('bars unchanged by it', await p.locator('.bar').count() === 1);

  await p.locator('#newBtn').click(); await p.waitForTimeout(250);
  await p.locator('#edName').fill('Sabbatical');
  await p.locator('#edNone').click();
  ok('undated hides both dates', await p.locator('#edFromF').evaluate(e => e.hidden));
  await p.locator('#edHorizon').selectOption('someday');
  await p.locator('#edSave').click(); await p.waitForTimeout(400);
  ok('undated goal has no bar and no diamond',
    await p.locator('.bar').count() === 1 && await p.locator('.milestone').count() === 1);
  ok('but it is in the list', (await names()).includes('Sabbatical'));

  console.log('\n── the vision board ──');
  /* Vision is the third tab of the plan now, not a place on the rail. */
  ok('there is no Vision on the rail',
    await p.locator('.rail [data-view="vision"]').count() === 0);
  await p.locator('#tabVision').click();
  await p.waitForTimeout(400);
  ok('and the tab selects', await p.locator('#tabVision').getAttribute('aria-selected') === 'true');
  ok('the tabs read board, vision, list', await p.evaluate(() =>
    [...document.querySelectorAll('.seg [role="tab"]')].map(t => t.id).join()
    === 'tabBoard,tabVision,tabList'),
    await p.evaluate(() => [...document.querySelectorAll('.seg [role="tab"]')].map(t => t.id)));
  /* Arrows must walk the row as it is drawn, not as it was built. */
  await p.locator('#tabVision').press('ArrowRight');
  await p.waitForTimeout(300);
  ok('right-arrow from Vision lands on List',
    await p.locator('#tabList').getAttribute('aria-selected') === 'true');
  await p.locator('#tabList').press('ArrowLeft');
  await p.waitForTimeout(300);
  ok('and back again', await p.locator('#tabVision').getAttribute('aria-selected') === 'true');
  ok('with the plan still on screen', await p.locator('#mainCol').isVisible());
  const bands = await p.evaluate(() =>
    [...document.querySelectorAll('.band')].map(b => b.querySelector('.band-h span').textContent));
  ok('goals land in their horizon bands',
    JSON.stringify(bands) === JSON.stringify(['Now', 'This year', 'Someday']),
    JSON.stringify(bands));
  ok('tile timing is computed, not typed',
    /Starts|Day |In /.test(await p.locator('.tile-when').first().textContent()),
    await p.locator('.tile-when').first().textContent());
  await p.locator('.tile-body').first().click();
  await p.waitForTimeout(300);
  ok('a tile opens its goal', await p.locator('#ed').evaluate(e => e.open));
  await p.locator('#edCancel').click();
  await p.waitForTimeout(200);

  console.log('\n── finishing, and the calibration ──');
  await p.locator('#tabBoard').click(); await p.waitForTimeout(300);
  await p.locator('.bar').first().click(); await p.waitForTimeout(300);
  await p.locator('#edFrom').fill(shift(-100));
  await p.locator('#edTo').fill(shift(-50));           // planned 50 days
  await p.locator('#edDone').check();
  await p.waitForTimeout(150);
  ok('a finish date appears when you tick Finished',
    !(await p.locator('#edDoneOnF').evaluate(e => e.hidden)));
  await p.locator('#edDoneOn').fill(shift(-25));       // actually took 75
  await p.locator('#edSave').click(); await p.waitForTimeout(400);

  ok('finished goal leaves the board', await p.locator('.bar').count() === 0);
  ok('and leaves the list', !(await names()).includes('Buy a flat'));
  await p.locator('[data-view="past"]').click(); await p.waitForTimeout(400);
  ok('it is in Past', await p.locator('#stripes li').count() === 1);
  const calib = await p.locator('#calib').textContent();
  ok('the multiplier is computed from real dates', /1\.5×/.test(calib), calib);

  console.log('\n── deleting ──');
  await p.locator('[data-view="board"]').click(); await p.waitForTimeout(300);
  p.on('dialog', d => d.accept());
  await p.locator('.milestone').first().click(); await p.waitForTimeout(300);
  await p.locator('#edDelete').click();
  await p.waitForTimeout(500);
  ok('the moment is gone', await p.locator('.milestone').count() === 0);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok('and stays gone after reload', await p.locator('.milestone').count() === 0);

  console.log('\n── search ──');
  await p.locator('#q').fill('sabb');
  await p.waitForTimeout(300);
  ok('search finds an undated goal', await p.locator('#nList').textContent() === '1',
    await p.locator('#nList').textContent());
  await p.locator('#q').fill('');
  await p.waitForTimeout(300);

  console.log('\n── a wrong-way-round pair ──');
  await p.locator('#newBtn').click(); await p.waitForTimeout(250);
  await p.locator('#edName').fill('Backwards');
  await p.locator('#edFrom').fill(shift(60));
  await p.locator('#edTo').fill(shift(10));
  await p.locator('#edSave').click(); await p.waitForTimeout(400);
  const back = await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals.find(g => g.name === 'Backwards'));
  ok('dates were swapped rather than refused', back && back.from < back.to,
    JSON.stringify(back));

  ok('no page errors through the whole run', errs.length === 0, errs.join(' | '));

  console.log(`\n\x1b[1mPASS ${pass}   FAIL ${fail}\x1b[0m`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
