/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — PAGE CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 *  Extracted verbatim from the inline <script> that used to live at the foot
 *  of gene-keys.html. Behaviour is unchanged; what changes is WHEN it runs.
 *
 *  Inline scripts are not deferred, so this code used to execute before every
 *  deferred file it depends on — which is why it has to guard
 *  window.DGeneKeysContent and re-select on DOMContentLoaded. That is a race:
 *  fine on a warm cache, blank on a cold load. Loaded with defer it now runs
 *  after all of them, in document order. The guards are kept as written.
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';
/* ═══════════════════════════════════════════════════════════════════════
   Sixty-four plates stacked on a common spindle, drawn axonometrically.
   Selecting a plate explodes the stack along the spindle and withdraws
   that plate to a detail view. All geometry is pixel-space so hairlines
   stay hairlines at every viewport.
   ═══════════════════════════════════════════════════════════════════════ */
const SVGNS = 'http://www.w3.org/2000/svg';
const N = 64;
const BP = 900;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
const svg = document.getElementById('drawing');

/* The thirteen spheres, in the order the Golden Path reads them. Ordering
   matters twice over: a plate carrying two spheres lists them in this order,
   and it is the order the panel renders their readings in. Entries beyond the
   Activation four resolve only once the planetary ephemeris has loaded; a
   sphere with no computed key is simply absent, never guessed. */
const ROLES = [
  ['lifesWork',  "Life's Work", 'how your genius wants to express itself in the world'],
  ['evolution',  'Evolution',   'what your life keeps asking you to work through'],
  ['radiance',   'Radiance',    'what keeps you physically and emotionally lit'],
  ['purpose',    'Purpose',     'the deep reason running underneath it all'],
  ['attraction', 'Attraction',  'the field that draws certain people to you'],
  ['iq',         'IQ',          'how your mind actually solves things'],
  ['eq',         'EQ',          'how you meet feeling, your own and other people’s'],
  ['sq',         'SQ',          'what you understand that was never taught to you'],
  ['core',       'Core',        'the wound the rest of the pattern is built around'],
  ['vocation',   'Vocation',    'the work your life keeps pointing back toward'],
  ['culture',    'Culture',     'the people and setting you do your best work inside'],
  ['brand',      'Brand',       'what others recognise you by before you speak'],
  ['pearl',      'Pearl',       'where ease and prosperity actually come from'],
];

let W = 0, H = 0, axisX = 0, midY = 0;
let gapClosed = 2.7, gapOpen = 10, gapDrawn = 23, plateR = 58, primeR = 76;
// rung index -> the role indices fitted to that plate. An ARRAY, not a single
// index: two spheres can legitimately land on one key (in the full profile
// Vocation always shares Core's key and Brand always shares Life's Work's),
// and coincidental collisions happen too. A scalar here silently drops one.
let primes = null, roleOf = {};
/* Two stages, tweened independently.
   ex — the assembly opening from a solid screw into a separated stack, all
        sixty-four plates still on the sheet, the four fitted ones marked.
   sx — a single plate then being drawn out of that stack for inspection.
   Smoothing is exponential toward a target so a click part-way through an
   animation redirects it instead of jumping.                              */
let selIdx = -1, ex = 0, exT = 0, sx = 0, sxT = 0, raf = 0, lastT = 0;
const SMOOTH_MS = 460;
const plateEls = [], INDEX_OF = {};
DGeneKeys.WHEEL.forEach((k, i) => { INDEX_OF[k] = i; });

/* layers, drawn back to front */
const gGuide  = document.createElementNS(SVGNS, 'g');
const gStack  = document.createElementNS(SVGNS, 'g');
const gLeader = document.createElementNS(SVGNS, 'g');
const gDetail = document.createElementNS(SVGNS, 'g');
[gGuide, gStack, gLeader, gDetail].forEach(g => svg.appendChild(g));

// Generous invisible target over the closed screw — the plates themselves are
// clickable, but a thin stack is a small thing to hit with a thumb.
const hitPad = document.createElementNS(SVGNS, 'rect');
hitPad.setAttribute('fill', 'transparent');
hitPad.style.cursor = 'pointer';
hitPad.addEventListener('click', (e) => { e.stopPropagation(); if (exT < 0.5) openAssembly(); });
gGuide.appendChild(hitPad);

const spindle = document.createElementNS(SVGNS, 'line');
spindle.setAttribute('stroke', 'var(--ink-3)');
spindle.setAttribute('stroke-width', '0.75');
spindle.setAttribute('stroke-dasharray', '9 3 1.5 3');   // centre-line convention
gGuide.appendChild(spindle);

const el = (tag, attrs, parent) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (parent || svg).appendChild(e);
  return e;
};

