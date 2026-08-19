/* ═══════════════════════════════════════════════════════════════
   THE GAUNTLET — geometry audit across every view of the platform.

   Nothing here is opinion. Every check measures the live, composited
   box and reports a number, so a "looks fine" cannot outvote a 3px
   rag. Run it, fix what it names, run it again until it says CLEAN.
   ═══════════════════════════════════════════════════════════════ */
const { chrome, BASE } = require('./lib');
const { chromium } = require('playwright-core');
/* Every screen the platform can show. Each entry is a name and the
   steps that make it visible. */
const VIEWS = [
  ['trade/journal',    `${BASE}/trading/`, 'calendar', async (p) => {
      await p.locator('.day.empty .day-new, .day .day-new').first().click();
      await p.waitForTimeout(350); } ],
  ['trade/metrics@800',`${BASE}/trading/`, 'metrics',  null, { width: 800, height: 900 }],
  ['arc/board@800',    `${BASE}/arc/`,     'board',    null, { width: 800, height: 900 }],
  ['trade/metrics@420',`${BASE}/trading/`, 'metrics',  null, { width: 420, height: 860 }],
  ['trade/calendar@420',`${BASE}/trading/`,'calendar', null, { width: 420, height: 860 }],
  ['arc/board@420',    `${BASE}/arc/`,     'board',    null, { width: 420, height: 860 }],
  ['arc/palette',      `${BASE}/arc/`,     'board',    async (p) => {
      await p.locator('#palBtn').click(); await p.waitForTimeout(250); } ],
  /* Vision is the plan's third tab now, not a view on the rail. */
  ['arc/vision',       `${BASE}/arc/`,     'board', async (p) => {
      await p.locator('#tabVision').click(); await p.waitForTimeout(350); } ],
  ['arc/board',        `${BASE}/arc/`,     'board'],
  ['arc/past',         `${BASE}/arc/`,     'past'],
  ['trade/metrics',    `${BASE}/trading/`, 'metrics'],
  ['trade/calendar',   `${BASE}/trading/`, 'calendar'],
  ['trade/settings',   `${BASE}/trading/`, 'settings'],
  ['trade/resources',  `${BASE}/trading/`, 'resources'],
  ['trade/resources@1080', `${BASE}/trading/`, 'resources', null, { width: 1080, height: 950 }],
  ['trade/state',      `${BASE}/trading/`, 'state'],
  ['trade/state@800',  `${BASE}/trading/`, 'state', null, { width: 800, height: 900 }],
  ['trade/backtest',   `${BASE}/trading/`, 'backtest'],
  ['trade/backtest@800', `${BASE}/trading/`, 'backtest', null, { width: 800, height: 900 }],
  ['trade/log',        `${BASE}/trading/`, 'log', async (p) => {
      await p.evaluate(() => document.getElementById('logOnly').click());   // show every trade
      await p.waitForTimeout(300); } ],
];

