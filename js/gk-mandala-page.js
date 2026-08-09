/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — MANDALA PAGE CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 *  Replaces the exploded-plate drawing (gene-keys-page.js) with a
 *  bioluminescent mandala: thirteen spheres on a rim around a flower-of-life
 *  core, glowing in one of three cold, real bioluminescent colours by
 *  sequence, brightness set by line number. Selecting a sphere opens a
 *  reading panel built from the same data every other page in this app uses
 *  — nothing about the astronomy, the profile engine, or the reading content
 *  changes. This file only changes what it is drawn as.
 *
 *  Reuses, unchanged in behaviour: PLACES / validZone / currentDate /
 *  currentTime / clockNote / writeURL / BOOT_PARAMS / refreshToday-equivalent
 *  and the DGKProfile / DGKRoles / DGKLines / DGeneKeysContent data layer.
 * ═══════════════════════════════════════════════════════════════════════════
 */
'use strict';

/* The twelve rim positions, in Golden Path reading order. Core and Vocation
   are the SAME longitude (design/mars for both) and share one rim position;
   Life's Work and Brand are ALSO the same longitude (personality/sun for
   both) but are deliberately kept as separate positions — the river bends
   back near its own source without touching it, rather than folding. */
const NODES = [
  { ids: ['lifesWork'],           label: "Life's Work" },
  { ids: ['evolution'],           label: 'Evolution' },
  { ids: ['radiance'],            label: 'Radiance' },
  { ids: ['purpose'],             label: 'Purpose' },
  { ids: ['attraction'],          label: 'Attraction' },
  { ids: ['iq'],                  label: 'IQ' },
  { ids: ['eq'],                  label: 'EQ' },
  { ids: ['sq'],                  label: 'SQ' },
  { ids: ['core', 'vocation'],    label: 'Core · Vocation' },
  { ids: ['culture'],             label: 'Culture' },
  { ids: ['brand'],               label: 'Brand' },
  { ids: ['pearl'],               label: 'Pearl' },
];
const ROLE_BLURB = {
  lifesWork:  "how your genius wants to express itself in the world",
  evolution:  "what your life keeps asking you to work through",
  radiance:   "what keeps you physically and emotionally lit",
  purpose:    "the deep reason running underneath it all",
  attraction: "the field that draws certain people to you",
  iq:         "how your mind actually solves things",
  eq:         "how you meet feeling, your own and other people’s",
  sq:         "what you understand that was never taught to you",
  core:       "the wound the rest of the pattern is built around",
  vocation:   "the work your life keeps pointing back toward",
  culture:    "the people and setting you do your best work inside",
  brand:      "what others recognise you by before you speak",
  pearl:      "where ease and prosperity actually come from",
};
const N = NODES.length;

/* Three colours real bioluminescent creatures actually produce. */
const SEQ_COL = {
  Activation: { hex: '#5AC8FF', rgb: '90,200,255' },
  Venus:      { hex: '#8B7CFF', rgb: '139,124,255' },
  Pearl:      { hex: '#4FE3C1', rgb: '79,227,193' },
};
const NEUTRAL = '#CFEFFF';
function seqCol(seq) { return (SEQ_COL[seq] || { hex: NEUTRAL }).hex; }
function seqRgb(seq, a) { return SEQ_COL[seq] ? 'rgba(' + SEQ_COL[seq].rgb + ',' + a + ')' : 'rgba(207,239,255,' + a + ')'; }

const stageEl = document.getElementById('stage');
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
stageEl.appendChild(svg);
function el(tag, attrs) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

let R = 0, CX = 200, CY = 200, SZ = 0;
const PANEL_W = 420;

function geometry() {
  R = Math.min(innerWidth, innerHeight) * 0.40;
  SZ = R * 2.15;
  svg.setAttribute('viewBox', '0 0 400 400');
  svg.setAttribute('width', SZ);
  svg.setAttribute('height', SZ);
}
geometry();

