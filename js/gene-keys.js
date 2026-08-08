/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — SOLAR CALCULATION + WHEEL DATA
 * ═══════════════════════════════════════════════════════════════════════════
 *  Pure math / data, no UI. Computes the four Prime Gifts of a Gene Keys
 *  profile from a birthdate alone (no birth time — the Sun moves ~1°/day and
 *  each key spans 5°37′30″, so date-only is correct to the key except within
 *  a few hours of a boundary):
 *
 *    Life's Work — the key holding the Sun's zodiacal longitude at birth
 *    Evolution   — the key opposite it (+180°)
 *    Radiance    — the key 88° of solar arc BEFORE birth (the prenatal
 *                  "design" Sun, ≈88 days earlier)
 *    Purpose     — the key opposite Radiance (+180°)
 *
 *  Solar longitude uses the standard low-precision formula (Meeus, Astronomical
 *  Algorithms ch. 25 abridged) — accurate to ~0.01°, far finer than the
 *  5.625° key segments. Dates are taken at 12:00 UTC.
 *
 *  WHEEL: the canonical Gene Keys / Human Design zodiac wheel. Key 25 spans
 *  28°15′ Pisces → 3°52′30″ Aries (i.e. the wheel offset is 358.25°), and the
 *  64 keys follow in the fixed order below. Verifiable anchors: Key 41 — the
 *  "start codon" of the yearly cycle — begins at exactly 2°00′ Aquarius
 *  (302.0°), and the 0° Aries equinox point falls inside Key 25.
 *
 *  API:
 *    DGeneKeys.solarLongitude(isoDate) -> degrees 0-360
 *    DGeneKeys.keyAt(lambda)           -> key number 1-64
 *    DGeneKeys.primes(isoDate)         -> { lifesWork, evolution, radiance,
 *                                          purpose } each { key, lambda }
 *    DGeneKeys.KEYS[n]                 -> { name, shadow, gift, siddhi }
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  // 64 keys in zodiac order; WHEEL[0] begins at WHEEL_OFFSET degrees
  // (28°15′ Pisces), each spanning 360/64 = 5.625°.
  const WHEEL_OFFSET = 358.25;
  const WHEEL = [
    25, 17, 21, 51, 42,  3, 27, 24,  2, 23,  8, 20, 16, 35, 45, 12,
    15, 52, 39, 53, 62, 56, 31, 33,  7,  4, 29, 59, 40, 64, 47,  6,
    46, 18, 48, 57, 32, 50, 28, 44,  1, 43, 14, 34,  9,  5, 26, 11,
    10, 58, 38, 54, 61, 60, 41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
  ];

  // Published Gene Keys spectrum: Shadow → Gift → Siddhi, with each key's
  // traditional name. Short labels only — full interpretive writing for the
  // 64 keys is a separate, later effort (per docs/GOLDEN-STANDARD.md, no
  // generic filler in its place).
  const KEYS = {
    1:  { name: 'From Entropy to Syntropy',        shadow: 'Entropy',         gift: 'Freshness',        siddhi: 'Beauty' },
    2:  { name: 'Returning to the One',            shadow: 'Dislocation',     gift: 'Orientation',      siddhi: 'Unity' },
    3:  { name: 'Through the Eyes of a Child',     shadow: 'Chaos',           gift: 'Innovation',       siddhi: 'Innocence' },
    4:  { name: 'A Universal Panacea',             shadow: 'Intolerance',     gift: 'Understanding',    siddhi: 'Forgiveness' },
    5:  { name: 'The Ending of Time',              shadow: 'Impatience',      gift: 'Patience',         siddhi: 'Timelessness' },
    6:  { name: 'The Path to Peace',               shadow: 'Conflict',        gift: 'Diplomacy',        siddhi: 'Peace' },
    7:  { name: 'Virtue is its Own Reward',        shadow: 'Division',        gift: 'Guidance',         siddhi: 'Virtue' },
    8:  { name: 'Diamond of the Self',             shadow: 'Mediocrity',      gift: 'Style',            siddhi: 'Exquisiteness' },
    9:  { name: 'The Power of the Infinitesimal',  shadow: 'Inertia',         gift: 'Determination',    siddhi: 'Invincibility' },
    10: { name: 'Being at Ease',                   shadow: 'Self-Obsession',  gift: 'Naturalness',      siddhi: 'Being' },
    11: { name: 'The Light of Eden',               shadow: 'Obscurity',       gift: 'Idealism',         siddhi: 'Light' },
    12: { name: 'A Pure Heart',                    shadow: 'Vanity',          gift: 'Discrimination',   siddhi: 'Purity' },
    13: { name: 'Listening Through Love',          shadow: 'Discord',         gift: 'Discernment',      siddhi: 'Empathy' },
    14: { name: 'Radiating Prosperity',            shadow: 'Compromise',      gift: 'Competence',       siddhi: 'Bounteousness' },
    15: { name: 'An Eternally Flowering Spring',   shadow: 'Dullness',        gift: 'Magnetism',        siddhi: 'Florescence' },
    16: { name: 'Magical Genius',                  shadow: 'Indifference',    gift: 'Versatility',      siddhi: 'Mastery' },
    17: { name: 'The Eye',                         shadow: 'Opinion',         gift: 'Far-sightedness',  siddhi: 'Omniscience' },
    18: { name: 'The Healing Power of Mind',       shadow: 'Judgement',       gift: 'Integrity',        siddhi: 'Perfection' },
    19: { name: 'The Future Human Being',          shadow: 'Co-dependence',   gift: 'Sensitivity',      siddhi: 'Sacrifice' },
    20: { name: 'The Sacred Om',                   shadow: 'Superficiality',  gift: 'Self-Assurance',   siddhi: 'Presence' },
    21: { name: 'A Noble Life',                    shadow: 'Control',         gift: 'Authority',        siddhi: 'Valour' },
    22: { name: 'Grace Under Pressure',            shadow: 'Dishonour',       gift: 'Graciousness',     siddhi: 'Grace' },
    23: { name: 'The Alchemy of Simplicity',       shadow: 'Complexity',      gift: 'Simplicity',       siddhi: 'Quintessence' },
    24: { name: 'Silence — the Ultimate Addiction', shadow: 'Addiction',      gift: 'Invention',        siddhi: 'Silence' },
    25: { name: 'The Myth of the Sacred Wound',    shadow: 'Constriction',    gift: 'Acceptance',       siddhi: 'Universal Love' },
    26: { name: 'Sacred Tricksters',               shadow: 'Pride',           gift: 'Artfulness',       siddhi: 'Invisibility' },
    27: { name: 'Food of the Gods',                shadow: 'Selfishness',     gift: 'Altruism',         siddhi: 'Selflessness' },
    28: { name: 'Embracing the Dark Side',         shadow: 'Purposelessness', gift: 'Totality',         siddhi: 'Immortality' },
    29: { name: 'Leaping into the Void',           shadow: 'Half-heartedness', gift: 'Commitment',      siddhi: 'Devotion' },
    30: { name: 'Celestial Fire',                  shadow: 'Desire',          gift: 'Lightness',        siddhi: 'Rapture' },
    31: { name: 'Sounding Your Truth',             shadow: 'Arrogance',       gift: 'Leadership',       siddhi: 'Humility' },
    32: { name: 'Ancestral Reverence',             shadow: 'Failure',         gift: 'Preservation',     siddhi: 'Veneration' },
    33: { name: 'The Final Revelation',            shadow: 'Forgetting',      gift: 'Mindfulness',      siddhi: 'Revelation' },
    34: { name: 'The Beauty of the Beast',         shadow: 'Force',           gift: 'Strength',         siddhi: 'Majesty' },
    35: { name: 'Wormholes and Miracles',          shadow: 'Hunger',          gift: 'Adventure',        siddhi: 'Boundlessness' },
    36: { name: 'Becoming Human',                  shadow: 'Turbulence',      gift: 'Humanity',         siddhi: 'Compassion' },
    37: { name: 'Family Alchemy',                  shadow: 'Weakness',        gift: 'Equality',         siddhi: 'Tenderness' },
    38: { name: 'The Warrior of Light',            shadow: 'Struggle',        gift: 'Perseverance',     siddhi: 'Honour' },
    39: { name: 'The Tension of Transcendence',    shadow: 'Provocation',     gift: 'Dynamism',         siddhi: 'Liberation' },
    40: { name: 'The Will to Surrender',           shadow: 'Exhaustion',      gift: 'Resolve',          siddhi: 'Divine Will' },
    41: { name: 'The Prime Emanation',             shadow: 'Fantasy',         gift: 'Anticipation',     siddhi: 'Emanation' },
    42: { name: 'Letting Go of Living and Dying',  shadow: 'Expectation',     gift: 'Detachment',       siddhi: 'Celebration' },
    43: { name: 'Breakthrough',                    shadow: 'Deafness',        gift: 'Insight',          siddhi: 'Epiphany' },
    44: { name: 'Karmic Relationships',            shadow: 'Interference',    gift: 'Teamwork',         siddhi: 'Synarchy' },
    45: { name: 'Cosmic Communion',                shadow: 'Dominance',       gift: 'Synergy',          siddhi: 'Communion' },
    46: { name: 'A Science of Luck',               shadow: 'Seriousness',     gift: 'Delight',          siddhi: 'Ecstasy' },
    47: { name: 'Transmuting the Past',            shadow: 'Oppression',      gift: 'Transmutation',    siddhi: 'Transfiguration' },
    48: { name: 'The Wonder of Uncertainty',       shadow: 'Inadequacy',      gift: 'Resourcefulness',  siddhi: 'Wisdom' },
    49: { name: 'Changing the World from the Inside', shadow: 'Reaction',     gift: 'Revolution',       siddhi: 'Rebirth' },
    50: { name: 'Cosmic Order',                    shadow: 'Corruption',      gift: 'Equilibrium',      siddhi: 'Harmony' },
    51: { name: 'Initiative through Initiation',   shadow: 'Agitation',       gift: 'Initiative',       siddhi: 'Awakening' },
    52: { name: 'The Stillpoint',                  shadow: 'Stress',          gift: 'Restraint',        siddhi: 'Stillness' },
    53: { name: 'Evolving Beyond Evolution',       shadow: 'Immaturity',      gift: 'Expansion',        siddhi: 'Superabundance' },
    54: { name: 'The Serpent Path',                shadow: 'Greed',           gift: 'Aspiration',       siddhi: 'Ascension' },
    55: { name: 'The Dragonfly’s Dream',      shadow: 'Victimisation',   gift: 'Freedom',          siddhi: 'Freedom' },
    56: { name: 'Divine Indulgence',               shadow: 'Distraction',     gift: 'Enrichment',       siddhi: 'Intoxication' },
    57: { name: 'A Gentle Wind',                   shadow: 'Unease',          gift: 'Intuition',        siddhi: 'Clarity' },
    58: { name: 'From Stress to Bliss',            shadow: 'Dissatisfaction', gift: 'Vitality',         siddhi: 'Bliss' },
    59: { name: 'The Dragon in Your Genome',       shadow: 'Dishonesty',      gift: 'Intimacy',         siddhi: 'Transparency' },
    60: { name: 'The Cracking of the Vessel',      shadow: 'Limitation',      gift: 'Realism',          siddhi: 'Justice' },
    61: { name: 'The Holy of Holies',              shadow: 'Psychosis',       gift: 'Inspiration',      siddhi: 'Sanctity' },
    62: { name: 'The Language of Light',           shadow: 'Intellect',       gift: 'Precision',        siddhi: 'Impeccability' },
    63: { name: 'Reaching the Source',             shadow: 'Doubt',           gift: 'Inquiry',          siddhi: 'Truth' },
    64: { name: 'An Aurora on the Mental Plane',   shadow: 'Confusion',       gift: 'Imagination',      siddhi: 'Illumination' },
  };

  const SEGMENT = 360 / 64; // 5.625°
  const rad = d => d * Math.PI / 180;
  const norm = d => ((d % 360) + 360) % 360;

  // Sun's apparent ecliptic longitude at 12:00 UTC on the given ISO date.
  function solarLongitude(isoDate) {
    const [y, mo, d] = String(isoDate).split('-').map(Number);
    const ms = Date.UTC(y, mo - 1, d, 12, 0, 0);
    const jd = ms / 86400000 + 2440587.5;
    const n = jd - 2451545.0;
    const L = 280.460 + 0.9856474 * n;
    const g = rad(357.528 + 0.9856003 * n);
    return norm(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
  }

  function keyAt(lambda) {
    const idx = Math.floor(norm(lambda - WHEEL_OFFSET) / SEGMENT);
    return WHEEL[idx];
  }

  // The four Prime Gifts. Radiance uses 88° of solar arc before birth (the
  // prenatal design Sun), applied directly in longitude — date-only input
  // makes iterating an ephemeris backwards pointless precision.
  function primes(isoDate) {
    const sun = solarLongitude(isoDate);
    const design = norm(sun - 88);
    return {
      lifesWork: { key: keyAt(sun),              lambda: sun },
      evolution: { key: keyAt(norm(sun + 180)),  lambda: norm(sun + 180) },
      radiance:  { key: keyAt(design),           lambda: design },
      purpose:   { key: keyAt(norm(design + 180)), lambda: norm(design + 180) },
    };
  }

  const api = { solarLongitude, keyAt, primes, KEYS, WHEEL, WHEEL_OFFSET, SEGMENT };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DGeneKeys = api;
})(typeof window !== 'undefined' ? window : globalThis);
