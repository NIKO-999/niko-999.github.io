/* Reminders.

   Not habits, and no longer sharing their screen. A habit is a shape
   you are keeping; a reminder is one thing on one date that stops
   existing once it has happened. Different lifetimes, so a different
   key and a different screen.

   THE ONE PLACE DELETE IS FINAL. Everything else in this app removes
   through a bin, because a bin protects a record you cannot rebuild. A
   reminder you have dealt with is not a record of anything — so the
   check here is that the deletion sticks, not that it can be undone. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ok  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
};

(async () => {
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1512, height: 950 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);

  ok('the rail carries it', await p.locator('[data-view="reminders"]').count() === 1);
  ok('right after habits', await p.evaluate(() => {
    const rail = [...document.querySelectorAll('.rail > *')];
    return rail.indexOf(document.querySelector('[data-view="reminders"]'))
         - rail.indexOf(document.querySelector('[data-view="habits"]')) === 1;
  }));
  await p.click('[data-view="reminders"]');
  await p.waitForTimeout(300);
  ok('and it opens on its own screen', await p.locator('#remindersSection').isVisible());
  ok('with habits shut behind it', await p.locator('#habitsSection').isHidden());
  ok('no page errors', errs.length === 0, errs);

  /* Wrapped, like the habits screen: rows, write and render are all
     names this file already uses. */
  ok('only the render escapes the wrapper', await p.evaluate(() =>
    typeof renderReminders === 'function' && typeof paint === 'undefined'));

  ok('it says so when there are none', await p.locator('.hr-empty').count() === 1);
  ok('and the count says nothing rather than zero', await p.evaluate(() =>
    document.getElementById('hrMeta').textContent === ''));

  await p.fill('#hrText', 'Renew the gym membership');
  await p.fill('#hrDate', '2099-01-01');
  await p.click('#hrAdd button[type="submit"]');
  await p.waitForTimeout(250);
  ok('one can be added', await p.locator('.hr-row').count() === 1);
  /* A distance, not a date. You know what today is. */
  ok('the date reads as a distance', await p.evaluate(() =>
    /in \d+ days/.test(document.querySelector('.hr-when').textContent)),
    await p.locator('.hr-when').textContent());
  ok('the form clears itself', await p.evaluate(() =>
    document.getElementById('hrText').value === ''
    && document.getElementById('hrDate').value === ''));
  ok('an empty one is refused', await p.evaluate(() => {
    document.getElementById('hrAdd').requestSubmit();
    return document.querySelectorAll('.hr-row').length === 1;
  }));

  /* The date is optional, and an undated one sorts LAST — it is not
     urgent by definition, and sorting it among the dated ones would
     make it look as though it were. */
  await p.fill('#hrText', 'Find that book');
  await p.click('#hrAdd button[type="submit"]');
  await p.waitForTimeout(200);
  await p.fill('#hrText', 'Call the bank');
  await p.fill('#hrDate', '2020-01-01');
  await p.click('#hrAdd button[type="submit"]');
  await p.waitForTimeout(250);
  ok('the undated one sits at the bottom', await p.evaluate(() =>
    [...document.querySelectorAll('.hr-when')].map(x => x.textContent).pop() === 'no date'),
    await p.evaluate(() => [...document.querySelectorAll('.hr-when')].map(x => x.textContent)));
  ok('and the overdue one leads', await p.evaluate(() =>
    document.querySelector('.hr-row').hasAttribute('data-late')));
  /* Overdue is STATED, not shouted — the same decision the habits
     screen makes about a day you missed. */
  ok('overdue is not red', await p.evaluate(() => {
    const c = getComputedStyle(document.querySelector('.hr-row[data-late] .hr-when')).color;
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const [r, g, bl] = [+m[1], +m[2], +m[3]];
    return !(r > g + 20 && r > bl + 20);
  }), await p.evaluate(() =>
    getComputedStyle(document.querySelector('.hr-row[data-late] .hr-when')).color));
  ok('nothing on the screen is red at all', await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#remindersSection *').forEach((el) => {
      for (const c of [getComputedStyle(el).color, getComputedStyle(el).backgroundColor]) {
        const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
        if (!m) continue;
        if (m[4] !== undefined && +m[4] < 0.06) continue;
        const [r, g, bl] = [+m[1], +m[2], +m[3]];
        if (r > g + 20 && r > bl + 20) bad.push(el.className + ' ' + c);
      }
    });
    return bad;
  }).then(x => x.length === 0));
  ok('the count says how many and how many are late', await p.evaluate(() =>
    /3 open · 1 past due/.test(document.getElementById('hrMeta').textContent)),
    await p.locator('#hrMeta').textContent());

  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="reminders"]');
  await p.waitForTimeout(350);
  ok('they survive a reload', await p.locator('.hr-row').count() === 3);
  ok('under their own key', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('reminders.v1')).length === 3));

  await p.click('.hr-row .hr-x');
  await p.waitForTimeout(250);
  ok('one can be deleted', await p.locator('.hr-row').count() === 2);
  ok('the right one', await p.evaluate(() =>
    !document.getElementById('hrList').innerText.includes('Call the bank')));
  ok('and the deletion sticks — there is no bin here', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('reminders.v1')).length === 2));

  /* Reminders shipped inside habits.v1 for a day before they got a
     screen. Anything written in that day is carried across rather than
     stranded — a key changing shape is not the user's problem. */
  await p.evaluate(() => {
    localStorage.removeItem('reminders.v1');
    localStorage.setItem('habits.v1', JSON.stringify({
      habits: null, days: {},
      reminders: [{ id: 'old1', text: 'Written before the move', due: '' }],
    }));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="reminders"]');
  await p.waitForTimeout(350);
  ok('anything written before the move is carried across', await p.evaluate(() =>
    document.getElementById('hrList').innerText.includes('Written before the move')));
  ok('into the new key', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('reminders.v1')).length === 1));
  ok('and out of the old one', await p.evaluate(() =>
    !('reminders' in JSON.parse(localStorage.getItem('habits.v1')))));

  ok('the ledger is untouched by any of it', await p.evaluate(() =>
    localStorage.getItem('ledger.v1') === null));
  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
