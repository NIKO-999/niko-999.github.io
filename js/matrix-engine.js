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

// Sums every individual digit of a number (no capping) — distinct from
// reduceArcana, which reduces a single already-formed sum. Used by Life Path,
// which digit-sums the raw day/month/year directly rather than combining
// already-reduced A/B/C the way D and E do.
function _digitSum(num) {
  return String(Math.abs(Math.trunc(Number(num) || 0)))
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
}

// Classical Western numerology reduction — distinct from reduceArcana (this
// app's own base-22 rule). Reduces fully to a single digit UNLESS the result
// is a master number (11, 22, 33), which stops the reduction immediately.
// Used only by Life Path, which is a real, externally-known number (people
// already know their own) and must match that convention, not this app's
// 22-Arcana system.
function _classicalReduce(num) {
  let n = Math.abs(Math.trunc(Number(num) || 0));
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = _digitSum(n);
  }
  return n;
}

// Reduces fully to a single digit (0-9), NEVER stopping at a master number —
// distinct from _classicalReduce. Used only by Challenge Numbers, which by
// standard convention always land in 0-8, unlike Pinnacles/Life Path/Birthday
// Number, which preserve 11/22/33.
function _reduceToSingleDigit(num) {
  let n = Math.abs(Math.trunc(Number(num) || 0));
  while (n > 9) n = _digitSum(n);
  return n;
}

/* ───────────────────────────────────────────────────────────────────────────
 * 1c · BIRTHDATE-ONLY CLASSICAL NUMEROLOGY
 *    Birthday Number, Pinnacles, Challenges, Karmic Debt flags, Personal
 *    Year — all computable from day/month/year alone (no name required),
 *    and all distinct from both this app's own base-22 Arcana system and
 *    from Life Path (Life Path is the digit-sum of the whole birthdate;
 *    these are separate, standard classical-numerology concepts layered on
 *    top of the same three raw inputs).
 * ─────────────────────────────────────────────────────────────────────────── */

// Natural-talent number — classical reduction of the raw day of birth alone.
// e.g. day 29 -> digitSum 11, a master number, stops there (matches
// _classicalReduce's own master-number-preserving behavior).
function birthdayNumber(day) {
  return _classicalReduce(day);
}

// Four Pinnacles — standard formula: reduce month/day/year to single
// classical digits first (master numbers preserved at this step), then
// combine. P1 = month+day (first life stage), P2 = day+year, P4 = month+year,
// P3 = P1+P2 (the "bridge" pinnacle). Stage age ranges come from
// pinnacleAgeRanges() below, keyed off Life Path.
function pinnacles(day, month, year) {
  const rMonth = _classicalReduce(month);
  const rDay   = _classicalReduce(day);
  const rYear  = _classicalReduce(year);
  const p1 = _classicalReduce(rMonth + rDay);
  const p2 = _classicalReduce(rDay + rYear);
  const p4 = _classicalReduce(rMonth + rYear);
  const p3 = _classicalReduce(p1 + p2);
  return { p1, p2, p3, p4 };
}

// Four Challenges — same reduced month/day/year inputs as Pinnacles, but via
// absolute difference, and always collapsed to a single digit 0-8 (master
// numbers are NOT preserved for Challenges, per standard convention — see
// _reduceToSingleDigit). Each challenge shares its life-stage age range with
// the correspondingly-numbered Pinnacle.
function challenges(day, month, year) {
  const rMonth = _classicalReduce(month);
  const rDay   = _classicalReduce(day);
  const rYear  = _classicalReduce(year);
  const c1 = _reduceToSingleDigit(Math.abs(rMonth - rDay));
  const c2 = _reduceToSingleDigit(Math.abs(rDay - rYear));
  const c4 = _reduceToSingleDigit(Math.abs(rMonth - rYear));
  const c3 = _reduceToSingleDigit(Math.abs(c1 - c2));
  return { c1, c2, c3, c4 };
}

