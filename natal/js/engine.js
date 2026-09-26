/*
 * Natal chart engine.
 * Positions come from astronomy-engine (VSOP87 / ELP-based, arc-second level),
 * Chiron from an n-body integrated state table, everything else (houses,
 * nodes, Lilith, lots, aspects) is computed here.
 */
(function (global) {
  "use strict";
  const A = global.Astronomy;
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;
  const norm = (d) => ((d % 360) + 360) % 360;
  const sind = (d) => Math.sin(d * D2R);
  const cosd = (d) => Math.cos(d * D2R);
  const tand = (d) => Math.tan(d * D2R);
  const atan2d = (y, x) => Math.atan2(y, x) * R2D;
  const asind = (x) => Math.asin(Math.max(-1, Math.min(1, x))) * R2D;
  /** Signed smallest difference b - a in (-180, 180]. */
  const diff = (a, b) => {
    let d = norm(b - a);
    return d > 180 ? d - 360 : d;
  };

  const SIGN_KEYS = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
  ];

  const BODY = {
    mercury: "Mercury", venus: "Venus", mars: "Mars", jupiter: "Jupiter",
    saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
  };

  function julianDay(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }
  function centuries(date) {
    return (julianDay(date) - 2451545.0) / 36525;
  }

  /* ---------- lunar points (Meeus, Astronomical Algorithms ch. 47) ---------- */
  function meanNode(date) {
    const T = centuries(date);
    let n = norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T * T * T) / 467441 - (T ** 4) / 60616000);
    const C = global.NODE_CORR; // small table aligning with the Swiss Ephemeris mean node
    if (C) {
      const f = (julianDay(date) - C.jd0) / C.step, i = Math.floor(f);
      if (i >= 0 && i < C.v.length - 1) n = norm(n + (C.v[i] + (C.v[i + 1] - C.v[i]) * (f - i)) / 6000);
    }
    return n;
  }
  /** True (osculating) node: where the Moon's instantaneous orbital plane crosses the ecliptic of date. */
  function trueNode(date) {
    const t = A.MakeTime(date);
    const st = A.GeoMoonState(t);
    const rot = A.Rotation_EQJ_ECT(t);
    const r = A.RotateVector(rot, new A.Vector(st.x, st.y, st.z, t));
    const v = A.RotateVector(rot, new A.Vector(st.vx, st.vy, st.vz, t));
    const hx = r.y * v.z - r.z * v.y, hy = r.z * v.x - r.x * v.z;
    return norm(Math.atan2(hx, -hy) * R2D);
  }
  /** Mean Black Moon Lilith = mean lunar apogee. */
  function meanLilith(date) {
    const T = centuries(date);
    const perigee = 83.3532465 + 4069.0137287 * T - 0.01032 * T * T - (T ** 3) / 80053 + (T ** 4) / 18999000;
    let lil = norm(perigee + 180);
    const C = global.LILITH_CORR;
    if (C) {
      const f = (julianDay(date) - C.jd0) / C.step, i = Math.floor(f);
      if (i >= 0 && i < C.v.length - 1) lil = norm(lil + (C.v[i] + (C.v[i + 1] - C.v[i]) * (f - i)) / 6000);
    }
    return lil;
  }

  /* ---------- Chiron from integrated state table ---------- */
  const GM_SUN = 0.01720209895 ** 2;
  function keplerPropagate(state, dtDays) {
    const [x, y, z, vx, vy, vz] = state;
    const r = Math.hypot(x, y, z);
    const v2 = vx * vx + vy * vy + vz * vz;
    const a = 1 / (2 / r - v2 / GM_SUN);
    const hx = y * vz - z * vy, hy = z * vx - x * vz, hz = x * vy - y * vx;
    const h = Math.hypot(hx, hy, hz);
    const rv = x * vx + y * vy + z * vz;
    // eccentricity vector
    const ex = (vy * hz - vz * hy) / GM_SUN - x / r;
    const ey = (vz * hx - vx * hz) / GM_SUN - y / r;
    const ez = (vx * hy - vy * hx) / GM_SUN - z / r;
    const e = Math.hypot(ex, ey, ez);
    const E0 = Math.atan2(rv / Math.sqrt(GM_SUN * a), 1 - r / a);
    const M0 = E0 - e * Math.sin(E0);
    const n = Math.sqrt(GM_SUN / (a * a * a));
    const M = M0 + n * dtDays;
    let E = M;
    for (let k = 0; k < 30; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    // perifocal basis
    const Px = ex / e, Py = ey / e, Pz = ez / e;
    const Wx = hx / h, Wy = hy / h, Wz = hz / h;
    const Qx = Wy * Pz - Wz * Py, Qy = Wz * Px - Wx * Pz, Qz = Wx * Py - Wy * Px;
    const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    return [xp * Px + yp * Qx, xp * Py + yp * Qy, xp * Pz + yp * Qz];
  }
  function chironHelioEcl(date) {
    const tbl = global.CHIRON_TABLE;
    const yf = date.getUTCFullYear() + date.getUTCMonth() / 12;
    let y = Math.round(yf);
    y = Math.max(tbl.start, Math.min(tbl.start + tbl.rows.length - 1, y));
    const epoch = Date.UTC(y, 0, 1);
    const dt = (date.getTime() - epoch) / 86400000;
    return keplerPropagate(tbl.rows[y - tbl.start], dt);
  }
  let ROT_ECL_EQJ = null, ROT_EQJ_ECL = null;
  function chironLonLat(date) {
    if (!ROT_ECL_EQJ) {
      ROT_ECL_EQJ = A.Rotation_ECL_EQJ();
      ROT_EQJ_ECL = A.Rotation_EQJ_ECL();
    }
    const t = A.MakeTime(date);
    const earthEqj = A.HelioVector(A.Body.Earth, t);
    const earth = A.RotateVector(ROT_EQJ_ECL, earthEqj);
    let p = chironHelioEcl(date);
    // one light-time iteration
    const dist = Math.hypot(p[0] - earth.x, p[1] - earth.y, p[2] - earth.z);
    p = chironHelioEcl(new Date(date.getTime() - (dist / 173.1446) * 86400000));
    const geoEcl = new A.Vector(p[0] - earth.x, p[1] - earth.y, p[2] - earth.z, t);
    const geoEqj = A.RotateVector(ROT_ECL_EQJ, geoEcl);
    const ecl = A.Ecliptic(geoEqj);
    return { lon: norm(ecl.elon), lat: ecl.elat };
  }
  function chironInRange(date) {
    const y = date.getUTCFullYear();
    return y > 1850 && y < 2150;
  }

  /* ---------- raw longitudes ---------- */
  function rawLonLat(key, date, opts) {
    switch (key) {
      case "sun": {
        const s = A.SunPosition(date);
        return { lon: norm(s.elon), lat: s.elat };
      }
      case "moon": {
        const m = A.EclipticGeoMoon(date);
        return { lon: norm(m.lon), lat: m.lat };
      }
      case "northNode":
        return { lon: opts.nodeType === "mean" ? meanNode(date) : trueNode(date), lat: 0 };
      case "southNode": {
        const n = rawLonLat("northNode", date, opts);
        return { lon: norm(n.lon + 180), lat: 0 };
      }
      case "lilith":
        return { lon: meanLilith(date), lat: 0 };
      case "chiron":
        return chironLonLat(date);
      default: {
        const v = A.GeoVector(A.Body[BODY[key]], date, true);
        const e = A.Ecliptic(v);
        return { lon: norm(e.elon), lat: e.elat };
      }
    }
  }

  function meanObliquity(date) {
    const T = centuries(date);
    return 23.4392911 - (46.815 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  }
  function trueObliquity(date) {
    try {
      return A.e_tilt(A.MakeTime(date)).tobl;
    } catch (e) {
      return meanObliquity(date);
    }
  }
  /** Lahiri ayanamsa (approximation good to well under 1′ for 1800–2200). */
  function ayanamsa(date) {
    const yrs = (julianDay(date) - 2451545.0) / 365.25;
    return 23.85306 + (50.2788 * yrs + 0.000111 * yrs * yrs) / 3600;
  }

  /* ---------- houses ---------- */
  /** Ecliptic point rising at the eastern horizon for a given RAMC and pole height. */
  function ascFor(ramc, lat, eps) {
    return norm(atan2d(cosd(ramc), -(sind(ramc) * cosd(eps) + tand(lat) * sind(eps))));
  }
  function mcFor(ramc, eps) {
    return norm(atan2d(sind(ramc), cosd(ramc) * cosd(eps)));
  }
  // Swiss-Ephemeris-style Asc1(x) where x = RAMC + 90 for the ascendant.
  const asc1 = (x, lat, eps) => ascFor(x - 90, lat, eps);

  function raToLon(ra, eps) {
    return norm(atan2d(sind(ra), cosd(ra) * cosd(eps)));
  }

  function placidus(ramc, lat, eps) {
    const cusp = (F, above) => {
      let lon;
      let ra = above ? ramc + F * 90 : ramc + 180 - F * 90;
      for (let i = 0; i < 60; i++) {
        lon = raToLon(ra, eps);
        const dec = asind(sind(eps) * sind(lon));
        const x = tand(lat) * tand(dec);
        if (Math.abs(x) >= 1) return null;
        const ad = asind(x);
        const nra = above ? ramc + F * (90 + ad) : ramc + 180 - F * (90 - ad);
        if (Math.abs(diff(ra, nra)) < 1e-9) {
          ra = nra;
          break;
        }
        ra = nra;
      }
      return raToLon(ra, eps);
    };
    const c11 = cusp(1 / 3, true), c12 = cusp(2 / 3, true);
    const c2 = cusp(2 / 3, false), c3 = cusp(1 / 3, false);
    if ([c11, c12, c2, c3].some((c) => c === null || Number.isNaN(c))) return null;
    return { 11: c11, 12: c12, 2: c2, 3: c3 };
  }

  function koch(ramc, lat, eps, mc) {
    const decMc = asind(sind(eps) * sind(mc));
    const x = tand(lat) * tand(decMc);
    if (Math.abs(x) >= 1) return null;
    const ad3 = asind(x) / 3;
    return {
      11: asc1(ramc + 30 - 2 * ad3, lat, eps),
      12: asc1(ramc + 60 - ad3, lat, eps),
      2: asc1(ramc + 120 + ad3, lat, eps),
      3: asc1(ramc + 150 + 2 * ad3, lat, eps),
    };
  }

  function regiomontanus(ramc, lat, eps) {
    const f1 = Math.atan(tand(lat) * 0.5) * R2D;
    const f2 = Math.atan(tand(lat) * sind(60)) * R2D;
    return {
      11: asc1(ramc + 30, f1, eps),
      12: asc1(ramc + 60, f2, eps),
      2: asc1(ramc + 120, f2, eps),
      3: asc1(ramc + 150, f1, eps),
    };
  }

  // Topocentric (Polich-Page) and Campanus, as in Swiss Ephemeris houses.c
  function topocentric(ramc, lat, eps) {
    const f1 = Math.atan(tand(lat) / 3) * R2D, f2 = Math.atan((tand(lat) * 2) / 3) * R2D;
    return { 11: asc1(ramc + 30, f1, eps), 12: asc1(ramc + 60, f2, eps), 2: asc1(ramc + 120, f2, eps), 3: asc1(ramc + 150, f1, eps) };
  }
  function campanus(ramc, lat, eps) {
    const f1 = asind(sind(lat) / 2), f2 = asind((Math.sqrt(3) / 2) * sind(lat));
    const c = cosd(lat);
    const x1 = Math.atan(Math.sqrt(3) / c) * R2D, x2 = Math.atan(1 / Math.sqrt(3) / c) * R2D;
    return { 11: asc1(ramc + 90 - x1, f1, eps), 12: asc1(ramc + 90 - x2, f2, eps), 2: asc1(ramc + 90 + x2, f2, eps), 3: asc1(ramc + 90 + x1, f1, eps) };
  }

  function computeHouses(system, ramc, lat, eps) {
    let asc = ascFor(ramc, lat, eps);
    const mc = mcFor(ramc, eps);
    // Polar latitudes: keep the Ascendant in the eastern half (within 180° after the MC).
    if (norm(asc - mc) > 180) asc = norm(asc + 180);
    const cusps = new Array(13);
    let used = system;
    let q = null;
    if (system === "placidus") q = placidus(ramc, lat, eps);
    else if (system === "koch") q = koch(ramc, lat, eps, mc);
    else if (system === "regiomontanus") q = regiomontanus(ramc, lat, eps);
    else if (system === "topocentric") q = topocentric(ramc, lat, eps);
    else if (system === "campanus") q = campanus(ramc, lat, eps);

    if ((system === "placidus" || system === "koch") && !q) used = "porphyry";

    if (used === "equal") {
      for (let h = 1; h <= 12; h++) cusps[h] = norm(asc + (h - 1) * 30);
    } else if (used === "whole") {
      const start = Math.floor(asc / 30) * 30;
      for (let h = 1; h <= 12; h++) cusps[h] = norm(start + (h - 1) * 30);
    } else if (used === "porphyry") {
      const q1 = norm(asc - mc) / 3; // MC -> ASC (houses 10,11,12)
      const q2 = norm(mc + 180 - asc) / 3; // ASC -> IC (houses 1,2,3)
      cusps[10] = mc;
      cusps[11] = norm(mc + q1);
      cusps[12] = norm(mc + 2 * q1);
      cusps[1] = asc;
      cusps[2] = norm(asc + q2);
      cusps[3] = norm(asc + 2 * q2);
    } else {
      cusps[1] = asc;
      cusps[10] = mc;
      Object.assign(cusps, q);
    }
    if (used !== "equal" && used !== "whole") {
      cusps[4] = norm(cusps[10] + 180);
      cusps[5] = norm(cusps[11] + 180);
      cusps[6] = norm(cusps[12] + 180);
      cusps[7] = norm(cusps[1] + 180);
      cusps[8] = norm(cusps[2] + 180);
      cusps[9] = norm(cusps[3] + 180);
    }
    return { cusps, asc, mc, used };
  }

  function houseOf(lon, cusps) {
    for (let h = 1; h <= 12; h++) {
      const start = cusps[h];
      const end = cusps[h === 12 ? 1 : h + 1];
      const span = norm(end - start);
      if (norm(lon - start) < span) return h;
    }
    return 1;
  }

  /* ---------- dignities & degree lore ---------- */
  const DIGNITY = {
    sun: { dom: ["leo"], exalt: ["aries"], det: ["aquarius"], fall: ["libra"] },
    moon: { dom: ["cancer"], exalt: ["taurus"], det: ["capricorn"], fall: ["scorpio"] },
    mercury: { dom: ["gemini", "virgo"], exalt: ["virgo"], det: ["sagittarius", "pisces"], fall: ["pisces"] },
    venus: { dom: ["taurus", "libra"], exalt: ["pisces"], det: ["scorpio", "aries"], fall: ["virgo"] },
    mars: { dom: ["aries", "scorpio"], exalt: ["capricorn"], det: ["libra", "taurus"], fall: ["cancer"] },
    jupiter: { dom: ["sagittarius", "pisces"], exalt: ["cancer"], det: ["gemini", "virgo"], fall: ["capricorn"] },
    saturn: { dom: ["capricorn", "aquarius"], exalt: ["libra"], det: ["cancer", "leo"], fall: ["aries"] },
    uranus: { dom: ["aquarius"], exalt: ["scorpio"], det: ["leo"], fall: ["taurus"] },
    neptune: { dom: ["pisces"], exalt: ["cancer"], det: ["virgo"], fall: ["capricorn"] },
    pluto: { dom: ["scorpio"], exalt: ["aries"], det: ["taurus"], fall: ["libra"] },
  };
  function dignityOf(key, sign) {
    const d = DIGNITY[key];
    if (!d) return null;
    if (d.dom.includes(sign)) return "domicile";
    if (d.exalt.includes(sign)) return "exaltation";
    if (d.det.includes(sign)) return "detriment";
    if (d.fall.includes(sign)) return "fall";
    return null;
  }
  const MODE_OF = (i) => ["cardinal", "fixed", "mutable"][i % 3];
  function criticalDegree(signIdx, deg) {
    const d = Math.floor(deg);
    if (d === 29) return "anaretic";
    if (d === 0) return "initial";
    const mode = MODE_OF(signIdx);
    const crit = { cardinal: [13, 26], fixed: [8, 9, 21, 22], mutable: [4, 17] }[mode];
    return crit.includes(d) ? "critical" : null;
  }

  function splitLon(lon) {
    const signIdx = Math.floor(lon / 30) % 12;
    const within = lon - signIdx * 30;
    let deg = Math.floor(within);
    let min = Math.floor((within - deg) * 60);
    let sec = Math.round(((within - deg) * 60 - min) * 60);
    if (sec === 60) { sec = 0; min += 1; }
    if (min === 60) { min = 0; deg += 1; }
    return { signIdx, sign: SIGN_KEYS[signIdx], within, deg, min, sec, decan: Math.min(2, Math.floor(within / 10)) };
  }

  /* ---------- aspects ---------- */
  const ASPECTS = [
    { key: "conjunction", angle: 0, orb: 8, major: true, nature: "fusion" },
    { key: "opposition", angle: 180, orb: 8, major: true, nature: "tension" },
    { key: "trine", angle: 120, orb: 7, major: true, nature: "harmony" },
    { key: "square", angle: 90, orb: 7, major: true, nature: "tension" },
    { key: "sextile", angle: 60, orb: 5, major: true, nature: "harmony" },
    { key: "quincunx", angle: 150, orb: 3, major: false, nature: "adjust" },
    { key: "semisextile", angle: 30, orb: 2, major: false, nature: "harmony" },
    { key: "semisquare", angle: 45, orb: 2, major: false, nature: "tension" },
    { key: "sesquiquadrate", angle: 135, orb: 2, major: false, nature: "tension" },
    { key: "quintile", angle: 72, orb: 1.5, major: false, nature: "creative" },
    { key: "biquintile", angle: 144, orb: 1.5, major: false, nature: "creative" },
  ];
  const LIGHTS = new Set(["sun", "moon"]);
  const MINOR_POINTS = new Set(["northNode", "southNode", "chiron", "lilith", "fortune", "vertex"]);
  const ANGLES = new Set(["asc", "mc"]);

  function orbFor(asp, a, b, orbScale) {
    let orb = asp.orb;
    if (LIGHTS.has(a) || LIGHTS.has(b)) orb += asp.major ? 2 : 0.5;
    if (MINOR_POINTS.has(a) || MINOR_POINTS.has(b)) orb = Math.min(orb, asp.major ? 4 : 1);
    if (ANGLES.has(a) || ANGLES.has(b)) orb = Math.min(orb, asp.major ? 6 : 1.5);
    return orb * orbScale;
  }

  function findAspects(points, opts) {
    const list = [];
    const usable = points.filter((p) => p.key !== "southNode" && !(p.key === "fortune" && !opts.timeKnown));
    for (let i = 0; i < usable.length; i++) {
      for (let j = i + 1; j < usable.length; j++) {
        const p = usable[i], q = usable[j];
        if (ANGLES.has(p.key) && ANGLES.has(q.key)) continue;
        if (MINOR_POINTS.has(p.key) && MINOR_POINTS.has(q.key)) continue;
        const sep = Math.abs(diff(p.lon, q.lon));
        let best = null;
        for (const asp of ASPECTS) {
          if (!asp.major && !opts.minorAspects) continue;
          const orb = Math.abs(sep - asp.angle);
          const allowed = orbFor(asp, p.key, q.key, opts.orbScale || 1);
          if (orb <= allowed && (!best || orb < best.orb)) best = { asp, orb, allowed };
        }
        if (!best) continue;
        // applying if the separation is moving toward exactness
        const dt = 0.1;
        const sep2 = Math.abs(diff(p.lon + (p.speed || 0) * dt, q.lon + (q.speed || 0) * dt));
        const applying = Math.abs(sep2 - best.asp.angle) < best.orb;
        list.push({
          a: p.key, b: q.key, type: best.asp.key, nature: best.asp.nature, major: best.asp.major,
          angle: best.asp.angle, orb: best.orb, strength: 1 - best.orb / best.allowed, applying,
        });
      }
    }
    list.sort((x, y) => x.orb - y.orb);
    return list;
  }

  /* ---------- aspect patterns ---------- */
  function findPatterns(aspects, points) {
    const core = new Set(points.filter((p) => !MINOR_POINTS.has(p.key) || p.key === "northNode" || p.key === "chiron").map((p) => p.key));
    const has = (a, b, t) => aspects.some((x) => x.type === t && ((x.a === a && x.b === b) || (x.a === b && x.b === a)));
    const keys = [...core];
    const out = [];
    const seen = new Set();
    const add = (type, members, apex) => {
      const id = type + [...members].sort().join();
      if (seen.has(id)) return;
      seen.add(id);
      out.push({ type, members, apex });
    };
    for (let i = 0; i < keys.length; i++)
      for (let j = i + 1; j < keys.length; j++)
        for (let k = j + 1; k < keys.length; k++) {
          const [a, b, c] = [keys[i], keys[j], keys[k]];
          if (has(a, b, "trine") && has(b, c, "trine") && has(a, c, "trine")) add("grandTrine", [a, b, c]);
          for (const [x, y, apex] of [[a, b, c], [a, c, b], [b, c, a]]) {
            if (has(x, y, "opposition") && has(x, apex, "square") && has(y, apex, "square")) add("tSquare", [x, y, apex], apex);
            if (has(x, y, "sextile") && has(x, apex, "quincunx") && has(y, apex, "quincunx")) add("yod", [x, y, apex], apex);
          }
        }
    // grand cross: two oppositions squared to each other
    const opps = aspects.filter((x) => x.type === "opposition" && core.has(x.a) && core.has(x.b));
    for (let i = 0; i < opps.length; i++)
      for (let j = i + 1; j < opps.length; j++) {
        const o1 = opps[i], o2 = opps[j];
        if ([o1.a, o1.b].some((k) => k === o2.a || k === o2.b)) continue;
        if (has(o1.a, o2.a, "square") && has(o1.a, o2.b, "square") && has(o1.b, o2.a, "square") && has(o1.b, o2.b, "square"))
          add("grandCross", [o1.a, o1.b, o2.a, o2.b]);
      }
    return out;
  }

  /* ---------- time helpers ---------- */
  function tzOffsetMinutes(ts, tz) {
    const f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const p = {};
    for (const part of f.formatToParts(new Date(ts))) p[part.type] = part.value;
    const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return Math.round((asUtc - Math.floor(ts / 1000) * 1000) / 60000);
  }
  /** Local wall-clock time in an IANA zone -> UTC Date (handles historical DST via the browser tz database). */
  function zonedToUtc(y, mo, d, h, mi, tz) {
    const wall = Date.UTC(y, mo - 1, d, h, mi);
    let guess = wall;
    for (let i = 0; i < 4; i++) {
      const off = tzOffsetMinutes(guess, tz);
      const next = wall - off * 60000;
      if (next === guess) break;
      guess = next;
    }
    return { date: new Date(guess), offset: tzOffsetMinutes(guess, tz) };
  }

  /* ---------- main ---------- */
  const POINT_ORDER = [
    "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn",
    "uranus", "neptune", "pluto", "northNode", "southNode", "chiron", "lilith",
  ];

  /**
   * input: { utc: Date, lat, lon, timeKnown }
   * opts:  { houseSystem, nodeType, zodiac, minorAspects, orbScale }
   */
  function computeChart(input, opts) {
    opts = Object.assign({ houseSystem: "placidus", nodeType: "mean", zodiac: "tropical", minorAspects: true, orbScale: 1 }, opts);
    const date = input.utc;
    const timeKnown = input.timeKnown !== false;
    const eps = trueObliquity(date);
    const ayan = opts.zodiac === "sidereal" ? ayanamsa(date) : 0;
    const shift = (l) => norm(l - ayan);

    const points = [];
    for (const key of POINT_ORDER) {
      if (key === "chiron" && !chironInRange(date)) continue;
      const now = rawLonLat(key, date, opts);
      const before = rawLonLat(key, new Date(date.getTime() - 43200000), opts);
      const after = rawLonLat(key, new Date(date.getTime() + 43200000), opts);
      const speed = diff(before.lon, after.lon); // deg/day
      const lon = shift(now.lon);
      const dec = asind(sind(now.lat) * cosd(eps) + cosd(now.lat) * sind(eps) * sind(now.lon));
      points.push(Object.assign({ key, lon, lat: now.lat, speed, dec, retro: speed < 0 }, splitLon(lon)));
    }

    // angles & houses
    const gast = A.SiderealTime(date); // hours
    const ramc = norm(gast * 15 + input.lon);
    const hs = computeHouses(opts.houseSystem, ramc, input.lat, eps);
    const cusps = hs.cusps.map((c) => (c === undefined ? c : shift(c)));
    const asc = shift(hs.asc), mc = shift(hs.mc);
    const vtxLat = input.lat >= 0 ? 90 - input.lat : -90 - input.lat;
    let vertexRaw = asc1(ramc - 90, vtxLat, eps);
    // the Vertex always falls in the western half, within 90 degrees of the Descendant
    if (Math.abs(diff(hs.asc + 180, vertexRaw)) > 90) vertexRaw = norm(vertexRaw + 180);
    const vertex = shift(vertexRaw);

    const sun = points.find((p) => p.key === "sun");
    const moon = points.find((p) => p.key === "moon");
    const sunHouseRaw = houseOf(sun.lon, cusps);
    const isDay = sunHouseRaw >= 7 && sunHouseRaw <= 12;
    const fortune = norm(isDay ? asc + moon.lon - sun.lon : asc + sun.lon - moon.lon);

    if (timeKnown) {
      points.push(Object.assign({ key: "fortune", lon: fortune, speed: 0, retro: false }, splitLon(fortune)));
      points.push(Object.assign({ key: "vertex", lon: vertex, speed: 0, retro: false }, splitLon(vertex)));
      points.push(Object.assign({ key: "asc", lon: asc, speed: 360.98, retro: false }, splitLon(asc)));
      points.push(Object.assign({ key: "mc", lon: mc, speed: 360.98, retro: false }, splitLon(mc)));
    }

    for (const p of points) {
      p.house = timeKnown ? houseOf(p.lon, cusps) : null;
      p.dignity = dignityOf(p.key, p.sign);
      p.critical = criticalDegree(p.signIdx, p.within);
      p.oob = p.dec !== undefined && Math.abs(p.dec) > eps && ["moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"].includes(p.key);
    }

    const aspects = findAspects(points, { minorAspects: opts.minorAspects, orbScale: opts.orbScale, timeKnown });
    // declination aspects, as listed by Astro-Seek: parallel (same declination) and contra-parallel (mirror image)
    const DEC_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron"];
    const decPts = points.filter((p) => DEC_KEYS.includes(p.key) && typeof p.dec === "number");
    const parallels = [];
    for (let i = 0; i < decPts.length; i++) {
      for (let j = i + 1; j < decPts.length; j++) {
        const a = decPts[i], b = decPts[j];
        const par = Math.abs(a.dec - b.dec), con = Math.abs(a.dec + b.dec);
        const orb = 1 * (opts.orbScale || 1);
        if (par <= orb) parallels.push({ a: a.key, b: b.key, type: "parallel", orb: par, strength: 1 - par / orb });
        else if (con <= orb) parallels.push({ a: a.key, b: b.key, type: "contraparallel", orb: con, strength: 1 - con / orb });
      }
    }
    parallels.sort((x, y) => x.orb - y.orb);
    const patterns = findPatterns(aspects, points);
    const moonPhaseAngle = norm(moon.lon - sun.lon);

    return {
      input, opts, timeKnown, points, aspects, patterns, parallels,
      houses: timeKnown ? cusps : null,
      houseSystemUsed: hs.used,
      asc, mc, vertex, fortune, ramc, eps, ayanamsa: ayan, isDay, moonPhaseAngle,
      get(key) { return points.find((p) => p.key === key); },
    };
  }

  /** Find next dates (after `from`) when a body returns to `targetLon` (tropical). */
  function findReturns(key, targetLon, from, until, opts) {
    opts = opts || { nodeType: "mean" };
    const out = [];
    const step = { saturn: 10, jupiter: 5, chiron: 10, northNode: 5 }[key] || 5;
    let t = from.getTime();
    let prev = diff(targetLon, rawLonLat(key, new Date(t), opts).lon);
    while (t < until.getTime()) {
      const t2 = t + step * 86400000;
      const cur = diff(targetLon, rawLonLat(key, new Date(t2), opts).lon);
      if (Math.sign(prev) !== Math.sign(cur) && Math.abs(prev - cur) < 90) {
        let lo = t, hi = t2, dlo = prev;
        for (let i = 0; i < 30; i++) {
          const mid = (lo + hi) / 2;
          const dm = diff(targetLon, rawLonLat(key, new Date(mid), opts).lon);
          if (Math.sign(dm) === Math.sign(dlo)) { lo = mid; dlo = dm; } else hi = mid;
        }
        out.push(new Date((lo + hi) / 2));
      }
      prev = cur;
      t = t2;
    }
    return out;
  }

  /** Longitude (tropical, or sidereal when opts.zodiac === "sidereal") of a body at a date. */
  function lonAt(key, date, opts) {
    opts = opts || {};
    const l = rawLonLat(key, date, opts).lon;
    return opts.zodiac === "sidereal" ? norm(l - ayanamsa(date)) : l;
  }

  global.AstroEngine = {
    lonAt,
    computeChart, zonedToUtc, tzOffsetMinutes, findReturns, splitLon, norm, diff,
    SIGN_KEYS, ASPECTS, POINT_ORDER, _test: { ascFor, mcFor, placidus, computeHouses, meanNode, trueNode, meanLilith, chironLonLat },
  };
})(typeof window !== "undefined" ? window : globalThis);
