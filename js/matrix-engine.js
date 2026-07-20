/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  DESTINY MATRIX — CALCULATION ENGINE  (Natalya Ladini · 22-Arcana system)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Pure math / data. No UI, no styling. Drop into Node or a React/Next bundle.
 *
 *  CANONICAL LETTER SCHEME (locked):
 *    A = Left   · Day of Birth   · Core Character / Persona
 *    B = Top    · Month of Birth · Sky Line / Spiritual Potential / Divine Talents
 *    C = Right  · Year of Birth  · Earth Line / Material & Money Potential
 *    D = Bottom · Karmic Tail Root · Past-Life Lessons        = reduce(A+B+C)
 *    E = Center · Comfort Zone / Soul Center                  = reduce(A+B+C+D)
 *
 *    F–J = interior Money & Relationship channel nodes
 *    TL/TR/BR/BL = ancestral (diagonal) square corners
 *
 *  Gender labels belong ONLY to the diagonals — never to the central cross.
 * ═══════════════════════════════════════════════════════════════════════════
 */

'use strict';

/* ───────────────────────────────────────────────────────────────────────────
 * 1 · BASE-22 REDUCTION  (the Matrix Modulus / Arcana digital root)
 *    · 1–22 are valid arcana and returned untouched (22 is NEVER reduced to 4).
 *    · >22 → sum the digits, and repeat until the result is ≤ 22.
 * ─────────────────────────────────────────────────────────────────────────── */