function buildStack() {
  if (plateEls.length) return;
  for (let i = 0; i < N; i++) {
    const g = document.createElementNS(SVGNS, 'g');
    const face = el('ellipse', { fill: 'var(--paper)', 'fill-opacity': '.92',
      stroke: 'var(--ink)', 'stroke-width': '0.75' }, g);
    const rim = el('path', { fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': '0.6' }, g);
    g.style.cursor = 'pointer';
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      if (exT < 0.5) openAssembly();          // closed screw: open it first
      else select(DGeneKeys.WHEEL[i]);
    });
    gStack.appendChild(g);
    plateEls.push({ g, face, rim });
  }
}

const easeOut = k => 1 - Math.pow(1 - k, 3);

function layout() {
  W = window.innerWidth; H = window.innerHeight;
  const mobile = W < BP;
  axisX = mobile ? 54 : W * 0.235;
  // on a phone the title block owns the bottom of the sheet, so the stack
  // rides above it — otherwise the lowest tag card lands underneath it
  midY = mobile ? H * 0.45 : H * 0.5;
  plateR = mobile ? Math.min(30, W * 0.085) : Math.min(66, W * 0.068);
  primeR = plateR * 1.34;
  gapClosed = 2.6;
  gapOpen = mobile ? 8 : 10.5;        // stage 1: every plate on the sheet
  gapDrawn = mobile ? 17 : 23;          // stage 2: spread around the selection
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  positionSpec();
  render();
}

function gapNow() {
  return gapClosed + (gapOpen - gapClosed) * ex + (gapDrawn - gapOpen) * sx;
}
function plateY(i) {
  const gap = gapNow();
  // once a plate is drawn out it holds the centre of the sheet, and the wider
  // spread simply runs off the top and bottom edges
  const shift = selIdx >= 0 ? -((selIdx - (N - 1) / 2) * gap) * sx : 0;
  return midY + (i - (N - 1) / 2) * gap + shift;
}

function render() {
  const mobile = W < BP;
  // spindle spans the stack plus overrun, per drawing convention
  const y0 = plateY(0) - 26, y1 = plateY(N - 1) + 26;
  const padW = primeR * 2 + 40;
  hitPad.setAttribute('x', axisX - padW / 2);
  hitPad.setAttribute('y', y0);
  hitPad.setAttribute('width', padW);
  hitPad.setAttribute('height', Math.max(0, y1 - y0));
  hitPad.style.display = ex < 0.5 ? '' : 'none';   // only while closed
  spindle.setAttribute('x1', axisX); spindle.setAttribute('y1', y0);
  spindle.setAttribute('x2', axisX); spindle.setAttribute('y2', y1);

  for (let i = 0; i < N; i++) {
    const p = plateEls[i];
    const isPrime = !!roleOf[i];
    const isSel = i === selIdx;
    // the selected plate withdraws from the stack toward the detail view
    const pull = isSel ? sx * (mobile ? W * 0.26 : W * 0.19) : 0;
    const r = (isPrime ? primeR : plateR) * (1 + (isSel ? sx * 0.12 : 0));
    const cx = axisX + pull, cy = plateY(i) - (isSel ? sx * 26 : 0);
    const ry = r * 0.235;
    p.face.setAttribute('cx', cx); p.face.setAttribute('cy', cy);
    p.face.setAttribute('rx', r);  p.face.setAttribute('ry', ry);
    // today's plate is marked only when it is not already yours — the accent
    // means one thing at a time, and "fitted to you" always outranks "live now"
    const isToday = !isPrime && !isSel && DGeneKeys.WHEEL[i] === todayKey;
    p.face.setAttribute('stroke', isSel ? 'var(--mark)' : (isToday ? 'var(--mark-2)' : 'var(--ink)'));
    p.face.setAttribute('stroke-width', isSel ? 1.4 : (isPrime ? 0.95 : (isToday ? 0.9 : 0.6)));
    p.face.setAttribute('stroke-dasharray', isToday ? '3 2.5' : 'none');
    p.face.setAttribute('fill-opacity', ex > 0.02 ? 0.9 : 0.98);
    // plate thickness: a second arc under the face, joined at the extremes
    const t = isPrime ? 3.4 : 2.2;
    p.rim.setAttribute('d',
      'M' + (cx - r) + ',' + cy + ' A' + r + ',' + ry + ' 0 0 0 ' + (cx + r) + ',' + cy +
      ' L' + (cx + r) + ',' + (cy + t) + ' A' + r + ',' + ry + ' 0 0 1 ' + (cx - r) + ',' + (cy + t) + ' Z');
    p.rim.setAttribute('stroke', isSel ? 'var(--mark)' : 'var(--ink-3)');
    p.rim.setAttribute('fill', isPrime ? 'var(--paper2)' : 'none');
    p.rim.setAttribute('fill-opacity', isPrime ? 0.8 : 0);
  }
  drawDim();
  drawCallouts();
  drawDetail();
}

