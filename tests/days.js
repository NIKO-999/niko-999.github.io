/* ═══════════════════════════════════════════════════════════════
   DAYS — what the move and the colours actually did.

   habits.js and reminders.js cover the two screens' behaviour; they
   were written against the ledger and now run against this app
   unchanged, which is the point. This file covers only what is new:
   the order, the list being code rather than data, the colours being
   measurably apart, and the glow being gone.
   ═══════════════════════════════════════════════════════════════ */
const { open, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

/* Lab, so "these two are different colours" is measured the way an eye
   measures it and not by comparing hex strings. */
const lab = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  const [R, G, B] = [f(r), f(g), f(b)];
  let X = (R * .4124 + G * .3576 + B * .1805) / .95047;
  let Y = R * .2126 + G * .7152 + B * .0722;
  let Z = (R * .0193 + G * .1192 + B * .9505) / 1.08883;
  const g2 = (t) => (t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  [X, Y, Z] = [g2(X), g2(Y), g2(Z)];
  return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
};
const parse = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
const dE = (a, b) => Math.hypot(...lab(parse(a)).map((v, i) => v - lab(parse(b))[i]));

const HABITS = ['wake', 'workout', 'abs', 'walk', 'water', 'read'];
const SPLITS = ['push', 'pull', 'legs', 'rest'];

(async () => {
  for (const scheme of ['dark', 'light']) {
    const { browser, page, errs } = await open({ colorScheme: scheme });
    await page.goto(`${BASE}/days/`, { waitUntil: 'networkidle' });
    console.log(`\n── ${scheme} ──`);

    /* ── the order of the day ── */
    if (scheme === 'dark') {
      ok('the order is the order of the day', await page.$$eval('.hb-nm b',
        (ns) => ns.map((n) => n.textContent).join('|'))
        === 'Wake up|Workout|Abs|Morning walk|Water|Reading');
      ok('and the wake-up carries its hour', await page.$$eval('.hb-nm em',
        (ns) => ns.map((n) => n.textContent)).then((v) => v.includes('6am')));
    }

    /* ── colour says WHICH, never whether ──
       Resolved through a probe element rather than read as a token
       string, because a token may be any notation and the eye sees the
       computed one. */
    const col = await page.evaluate(({ habits, splits }) => {
      const cs = getComputedStyle(document.documentElement);
      const probe = (v) => {
        const d = document.createElement('div');
        d.style.color = v; document.body.appendChild(d);
        const c = getComputedStyle(d).color; d.remove(); return c;
      };
      const out = {};
      for (const h of habits) out['h-' + h] = probe(cs.getPropertyValue('--h-' + h).trim());
      for (const s of splits) out['sp-' + s] = probe(cs.getPropertyValue('--sp-' + s).trim());
      return out;
    }, { habits: HABITS, splits: SPLITS });

    ok('every habit has a colour', HABITS.every((h) => /^rgb/.test(col['h-' + h] || '')), col);

    /* The four split colours are on this same screen, so a habit that
       matches one of them makes teal mean "push" in a column where it
       already means "walk". */
    let worstSplit = { d: 99 };
    for (const h of HABITS) for (const s of SPLITS) {
      const d = dE(col['h-' + h], col['sp-' + s]);
      if (d < worstSplit.d) worstSplit = { d, h, s };
    }
    ok('no habit collides with a split colour', worstSplit.d >= 12,
      `${worstSplit.h}/${worstSplit.s} ΔE ${worstSplit.d.toFixed(1)}`);

    let worstPair = { d: 99 };
    for (const a of HABITS) for (const b of HABITS) {
      if (a >= b) continue;
      const d = dE(col['h-' + a], col['h-' + b]);
      if (d < worstPair.d) worstPair = { d, a, b };
    }
    ok('and no two habits are the same colour', worstPair.d >= 14,
      `${worstPair.a}/${worstPair.b} ΔE ${worstPair.d.toFixed(1)}`);

    /* Never an accent: the accent moves with the palette, and a habit
       that changes colour with the backdrop is not one you recognise. */
    const accent = await page.evaluate(() => {
      const d = document.createElement('div');
      d.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c;
    });
    ok('and none of them is the accent',
      HABITS.every((h) => dE(col['h-' + h], accent) > 10));

    await browser.close();
    if (errs.length) ok('no page errors', false, errs);
  }

  /* ── the glow is gone, and the chosen split is not the lit one ── */
  const { browser, page, errs } = await open({ colorScheme: 'dark' });
  await page.goto(`${BASE}/days/`, { waitUntil: 'networkidle' });
  console.log('\n── the flat treatment ──');

  await page.evaluate(() => {
    const d = new Date();
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            + `-${String(d.getDate()).padStart(2, '0')}`;
    localStorage.setItem('habits.v1', JSON.stringify({ days: { [k]: { done: { wake: true }, split: 'push' } } }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const dot = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('.hb-dot[data-on]'));
    return { bg: s.backgroundImage, shadow: s.boxShadow };
  });
  ok('a kept habit is a flat disc, not a lit sphere', dot.bg === 'none', dot.bg);
  /* The hollow ring is an INSET shadow and stays — it is the outline
     of an unkept mark, not a glow. Computed style puts the keyword at
     the END of each layer, which is why stripping a leading "inset"
     found nothing and this check first failed on its own outline.
     Split on the commas BETWEEN layers, not the ones inside rgba(). */
  const outer = dot.shadow.split(/,(?![^(]*\))/).filter((l) => !/inset/.test(l));
  ok('and it does not bloom', outer.length === 0, dot.shadow);

  /* The colours only exist while the question is open. */
  ok('no colours on the row until you ask', await page.$$eval('.hb-split button', (b) => b.length) === 0);
  await page.click('[data-pick]');
  await page.waitForTimeout(200);
  /* Off the control before measuring it. The click leaves the pointer
     sitting on one of the four, and :hover lifts that one to .85 — the
     first run of this read ["0.62","0.85"] and looked like the lit dot
     had come back. */
  await page.mouse.move(0, 0);
  await page.waitForTimeout(220);
  const picker = await page.$$eval('.hb-split button', (bs) => bs.map((b) => ({
    pressed: b.getAttribute('aria-pressed') === 'true',
    opacity: getComputedStyle(b.querySelector('i')).opacity,
    shadow: getComputedStyle(b.querySelector('i')).boxShadow,
    ring: getComputedStyle(b).borderColor,
  })));
  const ops = [...new Set(picker.map((x) => x.opacity))];
  ok('all four split dots read the same', ops.length === 1, ops);
  ok('none of them glows', picker.every((x) => x.shadow === 'none'),
    picker.map((x) => x.shadow));
  const chosen = picker.find((x) => x.pressed);
  ok('exactly one is chosen', picker.filter((x) => x.pressed).length === 1);
  ok('and the ring is what says so',
    chosen.ring !== picker.find((x) => !x.pressed).ring, [chosen.ring]);
  /* Answer it and it is a tick again — that is the whole control. */
  await page.click('[data-split="pull"]');
  await page.waitForTimeout(220);
  ok('answering puts it back to a tick',
    await page.$$eval('.hb-split button', (b) => b.length) === 0
    && await page.$$eval('[data-pick]', (b) => b.length) === 1);

  /* ── every one of them marked ──
     The six stop being six and become one ramp. The bloom fires on the
     day it TURNS complete and never on a repaint: arriving at the
     screen is not an achievement. */
  console.log('\n── a finished day ──');
  const strip = () => page.evaluate(() => {
    const b = document.querySelector('.hb-blocks');
    return { all: b.hasAttribute('data-all'), bloom: b.classList.contains('hb-bloom'),
             gap: getComputedStyle(b).gap,
             bar: +getComputedStyle(b, '::before').opacity };
  });
  await page.evaluate(() => localStorage.removeItem('habits.v1'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  for (const id of ['wake', 'abs', 'walk', 'water', 'read']) {
    await page.click(`[data-tick="${id}"]`);
    await page.waitForTimeout(70);
  }
  let sN = await strip();
  ok('five of six is still six blocks', sN.all === false && sN.bar === 0, sN);
  await page.click('[data-pick]');
  await page.waitForTimeout(150);
  await page.click('[data-split="push"]');
  await page.waitForTimeout(250);
  sN = await strip();
  ok('the sixth merges them into one bar', sN.all === true && sN.gap === '0px' && sN.bar === 1, sN);
  ok('and it blooms as it lands', sN.bloom === true);
  /* The ramp is brighter than any of the six, not their average — that
     average is #ad9c9c and the rest-day grey is #918e88, so a perfect
     day would have looked like a day of nothing. */
  const ultra = await page.evaluate(() => {
    const d = document.createElement('div');
    d.style.backgroundImage = getComputedStyle(document.documentElement)
      .getPropertyValue('--ultra').trim();
    document.body.appendChild(d);
    const v = getComputedStyle(d).backgroundImage; d.remove(); return v;
  });
  ok('the merged bar is a ramp, not one colour', /gradient/.test(ultra) &&
    (ultra.match(/rgb\(/g) || []).length >= 6, ultra.slice(0, 60));
  ok('and it is not the rest-day grey', !/173,\s*156,\s*156|145,\s*142,\s*136/.test(ultra));

  /* A REPAINT IS NOT AN ACHIEVEMENT. */
  await page.click('[data-view="reminders"]');
  await page.waitForTimeout(220);
  await page.click('[data-view="habits"]');
  await page.waitForTimeout(320);
  sN = await strip();
  ok('coming back does not celebrate again', sN.all === true && sN.bloom === false, sN);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  sN = await strip();
  ok('nor does a reload', sN.all === true && sN.bloom === false, sN);
  /* But undoing and redoing it should. */
  await page.click('[data-tick="read"]');
  await page.waitForTimeout(200);
  sN = await strip();
  ok('taking one away unmerges it', sN.all === false && sN.bar === 0);
  await page.click('[data-tick="read"]');
  await page.waitForTimeout(220);
  sN = await strip();
  ok('and putting it back blooms again', sN.all === true && sN.bloom === true);

  /* ── the list is code, not data ──
     It used to be saved and read back in preference to the file, so a
     browser that had ever ticked anything kept whatever the list was
     when it first saved: reordering did nothing and a new habit never
     arrived. Nothing here can edit it, so there was nothing to keep. */
  console.log('\n── the list is code ──');
  ok('nothing writes the definitions', await page.evaluate(() =>
    !('habits' in JSON.parse(localStorage.getItem('habits.v1')))));

  await page.evaluate(() => {
    const v = JSON.parse(localStorage.getItem('habits.v1'));
    v.habits = [{ id: 'ghost', name: 'A habit from an older version', every: 1 }];
    localStorage.setItem('habits.v1', JSON.stringify(v));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  ok('a stored list from an older version is ignored', await page.$$eval('.hb-nm b',
    (ns) => ns.map((n) => n.textContent).join('|'))
    === 'Wake up|Workout|Abs|Morning walk|Water|Reading');
  ok('and it is dropped on the next write', await page.evaluate(async () => {
    document.querySelector('.hb-act button').click();
    await new Promise((r) => setTimeout(r, 120));
    return !('habits' in JSON.parse(localStorage.getItem('habits.v1')));
  }));

  /* And the days — the part you cannot get back — survive it. */
  ok('the days survive a damaged definitions list', await page.evaluate(() =>
    Object.keys(JSON.parse(localStorage.getItem('habits.v1')).days).length > 0));

  /* ── nothing of the ledger is touched ── */
  console.log('\n── the wall ──');
  ok('no ledger key is written', await page.evaluate(() =>
    ['ledger.v1', 'backtest.v1', 'checkin.v1', 'ledger.res.v1']
      .every((k) => localStorage.getItem(k) === null)));
  ok('and the source names none of them', await fetch(`${BASE}/days/`).then((r) => r.text())
    .then((t) => !/ledger\.v1|backtest\.v1|checkin\.v1/.test(t)));

  ok('no page errors through any of it', errs.length === 0, errs);
  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
