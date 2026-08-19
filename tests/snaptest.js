/* A copy of yesterday, taken before today changes anything. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  pg.on('dialog', d => d.accept());
  await pg.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });

  console.log('\n── one a day, of what was there before');
  const first = await pg.evaluate(() => {
    localStorage.removeItem(SKEY);
    liven();
    state.events = [{ id: 'a', seq: 1, k: 'trade', out: 'win', date: '2026-08-01', amt: 100 }];
    writeStore(state);
    /* Now a save happens: the snapshot must hold the ONE-record ledger,
       not the two-record one it is about to become. */
    state.events.push({ id: 'b', seq: 2, k: 'trade', out: 'win', date: '2026-08-02', amt: 200 });
    commit('two');
    const all = snapAll();
    let held = null;
    try { held = JSON.parse(all[0].raw).events.length; } catch (e) {}
    return { snaps: all.length, held, live: state.events.length };
  });
  ok(first.snaps === 1, `a save takes one snapshot (${first.snaps})`);
  ok(first.held === 1 && first.live === 2,
     `and it holds the ledger BEFORE the save (${first.held} kept, ${first.live} live)`);

  const again = await pg.evaluate(() => {
    state.events.push({ id: 'c', seq: 3, k: 'trade', out: 'win', date: '2026-08-03', amt: 300 });
    commit('three');
    state.events.push({ id: 'd', seq: 4, k: 'trade', out: 'win', date: '2026-08-04', amt: 400 });
    commit('four');
    return { snaps: snapAll().length, held: JSON.parse(snapAll()[0].raw).events.length };
  });
  ok(again.snaps === 1, `later saves the same day add nothing (${again.snaps})`);
  ok(again.held === 1, 'so the copy stays a whole day behind the damage');

  console.log('\n── seven days, then the oldest goes');
  const rolled = await pg.evaluate(() => {
    const mk = (i) => ({ day: '2026-07-' + String(i).padStart(2, '0'), at: Date.now(),
                         raw: JSON.stringify({ events: new Array(i).fill(0)
                           .map((_, j) => ({ id: 'x' + j, k: 'trade', amt: 1 })), bin: [] }) });
    const all = [];
    for (let i = 1; i <= 12; i++) {
      all.push(mk(i));
      while (all.length > SNAP_DAYS) all.shift();
    }
    return { n: all.length, first: all[0].day, last: all[all.length - 1].day };
  });
  ok(rolled.n === 7, `seven are kept (${rolled.n})`);
  ok(rolled.first === '2026-07-06' && rolled.last === '2026-07-12',
     `and they are the newest seven (${rolled.first} … ${rolled.last})`);

  console.log('\n── rolling one back');
  await pg.evaluate(() => {
    localStorage.removeItem(SKEY);
    liven();
    state.events = [
      { id: 'k1', seq: 1, k: 'trade', out: 'win', date: '2026-08-01', amt: 2156, sym: 'AAA' },
      { id: 'k2', seq: 2, k: 'trade', out: 'win', date: '2026-08-02', amt: 300 },
    ];
    writeStore(state);
    /* A snapshot dated yesterday, holding both. */
    localStorage.setItem(SKEY, JSON.stringify([{ day: '2026-08-02', at: Date.now() - 86400000,
      raw: JSON.stringify(state) }]));
    /* Then the damage: the good one goes, permanently, the old way. */
    state.events = state.events.filter(e => e.id !== 'k1');
    writeStore(state);
    renderAll();
  });
  await pg.waitForTimeout(250);

  ok(await pg.isVisible('#binBtn'),
     'the icon is on screen for a rollback point even with an empty bin');
  await pg.click('#binBtn');
  await pg.waitForTimeout(300);
  ok(await pg.isVisible('#snapWrap'), 'the earlier versions are listed');
  ok(await pg.locator('#snapList .bin-row').count() === 1, 'one of them');
  const lbl = await pg.textContent('#snapList .bin-what');
  ok(/2026-08-02/.test(lbl) && /2 records/.test(lbl),
     `named by day and size (${lbl.replace(/\s+/g, ' ').trim()})`);

  await pg.screenshot({ path: D + '/snap-open.png' });
  await pg.click('#snapList [data-day]');
  await pg.waitForTimeout(400);

  const after = await pg.evaluate(() => ({
    n: state.events.length,
    got: !!state.events.find(e => e.id === 'k1' && e.amt === 2156),
    snaps: snapAll().length,
    todayHeld: (() => { try { return JSON.parse(snapAll().slice(-1)[0].raw).events.length; }
                        catch (e) { return -1; } })(),
    said: document.getElementById('say').textContent,
  }));
  ok(after.got, 'the lost trade comes back');
  ok(after.n === 2, `with the rest of that day (${after.n} records)`);
  ok(/Rolled back to 2026-08-02/.test(after.said), 'and it says what it did');
  ok(after.snaps === 2 && after.todayHeld === 1,
     'the ledger it replaced was stashed first, so the rollback is itself undoable');

  console.log('\n── and it does not stop a save when the disk is full');
  const survived = await pg.evaluate(() => {
    const real = localStorage.setItem.bind(localStorage);
    let blocked = 0;
    localStorage.setItem = function (k, v) {
      if (k === SKEY) { blocked++; throw new Error('QuotaExceededError'); }
      return real(k, v);
    };
    let threw = false;
    try {
      localStorage.removeItem(SKEY);
      state.events.push({ id: 'z', seq: 9, k: 'trade', out: 'win', date: '2026-09-09', amt: 5 });
      commit('with the snapshot store refusing');
    } catch (e) { threw = true; }
    localStorage.setItem = real;
    return { threw, blocked, saved: (JSON.parse(localStorage.getItem(KEY)).events || [])
      .some(e => e.id === 'z') };
  });
  ok(!survived.threw && survived.blocked > 0, 'a refused snapshot is swallowed');
  ok(survived.saved, 'and the trade is still saved, which is the thing that matters');

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