const defs = el('defs', {});
function makeGlow(id, dev) {
  const f = el('filter', { id, x: '-140%', y: '-140%', width: '380%', height: '380%' });
  f.appendChild(el('feGaussianBlur', { stdDeviation: dev, result: 'b' }));
  const m = el('feMerge', {});
  m.appendChild(el('feMergeNode', { in: 'b' }));
  m.appendChild(el('feMergeNode', { in: 'b' }));
  m.appendChild(el('feMergeNode', { in: 'SourceGraphic' }));
  f.appendChild(m);
  defs.appendChild(f);
}
makeGlow('glowWide', 9); makeGlow('glowSoft', 4.5); makeGlow('glowTight', 2);
svg.appendChild(defs);

function ring(r, dash, op, w, rotSec) {
  const c = el('circle', { cx: CX, cy: CY, r, fill: 'none', stroke: NEUTRAL, 'stroke-width': w || 1, opacity: op, filter: 'url(#glowSoft)' });
  if (dash) c.setAttribute('stroke-dasharray', dash);
  const g = el('g', {}); g.appendChild(c); svg.appendChild(g);
  if (rotSec) {
    g.appendChild(el('animateTransform', { attributeName: 'transform', type: 'rotate',
      from: '0 ' + CX + ' ' + CY, to: (rotSec > 0 ? 360 : -360) + ' ' + CX + ' ' + CY,
      dur: Math.abs(rotSec) + 's', repeatCount: 'indefinite' }));
  }
  return g;
}

/* Everything except the core itself starts collapsed onto the core point.
   Clicking the core zooms it out into the full mandala — the "spread" is
   simply a CSS scale transition about the core's own coordinate, so every
   rim node, the flower, and the hexagon all appear to fly outward from the
   one point you clicked. Cheap: one transform, no per-node animation. */
const expandG = el('g', {});
expandG.style.transformOrigin = CX + 'px ' + CY + 'px';
expandG.style.transform = 'scale(0.001)';
expandG.style.transition = 'transform 1.15s cubic-bezier(.16,.86,.2,1)';
svg.appendChild(expandG);

const outerG = el('g', {});
expandG.appendChild(outerG);
outerG.appendChild(el('circle', { cx: CX, cy: CY, r: R * 0.42, fill: 'none', stroke: NEUTRAL,
  'stroke-width': 1, 'stroke-dasharray': '2 7', opacity: 0.22 }));

const marks = [];
NODES.forEach((node, i) => {
  const a = -Math.PI / 2 + i / N * Math.PI * 2;
  const rr = R * 0.42;
  const px = CX + Math.cos(a) * rr, py = CY + Math.sin(a) * rr;
  const halo = el('circle', { cx: px, cy: py, r: 12, fill: NEUTRAL, opacity: 0.14, filter: 'url(#glowWide)' });
  outerG.appendChild(halo);
  const dot = el('circle', { cx: px, cy: py, r: 3, fill: NEUTRAL, opacity: 0.5, filter: 'url(#glowTight)' });
  outerG.appendChild(dot);
  const ring2 = el('circle', { cx: px, cy: py, r: 14, fill: 'none', stroke: NEUTRAL, 'stroke-width': 1.2, opacity: 0, filter: 'url(#glowSoft)' });
  outerG.appendChild(ring2);
  const hit = el('circle', { cx: px, cy: py, r: 17, fill: 'transparent', id: 'node-' + i });
  hit.style.cursor = 'pointer';
  outerG.appendChild(hit);
  marks.push({ a, px, py, node, i, halo, dot, ring2, hit, col: NEUTRAL, baseRad: 3 });
});

const petalG = el('g', { opacity: 0.9 });
expandG.appendChild(petalG);
petalG.appendChild(el('animateTransform', { attributeName: 'transform', type: 'rotate',
  from: '0 ' + CX + ' ' + CY, to: '-360 ' + CX + ' ' + CY, dur: '110s', repeatCount: 'indefinite' }));
