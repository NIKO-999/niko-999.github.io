/* Backdrop extras: the reader's Sun-sign constellation,
   drawn faintly in the sky, and a colour mood that shifts with the tab. Opacity-only transitions,
   so the phone's compositor handles them without redrawing. */
(function () {
  "use strict";
  const sky = document.querySelector(".sky");
  if (!sky) return;
  // the constellation is still on trial in the artifact; the tab moods are on everywhere
  const withStars = !!window.NATAL_EMBED;
  // stylised star patterns in a 100 x 100 box: [x, y, brightness 1 to 3], then lines between star indexes
  const C = {
    aries: [[[8, 44, 2], [34, 30, 3], [56, 30, 2], [80, 46, 1]], [[0, 1], [1, 2], [2, 3]]],
    taurus: [[[6, 16, 2], [36, 44, 1], [46, 58, 3], [58, 50, 1], [92, 20, 2], [54, 66, 1]], [[0, 1], [1, 2], [2, 5], [5, 3], [3, 4]]],
    gemini: [[[22, 8, 3], [42, 6, 3], [26, 34, 1], [46, 34, 1], [30, 60, 2], [52, 62, 1], [28, 88, 1], [56, 90, 2]], [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [2, 3]]],
    cancer: [[[50, 50, 2], [56, 30, 1], [46, 12, 2], [20, 86, 2], [80, 82, 1]], [[0, 1], [1, 2], [0, 3], [0, 4]]],
    leo: [[[24, 72, 3], [26, 50, 1], [36, 34, 2], [52, 28, 1], [60, 40, 1], [62, 70, 2], [92, 76, 2], [70, 52, 1]], [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 4], [5, 7]]],
    virgo: [[[18, 18, 1], [34, 34, 2], [50, 46, 1], [56, 86, 3], [76, 36, 1], [92, 24, 2], [30, 56, 1]], [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [1, 6]]],
    libra: [[[20, 62, 2], [40, 24, 3], [70, 30, 2], [80, 66, 1], [74, 88, 1]], [[0, 1], [1, 2], [2, 3], [1, 3], [3, 4]]],
    scorpio: [[[16, 10, 1], [22, 26, 2], [30, 12, 1], [36, 40, 3], [44, 54, 1], [52, 68, 1], [62, 78, 1], [76, 82, 1], [86, 74, 2], [88, 60, 1]], [[0, 1], [2, 1], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]]],
    sagittarius: [[[20, 56, 2], [36, 44, 2], [50, 40, 2], [62, 56, 2], [46, 72, 1], [28, 72, 2], [40, 28, 1], [80, 46, 1], [82, 70, 1]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6], [6, 2], [3, 7], [7, 8], [8, 4]]],
    capricorn: [[[10, 24, 2], [30, 56, 1], [54, 82, 2], [76, 72, 1], [92, 40, 3], [60, 46, 1]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]],
    aquarius: [[[12, 20, 2], [28, 30, 1], [44, 24, 2], [56, 40, 1], [50, 56, 1], [64, 66, 2], [80, 60, 1], [90, 82, 1]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]]],
    pisces: [[[8, 70, 1], [15, 60, 1], [23, 68, 1], [15, 78, 1], [36, 82, 1], [56, 92, 3], [70, 56, 1], [82, 22, 2], [90, 10, 1]], [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [5, 6], [6, 7], [7, 8]]],
  };
  const wrap = document.createElement("div");
  wrap.className = "sky-constellation";
  const moods = document.createElement("div");
  moods.className = "sky-moods";
  moods.innerHTML = ["chart", "story", "today", "progressed", "return", "synastry", "planets", "houses", "aspects", "karmic"].map((m) => `<i class="mood-${m}"></i>`).join("");
  const nebula = sky.querySelector(".nebula");
  sky.insertBefore(moods, nebula ? nebula.nextSibling : sky.firstChild);
  sky.insertBefore(wrap, moods.nextSibling);
  // the birth sky (artifact trial): the Chart tab's sky tinted to how it looked at the birth minute
  const birth = document.createElement("div");
  birth.className = "sky-birth";
  sky.insertBefore(birth, moods);
  const birthTint = (b) => {
    if (!b) return "";
    const { alt, rising } = b;
    if (alt < -18) return "linear-gradient(180deg, rgba(4, 8, 22, 0.62) 0%, rgba(8, 14, 34, 0.45) 60%, rgba(10, 16, 30, 0.2) 85%, transparent 100%)";
    if (alt < -6) return "linear-gradient(180deg, rgba(20, 22, 60, 0.5) 0%, rgba(70, 60, 140, 0.28) 55%, " + (rising ? "rgba(150, 110, 170, 0.22)" : "rgba(120, 80, 150, 0.22)") + " 82%, transparent 100%)";
    if (alt < 0) return rising
      ? "linear-gradient(180deg, rgba(40, 40, 90, 0.3) 0%, rgba(150, 110, 170, 0.22) 45%, rgba(255, 150, 140, 0.34) 75%, rgba(255, 190, 140, 0.3) 86%, transparent 100%)"
      : "linear-gradient(180deg, rgba(40, 30, 80, 0.32) 0%, rgba(160, 90, 140, 0.24) 45%, rgba(255, 120, 90, 0.36) 76%, rgba(255, 160, 100, 0.3) 86%, transparent 100%)";
    if (alt < 15) return rising
      ? "linear-gradient(180deg, rgba(120, 160, 220, 0.12) 0%, rgba(255, 210, 170, 0.18) 55%, rgba(255, 200, 140, 0.28) 84%, transparent 100%)"
      : "linear-gradient(180deg, rgba(90, 120, 180, 0.12) 0%, rgba(255, 180, 120, 0.2) 55%, rgba(255, 150, 90, 0.32) 84%, transparent 100%)";
    if (alt < 45) return "linear-gradient(180deg, rgba(120, 175, 235, 0.2) 0%, rgba(170, 210, 245, 0.16) 60%, rgba(255, 230, 190, 0.12) 85%, transparent 100%)";
    return "linear-gradient(180deg, rgba(110, 175, 245, 0.3) 0%, rgba(160, 210, 250, 0.22) 60%, rgba(240, 240, 220, 0.12) 85%, transparent 100%)";
  };
  let sign = null, mood = null, birthKey = null;
  function draw(k) {
    const d = C[k];
    if (!d) { wrap.innerHTML = ""; return; }
    const [stars, lines] = d;
    wrap.innerHTML = `<svg viewBox="-6 -6 112 112" preserveAspectRatio="xMidYMid meet">
      ${lines.map(([a, b]) => `<line x1="${stars[a][0]}" y1="${stars[a][1]}" x2="${stars[b][0]}" y2="${stars[b][1]}"/>`).join("")}
      ${stars.map(([x, y, m], i) => `<circle cx="${x}" cy="${y}" r="${0.9 + m * 0.55}" style="animation-delay:${(i * 0.7) % 4}s"/>`).join("")}
    </svg>`;
  }
  window.AstroSkyExtras = {
    update(tab, sunSign, b) {
      if (withStars) {
        const key = b ? Math.round(b.alt) + (b.rising ? "r" : "s") : "";
        if (key !== birthKey) { birthKey = key; birth.style.background = birthTint(b); }
        birth.classList.toggle("on", !!b && tab === "chart");
      }
      if (withStars && sunSign !== sign) {
        sign = sunSign;
        wrap.classList.remove("on");
        // fade the old pattern out, then draw and fade in the new one
        setTimeout(() => { draw(sign); requestAnimationFrame(() => wrap.classList.toggle("on", !!sign)); }, sign ? 400 : 0);
      }
      if (tab !== mood) {
        mood = tab;
        for (const el of moods.children) el.classList.toggle("on", el.className.replace(" on", "") === `mood-${tab}`);
      }
    },
  };
})();
