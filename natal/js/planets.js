/*
 * Procedurally rendered sky: per-pixel shaded planets.
 *  - Horizon planet: a vast sphere with the sun just behind its limb. Layered
 *    atmosphere (red at the surface through orange and amber into blue haze),
 *    dawn-lit cloud systems near the limb and faint city lights on the night side.
 *  - Gas giant: domain-warped latitude bands with jet shear, white ovals, a
 *    storm, limb haze; rings with C/B/A structure, gaps, ringlets, colour
 *    variation, translucency and mutual shadows.
 *  - Moon: bump-mapped craters with a power-law size spread, central peaks,
 *    a ray crater, maria, lunar (Lommel-Seeliger) photometry and earthshine.
 *  - A small cloudy world with a thin halo.
 * Everything renders once, in small time slices, so the page stays responsive.
 */
(function () {
  "use strict";

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
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);
  const HIGH = () => Math.min(window.devicePixelRatio || 1, 3); // full sharpness on 3x phone screens

  /* ---------- slice-by-slice renderer (any rectangle) ---------- */
  function renderRect(canvas, wCss, hCss, shade, done, scale) {
    const dpr = scale || DPR();
    const W = Math.max(1, Math.round(wCss * dpr)), H = Math.max(1, Math.round(hCss * dpr));
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(W, H);
    const d = img.data;
    let row = 0;
    const step = () => {
      const t0 = performance.now();
      while (row < H && performance.now() - t0 < 14) {
        for (let col = 0; col < W; col++) {
          const px = shade((col + 0.5) / W, (row + 0.5) / H, W, H);
          if (!px) continue;
          const i = (row * W + col) * 4;
          d[i] = px[0]; d[i + 1] = px[1]; d[i + 2] = px[2]; d[i + 3] = px[3];
        }
        row++;
      }
      if (row < H) setTimeout(step, 0);
      else { ctx.putImageData(img, 0, 0); done && done(); }
    };
    setTimeout(step, 0);
  }

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

  /* ---------- mounting ---------- */
  function mountSquare(selector, shader) {
    const host = document.querySelector(selector);
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s ease";
    host.innerHTML = "";
    host.appendChild(canvas);
    const size = host.getBoundingClientRect().width || 200;
    renderRect(canvas, size, size, shader, () => {
      canvas.style.opacity = "1";
      if (HIGH() <= 1) return;
      // then a full-resolution pass, swapped in when it is done
      const sharp = document.createElement("canvas");
      sharp.style.cssText = "width:100%;height:100%;display:block";
      renderRect(sharp, size, size, shader, () => { if (canvas.parentNode === host) host.replaceChild(sharp, canvas); }, HIGH());
    }, 1);
  }

  let horizonCanvas = null;
  function mountHorizon() {
    const sky = document.querySelector(".sky");
    const svgHost = document.querySelector(".horizon");
    if (!sky || !svgHost) return;
    const sr = sky.getBoundingClientRect(), hr = svgHost.getBoundingClientRect();
    const Rg = hr.width / 2; // glow radius from the SVG geometry
    const Rb = (Rg * 440) / 520;
    const T = Rg - Rb;
    const top = hr.top - sr.top; // where the glow begins inside .sky
    const W = sr.width, H = sr.height - top;
    if (H <= 0) return;
    const geo = { W, H, cx: hr.left - sr.left + Rg, cy: top + Rg, Rb, T, top };
    if (!horizonCanvas) {
      horizonCanvas = document.createElement("canvas");
      horizonCanvas.className = "horizon-canvas";
      sky.insertBefore(horizonCanvas, svgHost.nextSibling);
    }
    horizonCanvas.style.cssText = `position:absolute;left:0;top:${top}px;width:${W}px;height:${H}px;opacity:0;transition:opacity 1.4s ease`;
    const shader = horizonShader(geo);
    const target = horizonCanvas;
    renderRect(target, W, H, shader, () => {
      target.style.opacity = "1";
      svgHost.style.transition = "opacity 1.4s ease";
      svgHost.style.opacity = "0";
      if (HIGH() <= 1) return;
      const sharp = document.createElement("canvas");
      sharp.className = "horizon-canvas";
      sharp.style.cssText = target.style.cssText.replace("opacity: 0", "opacity: 1").replace(/opacity:\s*0;/, "opacity:1;");
      sharp.style.opacity = "1";
      renderRect(sharp, W, H, shader, () => {
        if (target.parentNode) { target.parentNode.replaceChild(sharp, target); horizonCanvas = sharp; }
      }, HIGH());
    }, 1);
  }

  function start() {
    // each piece is independent: a failure in one never stops the others
    const jobs = [
      () => mountHorizon(),
      () => mountSquare(".planet-far", farShader()),
      () => mountSquare(".planet-moon", moonShader()),
      () => mountSquare(".planet-giant", giantShader()),
    ];
    for (const job of jobs) {
      try { job(); } catch (e) { if (window.console) console.warn("sky render failed", e); }
    }
    // redraw the horizon if the width changes (rotation, window resize)
    let lastW = window.innerWidth, timer = null;
    window.addEventListener("resize", () => {
      if (Math.abs(window.innerWidth - lastW) < 2) return;
      lastW = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(() => { try { mountHorizon(); } catch (e) { /* keep the SVG horizon */ } }, 400);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else setTimeout(start, 0);
})();