function reduceArcana(num) {
  let n = Math.abs(Math.trunc(Number(num) || 0));
  while (n > 22) {
    n = String(n)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

/* ───────────────────────────────────────────────────────────────────────────
 * 1b · TALENT STAR LINE — ICON & ARCHETYPE STRING MAPS
 * ─────────────────────────────────────────────────────────────────────────── */

// 5-bucket map → matrix.talents.iconType (dominant node of the Crown/Throat/Third-Eye chain)
const ICON_TYPE_MAP = {
  1:'LEADER_ACTION', 4:'LEADER_ACTION', 7:'LEADER_ACTION', 11:'LEADER_ACTION', 19:'LEADER_ACTION',
  2:'INTUITION_WISDOM', 8:'INTUITION_WISDOM', 9:'INTUITION_WISDOM', 14:'INTUITION_WISDOM', 20:'INTUITION_WISDOM',
  3:'CREATIVITY_ART', 6:'CREATIVITY_ART', 12:'CREATIVITY_ART', 17:'CREATIVITY_ART', 18:'CREATIVITY_ART',
  5:'TEACHER_FREEDOM', 10:'TEACHER_FREEDOM', 21:'TEACHER_FREEDOM', 22:'TEACHER_FREEDOM',
  13:'TRANSFORMATION_POWER', 15:'TRANSFORMATION_POWER', 16:'TRANSFORMATION_POWER',
};

// 6-bucket map → professional archetype per talent category (Spiritual / Earthly / Ancestral)
const ARCHETYPE_MAP = {
  1:'STRATEGIC_LEADERSHIP', 4:'STRATEGIC_LEADERSHIP', 7:'STRATEGIC_LEADERSHIP', 11:'STRATEGIC_LEADERSHIP',
  2:'ESOTERIC_ANALYTICAL', 9:'ESOTERIC_ANALYTICAL', 14:'ESOTERIC_ANALYTICAL', 18:'ESOTERIC_ANALYTICAL',
  3:'PUBLIC_VISIBILITY', 6:'PUBLIC_VISIBILITY', 17:'PUBLIC_VISIBILITY', 19:'PUBLIC_VISIBILITY',
  5:'SYSTEMIC_TEACHER', 8:'SYSTEMIC_TEACHER', 20:'SYSTEMIC_TEACHER', 21:'SYSTEMIC_TEACHER',
  10:'INNOVATIVE_FREEDOM', 12:'INNOVATIVE_FREEDOM', 22:'INNOVATIVE_FREEDOM',
  13:'CRISIS_TRANSFORMATION', 15:'CRISIS_TRANSFORMATION', 16:'CRISIS_TRANSFORMATION',
};

// Named talent-program triplets — order-independent, same multiset pattern as the Karmic Tail codes.
const TALENT_PROGRAMS = {
  '7-13-20':  'PROGRAM_PATH_OF_REBIRTH',
  '9-15-21':  'PROGRAM_GLOBAL_SAGE',
  '3-11-19':  'PROGRAM_EMPIRE_BUILDER',
  '5-10-17':  'PROGRAM_STAR_TEACHER',
  '1-12-18':  'PROGRAM_REALITY_CATALYST',
};

// Per-node lookup — used to color individual Talent Star Line nodes by their own arcana value.
function getIconType(num) {
  return ICON_TYPE_MAP[num] || null;
}

// Per-node lookup — professional archetype bucket for any single arcana value.
function getArchetype(num) {
  return ARCHETYPE_MAP[num] || null;
}

// Mode of an array of arcana numbers; ties resolve to the earliest-listed value (crown/primary priority).
function dominantOf(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let best = values[0], bestCount = 0;
  for (const v of values) {
    const c = counts.get(v);
    if (c > bestCount) { best = v; bestCount = c; }
  }
  return best;
}

function matchTalentProgram(triplet) {
  const key = [...triplet].sort((a, b) => a - b).join('-');
  return TALENT_PROGRAMS[key] || 'STANDARD_INDIVIDUAL_TALENTS';
}

/* ───────────────────────────────────────────────────────────────────────────
 * 2 · KARMIC TAIL CODE LIBRARY
 *    The tail triplet is (D, F, E), where F = reduce(D + E) is DERIVED, not
 *    freely chosen — so "order" here isn't an arbitrary permutation, it's
 *    simply which value is D (root) vs E (soul center). Two different (D, E)
 *    pairs can produce the same three digits in different arrangements, and
 *    the source material treats those as genuinely different people — most
 *    visibly the "Magical Trinity" (18-9-9 / 9-18-9 / 9-9-18), three distinct
 *    named tails sharing the digits 9, 9, 18.
 *    Keys are the triplet's TRUE achievable order (verified against
 *    reduce(D+E) = F for every entry below) — never sorted. A sorted key
 *    can be mathematically unachievable and would silently never match.
 * ─────────────────────────────────────────────────────────────────────────── */
const KARMIC_TAIL_CODES = {
  '18-9-9':   'Sorcerer, Hermit, Rejection of Knowledge',
  '9-18-9':   'Magical Sacrifice',
  '9-9-18':   'The Wizard / Secret Knowledge',
  '6-17-11':  'Wasted Talent',
  '3-7-22':   'The Prisoner',
  '9-15-6':   'World of Passions / Temptation',
  '15-5-8':   'Family Betrayal',
  '18-6-6':   'Love Magic',
  '15-20-5':  'Rebel',
  '18-3-12':  'Physical Suffering',
  '12-19-7':  'Warrior',
  '9-12-3':   'The Solitary Woman',
  '3-22-19':  'The Unborn Child',
  '21-4-10':  'The Oppressed Soul',
  '12-16-4':  'The Emperor',
  '21-10-16': 'The Spiritual Priest',
  '6-8-20':   'Disappointment of the Lineage',
  '9-3-21':   'The Overseer',
  '6-5-17':   'Pride',
  '21-7-13':  'Destruction and Death',
  '15-8-11':  'Physical Aggression',
  '18-6-15':  'The Dark Magician',
  '6-20-14':  'The Sacrificed Soul',
  '21-10-7':  'The Warrior of Faith',
  '3-13-10':  'Self-Destruction',
  '6-14-8':   'The Dictator',
};

function matchKarmicTailCode(triplet) {
  const key = [...triplet].join('-');
  return KARMIC_TAIL_CODES[key] || null;
}

/* ───────────────────────────────────────────────────────────────────────────
 * 2b · SEXUAL LINE CODE LIBRARY
 *    A separate 26-combination naming system over the SAME (D, E) pair as
 *    the Karmic Tail, sourced from a different section of the same source
 *    material. Critically, its printed order is NOT (D, F, E) like the
 *    Karmic Tail — it's (D, E, F), derived value LAST rather than in the
 *    middle. Verified computationally against reduce(D+E) = F for all 26
 *    entries before trusting the printed order (same rigor as the Karmic
 *    Tail order-dependency fix — a by-hand assumption already produced one
 *    wrong answer once this session).
 *    Like the Karmic Tail, some (D, E) pairs collide in digit-set with a
 *    different name per swapped order (e.g. 3-6-9 vs 6-3-9) — both are
 *    kept as distinct entries, not merged.
 *    One source-internal inconsistency: 8-16-6 is given two different names
 *    in the source with no way to disambiguate (identical D/E pair, not a
 *    swapped-order case) — resolved by keeping one name ("Awakening Through
 *    Crisis"), noted here rather than silently dropped.
 * ─────────────────────────────────────────────────────────────────────────── */
const SEXUAL_LINE_CODES = {
  '7-5-12':   'Gentle Lovers',
  '12-6-18':  'Seekers of Perfection',
  '11-4-15':  'Vengeful Dominators',
  '6-12-18':  'Disillusioned Cynics',
  '10-11-21': 'Rebellious Servants',
  '5-10-15':  'Forbidden Dreamers',
  '4-8-12':   'Possessive Punishers',
  '11-13-6':  'Detached Lovers',
  '7-14-21':  'Versatile Lovers',
  '8-7-15':   'Vulnerable Rebels',
  '10-20-3':  'Aimless Lover',
  '8-16-6':   'Awakening Through Crisis', // source also gives "Passion Through Crisis" for this same pair — kept to one name
  '6-21-9':   'Pioneer of Desire',
  '3-6-9':    'Masked Provocateurs',
  '6-3-9':    'Magnetic Seducers',
  '9-9-18':   'Nostalgics of the Past',
  '9-18-9':   'Nostalgic Visionaries',
  '22-8-3':   'Changeable Explorers',
  '14-10-6':  'Unsatisfied Romantics',
  '16-5-21':  'Devoted Servants',
  '13-8-21':  'Lovers of Contrasts',
  '20-4-6':   'Extreme Lovers',
  '11-22-6':  'Idealistic Revolutionaries',
  '18-9-9':   'Cycle of the Past',
  '12-15-9':  'Disillusioned Hunter',
};

function matchSexualLineCode(D, E) {
  const F = reduceArcana(D + E);
  const key = `${D}-${E}-${F}`;
  return SEXUAL_LINE_CODES[key] || null;
}

/* ───────────────────────────────────────────────────────────────────────────
 * 3 · MAIN CALCULATOR
 *    Accepts an ISO date string "YYYY-MM-DD" and returns the full chart object.
 * ─────────────────────────────────────────────────────────────────────────── */
function calculateDestinyMatrix(birthdateString) {

  // ── Parse & validate ──────────────────────────────────────────────────────
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthdateString).trim());
  if (!m) {
    throw new Error(`Invalid date "${birthdateString}". Expected format "YYYY-MM-DD".`);
  }
  const year  = Number(m[1]);
  const month = Number(m[2]);
  const day   = Number(m[3]);
  if (month < 1 || month > 12) throw new Error(`Invalid month: ${month}`);
  if (day   < 1 || day   > 31) throw new Error(`Invalid day: ${day}`);

  // ── CENTRAL CROSS · Positions A–E ─────────────────────────────────────────
  const A = reduceArcana(day);            // Left   — Day of Birth
  const B = reduceArcana(month);          // Top    — Month of Birth
  const C = reduceArcana(year);           // Right  — Year (recursive digit root)
  const D = reduceArcana(A + B + C);      // Bottom — Karmic Tail Root
  const E = reduceArcana(A + B + C + D);  // Center — Comfort Zone / Soul

  // ── ANCESTRAL STRAIGHT SQUARE · diagonal corners ──────────────────────────
  // Each corner = the two cross-vertices it sits between (also the age anchors).
  const TL = reduceArcana(A + B); // Age 10 · Paternal diagonal (TL↘BR)
  const TR = reduceArcana(B + C); // Age 30 · Maternal diagonal (TR↙BL)
  const BR = reduceArcana(C + D); // Age 50 · Paternal diagonal
  const BL = reduceArcana(D + A); // Age 70 · Maternal diagonal

  // ── MONEY & RELATIONSHIP CHANNELS · Nodes F–J ─────────────────────────────
  const F = reduceArcana(D + E);  // Junction — money entry + karmic love block
  const G = reduceArcana(F + C);  // Money    — Wealth Potential (toward Right)
  const H = reduceArcana(F + G);  // Money    — Ideal Profession / Career synergy
  const I = reduceArcana(F + D);  // Love     — Ideal Partner Archetype
  const J = reduceArcana(F + E);  // Love     — Relationship Harmony (home peace)

  // ── KARMIC TAIL · triplet (D, F, E), locked in Minus at birth ─────────────
  const tail = [D, F, E];

  // ── THREE LIFE DESTINIES ──────────────────────────────────────────────────
  // Default: reduce-then-combine (each purpose point is its own arcana).
  // Flip these to raw-sum if your school combines before reducing.
  const skyLineSum   = reduceArcana(B + D);   // vertical axis  (Top + Bottom)
  const earthLineSum = reduceArcana(A + C);   // horizontal axis (Left + Right)
  const firstPurpose  = reduceArcana(skyLineSum + earthLineSum);         // → age 40

  const paternalSum  = reduceArcana(TL + BR); // TL↘BR
  const maternalSum  = reduceArcana(TR + BL); // TR↙BL
  const secondPurpose = reduceArcana(paternalSum + maternalSum);         // 40–60

  const thirdPurpose  = reduceArcana(firstPurpose + secondPurpose);      // 60+

  // ── TALENT STAR LINE · Crown → Third-Eye → Throat (top-down per spec) ────
  // Two midpoints are undefined upstream; built the same way every other
  // midpoint in this engine is: sequential reduce(prev + E) walking to center.
  // Standard chakra order top-down is 7=Crown, 6=Third Eye/Ajna, 5=Throat/
  // Vishuddha — confirmed against the source's own "6th chakra" (Ajna) named
  // before "5th chakra" (Vishuddha) on the walk from crown toward center.
  const crown    = B;                                // Sahasrara — Top Node
  const thirdEye = reduceArcana(crown + E);           // Ajna      — 1st midpoint
  const throat   = reduceArcana(thirdEye + E);        // Vishuddha — 2nd midpoint

  const spiritualDominant = dominantOf([crown, thirdEye, throat]);
  const spiritualArchetype = ARCHETYPE_MAP[spiritualDominant] || null;

  // Earthly & Social Talents — Left Node (A) chain toward Center (E).
  const earthlyMid = reduceArcana(A + E);
  const earthlyDominant  = dominantOf([A, earthlyMid]);
  const earthlyArchetype = ARCHETYPE_MAP[earthlyDominant] || null;

  // Ancestral Inherited Talents — top corners only (TL=Paternal, TR=Maternal).
  const paternalArchetype = ARCHETYPE_MAP[TL] || null;
  const maternalArchetype = ARCHETYPE_MAP[TR] || null;
  const ancestralDominant = dominantOf([TL, TR]);

  const talents = {
    crown, thirdEye, throat,
    iconType: ICON_TYPE_MAP[dominantOf([crown, thirdEye, throat])] || null,

    spiritual: { crown, thirdEye, throat, dominant: spiritualDominant, archetype: spiritualArchetype },
    earthly:   { left: A, midpoint: earthlyMid, dominant: earthlyDominant, archetype: earthlyArchetype },
    ancestral: {
      paternal: { value: TL, archetype: paternalArchetype },
      maternal: { value: TR, archetype: maternalArchetype },
    },

    activeProgram: matchTalentProgram([spiritualDominant, earthlyDominant, ancestralDominant]),
  };

  // ── STRUCTURED RETURN ─────────────────────────────────────────────────────
  return {
    input: { birthdate: birthdateString, day, month, year },

    core: {
      A: { position: 'Left',   value: A, label: 'Day of Birth · Core Character / Persona' },
      B: { position: 'Top',    value: B, label: 'Month · Sky Line / Spiritual Potential' },
      C: { position: 'Right',  value: C, label: 'Year · Earth Line / Material & Money' },
      D: { position: 'Bottom', value: D, label: 'Karmic Tail Root · Past-Life Lessons' },
      E: { position: 'Center', value: E, label: 'Comfort Zone / Soul Center' },
    },

    ancestralSquare: {
      TL: { value: TL, line: 'Paternal', ageAnchor: 10 },
      TR: { value: TR, line: 'Maternal', ageAnchor: 30 },
      BR: { value: BR, line: 'Paternal', ageAnchor: 50 },
      BL: { value: BL, line: 'Maternal', ageAnchor: 70 },
    },

    channels: {
      F: { value: F, label: 'Junction · Money Entry / Karmic Love Block' },
      G: { value: G, label: 'Wealth Potential' },
      H: { value: H, label: 'Ideal Profession / Career' },
      I: { value: I, label: 'Ideal Partner Archetype' },
      J: { value: J, label: 'Relationship Harmony' },
    },

    karmicTail: {
      sequence: tail,                        // [D, F, E]
      code: tail.join('-'),
      matchedCode: matchKarmicTailCode(tail), // named seed or null
    },

    destinies: {
      first:  { value: firstPurpose,  label: 'Personal Purpose (→ age 40)' },
      second: { value: secondPurpose, label: 'Social / Clan Purpose (40–60)' },
      third:  { value: thirdPurpose,  label: 'Spiritual Purpose (60+)' },
    },

    talents,
  };
}