// Life-stage age ranges shared by both Pinnacles and Challenges, keyed off
// the person's own Life Path number (standard formula: stage 1 ends at
// 36 - lifePathValue; stages 2 and 3 each last 9 years; stage 4 runs for the
// rest of life). Computed live from the chart rather than hard-coded, so the
// UI can generate "which stage, what age range" framing per person.
function pinnacleAgeRanges(lifePathValue) {
  const end1 = 36 - lifePathValue;
  const end2 = end1 + 9;
  const end3 = end2 + 9;
  return [
    { stage: 1, startAge: 0,    endAge: end1 },
    { stage: 2, startAge: end1, endAge: end2 },
    { stage: 3, startAge: end2, endAge: end3 },
    { stage: 4, startAge: end3, endAge: null }, // rest of life
  ];
}

// Karmic Debt Numbers (classical: 13, 14, 16, 19) — a bonus flag, not a
// standalone chart position. Flagged when the birth day itself is one of
// these, OR when Life Path's own reduction chain (digitSum(day)+digitSum
// (month)+digitSum(year), reduced via the same loop _classicalReduce uses)
// passes through one of these values before its final collapse. Distinct
// from this app's own Arcana-based "Karmic Debt" star (KARMA key) — that is
// a completely different, Arcana-flavored system; this is the classical
// numerology convention layered on top of Life Path specifically.
function karmicDebtFlags(day, month, year) {
  const DEBT_NUMBERS = [13, 14, 16, 19];
  const flags = new Set();
  if (DEBT_NUMBERS.includes(day)) flags.add(day);
  let n = _digitSum(day) + _digitSum(month) + _digitSum(year);
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    if (DEBT_NUMBERS.includes(n)) flags.add(n);
    n = _digitSum(n);
  }
  return Array.from(flags).sort((a, b) => a - b);
}

// Personal Year — classical cyclical number, birth month + birth day +
// CURRENT year (not birth year). Distinct from this app's existing
// Arcana-based getYearlyEnergy() — same relationship as Karmic Tail and
// Sexual Line already coexisting as parallel systems over the same inputs.
function personalYear(day, month, currentYear) {
  return _classicalReduce(_digitSum(month) + _digitSum(day) + _digitSum(currentYear));
}

// Convenience wrapper mirroring getYearlyEnergy()'s (birthdateString,
// asOfDateString) signature, so UI code doesn't need to re-parse the ISO
// date string itself.
function getPersonalYear(birthdateString, asOfDateString) {
  const bm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthdateString).trim());
  if (!bm) throw new Error(`Invalid date "${birthdateString}". Expected format "YYYY-MM-DD".`);
  const day = Number(bm[3]), month = Number(bm[2]);
  const asOfYear = asOfDateString ? new Date(asOfDateString).getFullYear() : new Date().getFullYear();
  return { value: personalYear(day, month, asOfYear), asOfYear, label: `Personal Year · ${asOfYear}` };
}

/* ───────────────────────────────────────────────────────────────────────────
 * 1d · NAME-BASED CLASSICAL NUMEROLOGY
 *    Expression, Soul Urge, Personality, Maturity — the standard numbers
 *    that require a full NAME rather than just a birthdate. Uses the
 *    Pythagorean letter-value grid (A/J/S=1 ... I/R=9), the system most
 *    people already expect from their own "Expression Number," distinct
 *    from Numberolgy-data.pdf's own Chaldean grid. Entirely optional in
 *    this app — a name is never required to see the core Destiny Matrix
 *    chart, only to unlock these four numbers. Nothing here is persisted
 *    or sent anywhere; the name lives only in the browser tab's memory.
 * ─────────────────────────────────────────────────────────────────────────── */