/* overall dimension, drafting convention: witness lines, arrowheads, value */
const gDim = document.createElementNS(SVGNS, 'g');
svg.insertBefore(gDim, gLeader);
function drawDim() {
  gDim.textContent = '';
  const o = 1 - Math.max(ex, sx);         // only meaningful on the assembled view
  if (o < 0.05) return;
  const x = axisX + primeR + 40;
  const yA = plateY(0) - 4, yB = plateY(N - 1) + 8;
  const g = document.createElementNS(SVGNS, 'g');
  g.setAttribute('opacity', o.toFixed(2));
  gDim.appendChild(g);
  el('line', { x1: axisX + primeR + 6, y1: yA, x2: x + 7, y2: yA, stroke: 'var(--ink-3)', 'stroke-width': '0.5' }, g);
  el('line', { x1: axisX + primeR + 6, y1: yB, x2: x + 7, y2: yB, stroke: 'var(--ink-3)', 'stroke-width': '0.5' }, g);
  el('line', { x1: x, y1: yA, x2: x, y2: yB, stroke: 'var(--ink-3)', 'stroke-width': '0.5' }, g);
  el('path', { d: 'M' + x + ',' + yA + ' l-3,7 l6,0 Z', fill: 'var(--ink-3)' }, g);
  el('path', { d: 'M' + x + ',' + yB + ' l-3,-7 l6,0 Z', fill: 'var(--ink-3)' }, g);
  const t = el('text', { x: x + 12, y: (yA + yB) / 2, fill: 'var(--ink-3)',
    'font-size': '9', 'letter-spacing': '1.6', 'dominant-baseline': 'middle' }, g);
  t.style.fontFamily = 'var(--mono)';
  t.textContent = '64 PLTS';
}

/* ── callouts: a tag card on a hard pointer, one per fitted plate ─────── */
// Each of the four fitted plates gets a small card — the role it was fitted
// as, plus its plate number — carried on a solid tapered pointer back to the
// plate itself. The card IS the label and the click target, drawn in SVG so
// it exists identically on a phone; the old HTML labels were display:none
// under 900px, which left mobile with pointers aimed at nothing.
const CARD_W = Object.create(null);          // measured once per label
function cardWidth(t, fs, tr) {
  const k = t + '|' + fs;
  if (CARD_W[k] == null) {
    const probe = el('text', { x: -9999, y: -9999, 'font-size': fs }, svg);
    probe.style.fontFamily = 'var(--mono)';
    probe.style.letterSpacing = tr;
    probe.textContent = t;
    CARD_W[k] = probe.getComputedTextLength();
    probe.remove();
  }
  return CARD_W[k];
}

