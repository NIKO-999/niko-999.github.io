/* Entering a trade should put the calendar in front of you, and the
   sheet should take a dropped chart anywhere on it — not only on the
   128px box you have to aim at while holding a file. */
const { chrome, BASE } = require('./lib');

/* The gate does not open without a check-in. Do what a person would. */
async function checkIn(pg) {
  await pg.evaluate(() => {
    ckX = 0.3; ckY = 0.7; ckPlaced = true;
    document.getElementById('ckSave').click();
  });
  await pg.waitForTimeout(200);
}
const { chromium } = require('playwright-core');
const U = `${BASE}/trading/`;
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const pg = await br.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));

  await pg.goto(U, { waitUntil: 'networkidle' });

  /* ── I'm in ─────────────────────────────────────────────────────── */
  console.log('\n── entering a trade');

  /* Park the calendar on a different month first, so landing on the
     current one is a real assertion and not the initial state. */
  await pg.evaluate(() => { cursor = new Date(2024, 1, 1); renderCalendar(); });
  await pg.evaluate(() => goto('metrics'));

  ok(await pg.isHidden('#calendarSection'), 'the calendar starts hidden');

  await checkIn(pg);
  await pg.click('#gIn');

  ok(await pg.isVisible('#calendarSection'), 'clicking I’m in shows the calendar');
  const label = await pg.textContent('#monthLabel');
  const wantMonth = await pg.evaluate(() => {
    const M = ['January','February','March','April','May','June','July',
               'August','September','October','November','December'];
    const n = new Date();
    return `${M[n.getMonth()]} ${n.getFullYear()}`;
  });
  ok(label === wantMonth, `it opens on this month (${label})`);

  ok(await pg.locator('#grid .day.today').count() === 1, 'today has a cell on it');
  ok(await pg.locator('#grid .day.today .day-new').isVisible(),
     'and today’s way into the journal is on screen');

  const cur = await pg.getAttribute('[data-view="calendar"]', 'aria-current');
  ok(cur === 'page', 'the rail marks the calendar as where you are');

  const said = await pg.textContent('#say');
  ok(/Close it when it is done/.test(said),
     'the live region still says what you are in, not just "calendar"');

  /* The position has to survive the move — the strip lives outside every
     section precisely so it does. */
  ok(await pg.isVisible('#live'), 'the open position is still on screen');
  ok(await pg.isVisible('#liveClose'), 'and Close it is still one click away');

  /* ── dropping a chart ───────────────────────────────────────────── */
  console.log('\n── dropping a chart while journaling');

  await pg.evaluate(() => openTrade(iso(new Date())));
  ok(await pg.isVisible('#sheet'), 'the trade sheet is open');
  ok(!(await pg.evaluate(() => shotBtn.classList.contains('has'))),
     'with no chart on it yet');

  /* Mid-drag a browser hands over the types and nothing else, so that is
     all the cue is allowed to read. */
  await pg.evaluate(() => {
    const dt = new DataTransfer();
    dt.items.add('x', 'text/plain');
    document.getElementById('tNote')
      .dispatchEvent(new DragEvent('dragenter', { dataTransfer: dt, bubbles: true, cancelable: true }));
  });
  ok(!(await pg.evaluate(() => sheet.classList.contains('dropping'))),
     'dragging text over it lights nothing');

  const cue = async (type, target) => pg.evaluate(([type, target]) => {
    const dt = new DataTransfer();
    dt.items.add(new File([new Uint8Array([1, 2, 3])], 'c.png', { type: 'image/png' }));
    document.querySelector(target)
      .dispatchEvent(new DragEvent(type, { dataTransfer: dt, bubbles: true, cancelable: true }));
  }, [type, target]);

  await cue('dragenter', '#tNote');
  ok(await pg.evaluate(() => sheet.classList.contains('dropping')),
     'dragging a file over the NOTES box lights the whole sheet');
  ok(await pg.evaluate(() => shotBtn.classList.contains('dropping')),
     'and the chart slot, which is where it is going to land');

  /* Crossing from one child to the next must not blink the cue off. */
  await cue('dragenter', '#tSetup');
  await cue('dragleave', '#tNote');
  ok(await pg.evaluate(() => sheet.classList.contains('dropping')),
     'crossing between fields keeps it lit');

  await cue('dragleave', '#tSetup');
  ok(!(await pg.evaluate(() => sheet.classList.contains('dropping'))),
     'leaving the sheet turns it off');

  /* A real image, so compress() has something to decode. */
  const drop = await pg.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 240; c.height = 120;
    const g = c.getContext('2d');
    g.fillStyle = '#123'; g.fillRect(0, 0, 240, 120);
    g.fillStyle = '#4fa'; g.fillRect(20, 20, 60, 80);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'chart.png', { type: 'image/png' }));
    document.getElementById('tNote')
      .dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
    return true;
  });
  await pg.waitForFunction(() => shotBtn.classList.contains('has'), null, { timeout: 4000 })
    .then(() => ok(true, 'a chart dropped on the notes box lands in the chart slot'))
    .catch(() => ok(false, 'a chart dropped on the notes box lands in the chart slot'));

  ok(!(await pg.evaluate(() => sheet.classList.contains('dropping'))),
     'and the cue clears once it has landed');
  ok(await pg.evaluate(() => !!shotBlob && shotBlob.size > 0), 'the blob is real');
  ok(await pg.evaluate(() => shotDirty === true), 'and is marked to be saved');

  /* Dropping straight on the slot still works — it is inside the sheet,
     so it is the same listener, but it is the aim people will try. */
  await pg.evaluate(() => setShot(null));
  await pg.evaluate(async () => {
    const c = document.createElement('canvas');
    c.width = 80; c.height = 40;
    c.getContext('2d').fillRect(0, 0, 80, 40);
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'c.png', { type: 'image/png' }));
    shotBtn.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
  });
  await pg.waitForFunction(() => shotBtn.classList.contains('has'), null, { timeout: 4000 })
    .then(() => ok(true, 'dropping on the slot itself still works'))
    .catch(() => ok(false, 'dropping on the slot itself still works'));

  /* One file, one picture — the old handler on the button plus a new one
     on the sheet would have taken the same drop twice. */
  const calls = await pg.evaluate(async () => {
    let n = 0;
    const real = window.takeShot;
    const c = document.createElement('canvas');
    c.width = 40; c.height = 20;
    const blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'c.png', { type: 'image/png' }));
    const count = () => { n++; };
    document.addEventListener('drop', count, true);
    shotBtn.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
    document.removeEventListener('drop', count, true);
    return n;
  });
  ok(calls === 1, 'a drop on the slot is one event, not two');

  /* Saving it has to actually keep it. */
  await pg.fill('#tAmt', '120');
  await pg.click('#tradeSave');
  await pg.waitForFunction(() => !document.getElementById('sheet').open, null, { timeout: 4000 });
  const kept = await pg.evaluate(async () => {
    const e = state.events.filter(x => x.k).slice(-1)[0];
    if (!e || !e.shot) return false;
    const b = await SHOTS.get(e.id);
    return !!b && b.size > 0;
  });
  ok(kept, 'and the dropped chart is on the saved trade');

  console.log('\n' + (errs.length ? '  page errors: ' + errs.join(' | ') : '  ✓ no page errors'));
  if (errs.length) fail++;
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  await br.close();
  process.exit(fail ? 1 : 0);
})();
