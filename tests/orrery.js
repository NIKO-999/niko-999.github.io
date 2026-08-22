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
    && (document.getElementById('orStatNodes') || {}).textContent !== '',
    { timeout: 15000 });
  await page.waitForTimeout(500);
};

const positions = (page) => page.$$eval('#orNodes .or-node', (gs) =>
  Object.fromEntries(gs.map((g) => [g.getAttribute('data-id'), g.getAttribute('transform')])));

/* A node the pointer can actually reach: its centre inside the stage,
   clear of the floated cards, and — the part that matters — the topmost
   element there resolves to THIS node, not to a later-painted
   neighbour's halo. */
const pickHittable = (page, ids) => page.evaluate((ids) => {
  const stage = document.getElementById('orStage').getBoundingClientRect();
  const keep = [document.getElementById('orLegend'), document.getElementById('orStats'),
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

    /* ── the two cards, against their own composited ground ── */
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
      push('stats heading', R(document.querySelector('#orStats .or-card-h')));
      document.querySelectorAll('#orStats .or-stat').forEach((row) => {
        for (const n of row.childNodes) {
          if (n.nodeType === 3 && n.textContent.trim()) {
            const rg = document.createRange(); rg.selectNode(n);
            push('stat ' + n.textContent.trim(), rg.getBoundingClientRect());
          }
        }
        const v = row.querySelector('.or-stat-v');
        push('value of ' + row.textContent.trim().slice(0, 12), R(v));
      });
      const a = document.getElementById('orLegend').getBoundingClientRect();
      const b = document.getElementById('orStats').getBoundingClientRect();
      const x = Math.min(a.left, b.left) - 4, y = Math.min(a.top, b.top) - 4;
      return { items, clip: { x, y, width: Math.max(a.right, b.right) - x + 8,
                              height: Math.max(a.bottom, b.bottom) - y + 8 } };
    });
    const cardRuns = await patches(page, cardItems.clip, cardItems.items, 2);
    const cardBad = cardRuns.map((r) => ({ ...r, c: ratio(r.hi, r.lo) }))
      .filter((r) => r.c < 4.5);
    ok(`every card run clears 4.5:1 (${cardRuns.length} sampled)`,
      cardRuns.length >= 16 && cardBad.length === 0,
      cardBad.slice(0, 3).map((r) => `${r.label} ${r.c.toFixed(2)}:1`));

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
  const stats = await page.evaluate(() => ({
    nodes: document.getElementById('orStatNodes').textContent,
    links: document.getElementById('orStatLinks').textContent,
    cats: document.getElementById('orStatCats').textContent,
    loose: document.getElementById('orStatLoose').textContent,
  }));
  ok('the stats card counts what is drawn',
    +stats.nodes === seed.length && +stats.links === corpus.edges.length
    && +stats.cats === corpus.hubs, stats);
  ok(`the loose-ends figure matches the corpus (${corpus.loose.size} real)`,
    +stats.loose === corpus.loose.size, stats.loose);

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
    stats: getComputedStyle(document.getElementById('orStats')).opacity,
    pe: getComputedStyle(document.getElementById('orLegend')).pointerEvents,
    pane: document.getElementById('orNote').hidden,
  }));
  let ch = await chrome();
  ok('the legend and stats are gone while a note is open',
    ch.legend === '0' && ch.stats === '0' && ch.pe === 'none', ch);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  ch = await chrome();
  ok('Escape closes the note', ch.pane === true);
  ok('and the cards come back', ch.legend === '1' && ch.stats === '1', ch);

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
    const links = [...document.querySelectorAll('#orLinks path')];
    const linkWrong = links.filter((l) => {
      const touches = kin.has(l.getAttribute('data-a')) || kin.has(l.getAttribute('data-b'));
      const muted = (l.getAttribute('stroke') || '').indexOf('or-mute') >= 0;
      return touches === muted;
    }).length;
    return { nodes: gs.length, kin: kin.size, wrong: wrong.slice(0, 4),
             linkWrong, links: links.length };
  });
  ok('the selection and its links keep their colour, nothing else does',
    mute.wrong.length === 0, mute.wrong);
  ok('and every link agrees with the nodes it joins', mute.linkWrong === 0,
    { wrong: mute.linkWrong, of: mute.links });
  ok('muting is not removing — every node is still drawn',
    mute.nodes === seed.length + corpus.hubs, mute.nodes);
  ok('and it is a minority that stays lit, or it says nothing',
    mute.kin > 1 && mute.kin < mute.nodes / 3, { kin: mute.kin, of: mute.nodes });
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
  ok('the dust drifts in three shells', alive.a !== 'none' && alive.b !== 'none'
    && alive.c !== 'none' && alive.a !== 'MISSING', alive);
  ok('and the instrument nods', alive.nod !== 'none' && alive.nod !== 'MISSING', alive);

  /* The furniture turns at four rates and the inner arcs are the one
     part you can WATCH turn — everything outside them is under a degree
     and a half a second, which is deliberate and also invisible over
     the seconds anybody actually looks. Measured off the composited
     transform, not off the stylesheet: an animation that is declared
     and not running reads perfectly in the source. */
  const rates = await page.evaluate(() => [...document.querySelectorAll('#orRings g.or-turn')]
    .map((g) => 360 / parseFloat(getComputedStyle(g).animationDuration)));
  ok('every ring group is turning', rates.length >= 4 && rates.every((r) => r > 0), rates);
  ok('and the innermost arcs turn fastest, by a clear margin',
    Math.max.apply(null, rates) >= 2.5
    && Math.max.apply(null, rates) > 2 * rates.slice().sort((a, b) => b - a)[1],
    rates);

  const stg = await page.locator('#orStage').boundingBox();
  await page.mouse.move(stg.x + stg.width * 0.8, stg.y + stg.height * 0.25);
  await page.waitForTimeout(220);
  const towed = await page.evaluate(() => ['orDustA', 'orDustB', 'orDustC']
    .map((id) => document.getElementById(id).style.translate || ''));
  const px = towed.map((t) => Math.abs(parseFloat(t) || 0));
  /* Near shells lean further than far ones — that difference IS the
     parallax. Equal amounts would be a slide, not depth. */
  ok('the pointer tows the shells', px[0] > 0, towed);
  ok('and tows the near one further than the far', px[0] > px[1] && px[1] > px[2], px);
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

  /* ── the legend isolates by dimming, never by removing ── */
  console.log('\n── which, not whether ──');
  const countAll = (await page.$$('#orNodes .or-node')).length;
  await page.click('#orLegRows [data-cat="mind"]');
  await page.waitForTimeout(300);
  const iso = await page.evaluate(() => {
    const gs = [...document.querySelectorAll('#orNodes .or-node')];
    return {
      n: gs.length,
      pressed: document.querySelector('#orLegRows [data-cat="mind"]').getAttribute('aria-pressed'),
      mindDim: gs.filter((g) => g.getAttribute('data-cat') === 'mind')
        .filter((g) => +getComputedStyle(g).opacity < 0.5).length,
      otherLit: gs.filter((g) => g.getAttribute('data-cat') !== 'mind')
        .filter((g) => +getComputedStyle(g).opacity > 0.5).length,
    };
  });
  ok('the legend isolates a category', iso.pressed === 'true' && iso.mindDim === 0
    && iso.otherLit === 0, iso);
  ok('by dimming — the node count is unchanged', iso.n === countAll,
    { before: countAll, after: iso.n });
  await page.click('#orLegRows [data-cat="mind"]');
  await page.waitForTimeout(300);
  const clear = await page.evaluate(() => ({
    pressed: document.querySelector('#orLegRows [data-cat="mind"]').getAttribute('aria-pressed'),
    dim: [...document.querySelectorAll('#orNodes .or-node')]
      .filter((g) => +getComputedStyle(g).opacity < 0.5).length,
  }));
  ok('and clicking again clears it', clear.pressed === 'false' && clear.dim === 0, clear);

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
          || el.closest('#orStats') || el.closest('.or-zoom')) continue;
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
  ok('label chips share no pixels at the default fit',
    ov.n > 2 && ov.bad.length === 0, ov.bad.slice(0, 5));
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

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  console.log(`\n${pass} passed, ${fail + 1} failed`);
  process.exit(1);
});
