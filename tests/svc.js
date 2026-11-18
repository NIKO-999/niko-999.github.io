/* ═══════════════════════════════════════════════════════════════
   SVC — the session timer. Desktop, 1440x900.

   The clock is frozen at Wednesday 18 November 2026, 10:00 and moved by
   hand (`__adv`), so a session's length is a fact about the fixture.
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
const at = (d, h, m) => new Date(`2026-11-${d}T${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`).getTime();
/* Monday 16th: the target hit, 20 and 20. Tuesday 17th: 25 trades and an
   hour of live charts. Wednesday 18th (today): 20 in the morning. Last
   Sunday 15th: 40, so the streak is three days ending yesterday-ish. */
const SEED = { s: [
  { i: 'a', k: 'bt', a: at(15, 9), b: at(15, 11), n: 40 },
  { i: 'b', k: 'bt', a: at(16, 8), b: at(16, 9), n: 20 },
  { i: 'c', k: 'bt', a: at(16, 14), b: at(16, 15), n: 20 },
  { i: 'd', k: 'bt', a: at(17, 8), b: at(17, 9, 30), n: 25 },
  { i: 'e', k: 'live', a: at(17, 20), b: at(17, 21) },
  { i: 'f', k: 'bt', a: at(18, 8), b: at(18, 9), n: 20 },
  { i: 'g', k: 'cnt', a: at(18, 9, 10), b: at(18, 9, 25) },
] };

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [], offOrigin = [];
  async function ctx(seed) {
    const c = await browser.newContext(DESK);
    await c.addInitScript(freeze('2026-11-18T10:00:00'));
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
    ok('the week reads 85 of 280 (Sunday was last week)', /^85\s*\/ 280$/.test(await txt(page, '#svWk')), await txt(page, '#svWk'));
    ok('live this week reads 1h of 5h', /^1h\s*\/ 5h$/.test(await txt(page, '#svLv')), await txt(page, '#svLv'));
    ok('the month target is 40 a day for thirty days', /\/ 1,200$/.test(await txt(page, '#svMo')), await txt(page, '#svMo'));
    /* 6h 30m over 125 trades: the pace is 3m 07s, and 40 take 2h 5m */
    ok('pace is time over trades', (await txt(page, '#svPer')) === '3m 07s' && (await txt(page, '#svEta')) === '2h 5m', [await txt(page, '#svPer'), await txt(page, '#svEta')]);
    ok('the streak is broken by Tuesday\'s 25 and today is not over', /^0 days/.test(await txt(page, '#svSt')), await txt(page, '#svSt'));
    const st = await txt(page, '#svStX');
    ok('best run is two days', /Best 2/.test(st), st);
    ok('four weeks of dots, Monday first', (await page.$$('#svDots .dot')).length === 28);
    ok('the log groups by day, newest first', (await page.$$eval('.day-h span:first-child', (e) => e.map((x) => x.textContent)))[0] === 'Today');
    ok('the today panel and the ring are one row, top-aligned, one height', await page.evaluate(() => {
      const a = document.querySelector('.timer-card').getBoundingClientRect(), b = document.querySelector('.today').getBoundingClientRect();
      return Math.abs(a.top - b.top) < 1 && Math.abs(a.height - b.height) < 1;
    }));
    ok('the four stat cards are one height', await page.evaluate(() => new Set([...document.querySelectorAll('.stat')].map((e) => Math.round(e.getBoundingClientRect().height))).size === 1));
    ok('nothing runs off the side', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await c.close();
  }

  console.log('\nSVC — a backtest session');
  {
    const { c, page } = await ctx(SEED);
    await page.click('#svGo');
    ok('start turns the button to End session', (await txt(page, '#svGo')) === 'End session');
    ok('the ring becomes a clock', await page.$eval('#svBig', (e) => e.classList.contains('is-clock')));
    ok('the other kinds are locked while running', await page.$$eval('.kind', (b) => b.filter((x) => x.disabled).length === 2));
    await page.evaluate(() => __adv(45 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('a reload keeps the session on the clock', (await txt(page, '#svBig')) === '45:00', await txt(page, '#svBig'));
    await page.click('#svGo');
    await page.waitForSelector('.dlg');
    ok('ending a backtest asks how many trades', /How many trades/.test(await txt(page, '.dlg')));
    await page.keyboard.type('20'); await page.keyboard.press('Enter');
    await page.waitForSelector('.veil', { state: 'detached' });
    const s = await store(page);
    const last = s.s[s.s.length - 1];
    ok('the session is filed with 20 trades and 45 minutes', last.k === 'bt' && last.n === 20 && last.b - last.a === 45 * 60e3, last);
    ok('the run is cleared', s.run === null);
    ok('the ring reads 40 and is full', (await txt(page, '#svBig')) === '40');
    ok('the day reads target hit', /Target hit/.test(await txt(page, '#svRows')));
    await page.click('.toast button');
    ok('Undo takes it back off', (await store(page)).s.length === SEED.s.length && (await txt(page, '#svBig')) === '20');
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
    await page.keyboard.press('Space');
    const s = await store(page);
    ok('a live session files without asking', !(await page.$('.dlg')) && s.s[s.s.length - 1].k === 'live' && !s.run);
    ok('live this week moves to 1h 30m', /^1h 30m/.test(await txt(page, '#svLv')), await txt(page, '#svLv'));
    const before = (await store(page)).s.length;
    await page.click('tr[data-i="f"] .del');
    ok('delete takes a session off', (await store(page)).s.length === before - 1);
    await page.click('.toast button');
    ok('and Undo puts it back', (await store(page)).s.length === before);
    await page.click('#svAdd'); await page.waitForSelector('.dlg');
    await page.selectOption('#svPK', 'bt');
    await page.fill('#svPS', '07:00'); await page.fill('#svPM', '50'); await page.fill('#svPN', '15');
    await page.click('.dlg [data-a="save"]');
    ok('a past session is added', (await txt(page, '#svBig')) === '35');
    await page.keyboard.press('Escape');
    await page.click('#svSet'); await page.waitForSelector('.dlg');
    await page.fill('[data-g="bt"]', '100'); await page.click('.dlg [data-a="save"]');
    ok('the daily target moves to 100', /of 100 trades/.test(await txt(page, '#svSub')) && /\/ 700$/.test(await txt(page, '#svWk')));
    await c.close();
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
    await page.evaluate(() => __adv(10 * 60e3));
    await page.reload(); await page.waitForSelector('#svBig');
    ok('a reload keeps the notes', (await page.$eval('#svNotes', (e) => e.value)) === 'Sweep of the high <then> CISD\nSecond line');
    await page.evaluate(() => __adv(50 * 60e3));
    await page.waitForTimeout(1100);
    ok('a repaint leaves the field alone', (await page.$eval('#svNotes', (e) => e.value)).endsWith('Second line'));
    await page.click('#svGo');
    const s = await store(page), last = s.s[s.s.length - 1];
    ok('the notes are filed with the session', last.k === 'live' && last.t === 'Sweep of the high <then> CISD\nSecond line' && last.b - last.a === 60 * 60e3, last);
    ok('Today comes back', await page.$eval('#svTodayP', (e) => !e.hidden));
    const shown = await page.$eval('.note-r div', (e) => e.textContent);
    ok('the log shows the notes as text, under the session', shown === 'Sweep of the high <then> CISD\nSecond line', shown);
    await c.close();
  }

  console.log('\nSVC — damage and nothing');
  {
    const { c, page } = await ctx({ s: [{ i: 'x', k: 'bt', a: 'no', b: 3 }, { i: 'y', k: 'gym', a: 1, b: 2 }, SEED.s[5]], g: { bt: -4 } });
    ok('a damaged session costs itself, not the log', (await store(page)) === null || (await page.$$('tr[data-i]')).length === 1);
    ok('a broken target falls back to 40', /of 40 trades/.test(await txt(page, '#svSub')));
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
