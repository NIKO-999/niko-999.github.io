/*
 * Procedurally rendered background planets: per-pixel sphere shading with
 * fractal noise surfaces, a ringed gas giant (ring shadow on the planet and the
 * planet's shadow on the rings), a cratered moon and a small distant world.
 * Rendered once into canvases in small slices so the page stays responsive.
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
      [p[i], p[j]] = [p[j], p[i]];
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
  function norm3(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }

  // light comes from the sunrise below the horizon: lower-left, a little in front
  const LIGHT = norm3([-0.55, -0.62, 0.56]); // y is up in planet space
  const SKY = [16, 32, 48]; // ambient tint, matches the sky so night sides melt into it

  /* ---------- slice-by-slice renderer ---------- */
  function renderInSlices(canvas, sizeCss, shade, done) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(sizeCss * dpr);
    canvas.width = W;
    canvas.height = W;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(W, W);
    const d = img.data;
    let row = 0;
    const step = () => {
      const end = Math.min(W, row + 24);
      for (; row < end; row++) {
        for (let col = 0; col < W; col++) {
          const px = shade((col + 0.5) / W, (row + 0.5) / W, W);
          if (!px) continue;
          const i = (row * W + col) * 4;
          d[i] = px[0]; d[i + 1] = px[1]; d[i + 2] = px[2]; d[i + 3] = px[3];
        }
      }
      if (row < W) requestAnimationFrame(step);
      else { ctx.putImageData(img, 0, 0); done && done(); }
    };
    requestAnimationFrame(step);
  }

  /* ---------- gas giant ---------- */
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
        const k = (t - a) / (b - a);
        return [lerp(ca[0], cb[0], k), lerp(ca[1], cb[1], k), lerp(ca[2], cb[2], k)];
      }
    }
    return BANDS[BANDS.length - 1][1];
  }

  function giantShader() {
    const R = 0.205; // planet radius as a fraction of the canvas (rings reach ~2.3R)
    const roll = (-16 * Math.PI) / 180, cr = Math.cos(roll), sr = Math.sin(roll);
    const open = (14 * Math.PI) / 180; // ring opening angle
    const N = [0, Math.cos(open), Math.sin(open)]; // ring-plane normal
    const RIN = 1.22, ROUT = 2.28;
    const tilt = 0.18; // axial tilt of the bands toward the viewer
    const ringDensity = (r) => {
      if (r < RIN || r > ROUT) return 0;
      let d = 0;
      if (r < 1.52) d = 0.18 + 0.12 * smooth(RIN, 1.52, r); // faint C ring
      else if (r < 1.95) d = 0.72 + 0.2 * Math.sin((r - 1.52) * 9); // bright B ring
      else if (r < 2.03) d = 0.04; // Cassini division
      else d = 0.5 - 0.15 * smooth(2.03, ROUT, r); // A ring
      if (r > 2.18 && r < 2.2) d *= 0.2; // Encke gap
      d *= 0.82 + 0.18 * Math.sin(r * 310) * Math.sin(r * 97); // ringlets
      d *= smooth(ROUT, ROUT - 0.03, r) * smooth(RIN, RIN + 0.03, r);
      return clamp(d, 0, 1);
    };
    return (fx, fy, W) => {
      // screen -> planet frame (undo roll, y up, unit radius)
      const sx = (fx - 0.5) / R, sy = -(fy - 0.5) / R;
      const x = sx * cr + sy * sr, y = -sx * sr + sy * cr;
      const edge = 1.2 / (R * W); // ~1px anti-aliasing
      const rr = x * x + y * y;
      let out = null;

      // ring point along the view ray
      const zr = -(N[1] * y) / N[2];
      const rRing = Math.sqrt(x * x + y * y + zr * zr);
      const dens = ringDensity(rRing);
      let ringCol = null;
      if (dens > 0) {
        // planet shadow on the rings
        const Q = [x, y, zr];
        const b = Q[0] * LIGHT[0] + Q[1] * LIGHT[1] + Q[2] * LIGHT[2];
        const c = rRing * rRing - 1;
        const inShadow = b * b - c > 0 && -b - Math.sqrt(b * b - c) > 0;
        const lit = inShadow ? 0.08 : 0.55 + 0.45 * Math.abs(N[0] * LIGHT[0] + N[1] * LIGHT[1] + N[2] * LIGHT[2]);
        const tone = 0.86 + 0.14 * Math.sin(rRing * 57);
        ringCol = [lerp(SKY[0], 226 * tone, lit), lerp(SKY[1], 204 * tone, lit), lerp(SKY[2], 170 * tone, lit), dens * 235];
      }

      if (rr < (1 + edge) * (1 + edge)) {
        const z = Math.sqrt(Math.max(0, 1 - rr));
        // bands follow latitude in a frame tilted slightly toward us
        const lat = y * Math.cos(tilt) + z * Math.sin(tilt);
        const lon = Math.atan2(x, z * Math.cos(tilt) - y * Math.sin(tilt));
        const warp = fbm(x * 2.2, lat * 9, z * 2.2, 4) * 0.09 + fbm(lon * 3, lat * 38, 1.7, 3) * 0.018;
        let col = bandColor(0.5 + lat * 0.52 + warp);
        // fine streaks along the bands
        const streak = fbm(lon * 7, lat * 70, 3.1, 3);
        col = col.map((v) => v * (0.93 + streak * 0.22));
        // storm oval
        const dl = (lat + 0.34) / 0.07, dlo = (lon - 0.35) / 0.2;
        const storm = Math.exp(-(dl * dl + dlo * dlo));
        col = [lerp(col[0], 196, storm * 0.75), lerp(col[1], 104, storm * 0.75), lerp(col[2], 70, storm * 0.75)];

        // lighting
        const ndl = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
        let lightAmt = smooth(-0.12, 0.35, ndl) * (0.25 + 0.75 * Math.max(ndl, 0));
        lightAmt *= 0.55 + 0.45 * Math.pow(z, 0.45); // limb darkening
        // ring shadow on the planet
        const nl = N[0] * LIGHT[0] + N[1] * LIGHT[1] + N[2] * LIGHT[2];
        const t = -(N[0] * x + N[1] * y + N[2] * z) / nl;
        if (t > 0) {
          const Rx = x + t * LIGHT[0], Ry = y + t * LIGHT[1], Rz = z + t * LIGHT[2];
          lightAmt *= 1 - 0.75 * ringDensity(Math.sqrt(Rx * Rx + Ry * Ry + Rz * Rz));
        }
        let r = lerp(SKY[0], col[0], lightAmt), g = lerp(SKY[1], col[1], lightAmt), bl = lerp(SKY[2], col[2], lightAmt);
        // warm atmospheric rim on the lit side
        const rim = Math.pow(1 - z, 3) * smooth(-0.2, 0.6, ndl);
        r += rim * 120; g += rim * 60; bl += rim * 24;
        const a = clamp((1 - Math.sqrt(rr)) / edge, 0, 1) * 255;
        out = [r, g, bl, a];
        // rings in front of the planet
        if (ringCol && zr > z) {
          const k = ringCol[3] / 255;
          out = [lerp(out[0], ringCol[0], k), lerp(out[1], ringCol[1], k), lerp(out[2], ringCol[2], k), 255 * clamp(out[3] / 255 + k, 0, 1)];
        }
        return out;
      }
      return ringCol;
    };
  }

  /* ---------- cratered moon ---------- */
  function moonShader() {
    const R = 0.47;
    let s = 77;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const craters = [];
    for (let i = 0; i < 46; i++) {
      const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
      craters.push({ c: [rr * Math.cos(th), u, rr * Math.sin(th)], r: 0.035 + Math.pow(rnd(), 3) * 0.22 });
    }
    const height = (p) => {
      let h = fbm(p[0] * 3, p[1] * 3, p[2] * 3, 4) * 0.04;
      for (const k of craters) {
        const dx = p[0] - k.c[0], dy = p[1] - k.c[1], dz = p[2] - k.c[2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) / k.r;
        if (d < 1.4) {
          h += d < 1 ? (d * d - 1) * k.r * 0.22 : 0; // bowl
          h += Math.exp(-((d - 1) * (d - 1)) / 0.03) * k.r * 0.07; // raised rim
        }
      }
      return h;
    };
    const maria = (p) => smooth(0.05, 0.3, fbm(p[0] * 1.3 + 4, p[1] * 1.3, p[2] * 1.3, 3));
    return (fx, fy, W) => {
      const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
      const rr = x * x + y * y;
      const edge = 1.2 / (R * W);
      if (rr > (1 + edge) * (1 + edge)) return null;
      const z = Math.sqrt(Math.max(0, 1 - rr));
      const p = [x, y, z];
      // bump-mapped normal from the height field
      const e = 0.012;
      const h0 = height(p);
      const hx = height(norm3([x + e, y, z])) - h0, hy = height(norm3([x, y + e, z])) - h0;
      const n = norm3([x - hx / e * 0.7, y - hy / e * 0.7, z]);
      const ndl = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
      let lightAmt = smooth(-0.08, 0.3, ndl) * (0.2 + 0.8 * Math.max(ndl, 0));
      const alb = (0.8 + fbm(x * 6, y * 6, z * 6, 4) * 0.2) * (1 - 0.38 * maria(p));
      const base = [186 * alb, 190 * alb, 196 * alb];
      let r = lerp(SKY[0], base[0], lightAmt), g = lerp(SKY[1], base[1], lightAmt), b = lerp(SKY[2], base[2], lightAmt);
      const rim = Math.pow(1 - z, 4) * smooth(0, 0.6, ndl);
      r += rim * 70; g += rim * 36; b += rim * 12;
      return [r, g, b, clamp((1 - Math.sqrt(rr)) / edge, 0, 1) * 255];
    };
  }

  /* ---------- distant blue world ---------- */
  function farShader() {
    const R = 0.42;
    return (fx, fy, W) => {
      const x = (fx - 0.5) / R, y = -(fy - 0.5) / R;
      const rr = x * x + y * y;
      const edge = 1.5 / (R * W);
      const d = Math.sqrt(rr);
      if (d > 1.18) return null;
      if (d > 1) { // thin atmosphere halo
        const a = Math.pow(1 - (d - 1) / 0.18, 2) * 90;
        return [120, 180, 230, a];
      }
      const z = Math.sqrt(Math.max(0, 1 - rr));
      const cloud = fbm(x * 1.4 + 2, y * 3.2, z * 1.4, 3);
      const col = [lerp(40, 190, smooth(0.05, 0.4, cloud)), lerp(96, 214, smooth(0.05, 0.4, cloud)), lerp(150, 236, smooth(0.05, 0.4, cloud))];
      const ndl = x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2];
      const lightAmt = smooth(-0.1, 0.4, ndl) * (0.3 + 0.7 * Math.max(ndl, 0));
      return [lerp(SKY[0], col[0], lightAmt), lerp(SKY[1], col[1], lightAmt), lerp(SKY[2], col[2], lightAmt), clamp((1 - d) / edge, 0, 1) * 255];
    };
  }

  function mount(selector, shader) {
    const host = document.querySelector(selector);
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s ease";
    host.innerHTML = "";
    host.appendChild(canvas);
    const size = host.getBoundingClientRect().width || 200;
    renderInSlices(canvas, size, shader, () => { canvas.style.opacity = "1"; });
  }

  function start() {
    mount(".planet-far", farShader());
    mount(".planet-moon", moonShader());
    mount(".planet-giant", giantShader());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else setTimeout(start, 0);
})();
