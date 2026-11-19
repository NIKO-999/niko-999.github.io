/* ═══════════════════════════════════════════════════════════════
   SVC — the session timer. Desktop, 1440x900.

   The clock is frozen at Wednesday 18 November 2026, 10:00 and moved by
   hand (`__adv`), so a session's length is a fact about the fixture.

   Trades come from a day's counter (where it started, where it sits),
   never from the sessions, which are time and nothing else.
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
/* Sessions are time. Sunday 15th and Monday 16th: 2h for 40 trades each.
   Tuesday 17th: 1h30 for 25, and an hour of live charts. Today, Wednesday
   18th: an hour for 20 and a quarter of an hour of content. The counter
   starts the 15th at 1000, so Monday starts where Sunday ended, and the
   days after start where the last one ended, with nothing typed. */
const SEED = {
  s: [
    { i: 'a', k: 'bt', a: at(15, 9), b: at(15, 11) },
    { i: 'b', k: 'bt', a: at(16, 8), b: at(16, 9) },
    { i: 'c', k: 'bt', a: at(16, 14), b: at(16, 15) },
    { i: 'd', k: 'bt', a: at(17, 8), b: at(17, 9, 30) },
    { i: 'e', k: 'live', a: at(17, 20), b: at(17, 21) },
    { i: 'f', k: 'bt', a: at(18, 8), b: at(18, 9) },
    { i: 'g', k: 'cnt', a: at(18, 9, 10), b: at(18, 9, 25) },
  ],
  d: { '2026-11-15': { a: 1000, b: 1040 }, '2026-11-16': { b: 1080 }, '2026-11-17': { b: 1105 }, '2026-11-18': { b: 1125 } },
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
        rowN: +getComputedStyle(document.querySelector('.row-n small')).fontWeight };
    });
    ok('jet black ground, white bold head', look.bg === 'rgb(0, 0, 0)' && look.ink === 'rgb(255, 255, 255)' && look.w >= 700, look);
    ok('the small type is not bold', look.sub < 600 && look.rowN < 600, look);
    ok('the ring says today\'s trades of 40', (await txt(page, '#svBig')) === '20' && /of 40 trades/.test(await txt(page, '#svSub')));
    const off = await page.$eval('#svArc', (e) => [parseFloat(e.style.strokeDashoffset), parseFloat(e.style.strokeDasharray)]);
    ok('the ring is half full', Math.abs(off[0] / off[1] - 0.5) < 0.01, off);
    const rows = await txt(page, '#svRows');
    ok('today counts volume only, with no morning or afternoon split', /20 to go/.test(rows) && !/morning|afternoon/i.test(rows), rows);
    ok('content counts its fifteen minutes of thirty', /Content \+ journal15m\s*\/ 30m/.test(rows), rows);
    ok('the week reads 85 of 280', /^85\s*\/ 280$/.test(await txt(page, '#svWk')), await txt(page, '#svWk'));
    ok('live this week reads 1h of 5h', /^1h\s*\/ 5h$/.test(await txt(page, '#svLv')), await txt(page, '#svLv'));
    ok('the month target is 40 a day for thirty days', /\/ 1,200$/.test(await txt(page, '#svMo')), await txt(page, '#svMo'));
    /* 6h 30m of backtesting over 125 trades: 3m 07s a trade, so 40 take 2h 5m */
    ok('pace is time over trades', (await txt(page, '#svEta')) === '2h 5m' && /30 days3m 07s/.test(await txt(page, '#svPaceF')), [await txt(page, '#svEta'), await txt(page, '#svPaceF')]);
    ok('the streak is broken by Tuesday\'s 25 and today is not over', /^0 days/.test(await txt(page, '#svSt')), await txt(page, '#svSt'));
    ok('best run is two days', /Best run 2/.test(await txt(page, '#svStX')), await txt(page, '#svStX'));
    ok('four weeks of dots, Monday first', (await page.$$('#svDots .dot')).length === 28);
    ok('the log groups by day, newest first', (await page.$$eval('.day-h span:first-child', (e) => e.map((x) => x.textContent)))[0] === 'Today');
    ok('a backtest row is time only: no trade count on it', !/trades/.test(await txt(page, 'tr[data-i="f"]')), await txt(page, 'tr[data-i="f"]'));
    ok('the day header says the trades and the time', /20 trades · 1h 15m/.test(await txt(page, '.day-h .link')), await txt(page, '.day-h .link'));
    ok('the two top cards are one row, top-aligned, one height', await page.evaluate(() => {
      const a = document.querySelector('.timer-card').getBoundingClientRect(), b = document.querySelector('.today').getBoundingClientRect();
      return Math.abs(a.top - b.top) < 1 && Math.abs(a.height - b.height) < 1;
    }));
    ok('the four stat cards are one height', await page.evaluate(() => new Set([...document.querySelectorAll('.stat')].map((e) => Math.round(e.getBoundingClientRect().height))).size === 1));
    ok('nothing runs off the side', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    ok('and none of the clutter is on the page', await page.evaluate(() => !document.querySelector('#svTl, .mini, #svTicks, #svHead, #svPlus, #svMinus, .live-d')));
    await c.close();
  }

  console.log('\nSVC — the day\'s counter');
  {
    const { c, page } = await ctx(SEED);
    ok('the fields are where the day started and where it sits', (await page.$eval('#svA', (e) => e.value)) === '' && (await page.$eval('#svB', (e) => e.value)) === '1125');
    ok('the start is carried from last night, and shown as the hint', (await page.$eval('#svA', (e) => e.placeholder)) === '1105', await page.$eval('#svA', (e) => e.placeholder));
    await page.fill('#svB', '1145');
    ok('typing where it sits does the sum: 1145 less 1105 is 40', (await txt(page, '#svBig')) === '40' && /Target hit/.test(await txt(page, '#svRows')));
    ok('the ring lights up once the target is hit', await page.$eval('.ring', (e) => e.classList.contains('is-hit')));
    ok('and it is saved as it is typed', (await store(page)).d['2026-11-18'].b === 1145);
    await page.fill('#svA', '1100');
    ok('typing a start overrides the carried one: 1145 less 1100', (await txt(page, '#svBig')) === '45');
    ok('the field keeps the digits you typed through the repaint', (await page.$eval('#svA', (e) => e.value)) === '1100');
    await page.fill('#svB', '1145');
    ok('the week follows the counter: Monday 40, Tuesday 25, today 45', /^110\s*\/ 280$/.test(await txt(page, '#svWk')), await txt(page, '#svWk'));
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

  console.log('\nSVC — a day you forgot');
  {
    const { c, page } = await ctx(SEED);
    await page.click('button[data-day="2026-11-17"]'); await page.waitForSelector('.dlg');
    ok('a day header opens that day\'s counter', /Yesterday/.test(await txt(page, '.dlg h2')) && (await page.$eval('[data-f="b"]', (e) => e.value)) === '1105');
    await page.fill('[data-f="b"]', '1110');
    await page.keyboard.press('Enter');
    await page.waitForSelector('.veil', { state: 'detached' });
    ok('the day recomputes: 1110 less 1080 is 30', (await store(page)).d['2026-11-17'].b === 1110 && /30 trades/.test(await txt(page, 'button[data-day="2026-11-17"]')), await txt(page, 'button[data-day="2026-11-17"]'));
    ok('and today starts where that day now ends: 1125 less 1110 is 15', (await txt(page, '#svBig')) === '15', await txt(page, '#svBig'));
    await c.close();
  }

  console.log('\nSVC — a backtest session');
  {
    const { c, page } = await ctx(SEED);
    await page.click('#svGo');
    ok('start turns the button to End session', (await txt(page, '#svGo')) === 'End session');
    ok('the ring becomes a clock', await page.$eval('#svBig', (e) => e.classList.contains('is-clock')));
    ok('the other kinds are locked while running', await page.$$eval('.kind', (b) => b.filter((x) => x.disabled).length === 2));
    ok('the ring breathes while a session runs', await page.$eval('.ring', (e) => e.classList.contains('is-run')));
    await page.evaluate(() => __adv(45 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('a reload keeps the session on the clock', (await txt(page, '#svBig')) === '45:00', await txt(page, '#svBig'));
    ok('the counter can be typed into while it runs, without stopping it', await page.fill('#svB', '1130').then(() => true) && (await store(page)).run !== null && (await store(page)).d['2026-11-18'].b === 1130);
    await page.click('#svGo');
    ok('ending a backtest does not ask anything: it is filed with the time', !(await page.$('.dlg')));
    const s = await store(page), last = s.s[s.s.length - 1];
    ok('45 minutes, no trade count on it', last.k === 'bt' && last.b - last.a === 45 * 60e3 && last.n === 0 && s.run === null, last);
    ok('the trades are the counter\'s: 25', (await txt(page, '#svBig')) === '25');
    await page.click('.toast button');
    ok('Undo takes the session back off', (await store(page)).s.length === SEED.s.length);
    await c.close();
  }

  console.log('\nSVC — a live session, Space, delete, add');
  {
    const { c, page } = await ctx(SEED);
    await page.click('.kind[data-k="live"]');
    await page.keyboard.press('Space');
    ok('Space starts a session', (await store(page)).run && (await store(page)).run.k === 'live');
    await page.evaluate(() => __adv(30 * 60e3));
    await page.evaluate(() => document.activeElement.blur());
    await page.click('#svGo');
    const s = await store(page);
    ok('a live session files without asking', !(await page.$('.dlg')) && s.s[s.s.length - 1].k === 'live' && !s.run);
    ok('live this week moves to 1h 30m', /^1h 30m/.test(await txt(page, '#svLv')), await txt(page, '#svLv'));
    const before = (await store(page)).s.length;
    await page.click('tr[data-i="f"] .del');
    ok('delete takes a session off', (await store(page)).s.length === before - 1);
    await page.click('.toast button');
    ok('and Undo puts it back', (await store(page)).s.length === before);
    await page.click('#svAdd'); await page.waitForSelector('.dlg');
    ok('a past session asks for the time and nothing about trades', !/trades/i.test(await txt(page, '.dlg')));
    await page.selectOption('#svPK', 'bt');
    await page.fill('#svPS', '07:00'); await page.fill('#svPM', '50');
    await page.click('.dlg [data-a="save"]');
    ok('a past session is added, and the trades do not move', (await txt(page, '#svBig')) === '20' && (await store(page)).s.length === before + 1);
    await page.keyboard.press('Escape');
    await page.click('#svSet'); await page.waitForSelector('.dlg');
    await page.fill('[data-g="bt"]', '100'); await page.click('.dlg [data-a="save"]');
    ok('the daily target moves to 100', /of 100 trades/.test(await txt(page, '#svSub')) && /\/ 700$/.test(await txt(page, '#svWk')));
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
    ok('pausing freezes the clock where it was', (await txt(page, '#svBig')) === '20:00' && /paused/.test(await txt(page, '#svSub')), [await txt(page, '#svBig'), await txt(page, '#svSub')]);
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

  console.log('\nSVC — live notes');
  {
    const { c, page } = await ctx(SEED);
    ok('no notepad until a live session runs', await page.$eval('#svNotesP', (e) => e.hidden) && await page.$eval('#svTodayP', (e) => !e.hidden));
    await page.click('.kind[data-k="live"]'); await page.click('#svGo');
    ok('a live session opens the notepad in place of Today, focused', await page.$eval('#svNotesP', (e) => !e.hidden)
      && await page.$eval('#svTodayP', (e) => e.hidden) && await page.evaluate(() => document.activeElement.id === 'svNotes'));
    await page.keyboard.type('Sweep of the high <then> CISD');
    await page.keyboard.press('Enter'); await page.keyboard.type('Second line');
    ok('Space in the notes is a space, not a stop', (await store(page)).run !== null);
    await page.waitForTimeout(400);
    const NOTE = '10:00  Sweep of the high <then> CISD\n10:00  Second line';
    ok('every line of the notes starts with the time it was written', (await page.$eval('#svNotes', (e) => e.value)) === NOTE, await page.$eval('#svNotes', (e) => e.value));
    await page.evaluate(() => __adv(10 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('a reload keeps the notes', (await page.$eval('#svNotes', (e) => e.value)) === NOTE);
    await page.evaluate(() => __adv(50 * 60e3));
    await page.waitForTimeout(1100);
    ok('a repaint leaves the field alone', (await page.$eval('#svNotes', (e) => e.value)).endsWith('Second line'));
    await page.click('#svGo');
    const s = await store(page), last = s.s[s.s.length - 1];
    ok('the notes are filed with the session, stamps and all', last.k === 'live' && last.t === NOTE && last.b - last.a === 60 * 60e3, last);
    ok('Today comes back', await page.$eval('#svTodayP', (e) => !e.hidden));
    const shown = await page.$eval('.note-r div', (e) => e.textContent);
    ok('the log shows the notes as text, under the session', shown === NOTE, shown);
    await c.close();
  }

  console.log('\nSVC — the visuals');
  {
    const { c, page } = await ctx(SEED);
    ok('the year is fifty-three weeks of seven', (await page.$$('#svYr i')).length === 371);
    ok('two days on target light white (Sunday and Monday)', (await page.$$('#svYr i.l3')).length === 2);
    ok('the days still to come are outlines, not misses', (await page.$$('#svYr i.is-ahead')).length === 4);
    ok('the year says what it counts', /2 days on target · best run 2/.test(await txt(page, '#svYrX')), await txt(page, '#svYrX'));
    ok('Monday is the top row: the first square is a Monday', await page.evaluate(() => /Mon/.test(document.querySelector('#svYr i').dataset.tip)));
    ok('thirty days of pace bars', (await page.$$('#svPc i')).length === 30);
    ok('the fastest days are white (Sunday, Monday and today all run 3m 00s)', (await page.$$('#svPc i.is-best')).length === 3);
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
    ok('Review opens this week so far', /THIS WEEK\./.test(await txt(page, '.dlg')) && (await txt(page, '.rv-big b')) === '85');
    ok('seven days of bars', (await page.$$('.rv-days i')).length === 7);
    await page.click('[data-a="prev"]');
    ok('the arrow steps back a week', (await txt(page, '.rv-big b')) === '40' && /THE WEEK\./.test(await txt(page, '.rv-h')));
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
    /* 245 trades this week already (Monday 16th, 245 on the counter); today's
       sitting number takes it past 280 */
    const w = await ctx({ s: [{ i: 'w', k: 'bt', a: at(16, 8), b: at(16, 10) }], d: { '2026-11-16': { a: 0, b: 245 } } });
    await w.page.fill('#svB', '285');
    ok('nothing happens while a number is half typed', !(await w.page.$('.dlg.wide')));
    await w.page.press('#svB', 'Enter');
    await w.page.waitForSelector('.dlg.wide');
    ok('crossing 280 opens the week, celebrating', /WEEK DONE\./.test(await txt(w.page, '.rv-h')) && (await w.page.$$('.cf')).length > 20);
    ok('the head glows', await w.page.$eval('.rv-h', (e) => e.classList.contains('is-win')));
    await w.c.close();
  }

  console.log('\nSVC — the 8pm reminder');
  {
    const stub = `(() => { window.__notes = []; window.Notification = class { constructor(t, o) { __notes.push(t); } static get permission() { return 'granted'; } static requestPermission() { return Promise.resolve('granted'); } }; })();`;
    const { c, page } = await ctx(SEED, '2026-11-18T20:05:00', stub);
    await page.waitForSelector('.toast');
    ok('at 20:05 it says the New York hour is on', /New York hour/.test(await txt(page, '.toast')));
    ok('and sends a desktop notification', (await page.evaluate(() => __notes)).length === 1);
    await page.click('.toast button');
    ok('Start live starts the live session', (await store(page)).run.k === 'live');
    await page.reload(); await page.waitForSelector('#svBig');
    ok('once a day', !(await page.$('.toast')) && (await page.evaluate(() => __notes)).length === 0);
    await c.close();
    const done = Object.assign({}, SEED, { s: SEED.s.concat([{ i: 'L', k: 'live', a: at(18, 19), b: at(18, 19, 50) }]) });
    const d2 = await ctx(done, '2026-11-18T20:05:00', stub);
    await d2.page.waitForTimeout(300);
    ok('not once a live session has happened today', !(await d2.page.$('.toast')));
    await d2.c.close();
    const d3 = await ctx(SEED, '2026-11-18T16:00:00', stub);
    await d3.page.waitForTimeout(300);
    ok('not outside its hour', !(await d3.page.$('.toast')));
    await d3.c.close();
  }

  console.log('\nSVC — damage and nothing');
  {
    const bad = { s: [{ i: 'x', k: 'bt', a: 'no', b: 3 }, { i: 'y', k: 'gym', a: 1, b: 2 }, SEED.s[5]], g: { bt: -4 },
      d: { nonsense: { a: 1 }, '2026-11-18': { a: 'x', b: -5 }, '2026-11-17': { b: 30 }, '2026-11-16': 'text' } };
    const { c, page } = await ctx(bad);
    ok('a damaged session costs itself, not the log', (await page.$$('tr[data-i]')).length === 1);
    ok('a broken target falls back to 40', /of 40 trades/.test(await txt(page, '#svSub')));
    await page.click('.kind[data-k="live"]');
    const dk = Object.keys((await store(page)).d);
    ok('a damaged day costs itself: the broken ones are gone, the good one stays', dk.length === 1 && dk[0] === '2026-11-17', dk);
    ok('and today reads zero rather than nonsense', (await txt(page, '#svBig')) === '0');
    await c.close();
    const e = await ctx(null);
    ok('an empty log says how to start', /Press Start session/.test(await txt(e.page, '#svLog')));
    await e.c.close();
  }

  ok('nothing leaves the origin', offOrigin.length === 0, offOrigin);
  ok('no page errors', errors.length === 0, errors);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