function drawCallouts() {
  gLeader.textContent = '';
  if (!primes) return;
  const mobile = W < BP;
  // the pointers belong to the opened assembly — they fade in with it
  const ptrO = Math.max(0, (ex - 0.3) / 0.7);
  if (ptrO <= 0.01) return;

  // On a phone there is no room to the left of the spindle, so the cards sit
  // out to the right instead and the whole assembly mirrors.
  const dir = mobile ? 1 : -1;

  // One card per fitted PLATE, not per sphere: roleOf already merges the
  // spheres that share a key.
  const cards = [];
  Object.keys(roleOf).forEach(k => {
    const i = Number(k);
    cards.push({ i, key: DGeneKeys.WHEEL[i], roles: roleOf[i].slice() });
  });
  cards.sort((a, b) => a.i - b.i);

  // Eleven plates can sit a few pixels apart while a card is ~28px tall, so
  // the cards would overlap and become unreadable. Place each at its plate's
  // height, then sweep down and back up pushing any pair that still overlaps
  // apart. The pointer stays anchored to the plate, so a nudged card still
  // points at the right one.
  const chH = (mobile ? 24 : 28) + 3;
  cards.forEach(c => {
    const isSel = c.i === selIdx;
    c.py = plateY(c.i) - (isSel ? sx * 26 : 0);
    c.cy = c.py;
  });
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].cy - cards[i - 1].cy < chH) cards[i].cy = cards[i - 1].cy + chH;
  }
  for (let i = cards.length - 2; i >= 0; i--) {
    if (cards[i + 1].cy - cards[i].cy < chH) cards[i].cy = cards[i + 1].cy - chH;
  }

  cards.forEach(card => {
    const key = card.key, i = card.i;
    const isSel = i === selIdx;
    const pull = isSel ? sx * (mobile ? W * 0.26 : W * 0.19) : 0;
    const rr = primeR * (1 + (isSel ? sx * 0.12 : 0));
    const y = card.py;                      // where the plate is
    const ly = card.cy;                     // where the card sits after nudging
    // a spread stack runs off the sheet; don't leave pointers aiming at nothing
    if (y < 30 || y > H - 30 || ly < 20 || ly > H - 20) return;
    // once a plate is withdrawn on mobile the other three cards would collide
    // with the detail view, and they are not what is being read anyway
    const fade = (mobile && !isSel) ? (1 - sx) : 1;
    if (fade <= 0.02) return;
    const o = ptrO * fade;

    const title = card.roles.map(ri => ROLES[ri][1]).join(' · ').toUpperCase();
    const fs = mobile ? 8.5 : 9.5, tr = mobile ? '.13em' : '.17em';
    const tw = cardWidth(title, fs, tr);
    const numW = mobile ? 20 : 24;
    const cw = tw + numW + (mobile ? 22 : 28);
    const ch = mobile ? 24 : 28;

    // plate edge -> pointer -> card. Everything measures out from the edge.
    const edge = axisX + pull + dir * rr;
    const run = mobile ? 16 : 46;                 // length of the pointer body
    let cardOut = edge + dir * (run + cw);        // far edge of the card
    // keep the card on the sheet
    const margin = 12;
    if (dir < 0 && cardOut < margin) cardOut = margin;
    if (dir > 0 && cardOut > W - margin) cardOut = W - margin;
    const cardIn = cardOut - dir * cw;            // card edge nearest the plate

    const tipX = edge + dir * 3, tailX = cardIn, hw = 3.1;
    const ink = isSel ? 'var(--mark)' : 'var(--ink)';

    // The pointer is a solid taper from the plate to the card's near edge. It
    // starts at the plate's own height and lands at the card's, so a card
    // nudged clear of its neighbour still visibly belongs to its plate.
    el('path', {
      d: 'M' + tipX + ',' + y +
         ' L' + tailX + ',' + (ly - hw) +
         ' L' + tailX + ',' + (ly + hw) + ' Z',
      fill: ink, 'fill-opacity': (isSel ? 1 : 0.86) * o, stroke: 'none'
    }, gLeader);
    el('circle', { cx: edge, cy: y, r: 2.4, fill: ink, 'fill-opacity': o }, gLeader);

    // the card body
    const cx0 = Math.min(cardIn, cardOut);
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('opacity', o.toFixed(2));
    g.style.cursor = 'pointer';
    gLeader.appendChild(g);

    el('rect', { x: cx0, y: ly - ch / 2, width: cw, height: ch,
      fill: 'var(--paper)', stroke: ink,
      'stroke-width': isSel ? 1.3 : 1 }, g);
    // an inner rule, the way a real drawing tags a part
    el('rect', { x: cx0 + 3, y: ly - ch / 2 + 3, width: cw - 6, height: ch - 6,
      fill: 'none', stroke: ink, 'stroke-opacity': .28, 'stroke-width': .7 }, g);
    // the plate number sits in its own compartment at the plate end
    const numX = dir < 0 ? cx0 + cw - numW : cx0 + numW;
    el('line', { x1: numX, y1: ly - ch / 2 + 3, x2: numX, y2: ly + ch / 2 - 3,
      stroke: ink, 'stroke-opacity': .28, 'stroke-width': .7 }, g);

    const num = el('text', { x: dir < 0 ? cx0 + cw - numW / 2 : numW / 2 + cx0,
      y: ly + 4, 'text-anchor': 'middle', 'font-size': mobile ? 11 : 12,
      fill: ink }, g);
    num.style.fontFamily = 'var(--mono)';
    num.textContent = key;

    const lab = el('text', { x: dir < 0 ? cx0 + 11 : cx0 + numW + 11,
      y: ly + 3.5, 'font-size': fs, fill: ink,
      'fill-opacity': isSel ? 1 : .82 }, g);
    lab.style.fontFamily = 'var(--mono)';
    lab.style.letterSpacing = tr;
    lab.textContent = title;

    // a thumb-sized invisible band over card AND pointer — the pointer draws
    // above the plates, so if it is not the click target the click falls
    // through to the background handler and closes the assembly
    const hx = Math.min(tipX, cx0), hw2 = Math.max(cx0 + cw, tipX) - hx;
    const hit = el('rect', { x: hx, y: ly - Math.max(ch / 2, 15),
      width: hw2, height: Math.max(ch, 30), fill: 'transparent' }, g);
    hit.style.cursor = 'pointer';
    g.addEventListener('click', (e) => { e.stopPropagation(); select(key); });
  });
}

