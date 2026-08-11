/**
 * market-gen.js — seeded procedural OHLC generation for framework patterns.
 * Zero dependencies. ES module.
 *
 * Public API:
 *   mulberry32(seed) -> () => float [0,1)
 *   generateCandles({seed, count, tf, start, base, vol, drift}) -> candles
 *   generatePattern(patternType, opts?) -> {candles, annotations, meta, smtCandles?}
 *     patternType: 'swingPoint' | 'cisd' | 'fvg' | 'londonReversal' | 'nyReversal'
 *       | 'protectedSwing' | 'largeOpposingRun' | 'continuation' | 'smt'
 *     opts: { seed?: number, direction?: 'bullish'|'bearish', tf?: minutes }
 *   PATTERN_TYPES — array of all pattern type strings
 *
 * Candle shape: {t (minutes since 18:00 NY), o, h, l, c}
 * annotations are ready to feed to ChartEngine.addAnnotation.
 * meta contains ground-truth answers (indices, bounds, levels) per pattern.
 */

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* gaussian-ish via sum of uniforms */
function gauss(rng) {
  return (rng() + rng() + rng() + rng() - 2) / 2;
}

/**
 * Core random-walk builder. Segments let patterns script phases.
 * segment: {bars, drift (per-bar price bias), vol, wickBias? (-1..1: -1 = long lower wicks)}
 */
function buildWalk(rng, { start = 0, tf = 15, base = 100, segments }) {
  const candles = [];
  let price = base;
  let t = start;
  for (const seg of segments) {
    for (let i = 0; i < seg.bars; i++) {
      const vol = seg.vol * (0.6 + 0.8 * rng());
      const body = seg.drift + gauss(rng) * vol;
      const o = price;
      const c = o + body;
      const wickBias = seg.wickBias || 0;
      const upWick = Math.abs(gauss(rng)) * vol * (0.7 - 0.45 * wickBias);
      const dnWick = Math.abs(gauss(rng)) * vol * (0.7 + 0.45 * wickBias);
      const h = Math.max(o, c) + upWick;
      const l = Math.min(o, c) - dnWick;
      candles.push({ t, o: r2(o), h: r2(h), l: r2(l), c: r2(c) });
      price = c;
      t += tf;
    }
  }
  return candles;
}

function r2(x) { return Math.round(x * 100) / 100; }

/* force a candle to specific shape while keeping continuity */
function shape(candles, i, fn) {
  const c = candles[i];
  fn(c);
  c.o = r2(c.o); c.h = r2(Math.max(c.h, c.o, c.c)); c.l = r2(Math.min(c.l, c.o, c.c)); c.c = r2(c.c);
  // re-chain opens after i
  for (let j = i + 1; j < candles.length; j++) {
    const gap = candles[j].o - candles[j - 1].c;
    if (Math.abs(gap) > 0.001) {
      const d = candles[j - 1].c - candles[j].o;
      candles[j].o = r2(candles[j].o + d);
      candles[j].h = r2(candles[j].h + d);
      candles[j].l = r2(candles[j].l + d);
      candles[j].c = r2(candles[j].c + d);
    } else break;
  }
}

function hiOf(candles, a, b) { let m = -Infinity, idx = a; for (let i = a; i <= b; i++) if (candles[i].h > m) { m = candles[i].h; idx = i; } return { price: m, index: idx }; }
function loOf(candles, a, b) { let m = Infinity, idx = a; for (let i = a; i <= b; i++) if (candles[i].l < m) { m = candles[i].l; idx = i; } return { price: m, index: idx }; }

/* mirror a candle array vertically around its mean (for bearish variants) */
function mirror(candles) {
  let lo = Infinity, hi = -Infinity;
  for (const c of candles) { lo = Math.min(lo, c.l); hi = Math.max(hi, c.h); }
  const mid = (lo + hi) / 2;
  return candles.map((c) => ({
    t: c.t,
    o: r2(2 * mid - c.o),
    h: r2(2 * mid - c.l),
    l: r2(2 * mid - c.h),
    c: r2(2 * mid - c.c),
  }));
}

export const PATTERN_TYPES = [
  'swingPoint', 'cisd', 'fvg', 'londonReversal', 'nyReversal',
  'protectedSwing', 'largeOpposingRun', 'continuation', 'smt',
];

