/* Where the numbers live.

   Metrics is the screen you open before trading, so it carries the
   clock, the gate, the money and the curve — and nothing that scores
   you. Every tile that used to stand there had a denominator, and a
   denominator is a scoreboard however it is worded: "6 of 10" does not
   read as six done, it reads as four missed.

   The four verdicts moved to the Log, which is somewhere you go on
   purpose to read back — and on the Log they are the FIGURES WITHOUT
   THE WORDS, half opacity, in the corner. Shut is not empty here; what
   is folded away is the labels and the sample caveat.

   A figure with no label cannot judge you: "46%" is a number until
   something calls it a win rate. That is the whole design, so the
   checks below care most about what is NOT on screen when it is shut. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
};

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok('no page errors on load', errs.length === 0, errs);

  /* ── the topbar's primary button ──
     Outlined, and ONLY the one in the topbar. .btn-primary is on eleven
     buttons across the two apps and most of them end a form you have
     just filled in, which is the one place a solid fill is doing real
     work. A slab of pure white in the topbar was the brightest object
     in the app — brighter than the figure telling you what you made. */
  const bar = await p.evaluate(() => {
    const px = (c) => (String(c).match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const n = getComputedStyle(document.getElementById('newTrade'));
    const s2 = getComputedStyle(document.getElementById('tradeSave'));
    return { addBg: px(n.backgroundColor), addAlpha: (n.backgroundColor.match(/[\d.]+\)$/) || ['1)'])[0],
             addBorder: n.borderTopWidth, saveBg: px(s2.backgroundColor) };
  });
  ok('the topbar Add has no fill', bar.addAlpha === '0)', bar);
  ok('but it does have an edge', parseFloat(bar.addBorder) >= 1, bar);
  /* Every other primary button keeps its fill. */
  ok('and the sheet\'s Save is still solid', await p.evaluate(() => {
    const c = getComputedStyle(document.getElementById('tradeSave')).backgroundColor;
    const m = c.match(/[\d.]+\)$/);
    return !m || m[0] !== '0)';
  }), bar);

  const labels = (sel) => p.evaluate((s) =>
    [...document.querySelectorAll(s + ' .metric')].map(m => m.querySelector('span').textContent.trim()), sel);
  /* The four are a line of type now, not cards: <span><i>label</i>figure</span> */
  const figures = () => p.evaluate(() =>
    [...document.querySelectorAll('#logStats > span')].map(x => ({
      l: x.querySelector('i').textContent.trim(),
      v: x.textContent.replace(x.querySelector('i').textContent, '').trim(),
    })));

  // ── metrics carries one figure ─────────────────────────────────
  const top = await labels('#metrics');
  ok('Metrics shows Net P/L and nothing else', top.length === 1 && top[0] === 'Net P/L', top);
  ok('and it is the full width of the row', await p.evaluate(() =>
    document.querySelector('#metrics .metric').classList.contains('wide')));
  ok('nothing on it carries a denominator', await p.evaluate(() =>
    ![...document.querySelectorAll('#metrics .metric b')].some(x => /\d\s*\/\s*\d/.test(x.textContent))));
  ok('the old results fold is gone entirely', await p.evaluate(() =>
    !document.getElementById('mtToggle') && !document.getElementById('mtBody')
    && !document.querySelector('.mt-fold')));

  const JUDGES = ['Win rate', 'Average R', 'Profit factor', 'Expectancy'];
  ok('none of the four verdicts is on Metrics', await p.evaluate((j) =>
    !j.some(x => document.getElementById('metricsSection').innerText.includes(x)), JUDGES));

  /* The clock, the gate and the curve are what the screen is for. */
  ok('the candle panel is still there', await p.locator('#cp').count() === 1);
  ok('and the curve, and both radars', await p.evaluate(() =>
    !!document.getElementById('curve') || !!document.querySelector('#metricsSection .chartbox')));

  // ── and the Log carries the four ───────────────────────────────
  await p.evaluate(() => goto('log'));
  await p.waitForTimeout(350);
  /* ── shut: digits, and not one word ──
     The four values are on screen; every label is off it. If a label
     survives, the row is a scoreboard again. */
  ok('the words start folded away', await p.locator('#logFigB').isHidden());
  ok('and the button agrees', await p.getAttribute('#logFigT', 'aria-expanded') === 'false');
  ok('but the figures themselves are on screen', await p.locator('#logStats').isVisible());
  ok('shut, not one label is rendered', await p.evaluate(() =>
    [...document.querySelectorAll('#logStats i')]
      .every(i => getComputedStyle(i).display === 'none')));
  ok('shut, no label text is in the log at all', await p.evaluate((j) => {
    const t = document.getElementById('logSection').innerText.toLowerCase();
    return !j.some(x => t.includes(x.toLowerCase()));
  }, JUDGES));
  ok('shut, there is still nothing visible saying what it is', await p.evaluate(() => {
    const sr = document.querySelector('#logFigT .sr').getBoundingClientRect();
    return sr.width <= 1 && sr.height <= 1;         // the name is for a reader, not the eye
  }));
  /* Quiet, and measurably so — the whole point is that you can ignore
     it. Opening is what brings it up to full. */
  ok('shut, it is faded back', await p.evaluate(() =>
    parseFloat(getComputedStyle(document.getElementById('logFigT')).opacity) < 0.8),
    await p.evaluate(() => getComputedStyle(document.getElementById('logFigT')).opacity));
  /* Measure the INK, not the box. The row is a full-width flex
     container that pushes its children right — its own left edge is the
     pane's and says nothing about where the figures ended up. */
  const ink = () => p.evaluate(() => {
    const kids = [...document.querySelectorAll('#logStats > span')].map(x => x.getBoundingClientRect());
    const f = document.querySelector('#logSection .lg-filters').getBoundingClientRect();
    return { l: Math.round(Math.min(...kids.map(k => k.left))),
             r: Math.round(Math.max(...kids.map(k => k.right))),
             fl: Math.round(f.left), fr: Math.round(f.right) };
  });
  const box = await ink();
  ok('and it sits in the corner, not across the page',
     Math.abs(box.r - box.fr) < 2 && box.l > box.fl + 200, box);
  /* A heading, carrying a button — not a button carrying a heading.
     The gate's alignment table, and the only reason a screen reader can
     still find this panel at all. */
  ok('the button is inside the heading', await p.evaluate(() =>
    document.getElementById('logFigT').closest('h3') !== null
    && !document.getElementById('logFigT').querySelector('h3')));

  const shut = await p.evaluate(() =>
    document.querySelector('#logSection .lg-filters').getBoundingClientRect().top);
  await p.click('#logFigT');
  await p.waitForTimeout(300);
  ok('opens', await p.locator('#logFigB').isVisible());
  ok('and the labels arrive with it', await p.evaluate(() =>
    [...document.querySelectorAll('#logStats i')]
      .every(i => getComputedStyle(i).display !== 'none')));
  ok('open, it comes up to full', await p.evaluate(() =>
    parseFloat(getComputedStyle(document.getElementById('logFigT')).opacity) > 0.95));
  /* One control, not two. The button is never swapped out from under
     the pointer, so there is no second control to find on the way back
     and no focus to hand anywhere. */
  ok('the same button closes it again', await p.evaluate(() =>
    !document.getElementById('logFigT').hidden
    && document.activeElement === document.getElementById('logFigT')));

  const onLog = await figures();
  ok('all four are there', JUDGES.every(j => onLog.some(f => f.l === j)), onLog);
  ok('as one line, not four cards', await p.evaluate(() => {
    const r = document.getElementById('logStats');
    const tops = [...r.children].map(c => Math.round(c.getBoundingClientRect().top));
    return r.children.length === 4 && new Set(tops).size === 1;
  }));
  ok('no cards survived the move', await p.locator('#logStats .metric').count() === 0);
  /* NO COLOUR. A red profit factor is what put these behind a rule; a
     small red profit factor is the same verdict in a quieter voice. */
  ok('and none of the four is coloured', await p.evaluate(() => {
    const base = getComputedStyle(document.getElementById('logStats')).color;
    return [...document.querySelectorAll('#logStats > span')]
      .every(x => getComputedStyle(x).color === base);
  }));
  ok('above the filters, not buried under them', await p.evaluate(() => {
    const s = document.getElementById('logStats').getBoundingClientRect();
    const f = document.querySelector('#logSection .lg-filters').getBoundingClientRect();
    return s.top < f.top;
  }));
  ok('and opening pushed the log down rather than covering it', await p.evaluate((was) =>
    document.querySelector('#logSection .lg-filters').getBoundingClientRect().top > was + 8, shut));

  /* Shut is the default, but a choice has to survive the reload or it is
     not a choice — every other fold in the app remembers. */
  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => goto('log'));
  await p.waitForTimeout(350);
  ok('an opened panel is still open next time', await p.locator('#logFigB').isVisible());
  await p.click('#logFigT');
  await p.waitForTimeout(250);
  ok('and shutting it sticks too', await p.evaluate(async () => {
    const v = localStorage.getItem('log.figures.v1');
    return v === '0';
  }), await p.evaluate(() => localStorage.getItem('log.figures.v1')));
  await p.click('#logFigT');
  await p.waitForTimeout(250);

  // ── the sample is stated honestly, wherever they live ──────────
  ok('a small sample says so', await p.evaluate(() => {
    const t = totals();
    const txt = document.getElementById('logSample').textContent;
    return t.n > 0 && t.n < 30 ? /too few/.test(txt) : true;
  }), await p.locator('#logSample').textContent());

  await p.evaluate(() => {
    const ev = [{ id: uid(), k: 'deposit', date: '2026-01-01', amt: 20000, note: 'x' }];
    for (let i = 0; i < 40; i++) ev.push({ id: uid(), k: 'trade', date: '2026-03-0' + (i % 9 + 1),
      amt: i % 3 ? 200 : -150, risk: 100, sym: 'X', setup: 'CISD', mode: 'continuation' });
    state = { events: ev, bin: [] }; commit('many');
  });
  await p.waitForTimeout(400);
  ok('a bigger one stops apologising', await p.evaluate(() =>
    /enough to read/.test(document.getElementById('logSample').textContent)),
    await p.locator('#logSample').textContent());
  ok('and the figures updated with it',
     /^\d+%$/.test(((await figures()).find(f => f.l === 'Win rate') || {}).v || ''),
     await figures());

  // ── an empty ledger says nothing rather than 0.00 ──────────────
  await p.evaluate(() => { state = { events: [], bin: [] }; commit('empty'); });
  await p.waitForTimeout(350);
  ok('an empty ledger shows dashes rather than zeros',
     (await figures()).filter(f => f.v === '—').length >= 2, await figures());
  /* An empty ledger must not put four bare zeros in the corner either.
     "0%  0.00R  0.00  £0" reads as a verdict on somebody who has not
     traded yet, which is the one account it cannot be a verdict on. */
  ok('and never four bare zeros', (await figures()).every(f => !/^[£$€]?[-+]?0(\.00)?R?%?$/.test(f.v)),
     await figures());
  ok('and says so rather than showing zeros', await p.evaluate(() =>
    /Nothing recorded yet/.test(document.getElementById('logSample').textContent)));

  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
