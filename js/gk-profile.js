/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS PROFILE — instants, lines, and the prenatal moment
 * ═══════════════════════════════════════════════════════════════════════════
 *  js/gene-keys.js is FROZEN. It is shared with tree-of-life.html, it answers
 *  the question it was written for — four keys from a date — and every one of
 *  its answers must keep coming out the same. This file sits on top of it and
 *  adds the three things a birth time makes possible:
 *
 *    · a solar longitude at a real INSTANT rather than at noon UTC;
 *    · the LINE, 1-6, the sixth of a key a position falls in;
 *    · the true PRENATAL INSTANT, found by solving for when the Sun was 88°
 *      back, which is what the design-side planets will need.
 *
 *  ACCURACY. The Sun here uses Meeus ch. 25 with the full equation of centre,
 *  good to about 0.01°. A key spans 5.625° and a line 0.9375°, so that is a
 *  94x margin on the finer of the two — comfortable, but not infinite. Rather
 *  than pretend otherwise, keyLine() reports how close the longitude sits to
 *  its nearest boundary, and the UI says so when it is inside the error bar.
 *
 *  CROSS-ENGINE CHECK. Given a bare date this file must reproduce
 *  DGeneKeys.primes() exactly, or somebody's four keys would quietly change.
 *  That is asserted at load, not assumed.
 *
 *  API:
 *    DGKProfile.sunLongitude(jde)     -> apparent geocentric λ, degrees
 *    DGKProfile.keyLine(lambda)       -> { key, line, lambda, toBoundary }
 *    DGKProfile.designInstant(ms)     -> ms, the moment the Sun was 88° back
 *    DGKProfile.profile(input)        -> { precision, personalityMs, designMs,
 *                                          spheres, notes }
 *        input: { ms } for a real instant, or { iso } for a legacy date
 *    DGKProfile.VALID / .FAILURES
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const GK = root.DGeneKeys || (typeof require === 'function' ? require('./gene-keys.js') : null);
  const AT = root.DAstroTime || (typeof require === 'function' ? require('./astro-time.js') : null);

  const DAY = 86400000;
  const rad = d => d * Math.PI / 180;
  const norm = d => ((d % 360) + 360) % 360;
  // signed difference a-b folded into (-180, 180]
  const diff = (a, b) => { let x = norm(a - b); return x > 180 ? x - 360 : x; };

  const LINES = 6;
  const LINE_DEG = GK.SEGMENT / LINES;          // 0.9375°
  const SUN_ERR = 0.01;                          // stated accuracy of the series

  /* ── the Sun ──────────────────────────────────────────────────────────────
     Meeus, Astronomical Algorithms ch. 25: mean longitude, mean anomaly, the
     three-term equation of centre, then the correction from true to apparent
     longitude via the Moon's ascending node.                                */
  function sunLongitude(jde) {
    const T = (jde - 2451545.0) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const Mr = rad(M);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
            + 0.000289 * Math.sin(3 * Mr);
    const trueLon = L0 + C;
    const omega = 125.04 - 1934.136 * T;
    return norm(trueLon - 0.00569 - 0.00478 * Math.sin(rad(omega)));
  }

  const sunAt = ms => sunLongitude(AT.jdeFromMs(ms));

  /* ── key and line ─────────────────────────────────────────────────────── */

  function keyLine(lambda) {
    const off = norm(lambda - GK.WHEEL_OFFSET);
    const idx = Math.floor(off / GK.SEGMENT);
    const within = off - idx * GK.SEGMENT;              // 0 .. 5.625
    const line = Math.min(LINES, Math.floor(within / LINE_DEG) + 1);
    const intoLine = within - (line - 1) * LINE_DEG;
    return {
      key: GK.WHEEL[idx],
      line,
      lambda: norm(lambda),
      // distance to the nearest line edge, which is always the nearer of the
      // two boundaries that matter — a key edge is also a line edge
      toBoundary: Math.min(intoLine, LINE_DEG - intoLine),
    };
  }

  /* ── the prenatal instant ─────────────────────────────────────────────────
     Solve λ☉(t) = λ☉(birth) − 88°. The Sun's longitude is strictly increasing
     — it never retrogrades — so a sign change inside the bracket is
     guaranteed and bisection cannot fail. 88° takes between 86.3 and 92.3
     days depending on where in the orbit it falls; the bracket carries a few
     days of slack either side and the sign change is ASSERTED, because an
     unbracketed Newton on a wrapped angle can walk a whole year.            */
  function designInstant(ms) {
    const target = norm(sunAt(ms) - 88);
    const f = t => diff(sunAt(t), target);
    let lo = ms - 95 * DAY, hi = ms - 83 * DAY;
    let flo = f(lo), fhi = f(hi);
    if (!(flo < 0 && fhi > 0)) return null;             // caller falls back
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if (fm < 0) { lo = mid; flo = fm; } else { hi = mid; fhi = fm; }
      if (hi - lo < 1) break;                           // 1 ms
    }
    return Math.round((lo + hi) / 2);
  }

  /* ── the profile ──────────────────────────────────────────────────────── */

  // The four Activation spheres. The rest arrive with the planetary ephemeris;
  // this table is the part that needs only the Sun.
  const SPHERES = [
    { id: 'lifesWork', label: "Life's Work", chart: 'personality', body: 'sun' },
    { id: 'evolution', label: 'Evolution', chart: 'personality', body: 'earth' },
    { id: 'radiance', label: 'Radiance', chart: 'design', body: 'sun' },
    { id: 'purpose', label: 'Purpose', chart: 'design', body: 'earth' },
  ];

  function profile(input) {
    const notes = [];
    let personalityMs, precision;

    if (input && typeof input.ms === 'number') {
      personalityMs = input.ms;
      precision = 'instant';
    } else {
      // Legacy date-only path. Pinned to 12:00 UTC exactly as js/gene-keys.js
      // does, so an old shared link keeps producing the keys it always did.
      const [y, mo, d] = String(input.iso).split('-').map(Number);
      personalityMs = Date.UTC(y, mo - 1, d, 12, 0, 0);
      precision = 'date';
      notes.push('No birth time: computed at 12:00 UTC, so the line is not determined.');
    }

    const sun = sunAt(personalityMs);
    let designMs = designInstant(personalityMs);
    let designSun;
    if (designMs === null) {
      designSun = norm(sun - 88);
      notes.push('Prenatal instant did not converge; design keys use 88° of arc directly.');
    } else {
      designSun = sunAt(designMs);
    }

    const at = { sun, earth: norm(sun + 180) };
    const dat = { sun: designSun, earth: norm(designSun + 180) };
    const spheres = Object.create(null);
    SPHERES.forEach(s => {
      const lam = (s.chart === 'design' ? dat : at)[s.body];
      const kl = keyLine(lam);
      spheres[s.id] = {
        key: kl.key,
        line: precision === 'instant' ? kl.line : null,
        lambda: kl.lambda,
        toBoundary: kl.toBoundary,
        // honest about the error bar rather than quietly confident
        nearBoundary: kl.toBoundary < SUN_ERR,
        label: s.label, chart: s.chart, body: s.body,
      };
    });

    return { precision, personalityMs, designMs, spheres, notes };
  }

  /* ── validation ─────────────────────────────────────────────────────────── */

  const FAILURES = [];

  // Meeus worked example 25.a: 1992 October 13.0 TD -> apparent λ 199.90895°
  if (Math.abs(sunLongitude(2448908.5) - 199.90895) > 0.001) {
    FAILURES.push('sun:meeus25a=' + sunLongitude(2448908.5).toFixed(5));
  }

  // Lines must tile a key exactly: six of them, each LINE_DEG wide.
  (function () {
    const base = GK.WHEEL_OFFSET + 3 * GK.SEGMENT;
    for (let l = 1; l <= LINES; l++) {
      const mid = base + (l - 0.5) * LINE_DEG;
      if (keyLine(mid).line !== l) { FAILURES.push('line:tile' + l); break; }
    }
    if (keyLine(base + 1e-9).line !== 1 || keyLine(base + GK.SEGMENT - 1e-9).line !== 6) {
      FAILURES.push('line:edges');
    }
  })();

  // THE cross-engine check: on a date, this engine must return exactly the
  // keys js/gene-keys.js returns, or existing profiles would silently change.
  ['1990-06-15', '1974-11-02', '2003-02-28'].forEach(iso => {
    const mine = profile({ iso }).spheres;
    const theirs = GK.primes(iso);
    ['lifesWork', 'evolution', 'radiance', 'purpose'].forEach(k => {
      if (mine[k].key !== theirs[k].key) FAILURES.push('xengine:' + iso + ':' + k);
    });
  });

  // The prenatal solve must land 88° back, and inside a sane number of days.
  (function () {
    const ms = Date.UTC(1990, 5, 15, 12);
    const t = designInstant(ms);
    if (t === null) { FAILURES.push('design:noconverge'); return; }
    if (Math.abs(diff(sunAt(t), sunAt(ms) - 88)) > 1e-6) FAILURES.push('design:arc');
    const days = (ms - t) / DAY;
    if (days < 86 || days > 93) FAILURES.push('design:days=' + days.toFixed(2));
  })();

  const api = {
    sunLongitude, sunAt, keyLine, designInstant, profile,
    SPHERES, LINE_DEG, SUN_ERR,
    FAILURES, VALID: FAILURES.length === 0,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DGKProfile = api;
})(typeof window !== 'undefined' ? window : globalThis);