const petalSeq = ['Activation', 'Activation', 'Venus', 'Venus', 'Pearl', 'Pearl'];
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3 - Math.PI / 2;
  const px = CX + Math.cos(a) * R * 0.155, py = CY + Math.sin(a) * R * 0.155;
  petalG.appendChild(el('circle', { cx: px, cy: py, r: R * 0.155, fill: 'none',
    stroke: seqCol(petalSeq[i]), 'stroke-width': 1, opacity: 0.28, filter: 'url(#glowSoft)' }));
}

function hexPoints(r, rot) {
  let s = ''; for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; s += (CX + Math.cos(a) * r) + ',' + (CY + Math.sin(a) * r) + ' '; }
  return s.trim();
}
const hex1G = el('g', {});
hex1G.appendChild(el('polygon', { points: hexPoints(R * 0.66, 0), fill: 'none', stroke: NEUTRAL, 'stroke-width': 1, opacity: 0.30, filter: 'url(#glowSoft)' }));
expandG.appendChild(hex1G);
hex1G.appendChild(el('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 ' + CX + ' ' + CY, to: '360 ' + CX + ' ' + CY, dur: '50s', repeatCount: 'indefinite' }));
const hex2G = el('g', {});
hex2G.appendChild(el('polygon', { points: hexPoints(R * 0.66, Math.PI / 6), fill: 'none', stroke: NEUTRAL, 'stroke-width': 0.6, opacity: 0.18, filter: 'url(#glowSoft)' }));
expandG.appendChild(hex2G);
hex2G.appendChild(el('animateTransform', { attributeName: 'transform', type: 'rotate', from: '360 ' + CX + ' ' + CY, to: '0 ' + CX + ' ' + CY, dur: '70s', repeatCount: 'indefinite' }));

const dashRingG = ring(R * 0.98, '3 10', 0.22, 1, 90);
expandG.appendChild(dashRingG);
const coreR = R * 0.135;

let beamNode = null, chargeNode = null;
function clearBeam() { if (beamNode) { beamNode.remove(); beamNode = null; } if (chargeNode) { chargeNode.remove(); chargeNode = null; } }
function makeBeam(mark) {
  clearBeam();
  const col = mark.col;
  beamNode = el('line', { x1: mark.px, y1: mark.py, x2: CX, y2: CY, stroke: col, 'stroke-width': 1, opacity: 0.35, filter: 'url(#glowSoft)' });
  expandG.insertBefore(beamNode, outerG);
  chargeNode = el('circle', { r: 3.2, fill: col, filter: 'url(#glowTight)' });
  chargeNode.appendChild(el('animateMotion', { path: 'M' + mark.px + ',' + mark.py + ' L' + CX + ',' + CY, dur: '0.9s', repeatCount: 'indefinite', keyPoints: '0;1', keyTimes: '0;1' }));
  chargeNode.appendChild(el('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;0.15;0.8;1', dur: '0.9s', repeatCount: 'indefinite' }));
  expandG.insertBefore(chargeNode, outerG);
}

const coreHalo = el('circle', { cx: CX, cy: CY, r: coreR * 1.9, fill: NEUTRAL, opacity: 0.10, filter: 'url(#glowWide)' });
svg.appendChild(coreHalo);
const coreRing = el('circle', { cx: CX, cy: CY, r: coreR, fill: 'none', stroke: NEUTRAL, 'stroke-width': 2, opacity: 0.92, filter: 'url(#glowSoft)' });
svg.appendChild(coreRing);
const coreDot = el('circle', { cx: CX, cy: CY, r: coreR * 0.4, fill: NEUTRAL, opacity: 0.95, filter: 'url(#glowTight)' });
svg.appendChild(coreDot);
const coreHit = el('circle', { cx: CX, cy: CY, r: coreR * 2.4, fill: 'transparent', id: 'coreHit' });
coreHit.style.cursor = 'pointer';
svg.appendChild(coreHit);
const coreLbl = document.createElement('div');
coreLbl.id = 'coreLbl';
coreLbl.textContent = '';
stageEl.appendChild(coreLbl);
function placeCore() {
  const rect = svg.getBoundingClientRect();
  coreLbl.style.left = (rect.left + rect.width / 2 - 60) + 'px';
  coreLbl.style.top = (rect.top + rect.height / 2 - 6) + 'px';
  coreLbl.style.width = '120px';
}

