/* ═══════════════════════════════════════════════════════════════
   SVC — backtest volume. Desktop, 1440x900.

   The clock is frozen at Wednesday 18 November 2026, 10:00 and moved by
   hand (`__adv`), so a session's length is a fact about the fixture.

   Trades come from a day's counter (where it started, where it sits),
   never from the sessions, which are time and nothing else. The target
   is fifty a day, fifteen more every fortnight.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};
const DESK = { viewport: { width: 1440, height: 900 }, locale: 'en-GB', colorScheme: 'dark' };
const URL = `${BASE}/svc/`;
const freeze = (at) => `(() => {
  const R = Date; let F = Number(sessionStorage.getItem('__t')) || new R('${at}').getTime();
  window.__adv = (ms) => { F += ms; sessionStorage.setItem('__t', F); };
  window.Date = class extends R {
    constructor(...a) { super(...(a.length ? a : [F])); }
    static now() { return F; }
  };
})();`;
const at = (d, h, m) => new Date(`2026-11-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`).getTime();
/* Fifty a day from the 10th, so the next raise (to 65) is on the 24th.
   Sessions are time. Sunday 15th and Monday 16th: two hours for fifty
   trades each. Tuesday 17th: an hour and a half for thirty. Today,
   Wednesday 18th: an hour for twenty-five. The counter starts the 15th at
   1000, and every day after starts where the last one ended. m and e are
   the counter as typed before noon and before six: Sunday and Monday had
   thirty and fifty-ish by noon, Tuesday fifteen by noon and thirty by
   six, today twenty-five already at ten o'clock. */
