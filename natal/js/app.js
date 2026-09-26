(function () {
  "use strict";
  const E = window.AstroEngine;
  const K = window.AstroContent;
  const { SIGNS, PLANETS, HOUSES, ASPECTS } = K;
  const SIGN_KEYS = E.SIGN_KEYS;

  /* ------------------------------------------------------------------ */
  /* storage                                                            */
  /* ------------------------------------------------------------------ */
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem("natal." + k);
        return v ? JSON.parse(v) : d;
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem("natal." + k, JSON.stringify(v));
      } catch (e) { /* storage unavailable */ }
    },
  };

  const DEFAULT_SETTINGS = { v: 2, houseSystem: "placidus", nodeType: "mean", zodiac: "tropical", minorAspects: true, orbScale: 1 };
  const storedSettings = store.get("settings", {});
  // v2 made the mean node the default (matching Astro-Seek); drop the old default from earlier saves
  if (!storedSettings.v) delete storedSettings.nodeType;
  const state = {
    settings: Object.assign({}, DEFAULT_SETTINGS, storedSettings, { v: 2 }),
    saved: store.get("saved", []),
    record: null,
    chart: null,
    tab: "chart",
    aspectFilter: "all",
    focus: null,
  };

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const ord = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
  const pad = (n) => String(n).padStart(2, "0");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sym = (s) => `<span class="sym">${s}</span>`;
  const signGlyph = (k) => sym(SIGNS[k].glyph);
  const pName = (k) => PLANETS[k].name;
  const pShort = (k) => PLANETS[k].short || PLANETS[k].name;
  const pGlyph = (k) => PLANETS[k].glyph;
  const degStr = (p) => `${p.deg}°${pad(p.min)}′`;
  const degFull = (p) => `${p.deg}°${pad(p.min)}′${pad(p.sec)}″`;
  const orbStr = (o) => `${Math.floor(o)}°${pad(Math.floor((o % 1) * 60))}′`;
  const signOf = (lon) => SIGN_KEYS[Math.floor(E.norm(lon) / 30)];
  const opposite = (k) => SIGN_KEYS[(SIGN_KEYS.indexOf(k) + 6) % 12];
  const isPlural = (phrase) => / and |, /.test(phrase);
  const PLANET_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
  const ELEMENT_KEYS = ["fire", "earth", "air", "water"];
  const MODE_KEYS = ["cardinal", "fixed", "mutable"];

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function fmtDate(r) {
    return `${pad(r.d)} ${MONTHS[r.mo - 1]} ${r.y}`;
  }
  function fmtTime(r) {
    return r.timeKnown ? `${pad(r.h)}:${pad(r.mi)}` : "Time unknown";
  }
  function fmtCoord(lat, lon) {
    const a = Math.abs(lat), b = Math.abs(lon);
    const dm = (x) => `${Math.floor(x)}°${pad(Math.round((x % 1) * 60) % 60)}′`;
    return `${dm(a)}${lat >= 0 ? "N" : "S"} ${dm(b)}${lon >= 0 ? "E" : "W"}`;
  }
  function fmtOffset(min) {
    const s = min >= 0 ? "+" : "−";
    const a = Math.abs(min);
    return `UTC${s}${Math.floor(a / 60)}${a % 60 ? ":" + pad(a % 60) : ""}`;
  }
  function fmtMonthYear(d) {
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }

  /* ------------------------------------------------------------------ */
  /* chart computation                                                  */
  /* ------------------------------------------------------------------ */
  function birthUtc(r) {
    const h = r.timeKnown ? r.h : 12, mi = r.timeKnown ? r.mi : 0;
    if (typeof r.offsetOverride === "number") {
      return { date: new Date(Date.UTC(r.y, r.mo - 1, r.d, h, mi) - r.offsetOverride * 60000), offset: r.offsetOverride };
    }
    return E.zonedToUtc(r.y, r.mo, r.d, h, mi, r.place.tz);
  }

  function compute(record) {
    const { date, offset } = birthUtc(record);
    const chart = E.computeChart(
      { utc: date, lat: record.place.lat, lon: record.place.lon, timeKnown: record.timeKnown },
      state.settings
    );
    chart.offset = offset;
    chart.record = record;
    chart.derived = derive(chart);
    return chart;
  }

  function rulerOf(sign) {
    return SIGNS[sign].ruler;
  }

  /** Marc Edmund Jones chart patterns, from the 10 planets' spread around the wheel. */
  function chartShape(planets) {
    const pts = planets.map((p) => ({ key: p.key, lon: p.lon })).sort((a, b) => a.lon - b.lon);
    const n = pts.length;
    const gaps = pts.map((p, i) => {
      const next = pts[(i + 1) % n];
      return { from: p, to: next, size: E.norm(next.lon - p.lon) || (n === 1 ? 360 : 0) };
    }).sort((a, b) => b.size - a.size);
    const g1 = gaps[0], g2 = gaps[1];
    if (g1.size >= 240) return { type: "bundle" };
    if (g1.size >= 180) return { type: "bowl", leader: g1.to.key };
    // bucket: one planet alone, the other nine within 180°
    for (const handle of pts) {
      const rest = pts.filter((p) => p !== handle);
      const rg = rest.map((p, i) => E.norm(rest[(i + 1) % rest.length].lon - p.lon));
      const maxGap = Math.max(...rg);
      if (maxGap >= 180) {
        const d = rest.map((p) => Math.abs(E.diff(p.lon, handle.lon)));
        if (Math.min(...d) >= 60) return { type: "bucket", handle: handle.key };
      }
    }
    if (g1.size >= 120) return { type: "locomotive", leader: g1.to.key };
    if (g1.size >= 60 && g2.size >= 60) return { type: "seesaw" };
    const occupiedSigns = new Set(planets.map((p) => p.sign)).size;
    if (g1.size <= 60 && occupiedSigns >= 7) return { type: "splash" };
    return { type: "splay" };
  }

  function derive(c) {
    const get = (k) => c.get(k);
    const planets = PLANET_KEYS.map(get);
    const units = planets.slice();
    if (c.timeKnown) units.push(get("asc"), get("mc"));
    const elements = { fire: [], earth: [], air: [], water: [] };
    const modes = { cardinal: [], fixed: [], mutable: [] };
    for (const p of units) {
      elements[SIGNS[p.sign].element].push(p.key);
      modes[SIGNS[p.sign].mode].push(p.key);
    }
    const domEl = ELEMENT_KEYS.slice().sort((a, b) => elements[b].length - elements[a].length)[0];
    const lackEl = ELEMENT_KEYS.filter((k) => elements[k].length === 0);
    const domMode = MODE_KEYS.slice().sort((a, b) => modes[b].length - modes[a].length)[0];

    // hemispheres (by house when known)
    let above = 0, below = 0, east = 0, west = 0;
    if (c.timeKnown) {
      for (const p of planets) {
        if (p.house >= 7) above++; else below++;
        if (p.house >= 10 || p.house <= 3) east++; else west++;
      }
    }

    const chartRuler = c.timeKnown ? rulerOf(get("asc").sign) : null;

    // dominant planet score
    const score = {};
    for (const p of planets) {
      let s = p.key === "sun" || p.key === "moon" ? 2 : 1;
      if (p.key === chartRuler) s += 4;
      if (p.dignity === "domicile") s += 3;
      if (p.dignity === "exaltation") s += 2;
      if (c.timeKnown && [1, 4, 7, 10].includes(p.house)) s += 2.5;
      if (c.timeKnown && p.house === 1) s += 1;
      for (const a of c.aspects) if ((a.a === p.key || a.b === p.key) && a.major) s += 0.4 + a.strength * 0.6;
      // rulership of luminaries & ascendant
      if (rulerOf(get("sun").sign) === p.key) s += 2;
      if (rulerOf(get("moon").sign) === p.key) s += 1.5;
      for (const q of planets) if (q !== p && rulerOf(q.sign) === p.key) s += 0.5;
      score[p.key] = s;
    }
    const domPlanet = Object.keys(score).sort((a, b) => score[b] - score[a])[0];

    // dominant sign
    const signScore = Object.fromEntries(SIGN_KEYS.map((k) => [k, 0]));
    for (const p of planets) signScore[p.sign] += p.key === "sun" || p.key === "moon" ? 3 : ["mercury", "venus", "mars"].includes(p.key) ? 2 : 1;
    if (c.timeKnown) signScore[get("asc").sign] += 3;
    const domSign = SIGN_KEYS.slice().sort((a, b) => signScore[b] - signScore[a])[0];

    // stelliums
    const bySign = {}, byHouse = {};
    for (const p of planets) {
      (bySign[p.sign] = bySign[p.sign] || []).push(p.key);
      if (c.timeKnown) (byHouse[p.house] = byHouse[p.house] || []).push(p.key);
    }
    const stelliums = [];
    for (const [s, list] of Object.entries(bySign)) if (list.length >= 3) stelliums.push({ kind: "sign", where: s, members: list });
    for (const [h, list] of Object.entries(byHouse)) if (list.length >= 3) stelliums.push({ kind: "house", where: +h, members: list });

    const phase = K.MOON_PHASES.slice().reverse().find((ph) => c.moonPhaseAngle >= ph.from);
    const shape = chartShape(planets);
    const quadrants = { 1: [], 2: [], 3: [], 4: [] };
    if (c.timeKnown) for (const p of planets) quadrants[Math.ceil(p.house / 3)].push(p.key);
    const STATION = { mercury: 0.15, venus: 0.09, mars: 0.05, jupiter: 0.016, saturn: 0.009, uranus: 0.004, neptune: 0.0025, pluto: 0.0025 };
    const stationary = planets.filter((p) => STATION[p.key] && Math.abs(p.speed) < STATION[p.key]).map((p) => p.key);

    return { shape, quadrants, stationary, elements, modes, domEl, lackEl, domMode, above, below, east, west, chartRuler, domPlanet, score, domSign, stelliums, phase };
  }

  /* ------------------------------------------------------------------ */
  /* interpretation text                                                */
  /* ------------------------------------------------------------------ */
  function signText(p) {
    const S = SIGNS[p.sign];
    const P = PLANETS[p.key];
    switch (p.key) {
      case "sun": return S.sun;
      case "moon": return S.moon;
      case "asc": return S.rising;
      case "northNode": return S.nn;
      case "chiron": return S.chiron;
      case "southNode": {
        const opp = SIGNS[opposite(p.sign)];
        return `Your comfort zone and past-life mastery lie in ${S.name} territory — ${S.gifts}. These come naturally, but leaning on them too hard (${S.shadow}) keeps you circling the familiar. Offer them in service of your North Node in ${opp.name}.`;
      }
      case "lilith":
        return `The exiled, untamed part of you expresses ${S.how}. At some point, the ${S.name} themes of ${S.keywords[0]} and ${S.keywords[1]} may have been shamed or suppressed. Reclaiming them as raw, sovereign power — without apology — is the work. Denied, Lilith can surface as ${S.shadow}.`;
      case "fortune":
        return `Joy and prosperity come most easily when you live ${S.how}, drawing on ${S.gifts}.`;
      case "vertex":
        return `Fated encounters tend to carry ${S.name} qualities: people and turning points that arrive ${S.how} and awaken ${S.keywords[0]} in you.`;
      case "mc":
        return `Your public calling is expressed ${S.how}. Career paths that use ${S.gifts} bring recognition; the ${S.name} shadow to watch at work is ${S.shadow}.`;
      default:
        return `${P.lead} ${S.how}. In ${S.name}, ${P.name} gains ${S.gifts}; watch for ${S.shadow}.`;
    }
  }

  function houseText(p) {
    if (!p.house || p.key === "asc" || p.key === "mc") return "";
    const H = HOUSES[p.house];
    const P = PLANETS[p.key];
    return `With ${P.name} in the ${ord(p.house)} house, ${P.focus} ${isPlural(P.focus) ? "are" : "is"} channelled into ${H.areas}. ${H.desc}`;
  }

  function aspectText(a) {
    const A1 = PLANETS[a.a], A2 = PLANETS[a.b], X = ASPECTS[a.type];
    const lead = cap(A1.core);
    return `${lead} ${X.verb} ${A2.core}. ${X.desc} ${K.NATURE[a.nature]}`;
  }

  function housesRuledBy(key) {
    if (!state.chart.timeKnown) return [];
    const out = [];
    for (let h = 1; h <= 12; h++) {
      const s = signOf(state.chart.houses[h]);
      if (SIGNS[s].ruler === key || SIGNS[s].tradRuler === key) out.push(h);
    }
    return out;
  }

  function interceptions() {
    const c = state.chart;
    if (!c.timeKnown) return {};
    const res = {};
    for (let i = 0; i < 12; i++) {
      const s0 = i * 30 + 0.001, s1 = i * 30 + 29.999;
      const cuspInSign = [...Array(12).keys()].some((h) => signOf(c.houses[h + 1]) === SIGN_KEYS[i]);
      if (cuspInSign) continue;
      const h0 = houseOfLon(s0), h1 = houseOfLon(s1);
      if (h0 === h1) (res[h0] = res[h0] || []).push(SIGN_KEYS[i]);
    }
    return res;
  }
  function houseOfLon(lon) {
    const cusps = state.chart.houses;
    for (let h = 1; h <= 12; h++) {
      const start = cusps[h], end = cusps[h === 12 ? 1 : h + 1];
      if (E.norm(lon - start) < E.norm(end - start)) return h;
    }
    return 1;
  }

  /* deep interpretation library (js/deep-*.js), with graceful fallback */
  const D = () => window.AstroDeep || {};
  const ASPECT_ORDER = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode", "lilith", "asc", "mc"];
  function deepPlanetSign(key, sign) {
    const d = D();
    if (key === "sun" || key === "moon" || key === "asc") return d.bigThree && d.bigThree[key] && d.bigThree[key][sign];
    for (const src of [d.planetSigns1, d.planetSigns2]) if (src && src[key] && src[key][sign]) return src[key][sign];
    return null;
  }
  function deepPlanetHouse(key, h) {
    const d = D();
    for (const src of [d.planetHouses1, d.planetHouses2]) if (src && src[key] && src[key][h]) return src[key][h];
    return null;
  }
  function deepAspect(a, b) {
    const d = D();
    const [x, y] = ASPECT_ORDER.indexOf(a) < ASPECT_ORDER.indexOf(b) ? [a, b] : [b, a];
    const k = x + "|" + y;
    return (d.aspects1 && d.aspects1[k]) || (d.aspects2 && d.aspects2[k]) || null;
  }
  const deepSign = (k) => (D().signs && D().signs[k]) || null;
  const deepHouse = (h) => (D().houses && D().houses[h]) || null;
  const deepAxis = (nnSign) => (D().nodeAxes && D().nodeAxes[nnSign]) || null;
  const deepNodeHouse = (h) => (D().nodeHouses && D().nodeHouses[h]) || null;
  const deepBalance = (k) => (D().balance && D().balance[k]) || null;

  /* ------------------------------------------------------------------ */
  /* rendering: shared bits                                             */
  /* ------------------------------------------------------------------ */
  const view = $("#view");
  const tabs = $("#tabs");

  function setTab(tab) {
    state.tab = tab;
    state.focus = null;
    for (const b of tabs.querySelectorAll("button")) b.setAttribute("aria-selected", String(b.dataset.tab === tab));
    const active = tabs.querySelector(`[data-tab="${tab}"]`);
    if (active && active.scrollIntoView) active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    render();
    window.scrollTo({ top: 0 });
  }

  function render() {
    tabs.classList.toggle("disabled", !state.chart);
    if (!state.chart) view.style.removeProperty("--theme");
    if (!state.chart) {
      for (const b of tabs.querySelectorAll("button")) b.setAttribute("aria-selected", "false");
      view.innerHTML = renderForm();
      bindForm();
    } else {
      const fn = { chart: renderChart, today: renderToday, planets: renderPlanets, houses: renderHouses, aspects: renderAspects, karmic: renderKarmic }[state.tab];
      if (TAB_THEME[state.tab]) view.style.setProperty("--theme", TAB_THEME[state.tab]);
      else view.style.removeProperty("--theme");
      view.innerHTML = fn();
      bindView();
    }
    view.style.animation = "none";
    void view.offsetWidth;
    view.style.animation = "";
  }

  function pointRow(p, opts) {
    opts = opts || {};
    const P = PLANETS[p.key];
    const sub = [];
    sub.push(SIGNS[p.sign].name);
    if (p.house) sub.push(`House ${p.house}`);
    if (p.dignity) sub.push(p.dignity);
    return `<button class="row" data-open="point:${p.key}">
      <span class="dot" style="color:${P.color}"></span>
      <span class="glyph" style="color:${P.color}">${P.glyph}</span>
      <span class="main"><div class="title">${esc(opts.title || P.name)}</div><div class="sub">${esc(sub.join(" · "))}</div></span>
      <span class="end"><div class="pos">${degStr(p)}${signGlyph(p.sign)}${p.retro ? '<span class="retro">℞</span>' : ""}</div>
      ${opts.endSub ? `<div class="pos-sub">${opts.endSub}</div>` : ""}</span>
    </button>`;
  }

  /* ------------------------------------------------------------------ */
  /* CHART tab                                                          */
  /* ------------------------------------------------------------------ */
  function renderChart() {
    const c = state.chart, r = c.record, d = c.derived;
    const sun = c.get("sun"), moon = c.get("moon"), asc = c.timeKnown ? c.get("asc") : null;
    const parts = [
      `<strong>${sym(PLANETS.sun.glyph)} ${SIGNS[sun.sign].name}</strong>`,
      `${sym(PLANETS.moon.glyph)} ${SIGNS[moon.sign].name}`,
    ];
    if (asc) parts.push(`↑ ${SIGNS[asc.sign].name}`);

    let html = `<section class="hero">
      <div class="eyebrow">Natal<span class="sep">·</span>${esc(fmtDate(r))}<span class="sep">·</span>${esc(r.timeKnown ? fmtTime(r) : "noon")}</div>
      <h1 class="display">${esc(r.name || "Your Chart")}</h1>
      <div class="subline">${parts.join(' <span style="opacity:.6">·</span> ')}</div>
      <div class="meta">${esc(r.place.name)} · ${fmtCoord(r.place.lat, r.place.lon)} · ${fmtOffset(c.offset)}<br>${esc(K.HOUSE_SYSTEMS[c.houseSystemUsed])} · ${state.settings.zodiac === "sidereal" ? "Sidereal (Lahiri)" : "Tropical"} · ${state.settings.nodeType === "true" ? "True" : "Mean"} node</div>
      ${!c.timeKnown ? `<p class="note">Birth time unknown — the chart is cast for local noon. Houses, Ascendant and Midheaven are hidden and the Moon may be up to ±7° off.</p>` : ""}
      ${c.timeKnown && c.houseSystemUsed !== state.settings.houseSystem ? `<p class="note">${esc(K.HOUSE_SYSTEMS[state.settings.houseSystem])} houses are undefined at this latitude — Porphyry is used instead.</p>` : ""}
    </section>`;

    html += `<div class="wheel-wrap" id="wheel-wrap">${window.AstroWheel.render(c)}</div>
      <div class="wheel-hint" id="wheel-hint">Tap a planet to trace its aspects</div>`;

    // big three
    html += `<div class="section-label">The Big Three</div><div class="list">`;
    html += pointRow(sun, { title: `Sun in ${SIGNS[sun.sign].name}`, endSub: "Identity" });
    html += pointRow(moon, { title: `Moon in ${SIGNS[moon.sign].name}`, endSub: "Emotions" });
    if (asc) html += pointRow(asc, { title: `${SIGNS[asc.sign].name} Rising`, endSub: "Approach" });
    html += `</div>`;

    // signs grid
    html += `<div class="section-label">${Object.keys(groupBySign()).length} signs occupied</div><div class="sign-grid">`;
    const groups = groupBySign();
    for (const k of SIGN_KEYS) {
      const list = groups[k] || [];
      const isSun = sun.sign === k;
      html += `<button class="sign-cell ${list.length ? "occupied" : ""} ${isSun ? "sun" : ""}" data-open="sign:${k}">
        ${asc && asc.sign === k ? '<span class="diamond" title="Ascendant"></span>' : ""}
        <div class="g">${SIGNS[k].glyph}</div>
        <div class="n">${SIGNS[k].name.slice(0, 3)}</div>
        ${isSun ? '<span class="tag pill">Sun</span>' : ""}
        <div class="dots">${list.map((key) => `<i style="background:${PLANETS[key].color}"></i>`).join("")}</div>
      </button>`;
    }
    html += `</div><div class="legend">
      ${asc ? '<span><i class="diamond"></i>ASC</span>' : ""}
      ${["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron", "lilith"]
        .map((k) => `<span><i style="background:${PLANETS[k].color}"></i>${esc(pShort(k))}</span>`).join("")}
    </div>`;

    // balance
    const total = Object.values(d.elements).reduce((s, l) => s + l.length, 0);
    html += `<div class="section-label">Elemental balance</div><div class="bars">`;
    for (const k of ELEMENT_KEYS) {
      const n = d.elements[k].length;
      html += `<button class="bar-row" data-open="element:${k}"><span class="lab"><i style="background:${K.ELEMENTS[k].color}"></i>${K.ELEMENTS[k].name}</span>
        <span class="track"><b style="width:${(n / total) * 100}%;background:${K.ELEMENTS[k].color}"></b></span><span class="val">${n}</span></button>`;
    }
    html += `</div><div class="section-label">Modalities</div><div class="bars">`;
    for (const k of MODE_KEYS) {
      const n = d.modes[k].length;
      html += `<button class="bar-row" data-open="mode:${k}"><span class="lab"><i style="background:var(--text-2)"></i>${K.MODES[k].name}</span>
        <span class="track"><b style="width:${(n / total) * 100}%;background:var(--text-2)"></b></span><span class="val">${n}</span></button>`;
    }
    html += `</div>`;

    // life areas
    html += `<div class="section-label">Life areas</div><div class="list">`;
    for (const [k, A] of Object.entries(LIFE_AREAS)) {
      html += `<button class="row" data-open="area:${k}"><span class="dot" style="color:${A.color}"></span>
        <span class="main"><div class="title">${esc(A.title)}</div><div class="sub">${esc(A.sub(c))}</div></span>
        <span class="end"><div class="pos">${A.keys.map((pk) => c.get(pk) ? `<span class="sym" style="color:${PLANETS[pk].color}">${pGlyph(pk)}</span>` : "").join(" ")}</div></span></button>`;
    }
    html += `</div>`;

    // signature stats
    html += `<div class="section-label">Chart signature</div><div class="split">`;
    if (d.chartRuler) html += stat("Chart ruler", `${sym(pGlyph(d.chartRuler))} ${pName(d.chartRuler)}`, `in ${SIGNS[c.get(d.chartRuler).sign].name} · H${c.get(d.chartRuler).house}`, `point:${d.chartRuler}`);
    html += stat("Dominant planet", `${sym(pGlyph(d.domPlanet))} ${pName(d.domPlanet)}`, `in ${SIGNS[c.get(d.domPlanet).sign].name}`, `point:${d.domPlanet}`);
    html += stat("Dominant sign", `${signGlyph(d.domSign)} ${SIGNS[d.domSign].name}`, `${cap(SIGNS[d.domSign].element)} · ${cap(SIGNS[d.domSign].mode)}`, `sign:${d.domSign}`);
    html += stat("Signature", `${cap(d.domMode)} ${cap(d.domEl)}`, d.lackEl.length ? `No ${d.lackEl.join(", ")}` : "All elements present", `element:${d.domEl}`);
    html += stat("Chart shape", (window.AstroDeep && AstroDeep.shapes ? AstroDeep.shapes[d.shape.type].name : cap(d.shape.type)), d.shape.handle ? `Handle: ${pName(d.shape.handle)}` : d.shape.leader ? `Leading: ${pName(d.shape.leader)}` : "Planetary pattern", "hemi");
    html += stat("Moon phase", d.phase.name, `${Math.round(c.moonPhaseAngle)}° Sun–Moon`, "phase");
    if (c.timeKnown) html += stat("Sect", c.isDay ? "Day chart" : "Night chart", c.isDay ? "Sun above horizon" : "Sun below horizon", "sect");
    if (c.timeKnown) html += stat("Hemispheres", `${d.above > d.below ? "Southern" : d.above < d.below ? "Northern" : "Balanced"}`, `${d.above} above · ${d.below} below · ${d.east} east · ${d.west} west`, "hemi");
    const retro = c.points.filter((p) => p.retro && PLANET_KEYS.includes(p.key));
    html += stat("Retrograde", `${retro.length} planet${retro.length === 1 ? "" : "s"}`, retro.map((p) => pName(p.key)).join(", ") || "All direct", "retro");
    html += `</div>`;

    // patterns
    const pats = c.patterns.concat(d.stelliums.map((s) => ({ type: "stellium", members: s.members, where: s })));
    if (pats.length) {
      html += `<div class="section-label">Aspect patterns</div><div class="list">`;
      pats.forEach((pt, i) => {
        const info = K.PATTERNS[pt.type];
        const where = pt.type === "stellium" ? (pt.where.kind === "sign" ? `in ${SIGNS[pt.where.where].name}` : `in the ${ord(pt.where.where)} house`) : pt.apex ? `apex ${pName(pt.apex)}` : "";
        html += `<button class="row" data-open="pattern:${i}">
          <span class="dot" style="color:var(--accent)"></span>
          <span class="main"><div class="title">${esc(info.name)}</div><div class="sub">${esc(where)}</div></span>
          <span class="end"><div class="pos">${pt.members.map((k) => `<span class="sym" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>`).join(" ")}</div></span>
        </button>`;
      });
      html += `</div>`;
      state._patterns = pats;
    }

    html += `<div class="chips" style="margin-top:40px">${window.NATAL_EMBED ? "" : `<button class="chip" data-act="share">Copy share link</button>`}<button class="chip" data-act="edit">Edit birth data</button></div>`;
    return html;
  }

  function stat(k, v, s, open) {
    return `<button class="stat" style="text-align:left" ${open ? `data-open="${open}"` : ""}><div class="k">${esc(k)}</div><div class="v">${v}</div><div class="s">${esc(s)}</div></button>`;
  }

  function groupBySign() {
    const g = {};
    for (const p of state.chart.points) {
      if (!PLANETS[p.key] || ["asc", "mc", "fortune", "vertex", "southNode"].includes(p.key)) continue;
      (g[p.sign] = g[p.sign] || []).push(p.key);
    }
    return g;
  }

  /* ------------------------------------------------------------------ */
  /* PLANETS tab                                                        */
  /* ------------------------------------------------------------------ */
  function renderPlanets() {
    const c = state.chart, d = c.derived;
    const retro = c.points.filter((p) => p.retro && PLANET_KEYS.includes(p.key)).length;
    let html = `<section class="hero">
      <div class="eyebrow">Planetary positions<span class="sep">·</span>${c.points.length} points</div>
      <h1 class="display">${esc(pName(d.domPlanet))}</h1>
      <div class="subline">dominant planet · <strong>${retro}</strong> retrograde</div>
    </section>`;
    html += `<div class="section-label">Luminaries & personal planets</div><div class="list">`;
    for (const k of ["sun", "moon", "mercury", "venus", "mars"]) html += pointRow(c.get(k));
    html += `</div><div class="section-label">Social & outer planets</div><div class="list">`;
    for (const k of ["jupiter", "saturn", "uranus", "neptune", "pluto"]) html += pointRow(c.get(k));
    html += `</div><div class="section-label">Points & bodies</div><div class="list">`;
    for (const k of ["northNode", "southNode", "chiron", "lilith", "fortune", "vertex"]) if (c.get(k)) html += pointRow(c.get(k));
    html += `</div>`;
    if (c.timeKnown) {
      html += `<div class="section-label">Angles</div><div class="list">`;
      html += pointRow(c.get("asc"), { title: "Ascendant" });
      html += pointRow(c.get("mc"), { title: "Midheaven" });
      html += `</div>`;
    }
    // declinations
    html += `<div class="section-label">Declinations</div><div class="list">`;
    for (const k of PLANET_KEYS) {
      const p = c.get(k);
      const dec = Math.abs(p.dec);
      html += `<div class="row"><span class="dot" style="color:${PLANETS[k].color}"></span><span class="glyph" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>
        <span class="main"><div class="title dim">${pName(k)}</div>${p.oob ? '<div class="sub" style="color:#f6a58c">Out of bounds</div>' : ""}</span>
        <span class="end"><div class="pos">${Math.floor(dec)}°${pad(Math.floor((dec % 1) * 60))}′ ${p.dec >= 0 ? "N" : "S"}</div></span></div>`;
    }
    html += `</div><p class="note">Out-of-bounds planets travel beyond the Sun's maximum declination (${c.eps.toFixed(2)}°) and tend to act in unconventional, uncontained ways.</p>`;
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* HOUSES tab                                                         */
  /* ------------------------------------------------------------------ */
  function renderHouses() {
    const c = state.chart;
    if (!c.timeKnown) {
      return `<section class="hero"><div class="eyebrow">Houses</div><h1 class="display sm">Time needed</h1>
        <div class="subline">Houses depend on the exact birth time and place.</div>
        <p class="note">Add a birth time to unlock houses, the Ascendant and the Midheaven.</p>
        <div class="chips"><button class="chip" data-act="edit">Add birth time</button></div></section>`;
    }
    const counts = {};
    for (const k of PLANET_KEYS) counts[c.get(k).house] = (counts[c.get(k).house] || 0) + 1;
    const busiest = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    const asc = c.get("asc"), mc = c.get("mc");
    const inter = interceptions();
    let html = `<section class="hero">
      <div class="eyebrow">Houses<span class="sep">·</span>${esc(K.HOUSE_SYSTEMS[c.houseSystemUsed])}</div>
      <h1 class="display">${SIGNS[asc.sign].name}</h1>
      <div class="subline">rising · MC in <strong>${SIGNS[mc.sign].name}</strong> · most planets in the ${ord(+busiest)}</div>
    </section><div class="list">`;
    for (let h = 1; h <= 12; h++) {
      const cusp = E.splitLon(c.houses[h]);
      const inside = c.points.filter((p) => p.house === h && PLANETS[p.key] && !["asc", "mc", "fortune", "vertex"].includes(p.key));
      const sub = [`Ruler ${pName(rulerOf(cusp.sign))}`];
      if (inter[h]) sub.push(`Intercepted ${inter[h].map((s) => SIGNS[s].name).join(", ")}`);
      html += `<button class="row" data-open="house:${h}">
        <span class="num">${pad(h)}</span>
        <span class="main"><div class="title ${inside.length ? "" : "dim"}">${esc(HOUSES[h].title)}</div><div class="sub">${esc(sub.join(" · "))}</div></span>
        <span class="end"><div class="pos">${cusp.deg}°${pad(cusp.min)}′${signGlyph(cusp.sign)}</div>
        <div class="pos-sub">${inside.length ? inside.map((p) => `<span class="sym" style="color:${PLANETS[p.key].color};font-size:14px">${pGlyph(p.key)}</span>`).join(" ") : "Empty"}</div></span>
      </button>`;
    }
    html += `</div><p class="note">Change the house system from the settings icon. Empty houses are not inactive — they are read through the sign on the cusp and the placement of its ruler.</p>`;
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* ASPECTS tab                                                        */
  /* ------------------------------------------------------------------ */
  function renderAspects() {
    const c = state.chart;
    const all = c.aspects;
    const harm = all.filter((a) => a.nature === "harmony" || a.nature === "creative").length;
    const tens = all.filter((a) => a.nature === "tension" || a.nature === "adjust").length;
    let html = `<section class="hero">
      <div class="eyebrow">Aspects<span class="sep">·</span>${state.settings.minorAspects ? "Major + minor" : "Major"}</div>
      <h1 class="display">${all.length} aspects</h1>
      <div class="subline"><strong>${harm}</strong> flowing · <strong>${tens}</strong> dynamic · ${all.length - harm - tens} conjunctions</div>
    </section>`;

    // grid
    const keys = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron", "lilith"].filter((k) => c.get(k));
    if (c.timeKnown) keys.push("asc", "mc");
    const idx = {};
    all.forEach((a, i) => { idx[a.a + "|" + a.b] = i; idx[a.b + "|" + a.a] = i; });
    html += `<div class="grid-scroll"><table class="agrid">`;
    for (let r = 0; r < keys.length; r++) {
      html += "<tr>";
      for (let col = 0; col < r; col++) {
        const i = idx[keys[r] + "|" + keys[col]];
        if (i === undefined) html += `<td class="cell"></td>`;
        else {
          const a = all[i];
          html += `<td class="cell has" data-open="aspect:${i}" title="${esc(pName(a.a) + " " + ASPECTS[a.type].name + " " + pName(a.b))}" style="color:${ASPECTS[a.type].color}">${ASPECTS[a.type].glyph}<small>${Math.floor(a.orb)}</small></td>`;
        }
      }
      const k = keys[r];
      const isAng = k === "asc" || k === "mc";
      html += `<td class="diag ${isAng ? "ang" : ""}" style="color:${PLANETS[k].color}${isAng ? ";font-family:var(--mono);font-size:10px" : ""}">${PLANETS[k].glyph}</td></tr>`;
    }
    html += `</table></div>`;

    html += `<div class="chips">
      ${["all", "harmony", "tension", "conjunction"].map((f) => `<button class="chip" data-filter="${f}" aria-pressed="${state.aspectFilter === f}">${{ all: "All", harmony: "Flowing", tension: "Dynamic", conjunction: "Conjunct" }[f]}</button>`).join("")}
    </div><div class="list" style="margin-top:14px">`;
    all.forEach((a, i) => {
      const f = state.aspectFilter;
      if (f === "harmony" && !(a.nature === "harmony" || a.nature === "creative")) return;
      if (f === "tension" && !(a.nature === "tension" || a.nature === "adjust")) return;
      if (f === "conjunction" && a.type !== "conjunction") return;
      const X = ASPECTS[a.type];
      html += `<button class="row" data-open="aspect:${i}">
        <span class="dot" style="color:${X.color}"></span>
        <span class="main"><div class="title">${esc(pShort(a.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(a.b))}</div>
        <div class="sub">${esc(X.name)}${a.major ? "" : " · minor"}</div></span>
        <span class="end"><div class="pos">${orbStr(a.orb)}</div><div class="pos-sub">${a.applying ? "Applying" : "Separating"}</div></span>
      </button>`;
    });
    html += `</div><p class="note">Orb = distance from exact. Applying aspects are still building and tend to feel stronger.</p>`;
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* KARMIC tab                                                         */
  /* ------------------------------------------------------------------ */
  function renderKarmic() {
    const c = state.chart, d = c.derived;
    const nn = c.get("northNode"), sn = c.get("southNode");
    const birth = c.input.utc;
    const now = new Date();
    const ageYears = (now - birth) / (365.2422 * 86400000);
    const nodalCycle = 18.6134;
    const cycles = ageYears / nodalCycle;
    const pct = (cycles % 1) * 100;
    const nextReturnAge = Math.ceil(cycles) * nodalCycle;

    let html = `<section class="hero">
      <div class="eyebrow">Karmic path<span class="sep">·</span>North Node</div>
      <h1 class="display">${SIGNS[nn.sign].name}</h1>
      <div class="subline">from <strong>${SIGNS[sn.sign].name}</strong> South Node${c.timeKnown ? ` · ${ord(sn.house)} → ${ord(nn.house)} house` : ""}</div>
      ${ageYears > 0 ? `<div class="progress"><i style="width:${pct.toFixed(1)}%"></i></div>
      <div class="progress-caption"><span>Nodal cycle ${Math.floor(cycles) + 1}</span><span>Return at ${nextReturnAge.toFixed(1)}</span></div>` : ""}
    </section>`;

    html += `<div class="axis">
      <button class="end" data-open="point:southNode"><div class="g sym" style="color:${PLANETS.southNode.color}">${signGlyph(sn.sign)}</div><div class="n">${SIGNS[sn.sign].name}</div><div class="k">South Node · past</div></button>
      <div class="line"></div>
      <button class="end" data-open="point:northNode"><div class="g sym" style="color:var(--accent)">${signGlyph(nn.sign)}</div><div class="n">${SIGNS[nn.sign].name}</div><div class="k">North Node · future</div></button>
    </div>`;

    const ax = deepAxis(nn.sign), nhd = c.timeKnown ? deepNodeHouse(nn.house) : null;
    html += karmicCard("northNode", "Destiny · North Node", `${SIGNS[nn.sign].name}${nn.house ? ` · ${ord(nn.house)} house` : ""}`,
      [ax ? ax.story : SIGNS[nn.sign].nn, c.timeKnown ? (nhd ? nhd.story : K.HOUSE_NODE[nn.house]) : ""]);
    const snd = deepSign(sn.sign);
    html += karmicCard("southNode", "Past lives · South Node", `${SIGNS[sn.sign].name}${sn.house ? ` · ${ord(sn.house)} house` : ""}`, [snd ? snd.southNode : signText(sn)]);
    if (ax) html += `<div class="card"><div class="card-k">Staying on path</div><div class="prose"><p><strong>The trap.</strong> ${esc(ax.trap)}</p><p><strong>The medicine.</strong> ${esc(ax.medicine)}</p></div>${steps("Three steps", (deepSign(nn.sign) || {}).northNodeSteps)}${nhd ? advice(nhd.practice) : ""}</div>`;
    // ruler of the North Node
    const nnRuler = rulerOf(nn.sign), nr = c.get(nnRuler);
    html += `<div class="card"><div class="card-head"><div class="glyph" style="color:${PLANETS[nnRuler].color}">${pGlyph(nnRuler)}</div>
      <div><div class="card-k">Guide · ruler of the North Node</div><div class="card-title">${esc(pName(nnRuler))} in ${esc(SIGNS[nr.sign].name)}${nr.house ? ` · ${ord(nr.house)} house` : ""}</div></div></div>
      <div class="prose"><p>${esc(`${pName(nnRuler)} rules your North Node sign, so it acts as the guide for your growth. ${nr.house ? `Your destiny path runs through ${HOUSES[nr.house].areas}: this is where life keeps presenting the next step.` : ""} Developing ${PLANETS[nnRuler].core} consciously is one of the most direct ways to live your North Node.`)}</p></div>
      <button class="more" data-open="point:${nnRuler}">Full placement →</button></div>`;

    // node contacts
    const contacts = [];
    for (const k of PLANET_KEYS.concat(["chiron", "lilith"])) {
      const p = c.get(k);
      if (!p) continue;
      const toN = Math.abs(E.diff(p.lon, nn.lon)), toS = Math.abs(E.diff(p.lon, sn.lon));
      if (toN <= 5) contacts.push({ k, where: "north", orb: toN });
      else if (toS <= 5) contacts.push({ k, where: "south", orb: toS });
      else if (Math.abs(toN - 90) <= 4) contacts.push({ k, where: "bend", orb: Math.abs(toN - 90) });
    }
    if (contacts.length) {
      html += `<div class="section-label">Planets on the nodal axis</div><div class="list">`;
      for (const ct of contacts) {
        const label = { north: "Conjunct North Node", south: "Conjunct South Node", bend: "Square the nodes · skipped step" }[ct.where];
        html += `<button class="row" data-open="nodecontact:${ct.k}:${ct.where}"><span class="dot" style="color:${PLANETS[ct.k].color}"></span>
          <span class="glyph" style="color:${PLANETS[ct.k].color}">${pGlyph(ct.k)}</span>
          <span class="main"><div class="title">${pName(ct.k)}</div><div class="sub">${label}</div></span>
          <span class="end"><div class="pos">${orbStr(ct.orb)}</div></span></button>`;
      }
      html += `</div>`;
    }

    // karmic teachers
    html += `<div class="section-label">Karmic teachers</div>`;
    const sat = c.get("saturn");
    const satD = deepSign(sat.sign), satH = sat.house ? deepPlanetHouse("saturn", sat.house) : null;
    html += karmicCard("saturn", "Lessons · Saturn", `${SIGNS[sat.sign].name}${sat.house ? ` · ${ord(sat.house)} house` : ""}${sat.retro ? " · ℞" : ""}`, [
      satD ? satD.saturn : `Saturn is the lord of karma, where you meet delay, fear and responsibility until you build real mastery. In ${SIGNS[sat.sign].name}, the lesson is to develop ${SIGNS[sat.sign].gifts} the slow way, without falling into ${SIGNS[sat.sign].shadow}.`,
      sat.house ? (satH ? satH.text : `In the ${ord(sat.house)} house, the karmic test concerns ${HOUSES[sat.house].areas}. What feels hard here in youth becomes your authority with age.`) : "",
    ]);
    const ch = c.get("chiron");
    if (ch) html += karmicCard("chiron", "Wound & gift · Chiron", `${SIGNS[ch.sign].name}${ch.house ? ` · ${ord(ch.house)} house` : ""}${ch.retro ? " · ℞" : ""}`, [SIGNS[ch.sign].chiron, ch.house ? ((deepPlanetHouse("chiron", ch.house) || {}).text || `The wound shows up around ${HOUSES[ch.house].areas}; so does your gift for healing others.`) : ""]);
    const pl = c.get("pluto");
    html += karmicCard("pluto", "Soul intent · Pluto", `${SIGNS[pl.sign].name}${pl.house ? ` · ${ord(pl.house)} house` : ""}`, [
      `In evolutionary astrology Pluto describes the soul's deepest desires and the intensity it carries from the past. ${pl.house ? `In the ${ord(pl.house)} house, that evolution is centred on ${HOUSES[pl.house].areas}; expect repeated cycles of loss, power and rebirth here.` : ""}`,
      pl.house ? (deepPlanetHouse("pluto", pl.house) || {}).text : "",
      `Pluto's polarity point, ${SIGNS[opposite(pl.sign)].name}${pl.house ? ` / the ${ord(((pl.house + 5) % 12) + 1)} house` : ""}, shows where the soul is trying to evolve toward.`,
    ]);
    const li = c.get("lilith");
    html += karmicCard("lilith", "Shadow · Black Moon Lilith", `${SIGNS[li.sign].name}${li.house ? ` · ${ord(li.house)} house` : ""}`, [(deepSign(li.sign) || {}).lilith || signText(li), li.house ? ((deepPlanetHouse("lilith", li.house) || {}).text || `This exiled energy often shows up in ${HOUSES[li.house].areas}.`) : ""]);

    // retrogrades
    const retro = c.points.filter((p) => p.retro && K.RETRO_KARMIC[p.key]);
    if (retro.length) {
      html += `<div class="section-label">Retrograde · karmic revisits</div><div class="list">`;
      for (const p of retro) {
        html += `<button class="row" data-open="point:${p.key}"><span class="dot" style="color:${PLANETS[p.key].color}"></span><span class="glyph" style="color:${PLANETS[p.key].color}">${pGlyph(p.key)}</span>
          <span class="main"><div class="title">${pName(p.key)} ℞</div><div class="sub">${esc(SIGNS[p.sign].name)}${p.house ? " · House " + p.house : ""}</div></span>
          <span class="end"><div class="pos">${degStr(p)}${signGlyph(p.sign)}</div></span></button>`;
      }
      html += `</div>`;
    }

    // karmic houses
    if (c.timeKnown) {
      html += `<div class="section-label">Karmic houses · 4 · 8 · 12</div><div class="list">`;
      for (const h of [4, 8, 12]) {
        const inside = c.points.filter((p) => p.house === h && PLANET_KEYS.concat(["chiron", "northNode", "southNode", "lilith"]).includes(p.key));
        html += `<button class="row" data-open="house:${h}"><span class="num">${pad(h)}</span>
          <span class="main"><div class="title ${inside.length ? "" : "dim"}">${HOUSES[h].title}</div><div class="sub">${inside.length ? inside.map((p) => pShort(p.key)).join(" · ") : "No planets"}</div></span>
          <span class="end"><div class="pos">${inside.map((p) => `<span class="sym" style="color:${PLANETS[p.key].color}">${pGlyph(p.key)}</span>`).join(" ")}</div></span></button>`;
      }
      html += `</div>`;
      const kh = [4, 8, 12].map((h) => deepHouse(h)).filter(Boolean);
      if (kh.length === 3) html += `<div class="card" style="margin-top:16px"><div class="card-k">Soul level</div><div class="prose">${[4, 8, 12].map((h, i) => `<p><strong>${ord(h)} house.</strong> ${esc(kh[i].karmic)}</p>`).join("")}</div></div>`;
    }

    // karmic markers
    const markers = [];
    for (const p of c.points) {
      if (!PLANETS[p.key] || ["fortune", "vertex"].includes(p.key)) continue;
      if (p.critical === "anaretic") markers.push({ title: `${pShort(p.key)} at 29° ${SIGNS[p.sign].name}`, sub: "Anaretic degree", open: `point:${p.key}` });
    }
    if (d.phase.name === "Balsamic") markers.push({ title: "Balsamic Moon birth", sub: "Old soul · completion", open: "phase" });
    c.patterns.forEach((pt, i) => { if (pt.type === "yod") markers.push({ title: `Yod → ${pName(pt.apex)}`, sub: "Finger of God", open: `kpattern:${i}` }); });
    const twelfth = c.timeKnown ? c.points.filter((p) => p.house === 12 && PLANET_KEYS.includes(p.key)) : [];
    if (twelfth.length) markers.push({ title: `${twelfth.length} planet${twelfth.length > 1 ? "s" : ""} in the 12th`, sub: twelfth.map((p) => pName(p.key)).join(" · "), open: "house:12" });
    if (markers.length) {
      html += `<div class="section-label">Karmic signatures</div><div class="list">`;
      for (const m of markers) {
        html += `<button class="row" data-open="${m.open}"><span class="dot" style="color:var(--accent)"></span><span class="main"><div class="title">${esc(m.title)}</div><div class="sub">${esc(m.sub)}</div></span></button>`;
      }
      html += `</div>`;
    }

    // timeline
    html += `<div class="section-label">Karmic timeline</div><div class="list" id="timeline"><div class="row"><span class="main"><div class="sub">Calculating returns…</div></span></div></div>
      <p class="note">Returns happen when a body comes back to its natal degree: the nodes every 18.6 years, Saturn every ~29.5, Chiron at ~50.</p>`;
    return html;
  }

  function karmicCard(key, k, title, texts) {
    return `<div class="card"><div class="card-head"><div class="glyph" style="color:${PLANETS[key].color}">${pGlyph(key)}</div>
      <div><div class="card-k">${esc(k)}</div><div class="card-title">${esc(title)}</div></div></div>
      ${paras(texts)}
      <button class="more" data-open="point:${key}">Full placement →</button></div>`;
  }

  function fillTimeline() {
    const el = $("#timeline");
    if (!el) return;
    const c = state.chart;
    const birth = c.input.utc;
    const ayan = c.ayanamsa;
    const target = (k) => E.norm(c.get(k).lon + ayan);
    const events = [];
    const end = new Date(birth.getTime() + 92 * 365.25 * 86400000);
    const start = new Date(birth.getTime() + 300 * 86400000);
    const push = (list, label, key) => {
      // collapse retrograde triple-passes into the first hit, keep later cycles
      let last = null;
      for (const dt of list) {
        if (last && dt - last < 2 * 365.25 * 86400000) continue;
        events.push({ date: dt, label, key });
        last = dt;
      }
    };
    push(E.findReturns("saturn", target("saturn"), start, end), "Saturn return", "saturn");
    if (c.get("chiron")) push(E.findReturns("chiron", target("chiron"), start, end), "Chiron return", "chiron");
    push(E.findReturns("northNode", target("northNode"), start, end, { nodeType: state.settings.nodeType }), "Nodal return", "northNode");
    push(E.findReturns("northNode", E.norm(target("northNode") + 180), start, end, { nodeType: state.settings.nodeType }), "Nodal reversal", "southNode");
    events.sort((a, b) => a.date - b.date);
    const now = Date.now();
    let nextMarked = false;
    el.innerHTML = events.map((ev) => {
      const age = (ev.date - birth) / (365.2422 * 86400000);
      const past = ev.date.getTime() < now;
      let cls = past ? "past" : "";
      if (!past && !nextMarked) { cls = "next"; nextMarked = true; }
      const P = PLANETS[ev.key];
      return `<div class="row ${cls}"><span class="dot ${past ? "hollow" : ""}" style="color:${P.color}"></span>
        <span class="main"><div class="title">${esc(ev.label)}</div><div class="sub">Age ${age.toFixed(1)}${cls === "next" ? " · next" : ""}</div></span>
        <span class="end"><div class="pos">${fmtMonthYear(ev.date).toUpperCase()}</div></span></div>`;
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* SHEET                                                              */
  /* ------------------------------------------------------------------ */
  const sheet = $("#sheet"), sheetBody = $("#sheet-body"), backdrop = $("#sheet-backdrop");
  const TAB_THEME = { today: "#afc8ee", karmic: "#b99cf2" };
  const ELEMENT_COLOR = () => Object.fromEntries(Object.entries(K.ELEMENTS).map(([k, v]) => [k, v.color]));

  /** Heading colour for a detail sheet, matched to its subject. Pearl is the default. */
  function themeFor(spec) {
    const c = state.chart;
    const [kind, arg] = spec.split(":");
    try {
      switch (kind) {
        case "point": case "tplanet": case "nodecontact": return PLANETS[arg].color;
        case "sign": return ELEMENT_COLOR()[SIGNS[arg].element];
        case "element": return K.ELEMENTS[arg].color;
        case "aspect": return ASPECTS[c.aspects[+arg].type].color;
        case "transit": return PLANETS[computeTransits().list[+arg].t].color;
        case "area": return LIFE_AREAS[arg].color;
        case "phase": return PLANETS.moon.color;
        case "house": {
          if (state.tab === "karmic") return TAB_THEME.karmic;
          return null;
        }
        default: return TAB_THEME[state.tab] || null;
      }
    } catch (e) {
      return null;
    }
  }

  /* Detail pages: full-screen pages with a back arrow. Opening a page from
     inside a page stacks it; back (arrow, edge swipe, Escape or the system back)
     returns one step at a time. */
  const pageStack = [];
  let historyOK = false;
  function setPage(html, theme) {
    if (theme) sheet.style.setProperty("--theme", theme);
    else sheet.style.removeProperty("--theme");
    sheetBody.innerHTML = html;
    sheetBody.scrollTop = 0;
    sheet.classList.remove("page-in");
    void sheet.offsetWidth;
    sheet.classList.add("page-in");
  }
  function openSheet(html, theme) {
    const opening = sheet.hidden;
    if (!opening) pageStack.push({ html: sheetBody.innerHTML, theme: sheet.style.getPropertyValue("--theme"), scroll: sheetBody.scrollTop });
    setPage(html, theme);
    if (opening) {
      sheet.hidden = false;
      document.body.classList.add("detail-open");
    }
    try { history.pushState({ natalPage: pageStack.length + 1 }, ""); historyOK = true; } catch (e) { historyOK = false; }
  }
  function hideSheet() {
    sheet.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("detail-open");
  }
  function popPage() {
    if (sheet.hidden) return;
    if (pageStack.length) {
      const p = pageStack.pop();
      setPage(p.html, p.theme);
      sheetBody.scrollTop = p.scroll;
    } else {
      hideSheet();
    }
  }
  function goBack() {
    if (historyOK && history.state && history.state.natalPage) history.back();
    else popPage();
  }
  // close every open page at once (used when leaving the chart)
  function closeSheet() {
    if (sheet.hidden) return;
    const depth = pageStack.length + 1;
    pageStack.length = 0;
    hideSheet();
    if (historyOK) { try { history.go(-depth); } catch (e) { /* ignore */ } }
  }
  window.addEventListener("popstate", () => popPage());
  $("#sheet-back").addEventListener("click", goBack);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) goBack(); });
  // swipe right from the left edge to go back, like a native app
  (function () {
    let x0 = null, y0 = 0;
    sheet.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t.clientX < 28) { x0 = t.clientX; y0 = t.clientY; } }, { passive: true });
    sheet.addEventListener("touchmove", (e) => {
      if (x0 === null) return;
      const t = e.touches[0], dx = t.clientX - x0;
      if (Math.abs(t.clientY - y0) > 60 && dx < 30) { x0 = null; sheet.style.transform = ""; return; }
      if (dx > 0) sheet.style.transform = `translateX(${dx}px)`;
    }, { passive: true });
    sheet.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      sheet.style.transform = "";
      if (dx > 90) goBack();
    });
  })();

  function facts(list) {
    return `<dl class="facts">${list.filter(Boolean).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
  }
  function paras(list) {
    const out = [];
    for (const t of list.filter(Boolean)) for (const part of String(t).split(/\n\n+/)) if (part.trim()) out.push(`<p>${esc(part.trim())}</p>`);
    return `<div class="prose">${out.join("")}</div>`;
  }
  const headStyle = (color) => (color ? ` style="color:${color}"` : "");
  function sec(title, body, color) {
    const b = (Array.isArray(body) ? body : [body]).filter(Boolean);
    return b.length ? `<h4${headStyle(color)}>${esc(title)}</h4>${paras(b)}` : "";
  }
  const elColor = (sign) => K.ELEMENTS[SIGNS[sign].element].color;
  function chips(label, list, cls) {
    return list && list.length ? `<div class="chip-row"><span class="chip-label">${esc(label)}</span>${list.map((t) => `<span class="tag ${cls}">${esc(t)}</span>`).join("")}</div>` : "";
  }
  function steps(title, list) {
    return list && list.length ? `<h4>${esc(title)}</h4><ol class="steps">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>` : "";
  }
  function advice(text) {
    return text ? `<div class="advice"><span>Working with it</span>${esc(text)}</div>` : "";
  }
  const firstPara = (t) => (t ? String(t).split(/\n\n+/)[0] : "");

  function sheetPoint(key) {
    const c = state.chart;
    const p = c.get(key);
    const P = PLANETS[key], S = SIGNS[p.sign];
    const decanSign = SIGN_KEYS[(SIGN_KEYS.indexOf(p.sign) + p.decan * 4) % 12];
    const rules = housesRuledBy(key);
    const asp = c.aspects.filter((a) => a.a === key || a.b === key);
    const title = key === "asc" ? `${S.name} Rising` : key === "mc" ? `Midheaven in ${S.name}` : `${P.name} in ${S.name}`;
    let html = `<section class="hero"><div class="eyebrow">${esc(P.keywords.join(" · "))}</div>
      <h2 class="display">${esc(title)}</h2>
      <div class="subline"><span class="sym" style="color:${P.color}">${P.glyph}</span> ${degFull(p)} ${signGlyph(p.sign)}${p.retro ? ' <span class="retro">℞ retrograde</span>' : ""}</div></section>`;
    const speed = p.speed !== undefined && !["asc", "mc", "fortune", "vertex"].includes(key) ? `${p.speed < 0 ? "−" : ""}${Math.abs(p.speed).toFixed(p.speed && Math.abs(p.speed) < 0.1 ? 3 : 2)}°/day` : null;
    html += facts([
      ["Sign", `${signGlyph(p.sign)} ${S.name}`],
      p.house ? ["House", `${ord(p.house)} · ${HOUSES[p.house].title}`] : null,
      ["Element · mode", `${cap(S.element)} · ${cap(S.mode)}`],
      ["Decan", `${["I", "II", "III"][p.decan]} · ${SIGNS[decanSign].name} ${signGlyph(decanSign)}`],
      speed ? ["Motion", `${p.retro ? "Retrograde" : "Direct"} · ${speed}`] : null,
      p.dec !== undefined ? ["Declination", `${Math.abs(p.dec).toFixed(2)}° ${p.dec >= 0 ? "N" : "S"}${p.oob ? ' <span class="tag">OOB</span>' : ""}`] : null,
      p.dignity ? ["Dignity", cap(p.dignity)] : null,
      rules.length ? ["Rules houses", rules.map(ord).join(", ")] : null,
      ["Absolute", `${p.lon.toFixed(4)}°`],
      p.critical ? ["Degree", cap(p.critical)] : null,
    ]);
    html += sec(P.name, P.desc);

    // sign
    const ds = deepSign(p.sign);
    const dp = deepPlanetSign(key, p.sign);
    const extra = [p.dignity ? `${P.name} ${K.DIGNITY[p.dignity]}` : "", p.critical ? K.CRITICAL[p.critical] : ""];
    if (key === "northNode") {
      const ax = deepAxis(p.sign);
      html += sec(`In ${S.name}`, [S.nn, ax && ax.story], elColor(p.sign));
      if (ax) html += sec("The comfort-zone trap", ax.trap) + sec("What brings you back", ax.medicine);
      if (ds) html += steps("Steps toward your North Node", ds.northNodeSteps);
    } else if (key === "southNode") {
      html += sec(`In ${S.name}`, [ds ? ds.southNode : signText(p)], elColor(p.sign));
      if (ds) html += sec("Using the gift", signText(p));
    } else if (key === "lilith") {
      html += sec(`In ${S.name}`, [ds ? ds.lilith : signText(p)], elColor(p.sign));
    } else if (dp) {
      html += sec(`In ${S.name}`, [dp.text, ...extra], elColor(p.sign));
      if (dp.love) html += sec("In love", dp.love);
      if (dp.work) html += sec("At work", dp.work);
      if (dp.shadow) html += sec("Shadow", dp.shadow);
      html += chips("Strengths", dp.strengths, "green") + chips("Challenges", dp.challenges, "");
      html += advice(dp.advice);
    } else {
      html += sec(`In ${S.name}`, [signText(p), ...extra], elColor(p.sign));
    }
    if (key === "mc" && ds) html += sec("Vocation", ds.career);
    if (key === "saturn" && ds) html += sec("The karmic lesson", ds.saturn);

    // house
    if (p.house && key !== "asc" && key !== "mc") {
      const dh = deepPlanetHouse(key, p.house);
      if (key === "northNode" || key === "southNode") {
        const nh = deepNodeHouse(key === "northNode" ? p.house : ((p.house + 5) % 12) + 1);
        html += sec(`In the ${ord(p.house)} house`, [K.HOUSE_NODE[key === "northNode" ? p.house : ((p.house + 5) % 12) + 1], nh && nh.story]);
        if (nh) html += advice(nh.practice);
      } else if (dh) {
        html += sec(`In the ${ord(p.house)} house · ${HOUSES[p.house].title}`, dh.text) + advice(dh.advice);
      } else {
        html += sec(`In the ${ord(p.house)} house`, houseText(p));
      }
    }
    // rulership links
    if (rules.length && p.house) {
      html += sec("Houses it rules", rules.map((h) => h === p.house
        ? `As ruler of your ${ord(h)} house and placed in it, ${P.name} makes ${HOUSES[h].areas} a self-directed, strongly emphasised part of life.`
        : `As ruler of your ${ord(h)} house, ${P.name} carries ${HOUSES[h].areas} into the ${ord(p.house)} house of ${HOUSES[p.house].areas}. Events in one area tend to set off the other.`));
    }
    if (p.retro && K.RETRO_KARMIC[key]) html += sec("Retrograde", K.RETRO_KARMIC[key]);
    if (asp.length) {
      html += `<h4>Aspects</h4><div class="list">`;
      for (const a of asp) {
        const other = a.a === key ? a.b : a.a;
        const X = ASPECTS[a.type];
        html += `<button class="row" data-open="aspect:${c.aspects.indexOf(a)}"><span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title"><span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pName(other))}</div><div class="sub">${esc(X.name)}</div></span>
          <span class="end"><div class="pos">${orbStr(a.orb)}</div><div class="pos-sub">${a.applying ? "App" : "Sep"}</div></span></button>`;
      }
      html += `</div>`;
    }
    return html;
  }

  function sheetSign(k) {
    const S = SIGNS[k];
    const ds = deepSign(k);
    const c = state.chart;
    const inside = c.points.filter((p) => p.sign === k && PLANETS[p.key] && !["southNode"].includes(p.key));
    let html = `<section class="hero"><div class="eyebrow">${esc(S.dates)}</div><h2 class="display">${S.name}</h2>
      <div class="subline"><span class="sym" style="font-size:32px">${S.glyph}</span></div></section>`;
    html += facts([
      ["Element", cap(S.element)], ["Modality", cap(S.mode)],
      ["Ruler", `${sym(pGlyph(S.ruler))} ${pName(S.ruler)}${S.tradRuler ? ` · trad. ${pName(S.tradRuler)}` : ""}`],
      ["Polarity", S.polarity === "yang" ? "Yang · active" : "Yin · receptive"],
      ["Body", S.body], ["Keywords", S.keywords.join(", ")],
    ]);
    html += paras([ds ? ds.overview : S.essence]);
    if (ds) {
      html += chips("Strengths", ds.strengths, "green") + chips("Challenges", ds.challenges, "");
      html += sec("In love", ds.love) + sec("Growth edge", ds.growth);
    } else {
      html += paras([`Gifts: ${S.gifts}.`, `Shadow: ${S.shadow}.`]);
    }
    if (c.timeKnown) {
      const hs = [];
      for (let h = 1; h <= 12; h++) if (signOf(c.houses[h]) === k) hs.push(h);
      if (hs.length) html += sec("On your house cusps", `${S.name} is on the cusp of your ${hs.map(ord).join(" and ")} house${hs.length > 1 ? "s" : ""}, so you approach ${hs.map((h) => HOUSES[h].areas).join("; and ")} ${S.how}.`);
    }
    if (inside.length) {
      html += `<h4>Your placements in ${S.name}</h4><div class="list">` + inside.map((p) => pointRow(p)).join("") + `</div>`;
    } else {
      html += sec("Your placements", `No planets in ${S.name}. Its themes are still active through the house${c.timeKnown ? "s it rules" : ""} and through its ruler, ${pName(S.ruler)}, in ${SIGNS[c.get(S.ruler).sign].name}.`);
    }
    return html;
  }

  const CUSP_FIELD = { 2: ["money", "Money & worth"], 4: ["home", "Home & roots"], 7: ["partner", "What you seek in others"], 10: ["career", "Vocation"] };

  function sheetHouse(h) {
    const c = state.chart;
    const H = HOUSES[h];
    const dh = deepHouse(h);
    const cusp = E.splitLon(c.houses[h]);
    const S = SIGNS[cusp.sign];
    const ruler = rulerOf(cusp.sign);
    const rp = c.get(ruler);
    const inside = c.points.filter((p) => p.house === h && PLANETS[p.key] && !["asc", "mc"].includes(p.key));
    const inter = interceptions()[h];
    let html = `<section class="hero"><div class="eyebrow">${ord(h)} house · natural ${SIGNS[H.sign].name}</div><h2 class="display">${esc(H.title)}</h2>
      <div class="subline">cusp ${cusp.deg}°${pad(cusp.min)}′ ${signGlyph(cusp.sign)} ${S.name}</div></section>`;
    html += facts([
      ["Cusp sign", `${signGlyph(cusp.sign)} ${S.name}`],
      ["Ruler", `${sym(pGlyph(ruler))} ${pName(ruler)}`],
      ["Ruler placed", `${SIGNS[rp.sign].name} · ${ord(rp.house)} house`],
      ["Size", `${E.norm(c.houses[h === 12 ? 1 : h + 1] - c.houses[h]).toFixed(1)}°`],
      inter ? ["Intercepted", inter.map((s) => SIGNS[s].name).join(", ")] : null,
      ["Planets", inside.length ? inside.map((p) => pShort(p.key)).join(", ") : "None"],
    ]);
    html += paras([dh ? dh.overview : H.desc]);
    if (dh) html += steps("Questions this house asks", dh.questions);
    const cf = CUSP_FIELD[h] && deepSign(cusp.sign);
    html += sec(`${S.name} on the cusp`, [`You approach ${H.areas} ${S.how}.`, cf ? cf[CUSP_FIELD[h][0]] : ""], elColor(cusp.sign));
    html += sec(`Its ruler, ${pName(ruler)}`, [
      rp.house === h
        ? `${pName(ruler)} sits in this same house, making these themes self-contained and strongly emphasised.`
        : `${pName(ruler)} sits in your ${ord(rp.house)} house in ${SIGNS[rp.sign].name}, linking ${H.areas} with ${HOUSES[rp.house].areas}.`,
      dh && dh.ruler,
    ], PLANETS[ruler].color);
    if (inter) html += sec("Intercepted signs", `${inter.map((s) => SIGNS[s].name).join(" and ")} ${inter.length > 1 ? "are" : "is"} intercepted here, held inside the house without touching a cusp. These qualities can feel hidden or slow to develop until later in life.`);
    if (inside.length) {
      html += `<h4>Planets in this house</h4>`;
      for (const p of inside) {
        const d = deepPlanetHouse(p.key, h);
        html += `<p class="minihead"><span class="sym" style="color:${PLANETS[p.key].color}">${pGlyph(p.key)}</span> ${esc(pName(p.key))} in ${esc(SIGNS[p.sign].name)}</p>` + paras([d ? d.text : houseText(p)]);
      }
      html += `<div class="list">${inside.map((p) => pointRow(p)).join("")}</div>`;
    } else if (dh) {
      html += sec("An empty house", dh.empty);
    }
    if (dh) html += sec("When it flows", dh.gifts) + sec("When it struggles", dh.challenges) + sec("Soul level", dh.karmic);
    return html;
  }

  const FLOW_TYPES = new Set(["trine", "sextile", "semisextile", "quintile", "biquintile"]);
  function sheetAspect(i) {
    const c = state.chart;
    const a = c.aspects[i];
    const X = ASPECTS[a.type];
    const pa = c.get(a.a), pb = c.get(a.b);
    const dA = deepAspect(a.a, a.b);
    let html = `<section class="hero"><div class="eyebrow">${esc(X.name)} · ${a.angle}°</div>
      <h2 class="display">${esc(pShort(a.a))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(a.b))}</h2>
      <div class="subline">orb ${orbStr(a.orb)} · ${a.applying ? "applying" : "separating"}</div></section>`;
    html += facts([
      [pName(a.a), `${degStr(pa)} ${signGlyph(pa.sign)}${pa.house ? ` · H${pa.house}` : ""}`],
      [pName(a.b), `${degStr(pb)} ${signGlyph(pb.sign)}${pb.house ? ` · H${pb.house}` : ""}`],
      ["Nature", { harmony: "Harmonious", tension: "Challenging", fusion: "Blending", adjust: "Adjusting", creative: "Creative" }[a.nature]],
      ["Strength", `${Math.round(a.strength * 100)}%`],
    ]);
    if (dA) {
      const body = a.type === "conjunction" ? dA.fusion : FLOW_TYPES.has(a.type) ? dA.flow : dA.tension;
      html += paras([dA.theme]);
      html += sec(`As a ${X.name.toLowerCase()}`, [body, X.desc + (a.major ? "" : " As a minor aspect, it acts in the background and is felt more in specific moments than as a constant theme.")]);
    } else {
      html += paras([aspectText(a)]);
    }
    const strength = a.orb < 1 ? "At under 1° this aspect is very tight and a defining feature of your chart." : a.orb < 3 ? "This is a close, strongly felt aspect." : "This is a wider aspect: present, but more in the background.";
    const motion = a.applying ? "It is applying, still building toward exact, which tends to feel urgent and forward-moving." : "It is separating, already past exact, which tends to feel familiar and integrated.";
    const where = pa.house && pb.house
      ? `In your chart it links ${pName(a.a)} in ${SIGNS[pa.sign].name} (${ord(pa.house)} house: ${HOUSES[pa.house].areas}) with ${pName(a.b)} in ${SIGNS[pb.sign].name} (${ord(pb.house)} house: ${HOUSES[pb.house].areas}).`
      : `In your chart it links ${pName(a.a)} in ${SIGNS[pa.sign].name} with ${pName(a.b)} in ${SIGNS[pb.sign].name}.`;
    html += sec("In your chart", [where, `${strength} ${motion}`]);
    html += sec("The planets", [PLANETS[a.a].desc, PLANETS[a.b].desc]);
    return html;
  }

  function sheetSimple(eyebrow, title, subline, body) {
    return `<section class="hero"><div class="eyebrow">${esc(eyebrow)}</div><h2 class="display">${title}</h2>${subline ? `<div class="subline">${subline}</div>` : ""}</section>${paras(body)}`;
  }

  function openDetail(spec) {
    const c = state.chart;
    const d = c.derived;
    const [kind, arg, arg2] = spec.split(":");
    let html = "";
    switch (kind) {
      case "point": html = sheetPoint(arg); break;
      case "sign": html = sheetSign(arg); break;
      case "house": html = sheetHouse(+arg); break;
      case "aspect": html = sheetAspect(+arg); break;
      case "transit": html = sheetTransit(+arg); break;
      case "tplanet": html = sheetTransitPlanet(arg); break;
      case "element": {
        const X = K.ELEMENTS[arg], list = d.elements[arg], B = deepBalance(arg);
        html = sheetSimple("Element", X.name, `${list.length} placement${list.length === 1 ? "" : "s"}`, [
          list.length ? `${list.map(pName).join(", ")}.` : "",
          list.length >= 4 ? (B ? B.strong : X.strong) : list.length <= 1 ? (B ? B.weak : X.weak) : `${X.strong} With ${list.length} placements, this is a moderate influence.`,
        ]);
        if (B) html += sec(list.length >= 4 ? "When it runs strong" : "What it brings", B.strong) + (list.length <= 1 ? "" : sec("If it were missing", B.weak)) + advice(B.remedy);
        break;
      }
      case "mode": {
        const X = K.MODES[arg], list = d.modes[arg], B = deepBalance(arg);
        html = sheetSimple("Modality", X.name, `${list.length} placement${list.length === 1 ? "" : "s"}`, [list.map(pName).join(", ") + (list.length ? "." : ""), list.length <= 1 ? (B ? B.weak : X.weak) : (B ? B.strong : X.strong)]);
        if (B) html += advice(B.remedy);
        break;
      }
      case "area":
        html = sheetArea(arg);
        break;
      case "phase": {
        const ph = (D().phases || {})[d.phase.name];
        const ang = c.moonPhaseAngle;
        const illum = Math.round(((1 - Math.cos((ang * Math.PI) / 180)) / 2) * 100);
        html = sheetSimple("Moon phase at birth", d.phase.name, `${Math.round(ang)}° from Sun to Moon · ${illum}% lit · ${ang < 180 ? "waxing" : "waning"}`, [ph ? ph.text : d.phase.desc]);
        if (ph) html += chips("Gifts", ph.gifts, "green") + chips("Challenges", ph.challenges, "") + advice(ph.advice);
        html += sec("How it's measured", `The phase is the angle the Moon has travelled ahead of the Sun: 0° is the New Moon, 180° the Full Moon. ${ang < 180 ? "A waxing Moon is building, and people born in this half of the cycle tend to be oriented toward creating and becoming." : "A waning Moon is releasing, and people born in this half of the cycle tend to be oriented toward meaning, sharing and completing."}`);
        break;
      }
      case "sect":
        html = sheetSimple("Sect", c.isDay ? "Day chart" : "Night chart", "", [c.isDay
          ? "The Sun was above the horizon at birth. In traditional astrology the Sun, Jupiter and Saturn are the sect planets: Jupiter is your most reliable benefic and Saturn is easier to work with. Mars tends to be the more difficult planet."
          : "The Sun was below the horizon at birth. The Moon, Venus and Mars are the sect planets: Venus is your most reliable benefic and Mars is better contained. Saturn tends to be the more difficult planet.",
          `Part of Fortune is calculated with the ${c.isDay ? "day" : "night"} formula.`]);
        {
          const ben = c.isDay ? "jupiter" : "venus", mal = c.isDay ? "mars" : "saturn";
          const light = c.isDay ? "sun" : "moon";
          const line = (k) => { const q = c.get(k); return `${pName(k)} in ${SIGNS[q.sign].name}${q.house ? `, ${ord(q.house)} house` : ""}`; };
          html += sec("Your most helpful planet", `${line(ben)}. As the benefic of your sect, it tends to deliver its gifts reliably. ${c.get(ben).house ? `Look to ${HOUSES[c.get(ben).house].areas} for the areas where life most readily supports you.` : ""}`);
          html += sec("The planet that needs care", `${line(mal)}. As the malefic out of sect, it is the planet most likely to show its harder side. ${c.get(mal).house ? `Friction tends to gather around ${HOUSES[c.get(mal).house].areas}; conscious effort there turns difficulty into strength.` : ""}`);
          html += sec("Sect light", `${line(light)}. The ${c.isDay ? "Sun" : "Moon"} is the leader of your sect, so ${c.isDay ? "purpose, visibility and conscious will" : "feeling, instinct and emotional needs"} are the steering force of your life.`);
        }
        break;
      case "hemi": {
        const X = D(), sh = X.shapes ? X.shapes[d.shape.type] : null;
        html = sheetSimple("Chart shape & emphasis", sh ? sh.name : cap(d.shape.type), d.shape.handle ? `handle planet: ${pName(d.shape.handle)}` : d.shape.leader ? `leading planet: ${pName(d.shape.leader)}` : "how your planets are spread", [sh ? sh.text : ""]);
        const focus = d.shape.handle || d.shape.leader;
        if (focus) {
          const fp = c.get(focus);
          html += sec(d.shape.handle ? "The handle" : "The leading planet", `${pName(focus)} in ${SIGNS[fp.sign].name}${fp.house ? ` in your ${ord(fp.house)} house` : ""} ${d.shape.handle ? "is the handle of the bucket: the single outlet through which the rest of the chart is expressed." : "leads the procession of planets and sets the direction of your momentum."} ${PLANETS[focus].desc}`);
        }
        if (c.timeKnown && X.hemis) {
          html += sec("Above or below the horizon", `${d.above} above · ${d.below} below. ` + (d.above > d.below ? X.hemis.above : d.above < d.below ? X.hemis.below : X.hemis.balancedVertical));
          html += sec("East or west", `${d.east} east · ${d.west} west. ` + (d.east > d.west ? X.hemis.east : d.east < d.west ? X.hemis.west : X.hemis.balancedHorizontal));
          if (X.quadrants) {
            html += `<h4>Quadrants</h4><div class="bars" style="margin-bottom:14px">`;
            for (const q of [1, 2, 3, 4]) html += `<div class="bar-row"><span class="lab">Q${q}</span><span class="track"><b style="width:${d.quadrants[q].length * 10}%;background:var(--accent)"></b></span><span class="val">${d.quadrants[q].length}</span></div>`;
            html += `</div>`;
            const top = [1, 2, 3, 4].sort((a, b) => d.quadrants[b].length - d.quadrants[a].length)[0];
            const empty = [1, 2, 3, 4].filter((q) => !d.quadrants[q].length);
            html += paras([`${X.quadrants[top].name}: ${X.quadrants[top].text} (${d.quadrants[top].map(pName).join(", ")}.)`,
              empty.length ? `Empty: ${empty.map((q) => X.quadrants[q].name).join("; ")}. An empty quadrant is not missing from your life; it is met through other people and through the houses' rulers.` : ""]);
          }
        } else if (!c.timeKnown) {
          html += paras(["Add a birth time to see hemisphere and quadrant emphasis."]);
        }
        break;
      }
      case "retro": {
        const X = D().retro || {};
        const r = c.points.filter((p) => p.retro && (PLANET_KEYS.includes(p.key) || p.key === "chiron"));
        html = sheetSimple("Retrograde planets", `${r.filter((p) => p.key !== "chiron").length} retrograde`, r.length ? r.map((p) => pName(p.key)).join(" · ") : "all planets direct", []);
        html += sec("What retrograde means", "A planet is retrograde when, seen from Earth, it appears to move backwards through the zodiac. Its energy tends to turn inward: more reflective, more personal, often slower to develop and deeper once it does.");
        if (!r.length) html += paras([X.none || "Every planet was direct at your birth."]);
        for (const p of r) html += sec(`${pName(p.key)} ℞ in ${SIGNS[p.sign].name}`, X[p.key] || K.RETRO_KARMIC[p.key]);
        if (d.stationary.length) {
          html += sec(`Stationary: ${d.stationary.map(pName).join(", ")}`, [X.stationary, d.stationary.map((k) => `${pName(k)} was moving just ${Math.abs(c.get(k).speed).toFixed(3)}° per day, close to a standstill.`).join(" ")]);
        }
        break;
      }
      case "pattern": case "kpattern": {
        const pt = kind === "pattern" ? state._patterns[+arg] : c.patterns[+arg];
        const info = K.PATTERNS[pt.type];
        html = sheetSimple("Aspect pattern", info.name, pt.members.map((k) => `<span class="sym" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>`).join(" "), [
          info.desc,
          `Involves ${pt.members.map((k) => `${pName(k)} in ${SIGNS[c.get(k).sign].name}`).join(", ")}.`,
          pt.apex ? `The apex is ${pName(pt.apex)}: ${PLANETS[pt.apex].desc}` : "",
        ]);
        html += `<div class="list">${pt.members.map((k) => pointRow(c.get(k))).join("")}</div>`;
        break;
      }
      case "nodecontact": {
        const P = PLANETS[arg];
        const txt = {
          north: `${P.name} conjunct the North Node: ${P.core} is bound up with your destiny. Developing this planet consciously is part of what you came here to do, and people or events tied to it often feel fated.`,
          south: `${P.name} conjunct the South Node: ${P.core} carries a strong past-life imprint. It is a gift you arrive with, but it can also be a habit that pulls you backward. Use it to serve your North Node.`,
          bend: `${P.name} square the nodes sits at the "bending" point of the nodal axis — traditionally a skipped step. Lessons around ${P.core} were left unfinished and must be integrated before the North Node path fully opens.`,
        }[arg2];
        html = sheetSimple("Nodal contact", P.name, "", [txt, P.desc]);
        break;
      }
      default: return;
    }
    openSheet(html, themeFor(spec));
  }

  /* ------------------------------------------------------------------ */
  /* LIFE AREAS: synthesised readings                                   */
  /* ------------------------------------------------------------------ */
  const sName = (p) => SIGNS[p.sign].name;
  const LIFE_AREAS = {
    self: { title: "Self & identity", color: "#eef2f6", keys: ["sun", "moon", "asc"],
      sub: (c) => `${sName(c.get("sun"))} Sun · ${sName(c.get("moon"))} Moon${c.timeKnown ? ` · ${sName(c.get("asc"))} rising` : ""}` },
    mind: { title: "Mind & voice", color: "#7fd6cf", keys: ["mercury"],
      sub: (c) => `Mercury in ${sName(c.get("mercury"))}${c.get("mercury").retro ? " ℞" : ""}` },
    love: { title: "Love & partnership", color: "#eeaacb", keys: ["venus", "mars"],
      sub: (c) => `Venus in ${sName(c.get("venus"))}${c.timeKnown ? ` · ${SIGNS[signOf(c.asc + 180)].name} descendant` : ""}` },
    career: { title: "Career & calling", color: "#cdb98c", keys: ["mc", "saturn"],
      sub: (c) => c.timeKnown ? `Midheaven in ${sName(c.get("mc"))} · Saturn in ${sName(c.get("saturn"))}` : `Saturn in ${sName(c.get("saturn"))}` },
    money: { title: "Money & worth", color: "#f2b77c", keys: ["venus", "jupiter"],
      sub: (c) => c.timeKnown ? `${SIGNS[signOf(c.houses[2])].name} on the 2nd house` : `Jupiter in ${sName(c.get("jupiter"))}` },
    home: { title: "Home & family", color: "#cfd8ea", keys: ["moon"],
      sub: (c) => c.timeKnown ? `${SIGNS[signOf(c.mc + 180)].name} IC · Moon in ${sName(c.get("moon"))}` : `Moon in ${sName(c.get("moon"))}` },
    health: { title: "Body & daily life", color: "#f28b6d", keys: ["mars"],
      sub: (c) => c.timeKnown ? `${SIGNS[signOf(c.houses[6])].name} on the 6th · Mars in ${sName(c.get("mars"))}` : `Mars in ${sName(c.get("mars"))}` },
    growth: { title: "Growth & meaning", color: "#f2b77c", keys: ["jupiter"],
      sub: (c) => `Jupiter in ${sName(c.get("jupiter"))}${c.timeKnown ? ` · ${ord(c.get("jupiter").house)} house` : ""}` },
    spirit: { title: "Spirit & the unseen", color: "#93a8f6", keys: ["neptune"],
      sub: (c) => c.timeKnown ? `${SIGNS[signOf(c.houses[12])].name} on the 12th · ${c.derived.phase.name}` : c.derived.phase.name },
  };

  const CORE_POINTS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode", "lilith"];

  function planetsInHouse(h) {
    return state.chart.points.filter((p) => p.house === h && CORE_POINTS.includes(p.key));
  }
  function placementBlock(key, opts) {
    opts = opts || {};
    const c = state.chart, p = c.get(key);
    if (!p) return "";
    const dp = deepPlanetSign(key, p.sign);
    const dh = p.house ? deepPlanetHouse(key, p.house) : null;
    const title = key === "asc" ? `${sName(p)} rising` : `${pName(key)} in ${sName(p)}${p.house && key !== "mc" ? ` · ${ord(p.house)} house` : ""}`;
    const body = [opts.full ? (dp ? dp.text : signText(p)) : firstPara(dp ? dp.text : signText(p))];
    if (opts.extra) body.push(opts.extra);
    if (opts.house !== false && dh) body.push(opts.full ? dh.text : firstPara(dh.text));
    return `<p class="minihead"><span class="sym" style="color:${PLANETS[key].color}">${pGlyph(key)}</span> ${esc(title)}</p>${paras(body)}`;
  }
  function houseBlock(h, field, label) {
    const c = state.chart;
    if (!c.timeKnown) return "";
    const cs = signOf(c.houses[h]);
    const ruler = rulerOf(cs), rp = c.get(ruler);
    const ds = deepSign(cs);
    const inside = planetsInHouse(h);
    let out = `<p class="minihead">${esc(label || `${ord(h)} house`)} · ${signGlyph(cs)} ${esc(SIGNS[cs].name)}</p>`;
    out += paras([
      field && ds ? ds[field] : `You approach ${HOUSES[h].areas} ${SIGNS[cs].how}.`,
      rp.house === h ? `Its ruler ${pName(ruler)} sits inside the house, concentrating these themes.` : `Its ruler ${pName(ruler)} sits in your ${ord(rp.house)} house, tying this area to ${HOUSES[rp.house].areas}.`,
      inside.length ? `Planets here: ${inside.map((p) => `${pName(p.key)} in ${sName(p)}`).join(", ")}.` : (deepHouse(h) || {}).empty,
    ]);
    for (const p of inside) {
      const d = deepPlanetHouse(p.key, h);
      if (d) out += paras([firstPara(d.text)]);
    }
    return out;
  }
  function aspectBetween(a, b) {
    const c = state.chart;
    const asp = c.aspects.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (!asp) return "";
    const dA = deepAspect(a, b);
    const body = dA ? (asp.type === "conjunction" ? dA.fusion : FLOW_TYPES.has(asp.type) ? dA.flow : dA.tension) : aspectText(asp);
    return `<p class="minihead">${esc(pShort(a))} <span class="sym" style="color:${ASPECTS[asp.type].color}">${ASPECTS[asp.type].glyph}</span> ${esc(pShort(b))} · ${esc(ASPECTS[asp.type].name.toLowerCase())}, orb ${orbStr(asp.orb)}</p>${paras([body])}`;
  }
  // each life-area heading takes the colour of the planet that governs that part of the reading
  const AREA_HEAD = {
    "Core": "sun", "Inner world": "moon", "Sun and Moon together": "moon", "How you think": "mercury", "Retrograde Mercury": "mercury",
    "Everyday learning": "mercury", "Higher learning": "jupiter", "How you love": "venus", "Desire and pursuit": "mars",
    "Partnership": "venus", "Romance and play": "sun", "Intimacy": "pluto", "Vocation": "saturn", "Discipline and mastery": "saturn",
    "Purpose": "sun", "Daily work": "mercury", "Earning and self-worth": "venus", "What you value": "venus",
    "Luck and expansion": "jupiter", "Shared resources": "pluto", "Part of Fortune": "fortune", "Roots": "moon",
    "Emotional needs": "moon", "Body and vitality": "mars", "Routines and habits": "mercury", "Energy and drive": "mars",
    "Where life opens up": "jupiter", "Belief and exploration": "jupiter", "Direction": "northNode", "The hidden house": "neptune",
    "Ideals and imagination": "neptune", "Moon phase at birth": "moon", "The wounded healer": "chiron",
  };
  function areaSection(title, inner) {
    if (!inner) return "";
    let color = AREA_HEAD[title] ? PLANETS[AREA_HEAD[title]].color : null;
    if (title === "Chart ruler" && state.chart.derived.chartRuler) color = PLANETS[state.chart.derived.chartRuler].color;
    const el = /^Your (fire|earth|air|water) emphasis$/.exec(title);
    if (el) color = K.ELEMENTS[el[1]].color;
    return `<h4${headStyle(color)}>${esc(title)}</h4>${inner}`;
  }

  function sheetArea(k) {
    const c = state.chart, A = LIFE_AREAS[k];
    const known = c.timeKnown;
    let html = `<section class="hero"><div class="eyebrow">Life area</div><h2 class="display">${esc(A.title)}</h2><div class="subline">${esc(A.sub(c))}</div></section>`;
    const noTime = known ? "" : `<p class="note" style="text-align:left;margin:0 0 12px">Birth time unknown: house-based parts of this reading are hidden.</p>`;
    html += noTime;
    switch (k) {
      case "self": {
        const sun = c.get("sun"), moon = c.get("moon");
        html += areaSection("Core", placementBlock("sun", { house: false }));
        html += areaSection("Inner world", placementBlock("moon", { house: false }));
        if (known) html += areaSection("Outer style", placementBlock("asc"));
        const e1 = SIGNS[sun.sign].element, e2 = SIGNS[moon.sign].element;
        const blend = e1 === e2 ? `Your Sun and Moon share the ${e1} element, so what you want and what you need tend to pull in the same direction.`
          : ({ "fire|air": 1, "air|fire": 1, "earth|water": 1, "water|earth": 1 }[e1 + "|" + e2] ? `Your ${e1} Sun and ${e2} Moon are compatible elements: will and feeling support each other with a little conscious effort.`
          : `Your ${e1} Sun and ${e2} Moon speak different languages. Part of your life's work is letting your head and your heart both have a say.`);
        html += areaSection("Sun and Moon together", paras([blend]) + aspectBetween("sun", "moon"));
        if (known) {
          const r = c.derived.chartRuler, rp = c.get(r);
          const dh = deepPlanetHouse(r, rp.house);
          html += areaSection("Chart ruler", paras([`${pName(r)} rules your Ascendant, making it the planet that steers your whole chart. It sits in ${sName(rp)} in your ${ord(rp.house)} house, so ${HOUSES[rp.house].areas} become a central stage for who you are becoming.`, dh ? firstPara(dh.text) : ""]));
        }
        break;
      }
      case "mind":
        html += areaSection("How you think", placementBlock("mercury", { full: true }));
        html += aspectBetween("mercury", "moon") + aspectBetween("mercury", "saturn") + aspectBetween("mercury", "jupiter") + aspectBetween("mercury", "uranus") + aspectBetween("mercury", "neptune");
        if (c.get("mercury").retro) html += areaSection("Retrograde Mercury", paras([K.RETRO_KARMIC.mercury]));
        html += areaSection("Everyday learning", houseBlock(3, null, "3rd house"));
        html += areaSection("Higher learning", houseBlock(9, null, "9th house"));
        break;
      case "love": {
        const v = c.get("venus");
        html += areaSection("How you love", placementBlock("venus", { full: true, extra: (deepSign(v.sign) || {}).love }));
        html += areaSection("Desire and pursuit", placementBlock("mars"));
        html += aspectBetween("venus", "mars") + aspectBetween("moon", "venus") + aspectBetween("venus", "saturn") + aspectBetween("venus", "pluto");
        html += areaSection("Partnership", houseBlock(7, "partner", "Descendant · 7th house"));
        html += areaSection("Romance and play", houseBlock(5, null, "5th house"));
        html += areaSection("Intimacy", houseBlock(8, null, "8th house"));
        break;
      }
      case "career":
        if (known) html += areaSection("Vocation", houseBlock(10, "career", "Midheaven · 10th house"));
        html += areaSection("Discipline and mastery", placementBlock("saturn"));
        html += areaSection("Purpose", placementBlock("sun"));
        if (known) html += areaSection("Daily work", houseBlock(6, null, "6th house"));
        html += aspectBetween("sun", "saturn") + aspectBetween("saturn", "mc") + aspectBetween("jupiter", "mc");
        break;
      case "money":
        if (known) html += areaSection("Earning and self-worth", houseBlock(2, "money", "2nd house"));
        html += areaSection("What you value", placementBlock("venus"));
        html += areaSection("Luck and expansion", placementBlock("jupiter"));
        if (known) html += areaSection("Shared resources", houseBlock(8, null, "8th house"));
        if (known && c.get("fortune")) {
          const f = c.get("fortune");
          html += areaSection("Part of Fortune", paras([`${sName(f)} · ${ord(f.house)} house. ${signText(f)} It points to ${HOUSES[f.house].areas} as a natural source of ease.`]));
        }
        break;
      case "home":
        if (known) html += areaSection("Roots", houseBlock(4, "home", "IC · 4th house"));
        html += areaSection("Emotional needs", placementBlock("moon"));
        html += aspectBetween("moon", "saturn") + aspectBetween("moon", "pluto") + aspectBetween("moon", "uranus");
        break;
      case "health":
        if (known) {
          const a = c.get("asc");
          html += areaSection("Body and vitality", paras([`With ${sName(a)} rising, the body areas traditionally linked to your chart are the ${SIGNS[a.sign].body.toLowerCase()}. ${firstPara((deepPlanetSign("asc", a.sign) || {}).text || SIGNS[a.sign].rising)}`]));
          html += areaSection("Routines and habits", houseBlock(6, null, "6th house"));
        }
        html += areaSection("Energy and drive", placementBlock("mars"));
        {
          const d = c.derived, B = deepBalance(d.domEl);
          if (B) html += areaSection(`Your ${d.domEl} emphasis`, paras([B.strong]) + advice(B.remedy));
        }
        html += `<p class="note" style="text-align:left">Astrology describes tendencies, not medical conditions. See a health professional for anything that concerns you.</p>`;
        break;
      case "growth":
        html += areaSection("Where life opens up", placementBlock("jupiter", { full: true }));
        html += aspectBetween("sun", "jupiter") + aspectBetween("jupiter", "saturn");
        html += areaSection("Belief and exploration", houseBlock(9, null, "9th house"));
        html += areaSection("Direction", paras([(deepAxis(c.get("northNode").sign) || {}).story || SIGNS[c.get("northNode").sign].nn]));
        break;
      case "spirit":
        html += areaSection("The hidden house", houseBlock(12, null, "12th house"));
        html += areaSection("Ideals and imagination", placementBlock("neptune"));
        html += areaSection("Moon phase at birth", paras([c.derived.phase.desc]));
        html += areaSection("The wounded healer", placementBlock("chiron"));
        break;
    }
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* TODAY: transits to the natal chart                                 */
  /* ------------------------------------------------------------------ */
  const T_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode"];
  const N_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode", "asc", "mc"];
  const T_ORB = { moon: 2, sun: 2, mercury: 2, venus: 2, mars: 2, jupiter: 2, saturn: 2, uranus: 1.5, neptune: 1.5, pluto: 1.5, chiron: 1.5, northNode: 1.5 };
  const T_RANK = { pluto: 10, neptune: 9, uranus: 8, saturn: 7, chiron: 6.5, jupiter: 6, northNode: 5, mars: 4, sun: 3.5, venus: 3, mercury: 2.5, moon: 1 };
  const T_ASPECTS = [
    { key: "conjunction", angle: 0 }, { key: "opposition", angle: 180 }, { key: "square", angle: 90 },
    { key: "trine", angle: 120 }, { key: "sextile", angle: 60 },
  ];
  const T_VERB = { conjunction: "meets", opposition: "opposes", square: "squares", trine: "trines", sextile: "sextiles" };
  const SLOW_T = new Set(["jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode"]);
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fmtDay = (d) => `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const fmtShort = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const fmtDayYear = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

  function transitDate() {
    if (state.transitDate) return new Date(state.transitDate);
    // "now" is pinned for a few minutes so the transit list stays stable while you read it
    if (!state._nowPin || Date.now() - state._nowPin > 300000) state._nowPin = Date.now();
    return new Date(state._nowPin);
  }

  function computeTransits() {
    const c = state.chart;
    const date = transitDate();
    const key = date.getTime() + "|" + JSON.stringify(state.settings) + "|" + (state.record && state.record.id);
    if (state._transits && state._transits.key === key) return state._transits;
    const tc = E.computeChart({ utc: date, lat: c.input.lat, lon: c.input.lon, timeKnown: false }, state.settings);
    const tpoints = T_KEYS.map((k) => tc.get(k)).filter(Boolean);
    for (const p of tpoints) p.natalHouse = c.timeKnown ? houseOfLon(p.lon) : null;
    const list = [];
    for (const t of tpoints) {
      for (const nk of N_KEYS) {
        const n = c.get(nk);
        if (!n) continue;
        const sep = Math.abs(E.diff(t.lon, n.lon));
        for (const asp of T_ASPECTS) {
          const orb = Math.abs(sep - asp.angle);
          if (orb > T_ORB[t.key]) continue;
          const sep2 = Math.abs(E.diff(t.lon + t.speed * 0.05, n.lon));
          const weight = T_RANK[t.key] + (["sun", "moon", "asc", "mc"].includes(nk) ? 1 : 0) - orb * 0.3;
          list.push({ t: t.key, n: nk, type: asp.key, angle: asp.angle, orb, applying: Math.abs(sep2 - asp.angle) < orb, weight });
        }
      }
    }
    list.sort((a, b) => b.weight - a.weight);
    const moon = tc.get("moon"), sun = tc.get("sun");
    const phaseAngle = E.norm(moon.lon - sun.lon);
    const phase = K.MOON_PHASES.slice().reverse().find((ph) => phaseAngle >= ph.from);
    state._transits = { key, date, tc, tpoints, list, phaseAngle, phase, windows: {} };
    return state._transits;
  }

  /** Days the transit stays in orb, and the date(s) it is exact. */
  function transitWindow(tr) {
    const T = computeTransits();
    const id = tr.t + tr.n + tr.type;
    if (T.windows[id]) return T.windows[id];
    const natal = state.chart.get(tr.n).lon;
    const opts = { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac };
    const orbAt = (ms) => Math.abs(Math.abs(E.diff(E.lonAt(tr.t, new Date(ms), opts), natal)) - tr.angle);
    const DAY = 86400000;
    const step = (SLOW_T.has(tr.t) ? 2 : tr.t === "mars" ? 0.5 : tr.t === "moon" ? 0.05 : 0.25) * DAY;
    const span = (SLOW_T.has(tr.t) ? 540 : tr.t === "mars" ? 90 : tr.t === "moon" ? 2 : 30) * DAY;
    const limit = T_ORB[tr.t];
    const t0 = T.date.getTime();
    const samples = [[t0, orbAt(t0)]];
    let start = null, end = null;
    for (let t = t0 - step; t >= t0 - span; t -= step) { const o = orbAt(t); samples.unshift([t, o]); if (o > limit) { start = t; break; } }
    for (let t = t0 + step; t <= t0 + span; t += step) { const o = orbAt(t); samples.push([t, o]); if (o > limit) { end = t; break; } }
    const exacts = [];
    for (let i = 1; i < samples.length - 1; i++) {
      if (samples[i][1] <= samples[i - 1][1] && samples[i][1] <= samples[i + 1][1]) {
        let lo = samples[i - 1][0], hi = samples[i + 1][0];
        for (let k = 0; k < 40; k++) {
          const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
          if (orbAt(m1) < orbAt(m2)) hi = m2; else lo = m1;
        }
        const tm = (lo + hi) / 2, om = orbAt(tm);
        if (om < 0.1 && !exacts.some((e) => Math.abs(e - tm) < step * 2)) exacts.push(tm);
      }
    }
    const w = { start: start ? new Date(start) : null, end: end ? new Date(end) : null, exacts: exacts.map((e) => new Date(e)) };
    T.windows[id] = w;
    return w;
  }

  function windowLine(tr) {
    const w = transitWindow(tr);
    const now = transitDate().getTime();
    const next = w.exacts.find((e) => e.getTime() >= now - 43200000);
    const parts = [];
    if (tr.t === "moon") parts.push(next ? `exact ${pad(next.getHours())}:${pad(next.getMinutes())}` : "passing today");
    else if (next) parts.push(`exact ${fmtShort(next)}`);
    else if (w.exacts.length) parts.push(`was exact ${fmtShort(w.exacts[w.exacts.length - 1])}`);
    else if (tr.t !== "moon") parts.push("no exact pass");
    if (tr.t !== "moon" && w.end) parts.push(`until ${SLOW_T.has(tr.t) ? MONTHS[w.end.getMonth()] + " " + w.end.getFullYear() : fmtShort(w.end)}`);
    return parts.join(" · ");
  }

  function transitText(tr, field) {
    const X = D().transitAspects;
    const d = X && X[tr.t + "|" + tr.n];
    if (d) return d[field];
    const TP = (D().transitPlanets || {})[tr.t];
    const pair = deepAspect(tr.t, tr.n);
    return [
      `Transiting ${pName(tr.t)} ${T_VERB[tr.type]} your natal ${pName(tr.n)}, touching ${PLANETS[tr.n].core}.`,
      field === "conj" ? "A conjunction concentrates the transit's energy directly on this part of you." :
        field === "soft" ? "A flowing aspect: doors open more easily here if you take the initiative." :
          "A challenging aspect: pressure builds until something shifts, and effort now pays off later.",
      TP ? TP.brings : "",
      pair ? pair.theme : "",
    ].filter(Boolean).join(" ");
  }

  function renderToday() {
    const c = state.chart;
    const T = computeTransits();
    const d = T.date;
    const isNow = !state.transitDate;
    const moon = T.tc.get("moon");
    const top = T.list.find((x) => x.t !== "moon") || T.list[0];
    let html = `<section class="hero">
      <div class="eyebrow">Transits<span class="sep">·</span>${esc(fmtDay(d))}<span class="sep">·</span>${isNow ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : d.getFullYear()}</div>
      <h1 class="display sm">${top ? `${esc(pShort(top.t))} <span class="sym" style="color:${ASPECTS[top.type].color}">${ASPECTS[top.type].glyph}</span> ${esc(pShort(top.n))}` : "A quiet sky"}</h1>
      <div class="subline">Moon in <strong>${SIGNS[moon.sign].name}</strong>${moon.natalHouse ? ` · your ${ord(moon.natalHouse)} house` : ""} · ${esc(T.phase.name)}</div>
    </section>
    <div class="chips" style="margin-top:0">
      <button class="chip" data-act="tprev" aria-label="Previous day">‹ Day</button>
      <button class="chip" data-act="tnow" aria-pressed="${isNow}">Now</button>
      <button class="chip" data-act="tnext" aria-label="Next day">Day ›</button>
    </div>
    <div class="field" style="border-top:1px solid var(--line);margin-top:14px"><label for="t-date">Date</label><input type="date" id="t-date" value="${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}"></div>`;

    const personal = T.list.filter((x) => x.t !== "moon");
    const lunar = T.list.filter((x) => x.t === "moon");
    html += `<div class="section-label">Your transits · ${personal.length}</div>`;
    if (!personal.length) html += `<p class="note">No planets are within orb of your natal points on this day.</p>`;
    html += `<div class="list">`;
    T.list.forEach((tr, i) => {
      if (tr.t === "moon") return;
      html += transitRow(tr, i);
    });
    html += `</div>`;
    if (lunar.length) {
      html += `<div class="section-label">The Moon today</div><div class="list">`;
      T.list.forEach((tr, i) => { if (tr.t === "moon") html += transitRow(tr, i); });
      html += `</div>`;
    }

    html += `<div class="section-label">Where the planets are</div><div class="list">`;
    for (const p of T.tpoints) {
      const P = PLANETS[p.key];
      html += `<button class="row" data-open="tplanet:${p.key}">
        <span class="dot" style="color:${P.color}"></span><span class="glyph" style="color:${P.color}">${P.glyph}</span>
        <span class="main"><div class="title">${esc(P.name)}</div><div class="sub">${esc(SIGNS[p.sign].name)}${p.natalHouse ? ` · your ${ord(p.natalHouse)} house` : ""}</div></span>
        <span class="end"><div class="pos">${degStr(p)}${signGlyph(p.sign)}${p.retro ? '<span class="retro">℞</span>' : ""}</div></span></button>`;
    }
    html += `</div>`;
    const retro = T.tpoints.filter((p) => p.retro && PLANET_KEYS.includes(p.key));
    if (retro.length) html += `<p class="note">Retrograde now: ${retro.map((p) => esc(pName(p.key))).join(", ")}.</p>`;
    html += `<p class="note">Transits are the planets' current positions compared with your birth chart. Slow planets shape months and years; the Moon and inner planets colour days and weeks.</p>`;
    return html;
  }

  function transitRow(tr, i) {
    const X = ASPECTS[tr.type];
    return `<button class="row" data-open="transit:${i}">
      <span class="dot" style="color:${PLANETS[tr.t].color}"></span>
      <span class="main"><div class="title">${esc(pShort(tr.t))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(tr.n === "asc" || tr.n === "mc" ? pName(tr.n) : "natal " + pShort(tr.n))}</div>
      <div class="sub wrap" data-window="${i}">${esc(X.name)}</div></span>
      <span class="end"><div class="pos">${orbStr(tr.orb)}</div><div class="pos-sub">${tr.applying ? "Applying" : "Separating"}</div></span></button>`;
  }

  function fillTransitWindows() {
    const T = computeTransits();
    const cells = [...document.querySelectorAll("[data-window]")];
    let i = 0;
    const next = () => {
      const el = cells[i++];
      if (!el || !document.body.contains(el)) return;
      const tr = T.list[+el.dataset.window];
      const line = windowLine(tr);
      el.textContent = line || ASPECTS[tr.type].name;
      setTimeout(next, 0);
    };
    setTimeout(next, 20);
  }

  function sheetTransit(i) {
    const c = state.chart, T = computeTransits();
    const tr = T.list[i];
    const X = ASPECTS[tr.type];
    const tp = T.tc.get(tr.t), np = c.get(tr.n);
    const w = transitWindow(tr);
    const field = tr.type === "conjunction" ? "conj" : tr.type === "trine" || tr.type === "sextile" ? "soft" : "hard";
    let html = `<section class="hero"><div class="eyebrow">Transit · ${esc(X.name)}</div>
      <h2 class="display">${esc(pShort(tr.t))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(tr.n))}</h2>
      <div class="subline">transiting ${esc(pName(tr.t))} ${T_VERB[tr.type]} your natal ${esc(pName(tr.n))}</div></section>`;
    html += facts([
      [`Transiting ${pShort(tr.t)}`, `${degStr(tp)} ${signGlyph(tp.sign)}${tp.retro ? " ℞" : ""}${tp.natalHouse ? ` · H${tp.natalHouse}` : ""}`],
      [`Natal ${pShort(tr.n)}`, `${degStr(np)} ${signGlyph(np.sign)}${np.house ? ` · H${np.house}` : ""}`],
      ["Orb", `${orbStr(tr.orb)} · ${tr.applying ? "applying" : "separating"}`],
      ["Exact", w.exacts.length ? w.exacts.map((e) => tr.t === "moon" ? `${pad(e.getHours())}:${pad(e.getMinutes())}` : fmtDayYear(e)).join(", ") : w.start && w.end ? `Doesn't reach exact: ${pName(tr.t)} changes direction first` : "Beyond the search window"],
      w.start || w.end ? ["In orb", `${w.start ? fmtDayYear(w.start) : "before"} – ${w.end ? fmtDayYear(w.end) : "later"}`] : null,
      [`${pShort(tr.t)} timescale`, ((D().transitPlanets || {})[tr.t] || {}).timescale || "—"],
    ]);
    html += paras([transitText(tr, field)]);
    if (w.exacts.length > 1) html += sec("Multiple passes", `Because ${pName(tr.t)} turns retrograde, this transit is exact ${w.exacts.length} times. The first pass tends to raise the theme, the middle pass reviews it, and the last pass settles it.`);
    if (c.timeKnown && tp.natalHouse && np.house) {
      html += sec("Where it lands", `${pName(tr.t)} is moving through your ${ord(tp.natalHouse)} house (${HOUSES[tp.natalHouse].areas}), and your natal ${pName(tr.n)}${np.house ? ` sits in your ${ord(np.house)} house (${HOUSES[np.house].areas})` : ""}. Expect the theme to show up in these areas of life.`);
    }
    const pair = deepAspect(tr.t, tr.n);
    if (pair) html += sec(`${pName(tr.t)} and ${pName(tr.n)}`, pair.theme);
    const TP = (D().transitPlanets || {})[tr.t];
    if (TP) html += sec(`What ${pName(tr.t)} brings`, TP.brings);
    html += `<div class="list"><button class="row" data-open="point:${tr.n}"><span class="dot" style="color:${PLANETS[tr.n].color}"></span><span class="main"><div class="title">Your natal ${esc(pName(tr.n))}</div><div class="sub">Open the birth-chart reading</div></span></button></div>`;
    return html;
  }

  function sheetTransitPlanet(key) {
    const T = computeTransits();
    const p = T.tc.get(key);
    const P = PLANETS[key];
    const TP = (D().transitPlanets || {})[key];
    const TH = p.natalHouse ? ((D().transitHouses || {})[key] || {})[p.natalHouse] : null;
    let html = `<section class="hero"><div class="eyebrow">In the sky · ${esc(fmtDay(T.date))}</div>
      <h2 class="display">${esc(P.name)} in ${SIGNS[p.sign].name}</h2>
      <div class="subline"><span class="sym" style="color:${P.color}">${P.glyph}</span> ${degFull(p)} ${signGlyph(p.sign)}${p.retro ? ' <span class="retro">℞ retrograde</span>' : ""}</div></section>`;
    html += facts([
      ["Sign", `${signGlyph(p.sign)} ${SIGNS[p.sign].name}`],
      p.natalHouse ? ["Your house", `${ord(p.natalHouse)} · ${HOUSES[p.natalHouse].title}`] : null,
      ["Motion", `${p.retro ? "Retrograde" : "Direct"} · ${Math.abs(p.speed).toFixed(3)}°/day`],
      TP ? ["Timescale", TP.timescale] : null,
    ]);
    if (TP) html += paras([TP.brings]);
    if (p.natalHouse) html += sec(`Through your ${ord(p.natalHouse)} house`, TH ? TH.text : `${pName(key)} is highlighting ${HOUSES[p.natalHouse].areas}.`) + (TH && TH.advice ? advice(TH.advice) : "");
    const mine = T.list.map((tr, i) => [tr, i]).filter(([tr]) => tr.t === key);
    if (mine.length) html += `<h4>Aspects to your chart</h4><div class="list">${mine.map(([tr, i]) => transitRow(tr, i)).join("")}</div>`;
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* settings                                                           */
  /* ------------------------------------------------------------------ */
  function openSettings() {
    const s = state.settings;
    const opt = (group, value, label, sub) =>
      `<button class="opt" role="radio" data-set="${group}" data-val="${value}" aria-checked="${String(s[group]) === String(value)}"><span>${label}${sub ? `<span class="opt-sub">${sub}</span>` : ""}</span><span class="check"></span></button>`;
    const html = `<section class="hero"><div class="eyebrow">Settings</div><h2 class="display">Chart options</h2></section>
      <h4>House system</h4><div class="opt-list">
        ${opt("houseSystem", "placidus", "Placidus", "Most popular · time-based")}
        ${opt("houseSystem", "koch", "Koch", "Birthplace system")}
        ${opt("houseSystem", "whole", "Whole Sign", "Hellenistic · one sign per house")}
        ${opt("houseSystem", "equal", "Equal", "30° from the Ascendant")}
        ${opt("houseSystem", "porphyry", "Porphyry", "Trisected quadrants")}
        ${opt("houseSystem", "regiomontanus", "Regiomontanus", "Horary favourite")}
      </div>
      <h4>Zodiac</h4><div class="opt-list">
        ${opt("zodiac", "tropical", "Tropical", "Western · season-based")}
        ${opt("zodiac", "sidereal", "Sidereal", "Vedic · Lahiri ayanamsa")}
      </div>
      <h4>Lunar nodes</h4><div class="opt-list">
        ${opt("nodeType", "mean", "Mean node", "Smoothed average · Astro-Seek default")}
        ${opt("nodeType", "true", "True node", "Actual osculating position")}
      </div>
      <h4>Aspects</h4><div class="opt-list">
        ${opt("minorAspects", "true", "Major + minor", "Adds quincunx, semi-sextile, quintiles…")}
        ${opt("minorAspects", "false", "Major only", "Conjunction, opposition, trine, square, sextile")}
      </div>
      <h4>Orbs</h4><div class="opt-list">
        ${opt("orbScale", "0.75", "Tight", "×0.75")}
        ${opt("orbScale", "1", "Standard", "8° majors · +2° for Sun & Moon")}
        ${opt("orbScale", "1.25", "Wide", "×1.25")}
      </div>`;
    openSheet(html);
  }

  function applySetting(group, val) {
    let v = val;
    if (group === "minorAspects") v = val === "true";
    if (group === "orbScale") v = parseFloat(val);
    state.settings[group] = v;
    store.set("settings", state.settings);
    for (const b of sheetBody.querySelectorAll(`[data-set="${group}"]`)) b.setAttribute("aria-checked", String(b.dataset.val === val));
    if (state.record) {
      state.chart = compute(state.record);
      render();
    }
  }

  /* ------------------------------------------------------------------ */
  /* form                                                               */
  /* ------------------------------------------------------------------ */
  let formPlace = null;
  function renderForm() {
    const r = state.editing || null;
    formPlace = r ? r.place : null;
    const saved = state.saved;
    let html = `<section class="hero">
      <h1 class="display brand">Natal Chart</h1>
      <div class="subline brand-sub">Your sky, at birth</div>
      <div class="meta">planets · houses · nodes · aspects · karma</div>
    </section>
    <form class="form" id="birth-form" autocomplete="off">
      <div class="field"><label for="f-name">Name</label><input type="text" id="f-name" maxlength="40" value="${r ? esc(r.name || "") : ""}"></div>
      <div class="field"><label for="f-date">Date</label><input type="date" id="f-date" required min="1850-01-01" max="2149-12-31" value="${r ? `${r.y}-${pad(r.mo)}-${pad(r.d)}` : ""}"></div>
      <div class="field"><label for="f-time">Time</label><input type="time" id="f-time" value="${r && r.timeKnown ? `${pad(r.h)}:${pad(r.mi)}` : ""}">
        <label class="toggle" style="width:auto"><input type="checkbox" id="f-unknown" ${r && !r.timeKnown ? "checked" : ""}> Unknown</label></div>
      <div class="field" id="place-field"><label for="f-place">Place</label><input type="text" id="f-place" placeholder="Search city" value="${r ? esc(r.place.name) : ""}"><div class="results" id="results" hidden></div></div>
      <div class="place-meta" id="place-meta">${r ? placeMeta(r.place) : ""}</div>
      <div class="advanced" id="advanced" hidden>
        <div class="field"><label for="f-lat">Lat</label><input type="number" id="f-lat" step="0.0001" min="-90" max="90" placeholder="-36.8485" value="${r ? r.place.lat : ""}"></div>
        <div class="field"><label for="f-lon">Lon</label><input type="number" id="f-lon" step="0.0001" min="-180" max="180" placeholder="174.7633" value="${r ? r.place.lon : ""}"></div>
        <div class="field"><label for="f-tz">Zone</label><select id="f-tz">${tzOptions(r ? r.place.tz : Intl.DateTimeFormat().resolvedOptions().timeZone)}</select></div>
        <div class="field"><label for="f-off">Offset</label><input type="number" id="f-off" step="0.25" min="-14" max="14" placeholder="Auto from zone (hours)" value="${r && typeof r.offsetOverride === "number" ? r.offsetOverride / 60 : ""}"></div>
      </div>
      <div style="text-align:center"><button type="button" class="link-btn" id="toggle-adv">Coordinates & time zone</button></div>
      <button class="gold-btn" type="submit" aria-label="Cast chart">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
      <div class="error" id="form-error"></div>
    </form>`;
    // quick way back to the most recently entered chart
    const lastId = store.get("last", null);
    const last = saved.find((x) => x.id === lastId) || saved[0];
    if (last) {
      html += `<div class="last-entered"><button class="last-pill" data-load="${last.id}">
        <span class="last-k">Last entered</span>
        <span class="last-v">${esc(last.name || "Untitled")} · ${esc(fmtDate(last))} · ${esc(last.place.name)}</span>
      </button></div>`;
    }
    if (saved.length) {
      html += `<div class="section-label">Saved charts</div><div class="list">`;
      for (const s of saved) {
        html += `<div class="row" style="padding:12px 2px"><button class="main" style="text-align:left;display:flex;align-items:center;gap:16px" data-load="${s.id}">
          <span class="dot" style="color:var(--accent)"></span>
          <span style="min-width:0"><div class="title">${esc(s.name || "Untitled")}</div><div class="sub">${esc(fmtDate(s))} · ${esc(fmtTime(s))} · ${esc(s.place.name)}</div></span></button>
          <button class="saved-del" data-del="${s.id}" aria-label="Delete">✕</button></div>`;
      }
      html += `</div>`;
    }
    return html;
  }

  function tzOptions(selected) {
    let zones = [];
    try { zones = Intl.supportedValuesOf("timeZone"); } catch (e) { zones = []; }
    if (!zones.includes("UTC")) zones.unshift("UTC");
    if (selected && !zones.includes(selected)) zones.unshift(selected);
    return zones.map((z) => `<option value="${esc(z)}" ${z === selected ? "selected" : ""}>${esc(z)}</option>`).join("");
  }

  function placeMeta(p) {
    return `${esc(fmtCoord(p.lat, p.lon))} · ${esc(p.tz)}${p.region ? " · " + esc(p.region) : ""}`;
  }

  const ALLOWED_COUNTRIES = ["AU", "NZ"];
  const fold = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function bindForm() {
    const form = $("#birth-form");
    const input = $("#f-place");
    const results = $("#results");
    const adv = $("#advanced");
    let lastQuery = "", timer = null, found = [], active = -1;

    $("#toggle-adv").addEventListener("click", () => { adv.hidden = !adv.hidden; });
    $("#f-unknown").addEventListener("change", (e) => { $("#f-time").disabled = e.target.checked; });
    if ($("#f-unknown").checked) $("#f-time").disabled = true;

    const showResults = () => {
      if (!found.length) { results.hidden = true; return; }
      results.innerHTML = found.map((c, i) => `<button type="button" data-i="${i}" class="${i === active ? "active" : ""}"><div class="r1">${esc(c.name)}</div><div class="r2">${esc(c.region || "")} · ${esc(fmtCoord(c.lat, c.lon))}</div></button>`).join("");
      results.hidden = false;
    };
    const pick = (c) => {
      formPlace = c;
      input.value = c.name;
      results.hidden = true;
      $("#place-meta").innerHTML = placeMeta(c);
      $("#f-lat").value = c.lat;
      $("#f-lon").value = c.lon;
      $("#f-tz").innerHTML = tzOptions(c.tz);
    };
    results.addEventListener("mousedown", (e) => e.preventDefault());
    results.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (b) pick(found[+b.dataset.i]);
    });
    input.addEventListener("keydown", (e) => {
      if (results.hidden) return;
      if (e.key === "ArrowDown") { active = Math.min(found.length - 1, active + 1); showResults(); e.preventDefault(); }
      if (e.key === "ArrowUp") { active = Math.max(0, active - 1); showResults(); e.preventDefault(); }
      if (e.key === "Enter" && active >= 0) { pick(found[active]); e.preventDefault(); }
    });
    input.addEventListener("blur", () => setTimeout(() => (results.hidden = true), 150));
    input.addEventListener("input", () => {
      const q = input.value.trim();
      formPlace = null;
      $("#place-meta").textContent = "";
      active = -1;
      if (q.length < 2) { found = []; showResults(); return; }
      const ql = fold(q);
      const local = window.ASTRO_CITIES.filter((c) => { const n = fold(c[0]); return n.startsWith(ql) || n.includes(" " + ql) || n.includes("(" + ql); })
        .slice(0, 6).map((c) => ({ name: c[0], region: c[1], lat: c[2], lon: c[3], tz: c[4] }));
      found = local;
      showResults();
      clearTimeout(timer);
      lastQuery = q;
      timer = setTimeout(async () => {
        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`);
          if (!res.ok || lastQuery !== q) return;
          const data = await res.json();
          const remote = (data.results || []).filter((r) => r.timezone && ALLOWED_COUNTRIES.includes(r.country_code)).map((r) => ({
            name: r.name, region: [r.admin1, r.country].filter(Boolean).join(", "), lat: +r.latitude.toFixed(4), lon: +r.longitude.toFixed(4), tz: r.timezone,
          }));
          const merged = local.slice();
          for (const r of remote) if (!merged.some((m) => Math.abs(m.lat - r.lat) < 0.2 && Math.abs(m.lon - r.lon) < 0.2)) merged.push(r);
          if (lastQuery === q && input === document.activeElement) { found = merged.slice(0, 8); showResults(); }
        } catch (e) { /* offline: local list only */ }
      }, 280);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#form-error");
      err.textContent = "";
      const dv = $("#f-date").value;
      if (!dv) { err.textContent = "Please enter a birth date."; return; }
      const [y, mo, d] = dv.split("-").map(Number);
      if (y < 1850 || y > 2149) { err.textContent = "Dates between 1850 and 2149 are supported."; return; }
      const unknown = $("#f-unknown").checked;
      const tv = $("#f-time").value;
      if (!unknown && !tv) { err.textContent = "Enter a birth time, or mark it unknown."; return; }
      const [h, mi] = unknown ? [12, 0] : tv.split(":").map(Number);
      const lat = parseFloat($("#f-lat").value), lon = parseFloat($("#f-lon").value);
      const tz = $("#f-tz").value;
      let place = formPlace;
      if (!place || (!adv.hidden && (place.lat !== lat || place.lon !== lon || place.tz !== tz))) {
        if (Number.isNaN(lat) || Number.isNaN(lon)) { err.textContent = "Choose a place from the list, or enter coordinates."; adv.hidden = false; return; }
        place = { name: $("#f-place").value.trim() || fmtCoord(lat, lon), region: "", lat, lon, tz };
      }
      const offRaw = $("#f-off").value;
      const rec = {
        id: state.editing ? state.editing.id : "c" + Date.now().toString(36),
        name: $("#f-name").value.trim(), y, mo, d, h, mi, timeKnown: !unknown, place,
      };
      if (offRaw !== "") rec.offsetOverride = Math.round(parseFloat(offRaw) * 60);
      openRecord(rec, true);
    });
  }

  function openRecord(rec, save) {
    try {
      state.record = rec;
      state.chart = compute(rec);
    } catch (e) {
      console.error(e);
      const err = $("#form-error");
      if (err) err.textContent = "Could not calculate this chart. Check the date, time and place.";
      state.chart = null;
      return;
    }
    state.editing = null;
    if (save) {
      state.saved = [rec].concat(state.saved.filter((s) => s.id !== rec.id)).slice(0, 30);
      store.set("saved", state.saved);
    }
    store.set("last", rec.id);
    setTab("chart");
  }

  /* ------------------------------------------------------------------ */
  /* event wiring                                                       */
  /* ------------------------------------------------------------------ */
  function bindView() {
    const wheel = view.querySelector(".wheel");
    if (wheel) {
      const hint = $("#wheel-hint");
      const clearFocus = () => {
        state.focus = null;
        wheel.classList.remove("focusing");
        wheel.querySelectorAll(".on,.linked").forEach((n) => n.classList.remove("on", "linked"));
        hint.textContent = "Tap a planet to trace its aspects";
      };
      wheel.addEventListener("click", (e) => {
        const g = e.target.closest(".w-planet");
        if (!g) { clearFocus(); return; }
        const key = g.dataset.key;
        if (state.focus === key) { openDetail("point:" + key); return; }
        clearFocus();
        state.focus = key;
        wheel.classList.add("focusing");
        g.classList.add("on");
        let n = 0;
        wheel.querySelectorAll(`.w-asp[data-a="${key}"], .w-asp[data-b="${key}"]`).forEach((l) => {
          l.classList.add("on");
          n++;
          const other = l.dataset.a === key ? l.dataset.b : l.dataset.a;
          const og = wheel.querySelector(`.w-planet[data-key="${other}"]`);
          if (og) og.classList.add("linked");
        });
        const p = state.chart.get(key);
        hint.innerHTML = `${esc(pName(key))} · ${degStr(p)} ${esc(SIGNS[p.sign].name)} · ${n} aspect${n === 1 ? "" : "s"} · <button data-open="point:${key}">Open</button>`;
      });
      wheel.addEventListener("keydown", (e) => {
        const g = e.target.closest(".w-planet");
        if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openDetail("point:" + g.dataset.key); }
      });
    }
    if ($("#timeline")) setTimeout(fillTimeline, 30);
    if (state.tab === "today") {
      fillTransitWindows();
      const td = $("#t-date");
      if (td) td.addEventListener("change", () => {
        if (!td.value) return;
        const [y, m, dd] = td.value.split("-").map(Number);
        const now = new Date();
        const isToday = y === now.getFullYear() && m === now.getMonth() + 1 && dd === now.getDate();
        state.transitDate = isToday ? null : new Date(y, m - 1, dd, 12, 0).getTime();
        render();
      });
    }
  }

  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open && state.chart) { e.preventDefault(); openDetail(open.dataset.open); return; }
    const set = e.target.closest("[data-set]");
    if (set) { applySetting(set.dataset.set, set.dataset.val); return; }
    const filt = e.target.closest("[data-filter]");
    if (filt) { state.aspectFilter = filt.dataset.filter; render(); return; }
    const load = e.target.closest("[data-load]");
    if (load) { const rec = state.saved.find((s) => s.id === load.dataset.load); if (rec) openRecord(rec, true); return; }
    const del = e.target.closest("[data-del]");
    if (del) { state.saved = state.saved.filter((s) => s.id !== del.dataset.del); store.set("saved", state.saved); render(); return; }
    const act = e.target.closest("[data-act]");
    if (act) {
      const a = act.dataset.act;
      if (a === "edit") { state.editing = state.record; state.chart = null; closeSheet(); render(); }
      if (a === "share") share();
      if (a === "tnow") { state.transitDate = null; state._nowPin = null; render(); }
      if (a === "tprev" || a === "tnext") {
        const base = transitDate();
        const dd = new Date(base.getFullYear(), base.getMonth(), base.getDate() + (a === "tnext" ? 1 : -1), 12, 0);
        const now = new Date();
        state.transitDate = dd.toDateString() === now.toDateString() ? null : dd.getTime();
        render();
      }
    }
  });

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (b && state.chart) setTab(b.dataset.tab);
  });
  $("#btn-new").addEventListener("click", () => {
    closeSheet();
    state.chart = null;
    state.editing = null;
    render();
    window.scrollTo({ top: 0 });
  });
  $("#btn-settings").addEventListener("click", openSettings);

  /* share links: #c=<base64 json> */
  function share() {
    const r = state.record;
    const payload = { n: r.name, t: [r.y, r.mo, r.d, r.h, r.mi], k: r.timeKnown ? 1 : 0, p: [r.place.name, r.place.lat, r.place.lon, r.place.tz], o: r.offsetOverride };
    const enc = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const url = location.origin + location.pathname + "#c=" + enc;
    const done = () => toast("Link copied");
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt("Copy this link", url));
    else prompt("Copy this link", url);
  }
  function fromHash() {
    const m = location.hash.match(/#c=([^&]+)/);
    if (!m) return null;
    try {
      const p = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      const rec = { id: "s" + Date.now().toString(36), name: p.n || "", y: p.t[0], mo: p.t[1], d: p.t[2], h: p.t[3], mi: p.t[4], timeKnown: !!p.k, place: { name: p.p[0], region: "", lat: +p.p[1], lon: +p.p[2], tz: p.p[3] } };
      if (typeof p.o === "number") rec.offsetOverride = p.o;
      return rec;
    } catch (e) {
      return null;
    }
  }

  /* offline support when installed as an app (not inside embedded previews) */
  if ("serviceWorker" in navigator && !window.NATAL_EMBED && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  /* boot */
  const shared = fromHash();
  if (shared) {
    openRecord(shared, true);
    history.replaceState(null, "", location.pathname);
  } else {
    const lastId = store.get("last", null);
    const last = state.saved.find((s) => s.id === lastId);
    if (last) openRecord(last, false);
    else render();
  }
})();
