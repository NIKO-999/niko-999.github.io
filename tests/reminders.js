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
  /* A torn calendar page: one object carrying the date and the urgency
     together, rather than a colour somewhere and a date somewhere
     else. */
  ok('it gets a date chip', await p.evaluate(() => {
    const c = document.querySelector('.hr-chip');
    return c && /^[A-Z][a-z]{2}$/.test(c.querySelector('s').textContent)
      && /^\d{1,2}$/.test(c.querySelector('b').textContent);
  }), await p.evaluate(() => document.querySelector('.hr-chip')
      ? document.querySelector('.hr-chip').innerText.replace(/\n/g, ' ') : null));
  ok('and it lands under a heading', await p.locator('.hr-grp').count() === 1);
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
  /* Grouped: overdue, this week, later, someday. A flat list of four is
     fine and a flat list of twenty is a wall. */
  ok('the list is grouped', await p.evaluate(() =>
    [...document.querySelectorAll('.hr-grp b')].map(x => x.textContent).join()
      === 'Overdue,Later,Someday'),
    await p.evaluate(() => [...document.querySelectorAll('.hr-grp b')].map(x => x.textContent)));
  ok('an empty heading is never printed', await p.evaluate(() =>
    ![...document.querySelectorAll('.hr-grp em')].some(x => x.textContent === '0')));
  ok('overdue leads', await p.evaluate(() =>
    document.querySelector('.hr-row').hasAttribute('data-late')));
  /* An undated one is not urgent by definition, so it waits under
     Someday rather than being sorted in among the dated ones. */
  ok('and the undated one waits under Someday', await p.evaluate(() => {
    const g = [...document.querySelectorAll('.hr-grp')].pop();
    return g.querySelector('b').textContent === 'Someday'
      && g.nextElementSibling.innerText.includes('Find that book');
  }));

  /* ── the one screen that spends colour ──
     It came off the habits and the check-in because a losing day is a
     judgement about you. A reminder is a task with a date, and the date
     is a fact — so colour is allowed, but only for URGENCY. */
  /* BOTH THEMES. The first version of this ran on whichever scheme the
     browser happened to open with, and the one colour that was too loud
     was too loud only in the LIGHT theme — it was caught by luck. A
     token check that runs in one theme is half a check. */
  const measure = () => {
    const px = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const lab = (c) => {
      let [r, g, b] = c.map(x => x / 255);
      const f = (v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      [r, g, b] = [f(r), f(g), f(b)];
      const x = (r * .4124 + g * .3576 + b * .1805) / .95047,
            y = r * .2126 + g * .7152 + b * .0722,
            z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
      const q = (t) => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
      return [116 * q(y) - 16, 500 * (q(x) - q(y)), 200 * (q(y) - q(z))];
    };
    const de = (a, c) => Math.hypot(...lab(a).map((v, i) => v - lab(c)[i]));
    const cs = getComputedStyle(document.documentElement);
    const mine = ['late', 'soon', 'clear'].map(x => px(cs.getPropertyValue('--u-' + x).trim()));
    const ACC = ['#9fb4be','#365e70','#d0ac9f','#98c7cd','#b0b7bf','#afbfca','#8fa7d6','#c7beb2',
                 '#a99fd0','#a5caab','#703e2c','#225257','#414c5a','#374e5e','#2a4884','#564937',
                 '#41327b','#295431'].map(px);
    const sat = (c) => { const [r, g, b] = c.map(x => x / 255);
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
      return mx === mn ? 0 : (mx - mn) / (l > .5 ? 2 - mx - mn : mx + mn); };
    return {
      theme: document.documentElement.dataset.resolved,
      nearest: Math.min(...mine.flatMap(c => ACC.map(a => de(c, a)))),
      apart: Math.min(de(mine[0], mine[1]), de(mine[0], mine[2]), de(mine[1], mine[2])),
      sat: mine.map(c => +sat(c).toFixed(2)),
    };
  };
  const both = [];
  for (const scheme of ['light', 'dark']) {
    const q = await b.newPage({ colorScheme: scheme, viewport: { width: 1200, height: 800 } });
    await q.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
    both.push(await q.evaluate(`(${measure.toString()})()`));
    await q.close();
  }
  ok('the urgency colours cannot be mistaken for an accent, in either theme',
     both.every(h => h.nearest > 12), both);
  ok('the three states are clearly apart, in either theme',
     both.every(h => h.apart > 25), both);
  ok('and they are muted rather than loud, in either theme',
     both.every(h => h.sat.every(x => x < 0.55)), both);
  ok('and the two themes really were different pages',
     both[0].theme !== both[1].theme, both.map(h => h.theme));

  /* ── the ink ON the bands ──
     `color: var(--bg)` was the first attempt and shell.css has no --bg.
     An invalid custom property does not fall back to the previous
     declaration, it makes the whole declaration invalid at
     computed-value time — so the month inherited --ink and ran at
     1.74:1 in the light theme. A wrong colour rather than a missing
     one, which is exactly why looking at it did not find it. */
  const ratios = [];
  for (const scheme of ['light', 'dark']) {
    const q = await b.newPage({ colorScheme: scheme, viewport: { width: 1200, height: 800 } });
    await q.goto(`${BASE}/trading/`, { waitUntil: 'networkidle' });
    await q.evaluate(() => {
      const j = (d) => { const x = new Date(); x.setDate(x.getDate() + d);
        x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
        return x.toISOString().slice(0, 10); };
      localStorage.setItem('reminders.v1', JSON.stringify([
        { id: 'a', text: 'late', due: j(-2) }, { id: 'b', text: 'soon', due: j(1) },
        { id: 'c', text: 'clear', due: j(9) }, { id: 'd', text: 'none', due: '' }]));
    });
    await q.reload({ waitUntil: 'networkidle' });
    await q.evaluate(() => goto('reminders'));
    await q.waitForTimeout(300);
    ratios.push(...await q.evaluate(() => {
      const px = (c) => (String(c).match(/\d+/g) || []).slice(0, 3).map(Number);
      const rel = (c) => { const f = (v) => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
        const [r, g, b2] = c.map(x => f(x / 255)); return .2126 * r + .7152 * g + .0722 * b2; };
      return [...document.querySelectorAll('.hr-chip s')].map((el) => {
        const st = getComputedStyle(el);
        const la = rel(px(st.color)), lb = rel(px(st.backgroundColor));
        return +((Math.max(la, lb) + .05) / (Math.min(la, lb) + .05)).toFixed(2);
      });
    }));
    await q.close();
  }
  /* Small uppercase mono at .46rem. 4.5 is the floor for text this
     size, and every band in both themes has to clear it. */
  ok('the month on every band is readable, in both themes',
     ratios.length === 8 && ratios.every(r => r >= 4.5), ratios);
  /* Only one loud row. Colour is earned by urgency and never appears on
     a reminder that is merely not done yet. */
  ok('only the overdue one carries the late colour', await p.evaluate(() => {
    const late = [...document.querySelectorAll('.hr-row')]
      .filter(r => r.dataset.u === 'late');
    return late.length === 1 && late[0].hasAttribute('data-late');
  }), await p.evaluate(() => [...document.querySelectorAll('.hr-row')].map(r => r.dataset.u)));
  ok('an undated one carries no colour at all', await p.evaluate(() => {
    const c = [...document.querySelectorAll('.hr-row')].find(r => r.dataset.u === 'none');
    const band = getComputedStyle(c.querySelector('.hr-chip s')).backgroundColor;
    const m = band.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    return Math.max(r, g, b) - Math.min(r, g, b) < 26;    // grey
  }), await p.evaluate(() => {
    const c = [...document.querySelectorAll('.hr-row')].find(r => r.dataset.u === 'none');
    return getComputedStyle(c.querySelector('.hr-chip s')).backgroundColor;
  }));
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

  /* ── the topbar on this screen ──
     The search field filters the calendar, the agenda, the ledger and
     the log — every trade view and nothing else. On Reminders it is
     inert, so at full width it is the widest thing on the bar doing the
     least. */
  await p.evaluate(() => goto('metrics'));
  await p.waitForTimeout(200);
  const wide = await p.evaluate(() =>
    document.querySelector('.topbar .search').getBoundingClientRect().width);
  await p.evaluate(() => goto('reminders'));
  await p.waitForTimeout(400);
  const narrow = await p.evaluate(() =>
    document.querySelector('.topbar .search').getBoundingClientRect().width);
  ok('the search collapses to its icon here', narrow < 45 && wide > 200, [wide, narrow]);
  ok('and its icon survives the collapse', await p.evaluate(() =>
    document.querySelector('.topbar .search svg').getBoundingClientRect().width > 10));
  /* It still opens. A control that refuses to is worse than one that is
     merely narrow. */
  await p.click('.topbar .search');
  await p.waitForTimeout(400);
  ok('clicking it opens it again', await p.evaluate(() =>
    document.querySelector('.topbar .search').getBoundingClientRect().width > 200));
  ok('and focus lands in the field', await p.evaluate(() =>
    document.activeElement === document.getElementById('q')));
  /* Leaving puts it back rather than remembering it shut — it is only
     collapsed because it is useless HERE. */
  await p.evaluate(() => goto('log'));
  await p.waitForTimeout(400);
  ok('leaving the screen gives the field back', await p.evaluate(() =>
    document.querySelector('.topbar .search').getBoundingClientRect().width > 200));
  ok('and nothing collapses on any other view', await p.evaluate(() => {
    for (const v of ['metrics', 'calendar', 'log', 'habits', 'state', 'backtest']) {
      goto(v);
      if (document.querySelector('.topbar .search').getBoundingClientRect().width < 100) return v;
    }
    goto('reminders');
    return null;
  }).then(x => x === null));

  ok('the ledger is untouched by any of it', await p.evaluate(() =>
    localStorage.getItem('ledger.v1') === null));
  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