marks.forEach(m => {
  const d = document.createElement('div');
  d.className = 'lbl';
  const right = Math.cos(m.a) >= 0;
  d.style.textAlign = right ? 'left' : 'right';
  d.innerHTML = m.node.label + '<span class="sub"></span>';
  stageEl.appendChild(d);
  m.labelEl = d; m.right = right; m.subEl = d.querySelector('.sub');
  m.place = () => {
    const rect = svg.getBoundingClientRect();
    const scale = rect.width / 400;
    const sx = rect.left + m.px * scale, sy = rect.top + m.py * scale;
    const off = 26;
    d.style.left = (right ? sx + off : sx - off - 150) + 'px';
    d.style.top = (sy - 6) + 'px';
    if (!right) d.style.width = '150px';
  };
});

function placeAll() { placeCore(); marks.forEach(m => m.place()); }
requestAnimationFrame(placeAll);
let rt2 = 0;
window.addEventListener('resize', () => { clearTimeout(rt2); rt2 = setTimeout(() => { geometry(); placeAll(); }, 120); });

/* ── mobile rim legend ─────────────────────────────────────────────────
   Twelve radial labels around a 390px-wide rim collide into unreadable
   noise — that was the mobile gap in the first pass. Below that width the
   labels stay hidden (CSS) and this scrollable strip of chips takes over:
   the same twelve spheres, same colour/brightness rule, same tap target,
   just laid out as a row instead of a ring so nothing overlaps. */
const legendEl = document.getElementById('legend');
marks.forEach(m => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'chip';
  chip.innerHTML = '<b></b><i></i>';
  chip.addEventListener('click', () => selectSphere(m.i));
  legendEl.appendChild(chip);
  m.chipEl = chip;
  m.chipB = chip.querySelector('b');
  m.chipI = chip.querySelector('i');
});

/* ═══════════════════════════════════════════════════════════════════════
   State: profile data, node visuals, and the reading panel.
   ═══════════════════════════════════════════════════════════════════════ */
const panel = document.getElementById('panel');
const content = document.getElementById('pcontent');
let currentSel = -1;
let panelOpen = false;
let primes = null;   // profileData.spheres, keyed by sphere id

function nodeSeq(mark) {
  // the doubled node has two sequences (Core=Venus, Vocation=Pearl) — use
  // the first id's sequence for the node's own colour; the panel still shows
  // each role's true colour in its own section header
  const sp = primes && primes[mark.node.ids[0]];
  return sp ? sp.seq : null;
}
function nodeLine(mark) {
  const sp = primes && primes[mark.node.ids[0]];
  return sp ? sp.line : null;
}
function nodeReady(mark) {
  return !!(primes && mark.node.ids.every(id => primes[id]));
}

