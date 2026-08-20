/* ═══════════════════════════════════════════════════════════════
   HABITS — the preview's model and drawing. Nothing is saved.

   A separate file only because this is a preview and it will be
   deleted; the app itself keeps to one file per screen.
   ═══════════════════════════════════════════════════════════════ */

/* ── the model ──
   Three cadences, and they are not interchangeable:

     every: 1   due every day
     every: 2   due when it has been that long since you last did it
     perWeek    never due on a given DAY — it owes the week a number

   And two kinds of doing: a tick, or a target you fill. A checkbox is
   the wrong control for three litres — at two litres by four o'clock
   you want to see two litres, not an unticked box. */
const HABITS = [
  { id: 'water',   name: 'Water',        short: 'water',   unit: 'L',   target: 3,  every: 1, step: 0.25 },
  { id: 'walk',    name: 'Morning walk', short: 'walk',                              every: 1 },
  { id: 'read',    name: 'Reading',      short: 'reading', unit: 'min', target: 30, every: 1, step: 10 },
  { id: 'abs',     name: 'Abs',          short: 'abs',                               every: 2 },
  { id: 'workout', name: 'Workout',      short: 'workout',                           perWeek: 4 },
];
const BY_ID = Object.fromEntries(HABITS.map(h => [h.id, h]));

const iso = (d) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const TODAY = iso(new Date());

/* ── an invented ten weeks ──
   Seeded, so the picture is the same every time the page opens and the
   two toggles are compared against one history rather than two.

   The rates are deliberately uneven — reading is the one that slips and
   Saturday is the day that goes, because a demo where everything is
   kept equally tells you nothing about what the radars are for. */
const DAYS = (() => {
  let s = 17;
  const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
  const out = {};
  let lastAbs = -99;
  for (let i = 69; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    const k = iso(d), dow = d.getDay();
    const sat = dow === 6, sun = dow === 0;
    const rec = { date: k, done: {}, amt: {}, note: '' };
    const keep = (p) => r() < (sat ? p - 0.3 : sun ? p - 0.12 : p);

    rec.amt.water = Math.min(3.5, Math.max(0, (keep(0.86) ? 3 : 1.5 + r() * 1.2)));
    rec.done.water = rec.amt.water >= 3;
    rec.done.walk = keep(0.74);
    rec.amt.read = keep(0.55) ? 30 + Math.floor(r() * 20) : Math.floor(r() * 22);
    rec.done.read = rec.amt.read >= 30;
    /* Abs is only offered on days it was due, which is the whole point
       of the cadence — a day it was not due is not a day it was missed. */
    if (i <= lastAbs - 2 || lastAbs === -99) {
      rec.due_abs = true;
      rec.done.abs = keep(0.7);
      if (rec.done.abs) lastAbs = i;
    }
    rec.done.workout = !sun && r() < 0.42;
    if (i < 66 && r() < 0.18) rec.note = [
      'Legs still going from yesterday. Walk instead.',
      'Read in the morning for once and it stuck.',
      'Long day. Water was the only one that happened.',
      'Everything early. Best I have felt in a fortnight.',
    ][Math.floor(r() * 4)];
    out[k] = rec;
  }
  /* Today, part-finished, so the gap clocks have something to show. */
  const t = out[TODAY];
  t.amt.water = 1.75; t.done.water = false;
  t.done.walk = true;
  t.amt.read = 0; t.done.read = false;
  t.due_abs = true; t.done.abs = false;
  return out;
})();
const dayList = Object.keys(DAYS).sort();

/* ── cadence ──
   The one decision on the page. Rolling asks "has it been two days
   since you last did it"; fixed asks "is this an even day". Rolling
   means a late day never cascades into being permanently late; fixed
   keeps the schedule honest and charges you twice for one slip. */
let ANCHOR = 'roll';
const ANCHOR_0 = dayList[0];

