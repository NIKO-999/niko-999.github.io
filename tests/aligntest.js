/* The alignment table sits where the trade is taken, folds, and stays
   folded — and it says the same thing the note does. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };
const WANT = [['Daily', '1H'], ['4H', '15M'], ['1H', '5M'], ['30M', '3M'], ['15M', '1M']];

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1512, height: 1000 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  await pg.emulateMedia({ colorScheme: 'dark' });
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(350);

  console.log('\n── it is where the trade is taken');
  /* Inside the gate, not on a screen of its own. */
  ok(await pg.evaluate(() =>
    !!document.getElementById('gMenu').querySelector('#alBox table')),
     'the table lives inside the gate');
  ok(await pg.evaluate(() => {
    const list = document.getElementById('gList');
    const al = document.querySelector('.cp-align');
    return !!(list.compareDocumentPosition(al) & Node.DOCUMENT_POSITION_FOLLOWING);
  }), 'under the checklist that asks for it');

  console.log('\n── folded until asked for');
  await pg.click('#gToggle');
  await pg.waitForTimeout(250);
  ok(await pg.isVisible('.cp-align'), 'the fold is on screen when the gate is open');
  ok(await pg.isHidden('#alBox'), 'and the table starts put away');
  ok(await pg.getAttribute('#alToggle', 'aria-expanded') === 'false',
     'which it says out loud');
  ok(await pg.locator('#alCaret svg').count() === 1, 'the caret is drawn');
  /* The shared chevron points down. Closed it stays down; open it turns
     a half circle, exactly as the gate's own caret does — a quarter turn
     would lay it on its side and point at nothing. */
  const caretShut = await pg.evaluate(() =>
    getComputedStyle(document.getElementById('alCaret')).transform);
  ok(caretShut === 'none' || caretShut === 'matrix(1, 0, 0, 1, 0, 0)',
     `closed, the caret is upright (${caretShut})`);

  await pg.click('#alToggle');
  await pg.waitForTimeout(200);
  ok(await pg.isVisible('#alBox'), 'clicking it opens the table');
  ok(await pg.getAttribute('#alToggle', 'aria-expanded') === 'true', 'and says so');
  const caretOpen = await pg.evaluate(() =>
    getComputedStyle(document.getElementById('alCaret')).transform);
  ok(/matrix\(-1, 0, 0, -1/.test(caretOpen), `and turns a half circle (${caretOpen})`);
  const gateCaret = await pg.evaluate(() =>
    getComputedStyle(document.getElementById('gCaret')).transform);
  ok(caretOpen === gateCaret, 'the same way the gate caret above it does');

  console.log('\n── what it says');
  const rows = await pg.$$eval('#alBody tr', rs =>
    rs.map(r => [r.querySelector('th').textContent.trim(),
                 r.querySelector('td').textContent.trim()]));
  ok(rows.length === 5, `five pairings (${rows.length})`);
  ok(JSON.stringify(rows) === JSON.stringify(WANT),
     `slowest first, and right (${rows.map(r => r.join('→')).join(' ')})`);
  ok(await pg.locator('#alBody th[scope="row"]').count() === 5,
     'the level is a row header, so a screen reader pairs them');
  ok(await pg.locator('#alBox thead th').count() === 2, 'with column headers on it');

  console.log('\n── and what has to happen on that chart');
  const conds = await pg.$$eval('#pspList li', ls => ls.map(l => l.textContent.trim()));
  ok(conds.length === 4, `four conditions (${conds.length})`);
  /* A key level WITH an SMT on it, not one or the other — the level is
     where you look and the SMT is what says it is doing something. */
  ok(/key level/i.test(conds[0]) && /SMT/.test(conds[0]) && !/\bor\b/i.test(conds[0]),
     `a key level with an SMT, not either (${conds[0]})`);
  ok(/aligned/i.test(conds[2]) && /expansion/i.test(conds[2]),
     `the aligned chart, expansion in and out (${conds[2]})`);
  ok(/below it for a high/i.test(conds[3]) && /above it for a low/i.test(conds[3]),
     `and which way the close goes (${conds[3]})`);

  /* Opposite ends of the row, and they open and close together. */
  const side = await pg.evaluate(() => {
    const box = document.getElementById('alBox').getBoundingClientRect();
    const t = document.querySelector('#alBox table').getBoundingClientRect();
    const p = document.querySelector('.cp-psp').getBoundingClientRect();
    const kids = [...document.getElementById('alBox').children].map(c => c.tagName);
    return { pspLeft: Math.round(p.left - box.left),
             gap: Math.round(t.left - p.right),
             tableRight: Math.round(box.right - t.right),
             sameRow: Math.abs(t.top - p.top) < 30, order: kids };
  });
  ok(side.sameRow, 'they sit on the same row');
  ok(side.pspLeft <= 2, `the conditions are on the left (${side.pspLeft}px from the edge)`);
  ok(side.gap >= 56, `and the table well clear of them (${side.gap}px between)`);
  /* The rule under the heading should end where the writing does, not
     run the width of the panel. */
  const rule = await pg.evaluate(() => {
    const p = document.querySelector('.cp-psp').getBoundingClientRect();
    const ends = [...document.querySelectorAll('.cp-psp li span')]
      .map(n => n.getBoundingClientRect().right);
    return Math.round(p.right - Math.max(...ends));
  });
  ok(rule <= 4, `the heading rule ends with the writing (${rule}px over)`);
  ok(side.tableRight <= 2, `pushed to the far side (${side.tableRight}px from the edge)`);
  /* On screen and in the DOM, so it is spoken in the order it is read. */
  ok(side.order.join(',') === 'DIV,TABLE',
     `and that is the order in the markup too (${side.order.join(', ')})`);
  ok(await pg.isVisible('.cp-psp'), 'the conditions are visible with the table');

  console.log('\n── and the two halves line up');
  const level = await pg.evaluate(() => {
    const mid = (n) => { const r = n.getBoundingClientRect(); return r.top + r.height / 2; };
    const ink = (n) => { const r = document.createRange(); r.selectNodeContents(n);
      return r.getBoundingClientRect(); };
    const rows = [...document.querySelectorAll('#alBody tr')];
    const lis = [...document.querySelectorAll('.cp-psp li')];
    return {
      heading: ink(document.querySelector('.cp-psp h4')).top
             - ink(document.querySelector('#alBox thead th')).top,
      /* Every row, not just the first — the two settle at different line
         heights on their own and drift half a pixel a row, which is
         invisible at the top and obvious by the bottom. */
      rows: lis.map((l, i) => rows[i] ? mid(l) - mid(rows[i]) : 0),
      /* All five arrows on one vertical line is the whole reason the
         pairing reads without being parsed. */
      arrowCols: new Set([...document.querySelectorAll('#alBody td')]
        .map(t => Math.round(t.getBoundingClientRect().left))).size,
    };
  });
  ok(Math.abs(level.heading) <= 1,
     `the two headings sit on one line (${level.heading.toFixed(1)}px apart)`);
  const worst = Math.max(...level.rows.map(Math.abs));
  ok(worst <= 1.5, `and every row with it (worst ${worst.toFixed(1)}px)`);
  const drift = Math.max(...level.rows) - Math.min(...level.rows);
  ok(drift <= 1, `with no drift down the column (${drift.toFixed(1)}px)`);
  ok(level.arrowCols === 1, `all five arrows on one line (${level.arrowCols} column)`);

  /* Drawn rather than typed: the face carries no arrow at any length, so
     a glyph would be whichever fallback the machine reaches for. */
  const arrow = await pg.evaluate(() => {
    const th = document.querySelector('#alBody th');
    const shaft = getComputedStyle(th, '::before');
    const head = getComputedStyle(th, '::after');
    const widths = [...document.querySelectorAll('#alBody th')]
      .map(t => getComputedStyle(t, '::before').width);
    return { len: parseFloat(shaft.width), same: new Set(widths).size,
             glyph: th.textContent.replace(/[A-Za-z0-9]/g, '').trim(),
             head: parseFloat(head.borderTopWidth) };
  });
  /* Short — a connector between two words rather than a diagram. Long
     enough that the five stack into one line, short enough to stay
     punctuation. */
  ok(arrow.len >= 12 && arrow.len <= 24, `the arrow is short (${arrow.len}px of shaft)`);
  ok(arrow.same === 1, 'and the same length on every row');
  ok(arrow.head > 0, 'with a head drawn from a border rather than typed');
  ok(arrow.glyph === '', `no arrow character in the markup (${JSON.stringify(arrow.glyph)})`);

  /* One source of truth: the note prints the same pairing in prose. */
  const inNote = await pg.evaluate(() => {
    const n = NOTES.find(x => x.id === 'swings');
    return JSON.stringify(n) + n.rules.map(r => r.join(' ')).join(' ');
  });
  const agree = WANT.every(([lv, on]) =>
    new RegExp(`${lv}[^.]{0,44}\\b${on}\\b`, 'i').test(inNote));
  ok(agree, 'and the Resources note says the same thing');

  console.log('\n── it stays put away');
  await pg.click('#alToggle');
  await pg.waitForTimeout(150);
  ok(await pg.isHidden('#alBox'), 'closing it closes it');
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  await pg.click('#gToggle');
  await pg.waitForTimeout(250);
  ok(await pg.isHidden('#alBox'), 'and it is still away after a reload');

  await pg.click('#alToggle');
  await pg.waitForTimeout(150);
  await pg.reload({ waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  await pg.click('#gToggle');
  await pg.waitForTimeout(250);
  ok(await pg.isVisible('#alBox'), 'left open, it comes back open');

  /* And it must not get in the way of the thing the gate is for. */
  const geo = await pg.evaluate(() => {
    const go = document.getElementById('gIn').getBoundingClientRect();
    const al = document.querySelector('.cp-align').getBoundingClientRect();
    return { overlap: !(al.top >= go.bottom || al.bottom <= go.top),
             goVisible: go.width > 0 && go.height > 0 };
  });
  ok(geo.goVisible && !geo.overlap, 'and never sits over the button you came to press');

  console.log('\n── and on a narrow window');
  /* Two blocks side by side need room. When there is not enough they
     stack — what they must never do is sit on top of each other or run
     out of the panel. */
  for (const w of [1100, 900, 760]) {
    await pg.setViewportSize({ width: w, height: 1000 });
    await pg.waitForTimeout(250);
    const fit = await pg.evaluate(() => {
      const menu = document.getElementById('gMenu').getBoundingClientRect();
      const t = document.querySelector('#alBox table').getBoundingClientRect();
      const p = document.querySelector('.cp-psp').getBoundingClientRect();
      const sameRow = Math.abs(p.top - t.top) < 20;
      const th = [...document.querySelectorAll('#alBox thead th')].pop().getBoundingClientRect();
      return { overlap: sameRow && !(p.left >= t.right - 1 || p.right <= t.left + 1),
               over: Math.round(p.right - menu.right),
               gapPx: Math.round(t.left - p.right),
               clipped: th.right > menu.right + 1,
               stacked: p.top > t.bottom - 4 };
    });
    ok(!fit.overlap && fit.over <= 1,
       `${w}px: ${fit.stacked ? 'stacked' : 'side by side'}, no overlap, inside the panel`);
    /* The gap is the minimum, not the measurement — space-between opens
       it further on a wide window and must never close it below this. */
    if (!fit.stacked) ok(fit.gapPx >= 56,
      `${w}px: the two halves keep their distance (${fit.gapPx}px)`);
    ok(!fit.clipped, `${w}px: the last column header is not cut off`);
  }
  await pg.setViewportSize({ width: 1512, height: 1000 });
  await pg.waitForTimeout(200);

  await pg.screenshot({ path: D + '/align.png' });
  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
