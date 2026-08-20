/* State — the check-in before the gate.

   Most of these are about the two rules that make the record worth
   keeping: nothing on the way in is scored, and once you have traded
   you cannot revise what you said this morning. */
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
  ok('a tab of its own', await p.locator('.rail [data-view="state"]').count() === 1);
  ok('at the very end of the rail, after the reading', await p.evaluate(() => {
    const v = [...document.querySelectorAll('.rail [data-view]')].map(x => x.dataset.view);
    return v[v.length - 1] === 'state' && v.indexOf('state') > v.indexOf('resources');
  }, await p.evaluate(() => [...document.querySelectorAll('.rail [data-view]')].map(x => x.dataset.view))));

  // ── the gate will not open ─────────────────────────────────────
  ok('the chip says you have not checked in', await p.evaluate(() =>
    document.getElementById('ckChip').hasAttribute('data-none')
    && /not checked in/i.test(document.getElementById('ckChip').textContent)));
  ok('and the gate is shut', await p.locator('#gIn').isDisabled());
  /* Belt as well as braces: a disabled button is a hint, and anything
     that re-renders the panel could clear it. */
  ok('the handler refuses even if the button is re-enabled', await p.evaluate(async () => {
    const before = openPos.length;
    document.getElementById('gIn').disabled = false;
    document.getElementById('gIn').click();
    await new Promise(r => setTimeout(r, 150));
    return openPos.length === before;
  }));
  ok('and refusing sends you to the check-in', await p.evaluate(() =>
    !document.getElementById('stateSection').hidden));

  // ── the pad ────────────────────────────────────────────────────
  await p.evaluate(() => goto('state'));
  await p.waitForTimeout(300);
  ok('the pad is square', await p.evaluate(() => {
    const vb = document.getElementById('ckSvg').getAttribute('viewBox').split(' ').map(Number);
    return vb[2] === vb[3];
  }));
  ok('four corners, named after failures rather than feelings', await p.evaluate(() =>
    ['SHARP', 'TILTED', 'IDLE', 'RATTLED'].every(q =>
      [...document.querySelectorAll('#ckSvg .quad')].some(t => t.textContent === q))));
  ok('both axes are labelled at both ends', await p.evaluate(() =>
    ['CHARGED', 'FLAT', 'CALM', 'AGITATED'].every(t =>
      [...document.querySelectorAll('#ckSvg .edge')].some(e => e.textContent === t))));
  ok('nothing is placed until you place it', await p.evaluate(() =>
    document.querySelectorAll('#ckSvg .me').length === 0));
  ok('four facts, no more', await p.locator('#ckAsks button').count() === 4);
  ok('and none of them starts answered', await p.evaluate(() =>
    [...document.querySelectorAll('#ckAsks button')]
      .every(x => x.getAttribute('aria-pressed') === 'false')));

  /* ── nothing on the way in is scored ────────────────────────────
     No answer may be drawn in the up or down colour. The moment the
     form implies a right answer you start giving it one. */
  const scored = await p.evaluate(() => {
    const up = getComputedStyle(document.documentElement).getPropertyValue('--up').trim();
    const dn = getComputedStyle(document.documentElement).getPropertyValue('--down').trim();
    const paint = (e) => { const c = getComputedStyle(e); return [c.color, c.backgroundColor, c.fill, c.stroke].join(' '); };
    const inputs = [...document.querySelectorAll('#ckAsks button, #ckAsks .box, #ckSvg .quad, #ckSvg .me, #ckSvg .fld')];
    return { up, dn, hits: inputs.filter(e => paint(e).includes(up) || paint(e).includes(dn)).length };
  });
  ok('no input on the pad or the list is drawn in a win/lose colour', scored.hits === 0, scored);

  // place a dot in each corner and check what it is called
  const box = await p.locator('#ckSvg').boundingBox();
  const put = async (fx, fy) => {
    await p.mouse.click(box.x + box.width * fx, box.y + box.height * fy);
    await p.waitForTimeout(120);
    return p.evaluate(() => CK_QUAD(ckX, ckY));
  };
  ok('top-left is Sharp',     await put(0.30, 0.28) === 'Sharp');
  ok('top-right is Tilted',   await put(0.72, 0.28) === 'Tilted');
  ok('bottom-left is Idle',   await put(0.30, 0.74) === 'Idle');
  ok('bottom-right is Rattled', await put(0.72, 0.74) === 'Rattled');

  await put(0.30, 0.28);
  await p.click('#ckAsks li:nth-child(1) button');
  await p.click('#ckAsks li:nth-child(3) button');
  await p.fill('#ckNote', 'Slept fine.');
  await p.click('#ckSave');
  await p.waitForTimeout(350);

  ok('it stores under its own key, not the ledger', await p.evaluate(() =>
    JSON.parse(localStorage.getItem('checkin.v1')).days.length === 1
    && !JSON.stringify(state.events).includes('Slept fine')));
  ok('with the two facts you answered', await p.evaluate(() =>
    ckToday().flags.length === 2));
  ok('the gate opens now', !(await p.locator('#gIn').isDisabled()));
  ok('and the chip says where you landed rather than vanishing', await p.evaluate(() => {
    const c = document.getElementById('ckChip');
    return !c.hasAttribute('data-none') && /Sharp/.test(c.textContent);
  }));

  // ── the days behind you carry the ledger, as SHAPE ─────────────
  await p.evaluate(() => {
    const dates = [...new Set(state.events.filter(e => e.k === 'trade').map(e => e.date))];
    let s = 5; const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
    ckState = { days: ckDays().concat(dates.map(d => ({ date: d, x: rnd(), y: rnd(), flags: [], note: '', at: 0 }))) };
    ckWrite(); renderCk();
  });
  await p.waitForTimeout(300);
  const dots = await p.evaluate(() => {
    const c = { up: 0, down: 0, flat: 0 };
    document.querySelectorAll('#ckSvg .was').forEach(x => {
      ['up', 'down', 'flat'].forEach(k => { if (x.classList.contains(k)) c[k]++; });
    });
    return c;
  });
  ok('past days are drawn, and in both directions', dots.up > 0 && dots.down > 0, dots);

  /* Shape, not colour. A year of mornings is mostly red and this is the
     screen whose job is to settle you down, so the pad says the same
     thing with a fill and a ring instead. Sampled off the composited
     style rather than read out of the stylesheet. */
  const ink = await p.evaluate(() => {
    const one = (sel) => {
      const el = document.querySelector('#ckSvg .was.' + sel);
      if (!el) return null;
      const st = getComputedStyle(el);
      return { fill: st.fill, stroke: st.stroke, r: +el.getAttribute('r') };
    };
    return { up: one('up'), down: one('down'), flat: one('flat') };
  });
  ok('a day that worked is solid', ink.up && ink.up.fill !== 'none' && ink.up.stroke === 'none', ink.up);
  ok('a day that did not is hollow', ink.down && ink.down.fill === 'none'
     && ink.down.stroke !== 'none', ink.down);
  ok('and the two are the same size, so only the fill differs',
     ink.up && ink.down && Math.abs(ink.up.r - ink.down.r) < 0.3, [ink.up, ink.down]);
  ok('a day you did not trade is a speck', !ink.flat || ink.flat.r < ink.up.r / 1.8,
     [ink.flat, ink.up]);
  /* The rule this screen is built on: no red and no green anywhere on
     the pad, in the key, or in the words. */
  const hot = await p.evaluate(() => {
    const bad = [];
    const look = (el) => {
      const st = getComputedStyle(el);
      for (const c of [st.fill, st.stroke, st.color, st.backgroundColor, st.borderTopColor]) {
        const m = String(c).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
        if (!m) continue;
        if (m[4] !== undefined && +m[4] < 0.06) continue;      // transparent does not count
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        if ((r > g + 20 && r > b + 20) || (g > r + 20 && g > b + 20))
          bad.push({ el: el.tagName + '.' + el.getAttribute('class'), c });
      }
    };
    document.querySelectorAll('#ckSvg *, .ck-key, .ck-key *').forEach(look);
    return bad;
  });
  ok('no red and no green on the pad or in its key', hot.length === 0, hot.slice(0, 4));
  /* And not four inches lower either. The rows under the pad were still
     saying "it did not" in red about the same day the pad had just
     drawn as a hollow ring — which left the wash of losses exactly
     where it was, one scroll down. */
  /* ── no denominator, no dictionary, and the rule stated ───────
     Three things this screen was still getting wrong after everything
     else on it had been fixed. */
  await p.evaluate(() => {
    const today = iso(new Date());
    const mk = (back, flags, note) => {
      const d = new Date(); d.setDate(d.getDate() - back);
      const k = iso(d);
      return { date: k, x: 0.3, y: 0.7, flags, note,
               at: new Date(k + 'T07:41:00').getTime() };
    };
    ckState = { days: [mk(3, ['Slept enough', 'Yesterday is closed'], ''),
                       mk(4, [], ''),
                       mk(5, ['Slept enough'], 'Did not want to be at the screen at all.')] };
    ckWrite(); renderCk();
  });
  await p.waitForTimeout(300);

  const rowText = await p.locator('#ckList').innerText();
  ok('no row carries a denominator', !/\b\d+\s*(of|\/)\s*\d+\b/.test(rowText),
     rowText.slice(0, 160));
  ok('a row names the facts that were true instead', await p.evaluate(() => {
    const c = [...document.querySelectorAll('#ckList .lg')][0].querySelectorAll('.lg-chip');
    return [...c].map(x => x.textContent.trim()).join(',');
  }).then(t => t === 'slept,yesterday closed'), await p.evaluate(() =>
    [...document.querySelectorAll('#ckList .lg')][0].innerText.replace(/\n/g, ' | ')));
  ok('a morning with nothing ticked prints nothing, not "0 of 4"', await p.evaluate(() =>
    [...document.querySelectorAll('#ckList .lg')][1].querySelectorAll('.lg-chip').length === 0));

  /* The corner's own definition is not a note. A week of Sharp mornings
     used to print the same sentence seven times, next to a column that
     already said "Sharp". */
  ok('no row repeats the corner definition as a note', await p.evaluate((says) => {
    const t = document.getElementById('ckList').innerText;
    return !Object.values(says).some(v => t.includes(v));
  }, await p.evaluate(() => CK_SAYS)));
  ok('a morning with nothing written carries no note line at all', await p.evaluate(() =>
    [...document.querySelectorAll('#ckList .lg')][0].querySelectorAll('.lg-note').length === 0));
  ok('and one with something written keeps it', await p.evaluate(() =>
    [...document.querySelectorAll('#ckList .lg')][2].querySelector('.lg-note').textContent
      .includes('Did not want to be at the screen')));
  ok('the row says when you checked in', /07:41/.test(rowText), rowText.slice(0, 120));

  /* The rule the screen enforces, stated on the screen that enforces
     it — in both directions, because a rule that vanishes once you have
     satisfied it has to be rediscovered every time you have not. */
  ok('the screen says it holds the gate shut', await p.evaluate(() =>
    /gate stays shut/i.test(document.getElementById('ckWhy').textContent)),
    await p.locator('#ckWhy').textContent());
  await p.evaluate(() => { ckX = 0.3; ckY = 0.7; ckPlaced = true;
    document.getElementById('ckSave').click(); });
  await p.waitForTimeout(300);
  ok('and says so in the past tense once you have', await p.evaluate(() =>
    /gate is open/i.test(document.getElementById('ckWhy').textContent)),
    await p.locator('#ckWhy').textContent());
  ok('which is still true at the gate itself', await p.evaluate(() =>
    !document.getElementById('gIn').disabled));

  ok('nor anywhere else on this screen', await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#stateSection *').forEach((el) => {
      if (el.children.length) return;
      const m = getComputedStyle(el).color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      const [r, g, b] = [+m[1], +m[2], +m[3]];
      if ((r > g + 20 && r > b + 20) || (g > r + 20 && g > b + 20))
        bad.push(el.textContent.trim().slice(0, 20) + ' · ' + el.className);
    });
    return bad;
  }).then(x => x.length === 0), await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#stateSection *').forEach((el) => {
      if (el.children.length) return;
      const m = getComputedStyle(el).color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return;
      const [r, g, b] = [+m[1], +m[2], +m[3]];
      if ((r > g + 20 && r > b + 20) || (g > r + 20 && g > b + 20))
        bad.push(el.textContent.trim().slice(0, 20) + ' · ' + el.className);
    });
    return bad.slice(0, 4);
  }));
  ok('and the key does not name a colour either', await p.evaluate(() =>
    !/green|red/i.test(document.querySelector('.ck-key').textContent)),
    await p.locator('.ck-key').textContent());
  ok('each dot matches what the ledger did that day', await p.evaluate(() => {
    const today = iso(new Date());
    return ckDays().filter(d => d.date < today).every((d) => {
      let n = 0, sum = 0;
      for (const e of state.events)
        if (e.k === 'trade' && e.date === d.date && e.out !== 'missed') { n++; sum += e.amt; }
      const want = !n ? 'flat' : sum > 0 ? 'up' : sum < 0 ? 'down' : 'flat';
      return ckPnl(d.date) === want;
    });
  }));
  /* The search box filters the calendar and the log. A history that
     changed shape when you typed in it would be a different history. */
  ok('the search box does not reshape the history', await p.evaluate(async () => {
    const before = ckPnl(ckDays()[1].date);
    const q = document.getElementById('q');
    q.value = 'zzzz-nothing-matches';
    q.dispatchEvent(new Event('input'));
    await new Promise(r => setTimeout(r, 150));
    const after = ckPnl(ckDays()[1].date);
    q.value = ''; q.dispatchEvent(new Event('input'));
    return before === after;
  }));

  // ── locked once you have traded ────────────────────────────────
  ok('before a trade, it can still be changed', await p.evaluate(() =>
    !ckLocked() && !document.getElementById('ckSave').disabled));
  await p.evaluate(() => {
    state.events.push({ id: uid(), k: 'trade', date: iso(new Date()), amt: 120, risk: 60, sym: 'X', setup: 'CISD' });
    commit('recorded');
  });
  await p.waitForTimeout(400);
  ok('after one, it locks', await p.evaluate(() => ckLocked()
    && document.getElementById('ckSave').disabled
    && document.getElementById('ckNote').disabled));
  ok('and says why rather than looking broken', await p.evaluate(() =>
    !document.getElementById('ckLocked').hidden
    && /record/.test(document.getElementById('ckLocked').textContent)));
  ok('the pad stops moving too', await p.evaluate(async () => {
    const was = [ckX, ckY].join();
    const svg = document.getElementById('ckSvg').getBoundingClientRect();
    document.getElementById('ckPad').dispatchEvent(new PointerEvent('pointerdown',
      { clientX: svg.left + 20, clientY: svg.bottom - 20, bubbles: true, pointerId: 1 }));
    await new Promise(r => setTimeout(r, 120));
    return [ckX, ckY].join() === was;
  }));
  ok('and what was written this morning is unchanged', await p.evaluate(() =>
    ckToday().note === 'Slept fine.' && CK_QUAD(ckToday().x, ckToday().y) === 'Sharp'));

  // ── it survives a reload ───────────────────────────────────────
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok('still checked in after a reload', await p.evaluate(() => !!ckToday()));
  ok('and the ledger never saw any of it', await p.evaluate(() =>
    state.events.every(e => ['trade', 'deposit', 'withdraw'].includes(e.k))));

  ok('still no page errors', errs.length === 0, errs);
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
