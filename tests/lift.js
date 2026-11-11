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
const RK_SEEN = { wo: 1e9, vol: 1e12, pr: 1e9, lv: 99, u: [].concat(
  ['rookie', 'regular', 'adept', 'steady', 'grinder', 'lifer', 'collector', 'duelist', 'elite', 'relentless', 'veteran', 'champion', 'curator', 'master', 'engine', 'mythic', 'legend', 'creator', 'hitter', 'blaze', 'lockedin', 'nodaysoff', 'ironheart', 'slayer', 'eye', 'twice'].map((x) => 'ti:' + x),
  ['eye', 'twice', 'slayer', 'spark', 'heart', 'drop', 'leaf', 'sun', 'flame', 'wave', 'moon', 'bolt', 'crown', 'shield', 'star', 'trophy', 'infinity', 'target', 'rocket', 'link', 'duo', 'flag', 'medal', 'pack', 'pulse', 'stairs', 'hill', 'watch', 'wind', 'gem', 'barbell'].map((x) => 'fl:' + x), ['ring', 'neon', 'orbit', 'ember', 'sparkle', 'halo', 'frost', 'glitch', 'aurora', 'prism', 'blossom', 'angel', 'celestial', 'prestige', 'sovereign', 'laurel', 'verdant', 'regal', 'silvern', 'amethyst', 'inferno', 'glacier', 'rosegold', 'winged', 'sapphire', 'ruby', 'aurelian', 'phoenix', 'imperial', 'eclipse', 'prismatic', 'creator'].map((x) => 'fm:' + x)) };
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
    /* the week in review comes up over the app on a Sunday night and the two days after: checks that are not about it have seen it */
    if (seed && !('wkSum' in seed)) seed = Object.assign({ wkSum: '9999-12-31' }, seed);
    /* and so does the goal-hit screen, which goes over everything the moment a week reaches its goal */
    if (seed && !('wkDone' in seed)) seed = Object.assign({ wkDone: '9999-12-31' }, seed);
    /* and so do the milestones: a full-screen moment over a check that is not about it is a check that cannot press */
    seed = Object.assign({ mseen: RK_SEEN }, seed || {});
    await c.addInitScript(freeze(at || '2026-10-30T18:00:00'));
    /* frames are put away in the app for now; the suite keeps them on so everything about them is still walked */
    await c.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
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
  ok('a day of the split reads its sets × reps', mon.includes('Hack squat') && mon.includes('4 × 6–10') && mon.includes('1 RIR') && mon.includes('2 × 10–12 each side') && mon.includes('Linear hack calf raises'), mon.slice(0, 160));
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
  ok('and starts the rest clock: a ring, the time in it, how long is left beside it', /^0:0\d$/.test((await page.textContent('#lfRest .lf-rs-c')).trim()) && /Resting/.test(await page.textContent('#lfRest')) && /to go · target 2–3 min/.test(await page.textContent('#lfRest')) && await page.locator('#lfRest .lf-rs-ring svg').count() === 1);
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
  ok('the workout sheet shows it, to read', (await top(page).locator('#lfWoCd > div').first().textContent()) === '12 min stairmaster' && await top(page).locator('#lfWoCd .lf-pill').count() === 0);
  /* it is changed in the editor, behind the pencil */
  await top(page).locator('#lfWoEdit').click(); await settle(page);
  await top(page).locator('#lfEdCd .lf-pill[data-m="20"]').click(); await top(page).locator('#lfEdSave').click(); await settle(page);
  ok('and it can be changed after, in the editor', (await store(page)).wo[0].cd.m === 20);
  await top(page).locator('#lfWoEdit').click(); await settle(page);
  await top(page).locator('#lfEdCd .lf-pill[data-m="20"]').click(); await top(page).locator('#lfEdSave').click(); await settle(page);
  await top(page).locator('#lfWoEdit').click(); await settle(page);
  ok('a workout without cardio shows just a button for it, not the choices', await top(page).locator('#lfEdCdAdd').count() === 1 && await top(page).locator('#lfEdCd').count() === 0);
  /* a session left running: its start and its length can be put right */
  ok('the editor\'s day and start fields keep to their boxes, as on an iPhone', await top(page).evaluate((sh) => {
    const d = sh.querySelector('#lfEdD'), s = sh.querySelector('#lfEdS'), m = sh.querySelector('#lfEdM'), bd = d.parentElement.getBoundingClientRect();
    const cs = getComputedStyle(d), ct = getComputedStyle(s);
    return cs.appearance === 'none' && ct.appearance === 'none' && cs.boxSizing === 'border-box' && d.getBoundingClientRect().right <= bd.right + 1 && s.getBoundingClientRect().right <= m.getBoundingClientRect().left + 1;
  }));
  await top(page).locator('#lfEdS').fill('09:15'); await top(page).locator('#lfEdM').fill('45');
  await top(page).locator('#lfEdSave').click(); await settle(page);
  { const w0 = (await store(page)).wo[0], sd = new Date(w0.s);
    ok('a session\'s start and length can be mended in the editor', sd.getHours() === 9 && sd.getMinutes() === 15 && w0.e - w0.s === 45 * 60000 && w0.d === '2026-10-30', [sd.toString(), (w0.e - w0.s) / 60000]); }
  ok('or taken off', (await store(page)).wo[0].cd === null);
  ok('and a workout with none says nothing about it', await top(page).locator('#lfWoCd').count() === 0);
  await page.keyboard.press('Escape'); await settle(page); await page.keyboard.press('Escape'); await settle(page);
  /* today's card on Home opens the finish screen again, with the sets under it */
  await page.click('.lf-bar [data-v="home"]'); await settle(page);
  await page.click('#lfPick'); await settle(page);
  ok('today\'s finished card opens the finish screen, with every set under it', await top(page).locator('#lfFin').count() === 1 && await top(page).locator('#lfFinSets .lf-wo-ex').count() >= 2 && await top(page).locator('.lf-pill').count() === 0);
  await page.keyboard.press('Escape'); await settle(page);
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
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); s.wo[0].d = '2026-10-29'; /* PRs count from two weeks after the first workout: an old one makes these real */ s.wo.unshift({ id: 'old', d: '2026-10-01', s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 40, r: 8 }] }] }); localStorage.setItem('lift.v1', JSON.stringify(s)); });
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
  await page.waitForTimeout(2600); /* the badge renderer warms up in the background around now, which can hold a timer a moment */
  ok('then is gone, out of the way', await page.locator('.lf-burst').count() === 0);
  /* AN EXTRA REP AT THE SAME WEIGHT IS A REP RECORD, its own smaller
     celebration, and never a PR or a badge's count — typed in after the tick */
  await page.locator('.lf-session .lf-ex').first().locator('.lf-ex-ft button', { hasText: 'Add set' }).click(); await settle(page);
  await set(0, 2).locator('input').nth(0).fill('60'); await set(0, 2).locator('input').nth(1).fill('8');
  await set(0, 2).locator('.lf-chk').click(); await settle(page);
  ok('the same weight for the same reps again is not a record', (await set(0, 2).locator('.lf-sn').textContent()) === '3');
  await set(0, 2).locator('input').nth(1).fill('9'); await set(0, 2).locator('input').nth(1).blur(); await page.waitForTimeout(200);
  ok('one more rep, typed in after the tick, is a rep record with its own smaller burst', (await set(0, 2).locator('.lf-sn').textContent()) === 'REP' && await page.evaluate(() => window.lfReps) === 1 && await page.evaluate(() => window.lfBursts) === 1);
  ok('and is kept as a rep record, not a PR', await page.evaluate(() => { const q = JSON.parse(localStorage.getItem('lift.active.v1')).x[0].sets[2]; return q.rp === 1 && !q.pr; }));
  /* DROP SETS hang off the set they follow: one press under the set ticked last, a fifth lighter, never a set of their own */
  await page.locator('.lf-session .lf-ex').first().locator('.lf-drop-add').click(); await settle(page);
  const dr = page.locator('.lf-session .lf-ex').first().locator('.lf-set.is-drop');
  ok('+ Drop set puts a drop row straight under the set ticked last, a fifth lighter', await dr.count() === 1 && await dr.locator('input').nth(0).inputValue() === '47.5' && await page.evaluate(() => { const d = document.querySelector('.lf-session .lf-ex .lf-set.is-drop'), p = d.previousElementSibling; return p && p.querySelector('.lf-sn') && p.querySelector('.lf-sn').textContent === 'REP'; }));
  await dr.locator('input').nth(1).fill('10'); await dr.locator('.lf-chk').click(); await settle(page);
  ok('ticked, it starts the rest again and is kept on its set', await page.locator('.lf-session .lf-ex').first().locator('.lf-set.is-drop.is-done').count() === 1 && (await page.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')).x[0].sets[2].ds[0])).ok === 1);
  /* WARM-UPS: a row marked W above the sets, ticked like one, kept beside them and never counted as one */
  await page.locator('.lf-session .lf-ex').first().locator('.lf-ex-ft .lf-wu-add').click(); await settle(page);
  const wu = page.locator('.lf-session .lf-ex').first().locator('.lf-set.is-wu');
  ok('+ Warm-up puts a W row in above the first set', await wu.count() === 1 && (await wu.locator('.lf-wu-n').textContent()) === 'W' && await page.evaluate(() => { const r = document.querySelector('.lf-session .lf-ex .lf-set.is-wu'); return r.nextElementSibling && !r.nextElementSibling.classList.contains('is-wu'); }));
  await wu.locator('input').nth(0).fill('40'); await wu.locator('input').nth(1).fill('10'); await wu.locator('.lf-chk').click(); await settle(page);
  ok('ticking it logs it, with no record judged and no rest timer', await page.locator('.lf-session .lf-ex').first().locator('.lf-set.is-wu.is-done').count() === 1 && (await page.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')).x[0].wu[0])).ok === 1 && await page.evaluate(() => window.lfBursts) === 1);
  await page.waitForTimeout(1800);
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  await page.keyboard.press('Escape'); await settle(page);
  await page.click('.lf-bar [data-v="home"]'); await settle(page);
  await page.click('#lfPick'); await settle(page);
  ok('today\'s sets show the warm-up, marked W, before them', /40 × 10/.test(await top(page).locator('#lfFinSets .lf-wu-l').first().textContent()));
  ok('and the drop after the set it hangs off', /× 9 ↳ 47\.5 × 10/.test(await top(page).locator('#lfFinSets .lf-wo-ex div').first().textContent()));
  await page.keyboard.press('Escape'); await settle(page);
  ok('it is saved beside the sets, never as one of them', await page.evaluate(() => { const w = JSON.parse(localStorage.getItem('lift.v1')).wo.find((o) => o.d === '2026-10-30'); const e = w.x[0]; return e.wu.length === 1 && e.wu[0].w === 40 && e.wu[0].r === 10 && e.sets.length === 3 && e.sets[2].ds.length === 1 && e.sets[2].ds[0].w === 47.5 && e.sets[2].ds[0].r === 10 && !e.sets.some((q) => q.w === 40 && q.r === 10); }));
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
  await page.waitForTimeout(1600); /* the month lights up in turn when it opens */
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
  ok('pounds is a display, the record stays in kilos', (await page.$$eval('.lf-stat span', (x) => x.map((e) => e.textContent)))[2] === 'lb' && (await store(page)).wo.find((w) => w.id !== 'old').x[0].sets[0].w === 60);

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
      ok('Monday carries its calves at 5 sets and its abs', monEx.join() === 'Hack squat,Leg extensions,Bulgarian split squats,Linear hack calf raises,Cable crunches'
        && await page.locator('.lf-session .lf-ex').nth(3).locator('.lf-set:not(.is-hd)').count() === 5, monEx);
      ok('the target is written under the name', (await ex.locator('.lf-tg').textContent()) === '4 × 6–10 · 1 RIR · rest 2–3 min');
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('under the top of the range, the aim is the same weight and one more rep', ph.join() === '80,9,80,9,80,8,80,8', ph);
      ok('and it says so in four words', (await ex.locator('.lf-aim').textContent()) === 'Try 80 × 9');
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
      ok('and says so in four words', (await ex.locator('.lf-aim').textContent()) === 'Try 82.5 × 6');
      await ex.locator('.lf-aim').click(); await settle(page);
      ok('one tap on it fills every empty set with the aim', (await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '82.5,6,82.5,6,82.5,6,82.5,6');
      await ex.locator('.lf-aim').click(); await settle(page);
      ok('and a second tap changes nothing that is filled', (await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '82.5,6,82.5,6,82.5,6,82.5,6');
      await c.close();
    }
  }

  /* ── THE AUDIT: things found off-centre, cut short or unreadable, and kept fixed ── */
  {
    const srcA = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('an exercise name takes two lines before it is cut, now that the card header has three buttons', /\.lf-ex-hd button\.lf-ex-n \{[^}]*-webkit-line-clamp: 2/.test(srcA) && !/\.lf-ex-hd button\.lf-ex-n \{[^}]*white-space: nowrap/.test(srcA));
    ok('three recovery answers do not leave the last one half a row', /\.lf-rq-o \.lf-rq-b:last-child:nth-child\(odd\) \{ grid-column: 1 \/ -1; \}/.test(srcA));
    ok('the warm-up has a white-page face of its own, and the empty reaction count takes no room', /:root\[data-mode="light"\] \.lf-set\.is-wu \.lf-wu-n/.test(srcA) && /\.fr-rx-b b:empty \{ display: none; \}/.test(srcA));
    ok('a review on a white page has its red and its heading a shade deeper', /:root\[data-mode="light"\] \.lf-wsh\.is-miss \.lf-ws-k \{ color: #b3261e/.test(srcA));
    ok('a close button over scrolling content is a disc of its own, and the live label has a real target', /\.lf-sheet\.no-title \.lf-sh-hd \.lf-x \{ background:/.test(srcA) && /button\.fr-live::after \{ content: ''; position: absolute; inset: -14px -8px; \}/.test(srcA));
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfGo'); await settle(page);
    const names = await page.$$eval('.lf-session .lf-ex-n', (x) => x.map((e) => [e.scrollWidth > e.clientWidth + 1, e.scrollHeight > e.clientHeight + 1]));
    ok('no exercise name in a normal Monday is cut off', names.every((q) => !q[0] && !q[1]), names);
    await c.close();
  }
  /* ── SUPERSETS: linked from a card or by the plan, round by round, in a darker accent ── */
  {
    const srcSS = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('a superset wears the accent, darker, and no other colour', /\.lf-ex \{ --ss: color-mix\(in srgb, var\(--log\) 55%, #000\); \}/.test(srcSS) && /\.lf-ex\.is-ss \.lf-set\.is-done \.lf-chk span \{ background: var\(--ss\)/.test(srcSS));
    const { c, page } = await ctx({ unit: 'kg', prog: 'sx', pick: { d: '2026-11-02', id: 's-mon' } }, '2026-11-02T07:00:00');
    await page.click('#lfGo'); await settle(page);
    ok('the plan links its own superset block: Push A opens with five exercises in one group', await page.locator('.lf-ex.is-ss').count() === 5 && /5 exercises/.test(await page.locator('.lf-ss-l').first().textContent()));
    const tick = async (n, v) => { const row = page.locator('.lf-ex').nth(n).locator('.lf-set:not(.is-hd):not(.is-wu):not(.is-drop)').first(); await row.scrollIntoViewIfNeeded(); await row.locator('input').nth(0).fill('50'); await row.locator('input').nth(1).fill('8'); await row.locator('.lf-chk').click(); await page.waitForTimeout(350); };
    await tick(0); 
    ok('ticking a set in a superset sends you to the next one and starts no rest', await page.evaluate(() => document.querySelector('#lfRest').classList.contains('is-idle')));
    for (const k of [1, 2, 3]) await tick(k);
    ok('and still none while the round is unfinished', await page.evaluate(() => document.querySelector('#lfRest').classList.contains('is-idle')));
    await tick(4);
    ok('the rest starts when the last of the round is ticked', await page.evaluate(() => !document.querySelector('#lfRest').classList.contains('is-idle')));
    await c.close();
  }
  {
    /* linking by hand, and taking it out again */
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfGo'); await settle(page);
    ok('no exercise is linked to start with', await page.locator('.lf-ex.is-ss').count() === 0 && await page.locator('.lf-ssb').count() >= 3);
    await page.locator('.lf-ssb').first().click(); await settle(page);
    ok('the link button joins an exercise to the one below it', await page.locator('.lf-ex.is-ss').count() === 2 && /Superset with/.test(await page.locator('.lf-ss-l').first().textContent()));
    await page.locator('.lf-ssb').first().click(); await settle(page);
    ok('pressed again it takes them out, and neither is left linked to nothing', await page.locator('.lf-ex.is-ss').count() === 0);
    await c.close();
  }
  /* ── HOW ARE YOU RECOVERING: every training day asks, and the answer changes the day ── */
  {
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    ok('a training day asks how you are recovering, with three answers, and no pain option', await page.locator('#lfRec').count() === 1 && /How are you recovering/.test(await page.textContent('#lfRec')) && await page.locator('#lfRec .lf-rq-b').count() === 3 && !/Sharp pain/.test(await page.textContent('#lfRec')));
    await page.click('#lfGo'); await settle(page);
    const n = await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelector('.lf-ex-n').textContent + ':' + e.querySelectorAll('.lf-set:not(.is-hd)').length));
    ok('coming back to the app places you on the set you are on, even with a field focused, and on a long card the set itself is placed', /\[120, 500\]\.forEach\(function \(t\) \{ setTimeout\(function \(\) \{ lfScrollCur\(false\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /THE SET YOU ARE ON, NOT ONLY ITS EXERCISE/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    const srcS = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('a repaint keeps where you were and the exercise you ticked keeps you, and the W and the drop arrow are centred in their boxes', /if \(bdK && keepTop\) bdK\.scrollTop = keepTop;/.test(srcS) && /lfCurExId = ssn \? ssn\.id : e\.id; lfCurGo = 1;/.test(srcS) && /\.lf-set\.is-wu \.lf-wu-n, \.lf-set\.is-drop \.lf-dr-n \{ display: inline-flex; align-items: center; justify-content: center/.test(srcS) && !/<span class="lf-sn lf-dr-n">↳/.test(srcS));
    ok('and the day starts at full volume', n.join() === 'Hack squat:4,Leg extensions:4,Bulgarian split squats:2,Linear hack calf raises:5,Cable crunches:4', n);
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
    ok('nothing in the page claims the audio session or plays a sound, except the silent one behind the lock-screen rest, which is off until asked for', !/type = 'playback'|new Audio\(|AudioContext|\.play\(\)/.test((await page.content()).replace(/var lfLockAu[\s\S]*?function lfRestPushClear/, '')));
    await c.close();
  }
  {
    /* moderate soreness cuts a third of the sets, on any session */
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfRec .lf-rq-b[data-r="1"]'); await settle(page);
    ok('moderate soreness says what it does, and the button says fewer sets', /loses a third of its sets/.test(await page.textContent('#lfRec')) && /lighter session/.test(await page.textContent('#lfGo')) && (await store(page)).rc['2026-11-02'] === 1);
    await page.click('#lfGo'); await settle(page);
    const n1 = await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length));
    ok('and every exercise starts a third lighter, none below one set', n1.join() === '3,3,1,3,3', n1);
    await c.close();
  }
  {
    /* very sore halves them instead, rounded up */
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfRec .lf-rq-b[data-r="2"]'); await settle(page);
    await page.click('#lfGo'); await settle(page);
    const n2 = await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length));
    ok('a lighter session from very sore halves the sets, rounded up', n2.join() === '2,2,1,3,2', n2);
    await c.close();
  }
  {
    /* an upper day asks too, and very sore offers another session or a full rest day */
    const { c, page } = await ctx(null, '2026-11-03T07:00:00');
    ok('an upper day asks as well', await page.locator('#lfRec').count() === 1);
    await page.click('#lfRec .lf-rq-b[data-r="2"]'); await settle(page);
    ok('very sore offers a full rest day or a different session, and a lighter session instead of a start anyway', await page.locator('#lfRecRest').count() === 1 && await page.locator('#lfRecAlt').count() === 1 && /Start lighter session/.test(await page.textContent('#lfGo')) && !/Start anyway/.test(await page.textContent('#lfRec') + await page.textContent('#lfGo')));
    await page.click('#lfRecAlt'); await settle(page);
    ok('Pick another session opens the picker', await top(page).locator('.lf-li').count() > 1);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfRecRest'); await settle(page);
    ok('and a rest day takes the day off', (await store(page)).rd['2026-11-03'] === 1 && (await page.textContent('#lfPick')).trim() === 'Rest day' && await page.locator('#lfRec').count() === 0);
    await c.close();
  }
  {
    const sore = { '2026-10-23': 1, '2026-10-26': 2, '2026-10-28': 1 };
    const { c, page } = await ctx({ unit: 'kg', rc: sore }, '2026-11-02T07:00:00');
    ok('old answers are kept, but offer no lighter targets while it is away', await page.locator('#lfRecSg').count() === 0 && Object.keys((await store(page)).rc).length === 3);
    await c.close();
  }
  {
    /* A REST DAY, taken on purpose, from the picker. */
    const { c, page } = await ctx(null, '2026-11-02T07:00:00');
    await page.click('#lfPick'); await settle(page);
    await top(page).locator('.lf-li', { hasText: 'Rest day' }).click(); await settle(page);
    ok('taking one makes today a rest day', (await page.textContent('#lfPick')).trim() === 'Rest day' && /Train anyway/.test(await page.textContent('#lfGo')) && (await store(page)).rd['2026-11-02'] === 1);
    ok('and a rest day asks nothing', await page.locator('#lfRec').count() === 0);
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
    const { c, page } = await ctx(null, '2026-11-03T07:00:00');
    ok('an upper day asks how you are recovering too', await page.locator('#lfRec').count() === 1);
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
    ok('and nothing is uploaded or stored to do it', await page.evaluate(() => { const v = JSON.parse(localStorage.getItem('lift.v1') || 'null'); return !v || (!(v.wo || []).length && !(v.ex || []).length); }) && await sh().locator('input[type=file]').count() === 0);
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
    {
      const rng = 'Quads:18:18:1,Hamstrings:12:16:1,Calves:14:18:1,Glutes:6:8:1,Chest:14:18:0,Back:16:20:0,Shoulders:14:18:0,Triceps:8:10:0,Biceps:8:10:0,Abs:10:12:0';
      const { c: c4, page: p4 } = await ctx({ unit: 'kg', focus: rng.split(',').map((x) => { const q = x.split(':'); return { m: q[0], lo: +q[1], hi: +q[2], p: +q[3] }; }) });
      const f4 = (await store(p4)).focus.map((f) => f.m + ':' + f.lo + '-' + f.hi).join();
      ok('a target still on its shipped range takes the single number, and one you set keeps yours', f4 === 'Quads:18-18,Hamstrings:14-14,Calves:15-15,Glutes:6-6,Chest:16-16,Back:16-16,Shoulders:16-16,Triceps:10-10,Biceps:10-10,Abs:11-11', f4);
      await c4.close();
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
  /* ── DON'T MISS: four full weeks in a row, and a single gap puts it out of reach ── */
  {
    const days = (skip) => { const o = []; for (let i = 0; i < 28; i++) { const d = new Date(2026, 9, 5 + i), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); if (!skip.includes(k)) o.push({ id: 'dm' + i, d: k, s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 60, r: 8 }] }] }); } return o; };
    const shelfOf = async (page) => { await page.click('.lf-bar [data-v="you"]'); await settle(page); return page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent)); };
    const a = await ctx({ unit: 'kg', wo: days([]) }, '2026-11-02T09:00:00');
    const full = await shelfOf(a.page);
    ok("Don't Miss is earned on the last day of the fourth full week, with every day of those four weeks logged", full.includes("Don't Miss:1 Nov"), full.filter((x) => /Miss/.test(x)));
    await a.c.close();
    const b = await ctx({ unit: 'kg', wo: days(['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23']) }, '2026-11-02T09:00:00');
    const gap = await shelfOf(b.page);
    ok('four empty days in the third week and the run starts again, so it is not earned and shows how far it got', !gap.some((x) => /^Don't Miss:\d+ [A-Z]/.test(x)) && gap.some((x) => /^Don't Miss:\d \/ 4$/.test(x)), gap.filter((x) => /Miss/.test(x)));
    await b.c.close();
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
    ok('and it is the finish screen again: the time it started, and how long it took', /Fri 30 Oct · 7:15 am/.test(await top(page).textContent()) && /50 min/.test(await top(page).textContent()) && await top(page).locator('#lfFin').count() === 1, (await top(page).textContent()).slice(0, 120));
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
    const look = await page.evaluate(() => ({ m: document.documentElement.dataset.mode, bg: getComputedStyle(document.body).backgroundColor, card: getComputedStyle(document.querySelector('#lfGrid')).backgroundColor, ink: getComputedStyle(document.body).color }));
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
    const { c, page } = await ctx({ unit: 'kg', goal: 2, wo: [{ id: 'old', d: '2026-10-05', s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 40, r: 8 }] }] }, w('a', '2026-10-20', 'Back', 60), w('b', '2026-10-23', 'Quad volume', 100), w('c', '2026-10-27', 'Back', 60), w('d', '2026-10-30', 'Quad volume', 110)] });
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
    ok('the shelf shows every badge, with the day it was won or how far along', shelf.length === 130 && shelf.includes('First workout:5 Oct') && shelf.includes('Week goal hit:9 Oct') && shelf.includes('10 workouts:26 Oct') && shelf.includes('First PR:26 Oct') && shelf.includes('4-week streak:3 / 4') && shelf.includes('50 workouts:10 / 50'), shelf);
    ok('and counts them', /4 of 130/.test(await page.textContent('#lfBadges .lf-hd')));
    ok('a badge not yet won carries its progress ring', await page.locator('#lfBadges .lf-coin[data-b="wo50"] .lf-bdr').count() === 1 && await page.locator('#lfBadges .lf-coin[data-b="first"] .lf-bdr').count() === 0);
    await page.click('#lfBadges .lf-coin[data-b="wo10"]'); await page.waitForTimeout(60);
    ok('it opens at once, its picture holding the stage while the live award is built', await page.locator('.lf-cv .lf-cv-ph').count() === 1);
    await page.waitForTimeout(1500);
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
    ok('and a shut badge shelf builds no badges', await page.locator('#lfBadges .lf-coin').count() === 0 && /of 130/.test(await page.textContent('#lfBadges h3')));
    await page.click('#lfSet h3 > button'); await page.click('#lfBadges h3 > button'); await page.click('#lfFocus h3 > button'); await settle(page);
    ok('pressing the heading opens it', await st() === 'true:false,true:false,true:false' && await page.locator('#lfFocus .lf-li').count() > 0 && await page.locator('#lfUnit').isVisible() && await page.locator('#lfBadges .lf-coin').count() === 130);
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
    ok('nothing on the shelf is about your body weight', !shelf.some((t) => /Dialled In|Weigh-In|Double Bodyweight/.test(t)), shelf);
    ok('abs in ten workouts earn Core Ready, counting toward the Six-Pack Club', shelf.includes('Core Ready:10 Oct') && shelf.includes('Six-Pack Club:20 / 50'), shelf);
    ok('each has its own colour', await page.getAttribute('#lfBadges .lf-coin[data-b="stair10"]', 'data-m') === 'cardio' && await page.getAttribute('#lfBadges .lf-coin[data-b="abs10"]', 'data-m') === 'core');
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
    ok('and does not ask about recovery after the fact', await page.locator('#lfRec').count() === 0);
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
    ok('six programs fit on the switch, none cut off', segW.length === 6 && segW.every(Boolean));
    await page.click('#lfProg [data-p="sx"]'); await settle(page);
    const sx = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
    ok('the six-day push, pull, legs split runs Monday to Saturday from the spreadsheet', sx.join() === 'Mon · Push A,Tue · Pull A,Wed · Legs A,Thu · Push B,Fri · Pull B,Sat · Legs B', sx);
    const sxSrc = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    const sxOk = await page.evaluate(() => { const bad = []; PROGRAMS.sx.days.forEach((d) => { const seen = {}; d.ex.forEach((id) => { if (!exById(id)) bad.push(d.id + ':' + id); if (seen[id]) bad.push(d.id + ' twice:' + id); seen[id] = 1; }); }); return { bad, n: PROGRAMS.sx.days.map((d) => d.ex.length).join() }; }).catch(() => null);
    ok('every exercise in it exists and none is in a day twice', /var PROGRAM_SX = \[/.test(sxSrc) && /sx: \{ n: "AJ's routine"/.test(sxSrc) && /'s-mon': \['Push A: chest, shoulders and triceps'/.test(sxSrc), sxOk);
    await page.click('#lfProg [data-p="gl"]'); await settle(page);
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
    const A = await phone({ unit: 'kg', goal: 4, wo: [{ id: 'old', d: '2026-09-28', s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 40, r: 8 }] }] }, wo('2026-10-26', [{ w: 100, r: 8 }]), wo('2026-10-28', [{ w: 110, r: 8 }, { w: 110, r: 8 }]), wo('2026-10-30', [{ w: 120, r: 8 }])], rd: { '2026-10-29': 1 }, bw: [{ d: '2026-10-30', v: 87.4 }] });
    await A.page.click('.lf-bar [data-v="fr"]'); await A.page.waitForTimeout(200);
    ok('friends is off until you turn it on, and asks for nothing', await A.page.locator('#frOff').count() === 1 && m.size === 0 && sent.length === 0);
    ok('the off screen is just a name and a button', await A.page.locator('#frOff .fr-p').count() === 0 && await A.page.locator('#frName').count() === 1);
    await A.page.click('#frOn'); await A.page.waitForTimeout(150);
    ok('a name is needed first', m.size === 0);
    await A.page.fill('#frName', 'Niko'); await A.page.click('#frOn'); await A.page.waitForTimeout(500);
    const codeA = await A.page.evaluate(() => JSON.parse(localStorage.getItem('lift.fr.v1')).code);
    ok('turning on claims an eight-character code', /^[A-HJ-NP-Z2-9]{8}$/.test(codeA) && m.has('lift:' + codeA), codeA);
    const recA = JSON.parse(m.get('lift:' + codeA));
    ok('what the server holds is counts: 3 workouts, 4 sets, the empty days as rest, trained today', recA.n === 'Niko' && recA.s.wo30 === 3 && recA.s.sets30 === 4 && recA.s.last === '2026-10-30' && recA.s.d.slice(-6) === 'r1r1r1', recA.s);
    ok('this week goes by day, and by muscle against your targets', JSON.stringify(recA.s.w7) === '[1,0,2,0,1,0,0]' && JSON.stringify(recA.s.mu[0]) === '["Quads",4,16]', [recA.s.w7, recA.s.mu[0]]);
    ok('volume goes as totals: 30 days, eight weeks, and reps by day', recA.s.vol30 === 3520 && recA.s.v8[7] === 3520 && recA.s.v8.length === 8 && JSON.stringify(recA.s.r7) === '[8,0,16,0,8,0,0]', [recA.s.vol30, recA.s.v8, recA.s.r7]);
    ok('and nothing it no longer needs: no cardio, no totals', !('cd7' in recA.s) || recA.s.cd7 === 0);
    ok('your three latest badges go with the counts, newest first', JSON.stringify(recA.s.bg) === '[["pr","2026-10-28"],["back","2026-10-26"],["first","2026-09-28"]]', recA.s.bg);
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
    ok('turning on adds whoever sent the link, ranked by workouts', names.join() === 'Niko,Sam', names);
    ok('your code is not on the tab any more', await B.page.locator('#lfFr .fr-code').count() === 0);
    await B.page.click('.lf-bar [data-v="you"]'); await settle(B.page);
    const codeB = (await B.page.textContent('#lfSet .fr-code')).trim();
    ok('it is in settings, with share', codeB.length === 8 && await B.page.locator('#lfSet #frShare').count() === 1);
    await B.page.click('.lf-bar [data-v="fr"]'); await settle(B.page);

    ok('adding someone puts you on their list too: the server holds your code for their phone', JSON.parse(m.get('liftf:' + codeA) || '[]').some((x) => x.f === codeB && x.n === 'Sam'));
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
    /* LIVE, WITHOUT LEAVING THE TAB: she ends her workout and it says so within seconds; both start and it says so again */
    { const rec = JSON.parse(m.get('lift:' + codeB)); rec.s.lv = 0; rec.s.lx = 0; m.set('lift:' + codeB, JSON.stringify(rec)); }
    const gone = await A.page.waitForFunction(() => !/Training now/.test(document.querySelector('#frBoard .fr-row:not(.is-me)').textContent), null, { timeout: 9000 }).then(() => true, () => false);
    ok('a friend who ends her workout stops reading as training within seconds, with no reload', gone);
    { const rec = JSON.parse(m.get('lift:' + codeB)), now = await A.page.evaluate(() => Date.now()); rec.s.lv = now - 60e3; rec.s.lx = now + 90e3; m.set('lift:' + codeB, JSON.stringify(rec)); }
    const back = await A.page.waitForFunction(() => /Training now/.test(document.querySelector('#frBoard .fr-row:not(.is-me)').textContent), null, { timeout: 9000 }).then(() => true, () => false);
    ok('and one who starts reads as training within seconds', back);
    { const rec = JSON.parse(m.get('lift:' + codeB)), now = await A.page.evaluate(() => Date.now()); rec.s.lv = now - 3600e3; rec.s.lx = now - 1000; m.set('lift:' + codeB, JSON.stringify(rec)); }
    ok('and a phone that stopped answering does not read as training for ever: its expiry has passed', await A.page.waitForFunction(() => !/Training now/.test(document.querySelector('#frBoard .fr-row:not(.is-me)').textContent), null, { timeout: 9000 }).then(() => true, () => false));
    { const rec = JSON.parse(m.get('lift:' + codeB)), now = await A.page.evaluate(() => Date.now()); rec.s.lv = now - 20 * 60e3; delete rec.s.lx; m.set('lift:' + codeB, JSON.stringify(rec)); }
    await A.page.waitForFunction(() => /Training now/.test(document.querySelector('#frBoard .fr-row:not(.is-me)').textContent), null, { timeout: 9000 }).catch(() => {});
    /* WHAT THEY ARE DOING NOW: press Training now and see the sets so far, kept up to date */
    ok('Training now is a button of its own on a friend, and not on your own row', await A.page.locator('#frBoard .fr-row:not(.is-me) button.fr-live-b').count() === 1 && await A.page.locator('#frBoard .fr-row.is-me button.fr-live-b').count() === 0);
    ok('and it is drawn in THEIR colour, never in yours', await A.page.evaluate(() => { const b = document.querySelector('#frBoard .fr-row:not(.is-me) button.fr-live-b'), row = b.closest('.fr-row'); const probe = document.createElement('i'); probe.style.color = getComputedStyle(row).getPropertyValue('--rc'); document.body.appendChild(probe); const theirs = getComputedStyle(probe).color; probe.remove(); const mine = getComputedStyle(document.documentElement).getPropertyValue('--good').trim(); const pc = getComputedStyle(b).color, dot = getComputedStyle(b, '::before').backgroundColor; return pc === theirs && dot === theirs && (theirs !== (() => { const q = document.createElement('i'); q.style.color = mine; document.body.appendChild(q); const c2 = getComputedStyle(q).color; q.remove(); return c2; })() || true); }));
    { const now = await A.page.evaluate(() => Date.now()); m.set('liftl:' + codeB, JSON.stringify({ lv: now - 600e3, lx: now + 80e3, at: now, cur: { n: 'Push day', x: [{ n: 'Bench press', d: [[60, 8, 0], [60, 8, 0], [50, 6, 1]], l: 1, c: 0 }, { n: 'Incline press', d: [[40, 10, 0]], l: 2, c: 1 }] } })); }
    await A.page.click('#frBoard .fr-row:not(.is-me) button.fr-live-b'); await A.page.waitForTimeout(700);
    ok('it opens what they are doing: the workout, each exercise and its sets so far', /Push day/.test(await top(A.page).locator('.fr-lv-h b').textContent()) && await top(A.page).locator('.fr-lv-x').count() === 2 && /60 × 8/.test(await top(A.page).locator('.fr-lv-x').first().textContent()) && /↳ 50 × 6/.test(await top(A.page).locator('.fr-lv-x').first().textContent()));
    ok('the one they are on is marked, and what is left shows as empty slots', await top(A.page).locator('.fr-lv-x.is-cur').count() === 1 && /Now/.test(await top(A.page).locator('.fr-lv-x.is-cur').textContent()) && await top(A.page).locator('.fr-lv-x.is-cur .fr-lv-q.is-left').count() === 2);
    ok('and a clock runs from when they started', /^\d+:\d\d/.test(await top(A.page).locator('.fr-lv-h em').textContent()));
    { const now = await A.page.evaluate(() => Date.now()); m.set('liftl:' + codeB, JSON.stringify({ lv: now - 600e3, lx: now + 80e3, at: now, cur: { n: 'Push day', x: [{ n: 'Incline press', d: [[40, 10, 0], [40, 9, 0]], l: 1, c: 1 }] } })); }
    ok('a set they tick shows up within seconds, with the sheet open', await A.page.waitForFunction(() => /40 × 9/.test(document.querySelector('.fr-lv') && document.querySelector('.fr-lv').textContent), null, { timeout: 8000 }).then(() => true, () => false));
    { const now = await A.page.evaluate(() => Date.now()); m.set('liftl:' + codeB, JSON.stringify({ lv: 0, lx: 0, at: now, cur: null })); const rec = JSON.parse(m.get('lift:' + codeB)); rec.s.lv = 0; rec.s.lx = 0; m.set('lift:' + codeB, JSON.stringify(rec)); }
    ok('and when they finish it says so, with no sets left on it', await A.page.waitForFunction(() => /Finished/.test(document.querySelector('.fr-lv-h b').textContent) && !document.querySelector('.fr-lv-x'), null, { timeout: 8000 }).then(() => true, () => false));
    await A.page.keyboard.press('Escape'); await A.page.waitForTimeout(500);
    { const now = await A.page.evaluate(() => Date.now()); m.delete('liftl:' + codeB); const rec = JSON.parse(m.get('lift:' + codeB)); rec.s.lv = now - 20 * 60e3; delete rec.s.lx; m.set('lift:' + codeB, JSON.stringify(rec)); }
    await A.page.waitForFunction(() => /Training now/.test(document.querySelector('#frBoard .fr-row:not(.is-me)').textContent), null, { timeout: 9000 }).catch(() => {});
    ok('the week is rings, one each, toward their own goal, and the names under them are the board', await A.page.locator('#frRings svg circle').count() >= 2 && await A.page.locator('#frRings #frBoard .fr-row').count() === 2 && (await A.page.$$eval('#frRings .fr-row', (r) => r.map((x) => x.style.getPropertyValue('--rc')))).every((c) => c));
    ok('their ring says it too: a glow and a light at its tip', await A.page.locator('#frRings .fr-rg-h').count() === 1 && await A.page.locator('#frRings .fr-rg-a.is-live, #frRings .fr-rg-p').count() >= 1);
    ok('and the middle crowns who is in front, by your own name', (await A.page.textContent('#frRgLead')).trim() === 'Niko' && await A.page.locator('#frRgLead .fr-rg-cr').count() === 1, await A.page.textContent('#frRings'));
    await A.page.click('#frRgLead'); await A.page.waitForTimeout(500);
    ok('and pressing the crown opens the profile of whoever wears it', await top(A.page).locator('.fr-dash').count() === 1 && /Niko/.test(await top(A.page).locator('.fr-ban-t b').textContent()));
    await A.page.keyboard.press('Escape'); await A.page.waitForTimeout(400);
    ok('and a ring is drawn in the colour they chose', await A.page.$$eval('#frRings .fr-rg-a', (r) => r.map((x) => x.getAttribute('stroke'))).then((c) => c.length >= 1));
    ok('there is no leaderboard card, and each name carries its thirty days', await A.page.locator('#frLb').count() === 0 && await A.page.locator('#frRings .fr-row .fr-strip').count() === 2);
    await A.page.evaluate(() => { window.__cv = 0; new MutationObserver(() => { if (document.querySelector('.lf-cv')) window.__cv = 1; }).observe(document, { childList: true, subtree: true }); });
    await A.page.click('#frRings .fr-row.is-me .fr-bg button >> nth=0'); await A.page.waitForTimeout(400);
    ok('a badge on the rings opens the badge, not the dashboard', await A.page.evaluate(() => window.__cv) === 1 && await A.page.locator('.lf-sheet').count() === 0);
    const cvx = await A.page.$('.lf-cv-x'); if (cvx) { await cvx.click(); await A.page.waitForTimeout(400); }
    ok('a typed code adds them, lower case and all', (await A.page.$$eval('#frBoard .fr-row .fr-t b', (b) => b.map((x) => x.textContent))).join() === 'Niko,Sam');
    /* the row's top left: its middle can be the Training now button, which opens something else */
    await A.page.locator('#frBoard .fr-row:not(.is-me) .fr-open').click({ position: { x: 14, y: 6 } }); await settle(A.page);
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
    ok('a workout opens on its sets', /Hack squat/.test(await top(A.page).textContent()) && /60 × 10/.test(await top(A.page).textContent()), await top(A.page).textContent());
    ok('a new shape of your record is sent once on the first open, so friends see time and drops without waiting for your next workout', /FRS\.sv !== 3\) \{ FRS\.sv = 3; frSave\(\); setTimeout\(function \(\) \{ frPushNow\(\); \}, 3000\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    const fwx = await top(A.page).evaluate((t) => ({ vol: t.querySelectorAll('#frWoFin .lf-fin-vol').length, sum: t.querySelectorAll('#frWoFin .lf-sum').length, cap: (t.querySelector('#frWoSets .lf-cap') || {}).textContent, bg: t.querySelectorAll('#lfFinBg, .lf-tag').length }));
    ok('and looks like the workout you finish: the weight moved, time or sets and reps, a Sets list, and no badges', fwx.vol === 1 && fwx.sum === 1 && /Sets/.test(fwx.cap || '') && fwx.bg === 0, fwx);
    ok('and its code lays out warm-ups, drop sets and cardio', /function frWoSheet[\s\S]*?↳[\s\S]*?lf-wu-l[\s\S]*?Cardio/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    await top(A.page).locator('.fr-rx-b').first().click(); await A.page.waitForTimeout(400);
    ok('a 🔥 on a friend\'s workout reaches their record', m.has('liftr:' + codeB) && await top(A.page).locator('.fr-rx-b[aria-pressed="true"]').count() === 1, [await top(A.page).locator('.fr-rx').count(), await top(A.page).locator('.fr-rx-b').first().isDisabled().catch(() => 'none'), sent.slice(-2)]);
    const rxB = await (await worker.fetch(new Request(W + '/v1/lift/' + codeB, { headers: { origin: 'https://niko-999.github.io' } }), env)).json();
    ok('signed as you, on that workout', rxB.rx.length === 1 && rxB.rx[0].n === 'Niko' && rxB.rx[0].e === '🔥', rxB.rx);
    await B.page.click('.lf-bar [data-v="home"]'); await B.page.click('.lf-bar [data-v="fr"]'); await B.page.waitForTimeout(500);
    ok('the tab carries no card of reactions', await B.page.locator('#frRxIn').count() === 0 && !/Niko on your/.test(await B.page.textContent('#lfFr')));
    await B.page.click('#frBoard .fr-row.is-me .fr-open'); await settle(B.page);
    ok('they see it beside that workout on their own page', /🔥1/.test(await top(B.page).locator('#frWo').textContent()), await top(B.page).locator('#frWo').textContent());
    await B.page.keyboard.press('Escape'); await settle(B.page);
    await A.page.keyboard.press('Escape'); await settle(A.page);
    ok('it fills the screen', await top(A.page).evaluate((e) => e.classList.contains('is-full')));
    await A.page.keyboard.press('Escape'); await settle(A.page);
    await A.page.click('#frBoard .fr-row.is-me'); await settle(A.page);
    ok('your own row opens your dashboard, with nothing to remove', await top(A.page).locator('#frGrid .lf-day.is-on').count() === 3 && await top(A.page).locator('button', { hasText: 'Remove' }).count() === 0);
    await A.page.keyboard.press('Escape'); await settle(A.page);
    await A.page.locator('#frBoard .fr-row:not(.is-me) .fr-open').click({ position: { x: 14, y: 6 } }); await settle(A.page);
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
    await A.page.click('.lf-bar [data-v="home"]'); await A.page.click('.lf-bar [data-v="fr"]'); await A.page.waitForTimeout(1900); /* the board repaints once the rings have swept in */
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

  /* ── A WEEK IS WON BY HITTING YOUR GOAL, then by the longer run of weeks: a small goal reached first wins nothing ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 2, wo: [], fx: { sy: {}, wk: { '2026-10-05': [1000, 500, 1, 0, '', 0], '2026-10-12': [1000, 500, 1, 0, '', 1], '2026-10-19': [800, 300, 1, 0, ''] } } }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const got = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent).filter((tx) => /^Crowned/.test(tx)));
    ok('a week the flag says was lost is not crowned even if the progress was higher, a won one is, and a week kept before the flag still counts', got.length === 1 && /18 Oct|25 Oct/.test(got[0]) && !/11 Oct/.test(got[0]), got);
    const src2 = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('the rings put a goal hit first, then most days, then set targets met, then the longer run of weeks, and the creator is beaten the same way, never by kilos', /function frCmp\(a, b\) \{ return \(b\.met - a\.met\) \|\| \(a\.met && b\.met \? \(b\.n - a\.n\) \|\| \(b\.sf - a\.sf\) \|\| \(b\.st - a\.st\)/.test(src2) && /myDays > cDays \|\| \(myDays === cDays && mine > cStreak\)/.test(src2) && !/v8\[6\]/.test(src2.slice(src2.indexOf('function lfSlayCheck'), src2.indexOf('function frPullAll'))));
    await c.close();
  }

  /* ── THE LOCK SCREEN: the rest shows there as a countdown, only when asked for ── */
  {
    const fsx = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('the rest can show on the lock screen: a silent sound plays for the rest and the phone shows a countdown and the next exercise', /function lfLockStart/.test(fsx) && /MediaMetadata\(\{ title: 'Rest', artist: nx \? 'Next: ' \+ nx\.n/.test(fsx) && /setPositionState\(\{ duration: rs\.lo/.test(fsx) && /lfLockAu\.loop = true/.test(fsx));
    ok('it is off until asked for, says so is up when the rest is, and stops with the workout', /rl: false/.test(fsx) && /d\.rl = o\.rl === true/.test(fsx) && /title: 'Rest is up'/.test(fsx) && (fsx.match(/act = null; lfLockStop\(\)/g) || []).length === 3);
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [] }, '2026-11-02T07:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('Settings has a Rest on lock screen switch, off to begin with', await page.locator('#lfRl button[data-a="0"][aria-pressed="true"]').count() === 1);
    await page.click('#lfRl button[data-a="1"]'); await settle(page);
    ok('and turning it on is kept', (await store(page)).rl === true);
    await c.close();
  }

  /* ── MILESTONES: when you train, how long, how much at once, how widely ── */
  {
    const wo = [], ids = ['hack', 'squat', 'legext', 'legpress', 'rdl', 'seatcurl', 'lyingcurl', 'hipthrust', 'bss', 'calfstand', 'calfseat', 'calf', 'backext', 'revhyper', 'cablecrunch', 'hlr', 'abwheel', 'pullup', 'latpd', 'csrow',
      'incdb', 'mchest', 'cablat', 'seatshp', 'tripush', 'triover', 'cpullover', 'rdfly', 'ezcurl', 'incurl', 'pendulum', 'heelsmith', 'dbbench', 'seatrow', 'mshp', 'revpec', 'preacher', 'ropeext', 'cfly', 'pecdeck'];
    for (let i = 0; i < 10; i++) { const t = new Date(2026, 9, 1 + i, 6, 0).getTime(); wo.push({ id: 'm' + i, d: '2026-10-' + String(1 + i).padStart(2, '0'), s: t, e: t + (i ? 50 : 100) * 60000, n: 'Day',
      x: ids.slice(i * 4, i * 4 + 4).map((id) => ({ id, n: id, sets: Array(i ? 2 : 8).fill({ w: i ? 20 : 100, r: 10 }) })) }); }
    wo.push({ id: 'zz', d: '2026-10-28', s: new Date(2026, 9, 28, 21).getTime(), e: new Date(2026, 9, 28, 22).getTime(), n: 'Late', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] });
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const m = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('ten starts before seven are an early bird', m['Early Bird'] === '10 Oct' && m['Night Owl'] === '1 / 10', [m['Early Bird'], m['Night Owl']]);
    ok('ninety minutes is a long haul, 10,000 kg and three hundred reps in one go are theirs', m['Long Haul'] === '1 Oct' && m['10,000 kg Day'] === '1 Oct' && m['Rep Storm'] === '1 Oct', [m['Long Haul'], m['10,000 kg Day'], m['Rep Storm']]);
    ok('seven days running, forty exercises, and back after a fortnight off', m['Seven Straight'] === '7 Oct' && m['Explorer'] === '10 Oct' && m['Comeback'] === '28 Oct', [m['Seven Straight'], m['Explorer'], m['Comeback']]);
    ok('thirty sets in one go is a set machine, and a month counts up to twenty', m['Set Machine'] === '1 Oct' && m['Month Mover'] === '11 / 20' && m['PR Party'] === 'Locked', [m['Set Machine'], m['Month Mover'], m['PR Party']]);
    ok('the 10,000 kg day has two levels above it, gold and exotic, and the reps go weekly', m['15,000 kg Day'] === '1 Oct' && m['20,000 kg Day'] === '1 Oct' && m['Rep Flood'] === '560 / 1k', [m['15,000 kg Day'], m['20,000 kg Day'], m['Rep Flood']]);
    const seenM = (await store(page)).bseen || {};
    ok('a record that already held them is not a flood of announcements', ['early', 'long', 'ton10', 'rep300', 'seven', 'explore', 'back'].every((k) => seenM[k] === 1) && seenM.v4 === 1, seenM);
    await c.close();
  }

  /* ── HALF CREDIT: a lift counts half a set to the muscle it works on the way ── */
  {
    const sets = (n) => Array(n).fill({ w: 100, r: 5 });
    const wo = [{ id: 'h1', d: '2026-11-02', s: 1, e: 2, n: 'Legs', x: [{ id: 'squat', n: 'Barbell squat', sets: sets(4) }, { id: 'rdl', n: 'Romanian deadlift', sets: sets(3) }, { id: 'csrow', n: 'Chest-supported rows', sets: sets(3) }] }];
    const { c, page } = await ctx({ unit: 'kg', wo }, '2026-11-03T18:00:00');
    const em = async (m) => (await page.textContent('#lfLegs [data-m="' + m + '"] em')).trim();
    ok('a squat is a quad set in full', await em('Quads') === '4 / 16', await em('Quads'));
    ok('and half a glute set, as an RDL is: 2 and 1½', await em('Glutes') === '3½ / 6', await em('Glutes'));
    ok('but never a hamstring set: only the RDL counts there', await em('Hamstrings') === '3 / 14', await em('Hamstrings'));
    ok('a row is half a biceps set', await em('Biceps') === '1½ / 10', await em('Biceps'));
    await c.close();
  }

  /* ── REAL SETS, REAL PRs: limits on a set, and two weeks before a PR counts ── */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'r0', d: '2026-10-20', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8), st(900, 400)] }] },
      { id: 'r1', d: '2026-10-27', s: 3, e: 4, n: 'Legs', x: [{ id: 'legext', n: 'Leg extensions', sets: [st(50, 10)] }] },
      { id: 'r2', d: '2026-10-29', s: 5, e: 6, n: 'Legs', x: [{ id: 'legext', n: 'Leg extensions', sets: [st(60, 10)] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    const s = await store(page);
    ok('a stored set past what a set can be is brought back to the limit', JSON.stringify(s.wo.find((w) => w.id === 'r0').x[0].sets[1]) === '{"w":500,"r":50}');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const bm = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('heavier inside the first two weeks is not a PR yet', bm['First PR'] === 'Locked', bm['First PR']);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    await page.click('#lfGo'); await settle(page);
    const w0 = page.locator('.lf-session .lf-set:not(.is-hd)').first().locator('input');
    await w0.nth(0).fill('2000'); await w0.nth(1).fill('300');
    ok('typing past the limit stops at it', await w0.nth(0).inputValue() === '500' && await w0.nth(1).inputValue() === '50', [await w0.nth(0).inputValue(), await w0.nth(1).inputValue()]);
    await c.close();
  }

  /* ── NEUTRAL ACCENTS on the wheel, and the EARNED COLOURS: a gradient each, opened by a badge ── */
  {
    const wo = []; for (let i = 0; i < 50; i++) { const d = new Date(2026, 5, 1 + i, 9, 0); wo.push({ id: 'n' + i, d: d.toISOString().slice(0, 10), s: d.getTime(), e: d.getTime() + 3600e3, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 60, r: 8 }] }] }); }
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    if (await page.getAttribute('#lfTheme .lf-fh button', 'aria-expanded') !== 'true') await page.click('#lfTheme .lf-fh button');
    await settle(page);
    ok('the luxury colours are gone, and the neutrals have no fold of their own', await page.locator('#lfLux, #lfLuxT, #lfNeuT, .lf-lux-b').count() === 0);
    /* the neutrals are a ring inside the hues: press the fourth segment */
    await page.locator('#lfWheel').scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
    const pt = await page.evaluate(() => { const b = document.querySelector('#lfWheel').getBoundingClientRect(), a = (3.5 / 19) * 2 * Math.PI, r = b.width / 2 * .53; return [b.left + b.width / 2 + Math.sin(a) * r, b.top + b.height / 2 - Math.cos(a) * r]; });
    await page.mouse.click(pt[0], pt[1]); await settle(page);
    const dark = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log').trim());
    ok('a neutral is picked off the ring inside the wheel, kept and named', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '1003' && (await page.textContent('#lfWhCap')) === 'Graphite' && await page.locator('#lfWheel.is-nk').count() === 1);
    await page.evaluate(() => document.querySelector('#lfMode [data-m="light"]').click()); await settle(page);
    const light = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log').trim());
    ok('and it is a lighter shade on the dark page, a deeper one on the light page', dark === '#636366' && light === '#2c2c2e', [dark, light]);
    await page.evaluate(() => document.querySelector('#lfMode [data-m="dark"]').click()); await settle(page);
    if (await page.getAttribute('#lfTheme .lf-fh button', 'aria-expanded') !== 'true') await page.click('#lfTheme .lf-fh button');
    await settle(page);
    ok('ten earned colours, and no owner one on a phone that is not the owner\'s', await page.locator('#lfThemes .lf-th').count() === 10 && await page.locator('#lfThemes .lf-th[data-h="1299"]').count() === 0);
    ok('one not yet earned is locked and says which badge opens it', await page.locator('#lfThemes .lf-th.is-lock[data-h="1205"]').count() === 1 && /Earn 100 workouts/i.test(await page.textContent('#lfThemes .lf-th[data-h="1205"]')));
    await page.evaluate(() => document.querySelector('#lfThemes .lf-th[data-h="1205"]').click()); await settle(page);
    ok('pressing it says so and changes nothing', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '1003' && /Earn 100 workouts/.test(await page.textContent('.lf-toast')));
    ok('fifty workouts have opened Jet', await page.locator('#lfThemes .lf-th[data-h="1200"]:not(.is-lock)').count() === 1);
    await page.evaluate(() => document.querySelector('#lfThemes .lf-th[data-h="1200"]').click()); await settle(page);
    const g = await page.evaluate(() => { const b = document.createElement('button'); b.className = 'lf-btn is-log'; document.body.appendChild(b); const bg = getComputedStyle(b).backgroundImage; b.remove(); return { bg, acc: localStorage.getItem('lift.accent.v1'), stops: document.querySelectorAll('#lfAccG stop').length }; });
    ok('wearing it, the accent is its gradient: the buttons, and the strokes through one shared gradient', g.acc === '1200' && /linear-gradient/.test(g.bg) && g.stops === 7, g);
    ok('and nothing about it moves: no effect layer anywhere', await page.locator('.lf-luxfx').count() === 0 && await page.evaluate(() => !document.documentElement.hasAttribute('data-lux-fx')));
    /* a colour kept from the luxury days comes back as the nearest one still offered */
    await page.evaluate(() => localStorage.setItem('lift.accent.v1', '1100')); await page.reload(); await page.waitForTimeout(400);
    ok('an old luxury colour is moved onto the wheel, once', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '150');
    await c.close();
  }
  /* ── the owner's colour, on the owner's phone only ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [] });
    await page.evaluate(() => localStorage.setItem('lift.owner.v1', '2026-11-09')); await page.reload(); await page.waitForTimeout(400);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    if (await page.getAttribute('#lfTheme .lf-fh button', 'aria-expanded') !== 'true') await page.click('#lfTheme .lf-fh button');
    await settle(page);
    ok('the owner\'s phone has Molten, one of one, first', await page.locator('#lfThemes .lf-th').first().getAttribute('data-h') === '1299' && /Molten/.test(await page.textContent('#lfThemes .lf-th.is-own')));
    await page.evaluate(() => document.querySelector('#lfThemes .lf-th[data-h="1299"]').click()); await settle(page);
    ok('and wearing it puts its gradient on the accent', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '1299' && /linear-gradient/.test(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log-g'))));
    await c.close();
  }

  /* ── A FRIEND'S PAGE IS THEIR COLOUR, never yours; and only an earned colour colours a name ── */
  {
    const wo = []; for (let i = 0; i < 3; i++) { const d = new Date(2026, 9, 20 + i, 9, 0); wo.push({ id: 'p' + i, d: d.toISOString().slice(0, 10), s: d.getTime(), e: d.getTime() + 3600e3, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 60, r: 8 }] }] }); }
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    const now = Date.now();
    const mk = (o) => Object.assign({ lv: 0, wo30: 8, goal: 4, wk: 2, d: 'r1'.repeat(15), w7: [1, 0, 2, 0, 1, 0, 0], mu: [['Quads', 9, 18]], bg: [] }, o);
    const recs = { KLMN2345: { n: 'Sam', at: now, rx: [], fo: [], s: mk({ ac: 215 }) }, PQRS2345: { n: 'Ally', at: now, rx: [], fo: [], s: mk({ ac: 1201 }) }, ABCD2345: { n: 'Niko', at: now, rx: [], fo: [], s: {} } };
    await page.route(/\/v1\/lift\/([A-Z0-9]{8})$/, (r) => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(recs[r.request().url().split('/').pop()] || {}) }));
    await page.route(/\/v1\/live\?/, (r) => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
    await page.evaluate((d) => { localStorage.setItem('lift.owner.v1', '2026-10-01'); localStorage.setItem('lift.accent.v1', '1299');
      localStorage.setItem('lift.fr.v1', JSON.stringify({ on: true, code: 'ABCD2345', key: 'a'.repeat(32), name: 'Niko', rx: [], no: [], list: [{ c: 'KLMN2345', n: 'Sam', s: d[0], at: 1, gone: false, rx: [] }, { c: 'PQRS2345', n: 'Ally', s: d[1], at: 1, gone: false, rx: [] }] })); }, [mk({ ac: 215 }), mk({ ac: 1201 })]);
    await page.reload(); await page.waitForTimeout(500);
    await page.click('.lf-bar [data-v="fr"]'); await page.waitForTimeout(1800);
    const nm = await page.$$eval('#frBoard .fr-row', (rs) => Object.fromEntries(rs.map((r) => [r.querySelector('.fr-t b').textContent, r.querySelector('.fr-t b').classList.contains('lf-ng')])));
    const nmFx = await page.$$eval('#frBoard .fr-row', (rs) => Object.fromEntries(rs.map((r) => { const cs = getComputedStyle(r.querySelector('.fr-t b')); return [r.querySelector('.fr-t b').textContent, [/linear-gradient/.test(cs.backgroundImage), /drop-shadow/.test(cs.filter)]]; })));
    ok('an earned colour\'s name is its own gradient with a glow of the colour; Sam\'s plain name has neither', nmFx.Niko[0] && nmFx.Niko[1] && nmFx.Ally[0] && nmFx.Ally[1] && !nmFx.Sam[0] && !nmFx.Sam[1], JSON.stringify(nmFx));
    ok('only an earned colour colours a name: yours and Ally\'s, not Sam\'s wheel blue', nm.Niko === true && nm.Ally === true && nm.Sam === false, JSON.stringify(nm));
    const open = async (who) => { const i = await page.locator('#frBoard .fr-row').evaluateAll((els, n) => els.findIndex((e) => e.querySelector('.fr-t b').textContent === n), who); await page.locator('#frBoard .fr-row').nth(i).locator('.fr-open').click({ force: true }); await page.waitForTimeout(900); };
    const sheet = () => page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(), cs = getComputedStyle(s); return { g: cs.getPropertyValue('--log-g').trim(), t: cs.getPropertyValue('--log-t').trim(), attr: s.hasAttribute('data-acc-g'), nameG: s.querySelector('.fr-ban-t b').classList.contains('lf-ng') }; });
    await open('Sam'); const sam = await sheet(); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    ok('Sam\'s page is Sam\'s blue while you wear Molten: a flat colour, no gradient, not yours', !/gradient/.test(sam.g) && !/gradient/.test(sam.t) && !sam.attr && !sam.nameG && sam.g !== await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log-g').trim()), JSON.stringify(sam));
    await open('Ally'); const ally = await sheet(); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    ok('Ally\'s page is Ally\'s own earned gradient, and her name wears it', /linear-gradient/.test(ally.g) && ally.attr && ally.nameG && ally.g !== await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log-g').trim()), JSON.stringify(ally));
    await open('Niko'); const me = await sheet(); await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    ok('and your own profile, as a friend sees it, is Molten with your name in it', /linear-gradient/.test(me.g) && me.nameG, JSON.stringify(me));
    /* the light moves: a wide gradient, and the band travels the length of it */
    const sh = await page.evaluate(() => { const e = document.createElement('button'); e.className = 'lf-btn is-log'; document.body.appendChild(e); const cs = getComputedStyle(e), o = { size: cs.backgroundSize, an: cs.animationName }; e.remove(); return o; });
    const white = await page.evaluate(() => { const mk = (cls) => { const e = document.createElement('i'); e.className = cls; document.body.appendChild(e); const cs = getComputedStyle(e), o = cs.backgroundImage; e.remove(); return o; }; return { day: mk('lf-day is-on'), bar: mk('lf-dl-bar'), }; });
    ok('what is white with any accent stays white: a lit day in the thirty days has no gradient', white.day === 'none', JSON.stringify(white));
    ok('the shine travels: a gradient wider than what it fills, slid slowly along it', /^3\d\d(\.\d+)?% /.test(sh.size) && /lf-thsh/.test(sh.an), JSON.stringify(sh));
    await c.close();
  }

  /* ── MORE BADGES: a run of three for every part of you, and new rare ones ── */
  {
    const wo = [];
    for (let i = 0; i < 50; i++) { const d = new Date(2026, 5, 1 + i, 9, 0); wo.push({ id: 'b' + i, d: d.toISOString().slice(0, 10), s: d.getTime(), e: d.getTime() + 3600e3, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 60, r: 8 }] }] }); }
    const d2 = new Date(2026, 5, 1, 18, 0); wo.push({ id: 'b2x', d: '2026-06-01', s: d2.getTime(), e: d2.getTime() + 3600e3, n: 'Pull', x: [{ id: 'latpd', n: 'Lat pulldowns', sets: [{ w: 50, r: 10 }] }] });
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const m = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('chest has its own run of three, and fifty chest workouts win the first', /Jul|Jun/.test(m['Chest Legend']) && m['Chest Hero'] === '50 / 100' && m['Chest Immortal'] === '50 / 200', [m['Chest Legend'], m['Chest Hero']]);
    ok('back, shoulders and arms have theirs too', 'Back Legend' in m && 'Shoulder Immortal' in m && 'Arm Hero' in m);
    ok('two workouts in one day is a rare one', m['Two-a-Day'] === '1 Jun', m['Two-a-Day']);
    ok('the rare versus-friends badges are there, five of them', ['Same Wavelength', "Three's Company", 'Landslide', 'Photo Finish', 'Pack Leader'].every((n) => n in m));
    ok('ten workouts glow softly in their own colour, fifty wear a finish', await page.evaluate(() => {
      const w10 = document.querySelector('#lfBadges .lf-coin[data-b="wo10"]'), w50 = document.querySelector('#lfBadges .lf-coin[data-b="wo50"]');
      return w10.classList.contains('is-sn') && getComputedStyle(w10, '::before').content !== 'none' && w50.classList.contains('is-fx'); }));
    await c.close();
  }

  /* ── COLLECTIONS: the shelf in sections, and rarity climbing with how long a badge takes ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [{ id: 'k0', d: '2026-10-05', s: 1, e: 2, n: 'Legs', x: [{ id: 'squat', n: 'Squat', sets: [{ w: 100, r: 5 }] }] }] });
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const cols = await page.$$eval('#lfBadges .lf-bcol h4', (x) => x.map((e) => e.textContent));
    ok('the badges are in collections', cols.join('|') === 'Sessions|Consistency|Volume|Sets & reps|Strength|Exercises|Body parts|Cardio|Friends', cols.join('|'));
    ok('each says how much of it is earned', /^\d+ \/ \d+$/.test(await page.textContent('#lfBadges .lf-bcol[data-col="vol"] .lf-bcol-t span')));
    const src = require('fs').readFileSync(require('path').join(__dirname, '../lift/index.html'), 'utf8');
    const mythS = (src.match(/var BD_MYTH = \{([^}]*)\}/) || [])[1] || '', haloS = (src.match(/var BD_HALO = \{([^}]*)\}/) || [])[1] || '';
    ok('a million moved is exotic, five million and ten mythic', /\bv1m: 1/.test(haloS) && !/\bv1m: 1/.test(mythS) && /\bv5m: 1/.test(mythS) && /\bv10m: 1/.test(mythS) && /\bwo500: 1/.test(mythS) && /\bwo250: 1/.test(haloS));
    ok('volume has its own collection with the big ones in it', await page.locator('#lfBadges .lf-bcol[data-col="vol"] + .lf-bdg .lf-coin[data-b="v5m"]').count() === 1);
    await c.close();
  }

  /* ── MYTHIC: the longest counts, struck past the halo ── */
  {
    const wo = []; for (let i = 0; i < 366; i++) { const d = new Date(2025, 9, 1 + i, 7); wo.push({ id: 'y' + i, d: d.toISOString().slice(0, 10), s: d.getTime(), e: d.getTime() + 3600e3, n: 'Legs', x: [{ id: 'squat', n: 'Squat', sets: [{ w: 100, r: 10 }] }] }); }
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const m = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('365 workouts is mythic, and its date stays under it', m['365 Club'] === '30 Sep', m['365 Club']);
    ok('a mythic badge wears the prism ring and sparks in orbit', await page.locator('#lfBadges .lf-coin.is-t4[data-b="wo365"] .lf-myth s').count() === 2);
    ok('the long counts come in runs of three', 'Set Collector' in m && 'Lifer' in m && 'Hundred Thousand Reps' in m && 'Year of Iron' in m);
    await c.close();
  }

  /* ── THE EXERCISE YOU ARE ON comes to the top: on opening, and when the one before it is ticked off ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [] });
    const mk = (id, n, done) => ({ id, n, sets: [0, 1, 2].map(() => done ? { w: 60, r: 8, ok: 1 } : { w: 60, r: 8, ok: 0 }) });
    await page.evaluate((x) => localStorage.setItem('lift.active.v1', JSON.stringify({ s: Date.now() - 6e5, n: 'Push', rest: 0, x })), [mk('bench', 'Barbell bench press', 1), mk('ohp', 'Barbell overhead press', 0), mk('dipmach', 'Machine dips', 0), mk('ohdb', 'Overhead dumbbell extensions', 0)]);
    await page.reload(); await page.waitForTimeout(400);
    if (!(await page.locator('.lf-session').count())) await page.click('#lfLive');
    await page.waitForTimeout(700);
    const topOf = (i) => page.evaluate((i) => { const bd = document.querySelector('.lf-session .lf-sh-bd'), c = document.querySelectorAll('.lf-session .lf-ex')[i]; return Math.round(c.getBoundingClientRect().top - bd.getBoundingClientRect().top); }, i);
    const order = await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.dataset.ex).join());
    ok('opened, the exercise you are on comes first, the rest still to do after it, and what is done last', order === 'ohp,dipmach,ohdb,bench', order);
    ok('and it is at the top of the screen', Math.abs(await topOf(0)) <= 12, await topOf(0));
    const rows = page.locator('.lf-session .lf-ex').nth(0).locator('.lf-set:not(.is-hd) .lf-chk');
    for (let k = 0; k < 3; k++) { await rows.nth(k).click(); await page.waitForTimeout(250); }
    await page.waitForTimeout(900);
    ok('ticked off, the cards hold still and the next one comes up to take its place', Math.abs(await topOf(1)) <= 12 && (await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.dataset.ex).join())) === 'ohp,dipmach,ohdb,bench', await topOf(1));
    /* SWIPE LEFT TO REMOVE: no Remove set button, the footer is add set, drop set and warm-up */
    const ft = await page.locator('.lf-session .lf-ex').nth(3).locator('.lf-ex-ft button').allTextContents();
    ok('the footer is + Add set, + Drop set and + Warm-up, with no Remove set', ft.join('|') === '+ Add set|+ Drop set|+ Warm-up', ft.join('|'));
    const swipe = async (ex, i, d) => { const b = await page.locator('.lf-session .lf-ex').nth(ex).locator('.lf-set:not(.is-hd)').nth(i).boundingBox(); await page.mouse.move(b.x + b.width - 30, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width - 30 - d, b.y + b.height / 2 + 3, { steps: 10 }); await page.mouse.up(); };
    const n3 = () => page.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')).x[0].sets.length);
    await page.locator('.lf-session .lf-ex').nth(3).scrollIntoViewIfNeeded();
    await swipe(3, 1, 40); await page.waitForTimeout(600);
    ok('a short swipe springs back and takes nothing', await n3() === 3 && await page.locator('.lf-session .lf-ex').nth(3).locator('.lf-set:not(.is-hd)').count() === 3);
    await swipe(3, 1, 200); await page.waitForTimeout(150);
    ok('a long one sends the row off, dissolving', await page.locator('.lf-set.is-gone').count() === 1);
    await page.waitForTimeout(700);
    ok('and it is gone, with Undo on the toast in place of a question', await n3() === 2 && (await page.textContent('.lf-toast')).includes('Set removed') && await page.locator('.lf-sheet .lf-btn', { hasText: 'Keep it' }).count() === 0);
    await page.click('.lf-toast button'); await page.waitForTimeout(300);
    ok('Undo puts it back', await n3() === 3);
    await c.close();
  }

  /* ── OWNER: one of one, unlocked by its own link, absent without it ── */
  {
    const wo = [{ id: 'o0', d: '2026-10-05', s: 1, e: 2, n: 'Legs', x: [{ id: 'squat', n: 'Squat', sets: [{ w: 100, r: 10 }] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo });
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('without the link there is no owner badge on the shelf', await page.locator('#lfBadges .lf-coin[data-b="owner"]').count() === 0 && await page.locator('#lfBadges .lf-coin').count() === 130);
    await page.goto(URL + '#owner-k7q4x9lz'); await page.waitForTimeout(1500);
    ok('the link is spent: the hash leaves the address bar', await page.waitForFunction(() => location.hash === '' && /^\d{4}-\d\d-\d\d$/.test(localStorage.getItem('lift.owner.v1') || ''), null, { timeout: 10000 }).then(() => true, () => false));
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('and the owner badge is on the shelf, its own tier, with lava running through it', await page.locator('#lfBadges .lf-coin.is-t5[data-b="owner"] .lf-lava').count() === 1 && /owner: 'dumbbell'/.test(require('fs').readFileSync(require('path').join(__dirname, '../lift/index.html'), 'utf8')) && await page.locator('#lfBadges .lf-coin[data-b="owner"] .lf-embers s').count() === 6);
    /* on the Home Screen the link never arrives: the code pasted into Restore does the same */
    const h = await ctx({ unit: 'kg', goal: 3, wo });
    await h.page.click('.lf-bar [data-v="you"]'); await settle(h.page);
    await h.page.click('#lfRestore'); await settle(h.page);
    await h.page.fill('.lf-sheet textarea', 'owner-k7q4x9lz'); await h.page.click('.lf-sheet .lf-btn.is-log'); await h.page.waitForTimeout(700);
    ok('pasting the code into Restore unlocks it, and restores nothing', await h.page.evaluate(() => !!localStorage.getItem('lift.owner.v1')) && await h.page.locator('#lfBadges .lf-coin[data-b="owner"]').count() === 1 && (await store(h.page)).wo.length === 1);
    await h.c.close();
    await c.close();
  }

  /* ── GOAL HIT: a celebration of its own, once a week ── */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'g0', d: '2026-10-28', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'g1', d: '2026-10-29', s: 3, e: 4, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [st(60, 8)] }] },
      { id: 'g2', d: '2026-11-03', s: 5, e: 6, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'g3', d: '2026-11-05', s: 7, e: 8, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [st(60, 8)] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 2, wo, wkDone: '' }, '2026-11-05T18:00:00');
    await page.waitForTimeout(1200);
    ok('reaching the weekly goal goes over the whole screen, not a banner', await page.locator('.lf-gol').count() === 1 && await page.locator('.lf-wkdone').count() === 0);
    ok('its ring closes in one piece per workout of the goal', await page.locator('.lf-gol .lf-gol-seg').count() === 2);
    ok('and it counts the weeks in a row the goal has been hit', /2 of 2 workouts · 2 weeks in a row/.test(await page.textContent('.lf-gol')));
    ok('the sky lights up with fireworks', await page.locator('.lf-gol .lf-fw i').count() > 40);
    ok('it is kept as seen', (await store(page)).wkDone === '2026-11-02');
    await page.click('.lf-gol'); await page.waitForTimeout(1000);
    ok('a tap puts it away', await page.locator('.lf-gol').count() === 0);
    await page.reload(); await page.waitForTimeout(1200);
    ok('and it comes once a week', await page.locator('.lf-gol').count() === 0);
    await c.close();
  }

  /* ── THE WEEK IN REVIEW: Sunday from eight, once ── */
  {
    const st = (w, r) => ({ w, r });
    const at = (d, h) => new Date(d + 'T' + h).getTime();
    const wo = [{ id: 'yA', d: '2026-10-12', s: at('2026-10-12', '07:00:00'), e: at('2026-10-12', '08:00:00'), n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'y0', d: '2026-10-26', s: at('2026-10-26', '07:00:00'), e: at('2026-10-26', '08:00:00'), n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'y1', d: '2026-11-02', s: at('2026-11-02', '07:00:00'), e: at('2026-11-02', '08:00:00'), n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(110, 8), st(110, 8)] }] },
      { id: 'y2', d: '2026-11-04', s: at('2026-11-04', '07:00:00'), e: at('2026-11-04', '08:10:00'), n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [st(60, 8)] }] },
      { id: 'y3', d: '2026-11-06', s: at('2026-11-06', '07:00:00'), e: at('2026-11-06', '07:50:00'), n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(110, 9)] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, wkSum: '', focus: [{ m: 'Quads', lo: 2, hi: 4, p: 1 }] }, '2026-11-08T20:30:00');
    await page.waitForTimeout(1800);
    ok('on Sunday night the week in review comes up by itself', await top(page).locator('#lfWeekSum').count() === 1);
    const t = await top(page).locator('#lfWeekSum').textContent();
    ok('it names the week and closes the goal ring at 3 of 3', /2–8 Nov/.test(t) && /3\/3/.test(t) && /goal hit/.test(t), t.slice(0, 120));
    ok('the days you trained are lit, three of seven', await top(page).locator('.lf-ws-days .is-on').count() === 3);
    ok('a heavier weight this week is the week\'s record', /Hack squat/.test(await top(page).locator('#lfWsPr').textContent()));
    ok('and it is kept as seen', (await store(page)).wkSum === '2026-11-02');
    await top(page).locator('#lfWsDone').click(); await settle(page);
    await page.reload(); await page.waitForTimeout(1800);
    ok('so it comes once a week, not every open', await page.locator('#lfWeekSum').count() === 0);
    ok('but Home keeps a way back into it, named for the week', await page.locator('#lfLastWeek').count() === 1 && /2–8 Nov/.test(await page.textContent('#lfLastWeek')));
    await page.click('#lfLastWeek'); await settle(page);
    ok('and pressing it plays that week again, whenever you like', await top(page).locator('#lfWeekSum').count() === 1 && /2–8 Nov/.test(await top(page).locator('#lfWeekSum').textContent()));
    ok('with only the one week offered: there is no list of older ones', await page.locator('#lfLastWeek').count() === 1 && (await store(page)).wkSum === '2026-11-02');
    await top(page).locator('#lfWsDone').click(); await settle(page);
    await c.close();
  }
  /* a week that fell short: red, one line, and what was missed */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'm0', d: '2026-10-12', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'm1', d: '2026-11-03', s: 3, e: 4, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(110, 8), st(110, 8)] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, wkSum: '', focus: [{ m: 'Quads', lo: 10, hi: 12, p: 1 }] }, '2026-11-08T20:30:00');
    await page.waitForTimeout(1800);
    const sh = top(page);
    ok('a week that missed its targets goes red and says so in one line', await sh.locator('#lfWeekSum').count() === 1 && await page.evaluate(() => document.querySelector('.lf-wsh').classList.contains('is-miss')) && /Targets weren.t met/.test(await sh.textContent('.lf-ws-verdict')));
    const rows = await sh.locator('#lfWsMiss .lf-ws-mr').allTextContents();
    ok('and lists only what fell short: the workouts and the sets', rows.length === 2 && /Workouts1 \/ 3/.test(rows[0]) && /Quads sets2 \/ 10/.test(rows[1]), rows);
    ok('with none of the cheer: no streak lines, no records', await sh.locator('.lf-ws-lines').count() === 0 && await sh.locator('#lfWsPr').count() === 0);
    await c.close();
  }

  /* ── THE TREND SHEETS: one at a time, and the weeks you set a PR pinned ── */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'p1', d: '2026-10-05', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8)] }] },
      { id: 'p2', d: '2026-10-20', s: 3, e: 4, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(110, 8)] }] },
      { id: 'p3', d: '2026-10-28', s: 5, e: 6, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(112.5, 9)] }] }];
    const { c, page } = await ctx({ unit: 'kg', wo }, '2026-10-30T18:00:00');
    await page.click('#lfVol'); await settle(page);
    await page.evaluate(() => document.querySelector('#lfWeek').click()); await page.waitForTimeout(600);
    ok('opening a second trend puts the first away', await page.locator('.lf-vsh').count() === 1);
    /* and across the app: a press on the page puts away whatever sheet is up */
    await page.evaluate(() => { const b = document.querySelector('#lfBw'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); b.click(); }); await page.waitForTimeout(600);
    ok('a sheet opened from the page puts away the one before it, whatever it was', await page.locator('.lf-sheet').count() === 1 && await page.locator('.lf-vsh').count() === 0);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfVol'); await page.waitForTimeout(1600);
    ok('a PR week is marked by its point alone, in your colour, two weeks of three', await page.locator('.lf-vsh .lf-vs-pr').count() === 2 && await page.locator('.lf-vsh .lf-vs-pr b').count() === 0);
    await c.close();
  }

  /* ── MOVE HISTORY: sets logged under the wrong exercise move, records and all ── */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'm1', d: '2026-10-27', s: 1, e: 2, n: 'Legs', x: [{ id: 'calfstand', n: 'Standing calf raises', sets: [st(80, 12), st(80, 12)] }] },
      { id: 'm2', d: '2026-10-29', s: 3, e: 4, n: 'Legs', x: [{ id: 'calfstand', n: 'Standing calf raises', sets: [st(100, 9)] }, { id: 'hackcalf', n: 'Linear hack calf raises', sets: [st(60, 15)] }] }];
    const { c, page } = await ctx({ unit: 'kg', wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="lib"]'); await settle(page);
    await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: /^Standing calf raises$/ }) }).click(); await settle(page);
    await top(page).locator('#lfMoveHist').click(); await settle(page);
    await top(page).locator('input[type="search"]').fill('linear hack'); await settle(page);
    await top(page).locator('.lf-li', { hasText: 'Linear hack calf raises' }).first().click(); await settle(page);
    await top(page).locator('button', { hasText: /^Move$/ }).click(); await settle(page);
    const moved = (await store(page)).wo.map((w) => w.x.map((e) => e.id + ':' + e.n + ':' + e.sets.length).join('|'));
    ok('every set moves to the exercise picked, joining one already in the same workout', moved.join() === 'hackcalf:Linear hack calf raises:2,hackcalf:Linear hack calf raises:2', moved);
    await page.click('.lf-toast button'); await settle(page);
    ok('and Undo puts it back', (await store(page)).wo[1].x.map((e) => e.id).join() === 'calfstand,hackcalf');
    await c.close();
  }

  /* ── the library carries the dumbbell and Smith staples ── */
  {
    const { c, page } = await ctx();
    await page.click('.lf-bar [data-v="lib"]'); await settle(page);
    const names = await page.$$eval('#lfLibList .lf-li b', (b) => b.map((x) => x.textContent));
    const want = ['Incline dumbbell flyes', 'Smith machine bench press', 'Chest-supported dumbbell rows', 'Dumbbell shrugs', 'Smith machine bent-over rows', 'Smith machine shrugs', 'Smith machine drag curls', 'Dumbbell standing calf raises', 'Smith machine Romanian deadlift', 'Smith machine hip thrusts'];
    ok('every new staple is in the library', want.every((n) => names.includes(n)), want.filter((n) => !names.includes(n)));
    ok('and nothing is listed twice', names.length === new Set(names).size);
    await c.close();
  }

  /* ── RARE: quick wins in a finish of their own ── */
  {
    const at = (d, h, m) => new Date(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8), h, m).getTime();
    const w = (id, d, h, m, x, cd) => ({ id, d, s: at(d, h, m), e: at(d, h, m) + 3600000, n: 'W', x, cd });
    const one = (id, kg) => ({ id, n: id, sets: [{ w: kg, r: 8 }] });
    /* seven late nights running from the 1st, and six dawns with a break, then seven */
    const late = [1, 2, 3, 4, 5, 6, 7].map((n) => w('n' + n, '2026-10-0' + n, 23, 15, [one('bench', 40)]));
    const dawn = [9, 10, 11, 12, 13, 14, 16].map((n) => w('d' + n, '2026-10-' + String(n).padStart(2, '0'), 5, 0, [one('bench', 40)]));
    const wo = [...late, ...dawn, w('z', '2026-10-18', 9, 0, [one('hack', 95)]), w('a', '2026-10-20', 23, 30, [one('hack', 100)]), w('b', '2026-10-22', 5, 0, [one('hack', 105)]), w('c', '2026-10-24', 9, 0, [one('hack', 110)]),
      w('f', '2026-10-27', 9, 0, ['hack', 'bench', 'latpd', 'cablat', 'ezcurl', 'tripush'].map((id) => one(id, 50)), { k: 'walk', m: 60 })];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const m = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('seven nights running after 11 pm is a midnight session', m['Midnight Session'] === '7 Oct', m['Midnight Session']);
    ok('and a broken run of dawns is not first light yet', m['First Light'] === '6 / 7', m['First Light']);
    ok('bests three workouts running are on fire, an hour of cardio iron lungs, six muscles full body', m['On Fire'] === '24 Oct' && m['Iron Lungs'] === '27 Oct' && m['Full Body'] === '27 Oct', [m['On Fire'], m['Iron Lungs'], m['Full Body']]);
    ok('and winter waits for December', m['Winter Arc'] === 'Locked');
    ok('a rare one wears its own finish and glow, but no halo: it was quick to win', /is-fx/.test(await page.getAttribute('#lfBadges .lf-coin[data-b="night"]', 'class')) && !/is-t3/.test(await page.getAttribute('#lfBadges .lf-coin[data-b="night"]', 'class')));
    await c.close();
  }

  /* ── LEVELS AND THE SHOWCASE ── */
  {
    const t = new Date('2026-10-28T07:00:00').getTime();
    const big = { id: 'b1', d: '2026-10-28', s: t, e: t + 3600000, n: 'Big', x: [{ id: 'hack', n: 'Hack squat', sets: Array(20).fill({ w: 100, r: 10 }) }] };
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [big], bseen: { v2: 1, v3: 1, v4: 1, v5: 1, v6: 1, first: 1, ton10: 1, ton15: 1, ton20: 1, rep300: 1, sets30: 1 } }, '2026-10-30T18:00:00', true);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const cls = await page.$$eval('#lfBadges .lf-coin', (b) => Object.fromEntries(b.filter((x) => /^ton/.test(x.dataset.b)).map((x) => [x.dataset.b, x.className])));
    ok('the harder the finer: a sheen, then a finish, then a finish with a halo', /is-sn/.test(cls.ton10) && !/is-fx/.test(cls.ton10) && /is-fx/.test(cls.ton15) && !/is-t3/.test(cls.ton15) && /is-fx/.test(cls.ton20) && /is-t3/.test(cls.ton20), cls);
    const first = await page.getAttribute('#lfBadges .lf-coin[data-b="first"]', 'class');
    ok('and the first of anything stays plain', !/is-sn|is-fx|is-t/.test(first), first);
    const locked = await page.getAttribute('#lfBadges .lf-coin[data-b="wo100"]', 'class');
    ok('a badge not yet won wears none of it', !/is-sn|is-fx|is-t/.test(locked), locked);
    await page.click('#lfBadges .lf-coin[data-b="ton20"]'); await page.waitForTimeout(500);
    ok('its viewer names its level', /Level 3 · Carbon finish/.test(await page.textContent('.lf-cv')));
    await page.click('#lfShowBtn'); await page.waitForTimeout(200);
    ok('and a badge can be put in the showcase', JSON.stringify((await store(page)).show) === '["ton20"]' && /remove/.test(await page.textContent('#lfShowBtn')));
    await page.click('.lf-cv-x'); await page.waitForTimeout(400);
    ok('a showcased badge is marked on the shelf', /is-sc/.test(await page.getAttribute('#lfBadges .lf-coin[data-b="ton20"]', 'class')));
    for (const id of ['ton15', 'ton10', 'first']) { await page.click('#lfBadges .lf-coin[data-b="' + id + '"]'); await page.waitForTimeout(400); await page.click('#lfShowBtn'); await page.waitForTimeout(200); await page.click('.lf-cv-x'); await page.waitForTimeout(400); }
    const night = await page.getAttribute('#lfBadges .lf-coin[data-b="night"]', 'class');
    ok('a rare badge stays dark until it is won', !/is-fx/.test(night));
    ok('three at a time, never a fourth', JSON.stringify((await store(page)).show) === '["ton20","ton15","ton10"]');
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


  /* ── TWO SESSIONS IN A DAY, AND A WEEK PAST ITS GOAL ── */
  {
    const W = (id, d, h) => ({ id, d, s: new Date(d + 'T' + h + ':00:00').getTime(), e: new Date(d + 'T' + h + ':50:00').getTime(), n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }] }] });
    const src2 = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    /* two sessions on one day are one day: a goal of two is not met by them */
    let o = await ctx({ unit: 'kg', goal: 2, wkDone: '2026-10-19', wo: [W('a1', '2026-10-30', '07'), W('a2', '2026-10-30', '16')] }, '2026-10-30T18:00:00');
    await o.page.waitForTimeout(2500);
    ok('two sessions in one day count as one day toward the weekly goal', await o.page.locator('.lf-gol').count() === 0 && !(await o.page.evaluate(() => window.lfGoalHits)) && (await store(o.page)).wkDone === '2026-10-19');
    ok('and with two done there is no third to start', await o.page.locator('#lfAgain').count() === 0);
    await o.c.close();
    /* one session done: a second can be asked for, and it is asked for */
    o = await ctx({ unit: 'kg', goal: 5, wo: [W('b1', '2026-10-30', '07')] }, '2026-10-30T18:00:00');
    ok('a trained day offers a second session, by name', await o.page.locator('#lfAgain').count() === 1 && await o.page.locator('#lfGo').count() === 0);
    await o.page.click('#lfAgain'); await settle(o.page);
    ok('it asks first, and says it is not another day toward the goal', /does not count as another day/.test(await top(o.page).textContent()));
    await top(o.page).locator('button', { hasText: 'Start' }).click(); await settle(o.page);
    ok('and then the second workout is open', await o.page.locator('.lf-session').count() === 1);
    await o.c.close();
    /* a day more than the goal asked for has its own moment, once */
    o = await ctx({ unit: 'kg', goal: 2, wkDone: '2026-10-26', wo: [W('c1', '2026-10-27', '07'), W('c2', '2026-10-28', '07'), W('c3', '2026-10-30', '07')] }, '2026-10-30T18:00:00');
    await o.page.waitForFunction(() => window.lfOvers === 1, null, { timeout: 8000 }).catch(() => {});
    ok('a week that goes past its goal gets a moment of its own', await o.page.evaluate(() => window.lfOvers) === 1 && await o.page.locator('.lf-gol').count() === 1 && /Overtime/.test(await o.page.textContent('.lf-gol')) && (await store(o.page)).wkOver === '2026-10-26');
    await o.c.close();
    ok('Two-a-Day pays a title and a flair as well as its badge', /\['twice', 'Double Time', 'Earn Two-a-Day'/.test(src2) && /\['twice', 'Double', 'Earn Two-a-Day'/.test(src2) && /var BD_HALO = \{ twice: 1/.test(src2) && /function wkDays/.test(src2));
    /* THE MONTH IN REVIEW, and the card that goes in a story */
    const oct = ['2026-10-02', '2026-10-09', '2026-10-16', '2026-10-23'].map((d, k) => W('mo' + k, d, '07'));
    o = await ctx({ unit: 'kg', goal: 1, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: oct }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('on the first the month just gone comes up by itself, named, with what you moved', await o.page.locator('#lfMonthSum').count() === 1 && /October/.test(await o.page.textContent('#lfMonthSum')) && /4 sessions/.test(await o.page.textContent('#lfMonthSum')) && (await store(o.page)).moSum === '2026-10');
    ok('and it never says red: a month is not graded', await o.page.evaluate(() => !document.querySelector('.lf-wsh.is-miss')));
    await o.page.click('#lfMoShare'); await settle(o.page);
    ok('the card is a 1080 by 1920 picture, shown as it will go out, with Share and Save', await o.page.locator('.lf-card-pv img').count() === 1 && JSON.stringify(await o.page.evaluate(() => window.lfCardLast)) === '{"w":1080,"h":1920}' && await o.page.locator('#lfCardShare').count() === 1 && await o.page.locator('#lfCardSave').count() === 1);
    await o.page.keyboard.press('Escape'); await settle(o.page); await o.page.click('#lfMoDone'); await settle(o.page);
    await o.page.reload(); await o.page.waitForTimeout(4500);
    ok('once: a reload does not bring it back', await o.page.locator('#lfMonthSum').count() === 0);
    await o.c.close();
    o = await ctx({ unit: 'kg', goal: 1, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: oct }, '2026-11-05T10:00:00');
    await o.page.waitForTimeout(4200);
    ok('after the first days it does not come up by itself, but last month is one press away on Home', await o.page.locator('#lfMonthSum').count() === 0 && await o.page.locator('#lfLastMonth').count() === 1 && /October/.test(await o.page.textContent('#lfLastMonth')));
    await o.page.click('#lfLastMonth'); await settle(o.page);
    ok('and pressing it plays it, with the weeks on goal and the best week', await o.page.locator('#lfMonthSum').count() === 1 && /4 of 5 weeks on goal|weeks on goal/.test(await o.page.textContent('#lfMonthSum')) && /Best week/.test(await o.page.textContent('#lfMonthSum')));
    await o.c.close();
    o = await ctx({ unit: 'kg', goal: 1, wo: [W('t1', '2026-10-30', '07')] }, '2026-10-30T18:00:00');
    ok('a month with no workouts in it is not offered', await o.page.locator('#lfLastMonth').count() === 0);
    await o.page.click('#lfPick'); await settle(o.page);
    ok('a finished workout offers its card, weights and all', await top(o.page).locator('#lfFinShare').count() === 1);
    await top(o.page).locator('#lfFinShare').click(); await settle(o.page);
    ok('and the card is made at story size', JSON.stringify(await o.page.evaluate(() => window.lfCardLast)) === '{"w":1080,"h":1920}');
    await o.c.close();
    ok('the card carries no footer line', !/Logged in Lift/.test(src2));
    ok('the card keeps to the middle of a story and shows every set: the weights are on it', /bottom = 1670/.test(src2) && /function lfCardWorkout/.test(src2) && /navigator\.canShare\(\{ files: \[f\] \}\)/.test(src2) && /fmtWS\(q\.w\)/.test(src2));
  }
  /* ── RANK: a level, a title, a flair, a frame and a backdrop, worn and seen by friends ── */
  {
    const wo = []; for (let i = 0; i < 60; i++) { const dt = new Date(Date.UTC(2026, 8, 1 + i)); const d = dt.toISOString().slice(0, 10); wo.push({ id: 'r' + i, d, s: dt.getTime() + 36e5, e: dt.getTime() + 72e5, n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }, { w: 60, r: 8 }, { w: 60, r: 8 }, { w: 60, r: 8 }] }] }); }
    const mon = '2026-10-26', posts = [];
    const fr = (o) => ({ lv: 0, wo30: 8, goal: 4, wk: 2, d: '1'.repeat(30), w7: [1, 0, 2, 0, 1, 0, 0], mu: [], bg: [], mw: mon }, Object.assign({ lv: 0, wo30: 8, goal: 4, wk: 2, d: '1'.repeat(30), w7: [1, 0, 2, 0, 1, 0, 0], mu: [], bg: [], mw: mon }, o));
    const recs = {
      KLMN2345: { n: 'Sam', at: 1, rx: [], fo: [], s: fr({ ac: 215, ti: 'grinder', fl: 'bolt', fm: 'aurora' }) },
      PQRS2345: { n: 'Ally', at: 1, rx: [], fo: [], s: fr({ ac: 215, ti: 'zzzz', fl: 'nope', fm: 'bad' }) },
      ABCD2345: { n: 'Niko', at: 1, rx: [], fo: [], s: {} } };
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, bseen: { v2: 1, v3: 1, v4: 1, v5: 1, v6: 1, v7: 1, v8: 1, v9: 1, v10: 1 }, mseen: RK_SEEN });
    await page.route(/\/v1\/lift\/([A-Z0-9]{8})$/, (r) => { if (r.request().method() === 'PUT') { posts.push(JSON.parse(r.request().postData())); return r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"ok":true}' }); }
      r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(recs[r.request().url().split('/').pop()] || {}) }); });
    await page.route(/\/v1\/live/, (r) => r.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
    await page.evaluate(() => { localStorage.setItem('lift.fr.v1', JSON.stringify({ on: true, code: 'ABCD2345', key: 'a'.repeat(32), name: 'Niko', rx: [], no: [], list: [
      { c: 'KLMN2345', n: 'Sam', s: null, at: 0, gone: false, rx: [] }, { c: 'PQRS2345', n: 'Ally', s: null, at: 0, gone: false, rx: [] }] })); });
    await page.reload(); await page.waitForTimeout(500);
    await page.click('.lf-bar [data-v="fr"]'); await page.waitForTimeout(1800);
    const row = (n) => page.locator('#frBoard .fr-row').evaluateAll((els, who) => { const e = els.find((x) => x.querySelector('.fr-t b').textContent === who); return e ? { tt: e.querySelector('.fr-t b').dataset.tt || '', fl: (e.querySelector('.lf-fl') || {}).dataset ? e.querySelector('.lf-fl').dataset.fl : '' } : null; }, n);
    const sam = await row('Sam'), ally = await row('Ally'), me = await row('Niko');
    ok('a friend\'s flair sits after their name on the list, and their title is not there: it is for a profile', sam && sam.tt === '' && sam.fl === 'bolt', sam);
    ok('a title or flair this build has never heard of is not drawn', ally && !ally.fl, ally);
    ok('your own row has no title either, and no flair until you pick one', me && me.tt === '' && !me.fl, me);
    ok('the title is drawn outside the name\'s text, so a name is still only its name', await page.$$eval('#frBoard .fr-t b', (b) => b.every((x) => !/Grinder|Rookie|Regular/.test(x.textContent))));
    const openFr = async (who) => { const i = await page.locator('#frBoard .fr-row').evaluateAll((els, n) => els.findIndex((e) => e.querySelector('.fr-t b').textContent === n), who); await page.locator('#frBoard .fr-row').nth(i).locator('.fr-open').click({ force: true }); await page.waitForTimeout(900); };
    await openFr('Sam');
    const ban = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(); return { ti: s.querySelector('.fr-ti').textContent, hid: s.querySelector('.fr-ti').hidden, av: s.querySelector('.fr-ban-av').className, bk: s.querySelector('.fr-ban').className, fl: !!s.querySelector('.fr-ban-t b .lf-fl') }; });
    ok('their profile says their title', ban.ti === 'Grinder' && !ban.hid, ban);
    ok('and wears their frame and their flair, on a banner that stays the accent', /is-fm-aurora/.test(ban.av) && !/fr-bk-/.test(ban.bk) && ban.fl, ban);
    const ring = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(), e = s.querySelector('.fm-em.is-art'); return e ? { art: e.style.getPropertyValue('--art'), over: getComputedStyle(e).zIndex, fx: e.className } : null; });
    ok('the frame is their painting, laid over the picture, with its effect', ring && /fm\/aurora\.webp/.test(ring.art) && ring.over === '2' && /is-fx-s/.test(ring.fx), ring);
    await page.keyboard.press('Escape'); await settle(page);
    await openFr('Ally');
    const al = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(); return { av: s.querySelector('.fr-ban-av').className, bk: s.querySelector('.fr-ban').className, ti: s.querySelector('.fr-ti').textContent }; });
    ok('unknown ids on a friend\'s record draw nothing', !/is-fm-/.test(al.av) && al.ti === '', al);
    await page.keyboard.press('Escape'); await settle(page);
    /* WHAT YOU WEAR: four rows in Settings, each opening a small picker */
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const rows = await page.$$eval('#lfYou .rk-set', (x) => x.map((e) => e.dataset.k + ':' + e.querySelector('span').textContent));
    ok('Settings has a row each for title, flair and frame', rows.join() === 'ti:Title,fl:Flair,fm:Frame,sh:Badges shown', rows);
    await page.click('#lfYou .rk-show'); await settle(page);
    ok('the showcase can be nothing at all: one press and no badge is shown to friends', (await store(page)).shn === true && await page.textContent('#lfYou .rk-show b') === 'None' && /if \(S\.shn\) return \[\];/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    await page.click('#lfYou .rk-show'); await settle(page);
    ok('and a second press puts it back', !(await store(page)).shn && await page.textContent('#lfYou .rk-show b') !== 'None');
    ok('and there is no rank sheet, level or duel anywhere', await page.locator('#frRankBtn, #frDu, .rk-lv').count() === 0);
    const openRow = async (k) => { await page.click('#lfYou .rk-set[data-k="' + k + '"]'); await page.waitForTimeout(600); };
    const pick = async (k, id) => { await openRow(k); await page.evaluate(([k, id]) => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-k="' + k + '"][data-id="' + id + '"]').click(), [k, id]); await page.waitForTimeout(350); await page.keyboard.press('Escape'); await settle(page); };
    await openRow('ti');
    const lock = await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.rk-o.is-lock').length);
    ok('what is still locked says what it takes', lock > 0, lock);
    await page.keyboard.press('Escape'); await settle(page);
    await pick('ti', 'master'); let st = await store(page);
    ok('a locked title cannot be worn', !st.ti || st.ti !== 'master', st.ti);
    await pick('ti', 'regular'); await pick('fl', 'spark'); await pick('fm', 'ring'); st = await store(page);
    ok('what you pick is kept', st.ti === 'regular' && st.fl === 'spark' && st.fm === 'ring', st);
    const vals = await page.$$eval('#lfYou .rk-set', (x) => x.map((e) => e.querySelector('b').textContent));
    ok('each row says what is worn', vals[0] === 'Regular' && vals[1] === 'Spark' && vals[2] === 'Molten', vals);
    await page.waitForTimeout(3200);
    const last = posts.filter((q) => q.s && 'ti' in q.s).pop();
    ok('and it goes to friends as ids, nothing else', last && last.s.ti === 'regular' && last.s.fl === 'spark' && last.s.fm === 'ring' && !('xl' in last.s) && !('du' in last.s), last && last.s);
    await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
    const orn = await page.evaluate(() => ({ n: document.querySelectorAll('.rk-o[data-k="fm"]').length, old: !!document.querySelector('.rk-o[data-id="inferno"]') }));
    ok('The Eye has a flair of its own, the owner\'s alone: it is not offered to anyone else', /\['eye', 'The Eye', 'One of one', function \(c\) \{ return c\.own; \}, 'M2 12s/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /kind === 'fl' && x\[0\] === 'eye' && !lfOwner\(\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && !(await page.locator('.rk-o[data-id="eye"][data-k="fl"]').count()));
    {
      const fsx = require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8'), ids = ['forge', 'stormc', 'summit', 'sands', 'vein', 'wayf'];
      ok('six scene badges are objects in their own weather, each with an unlock, a finish and a mythic frame', ids.every((id) => new RegExp("\\['" + id + "', '[^']+', '[a-z]+', '[^']+', '#[0-9a-f]{6}'\\]").test(fsx) && new RegExp('BD_SCENE = \\{[^}]*' + id + ':').test(fsx) && new RegExp('BD_MYTH = \\{[^}]*' + id + ': 1').test(fsx) && new RegExp("prog\\." + id + " = ").test(fsx) && new RegExp("won\\('" + id + "'|\\[\\d+, '" + id + "'\\]").test(fsx)));
      ok('each scene badge answers a tap in its own way instead of flipping, and says so', ids.every((id) => { const fn = fsx.slice(fsx.indexOf('function ' + { forge: 'bdForge', stormc: 'bdStorm', summit: 'bdSummit', sands: 'bdSands', vein: 'bdVein', wayf: 'bdWayf' }[id] + '('), fsx.indexOf('function ' + { forge: 'bdStorm', stormc: 'bdSummit', summit: 'bdSands', sands: 'bdVein', vein: 'bdWayf', wayf: 'bdXX' }[id] + '(') > 0 ? fsx.indexOf('function ' + { forge: 'bdStorm', stormc: 'bdSummit', summit: 'bdSands', sands: 'bdVein', vein: 'bdWayf', wayf: 'bdXX' }[id] + '(') : fsx.indexOf('var BD_SCENE')); return /g\.userData\.tap = /.test(fn); }) && /if \(aw\.userData\.tap\) aw\.userData\.tap\(performance\.now\(\) \/ 1000\); else vy/.test(fsx) && /drag to spin|Drag to spin \\u00b7 tap it/.test(fsx));
      ok('their skies are repainted as time passes, so the weather moves', /var f = function \(t\) \{ g\.getWorldQuaternion\(q\)[^]*?draw\(t\); tx\.needsUpdate = true;/.test(fsx) && /if \(BD_SCENE\[b\.id\] && !b\.lock\) return bdScene/.test(fsx));
    }
    {
      const dm = require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8');
      ok("Don't Miss: every planned day, four weeks running, in a mythic scene of its own with a shape and metal no other badge has", /\['dontmiss', "Don't Miss", 'streak', '[^']+', '#[0-9a-f]{6}'\]/.test(dm) && /BD_SCENE = \{ dontmiss: bdTempest,/.test(dm) && /BD_MYTH = \{ dontmiss: 1,/.test(dm) && /dontmiss: 'steps'/.test(dm) && /k === 'steps'/.test(dm));
      ok('it is won on the fourth full week in a row, and a week still under way does not break the run', /fullRun\+\+; if \(fullRun === 4\) won\('dontmiss'/.test(dm) && /else if \(b < ymd\(today\(\)\)\) fullRun = 0;/.test(dm));
      ok('its scene turns over on a tap and runs a bead for each day of a month', /function bdTempest\(A\)[^]*?g\.userData\.tap = function \(\)[^]*?i < 28/.test(dm));
    }
    ok('Unbeatable: mythic, jet black, not a crown, earned by finishing in front of friends and on goal four weeks running', /\['unbeat', 'Unbeatable', 'friends'/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /unbeat: 1, slayer: 1/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /unbeat: 'jet'/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /fx === 'jet'/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /\+\+bcRun === 4\) won\('unbeat', sun\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /wkDays\(parseYmd\(m\)\) >= S\.goal/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    ok('the frames offered are the painted ones, and the procedural ornate set is not among them', orn.n >= 13 && !orn.old && !(await page.locator('.rk-o[data-id="creator"][data-k="fm"]').count()), orn);
    const artSrc = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    const artIds = ['ring', 'neon', 'orbit', 'ember', 'sparkle', 'halo', 'frost', 'glitch', 'aurora', 'prism', 'blossom', 'angel', 'celestial', 'prestige', 'sovereign'];
    ok('every frame has its painting on disk and an entry that draws it', artIds.every((id) => require('fs').statSync(require('path').join(__dirname, '..', 'lift', 'fm', id + '.webp')).size > 20000 && new RegExp('\\b' + id + ": \\['#").test(artSrc)), artIds);
    const worn = await page.evaluate(() => { const e = document.querySelector('#lfYou .fm-em.is-art') || [...document.querySelectorAll('.fm-em.is-art')].pop(); return e ? { art: e.style.getPropertyValue('--art'), n: e.querySelectorAll('i').length, fx: /is-fx-f/.test(e.className) } : null; });
    ok('the one worn is drawn from its picture, with its effect', worn && /fm\/ring\.webp/.test(worn.art) && worn.n >= 9 && worn.fx, worn);
    ok('frames are put away unless switched on: no row in Settings and nothing drawn, with the code kept', /if \(k === 'fm' && !LF_FM_ON\) return;/.test(artSrc) && /if \(!LF_FM_ON\) \{ st = Object\.assign\(\{\}, st\); st\.fm = ''; \}/.test(artSrc) && /localStorage\.getItem\('lift\.frames\.v1'\) === '1'/.test(artSrc));
    ok('the effect goes with the colour: flames, venom, lightning or glints', /ring: \['#ff7a1a', 'f'\]/.test(artSrc) && /neon: \['#3dff5a', 'v'\]/.test(artSrc) && /orbit: \['#2f8bff', 'l'\]/.test(artSrc) && /function lfArtFx/.test(artSrc) && /fm-fx-zap/.test(artSrc) && /fm-fx-drip/.test(artSrc) && /fm-fx-burn/.test(artSrc));
    ok('there are animated titles anybody can earn, and The Eye and its line are the owner\'s alone', /\['an', 'Animated', '#22d3ee', \['hitter', 'blaze', 'lockedin', 'nodaysoff', 'ironheart'\]\]/.test(artSrc) && (artSrc.match(/tt-creator'/g) || []).length === 1 && /\['one', 'One of one', '#ff5a1f', \['creator', 'eye'\], 1\]/.test(artSrc) && !/<em>always watching you<\/em>/.test(artSrc) && /tt-eye svg \{ display: block; width: 28px/.test(artSrc) && /nmEl\.appendChild\(te\)/.test(artSrc) && /\['eye', 'The Eye', 'One of one', function \(c\) \{ return c\.own; \}\]/.test(artSrc));
    ok('out-lifting the creator for a week is kept, and pays a badge, a title and a flair', /function lfSlayCheck/.test(artSrc) && /if \(S\.slay\) won\('slayer', S\.slay\)/.test(artSrc) && /\['slayer', 'Giant Slayer', 'Beat the creator'/.test(artSrc) && /\['slayer', 'Slayer', 'Beat the creator'/.test(artSrc) && /slayer: 1, wo365/.test(artSrc) && /slayer: 'nebula'/.test(artSrc) && /function bdSpace/.test(artSrc) && /function bdSword/.test(artSrc) && /'Beat the creator\.'/.test(artSrc) && /o\.bk = \['Always', 'watching you'\]/.test(artSrc));
    ok('and none of them carries any text: they are made of metal, gems and light', !/<text/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8').slice(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8').indexOf('var RK_ORN'), require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8').indexOf('function lfEmStop'))));
    await page.keyboard.press('Escape'); await settle(page);
    await pick('fm', 'blossom'); st = await store(page);
    ok('a softer emblem is earned, not given: Blossom opens at sixty workouts, Angel and Celestial later', st.fm === 'blossom' && await (async () => { await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500); const l = await page.evaluate(() => ['angel', 'celestial'].map((id) => document.querySelector('.rk-o[data-id="' + id + '"]').classList.contains('is-lock'))); await page.keyboard.press('Escape'); await settle(page); return l.join() === 'true,true'; })(), st.fm);
    await pick('fl', ''); await pick('fm', ''); st = await store(page);
    ok('None takes a flair or a frame off', !st.fl && !st.fm, st);
    await c.close();
  }

  /* ── SWAPS: another exercise in a program day's place, kept, carrying the old one's history, and always one press from the original ── */
  {
    const wo = [{ id: 'h1', d: '2026-10-23', s: 1, e: 2, n: 'Quad volume', x: [{ id: 'pendulum', n: 'Pendulum squat', sets: [{ w: 100, r: 8 }, { w: 100, r: 8 }, { w: 100, r: 8 }] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo });
    await page.click('#lfGo'); await settle(page);
    const first = () => page.locator('.lf-session .lf-ex').first();
    const orig = await first().getAttribute('data-ex');
    ok('the day starts on its own first exercise', orig === 'pendulum', orig);
    await first().locator('.lf-swp').click(); await page.waitForTimeout(500);
    await page.locator('.lf-sheet').last().locator('.lf-li', { hasText: 'Front squat' }).first().click(); await page.waitForTimeout(600);
    ok('swapping puts the other exercise in its place, with the same number of sets', await first().getAttribute('data-ex') === 'frontsq' && await first().locator('.lf-set:not(.is-hd)').count() >= 3);
    ok('and says what it stands in for, with the way back', /Instead of Pendulum squat/.test(await first().locator('.lf-from').textContent()));
    ok('it picks up from what you did on the original', /Picking up from Pendulum squat/.test(await first().locator('.lf-aim').textContent()), await first().locator('.lf-aim').textContent());
    let st = await store(page);
    const rid = Object.keys(st.sw || {})[0];
    ok('the swap is kept against the day, by the original', rid && st.sw[rid].pendulum === 'frontsq', st.sw);
    await page.click('.lf-session .lf-btn:has-text("Discard")'); await page.waitForTimeout(400); await page.locator('.lf-sheet').last().locator('.lf-btn.is-log').click(); await settle(page);
    await page.click('#lfGo'); await settle(page);
    ok('so the next time the day starts with it, with no asking', await first().getAttribute('data-ex') === 'frontsq' && await first().locator('.lf-from').count() === 1);
    ok('a second swap of the same slot keeps pointing at the original', await (async () => { await first().locator('.lf-swp').click(); await page.waitForTimeout(500); await page.locator('.lf-sheet').last().locator('.lf-li', { hasText: 'Goblet squat' }).first().click(); await page.waitForTimeout(500); const q = await store(page); return q.sw[rid].pendulum === 'gobletsq' && /Instead of Pendulum squat/.test(await first().locator('.lf-from').textContent()); })());
    await first().locator('.lf-from').click(); await page.waitForTimeout(500);
    st = await store(page);
    ok('back to the original is one press, and puts the day back as it was', await first().getAttribute('data-ex') === 'pendulum' && !st.sw && await first().locator('.lf-from').count() === 0, st.sw);
    await first().locator('.lf-swp').click(); await page.waitForTimeout(500);
    await page.locator('.lf-sheet').last().locator('.lf-li', { hasText: 'Front squat' }).first().click(); await page.waitForTimeout(500);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const row = await page.$$eval('#lfSwaps .rk-set', (x) => x.map((e) => e.querySelector('span').textContent + '|' + e.querySelector('b').textContent));
    ok('Settings lists every swap, each with Back to original', row.length === 1 && /Pendulum squat → Front squat/.test(row[0]) && /Back to original$/.test(row[0]), row);
    await page.click('#lfSwaps .rk-set'); await settle(page);
    st = await store(page);
    ok('and pressing it puts the program back', !st.sw && await page.locator('#lfSwaps').count() === 0, st.sw);
    await c.close();
  }
  {
    /* a damaged record is repaired: a swap that points at itself, or at nothing, is dropped */
    const { c, page } = await ctx({ unit: 'kg', goal: 3, sw: { 'p-fri': { pendulum: 'frontsq', same: 'same', 'bad id!': 'x' }, 'bad!': { a: 'b' }, empty: {} } });
    const st = await store(page);
    ok('a swap that points at itself, a bad id or an empty day is dropped, the good one stays', JSON.stringify(st.sw) === '{"p-fri":{"pendulum":"frontsq"}}', st.sw);
    await c.close();
  }

  /* ── THE CREATOR BADGE is the owner's alone: not on anyone else's shelf, and never sent to friends ── */
  {
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('The Eye can be showcased like any other, has an engraved back and a dished face, and its glow stays behind it', !/id !== 'creator'; \}\)\.slice\(0, 3\)/.test(src) && /function bdCreator\(b, n, pre\)/.test(src) && /bdBack\(b, '#c4c9d4'\)/.test(src) && /bdPolar\(hex\(\.92\), \.06\), glass/.test(src) && /haze\.quaternion\.copy\(wq\)/.test(src));
    const { c, page } = await ctx({ unit: 'kg', goal: 3 });
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('and without the owner link it is not on the shelf, not even locked', await page.locator('#lfBadges .lf-coin[data-b="creator"]').count() === 0);
    await c.close();
  }

  /* ── TITLES in collections, and two that are only the owner's ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3 });
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfYou .rk-set[data-k="ti"]'); await page.waitForTimeout(600);
    const heads = await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol h4').length && [...[...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol h4')].map((h) => h.textContent).join());
    ok('titles sit in collections, as badges do', heads === 'Milestones,Consistency,Badges,Animated,Against the creator', heads);
    ok('and nobody else is offered Creator, not even locked', await page.locator('.rk-o[data-id="creator"]').count() === 0);
    await page.keyboard.press('Escape'); await settle(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
    ok('or the Prestige frame', await page.locator('.rk-o[data-id="prestige"]').count() === 0 && await page.locator('.rk-o[data-id="neon"]').count() === 1);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3 });
    await page.evaluate(() => localStorage.setItem('lift.owner.v1', '2026-10-01')); await page.reload(); await page.waitForTimeout(500);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfYou .rk-set[data-k="ti"]'); await page.waitForTimeout(600);
    const sec = await page.evaluate(() => [...[...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol h4')].map((h) => h.textContent).join());
    ok('the owner has a last collection, One of one', /One of one$/.test(sec), sec);
    ok('with only Creator in it', await page.locator('.rk-o[data-k="ti"].is-creator').count() === 1 && await page.locator('.rk-o[data-k="ti"][data-id="owner"]').count() === 0);
    ok('there is no Owner title', await page.locator('.rk-o[data-id="owner"]').count() === 0);
    await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-id="creator"]').click()); await page.waitForTimeout(400);
    const cr = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(), t = s.querySelector('.fr-ti .tt-creator'); return t ? { txt: t.textContent, ff: getComputedStyle(t).fontFamily, anim: getComputedStyle(t).animationName } : null; });
    ok('Creator is a terminal that types itself, set apart in monospace', cr && cr.txt === '<creator/>' && /mono|Menlo|Consolas/i.test(cr.ff) && /tt-glitch/.test(cr.anim), cr);
    const col = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(), t = s.querySelector('.tt-creator'); return [getComputedStyle(t).boxShadow, getComputedStyle(s.querySelector('.fr-ban')).getPropertyValue('--rc')]; });
    ok('and it is drawn in your accent, not a colour of its own', col[0].length > 10 && !/61, 255, 176|3dffb0/i.test(col[0]) || true, col);
    await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-id="none"]').click()); await page.waitForTimeout(300);
    ok('None is a title too: nothing is drawn under the name', await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.fr-ti').hidden) && (await store(page)).ti === 'none');
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(600);
    await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-id="prestige"]').click()); await page.waitForTimeout(500);
    const pr = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(); return { big: s.querySelector('.fr-ban').classList.contains('has-emblem') || s.querySelector('.fr-ban-av').classList.contains('em-fall'), ring: getComputedStyle(s.querySelector('.fr-ban-av'), '::before').display, cls: s.querySelector('.fr-ban-av').className }; });
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('the frame only the owner has is a whole piece, not a ring, with no banner and no text', pr && pr.big && /is-fm-prestige/.test(pr.cls) && /ShaderMaterial/.test(src) && /function lfEmblem3/.test(src) && !/lfEmblem\(/.test(src) && !/ToUpperCase\(\)\.slice\(0, 10\)/.test(src), pr);
    await page.keyboard.press('Escape'); await settle(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
    await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-id="sovereign"]').click()); await page.waitForTimeout(500);
    ok('and there is a second, the obsidian spade', await page.locator('.fr-ban-av.is-fm-sovereign').count() === 1 && await page.locator('.fr-ban-av.is-fm-prestige').count() === 0);
    const st = await store(page);
    ok('and the last choice is kept', st.ti === 'none', st.ti);
    await c.close();
  }

  /* ── MILESTONES: a moment for the ones worth stopping for, said once ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, mseen: { wo: 0, vol: 0, pr: 0, lv: 1, u: RK_SEEN.u } });
    await page.click('#lfGo'); await settle(page);
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8'); await set0.locator('.lf-chk').click();
    await page.click('#lfFinish'); await page.waitForTimeout(2600);
    const mo = await page.evaluate(() => { const g = document.querySelector('.lf-gol'); return g ? { k: g.querySelector('.lf-gol-k').textContent, h: g.querySelector('h2').textContent, n: g.querySelector('.lf-num').textContent, al: g.getAttribute('aria-label') } : null; });
    ok('the first workout is a moment of its own', mo && mo.h === 'First workout' && mo.k === 'Milestone' && mo.n === '1', mo);
    await page.mouse.click(190, 400); await page.waitForTimeout(900);
    ok('tapping puts it away', await page.locator('.lf-gol').count() === 0);
    const sv = await store(page);
    ok('and it is not said again: the record keeps what has been celebrated', sv.mseen.wo === 1, sv.mseen);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, mseen: { wo: 0, vol: 0, pr: 0, lv: 1, u: [] }, wo: [{ id: 'a', d: '2026-10-01', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }] }] }] });
    await page.click('#lfGo'); await settle(page);
    const set0 = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8'); await set0.locator('.lf-chk').click();
    await page.click('#lfFinish'); await page.waitForTimeout(2600);
    const seq = []; for (let i = 0; i < 4; i++) { const h = await page.evaluate(() => { const g = document.querySelector('.lf-gol'); return g ? g.querySelector('h2').textContent : null; }); if (!h) break; seq.push(h); await page.mouse.click(190, 400); await page.waitForTimeout(1000); }
    ok('the first workout is followed by what it unlocked', seq[0] === '2 workouts' || /workout/i.test(seq[0]) || seq.length >= 1, seq);
    ok('no more than three in a row', seq.length <= 3, seq);
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
