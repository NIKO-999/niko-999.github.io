/* A goal's colour is a choice, it sticks, and every choice stays
   legible on the panel it lands on. */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
const D = '/tmp/claude-0/-home-user-niko-999-github-io/0c50b2a3-74bc-5684-9821-f4c805b5d78d/scratchpad';
let pass = 0, fail = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); c ? pass++ : fail++; };

/* WCAG relative luminance and contrast, on the pixels actually painted. */
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05); };

(async () => {
  const br = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });

  for (const scheme of ['light', 'dark']) {
    const pg = await br.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
    const errs = [];
    pg.on('pageerror', e => errs.push('JS: ' + e.message));
    await pg.emulateMedia({ colorScheme: scheme });
    await pg.goto(`${BASE}/arc/`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(400);

    console.log(`\n══ ${scheme} scheme`);

    if (scheme === 'light') {
      console.log('\n── the picker');
      await pg.evaluate(() => document.querySelector('#rows .bar').click());
      await pg.waitForTimeout(300);
      ok(await pg.isVisible('#edTones'), 'the editor offers a colour');
      const labels = await pg.$$eval('#edTones [data-tone]', bs => bs.map(b => b.dataset.tone));
      ok(labels.join(',') === 'accent,light,dark,muted',
         `four of them, no more (${labels.join(', ')})`);
      const checked = await pg.$$eval('#edTones [aria-checked="true"]', b => b.length);
      ok(checked === 1, 'exactly one is selected when it opens');

      /* It has to open on the goal's OWN colour, not a default. */
      const openOn = await pg.evaluate(() =>
        document.querySelector('#edTones [aria-checked="true"]').dataset.tone);
      const goalTone = await pg.evaluate(() => {
        const id = document.querySelector('#rows .bar').dataset.id;
        return toneOf(goals().find(g => g.id === id).tone);
      });
      ok(openOn === goalTone, `opened on this goal's colour (${openOn})`);

      console.log('\n── choosing one');
      await pg.click('#edTones [data-tone="light"]');
      await pg.click('#edSave');
      await pg.waitForTimeout(400);
      const saved = await pg.evaluate(() => {
        const b = document.querySelector('#rows .bar');
        const g = goals().find(x => x.id === b.dataset.id);
        return { stored: g.tone, drawn: b.dataset.tone };
      });
      ok(saved.stored === 'light', `the choice is stored (${saved.stored})`);
      ok(saved.drawn === 'light', 'and drawn on the bar');

      await pg.reload({ waitUntil: 'networkidle' });
      await pg.waitForTimeout(400);
      ok(await pg.evaluate(() => document.querySelector('#rows .bar').dataset.tone) === 'light',
         'and survives a reload');

      /* Keyboard, since it declares itself a radiogroup. */
      await pg.evaluate(() => document.querySelector('#rows .bar').click());
      await pg.waitForTimeout(250);
      await pg.click('#edTones [data-tone="accent"]');
      await pg.keyboard.press('ArrowRight');
      ok(await pg.evaluate(() =>
        document.querySelector('#edTones [aria-checked="true"]').dataset.tone) === 'light',
         'arrow keys move across the swatches');
      await pg.keyboard.press('End');
      ok(await pg.evaluate(() =>
        document.querySelector('#edTones [aria-checked="true"]').dataset.tone) === 'muted',
         'and End reaches the last one');
      await pg.click('#edCancel');
      await pg.waitForTimeout(200);

      console.log('\n── the old names still mean something');
      const migrated = await pg.evaluate(() => ({
        strong: toneOf('strong'), soft: toneOf('soft'),
        junk: toneOf('chartreuse'), missing: toneOf(undefined),
      }));
      ok(migrated.strong === 'dark' && migrated.soft === 'muted',
         `strong→dark, soft→muted (${migrated.strong}, ${migrated.soft})`);
      ok(migrated.junk === 'muted' && migrated.missing === 'muted',
         'and anything unrecognised lands somewhere real rather than blank');
    }

    console.log('\n── every colour is legible where it lands');
    /* One bar per tone, on the real board, measured off the screenshot —
       bar against panel, and the label against its own bar. */
    await pg.evaluate(() => {
      const st = { goals: goals().slice(0, 4) };
      ['accent', 'light', 'dark', 'muted'].forEach((t, i) => {
        if (st.goals[i]) { st.goals[i].tone = t; st.goals[i].horizon = 'now'; }
      });
      commit(false, (s) => { s.goals.forEach((g, i) => {
        const t = ['accent', 'light', 'dark', 'muted'][i];
        if (t) { g.tone = t; }
      }); });
      layout();
    });
    await pg.waitForTimeout(400);

    /* Screenshot the strip that crosses each bar's leading edge, feed it
       back into the page and read the pixels. That is the only honest
       source: the panel is glass over a photograph, so the colour behind
       a bar is not any value in the stylesheet. */
    const readPx = async (clip, pts) => {
      const png = await pg.screenshot({ clip });
      return pg.evaluate(async ([url, pts]) => {
        const bm = await createImageBitmap(await (await fetch(url)).blob());
        const c = document.createElement('canvas');
        c.width = bm.width; c.height = bm.height;
        c.getContext('2d').drawImage(bm, 0, 0);
        const g = c.getContext('2d');
        const out = pts.map(([x, y]) => [...g.getImageData(x, y, 1, 1).data].slice(0, 3));
        bm.close();
        return out;
      }, [ 'data:image/png;base64,' + png.toString('base64'), pts ]);
    };

    for (const tone of ['accent', 'light', 'dark', 'muted']) {
      const m = await pg.evaluate((tone) => {
        const bar = document.querySelector(`#rows .bar[data-tone="${tone}"]`);
        if (!bar) return null;
        const r = bar.getBoundingClientRect();
        const lab = bar.querySelector('.label').getBoundingClientRect();
        return { x: Math.round(r.left) - 6, y: Math.round(r.top + r.height / 2),
                 labX: Math.round(lab.left) + 2,
                 labY: Math.round(lab.top + lab.height / 2),
                 labW: Math.round(lab.width), text: bar.querySelector('.label').textContent,
                 cls: bar.className, barW: Math.round(r.width) };
      }, tone);
      if (!m) { ok(false, `${tone}: no bar drawn`); continue; }

      /* A run of pixels crossing the bar's leading edge. What matters is
         not "is the fill different from the panel" — it is "is there a
         visible edge here at all", and with this design the edge can come
         from the keyline as legitimately as from the fill. So: the
         largest step between any two neighbouring pixels in the run. */
      const run = await readPx({ x: m.x, y: m.y - 1, width: 20, height: 2 },
        Array.from({ length: 38 }, (_, i) => [i, 1]));
      let edge = 1;
      for (let i = 1; i < run.length; i++) edge = Math.max(edge, ratio(run[i - 1], run[i]));

      /* And the name has to be readable on the bar it is written on.
         Sampling two chosen pixels was hopeless — glyph coverage at any
         one point is a coin flip and the edges are antialiased. Take a
         patch over the label and use its darkest and lightest pixels:
         on a patch containing text those ARE the ink and the fill. */
      const patch = await readPx({ x: m.labX, y: m.labY - 5, width: 44, height: 11 },
        (() => { const p = []; for (let y = 0; y < 22; y += 1) for (let x = 0; x < 88; x += 1) p.push([x, y]); return p; })());
      let lo = patch[0], hi = patch[0];
      patch.forEach(px => { if (lum(px) < lum(lo)) lo = px; if (lum(px) > lum(hi)) hi = px; });
      const text = ratio(hi, lo);

      /* A bar too narrow for its own name puts the name on the canvas
         beside it — there is nothing written ON the bar to measure. */
      const named = m.labW > 8;
      console.log(`   ${tone.padEnd(7)} edge ${edge.toFixed(2)}:1`
        + (named ? `   label ${text.toFixed(2)}:1` : '   label outside the bar'));
      ok(edge >= 3, `${tone}: the bar has a findable edge (${edge.toFixed(2)}:1)`);
      if (named) ok(text >= 4.5, `${tone}: its name is readable on it (${text.toFixed(2)}:1)`);
    }

    ok(errs.length === 0, errs.length ? 'page errors: ' + errs.join(' | ') : 'no page errors');
    await pg.screenshot({ path: `${D}/tone-${scheme}.png` });
    await pg.close();
  }

  await br.close();
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  process.exit(fail ? 1 : 0);
})();
