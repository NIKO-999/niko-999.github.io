/* SVG natal wheel. Ascendant on the left, zodiac running counter-clockwise. */
(function (global) {
  "use strict";
  const C = 300;
  const R = { out: 294, zin: 262, tick: 255, planet: 228, deg: 205, min: 193, houseNum: 132, asp: 120 };
  const WHEEL_POINTS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "southNode", "chiron", "lilith"];
  const ELEMENT_OF = ["fire", "earth", "air", "water"];

  function pos(lon, r, rot) {
    const a = (lon - rot) * Math.PI / 180;
    return [C - r * Math.cos(a), C + r * Math.sin(a)];
  }
  const f = (n) => n.toFixed(2);

  /** Spread labels so glyphs never overlap (min separation in degrees). */
  function spread(items, minGap) {
    const arr = items.map((it) => ({ ...it, d: it.lon })).sort((a, b) => a.lon - b.lon);
    const n = arr.length;
    if (n < 2) return arr;
    for (let iter = 0; iter < 80; iter++) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        const a = arr[i], b = arr[(i + 1) % n];
        let gap = b.d - a.d;
        if (i === n - 1) gap += 360;
        if (gap < minGap) {
          const push = (minGap - gap) / 2 + 0.01;
          a.d -= push;
          b.d += push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    return arr;
  }

  function render(chart, opts) {
    opts = opts || {};
    const { SIGNS, PLANETS, ASPECTS } = global.AstroContent;
    const keys = global.AstroEngine.SIGN_KEYS;
    const rot = chart.timeKnown ? chart.asc : 0;
    const out = [];
    out.push(`<svg class="wheel" viewBox="-34 -34 668 668" role="img" aria-label="Natal chart wheel">`);
    out.push(`<defs>
      <radialGradient id="wg-core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#2c5270" stop-opacity=".5"/>
        <stop offset="100%" stop-color="#0a141d" stop-opacity=".15"/>
      </radialGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`);

    // rings
    out.push(`<circle cx="${C}" cy="${C}" r="${R.out}" class="w-ring outer"/>`);
    out.push(`<circle cx="${C}" cy="${C}" r="${R.zin}" class="w-ring"/>`);
    out.push(`<circle cx="${C}" cy="${C}" r="${R.tick}" class="w-ring faint"/>`);
    out.push(`<circle cx="${C}" cy="${C}" r="${R.asp}" fill="url(#wg-core)" class="w-ring"/>`);

    // zodiac band
    for (let i = 0; i < 12; i++) {
      const s0 = i * 30, s1 = s0 + 30;
      const [x0, y0] = pos(s0, R.out, rot), [x1, y1] = pos(s1, R.out, rot);
      const [x2, y2] = pos(s1, R.zin, rot), [x3, y3] = pos(s0, R.zin, rot);
      const el = ELEMENT_OF[i % 4];
      out.push(`<path class="w-sign el-${el}" data-sign="${keys[i]}" d="M${f(x0)} ${f(y0)} A${R.out} ${R.out} 0 0 0 ${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${R.zin} ${R.zin} 0 0 1 ${f(x3)} ${f(y3)} Z"/>`);
      const [lx, ly] = pos(s0, R.out, rot), [lx2, ly2] = pos(s0, R.zin, rot);
      out.push(`<line x1="${f(lx)}" y1="${f(ly)}" x2="${f(lx2)}" y2="${f(ly2)}" class="w-sign-div"/>`);
      const [gx, gy] = pos(s0 + 15, (R.out + R.zin) / 2, rot);
      out.push(`<text x="${f(gx)}" y="${f(gy)}" class="w-sign-glyph el-${el}" data-sign="${keys[i]}">${SIGNS[keys[i]].glyph}</text>`);
    }
    // degree ticks
    for (let d = 0; d < 360; d++) {
      const len = d % 10 === 0 ? 6 : d % 5 === 0 ? 3.5 : 2;
      const [x0, y0] = pos(d, R.zin, rot), [x1, y1] = pos(d, R.zin - len, rot);
      out.push(`<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" class="w-tick${d % 10 === 0 ? " major" : ""}"/>`);
    }

    // houses
    if (chart.timeKnown && chart.houses) {
      for (let h = 1; h <= 12; h++) {
        const lon = chart.houses[h];
        const angle = h === 1 || h === 4 || h === 7 || h === 10;
        const [x0, y0] = pos(lon, angle ? R.out + 6 : R.tick, rot), [x1, y1] = pos(lon, R.asp, rot);
        out.push(`<line x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" class="w-cusp${angle ? " angle" : ""}"/>`);
        const next = chart.houses[h === 12 ? 1 : h + 1];
        const mid = lon + (((next - lon) % 360) + 360) % 360 / 2;
        const [nx, ny] = pos(mid, R.houseNum, rot);
        out.push(`<text x="${f(nx)}" y="${f(ny)}" class="w-house-num" data-house="${h}">${h}</text>`);
      }
      const labels = [["AC", chart.asc], ["DC", chart.asc + 180], ["MC", chart.mc], ["IC", chart.mc + 180]];
      for (const [lab, lon] of labels) {
        const [x, y] = pos(lon, R.out + 16, rot);
        out.push(`<text x="${f(x)}" y="${f(y)}" class="w-angle-label">${lab}</text>`);
      }
    }

    // aspects
    const shown = chart.points.filter((p) => WHEEL_POINTS.includes(p.key));
    const lonOf = Object.fromEntries(chart.points.map((p) => [p.key, p.lon]));
    for (const a of chart.aspects) {
      if (!(a.a in lonOf) || !(a.b in lonOf)) continue;
      if (a.type === "conjunction") continue;
      if (!WHEEL_POINTS.includes(a.a) && a.a !== "asc" && a.a !== "mc") continue;
      if (!WHEEL_POINTS.includes(a.b) && a.b !== "asc" && a.b !== "mc") continue;
      const [x0, y0] = pos(lonOf[a.a], R.asp, rot), [x1, y1] = pos(lonOf[a.b], R.asp, rot);
      const op = (0.25 + 0.65 * a.strength).toFixed(2);
      out.push(`<line class="w-asp ${a.major ? "" : "minor"}" data-a="${a.a}" data-b="${a.b}" x1="${f(x0)}" y1="${f(y0)}" x2="${f(x1)}" y2="${f(y1)}" stroke="${ASPECTS[a.type].color}" stroke-opacity="${op}"/>`);
    }

    // planets
    const placed = spread(shown, 7.2);
    for (const p of placed) {
      const P = PLANETS[p.key];
      const [tx0, ty0] = pos(p.lon, R.tick, rot), [tx1, ty1] = pos(p.lon, R.tick - 4, rot);
      const [cx1, cy1] = pos(p.d, R.planet + 12, rot);
      const [gx, gy] = pos(p.d, R.planet, rot);
      const [dx, dy] = pos(p.d, R.deg, rot);
      const [mx, my] = pos(p.d, R.min, rot);
      const [ax, ay] = pos(p.lon, R.asp, rot);
      out.push(`<g class="w-planet" data-key="${p.key}" tabindex="0" role="button" aria-label="${P.name}">`);
      out.push(`<circle cx="${f(gx)}" cy="${f(gy)}" r="13" class="w-hit"/>`);
      out.push(`<line x1="${f(tx0)}" y1="${f(ty0)}" x2="${f(tx1)}" y2="${f(ty1)}" class="w-ptick" stroke="${P.color}"/>`);
      out.push(`<line x1="${f(tx1)}" y1="${f(ty1)}" x2="${f(cx1)}" y2="${f(cy1)}" class="w-connector"/>`);
      out.push(`<circle cx="${f(ax)}" cy="${f(ay)}" r="1.8" fill="${P.color}" class="w-adot"/>`);
      out.push(`<text x="${f(gx)}" y="${f(gy)}" class="w-glyph" fill="${P.color}">${P.glyph}</text>`);
      out.push(`<text x="${f(dx)}" y="${f(dy)}" class="w-deg">${p.deg}°</text>`);
      out.push(`<text x="${f(mx)}" y="${f(my)}" class="w-min">${String(p.min).padStart(2, "0")}′${p.retro ? "℞" : ""}</text>`);
      out.push(`</g>`);
    }
    out.push(`</svg>`);
    return out.join("");
  }

  global.AstroWheel = { render };
})(window);
