/* Where the numbers live.

   Metrics is the screen you open before trading, so it carries the
   clock, the gate, the money and the curve — and nothing that scores
   you. Every tile that used to stand there had a denominator, and a
   denominator is a scoreboard however it is worded: "6 of 10" does not
   read as six done, it reads as four missed.

   The four verdicts moved to the Log, which is somewhere you go on
   purpose to read back — and on the Log they are behind a hairline that
   is SHUT until you open it. Available is not the same as handed to you
   on the way past, and shut has to be the default or it is neither. */
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
  /* ── shut, and shut is a rule ──
     No title, no word, no chevron in space. If anything visible sits in
     the button, the panel is announcing itself and the whole point of
     moving these off Metrics is lost. */
  ok('the four start shut', await p.locator('#logFigB').isHidden());
  ok('and the button agrees', await p.getAttribute('#logFigT', 'aria-expanded') === 'false');
  ok('shut, there is nothing to read', await p.evaluate(() => {
    const sr = document.querySelector('#logFigT .sr').getBoundingClientRect();
    return sr.width <= 1 && sr.height <= 1;         // the label is for a reader, not the eye
  }));
  ok('shut, it is a one-pixel rule', await p.evaluate(() => {
    const b = document.querySelector('#logFigT .lg-fg-line').getBoundingClientRect();
    return Math.round(b.height) === 1 && b.width > 400;
  }), await p.evaluate(() => {
    const b = document.querySelector('#logFigT .lg-fg-line').getBoundingClientRect();
    return [Math.round(b.width), Math.round(b.height)];
  }));
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
    document.querySelector('#logSection .lg-filters').getBoundingClientRect().top > was + 20, shut));

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
  ok('and says so rather than showing zeros', await p.evaluate(() =>
    /Nothing recorded yet/.test(document.getElementById('logSample').textContent)));

  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
