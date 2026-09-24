/* ═══════════════════════════════════════════════════════════════
   ALIGNMENT — 288 themes from 24 sources, and the two marks.

   This file exists because the app shipped to the web and its checks
   were still in a scratchpad, run by hand. That is the failure this
   repo has written down twice already under a different name: a check
   that is not running looks exactly like one that is.

   Five probes are folded into one file. What each of them found, and
   what would have gone unfound, is in the comment beside it.
   ═══════════════════════════════════════════════════════════════ */
const { open, BASE } = require('./lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { fail++; console.log(`  \x1b[31m✗ FAIL\x1b[0m ${name}`
    + (extra === undefined ? '' : ` → ${JSON.stringify(extra)}`)); }
};

/* Lab, because "these two are different colours" is measured the way an
   eye measures it and never by comparing hex strings. */
const lab = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  const [R, G, B] = [f(r), f(g), f(b)];
  let X = (R * .4124 + G * .3576 + B * .1805) / .95047;
  let Y = R * .2126 + G * .7152 + B * .0722;
  let Z = (R * .0193 + G * .1192 + B * .9505) / 1.08883;
  const k = (t) => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * k(Y) - 16, 500 * (k(X) - k(Y)), 200 * (k(Y) - k(Z))];
};
const dE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/* A COMPUTED COLOUR IS NOT ALWAYS rgb(). Chromium serialises a
   color-mix result as color(srgb 0.86 0.76 0.44) — floats in 0..1, not
   bytes — so a bare digit match reads a near-white as near-black. This
   repo has met that three times: a box-shadow compared against a hex, a
   color-mix read by a digit match, and a token read as a string. Read a
   colour through a parser, never through a digit match. */