export function generateCandles(opts = {}) {
  const rng = mulberry32(opts.seed ?? 1);
  return buildWalk(rng, {
    start: opts.start ?? 0, tf: opts.tf ?? 15, base: opts.base ?? 100,
    segments: [{ bars: opts.count ?? 60, drift: opts.drift ?? 0, vol: opts.vol ?? 0.4 }],
  });
}

export function generatePattern(patternType, opts = {}) {
  const seed = opts.seed ?? Math.floor(Math.random() * 2 ** 31);
  const rng = mulberry32(seed);
  const tf = opts.tf ?? 15;
  const dir = opts.direction || (rng() < 0.5 ? 'bullish' : 'bearish');
  const gen = GENERATORS[patternType];
  if (!gen) throw new Error(`Unknown pattern type: ${patternType}`);
  const result = gen(rng, tf, dir, opts);
  result.meta = { ...result.meta, patternType, seed, direction: dir };
  return result;
}

/* -------- pattern generators (all built bullish, mirrored for bearish) -------- */

const GENERATORS = {

  /** Swing low: C1 down, C2 takes out prior low (long lower wick), C3 reverses up. */
  swingPoint(rng, tf, dir) {
    const start = 840; // NY session context, 8:00
    let candles = buildWalk(rng, {
      start, tf, base: 100,
      segments: [
        { bars: 8, drift: -0.22, vol: 0.35, wickBias: 0 },   // decline into the low
        { bars: 3, drift: -0.15, vol: 0.3 },                 // C1..C3 placeholders
        { bars: 10, drift: 0.34, vol: 0.4, wickBias: -0.3 }, // reversal expansion
      ],
    });
    const c1 = 8, c2 = 9, c3 = 10;
    const priorLow = loOf(candles, 0, c1).price;
    shape(candles, c1, (c) => { c.c = c.o - 0.35; c.l = c.c - 0.2; c.h = c.o + 0.15; });
    shape(candles, c2, (c) => { // sweep prior low with a wick, close back inside
      c.l = priorLow - 0.55;
      c.c = c.o - 0.05;
      c.h = c.o + 0.12;
    });
    shape(candles, c3, (c) => { c.c = c.o + 0.6; c.h = c.c + 0.1; c.l = c.o - 0.12; });
    let annotations = [
      { type: 'swingLabel', index: c1, price: candles[c1].l, text: 'C1', dir: 'down' },
      { type: 'swingLabel', index: c2, price: candles[c2].l, text: 'C2', dir: 'down', color: '#f0b45a' },
      { type: 'swingLabel', index: c3, price: candles[c3].l, text: 'C3', dir: 'down' },
      { type: 'levelLine', price: priorLow, i2: c2, label: 'Prior low' },
    ];
    let meta = { c1Index: c1, c2Index: c2, c3Index: c3, sweptLevel: priorLow, swingType: 'low' };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** CISD: run of opposing (bearish) close candles, then closure through their opens. */
  cisd(rng, tf, dir) {
    const start = 840;
    let candles = buildWalk(rng, {
      start, tf, base: 100,
      segments: [
        { bars: 6, drift: 0.1, vol: 0.3 },
        { bars: 5, drift: -0.3, vol: 0.25, wickBias: 0.2 }, // opposing bearish series
        { bars: 1, drift: 0.9, vol: 0.2 },                  // CISD candle
        { bars: 8, drift: 0.32, vol: 0.35, wickBias: -0.3 },
      ],
    });
    const seriesStart = 6, seriesEnd = 10, cisdIndex = 11;
    for (let i = seriesStart; i <= seriesEnd; i++) {
      shape(candles, i, (c) => { if (c.c >= c.o) { c.c = c.o - (0.15 + rng() * 0.25); c.l = Math.min(c.l, c.c - 0.1); } });
    }
    const cisdLevel = candles[seriesStart].o; // open of first opposing candle
    shape(candles, cisdIndex, (c) => { c.c = cisdLevel + 0.4; c.h = c.c + 0.12; c.l = c.o - 0.1; });
    let annotations = [
      { type: 'levelLine', price: cisdLevel, i1: seriesStart, label: 'CISD level' },
      { type: 'textMarker', index: cisdIndex, price: candles[cisdIndex].h, text: 'CISD ✓', dir: 'up', color: '#2dd4a7' },
      { type: 'zone', i1: seriesStart, i2: seriesEnd, p1: hiOf(candles, seriesStart, seriesEnd).price, p2: loOf(candles, seriesStart, seriesEnd).price, label: 'Opposing closes' },
    ];
    let meta = { seriesStart, seriesEnd, cisdIndex, cisdLevel };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** FVG: impulsive candle leaving a gap between candle A high and candle C low. */
  fvg(rng, tf, dir) {
    const start = 840;
    let candles = buildWalk(rng, {
      start, tf, base: 100,
      segments: [
        { bars: 9, drift: -0.12, vol: 0.3 },
        { bars: 1, drift: 1.6, vol: 0.1 },  // displacement
        { bars: 6, drift: 0.25, vol: 0.3, wickBias: -0.2 },
        { bars: 5, drift: -0.18, vol: 0.25 }, // retrace toward FVG
      ],
    });
    const a = 8, b = 9, cIdx = 10;
    shape(candles, b, (c) => { c.c = c.o + 1.7; c.h = c.c + 0.15; c.l = c.o - 0.08; });
    // ensure gap: candle c low above candle a high
    const gapLo = candles[a].h;
    shape(candles, cIdx, (c) => {
      const need = gapLo + 0.5 - c.l;
      if (need > 0) { c.o += need; c.c += need; c.h += need; c.l += need; }
    });
    const gapHi = candles[cIdx].l;
    let annotations = [
      { type: 'fvg', i1: b, i2: candles.length - 1, p1: gapLo, p2: gapHi, label: 'FVG' },
    ];
    let meta = { fvgIndex: b, fvgLow: gapLo, fvgHigh: gapHi, displacementIndex: b };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** London reversal: Asia consolidation, 02:00 sweep of Asia low w/ wick, NY expansion. */
  londonReversal(rng, tf, dir) {
    let candles = buildWalk(rng, {
      start: 0, tf: 30, base: 100, // 30m bars to span the day nicely
      segments: [
        { bars: 16, drift: 0, vol: 0.16 },                    // Asia 18:00–02:00 consolidation
        { bars: 2, drift: -0.5, vol: 0.25, wickBias: -0.6 },  // 2am protraction down
        { bars: 2, drift: 0.35, vol: 0.3 },                   // reversal
        { bars: 12, drift: 0.42, vol: 0.4, wickBias: -0.3 },  // London→NY expansion
        { bars: 8, drift: 0.12, vol: 0.35 },
      ],
    });
    const asiaLow = loOf(candles, 0, 15).price;
    const sweepIndex = 17; // second 2am-hour candle sweeps
    shape(candles, sweepIndex, (c) => {
      c.l = asiaLow - 0.6; c.c = c.o + 0.1; c.h = Math.max(c.h, c.c + 0.1);
    });
    const lod = loOf(candles, 0, candles.length - 1);
    let annotations = [
      { type: 'levelLine', price: asiaLow, i2: sweepIndex, label: 'Asia low' },
      { type: 'textMarker', index: sweepIndex, price: candles[sweepIndex].l, text: '2AM sweep', dir: 'down', color: '#f0b45a' },
    ];
    let meta = {
      sweepIndex, asiaLow, lodIndex: lod.index, lodPrice: lod.price,
      hodLod4H: 2, // 3rd 4H candle of day (02:00 open) forms LOD
      reversalTime: '2:00 AM',
    };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** NY reversal at 6am or 10am: high/low of day not formed earlier; reversal at open. */
  nyReversal(rng, tf, dir, opts = {}) {
    const at10 = opts.hour === 10 || (opts.hour == null && rng() < 0.4);
    const revT = at10 ? 960 : 720; // minutes since 18:00
    const barsBefore = revT / 30;
    let candles = buildWalk(rng, {
      start: 0, tf: 30, base: 100,
      segments: [
        { bars: barsBefore - 3, drift: -0.16, vol: 0.28 },      // grind lower overnight
        { bars: 3, drift: -0.3, vol: 0.3, wickBias: -0.5 },     // final push into the time
        { bars: 3, drift: 0.4, vol: 0.3 },                      // reversal at 6/10am
        { bars: Math.max(6, 40 - barsBefore) , drift: 0.4, vol: 0.4, wickBias: -0.3 },
      ],
    });
    const revIndex = barsBefore; // first candle at reversal time
    const priorLo = loOf(candles, 0, revIndex - 1).price;
    shape(candles, revIndex, (c) => { c.l = priorLo - 0.45; c.c = c.o + 0.35; c.h = c.c + 0.1; });
    const lod = loOf(candles, 0, candles.length - 1);
    let annotations = [
      { type: 'textMarker', index: revIndex, price: candles[revIndex].l, text: (at10 ? '10AM' : '6AM') + ' reversal', dir: 'down', color: '#f0b45a' },
      { type: 'levelLine', price: priorLo, i2: revIndex, label: 'Overnight low' },
    ];
    let meta = {
      reversalIndex: revIndex, reversalTime: at10 ? '10:00 AM' : '6:00 AM',
      lodIndex: lod.index, lodPrice: lod.price,
      hodLod4H: at10 ? 4 : 3, // 4H candle (0-based of 18/22/02/06/10/14) forming LOD
    };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** Protected swing: opposing candle (OB) into key level; low never revisited. */
  protectedSwing(rng, tf, dir) {
    const start = 480;
    let candles = buildWalk(rng, {
      start, tf, base: 100,
      segments: [
        { bars: 7, drift: -0.28, vol: 0.3 },                  // decline into key level
        { bars: 1, drift: -0.4, vol: 0.2 },                   // OB candle at the low
        { bars: 2, drift: 0.5, vol: 0.25 },
        { bars: 14, drift: 0.3, vol: 0.38, wickBias: -0.35 }, // never revisits
      ],
    });
    const obIndex = 7;
    shape(candles, obIndex, (c) => { c.c = c.o - 0.45; c.l = c.c - 0.35; c.h = c.o + 0.1; });
    const swingLow = candles[obIndex].l;
    // enforce "not revisited"
    for (let i = obIndex + 1; i < candles.length; i++) {
      if (candles[i].l <= swingLow + 0.15) shape(candles, i, (c) => { const d = swingLow + 0.3 - c.l; c.l += d; if (c.o < c.l) c.o = c.l; if (c.c < c.l) c.c = c.l; });
    }
    let annotations = [
      { type: 'ob', i1: obIndex, i2: obIndex + 4, p1: candles[obIndex].o, p2: candles[obIndex].c, label: 'OB' },
      { type: 'levelLine', price: swingLow, i1: obIndex, label: 'Protected low', color: '#2dd4a7' },
      { type: 'textMarker', index: obIndex, price: swingLow, text: 'Protected swing', dir: 'down', color: '#2dd4a7' },
    ];
    let meta = { obIndex, protectedLevel: swingLow, protected: true };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** Large opposing run: big opposing wick — negative condition, signals reversal/indecision. */
  largeOpposingRun(rng, tf, dir) {
    const start = 840;
    let candles = buildWalk(rng, {
      start, tf, base: 100,
      segments: [
        { bars: 10, drift: 0.22, vol: 0.32, wickBias: -0.2 }, // clean uptrend
        { bars: 1, drift: 0, vol: 0.2 },                      // the large opposing run candle
        { bars: 9, drift: -0.3, vol: 0.35, wickBias: 0.3 },   // failure / reversal
      ],
    });
    const runIndex = 10;
    shape(candles, runIndex, (c) => {
      c.h = c.o + 1.4;  // opens, runs far up (large opposing wick for the coming bear leg)
      c.c = c.o + 0.05; // closes back near open — indecision
      c.l = c.o - 0.2;
    });
    let annotations = [
      { type: 'textMarker', index: runIndex, price: candles[runIndex].h, text: 'Large opposing run', dir: 'up', color: '#f4506c' },
      { type: 'zone', i1: runIndex, i2: runIndex, p1: candles[runIndex].h, p2: Math.max(candles[runIndex].o, candles[runIndex].c), color: 'rgba(244,80,108,0.12)' },
    ];
    let meta = { runIndex, wickHigh: candles[runIndex].h, verdict: 'negative-condition' };
    if (dir === 'bearish') ({ candles, annotations, meta } = flip(candles, annotations, meta));
    return { candles, annotations, meta };
  },

  /** Continuation: swing point completes, entry on 3rd candle — small wick → large body. */
  continuation(rng, tf, dir) {
    const base = GENERATORS.swingPoint(rng, tf, 'bullish');
    const { candles } = base;
    const c3 = base.meta.c3Index;
    const entryIndex = c3;
    let annotations = base.annotations.concat([
      { type: 'levelLine', price: candles[c3].o, i1: c3, label: 'Entry — 3rd candle', color: '#2dd4a7' },
      { type: 'textMarker', index: c3, price: candles[c3].h, text: 'Small wick → large body', dir: 'up', color: '#2dd4a7' },
    ]);
    let meta = { ...base.meta, entryIndex, entryPrice: candles[c3].o, stop: candles[base.meta.c2Index].l };
    let out = { candles, annotations, meta };
    if (dir === 'bearish') out = (({ candles, annotations, meta }) => ({ ...flip(candles, annotations, meta) }))(out);
    return out;
  },

  /** SMT divergence: main sweeps its low; correlated symbol fails to make new low. */
  smt(rng, tf, dir) {
    const main = GENERATORS.swingPoint(rng, tf, 'bullish');
    const { candles } = main;
    const c2 = main.meta.c2Index;
    // correlated series: same shape but C2 does NOT take the prior low
    const rng2 = mulberry32((Math.floor(rng() * 2 ** 31) ^ 0x9e3779b9) >>> 0);
    let smtCandles = candles.map((c) => {
      const j = 0.06 * gauss(rng2);
      return { t: c.t, o: r2(c.o * (1 + j * 0.01) + j), h: r2(c.h + j + Math.abs(gauss(rng2)) * 0.05), l: r2(c.l + j), c: r2(c.c + j) };
    });
    const priorLow2 = loOf(smtCandles, 0, main.meta.c1Index).price;
    // lift correlated C2 low so it fails the sweep
    const cc = smtCandles[c2];
    const lift = priorLow2 + 0.3 - cc.l;
    if (lift > 0) { cc.l = r2(cc.l + lift); if (cc.o < cc.l) cc.o = cc.l; if (cc.c < cc.l) cc.c = cc.l; }
    let annotations = main.annotations.concat([
      { type: 'smt', index: c2, text: 'SMT' },
    ]);
    let meta = { ...main.meta, smtIndex: c2, divergence: 'correlated symbol failed to sweep the low' };
    if (dir === 'bearish') {
      const f = flip(candles, annotations, meta);
      smtCandles = mirror(smtCandles);
      return { candles: f.candles, annotations: f.annotations, meta: f.meta, smtCandles };
    }
    return { candles, annotations, meta, smtCandles };
  },
};

/* mirror candles + remap annotation prices for bearish variants */
function flip(candles, annotations, meta) {
  let lo = Infinity, hi = -Infinity;
  for (const c of candles) { lo = Math.min(lo, c.l); hi = Math.max(hi, c.h); }
  const mid = (lo + hi) / 2;
  const m = (p) => r2(2 * mid - p);
  const flipped = mirror(candles);
  const ann = annotations.map((a) => {
    const b = { ...a };
    if (b.price != null) b.price = m(b.price);
    if (b.p1 != null) b.p1 = m(b.p1);
    if (b.p2 != null) b.p2 = m(b.p2);
    if (b.dir === 'up') b.dir = 'down'; else if (b.dir === 'down') b.dir = 'up';
    if (typeof b.label === 'string') b.label = b.label.replace(/low/gi, 'high').replace(/Low/g, 'High');
    if (typeof b.text === 'string') b.text = b.text.replace(/low/gi, 'high');
    return b;
  });
  const mt = { ...meta };
  for (const k of ['sweptLevel', 'cisdLevel', 'fvgLow', 'fvgHigh', 'asiaLow', 'lodPrice', 'protectedLevel', 'wickHigh', 'entryPrice', 'stop']) {
    if (mt[k] != null) mt[k] = m(mt[k]);
  }
  if (mt.fvgLow != null && mt.fvgHigh != null && mt.fvgLow > mt.fvgHigh) {
    const tmp = mt.fvgLow; mt.fvgLow = mt.fvgHigh; mt.fvgHigh = tmp;
  }
  if (mt.swingType === 'low') mt.swingType = 'high';
  return { candles: flipped, annotations: ann, meta: mt };
}
