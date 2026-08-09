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

/* Below 900px the rim labels are gone (the legend strip replaces them), so
   nothing needs clearance outside the mandala any more — it can fill far
   more of a phone screen than the desktop 0.40-of-min-dimension rule gives
   it. The decorative outer hex/dashed ring is allowed to bleed off the
   edges; the nodes themselves stay well inside frame either way. */
/* On-screen size scales with R^2, not R — the viewBox is fixed at 400 local
   units while SZ (the actual pixel size) is R*2.15, so both the local
   radius AND the local-to-pixel ratio grow with R. 0.60 of viewport width
   put the hexagon well past the screen edge; 0.47 keeps it inside with a
   little air, still a real gain over the original 0.40-of-min-dimension. */
function isMobile() { return innerWidth <= 899; }
function geometry() {
  R = isMobile() ? innerWidth * 0.47 : Math.min(innerWidth, innerHeight) * 0.40;
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

/* Continuous animateTransform rotation on a FILTERED element (every one of
   these carries a feGaussianBlur) forces the browser to re-rasterise the
   whole blurred layer every frame — cheap on a desktop GPU, a real cost on
   a phone, and that cost was the mobile lag. A rotating g gets that
   treatment; a g that only changes opacity does not, because the browser
   can reuse the same rasterised filter output and just cross-fade it.
   Mobile therefore gets a slow opacity breathe instead of a spin; desktop
   keeps the spin, since it was never the laggy one. */
function spinOrBreathe(g, rotSec, breatheSec, breatheDelay) {
  if (isMobile()) {
    g.style.animation = 'breathe ' + breatheSec + 's ease-in-out ' + (breatheDelay || 0) + 's infinite';
  } else {
    g.appendChild(el('animateTransform', { attributeName: 'transform', type: 'rotate',
      from: '0 ' + CX + ' ' + CY, to: (rotSec > 0 ? 360 : -360) + ' ' + CX + ' ' + CY,
      dur: Math.abs(rotSec) + 's', repeatCount: 'indefinite' }));
  }
}

function ring(r, dash, op, w, rotSec) {
  const c = el('circle', { cx: CX, cy: CY, r, fill: 'none', stroke: NEUTRAL, 'stroke-width': w || 1, opacity: op, filter: 'url(#glowSoft)' });
  if (dash) c.setAttribute('stroke-dasharray', dash);
  const g = el('g', {}); g.appendChild(c); svg.appendChild(g);
  if (rotSec) spinOrBreathe(g, rotSec, 9, 0.4);
  return g;
}

/* Everything except the core itself starts small and dim — "at a distance"
   — rather than collapsed to nothing. Clicking the core zooms it in: a CSS
   scale transition about the core's own coordinate, so the whole mandala
   visibly grows toward you instead of appearing from a point. */
const expandG = el('g', {});
expandG.style.transformOrigin = CX + 'px ' + CY + 'px';
expandG.style.willChange = 'transform, opacity';
expandG.style.transform = 'scale(0.46)';
expandG.style.opacity = '0.55';
/* Mobile gets an actual zoom: the curve overshoots past 1 before settling,
   so the mandala punches past its final size and pulls back — reads as a
   camera push, not just a gentle unfold. Desktop keeps the calmer spread. */
expandG.style.transition = isMobile()
  ? 'transform .85s cubic-bezier(.28,1.65,.4,1), opacity .6s ease'
  : 'transform 1.15s cubic-bezier(.16,.86,.2,1), opacity .8s ease';
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
spinOrBreathe(petalG, -110, 7, 0);
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
spinOrBreathe(hex1G, 50, 8, 0.8);
const hex2G = el('g', {});
hex2G.appendChild(el('polygon', { points: hexPoints(R * 0.66, Math.PI / 6), fill: 'none', stroke: NEUTRAL, 'stroke-width': 0.6, opacity: 0.18, filter: 'url(#glowSoft)' }));
expandG.appendChild(hex2G);
spinOrBreathe(hex2G, -70, 10, 1.6);

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
  chip.addEventListener('click', () => tapNode(m.i));
  legendEl.appendChild(chip);
  m.chipEl = chip;
  m.chipB = chip.querySelector('b');
  m.chipI = chip.querySelector('i');
});