/* ── detail view: the withdrawn plate, in front elevation ─────────────── */
function drawDetail() {
  gDetail.textContent = '';
  if (selIdx < 0 || sx < 0.25) return;
  const mobile = W < BP;
  const o = (sx - 0.25) / 0.75;
  const R = mobile ? Math.min(52, W * 0.15) : Math.min(104, W * 0.085);
  const cx = mobile ? W * 0.66 : W * 0.455;
  const cy = mobile ? H * 0.30 : H * 0.29;
  const g = document.createElementNS(SVGNS, 'g');
  g.setAttribute('opacity', o.toFixed(2));
  gDetail.appendChild(g);

  el('circle', { cx, cy, r: R, fill: 'var(--paper)', stroke: 'var(--mark)', 'stroke-width': '1.2' }, g);
  el('circle', { cx, cy, r: R + 7, fill: 'none', stroke: 'var(--mark-2)',
    'stroke-width': '0.6', 'stroke-dasharray': '4 3' }, g);
  // centre marks
  el('line', { x1: cx - R - 14, y1: cy, x2: cx + R + 14, y2: cy,
    stroke: 'var(--ink-3)', 'stroke-width': '0.5', 'stroke-dasharray': '8 3 1 3' }, g);
  el('line', { x1: cx, y1: cy - R - 14, x2: cx, y2: cy + R + 14,
    stroke: 'var(--ink-3)', 'stroke-width': '0.5', 'stroke-dasharray': '8 3 1 3' }, g);

  // the key engraved as its King Wen hexagram
  const key = DGeneKeys.WHEEL[selIdx];
  const lines = window.DHexagrams ? DHexagrams.lines(key) : null;
  if (lines) {
    const bw = R * 1.02, bh = 5.2, gapY = R * 0.235;
    lines.forEach((v, k) => {
      const yy = cy + (2.5 - k) * gapY;      // bottom line first, drawn upward
      if (v) {
        el('rect', { x: cx - bw / 2, y: yy - bh / 2, width: bw, height: bh,
          fill: 'var(--ink)' }, g);
      } else {
        const seg = bw * 0.40;
        el('rect', { x: cx - bw / 2, y: yy - bh / 2, width: seg, height: bh, fill: 'var(--ink)' }, g);
        el('rect', { x: cx + bw / 2 - seg, y: yy - bh / 2, width: seg, height: bh, fill: 'var(--ink)' }, g);
      }
    });
  }
  // leader from the detail back to its slot in the stack
  const sy = plateY(selIdx) - sx * 26;
  const sxx = axisX + sx * (mobile ? W * 0.26 : W * 0.19);
  el('path', { d: 'M' + sxx + ',' + sy + ' L' + (cx - R - 10) + ',' + cy,
    stroke: 'var(--mark-2)', 'stroke-width': '0.6', fill: 'none', 'stroke-dasharray': '5 4' }, g);
}

/* ── the specification sheet ──────────────────────────────────────────── */
const spec = document.getElementById('spec');
function positionSpec() {
  const mobile = W < BP;
  if (mobile) {
    spec.style.left = '22px'; spec.style.right = '22px'; spec.style.width = 'auto';
    spec.style.top = (H * 0.13) + 'px';
    spec.style.height = (H * 0.70) + 'px';
  } else {
    const L = W * 0.56;
    spec.style.left = L + 'px';
    spec.style.right = 'auto';
    spec.style.width = Math.min(560, W - L - 46) + 'px';
    spec.style.top = (H * 0.16) + 'px';
    spec.style.height = (H * 0.66) + 'px';
  }
}

function sect(label, mark, text, small) {
  const l = document.createElement('div');
  l.className = 's-lab';
  l.appendChild(document.createTextNode(label + ' '));
  const i = document.createElement('i'); i.textContent = mark; l.appendChild(i);
  const b = document.createElement('div');
  b.className = 's-body' + (small ? ' small' : '');
  b.textContent = text;
  return [l, b];
}

/* ── linkage: the relations a plate carries whatever the subject ──────────
   The programming partner (its exact binary complement) and the codon ring
   it shares with its amino-acid family. Neither depends on a birth date, and
   both put more of the wheel on screen than four plates alone can. Ring-mates
   that are the subject's own keys are marked, because a ring shared by two of
   your four is a real cross-link in your chart rather than trivia. */
/* ── today's transit ──────────────────────────────────────────────────────
   The Sun keeps moving after you are born, so one plate is always live. This
   costs no new astronomy — solarLongitude already accepts any date — and it
   is the only thing on the sheet that changes on its own.

   Precedence when a plate is several things at once: your own fitted plate
   outranks a partner, which outranks a ring-mate, which outranks today. The
   accent must never be ambiguous about which of those it is claiming. */
let todayKey = null;

function refreshToday() {
  const iso = new Date().toISOString().slice(0, 10);
  todayKey = DGeneKeys.keyAt(DGeneKeys.solarLongitude(iso));
  const el = document.getElementById('tb-today');
  if (!el) return;
  el.textContent = '';
  const k = DGeneKeys.KEYS[todayKey];
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = 'Plate ' + todayKey;
  b.title = k ? k.name : '';
  b.addEventListener('click', e => { e.stopPropagation(); select(todayKey); });
  el.appendChild(b);

  // say what today means for this subject, but only when it actually means
  // something — an unconditional line would read as noise within a week
  const mine = myKeys();
  let note = '';
  const ri = mine.indexOf(todayKey);
  if (ri !== -1) note = ' · your ' + ROLES[ri][1];
  else if (window.DHexagrams && DHexagrams.VALID &&
           mine.indexOf(DHexagrams.partner(todayKey)) !== -1) note = ' · partners yours';
  else if (window.DCodonRings && DCodonRings.VALID &&
           DCodonRings.shared(mine.concat(todayKey))
             .some(x => x.keys.indexOf(todayKey) !== -1)) note = ' · your ring';
  if (note) {
    const i = document.createElement('i');
    i.className = 'hit'; i.style.fontStyle = 'normal'; i.textContent = note;
    el.appendChild(i);
  }
}

function myKeys() {
  return primes ? ROLES.map(r => primes[r[0]] && primes[r[0]].key).filter(Boolean) : [];
}

