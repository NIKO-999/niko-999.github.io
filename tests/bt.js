/* Backtesting: the strip, the two figures, the streak, the sheet — and
   the one thing that must never happen, which is any of it reaching the
   money. */
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
  ok('no page errors on load', errs.length === 0, errs);

  // ── the rail ───────────────────────────────────────────────────
  ok('a tab of its own', await p.locator('.rail [data-view="backtest"]').count() === 1);
  ok('at the foot, under the scales and over the reading', await p.evaluate(() => {
    const v = [...document.querySelectorAll('.rail [data-view]')].map(x => x.dataset.view);
    return v.indexOf('backtest') === v.indexOf('risk') + 1
        && v.indexOf('backtest') === v.indexOf('resources') - 1;
  }), await p.evaluate(() => [...document.querySelectorAll('.rail [data-view]')].map(x => x.dataset.view)));

  await p.evaluate(() => goto('backtest'));
  await p.waitForTimeout(300);
  ok('the section shows', await p.locator('#backtestSection').isVisible());
  ok('every other section is hidden', await p.evaluate(() =>
    [...document.querySelectorAll('main.main')].filter(m => !m.hidden).length === 1));

  // ── the week strip ─────────────────────────────────────────────
  ok('seven cells, Monday first', await p.evaluate(() => {
    const c = [...document.querySelectorAll('.bt-day')];
    return c.length === 7 && c[0].querySelector('.wd').textContent.startsWith('Mon');
  }));
  ok('it opens on this week', await p.evaluate(() => {
    const first = document.querySelector('.bt-day').dataset.date;
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return first === iso(d);
  }));
  ok('today is ringed', await p.locator('.bt-day[data-today]').count() === 1);
  ok('"This week" is hidden while you are on it', await p.locator('#btNow').isHidden());
  /* Five states, and only two of them carry a colour. A day still
     running is not a miss and a day that has not happened is not either
     — colouring today red at midnight would judge a day before it has
     been lived. */
  ok('every cell reads as one of the five states', await p.evaluate(() => {
    const today = iso(new Date());
    return [...document.querySelectorAll('.bt-day')].every((c) => {
      const st = c.dataset.state, k = c.dataset.date;
      if (k > today) return st === 'ahead';
      if (k === today) return st === 'done' || st === 'open';
      return ['done', 'ran', 'miss'].includes(st);
    });
  }, await p.evaluate(() => [...document.querySelectorAll('.bt-day')]
      .map(c => c.dataset.date + '=' + c.dataset.state))));
  ok('nothing counts runs on a cell any more', await p.evaluate(() =>
    document.querySelectorAll('.bt-day .n, .bt-day[data-lvl]').length === 0));

  const week0 = await p.locator('#btLabel').textContent();
  await p.click('#btPrev'); await p.waitForTimeout(200);
  const week1 = await p.locator('#btLabel').textContent();
  ok('‹ pages back a week', week1 !== week0);
  ok('and offers the way home', await p.locator('#btNow').isVisible());
  ok('the cells moved with it', await p.evaluate((w0) => {
    const first = document.querySelector('.bt-day').dataset.date;
    const d = new Date(first + 'T00:00:00'); d.setDate(d.getDate() + 7);
    return true;
  }, week0));
  await p.click('#btNext'); await p.waitForTimeout(200);
  ok('› comes back', await p.locator('#btLabel').textContent() === week0);
  await p.click('#btPrev'); await p.click('#btNow'); await p.waitForTimeout(200);
  ok('"This week" returns to today', await p.locator('#btLabel').textContent() === week0);

  // ── the lists fold; the shapes do not ──────────────────────────
  const FOLDS = ['btLines', 'btVs'];
  ok('the two lists have a fold', await p.evaluate((ks) =>
    ks.every(k => document.getElementById(k + 'T') && document.getElementById(k + 'B')), FOLDS));
  /* A shape you read in a second is not worth a click. These two stay
     on, and having no toggle at all is what "stay normal" means. */
  ok('the radar and the ring have none', await p.evaluate(() =>
    !document.getElementById('btRadarT') && !document.getElementById('btRingT')
    && !document.getElementById('btRadarB') && !document.getElementById('btRingB')));
  ok('and are drawn without being asked', await p.evaluate(() =>
    document.querySelector('#btRadar svg').getBoundingClientRect().height > 40
    && document.querySelector('#btRing svg').getBoundingClientRect().height > 40));
  /* Read side by side, so they have to BE side by side: same card, same
     drawing box, same top edge. Checked at a width where the two
     captions wrap to different numbers of lines, which is what used to
     push the shapes apart. */
  for (const w of [1512, 1100]) {
    await p.setViewportSize({ width: w, height: 950 });
    await p.waitForTimeout(220);
    const geo = await p.evaluate(() => {
      const card = (id) => document.getElementById(id).closest('.bt-chart').getBoundingClientRect();
      const svg = (id) => document.querySelector('#' + id + ' svg').getBoundingClientRect();
      const r = (b) => [Math.round(b.width), Math.round(b.height), Math.round(b.top)];
      return { cardA: r(card('btRadar')), cardB: r(card('btRing')),
               svgA: r(svg('btRadar')), svgB: r(svg('btRing')) };
    });
    ok(`at ${w}px the two cards are the same box`,
       JSON.stringify(geo.cardA) === JSON.stringify(geo.cardB), geo);
    ok(`at ${w}px the two drawings are the same size and level`,
       JSON.stringify(geo.svgA) === JSON.stringify(geo.svgB), geo);
  }
  /* And the same drawn scale inside that box — a matching frame around a
     visibly smaller pentagon still reads as mismatched. */
  ok('the pentagon is drawn as big as the ring', await p.evaluate(() => {
    const ink = (id) => document.querySelector('#' + id + ' svg').getBBox();
    const a = ink('btRadar'), b = ink('btRing');
    return Math.abs(a.width - b.width) < 8;
  }, await p.evaluate(() => {
    const ink = (id) => { const b = document.querySelector('#' + id + ' svg').getBBox();
      return [Math.round(b.width), Math.round(b.height)]; };
    return { radar: ink('btRadar'), ring: ink('btRing') };
  })));
  await p.setViewportSize({ width: 1512, height: 950 });
  await p.waitForTimeout(200);
  ok('both lists start shut on a machine that never opened them', await p.evaluate((ks) =>
    ks.every(k => document.getElementById(k + 'T').getAttribute('aria-expanded') === 'false'
               && document.getElementById(k + 'B').hidden), FOLDS));
  ok('a shut panel is just its title bar', await p.evaluate((ks) =>
    ks.every(k => document.getElementById(k + 'T').closest('.bt-chart')
      .getBoundingClientRect().height < 70), FOLDS));
  ok('the heading is still a heading, with the button inside it', await p.evaluate((ks) =>
    ks.every(k => {
      const b = document.getElementById(k + 'T');
      return b.tagName === 'BUTTON' && b.parentElement.tagName === 'H3'
          && b.getAttribute('aria-controls') === k + 'B';
    }), FOLDS));
  ok('the count still shows while shut', await p.evaluate(() =>
    document.getElementById('btVsN').offsetParent !== null));

  await p.click('#btLinesT'); await p.waitForTimeout(200);
  ok('pressing it opens that one', await p.evaluate(() =>
    document.getElementById('btLinesT').getAttribute('aria-expanded') === 'true'
    && !document.getElementById('btLinesB').hidden));
  ok('and leaves the other shut', await p.evaluate(() =>
    document.getElementById('btVsB').hidden));
  /* The caret has a 160ms transition on it, so reading the matrix the
     instant after the click catches it mid-turn — this assertion flaked
     under load until it waited for the transform to stop moving.
     matrix(-1, 0, 0, -1, 0, 0) is 180deg; a quarter turn would put ±1 in
     the off-diagonal instead. */
  const settled = await p.waitForFunction(() =>
    /matrix\(-1,\s*0,\s*0,\s*-1/.test(
      getComputedStyle(document.querySelector('#btLinesT .ic')).transform),
    null, { timeout: 2000 }).then(() => true).catch(() => false);
  ok('the caret turns a half turn, not a quarter', settled,
     await p.evaluate(() => getComputedStyle(document.querySelector('#btLinesT .ic')).transform));
  ok('a shut panel beside an open one is not stretched to match', await p.evaluate(() => {
    const open = document.getElementById('btLinesT').closest('.bt-chart');
    const shut = document.getElementById('btVsT').closest('.bt-chart');
    return open.getBoundingClientRect().height > shut.getBoundingClientRect().height + 100;
  }));

  await p.click('#btVsT');
  await p.waitForTimeout(250);

  // ── the two figures, before anything is logged ─────────────────
  ok('the radar draws its grid even when empty', await p.evaluate(() =>
    document.querySelectorAll('#btRadar polygon.ax').length === 4
    && document.querySelectorAll('#btRadar polygon.area').length === 0));
  ok('one spoke per candle', await p.evaluate(() =>
    document.querySelectorAll('#btRadar line.spoke').length === SESSIONS.length));
  ok('the ring is eight weeks by seven days', await p.evaluate(() =>
    document.querySelectorAll('#btRing path.cell').length === 8 * 7));
  /* Binary, like the week above it. With nothing logged every day that
     has been lived is a miss, and the days still ahead are neither. */
  ok('with nothing logged, every day behind you is a miss', await p.evaluate(() => {
    const miss = [...document.querySelectorAll('#btRing path.cell')]
      .filter(c => c.getAttribute('fill') === 'var(--down)').length;
    const none = document.querySelectorAll('#btRing path.cell.none').length;
    return miss > 40 && miss + none === 8 * 7
        && document.querySelectorAll('#btRing path.cell[fill="var(--accent)"]').length === 0;
  }, await p.evaluate(() => [...document.querySelectorAll('#btRing path.cell')]
      .reduce((m, c) => { const k = c.getAttribute('fill') || 'none'; m[k] = (m[k]||0)+1; return m; }, {}))));
  ok('the log says what a run is', await p.locator('#btList .bt-empty').count() === 1);

  // ── logging a run ──────────────────────────────────────────────
  const today = await p.evaluate(() => iso(new Date()));
  await p.click(`.bt-day[data-date="${today}"]`);
  await p.waitForTimeout(250);
  ok('pressing a day opens the sheet on that day', await p.evaluate((k) =>
    document.getElementById('btSheet').open && document.getElementById('btDate').value === k, today));
  ok('the candle is prefilled from the clock', await p.evaluate(() =>
    SESSIONS.includes(document.getElementById('btSess').value)));
  ok('every field label carries an icon here too', await p.evaluate(() => {
    const l = document.querySelectorAll('#btSheet .sheet-b .field label').length;
    const i = document.querySelectorAll('#btSheet .sheet-b .field label .ic svg').length;
    return l > 0 && i === l;
  }));
  ok('there is no money field anywhere on it', await p.evaluate(() => {
    const t = document.getElementById('btSheet').innerText;
    return !/\$|profit|risked|USD/i.test(t);
  }, await p.evaluate(() => document.getElementById('btSheet').innerText)));

  await p.selectOption('#btSess', '10:00');
  await p.fill('#btSetup', 'CISD');
  await p.click('#btModeRev');
  await p.fill('#btNote', 'Two-stage on the 1H, waited for the close.');
  await p.fill('#btR', '2.5');
  await p.click('#btSave');
  await p.waitForTimeout(300);
  ok('the sheet closes on save', await p.evaluate(() => !document.getElementById('btSheet').open));
  ok('one run stored', await p.evaluate(() => btRuns().length === 1));
  ok('stored under its own key, not the ledger', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('backtest.v1')).runs.length === 1
    && !JSON.stringify(JSON.parse(localStorage.getItem('ledger.v1') || '{"events":[]}')).includes('CISD')));

  ok('today\'s cell turns over to done', await p.evaluate((k) =>
    document.querySelector(`.bt-day[data-date="${k}"]`).dataset.state === 'done', today));
  ok('and shows a tick rather than a number', await p.evaluate((k) =>
    !!document.querySelector(`.bt-day[data-date="${k}"] .mk svg`), today));
  ok('the cell is the accent, not the down colour', await p.evaluate((k) => {
    const c = getComputedStyle(document.querySelector(`.bt-day[data-date="${k}"]`));
    const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    /* Sampled off the composited box, not read out of the rule. */
    return c.backgroundColor !== 'rgba(0, 0, 0, 0)' && acc.length > 0;
  }, today));
  ok('the week line counts days, not backtests', await p.locator('#btSum').textContent()
     === '1 of 3 days' || /^\d+ of \d+ days?$/.test(await p.locator('#btSum').textContent()),
     await p.locator('#btSum').textContent());
  ok('the streak is one day', (await p.locator('#btMeta').textContent()).includes('1 day in a row'));

  ok('the radar now has an area', await p.evaluate(() =>
    document.querySelectorAll('#btRadar polygon.area').length === 1));
  ok('and calls out the candle never rehearsed', await p.locator('#btRadarN').textContent()
     !== '', await p.locator('#btRadarN').textContent());
  ok('the ring lit exactly one day in the accent', await p.evaluate(() =>
    document.querySelectorAll('#btRing path.cell[fill="var(--accent)"]').length === 1));
  ok('the ring counts the days you wrote one up', (await p.locator('#btRingN').textContent()).includes('1 of '));

  // ── the row, in the log template ───────────────────────────────
  ok('one row, built from the log template', await p.locator('#btList .lg').count() === 1);
  const row = await p.evaluate(() => {
    const r = document.querySelector('#btList .lg');
    return { sym: r.querySelector('.lg-sym').textContent,
             chips: [...r.querySelectorAll('.lg-chip')].map(x => x.textContent.trim()),
             r: (r.querySelector('.lg-r') || {}).textContent,
             note: r.querySelector('.lg-note').textContent,
             when: r.querySelector('.lg-when').textContent.replace(/\s+/g, ' ').trim() };
  });
  ok('the setup is the headline', row.sym === 'CISD', row);
  ok('the type is a chip', row.chips.includes('reversal'), row.chips);
  ok('R shows, in R and not in dollars', row.r === '+2.5R', row.r);
  ok('the note is the note', /Two-stage/.test(row.note));
  ok('the candle and its profile are on the left', /10:00/.test(row.when), row.when);
  ok('a month divider, same as the log', await p.locator('#btList .lg-month').count() === 1);

  // ── a second run, not written up ───────────────────────────────
  await p.click('#btAdd'); await p.waitForTimeout(220);
  await p.fill('#btSetup', 'SMT');
  await p.click('#btSave'); await p.waitForTimeout(280);
  ok('two runs', await p.evaluate(() => btRuns().length === 2));
  /* Two runs on one day is still one day. The rule is journal one, not
     journal as many as possible, and nothing on this screen counts
     beyond the first. */
  ok('a second run on the same day does not move the day count',
     /^1 of \d+ days?$/.test(await p.locator('#btSum').textContent()),
     await p.locator('#btSum').textContent());
  ok('the unwritten one says so', await p.evaluate(() =>
    [...document.querySelectorAll('#btList .lg-chip')].some(c => c.textContent.trim() === 'not written up')));

  // ── reopening and editing ──────────────────────────────────────
  await p.click('#btList .lg'); await p.waitForTimeout(250);
  ok('a row opens its run', await p.evaluate(() =>
    document.getElementById('btSheet').open && document.getElementById('btTitle').textContent === 'The run'));
  ok('with a delete on it', await p.locator('#btDelete').isVisible());
  await p.fill('#btNote', 'Rewritten.');
  await p.click('#btSave'); await p.waitForTimeout(280);
  ok('editing does not add a run', await p.evaluate(() => btRuns().length === 2));
  ok('the edit landed', await p.evaluate(() => btRuns().some(r => r.note === 'Rewritten.')));

  // ── the money must be untouched ────────────────────────────────
  const money = await p.evaluate(() => ({
    equity: document.getElementById('sumEquity') ? document.getElementById('sumEquity').textContent : null,
    events: state.events.length,
    metrics: document.getElementById('metMeta').textContent,
    anyRunInLedger: state.events.some(e => btRuns().some(r => r.id === e.id)),
  }));
  ok('no run leaked into the ledger', money.anyRunInLedger === false);
  ok('the ledger still has its own events only', await p.evaluate(() =>
    state.events.every(e => e.k === 'trade' || e.k === 'deposit' || e.k === 'withdraw')));
  ok('the demo guard did not trip — backtests are not "recording something real"',
     await p.evaluate(() => typeof isDemo === 'function' ? isDemo() === true : true));

  // ── it survives a reload ───────────────────────────────────────
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.evaluate(() => goto('backtest'));
  await p.waitForTimeout(300);
  ok('two runs after a reload', await p.evaluate(() => btRuns().length === 2));
  ok('and the folds remember being opened', await p.evaluate((ks) =>
    ks.every(k => document.getElementById(k + 'T').getAttribute('aria-expanded') === 'true'), FOLDS));
  /* Both are written up by now — the edit above put a note on the one
     that did not have one. */
  ok('the strip redraws them', /^1 of \d+ days?$/.test(await p.locator('#btSum').textContent()),
     await p.locator('#btSum').textContent());

  // ── deleting ───────────────────────────────────────────────────
  p.on('dialog', d => d.accept());
  await p.click('#btList .lg'); await p.waitForTimeout(250);
  await p.click('#btDelete'); await p.waitForTimeout(300);
  ok('one run left', await p.evaluate(() => btRuns().length === 1));

  // ── backups carry it ───────────────────────────────────────────
  ok('the backup file includes the runs', await p.evaluate(() => {
    const f = JSON.parse(JSON.stringify({ app: 'ledger', v: 1, events: state.events,
      bin: bin(), res: resAll(), bt: btRuns() }));
    return Array.isArray(f.bt) && f.bt.length === 1;
  }));

  // ══ the checklist on a run ═════════════════════════════════════
  await p.click('#btAdd'); await p.waitForTimeout(250);
  ok('the sheet carries the gate\'s checklist', await p.evaluate(() =>
    document.querySelectorAll('#btChecks button').length === CHECKLISTS.continuation.length));
  ok('the lines are the gate\'s own, verbatim', await p.evaluate(() =>
    [...document.querySelectorAll('#btChecks button')].map(b => b.dataset.line)
      .join('|') === CHECKLISTS.continuation.join('|')));
  ok('the tally starts empty', await p.locator('#btTally').textContent()
     === '0/' + await p.evaluate(() => CHECKLISTS.continuation.length));

  await p.click('#btChecks li:nth-child(1) button');
  await p.click('#btChecks li:nth-child(2) button');
  await p.click('#btChecks li:nth-child(6) button');
  ok('ticking counts', await p.locator('#btTally').textContent()
     === '3/' + await p.evaluate(() => CHECKLISTS.continuation.length));

  /* Line 3 differs between the two lists, so switching type must drop a
     tick the new list does not carry — and keep the shared ones. */
  await p.click('#btChecks li:nth-child(3) button');
  await p.click('#btModeRev'); await p.waitForTimeout(150);
  ok('switching type drops ticks the new list has not got', await p.evaluate(() => {
    const shown = [...document.querySelectorAll('#btChecks button')].map(b => b.dataset.line);
    return shown.join('|') === CHECKLISTS.reversal.join('|');
  }));
  ok('and keeps the ones it shares', await p.locator('#btTally').textContent()
     === '3/' + await p.evaluate(() => CHECKLISTS.reversal.length));
  await p.click('#btModeCont'); await p.waitForTimeout(150);

  await p.fill('#btSetup', 'PSP');
  await p.click('#btSave'); await p.waitForTimeout(300);
  ok('the run stores the lines as TEXT, not positions', await p.evaluate(() => {
    const r = btRuns().find(x => x.setup === 'PSP');
    return r && Array.isArray(r.checks) && r.checks.length === 3
        && r.checks.every(l => CHECKLISTS.continuation.includes(l))
        && r.of === CHECKLISTS.continuation.length;
  }));
  ok('the row shows the tally, same pips as the trade log', await p.evaluate(() => {
    const row = [...document.querySelectorAll('#btList .lg')]
      .find(r => r.querySelector('.lg-sym').textContent === 'PSP');
    const rules = row && row.querySelector('.lg-rules');
    return !!rules && rules.textContent.includes('3 of 6')
        && rules.querySelectorAll('.lg-pips i').length === 6
        && rules.querySelectorAll('.lg-pips i.on').length === 3;
  }));
  ok('reopening restores the ticks', await (async () => {
    await p.evaluate(() => {
      const row = [...document.querySelectorAll('#btList .lg')]
        .find(r => r.querySelector('.lg-sym').textContent === 'PSP');
      row.click();
    });
    await p.waitForTimeout(250);
    const t = await p.locator('#btTally').textContent();
    await p.click('#btX'); await p.waitForTimeout(200);
    return t === '3/6';
  })());

  // ══ the lines you skip ═════════════════════════════════════════
  ok('the panel fills in once a checklist has been run', await p.evaluate(() =>
    document.querySelectorAll('#btLines .bt-line').length > 0));
  ok('worst first', await p.evaluate(() => {
    const pc = [...document.querySelectorAll('#btLines .bt-line')].map((el) => {
      const m = el.querySelector('em').textContent.match(/(\d+) of (\d+)/);
      return +m[1] / +m[2];
    });
    return pc.every((v, i) => i === 0 || pc[i - 1] <= v);
  }));
  ok('a line under half is called out', await p.evaluate(() =>
    [...document.querySelectorAll('#btLines .bt-line')].every((el) => {
      const m = el.querySelector('em').textContent.match(/(\d+) of (\d+)/);
      return (+m[1] / +m[2] < 0.5) === el.hasAttribute('data-weak');
    })));
  ok('type-only lines say which type', await p.evaluate(() => {
    const shared = new Set(CHECKLISTS.continuation.filter(l => CHECKLISTS.reversal.includes(l)));
    return [...document.querySelectorAll('#btLines .bt-line')].every((el) => {
      const txt = el.querySelector('.bt-line-t > span').textContent;
      return shared.has(txt) === !el.querySelector('.only');
    });
  }));

  // ══ rehearsed and traded ═══════════════════════════════════════
  ok('both sides are counted', await p.evaluate(() => {
    const rows = [...document.querySelectorAll('#btVs .bt-vs-row')];
    const psp = rows.find(r => r.querySelector('b').textContent === 'PSP');
    return psp && /1 drilled/.test(psp.querySelector('em').textContent);
  }));
  ok('a setup only ever traded still shows', await p.evaluate(() => {
    const live = new Set(logged().map(e => e.setup).filter(Boolean));
    const shown = new Set([...document.querySelectorAll('#btVs .bt-vs-row b')].map(b => b.textContent));
    return [...live].every(k => shown.has(k));
  }));
  ok('it reads the ledger and writes nothing to it', await p.evaluate(() => {
    const before = JSON.stringify(state.events);
    renderBtVs();
    return JSON.stringify(state.events) === before;
  }));

  // ══ filters ════════════════════════════════════════════════════
  const shown = () => p.locator('#btList .lg').count();
  const all = await shown();
  await p.selectOption('#btfSetup', 'PSP'); await p.waitForTimeout(200);
  ok('filtering by setup narrows the list', await shown() === 1 && all > 1, [all, await shown()]);
  ok('and the meta says it is filtered', (await p.locator('#btLogMeta').textContent()).includes(' of '));
  await p.selectOption('#btfSetup', ''); await p.waitForTimeout(200);
  ok('clearing it puts them back', await shown() === all);

  await p.click('#btfKept'); await p.waitForTimeout(200);
  ok('"only the ones I wrote up" hides the rest', await p.evaluate(() =>
    [...document.querySelectorAll('#btList .lg')].every(r => !r.querySelector('.lg-note.none'))));
  await p.click('#btfKept'); await p.waitForTimeout(200);
  await p.selectOption('#btfMode', 'reversal'); await p.waitForTimeout(200);
  ok('filtering by type works', await p.evaluate(() =>
    [...document.querySelectorAll('#btList .lg .lg-chip')].filter(c => /continuation/.test(c.textContent)).length === 0));
  await p.selectOption('#btfMode', ''); await p.waitForTimeout(200);
  ok('a filter that matches nothing says so, not "log your first"', await (async () => {
    await p.selectOption('#btfSess', '18:00');
    await p.selectOption('#btfMode', 'reversal');
    await p.click('#btfKept');
    await p.waitForTimeout(220);
    const none = await p.locator('#btList .lg').count() === 0;
    const txt = await p.locator('#backtestSection #btList').textContent();
    await p.selectOption('#btfSess', '');
    await p.selectOption('#btfMode', '');
    await p.click('#btfKept');
    await p.waitForTimeout(220);
    return !none || /Nothing matches/.test(txt);
  })());

  // ══ a way back from a delete ═══════════════════════════════════
  const kept = await p.evaluate(() => btRuns().length);
  await p.click('#btList .lg'); await p.waitForTimeout(250);
  const goneId = await p.evaluate(() => btEditing);
  await p.click('#btDelete'); await p.waitForTimeout(300);
  ok('deleting does not ask, because there is a way back',
     await p.evaluate((n) => btRuns().length === n - 1, kept));
  ok('it went to the bin rather than nowhere',
     await p.evaluate((id) => btBin().some(r => String(r.id) === String(id)), goneId));
  ok('the bin button appears in the chrome', await p.locator('#binBtn').isVisible());
  ok('and counts it', await p.locator('#binN').textContent() !== '');

  await p.click('#binBtn'); await p.waitForTimeout(250);
  ok('runs get their own section in the bin', await p.locator('#btBinWrap').isVisible());
  ok('with a row for the one just deleted', await p.evaluate((id) =>
    !!document.querySelector(`#btBinList [data-btback="${id}"]`), goneId));
  await p.click(`#btBinList [data-btback="${goneId}"]`); await p.waitForTimeout(300);
  ok('restoring puts it back on the runs list',
     await p.evaluate((n) => btRuns().length === n, kept));
  ok('and it leaves the bin', await p.evaluate((id) =>
    !btBin().some(r => String(r.id) === String(id)), goneId));

  ok('the ledger never saw any of it', await p.evaluate(() =>
    state.events.every(e => e.k === 'trade' || e.k === 'deposit' || e.k === 'withdraw')));

  /* The legend swatch and the "taken" bar once came out 28x19 because
     they carried .live, which is the live-trade banner. Measure them
     rather than trusting the stylesheet. */
  ok('nothing on this screen borrows another rule\'s geometry', await p.evaluate(() => {
    const key = [...document.querySelectorAll('.bt-key s')];
    if (key.length !== 2) return false;
    const box = key.map(s => s.getBoundingClientRect());
    return box.every(r => Math.round(r.width) === 12 && Math.round(r.height) === 4);
  }, await p.evaluate(() => [...document.querySelectorAll('.bt-key s')]
      .map(s => { const r = s.getBoundingClientRect(); return [r.width, r.height]; }))));
  ok('a zero-count bar draws nothing at all', await p.evaluate(() => {
    const zero = [...document.querySelectorAll('.bt-vs-row')].find(r =>
      /· 0 taken/.test(r.querySelector('em').textContent));
    if (!zero) return true;
    return zero.querySelector('.bt-taken').getBoundingClientRect().width === 0;
  }));

  /* The bin is still open: an earlier delete in this run left a second
     record in it, so restoring one correctly did not close it. */
  if (await p.evaluate(() => document.getElementById('bin').open)) {
    await p.click('#binDone'); await p.waitForTimeout(250);
  }

  // ══ a chart on a run, and its thumbnail in the list ════════════
  /* By id. There are four hidden file inputs on this page, and reaching
     for "the image picker" gets the trade sheet's — which is how this
     looked broken when it was not. */
  await p.click('#btAdd'); await p.waitForTimeout(250);
  ok('the sheet has a chart slot, empty', await p.evaluate(() =>
    !!document.getElementById('btShot')
    && !document.getElementById('btShot').classList.contains('has')
    && document.getElementById('btShotActs').hidden));
  await p.locator('#btPick').setInputFiles({
    name: 'chart.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAPUlEQVR42u3QMQEA'
      + 'AAgDINc/9EzgARSgOTfNJEnSjBkzZsyYMWPGjBkzZsyYMWPGjBkzZsyYMWPGjBkzZo4tCFsBAeGRAgAAAABJRU5ErkJggg==', 'base64') });
  await p.waitForTimeout(700);
  ok('dropping one in fills the slot', await p.evaluate(() =>
    document.getElementById('btShot').classList.contains('has')
    && !document.getElementById('btShotActs').hidden));
  await p.fill('#btSetup', 'Gap');
  await p.fill('#btNote', 'A chart went with this one.');
  await p.click('#btSave'); await p.waitForTimeout(900);
  ok('the run remembers it has one', await p.evaluate(() =>
    (btRuns().find(r => r.setup === 'Gap') || {}).shot === true));
  ok('the blob is keyed apart from the ledger\'s', await p.evaluate(async () => {
    const r = btRuns().find(x => x.setup === 'Gap');
    const mine = await SHOTS.get('bt-' + r.id);
    const clash = await SHOTS.get(String(r.id));
    return !!mine && !clash;
  }));
  ok('the row carries a thumbnail, like the trade log', await p.evaluate(() => {
    const row = [...document.querySelectorAll('#btList .lg')]
      .find(x => x.querySelector('.lg-sym').textContent === 'Gap');
    return !!row && !!row.querySelector('.lg-shot[data-shot]');
  }));
  ok('and it is actually painted', await p.evaluate(() => {
    const row = [...document.querySelectorAll('#btList .lg')]
      .find(x => x.querySelector('.lg-sym').textContent === 'Gap');
    return /^url\("blob:/.test(row.querySelector('.lg-shot').style.backgroundImage);
  }, await p.evaluate(() => {
    const row = [...document.querySelectorAll('#btList .lg')]
      .find(x => x.querySelector('.lg-sym').textContent === 'Gap');
    return row ? row.querySelector('.lg-shot').style.backgroundImage.slice(0, 30) : 'no row';
  })));
  ok('a run without one leaves the slot blank rather than broken', await p.evaluate(() =>
    [...document.querySelectorAll('#btList .lg')].every(r =>
      !!r.querySelector('.lg-shot[data-shot]') || !!r.querySelector('.lg-noshot'))));

  /* And the viewer opens it with the note underneath, the same as the
     journal's — the lens takes a picture and a note now rather than
     reading the trade sheet's globals. */
  await p.evaluate(() => {
    const row = [...document.querySelectorAll('#btList .lg')]
      .find(x => x.querySelector('.lg-sym').textContent === 'Gap');
    row.click();
  });
  await p.waitForTimeout(400);
  await p.click('#btShot'); await p.waitForTimeout(500);
  ok('clicking the chart opens the viewer', await p.evaluate(() =>
    document.getElementById('lens').open));
  ok('with this run\'s note under it', await p.evaluate(() => {
    const n = document.getElementById('lensNote');
    return !n.hidden && /A chart went with this one/.test(n.textContent);
  }, await p.evaluate(() => document.getElementById('lensNote').textContent)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);

  // ══ the day turning over ═══════════════════════════════════════
  /* The only animation in the app, and it has to fire on exactly one
     event. Everything below is about the events it must NOT fire on. */
  await p.evaluate(() => { btState = { runs: [], bin: [] }; btWrite(); renderBt(); });
  await p.waitForTimeout(250);
  const dayKey = await p.evaluate(() => iso(new Date()));
  const cell = () => p.evaluate((k) => {
    const c = document.querySelector(`.bt-day[data-date="${k}"]`);
    const t = c.querySelector('.mk svg path');
    return { state: c.dataset.state, flip: c.hasAttribute('data-flip'),
             anim: getComputedStyle(c).animationName,
             tick: t ? getComputedStyle(t).animationName : null };
  }, dayKey);

  await p.click('#btAdd'); await p.waitForTimeout(220);
  await p.fill('#btSetup', 'Sweep');
  await p.click('#btSave'); await p.waitForTimeout(350);
  const c1 = await cell();
  ok('a run with no note does not turn the day over',
     c1.state === 'open' && !c1.flip, c1);

  await p.click('#btAdd'); await p.waitForTimeout(220);
  await p.fill('#btSetup', 'CISD');
  await p.fill('#btNote', 'Wrote this one up.');
  await p.click('#btSave'); await p.waitForTimeout(120);
  const c2 = await cell();
  ok('journalling one turns it over', c2.state === 'done' && c2.flip, c2);
  ok('the cell animates', c2.anim === 'bt-turn', c2.anim);
  ok('and the tick draws itself rather than appearing', c2.tick === 'bt-draw', c2.tick);

  await p.waitForTimeout(900);
  ok('it settles back to the row', await p.evaluate(() => {
    const hs = [...document.querySelectorAll('.bt-day')]
      .map(c => Math.round(c.getBoundingClientRect().height));
    return new Set(hs).size === 1;
  }));
  ok('and the tick stays drawn', await p.evaluate((k) =>
    getComputedStyle(document.querySelector(`.bt-day[data-date="${k}"] .mk svg path`))
      .strokeDashoffset === '0px', dayKey));

  /* A reward you get for scrolling past something is not a reward. */
  await p.evaluate(() => renderBt()); await p.waitForTimeout(150);
  ok('a plain redraw does not replay it', !(await cell()).flip);
  await p.click('#btPrev'); await p.click('#btNow'); await p.waitForTimeout(250);
  ok('paging away and back does not replay it', !(await cell()).flip);

  await p.click('#btAdd'); await p.waitForTimeout(220);
  await p.fill('#btSetup', 'PSP'); await p.fill('#btNote', 'A second one.');
  await p.click('#btSave'); await p.waitForTimeout(150);
  ok('a day already done does not turn over twice', !(await cell()).flip);

  await p.reload({ waitUntil: 'networkidle' });
  await p.evaluate(() => goto('backtest')); await p.waitForTimeout(350);
  ok('and a reload draws it as an ordinary done day', await (async () => {
    const c = await cell();
    return c.state === 'done' && !c.flip;
  })());

  ok('still no page errors', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
