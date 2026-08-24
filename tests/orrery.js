/* ═══════════════════════════════════════════════════════════════
   ORRERY — the map is measured, not admired.

   Everything here reads values back out of the page or samples real
   pixels off a screenshot. "Looks fine" has already been wrong in this
   repo about a font axis, a 1.02:1 contrast ratio and two class
   collisions — and an SVG full of var() fills is exactly the kind of
   thing that can render solid black while the source reads perfectly.

   Three passes. The theme pass runs twice, dark and light, and measures
   colour: every node's fill against its category token, the seven
   category colours pairwise in Lab, and every text run in the reading
   pane and both cards against the pixels actually composited behind
   it. The behaviour pass drives the map with the real mouse and
   keyboard. The last pass strips showDirectoryPicker and proves the
   vault view still has a working way in.

   Expectations are computed from the seed corpus read back off the
   page, never hardcoded — the corpus is the app's own claim, and the
   test's job is to hold the drawing to it.
   ═══════════════════════════════════════════════════════════════ */
const { open, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

/* ── colour, the way an eye reads it ──
   Lab for "these two are different colours", WCAG luminance for "this
   text is readable". Hex comparison would pass two colours that look
   identical on screen, which is the failure this file exists to catch. */
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
const rgb = (s) => (String(s).match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
const dE = (a, b) => Math.hypot(...lab(rgb(a)).map((v, i) => v - lab(rgb(b))[i]));
const lum = ([r, g, b]) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05); };

const parseT = (s) => (String(s).match(/translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/) || [])
  .slice(1, 3).map(Number);

/* ── the corpus, from the seed's own claims ──
   Wikilink extraction and resolution re-implemented here in miniature —
   exact id, then basename, then case-insensitive basename — so the
   loose-end count and the edge set are computed independently of the
   code under test rather than read back out of it. */
