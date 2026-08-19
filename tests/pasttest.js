/* Past is a record of the years now, and the board keeps everything it
   was already drawing. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

const SEED = `(() => {
  const y = new Date().getFullYear();
  const d = (yr, m, dd) => yr + '-' + String(m).padStart(2,'0') + '-' + String(dd).padStart(2,'0');
  commit(false, (s) => {
    s.goals = [
      /* finished, both dates, two different years */
      { id: 'p1', name: 'Ship the journal', from: d(y-2,1,10), to: d(y-2,3,10),
        doneOn: d(y-2,4,1), done: true, horizon: 'year', kind: 'span', tone: 'dark' },
      { id: 'p2', name: 'First funded account', from: d(y-1,2,1), to: d(y-1,5,1),
        doneOn: d(y-1,4,20), done: true, horizon: 'year', kind: 'span', tone: 'accent' },
      /* ran past its end date and was never ticked — the case that used
         to vanish from every screen except the board */
      { id: 'p3', name: 'Learn piano', from: d(y-1,6,1), to: d(y-1,12,1),
        done: false, horizon: 'year', kind: 'span', tone: 'muted' },
      /* still running: must NOT be in Past */
      { id: 'p4', name: 'Trading journal, daily', from: d(y,1,1), to: d(y+1,12,1),
        done: false, horizon: 'now', kind: 'span', tone: 'accent' },
      /* no dates at all: not in Past either */
      { id: 'p5', name: 'Sabbatical', from: null, to: null,
        done: false, horizon: 'someday', kind: 'span', tone: 'muted' },
    ];
  });
  layout(); renderPast();
  return y;
})()`;

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
  const errs = [];
  pg.on('pageerror', e => errs.push('JS: ' + e.message));
  await pg.emulateMedia({ colorScheme: 'dark' });
  await pg.goto(`${BASE}/arc/`, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(300);
  const Y = await pg.evaluate(SEED);
  await pg.waitForTimeout(300);

  console.log('\n── what counts as behind you');
  const which = await pg.evaluate(() =>
    goals().filter(isPast).map(g => g.id).sort());
  ok(which.join(',') === 'p1,p2,p3',
     `finished goals and ones past their end date (${which.join(', ')})`);
  ok(!which.includes('p4'), 'a goal still running is not in it');
  ok(!which.includes('p5'), 'and neither is one with no dates');

  console.log('\n── it is still on the chart');
  await pg.evaluate(() => goto('board'));
  await pg.waitForTimeout(300);
  const drawn = await pg.$$eval('#rows .bar', bs => bs.map(b => b.dataset.id).sort());
  ok(drawn.includes('p3'),
     'the goal past its end date keeps drawing on the timeline');
  ok(drawn.includes('p4'), 'alongside the live one');
  ok(!drawn.includes('p1') && !drawn.includes('p2'),
     'while finished ones leave it, as they always did');

  console.log('\n── filed by year');
  await pg.evaluate(() => goto('past'));
  await pg.waitForTimeout(350);
  const years = await pg.$$eval('#stripes .yr-h', hs =>
    hs.map(h => h.firstChild.textContent.trim()));
  ok(years.length === 2, `one heading per year (${years.join(', ')})`);
  ok(years[0] === String(Y - 1) && years[1] === String(Y - 2),
     `newest year first (${years.join(' then ')})`);

  const counts = await pg.$$eval('#stripes .yr-h span', ss => ss.map(s => s.textContent.trim()));
  ok(/2 goals · 1 finished/.test(counts[0]), `each year says what it held (${counts[0]})`);
  ok(/1 goal · 1 finished/.test(counts[1]), `and gets the singular right (${counts[1]})`);

  const meta = await pg.textContent('#pastMeta');
  ok(/3 behind you/.test(meta) && /2 finished/.test(meta) && /2 years/.test(meta),
     `the head sums it up (${meta.trim()})`);

  console.log('\n── a goal that was never ticked says so');
  const open = await pg.evaluate(() => {
    const li = [...document.querySelectorAll('#stripes li')]
      .find(x => /Learn piano/.test(x.textContent));
    return li ? { cls: li.className, num: li.querySelector('.stripe-num').textContent,
                  actual: !!li.querySelector('.actual'),
                  ghost: !!li.querySelector('.ghost') } : null;
  });
  ok(open && open.cls === 'stripe-open', 'it is marked as still open');
  ok(open && /not ticked off/.test(open.num), `and says so (${open && open.num.trim()})`);
  ok(open && !open.actual, 'with no "took" bar, because the clock never stopped');
  ok(open && open.ghost, 'but its plan is still drawn, so the year has a shape');

  console.log('\n── the measurement is unchanged');
  const fin = await pg.evaluate(() => {
    const li = [...document.querySelectorAll('#stripes li')]
      .find(x => /First funded/.test(x.textContent));
    return li ? li.querySelector('.stripe-num').textContent.replace(/\s+/g, ' ').trim() : null;
  });
  ok(/planned \d+d/.test(fin) && /took/.test(fin) && /×/.test(fin),
     `a finished goal still shows planned, actual and the multiple (${fin})`);
  const cal = await pg.textContent('#calib');
  ok(/as long as you plan for/.test(cal), 'and the calibration sentence still reads');
  ok(!/Learn piano/.test(cal), 'without the unticked one being counted into it');

  await pg.screenshot({ path: D + '/past-years.png' });

  console.log('\n── nothing behind you yet');
  await pg.evaluate(() => {
    commit(false, (s) => { s.goals = [
      { id: 'q1', name: 'Something ahead', from: '2099-01-01', to: '2099-06-01',
        done: false, horizon: 'year', kind: 'span', tone: 'muted' }]; });
    renderPast();
  });
  await pg.waitForTimeout(200);
  ok(await pg.$$eval('#stripes .yr', y => y.length) === 0, 'no years are drawn');
  ok(/Nothing behind you yet/.test(await pg.textContent('#calib')),
     'and it says so rather than showing an empty frame');
  ok((await pg.textContent('#pastMeta')).trim() === '', 'the head says nothing at all');

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