function lastDoneBefore(id, k) {
  for (let i = dayList.indexOf(k) - 1; i >= 0; i--)
    if (DAYS[dayList[i]].done[id]) return dayList[i];
  return null;
}
function due(id, k) {
  const h = BY_ID[id];
  if (h.perWeek) return false;                 // owes the week, not the day
  if (h.every === 1) return true;
  if (ANCHOR === 'fixed') {
    const n = Math.round((new Date(k) - new Date(ANCHOR_0)) / 86400000);
    return n % h.every === 0;
  }
  const last = lastDoneBefore(id, k);
  if (!last) return true;
  return Math.round((new Date(k) - new Date(last)) / 86400000) >= h.every;
}
const dueOn = (k) => HABITS.filter(h => due(h.id, k)).map(h => h.id);
const keptOn = (k) => dueOn(k).filter(id => DAYS[k] && DAYS[k].done[id]);

/* Kept as a fraction of what was due, for the ring and the radars. A
   day with nothing due is not a day you failed — it returns null and is
   drawn as empty rather than as zero. */
function rate(k) {
  const d = dueOn(k);
  if (!d.length) return null;
  return keptOn(k).length / d.length;
}

/* ── the streak, with a tolerance ──
   A streak that dies on one missed day gets abandoned the first time
   you are ill: the thing is gone, so why continue. A budget — five days
   in seven keeps it — survives real life, so you keep it, so the habit
   survives too. Perfect-or-nothing is a machine for quitting in
   February. */
const TOLERANCE = 5 / 7;
function chain() {
  let n = 0;
  for (let i = dayList.length - 1; i >= 0; i--) {
    const k = dayList[i];
    if (k === TODAY) continue;                 // today is not over
    const win = dayList.slice(Math.max(0, i - 6), i + 1);
    const rs = win.map(rate).filter(x => x !== null);
    if (!rs.length) break;
    if (rs.reduce((a, b) => a + b, 0) / rs.length < TOLERANCE) break;
    n++;
  }
  return n;
}
function runsFor(id) {
  let best = 0, worst = 0, cur = 0, gap = 0;
  for (const k of dayList) {
    if (!due(id, k)) continue;
    if (DAYS[k].done[id]) { cur++; gap = 0; if (cur > best) best = cur; }
    else { gap++; cur = 0; if (gap > worst) worst = gap; }
  }
  return { best, worst };
}

/* ── today ── */
const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"'
  + ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M4 12l5 5L20 6" /></svg>';

function sinceLast(id) {
  const last = lastDoneBefore(id, TODAY);
  if (!last) return null;
  return Math.round((new Date(TODAY) - new Date(last)) / 86400000);
}

function renderNow() {
  const t = DAYS[TODAY];
  document.getElementById('hbNow').innerHTML = HABITS.map((h) => {
    let fill = 0, say = '', act = '', tag = '';
    if (h.target) {
      const a = t.amt[h.id] || 0;
      fill = Math.min(1, a / h.target);
      tag = `every day · ${h.target}${h.unit}`;
      /* Counts UP. The bar already shows what is left; saying it twice
         turns a task into a shortfall. */
      say = a >= h.target ? `<b>done</b> · ${(+a.toFixed(2))}${h.unit}`
                          : `<b>${(+a.toFixed(2))}${h.unit}</b> today`;
      act = `<button type="button" data-add="${h.id}" data-by="${-h.step}"
               aria-label="Less ${h.name}">&minus;</button>`
          + `<button type="button" data-add="${h.id}" data-by="${h.step}"
               aria-label="More ${h.name}">+</button>`;
    } else if (h.perWeek) {
      const wk = weekOf(new Date()).map(iso).filter(k => k <= TODAY);
      const n = wk.filter(k => DAYS[k] && DAYS[k].done[h.id]).length;
      const left = 7 - wk.length;
      fill = Math.min(1, n / h.perWeek);
      tag = `${h.perWeek} a week`;
      say = `<b>${n}</b> this week · ${left} ${left === 1 ? 'day' : 'days'} left`;
      act = `<button type="button" class="tick ${t.done[h.id] ? 'on' : ''}" data-tick="${h.id}"
               aria-pressed="${!!t.done[h.id]}" aria-label="${h.name} today">${TICK}</button>`;
    } else {
      const n = sinceLast(h.id);
      tag = `every ${h.every === 1 ? 'day' : h.every + ' days'}`;
      if (t.done[h.id]) { fill = 1; say = '<b>done</b> today'; }
      else if (h.every === 1) { fill = 0; say = 'not yet today'; }
      else if (n === null) { fill = 1; say = 'never yet'; }
      else {
        fill = Math.min(1, n / h.every);
        const over = n - h.every;
        say = over >= 0
          ? (over === 0 ? '<b>due today</b>' : `<b>due</b> · ${over} ${over === 1 ? 'day' : 'days'} over`)
          : `${n} ${n === 1 ? 'day' : 'days'} since · due in ${h.every - n}`;
      }
      act = `<button type="button" class="tick ${t.done[h.id] ? 'on' : ''}" data-tick="${h.id}"
               aria-pressed="${!!t.done[h.id]}" aria-label="${h.name} today">${TICK}</button>`;
    }
    const over = !h.target && !h.perWeek && h.every > 1 && !t.done[h.id]
      && sinceLast(h.id) !== null && sinceLast(h.id) > h.every;
    return `<div class="hb-row">
      <span class="hb-name"><b>${h.name}</b><em>${tag}</em></span>
      <span class="hb-bar${over ? ' over' : ''}"><i style="width:${(fill * 100).toFixed(0)}%"></i></span>
      <span class="hb-act"><span class="hb-say">${say}</span>${act}</span>
    </div>`;
  }).join('');

  const kept = keptOn(TODAY).length;
  document.getElementById('hbToday').textContent =
    kept ? `${kept} so far today` : 'nothing yet today';
}

