/* ═══════════════════════════════════════════════════════════════
   ENCOUNTERS (doors/) — every check drives the real app: logs an
   encounter through the sheet, corrects one, finds one, and reads what
   went well and what to work on back off the screens and the report.

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
const KEY = 'encounters.v1';
const freeze = (at) => `(() => {
  const F = new Date('${at}').getTime(); const R = Date;
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;
const t = (d, h, m) => new Date(`${d}T${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`).getTime();

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  async function ctx(seed) {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze(AT));
    if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('${KEY}')) localStorage.setItem('${KEY}', ${JSON.stringify(JSON.stringify(seed))}); })();`);
    await c.addInitScript(() => {
      window.__copied = null;
      try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: (x) => { window.__copied = x; return Promise.resolve(); } }, configurable: true }); } catch (e) {}
    });
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) offOrigin.push(u); });
    await page.goto(URL); await page.waitForTimeout(300);
    return { c, page };
  }
  const store = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
  const settle = (page) => page.waitForTimeout(420);
  const top = (page) => page.locator('.dr-sheet').last();
  const sideways = (page) => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const txt = async (page, sel) => ((await page.textContent(sel)) || '').trim();

  /* ── a first open ── */
  const { c, page } = await ctx();
  ok('the home screen draws', await page.locator('#drToday').count() === 1);
  ok('a first open says nothing is logged, with the goals under it', await txt(page, '.dr-title') === 'No encounters yet' && /Encounters\s*0 \/ 5/.test(await txt(page, '#drGoals')) && /Closes\s*0 · no goal/.test(await txt(page, '#drGoals')) && /Sales\s*\$0 · no goal/.test(await txt(page, '#drGoals')));
  ok('the summary says there is nothing yet rather than drawing a 0%', /Nothing logged yet/.test(await txt(page, '#drHow')));
  const bar = await page.$$eval('.dr-bar button', (b) => b.map((x) => { const r = x.getBoundingClientRect(); return [r.width, r.height]; }));
  ok('four tabs, every one a 44px target', bar.length === 4 && bar.every(([w, h]) => w >= 44 && h >= 44), bar);
  ok('nothing about doors is left on the screen', !/door|knock/i.test(await page.evaluate(() => document.body.innerText)));

  /* ── logging one ── */
  await page.click('#drGo'); await settle(page);
  ok('the log sheet opens on how it went', await page.locator('#drFeel button').count() === 2);
  await page.click('#drEnGo'); await page.waitForTimeout(150);
  ok('it will not log without positive or negative', ((await store(page)) || { en: [] }).en.length === 0 && /Positive or negative/.test(await txt(page, '.dr-toast')));
  await page.click('#drFeel button[data-f="1"]');
  await page.fill('#drEnN', 'Maya');
  await page.click('#drAgePills .dr-pill[data-k="25"]');
  ok('an age pill fills the age', await page.inputValue('#drEnA') === '25');
  await page.click('#drActPills .dr-pill[data-k="Reading"]');
  ok('an activity pill fills the activity', await page.inputValue('#drEnAct') === 'Reading');
  await page.fill('#drEnNote', 'Opened with the book she was holding');
  await page.click('#drEnGo'); await settle(page);
  let st = await store(page);
  const m = st.en[0];
  ok('an encounter is a name, an age, an activity, how it went and a note', st.en.length === 1 && m.n === 'Maya' && m.a === 25 && m.act === 'Reading' && m.f === 1 && /book/.test(m.note) && m.t === new Date(AT).getTime(), m);
  ok('logging says so, with a way back', /Logged · positive/.test(await txt(page, '.dr-toast span')));
  await page.click('.dr-toast button'); await page.waitForTimeout(150);
  ok('Undo takes it back off', (await store(page)).en.length === 0);

  /* again, then a second one with no name and a typed activity */
  await page.click('#drGo'); await settle(page);
  await page.click('#drFeel button[data-f="1"]'); await page.fill('#drEnN', 'Maya'); await page.fill('#drEnA', '25'); await page.fill('#drEnAct', 'reading');
  ok('typing an activity presses its pill, whatever the case', await page.getAttribute('#drActPills .dr-pill[data-k="Reading"]', 'aria-pressed') === 'true');
  ok('typing an age presses its pill', await page.getAttribute('#drAgePills .dr-pill[data-k="25"]', 'aria-pressed') === 'true');
  await page.click('#drEnGo'); await settle(page);
  await page.click('#drGo'); await settle(page);
  ok('a pressed positive can be taken off again', await (async () => { await page.click('#drFeel button[data-f="1"]'); await page.click('#drFeel button[data-f="1"]'); return (await page.getAttribute('#drFeel button[data-f="1"]', 'aria-pressed')) === 'false'; })());
  await page.click('#drFeel button[data-f="-1"]'); await page.fill('#drEnA', '41'); await page.fill('#drEnAct', 'Walking the dog');
  await page.click('#drEnGo'); await settle(page);
  st = await store(page);
  ok('a name is optional', st.en.length === 2 && !st.en[1].n && st.en[1].a === 41 && st.en[1].act === 'Walking the dog' && st.en[1].f === -1, st.en[1]);
  ok('what they were doing is remembered for next time', st.acts[0] === 'Walking the dog');

  /* ── read back on home ── */
  ok('today counts them', await txt(page, '.dr-title') === '2 encounters' && /1 positive/.test(await txt(page, '#drToday .dr-chips')) && /1 negative/.test(await txt(page, '#drToday .dr-chips')));
  ok('the summary is the share that went well', await txt(page, '#drHow .dr-fig b') === '50%' && /1 positive/.test(await txt(page, '#drHow .dr-key')));
  const stats = await page.$$eval('#drStats .dr-stat b', (b) => b.map((x) => x.textContent));
  ok('this week, positive and a day streak', stats.join('|') === '2|50%|1', stats);
  ok('what they were doing is broken down', (await page.$$eval('#drActs .dr-br', (r) => r.map((x) => x.dataset.k))).sort().join() === 'Reading,Walking the dog');
  ok('ages are read back in brackets', (await page.$$eval('#drAges .dr-br', (r) => r.map((x) => x.dataset.k))).join() === '25–29,40–49');
  ok('with too few behind it, nothing is called best or worst', /Log a few more/.test(await txt(page, '#drFocus')));
  const full = await page.$$eval('#drFull .dr-en', (c) => c.map((x) => [x.querySelector('b').textContent, x.querySelector('.dr-en-f').textContent, x.querySelector('.dr-en-m').textContent, !!x.querySelector('.dr-en-n')].join('/')));
  ok('home shows every encounter today in full, first to last', full.join('|') === 'Maya/Positive/Age 25 · Reading · 4:00pm/false|No name/Negative/Age 41 · Walking the dog · 4:00pm/false', full);
  ok('only a positive one is tagged green', await page.$eval('#drFull .dr-en-f.is-pos', (x) => getComputedStyle(x).backgroundColor) === 'rgb(52, 199, 89)' && await page.locator('#drFull .dr-en-f.is-pos').count() === 1);
  ok('negative is never drawn red', await page.$eval('#drHome', (e) => ![...e.querySelectorAll('*')].some((x) => /255, 59, 48|255, 107, 96/.test(getComputedStyle(x).color + getComputedStyle(x).backgroundColor))));

  /* ── the list ── */
  await page.click('.dr-bar button[data-v="log"]'); await settle(page);
  ok('the list has both, newest first, a missing name read as No name', (await page.$$eval('#drLogList .dr-li b', (b) => b.map((x) => x.textContent))).join('|') === 'No name|Maya');
  ok('a positive one wears the filled dot and a negative one the hollow', await page.$$eval('#drLogList .dr-dot', (d) => d.map((x) => x.classList.contains('is-pos'))).then((a) => a.join() === 'false,true'));
  await page.fill('#drSearch', 'maya'); await page.waitForTimeout(100);
  ok('search finds a name', (await page.$$eval('#drLogList .dr-li b', (b) => b.map((x) => x.textContent))).join() === 'Maya');
  ok('and typing keeps the caret in the box', await page.evaluate(() => document.activeElement && document.activeElement.id === 'drSearch'));
  await page.fill('#drSearch', ''); await page.click('#drLogSeg button[data-p="neg"]'); await page.waitForTimeout(100);
  ok('Negative shows only the negative', (await page.$$eval('#drLogList .dr-li b', (b) => b.map((x) => x.textContent))).join() === 'No name');
  await page.click('#drLogList .dr-li'); await settle(page);
  await page.click('#drFeel button[data-f="1"]'); await page.fill('#drEnN', 'Sam'); await page.fill('#drEnNote', 'Asked about the dog first'); await page.click('#drEnGo'); await settle(page);
  st = await store(page);
  ok('an encounter can be corrected', st.en[1].f === 1 && st.en[1].n === 'Sam' && st.en.length === 2);
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  ok('the note reads in full on home', /Asked about the dog first/.test(await txt(page, '#drFull')));
  await page.click('#drFull .dr-en >> nth=1'); await settle(page);
  ok('a card on home opens its encounter', await page.inputValue('#drEnN') === 'Sam');
  await page.keyboard.press('Escape'); await settle(page);
  await page.click('.dr-bar button[data-v="log"]'); await settle(page);
  await page.click('#drLogSeg button[data-p="all"]'); await page.waitForTimeout(100);
  await page.click('#drLogList .dr-li >> nth=0'); await settle(page);
  await top(page).locator('button', { hasText: 'Remove' }).click(); await settle(page);
  ok('removing takes it off the record', (await store(page)).en.length === 1);
  await page.click('.dr-toast button'); await page.waitForTimeout(150);
  ok('and Undo puts it back', (await store(page)).en.length === 2);

  /* ── logging one afterwards ── */
  await page.click('.dr-bar button[data-v="cal"]'); await settle(page);
  ok('today on the calendar says how many went well of how many', await txt(page, '.dr-cell[data-d="2026-11-04"] small') === '2/2');
  ok('a day still ahead cannot be pressed', await page.$eval('.dr-cell[data-d="2026-11-05"]', (e) => e.disabled));
  await page.click('.dr-cell[data-d="2026-11-02"]'); await settle(page);
  await top(page).locator('button', { hasText: 'Log one for this day' }).click(); await settle(page);
  ok('logging from a past day starts on that day', /^2026-11-02T12:00$/.test(await page.inputValue('#drEnT')));
  await page.click('#drFeel button[data-f="-1"]'); await page.click('#drEnGo'); await settle(page);
  st = await store(page);
  ok('and lands on it', st.en.some((e) => new Date(e.t).getDate() === 2 && e.f === -1));
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  ok('a day out yesterday or today keeps the streak; a gap breaks it', (await page.$$eval('#drStats .dr-stat b', (b) => b.map((x) => x.textContent)))[2] === '1');

  /* ── the end of the day ── */
  ok('the day ends on a press under the last encounter', await page.$eval('#drFull', (w) => w.lastElementChild.id === 'drEndGo') && /End the day/.test(await txt(page, '#drEndGo')));
  await page.click('#drEndGo'); await settle(page);
  await page.fill('#drDayK', 'Lead with what they are doing'); await page.fill('#drDayW', 'Rapport with Maya'); await page.fill('#drDayF', '  ');
  await page.click('#drDayGo'); await settle(page);
  st = await store(page);
  ok('takeaways are kept against the day, an empty field dropped', st.days['2026-11-04'] && st.days['2026-11-04'].k === 'Lead with what they are doing' && st.days['2026-11-04'].w === 'Rapport with Maya' && !('f' in st.days['2026-11-04']), st.days);
  ok('and the day then ends on them instead of the press', await page.locator('#drEndGo').count() === 0 && await page.$eval('#drFull', (w) => w.lastElementChild.id === 'drEnd') && /Key takeaways\s*Lead with what they are doing/i.test(await txt(page, '#drEnd')) && !/Tomorrow/.test(await txt(page, '#drEnd')));
  await page.click('#drEnd'); await settle(page);
  ok('pressing them opens them to edit', await page.inputValue('#drDayK') === 'Lead with what they are doing');
  await page.keyboard.press('Escape'); await settle(page);

  /* ── the report ── */
  await page.click('#drRepBtn'); await settle(page);
  ok('the report opens on this week', /This week/.test(await txt(page, '#drRep')) && /3 encounters/.test(await txt(page, '#drRep .dr-rep-hero')));
  ok('it lists them by name', /Maya/.test(await txt(page, '#drRep')) && /Sam/.test(await txt(page, '#drRep')));
  await top(page).locator('.dr-seg button[data-p="today"]').click();
  ok('Today narrows it to today', /2 encounters/.test(await txt(page, '#drRep .dr-rep-hero')) && /100% positive/.test(await txt(page, '#drRep .dr-rep-hero')));
  await page.click('#drRepCopy'); await page.waitForTimeout(200);
  const copied = await page.evaluate(() => window.__copied);
  ok('Copy as text carries every encounter and how it went', /2 encounters · 100% positive/.test(copied) && /\+ Maya · 25 · Reading/.test(copied) && /Sam · 41 · Walking the dog · Wed 4 Nov 4:00pm — Asked about the dog first/.test(copied), copied);
  ok('the takeaways go to the mentor too', /End of day · Wed 4 Nov\nKey takeaways: Lead with what they are doing\nWhat went well: Rapport with Maya/.test(copied) && /Lead with what they are doing/.test(await txt(page, '#drRepDay')), copied);
  ok('nothing scrolls sideways', await sideways(page) <= 0);
  await page.keyboard.press('Escape'); await settle(page);

  /* ── you ── */
  await page.click('.dr-bar button[data-v="you"]'); await settle(page);
  await page.fill('#drName', 'Niko'); await page.dispatchEvent('#drName', 'change');
  await page.fill('#drGoal', '8'); await page.dispatchEvent('#drGoal', 'change');
  st = await store(page);
  ok('your name and goal are kept', st.name === 'Niko' && st.goal === 8);

  /* ── closes and sales, and a goal for each ── */
  await page.click('.dr-bar button[data-v="home"]'); await settle(page);
  await page.click('#drGoals'); await settle(page);
  ok('the goals open from the day', await page.inputValue('#drG_goal') === '8');
  await page.fill('#drG_gc', '2'); await page.fill('#drG_gs', '$500');
  await page.click('#drGoalGo'); await settle(page);
  st = await store(page);
  ok('closes and sales goals are kept', st.gc === 2 && st.gs === 500 && st.goal === 8, st);
  await page.click('#drGo'); await settle(page);
  await page.click('#drEnCl');
  ok('pressing Closed on a blank sheet answers positive too', await page.getAttribute('#drFeel button[data-f="1"]', 'aria-pressed') === 'true');
  await page.fill('#drEnN', 'Lee'); await page.fill('#drEnAmt', '$1,250.50');
  await page.click('#drEnGo'); await settle(page);
  await page.click('#drGo'); await settle(page);
  await page.click('#drFeel button[data-f="1"]'); await page.fill('#drEnAmt', '300');
  await page.click('#drEnGo'); await settle(page);
  st = await store(page);
  const sales = st.en.filter((e) => e.cl);
  ok('a sale is kept on the encounter, and an amount alone counts as a close', sales.length === 2 && sales.some((e) => e.n === 'Lee' && e.amt === 1250.5) && sales.some((e) => e.amt === 300), sales);
  const goals = await page.$$eval('#drGoals .dr-gl', (r) => r.map((x) => x.dataset.g + ':' + x.querySelector('b').textContent + ':' + x.classList.contains('is-met')));
  ok('the day reads closes and sales against their goals, green once met', goals.join('|') === 'n:4 / 8:false|c:2 / 2:true|s:$1,550.50 / $500:true', goals);
  ok('a close says so on its card', /Closed \$1,250\.50/.test(await txt(page, '#drFull')));
  await page.click('#drRepBtn'); await settle(page);
  await top(page).locator('.dr-seg button[data-p="today"]').click();
  const kv = await page.$$eval('#drRep .dr-kv b', (b) => b.map((x) => x.textContent).slice(3).join('|'));
  ok('the report counts closes, sales and the close rate', kv === '2|$1,550.50|50%', kv);
  await page.click('#drRepCopy'); await page.waitForTimeout(200);
  const copied2 = await page.evaluate(() => window.__copied);
  ok('and so does the copied text', /2 closes · \$1,550\.50 in sales/.test(copied2) && /Lee · .*closed \$1,250\.50/.test(copied2), copied2);
  await page.keyboard.press('Escape'); await settle(page);
  await c.close();

  /* ── where you do well and what to work on ── */
  /* This week: four readers in their late twenties all went well, four
     dog-walkers in their forties none did, two coffees one each. Plus a
     baseline of ten at 50% the fortnight before. */
  const en = [];
  let i = 0;
  const add = (d, h, mm, f, n, a, act) => en.push({ id: 'x' + (i++), t: t(d, h, mm), f, n, a, act });
  ['2026-11-02', '2026-11-03', '2026-11-03', '2026-11-04'].forEach((d, j) => add(d, 11, j * 5, 1, 'R' + j, 27, 'Reading'));
  ['2026-11-02', '2026-11-02', '2026-11-03', '2026-11-04'].forEach((d, j) => add(d, 17, j * 5, -1, j % 2 ? '' : 'W' + j, 45, 'Walking'));
  add('2026-11-03', 14, 0, 1, 'C1', 32, 'Coffee'); add('2026-11-03', 14, 20, -1, '', 33, 'Coffee');
  for (let j = 0; j < 10; j++) add('2026-10-2' + (j % 9), 12, j, j % 2 ? 1 : -1, 'B' + j, 30, 'Shopping');
  const r = await ctx({ v: 1, name: 'Niko', goal: 5, acts: [], en });
  const p2 = r.page;
  ok('ten this week at 50%', await txt(p2, '#drHow .dr-fig b') === '50%' && /of 10/.test(await txt(p2, '#drHow .dr-fig span')));
  ok('the same as the fortnight before, said in words', /same as your usual 50%/.test(await txt(p2, '#drVs')));
  ok('it names where you do best', /Best with people reading: 4 of 4/.test(await txt(p2, '#drFocus')));
  ok('and what to work on, against your own rate', /Work on people walking: 0 of 4, against 50% overall/.test(await txt(p2, '#drFocus')));
  ok('the best activity row is the green one', (await p2.$$eval('#drActs .dr-br.is-best', (r) => r.map((x) => x.dataset.k))).join() === 'Reading');
  ok('a group of two is never called best', !(await p2.$$eval('#drActs .dr-br.is-best', (r) => r.map((x) => x.dataset.k))).includes('Coffee'));
  ok('ages run in order, the best one green', (await p2.$$eval('#drAges .dr-br', (r) => r.map((x) => x.dataset.k + (x.classList.contains('is-best') ? '*' : '')))).join() === '25–29*,30–34,40–49');
  ok('time of day names the hour that goes best', /Goes best around 11am/.test(await txt(p2, '#drHours .dr-hd')));
  const hb = await p2.$$eval('#drHours .dr-hrs > div', (d) => d.map((x) => x.dataset.h + ':' + Math.round(parseFloat(x.querySelector('i b').style.height))));
  ok('each hour is drawn as how many, filled by how many went well', hb.join() === '11:100,14:50,17:0', hb);
  await p2.click('#drRepBtn'); await settle(p2);
  ok('the report names the best activity, age and time', await p2.$$eval('#drRep .dr-kv b', (b) => b.map((x) => x.textContent).slice(0, 3).join()) === 'Reading,25–29,11am');
  ok('it lists six and says how many more', /\+ 4 more/.test(await txt(p2, '#drRep')));
  const fits = await p2.$eval('#drRep', (e) => e.getBoundingClientRect().bottom);
  ok('and the whole of it is on one screen, made to be photographed', fits <= 844, fits);
  await p2.click('#drRepCopy'); await p2.waitForTimeout(200);
  ok('the text says what to work on', /Working on people walking: 0 of 4 vs 50% overall/.test(await p2.evaluate(() => window.__copied)));
  await p2.keyboard.press('Escape'); await settle(p2);
  await p2.click('#drHow .dr-seg button[data-p="all"]'); await settle(p2);
  ok('All counts everything', /of 20/.test(await txt(p2, '#drHow .dr-fig span')));
  ok('nothing scrolls sideways', await sideways(p2) <= 0);
  await r.c.close();

  /* ── a damaged record is repaired, not discarded ── */
  const bad = { gc: -2, gs: 'x', days: { '2026-11-04': { k: ' keep ', w: 5 }, 'nope': { k: 'x' }, '2026-11-03': { k: '  ' } }, goal: -3, acts: [7, 'Reading'], en: [{ id: 'ok', t: t('2026-11-04', 9), f: 1, n: 'Ok', a: 300 }, { id: 'nof', t: t('2026-11-04', 10) }, { id: 9, t: 1, f: 1 }, { id: 'neg', t: t('2026-11-03', 10), f: -1, act: '  ' }] };
  const d = await ctx(bad);
  ok('a damaged encounter costs itself: two of four survive', await txt(d.page, '#drToday .dr-title') === '1 encounter' && (await d.page.$$eval('#drStats .dr-stat b', (b) => b.map((x) => x.textContent)))[0] === '2');
  await d.page.click('.dr-bar button[data-v="you"]'); await settle(d.page);
  await d.page.fill('#drName', 'R'); await d.page.dispatchEvent('#drName', 'change');
  const fixed = await store(d.page);
  ok('and the repaired shape is what gets written back', fixed.en.length === 2 && fixed.goal === 5 && fixed.acts.join() === 'Reading' && !fixed.en[0].a && !fixed.en[1].act && JSON.stringify(fixed.days) === '{"2026-11-04":{"k":"keep"}}' && fixed.gc === 0 && fixed.gs === 0, fixed);
  await d.c.close();

  ok('no request leaves the phone', offOrigin.length === 0, offOrigin);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
  console.log(`\n  ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
