const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const fs = require('fs');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n + (x ? '  ' + x : '')); } };
// a tiny valid PNG to drop on a tile
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAHElEQVQoz2P8z8Dwn4GKgIlhVMPwtoCJgYFhaGgAAOxWBBmYbWlNAAAAAElFTkSuQmCC', 'base64');
const IMG = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad/tile.png';
fs.writeFileSync(IMG, PNG);
(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 945 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(`${BASE}/arc/`, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.removeItem('arc.v1'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);

  console.log('\n── notes ──');
  await p.locator('#newBtn').click(); await p.waitForTimeout(250);
  ok('the editor has a notes field', await p.locator('#edNote').count() === 1);
  await p.locator('#edName').fill('Buy a house');
  await p.locator('#edNote').fill('Deposit saved by 2028.\nNot a flat — a garden matters.');
  const d = new Date(); d.setDate(d.getDate() + 60);
  const iso = (x) => `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
  await p.locator('#edFrom').fill(iso(new Date()));
  await p.locator('#edTo').fill(iso(d));
  await p.locator('#edSave').click(); await p.waitForTimeout(500);

  ok('the note is stored', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals[0].note.includes('garden')));
  await p.locator('#tabList').click(); await p.waitForTimeout(300);
  ok('the note shows in the list', /garden/.test(await p.locator('.list-note').first().textContent()));
  ok('newlines are kept', await p.locator('.list-note').first().evaluate(e => getComputedStyle(e).whiteSpace) === 'pre-wrap');
  await p.locator('#tabBoard').click(); await p.waitForTimeout(300);
  ok('the bar carries it as a tooltip', /garden/.test(await p.locator('.bar').first().getAttribute('title') || ''));

  await p.locator('.bar').first().click(); await p.waitForTimeout(300);
  ok('the note comes back into the editor', /garden/.test(await p.locator('#edNote').inputValue()));
  await p.locator('#edNote').fill('');
  await p.locator('#edSave').click(); await p.waitForTimeout(400);
  ok('clearing the note removes it from the list', await p.locator('.list-note').count() === 0);

  console.log('\n── the picture on a tile ──');
  await p.locator("#tabVision").click(); await p.waitForTimeout(400);
  ok('no remove button before there is an image',
     await p.locator('.tile-cut:not([hidden])').count() === 0);
  const [fc] = await Promise.all([ p.waitForEvent('filechooser'), p.locator('.tile-art').first().click() ]);
  await fc.setFiles(IMG);
  await p.waitForTimeout(900);
  ok('the image is set', await p.locator('.tile-art.has').count() === 1);
  ok('the remove button appears with it', await p.locator('.tile-cut:not([hidden])').count() === 1);
  ok('the label names the goal, not its id',
     !/[0-9a-f]{8}/.test(await p.locator('.tile-art.has').getAttribute('aria-label')),
     await p.locator('.tile-art.has').getAttribute('aria-label'));

  await p.locator('.tile-cut:not([hidden])').first().click();
  await p.waitForTimeout(700);
  ok('the image is gone', await p.locator('.tile-art.has').count() === 0);
  ok('and the remove button goes with it', await p.locator('.tile-cut:not([hidden])').count() === 0);
  ok('the goal itself survived', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('arc.v1')).goals.length) === 1);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.locator("#tabVision").click(); await p.waitForTimeout(500);
  ok('it stays removed after a reload', await p.locator('.tile-art.has').count() === 0);

  ok('no page errors', errs.length === 0, errs.join(' | '));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