const AUDIT = () => {
  /* ── helpers ───────────────────────────────────────────────── */
  const R = (n) => Math.round(n * 10) / 10;
  const vis = (e) => {
    const s = getComputedStyle(e), r = e.getBoundingClientRect();
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    if (r.width <= 2 || r.height <= 2) return false;      // sr-only / hairline clips
    if (s.clipPath && s.clipPath !== 'none') return false;
    if (e.classList.contains('sr')) return false;
    return true;
  };
  const all = (root) => [...root.querySelectorAll('*')].filter(vis);
  const px = (v) => parseFloat(v) || 0;
  const sel = (e) => {
    if (e.id) return '#' + e.id;
    const c = [...e.classList].join('.');
    return e.tagName.toLowerCase() + (c ? '.' + c : '');
  };
  /* Where a leaf's own painted content starts — an element that only
     wraps other boxes is not a rag participant, its children are. */
  const isLeafText = (e) => {
    if (!e.firstChild) return false;
    return [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  };
  const isBox = (e) => {
    const s = getComputedStyle(e);
    return s.borderTopWidth !== '0px' || s.borderLeftWidth !== '0px'
      || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent')
      || s.backgroundImage !== 'none';
  };
  const out = { rag: [], radius: [], icon: [], bleed: [], type: [], ctl: [], center: [] };
  const open = [...document.querySelectorAll('dialog[open], .sheet:not([hidden]), .menu:not([hidden]), #palMenu:not([hidden])')]
    .filter(vis).sort((a, b) => b.clientWidth - a.clientWidth)[0];
  const scope = open || document.querySelector('.main:not([hidden]) .pane, .main:not([hidden])') || document.body;

  /* ── A/B. left and right rag ───────────────────────────────────
     Inside one container, two text lines that start 1–7px apart are
     never a decision — they are a mistake. Equal, or clearly
     indented, both read as deliberate. */
  /* Is an edge a decision, or a consequence?

     Three ways it can be a consequence. Right-anchored: the left edge
     moves as the string gets longer. Centred: the same, halved. An
     inline fragment in flowing text: it begins wherever the line broke.

     None of those can be ragged against anything, and comparing them
     reports faults that appear and vanish as a number goes from 9 to 10.
     Both rag checks ask this, because each was growing its own half of
     the same idea. */
  const incidental = (e) => {
    const st = getComputedStyle(e);
    if (/right|end|center/.test(st.textAlign)) return true;
    if (st.marginLeft === 'auto' && st.marginRight !== 'auto') return true;
    const par = e.parentElement;
    if (!par) return false;
    const pst = getComputedStyle(par);
    if (/grid|flex/.test(pst.display)
        && /center/.test(pst.justifyItems + ' ' + pst.justifyContent + ' ' + pst.placeItems))
      return true;
    /* Row only. A spacer in a COLUMN pushes down, and the left edge it
       leaves behind is as deliberate as any other. */
    if (/flex/.test(pst.display) && !/column/.test(pst.flexDirection)) {
      for (let sib = par.firstElementChild; sib && sib !== e; sib = sib.nextElementSibling)
        if (parseFloat(getComputedStyle(sib).flexGrow) > 0) return true;
      /* Placed by wrapping rather than by column. Note the anchor:
         /wrap/ also matches "nowrap", which silenced this whole check. */
      if (/^wrap/.test(pst.flexWrap)) return true;
    }
    /* An inline box inside running text. Block-level children of a flow
       parent are still judged. */
    if (/^inline/.test(st.display) && !/flex|grid/.test(pst.display)) return true;
    return false;
  };

  const isWrap = (e) => {
    const s = getComputedStyle(e);
    return isBox(e) || ((s.display === 'block' || s.display === 'flex' || s.display === 'grid')
      && e.clientWidth > 200 && e.children.length > 1);
  };
  const containers = all(scope).filter(isWrap).filter(e => e.clientWidth > 120 && e.children.length > 1);
  for (const c of containers) {
    const cs = getComputedStyle(c), cr = c.getBoundingClientRect();
    const L = cr.left + px(cs.borderLeftWidth) + px(cs.paddingLeft);
    const Rt = cr.right - px(cs.borderRightWidth) - px(cs.paddingRight);
    /* direct-ish descendants only: a nested card's insides belong to
       that card's own rag, not this one's */
    const kids = all(c).filter(e => {
      if (e.closest('svg')) return false;
      const p = e.parentElement.closest('*');
      let up = e.parentElement, depth = 0;
      while (up && up !== c) { if (isWrap(up) && up.clientWidth > 120) return false; up = up.parentElement; depth++; }
      return isLeafText(e) || (isBox(e) && e.getBoundingClientRect().width > 40);
    });
    const outer = kids.filter(k => !kids.some(o => o !== k && o.contains(k)));
    const seen = new Map();
    for (const k of outer) {
      const r = k.getBoundingClientRect();
      const st = getComputedStyle(k);
      if (st.position === 'absolute' || st.position === 'fixed') continue;
      if (px(st.marginLeft) < 0 || px(st.marginRight) < 0) continue;   // deliberate bleed
      if (incidental(k)) continue;                       // an edge nobody chose
      const dl = R(r.left - L), dr = R(Rt - r.right);
      const anchored = /right|end/.test(st.textAlign)
        || r.width >= (Rt - L) * 0.6
        || st.marginLeft === 'auto'
        || (getComputedStyle(k.parentElement).display === 'flex' && !k.nextElementSibling);
      seen.set(k, [dl, anchored ? dr : null, sel(k)]);
    }
    const lefts = [...seen.values()];
    const near = (i) => {
      const vals = lefts.map(v => v[i]).filter(v => v !== null && v > -40 && v < 400);
      const uniq = [...new Set(vals)].sort((a, b) => a - b);
      const bad = [];
      for (let a = 0; a < uniq.length - 1; a++) {
        const d = R(uniq[a + 1] - uniq[a]);
        if (d > 0.6 && d < 7) bad.push([uniq[a], uniq[a + 1], d]);
      }
      return bad;
    };
    for (const [a, b, d] of near(0))
      out.rag.push({ side: 'left', box: sel(c), a, b, d,
        who: lefts.filter(v => v[0] === a || v[0] === b).map(v => `${v[2]}@${v[0]}`).slice(0, 6) });
    for (const [a, b, d] of near(1))
      out.rag.push({ side: 'right', box: sel(c), a, b, d,
        who: lefts.filter(v => v[1] === a || v[1] === b).map(v => `${v[2]}@${v[1]}`).slice(0, 6) });
  }

  /* ── B2. column rag, across containers ────────────────────────
     The rag check above only sees inside one box, so a header sitting
     over a grid it does not contain could drift and nothing noticed.
     This compares every pair of text lines that sit in the same
     vertical column: same column, near-but-unequal left edge, fault. */
  {
    /* The ELEMENT itself, never its ancestors. Walking up caught the
       page header's spacer and suppressed eleven real faults with it —
       almost everything in this app sits under a flex row with a .grow
       in it somewhere. What matters is whether THIS line's own left
       edge was chosen or fell out of its text length. */
    /* Is this line's LEFT edge a decision, or a consequence?

       Three ways it can be a consequence. Right-anchored: the left edge
       moves as the string gets longer. Centred: same, halved. An inline
       fragment in flowing text: it starts wherever the line broke.

       None of those can be ragged against anything, and comparing them
       produces faults that come and go as the content changes. */
    const leaves = all(scope).filter(e => isLeafText(e) && !e.closest('svg'))
      .map(e => ({ e, r: e.getBoundingClientRect(), s: sel(e) }))
      .filter(o => o.r.width > 4);
    const hit = new Set();
    for (let i = 0; i < leaves.length; i++) {
      for (let j = i + 1; j < leaves.length; j++) {
        const A = leaves[i], B = leaves[j];
        const d = Math.abs(A.r.left - B.r.left);
        if (d <= 0.6 || d >= 7) continue;
        if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
        /* A right-anchored line's LEFT edge is a function of how long its
           text happens to be. Comparing it to a deliberate left edge
           compares nothing — the "rag" appears and vanishes as the number
           inside it changes from 9 to 10. B1 above already knows this;
           this check did not, and reported a 1.7px near-miss between a
           right-aligned week summary and the last cell of the row under
           it. Anchored on the right, judged on the right. */
        if (incidental(A.e) || incidental(B.e)) continue;
        /* same column: their horizontal spans mostly overlap */
        const ov = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
        if (ov < Math.min(A.r.width, B.r.width) * 0.55) continue;
        /* stacked, not side by side */
        if (Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top) > 2) continue;
        /* neighbours, not merely in the same column: two lines 400px
           apart in different panels cannot read as a ragged edge */
        const gap = A.r.top < B.r.top ? B.r.top - A.r.bottom : A.r.top - B.r.bottom;
        if (gap > 26) continue;
        const k = `${A.s}|${B.s}|${R(d)}`;
        if (hit.has(k)) continue; hit.add(k);
        out.col = (out.col || []).concat([{ a: A.s, b: B.s, al: R(A.r.left), bl: R(B.r.left), d: R(d) }]);
      }
    }
  }

  /* ── C. radius ────────────────────────────────────────────────
     "Curved" is only wrong when it is inconsistent: a child rounder
     than the parent it sits in, or a value used once in the app. */
  /* Does an element sibling butt right up against this one's left or
     right edge? If so the corners between them belong square: the halves
     of a split button, a segmented control. */
  const flush = (e) => {
    const par = e.parentElement;
    if (!par) return false;
    const r = e.getBoundingClientRect();
    for (const sib of par.children) {
      if (sib === e) continue;
      const s2 = sib.getBoundingClientRect();
      if (!s2.width || !s2.height) continue;
      if (Math.min(r.bottom, s2.bottom) - Math.max(r.top, s2.top) <= 2) continue;
      if (Math.abs(s2.left - r.right) <= 1.5 || Math.abs(r.left - s2.right) <= 1.5) return true;
    }
    return false;
  };
  const radii = new Map();
  for (const e of all(scope)) {
    if (e.closest('svg')) continue;
    const s = getComputedStyle(e);
    const v = s.borderTopLeftRadius;
    if (v === '0px' || v.includes('%')) continue;
    if (!isBox(e)) continue;
    const n = px(v);
    radii.set(n, (radii.get(n) || 0) + 1);
    /* corner mismatch on one element */
    const cs = [s.borderTopLeftRadius, s.borderTopRightRadius,
                s.borderBottomRightRadius, s.borderBottomLeftRadius];
    /* Asking whether something is actually flush beats asking whether
       somebody remembered to add a class saying so — the split button
       never had the class and was reported for two years. */
    if (new Set(cs).size > 1 && !flush(e))
      out.radius.push({ kind: 'corners differ', el: sel(e), v: cs.join(' ') });
    /* nested: inner should be <= outer, and ideally outer - gap */
    let p = e.parentElement;
    while (p && p !== scope) {
      if (isBox(p) && px(getComputedStyle(p).borderTopLeftRadius) > 0) {
        const pv = px(getComputedStyle(p).borderTopLeftRadius);
        const pr = p.getBoundingClientRect(), er = e.getBoundingClientRect();
        const inset = Math.min(er.left - pr.left, pr.right - er.right,
                               er.top - pr.top, pr.bottom - er.bottom);
        if (n > pv - 0.5 && inset > 0.5 && inset < 24)
          out.radius.push({ kind: 'child rounder than parent', el: sel(e), v: n, parent: sel(p), pv, inset: R(inset) });
        break;
      }
      p = p.parentElement;
    }
  }
  out.radiusScale = [...radii.entries()].sort((a, b) => a[0] - b[0]);

  /* ── D. icons ─────────────────────────────────────────────────
     Same size means the same PAINTED size, and the same stroke at
     that size. A 24-box glyph at width 13 is a different weight
     from an 18-box glyph at width 13. */
  for (const s of [...scope.querySelectorAll('svg')].filter(vis)) {
    const r = s.getBoundingClientRect();
    out.icon.push({
      where: sel(s.parentElement), box: `${R(r.width)}x${R(r.height)}`,
      vb: s.getAttribute('viewBox') || '-', sw: s.getAttribute('stroke-width') || '-',
      attr: `${s.getAttribute('width') || '-'}x${s.getAttribute('height') || '-'}`,
    });
  }

  /* ── D2. svg aspect ──
     A viewBox stretched to a different aspect scales x and y by
     different factors, so strokes that were one weight come out two. */
  for (const s2 of [...scope.querySelectorAll('svg[viewBox]')].filter(vis)) {
    const vb = s2.getAttribute('viewBox').trim().split(/[\s,]+/).map(Number);
    const r = s2.getBoundingClientRect();
    if (!vb[2] || !vb[3]) continue;
    const par = (s2.getAttribute('preserveAspectRatio') || '').trim();
    if (par === 'none') continue;                      // stretched on purpose
    const want = vb[2] / vb[3], got = r.width / r.height;
    if (Math.abs(want - got) / want > 0.02)
      out.aspect = (out.aspect || []).concat([{ el: sel(s2), vb: vb.join(' '),
        box: `${R(r.width)}x${R(r.height)}`, want: R(want), got: R(got) }]);
  }

  /* ── D3. siblings on a row ────────────────────────────────────
     Side by side means the same box. Two panels of the same kind on
     one row at different heights read as a mistake, because they are
     one — and the eye catches it long before it can say why.

     Only card-like boxes: something with a border or a background of
     its own, wider than 120px, holding more than a line of text. A
     table cell or a chip is not a panel and is allowed to differ.

     A FOLDED panel is exempt: align-self:start is how it opts out, and
     a title bar dragged to its open neighbour's height is worse than
     the mismatch it fixes. */
  {
    const cardish = (e) => {
      const c = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      if (r.width < 120 || r.height < 24) return false;
      if (c.alignSelf === 'start' || c.alignSelf === 'flex-start') return false;
      const bordered = ['Top', 'Right', 'Bottom', 'Left']
        .some(k => px(c['border' + k + 'Width']) > 0);
      const filled = c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
      return bordered || filled;
    };
    for (const box of all(scope)) {
      const c = getComputedStyle(box);
      if (!/grid|flex/.test(c.display)) continue;
      const kids = [...box.children].filter(vis).filter(cardish);
      if (kids.length < 2) continue;
      const rows = new Map();
      kids.forEach((k) => {
        const r = k.getBoundingClientRect();
        const key = Math.round(r.top);
        (rows.get(key) || rows.set(key, []).get(key)).push({ el: k, r });
      });
      for (const [, row] of rows) {
        if (row.length < 2) continue;
        const hs = row.map(x => x.r.height);
        const lo = Math.min(...hs), hi = Math.max(...hs);
        if (hi - lo <= 1.5) continue;
        out.siblings = (out.siblings || []).concat([{
          row: sel(box),
          boxes: row.map(x => `${sel(x.el)} ${R(x.r.height)}px`).join('  |  '),
          off: R(hi - lo),
        }]);
      }
    }
  }

  /* ── E. bleed and overflow ────────────────────────────────────
     Content wider than the box that holds it, or a child painting
     outside a parent that does not clip. */
  for (const e of all(scope)) {
    if (e.closest('svg')) continue;
    const s = getComputedStyle(e);
    if (e.scrollWidth > e.clientWidth + 1 && s.overflowX === 'visible' && e.clientWidth > 0)
      out.bleed.push({ kind: 'content wider than box', el: sel(e), sw: e.scrollWidth, cw: e.clientWidth });
  }

  /* ── F. type scale ────────────────────────────────────────────
     Every distinct (size, weight, family, tracking) in the view. A
     size used once, one notch off a neighbour, is the drift. */
  const type = new Map();
  for (const e of all(scope)) {
    if (!isLeafText(e) || e.closest('svg')) continue;
    const s = getComputedStyle(e);
    const fam = s.fontFamily.split(',')[0].replace(/["']/g, '');
    const k = `${R(px(s.fontSize))}px ${s.fontWeight} ${/mono|SF Mono|Menlo/i.test(fam) ? 'mono' : 'sans'} ls:${s.letterSpacing}`;
    if (!type.has(k)) type.set(k, []);
    type.get(k).push(sel(e));
  }
  out.fams = [...new Set(all(scope).filter(e => isLeafText(e) && !e.closest('svg'))
    .map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))];
  out.svgFams = [...new Set([...scope.querySelectorAll('svg text')]
    .map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')))];
  out.type = [...type.entries()].map(([k, v]) => [k, v.length, v.slice(0, 3)])
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

  /* ── G. controls ──────────────────────────────────────────────
     Buttons and fields that sit together should be the same height. */
  for (const e of [...scope.querySelectorAll('button, input, select, textarea, a.btn, .btn')].filter(vis)) {
    const r = e.getBoundingClientRect();
    out.ctl.push({ el: sel(e), h: R(r.height), w: R(r.width),
      fs: R(px(getComputedStyle(e).fontSize)) });
  }

  /* ── H. optical centring ──────────────────────────────────────
     A flex row that claims align-items:center but whose child sits
     off the midline by more than half a pixel. */
  for (const c of all(scope)) {
    const s = getComputedStyle(c);
    if (s.display !== 'flex' || s.alignItems !== 'center' || s.flexDirection === 'column') continue;
    const cr = c.getBoundingClientRect();
    if (cr.height < 8) continue;
    const kidsC = [...c.children].filter(vis);
    const rows = new Set(kidsC.map(k => Math.round(k.getBoundingClientRect().top / 4)));
    if (rows.size > 1 && s.flexWrap !== 'nowrap') continue;   // wrapped: no one midline
    const top = cr.top + px(s.borderTopWidth) + px(s.paddingTop);
    const bot = cr.bottom - px(s.borderBottomWidth) - px(s.paddingBottom);
    if (bot - top < 8) continue;
    const mid = (top + bot) / 2;
    for (const k of [...c.children].filter(vis)) {
      const ks = getComputedStyle(k);
      if (ks.position === 'absolute' || ks.position === 'fixed') continue;
      if (ks.alignSelf === 'flex-start' || ks.alignSelf === 'stretch') continue;
      const kr = k.getBoundingClientRect();
      if (kr.height >= cr.height - 1) continue;
      const off = R(kr.top + kr.height / 2 - mid);
      if (Math.abs(off) > 0.6) out.center.push({ box: sel(c), el: sel(k), off });
    }
  }
  return out;
};

(async () => {
  const only = process.argv[2];
  const b = await chromium.launch({ executablePath: chrome(), args: ['--no-sandbox'] });
  const report = {};
  for (const [name, url, view, act, vp] of VIEWS) {
    if (only && !name.includes(only)) continue;
    const p = await b.newPage({ viewport: vp || { width: 1280, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push(m.text()); });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(350);
    await p.evaluate((v) => {
      const btn = document.querySelector(`[data-view="${v}"]`);
      if (btn) btn.click();
    }, view);
    await p.waitForTimeout(450);
    if (act) { try { await act(p); } catch (e) { errs.push('setup: ' + e.message); } }
    report[name] = await p.evaluate(AUDIT);
    report[name].errs = errs;
    await p.close();
  }
  await b.close();

  /* ── the read-out ── */
  let faults = 0;
  for (const [name, r] of Object.entries(report)) {
    console.log('\n\x1b[1m══ ' + name + ' ' + '═'.repeat(50 - name.length) + '\x1b[0m');
    if (r.errs.length) { console.log('  ERRORS', r.errs); faults += r.errs.length; }

    if (r.rag.length) {
      console.log('  \x1b[31mRAG\x1b[0m — edges 1–7px apart inside one box');
      const seen = new Set();
      for (const g of r.rag) {
        const k = `${g.box}|${g.side}|${g.a}|${g.b}`;
        if (seen.has(k)) continue; seen.add(k);
        console.log(`    ${g.box.padEnd(22)} ${g.side.padEnd(5)} ${String(g.a).padStart(6)} vs ${String(g.b).padStart(6)}  Δ${g.d}`);
        console.log(`      ${g.who.join('  ')}`);
        faults++;
      }
    }
    if (r.col && r.col.length) {
      console.log('  \x1b[31mCOLUMN RAG\x1b[0m — stacked lines, left edges 1\u20137px apart');
      const seen = new Set();
      for (const g of r.col.slice(0, 12)) {
        const k = `${g.a}|${g.b}`; if (seen.has(k)) continue; seen.add(k);
        console.log(`    ${g.a.padEnd(22)} @${String(g.al).padStart(6)}   vs  ${g.b.padEnd(22)} @${String(g.bl).padStart(6)}   \u0394${g.d}`);
        faults++;
      }
      if (r.col.length > 12) console.log(`    \u2026 and ${r.col.length - 12} more pairs`);
    }
    if (r.radius.length) {
      console.log('  \x1b[31mRADIUS\x1b[0m');
      const seen = new Set();
      for (const g of r.radius) {
        const k = JSON.stringify(g); if (seen.has(k)) continue; seen.add(k);
        console.log('    ' + JSON.stringify(g)); faults++;
      }
    }
    console.log('  radius scale:', r.radiusScale.map(([v, n]) => `${v}px×${n}`).join(' '));

    const ic = {};
    for (const i of r.icon) { const k = `${i.box} vb${i.vb} sw${i.sw}`; ic[k] = (ic[k] || 0) + 1; }
    console.log('  icons:', Object.entries(ic).map(([k, n]) => `${k} ×${n}`).join('  |  '));

    if (r.aspect && r.aspect.length) {
      console.log('  \x1b[31mSVG ASPECT\x1b[0m — viewBox stretched');
      r.aspect.forEach(x => { console.log('    ' + JSON.stringify(x)); faults++; });
    }
    if (r.siblings && r.siblings.length) {
      console.log('  \x1b[31mSIBLINGS\x1b[0m  side by side, different heights');
      r.siblings.forEach(x => {
        console.log(`    ${x.row}  Δ${x.off}px`);
        console.log(`      ${x.boxes}`);
        faults++;
      });
    }
    if (r.bleed.length) { console.log('  \x1b[31mBLEED\x1b[0m'); r.bleed.forEach(x => { console.log('    ' + JSON.stringify(x)); faults++; }); }
    if (r.center.length) {
      console.log('  \x1b[31mOFF-CENTRE\x1b[0m');
      const seen = new Set();
      for (const g of r.center) { const k = `${g.box}|${g.el}|${g.off}`; if (seen.has(k)) continue; seen.add(k);
        console.log(`    ${g.box.padEnd(24)} ${g.el.padEnd(22)} ${g.off > 0 ? '+' : ''}${g.off}px`); faults++; }
    }
    const heights = {};
    for (const c of r.ctl) heights[c.h] = (heights[c.h] || 0) + 1;
    console.log('  control heights:', Object.entries(heights).sort((a, b) => a[0] - b[0]).map(([h, n]) => `${h}px×${n}`).join(' '));
    const fams = [...new Set([...(r.fams || []), ...(r.svgFams || [])])].filter(Boolean);
    if (fams.length > 1) { console.log('  \x1b[31mFAMILIES\x1b[0m  ' + fams.join('  |  ')); faults++; }
    else console.log('  family: ' + (fams[0] || '-'));
    console.log('  type scale:');
    for (const [k, n, who] of r.type) console.log(`    ${k.padEnd(38)} ×${String(n).padStart(3)}   ${who.join(' ')}`);
  }
  console.log(`\n\x1b[1mFAULTS ${faults}\x1b[0m`);
})();
