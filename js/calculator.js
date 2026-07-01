/**
 * Destiny Matrix — Calculation Engine
 * ------------------------------------
 * Rule: work only with numbers 1–22.
 * If a number exceeds 22, sum its digits repeatedly until ≤ 22.
 *
 * Input  : day (1–31), month (1–12), yearFull (e.g. 2002)
 * Output : complete matrix object with every position labelled
 */

'use strict';

// ── Core reduction ───────────────────────────────────────────────────────────
function reduce(n) {
  if (n <= 22) return n;
  const digitSum = String(Math.abs(n))
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
  return reduce(digitSum); // recurse until ≤ 22
}

// ── Main calculator ───────────────────────────────────────────────────────────
function calculateMatrix(day, month, yearFull) {

  // 1. Reduce each input unit
  const A = reduce(day);    // birth day  → "Personal Energy"
  const B = month;          // birth month (max 12, always ≤ 22)
  const C = reduce(          // birth year (sum all 4 digits, then reduce)
    String(yearFull).split('').reduce((a, d) => a + Number(d), 0)
  );

  // ── Personal Diamond (diagonal square) ───────────────────────────────────
  const D = reduce(A + B + C);          // karmic tail / shadow corner
  const G = reduce(A + B + C + D);      // center — Comfort Zone / Soul

  // ── Generic Square (straight square, corners at midpoints of diamond) ────
  const E = reduce(A + B);             // top-left  — Social Mask
  const F = reduce(B + C);             // top-right — Father's Line
  const H = reduce(C + D);             // bottom-right — Mother's Line
  const I = reduce(D + A);             // bottom-left — Ancestral Root

  // ── Diagonal lines inside personal diamond ───────────────────────────────
  const Sky   = reduce(B + D);          // vertical axis — Spiritual Potential
  const Earth = reduce(A + C);          // horizontal axis — Material Potential

  // ── Inner midpoints (spoke centres between corner and G) ─────────────────
  const AG = reduce(A + G);            // left spoke centre
  const BG = reduce(B + G);            // top spoke centre
  const CG = reduce(C + G);            // right spoke centre
  const DG = reduce(D + G);            // bottom spoke centre

  // ── Purposes ─────────────────────────────────────────────────────────────
  const firstPurpose    = reduce(Sky + Earth);         // before age 40
  const maleLine        = reduce(E + H);               // generic sq diagonal ↘
  const femaleLine      = reduce(I + F);               // generic sq diagonal ↗
  const socialPurpose   = reduce(maleLine + femaleLine); // before age 60
  const holisticPurpose = reduce(firstPurpose + socialPurpose); // lifetime

  // ── Midpoints on generic square sides ────────────────────────────────────
  const EF = reduce(E + F);   // top side of generic square
  const FH = reduce(F + H);   // right side
  const HI = reduce(H + I);   // bottom side
  const IE = reduce(I + E);   // left side

  return {
    // Raw inputs (stored for display)
    input: { day, month, yearFull },

    // ── 9 core positions ──────────────────────────────────────────────────
    positions: {
      A:  { value: A,  zone: 'personal', label: 'Personal Energy',       note: 'How you arrive — the raw frequency you were born carrying.' },
      B:  { value: B,  zone: 'personal', label: 'Creative Expression',   note: 'How you create and communicate; your month energy.' },
      C:  { value: C,  zone: 'personal', label: 'Ancestral Code',        note: 'Year frequency — patterns inherited through the bloodline.' },
      D:  { value: D,  zone: 'personal', label: 'Karmic Tail',           note: 'The shadow corner. What must be transformed, not avoided.' },
      G:  { value: G,  zone: 'personal', label: 'Comfort Zone / Soul',   note: 'Core desire and heartfelt wish. The main life energy.' },
      E:  { value: E,  zone: 'generic',  label: 'Social Mask',           note: 'How others perceive you in the outer world.' },
      F:  { value: F,  zone: 'generic',  label: "Father's Line",         note: 'Masculine programme: direction, will, external authority.' },
      H:  { value: H,  zone: 'generic',  label: "Mother's Line",         note: 'Feminine programme: emotional conditioning, inner world.' },
      I:  { value: I,  zone: 'generic',  label: 'Ancestral Root',        note: 'Generational programme carried in the collective lineage.' },
    },

    // ── Spoke midpoints ───────────────────────────────────────────────────
    midpoints: {
      AG: { value: AG, label: 'Inner Left',   note: 'Integration of personal energy and soul centre.' },
      BG: { value: BG, label: 'Inner Top',    note: 'Integration of creativity and soul centre.' },
      CG: { value: CG, label: 'Inner Right',  note: 'Integration of ancestral code and soul centre.' },
      DG: { value: DG, label: 'Inner Bottom', note: 'Integration of shadow and soul centre.' },
    },

    // ── Generic square midpoints ──────────────────────────────────────────
    edgeMidpoints: {
      EF: { value: EF, label: 'Top Edge',    note: 'Social mask meeting father line.' },
      FH: { value: FH, label: 'Right Edge',  note: 'Father line meeting mother line.' },
      HI: { value: HI, label: 'Bottom Edge', note: "Mother line meeting ancestral root." },
      IE: { value: IE, label: 'Left Edge',   note: 'Ancestral root meeting social mask.' },
    },

    // ── Axis lines ────────────────────────────────────────────────────────
    axes: {
      Sky:   { value: Sky,   label: 'Sky Line',   note: 'Spiritual potential — energy available from above.' },
      Earth: { value: Earth, label: 'Earth Line',  note: 'Material potential — capacity to ground and build.' },
    },

    // ── Purposes ─────────────────────────────────────────────────────────
    purposes: {
      first:    { value: firstPurpose,    label: 'First Purpose (before 40)',  note: 'The psychological portrait to embody in the first half of life.' },
      male:     { value: maleLine,        label: 'Male Generic Line',          note: 'Masculine ancestral programme through the straight square.' },
      female:   { value: femaleLine,      label: 'Female Generic Line',        note: 'Feminine ancestral programme through the straight square.' },
      social:   { value: socialPurpose,   label: 'Social Purpose (before 60)', note: 'How you are called to contribute to others and society.' },
      holistic: { value: holisticPurpose, label: 'Holistic Purpose',           note: 'The lifetime integration — only fully available after both prior purposes are embodied.' },
    },
  };
}

