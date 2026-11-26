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
const BASE_TG = [['Quads', 16], ['Hamstrings', 14], ['Calves', 15], ['Glutes', 6], ['Chest', 16], ['Back', 16], ['Shoulders', 16], ['Triceps', 10], ['Biceps', 10], ['Abs', 11]];
/* which exercises of the seeded program are which muscle, by the names the days print */
const HAM = ['Romanian deadlift', 'Seated leg curls', 'Lying leg curls'];
const CHEST = ['Incline dumbbell press', 'Cable chest flyes', 'Dumbbell bench press', 'Pec deck'];

(async () => {
  const browser = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const errors = [];

  async function open(seed) {
    const c = await browser.newContext(PHONE);
    seed = Object.assign({ unit: 'kg', goal: 3, tour: true, wkSum: '9999-12-31', wkDone: '9999-12-31', wo: [], prog: 'ul' }, seed || {});
    await c.addInitScript(freeze('2026-10-30T18:00:00'));
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
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 14] : r))) });
    const ds = await days(o.page);
    ok('a target the program already meets changes nothing: no notes and every row as written', notes(ds).length === 0 && JSON.stringify(rowsOf(ds).map((r) => r.sets)) === JSON.stringify(rowsOf(base).map((r) => r.sets)), notes(ds));
    await o.c.close();
  }
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 12, 16] : r))) });
    const ds = await days(o.page);
    ok('a range the program sits inside leaves it alone', notes(ds).length === 0 && sumOf(ds, HAM) === baseHam, [notes(ds).length, sumOf(ds, HAM)]);
    await o.c.close();
  }

  /* ── LOWER ── */
  {
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Hamstrings' ? ['Hamstrings', 7] : r))) });
    const ds = await days(o.page), s = sumOf(ds, HAM), n = notes(ds).filter((r) => HAM.indexOf(r.n) >= 0);
    ok('lowering hamstrings to 7 takes the week down towards it', s < baseHam && s >= 7, [baseHam, s]);
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
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Glutes' ? ['Glutes', 14] : r))) });
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
    const o = await open({ focus: focus(BASE_TG.map((r) => (r[0] === 'Glutes' ? ['Glutes', 14] : r))) });
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

  ok('no page errors', errors.length === 0, errors.slice(0, 3));
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
