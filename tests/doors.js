/* ═══════════════════════════════════════════════════════════════
   DOORS — the door-to-door log. Every check drives the real app: starts
   a shift, presses outcomes door by door, logs a sale, ends it, and
   reads the funnel, the report and the record back off the screens.

   The clock is frozen at Wednesday 4 November 2026, 16:00.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
  isMobile: true, hasTouch: true, locale: 'en-GB', colorScheme: 'dark' };
const URL = `${BASE}/doors/`;
const AT = '2026-11-04T16:00:00';
const freeze = (at) => `(() => {
  const F = new Date('${at}').getTime(); const R = Date;
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;

/* A shift of doors at one hour on one day: n of each outcome, in funnel
   order, sales worth v cents each. */
function shift(id, d, hour, a, per, v) {
  const s = new Date(`${d}T${String(hour).padStart(2, '0')}:00:00`).getTime();
  const k = [];
  let t = s;
  for (const o of ['na', 'ni', 'pi', 'cb', 'sa']) for (let i = 0; i < (per[o] || 0); i++) {
    t += 30000; const door = { t, o };
    if (o === 'sa') door.v = v || 0;
    if (o === 'ni' && i % 2 === 0) door.r = 'price';
    k.push(door);
  }
  return { id, d, a, s, e: t + 60000, k, m: null };
}

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  async function ctx(seed) {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze(AT));
    if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('doors.v1')) localStorage.setItem('doors.v1', ${JSON.stringify(JSON.stringify(seed))}); })();`);
    await c.addInitScript(() => {
      window.__copied = null;
      try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__copied = t; return Promise.resolve(); } }, configurable: true }); } catch (e) {}
    });
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) offOrigin.push(u); });
    await page.goto(URL); await page.waitForTimeout(300);
    return { c, page };
  }
  const store = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('doors.v1') || 'null'));
  const settle = (page) => page.waitForTimeout(420);
  const top = (page) => page.locator('.dr-sheet').last();
  const sideways = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);

  /* ── a first open ── */
  const { c, page } = await ctx();
  ok('the home screen draws', await page.locator('#drHome .dr-card').count() > 0);
  ok('a first open is ready to knock, with the goal under it', (await page.textContent('.dr-title')).trim() === 'Ready to knock' && /3 sales from 80 doors/.test(await page.textContent('.dr-sub')));
  ok('the funnel says there is nothing yet rather than drawing zeroes', /No doors yet/.test(await page.textContent('#drFunnel')));
  const bar = await page.$$eval('.dr-bar button', (b) => b.map((x) => { const r = x.getBoundingClientRect(); return [r.width, r.height]; }));
  ok('four tabs, every one a 44px target', bar.length === 4 && bar.every(([w, h]) => w >= 44 && h >= 44), bar);
  ok('the report button is a 44px target', await page.$eval('#drRepBtn', (e) => { const r = e.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }));

  /* ── a shift, door by door ── */
  await page.click('#drGo'); await settle(page);
  await page.fill('#drArea', 'Elm Street');
  await top(page).locator('button', { hasText: 'Start knocking' }).click(); await settle(page);
  ok('starting a shift opens it full screen', await page.locator('#drOuts').count() === 1);
  ok('five outcomes, every one at least 44px', (await page.$$eval('.dr-out', (b) => b.map((x) => x.getBoundingClientRect().height))).every((h) => h >= 44) && await page.locator('.dr-out').count() === 5);
  const press = async (o, n) => { for (let i = 0; i < n; i++) await page.click(`.dr-out[data-o="${o}"]`); };
  await press('na', 6); await press('ni', 2); await press('pi', 1); await press('cb', 1);
  ok('every press is a door', (await page.textContent('#drLiveSt div:first-child b')).trim() === '10');
  ok('and its outcome is counted on its own button', (await page.textContent('.dr-out[data-o="na"] b')).trim() === '6');
  ok('a callback asks why not', await page.locator('#drLast .dr-why .dr-pill').count() === 8);
  await page.click('.dr-out[data-o="ni"]');
  await page.click('#drLast .dr-pill[data-k="price"]');
  let st = await store(page);
  let live = st.sh[0];
  ok('the reason lands on the last door', live.k[live.k.length - 1].r === 'price' && live.k[live.k.length - 1].o === 'ni', live.k.slice(-1));
  ok('a door that never opened is never asked why', await page.click('.dr-out[data-o="na"]').then(() => page.locator('#drLast .dr-why').count()) === 0);
  await page.click('#drLast .dr-hd button');
  st = await store(page);
  ok('Undo takes the last door back off', st.sh[0].k.length === 11, st.sh[0].k.length);

  /* the sale */
  await page.click('.dr-out[data-o="sa"]'); await settle(page);
  await page.fill('#drSaleV', '120');
  await page.fill('#drSaleP', 'Solar plan');
  await page.fill('#drSaleN', 'Opened with the neighbour who signed last week');
  await page.click('#drSaleGo'); await settle(page);
  st = await store(page);
  const sale = st.sh[0].k[st.sh[0].k.length - 1];
  ok('a sale is a door with a value in cents, what was sold and a note', sale.o === 'sa' && sale.v === 12000 && sale.p === 'Solar plan' && /neighbour/.test(sale.n), sale);
  ok('what you sold is remembered for next time', st.pr[0] === 'Solar plan');
  const ls = await page.$$eval('#drLiveSt b', (b) => b.map((x) => x.textContent));
  /* 12 doors: 6 na, 3 ni, 1 pi, 1 cb, 1 sa → answered 6/12, pitched 3, sold 1 */
  ok('the live figures are the funnel of that shift', ls.join('|') === '12|50%|33%|$120', ls);
  ok('the sale button is the one green thing', await page.$eval('.dr-out.is-sale', (e) => getComputedStyle(e).backgroundColor) === 'rgb(52, 199, 89)');

  /* a closed app is not an ended shift */
  await page.reload(); await page.waitForTimeout(500);
  ok('a reload comes back to the shift in progress', await page.locator('#drOuts').count() === 1 && await page.inputValue('.dr-ss-area') === 'Elm Street');
  await page.click('.dr-sh-hd .dr-round'); await settle(page);
  ok('minimised, the live bar says where you are', !(await page.locator('#drLive').isHidden()) && /Elm Street · 12 doors/.test(await page.textContent('#drLive')));
  ok('and the today card says go back to it', (await page.textContent('#drGo')).trim() === 'Back to the shift');
  await page.click('#drLive'); await settle(page);
  await page.click('#drEnd'); await settle(page);
  ok('ending it shows what the shift came to', /1 sale/.test(await top(page).locator('.dr-hero').textContent()) && /\$120/.test(await top(page).textContent()));
  st = await store(page);
  ok('and stamps an end on the record', st.sh[0].e > st.sh[0].s);
  await top(page).locator('button', { hasText: 'Done' }).click(); await settle(page);

  const fun = await page.$$eval('#drFunnel .dr-fr', (r) => r.map((x) => x.dataset.k + ':' + x.querySelector('span b').textContent));
  ok('the funnel reads doors, answered, pitched, sales', fun.join() === 'k:12,an:6,pi:3,sa:1', fun);
  const steps = await page.$$eval('#drFunnel .dr-step b', (b) => b.map((x) => x.textContent));
  ok('each step against the one before it', steps.join() === '50%,50%,33%', steps);
  ok('with too little behind it, it does not pretend to know where to improve', /A few more shifts/.test(await page.textContent('#drFocus')));
  ok('the week tile is measured against the same days of last week', (await page.textContent('#drStats .dr-delta')).trim() === '+1');
  ok('this week counts the sale', (await page.textContent('#drStats .dr-card:first-child b')).trim() === '1');

  /* ── the win, on its own screen ── */
  await page.click('.dr-bar button[data-v="wins"]'); await settle(page);
  ok('Wins lists the sale with what was sold', /Solar plan/.test(await page.textContent('#drWins')) && /\$120/.test(await page.textContent('#drWins')));
  await page.click('#drWins .dr-li'); await settle(page);
  await page.fill('#drSaleV', '150'); await page.click('#drSaleGo'); await settle(page);
  ok('a win can be corrected', (await store(page)).sh[0].k.slice(-1)[0].v === 15000);
  await page.click('#drWins .dr-li'); await settle(page);
  await top(page).locator('button', { hasText: 'Remove' }).click(); await settle(page);
  ok('removing a win takes it off the record', (await store(page)).sh[0].k.filter((k) => k.o === 'sa').length === 0);
  await page.click('.dr-toast button'); await settle(page);
  ok('and Undo puts it back where it was', (await store(page)).sh[0].k.slice(-1)[0].v === 15000);

  /* ── a shift written up afterwards ── */
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  await page.click('.dr-link'); await settle(page);
  await page.fill('#drMD', '2026-11-03'); await page.fill('#drMA', 'Oak Road');
  await page.fill('#drMK', '50'); await page.fill('#drMAn', '10'); await page.fill('#drMPi', '20');
  await page.click('#drMGo'); await page.waitForTimeout(200);
  ok('a pitched figure larger than answered is refused', (await store(page)).sh.length === 1 && /more than the one before/.test(await page.textContent('.dr-toast')));
  await page.fill('#drMPi', '6'); await page.fill('#drMSa', '2'); await page.fill('#drMRv', '200'); await page.fill('#drMH', '2.5');
  await page.click('#drMGo'); await settle(page);
  st = await store(page);
  const man = st.sh.find((s) => s.m);
  ok('written up, a shift keeps totals rather than invented doors', man && man.k.length === 0 && man.m.k === 50 && man.m.sa === 2 && man.m.rv === 20000 && man.m.h === 2.5, man);
  const fun2 = await page.$$eval('#drFunnel .dr-fr', (r) => r.map((x) => x.querySelector('span b').textContent));
  ok('and counts in the funnel like any other', fun2.join() === '62,16,9,3', fun2);

  /* ── the calendar ── */
  await page.click('.dr-bar button[data-v="cal"]'); await settle(page);
  ok('today on the calendar carries its sale', (await page.textContent('.dr-cell[data-d="2026-11-04"] small')).trim() === '1✓');
  ok('a day still ahead cannot be pressed', await page.$eval('.dr-cell[data-d="2026-11-05"]', (e) => e.disabled));
  await page.click('.dr-cell[data-d="2026-11-03"]'); await settle(page);
  ok('a day opens on its shifts', /Oak Road/.test(await top(page).textContent()));
  await page.keyboard.press('Escape'); await settle(page);

  /* ── the report ── */
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  await page.click('#drRepBtn'); await settle(page);
  ok('the report opens on this week', /This week/.test(await page.textContent('#drRep')) && /3 sales/.test(await page.textContent('#drRep .dr-rep-hero')));
  ok('its wins name what was sold', /Solar plan/.test(await page.textContent('#drRep')));
  const fits = await page.$eval('#drRep', (e) => e.getBoundingClientRect().bottom);
  ok('and the whole of it is on one screen, made to be photographed', fits <= 844 - 70, fits);
  await top(page).locator('.dr-seg button[data-p="today"]').click();
  ok('Today narrows it to today', /1 sale/.test(await page.textContent('#drRep .dr-rep-hero')));
  await page.click('#drRepCopy'); await page.waitForTimeout(200);
  const txt = await page.evaluate(() => window.__copied);
  ok('Copy as text carries the funnel and the win', /12 doors → 6 answered → 3 pitched → 1 sold/.test(txt) && /Solar plan · \$150/.test(txt), txt);
  ok('nothing scrolls sideways', await sideways(page) <= 0);
  await page.keyboard.press('Escape'); await settle(page);

  /* ── your name and the currency ── */
  await page.click('.dr-bar button[data-v="you"]'); await settle(page);
  await page.fill('#drName', 'Sam'); await page.dispatchEvent('#drName', 'change');
  await page.click('#drYou .dr-pill[data-k="£"]');
  st = await store(page);
  ok('your name and currency are kept', st.name === 'Sam' && st.cur === '£');
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  ok('and money is drawn in it', /£/.test(await page.textContent('#drStats')));
  await c.close();

  /* ── where to improve, against your own record ── */
  /* Four weeks before this one closing three in ten pitches; this week
     closing one in four, with answer and pitch rates holding up. */
  const hist = [];
  ['2026-10-06', '2026-10-13', '2026-10-20', '2026-10-27'].forEach((d, i) =>
    hist.push(shift('h' + i, d, 15, i % 2 ? 'Hill Park' : 'River Side', { na: 40, ni: 10, pi: 7, cb: 0, sa: 3 }, 9900)));
  hist.push(shift('w1', '2026-11-02', 11, 'River Side', { na: 40, ni: 10, pi: 9, sa: 3 }, 9900));
  hist.push(shift('w2', '2026-11-03', 17, 'Hill Park', { na: 40, ni: 10, pi: 9, sa: 3 }, 9900));
  const r = await ctx({ v: 1, name: '', cur: '$', goal: { sa: 3, dr: 80 }, sh: hist, pr: [] });
  const p2 = r.page;
  const foc = await p2.$$eval('#drFunnel .dr-step', (s) => s.filter((x) => x.classList.contains('is-focus')).map((x) => x.dataset.s));
  ok('a close rate down on the usual is the step to work on', foc.join() === 'sa', foc);
  ok('and the line says so in words', /Work on: close/.test(await p2.textContent('#drFocus')));
  ok('the step that held up says so', /same as usual|\+/.test(await p2.textContent('#drFunnel .dr-step[data-s="an"] small')));
  ok('the focus is a ring, never a red', await p2.$eval('.dr-step.is-focus', (e) => !/255, 59, 48/.test(getComputedStyle(e).color + getComputedStyle(e).backgroundColor)));
  ok('the most common no is named', /Most common no: price/.test(await p2.textContent('#drFocus')));
  ok('why they said no is a card of its own', /Price/.test(await p2.textContent('#drWhy')));
  await p2.click('#drRepBtn'); await settle(p2);
  await p2.click('.dr-sheet .dr-seg button[data-p="month"]');
  const fit2 = await p2.$eval('#drRep', (e) => e.getBoundingClientRect().bottom);
  ok('a month of wins still fits one screen: the list stops at four and says how many more', fit2 <= 844 && /\+ 2 more/.test(await p2.textContent('#drRep')), fit2);
  await p2.keyboard.press('Escape'); await settle(p2);
  await p2.click('#drFunnel .dr-seg button[data-p="all"]'); await settle(p2);
  const hrs = await p2.$$eval('#drHours .dr-hrs > div', (d) => d.map((x) => x.dataset.h + (x.classList.contains('is-best') ? '*' : '')));
  ok('best hours over all time marks the hour that sells', hrs.join() === '11,15*,17', hrs);
  ok('areas are ranked by sales per hundred doors', (await p2.$$eval('#drAreas .dr-br span', (s) => s.map((x) => x.textContent))).length === 2);
  ok('nothing scrolls sideways', await sideways(p2) <= 0);
  await r.c.close();

  /* ── a damaged record is repaired, not discarded ── */
  const bad = { v: 1, cur: 'zz', goal: { sa: -4 }, sh: [shift('ok1', '2026-11-02', 10, 'A', { na: 2, sa: 1 }, 500), { id: 9, d: 'nope' }, { id: 'x', d: '2026-11-01', s: 1, e: 2, k: [{ o: 'zz' }, { o: 'na', t: 1 }] }], pr: [7, 'Plan'] };
  const d = await ctx(bad);
  await d.page.click('.dr-bar button[data-v="you"]'); await settle(d.page);
  const doorsAll = await d.page.$$eval('#drYou .dr-sum b', (b) => b.map((x) => x.textContent));
  ok('a damaged shift and a damaged door cost themselves: two shifts, four doors survive', doorsAll[0] === '2' && doorsAll[1] === '4', doorsAll);
  ok('an unknown currency falls back to dollars', await d.page.$eval('#drYou .dr-pill[data-k="$"]', (e) => e.getAttribute('aria-pressed')) === 'true');
  await d.page.fill('#drName', 'R'); await d.page.dispatchEvent('#drName', 'change');
  const fixed = await store(d.page);
  ok('and the repaired shape is what gets written back', fixed.sh.length === 2 && fixed.cur === '$' && fixed.goal.sa === 3 && fixed.pr.join() === 'Plan', fixed);
  await d.c.close();

  ok('no request leaves the phone', offOrigin.length === 0, offOrigin);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
  console.log(`\n  ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