const PYTHAGOREAN_LETTER_VALUES = {
  A:1, J:1, S:1,
  B:2, K:2, T:2,
  C:3, L:3, U:3,
  D:4, M:4, V:4,
  E:5, N:5, W:5,
  F:6, O:6, X:6,
  G:7, P:7, Y:7,
  H:8, Q:8, Z:8,
  I:9, R:9,
};
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Letters only, uppercased — strips spaces, punctuation, digits.
function _lettersOnly(name) {
  return String(name || '').toUpperCase().replace(/[^A-Z]/g, '');
}

// Y counts as a vowel only when it's the sole vowel sound in its stretch of
// the name — i.e. no A/E/I/O/U immediately before or after it. This is the
// standard simplified heuristic (the one genuinely fuzzy rule in the whole
// system); every other letter's vowel/consonant status is fixed.
function _isVowelAt(letters, i) {
  const ch = letters[i];
  if (VOWELS.has(ch)) return true;
  if (ch !== 'Y') return false;
  const prevIsVowel = i > 0 && VOWELS.has(letters[i - 1]);
  const nextIsVowel = i < letters.length - 1 && VOWELS.has(letters[i + 1]);
  return !prevIsVowel && !nextIsVowel;
}

function expressionNumber(name) {
  const letters = _lettersOnly(name);
  let sum = 0;
  for (const ch of letters) sum += PYTHAGOREAN_LETTER_VALUES[ch] || 0;
  return _classicalReduce(sum);
}

function soulUrgeNumber(name) {
  const letters = _lettersOnly(name);
  let sum = 0;
  for (let i = 0; i < letters.length; i++) {
    if (_isVowelAt(letters, i)) sum += PYTHAGOREAN_LETTER_VALUES[letters[i]] || 0;
  }
  return _classicalReduce(sum);
}

function personalityNumber(name) {
  const letters = _lettersOnly(name);
  let sum = 0;
  for (let i = 0; i < letters.length; i++) {
    if (!_isVowelAt(letters, i)) sum += PYTHAGOREAN_LETTER_VALUES[letters[i]] || 0;
  }
  return _classicalReduce(sum);
}

function maturityNumber(lifePathValue, expressionValue) {
  return _classicalReduce(Number(lifePathValue) + Number(expressionValue));
}

// Convenience wrapper — computes all four from a birthdate + name together,
// matching the calculateDestinyMatrix/getPersonalYear convenience-wrapper
// pattern used elsewhere in this file.
function getNameNumbers(birthdateString, name) {
  const chart = calculateDestinyMatrix(birthdateString);
  const expression  = expressionNumber(name);
  const soulUrge     = soulUrgeNumber(name);
  const personality = personalityNumber(name);
  const maturity     = maturityNumber(chart.lifePath.value, expression);
  return {
    expression:  { value: expression,  label: 'Expression Number' },
    soulUrge:    { value: soulUrge,    label: 'Soul Urge Number' },
    personality: { value: personality, label: 'Personality Number' },
    maturity:    { value: maturity,    label: 'Maturity Number' },
  };
}

/* ───────────────────────────────────────────────────────────────────────────
 * 1e · NAME-BASED NUMEROLOGY, ROUND 2 — Hidden Passion, Subconscious Self /
 *    Karmic Lessons, Cornerstone & Capstone. All still name-based (require
 *    the same optional name input as Expression/Soul Urge/Personality/
 *    Maturity), but built from letter FREQUENCY and PRESENCE rather than
 *    sums — a genuinely different mechanism, not just another total.
 * ─────────────────────────────────────────────────────────────────────────── */

// Hidden Passion Number — the digit (1-9) whose letters occur most often
// across the full name. Reveals a natural, sometimes under-used talent —
// distinct from Expression/Soul Urge/Personality, which are all sums; this
// is about which single digit shows up over and over. Ties resolve to the
// lowest tied digit (a deterministic, commonly-used convention).
function hiddenPassionNumber(name) {
  const letters = _lettersOnly(name);
  const counts = {};
  for (const ch of letters) {
    const v = PYTHAGOREAN_LETTER_VALUES[ch];
    if (v) counts[v] = (counts[v] || 0) + 1;
  }
  let value = null, count = 0;
  for (let d = 1; d <= 9; d++) {
    const c = counts[d] || 0;
    if (c > count) { count = c; value = d; }
  }
  return { value, count };
}

