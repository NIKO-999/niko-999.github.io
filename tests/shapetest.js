/* Label position, bar ends and height, and the marker glyph — each a
   choice, each sticking, each defaulting to what the app already did. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

const openFirstBar = async (pg) => {
  await pg.evaluate(() => document.querySelector('#rows .bar').click());
  await pg.waitForTimeout(280);
};

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  await pg.emulateMedia({ colorScheme: 'dark' });
  await pg.goto(`${BASE}/arc/`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);

  console.log('\n── the controls follow the shape of the goal');
  await openFirstBar(pg);
  ok(await pg.isVisible('#edLookSpan'), 'a span is offered bar ends, height and name');
  ok(await pg.isHidden('#edLookMark'), 'and not a marker glyph');
  await pg.click('#edMoment');
  await pg.waitForTimeout(150);
  ok(await pg.isHidden('#edLookSpan'), 'a single date is offered no bar options');
  ok(await pg.isVisible('#edLookMark'), 'and is offered the glyph instead');
  const marks = await pg.$$eval('#edMarks [data-mark]', bs => bs.map(b => b.dataset.mark));
  ok(marks.join(',') === 'diamond,circle,square,flag', `four glyphs (${marks.join(', ')})`);
  await pg.click('#edCancel');
  await pg.waitForTimeout(200);

  console.log('\n── defaults are what the app was already doing');
  const before = await pg.evaluate(() => {
    const b = document.querySelector('#rows .bar');
    return { edge: b.dataset.edge, size: b.dataset.size, label: b.dataset.label,
             h: Math.round(b.getBoundingClientRect().height),
             r: getComputedStyle(b).borderTopLeftRadius };
  });
  ok(before.edge === 'round' && before.size === 'normal' && before.label === 'auto',
     `an untouched goal draws round, normal, auto (${before.edge}/${before.size}/${before.label})`);

  console.log('\n── square ends and a slim bar');
  await openFirstBar(pg);
  await pg.click('#edEdge [data-edge="square"]');
  await pg.click('#edSize [data-size="slim"]');
  await pg.click('#edSave');
  await pg.waitForTimeout(400);
  const after = await pg.evaluate(() => {
    const b = document.querySelector('#rows .bar');
    const g = goals().find(x => x.id === b.dataset.id);
    return { edge: b.dataset.edge, size: b.dataset.size,
             h: Math.round(b.getBoundingClientRect().height),
             r: parseFloat(getComputedStyle(b).borderTopLeftRadius),
             tapH: Math.round(parseFloat(getComputedStyle(b, '::after').height)),
             stored: { edge: g.edge, size: g.size } };
  });
  ok(after.edge === 'square' && after.r <= 4, `the ends go square (${after.r}px radius)`);
  ok(after.size === 'slim' && after.h < before.h,
     `and the bar slims (${after.h}px, was ${before.h}px)`);
  ok(after.tapH === 36, `while the tap target stays 36px (${after.tapH}px)`);
  ok(after.stored.edge === 'square' && after.stored.size === 'slim', 'both are stored');

  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => {
    const b = document.querySelector('#rows .bar');
    return b.dataset.edge === 'square' && b.dataset.size === 'slim';
  }), 'and survive a reload');

  console.log('\n── the name, put outside on purpose');
  /* A wide bar whose name fits: the only reason it would go outside is
     because it was asked to. */
  const wide = await pg.evaluate(() => {
    const b = [...document.querySelectorAll('#rows .bar')]
      .sort((x, y) => y.getBoundingClientRect().width - x.getBoundingClientRect().width)[0];
    b.click();
    return b.dataset.id;
  });
  await pg.waitForTimeout(280);
  await pg.click('#edLabel [data-label="out"]');
  await pg.click('#edSave');
  await pg.waitForTimeout(500);
  const out = await pg.evaluate((id) => {
    const b = document.querySelector(`#rows .bar[data-id="${id}"]`);
    const g = goals().find(x => x.id === id);
    const cap = [...document.querySelectorAll('#rows .outside')]
      .find(c => c.textContent.includes(g.name));
    return { label: b.dataset.label, narrow: b.classList.contains('narrow'),
             inside: getComputedStyle(b.querySelector('.label')).display,
             caption: !!cap, stored: g.label,
             /* It is placed on whichever side is actually free, so
                "clear of the bar" means clear on EITHER side. */
             geo: cap ? (() => {
               const c = cap.getBoundingClientRect(), r = b.getBoundingClientRect();
               return { side: c.left >= r.right - 2 ? 'right'
                            : c.right <= r.left + 2 ? 'left' : 'overlapping',
                        cap: [Math.round(c.left), Math.round(c.right)],
                        bar: [Math.round(r.left), Math.round(r.right)] };
             })() : null };
  }, wide);
  ok(out.label === 'out' && out.stored === 'out', 'the choice is stored and drawn');
  ok(out.inside === 'none', 'the name is no longer inside the bar');
  ok(out.caption, 'and is written on the canvas beside it');
  ok(out.geo && out.geo.side !== 'overlapping',
     `clear of the bar, on the free side (${out.geo && out.geo.side}: `
     + `caption ${out.geo && out.geo.cap} vs bar ${out.geo && out.geo.bar})`);

  /* Back to auto: it should go back inside, because it fits. */
  await pg.evaluate((id) => document.querySelector(`#rows .bar[data-id="${id}"]`).click(), wide);
  await pg.waitForTimeout(280);
  await pg.click('#edLabel [data-label="auto"]');
  await pg.click('#edSave');
  await pg.waitForTimeout(500);
  ok(await pg.evaluate((id) => {
    const b = document.querySelector(`#rows .bar[data-id="${id}"]`);
    return !b.classList.contains('narrow')
      && getComputedStyle(b.querySelector('.label')).display !== 'none';
  }, wide), 'and setting it back to inside puts it back inside');

  console.log('\n── the marker glyph');
  for (const shape of ['circle', 'square', 'flag', 'diamond']) {
    await pg.evaluate(() => document.querySelector('#rows .milestone').click());
    await pg.waitForTimeout(250);
    await pg.click(`#edMarks [data-mark="${shape}"]`);
    await pg.click('#edSave');
    await pg.waitForTimeout(350);
    const m = await pg.evaluate(() => {
      const d = document.querySelector('#rows .milestone .diamond');
      const cs = getComputedStyle(d);
      return { mark: d.dataset.mark, rot: cs.transform,
               radius: cs.borderTopLeftRadius, clip: cs.clipPath,
               w: Math.round(d.getBoundingClientRect().width) };
    });
    const spun = m.rot !== 'none' && m.rot !== 'matrix(1, 0, 0, 1, 0, 0)';
    const distinct = shape === 'diamond' ? spun
                   : shape === 'circle' ? !spun && /%/.test(m.radius)
                   : shape === 'flag' ? !spun && m.clip !== 'none'
                   : !spun && m.clip === 'none';
    ok(m.mark === shape && distinct, `${shape}: drawn as itself (${m.w}px, rotated ${spun})`);
  }

  await pg.evaluate(() => goto('board'));
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: D + '/shape-board.png' });
  await pg.evaluate(() => document.querySelector('#rows .bar').click());
  await pg.waitForTimeout(300);
  await pg.locator('#ed').screenshot({ path: D + '/shape-ed.png' });

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