/* ───────────────────────────────────────────────────────────────────────────
 * 3b · FLEXIBLE-FORMAT ENTRY POINT
 *    Accepts DD/MM/YYYY · DD.MM.YYYY · DD-MM-YYYY · YYYY-MM-DD (mirrors the
 *    legacy calculator.js parseDate() flexibility) and normalizes to the
 *    strict ISO string calculateDestinyMatrix() requires.
 * ─────────────────────────────────────────────────────────────────────────── */
function matrixFromDate(dateStr) {
  const parts = String(dateStr).trim().split(/[\/\-\.]/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid date "${dateStr}". Use DD/MM/YYYY or YYYY-MM-DD.`);
  }
  const [a, b, c] = parts;
  const iso = a > 1900
    ? `${a}-${String(b).padStart(2, '0')}-${String(c).padStart(2, '0')}`   // YYYY-MM-DD
    : `${c}-${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}`;  // DD/MM/YYYY
  return calculateDestinyMatrix(iso);
}

/* ───────────────────────────────────────────────────────────────────────────
 * 3c · YEARLY ENERGY FORECAST
 *    Source: research/01-Foundation/Destiny-Matrix-Calculation-Guide.
 *    extracted.md, Pages 12-13. "The life span is divided into 8 age
 *    sectors [decades]... 0 years=Energy A, 10 years=Energy F, 20 years=
 *    Energy B (...and so on)" — continuing that rotation around the
 *    octagon (already-confirmed age anchors: TL/F=10, TR/G=30, BR/H=50,
 *    BL/I=70) gives the full 8-anchor sequence: A(0)-F(10)-B(20)-G(30)-
 *    C(40)-H(50)-D(60)-I(70), cycling back to A at 80 ("The 80th birthday
 *    corresponds to 0"). Each decade is split into 7 mini-periods (a-g),
 *    computed from the decade's start/end anchor values (P/N) via the
 *    Guide's own fully-worked example (Page 13): d=P+N, b=P+d, a=P+b,
 *    c=b+d, f=d+N, e=d+f, g=f+N (=f+N matches the stated "g = f + B").
 *    Verified bit-exact against the Guide's own worked example (P=14,
 *    N=9 -> d=5,b=19,a=6,c=6,f=14,e=19,g=5) and against 3 independent
 *    real data points from a worked personal report (age ~22.5-25,
 *    decade 20-30, P=B, N=G): all 3 observed values landed in the
 *    predicted set at the correct evenly-divided (10/7-year) sub-period.
 *    No formula invented — this is the Guide's own stated method.
 * ─────────────────────────────────────────────────────────────────────────── */
function getYearlyEnergy(birthdateString, asOfDateString) {
  const chart = calculateDestinyMatrix(birthdateString);
  const bm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthdateString).trim());
  const birth = new Date(Date.UTC(Number(bm[1]), Number(bm[2]) - 1, Number(bm[3])));
  const asOf  = asOfDateString ? new Date(asOfDateString) : new Date();

  const MS_PER_YEAR = 365.2425 * 24 * 3600 * 1000;
  const rawAge = (asOf.getTime() - birth.getTime()) / MS_PER_YEAR;
  const age = ((rawAge % 80) + 80) % 80; // "the 80th birthday corresponds to 0"

  // Anchor sequence around the octagon, ages 0/10/20/30/40/50/60/70.
  const anchors = [
    chart.core.A.value, chart.ancestralSquare.TL.value,
    chart.core.B.value, chart.ancestralSquare.TR.value,
    chart.core.C.value, chart.ancestralSquare.BR.value,
    chart.core.D.value, chart.ancestralSquare.BL.value,
  ];

  const decadeIndex = Math.floor(age / 10); // 0-7
  const decadeStart = decadeIndex * 10;
  const P = anchors[decadeIndex];
  const N = anchors[(decadeIndex + 1) % 8];

  const d = reduceArcana(P + N);
  const b = reduceArcana(P + d);
  const a = reduceArcana(P + b);
  const c = reduceArcana(b + d);
  const f = reduceArcana(d + N);
  const e = reduceArcana(d + f);
  const g = reduceArcana(f + N);
  const slots = { a, b, c, d, e, f, g };

  const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const slotWidth = 10 / 7;
  const posInDecade = age - decadeStart;
  const slotIndex = Math.min(6, Math.floor(posInDecade / slotWidth));
  const slotLetter = order[slotIndex];

  return {
    ageYears: age,
    decadeStart, decadeEnd: decadeStart + 10,
    decadeStartValue: P, decadeEndValue: N,
    slots, slotLetter, slotIndex,
    value: slots[slotLetter],
    slotStartAge: decadeStart + slotIndex * slotWidth,
    slotEndAge: decadeStart + (slotIndex + 1) * slotWidth,
  };
}

/* ───────────────────────────────────────────────────────────────────────────
 * 4 · EXPORTS  (Node + browser global)
 * ─────────────────────────────────────────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { reduceArcana, matchKarmicTailCode, matchTalentProgram, getIconType, getArchetype, calculateDestinyMatrix, matrixFromDate, getYearlyEnergy };
} else {
  window.DMEngine = { reduceArcana, matchKarmicTailCode, matchSexualLineCode, matchTalentProgram, getIconType, getArchetype, calculateDestinyMatrix, matrixFromDate, getYearlyEnergy };
}

/* ───────────────────────────────────────────────────────────────────────────
 * 5 · QUICK VERIFICATION TEST
 * ─────────────────────────────────────────────────────────────────────────── */
if (typeof require !== 'undefined' && require.main === module) {
  const sample = '1987-03-29';
  const chart  = calculateDestinyMatrix(sample);

  console.log(`\n══ DESTINY MATRIX · ${sample} ═══════════════════════════════`);
  console.log('Central Cross :',
    `A/Left/Day=${chart.core.A.value}`,
    `B/Top/Month=${chart.core.B.value}`,
    `C/Right/Year=${chart.core.C.value}`,
    `D/Bottom/Karma=${chart.core.D.value}`,
    `E/Center/Soul=${chart.core.E.value}`);
  console.log('Ancestral Sq  :',
    `TL=${chart.ancestralSquare.TL.value}`,
    `TR=${chart.ancestralSquare.TR.value}`,
    `BR=${chart.ancestralSquare.BR.value}`,
    `BL=${chart.ancestralSquare.BL.value}`);
  console.log('Channels      :',
    `F=${chart.channels.F.value}`,
    `G=${chart.channels.G.value}`,
    `H=${chart.channels.H.value}`,
    `I=${chart.channels.I.value}`,
    `J=${chart.channels.J.value}`);
  console.log('Karmic Tail   :', chart.karmicTail.code,
    chart.karmicTail.matchedCode
      ? `→ "${chart.karmicTail.matchedCode}"`
      : '→ (no named seed · per-arcana reading)');
  console.log('Destinies     :',
    `1st=${chart.destinies.first.value}`,
    `2nd=${chart.destinies.second.value}`,
    `3rd=${chart.destinies.third.value}`);
  console.log('Talent Line   :',
    `crown=${chart.talents.crown}`,
    `throat=${chart.talents.throat}`,
    `thirdEye=${chart.talents.thirdEye}`,
    `iconType=${chart.talents.iconType}`);
  console.log('Talent Cats   :',
    `spiritual=${chart.talents.spiritual.dominant}/${chart.talents.spiritual.archetype}`,
    `earthly=${chart.talents.earthly.dominant}/${chart.talents.earthly.archetype}`,
    `paternal=${chart.talents.ancestral.paternal.value}/${chart.talents.ancestral.paternal.archetype}`,
    `maternal=${chart.talents.ancestral.maternal.value}/${chart.talents.ancestral.maternal.archetype}`);
  console.log('Active Program:', chart.talents.activeProgram);
  console.log('\nFull object   :');
  console.dir(chart, { depth: null });
}