function fillLinkage(n) {
  const dl = document.getElementById('s-link');
  if (!dl) return;
  dl.textContent = '';
  const mine = myKeys();

  const row = (label, build) => {
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); build(dd);
    dl.appendChild(dt); dl.appendChild(dd);
  };

  const keyBtn = k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(k);
    b.title = DGeneKeys.KEYS[k] ? DGeneKeys.KEYS[k].name : ('Plate ' + k);
    if (mine.indexOf(k) !== -1) b.className = 'own';
    b.addEventListener('click', e => { e.stopPropagation(); select(k); });
    return b;
  };

  // The line comes first: it is the part of the fitting that only a birth
  // time can determine, and it is what makes two people with the same key
  // read differently.
  (roleOf[INDEX_OF[n]] || []).forEach(ri => {
    const sp = primes[ROLES[ri][0]];
    if (!sp || sp.line == null) return;
    row(ROLES[ri][1], dd => {
      const b = document.createElement('b');
      b.textContent = 'Line ' + sp.line;
      dd.appendChild(b);
      dd.appendChild(document.createTextNode(' of 6'));
      // Say so when the longitude sits inside the solar series' own error bar
      // rather than presenting a coin-flip as a fact.
      if (sp.nearBoundary) {
        const i = document.createElement('i');
        i.style.fontStyle = 'normal';
        i.className = 'own';
        i.textContent = ' · on the boundary, may be either side';
        dd.appendChild(i);
      }
    });
  });

  const partner = window.DHexagrams && DHexagrams.VALID ? DHexagrams.partner(n) : null;
  if (partner) row('Partner', dd => {
    dd.appendChild(keyBtn(partner));
    const k = DGeneKeys.KEYS[partner];
    if (k) dd.appendChild(document.createTextNode(' — ' + k.name));
  });

  const ring = window.DCodonRings && DCodonRings.VALID ? DCodonRings.ringOf(n) : null;
  if (ring) {
    row('Ring', dd => {
      const b = document.createElement('b'); b.textContent = ring.name;
      dd.appendChild(b);
      dd.appendChild(document.createTextNode(' · ' + ring.amino + ' · ' + DCodonRings.codonOf(n)));
    });
    const mates = ring.keys.filter(k => k !== n);
    if (mates.length) row('Ring-mates', dd => {
      mates.forEach((k, i) => {
        if (i) dd.appendChild(document.createTextNode(' '));
        dd.appendChild(keyBtn(k));
      });
    });
  }
}

function fillSpec(n) {
  const k = DGeneKeys.KEYS[n];
  // every role fitted to this plate, not just the first one found
  const ris = roleOf[INDEX_OF[n]] || [];
  const c = window.DGeneKeysContent ? DGeneKeysContent.get(n) : null;
  const proseFor = ri => (window.DGKRoles ? DGKRoles.get(ROLES[ri][0], n) : null) || c;

  document.getElementById('s-fig').textContent = 'Fig. 2 — Detail A · Plate ' + n;
  document.getElementById('s-ref').textContent = k.shadow + ' → ' + k.gift + ' → ' + k.siddhi;
  document.getElementById('s-title').textContent = k.name;
  document.getElementById('s-sub').textContent = c ? c.tagline : '';
  document.getElementById('s-role').textContent = ris.length
    ? 'Fitted as ' + ris.map(ri => ROLES[ri][1] + ' — ' + ROLES[ri][2]).join('; and as ') + '.'
    : 'Not fitted to this assembly — a plate you meet in the world rather than carry.';
  document.getElementById('tb-sheet').textContent = '1 of 1 · Fig. 2';

  fillLinkage(n);

  const box = document.getElementById('s-parts');
  box.textContent = '';
  if (c && c.essence) box.append(...sect('Function', '', c.essence, true));
  // one plate can carry more than one sphere, and the same key read in two
  // positions is two different readings — so render a full triad per role
  const slots = ris.length ? ris : [-1];
  let wrote = false;
  slots.forEach(ri => {
    const prose = ri >= 0 ? proseFor(ri) : c;
    if (!prose) return;
    wrote = true;
    if (slots.length > 1) box.append(...sect('As ' + ROLES[ri][1], '', '', true).slice(0, 1));
    box.append(...sect('Mastery', k.gift, prose.gift));
    box.append(...sect('Shadow', k.shadow, prose.shadow, true));
    box.append(...sect('Invitation', k.siddhi, prose.invitation, true));
  });
  if (!wrote) box.append(...sect('Note', '', 'Specification for this plate is still being drafted.', true));
  const hx = document.getElementById('s-hex');
  hx.textContent = '';
  const hl = window.DHexagrams ? DHexagrams.lines(n) : null;
  if (hl) hl.forEach(v => { const b = document.createElement('i'); if (!v) b.className = 'yin'; hx.appendChild(b); });

  spec.scrollTop = 0;
  document.title = 'Plate ' + n + ' · ' + k.name + ' — Apparatus';
}

