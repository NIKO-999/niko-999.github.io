/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  VENUS · MARS · JUPITER — geocentric apparent ecliptic longitude
 * ═══════════════════════════════════════════════════════════════════════════
 *  Keplerian elements with secular rates (JPL, "Approximate Positions of the
 *  Planets", the 1800-2050 set), solved for the eccentric anomaly and reduced
 *  from heliocentric to geocentric with a light-time iteration.
 *
 *  WHY THIS AND NOT VSOP87. A truncated VSOP87 would be an order of magnitude
 *  finer, but it is ~900 coefficients that this environment cannot fetch from
 *  a primary source — and coefficients typed from memory are exactly the kind
 *  of data that is silently wrong. These elements are few enough to state
 *  confidently AND to check against events whose dates are independently
 *  known, which is worth more here than unverifiable precision.
 *
 *  ACCURACY, heliocentric longitude, 1800-2050: Venus ~8″, Earth ~6″,
 *  Mars ~25″, Jupiter ~333″. Geocentric error is larger, roughly by R⊕/Δ —
 *  worst at Mars opposition (~2.7x) and mild for Jupiter. Practical bound:
 *
 *      Venus   ~0.005°     Mars   ~0.02°     Jupiter  ~0.11°
 *
 *  against a key of 5.625° and a line of 0.9375°. Every body clears the key
 *  by 50x or better. Jupiter clears the LINE by only about 8x, so callers are
 *  given the error bar per body (see ERROR_DEG) and the UI declines to state
 *  a line when the longitude sits inside it. Being visibly unsure at a
 *  boundary is worth more than a confident coin flip.
 *
 *  VALIDATED AGAINST EVENTS, not against recalled coordinates. At an
 *  opposition the geocentric longitude is exactly 180° from the Sun's; at an
 *  inferior conjunction it equals it. The 2004 and 2012 transits of Venus and
 *  the 2003 and 2020 Mars oppositions have dates known to the day, so
 *  reproducing them pins the elements, the Kepler solve and the geocentric
 *  reduction all at once.
 *
 *  API:
 *    DEphPlanets.longitude(body, jde) -> geocentric λ, degrees   body:
 *                                        'venus' | 'mars' | 'jupiter'
 *    DEphPlanets.sunLongitude(jde)    -> the Sun, from the same Earth element
 *                                        set, for internal consistency
 *    DEphPlanets.ERROR_DEG            -> { venus, mars, jupiter }
 *    DEphPlanets.VALID / .FAILURES
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;
  const norm = d => ((d % 360) + 360) % 360;

  // a (AU), e, I (°), L (°), longPeri ϖ (°), longNode Ω (°)
  // and the per-century rate of each, in the same units.
  const EL = {
    earth: {
      el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
      rt: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
    },
    venus: {
      el: [0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255],
      rt: [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418],
    },
    mars: {
      el: [1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
      rt: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
    },
    jupiter: {
      el: [5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
      rt: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
    },
  };

  const ERROR_DEG = { venus: 0.005, mars: 0.02, jupiter: 0.11, sun: 0.002 };

  // Heliocentric rectangular ecliptic coordinates, J2000 frame.
  function helio(body, jde) {
    const P = EL[body];
    const T = (jde - 2451545.0) / 36525;
    const a = P.el[0] + P.rt[0] * T;
    const e = P.el[1] + P.rt[1] * T;
    const I = rad(P.el[2] + P.rt[2] * T);
    const L = P.el[3] + P.rt[3] * T;
    const peri = P.el[4] + P.rt[4] * T;
    const node = rad(P.el[5] + P.rt[5] * T);

    const w = rad(P.el[4] + P.rt[4] * T) - node;      // argument of perihelion
    let M = norm(L - peri);
    if (M > 180) M -= 360;
    const Mr = rad(M);

    // Kepler's equation, Newton-Raphson. e is small for all three bodies, so
    // this converges in a handful of steps from E = M.
    let E = Mr + e * Math.sin(Mr);
    for (let i = 0; i < 12; i++) {
      const dE = (E - e * Math.sin(E) - Mr) / (1 - e * Math.cos(E));
      E -= dE;
      if (Math.abs(dE) < 1e-12) break;
    }

    // Position in the orbital plane, then rotated into the ecliptic.
    const xv = a * (Math.cos(E) - e);
    const yv = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const cw = Math.cos(w), sw = Math.sin(w);
    const cn = Math.cos(node), sn = Math.sin(node);
    const ci = Math.cos(I), si = Math.sin(I);
    const xp = cw * xv - sw * yv;
    const yp = sw * xv + cw * yv;
    return {
      x: xp * cn - yp * ci * sn,
      y: xp * sn + yp * ci * cn,
      z: yp * si,
    };
  }

  const LIGHT = 0.0057755183;                    // days per AU

  /* FRAME. These elements are referred to the J2000 mean ecliptic and equinox
     — a fixed frame. Gene Keys longitudes are tropical, measured from the
     equinox OF DATE, which is what ties DGeneKeys.WHEEL_OFFSET to 0° Aries.
     The two differ by general precession in longitude, about 1.4° per
     century, so leaving it out would drift the whole chart by a quarter of a
     key by 2100. Caught by comparing this file's Sun against the independent
     Meeus series in js/gk-profile.js, which agreed to exactly the precession
     and nothing else. */
  function precession(jde) {
    const T = (jde - 2451545.0) / 36525;
    return (5029.0966 * T + 1.11113 * T * T - 0.000006 * T * T * T) / 3600;
  }

  // Geocentric ecliptic longitude, with the planet taken at the time its
  // light left it. Three passes converge well below the element error.
  function longitude(body, jde) {
    const E = helio('earth', jde);
    let t = jde, p = helio(body, jde), dx, dy, dz, d = 0;
    for (let i = 0; i < 3; i++) {
      dx = p.x - E.x; dy = p.y - E.y; dz = p.z - E.z;
      d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      t = jde - LIGHT * d;
      p = helio(body, t);
    }
    dx = p.x - E.x; dy = p.y - E.y;
    return norm(deg(Math.atan2(dy, dx)) + precession(jde));
  }

  // The Sun as seen from Earth is the Earth's heliocentric position + 180°.
  // Derived from the same element set so the opposition and conjunction
  // checks below test the planets, not a mismatch between two solar theories.
  function sunLongitude(jde) {
    const E = helio('earth', jde);
    return norm(deg(Math.atan2(E.y, E.x)) + 180 + precession(jde));
  }

  /* ── validation ───────────────────────────────────────────────────────────
     Every check is an EVENT with an independently known date, so nothing here
     depends on a coordinate recalled from memory. Elongation is the observable:
     0° at inferior conjunction, 180° at opposition.                         */

  const FAILURES = [];
  const elong = (body, jde) => {
    let d = norm(longitude(body, jde) - sunLongitude(jde));
    return d > 180 ? d - 360 : d;
  };

  // Find the extremum of |elongation| nearest a known event date by scanning
  // a window, then report how far the computed event falls from the real one.
  function eventOffsetDays(body, isoDate, target) {
    const jd0 = Date.parse(isoDate + 'T00:00:00Z') / 86400000 + 2440587.5;
    let best = null, bestErr = Infinity;
    for (let d = -12; d <= 12; d += 0.02) {
      const e = Math.abs(Math.abs(elong(body, jd0 + d)) - target);
      if (e < bestErr) { bestErr = e; best = d; }
    }
    return best;
  }

  [
    // Transits of Venus — inferior conjunction to the day, and famous enough
    // that the dates are not in doubt.
    ['venus', '2004-06-08', 0, 1.0],
    ['venus', '2012-06-06', 0, 1.0],
    // Mars oppositions.
    ['mars', '2003-08-28', 180, 1.5],
    ['mars', '2020-10-13', 180, 1.5],
    // Jupiter opposition.
    ['jupiter', '2022-09-26', 180, 2.0],
  ].forEach(([body, iso, target, tolDays]) => {
    const off = eventOffsetDays(body, iso, target);
    if (off === null || Math.abs(off) > tolDays) {
      FAILURES.push(body + ':' + iso + ':off=' + (off === null ? 'none' : off.toFixed(2)) + 'd');
    }
  });

  // Structural: each planet must complete a full heliocentric circuit in its
  // own sidereal period, which catches a rate typo that events alone might not.
  [['venus', 224.701], ['mars', 686.980], ['jupiter', 4332.59]].forEach(([b, per]) => {
    const h0 = helio(b, 2451545.0), h1 = helio(b, 2451545.0 + per);
    const a0 = deg(Math.atan2(h0.y, h0.x)), a1 = deg(Math.atan2(h1.y, h1.x));
    let d = Math.abs(norm(a1 - a0));
    if (d > 180) d = 360 - d;
    if (d > 1.0) FAILURES.push(b + ':period-drift=' + d.toFixed(3));
  });

  // The Sun computed here must agree with the independent Meeus series used
  // for the Activation spheres. They share no code and no coefficients, so
  // agreement across two centuries is strong evidence both are right — and it
  // is what surfaced the missing precession in the first place.
  if (root.DGKProfile || typeof require === 'function') {
    try {
      const other = root.DGKProfile
        || (typeof require === 'function' ? require('./gk-profile.js') : null);
      if (other && other.sunLongitude) {
        let mx = 0;
        for (let i = 0; i < 300; i++) {
          const jde = 2415020.5 + i * 240;
          let d = Math.abs(norm(sunLongitude(jde) - other.sunLongitude(jde)));
          if (d > 180) d = 360 - d;
          if (d > mx) mx = d;
        }
        if (mx > 0.05) FAILURES.push('sun-vs-meeus=' + mx.toFixed(4));
      }
    } catch (e) { /* gk-profile absent: skip, this check is a bonus */ }
  }

  const api = {
    longitude, sunLongitude, helio, elong, eventOffsetDays, precession,
    ERROR_DEG, FAILURES, VALID: FAILURES.length === 0,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DEphPlanets = api;
})(typeof window !== 'undefined' ? window : globalThis);
