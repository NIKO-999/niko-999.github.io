/* ═══════════════════════════════════════════════════════════════
   LIFT — the workout log. Every check here drives the real app: makes
   an exercise and a routine through the screens, runs a workout from
   the bottom sheet, logs sets, finishes, and reads it back off the home
   tiles and the calendar.

   The clock is frozen at Friday 30 October 2026, 18:00.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');
const path = require('path');

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
  /* the folding cards on You are opened in every test phone as they are
     drawn, so the checks inside them can press; a fold is held for the
     visit only, so this does it each time one appears. The one check
     about folding uses newCtx and starts them shut. */
  const newCtx = browser.newContext.bind(browser);
  browser.newContext = async (o) => { const c = await newCtx(o); await c.addInitScript(`(() => { const ids = ['lfSet', 'lfBadges', 'lfFocus', 'lfTheme']; new MutationObserver(() => { ids.forEach((id) => { const b = document.querySelector('#' + id + ' h3 > button[aria-expanded="false"]'); if (b && !b.dataset.auto) { b.dataset.auto = 1; b.click(); } }); }).observe(document, { childList: true, subtree: true }); })();`); return c; };
  const errors = [], offOrigin = [];
  async function ctx(seed, at, keepBadges) {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze(at || '2026-10-30T18:00:00'));
    /* a badge earned along the way comes up over the screen; checks that
       are not about badges put it away the moment it appears */
    if (!keepBadges) await c.addInitScript(`new MutationObserver(() => { const v = document.querySelector('.lf-cv'); if (v) v.querySelector('.lf-cv-x').click(); }).observe(document, { childList: true, subtree: true });`);
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
  ok('a Friday opens on Quad volume of the split', (await page.textContent('#lfPick')).trim() === 'Quad volume' && /Pendulum squat/.test(await page.textContent('.lf-sub')));
  ok('the routine name has no border round it', await page.$eval('#lfPick', (e) => getComputedStyle(e).borderTopStyle === 'none' || parseFloat(getComputedStyle(e).borderTopWidth) === 0));
  ok('and lines up with the label above it', await page.evaluate(() => Math.abs(document.querySelector('#lfPick').getBoundingClientRect().left - document.querySelector('.lf-today .lf-lab').getBoundingClientRect().left) < 1));
  ok('with its five exercises', /5 exercises/.test(await page.textContent('.lf-chips')));
  const legs = await page.$$eval('#lfLegs .lf-vr', (r) => r.map((x) => x.dataset.m + ':' + x.querySelector('em').textContent));
  ok('leg sets this week start at nought against the targets', legs.join() === 'Quads:0 / 16,Hamstrings:0 / 14,Calves:0 / 15,Glutes:0 / 6,Chest:0 / 16,Back:0 / 16,Shoulders:0 / 16,Triceps:0 / 10,Biceps:0 / 10,Abs:0 / 11', legs);
  ok('three stat tiles, each nought', (await page.$$eval('.lf-stat b', (b) => b.map((x) => x.textContent))).join() === '0,0,0');
  const days = await page.$$eval('.lf-day', (d) => ({ n: d.length, now: d.filter((x) => x.classList.contains('is-now')).length, last: d[d.length - 1].dataset.d }));
  ok('the last 30 days are thirty marks ending today', days.n === 30 && days.now === 1 && days.last === '2026-10-30', days);
  const bar = await page.$$eval('.lf-bar button', (b) => b.map((x) => { const r = x.getBoundingClientRect(); return [r.width, r.height]; }));
  ok('five tabs, every one a 44px target', bar.length === 5 && bar.every(([w, h]) => w >= 44 && h >= 44), bar);
  ok('nothing scrolls sideways', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  /* ── an exercise and a routine, made on the screens ── */
  await page.click('.lf-bar [data-v="lib"]');
  const split = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
  ok('the split is seven days, Monday first', split.length === 7 && split[0] === 'Mon · Quad strength' && split[6] === 'Sun · Choice day', split);
  await page.click('#lfSplit .lf-li >> nth=0'); await settle(page);
  const mon = await top(page).textContent();
  ok('a day of the split reads its sets × reps', mon.includes('Hack squat') && mon.includes('4 × 6–10') && mon.includes('1 RIR') && mon.includes('2 × 10–12 each side') && mon.includes('Standing calf raises'), mon.slice(0, 160));
  ok('a day of the split says what it is for', /^Quad strength/.test(await top(page).locator('#lfTip b').textContent())
    && /75–90 minutes/.test(await top(page).locator('#lfTip').textContent()) && /Double progression/.test(await top(page).locator('#lfTip').textContent()));
  ok('the focus comes before the exercises', await top(page).evaluate((s) => !!(s.querySelector('#lfTip').compareDocumentPosition(s.querySelector('.lf-list')) & 4)));
  await page.keyboard.press('Escape'); await settle(page);
  /* Tuesday, the screen this was reported on: a list long enough that
     the next exercise sits above the open one, on the scrim. */
  await page.click('#lfSplit .lf-li >> nth=1'); await settle(page);
  await top(page).locator('.lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Incline dumbbell press' + '$') }) }).click(); await settle(page);
  ok('an exercise opens over the day', (await top(page).locator('h2').textContent()) === 'Incline dumbbell press');
  const nx = await page.locator('.lf-sheet').first().locator('.lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Cable chest flyes' + '$') }) }).boundingBox();
  await page.mouse.click(nx.x + 40, nx.y + 10); await settle(page);
  ok('tapping another closes the first and opens the one tapped', await page.locator('.lf-sheet').count() === 2
    && (await top(page).locator('h2').textContent()) === 'Cable chest flyes', await page.$$eval('.lf-sheet h2', (h) => h.map((x) => x.textContent)));
  await page.keyboard.press('Escape'); await settle(page);
  await page.keyboard.press('Escape'); await settle(page);
  const sun = () => page.$$eval('#lfSplit .lf-li span', (x) => x[6].textContent);
  ok('Sunday is a choice, not a list of exercises', /Weak points, technique, recovery/.test(await sun()), await sun());
  await page.click('#lfSplit .lf-li >> nth=6'); await settle(page);
  ok('and opens on its four choices', (await top(page).locator('.lf-ch-o b').allTextContents()).join() === 'Weak points,Leg technique,Recovery,More volume' && /never another heavy quad session/.test(await top(page).textContent()));
  await page.keyboard.press('Escape'); await settle(page);
  /* WHAT YOU WORK ON IS YOURS: calves are a row you edit, not a switch. */
  async function setFocus(m, lo, hi) {
    await page.click('#lfFocus .lf-li[data-m="' + m + '"]'); await settle(page);
    await top(page).locator('#lfFoLo').fill(String(lo)); await top(page).locator('#lfFoHi').fill(String(hi));
    await top(page).locator('button', { hasText: 'Save' }).click(); await settle(page);
  }
  await page.click('.lf-bar [data-v="you"]');
  ok('there is no calves switch any more', await page.locator('#lfCalf').count() === 0);
  const foc = await page.$$eval('#lfFocus .lf-li', (r) => r.map((x) => x.dataset.m + ':' + x.querySelector('em').textContent));
  ok('focus lists every muscle and its weekly sets', foc.join() === 'Quads:16,Hamstrings:14,Calves:15,Glutes:6,Chest:16,Back:16,Shoulders:16,Triceps:10,Biceps:10,Abs:11', foc);
  await setFocus('Calves', 12, 14);
  await page.click('.lf-bar [data-v="home"]');
  ok('a target edited under You moves the week', (await page.textContent('#lfLegs [data-m="Calves"] em')) === '0 / 12–14');
  await page.click('.lf-bar [data-v="you"]'); await setFocus('Calves', 15, 15);
  /* Add one, make it a priority, and it leads the week's card. */
  await page.click('#lfFocusAdd'); await settle(page);
  await top(page).locator('.lf-pill', { hasText: /^Core$/ }).click();
  await top(page).locator('#lfFoLo').fill('10'); await top(page).locator('#lfFoHi').fill('14');
  await top(page).locator('#lfFoP [data-p="1"]').click();
  await top(page).locator('button', { hasText: 'Save' }).click(); await settle(page);
  await page.click('.lf-bar [data-v="home"]');
  const legs2 = await page.$$eval('#lfLegs .lf-vr', (r) => r.map((x) => x.dataset.m));
  ok('an added priority joins the week, among the priorities', legs2.join() === 'Quads,Hamstrings,Calves,Glutes,Core,Chest,Back,Shoulders,Triceps,Biceps,Abs', legs2);
  ok('a separator still splits priorities from the rest', await page.$$eval('#lfLegs .lf-vol > *', (k) => k[5].classList.contains('lf-vsep')));
  /* Remove it, and Undo puts it back where it was. */
  await page.click('.lf-bar [data-v="you"]');
  await page.click('#lfFocus .lf-li[data-m="Core"]'); await settle(page);
  await top(page).locator('button', { hasText: 'Remove' }).click(); await settle(page);
  ok('a muscle comes out of focus', (await store(page)).focus.every((f) => f.m !== 'Core'));
  await page.locator('.lf-toast button').click(); await settle(page);
  ok('and Undo puts it back', (await store(page)).focus.some((f) => f.m === 'Core'));
  await page.click('#lfFocus .lf-li[data-m="Core"]'); await settle(page);
  await top(page).locator('button', { hasText: 'Remove' }).click(); await settle(page);
  await page.click('.lf-bar [data-v="lib"]');
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
  ok('and in the library beside the split\'s', await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Bench press' + '$') }) }).count() === 1 && await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Romanian deadlift' + '$') }) }).count() === 1);

  const grp = await page.evaluate(() => [...document.querySelectorAll('#lfLibList .lf-card')].map(c => [c.dataset.g, c.querySelector('.lf-cap').textContent, [...c.querySelectorAll('.lf-li b')].map(b => b.textContent)]));
  ok('the library is Push, Pull, Legs and Core, in that order', grp.map(g => g[0]).join() === 'push,pull,legs,core', grp.map(g => g[1]));
  ok('pendulum squat is built in, under Legs', grp[2] && grp[2][2].includes('Pendulum squat'), grp[2] && grp[2][2].slice(0, 8));
  ok('rear delts are a pull, not a push', grp[1] && grp[1][2].includes('Face pulls') && !grp[0][2].includes('Face pulls'));
  ok('your own exercise lands in its group', grp[0] && grp[0][2].includes('Bench press'));
  await page.locator('.lf-ppl button', { hasText: 'Legs' }).click();
  const legsOnly = await page.evaluate(() => [...document.querySelectorAll('#lfLibList .lf-card')].map(c => c.dataset.g));
  ok('the filter narrows to one group', legsOnly.join() === 'legs', legsOnly);
  await page.locator('.lf-ppl button', { hasText: 'All' }).click();

  await page.click('#lfNewRt'); await settle(page);
  await page.fill('#lfRtN', 'Push'); await page.fill('#lfRtS', 'Push, Pull, Legs');
  for (const n of ['Bench press', 'Overhead press']) {
    await top(page).locator('.lf-add').click(); await settle(page);
    if (n === 'Bench press') {
      const caps = await top(page).locator('.lf-pick-h').allTextContents();
      ok('the picker is grouped Push, Pull, Legs, Core', caps.join() === 'Push,Pull,Legs,Core', caps);
      await top(page).locator('input[type=search]').fill('pendul');
      const hit = await top(page).locator('.lf-li b').allTextContents();
      ok('search still finds across the groups', hit.join() === 'Pendulum squat', hit);
      await top(page).locator('input[type=search]').fill('');
    }
    await top(page).locator('.lf-li', { has: page.locator('b', { hasText: new RegExp('^' + n + '$') }) }).click(); await settle(page);
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
  ok('its finish button is the lime one', await page.$eval('#lfFinish', (b) => getComputedStyle(b).backgroundColor) === 'rgb(163, 230, 53)');

  const set = (ex, i) => page.locator('.lf-session .lf-ex').nth(ex).locator('.lf-set:not(.is-hd)').nth(i);
  await set(0, 0).locator('.lf-chk').click();
  ok('a set with nothing in it cannot be logged', !(await set(0, 0).getAttribute('class')).includes('is-done') && /weight and reps/.test(await page.textContent('.lf-toast')));
  await set(0, 0).locator('input').nth(0).fill('60'); await set(0, 0).locator('input').nth(1).fill('8');
  await set(0, 0).locator('.lf-chk').click();
  ok('logging a set turns its check lime', await set(0, 0).locator('.lf-chk span').evaluate((e) => getComputedStyle(e).backgroundColor) === 'rgb(163, 230, 53)');
  ok('and starts the rest clock', /^Rest 0:0\d · target 2–3 min$/.test((await page.textContent('#lfRest')).trim()));
  ok('the rest clock is always on screen, even scrolled to the end of the workout', await page.evaluate(() => {
    const bd = document.querySelector('.lf-session .lf-sh-bd'); bd.scrollTop = bd.scrollHeight;
    const r = document.querySelector('#lfRest').getBoundingClientRect();
    return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && !bd.contains(document.querySelector('#lfRest'));
  }));
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
  /* CARDIO AFTER: a kind and the minutes, one press each. */
  const cd = page.locator('#lfCardio');
  ok('only the two kinds you use are offered', (await cd.locator('.lf-pill[data-k]').allTextContents()).join() === 'Incline treadmill,Stairmaster');
  ok('the session ends on an optional cardio card', (await cd.locator('.lf-cd-sum').textContent()) === 'optional');
  await cd.locator('.lf-pill[data-k="stairs"]').click(); await cd.locator('.lf-pill[data-m="15"]').click();
  ok('picking it says what it is', (await cd.locator('.lf-cd-sum').textContent()) === '15 min stairmaster');
  await cd.locator('.lf-pill[data-m="15"]').click();
  ok('the same minutes pressed again clears it', (await cd.locator('.lf-cd-sum').textContent()) === 'optional');
  await cd.locator('.lf-cd-f').fill('12'); await cd.locator('.lf-cd-f').press('Tab');
  ok('minutes off the ladder go in the field', (await page.locator('#lfCardio .lf-cd-sum').textContent()) === '12 min stairmaster');
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  s = await store(page);
  ok('the workout carries its cardio', JSON.stringify(s.wo[0].cd) === '{"k":"stairs","m":12}' && s.ck === 'stairs', s.wo[0].cd);
  ok('the summary says it', /\+ 12 min stairmaster/.test(await top(page).textContent()));
  ok('finishing files only the ticked sets', s.wo.length === 1 && s.wo[0].x.map((e) => e.sets.length).join() === '2,1' && s.wo[0].d === '2026-10-30', s.wo);
  ok('weights are stored as entered', s.wo[0].x[0].sets[0].w === 60 && s.wo[0].x[0].sets[1].r === 7);
  ok('a summary comes up', (await top(page).textContent()).includes('Workout logged'));
  await page.waitForTimeout(1300);
  const vMoved = (await store(page)).wo[0].x.reduce((a, e) => a + e.sets.reduce((b, q) => b + q.w * q.r, 0), 0).toLocaleString('en-US');
  ok('the finish screen counts up to the volume moved, and fills the screen', (await top(page).locator('.lf-fin-vol span').textContent()) === vMoved && await top(page).evaluate((e) => e.classList.contains('is-full')), await top(page).locator('.lf-fin-vol span').textContent());
  ok('with the time, sets and reps, and that it is the first of its kind', /The first .* on record/.test(await top(page).locator('.lf-fin-u').textContent()) && /reps/.test(await top(page).locator('.lf-sum').textContent()));
  await page.keyboard.press('Escape'); await settle(page);
  ok('the bar is gone with the workout', await page.isHidden('#lfLive') && await page.evaluate(() => !localStorage.getItem('lift.active.v1')));
  const stats = await page.$$eval('.lf-stat b', (b) => b.map((x) => x.textContent));
  ok('the tiles count it: 1 workout, 3 sets, 1,260 kg', stats.join() === '1,3,1.3k', stats);
  ok('today is lit in the 30 days', await page.$eval('.lf-day.is-now', (e) => e.classList.contains('is-on')));
  ok('this week\'s bars say 25 reps', (await page.textContent('#lfWeek .lf-big')).startsWith('25'));
  await page.click('#lfWeek'); await settle(page);
  ok('this week opens its own sheet: the reps, the week day by day, and eight weeks drawn', (await top(page).locator('.lf-hero').textContent()) === '25' && /reps this week/.test(await top(page).textContent()) && await top(page).locator('.lf-bars').count() === 1 && await top(page).locator('#lfRepsTrend .lf-vs-dot').count() === 8);
  await page.keyboard.press('Escape'); await settle(page);
  ok('the week\'s card totals the cardio', (await page.textContent('#lfLegs .lf-cd-wk .lf-num')) === '12 min this week');
  await page.click('#lfGrid'); await settle(page);
  await page.locator('.lf-cell.is-now').click(); await settle(page);
  ok('the workout sheet shows it', (await top(page).locator('#lfWoCd > div').first().textContent()) === '12 min stairmaster');
  await top(page).locator('#lfWoCd .lf-pill[data-m="20"]').click();
  ok('and it can be changed after', (await store(page)).wo[0].cd.m === 20);
  await top(page).locator('#lfWoCd .lf-pill[data-m="20"]').click();
  ok('or taken off', (await store(page)).wo[0].cd === null);
  await page.keyboard.press('Escape'); await settle(page); await page.keyboard.press('Escape'); await settle(page);
  await page.click('.lf-bar [data-v="home"]'); await settle(page);
  ok('home does not offer cardio once the session is done', await page.locator('#lfAddCd').count() === 0);

  /* ONE WORKOUT A DAY: with today trained there is nothing to start */
  ok('a trained day offers no second workout', await page.locator('#lfGo').count() === 0);
  await page.click('.lf-bar [data-v="lib"]'); await settle(page);
  await page.click('#lfSplit .lf-li >> nth=0'); await settle(page);
  const stBtn = top(page).locator('button', { hasText: /^Start/ });
  if (await stBtn.count()) { await stBtn.first().click(); await settle(page); }
  ok('nor can one be started from the library', await page.locator('.lf-session').count() === 0 && !(await page.evaluate(() => localStorage.getItem('lift.active.v1'))));
  await page.keyboard.press('Escape'); await settle(page); await page.keyboard.press('Escape'); await settle(page);
  await page.click('.lf-bar [data-v="home"]'); await settle(page);

  /* ── progressive overload ── a second session needs today free, so the
     first is moved back a day for it and put back after */
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); s.wo[0].d = '2026-10-29'; localStorage.setItem('lift.v1', JSON.stringify(s)); });
  await page.reload(); await page.waitForTimeout(400);
  await page.click('#lfGo'); await settle(page);
  ok('a second time, an exercise comes in with last time\'s set count', (await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length))).join() === '2,1');
  ok('and last time\'s figures beside it', (await set(0, 0).locator('.lf-prev').textContent()) === '60×8' && await set(0, 0).locator('input').nth(0).getAttribute('placeholder') === '60');
  await set(0, 0).locator('.lf-chk').click();
  ok('ticking an empty set repeats last time', await set(0, 0).locator('input').nth(1).inputValue() === '8');
  ok('a repeat is not a record', (await set(0, 0).locator('.lf-sn').textContent()) === '1');
  /* NOUGHT IS BODY WEIGHT, and the field says so once you leave it. */
  {
    const wi = set(0, 1).locator('input').nth(0);
    await wi.fill('0'); await wi.blur();
    ok('a weight of 0 reads as BW', await wi.inputValue() === 'BW', await wi.inputValue());
    ok('and is still stored as 0', await page.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')).x[0].sets[1].w) === 0);
    await wi.fill('');
  }
  await set(0, 1).locator('input').nth(0).fill('65'); await set(0, 1).locator('input').nth(1).fill('8');
  await set(0, 1).locator('.lf-chk').click();
  ok('more weight for the same reps is marked PR', (await set(0, 1).locator('.lf-sn').textContent()) === 'PR');
  ok('and a PR bursts from the set', await page.evaluate(() => window.lfBursts) === 1 && await page.locator('.lf-burst b').textContent() === 'PR');
  await page.waitForTimeout(1100);
  ok('then is gone, out of the way', await page.locator('.lf-burst').count() === 0);
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  await page.keyboard.press('Escape'); await settle(page);
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); s.wo.forEach((w) => { if (w.d === '2026-10-29') w.d = '2026-10-30'; }); delete s.rd['2026-10-29']; localStorage.setItem('lift.v1', JSON.stringify(s)); });
  await page.reload(); await page.waitForTimeout(400);

  await page.click('.lf-bar [data-v="lib"]');
  await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Bench press' + '$') }) }).click(); await settle(page);
  const ex = await top(page).textContent();
  ok('an exercise reads back its best set and both sessions', ex.includes('65×8') && /2\s*sessions/.test(ex), ex.slice(0, 120));
  ok('with its trend drawn', await top(page).locator('.lf-area path').count() >= 1);
  await page.keyboard.press('Escape'); await settle(page);

  /* ── the calendar ── */
  await page.click('.lf-bar [data-v="cal"]');
  ok('the month opens on October 2026', (await page.textContent('.lf-calnav b')) === 'October 2026');
  const cell = await page.$eval('.lf-cell[data-d="2026-10-30"]', (e) => ({ on: e.classList.contains('is-on'), now: e.classList.contains('is-now'), dots: e.querySelectorAll('.lf-dots i').length }));
  ok('today is a trained day with two workouts on it', cell.on && cell.now && cell.dots === 2, cell);
  ok('a day you trained is lit lime, and today stays an outline', await page.evaluate(() => {
    const now = document.querySelector('.lf-cell.is-now'), day = document.querySelector('.lf-cell:not(.is-now):not(.is-pad)');
    const had = day.classList.contains('is-on'); day.classList.add('is-on');
    const lit = getComputedStyle(day).backgroundColor; if (!had) day.classList.remove('is-on');
    return lit === 'rgb(163, 230, 53)' && now.classList.contains('is-on') && getComputedStyle(now).backgroundColor !== 'rgb(163, 230, 53)';
  }));
  ok('a day still ahead cannot be pressed', await page.$eval('.lf-cell[data-d="2026-10-31"]', (e) => e.disabled));
  ok('later is refused on the month you are in', await page.$eval('.lf-calnav .lf-round:last-child', (e) => e.disabled));
  await page.click('.lf-calnav .lf-round:first-child');
  ok('earlier steps back a month', (await page.textContent('.lf-calnav b')) === 'September 2026');
  await page.click('.lf-seg [data-m="week"]');
  ok('the week is Monday to Sunday around today', (await page.textContent('.lf-calnav b')) === '26 Oct – 1 Nov');
  const wk = await page.$$eval('#lfWeekList .lf-wk', (r) => r.map((x) => x.querySelector('.lf-wn b').textContent));
  ok('Friday carries both workouts and an empty past day says nothing was logged', wk[4] === 'Push + Push' && wk[0] === 'Nothing logged' && wk[6] === '', wk);
  await page.click('.lf-seg [data-m="month"]');
  await page.click('.lf-cell[data-d="2026-10-30"]'); await settle(page);
  ok('a day with two workouts lists them', await top(page).locator('.lf-li').count() === 2);
  await top(page).locator('.lf-li').first().click(); await settle(page);
  ok('a finished workout opens to be read, with no delete button', /Push/.test(await top(page).textContent()) && await top(page).locator('button', { hasText: 'Delete workout' }).count() === 0);
  /* EDIT LIVES IN THE RECORD: a pencil on a workout opened from a day */
  ok('a workout opened from a day carries an edit button', await top(page).locator('#lfWoEdit').count() === 1);
  {
    const n0 = (await store(page)).wo.length;
    await top(page).locator('#lfWoEdit').click(); await settle(page);
    const E = top(page);
    ok('edit opens on its name, day and sets', await E.locator('#lfEdN').inputValue() === 'Push' && await E.locator('#lfEdD').inputValue() === '2026-10-30' && await E.locator('.lf-set.is-ed:not(.is-hd)').count() > 0);
    await E.locator('#lfEdN').fill('Push edited');
    await E.locator('.lf-set.is-ed:not(.is-hd) input').nth(1).fill('11');
    await E.locator('#lfEdSave').click(); await settle(page);
    const ed = (await store(page)).wo.filter((w) => w.n === 'Push edited');
    ok('save writes the name and the reps', ed.length === 1 && ed[0].x[0].sets[0].r === 11, ed);
    ok('and goes back to the workout, still editable', /Push edited/.test(await top(page).textContent()) && await top(page).locator('#lfWoEdit').count() === 1);
    await top(page).locator('#lfWoEdit').click(); await settle(page);
    await top(page).locator('#lfEdDel').click(); await settle(page);
    await top(page).locator('button', { hasText: /^Delete$/ }).click(); await settle(page);
    ok('delete asks, then takes it out', (await store(page)).wo.length === n0 - 1);
    await page.click('.lf-toast button'); await settle(page);
    ok('and Undo puts it back', (await store(page)).wo.length === n0 && (await store(page)).wo.some((w) => w.n === 'Push edited'));
  }
  await page.keyboard.press('Escape'); await settle(page);
  await page.keyboard.press('Escape'); await settle(page);

  /* and Today on home opens it to be read, with no pencil */
  await page.click('.lf-bar [data-v="home"]'); await settle(page);
  await page.click('#lfPick'); await settle(page);
  ok('a workout opened from home has no edit button', await page.locator('.lf-sheet').count() > 0 && await page.locator('#lfWoEdit').count() === 0);
  await page.keyboard.press('Escape'); await settle(page);

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
      ok('a session logged under the old day name takes the new one', (await store(page)).wo.find((w) => w.id === 'm1').n === 'Quad strength');
      ok('a Monday opens on Quad strength', (await page.textContent('#lfPick')).trim() === 'Quad strength');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      ok('the set count is the program\'s', await ex.locator('.lf-set:not(.is-hd)').count() === 4);
      const monEx = await page.$$eval('.lf-session .lf-ex-n', (x) => x.map((e) => e.textContent));
      ok('Monday carries its calves at 5 sets and its abs', monEx.join() === 'Hack squat,Leg extensions,Bulgarian split squats,Standing calf raises,Cable crunches'
        && await page.locator('.lf-session .lf-ex').nth(3).locator('.lf-set:not(.is-hd)').count() === 5, monEx);
      ok('the target is written under the name', (await ex.locator('.lf-tg').textContent()) === '4 × 6–10 · 1 RIR · rest 2–3 min');
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('under the top of the range, the aim is the same weight and one more rep', ph.join() === '80,9,80,9,80,8,80,8', ph);
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
      ok('ten on every set moves the weight up 2.5 and the reps back to six', ph.join() === '82.5,6,82.5,6,82.5,6,82.5,6', ph);
      ok('and says go up', (await ex.locator('.lf-aim').textContent()).includes('go up to 82.5'));
      await c.close();
    }
  }

  /* ── a leg day asks how your legs are, and the answer changes the day ── */
  {
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    const opts = await page.locator('#lfRec .lf-rq-b b').allTextContents();
    ok('a leg day asks how your legs are, in the plan\'s four answers', opts.join('|') === 'Mild soreness|Moderate soreness|Very sore or weaker|Sharp pain or swelling', opts);
    await page.click('#lfRec [data-r="1"]'); await settle(page);
    ok('moderate soreness says so and changes the start button', /cut by a third/.test(await page.textContent('#lfRec')) && /fewer leg sets/.test(await page.textContent('#lfGo')));
    ok('and is kept for the day', (await store(page)).rc['2026-11-02'] === 1);
    await page.click('#lfGo'); await settle(page);
    const n = await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelector('.lf-ex-n').textContent + ':' + e.querySelectorAll('.lf-set:not(.is-hd)').length));
    ok('leg sets come in a third lighter, abs untouched', n.join() === 'Hack squat:3,Leg extensions:3,Bulgarian split squats:1,Standing calf raises:3,Cable crunches:4', n);
    /* THE REST ALERT, once, the moment the rest is up. */
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8');
    await set0.locator('.lf-chk').click();
    ok('no alert while the rest is still running', !(await page.evaluate(() => window.lfRests || 0)));
    await page.evaluate(() => { const a = JSON.parse(localStorage.getItem('lift.active.v1')); a.rest = Date.now() - 125000; localStorage.setItem('lift.active.v1', JSON.stringify(a)); });
    await page.reload(); await page.waitForTimeout(400); if (!(await page.locator('.lf-session').count())) await page.click('#lfLive'); await page.waitForTimeout(2300);
    ok('the rest alert fires once when the rest is up', await page.evaluate(() => window.lfRests) === 1);
    await page.click('#lfFinish'); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await settle(page);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', ra: false }, '2026-11-02T07:00:00');
    await page.click('#lfGo'); await settle(page);
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8');
    await set0.locator('.lf-chk').click();
    await page.evaluate(() => { const a = JSON.parse(localStorage.getItem('lift.active.v1')); a.rest = Date.now() - 125000; localStorage.setItem('lift.active.v1', JSON.stringify(a)); });
    await page.reload(); await page.waitForTimeout(400); if (!(await page.locator('.lf-session').count())) await page.click('#lfLive'); await page.waitForTimeout(2300);
    ok('with the alert off, the rest stays silent', !(await page.evaluate(() => window.lfRests || 0)));
    await page.click('#lfFinish'); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    /* THE PAGE NEVER TAKES THE AUDIO SESSION: a sound here stopped the
       music you train to. No Test sound, no media element, no 'playback'. */
    ok('there is no sound to test', !(await page.locator('#lfRaTest').count()));
    ok('the rest alert is On or Off, never a sound', (await page.locator('#lfRa button').allTextContents()).join('|') === 'On|Off');
    ok('nothing in the page claims the audio session or plays a sound', !/type = 'playback'|new Audio\(|AudioContext|\.play\(\)/.test(await page.content()));
    await c.close();
  }
  {
    const sore = { '2026-10-23': 1, '2026-10-26': 2, '2026-10-28': 1 };
    const { c, page } = await ctx({ unit: 'kg', rc: sore }, '2026-11-02T07:00:00');
    await page.click('#lfRec [data-r="2"]'); await settle(page);
    ok('very sore says skip the hard session and offers another', /Skip the hard leg session/.test(await page.textContent('#lfRec')) && await page.locator('#lfRecAlt').count() === 1 && /Start anyway/.test(await page.textContent('#lfGo')));
    await page.click('#lfRec [data-r="2"]'); await settle(page);
    ok('pressing it again clears the answer', (await store(page)).rc['2026-11-02'] === undefined && await page.locator('#lfRec .lf-rq-a').count() === 0);
    ok('three sore days in a fortnight offer the plan\'s lighter volume', await page.locator('#lfRecSg').count() === 1);
    await page.click('#lfRecSg button'); await settle(page);
    const f = (await store(page)).focus.filter((x) => ['Quads', 'Hamstrings', 'Calves'].includes(x.m)).map((x) => x.m + ':' + x.lo + '-' + x.hi);
    ok('which lowers quads, hamstrings and calves', f.join() === 'Quads:10-12,Hamstrings:8-8,Calves:9-12', f);
    ok('and then stops offering', await page.locator('#lfRecSg').count() === 0);
    await c.close();
  }
  {
    /* A REST DAY, taken on purpose: from the recovery card, or the picker. */
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfRec [data-r="2"]'); await settle(page);
    ok('very sore offers a rest day', await page.locator('#lfRecRest').count() === 1);
    await page.click('#lfRecRest'); await settle(page);
    ok('taking one makes today a rest day', (await page.textContent('#lfPick')).trim() === 'Rest day' && /Train anyway/.test(await page.textContent('#lfGo')) && (await store(page)).rd['2026-11-02'] === 1);
    ok('and asks nothing about legs', await page.locator('#lfRec').count() === 0);
    ok('the 30 days mark it as rest, not as a miss', await page.$eval('.lf-day.is-now', (e) => e.classList.contains('is-rest') && !e.classList.contains('is-on')));
    await page.click('#lfGo'); await settle(page);
    ok('train anyway takes it back', (await page.textContent('#lfPick')).trim() === 'Quad strength' && !(await store(page)).rd['2026-11-02']);
    await page.click('#lfPick'); await settle(page);
    await top(page).locator('.lf-li', { hasText: 'Rest day' }).click(); await settle(page);
    ok('the picker takes a rest day too', (await page.textContent('#lfPick')).trim() === 'Rest day');
    await page.click('.lf-bar [data-v="cal"]'); await settle(page);
    ok('the month marks it', await page.$eval('.lf-cell[data-d="2026-11-02"]', (e) => e.classList.contains('is-rest') && !!e.querySelector('.is-r')));
    await page.click('.lf-cell[data-d="2026-11-02"]'); await settle(page);
    ok('and its day says it was taken on purpose', /Taken on purpose/.test(await top(page).textContent()));
    await page.keyboard.press('Escape'); await settle(page);
    ok('the month counts it beside the key', (await page.textContent('#lfRdCount b')) === '1 rest day' && /Rest day/.test(await page.textContent('#lfRdCount')));
    await page.click('#lfCal .lf-seg [data-m="week"]'); await settle(page);
    const wr = await page.$eval('.lf-wk[data-d="2026-11-02"]', (e) => [e.classList.contains('is-rd'), e.querySelector('.lf-wn b').textContent, !!e.querySelector('.lf-rd-dot')]);
    ok('the week names it a rest day', wr[0] && wr[1] === 'Rest day' && wr[2], wr);
    await page.click('#lfCal .lf-seg [data-m="month"]'); await settle(page);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    ok('the 30 days count it', /1 rest/.test(await page.textContent('#lfGrid .lf-num')));
    await page.click('.lf-bar [data-v="cal"]'); await settle(page);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    await page.click('#lfPick'); await settle(page);
    await top(page).locator('.lf-li', { hasText: 'Quad strength' }).click(); await settle(page);
    ok('picking a session ends the rest day', (await page.textContent('#lfPick')).trim() === 'Quad strength' && !(await store(page)).rd['2026-11-02']);
    await c.close();
  }
  {
    const { c, page } = await ctx(null, '2026-11-01T07:00:00');
    ok('an upper day does not ask about legs', await page.locator('#lfRec').count() === 0);
    await c.close();
  }

  /* ── steps, food and water: no card any more, old entries still read back ── */
  {
    const { c, page } = await ctx({ unit: 'kg', dl: { '2026-10-30': { st: [{ t: 1, v: 8400 }], fd: [{ t: 1, kc: 950, p: 42.5 }], wa: [{ t: 1, v: 600 }, { t: 2, v: 1500 }] } } });
    ok('home has no daily log card, and You no daily goals', await page.locator('#lfDaily').count() === 0 && await (async () => { await page.click('.lf-bar [data-v="you"]'); return page.locator('#lfGoals').count(); })() === 0);
    const sh = page.locator('.lf-sheet').last();
    await page.click('.lf-bar [data-v="cal"]');
    await page.click('.lf-cell[data-d="2026-10-30"]'); await settle(page);
    ok('what was logged before still reads back on the calendar\'s day', /8,400 steps · 950 kcal · 43g protein · 2\.1 L water/.test(await sh.textContent()));
    await c.close();
  }


  /* ── how it's done: a video one press away ── */
  {
    const { c, page } = await ctx();
    const sh = () => page.locator('.lf-sheet').last();
    await page.click('.lf-bar [data-v="lib"]');
    await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Romanian deadlift' + '$') }) }).click(); await settle(page);
    const a = await sh().locator('.lf-how-go').evaluate((x) => ({ href: x.href, t: x.target, rel: x.rel, txt: x.textContent }));
    ok('every exercise opens a YouTube search on its own name', a.href === 'https://www.youtube.com/results?search_query=' + encodeURIComponent('Romanian deadlift exercise proper form')
      && a.t === '_blank' && /noopener/.test(a.rel) && /Watch how it's done/.test(a.txt), a);
    ok('and nothing is uploaded or stored to do it', await page.evaluate(() => !localStorage.getItem('lift.v1')) && await sh().locator('input[type=file]').count() === 0);
    await sh().locator('.lf-how-l').click();
    await sh().locator('.lf-how input').fill('javascript:alert(1)'); await sh().locator('.lf-how .lf-btn:not(.lf-how-go)').click();
    ok('a link that is not a web address is refused', await sh().locator('.lf-how input').count() === 1 && /youtube\.com\/results/.test(await sh().locator('.lf-how-go').getAttribute('href')));
    await sh().locator('.lf-how input').fill('youtu.be/abc123'); await sh().locator('.lf-how .lf-btn:not(.lf-how-go)').click();
    ok('a specific video replaces the search', await sh().locator('.lf-how-go').getAttribute('href') === 'https://youtu.be/abc123'
      && /Your saved video/.test(await sh().locator('.lf-how-sub').textContent()));
    await page.reload(); await page.waitForTimeout(400);
    await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Romanian deadlift' + '$') }) }).click(); await settle(page);
    ok('and is still there next time', await sh().locator('.lf-how-go').getAttribute('href') === 'https://youtu.be/abc123');
    ok('only on that exercise', await (async () => {
      await page.keyboard.press('Escape'); await settle(page);
      await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Hip thrusts' + '$') }) }).click(); await settle(page);
      const h = await sh().locator('.lf-how-go').getAttribute('href');
      await page.keyboard.press('Escape'); await settle(page);
      await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Romanian deadlift' + '$') }) }).click(); await settle(page);
      return /search_query=Hip%20thrusts/.test(h);
    })());
    await sh().locator('.lf-how-l').click();
    ok('and it can go back to the search, with Undo', /youtube\.com\/results/.test(await sh().locator('.lf-how-go').getAttribute('href')));
    await page.click('.lf-toast button');
    ok('Undo puts the saved video back', await sh().locator('.lf-how-go').getAttribute('href') === 'https://youtu.be/abc123');
    await c.close();
  }

  /* ── a damaged record is repaired, never thrown away ── */
  {
    const bad = { unit: 'kg', goal: 99, dl: { '2026-10-28': { st: [{ t: 1, v: 9000 }, { v: 'x' }], fd: [null, { kc: 500, p: 30 }], wa: 'nope' }, junk: { st: [] } }, ex: [{ id: 'a', n: 'Row', m: 'Back' }, { n: 'no id' }],
      wo: [{ id: 'w1', d: '2026-10-20', s: 1, e: 2, n: 'Pull', cd: { k: 'skate', m: 20 }, x: [{ id: 'a', n: 'Row', sets: [{ w: 50, r: 10 }, { w: 'x', r: 2 }, null] }] }, { d: 'nope' }] };
    const { c, page } = await ctx(bad);
    const r = await store(page);
    ok('a bad set costs the set, a bad workout the workout', r.wo.length === 1 && r.wo[0].x[0].sets.length === 1 && r.ex.length === 1 && r.goal === 7, r);
    ok('a bad day-log entry costs the entry, not the day', r.dl['2026-10-28'].st.length === 1 && r.dl['2026-10-28'].fd.length === 1 && r.dl['2026-10-28'].wa.length === 0 && !r.dl.junk, r.dl);
    ok('and the repair is written back', JSON.parse(await page.evaluate(() => localStorage.getItem('lift.v1'))).wo[0].x[0].sets.length === 1);
    ok('a bad cardio entry costs the cardio, not the workout', r.wo[0].cd === null && r.wo.length === 1);
    ok('a record from before focus was editable gets the default focus', r.focus.length === 10 && r.focus[2].m === 'Calves' && r.focus[2].lo === 15, r.focus);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', ck: 'bike', wo: [{ id: 'w9', d: '2026-10-20', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }], cd: { k: 'bike', m: 15 } }] });
    const r = await store(page);
    ok('cardio logged on a kind no longer offered still reads', JSON.stringify(r.wo[0].cd) === '{"k":"bike","m":15}' && r.ck === 'walk', [r.wo[0].cd, r.ck]);
    await c.close();
  }
  {
    const old = [['Quads', 13, 16, 1], ['Calves', 12, 12, 1], ['Lower back', 6, 6, 1], ['Hamstrings', 10, 10, 0], ['Glutes', 5, 8, 0], ['Abs', 9, 9, 0]].map(([m, lo, hi, p]) => ({ m, lo, hi, p }));
    const { c, page } = await ctx({ unit: 'kg', focus: old });
    const r = await store(page);
    ok('a focus never changed from the first split follows the new one', r.focus.length === 10 && r.focus.find((f) => f.m === 'Shoulders').lo === 16, r.focus);
    await c.close();
  }
  {
    const v2 = [['Quads', 15, 15, 1], ['Calves', 15, 15, 1], ['Abs', 12, 12, 1], ['Lower back', 9, 9, 1], ['Hamstrings', 13, 13, 0], ['Glutes', 9, 9, 0], ['Chest', 15, 15, 0], ['Back', 15, 15, 0], ['Shoulders', 20, 20, 0], ['Biceps', 9, 9, 0], ['Triceps', 12, 12, 0]].map(([m, lo, hi, p]) => ({ m, lo, hi, p }));
    const { c, page } = await ctx({ unit: 'kg', focus: v2, wo: [{ id: 'o1', d: '2026-10-20', s: 1, e: 2, n: 'Quad dominance', rt: 'p-mon', x: [] }] });
    const r = await store(page);
    {
      const { c: c3, page: p3 } = await ctx({ unit: 'kg', focus: 'Quads:17:17:1,Calves:12:12:1,Hamstrings:12:12:1,Glutes:5:5:1,Shoulders:16:16:0,Back:15:15:0,Chest:9:9:0,Triceps:8:8:0,Biceps:8:8:0,Abs:6:6:0,Lower back:2:2:0'.split(',').map((x) => { const q = x.split(':'); return { m: q[0], lo: +q[1], hi: +q[2], p: +q[3] }; }) });
      const r3 = await store(p3);
      ok('the split\'s last shipped targets, never changed, take the new ranges', r3.focus[0].m === 'Quads' && r3.focus[0].lo === 16 && r3.focus[0].hi === 16 && r3.focus.length === 10, r3.focus);
      await c3.close();
    }
    ok('the second split\'s untouched targets follow the new one', r.focus[0].lo === 16 && r.focus.find((f) => f.m === 'Shoulders').lo === 16, r.focus);
    ok('and a session logged under the last name takes the new one', r.wo[0].n === 'Quad strength', r.wo[0].n);
    await c.close();
  }
  /* SUNDAY IS A CHOICE DAY: four presses on the card, no Start button */
  {
    const { c, page } = await ctx({ unit: 'kg' }, '2026-11-08T09:00:00');
    ok('a Sunday offers its four choices and no start button', (await page.textContent('#lfPick')).trim() === 'Choice day' && await page.locator('#lfChoice .lf-ch-o button').count() === 4 && await page.locator('#lfChoice #lfGo').count() === 0);
    await page.click('#lfChoice [data-ch="0"]'); await settle(page);
    ok('weak points starts calves, abs, delts and arms', (await page.$$eval('.lf-session .lf-ex-n', (x) => x.map((e) => e.textContent))).join() === 'Seated calf raises,Cable crunches,Cable lateral raises,Cable curls,Triceps pushdowns');
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg' }, '2026-11-08T09:00:00');
    await page.click('#lfChoice [data-ch="2"]'); await settle(page);
    ok('recovery makes it a rest day', (await store(page)).rd['2026-11-08'] === 1 && await page.locator('#lfRestDay').count() === 1);
    await c.close();
  }
  {
    const mine = [{ m: 'Quads', lo: 18, hi: 18, p: 1 }];
    const { c, page } = await ctx({ unit: 'kg', focus: mine });
    ok('a focus you changed is left alone', JSON.stringify((await store(page)).focus) === JSON.stringify(mine));
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', focus: [{ m: 'Quads', lo: 20, hi: 10, p: 1 }, { m: 'Quads', lo: 5 }, { m: 'Nope', lo: 3 }, null] });
    const r = await store(page);
    ok('a bad focus row costs the row: a duplicate, an unknown muscle, a range run backwards', JSON.stringify(r.focus) === '[{"m":"Quads","lo":20,"hi":20,"p":1}]', r.focus);
    await c.close();
  }

  /* ── EVERY EXERCISE CARRIES A RECOMMENDED DOSE, and the targets are yours ── */
  {
    const { c, page } = await ctx({ unit: 'kg' });
    await page.click('.lf-bar [data-v="lib"]');
    const sub = async (n) => page.locator('#lfLib .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + n + '$') }) }).first().locator('span').first().textContent();
    ok('on this split a compound reads 3 × 6–10 at 1 RIR', /3 × 6–10 · 1 RIR/.test(await sub('Barbell bench press')), await sub('Barbell bench press'));
    ok('and an isolation reads its own reps, to failure', /3 × 12–20 · 0 RIR/.test(await sub('Lateral raises')) && /3 × 8–12 · 0 RIR/.test(await sub('Barbell curls')), [await sub('Lateral raises'), await sub('Barbell curls')]);
    await page.locator('#lfLib .lf-li', { has: page.locator('b', { hasText: /^Leg extensions$/ }) }).first().click(); await settle(page);
    ok('an exercise opens on its recommendation and rest', (await top(page).locator('#lfRecd').textContent()) === 'Isolation · 3 × 12–15 · 0 RIR · rest 2–3 min');
    await page.keyboard.press('Escape'); await settle(page);
    /* one you add guesses its type from the name, and you can change it */
    await page.click('.lf-bar [data-v="home"]'); await page.click('#lfGo'); await settle(page);
    const ses = top(page);
    await ses.locator('.lf-add', { hasText: 'Add exercise' }).click(); await settle(page);
    await top(page).locator('input[type="search"]').fill('Landmine press'); await settle(page);
    await top(page).locator('button', { hasText: 'Create exercise' }).click(); await settle(page);
    ok('a new exercise named as a press is guessed compound', (await top(page).locator('#lfExC [aria-pressed="true"]').textContent()).startsWith('Compound'));
    await top(page).locator('#lfExN').fill('Landmine lateral'); 
    ok('the guess follows the name until you choose', (await top(page).locator('#lfExC [aria-pressed="true"]').textContent()).startsWith('Isolation'));
    await top(page).locator('#lfExC button', { hasText: 'Compound' }).click();
    await top(page).locator('#lfExN').fill('Landmine thing');
    ok('and stops once you have', (await top(page).locator('#lfExC [aria-pressed="true"]').textContent()).startsWith('Compound'));
    await top(page).locator('button', { hasText: /^Save$/ }).click(); await settle(page);
    const card = page.locator('.lf-ex', { hasText: 'Landmine thing' });
    ok('it lands in the workout with a target written under it', (await card.locator('.lf-tg').textContent()) === '3 × 6–10 · 1 RIR · rest 2–3 min', await card.locator('.lf-tg').textContent());
    ok('and it is stored as a compound', (await store(page)).ex.find((e) => e.n === 'Landmine thing').c === 1);
    await page.keyboard.press('Escape'); await settle(page);
    /* the weekly targets are edited from the home card itself */
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    await page.click('#lfLegs .lf-vr[data-m="Chest"]'); await settle(page);
    await top(page).locator('#lfFoLo').fill('10'); await top(page).locator('#lfFoHi').fill('12');
    await top(page).locator('button', { hasText: 'Save' }).click(); await settle(page);
    ok('a row on Sets this week opens its target and saves it', (await page.textContent('#lfLegs .lf-vr[data-m="Chest"] em')).endsWith('/ 10–12'), await page.textContent('#lfLegs .lf-vr[data-m="Chest"] em'));
    await page.click('#lfTgEdit'); await settle(page);
    ok('Edit targets goes to the list under You', await page.locator('#lfYou:not([hidden]) #lfFocus').count() === 1);
    await c.close();
  }

  /* ── LOCK-SCREEN REST ALERT: a rest queues one sealed message ── */
  {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-11-02T07:00:00'));
    const kp = await require('crypto').webcrypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    const pk = Buffer.from(await require('crypto').webcrypto.subtle.exportKey('raw', kp.publicKey)).toString('base64url');
    const au = Buffer.from(require('crypto').randomBytes(16)).toString('base64url');
    await c.addInitScript(`(() => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', 1); localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg' })); localStorage.setItem('lift.push.v1', JSON.stringify({ id: '${'c'.repeat(32)}', tok: '${'d'.repeat(32)}', ep: 'https://web.push.apple.com/x', pk: '${pk}', au: '${au}' })); } })();`);
    const puts = [];
    await c.route('https://sched.nikorapullin.workers.dev/**', async (rt) => { puts.push({ u: rt.request().url(), b: JSON.parse(rt.request().postData() || 'null') }); rt.fulfill({ status: 200, body: '{}' }); });
    const page = await c.newPage();
    await page.goto(URL); await page.waitForTimeout(300);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('lock-screen alerts read as on, and turn off from the same button', /On/.test(await page.textContent('#lfPush')));
    await page.click('.lf-bar [data-v="home"]'); await page.click('#lfGo'); await settle(page);
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8');
    await set0.locator('.lf-chk').click(); await page.waitForTimeout(600);
    const q = puts.filter((x) => /\/v1\/push\//.test(x.u));
    const due = q.length && q[0].b.q[0].t - new Date('2026-11-02T07:00:00').getTime();
    ok('a rest queues one alert for the moment it is up', q.length === 1 && q[0].b.q.length === 1 && due === 120000 && q[0].b.ep === 'https://web.push.apple.com/x', [q.length, due]);
    ok('sealed: the server gets bytes, not the words', !/Rest is up|Next/.test(JSON.stringify(q[0].b)));
    await page.click('#lfFinish'); await page.waitForTimeout(800);
    const q2 = puts.filter((x) => /\/v1\/push\//.test(x.u));
    ok('finishing the workout clears it', q2.length === 2 && q2[1].b.q.length === 0, q2.length);
    await c.close();
  }

  /* ── VOLUME OPENS ON ITS OWN SHEET ── */
  {
    const wo = (id, d, w, r) => ({ id, d, s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w, r }, { w, r }] }] });
    const { c, page } = await ctx({ unit: 'kg', wo: [wo('v1', '2026-09-20', 100, 10), wo('v2', '2026-10-20', 120, 10), wo('v3', '2026-10-28', 140, 8)] });
    await page.click('.lf-stat[data-k="vol"]'); await settle(page);
    const t = await top(page).textContent();
    ok('the volume tile opens its own sheet: the figure, how it moved, per session and the heaviest set',
      (await top(page).locator('.lf-hero').textContent()) === '4.6k' && /\+132%/.test(t) && /Roughly 2.3k per session/.test(t) && /Heaviest single set: 140 kg/.test(t), t.slice(0, 200));
    ok('with eight weeks drawn, a mark on each, and the first, best and last named', await top(page).locator('.lf-vs-dot').count() === 8 && await top(page).locator('.lf-vs-v').count() >= 1 && /At a glance/.test(t));
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfVol'); await settle(page);
    ok('and so does the volume card', await top(page).locator('#lfVolTrend').count() === 1);
    await c.close();
  }
  /* ── SETS AND WORKOUTS OPEN THE SAME WAY, and a sheet is frosted glass ── */
  {
    const wo = (id, d, n) => ({ id, d, s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: Array(n).fill({ w: 100, r: 8 }) }] });
    const { c, page } = await ctx({ unit: 'kg', wo: [wo('s1', '2026-09-20', 4), wo('s2', '2026-10-20', 3), wo('s3', '2026-10-28', 5)] });
    await page.click('.lf-stat[data-k="sets"]'); await settle(page);
    const t = await top(page).textContent();
    ok('the sets tile opens its own sheet, drawn like volume', (await top(page).locator('.lf-hero').textContent()) === '8' && /sets completed/.test(t) && /\+100%/.test(t) && await top(page).locator('#lfSetsTrend .lf-vs-dot').count() === 8, t.slice(0, 160));
    ok('the sheet card is frosted glass, and the page behind it is not blurred', await page.evaluate(() => { const sh = getComputedStyle(document.querySelector('.lf-sheet')), sc = getComputedStyle(document.querySelector('.lf-scrim')); return /blur/.test(sh.backdropFilter || sh.webkitBackdropFilter) && !/blur/.test(sc.backdropFilter || sc.webkitBackdropFilter || ''); }));
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-stat[data-k="wo"]'); await settle(page);
    ok('and so does the workouts tile', await top(page).locator('#lfWoTrend').count() === 1 && /workouts/.test(await top(page).textContent()));
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', wo: [{ id: 'dn', d: '2026-10-30', s: new Date('2026-10-30T07:15:00').getTime(), e: new Date('2026-10-30T08:05:00').getTime(), n: 'Hamstrings & glutes', x: [{ id: 'rdl', n: 'Romanian deadlift', sets: [{ w: 90, r: 10 }] }] }] }, '2026-10-30T18:00:00');
    await page.click('#lfPick'); await settle(page);
    ok('once today is done, its name opens the workout you did, not the list of routines', /Romanian deadlift/.test(await top(page).textContent()) && !/Empty workout/.test(await top(page).textContent()));
    ok('and it says the time the session started, not how long it took', /Fri 30 Oct · 7:15 am/.test(await top(page).textContent()) && !/50 min/.test(await top(page).textContent()), (await top(page).textContent()).slice(0, 120));
    await c.close();
  }

  /* ── THE LIGHT FACE, and today marked done ── */
  {
    const c = await browser.newContext(Object.assign({}, PHONE, { colorScheme: 'light' }));
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg', wo: [{ id: 't1', d: '2026-10-30', s: 1, e: 2, n: 'Quad volume', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }, { w: 100, r: 8 }] }] }] })); })();`);
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(300);
    const look = await page.evaluate(() => ({ m: document.documentElement.dataset.mode, bg: getComputedStyle(document.body).backgroundColor, card: getComputedStyle(document.querySelector('.lf-today')).backgroundColor, ink: getComputedStyle(document.body).color }));
    ok('a light phone gets the light face', look.m === 'light' && look.bg === 'rgb(242, 242, 247)' && look.card === 'rgb(255, 255, 255)' && look.ink === 'rgb(0, 0, 0)', look);
    ok('a day with a workout in says Completed', await page.locator('#lfDone').count() === 1 && /Completed/.test(await page.textContent('#lfDone')));
    ok('and counts what was done, with nothing to start over it', /2 sets/.test(await page.textContent('.lf-today .lf-chips')) && /1\.6k kg/.test(await page.textContent('.lf-today .lf-chips')) && await page.locator('#lfGo').count() === 0);
    await page.click('#lfPick'); await settle(page);
    ok('its name opens what you did, not a list to replace it', /Hack squat/.test(await top(page).textContent()) && !/Take today off/.test(await top(page).textContent()));
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfMode [data-m="dark"]'); await settle(page);
    ok('You can choose dark on a light phone, and it is kept', await page.evaluate(() => document.documentElement.dataset.mode) === 'dark' && await page.evaluate(() => localStorage.getItem('lift.mode.v1')) === 'dark');
    await page.reload(); await page.waitForTimeout(300);
    ok('from the first paint', await page.evaluate(() => document.documentElement.dataset.mode) === 'dark');
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg' });
    ok('a day with nothing in yet is not marked done', await page.locator('#lfDone').count() === 0 && /Start Workout/.test(await page.textContent('#lfGo')));
    await c.close();
  }

  /* ── GREEN TAGS: only the good news, worked out from the record ── */
  {
    const w = (id, d, n, kg) => ({ id, d, s: 1, e: 2, n, x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: kg, r: 8 }, { w: kg, r: 8 }] }] });
    const { c, page } = await ctx({ unit: 'kg', goal: 2, wo: [w('a', '2026-10-20', 'Back', 60), w('b', '2026-10-23', 'Quad volume', 100), w('c', '2026-10-27', 'Back', 60), w('d', '2026-10-30', 'Quad volume', 110)] });
    const where = await page.$$eval('.lf-tag', (t) => t.map((x) => (x.closest('.lf-stat') ? x.closest('.lf-stat').dataset.k : x.closest('#lfGrid') ? 'grid' : '?') + ':' + x.textContent));
    ok('each tag sits on its own tile: the PR on workouts, the volume on kg, goal and streak on the 30 days', where.join('|') === 'wo:New PR|vol:+10% today|grid:Week goal hit|grid:2-week streak', where);
    ok('and none on the Today card', await page.locator('.lf-today .lf-tag').count() === 0);
    await c.close();
  }
  {
    const w = (id, d, kg) => ({ id, d, s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: kg, r: 8 }] }] });
    const { c, page } = await ctx({ unit: 'kg', goal: 1, wo: [w('a', '2026-10-14', 100), w('b', '2026-10-21', 100), w('c', '2026-10-28', 90)] });
    const tags = await page.locator('.lf-tag').allTextContents();
    ok('weeks in a row on goal is a streak tag; a lighter day earns no PR', tags.join('|') === 'Week goal hit|3-week streak', tags);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg' });
    ok('with nothing to say, there are no tags', await page.locator('.lf-tag').count() === 0);
    await c.close();
  }

  /* ── reactions reach you: the friends record carries the push address ── */
  {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-11-02T07:00:00'));
    await c.addInitScript(`(() => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', 1); localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg' }));
      localStorage.setItem('lift.fr.v1', JSON.stringify({ on: true, code: 'K7PQ2M4X', key: '${'a'.repeat(32)}', name: 'Niko', list: [] }));
      localStorage.setItem('lift.push.v1', JSON.stringify({ id: '${'c'.repeat(32)}', tok: '${'d'.repeat(32)}', ep: 'https://web.push.apple.com/x', pk: 'BPk', au: 'AUu' })); } })();`);
    const puts = [];
    await c.route('https://sched.nikorapullin.workers.dev/**', (rt) => { if (rt.request().method() === 'PUT') puts.push(JSON.parse(rt.request().postData() || 'null')); rt.fulfill({ status: 200, body: '{"rx":[]}' }); });
    const page = await c.newPage();
    await page.goto(URL); await page.waitForTimeout(2200);
    const rec = puts.filter((x) => x && x.s)[0];
    ok('with notifications on, your friends record says where to reach you', rec && rec.pu && rec.pu.ep === 'https://web.push.apple.com/x' && rec.pu.pk === 'BPk', rec && rec.pu);
    await c.close();
  }

  /* ── BADGES: worked out from the record, announced once ── */
  {
    const w = (i, d, kg) => ({ id: 'b' + i, d, s: i, e: i + 1, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: kg, r: 8 }, { w: kg, r: 8 }] }] });
    const days = ['2026-10-05', '2026-10-07', '2026-10-09', '2026-10-12', '2026-10-14', '2026-10-16', '2026-10-19', '2026-10-21', '2026-10-23', '2026-10-26'];
    const wo = days.map((d, i) => w(i + 1, d, i === 9 ? 120 : 100));
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00', true);
    ok('a record that already has history announces nothing on its first open', await page.locator('.lf-cv').count() === 0);
    const seen = (await store(page)).bseen;
    ok('and counts what it had already won as seen', seen && seen.first === 1 && seen.wo10 === 1 && seen.pr === 1 && !seen.st4, seen);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const shelf = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('the shelf shows every badge, with the day it was won or how far along', shelf.length === 29 && shelf.includes('First workout:5 Oct') && shelf.includes('Week goal hit:9 Oct') && shelf.includes('10 workouts:26 Oct') && shelf.includes('First PR:26 Oct') && shelf.includes('4-week streak:3 / 4') && shelf.includes('50 workouts:10 / 50'), shelf);
    ok('and counts them', /4 of 29/.test(await page.textContent('#lfBadges .lf-hd')));
    ok('a badge not yet won carries its progress ring', await page.locator('#lfBadges .lf-coin[data-b="wo50"] .lf-bdr').count() === 1 && await page.locator('#lfBadges .lf-coin[data-b="first"] .lf-bdr').count() === 0);
    await page.click('#lfBadges .lf-coin[data-b="wo10"]'); await page.waitForTimeout(500);
    ok('a coin opens on its own screen, to spin', await page.locator('.lf-cv').count() === 1 && /10 workouts/.test(await page.textContent('.lf-cv')) && /Earned Mon 26 Oct/.test(await page.textContent('.lf-cv'))
      && await page.locator('.lf-cv-stage canvas, .lf-cv-stage.is-flat').count() >= 1);
    await page.keyboard.press('Escape'); await page.waitForSelector('.lf-cv', { state: 'detached', timeout: 5000 }).catch(() => {});
    ok('and is gone when it closes, not hidden', await page.locator('.lf-cv').count() === 0);
    ok('each kind of badge wears its own colour, never a metal for a tier', await page.getAttribute('#lfBadges .lf-coin[data-b="wo10"]', 'data-m') === 'start' && await page.getAttribute('#lfBadges .lf-coin[data-b="wo50"]', 'data-m') === 'lock');
    await c.close();
  }
  /* The leg focused split: six days, the whole body, legs three times */
  {
    const { c, page } = await ctx({ unit: 'kg' }, '2026-11-02T09:00:00');
    await page.click('.lf-bar [data-v="lib"]'); await page.click('#lfProg [data-p="qc"]'); await settle(page);
    ok('the switch names it Leg focused', (await page.textContent('#lfProg [data-p="qc"]')).trim() === 'Leg focused');
    const split = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
    ok('it is six named days, legs Monday, Thursday and Saturday', split.join() === 'Mon · Heavy legs,Tue · Chest & delts,Wed · Back & biceps,Thu · Quad sweep,Fri · Upper power,Sat · Calf burnout', split);
    await page.click('#lfSplit .lf-li >> nth=3'); await settle(page);
    const thu = await top(page).textContent();
    ok('Thursday reads its lunges in steps each side, as written', /Walking lunges[\s\S]*3 × 10 steps each side/.test(thu) && /Tibialis raises/.test(thu), thu.slice(0, 200));
    ok('and another split keeps its own effort and rest', /1–2 RIR/.test(thu) && !/· 1 RIR/.test(thu));
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    ok('and a Monday on it is Heavy legs', (await page.textContent('#lfPick')).trim() === 'Heavy legs');
    ok('its weekly targets put quads and calves first', (await store(page)).focus.slice(0, 2).map((f) => f.m).sort().join() === 'Calves,Quads');
    await c.close();
  }
  /* You folds: settings and badges are shut until opened, and remember */
  {
    const c = await newCtx(PHONE);
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', '{"unit":"kg","wo":[]}'); })();`);
    const page = await c.newPage(); await page.goto(URL); await page.waitForTimeout(300);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const st = async () => page.evaluate(() => ['lfSet', 'lfBadges', 'lfFocus'].map((id) => { const b = document.querySelector('#' + id + ' h3 > button'); return b && b.getAttribute('aria-expanded') + ':' + document.getElementById(b.getAttribute('aria-controls')).hidden; }).join());
    ok('settings, badges and focus are shut by default, each a button inside its heading', await st() === 'false:true,false:true,false:true');
    ok('and a shut badge shelf builds no badges', await page.locator('#lfBadges .lf-coin').count() === 0 && /of 29/.test(await page.textContent('#lfBadges h3')));
    await page.click('#lfSet h3 > button'); await page.click('#lfBadges h3 > button'); await page.click('#lfFocus h3 > button'); await settle(page);
    ok('pressing the heading opens it', await st() === 'true:false,true:false,true:false' && await page.locator('#lfFocus .lf-li').count() > 0 && await page.locator('#lfUnit').isVisible() && await page.locator('#lfBadges .lf-coin').count() === 29);
    await page.click('#lfUnit [data-u="lb"]'); await settle(page);
    ok('a save redraws the page and keeps what you opened', await st() === 'true:false,true:false,true:false');
    await page.click('#lfUnit [data-u="kg"]'); await settle(page);
    await page.click('.lf-bar [data-v="home"]'); await settle(page); await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('leaving the tab shuts them again', await st() === 'false:true,false:true,false:true');
    await page.click('#lfSet h3 > button'); await settle(page);
    await page.reload(); await page.waitForTimeout(300); await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('and so does closing the app', await st() === 'false:true,false:true,false:true' && !(await page.evaluate(() => localStorage.getItem('lift.fold.v1'))));
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    await page.click('#lfTgEdit'); await settle(page);
    ok('Edit targets on Home opens the focus list it goes to', await page.getAttribute('#lfFocus h3 > button', 'aria-expanded') === 'true');
    await c.close();
  }
  /* the trophy case and the monthly medals */
  {
    const wo = []; let n = 0;
    for (let d = new Date('2026-09-07T12:00:00'); d <= new Date('2026-10-30T12:00:00'); d.setDate(d.getDate() + 1)) {
      if ([1, 3, 5].indexOf(d.getDay()) < 0) continue; n++;
      wo.push({ id: 'm' + n, d: d.toISOString().slice(0, 10), s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100 + n, r: 8 }] }, { id: 'rdl', n: 'Romanian deadlift', sets: [{ w: 120, r: 10 }] }] });
    }
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00', true);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfMedals h3 > button'); await settle(page);
    const med = await page.$$eval('#lfMedals .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('every week of a month on goal wins its medal, on the day the last week gets there', med.join() === 'October 2026:Perfect month,September 2026:Perfect month', med);
    ok('a record that already had its month counts it as seen, not news', (await store(page)).bseen.m202609 === 1);
    ok('the trophy case is put away for now', await page.locator('#lfRecords').count() === 0);
    await c.close();
  }
  /* cardio, body weight and abs badges */
  {
    const wo = [];
    for (let i = 0; i < 20; i++) { const t = new Date('2026-10-30T12:00:00'); t.setDate(t.getDate() - i * 2); wo.push({ id: 'c' + i, d: t.toISOString().slice(0, 10), s: 1, e: 2, n: 'Legs', cd: { k: i % 2 ? 'stairs' : 'walk', m: 30 }, x: [{ id: 'cablecrunch', n: 'Cable crunches', sets: [{ w: 30, r: 15 }] }] }); }
    const bw = [{ d: '2026-09-01', kg: 84 }, { d: '2026-10-01', kg: 80 }, { d: '2026-10-20', kg: 78 }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, bw, bwGoal: 78 }, '2026-10-30T18:00:00', true);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const shelf = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('ten Stairmaster sessions earn Step Up, and its hours count toward Summit', shelf.includes('Step Up:28 Oct') && shelf.includes('Summit:5 / 10 h'), shelf);
    ok('ten on the incline treadmill earn Uphill', shelf.includes('Uphill:30 Oct') && shelf.includes('Mountain Goat:5 / 10 h'), shelf);
    ok('reaching the goal weight earns Dialled In, on the day it was logged', shelf.includes('Dialled In:20 Oct'), shelf);
    ok('abs in ten workouts earn Core Ready, counting toward the Six-Pack Club', shelf.includes('Core Ready:10 Oct') && shelf.includes('Six-Pack Club:20 / 50'), shelf);
    ok('each has its own colour', ['stair10', 'bwgoal', 'abs10'].every(Boolean) && await page.getAttribute('#lfBadges .lf-coin[data-b="stair10"]', 'data-m') === 'cardio' && await page.getAttribute('#lfBadges .lf-coin[data-b="bwgoal"]', 'data-m') === 'body' && await page.getAttribute('#lfBadges .lf-coin[data-b="abs10"]', 'data-m') === 'core');
    await c.close();
  }
  /* the target badges read the sets you log against your own weekly targets */
  {
    const w = (id, d, ex) => ({ id, d, s: 1, e: 2, n: 'Legs', x: ex });
    const hk = { id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }, { w: 100, r: 8 }] }, cf = { id: 'calfstand', n: 'Standing calf raises', sets: [{ w: 40, r: 12 }, { w: 40, r: 12 }, { w: 40, r: 12 }] };
    const wo = [];
    ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26'].forEach((mon, k) => {
      const d = (n) => { const t = new Date(mon + 'T12:00:00'); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
      wo.push(w('t' + k + 'a', d(0), [hk]), w('t' + k + 'b', d(2), [hk, cf]), w('t' + k + 'c', d(4), [hk]));
    });
    const focus = [{ m: 'Quads', lo: 6, hi: 8, p: 1 }, { m: 'Calves', lo: 3, hi: 4, p: 0 }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, focus }, '2026-10-30T18:00:00', true);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const shelf = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('a priority muscle on its weekly target earns On target, on the day the sets got there', shelf.includes('On target:9 Oct'), shelf);
    ok('every muscle in focus on target earns Every target', shelf.includes('Every target:9 Oct'), shelf);
    ok('four weeks running on target earns its badge', shelf.includes('4 weeks on target:30 Oct'), shelf);
    ok('and the quad count shows how far along it is', shelf.includes('Quad target \u00d7 8:4 / 8'), shelf);
    ok('the target badges are green', await page.getAttribute('#lfBadges .lf-coin[data-b="tgt1"]', 'data-m') === 'target');
    await c.close();
  }
  {
    const w = (i, d) => ({ id: 'n' + i, d, s: i, e: i + 1, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] });
    const wo = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'].map((d, i) => w(i + 1, d));
    const { c, page } = await ctx({ unit: 'kg', wo, bseen: { first: 1 } }, '2026-10-30T18:00:00', true);
    await page.click('#lfGo'); await settle(page);
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('80'); await set0.locator('input').nth(1).fill('8');
    await set0.locator('.lf-chk').click();
    await page.click('#lfFinish'); await page.waitForTimeout(800);
    await top(page).locator('button', { hasText: 'Done' }).click(); await page.waitForTimeout(1000);
    ok('the tenth workout earns its badge, announced when the summary is put away', await page.locator('.lf-cv').count() === 1 && /Badge earned/.test(await page.textContent('.lf-cv')) && /10 workouts/.test(await page.textContent('.lf-cv')));
    ok('and is marked seen, so it comes up once', (await store(page)).bseen.wo10 === 1);
    ok('a badge a later build added, already won before it arrived, is counted as seen rather than announced', (await store(page)).bseen.goal === 1);
    await c.close();
  }

  /* ── TODAY IS WHAT YOU TRAINED: a different day of the plan done today ── */
  {
    const { c, page } = await ctx({ unit: 'kg', wo: [{ id: 't1', d: '2026-10-29', s: 1, e: 2, n: 'Hamstrings & glutes', rt: 'p-wed', x: [{ id: 'rdl', n: 'Romanian deadlift', sets: [{ w: 100, r: 8 }] }] }] }, '2026-10-29T18:00:00');
    ok('a Thursday you trained Wednesday\'s session shows that session, done', (await page.textContent('#lfPick')).trim() === 'Hamstrings & glutes' && /Hinge, curls/.test(await page.textContent('.lf-today .lf-sub')) && await page.locator('#lfDone').count() === 1);
    ok('and does not ask about legs after the fact', await page.locator('#lfRec').count() === 0);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', wo: [{ id: 't1', d: '2026-10-29', s: 1, e: 2, n: 'Hamstrings & glutes', rt: 'p-wed', x: [{ id: 'rdl', n: 'Romanian deadlift', sets: [{ w: 100, r: 8 }] }] }] }, '2026-10-30T09:00:00');
    ok('the next day the plan\'s own day comes back', (await page.textContent('#lfPick')).trim() === 'Quad volume' && await page.locator('#lfDone').count() === 0);
    await c.close();
  }

  /* ── A DAY YOU TRAINED STAYS TRAINED: a rest or a pick pressed after is repaired ── */
  {
    const { c, page } = await ctx({ unit: 'kg', rd: { '2026-10-30': 1, '2026-10-27': 1 }, pick: { d: '2026-10-30', id: 'p-sat' }, wo: [{ id: 't1', d: '2026-10-30', s: 1, e: 2, n: 'Quad volume', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] }] });
    const r = await store(page);
    ok('a rest marked on a trained day is taken off', !r.rd['2026-10-30'] && r.rd['2026-10-27'] === 1, r.rd);
    ok('and the card is the workout you did', (await page.textContent('#lfPick')).trim() === 'Quad volume' && await page.locator('#lfDone').count() === 1 && await page.locator('#lfRestDay').count() === 0);
    await c.close();
  }

  /* ── A DAY WITH NOTHING LOGGED IS A REST DAY ── */
  {
    const { c, page } = await ctx({ unit: 'kg', since: '2026-10-25', rd: { '2026-10-27': 1 }, wo: [{ id: 'a1', d: '2026-10-26', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] }] });
    const r = await store(page);
    ok('every finished day with no workout is filled in as rest', JSON.stringify(Object.keys(r.rd).sort().map((k) => k + ':' + r.rd[k])) === JSON.stringify(['2026-10-25:2', '2026-10-27:1', '2026-10-28:2', '2026-10-29:2']), r.rd);
    ok('a rest you took stays yours, and today is left alone', r.rd['2026-10-27'] === 1 && !r.rd['2026-10-30'] && !r.rd['2026-10-26']);
    ok('nothing before the record starts', !r.rd['2026-10-24']);
    await page.click('.lf-bar [data-v="cal"]'); await settle(page);
    await page.click('#lfCal .lf-seg [data-m="week"]'); await settle(page);
    const wk = await page.locator('.lf-wk.is-rd').allTextContents();
    ok('the week reads them as rest days, and says why', wk.some((t) => /Rest day.*No workout logged/.test(t)) && wk.some((t) => /Taken on purpose/.test(t)), wk);
    await c.close();
  }

  /* ── THE SECOND PROGRAM: push / pull / legs ── */
  {
    const { c, page } = await ctx({ unit: 'kg' }, '2026-11-01T09:00:00');
    await page.click('.lf-bar [data-v="lib"]');
    ok('upper / lower runs until you switch', (await page.getAttribute('#lfProg [data-p="ul"]', 'aria-pressed')) === 'true');
    await page.click('#lfProg [data-p="ppl"]'); await settle(page);
    const split = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
    ok('push / pull / legs is six days, with no planned rest', split.join() === 'Mon · Push A,Tue · Pull A,Wed · Legs A,Thu · Push B,Fri · Pull B,Sat · Legs B', split);
    await page.click('#lfSplit .lf-li >> nth=5'); await settle(page);
    const sat = await top(page).textContent();
    ok('Legs B reads its sets: split squats, two curls, calves 4 × 10–20', sat.includes('Bulgarian split squats') && sat.includes('Lying leg curls') && sat.includes('4 × 10–20') && /quad day/.test(sat), sat.slice(0, 200));
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfSplit .lf-li >> nth=3'); await settle(page);
    ok('Push B carries the new triceps work', /EZ-bar skull crushers/.test(await top(page).textContent()) && /Single-arm cable pushdowns/.test(await top(page).textContent()));
    await page.keyboard.press('Escape'); await settle(page);
    const r = await store(page);
    ok('the weekly targets move to the plan’s own', r.prog === 'ppl' && r.focus.length === 10 && r.focus.find((f) => f.m === 'Chest').lo === 16 && r.focus.find((f) => f.m === 'Calves').lo === 8, r.focus);
    await page.click('.lf-bar [data-v="home"]');
    ok('a Sunday on this plan is not a rest day unless you take one', await page.locator('#lfRestDay').count() === 0 && (await page.textContent('#lfPick')).trim() !== 'Rest day' && !(await store(page)).rd['2026-11-01']);
    await page.click('#lfPick'); await settle(page);
    ok('and the picker does not mark it as rest', await top(page).locator('.lf-li', { has: page.locator('b', { hasText: /^Rest day$/ }) }).locator('svg').count() === 0);
    await top(page).locator('.lf-li', { has: page.locator('b', { hasText: /^Pull A$/ }) }).click(); await settle(page);
    ok('a session can be picked for it', (await page.textContent('#lfPick')).trim() === 'Pull A');
    await page.click('.lf-bar [data-v="lib"]'); await page.click('#lfProg [data-p="ul"]'); await settle(page);
    const r2 = await store(page);
    ok('switching back puts the first plan and its targets back', r2.prog === 'ul' && r2.focus.length === 10 && (await page.$$eval('#lfSplit .lf-li b', (b) => b[0].textContent)) === 'Mon · Quad strength');
    await c.close();
  }
  /* ── THE THIRD PROGRAM: the glute focus from the notebook ── */
  {
    const { c, page } = await ctx({ unit: 'kg' }, '2026-11-07T09:00:00');
    await page.click('.lf-bar [data-v="lib"]');
    await page.click('#lfProg [data-p="gl"]'); await settle(page);
    const split = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
    ok('the glute split is Monday to Saturday', split.join() === 'Mon · Glutes · heavy,Tue · Back & biceps,Wed · Quads & calves,Thu · Chest, shoulders & triceps,Fri · Glutes · top shelf,Sat · Conditioning & core', split);
    const segW = await page.$$eval('#lfProg button', (b) => b.map((x) => x.scrollWidth <= x.clientWidth + 1));
    ok('four programs fit on one switch', segW.length === 4 && segW.every(Boolean));
    await page.click('#lfSplit .lf-li >> nth=5'); await settle(page);
    const sat = await top(page).textContent();
    ok('Saturday reads its rounds, carries and plank as written', sat.includes('4 rounds') && sat.includes('3 × 30–40 m each side') && sat.includes('3 × 20–30 s each side') && sat.includes('3 × 8–10 each side') && /rower/.test(sat), sat.slice(0, 300));
    await page.keyboard.press('Escape'); await settle(page);
    const r = await store(page);
    ok('its targets are the sets the week holds, glutes first', r.prog === 'gl' && r.focus[0].m === 'Glutes' && r.focus[0].lo === 24 && r.focus[0].p === 1, r.focus.slice(0, 3));
    await page.click('.lf-bar [data-v="home"]');
    ok('a Saturday opens on conditioning and core', (await page.textContent('#lfPick')).trim() === 'Conditioning & core');
    await page.click('#lfGo'); await settle(page);
    ok('a session written in rounds says so', (await page.locator('.lf-ex', { hasText: 'Sled push' }).locator('.lf-tg').textContent()).startsWith('4 rounds · '));
    await c.close();
  }
  {
    const mine = [{ m: 'Quads', lo: 18, hi: 18, p: 1 }];
    const { c, page } = await ctx({ unit: 'kg', focus: mine, prog: 'nope' });
    ok('an unknown program reads as the first', (await store(page)).prog === 'ul');
    await page.click('.lf-bar [data-v="lib"]'); await page.click('#lfProg [data-p="ppl"]'); await settle(page);
    ok('targets you set yourself are not overwritten by a switch', JSON.stringify((await store(page)).focus) === JSON.stringify(mine));
    await c.close();
  }

  /* ── FRIENDS: two phones on the real worker, run in this process ──
     Every request to the worker host is answered by worker/index.js
     against a Map, so the round trip is the shipped client against the
     shipped server. Its own contexts: the main one still asserts that
     nothing leaves the phone. */
  {
    const worker = (await import('file://' + path.resolve(__dirname, '..', 'worker', 'index.js'))).default;
    const m = new Map();
    const env = { SCHED: { m, async get(k) { return m.has(k) ? m.get(k) : null; }, async put(k, v) { m.set(k, v); }, async delete(k) { m.delete(k); } } };
    const sent = [];
    const W = 'https://sched.nikorapullin.workers.dev';
    async function phone(seed, hash) {
      const c = await browser.newContext(PHONE);
      await c.addInitScript(freeze('2026-10-30T18:00:00'));
      if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(seed))}); })();`);
      await c.route(W + '/**', async (route) => {
        const rq = route.request();
        if (rq.method() !== 'GET' && rq.method() !== 'OPTIONS') sent.push(rq.postData() || '');
        const h = Object.assign({}, rq.headers(), { origin: 'https://niko-999.github.io' });
        const res = await worker.fetch(new Request(rq.url(), { method: rq.method(), headers: h, body: ['GET', 'HEAD'].includes(rq.method()) ? undefined : rq.postData() }), env);
        await route.fulfill({ status: res.status, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }, body: await res.text() });
      });
      const page = await c.newPage();
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(URL + (hash || '')); await page.waitForTimeout(300);
      return { c, page };
    }
    const wo = (d, sets) => ({ id: 'w' + d, d, s: 1, e: 2, n: 'Lower A', x: [{ id: 'hack', n: 'Hack squat', sets: sets }] });
    const A = await phone({ unit: 'kg', goal: 4, wo: [wo('2026-10-26', [{ w: 100, r: 8 }]), wo('2026-10-28', [{ w: 110, r: 8 }, { w: 110, r: 8 }]), wo('2026-10-30', [{ w: 120, r: 8 }])], rd: { '2026-10-29': 1 }, bw: [{ d: '2026-10-30', v: 87.4 }] });
    await A.page.click('.lf-bar [data-v="fr"]'); await A.page.waitForTimeout(200);
    ok('friends is off until you turn it on, and asks for nothing', await A.page.locator('#frOff').count() === 1 && m.size === 0 && sent.length === 0);
    ok('the off screen is just a name and a button', await A.page.locator('#frOff .fr-p').count() === 0 && await A.page.locator('#frName').count() === 1);
    await A.page.click('#frOn'); await A.page.waitForTimeout(150);
    ok('a name is needed first', m.size === 0);
    await A.page.fill('#frName', 'Niko'); await A.page.click('#frOn'); await A.page.waitForTimeout(500);
    const codeA = await A.page.evaluate(() => JSON.parse(localStorage.getItem('lift.fr.v1')).code);
    ok('turning on claims an eight-character code', /^[A-HJ-NP-Z2-9]{8}$/.test(codeA) && m.has('lift:' + codeA), codeA);
    const recA = JSON.parse(m.get('lift:' + codeA));
    ok('what the server holds is counts: 3 workouts, 4 sets, the empty days as rest, trained today', recA.n === 'Niko' && recA.s.wo30 === 3 && recA.s.sets30 === 4 && recA.s.last === '2026-10-30' && recA.s.d.slice(-6) === '01r1r1', recA.s);
    ok('this week goes by day, and by muscle against your targets', JSON.stringify(recA.s.w7) === '[1,0,2,0,1,0,0]' && JSON.stringify(recA.s.mu[0]) === '["Quads",4,16]', [recA.s.w7, recA.s.mu[0]]);
    ok('volume goes as totals: 30 days, eight weeks, and reps by day', recA.s.vol30 === 3520 && recA.s.v8[7] === 3520 && recA.s.v8.length === 8 && JSON.stringify(recA.s.r7) === '[8,0,16,0,8,0,0]', [recA.s.vol30, recA.s.v8, recA.s.r7]);
    ok('and nothing it no longer needs: no cardio, no totals', !('cd7' in recA.s) || recA.s.cd7 === 0);
    ok('your three latest badges go with the counts, newest first', JSON.stringify(recA.s.bg) === '[["pr","2026-10-28"],["first","2026-10-26"]]', recA.s.bg);
    ok('two PRs: each heavier hack squat after the first', recA.s.pr30 === 2, recA.s.pr30);
    ok('the key is only a hash', /^[0-9a-f]{64}$/.test(recA.kh) && !JSON.stringify(recA).includes((await A.page.evaluate(() => JSON.parse(localStorage.getItem('lift.fr.v1')).key))));
    const blob = sent.join('\n');
    ok('body weight never leaves', !/87\.4/.test(blob), blob.slice(0, 300));
    ok('the workouts go, newest first, with their sets', recA.s.wl.length === 3 && recA.s.wl[0].d === '2026-10-30' && recA.s.wl[0].x[0].n === 'Hack squat' && JSON.stringify(recA.s.wl[1].x[0].s) === '[[110,8],[110,8]]', recA.s.wl);
    ok('your own row is on the board', await A.page.locator('#frBoard .fr-row.is-me').count() === 1);

    const B = await phone({ unit: 'kg', goal: 3, wo: [wo('2026-10-12', [{ w: 60, r: 10 }])] }, '#add=' + codeA);
    ok('a link opens on Friends and the code leaves the bar', await B.page.locator('#lfFr:not([hidden])').count() === 1 && !(await B.page.evaluate(() => location.hash)));
    ok('and says who sent it before anything is turned on', await B.page.locator('.fr-pend').count() === 1 && m.size === 1);
    await B.page.fill('#frName', 'Sam'); await B.page.click('#frOn'); await B.page.waitForTimeout(700);
    await B.page.waitForFunction(() => document.querySelectorAll('#frBoard .fr-row').length === 2, null, { timeout: 4000 }).catch(() => {});
    const names = await B.page.$$eval('#frBoard .fr-row .fr-t b', (b) => b.map((x) => x.textContent));
    ok('turning on adds whoever sent the link, ranked by workouts', names.join() === 'Niko,You', names);
    ok('your code is not on the tab any more', await B.page.locator('#lfFr .fr-code').count() === 0);
    await B.page.click('.lf-bar [data-v="you"]'); await settle(B.page);
    const codeB = (await B.page.textContent('#lfSet .fr-code')).trim();
    ok('it is in settings, with share', codeB.length === 8 && await B.page.locator('#lfSet #frShare').count() === 1);
    await B.page.click('.lf-bar [data-v="fr"]'); await settle(B.page);

    await A.page.click('#frAdd'); await A.page.waitForTimeout(400);
    await A.page.fill('#frCode', 'ZZZZZZZZ'); await top(A.page).locator('button', { hasText: /^Add$/ }).click(); await A.page.waitForTimeout(250);
    ok('a code nobody has says so', /Nobody has that code/.test(await top(A.page).textContent('.fr-err')));
    await A.page.fill('#frCode', codeA.toLowerCase()); await top(A.page).locator('button', { hasText: /^Add$/ }).click(); await A.page.waitForTimeout(250);
    ok('your own code is refused', /your own code/.test(await top(A.page).textContent('.fr-err')));
    /* Sam picked a colour on their wheel */
    { const rec = JSON.parse(m.get('lift:' + codeB)); rec.s.ac = 215; rec.s.lv = (await A.page.evaluate(() => Date.now())) - 20 * 60e3; m.set('lift:' + codeB, JSON.stringify(rec)); }
    await A.page.fill('#frCode', codeB.toLowerCase()); await top(A.page).locator('button', { hasText: /^Add$/ }).click(); await settle(A.page);
    ok('a friend mid-workout shows as training now', /Training now · since/.test(await A.page.textContent('#frBoard .fr-row:not(.is-me)')), await A.page.textContent('#frBoard'));
    ok('and you are not', !/Training now/.test(await A.page.textContent('#frBoard .fr-row.is-me')));
    ok('the week is rings, one each, toward their own goal, and the names under them are the board', await A.page.locator('#frRings svg circle').count() >= 2 && await A.page.locator('#frRings #frBoard .fr-row').count() === 2 && (await A.page.$$eval('#frRings .fr-row', (r) => r.map((x) => x.style.getPropertyValue('--rc')))).every((c) => c));
    ok('their ring says it too: a glow and a light at its tip', await A.page.locator('#frRings .fr-rg-h').count() === 1 && await A.page.locator('#frRings .fr-rg-a.is-live, #frRings .fr-rg-p').count() >= 1);
    ok('and the middle crowns who is in front', (await A.page.textContent('#frRgLead')).trim() === 'You' && await A.page.locator('#frRgLead .fr-rg-cr').count() === 1, await A.page.textContent('#frRings'));
    ok('and a ring is drawn in the colour they chose', await A.page.$$eval('#frRings .fr-rg-a', (r) => r.map((x) => x.getAttribute('stroke'))).then((c) => c.length >= 1));
    ok('there is no leaderboard card, and each name carries its thirty days', await A.page.locator('#frLb').count() === 0 && await A.page.locator('#frRings .fr-row .fr-strip').count() === 2);
    await A.page.evaluate(() => { window.__cv = 0; new MutationObserver(() => { if (document.querySelector('.lf-cv')) window.__cv = 1; }).observe(document, { childList: true, subtree: true }); });
    await A.page.click('#frRings .fr-row.is-me .fr-bg button >> nth=0'); await A.page.waitForTimeout(400);
    ok('a badge on the rings opens the badge, not the dashboard', await A.page.evaluate(() => window.__cv) === 1 && await A.page.locator('.lf-sheet').count() === 0);
    const cvx = await A.page.$('.lf-cv-x'); if (cvx) { await cvx.click(); await A.page.waitForTimeout(400); }
    ok('a typed code adds them, lower case and all', (await A.page.$$eval('#frBoard .fr-row .fr-t b', (b) => b.map((x) => x.textContent))).join() === 'You,Sam');
    await A.page.click('#frBoard .fr-row:not(.is-me)'); await settle(A.page);
    const sh = await top(A.page).textContent('.lf-sh-bd');
    const T = top(A.page);
    const acc = await T.evaluate((e) => [e.style.getPropertyValue('--log'), getComputedStyle(document.documentElement).getPropertyValue('--log').trim()]);
    ok('a friend\'s page wears the colour they chose, and yours stays yours', acc[0] && acc[0] !== '#a3e635' && acc[1].toLowerCase() === '#a3e635', acc);
    ok('a friend opens on a whole dashboard: when, and the three tiles', /18 days ago/.test(sh) && await T.locator('.lf-stat').count() === 3, sh.slice(0, 120));
    ok('their thirty days', await T.locator('#frGrid .lf-day').count() === 30);
    ok('their week, reps by day against goal', await T.locator('#frWeek .lf-bars > div').count() === 7 && /0\/3/.test(await T.locator('#frWeek').textContent()));
    ok('their volume over eight weeks', await T.locator('#frVol .lf-area svg').count() === 1 && /8 wk/.test(await T.locator('#frVol').textContent()));
    ok('and their sets by muscle', await T.locator('#frMus .lf-vr').count() > 0);
    /* their figures open the same trend sheets as yours */
    ok('their tiles open trends', await T.locator('[data-tr]').count() === 5);
    await T.locator('.lf-stat[data-tr="wo"]').click(); await settle(A.page);
    ok('their workouts over eight weeks', await top(A.page).locator('#lfWoTrend .lf-vs-dot').count() === 8 && /workouts/.test(await top(A.page).textContent()));
    await A.page.keyboard.press('Escape'); await settle(A.page);
    await T.locator('#frVol').click(); await settle(A.page);
    ok('and their volume', await top(A.page).locator('#lfVolTrend').count() === 1 && /600/.test(await top(A.page).textContent()));
    await A.page.keyboard.press('Escape'); await settle(A.page);
    ok('and their workouts', (await T.locator('#frWo .lf-li b').allTextContents()).join() === 'Lower A' && /1 sets · 600 kg/.test(await T.locator('#frWo .lf-li span').first().textContent()));
    await T.locator('#frWo .lf-li').first().click(); await settle(A.page);
    ok('a workout opens on its sets', /Hack squat/.test(await top(A.page).textContent()) && /60×10/.test(await top(A.page).textContent()), await top(A.page).textContent());
    await top(A.page).locator('.fr-rx-b').first().click(); await A.page.waitForTimeout(400);
    ok('a 🔥 on a friend\'s workout reaches their record', m.has('liftr:' + codeB) && await top(A.page).locator('.fr-rx-b[aria-pressed="true"]').count() === 1, [await top(A.page).locator('.fr-rx').count(), await top(A.page).locator('.fr-rx-b').first().isDisabled().catch(() => 'none'), sent.slice(-2)]);
    const rxB = await (await worker.fetch(new Request(W + '/v1/lift/' + codeB, { headers: { origin: 'https://niko-999.github.io' } }), env)).json();
    ok('signed as you, on that workout', rxB.rx.length === 1 && rxB.rx[0].n === 'Niko' && rxB.rx[0].e === '🔥', rxB.rx);
    await B.page.click('.lf-bar [data-v="home"]'); await B.page.click('.lf-bar [data-v="fr"]'); await B.page.waitForTimeout(500);
    ok('they see it on their friends tab', /Niko on your/.test(await B.page.textContent('#frRxIn')), await B.page.textContent('#lfFr'));
    await A.page.keyboard.press('Escape'); await settle(A.page);
    ok('it fills the screen', await top(A.page).evaluate((e) => e.classList.contains('is-full')));
    await A.page.keyboard.press('Escape'); await settle(A.page);
    await A.page.click('#frBoard .fr-row.is-me'); await settle(A.page);
    ok('your own row opens your dashboard, with nothing to remove', await top(A.page).locator('#frGrid .lf-day.is-on').count() === 3 && await top(A.page).locator('button', { hasText: 'Remove' }).count() === 0);
    await A.page.keyboard.press('Escape'); await settle(A.page);
    await A.page.click('#frBoard .fr-row:not(.is-me)'); await settle(A.page);
    await top(A.page).locator('button', { hasText: 'Remove' }).click(); await settle(A.page);
    ok('removing a friend comes with an Undo', await A.page.locator('#frNone').count() === 1);
    await A.page.click('.lf-toast button'); await A.page.waitForTimeout(150);
    ok('and Undo puts them back', await A.page.locator('#frBoard .fr-row').count() === 2);

    await B.page.click('.lf-bar [data-v="you"]'); await settle(B.page);
    await B.page.click('#frMore'); await settle(B.page);
    ok('name and turning off live behind settings', await top(B.page).locator('#frNewName').count() === 1);
    await top(B.page).locator('#frOffBtn').click(); await settle(B.page);
    await top(B.page).locator('button', { hasText: 'Turn off' }).click(); await B.page.waitForTimeout(400);
    await B.page.click('.lf-bar [data-v="fr"]'); await settle(B.page);
    ok('turning off deletes the record on the server', !m.has('lift:' + codeB) && await B.page.locator('#frOff').count() === 1);
    await A.page.click('.lf-bar [data-v="home"]'); await A.page.click('.lf-bar [data-v="fr"]'); await A.page.waitForTimeout(400);
    ok('and their friends see they have gone', /Turned friends off/.test(await A.page.textContent('#frBoard')));
    await A.c.close(); await B.c.close();
  }

  /* ── VERSUS FRIENDS: badges from training together and the weekly rings ── */
  {
    const t0 = new Date('2026-10-28T07:00:00').getTime();
    const frs = { on: true, code: 'ABCD2345', key: 'a'.repeat(32), name: 'Niko', rx: [], list: [
      { c: 'SAMSAMSA', n: 'Sam', s: { goal: 3, wk: 1, d: '0'.repeat(30), tr: { m: '2026-10-26', w8: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,5,50,500]] },
        wl: [{ id: 'x1', d: '2026-10-28', n: 'Legs', t: 7 * 60 + 20, x: [] }] } }] };
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.route(/workers\.dev/, (r) => r.abort());
    await c.addInitScript(`new MutationObserver(() => { const v = document.querySelector('.lf-cv'); if (v) v.querySelector('.lf-cv-x').click(); }).observe(document, { childList: true, subtree: true });`);
    await c.addInitScript(`(() => { if (localStorage.getItem('lift.v1')) return;
      localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, bseen: { v2: 1, v3: 1, first: 1, goal: 1 },
        fx: { sy: { 'old|ZZZZZZZZ': '2026-09-01', 'bad key': 'x' }, wk: { '2026-10-05': [800, 300, 1, 0, ''], '2026-10-12': [700, 600, 2, 1, '2026-10-17'], '2026-10-19': [900, 400, 1, 0, ''], 'nope': [1] } },
        wo: [{ id: 'm1', d: '2026-10-28', s: t0, e: t0 + 3600000, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] }] }))});
      localStorage.setItem('lift.fr.v1', ${JSON.stringify(JSON.stringify(frs))}); })();`);
    const page = await c.newPage(); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(400);
    const r0 = await store(page);
    ok('the friends record is kept, and a damaged entry is dropped', r0.fx.sy['old|ZZZZZZZZ'] === '2026-09-01' && !r0.fx.sy['bad key'] && !r0.fx.wk.nope && r0.fx.wk['2026-10-12'][3] === 1, r0.fx);
    await page.click('.lf-bar [data-v="fr"]'); await page.waitForTimeout(500);
    const r1 = await store(page);
    ok('a friend who started inside your workout puts it in sync', r1.fx.sy['m1|SAMSAMSA'] === '2026-10-28', r1.fx.sy);
    ok('and the week on the rings is written down', JSON.stringify(r1.fx.wk['2026-10-26'].slice(0, 3)) === '[333,333,1]', r1.fx.wk['2026-10-26']);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const got = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent).filter((t) => /In Sync|Gym Buddies|Crowned|Three-Peat|Squad Goals/.test(t)));
    ok('in sync, and gym buddies counting up to ten', got[0] === 'In Sync:1 Sep' && got[1] === 'Gym Buddies:2 / 10', got);
    ok('a week won is crowned on its Sunday, three running is a three-peat', got[2] === 'Crowned:11 Oct' && got[3] === 'Three-Peat:25 Oct', got);
    ok('and squad goals on the day everybody closed theirs', got[4] === 'Squad Goals:17 Oct', got);
    ok('each wears its own shape', await page.$$eval('#lfBadges .lf-coin', (b) => ['duo1', 'duo10', 'lead1', 'lead3', 'squad'].every((id) => b.some((x) => x.dataset.b === id))));
    await c.close();
  }

  /* ── THEME: light and dark, and the accent on a wheel ── */
  {
    const c = await newCtx(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', '{"unit":"kg","wo":[],"bseen":{"v2":1,"v3":1}}'); })();`);
    const page = await c.newPage(); await page.goto(URL); await page.waitForTimeout(300);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('theme is its own fold, shut, saying lime', await page.getAttribute('#lfTheme h3 > button', 'aria-expanded') === 'false' && /Lime/.test(await page.textContent('#lfTheme h3')));
    ok('and appearance is not in settings any more', await page.locator('#lfSet #lfMode').count() === 0);
    await page.click('#lfTheme h3 > button'); await settle(page);
    ok('it holds appearance and the wheel', await page.locator('#lfTheme #lfMode').isVisible() && await page.locator('#lfWheel').isVisible());
    const tok = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log').trim());
    ok('lime to begin with', (await tok()).toLowerCase() === '#a3e635', await tok());
    const b = await page.locator('#lfWheel').boundingBox();
    /* the bottom of the ring is 180 degrees: a cyan */
    await page.mouse.move(b.x + b.width / 2, b.y + b.height - 12); await page.mouse.down(); await page.mouse.up(); await settle(page);
    const cy = await tok();
    ok('a press on the ring sets the accent from that hue', cy !== '#a3e635' && await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '180', [cy, await page.evaluate(() => localStorage.getItem('lift.accent.v1'))]);
    ok('and the fold names it', /Cyan/.test(await page.textContent('#lfTheme h3')));
    ok('the greens that say done follow it, a filling bar stays white', await page.evaluate(() => { const r = getComputedStyle(document.documentElement); return r.getPropertyValue('--good').trim() === r.getPropertyValue('--today-ink').trim(); }));
    ok('the ink on a fill is worked out to read on it', await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--on-log').trim()) !== '');
    await page.focus('#lfWheel'); await page.keyboard.press('ArrowRight');
    ok('arrows turn it too', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '185');
    await page.reload(); await page.waitForTimeout(300);
    ok('it is kept across a reload', (await tok()) === (await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--today').trim())) && (await tok()) !== '#a3e635');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfTheme h3 > button'); await settle(page);
    await page.click('#lfTheme #lfMode [data-m="light"]'); await settle(page);
    ok('light and dark live here now', await page.evaluate(() => document.documentElement.dataset.mode) === 'light');
    await page.click('#lfAccReset'); await settle(page);
    ok('back to lime clears it', (await tok()).toLowerCase() === '#a3e635' && await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === null);
    const gg = await page.evaluate(() => { const r = getComputedStyle(document.documentElement); return [r.getPropertyValue('--good').trim().toLowerCase(), '', document.documentElement.dataset.mode]; });
    ok('and the greens are green again', gg[0] === '#248a3d' && gg[1] === '', gg);
    await c.close();
  }

  /* ── a new version is picked up when the app comes back to the front ── */
  {
    const { c, page } = await ctx();
    let ver = 'v1';
    await page.route('**/lift/**', (r) => r.request().method() === 'HEAD' ? r.fulfill({ status: 200, headers: { etag: ver } }) : r.continue());
    await page.reload(); await page.waitForTimeout(600);
    await page.evaluate(() => { window.__same = 1; });
    const show = () => page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await show(); await page.waitForTimeout(500);
    ok('the same version does not reload', await page.evaluate(() => window.__same === 1));
    ver = 'v2';
    await page.evaluate(() => { const i = document.createElement('input'); i.id = 'vtest'; document.body.appendChild(i); i.focus(); });
    await show(); await page.waitForTimeout(500);
    ok('a new version waits while you are typing', await page.evaluate(() => window.__same === 1));
    await page.evaluate(() => document.activeElement.blur());
    await show(); await page.waitForTimeout(1200);
    ok('and reloads by itself once you are not', await page.evaluate(() => window.__same !== 1));
    await c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