const SEED = {
  t: [{ f: '2026-11-10', n: 50 }],
  s: [
    { i: 'a', k: 'bt', a: at(15, 9), b: at(15, 11) },
    { i: 'b', k: 'bt', a: at(16, 8), b: at(16, 9) },
    { i: 'c', k: 'bt', a: at(16, 14), b: at(16, 15) },
    { i: 'd', k: 'bt', a: at(17, 8), b: at(17, 9, 30) },
    { i: 'f', k: 'bt', a: at(18, 8), b: at(18, 9) },
  ],
  d: {
    '2026-11-15': { a: 1000, b: 1050, m: 1030, e: 1050 },
    '2026-11-16': { b: 1100, m: 1075, e: 1100 },
    '2026-11-17': { b: 1130, m: 1115, e: 1130 },
    '2026-11-18': { b: 1155, m: 1155, e: 1155 },
  },
};

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  /* the week in review opens over the first visit of a week; checks that
     are not about it have already seen it */
  async function ctx(seed, atTime, init) {
    if (seed && !('rev' in seed)) seed = Object.assign({ rev: '2026-11-09' }, seed);
    const c = await browser.newContext(DESK);
    await c.addInitScript(freeze(atTime || '2026-11-18T10:00:00'));
    if (init) await c.addInitScript(init);
    if (seed) await c.addInitScript(`(() => { if (!localStorage.getItem('svc.v1')) localStorage.setItem('svc.v1', ${JSON.stringify(JSON.stringify(seed))}); })();`);
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) offOrigin.push(u); });
    await page.goto(URL); await page.waitForSelector('#svBig');
    return { c, page };
  }
  const txt = (page, sel) => page.$eval(sel, (e) => e.textContent.trim());
  const store = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('svc.v1')));

  console.log('\nSVC — the page');
  {
    const { c, page } = await ctx(SEED);
    ok('the head reads STRUCTURE. VOLUME. CONSISTENCY.', (await txt(page, '.mark')).replace(/\s+/g, ' ') === 'STRUCTURE. VOLUME. CONSISTENCY.');
    ok('the head is built from its letters, each staggered', await page.evaluate(() => {
      const l = [...document.querySelectorAll('#svMark i')];
      return l.length === 29 && new Set(l.map((e) => getComputedStyle(e).animationDelay)).size === 29;
    }));
    ok('and it lands fully drawn', await page.waitForFunction(() => [...document.querySelectorAll('#svMark i')].every((e) => getComputedStyle(e).opacity === '1'), null, { timeout: 5000 }).then(() => true, () => false));
    const look = await page.evaluate(() => {
      const b = getComputedStyle(document.body), h = getComputedStyle(document.querySelector('.mark'));
      return { bg: b.backgroundColor, ink: h.color, w: +h.fontWeight, sub: +getComputedStyle(document.querySelector('.ring-sub')).fontWeight,
        rowN: +getComputedStyle(document.querySelector('.stat-x')).fontWeight };
    });
    ok('jet black ground, white bold head', look.bg === 'rgb(0, 0, 0)' && look.ink === 'rgb(255, 255, 255)' && look.w >= 700, look);
    ok('the small type is not bold', look.sub < 600 && look.rowN < 600, look);
    ok('the ring says today\'s trades of fifty', (await txt(page, '#svBig')) === '25' && /of 50 trades/.test(await txt(page, '#svSub')), [await txt(page, '#svBig'), await txt(page, '#svSub')]);
    const off = await page.$eval('#svArc', (e) => [parseFloat(e.style.strokeDashoffset), parseFloat(e.style.strokeDasharray)]);
    ok('the ring is half full', Math.abs(off[0] / off[1] - 0.5) < 0.01, off);
    const rows = await txt(page, '#svRows');
    ok('today is backtesting and nothing else', /Backtesting/.test(rows) && !/Live|Content|journal/i.test(rows), rows);
    ok('25 to go on the day', /25 to go/.test(rows), rows);
    ok('the week reads 105 of 350', /^105\s*\/ 350$/.test(await txt(page, '#svWk')), await txt(page, '#svWk'));
    /* twenty-three November days at fifty, then the raise on the 24th takes the last seven to sixty-five */
    ok('the month knows the raise is coming: 23 days of 50 and 7 of 65', /^155\s*\/ 1,605$/.test(await txt(page, '#svMo')), await txt(page, '#svMo'));
    /* 6h 30m of backtesting over 155 trades is 2m 31s a trade; fifty take 2h 6m, sixty-five 2h 44m */
    ok('pace is time over trades', /30 days2m 31s/.test(await txt(page, '#svPaceF')), await txt(page, '#svPaceF'));
    ok('what fifty take, and what the next target would take', /50 trades take2h 6m/.test(await txt(page, '.pace')) && /65 trades would take2h 44m/.test(await txt(page, '.pace')), await txt(page, '.pace'));
    ok('the streak is broken by Tuesday\'s 30 and today is not over', /^0 days/.test(await txt(page, '#svSt')), await txt(page, '#svSt'));
    ok('best run is two days', /Best run 2/.test(await txt(page, '#svStX')), await txt(page, '#svStX'));
    ok('four weeks of dots, Monday first', (await page.$$('#svDots .dot')).length === 28);
    ok('the log groups by day, newest first', (await page.$$eval('.day-h span:first-child', (e) => e.map((x) => x.textContent)))[0] === 'Today');
    ok('a backtest row is time only: no trade count on it', !/trades/.test(await txt(page, 'tr[data-i="f"]')), await txt(page, 'tr[data-i="f"]'));
    ok('the day header says the trades and the time', /25 trades · 1h/.test(await txt(page, '.day-h .link')), await txt(page, '.day-h .link'));
    ok('the two top cards are one row, top-aligned, one height', await page.evaluate(() => {
      const a = document.querySelector('.timer-card').getBoundingClientRect(), b = document.querySelector('.today').getBoundingClientRect();
      return Math.abs(a.top - b.top) < 1 && Math.abs(a.height - b.height) < 1;
    }));
    ok('the four stat cards are one height', await page.evaluate(() => new Set([...document.querySelectorAll('.stat')].map((e) => Math.round(e.getBoundingClientRect().height))).size === 1));
    ok('nothing runs off the side', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    ok('and everything that is not backtesting is gone from the page', await page.evaluate(() => {
      const t = document.body.innerText;
      return !document.querySelector('#svKinds, #svNotes, #svLv, .kind') && !/Live charts|Content|journal|Remind/i.test(t);
    }));
    await c.close();
  }

  console.log('\nSVC — the day\'s counter');
  {
    const { c, page } = await ctx(SEED);
    ok('the fields are where the day started and where it sits', (await page.$eval('#svA', (e) => e.value)) === '' && (await page.$eval('#svB', (e) => e.value)) === '1155');
    ok('the start is carried from last night, and shown as the hint', (await page.$eval('#svA', (e) => e.placeholder)) === '1130', await page.$eval('#svA', (e) => e.placeholder));
    await page.fill('#svB', '1180');
    ok('typing where it sits does the sum: 1180 less 1130 is 50', (await txt(page, '#svBig')) === '50' && /Target hit/.test(await txt(page, '#svRows')));
    ok('the ring lights up once the target is hit', await page.$eval('.ring', (e) => e.classList.contains('is-hit')));
    ok('and it is saved as it is typed', (await store(page)).d['2026-11-18'].b === 1180);
    await page.fill('#svA', '1125');
    ok('typing a start overrides the carried one: 1180 less 1125', (await txt(page, '#svBig')) === '55');
    ok('the field keeps the digits you typed through the repaint', (await page.$eval('#svA', (e) => e.value)) === '1125');
    ok('the week follows the counter: Monday 50, Tuesday 30, today 55', /^135\s*\/ 350$/.test(await txt(page, '#svWk')), await txt(page, '#svWk'));
    await page.fill('#svB', '');
    ok('clearing where it sits clears the day', (await txt(page, '#svBig')) === '0');
    await page.fill('#svA', '');
    ok('and a day with nothing typed leaves no record', (await store(page)).d['2026-11-18'] === undefined);
    await page.reload(); await page.waitForSelector('#svBig');
    ok('the sessions are untouched: they are time, not trades', (await store(page)).s.length === SEED.s.length);
    await c.close();

    const e1 = await ctx({ s: [], d: {} });
    ok('the first ever day has nothing to carry: 0', (await e1.page.$eval('#svA', (e) => e.placeholder)) === '0');
    await e1.page.fill('#svA', '500'); await e1.page.fill('#svB', '520');
    ok('start 500, sitting at 520: 20 trades', (await txt(e1.page, '#svBig')) === '20');
    await e1.page.fill('#svA', '');
    ok('sitting at 520 with no start anywhere is not 520 trades', (await txt(e1.page, '#svBig')) === '0');
    await e1.c.close();

    const e2 = await ctx({ s: [], d: { '2026-11-17': { a: 900, b: 950 } } });
    await e2.page.fill('#svB', '940');
    ok('a number lower than the start is zero trades, never negative', (await txt(e2.page, '#svBig')) === '0');
    await e2.c.close();
  }

  console.log('\nSVC — fifty a day, fifteen more every fortnight');
  {
    const { c, page } = await ctx(SEED);
    ok('the target card says fifty a day and what is next', /^50\s*a day$/.test(await txt(page, '#svTg')) && /65 from 24 Nov · 6 days/.test(await txt(page, '#svTgX')), [await txt(page, '#svTg'), await txt(page, '#svTgX')]);
    ok('and the bar is how far through the fortnight: 8 of 14 days', Math.abs(parseFloat(await page.$eval('#svTgB', (e) => e.style.width)) - 57) <= 1, await page.$eval('#svTgB', (e) => e.style.width));
    ok('the Today panel carries the same line', /Target 50 · 65 from 24 Nov/.test(await txt(page, '#svPlan')), await txt(page, '#svPlan'));
    ok('two days on target light white (Sunday and Monday)', (await page.$$('#svYr i.l3')).length === 2);
    await c.close();

    const r = await ctx(Object.assign({}, SEED, { rev: '2026-11-16' }), '2026-11-24T10:00:00');
    const st = await store(r.page);
    ok('on the 24th the raise comes due and is written into the history', st.t.length === 2 && st.t[1].f === '2026-11-24' && st.t[1].n === 65, st.t);
    ok('the ring now asks for 65', /of 65 trades/.test(await txt(r.page, '#svSub')), await txt(r.page, '#svSub'));
    ok('and the next one is already named: 80 from 8 Dec', /80 from 8 Dec · 14 days/.test(await txt(r.page, '#svTgX')), await txt(r.page, '#svTgX'));
    ok('the days already lived are still judged at fifty: Sunday and Monday stay white', (await r.page.$$('#svYr i.l3')).length === 2, (await r.page.$$('#svYr i.l3')).length);
    ok('and the best run is still two', /Best run 2/.test(await txt(r.page, '#svStX')), await txt(r.page, '#svStX'));
    await r.c.close();

    const late = await ctx(Object.assign({}, SEED, { rev: '2026-11-30' }), '2026-12-10T10:00:00');
    const lt = (await store(late.page)).t.map((x) => x.n + '@' + x.f);
    ok('a month away catches up: 65 on the 24th, 80 on the 8th', lt.join() === '50@2026-11-10,65@2026-11-24,80@2026-12-08', lt);
    await late.c.close();

    const s1 = await ctx(SEED);
    await s1.page.click('#svSet'); await s1.page.waitForSelector('.dlg');
    ok('settings holds the target, the raise and the fortnight', (await s1.page.$eval('[data-g="n"]', (e) => e.value)) === '50' && (await s1.page.$eval('[data-g="step"]', (e) => e.value)) === '15' && (await s1.page.$eval('[data-g="every"]', (e) => e.value)) === '14');
    await s1.page.fill('[data-g="n"]', '60');
    await s1.page.click('.dlg [data-a="save"]');
    const s1s = await store(s1.page);
    ok('changing the target starts it from today and keeps the history', s1s.t.length === 2 && s1s.t[0].n === 50 && s1s.t[1].f === '2026-11-18' && s1s.t[1].n === 60, s1s.t);
    ok('the ring asks for 60', /of 60 trades/.test(await txt(s1.page, '#svSub')));
    ok('the days before are not rewritten: Sunday and Monday were fifty and stay white', (await s1.page.$$('#svYr i.l3')).length === 2);
    ok('a new fortnight starts: 75 from 2 Dec', /75 from 2 Dec · 14 days/.test(await txt(s1.page, '#svTgX')), await txt(s1.page, '#svTgX'));
    await s1.c.close();

    const s2 = await ctx(SEED);
    await s2.page.click('#svSet'); await s2.page.waitForSelector('.dlg');
    await s2.page.fill('[data-g="step"]', '0');
    await s2.page.click('.dlg [data-a="save"]');
    ok('a raise of nothing says so and holds the target', /No raise set/.test(await txt(s2.page, '#svTgX')) && /^50\s*a day$/.test(await txt(s2.page, '#svTg')), [await txt(s2.page, '#svTgX'), await txt(s2.page, '#svTg')]);
    await s2.c.close();

    const old = await ctx({ s: SEED.s, d: SEED.d, g: { bt: 40 } });
    await old.page.click('#svSet'); await old.page.waitForSelector('.dlg');
    await old.page.click('.dlg [data-a="save"]');
    const om = await store(old.page);
    ok('the old target is kept for the days behind and fifty starts today', om && om.t && om.t.length === 2 && om.t[0].n === 40 && om.t[1].n === 50 && om.t[1].f === '2026-11-18', om && om.t);
    await old.c.close();
  }

  console.log('\nSVC — twenty-five before noon, twenty-five before six');
  {
    const blocks = (page) => page.$$eval('.split > div:not(.sp-w)', (e) => e.map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
    const { c, page } = await ctx(SEED);
    let b = await blocks(page);
    ok('at ten: the morning is done, the afternoon has twenty-five to go', b.length === 2 && /Before 12:00\s*25 \/ 25\s*Done/.test(b[0]) && /By 18:00\s*0 \/ 25\s*25 to go/.test(b[1]), b);
    await page.fill('#svB', '1180');
    b = await blocks(page);
    ok('typing 1180 before noon: fifty on the counter, both blocks done', /Done/.test(b[0]) && /25 \/ 25\s*Done/.test(b[1]), b);
    const r = (await store(page)).d['2026-11-18'];
    ok('what was typed before noon is both the noon number and the six o\'clock number', r.b === 1180 && r.m === 1180 && r.e === 1180, r);
    await c.close();

    const seed2 = Object.assign({}, SEED, { d: Object.assign({}, SEED.d, { '2026-11-18': { b: 1145, m: 1145, e: 1145 } }) });
    const p2 = await ctx(seed2, '2026-11-18T14:00:00');
    b = await blocks(p2.page);
    ok('at two: fifteen by noon is ten short of twenty-five, no longer on its way', /15 \/ 25\s*10 short/.test(b[0]) && /0 \/ 25\s*25 to go/.test(b[1]), b);
    await p2.page.fill('#svB', '1165');
    const r2 = (await store(p2.page)).d['2026-11-18'];
    ok('typed in the afternoon it moves the six o\'clock number and leaves the noon one', r2.m === 1145 && r2.e === 1165, r2);
    b = await blocks(p2.page);
    ok('thirty-five by six: ten of the afternoon\'s twenty-five', /10 short/.test(b[0]) && /10 \/ 25\s*15 to go/.test(b[1]), b);
    await p2.c.close();

    const p3 = await ctx(Object.assign({}, seed2, { d: Object.assign({}, seed2.d, { '2026-11-18': { b: 1165, m: 1145, e: 1165 } }) }), '2026-11-18T19:00:00');
    await p3.page.fill('#svB', '1190');
    const r3 = (await store(p3.page)).d['2026-11-18'];
    ok('typed after six it moves neither checkpoint', r3.m === 1145 && r3.e === 1165 && r3.b === 1190, r3);
    b = await blocks(p3.page);
    ok('and the afternoon is judged at six: ten of twenty-five, fifteen short', /10 \/ 25\s*15 short/.test(b[1]), b);
    const late = await p3.page.$('.sp-w') ? await txt(p3.page, '.sp-w') : 'none';
    ok('what came after is said, not lost', /25 logged after 18:00/.test(late), late);
    await p3.c.close();

    const w = await ctx(SEED, '2026-11-21T10:00:00');
    ok('on a Saturday, a work day, there is no split', (await w.page.$$('.split')).length === 0 && /Work day/.test(await txt(w.page, '#svRows')), await txt(w.page, '#svRows'));
    ok('the day is still the day\'s target, whenever', /\/ 50/.test(await txt(w.page, '#svRows')));
    await w.c.close();

    const s1 = await ctx(SEED);
    await s1.page.click('#svSet'); await s1.page.waitForSelector('.dlg');
    const on = await s1.page.$$eval('[data-w]', (e) => e.filter((x) => x.checked).map((x) => +x.dataset.w).sort());
    ok('Saturday and Sunday are the days at work until told otherwise', on.join() === '0,6', on);
    await s1.page.check('[data-w="3"]'); await s1.page.uncheck('[data-w="0"]');
    await s1.page.click('.dlg [data-a="save"]');
    ok('Wednesday made a work day takes the split away at once', (await s1.page.$$('.split')).length === 0);
    ok('and the choice is kept', (await store(s1.page)).work.slice().sort().join() === '3,6', (await store(s1.page)).work);
    await s1.c.close();

    const odd = await ctx(Object.assign({}, SEED, { t: [{ f: '2026-11-10', n: 65 }] }));
    const ob = await blocks(odd.page);
    ok('at sixty-five the halves are thirty-three and thirty-two', /\/ 33/.test(ob[0]) && /\/ 32/.test(ob[1]), ob);
    await odd.c.close();
  }

  console.log('\nSVC — a day you forgot');
  {
    const { c, page } = await ctx(SEED);
    await page.click('button[data-day="2026-11-17"]'); await page.waitForSelector('.dlg');
    ok('a day header opens that day\'s counter', /Yesterday/.test(await txt(page, '.dlg h2')) && (await page.$eval('[data-f="b"]', (e) => e.value)) === '1130');
    ok('with the noon and six o\'clock numbers too', (await page.$eval('[data-f="m"]', (e) => e.value)) === '1115' && (await page.$eval('[data-f="e"]', (e) => e.value)) === '1130');
    await page.fill('[data-f="m"]', '1120');
    await page.fill('[data-f="b"]', '1135');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.veil', { state: 'detached' });
    ok('the noon number is saved too', (await store(page)).d['2026-11-17'].m === 1120);
    ok('the day recomputes: 1135 less 1100 is 35', (await store(page)).d['2026-11-17'].b === 1135 && /35 trades/.test(await txt(page, 'button[data-day="2026-11-17"]')), await txt(page, 'button[data-day="2026-11-17"]'));
    ok('and today starts where that day now ends: 1155 less 1135 is 20', (await txt(page, '#svBig')) === '20', await txt(page, '#svBig'));
    await c.close();
  }

  console.log('\nSVC — a backtest session');
  {
    const { c, page } = await ctx(SEED);
    await page.click('#svGo');
    ok('start turns the button to End session', (await txt(page, '#svGo')) === 'End session');
    ok('the ring becomes a clock', await page.$eval('#svBig', (e) => e.classList.contains('is-clock')));
    ok('the ring breathes while a session runs', await page.$eval('.ring', (e) => e.classList.contains('is-run')));
    await page.evaluate(() => __adv(45 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('a reload keeps the session on the clock', (await txt(page, '#svBig')) === '45:00', await txt(page, '#svBig'));
    ok('the counter can be typed into while it runs, without stopping it', await page.fill('#svB', '1160').then(() => true) && (await store(page)).run !== null && (await store(page)).d['2026-11-18'].b === 1160);
    await page.click('#svGo');
    ok('ending a backtest does not ask anything: it is filed with the time', !(await page.$('.dlg')));
    const s = await store(page), last = s.s[s.s.length - 1];
    ok('45 minutes, no trade count on it', last.k === 'bt' && last.b - last.a === 45 * 60e3 && last.n === 0 && s.run === null, last);
    ok('the trades are the counter\'s: 30', (await txt(page, '#svBig')) === '30');
    await page.click('.toast button');
    ok('Undo takes the session back off', (await store(page)).s.length === SEED.s.length);
    await page.click('#svAdd'); await page.waitForSelector('.dlg');
    ok('a past session asks for the time and nothing about trades or kinds', !/trades/i.test(await txt(page, '.dlg')) && !(await page.$('#svPK')));
    await page.fill('#svPS', '07:00'); await page.fill('#svPM', '50');
    await page.click('.dlg [data-a="save"]');
    ok('a past session is added, and the trades do not move', (await txt(page, '#svBig')) === '30' && (await store(page)).s.length === SEED.s.length + 1);
    const before = (await store(page)).s.length;
    await page.click('tr[data-i="f"] .del');
    ok('delete takes a session off', (await store(page)).s.length === before - 1);
    await page.click('.toast button');
    ok('and Undo puts it back', (await store(page)).s.length === before);
    await c.close();
  }

  console.log('\nSVC — pause');
  {
    const { c, page } = await ctx(SEED);
    ok('no pause button until a session runs', await page.$eval('#svPause', (e) => e.hidden));
    await page.click('#svGo');
    ok('a running session offers Pause beside End session', (await txt(page, '#svPause')) === 'Pause' && (await txt(page, '#svGo')) === 'End session' && await page.$eval('#svBar', (e) => e.classList.contains('is-two')));
    await page.evaluate(() => __adv(20 * 60e3));
    await page.click('#svPause');
    ok('pausing freezes the clock where it was', (await txt(page, '#svBig')) === '20:00' && /Paused/.test(await txt(page, '#svSub')), [await txt(page, '#svBig'), await txt(page, '#svSub')]);
    ok('the button becomes Resume, and the ring stops breathing', (await txt(page, '#svPause')) === 'Resume' && await page.$eval('.ring', (e) => e.classList.contains('is-paused') && !e.classList.contains('is-run')));
    await page.evaluate(() => __adv(15 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('fifteen minutes away and a reload later it is still 20:00 and still paused', (await txt(page, '#svBig')) === '20:00' && (await txt(page, '#svPause')) === 'Resume');
    await page.click('#svPause');
    ok('resuming starts it going again', (await txt(page, '#svPause')) === 'Pause' && await page.$eval('.ring', (e) => e.classList.contains('is-run')));
    await page.evaluate(() => __adv(10 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('ten more minutes make thirty on the clock, the fifteen away not counted', (await txt(page, '#svBig')) === '30:00', await txt(page, '#svBig'));
    await page.click('#svGo');
    const s = await store(page), last = s.s[s.s.length - 1];
    ok('filed: forty-five minutes of range, fifteen paused', last.b - last.a === 45 * 60e3 && last.p === 15 * 60e3, last);
    ok('the log row says thirty minutes, and how long was paused', /30m/.test(await txt(page, `tr[data-i="${last.i}"] .d`)) && /15m paused/.test(await txt(page, `tr[data-i="${last.i}"] .k`)), await txt(page, `tr[data-i="${last.i}"]`));
    ok('today counts the thirty on the clock, not the forty-five', /1h 30m on the clock/.test(await txt(page, '#svRows')), await txt(page, '#svRows'));
    await c.close();

    const k = await ctx(SEED);
    await k.page.keyboard.press('Space');
    ok('Space starts', (await store(k.page)).run !== null);
    await k.page.keyboard.press('Space');
    ok('and while running it pauses, never ends', (await store(k.page)).run !== null && (await store(k.page)).run.pa > 0 && (await store(k.page)).s.length === SEED.s.length);
    await k.page.keyboard.press('Space');
    ok('and resumes', (await store(k.page)).run.pa === null);
    await k.c.close();

    const e = await ctx(SEED);
    await e.page.click('#svGo');
    await e.page.evaluate(() => __adv(20 * 60e3));
    await e.page.click('#svPause');
    await e.page.evaluate(() => __adv(15 * 60e3));
    await e.page.click('#svGo');
    const es = await store(e.page), el = es.s[es.s.length - 1];
    ok('ended while paused, it ends where the pause began: twenty minutes, nothing paused', el.b - el.a === 20 * 60e3 && !el.p && es.run === null, el);
    await e.c.close();

    const o = await ctx(Object.assign({}, SEED, { s: SEED.s.map((x) => x.i === 'f' ? Object.assign({}, x, { p: 20 * 60e3 }) : x) }));
    ok('a session that paused counts its range less the pause: 40m, not 1h', /40m/.test(await txt(o.page, 'tr[data-i="f"] .d')) && /40m on the clock/.test(await txt(o.page, '#svRows')), [await txt(o.page, 'tr[data-i="f"] .d'), await txt(o.page, '#svRows')]);
    await o.c.close();
  }

  console.log('\nSVC — the visuals');
  {
    const { c, page } = await ctx(SEED);
    ok('the year is fifty-three weeks of seven', (await page.$$('#svYr i')).length === 371);
    ok('the days still to come are outlines, not misses', (await page.$$('#svYr i.is-ahead')).length === 4);
    ok('the year says what it counts', /2 days on target · best run 2/.test(await txt(page, '#svYrX')), await txt(page, '#svYrX'));
    ok('Monday is the top row: the first square is a Monday', await page.evaluate(() => /Mon/.test(document.querySelector('#svYr i').dataset.tip)));
    ok('thirty days of pace bars', (await page.$$('#svPc i')).length === 30);
    ok('the fastest days are white (Sunday, Monday and today all run 2m 24s)', (await page.$$('#svPc i.is-best')).length === 3);
    ok('a day with no backtests is an empty bar, not a slow one', (await page.$$('#svPc i.is-none')).length === 26);
    ok('the ring has no halo before the target', await page.evaluate(() => !document.querySelector('.ring').classList.contains('is-hit')));
    await page.hover('#svYr i.l3');
    await page.waitForSelector('.tip.on');
    ok('hovering a day names it', /trades/.test(await txt(page, '.tip')) && /Sun|Mon/.test(await txt(page, '.tip')), await txt(page, '.tip'));
    ok('the tip sits beside the pointer, inside the window', await page.evaluate(() => { const r = document.querySelector('.tip').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0; }));
    await page.mouse.move(5, 5);
    ok('and goes when you leave', await page.evaluate(() => !document.querySelector('.tip').classList.contains('on')));
    ok('the browser\'s own tooltips are gone from the charts', await page.evaluate(() => !document.querySelector('#svYr i[title], #svPc i[title]')));
    ok('the cards come up fully drawn', await page.waitForFunction(() => [...document.querySelectorAll('.card')].every((c) => getComputedStyle(c).opacity === '1'), null, { timeout: 4000 }).then(() => true, () => false));
    await c.close();
  }

  console.log('\nSVC — the week in review');
  {
    const { c, page } = await ctx(SEED);
    await page.click('#svRev'); await page.waitForSelector('.dlg.wide');
    ok('Review opens this week so far', /THIS WEEK\./.test(await txt(page, '.dlg')) && (await txt(page, '.rv-big b')) === '105');
    ok('three figures: days on target, time, pace', (await page.$$('.rv-figs > div')).length === 3);
    ok('seven days of bars', (await page.$$('.rv-days i')).length === 7);
    await page.click('[data-a="prev"]');
    ok('the arrow steps back a week', (await txt(page, '.rv-big b')) === '50' && /THE WEEK\./.test(await txt(page, '.rv-h')));
    ok('and stops at the first week there is', await page.$eval('[data-a="prev"]', (e) => e.disabled));
    ok('nothing in it is red', await page.evaluate(() => [...document.querySelectorAll('.dlg *')].every((e) => { const m = getComputedStyle(e).color.match(/\d+/g).map(Number); return !(m[0] > 150 && m[1] < 100); })));
    await page.keyboard.press('Escape');
    await c.close();
    const n = await ctx(Object.assign({}, SEED, { rev: '' }));
    await n.page.waitForSelector('.dlg.wide');
    ok('the first open of a week reviews the week just gone', /9 Nov – 15 Nov/.test(await txt(n.page, '.dlg')));
    await n.page.keyboard.press('Escape');
    await n.page.reload(); await n.page.waitForSelector('#svBig');
    ok('once', !(await n.page.$('.dlg')));
    await n.c.close();
    /* 320 on the counter by Monday, so the week needs 350 and today's
       sitting number takes it past */
    const w = await ctx({ t: [{ f: '2026-11-10', n: 50 }], s: [{ i: 'w', k: 'bt', a: at(16, 8), b: at(16, 10) }], d: { '2026-11-16': { a: 0, b: 320 } } });
    await w.page.fill('#svB', '365');
    ok('nothing happens while a number is half typed', !(await w.page.$('.dlg.wide')));
    await w.page.press('#svB', 'Enter');
    await w.page.waitForSelector('.dlg.wide');
    ok('crossing the week\'s 350 opens it, celebrating', /WEEK DONE\./.test(await txt(w.page, '.rv-h')) && (await w.page.$$('.cf')).length > 20);
    ok('the head glows', await w.page.$eval('.rv-h', (e) => e.classList.contains('is-win')));
    await w.c.close();
  }

  console.log('\nSVC — damage and nothing');
  {
    const bad = { s: [{ i: 'x', k: 'bt', a: 'no', b: 3 }, { i: 'y', k: 'gym', a: 1, b: 2 }, SEED.s[4]],
      t: [{ f: 'soon', n: 50 }, { f: '2026-11-10', n: -3 }], g: { step: 'lots', every: 0 },
      d: { nonsense: { a: 1 }, '2026-11-18': { a: 'x', b: -5 }, '2026-11-17': { b: 30 }, '2026-11-16': 'text' } };
    const { c, page } = await ctx(bad);
    ok('a damaged session costs itself, not the log', (await page.$$('tr[data-i]')).length === 1);
    ok('a broken target history falls back to fifty from today', /of 50 trades/.test(await txt(page, '#svSub')));
    await page.click('#svSet'); await page.waitForSelector('.dlg');
    ok('a broken raise falls back to 15 every 14 days', (await page.$eval('[data-g="step"]', (e) => e.value)) === '15' && (await page.$eval('[data-g="every"]', (e) => e.value)) === '14');
    await page.click('.dlg [data-a="save"]');
    const dk = Object.keys((await store(page)).d);
    ok('a damaged day costs itself: the broken ones are gone, the good one stays', dk.length === 1 && dk[0] === '2026-11-17', dk);
    ok('and today reads zero rather than nonsense', (await txt(page, '#svBig')) === '0');
    await c.close();
    const e = await ctx(null);
    ok('an empty log says how to start', /Press Start backtesting/.test(await txt(e.page, '#svLog')));
    await e.page.click('#svSet'); await e.page.waitForSelector('.dlg');
    ok('and the target field says fifty', (await e.page.$eval('[data-g="n"]', (x) => x.value)) === '50');
    await e.c.close();

    const legacy = { s: [{ i: 'L', k: 'live', a: at(17, 20), b: at(17, 21), t: '20:02  note' }, SEED.s[4]], d: SEED.d, t: SEED.t };
    const l = await ctx(legacy);
    ok('a live session from before is not shown and not counted', (await l.page.$$('tr[data-i]')).length === 1);
    await l.page.fill('#svB', '1156');
    ok('but it is not thrown away either', (await store(l.page)).s.length === 2 && (await store(l.page)).s[0].t === '20:02  note');
    await l.c.close();
  }

  ok('nothing leaves the origin', offOrigin.length === 0, offOrigin);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