function paintMarks() {
  marks.forEach(m => {
    const ready = nodeReady(m);
    const seq = ready ? nodeSeq(m) : null;
    const line = ready ? nodeLine(m) : null;
    const col = seq ? seqCol(seq) : NEUTRAL;
    m.col = col;
    const on = m.i === currentSel;
    const dimmed = panelOpen && !on;
    const baseRad = ready ? 2.4 + 1.8 * ((line || 3) / 6) : 1.6;
    m.baseRad = baseRad;
    const base = ready ? 0.30 + 0.60 * ((line || 3) / 6) : 0.14;
    m.dot.setAttribute('fill', col);
    m.dot.setAttribute('opacity', on ? 1 : (base * (dimmed ? 0.28 : 1)));
    m.dot.setAttribute('r', on ? 5.2 : baseRad);
    m.halo.setAttribute('fill', col);
    m.halo.setAttribute('opacity', on ? 0.34 : (0.14 * (dimmed ? 0.35 : 1)) * (ready ? 1 : 0.5));
    m.halo.setAttribute('r', on ? baseRad * 7 : baseRad * 5);
    m.ring2.setAttribute('stroke', col);
    m.ring2.setAttribute('opacity', on ? 0.6 : 0);
    m.labelEl.style.color = col;
    m.labelEl.style.textShadow = seq ? ('0 0 10px ' + seqRgb(seq, 0.55)) : 'none';
    m.labelEl.style.opacity = revealed ? (on ? 1 : (dimmed ? 0.28 : (ready ? 1 : 0.4))) : 0;
    m.subEl.textContent = ready ? (seq + ' · line ' + line) : 'not yet fitted';
    m.hit.style.cursor = ready ? 'pointer' : 'default';

    // mobile legend chip mirrors the same state, colour and brightness
    m.chipEl.style.setProperty('--chip-col', col);
    m.chipEl.style.opacity = on ? 1 : (dimmed ? 0.35 : (ready ? (0.55 + 0.45 * ((line || 3) / 6)) : 0.32));
    m.chipEl.classList.toggle('on', on);
    m.chipEl.disabled = !ready;
    m.chipB.textContent = m.node.label;
    m.chipI.textContent = ready ? (seq + ' · L' + line) : 'not fitted';
  });
}

/* ── reading content: pulled from the same data every other page uses ──── */
function roleSection(roleId, keyNum, line, seq) {
  const c = window.DGeneKeysContent ? DGeneKeysContent.get(keyNum) : null;
  const k = window.DGeneKeys ? DGeneKeys.KEYS[keyNum] : null;
  const prose = (window.DGKRoles ? DGKRoles.get(roleId, keyNum) : null) || c;
  if (!prose || !k) return '';
  const ln = (line && window.DGKLines) ? DGKLines.get(keyNum, line) : null;
  const col = seqCol(seq);
  let html = '';
  if (ln) {
    html += '<section><div class="card" data-noclick="1">' +
      '<h3 style="color:' + col + '">Line ' + line + ' · ' + esc(ln.keynote) + '</h3>' +
      '<p>' + esc(ln.body) + '</p></div></section>';
  }
  html += '<section><div class="card"><h3 style="color:' + col + '">Mastery · ' + esc(k.gift) + '</h3>' +
    '<p>' + esc(prose.gift) + '</p></div></section>';
  html += '<section><div class="card"><h3 style="color:' + col + '">Shadow · ' + esc(k.shadow) + '</h3>' +
    '<p>' + esc(prose.shadow) + '</p></div></section>';
  html += '<section><div class="card"><h3 style="color:' + col + '">Invitation · ' + esc(k.siddhi) + '</h3>' +
    '<p>' + esc(prose.invitation) + '</p></div></section>';
  return html;
}
function esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

