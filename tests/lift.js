/* ═══════════════════════════════════════════════════════════════
   LIFT — the workout log. Every check here drives the real app: makes
   an exercise and a routine through the screens, runs a workout from
   the bottom sheet, logs sets, finishes, and reads it back off the home
   tiles and the calendar.

   The clock is frozen at Friday 30 October 2026, 18:00.
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
const URL = `${BASE}/lift/`;
const freeze = (at) => `(() => {
  const F = new Date('${at}').getTime(); const R = Date;
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  async function ctx(seed, at) {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze(at || '2026-10-30T18:00:00'));
    if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(seed))}); })();`);
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) offOrigin.push(u); });
    await page.goto(URL); await page.waitForTimeout(300);
    return { c, page };
  }
  const store = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1') || 'null'));
  const settle = (page) => page.waitForTimeout(420);
  const top = (page) => page.locator('.lf-sheet').last();

  /* ── a first open ── */
  const { c, page } = await ctx();
  ok('the home screen draws', await page.locator('#lfHome .lf-today').count() === 1);
  ok('a Friday opens on Lower C of the split', (await page.textContent('#lfPick')).trim() === 'Lower C' && /Leg hypertrophy/.test(await page.textContent('.lf-sub')));
  ok('with its five exercises', /5 exercises/.test(await page.textContent('.lf-chips')));
  const legs = await page.$$eval('#lfLegs .lf-vr', (r) => r.map((x) => x.dataset.m + ':' + x.querySelector('em').textContent));
  ok('leg sets this week start at nought against the targets', legs.join() === 'Quads:0 / 13–16,Hamstrings:0 / 10,Glutes:0 / 5–8,Calves:0 / 9', legs);
  ok('three stat tiles, each nought', (await page.$$eval('.lf-stat b', (b) => b.map((x) => x.textContent))).join() === '0,0,0');
  const days = await page.$$eval('.lf-day', (d) => ({ n: d.length, now: d.filter((x) => x.classList.contains('is-now')).length, last: d[d.length - 1].dataset.d }));
  ok('the last 30 days are thirty marks ending today', days.n === 30 && days.now === 1 && days.last === '2026-10-30', days);
  const bar = await page.$$eval('.lf-bar button', (b) => b.map((x) => { const r = x.getBoundingClientRect(); return [r.width, r.height]; }));
  ok('four tabs, every one a 44px target', bar.length === 4 && bar.every(([w, h]) => w >= 44 && h >= 44), bar);
  ok('nothing scrolls sideways', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  /* ── an exercise and a routine, made on the screens ── */
  await page.click('.lf-bar [data-v="lib"]');
  const split = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
  ok('the split is seven days, Monday first', split.length === 7 && split[0] === 'Mon · Lower A' && split[6] === 'Sun · Shoulders + Arms', split);
  await page.click('#lfSplit .lf-li >> nth=0'); await settle(page);
  const mon = await top(page).textContent();
  ok('a day of the split reads its sets × reps', mon.includes('Hack squat') && mon.includes('3 × 6–10') && mon.includes('1–2 RIR') && mon.includes('Standing calf raises'), mon.slice(0, 160));
  await page.keyboard.press('Escape'); await settle(page);
  async function makeEx(name, muscle) {
    await page.click('#lfNewEx'); await settle(page);
    await page.fill('#lfExN', name);
    await top(page).locator('.lf-pill', { hasText: muscle }).click();
    await top(page).locator('button', { hasText: 'Save' }).click(); await settle(page);
  }
  await makeEx('Bench press', 'Chest');
  await makeEx('Overhead press', 'Shoulders');
  let s = await store(page);
  ok('two exercises of your own are on the record', s.ex.length === 2 && s.ex[0].m === 'Chest' && s.ex[1].m === 'Shoulders', s.ex);
  ok('and in the library beside the split\'s', await page.locator('#lfLibList .lf-li', { hasText: 'Bench press' }).count() === 1 && await page.locator('#lfLibList .lf-li', { hasText: 'Romanian deadlift' }).count() === 1);

  await page.click('#lfNewRt'); await settle(page);
  await page.fill('#lfRtN', 'Push'); await page.fill('#lfRtS', 'Push, Pull, Legs');
  for (const n of ['Bench press', 'Overhead press']) {
    await top(page).locator('.lf-add').click(); await settle(page);
    await top(page).locator('.lf-li', { hasText: n }).click(); await settle(page);
  }
  await top(page).locator('button', { hasText: 'Save' }).click(); await settle(page);
  s = await store(page);
  ok('a routine holds its exercises in order', s.rt.length === 1 && s.rt[0].n === 'Push' && s.rt[0].ex.join() === s.ex.map((e) => e.id).join(), s.rt);

  /* ── the workout comes up from the bottom ── */
  await page.click('.lf-bar [data-v="home"]');
  await page.click('#lfPick'); await settle(page);
  await top(page).locator('.lf-li', { hasText: 'Push, Pull, Legs' }).click(); await settle(page);
  ok('picking a routine makes it today, for today', (await store(page)).pick.d === '2026-10-30');
  ok('today is the routine', (await page.textContent('#lfPick')).trim() === 'Push' && /Push, Pull, Legs/.test(await page.textContent('.lf-sub')));
  ok('and says two exercises', /2 exercises/.test(await page.textContent('.lf-chips')));
  await page.click('#lfGo');
  await page.waitForTimeout(40);
  const mid = await page.$eval('.lf-session', (e) => e.getBoundingClientRect().top);
  await settle(page);
  const end = await page.$eval('.lf-session', (e) => e.getBoundingClientRect().top);
  ok('the session rises from the foot of the screen', mid > end && end < 60, { mid, end });
  ok('carrying the routine\'s two exercises', (await page.$$eval('.lf-session .lf-ex-n', (x) => x.map((e) => e.textContent))).join() === 'Bench press,Overhead press');
  ok('with three sets each when they are new', (await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length))).join() === '3,3');
  ok('its finish button is the red one', await page.$eval('#lfFinish', (b) => getComputedStyle(b).backgroundColor) === 'rgb(255, 59, 48)');

  const set = (ex, i) => page.locator('.lf-session .lf-ex').nth(ex).locator('.lf-set:not(.is-hd)').nth(i);
  await set(0, 0).locator('.lf-chk').click();
  ok('a set with nothing in it cannot be logged', !(await set(0, 0).getAttribute('class')).includes('is-done') && /weight and reps/.test(await page.textContent('.lf-toast')));
  await set(0, 0).locator('input').nth(0).fill('60'); await set(0, 0).locator('input').nth(1).fill('8');
  await set(0, 0).locator('.lf-chk').click();
  ok('logging a set turns its check red', await set(0, 0).locator('.lf-chk span').evaluate((e) => getComputedStyle(e).backgroundColor) === 'rgb(255, 59, 48)');
  ok('and starts the rest clock', /^Rest 0:0\d · target 60–120s$/.test((await page.textContent('#lfRest')).trim()));
  await set(0, 1).locator('input').nth(0).fill('60'); await set(0, 1).locator('input').nth(1).fill('7');
  await set(0, 1).locator('.lf-chk').click();
  await set(1, 0).locator('input').nth(0).fill('40'); await set(1, 0).locator('input').nth(1).fill('10');
  await set(1, 0).locator('.lf-chk').click();

  /* ── the app closes mid-workout ── */
  await page.reload(); await page.waitForTimeout(600);
  ok('a workout in progress comes back up after a reload', await page.locator('.lf-session').count() === 1);
  ok('with its logged sets still logged', await set(0, 1).evaluate((e) => e.classList.contains('is-done')) && await set(0, 1).locator('input').nth(1).inputValue() === '7');
  await page.keyboard.press('Escape'); await settle(page);
  ok('put away, it is a red bar you can come back to', await page.isVisible('#lfLive') && (await page.textContent('#lfLive')).includes('Push'));
  ok('and the sheet is gone from the document, not hidden', await page.locator('.lf-sheet').count() === 0);
  const dot = await page.$eval('#lfLive .lf-rec', (e) => { const r = e.getBoundingClientRect(); return [r.width, r.height]; });
  ok('its red dot is a dot', Math.abs(dot[0] - dot[1]) < 1 && dot[0] < 12, dot);
  ok('the start button says resume', (await page.textContent('#lfGo')).includes('Resume'));
  await page.click('#lfLive'); await settle(page);
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  s = await store(page);
  ok('finishing files only the ticked sets', s.wo.length === 1 && s.wo[0].x.map((e) => e.sets.length).join() === '2,1' && s.wo[0].d === '2026-10-30', s.wo);
  ok('weights are stored as entered', s.wo[0].x[0].sets[0].w === 60 && s.wo[0].x[0].sets[1].r === 7);
  ok('a summary comes up', (await top(page).textContent()).includes('Workout logged'));
  await page.keyboard.press('Escape'); await settle(page);
  ok('the bar is gone with the workout', await page.isHidden('#lfLive') && await page.evaluate(() => !localStorage.getItem('lift.active.v1')));
  const stats = await page.$$eval('.lf-stat b', (b) => b.map((x) => x.textContent));
  ok('the tiles count it: 1 workout, 3 sets, 1,260 kg', stats.join() === '1,3,1.3k', stats);
  ok('today is lit in the 30 days', await page.$eval('.lf-day.is-now', (e) => e.classList.contains('is-on')));
  ok('this week\'s bars say 25 reps', (await page.textContent('#lfWeek .lf-big')).startsWith('25'));

  /* ── progressive overload ── */
  await page.click('#lfGo'); await settle(page);
  ok('a second time, an exercise comes in with last time\'s set count', (await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length))).join() === '2,1');
  ok('and last time\'s figures beside it', (await set(0, 0).locator('.lf-prev').textContent()) === '60×8' && await set(0, 0).locator('input').nth(0).getAttribute('placeholder') === '60');
  await set(0, 0).locator('.lf-chk').click();
  ok('ticking an empty set repeats last time', await set(0, 0).locator('input').nth(1).inputValue() === '8');
  ok('a repeat is not a record', (await set(0, 0).locator('.lf-sn').textContent()) === '1');
  await set(0, 1).locator('input').nth(0).fill('65'); await set(0, 1).locator('input').nth(1).fill('8');
  await set(0, 1).locator('.lf-chk').click();
  ok('more weight for the same reps is marked PR', (await set(0, 1).locator('.lf-sn').textContent()) === 'PR');
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  await page.keyboard.press('Escape'); await settle(page);

  await page.click('.lf-bar [data-v="lib"]');
  await page.locator('#lfLibList .lf-li', { hasText: 'Bench press' }).click(); await settle(page);
  const ex = await top(page).textContent();
  ok('an exercise reads back its best set and both sessions', ex.includes('65×8') && /2\s*sessions/.test(ex), ex.slice(0, 120));
  ok('with its trend drawn', await top(page).locator('.lf-area path').count() >= 1);
  await page.keyboard.press('Escape'); await settle(page);

  /* ── the calendar ── */
  await page.click('.lf-bar [data-v="cal"]');
  ok('the month opens on October 2026', (await page.textContent('.lf-calnav b')) === 'October 2026');
  const cell = await page.$eval('.lf-cell[data-d="2026-10-30"]', (e) => ({ on: e.classList.contains('is-on'), now: e.classList.contains('is-now'), dots: e.querySelectorAll('.lf-dots i').length }));
  ok('today is a trained day with two workouts on it', cell.on && cell.now && cell.dots === 2, cell);
  ok('a day still ahead cannot be pressed', await page.$eval('.lf-cell[data-d="2026-10-31"]', (e) => e.disabled));
  ok('later is refused on the month you are in', await page.$eval('.lf-calnav .lf-round:last-child', (e) => e.disabled));
  await page.click('.lf-calnav .lf-round:first-child');
  ok('earlier steps back a month', (await page.textContent('.lf-calnav b')) === 'September 2026');
  await page.click('.lf-seg [data-m="week"]');
  ok('the week is Monday to Sunday around today', (await page.textContent('.lf-calnav b')) === '26 Oct – 1 Nov');
  const wk = await page.$$eval('#lfWeekList .lf-wk', (r) => r.map((x) => x.querySelector('.lf-wn b').textContent));
  ok('Friday carries both workouts and a past day says Rest', wk[4] === 'Push + Push' && wk[0] === 'Rest' && wk[6] === '', wk);
  await page.click('.lf-seg [data-m="month"]');
  await page.click('.lf-cell[data-d="2026-10-30"]'); await settle(page);
  ok('a day with two workouts lists them', await top(page).locator('.lf-li').count() === 2);
  await top(page).locator('.lf-li').first().click(); await settle(page);
  await top(page).locator('button', { hasText: 'Delete workout' }).click(); await settle(page);
  ok('deleting a workout takes it off the record', (await store(page)).wo.length === 1);
  await page.click('.lf-toast button'); await settle(page);
  ok('and Undo puts it back', (await store(page)).wo.length === 2);

  /* ── units ── */
  await page.click('.lf-bar [data-v="you"]');
  await page.click('#lfUnit [data-u="lb"]');
  await page.click('.lf-bar [data-v="home"]');
  ok('pounds is a display, the record stays in kilos', (await page.$$eval('.lf-stat span', (x) => x.map((e) => e.textContent)))[2] === 'lb' && (await store(page)).wo[0].x[0].sets[0].w === 60);

  ok('nothing leaves this phone', offOrigin.length === 0, offOrigin);
  ok('nothing threw', errors.length === 0, errors);
  await c.close();

  /* ── the split: a Monday, with last Monday on the record ── */
  {
    const last = (reps) => ({ unit: 'kg', goal: 4, ex: [], rt: [], bw: [],
      wo: [{ id: 'm1', d: '2026-10-26', s: 1, e: 2, n: 'Lower A', rt: 'p-mon', x: [
        { id: 'hack', n: 'Hack squat', sets: reps.map((r) => ({ w: 80, r })) },
        { id: 'squat', n: 'Barbell squat', sets: [{ w: 100, r: 6 }, { w: 100, r: 6 }, { w: 100, r: 6 }] }] }] });
    {
      const { c, page } = await ctx(last([8, 8, 7]), '2026-11-02T07:00:00');
      ok('a Monday opens on Lower A', (await page.textContent('#lfPick')).trim() === 'Lower A');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      ok('the set count is the program\'s', await ex.locator('.lf-set:not(.is-hd)').count() === 3);
      ok('the target is written under the name', (await ex.locator('.lf-tg').textContent()) === '3 × 6–10 · 1–2 RIR · rest 2–3 min');
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('under the top of the range, the aim is the same weight and one more rep', ph.join() === '80,9,80,9,80,8', ph);
      ok('and it says so', (await ex.locator('.lf-aim').textContent()).includes('one more rep'));
      await ex.locator('.lf-chk').first().click();
      ok('ticking an empty set logs the aim', (await ex.locator('.lf-set:not(.is-hd) input').nth(1).inputValue()) === '9');
      ok('the rest clock names its target', /target 2–3 min/.test(await page.textContent('#lfRest')));
      await page.keyboard.press('Escape'); await settle(page);
      ok('a ticked set counts toward the week\'s quads straight away', (await page.textContent('#lfLegs [data-m="Quads"] em')).startsWith('1 /'));
      await c.close();
    }
    {
      const { c, page } = await ctx(last([10, 10, 10]), '2026-11-02T07:00:00');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('ten on every set moves the weight up 2.5 and the reps back to six', ph.join() === '82.5,6,82.5,6,82.5,6', ph);
      ok('and says go up', (await ex.locator('.lf-aim').textContent()).includes('go up to 82.5'));
      await c.close();
    }
  }

  /* ── a damaged record is repaired, never thrown away ── */
  {
    const bad = { unit: 'kg', goal: 99, ex: [{ id: 'a', n: 'Row', m: 'Back' }, { n: 'no id' }],
      wo: [{ id: 'w1', d: '2026-10-20', s: 1, e: 2, n: 'Pull', x: [{ id: 'a', n: 'Row', sets: [{ w: 50, r: 10 }, { w: 'x', r: 2 }, null] }] }, { d: 'nope' }] };
    const { c, page } = await ctx(bad);
    const r = await store(page);
    ok('a bad set costs the set, a bad workout the workout', r.wo.length === 1 && r.wo[0].x[0].sets.length === 1 && r.ex.length === 1 && r.goal === 7, r);
    ok('and the repair is written back', JSON.parse(await page.evaluate(() => localStorage.getItem('lift.v1'))).wo[0].x[0].sets.length === 1);
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
