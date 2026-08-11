/**
 * chart-engine.js — canvas candlestick renderer for the trading game.
 * Zero dependencies. ES module.
 *
 * Public API:
 *   new ChartEngine(canvasEl, opts?)
 *     opts: {
 *       colors?: partial palette override,
 *       timeframeMinutes?: number (default 15),
 *       sessions?: boolean (default true)      — session shading + labels
 *       fourHourTicks?: boolean (default true) — vertical 4H boundary ticks
 *       crosshair?: boolean (default true),
 *       onCandleClick?: ({candleIndex, price, x, y}) => void,
 *       paddingRight?: px reserved for price axis (default 64),
 *       paddingBottom?: px reserved for time axis (default 26),
 *     }
 *   engine.setData(candles)             — [{t,o,h,l,c}] t = minutes since 18:00 NY
 *   engine.setSmtData(candles)          — enable second mini-panel with correlated symbol
 *   engine.addAnnotation(a) -> id       — see ANNOTATION TYPES below
 *   engine.removeAnnotation(id)
 *   engine.clearAnnotations()
 *   engine.revealUpTo(index)            — instantly show candles [0..index]
 *   engine.animateAppend() -> Promise   — reveal next candle with grow animation
 *   engine.revealAll()
 *   engine.markRegion(candleIndex, verdict) — 'correct' | 'incorrect' green/red pulse
 *   engine.setOnCandleClick(fn)
 *   engine.destroy()
 *
 * ANNOTATION TYPES (addAnnotation):
 *   {type:'fvg',       i1, i2, p1, p2, label?}          translucent box between candles
 *   {type:'ob',        i1, i2, p1, p2, label?}          order-block box (warm tint)
 *   {type:'zone',      i1, i2, p1, p2, color?, label?}  generic translucent zone
 *   {type:'levelLine', price, i1?, i2?, label?, color?} dashed horizontal level
 *   {type:'swingLabel',index, price, text, dir}         C1/C2/C3 label; dir 'up'|'down'
 *   {type:'textMarker',index, price, text, dir?}        floating text marker
 *   {type:'smt',       index, text?}                    divergence marker (both panels)
 */

const DEFAULT_COLORS = {
  bg: '#0b0f1a',
  panel: '#0d1220',
  grid: 'rgba(148, 163, 196, 0.07)',
  axisText: 'rgba(154, 167, 196, 0.85)',
  axisTextDim: 'rgba(154, 167, 196, 0.5)',
  up: '#2dd4a7',
  upDim: 'rgba(45, 212, 167, 0.55)',
  down: '#f4506c',
  downDim: 'rgba(244, 80, 108, 0.55)',
  wickUp: 'rgba(45, 212, 167, 0.9)',
  wickDown: 'rgba(244, 80, 108, 0.9)',
  crosshair: 'rgba(154, 167, 196, 0.45)',
  chipBg: 'rgba(13, 18, 32, 0.92)',
  chipBorder: 'rgba(120, 140, 190, 0.25)',
  chipText: '#dbe2f0',
  sessionAsia: 'rgba(96, 125, 235, 0.045)',
  sessionLondon: 'rgba(45, 212, 167, 0.04)',
  sessionNY: 'rgba(240, 180, 90, 0.04)',
  sessionLabel: 'rgba(154, 167, 196, 0.35)',
  fourHTick: 'rgba(148, 163, 196, 0.18)',
  fvg: 'rgba(96, 125, 235, 0.16)',
  fvgBorder: 'rgba(120, 148, 255, 0.45)',
  ob: 'rgba(240, 180, 90, 0.14)',
  obBorder: 'rgba(240, 180, 90, 0.45)',
  zone: 'rgba(148, 163, 196, 0.10)',
  level: 'rgba(154, 190, 255, 0.75)',
  label: '#c7d2ea',
  smt: '#f0b45a',
  correct: 'rgba(45, 212, 167, 1)',
  incorrect: 'rgba(244, 80, 108, 1)',
  hover: 'rgba(154, 167, 196, 0.08)',
};