function openPanelFor(i) {
  const mark = marks[i], node = mark.node;
  const primary = node.ids[0];
  const sp0 = primes[primary];
  const col = seqCol(sp0.seq);

  panel.querySelector('.edge').style.background = col;
  panel.querySelector('.edge').style.boxShadow =
    '0 0 8px ' + col + ', 0 0 22px ' + col + ', 0 0 46px ' + seqRgb(sp0.seq, 0.85) + ', 0 0 90px ' + seqRgb(sp0.seq, 0.5);
  panel.querySelector('.edgeGlow').style.background =
    'linear-gradient(90deg, ' + seqRgb(sp0.seq, 0.55) + ' 0%, ' + seqRgb(sp0.seq, 0.16) + ' 35%, transparent 100%)';

  const k0 = window.DGeneKeys ? DGeneKeys.KEYS[sp0.key] : null;
  const c0 = window.DGeneKeysContent ? DGeneKeysContent.get(sp0.key) : null;

  let body = '';
  if (c0 && c0.essence) {
    body += '<section><div class="card" data-noclick="1"><h3 style="color:' + col + '">Function</h3>' +
      '<p>' + esc(c0.essence) + '</p></div></section>';
  }
  node.ids.forEach(id => {
    const sp = primes[id];
    if (!sp) return;
    if (node.ids.length > 1) {
      const roleLabel = id === 'core' ? 'Core' : id === 'vocation' ? 'Vocation' : id;
      body += '<div class="asRole">As ' + esc(roleLabel) + '</div>';
    }
    body += roleSection(id, sp.key, sp.line, sp.seq);
  });

  content.innerHTML =
    '<div class="eyebrow" style="color:' + col + '">' + esc(sp0.seq) + ' sequence' + (node.ids.length > 1 ? ' · hinge' : '') + '</div>' +
    '<h2>' + esc(node.label) + '</h2>' +
    '<div class="key">Key ' + sp0.key + (sp0.line ? '.' + sp0.line : '') + (k0 ? ' · ' + esc(k0.name) : '') + '</div>' +
    body;

  content.querySelectorAll('.card').forEach(c => {
    if (c.dataset.noclick) return;
    c.addEventListener('click', e => { e.stopPropagation(); sweep(); });
  });

  coreLbl.style.color = col;
  coreLbl.textContent = node.label.toUpperCase();
  coreHalo.setAttribute('fill', col); coreHalo.setAttribute('opacity', 0.20);
  coreRing.setAttribute('stroke', col); coreDot.setAttribute('fill', col);
  makeBeam(mark);
}

function sweep() {
  panel.classList.remove('sweeping');
  void panel.offsetWidth;
  panel.classList.add('sweeping');
}

function selectSphere(i) {
  if (!nodeReady(marks[i])) return;
  if (currentSel === i) { closePanel(); return; }
  const wasOpen = panelOpen;
  currentSel = i; panelOpen = true;
  paintMarks();
  if (wasOpen) {
    panel.classList.remove('on');
    setTimeout(() => {
      openPanelFor(i);
      requestAnimationFrame(() => { panel.classList.add('on'); sweep(); });
    }, 260);
  } else {
    stageEl.style.transform = innerWidth > 900 ? 'translateX(-' + (PANEL_W / 2) + 'px)' : 'translateX(0)';
    openPanelFor(i);
    requestAnimationFrame(() => { panel.classList.add('on'); sweep(); });
  }
  writeURL(currentSel);
}

function closePanel() {
  panelOpen = false;
  panel.classList.remove('on'); panel.classList.remove('sweeping');
  currentSel = -1;
  paintMarks();
  stageEl.style.transform = 'translateX(0)';
  coreLbl.style.color = NEUTRAL; coreLbl.textContent = '';
  coreHalo.setAttribute('fill', NEUTRAL); coreHalo.setAttribute('opacity', 0.10);
  coreRing.setAttribute('stroke', NEUTRAL); coreDot.setAttribute('fill', NEUTRAL);
  clearBeam();
  setTimeout(() => { content.innerHTML = ''; }, 560);
  writeURL(null);
}

/* ── the reveal: click the core, the whole mandala zooms out of it ─────
   Everything (rim nodes, flower, hexagon) starts collapsed to a point on
   the core via expandG's scale(0.001). One click scales it to 1 — since
   the transform is about the core's own coordinate, every node appears to
   fly outward from exactly where the click landed. After that the mandala
   behaves exactly as before: click a sphere, it opens; click the core (now
   just decoration) does nothing further. */
let revealed = false;
function revealMandala() {
  if (revealed) return;
  revealed = true;
  expandG.style.transform = 'scale(1)';
  legendEl.style.opacity = '1';
  legendEl.style.pointerEvents = 'auto';
  const hintEl = document.getElementById('hint');
  if (hintEl) hintEl.innerHTML = 'Hologenetic Profile <b>·</b> click a sphere to open its reading';
  paintMarks();
}
coreHit.addEventListener('click', e => { e.stopPropagation(); revealMandala(); });