// Subconscious Self Number — how many of the 9 digits (1-9) are present AT
// ALL among the letters of the full name; ranges 1-9 itself, read as a
// measure of resourcefulness/self-confidence under pressure. Karmic
// Lessons — the digits NOT present at all — read as areas still being
// developed rather than natural strengths. Classical numerology treats
// absence as meaningfully as presence, which is why this is a genuinely
// different mechanism from every sum-based number elsewhere in this file.
function subconsciousSelfAndLessons(name) {
  const letters = _lettersOnly(name);
  const present = new Set();
  for (const ch of letters) {
    const v = PYTHAGOREAN_LETTER_VALUES[ch];
    if (v) present.add(v);
  }
  const missingNumbers = [];
  for (let d = 1; d <= 9; d++) if (!present.has(d)) missingNumbers.push(d);
  return { value: present.size, missingNumbers };
}

// Splits a full name into whitespace-separated parts. Used by Cornerstone/
// Capstone, which specifically look at the first name's first letter and
// the last name's last letter — not the name as one undifferentiated
// string, the way Expression/Soul Urge/Personality treat it.
function _nameParts(name) {
  return String(name || '').trim().split(/\s+/).filter(Boolean);
}

// Cornerstone — the Pythagorean value of the FIRST letter of the first
// name. Read as how you approach new opportunities and beginnings. Returns
// null if no usable letter is present (e.g. an empty/unparseable name).
function cornerstoneNumber(name) {
  const parts = _nameParts(name);
  if (!parts.length) return null;
  const letters = _lettersOnly(parts[0]);
  const first = letters[0];
  return first ? PYTHAGOREAN_LETTER_VALUES[first] : null;
}

// Capstone — the Pythagorean value of the LAST letter of the last name
// part. Read as how you follow through and finish things. Falls back to
// the same single word Cornerstone used when only one name part is given.
function capstoneNumber(name) {
  const parts = _nameParts(name);
  if (!parts.length) return null;
  const letters = _lettersOnly(parts[parts.length - 1]);
  const last = letters[letters.length - 1];
  return last ? PYTHAGOREAN_LETTER_VALUES[last] : null;
}

// Bridge Number — the gap between Life Path (what your life is
// fundamentally about) and Expression (how you naturally act), reduced.
// Read as how much conscious effort it takes to make your inner drive and
// your outward action actually agree with each other. Uses
// _reduceToSingleDigit, the same "gap number" reduction Challenges uses
// (0-8, master numbers never preserved) — a genuine tension measure, not
// a sum, so it belongs with that family of reductions rather than
// _classicalReduce's master-number-preserving one.
function bridgeNumber(lifePathValue, expressionValue) {
  return _reduceToSingleDigit(Math.abs(Number(lifePathValue) - Number(expressionValue)));
}

/* ───────────────────────────────────────────────────────────────────────────
 * 1f · COMPATIBILITY — Life Path only, birthdate-only for BOTH people (no
 *    second name required — keeps this simple and doesn't ask for a second
 *    person's full name just to unlock it). Two numbers, same relationship
 *    every other pairing-of-two-values reading in this file uses:
 *      Relationship Number — _classicalReduce(lifePathA + lifePathB),
 *        master numbers preserved, same as Life Path itself. What the two
 *        Life Paths create TOGETHER, as its own third thing.
 *      Compatibility Gap   — _reduceToSingleDigit(|lifePathA - lifePathB|),
 *        0-8, same reduction Bridge/Challenges use. How much conscious
 *        bridging this specific pairing needs.
 * ─────────────────────────────────────────────────────────────────────────── */
