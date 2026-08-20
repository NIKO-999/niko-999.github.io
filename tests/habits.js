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
  await p.goto(`${BASE}/days/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);

  // ── it is its own app now, and it leads ────────────────────────
  ok('the rail carries it', await p.locator('[data-view="habits"]').count() === 1);
  ok('and it is the first view', await p.evaluate(() => {
    const views = [...document.querySelectorAll('.rail [data-view]')];
    return views[0].dataset.view === 'habits';
  }));
  ok('the ledger is a link out, not a view', await p.evaluate(() =>
    !!document.querySelector('.rail a[href="../trading/"]')
    && document.querySelector('[data-view="metrics"]') === null));
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
  /* The ledger's names are not merely un-clobbered here, they are
     ABSENT — this page has no ledger in it to collide with. The
     wrapper stays anyway: renderReminders shares this file. */
  ok('and the ledger is not on this page at all', await p.evaluate(() =>
    typeof state === 'undefined' && typeof renderAll === 'undefined'
    && typeof totals === 'undefined' && typeof events === 'undefined'));

  // ── an untouched machine says nothing rather than zero ─────────
  ok('nothing kept yet, not "0 days"', await p.evaluate(() =>
    /nothing kept yet/.test(document.getElementById('hbMeta').textContent)),
    await p.locator('#hbMeta').textContent());
  ok('and looking at it did not write a record', await p.evaluate(() =>
    localStorage.getItem('habits.v1') === null));

  // ── the shape of the screen ────────────────────────────────────
  ok('six habits', await p.locator('.hb-item').count() === 6);
  ok('one ring, and it leads', await p.evaluate(() => {
    const n = document.getElementById('hbNow');
    return n.firstElementChild.classList.contains('hb-dial')
      && n.lastElementChild.classList.contains('hb-list')
      && n.querySelectorAll('.hb-list > .hb-item').length === 6;
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
  /* All six rows are one tick. The workout used to wear four permanent
     colour dots, which made one row of six the loudest thing in the
     list for a question nobody had asked yet. */
  ok('every row is a plain tick', await p.locator('.hb-item .hb-act button.tick').count() === 6);
  ok('and no colours until you ask for them',
     await p.locator('.hb-split button').count() === 0);
  await p.click('[data-pick]');
  await p.waitForTimeout(200);
  ok('pressing the workout tick opens four', await p.locator('.hb-split button').count() === 4);
  ok('and it says what it is asking', /which was it/i.test(
     await p.locator('.hb-item[data-h="workout"] .hb-say').innerText()));
  /* Opened by mistake is not an answer. */
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  ok('escape shuts it without answering', await p.locator('.hb-split button').count() === 0
     && await p.evaluate(() => !JSON.parse(localStorage.getItem('habits.v1') || '{"days":{}}')
       .days[Object.keys(JSON.parse(localStorage.getItem('habits.v1') || '{"days":{}}').days)[0]]?.split));
  await p.click('[data-pick]');
  await p.waitForTimeout(200);

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
  ok('a bad stored shape falls back rather than breaking', await p.locator('.hb-item').count() === 6);
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
  /* BOTH SCALES. This used to scan whatever happened to be on screen,
     which at this point in the file is the month — so the week strip
     was empty and its marks were never looked at. Painting the week's
     missed pips red passed this check cleanly. Anything drawn by
     either renderer has to be visited, so the scan drives the switch
     itself and puts it back. */
  ok('and nothing on it is red', await p.evaluate(async () => {
    const bad = [];
    const was = document.querySelector('#hbScale [aria-pressed="true"]').dataset.scale;
    const scan = [];
    const cs = getComputedStyle(document.documentElement);
    /* The four split colours are deliberate. Read them off the tokens
       rather than hardcoding, so a palette change cannot quietly widen
       the exemption. */
    /* The four split colours and the six habit colours are deliberate:
       they say WHICH thing, never whether you kept it. Read off the
       tokens rather than hardcoded, so a palette change cannot quietly
       widen the exemption — and everything else on the screen is still
       forbidden from being red, which is what this check is for. */
    const allow = [
      ...['push', 'pull', 'legs', 'rest'].map(x => cs.getPropertyValue('--sp-' + x)),
      ...['wake', 'workout', 'abs', 'walk', 'water', 'read'].map(x => cs.getPropertyValue('--h-' + x)),
    ].map(x => x.trim().toLowerCase());
    const hex = (c) => {
      const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? '#' + [1, 2, 3].map(i => (+m[i]).toString(16).padStart(2, '0')).join('') : '';
    };
    for (const sc of ['week', 'month']) {
      document.querySelector(`#hbScale [data-scale="${sc}"]`).click();
      await new Promise((r) => setTimeout(r, 120));
      scan.push(sc);
      document.querySelectorAll('#habitsSection *').forEach((el) => {
        for (const c of [getComputedStyle(el).backgroundColor, getComputedStyle(el).color,
                         getComputedStyle(el).stroke]) {
          const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
          if (!m) continue;
          if (m[4] !== undefined && +m[4] < 0.06) continue;
          if (allow.includes(hex(c))) continue;
          const [r, g, bl] = [+m[1], +m[2], +m[3]];
          if (r > g + 20 && r > bl + 20) bad.push(sc + ': ' + el.className + ' ' + c);
        }
      });
    }
    document.querySelector(`#hbScale [data-scale="${was}"]`).click();
    await new Promise((r) => setTimeout(r, 120));
    return { bad, scan };
  }).then((x) => x.scan.length === 2 && x.bad.length === 0));

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

  /* The row names it; the CALENDAR never does. That is the whole point
     of having a colour — you are tracking the split, not carrying it
     around a month's worth of cells. */
  ok('neither the week nor the month names a split', await p.evaluate(() =>
    !/push|pull|legs/i.test(document.getElementById('hbStrip').innerText
      + document.getElementById('hbMon').innerText)));
  await p.click('[data-pick]');
  await p.waitForTimeout(200);
  ok('and the picker carries them for a reader', await p.evaluate(() =>
    [...document.querySelectorAll('.hb-split button')]
      .map(x => x.getAttribute('aria-label')).join() === 'Push,Pull,Legs,Rest'));
  /* Choosing shuts it again — that is the whole shape of the control:
     a tick, one question, a tick. */
  await p.click('[data-split="push"]');
  await p.waitForTimeout(250);
  ok('choosing puts it back to a tick', await p.locator('.hb-split button').count() === 0);
  ok('and the tick is now on', await p.evaluate(() =>
    document.querySelector('[data-pick]').classList.contains('on')));
  ok('and the row names what it was', /Push/.test(
     await p.locator('.hb-item[data-h="workout"] .hb-say').innerText()));
  /* Reopening is how you CHANGE it. Clearing on press read as
     consistent with the other five and left no way to go Push -> Pull
     except to clear first. */
  await p.click('[data-pick]');
  await p.waitForTimeout(200);
  ok('pressing it again reopens rather than clearing', await p.evaluate(() =>
    document.querySelectorAll('.hb-split button').length === 4
    && document.querySelector('.hb-split [aria-pressed="true"]').dataset.split === 'push'));

  /* The picker shuts on every answer, so anything that touches a split
     opens it first. Before, the four dots were always there and a test
     could click one whenever it liked. */
  const openPick = async () => {
    if (await p.locator('.hb-split button').count() === 0) {
      await p.click('[data-pick]');
      await p.waitForTimeout(160);
    }
  };
  const choose = async (id) => {
    await openPick();
    await p.click(`[data-split="${id}"]`);
    await p.waitForTimeout(220);
  };

  // ── it records, and the recording sticks ───────────────────────
  await p.click('[data-tick="water"]');
  await p.waitForTimeout(250);
  ok('ticking marks it done',
     /done today/.test(await p.locator('.hb-item[data-h="water"]').innerText()),
     await p.locator('.hb-item[data-h="water"]').innerText());
  await choose('legs');
  await openPick();
  ok('the split logs', await p.evaluate(() =>
    document.querySelector('[data-split="legs"]').getAttribute('aria-pressed') === 'true'));
  /* Shut again before reading the row: while the picker is open the row
     is asking the question rather than answering it. */
  await p.keyboard.press('Escape');
  await p.waitForTimeout(180);
  ok('and the row names what it was', await p.evaluate(() =>
    /Legs/.test(document.querySelector('.hb-item[data-h="workout"]').innerText)),
    await p.evaluate(() =>
      document.querySelector('.hb-item[data-h="workout"]').innerText.replace(/\n/g, ' | ')));
  /* Each colour has to name its own split and no other. */
  /* Each colour names its OWN split. Collecting the three and
     asserting the collection is non-empty was the first version of this
     and it passed on anything. */
  const named = [];
  for (const id of ['push', 'pull', 'legs']) {
    await choose(id);
    named.push(await p.evaluate(() =>
      document.querySelector('.hb-item[data-h="workout"] .hb-say').textContent.trim()));
  }
  ok('and each colour names its own', named.join() === 'Push,Pull,Legs', named);
  await choose('rest');
  ok('rest says it differently', await p.evaluate(() =>
    /rest day/i.test(document.querySelector('.hb-item[data-h="workout"]').innerText)));
  /* Taken next to the thing it measures. A rest day is not a workout,
     so the ring is one lower here; training moves it back up. */
  const ring = await p.evaluate(() => document.querySelector('.hb-dial .mid').textContent);
  await choose('legs');
  ok('the ring counts it', await p.evaluate((was) =>
    +document.querySelector('.hb-dial .mid').textContent === +was + 1, ring));
  /* Rest is a day you chose not to train and must not count toward the
     week, or the number lies in the flattering direction. */
  await choose('rest');
  ok('a rest day is not a workout', await p.evaluate(() => {
    const st = JSON.parse(localStorage.getItem('habits.v1'));
    const k = new Date(); k.setMinutes(k.getMinutes() - k.getTimezoneOffset());
    const d = st.days[k.toISOString().slice(0, 10)];
    return d.split === 'rest' && d.done.workout === false;
  }));
  /* Pressing the one already lit is how you clear it — the picker has
     no other way back, and a four-way control with none is a trap. */
  await choose('rest');
  await openPick();
  ok('pressing it again clears it', await p.evaluate(() =>
    document.querySelector('[data-split="rest"]').getAttribute('aria-pressed') === 'false'));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(180);

  await p.reload({ waitUntil: 'networkidle' });
  await p.click('[data-view="habits"]');
  await p.waitForTimeout(350);
  ok('and it all survives a reload',
     /done today/.test(await p.locator('.hb-item[data-h="water"]').innerText()),
     await p.locator('.hb-item[data-h="water"]').innerText());
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

  ok('reminders are not on this screen', await p.evaluate(() =>
    !document.querySelector('#habitsSection #hrList')
    && !document.querySelector('#habitsSection #hrAdd')));

  // ── it never touches the ledger ────────────────────────────────
  ok('the ledger is untouched by any of it', await p.evaluate(() =>
    localStorage.getItem('ledger.v1') === null));
  ok('no page errors through any of it', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