marks.forEach(m => {
  m.hit.addEventListener('click', () => selectSphere(m.i));
  m.labelEl.addEventListener('click', () => selectSphere(m.i));
});
document.getElementById('closeBtn').addEventListener('click', e => { e.stopPropagation(); closePanel(); });
stageEl.addEventListener('click', e => { if (e.target === stageEl || e.target === svg) closePanel(); });

legendEl.style.opacity = '0';
legendEl.style.pointerEvents = 'none';
legendEl.style.transition = 'opacity .6s ease';

/* ═══════════════════════════════════════════════════════════════════════
   Subject data — identical contract to the previous controller: a birth
   time is required (the Sun crosses a line in ~23h, a date alone can't
   place one), Australia/NZ birthplaces only, URL round-trips via ?b=&tz=.
   ═══════════════════════════════════════════════════════════════════════ */
const dob = document.getElementById('dob');
const tob = document.getElementById('tob');
const tzEl = document.getElementById('tz');
const unfitted = document.getElementById('unfitted');
dob.max = new Date().toISOString().slice(0, 10);

const PLACES = [
  ['New South Wales', [
    ['Australia/Sydney', 'Sydney'],
    ['Australia/Broken_Hill', 'Broken Hill'],
    ['Australia/Lord_Howe', 'Lord Howe Island'],
  ]],
  ['Victoria', [['Australia/Melbourne', 'Melbourne']]],
  ['Queensland', [
    ['Australia/Brisbane', 'Brisbane'],
    ['Australia/Lindeman', 'Lindeman Island'],
  ]],
  ['South Australia', [['Australia/Adelaide', 'Adelaide']]],
  ['Western Australia', [
    ['Australia/Perth', 'Perth'],
    ['Australia/Eucla', 'Eucla'],
  ]],
  ['Tasmania', [
    ['Australia/Hobart', 'Hobart'],
    ['Antarctica/Macquarie', 'Macquarie Island'],
  ]],
  ['Northern Territory', [['Australia/Darwin', 'Darwin']]],
  ['Australian Capital Territory', [['Australia/Sydney', 'Canberra']]],
  ['External territories', [
    ['Indian/Christmas', 'Christmas Island'],
    ['Indian/Cocos', 'Cocos (Keeling) Islands'],
  ]],
  ['New Zealand', [
    ['Pacific/Auckland', 'Auckland · Wellington · Christchurch'],
    ['Pacific/Chatham', 'Chatham Islands'],
  ]],
];
const PLACE_ZONES = [];
(function fillZones() {
  const sel = tzEl;
  const blank = document.createElement('option');
  blank.value = ''; blank.textContent = '— select —';
  sel.appendChild(blank);
  PLACES.forEach(([group, rows]) => {
    const g = document.createElement('optgroup');
    g.label = group;
    rows.forEach(([zone, label]) => {
      const o = document.createElement('option');
      o.value = zone; o.textContent = label;
      g.appendChild(o);
      if (PLACE_ZONES.indexOf(zone) === -1) PLACE_ZONES.push(zone);
    });
    sel.appendChild(g);
  });
})();
function validZone(z) {
  if (!z || PLACE_ZONES.indexOf(z) === -1) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; }
  catch (e) { return false; }
}
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
function clockNote(inst) {
  if (inst.status === 'ambiguous') return 'Clocks went back that night — this reading happened twice. Taken as the first.';
  if (inst.status === 'nonexistent') return 'Clocks went forward that night — this reading did not occur. Taken as the moment after.';
  return '';
}

let profileData = null;
let selectedKeyForURL = null;