const mkCorpus = (seed) => {
  const byId = new Map(seed.map((n) => [n.id, n]));
  const base = new Map(), lc = new Map();
  for (const n of [...seed].sort((a, b) => (a.id < b.id ? -1 : 1))) {
    const b = n.id.split('/').pop();
    if (!base.has(b)) base.set(b, n.id);
    if (!lc.has(b.toLowerCase())) lc.set(b.toLowerCase(), n.id);
  }
  const resolve = (t) => {
    t = String(t).split('|')[0].replace(/[#^].*$/, '').trim();
    if (!t) return null;
    if (byId.has(t)) return t;
    const b = t.split('/').pop();
    return base.get(b) || lc.get(b.toLowerCase()) || null;
  };
  const deadIn = (body) => {
    const out = []; let m;
    const re = /!?\[\[([^[\]\n]+?)\]\]/g;
    const t = String(body).replace(/```[\s\S]*?```/g, ' ');
    while ((m = re.exec(t))) {
      const tg = m[1].split('|')[0].replace(/[#^].*$/, '').trim();
      if (tg && !resolve(tg)) out.push(tg);
    }
    return out;
  };
  const loose = new Set();
  for (const n of seed) deadIn(n.body).forEach((t) => loose.add(t.toLowerCase()));
  const seen = new Set(), edges = [];
  for (const n of seed) for (const t of n.links) {
    if (t === n.id || !byId.has(t)) continue;
    const k = n.id < t ? n.id + ' ' + t : t + ' ' + n.id;
    if (!seen.has(k)) { seen.add(k); edges.push(k); }
  }
  const backlinks = (id) => seed.filter((m) => m.id !== id && m.links.includes(id));
  const cats = new Set(['trading', 'growth']);
  seed.forEach((n) => cats.add(n.cat));
  return { byId, resolve, deadIn, loose, edges, backlinks, hubs: cats.size };
};

/* Screenshot a clip and take, for each rect inside it, the darkest and
   lightest pixel. On a patch containing text those ARE the ink and the
   ground — sampling chosen points was a coin flip against antialiasing,
   and the stylesheet cannot answer at all: the pane is glass over a
   photograph, so the colour behind a glyph is not any value in it. */
async function patches(page, clip, items, dsf) {
  const c = { x: Math.max(0, Math.floor(clip.x)), y: Math.max(0, Math.floor(clip.y)),
              width: Math.ceil(clip.width), height: Math.ceil(clip.height) };
  const png = await page.screenshot({ clip: c });
  const rel = items.map((it) => ({ label: it.label,
    x: it.x - c.x, y: it.y - c.y, w: it.w, h: it.h }));
  return page.evaluate(async ([url, rel, dsf]) => {
    const bm = await createImageBitmap(await (await fetch(url)).blob());
    const cv = document.createElement('canvas');
    cv.width = bm.width; cv.height = bm.height;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(bm, 0, 0);
    const lum = ([r, gg, b]) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b);
    };
    const out = [];
    for (const it of rel) {
      const x = Math.max(0, Math.round(it.x * dsf)), y = Math.max(0, Math.round(it.y * dsf));
      const w = Math.min(cv.width - x, Math.round(it.w * dsf));
      const h = Math.min(cv.height - y, Math.round(it.h * dsf));
      if (w < 6 || h < 6) continue;
      const d = g.getImageData(x, y, w, h).data;
      let lo = [d[0], d[1], d[2]], hi = lo, loL = lum(lo), hiL = loL;
      for (let i = 4; i < d.length; i += 4) {
        const px = [d[i], d[i + 1], d[i + 2]];
        const L = lum(px);
        if (L < loL) { loL = L; lo = px; }
        if (L > hiL) { hiL = L; hi = px; }
      }
      out.push({ label: it.label, lo, hi });
    }
    bm.close();
    return out;
  }, ['data:image/png;base64,' + png.toString('base64'), rel, dsf]);
}

const waitPaint = async (page) => {
  await page.waitForFunction(() =>
    document.querySelectorAll('#orNodes .or-node').length > 0
    && document.querySelectorAll('#orLegRows .or-leg').length > 0,
    { timeout: 15000 });
  await page.waitForTimeout(500);
};

/* Wait for the field to stop moving. pickHittable checks that a node is
   reachable AT THE MOMENT IT LOOKS; if the simulation is still settling,
   the node has drifted by the time the press lands and the click goes
   to empty space — a background pan instead of a drag, and an assertion
   that fails for a reason nothing in its message mentions. */
const settle = async (page) => {
  await page.waitForFunction(() => !orSim.raf, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(250);
};

const positions = (page) => page.$$eval('#orNodes .or-node', (gs) =>
  Object.fromEntries(gs.map((g) => [g.getAttribute('data-id'), g.getAttribute('transform')])));

/* A node the pointer can actually reach: its centre inside the stage,
   clear of the floated cards, and — the part that matters — the topmost
   element there resolves to THIS node, not to a later-painted
   neighbour's halo. */
const pickHittable = (page, ids) => page.evaluate((ids) => {
  const stage = document.getElementById('orStage').getBoundingClientRect();
  const keep = [document.getElementById('orLegend'),
                document.querySelector('.or-zoom')]
    .filter(Boolean).map((e) => e.getBoundingClientRect());
  for (const id of ids) {
    const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
    if (!g) continue;
    const r = g.getBoundingClientRect();
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    if (cx < stage.left + 24 || cx > stage.right - 24
      || cy < stage.top + 24 || cy > stage.bottom - 24) continue;
    if (keep.some((k) => cx > k.left - 8 && cx < k.right + 8
      && cy > k.top - 8 && cy < k.bottom + 8)) continue;
    const el = document.elementFromPoint(cx, cy);
    const hit = el && el.closest ? el.closest('.or-node') : null;
    if (hit && hit.getAttribute('data-id') === id) return { id, cx, cy };
  }
  return null;
}, ids);

(async () => {
  let seed = null, corpus = null;
  const pos = {};                       /* fresh-load positions per pass */

  /* ═══ the theme pass — colour, run twice ═══ */
  for (const scheme of ['dark', 'light']) {
    const { browser, page, errs } = await open({ colorScheme: scheme, deviceScaleFactor: 2 });
    await page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
    await waitPaint(page);
    await page.mouse.move(0, 0);
    console.log(`\n── ${scheme} ──`);

    if (!seed) {
      seed = await page.evaluate(() => SEED.map((n) => ({
        id: n.id, title: n.title, cat: n.cat, tags: n.tags, links: n.links,
        body: n.body, words: n.words })));
      corpus = mkCorpus(seed);
    }
    pos[scheme] = await positions(page);

    /* ── the selection's mark has to survive the theme ──
       It is stroked var(--or-core), which is near-white: a mark on
       black and nothing whatsoever on paper. An invisible stroke does
       not announce itself — it just quietly stops being a selection
       marker — so the light theme names its own ink, and this holds it
       to being visible against the ground it is actually drawn on. */
    const mark = await page.evaluate(() => {
      orOpen('trading/models/cisd');
      const r = document.querySelector('#orNodes .or-sel .or-ringc');
      const lum = (c) => {
        const [R, G, B] = (String(c).match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3)
          .map(Number).map((v) => { v /= 255;
            return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
        return .2126 * R + .7152 * G + .0722 * B;
      };
      const ink = lum(getComputedStyle(r).stroke);
      const bg = lum(getComputedStyle(document.body).backgroundColor);
      return { ink, bg, ratio: (Math.max(ink, bg) + .05) / (Math.min(ink, bg) + .05) };
    });
    ok('the selection mark is visible against this theme\u2019s ground',
      mark.ratio > 3, mark);
    await page.evaluate(() => orClose());
    await page.waitForTimeout(250);

    /* ── the seed paints, in its own colours ──
       A star carries its category in a GRADIENT, not in a solid fill,
       so the check follows it there: every node points at its own
       category's gradient, and that gradient's outer stop resolves to
       the category token. Both halves matter — a node aimed at the
       wrong gradient and a gradient whose colour never resolved are
       different bugs and the source proves neither. An unsupported
       var() in a stop paints black and reads perfectly in the file. */
    const fills = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const probe = (v) => { const d = document.createElement('div');
        d.style.color = v; document.body.appendChild(d);
        const c = getComputedStyle(d).color; d.remove(); return c; };
      const want = {}, bad = [];
      let n = 0;
      document.querySelectorAll('#orNodes .or-node').forEach((g) => {
        n++;
        const cat = g.getAttribute('data-cat');
        if (!(cat in want)) want[cat] = probe(cs.getPropertyValue('--or-cat-' + cat).trim());
        const halo = g.querySelector('.or-halo');
        const fill = halo ? getComputedStyle(halo).fill : 'no shape';
        if (!/url\(.*#orStar-/.test(fill) || fill.indexOf('orStar-' + cat) < 0) {
          bad.push(`${g.getAttribute('data-id')}: aimed at ${fill}, not orStar-${cat}`);
          return;
        }
        /* The gradient's last stop is the category at full strength —
           that is where the colour actually has to have resolved. */
        const grad = document.getElementById('orStar-' + cat);
        const stops = grad ? grad.querySelectorAll('stop') : [];
        const got = stops.length ? getComputedStyle(stops[stops.length - 1]).stopColor : 'no stop';
        /* stop-color carries no alpha here; compare the rgb triple. */
        const rgb = (v) => (String(v).match(/\d+/g) || []).slice(0, 3).join(',');
        if (rgb(got) !== rgb(want[cat]))
          bad.push(`${g.getAttribute('data-id')}: stop ${got} ≠ ${want[cat]}`);
      });
      return { n, bad: bad.slice(0, 4) };
    });
    ok('a node per seed note plus a hub per category',
      fills.n === seed.length + corpus.hubs, { drawn: fills.n, want: seed.length + corpus.hubs });
    ok('every node wears its category colour, measured off the element',
      fills.bad.length === 0, fills.bad);

    /* ── the seven are apart in Lab, not in hex ── */
    const cats = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const probe = (v) => { const d = document.createElement('div');
        d.style.color = v; document.body.appendChild(d);
        const c = getComputedStyle(d).color; d.remove(); return c; };
      return Object.fromEntries(CATS.map((c) => [c.id,
        probe(cs.getPropertyValue('--or-cat-' + c.id).trim())]));
    });
    const ids = Object.keys(cats);
    let worst = { d: 999 };
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const d = dE(cats[ids[i]], cats[ids[j]]);
      if (d < worst.d) worst = { d, a: ids[i], b: ids[j] };
    }
    ok('seven categories, no two closer than dE 20',
      ids.length === 7 && worst.d >= 20, `${worst.a}/${worst.b} dE ${worst.d.toFixed(1)}`);

    /* ── the card, against its own composited ground ──
       It is translucent now and blurs whatever the palette is showing
       through it, so this is the assertion that decides how thin the
       glass is allowed to be. Sampled off real pixels at 2x. ── */
    const cardItems = await page.evaluate(() => {
      const items = [];
      const push = (label, r) => { if (r && r.width > 3 && r.height > 3)
        items.push({ label, x: r.x, y: r.y, w: r.width, h: r.height }); };
      const R = (el) => el && el.getBoundingClientRect();
      push('legend heading', R(document.querySelector('#orLegend .or-card-h')));
      document.querySelectorAll('#orLegend .or-leg').forEach((b) => {
        const nm = b.querySelector('.or-leg-lb');
        push('legend ' + nm.textContent, R(nm));
        push('count ' + nm.textContent, R(b.querySelector('.or-leg-n')));
      });
      push('formation heading', R(document.querySelector('#orLegend .or-form-h')));
      const a = document.getElementById('orLegend').getBoundingClientRect();
      return { items, clip: { x: a.left - 4, y: a.top - 4,
                              width: a.width + 8, height: a.height + 8 } };
    });
    const cardRuns = await patches(page, cardItems.clip, cardItems.items, 2);
    const cardBad = cardRuns.map((r) => ({ ...r, c: ratio(r.hi, r.lo) }))
      .filter((r) => r.c < 4.5);
    ok(`every card run clears 4.5:1 through the glass (${cardRuns.length} sampled)`,
      cardRuns.length >= 15 && cardBad.length === 0,
      cardBad.slice(0, 3).map((r) => `${r.label} ${r.c.toFixed(2)}:1`));

    /* ── and it is actually glass ──
       The declaration is not the proof: backdrop-filter with an opaque
       background is a solid card that says it is glass. --menu does not
       move with the backdrop, so anything INSIDE the card that changes
       when the photograph behind it changes got there by being seen
       through. Two backdrops far apart in tone, one patch of the card's
       own padding, measured. */
    const glassDecl = await page.evaluate(() => {
      const g = getComputedStyle(document.getElementById('orLegend'));
      return { bd: g.backdropFilter || g.webkitBackdropFilter,
               bg: g.backgroundColor, radius: g.borderTopLeftRadius,
               fieldCard: !!document.getElementById('orStats') };
    });
    const alpha = +((glassDecl.bg.match(/[\d.]+/g) || [])[3] ?? 1);
    ok('the card blurs what is behind it', /blur/.test(glassDecl.bd || ''), glassDecl.bd);
    ok('and is translucent rather than a panel that claims to be',
      alpha > .3 && alpha < .95, { alpha, bg: glassDecl.bg });
    ok('the field card is gone from the map', glassDecl.fieldCard === false);

    const seen = [];
    for (const bg of ['iceberg', 'umber']) {
      await page.evaluate((b) => { document.documentElement.dataset.bg = b; }, bg);
      await page.waitForTimeout(1100);
      const patch = await page.evaluate(() => {
        const r = document.getElementById('orLegend').getBoundingClientRect();
        /* The card's own gutter, clear of every row and of the border. */
        return { x: r.left + 4, y: r.bottom - 7, w: r.width - 8, h: 4 };
      });
      const got = await patches(page, { x: patch.x - 1, y: patch.y - 1,
        width: patch.w + 2, height: patch.h + 2 },
        [{ label: bg, ...patch }], 2);
      seen.push(got[0]);
    }
    const drift = seen.length === 2
      ? Math.max(dE(`rgb(${seen[0].lo.join(',')})`, `rgb(${seen[1].lo.join(',')})`),
                 dE(`rgb(${seen[0].hi.join(',')})`, `rgb(${seen[1].hi.join(',')})`))
      : 0;
    ok('the sky changes the colour inside the card, so you are seeing through it',
      drift >= 3, { drift: +drift.toFixed(2), seen });
    await page.evaluate(() => { delete document.documentElement.dataset.bg; });
    await page.waitForTimeout(500);

    /* ── the concordance, against the photograph it is set on ──
       This is the assertion that caught it. Drawn first in the raw
       category colours at the opacities it was designed at, the rim ran
       1.40:1 to 3.67:1 over three backdrops — and looked deliberate,
       which is exactly the failure mode this file exists for. Every run
       is sampled off composited pixels, in both themes, because a
       category colour that clears the bar on ink does not clear it on
       paper. */
    const rimItems = await page.evaluate(() => {
      const stage = document.getElementById('orStage').getBoundingClientRect();
      const items = [];
      document.querySelectorAll('#orRings text').forEach((t) => {
        const r = t.getBoundingClientRect();
        if (r.width < 8 || r.height < 3) return;
        items.push({ label: (t.textContent || '').trim().slice(0, 22),
                     x: r.x, y: r.y, w: r.width, h: r.height });
      });
      return { items, clip: { x: stage.x, y: stage.y, width: stage.width, height: stage.height } };
    });
    const rimRuns = await patches(page, rimItems.clip, rimItems.items, 2);
    const rimBad = rimRuns.map((r) => ({ ...r, c: ratio(r.hi, r.lo) })).filter((r) => r.c < 4.5);
    ok(`every rim run clears 4.5:1 on the photograph (${rimRuns.length} sampled)`,
      rimRuns.length >= 12 && rimBad.length === 0,
      rimBad.slice(0, 4).map((r) => `${r.label} ${r.c.toFixed(2)}:1`));

    /* ── the rim is INSIDE the stage ──
       It reaches r 489 of a 500 half-box, so it is the one piece of
       furniture that can fall off the edge when the stage is a shape
       nobody tested. */
    const rimFit = await page.evaluate(() => {
      const st = document.getElementById('orStage').getBoundingClientRect();
      let out = 0, pad = 1e9;
      document.querySelectorAll('#orRings text, #orRings line, #orRings circle').forEach((t) => {
        const r = t.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        if (r.left < st.left - .5 || r.right > st.right + .5
          || r.top < st.top - .5 || r.bottom > st.bottom + .5) out++;
        pad = Math.min(pad, r.top - st.top, st.bottom - r.bottom);
      });
      return { out, pad: Math.round(pad) };
    });
    ok('nothing on the rim falls off the stage', rimFit.out === 0, rimFit);

    /* ── the reading pane, open on a real note ── */
    await page.evaluate(() => orOpen('growth/boredom'));
    await page.waitForTimeout(600);

    const naked = await page.evaluate(() => {
      const s = getComputedStyle(document.getElementById('orNote'));
      return { bg: s.backgroundColor, b: [s.borderTopWidth, s.borderRightWidth,
        s.borderBottomWidth, s.borderLeftWidth], shadow: s.boxShadow };
    });
    ok('the reading view is open, not a card',
      naked.bg === 'rgba(0, 0, 0, 0)' && naked.b.every((w) => w === '0px')
      && naked.shadow === 'none', naked);

    const paneItems = await page.evaluate(() => {
      const pane = document.getElementById('orNote');
      const pr = pane.getBoundingClientRect();
      const items = [];
      const push = (label, el) => {
        if (!el || el.hidden) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        /* the soft mask fades the pane's top and bottom 28px on
           purpose; a run inside the fade is faint by design and would
           fail for the wrong reason */
        if (r.top < pr.top + 30 || r.bottom > pr.bottom - 30) return;
        items.push({ label, x: r.x, y: r.y, w: r.width, h: r.height });
      };
      push('eyebrow category', document.getElementById('orNoteCat'));
      push('eyebrow path', document.getElementById('orNotePath'));
      push('re-file control', document.getElementById('orNoteRefile'));
      push('title', document.getElementById('orNoteTitle'));
      document.querySelectorAll('#orNoteBody p').forEach((p, i) => push('paragraph ' + i, p));
      document.querySelectorAll('#orNoteBody .or-wl').forEach((b, i) => push('body wikilink ' + i, b));
      push('links heading', document.getElementById('orNoteOutH'));
      document.querySelectorAll('#orNoteOut .or-wl').forEach((b, i) => push('link ' + i, b));
      push('backlinks heading', document.getElementById('orNoteInH'));
      document.querySelectorAll('#orNoteIn .or-wl').forEach((b, i) => push('backlink ' + i, b));
      return { items, clip: { x: pr.x, y: pr.y, width: pr.width, height: pr.height } };
    });
    const paneRuns = await patches(page, paneItems.clip, paneItems.items, 2);
    const paneBad = paneRuns.map((r) => ({ ...r, c: ratio(r.hi, r.lo) }))
      .filter((r) => r.c < 4.5);
    ok(`every pane run clears 4.5:1 on the glass (${paneRuns.length} sampled)`,
      paneRuns.length >= 8 && paneBad.length === 0,
      paneBad.slice(0, 3).map((r) => `${r.label} ${r.c.toFixed(2)}:1`));

    ok('no page errors', errs.length === 0, errs.slice(0, 3));
    await browser.close();
  }

  /* ═══ the behaviour pass ═══ */
  const { browser, page, errs } = await open({ colorScheme: 'dark' });
  await page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(page);
  await page.mouse.move(0, 0);
  console.log('\n── the layout is a fact, not a roll ──');

  const posB = await positions(page);
  ok('two clean loads lay out identically',
    JSON.stringify(posB) === JSON.stringify(pos.dark),
    Object.keys(posB).filter((k) => posB[k] !== pos.dark[k]).slice(0, 3));
  ok('and the theme does not move a node',
    JSON.stringify(pos.light) === JSON.stringify(pos.dark));

  console.log('\n── the seed on the wire ──');
  const domPairs = await page.$$eval('#orLinks path', (ps) => ps.map((p) => {
    const a = p.getAttribute('data-a'), b = p.getAttribute('data-b');
    return a < b ? a + ' ' + b : b + ' ' + a;
  }));
  ok('an edge per resolved link pair, deduped',
    domPairs.length === corpus.edges.length
    && corpus.edges.every((k) => domPairs.includes(k)),
    { drawn: domPairs.length, want: corpus.edges.length });
  /* The field card is gone and its four figures did not go with it —
     they are answers now. Held against the same independently computed
     corpus the card was held against, so removing the card cost the
     suite no coverage. */
  const stats = await page.evaluate(() => {
    const say = (q) => { orAsk(q); return document.getElementById('orReply').textContent; };
    return { nodes: say('how many notes'), links: say('how many links'),
             loose: say('loose ends'), cleared: (orReply.clear(), state.q) };
  });
  ok('asked, he counts what is drawn',
    stats.nodes.indexOf(String(seed.length)) === 0
    && stats.links.indexOf(String(corpus.edges.length)) === 0, stats);
  ok(`and his loose-ends figure matches the corpus (${corpus.loose.size} real)`,
    stats.loose.indexOf(String(corpus.loose.size)) === 0, stats.loose);
  ok('and asking left the map unfiltered', stats.cleared === '', stats);

  /* ── click a node, read the note ── */
  console.log('\n── the open field ──');
  const linked = seed.filter((n) =>
    n.links.some((t) => corpus.byId.has(t)) && corpus.backlinks(n.id).length)
    .map((n) => n.id).sort();
  const hitA = await pickHittable(page, linked);
  ok('a linked node is reachable at its own centre', !!hitA, hitA);
  if (!hitA) throw new Error('nothing on the map is clickable — stopping here');

  await page.mouse.click(hitA.cx, hitA.cy);
  await page.waitForFunction(() => !document.getElementById('orNote').hidden);
  await page.waitForTimeout(450);
  const note = corpus.byId.get(hitA.id);
  const paneNow = await page.evaluate(() => ({
    title: document.getElementById('orNoteTitle').textContent,
    cat: document.getElementById('orNoteCat').textContent,
    outs: [...document.querySelectorAll('#orNoteOut li button')].map((b) => b.textContent),
    ins: [...document.querySelectorAll('#orNoteIn li button')].map((b) => b.textContent),
  }));
  ok('clicking a node opens the note it names', paneNow.title === note.title,
    { got: paneNow.title, want: note.title });
  const wantOuts = note.links.filter((t) => corpus.byId.has(t))
    .map((t) => corpus.byId.get(t).title).sort();
  ok('with its outgoing links', JSON.stringify([...paneNow.outs].sort()) === JSON.stringify(wantOuts),
    { got: paneNow.outs, want: wantOuts });
  const wantIns = corpus.backlinks(hitA.id).map((m) => m.title).sort();
  ok('and its backlinks, correct against the corpus',
    JSON.stringify(paneNow.ins) === JSON.stringify(wantIns),
    { got: paneNow.ins, want: wantIns });

  /* ── a wikilink in the body navigates ── */
  const go = await page.$eval('#orNoteBody .or-wl', (b) => b.getAttribute('data-go'))
    .catch(() => null);
  ok('the rendered body carries a live wikilink', !!go);
  if (go) {
    await page.click('#orNoteBody .or-wl');
    await page.waitForTimeout(450);
    const t2 = await page.evaluate(() => ({
      title: document.getElementById('orNoteTitle').textContent,
      sel: state.sel }));
    ok('and clicking it navigates to that note',
      t2.title === corpus.byId.get(go).title && t2.sel === go, t2);
  }

  /* ── a loose end renders dead ── */
  const looseNote = seed.map((n) => ({ id: n.id, dead: corpus.deadIn(n.body) }))
    .filter((n) => n.dead.length).sort((a, b) => (a.id < b.id ? -1 : 1))[0];
  await page.evaluate((id) => orOpen(id), looseNote.id);
  await page.waitForTimeout(400);
  const dead = await page.evaluate(() => ({
    spans: [...document.querySelectorAll('#orNoteBody .or-loose')]
      .map((s) => ({ tag: s.tagName, text: s.textContent, go: s.getAttribute('data-go') })),
    live: [...document.querySelectorAll('#orNoteBody .or-wl')].map((b) => b.textContent),
  }));
  ok('a wikilink with no target renders dead',
    looseNote.dead.every((t) => dead.spans.some((s) => s.text === t)),
    { want: looseNote.dead, got: dead.spans });
  ok('dead means dead — a span, no destination, never a button',
    dead.spans.every((s) => s.tag !== 'BUTTON' && !s.go)
    && looseNote.dead.every((t) => !dead.live.includes(t)), dead.spans);

  /* ── the reading geometry, measured ── */
  console.log('\n── the reserved column ──');
  const geo = await page.evaluate(() => {
    const n = document.getElementById('orNote').getBoundingClientRect();
    const s = document.getElementById('orStage').getBoundingClientRect();
    const v = document.getElementById('orSvg').getBoundingClientRect();
    const b = document.getElementById('orNoteBody');
    return { n: { t: n.top, h: n.height, r: n.right },
             s: { t: s.top, h: s.height, l: s.left },
             svgL: v.left, bodyScroll: b.scrollWidth, bodyClient: b.clientWidth };
  });
  ok('#orNote and #orStage are one height, top aligned',
    Math.abs(geo.n.h - geo.s.h) <= 1 && Math.abs(geo.n.t - geo.s.t) <= 1, geo);
  ok('and the note sits LEFT of the stage', geo.n.r <= geo.s.l + 1, geo);
  ok('the drawing never crosses into the text', geo.n.r <= geo.svgL + 1,
    { noteRight: geo.n.r, svgLeft: geo.svgL });
  ok('nothing cuts the body sideways', geo.bodyScroll <= geo.bodyClient,
    { scroll: geo.bodyScroll, client: geo.bodyClient });
  ok('the scrollbar is hidden by declaration', await page.evaluate(() =>
    getComputedStyle(document.getElementById('orNote')).scrollbarWidth === 'none'));

  /* Shrink the window until the note must overflow, then prove the
     hidden bar hid the furniture and not the scrolling. */
  await page.setViewportSize({ width: 1512, height: 560 });
  await page.waitForTimeout(400);
  const scroll = await page.evaluate(async () => {
    const p = document.getElementById('orNote');
    const over = p.scrollHeight > p.clientHeight;
    p.scrollTop = 150;
    await new Promise((r) => setTimeout(r, 500));   /* scroll-behavior: smooth */
    const moved = p.scrollTop;
    p.scrollTop = 0;
    return { over, moved, sh: p.scrollHeight, ch: p.clientHeight };
  });
  ok('a long note overflows its column', scroll.over, scroll);
  ok('and still scrolls with the bar hidden', scroll.moved > 80, scroll);
  await page.setViewportSize({ width: 1512, height: 950 });
  await page.waitForTimeout(400);

  /* ── reading time dims the chrome ── */
  const chrome = () => page.evaluate(() => ({
    legend: getComputedStyle(document.getElementById('orLegend')).opacity,
    pe: getComputedStyle(document.getElementById('orLegend')).pointerEvents,
    pane: document.getElementById('orNote').hidden,
  }));
  let ch = await chrome();
  ok('the card is gone while a note is open',
    ch.legend === '0' && ch.pe === 'none', ch);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  ch = await chrome();
  ok('Escape closes the note', ch.pane === true);
  ok('and the card comes back', ch.legend === '1', ch);
  /* Escape closes on orClose, which glides the view back out — the
     chrome above comes back synchronously, before the camera does.
     The movable block below computes a hit target from the CURRENT
     screen position and then drives a real mouse there in several
     round trips; a flight still in the air keeps moving nodes under
     that position between the computation and the click, and the
     click lands on whichever node ended up there instead. */
  await page.waitForFunction(() =>
    !document.getElementById('orSvg').classList.contains('or-flying'),
    null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(150);

  /* ── movable, three ways ── */
  console.log('\n── movable ──');
  const allIds = seed.map((n) => n.id).sort();

  /* a drag under 3px is a click and opens instead of moving */
  const hitB = await pickHittable(page, allIds);
  await page.mouse.move(hitB.cx, hitB.cy);
  await page.mouse.down();
  await page.mouse.move(hitB.cx + 1, hitB.cy + 1);
  await page.mouse.up();
  await page.waitForTimeout(450);
  const tap = await page.evaluate(() => ({
    open: !document.getElementById('orNote').hidden,
    title: document.getElementById('orNoteTitle').textContent,
    pos: JSON.parse(localStorage.getItem('orrery.v1') || '{}').pos || {},
  }));
  ok('a drag under 3px opens the note instead of moving it',
    tap.open && tap.title === corpus.byId.get(hitB.id).title, tap.title);
  ok('and files no position', !(hitB.id in tap.pos), Object.keys(tap.pos));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  /* a real drag moves, saves, and survives a reload */
  const hitC = await pickHittable(page, allIds);
  const t0 = await page.evaluate((id) =>
    document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`).getAttribute('transform'),
    hitC.id);
  await page.mouse.move(hitC.cx, hitC.cy);
  await page.mouse.down();
  await page.mouse.move(hitC.cx + 40, hitC.cy + 25, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const drag = await page.evaluate((id) => ({
    t: document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`).getAttribute('transform'),
    saved: (JSON.parse(localStorage.getItem('orrery.v1') || '{}').pos || {})[id] || null,
  }), hitC.id);
  ok('a pointer drag moves the node', drag.t !== t0, { was: t0, now: drag.t });
  const at = parseT(drag.t);
  /* A release hands the node back to the simulation — it does NOT
     file a position. That is the contract now: the field is a fabric,
     so a node let go where the springs disagree gets pulled back, and
     PINNING is what makes a placement permanent. */
  ok('a release files no position — the sim has it back', !drag.saved, drag.saved);

  /* A held node's links come up to full strength. At rest they sit at
     .22 so eighty-five of them do not become a net you read instead of
     the notes; dragged clear of its neighbours, a line at .22 stretched
     over hundreds of units cannot survive the distance and the node
     LOOKS snapped free of a line still exactly attached to it. The
     geometry was never wrong here — only the visibility — so this
     asserts the visibility. */
  await settle(page);
  /* A node with no links proves nothing about lighting its links, so
     pick from the ones the corpus says have some. Derived from edges —
     there is no degree map on the corpus, and asking for one that does
     not exist silently falls through to "any node at all". */
  const linkedIds = new Set();
  corpus.edges.forEach((k) => k.split(' ').forEach((id) => linkedIds.add(id)));
  const linked2 = allIds.filter((id) => linkedIds.has(id));
  const hitD = await pickHittable(page, linked2);
  const linksOf = (id) => page.evaluate((n) =>
    [...document.querySelectorAll('#orLinks path[data-a]')]
      .filter((t) => t.getAttribute('data-a') === n || t.getAttribute('data-b') === n)
      .map((t) => +t.getAttribute('opacity')), id);
  const rest = await linksOf(hitD.id);
  await page.mouse.move(hitD.cx, hitD.cy);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(hitD.cx + i * 14, hitD.cy + i * 9);
  const held = await linksOf(hitD.id);
  /* ── and the stars on the ends of them ──
     Holding a star lit every link touching it and stopped there: a fan
     of bright lines running out to stars doing nothing at all, which
     reads as lines attached to empty space. A lit line lights what it
     lands on. Sampled WHILE HELD — the class comes off on release, so
     reading it afterwards measures the cleanup, not the lighting. */
  const hot = await page.evaluate((id) => {
    const kin = new Set();
    (state.edges || []).forEach((e) => {
      if (e[0] === id) kin.add(e[1]); else if (e[1] === id) kin.add(e[0]);
    });
    const at = (k, sel) => document.querySelector(
      `#orNodes [data-id="${CSS.escape(k)}"]${sel}`);
    return { kin: kin.size,
      lit: [...kin].filter((k) => { const g = at(k, ''); 
        return g && g.classList.contains('or-hot'); }).length,
      op: [...new Set([...kin].map((k) => { const h = at(k, ' .or-halo');
        return h ? +getComputedStyle(h).opacity : null; }))] };
  }, hitD.id);
  /* And still attached, in the pixels: the endpoint of every one of its
     links lands on the node's own core. */
  const gaps = await page.evaluate((id) => {
    const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
    const cr = g.querySelector('.or-corec').getBoundingClientRect();
    const nc = { x: cr.x + cr.width / 2, y: cr.y + cr.height / 2 };
    return [...document.querySelectorAll('#orLinks path[data-a]')].filter((t) =>
      t.getAttribute('data-a') === id || t.getAttribute('data-b') === id).map((t) => {
      const at0 = t.getAttribute('data-a') === id;
      const pt = t.getPointAtLength(at0 ? 0 : t.getTotalLength());
      const sp = new DOMPoint(pt.x, pt.y).matrixTransform(t.getScreenCTM());
      return +Math.hypot(sp.x - nc.x, sp.y - nc.y).toFixed(1);
    });
  }, hitD.id);
  await page.mouse.up();
  await page.waitForTimeout(900);
  const after = await linksOf(hitD.id);
  ok('a held node\u2019s links light up', held.length > 0 && held.every((o) => o > .8),
    { rest, held });
  ok('and every star on the end of one lights with them',
    hot.kin > 0 && hot.lit === hot.kin, hot);
  ok('at full strength, not merely un-dimmed',
    hot.op.every((o) => o > .95), hot);
  ok('and never leave the node, measured in screen pixels',
    gaps.length > 0 && gaps.every((g) => g < 1.5), gaps);
  /* Not "dark the instant you let go" any more: a released node is
     still stretched and still flying home, and the tension pass keeps
     its links lit for exactly that stretch. Slack is what it settles
     to, so settling is what this waits for. */
  await settle(page);
  const slackAfter = await linksOf(hitD.id);
  ok('and go quiet once the node has settled', slackAfter.every((o) => o < .5),
    { onRelease: after, settled: slackAfter });

  /* TENSION SHOWS, and it has to survive the spring back. The failure
     this replaces was invisible by construction: the node flies home
     across hundreds of units with its links at slack opacity, so it
     reads as cut loose from lines that are exactly attached to it.
     Three writers touch a link's opacity — the drag, the tension pass
     and the hover repaint — and every one of them has to agree, which
     is what the mid-flight sample below actually tests. */
  await settle(page);
  const stretch = await page.evaluate((id) => {
    const before = [...document.querySelectorAll('#orLinks path[data-a]')]
      .filter((t) => t.getAttribute('data-a') === id || t.getAttribute('data-b') === id)
      .map((t) => +t.getAttribute('opacity'));
    /* Fling it far without a pointer, then read on the way home. */
    const p0 = state.xy[id].slice();
    orSim.put(id, p0[0] + 430, p0[1] + 330);
    orHeat(1);
    return new Promise((res) => setTimeout(() => {
      const now = [...document.querySelectorAll('#orLinks path[data-a]')]
        .filter((t) => t.getAttribute('data-a') === id || t.getAttribute('data-b') === id)
        .map((t) => +t.getAttribute('opacity'));
      res({ before, now });
    }, 260));
  }, hitD.id);
  ok('a stretched link brightens on its way home',
    stretch.now.length > 0 && stretch.now.every((o) => o > .5), stretch);
  await settle(page);
  const slack = await page.evaluate((id) =>
    [...document.querySelectorAll('#orLinks path[data-a]')]
      .filter((t) => t.getAttribute('data-a') === id || t.getAttribute('data-b') === id)
      .map((t) => +t.getAttribute('opacity')), hitD.id);
  ok('and goes quiet again once it is slack', slack.every((o) => o < .5), slack);

  /* ── the settle does not spring back ──
     Damping used to be one constant for every node, tuned against the
     softest spring in the app (Orrery's own, home:1). Terraces and
     Chord hold a note up to 3.4x harder, and a hub sits on top of that
     again — so the same constant left the stiffest formations visibly
     ringing on the way in: a note would arrive, overshoot, and swing
     back. That is what "bounces like a spider web" was.

     The direct proof is the mechanism, not a threshold on a noisy
     multi-second trace: orSim.DP (set in orSim.seed) is now derived
     from each node's OWN spring rate, so the same note damps harder
     under a stiffer formation. Reverting DP to the flat SIM.damp it
     used to be — the exact old bug — makes dpLoose and dpStiff below
     equal, which is what this catches. */
  const stiff = await page.evaluate(() => {
    const id = Object.keys(orLayout.tier || {}).find((x) => orLayout.tier[x] !== 'hub');
    orForm('orrery');
    const dpLoose = orSim.DP[orSim.ix.get(id)];
    orForm('chord');
    const dpStiff = orSim.DP[orSim.ix.get(id)];
    orForm('orrery');
    return { id, dpLoose, dpStiff };
  });
  await settle(page);
  ok('the same note damps harder under a stiffer formation, not by one flat constant',
    stiff.dpStiff > 0 && stiff.dpStiff < stiff.dpLoose * .8, stiff);
  ok('and damping never reaches or exceeds 1, or the field could gain energy',
    stiff.dpLoose > 0 && stiff.dpLoose < 1 && stiff.dpStiff > 0 && stiff.dpStiff < 1, stiff);

  /* And a loose behavioural check that the mechanism above actually
     pays off on screen: switch to Chord — the stiffest arrangement —
     and follow the note that moves farthest. A wide margin on purpose;
     the exact figure jitters run to run; catching a damping constant
     reverted to flat is the assertion above's job, not this one's. */
  const formBounce = await page.evaluate(() => new Promise((res) => {
    const ids = Object.keys(orLayout.tier || {});
    const before = {};
    ids.forEach((id) => { const i = orSim.ix.get(id); before[id] = [orSim.HX[i], orSim.HY[i]]; });
    orForm('chord');
    let worst = null, maxJump = 0;
    ids.forEach((id) => {
      const i = orSim.ix.get(id);
      const j = Math.hypot(orSim.HX[i] - before[id][0], orSim.HY[i] - before[id][1]);
      if (j > maxJump) { maxJump = j; worst = id; }
    });
    const d = [], t0 = performance.now();
    const tick = () => {
      const i = orSim.ix.get(worst);
      d.push(+Math.hypot(orSim.X[i] - orSim.HX[i], orSim.Y[i] - orSim.HY[i]).toFixed(1));
      if (performance.now() - t0 < 2200) requestAnimationFrame(tick);
      else res({ worst, maxJump: +maxJump.toFixed(0), d });
    };
    requestAnimationFrame(tick);
  }));
  await page.evaluate(() => { orForm('orrery'); });
  await settle(page);
  ok('switching formation actually moved the worst-case note, so this measured something',
    formBounce.maxJump > 100, formBounce);
  {
    const d = formBounce.d;
    let nearAt = d.findIndex((v) => v < 20);
    if (nearAt < 0) nearAt = d.length - 1;
    const rebound = Math.max(...d.slice(nearAt)) - Math.min(...d.slice(0, nearAt + 1));
    ok('and settles without a wild swing on the way in',
      rebound < 60, { rebound, nearAt, ...formBounce });
  }

  /* Double-click pins where it sits, and a pin is what survives. */
  const pinAt = await page.evaluate((id) => {
    const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
    const r = g.getBoundingClientRect();
    return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  }, hitC.id);
  await page.mouse.dblclick(pinAt.cx, pinAt.cy);
  await page.waitForTimeout(450);
  const pinned = await page.evaluate((id) => ({
    xy: state.xy[id].slice(),
    pin: (JSON.parse(localStorage.getItem('orrery.v1') || '{}').pin || {})[id] || null,
    ring: !!document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"] .or-pinr`),
  }), hitC.id);
  ok('double-click pins the node where it sits', pinned.pin
    && Math.abs(pinned.pin[0] - pinned.xy[0]) < 0.15
    && Math.abs(pinned.pin[1] - pinned.xy[1]) < 0.15, pinned);
  ok('and the pin is drawn, so locked is legible without a legend', pinned.ring);

  await page.reload({ waitUntil: 'networkidle' });
  await waitPaint(page);
  const back = await page.evaluate((id) => ({
    xy: state.xy[id].slice(),
    pin: (JSON.parse(localStorage.getItem('orrery.v1') || '{}').pin || {})[id] || null,
  }), hitC.id);
  ok('and a pinned node is still exactly there after a reload', back.pin
    && Math.abs(back.xy[0] - pinned.pin[0]) < 0.15
    && Math.abs(back.xy[1] - pinned.pin[1]) < 0.15, back);

  /* the keyboard is a first-class pointer */
  const kid = allIds.find((id) => id !== hitC.id);
  const kx = await page.evaluate((id) => state.xy[id][0], kid);
  await page.evaluate((id) =>
    document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`).focus(), kid);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const key = await page.evaluate((id) => ({
    x: state.xy[id][0],
    saved: (JSON.parse(localStorage.getItem('orrery.v1') || '{}').pos || {})[id] || null,
  }), kid);
  ok('ArrowRight moves the focused node 4px', Math.abs(key.x - (kx + 4)) < 0.11,
    { was: kx, now: key.x });
  ok('and files no position either — same contract as the pointer',
    !key.saved, key.saved);

  /* ── selecting colours only what it reaches ──
     The question a click asks is "what does this touch?", so the answer
     has to be the only thing still wearing a colour. Measured off the
     drawn elements: the kin keep their category gradient, everything
     else points at the colourless one, and NOTHING disappears. */
  console.log('\n── what it touches ──');
  await page.evaluate(() => orOpen('trading/models/cisd'));
  await page.waitForTimeout(600);
  const mute = await page.evaluate(() => {
    const kin = orKin(state.sel);
    const gs = [...document.querySelectorAll('#orNodes .or-node')];
    const fillOf = (g) => {
      const h = g.querySelector('.or-halo');
      return h ? (h.getAttribute('fill') || '') : '';
    };
    const wrong = [];
    gs.forEach((g) => {
      const id = g.getAttribute('data-id');
      const muted = fillOf(g).indexOf('orStar-mute') >= 0;
      if (kin.has(id) === muted) wrong.push(id + (muted ? ': kin but muted' : ': stranger but coloured'));
    });
    /* Links, not the surge overlays riding on them — those carry no
       data-a/data-b and are not edges. */
    const links = [...document.querySelectorAll('#orLinks path[data-a]')];
    /* BOTH ends, not either. Lighting on either end drew a full-colour
       line from a neighbour out to a note two hops away, which is not
       kin and so stayed at .55 — a lit line ending on an unlit star. */
    const linkWrong = links.filter((l) => {
      const both = kin.has(l.getAttribute('data-a')) && kin.has(l.getAttribute('data-b'));
      const muted = (l.getAttribute('stroke') || '').indexOf('or-mute') >= 0;
      return both === muted;
    }).length;
    /* The invariant that failure was really about, stated directly:
       follow any coloured line and you arrive somewhere lit. */
    const orphanLit = links.filter((l) => {
      if ((l.getAttribute('stroke') || '').indexOf('or-mute') >= 0) return false;
      return [l.getAttribute('data-a'), l.getAttribute('data-b')].some((id) => {
        const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
        return !g || +(g.getAttribute('opacity') || 1) < .9;
      });
    }).map((l) => l.getAttribute('data-a') + '→' + l.getAttribute('data-b'));
    return { nodes: gs.length, kin: kin.size, wrong: wrong.slice(0, 4),
             linkWrong, links: links.length, orphanLit: orphanLit.slice(0, 4),
             orphanN: orphanLit.length };
  });
  ok('the selection and its links keep their colour, nothing else does',
    mute.wrong.length === 0, mute.wrong);
  ok('and every link agrees with the nodes it joins', mute.linkWrong === 0,
    { wrong: mute.linkWrong, of: mute.links });
  ok('so no lit line ends on a star that is not lit',
    mute.orphanN === 0, mute.orphanLit);

  /* ── the surge ──
     Opening a note sends a band of the LINE along each of its links,
     in the link's own colour brightened — not a white dot riding on
     top. The thing that moves is the connection. */
  const surge = await page.evaluate(() => {
    const su = [...document.querySelectorAll('#orLinks .or-surge')];
    const authored = (state.edges || []).filter((e) => e.includes(state.sel)).length;
    const s0 = su[0];
    const base = [...document.querySelectorAll('#orLinks path[data-a]')].find((p) =>
      !p.classList.contains('or-tether')
      && (p.getAttribute('data-a') === state.sel || p.getAttribute('data-b') === state.sel));
    const cs = s0 && getComputedStyle(s0);
    return { n: su.length, authored,
      /* pathLength normalises the dash to PERCENT of the line, which is
         what stops a long link's pulse crawling and a short one's
         vanishing before you see it. */
      norm: su.every((p) => p.getAttribute('pathLength') === '100'),
      running: cs && cs.animationName === 'or-surge',
      dashed: cs && /10px/.test(cs.strokeDasharray),
      onTheLine: !!(base && su.some((p) => p.getAttribute('d') === base.getAttribute('d'))),
      /* the pulse is the line's colour, never the core white */
      white: su.filter((p) => {
        const c = getComputedStyle(p).stroke.replace(/[^\d.,]/g, '').split(',').map(Number);
        return c.length >= 3 && c.every((v) => v > .93);
      }).length };
  });
  ok('opening a note runs a surge down each of its links',
    surge.n > 0 && surge.n === surge.authored, surge);
  ok('normalised to the line, so a long link is not slower',
    surge.norm && surge.running && surge.dashed, surge);
  ok('and it rides exactly on the link, not beside it', surge.onTheLine, surge);
  ok('in the line\u2019s own colour, never the core white',
    surge.white === 0, surge);


  /* ── the camera does not fly into the wall ──
     Everything the map draws sits inside #orView, so the camera scales
     all of it. A tight cluster fitted its box at 3.9x — a hair off the
     4x hand-zoom clamp — and the whole field was rasterising at
     fifteen times the pixel area to show six stars. It reported as
     "glitchy when it zooms in", which is exactly what it was. */
  const flewTo = await page.evaluate(() => state.zoom);
  /* ── you cannot get further out than the view you started at ──
     The floor was .35, four steps out from the default, and every one
     of them only shrank the field and pulled the rim in from the edges
     of a stage it already fitted. */
  const outMost = await page.evaluate(() => {
    orClose(); orZoom(0);
    for (let i = 0; i < 25; i++) orZoom(1 / 1.25, 500, 500);
    return state.zoom;
  });
  ok('zooming out stops at the default fit', outMost === 1, outMost);
  await page.evaluate(() => orZoom(0));
  await settle(page);
  await page.evaluate(() => orOpen('trading/models/cisd'));
  await settle(page);
  /* settle() only waits on the force sim, not the camera — and the
     passage's own curve holds back on purpose for its first ~20%
     (the pull-away Passage was chosen for), so a fixed 250ms wait
     that was already tight against the old 620ms flight reads this
     mid-pull-away against the new one. Wait for or-flying to actually
     clear. */
  await page.waitForFunction(() =>
    !document.getElementById('orSvg').classList.contains('or-flying'),
    null, { timeout: 3000 }).catch(() => {});
  await page.mouse.move(4, 4);
  await page.waitForTimeout(150);

  /* ── and the camera lands on the star you clicked ──
     Fitting the neighbourhood centred its bounding box, which put the
     note you asked for off to one side of its own constellation. The
     zoom still fits the group; the centre is the one you named. */
  const centred = await page.evaluate(() => {
    const svg = document.getElementById('orSvg');
    const g = document.querySelector('#orNodes .or-sel .or-corec');
    const s = svg.getBoundingClientRect(), r = g.getBoundingClientRect();
    return { dx: Math.abs((r.x + r.width / 2) - (s.x + s.width / 2)),
             dy: Math.abs((r.y + r.height / 2) - (s.y + s.height / 2)),
             w: s.width, h: s.height };
  });
  ok('the star you clicked lands near the middle of the stage',
    centred.dx < centred.w * .12 && centred.dy < centred.h * .12, centred);

  ok('a flight stops short of the hand-zoom clamp',
    flewTo <= 2.4 + 1e-6 && flewTo > 1, flewTo);

  /* And nothing drifts while it is moving. An animating group cannot
     be cached — it is redrawn every frame at whatever scale the flight
     has reached — so the ambient layers hold still for the one moment
     the whole field is being redrawn at a changing scale. */
  const amb = await page.evaluate(() => {
    const svg = document.getElementById('orSvg');
    const st = (sel) => getComputedStyle(document.querySelector(sel)).animationPlayState;
    return { cls: svg.getAttribute('class') || '',
             nod: st('#orNod'), dust: st('#orDustA'), turn: st('.or-turn') };
  });
  /* ── a hand on the map puts the camera DOWN ──
     Interrupting a flight used to clearTimeout the only thing that
     takes it down, so or-flying stranded on the svg — and that class
     pauses the precession and all three dust shells. A pan during a
     flight stopped the whole instrument moving, permanently and
     silently, until some later flight happened to end cleanly. */
  await page.evaluate(() => { orClose(); });
  await settle(page);
  const landed = await page.evaluate(() => new Promise((res) => {
    orOpen('trading/models/cisd');
    setTimeout(() => { orPan(12, 8); }, 150);        /* a hand, mid-flight */
    setTimeout(() => res({
      cls: document.getElementById('orSvg').getAttribute('class') || '',
      fly: document.getElementById('orView').classList.contains('or-fly'),
      turn: getComputedStyle(document.querySelector('.or-turn')).animationPlayState,
    }), 2200);                                    /* well past any flight */
  }));
  ok('a pan during a flight lands the camera rather than stranding it',
    !/or-flying/.test(landed.cls) && !landed.fly, landed);
  /* Landing at zoom > 1.6 leaves or-tight on, which pauses the drift
     ON PURPOSE — that is the close-in rule doing its job, not the
     stranding. The thing the stranding broke is that it never came
     back, so that is what this asks: come back out, and the
     instrument runs again. */
  const woke = await page.evaluate(() => new Promise((res) => {
    orZoom(0);
    setTimeout(() => res({
      cls: document.getElementById('orSvg').getAttribute('class') || '',
      zoom: state.zoom,
      turn: getComputedStyle(document.querySelector('.or-turn')).animationPlayState,
    }), 500);
  }));
  ok('and the instrument runs again once you are back out',
    woke.turn === 'running', woke);

  /* ── and a wheel tick during a flight does not teleport ──
     Used to own state.zoom as a DESTINATION for the whole flight — set
     synchronously to 2.4 the instant the flight was asked for, with the
     visible camera catching up underneath via a CSS transition.
     Zooming read that destination and compounded off a camera that had
     not arrived: 2.4 claimed while the map was still drawn at 1, times
     1.25, and the view jumped to 3. orPan's guard never caught it
     because orZoom pans by (0, 0) and the guard tests `dx || dy`.

     Passage's per-frame camera does not have a destination to read —
     state.zoom IS wherever the camera actually is, every tick, so
     `claimed` here is already the true mid-flight position rather than
     the 2.4 the old bug read. The invariant that survives is the
     test's own title: a wheel tick zooms from where the camera is, so
     the result is a plain 1.25x of THAT, not of the destination. */
  await page.evaluate(() => { orClose(); orZoom(0); });
  await settle(page);
  const wheeled = await page.evaluate(() => new Promise((res) => {
    orOpen('trading/models/cisd');
    setTimeout(() => {
      const claimed = state.zoom;
      orZoom(1.25, 500, 500);
      setTimeout(() => res({ claimed, after: state.zoom,
        cls: document.getElementById('orSvg').getAttribute('class') || '' }), 90);
    }, 150);
  }));
  ok('mid-flight, the camera is already short of the destination',
    wheeled.claimed > 1 && wheeled.claimed < 2.4 - 1e-6, wheeled);
  ok('a wheel tick mid-flight zooms 1.25x from where the camera IS, not from 2.4',
    Math.abs(wheeled.after - wheeled.claimed * 1.25) < 0.01
    && wheeled.after < 3 - 1e-6, wheeled);
  ok('and takes the flight down with it', !/or-flying/.test(wheeled.cls), wheeled);

  /* ── a chip never balloons through a flight ──
     Chips ride inside #orView, so the camera scales them, and their
     counter-scale is only rewritten when the flight LANDS. For the
     whole flight each one carried the counter-scale for the zoom it
     started at and grew with the camera — 39.8px to 94.8px, 2.38x,
     then a snap back to 40. Measured while VISIBLE, because the fix
     is that they stand down: geometry alone reads the same either
     way, which is how this hid in the first place.

     The sampling window has to clear FLY_MS, then the .22s fade back
     in, with margin — a window sized to the OLD 620ms flight left
     under 150ms for a visible sample once the passage lengthened it,
     and on this box's own throttled frame rate that was sometimes
     zero rAF ticks landing inside it: a real sample, missed by a
     window that was too tight, not a chip that never came back. */
  await page.evaluate(() => { orClose(); orZoom(0); });
  await settle(page);
  await page.mouse.move(4, 4);
  const grew = await page.evaluate(() => new Promise((res) => {
    const w = [], view = document.getElementById('orView');
    const L = document.getElementById('orLabels'), t0 = performance.now();
    const tick = () => {
      const c = document.querySelector('#orLabels .or-chip');
      if (c && +getComputedStyle(L).opacity > .05)
        w.push(+c.getBoundingClientRect().width.toFixed(1));
      if (performance.now() - t0 < 1500) requestAnimationFrame(tick);
      else res({ n: w.length, min: Math.min(...w), max: Math.max(...w),
                 view: +new DOMMatrix(getComputedStyle(view).transform).a.toFixed(2) });
    };
    orOpen('trading/models/cisd');
    requestAnimationFrame(tick);
  }));
  ok('a chip holds its size through a flight, or is not on screen for it',
    grew.n > 0 && grew.max / grew.min < 1.12, grew);
  ok('and the camera did fly, so that was not a no-op', grew.view > 1.5, grew);
  await page.evaluate(() => { orClose(); orZoom(0); });
  await settle(page);
  await page.evaluate(() => { orClose(); orZoom(0); });
  await settle(page);
  await page.evaluate(() => { orClose(); });
  await settle(page);
  await page.evaluate(() => orOpen('trading/models/cisd'));
  await settle(page);
  await page.mouse.move(4, 4);
  await page.waitForTimeout(300);

  ok('and the one thing that turns holds still while the camera is close in',
    /or-tight/.test(amb.cls) && amb.turn === 'paused', amb);
  ok('there is no nod keyframe left to be expensive',
    await page.evaluate(() => ![...document.styleSheets].flatMap((sh) => {
      try { return [...sh.cssRules]; } catch (e) { return []; }
    }).some((r) => r.type === CSSRule.KEYFRAMES_RULE && r.name === 'or-nod')));
  ok('muting is not removing — every node is still drawn',
    mute.nodes === seed.length + corpus.hubs, mute.nodes);
  ok('and it is a minority that stays lit, or it says nothing',
    mute.kin > 1 && mute.kin < mute.nodes / 3, { kin: mute.kin, of: mute.nodes });

  /* The neighbours BURN, they do not merely keep their colour. Muting
     the strangers said which notes answered by taking colour off
     everything else, which left the answer itself no brighter than it
     started: the links lit up while the notes at their ends sat exactly
     as quiet as before. */
  /* Park the pointer off the map first. Hover drift multiplies every
     node by SIM.dim, so measuring brightness with the mouse still
     resting on a star reads .3 for a node that is in fact at full
     strength — two narrows composing exactly as designed, and an
     assertion that blames the wrong one. */
  await page.mouse.move(4, 4);
  await page.waitForTimeout(350);
  const burn = await page.evaluate(() => {
    const kin = orKin(state.sel);
    const gs = [...document.querySelectorAll('#orNodes .or-node')];
    const op = (g) => +(g.getAttribute('opacity') || 1);
    const kins = gs.filter((g) => kin.has(g.getAttribute('data-id')));
    const far = gs.filter((g) => !kin.has(g.getAttribute('data-id')));
    return { kinOp: [...new Set(kins.map(op))], farOp: [...new Set(far.map(op))],
             /* The burn is brightness now, not a ring. Measure the
                thing that actually says "lit": a kin halo is bigger
                than the same node's would be at rest. */
             kinHalo: kins.map((g) => +g.querySelector('.or-halo').getAttribute('r')),
             farHalo: far.map((g) => +g.querySelector('.or-halo').getAttribute('r')),
             /* No hoop on any KIN — they answer with light. */
             hoops: document.querySelectorAll('#orNodes .or-kinr').length,
             /* One mark on the whole map: the star you clicked. */
             marks: document.querySelectorAll('#orNodes .or-ringc').length,
             /* One mark left on the whole map: the star you clicked. */

             kinN: kins.length };
  });
  ok('a connected note is at full strength', burn.kinOp.every((o) => o > .9), burn);
  /* A hoop round every lit star read as geometry bolted onto a drawing
     made of light — and worse on a real vault, where the majors are
     big enough for the ring to dominate the star inside it. */
  ok('and no star wears a hoop to say so', burn.hoops === 0, burn.hoops);
  /* Brightness carries it too, and that half is independent of how the
     star is drawn — measured on halo radius, same tier both sides so
     this cannot be comparing a hub with a leaf. */
  /* One hairline, tucked inside the bloom rather than drawn round it,
     and only on the star you clicked. */
  ok('and exactly one star is marked — the one you clicked',
    burn.marks === 1, burn.marks);
  ok('the mark sits inside the bloom, not around it',
    await page.evaluate(() => {
      const g = document.querySelector('#orNodes .or-sel');
      return +g.querySelector('.or-ringc').getAttribute('r')
           < +g.querySelector('.or-halo').getAttribute('r') * .55;
    }));
  ok('and burns brighter than a stranger of its own tier',
    await page.evaluate(() => {
      const kin = orKin(state.sel);
      const g = [...document.querySelectorAll('#orNodes .or-node')];
      const r = (x) => +x.querySelector('.or-halo').getAttribute('r');
      const tier = (x) => (x.getAttribute('class').match(/or-(hub|major|minor|leaf)/) || [])[1];
      const lit = g.filter((x) => kin.has(x.getAttribute('data-id')) && tier(x) === 'major');
      const not = g.filter((x) => !kin.has(x.getAttribute('data-id')) && tier(x) === 'major');
      if (!lit.length || !not.length) return false;
      const avg = (a) => a.reduce((s, x) => s + r(x), 0) / a.length;
      return avg(lit) > avg(not) * 1.1;
    }));
  ok('while a stranger sits back without leaving',
    burn.farOp.every((o) => o > .2 && o < .8), burn);

  /* ── the folder is JOINED, not merely lit ──
     A hub is synthetic and carries no edge, so selecting a note lit its
     folder's sun and ran nothing to it: full halo, its own ring, and
     empty space between. A glow is not a connection, and the map read
     as broken at the exact point it was most complete. The tether is
     what closes it, and these hold it to being a tether rather than a
     forged link. */
  const teth = await page.evaluate(() => {
    const sel = state.sel, hub = 'hub:' + orLayout.catOf[sel];
    const kin = orKin(sel);
    const all = [...document.querySelectorAll('#orLinks path[data-a]')];
    const tet = all.filter((t) => t.classList.contains('or-tether'));
    const ends = (t) => [t.getAttribute('data-a'), t.getAttribute('data-b')];
    /* Authored links are what the reading pane counts. A tether must be
       excluded from that tally by something the eye can also use. */
    const solid = all.filter((t) => !t.classList.contains('or-tether')
      && ends(t).includes(sel));
    const authored = (state.edges || []).filter((e) => e.includes(sel)).length;
    return {
      hub,
      toHub: tet.some((t) => ends(t).join() === [sel, hub].join()),
      strayEnd: tet.filter((t) => !ends(t).every((id) => kin.has(id))).length,
      dashed: tet.every((t) => (t.getAttribute('stroke-dasharray') || '') !== ''),
      solidDashed: solid.some((t) => (t.getAttribute('stroke-dasharray') || '') !== ''),
      solidN: solid.length, authored,
      tracked: (orSim.lines || []).filter((l) => l.tether).length, n: tet.length,
      /* Belonging is not a force. The hub took no edge and no degree,
         so nothing in the field moved because a line was drawn. */
      hubDeg: (orLayout.deg || {})[hub] || 0,
      hubEdges: (state.edges || []).filter((e) => e.includes(hub)).length,
    };
  });
  ok('the folder is joined to the note, not merely lit beside it', teth.toHub, teth);
  ok('and every tether lands on two ends that are already lit',
    teth.n > 0 && teth.strayEnd === 0, teth);
  ok('a tether is dashed and an authored link is not',
    teth.n > 0 && teth.dashed && !teth.solidDashed, teth);
  ok('so the map still counts the links the pane counts',
    teth.solidN === teth.authored, teth);
  ok('the sim owns every tether, or one comes adrift the first frame',
    teth.n > 0 && teth.tracked === teth.n, teth);
  ok('and belonging costs the physics nothing',
    teth.hubDeg === 0 && teth.hubEdges === 0, teth);
  /* Attached in the pixels, not just in the data — the failure this
     whole class of bug hides behind is a line that is geometrically
     perfect and visually gone. */
  const tgap = await page.evaluate(() => {
    const c = (id) => {
      const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
      const r = g.querySelector('.or-corec').getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    };
    return [...document.querySelectorAll('#orLinks .or-tether')].map((t) => {
      const a = c(t.getAttribute('data-a')), b = c(t.getAttribute('data-b'));
      const m = t.getScreenCTM();
      const q0 = t.getPointAtLength(0), q1 = t.getPointAtLength(t.getTotalLength());
      const p0 = new DOMPoint(q0.x, q0.y).matrixTransform(m);
      const p1 = new DOMPoint(q1.x, q1.y).matrixTransform(m);
      return +Math.max(Math.hypot(p0.x - a.x, p0.y - a.y),
                       Math.hypot(p1.x - b.x, p1.y - b.y)).toFixed(1);
    });
  });
  ok('a tether reaches both stars, measured in screen pixels',
    tgap.length > 0 && tgap.every((g) => g < 1.5), tgap);
  /* ── the camera flies in, and the labels do not come with it ──
     Opening flies the view onto the neighbourhood. The stars grow; the
     labels must not, or they arrive four times too big and cover what
     they name. And the map may never cross into the reading column at
     any zoom — the stage clips, and this proves it still does. */
  const flew = await page.evaluate(() => {
    const kin = orKin(state.sel);
    const sr = document.getElementById('orSvg').getBoundingClientRect();
    const nr = document.getElementById('orNote').getBoundingClientRect();
    let on = 0;
    kin.forEach((id) => {
      const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
      if (!g) return;
      const r = g.getBoundingClientRect();
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      if (cx >= sr.x && cx <= sr.right && cy >= sr.y && cy <= sr.bottom) on++;
    });
    const chip = document.querySelector('#orLabels .or-chip .or-t1');
    return { zoom: state.zoom, kin: kin.size, onScreen: on,
             overlaps: !(sr.left >= nr.right || nr.left >= sr.right),
             chipPx: chip ? +getComputedStyle(chip).fontSize.replace('px', '') : 0 };
  });
  ok('opening flies the camera in', flew.zoom > 1.6, flew.zoom);
  ok('and lands with the whole neighbourhood on screen',
    flew.onScreen === flew.kin, flew);
  ok('the map never crosses into the text, at any zoom', !flew.overlaps, flew);
  /* Counter-scaled, a label renders at the same pixel size it would at
     1x. Uncounter-scaled it would be ~4x that here. */
  ok('a label holds its size while the field grows under it',
    flew.chipPx > 4 && flew.chipPx < 16, flew.chipPx);

  const faded = await page.evaluate(() => {
    const kin = orKin(state.sel);
    const cs = [...document.querySelectorAll('#orLabels .or-chip')];
    const near = cs.filter((c) => kin.has(c.getAttribute('data-for')));
    const far = cs.filter((c) => !kin.has(c.getAttribute('data-for')));
    const op = (c) => +(c.getAttribute('opacity') || 1);
    return { near: near.length, far: far.length,
             nearFull: near.every((c) => op(c) > .9),
             farFaded: far.every((c) => op(c) > 0 && op(c) < .6) };
  });
  ok('a stranger\u2019s label fades but stays on the map',
    faded.far === 0 || faded.farFaded, faded);
  ok('and the neighbourhood\u2019s labels stay at full strength',
    faded.nearFull, faded);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  const cleared = await page.evaluate(() => ({
    muted: [...document.querySelectorAll('#orNodes .or-halo')]
      .filter((h) => (h.getAttribute('fill') || '').indexOf('orStar-mute') >= 0).length,
    zoom: state.zoom,
  }));
  ok('closing the note gives every colour back', cleared.muted === 0, cleared);
  ok('and flies back out to the whole field',
    Math.abs(cleared.zoom - 1) < 0.01, cleared.zoom);

  /* ── the field is alive ──
     Every one of these can die silently: no error, no missing element,
     just an effect that quietly never happens. The first build wired
     two of them inside the loader's CATCH, so they were dead on every
     normal open and nothing said a word. Each gets an assertion. */
  console.log('\n── the field is alive ──');
  const alive = await page.evaluate(() => {
    const anim = (id) => {
      const el = document.getElementById(id);
      return el ? getComputedStyle(el).animationName : 'MISSING';
    };
    return { a: anim('orDustA'), b: anim('orDustB'), c: anim('orDustC'), nod: anim('orNod') };
  });
  /* Stillness is the contract now, and it is worth a test because it
     is worth real milliseconds. The precession and the three dust
     shells moved the whole 1000-unit tree every frame; on a vault of
     several hundred notes that is a thousand gradient-filled elements
     re-rasterised for motion nobody asked to watch. */
  /* The sky turns; the instrument does not. Ninety-odd specks in three
     shells is about 2% of the drawing — worth it for the depth. The
     precession animated a transform on the ANCESTOR of every ring,
     link, star and chip, 97.7%, which is why that one stayed dead. */
  ok('the sky drifts in three shells', alive.a !== 'none' && alive.b !== 'none'
    && alive.c !== 'none' && alive.a !== 'MISSING', alive);
  ok('and the instrument still does not nod', alive.nod === 'none', alive);

  /* The furniture turns at four rates and the inner arcs are the one
     part you can WATCH turn — everything outside them is under a degree
     and a half a second, which is deliberate and also invisible over
     the seconds anybody actually looks. Measured off the composited
     transform, not off the stylesheet: an animation that is declared
     and not running reads perfectly in the source. */
  const rates = await page.evaluate(() => [...document.querySelectorAll('#orRings g.or-turn')]
    .map((g) => 360 / parseFloat(getComputedStyle(g).animationDuration)));
  /* One group turns, not four: the heavy arc closest to the field. It
     is enough to say the instrument is running, and it is the only one
     you could ever actually watch — the outer three were under a
     degree and a half a second, which is invisible over the seconds
     anybody looks and was costing a repaint of the whole tree to be
     invisible with. */
  /* ── almost nothing may be in motion ──
     #orNod wrapped #orView, which holds every ring, link, star and
     chip — so the precession animated a transform on the ANCESTOR of
     the entire drawing, forever. Measured on a 320-note vault: 3787 of
     3876 elements, 97.7%, sat inside a running animation at rest, and
     an animating subtree cannot be cached — it is re-rasterised every
     frame at whatever scale the camera has reached. That was the lag.
     One arc turns now, and the odd star flaring. */
  const motion = await page.evaluate(() => {
    const svg = document.getElementById('orSvg');
    const all = [...svg.querySelectorAll('*')];
    const moving = all.filter((e) => {
      const c = getComputedStyle(e);
      return c.animationName && c.animationName !== 'none'
        && c.animationPlayState === 'running';
    });
    const inside = new Set();
    moving.forEach((g) => { inside.add(g); g.querySelectorAll('*').forEach((x) => inside.add(x)); });
    return { total: all.length, moving: inside.size,
             pct: +(inside.size / all.length * 100).toFixed(1) };
  });
  ok('almost nothing on the map is in continuous motion',
    motion.pct < 12, motion);

  ok('exactly one ring group still turns', rates.length === 1, rates);
  ok('and it is fast enough to read as moving', rates[0] >= 4, rates);

  /* The tow went with the drift: leaning three shells toward the
     pointer is a style write per frame to move things that now hold
     still. Nothing may write to them on a pointermove. */
  const stg = await page.locator('#orStage').boundingBox();
  await page.mouse.move(stg.x + stg.width * 0.8, stg.y + stg.height * 0.25);
  await page.waitForTimeout(220);
  const towed = await page.evaluate(() => ['orDustA', 'orDustB', 'orDustC']
    .map((id) => document.getElementById(id).style.translate || ''));
  ok('the pointer moves nothing', towed.every((t) => !t), towed);
  await page.mouse.move(stg.x + 4, stg.y + 4);

  const flares = await page.evaluate(() => new Promise((res) => {
    let seen = 0;
    const iv = setInterval(() => {
      if (document.querySelector('#orNodes .or-halo[data-lit]')) seen++;
    }, 90);
    setTimeout(() => { clearInterval(iv); res(seen); }, 3200);
  }));
  ok('stars scintillate', flares > 0, flares);

  await page.evaluate(() => { orClose(); });
  await page.waitForTimeout(700);
  /* A tether answers a question. With nothing asked there is nothing to
     answer, and a resting map must carry none of them — otherwise the
     folder lines become permanent furniture and the field is the
     hairball this whole layout exists to avoid. */
  /* ── the tow reads the stage once, not once per event ──
     It used to read a rect — which flushes layout — then write three
     style properties, which dirties it again, on every pointermove. A
     61-step sweep cost 62 forced layouts, and a trackpad on a 120Hz
     panel delivers moves faster than the screen refreshes, so most of
     that was work for frames that never existed. */
  await page.evaluate(() => { window.__rects = 0;
    const g = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      window.__rects++; return g.call(this); }; });
  const stage = await page.evaluate(() => {
    const r = document.getElementById('orStage').getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  for (let i = 0; i <= 60; i++)
    await page.mouse.move(stage.x + 30 + (stage.w - 60) * i / 60, stage.y + stage.h * 0.45);
  await page.waitForTimeout(350);
  const rects = await page.evaluate(() => window.__rects);
  ok('a 61-step sweep costs a handful of forced layouts, not 62',
    rects < 12, rects);

  ok('a resting map carries no surges either',
    await page.evaluate(() => document.querySelectorAll('.or-surge').length === 0));
  ok('a resting map carries no tethers',
    await page.evaluate(() => document.querySelectorAll('#orLinks .or-tether').length === 0));
  const sig = await page.evaluate(() => {
    orOpen('trading/models/cisd');
    return new Promise((res) => setTimeout(() => res({
      beads: document.querySelectorAll('.or-bead').length,
      links: orKin('trading/models/cisd').size,
    }), 200));
  });
  ok('opening sends a bead down every link', sig.beads > 0, sig);
  await page.waitForTimeout(1200);
  const swept = await page.evaluate(() => document.querySelectorAll('.or-bead').length);
  ok('and the beads clear themselves up', swept === 0, swept);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);

  /* ── the legend opens a place, and the isolate lives inside it ──
     A click used to do one thing: dim six sevenths of the sky and
     leave you hunting the rest by eye. There was no route from a
     category to a note except finding its dot. Now it opens the column
     and lists what is filed there; the filter is a control beside the
     list it filters. */
  console.log('\n── which, not whether ──');
  const countAll = (await page.$$('#orNodes .or-node')).length;
  await page.click('#orLegRows [data-cat="mind"]');
  await page.waitForTimeout(350);
  const panel = await page.evaluate(() => {
    const p = document.getElementById('orCatPane');
    const rows = [...document.querySelectorAll('#orCatList [data-open]')];
    const cats = (window.orLayout.catOf) || {};
    return { open: !p.hidden, n: rows.length,
      title: document.getElementById('orCatTitle').textContent,
      allMind: rows.every((r) => cats[r.getAttribute('data-open')] === 'mind'),
      real: (state.notes || []).filter((x) => cats[x.id] === 'mind').length };
  });
  ok('clicking a category opens it as a list', panel.open && panel.n > 0, panel);
  ok('holding every note filed there, and only those',
    panel.n === panel.real && panel.allMind, panel);
  ok('named by the category, not by a note', /mind/i.test(panel.title), panel.title);
  /* And a row is a way in: the note opens, the list stands down. */
  await page.click('#orCatList [data-open]');
  await page.waitForTimeout(400);
  const wentIn = await page.evaluate(() => ({
    note: !document.getElementById('orNote').hidden,
    list: !document.getElementById('orCatPane').hidden,
    sel: state.sel }));
  ok('and a row opens the note it names', wentIn.note && !!wentIn.sel, wentIn);
  ok('one column, so the list stands down', wentIn.list === false, wentIn);
  await page.evaluate(() => orClose());
  await page.waitForTimeout(300);
  /* Now the isolate, from where it lives. */
  await page.click('#orLegRows [data-cat="mind"]');
  await page.waitForTimeout(300);
  await page.click('#orCatOnly');
  await page.waitForTimeout(300);
  const iso = await page.evaluate(() => {
    const gs = [...document.querySelectorAll('#orNodes .or-node')];
    return {
      n: gs.length,
      pressed: document.querySelector('#orCatOnly').getAttribute('aria-pressed'),
      mindDim: gs.filter((g) => g.getAttribute('data-cat') === 'mind')
        .filter((g) => +getComputedStyle(g).opacity < 0.5).length,
      otherLit: gs.filter((g) => g.getAttribute('data-cat') !== 'mind')
        .filter((g) => +getComputedStyle(g).opacity > 0.5).length,
    };
  });
  ok('the panel isolates a category', iso.pressed === 'true' && iso.mindDim === 0
    && iso.otherLit === 0, iso);
  ok('by dimming — the node count is unchanged', iso.n === countAll,
    { before: countAll, after: iso.n });
  await page.click('#orCatOnly');
  await page.waitForTimeout(300);
  const clear = await page.evaluate(() => ({
    pressed: document.querySelector('#orCatOnly').getAttribute('aria-pressed'),
    dim: [...document.querySelectorAll('#orNodes .or-node')]
      .filter((g) => +getComputedStyle(g).opacity < 0.5).length,
  }));
  ok('and clicking again clears it', clear.pressed === 'false' && clear.dim === 0, clear);

  /* ── and a click on empty sky clears it too ──
     The isolate had one way in and one way out: the legend opened the
     panel, and only the panel's own toggle could clear it. But
     state.only is written to storage and the panel is not — so a
     reload came back with every star at .12 and nothing on screen
     offering to undo it. Reproduced: only='trading' survives the
     reload, panel hidden, 44 nodes dimmed, no control for it. */
  await settle(page);
  await page.evaluate(() => { orOpenCat('mind'); orOnly('mind'); });
  await page.waitForTimeout(350);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#orNodes .or-node');
  await settle(page);
  await page.mouse.move(4, 4);
  await page.waitForTimeout(300);
  const stranded = await page.evaluate(() => ({
    only: state.only,
    panel: !document.getElementById('orCatPane').hidden,
    dim: [...document.querySelectorAll('#orNodes .or-node')]
      .filter((g) => +getComputedStyle(g).opacity < .2).length }));
  ok('an isolate survives a reload without its panel', stranded.only === 'mind'
    && stranded.panel === false && stranded.dim > 0, stranded);
  const sky = await page.evaluate(() => {
    const r = document.getElementById('orStage').getBoundingClientRect();
    return { x: r.x + r.width * 0.87, y: r.y + r.height * 0.87 };
  });
  await page.mouse.click(sky.x, sky.y);
  await page.waitForTimeout(500);
  const skyClick = await page.evaluate(() => ({ only: state.only, sel: state.sel,
    dim: [...document.querySelectorAll('#orNodes .or-node')]
      .filter((g) => +getComputedStyle(g).opacity < .2).length }));
  ok('and a click on empty sky puts it down', skyClick.only === null
    && skyClick.sel === null && skyClick.dim === 0, skyClick);
  /* A pan is not a click. Drag the sky and the isolate must survive,
     or the map cannot be moved while a filter is on. */
  await page.evaluate(() => orOnly('mind'));
  await page.waitForTimeout(300);
  await page.mouse.move(sky.x, sky.y);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(sky.x - i * 9, sky.y - i * 6);
  await page.mouse.up();
  await page.waitForTimeout(350);
  ok('but dragging the sky is a pan and keeps it',
    await page.evaluate(() => state.only === 'mind'),
    await page.evaluate(() => state.only));
  await page.mouse.click(sky.x, sky.y);
  await page.waitForTimeout(400);

  /* ── formations ──
     Five ways for the field to stand. Each is only a set of HOME
     positions: the physics is untouched, and a note you moved by hand
     keeps its pin in all five. */
  await page.evaluate(() => { orClose(); orZoom(0); });
  await settle(page);
  const picker = await page.evaluate(() => {
    const b = [...document.querySelectorAll('#orFormRows .or-form')];
    return { n: b.length,
      forms: b.map((x) => x.getAttribute('data-form')),
      /* Icons only, so the NAME has to reach a screen reader some
         other way or this is a control only the sighted can use. */
      named: b.every((x) => (x.getAttribute('aria-label') || '').length > 4),
      iconOnly: b.every((x) => !x.textContent.trim() && x.querySelector('svg')) };
  });
  ok('five formations, as icons', picker.n === 5 && picker.iconOnly, picker);
  ok('and every one of them still has a name for a screen reader',
    picker.named, picker);

  const PINNED = 'trading/models/cisd';
  await page.evaluate((id) => orPin(id), PINNED);
  await settle(page);
  const anchored = await page.evaluate((id) => state.pin[id] && state.pin[id].slice(), PINNED);
  const shapes = [];
  for (const f of picker.forms) {
    await page.evaluate((k) => orForm(k), f);
    await settle(page);
    shapes.push(await page.evaluate((id) => {
      const p = Object.values(state.xy);
      return { form: state.form,
        sig: +p.reduce((a, q) => a + q[0] * 1.7 + q[1] * 2.3, 0).toFixed(0),
        at: state.xy[id] && state.xy[id].slice(),
        drawn: document.querySelectorAll('#orNodes .or-node').length };
    }, PINNED));
  }
  ok('each one arranges the field differently',
    new Set(shapes.map((x) => x.sig)).size === 5, shapes.map((x) => x.sig));
  ok('none of them loses a note', shapes.every((x) => x.drawn === shapes[0].drawn), shapes);
  ok('and a note you pinned by hand stays pinned in all five',
    shapes.every((x) => x.at && Math.hypot(x.at[0] - anchored[0], x.at[1] - anchored[1]) < 2),
    { anchored, at: shapes.map((x) => x.at) });

  /* ── all five keep a note with its folder ──
     This is what the picker is FOR. Two of the originals ranked the
     whole vault globally — Spiral on one arm, Strata in four shells —
     so a category ended up sprayed round the ring with its colour as
     the only trace of it: a map whose whole claim is what is near what,
     arranged so that nothing near each other is related.

     Measured as an angle, not eyeballed: every note's bearing from the
     centre has to land inside its own sector's wedge. The tolerance is
     for the settle, which can push a node a couple of degrees past the
     boundary; a formation that puts notes in a NEIGHBOUR's wedge shows
     up as tens of strays, not two. The first Arms did exactly that —
     twenty of fifty-two — because its sweep was a fixed angle instead
     of the sector's own width. */
  const grouped = [];
  for (const f of picker.forms) {
    await page.evaluate((k) => orForm(k), f);
    await settle(page);
    grouped.push(await page.evaluate(() => {
      const wedge = {};
      (orLayout.sec || []).forEach((s) => { wedge[s.id] = [s.a0, s.a1]; });
      const catOf = orLayout.catOf || {};
      let strays = 0, tot = 0;
      for (const id in state.xy) {
        if (id.indexOf('hub:') === 0) continue;
        const w = wedge[catOf[id]];
        if (!w) continue;
        const p = state.xy[id];
        let a = Math.atan2(p[1] - 500, p[0] - 500) * 180 / Math.PI;
        while (a < w[0] - 180) a += 360;
        while (a >= w[0] + 180) a -= 360;
        tot++;
        if (a < w[0] - 14 || a > w[1] + 14) strays++;
      }
      const r = Object.keys(state.xy).filter((i) => i.indexOf('hub:') !== 0)
        .map((i) => Math.hypot(state.xy[i][0] - 500, state.xy[i][1] - 500));
      return { form: state.form, strays, tot,
               lo: Math.round(Math.min(...r)), hi: Math.round(Math.max(...r)) };
    }));
  }
  ok('every formation keeps every note inside its own folder’s wedge',
    grouped.every((g) => g.tot > 40 && g.strays === 0),
    grouped.filter((g) => g.strays).map((g) => `${g.form}: ${g.strays}/${g.tot}`));

  /* Terraces inherits Strata's claim — distance from the centre IS
     importance — and has to make it inside a wedge rather than across
     the whole ring. Fixed thresholds put a small folder entirely in
     one band and the claim goes with it; quartiles of the sector's own
     ranking always step, whatever shape the folder turns out to be. */
  const terr = await page.evaluate(() => {
    orForm('terraces');
    const H = orLayout.home;
    const byCat = {};
    const catOf = orLayout.catOf || {};
    Object.keys(H).forEach((i) => {
      if (i.indexOf('hub:') === 0 || state.pin[i]) return;
      (byCat[catOf[i]] = byCat[catOf[i]] || [])
        .push(Math.round(Math.hypot(H[i][0] - 500, H[i][1] - 500)));
    });
    const big = Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)[0];
    const all = [].concat(...Object.values(byCat));
    return { cat: big[0], steps: new Set(big[1].map((x) => Math.round(x / 70))).size,
             lo: Math.min(...all), hi: Math.max(...all) };
  });
  ok('terraces steps the biggest folder across the whole field',
    terr.steps >= 4 && terr.hi - terr.lo > 200, terr);

  /* Chord is the one arrangement whose point is the MIDDLE: everything
     out at the rim, so a cross-folder link has to cross open ground and
     which folders talk to each other becomes readable. An empty centre
     is the assertion. */
  const chord = await page.evaluate(() => {
    orForm('chord');
    const H = orLayout.home;
    const r = Object.keys(H).filter((i) => i.indexOf('hub:') !== 0 && !state.pin[i])
      .map((i) => Math.hypot(H[i][0] - 500, H[i][1] - 500));
    return { lo: Math.round(Math.min(...r)), hi: Math.round(Math.max(...r)) };
  });
  ok('chord clears the middle and stands everything on the rim',
    chord.lo > 250, chord);

  /* The three member rings belong to the Orrery. Under Arms or Chord
     they are arcs drawn through empty space. */
  const arcs = await page.evaluate(() => {
    const n = () => document.querySelectorAll('#orRings path[d^="M"]').length;
    orForm('orrery'); const o = n();
    orForm('chord'); const c2 = n();
    return { orrery: o, chord: c2 };
  });
  ok('the orbit arcs are the Orrery’s own and go with it',
    arcs.orrery > arcs.chord, arcs);

  /* A formation from another build, or a hand-edited one, must not
     leave the field with no arrangement at all — every branch in
     orLayout is keyed off this string. */
  await page.evaluate(() => {
    const v = JSON.parse(localStorage.getItem('orrery.v1') || '{}');
    v.form = 'nonsense';
    localStorage.setItem('orrery.v1', JSON.stringify(v));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await waitPaint(page);
  ok('a formation it does not know falls back rather than blanking',
    await page.evaluate(() => state.form === 'orrery'
      && document.querySelectorAll('#orNodes .or-node').length > 10));
  await page.evaluate(() => { orForm('orrery'); });
  await settle(page);

  /* ── what the sweep found ──
     Each of these was reproduced before it was fixed; each is written
     as the thing that was WRONG, so a regression reads as the same
     sentence failing rather than as a mystery. */

  /* A stored pin must come back reachable. Finite is not renderable —
     9e99 passes Number.isFinite and then SVG rejects the attribute,
     three console errors a paint and no map — and a pin dragged to the
     window corner at high zoom survives the reload invisible at the
     default camera. */
  const strayPins = await page.evaluate(() => {
    localStorage.setItem('orrery.v1', JSON.stringify({ v: 1, pin: {
      'body/hydration': [9e99, 9e99],
      'trading/models/cisd': [-530.6, -156.2] } }));
    return true;
  });
  await page.reload({ waitUntil: 'networkidle' });
  await waitPaint(page);
  await page.waitForTimeout(400);
  const pins = await page.evaluate(() => {
    const box = document.getElementById('orSvg').getBoundingClientRect();
    const on = (id) => {
      const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
      if (!g) return false;
      const r = g.getBoundingClientRect();
      return r.right > box.left && r.left < box.right
          && r.bottom > box.top && r.top < box.bottom;
    };
    return { huge: state.pin['body/hydration'],
             off: state.pin['trading/models/cisd'],
             bothOnStage: on('body/hydration') && on('trading/models/cisd') };
  });
  ok('a stored pin comes back inside the field',
    pins.huge.every((v) => v >= 15 && v <= 985)
    && pins.off.every((v) => v >= 15 && v <= 985), pins);
  ok('and is somewhere the default camera can actually see',
    pins.bothOnStage, pins);
  ok('and it costs no console errors to load one', errs.length === 0, errs.slice(0, 3));
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await waitPaint(page);
  await page.waitForTimeout(300);

  /* A note that stops existing under an open pane takes the pane with
     it. Dropping the id was a third of closing: the pane stayed open
     on a note that was gone, sel stayed in storage so it came back
     every reload, and the two cards stayed inert for the session. */
  await page.evaluate(() => orOpen('trading/models/cisd'));
  await settle(page);
  const vanished = await page.evaluate(() => {
    state.notes = [{ id: 'craft/three', title: 'Three', cat: 'craft', tags: [],
      links: [], aliases: [], body: 'x', words: 1, mtime: 0 }];
    state.loose = 0;
    if (state.sel && !state.notes.some((n) => n.id === state.sel)) orDropSel();
    orPaint();
    return { sel: state.sel,
      stored: JSON.parse(localStorage.getItem('orrery.v1') || '{}').sel,
      paneOpen: !document.getElementById('orNote').hidden };
  });
  /* The cards fade back rather than snapping, so this reads the
     landing, not the flight — measured mid-transition it says .17 and
     blames the wrong thing. */
  await page.waitForTimeout(700);
  const cards = await page.evaluate(() => {
    const lg = document.getElementById('orLegend');
    return { legend: +getComputedStyle(lg).opacity,
             inert: lg.hasAttribute('inert') || lg.inert === true };
  });
  ok('a note vanishing under the pane closes the pane', !vanished.paneOpen, vanished);
  ok('and forgets it in storage, so it does not come back on reload',
    vanished.sel === null && !vanished.stored, vanished);
  ok('and gives the legend back rather than leaving it inert',
    cards.legend === 1 && !cards.inert, cards);
  await page.reload({ waitUntil: 'networkidle' });
  await waitPaint(page);
  await settle(page);

  /* One hand at a time. touch-action is none, so the app owns every
     finger and no pointercancel ever arrives — a second press used to
     overwrite state.drag and orphan the held node: FIX=1, no pin, no
     ring saying so, and nothing to release it. */
  const twoHands = await page.evaluate(() => {
    const id = 'trading/models/cisd';
    const g = document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`);
    const r = g.getBoundingClientRect();
    const svg = document.getElementById('orSvg');
    svg.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, bubbles: true,
      button: 0, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
    const first = state.drag && state.drag.id;
    svg.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 2, bubbles: true,
      button: 0, clientX: r.x + 260, clientY: r.y + 180 }));
    const after = state.drag && state.drag.id;
    svg.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }));
    return { first, after };
  });
  ok('a second finger does not steal the node the first is holding',
    twoHands.first === twoHands.after, twoHands);
  await settle(page);
  const orphans = await page.evaluate(() => {
    const S = orSim.S || {}; let n = 0;
    if (S.FIX) for (let i = 0; i < S.n; i++) if (S.FIX[i] && !state.pin[S.ids[i]]) n++;
    return n;
  });
  ok('and no node is left frozen with no pin to say why', orphans === 0, orphans);

  /* A wiki-link's words take body ink. The pane has no card behind it
     on purpose, so every colour composites over the photograph — and
     the accent is the one token that moves with the PALETTE. On
     'turtle' in the dark it measured 3.82:1 under the link rows while
     every other run of text in the pane passed. */
  ok('a wiki-link is coloured by the ink, not by the accent',
    await page.evaluate(() => {
      const a = document.querySelector('.or-wl');
      if (!a) return true;
      const s2 = getComputedStyle(a);
      const ink = getComputedStyle(document.body).color;
      return s2.color === ink;
    }));

  /* ── search dims and holds the shape ── */
  await page.mouse.move(0, 0);
  const shape0 = await positions(page);
  const q = 'inversion';
  const wantLit = new Set();
  seed.filter((n) => n.title.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
    || n.tags.some((t) => t.toLowerCase().includes(q)))
    .forEach((n) => { wantLit.add(n.id); wantLit.add('hub:' + n.cat); });
  await page.fill('#orSearch', q);
  await page.waitForTimeout(500);
  const found = await page.evaluate(() => {
    const lit = [], n = [];
    document.querySelectorAll('#orNodes .or-node').forEach((g) => {
      n.push(g);
      if (+getComputedStyle(g).opacity > 0.5) lit.push(g.getAttribute('data-id'));
    });
    return { lit: lit.sort(), n: n.length };
  });
  ok('search dims every non-match and nothing else',
    JSON.stringify(found.lit) === JSON.stringify([...wantLit].sort()),
    { got: found.lit, want: [...wantLit].sort() });
  const shape1 = await positions(page);
  ok('and leaves the map\'s shape intact', found.n === countAll
    && JSON.stringify(shape1) === JSON.stringify(shape0));
  await page.fill('#orSearch', '');
  await page.waitForTimeout(500);

  /* ── a tether goes where its note goes ──
     Selection decides WHICH lines exist; the filter decides which stars
     are still there. Two narrows, and the tether only ever obeyed the
     first: search one word, fifty notes fall to .12, and their dashed
     lines went on running bright down to the sun — four lines to
     nowhere, and the only thing left on screen insisting those notes
     were there. */
  await page.evaluate(() => orOpen('trading/models/cisd'));
  await settle(page);
  await page.mouse.move(4, 4);
  await page.fill('#orSearch', 'displacement');
  await page.waitForTimeout(600);
  const tfilt = await page.evaluate(() => {
    const t = [...document.querySelectorAll('#orLinks .or-tether')];
    const off = t.filter((x) => {
      const g = document.querySelector(`#orNodes [data-id="${CSS.escape(x.getAttribute('data-a'))}"]`);
      const star = g && +(g.getAttribute('opacity') || 1) < .2;
      const line = +x.getAttribute('opacity') < .1;
      return star !== line;
    });
    return { n: t.length, disagree: off.length,
             ops: [...new Set(t.map((x) => x.getAttribute('opacity')))] };
  });
  ok('a filtered-out note takes its tether down with it',
    tfilt.n > 0 && tfilt.disagree === 0, tfilt);
  ok('and the ones that survive the filter keep theirs',
    tfilt.ops.some((o) => +o > .4), tfilt);
  await page.fill('#orSearch', '');
  await page.waitForTimeout(500);

  /* ── letting go hands back the width it was painted at ──
     orDragStart.lit restored a literal '.8', which was every link's
     width the day it was written and has not been since: a selected
     edge paints at 1.5 and a tether at 1. So the one line your hand had
     just been on came back thinner than the ones beside it, and stayed
     that way — nothing rewrites width until the next full paint. */
  await settle(page);
  const hitW = await page.evaluate(() => {
    const r = document.querySelector('#orNodes [data-id="trading/models/cisd"] .or-corec')
      .getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  const widths = () => page.evaluate(() => {
    const pick = (sel) => [...new Set([...document.querySelectorAll(sel)]
      .map((t) => t.getAttribute('stroke-width')))];
    return { teth: pick('#orLinks .or-tether'),
             sel: pick('#orLinks path[data-a]:not(.or-tether)[stroke-width="1"]') };
  });
  const wBefore = await widths();
  await page.mouse.move(hitW.x, hitW.y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(hitW.x + i * 12, hitW.y + i * 8);
  await page.mouse.up();
  await settle(page);
  const wAfter = await widths();
  ok('a released tether is the width it was drawn at',
    JSON.stringify(wAfter.teth) === JSON.stringify(wBefore.teth)
    && wAfter.teth.join() === '1', { wBefore, wAfter });
  ok('and so is a released link of the selection',
    wAfter.sel.length > 0 && wAfter.sel.join() === '1', wAfter);
  await page.evaluate(() => orClose());
  /* Wait for the camera to actually land, not for a guess at how long
     that takes. Closing glides the view back out, and a zoom DURING a
     flight now correctly picks up the transform the camera has
     reached rather than its destination — so a fixed 500ms wait here
     left the next block zooming from mid-glide and reading scale(1.29)
     where it asserts 1.25. It was passing on timing. */
  await page.waitForFunction(() =>
    !document.getElementById('orSvg').classList.contains('or-flying'),
    null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(150);

  /* ── the camera rides #orView, never the svg ── */
  console.log('\n── the camera ──');
  const cam0 = await page.evaluate(() => ({
    view: document.getElementById('orView').getAttribute('transform'),
    svgAttr: document.getElementById('orSvg').getAttribute('transform'),
    svgCss: getComputedStyle(document.getElementById('orSvg')).transform,
  }));
  await page.click('#orZoomIn');
  await page.waitForTimeout(250);
  const cam1 = await page.evaluate(() => ({
    view: document.getElementById('orView').getAttribute('transform'),
    svgAttr: document.getElementById('orSvg').getAttribute('transform'),
    svgCss: getComputedStyle(document.getElementById('orSvg')).transform,
  }));
  ok('zoom moves #orView\'s transform', cam1.view !== cam0.view
    && /scale\(1\.25\)/.test(cam1.view), cam1.view);
  ok('and never the <svg>\'s', cam1.svgAttr === null && cam1.svgCss === 'none', cam1);

  const bg = await page.evaluate(() => {
    const stage = document.getElementById('orStage').getBoundingClientRect();
    for (let dy = 40; dy < stage.height - 40; dy += 48)
      for (let dx = 40; dx < stage.width - 40; dx += 48) {
        const x = stage.right - dx, y = stage.top + dy;
        const el = document.elementFromPoint(x, y);
        if (!el || !el.closest) continue;
        if (el.closest('.or-node') || el.closest('#orLegend')
          || el.closest('.or-zoom')) continue;
        if (!el.closest('#orStage')) continue;
        return { x, y };
      }
    return null;
  });
  ok('there is open sky to grab', !!bg);
  if (bg) {
    await page.mouse.move(bg.x, bg.y);
    await page.mouse.down();
    await page.mouse.move(bg.x + 30, bg.y + 20, { steps: 4 });
    await page.mouse.up();
    await page.waitForTimeout(250);
    const cam2 = await page.evaluate(() => ({
      view: document.getElementById('orView').getAttribute('transform'),
      svgAttr: document.getElementById('orSvg').getAttribute('transform'),
    }));
    ok('dragging the sky pans #orView', cam2.view !== cam1.view && cam2.svgAttr === null,
      cam2.view);
  }
  await page.click('#orZoomFit');
  await page.waitForTimeout(250);
  ok('and the camera comes home', await page.evaluate(() =>
    document.getElementById('orView').getAttribute('transform') === 'translate(0 0) scale(1)'));

  /* ── relayout is the one honest destroyer ── */
  await page.click('#orFit');
  await page.waitForTimeout(400);
  const fit = await page.evaluate((ids) => ({
    pos: JSON.parse(localStorage.getItem('orrery.v1') || '{}').pos,
    pin: JSON.parse(localStorage.getItem('orrery.v1') || '{}').pin,
    t: ids.map((id) =>
      document.querySelector(`#orNodes [data-id="${CSS.escape(id)}"]`).getAttribute('transform')),
  }), [hitC.id, kid]);
  /* Relayout releases every pin and clears every filed position. It is
     the one honest destroyer on this screen, and what it destroys is an
     arrangement you can rebuild by dragging — which is why it needs no
     bin behind it. */
  ok('relayout clears every filed position', !fit.pos || Object.keys(fit.pos).length === 0,
    fit.pos);
  ok('and releases every pin', !fit.pin || Object.keys(fit.pin).length === 0, fit.pin);

  /* ── the folding panel, shut by default and remembered ── */
  console.log('\n── the fold ──');
  await page.click('.rail [data-view="vault"]');
  await page.waitForTimeout(300);
  const fold0 = await page.evaluate(() => ({
    vault: !document.getElementById('orVaultSection').hidden,
    map: document.getElementById('orMapSection').hidden,
    exp: document.getElementById('orHowT').getAttribute('aria-expanded'),
    body: document.getElementById('orHowB').hidden,
    chev: getComputedStyle(document.querySelector('#orHowT .or-ic')).transform,
  }));
  ok('the vault view opens and the panel defaults SHUT',
    fold0.vault && fold0.map && fold0.exp === 'false' && fold0.body === true
    && fold0.chev === 'none', fold0);
  await page.click('#orHowT');
  await page.waitForTimeout(400);
  const fold1 = await page.evaluate(() => {
    const m = getComputedStyle(document.querySelector('#orHowT .or-ic')).transform
      .match(/matrix\((-?[\d.]+), (-?[\d.]+), (-?[\d.]+), (-?[\d.]+)/);
    return {
      exp: document.getElementById('orHowT').getAttribute('aria-expanded'),
      body: document.getElementById('orHowB').hidden,
      a: m ? +m[1] : 9, d: m ? +m[4] : 9,
    };
  });
  ok('opening rotates the chevron 180 degrees, not 90',
    fold1.exp === 'true' && fold1.body === false
    && Math.abs(fold1.a + 1) < 0.02 && Math.abs(fold1.d + 1) < 0.02, fold1);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => !document.getElementById('orVaultSection').hidden,
    { timeout: 15000 });
  await page.waitForTimeout(400);
  const fold2 = await page.evaluate(() => ({
    exp: document.getElementById('orHowT').getAttribute('aria-expanded'),
    body: document.getElementById('orHowB').hidden,
  }));
  ok('and the fold is remembered across a reload',
    fold2.exp === 'true' && fold2.body === false, fold2);

  /* ── the wall — after all of that, the keys ── */
  console.log('\n── the wall ──');
  const keys = await page.evaluate(() => Object.keys(localStorage));
  const allowed = new Set(['orrery.v1', 'arc.theme', 'arc.palette']);
  ok('only its own key and the shell\'s two ever exist',
    keys.every((k) => allowed.has(k)) && keys.includes('orrery.v1'), keys);
  ok('no money, habit, reminder or backtest key was touched',
    keys.every((k) => !/ledger|habit|reminder|backtest|checkin/i.test(k)), keys);

  ok('no page errors through any of it', errs.length === 0, errs.slice(0, 4));
  await browser.close();

  /* ═══ the fallback pass — a browser with no directory picker ═══ */
  console.log('\n── no picker, still a door ──');
  const c = await open({ colorScheme: 'dark' });
  /* Kill the picker BEFORE any page script runs: 127.0.0.1 is a secure
     context, so headless Chromium has one, and the fallback branch
     would otherwise never be walked. */
  await c.page.addInitScript(() => { window.showDirectoryPicker = undefined; });
  await c.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(c.page);
  await c.page.click('.rail [data-view="vault"]');
  await c.page.waitForTimeout(300);
  const inp = await c.page.evaluate(() => {
    const i = document.getElementById('orInput');
    return i ? { type: i.getAttribute('type'), dir: i.hasAttribute('webkitdirectory'),
                 multi: i.hasAttribute('multiple') } : null;
  });
  ok('the vault view holds a real directory input', inp && inp.type === 'file'
    && inp.dir && inp.multi, inp);
  await c.page.evaluate(() => {
    document.getElementById('orInput').click = () => { window.__orPicked = true; };
  });
  await c.page.click('#orPick');
  await c.page.waitForTimeout(400);
  ok('and picking without a picker routes to it', await c.page.evaluate(() =>
    window.__orPicked === true));
  ok('no page errors on the fallback path', c.errs.length === 0, c.errs.slice(0, 3));

  /* ── chips never bury one another ──
     The study's chips never touch, and a pile of labels in a dense
     sector is exactly the graph-library clutter this screen exists
     not to be. Measured as composited client rects, at the default
     fit and zoomed into the densest sector — the collision pass says
     it resolves, so hold it to that. */
  await c.page.evaluate(() => { document.querySelector('[data-view="map"]').click(); });
  await c.page.waitForTimeout(500);
  const overlaps = () => c.page.evaluate(() => {
    const rs = [...document.querySelectorAll('#orLabels .or-chip')]
      .map(ch => ch.getBoundingClientRect()).filter(r => r.width > 0);
    const bad = [];
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const a = rs[i], b = rs[j];
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1) bad.push([i, j, Math.round(ox), Math.round(oy)]);
    }
    return { n: rs.length, bad };
  });
  let ov = await overlaps();
  /* At rest there are now NONE, and that is the point: a chip is an
     answer and nothing has been asked. Forty of them standing on a
     field of fifty-nine stars was a list with a picture behind it. */
  ok('a map nobody is pointing at carries no chips at all',
    ov.n === 0, ov);
  /* Hover is the question. The collision pass still has to hold, so
     ask one and measure what comes back. */
  await c.page.evaluate(() => {
    const n = document.querySelector('#orNodes .or-hub') ||
              document.querySelector('#orNodes .or-node');
    const r = n.getBoundingClientRect();
    n.dispatchEvent(new PointerEvent('pointerover',
      { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
  });
  await c.page.waitForTimeout(400);
  ov = await overlaps();
  ok('hovering names it and its neighbours', ov.n > 2, ov);
  ok('and those chips share no pixels', ov.bad.length === 0, ov.bad.slice(0, 5));
  await c.page.evaluate(() => {
    const hub = [...document.querySelectorAll('#orNodes .or-node')]
      .find(n => (n.getAttribute('data-id') || '').indexOf('hub:growth') === 0)
      || document.querySelector('#orNodes .or-node');
    const r = hub.getBoundingClientRect();
    const svg = document.getElementById('orSvg');
    for (let i = 0; i < 4; i++)
      svg.dispatchEvent(new WheelEvent('wheel', { deltaY: -120, bubbles: true,
        clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
  });
  await c.page.waitForTimeout(450);
  ov = await overlaps();
  ok('and still none zoomed into the densest sector', ov.bad.length === 0, ov.bad.slice(0, 5));

  /* ── the eyebrow shares, the path survives ──
     The re-file select used to size itself to its widest option and
     starve the path beside it to 6px. The address must stay readable
     beside the control. */
  await c.page.evaluate(() => orOpen('trading/models/cisd'));
  await c.page.waitForTimeout(500);
  const eb = await c.page.evaluate(() => {
    const path = document.getElementById('orNotePath').getBoundingClientRect();
    const sel = (window.orRefile && orRefile.sel)
      ? orRefile.sel.getBoundingClientRect() : { width: 0 };
    return { path: Math.round(path.width), sel: Math.round(sel.width) };
  });
  ok('the path keeps a readable share of the eyebrow', eb.path >= 90, eb);
  ok('the re-file control hugs the word it shows', eb.sel > 0 && eb.sel <= 130, eb);
  ok('no page errors through the chip and eyebrow checks',
    c.errs.length === 0, c.errs.slice(0, 3));
  await c.browser.close();

  /* ═══ Jarvis — a librarian, and only a librarian ═══
     Two things are being held here. That every answer is the truth the
     index already holds — the counts and the ids are recomputed from
     state and compared, never read out of his sentence and trusted —
     and that asking him anything costs no request. The second is the
     whole reason the app is allowed to read your notes at all, so it
     is measured rather than asserted in a comment. */
  /* ═══ the concordance ═══
     The rim stopped being texture and became the one place on screen
     that says what this vault is ABOUT. Which means it can now be
     WRONG, and everything below is held against the vault itself. */
  console.log('\n── the rim ──');
  {
    /* Its own browser: the pass above closes its own, and a block that
       borrows a handle somebody else owns fails with "target closed"
       three hundred lines from the close that did it. */
    const c = await open({ colorScheme: 'dark' });
    await c.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
    await waitPaint(c.page);
    await settle(c.page);
    const R = await c.page.evaluate(() => {
      const runs = Array.from(document.querySelectorAll('#orRings text'))
        .map((t) => ({ reg: t.getAttribute('class'),
                       size: +t.getAttribute('font-size'),
                       fill: t.getAttribute('fill'),
                       op: +t.getAttribute('opacity'),
                       txt: (t.textContent || '').trim() }));
      const deg = orLayout.deg || {}, note = orLayout.note || {}, mem = orLayout.mem || {};
      const want = {};
      (orLayout.sec || []).forEach((s) => {
        const ids = (mem[s.id] || []).slice()
          .sort((a, b) => (deg[b] || 0) - (deg[a] || 0) || (a < b ? -1 : 1));
        want[(orLayout.label[s.id] || s.id).toUpperCase()] =
          ids.length ? (note[ids[0]] || {}).title : null;
      });
      /* Which way round each sector's contents path is drawn. Text on a
         path runs the way the path runs, so a bottom-half sector drawn
         forwards is upside down and nothing about its bounding box
         says so. Read the path's first point instead. */
      const spin = (orLayout.sec || []).map((s) => {
        const t = Array.from(document.querySelectorAll('#orRings text'))
          .filter((n) => n.getAttribute('class') === 'or-rim-n'
            && n.textContent.trim() === (orLayout.label[s.id] || s.id).toUpperCase())[0];
        if (!t) return null;
        const d = document.querySelector(t.querySelector('textPath').getAttribute('href'))
          .getAttribute('d');
        const m = d.match(/^M([-\d.]+) ([-\d.]+)/);
        const P = orLayout.polar;
        const at0 = P(474, s.a0), at1 = P(481, s.a1);
        const d0 = Math.hypot(+m[1] - at0[0], +m[2] - at0[1]);
        const d1 = Math.hypot(+m[1] - at1[0], +m[2] - at1[1]);
        return { id: s.id, bottom: Math.sin(s.mid * Math.PI / 180) > 0, startsAtEnd: d1 < d0 };
      }).filter(Boolean);
      return { runs, want, spin, tick: document.querySelectorAll('#orRings [stroke-dasharray]').length,
               els: document.getElementById('orRings').querySelectorAll('*').length };
    });

    const names = R.runs.filter((r) => r.reg === 'or-rim-n').map((r) => r.txt).sort();
    const wantNames = Object.keys(R.want).sort();
    ok('the rim names every region on the map',
      JSON.stringify(names) === JSON.stringify(wantNames), { names, wantNames });
    ok('and each name is mixed off its own category token, not a literal',
      R.runs.filter((r) => r.reg === 'or-rim-n').length === 7
      && R.runs.filter((r) => r.reg === 'or-rim-n')
        .every((r) => /color-mix\(in srgb, var\(--or-cat-[a-z]+\) \d+%, var\(--ink\)\)/.test(r.fill)),
      R.runs.filter((r) => r.reg === 'or-rim-n').map((r) => r.fill).slice(0, 2));

    /* The contents line is the vault's own ranking, not an alphabet:
       most-linked first is what makes the rim worth reading. */
    const lead = {};
    R.runs.filter((r) => r.reg === 'or-rim-c').forEach((r) => { lead[r.txt.split('  ·  ')[0]] = true; });
    const wantLead = Object.values(R.want).filter(Boolean);
    ok('each region opens its contents with its most-linked note',
      wantLead.filter((t) => lead[t]).length >= Math.min(5, wantLead.length),
      { got: Object.keys(lead), want: wantLead });

    ok('the bottom half is drawn backwards so its words are not upside down',
      R.spin.length >= 6 && R.spin.every((s) => s.startsAtEnd === s.bottom), R.spin);

    ok('the tick rim and the dotted ring it replaced are gone', R.tick === 0);
    ok('and it costs a couple of hundred elements, not a couple of thousand',
      R.els > 100 && R.els < 400, R.els);

    /* An isolate that left all seven names at full weight would be the
       loudest contradiction on the screen. */
    await c.page.evaluate(() => orOnly('body'));
    await c.page.waitForTimeout(400);
    const dim = await c.page.evaluate(() => {
      const out = {};
      document.querySelectorAll('#orRings text').forEach((t) => {
        if (t.getAttribute('class') !== 'or-rim-n') return;
        out[t.textContent.trim()] = +t.getAttribute('opacity');
      });
      return out;
    });
    ok('an isolate dims every region but the one you kept',
      dim.BODY === 1 && Object.entries(dim).filter(([k]) => k !== 'BODY')
        .every(([, v]) => v < .4), dim);
    await c.page.evaluate(() => orOnly('body'));
    await c.page.waitForTimeout(300);
    const back = await c.page.evaluate(() => Array.from(document.querySelectorAll('#orRings text'))
      .filter((t) => t.getAttribute('class') === 'or-rim-n')
      .every((t) => +t.getAttribute('opacity') === 1));
    ok('and clearing it brings them all back', back);
    ok('no page errors through the rim', c.errs.length === 0, c.errs.slice(0, 3));
    await c.browser.close();
  }

  console.log('\n── Jarvis ──');
  const j = await open({ colorScheme: 'dark' });
  const off = [];
  j.page.on('request', (r) => {
    const u = r.url();
    if (u.indexOf(BASE) !== 0 && u.indexOf('data:') !== 0 && u.indexOf('blob:') !== 0)
      off.push(u);
  });
  await j.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(j.page);
  await settle(j.page);

  /* Everything he can be asked, asked through the real function, with
     the page's own numbers computed alongside for comparison. */
  const jAsk = (q) => j.page.evaluate((q) => {
    const box = document.getElementById('orSearch');
    if (box) box.value = q;
    const ret = orAsk(q);
    const rp = document.getElementById('orReply');
    return {
      ret, hidden: rp.hidden, text: rp.textContent, html: rp.innerHTML,
      rows: Array.from(rp.querySelectorAll('[data-open]'))
        .map((b) => b.getAttribute('data-open')),
      q: state.q, sel: state.sel, cat: state.catPane,
    };
  }, q);

  /* ── a category is a panel, not a paragraph ── */
  const jcat = await jAsk('trading');
  const jcatN = await j.page.evaluate(() => ((orLayout.mem || {}).trading || []).length);
  ok('a category opens its panel', jcat.cat === 'trading', jcat.cat);
  ok('and he says the number the map holds',
    !jcat.hidden && jcat.text.indexOf(`${jcatN} notes`) >= 0, { said: jcat.text, n: jcatN });

  /* ── a folder is a place you can walk into ──
     The point of the whole feature: ask for a folder, get its notes as
     things you can press, and see them lit on the map at the same time.
     A printed list would be half of that. */
  const jfold = await jAsk('trading/models');
  const jfoldIds = await j.page.evaluate(() => (state.notes || [])
    .filter((n) => n.id.indexOf('trading/models/') === 0).map((n) => n.id).sort());
  ok('a folder answers with every note in it',
    JSON.stringify(jfold.rows.slice().sort()) === JSON.stringify(jfoldIds),
    { said: jfold.rows, real: jfoldIds });
  ok('and lights that folder on the map as it lists it',
    jfold.q === 'trading/models', jfold.q);
  await j.page.click('#orReply [data-open]');
  await j.page.waitForTimeout(400);
  const jrow = await j.page.evaluate(() => ({ sel: state.sel,
    hidden: document.getElementById('orReply').hidden }));
  ok('the rows he offers are doors',
    jfoldIds.indexOf(jrow.sel) >= 0 && jrow.hidden, jrow);

  /* ── he is in the field, not in the bar ──
     The top bar already carried five controls. A sixth, labelled, read
     as a mode you put the app into rather than a property of the box
     you type in. */
  const jseat = await j.page.evaluate(() => {
    const b = document.getElementById('orVoiceBtn');
    const f = document.querySelector('.search');
    const bar = document.querySelector('.topbar');
    const r = b.getBoundingClientRect(), fr = f.getBoundingClientRect();
    return {
      inField: f.contains(b),
      inside: r.left >= fr.left && r.right <= fr.right + 1
           && r.top >= fr.top - 1 && r.bottom <= fr.bottom + 1,
      named: (b.getAttribute('aria-label') || '').length > 3,
      text: b.textContent.trim(),
      barButtons: bar.querySelectorAll(':scope > button, :scope > .pal > button').length,
    };
  });
  ok('the voice control sits inside the field he is asked in',
    jseat.inField && jseat.inside, jseat);
  ok('icon only, but it still has a name to read out',
    jseat.text === '' && jseat.named, jseat);
  ok('and it took a control off the top bar rather than adding one',
    jseat.barButtons === 4, jseat);

  /* ── his answer is on top of the map, not under it ──
     The strip is anchored in the top bar and the cards in the stage, so
     they meet in the root stacking context. At z-index 4 the Categories
     card at 5 painted straight over the answer — which is worse than no
     answer, because the answer was there and unreadable. Measured by
     asking the page what is actually at those pixels. */
  await jAsk('trading/models');
  await j.page.waitForTimeout(250);
  const jtop = await j.page.evaluate(() => {
    const rp = document.getElementById('orReply');
    const r = rp.getBoundingClientRect();
    const leg = document.getElementById('orLegend').getBoundingClientRect();
    const pts = [[r.left + 14, r.top + 10], [r.left + 14, r.bottom - 10],
                 [r.left + r.width / 2, r.top + r.height / 2]];
    return {
      overlapsCard: !(r.right < leg.left || r.left > leg.right
                   || r.bottom < leg.top || r.top > leg.bottom),
      covered: pts.filter(([x, y]) => {
        const el = document.elementFromPoint(x, y);
        return !el || !rp.contains(el) && el !== rp;
      }).length,
    };
  });
  ok('his answer overlaps the card it used to hide behind',
    jtop.overlapsCard, jtop);
  ok('and nothing is drawn over it', jtop.covered === 0, jtop);

  /* ── the strip is legible, measured off the composited pixels ──
     The chips are a pairing that exists nowhere else in the shell —
     var(--ink) over a 12% wash of the accent — and an accent this app
     lets you change. A token that resolved to nothing would inherit
     rather than fall back, look deliberate, and run at 1.7:1. */
  await jAsk('trading/models');
  await j.page.waitForTimeout(200);
  const jbox = await j.page.evaluate(() => {
    const rp = document.getElementById('orReply');
    const r = rp.getBoundingClientRect();
    const b = rp.querySelector('b'), c = rp.querySelector('.or-rl');
    const box = (e) => { const q = e.getBoundingClientRect();
      return { x: q.x, y: q.y, w: q.width, h: q.height }; };
    return { clip: { x: r.x - 2, y: r.y - 2, width: r.width + 4, height: r.height + 4 },
             items: [{ label: 'sentence', ...box(b) }, { label: 'chip', ...box(c) }] };
  });
  const jpx = await patches(j.page, jbox.clip, jbox.items, 1);
  for (const q of jpx)
    ok(`his ${q.label} is readable against what is behind it`,
      ratio(q.lo, q.hi) >= 4.5, { label: q.label, ratio: +ratio(q.lo, q.hi).toFixed(2) });
  ok('both text runs in the strip were actually found', jpx.length === 2,
    jpx.map((q) => q.label));

  /* ── a note, described by figures that are checked ──
     Every number in the sentence is recomputed here from the note
     itself. He is allowed to be terse; he is not allowed to be wrong. */
  const jnote = await jAsk('where is CISD');
  const jreal = await j.page.evaluate(() => {
    const n = (state.notes || []).filter((x) => x.id === 'trading/models/cisd')[0];
    return n ? { out: (n.links || []).length, back: orBacklinks(n.id).length,
                 words: n.words, title: n.title } : null;
  });
  ok('a note by name opens the note', jnote.sel === 'trading/models/cisd', jnote.sel);
  ok('and every figure in his sentence is the real one',
    jreal && jnote.text.indexOf(`${jreal.words} words`) >= 0
    && jnote.text.indexOf(`${jreal.out} out`) >= 0
    && jnote.text.indexOf(`${jreal.back} in`) >= 0, { said: jnote.text, real: jreal });

  /* ── the grammar is ordered, and the order is load-bearing ──
     `review` is a word in the advice branch AND the title of a note in
     this vault. Asking what links to it must reach backlinks first;
     if the branches are ever reordered this is what says so. */
  const jback = await jAsk('what links to the review');
  /* Resolved the way he resolves it. orMd.resolve alone answers null
     here — the file is `the-review` and the question says "the review",
     which is a title match, not a basename one. */
  const jbackReal = await j.page.evaluate(() => {
    const id = orMd.resolve('the review') || orAsk.byTitle('the review')[0];
    return id ? { id, n: orBacklinks(id).length,
                  ids: orBacklinks(id).slice(0, 8).map((r) => r.id).sort() } : null;
  });
  ok('"what links to the review" is a backlink question, not an advice one',
    jbackReal && jback.ret === jbackReal.id
    && jback.text.indexOf('cannot form a view') < 0, { ret: jback.ret, real: jbackReal });
  ok('and the notes he names are the notes that link there',
    jbackReal && jbackReal.n > 0
    && JSON.stringify(jback.rows.slice().sort())
      === JSON.stringify(jbackReal.ids), { said: jback.rows, real: jbackReal });

  /* ── the one refusal ──
     He has no model behind him and the honest answer is to say so and
     hand the question on. A build that quietly started improvising a
     verdict would still pass every other assertion in this file. */
  const jadv = await jAsk('advice on CISD');
  ok('asked for a view, he says he has none',
    jadv.text.indexOf('cannot form a view') >= 0, jadv.text.slice(0, 90));
  ok('and hands over a prompt naming the real file',
    jadv.text.indexOf('trading/models/cisd.md') >= 0
    || /copied/.test(jadv.text), jadv.text.slice(-140));

  /* ── two different kinds of nothing ──
     An orphan is a note you never joined to anything; a loose end is a
     link to a note that does not exist. Answering one with the other
     loses the useful half. */
  const jorph = await jAsk('orphans');
  const jorphReal = await j.page.evaluate(() => {
    const seen = new Set();
    for (const e of (state.edges || [])) { seen.add(e[0]); seen.add(e[1]); }
    return (state.notes || []).filter((n) => !seen.has(n.id)).map((n) => n.id).sort();
  });
  ok('orphans are the notes nothing joins',
    jorphReal.length
      ? JSON.stringify(jorph.rows.slice().sort()) === JSON.stringify(jorphReal.slice(0, 10))
      : /No orphans/.test(jorph.text), { said: jorph.rows, real: jorphReal });
  const jends = await jAsk('loose ends');
  const jendsN = await j.page.evaluate(() => orLoose());
  ok('loose ends are a different question with a different number',
    jends.ret === 'ends' && jends.text.indexOf(String(jendsN)) === 0,
    { said: jends.text.slice(0, 60), real: jendsN });

  /* ── he counts what is there ── */
  const jhow = await jAsk('how many in body');
  const jhowN = await j.page.evaluate(() => ((orLayout.mem || {}).body || []).length);
  ok('a count is the map’s own count',
    jhow.text.indexOf(String(jhowN)) === 0, { said: jhow.text, real: jhowN });

  /* ── a miss opens nothing ──
     The tempting failure is to guess: open the nearest note and hope.
     A second brain that shows you the wrong note confidently is worse
     than one that shrugs. */
  await j.page.evaluate(() => orClose());
  const jmiss = await jAsk('zzzqqq');
  ok('a name he does not have opens nothing',
    jmiss.ret === null && jmiss.sel === null
    && /Nothing called/.test(jmiss.text), jmiss);

  /* ── the answer never outlives the question ──
     The strip sits under the box. Leaving the last answer up while the
     box says something else reads as a reply to what you are typing
     now, and it is a reply to what you typed before. */
  await jAsk('orphans');
  await j.page.click('#orSearch');
  await j.page.keyboard.type('ri');
  await j.page.waitForTimeout(300);
  ok('typing again drops the last answer',
    await j.page.evaluate(() => document.getElementById('orReply').hidden));

  /* ── a new question retires the old answer ──
     Clicking a star is a question too. The strip sits under a box you
     may not have touched, so an answer left there after you navigated
     somewhere else describes a note you are no longer looking at.
     His own answers survive it: he renders after he opens. */
  await jAsk('orphans');
  await j.page.evaluate(() => orOpen('trading/models/cisd'));
  await j.page.waitForTimeout(300);
  ok('opening a note by hand drops the previous answer',
    await j.page.evaluate(() => document.getElementById('orReply').hidden));
  const jkept = await jAsk('where is CISD');
  ok('but his own answer survives the note he opens to give it',
    !jkept.hidden && /CISD/.test(jkept.text), jkept.text.slice(0, 60));
  await j.page.evaluate(() => orOpenCat('body'));
  await j.page.waitForTimeout(300);
  ok('and opening a category by hand drops it too',
    await j.page.evaluate(() => document.getElementById('orReply').hidden));
  const jkept2 = await jAsk('body');
  ok('while his own category answer stays up',
    !jkept2.hidden && /\d/.test(jkept2.text), jkept2.text.slice(0, 60));
  await j.page.evaluate(() => { orCloseCat(); orClose(); });

  /* ── Escape drops the answer before the filter ──
     And the box and the query can never disagree. Chromium clears a
     type="search" input on Escape by itself; while the handler was
     busy with the reply strip that native clear emptied the box and
     left state.q set, so the map stayed filtered by a word no longer
     on screen with no visible way to clear it. */
  await j.page.evaluate(() => { orReply.clear(); orAsk('trading/models'); });
  await j.page.waitForTimeout(200);
  await j.page.focus('#orSearch');
  await j.page.keyboard.press('Escape');
  const jesc1 = await j.page.evaluate(() => ({
    reply: document.getElementById('orReply').hidden,
    box: document.getElementById('orSearch').value, q: state.q }));
  ok('the first Escape takes the answer and leaves the filter',
    jesc1.reply && jesc1.box === 'trading/models' && jesc1.q === 'trading/models', jesc1);
  await j.page.keyboard.press('Escape');
  const jesc2 = await j.page.evaluate(() => ({
    box: document.getElementById('orSearch').value, q: state.q }));
  ok('the second takes the filter, and the box and the query agree',
    jesc2.box === '' && jesc2.q === '', jesc2);

  /* ── the question never becomes the filter ──
     Every keystroke schedules a filter 140ms out, so at the moment
     Enter answers there is a pending orSearch carrying the whole
     sentence. Two things stop it landing — orAsk.filter cancels the
     timer AND rewrites the box — and removing either one alone was
     measured and still held, so this is the invariant, not a proof of
     one line. Break both and the map ends up filtered by "where is
     CISD", which matches nothing, so the answer opens a note on an
     empty sky. */
  await j.page.evaluate(() => { orReply.clear(); orClose(); });
  await j.page.focus('#orSearch');
  await j.page.keyboard.type('where is CISD');
  await j.page.keyboard.press('Enter');
  await j.page.waitForTimeout(400);
  const jent = await j.page.evaluate(() => ({ q: state.q, sel: state.sel,
    hidden: document.getElementById('orReply').hidden }));
  ok('Enter answers and the pending filter does not land on the question',
    jent.sel === 'trading/models/cisd' && jent.q === '' && !jent.hidden, jent);

  /* ── the voice is a preference, never a gate ──
     Turning him down must cost the voice and nothing else: the strip
     is written either way, so sound off is still a working assistant. */
  const jv = await j.page.evaluate(() => {
    const b = document.getElementById('orVoiceBtn');
    const on = { pressed: b.getAttribute('aria-pressed'),
                 name: b.getAttribute('aria-label'),
                 icon: document.getElementById('orVoiceIcon').innerHTML };
    b.click();
    const offS = { pressed: b.getAttribute('aria-pressed'),
                   name: b.getAttribute('aria-label'),
                   icon: document.getElementById('orVoiceIcon').innerHTML,
                   stored: JSON.parse(localStorage.getItem('orrery.v1')).voice };
    orAsk('how many notes');
    const said = document.getElementById('orReply');
    const mute = { hidden: said.hidden, text: said.textContent };
    b.click();
    return { on, off: offS, mute,
             back: JSON.parse(localStorage.getItem('orrery.v1')).voice };
  });
  ok('the voice toggle flips, is remembered, and comes back',
    jv.on.pressed === 'true' && jv.off.pressed === 'false'
    && jv.off.stored === false && jv.back === true, jv);
  ok('and the icon says which state it is in', jv.on.icon !== jv.off.icon);
  /* The button has no text, so aria-label is its whole name. Frozen at
     "answers out loud" it would read the wrong state for as long as he
     was muted, and a screen reader has nothing else to go on. */
  ok('and its name says which state it is in, not just aria-pressed',
    jv.on.name !== jv.off.name && /out loud/.test(jv.on.name)
    && /writing/.test(jv.off.name), { on: jv.on.name, off: jv.off.name });
  ok('turned down, he still answers in writing',
    !jv.mute.hidden && /\d/.test(jv.mute.text), jv.mute);

  /* ── which voice he uses, and what he refuses to use ──
     No voices are installed in this browser, so the list is stubbed —
     what is being held is the ORDER, and one hard refusal.

     The refusal first, because it is not about how he sounds: Chrome
     lists "Google UK English Male" beside the OS voices and it
     synthesises on Google's servers, so speaking with it uploads the
     sentence — note titles, folder names — to be spoken. An earlier
     build of this picker preferred it, and Playwright's request
     interception cannot see that traffic, so nothing else in this file
     would have caught it. This is the assertion that does. */
  const jvoice = await j.page.evaluate(() => {
    const mk = (name, lang, localService, voiceURI) =>
      ({ name, lang, localService, voiceURI: voiceURI || name });
    const real = window.speechSynthesis.getVoices;
    const set = (list) => { window.speechSynthesis.getVoices = () => list; };
    const nm = () => (orVoice.pick() || {}).name;
    const out = {};
    orVoice.chosen = null;

    /* The remote one is deliberately given the HIGHER rank — same
       locale, better tier, warmer name — so the filter is the only
       thing that can be keeping it out. Pitting a remote voice against
       a local one that already outranks it proves nothing, which is
       what the first version of this assertion did. */
    set([mk('Serena Online (Natural)', 'en-GB', false),
         mk('Zarvox', 'en-GB', true)]);
    out.refusesRemote = nm();
    /* And refuses it by name when the browser leaves the flag unset. */
    set([mk('Google UK English Female', 'en-GB', undefined),
         mk('Zarvox', 'en-GB', true)]);
    out.refusesUnflagged = nm();
    /* Rather be mute than upload — until you say otherwise. */
    set([mk('Google UK English Male', 'en-GB', false)]);
    orVoice.ok = false;
    out.remoteOnly = orVoice.pick();
    /* A remembered cloud voice whose consent flag is gone must NOT
       quietly resume uploading on the next reload. */
    orVoice.chosen = 'Google UK English Male'; orVoice.ok = false;
    out.consentGone = orVoice.pick();
    orVoice.ok = true;
    out.consentKept = (orVoice.pick() || {}).name;
    orVoice.chosen = null; orVoice.ok = false;

    /* Tier beats name: plain Daniel is the compact MacinTalk voice and
       is exactly what "extremely robotic" sounds like. */
    set([mk('Daniel', 'en-GB', true), mk('Kate (Enhanced)', 'en-GB', true)]);
    out.tierOverName = nm();
    set([mk('Daniel (Enhanced)', 'en-GB', true),
         mk('Serena (Premium)', 'en-GB', true)]);
    out.premiumWins = nm();
    /* Locale beats tier: a premium American is still American. */
    set([mk('Samantha (Premium)', 'en-US', true), mk('Daniel', 'en-GB', true)]);
    out.localeFirst = nm();
    /* Warmth breaks a tie between equals. */
    set([mk('Zarvox', 'en-GB', true), mk('Serena', 'en-GB', true)]);
    out.warmth = nm();
    /* No en-GB at all: still English. None at all: nothing. */
    set([mk('Samantha', 'en-US', true), mk('Amelie', 'fr-FR', true)]);
    out.noGb = nm();
    set([mk('Amelie', 'fr-FR', true)]);
    out.none = orVoice.pick();

    /* Your choice outranks the ranking, and is remembered. */
    set([mk('Daniel (Enhanced)', 'en-GB', true), mk('Kate', 'en-GB', true)]);
    orAsk('use Kate');
    out.chose = (orVoice.pick() || {}).name;
    out.stored = JSON.parse(localStorage.getItem('orrery.v1')).voiceName;
    /* But a chosen voice that is no longer installed falls back rather
       than leaving him mute. */
    set([mk('Daniel (Enhanced)', 'en-GB', true)]);
    out.gone = nm();
    orVoice.chosen = null;
    window.speechSynthesis.getVoices = real;
    return out;
  });
  ok('he refuses a better-ranked cloud voice for a worse local one',
    jvoice.refusesRemote === 'Zarvox', jvoice);
  ok('and refuses it by name when the browser does not flag it',
    jvoice.refusesUnflagged === 'Zarvox', jvoice);
  ok('with nothing but cloud voices he stays mute rather than uploading',
    jvoice.remoteOnly === null, jvoice);
  ok('a remembered cloud voice with no consent left does not resume uploading',
    jvoice.consentGone === null, jvoice);
  ok('and does resume once you have said so',
    jvoice.consentKept === 'Google UK English Male', jvoice);
  ok('an enhanced voice beats a warmer-named compact one',
    jvoice.tierOverName === 'Kate (Enhanced)', jvoice);
  ok('and premium beats enhanced', jvoice.premiumWins === 'Serena (Premium)', jvoice);
  ok('but the accent outranks the tier', jvoice.localeFirst === 'Daniel', jvoice);
  ok('warmth breaks a tie between equals', jvoice.warmth === 'Serena', jvoice);
  ok('with no en-GB at all he still speaks English', jvoice.noGb === 'Samantha', jvoice);
  ok('and no English at all is no voice rather than a French one',
    jvoice.none === null, jvoice);
  ok('asking for a voice by name sets it and remembers it',
    jvoice.chose === 'Kate' && jvoice.stored === 'Kate', jvoice);
  ok('and a remembered voice that is gone falls back instead of muting',
    jvoice.gone === 'Daniel (Enhanced)', jvoice);

  /* ── speech can never take the answer down with it ──
     Assigning a voice throws if the object came from a getVoices()
     batch the browser has since replaced — and voiceschanged fires
     whenever the OS installs one. orReply writes before it speaks, so
     a throw on the way to the speaker would come back out through
     orAsk and lose the sentence you asked for. Forced here with a
     voice object no platform will accept. */
  const jthrow = await j.page.evaluate(() => {
    const real = window.speechSynthesis.getVoices;
    window.speechSynthesis.getVoices = () =>
      [{ name: 'Impostor', lang: 'en-GB', localService: true, voiceURI: 'x' }];
    orVoice.chosen = null; orVoice.voice = null;
    let threw = false;
    try { orAsk('how many notes'); } catch (e) { threw = String(e); }
    const rp = document.getElementById('orReply');
    const out = { threw, shown: !rp.hidden, text: rp.textContent.slice(0, 40) };
    orVoice.chosen = null; orVoice.voice = null;
    window.speechSynthesis.getVoices = real;
    return out;
  });
  ok('a voice the platform rejects costs the voice, not the answer',
    jthrow.threw === false && jthrow.shown && /\d/.test(jthrow.text), jthrow);

  /* ── and the list is a thing you can press ──
     The voice is set by asking, not by a control in the bar: it is a
     thing you choose once, and the bar had just lost two buttons.
     Pressing a chip re-renders the list rather than closing it,
     because you are auditioning. */
  const jvl = await j.page.evaluate(() => {
    const real = window.speechSynthesis.getVoices;
    /* A stock Mac in Chrome: one compact British voice, some other
       locales, and Chrome's own cloud voices — which are the good ones.
       This is the case the whole design is for. */
    const mk = (n, l, loc) => ({ name: n, lang: l, localService: loc, voiceURI: n });
    window.speechSynthesis.getVoices = () => [
      mk('Daniel', 'en-GB', true), mk('Karen', 'en-AU', true),
      mk('Samantha', 'en-US', true),
      mk('Google UK English Female', 'en-GB', false),
      mk('Google US English', 'en-US', false),
    ];
    orVoice.chosen = null; orVoice.ok = false; orVoice.voice = null;
    const rp = document.getElementById('orReply');
    const chips = () => Array.from(rp.querySelectorAll('[data-voice]'))
      .map((b) => ({ name: b.getAttribute('data-voice'),
                     up: b.classList.contains('or-rl-up'),
                     on: b.getAttribute('aria-pressed') === 'true' }));
    const btn = () => document.getElementById('orVoiceBtn').getAttribute('aria-label');

    orAsk('voices');
    const listed = { chips: chips(), text: rp.textContent,
                     using: (orVoice.pick() || {}).name, btn: btn() };
    rp.querySelector('[data-voice="Google UK English Female"]').click();
    const took = { chips: chips(), text: rp.textContent, ok: orVoice.ok,
                   using: (orVoice.pick() || {}).name, btn: btn(),
                   stored: JSON.parse(localStorage.getItem('orrery.v1')) };
    orAsk('use Daniel');
    const back = { ok: orVoice.ok, using: (orVoice.pick() || {}).name, btn: btn(),
                   stored: JSON.parse(localStorage.getItem('orrery.v1')) };
    orVoice.chosen = null; orVoice.ok = false; orVoice.voice = null;
    window.speechSynthesis.getVoices = real;
    return { listed, took, back };
  });

  /* ── the stock Mac ── */
  ok('the only local British voice is what he uses, unasked',
    jvl.listed.using === 'Daniel', jvl.listed);
  ok('and he says outright that it is the robotic one, with the fix',
    /compact one, which is the robotic one/.test(jvl.listed.text)
    && /Manage Voices/.test(jvl.listed.text), jvl.listed.text.slice(0, 140));
  ok('the cloud voices are offered rather than hidden',
    jvl.listed.chips.filter((c) => c.up).map((c) => c.name)
      .indexOf('Google UK English Female') >= 0, jvl.listed.chips);
  ok('and every one of them is marked on the chip, not only in the prose',
    jvl.listed.chips.every((c) => c.up === (c.name.indexOf('Google') === 0)),
    jvl.listed.chips);
  ok('the price is stated before you press anything',
    /uploaded to be spoken/.test(jvl.listed.text), jvl.listed.text.slice(-200));

  /* ── pressing one is the consent ── */
  ok('pressing a cloud chip switches to it',
    jvl.took.using === 'Google UK English Female' && jvl.took.ok === true, jvl.took);
  ok('and says what that now costs, in the answer',
    /goes to that voice.s server/.test(jvl.took.text), jvl.took.text.slice(0, 160));
  ok('the always-visible control says it too',
    /cloud voice/.test(jvl.took.btn), jvl.took.btn);
  ok('and the consent is stored beside the name, not folded into it',
    jvl.took.stored.voiceName === 'Google UK English Female'
    && jvl.took.stored.voiceCloud === true, jvl.took.stored);
  ok('the chip in use is the one marked',
    jvl.took.chips.filter((c) => c.on).map((c) => c.name).join()
      === 'Google UK English Female', jvl.took.chips);

  /* ── and going back withdraws it ── */
  ok('choosing a local voice again clears the consent',
    jvl.back.using === 'Daniel' && jvl.back.ok === false
    && jvl.back.stored.voiceCloud === false, jvl.back);
  ok('and the control stops warning once nothing is being uploaded',
    !/cloud voice/.test(jvl.back.btn), jvl.back.btn);

  /* ── the promise ──
     Nothing he does reaches a network. Everything above ran through
     the real function, and the only requests this page made were for
     its own files. If a model, a key or a lookup is ever added to make
     him cleverer, this is what refuses it. */
  ok('nothing Jarvis answered required a request off this origin',
    off.length === 0, off.slice(0, 4));
  ok('no page errors through any of Jarvis', j.errs.length === 0, j.errs.slice(0, 4));
  await j.browser.close();

  /* ═══ the passage ═══
     The camera flies on a geometric law now — d(ln z)/dt constant
     rather than dz/dt — and a burst of debris rushes outward from the
     star you are flying to and is gone before you land.

     Its own browser, held open for several REAL seconds before the
     first flight. That is not padding: the debris streaks are SMIL
     (<animateMotion>, <animate>), and a dynamically inserted SMIL
     element's `begin` — including the IMPLICIT default of 0s — is
     measured against the SVG document's own animation clock, never
     against when the element joined it. On a page that has been open
     less than a second the two clocks are close enough that a naive
     build passes by accident; open a few real seconds first and an
     animation timed against "0s" has already closed, so the browser
     resolves it straight to its frozen end state — no visible motion
     at all. This shipped once, undetected, in orSignal's own bead: a
     dot that lands on the right point of the right path and vanishes
     950ms later looks like a dot doing its job, not a dot that never
     moved. The fix here is `begin="indefinite"` plus
     `beginElementAt(offset)`, which is measured from NOW regardless of
     how long the document has been running — and this section proves
     it by being the one place in the file that actually waits. */
  console.log('\n── the passage ──');
  const pg = await open({ colorScheme: 'dark' });
  await pg.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(pg.page);
  await settle(pg.page);
  await pg.page.waitForTimeout(4000);       /* the exact window the bug needed */

  const N = await pg.page.evaluate(() => orDebris.N);

  /* ── the camera itself ── */
  const flight = await pg.page.evaluate(() => new Promise((res) => {
    const log = []; const t0 = performance.now();
    function tick() {
      log.push({ t: Math.round(performance.now() - t0), z: state.zoom });
      if (performance.now() - t0 < 1300) requestAnimationFrame(tick);
      else res(log);
    }
    orOpen('trading/models/cisd');
    requestAnimationFrame(tick);
  }));
  const zEnd = flight[flight.length - 1].z;
  const zMid = flight.find((r) => r.t > 100 && r.t < 300);
  ok('the flight reaches the same 2.4x clamp it always did',
    Math.abs(zEnd - 2.4) < 0.01, zEnd);
  ok('and gets there gradually, not in one jump',
    !!zMid && zMid.z > 1 && zMid.z < 2.3, zMid);
  const monotone = flight.every((r, i) => i === 0 || r.z >= flight[i - 1].z - 1e-6);
  ok('the zoom never runs backward mid-flight', monotone,
    flight.filter((r, i) => i && r.z < flight[i - 1].z - 1e-6).slice(0, 3));

  /* ── debris exists, is capped, and is the declared shape ── */
  await pg.page.evaluate(() => { orClose(); orZoom(0); });
  await settle(pg.page);
  const shape = await pg.page.evaluate((wantN) => new Promise((res) => {
    orOpen('trading/models/cisd');
    setTimeout(() => {
      const gs = Array.from(document.querySelectorAll('#orDebris > g'));
      res({
        n: gs.length,
        capped: gs.length <= wantN,
        allHaveLine: gs.every((g) => !!g.querySelector('line')),
        strokeIsTrail: gs.every((g) =>
          (g.querySelector('line').getAttribute('stroke') || '') === 'url(#orDebrisTrail)'),
        gradExists: !!document.getElementById('orDebrisTrail'),
      });
    }, 300);
  }), N);
  ok('the flight spawns debris, capped at the declared count',
    shape.n > 0 && shape.capped, shape);
  ok('every streak is a line painted from the shared trail gradient',
    shape.allHaveLine && shape.strokeIsTrail && shape.gradExists, shape);

  /* ── THE regression: it actually moves, seconds into a real session ──
     Sampled from inside the SAME rAF loop the camera runs on, not a
     separate timer — a setInterval competing with a live flight for
     the main thread is exactly what made the first few attempts at
     this measurement misleading. */
  await pg.page.evaluate(() => { orClose(); orZoom(0); });
  await settle(pg.page);
  const life = await pg.page.evaluate(() => new Promise((res) => {
    /* One streak, tracked by ITS OWN identity across every tick — not
       one rect compared against another streak's, which is a
       different bug wearing a passing test: two elements at two
       angles always read two different x's, frozen or not. */
    let maxOp = 0, tracked = null, firstX = null, moved = false;
    const t0 = performance.now();
    function tick() {
      if (!tracked || !tracked.isConnected)
        tracked = document.querySelector('#orDebris > g');
      if (tracked) {
        const o = +getComputedStyle(tracked).opacity;
        if (o > maxOp) maxOp = o;
        const x = tracked.querySelector('line').getBoundingClientRect().x;
        if (firstX == null) firstX = x;
        else if (Math.abs(x - firstX) > 3) moved = true;
      }
      if (performance.now() - t0 < 1050) requestAnimationFrame(tick);
      else res({ maxOp: +maxOp.toFixed(2), moved });
    }
    orOpen('trading/models/cisd');
    requestAnimationFrame(tick);
  }));
  ok('a streak actually brightens — not frozen at opacity 0 the whole time',
    life.maxOp > 0.5, life);
  ok('and it actually travels — the same streak, watched over time',
    life.moved, life);

  /* ── zoom OUT is a return, not a passage ── */
  await pg.page.evaluate(() => { orClose(); orZoom(0); });
  await settle(pg.page);
  await pg.page.evaluate(() => orOpen('trading/models/cisd'));
  await pg.page.waitForFunction(() =>
    !document.getElementById('orSvg').classList.contains('or-flying'),
    null, { timeout: 3000 }).catch(() => {});
  await pg.page.waitForTimeout(150);
  const outN = await pg.page.evaluate(() => new Promise((res) => {
    orClose();
    setTimeout(() => res(document.querySelectorAll('#orDebris > g').length), 150);
  }));
  ok('closing back out to the fit spawns no debris', outN === 0, outN);

  /* ── interrupted, it stops rather than finishing over a still camera ── */
  await pg.page.evaluate(() => { orClose(); orZoom(0); });
  await settle(pg.page);
  const cut = await pg.page.evaluate(() => new Promise((res) => {
    orOpen('trading/models/cisd');
    setTimeout(() => {
      orPan(10, 6);                 /* a hand, mid-flight */
      setTimeout(() => res({
        n: document.querySelectorAll('#orDebris > g').length,
        live: orDebris.live.length,
      }), 30);
    }, 120);
  }));
  ok('a hand on the map cuts the debris down with the camera',
    cut.n === 0 && cut.live === 0, cut);

  /* ── nothing animates inside the camera while the camera is moving ──
     Everything the map draws sits inside #orView, so a flight rescales
     all of it every frame. Anything still animating through that cannot
     be cached — it is re-rasterised at each new scale, and on a Retina
     panel at four times the pixels this box renders.

     There WAS a rule for this and it named the three layers that
     existed when it was written. The ambient field shipped later,
     inside #orView like everything else, kept animating through every
     flight, and carried the only CSS filter in the app while it did —
     which is what "it glitches its way to the star on a Mac" was. The
     old check had the same blind spot as the rule: it read
     animationPlayState off #orNod, #orDustA and .or-turn by name, so a
     layer added afterwards passed it without ever being looked at.

     So this counts, rather than naming: EVERY element under #orView,
     whatever it is and however it got styled. A future layer is covered
     on the day it is added, which a list has now twice failed to do. */
  await pg.page.evaluate(() => { orClose(); orZoom(0); });
  await settle(pg.page);
  const frozen = await pg.page.evaluate(() => new Promise((res) => {
    const view = document.getElementById('orView');
    const running = () => [...view.querySelectorAll('*')].filter((e) => {
      const s = getComputedStyle(e);
      return s.animationName && s.animationName !== 'none' && s.animationPlayState === 'running';
    });
    const filtered = () => [...view.querySelectorAll('*')]
      .filter((e) => { const s = getComputedStyle(e); return s.filter && s.filter !== 'none'; });
    const restAnim = running().length, restFilt = filtered().length;
    orOpen('trading/models/cisd');
    setTimeout(() => {
      const midAnim = running(), midFilt = filtered().length;
      /* The other half, and it has to be measured in the same window:
         the pause must NOT have taken the debris with it. SMIL does not
         read animation-play-state, which is exactly why the rule is
         allowed to be this blunt — but "exactly why" is a claim, and an
         unmeasured claim is how the first version of this shipped. */
      const deb = [...document.querySelectorAll('#orDebris > g')];
      const was = deb.map((g) => g.getBoundingClientRect().x);
      setTimeout(() => {
        const moved = deb.filter((g) => g.isConnected)
          .some((g, i) => was[i] !== undefined && Math.abs(g.getBoundingClientRect().x - was[i]) > 1);
        setTimeout(() => res({
          restAnim, restFilt,
          midAnim: midAnim.length, midFilt,
          leftover: midAnim.map((e) => e.getAttribute('class') || e.id || e.tagName),
          debris: deb.length, debrisMoved: moved,
          backAnim: running().length, backFilt: filtered().length,
        }), 1500);
      }, 160);
    }, 400);
  }));
  ok('at rest the map genuinely is animating, so this measured something',
    frozen.restAnim > 0 && frozen.restFilt > 0, frozen);
  ok('but nothing under the camera animates while it is flying',
    frozen.midAnim === 0, frozen);
  ok('and nothing under it carries a filter while it is flying',
    frozen.midFilt === 0, frozen);
  ok('the debris is SMIL and keeps running through the pause',
    frozen.debris > 0 && frozen.debrisMoved, frozen);
  ok('and it all comes back once the camera has landed',
    frozen.backAnim === frozen.restAnim && frozen.backFilt === frozen.restFilt, frozen);

  ok('no page errors through the passage so far', pg.errs.length === 0, pg.errs.slice(0, 4));

  /* ── reduced motion: no debris, ever ── */
  await pg.browser.close();
  const pr = await open({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await pr.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(pr.page);
  const still = await pr.page.evaluate(() => new Promise((res) => {
    orOpen('trading/models/cisd');
    setTimeout(() => res({
      n: document.querySelectorAll('#orDebris > g').length,
      zoom: state.zoom,
      flying: document.getElementById('orSvg').classList.contains('or-flying'),
    }), 80);
  }));
  ok('reduced motion lands the camera instantly and spawns no debris',
    still.n === 0 && still.zoom === 2.4 && !still.flying, still);
  ok('no page errors through the passage', pr.errs.length === 0, pr.errs.slice(0, 4));
  await pr.browser.close();

  /* ── the ambient field ──
     Built once at boot, outside #orRings, on the same reasoning as
     #orDebris — so the two real bugs worth guarding are (1) something
     later wiping it and (2) it costing more continuous motion than the
     app's own budget allows (see "almost nothing on the map is in
     continuous motion" above — dust already spends most of it). */
  const am = await open({ colorScheme: 'dark' });
  await am.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(am.page);
  await am.page.waitForTimeout(500);
  const ambCounts = await am.page.evaluate(() => {
    const g = document.getElementById('orAmbient');
    return { tk: g.querySelectorAll('.or-amb-tk').length,
             wa: g.querySelectorAll('.or-amb-wa').length };
  });
  ok('the ambient field is a handful, not a crowd',
    ambCounts.tk > 0 && ambCounts.tk <= 6 && ambCounts.wa > 0 && ambCounts.wa <= 10, ambCounts);
  /* The bug this repro'd: the wander keyframes lived in a <style>
     appended to <defs> — which orPaintRings overwrites wholesale on
     every repaint (a filter keystroke, a re-file). The <circle>s
     themselves survive that (they live in #orAmbient, not #orRings) —
     an element-count check would have missed this entirely, which is
     exactly what happened the first time this was written. Only actual
     MOTION, sampled before and after a repaint, tells the two apart. */
  const moved = await am.page.evaluate(() => new Promise((res) => {
    const before = [...document.querySelectorAll('.or-amb-wa')]
      .map((c) => c.getBoundingClientRect());
    orPaint();
    setTimeout(() => {
      const after = [...document.querySelectorAll('.or-amb-wa')]
        .map((c) => c.getBoundingClientRect());
      res(before.map((b, i) => +Math.hypot(after[i].x - b.x, after[i].y - b.y).toFixed(1)));
    }, 1800);
  }));
  ok('and survives a repaint — a filter keystroke does not wipe its motion',
    moved.some((d) => d > 3), moved);
  ok('no page errors through the ambient field', am.errs.length === 0, am.errs.slice(0, 4));
  await am.browser.close();

  const amr = await open({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await amr.page.goto(`${BASE}/orrery/`, { waitUntil: 'networkidle' });
  await waitPaint(amr.page);
  await amr.page.waitForTimeout(500);
  const noAmb = await amr.page.evaluate(() => {
    const g = document.getElementById('orAmbient');
    return { tk: g.querySelectorAll('.or-amb-tk').length, wa: g.querySelectorAll('.or-amb-wa').length };
  });
  ok('reduced motion builds none of it — the trickle and the wander are each entirely their own animation',
    noAmb.tk === 0 && noAmb.wa === 0, noAmb);
  ok('no page errors with the ambient field held back', amr.errs.length === 0, amr.errs.slice(0, 4));
  await amr.browser.close();

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  console.log(`\n${pass} passed, ${fail + 1} failed`);
  process.exit(1);
});