/* ── explode / assemble ───────────────────────────────────────────────── */
const hintEl = document.getElementById('hint');
function setTargets(e, x) {
  exT = e; sxT = x;
  if (REDUCED.matches) { ex = e; sx = x; render(); return; }
  if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
}
// stage 1 — the screw opens; every plate on the sheet, yours marked
function openAssembly() {
  if (!primes) return;
  selIdx = -1;
  document.body.classList.remove('open');
  document.getElementById('tb-sheet').textContent = '1 of 1 · Fig. 1A';
  hintEl.textContent = 'Marked plates are yours — select one';
  setTargets(1, 0);
}
// stage 2 — a plate is drawn out and its specification issued
function select(n) {
  if (!primes) return;
  selIdx = INDEX_OF[n];
  fillSpec(n);
  document.body.classList.add('open');
  setTargets(1, 1);
  try { history.replaceState(null, '', location.pathname + '?dob=' + dob.value + '&key=' + n); } catch (_) {}
}
// back to stage 1, keeping the assembly open so another plate can be chosen
function deselect() {
  document.body.classList.remove('open');
  document.title = 'Gene Keys — Apparatus, Exploded View';
  document.getElementById('tb-sheet').textContent = '1 of 1 · Fig. 1A';
  hintEl.textContent = 'Marked plates are yours — select one';
  setTargets(1, 0);
  try { history.replaceState(null, '', location.pathname + '?dob=' + dob.value); } catch (_) {}
}
// stage 0 — everything back down to a solid screw
function assemble() {
  document.body.classList.remove('open');
  selIdx = -1;
  document.title = 'Gene Keys — Apparatus, Exploded View';
  document.getElementById('tb-sheet').textContent = '1 of 1 · Fig. 1';
  hintEl.textContent = 'Select the assembly to open it';
  setTargets(0, 0);
  try { history.replaceState(null, '', location.pathname + '?dob=' + dob.value); } catch (_) {}
}
function tick(now) {
  const dt = Math.min(64, now - lastT); lastT = now;
  const k = 1 - Math.pow(0.0015, dt / SMOOTH_MS);   // frame-rate independent
  ex += (exT - ex) * k;
  sx += (sxT - sx) * k;
  if (Math.abs(exT - ex) < 0.001 && Math.abs(sxT - sx) < 0.001) {
    ex = exT; sx = sxT; raf = 0;
    if (sx === 0 && !document.body.classList.contains('open')) selIdx = ex === 0 ? -1 : selIdx;
    render(); return;
  }
  render();
  raf = requestAnimationFrame(tick);
}
document.getElementById('s-close').addEventListener('click', deselect);
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (sxT > 0.5) deselect(); else assemble();
});
svg.addEventListener('click', () => { if (sxT > 0.5) deselect(); else assemble(); });

/* ── a11y list ────────────────────────────────────────────────────────── */
const partsEl = document.getElementById('parts');
let activeI = 0;
function buildParts() {
  partsEl.textContent = '';
  for (let i = 0; i < N; i++) {
    const key = DGeneKeys.WHEEL[i], k = DGeneKeys.KEYS[key];
    const o = document.createElement('div');
    o.id = 'plate-' + key; o.setAttribute('role', 'option');
    o.textContent = 'Plate ' + key + ', ' + k.shadow + ' to ' + k.gift + ' to ' + k.siddhi;
    partsEl.appendChild(o);
  }
}
partsEl.addEventListener('keydown', e => {
  const step = { ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 }[e.key];
  if (step) { activeI = Math.max(0, Math.min(N - 1, activeI + step)); e.preventDefault(); }
  else if (e.key === 'Home') { activeI = 0; e.preventDefault(); }
  else if (e.key === 'End') { activeI = N - 1; e.preventDefault(); }
  else if (e.key === 'Enter' || e.key === ' ') { select(DGeneKeys.WHEEL[activeI]); e.preventDefault(); return; }
  else return;
  partsEl.setAttribute('aria-activedescendant', 'plate-' + DGeneKeys.WHEEL[activeI]);
});

/* ── subject data ─────────────────────────────────────────────────────────
   A birth time is required. The Sun crosses a line in about 23 hours, so a
   date alone cannot place one — and the design-side planets need a real
   instant, not a date. Rather than guess a line and be wrong about half the
   time, the assembly stays unfitted until date, time and zone are all given.

   Legacy ?dob= links prefill the date and then ask for the rest. The keys
   such a link used to produce are unchanged once a time is supplied at the
   same nominal noon, and DGKProfile asserts that agreement at load. */
const dob = document.getElementById('dob');
const tob = document.getElementById('tob');
const tzEl = document.getElementById('tz');
const unfitted = document.getElementById('unfitted');
dob.max = new Date().toISOString().slice(0, 10);

(function fillZones() {
  const dl = document.getElementById('tzlist');
  if (!dl || !window.DAstroTime) return;
  DAstroTime.zoneList().forEach(z => {
    const o = document.createElement('option');
    o.value = z;
    dl.appendChild(o);
  });
})();

