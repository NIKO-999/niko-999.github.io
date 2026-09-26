/*
 * Procedurally rendered sky: per-pixel shaded planets.
 *  - (The horizon planet is a plain CSS gradient; see .horizon in style.css.)
 *  - Former horizon shader kept below for reference: layered atmosphere, dawn-lit
 *    clouds near the limb, faint city lights on the night side.
 *  - Gas giant: domain-warped bands, festoons, ovals, storm, polar cyclones;
 *    rings with gaps, ringlets, translucency and mutual shadows.
 *  - Moon: power-law craters, central peaks, a ray crater, lunar photometry.
 *  - A small cloudy world.
 * The moon and small world turn slowly and the gas giant's rings orbit it: the worker
 * keeps a map of each moving surface and redraws only what moves (paused while scrolling).
 * Rendering runs in a Web Worker so scrolling never stalls, and finished
 * images are cached so later launches show them instantly.
 */
(function () {
  "use strict";
  const SKY_VERSION = "sky-7";

  /* Everything the worker needs lives inside SKYLIB, so its source can be
     shipped to a Worker via toString(). No DOM access in here. */
  function SKYLIB() {
    /* ---------- 3D gradient noise (Perlin) ---------- */
    const P = new Uint8Array(512);
    (function seed(s) {
      const p = Array.from({ length: 256 }, (_, i) => i);
      for (let i = 255; i > 0; i--) {
        s = (s * 16807) % 2147483647;
        const j = s % (i + 1);
        const t = p[i]; p[i] = p[j]; p[j] = t;
      }
      for (let i = 0; i < 512; i++) P[i] = p[i & 255];
    })(20020508);
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    function grad(h, x, y, z) {
      const u = (h & 15) < 8 ? x : y, v = (h & 15) < 4 ? y : (h & 15) === 12 || (h & 15) === 14 ? x : z;
      return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
    }
    function noise(x, y, z) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w = fade(z);
      const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
      return lerp(
        lerp(lerp(grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z), u), lerp(grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z), u), v),
        lerp(lerp(grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1), u), lerp(grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1), u), v),
        w
      );
    }
    function fbm(x, y, z, oct) {
      let a = 0.5, f = 1, s = 0;
      for (let i = 0; i < oct; i++) { s += a * noise(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
      return s;
    }
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
    function norm3(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
    const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

    // light comes from the sunrise below the horizon: lower-left, a little in front
    const LIGHT = norm3([-0.55, -0.62, 0.56]); // y is up in planet space
    const SKY = [16, 32, 48]; // ambient tint, matches the sky so night sides melt into it

    /* Each planet is split into a surface (albedo on a sphere, looked up by latitude and
       longitude) and a fixed per-pixel part (lighting, limb, rings) that does not move as the
       planet turns. The static render evaluates the surface directly; the spinning version
       samples it from a pre-built map. */
    const TAU = Math.PI * 2;
    const wrapPi = (a) => a - TAU * Math.floor((a + Math.PI) / TAU);

    /* ================= gas giant ================= */
    const BANDS = [
      [0.0, [58, 66, 78]], [0.08, [104, 86, 70]], [0.14, [196, 160, 120]], [0.2, [232, 210, 176]], [0.26, [172, 118, 78]],
      [0.31, [218, 184, 142]], [0.37, [240, 222, 190]], [0.43, [186, 132, 88]], [0.48, [138, 92, 62]], [0.53, [226, 194, 152]],
      [0.59, [200, 148, 104]], [0.65, [236, 214, 180]], [0.71, [156, 106, 70]], [0.77, [214, 176, 136]], [0.84, [182, 138, 100]],
      [0.9, [112, 92, 78]], [0.96, [74, 78, 88]], [1.0, [48, 58, 72]],
    ];
    function bandColor(t) {
      t = clamp(t, 0, 1);
      for (let i = 1; i < BANDS.length; i++) {
        if (t <= BANDS[i][0]) {
          const [a, ca] = BANDS[i - 1], [b, cb] = BANDS[i];
          return mix3(ca, cb, (t - a) / (b - a));
        }
      }
      return BANDS[BANDS.length - 1][1];
    }
    function giantParts() {
      const R = 0.205; // planet radius as a fraction of the canvas (rings reach ~2.3R)
      const roll = (-16 * Math.PI) / 180, cr = Math.cos(roll), sr = Math.sin(roll);
      const open = (14 * Math.PI) / 180;
      const N = [0, Math.cos(open), Math.sin(open)]; // ring-plane normal
      const NL = N[0] * LIGHT[0] + N[1] * LIGHT[1] + N[2] * LIGHT[2];
      const RIN = 1.22, ROUT = 2.28;
      const tilt = 0.18;
      const OVALS = [[0.42, -0.9, 0.035], [-0.52, 0.6, 0.03], [0.18, 1.4, 0.025], [-0.12, -0.3, 0.02], [0.6, 0.2, 0.022]];
      const ringDensity = (r) => {
        if (r < RIN || r > ROUT) return 0;
        let d;
        if (r < 1.52) d = 0.16 + 0.12 * smooth(RIN, 1.52, r);
        else if (r < 1.95) d = 0.74 + 0.18 * Math.sin((r - 1.52) * 9);
        else if (r < 2.03) d = 0.04;
        else d = 0.52 - 0.16 * smooth(2.03, ROUT, r);
        if (r > 2.18 && r < 2.2) d *= 0.2;
        d *= 0.8 + 0.2 * Math.sin(r * 310) * Math.sin(r * 97) + 0.08 * noise(r * 60, 0.5, 0.5);
        d *= smooth(ROUT, ROUT - 0.03, r) * smooth(RIN, RIN + 0.03, r);
        return clamp(d, 0, 1);
      };
      const ringTint = (r) => {
        const t = 0.5 + 0.5 * noise(r * 14, 2.1, 0.3);
        return mix3([214, 190, 156], [238, 222, 196], t);
      };
      // noise sampled around a cylinder so the surface wraps seamlessly in longitude
      const around = (lon, a, s, z, oct) => { const th = lon + s / a; return fbm(Math.cos(th) * a, Math.sin(th) * a, z, oct); };
      /** Surface colour. lat is the sine of latitude (-1..1), lon is in radians. */
      function albedo(lat, lon) {
        const shear = Math.sin(lat * 24) * 0.55;
        const w1 = around(lon, 1.6, shear, lat * 10 + 0.7, 5);
        const w2 = around(lon, 3.2, w1 * 2.2 + shear, lat * 22 + w1 * 3 + 2.9, 5);
        let col = bandColor(0.5 + lat * 0.52 + w1 * 0.06 + w2 * 0.035);
        const streak = around(lon, 9, shear * 2 + w2, lat * 90 + 4.3, 4);
        const fine = around(lon, 22, shear * 3 + w2 * 2, lat * 220 + 7.1, 3);
        col = col.map((v) => v * (0.92 + streak * 0.24 + fine * 0.1));
        // dark bluish festoons trailing from the equatorial belt
        const fest = smooth(0.12, 0.4, around(lon, 10, shear * 4 + w1 * 3, lat * 55 + 5.5, 3)) * Math.exp(-Math.pow((lat - 0.05) / 0.09, 2));
        col = mix3(col, [78, 92, 110], fest * 0.45);
        // cooler, darker polar regions dotted with small cyclones
        const polar = smooth(0.62, 0.86, Math.abs(lat));
        if (polar > 0) {
          const cl = Math.sqrt(Math.max(0, 1 - lat * lat));
          const cyc = smooth(0.3, 0.55, fbm(cl * Math.sin(lon) * 36, lat * 36, cl * Math.cos(lon) * 36, 3));
          col = mix3(col, mix3([86, 94, 108], [150, 150, 150], cyc * 0.5), polar * 0.7);
        }
        // great storm
        const dl = (lat + 0.34) / 0.065, dlo = wrapPi(lon - 0.35) / 0.19;
        const storm = Math.exp(-(dl * dl + dlo * dlo));
        if (storm > 0.001) {
          const swirl = 0.5 + 0.5 * Math.sin(Math.atan2(dl, dlo) * 2 + Math.hypot(dl, dlo) * 5);
          col = mix3(col, [lerp(170, 206, swirl), lerp(86, 116, swirl), lerp(58, 74, swirl)], storm * 0.8);
        }
        // small white ovals
        for (const [oLat, oLon, oR] of OVALS) {
          const a = (lat - oLat) / oR, bb = wrapPi(lon - oLon) / (oR * 2.4);
          const o = Math.exp(-(a * a + bb * bb) * 1.6);
          if (o > 0.01) col = mix3(col, [244, 236, 222], o * 0.7);
        }
        return col;
      }
      /** Fixed part of a pixel: null, a static colour, or the surface point plus an affine colour transform. */
      function pixel(fx, fy, W) {
        const sx = (fx - 0.5) / R, sy = -(fy - 0.5) / R;
        const x = sx * cr + sy * sr, y = -sx * sr + sy * cr;
        const edge = 1.2 / (R * W);
        const rr = x * x + y * y;
        // ring along the view ray
        const zr = -(N[1] * y) / N[2];
        const rRing = Math.sqrt(x * x + y * y + zr * zr);
        const dens = ringDensity(rRing);
        let ring = null;
        if (dens > 0) {
          const b = x * LIGHT[0] + y * LIGHT[1] + zr * LIGHT[2];
          const c = rRing * rRing - 1;
          const shadowed = b * b - c > 0 && -b - Math.sqrt(b * b - c) > 0;
          const lit = shadowed ? 0.06 : 0.5 + 0.5 * Math.abs(NL);
          // position around the ring, measured in the ring plane
          const th = Math.atan2(y * Math.sin(open) - zr * Math.cos(open), x);
          ring = { col: mix3(SKY, ringTint(rRing), lit), a0: dens * 0.92, r: rRing, th };
        }
        if (rr < (1 + edge) * (1 + edge)) {
          const z = Math.sqrt(Math.max(0, 1 - rr));
          const lat = y * Math.cos(tilt) + z * Math.sin(tilt);
          const lon = Math.atan2(x, z * Math.cos(tilt) - y * Math.sin(tilt));
          // lighting with limb darkening
          const ndl = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
          let lightAmt = smooth(-0.1, 0.32, ndl) * (0.22 + 0.78 * Math.max(ndl, 0));
          lightAmt *= 0.5 + 0.5 * Math.pow(z, 0.5);
          // ring shadow on the planet
          const t = -(N[0] * x + N[1] * y + N[2] * z) / NL;
          if (t > 0) {
            const Rx = x + t * LIGHT[0], Ry = y + t * LIGHT[1], Rz = z + t * LIGHT[2];
            lightAmt *= 1 - 0.78 * ringDensity(Math.sqrt(Rx * Rx + Ry * Ry + Rz * Rz));
          }
          const limb = Math.pow(1 - z, 3.5) * 0.35 * smooth(-0.3, 0.4, ndl);
          const rim = Math.pow(1 - z, 3) * smooth(-0.2, 0.6, ndl);
          // everything after the surface colour is affine in it: out = A * col + B
          const compose = (col) => {
            const c = mix3(SKY, col, lightAmt);
            // bluish high haze at the limb and a warm rim where the sunrise grazes it
            const h = mix3(c, [120, 150, 180], limb);
            return [h[0] + rim * 110, h[1] + rim * 55, h[2] + rim * 20];
          };
          const B = compose([0, 0, 0]);
          const a = clamp((1 - Math.sqrt(rr)) / edge, 0, 1);
          return { lat, lon, A: compose([1, 1, 1])[0] - B[0], B, a: a * 255, ring: ring && zr > z ? ring : null };
        }
        return ring ? { ring } : null;
      }
      /** Clumps and streaks in the rings: narrow across the ring, drawn out along it, so their orbit shows. */
      function ringMod(r, th) {
        const c = Math.cos(th), s = Math.sin(th);
        const v = fbm(r * 48, c * 1.4, s * 1.4, 3) * 1.6 + noise(r * 170, c * 5, s * 5) * 0.35;
        return clamp(0.5 + v, 0, 1);
      }
      /** Final pixel from the planet colour (if the planet is here) and the ring modulation. */
      function finish(px, planetCol, m) {
        let c = null, a = 0;
        if (planetCol) { c = [px.A * planetCol[0] + px.B[0], px.A * planetCol[1] + px.B[1], px.A * planetCol[2] + px.B[2]]; a = px.a / 255; }
        const ring = px.ring;
        if (ring) {
          const ra = clamp(ring.a0 * (0.62 + 0.76 * m), 0, 1);
          const k = 0.8 + 0.4 * m;
          const rc = [ring.col[0] * k, ring.col[1] * k, ring.col[2] * k];
          if (c) { c = mix3(c, rc, ra); a = clamp(a + ra, 0, 1); } else { c = rc; a = ra; }
        }
        return [c[0], c[1], c[2], a * 255];
      }
      return { R, pixel, albedo, ringMod, finish, RIN, ROUT };
    }

    /* ================= moon ================= */
    function moonParts() {
      const R = 0.47;
      let s = 77;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const craters = [];
      for (let i = 0; i < 170; i++) {
        const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
        // power-law sizes: many small, a few large
        craters.push({ c: [rr * Math.cos(th), u, rr * Math.sin(th)], r: 0.012 + Math.pow(rnd(), 5) * 0.25 });
      }
      // landmarks spread all the way round, so every side looks different as it turns
      const at = (latDeg, lonDeg) => { const la = (latDeg * Math.PI) / 180, lo = (lonDeg * Math.PI) / 180; return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]; };
      const ray = { c: norm3([-0.35, -0.25, 0.9]), r: 0.05 }; // a young, bright ray crater on the side you see first
      const RAYS = [ray, { c: at(32, 105), r: 0.045 }, { c: at(-38, 195), r: 0.06 }, { c: at(8, 285), r: 0.04 }];
      // great impact basins with dark, lava-filled floors
      const BASINS = [{ c: at(22, 150), r: 0.32 }, { c: at(-28, 65), r: 0.22 }, { c: at(46, 245), r: 0.26 }, { c: at(-12, 320), r: 0.18 }, { c: at(-55, 130), r: 0.2 }];
      for (const k of RAYS) craters.push(k);
      for (const k of BASINS) craters.push(k);
      // a chain of craters across the far side
      for (let i = 0; i < 7; i++) craters.push({ c: at(-8 + i * 4.5, 200 + i * 7), r: 0.03 + (i % 3) * 0.008 });
      const height = (p) => {
        let h = fbm(p[0] * 3, p[1] * 3, p[2] * 3, 5) * 0.035 + fbm(p[0] * 24, p[1] * 24, p[2] * 24, 3) * 0.005 + noise(p[0] * 90, p[1] * 90, p[2] * 90) * 0.0012;
        for (const k of craters) {
          const dx = p[0] - k.c[0], dy = p[1] - k.c[1], dz = p[2] - k.c[2];
          const lim = k.r * 1.5;
          if (dx > lim || dx < -lim || dy > lim || dy < -lim || dz > lim || dz < -lim) continue;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / k.r;
          if (d < 1.5) {
            if (d < 1) h += (d * d - 1) * k.r * 0.22;
            h += Math.exp(-((d - 1) * (d - 1)) / 0.03) * k.r * 0.07;
            if (k.r > 0.12 && d < 0.18) h += (0.18 - d) * k.r * 0.5; // central peak
          }
        }
        return h;
      };
      const maria = (p) => {
        let m = smooth(0.04, 0.32, fbm(p[0] * 1.3 + 4, p[1] * 1.3, p[2] * 1.3, 3));
        for (const k of BASINS) {
          const dx = p[0] - k.c[0], dy = p[1] - k.c[1], dz = p[2] - k.c[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / k.r;
          if (d < 1.1) m = Math.max(m, smooth(1.05, 0.75, d) * (0.8 + 0.2 * noise(p[0] * 9, p[1] * 9, p[2] * 9)));
        }
        return m;
      };
      const rays = (p) => {
        let sum = 0;
        RAYS.forEach((k, n) => {
          const dx = p[0] - k.c[0], dy = p[1] - k.c[1], dz = p[2] - k.c[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d > 0.9) return;
          // direction around the crater, measured on the surface
          const c = k.c, cl = Math.hypot(c[0], c[2]) || 1;
          const E = [c[2] / cl, 0, -c[0] / cl], N = [E[1] * c[2] - E[2] * c[1], E[2] * c[0] - E[0] * c[2], E[0] * c[1] - E[1] * c[0]];
          const ang = Math.atan2(dx * N[0] + dy * N[1] + dz * N[2], dx * E[0] + dy * E[1] + dz * E[2]);
          const streak = Math.pow(Math.max(0, noise(Math.cos(ang) * 2.5, Math.sin(ang) * 2.5, 1.3 + n * 3.7) + 0.25), 2.2);
          sum += streak * Math.max(0, 1 - d / 0.9) * 0.9 + Math.exp(-(d * d) / (k.r * k.r * 2)) * 0.5;
        });
        return sum;
      };
      const pointOf = (lat, lon) => { const cl = Math.sqrt(Math.max(0, 1 - lat * lat)); return [cl * Math.sin(lon), lat, cl * Math.cos(lon)]; };
      const basis = (lat, lon) => {
        const cl = Math.sqrt(Math.max(0, 1 - lat * lat));
        return { E: [Math.cos(lon), 0, -Math.sin(lon)], N: [-lat * Math.sin(lon), cl, -lat * Math.cos(lon)] };
      };
      /** Surface: albedo and the relief-tilted normal in local east/north components. */
      function albedo(lat, lon) {
        const p = pointOf(lat, lon);
        const { E, N: Nn } = basis(lat, lon);
        const e = 0.01;
        const h0 = height(p);
        const hE = height(norm3([p[0] + E[0] * e, p[1] + E[1] * e, p[2] + E[2] * e])) - h0;
        const hN = height(norm3([p[0] + Nn[0] * e, p[1] + Nn[1] * e, p[2] + Nn[2] * e])) - h0;
        const gE = (hE / e) * 0.7, gN = (hN / e) * 0.7;
        const l = Math.sqrt(1 + gE * gE + gN * gN);
        const alb = (0.8 + fbm(p[0] * 7, p[1] * 7, p[2] * 7, 5) * 0.2 + noise(p[0] * 60, p[1] * 60, p[2] * 60) * 0.03) * (1 - 0.4 * maria(p)) + rays(p) * 0.35;
        return [alb, -gE / l, -gN / l];
      }
      function pixel(fx, fy, W) {
        const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
        const rr = x * x + y * y;
        const edge = 1.2 / (R * W);
        if (rr > (1 + edge) * (1 + edge)) return null;
        const z = Math.sqrt(Math.max(0, 1 - rr));
        const lat = y, lon = Math.atan2(x, z);
        const b = basis(lat, lon);
        return { lat, lon, p: [x, y, z], E: b.E, N: b.N, a: clamp((1 - Math.sqrt(rr)) / edge, 0, 1) * 255 };
      }
      /** Lighting for a surface sample seen at a pixel (the light and viewer do not turn with the moon). */
      function shade(px, s) {
        const [alb, dE, dN] = s;
        const dU = Math.sqrt(Math.max(0, 1 - dE * dE - dN * dN));
        const p = px.p, E = px.E, Nn = px.N;
        const n = [p[0] * dU + E[0] * dE + Nn[0] * dN, p[1] * dU + E[1] * dE + Nn[1] * dN, p[2] * dU + E[2] * dE + Nn[2] * dN];
        const mu0 = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]; // incidence
        const mu = Math.max(n[2], 0.05); // emission (viewer on +z)
        // lunar photometry: Lommel-Seeliger blended with Lambert, crisp terminator
        const ls = mu0 > 0 ? (2 * mu0) / (mu0 + mu) : 0;
        const lightAmt = (0.65 * ls + 0.35 * Math.max(mu0, 0)) * smooth(-0.03, 0.08, mu0);
        const base = [178 * alb, 181 * alb, 186 * alb];
        let c = mix3(SKY, base, clamp(lightAmt * 0.95, 0, 1.15));
        // faint earthshine on the night side
        const shine = (1 - smooth(-0.2, 0.05, mu0)) * 0.08;
        c = [c[0] + 60 * shine * alb, c[1] + 76 * shine * alb, c[2] + 96 * shine * alb];
        const rim = Math.pow(1 - p[2], 4) * smooth(0, 0.6, mu0);
        return [c[0] + rim * 60, c[1] + rim * 30, c[2] + rim * 10];
      }
      return { R, pixel, albedo, shade };
    }

    /* ================= distant world ================= */
    function farParts() {
      const R = 0.42;
      function albedo(lat, lon) {
        const cl = Math.sqrt(Math.max(0, 1 - lat * lat));
        const x = cl * Math.sin(lon), y = lat, z = cl * Math.cos(lon);
        // oceans and continents, polar ice, and swirling cloud bands, different on every side
        const land = smooth(0.02, 0.1, fbm(x * 1.9 + 7, y * 1.9, z * 1.9, 4));
        let col = mix3([30, 78, 138], mix3([74, 102, 100], [124, 120, 106], smooth(0, 0.3, fbm(x * 5, y * 5, z * 5 + 3, 3))), land);
        col = mix3(col, [220, 232, 242], smooth(0.72, 0.84, Math.abs(y) + fbm(x * 4, y * 4, z * 4, 2) * 0.1));
        const cloud = fbm(x * 1.6 + fbm(x * 3, y * 3, z * 3, 2) * 1.2 + 2, y * 4.2, z * 1.6, 4);
        return mix3(col, [214, 228, 242], smooth(0.08, 0.36, cloud) * 0.85);
      }
      function pixel(fx, fy, W) {
        const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
        const rr = x * x + y * y;
        const edge = 1.5 / (R * W);
        const d = Math.sqrt(rr);
        if (d > 1.18) return null;
        if (d > 1) return { rgba: [120, 180, 230, Math.pow(1 - (d - 1) / 0.18, 2) * 90] };
        const z = Math.sqrt(Math.max(0, 1 - rr));
        const ndl = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
        const lightAmt = smooth(-0.1, 0.4, ndl) * (0.3 + 0.7 * Math.max(ndl, 0));
        return { lat: y, lon: Math.atan2(x, z), A: lightAmt, B: SKY.map((v) => v * (1 - lightAmt)), a: clamp((1 - d) / edge, 0, 1) * 255 };
      }
      return { R, pixel, albedo };
    }

    const PARTS = { giant: giantParts, moon: moonParts, far: farParts };
    function colourOf(parts, px, s) {
      if (parts.shade) return parts.shade(px, s);
      return [px.A * s[0] + px.B[0], px.A * s[1] + px.B[1], px.A * s[2] + px.B[2]];
    }

    /* ================= horizon planet ================= */
    // geometry is read from the SVG horizon so the rendered version lines up exactly
    function horizonShader(geo) {
      const { W, H, cx, cy, Rb, T, top } = geo; // all in CSS px, relative to the canvas
      const SUN = norm3([0, 1, -0.32]); // just behind the top limb (y up)
      const ATMOS = [
        [0.0, [158, 44, 18], 1], [0.05, [216, 74, 28], 1], [0.12, [240, 106, 39], 0.97], [0.22, [245, 141, 60], 0.92],
        [0.36, [244, 169, 94], 0.82], [0.52, [233, 185, 142], 0.55], [0.7, [159, 180, 194], 0.25], [0.86, [111, 147, 171], 0.08], [1, [111, 147, 171], 0],
      ];
      const atmos = (t) => {
        t = clamp(t, 0, 1);
        for (let i = 1; i < ATMOS.length; i++) {
          if (t <= ATMOS[i][0]) {
            const [a, ca, oa] = ATMOS[i - 1], [b, cb, ob] = ATMOS[i];
            const k = (t - a) / (b - a);
            return [...mix3(ca, cb, k), lerp(oa, ob, k)];
          }
        }
        return [111, 147, 171, 0];
      };
      return (fx, fy) => {
        const px = fx * W, py = fy * H + top;
        const dx = px - cx, dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const h = dist - Rb;
        // brighter where the hidden sun sits (centre of the arc)
        const sunward = 0.82 + 0.3 * Math.exp(-Math.pow(dx / (W * 0.55), 2));
        if (h > 0) {
          if (h > T) return null;
          const a = atmos(h / T);
          // fine horizontal striations in the glow, like layered haze
          // very soft variation along the limb so the glow is not perfectly uniform
          const v = 1 + 0.035 * noise(dx * 0.006, h * 0.02, 0.5);
          return [a[0] * v, a[1] * v, a[2] * v, clamp(a[3] * sunward, 0, 1) * 255];
        }
        // on the surface: orthographic sphere coordinates
        const nx = dx / Rb, ny = -dy / Rb;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const depth = -h; // px below the limb
        // wispy, domain-warped clouds; only their tops near the limb catch the dawn
        const wx = fbm(nx * 18, ny * 18, nz * 18, 3);
        const cl = fbm(nx * 46 + wx * 1.6, ny * 46, nz * 46 + wx, 5);
        const cl2 = fbm(nx * 140 + cl, ny * 140, nz * 140, 3);
        const cloud = smooth(0.12, 0.42, cl + cl2 * 0.3) * 0.85;
        const twilight = Math.exp(-depth / (T * 0.28));
        let c = [32, 36, 44]; // night surface, dusky rather than black
        c = mix3(c, [48, 54, 66], cloud * 0.55); // clouds faintly visible in skyglow
        c = mix3(c, mix3([176, 84, 44], [236, 168, 118], cloud), twilight * (0.3 + 0.7 * cloud));
        // city lights on the dark side, clustered
        const cityMask = smooth(0.18, 0.34, fbm(nx * 12 + 7, ny * 12, nz * 12, 3));
        const speck = noise(nx * 900, ny * 900, nz * 900);
        const city = cityMask * smooth(0.42, 0.62, speck) * (1 - cloud * 0.8) * (1 - twilight) * smooth(T * 0.6, T * 1.6, depth);
        c = [c[0] + city * 210, c[1] + city * 150, c[2] + city * 70];
        // haze just under the limb (we look through more atmosphere there)
        const haze = Math.exp(-depth / (T * 0.22));
        c = mix3(c, [236, 110, 48], haze * 0.8 * sunward);
        const edge = clamp((Rb - dist + 0.8) / 1.2, 0, 1);
        return [c[0], c[1], c[2], 255 * edge + (1 - edge) * 200];
      };
    }

    // soft radial fade baked into the pixels (replaces a CSS mask that was costly on iOS)
    function fadeMask(fx, fy) {
      const d = Math.hypot(fx - 0.42, fy - 0.58) / 0.82;
      if (d <= 0.52) return 1;
      if (d <= 0.72) return lerp(1, 0.55, (d - 0.52) / 0.2);
      return lerp(0.55, 0.2, clamp((d - 0.72) / 0.28, 0, 1));
    }

    function renderBuffer(kind, geo, W, H) {
      const d = new Uint8ClampedArray(W * H * 4);
      if (kind === "horizon") {
        const shade = horizonShader(geo);
        for (let row = 0; row < H; row++) {
          for (let col = 0; col < W; col++) {
            const px = shade((col + 0.5) / W, (row + 0.5) / H, W, H);
            if (!px) continue;
            const i = (row * W + col) * 4;
            d[i] = px[0]; d[i + 1] = px[1]; d[i + 2] = px[2]; d[i + 3] = px[3];
          }
        }
        return d;
      }
      const parts = PARTS[kind]();
      const masked = kind === "giant" || kind === "moon";
      for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
          const fx = (col + 0.5) / W, fy = (row + 0.5) / H;
          const px = parts.pixel(fx, fy, W);
          if (!px) continue;
          let c, a;
          if (kind === "giant") {
            c = parts.finish(px, px.lat !== undefined ? parts.albedo(px.lat, px.lon) : null, px.ring ? parts.ringMod(px.ring.r, px.ring.th) : 0);
            a = c[3];
          } else {
            c = px.rgba || colourOf(parts, px, parts.albedo(px.lat, px.lon));
            a = px.rgba ? px.rgba[3] : px.a;
          }
          const i = (row * W + col) * 4;
          d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
          d[i + 3] = masked ? a * fadeMask(fx, fy) : a;
        }
      }
      return d;
    }

    /* ---------- slow axial spin (runs inside the worker) ---------- */
    // seconds per full turn
    const PERIOD = { ring: 40, moon: 40, far: 25 };
    let paused = false;
    function buildMap(kind, parts, W) {
      const r = parts.R * W;
      const MW = Math.max(64, Math.ceil((TAU * r) / 8) * 8), MH = Math.max(32, Math.ceil(2 * r));
      const m = new Float32Array(MW * MH * 3);
      for (let j = 0; j < MH; j++) {
        const lat = -1 + ((j + 0.5) / MH) * 2;
        for (let i = 0; i < MW; i++) {
          const s = parts.albedo(lat, -Math.PI + ((i + 0.5) / MW) * TAU);
          const k = (j * MW + i) * 3;
          m[k] = s[0]; m[k + 1] = s[1]; m[k + 2] = s[2];
        }
      }
      return { MW, MH, m };
    }
    async function loadMap(key) {
      try {
        const res = await (await caches.open("natal-sky")).match(key);
        if (!res) return null;
        const buf = await res.arrayBuffer();
        const hdr = new Uint32Array(buf, 0, 2);
        return { MW: hdr[0], MH: hdr[1], m: new Float32Array(buf, 8) };
      } catch (e) { return null; }
    }
    async function saveMap(key, map) {
      try {
        const out = new ArrayBuffer(8 + map.m.byteLength);
        new Uint32Array(out, 0, 2).set([map.MW, map.MH]);
        new Float32Array(out, 8).set(map.m);
        await (await caches.open("natal-sky")).put(key, new Response(out, { headers: { "Content-Type": "application/octet-stream" } }));
      } catch (e) { /* no cache: rebuilt next time */ }
    }
    /** Bilinear lookup of the surface map at (lat, lon), wrapping in longitude. */
    function sample(map, lat, lon, out) {
      const { MW, MH, m } = map;
      let u = ((lon + Math.PI) / TAU) * MW - 0.5;
      u -= MW * Math.floor(u / MW);
      let v = ((lat + 1) / 2) * MH - 0.5;
      v = v < 0 ? 0 : v > MH - 1 ? MH - 1 : v;
      const i0 = Math.floor(u), j0 = Math.floor(v), fu = u - i0, fv = v - j0;
      const i1 = (i0 + 1) % MW, j1 = j0 + 1 < MH ? j0 + 1 : j0;
      const a = (j0 * MW + i0) * 3, b = (j0 * MW + i1) * 3, c = (j1 * MW + i0) * 3, d = (j1 * MW + i1) * 3;
      for (let k = 0; k < 3; k++) {
        const top = m[a + k] + (m[b + k] - m[a + k]) * fu, bot = m[c + k] + (m[d + k] - m[c + k]) * fu;
        out[k] = top + (bot - top) * fv;
      }
      return out;
    }
    /* The gas giant itself stays still; its rings orbit, inner edge faster than outer (Kepler). */
    function ringMap(parts) {
      const MR = 384, MT = 1536, m = new Float32Array(MR * MT);
      for (let j = 0; j < MR; j++) {
        const r = parts.RIN + ((j + 0.5) / MR) * (parts.ROUT - parts.RIN);
        for (let i = 0; i < MT; i++) m[j * MT + i] = parts.ringMod(r, -Math.PI + ((i + 0.5) / MT) * TAU);
      }
      return { MR, MT, m };
    }
    function sampleRing(map, parts, r, th) {
      const { MR, MT, m } = map;
      let u = ((th + Math.PI) / TAU) * MT - 0.5;
      u -= MT * Math.floor(u / MT);
      let v = ((r - parts.RIN) / (parts.ROUT - parts.RIN)) * MR - 0.5;
      v = v < 0 ? 0 : v > MR - 1 ? MR - 1 : v;
      const i0 = Math.floor(u), j0 = Math.floor(v), fu = u - i0, fv = v - j0;
      const i1 = (i0 + 1) % MT, j1 = j0 + 1 < MR ? j0 + 1 : j0;
      const top = m[j0 * MT + i0] + (m[j0 * MT + i1] - m[j0 * MT + i0]) * fu;
      const bot = m[j1 * MT + i0] + (m[j1 * MT + i1] - m[j1 * MT + i0]) * fu;
      return top + (bot - top) * fv;
    }
    function spinRings(canvas, W, post) {
      const parts = giantParts();
      const map = ringMap(parts);
      const ctx = canvas.getContext("2d");
      const img = new ImageData(W, W), d = img.data;
      const live = [];
      let x0 = W, y0 = W, x1 = 0, y1 = 0;
      for (let row = 0; row < W; row++) {
        for (let col = 0; col < W; col++) {
          const fx = (col + 0.5) / W, fy = (row + 0.5) / W;
          const px = parts.pixel(fx, fy, W);
          if (!px) continue;
          const i = (row * W + col) * 4;
          px.fm = fadeMask(fx, fy);
          px.pc = px.lat !== undefined ? parts.albedo(px.lat, px.lon) : null;
          if (!px.ring) {
            const c = parts.finish(px, px.pc, 0);
            d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c[3] * px.fm;
            continue;
          }
          px.i = i;
          px.w = Math.pow(1.6 / px.ring.r, 1.5); // relative angular speed
          live.push(px);
          if (col < x0) x0 = col; if (col > x1) x1 = col; if (row < y0) y0 = row; if (row > y1) y1 = row;
        }
      }
      let turn = 0; // radians turned at the reference radius
      const frame = (full) => {
        for (let n = 0; n < live.length; n++) {
          const px = live[n];
          const c = parts.finish(px, px.pc, sampleRing(map, parts, px.ring.r, px.ring.th - turn * px.w));
          d[px.i] = c[0]; d[px.i + 1] = c[1]; d[px.i + 2] = c[2]; d[px.i + 3] = c[3] * px.fm;
        }
        if (full) ctx.putImageData(img, 0, 0);
        else ctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
      };
      frame(true);
      post({ type: "spinReady", kind: "giant" });
      let last = Date.now();
      setInterval(() => {
        const now = Date.now();
        if (!paused) {
          turn += ((now - last) / 1000 / PERIOD.ring) * TAU;
          frame(false);
        }
        last = now;
      }, 50);
    }

    async function spin(canvas, kind, W, key, post) {
      if (kind === "giant") return spinRings(canvas, W, post);
      const parts = PARTS[kind]();
      let map = await loadMap(key);
      if (!map || map.MW * map.MH * 3 !== map.m.length) {
        map = buildMap(kind, parts, W);
        saveMap(key, map);
      }
      const ctx = canvas.getContext("2d");
      const img = new ImageData(W, W), d = img.data;
      const masked = kind === "giant" || kind === "moon";
      const live = [];
      let x0 = W, y0 = W, x1 = 0, y1 = 0;
      for (let row = 0; row < W; row++) {
        for (let col = 0; col < W; col++) {
          const fx = (col + 0.5) / W, fy = (row + 0.5) / W;
          const px = parts.pixel(fx, fy, W);
          if (!px) continue;
          const i = (row * W + col) * 4;
          const fm = masked ? fadeMask(fx, fy) : 1;
          if (px.rgba) {
            d[i] = px.rgba[0]; d[i + 1] = px.rgba[1]; d[i + 2] = px.rgba[2]; d[i + 3] = px.rgba[3] * fm;
            continue;
          }
          px.i = i;
          d[i + 3] = px.a * fm;
          live.push(px);
          if (col < x0) x0 = col; if (col > x1) x1 = col; if (row < y0) y0 = row; if (row > y1) y1 = row;
        }
      }
      const s = [0, 0, 0];
      let phase = 0;
      const frame = (full) => {
        for (let n = 0; n < live.length; n++) {
          const px = live[n];
          const c = colourOf(parts, px, sample(map, px.lat, px.lon - phase, s));
          d[px.i] = c[0]; d[px.i + 1] = c[1]; d[px.i + 2] = c[2];
        }
        if (full) ctx.putImageData(img, 0, 0);
        else ctx.putImageData(img, 0, 0, x0, y0, x1 - x0 + 1, y1 - y0 + 1);
      };
      frame(true);
      post({ type: "spinReady", kind });
      let last = Date.now();
      const step = 1000 / (kind === "far" ? 12 : 20);
      setInterval(() => {
        const now = Date.now();
        if (!paused) {
          phase += ((now - last) / 1000 / PERIOD[kind]) * TAU;
          frame(false);
        }
        last = now;
      }, step);
    }
    const setPaused = (v) => { paused = !!v; };

    return { renderBuffer, spin, setPaused };
  }

  /* ---------- worker plumbing ---------- */
  let worker = null, jobId = 0;
  const spinReady = {};
  const pending = new Map();
  function getWorker() {
    if (worker !== null) return worker;
    try {
      const src = "const LIB = (" + SKYLIB.toString() + ")();" +
        "onmessage = (e) => { const m = e.data;" +
        " if (m.type === 'spin') { LIB.spin(m.canvas, m.kind, m.W, m.key, (x) => postMessage(x)).catch(() => {}); return; }" +
        " if (m.type === 'pause') { LIB.setPaused(m.value); return; }" +
        " const { id, kind, geo, W, H } = m;" +
        " try { const buf = LIB.renderBuffer(kind, geo, W, H); postMessage({ id, buf }, [buf.buffer]); }" +
        " catch (err) { postMessage({ id, error: String(err) }); } };";
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      worker.onmessage = (e) => {
        if (e.data.type === "spinReady") { const f = spinReady[e.data.kind]; if (f) f(); return; }
        const job = pending.get(e.data.id);
        pending.delete(e.data.id);
        if (job) e.data.error ? job.reject(e.data.error) : job.resolve(e.data.buf);
      };
      worker.onerror = () => { worker = false; for (const j of pending.values()) j.reject("worker"); pending.clear(); };
    } catch (e) {
      worker = false;
    }
    return worker;
  }
  let inlineLib = null;
  function render(kind, geo, W, H) {
    const w = getWorker();
    if (w) {
      return new Promise((resolve, reject) => {
        const id = ++jobId;
        pending.set(id, { resolve, reject });
        w.postMessage({ id, kind, geo, W, H });
      }).catch(() => renderInline(kind, geo, W, H));
    }
    return renderInline(kind, geo, W, H);
  }
  function renderInline(kind, geo, W, H) {
    // fallback when workers are unavailable: yield first so the page paints
    return new Promise((resolve) => setTimeout(() => {
      inlineLib = inlineLib || SKYLIB();
      resolve(inlineLib.renderBuffer(kind, geo, W, H));
    }, 60));
  }

  /* ---------- image cache (instant on later launches) ---------- */
  const cacheKey = (kind, W, H, geo) => `./__sky/${SKY_VERSION}/${kind}-${W}x${H}${geo ? "-" + Math.round(geo.cx) + "-" + Math.round(geo.cy) : ""}.png`;
  async function fromCache(key) {
    try {
      if (!("caches" in window)) return null;
      const c = await caches.open("natal-sky");
      const res = await c.match(key);
      if (!res) return null;
      return await createImageBitmap(await res.blob());
    } catch (e) { return null; }
  }
  function toCache(key, canvas) {
    try {
      if (!("caches" in window) || !canvas.toBlob) return;
      canvas.toBlob(async (blob) => {
        try { if (blob) await (await caches.open("natal-sky")).put(key, new Response(blob, { headers: { "Content-Type": "image/png" } })); } catch (e) { /* ignore */ }
      }, "image/png");
    } catch (e) { /* ignore */ }
  }

  async function paint(canvas, kind, geo, W, H) {
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const key = cacheKey(kind, W, H, geo);
    const hit = await fromCache(key);
    if (hit) { ctx.drawImage(hit, 0, 0); return; }
    const buf = await render(kind, geo, W, H);
    ctx.putImageData(new ImageData(buf, W, H), 0, 0);
    toCache(key, canvas);
  }

  /* ---------- mounting ---------- */
  const scaleFor = (kind) => Math.min(window.devicePixelRatio || 1, kind === "moon" || kind === "far" ? 3 : 2);

  function mountSquare(selector, kind) {
    const host = document.querySelector(selector);
    if (!host) return Promise.resolve();
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;opacity:0;transition:opacity 1s ease";
    host.innerHTML = "";
    host.appendChild(canvas);
    const size = host.getBoundingClientRect().width || 200;
    const px = Math.round(size * scaleFor(kind));
    return paint(canvas, kind, null, px, px).then(() => { canvas.style.opacity = "1"; return { host, canvas, kind, px }; });
  }

  /* ---------- slow spin: the worker redraws the surface a few times a second ---------- */
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function startSpin(m) {
    const w = getWorker();
    if (!m || !w || reduceMotion || typeof OffscreenCanvas === "undefined" || !m.canvas.transferControlToOffscreen) return;
    const sc = document.createElement("canvas");
    sc.width = sc.height = m.px;
    sc.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;display:block;visibility:hidden";
    m.host.appendChild(sc);
    let off;
    try { off = sc.transferControlToOffscreen(); } catch (e) { sc.remove(); return; }
    spinReady[m.kind] = () => {
      // swap on a later frame so the first spinning frame has been committed
      requestAnimationFrame(() => requestAnimationFrame(() => { sc.style.visibility = "visible"; m.canvas.style.visibility = "hidden"; }));
    };
    const key = new URL(`./__sky/${SKY_VERSION}/map-${m.kind}-${m.px}.bin`, location.href).href;
    w.postMessage({ type: "spin", canvas: off, kind: m.kind, W: m.px, key }, [off]);
  }
  // pause while scrolling, in the background, or behind a detail page
  let pausedNow = false, scrollUntil = 0, scrollTimer = null;
  function updatePause() {
    const p = document.hidden || document.body.classList.contains("detail-open") || Date.now() < scrollUntil;
    if (p !== pausedNow && worker) { pausedNow = p; worker.postMessage({ type: "pause", value: p }); }
  }
  window.addEventListener("scroll", () => {
    scrollUntil = Date.now() + 250;
    updatePause();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updatePause, 270);
  }, { passive: true });
  document.addEventListener("visibilitychange", updatePause);
  new MutationObserver(updatePause).observe(document.body, { attributes: true, attributeFilter: ["class"] });


  function start() {
    // one after another, so a phone is never asked to do everything at once
    const mounted = [];
    const jobs = [() => mountSquare(".planet-moon", "moon"), () => mountSquare(".planet-far", "far"), () => mountSquare(".planet-giant", "giant")];
    jobs.reduce((p, job) => p.then(() => job()).then((m) => { if (m) mounted.push(m); }).catch((e) => { if (window.console) console.warn("sky render failed", e); }), Promise.resolve())
      // once every planet is showing (and has faded in), start them turning
      .then(() => setTimeout(() => ["giant", "moon", "far"].forEach((k) => startSpin(mounted.find((m) => m.kind === k))), 1200));
  }
  // start after the page has painted
  const kick = () => setTimeout(start, 120);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick);
})();
