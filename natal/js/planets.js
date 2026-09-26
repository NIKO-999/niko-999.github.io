/*
 * Procedurally rendered sky: per-pixel shaded planets.
 *  - Horizon planet: layered atmosphere with a green airglow line, dawn-lit
 *    clouds near the limb, faint city lights on the night side.
 *  - Gas giant: domain-warped bands, festoons, ovals, storm, polar cyclones;
 *    rings with gaps, ringlets, translucency and mutual shadows.
 *  - Moon: power-law craters, central peaks, a ray crater, lunar photometry.
 *  - A small cloudy world.
 * Rendering runs in a Web Worker so scrolling never stalls, and finished
 * images are cached so later launches show them instantly.
 */
(function () {
  "use strict";
  const SKY_VERSION = "sky-3";

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

    function giantShader() {
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
      return (fx, fy, W) => {
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
          const tint = ringTint(rRing);
          ring = { col: mix3(SKY, tint, lit), a: dens * 0.92 };
        }

        if (rr < (1 + edge) * (1 + edge)) {
          const z = Math.sqrt(Math.max(0, 1 - rr));
          const lat = y * Math.cos(tilt) + z * Math.sin(tilt);
          const lon = Math.atan2(x, z * Math.cos(tilt) - y * Math.sin(tilt));
          // domain-warped bands, sheared along jet streams
          const shear = Math.sin(lat * 24) * 0.55;
          const w1 = fbm(lon * 1.6 + shear, lat * 10, 0.7, 5);
          const w2 = fbm(lon * 3.2 + w1 * 2.2 + shear, lat * 22 + w1 * 3, 2.9, 5);
          let col = bandColor(0.5 + lat * 0.52 + w1 * 0.06 + w2 * 0.035);
          const streak = fbm(lon * 9 + shear * 2 + w2, lat * 90, 4.3, 4);
          const fine = fbm(lon * 22 + shear * 3 + w2 * 2, lat * 220, 7.1, 3);
          col = col.map((v) => v * (0.92 + streak * 0.24 + fine * 0.1));
          // dark bluish festoons trailing from the equatorial belt
          const fest = smooth(0.12, 0.4, fbm(lon * 10 + shear * 4 + w1 * 3, lat * 55, 5.5, 3)) * Math.exp(-Math.pow((lat - 0.05) / 0.09, 2));
          col = mix3(col, [78, 92, 110], fest * 0.45);
          // cooler, darker polar regions dotted with small cyclones
          const polar = smooth(0.62, 0.86, Math.abs(lat));
          if (polar > 0) {
            const cyc = smooth(0.3, 0.55, fbm(x * 36, y * 36, z * 36, 3));
            col = mix3(col, mix3([86, 94, 108], [150, 150, 150], cyc * 0.5), polar * 0.7);
          }
          // great storm
          const dl = (lat + 0.34) / 0.065, dlo = (lon - 0.35) / 0.19;
          const storm = Math.exp(-(dl * dl + dlo * dlo));
          const swirl = 0.5 + 0.5 * Math.sin(Math.atan2(dl, dlo) * 2 + Math.hypot(dl, dlo) * 5);
          col = mix3(col, [lerp(170, 206, swirl), lerp(86, 116, swirl), lerp(58, 74, swirl)], storm * 0.8);
          // small white ovals
          for (const [oLat, oLon, oR] of OVALS) {
            const a = (lat - oLat) / oR, bb = (lon - oLon) / (oR * 2.4);
            const o = Math.exp(-(a * a + bb * bb) * 1.6);
            if (o > 0.01) col = mix3(col, [244, 236, 222], o * 0.7);
          }

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
          let c = mix3(SKY, col, lightAmt);
          // bluish high haze at the limb and a warm rim where the sunrise grazes it
          const limb = Math.pow(1 - z, 3.5);
          c = mix3(c, [120, 150, 180], limb * 0.35 * smooth(-0.3, 0.4, ndl));
          const rim = Math.pow(1 - z, 3) * smooth(-0.2, 0.6, ndl);
          c = [c[0] + rim * 110, c[1] + rim * 55, c[2] + rim * 20];
          let a = clamp((1 - Math.sqrt(rr)) / edge, 0, 1);
          if (ring && zr > z) { // ring in front: translucent
            c = mix3(c, ring.col, ring.a);
            a = clamp(a + ring.a, 0, 1);
          }
          return [c[0], c[1], c[2], a * 255];
        }
        return ring ? [ring.col[0], ring.col[1], ring.col[2], ring.a * 255] : null;
      };
    }

    /* ================= moon ================= */
    function moonShader() {
      const R = 0.47;
      let s = 77;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const craters = [];
      for (let i = 0; i < 170; i++) {
        const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
        // power-law sizes: many small, a few large
        craters.push({ c: [rr * Math.cos(th), u, rr * Math.sin(th)], r: 0.012 + Math.pow(rnd(), 5) * 0.25 });
      }
      const ray = { c: norm3([-0.35, -0.25, 0.9]), r: 0.05 }; // a young, bright ray crater
      craters.push(ray);
      const height = (p) => {
        let h = fbm(p[0] * 3, p[1] * 3, p[2] * 3, 5) * 0.035 + fbm(p[0] * 24, p[1] * 24, p[2] * 24, 3) * 0.005 + noise(p[0] * 90, p[1] * 90, p[2] * 90) * 0.0012;
        for (const k of craters) {
          const dx = p[0] - k.c[0], dy = p[1] - k.c[1], dz = p[2] - k.c[2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / k.r;
          if (d < 1.5) {
            if (d < 1) h += (d * d - 1) * k.r * 0.22;
            h += Math.exp(-((d - 1) * (d - 1)) / 0.03) * k.r * 0.07;
            if (k.r > 0.12 && d < 0.18) h += (0.18 - d) * k.r * 0.5; // central peak
          }
        }
        return h;
      };
      const maria = (p) => smooth(0.04, 0.32, fbm(p[0] * 1.3 + 4, p[1] * 1.3, p[2] * 1.3, 3));
      const rays = (p) => {
        const dx = p[0] - ray.c[0], dy = p[1] - ray.c[1], dz = p[2] - ray.c[2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > 0.9) return 0;
        const ang = Math.atan2(dy, dx);
        const streak = Math.pow(Math.max(0, noise(ang * 5, 1.3, 0.2) + 0.25), 2.2);
        return streak * Math.max(0, 1 - d / 0.9) * 0.9;
      };
      return (fx, fy, W) => {
        const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
        const rr = x * x + y * y;
        const edge = 1.2 / (R * W);
        if (rr > (1 + edge) * (1 + edge)) return null;
        const z = Math.sqrt(Math.max(0, 1 - rr));
        const p = [x, y, z];
        const e = 0.01;
        const h0 = height(p);
        const hx = height(norm3([x + e, y, z])) - h0, hy = height(norm3([x, y + e, z])) - h0;
        const n = norm3([x - (hx / e) * 0.7, y - (hy / e) * 0.7, z]);
        const mu0 = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]; // incidence
        const mu = Math.max(n[2], 0.05); // emission (viewer on +z)
        // lunar photometry: Lommel-Seeliger blended with Lambert, crisp terminator
        const ls = mu0 > 0 ? (2 * mu0) / (mu0 + mu) : 0;
        let lightAmt = (0.65 * ls + 0.35 * Math.max(mu0, 0)) * smooth(-0.03, 0.08, mu0);
        const alb = (0.8 + fbm(x * 7, y * 7, z * 7, 5) * 0.2 + noise(x * 60, y * 60, z * 60) * 0.03) * (1 - 0.4 * maria(p)) + rays(p) * 0.35;
        const base = [178 * alb, 181 * alb, 186 * alb];
        let c = mix3(SKY, base, clamp(lightAmt * 0.95, 0, 1.15));
        // faint earthshine on the night side
        const shine = (1 - smooth(-0.2, 0.05, mu0)) * 0.08;
        c = [c[0] + 60 * shine * alb, c[1] + 76 * shine * alb, c[2] + 96 * shine * alb];
        const rim = Math.pow(1 - z, 4) * smooth(0, 0.6, mu0);
        c = [c[0] + rim * 60, c[1] + rim * 30, c[2] + rim * 10];
        return [c[0], c[1], c[2], clamp((1 - Math.sqrt(rr)) / edge, 0, 1) * 255];
      };
    }

    /* ================= distant world ================= */
    function farShader() {
      const R = 0.42;
      return (fx, fy, W) => {
        const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
        const rr = x * x + y * y;
        const edge = 1.5 / (R * W);
        const d = Math.sqrt(rr);
        if (d > 1.18) return null;
        if (d > 1) return [120, 180, 230, Math.pow(1 - (d - 1) / 0.18, 2) * 90];
        const z = Math.sqrt(Math.max(0, 1 - rr));
        const cloud = fbm(x * 1.4 + 2, y * 3.2, z * 1.4, 3);
        const col = mix3([40, 96, 150], [190, 214, 236], smooth(0.05, 0.4, cloud));
        const ndl = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
        const lightAmt = smooth(-0.1, 0.4, ndl) * (0.3 + 0.7 * Math.max(ndl, 0));
        const c = mix3(SKY, col, lightAmt);
        return [c[0], c[1], c[2], clamp((1 - d) / edge, 0, 1) * 255];
      };
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
          let col = [a[0] * v, a[1] * v, a[2] * v], alpha = clamp(a[3] * sunward, 0, 1);
          // thin green airglow layer high above the limb, as seen from orbit
          const ag = Math.exp(-Math.pow((h / T - 0.64) / 0.018, 2)) * (0.8 + 0.2 * noise(dx * 0.02, 0.3, 0.9));
          col = mix3(col, [150, 214, 160], ag * 0.55);
          alpha = Math.max(alpha, ag * 0.35);
          return [col[0], col[1], col[2], alpha * 255];
        }
        // on the surface: orthographic sphere coordinates
        const nx = dx / Rb, ny = -dy / Rb;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const depth = -h; // px below the limb
        // wispy, domain-warped clouds; only their tops near the limb catch the dawn
        const wx = fbm(nx * 18, ny * 18, nz * 18, 3);
        const cl = fbm(nx * 46 + wx * 1.6, ny * 46, nz * 46 + wx, 5);
        const cl2 = fbm(nx * 140 + cl, ny * 140, nz * 140, 3);
        const cl3 = noise(nx * 420 + cl2 * 2, ny * 420, nz * 420);
        const cloud = smooth(0.12, 0.42, cl + cl2 * 0.3 + cl3 * 0.06) * 0.85;
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
      const shade = kind === "giant" ? giantShader() : kind === "moon" ? moonShader() : kind === "far" ? farShader() : horizonShader(geo);
      const masked = kind === "giant" || kind === "moon";
      const d = new Uint8ClampedArray(W * H * 4);
      for (let row = 0; row < H; row++) {
        for (let col = 0; col < W; col++) {
          const fx = (col + 0.5) / W, fy = (row + 0.5) / H;
          const px = shade(fx, fy, W, H);
          if (!px) continue;
          const i = (row * W + col) * 4;
          d[i] = px[0]; d[i + 1] = px[1]; d[i + 2] = px[2];
          d[i + 3] = masked ? px[3] * fadeMask(fx, fy) : px[3];
        }
      }
      return d;
    }
    return { renderBuffer };
  }

  /* ---------- worker plumbing ---------- */
  let worker = null, jobId = 0;
  const pending = new Map();
  function getWorker() {
    if (worker !== null) return worker;
    try {
      const src = "const LIB = (" + SKYLIB.toString() + ")();" +
        "onmessage = (e) => { const { id, kind, geo, W, H } = e.data;" +
        " try { const buf = LIB.renderBuffer(kind, geo, W, H); postMessage({ id, buf }, [buf.buffer]); }" +
        " catch (err) { postMessage({ id, error: String(err) }); } };";
      worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
      worker.onmessage = (e) => {
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
    return paint(canvas, kind, null, px, px).then(() => { canvas.style.opacity = "1"; });
  }

  let horizonCanvas = null;
  function mountHorizon() {
    const sky = document.querySelector(".sky");
    const svgHost = document.querySelector(".horizon");
    if (!sky || !svgHost) return Promise.resolve();
    const sr = sky.getBoundingClientRect(), hr = svgHost.getBoundingClientRect();
    const Rg = hr.width / 2;
    const Rb = (Rg * 440) / 520;
    const T = Rg - Rb;
    const top = hr.top - sr.top;
    const W = sr.width, H = sr.height - top;
    if (H <= 0) return Promise.resolve();
    const geo = { W, H, cx: hr.left - sr.left + Rg, cy: top + Rg, Rb, T, top };
    const canvas = document.createElement("canvas");
    canvas.className = "horizon-canvas";
    canvas.style.cssText = `position:absolute;left:0;top:${top}px;width:${W}px;height:${H}px;opacity:0;transition:opacity 1.2s ease`;
    const s = scaleFor("horizon");
    return paint(canvas, "horizon", geo, Math.round(W * s), Math.round(H * s)).then(() => {
      if (horizonCanvas && horizonCanvas.parentNode) horizonCanvas.parentNode.removeChild(horizonCanvas);
      sky.insertBefore(canvas, svgHost.nextSibling);
      horizonCanvas = canvas;
      requestAnimationFrame(() => { canvas.style.opacity = "1"; svgHost.style.transition = "opacity 1.2s ease"; svgHost.style.opacity = "0"; });
    });
  }

  function start() {
    // one after another, so a phone is never asked to do everything at once
    const jobs = [() => mountHorizon(), () => mountSquare(".planet-moon", "moon"), () => mountSquare(".planet-far", "far"), () => mountSquare(".planet-giant", "giant")];
    jobs.reduce((p, job) => p.then(() => job()).catch((e) => { if (window.console) console.warn("sky render failed", e); }), Promise.resolve());
    let lastW = window.innerWidth, timer = null;
    window.addEventListener("resize", () => {
      if (Math.abs(window.innerWidth - lastW) < 2) return;
      lastW = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => { mountHorizon().catch(() => {}); }, 400);
    });
  }
  // start after the page has painted
  const kick = () => setTimeout(start, 120);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick);
})();