function relationshipNumber(lifePathA, lifePathB) {
  return _classicalReduce(Number(lifePathA) + Number(lifePathB));
}

function compatibilityGapNumber(lifePathA, lifePathB) {
  return _reduceToSingleDigit(Math.abs(Number(lifePathA) - Number(lifePathB)));
}

// Convenience wrapper — takes two birthdates, returns both Life Paths plus
// the two derived compatibility numbers. Neither birthdate needs a name.
function getCompatibility(birthdateA, birthdateB) {
  const lifePathA = calculateDestinyMatrix(birthdateA).lifePath.value;
  const lifePathB = calculateDestinyMatrix(birthdateB).lifePath.value;
  return {
    lifePathA, lifePathB,
    relationship: { value: relationshipNumber(lifePathA, lifePathB), label: 'Relationship Number' },
    gap: { value: compatibilityGapNumber(lifePathA, lifePathB), label: 'Compatibility Gap' },
  };
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

  // ── LIFE PATH · full birthdate digit sum, classical reduction ─────────────
  // Distinct from A-E's chain of already-reduced sums: every individual digit
  // of the day, month, and year is added directly (not A+B+C's reduced
  // values). Reduced via _classicalReduce (1-9, or master numbers 11/22/33),
  // NOT this app's own base-22 reduceArcana — Life Path is a real, externally
  // known number (people already know their own), verified against a real
  // example: 2002-05-08 -> digitSum(8)+digitSum(5)+digitSum(2002) = 8+5+4=17
  // -> classically reduced 1+7=8, matching the known value for that date.
  const lifePath = _classicalReduce(_digitSum(day) + _digitSum(month) + _digitSum(year));

  // ── BIRTHDATE-ONLY CLASSICAL NUMEROLOGY · Birthday Number, Pinnacles,
  //    Challenges, Karmic Debt flags ─────────────────────────────────────────
  const birthday      = birthdayNumber(day);
  const pinnacleSet   = pinnacles(day, month, year);
  const challengeSet  = challenges(day, month, year);
  const karmicDebt    = karmicDebtFlags(day, month, year);
  const pinnacleAges  = pinnacleAgeRanges(lifePath);

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

  // ── LETTERED ARM POINTS (shared by the Talent line and the Chakra Map) ────
  // The vertical (sky) arm runs B -> P -> K -> T -> E and the horizontal
  // (earth) arm runs A -> O -> J -> S -> E, each by successive
  // midpoint-toward-centre. Derivation and verification: see the CHAKRA MAP
  // comment below — these are the guide's own letters, solved against its
  // Page 15 worked example, not invented here.
  const chK = reduceArcana(B + E), chP = reduceArcana(B + chK), chT = reduceArcana(chK + E);
  const chJ = reduceArcana(A + E), chO = reduceArcana(A + chJ), chS = reduceArcana(chJ + E);
  const chL = reduceArcana(C + E), chM = reduceArcana(D + E);

  // ── TALENT STAR LINE ──────────────────────────────────────────────────────
  // CORRECTED 2026-07-28. This previously walked B -> reduce(B+E) ->
  // reduce(B+E+E) and labelled those two points "Ajna/Third Eye" and
  // "Vishuddha/Throat". That was off by one position: the guide's own chakra
  // table shows THREE points between B and centre (P, K, T), so the app's
  // first point was really K (Vishuddha) and its second was T (Anahata) — a
  // heart-chakra value being shown as a throat talent. See
  // research/11-Research-Updates/24-*.md.
  //
  // The talent positions and their sourced names:
  //   crown    = B   Sahasrara  — "God-given talents (birth month)"
  //                              cheat sheet: "Your Core Talent & Source of
  //                              Inspiration". Already drawn as the Sky Line star.
  //   pastLife = P   Ajna       — Talent-Zone.md: "cognitive abilities and
  //                              talents carried over from previous lives";
  //                              cheat sheet: "Hidden Past-Life Talent, Past
  //                              Life Skill".
  //   personal = K   Vishuddha  — Talent-Zone.md: "talent for self-expression";
  //                              guide Page 6: "K represents your personal
  //                              (individual) talent"; cheat sheet:
  //                              "Self-Presentation, Social Interaction,
  //                              Self-Expression in This Lifetime".
  // T (Anahata) is NOT a talent position and now belongs to the Chakra Map.
  const crown    = B;
  const pastLife = chP;
  const personal = chK;

  const spiritualDominant = dominantOf([crown, pastLife, personal]);
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
    crown, pastLife, personal,
    iconType: ICON_TYPE_MAP[dominantOf([crown, pastLife, personal])] || null,

    spiritual: { crown, pastLife, personal, dominant: spiritualDominant, archetype: spiritualArchetype },
    earthly:   { left: A, midpoint: earthlyMid, dominant: earthlyDominant, archetype: earthlyArchetype },
    ancestral: {
      paternal: { value: TL, archetype: paternalArchetype },
      maternal: { value: TR, archetype: maternalArchetype },
    },

    activeProgram: matchTalentProgram([spiritualDominant, earthlyDominant, ancestralDominant]),
  };

  /* ── CHAKRA MAP · 7 chakras x 3 aspects ────────────────────────────────────
   * Source: research/01-Foundation/Destiny-Matrix-Calculation-Guide.extracted.md
   * Pages 14-15. The guide gives seven "diagonal" formulas:
   *
   *   Sahasrara = A + B    Ajna     = O + P    Vishuddha = J + K
   *   Anahata   = S + T    Manipura = E + E    Swadhisthana = L + M
   *   Muladhara = C + D
   *
   * Earlier passes recorded O/P/J/K/S/T/L/M as having "no sourced definition"
   * and left 5 of the 7 unbuilt. They are in fact fully determined: Page 15
   * prints a worked example whose two letter columns are
   *   Physical (horizontal / earth line): A, O, J, S, E, L, C
   *   Energy   (vertical  / sky line)   : B, P, K, T, E, M, D
   * with values 22,4,9,14,5,13,8 and 4,13,9,14,5,12,7. That example's A-E are
   * this engine's own A-E (D = reduce(A+B+C) = 7, E = reduce(A+B+C+D) = 5 both
   * check out), and every remaining letter falls out as the same successive
   * midpoint-toward-centre construction used everywhere else in this engine:
   *
   *   horizontal arm   A -> O -> J -> S -> E      vertical arm   B -> P -> K -> T -> E
   *     J = reduce(A + E)                           K = reduce(B + E)
   *     O = reduce(A + J)                           P = reduce(B + K)
   *     S = reduce(J + E)                           T = reduce(K + E)
   *     L = reduce(C + E)                           M = reduce(D + E)
   *
   * All eight reproduce the worked example exactly, and the full 7x3 table
   * plus all three column totals match it bit-for-bit (75->12, 64->10,
   * 85->13). Independently confirmed a second time against the rendered
   * Sky Line arm in DestinyMatrix-Sheet.extracted.md Page 1, where the circle
   * COLOURS also line up with the traditional chakra palette
   * (purple=Sahasrara at B, blue=Ajna at P, light blue=Vishuddha at K,
   * green=Anahata at T). See research/11-Research-Updates/24-*.md.
   *
   * "Manipura = E + E" is therefore genuine, not the OCR misread the original
   * extraction flagged — it resolves correctly in the worked example.
   *
   * Aspect model (Page 14, "Classical Calculation" + Page 6): the horizontal
   * value is Physical, the vertical value is Energetic, and Emotional is the
   * sum of the two. Column totals are the reduced sum down each column.
   * ───────────────────────────────────────────────────────────────────────── */
  const CHAKRA_ROWS = [
    { key: 'sahasrara',    name: 'Sahasrara',    common: 'Crown',        colour: '#A855F7', physical: A,   energy: B   },
    { key: 'ajna',         name: 'Ajna',         common: 'Third Eye',    colour: '#4F63D2', physical: chO, energy: chP },
    { key: 'vishuddha',    name: 'Vishuddha',    common: 'Throat',       colour: '#3FC5E8', physical: chJ, energy: chK },
    { key: 'anahata',      name: 'Anahata',      common: 'Heart',        colour: '#4ADE80', physical: chS, energy: chT },
    { key: 'manipura',     name: 'Manipura',     common: 'Solar Plexus', colour: '#FACC15', physical: E,   energy: E   },
    { key: 'swadhisthana', name: 'Swadhisthana', common: 'Sacral',       colour: '#FB923C', physical: chL, energy: chM },
    { key: 'muladhara',    name: 'Muladhara',    common: 'Root',         colour: '#EF4444', physical: C,   energy: D   },
  ];

  const chakraList = CHAKRA_ROWS.map((r) => ({
    ...r, emotional: reduceArcana(r.physical + r.energy),
  }));
  const _sum = (f) => chakraList.reduce((s, r) => s + r[f], 0);
  const chakras = {
    list: chakraList,
    totals: {
      physical:  { raw: _sum('physical'),  value: reduceArcana(_sum('physical'))  },
      energy:    { raw: _sum('energy'),    value: reduceArcana(_sum('energy'))    },
      emotional: { raw: _sum('emotional'), value: reduceArcana(_sum('emotional')) },
    },
    // The lettered arm points, exposed so the UI layer never re-derives them.
    letters: { O: chO, J: chJ, S: chS, L: chL, P: chP, K: chK, T: chT, M: chM },
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

    lifePath: { value: lifePath, label: 'Life Path · Full Birthdate Digit Sum' },

    birthdayNumber: { value: birthday, label: 'Birthday Number · Day of Birth' },

    pinnacles: {
      ...pinnacleSet,
      ages: pinnacleAges,
      label: 'Pinnacles · Four Life-Stage Cycles',
    },

    challenges: {
      ...challengeSet,
      ages: pinnacleAges,
      label: 'Challenges · Four Life-Stage Obstacles',
    },

    karmicDebt: { flags: karmicDebt, label: 'Karmic Debt Numbers (Classical)' },

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
    chakras,
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
  module.exports = { reduceArcana, _classicalReduce, birthdayNumber, pinnacles, challenges, pinnacleAgeRanges, karmicDebtFlags, personalYear, getPersonalYear, expressionNumber, soulUrgeNumber, personalityNumber, maturityNumber, getNameNumbers, hiddenPassionNumber, subconsciousSelfAndLessons, cornerstoneNumber, capstoneNumber, bridgeNumber, relationshipNumber, compatibilityGapNumber, getCompatibility, matchKarmicTailCode, matchTalentProgram, getIconType, getArchetype, calculateDestinyMatrix, matrixFromDate, getYearlyEnergy };
} else {
  window.DMEngine = { reduceArcana, _classicalReduce, birthdayNumber, pinnacles, challenges, pinnacleAgeRanges, karmicDebtFlags, personalYear, getPersonalYear, expressionNumber, soulUrgeNumber, personalityNumber, maturityNumber, getNameNumbers, hiddenPassionNumber, subconsciousSelfAndLessons, cornerstoneNumber, capstoneNumber, bridgeNumber, relationshipNumber, compatibilityGapNumber, getCompatibility, matchKarmicTailCode, matchSexualLineCode, matchTalentProgram, getIconType, getArchetype, calculateDestinyMatrix, matrixFromDate, getYearlyEnergy };
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
    `pastLife=${chart.talents.pastLife}`,
    `personal=${chart.talents.personal}`,
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
