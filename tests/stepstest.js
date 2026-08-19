const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + (x ? '  ' + x : '')); } };
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) errs.push(r.status()+' '+r.url()); });
  await p.goto(`${BASE}/arc/`, { waitUntil: 'networkidle' });
  await p.evaluate(g => localStorage.setItem('arc.v1', JSON.stringify(g)), { goals: [
    { id: 'g1', name: 'Gene Keys, 90 days', from: d(-30), to: d(60), horizon: 'now', kind: 'span', tone: 'soft' },
  ]});
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(600);

  console.log('\n── adding steps ──');
  await p.locator('.bar').first().click(); await p.waitForTimeout(350);
  ok('the editor offers steps', await p.locator('#edAddStep').count() === 1);
  ok('a goal with none shows no rows', await p.locator('.ed-step').count() === 0);
  for (const t of ['Keys 1-22', 'Write up the first shadow', 'Keys 23-45']) {
    await p.locator('#edAddStep').click();
    await p.locator('.ed-step input').last().fill(t);
  }
  ok('three rows', await p.locator('.ed-step').count() === 3);
  await p.locator('#edSave').click(); await p.waitForTimeout(500);

  ok('stored on the goal', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps.length) === 3);
  ok('none done yet', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps.every(x => !x.doneOn)));

  console.log('\n── the bar now counts work ──');
  let bar = await p.evaluate(() => { const e = document.querySelector('.bar');
    return { through: e.style.getPropertyValue('--through'), badge: e.querySelector('.badge').textContent }; });
  ok('badge counts steps, not days', bar.badge === '0 / 3', JSON.stringify(bar));
  ok('fill is 0% with nothing done', bar.through === '0%', JSON.stringify(bar));

  console.log('\n── ticking ──');
  await p.locator('#tabList').click(); await p.waitForTimeout(400);
  ok('steps render in the list', await p.locator('.step').count() === 3);
  ok('the header counts them', /0 of 3 done/.test(await p.locator('.step-h').textContent()));
  await p.locator('.step').first().click(); await p.waitForTimeout(450);
  ok('ticking marks it pressed', await p.locator('.step').first().getAttribute('aria-pressed') === 'true');
  ok('and stamps the day', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps[0].doneOn) === d(0));
  ok('the header follows', /1 of 3 done/.test(await p.locator('.step-h').textContent()));
  ok('it shows when it was done', /done /.test(await p.locator('.step').first().textContent()));

  await p.locator('#tabBoard').click(); await p.waitForTimeout(400);
  bar = await p.evaluate(() => { const e = document.querySelector('.bar');
    return { through: e.style.getPropertyValue('--through'), badge: e.querySelector('.badge').textContent }; });
  ok('the bar filled by work', bar.through === '33%' && bar.badge === '1 / 3', JSON.stringify(bar));

  console.log('\n── un-ticking, and persistence ──');
  await p.locator('#tabList').click(); await p.waitForTimeout(350);
  await p.locator('.step').first().click(); await p.waitForTimeout(450);
  ok('un-ticking clears the date', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps[0].doneOn) === null);
  await p.locator('.step').first().click(); await p.waitForTimeout(450);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.locator('#tabList').click(); await p.waitForTimeout(400);
  ok('survives a reload', await p.locator('.step[aria-pressed="true"]').count() === 1);

  console.log('\n── the completion date sticks to its own step ──');
  await p.locator('#tabBoard').click(); await p.waitForTimeout(300);
  await p.locator('.bar').first().click(); await p.waitForTimeout(400);
  ok('the editor shows which is done', await p.locator('.ed-step .tick').count() === 1);
  await p.locator('.ed-step input').nth(1).fill('Renamed the untouched one');
  await p.locator('#edSave').click(); await p.waitForTimeout(500);
  const after = await p.evaluate(() => JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps);
  ok('renaming a neighbour did not move the date',
     !!after[0].doneOn && !after[1].doneOn && after[1].name === 'Renamed the untouched one',
     JSON.stringify(after));

  console.log('\n── removing ──');
  await p.locator('.bar').first().click(); await p.waitForTimeout(400);
  await p.locator('.ed-step .cut').last().click();
  await p.locator('#edSave').click(); await p.waitForTimeout(500);
  ok('a removed step is gone', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].steps.length) === 2);

  console.log('\n── a goal with no steps is unchanged ──');
  await p.evaluate(g => localStorage.setItem('arc.v1', JSON.stringify(g)), { goals: [
    { id: 'g2', name: 'Learn piano', from: d(-40), to: d(200), horizon: 'now', kind: 'span', tone: 'accent' },
  ]});
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  bar = await p.evaluate(() => { const e = document.querySelector('.bar');
    return { through: e.style.getPropertyValue('--through'), badge: e.querySelector('.badge').textContent }; });
  ok('still a clock when there is nothing to count', /^d\d+ \/ \d+$/.test(bar.badge), JSON.stringify(bar));
  ok('and no step rows', await p.locator('.step').count() === 0);

  ok('no page errors', errs.length === 0, errs.join(' | '));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