function apply() {
  const d = currentDate(), t = currentTime(), z = (tzEl.value || '').trim();
  const zoneOK = validZone(z);

  closePanel();

  if (!d || !t || !zoneOK || !window.DGKProfile || !DGKProfile.VALID) {
    profileData = null; primes = null;
    document.body.classList.add('unfitted');
    unfitted.textContent = '';
    const b = document.createElement('b');
    b.textContent = 'Not yet fitted';
    unfitted.appendChild(b);
    const missing = [];
    if (!d) missing.push('date of birth');
    if (!t) missing.push('time of birth');
    if (!zoneOK) missing.push('birthplace');
    const list = missing.length > 1
      ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1]
      : missing[0];
    unfitted.appendChild(document.createTextNode(missing.length ? 'Enter ' + list + ' below.' : 'Calculation unavailable.'));
    paintMarks();
    writeURL(null);
    return;
  }

  const inst = DAstroTime.localToInstant({ y: d.y, mo: d.mo, d: d.d, h: t.h, mi: t.mi, tz: z });
  profileData = DGKProfile.profile({ ms: inst.ms });
  profileData.instant = inst;
  document.body.classList.remove('unfitted');
  primes = profileData.spheres;

  const noteEl = document.getElementById('clockNote');
  if (noteEl) noteEl.textContent = clockNote(inst);

  paintMarks();
  refreshTransit();
  writeURL(null);
}

/* ── yearly transit ────────────────────────────────────────────────────
   The Sun keeps moving after birth — one key is always transiting, and it
   cycles through all 64 over a year. Costs no new astronomy: solarLongitude
   already takes any date. Refreshed once per load, which is often enough
   for a page that isn't kept open across midnight. */
function myKeys() {
  if (!primes) return [];
  const out = [];
  NODES.forEach(n => n.ids.forEach(id => { if (primes[id]) out.push({ id, key: primes[id].key }); }));
  return out;
}
function refreshTransit() {
  const el = document.getElementById('transit');
  if (!el || !window.DGeneKeys) return;
  const iso = new Date().toISOString().slice(0, 10);
  const todayKey = DGeneKeys.keyAt(DGeneKeys.solarLongitude(iso));
  const k = DGeneKeys.KEYS[todayKey];
  el.textContent = 'Transiting today · Key ' + todayKey + (k ? ' · ' + k.name : '');
  const mine = myKeys().filter(m => m.key === todayKey);
  if (mine.length) {
    const roleLabels = mine.map(m => (m.id === 'core' ? 'Core' : m.id === 'vocation' ? 'Vocation' : (ROLE_BLURB[m.id] ? NODES.find(n => n.ids.indexOf(m.id) !== -1).label : m.id)));
    const span = document.createElement('span');
    span.className = 'own';
    span.textContent = ' · your ' + [...new Set(roleLabels)].join(' & ');
    el.appendChild(span);
  }
}
refreshTransit();

function writeURL(sel) {
  if (sel !== undefined) selectedKeyForURL = sel;
  const d = currentDate(), t = currentTime(), z = (tzEl.value || '').trim();
  if (!d) return;
  const p = new URLSearchParams();
  if (t && validZone(z)) {
    p.set('b', dob.value + 'T' + String(t.h).padStart(2, '0') + ':' + String(t.mi).padStart(2, '0'));
    p.set('tz', z);
  } else {
    p.set('dob', dob.value);
  }
  if (selectedKeyForURL !== null && selectedKeyForURL >= 0) p.set('sel', selectedKeyForURL);
  try { history.replaceState(null, '', location.pathname + '?' + p.toString()); } catch (e) { /* ignore */ }
}

dob.addEventListener('change', apply);
tob.addEventListener('change', apply);
tzEl.addEventListener('change', apply);

const BOOT_PARAMS = new URLSearchParams(location.search);
(function boot() {
  const params = BOOT_PARAMS;
  const b = params.get('b') || '';
  const bm = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(b);
  const legacy = params.get('dob') || '';
  if (bm) { dob.value = bm[1]; tob.value = bm[2] + ':' + bm[3]; }
  else if (/^\d{4}-\d{2}-\d{2}$/.test(legacy)) { dob.value = legacy; }
  const urlTz = params.get('tz');
  if (validZone(urlTz)) tzEl.value = urlTz;
  else {
    let here = '';
    try { here = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* none */ }
    tzEl.value = validZone(here) ? here : '';
  }
  apply();
  const urlSel = Number(params.get('sel'));
  if (primes && urlSel >= 0 && urlSel < N) { revealMandala(); selectSphere(urlSel); }
})();