/* ── the week ── */
function weekOf(d) {
  const m = new Date(d);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));      // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(m, i));
}
function renderStrip() {
  const days = weekOf(new Date());
  document.getElementById('hbWeekLabel').textContent =
    `${days[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — `
    + `${days[6].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;

  document.getElementById('hbStrip').innerHTML = days.map((d) => {
    const k = iso(d);
    const ahead = k > TODAY;
    const dd = dueOn(k);
    const pips = ahead || !DAYS[k] ? ''
      : dd.map(id => `<s class="${DAYS[k].done[id] ? '' : 'off'}" title="${BY_ID[id].name}"></s>`).join('');
    const n = ahead || !DAYS[k] ? '' : keptOn(k).length;
    return `<div class="hb-day"${k === TODAY ? ' data-today="1"' : ''}${ahead ? ' data-ahead="1"' : ''}
        role="group" aria-label="${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric' })}${
          ahead ? ', still to come' : `, ${n} kept`}">
      <span class="wd">${d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
      <span class="dn">${d.getDate()}</span>
      <span class="hb-pips">${pips}</span>
      <span class="n">${n === '' ? '' : n}</span>
    </div>`;
  }).join('');

  const done = days.filter(d => iso(d) <= TODAY).reduce((a, d) => a + keptOn(iso(d)).length, 0);
  document.getElementById('hbWeekSum').textContent = done ? `${done} kept this week` : '';
}

/* ── the radars ──
   Same viewBox, same R, same cy, so at equal width they draw at equal
   size — a matching card around a visibly smaller picture still reads
   as mismatched. */
const pol = (cx, cy, r, deg) => {
  const a = (deg - 90) * Math.PI / 180;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
};
function radar(el, nEl, labels, vals, sub) {
  const n = labels.length, R = 68, cx = 100, cy = 106;
  const peak = Math.max(...vals, 0.0001);
  const poly = (f) => labels.map((_, i) => pol(cx, cy, f(i), i * 360 / n)
    .map(v => v.toFixed(1)).join(',')).join(' ');
  let g = [0.25, 0.5, 0.75, 1].map(k =>
    `<polygon class="ax" points="${poly(() => R * k)}" />`).join('');
  g += labels.map((_, i) => {
    const [x, y] = pol(cx, cy, R, i * 360 / n);
    return `<line class="spoke" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
  }).join('');
  /* A floor, so an arm at 10% is a visible dent rather than a point at
     the centre that reads as "no data". */
  g += `<polygon class="area" points="${poly(i => vals[i] ? Math.max(5, R * vals[i] / peak) : 0)}" />`;
  g += labels.map((_, i) => {
    if (!vals[i]) return '';
    const [x, y] = pol(cx, cy, Math.max(5, R * vals[i] / peak), i * 360 / n);
    return `<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" />`;
  }).join('');
  g += labels.map((t, i) => {
    const [x, y] = pol(cx, cy, R + 18, i * 360 / n);
    return `<text class="lab${vals[i] ? ' on' : ''}" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${t}</text>`;
  }).join('');
  el.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="${
    labels.map((t, i) => `${t}: ${Math.round(vals[i] * 100)}%`).join(', ')}">${g}</svg>`;
  nEl.textContent = sub;
}
function renderRadars() {
  const past = dayList.filter(k => k < TODAY);
  const byHabit = HABITS.map((h) => {
    const d = past.filter(k => h.perWeek ? true : due(h.id, k));
    if (!d.length) return 0;
    return d.filter(k => DAYS[k].done[h.id]).length / d.length;
  });
  const worst = HABITS[byHabit.indexOf(Math.min(...byHabit))];
  radar(document.getElementById('hbBy'), document.getElementById('hbByN'),
    HABITS.map(h => h.short), byHabit,
    `${worst.short} is the short arm`);

  const DOW = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const byDow = DOW.map((_, i) => {
    const d = past.filter(k => (new Date(k + 'T00:00:00').getDay() + 6) % 7 === i);
    const rs = d.map(rate).filter(x => x !== null);
    return rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : 0;
  });
  radar(document.getElementById('hbDow'), document.getElementById('hbDowN'),
    DOW, byDow, `${DOW[byDow.indexOf(Math.min(...byDow))]} is the day that goes`);
}

