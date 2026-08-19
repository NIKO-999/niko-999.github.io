/* The picker in two levels: sections, then the backdrops inside one. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log('  ok  ' + n); }
  else { fail++; console.log('FAIL  ' + n + (x !== undefined ? '  → ' + JSON.stringify(x) : '')); } };

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  for (const app of ['trading', 'arc']) {
    const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
    const errs = [], bad = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await p.goto(`${BASE}/${app}/`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    console.log(`\n── ${app}`);
    ok('loads clean', errs.length === 0, errs);

    // ── level two, because it opens where you are ────────────────
    await p.click('#palBtn'); await p.waitForTimeout(300);
    ok('opens into the section holding the current backdrop',
      (await p.locator('.pal-back').textContent()).trim() === 'Nature');
    ok('six backdrops in Nature', await p.locator('#palMenu .swatch').count() === 6);
    ok('the current one is ticked', await p.evaluate(() =>
      document.querySelector('.swatch[aria-checked="true"]').dataset.palette
      === document.documentElement.dataset.bg));
    ok('the radiogroup is the inner list, not the menu', await p.evaluate(() =>
      !document.getElementById('palMenu').getAttribute('role')
      && document.querySelectorAll('#palMenu .pal-group[role="radiogroup"]').length === 1));
    ok('every swatch dot carries a real palette colour', await p.evaluate(() =>
      [...document.querySelectorAll('#palMenu .swatch .dot')].every(d => {
        const v = getComputedStyle(d).backgroundColor;
        return v && v !== 'rgba(0, 0, 0, 0)';
      })));

    // ── back out to the sections ─────────────────────────────────
    await p.click('.pal-back'); await p.waitForTimeout(300);
    ok('back shows the two sections',
      (await p.locator('.pal-cat').allTextContents()).map(t => t.replace(/\d+/g, '').trim()).join() === 'Nature,Abstract');
    ok('with their counts', await p.evaluate(() =>
      [...document.querySelectorAll('.pal-cat .pal-n')].map(n => n.textContent).join() === '6,8'));
    ok('and no radiogroup at this level',
      await p.locator('#palMenu [role="radiogroup"]').count() === 0);

    // ── into Abstract, and pick one ──────────────────────────────
    await p.click('.pal-cat[data-section="Abstract"]'); await p.waitForTimeout(300);
    ok('eight backdrops in Abstract', await p.locator('#palMenu .swatch').count() === 8);
    await p.click('.swatch[data-palette="jade"]'); await p.waitForTimeout(500);
    ok('picking sets the backdrop', await p.evaluate(() =>
      document.documentElement.dataset.bg) === 'jade');
    ok('and its palette, which is a different name', await p.evaluate(() =>
      document.documentElement.dataset.palette) === 'jade');
    ok('the label follows', (await p.locator('#palLabel').textContent()) === 'Jade');

    // a shared palette really is shared
    await p.click('#palBtn'); await p.waitForTimeout(300);
    await p.click('.swatch[data-palette="iris"]'); await p.waitForTimeout(500);
    ok('iris and violet share one palette', await p.evaluate(() =>
      document.documentElement.dataset.bg === 'iris'
      && document.documentElement.dataset.palette === 'violet'));

    // ── it survives a reload ─────────────────────────────────────
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    ok('the choice survives a reload', await p.evaluate(() =>
      document.documentElement.dataset.bg === 'iris'
      && document.documentElement.dataset.palette === 'violet'));
    ok('and the first paint had both, before any script ran', await p.evaluate(() =>
      !!document.documentElement.dataset.bg));

    // ── a stored backdrop that no longer exists ──────────────────
    await p.evaluate(() => localStorage.setItem('arc.palette', 'grotto'));
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    ok('one of the deleted five falls back rather than blanking', await p.evaluate(() =>
      document.documentElement.dataset.bg === 'nightfall'));
    ok('and nothing 404s for it', !bad.some(u => /grotto|fjord|shore/.test(u)), bad);

    // ── Escape steps out before it closes ────────────────────────
    await p.click('#palBtn'); await p.waitForTimeout(300);
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    ok('Escape steps back to the sections first',
      await p.locator('.pal-cat').count() === 2 && await p.locator('#palMenu').isVisible());
    await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    ok('and closes from there', await p.locator('#palMenu').isHidden());

    if (app === 'trading') {
      await p.click('#palBtn'); await p.waitForTimeout(300);
      await p.locator('#palMenu').screenshot({ path: 'pal-deep.png' });
      await p.click('.pal-back'); await p.waitForTimeout(300);
      await p.locator('#palMenu').screenshot({ path: 'pal-top.png' });
    }
    ok('no errors through any of it', errs.length === 0, errs);
    ok('nothing failed to load', bad.length === 0, bad);
    await p.close();
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
