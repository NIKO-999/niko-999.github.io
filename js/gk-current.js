/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE CURRENT — the Golden Path as one continuous river
 * ═══════════════════════════════════════════════════════════════════════════
 *  The thirteen spheres are not three groups. They are ONE chain:
 *
 *    Activation  Life's Work → Evolution → Radiance → Purpose
 *    Venus                                 Purpose → Attraction → IQ → EQ → SQ → Core
 *    Pearl                                                 Vocation → Culture → Brand → Pearl
 *
 *  Purpose is the hinge where Activation becomes Venus. Core and Vocation are
 *  the SAME KEY — the hinge where Venus becomes Pearl, the wound read forward
 *  as the calling — so they occupy ONE node. And Brand carries Life's Work's
 *  key, so the path bends back toward its own source at the end without
 *  touching it.
 *
 *  That leaves twelve nodes on one river, and the two doubled keys are not
 *  special cases to handle — they are exactly the two places the river folds.
 *
 *  This module is pure geometry: no DOM, no colour, no motion. It answers
 *  "where does node i sit, and what does the curve through them look like",
 *  which makes the shape testable on its own.
 *
 *  ARC-LENGTH PARAMETRISATION. Nodes are placed at equal distance ALONG the
 *  curve, not at equal parameter t. A Catmull-Rom spline travels at wildly
 *  uneven speed through its control points, so equal-t spacing bunches nodes
 *  in the tight bends and strands them in the straights. The curve is walked
 *  once into a cumulative length table and sampled back by distance.
 *
 *  API:
 *    DGKCurrent.CHAIN            -> [{ id, label, seq, alsoId, alsoLabel }] x 12
 *    DGKCurrent.SEQ              -> ['Activation','Venus','Pearl']
 *    DGKCurrent.layout(w, h)     -> { d, nodes, length, portrait }
 *        d      : the SVG path data for the whole river
 *        nodes  : [{ i, x, y, t, tangent, side, ...CHAIN[i] }]
 *        length : total arc length in px
 *    DGKCurrent.sliceAt(layout, fromIdx, toIdx) -> path data for one stretch
 *    DGKCurrent.VALID / .FAILURES
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (root) {
  'use strict';

  const SEQ = ['Activation', 'Venus', 'Pearl'];

  /* The twelve nodes in reading order. `alsoId` marks a node that carries a
     second sphere on the same key — only Core/Vocation, the Venus→Pearl hinge. */
  const CHAIN = [
    { id: 'lifesWork',  label: "Life's Work", seq: 'Activation' },
    { id: 'evolution',  label: 'Evolution',   seq: 'Activation' },
    { id: 'radiance',   label: 'Radiance',    seq: 'Activation' },
    { id: 'purpose',    label: 'Purpose',     seq: 'Activation', hinge: 'Venus' },
    { id: 'attraction', label: 'Attraction',  seq: 'Venus' },
    { id: 'iq',         label: 'IQ',          seq: 'Venus' },
    { id: 'eq',         label: 'EQ',          seq: 'Venus' },
    { id: 'sq',         label: 'SQ',          seq: 'Venus' },
    { id: 'core',       label: 'Core',        seq: 'Venus', hinge: 'Pearl',
      alsoId: 'vocation', alsoLabel: 'Vocation' },
    { id: 'culture',    label: 'Culture',     seq: 'Pearl' },
    { id: 'brand',      label: 'Brand',       seq: 'Pearl' },
    { id: 'pearl',      label: 'Pearl',       seq: 'Pearl' },
  ];

  const N = CHAIN.length;

  /* ── the spiral ─────────────────────────────────────────────────────────
     A current does not meander, it turns inward. The path spirals from the
     outside to the centre through its twelve nodes: outer where the work is
     visible, innermost where the Pearl is. That shape earns its place three
     ways — it fills a rectangle without dead corners, it gives every label a
     clear radial exit so nothing collides with the curve, and it deepens,
     which is what the Golden Path does.

     Slightly more than one full turn, so the tail passes just inside its own
     beginning. Brand carries Life's Work's key, and the two land close enough
     for the chord between them to read as a return.                        */

  const TURNS = 1.18;
  const THETA0 = -Math.PI * 0.82;      // start upper-left, sweep clockwise
  const R_INNER = 0.20;                // innermost radius, fraction of outer
  const R_EASE = 0.88;                 // <1 keeps the outer turns roomier

  function spiral(steps) {
    const out = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const th = THETA0 + TURNS * 2 * Math.PI * t;
      const r = 1 - (1 - R_INNER) * Math.pow(t, R_EASE);
      out.push({ x: Math.cos(th) * r, y: Math.sin(th) * r });
    }
    return out;
  }

  /**
   * Lay the current into a w x h box.
   *
   * The spiral is generated in a unit circle and mapped onto an ellipse that
   * fits the box, so a tall phone gets a tall spiral and a wide desktop a wide
   * one — the same figure either way, never squashed into a corner.
   */
  function layout(w, h, opts) {
    const o = opts || {};
    const portrait = o.portrait !== undefined ? o.portrait : (h > w);
    const cx = (o.cx !== undefined ? o.cx : 0.5) * w;
    const cy = (o.cy !== undefined ? o.cy : 0.5) * h;
    // Leave room outboard for labels; more on the cross axis than the long one.
    const rx = (o.rx !== undefined ? o.rx : (portrait ? 0.36 : 0.30)) * w;
    const ry = (o.ry !== undefined ? o.ry : (portrait ? 0.34 : 0.38)) * h;

    const pts = spiral(560).map(p => ({ x: cx + p.x * rx, y: cy + p.y * ry }));

    // cumulative arc length
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y;
      cum.push(cum[i - 1] + Math.hypot(dx, dy));
    }
    const length = cum[cum.length - 1];

    function atLength(dist) {
      const d = Math.max(0, Math.min(length, dist));
      let lo = 0, hi = cum.length - 1;
      while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] <= d) lo = mid; else hi = mid;
      }
      const seg = cum[hi] - cum[lo] || 1;
      const f = (d - cum[lo]) / seg;
      const a = pts[lo], b = pts[hi];
      const tx = b.x - a.x, ty = b.y - a.y;
      const m = Math.hypot(tx, ty) || 1;
      return { x: a.x + tx * f, y: a.y + ty * f,
               tangent: { x: tx / m, y: ty / m }, t: d / length };
    }

    // Nodes at equal arc length, inset so the current runs on past its first
    // and last sphere rather than starting and stopping on them.
    const inset = length * 0.035;
    const usable = length - inset * 2;
    const nodes = CHAIN.map((c, i) => {
      const p = atLength(inset + (usable * i) / (N - 1));
      // Labels exit RADIALLY from the centre, which on a spiral can never
      // cross the curve near its own node.
      const ax = p.x - cx, ay = p.y - cy;
      const m = Math.hypot(ax, ay) || 1;
      return Object.assign({ i, x: p.x, y: p.y, t: p.t, tangent: p.tangent,
                             radial: { x: ax / m, y: ay / m },
                             side: ax >= 0 ? 1 : -1 }, c);
    });

    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 1; i < pts.length; i++) {
      d += 'L' + pts[i].x.toFixed(2) + ',' + pts[i].y.toFixed(2);
    }

    return { d, nodes, length, portrait, pts, cum, atLength, cx, cy, rx, ry };
  }

  /** Path data for the stretch between two node indices, for per-sequence
   *  colouring. Extended half a gap either side so stretches overlap and the
   *  colour crossfade has somewhere to happen. */
  function sliceAt(lay, fromIdx, toIdx) {
    const inset = lay.length * 0.035;
    const usable = lay.length - inset * 2;
    const step = usable / (N - 1);
    const a = Math.max(0, inset + step * fromIdx - step * 0.5);
    const b = Math.min(lay.length, inset + step * toIdx + step * 0.5);
    let d = '';
    const STEPS = 90;
    for (let s = 0; s <= STEPS; s++) {
      const p = lay.atLength(a + ((b - a) * s) / STEPS);
      d += (s ? 'L' : 'M') + p.x.toFixed(2) + ',' + p.y.toFixed(2);
    }
    return d;
  }

  /* ── validation ─────────────────────────────────────────────────────────
     The chain must agree with DGKProfile.SPHERES: every sphere accounted for
     exactly once, the two doubled keys folded correctly, and the sequence
     order monotonic. Asserted at load, in the style of js/hexagrams.js.    */

  const FAILURES = [];

  (function () {
    const P = root.DGKProfile
      || (typeof require === 'function' ? require('./gk-profile.js') : null);
    if (!P || !P.SPHERES) return;              // engine absent: skip, not fail

    const covered = [];
    CHAIN.forEach(c => { covered.push(c.id); if (c.alsoId) covered.push(c.alsoId); });
    const want = P.SPHERES.map(s => s.id);
    if (covered.length !== want.length) FAILURES.push('chain covers ' + covered.length + ' of ' + want.length);
    want.forEach(id => { if (covered.indexOf(id) === -1) FAILURES.push('missing ' + id); });
    if (new Set(covered).size !== covered.length) FAILURES.push('duplicate sphere in chain');

    // sequence must run Activation, then Venus, then Pearl, never back
    let last = -1;
    CHAIN.forEach(c => {
      const k = SEQ.indexOf(c.seq);
      if (k < last) FAILURES.push('sequence order breaks at ' + c.id);
      last = k;
    });

    // the folded node must genuinely be one key in the engine's own table
    const byId = {};
    P.SPHERES.forEach(s => { byId[s.id] = s; });
    CHAIN.forEach(c => {
      if (!c.alsoId) return;
      const a = byId[c.id], b = byId[c.alsoId];
      if (!a || !b || a.chart !== b.chart || a.body !== b.body) {
        FAILURES.push(c.id + '/' + c.alsoId + ' are not the same key');
      }
    });
  })();

  // Geometry sanity, independent of any engine: nodes evenly spaced along the
  // curve, inside the box, and in order.
  (function () {
    [[1440, 900], [1024, 1366], [375, 812], [375, 667]].forEach(([w, h]) => {
      const lay = layout(w, h);
      if (lay.nodes.length !== N) { FAILURES.push('node count at ' + w + 'x' + h); return; }
      const gaps = [];
      for (let i = 1; i < N; i++) {
        gaps.push(Math.hypot(lay.nodes[i].x - lay.nodes[i - 1].x,
                             lay.nodes[i].y - lay.nodes[i - 1].y));
      }
      // straight-line gaps vary a little through bends, but must never collapse
      const min = Math.min.apply(null, gaps), max = Math.max.apply(null, gaps);
      if (min < 18) FAILURES.push('nodes too close at ' + w + 'x' + h + ': ' + min.toFixed(1));
      if (max / min > 2.6) FAILURES.push('spacing uneven at ' + w + 'x' + h + ': ' + (max / min).toFixed(2));
      lay.nodes.forEach(nd => {
        if (nd.x < -1 || nd.y < -1 || nd.x > w + 1 || nd.y > h + 1) {
          FAILURES.push('node ' + nd.id + ' outside box at ' + w + 'x' + h);
        }
      });
    });
  })();

  const api = { CHAIN, SEQ, N, layout, sliceAt, FAILURES, VALID: FAILURES.length === 0 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DGKCurrent = api;
})(typeof window !== 'undefined' ? window : globalThis);
