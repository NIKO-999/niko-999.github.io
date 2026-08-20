/* The other life.

   Habits shares the shell with the ledger and nothing else — its own
   key, its own screen, and no reference to the ledger anywhere. What is
   worth checking is the one idea it rests on and the two rules that
   fall out of it:

     CADENCE IS PART OF THE HABIT. A day is DUE or it is not, and every
     figure divides by what was due rather than by five.

     NOTHING IS A REPORT CARD. No denominator, no red, and the words
     count up.

   Plus the collision guard the whole screen depends on: it is wrapped,
   and the wrapper is what stops `due`, `rate`, `chain` and `state` from
   replacing the ledger's own. */
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

  // ── it is reachable, and it is under Arc ───────────────────────
  ok('the rail carries it', await p.locator('[data-view="habits"]').count() === 1);
  ok('directly under Arc', await p.evaluate(() => {
    const rail = [...document.querySelectorAll('.rail > *')];
    return rail.indexOf(document.querySelector('[data-view="habits"]'))
         - rail.indexOf(document.querySelector('.rail a[href="../arc/"]')) === 1;
  }));
  await p.click('[data-view="habits"]');
  await p.waitForTimeout(300);
  ok('and it opens', await p.locator('#habitsSection').isVisible());
  ok('no page errors', errs.length === 0, errs);

  /* ── the wrapper ──
     Everything inside wants a name this file already has. A collision
     does not throw, it REPLACES, and the symptom turns up screens away. */
  ok('only the render escapes the wrapper', await p.evaluate(() =>
    typeof renderHabits === 'function'
    && typeof due === 'undefined' && typeof dueOn === 'undefined'
    && typeof keptOn === 'undefined' && typeof chain === 'undefined'));
  ok('and the ledger still owns its own names', await p.evaluate(() =>
    typeof state === 'object' && Array.isArray(state.events)
    && typeof renderAll === 'function' && typeof totals === 'function'));

  // ── an untouched machine says nothing rather than zero ─────────
  ok('nothing kept yet, not "0 days"', await p.evaluate(() =>
    /nothing kept yet/.test(document.getElementById('hbMeta').textContent)),
    await p.locator('#hbMeta').textContent());
  ok('and looking at it did not write a record', await p.evaluate(() =>
    localStorage.getItem('habits.v1') === null));

  // ── the shape of the screen ────────────────────────────────────
  ok('five habits', await p.locator('.hb-item').count() === 5);
  ok('one ring, and it leads', await p.evaluate(() => {
    const n = document.getElementById('hbNow');
    return n.firstElementChild.classList.contains('hb-dial')
      && n.lastElementChild.classList.contains('hb-list')
      && n.querySelectorAll('.hb-list > .hb-item').length === 5;
  }));
  ok('the ring counts, it does not score', await p.evaluate(() =>
    !/%/.test(document.querySelector('.hb-dial').textContent)));
  ok('seven days in the week', await p.locator('.hb-day').count() === 7);
  ok('two radars', await p.locator('.hb-fig svg').count() === 2);
  /* Side by side means the same box. */
  ok('the radars are one size, top aligned', await p.evaluate(() => {
    const a = document.querySelector('#hbBy svg').getBoundingClientRect();
    const c = document.querySelector('#hbDow svg').getBoundingClientRect();
    return Math.abs(a.width - c.width) < 1 && Math.abs(a.height - c.height) < 1
      && Math.abs(a.top - c.top) < 1;
  }));
  ok('four are a plain tick', await p.locator('.hb-item .hb-act button.tick').count() === 4);
  ok('and the workout is a four-way picker', await p.locator('.hb-split button').count() === 4);

  /* ── one calendar at two scales ──
     The control SWAPS them rather than stacking them: both on screen at
     once answered the same question twice and the month was always the
     thing you scrolled past. */
  ok('the week is up first', await p.locator('#hbStrip').isVisible()
     && await p.locator('#hbMon').isHidden());
  ok('and the arrows say what they move', await p.evaluate(() =>
    /week/i.test(document.getElementById('hbPrev').getAttribute('aria-label'))
    && document.getElementById('hbNow2').textContent === 'This week'));
  await p.click('[data-scale="month"]');
  await p.waitForTimeout(300);
  ok('the month REPLACES the week', await p.locator('#hbMon').isVisible()
     && await p.locator('#hbStrip').isHidden());
  ok('and it is a real month, not a rolling window', await p.evaluate(() => {
    const n = document.querySelectorAll('#hbMon .cell:not(.pad)').length;
    return n === 28 || n === 29 || n === 30 || n === 31;
  }), await p.locator('#hbMon .cell:not(.pad)').count());
  ok('the arrows and the way home follow the scale', await p.evaluate(() =>
    /month/i.test(document.getElementById('hbPrev').getAttribute('aria-label'))
    && document.getElementById('hbNow2').textContent === 'This month'));

  /* ── cadence, which is the whole idea ──
     Ten weeks of a real rotation, written straight into the key. */
  await p.evaluate(() => {
    const iso2 = (d) => d.toISOString().slice(0, 10);
    const days = {};
    let s = 17, lastAbs = -99;
    const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 69; i >= 1; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = iso2(d), rec = { done: {}, split: null };
      rec.done.water = r() < 0.86;
      rec.done.walk = r() < 0.74;
      rec.done.read = r() < 0.55;
      if (i <= lastAbs - 2 || lastAbs === -99) {
        rec.done.abs = r() < 0.7;
        if (rec.done.abs) lastAbs = i;
      }
      if (d.getDay() !== 0 && r() < 0.52) rec.split = ['push', 'pull', 'legs'][Math.floor(r() * 3)];
      else if (r() < 0.5) rec.split = 'rest';
      rec.done.workout = !!rec.split && rec.split !== 'rest';
      days[k] = rec;
    }
    localStorage.setItem('habits.v1', JSON.stringify({ habits: null, days }));
    /* habits:null forces the defaults back, which is also the check that
       a corrupt shape does not take the screen down. */
    localStorage.setItem('habits.v1', JSON.stringify({
      habits: JSON.parse(localStorage.getItem('habits.v1')).habits || undefined, days }));
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="habits"]');
  await p.waitForTimeout(400);
  /* A damaged definitions list must not take a year of days with it —
     the days are what you cannot get back. */
  ok('a bad stored shape falls back rather than breaking', await p.locator('.hb-item').count() === 5);
  ok('and the days survive the repair', await p.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem('habits.v1')).days).length > 50),
    await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('habits.v1')).days).length));
  ok('and the chain reads', await p.evaluate(() =>
    /(\d+ days? unbroken|a chain starts today)/.test(document.getElementById('hbMeta').textContent)),
    await p.locator('#hbMeta').textContent());
  /* Never a zero on the figure the screen leads with — that is the
     report card this whole screen exists to avoid, on the morning you
     most need to open it. */
  ok('and never as a zero', await p.evaluate(() =>
    !/\b0 days?\b/.test(document.getElementById('hbMeta').textContent)),
    await p.locator('#hbMeta').textContent());

  /* The cadence checks read the month, so it has to be the one on
     screen. */
  await p.click('[data-scale="month"]');
  await p.waitForTimeout(300);

  /* ── cadence, measured on the month rather than the week ──
     One week is too small a window: if abs happens to be overdue right
     now it is due on all seven, and a check that reads seven cells
     calls that "cadence is not applied". Twenty-eight days always
     contains days it was due and days it was not. */
  ok('a day nothing was due of is not a day you missed', await p.evaluate(() => {
    const n = [...document.querySelectorAll('#hbMon .hb-mon .cell:not(.pad)')]
      .map(c => c.querySelectorAll('.pips i').length);
    return new Set(n).size > 1;
  }), await p.evaluate(() => [...document.querySelectorAll('#hbMon .hb-mon .cell:not(.pad)')]
      .map(c => c.querySelectorAll('.pips i').length)));
  /* Rolling, not a grid: a fixed grid falls due the day after one was
     done, which rolling can never do. */
  /* An earlier version of this read a field that does not exist, so it
     passed on everything. The month's pips carry the habit id, so the
     question can be asked of what is actually on screen: does an abs
     mark appear on the day after one was kept? Under a fixed grid it
     eventually would; under rolling it never can. */
  ok('abs is never due the day after it was done', await p.evaluate(() => {
    const cells = [...document.querySelectorAll('#hbMon .hb-mon .cell:not(.pad)')];
    const has = cells.map(c => !!c.querySelector('.pips i[data-h="abs"]'));
    const kept = cells.map(c => !!c.querySelector('.pips i[data-h="abs"]:not(.off)'));
    return kept.every((k, i) => !k || i + 1 >= cells.length || !has[i + 1]);
  }), await p.evaluate(() => [...document.querySelectorAll('#hbMon .hb-mon .cell:not(.pad)')]
      .map(c => c.querySelector('.pips i[data-h="abs"]')
        ? (c.querySelector('.pips i[data-h="abs"].off') ? 'due' : 'kept') : '-')));
  ok('and the month names each mark for a reader', await p.evaluate(() =>
    [...document.querySelectorAll('#hbMon .hb-mon .pips i')]
      .every(i => (i.getAttribute('title') || '').length > 2)));

  // ── no report card ─────────────────────────────────────────────
  const txt = await p.locator('#habitsSection').innerText();
  const dens = (txt.match(/\b[\d.]+\s*\w{0,6}\s*(of|\/)\s*(your\s*)?[\d.]+\b/gi) || [])
    .filter(x => !/of the/i.test(x));
  ok('no denominator anywhere on the screen', dens.length === 0, dens);
  ok('and nothing on it is red', await p.evaluate(() => {
    const bad = [];
    const cs = getComputedStyle(document.documentElement);
    /* The four split colours are deliberate. Read them off the tokens
       rather than hardcoding, so a palette change cannot quietly widen
       the exemption. */
    const allow = ['push', 'pull', 'legs', 'rest']
      .map(x => cs.getPropertyValue('--sp-' + x).trim().toLowerCase());
    const hex = (c) => {
      const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? '#' + [1, 2, 3].map(i => (+m[i]).toString(16).padStart(2, '0')).join('') : '';
    };
    document.querySelectorAll('#habitsSection *').forEach((el) => {
      for (const c of [getComputedStyle(el).backgroundColor, getComputedStyle(el).color,
                       getComputedStyle(el).stroke]) {
        const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
        if (!m) continue;
        if (m[4] !== undefined && +m[4] < 0.06) continue;
        if (allow.includes(hex(c))) continue;
        const [r, g, bl] = [+m[1], +m[2], +m[3]];
        if (r > g + 20 && r > bl + 20) bad.push(el.className + ' ' + c);
      }
    });
    return bad;
  }).then(x => x.length === 0));

  /* ── the split ──
     Distinct from every accent by HUE at the app's own muted level, not
     by shouting. Measured in Lab, because a saturation floor is a rule
     that only ever produces loud colours. */
  const dE = await p.evaluate(() => {
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
    const px = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const cs = getComputedStyle(document.documentElement);
    const mine = ['push', 'pull', 'legs'].map(x => px(cs.getPropertyValue('--sp-' + x).trim()));
    const ACC = ['#9fb4be','#365e70','#d0ac9f','#98c7cd','#b0b7bf','#afbfca','#8fa7d6','#c7beb2',
                 '#a99fd0','#a5caab','#703e2c','#225257','#414c5a','#374e5e','#2a4884','#564937',
                 '#41327b','#295431'].map(px);
    const sat = (c) => { const [r, g, b] = c.map(x => x / 255);
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
      return mx === mn ? 0 : (mx - mn) / (l > .5 ? 2 - mx - mn : mx + mn); };
    return {
      nearest: Math.min(...mine.flatMap(c => ACC.map(a => de(c, a)))),
      apart: Math.min(de(mine[0], mine[1]), de(mine[0], mine[2]), de(mine[1], mine[2])),
      sat: mine.map(c => +sat(c).toFixed(2)),
      rest: +sat(px(cs.getPropertyValue('--sp-rest').trim())).toFixed(2),
    };
  });
  ok('no split colour can be mistaken for any accent', dE.nearest > 12, dE);
  ok('the three are clearly apart from one another', dE.apart > 25, dE);
  ok('and they are muted rather than loud', dE.sat.every(x => x < 0.55), dE.sat);
  ok('rest is barely a colour at all', dE.rest < 0.12, dE.rest);

  /* The words live in the picker and nowhere else. */
  ok('nothing on the screen names a split', await p.evaluate(() =>
    !/push|pull|legs/i.test(document.getElementById('habitsSection').innerText)),
    await p.evaluate(() => (document.getElementById('habitsSection').innerText
      .match(/.{0,20}(push|pull|legs).{0,20}/i) || ['(none)'])[0]));
  ok('and the picker carries them for a reader', await p.evaluate(() =>
    [...document.querySelectorAll('.hb-split button')]
      .map(x => x.getAttribute('aria-label')).join() === 'Push,Pull,Legs,Rest'));

  // ── it records, and the recording sticks ───────────────────────
  await p.click('[data-tick="water"]');
  await p.waitForTimeout(250);
  ok('ticking marks it done', /done today/.test(await p.locator('.hb-item').first().innerText()),
     await p.locator('.hb-item').first().innerText());
  const ring = await p.evaluate(() => document.querySelector('.hb-dial .mid').textContent);
  await p.click('[data-split="legs"]');
  await p.waitForTimeout(250);
  ok('the split logs', await p.evaluate(() =>
    document.querySelector('[data-split="legs"]').getAttribute('aria-pressed') === 'true'));
  ok('and the row still just says worked out', await p.evaluate(() =>
    /worked out/.test([...document.querySelectorAll('.hb-item')].pop().innerText)),
    await p.evaluate(() => [...document.querySelectorAll('.hb-item')].pop().innerText.replace(/\n/g, ' | ')));
  ok('the ring counts it', await p.evaluate((was) =>
    +document.querySelector('.hb-dial .mid').textContent === +was + 1, ring));
  /* Rest is a day you chose not to train and must not count toward the
     week, or the number lies in the flattering direction. */
  await p.click('[data-split="rest"]');
  await p.waitForTimeout(250);
  ok('a rest day is not a workout', await p.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('habits.v1'));
    const k = new Date(); k.setMinutes(k.getMinutes() - k.getTimezoneOffset());
    const d = st.days[k.toISOString().slice(0, 10)];
    return d.split === 'rest' && d.done.workout === false;
  }));
  await p.click('[data-split="rest"]');
  await p.waitForTimeout(200);
  ok('pressing it again clears it', await p.evaluate(() =>
    document.querySelector('[data-split="rest"]').getAttribute('aria-pressed') === 'false'));

  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="habits"]');
  await p.waitForTimeout(350);
  ok('and it all survives a reload', /done today/.test(await p.locator('.hb-item').first().innerText()));
  ok('and the chosen scale too', await p.locator('#hbMon').isVisible());

  // ── one pair of arrows, moving whichever scale is up ───────────
  await p.click('[data-scale="week"]');
  await p.waitForTimeout(250);
  const label = await p.locator('#hbCalLabel').textContent();
  await p.click('#hbPrev');
  await p.waitForTimeout(250);
  ok('the week goes back', (await p.locator('#hbCalLabel').textContent()) !== label);
  /* Swapping scale lands on the period containing the one you were
     looking at, not on today — you were looking at last week for a
     reason. */
  await p.click('[data-scale="month"]');
  await p.waitForTimeout(300);
  const back = await p.locator('#hbCalLabel').textContent();
  await p.click('#hbPrev');
  await p.waitForTimeout(250);
  ok('and the month moves by a month', await p.evaluate((was) =>
    document.getElementById('hbCalLabel').textContent !== was, back));
  await p.click('#hbNow2');
  await p.waitForTimeout(250);
  ok('This month comes home', await p.evaluate(() =>
    document.getElementById('hbCalLabel').textContent
      === new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })),
    await p.locator('#hbCalLabel').textContent());
  await p.click('[data-scale="week"]');
  await p.waitForTimeout(250);
  ok('and the scale is remembered', await p.evaluate(() =>
    localStorage.getItem('habits.scale.v1') === 'week'));

  /* ── reminders ──
     A habit is a shape you are keeping; a reminder is one thing on one
     date that stops existing once it has happened. */
  ok('it says so when there are none', await p.locator('.hr-empty').count() === 1);
  await p.fill('#hrText', 'Renew the gym membership');
  await p.fill('#hrDate', '2099-01-01');
  await p.click('#hrAdd button[type="submit"]');
  await p.waitForTimeout(250);
  ok('a reminder can be added', await p.locator('.hr-row').count() === 1);
  ok('with a date, read as a distance', await p.evaluate(() =>
    /in \d+ days/.test(document.querySelector('.hr-when').textContent)),
    await p.locator('.hr-when').textContent());
  ok('and the form clears itself', await p.evaluate(() =>
    document.getElementById('hrText').value === '' && document.getElementById('hrDate').value === ''));
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
  /* Overdue is STATED, not shouted — the same decision the rest of the
     screen makes about a day you missed. */
  ok('overdue is not red', await p.evaluate(() => {
    const c = getComputedStyle(document.querySelector('.hr-row[data-late] .hr-when')).color;
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    return !(r > g + 20 && r > b + 20);
  }), await p.evaluate(() =>
    getComputedStyle(document.querySelector('.hr-row[data-late] .hr-when')).color));
  ok('the count says how many and how many are late', await p.evaluate(() =>
    /3 open · 1 past due/.test(document.getElementById('hrMeta').textContent)),
    await p.locator('#hrMeta').textContent());

  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="habits"]');
  await p.waitForTimeout(350);
  ok('reminders survive a reload', await p.locator('.hr-row').count() === 3);
  /* The one place in this app where delete is final and has no bin. A
     bin protects a record you cannot rebuild, and a reminder you have
     dealt with is not a record of anything. */
  await p.click('.hr-row .hr-x');
  await p.waitForTimeout(250);
  ok('and one can be deleted', await p.locator('.hr-row').count() === 2);
  ok('deleting the right one', await p.evaluate(() =>
    !document.getElementById('hrList').innerText.includes('Call the bank')));
  ok('and the deletion sticks', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('habits.v1')).reminders.length === 2));
  /* Reminders are not habits and must not touch anything the habits
     screen counts. */
  ok('none of it reached the habits', await p.evaluate(() =>
    document.querySelectorAll('.hb-item').length === 5
    && !/remember|gym|bank/i.test(document.getElementById('hbNow').innerText)));

  // ── it never touches the ledger ────────────────────────────────
  ok('the ledger is untouched by any of it', await p.evaluate(() =>
    localStorage.getItem('ledger.v1') === null));
  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
