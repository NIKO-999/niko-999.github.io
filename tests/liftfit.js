/* ═══════════════════════════════════════════════════════════════
   LIFT — THE SETS FOLLOW THE TARGETS. A muscle's weekly target moves
   the sets on its exercises, in the day as it is looked at and in the
   workout as it is started. Lower, higher, left alone, cut to nothing
   and pushed past what a day can hold; the switch that turns it off;
   what you keep in the program; and the rules that go with it (never
   one set of anything, a swap is your own choice).

   Every number is read off the real screens. Nothing here knows how the
   fitting is worked out: it is asserted from what the day says, and
   from what the same day says with the switch off.

   The clock is frozen at Friday 30 October 2026, 18:00.
   ═══════════════════════════════════════════════════════════════ */
const { chromium, chrome, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}` + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'en-GB', colorScheme: 'dark' };
const freeze = (at) => `(() => { const F = new Date('${at}').getTime(); const R = Date; window.Date = class extends R { constructor(...a) { super(...(a.length ? a : [F])); } static now() { return F; } }; })();`;
const focus = (rows) => rows.map((r) => ({ m: r[0], lo: r[1], hi: r[2] === undefined ? r[1] : r[2], p: 0 }));
/* the program's own: every figure the day shows with the switch off */
/* the program's own, in EFFECTIVE sets, the way the bars count them: each muscle's direct sets plus half of what other exercises give it (presses for triceps, rows for biceps, squats for glutes) */
const BASE_TG = [['Quads', 17], ['Hamstrings', 16], ['Calves', 15], ['Glutes', 11], ['Chest', 16], ['Back', 16], ['Shoulders', 16], ['Triceps', 14], ['Biceps', 17], ['Abs', 11]];
/* which exercises of the seeded program are which muscle, by the names the days print */
const HAM = ['Romanian deadlift', 'Seated leg curls', 'Lying leg curls'];
const CHEST = ['Incline dumbbell press', 'Cable chest flyes', 'Dumbbell bench press', 'Pec deck'];

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [];

  async function open(seed, at, ctxo) {
    const c = await browser.newContext(Object.assign({}, PHONE, ctxo || {}));
    seed = Object.assign({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [], prog: 'ul' }, seed || {});
    await c.addInitScript(freeze(at || '2026-10-30T18:00:00'));
    await c.addInitScript(`try { if (!localStorage.getItem('lift.v1')) localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify(seed))}); } catch (e) {} window.__lfNoIntro = 1;`);
    await c.route('https://sched.nikorapullin.workers.dev/**', (r) => r.fulfill({ status: 503, body: '{}' }));
    const page = await c.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${BASE}/lift/`); await page.waitForTimeout(500);
    return { c, page };
  }
  const settle = (p) => p.waitForTimeout(450);
  /* the split's days, each as its sheet prints it */
  async function days(page) {
    await page.click('.lf-bar [data-v="lib"]'); await settle(page);
    await page.click('text=Your split'); await settle(page);
    const n = await page.locator('.lf-sheet').last().locator('.lf-li').count(), out = [];
    for (let i = 0; i < n; i++) {
      await page.locator('.lf-sheet').last().locator('.lf-li').nth(i).click(); await settle(page);
      out.push(await page.evaluate(() => {
        const s = [...document.querySelectorAll('.lf-sheet')].pop();
        return { title: s.querySelector('h2').textContent, rows: [...s.querySelectorAll('.lf-list .lf-li')].map((r) => ({ n: r.querySelector('b').textContent, sets: parseInt((r.querySelector('.lf-li-r') || { textContent: '' }).textContent, 10) || 0, fit: (r.querySelector('.lf-fit') || { textContent: '' }).textContent, off: r.classList.contains('is-off') })) };
      }));
      await page.keyboard.press('Escape'); await settle(page);
    }
    return out;
  }
  const rowsOf = (ds) => [].concat(...ds.map((d) => d.rows.filter((r) => !r.off)));
  const sumOf = (ds, names) => rowsOf(ds).filter((r) => names.indexOf(r.n) >= 0).reduce((a, r) => a + r.sets, 0);
  const notes = (ds) => rowsOf(ds).filter((r) => r.fit);

  /* ── THE SWITCH OFF: the program as it is written ── */
  let base, baseHam, baseChest;
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))), fit: false });
    base = await days(o.page); baseHam = sumOf(base, HAM); baseChest = sumOf(base, CHEST);
    ok('with the switch off no day carries a note, whatever the targets say', notes(base).length === 0, notes(base));
    ok('and the program is the one that is written: hamstrings come to 14 sets over the week', baseHam === 14, baseHam);
    await o.c.close();
  }

  /* ── LEFT ALONE: a target the program already meets changes nothing ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 16] : r))) });
    const ds = await days(o.page);
    ok('a target the program already meets changes nothing: no notes and every row as written', notes(ds).length === 0 && JSON.stringify(rowsOf(ds).map((r) => r.sets)) === JSON.stringify(rowsOf(base).map((r) => r.sets)), notes(ds));
    await o.c.close();
  }
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 14, 18] : r))) });
    const ds = await days(o.page);
    ok('a range the program sits inside leaves it alone', notes(ds).length === 0 && sumOf(ds, HAM) === baseHam, [notes(ds).length, sumOf(ds, HAM)]);
    await o.c.close();
  }

  /* ── LOWER ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))) });
    const ds = await days(o.page), s = sumOf(ds, HAM), n = notes(ds).filter((r) => HAM.indexOf(r.n) >= 0);
    ok('lowering hamstrings to 7 takes the week down towards it, counting the half that hip thrusts already give them', s < baseHam && s >= 5, [baseHam, s]);
    ok('and says on each row that moved what it moved from and why', n.length >= 2 && n.every((r) => /instead of \d+, your hamstrings target/.test(r.fit)), n);
    ok('nothing else moved: the chest rows are as written', sumOf(ds, CHEST) === baseChest, sumOf(ds, CHEST));
    ok('and no exercise is left with one set', rowsOf(ds).every((r) => r.sets !== 1), rowsOf(ds).filter((r) => r.sets === 1));
    await o.c.close();
  }

  /* ── HIGHER, TO THE POINT A DAY CANNOT HOLD ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 20] : r))) });
    const ds = await days(o.page), s = sumOf(ds, HAM);
    ok('raising hamstrings to 20 adds sets to what is there', s > baseHam && s <= 20 + 1, [baseHam, s]);
    ok('and no exercise goes past six sets', rowsOf(ds).every((r) => r.sets <= 6), rowsOf(ds).filter((r) => r.sets > 6));
    await o.c.close();
  }
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Glutes' ? ['Glutes', 20] : r))) });
    const ds = await days(o.page), add = notes(ds).filter((r) => /added for your glutes target/.test(r.fit));
    ok('pushing glutes past what a day holds adds another exercise for them, and says so', add.length === 1, notes(ds));
    ok('which is a real exercise with sets of its own', add.length === 1 && add[0].sets >= 2 && add[0].sets <= 4, add);
    await o.c.close();
  }

  /* ── CUT TO NOTHING: exercises come off, and the rest keep at least two ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Chest' ? ['Chest', 2] : r))) });
    const ds = await days(o.page), off = [].concat(...ds.map((d) => d.rows.filter((r) => r.off)));
    ok('cutting chest to 2 takes exercises off the days, shown as off for now with the reason', off.length >= 2 && off.every((r) => CHEST.indexOf(r.n) >= 0), off);
    ok('and any chest exercise left has at least two sets', rowsOf(ds).filter((r) => CHEST.indexOf(r.n) >= 0).every((r) => r.sets >= 2), rowsOf(ds).filter((r) => CHEST.indexOf(r.n) >= 0));
    await o.c.close();
  }

  /* ── IN THE WORKOUT: a recommended exercise says so, and can be kept ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))) });
    const p = o.page;
    await p.click('.lf-bar [data-v="lib"]'); await settle(p);
    await p.click('text=Your split'); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-li').nth(2).click(); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-btn.is-log').click(); await p.waitForTimeout(900);
    const cards = () => p.evaluate(() => [...document.querySelectorAll('.lf-ex')].map((c) => ({ n: c.querySelector('.lf-ex-n').textContent, sets: c.querySelectorAll('.lf-set:not(.is-hd)').length || (c.querySelector('.lf-ex-dots') ? c.querySelector('.lf-ex-dots').children.length : 0), rec: !!c.querySelector('.lf-rcm'), coach: !!c.querySelector('.lf-aim:not(.lf-rcm)') })));
    const cs = await cards();
    const rdl = cs.filter((c) => c.n === 'Romanian deadlift')[0];
    ok('the workout starts with the fitted sets: the deadlift has two, not three', rdl && rdl.sets === 2, rdl);
    ok('the exercises the targets moved carry the Recommended line', cs.filter((c) => /deadlift|leg curls/i.test(c.n)).every((c) => c.rec), cs);
    ok('and the ones they did not move do not', cs.filter((c) => /Hip thrusts|calf|crunches/i.test(c.n)).every((c) => !c.rec), cs);
    /* the reason opens on a tap */
    await p.evaluate(() => { const c = [...document.querySelectorAll('.lf-ex')].filter((x) => x.querySelector('.lf-rcm'))[0]; if (c.classList.contains('is-fold')) c.querySelector('.lf-ex-n').click(); });
    await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelector('.lf-rcm-w').click()); await p.waitForTimeout(300);
    const why = await p.evaluate(() => (document.querySelector('.lf-rcm-why:not([hidden])') || { textContent: '' }).textContent);
    ok('tapping Recommended says where it comes from, in the target\'s own figures', /Your hamstrings target is 7 sets a week, so this goes from \d+ sets? to \d+/.test(why), why);
    /* keep it */
    const before = await p.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('lift.v1')).keep || null));
    await p.evaluate(() => document.querySelector('.lf-rcm [data-k="keep"]').click()); await p.waitForTimeout(700);
    const after = await p.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).keep || null);
    ok('keeping it writes the set count against the day', before === 'null' && after && Object.keys(after).length === 1 && after[Object.keys(after)[0]][0][1] === 2, after);
    const cs2 = await cards();
    ok('and the card goes back to the coach line', cs2.filter((c) => c.n === 'Romanian deadlift').every((c) => !c.rec), cs2);
    await o.c.close();
  }
  /* kept sets are not changed again: the same day, started fresh, with the same target */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))), keep: { 'p-wed': [['rdl', 2]] } });
    const ds = await days(o.page), rdl = rowsOf(ds).filter((r) => r.n === 'Romanian deadlift')[0];
    ok('a kept exercise is shown as kept: two sets with no note', rdl && rdl.sets === 2 && !rdl.fit, rdl);
    await o.c.close();
  }

  /* ── A SWAP IS YOUR OWN CHOICE ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))) });
    const p = o.page;
    await p.click('.lf-bar [data-v="lib"]'); await settle(p);
    await p.click('text=Your split'); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-li').nth(2).click(); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-btn.is-log').click(); await p.waitForTimeout(900);
    await p.evaluate(() => { const c = [...document.querySelectorAll('.lf-ex')].filter((x) => x.querySelector('.lf-ex-n').textContent === 'Romanian deadlift')[0]; c.querySelector('.lf-more').click(); });
    await p.waitForTimeout(400);
    await p.evaluate(() => { const m = [...document.querySelectorAll('#lfExMenu .lf-xm-i')].find((x) => /swap/i.test(x.textContent)); m.click(); }); await p.waitForTimeout(600);
    await p.locator('.lf-sheet').last().locator('.lf-li', { hasText: /^Good mornings/ }).first().click(); await p.waitForTimeout(800);
    const sw = await p.evaluate(() => { const c = [...document.querySelectorAll('.lf-ex')].filter((x) => /Good mornings/.test(x.querySelector('.lf-ex-n').textContent))[0]; return c ? { rec: !!c.querySelector('.lf-rcm'), txt: c.querySelector('.lf-rcm') ? c.querySelector('.lf-rcm').textContent : '' } : null; });
    ok('a swapped exercise is offered Keep in program and is not called recommended', sw && sw.rec && /Keep in program/.test(sw.txt) && !/RECOMMENDED/.test(sw.txt), sw);
    await o.c.close();
  }

  /* ── ADDED EXERCISES ARE RECOMMENDED TOO, AND A KEEP ADDS THEM ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Glutes' ? ['Glutes', 20] : r))) });
    const p = o.page;
    await p.click('.lf-bar [data-v="lib"]'); await settle(p);
    await p.click('text=Your split'); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-li').nth(2).click(); await settle(p);
    await p.locator('.lf-sheet').last().locator('.lf-btn.is-log').click(); await p.waitForTimeout(900);
    const names = await p.evaluate(() => [...document.querySelectorAll('.lf-ex')].map((c) => c.querySelector('.lf-ex-n').textContent));
    const extra = await p.evaluate(() => { const c = [...document.querySelectorAll('.lf-ex')].filter((x) => x.querySelector('.lf-rcm')).pop(); return c ? c.querySelector('.lf-ex-n').textContent : ''; });
    ok('the workout has the extra glutes exercise at its foot, recommended', extra && names.indexOf(extra) === names.length - 1 && names.length === 7, [names, extra]);
    await p.evaluate(() => { const c = [...document.querySelectorAll('.lf-ex')].filter((x) => x.querySelector('.lf-rcm')).pop(); if (c.classList.contains('is-fold')) c.querySelector('.lf-ex-n').click(); });
    await p.waitForTimeout(500);
    await p.evaluate(() => [...document.querySelectorAll('.lf-ex')].filter((x) => x.querySelector('.lf-rcm')).pop().querySelector('[data-k="keep"]').click()); await p.waitForTimeout(700);
    const keep = await p.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).keep);
    ok('keeping an added exercise puts it on that day for good', keep && Object.keys(keep).length === 1 && keep['p-wed'].length === 1 && keep['p-wed'][0][1] >= 2, keep);
    await o.c.close();
  }

  /* ── THE TWO NEW BARS ── */
  {
    const d = new Date('2026-10-30T10:00:00'), ymd = '2026-10-30';
    const sets = (n) => Array.from({ length: n }, () => ({ w: 20, r: 12 }));
    const wo = [{ id: 'h1', d: ymd, s: d.getTime(), e: d.getTime() + 3600000, n: 'Pull', x: [{ id: 'rdfly', n: 'Rear delt flyes', sets: sets(3) }, { id: 'facepull', n: 'Face pulls', sets: sets(1) }, { id: 'backext', n: '45-degree back extensions', sets: sets(1) }] }];
    const o = await open({ wo, focus: focus(BASE_TG) });
    const bars = await o.page.evaluate(() => [...document.querySelectorAll('#lfLegs .lf-vr')].map((r) => ({ m: r.dataset.m, em: r.querySelector('em').textContent, aux: r.classList.contains('is-aux'), met: r.classList.contains('is-met') })));
    const rd = bars.filter((b) => b.m === 'Rear delts')[0], lb = bars.filter((b) => b.m === 'Lower back')[0];
    ok('rear delts and lower back join the targets, once, as bars of their own', rd && lb && rd.aux && lb.aux, bars.map((b) => b.m));
    ok('rear delts count the rear delt flyes and the face pulls: 4 sets', rd && /^4 \//.test(rd.em), rd);
    ok('and lower back counts the back extensions', lb && /^1 \//.test(lb.em), lb);
    const st = await o.page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')));
    ok('the targets are written once, and marked as the app\'s own', st.focus.filter((f) => f.m === 'Rear delts').length === 1 && st.focus.filter((f) => f.a).length === 2 && !('aux' in st), st.focus);
    ok('an exercise made by the user, with its name saying hip hinge, counts toward lower back', await (async () => {
      const o2 = await open({ focus: focus(BASE_TG), ex: [{ id: 'mine', n: 'Hip hinge drill', m: 'Hamstrings', t: 'w', c: 1 }], wo: [{ id: 'h2', d: ymd, s: d.getTime(), e: d.getTime() + 3600000, n: 'x', x: [{ id: 'mine', n: 'Hip hinge drill', sets: sets(3) }] }] });
      const em = await o2.page.evaluate(() => { const r = document.querySelector('#lfLegs .lf-vr[data-m="Lower back"]'); return r ? r.querySelector('em').textContent : ''; });
      await o2.c.close(); return /^3 \//.test(em);
    })());
    await o.c.close();
  }

  /* ── THE TWO ROWS ARE THE APP'S OWN UNTIL YOU TOUCH THEM ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => r).concat([['Rear delts', 6], ['Lower back', 2]])).map((f) => (f.m === 'Rear delts' || f.m === 'Lower back' ? Object.assign(f, { a: 1 }) : f)) });
    await o.page.click('.lf-bar [data-v="home"]'); await settle(o.page);
    const st = await o.page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')));
    ok('rows the app added survive a reload with their mark', st.focus.filter((f) => f.a).length === 2, st.focus.filter((f) => f.a));
    await o.c.close();
  }
  {
    /* a person who never changed their targets still follows the split they switch to, with the two rows on the end */
    const o = await open({ focus: null });
    await o.page.evaluate(() => { const s = JSON.parse(localStorage.getItem('lift.v1')); delete s.focus; localStorage.setItem('lift.v1', JSON.stringify(s)); });
    await o.page.reload(); await settle(o.page);
    await o.page.click('.lf-bar [data-v="home"]'); await settle(o.page);
    const st = await o.page.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')));
    ok('a focus left as the program wrote it is still that, with the two rows marked', st.focus.filter((f) => f.a).length === 2 && st.focus.filter((f) => !f.a).length >= 8, st.focus.map((f) => f.m + (f.a ? '*' : '')));
    await o.c.close();
  }
  {
    const o = await open({ focus: focus(BASE_TG) });
    const p = o.page;
    await p.click('.lf-bar [data-v="home"]'); await settle(p);
    await p.click('#lfTgEdit'); await settle(p);
    await p.evaluate(() => { const b = [...document.querySelectorAll('.lf-sheet')].pop(); const m = [...b.querySelectorAll('button')].find((x) => /more|every|muscle|list/i.test(x.textContent)); if (m) m.click(); });
    await p.waitForTimeout(500);
    await p.keyboard.press('Escape'); await settle(p);
    ok('editing happens in the sheets; here only that the bars are on the card', await p.locator('#lfLegs .lf-vr[data-m="Rear delts"]').count() === 1 && await p.locator('#lfLegs .lf-vr[data-m="Lower back"]').count() === 1);
    await o.c.close();
  }

  /* ── READING A SPLIT: an exercise it cannot place is made, and a line that offers two is a choice ── */
  {
    const read = async (text, save) => {
      const o = await open({});
      const p = o.page;
      await p.click('.lf-bar [data-v="lib"]'); await settle(p);
      await p.click('#lfNewSplit'); await settle(p);
      await p.locator('.lf-sheet').last().locator('#lfSpPaste').fill(text); await p.waitForTimeout(800);
      return o;
    };
    const exs = (p) => p.evaluate(() => (JSON.parse(localStorage.getItem('lift.v1')).ex || []).map((e) => e.n + ':' + e.m));
    {
      const o = await read('Legs\nHip hinge drill 3x10\nSuper strange lift 3x5\nBack squat 4x6');
      const p = o.page, btns = await p.evaluate(() => [...document.querySelectorAll('.lf-sp-mk')].map((b) => b.textContent));
      ok('an exercise it cannot place offers to be made, with its muscle read off the name', btns.join('|') === 'Create · Lower back|Create · Other', btns);
      await p.evaluate(() => document.querySelector('.lf-sp-mk').click()); await p.waitForTimeout(400);
      ok('making it puts it in the library and matches the row to it', (await exs(p)).join() === 'Hip hinge drill:Lower back' && await p.locator('.lf-sp-mk').count() === 1, await exs(p));
      await p.locator('.lf-sheet').last().locator('#lfSpN').fill('Test split'); await p.locator('.lf-sheet').last().locator('#lfSpSave').click(); await p.waitForTimeout(900);
      ok('saving the split keeps it', (await exs(p)).join() === 'Hip hinge drill:Lower back', await exs(p));
      await o.c.close();
    }
    {
      const o = await read('Legs\nHip hinge drill 3x10\nBack squat 4x6');
      const p = o.page;
      await p.evaluate(() => document.querySelector('.lf-sp-mk').click()); await p.waitForTimeout(400);
      await p.locator('.lf-sheet').last().locator('.lf-x').first().click(); await p.waitForTimeout(700);
      ok('closing the split without saving takes what was made for it out of the library again', (await exs(p)).length === 0, await exs(p));
      await o.c.close();
    }
    {
      const o = await read('Legs\nLying hamstring curls or seated hamstring curls 3x10\nLying / seated hamstring curls 3x8\nFoo bar or Baz lift 3x10\nBack squat 4x6');
      const p = o.page;
      const rows = await p.evaluate(() => [...document.querySelectorAll('.lf-sp-day .lf-li')].map((r) => ({ t: r.querySelector('b').textContent, ch: [...r.querySelectorAll('.lf-sp-ab')].map((b) => b.textContent) })));
      ok('a line offering two exercises is a choice of those two, said once and said by a slash', rows[0].ch.join('|') === 'Lying leg curls|Seated leg curls' && rows[1].ch.join('|') === 'Lying leg curls|Seated leg curls', rows);
      ok('a half it does not know is offered to be made', rows[2].ch.length === 2 && rows[2].ch.every((c) => /^\+ /.test(c)), rows[2]);
      await p.evaluate(() => document.querySelectorAll('.lf-sp-ab')[1].click()); await p.waitForTimeout(400);
      const after = await p.evaluate(() => [...document.querySelectorAll('.lf-sp-day .lf-li b')].map((b) => b.textContent));
      ok('picking one settles the row on it', after[0] === 'Seated leg curls', after);
      await p.evaluate(() => document.querySelector('.lf-sp-ab.is-new').click()); await p.waitForTimeout(400);
      ok('making the unknown half makes just that exercise', (await exs(p)).length === 1, await exs(p));
      ok('and a name with a slash and nothing known stays one name', await (async () => { const o2 = await read('Legs\nFoo bar / Baz lift 3x10\nBack squat 4x6'); const n = await o2.page.locator('.lf-sp-ab').count(); await o2.c.close(); return n === 0; })());
      await o.c.close();
    }
  }

  /* ── A SPLIT SETS THE WEEK'S GOAL TO ITS DAYS ── */
  {
    const o = await open({ goal: 4, hp: ['ul'] });
    const p = o.page;
    await p.click('.lf-bar [data-v="lib"]'); await settle(p);
    await p.click('#lfNewSplit'); await settle(p);
    await p.locator('.lf-sheet').last().locator('#lfSpPaste').fill('Mon Push\nBench press 4x8\nTue Pull\nBarbell row 4x8\nWed Legs\nBack squat 4x6\nThu Upper\nOverhead press 3x8\nFri Lower\nLeg press 3x10'); await p.waitForTimeout(900);
    const days = await p.locator('.lf-sheet').last().locator('.lf-sp-day').count();
    await p.locator('.lf-sheet').last().locator('#lfSpN').fill('Five days'); await p.locator('.lf-sheet').last().locator('#lfSpSave').click(); await p.waitForTimeout(900);
    const g = await p.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).goal);
    ok('a five day split sets the goal to five instead of leaving it at four', days === 5 && g === 5, [days, g]);
    ok('and the toast says so, with an Undo that puts the goal back', /goal 5 days/.test(await p.locator('.lf-toast').textContent()));
    await p.locator('.lf-toast button').click(); await p.waitForTimeout(500);
    ok('undoing the split puts the goal back to four', (await p.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).goal)) === 4);
    await o.c.close();
  }

  /* ── SAVING TARGETS SAVES WHAT YOU PUT ── */
  {
    const mine = [['Quads', 18, 18], ['Hamstrings', 9, 9], ['Calves', 15, 15], ['Glutes', 7, 7], ['Chest', 12, 12], ['Back', 12, 16], ['Shoulders', 20, 20]];
    const o = await open({ focus: focus(mine) });
    const p = o.page, saved = () => p.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).focus.filter((f) => !f.a).map((f) => f.m + ':' + f.lo + '-' + f.hi).join(' '));
    await p.click('.lf-bar [data-v="home"]'); await settle(p);
    await p.click('#lfTgEdit'); await settle(p);
    const shown = await p.evaluate(() => [...document.querySelectorAll('#lfZnRows .lf-zr')].map((r) => r.querySelector('.lf-zr-l span').textContent + ':' + r.querySelector('b').textContent).filter((x) => !/Rear|Lower/.test(x)).join(' '));
    ok('the sheet opens on the targets you saved, not on the suggestion', shown === 'Quads:18 Hamstrings:9 Calves:15 Glutes:7 Chest:12 Back:12 Shoulders:20', shown);
    ok('and no Back to the suggestion button is offered before you have touched anything', await p.locator('#lfZnBack').isHidden());
    await p.evaluate(() => { const r = [...document.querySelectorAll('#lfZnRows .lf-zr')].find((x) => /Glutes/.test(x.textContent)); const i = r.querySelector('input'); i.value = 10; i.dispatchEvent(new Event('input', { bubbles: true })); });
    await p.waitForTimeout(200);
    await p.click('#lfZnSave'); await settle(p);
    ok('changing one figure changes that one: the others are as saved, and a range you did not touch is still a range', await saved() === 'Quads:18-18 Hamstrings:9-9 Calves:15-15 Glutes:10-10 Chest:12-12 Back:12-16 Shoulders:20-20', await saved());
    await p.click('#lfTgEdit'); await settle(p);
    await p.click('#lfZnSeg button >> nth=1'); await p.waitForTimeout(200);
    await p.click('#lfZnSave'); await settle(p);
    const z = await saved();
    ok('pressing How hard is the one thing that puts the suggestions over all of them', z !== 'Quads:18-18 Hamstrings:9-9 Calves:15-15 Glutes:10-10 Chest:12-12 Back:12-16 Shoulders:20-20' && /Back:\d+-\d+/.test(z) && !/Back:12-16/.test(z), z);
    await o.c.close();
  }

  /* ── THE MONTH WRAPPED: a story of the month, and the same story is the video ── */
  {
    const days = [1, 2, 4, 5, 7, 8, 10, 11, 13, 15, 16, 18, 20, 21, 23, 25, 27];
    const wo = days.map((n, i) => { const d = '2026-10-' + String(n).padStart(2, '0'), s = new Date(2026, 9, n, 18).getTime(); return { id: 'w' + i, d, s, e: s + 60 * 60000, n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60 + i * 2, r: 8 }, { w: 60 + i * 2, r: 8 }] }, { id: 'curl', n: 'Dumbbell curl', sets: [{ w: 14, r: 10 }] }] }; });
    const o = await open({ wo, goal: 3 }, '2026-11-01T10:00:00');
    const p = o.page;
    await p.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    const cvs = '#lfMonthSum canvas';
    ok('it opens on its own on the first, as a canvas story of 1080 by 1920 with a card for the days, the time, what went up, the sets and the end', await p.evaluate((s) => { const c = document.querySelector(s); return !!c && c.width === 1080 && c.height === 1920 && c.dataset.slides === '5'; }, cvs));
    ok('it is read out as words too: the days, the average, what went up', await p.evaluate(() => { const t = document.querySelector('#lfMonthSum .lf-mw-sr').textContent; return /October wrapped/.test(t) && /17 of 31 days/.test(t) && /Average session 60 minutes/.test(t) && /Up most on .*bench press/i.test(t); }));
    await p.waitForTimeout(3200);
    /* the calendar: 1 October 2026 is a Thursday, so the first cell sits in the fourth column; 1 is a day you trained and 3 is not */
    const px = (x, y) => p.evaluate(([s, x, y]) => Array.from(document.querySelector(s).getContext('2d').getImageData(x, y, 1, 1).data), [cvs, x, y]);
    const lit = await px(70 + 3 * 136 + 20, 790 + 20), rest = await px(70 + 5 * 136 + 20, 790 + 20);
    ok('the calendar lights the days you trained and leaves the others dark', lit[0] > 200 && rest[0] < 60, { lit, rest });
    ok('and the count under the title is the days that lit', await p.evaluate(() => /17/.test(document.querySelector('#lfMonthSum .lf-mw-sr').textContent)));
    const idx = () => p.evaluate((s) => +document.querySelector(s).dataset.slide, cvs);
    ok('it starts on the first card', await idx() === 0);
    const r = await p.locator('#lfMonthSum .lf-mw-st').boundingBox();
    await p.mouse.click(r.x + r.width * 0.8, r.y + r.height / 2); await p.waitForTimeout(150);
    ok('a press on the right goes on to the next card', await idx() === 1);
    await p.mouse.click(r.x + r.width * 0.1, r.y + r.height / 2); await p.waitForTimeout(150);
    ok('and a press on the left goes back', await idx() === 0);
    await p.waitForTimeout(6600);
    ok('left alone it plays on by itself', await idx() >= 1, await idx());
    await p.click('#lfMoShare'); await settle(p);
    ok('Share video makes the whole story, not a card: it is over twenty seconds long', await p.evaluate(() => window.lfCardLast && window.lfCardLast.ms > 20000 && window.lfCardLast.w === 1080 && window.lfCardLast.h === 1920), await p.evaluate(() => window.lfCardLast));
    await p.keyboard.press('Escape'); await settle(p);
    await p.click('#lfMoDone'); await settle(p);
    ok('Done puts it away: it is built and removed, not hidden', await p.locator('#lfMonthSum').count() === 0);
    await o.c.close();
  }
  {
    const mk = (cdm) => [1, 8, 15, 22].map((n, i) => ({ id: 'c' + i, d: '2026-10-' + String(n).padStart(2, '0'), s: new Date(2026, 9, n, 18).getTime(), e: new Date(2026, 9, n, 19).getTime(), n: 'Push', cd: cdm ? { k: i % 2 ? 'run' : 'bike', m: cdm } : undefined, x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60 + i * 5, r: 8 }] }] }));
    let o = await open({ goal: 3, wo: mk(45) }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('a month with a good amount of cardio gets a card of its own, and it is read out', await o.page.evaluate(() => { const c = document.querySelector('#lfMonthSum canvas'); return c && +c.dataset.slides === 6 && /Cardio: 180 minutes over 4 sessions/.test(document.querySelector('.lf-mw-sr').textContent); }));
    await o.c.close();
    o = await open({ goal: 3, wo: mk(30) }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('a modest amount of cardio is not enough for a card: two hours over four sessions is skipped', await o.page.evaluate(() => { const c = document.querySelector('#lfMonthSum canvas'); return c && +c.dataset.slides === 5 && !/Cardio:/.test(document.querySelector('.lf-mw-sr').textContent); }));
    await o.c.close();
    o = await open({ goal: 3, wo: mk(0) }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('no cardio at all: no cardio card and no mention of it', await o.page.evaluate(() => { const c = document.querySelector('#lfMonthSum canvas'); return c && +c.dataset.slides === 5 && !/ardio/.test(document.querySelector('.lf-mw-sr').textContent); }));
    await o.c.close();
  }
  {
    const s = new Date(2026, 9, 6, 18).getTime();
    const o = await open({ goal: 3, wo: [{ id: 'a', d: '2026-10-06', s: 0, e: 0, n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }] }] }, { id: 'b', d: '2026-10-13', s: 0, e: 0, n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60, r: 8 }] }] }] }, '2026-11-01T10:00:00');
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    ok('a month with no times and nothing that went up skips those cards instead of drawing them empty', await o.page.evaluate(() => { const c = document.querySelector('#lfMonthSum canvas'); return c && +c.dataset.slides < 5 && !/Average session/.test(document.querySelector('.lf-mw-sr').textContent) && !/Up most/.test(document.querySelector('.lf-mw-sr').textContent); }));
    await o.c.close();
  }
  {
    const wo = [1, 8, 15].map((n, i) => ({ id: 'r' + i, d: '2026-10-' + String(n).padStart(2, '0'), s: new Date(2026, 9, n, 18).getTime(), e: new Date(2026, 9, n, 19).getTime(), n: 'Push', x: [{ id: 'bench', n: 'Bench press', sets: [{ w: 60 + i * 5, r: 8 }] }] }));
    const o = await open({ goal: 3, wo }, '2026-11-01T10:00:00', { reducedMotion: 'reduce' });
    await o.page.waitForSelector('#lfMonthSum', { timeout: 9000 }).catch(() => {});
    await o.page.waitForTimeout(2500);
    const idx = () => o.page.evaluate(() => +document.querySelector('#lfMonthSum canvas').dataset.slide);
    ok('with reduced motion it does not play on by itself: it waits on the first card', await idx() === 0);
    const r = await o.page.locator('#lfMonthSum .lf-mw-st').boundingBox();
    await o.page.mouse.click(r.x + r.width * 0.8, r.y + r.height / 2); await o.page.waitForTimeout(150);
    ok('and a press goes on to the next', await idx() === 1);
    await o.c.close();
  }

  /* ── THE FIGHT NAMES: fifteen titles, each earned by a challenge of its own, each with its own motion, and a flair that plays with the name and comes with it ── */
  {
    const ids = ['bxnotorious', 'bxgolden', 'bxhitman', 'bxiceman', 'bxspider', 'bxeagle', 'bxdiamond', 'bxnatural', 'bxphenom', 'bxpredator', 'bxemperor', 'bxstyle', 'bxhighlight', 'bxdeal', 'bxstone'];
    const WORDS = ['The Notorious', 'The Golden Boy', 'The Hitman', 'The Iceman', 'The Spider', 'The Eagle', 'The Diamond', 'The Natural', 'The Phenom', 'The Predator', 'The Last Emperor', 'The Last Stylebender', 'The Highlight', 'The Real Deal', 'Hands of Stone'];
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`try { localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [] }))}); } catch (e) {} window.__lfNoIntro = 1;`);
    const p = await c.newPage(); p.on('pageerror', (e) => errors.push(String(e)));
    await p.route(/\/lift\/(index\.html)?$/, async (r) => { const fs = require('fs'), path = require('path'); let tx = fs.readFileSync(path.join(__dirname, '..', 'lift', 'index.html'), 'utf8'); const i = tx.lastIndexOf('})();'); tx = tx.slice(0, i) + 'window.__tt={lfTitleEl:lfTitleEl,lfNameOn:lfNameOn,RK:RK,RK_TC:RK_TC,lfRkFc:lfRkFc,lfRkName:lfRkName};' + tx.slice(i); r.fulfill({ body: tx, contentType: 'text/html' }); });
    await p.goto(`${BASE}/lift/`); await p.waitForTimeout(700);
    const r = await p.evaluate((ids) => {
      const box = document.createElement('div'); box.style.cssText = 'position:fixed;top:0;left:0'; document.body.appendChild(box);
      const anim = (n) => [...n.querySelectorAll('*'), n].map((q) => [getComputedStyle(q).animationName, getComputedStyle(q, '::before').animationName, getComputedStyle(q, '::after').animationName]).flat().filter((x) => x && x !== 'none').sort().join('+');
      const T = window.__tt, out = { ti: {}, fl: {}, un: {}, col: [], paths: [], words: [] };
      const all = T.RK.fl.map((x) => x[4]);
      ids.forEach((id) => {
        const a = document.createElement('div'); a.className = 'fr-ti'; const te = T.lfTitleEl(id); a.appendChild(te); box.appendChild(a); out.ti[id] = anim(te);
        const nm = document.createElement('b'); nm.textContent = 'Niko'; T.lfNameOn(nm, { fl: 'nf' + id }); box.appendChild(nm); out.fl[id] = anim(nm);
        const ti = T.RK.ti.filter((x) => x[0] === id)[0], fl = T.RK.fl.filter((x) => x[0] === 'nf' + id)[0];
        const bd = ti && /c\.has\.(\w+)/.exec(String(ti[3]));
        out.un[id] = ti && fl && bd && [bd[1], ti[2], fl[2], ti[3]({ has: {} }), ti[3]({ has: { [bd[1]]: 1 } }), fl[3]({ has: {} }), fl[3]({ has: { [bd[1]]: 1 } })];
        out.paths.push(fl ? all.filter((x) => x === fl[4]).length : 0);
        out.words.push(te.textContent.replace(/\u00a0/g, ' ').trim().toLowerCase());
      });
      out.col = T.RK_TC.filter((c) => c[0] === 'nkc').map((c) => ids.filter((i) => c[3].indexOf(i) >= 0).length);
      out.fc = T.lfRkFc()[0][3].filter((i) => ids.some((d) => 'nf' + d === i)).length;
      return out;
    }, ids);
    ok('all fifteen fight names move, and no two do it the same way', ids.every((i) => r.ti[i]) && new Set(ids.map((i) => r.ti[i])).size === 15, r.ti);
    ok('every title reads as its name', JSON.stringify(r.words) === JSON.stringify(WORDS.map((w) => w.toLowerCase())), r.words);
    ok('each comes with a flair that plays with the name, and no two flairs do it the same way', ids.every((i) => r.fl[i]) && new Set(ids.map((i) => r.fl[i])).size === 15 && r.fc === 15, [r.fl, r.fc]);
    ok('and every flair is its own drawing: no other flair shares its picture', r.paths.every((n) => n === 1), r.paths);
    const badges = ids.map((i) => r.un[i] && r.un[i][0]);
    ok('each is earned by a challenge of its own: fifteen different ones', badges.every(Boolean) && new Set(badges).size === 15, badges);
    ok('the title and its flair come from the same challenge: locked without it, unlocked with it', ids.every((i) => r.un[i] && r.un[i][1] === r.un[i][2] && r.un[i][3] === false && r.un[i][4] === true && r.un[i][5] === false && r.un[i][6] === true), r.un);
    ok('they are filed under Challenges', r.col.length === 1 && r.col[0] === 15, r.col);
    await c.close();
  }

  /* ── THE SMALLER MUSCLES INSIDE A TARGET: press a muscle and it opens into the parts doing the work ── */
  {
    const mon = '2026-10-26', d1 = '2026-10-26', d2 = '2026-10-27';
    const SS = (w, n) => Array.from({ length: n }, () => ({ w, r: 10 }));
    const wo = [
      { id: 'a', d: d1, s: 1, e: 2, n: 'Legs', x: [{ id: 'squat', n: 'Barbell squat', sets: SS(80, 4) }, { id: 'hipthrust', n: 'Hip thrusts', sets: SS(80, 4) }, { id: 'legpress', n: 'Leg press', sets: SS(120, 2) }] },
      { id: 'b', d: d2, s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Barbell bench press', sets: SS(60, 4) }, { id: 'inclbb', n: 'Incline barbell press', sets: SS(50, 3) }, { id: 'dips', n: 'Dips', sets: SS(0, 2) }] },
    ];
    const o = await open({ wo });
    const p = o.page;
    await p.click('.lf-bar [data-v="home"]'); await settle(p);
    const rowsOf = (m) => p.evaluate((m) => [...document.querySelectorAll('#lfLegs .lf-vr[data-m="' + m + '"] + .lf-sub .lf-sb')].map((r) => r.dataset.k + '=' + r.querySelector('em').textContent), m);
    ok('nothing is open until you press a muscle', await p.locator('#lfLegs .lf-sub').count() === 0 && await p.getAttribute('#lfLegs .lf-vr[data-m="Glutes"]', 'aria-expanded') === 'false');
    await p.click('#lfLegs .lf-vr[data-m="Glutes"]'); await settle(p);
    const g = await rowsOf('Glutes');
    ok('Glutes opens into glute max, glute med and min, and adductors', g.length === 3 && /^Glute max=/.test(g[0]) && /^Glute med\/min=/.test(g[1]) && /^Adductors=/.test(g[2]), g);
    ok('and the adductors show what squatting and pressing give them, as indirect sets', /^Adductors=3 indirect$/.test(g[2]), g);
    ok('the hip thrusts are glute max, and the glute max figure carries the squats as indirect', /^Glute max=7 \(3 indirect\)$/.test(g[0]), g);
    ok('it is a button that says it is open', await p.getAttribute('#lfLegs .lf-vr[data-m="Glutes"]', 'aria-expanded') === 'true');
    await p.click('#lfLegs .lf-vr[data-m="Chest"]'); await settle(p);
    const c = await rowsOf('Chest');
    ok('Chest splits by the kind of press: incline is upper, flat is mid, dips are lower', JSON.stringify(c) === JSON.stringify(['Upper chest=3', 'Mid chest=4', 'Lower chest=2']), c);
    ok('both can be open at once, and the bars above are untouched by it', await p.locator('#lfLegs .lf-sub').count() === 2 && /\/ /.test(await p.textContent('#lfLegs .lf-vr[data-m="Chest"] em')));
    await p.click('#lfLegs .lf-vr[data-m="Glutes"]'); await settle(p);
    ok('pressing it again takes it away, built and removed rather than hidden', await p.locator('#lfLegs .lf-vr[data-m="Glutes"] + .lf-sub').count() === 0 && await p.locator('#lfLegs .lf-sub').count() === 1 && await p.getAttribute('#lfLegs .lf-vr[data-m="Glutes"]', 'aria-expanded') === 'false');
    await p.click('#lfLegs .lf-sub .lf-sb-f button'); await settle(p);
    ok('Edit target inside it opens that muscle\'s target', await p.locator('.lf-sheet').last().locator('#lfFoLo').count() === 1);
    await p.keyboard.press('Escape'); await settle(p);
    ok('a muscle with no parts to show still opens its target on a press', await (async () => { await p.click('#lfLegs .lf-vr[data-m="Quads"]'); await settle(p); const n = await p.locator('.lf-sheet').last().locator('#lfFoLo').count(); await p.keyboard.press('Escape'); await settle(p); return n === 1; })());
    await o.c.close();
  }

  /* ── THE VOLUME CHECK: every muscle is judged against its own range, worked out, never a fixed line of text ── */
  {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`try { localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [], prog: 'ul', xp: 'adv', zn: 1 }))}); } catch (e) {} window.__lfNoIntro = 1;`);
    const p = await c.newPage(); p.on('pageerror', (e) => errors.push(String(e)));
    await p.route(/\/lift\/(index\.html)?$/, async (r) => { const fs = require('fs'), path = require('path'); let tx = fs.readFileSync(path.join(__dirname, '..', 'lift', 'index.html'), 'utf8'); const i = tx.lastIndexOf('})();'); tx = tx.slice(0, i) + 'window.__vv={S:S,lfVolAssess:lfVolAssess,lfVolRange:lfVolRange,lfVolWeek:lfVolWeek,lfVolPlan:lfVolPlan,zVal:zVal,zRec:zRec};' + tx.slice(i); r.fulfill({ body: tx, contentType: 'text/html' }); });
    await p.goto(`${BASE}/lift/`); await p.waitForTimeout(700);
    const asses = (m, v, o) => p.evaluate(([m, v, o]) => { const V = window.__vv; if (o.xp) V.S.xp = o.xp; const prog = V.lfVolWeek(); return V.lfVolAssess(m, v, Object.assign({ zn: 1, pri: false, prog }, o)); }, [m, v, o || {}]);
    const SCREEN = { Quads: 19, Hamstrings: 20, Calves: 20, Glutes: 19, Abs: 20, Chest: 19, Back: 20, Triceps: 19, Biceps: 19, 'Rear delts': 20, 'Lower back': 20 };
    const all = {}; for (const m of Object.keys(SCREEN)) all[m] = await asses(m, SCREEN[m], { xp: 'adv' });
    const st = Object.keys(all).map((m) => all[m].status), tx = Object.keys(all).map((m) => all[m].say.t);
    ok('the eleven targets on your screen do not all get the same message: they are judged one by one', new Set(st).size >= 3 && new Set(tx).size >= 3, Object.keys(all).map((m) => m + ' ' + SCREEN[m] + ' ' + all[m].status));
    ok('each muscle has its own range, and the ranges differ: back takes more than glutes, lower back about half of chest', all.Back.hi > all.Glutes.hi && all['Lower back'].hi < all.Chest.hi && new Set(Object.keys(all).map((m) => all[m].lo + '-' + all[m].hi)).size >= 5, Object.keys(all).map((m) => m + ' ' + all[m].lo + '-' + all[m].hi));
    ok('the same 20 sets is within range for back, very high for hamstrings and calves, and potentially excessive for lower back', all.Back.status === 'within' && all.Hamstrings.status === 'vhigh' && all.Calves.status === 'vhigh' && all['Lower back'].status === 'excess', ['Back', 'Hamstrings', 'Calves', 'Lower back'].map((m) => m + ' ' + all[m].status));
    ok('19 quads and 19 chest are only high, not very high, because their ranges are higher', all.Quads.status === 'high' && all.Chest.status === 'high' && all.Glutes.status === 'vhigh', [all.Quads.status, all.Chest.status, all.Glutes.status]);
    ok('and there is no generic "perfect for growth" anywhere in the app', !/Perfect for growth/.test(require('fs').readFileSync(require('path').join(__dirname, '..', 'lift', 'index.html'), 'utf8')));
    /* the statuses, in order, for one muscle: below, within, high, very high, excessive */
    const ladder = []; for (const v of [3, 5, 13, 18, 19, 22, 26]) ladder.push((await asses('Chest', v, { xp: 'adv' })).status);
    ok('one muscle walks through the statuses as its target rises: very low and below, within, high, very high, excessive', ladder.join() === 'below,below,within,within,high,vhigh,excess', ladder);
    ok('a short, different sentence for each', (await asses('Chest', 5, { xp: 'adv' })).say.t === 'Below recommended volume.' && (await asses('Chest', 13, { xp: 'adv' })).say.t === 'Within recommended range.' && (await asses('Chest', 19, { xp: 'adv' })).say.t === 'High weekly volume.' && /Very high volume\. Consider recovery/.test((await asses('Chest', 21, { xp: 'adv' })).say.t) && /Potentially excessive/.test((await asses('Chest', 26, { xp: 'adv' })).say.t) && (await asses('Chest', 3, { xp: 'adv' })).say.t === 'Very low volume.');
    /* how long you have trained moves every range */
    const nb = await asses('Chest', 13, { xp: 'new' }), ad = await asses('Chest', 13, { xp: 'adv' });
    ok('how long you have trained moves the range: 13 chest sets is high for a beginner and within range for an experienced lifter', nb.status !== 'within' && ad.status === 'within' && nb.hi < ad.hi, [nb.status, nb.lo + '-' + nb.hi, ad.status, ad.lo + '-' + ad.hi]);
    /* the mode moves it too */
    const mn = await asses('Chest', 13, { xp: 'adv', zn: 0 }), pu = await asses('Chest', 19, { xp: 'adv', zn: 2 }), bu = await asses('Chest', 19, { xp: 'adv', zn: 1 }), pp = await asses('Chest', 19, { xp: 'adv', zn: 2, pri: true });
    ok('Maintain judges against a maintenance range: 13 chest sets is above it, and the wording says maintenance', ['high', 'vhigh'].indexOf(mn.status) >= 0 && mn.hi < ad.hi && (await asses('Chest', 7, { xp: 'adv', zn: 0 })).say.t === 'Within maintenance range.', [mn.status, mn.lo + '-' + mn.hi]);
    ok('Push moves the range up: the same 19 chest sets is high on Build and within range on Push, and a priority muscle on Push has room beyond that', bu.status === 'high' && pu.status === 'within' && pp.hi === pu.hi + 2, [bu.status, pu.status, pu.hi, pp.hi]);
    /* the target is not the programme */
    const w = await p.evaluate(() => { const V = window.__vv, a = V.lfVolWeek({ Chest: 12 }), b = V.lfVolWeek({ Chest: 20 }); return { lo: a.Chest, hi: b.Chest, tri: [a.Triceps, b.Triceps] }; });
    ok('the programme is worked out separately from the target and moves with it: more chest asked of the week gives the chest more sets', w.hi.d > w.lo.d && w.lo.d >= 0, w);
    ok('effective volume is direct plus half the indirect, once', Math.abs(w.hi.eff - (w.hi.d + w.hi.i * 0.5)) < 1e-9 && w.hi.i >= 0, w.hi);
    ok('and it leaves the saved targets alone while it works', await p.evaluate(() => { const V = window.__vv; const before = JSON.stringify(V.S.focus); V.lfVolWeek({ Chest: 3, Back: 3 }); return JSON.stringify(V.S.focus) === before; }));
    /* the screen: statuses are drawn from all that, live */
    const o2 = await open({ prog: 'ul', xp: 'adv', zn: 1, focus: Object.keys(SCREEN).map((m) => ({ m, lo: SCREEN[m], hi: SCREEN[m], p: 0 })) });
    const q = o2.page;
    await q.click('.lf-bar [data-v="home"]'); await settle(q); await q.click('#lfTgEdit'); await settle(q);
    const rows = await q.evaluate(() => [...document.querySelectorAll('#lfZnRows .lf-zr')].map((r) => ({ m: r.querySelector('.lf-zr-l span').textContent, s: r.dataset.status, r: r.dataset.range, t: r.querySelector('.lf-vnt').textContent })));
    ok('on the actual screen the muscles show different statuses, each from its own range', new Set(rows.map((x) => x.s)).size >= 3 && new Set(rows.map((x) => x.t)).size >= 3 && rows.every((x) => x.t && x.r), rows.map((x) => x.m + ' ' + x.s + ' ' + x.r));
    ok('and each shows one short line, never a paragraph', rows.every((x) => x.t.length < 50) && await q.locator('#lfZnRows .lf-vnt').count() === rows.length);
    const move = async (m, v) => q.evaluate(([m, v]) => { const r = [...document.querySelectorAll('#lfZnRows .lf-zr')].find((x) => x.querySelector('.lf-zr-l span').textContent === m); const i = r.querySelector('input'); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, [m, v]);
    const rowOf = (m) => q.evaluate((m) => { const r = [...document.querySelectorAll('#lfZnRows .lf-zr')].find((x) => x.querySelector('.lf-zr-l span').textContent === m); return { s: r.dataset.status, t: r.querySelector('.lf-vnt').textContent, zone: r.querySelector('.zo').style.width, eff: r.dataset.eff }; }, m);
    const sumBefore = await q.textContent('#lfVolSay'), cb = await rowOf('Chest'), hb = await rowOf('Hamstrings');
    await move('Chest', 10); await q.waitForTimeout(150);
    const ca = await rowOf('Chest'), ha = await rowOf('Hamstrings');
    ok('moving a slider updates that muscle at once: its status, its text and the programme under it', ca.s !== cb.s && ca.t !== cb.t && ca.s === 'below' && ca.eff !== cb.eff, [cb, ca]);
    ok('and the overall summary changes with it, without saving anything', (await q.textContent('#lfVolSay')) !== sumBefore && await q.evaluate(() => JSON.parse(localStorage.getItem('lift.v1')).focus.filter((f) => f.m === 'Chest')[0].lo) === 19);
    ok('muscles that were not touched keep their own assessment', ha.s === hb.s && ha.t === hb.t);
    await q.click('#lfZnSeg button >> nth=2'); await q.waitForTimeout(200);
    const pr = await rowOf('Chest');
    ok('changing the mode re-judges every muscle: Push has its own ranges', pr.zone !== ca.zone || pr.s !== ca.s);
    await q.locator('#lfZnRows .lf-vnt').first().click(); await q.waitForTimeout(150);
    ok('a detailed explanation is behind a tap, and only then: range, direct, indirect and effective', await q.locator('#lfZnRows .lf-vnd').count() === 1 && /Range \d+.\d+\. The exercises give it .* effective\./.test(await q.textContent('#lfZnRows .lf-vnd')));
    await q.locator('#lfZnRows .lf-vnt').first().click(); await q.waitForTimeout(150);
    ok('and a second tap puts it away', await q.locator('#lfZnRows .lf-vnd').count() === 0);
    ok('a preset alone is not Custom', await q.isHidden('#lfZnCus'));
    await move('Chest', 12); await q.waitForTimeout(150);
    ok('moving a slider makes the targets Custom on its own: a small tag, no extra step', await q.isVisible('#lfZnCus'));
    await q.click('#lfZnBack'); await q.waitForTimeout(200);
    ok('Back to the suggestion restores the preset and the Custom tag goes', await q.isHidden('#lfZnCus'));
    await q.click('#lfZnSeg button >> nth=1'); await q.waitForTimeout(150);
    ok('there is no Optimise button: the modes are the only options', await q.evaluate(() => !/Optimise for me/.test(document.body.innerHTML)));
    await move('Chest', 24); await q.waitForTimeout(150);
    await q.click('#lfZnSave'); await settle(q);
    ok('Save writes what the sheet holds, remembered as Custom, and reopening still says so with your figure', await q.evaluate(() => { const o = JSON.parse(localStorage.getItem('lift.v1')); return o.zc === 1 && o.focus.filter((f) => f.m === 'Chest')[0].lo === 24; }) && await (async () => { await q.click('#lfTgEdit'); await settle(q); const v = await q.isVisible('#lfZnCus'); const ch = await q.evaluate(() => [...document.querySelectorAll('#lfZnRows .lf-zr')].find((x) => /Chest/.test(x.textContent)).querySelector('b').textContent); await q.keyboard.press('Escape'); await settle(q); return v && ch === '24'; })());
    await o2.c.close();
    await c.close();
  }

  /* ── THE BADGE SHELF IS OPEN: every collection is open to begin with, and only the ones you put away stay away ── */
  {
    const o = await open({ wo: [{ id: 'a', d: '2026-10-26', s: 1, e: 2, n: 'Push', x: [{ id: 'bench', n: 'Bench', sets: [{ w: 60, r: 8 }] }] }] });
    const p = o.page;
    await p.click('.lf-bar [data-v="you"]'); await settle(p);
    await p.click('#lfBadges'); await settle(p);
    const st = () => p.evaluate(() => [...[...document.querySelectorAll('.lf-sheet')].pop().querySelectorAll('.lf-bcol')].map((h) => ({ k: h.dataset.col, open: h.querySelector('.lf-bcol-b').getAttribute('aria-expanded') === 'true', shown: !document.getElementById('lfBg' + h.dataset.col).hidden })));
    const a0 = await st();
    ok('every collection on the badge shelf is open when you first see it, and its badges are showing', a0.length >= 10 && a0.every((x) => x.open && x.shown), a0.filter((x) => !x.open || !x.shown));
    await p.evaluate(() => [...document.querySelectorAll('.lf-sheet')].pop().querySelector('.lf-bcol[data-col="vol"] .lf-bcol-b').click()); await p.waitForTimeout(200);
    const a1 = await st();
    ok('putting one away shuts just that one', a1.filter((x) => !x.open).map((x) => x.k).join() === 'vol' && a1.filter((x) => x.open).length === a0.length - 1, a1.filter((x) => !x.open));
    ok('and it stays put away across a reload, while the rest are still open', await (async () => { await p.reload(); await p.waitForTimeout(700); await p.click('.lf-bar [data-v="you"]'); await settle(p); await p.click('#lfBadges'); await settle(p); const a2 = await st(); return a2.filter((x) => !x.open).map((x) => x.k).join() === 'vol'; })());
    await o.c.close();
  }

  /* ── THE MACHINE BEHIND THE TARGETS: which exercise a muscle is offered, chosen from the whole week ── */
  {
    const c = await browser.newContext(PHONE);
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
    await c.addInitScript(`try { localStorage.setItem('lift.v1', ${JSON.stringify(JSON.stringify({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [], prog: 'ul', xp: 'some' }))}); } catch (e) {} window.__lfNoIntro = 1;`);
    const p = await c.newPage(); p.on('pageerror', (e) => errors.push(String(e)));
    await p.route(/\/lift\/(index\.html)?$/, async (r) => { const fs = require('fs'), path = require('path'); let tx = fs.readFileSync(path.join(__dirname, '..', 'lift', 'index.html'), 'utf8'); const i = tx.lastIndexOf('})();'); tx = tx.slice(0, i) + 'window.__mm={S:S,lfFitPick:lfFitPick,lfFitMap:lfFitMap,lfPat:lfPat,lfProg:lfProg,lfWithKeep:lfWithKeep,EX_HALF:EX_HALF,exById:exById};' + tx.slice(i); r.fulfill({ body: tx, contentType: 'text/html' }); });
    await p.goto(`${BASE}/lift/`); await p.waitForTimeout(700);
    const pick = (m, day, week, o) => p.evaluate(([m, day, week, o]) => { const M = window.__mm; M.S.zn = o.zn === undefined ? 1 : o.zn; M.S.xp = o.xp || 'some'; const w = {}; const id = M.lfFitPick(m, day, week, w); return { id, p: id ? M.lfPat(id) : '', why: w }; }, [m, day, week, o || {}]);
    /* 1: bench and incline are there, chest is short */
    const t1 = await pick('Chest', [], ['bench', 'incdb']);
    ok('with a flat press and an incline press already in the week, chest is offered a fly rather than another press', t1.p === 'chiso' && t1.why.iso && t1.why.comp, t1);
    /* 7: several presses that overlap */
    const t7 = await pick('Chest', [], ['bench', 'dbbench', 'mchest', 'incdb']);
    ok('three flat presses already in the week: what is offered is not a fourth', t7.p !== 'hpush' && t7.id, t7);
    const full = await pick('Calves', [], ['calfstand', 'calf', 'calfseat', 'smithcalf']);
    ok('when every pattern is already covered, nothing is offered rather than a duplicate', full.id === '', full);
    const gap = await pick('Hamstrings', [], ['seatcurl', 'lyingcurl']);
    ok('a missing pattern is filled first: two leg curls and no hinge gets a hinge', gap.p === 'hinge' && gap.why.miss, gap);
    /* 5: Maintain */
    ok('Maintain offers no extra exercise at all', (await pick('Chest', [], ['bench'], { zn: 0 })).id === '');
    /* 3: experience changes what is offered */
    const nb = await pick('Chest', ['incdb', 'incmach'], ['bench', 'pecdeck'], { xp: 'new' }), ex = await pick('Chest', ['incdb', 'incmach'], ['bench', 'pecdeck'], { xp: 'adv' });
    ok('a beginner is offered the simpler version of the same pattern, a machine before a barbell', nb.p === 'ipush' && !/barbell/i.test(nb.id + ' ' + nb.p) && nb.id !== ex.id && ex.id === 'inclbb', [nb, ex]);
    /* 2: the week's indirect work counts */
    const t2 = await p.evaluate(() => {
      const M = window.__mm, P = M.lfProg(); let dir = 0, ind = 0;
      P.days.forEach((d0) => { if (d0.choice) return; const d = M.lfWithKeep(d0); d.ex.forEach((id) => { const g = d.tg && d.tg[id], x = M.exById(id); if (!g || !x) return; if (x.m === 'Biceps') dir += g[0]; else if (M.EX_HALF[id] === 'Biceps') ind += g[0]; }); });
      M.S.zn = 1;
      const run = (lo) => { M.S.focus = [{ m: 'Biceps', lo, hi: lo, p: 0 }]; const f = M.lfFitMap(); let n = 0, ch = false; Object.keys(f.days).forEach((k) => Object.keys(f.days[k]).forEach((id) => { const r = f.days[k][id]; if (r.m === 'Biceps') { n += r.n; ch = ch || r.n !== r.was; } })); return { n, ch }; };
      return { dir, ind, met: run(dir + Math.round(ind / 2)), low: run(dir) };
    });
    ok('rows and pulldowns count toward biceps: a target the week meets with them changes nothing', t2.ind > 0 && !t2.met.ch, t2);
    ok('and a target equal to the direct sets alone is already beaten by the indirect half, so biceps work is trimmed rather than added', t2.low.ch && t2.low.n < t2.dir, t2);
    /* 6: priority in Push takes a second exercise, Build one */
    const t6 = await p.evaluate(() => { const M = window.__mm; const run = (zn, pri) => { M.S.zn = zn; M.S.focus = [{ m: 'Glutes', lo: 24, hi: 24, p: pri }]; const f = M.lfFitMap(); return [].concat(...Object.values(f.extra)).filter((x) => x.m === 'Glutes').map((x) => M.lfPat(x.id)); }; return { build: run(1, 1), push: run(2, 1), pushNo: run(2, 0) }; });
    ok('in Push a priority muscle can be offered a second exercise, in a different pattern; Build and a non-priority get one', t6.push.length === 2 && new Set(t6.push).size === 2 && t6.build.length === 1 && t6.pushNo.length === 1, t6);
    /* 8: something you add changes what is offered */
    const t8 = await p.evaluate(() => { const M = window.__mm; M.S.zn = 1; M.S.focus = [{ m: 'Glutes', lo: 24, hi: 24, p: 0 }]; const a = [].concat(...Object.values(M.lfFitMap().extra)).map((x) => x.id); const d = M.lfProg().days.filter((x) => !x.choice)[0]; M.S.keep = { [d.id]: [[a[0], 3]] }; const b = [].concat(...Object.values(M.lfFitMap().extra)).map((x) => x.id); delete M.S.keep; return { a, b }; });
    ok('an exercise you keep in the program is part of the week straight away: it is not offered again', t8.a.length && t8.b.indexOf(t8.a[0]) < 0, t8);
    await c.close();
  }

  ok('no page errors', errors.length === 0, errors.slice(0, 3));
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