const rgbOf = (v) => {
  const n = (v.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  return /^color\(/.test(v) ? n.map(x => Math.round(x * 255)) : n;
};

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
                isMobile: true, hasTouch: true, colorScheme: 'dark', locale: 'en-GB' };

(async () => {
  const { browser, page, errs } = await open(PHONE);
  const http4 = [];
  page.on('response', r => { if (r.status() >= 400) http4.push(r.url() + ' ' + r.status()); });
  const at = `${BASE}/alignment/`;
  await page.goto(at, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  /* THE APP'S OWN ASSERTIONS RUN AT BOOT and throw rather than warn, so
     a failure here is alDrive never being defined. Report the app's own
     message: "cannot read properties of undefined" says nothing. */
  const booted = await page.evaluate(() => !!window.alDrive);
  ok('the app boots', booted, errs[0]);
  if (!booted) { console.log(`\n  ${pass} passed, ${fail} failed`); await browser.close(); process.exit(1); }

  await page.click('#alOpenB');
  await page.waitForTimeout(300);

  /* ── THE SHAPE ─────────────────────────────────────────────────── */

  /* THREE TABS, ASSERTED AS THE EXACT LIST rather than a count: four
     view names left this build in one pass and a count of three would
     pass on any three. */
  ok('three tabs, and they are these three',
     JSON.stringify(await page.evaluate(() =>
       [...document.querySelectorAll('.al-tab')].map(b => b.getAttribute('data-v'))))
     === JSON.stringify(['figures', 'books', 'kept']));

  const views = await page.evaluate(() => window.alDrive.views());
  ok('the view list is the three plus the open screen and a source',
     JSON.stringify(views) === JSON.stringify(['open', 'figures', 'books', 'kept', 'source']), views);

  /* EXACTLY ONE VIEW HAS A REAL BOX. [hidden] and a class are proxies
     for what is drawn, and both have been wrong in this repo before —
     the day a view took a display, the attribute stopped meaning
     anything while it went on being set correctly. */
  const drawn = {};
  for (const v of views) {
    if (v === 'open' || v === 'source') continue;
    await page.evaluate(x => window.alDrive.view(x), v);
    await page.waitForTimeout(220);
    drawn[v] = await page.evaluate(() => [...document.querySelectorAll('.al-view')]
      .filter(n => { const b = n.getBoundingClientRect(); return b.width > 4 && b.height > 4; })
      .map(n => n.id));
  }
  ok('on every view exactly one is drawn',
     Object.values(drawn).every(a => a.length === 1), drawn);

  /* ── THE CONTENT ───────────────────────────────────────────────── */

  const srcs = await page.evaluate(() => {
    const out = [];
    /* SCOPED TO THE PANE. Both indexes stay painted once visited, so a
       document-wide selector counts the figures again while reading the
       books and reports 48 sources out of 24. */
    ['figures', 'books'].forEach(v => { window.alDrive.view(v);
      const id = '#al' + v[0].toUpperCase() + v.slice(1) + 'Pane';
      out.push(...[...document.querySelectorAll(id + ' .al-f[data-src]')].map(n => n.getAttribute('data-src'))); });
    return out;
  });
  ok('twenty-five sources across the two indexes', srcs.length === 25, srcs.length);

  /* Every source opens, names itself, and carries four sections of at
     least three, with both paragraphs of real length on every card. A
     card with one paragraph is the shape this file is for: it is still
     a card, it still draws, and half of it is missing.

     THREE IS A FLOOR HERE TOO, and the count is read off the sections
     rather than pinned at twelve: one source is deliberately deeper
     than the rest and a hard twelve would make the suite fail on the
     feature. What still cannot pass is a section coming up short, or
     the four sections disagreeing with the cards drawn under them —
     which is the half a loosened count could have thrown away. */
  const bad = await page.evaluate((ids) => {
    const out = [];
    ids.forEach(id => {
      window.alDrive.openSource(id);
      const p = document.querySelector('#alSourcePane');
      const title = p.querySelector('h1').textContent;
      const heads = [...p.querySelectorAll('.al-grp')].map(n => n.textContent);
      const cards = [...p.querySelectorAll('.al-th')];
      const thin = cards.filter(c => {
        const ps = c.querySelectorAll('.al-tb');
        return ps.length !== 2
          || ps[0].textContent.split(' ').length < 15
          || ps[1].textContent.split(' ').length < 15;
      }).length;
      const ax = cards.map(c => c.getAttribute('data-x'));
      const per = ['mindset', 'internal', 'external', 'karmic'].map(k => ax.filter(a => a === k).length);
      if (!title || heads.join('|') !== 'Mindset|Internal|External|Karmic'
        || per.some(n => n < 3) || per.reduce((a, b) => a + b, 0) !== cards.length || thin)
        out.push([id, { title, heads, n: cards.length, per, thin }]);
    });
    return out;
  }, srcs);
  ok('every source carries four sections of at least three', bad.length === 0, bad);

  /* AND EXACTLY ONE OF THEM IS DEEPER, asserted as a count rather than by
     name: "some source has more than twelve" passes on a build where the
     flag leaked onto all of them, and naming the id makes it a check on
     the fixture rather than on the rule. */
  const deep = await page.evaluate((ids) => ids.map(id => {
    window.alDrive.openSource(id);
    return document.querySelectorAll('#alSourcePane .al-th').length;
  }), srcs);
  ok('exactly one source runs deeper than twelve',
     deep.filter(n => n > 12).length === 1 && deep.filter(n => n === 12).length === srcs.length - 1,
     deep);

  /* ── THE FOUR HUES ─────────────────────────────────────────────── */

  await page.evaluate(() => window.alDrive.openSource('fifty'));
  await page.waitForTimeout(300);
  const hue = await page.evaluate(() => {
    const out = {};
    ['mindset', 'internal', 'external', 'karmic'].forEach(a => {
      const pick = (x) => {
        const n = document.querySelector('#alSourcePane ' + x);
        if (!n) throw new Error('nothing matched ' + x + ' for ' + a);
        return getComputedStyle(n).color;
      };
      out[a] = {
        les:  pick('.al-th[data-x="' + a + '"] .al-tl.is-les'),
        key:  pick('.al-th[data-x="' + a + '"] .al-tl:not(.is-les)'),
        head: pick('.al-grp[data-x="' + a + '"]'),
      };
    });
    out.dim = getComputedStyle(document.querySelector('#alSourcePane .al-tb')).color;
    return out;
  });
  const AX = ['mindset', 'internal', 'external', 'karmic'];
  const L = (v) => lab(rgbOf(v));
  const dim = L(hue.dim);

  /* BOTH LABELS TAKE THE AXIS HUE. Key theme was flat --dim while the
     lesson's label carried the colour, which made one half of every
     card look like chrome and the other like content. */
  ok('both labels on a card carry the axis, not just the lesson',
     AX.every(a => dE(L(hue[a].key), dim) > 12 && dE(L(hue[a].les), dim) > 12));
  ok('the two labels on a card are the same colour',
     AX.every(a => dE(L(hue[a].key), L(hue[a].les)) < 1));
  /* The heading and the cards it heads are one colour, or the hue has
     stopped meaning one thing on the way down the page. */
  ok('the heading matches the cards under it',
     AX.every(a => dE(L(hue[a].head), L(hue[a].les)) < 1));

  const pairs = {};
  AX.forEach((a, i) => AX.slice(i + 1).forEach(b => {
    pairs[a.slice(0, 3) + '/' + b.slice(0, 3)] = +dE(L(hue[a].les), L(hue[b].les)).toFixed(1);
  }));
  const worst = Math.min(...Object.values(pairs));
  /* Measured on the COMPOSITED label rather than on the hex it was
     mixed from, and against the 12 this repo holds two colours on one
     screen to. They were a washed violet, gold, blue-grey and rust and
     the blue-grey was barely a colour at all. */
  ok(`four hues, worst pair dE ${worst}`, worst >= 12, pairs);

  /* ── PIN AND HIGHLIGHT ─────────────────────────────────────────── */

  /* A MARK IS MADE BY PRESSING THE CONTROL, never by calling mark().
     The wiring between the chip and the record is most of what breaks. */
  const first = await page.evaluate(() => {
    const c = document.querySelector('#alSourcePane .al-th');
    c.querySelector('[data-mk="pin"]').click();
    return c.querySelector('[data-mk="pin"]').getAttribute('data-k');
  });
  await page.waitForTimeout(150);

  /* PINNING IS NOT HIGHLIGHTING. One control doing both is the bug this
     screen exists to make impossible, and it passes any check that only
     looks at the list it was aimed at. */
  ok('a pin lands in pin and nowhere else',
     JSON.stringify(await page.evaluate(() => [window.alDrive.st.pin.slice(), window.alDrive.st.hi.length]))
     === JSON.stringify([[first], 0]));
  ok('the chip says so',
     await page.evaluate(() => document.querySelector('[data-mk="pin"]').getAttribute('aria-pressed')) === 'true');

  const second = await page.evaluate(() => {
    const c = document.querySelectorAll('#alSourcePane .al-th')[4];
    c.querySelector('[data-mk="hi"]').click();
    return c.querySelector('[data-mk="hi"]').getAttribute('data-k');
  });
  await page.waitForTimeout(150);
  ok('the two lists are two lists',
     JSON.stringify(await page.evaluate(() => [window.alDrive.st.pin.length, window.alDrive.st.hi.length]))
     === JSON.stringify([1, 1]));

  await page.evaluate(() => window.alDrive.view('kept'));
  await page.waitForTimeout(300);
  const readKept = () => page.evaluate(() => ({
    count: document.querySelector('#alKept .al-count').textContent,
    stop: document.querySelector('#alKeptStops [aria-current="true"]').textContent,
    keys: [...document.querySelectorAll('#alKeptPane [data-mk="pin"]')].map(b => b.getAttribute('data-k')),
    heads: [...document.querySelectorAll('#alKeptPane .al-grp')].length,
    empty: !!document.querySelector('#alKeptPane .al-empty'),
  }));
  let k = await readKept();
  ok('the Pinned stop draws the pin and only the pin',
     JSON.stringify([k.stop, k.count, k.keys, k.empty, k.heads])
     === JSON.stringify(['Pinned', '1', [first], false, 1]), k);

  await page.evaluate(() => document.querySelector('[data-st="hi"]').click());
  await page.waitForTimeout(250);
  k = await readKept();
  ok('the Highlighted stop draws the highlight and only the highlight',
     JSON.stringify([k.stop, k.count, k.keys, k.empty])
     === JSON.stringify(['Highlighted', '1', [second], false]), k);

  /* UNMARKING FROM THE KEPT SCREEN REMOVES IT. A list that keeps drawing
     a card you just took off is a list that lies about what is in it. */
  await page.evaluate(() => document.querySelector('#alKeptPane [data-mk="hi"]').click());
  await page.waitForTimeout(250);
  k = await readKept();
  ok('taking a mark off empties the stop it was on',
     JSON.stringify([k.count, k.empty, k.keys.length]) === JSON.stringify(['0', true, 0]), k);

  /* ── THE RECORD ────────────────────────────────────────────────── */

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  ok('the marks and the stop survive a reload',
     JSON.stringify(await page.evaluate(() =>
       [window.alDrive.st.pin.slice(), window.alDrive.st.hi.slice(), window.alDrive.st.stop]))
     === JSON.stringify([[first], [], 'hi']));

  /* A KEY POINTING AT NOTHING IS DROPPED AND THE REST IS NOT, AND THE
     REPAIR IS WRITTEN BACK. Held only in memory it is redone every boot
     and lost the moment anything else writes the key — which the
     schedule app in this repo shipped four separate times.

     The keys are minted ABOVE the state block for this exact reason:
     minted below it, st read the record first, every stored key
     resolved to nothing, and this repair deleted every mark and wrote
     the deletion back. Nothing threw and the session was correct
     throughout. That is what the reload above is really for. */
  await page.evaluate(k => localStorage.setItem('align.v1', JSON.stringify({
    last: 'kept', stop: 'sideways', pin: [k, 'nope:mindset:0', 'fifty:nosuch:1'], hi: [k],
  })), first);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  ok('a damaged key costs itself and never the list',
     JSON.stringify(await page.evaluate(() => [window.alDrive.st.pin.slice(), window.alDrive.st.stop]))
     === JSON.stringify([[first], 'pin']));
  ok('and the repair is written back',
     JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem('align.v1')).pin))
     === JSON.stringify([first]));

  /* A STORED VIEW OUTLIVES THE CODE THAT WROTE IT, planted with a name
     that was REAL until this build rather than one invented for the
     check: a phone last left on Karmic is the case that exists. */
  await page.evaluate(() => localStorage.setItem('align.v1', JSON.stringify({ last: 'karmic' })));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.click('#alOpenB');
  await page.waitForTimeout(250);
  ok('a stored view this build no longer has opens on the figures',
     await page.evaluate(() => document.documentElement.getAttribute('data-view')) === 'figures');

  /* ── WHAT A FINGER OWNS ────────────────────────────────────────── */

  /* A DRIVEN TAP CANNOT MEASURE THIS. Chromium snaps a touch to a
     nearby target, so the reading is identical at 40 and at 44 and the
     check can never fail. elementFromPoint has no such forgiveness, so
     the box a control OWNS is walked out from its own centre.

     Deduped by class and box rather than capped by count: a source page
     holds 24 mark chips in two widths, and what a control owns is
     decided by its class and its box. A cap is a number that rots into
     "the first six". */
  const walk = () => page.evaluate(async () => {
    const out = []; const seen = new Set();
    const els = [...document.querySelectorAll('button')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    for (const el of els) {
      const rr = el.getBoundingClientRect();
      const shape = (el.className || el.id) + '|' + Math.round(rr.width) + 'x' + Math.round(rr.height);
      if (seen.has(shape)) continue;
      seen.add(shape);
      el.scrollIntoView({ block: 'center' });
      await new Promise(r => requestAnimationFrame(r));
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const mine = (n) => n === el || el.contains(n);
      if (!mine(document.elementFromPoint(cx, cy))) { out.push({ shape, owns: '0x0', ok: false }); continue; }
      const go = (dx, dy) => { let d = 0;
        while (d < 80 && mine(document.elementFromPoint(cx + dx * (d + .5), cy + dy * (d + .5)))) d += .5;
        return d; };
      const w = go(-1, 0) + go(1, 0), h = go(0, -1) + go(0, 1);
      out.push({ shape, owns: +w.toFixed(1) + 'x' + +h.toFixed(1), ok: w >= 44 && h >= 44 });
    }
    return { out, seen: els.length };
  });

  const shapes = []; const per = {};
  for (const v of views) {
    if (v === 'open' || v === 'source') continue;
    await page.evaluate(x => window.alDrive.view(x), v);
    await page.waitForTimeout(250);
    const r = await walk(); per[v] = r.seen; shapes.push(...r.out);
  }
  await page.evaluate(() => window.alDrive.openSource('gymsh'));
  await page.waitForTimeout(300);
  { const r = await walk(); per.source = r.seen; shapes.push(...r.out); }
  /* Kept with something on it, or its two stops are the whole of what
     gets measured and the cards on them are never looked at. */
  await page.evaluate(() => {
    window.alDrive.mark('pin', 'gymsh:mindset:0');
    window.alDrive.view('kept');
  });
  await page.waitForTimeout(300);
  { const r = await walk(); per.kept1 = r.seen; shapes.push(...r.out); }

  /* A CHECK THAT LOOKS AT NOTHING MUST NOT PASS, and per view rather
     than in total: one pane with forty controls hides four with none. */
  ok('every view has controls on it', Object.values(per).every(n => n > 0), per);
  ok(`${shapes.length} control shapes, none under 44`,
     shapes.every(x => x.ok), shapes.filter(x => !x.ok));

  /* ── WHAT EVERY WORD ON THE PAGE MEASURES ──────────────────────── */

  /* ON COMPOSITED PIXELS, NEVER ON THE TOKEN. This repo has shipped a
     1.74:1 chip, a 2.92:1 glyph and a 4.43:1 hint that all passed the
     arithmetic, because the arithmetic knows about --paper and the
     screen knows about four washes over it.

     The ground is the MOST COMMON pixel inside the element's own box
     with the text made transparent — a min/max picks antialiased edge
     pixels at both ends and reported a shipped screen at 4.02:1 once.

     EVERY SOURCE, not one of them. The four axis panes used to put all
     288 cards under this; with them gone a single source page is twelve
     cards, and the sweep fell from 1417 elements to 145 without a word
     being said about it. */
  const { PNG } = require('pngjs');
  const lin = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
  const over = ([r, g, b, a], bg) => a >= 1 ? [r, g, b]
    : [0, 1, 2].map(i => Math.round([r, g, b][i] * a + bg[i] * (1 - a)));

  const shots = [];
  async function scan(label, seen) {
    const boxes = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('*').forEach(n => {
        if (![...n.childNodes].some(c => c.nodeType === 3 && /\S/.test(c.nodeValue))) return;
        const bb = n.getBoundingClientRect();
        if (bb.width < 4 || bb.height < 4) return;
        /* getBoundingClientRect reports a box whether or not an ancestor
           is clipping it, so a scrolled-out card still answers here.
           Bound by whatever actually clips it, and by the viewport. */
        let clip = n.parentElement;
        while (clip && getComputedStyle(clip).overflowY === 'visible') clip = clip.parentElement;
        const cb = clip ? clip.getBoundingClientRect() : { top: 0, bottom: innerHeight };
        const top = Math.max(0, cb.top), bot = Math.min(innerHeight, cb.bottom);
        if (bb.bottom <= top + 1 || bb.top >= bot - 1) return;
        const cs = getComputedStyle(n);
        const raw = cs.color;
        let m;
        if (/^color\(/.test(raw)) {
          const f = raw.match(/[-\d.]+/g).map(Number);
          m = [Math.round(f[0] * 255), Math.round(f[1] * 255), Math.round(f[2] * 255), f.length > 3 ? f[3] : 1];
        } else { m = raw.match(/[\d.]+/g).map(Number); }
        out.push({ key: (n.className || '') + '|' + (n.textContent || '').slice(0, 40),
                   what: (n.className || n.tagName) + '', size: parseFloat(cs.fontSize), weight: cs.fontWeight,
                   fg: [m[0], m[1], m[2], m.length > 3 ? m[3] : 1],
                   x: Math.round(bb.left), y: Math.round(bb.top),
                   w: Math.round(bb.width), h: Math.round(bb.height) });
      });
      return out;
    });
    if (!boxes.length) return;
    await page.addStyleTag({ content: '*{color:transparent!important}' });
    await page.waitForTimeout(110);
    const buf = await page.screenshot();
    await page.evaluate(() => { const t = document.querySelectorAll('style'); t[t.length - 1].remove(); });
    const png = PNG.sync.read(buf), D = 2;
    for (const e of boxes) {
      if (seen.has(e.key)) continue;
      seen.add(e.key);
      const tally = new Map();
      for (let y = e.y * D; y < (e.y + e.h) * D; y += 2)
        for (let x = e.x * D; x < (e.x + e.w) * D; x += 2) {
          if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
          const i = (png.width * y + x) << 2;
          const k = `${png.data[i]},${png.data[i + 1]},${png.data[i + 2]}`;
          tally.set(k, (tally.get(k) || 0) + 1);
        }
      if (!tally.size) continue;
      const g = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0].split(',').map(Number);
      const fg = over(e.fg, g);
      /* WCAG's larger-text allowance starts at 18.66px bold or 24px. */
      const need = e.size >= 24 || (e.size >= 18.66 && +e.weight >= 700) ? 3.0 : 4.5;
      shots.push({ view: label, what: e.what.slice(0, 30), px: e.size,
                   r: +ratio(fg, g).toFixed(2), need, pass: ratio(fg, g) >= need });
    }
  }

  /* A SCAN MEASURES ONE FRAME, AND THE VIEWPORT IS NOT THE CONTENT.
     Every pane is walked through its own full travel, deduped by
     element, so what is counted is what is DRAWN rather than what
     happens to be on screen at one scroll top. */
  async function sweep(label) {
    const seen = new Set();
    const max = await page.evaluate(() => {
      const p = [...document.querySelectorAll('.al-pane')]
        .find(n => n.offsetParent && n.scrollHeight > n.clientHeight + 4);
      return p ? p.scrollHeight - p.clientHeight : 0;
    });
    for (let t = 0; ; t += 700) {
      const y = Math.min(t, max);
      await page.evaluate(v => { const p = [...document.querySelectorAll('.al-pane')]
        .find(n => n.offsetParent && n.scrollHeight > n.clientHeight + 4); if (p) p.scrollTop = v; }, y);
      await page.waitForTimeout(140);
      await scan(label, seen);
      if (y >= max) break;
    }
  }

  await page.evaluate(() => { localStorage.removeItem('align.v1'); });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await sweep('open');
  await page.click('#alOpenB'); await page.waitForTimeout(350);
  for (const v of views) {
    if (v === 'open' || v === 'source') continue;
    await page.evaluate(x => window.alDrive.view(x), v);
    await page.waitForTimeout(300);
    await sweep(v);                      // kept is empty here: the empty state
  }
  /* Kept with something on it, both stops, so the cards and the chips'
     pressed ground are measured rather than only the sentence. */
  await page.evaluate(() => {
    window.alDrive.mark('pin', 'gymsh:mindset:0');
    window.alDrive.mark('hi', 'spanx:karmic:1');
    window.alDrive.view('kept');
  });
  await page.waitForTimeout(300); await sweep('kept-pin');
  await page.evaluate(() => document.querySelector('[data-st="hi"]').click());
  await page.waitForTimeout(300); await sweep('kept-hi');
  for (const id of srcs) {
    await page.evaluate(x => window.alDrive.openSource(x), id);
    await page.waitForTimeout(220);
    await sweep('src:' + id);
  }

  const under = shots.filter(x => !x.pass);
  const byView = {};
  shots.forEach(x => { byView[x.view] = (byView[x.view] || 0) + 1; });
  /* A CHECK THAT LOOKS AT NOTHING MUST NOT PASS, and per label rather
     than in total: one pane with three hundred elements hides a label
     that came back empty. */
  ok('every screen swept had words on it', Object.values(byView).every(n => n > 0)
     && Object.keys(byView).length >= srcs.length + 4, byView);
  ok(`${shots.length} elements measured on composited pixels, none under the bar`,
     under.length === 0, under.slice(0, 8));

  /* ── NOTHING LEAVES, AND NOTHING THREW ─────────────────────────── */

  /* The whole app is one static file and a font. A request off this
     origin is the only kind that could carry anything about you, and
     there is nothing here that should ever make one. */
  const off = [];
  page.on('request', r => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) off.push(r.url()); });
  await page.evaluate(() => { window.alDrive.view('figures'); window.alDrive.openSource('hormo'); });
  await page.waitForTimeout(400);
  ok('nothing leaves the origin', off.length === 0, off);
  ok('no page errors', errs.length === 0, errs);
  ok('nothing 404s', http4.length === 0, http4);

  console.log(`\n  ${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