/* ── the ring ── */
function band(cx, cy, r0, r1, a0, a1) {
  const [x0, y0] = pol(cx, cy, r1, a0), [x1, y1] = pol(cx, cy, r1, a1);
  const [x2, y2] = pol(cx, cy, r0, a1), [x3, y3] = pol(cx, cy, r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${x0.toFixed(1)},${y0.toFixed(1)}A${r1},${r1} 0 ${big} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`
       + `L${x2.toFixed(1)},${y2.toFixed(1)}A${r0},${r0} 0 ${big} 0 ${x3.toFixed(1)},${y3.toFixed(1)}Z`;
}
function renderRing() {
  const WEEKS = 10, IN = 22, OUT = 80, cx = 100, cy = 100;
  const step = (OUT - IN) / WEEKS, wedge = 360 / 7, pad = 1.6;
  const mon0 = weekOf(new Date())[0];
  let g = '', kept = 0, of = 0;
  for (let w = 0; w < WEEKS; w++) {
    const m = addDays(mon0, -(WEEKS - 1 - w) * 7);
    weekOf(m).forEach((d, i) => {
      const k = iso(d);
      const r0 = IN + w * step + 0.7, r1 = IN + (w + 1) * step - 0.7;
      const path = band(cx, cy, r0, r1, i * wedge + pad, (i + 1) * wedge - pad);
      const v = DAYS[k] && k <= TODAY ? rate(k) : null;
      if (v === null) { g += `<path class="cell none" d="${path}" />`; return; }
      of++; if (v >= 0.999) kept++;
      /* Graded, unlike the backtesting ring: five things a day has real
         middles that one-a-day does not. */
      g += `<path class="cell" d="${path}" fill="var(--accent)"
              fill-opacity="${(0.14 + 0.74 * v).toFixed(2)}" />`;
    });
  }
  document.getElementById('hbRing').innerHTML =
    `<svg viewBox="0 0 200 200" role="img" aria-label="${kept} whole days in the last ${of}">${g}</svg>`;
  document.getElementById('hbRingN').textContent = of ? `${kept} whole days` : '';
}

/* ── the gaps ── */
function renderGaps() {
  const rows = HABITS.map(h => ({ h, ...runsFor(h.id) }))
    .sort((a, b) => b.worst - a.worst);
  const peak = Math.max(1, ...rows.map(r => Math.max(r.best, r.worst)));
  document.getElementById('hbGap').innerHTML =
    `<div style="width:100%;display:grid;gap:9px;padding:2px 0 8px">`
    + rows.map(r => `<div style="display:grid;grid-template-columns:78px 1fr auto;
        gap:10px;align-items:center;font-size:.72rem;color:var(--ink-3)">
        <span style="color:var(--ink-2)">${r.h.short}</span>
        <span style="height:4px;border-radius:3px;background:var(--glass-in-2);position:relative">
          <i style="position:absolute;left:0;top:0;height:4px;border-radius:3px;
             width:${(r.best / peak * 100).toFixed(0)}%;background:var(--accent)"></i>
        </span>
        <span style="font-family:var(--mono);font-size:.6rem">best ${r.best} · worst gap ${r.worst}</span>
      </div>`).join('') + `</div>`;
  document.getElementById('hbGapN').textContent = `${chain()} day chain`;
}

/* ── the log ── */
function renderLog() {
  const rows = dayList.filter(k => k <= TODAY).slice(-40).reverse();
  document.getElementById('hbLogMeta').textContent = `${rows.length} days`;
  let html = '', month = '';
  for (const k of rows) {
    const d = new Date(k + 'T00:00:00');
    const m = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (m !== month) { month = m; html += `<div class="hb-month"><b>${m}</b><i></i></div>`; }
    const kept = keptOn(k);
    const note = DAYS[k].note;
    /* Names what was kept. Never a denominator — the strip and the ring
       carry the shortfall, and a row that says "2 of 5" is a mark out
       of five however it is worded. */
    html += `<div class="lg" role="group">
      <span class="lg-when"><b>${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</b>
        ${d.toLocaleDateString('en-GB', { month: 'short' })}</span>
      <span class="lg-main">
        <span class="lg-top">
          <span class="lg-sym">${kept.length ? `${kept.length} kept` : 'nothing kept'}</span>
          ${kept.map(id => `<span class="lg-chip">${BY_ID[id].short}</span>`).join('')}
          <span class="lg-r">${(DAYS[k].amt.water || 0).toFixed(1)}L · ${DAYS[k].amt.read || 0}min</span>
        </span>
        ${note ? `<p class="lg-note">${note}</p>` : ''}
      </span>
      <span class="lg-noshot"></span>
    </div>`;
  }
  document.getElementById('hbLog').innerHTML = html;
}

/* ── paint ── */
function renderAll() {
  renderNow(); renderStrip(); renderRadars(); renderRing(); renderGaps(); renderLog();
  const c = chain();
  /* The chain leads. A total only ever climbs, so it says nothing about
     now; the chain is the figure that can be lost and is therefore the
     only one worth defending. */
  document.getElementById('hbMeta').textContent =
    `${c} ${c === 1 ? 'day' : 'days'} unbroken · five in seven keeps it`;
  /* Rolling and fixed agree across most single weeks, so the strip alone
     makes the toggle look broken. This is where the difference lives. */
  const n = dayList.filter(k => due('abs', k)).length;
  document.getElementById('decAnchorN').textContent =
    `abs came due ${n} times in these ten weeks`;
}
renderAll();

/* ── the controls ── */
document.getElementById('hbNow').addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const h = BY_ID[add.dataset.add], t = DAYS[TODAY];
    t.amt[h.id] = Math.max(0, +((t.amt[h.id] || 0) + +add.dataset.by).toFixed(2));
    t.done[h.id] = t.amt[h.id] >= h.target;
    renderAll();
    return;
  }
  const tick = e.target.closest('[data-tick]');
  if (!tick) return;
  const id = tick.dataset.tick;
  DAYS[TODAY].done[id] = !DAYS[TODAY].done[id];
  renderAll();
});

document.getElementById('decAnchor').addEventListener('click', (e) => {
  const b = e.target.closest('[data-anchor]');
  if (!b) return;
  ANCHOR = b.dataset.anchor;
  document.querySelectorAll('#decAnchor button').forEach(x =>
    x.setAttribute('aria-pressed', String(x === b)));
  renderAll();
});
document.getElementById('decMiss').addEventListener('click', (e) => {
  const b = e.target.closest('[data-miss]');
  if (!b) return;
  document.documentElement.dataset.miss = b.dataset.miss;
  document.querySelectorAll('#decMiss button').forEach(x =>
    x.setAttribute('aria-pressed', String(x === b)));
});