const SESSIONS = [
  { name: 'ASIA', start: 0, end: 480, key: 'sessionAsia' },       // 18:00–02:00
  { name: 'LONDON', start: 480, end: 840, key: 'sessionLondon' }, // 02:00–08:00
  { name: 'NEW YORK', start: 840, end: 1320, key: 'sessionNY' },  // 08:00–16:00
];
const FOUR_H_BOUNDARIES = [0, 240, 480, 720, 960, 1200]; // 18,22,02,06,10,14

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function minutesToClock(t) {
  // t = minutes since 18:00 NY
  const total = (18 * 60 + t) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  const hh = ((h + 11) % 12) + 1;
  const ap = h < 12 ? 'AM' : 'PM';
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
}

function niceStep(range, targetTicks) {
  const raw = range / Math.max(1, targetTicks);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (raw <= m * mag) return m * mag;
  }
  return 10 * mag;
}

function prefersReducedMotion() {
  return typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let _annId = 1;

export class ChartEngine {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.colors = { ...DEFAULT_COLORS, ...(opts.colors || {}) };
    this.opts = {
      timeframeMinutes: 15,
      sessions: true,
      fourHourTicks: true,
      crosshair: true,
      paddingRight: 64,
      paddingBottom: 26,
      paddingTop: 10,
      ...opts,
    };
    this.candles = [];
    this.smtCandles = null;
    this.annotations = [];
    this.revealCount = Infinity;
    this.onCandleClick = opts.onCandleClick || null;

    this._pointer = null;       // {x, y} in css px
    this._hoverIndex = -1;
    this._labelRects = [];      // occupied label boxes for the collision pass
    this._pulses = [];          // {index, verdict, start}
    this._appendAnim = null;    // {index, start, resolve}
    this._raf = 0;
    this._dpr = 1;
    this._w = 0; this._h = 0;

    this._onMove = (e) => this._handleMove(e);
    this._onLeave = () => { this._pointer = null; this._hoverIndex = -1; this._schedule(); };
    this._onClick = (e) => this._handleClick(e);
    canvas.addEventListener('pointermove', this._onMove);
    canvas.addEventListener('pointerleave', this._onLeave);
    canvas.addEventListener('pointerdown', this._onClick);
    canvas.style.touchAction = 'pan-y';
    canvas.style.cursor = 'crosshair';

    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(canvas.parentElement || canvas);
    this._resize();
  }

  /* ---------------- public ---------------- */

  setData(candles) {
    this.candles = candles || [];
    this.revealCount = this.candles.length;
    this._pulses = [];
    this._schedule();
  }

  setSmtData(candles) {
    this.smtCandles = candles || null;
    this._resize(); // layout changes
  }

  addAnnotation(a) {
    const id = _annId++;
    this.annotations.push({ id, ...a });
    this._schedule();
    return id;
  }

  removeAnnotation(id) {
    this.annotations = this.annotations.filter((a) => a.id !== id);
    this._schedule();
  }

  clearAnnotations() {
    this.annotations = [];
    this._schedule();
  }

  revealUpTo(index) {
    this.revealCount = Math.max(0, Math.min(this.candles.length, index + 1));
    this._schedule();
  }

  revealAll() {
    this.revealCount = this.candles.length;
    this._schedule();
  }

  animateAppend() {
    if (this.revealCount >= this.candles.length) return Promise.resolve(false);
    const index = this.revealCount;
    this.revealCount = index + 1;
    if (prefersReducedMotion()) { this._schedule(); return Promise.resolve(true); }
    return new Promise((resolve) => {
      this._appendAnim = { index, start: performance.now(), dur: 260, resolve };
      this._schedule();
    });
  }

  markRegion(candleIndex, verdict) {
    this._pulses.push({ index: candleIndex, verdict, start: performance.now() });
    this._schedule();
  }

  setOnCandleClick(fn) { this.onCandleClick = fn; }

  destroy() {
    this._ro.disconnect();
    this.canvas.removeEventListener('pointermove', this._onMove);
    this.canvas.removeEventListener('pointerleave', this._onLeave);
    this.canvas.removeEventListener('pointerdown', this._onClick);
    cancelAnimationFrame(this._raf);
  }

  /* ---------------- layout & coords ---------------- */

  _resize() {
    const parent = this.canvas.parentElement || this.canvas;
    // clientWidth/Height exclude the parent's border, so sizing the canvas to
    // them can never feed back into the parent's own layout.
    const rect = parent.getBoundingClientRect();
    const w = Math.max(120, parent.clientWidth || rect.width);
    const h = Math.max(120, parent.clientHeight || rect.height || 360);
    this._dpr = Math.max(1, window.devicePixelRatio || 1);
    this._w = w; this._h = h;
    this.canvas.width = Math.round(w * this._dpr);
    this.canvas.height = Math.round(h * this._dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this._schedule();
  }

  _layout() {
    const { paddingRight, paddingBottom, paddingTop } = this.opts;
    // The correlated-symbol pane needs real height to compare highs/lows:
    // at least 120px, but never more than 42% of the panel.
    const smtH = this.smtCandles
      ? Math.min(Math.round(this._h * 0.42), Math.max(120, Math.round(this._h * 0.26)))
      : 0;
    return {
      x0: 8,
      x1: this._w - paddingRight,
      y0: paddingTop,
      y1: this._h - paddingBottom - smtH,
      smtY0: this._h - paddingBottom - smtH + 8,
      smtY1: this._h - paddingBottom,
      smtH,
    };
  }

  _visible() {
    return this.candles.slice(0, Math.min(this.revealCount, this.candles.length));
  }

  _priceRange(candles) {
    let lo = Infinity, hi = -Infinity;
    for (const c of candles) { if (c.l < lo) lo = c.l; if (c.h > hi) hi = c.h; }
    for (const a of this.annotations) {
      if (a.type === 'levelLine' && a.price != null) {
        if (a.price < lo) lo = a.price; if (a.price > hi) hi = a.price;
      }
    }
    if (!isFinite(lo)) { lo = 0; hi = 1; }
    const pad = (hi - lo) * 0.08 || 1;
    return { lo: lo - pad, hi: hi + pad };
  }

  _xForIndex(i, L) {
    const n = Math.max(1, this.candles.length);
    const slot = (L.x1 - L.x0) / n;
    return L.x0 + slot * i + slot / 2;
  }

  _slotW(L) {
    const n = Math.max(1, this.candles.length);
    return (L.x1 - L.x0) / n;
  }

  _yForPrice(p, L, range) {
    return L.y0 + (range.hi - p) / (range.hi - range.lo) * (L.y1 - L.y0);
  }

  _priceForY(y, L, range) {
    return range.hi - (y - L.y0) / (L.y1 - L.y0) * (range.hi - range.lo);
  }

  _indexForX(x, L) {
    const slot = this._slotW(L);
    const i = Math.floor((x - L.x0) / slot);
    return Math.max(0, Math.min(this._visible().length - 1, i));
  }

  /* ---------------- events ---------------- */

  _handleMove(e) {
    const r = this.canvas.getBoundingClientRect();
    this._pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    const L = this._layout();
    this._hoverIndex = this._visible().length ? this._indexForX(this._pointer.x, L) : -1;
    this._schedule();
  }

  _handleClick(e) {
    if (!this.onCandleClick || !this._visible().length) return;
    const r = this.canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const L = this._layout();
    if (x > L.x1 || y > L.y1) return;
    const range = this._priceRange(this._visible());
    this.onCandleClick({
      candleIndex: this._indexForX(x, L),
      price: this._priceForY(y, L, range),
      x, y,
    });
  }

  /* ---------------- render ---------------- */

  _schedule() {
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => this._draw());
  }

  /**
   * Collision pass for text labels: reserve a box, shifting it vertically
   * (dir -1 up, +1 down, 0 alternate) until it no longer intersects a box
   * already drawn this frame. Returns the final box.
   */
  _reserveLabel(x, y, w, h, dir = 0) {
    const hits = (r) => this._labelRects.some((o) =>
      r.x < o.x + o.w + 2 && r.x + r.w + 2 > o.x &&
      r.y < o.y + o.h + 2 && r.y + r.h + 2 > o.y);
    let rect = { x, y, w, h };
    const step = h + 4;
    for (let t = 1; hits(rect) && t <= 6; t++) {
      const delta = dir !== 0
        ? dir * step * t
        : (t % 2 ? -1 : 1) * step * Math.ceil(t / 2);
      rect = { x, y: y + delta, w, h };
    }
    this._labelRects.push(rect);
    return rect;
  }

  _draw() {
    const ctx = this.ctx;
    const dpr = this._dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this._w, this._h);
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this._w, this._h);

    const vis = this._visible();
    const L = this._layout();
    if (!vis.length) return;
    const range = this._priceRange(vis);
    this._labelRects = [];

    this._drawSessions(ctx, L);
    this._drawGrid(ctx, L, range);
    if (this.opts.fourHourTicks) this._drawFourHTicks(ctx, L);
    this._drawAnnotationsUnder(ctx, L, range);
    this._drawCandles(ctx, L, range, vis, this.candles.length);
    this._drawAnnotationsOver(ctx, L, range);
    this._drawPulses(ctx, L, range);
    if (this.smtCandles) this._drawSmtPanel(ctx, L);
    this._drawTimeAxis(ctx, L);
    if (this.opts.crosshair && this._pointer) this._drawCrosshair(ctx, L, range, vis);

    // continue animating pulses / append
    const now = performance.now();
    let more = false;
    this._pulses = this._pulses.filter((p) => now - p.start < 900);
    if (this._pulses.length) more = true;
    if (this._appendAnim) {
      if (now - this._appendAnim.start >= this._appendAnim.dur) {
        this._appendAnim.resolve(true);
        this._appendAnim = null;
      } else more = true;
    }
    if (more) this._schedule();
  }

  _drawSessions(ctx, L) {
    if (!this.opts.sessions || !this.candles.length) return;
    const tf = this.opts.timeframeMinutes;
    const t0 = this.candles[0].t;
    const tEnd = this.candles[this.candles.length - 1].t + tf;
    const span = tEnd - t0;
    const xForT = (t) => L.x0 + ((t - t0) / span) * (L.x1 - L.x0);
    ctx.textBaseline = 'top';
    ctx.font = `600 10px ${FONT}`;
    for (const s of SESSIONS) {
      // sessions can repeat across multi-day; handle single day window
      const a = Math.max(s.start, t0), b = Math.min(s.end, tEnd);
      if (b <= a) continue;
      const xa = xForT(a), xb = xForT(b);
      ctx.fillStyle = this.colors[s.key];
      ctx.fillRect(xa, L.y0, xb - xa, L.y1 - L.y0);
      ctx.fillStyle = this.colors.sessionLabel;
      const lx = Math.max(xa + 6, L.x0 + 4);
      ctx.fillText(s.name, lx, L.y0 + 4);
      this._labelRects.push({ x: lx, y: L.y0 + 4, w: ctx.measureText(s.name).width, h: 10 });
    }
  }

  _drawFourHTicks(ctx, L) {
    if (!this.candles.length) return;
    const tf = this.opts.timeframeMinutes;
    const t0 = this.candles[0].t;
    const tEnd = this.candles[this.candles.length - 1].t + tf;
    const span = tEnd - t0;
    ctx.strokeStyle = this.colors.fourHTick;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    for (const b of FOUR_H_BOUNDARIES) {
      if (b < t0 || b > tEnd) continue;
      const x = Math.round(L.x0 + ((b - t0) / span) * (L.x1 - L.x0)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, L.y0);
      ctx.lineTo(x, L.y1);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  _drawGrid(ctx, L, range) {
    const step = niceStep(range.hi - range.lo, 6);
    const first = Math.ceil(range.lo / step) * step;
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    ctx.font = `500 10.5px ${FONT}`;
    ctx.fillStyle = this.colors.axisText;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const dec = step < 0.01 ? 4 : step < 0.1 ? 3 : step < 1 ? 2 : step < 10 ? 1 : 0;
    for (let p = first; p <= range.hi; p += step) {
      const y = Math.round(this._yForPrice(p, L, range)) + 0.5;
      if (y < L.y0 || y > L.y1) continue;
      ctx.beginPath();
      ctx.moveTo(L.x0, y);
      ctx.lineTo(L.x1, y);
      ctx.stroke();
      ctx.fillText(p.toFixed(dec), L.x1 + 8, y);
    }
  }

  _drawTimeAxis(ctx, L) {
    if (!this.candles.length) return;
    const n = this.candles.length;
    // pick label every ~90px
    const slot = this._slotW(L);
    const every = Math.max(1, Math.round(80 / slot));
    ctx.font = `500 10px ${FONT}`;
    ctx.fillStyle = this.colors.axisTextDim;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let lastRight = -Infinity;
    for (let i = 0; i < n; i += every) {
      const txt = minutesToClock(this.candles[i].t);
      const tw = ctx.measureText(txt).width;
      // inset first/last ticks so labels never clip at the plot edges
      const x = Math.max(L.x0 + tw / 2 + 2,
        Math.min(this._xForIndex(i, L), L.x1 - tw / 2 - 2));
      if (x - tw / 2 < lastRight + 12) continue; // avoid tick-on-tick pileup
      ctx.fillText(txt, x, this._h - this.opts.paddingBottom + 8);
      lastRight = x + tw / 2;
    }
  }

  _drawCandles(ctx, L, range, vis, total) {
    const slot = this._slotW(L);
    const bw = Math.max(1.5, Math.min(13, slot * 0.62));
    const now = performance.now();
    for (let i = 0; i < vis.length; i++) {
      const c = vis[i];
      const x = this._xForIndex(i, L);
      let scale = 1;
      if (this._appendAnim && this._appendAnim.index === i) {
        const t = Math.min(1, (now - this._appendAnim.start) / this._appendAnim.dur);
        scale = 1 - Math.pow(1 - t, 3); // easeOutCubic
      }
      const up = c.c >= c.o;
      const mid = this._yForPrice((c.h + c.l) / 2, L, range);
      const yh = mid + (this._yForPrice(c.h, L, range) - mid) * scale;
      const yl = mid + (this._yForPrice(c.l, L, range) - mid) * scale;
      const yo = mid + (this._yForPrice(c.o, L, range) - mid) * scale;
      const yc = mid + (this._yForPrice(c.c, L, range) - mid) * scale;

      if (i === this._hoverIndex) {
        ctx.fillStyle = this.colors.hover;
        ctx.fillRect(x - slot / 2, L.y0, slot, L.y1 - L.y0);
      }
      ctx.strokeStyle = up ? this.colors.wickUp : this.colors.wickDown;
      ctx.lineWidth = Math.max(1, bw * 0.14);
      ctx.beginPath();
      ctx.moveTo(x, yh);
      ctx.lineTo(x, yl);
      ctx.stroke();

      const top = Math.min(yo, yc), bh = Math.max(1, Math.abs(yc - yo));
      ctx.fillStyle = up ? this.colors.up : this.colors.down;
      ctx.globalAlpha = scale < 1 ? 0.4 + 0.6 * scale : 1;
      ctx.fillRect(x - bw / 2, top, bw, bh);
      ctx.globalAlpha = 1;
    }
  }

  /* annotations drawn under candles: zones/boxes */
  _drawAnnotationsUnder(ctx, L, range) {
    for (const a of this.annotations) {
      if (a.type === 'fvg' || a.type === 'ob' || a.type === 'zone') {
        const slot = this._slotW(L);
        const xa = this._xForIndex(a.i1, L) - slot / 2;
        const xb = this._xForIndex(a.i2, L) + slot / 2;
        const ya = this._yForPrice(Math.max(a.p1, a.p2), L, range);
        const yb = this._yForPrice(Math.min(a.p1, a.p2), L, range);
        const fill = a.color || (a.type === 'fvg' ? this.colors.fvg : a.type === 'ob' ? this.colors.ob : this.colors.zone);
        const border = a.type === 'fvg' ? this.colors.fvgBorder : a.type === 'ob' ? this.colors.obBorder : 'rgba(148,163,196,0.3)';
        ctx.fillStyle = fill;
        ctx.fillRect(xa, ya, xb - xa, yb - ya);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(xa + 0.5, ya + 0.5, xb - xa - 1, yb - ya - 1);
        if (a.label) {
          ctx.font = `600 9.5px ${FONT}`;
          const tw = ctx.measureText(a.label).width;
          const lx = Math.max(L.x0 + 4, Math.min(xa + 4, L.x1 - tw - 4));
          const rect = this._reserveLabel(lx, ya - 14, tw, 11, -1);
          ctx.fillStyle = border;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(a.label, rect.x, rect.y);
        }
      }
    }
  }

  /* annotations drawn over candles: lines, labels, markers */
  _drawAnnotationsOver(ctx, L, range) {
    for (const a of this.annotations) {
      if (a.type === 'levelLine') {
        const y = Math.round(this._yForPrice(a.price, L, range)) + 0.5;
        const slot = this._slotW(L);
        const xa = a.i1 != null ? this._xForIndex(a.i1, L) - slot / 2 : L.x0;
        const xb = a.i2 != null ? this._xForIndex(a.i2, L) + slot / 2 : L.x1;
        ctx.strokeStyle = a.color || this.colors.level;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(xa, y);
        ctx.lineTo(xb, y);
        ctx.stroke();
        ctx.setLineDash([]);
        if (a.label) {
          // Price-tag pill at the RIGHT end of the line (next to the axis) —
          // keeps labels off the candles and out of the session headers.
          const col = a.color || this.colors.level;
          ctx.font = `600 10px ${FONT}`;
          const tw = ctx.measureText(a.label).width;
          const pw = tw + 12, ph = 16;
          const lx = Math.max(L.x0 + 2, xb - pw - 4);
          const rect = this._reserveLabel(lx, y - ph / 2, pw, ph, 0);
          ctx.fillStyle = this.colors.chipBg;
          this._roundRect(ctx, rect.x, rect.y, pw, ph, 4);
          ctx.fill();
          ctx.globalAlpha = 0.7;
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          this._roundRect(ctx, rect.x + 0.5, rect.y + 0.5, pw - 1, ph - 1, 4);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillStyle = col;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(a.label, rect.x + 6, rect.y + ph / 2 + 0.5);
        }
      } else if (a.type === 'swingLabel' || a.type === 'textMarker') {
        const x = this._xForIndex(a.index, L);
        const y = this._yForPrice(a.price, L, range);
        const above = a.dir !== 'down'; // 'up' swing labels above price
        ctx.font = `700 10.5px ${FONT}`;
        const tw = ctx.measureText(a.text).width;
        const px = 5, ph = 17;
        const pw = tw + px * 2;
        const lx = Math.max(L.x0 + 2, Math.min(x - pw / 2, L.x1 - pw - 2));
        const rect = this._reserveLabel(lx, above ? y - 9 - ph : y + 9, pw, ph, above ? -1 : 1);
        ctx.fillStyle = 'rgba(13,18,32,0.85)';
        this._roundRect(ctx, rect.x, rect.y, pw, ph, 4);
        ctx.fill();
        ctx.fillStyle = a.color || this.colors.label;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.text, rect.x + pw / 2, rect.y + ph / 2 + 0.5);
      } else if (a.type === 'smt') {
        const x = this._xForIndex(a.index, L);
        ctx.strokeStyle = this.colors.smt;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, L.y0 + 14);
        ctx.lineTo(x, this.smtCandles ? L.smtY1 : L.y1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = `700 10px ${FONT}`;
        const txt = a.text || 'SMT';
        const tw = ctx.measureText(txt).width;
        const lx = Math.max(L.x0 + 2, Math.min(x - tw / 2, L.x1 - tw - 2));
        const rect = this._reserveLabel(lx, L.y0 + 2, tw, 11, 1);
        ctx.fillStyle = this.colors.smt;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(txt, rect.x, rect.y);
      }
    }
  }

  _drawPulses(ctx, L, range) {
    const now = performance.now();
    const slot = this._slotW(L);
    for (const p of this._pulses) {
      const t = Math.min(1, (now - p.start) / 900);
      const alpha = (1 - t) * 0.55;
      const grow = 1 + t * 0.6;
      const c = this.candles[p.index];
      if (!c) continue;
      const x = this._xForIndex(p.index, L);
      const yh = this._yForPrice(c.h, L, range);
      const yl = this._yForPrice(c.l, L, range);
      const cy = (yh + yl) / 2;
      const hh = ((yl - yh) / 2 + 10) * grow;
      const hw = (slot / 2 + 4) * grow;
      const col = p.verdict === 'correct' ? this.colors.correct : this.colors.incorrect;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      this._roundRect(ctx, x - hw, cy - hh, hw * 2, hh * 2, 6);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.25;
      ctx.fillStyle = col;
      this._roundRect(ctx, x - hw, cy - hh, hw * 2, hh * 2, 6);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  _drawSmtPanel(ctx, L) {
    const candles = this.smtCandles.slice(0, Math.min(this.revealCount, this.smtCandles.length));
    if (!candles.length) return;
    ctx.fillStyle = this.colors.panel;
    ctx.fillRect(L.x0, L.smtY0, L.x1 - L.x0, L.smtY1 - L.smtY0);
    ctx.strokeStyle = this.colors.grid;
    ctx.strokeRect(L.x0 + 0.5, L.smtY0 + 0.5, L.x1 - L.x0 - 1, L.smtY1 - L.smtY0 - 1);
    let lo = Infinity, hi = -Infinity;
    for (const c of candles) { if (c.l < lo) lo = c.l; if (c.h > hi) hi = c.h; }
    const pad = (hi - lo) * 0.1 || 1;
    lo -= pad; hi += pad;
    const yFor = (p) => L.smtY0 + 6 + (hi - p) / (hi - lo) * (L.smtY1 - L.smtY0 - 12);
    const slot = this._slotW(L);
    const bw = Math.max(1.5, Math.min(12, slot * 0.62));

    // Own price scale: gridline + label at the pane's mid, plus hi/lo tags,
    // so highs and lows are actually comparable against the main pane.
    const dec = hi - lo < 5 ? 2 : hi - lo < 50 ? 1 : 0;
    ctx.font = `500 9.5px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const mid = (hi + lo) / 2;
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(L.x0, Math.round(yFor(mid)) + 0.5);
    ctx.lineTo(L.x1, Math.round(yFor(mid)) + 0.5);
    ctx.stroke();
    ctx.fillStyle = this.colors.axisTextDim;
    ctx.fillText(mid.toFixed(dec), L.x1 + 8, yFor(mid));
    ctx.fillText(hi.toFixed(dec), L.x1 + 8, Math.max(yFor(hi), L.smtY0 + 8));
    ctx.fillText(lo.toFixed(dec), L.x1 + 8, Math.min(yFor(lo), L.smtY1 - 8));

    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const x = this._xForIndex(i, L);
      const up = c.c >= c.o;
      ctx.strokeStyle = up ? this.colors.upDim : this.colors.downDim;
      ctx.lineWidth = Math.max(1, bw * 0.14);
      ctx.beginPath();
      ctx.moveTo(x, yFor(c.h));
      ctx.lineTo(x, yFor(c.l));
      ctx.stroke();
      ctx.fillStyle = up ? this.colors.upDim : this.colors.downDim;
      const top = Math.min(yFor(c.o), yFor(c.c));
      ctx.fillRect(x - bw / 2, top, bw, Math.max(1, Math.abs(yFor(c.c) - yFor(c.o))));
    }
    ctx.font = `600 9.5px ${FONT}`;
    ctx.fillStyle = this.colors.sessionLabel;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('CORRELATED SYMBOL', L.x0 + 6, L.smtY0 + 5);
  }

  _drawCrosshair(ctx, L, range, vis) {
    const { x, y } = this._pointer;
    if (x < L.x0 || x > L.x1 || y < L.y0 || y > this._h - this.opts.paddingBottom) return;
    ctx.strokeStyle = this.colors.crosshair;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const i = this._hoverIndex;
    const cx = i >= 0 ? this._xForIndex(i, L) : x;
    ctx.beginPath();
    ctx.moveTo(cx, L.y0); ctx.lineTo(cx, this.smtCandles ? L.smtY1 : L.y1);
    ctx.moveTo(L.x0, y + 0.5); ctx.lineTo(L.x1, y + 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // price tag on axis
    if (y >= L.y0 && y <= L.y1) {
      const p = this._priceForY(y, L, range);
      ctx.font = `600 10.5px ${FONT}`;
      const txt = p.toFixed(range.hi - range.lo < 5 ? 2 : range.hi - range.lo < 50 ? 1 : 0);
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = this.colors.chipBg;
      this._roundRect(ctx, L.x1 + 3, y - 9, tw + 12, 18, 4);
      ctx.fill();
      ctx.strokeStyle = this.colors.chipBorder;
      ctx.stroke();
      ctx.fillStyle = this.colors.chipText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, L.x1 + 9, y);
    }

    // time tag on the bottom axis
    if (i >= 0 && vis[i]) {
      const txt = minutesToClock(vis[i].t);
      ctx.font = `600 10px ${FONT}`;
      const tw = ctx.measureText(txt).width;
      const pw = tw + 12, ph = 17;
      const tx = Math.max(L.x0, Math.min(cx - pw / 2, L.x1 - pw));
      const tyTop = this._h - this.opts.paddingBottom + 4;
      ctx.fillStyle = this.colors.chipBg;
      this._roundRect(ctx, tx, tyTop, pw, ph, 4);
      ctx.fill();
      ctx.strokeStyle = this.colors.chipBorder;
      ctx.lineWidth = 1;
      this._roundRect(ctx, tx + 0.5, tyTop + 0.5, pw - 1, ph - 1, 4);
      ctx.stroke();
      ctx.fillStyle = this.colors.chipText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, tx + 6, tyTop + ph / 2 + 0.5);
    }

    // OHLC chip
    if (i >= 0 && vis[i]) {
      const c = vis[i];
      const dec = range.hi - range.lo < 5 ? 2 : 1;
      const parts = [
        ['O', c.o.toFixed(dec)], ['H', c.h.toFixed(dec)],
        ['L', c.l.toFixed(dec)], ['C', c.c.toFixed(dec)],
      ];
      const time = minutesToClock(c.t);
      ctx.font = `600 11px ${FONT}`;
      let w = ctx.measureText(time).width + 14;
      for (const [k, v] of parts) w += ctx.measureText(k + ' ' + v).width + 12;
      const chipX = Math.min(Math.max(L.x0 + 4, cx - w / 2), L.x1 - w - 4);
      const chipY = L.y0 + 2;
      ctx.fillStyle = this.colors.chipBg;
      this._roundRect(ctx, chipX, chipY, w, 22, 6);
      ctx.fill();
      ctx.strokeStyle = this.colors.chipBorder;
      ctx.lineWidth = 1;
      this._roundRect(ctx, chipX + 0.5, chipY + 0.5, w - 1, 21, 6);
      ctx.stroke();
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      let tx = chipX + 8;
      ctx.fillStyle = this.colors.axisTextDim;
      ctx.fillText(time, tx, chipY + 11);
      tx += ctx.measureText(time).width + 10;
      const up = c.c >= c.o;
      for (const [k, v] of parts) {
        ctx.fillStyle = this.colors.axisTextDim;
        ctx.fillText(k, tx, chipY + 11);
        tx += ctx.measureText(k).width + 3;
        ctx.fillStyle = up ? this.colors.up : this.colors.down;
        ctx.fillText(v, tx, chipY + 11);
        tx += ctx.measureText(v).width + 9;
      }
    }
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

export { minutesToClock, DEFAULT_COLORS };
