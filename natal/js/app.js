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

  const DEFAULT_SETTINGS = { v: 3, houseSystem: "placidus", nodeType: "mean", zodiac: "tropical", minorAspects: false, orbScale: 1, asteroids: true };
  const storedSettings = store.get("settings", {});
  // v2 made the mean node the default (matching Astro-Seek); drop the old default from earlier saves
  if (!storedSettings.v) delete storedSettings.nodeType;
  // v3 matched Astro-Seek's aspect defaults: major aspects only, Astro-Seek orbs
  if (!storedSettings.v || storedSettings.v < 3) { delete storedSettings.minorAspects; delete storedSettings.orbScale; }
  /** Round to the nearest arc-minute, as Astro-Seek does with a city's coordinates before casting a chart. */
  const toMinute = (v) => +(Math.round(v * 60) / 60).toFixed(4);
  // saved charts pick up corrected city coordinates (e.g. Whangārei now matches Astro-Seek's);
  // places picked from search are rounded to the minute, typed-in coordinates are left as they are
  function refreshPlace(rec) {
    if (!rec || !rec.place) return rec;
    const ct = (window.ASTRO_CITIES || []).find((c) => c[0] === rec.place.name && Math.abs(c[2] - rec.place.lat) < 0.03 && Math.abs(c[3] - rec.place.lon) < 0.03);
    if (ct) { if (ct[2] !== rec.place.lat || ct[3] !== rec.place.lon) rec.place = Object.assign({}, rec.place, { lat: ct[2], lon: ct[3] }); }
    else if (rec.place.region) rec.place = Object.assign({}, rec.place, { lat: toMinute(rec.place.lat), lon: toMinute(rec.place.lon) });
    return rec;
  }
  const state = {
    settings: Object.assign({}, DEFAULT_SETTINGS, storedSettings, { v: 3 }),
    saved: store.get("saved", []).map(refreshPlace),
    record: null,
    chart: null,
    tab: "chart",
    aspectFilter: "all",
    transitRange: store.get("trange", "day"),
    partnerId: store.get("partner", null),
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
  // "your drive, courage and desire" takes "are"; "your need for freedom and change" or "how you…" takes "is"
  const isPlural = (phrase) => !/^(your )?(capacity|need|sense)\b|^(how|what) /.test(phrase) && / and |, /.test(phrase);
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
        return `Your comfort zone and past-life mastery lie in ${S.name} territory: ${S.gifts}. These come naturally, but leaning on them too hard (${S.shadow}) keeps you circling the familiar. Offer them in service of your North Node in ${opp.name}.`;
      }
      case "lilith":
        return `The exiled, untamed part of you expresses ${S.how}. At some point, the ${S.name} themes of ${S.keywords[0]} and ${S.keywords[1]} may have been shamed or suppressed. Reclaiming them as raw, sovereign power, without apology, is the work. Denied, Lilith can surface as ${S.shadow}.`;
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

  function houseText(p, withDesc) {
    if (!p.house || p.key === "asc" || p.key === "mc") return "";
    const H = HOUSES[p.house];
    const P = PLANETS[p.key];
    const d = D(), h = p.house;
    const rich = (deepPlanetHouse(p.key, h) || {}).text
      || ((d.asteroids || {})[p.key] && d.asteroids[p.key].houses && d.asteroids[p.key].houses[h])
      || (p.key === "fortune" && d.fortune && d.fortune.houses && d.fortune.houses[h])
      || (p.key === "vertex" && d.vertex && d.vertex.houses && d.vertex.houses[h])
      || (p.key === "northNode" && (deepNodeHouse(h) || {}).story)
      || (p.key === "southNode" && (deepNodeHouse(((h + 5) % 12) + 1) || {}).story);
    if (rich) return firstPara(rich);
    return `Your ${P.name} sits in your ${ord(h)} house, so ${P.focus} ${isPlural(P.focus) ? "flow" : "flows"} into ${H.areas}.${withDesc === false ? "" : " " + H.desc}`;
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
  const ASPECT_ORDER = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode", "lilith", "asc", "mc", "fortune", "vertex"];
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
    return (d.aspectsRich && d.aspectsRich[k]) || null;
  }
  /* The reading for an aspect of a given type. The Descendant and IC sit opposite the Ascendant
     and Midheaven, so an aspect to one is the matching aspect to the other: a planet on your
     Descendant is opposite your Ascendant, a trine to the IC is a sextile to the MC. */
  const AXIS_SWAP = { dsc: "asc", ic: "mc" };
  const AXIS_TYPE = { conjunction: "opposition", opposition: "conjunction", trine: "sextile", sextile: "trine" };
  function aspectReading(a, b, type) {
    let t = type;
    for (const k of [a, b]) if (AXIS_SWAP[k]) t = AXIS_TYPE[t] || t;
    const d = deepAspect(AXIS_SWAP[a] || a, AXIS_SWAP[b] || b);
    if (!d || (AXIS_SWAP[a] && AXIS_SWAP[b])) return null;
    return { theme: d.theme, body: t === "conjunction" ? d.fusion : FLOW_TYPES.has(t) ? d.flow : d.tension };
  }
  const deepAsteroid = (k) => (D().asteroids && D().asteroids[k]) || null;
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
    tabs.classList.toggle("disabled", !state.chart || !!state.partnerMode);
    if (!state.chart || state.partnerMode) view.style.removeProperty("--theme");
    if (!state.chart || state.partnerMode) {
      for (const b of tabs.querySelectorAll("button")) b.setAttribute("aria-selected", "false");
      view.innerHTML = renderForm();
      bindForm();
    } else {
      const fn = { chart: renderChart, today: renderToday, progressed: renderProgressed, "return": renderReturn, synastry: renderSynastry, planets: renderPlanets, houses: renderHouses, aspects: renderAspects, karmic: renderKarmic }[state.tab];
      if (TAB_THEME[state.tab]) view.style.setProperty("--theme", TAB_THEME[state.tab]);
      else view.style.removeProperty("--theme");
      view.innerHTML = fn();
      dedupe(view);
      layoutForDesktop();
      bindView();
    }
    view.style.animation = "none";
    void view.offsetWidth;
    view.style.animation = "";
  }

  /* Desktop: a sidebar for navigation, and on wheel screens the wheel stays pinned on the
     left while the readings scroll on the right. */
  const desktopMQ = window.matchMedia ? window.matchMedia("(min-width: 1100px)") : { matches: false };
  function layoutForDesktop() {
    const who = $("#side-who");
    if (who) {
      const r = state.record;
      who.innerHTML = state.chart && r ? `${esc(r.name || "Your chart")}<span>${esc(fmtDate(r))} · ${esc(r.place.name)}</span>` : "";
    }
    view.classList.remove("split");
    if (!desktopMQ.matches || !state.chart || state.partnerMode) return;
    const wheel = view.querySelector(":scope > .wheel-wrap");
    if (!wheel) return;
    const stage = document.createElement("aside");
    stage.className = "stage";
    const flow = document.createElement("div");
    flow.className = "flow";
    for (const el of [...view.children]) {
      if (el === wheel || el.classList.contains("wheel-hint") || el.classList.contains("wheel-key")) stage.appendChild(el);
      else flow.appendChild(el);
    }
    view.append(stage, flow);
    view.classList.add("split");
  }
  if (desktopMQ.addEventListener) desktopMQ.addEventListener("change", () => { if (state.chart) render(); });

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
      ${!c.timeKnown ? `<p class="note">Birth time unknown: the chart is cast for local noon. Houses, Ascendant and Midheaven are hidden and the Moon may be up to ±7° off.</p>` : ""}
      ${c.timeKnown && c.houseSystemUsed !== state.settings.houseSystem ? `<p class="note">${esc(K.HOUSE_SYSTEMS[state.settings.houseSystem])} houses are undefined at this latitude: Porphyry is used instead.</p>` : ""}
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
    html += stat("Dominant planet", `${sym(pGlyph(d.domPlanet))} ${pName(d.domPlanet)}`, `in ${SIGNS[c.get(d.domPlanet).sign].name} · breakdown`, "dominants");
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
      if (!PLANETS[p.key] || ["asc", "mc", "fortune", "vertex", "southNode"].includes(p.key) || E.ASTEROIDS.includes(p.key)) continue;
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
    </section>
    <div class="chips" style="margin-top:0"><button class="chip" data-open="dominants">Dominants breakdown</button></div>`;
    html += `<div class="section-label">Luminaries & personal planets</div><div class="list">`;
    for (const k of ["sun", "moon", "mercury", "venus", "mars"]) html += pointRow(c.get(k));
    html += `</div><div class="section-label">Social & outer planets</div><div class="list">`;
    for (const k of ["jupiter", "saturn", "uranus", "neptune", "pluto"]) html += pointRow(c.get(k));
    html += `</div><div class="section-label">Points & bodies</div><div class="list">`;
    for (const k of ["northNode", "southNode", "chiron", "lilith", "fortune", "vertex"]) if (c.get(k)) html += pointRow(c.get(k));
    html += `</div>`;
    if (c.get("ceres")) {
      html += `<div class="section-label">Asteroids</div><div class="list">`;
      for (const k of E.ASTEROIDS) if (c.get(k)) html += pointRow(c.get(k), { endSub: esc(PLANETS[k].keywords[0]) });
      html += `</div>`;
    }
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
      const pars = (c.parallels || []).filter((x) => x.a === k || x.b === k).length;
      html += `<button class="row" data-open="decl:${k}"><span class="dot" style="color:${PLANETS[k].color}"></span><span class="glyph" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>
        <span class="main"><div class="title">${pName(k)}</div><div class="sub"${p.oob ? ' style="color:#f6a58c"' : ""}>${p.oob ? "Out of bounds" : dec > c.eps - 1.5 ? "Near the edge" : dec < 5 ? "Near the equator" : "In bounds"}${pars ? ` · ${pars} parallel${pars === 1 ? "" : "s"}` : ""}</div></span>
        <span class="end"><div class="pos">${Math.floor(dec)}°${pad(Math.floor((dec % 1) * 60))}′ ${p.dec >= 0 ? "N" : "S"}</div></span></button>`;
    }
    html += `</div><p class="note">Declination is how far north or south of the celestial equator a planet sits. Out-of-bounds planets travel beyond the Sun's maximum (${c.eps.toFixed(2)}°). Tap a planet for more.</p>`;
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
        <div class="chips"><button class="chip" data-act="edit">Add birth time</button></div></section>
        <div class="prose"><p>The twelve houses divide the sky around your birthplace into areas of life: self, money, communication, home, creativity, work, partnership, intimacy, belief, career, community and the unseen. Which sign sits on each house, and which planets fall inside it, depends on the Earth's rotation, so it changes every few minutes. Without a birth time the planets' signs and aspects are still accurate, but the houses, the Ascendant and the Midheaven cannot be placed.</p>
        <p>Even an approximate time helps: a birth certificate, a hospital record or a parent's memory of "morning" or "just after lunch" narrows it down, and you can compare how the Ascendant reads to decide.</p></div>`;
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
    </section>`;
    // the four angles
    const angle = (label, lon, open) => { const a = E.splitLon(lon); return stat(label, `${signGlyph(a.sign)} ${SIGNS[a.sign].name}`, `${a.deg}°${pad(a.min)}′`, open); };
    html += `<div class="split">${angle("Ascendant · self", c.asc, "point:asc")}${angle("IC · roots", E.norm(c.mc + 180), "house:4")}${angle("Descendant · others", E.norm(c.asc + 180), "house:7")}${angle("Midheaven · calling", c.mc, "point:mc")}</div>`;
    // where the planets gather
    const d = c.derived, q = d.quadrants;
    const QN = { 1: "Self · houses 1–3", 2: "Expression · houses 4–6", 3: "Others · houses 7–9", 4: "World · houses 10–12" };
    const qmax = Math.max(1, ...[1, 2, 3, 4].map((i) => q[i].length));
    html += `<div class="section-label">Where your planets gather</div><div class="bars">` +
      [1, 2, 3, 4].map((i) => barRow(QN[i].split(" · ")[0], "var(--text-2)", (q[i].length / qmax) * 100, "hemi", String(q[i].length))).join("") +
      `</div><p class="note">${d.above} planets above the horizon, ${d.below} below; ${d.east} in the east, ${d.west} in the west. Tap for what that means.</p>`;
    html += `<div class="section-label">The twelve houses</div><div class="list">`;
    for (let h = 1; h <= 12; h++) {
      const cusp = E.splitLon(c.houses[h]);
      const inside = c.points.filter((p) => p.house === h && PLANETS[p.key] && !["asc", "mc", "fortune", "vertex"].includes(p.key));
      const ruler = rulerOf(cusp.sign), rp = c.get(ruler);
      const sub = [`${SIGNS[cusp.sign].name} · ${pShort(ruler)} ${rp.house === h ? "here" : "in " + ord(rp.house)}`];
      if (inter[h]) sub.push(`Intercepted ${inter[h].map((s) => SIGNS[s].name).join(", ")}`);
      html += `<button class="row" data-open="house:${h}">
        <span class="num">${pad(h)}</span>
        <span class="main"><div class="title ${inside.length ? "" : "dim"}">${esc(HOUSES[h].title)}</div><div class="sub">${esc(sub.join(" · "))}</div></span>
        <span class="end"><div class="pos">${cusp.deg}°${pad(cusp.min)}′${signGlyph(cusp.sign)}</div>
        <div class="pos-sub">${inside.length ? inside.map((p) => `<span class="sym" style="color:${PLANETS[p.key].color};font-size:14px">${pGlyph(p.key)}</span>`).join(" ") : "Empty"}</div></span>
      </button>`;
    }
    html += `</div><p class="note">Change the house system from the settings icon. Empty houses are not inactive: they are read through the sign on the cusp and the placement of its ruler.</p>`;
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
    const keys = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron", "lilith", "ceres", "pallas", "juno", "vesta"].filter((k) => c.get(k));
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
    if (c.parallels && c.parallels.length) {
      html += `<div class="section-label">Declination aspects · ${c.parallels.length}</div><div class="list">`;
      c.parallels.forEach((a, i) => {
        const X = ASPECTS[a.type];
        html += `<button class="row" data-open="parallel:${i}">
          <span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title">${esc(pShort(a.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(a.b))}</div>
          <div class="sub">${esc(X.name)}</div></span>
          <span class="end"><div class="pos">${orbStr(a.orb)}</div></span></button>`;
      });
      html += `</div><p class="note">Parallels and contra-parallels compare how far north or south of the celestial equator each planet sits (declination), within a 1° orb.</p>`;
    }
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
    if (ax) html += `<div class="card"><div class="card-k">Staying on path</div><div class="prose"><p><strong>The trap.</strong> ${esc(ax.trap)}</p><p><strong>The medicine.</strong> ${esc(ax.medicine)}</p></div>${steps("Three steps", (deepSign(nn.sign) || {}).northNodeSteps)}</div>`;
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
      const nth = events.filter((e) => e.key === ev.key && e.date <= ev.date).length;
      return `<button class="row ${cls}" data-open="cycle:${ev.key}:${ev.date.getTime()}:${nth}"><span class="dot ${past ? "hollow" : ""}" style="color:${P.color}"></span>
        <span class="main"><div class="title">${esc(ev.label)}</div><div class="sub">Age ${age.toFixed(1)}${cls === "next" ? " · next" : ""}</div></span>
        <span class="end"><div class="pos">${fmtMonthYear(ev.date).toUpperCase()}</div></span></button>`;
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* SHEET                                                              */
  /* ------------------------------------------------------------------ */
  const sheet = $("#sheet"), sheetBody = $("#sheet-body"), backdrop = $("#sheet-backdrop");
  const TAB_THEME = { today: "#afc8ee", progressed: "#9fd8c6", "return": "#f3c86b", synastry: "#eea8c4", karmic: "#b99cf2" };
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
        case "parallel": return ASPECTS[c.parallels[+arg].type].color;
        case "transit": return PLANETS[computeTransits().list[+arg].t].color;
        case "tevent": return PLANETS[state._period.events[+arg].t].color;
        case "tpevent": return PLANETS[state._period.events[+arg].key].color;
        case "prog": case "srp": case "decl": case "cycle": return PLANETS[arg].color;
        case "paspect": return ASPECTS[computeProg().list[+arg].type].color;
        case "syn": return ASPECTS[computeSyn().list[+arg].type].color;
        case "synscore": return CAT_META[arg].color;
        case "ovl": return PLANETS[spec.split(":")[2]].color;
        case "pmoon": case "pphase": return PLANETS.moon.color;
        case "psun": return PLANETS.sun.color;
        case "dominants": return PLANETS[dominants().planetPct[0].key].color;
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
  /** Removes any sentence already shown higher up the same page, and headings left with nothing under them. */
  function dedupe(root) {
    const seen = new Set();
    for (const p of [...root.querySelectorAll("p")]) {
      if (p.children.length || p.classList.contains("minihead")) continue;
      const parts = p.textContent.match(/[^.!?]+(?:[.!?]+["”’)]*|$)\s*/g) || [];
      const kept = parts.filter((t) => {
        const k = t.trim().toLowerCase();
        if (k.length < 30) return true;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (kept.length !== parts.length) {
        const text = kept.join("").trim();
        if (text) p.textContent = text;
        else p.remove();
      }
    }
    for (const prose of [...root.querySelectorAll(".prose")]) if (!prose.textContent.trim()) prose.remove();
    for (const h of [...root.querySelectorAll("h4")]) {
      const next = h.nextElementSibling;
      if (!next || next.tagName === "H4") h.remove();
    }
  }
  function setPage(html, theme) {
    if (theme) sheet.style.setProperty("--theme", theme);
    else sheet.style.removeProperty("--theme");
    sheetBody.innerHTML = html;
    dedupe(sheetBody);
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
      backdrop.hidden = false; // only shown on desktop, where the page stays visible beside the panel
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
  backdrop.addEventListener("click", closeSheet);
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
    } else if ((key === "fortune" || key === "vertex") && D()[key]) {
      html += sec(`In ${S.name}`, D()[key].signs[p.sign], elColor(p.sign));
    } else if (deepAsteroid(key)) {
      const da = deepAsteroid(key);
      html += sec("Meaning", da.overview);
      html += sec(`In ${S.name}`, da.signs[p.sign], elColor(p.sign));
      html += chips("Gifts", da.gifts, "green") + chips("Challenges", da.challenges, "");
    } else if (dp) {
      html += sec(`In ${S.name}`, [dp.text, ...extra], elColor(p.sign));
      if (dp.love) html += sec("In love", dp.love);
      if (dp.work) html += sec("At work", dp.work);
      if (dp.shadow) html += sec("Shadow", dp.shadow);
      html += chips("Strengths", dp.strengths, "green") + chips("Challenges", dp.challenges, "");
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
      } else if ((key === "fortune" || key === "vertex") && D()[key]) {
        html += sec(`In the ${ord(p.house)} house · ${HOUSES[p.house].title}`, D()[key].houses[p.house]);
      } else if (deepAsteroid(key)) {
        html += sec(`In the ${ord(p.house)} house · ${HOUSES[p.house].title}`, deepAsteroid(key).houses[p.house]);
      } else if (dh) {
        html += sec(`In the ${ord(p.house)} house · ${HOUSES[p.house].title}`, dh.text);
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
      html += sec("Your placements", `You have no planets in ${S.name}, but its themes still run through your life: through the house${c.timeKnown ? "s it rules in your chart" : ""} and through its ruler, your ${pName(S.ruler)} in ${SIGNS[c.get(S.ruler).sign].name}.`);
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
    const cf = CUSP_FIELD[h] && deepSign(cusp.sign);
    const hc = ((D().houseCusps || {})[h] || {})[cusp.sign];
    html += sec(`${S.name} on the cusp`, hc ? [hc] : [`You approach ${H.areas} ${S.how}.`, cf ? cf[CUSP_FIELD[h][0]] : ""], elColor(cusp.sign));
    html += sec(`Its ruler, ${pName(ruler)}`, [
      rp.house === h
        ? `Your ${pName(ruler)}, the ruler of this house, sits inside it, so ${H.areas} are a concentrated, self-contained theme in your life.`
        : `Your ${pName(ruler)}, the ruler of this house, sits in your ${ord(rp.house)} house in ${SIGNS[rp.sign].name}, so what happens in ${H.areas} is tied to ${HOUSES[rp.house].areas}.`,
      dh && dh.ruler,
    ], PLANETS[ruler].color);
    if (inter) html += sec("Intercepted signs", `${inter.map((s) => SIGNS[s].name).join(" and ")} ${inter.length > 1 ? "are" : "is"} intercepted here, held inside the house without touching a cusp. These qualities can feel hidden or slow to develop until later in life.`);
    if (inside.length) {
      html += `<h4>Planets in this house</h4>`;
      for (const p of inside) {
        const d = deepPlanetHouse(p.key, h);
        html += `<p class="minihead"><span class="sym" style="color:${PLANETS[p.key].color}">${pGlyph(p.key)}</span> ${esc(pName(p.key))} in ${esc(SIGNS[p.sign].name)}</p>` + paras([d ? d.text : houseText(p, false)]);
      }
      html += `<div class="list">${inside.map((p) => pointRow(p)).join("")}</div>`;
    } else if (dh) {
      html += sec("An empty house", dh.empty);
    }
    if (dh) html += sec("When it flows", dh.gifts) + sec("When it struggles", dh.challenges) + sec("Soul level", dh.karmic);
    return html;
  }

  const FLOW_TYPES = new Set(["trine", "sextile", "semisextile", "quintile", "biquintile"]);
  const listJoin = (a) => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  /** Where an aspect lands in your life: the two houses, how the link behaves, how strongly you feel it. */
  function aspectInChart(a, pa, pb) {
    const nameA = pName(a.a), nameB = pName(a.b);
    const kind = a.type === "conjunction" ? "fusion" : FLOW_TYPES.has(a.type) ? "flow" : "tension";
    const out = [];
    if (pa.house && pb.house) {
      const place = pa.house === pb.house
        ? `Your ${nameA} and your ${nameB} both sit in your ${ord(pa.house)} house, so this whole story plays out through ${HOUSES[pa.house].areas}.`
        : `Your ${nameA} sits in your ${ord(pa.house)} house, the part of your life about ${HOUSES[pa.house].areas}, and your ${nameB} in your ${ord(pb.house)}, about ${HOUSES[pb.house].areas}.`;
      const link = pa.house === pb.house ? ""
        : kind === "fusion" ? " Because the two are joined, what happens in one of these areas spills straight into the other."
        : kind === "flow" ? " Because they support each other, progress in one of these areas tends to open doors in the other."
        : " Because they pull against each other, a gain in one of these areas can feel like a cost in the other, and learning to serve both is part of your story.";
      out.push(place + link);
    } else {
      out.push(`Your ${nameA} in ${SIGNS[pa.sign].name} meets your ${nameB} in ${SIGNS[pb.sign].name}.`);
    }
    const strength = a.orb < 1 ? "At under 1°, this is one of the defining links in your chart, and you feel it almost constantly."
      : a.orb < 3 ? "It is a close aspect, so you feel it often." : "It is a wider aspect, so it shows up in particular moments more than every day.";
    const motion = a.applying ? "It is applying, so it feels like something you are still growing into." : "It is separating, so by now it feels like second nature to you.";
    return [`${out[0]} ${strength} ${motion}`];
  }
  function sheetAspect(i) {
    const c = state.chart;
    const a = c.aspects[i];
    const X = ASPECTS[a.type];
    const pa = c.get(a.a), pb = c.get(a.b);
    const R = aspectReading(a.a, a.b, a.type);
    let html = `<section class="hero"><div class="eyebrow">${esc(X.name)} · ${a.angle}°</div>
      <h2 class="display">${esc(pShort(a.a))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(a.b))}</h2>
      <div class="subline">orb ${orbStr(a.orb)} · ${a.applying ? "applying" : "separating"}</div></section>`;
    html += facts([
      [pName(a.a), `${degStr(pa)} ${signGlyph(pa.sign)}${pa.house ? ` · H${pa.house}` : ""}`],
      [pName(a.b), `${degStr(pb)} ${signGlyph(pb.sign)}${pb.house ? ` · H${pb.house}` : ""}`],
      ["Nature", { harmony: "Harmonious", tension: "Challenging", fusion: "Blending", adjust: "Adjusting", creative: "Creative" }[a.nature]],
      ["Strength", `${Math.round(a.strength * 100)}%`],
    ]);
    if (R) {
      html += paras([R.theme]);
      html += sec(`As a ${X.name.toLowerCase()}`, [R.body, a.major ? "" : "This is a minor aspect, so you feel it in particular moments rather than as a constant theme."]);
    } else {
      const da = deepAsteroid(a.a) || deepAsteroid(a.b);
      html += paras([aspectText(a), da && da.aspects ? da.aspects[a.nature] : ""]);
    }
    html += sec("In your chart", aspectInChart(a, pa, pb));
    html += sec("The points involved", [PLANETS[a.a].desc, PLANETS[a.b].desc]);
    return html;
  }

  // how each planet tends to behave when it is out of bounds
  const OOB_TEXT = {
    moon: "An out-of-bounds Moon gives feelings that run wide and deep. Your emotional responses can be unusual, intense or hard for others to predict, and you may have learned early to look after yourself in your own way. It often brings strong intuition and a need for emotional freedom.",
    mercury: "An out-of-bounds Mercury thinks outside the lines. Your mind is original, restless and often ahead of or apart from the people around you, and you may learn or communicate in ways that do not fit standard methods. It is common in inventors, writers and people who see what others miss.",
    venus: "An out-of-bounds Venus loves and values on its own terms. Your taste, style and way of relating can be unconventional or ahead of its time, and you may feel that ordinary rules about relationships do not quite fit you. It can bring striking artistic gifts.",
    mars: "An out-of-bounds Mars acts without a template. Your drive can come in intense bursts, you may take risks others would not, and you tend to fight for things in your own way. Channelled well, it is courage that breaks new ground.",
    jupiter: "An out-of-bounds Jupiter seeks meaning beyond the familiar. Your beliefs, generosity and appetite for growth can be larger than life or unorthodox, and luck often arrives through unusual routes.",
    saturn: "An out-of-bounds Saturn builds its own rules. Your sense of duty and structure may not follow tradition, and you can end up creating the framework you could not find. The lessons are unusual but lasting.",
    uranus: "An out-of-bounds Uranus is rare, and doubles the planet's independence. Change and originality come through in unexpected ways.",
    neptune: "An out-of-bounds Neptune is rare, and heightens imagination and sensitivity beyond the usual range.",
    pluto: "An out-of-bounds Pluto is uncommon and generational: it marks a period when collective power and transformation moved beyond familiar bounds, and it colours how intensely you feel those themes.",
  };
  // life cycles on the Karmic timeline
  const CYCLES = {
    saturn: {
      title: "Saturn return", every: "about every 29.5 years",
      text: "Saturn takes about 29 and a half years to travel around the zodiac, so it comes back to the exact place it held when you were born at roughly 29, 58 and 88. Each return is a reckoning with time and maturity. Structures that no longer fit tend to strain or fall away, and what you have built on honest foundations tends to hold. It rarely feels light, but it is one of the most constructive passages in a life: you find out what you are actually committed to.",
      nth: {
        1: "The first return, around 29 to 30, marks the real start of adulthood. Choices made to please others or to meet expectations get tested, and many people change career, commit or end a relationship, move, or take on serious responsibility for the first time. It sorts the commitments that are truly yours from the ones you took on to fit in.",
        2: "The second return, in the late fifties, reviews what the first one built. It often brings a change of role at work, a new relationship to your body and time, and a clear sense of what you want the next decades to be for. Authority and experience become assets to use deliberately.",
        3: "The third return, in the late eighties, is a harvest and a letting go. It asks what you want to pass on, and it often brings a quiet clarity about what mattered.",
      },
    },
    chiron: {
      title: "Chiron return", every: "about every 50 years",
      text: "Chiron takes about 50 years to return to its birth position, so the Chiron return arrives around 49 to 51. It reopens the tender place Chiron marks in your chart, not to wound you again, but so it can be understood from the far side of half a life. Many people find this is when an old hurt finally turns into wisdom they can offer others, through teaching, mentoring, healing work or simply the way they show up. It often coincides with a shift in purpose: less proving, more meaning.",
      nth: {},
    },
    northNode: {
      title: "Nodal return", every: "about every 18.6 years",
      text: "The lunar nodes circle the zodiac in about 18 and a half years, so the North Node returns to its birth position at roughly 18 to 19, 37, 56, 74 and 93. Each nodal return is a checkpoint on your soul's direction. Doors tend to open toward your North Node themes, and people or events arrive that feel strangely fated. It is a good time to recommit to the path that stretches you rather than the one that simply feels familiar.",
      nth: {
        1: "The first nodal return, at about 18 or 19, often coincides with leaving home or choosing a direction for the first time.",
        2: "The second, at about 37, frequently brings a mid-course correction: a sense that life should be more your own.",
        3: "The third, in the mid fifties, tends to clarify what you are here to contribute in the years ahead.",
      },
    },
    southNode: {
      title: "Nodal reversal", every: "about every 18.6 years, halfway between nodal returns",
      text: "Halfway between nodal returns, the transiting North Node sits on your natal South Node and the South Node on your North Node. This nodal reversal, at roughly 9, 28, 46, 65 and 83, pulls you back toward old, familiar patterns and past-life gifts. It can feel like a season of endings, clearing out or revisiting what you already know. Used well, it is a chance to release what no longer serves the direction you are growing toward, and to reclaim the gifts of the South Node in service of the North.",
      nth: {},
    },
  };
  function sheetCycle(key, ms, nth) {
    const c = state.chart, C = CYCLES[key], P = PLANETS[key];
    const d = new Date(ms), ageAt = (ms - c.input.utc.getTime()) / (365.2422 * 86400000);
    const past = ms < Date.now();
    const years = Math.abs(ms - Date.now()) / (365.2422 * 86400000);
    let html = `<section class="hero"><div class="eyebrow">Life cycle · ${esc(C.every)}</div><h2 class="display">${esc(C.title)}</h2>
      <div class="subline">${fmtMonthYear(d)} · age ${ageAt.toFixed(1)}</div></section>`;
    const n = c.get(key);
    html += facts([
      ["When", `${fmtMonthYear(d)}`],
      ["Your age", ageAt.toFixed(1)],
      ["Status", past ? `${years < 1 ? "Within the last year" : `${Math.round(years)} year${Math.round(years) === 1 ? "" : "s"} ago`}` : `${years < 1 ? "Within the next year" : `In about ${Math.round(years)} year${Math.round(years) === 1 ? "" : "s"}`}`],
      n ? [key === "southNode" ? "Your South Node" : `Your natal ${P.name}`, `${degStr(n)} ${signGlyph(n.sign)} ${SIGNS[n.sign].name}${n.house ? ` · ${ord(n.house)} house` : ""}`] : null,
    ]);
    html += paras([C.text, C.nth[nth]]);
    if (n && n.house) {
      html += sec("In your chart", key === "southNode"
        ? `The North Node passes over your South Node in the ${ord(n.house)} house (${HOUSES[n.house].areas}), so that is where old patterns resurface and ask to be released.`
        : `The return happens in your ${ord(n.house)} house, where your natal ${P.name} sits, so ${HOUSES[n.house].areas} are where this cycle is most visible.`);
    }
    return html + natalSnippet(key === "southNode" ? "southNode" : key);
  }

  function sheetDecl(key) {
    const c = state.chart, p = c.get(key), P = PLANETS[key];
    const dec = Math.abs(p.dec), dir = p.dec >= 0 ? "north" : "south";
    const dms = (v) => `${Math.floor(v)}°${pad(Math.floor((v % 1) * 60))}′`;
    let html = `<section class="hero"><div class="eyebrow">Declination</div><h2 class="display">${esc(P.name)}</h2>
      <div class="subline"><span class="sym" style="color:${P.color}">${P.glyph}</span> ${dms(dec)} ${dir === "north" ? "N" : "S"}${p.oob ? ' · <span style="color:#f6a58c">out of bounds</span>' : ""}</div></section>`;
    html += facts([
      ["Declination", `${dms(dec)} ${dir}`],
      ["The Sun's limit", `${c.eps.toFixed(2)}°`],
      ["Status", p.oob ? `Out of bounds by ${dms(dec - c.eps)}` : `In bounds, ${dms(c.eps - dec)} inside the limit`],
      ["Longitude", `${degStr(p)} ${signGlyph(p.sign)} ${SIGNS[p.sign].name}`],
    ]);
    html += sec("What declination is", `Signs and degrees measure a planet's position along the zodiac. Declination measures something different: how far north or south of the celestial equator the planet sits. The Sun never goes beyond about ${c.eps.toFixed(1)}° either way, which sets the natural boundary for the rest of the chart. Declination adds a second layer to your chart: planets at the same declination are linked even when they do not aspect each other by sign.`);
    if (p.oob) html += sec("Out of bounds", ((D().oobRich || {})[key]) ? [D().oobRich[key]] : [OOB_TEXT[key], `An out-of-bounds planet works outside the Sun's reach, so it is less governed by the rest of the chart. ${P.name}'s themes (${P.keywords.join(", ")}) tend to be expressed in an original, extreme or independent way, for better and for worse.`], "#f6a58c");
    else if (dec > c.eps - 1.5) html += sec("Near the edge", `Your ${P.name} sits close to the Sun's limit without crossing it. Your ${listJoin(P.keywords)} come through with extra force and emphasis, and people notice them in you, yet they still take their cue from the rest of your chart rather than running off on their own.`);
    else if (dec < 5) html += sec("Near the equator", `Your ${P.name} sits close to the celestial equator, the calm middle of the sky. Your ${listJoin(P.keywords)} work in a steady, balanced way, blending easily with the rest of who you are rather than pulling you to extremes.`);
    else html += sec("In bounds", `Your ${P.name} sits comfortably within the Sun's range, so your ${listJoin(P.keywords)} are woven into the rest of your chart: they answer to your Sun and Moon and show up in step with the rest of you.`);
    const pars = (c.parallels || []).map((x, i) => [x, i]).filter(([x]) => x.a === key || x.b === key);
    if (pars.length) {
      html += `<h4>Parallels</h4><p class="note" style="text-align:left;margin:0 0 8px">When two of your planets share a declination (a parallel) they work together like a conjunction in you; when they mirror each other (a contra-parallel) they pull like an opposition.</p><div class="list">` + pars.map(([x, i]) => {
        const X = ASPECTS[x.type], o = x.a === key ? x.b : x.a;
        return `<button class="row" data-open="parallel:${i}"><span class="dot" style="color:${X.color}"></span><span class="main"><div class="title"><span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pName(o))}</div><div class="sub">${esc(X.name)}</div></span><span class="end"><div class="pos">${orbStr(x.orb)}</div></span></button>`;
      }).join("") + `</div>`;
    } else html += sec("Parallels", `Your ${P.name} does not share a declination (within 1°) with any other planet, so this layer adds no hidden links for it: it works through its sign, house and aspects.`);
    return html + natalSnippet(key);
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
      case "tpevent": html = sheetPeriodEvent(+arg); break;
      case "dominants": html = sheetDominants(); break;
      case "prog": html = sheetProg(arg); break;
      case "paspect": html = sheetProgAspect(+arg); break;
      case "pphase": {
        const P = computeProg(), PR = D().progressions || {};
        html = sheetSimple(`Progressed lunation · ${fmtDayYear(P.target)}`, esc(P.phase.name), `${Math.round(P.phaseAngle)}° between the progressed Sun and Moon`, [PR.phases && PR.phases[P.phase.name], "The progressed lunation cycle lasts about 29.5 years, and each of its eight phases about three and a half years. It describes the longer rhythm of your inner life: seeding, growing, culminating and letting go."]);
        break;
      }
      case "pintro": html = sheetSimple("Progressions", "How it works", "", [(D().progressions || {}).intro, `Your Sun has progressed ${computeProg().pc.solarArc.toFixed(2)}° since birth. That distance, the solar arc, is also how far your progressed Ascendant and Midheaven have moved.`]); break;
      case "pmoon": {
        const ev = progTimeline().moon[+arg], PR = D().progressions || {};
        html = ev.kind === "sign"
          ? sheetSimple(`Progressed Moon · ${fmtMonthYear(ev.time)}`, `Moon enters ${esc(SIGNS[ev.sign].name)}`, `Age ${Math.floor(age(ev.time))}`, [PR.moonSigns && PR.moonSigns[ev.sign]])
          : sheetSimple(`Progressed Moon · ${fmtMonthYear(ev.time)}`, `Moon enters your ${ord(ev.house)} house`, esc(HOUSES[ev.house].title), [PR.moonHouses && PR.moonHouses[ev.house]]);
        // what else is true of the progressed Moon at that moment: its house (for a sign change) or its sign (for a house change)
        const ml = E.lonAt("moon", progUtcFor(new Date(ev.time.getTime() + 86400000 * 3)), { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac });
        if (ev.kind === "sign" && c.timeKnown) { const h = houseOfLon(ml); html += sec(`At the same time: your ${ord(h)} house`, PR.moonHouses && PR.moonHouses[h]); }
        if (ev.kind === "house") { const sg = signOf(ml); html += sec(`At the same time: in ${SIGNS[sg].name}`, PR.moonSigns && PR.moonSigns[sg], elColor(sg)); }
        break;
      }
      case "psun": {
        html = sheetSimple("Progressed Sun", `Sun in ${esc(SIGNS[arg].name)}`, "A chapter of about 30 years", [((D().progressions || {}).sunSigns || {})[arg]]);
        const T = progTimeline(), idx = T.sun.findIndex((e) => e.sign === arg);
        const start = idx >= 0 ? T.sun[idx].time : c.input.utc, end = idx >= 0 ? T.sun[idx + 1] && T.sun[idx + 1].time : T.sun[0] && T.sun[0].time;
        html += sec("The chapter", `${idx >= 0 ? `It begins in ${fmtMonthYear(start)}, at age ${Math.floor(age(start))}` : "It runs from birth"}${end ? ` and lasts until ${fmtMonthYear(end)}, at age ${Math.floor(age(end))}` : ""}. Your sense of identity takes on ${SIGNS[arg].name} qualities (${SIGNS[arg].keywords.slice(0, 3).join(", ")}) without replacing your natal Sun.`);
        html += natalSnippet("sun", "Your natal Sun");
        break;
      }
      case "pstation": {
        const st = progTimeline().stations[+arg];
        html = sheetSimple(`By progression · ${fmtMonthYear(st.time)}`, `${esc(pName(st.key))} turns ${st.dir}`, `Age ${Math.floor(age(st.time))}`, [(D().progressions || {}).stations, st.dir === "direct" ? `From this point ${PLANETS[st.key].focus} can move outward more freely: what was reviewed inwardly for years starts to find direct expression.` : `From this point ${PLANETS[st.key].focus} turns inward for many years: a long period of reflection, reworking and doing things your own way.`, K.RETRO_KARMIC[st.key]]);
        html += natalSnippet(st.key);
        break;
      }
      case "srtheme": html = sheetSRTheme(arg); break;
      case "decl": html = sheetDecl(arg); break;
      case "cycle": html = sheetCycle(arg, +arg2, +spec.split(":")[3]); break;
      case "srp": html = sheetSRPlanet(arg); break;
      case "srintro": html = sheetSimple("Solar return", "The year ahead", "", [(D().solarReturn || {}).intro]); break;
      case "sraspect": {
        const a = state._srAspects[+arg], X = ASPECTS[a.type];
        const dA = deepAspect(a.a, a.b);
        html = sheetSimple(`Solar return ${computeSR().year} · ${X.name}`, `${esc(pShort(a.a))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(a.b))}`, `orb ${orbStr(a.orb)}`,
          [dA ? dA.theme : aspectText(a), dA ? (a.type === "conjunction" ? dA.fusion : FLOW_TYPES.has(a.type) ? dA.flow : dA.tension) : "", "In your return chart this is a theme that colours your year, not a lifelong trait."]);
        {
          const sr = computeSR().sr, pa = sr.get(a.a), pb = sr.get(a.b);
          const natal = c.aspects.find((x) => (x.a === a.a && x.b === a.b) || (x.a === a.b && x.b === a.a));
          html += sec("This year", [
            `${pName(a.a)} sits in the return chart's ${ord(pa.house)} house (${HOUSES[pa.house].areas}) and ${pName(a.b)} in the ${ord(pb.house)} (${HOUSES[pb.house].areas}), so the theme plays out between those parts of life.`,
            natal ? (natal.type === a.type ? `Your birth chart has the same ${X.name.toLowerCase()}, so this year echoes and strengthens a lifelong pattern.` : `At birth these two form a ${ASPECTS[natal.type].name.toLowerCase()}; this year the relationship between them shifts to a ${X.name.toLowerCase()}.`)
              : "These two do not aspect each other in your birth chart, so this is a theme particular to this year.",
          ]);
        }
        break;
      }
      case "syn": html = sheetSyn(+arg); break;
      case "ovl": html = sheetOverlay(arg, arg2); break;
      case "synscore": html = sheetSynScore(arg); break;
      case "tevent": {
        const ev = state._period.events[+arg];
        state.transitDate = ev.time.getTime();
        state._nowPin = null;
        const T = computeTransits();
        const idx = T.list.findIndex((x) => x.t === ev.t && x.n === ev.n && x.type === ev.type);
        html = idx >= 0 ? sheetTransit(idx) : sheetSimple("Transit", `${esc(pShort(ev.t))} ${ASPECTS[ev.type].glyph} ${esc(pShort(ev.n))}`, fmtDayYear(ev.time), [aspectText({ a: ev.t, b: ev.n, type: ev.type, nature: "tension" })]);
        break;
      }
      case "parallel": {
        const a = c.parallels[+arg], X = ASPECTS[a.type];
        const pa = c.get(a.a), pb = c.get(a.b);
        const dA = deepAspect(a.a, a.b);
        const dec = (p) => `${Math.abs(p.dec).toFixed(2)}° ${p.dec >= 0 ? "N" : "S"}`;
        html = `<section class="hero"><div class="eyebrow">${esc(X.name)} · declination</div>
          <h2 class="display">${esc(pShort(a.a))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(a.b))}</h2>
          <div class="subline">orb ${orbStr(a.orb)}</div></section>`;
        html += facts([[pName(a.a), dec(pa)], [pName(a.b), dec(pb)], ["Acts like", a.type === "parallel" ? "Conjunction" : "Opposition"], ["Strength", `${Math.round(a.strength * 100)}%`]]);
        html += paras([X.desc]);
        if (dA) html += sec(`${pName(a.a)} and ${pName(a.b)}`, [dA.theme, a.type === "parallel" ? dA.fusion : dA.tension]);
        break;
      }
      case "tplanet": html = sheetTransitPlanet(arg); break;
      case "element": {
        const X = K.ELEMENTS[arg], list = d.elements[arg], B = deepBalance(arg);
        const lead = list.length >= 4 ? (B ? B.strong : X.strong) : list.length <= 1 ? (B ? B.weak : X.weak) : `${B ? B.strong : X.strong} With ${list.length} placements here, it is a steady, moderate influence in you rather than the loudest voice in your chart.`;
        html = sheetSimple("Element", X.name, `${list.length} placement${list.length === 1 ? "" : "s"}`, [list.length ? `${list.map(pName).join(", ")}.` : "", lead]);
        // the other side of the element, without repeating the paragraph above
        if (B && list.length >= 2) html += sec("If it were missing", B.weak);
        if (B && list.length <= 1) html += sec("When it runs strong", B.strong);
        break;
      }
      case "mode": {
        const X = K.MODES[arg], list = d.modes[arg], B = deepBalance(arg);
        html = sheetSimple("Modality", X.name, `${list.length} placement${list.length === 1 ? "" : "s"}`, [list.map(pName).join(", ") + (list.length ? "." : ""), list.length <= 1 ? (B ? B.weak : X.weak) : (B ? B.strong : X.strong)]);
        if (B && list.length >= 2) html += sec("If it were missing", B.weak);
        if (B && list.length <= 1) html += sec("When it runs strong", B.strong);
        if (list.length) html += `<div class="list">${list.map((k) => c.get(k) ? pointRow(c.get(k)) : "").join("")}</div>`;
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
        if (ph) html += chips("Gifts", ph.gifts, "green") + chips("Challenges", ph.challenges, "");
        html += sec("How it's measured", `The phase is the angle the Moon has travelled ahead of the Sun: 0° is the New Moon, 180° the Full Moon. ${ang < 180 ? "A waxing Moon is building, and people born in this half of the cycle tend to be oriented toward creating and becoming." : "A waning Moon is releasing, and people born in this half of the cycle tend to be oriented toward meaning, sharing and completing."}`);
        break;
      }
      case "sect":
        html = sheetSimple("Sect", c.isDay ? "Day chart" : "Night chart", "", [c.isDay
          ? "You were born by day, with the Sun above the horizon. In traditional astrology that makes the Sun, Jupiter and Saturn your sect planets: Jupiter is your most reliable helper, Saturn is easier for you to work with, and Mars is the planet that tends to give you the most trouble."
          : "You were born by night, with the Sun below the horizon. In traditional astrology that makes the Moon, Venus and Mars your sect planets: Venus is your most reliable helper, Mars is better contained in you, and Saturn is the planet that tends to give you the most trouble.",
          `Your Part of Fortune is calculated with the ${c.isDay ? "day" : "night"} formula for this reason.`]);
        {
          const ben = c.isDay ? "jupiter" : "venus", mal = c.isDay ? "mars" : "saturn";
          const light = c.isDay ? "sun" : "moon";
          const line = (k) => { const q = c.get(k); return `${pName(k)} in ${SIGNS[q.sign].name}${q.house ? `, ${ord(q.house)} house` : ""}`; };
          html += sec("Your most helpful planet", `${line(ben)}. As the helpful planet of your sect, it delivers its gifts to you reliably. ${c.get(ben).house ? `Life most readily supports you through ${HOUSES[c.get(ben).house].areas}, where things tend to come right for you even when the rest is hard.` : ""}`);
          html += sec("The planet that needs care", `${line(mal)}. As the difficult planet out of your sect, it is the one most likely to show you its harder side. ${c.get(mal).house ? `Friction tends to gather for you around ${HOUSES[c.get(mal).house].areas}, and the strength you build there is hard-won and lasting.` : ""}`);
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
        const DP = (D().patterns || {})[pt.type];
        html = sheetSimple("Aspect pattern", info.name, pt.members.map((k) => `<span class="sym" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>`).join(" "), [
          DP ? DP.text : info.desc,
          `Involves ${pt.members.map((k) => `${pName(k)} in ${SIGNS[c.get(k).sign].name}${c.get(k).house ? ` (${ord(c.get(k).house)} house)` : ""}`).join(", ")}.`,
        ]);
        if (pt.type === "stellium" && pt.where) {
          const w = pt.where;
          html += sec(w.kind === "sign" ? `Concentrated in ${SIGNS[w.where].name}` : `Concentrated in your ${ord(w.where)} house`, [DP && DP.focal, w.kind === "sign" ? `${SIGNS[w.where].essence}` : `${HOUSES[w.where].desc}`], w.kind === "sign" ? elColor(w.where) : null);
        } else if (pt.apex) {
          html += sec(`The apex: ${pName(pt.apex)}`, [DP && DP.focal, PLANETS[pt.apex].desc], PLANETS[pt.apex].color);
        } else if (DP) html += sec("The planets involved", DP.focal);
        if (DP) html += chips("Gifts", DP.gifts, "green") + chips("Challenges", DP.challenges, "") + sec("Over a lifetime", DP.growth);
        html += `<div class="list">${pt.members.map((k) => pointRow(c.get(k))).join("")}</div>`;
        break;
      }
      case "nodecontact": {
        const P = PLANETS[arg];
        const txt = {
          north: `${P.name} conjunct the North Node: ${P.core} is bound up with your destiny. Developing this planet consciously is part of what you came here to do, and people or events tied to it often feel fated.`,
          south: `${P.name} conjunct the South Node: ${P.core} carries a strong past-life imprint. It is a gift you arrive with, but it can also be a habit that pulls you backward. Use it to serve your North Node.`,
          bend: `${P.name} square the nodes sits at the "bending" point of the nodal axis, traditionally a skipped step. Lessons around ${P.core} were left unfinished and must be integrated before the North Node path fully opens.`,
        }[arg2];
        html = sheetSimple("Nodal contact", P.name, "", [txt, P.desc]);
        html += natalSnippet(arg);
        const nn = c.get("northNode"), ax = deepAxis(nn.sign);
        if (ax) html += sec(`Your nodal axis: ${SIGNS[nn.sign].name} and ${SIGNS[opposite(nn.sign)].name}`, firstPara(ax.story), PLANETS.northNode.color);
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
  /** A placement read through one life area (js/deep-areas.js), e.g. Mars by house on the love page. */
  function areaReading(area, id, kind, val) {
    const a = area && (D().areas || {})[`${area}:${id}`];
    if (!a) return "";
    return (kind ? (a[kind] || {})[val] : a[val]) || "";
  }
  function placementBlock(key, opts) {
    opts = opts || {};
    const c = state.chart, p = c.get(key);
    if (!p) return "";
    const lensSign = opts.full ? "" : areaReading(opts.area, key, "sign", p.sign);
    const lensHouse = p.house ? areaReading(opts.area, key, "house", p.house) : "";
    const dp = lensSign ? { text: lensSign } : deepPlanetSign(key, p.sign);
    const dh = lensHouse ? { text: lensHouse } : p.house ? deepPlanetHouse(key, p.house) : null;
    const title = key === "asc" ? `${sName(p)} rising` : `${pName(key)} in ${sName(p)}${p.house && key !== "mc" ? ` · ${ord(p.house)} house` : ""}`;
    const body = [opts.full ? (dp ? dp.text : signText(p)) : firstPara(dp ? dp.text : signText(p))];
    if (opts.extra) body.push(opts.extra);
    if (opts.house !== false && dh) body.push(opts.full ? dh.text : firstPara(dh.text));
    return `<p class="minihead"><span class="sym" style="color:${PLANETS[key].color}">${pGlyph(key)}</span> ${esc(title)}</p>${paras(body)}`;
  }
  function houseBlock(h, field, label, area) {
    const c = state.chart;
    if (!c.timeKnown) return "";
    const cs = signOf(c.houses[h]);
    const ruler = rulerOf(cs), rp = c.get(ruler);
    const ds = deepSign(cs);
    const inside = planetsInHouse(h);
    const rulerLens = ((area && (D().areaRulers || {})[`${area}:house${h}`]) || {})[rp.house];
    let out = `<p class="minihead">${esc(label || `${ord(h)} house`)} · ${signGlyph(cs)} ${esc(SIGNS[cs].name)}</p>`;
    out += paras([
      ((area && (D().areaCusps || {})[`${area}:house${h}`]) || {})[cs] || (field && ds ? ds[field] : `You approach ${HOUSES[h].areas} ${SIGNS[cs].how}.`),
      rulerLens ? `The ruler of your ${ord(h)} house, ${pName(ruler)}, sits ${rp.house === h ? "in that same house" : `in your ${ord(rp.house)} house`}. ${rulerLens}`
        : rp.house === h ? `Its ruler ${pName(ruler)} sits inside the house, concentrating these themes.` : `Its ruler ${pName(ruler)} sits in your ${ord(rp.house)} house, tying this area to ${HOUSES[rp.house].areas}.`,
      inside.length ? `Planets here: ${inside.map((p) => `${pName(p.key)} in ${sName(p)}`).join(", ")}.` : (deepHouse(h) || {}).empty,
    ]);
    for (const p of inside) {
      const lens = areaReading(area, `house${h}`, null, p.key);
      const d = lens ? { text: lens } : deepPlanetHouse(p.key, h);
      if (d) out += paras([firstPara(d.text)]);
    }
    return out;
  }
  function aspectBetween(a, b, area) {
    const c = state.chart;
    const asp = c.aspects.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (!asp) return "";
    // read through the page when a life-area version exists
    const AA = D().areaAspects || {};
    const dA = (area && (AA[`${area}:${a}-${b}`] || AA[`${area}:${b}-${a}`])) || deepAspect(a, b);
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
        html += areaSection("Sun and Moon together", paras([blend]) + aspectBetween("sun", "moon", k));
        if (known) {
          const r = c.derived.chartRuler, rp = c.get(r);
          const dh = deepPlanetHouse(r, rp.house);
          html += areaSection("Chart ruler", paras([`${pName(r)} rules your Ascendant, making it the planet that steers your whole chart. It sits in ${sName(rp)} in your ${ord(rp.house)} house, so ${HOUSES[rp.house].areas} become a central stage for who you are becoming.`, dh ? firstPara(dh.text) : ""]));
        }
        break;
      }
      case "mind":
        html += areaSection("How you think", placementBlock("mercury", { full: true }));
        html += aspectBetween("mercury", "moon", k) + aspectBetween("mercury", "saturn", k) + aspectBetween("mercury", "jupiter", k) + aspectBetween("mercury", "uranus", k) + aspectBetween("mercury", "neptune", k);
        if (c.get("mercury").retro) html += areaSection("Retrograde Mercury", paras([K.RETRO_KARMIC.mercury]));
        html += areaSection("Everyday learning", houseBlock(3, null, "3rd house", "mind"));
        html += areaSection("Higher learning", houseBlock(9, null, "9th house", "mind"));
        break;
      case "love": {
        html += areaSection("How you love", placementBlock("venus", { full: true, area: "love" }));
        html += areaSection("Desire and pursuit", placementBlock("mars", { area: "love" }));
        html += aspectBetween("venus", "mars", k) + aspectBetween("moon", "venus", k) + aspectBetween("venus", "saturn", k) + aspectBetween("venus", "pluto", k);
        html += areaSection("Partnership", houseBlock(7, "partner", "Descendant · 7th house", "love"));
        html += areaSection("Romance and play", houseBlock(5, null, "5th house", "love"));
        html += areaSection("Intimacy", houseBlock(8, null, "8th house", "love"));
        break;
      }
      case "career":
        if (known) html += areaSection("Vocation", houseBlock(10, "career", "Midheaven · 10th house", "career"));
        html += areaSection("Discipline and mastery", placementBlock("saturn", { area: "career" }));
        html += areaSection("Purpose", placementBlock("sun", { area: "career" }));
        if (known) html += areaSection("Daily work", houseBlock(6, null, "6th house", "career"));
        html += aspectBetween("sun", "saturn", k) + aspectBetween("saturn", "mc", k) + aspectBetween("jupiter", "mc", k);
        break;
      case "money":
        if (known) html += areaSection("Earning and self-worth", houseBlock(2, "money", "2nd house", "money"));
        html += areaSection("What you value", placementBlock("venus", { area: "money" }));
        html += areaSection("Luck and expansion", placementBlock("jupiter", { area: "money" }));
        if (known) html += areaSection("Shared resources", houseBlock(8, null, "8th house", "money"));
        if (known && c.get("fortune")) {
          const f = c.get("fortune");
          html += areaSection("Part of Fortune", paras([`${sName(f)} · ${ord(f.house)} house. ${signText(f)} It points to ${HOUSES[f.house].areas} as a natural source of ease.`]));
        }
        break;
      case "home":
        if (known) html += areaSection("Roots", houseBlock(4, "home", "IC · 4th house", "home"));
        html += areaSection("Emotional needs", placementBlock("moon", { area: "home" }));
        html += aspectBetween("moon", "saturn", k) + aspectBetween("moon", "pluto", k) + aspectBetween("moon", "uranus", k);
        break;
      case "health":
        if (known) {
          const a = c.get("asc");
          html += areaSection("Body and vitality", paras([`With ${sName(a)} rising, the body areas traditionally linked to your chart are the ${SIGNS[a.sign].body.toLowerCase()}. ${firstPara((deepPlanetSign("asc", a.sign) || {}).text || SIGNS[a.sign].rising)}`]));
          html += areaSection("Routines and habits", houseBlock(6, null, "6th house", "health"));
        }
        html += areaSection("Energy and drive", placementBlock("mars", { area: "health" }));
        {
          const d = c.derived, B = deepBalance(d.domEl);
          if (B) html += areaSection(`Your ${d.domEl} emphasis`, paras([B.strong]));
        }
        html += `<p class="note" style="text-align:left">Astrology describes tendencies, not medical conditions. See a health professional for anything that concerns you.</p>`;
        break;
      case "growth":
        html += areaSection("Where life opens up", placementBlock("jupiter", { full: true }));
        html += aspectBetween("sun", "jupiter", k) + aspectBetween("jupiter", "saturn", k);
        html += areaSection("Belief and exploration", houseBlock(9, null, "9th house", "growth"));
        html += areaSection("Direction", paras([(deepAxis(c.get("northNode").sign) || {}).story || SIGNS[c.get("northNode").sign].nn]));
        break;
      case "spirit":
        html += areaSection("The hidden house", houseBlock(12, null, "12th house", "spirit"));
        html += areaSection("Ideals and imagination", placementBlock("neptune", { area: "spirit" }));
        html += areaSection("Moon phase at birth", paras([c.derived.phase.desc]));
        html += areaSection("The wounded healer", placementBlock("chiron", { area: "spirit" }));
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

  // what a transiting planet brings: the rich reading when there is one, the timescale from the reference set
  const tPlanet = (k) => { const base = (D().transitPlanets || {})[k]; const rich = (D().transitPlanetsRich || {})[k]; return base || rich ? Object.assign({}, base, rich) : null; };
  function transitText(tr, field) {
    const k = tr.t + "|" + tr.n;
    const d = (D().transitAspectsRich || {})[k] || (D().transitAspects || {})[k];
    if (d) return d[field];
    return [
      `Transiting ${pName(tr.t)} ${T_VERB[tr.type]} your natal ${pName(tr.n)}, touching ${PLANETS[tr.n].core}.`,
      field === "conj" ? "A conjunction concentrates the transit's energy directly on this part of you." :
        field === "soft" ? "A flowing aspect: doors open more easily here if you take the initiative." :
          "A challenging aspect: pressure builds until something shifts, and effort now pays off later.",
    ].filter(Boolean).join(" ");
  }

  /* ------------------------------------------------------------------ */
  /* TRANSITS: week and month views                                     */
  /* ------------------------------------------------------------------ */
  const RANGES = ["day", "week", "month"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const P_KEYS = ["sun", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "chiron", "northNode"];
  const PHASE_NAMES = [[0, "New Moon"], [90, "First Quarter"], [180, "Full Moon"], [270, "Last Quarter"]];

  function periodBounds(range, anchor) {
    const a = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
    if (range === "week") {
      const dow = (a.getDay() + 6) % 7; // Monday = 0
      const start = new Date(a.getFullYear(), a.getMonth(), a.getDate() - dow);
      return { start, end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7) };
    }
    const start = new Date(a.getFullYear(), a.getMonth(), 1);
    return { start, end: new Date(a.getFullYear(), a.getMonth() + 1, 1) };
  }

  /** Exact transit hits, sign changes, stations and lunar phases between start and end. */
  function computePeriod(range) {
    const c = state.chart;
    const { start, end } = periodBounds(range, transitDate());
    const key = range + start.getTime() + JSON.stringify(state.settings) + (state.record && state.record.id);
    if (state._period && state._period.key === key) return state._period;
    const opts = { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac };
    const lon = (k, ms) => E.lonAt(k, new Date(ms), opts);
    const HOUR = 3600000, STEP = 12 * HOUR;
    const t0 = start.getTime() - STEP, t1 = end.getTime() + STEP;
    const n = Math.ceil((t1 - t0) / STEP);
    const events = [];
    const inRange = (ms) => ms >= start.getTime() && ms < end.getTime();
    // refine a root of f between a and b (f(a) and f(b) have opposite signs)
    const bisect = (f, a, b) => {
      let fa = f(a);
      for (let i = 0; i < 26; i++) {
        const m = (a + b) / 2, fm = f(m);
        if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m;
      }
      return (a + b) / 2;
    };

    for (const k of P_KEYS) {
      const L = [];
      for (let i = 0; i <= n; i++) L.push(lon(k, t0 + i * STEP));
      // aspects to natal points
      for (const nk of N_KEYS) {
        const np = c.get(nk);
        if (!np) continue;
        for (const asp of T_ASPECTS) {
          const targets = asp.angle === 0 ? [np.lon] : asp.angle === 180 ? [E.norm(np.lon + 180)] : [E.norm(np.lon + asp.angle), E.norm(np.lon - asp.angle)];
          for (const tg of targets) {
            for (let i = 0; i < n; i++) {
              const g1 = E.diff(tg, L[i]), g2 = E.diff(tg, L[i + 1]);
              if (g1 === 0 || Math.sign(g1) === Math.sign(g2) || Math.abs(g1 - g2) > 90) continue;
              const te = bisect((ms) => E.diff(tg, lon(k, ms)), t0 + i * STEP, t0 + (i + 1) * STEP);
              if (!inRange(te)) continue;
              const retro = E.diff(lon(k, te - HOUR), lon(k, te + HOUR)) < 0;
              events.push({ kind: "aspect", t: k, n: nk, type: asp.key, time: new Date(te), retro, weight: T_RANK[k] });
            }
          }
        }
      }
      // sign changes
      for (let i = 0; i < n; i++) {
        const s1 = Math.floor(L[i] / 30), s2 = Math.floor(L[i + 1] / 30);
        if (s1 === s2) continue;
        const forward = E.diff(L[i], L[i + 1]) > 0;
        const boundary = forward ? s2 * 30 : s1 * 30;
        const te = bisect((ms) => E.diff(boundary, lon(k, ms)), t0 + i * STEP, t0 + (i + 1) * STEP);
        if (inRange(te)) events.push({ kind: "ingress", key: k, sign: SIGN_KEYS[forward ? s2 : s1 === 0 ? 11 : s1 - 1] , time: new Date(te), retro: !forward, weight: T_RANK[k] });
      }
      // stations (retrograde / direct)
      if (k !== "sun" && k !== "northNode") {
        for (let i = 1; i < n; i++) {
          const v1 = E.diff(L[i - 1], L[i]), v2 = E.diff(L[i], L[i + 1]);
          if (Math.sign(v1) === Math.sign(v2) || v1 === 0) continue;
          const speed = (ms) => E.diff(lon(k, ms - HOUR), lon(k, ms + HOUR));
          const te = bisect(speed, t0 + (i - 1) * STEP, t0 + (i + 1) * STEP);
          if (inRange(te)) events.push({ kind: "station", key: k, dir: v2 < 0 ? "retrograde" : "direct", time: new Date(te), weight: T_RANK[k] });
        }
      }
    }
    // lunar phases
    const ph = (ms) => E.norm(lon("moon", ms) - lon("sun", ms));
    const PSTEP = 6 * HOUR, pn = Math.ceil((t1 - t0) / PSTEP);
    let prev = ph(t0);
    for (let i = 1; i <= pn; i++) {
      const cur = ph(t0 + i * PSTEP);
      for (const [ang, name] of PHASE_NAMES) {
        const g1 = E.diff(ang, prev), g2 = E.diff(ang, cur);
        if (Math.sign(g1) !== Math.sign(g2) && Math.abs(g1 - g2) < 90) {
          const te = bisect((ms) => E.diff(ang, ph(ms)), t0 + (i - 1) * PSTEP, t0 + i * PSTEP);
          if (inRange(te)) events.push({ kind: "phase", name, angle: ang, key: "moon", time: new Date(te), sign: signOf(lon("moon", te)), weight: 2 });
        }
      }
      prev = cur;
    }
    events.sort((a, b) => a.time - b.time);
    state._period = { key, range, start, end, events };
    return state._period;
  }

  const fmtClock = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  function eventRow(ev, i) {
    if (ev.kind === "aspect") {
      const X = ASPECTS[ev.type];
      return `<button class="row" data-open="tevent:${i}">
        <span class="dot" style="color:${PLANETS[ev.t].color}"></span>
        <span class="main"><div class="title">${esc(pShort(ev.t))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(ev.n === "asc" || ev.n === "mc" ? pName(ev.n) : "natal " + pShort(ev.n))}</div>
        <div class="sub">${esc(X.name)}${ev.retro ? " · ℞" : ""}</div></span>
        <span class="end"><div class="pos">${esc(fmtShort(ev.time).toUpperCase())}</div><div class="pos-sub">${fmtClock(ev.time)}</div></span></button>`;
    }
    const P = PLANETS[ev.key];
    const title = ev.kind === "phase" ? `${ev.name} in ${SIGNS[ev.sign].name}` : ev.kind === "ingress" ? `${pName(ev.key)} enters ${SIGNS[ev.sign].name}` : `${pName(ev.key)} turns ${ev.dir}`;
    const sub = ev.kind === "phase" ? "Lunar phase" : ev.kind === "ingress" ? (ev.retro ? "Sign change · ℞" : "Sign change") : "Station";
    return `<button class="row" data-open="tpevent:${i}">
      <span class="dot ${ev.kind === "phase" && ev.angle === 0 ? "hollow" : ""}" style="color:${P.color}"></span>
      <span class="glyph" style="color:${P.color}">${ev.kind === "ingress" ? signGlyph(ev.sign) : P.glyph}</span>
      <span class="main"><div class="title">${esc(title)}</div><div class="sub">${esc(sub)}</div></span>
      <span class="end"><div class="pos">${esc(fmtShort(ev.time).toUpperCase())}</div><div class="pos-sub">${fmtClock(ev.time)}</div></span></button>`;
  }

  function rangeChips(range) {
    return `<div class="chips seg">${RANGES.map((r) => `<button class="chip" data-act="trange:${r}" aria-pressed="${range === r}">${cap(r)}</button>`).join("")}</div>`;
  }

  function navChips(range, isNow) {
    const unit = cap(range);
    return `<div class="chips" style="margin-top:6px">
      <button class="chip" data-act="tprev" aria-label="Previous ${range}">‹ ${unit}</button>
      <button class="chip" data-act="tnow" aria-pressed="${isNow}">Now</button>
      <button class="chip" data-act="tnext" aria-label="Next ${range}">${unit} ›</button>
    </div>`;
  }

  function renderPeriod(range) {
    const P = computePeriod(range);
    const { start, end, events } = P;
    const isNow = !state.transitDate || (Date.now() >= start.getTime() && Date.now() < end.getTime());
    const aspects = events.filter((e) => e.kind === "aspect");
    const moonPh = events.filter((e) => e.kind === "phase");
    const lastDay = new Date(end.getTime() - 86400000);
    const title = range === "month" ? MONTHS_LONG[start.getMonth()] : `${start.getDate()} ${MONTHS[start.getMonth()]} to ${lastDay.getDate()} ${MONTHS[lastDay.getMonth()]}`;
    const newMoon = moonPh.find((e) => e.angle === 0), fullMoon = moonPh.find((e) => e.angle === 180);
    let html = `<section class="hero">
      <div class="eyebrow">Transits<span class="sep">·</span>${range === "month" ? "Month" : "Week"}<span class="sep">·</span>${start.getFullYear()}</div>
      <h1 class="display${range === "week" ? " sm" : ""}">${esc(title)}</h1>
      <div class="subline"><strong>${aspects.length}</strong> exact transit${aspects.length === 1 ? "" : "s"}${newMoon ? ` · New Moon ${fmtShort(newMoon.time)}` : ""}${fullMoon ? ` · Full Moon ${fmtShort(fullMoon.time)}` : ""}</div>
    </section>${rangeChips(range)}${navChips(range, isNow)}`;

    // calendar grid (month) / day strip (week)
    const byDay = {};
    events.forEach((e, i) => { (byDay[dayKey(e.time)] = byDay[dayKey(e.time)] || []).push(i); });
    const today = new Date();
    const cells = [];
    const lead = range === "month" ? (start.getDay() + 6) % 7 : 0;
    for (let i = 0; i < lead; i++) cells.push(`<div class="cal-cell empty"></div>`);
    for (let d = new Date(start); d < end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      const list = (byDay[dayKey(d)] || []).map((i) => events[i]);
      const hits = list.filter((e) => e.kind === "aspect").sort((a, b) => b.weight - a.weight).slice(0, 5);
      const phase = list.find((e) => e.kind === "phase");
      const isToday = d.toDateString() === today.toDateString();
      cells.push(`<button class="cal-cell${isToday ? " today" : ""}${list.length ? " busy" : ""}" data-act="tday:${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}">
        ${phase ? `<span class="cal-phase ${phase.angle === 180 ? "full" : phase.angle === 0 ? "new" : "quarter"}" title="${esc(phase.name)}"></span>` : ""}
        <span class="cal-num">${d.getDate()}</span>
        <span class="cal-dots">${hits.map((e) => `<i style="background:${PLANETS[e.t].color}"></i>`).join("")}</span>
      </button>`);
    }
    html += `<div class="cal"><div class="cal-head">${["M", "T", "W", "T", "F", "S", "S"].map((x) => `<span>${x}</span>`).join("")}</div><div class="cal-grid">${cells.join("")}</div></div>
      <p class="note">Dots mark exact transits to your chart. Tap a day to see it in full.</p>`;

    if (range === "week") {
      // grouped by day
      for (let d = new Date(start); d < end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
        const idx = byDay[dayKey(d)] || [];
        html += `<div class="section-label left">${esc(fmtDay(d))}</div>`;
        html += idx.length ? `<div class="list">${idx.map((i) => eventRow(events[i], i)).join("")}</div>` : `<p class="note" style="text-align:left;margin:0">A quiet day, nothing exact.</p>`;
      }
    } else {
      const section = (label, filter) => {
        const idx = events.map((e, i) => [e, i]).filter(([e]) => filter(e));
        if (!idx.length) return "";
        return `<div class="section-label">${esc(label)} · ${idx.length}</div><div class="list">${idx.map(([e, i]) => eventRow(e, i)).join("")}</div>`;
      };
      html += section("Major transits", (e) => e.kind === "aspect" && SLOW_T.has(e.t));
      html += section("Personal planet transits", (e) => e.kind === "aspect" && !SLOW_T.has(e.t));
      html += section("Moon phases", (e) => e.kind === "phase");
      html += section("Sign changes", (e) => e.kind === "ingress");
      html += section("Stations", (e) => e.kind === "station");
    }
    html += `<p class="note">Week and month views list the moment each transit is exact. The Moon's own aspects move too fast to list here; see them in the Day view.</p>`;
    return html;
  }

  function sheetPeriodEvent(i) {
    const ev = state._period.events[i];
    const P = PLANETS[ev.key];
    const d = ev.time;
    let title, body = [], extra = "";
    if (ev.kind === "phase") {
      title = `${ev.name} in ${SIGNS[ev.sign].name}`;
      const house = state.chart.timeKnown ? houseOfLon(E.lonAt("moon", d, { zodiac: state.settings.zodiac })) : null;
      const lunation = ((D().lunations || {})[ev.name] || {})[ev.sign];
      body = [
        lunation || { "New Moon": "A New Moon starts a fresh lunar cycle: a good moment to set intentions and begin things quietly.", "First Quarter": "The First Quarter is a moment of action and decision: obstacles show you what needs effort.", "Full Moon": "A Full Moon brings things to light and to a head: completion, clarity and heightened feelings.", "Last Quarter": "The Last Quarter is for review and release: let go of what did not work this cycle." }[ev.name],
        `It falls in ${SIGNS[ev.sign].name}${house ? `, in your ${ord(house)} house of ${HOUSES[house].areas}` : ""}, so ${SIGNS[ev.sign].name} themes${house ? " and that area of life" : ""} are highlighted.`,
      ];
      // the lunation's degree, and any birth planets it lands on or opposes
      const lon = E.lonAt("moon", d, { zodiac: state.settings.zodiac });
      const hits = state.chart.points.filter((q) => PLANETS[q.key] && !["southNode", "fortune", "vertex"].includes(q.key) && !E.ASTEROIDS.includes(q.key)).map((q) => ({ q, o: Math.abs(E.diff(lon, q.lon)) })).filter((x) => x.o <= 5 || Math.abs(x.o - 180) <= 5);
      extra = sec(`${SIGNS[ev.sign].name} themes`, SIGNS[ev.sign].essence, elColor(ev.sign)) +
        (house ? sec(`Your ${ord(house)} house`, HOUSES[house].desc) : "") +
        sec("In your chart", hits.length ? hits.map((x) => `It ${x.o <= 5 ? "lands on" : "opposes"} your natal ${pName(x.q.key)} (within ${orbStr(x.o <= 5 ? x.o : Math.abs(x.o - 180))}), so ${PLANETS[x.q.key].core} ${x.o <= 5 ? "is directly lit up" : "is pulled into the spotlight from the other side"} this time.`) : `It does not land close to any of your birth planets, so it works mainly through the ${house ? "house and " : ""}sign above.`);
    } else if (ev.kind === "ingress") {
      title = `${P.name} enters ${SIGNS[ev.sign].name}`;
      const TP = tPlanet(ev.key);
      body = [`${P.name} moves ${ev.retro ? "back " : ""}into ${SIGNS[ev.sign].name}${TP ? `, where it stays ${TP.timescale.replace(/^about /, "about ")}` : ""}. ${SIGNS[ev.sign].essence}`, TP ? TP.brings : ""];
      if (state.chart.timeKnown) { const h = houseOfLon(SIGN_KEYS.indexOf(ev.sign) * 30 + 15); extra = sec(`In your chart: ${SIGNS[ev.sign].name} is in your ${ord(h)} house`, [`So ${P.name} spends this stay in your ${ord(h)} house of ${HOUSES[h].areas}.`, houseVisit(ev.key, h)]); }
    } else {
      title = `${P.name} turns ${ev.dir}`;
      body = [ev.dir === "retrograde"
        ? `${P.name} appears to stop and move backwards. Its themes (${P.keywords.join(", ")}) turn inward for a while: a time to review, revisit and reconsider rather than push ahead.`
        : `${P.name} appears to stop and move forward again. What was under review in its themes (${P.keywords.join(", ")}) can now move ahead.`,
        "Planets are especially strong around a station, when they seem to stand still in the sky."];
      if (state.chart.timeKnown) { const h = houseOfLon(E.lonAt(ev.key, d, { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac })); extra = sec(`In your chart: your ${ord(h)} house`, [`${P.name} stations in your ${ord(h)} house of ${HOUSES[h].areas}, so that part of life is where the ${ev.dir === "retrograde" ? "review" : "renewed momentum"} shows up.`, houseVisit(ev.key, h)]); }
    }
    let html = `<section class="hero"><div class="eyebrow">${esc(fmtDayYear(d))} · ${fmtClock(d)}</div><h2 class="display">${esc(title)}</h2></section>`;
    if (ev.kind !== "phase") {
      const sg = ev.kind === "ingress" ? ev.sign : signOf(E.lonAt(ev.key, d, { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac }));
      const here = state.chart.points.filter((q) => q.sign === sg && PLANET_KEYS.concat(["northNode", "chiron", "asc", "mc"]).includes(q.key));
      if (here.length) extra += sec(`Your planets in ${SIGNS[sg].name}`, `${SIGNS[sg].name} holds your natal ${here.map((q) => pName(q.key)).join(", ")}, so this ${ev.kind === "ingress" ? "stay" : "station"} is personal for you: ${P.name} ${ev.kind === "ingress" ? "will pass over" : "is working on"} ${here.length === 1 ? "that point" : "those points"} and the themes ${here.length === 1 ? "it carries" : "they carry"} in your chart.`);
    }
    html += paras(body) + extra;
    html += `<div class="list"><button class="row" data-act="tday:${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}"><span class="dot" style="color:var(--theme)"></span><span class="main"><div class="title">See this day</div><div class="sub">All transits for ${esc(fmtDay(d))}</div></span></button></div>`;
    return html;
  }

  function renderToday() {
    const range = state.transitRange || "day";
    if (range !== "day") return renderPeriod(range);
    return renderDay();
  }

  function renderDay() {
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
    ${rangeChips("day")}${navChips("day", isNow)}
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
      w.start || w.end ? ["In orb", `${w.start ? fmtDayYear(w.start) : "before"} to ${w.end ? fmtDayYear(w.end) : "later"}`] : null,
      [`${pShort(tr.t)} timescale`, (tPlanet(tr.t) || {}).timescale || "Varies"],
    ]);
    html += paras([transitText(tr, field)]);
    if (w.exacts.length > 1) html += sec("Multiple passes", `Because ${pName(tr.t)} turns retrograde, this transit is exact ${w.exacts.length} times. The first pass tends to raise the theme, the middle pass reviews it, and the last pass settles it.`);
    if (c.timeKnown && tp.natalHouse && np.house) {
      html += sec("Where it lands", np.house
        ? `${pName(tr.t)} is moving through your ${ord(tp.natalHouse)} house, the part of your life about ${HOUSES[tp.natalHouse].areas}, and it is touching your ${pName(tr.n)}, which lives in your ${ord(np.house)}, about ${HOUSES[np.house].areas}. ${tp.natalHouse === np.house ? "Both are in the same area, so that is where you feel this most." : "This is where you are most likely to feel it: something happening in one of these areas stirs up the other."}`
        : `${pName(tr.t)} is moving through your ${ord(tp.natalHouse)} house, the part of your life about ${HOUSES[tp.natalHouse].areas}, so that is where you are most likely to feel it.`);
    }
    const pair = deepAspect(tr.t, tr.n);
    if (pair) html += sec(`${pName(tr.t)} and ${pName(tr.n)}`, pair.theme);
    const TP = tPlanet(tr.t);
    if (TP) html += sec(`What ${pName(tr.t)} brings`, TP.brings);
    html += `<div class="list"><button class="row" data-open="point:${tr.n}"><span class="dot" style="color:${PLANETS[tr.n].color}"></span><span class="main"><div class="title">Your natal ${esc(pName(tr.n))}</div><div class="sub">Open the birth-chart reading</div></span></button></div>`;
    return html;
  }

  function sheetTransitPlanet(key) {
    const T = computeTransits();
    const p = T.tc.get(key);
    const P = PLANETS[key];
    const TP = tPlanet(key);
    const TH = p.natalHouse ? ((D().transitHousesRich || {})[key] || (D().transitHouses || {})[key] || {})[p.natalHouse] : null;
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
    if (p.natalHouse) html += sec(`Through your ${ord(p.natalHouse)} house`, TH ? TH.text : `${pName(key)} is highlighting ${HOUSES[p.natalHouse].areas}.`);
    const natalHere = state.chart.points.filter((q) => q.sign === p.sign && PLANET_KEYS.concat(["northNode", "chiron", "asc", "mc"]).includes(q.key));
    html += sec(`In ${SIGNS[p.sign].name}`, [SIGNS[p.sign].essence, natalHere.length
      ? `${SIGNS[p.sign].name} holds your natal ${natalHere.map((q) => pName(q.key)).join(", ")}, so ${pName(key)}'s passage through this sign is personal for you: it passes over ${natalHere.length === 1 ? "that point" : "those points"} during its stay.`
      : `None of your natal planets sits in ${SIGNS[p.sign].name}, so ${pName(key)} works through your chart mainly by the aspects it makes.`], elColor(p.sign));
    const mine = T.list.map((tr, i) => [tr, i]).filter(([tr]) => tr.t === key);
    if (mine.length) html += `<h4>Aspects to your chart</h4><div class="list">${mine.map(([tr, i]) => transitRow(tr, i)).join("")}</div>`;
    else html += sec("Aspects to your chart", `${pName(key)} is not making a close aspect to your birth chart today.`);
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* settings                                                           */
  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  /* shared helpers for the extra chart types                           */
  /* ------------------------------------------------------------------ */
  const YEAR_MS = 365.242199 * 86400000;
  const MAJOR_T = [
    { key: "conjunction", angle: 0, nature: "fusion" }, { key: "opposition", angle: 180, nature: "tension" },
    { key: "trine", angle: 120, nature: "harmony" }, { key: "square", angle: 90, nature: "tension" },
    { key: "sextile", angle: 60, nature: "harmony" },
  ];
  function houseIn(lon, cusps) {
    for (let h = 1; h <= 12; h++) {
      const start = cusps[h], end = cusps[h === 12 ? 1 : h + 1];
      if (E.norm(lon - start) < E.norm(end - start)) return h;
    }
    return 1;
  }
  function fmtInTz(d, tz, withYear) {
    try {
      return new Intl.DateTimeFormat("en-NZ", { timeZone: tz, day: "numeric", month: "short", year: withYear === false ? undefined : "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d).replace(",", " ·");
    } catch (e) {
      return fmtDayYear(d);
    }
  }
  const age = (d) => (d.getTime() - state.chart.input.utc.getTime()) / YEAR_MS;
  const natureName = (n) => ({ harmony: "Harmonious", tension: "Challenging", fusion: "Blending", adjust: "Adjusting", creative: "Creative" }[n]);
  function wheelBlock(html, key) {
    return `<div class="wheel-wrap static">${html}</div>${key ? `<div class="wheel-key">${key}</div>` : ""}`;
  }
  function barRow(label, color, pct, open, val) {
    return `<button class="bar-row" ${open ? `data-open="${open}"` : ""}><span class="lab"><i style="background:${color}"></i>${esc(label)}</span>
      <span class="track"><b style="width:${Math.max(2, pct)}%;background:${color}"></b></span><span class="val">${val === undefined ? Math.round(pct) + "%" : val}</span></button>`;
  }

  /* ------------------------------------------------------------------ */
  /* DOMINANTS                                                          */
  /* ------------------------------------------------------------------ */
  function dominants() {
    const c = state.chart, d = c.derived;
    const get = (k) => c.get(k);
    const planets = PLANET_KEYS.map(get);
    const parts = {};
    for (const p of planets) {
      const r = { base: p.key === "sun" || p.key === "moon" ? 2 : 1, ruler: 0, dignity: 0, angular: 0, aspects: 0, rulership: 0 };
      if (p.key === d.chartRuler) r.ruler = 4;
      if (p.dignity === "domicile") r.dignity = 3;
      if (p.dignity === "exaltation") r.dignity = 2;
      if (c.timeKnown && [1, 4, 7, 10].includes(p.house)) r.angular = 2.5 + (p.house === 1 ? 1 : 0);
      for (const a of c.aspects) if ((a.a === p.key || a.b === p.key) && a.major) r.aspects += 0.4 + a.strength * 0.6;
      if (rulerOf(get("sun").sign) === p.key) r.rulership += 2;
      if (rulerOf(get("moon").sign) === p.key) r.rulership += 1.5;
      for (const q of planets) if (q !== p && rulerOf(q.sign) === p.key) r.rulership += 0.5;
      parts[p.key] = r;
    }
    const total = (r) => r.base + r.ruler + r.dignity + r.angular + r.aspects + r.rulership;
    const sumP = PLANET_KEYS.reduce((s, k) => s + total(parts[k]), 0);
    const planetPct = PLANET_KEYS.map((k) => ({ key: k, score: total(parts[k]), pct: (total(parts[k]) / sumP) * 100, parts: parts[k] })).sort((a, b) => b.score - a.score);
    const w = (k) => (k === "sun" || k === "moon" ? 3 : ["mercury", "venus", "mars"].includes(k) ? 2 : 1);
    const signS = Object.fromEntries(SIGN_KEYS.map((k) => [k, 0]));
    for (const p of planets) signS[p.sign] += w(p.key);
    if (c.timeKnown) { signS[get("asc").sign] += 3; signS[get("mc").sign] += 1; }
    const sumS = Object.values(signS).reduce((a, b) => a + b, 0);
    const signPct = SIGN_KEYS.map((k) => ({ key: k, pct: (signS[k] / sumS) * 100 })).sort((a, b) => b.pct - a.pct);
    let housePct = null;
    if (c.timeKnown) {
      const hs = {};
      for (let h = 1; h <= 12; h++) hs[h] = 0;
      for (const p of planets) hs[p.house] += w(p.key);
      // the house ruled by the chart ruler and the houses of the angles' rulers add a little weight
      hs[get(d.chartRuler).house] += 1;
      const sumH = Object.values(hs).reduce((a, b) => a + b, 0);
      housePct = Object.keys(hs).map((h) => ({ key: +h, pct: (hs[h] / sumH) * 100 })).sort((a, b) => b.pct - a.pct);
    }
    const el = { fire: 0, earth: 0, air: 0, water: 0 }, md = { cardinal: 0, fixed: 0, mutable: 0 };
    for (const s of SIGN_KEYS) { el[SIGNS[s].element] += signS[s]; md[SIGNS[s].mode] += signS[s]; }
    return { planetPct, signPct, housePct, el, md, sumS };
  }

  function sheetDominants() {
    const c = state.chart;
    const X = dominants();
    const DD = D().dominants || {};
    const top = X.planetPct[0], low = X.planetPct[X.planetPct.length - 1];
    let html = `<section class="hero"><div class="eyebrow">Dominants</div><h2 class="display">${esc(pName(top.key))}</h2>
      <div class="subline">${Math.round(top.pct)}% of the chart's planetary weight · then ${esc(pName(X.planetPct[1].key))} and ${esc(pName(X.planetPct[2].key))}</div></section>`;
    if (DD.intro) html += paras([DD.intro]);
    html += `<h4>Planets</h4><div class="bars">`;
    for (const p of X.planetPct) html += barRow(pShort(p.key), PLANETS[p.key].color, (p.pct / X.planetPct[0].pct) * 100, `point:${p.key}`, `${p.pct.toFixed(1)}%`);
    html += `</div>`;
    html += sec(`${pName(top.key)} leads`, [DD.planets && DD.planets[top.key], PLANETS[top.key].desc], PLANETS[top.key].color);
    for (const p of X.planetPct.slice(1, 3)) html += sec(`Then ${pName(p.key)}`, firstPara(DD.planets && DD.planets[p.key]) || PLANETS[p.key].desc, PLANETS[p.key].color);
    if (DD.weak && DD.weak[low.key]) html += sec(`Quietest: ${pName(low.key)}`, DD.weak[low.key], PLANETS[low.key].color);
    // how the scores are built
    const LAB = { base: "Base", ruler: "Chart ruler", dignity: "Dignity", angular: "Angular house", aspects: "Aspects", rulership: "Rules other planets" };
    html += `<h4>How the top scores are built</h4>`;
    for (const p of X.planetPct.slice(0, 3)) {
      const rows = Object.entries(p.parts).filter(([, v]) => v > 0).map(([k, v]) => [LAB[k], `+${v.toFixed(1)}`]);
      rows.push(["Total", `<strong>${p.score.toFixed(1)}</strong>`]);
      html += `<p class="minihead"><span class="sym" style="color:${PLANETS[p.key].color}">${pGlyph(p.key)}</span> ${esc(pName(p.key))}</p>` + facts(rows);
    }
    html += `<h4>Signs</h4><div class="bars">`;
    for (const s of X.signPct.filter((s) => s.pct > 0)) html += barRow(SIGNS[s.key].name, K.ELEMENTS[SIGNS[s.key].element].color, (s.pct / X.signPct[0].pct) * 100, `sign:${s.key}`, `${s.pct.toFixed(1)}%`);
    html += `</div>`;
    if (X.housePct) {
      html += `<h4>Houses</h4><div class="bars">`;
      for (const h of X.housePct.filter((h) => h.pct > 0)) html += barRow(`House ${h.key}`, "var(--text-2)", (h.pct / X.housePct[0].pct) * 100, `house:${h.key}`, `${h.pct.toFixed(1)}%`);
      html += `</div>`;
      const th = X.housePct[0].key;
      if (DD.houses && DD.houses[th]) html += sec(`Emphasis on the ${ord(th)} house · ${HOUSES[th].title}`, DD.houses[th]);
    }
    html += `<h4>Elements</h4><div class="bars">`;
    for (const k of ELEMENT_KEYS) html += barRow(K.ELEMENTS[k].name, K.ELEMENTS[k].color, (X.el[k] / X.sumS) * 100, `element:${k}`);
    html += `</div><h4>Modes</h4><div class="bars">`;
    for (const k of MODE_KEYS) html += barRow(K.MODES[k].name, "var(--text-2)", (X.md[k] / X.sumS) * 100, `mode:${k}`);
    html += `</div><p class="note">Signs, elements and modes are weighted: Sun, Moon and Ascendant 3, Mercury, Venus and Mars 2, the other planets 1${c.timeKnown ? ", Midheaven 1" : ""}.</p>`;
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* PROGRESSIONS                                                       */
  /* ------------------------------------------------------------------ */
  const PROG_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron"];
  function progTarget() { return state.progDate ? new Date(state.progDate) : new Date(); }
  function progUtcFor(real) {
    const b = state.chart.input.utc.getTime();
    return new Date(b + ((real.getTime() - b) / YEAR_MS) * 86400000);
  }
  function computeProg() {
    const c = state.chart;
    const target = progTarget();
    const key = target.toDateString() + JSON.stringify(state.settings) + state.record.id;
    if (state._prog && state._prog.key === key) return state._prog;
    const pc = E.progressedChart(c, target, state.settings);
    const sunV = pc.get("sun").speed;
    const PK = ["sun", "moon", "mercury", "venus", "mars"].concat(c.timeKnown ? ["asc", "mc"] : []);
    const NK = PLANET_KEYS.concat(["northNode", "chiron"]).concat(c.timeKnown ? ["asc", "mc"] : []);
    const list = [];
    for (const pk of PK) {
      const p = pc.get(pk);
      const v = pk === "asc" || pk === "mc" ? sunV : p.speed; // degrees per year of life
      for (const nk of NK) {
        const n = c.get(nk);
        if (!n || (pk === nk && (pk === "asc" || pk === "mc"))) continue;
        const sep = Math.abs(E.diff(p.lon, n.lon));
        for (const asp of MAJOR_T) {
          const orb = Math.abs(sep - asp.angle);
          if (orb > 1) continue;
          const later = Math.abs(Math.abs(E.diff(p.lon + v * 0.1, n.lon)) - asp.angle);
          const applying = later < orb;
          const rate = Math.abs(later - orb) / 0.1; // orb change per year
          const exact = rate > 0 ? new Date(target.getTime() + (applying ? 1 : -1) * (orb / rate) * YEAR_MS) : null;
          list.push({ a: nk, b: pk, type: asp.key, angle: asp.angle, nature: asp.nature, major: true, orb, strength: 1 - orb, applying, exact });
        }
      }
    }
    list.sort((x, y) => x.orb - y.orb);
    const phaseAngle = E.norm(pc.get("moon").lon - pc.get("sun").lon);
    const phase = K.MOON_PHASES.slice().reverse().find((ph) => phaseAngle >= ph.from);
    state._prog = { key, target, pc, list, phaseAngle, phase, timeline: null };
    return state._prog;
  }

  /** Coming progressed Moon sign and house changes, progressed Sun sign changes and progressed stations. */
  function progTimeline() {
    const P = computeProg();
    if (P.timeline) return P.timeline;
    const c = state.chart, opts = { nodeType: state.settings.nodeType, zodiac: state.settings.zodiac };
    const birth = c.input.utc.getTime();
    const lonReal = (k, ms) => E.lonAt(k, progUtcFor(new Date(ms)), opts);
    const bisect = (f, a, b) => { let fa = f(a); for (let i = 0; i < 30; i++) { const m = (a + b) / 2, fm = f(m); if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; } return (a + b) / 2; };
    const moon = [];
    const MONTH = YEAR_MS / 12;
    const t0 = P.target.getTime() - YEAR_MS * 2.5, t1 = P.target.getTime() + YEAR_MS * 10;
    let prevLon = lonReal("moon", t0);
    for (let t = t0 + MONTH; t <= t1; t += MONTH) {
      const lon = lonReal("moon", t);
      const s1 = Math.floor(prevLon / 30), s2 = Math.floor(lon / 30);
      if (s1 !== s2) {
        const b = s2 * 30;
        const te = bisect((ms) => E.diff(b, lonReal("moon", ms)), t - MONTH, t);
        moon.push({ kind: "sign", sign: SIGN_KEYS[s2], time: new Date(te) });
      }
      if (c.timeKnown) {
        const h1 = houseOfLon(prevLon), h2 = houseOfLon(lon);
        if (h1 !== h2) {
          const cusp = c.houses[h2];
          const te = bisect((ms) => E.diff(cusp, lonReal("moon", ms)), t - MONTH, t);
          moon.push({ kind: "house", house: h2, time: new Date(te) });
        }
      }
      prevLon = lon;
    }
    moon.sort((a, b) => a.time - b.time);
    // progressed Sun: sign changes over a 100-year life, and planets turning by progression
    const sun = [], stations = [];
    const spd = (k, ms) => E.diff(E.lonAt(k, progUtcFor(new Date(ms - YEAR_MS * 0.5)), opts), E.lonAt(k, progUtcFor(new Date(ms + YEAR_MS * 0.5)), opts));
    let sPrev = lonReal("sun", birth);
    const vPrev = { mercury: spd("mercury", birth), venus: spd("venus", birth), mars: spd("mars", birth) };
    for (let y = 1; y <= 100; y++) {
      const t = birth + y * YEAR_MS;
      const s = lonReal("sun", t);
      if (Math.floor(s / 30) !== Math.floor(sPrev / 30)) {
        const b = Math.floor(s / 30) * 30;
        sun.push({ sign: signOf(s), time: new Date(bisect((ms) => E.diff(b, lonReal("sun", ms)), t - YEAR_MS, t)) });
      }
      sPrev = s;
      for (const k of ["mercury", "venus", "mars"]) {
        const v = spd(k, t);
        if (Math.sign(v) !== Math.sign(vPrev[k])) {
          const te = bisect((ms) => spd(k, ms), t - YEAR_MS, t);
          stations.push({ key: k, dir: v < 0 ? "retrograde" : "direct", time: new Date(te) });
        }
        vPrev[k] = v;
      }
    }
    stations.sort((a, b) => a.time - b.time);
    P.timeline = { moon, sun, stations };
    return P.timeline;
  }

  function progNav() {
    const t = progTarget();
    const isNow = !state.progDate;
    const iso = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
    return `<div class="field" style="border-top:1px solid var(--line);margin-top:14px"><label for="p-date">Date</label><input type="date" id="p-date" value="${iso}"></div>
      <div class="chips" style="margin-top:6px">
      <button class="chip" data-act="pprev">‹ Year</button>
      <button class="chip" data-act="pnow" aria-pressed="${isNow}">Now</button>
      <button class="chip" data-act="pnext">Year ›</button></div>`;
  }

  function renderProgressed() {
    const c = state.chart;
    const P = computeProg(), pc = P.pc;
    const sun = pc.get("sun"), moon = pc.get("moon");
    const parts = [`<strong>${sym(PLANETS.sun.glyph)} ${SIGNS[sun.sign].name}</strong>`, `${sym(PLANETS.moon.glyph)} ${SIGNS[moon.sign].name}`];
    if (c.timeKnown) parts.push(`↑ ${SIGNS[pc.get("asc").sign].name}`);
    let html = `<section class="hero">
      <div class="eyebrow">Progressions<span class="sep">·</span>Age ${Math.floor(pc.ageYears)}<span class="sep">·</span>${esc(fmtDayYear(P.target))}</div>
      <h1 class="display">Progressed</h1>
      <div class="subline">${parts.join(' <span style="opacity:.6">·</span> ')}</div>
    </section>${progNav()}`;
    html += wheelBlock(window.AstroWheel.render(c, { outer: { points: pc.points, aspects: P.list } }), `<span>Inner <b>natal</b></span><span>Outer <b>progressed</b></span>`);

    html += `<div class="split">`;
    html += stat("Progressed Sun", `${sym(PLANETS.sun.glyph)} ${SIGNS[sun.sign].name}`, `${degStr(sun)}${c.timeKnown ? ` · natal H${houseOfLon(sun.lon)}` : ""}`, "prog:sun");
    html += stat("Progressed Moon", `${sym(PLANETS.moon.glyph)} ${SIGNS[moon.sign].name}`, `${degStr(moon)}${c.timeKnown ? ` · natal H${houseOfLon(moon.lon)}` : ""}`, "prog:moon");
    if (c.timeKnown) {
      const pa = pc.get("asc"), pm = pc.get("mc");
      html += stat("Progressed ASC", `${signGlyph(pa.sign)} ${SIGNS[pa.sign].name}`, degStr(pa), "prog:asc");
      html += stat("Progressed MC", `${signGlyph(pm.sign)} ${SIGNS[pm.sign].name}`, degStr(pm), "prog:mc");
    }
    html += stat("Lunation phase", P.phase.name, `${Math.round(P.phaseAngle)}° progressed Sun–Moon`, "pphase");
    html += stat("Solar arc", `${pc.solarArc.toFixed(2)}°`, "How far the Sun has progressed", "pintro");
    html += `</div>`;

    // aspects
    html += `<div class="section-label">Progressed aspects · within 1°</div>`;
    if (P.list.length) {
      html += `<div class="list">${P.list.map((a, i) => {
        const X = ASPECTS[a.type];
        return `<button class="row" data-open="paspect:${i}"><span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title">P. ${esc(pShort(a.b))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(a.a === "asc" || a.a === "mc" ? pName(a.a) : "natal " + pShort(a.a))}</div>
          <div class="sub">${esc(X.name)} · ${a.applying ? "applying" : "separating"}${a.exact ? ` · exact ${esc(fmtMonthYear(a.exact))}` : ""}</div></span>
          <span class="end"><div class="pos">${orbStr(a.orb)}</div></span></button>`;
      }).join("")}</div>`;
    } else html += `<p class="note" style="text-align:left">No progressed aspects are within 1° right now: a quieter stretch for inner development.</p>`;

    // timeline
    html += `<div class="section-label">Progressed Moon timeline</div><div class="list" id="prog-timeline"><div class="row"><span class="main"><div class="sub">Working out the dates…</div></span></div></div>`;
    html += `<div class="section-label">Life chapters · progressed Sun</div><div class="list" id="prog-sun"></div>`;

    // positions
    html += `<div class="section-label">Progressed positions</div><div class="list">`;
    for (const k of PROG_KEYS) {
      const p = pc.get(k);
      if (!p) continue;
      const n = c.get(k);
      const moved = E.diff(n.lon, p.lon);
      html += `<button class="row" data-open="prog:${k}"><span class="dot" style="color:${PLANETS[k].color}"></span><span class="glyph" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>
        <span class="main"><div class="title">${esc(pName(k))}</div><div class="sub">${esc(SIGNS[p.sign].name)}${c.timeKnown ? ` · natal H${houseOfLon(p.lon)}` : ""}${p.retro ? " · ℞" : ""}</div></span>
        <span class="end"><div class="pos">${degStr(p)}${signGlyph(p.sign)}</div><div class="pos-sub">${moved >= 0 ? "+" : "−"}${Math.abs(moved).toFixed(1)}°</div></span></button>`;
    }
    html += `</div><p class="note">Secondary progressions: each day after birth stands for a year of life. Angles move by the solar arc in right ascension. Progressed planets are placed in your natal houses.</p>`;
    return html;
  }

  function fillProgTimeline() {
    const el = $("#prog-timeline");
    if (!el) return;
    const T = progTimeline();
    const now = progTarget().getTime();
    const moonRows = T.moon.filter((e) => e.time.getTime() > now - YEAR_MS * 2.5).slice(0, 8);
    el.innerHTML = moonRows.map((e, i) => {
      const past = e.time.getTime() < now;
      const title = e.kind === "sign" ? `Moon enters ${SIGNS[e.sign].name}` : `Moon enters your ${ord(e.house)} house`;
      return `<button class="row" data-open="pmoon:${T.moon.indexOf(e)}"><span class="dot ${past ? "hollow" : ""}" style="color:${PLANETS.moon.color}"></span>
        <span class="glyph" style="color:${PLANETS.moon.color}">${e.kind === "sign" ? signGlyph(e.sign) : e.house}</span>
        <span class="main"><div class="title ${past ? "dim" : ""}">${esc(title)}</div><div class="sub">${e.kind === "sign" ? "New emotional chapter" : HOUSES[e.house].title}</div></span>
        <span class="end"><div class="pos">${esc(fmtMonthYear(e.time))}</div><div class="pos-sub">Age ${Math.floor(age(e.time))}</div></span></button>`;
    }).join("") || `<div class="row"><span class="main"><div class="sub">No changes in this period.</div></span></div>`;
    const sunEl = $("#prog-sun");
    const c = state.chart;
    const chapters = [{ sign: c.get("sun").sign, time: c.input.utc }].concat(T.sun);
    let html = chapters.map((e, i) => {
      const next = chapters[i + 1];
      const current = e.time.getTime() <= now && (!next || next.time.getTime() > now);
      return `<button class="row" data-open="psun:${e.sign}"><span class="dot ${current ? "" : "hollow"}" style="color:${PLANETS.sun.color}"></span>
        <span class="glyph" style="color:${PLANETS.sun.color}">${signGlyph(e.sign)}</span>
        <span class="main"><div class="title ${current ? "" : "dim"}">${esc(SIGNS[e.sign].name)}${current ? " · now" : ""}</div><div class="sub">${i === 0 ? "From birth" : `From ${fmtMonthYear(e.time)}`}</div></span>
        <span class="end"><div class="pos">Age ${Math.floor(age(e.time))}</div></span></button>`;
    }).join("");
    html += T.stations.map((s) => `<button class="row" data-open="pstation:${T.stations.indexOf(s)}"><span class="dot" style="color:${PLANETS[s.key].color}"></span>
      <span class="glyph" style="color:${PLANETS[s.key].color}">${pGlyph(s.key)}</span>
      <span class="main"><div class="title">${esc(pName(s.key))} turns ${s.dir}</div><div class="sub">By progression · ${esc(fmtMonthYear(s.time))}</div></span>
      <span class="end"><div class="pos">Age ${Math.floor(age(s.time))}</div></span></button>`).join("");
    sunEl.innerHTML = html;
  }

  function sheetProg(key) {
    const c = state.chart;
    const P = computeProg(), p = P.pc.get(key), n = c.get(key);
    const PR = D().progressions || {};
    const S = SIGNS[p.sign];
    const h = c.timeKnown && key !== "asc" && key !== "mc" ? houseOfLon(p.lon) : null;
    const title = key === "asc" ? `Progressed ${S.name} Rising` : key === "mc" ? `Progressed Midheaven in ${S.name}` : `Progressed ${pName(key)} in ${S.name}`;
    let html = `<section class="hero"><div class="eyebrow">Progressed · ${esc(fmtDayYear(P.target))}</div><h2 class="display">${esc(title)}</h2>
      <div class="subline"><span class="sym" style="color:${PLANETS[key].color}">${pGlyph(key)}</span> ${degFull(p)} ${signGlyph(p.sign)}${p.retro ? ' <span class="retro">℞</span>' : ""}</div></section>`;
    html += facts([
      ["Natal", `${degStr(n)} ${signGlyph(n.sign)} ${SIGNS[n.sign].name}`],
      ["Moved", `${E.diff(n.lon, p.lon).toFixed(2)}°`],
      h ? ["Natal house", `${ord(h)} · ${HOUSES[h].title}`] : null,
      p.speed !== undefined && key !== "asc" && key !== "mc" ? ["Pace", `${Math.abs(p.speed).toFixed(3)}° a year${p.retro ? " · retrograde" : ""}`] : null,
    ]);
    if (key === "moon") {
      html += sec(`In ${S.name}`, PR.moonSigns && PR.moonSigns[p.sign], elColor(p.sign));
      if (h && PR.moonHouses) html += sec(`Through your ${ord(h)} house`, PR.moonHouses[h]);
    } else if (key === "sun") {
      html += sec(`In ${S.name}`, PR.sunSigns && PR.sunSigns[p.sign], elColor(p.sign));
      if (h) html += sec(`In your ${ord(h)} house`, `Your sense of purpose is currently being worked out through ${HOUSES[h].areas}.`);
    } else {
      // the slow planets barely move by progression, and their sign readings describe a whole generation
      const personal = ["mercury", "venus", "mars", "asc", "mc"].includes(key);
      html += sec(`In ${S.name}`, [PR.planets && PR.planets[key], personal ? signText(p) : ""], elColor(p.sign));
      if (!personal) {
        const moved = Math.abs(E.diff(n.lon, p.lon));
        html += sec(moved < 3 ? "Barely moved" : "A slow shift", moved < 3
          ? `${pName(key)} has moved only ${moved.toFixed(2)}° since you were born. The slow planets hardly move by progression, so your birth-chart reading for ${pName(key)} still describes it.`
          : `${pName(key)} has moved ${moved.toFixed(1)}° since you were born${p.sign !== n.sign ? "" : `, still within ${SIGNS[n.sign].name}`}. The slow planets change little by progression, so your birth-chart reading for ${pName(key)} remains the foundation; any aspects it makes below are where it is active now.`);
        html += natalSnippet(key, `Your natal ${pName(key)}, still in effect`);
      }
      if (p.sign !== n.sign) html += sec("A new sign", `${pName(key)} has progressed from ${SIGNS[n.sign].name} into ${S.name} since birth, so its style has slowly shifted: ${PLANETS[key].focus} now leans ${S.how}.`);
      if (p.retro !== n.retro) html += sec("Change of direction", [`${pName(key)} was ${n.retro ? "retrograde" : "direct"} at birth and is now ${p.retro ? "retrograde" : "direct"} by progression.`, PR.stations]);
      if (h) html += sec(`In your ${ord(h)} house`, houseText(Object.assign({}, p, { house: h }), false));
    }
    const asp = P.list.filter((a) => a.b === key);
    if (asp.length) {
      html += `<h4>Aspects to your natal chart</h4><div class="list">` + asp.map((a) => {
        const X = ASPECTS[a.type];
        return `<button class="row" data-open="paspect:${P.list.indexOf(a)}"><span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title"><span class="sym" style="color:${X.color}">${X.glyph}</span> natal ${esc(pName(a.a))}</div><div class="sub">${esc(X.name)}${a.exact ? ` · exact ${esc(fmtMonthYear(a.exact))}` : ""}</div></span>
          <span class="end"><div class="pos">${orbStr(a.orb)}</div></span></button>`;
      }).join("") + `</div>`;
    }
    if (PLANETS[key] && !["asc", "mc"].includes(key)) {
      html += `<div class="list" style="margin-top:18px"><button class="row" data-open="point:${key}"><span class="dot" style="color:${PLANETS[key].color}"></span><span class="glyph" style="color:${PLANETS[key].color}">${pGlyph(key)}</span><span class="main"><div class="title">Your natal ${esc(pName(key))}</div><div class="sub">${esc(SIGNS[n.sign].name)}${n.house ? ` · ${ord(n.house)} house` : ""} · open the birth-chart reading</div></span></button></div>`;
    }
    return html;
  }

  function sheetProgAspect(i) {
    const P = computeProg(), a = P.list[i];
    const X = ASPECTS[a.type];
    const PR = D().progressions || {};
    const dA = deepAspect(a.b === "asc" || a.b === "mc" ? a.b : a.b, a.a);
    const body = dA ? (a.type === "conjunction" ? dA.fusion : FLOW_TYPES.has(a.type) ? dA.flow : dA.tension) : aspectText({ a: a.b, b: a.a, type: a.type, nature: a.nature });
    let html = `<section class="hero"><div class="eyebrow">Progressed aspect · ${esc(X.name)}</div>
      <h2 class="display">P. ${esc(pShort(a.b))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(a.a))}</h2>
      <div class="subline">orb ${orbStr(a.orb)} · ${a.applying ? "applying" : "separating"}${a.exact ? ` · exact ${esc(fmtMonthYear(a.exact))}` : ""}</div></section>`;
    html += paras([PR.planets && PR.planets[a.b], `Your progressed ${pName(a.b)} is making a ${X.name.toLowerCase()} to your natal ${pName(a.a)}. Progressed aspects build slowly and stay active for about a year either side of exact (the Moon's for a couple of months), so they describe a season of inner development rather than a single event.`]);
    html += sec("The theme", [dA && dA.theme, body]);
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* SOLAR RETURN                                                       */
  /* ------------------------------------------------------------------ */
  function srDefaultYear() {
    const now = new Date(), y = now.getFullYear();
    return E.solarReturnTime(state.chart, y, state.settings) <= now ? y : y - 1;
  }
  function srPlace() {
    return state.srPlace || state.chart.record.place;
  }
  function computeSR() {
    const c = state.chart;
    const year = state.srYear || srDefaultYear();
    const place = srPlace();
    const key = year + JSON.stringify(state.settings) + state.record.id + place.lat + "," + place.lon;
    if (state._sr && state._sr.key === key) return state._sr;
    const t = E.solarReturnTime(c, year, state.settings);
    const sr = E.computeChart({ utc: t, lat: place.lat, lon: place.lon, timeKnown: true }, Object.assign({}, state.settings, { asteroids: false }));
    const angles = [["Ascendant", sr.asc], ["Descendant", E.norm(sr.asc + 180)], ["Midheaven", sr.mc], ["IC", E.norm(sr.mc + 180)]];
    const angular = [];
    for (const k of PLANET_KEYS) {
      const p = sr.get(k);
      for (const [name, lon] of angles) { const o = Math.abs(E.diff(p.lon, lon)); if (o <= 6) angular.push({ key: k, angle: name, orb: o }); }
    }
    state._sr = { key, year, t, place, sr, angular, next: E.solarReturnTime(c, year + 1, state.settings) };
    return state._sr;
  }
  function srPlaceSelect(place) {
    const birth = state.chart.record.place;
    const cur = state.srPlace ? `${state.srPlace.lat},${state.srPlace.lon}` : "";
    const opts = [`<option value="">Birthplace · ${esc(birth.name)}</option>`].concat(window.ASTRO_CITIES.map((c) => {
      const v = `${c[2]},${c[3]}`;
      return `<option value="${v}" ${v === cur ? "selected" : ""}>${esc(c[0])} · ${esc(c[1].replace(", Australia", "").replace(", New Zealand", " NZ"))}</option>`;
    }));
    return `<div class="field" style="border-top:1px solid var(--line);margin-top:14px"><label for="sr-place">Place</label><select id="sr-place">${opts.join("")}</select></div>`;
  }
  function renderReturn() {
    const c = state.chart;
    const R = computeSR(), sr = R.sr;
    const SRD = D().solarReturn || {};
    const asc = sr.get("asc"), sun = sr.get("sun"), moon = sr.get("moon");
    let html = `<section class="hero">
      <div class="eyebrow">Solar return<span class="sep">·</span>Age ${Math.round(age(R.t))}</div>
      <h1 class="display">${R.year}–${String(R.year + 1).slice(2)}</h1>
      <div class="subline"><strong>${esc(fmtInTz(R.t, R.place.tz))}</strong></div>
      <div class="meta">${esc(R.place.name)} · ${fmtCoord(R.place.lat, R.place.lon)} · runs until ${esc(fmtInTz(R.next, R.place.tz))}</div>
      ${!c.timeKnown ? `<p class="note">Birth time unknown: the natal Sun is taken at noon, so the return time may be several hours out and the return Ascendant and houses are uncertain.</p>` : ""}
    </section>
    <div class="chips" style="margin-top:0">
      <button class="chip" data-act="srprev">‹ Year</button>
      <button class="chip" data-act="srnow" aria-pressed="${!state.srYear || state.srYear === srDefaultYear()}">Current</button>
      <button class="chip" data-act="srnext">Year ›</button></div>
    ${srPlaceSelect(R.place)}`;
    html += wheelBlock(window.AstroWheel.render(sr));

    html += `<div class="section-label">Themes of the year</div><div class="list">`;
    const row = (open, color, glyph, title, sub) => `<button class="row" data-open="${open}"><span class="dot" style="color:${color}"></span><span class="glyph" style="color:${color}">${glyph}</span>
      <span class="main"><div class="title">${title}</div><div class="sub">${esc(sub)}</div></span></button>`;
    html += row("srtheme:asc", elColor(asc.sign), signGlyph(asc.sign), `${esc(SIGNS[asc.sign].name)} Rising`, `Tone of the year${c.timeKnown ? ` · falls in your natal ${ord(houseOfLon(asc.lon))} house` : ""}`);
    html += row("srtheme:sun", PLANETS.sun.color, pGlyph("sun"), `Sun in the ${ord(sun.house)} house`, `Main focus · ${HOUSES[sun.house].title}`);
    html += row("srtheme:moon", PLANETS.moon.color, pGlyph("moon"), `Moon in ${esc(SIGNS[moon.sign].name)} · ${ord(moon.house)} house`, "Feelings and needs this year");
    const ruler = rulerOf(asc.sign), rp = sr.get(ruler);
    html += row(`srp:${ruler}`, PLANETS[ruler].color, pGlyph(ruler), `Year ruler: ${esc(pName(ruler))}`, `In ${SIGNS[rp.sign].name} · ${ord(rp.house)} house`);
    for (const a of R.angular) html += row(`srp:${a.key}`, PLANETS[a.key].color, pGlyph(a.key), `${esc(pName(a.key))} on the ${esc(a.angle)}`, `Angular · orb ${orbStr(a.orb)}`);
    html += `</div>`;
    if (SRD.intro) html += `<p class="note" style="text-align:left">${esc(firstPara(SRD.intro))} <button class="link-btn" data-open="srintro">More</button></p>`;

    html += `<div class="section-label">Planets this year</div><div class="list">`;
    for (const k of PLANET_KEYS.concat(["northNode", "chiron"])) {
      const p = sr.get(k);
      if (!p) continue;
      html += `<button class="row" data-open="srp:${k}"><span class="dot" style="color:${PLANETS[k].color}"></span><span class="glyph" style="color:${PLANETS[k].color}">${pGlyph(k)}</span>
        <span class="main"><div class="title">${esc(pName(k))}</div><div class="sub">${esc(SIGNS[p.sign].name)} · House ${p.house}${p.retro ? " · ℞" : ""}</div></span>
        <span class="end"><div class="pos">${degStr(p)}${signGlyph(p.sign)}</div><div class="pos-sub">${esc(HOUSES[p.house].title)}</div></span></button>`;
    }
    html += `</div>`;
    const asp = sr.aspects.filter((a) => a.major && PLANET_KEYS.includes(a.a) && PLANET_KEYS.includes(a.b)).slice(0, 12);
    state._srAspects = asp;
    if (asp.length) {
      html += `<div class="section-label">Key aspects this year</div><div class="list">` + asp.map((a, i) => {
        const X = ASPECTS[a.type];
        return `<button class="row" data-open="sraspect:${i}"><span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title">${esc(pShort(a.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(a.b))}</div><div class="sub">${esc(X.name)}</div></span>
          <span class="end"><div class="pos">${orbStr(a.orb)}</div></span></button>`;
      }).join("") + `</div>`;
    }
    html += `<p class="note">A solar return chart is cast for the exact moment the Sun returns to its birth position, at the place you spend your birthday. Change the place above if you were elsewhere.</p>`;
    return html;
  }

  function sheetSRTheme(which) {
    const R = computeSR(), sr = R.sr, c = state.chart;
    const SRD = D().solarReturn || {};
    if (which === "asc") {
      const a = sr.get("asc");
      const nh = c.timeKnown ? houseOfLon(a.lon) : null;
      return sheetSimple(`Solar return ${R.year}`, `${esc(SIGNS[a.sign].name)} Rising`, `${degStr(a)} ${signGlyph(a.sign)}`,
        [SRD.asc && SRD.asc[a.sign], nh ? `The return Ascendant falls in your natal ${ord(nh)} house, so ${HOUSES[nh].areas} set the backdrop for the whole year.` : ""]);
    }
    if (which === "sun") {
      const s = sr.get("sun");
      let html = sheetSimple(`Solar return ${R.year}`, `Sun in the ${ord(s.house)} house`, esc(HOUSES[s.house].title), [SRD.sunHouse && SRD.sunHouse[s.house]]);
      const asp = sr.aspects.filter((a) => (a.a === "sun" || a.b === "sun") && a.orb <= 5 && ASP_WORD[a.type] && !["dsc", "ic"].includes(a.a === "sun" ? a.b : a.a));
      if (asp.length) html += sec("The Sun's aspects this year", asp.map((a) => { const o = a.a === "sun" ? a.b : a.a; return `${cap(ASP_WORD[a.type])} ${pName(o)} (${orbStr(a.orb)}): ${a.nature === "harmony" ? "a supportive link" : a.nature === "fusion" ? "a merging of energies" : "a source of pressure and drive"} between your purpose this year and ${PLANETS[o].core}.`; }));
      return html + natalSnippet("sun", "Your natal Sun");
    }
    const m = sr.get("moon");
    return sheetSimple(`Solar return ${R.year}`, `Moon in ${esc(SIGNS[m.sign].name)}`, `${ord(m.house)} house · ${esc(HOUSES[m.house].title)}`,
      [SRD.moonSign && SRD.moonSign[m.sign], SRD.moonHouse && SRD.moonHouse[m.house]]);
  }
  const ASP_WORD = { conjunction: "conjunct", opposition: "opposite", trine: "trine", square: "square", sextile: "sextile" };
  /** A short reminder of a natal placement, with a link to its full reading. */
  function natalSnippet(key, heading) {
    const c = state.chart, n = c.get(key), P = PLANETS[key];
    if (!n || !P) return "";
    const dp = deepPlanetSign(key, n.sign);
    const text = firstPara(dp ? dp.text : signText(n));
    return sec(heading || `Your natal ${P.name}`, text, P.color) +
      `<div class="list"><button class="row" data-open="point:${key}"><span class="dot" style="color:${P.color}"></span><span class="glyph" style="color:${P.color}">${P.glyph}</span><span class="main"><div class="title">${esc(P.name)} in ${esc(SIGNS[n.sign].name)}${n.house ? ` · ${ord(n.house)} house` : ""}</div><div class="sub">Open the birth-chart reading</div></span></button></div>`;
  }
  /** What a planet tends to bring while it moves through one of your houses (shared by solar returns and transits). */
  const houseVisit = (key, h) => (((D().transitHousesRich || {})[key] || (D().transitHouses || {})[key] || {})[h] || {}).text || "";
  /** How a planet in a solar return or progressed chart relates to the birth chart, with a way back to it. */
  function inYourChart(key, p, chart2, when) {
    const c = state.chart, n = c.get(key), P = PLANETS[key];
    const items = [];
    if (c.timeKnown && key !== "asc" && key !== "mc") {
      const nh = houseOfLon(p.lon);
      items.push(`Falls in your natal <strong>${ord(nh)} house</strong>, linking it to ${esc(HOUSES[nh].areas)}.`);
    }
    if (key !== "sun" && n) {
      const gap = Math.abs(E.diff(n.lon, p.lon));
      if (gap < 3) items.push(`<strong>Back at its birth position</strong>, within ${orbStr(gap)}: the ${esc(P.name)} themes of your birth chart come back into focus ${when}.`);
      else if (n.sign === p.sign) items.push(`In the same sign as at your birth (${esc(SIGNS[n.sign].name)}).`);
      else items.push(`At birth it was in ${esc(SIGNS[n.sign].name)}${n.house ? ` in your ${ord(n.house)} house` : ""}; ${when} it is in ${esc(SIGNS[p.sign].name)}.`);
    }
    if (chart2) {
      const tight = chart2.aspects.filter((a) => (a.a === key || a.b === key) && a.orb <= 3 && ASP_WORD[a.type] && !["dsc", "ic"].includes(a.a === key ? a.b : a.a));
      if (tight.length) items.push(`Tight aspects ${when}: ${tight.map((a) => `<strong>${ASP_WORD[a.type]} ${esc(pName(a.a === key ? a.b : a.a))}</strong> (${orbStr(a.orb)})`).join(", ")}.`);
    }
    if (p.speed !== undefined && !["asc", "mc"].includes(key)) items.push(p.retro ? "Moving retrograde." : "Moving direct.");
    if (!items.length) return "";
    return `<h4>In your chart</h4><ul class="bullets">${items.map((t) => `<li>${t}</li>`).join("")}</ul>` +
      (n && PLANETS[key] ? `<div class="list"><button class="row" data-open="point:${key}"><span class="dot" style="color:${P.color}"></span><span class="glyph" style="color:${P.color}">${P.glyph}</span><span class="main"><div class="title">Your natal ${esc(P.name)}</div><div class="sub">${esc(SIGNS[n.sign].name)}${n.house ? ` · ${ord(n.house)} house` : ""} · open the birth-chart reading</div></span></button></div>` : "");
  }

  function sheetSRPlanet(key) {
    const R = computeSR(), p = R.sr.get(key);
    const SRD = D().solarReturn || {};
    const S = SIGNS[p.sign], P = PLANETS[key];
    const ang = R.angular.filter((a) => a.key === key);
    let html = `<section class="hero"><div class="eyebrow">Solar return ${R.year}</div><h2 class="display">${esc(P.name)} in the ${ord(p.house)} house</h2>
      <div class="subline"><span class="sym" style="color:${P.color}">${P.glyph}</span> ${degStr(p)} ${signGlyph(p.sign)} ${esc(S.name)}${p.retro ? ' <span class="retro">℞</span>' : ""}</div></section>`;
    if (key === rulerOf(R.sr.get("asc").sign)) html += sec("Ruler of the year", `As ruler of your return Ascendant, ${P.name} steers your whole year. Its house (${HOUSES[p.house].areas}) and condition say a great deal about where the year's story unfolds.`);
    if (ang.length && SRD.angular && SRD.angular[key]) html += sec(`On the ${ang[0].angle}`, SRD.angular[key]);
    if (key === "sun" && SRD.sunHouse) html += sec("This year's focus", SRD.sunHouse[p.house]);
    else if (key === "moon" && SRD.moonHouse) html += sec("This year's feelings", [SRD.moonHouse[p.house], SRD.moonSign && SRD.moonSign[p.sign]]);
    else {
      const srH = (((D().srPlanets || {}).house || {})[key] || {})[p.house];
      html += sec(`In the ${ord(p.house)} house · ${HOUSES[p.house].title}`, srH ? [srH] : [`This year ${P.focus} ${isPlural(P.focus) ? "are" : "is"} drawn into ${HOUSES[p.house].areas}.`, houseVisit(key, p.house)]);
    }
    // the sign only says something about the year for the fast planets (the Sun always returns to its birth sign,
    // and the Moon's sign is covered above); slow planets stay in a sign for years
    const srS = (((D().srPlanets || {}).sign || {})[key] || {})[p.sign];
    if (["mercury", "venus", "mars"].includes(key)) html += sec(`In ${S.name}`, srS ? [srS] : [`${P.lead} ${S.how} this year.`, `The gifts to use: ${S.gifts}. The trap to avoid: ${S.shadow}.`], elColor(p.sign));
    if (p.retro) html += sec("Retrograde this year", ((D().srPlanets || {}).retro || {})[key] || K.RETRO_KARMIC[key] || `${P.name} is retrograde in this year's chart, so its themes turn inward: review and revisit before pushing ahead.`);
    html += inYourChart(key, p, R.sr, "this year");
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* SYNASTRY                                                           */
  /* ------------------------------------------------------------------ */
  const SYN_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron", "asc"];
  const SYN_PERSONAL = new Set(["sun", "moon", "mercury", "venus", "mars", "asc"]);
  const SYN_ORB = { conjunction: 8, opposition: 8, trine: 7, square: 7, sextile: 5 };
  const OVL_KEYS = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "northNode", "chiron"];
  const pairKey = (a, b) => (SYN_KEYS.indexOf(a) <= SYN_KEYS.indexOf(b) ? a + "-" + b : b + "-" + a);
  const has = (a, b, x, y) => (a === x && b === y) || (a === y && b === x);
  const CAT_META = {
    attraction: { name: "Attraction", color: "#f29a8a" },
    emotional: { name: "Emotional", color: "#c9d5e4" },
    communication: { name: "Mind", color: "#9ecfe0" },
    stability: { name: "Stability", color: "#d9c28c" },
    growth: { name: "Growth", color: "#a9d99a" },
    challenge: { name: "Friction", color: "#e88a6f" },
  };
  function synCats(a, b, nature) {
    const cats = [];
    const any = (k) => a === k || b === k;
    if (has(a, b, "venus", "mars") || has(a, b, "sun", "venus") || has(a, b, "sun", "mars") || has(a, b, "mars", "mars") || has(a, b, "venus", "venus") || has(a, b, "venus", "pluto") || has(a, b, "mars", "pluto") || has(a, b, "moon", "mars") || has(a, b, "venus", "asc") || has(a, b, "mars", "asc") || has(a, b, "venus", "uranus")) cats.push("attraction");
    if (any("moon")) cats.push("emotional");
    if (any("mercury")) cats.push("communication");
    if ((any("saturn") && (SYN_PERSONAL.has(a) || SYN_PERSONAL.has(b))) || has(a, b, "sun", "moon") || has(a, b, "sun", "sun") || has(a, b, "moon", "moon")) cats.push("stability");
    if (any("jupiter") || any("northNode") || any("chiron")) cats.push("growth");
    if (nature === "tension" && (any("mars") || any("saturn") || any("pluto") || any("uranus") || (SYN_PERSONAL.has(a) && SYN_PERSONAL.has(b)))) cats.push("challenge");
    return cats;
  }
  function partnerRec() {
    return state.saved.find((s) => s.id === state.partnerId && s.id !== state.record.id) || null;
  }
  function computeSyn() {
    const me = state.chart, rec = partnerRec();
    if (!rec) return null;
    const key = rec.id + JSON.stringify(state.settings) + state.record.id + JSON.stringify(rec);
    if (state._syn && state._syn.key === key) return state._syn;
    const them = compute(rec);
    const list = [];
    for (const a of SYN_KEYS) {
      const p = me.get(a);
      if (!p) continue;
      for (const b of SYN_KEYS) {
        const q = them.get(b);
        if (!q || (!SYN_PERSONAL.has(a) && !SYN_PERSONAL.has(b))) continue;
        const sep = Math.abs(E.diff(p.lon, q.lon));
        for (const asp of MAJOR_T) {
          let lim = SYN_ORB[asp.key] + ((a === "sun" || a === "moon" || b === "sun" || b === "moon") ? 1 : 0);
          if (["northNode", "chiron", "asc"].includes(a) || ["northNode", "chiron", "asc"].includes(b)) lim = Math.min(lim, 5);
          const orb = Math.abs(sep - asp.angle);
          if (orb <= lim) list.push({ a, b, type: asp.key, angle: asp.angle, nature: asp.nature, major: true, orb, strength: 1 - orb / lim });
        }
      }
    }
    list.sort((x, y) => x.orb - y.orb);
    const sums = Object.fromEntries(Object.keys(CAT_META).map((k) => [k, 0]));
    const members = Object.fromEntries(Object.keys(CAT_META).map((k) => [k, []]));
    list.forEach((x, i) => {
      for (const cat of synCats(x.a, x.b, x.nature)) {
        const wgt = cat === "challenge" ? x.strength : x.strength * (x.nature === "harmony" ? 1 : x.nature === "fusion" ? 0.9 : 0.45);
        sums[cat] += wgt;
        members[cat].push(i);
      }
    });
    // saturating scale: a couple of close supportive contacts ≈ 50%, many ≈ 80–90%
    const scores = Object.fromEntries(Object.entries(sums).map(([k, v]) => [k, Math.round(100 * (1 - Math.exp(-v / ({ growth: 3.6, challenge: 6 }[k] || 2.6))))]));
    state._synSums = sums;
    const inMine = me.timeKnown ? OVL_KEYS.filter((k) => them.get(k)).map((k) => ({ key: k, house: houseIn(them.get(k).lon, me.houses) })) : null;
    const inTheirs = them.timeKnown ? OVL_KEYS.filter((k) => me.get(k)).map((k) => ({ key: k, house: houseIn(me.get(k).lon, them.houses) })) : null;
    state._syn = { key, rec, them, list, scores, members, inMine, inTheirs };
    return state._syn;
  }
  const myName = () => state.record.name || "You";
  const theirName = (rec) => rec.name || "Them";

  function renderSynastry() {
    const others = state.saved.filter((s) => s.id !== state.record.id);
    const Y = computeSyn();
    if (!Y) {
      let html = `<section class="hero"><div class="eyebrow">Synastry</div><h1 class="display">Compare</h1>
        <div class="subline">See how your chart meets someone else's</div></section>`;
      if (others.length) {
        html += `<div class="section-label">Choose a person</div><div class="list">` + others.map((s) => `<button class="row" data-act="partner:${s.id}">
          <span class="dot" style="color:${TAB_THEME.synastry}"></span><span class="main"><div class="title">${esc(s.name || "Untitled")}</div><div class="sub">${esc(fmtDate(s))} · ${esc(s.timeKnown ? fmtTime(s) : "time unknown")} · ${esc(s.place.name)}</div></span></button>`).join("") + `</div>`;
      }
      html += `<div class="chips" style="margin-top:28px"><button class="chip" data-act="addpartner">+ Add a person</button></div>`;
      if (D().synastry && D().synastry.intro) html += paras([D().synastry.intro]);
      return html;
    }
    const me = state.chart, them = Y.them, rec = Y.rec;
    const flow = Y.list.filter((x) => x.nature === "harmony").length, dyn = Y.list.filter((x) => x.nature === "tension").length;
    let html = `<section class="hero"><div class="eyebrow">Synastry</div>
      <h1 class="display sm">${esc(myName())} <span style="opacity:.55">&amp;</span> ${esc(theirName(rec))}</h1>
      <div class="subline"><strong>${Y.list.length}</strong> contacts · ${flow} flowing · ${dyn} dynamic · ${Y.list.length - flow - dyn} conjunctions</div></section>
      <div class="chips" style="margin-top:0"><button class="chip" data-act="changepartner">Change person</button></div>`;
    html += wheelBlock(window.AstroWheel.render(me, { outer: { points: them.points, aspects: Y.list } }), `<span>Inner <b>${esc(myName())}</b></span><span>Outer <b>${esc(theirName(rec))}</b></span>`);

    html += `<div class="section-label">Compatibility</div><div class="bars">`;
    for (const [k, m] of Object.entries(CAT_META)) html += barRow(m.name, m.color, Y.scores[k], `synscore:${k}`);
    html += `</div>`;

    const rowOf = (x) => {
      const i = Y.list.indexOf(x), X = ASPECTS[x.type];
      return `<button class="row" data-open="syn:${i}"><span class="dot" style="color:${X.color}"></span>
        <span class="main"><div class="title">${esc(pShort(x.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(x.b))}</div>
        <div class="sub">${esc(myName() === "You" ? "Your" : myName() + "'s")} ${esc(pShort(x.a))} · ${esc(theirName(rec))}'s ${esc(pShort(x.b))}</div></span>
        <span class="end"><div class="pos">${orbStr(x.orb)}</div><div class="pos-sub">${esc(X.name)}</div></span></button>`;
    };
    html += `<div class="section-label">Strongest contacts</div><div class="list">${Y.list.slice(0, 6).map(rowOf).join("")}</div>`;
    if (Y.list.length > 6) html += `<div class="section-label">All contacts · ${Y.list.length}</div><div class="list">${Y.list.slice(6).map(rowOf).join("")}</div>`;

    const ovl = (arr, dir, owner) => arr.map((o) => `<button class="row" data-open="ovl:${dir}:${o.key}"><span class="dot" style="color:${PLANETS[o.key].color}"></span><span class="glyph" style="color:${PLANETS[o.key].color}">${pGlyph(o.key)}</span>
      <span class="main"><div class="title">${esc(pName(o.key))} in house ${o.house}</div><div class="sub">${esc(HOUSES[o.house].title)} · ${esc(owner)}</div></span></button>`).join("");
    if (Y.inMine) html += `<div class="section-label">${esc(theirName(rec))}'s planets in your houses</div><div class="list">${ovl(Y.inMine, "in", "your " + "house")}</div>`;
    if (Y.inTheirs) html += `<div class="section-label">Your planets in ${esc(theirName(rec))}'s houses</div><div class="list">${ovl(Y.inTheirs, "out", theirName(rec) + "'s house")}</div>`;
    if (!me.timeKnown || !them.timeKnown) html += `<p class="note">House overlays need a birth time. ${!me.timeKnown ? "Your" : esc(theirName(rec)) + "'s"} birth time is unknown, so ${!me.timeKnown && !them.timeKnown ? "no" : "only one set of"} overlays are shown and the Ascendant is left out.</p>`;
    html += `<p class="note">Orbs: 8° for conjunctions and oppositions, 7° for trines and squares, 5° for sextiles, 1° more with the Sun or Moon, and at most 5° for the Node, Chiron and Ascendant.</p>`;
    return html;
  }

  function sheetSyn(i) {
    const Y = computeSyn(), x = Y.list[i], X = ASPECTS[x.type];
    const S = D().synastry || {};
    const pk = pairKey(x.a, x.b);
    const d = (D().synPairsRich || {})[pk] || (S.pairs && S.pairs[pk]);
    const body = d ? (x.type === "conjunction" ? d.fusion : x.nature === "harmony" ? d.harmony : d.tension) : "";
    const mine = state.chart.get(x.a), theirs = Y.them.get(x.b);
    const [first, second] = pk.split("-");
    const roleOf = (k) => (k === x.a ? myName() : theirName(Y.rec));
    let html = `<section class="hero"><div class="eyebrow">Synastry · ${esc(X.name)}${d ? " · " + esc(d.theme) : ""}</div>
      <h2 class="display">${esc(pShort(x.a))} <span class="sym" style="color:${X.color}">${X.glyph}</span> ${esc(pShort(x.b))}</h2>
      <div class="subline">orb ${orbStr(x.orb)} · ${natureName(x.nature)}</div></section>`;
    html += facts([
      [`${myName()}'s ${pName(x.a)}`, `${degStr(mine)} ${signGlyph(mine.sign)} ${SIGNS[mine.sign].name}`],
      [`${theirName(Y.rec)}'s ${pName(x.b)}`, `${degStr(theirs)} ${signGlyph(theirs.sign)} ${SIGNS[theirs.sign].name}`],
      ["Strength", `${Math.round(x.strength * 100)}%`],
    ]);
    if (d) {
      html += paras([d.text]);
      html += sec(`As a ${X.name.toLowerCase()}`, [body]);
      if (first !== second) html += `<p class="note" style="text-align:left">Here ${esc(roleOf(first))} is the ${esc(pName(first))} person and ${esc(roleOf(second))} is the ${esc(pName(second))} person.</p>`;
    } else {
      html += paras([`${myName()}'s ${pName(x.a)} (${PLANETS[x.a].core}) ${ASPECTS[x.type].verb} ${theirName(Y.rec)}'s ${pName(x.b)} (${PLANETS[x.b].core}). ${X.desc}`, K.NATURE[x.nature]]);
    }
    html += sec("The points involved", [PLANETS[x.a].desc, x.a !== x.b ? PLANETS[x.b].desc : ""]);
    return html;
  }
  function sheetOverlay(dir, key) {
    const Y = computeSyn();
    const S = D().synastry || {};
    const rec = Y.rec;
    const inMine = dir === "in";
    const o = (inMine ? Y.inMine : Y.inTheirs).find((z) => z.key === key);
    const owner = inMine ? myName() : theirName(rec), guest = inMine ? theirName(rec) : myName();
    const title = `${inMine ? theirName(rec) + "'s" : myName() === "You" ? "Your" : myName() + "'s"} ${pName(key)} in ${inMine ? (myName() === "You" ? "your" : myName() + "'s") : theirName(rec) + "'s"} ${ord(o.house)} house`;
    const txt = ((D().synOverlaysRich || {})[key] || {})[o.house] || (S.overlays && S.overlays[key] && S.overlays[key][o.house]);
    let html = `<section class="hero"><div class="eyebrow">House overlay · ${esc(HOUSES[o.house].title)}</div><h2 class="display sm">${esc(title)}</h2></section>`;
    if (!inMine) html += `<p class="note" style="text-align:left">Written from ${esc(owner)}'s side: read "you" as ${esc(owner)} and "their" as ${esc(guest)}.</p>`;
    html += paras([txt || `${guest}'s ${pName(key)} brings ${PLANETS[key].focus} into ${owner}'s ${ord(o.house)} house of ${HOUSES[o.house].areas}.`]);
    html += sec(`The ${ord(o.house)} house`, HOUSES[o.house].desc);
    const guestChart = inMine ? Y.them : state.chart, gp = guestChart.get(key);
    html += sec(`${guest === "You" ? "Your" : guest + "'s"} ${pName(key)}`, `${guest === "You" ? "Your" : guest + "'s"} ${pName(key)} is in ${SIGNS[gp.sign].name}, so it arrives in this house ${SIGNS[gp.sign].how}.`, PLANETS[key].color);
    const contacts = Y.list.map((x, i) => [x, i]).filter(([x]) => (inMine ? x.b : x.a) === key);
    if (contacts.length) html += `<h4>Contacts it makes</h4><div class="list">` + contacts.map(([x, i]) => { const X = ASPECTS[x.type]; return `<button class="row" data-open="syn:${i}"><span class="dot" style="color:${X.color}"></span><span class="main"><div class="title">${esc(pShort(x.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(x.b))}</div><div class="sub">${esc(X.name)}</div></span><span class="end"><div class="pos">${orbStr(x.orb)}</div></span></button>`; }).join("") + `</div>`;
    return html;
  }
  function sheetSynScore(cat) {
    const Y = computeSyn();
    const S = D().synastry || {};
    const m = CAT_META[cat];
    let html = `<section class="hero"><div class="eyebrow">Synastry · compatibility</div><h2 class="display">${esc(m.name)}</h2><div class="subline"><strong>${Y.scores[cat]}%</strong></div></section>`;
    html += paras([S.categories && S.categories[cat], cat === "challenge" ? "A higher score means more friction between you. Some friction keeps a relationship alive; a lot asks both of you to work at it on purpose." : "Your score grows with the number and closeness of supportive contacts between your charts in this area. Tense contacts count for less, but they still count: they are part of what binds you together."]);
    const idx = Y.members[cat];
    if (idx.length) {
      html += `<h4>Contacts in this area</h4><div class="list">` + idx.map((i) => {
        const x = Y.list[i], X = ASPECTS[x.type];
        return `<button class="row" data-open="syn:${i}"><span class="dot" style="color:${X.color}"></span>
          <span class="main"><div class="title">${esc(pShort(x.a))} <span class="sym" style="color:${X.color};font-size:.85em">${X.glyph}</span> ${esc(pShort(x.b))}</div><div class="sub">${esc(X.name)}</div></span>
          <span class="end"><div class="pos">${orbStr(x.orb)}</div></span></button>`;
      }).join("") + `</div>`;
      const top = Y.list[idx.slice().sort((i, j) => Y.list[i].orb - Y.list[j].orb)[0]];
      const pd = (D().synPairsRich || {})[pairKey(top.a, top.b)] || ((D().synastry || {}).pairs || {})[pairKey(top.a, top.b)];
      if (pd) html += sec(`Strongest here: ${pName(top.a)} ${ASPECTS[top.type].name.toLowerCase()} ${pName(top.b)}`, [firstPara(pd.text), top.type === "conjunction" ? pd.fusion : top.nature === "harmony" ? pd.harmony : pd.tension]);
    } else html += `<p class="note" style="text-align:left">No close contacts in this area.</p>`;
    return html;
  }

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
        ${opt("houseSystem", "topocentric", "Topocentric", "Polich-Page · close to Placidus")}
        ${opt("houseSystem", "campanus", "Campanus", "Prime vertical divisions")}
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
        ${opt("minorAspects", "false", "Major only", "Astro-Seek default · conjunction, opposition, trine, square, sextile")}
        ${opt("minorAspects", "true", "Major + minor", "Adds quincunx, semi-sextile, quintiles…")}
      </div>
      <h4>Asteroids</h4><div class="opt-list">
        ${opt("asteroids", "true", "Show", "Ceres, Pallas, Juno and Vesta")}
        ${opt("asteroids", "false", "Hide", "Planets and main points only")}
      </div>
      <h4>Orbs</h4><div class="opt-list">
        ${opt("orbScale", "0.75", "Tight", "×0.75")}
        ${opt("orbScale", "1", "Standard", "As Astro-Seek · 7°, or 10° with Sun or Moon · sextile 5° (6°)")}
        ${opt("orbScale", "1.25", "Wide", "×1.25")}
      </div>`;
    openSheet(html);
  }

  function applySetting(group, val) {
    let v = val;
    if (group === "minorAspects" || group === "asteroids") v = val === "true";
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
    let html = state.partnerMode ? `<section class="hero">
      <h1 class="display brand">Add a person</h1>
      <div class="subline brand-sub">For synastry with ${esc(myName())}</div>
    </section>` : `<section class="hero">
      <h1 class="display brand">Natal Chart</h1>
      <div class="subline brand-sub">Your sky, at birth</div>
      <div class="meta">planets · houses · nodes · aspects · karma</div>
    </section>`;
    html += `
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
    if (state.partnerMode) return html + `<div class="chips"><button class="chip" data-act="cancelpartner">Cancel</button></div>`;
    html += `<p class="learn-link"><a href="${window.NATAL_EMBED ? "https://niko-999.github.io/natal/learn/" : "learn/"}">New to astrology? Learn how to read a chart</a></p>`;
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
            name: r.name, region: [r.admin1, r.country].filter(Boolean).join(", "), lat: toMinute(r.latitude), lon: toMinute(r.longitude), tz: r.timezone,
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
      if (state.partnerMode) {
        try { compute(rec); } catch (e2) { err.textContent = "Could not calculate this chart. Check the date, time and place."; return; }
        // keep the current chart first in the saved list, and add the new person
        state.saved = [state.record].concat(state.saved, [rec]).filter((s, i, arr) => arr.findIndex((z) => z.id === s.id) === i).slice(0, 30);
        store.set("saved", state.saved);
        state.partnerId = rec.id;
        store.set("partner", rec.id);
        state.partnerMode = false;
        setTab("synastry");
        return;
      }
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
    const wheel = view.querySelector("#wheel-wrap .wheel");
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
    if ($("#prog-timeline")) setTimeout(fillProgTimeline, 30);
    const pd = $("#p-date");
    if (pd) pd.addEventListener("change", () => {
      if (!pd.value) return;
      const [y, m, dd] = pd.value.split("-").map(Number);
      state.progDate = new Date(y, m - 1, dd, 12).toDateString() === new Date().toDateString() ? null : new Date(y, m - 1, dd, 12).getTime();
      render();
    });
    const sp = $("#sr-place");
    if (sp) sp.addEventListener("change", () => {
      if (!sp.value) state.srPlace = null;
      else {
        const [lat, lon] = sp.value.split(",").map(Number);
        const ct = window.ASTRO_CITIES.find((x) => x[2] === lat && x[3] === lon);
        state.srPlace = { name: ct[0], region: ct[1], lat, lon, tz: ct[4] };
      }
      render();
    });
    if (state.tab === "today") {
      if ((state.transitRange || "day") === "day") fillTransitWindows();
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
      if (a === "pnow") { state.progDate = null; render(); }
      if (a === "pprev" || a === "pnext") { const t = progTarget(); state.progDate = new Date(t.getFullYear() + (a === "pnext" ? 1 : -1), t.getMonth(), t.getDate(), 12).getTime(); render(); }
      if (a === "srnow") { state.srYear = null; render(); }
      if (a === "srprev" || a === "srnext") { state.srYear = computeSR().year + (a === "srnext" ? 1 : -1); render(); }
      if (a.startsWith("partner:")) { state.partnerId = a.slice(8); store.set("partner", state.partnerId); render(); }
      if (a === "changepartner") { state.partnerId = null; render(); }
      if (a === "addpartner") { state.partnerMode = true; state.editing = null; closeSheet(); render(); window.scrollTo({ top: 0 }); }
      if (a === "cancelpartner") { state.partnerMode = false; render(); }
      if (a === "tnow") { state.transitDate = null; state._nowPin = null; render(); }
      if (a.startsWith("trange:")) { state.transitRange = a.slice(7); store.set("trange", state.transitRange); render(); }
      if (a.startsWith("tday:")) {
        const [y, m, dd] = a.slice(5).split("-").map(Number);
        const now = new Date();
        state.transitRange = "day"; store.set("trange", "day");
        state.transitDate = (y === now.getFullYear() && m === now.getMonth() + 1 && dd === now.getDate()) ? null : new Date(y, m - 1, dd, 12, 0).getTime();
        state._nowPin = null;
        closeSheet();
        render();
        window.scrollTo({ top: 0 });
      }
      if (a === "tprev" || a === "tnext") {
        const base = transitDate(), dir = a === "tnext" ? 1 : -1, r = state.transitRange || "day";
        const dd = r === "month" ? new Date(base.getFullYear(), base.getMonth() + dir, 1, 12, 0)
          : new Date(base.getFullYear(), base.getMonth(), base.getDate() + dir * (r === "week" ? 7 : 1), 12, 0);
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
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || reloaded) return; // first install: nothing old to replace
      reloaded = true;
      location.reload();
    });
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").then((reg) => {
      document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update().catch(() => {}); });
    }).catch(() => {}));
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