// Intl is the authority, not the datalist. supportedValuesOf omits names it
// still accepts — 'UTC' is absent from the list yet perfectly valid, and so
// are aliases like Asia/Calcutta and Europe/Kiev that people genuinely have.
// Requiring list membership rejected the browser's own resolved zone.
function validZone(z) {
  if (!z) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; }
  catch (e) { return false; }
}

// A real calendar date, not merely a well-shaped string: Date.UTC silently
// rolls 2001-02-31 forward into March, which the old check let through.
function currentDate() {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.value || '');
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
  return { y, mo, d };
}

function currentTime() {
  const m = /^(\d{2}):(\d{2})/.exec(tob.value || '');
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  return (h < 24 && mi < 60) ? { h, mi } : null;
}

let profileData = null;

function apply() {
  const d = currentDate(), t = currentTime(), z = (tzEl.value || '').trim();
  const zoneOK = validZone(z);
  tzEl.classList.toggle('bad', !!z && !zoneOK);

  if (!d || !t || !zoneOK || !window.DGKProfile || !DGKProfile.VALID) {
    profileData = null; primes = null; roleOf = {};
    document.body.classList.add('unfitted');
    document.body.classList.remove('open');
    unfitted.textContent = '';
    const b = document.createElement('b');
    b.textContent = 'Assembly not fitted';
    unfitted.appendChild(b);
    const missing = [];
    if (!d) missing.push('date of birth');
    if (!t) missing.push('time of birth');
    if (!zoneOK) missing.push(z ? 'a recognised zone' : 'time zone');
    const list = missing.length > 1
      ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1]
      : missing[0];
    unfitted.appendChild(document.createTextNode(
      missing.length ? 'Enter ' + list + ' in the title block.'
                     : 'Calculation unavailable.'));
    setTargets(0, 0); selIdx = -1;
    refreshToday();
    render();
    writeURL(d, t, zoneOK ? z : null);
    return;
  }

  const inst = DAstroTime.localToInstant({ y: d.y, mo: d.mo, d: d.d, h: t.h, mi: t.mi, tz: z });
  profileData = DGKProfile.profile({ ms: inst.ms });
  profileData.instant = inst;

  document.body.classList.remove('unfitted');
  primes = profileData.spheres;
  roleOf = {};
  ROLES.forEach((r, ri) => {
    const sp = primes[r[0]];
    if (!sp) return;                       // sphere not computed: not fitted
    const i = INDEX_OF[sp.key];
    (roleOf[i] = roleOf[i] || []).push(ri);
  });
  refreshToday();
  setTargets(0, 0); selIdx = -1;
  document.body.classList.remove('open');
  hintEl.textContent = clockNote(inst) || 'Select the assembly to open it';
  document.getElementById('tb-sheet').textContent = '1 of 1 · Fig. 1';
  writeURL(d, t, z);
  render();
}

// Say when a birth time is not the simple thing it looks like, rather than
// resolving it silently — both of these are real clock readings people have.
function clockNote(inst) {
  if (inst.status === 'ambiguous') {
    return 'Clocks went back that night — this reading happened twice. Taken as the first.';
  }
  if (inst.status === 'nonexistent') {
    return 'Clocks went forward that night — this reading did not occur. Taken as the moment after.';
  }
  return '';
}

function writeURL(d, t, z) {
  if (!d) return;
  const p = new URLSearchParams();
  const iso = dob.value;
  if (t && z) {
    p.set('b', iso + 'T' + String(t.h).padStart(2, '0') + ':' + String(t.mi).padStart(2, '0'));
    p.set('tz', z);
  } else {
    p.set('dob', iso);
  }
  history.replaceState(null, '', location.pathname + '?' + p.toString());
}

dob.addEventListener('change', apply);
tob.addEventListener('change', apply);
tzEl.addEventListener('change', apply);
tzEl.addEventListener('input', apply);

buildStack();
buildParts();

(function boot() {
  const params = new URLSearchParams(location.search);
  const b = params.get('b') || '';
  const bm = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(b);
  const legacy = params.get('dob') || '';

  if (bm) {
    dob.value = bm[1];
    tob.value = bm[2] + ':' + bm[3];
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(legacy)) {
    dob.value = legacy;                      // date carries over; time is asked for
  }
  const urlTz = params.get('tz');
  if (validZone(urlTz)) tzEl.value = urlTz;
  else if (window.DAstroTime) {
    try { tzEl.value = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* leave blank */ }
  }
  apply();
})();
layout();

let rt = 0;
const onResize = () => { clearTimeout(rt); rt = setTimeout(layout, 120); };
window.addEventListener('resize', onResize);
if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);

const urlKey = Number(new URLSearchParams(location.search).get('key'));
if (urlKey >= 1 && urlKey <= 64) {
  if (window.DGeneKeysContent) select(urlKey);
  else window.addEventListener('DOMContentLoaded', () => select(urlKey), { once: true });
}