/* ── mobile: tap once for a preview, tap again to open ───────────────────
   Revives the very first ask for this page — "click the screw, get a small
   card of what it is, click THAT to open it." Desktop keeps a single click
   opening the panel directly; only mobile gets the two-step. */
const previewCard = document.getElementById('previewCard');
let previewIdx = -1;

function hidePreview() {
  if (previewIdx < 0) return;
  previewIdx = -1;
  previewCard.classList.remove('on');
}

function showPreview(i) {
  const m = marks[i];
  if (!nodeReady(m)) return;
  previewIdx = i;
  const seq = nodeSeq(m), line = nodeLine(m), col = seqCol(seq);
  previewCard.style.setProperty('--pc-col', col);
  previewCard.style.setProperty('--pc-glow', seqRgb(seq, 0.28));
  previewCard.innerHTML = '<b>' + esc(m.node.label) + '</b><i>' + esc(seq) + ' · line ' + line + '</i><em>tap again to open</em>';
  const rect = svg.getBoundingClientRect();
  const scale = rect.width / 400;
  let x = rect.left + m.px * scale;
  let y = rect.top + m.py * scale;
  const pad = 16;
  x = Math.max(pad + 90, Math.min(innerWidth - pad - 90, x));
  y = Math.max(pad + 50, Math.min(innerHeight - pad - 120, y));
  previewCard.style.left = x + 'px';
  previewCard.style.top = y + 'px';
  previewCard.classList.add('on');
}

function tapNode(i) {
  if (!isMobile()) { selectSphere(i); return; }
  if (previewIdx === i) { hidePreview(); selectSphere(i); return; }
  showPreview(i);
}
previewCard.addEventListener('click', () => { if (previewIdx >= 0) { const i = previewIdx; hidePreview(); selectSphere(i); } });

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
    m.subEl.textContent = ready ? (seq + (line ? ' · line ' + line : '')) : 'not yet fitted';
    m.hit.style.cursor = ready ? 'pointer' : 'default';

    // mobile legend chip mirrors the same state, colour and brightness
    m.chipEl.style.setProperty('--chip-col', col);
    m.chipEl.style.opacity = on ? 1 : (dimmed ? 0.35 : (ready ? (0.55 + 0.45 * ((line || 3) / 6)) : 0.32));
    m.chipEl.classList.toggle('on', on);
    m.chipEl.disabled = !ready;
    m.chipB.textContent = m.node.label;
    m.chipI.textContent = ready ? (seq + (line ? ' · L' + line : '')) : 'not fitted';
  });
}

/* ── reading content: pulled from the same data every other page uses ──── */
/* Card order within a role, top to bottom: the four states, this sphere's
   own definition, Mastery, Shadow, Siddhi, Line, with Function/tagline
   essence last of all (added by the caller after every role has run). */