// ── Parse a date string into { day, month, year } ────────────────────────────
// Accepts: DD/MM/YYYY · DD.MM.YYYY · DD-MM-YYYY · YYYY-MM-DD
function parseDate(str) {
  const parts = str.split(/[\/\-\.]/).map(Number);
  if (parts.length !== 3) throw new Error('Invalid date format. Use DD/MM/YYYY.');
  if (parts[0] > 1900) {
    // YYYY-MM-DD
    return { day: parts[2], month: parts[1], yearFull: parts[0] };
  }
  // DD/MM/YYYY
  return { day: parts[0], month: parts[1], yearFull: parts[2] };
}

// ── Convenience entry point ───────────────────────────────────────────────────
function matrixFromDate(dateStr) {
  const { day, month, yearFull } = parseDate(dateStr);
  return calculateMatrix(day, month, yearFull);
}

// ── Quick summary string (for debugging / console) ────────────────────────────
function matrixSummary(m) {
  const p = m.positions;
  const pu = m.purposes;
  const ax = m.axes;
  return [
    `══ Destiny Matrix ══════════════════`,
    `  Input  :  ${m.input.day} / ${m.input.month} / ${m.input.yearFull}`,
    ``,
    `  ── Personal Diamond ─────────────`,
    `  A  (Personal Energy)     :  ${p.A.value}`,
    `  B  (Creative Expression) :  ${p.B.value}`,
    `  C  (Ancestral Code)      :  ${p.C.value}`,
    `  D  (Karmic Tail)         :  ${p.D.value}`,
    `  G  (Soul / Centre)       :  ${p.G.value}`,
    ``,
    `  ── Generic Square ───────────────`,
    `  E  (Social Mask)         :  ${p.E.value}`,
    `  F  (Father's Line)       :  ${p.F.value}`,
    `  H  (Mother's Line)       :  ${p.H.value}`,
    `  I  (Ancestral Root)      :  ${p.I.value}`,
    ``,
    `  ── Axes ─────────────────────────`,
    `  Sky   (Spiritual)        :  ${ax.Sky.value}`,
    `  Earth (Material)         :  ${ax.Earth.value}`,
    ``,
    `  ── Purposes ─────────────────────`,
    `  First Purpose  (< 40)    :  ${pu.first.value}`,
    `  Male Generic Line        :  ${pu.male.value}`,
    `  Female Generic Line      :  ${pu.female.value}`,
    `  Social Purpose (< 60)    :  ${pu.social.value}`,
    `  Holistic Purpose         :  ${pu.holistic.value}`,
    `════════════════════════════════════`,
  ].join('\n');
}

// ── Export (browser global + Node-compatible) ─────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { reduce, calculateMatrix, parseDate, matrixFromDate, matrixSummary };
} else {
  window.DMCalc = { reduce, calculateMatrix, parseDate, matrixFromDate, matrixSummary };
}
