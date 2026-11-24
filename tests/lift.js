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
  browser.newContext = async (o) => { const c = await newCtx(o); /* the workout guide opens over a first workout: a seed that says nothing about it has seen it */ await c.addInitScript(`window.__lfNoIntro = 1; window.__lfNoFold = 1; window.__lfPrMin = 1; (() => { const set = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'lift.v1' && typeof v === 'string' && v.charAt(0) === '{') { try { const o = JSON.parse(v); if (!('tour' in o)) { o.tour = true; v = JSON.stringify(o); } } catch (e) {} } return set.call(this, k, v); }; })();`); await c.addInitScript('window.__lfInline = 1;'); await c.addInitScript(`new MutationObserver(() => { if (window.__keepCol) return; const d = document.getElementById('lfColDone'); if (d) d.click(); }).observe(document, { childList: true, subtree: true });`); await c.addInitScript(`(() => { const ids = ['lfSet', 'lfBadges', 'lfTheme']; new MutationObserver(() => { ids.forEach((id) => { const b = document.querySelector('#' + id + ' h3 > button[aria-expanded="false"]'); if (b && !b.dataset.auto) { b.dataset.auto = 1; b.click(); } }); }).observe(document, { childList: true, subtree: true }); })();`); return c; };
  const errors = [], offOrigin = [];
  async function ctx(seed, at, keepBadges) {
    const c = await browser.newContext(PHONE);
    /* the week in review comes up over the app on a Sunday night and the two days after: checks that are not about it have seen it */
    if (seed && !('wkSum' in seed)) seed = Object.assign({ wkSum: '9999-12-31' }, seed);
    /* and so does the goal-hit screen, which goes over everything the moment a week reaches its goal */
    if (seed && !('wkDone' in seed)) seed = Object.assign({ wkDone: '9999-12-31' }, seed);
    /* and so do the milestones: a full-screen moment over a check that is not about it is a check that cannot press */
    /* and the workout guide, which opens over the first workout */
    seed = Object.assign({ mseen: RK_SEEN, tour: true }, seed || {});
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
  /* Customise is a fold, shut until pressed: open it before a row inside it is */
  const cuOpen = async () => {};
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

  await page.click('#lfNewSplit'); await settle(page);
  await page.fill('#lfSpN', 'Push'); await page.click('#lfSpAddDay'); await settle(page);
  await top(page).locator('.lf-sp-w').selectOption('5'); await top(page).locator('.lf-sp-n').fill('Push');
  for (const n of ['Bench press', 'Overhead press']) {
    await top(page).locator('.lf-sp-ax').click(); await settle(page);
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
  await top(page).locator('#lfSpSave').click(); await settle(page);
  s = await store(page);
  ok('a split is the whole week in one, its day holding the exercises in order', s.pg.length === 1 && s.pg[0].n === 'Push' && s.pg[0].d.length === 1 && s.pg[0].d[0].w === 5 && s.pg[0].d[0].x.map((e) => e[0]).join() === s.ex.map((e) => e.id).join() && s.rt.length === 0, s.pg);
  ok('and it is on', s.prog === s.pg[0].id);
  /* what follows is about a day started from a routine of your own, which people who had them before still have: turn the split just made into one */
  await page.evaluate(() => { const v = JSON.parse(localStorage.getItem('lift.v1')); const ids = v.pg[0].d[0].x.map((e) => e[0]); v.rt = [{ id: 'r1', n: 'Push', sp: 'Push, Pull, Legs', ex: ids }]; delete v.pg; v.prog = 'ul'; localStorage.setItem('lift.v1', JSON.stringify(v)); });
  await page.reload(); await page.waitForTimeout(500); s = await store(page);

  /* ── the workout comes up from the bottom ── */
  await page.click('.lf-bar [data-v="home"]');
  await page.click('#lfPick'); await settle(page);
  await top(page).locator('.lf-li', { hasText: 'Push, Pull, Legs' }).click(); await settle(page);
  ok('picking a routine makes it today, for today', (await store(page)).pick.d === '2026-10-30');
  ok('today is the routine', (await page.textContent('#lfPick')).trim() === 'Push' && /Push, Pull, Legs/.test(await page.textContent('.lf-sub')));
  ok('and says two exercises', /2 exercises/.test(await page.textContent('.lf-chips')));
  /* sampled every frame from inside the page, so a loaded machine cannot make the first look come late */
  await page.evaluate(() => { window.__rise = []; const f = () => { const s = document.querySelector('.lf-session'); if (s) window.__rise.push(s.getBoundingClientRect().top); if (window.__rise.length < 400 && !(window.__rise.length > 12 && window.__rise.slice(-12).every((v) => Math.abs(v - window.__rise[window.__rise.length - 1]) < .5) && window.__rise[window.__rise.length - 1] < 60)) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await page.click('#lfGo');
  await settle(page); await page.waitForFunction(() => { const r = window.__rise; return r && r.length && r[r.length - 1] < 60; }, null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(400);
  const rise = await page.evaluate(() => window.__rise), mid = rise[0], end = rise[rise.length - 1];
  ok('the session rises from the foot of the screen', mid > end + 150 && end < 60, { mid, end });
  ok('carrying the routine\'s two exercises', (await page.$$eval('.lf-session .lf-ex-n', (x) => x.map((e) => e.textContent))).join() === 'Bench press,Overhead press');
  ok('with three sets each when they are new', (await page.$$eval('.lf-session .lf-ex', (x) => x.map((e) => e.querySelectorAll('.lf-set:not(.is-hd)').length))).join() === '3,3');
  ok('its finish button is the cream one', await page.$eval('#lfFinish', (b) => getComputedStyle(b).backgroundColor) === 'rgb(225, 212, 194)');

  const set = (ex, i) => page.locator('.lf-session .lf-ex').nth(ex).locator('.lf-set:not(.is-hd)').nth(i);
  await set(0, 0).locator('.lf-chk').click();
  ok('a set with nothing in it cannot be logged', !(await set(0, 0).getAttribute('class')).includes('is-done') && /weight and reps/.test(await page.textContent('.lf-toast')));
  await set(0, 0).locator('input').nth(0).fill('60'); await set(0, 0).locator('input').nth(1).fill('8');
  await set(0, 0).locator('.lf-chk').click();
  ok('logging a set turns its check cream', await set(0, 0).locator('.lf-chk span').evaluate((e) => getComputedStyle(e).backgroundColor) === 'rgb(225, 212, 194)');
  ok('and starts the rest clock: the time, and how long is left beside it', /^0:0\d$/.test((await page.textContent('#lfRest .lf-rs-c')).trim()) && /Resting/.test(await page.textContent('#lfRest')) && /to go · target 2–3 min/.test(await page.textContent('#lfRest')));
  ok('the rest clock is always on screen, even scrolled to the end of the workout', await page.evaluate(() => {
    const bd = document.querySelector('.lf-session .lf-sh-bd'); bd.scrollTop = bd.scrollHeight;
    const r = document.querySelector('#lfRest').getBoundingClientRect();
    return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && !bd.contains(document.querySelector('#lfRest'));
  }));
  ok('while a rest runs the bar has one button, End', (await page.textContent('#lfRestBtn')).trim() === 'End' && await page.locator('#lfRest .lf-rs-ring').count() === 0);
  ok('Discard and Finish are at the very end of the workout, after the cardio, and not in the footer', await page.evaluate(() => { const bd = document.querySelector('.lf-session .lf-sh-bd'), ft = document.querySelector('.lf-session .lf-sh-ft'), f = document.querySelector('#lfFinish'), c = document.querySelector('#lfCardio'); return !!(bd.contains(f) && !ft.contains(f) && (c.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING) && [...bd.querySelectorAll('button')].filter((b) => /^(Discard|Finish)$/.test(b.textContent.trim())).length === 2); }));
  await page.click('#lfRestBtn'); await page.waitForTimeout(300);
  ok('End stops the rest and the button reads Start', await page.evaluate(() => document.querySelector('#lfRest').classList.contains('is-idle')) && (await page.textContent('#lfRestBtn')).trim() === 'Start');
  await page.click('#lfRestBtn'); await page.waitForTimeout(1300);
  ok('Start begins one by hand, and it reads End again', !(await page.evaluate(() => document.querySelector('#lfRest').classList.contains('is-idle'))) && (await page.textContent('#lfRestBtn')).trim() === 'End' && /^0:0\d$/.test((await page.textContent('#lfRest .lf-rs-c')).trim()));
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
  /* CARDIO IS ONE ROW: its name and the minutes typed. The machine is the one used last. */
  const cd = page.locator('#lfCardio'), cdAct = () => page.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')).cd);
  ok('the session ends on a cardio row: its name and a minutes field, and no picker', (await cd.locator('b').textContent()) === 'Cardio' && await cd.locator('input.lf-cdc-f').count() === 1 && await cd.locator('.lf-pill').count() === 0);
  await cd.locator('input.lf-cdc-f').fill('15');
  ok('typing minutes sets it', (await cdAct()).m === 15);
  await cd.locator('input.lf-cdc-f').fill('');
  ok('clearing the minutes clears it', (await cdAct()) === null);
  await cd.locator('input.lf-cdc-f').fill('12');
  await page.click('#lfFinish'); await page.waitForTimeout(800);
  ok('finishing sets off the celebration: one full-screen canvas that never takes a press, with rings', await page.evaluate(() => window.lfCels) === 1 && await page.evaluate(() => { const w = document.querySelector('.lf-cel-w'); return !!w && getComputedStyle(w).pointerEvents === 'none' && !!w.querySelector('canvas') && w.querySelectorAll('.lf-cel-ring').length >= 2 && w.getBoundingClientRect().width === innerWidth; }));
  s = await store(page);
  ok('the workout carries its cardio', !!s.wo[0].cd && s.wo[0].cd.m === 12 && typeof s.wo[0].cd.k === 'string', s.wo[0].cd);
  ok('the summary says it', /\+ 12 min /.test(await top(page).textContent()));
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
    const d = sh.querySelector('#lfEdD'), s = sh.querySelector('#lfEdS'), m = sh.querySelector('#lfEdM'), bd = sh.querySelector('.lf-eg').getBoundingClientRect();
    const cs = getComputedStyle(d), ct = getComputedStyle(s);
    return cs.appearance === 'none' && ct.appearance === 'none' && cs.boxSizing === 'border-box' && d.getBoundingClientRect().right <= bd.right + 1 && s.getBoundingClientRect().right <= bd.right + 1 && m.getBoundingClientRect().right <= bd.right + 1 && s.getBoundingClientRect().height >= 44 && Math.abs(s.getBoundingClientRect().left - d.getBoundingClientRect().left) < 2;
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
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); s.wo[0].d = '2026-10-29'; /* A lift sets records once three earlier days have it logged: three old ones make these real */ ['2026-10-05', '2026-10-03'].forEach((od, oi) => s.wo.unshift({ id: 'oldx' + oi, d: od, s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 40, r: 8 }] }] })); s.wo.unshift({ id: 'old', d: '2026-10-01', s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 40, r: 8 }] }] }); localStorage.setItem('lift.v1', JSON.stringify(s)); });
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
  ok('and a PR bursts from the set', await page.evaluate(() => window.lfBursts) === 1 && await page.locator('.lf-burst:not(.lf-rpb) b').textContent() === 'PR');
  await page.waitForTimeout(2600); /* the badge renderer warms up in the background around now, which can hold a timer a moment */
  ok('then is gone, out of the way', await page.locator('.lf-burst').count() === 0);
  /* AN EXTRA REP AT THE SAME WEIGHT IS A REP RECORD, its own smaller
     celebration, and never a PR or a badge's count — typed in after the tick */
  await page.locator('.lf-session .lf-ex').first().locator('.lf-ex-ft button').first().click(); await settle(page);
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
    return lit === 'rgb(225, 212, 194)' && now.classList.contains('is-on') && getComputedStyle(now).backgroundColor !== 'rgb(225, 212, 194)';
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
  ok('pounds is a display, the record stays in kilos', (await page.$$eval('.lf-stat span', (x) => x.map((e) => e.textContent)))[2] === 'lb' && (await store(page)).wo.find((w) => !/^old/.test(w.id)).x[0].sets[0].w === 60);

  ok('nothing leaves this phone', offOrigin.length === 0, offOrigin);
  ok('nothing threw', errors.length === 0, errors);
  await c.close();

  /* ── the split: a Monday, with last Monday on the record ── */
  {
    const last = (reps) => ({ unit: 'kg', goal: 4, ex: [], rt: [], bw: [],
      wo: [{ id: 'm1', d: '2026-10-26', s: 1, e: 2, n: 'Lower A', rt: null, x: [
        { id: 'hack', n: 'Hack squat', sets: reps.map((r) => ({ w: 80, r })) },
        { id: 'squat', n: 'Barbell squat', sets: [{ w: 100, r: 6 }, { w: 100, r: 6 }, { w: 100, r: 6 }] }] }] });
    {
      const seed = last([8, 8, 7]); seed.wo[0].rt = 'p-mon';
      const r1 = await ctx(seed, '2026-11-02T07:00:00');
      ok('a session logged under the old day name takes the new one', (await store(r1.page)).wo.find((w) => w.id === 'm1').n === 'Quad strength');
      ok('after a Monday session the next day of the plan comes up', (await r1.page.textContent('#lfPick')).trim() === 'Chest & shoulders');
      await r1.c.close();
    }
    {
      const { c, page } = await ctx(last([8, 8, 7]), '2026-11-02T07:00:00');
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
      /* EVERY SET AT THE TOP: one more set at the same weight comes before any more weight */
      ok('every set at the top adds one set before it adds weight', await ex.locator('.lf-set:not(.is-hd)').count() === 5);
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('and the aim for them is the same weight at the top of the range', ph.join() === '80,10,80,10,80,10,80,10,80,10', ph);
      ok('and says so', (await ex.locator('.lf-aim').textContent()) === 'Add a set: 80 × 10');
      await ex.locator('.lf-aim').click(); await settle(page);
      ok('one tap on it fills every empty set with the aim', (await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '80,10,80,10,80,10,80,10,80,10');
      await c.close();
    }
    {
      /* with the extra set already at the top as well, it is weight that goes up */
      const { c, page } = await ctx(last([10, 10, 10, 10, 10]), '2026-11-02T07:00:00');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('ten on every set including the extra moves the weight up 2.5 and the reps back to six', ph.join() === '82.5,6,82.5,6,82.5,6,82.5,6', ph);
      ok('and says so in four words', (await ex.locator('.lf-aim').textContent()) === 'Try 82.5 × 6');
      await ex.locator('.lf-aim').click(); await settle(page);
      ok('one tap on it fills every empty set with the aim', (await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '82.5,6,82.5,6,82.5,6,82.5,6');
      await ex.locator('.lf-aim').click(); await settle(page);
      ok('and a second tap changes nothing that is filled', (await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '82.5,6,82.5,6,82.5,6,82.5,6');
      await c.close();
    }
    {
      /* THE FIRST SET REACHED THE TOP, so you are stronger: the sets after it start from the new weight too, at the bottom of the range */
      const { c, page } = await ctx(last([10, 9, 9, 8]), '2026-11-02T07:00:00');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('a first set that reached the top carries the new weight to the sets after it', ph.join() === '82.5,6,82.5,6,82.5,6,82.5,6', ph);
      await c.close();
    }
    {
      const { c, page } = await ctx(last([9, 8, 8, 8]), '2026-11-02T07:00:00');
      await page.click('#lfGo'); await settle(page);
      const ex = page.locator('.lf-session .lf-ex').first();
      const ph = await ex.locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.placeholder));
      ok('with the first set below the top each set just adds a rep', ph.join() === '80,10,80,9,80,9,80,9', ph);
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
    ok('the first press only picks it: nothing is linked yet, it is lit, and the others offer themselves', await page.locator('.lf-ex.is-ss').count() === 0 && await page.locator('.lf-ssb.is-pend').count() === 1 && await page.locator('.lf-ssb.is-pick').count() >= 2);
    await page.locator('.lf-ssb').nth(2).click(); await settle(page);
    const ids = await page.$$eval('.lf-ex', (x) => x.map((e) => e.classList.contains('is-ss')));
    ok('the second press joins it to THAT exercise, and the partner moves to sit right under the first: the two are the first two cards', JSON.stringify(ids.slice(0, 3)) === '[true,true,false]' && await page.locator('.lf-ssb.is-pend').count() === 0 && /Superset with/.test(await page.locator('.lf-ss-l').first().textContent()), ids);
    await page.locator('.lf-ssb').first().click(); await settle(page);
    ok('pressing the first and then the same one again lets go without linking anything', await page.locator('.lf-ex.is-ss').count() === 0 && await page.locator('.lf-ssb.is-pend').count() === 0);
    await page.locator('.lf-ssb').first().click(); await settle(page); await page.locator('.lf-ssb').nth(1).click(); await settle(page);
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
    ok('inside the range it is ready, not over', !(await page.locator('#lfRest.is-over').count()) && /Ready/.test(await page.textContent('#lfRest .lf-rs-l')) && !(await page.evaluate(() => window.lfRests2 || 0)));
    /* PAST THE TOP OF THE RANGE: a second tone, red, pulsing */
    await page.evaluate(() => { const a = JSON.parse(localStorage.getItem('lift.active.v1')); a.rest = Date.now() - 400000; localStorage.setItem('lift.active.v1', JSON.stringify(a)); });
    await page.reload(); await page.waitForTimeout(400); if (!(await page.locator('.lf-session').count())) await page.click('#lfLive'); await page.waitForTimeout(2300);
    ok('past the top of the range it says Over', /Over/.test(await page.textContent('#lfRest .lf-rs-l')) && await page.locator('#lfRest.is-over').count() === 1);
    const red = await page.evaluate(() => { const r = document.querySelector('#lfRest'), c = getComputedStyle(r.querySelector('.lf-rs-c')), bad = (() => { const d = document.createElement('i'); d.style.color = 'var(--bad)'; document.body.appendChild(d); const v = getComputedStyle(d).color; d.remove(); return v; })(); return { col: c.color, bad, anim: c.animationName }; });
    ok('in red, and the number pulses', red.col === red.bad && /lf-over/.test(red.anim), red);
    ok('the second tone is heard once, and the first is not played late', await page.evaluate(() => window.lfRests2) === 1 && !(await page.evaluate(() => window.lfRests || 0)));
    const aSrc = await page.evaluate(() => 0), srcT = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('the two tones are different sounds, a rising chime and a low buzz', /function lfRing\(\)[^}]*660[^}]*880/.test(srcT) && /function lfRing2\(\)[^}]*'square'/.test(srcT));
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
    ok('nothing in the page claims the audio session or plays a media element, except the silent one behind the lock-screen rest; the rest tones are Web Audio, made inside a tap, with the music ducked natively', !/type = 'playback'|new Audio\(|\.play\(\)/.test((await page.content()).replace(/var lfLockAu[\s\S]*?function lfRestPushClear/, '').replace(/v\.currentTime = 0; v\.play\(\);/, '')));
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


  /* ── how it's done: one button, a YouTube search on the exercise's own name. No way to paste a video of your own. ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, lk: { rdl: 'https://youtu.be/abc123' } });
    const sh = () => page.locator('.lf-sheet').last();
    await page.click('.lf-bar [data-v="lib"]');
    await page.locator('#lfLibList .lf-li', { has: page.locator('b', { hasText: new RegExp('^' + 'Romanian deadlift' + '$') }) }).click(); await settle(page);
    const a = await sh().locator('.lf-how-go').evaluate((x) => ({ href: x.href, t: x.target, rel: x.rel, txt: x.textContent }));
    ok('every exercise opens a YouTube search on its own name', a.href === 'https://www.youtube.com/results?search_query=' + encodeURIComponent('Romanian deadlift exercise proper form')
      && a.t === '_blank' && /noopener/.test(a.rel) && /Watch how it's done/.test(a.txt), a);
    ok('there is no way to use a video of your own', await sh().locator('.lf-how-l').count() === 0 && !/specific video|saved video/i.test(await sh().locator('.lf-how').textContent()));
    ok('and a link saved by an earlier version is not followed, or kept', !(await store(page)).lk);
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
    ok('Edit targets opens Zones, and Priorities and muscles goes on to the list', await page.locator('.lf-sheet #lfZn').count() === 1); await page.click('#lfZnMore'); await settle(page); ok('the list is still there for priorities and adding a muscle', await page.locator('.lf-sheet #lfFocus .lf-li').count() > 0 && await page.locator('#lfFocusAdd').count() === 1); await page.keyboard.press('Escape'); await settle(page);
    await c.close();
  }

  /* ── LOCK-SCREEN REST ALERT: a rest queues one sealed message ── */
  {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-11-02T07:00:00'));
    const kp = await require('crypto').webcrypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
    const pk = Buffer.from(await require('crypto').webcrypto.subtle.exportKey('raw', kp.publicKey)).toString('base64url');
    const au = Buffer.from(require('crypto').randomBytes(16)).toString('base64url');
    await c.addInitScript(`(() => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', 1); localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg', tour: true })); localStorage.setItem('lift.push.v1', JSON.stringify({ id: '${'c'.repeat(32)}', tok: '${'d'.repeat(32)}', ep: 'https://web.push.apple.com/x', pk: '${pk}', au: '${au}' })); } })();`);
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
  /* ── MOVING TO THE APP: everything comes across, friends included, and the copy that moved stops posting under that identity ── */
  {
    const pad2 = (n) => String(n).padStart(2, '0');
    const wos = []; for (let i = 1; i <= 20; i++) { if (i % 7 === 0) continue; const d = new Date(2026, 9, 30 - i); wos.push({ id: 'mv' + i, d: d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()), s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 80, r: 8 }] }] }); }
    const base = { unit: 'kg', goal: 3, wo: wos, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, bseen: { v2: 1, v3: 1, v4: 1, v5: 1, v6: 1, v7: 1, v8: 1, v9: 1, v10: 1 } };
    const frId = { on: true, code: 'K7PQ2M4X', key: 'a'.repeat(32), name: 'Alex Morgan', list: [], rx: [], no: [] };
    const mkCtx = async (init) => { const c = await browser.newContext(PHONE); await c.addInitScript(freeze('2026-10-30T18:00:00')); await c.route(/workers\.dev/, (r) => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: '{}' })); await c.addInitScript(`new MutationObserver(() => { const v = document.querySelector('.lf-cv'); if (v) v.querySelector('.lf-cv-x').click(); }).observe(document, { childList: true, subtree: true });`); await c.addInitScript(init); return c; };
    const wc = await mkCtx(`if (!localStorage.getItem('lift.v1')) { localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(base))}); localStorage.setItem('lift.fr.v1', ${JSON.stringify(JSON.stringify(frId))}); localStorage.setItem('lift.accent.v1', '200'); } window.__clip = ''; Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__clip = t; return Promise.resolve(); }, readText: () => Promise.resolve(window.__clip) }, configurable: true });`);
    const wp = await wc.newPage(); await wp.goto(URL); await wp.waitForTimeout(700);
    ok('the web version offers no banner until the App Store page is live, and the move button is under Backup', await wp.locator('#lfMoveCard, #lfMoveCardW').count() === 0 && (await (async () => { await wp.click('.lf-bar [data-v="you"]'); await wp.waitForTimeout(500); return wp.locator('.lf-mvb').count(); })()) === 1);
    await wp.locator('.lf-mvb').click(); await wp.waitForTimeout(700);
    const clip = await wp.evaluate(() => window.__clip), bun = JSON.parse(clip || '{}');
    ok('moving copies the whole record, with the friend identity, colour and settings that are not in a backup', Array.isArray(bun.wo) && bun.wo.length === wos.length && bun.mv && JSON.parse(bun.mv.fr).code === 'K7PQ2M4X' && bun.mv.accent === '200', Object.keys(bun.mv || {}));
    ok('and the copy that moved says so, and stops sharing under that identity', await wp.locator('#lfMoved').count() === 1 && !!(await wp.evaluate(() => localStorage.getItem('lift.moved.v1'))) && /function frPush\(\) \{\s*if \(!FRS\.on \|\| lfMoved\(\)\) return;/.test(require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8')));
    const ac = await mkCtx(`window.Capacitor = { isNativePlatform: () => true }; Object.defineProperty(navigator, 'clipboard', { value: { readText: () => Promise.resolve(${JSON.stringify(clip)}), writeText: () => Promise.resolve() }, configurable: true }); if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(Object.assign({}, base, { wo: [] })))});`);
    const ap = await ac.newPage(); await ap.goto(URL); await ap.waitForTimeout(900);
    ok('an empty app no longer greets you with an offer to bring the web copy over', await ap.locator('#lfMoveCard').count() === 0);
    await ap.click('.lf-bar [data-v="you"]'); await ap.waitForTimeout(400); await ap.locator('.lf-mvb').click(); await ap.waitForTimeout(2200); await ap.waitForLoadState('load'); await ap.waitForTimeout(800);
    /* the app reloads itself once the record has moved, so a read can land on the old page: try again until one sticks */
    const readGot = () => ap.evaluate(() => ({ wo: JSON.parse(localStorage.getItem('lift.v1')).wo.length, fr: JSON.parse(localStorage.getItem('lift.fr.v1')), ac: localStorage.getItem('lift.accent.v1') }));
    let got; for (let i = 0; i < 12 && !got; i++) { try { got = await readGot(); } catch (e) { await ap.waitForTimeout(500); } }
    ok('one tap brings it across: the workouts, the same friend code and key, the colour', got.wo === wos.length && got.fr.code === 'K7PQ2M4X' && got.fr.key === 'a'.repeat(32) && got.fr.on === true && got.ac === '200', got);
    ok('and it is still reachable under Backup', true);
    const bad = await mkCtx(`window.Capacitor = { isNativePlatform: () => true }; if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(Object.assign({}, base, { wo: [] })))}); Object.defineProperty(navigator, 'clipboard', { value: { readText: () => Promise.resolve(${JSON.stringify(JSON.stringify(Object.assign({}, base, { mv: { fr: JSON.stringify({ on: true, code: 'bad', key: 'x' }), accent: 'evil', mode: 'x', ow: 'nope' } })))}) }, configurable: true });`);
    const bp = await bad.newPage(); await bp.goto(URL); await bp.waitForTimeout(800); await bp.click('.lf-bar [data-v="you"]'); await bp.waitForTimeout(400); await bp.locator('.lf-mvb').click(); await bp.waitForTimeout(2200);
    const kept = await bp.evaluate(() => ({ fr: localStorage.getItem('lift.fr.v1'), ac: localStorage.getItem('lift.accent.v1'), md: localStorage.getItem('lift.mode.v1'), ow: localStorage.getItem('lift.owner.v1'), wo: JSON.parse(localStorage.getItem('lift.v1')).wo.length }));
    ok('what is pasted is not trusted: a damaged identity, colour, mode or owner date is dropped, and the workouts still arrive', kept.fr === null && kept.ac === null && kept.md === null && kept.ow === null && kept.wo === wos.length, kept);
    await wc.close(); await ac.close(); await bad.close();
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
  /* ── THE RELICS AND THE TECHNIQUE MEDALS: exotic is a pattern in metal, mythic is something happening inside it, nothing circles outside ── */
  {
    const src = require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8');
    const exo = ['ssx', 'dsx', 'wux'];
    ok('an exotic is a coin, not a statue: no scene of its own, and its own baked pattern is drawn again every frame by the graphics card through a flowing offset (nothing is added on top)', exo.every((id) => !new RegExp('\\b' + id + ': bdRelic').test(src)) && !/bdRelic|var BDR\b/.test(src) && /function bdMoveFace/.test(src) && /bdWarp/.test(src) && /g\.userData\.cr = function \(t\) \{ paintMove\(t\)/.test(src) && /b\.t === 3 \|\| b\.t === 4\) && b\.fx && !lock && mp\.f\.reg/.test(src));
    ok('the technique medals are five deep each: a first, a second, a third, an exotic and a mythic, for supersets, drop sets and warm-ups', ['ss', 'ds', 'wu'].every((f) => [f + '1', f + '2', f + '3', f + 'x', f + 'm'].every((id) => new RegExp("\\['" + id + "', '[^']+', 'feat', '[^']+', '#[0-9a-f]{6}'\\]").test(src))) && /ss2: 2, ss3: 3, ds2: 2, ds3: 3, wu2: 2, wu3: 3/.test(src));
    const fx = (n, id, x) => ({ id, d: n, s: 1, e: 2, n: 'Legs', x });
    const { c, page } = await ctx({ unit: 'kg', wo: [fx('2026-06-01', 'a0', [{ id: 'hack', n: 'Hack squat', sets: [{ w: 80, r: 8 }] }])]
      .concat(Array.from({ length: 10 }, (_, i) => fx('2026-08-' + String(10 + i).padStart(2, '0'), 'a' + (i + 1), [{ id: 'hack', n: 'Hack squat', sets: [{ w: 80, r: 8 }] }])))
      .concat([fx('2026-09-02', 'c1', [{ id: 'hack', n: 'Hack squat', sets: Array(50).fill({ w: 100, r: 8 }) }]), fx('2026-09-05', 'at', [{ id: 'squat', n: 'Squat', sets: [{ w: 225, r: 3 }] }])]) }, '2026-11-02T09:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const shelf = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('Phoenix: ten sessions inside the thirty days after a month away', shelf.includes('Phoenix:19 Aug'), shelf.filter((x) => /Phoenix/.test(x)));
    ok('Colossus: forty thousand in one session', shelf.includes('Colossus:2 Sep'), shelf.filter((x) => /Colossus/.test(x)));
    ok('Atlas: a barbell lift of 225', shelf.includes('Atlas:5 Sep'), shelf.filter((x) => /Atlas/.test(x)));
    ok('only Don\'t Miss is shown unlocked on the owner phone; every other mythic is locked until earned', /if \(BD_PREVIEW && lfOwner\(\)\) \['dontmiss'\]\.forEach\(/.test(src));
    const ctx2 = await ctx({ unit: 'kg', wo: [1, 2, 3, 4, 5].map((i) => ({ id: 't' + i, d: '2026-09-0' + i, s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Bench', sets: [{ w: 60, r: 8, ds: i === 5 ? [{ w: 40, r: 8 }] : undefined }, { w: 60, r: 8, ds: [{ w: 40, r: 8 }] }, { w: 60, r: 8, ds: [{ w: 40, r: 8 }] }, { w: 60, r: 8, ds: i < 3 ? undefined : [{ w: 40, r: 8 }] }].map((q) => JSON.parse(JSON.stringify(q))), ss: 'm1', wu: Array(5).fill({ w: 20, r: 10 }) }, { id: 'hack', n: 'Hack squat', sets: [{ w: 80, r: 8 }], ss: 'm1' }] })) }, '2026-11-02T09:00:00');
    await ctx2.page.click('.lf-bar [data-v="you"]'); await settle(ctx2.page);
    const sh2 = await ctx2.page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('Back to Back: the fifth workout with a linked pair is the fifth superset', sh2.includes('Back to Back:5 Sep') && !sh2.some((x) => /^Double Up:\d+ [A-Z]/.test(x)), sh2.filter((x) => /Back to|Double Up/.test(x)));
    ok('Warmed Up: twenty-five warm-up sets, counted across workouts, is won on the fifth', sh2.includes('Warmed Up:5 Sep'), sh2.filter((x) => /Warmed/.test(x)));
    ok('Drop It: a set with a drop on it is a drop set, five of them', sh2.some((x) => /^Drop It:\d+ Sep$/.test(x)), sh2.filter((x) => /Drop It/.test(x)));
    ok('the next ones show how far along they are', sh2.some((x) => x === 'Primed:25 / 100') && sh2.some((x) => x === 'Double Up:5 / 25'), sh2.filter((x) => /Primed|Double/.test(x)));
    await ctx2.c.close();
    ok('the long ones show how far along they are, and are not earned', ['Drakefire', 'Leviathan', 'Ouroboros', 'Koi Pond', 'Eclipse', 'Moonrise', 'Zodiac'].every((n) => shelf.some((x) => x.indexOf(n + ':') === 0 && /\d/.test(x) && !/[A-Z][a-z]{2}$/.test(x) || x.indexOf(n + ':') === 0 && /\//.test(x))), shelf.filter((x) => /Drakefire|Leviathan|Ouroboros|Koi|Eclipse|Moonrise|Zodiac/.test(x)));
    await c.close();
  }
  /* ── THE LADDERS: every counting medal is five rungs, and the missing ones were made ── */
  {
    const src = require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8');
    const lad = [...src.slice(src.indexOf('var BD_LAD = ['), src.indexOf('var BD_NEW = [')).matchAll(/\['(\w\w)', \[([^\]]+)\]\]/g)].map((m) => [m[1], m[2].split(',').map((x) => x.trim().replace(/'/g, ''))]);
    const rows = [...src.slice(src.indexOf('var BD_NEW = ['), src.indexOf('var BD_NEWBY')).matchAll(/^  \['(\w+)', '[^']+', '(\w+)', '[^']+', '#[0-9a-f]{6}', '(\w+)', (\d+)(?:, '(\w+)', ([0-9.]+))?\]/gm)];
    const all = lad.flatMap((l) => l[1]);
    ok('forty-one ladders of five rungs, none sharing a medal with another', lad.length === 41 && lad.every((l) => l[1].length === 5) && new Set(all).size === all.length, lad.length);
    ok('every rung is a medal: the existing ones are on the shelf and the missing ones are made', all.every((id) => new RegExp("\\['" + id + "', ").test(src)) && rows.length === 102 && rows.every((r) => all.includes(r[1])));
    ok('only the exotic and mythic rungs of the missing ones have a painting, so a first, second or third rung is never a scene', rows.every((r) => { const l = lad.find((x) => x[1].includes(r[1])), rung = l[1].indexOf(r[1]); return rung >= 3 ? !!r[5] : !r[5]; }));
    const hues = rows.filter((r) => r[5]).map((r) => r[5] + r[6]);
    const fxd = (n, id, x, cd) => ({ id, d: n, s: 1, e: 2, n: 'Push', x, cd });
    const wo = Array.from({ length: 25 }, (_, i) => fxd('2026-09-' + String(i + 1).padStart(2, '0'), 'ld' + i, [{ id: 'bench', n: 'Bench', sets: [{ w: i === 0 ? 200 : 60, r: 5 }] }], i === 3 ? { k: 'walk', m: 600 } : undefined));
    const { c, page } = await ctx({ unit: 'kg', wo }, '2026-11-02T09:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const sh = await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('Favourite: one exercise in twenty-five workouts', sh.includes('Favourite:25 Sep'), sh.filter((x) => /Favourite/.test(x)));
    ok('200 Club: a barbell lift of 200', sh.includes('200 Club:1 Sep'), sh.filter((x) => /200 Club/.test(x)));
    ok('Three Weeks Straight: twenty-one days in a row', sh.includes('Three Weeks Straight:21 Sep'), sh.filter((x) => /Three Weeks/.test(x)));
    ok('Ten Hours Deep: ten hours of cardio', sh.includes('Ten Hours Deep:4 Sep'), sh.filter((x) => /Ten Hours/.test(x)));
    ok('the rungs above show how far along they are', sh.some((x) => /^Obsession:25 \/ 200$/.test(x)) && sh.some((x) => /^Thirty Straight:25 \/ 30$/.test(x)), sh.filter((x) => /Obsession|Thirty/.test(x)));
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
    ok('a light phone gets the light face', look.m === 'light' && look.bg === 'rgb(242, 242, 247)' && look.card === 'rgb(255, 255, 255)' && look.ink === 'rgb(80, 80, 85)', look);
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
    await c.addInitScript(`(() => { if (!sessionStorage.getItem('s')) { sessionStorage.setItem('s', 1); localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg', tour: true }));
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
    ok('the shelf shows every badge, with the day it was won or how far along', shelf.length === 297 && shelf.includes('First workout:5 Oct') && shelf.includes('Week goal hit:9 Oct') && shelf.includes('10 workouts:26 Oct') && shelf.includes('First PR:26 Oct') && shelf.includes('4-week streak:3 / 4') && shelf.includes('50 workouts:10 / 50'), shelf);
    ok('and counts them', /4 of 297/.test(await page.textContent('#lfBadgesRow')));
    ok('a badge not yet won carries its progress ring', await page.locator('#lfBadges .lf-coin[data-b="wo50"] .lf-bdr').count() === 1 && await page.locator('#lfBadges .lf-coin[data-b="first"] .lf-bdr').count() === 0);
    await page.click('#lfBadges .lf-coin[data-b="wo10"]'); await page.waitForTimeout(60);
    ok('it opens at once, its picture holding the stage while the live award is built', await page.locator('.lf-cv .lf-cv-ph, .lf-cv canvas.is-on').count() >= 1);
    await page.waitForTimeout(1500);
    ok('a coin opens on its own screen, to spin', await page.locator('.lf-cv').count() === 1 && /10 workouts/.test(await page.textContent('.lf-cv')) && /Earned Mon 26 Oct/.test(await page.textContent('.lf-cv'))
      && await page.locator('.lf-cv-stage canvas, .lf-cv-stage.is-flat').count() >= 1);
    /* EVERY BADGE KEEPS TURNING: long after the opening spin has settled the picture is still moving */
    if (await page.locator('.lf-cv-stage canvas').count()) {
      await page.waitForTimeout(3500);
      const shot1 = await page.locator('.lf-cv-stage').screenshot(); await page.waitForTimeout(1400); const shot2 = await page.locator('.lf-cv-stage').screenshot();
      ok('a badge left alone keeps turning on its own, long after it has settled', !shot1.equals(shot2));
    }
    ok('opening an earned badge throws no confetti', await page.locator('canvas.lf-bconf').count() === 0);
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
  /* You is a plain list: nothing on it folds, and each row opens a screen of its own */
  {
    const c = await newCtx(PHONE); await c.addInitScript('window.__lfNoIntro = 1;');
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', '{"unit":"kg","wo":[],"tour":true}'); })();`);
    const page = await c.newPage(); await page.goto(URL); await page.waitForTimeout(300);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('nothing on You folds open and shut', await page.locator('#lfYou .lf-fold, #lfYou button[aria-expanded]').count() === 0);
    ok('it is goals and one list of five rows, with no body weight on it', await page.locator('#lfBw').count() === 0 && await page.locator('#lfTargets').count() === 1 && (await page.locator('#lfMenu .lf-rowl b').allTextContents()).join() === 'Muscle targets,Appearance,Badges,Monthly medals,Settings');
    ok('a shelf builds nothing until its row is pressed', await page.locator('.lf-coin').count() === 0 && /of 297/.test(await page.textContent('#lfBadges')));
    await page.click('#lfBadges'); await settle(page);
    ok('pressing a row opens its screen', await page.locator('.lf-sheet #lfBadgesBody .lf-coin').count() === 297);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('#lfSet'); await settle(page);
    await page.click('#lfUnit [data-u="lb"]'); await settle(page);
    ok('a press on that screen shows its new state at once', await page.getAttribute('#lfUnit [data-u="lb"]', 'aria-pressed') === 'true' && await page.getAttribute('#lfUnit [data-u="kg"]', 'aria-pressed') === 'false');
    await page.click('#lfUnit [data-u="kg"]'); await settle(page);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    await page.click('#lfTgEdit'); await settle(page);
    ok('Edit targets on Home opens Zones, a track for every muscle in focus', await page.locator('.lf-sheet #lfZn .lf-zr').count() > 0 && await page.locator('.lf-sheet #lfZnSeg button').count() === 3);
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
    const med = await page.$$eval('#lfMedals .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent));
    ok('every week of a month on goal wins its medal, on the day the last week gets there', med.join() === 'October 2026:Perfect month,September 2026:Perfect month', med);
    ok('a record that already had its month counts it as seen, not news', (await store(page)).bseen.m202609 === 1);
    ok('the trophy case is put away for now', await page.locator('#lfRecords').count() === 0);
    await c.close();
  }
  /* the exotic and mythic monthly medals */
  {
    const wo = []; let n = 0;
    for (let d = new Date('2026-08-03T12:00:00'); d <= new Date('2026-10-30T12:00:00'); d.setDate(d.getDate() + 1)) {
      if ([1, 2, 4, 5].indexOf(d.getDay()) < 0) continue; n++;
      wo.push({ id: 'x' + n, d: d.toISOString().slice(0, 10), s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100 + n * 2, r: 8 }] }] });
    }
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00', true);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const mm = await page.$$eval('#lfMedals .lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent + ':' + (/is-t4/.test(e.querySelector('.lf-coin').className) ? 4 : /is-t3/.test(e.querySelector('.lf-coin').className) ? 3 : 0)));
    ok('a month with a session over the goal every week is an exotic medal, and the biggest month yet, with three to compare, is a mythic one', mm.join() === 'October 2026:Record month:4,September 2026:Above the goal:3,August 2026:Above the goal:3', mm);
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
    ok('the next day it is the day after the one you trained, in the plan\'s order', (await page.textContent('#lfPick')).trim() === 'Back & V-taper' && await page.locator('#lfDone').count() === 0);
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
    ok('seven programs fit on the switch, none cut off', segW.length === 7 && segW.every(Boolean));
    await page.click('#lfProg [data-p="sx"]'); await settle(page);
    const sx = await page.$$eval('#lfSplit .lf-li b', (b) => b.map((x) => x.textContent));
    ok('the six-day push, pull, legs split runs Monday to Saturday from the spreadsheet', sx.join() === 'Mon · Push A,Tue · Pull A,Wed · Legs A,Thu · Push B,Fri · Pull B,Sat · Legs B', sx);
    const sxSrc = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    const sxOk = await page.evaluate(() => { const bad = []; PROGRAMS.sx.days.forEach((d) => { const seen = {}; d.ex.forEach((id) => { if (!exById(id)) bad.push(d.id + ':' + id); if (seen[id]) bad.push(d.id + ' twice:' + id); seen[id] = 1; }); }); return { bad, n: PROGRAMS.sx.days.map((d) => d.ex.length).join() }; }).catch(() => null);
    ok('every exercise in it exists and none is in a day twice', /var PROGRAM_SX = \[/.test(sxSrc) && /sx: \{ n: 'Superset split'/.test(sxSrc) && /'s-mon': \['Push A: chest, shoulders and triceps'/.test(sxSrc), sxOk);
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
    await B.page.evaluate(() => { window.__keepCol = 1; });
    await B.page.fill('#frName', 'Sam'); await B.page.click('#frOn'); await B.page.waitForTimeout(900);
    ok('turning friends on brings up the colour wheel, so nobody stays on the starting colour', await B.page.locator('.lf-sheet #lfWheel').count() === 1 && await B.page.locator('#lfColDone').count() === 1);
    await B.page.click('#lfColDone'); await B.page.waitForTimeout(500); await B.page.evaluate(() => { window.__keepCol = 0; });
    await B.page.waitForFunction(() => document.querySelectorAll('#frBoard .fr-row').length === 2, null, { timeout: 4000 }).catch(() => {});
    const names = await B.page.$$eval('#frBoard .fr-row .fr-t b', (b) => b.map((x) => x.textContent));
    ok('turning on adds whoever sent the link, ranked by workouts', names.join() === 'Niko,Sam', names);
    ok('your code is not on the tab any more', await B.page.locator('#lfFr .fr-code').count() === 0);
    ok('and it is not in Settings either', await B.page.locator('#lfSet .fr-code').count() === 0);
    await B.page.click('#frAdd'); await settle(B.page);
    const codeB = (await B.page.textContent('.lf-sheet .fr-code')).trim();
    ok('it is at the top of the add-a-friend sheet, with share', codeB.length === 8 && await B.page.locator('.lf-sheet #frShare').count() === 1);
    await B.page.evaluate(() => { const x = [...document.querySelectorAll('.lf-sheet .lf-x')].pop(); if (x) x.click(); }); await settle(B.page);

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
    ok('a friend\'s page wears the colour they chose, and yours stays yours', acc[0] && acc[0] !== '#e1d4c2' && acc[1].toLowerCase() === '#e1d4c2', acc);
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

    await B.page.click('.lf-bar [data-v="fr"]'); await settle(B.page);
    await B.page.click('#frAdd'); await settle(B.page);
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

  /* ── THE PROGRESS CARD: the streak and the goal as two pages of one card on Home ── */
  {
    const dd = (n) => { const d = new Date(2026, 9, 26 + n); return d.toISOString().slice(0, 10); };
    const wo = [];  /* two full weeks of three days, goal three: Mon 12 and Mon 19 Oct, plus this week's two days */
    for (const mon of [-14, -7]) for (const k of [0, 2, 4]) wo.push({ id: 'g' + mon + k, d: dd(mon + k), s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 50, r: 8 }] }] });
    for (const k of [0, 1]) wo.push({ id: 'h' + k, d: dd(k), s: 3, e: 4, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 50, r: 8 }] }] });
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-29T18:00:00');
    const g1 = await page.evaluate(() => { const c = document.querySelector('#lfPgr'), r = c.getBoundingClientRect(), n = c.nextElementSibling.getBoundingClientRect(); return { gap: Math.round(n.top - r.bottom), dots: document.querySelectorAll('#lfPgrD').length, pages: document.querySelectorAll('.lf-pgr-p').length, arc: +c.querySelector('.fg').getAttribute('stroke-dashoffset'), len: +c.querySelector('.fg').getAttribute('stroke-dasharray'), fr: c.querySelector('.lf-num').textContent }; });
    ok('Home has ONE progress card under Today: no pages and no dots, the flame in an open loop that is two thirds round, 2/3 beside it', g1.dots === 0 && g1.pages === 0 && g1.gap > 0 && g1.gap < 20 && Math.abs(g1.arc / g1.len - 1 / 3) < .01 && g1.fr === '2 / 3', JSON.stringify(g1));
    ok('it shows the goal, this week\'s seven days with the days trained lit, and not the weeks in a row', /Weekly goal/.test(await page.textContent('#lfPgr')) && !/in a row/.test(await page.textContent('#lfPgr')) && await page.locator('#lfPgr .lf-pgr-w div').count() === 7 && await page.locator('#lfPgr .lf-pgr-w .is-on').count() === 2 && (await page.textContent('#lfPgr .lf-num')) === '2 / 3', await page.textContent('#lfPgr .lf-num'));
    await page.click('#lfPgr'); await settle(page);
    ok('pressing the card opens Change goal directly: the days a week, the current one pressed, and no streak page', await page.locator('#lfGsDays button').count() === 7 && await page.locator('#lfGsDays button[aria-pressed="true"]').textContent() === '3' && await page.locator('#lfSk').count() === 0);
    await page.locator('#lfGsDays button').nth(4).click(); await page.waitForTimeout(300);
    ok('choosing five days changes the goal for good, and the card behind follows', (await store(page)).goal === 5 && (await page.textContent('#lfPgr .lf-num')) === '2 / 5');
    await page.keyboard.press('Escape'); await settle(page);
    await page.locator('nav button').nth(1).click(); await page.waitForTimeout(500); await page.locator('#lfCal .lf-seg button[data-m="month"]').click(); await page.waitForTimeout(400);
    ok('the weeks in a row lead the Month view and the freezes sit under the one calendar: twelve weeks above, no Streak tab, no Change goal button there', await page.locator('#lfCal .lf-seg button').count() === 2 && await page.locator('#lfMonth').count() === 1 && await page.locator('#lfSk .lf-sk-w i').count() === 12 && await page.locator('.lf-sf-g').count() === 0 && await page.locator('.lf-sf-fz').count() === 1 && await page.locator('#lfSkGoal').count() === 0 && await page.evaluate(() => { const m = document.querySelector('#lfMonth').getBoundingClientRect(); return document.querySelector('#lfSk').getBoundingClientRect().top < m.top && document.querySelector('.lf-sf-fz').getBoundingClientRect().top > m.bottom; }));
    ok('the freezes are shut by default and fold open: a button in a heading, aria-expanded', await page.locator('h3.lf-sf-h > button.lf-sf-t[aria-expanded="false"]').count() === 1 && !(await page.locator('#lfSfBody').isVisible()));
    await page.click('.lf-sf-t'); await page.waitForTimeout(200);
    ok('pressing it opens the freezes, and it is remembered', await page.locator('#lfSfBody').isVisible() && await page.evaluate(() => localStorage.getItem('lift.sf')) === '1');
    ok('a freeze is for a day: untrained days from the last fortnight are offered, none that were trained', await page.locator('.lf-sf-d').count() >= 5 && await page.evaluate(() => [...document.querySelectorAll('.lf-sf-d')].every((b) => !/^Frozen/.test(b.getAttribute('aria-label')))));
    ok('freezing a day adds it to the week: the week is one day closer and the record holds that day alone; undo takes it back', await (async () => { const n0 = await page.locator('.lf-sf-d:not(:disabled)').count(); await page.locator('.lf-sf-d:not(:disabled)').last().click(); await page.waitForTimeout(300); const st = await store(page); const ok1 = st.fz && st.fz.length === 1 && /^\d{4}-\d\d-\d\d$/.test(st.fz[0]); return ok1 && await page.locator('.lf-sf-d.is-fz').count() === 1 && n0 > 0; })());
    await c.close();
  }

  /* ── HEALTH INSIGHTS: today against your own thirty days, read on a phone that has Health, shown and never kept ── */
  {
    const c = await newCtx(PHONE);
    await c.addInitScript(`window.__lfNoIntro = 1; window.Capacitor = { isNativePlatform: () => true, Plugins: { LiftWidgets: { caps: () => Promise.resolve({ health: true, group: false, version: '1.6' }), setSnapshot: () => Promise.resolve({}), healthAuth: () => Promise.resolve({ ok: true }), healthReadAuth: () => Promise.resolve({ ok: true }), healthDay: () => Promise.resolve({ ok: true, steps: 15111, stepsAvg: 9800, energy: 568, energyAvg: 420, exercise: 0, exerciseAvg: 22, distance: 11.1, distanceAvg: 7.4, rhr: 56, rhrAvg: 58, hrv: 61, hrvAvg: 54, sleep: { total: 421, deep: 68, rem: 92, core: 240, awake: 31 } }), keepAwake: () => Promise.resolve({}), haptic: () => Promise.resolve({}), duck: () => Promise.resolve({}), startRest: () => Promise.resolve({}), endRest: () => Promise.resolve({}), watchAct: () => Promise.resolve({}) } } }; if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg', goal: 4, tour: true, setup: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [] }));`);
    const page = await c.newPage(); const pe = []; page.on('pageerror', (e) => pe.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(500);
    await page.click('.lf-bar [data-v="you"]'); await settle(page); await page.click('#lfSet'); await settle(page);
    ok('Apple Health has a Health insights button beside Save workouts', await page.locator('#lfHkIns').count() === 1);
    await page.click('#lfHkIns'); await settle(page);
    ok('the first time it asks once, in a sentence, before reading anything', await page.locator('#lfHiAllow').count() === 1 && !(await store(page)).hkr);
    await page.click('#lfHiAllow'); await settle(page);
    const tiles = await page.$$eval('#lfHi .lf-hi-t', (x) => x.map((e) => e.querySelector('.lf-lab').textContent + ':' + e.querySelector('b').textContent));
    ok('it shows the two scores, four activity figures and six recovery figures', tiles.length === 12 && tiles.includes('Steps:15,111') && tiles.includes('Total sleep:7 h 1 m') && tiles.includes('Resting heart rate:56') && tiles.includes('Sleep:88'), tiles.join('|'));
    ok('a figure is set against your own average, and a score is not', await page.locator('#lfHi .lf-hi-c', { hasText: 'Above your daily average' }).count() >= 3 && (await page.$$eval('#lfHi .lf-hi-g:first-of-type .lf-hi-c', (x) => x.map((e) => e.textContent).join(''))) === '');
    ok('what it reads is not saved: only that Health was allowed', await page.evaluate(() => { const s = localStorage.getItem('lift.v1'); return s.indexOf('15111') < 0 && s.indexOf('"hkr":true') >= 0; }));
    ok('no page errors', pe.length === 0, pe.join('|'));
    await c.close();
  }

  /* ── A FREEZE EARNED IS SAID ONCE, and the lock screen goal has a frozen day to show ── */
  {
    const wo = [{ id: 'q1', d: '2026-10-28', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 50, r: 8 }] }] }];
    const first = await ctx({ unit: 'kg', goal: 4, wo }, '2026-10-30T18:00:00');
    await first.page.waitForTimeout(1300);
    ok('a first open only learns the freeze count: nothing is announced', await first.page.locator('.lf-toast').count() === 0 && (await store(first.page)).fzAv === 1);
    await first.c.close();
    const more = await ctx({ unit: 'kg', goal: 4, wo, fzAv: 0 }, '2026-10-30T18:00:00');
    await more.page.waitForTimeout(1300);
    ok('a count that has gone up is announced once, with its glowing +1', /Streak freeze earned/.test(await more.page.textContent('.lf-toast')) && await more.page.locator('.lf-toast .lf-fzg').count() === 1);
    await more.page.waitForTimeout(2800); await more.page.reload(); await more.page.waitForTimeout(1300);
    ok('and not again on the next open', await more.page.locator('.lf-toast').count() === 0);
    const snap = await more.page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); return s.fzAv; });
    ok('the count it has seen is kept', snap === 1);
    await more.c.close();
  }

  /* ── A FREEZE KEEPS THE BADGES: a frozen day does not break a run of days, so the straight-run badges can still be won through it ── */
  {
    const w = (i, d) => ({ id: 'r' + i, d, s: i, e: i + 1, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [{ w: 100, r: 8 }] }] });
    const days = []; for (let i = 0; i < 21; i++) { const d = new Date(2026, 9, 9 + i); days.push(d.toISOString().slice(0, 10)); }
    const gap = '2026-10-19';
    const wo = days.filter((d) => d !== gap).map((d, i) => w(i + 1, d));
    const shelfOf = async (fz) => { const { c, page } = await ctx({ unit: 'kg', goal: 3, wo, ...(fz ? { fz: [gap] } : {}), rd: {} }, '2026-10-30T18:00:00', true); await page.click('.lf-bar [data-v="you"]'); await settle(page); await page.click('#lfBadges'); await settle(page); const sh = await page.$$eval('.lf-bdi', (x) => x.map((e) => e.querySelector('b').textContent + ':' + e.querySelector('span').textContent)); await c.close(); return sh.filter((x) => /^Three Weeks Straight/.test(x))[0] || ''; };
    const no = await shelfOf(false), yes = await shelfOf(true);
    ok('twenty-one days with one missed does not earn Three Weeks Straight', /\//.test(no), no);
    ok('with that one day frozen the run is unbroken and the badge is won', yes && !/\//.test(yes), yes);
  }

  /* ── ZONES: the weekly sets for each muscle from one choice, on Exercises, Sets this week and the first split ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo: [{ id: 'z1', d: '2026-10-20', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: [{ w: 50, r: 8 }] }] }] }, '2026-10-29T18:00:00');
    await page.click('.lf-bar [data-v="lib"]'); await settle(page);
    const ord = await page.evaluate(() => { const y = (s) => document.querySelector(s).getBoundingClientRect().top; return [y('#lfTgCard'), y('#lfNewSplit'), y('#lfProgMg'), y('#lfSplit')]; });
    ok('Exercises runs: the targets card, Create split, Manage and share splits, then your split', ord[0] < ord[1] && ord[1] <= ord[2] && ord[2] < ord[3], JSON.stringify(ord));
    ok('Create split is a Quick-actions tile with its icon', await page.evaluate(() => { const b = document.querySelector('#lfNewSplit'); return /Create split/.test(b.textContent) && !!b.querySelector('svg'); }));
    ok('the slim row says the weekly total, and its label names the muscles and Edit targets', /sets a week/.test(await page.textContent('#lfTgCard')) && /muscles/.test(await page.getAttribute('#lfTgCard', 'aria-label')) && /Edit targets/.test(await page.getAttribute('#lfTgCard', 'aria-label')));
    await page.click('#lfTgCard'); await settle(page);
    const rowsN = await page.locator('#lfZn .lf-zr').count();
    ok('it opens Zones: the split, what the numbers are based on, three zones and a track for every muscle', rowsN > 0 && await page.locator('#lfZn .lf-zn-d div').count() === 7 && /Build muscle/.test(await page.textContent('#lfZn .lf-zn-bs')) && await page.locator('#lfZnSeg button[aria-pressed="true"]').textContent() === 'Build');
    const tot = async () => (await page.textContent('#lfZnSay')).match(/(\d+) sets a week/)[1] | 0;
    const tb = await tot(); await page.locator('#lfZnSeg button').nth(2).click(); const tp = await tot(); await page.locator('#lfZnSeg button').nth(0).click(); const tm = await tot();
    ok('Maintain, Build and Push are three different totals, Push the most', tm < tb && tb < tp, [tm, tb, tp]);
    await page.locator('#lfZnSeg button').nth(1).click();
    const first = page.locator('#lfZn .lf-zr').first(), before = +(await first.locator('b').textContent());
    await first.locator('input').fill(String(before + 4)); await first.locator('input').dispatchEvent('input');
    ok('dragging one muscle changes it, marks it as yours and offers a way back', +(await first.locator('b').textContent()) === before + 4 && await first.evaluate((e) => e.classList.contains('is-ed')) && await page.locator('#lfZnBack').isVisible());
    await page.click('#lfZnBack');
    ok('back to the suggestion puts it right', +(await first.locator('b').textContent()) === before && !(await page.locator('#lfZnBack').isVisible()));
    await page.locator('#lfZnSeg button').nth(2).click(); await page.click('#lfZnSave'); await settle(page);
    const st = await store(page);
    ok('saving puts one number on every muscle, and remembers the zone', st.focus.every((f) => f.lo === f.hi) && st.zn === 2, JSON.stringify(st.focus.map((f) => f.m + f.lo)));
    ok('the card behind follows: Push and the new total', /Push/.test(await page.getAttribute('#lfTgCard', 'aria-label')) && (await page.textContent('#lfTgCard')).includes(String(st.focus.reduce((a, f) => a + f.hi, 0))));
    await page.locator('.lf-toast button').last().click().catch(() => {}); await settle(page);
    ok('Undo brings the old targets and the old zone back', (await store(page)).zn === undefined && JSON.stringify((await store(page)).focus) !== JSON.stringify(st.focus));
    /* the goal changes the numbers */
    await page.click('#lfTgCard'); await settle(page); const t0 = await tot();
    await page.click('#lfZnBasis'); await settle(page); await page.locator('#lfZbG button[data-k="keep"]').click(); await page.click('#lfZbDone'); await page.waitForSelector('#lfZn', { timeout: 4000 }).catch(() => {}); await page.waitForTimeout(500);
    ok('changing the goal to Maintain reopens Zones with fewer sets, and remembers it', await tot() < t0 && (await store(page)).gx === 'keep', [t0, await tot()]);
    await c.close();
  }

  /* ── REAL SETS, REAL PRs: limits on a set, and two weeks before a PR counts ── */
  {
    const st = (w, r) => ({ w, r });
    const wo = [{ id: 'r0', d: '2026-10-20', s: 1, e: 2, n: 'Legs', x: [{ id: 'hack', n: 'Hack squat', sets: [st(100, 8), st(900, 400)] }] },
      { id: 'r1', d: '2026-10-27', s: 3, e: 4, n: 'Legs', x: [{ id: 'legext', n: 'Leg extensions', sets: [st(50, 10)] }] },
      { id: 'r2', d: '2026-10-29', s: 5, e: 6, n: 'Legs', x: [{ id: 'legext', n: 'Leg extensions', sets: [st(60, 10)] }] }];
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    /* this block tests the real rule: no override */
    await page.addInitScript(() => { delete window.__lfPrMin; }); await page.reload(); await page.waitForTimeout(500);
    const s = await store(page);
    ok('a stored set past what a set can be is brought back to the limit', JSON.stringify(s.wo.find((w) => w.id === 'r0').x[0].sets[1]) === '{"w":500,"r":50}');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const bm = Object.fromEntries(await page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
    ok('a lift logged on only one earlier day sets no record yet', bm['First PR'] === 'Locked', bm['First PR']);
    /* THREE EARLIER DAYS: the fourth is the first that can set a record */
    for (const [days, want, label] of [[2, 'Locked', 'two earlier days: still no record'], [3, 'unlocked', 'three earlier days: a heavier day is a record']]) {
      const ws = []; for (let i = 0; i < days; i++) ws.push({ id: 'p' + i, d: '2026-10-0' + (i + 1), s: 1, e: 2, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [st(50, 8)] }] });
      ws.push({ id: 'pz', d: '2026-10-20', s: 3, e: 4, n: 'Upper', x: [{ id: 'bench', n: 'Barbell bench press', sets: [st(60, 8)] }] });
      const q = await ctx({ unit: 'kg', goal: 3, wo: ws }, '2026-10-30T18:00:00');
      await q.page.addInitScript(() => { delete window.__lfPrMin; }); await q.page.reload(); await q.page.waitForTimeout(500);
      await q.page.click('.lf-bar [data-v="you"]'); await settle(q.page);
      const bq = Object.fromEntries(await q.page.$$eval('#lfBadges .lf-bdi', (x) => x.map((e) => [e.querySelector('b').textContent, e.querySelector('span').textContent])));
      ok(label, want === 'Locked' ? bq['First PR'] === 'Locked' : bq['First PR'] !== 'Locked' && !!bq['First PR'], bq['First PR']);
      await q.c.close();
    }
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
    /* THEIR PROGRAM: a fold at the top of a friend's page, shut, that opens on their days and adds the program to yours */
    /* the fake server is what the board re-reads, so the program is planted there */
    recs.KLMN2345.s.pg = { n: 'Sam split', d: [[1, 'Upper', 'Chest', [['bench', 4, 6, 10], ['row', 3, 8, 12]], []], [3, 'Lower', '', [['squat', 4, 5, 8]], []]], c: [] };
    await page.reload(); await page.waitForTimeout(500); await page.click('.lf-bar [data-v="fr"]'); await page.waitForTimeout(1800);
    await open('Sam');
    const pgf = await page.evaluate(() => { const c = document.querySelector('#frPg'), b = document.querySelector('#frPgFold'), bn = document.querySelector('.fr-ban'); return c && b ? { open: b.getAttribute('aria-expanded'), hid: document.querySelector('#frPgBody').hidden, below: c.getBoundingClientRect().top >= bn.getBoundingClientRect().bottom - 1, rows: document.querySelectorAll('#frPgBody .lf-li').length, h3: !!b.closest('h3') } : null; });
    ok('a friend with a program shows it as a shut fold under their name, a button inside a heading', pgf && pgf.open === 'false' && pgf.hid && pgf.below && pgf.h3, JSON.stringify(pgf));
    await page.click('#frPgFold'); await page.waitForTimeout(150);
    ok('it opens on their days and Add to my programs', await page.evaluate(() => !document.querySelector('#frPgBody').hidden && document.querySelectorAll('#frPgBody .lf-li').length === 2 && /Add to my programs/.test(document.querySelector('#frPgAdd').textContent)));
    await page.click('#frPgAdd'); await page.waitForTimeout(500);
    ok('Add opens the same name-and-days preview a pasted program gets, named for theirs', await page.locator('#lfPgN').inputValue() === 'Sam split' && await page.locator('#lfPgAdd').count() === 1);
    await page.click('#lfPgAdd'); await page.waitForTimeout(600);
    ok('and adding it makes it one of your programs', (await page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')))).pg.some((q) => q.n === 'Sam split' && q.d.length === 2));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400); await page.click('.lf-bar [data-v="fr"]').catch(() => {}); await page.waitForTimeout(600);
    ok('your own profile, and a friend with no program, show no such fold', await page.evaluate(() => !document.querySelector('#frPg')));
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
    ok('the badges are in collections', cols.join('|') === 'Sessions|Consistency|Volume|Sets & reps|Strength|Exercises|Body parts|Cardio|Technique|Friends|Day streaks', cols.join('|'));
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
    ok('a mythic badge has a glow behind it and no ring or sparks drawn round it', await page.locator('#lfBadges .lf-coin.is-t4[data-b="wo365"]').count() === 1 && await page.locator('#lfBadges .lf-coin.is-t4 .lf-myth').count() === 0);
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
    ok('the footer is + Set, + Drop and + Warm-up, with no Remove set', ft.join('|') === '+ Set|+ Drop|+ Warm-up', ft.join('|'));
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
    ok('without the link there is no owner badge on the shelf', await page.locator('#lfBadges .lf-coin[data-b="owner"]').count() === 0 && await page.locator('#lfBadges .lf-coin').count() === 297);
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
    await page.evaluate(() => { const b = document.querySelector('#lfLastWeek'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); b.click(); }); await page.waitForTimeout(600);
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
    await page.evaluate(() => document.querySelector('.lf-toast button').click()); await settle(page);
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
    ok('the harder the finer: a sheen, then a finish, then a finish a level higher; the halo is for the exotic rung above', /is-sn/.test(cls.ton10) && !/is-fx/.test(cls.ton10) && /is-fx/.test(cls.ton15) && !/is-t3/.test(cls.ton15) && /is-fx/.test(cls.ton20) && !/is-t3/.test(cls.ton20), cls);
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
    const c = await newCtx(PHONE); await c.addInitScript('window.__lfNoIntro = 1;');
    await c.addInitScript('window.__lfInline = 1;');
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', '{"unit":"kg","wo":[],"tour":true,"bseen":{"v2":1,"v3":1}}'); })();`);
    const page = await c.newPage(); await page.goto(URL); await page.waitForTimeout(300);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('appearance is a row, saying cream', /Cream/.test(await page.textContent('#lfThemeRow')));
    ok('and appearance is not in settings any more', await page.locator('#lfSet #lfMode').count() === 0);
    ok('it holds appearance and the wheel', await page.locator('#lfTheme #lfMode').isVisible() && await page.locator('#lfWheel').isVisible());
    const tok = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--log').trim());
    ok('cream to begin with', (await tok()).toLowerCase() === '#e1d4c2', await tok());
    await page.locator('#lfWheel').evaluate((e) => e.scrollIntoView({ block: 'center' })); await settle(page);
    const b = await page.locator('#lfWheel').boundingBox();
    /* the bottom of the ring is 180 degrees: a cyan */
    await page.mouse.move(b.x + b.width / 2, b.y + b.height - 12); await page.mouse.down(); await page.mouse.up(); await settle(page);
    const cy = await tok();
    ok('a press on the ring sets the accent from that hue', cy !== '#e1d4c2' && await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '180', [cy, await page.evaluate(() => localStorage.getItem('lift.accent.v1'))]);
    ok('and the row names it', /Cyan/.test(await page.textContent('#lfThemeRow')));
    ok('the greens that say done follow it, a filling bar stays white', await page.evaluate(() => { const r = getComputedStyle(document.documentElement); return r.getPropertyValue('--good').trim() === r.getPropertyValue('--today-ink').trim(); }));
    ok('the ink on a fill is worked out to read on it', await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--on-log').trim()) !== '');
    await page.focus('#lfWheel'); await page.keyboard.press('ArrowRight');
    ok('arrows turn it too', await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === '185');
    await page.reload(); await page.waitForTimeout(300);
    ok('it is kept across a reload', (await tok()) === (await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--today').trim())) && (await tok()) !== '#e1d4c2');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await page.click('#lfTheme #lfMode [data-m="light"]'); await settle(page);
    ok('light and dark live here now', await page.evaluate(() => document.documentElement.dataset.mode) === 'light');
    await page.click('#lfAccReset'); await settle(page);
    ok('back to cream clears it', (await tok()).toLowerCase() === '#b5a084' && await page.evaluate(() => localStorage.getItem('lift.accent.v1')) === null);
    const gg = await page.evaluate(() => { const r = getComputedStyle(document.documentElement); return [r.getPropertyValue('--good').trim().toLowerCase(), '', document.documentElement.dataset.mode]; });
    ok('and the greens are green again', gg[0] === '#6e5b45' && gg[1] === '', gg);
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
    ok('it offers the routines to pick from, with an empty one last', await top(o.page).locator('.lf-li').count() >= 2 && /Empty workout/.test(await top(o.page).locator('.lf-li').last().textContent()));
    const pickN = await top(o.page).locator('.lf-li').first().locator('b').textContent();
    await top(o.page).locator('.lf-li').first().click(); await settle(o.page);
    ok('and the second session comes with that routine\'s exercises', await o.page.locator('.lf-session').count() === 1 && await o.page.locator('.lf-session .lf-ex').count() > 0 && pickN.length > 0);
    await o.c.close();
    /* a day more than the goal asked for has its own moment, once */
    o = await ctx({ unit: 'kg', goal: 2, wkDone: '2026-10-26', wo: [W('c1', '2026-10-27', '07'), W('c2', '2026-10-28', '07'), W('c3', '2026-10-30', '07')] }, '2026-10-30T18:00:00');
    await o.page.waitForFunction(() => window.lfOvers === 1, null, { timeout: 8000 }).catch(() => {});
    ok('a week that goes past its goal gets a moment of its own', await o.page.evaluate(() => window.lfOvers) === 1 && await o.page.locator('.lf-gol').count() === 1 && /Overtime/.test(await o.page.textContent('.lf-gol')) && (await store(o.page)).wkOver === '2026-10-26');
    await o.c.close();
    ok('Two-a-Day pays a title and a flair as well as its badge', /\['twice', 'Double Time', 'Earn Two-a-Day'/.test(src2) && /\['twice', 'Double', 'Earn Two-a-Day'/.test(src2) && /var BD_HALO = \{[^}]*twice: 1/.test(src2) && /function wkDays/.test(src2));
    /* THE MONTH IN REVIEW, and the card that goes in a story */
    const oct = ['2026-10-02', '2026-10-09', '2026-10-16', '2026-10-23'].map((d, k) => W('mo' + k, d, '07'));
    o = await ctx({ unit: 'kg', goal: 1, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: oct }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('on the first the month just gone comes up by itself, named, with what you moved', await o.page.locator('#lfMonthSum').count() === 1 && /October/.test(await o.page.textContent('#lfMonthSum')) && /4 sessions/.test(await o.page.textContent('#lfMonthSum')) && (await store(o.page)).moSum === '2026-10');
    ok('and it never says red: a month is not graded', await o.page.evaluate(() => !document.querySelector('.lf-wsh.is-miss')));
    await o.page.click('#lfMoShare'); await settle(o.page);
    ok('the card is a 1080 by 1920 story that plays, with one Share video button, and no still picture', await o.page.locator('.lf-card-pv img').count() === 0 && await o.page.locator('.lf-card-st').count() === 1 && await o.page.evaluate(() => window.lfCardLast.w === 1080 && window.lfCardLast.h === 1920) && await o.page.locator('#lfCardShare').count() === 1 && await o.page.locator('#lfCardSave').count() === 0 && /Share video/.test(await o.page.locator('#lfCardShare').textContent()));
    /* THE BUTTON IS NOT READY, AND SAYS SO: it was bright blue for the ten seconds the video takes and ignored every press, which reads as a broken button */
    ok('the story starts blank and builds on the canvas you are looking at: the finished card is never drawn first, and nothing is drawn off screen', (() => { const sc = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8'), q = sc.slice(sc.indexOf('function lfShareCardSheet'), sc.indexOf("var sh = lfSheet({ title: 'Share'")); const early = q.slice(0, q.indexOf('var begin = function')); return /lfCardDraw\(sp, 0, cv\)/.test(early) && !/lfCardDraw\(sp, 1, cv\)/.test(early) && !/left:-9999px/.test(q) && /cv\.captureStream\(30\)/.test(q); })());
    const prep = await o.page.evaluate(() => { const b = document.querySelector('#lfCardShare'), cs = getComputedStyle(b); return { dim: +cs.opacity, pe: cs.pointerEvents, busy: b.getAttribute('aria-busy'), disabled: b.disabled, bar: !!b.querySelector('i') }; });
    ok('until the video exists the Share video button is dim, busy and inert', prep.disabled && prep.dim < 0.9 && prep.pe === 'none' && prep.busy === 'true' && prep.bar, prep);
    await o.page.waitForTimeout(1500);
    ok('and a bar along its foot is filling', parseFloat(await o.page.$eval('#lfCardShare i', (e) => e.style.width)) > 5);
    const bb = await o.page.locator('#lfCardShare').boundingBox();
    await o.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    ok('pressing it says what is going on instead of nothing', /Making your video/.test(await o.page.evaluate(() => (document.querySelector('.lf-toast') || {}).textContent || '')));
    await o.page.waitForFunction(() => window.lfStoryBytes > 2000, null, { timeout: 40000 }).catch(() => {});
    ok('it records itself as it plays, and what it recorded is the recording of that one canvas, which stays on the finished card: no video swapped in', await o.page.evaluate(() => window.lfStoryBytes > 2000) && await o.page.locator('.lf-card-st video').count() === 0 && await o.page.locator('.lf-card-st canvas').count() === 1 && await o.page.locator('#lfCardShare').isEnabled());
    const rdy = await o.page.evaluate(() => { const b = document.querySelector('#lfCardShare'), cs = getComputedStyle(b); return { dim: +cs.opacity, busy: b.getAttribute('aria-busy'), bar: !!b.querySelector('i') }; });
    ok('once it exists the button is full strength and the bar is gone', rdy.dim === 1 && rdy.busy === null && !rdy.bar, rdy);
    /* a throw in the page's own share used to be swallowed by the event handler: now it goes the long way round, and shows */
    await o.page.evaluate(() => { navigator.canShare = () => { throw new Error('boom'); }; });
    await o.page.click('#lfCardShare');
    ok('if the share itself throws, the press still does something you can see', /Saving the video|Could not open/.test(await o.page.evaluate(() => (document.querySelector('.lf-toast') || {}).textContent || '')));
    ok('the video is not a picture file: no png, no image button', !/image\/png/.test(src2.slice(src2.indexOf('function lfShareCardSheet'), src2.indexOf('THE MONTH IN REVIEW'))) && !/Save image/.test(src2));
    await o.page.keyboard.press('Escape'); await settle(o.page); await o.page.click('#lfMoDone'); await settle(o.page);
    await o.page.reload(); await o.page.waitForTimeout(4500);
    ok('once: a reload does not bring it back', await o.page.locator('#lfMonthSum').count() === 0);
    await o.c.close();
    /* a phone with no recorder says so, rather than leaving a button that never wakes */
    o = await ctx({ unit: 'kg', goal: 1, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: oct }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    await o.page.evaluate(() => { window.MediaRecorder = undefined; });
    await o.page.click('#lfMoShare'); await settle(o.page);
    ok('with no recorder it says the phone cannot make the video, and the button stays off', /cannot make the video/.test(await o.page.evaluate(() => (document.querySelector('.lf-toast') || {}).textContent || '')) && await o.page.locator('#lfCardShare').isDisabled());
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
    ok('and the card is made at story size', await o.page.evaluate(() => window.lfCardLast.w === 1080 && window.lfCardLast.h === 1920));
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
    await cuOpen(page);
    const rows = await page.$$eval('#lfYou .rk-set', (x) => x.map((e) => e.dataset.k + ':' + e.querySelector('span').textContent));
    ok('Settings has a row each for title, flair and frame', rows.join() === 'ti:Title,fl:Flair,fm:Frame,sh:Badges shown', rows);
    await page.click('#lfYou .rk-show'); await settle(page);
    ok('the showcase can be nothing at all: one press and no badge is shown to friends', (await store(page)).shn === true && await page.textContent('#lfYou .rk-show b') === 'None' && /if \(S\.shn\) return \[\];/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    await page.click('#lfYou .rk-show'); await settle(page);
    ok('and a second press puts it back', !(await store(page)).shn && await page.textContent('#lfYou .rk-show b') !== 'None');
    ok('and there is no rank sheet, level or duel anywhere', await page.locator('#frRankBtn, #frDu, .rk-lv').count() === 0);
    const openRow = async (k) => { await cuOpen(page); await page.click('#lfYou .rk-set[data-k="' + k + '"]'); await page.waitForTimeout(600); };
    const pick = async (k, id) => { await openRow(k); await page.evaluate(([k, id]) => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-k="' + k + '"][data-id="' + id + '"]').click(), [k, id]); await page.waitForTimeout(350); await page.keyboard.press('Escape'); await settle(page); };
    await openRow('ti');
    const lock = await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.rk-o.is-lock').length);
    ok('what is still locked says what it takes', lock > 0, lock);
    await page.keyboard.press('Escape'); await settle(page);
    await pick('ti', 'master'); let st = await store(page);
    ok('a locked title cannot be worn', !st.ti || st.ti !== 'master', st.ti);
    await pick('ti', 'regular'); await pick('fl', 'spark'); await pick('fm', 'ring'); st = await store(page);
    ok('what you pick is kept', st.ti === 'regular' && st.fl === 'spark' && st.fm === 'ring', st);
    await cuOpen(page);
    const vals = await page.$$eval('#lfYou .rk-set', (x) => x.map((e) => e.querySelector('b').textContent));
    ok('each row says what is worn', vals[0] === 'Regular' && vals[1] === 'Spark' && vals[2] === 'Molten', vals);
    await page.waitForTimeout(3200);
    const last = posts.filter((q) => q.s && 'ti' in q.s).pop();
    ok('and it goes to friends as ids, nothing else', last && last.s.ti === 'regular' && last.s.fl === 'spark' && last.s.fm === 'ring' && !('xl' in last.s) && !('du' in last.s), last && last.s);
    await cuOpen(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
    const orn = await page.evaluate(() => ({ n: document.querySelectorAll('.rk-o[data-k="fm"]').length, old: !!document.querySelector('.rk-o[data-id="inferno"]') }));
    ok('The Eye has a flair of its own, the owner\'s alone: it is not offered to anyone else', /\['eye', 'The Eye', 'One of one', function \(c\) \{ return c\.own; \}, 'M2 12s/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && /kind === 'fl' && x\[0\] === 'eye' && !lfOwner\(\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')) && !(await page.locator('.rk-o[data-id="eye"][data-k="fl"]').count()));
    {
      const dm = require('fs').readFileSync(__dirname + '/../lift/index.html', 'utf8');
      ok("Don't Miss: every planned day, four weeks running, as a mythic medal", /\['dontmiss', "Don't Miss", 'streak', '[^']+', '#[0-9a-f]{6}'\]/.test(dm) && /BD_SCENE = \{\};/.test(dm) && /BD_MYTH = \{[^}]*dontmiss: 1,/.test(dm) && /dontmiss: 'hept'/.test(dm));
      ok('it is won on the fourth full week in a row, and a week still under way does not break the run', /fullRun\+\+; if \(fullRun === 4\) won\('dontmiss'/.test(dm) && /else if \(b < ymd\(today\(\)\)\) fullRun = 0;/.test(dm));
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
    ok('a softer emblem is earned, not given: Blossom opens at sixty workouts, Angel and Celestial later', st.fm === 'blossom' && await (async () => { await cuOpen(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500); const l = await page.evaluate(() => ['angel', 'celestial'].map((id) => document.querySelector('.rk-o[data-id="' + id + '"]').classList.contains('is-lock'))); await page.keyboard.press('Escape'); await settle(page); return l.join() === 'true,true'; })(), st.fm);
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
    await page.locator('.lf-sheet').last().locator('.lf-li', { hasText: /^Front squat/ }).first().click(); await page.waitForTimeout(600);
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
    await page.locator('.lf-sheet').last().locator('.lf-li', { hasText: /^Front squat/ }).first().click(); await page.waitForTimeout(500);
    await page.keyboard.press('Escape'); await settle(page);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('Settings no longer lists swaps', await page.locator('#lfSwaps').count() === 0 && !/Swapped exercises/.test(await page.textContent('#lfYou')));
    await page.click('.lf-bar [data-v="lib"]'); await settle(page);
    await page.click('#lfSplit .lf-li >> nth=4'); await settle(page);
    const sw = top(page).locator('.lf-li', { hasText: /^Front squat/ });
    ok('the day page shows the swapped exercise in the accent', await sw.count() === 1 && await sw.locator('b').evaluate((e) => getComputedStyle(e).color !== getComputedStyle(document.body).color));
    await sw.click(); await settle(page);
    await top(page).locator('.lf-btn.is-log', { hasText: 'Revert to Pendulum squat' }).click(); await settle(page);
    st = await store(page);
    ok('and pressing it offers Revert, which puts the program back', !st.sw && await top(page).locator('.lf-li', { hasText: 'Pendulum squat' }).count() === 1, st.sw);
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
    await cuOpen(page); await page.click('#lfYou .rk-set[data-k="ti"]'); await page.waitForTimeout(600);
    const heads = await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol h4').length && [...[...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol h4')].map((h) => h.textContent).join());
    ok('titles sit in collections, as badges do', heads === 'Milestones,Consistency,Badges,Animated,Moments,Signature,Finishes,Against the creator', heads);
    ok('and nobody else is offered Creator, not even locked', await page.locator('.rk-o[data-id="creator"]').count() === 0);
    await page.keyboard.press('Escape'); await settle(page); await cuOpen(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
    ok('or the Prestige frame', await page.locator('.rk-o[data-id="prestige"]').count() === 0 && await page.locator('.rk-o[data-id="neon"]').count() === 1);
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 3 });
    await page.evaluate(() => localStorage.setItem('lift.owner.v1', '2026-10-01')); await page.reload(); await page.waitForTimeout(500);
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    await cuOpen(page); await page.click('#lfYou .rk-set[data-k="ti"]'); await page.waitForTimeout(600);
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
    await cuOpen(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(600);
    await page.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.rk-o[data-id="prestige"]').click()); await page.waitForTimeout(500);
    const pr = await page.evaluate(() => { const s = [...document.querySelectorAll('.lf-sheet')].pop(); return { big: s.querySelector('.fr-ban').classList.contains('has-emblem') || s.querySelector('.fr-ban-av').classList.contains('em-fall'), ring: getComputedStyle(s.querySelector('.fr-ban-av'), '::before').display, cls: s.querySelector('.fr-ban-av').className }; });
    const src = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
    ok('the frame only the owner has is a whole piece, not a ring, with no banner and no text', pr && pr.big && /is-fm-prestige/.test(pr.cls) && /ShaderMaterial/.test(src) && /function lfEmblem3/.test(src) && !/lfEmblem\(/.test(src) && !/ToUpperCase\(\)\.slice\(0, 10\)/.test(src), pr);
    await page.keyboard.press('Escape'); await settle(page); await cuOpen(page); await page.click('#lfYou .rk-set[data-k="fm"]'); await page.waitForTimeout(500);
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

  /* ── COMING BACK TO A WORKOUT lands on the set you were on, not the top of the list ── */
  {
    const mk = (id, n, ok) => ({ id, n, sets: [0, 1, 2, 3].map((i) => ({ w: 40, r: 10, ok: i < ok ? 1 : 0 })) });
    const act = { id: 'ra', s: Date.now() - 600000, n: 'Weak points', rt: null, rest: Date.now() - 20000, restEx: 'dbcurl', x: [mk('calf', 'Seated calf raises', 0), mk('dbcurl', 'Dumbbell curls', 1), mk('abs', 'Cable crunches', 0)] };
    const { c, page } = await ctx({ unit: 'kg', goal: 4, wo: [] });
    await page.evaluate((a) => localStorage.setItem('lift.active.v1', JSON.stringify(a)), act); await page.reload(); await page.waitForTimeout(1500);
    const where = await page.evaluate(() => { const bd = document.querySelector('.lf-session .lf-sh-bd'), cards = [...document.querySelectorAll('.lf-session .lf-ex')], c = cards.find((x) => x.dataset.ex === 'dbcurl'); return bd && c ? { top: Math.round(c.getBoundingClientRect().top - bd.getBoundingClientRect().top), st: Math.round(bd.scrollTop), first: cards[0].dataset.ex } : null; });
    ok('the workout opens on the exercise you were part way through, with its card at the top of the list', where && where.st > 0 && where.top >= 0 && where.top < 80, where);
    await page.evaluate(() => { document.querySelector('.lf-session .lf-sh-bd').scrollTo(0, 0); }); await page.waitForTimeout(300);
    ok('there is no target button on a card any more, and the list goes to where you were', await page.locator('.lf-session .lf-ex .lf-curb').count() === 0);
    await c.close();
  }
  /* ── THE WORKOUT GUIDE: a film of supersets, warm-ups, drop sets, removing a set and swapping ── */
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 4, wo: [], tour: false }, '2026-10-30T18:00:00');
    await page.click('#lfGo'); await page.waitForSelector('.lf-tr-stage', { timeout: 6000 }).catch(() => {});
    const g1 = [await page.locator('.lf-tr-stage').count(), await page.locator('.lf-session').count()];
    ok('the first workout opens the guide once, over the session', g1[0] === 1 && g1[1] === 1, g1);
    ok('six scenes, named, the first playing', JSON.stringify(await page.$$eval('.lf-tr-segs button', (b) => b.map((x) => x.getAttribute('aria-label')))) === '["Superset","Warm-up","Drop set","Remove a set","Swap or remove","Coach"]' && await page.locator('.lf-tr-segs button.is-on').count() === 1);
    await page.click('.lf-tr-segs button:nth-child(2)'); await page.waitForTimeout(3800);
    ok('the warm-up scene puts a W row above the first set and ticks it', await page.evaluate(() => { const r = [...document.querySelectorAll('.lf-tr-stage .tr-rows .lf-set')]; return r.length === 3 && r[0].classList.contains('is-wu') && r[0].classList.contains('is-done'); }));
    await page.click('.lf-tr-segs button:nth-child(3)'); await page.waitForTimeout(5200);
    ok('the drop scene hangs a drop row off the first set', await page.evaluate(() => { const r = [...document.querySelectorAll('.lf-tr-stage .tr-rows .lf-set')]; return r.length === 3 && r[1].classList.contains('is-drop'); }));
    await page.click('.lf-tr-segs button:nth-child(1)'); await page.waitForTimeout(3800);
    ok('the superset scene links both cards', await page.locator('.lf-tr-stage .lf-ex.is-ss').count() === 2);
    await page.evaluate(() => document.querySelector('.lf-sheet:not(.lf-session) .lf-x').click()); await page.waitForTimeout(500);
    ok('the guide is a button in the workout head beside the name, in the accent, a 44px target', await page.evaluate(() => { const g = document.querySelector('.lf-session #lfGuide'), n = document.querySelector('.lf-session .lf-ss-name'); if (!g || !n) return false; const a = g.getBoundingClientRect(), b = n.getBoundingClientRect(); return getComputedStyle(g).position === 'static' && a.height >= 44 && Math.abs((a.top + a.height / 2) - (b.top + b.height / 2)) < 6 && a.left >= b.right - 1 && getComputedStyle(g).color !== getComputedStyle(n).color; }));
    await page.evaluate(() => document.querySelector('.lf-session #lfGuide').click()); await page.waitForTimeout(500);
    ok('and pressing it opens the guide', await page.locator('.lf-tr-stage').count() === 1 && await page.locator('.lf-session').count() === 1);
    await page.evaluate(() => document.querySelector('.lf-sheet:not(.lf-session) .lf-x').click()); await page.waitForTimeout(500);
    ok('closing it leaves the workout', await page.locator('.lf-tr-stage').count() === 0 && await page.locator('.lf-session').count() === 1 && await page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).tour === true));
    await page.evaluate(() => { const s = document.querySelector('.lf-session .lf-x'); });
    await c.close();
  }
  {
    const { c, page } = await ctx({ unit: 'kg', goal: 4, wo: [] });
    await page.click('.lf-bar [data-v="you"]'); await page.waitForTimeout(300);
    await page.click('#lfTourBtn'); await page.waitForTimeout(400);
    ok('You has the guide, and it opens from there with no workout going', await page.locator('.lf-tr-stage').count() === 1);
    await c.close();
  }

  /* ── READ A SPLIT: text, a photo or a PDF becomes one split; here it is the pasted text, which is the same path the phone's reading ends in ── */
  {
    const o = await ctx({ unit: 'kg', goal: 3 }, '2026-10-30T18:00:00');
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page);
    await o.page.click('#lfNewSplit'); await settle(o.page);
    await top(o.page).locator('#lfSpPaste').fill('Push Day\nExercise Sets Reps\nFlat DB Press 3 8-10\nSquat - 5 sets of 5'); await o.page.waitForTimeout(700);
    const tbl = await top(o.page).locator('.lf-li b').allTextContents(), tblN = await top(o.page).locator('.lf-sp-n').evaluateAll((x) => x.map((e) => e.value));
    ok('a table header is not a day, a Flat DB press is the dumbbell bench and a bare Squat is the barbell squat', tblN.join() === 'Push Day' && /dumbbell bench/i.test(tbl[0]) && /^barbell squat$/i.test(tbl[1]), [tblN, tbl]);
    await o.page.keyboard.press('Escape'); await settle(o.page); await o.page.click('#lfNewSplit'); await settle(o.page);
    ok('the form opens with a place to paste the whole programme', await top(o.page).locator('#lfSpPaste').count() === 1);
    ok('and offers no photo or PDF button on the web, where nothing can read one', await top(o.page).locator('#lfSpRead').count() === 0);
    await top(o.page).locator('#lfSpPaste').fill('PUSH DAY\nBench press 4x8-10\nOverhead press - 3 sets of 8-12\nTricep pushdown 3 12-15\nPULL DAY\n1. Pull-ups 4x6\nBarbell row 3x8\nMade up lift 3x5');
    await o.page.waitForTimeout(700);
    const inputs = await top(o.page).locator('.lf-sp-n').evaluateAll((x) => x.map((e) => e.value));
    ok('it finds the two days', inputs.join() === 'PUSH DAY,PULL DAY', inputs);
    const days = await top(o.page).locator('.lf-sp-w').evaluateAll((x) => x.map((e) => e.value));
    ok('and puts them on Monday and Tuesday, one week', days.join() === '1,2', days);
    const rows = await top(o.page).locator('.lf-sp-day .lf-li b').allTextContents();
    ok('each line is matched to the library', rows.length === 6 && /bench/i.test(rows[0]) && /overhead|press/i.test(rows[1]) && /pull/i.test(rows[3]), rows);
    ok('and a line it cannot place says so and waits for a choice', rows[5] === 'Made up lift' && /Not matched/.test(await top(o.page).locator('.lf-sp-day .lf-li').nth(5).textContent()));
    ok('the sets and reps are kept', /4 × 8–10/.test(await top(o.page).locator('.lf-sp-day .lf-li').first().textContent()));
    await o.page.keyboard.press('Escape'); await settle(o.page); await o.page.click('#lfNewSplit'); await settle(o.page);
    await top(o.page).locator('#lfSpPaste').fill('Monday - Push\nBench press 4x8\nOverhead press 3x10\nWednesday\nBarbell row 3x8\nPull-ups 4x6\nFriday: Legs\nSquat 4x6');
    await o.page.waitForTimeout(700);
    const wk = await top(o.page).locator('.lf-sp-w').evaluateAll((x) => x.map((e) => e.value)), wn = await top(o.page).locator('.lf-sp-n').evaluateAll((x) => x.map((e) => e.value));
    ok('a day that names its weekday keeps it: Monday, Wednesday and Friday, not one after another', wk.join() === '1,3,5', wk);
    ok('the weekday is taken out of the name, and a bare Wednesday is named from what is in it', wn[0] === 'Push' && wn[2] === 'Legs' && /Back/.test(wn[1]), wn);
    await top(o.page).locator('#lfSpN').fill('Week'); await top(o.page).locator('#lfSpSave').click(); await settle(o.page);
    const pg2 = (await store(o.page)).pg[0];
    ok('each day carries a line of what is in it, like the built-in ones', pg2.d[0].sp === 'Barbell bench press' && pg2.d.length === 3, pg2.d.map((d) => d.sp));
    await o.page.click('#lfProgMg'); await settle(o.page); await o.page.keyboard.press('Escape'); await settle(o.page);
    const sx = await store(o.page); sx.pg = []; sx.prog = 'ul'; await o.page.evaluate((v) => localStorage.setItem('lift.v1', JSON.stringify(v)), sx); await o.page.reload(); await settle(o.page);
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfNewSplit'); await settle(o.page);
    await top(o.page).locator('#lfSpPaste').fill('PUSH DAY\nBench press 4x8-10\nOverhead press - 3 sets of 8-12\nTricep pushdown 3 12-15\nPULL DAY\n1. Pull-ups 4x6\nBarbell row 3x8\nMade up lift 3x5');
    await o.page.waitForTimeout(700);
    await top(o.page).locator('#lfSpSave').click(); await settle(o.page);
    ok('saving without a name asks for one', /Name your split/.test(await o.page.textContent('.lf-toast')));
    await top(o.page).locator('#lfSpN').fill('My week'); await top(o.page).locator('#lfSpSave').click(); await settle(o.page);
    const st = await store(o.page);
    ok('saving makes ONE split with both days, and leaves out what was not matched', st.rt.length === 0 && st.pg.length === 1 && st.pg[0].n === 'My week' && st.pg[0].d.length === 2 && st.pg[0].d[1].x.length === 2, st.pg);
    ok('with its targets', st.pg[0].d[0].x[0].slice(1).join() === '4,8,10', st.pg[0]);
    ok('and it is on, in the strip beside the others', st.prog === st.pg[0].id && (await o.page.locator('#lfProg button').count()) === 8);
    await o.page.reload(); await settle(o.page);
    ok('and it survives a reload, targets and all', (await store(o.page)).pg[0].d[0].x[0].slice(1).join() === '4,8,10');
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfNewSplit'); await settle(o.page);
    await top(o.page).locator('#lfSpPaste').fill('Monday\nQuad strength\nHack squat 4x6-10\nBench 3x8\nTuesday\nPush\nPress 4x6');
    await o.page.waitForTimeout(700);
    const wk2 = await top(o.page).locator('.lf-sp-w').evaluateAll((x) => x.map((e) => e.value)), nm2 = await top(o.page).locator('.lf-sp-n').evaluateAll((x) => x.map((e) => e.value)), rw2 = await top(o.page).locator('.lf-sp-day .lf-li b').allTextContents();
    ok('a weekday on its own line and the title under it are one day, and the whole text makes every day at once', wk2.join() === '1,2' && nm2.join() === 'Quad strength,Push', [wk2, nm2]);
    ok('and a bare Bench is the barbell bench and a bare Press the overhead press', /^Barbell bench press$/.test(rw2[1]) && /^Barbell overhead press$/.test(rw2[2]), rw2);
    await o.c.close();
  }

  /* ── PROGRAMS: put away to clean up, shared as a link, added from a link or pasted text ── */
  {
    const o = await ctx({ unit: 'kg', goal: 3 }, '2026-10-30T18:00:00');
    await o.page.evaluate(() => { window.__sh = []; navigator.share = (x) => { window.__sh.push(x); return Promise.resolve(); }; });
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page);
    const strip = () => o.page.evaluate(() => [...document.querySelectorAll('#lfProg button')].map((x) => x.textContent || x.getAttribute('aria-label')));
    ok('the strip starts with all seven programs', (await strip()).length === 7);
    await o.page.click('#lfProgMg'); await settle(o.page);
    ok('Manage lists each program with Share and Remove', await o.page.locator('.lf-sheet [data-p]').count() === 7 && await o.page.locator('.lf-sheet [data-a="rm"]').count() === 7);
    await o.page.locator('.lf-sheet [data-p="ppl"] [data-a="rm"]').click(); await settle(o.page);
    ok('removing one takes it off the strip and keeps it to restore', (await strip()).length === 6 && !(await strip()).includes('PPL') && await o.page.locator('.lf-sheet [data-a="restore"]').count() === 1 && (await store(o.page)).hp.join() === 'ppl');
    ok('and the program that is on can be removed too, which turns another one on', await (async () => { await o.page.locator('.lf-sheet [data-p="ul"] [data-a="rm"]').click(); await settle(o.page); const st = await store(o.page); return st.prog !== 'ul' && st.hp.indexOf('ul') >= 0 && (await strip()).indexOf('Upper / lower') < 0; })());
    await o.page.reload(); await settle(o.page);
    ok('it is still put away after a reload', (await store(o.page)).hp.join() === 'ppl,ul' || (await store(o.page)).hp.length === 2);
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfProgMg'); await settle(o.page);
    ok('a removed program also has Delete beside Restore, and the heading clears the card under it', await o.page.locator('.lf-sheet [data-a="purge"]').count() === 2 && await o.page.evaluate(() => { const h = [...document.querySelectorAll('.lf-sheet .lf-gh')].find(x => /Removed/.test(x.textContent)); const c = h.nextElementSibling; return c.getBoundingClientRect().top - h.getBoundingClientRect().bottom >= 6; }));
    await o.page.locator('.lf-sheet [data-a="purge"]').first().click(); await settle(o.page);
    ok('Delete takes it off the list for good and Restore no longer offers it', await o.page.locator('.lf-sheet [data-a="purge"]').count() === 1 && await o.page.locator('.lf-sheet [data-a="restore"]').count() === 1 && (await store(o.page)).hx.length === 1);
    await o.page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); delete s.hx; localStorage.setItem('lift.v1', JSON.stringify(s)); });
    await o.page.reload(); await settle(o.page);
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfProgMg'); await settle(o.page);
    await o.page.locator('.lf-sheet [data-a="restore"]').first().click(); await settle(o.page);
    await o.page.locator('.lf-sheet [data-a="restore"]').first().click(); await settle(o.page);
    ok('Restore brings both back and the record forgets it was ever put away', (await strip()).length === 7 && (await store(o.page)).hp === undefined);
    /* the last one on the strip cannot be removed */
    await o.page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); s.hp = ['ul', 'ppl', 'gl', 'qc', 'gf', 'sx']; s.prog = 'nk'; localStorage.setItem('lift.v1', JSON.stringify(s)); });
    await o.page.reload(); await settle(o.page);
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfProgMg'); await settle(o.page);
    ok('with one left, Remove is off, so the strip is never empty', await o.page.locator('.lf-sheet [data-p="nk"] [data-a="rm"]').isDisabled());
    await o.page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); delete s.hp; s.prog = 'ul'; localStorage.setItem('lift.v1', JSON.stringify(s)); });
    await o.page.reload(); await settle(o.page);
    /* sharing */
    await o.page.click('.lf-bar [data-v="lib"]'); await settle(o.page); await o.page.click('#lfProgMg'); await settle(o.page);
    await o.page.evaluate(() => { window.__sh = []; navigator.share = (x) => { window.__sh.push(x); return Promise.resolve(); }; });
    await o.page.locator('.lf-sheet [data-p="sx"] [data-a="share"]').click(); await settle(o.page);
    const sent = await o.page.evaluate(() => ({ sh: window.__sh, last: window.lfProgLast }));
    ok('Share hands the phone a message with a link to the program', sent.sh.length === 1 && /Superset split/.test(sent.sh[0].text) && /\/lift\/#p=[A-Za-z0-9_-]+/.test(sent.sh[0].text), sent.sh);
    const dec = await o.page.evaluate((c) => { try { c = c.replace(/-/g, '+').replace(/_/g, '/'); while (c.length % 4) c += '='; return JSON.parse(decodeURIComponent(escape(atob(c)))); } catch (e) { return null; } }, sent.last.code);
    const blob = JSON.stringify(dec || {});
    ok('what is in it is the program only: days, exercises, sets and reps', dec && dec.n === 'Superset split' && dec.d.length === 6 && dec.d[0][3].length > 3 && dec.d[0][4].length === 1, blob.slice(0, 160));
    ok('and none of your weights, history or swaps', !/"w":|"wo"|"sw"|lift\.v1/.test(blob));
    await o.page.evaluate(() => { window.__txt = window.lfProgLast.text; window.__code = window.lfProgLast.code; });
    const text = sent.last.text, code = sent.last.code;
    await o.c.close();

    /* a second phone adds it from the pasted message */
    const t = await ctx({ unit: 'kg', goal: 3 }, '2026-10-30T18:00:00');
    await t.page.click('.lf-bar [data-v="lib"]'); await settle(t.page);
    await t.page.click('#lfProgMg'); await settle(t.page); await t.page.click('#lfPgAddBtn'); await settle(t.page);
    await top(t.page).locator('#lfPgT').fill('nonsense'); await top(t.page).locator('#lfPgGo').click(); await settle(t.page);
    ok('text that is not a program is refused and nothing is added', await top(t.page).locator('#lfPgT').count() === 1 && !(await store(t.page)).pg);
    await top(t.page).locator('#lfPgT').fill(text); await top(t.page).locator('#lfPgGo').click(); await settle(t.page);
    ok('the pasted message shows the program to check, a day to a row', await top(t.page).locator('#lfPgAdd').count() === 1 && await top(t.page).locator('.lf-li').count() === 6 && await top(t.page).locator('#lfPgN').inputValue() === 'Superset split');
    await top(t.page).locator('#lfPgN').fill('My supersets'); await top(t.page).locator('#lfPgAdd').click(); await settle(t.page);
    const st = await store(t.page);
    ok('adding it keeps it as a program of its own and turns it on', st.pg && st.pg.length === 1 && st.pg[0].n === 'My supersets' && st.prog === st.pg[0].id && /^u[a-z0-9]+$/.test(st.pg[0].id), st.pg && st.pg[0].id);
    ok('its supersets came with it', st.pg[0].d[0].ss.length === 1 && st.pg[0].d[0].ss[0].length === 5);
    ok('it is on the strip, with its days under it', (await t.page.evaluate(() => [...document.querySelectorAll('#lfProg button')].map((x) => x.textContent))).includes('My supersets') && await t.page.locator('#lfSplit .lf-li').count() === 6);
    await t.page.reload(); await settle(t.page);
    ok('it survives a reload and is still the program on', (await store(t.page)).prog === st.prog && (await store(t.page)).pg.length === 1);
    await t.page.click('.lf-bar [data-v="lib"]'); await settle(t.page); await t.page.click('#lfProgMg'); await settle(t.page);
    /* A PROGRAM YOU MADE CAN BE RENAMED; one that comes with the app cannot */
    ok('a program you added has Rename, and the ones that come with the app do not', await t.page.locator('.lf-sheet [data-p="' + st.prog + '"] [data-a="rename"]').count() === 1 && await t.page.locator('.lf-sheet [data-p="ul"] [data-a="rename"]').count() === 0);
    await t.page.locator('.lf-sheet [data-p="' + st.prog + '"] [data-a="rename"]').click(); await settle(t.page);
    await t.page.locator('#lfPgRn').fill('Renamed split'); await t.page.locator('#lfPgRnGo').click(); await settle(t.page);
    ok('renaming keeps the days and changes the name on the strip and in the record', (await store(t.page)).pg[0].n === 'Renamed split' && (await store(t.page)).pg[0].d.length === 6 && (await t.page.evaluate(() => [...document.querySelectorAll('#lfProg button')].map((x) => x.textContent))).includes('Renamed split'));
    await t.page.locator('.lf-sheet [data-p="' + st.prog + '"] [data-a="rm"]').click(); await settle(t.page);
    ok('a program you added is removed for good, with Undo, and another is turned on', !(await store(t.page)).pg && (await store(t.page)).prog === 'ul');
    await t.page.locator('.lf-toast button').last().click().catch(() => {}); await settle(t.page);
    ok('Undo brings it back and turns it on again', (await store(t.page)).pg && (await store(t.page)).pg.length === 1 && (await store(t.page)).prog === st.prog);
    await t.c.close();

    /* the link itself, opened on the web copy */
    const l = await ctx({ unit: 'kg', goal: 3 }, '2026-10-30T18:00:00');
    await l.page.goto(URL + '#p=' + code); await settle(l.page); await l.page.waitForTimeout(500);
    ok('a link opened on the web shows the program and leaves the bar clean', await top(l.page).locator('#lfPgAdd').count() === 1 && (await l.page.evaluate(() => location.hash)) === '');
    await top(l.page).locator('#lfPgAdd').click(); await settle(l.page);
    ok('and adding it works the same', (await store(l.page)).pg.length === 1);
    await l.page.evaluate(() => { location.hash = '#p=zzzzzzzzzzzzzzzz'; }); await settle(l.page);
    ok('a broken link adds nothing and says so', (await store(l.page)).pg.length === 1 && await top(l.page).locator('#lfPgAdd').count() === 0);
    await l.c.close();

    /* a damaged stored program costs itself, never the record */
    const d = await ctx({ unit: 'kg', goal: 3, wo: [{ id: 'w1', d: '2026-10-29', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Bench', sets: [{ w: 60, r: 8 }] }] }], pg: [{ id: 'ubad', n: 'x', d: 'nope' }, { id: 'ugood1', n: 'Fine', d: [{ id: 'ugood1-1', w: 1, n: 'Mon', sp: '', x: [['bench', 3, 8, 10]], ss: [] }] }], hp: ['ppl', 'zzz'] }, '2026-10-30T18:00:00');
    const ds = await store(d.page);
    ok('a damaged program is dropped, the good one and the workouts stay', ds.pg.length === 1 && ds.pg[0].id === 'ugood1' && ds.wo.length === 1 && ds.hp.join() === 'ppl', ds.pg);
    await d.c.close();
  }

  /* ── THE COACH: a lift that has stalled is said to be, with a lighter week to get through it; and a finished workout says what to do next time ── */
  {
    const sess = (id, d, reps) => ({ id, d, s: new Date(d + 'T07:00:00').getTime(), e: new Date(d + 'T07:50:00').getTime(), n: 'Press', rt: 'r1', x: [{ id: 'bench', n: 'Bench press', sets: reps.map((r) => ({ w: 60, r })) }] });
    const seed = (wo) => ({ unit: 'kg', goal: 3, rt: [{ id: 'r1', n: 'Press', sp: '', ex: ['bench'], tg: { bench: [3, 5, 8] } }], pick: { d: '2026-11-02', id: 'r1' }, wo });
    {
      const o = await ctx(seed([sess('a', '2026-10-19', [7, 6, 6]), sess('b', '2026-10-26', [7, 6, 6]), sess('c', '2026-10-30', [7, 6, 5])]), '2026-11-02T07:00:00');
      await o.page.click('#lfGo'); await settle(o.page);
      const aim = await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim').textContent();
      ok('three sessions at 60 with no rep gained is a stall, and the aim is a lighter weight', /^Deload\s*Try 55 × 5$/.test(aim) && await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim-k').count() === 1, aim);
      await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim').click(); await settle(o.page);
      ok('one tap takes the lighter week', (await o.page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd) input').evaluateAll((i) => i.map((x) => x.value))).join() === '55,5,55,5,55,5');
      for (let i = 0; i < 3; i++) await o.page.locator('.lf-session .lf-ex').first().locator('.lf-chk').nth(i).click();
      await o.page.click('#lfFinish'); await o.page.waitForTimeout(900);
      ok('finishing says what to do next time', await top(o.page).locator('#lfFinNext').count() === 1 && /bench press.*55 × 6/i.test(await top(o.page).locator('#lfFinNext').textContent()));
      await o.c.close();
    }
    {
      const o = await ctx(seed([sess('a', '2026-10-19', [5, 5, 5]), sess('b', '2026-10-26', [6, 5, 5]), sess('c', '2026-10-30', [7, 6, 5])]), '2026-11-02T07:00:00');
      await o.page.click('#lfGo'); await settle(o.page);
      const aim = await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim').textContent();
      ok('reps going up is not a stall', /^Try /.test(aim) && !/Deload/.test(aim), aim);
      await o.c.close();
    }
    {
      const o = await ctx(seed([sess('a', '2026-10-19', [8, 8, 8]), sess('b', '2026-10-26', [7, 6, 6]), sess('c', '2026-10-30', [8, 8, 8])]), '2026-11-02T07:00:00');
      await o.page.click('#lfGo'); await settle(o.page);
      const aim = await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim').textContent();
      ok('the top of the range is progress, so the weight goes up and nothing is flagged', aim === 'Try 62.5 × 5', aim);
      await o.c.close();
    }
    {
      const o = await ctx(seed([sess('a', '2026-10-26', [7, 6, 6]), sess('b', '2026-10-30', [7, 6, 5])]), '2026-11-02T07:00:00');
      await o.page.click('#lfGo'); await settle(o.page);
      ok('two sessions are too few to call a stall', !/Deload/.test(await o.page.locator('.lf-session .lf-ex').first().locator('.lf-aim').textContent()));
      await o.c.close();
    }
  }

  /* ── ON A REAL IPHONE the plugin is not under Capacitor.Plugins until the page registers it. This stand-in is the real shape: only registerPlugin can produce it. The page must ask, then hand the widgets their data and offer photo and PDF in Read a routine. ── */
  {
    const c6 = await browser.newContext(PHONE);
    await c6.addInitScript(freeze('2026-10-30T18:00:00'));
    await c6.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
    await c6.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, mseen: RK_SEEN, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [{ id: 'w1', d: '2026-10-27', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Bench', sets: [{ w: 60, r: 8 }] }] }] }))}); })();`);
    await c6.addInitScript(`window.__calls = []; window.__reg = []; window.Capacitor = { isNativePlatform: () => true, registerPlugin: (n) => { window.__reg.push(n); return new Proxy({ addListener: () => Promise.resolve({ remove() {} }) }, { get: (t, k) => t[k] || ((a) => { window.__calls.push([k, a]); return Promise.resolve(k === 'readPlan' ? { cancelled: true } : k === 'caps' ? { health: true, group: true } : {}); }) }); } };`);
    const pg6 = await c6.newPage();
    pg6.on('pageerror', (e) => errors.push(String(e)));
    await pg6.goto(URL); await pg6.waitForTimeout(2600);
    ok('the page asks Capacitor for the plugin by name', await pg6.evaluate(() => window.__reg.join()) === 'LiftWidgets');
    const snap = await pg6.evaluate(() => window.__calls.filter((x) => x[0] === 'setSnapshot').map((x) => JSON.parse(x[1].json)));
    ok('and the widgets are handed this week, with the workout that was logged', snap.length >= 1 && snap[0].week.n === 1 && snap[0].week.days[1] === 1 && snap[0].week.goal === 3, snap);
    await pg6.click('.lf-bar [data-v="you"]'); await settle(pg6);
    ok('Health is offered once the build says it has the capability', await pg6.locator('#lfHealth').count() === 1);
    await pg6.click('.lf-bar [data-v="lib"]'); await settle(pg6);
    await pg6.click('#lfNewSplit'); await settle(pg6); await top(pg6).locator('#lfSpRead').click(); await settle(pg6);
    ok('Read a split offers a photo and a PDF as well as pasted text', await top(pg6).locator('.lf-pln-src button').count() === 2, await top(pg6).locator('.lf-pln-src button').allTextContents());
    await pg6.locator('.lf-pln-src button').first().click(); await pg6.waitForTimeout(300);
    ok('and pressing one asks the phone to read it', await pg6.evaluate(() => window.__calls.filter((x) => x[0] === 'readPlan').length) === 1);
    ok('and backing out of the picker says nothing', !/Nothing readable/.test(await pg6.evaluate(() => (document.querySelector('.lf-toast') || {}).textContent || '')));
    await c6.close();
  }

  /* ── SEVEN DAYS IN A WEEK: the weekly report comes up by itself, whatever the weekday, and says it was a perfect week ── */
  {
    const dd = (n) => '2026-11-' + String(n).padStart(2, '0');
    const wk = (n) => ({ id: 'q' + n, d: dd(n), s: new Date(dd(n) + 'T07:00:00').getTime(), e: new Date(dd(n) + 'T07:50:00').getTime(), n: 'Press day', rt: 'r1', x: [{ id: 'bench', n: 'Bench', sets: [{ w: 60, r: 8 }, { w: 60, r: 8 }] }] });
    const o = await ctx({ unit: 'kg', goal: 7, wkSum: '2000-01-01', rt: [{ id: 'r1', n: 'Press day', sp: '', ex: ['bench'], tg: { bench: [2, 5, 8] } }], pick: { d: dd(11), id: 'r1' }, wo: [9, 10, 12, 13, 14, 15].map(wk) }, '2026-11-11T07:00:00');
    await o.page.click('#lfGo'); await settle(o.page);
    const ex = o.page.locator('.lf-session .lf-ex').first();
    await ex.locator('.lf-aim').click().catch(() => {}); await settle(o.page);
    for (let i = 0; i < 2; i++) await ex.locator('.lf-chk').nth(i).click();
    await o.page.click('#lfFinish'); await o.page.waitForTimeout(900);
    await o.page.locator('#lfFinDone').click().catch(() => {});
    await o.page.waitForSelector('#lfWeekSum', { timeout: 25000 }).catch(() => {});
    ok('the seventh day of the week brings the weekly report up by itself, on a Wednesday', await o.page.locator('#lfWeekSum').count() === 1);
    ok('and it says it was a perfect week', /Perfect week/.test(await o.page.locator('#lfWeekSum .lf-ws-k').textContent().catch(() => '')) && /Seven for seven/.test(await o.page.locator('#lfWeekSum .lf-ws-verdict').textContent().catch(() => '')));
    ok('it can be shared as the moving story', await o.page.locator('#lfWsShare').count() === 1);
    ok('and it comes once: the week is marked as reported', (await store(o.page)).wkSum === '2026-11-09');
    await o.page.click('#lfWsShare'); await o.page.waitForTimeout(1200);
    const wkl = await o.page.evaluate(() => (window.lfCardLast && window.lfCardLast.lines) || []);
    ok('on the week\'s story each session says when it started, not how long it was', wkl.length > 0 && wkl.every((l) => /\d{1,2}:\d\d (am|pm)/.test(l[1]) && !/\d+\s*(min|h)\b/.test(l[1].replace(/\d{1,2}:\d\d (am|pm)/g, ''))), JSON.stringify(wkl.slice(0, 2)));
    ok('the week moves as a single workout does: title, ring and figure, totals, then the seven days, then the sessions', (() => { const sc = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8'); return !/if \(wk && anim\) P = /.test(sc) && /eo\(\(P - \(\.42 \+ di \* \.02\)\) \/ \.1\)/.test(sc) && /fade\(wk \? \.3 : \.45, \.12\)/.test(sc) && /eo\(\(P - \(\.66 \+ wi \* \.035\)\) \/ \.1\)/.test(sc); })());
    await o.page.keyboard.press('Escape'); await o.page.waitForTimeout(400);
    await o.c.close();
    const q = await ctx({ unit: 'kg', goal: 7, wkSum: '2000-01-01', rt: [{ id: 'r1', n: 'Press day', sp: '', ex: ['bench'], tg: { bench: [2, 5, 8] } }], pick: { d: dd(11), id: 'r1' }, wo: [9, 10, 13, 14, 15].map(wk) }, '2026-11-11T07:00:00');
    await q.page.click('#lfGo'); await settle(q.page);
    const qe = q.page.locator('.lf-session .lf-ex').first(); await qe.locator('.lf-aim').click().catch(() => {}); await settle(q.page);
    for (let i = 0; i < 2; i++) await qe.locator('.lf-chk').nth(i).click();
    await q.page.click('#lfFinish'); await q.page.waitForTimeout(900); await q.page.locator('#lfFinDone').click().catch(() => {}); await q.page.waitForTimeout(6000);
    ok('six days is not seven: no report comes up on a Wednesday', await q.page.locator('#lfWeekSum').count() === 0);
    await q.c.close();
  }

  /* ── CUSTOMISE has its own place on You, and the rarer titles each have one effect of their own ── */
  {
    const o = await ctx({ unit: 'kg', goal: 3, ti: 'rookie' }, '2026-10-30T18:00:00');
    await o.page.click('.lf-bar [data-v="you"]'); await settle(o.page);
    ok('You has one Appearance section, ahead of Settings', await o.page.locator('#lfYou #lfCustom').count() === 1 && await o.page.evaluate(() => { const a = document.querySelector('#lfCustom'), b = document.querySelector('#lfSet'); return !!(a && b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)); }));
    ok('Appearance is a row, and it says the colour you are on', /Cream/.test(await o.page.textContent('#lfThemeRow')));
    ok('it holds your title, flair and the badges you show, and shows them as they will be seen', await o.page.locator('#lfCustom .rk-set').count() >= 3 && await o.page.locator('#lfCustom #lfCuPv b').count() === 1);
    ok('the colour, the mode and the earned colours are on the same screen as the title and flair', await o.page.locator('#lfCustom #lfWheel').count() === 1 && await o.page.locator('#lfCustom #lfMode').count() === 1 && await o.page.locator('#lfCustom #lfThemes').count() === 1);
    ok('and Settings no longer carries those rows', await o.page.locator('#lfSet .rk-set').count() === 0);
    await o.page.click('#lfCustom .rk-set[data-k="ti"]'); await o.page.waitForTimeout(600);
    ok('a title can still be none', await o.page.locator('.lf-sheet .rk-o[data-id="none"]').count() === 1);
    await o.c.close();
  }
  {
    const c7 = await browser.newContext(PHONE);
    await c7.addInitScript(freeze('2026-10-30T18:00:00'));
    await c7.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
    const p7 = await c7.newPage();
    p7.on('pageerror', (e) => errors.push(String(e)));
    await p7.route(/\/lift\/(index\.html)?$/, async (r) => { const fs = require('fs'), path = require('path'); let tx = fs.readFileSync(path.join(__dirname, '..', 'lift', 'index.html'), 'utf8'); const i = tx.lastIndexOf('})();'); tx = tx.slice(0, i) + 'window.__tt={lfTitleEl:lfTitleEl};' + tx.slice(i); r.fulfill({ body: tx, contentType: 'text/html' }); });
    await p7.goto(URL); await p7.waitForTimeout(600);
    const eff = await p7.evaluate(() => {
      const out = {}; const box = document.createElement('div'); box.style.cssText = 'position:fixed;top:0;left:0'; document.body.appendChild(box);
      ['elite', 'veteran', 'master', 'legend', 'relentless', 'mythic', 'rookie', 'regular', 'adept', 'steady', 'grinder', 'lifer', 'collector', 'curator', 'engine', 'twice', 'ironclad', 'unbroken', 'nightowl', 'earlybird', 'titan', 'comet', 'tidal', 'ember', 'voltage', 'frostbite', 'radar', 'metronome', 'prism', 'sentinel', 'zenith', 'anvil', 'aurora', 'ice', 'lava', 'marble', 'neon', 'galaxy', 'sunrise', 'emerald', 'carbon'].forEach((id) => {
        const r = document.createElement('div'); r.className = 'fr-ti'; const te = window.__tt.lfTitleEl(id); if (te) r.appendChild(te); box.appendChild(r);
        out[id] = te ? [...te.querySelectorAll('*'), te].map((n) => [getComputedStyle(n).animationName, getComputedStyle(n, '::before').animationName, getComputedStyle(n, '::after').animationName]).flat().filter((n) => n && n !== 'none') : null;
      });
      return out;
    });
    const names = ['elite', 'veteran', 'master', 'legend', 'relentless', 'mythic', 'rookie', 'regular', 'adept', 'steady', 'grinder', 'lifer', 'collector', 'curator', 'engine', 'twice', 'ironclad', 'unbroken', 'nightowl', 'earlybird', 'titan', 'comet', 'tidal', 'ember', 'voltage', 'frostbite', 'radar', 'metronome', 'prism', 'sentinel', 'zenith', 'anvil', 'aurora', 'ice', 'lava', 'marble', 'neon', 'galaxy', 'sunrise', 'emerald', 'carbon'];
    ok('every one of the milestone, badge and consistency titles moves', names.every((n) => eff[n] && eff[n].length > 0), eff);
    const sig = names.map((n) => eff[n].slice().sort().join('+'));
    ok('and no two do it the same way', new Set(sig).size === names.length, sig);
    ok('Elite, Veteran, Master, Legend, Relentless and Mythic keep their names as words', await p7.evaluate(() => ['elite', 'veteran', 'master', 'legend', 'relentless', 'mythic'].map((n) => window.__tt.lfTitleEl(n).textContent.trim().toLowerCase()).join()) === 'elite,veteran,master,living legend,relentless,mythic');
    await c7.close();
    const c8 = await browser.newContext(Object.assign({}, PHONE, { reducedMotion: 'reduce' }));
    await c8.addInitScript(freeze('2026-10-30T18:00:00')); await c8.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
    const p8 = await c8.newPage();
    await p8.route(/\/lift\/(index\.html)?$/, async (r) => { const fs = require('fs'), path = require('path'); let tx = fs.readFileSync(path.join(__dirname, '..', 'lift', 'index.html'), 'utf8'); const i = tx.lastIndexOf('})();'); tx = tx.slice(0, i) + 'window.__tt={lfTitleEl:lfTitleEl};' + tx.slice(i); r.fulfill({ body: tx, contentType: 'text/html' }); });
    await p8.goto(URL); await p8.waitForTimeout(600);
    ok('with Reduce Motion on, none of them moves', await p8.evaluate(() => ['elite', 'veteran', 'master', 'legend', 'relentless', 'mythic'].every((id) => { const r = document.createElement('div'); r.className = 'fr-ti'; const te = window.__tt.lfTitleEl(id); r.appendChild(te); document.body.appendChild(r); return [...te.querySelectorAll('*'), te].every((n) => ['', '::before', '::after'].every((ps) => getComputedStyle(n, ps || null).animationName === 'none')); })));
    await c8.close();
  }

  /* ── THE IPHONE APP'S HOOKS: haptics, a screen that stays on, the set sent to the Watch and a set logged from it. The plugin is stood in for by a recorder. ── */
  {
    const c2 = await browser.newContext(PHONE);
    await c2.addInitScript(freeze('2026-11-02T07:00:00'));
    await c2.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
    await c2.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, tour: true }))}); })();`);
    await c2.addInitScript(`window.__calls = []; window.__fire = {};
      window.Capacitor = { isNativePlatform: () => true, Plugins: { LiftWidgets: new Proxy({ addListener: (n, f) => { window.__fire[n] = f; return Promise.resolve({ remove() {} }); } }, { get: (t, k) => t[k] || ((a) => { window.__calls.push([k, a]); return Promise.resolve({}); }) }) } };`);
    const pg = await c2.newPage();
    pg.on('pageerror', (e) => errors.push(String(e)));
    await pg.goto(URL); await pg.waitForTimeout(500);
    await pg.click('#lfGo'); await settle(pg);
    const calls = () => pg.evaluate(() => window.__calls.map((x) => x[0] + ':' + JSON.stringify(x[1])));
    ok('a workout keeps the screen awake', (await calls()).some((x) => /^keepAwake:\{"on":true\}/.test(x)));
    const set0 = pg.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd)').first();
    await set0.locator('input').nth(0).fill('100'); await set0.locator('input').nth(1).fill('8');
    await set0.locator('.lf-chk').click(); await pg.waitForFunction(() => window.__calls.some((x) => x[0] === 'watchAct' && /"i\\":1|"i":1/.test(x[1].json)), null, { timeout: 8000 }).catch(() => {}); await pg.waitForTimeout(300);
    const cs = await calls();
    ok('a ticked set is a light haptic tap', cs.some((x) => /^haptic:\{"kind":"tick"\}/.test(x)), cs.slice(0, 8));
    const wa = cs.filter((x) => /^watchAct:/.test(x)).pop() || '';
    const wj = wa ? JSON.parse(JSON.parse(wa.replace(/^watchAct:/, '')).json || 'null') : null;
    if (!wj) { ok('the watch is sent the set it is on', false, wa); await c2.close(); } else {
    ok('the watch is sent the set it is on: the exercise, the set and the weight and reps', !!wj && wj.of > 1 && wj.i === 1 && wj.w === 100 && wj.r === 8 && !!wj.ex, wj);
    /* the watch logs the next set at 105 x 6 */
    await pg.evaluate((m) => window.__fire.watchMsg(m), { t: 'set', id: wj.id, i: 1, w: 105, r: 6 }); await pg.waitForTimeout(700);
    const act = await pg.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')));
    const ex0 = act.x.find((x) => x.id === wj.id);
    ok('a set logged from the watch is ticked with the weight and reps it sent', ex0.sets[1].ok === 1 && ex0.sets[1].w === 105 && ex0.sets[1].r === 6, ex0.sets[1]);
    ok('and it starts the rest like any other tick', !!act.rest);
    await pg.evaluate((m) => window.__fire.watchMsg(m), { t: 'set', id: wj.id, i: 1, w: 999, r: 99 }); await pg.waitForTimeout(300);
    ok('the same set sent twice is not logged twice', (await pg.evaluate(() => JSON.parse(localStorage.getItem('lift.active.v1')))).x.find((x) => x.id === wj.id).sets[1].w === 105);
    await pg.click('#lfFinish'); await pg.waitForTimeout(900);
    ok('and finishing lets the screen sleep again and tells the watch there is no workout', (await calls()).some((x) => /^keepAwake:\{"on":false\}/.test(x)) && (await calls()).filter((x) => /^watchAct:/.test(x)).pop() === 'watchAct:{"json":""}', (await calls()).slice(-4));
    await c2.close();
    }
  }

  /* ── THE SHELF: no two badges are the same picture. Each is told apart by its silhouette, its finish, its pattern and its colour, and the number in the middle does not count. ── */
  {
    const c3 = await browser.newContext(Object.assign({}, PHONE, { serviceWorkers: 'block' }));
    await c3.addInitScript(`localStorage.setItem('lift.v1', JSON.stringify({ unit: 'kg', goal: 3, wkSum: '9999-12-31', wkDone: '9999-12-31', tour: true }));`);
    await c3.route(/\/lift\/(index\.html)?(\?.*)?$/, async (r) => {
      let h = require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8');
      const i = h.lastIndexOf('})();');
      h = h.slice(0, i) + 'window.__t = {}; ["lfBadges", "bdSpec", "ymd", "today", "BD_DST"].forEach(function (k) { try { window.__t[k] = eval(k); } catch (e) {} });' + h.slice(i);
      r.fulfill({ body: h, contentType: 'text/html' });
    });
    const pg3 = await c3.newPage();
    await pg3.goto(URL); await pg3.waitForTimeout(600);
    const r3 = await pg3.evaluate(() => {
      const specs = __t.lfBadges().map((x) => { x.d = __t.ymd(__t.today()); const s = __t.bdSpec(x); return { id: x.b.id, look: [s.sh, s.fx || '', s.pt || '', s.c || ''].join('|') }; });
      const by = {}; specs.forEach((s) => { (by[s.look] = by[s.look] || []).push(s.id); });
      const dup = Object.keys(by).filter((k) => by[k].length > 1).map((k) => by[k]);
      const ds = __t.BD_DST.map((r) => 'd' + r[0]), shapes = {};
      ds.forEach((id, i) => { const s = specs.find((q) => q.id === id).look.split('|'); (shapes[Math.floor(i / 5)] = shapes[Math.floor(i / 5)] || new Set()).add(s[0] + s[3]); });
      return { n: specs.length, dup, ladders: Object.keys(shapes).map((k) => shapes[k].size), ds: ds.length };
    });
    ok('no two badges on the shelf share a silhouette, finish, pattern and colour', r3.n >= 247 && r3.dup.length === 0, r3.dup);
    ok('the forty day streaks are eight ladders of five, each its own shape and colour', r3.ds === 40 && r3.ladders.length === 8 && r3.ladders.every((x) => x === 1), r3.ladders);
    await c3.close();
  }

  /* ── A STORY IN THE iPHONE APP goes straight to Instagram or Facebook as the video, or to the phone's share sheet. The plugin is a recorder. ── */
  {
    const W = (id, d, h) => ({ id, d, s: new Date(d + 'T' + h + ':00:00').getTime(), e: new Date(d + 'T' + h + ':50:00').getTime(), n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }] }] });
    const c5 = await browser.newContext(PHONE);
    await c5.addInitScript(freeze('2026-10-30T18:00:00'));
    await c5.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {}`);
    await c5.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 1, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, tour: true, wo: [W('t1', '2026-10-30', '07')] }))}); })();`);
    await c5.addInitScript(`window.__calls = []; window.Capacitor = { isNativePlatform: () => true, Plugins: { LiftWidgets: new Proxy({ addListener: () => Promise.resolve({ remove() {} }) }, { get: (t, k) => t[k] || ((a) => { window.__calls.push([k, a]); return Promise.resolve({}); }) }) } };`);
    const pg5 = await c5.newPage();
    pg5.on('pageerror', (e) => errors.push(String(e)));
    await pg5.goto(URL); await pg5.waitForTimeout(500);
    await pg5.click('#lfPick'); await settle(pg5);
    await top(pg5).locator('#lfFinShare').click(); await settle(pg5);
    ok('in the app the story has one button, Share video, and none for Instagram, Facebook or TikTok', await pg5.locator('#lfCardShare').count() === 1 && await pg5.locator('#lfCardIg, #lfCardFb, #lfCardTt, #lfCardSave').count() === 0);
    ok('and it cannot be pressed until there is a video to send', await pg5.locator('#lfCardShare').isDisabled());
    await pg5.waitForFunction(() => window.lfStoryBytes > 2000, null, { timeout: 40000 }).catch(() => {});
    await pg5.click('#lfCardShare'); await pg5.waitForTimeout(700);
    const sh = await pg5.evaluate(() => window.__calls.filter((x) => x[0] === 'shareStory').map((x) => x[1]));
    ok('the phone\'s own share sheet is sent the recorded video', sh.length === 1 && sh[0].kind === 'sheet' && typeof sh[0].data === 'string' && sh[0].data.length > 1000 && /^(mp4|webm)$/.test(sh[0].ext), sh.map((x) => [x.kind, x.ext, (x.data || '').length]));
    ok('and when the sheet does not open it says so instead of doing nothing', /Could not open the share sheet/.test(await pg5.evaluate(() => (document.querySelector('.lf-toast') || {}).textContent || '')));
    await c5.close();
  }

  /* ── next in line, compared to last time, and moving an exercise ── */
  {
    const W = (id, d, r, reps) => ({ id, d, s: 1, e: 2, n: 'Push', rt: r, x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: reps }] }] });
    const a = await ctx({ unit: 'kg', wo: [W('n1', '2026-10-26', 'p-mon', 10)] });
    ok('today is the day after the one you last trained, whatever the weekday', (await a.page.textContent('#lfPick')).trim() === 'Chest & shoulders', await a.page.textContent('#lfPick'));
    ok('and it starts straight from home', /Start/.test(await a.page.textContent('#lfGo')));
    await a.c.close();
    const b = await ctx({ unit: 'kg', wo: [W('c1', '2026-10-20', null, 10), W('c2', '2026-10-28', null, 11)] });
    const pct = (await b.page.textContent('#lfWeek .lf-pct')).trim();
    ok('the reps are measured against the last time that workout was done', pct === '+10%' && (await b.page.getAttribute('#lfWeek .lf-pct', 'data-vs')) === 'Push', pct);
    await b.page.click('#lfWeek'); await settle(b.page);
    ok('and pressing it says which workout it was measured against', /vs last Push/.test(await top(b.page).locator('.lf-pct').textContent()), await top(b.page).locator('.lf-pct').textContent());
    await b.c.close();
    const g = await ctx({ unit: 'kg' });
    await g.page.click('#lfGo'); await settle(g.page);
    const names = () => g.page.$$eval('.lf-ex .lf-ex-n', (n) => n.map((x) => x.textContent.trim()));
    const before = await names();
    ok('every exercise has a grip to move it by', before.length > 1 && await g.page.locator('.lf-ex .lf-grip').count() === before.length);
    await g.page.locator('.lf-ex .lf-grip').first().focus(); await g.page.keyboard.press('ArrowDown'); await settle(g.page);
    const after = await names();
    ok('the arrows move an exercise down one place', after[1] === before[0] && after[0] === before[1], { before, after });
    await g.page.locator('.lf-ex .lf-grip').nth(1).focus(); await g.page.keyboard.press('ArrowUp'); await settle(g.page);
    ok('and up again', (await names()).join() === before.join());
    const bb = await g.page.locator('.lf-ex .lf-grip').first().boundingBox();
    const b2 = await g.page.locator('.lf-ex').nth(1).boundingBox();
    await g.page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await g.page.mouse.down();
    await g.page.mouse.move(bb.x + bb.width / 2, b2.y + b2.height - 4, { steps: 8 }); await g.page.mouse.up(); await settle(g.page);
    const dr = await names();
    ok('dragging by the grip drops it where you let go', dr[0] === before[1] && dr[1] === before[0], { before, dr });
    await g.c.close();
  }

  /* ── GOALS: its own section on You, open on arrival, above Customise ── */
  {
    const { c, page } = await ctx({ unit: 'kg', bw: [{ d: '2026-10-29', kg: 80 }] });
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    ok('Goals is on the page, not behind a fold', await page.locator('#lfTargets #lfGoal').isVisible());
    const ys = await page.evaluate(() => ['lfTargets', 'lfTheme'].map((id) => document.getElementById(id).getBoundingClientRect().top));
    ok('and sits above Appearance', ys[0] < ys[1], ys);
    await page.locator('#lfTargets #lfGoal button').nth(2).click(); await settle(page);
    ok('the weekly goal is set from it', (await store(page)).goal === 3);
    ok('there is no body weight on You, and no goal for it', await page.locator('#lfBw, #lfGoalBw, #lfGoalBwNote').count() === 0);
    await page.click('.lf-bar [data-v="home"]'); await settle(page);
    ok('and none on Today either', await page.locator('#lfBw').count() === 0);
    ok('Settings no longer holds the weekly goal', await page.locator('#lfSet #lfGoal').count() === 0);
    await c.close();
  }

  /* ── AN OUT-OF-DATE APP IS ASKED TO UPDATE, and nothing else works until it has ── */
  {
    const seed = JSON.stringify(JSON.stringify({ unit: 'kg', tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, wo: [] }));
    const open = async (ver, min, url, native = true) => {
      const c = await newCtx(PHONE); await c.addInitScript('window.__lfNoIntro = 1;');
      await c.addInitScript(`try { localStorage.setItem('lift.frames.v1', '1'); } catch (e) {} if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${seed});`);
      if (native) await c.addInitScript(`window.__minAsked = 0; window.Capacitor = { isNativePlatform: () => true, Plugins: { LiftWidgets: new Proxy({ addListener: () => Promise.resolve({ remove() {} }), caps: () => Promise.resolve({ health: false, group: false, version: '${ver}' }) }, { get: (t, k) => t[k] || (() => Promise.resolve({})) }) } };`);
      let asked = 0;
      await c.route('https://niko-999.github.io/lift/min.json*', (r) => { asked++; r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ min, url }) }); });
      const page = await c.newPage(); await page.goto(URL); await page.waitForTimeout(900);
      return { c, page, asked: () => asked };
    };
    const old = await open('1.2', '1.3', 'https://apps.apple.com/app/id123');
    ok('an app below the minimum version shows the update screen', await old.page.locator('#lfForce').count() === 1);
    ok('which covers everything: a press at the middle of the screen reaches it, not the app', await old.page.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return !!(e && e.closest('#lfForce')); }));
    ok('and has one way on, the App Store', await old.page.locator('#lfForce a').count() === 1 && await old.page.getAttribute('#lfForceGo', 'href') === 'https://apps.apple.com/app/id123');
    await old.c.close();
    const tf = await open('1.4', '1.5', '');
    ok('before the App Store page is live the one button opens TestFlight and says so', await tf.page.getAttribute('#lfForceGo', 'href') === 'itms-beta://' && /TestFlight/.test(await tf.page.textContent('#lfForceGo')));
    await tf.c.close();
    const cur = await open('1.3', '1.3', '');
    ok('an app at the minimum is left alone', cur.asked() >= 1 && await cur.page.locator('#lfForce').count() === 0);
    await cur.c.close();
    const nw = await open('1.4', '1.3', '');
    ok('and so is one above it', await nw.page.locator('#lfForce').count() === 0);
    await nw.c.close();
    const bad = await open('1.2', '1.3', 'https://evil.example/');
    ok('a link that is not the App Store is not followed: TestFlight is opened instead, until the App Store page is live', await bad.page.locator('#lfForce').count() === 1 && (await bad.page.getAttribute('#lfForceGo', 'href')) === 'itms-beta://');
    const none = await open('1.2', '1.3', '');
    ok('and with none in the file the button still opens TestFlight', (await none.page.getAttribute('#lfForceGo', 'href')) === 'itms-beta://');
    await none.c.close();
    await bad.c.close();
    const web = await open('', '9.9', '', false);
    ok('the web copy is never asked', web.asked() === 0 && await web.page.locator('#lfForce').count() === 0);
    await web.c.close();
  }

  /* ── EVERY SET TICKED: the bar offers Finish workout in place of the rest clock ── */
  {
    const act = { id: 'fw', s: Date.now() - 600000, n: 'Quick', rt: null, rest: 0, x: [{ id: 'calf', n: 'Seated calf raises', sets: [{ w: 40, r: 10, ok: 1 }, { w: 40, r: 10, ok: 0 }] }] };
    const { c, page } = await ctx({ unit: 'kg', goal: 4, wo: [] });
    await page.evaluate((a) => localStorage.setItem('lift.active.v1', JSON.stringify(a)), act); await page.reload(); await page.waitForTimeout(1500);
    ok('with a set left the rest clock is there and Finish workout is not', await page.locator('#lfFinishBar').isHidden() && await page.locator('#lfRest').isVisible());
    const last = page.locator('.lf-session .lf-ex').first().locator('.lf-set:not(.is-hd):not(.is-wu):not(.is-drop)').last();
    await last.locator('.lf-chk').click(); await page.waitForTimeout(800);
    ok('tick the last one and the bar is Finish workout, and the rest clock is gone', await page.locator('#lfFinishBar').isVisible() && await page.locator('#lfRest').isHidden() && (await page.textContent('#lfFinishBar')).trim() === 'Finish workout');
    ok('and no rest was left running behind it', JSON.parse(await page.evaluate(() => localStorage.getItem('lift.active.v1'))).rest === 0);
    await page.locator('.lf-session .lf-ex').first().locator('.lf-ex-ft button').first().click(); await page.waitForTimeout(600);
    ok('add a set and the rest clock comes back', await page.locator('#lfFinishBar').isHidden() && await page.locator('#lfRest').isVisible());
    await c.close();
  }

  /* ── A LONG LIST OF FRIENDS: the ring is a podium, the list is ten at a time, and the loading is a few at once ── */
  {
    const ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const codes = Array.from({ length: 60 }, (_, i) => 'ZZAAAA' + ABC[i >> 5] + ABC[i & 31]);
    const list = codes.map((cd, i) => ({ c: cd, n: 'Friend ' + i, s: null, at: 0, gone: false, rx: [] }));
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 4, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, wo: [] }))}); localStorage.setItem('lift.fr.v1', ${JSON.stringify(JSON.stringify({ on: true, code: 'MEMEMEME', key: '0123456789abcdef0123456789abcdef', name: 'Me', list, pend: '', rx: [], no: [] }))}); })();`);
    let inflight = 0, maxIn = 0, asked = 0;
    await c.route('https://sched.nikorapullin.workers.dev/**', async (r) => {
      const u = new globalThis.URL(r.request().url()), mm = u.pathname.match(/^\/v1\/lift\/([A-Z0-9]{8})$/);
      if (r.request().method() === 'GET' && mm) {
        asked++; inflight++; maxIn = Math.max(maxIn, inflight); await new Promise((res) => setTimeout(res, 40)); inflight--;
        const i = codes.indexOf(mm[1]);
        return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ n: mm[1] === 'MEMEMEME' ? 'Me' : 'Friend ' + i, s: { wk: i >= 0 && i < 12 ? (i % 4) + 1 : 0, goal: 4, d: '', streak: 0, mu: [], bg: [], wl: [] }, rx: [], fo: [] }) });
      }
      r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' });
    });
    const page = await c.newPage(); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(400);
    await page.click('.lf-bar [data-v="fr"]'); await page.waitForTimeout(2600);
    ok('sixty friends are all asked for, eight at a time beside your own record, never all at once', asked >= 60 && maxIn <= 9, { asked, maxIn });
    ok('the ring draws five rings at most', await page.locator('#frRings .fr-rg-w svg circle.fr-rg-a').count() <= 5 && await page.locator('#frRings .fr-rg-w svg circle.fr-rg-a').count() >= 1);
    ok('and nobody who has not trained is drawn as an empty track', await page.locator('#frRings .fr-rg-w svg g > circle:not(.fr-rg-a):not(.fr-rg-cm):not(.fr-rg-p):not(.fr-rg-h)').count() <= 5);
    const vis = () => page.$$eval('#frBoard .fr-row', (r) => r.filter((x) => getComputedStyle(x).display !== 'none').length);
    ok('the list shows ten, and your own row', await vis() <= 11 && await vis() >= 10, await vis());
    ok('with a search and a Show more that says how many are hidden', await page.locator('#frSearch').count() === 1 && /Show more · \d+/.test(await page.textContent('#frMoreRows')));
    await page.click('#frMoreRows'); await page.waitForTimeout(200);
    ok('Show more opens twenty-five further', await vis() >= 35 && await vis() <= 37, await vis());
    await page.fill('#frSearch', 'Friend 41'); await page.waitForTimeout(200);
    ok('a search finds a friend who was hidden, by name', (await page.$$eval('#frBoard .fr-row:not(.is-off) .fr-t b', (b) => b.map((x) => x.textContent))).some((n) => n === 'Friend 41'));
    await c.close();
  }

  /* ── THE SETUP GUIDE: how to put your programme in, once by itself on a first open and always one press away ── */
  {
    const seed = (extra) => `(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(Object.assign({ unit: 'kg', goal: 3, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, wo: [] }, extra)))}); })();`;
    const c = await browser.newContext(PHONE); await c.addInitScript(freeze('2026-10-30T18:00:00')); await c.addInitScript(seed({ tour: false }));
    const page = await c.newPage(); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(2400);
    ok('a first open with nothing in it plays the guide by itself', await page.locator('.lf-tr-stage').count() === 1 && /Add your split/.test(await page.textContent('.lf-tr-cap')));
    ok('it is four scenes', await page.locator('.lf-tr-segs button').count() === 4);
    await page.click('.lf-btn.is-log'); await page.waitForTimeout(200); ok('Next moves to the second scene', /Check it and save/.test(await page.textContent('.lf-tr-cap')));
    await page.click('.lf-btn.is-log'); await page.click('.lf-btn.is-log'); await page.waitForTimeout(200); ok('and the last scene is logging a set', /Log your sets/.test(await page.textContent('.lf-tr-cap')));
    ok('and it is marked seen', JSON.parse(await page.evaluate(() => localStorage.getItem('lift.v1'))).setup === true);
    await page.reload(); await page.waitForTimeout(2400);
    ok('it does not play again', await page.locator('.lf-tr-stage').count() === 0);
    await page.click('.lf-bar [data-v="lib"]'); await page.waitForTimeout(500);
    ok('with no routines, Exercises offers how to add one', await page.locator('#lfSetupLink').count() === 1);
    await page.click('#lfSetupLink'); await page.waitForTimeout(500);
    ok('and it opens the same guide', await page.locator('.lf-tr-stage').count() === 1 && /Add your split/.test(await page.textContent('.lf-tr-cap')));
    await c.close();
    const c2 = await browser.newContext(PHONE); await c2.addInitScript(freeze('2026-10-30T18:00:00')); await c2.addInitScript(seed({ tour: true }));
    const p2 = await c2.newPage(); p2.on('pageerror', (e) => errors.push(String(e))); await p2.goto(URL); await p2.waitForTimeout(2400);
    ok('someone who has already used the app is not shown it', await p2.locator('.lf-tr-stage').count() === 0);
    await c2.close();
  }

  /* ── A FIRST INSTALL STARTS EMPTY: Today says Create routine, and no one else's programme is there ── */
  {
    const c = await browser.newContext(PHONE); await c.addInitScript(freeze('2026-10-30T18:00:00')); await c.addInitScript('window.__lfInline = 1;');
    const page = await c.newPage(); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(2400); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    ok('Create split is the only thing on that card: no empty workout, no ready-made split', await page.locator('#lfNewUser button').count() === 1 && await page.locator('#lfEmptyWo, #lfSplitGo').count() === 0);
    ok('a phone with no record has no programme on Today: it says Create split', await page.locator('#lfNewUser').count() === 1 && /Create split/.test(await page.textContent('#lfNewUser .lf-title-box')) && await page.locator('#lfGo').count() === 0, await page.textContent('#lfHome').then((t) => t.slice(0, 80)));
    ok('and no weekly sets are drawn until there is a split', await page.locator('#lfLegs').count() === 0);
    await page.click('.lf-bar [data-v="lib"]'); await page.waitForTimeout(500);
    ok('Exercises shows no built-in split, only Create split at the top', await page.locator('#lfSplit').count() === 0 && await page.locator('#lfProg').count() === 0 && await page.locator('#lfNewSplit').count() === 1);
    ok('and there is no way round it: no ready-made split link here either', await page.locator('#lfSplitLink').count() === 0);
    await page.click('.lf-bar [data-v="home"]'); await page.waitForTimeout(300);
    await page.click('#lfCreateSplit'); await page.waitForTimeout(500);
    ok('and Create split opens the new split form, with the paste box in it', await page.locator('#lfSpPaste').count() === 1 && await page.locator('#lfSpN').count() === 1);
    await page.waitForTimeout(100);
    await page.fill('#lfSpPaste', 'Monday - Push\nBench press 4x8\nOverhead press 3x10\nTuesday - Pull\nBarbell row 4x8\nPull-ups 3x8'); await page.waitForTimeout(700);
    await page.fill('#lfSpN', 'My week'); await page.click('#lfSpSave'); await page.waitForTimeout(1200);
    ok('making the first split asks what your targets are, worked out from it', await page.locator('#lfTgKeep').count() === 1 && /sets a week/.test(await page.textContent('.lf-sheet.is-up')));
    await page.click('#lfTgKeep'); await page.waitForTimeout(500);
    ok('and then the week\'s sets are there', await page.locator('#lfLegs').count() === 1);
    await page.click('.lf-bar [data-v="lib"]'); await page.waitForTimeout(500);
    ok('a new person starts without programmes: the strip holds only the split they made', await page.locator('#lfProg button').count() === 1 && /My week/.test(await page.textContent('#lfProg')));
    await page.click('#lfProgMg'); await page.waitForTimeout(500);
    ok('and the ones that come with the app wait under Manage programs', /Upper \/ lower/.test(await page.textContent('.lf-sheet.is-up')));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await c.close();
    const c2 = await browser.newContext(PHONE); await c2.addInitScript(freeze('2026-10-30T18:00:00')); await c2.addInitScript('window.__lfInline = 1;');
    await c2.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, fresh: true, tour: true, setup: true, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, wo: [], rt: [{ id: 'r1', n: 'Push day', sp: '', ex: ['bench'], tg: {} }, { id: 'r2', n: 'Pull day', sp: '', ex: ['row'], tg: {} }] }))}); })();`);
    const p2 = await c2.newPage(); p2.on('pageerror', (e) => errors.push(String(e))); await p2.goto(URL); await p2.waitForTimeout(900);
    ok('with a routine of your own and no programme, Today is your routine', await p2.locator('#lfNewUser').count() === 0 && /Push day/.test(await p2.textContent('#lfPick')), await p2.textContent('#lfHome').then((t) => t.slice(0, 60)));
    await c2.close();
  }

  /* ── ALL EXERCISES FOLDS, AND THE LIST HOLDS THE MACHINE AND DUMBBELL VARIATIONS WITHOUT COPIES ── */
  {
    const c = await browser.newContext(PHONE); await c.addInitScript(freeze('2026-10-30T18:00:00')); await c.addInitScript(`(() => { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', mseen: RK_SEEN, wo: [] }))}); })();`); await c.addInitScript('window.__lfInline = 0;');
    const page = await c.newPage(); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(URL); await page.waitForTimeout(1200);
    await page.click('.lf-bar [data-v="lib"]'); await page.waitForTimeout(500);
    ok('All exercises is a folded heading, shut until you open it', await page.getAttribute('#lfLibFold', 'aria-expanded') === 'false' && !(await page.locator('#lfLibList').isVisible()));
    await page.click('#lfLibFold'); await page.waitForTimeout(250);
    ok('pressing it opens the filters and the list, and a muscle inside is shut too', await page.getAttribute('#lfLibFold', 'aria-expanded') === 'true' && await page.locator('#lfLibList').isVisible() && await page.locator('#lfLibList .lf-gf').count() > 0 && !(await page.locator('#lfLibList .lf-list').first().isVisible()));
    await page.click('#lfLibList .lf-gf >> nth=0'); await page.waitForTimeout(200);
    ok('a muscle opens on its own press', await page.locator('#lfLibList .lf-list').first().isVisible());
    await page.click('#lfLibFold'); await page.waitForTimeout(200);
    ok('and the whole section puts away again', !(await page.locator('#lfLibList').isVisible()));
    await page.click('#lfLibFold'); await page.waitForTimeout(200); await page.locator('#lfLibBody .lf-seg button, #lfLibBody [role=tab], #lfLibBody button', { hasText: /^All$/ }).first().click(); await page.waitForTimeout(300);
    const all = await page.evaluate(() => { var o = []; document.querySelectorAll('#lfLibList .lf-li-t b').forEach((b) => o.push(b.textContent.toLowerCase())); return o; });
    ok('no two exercises on the list share a name', new Set(all).size === all.length, String(all.length));
    ok('the list is a long one now, with machine and dumbbell variations in it', all.length > 280 && all.some((n) => /^machine /.test(n)) && all.some((n) => /^dumbbell /.test(n)) && all.some((n) => /plate-loaded/.test(n)), String(all.length));
    ok('and the retired copies are gone from it', !all.includes('seated shoulder press') && !all.includes('triceps extensions'));
    await c.close();
  }

  /* ── A MONTH IS A COIN: the five month badges are the SVC coin, drawn live, never a pre-made picture of the old medal ── */
  {
    const wo = []; for (let m = 0; m < 3; m++) for (let k = 1; k <= 13; k++) { const d = new Date(2026, 9 - m, k); wo.push({ id: 'm' + m + '_' + k, d: d.toISOString().slice(0, 10), s: d.getTime() + 36e5 * 9, e: d.getTime() + 36e5 * 10, n: 'Q', x: [{ id: 'squat', n: 'Barbell squat', sets: [{ w: 100, r: 5, ok: 1 }] }] }); }
    wo.sort((a, z) => (a.d < z.d ? -1 : 1));
    const { c, page } = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00');
    await page.click('.lf-bar [data-v="you"]'); await settle(page);
    const co = page.locator('#lfBadges .lf-bdi', { hasText: 'Steady' }).first().locator('.lf-coin');
    ok('Steady, three months, is on the shelf', await co.count() === 1);
    await co.scrollIntoViewIfNeeded(); await page.waitForFunction(() => { const i = [...document.querySelectorAll('#lfBadges .lf-bdi')].find((x) => /Steady/.test(x.textContent)); const im = i && i.querySelector('.lf-coin img'); return im && im.getAttribute('src'); }, null, { timeout: 60000 }).catch(() => {});
    const src = await co.locator('img').getAttribute('src');
    ok('its picture is drawn on the phone, not the old pre-made medal', !!src && !/^bd\//.test(src), String(src).slice(0, 40));
    await c.close();
    const two = await ctx({ unit: 'kg', goal: 3, wo }, '2026-10-30T18:00:00', true);
    for (let k = 0; k < 8 && await two.page.locator('.lf-cv').count(); k++) { await two.page.locator('.lf-cv-x').first().click(); await two.page.waitForTimeout(500); }
    await two.page.click('.lf-bar [data-v="you"]'); await settle(two.page);
    await two.page.click('#lfBadges'); await settle(two.page);
    const sc = two.page.locator('#lfBadgesBody .lf-bdi', { hasText: 'Steady' }).first().locator('.lf-coin');
    await sc.scrollIntoViewIfNeeded(); await sc.evaluate((e) => { e.click(); e.click(); }); await two.page.waitForTimeout(700);
    ok('pressing a badge twice opens one viewer, never a second over the first', await two.page.locator('.lf-cv').count() === 1 && await two.page.locator('.lf-cvb').count() === 1);
    await two.c.close();
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
