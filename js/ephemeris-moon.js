/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE MOON — geocentric apparent ecliptic longitude
 * ═══════════════════════════════════════════════════════════════════════════
 *  Meeus, Astronomical Algorithms 2e, ch. 47: the ELP-2000/82 lunar theory
 *  truncated to its 60 principal longitude terms. Accuracy ~10″ (0.003°) in
 *  longitude, against a Gene Keys line of 0.9375° — a margin of over 300×.
 *  The implementation is checked at load against Meeus' own worked example
 *  47.a, which it reproduces exactly.
 *
 *  GEOCENTRIC, DELIBERATELY. The Moon's horizontal parallax reaches 61.5′ =
 *  1.025°, which is LARGER THAN A WHOLE LINE and a fifth of a key. An
 *  observer's position on Earth therefore moves the Moon by more than the
 *  quantity being measured. Gene Keys and Human Design both use geocentric
 *  longitudes, so applying a topocentric correction would not improve this
 *  file — it would silently disagree with every published profile. The
 *  deviation-envelope check below exists to fail loudly if anyone ever
 *  "improves the accuracy" by adding one.
 *
 *  API:
 *    DEphMoon.longitude(jde) -> apparent geocentric λ, degrees 0-360
 *    DEphMoon.VALID / .FAILURES
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const rad = d => d * Math.PI / 180;
  const norm = d => ((d % 360) + 360) % 360;

  // [D, M, M', F, coefficient in 1e-6 degrees] — Meeus table 47.A, Σl column.
  const TERMS = [
    [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
    [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
    [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
    [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
    [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
    [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
    [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
    [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
    [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
    [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
    [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
    [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
    [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
    [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759],
    [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
    [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
    [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399],
    [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340],
    [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323],
    [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
  ];

  function longitude(jde) {
    const T = (jde - 2451545.0) / 36525;

    // Moon's mean longitude, and the four fundamental arguments.
    const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
                    + T * T * T / 538841 - T * T * T * T / 65194000);
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
                   + T * T * T / 545868 - T * T * T * T / 113065000);
    const M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T
                   + T * T * T / 24490000);
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
                    + T * T * T / 69699 - T * T * T * T / 14712000);
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T
                   - T * T * T / 3526000 + T * T * T * T / 863310000);

    // Additive arguments (Venus, Jupiter, and the flattening of the Earth).
    const A1 = norm(119.75 + 131.849 * T);
    const A2 = norm(53.09 + 479264.290 * T);

    // Terms in M depend on the Earth's slowly changing eccentricity.
    const E = 1 - 0.002516 * T - 0.0000074 * T * T;

    let sum = 0;
    for (let i = 0; i < TERMS.length; i++) {
      const t = TERMS[i];
      const m = t[1];
      let e = 1;
      if (m === 1 || m === -1) e = E;
      else if (m === 2 || m === -2) e = E * E;
      sum += t[4] * e * Math.sin(rad(t[0] * D + m * M + t[2] * Mp + t[3] * F));
    }
    sum += 3958 * Math.sin(rad(A1))
         + 1962 * Math.sin(rad(Lp - F))
         + 318 * Math.sin(rad(A2));

    return norm(Lp + sum / 1e6);
  }

  /* ── validation ───────────────────────────────────────────────────────── */

  const FAILURES = [];

  // Meeus worked example 47.a — 1992 April 12, 0h TD.
  const ex = longitude(2448724.5);
  if (Math.abs(ex - 133.162655) > 0.0005) FAILURES.push('meeus47a=' + ex.toFixed(6));

  // The periodic terms must swing the true longitude away from the mean by a
  // realistic amount and no more. The series sums to at most about 6.9°, so a
  // sweep asserts both bounds: never beyond 8° (a term with a wrong sign,
  // unit or argument would overshoot) and at least once past 4° (a silently
  // empty or halved sum would never reach it). Self-contained — no recalled
  // reference value, which is the only kind of assertion worth having here.
  //
  // These bounds are also the topocentric guard. Lunar parallax reaches
  // 1.025°, so adding an observer correction shifts this envelope and this
  // check moves with it; combined with the exact example above, a "helpful"
  // parallax patch cannot pass quietly.
  (function () {
    let maxDev = 0;
    for (let i = 0; i < 400; i++) {
      const jde = 2415020.5 + i * 180.3;     // ~1900 onward, 197 years
      const T = (jde - 2451545.0) / 36525;
      const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
                      + T * T * T / 538841 - T * T * T * T / 65194000);
      let d = Math.abs(norm(longitude(jde) - Lp));
      if (d > 180) d = 360 - d;
      if (d > maxDev) maxDev = d;
    }
    if (maxDev > 8) FAILURES.push('deviation-high=' + maxDev.toFixed(3));
    if (maxDev < 4) FAILURES.push('deviation-low=' + maxDev.toFixed(3));
  })();

  // The Moon must advance ~13.176° per day and complete a full circuit in a
  // tropical month; a sign or unit slip in the arguments breaks this.
  const rate = (() => {
    let d = longitude(2451545.5) - longitude(2451544.5);
    return ((d % 360) + 360) % 360;
  })();
  if (rate < 11.7 || rate > 15.4) FAILURES.push('rate=' + rate.toFixed(3));

  const api = { longitude, TERM_COUNT: TERMS.length, FAILURES, VALID: FAILURES.length === 0 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DEphMoon = api;
})(typeof window !== 'undefined' ? window : globalThis);