function roleSection(roleId, keyNum, line, seq, seen, label, sphereDefHtml) {
  const c = window.DGeneKeysContent ? DGeneKeysContent.get(keyNum) : null;
  const k = window.DGeneKeys ? DGeneKeys.KEYS[keyNum] : null;
  const prose = (window.DGKRoles ? DGKRoles.get(roleId, keyNum) : null) || c;
  if (!prose || !k) return '';
  // A hinge sphere (Core/Vocation; Life's Work/Brand elsewhere in the app,
  // though never shown in the same panel) shares one physical key across
  // two role sections. Any card whose header AND body would come out
  // byte-identical to one already shown in this panel — not just the
  // shadow-states grid, anything — reads as a bug to someone who doesn't
  // know two roles can share a key, so it's suppressed the second time.
  function once(sig, html) {
    if (!seen) return html;
    if (seen.has(sig)) return '';
    seen.add(sig);
    return html;
  }
  // Sphere-specific line keynote (what line N means when it IS this sphere,
  // confirmed against real Golden Path material) takes priority; the
  // key-based one (js/gk-lines.js — what line N means for this key,
  // regardless of sphere) is the fallback when no sphere data exists yet.
  const sln = (line && window.DGKSphereLines) ? DGKSphereLines.get(roleId, line) : null;
  const ln = sln || ((line && window.DGKLines) ? DGKLines.get(keyNum, line) : null);
  const col = seqCol(seq);
  const pfx = label ? esc(label) + ' · ' : '';

  const states = (seen && !seen.has('states:' + keyNum) && window.DGKShadowStates) ? DGKShadowStates.get(keyNum) : null;
  if (seen) seen.add('states:' + keyNum);
  const stateLabels = { repressive: 'Repressive', reactive: 'Reactive', dilemma: 'Dilemma', victim: 'Victim State' };
  const statesCard = states ? once('states:' + keyNum + JSON.stringify(states),
    '<section><div class="card" data-noclick="1">' + hd(col, pfx + 'States') +
    '<div class="states">' +
    ['repressive', 'reactive', 'dilemma', 'victim'].map(k2 =>
      '<div class="state"><b>' + stateLabels[k2] + '</b><i>' + esc(states[k2]) + '</i></div>'
    ).join('') + '</div>' +
    '<p class="statesNote">These four belong to Key ' + keyNum + ' itself, not to this line — if another sphere in your profile also carries Key ' + keyNum + ', its states will read the same. What differs between them is everything below.</p>' +
    '</div></section>') : '';

  const masteryCard = once('gift:' + prose.gift,
    '<section><div class="card">' + hd(col, pfx + 'Mastery · ' + esc(k.gift)) +
    '<p>' + esc(prose.gift) + '</p></div></section>');

  const shadowCard = once('shadow:' + prose.shadow,
    '<section><div class="card">' + hd(col, pfx + 'Shadow · ' + esc(k.shadow)) +
    '<p>' + esc(prose.shadow) + '</p></div></section>');

  const siddhiCard = once('invitation:' + prose.invitation,
    '<section><div class="card">' + hd(col, pfx + 'Siddhi · ' + esc(k.siddhi)) +
    '<p>' + esc(prose.invitation) + '</p></div></section>');

  const lineCard = ln ? once('line:' + ln.keynote + '|' + ln.body,
    '<section><div class="card" data-noclick="1">' +
    hd(col, pfx + 'Line ' + line + ' · ' + esc(ln.keynote)) +
    '<p>' + esc(ln.body) + '</p></div></section>') : '';

  return statesCard + (sphereDefHtml || '') + masteryCard + shadowCard + siddhiCard + lineCard;
}
function esc(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
// Small mark before the panel's main title only — three hexagram-style
// lines, the broken middle line nodding to the fact every key is built
// from six of these. Original glyph, not a copy of any third-party icon.
function hglyph(col) {
  return '<svg class="hglyph" width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="' + col + '" stroke-width="1.6" stroke-linecap="round" style="margin-right:9px;vertical-align:-1px;flex:none">' +
    '<line x1="2" y1="3" x2="12" y2="3"/><line x1="2" y1="7" x2="5.5" y2="7"/><line x1="8.5" y1="7" x2="12" y2="7"/><line x1="2" y1="11" x2="12" y2="11"/></svg>';
}
function hd(col, text) { return '<h3 style="color:' + col + '">' + text + '</h3>'; }

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

  const tag = window.DGKSphereLines ? DGKSphereLines.tagline(primary) : null;
  // For the four spheres with a real "My Sphere · tagline" (confirmed
  // against the official app) and a resolved line, the essence card is a
  // genuine per-line reading — not the same generic per-key text shown to
  // everyone who carries that key here, whatever line they're on. Falls
  // back to the universal per-key essence everywhere else.
  const sphEssence = (tag && sp0.line && window.DGKSphereLines) ? DGKSphereLines.essence(primary, sp0.line) : null;
  // Function/tagline essence is the one card that closes the panel, after
  // every role's states/sphere/mastery/shadow/siddhi/line has run.
  let functionCard = '';
  if (sphEssence) {
    functionCard = '<section><div class="card" data-noclick="1">' + hd(col, 'My ' + esc(node.label) + ' · ' + esc(tag)) +
      '<p>' + esc(sphEssence) + '</p></div></section>';
  } else if (c0 && c0.essence) {
    functionCard = '<section><div class="card" data-noclick="1">' + hd(col, esc(node.label) + ' · Function') +
      '<p>' + esc(c0.essence) + '</p></div></section>';
  }
  let body = '';
  const seen = new Set();
  node.ids.forEach(id => {
    const sp = primes[id];
    if (!sp) return;
    if (node.ids.length > 1) {
      const roleLabel = id === 'core' ? 'Core' : id === 'vocation' ? 'Vocation' : id;
      body += '<div class="asRole">As ' + esc(roleLabel) + '</div>';
    }
    // What this sphere IS, independent of key or line — shown once per
    // role. Core and Vocation get their own distinct definitions here
    // despite sharing a key, since the sphere concept itself differs.
    const def = window.DGKSphereDefs ? DGKSphereDefs.get(id) : null;
    const roleLabelFull = def ? def.title : (id === 'core' ? 'Core' : id === 'vocation' ? 'Vocation' : id);
    const sphereDefHtml = def ? '<section><div class="card" data-noclick="1">' + hd(col, 'My Sphere of ' + esc(def.title)) +
      '<p>' + esc(def.body) + '</p></div></section>' : '';
    body += roleSection(id, sp.key, sp.line, sp.seq, seen, roleLabelFull, sphereDefHtml);
  });
  body += functionCard;

  const triad = k0 ? '<div class="triad">' + esc(k0.shadow) + ' <span>&#8250;</span> ' + esc(k0.gift) + ' <span>&#8250;</span> ' + esc(k0.siddhi) + '</div>' : '';
  // The tagline already appears as the essence card's own header once a
  // per-line reading exists for it — repeating it again as a subtitle
  // would be exactly the kind of duplicate this page just got rid of.
  // Only shown standalone when falling back to the generic Function card.
  const taglineHtml = (tag && !sphEssence) ? '<div class="tagline">My ' + esc(node.label) + ' <span>·</span> ' + esc(tag) + '</div>' : '';

  content.innerHTML =
    '<div class="eyebrow" style="color:' + col + '">' + esc(sp0.seq) + ' sequence' + (node.ids.length > 1 ? ' · hinge' : '') + '</div>' +
    '<h2>' + hglyph(col) + esc(node.label) + '</h2>' +
    '<div class="key">Key ' + sp0.key + (sp0.line ? '.' + sp0.line : '') + (k0 ? ' · ' + esc(k0.name) : '') + '</div>' +
    triad +
    taglineHtml +
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
  hidePreview();
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
  hidePreview();
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
/* Every rim halo/dot/ring, the hex polygons and the flower petals carry a
   feGaussianBlur filter — around 45 filtered elements in expandG. Animating
   a CSS transform across a subtree that size forces mobile browsers to
   re-rasterise every one of those blurs on every frame of the transition,
   which is the lag: exactly the same mechanism that made the continuous
   rotation laggy, just triggered once instead of forever. The fix is the
   same idea: remove the filters for the ~1s the transform is actually
   moving, so the browser is just scaling flat shapes (cheap, GPU-composited)
   and pays the blur cost only once, after the size has stopped changing. */
function stripFiltersDuring(ms) {
  const filtered = expandG.querySelectorAll('[filter]');
  const saved = [];
  filtered.forEach(elx => { saved.push([elx, elx.getAttribute('filter')]); elx.removeAttribute('filter'); });
  setTimeout(() => { saved.forEach(([elx, f]) => elx.setAttribute('filter', f)); }, ms);
}

let revealed = false;
function revealMandala() {
  if (revealed) return;
  revealed = true;
  if (isMobile()) stripFiltersDuring(950);
  expandG.style.transform = 'scale(1)';
  expandG.style.opacity = '1';
  legendEl.style.opacity = '1';
  legendEl.style.pointerEvents = 'auto';
  const hintEl = document.getElementById('hint');
  if (hintEl) hintEl.innerHTML = 'Hologenetic Profile <b>·</b> click a sphere to open its reading';
  paintMarks();
}
coreHit.addEventListener('click', e => { e.stopPropagation(); revealMandala(); });

marks.forEach(m => {
  m.hit.addEventListener('click', () => tapNode(m.i));
  m.labelEl.addEventListener('click', () => tapNode(m.i));
});
document.getElementById('closeBtn').addEventListener('click', e => { e.stopPropagation(); closePanel(); });
stageEl.addEventListener('click', e => { if (e.target === stageEl || e.target === svg) { hidePreview(); closePanel(); } });

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
