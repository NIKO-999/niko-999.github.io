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

   One kind of doing: a tick. An earlier draft had counters for the two
   habits with a number in them, on the argument that at two litres by
   four o'clock you want to see two litres. Wrong: thirty minutes of
   reading happens in one sitting and the water gets ticked at the end
   of the day, so the counter was asking for bookkeeping the day had
   already done.

   The numbers do not disappear, they change job. Three litres and
   thirty minutes stop being a total to reach and become part of what
   the habit IS, printed beside its name — so the tick means what it
   says rather than standing in for a measurement nobody took. */
const HABITS = [
  { id: 'water',   name: 'Water',        short: 'water',   is: '3 litres',   every: 1 },
  { id: 'walk',    name: 'Morning walk', short: 'walk',                      every: 1 },
  { id: 'read',    name: 'Reading',      short: 'reading', is: '30 minutes', every: 1 },
  { id: 'abs',     name: 'Abs',          short: 'abs',                       every: 2 },
  { id: 'workout', name: 'Workout',      short: 'workout',                   perWeek: 4 },
];
const BY_ID = Object.fromEntries(HABITS.map(h => [h.id, h]));

/* What a workout WAS. Stored on the day rather than on the habit,
   because it is a property of that morning and not of the rule.

   Rest is in the list and is not a workout: it is a day you decided not
   to train, which is worth recording and must not count toward four a
   week. Anything else would have the number lie to you in the
   flattering direction. */
const SPLITS = [
  { id: 'push', name: 'Push' },
  { id: 'pull', name: 'Pull' },
  { id: 'legs', name: 'Legs' },
  { id: 'rest', name: 'Rest' },
];
const trained = (k) => DAYS[k] && DAYS[k].split && DAYS[k].split !== 'rest';
const splitVar = (id) => `var(--sp-${id})`;

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
    const rec = { date: k, done: {}, note: '' };
    const keep = (p) => r() < (sat ? p - 0.3 : sun ? p - 0.12 : p);

    rec.done.water = keep(0.86);
    rec.done.walk = keep(0.74);
    rec.done.read = keep(0.55);
    /* Abs is only offered on days it was due, which is the whole point
       of the cadence — a day it was not due is not a day it was missed. */
    if (i <= lastAbs - 2 || lastAbs === -99) {
      rec.due_abs = true;
      rec.done.abs = keep(0.7);
      if (rec.done.abs) lastAbs = i;
    }
    /* A push-pull-legs rotation with rest days in it, so the calendar
       has a pattern rather than a scatter. */
    if (!sun && r() < 0.52) {
      rec.split = ['push', 'pull', 'legs'][Math.floor(r() * 3)];
    } else if (r() < 0.5) {
      rec.split = 'rest';
    }
    rec.done.workout = !!rec.split && rec.split !== 'rest';
    if (i < 66 && r() < 0.18) rec.note = [
      'Legs still going from yesterday. Walk instead.',
      'Read in the morning for once and it stuck.',
      'Long day. Water was the only one that happened.',
      'Everything early. Best I have felt in a fortnight.',
    ][Math.floor(r() * 4)];
    out[k] = rec;
  }
  /* Today, part-finished, so the list has something of each state. */
  const t = out[TODAY];
  t.done.water = false;
  t.done.walk = true;
  t.done.read = false;
  t.due_abs = true; t.done.abs = false;
  t.split = null; t.done.workout = false;
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
/* Two different questions, and conflating them undercounts you.

   keptOn  what was DUE and got done — the rate, the ring's arc, the
           radars, the chain. Anything that measures whether you are
           keeping up has to divide by what was actually asked of you.
   didOn   what you did, due or not. Abs a day early is still abs, and
           a screen that answers "one kept" when you did two is wrong
           in the direction that makes people stop using it.

   So the count in the middle of the ring is didOn and the arc is
   keptOn. Do more than was due and the arc fills while the number
   keeps climbing, which is the right shape for that day. */
const keptOn = (k) => dueOn(k).filter(id => DAYS[k] && DAYS[k].done[id]);
const didOn = (k) => HABITS.filter(h => DAYS[k] && DAYS[k].done[h.id]).map(h => h.id);

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
/* A day counts as KEPT when you did most of what was due on it. Not
   all: an all-or-nothing day makes the chain an all-or-nothing chain,
   which is the thing the tolerance exists to avoid. */
const KEPT_DAY = 0.6;
const TOLERANCE = 5;                            // ...of the last seven
const wasKept = (k) => { const r = rate(k); return r !== null && r >= KEPT_DAY; };
function chain() {
  let n = 0;
  for (let i = dayList.length - 1; i >= 0; i--) {
    const k = dayList[i];
    if (k === TODAY) continue;                 // today is not over
    const win = dayList.slice(Math.max(0, i - 6), i + 1);
    /* An average of the rates was the first attempt and it was the
       wrong shape: it read "five days in seven" as "71% of everything,
       every day", which nobody keeps for a week. This counts DAYS, the
       way the sentence beside it does. */
    if (win.filter(wasKept).length < Math.min(TOLERANCE, win.length)) break;
    n++;
  }
  return n;
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

/* ── today ──
   One ring, then the list. The ring answers "am I on track" and the
   list answers "with what", in that order — the first is what you open
   the screen for, the second is what you act on.

   The five bars go with it, and that trade is worth naming: five bars
   let you compare five habits against one another at a glance and one
   ring does not. What it buys is a screen that has told you something
   before you have read a word, and a face you know from across the
   room.

   Everything is a tick. The dot is solid or hollow, the same shape
   language the check-in pad uses, and there is no partial to draw:
   thirty minutes of reading happens in one sitting and the water is
   ticked at the end of the day. */
function renderNow() {
  const t = DAYS[TODAY];

  const items = HABITS.map((h) => {
    const on = !!t.done[h.id];
    let say;
    if (h.perWeek) {
      const wk = weekOf(new Date()).map(iso).filter(k => k <= TODAY);
      const n = wk.filter(k => DAYS[k] && DAYS[k].done[h.id]).length;
      const left = 7 - wk.length;
      say = `<b>${n}</b> this week · ${left} ${left === 1 ? 'day' : 'days'} left`;
    } else if (on) {
      say = '<b>done</b> today';
    } else if (h.every === 1) {
      say = 'not yet today';
    } else {
      /* The gap clock survives the counters, because it is about
         CADENCE rather than about an amount — how long since is the one
         thing a tick cannot tell you. */
      const n = sinceLast(h.id);
      if (n === null) say = 'never yet';
      else {
        const over = n - h.every;
        say = over >= 0
          ? (over === 0 ? '<b>due today</b>'
                        : `<b>due</b> · ${over} ${over === 1 ? 'day' : 'days'} over`)
          : `${n} ${n === 1 ? 'day' : 'days'} since · due in ${h.every - n}`;
      }
    }
    /* The workout is the one row that is not a plain tick, because
       there are four answers rather than two. The words live HERE and
       nowhere else — every other place it appears is a colour. */
    if (h.perWeek) {
      const cur = t.split || null;
      if (cur) say = cur === 'rest' ? '<b>rest day</b>' : '<b>worked out</b>';
      const dotc = cur ? ` style="background:${splitVar(cur)};box-shadow:none"` : '';
      return `<div class="hb-item"${on ? ' data-on="1"' : ''}>
        <s class="hb-dot"${cur ? ' data-on="1"' : ''}${dotc}></s>
        <span class="hb-nm"><b>${h.name}</b></span>
        <span class="hb-say">${say}</span>
        <span class="hb-act"><span class="hb-split">${SPLITS.map(sp =>
          `<button type="button" data-split="${sp.id}" aria-pressed="${cur === sp.id}"
             style="--c:${splitVar(sp.id)}" title="${sp.name}" aria-label="${sp.name}">
             <i aria-hidden="true"></i></button>`).join('')}</span></span>
      </div>`;
    }
    return `<div class="hb-item"${on ? ' data-on="1"' : ''}>
      <s class="hb-dot"${on ? ' data-on="1"' : ''}></s>
      <span class="hb-nm"><b>${h.name}</b>${h.is ? `<em>${h.is}</em>` : ''}</span>
      <span class="hb-say">${say}</span>
      <span class="hb-act"><button type="button" class="tick ${on ? 'on' : ''}"
        data-tick="${h.id}" aria-pressed="${on}" aria-label="${h.name} today">${TICK}</button></span>
    </div>`;
  }).join('');

  /* The ring, then the list, written in ONE string. Splicing an opening
     <div> in with insertAdjacentHTML and closing it in a second call
     does not work: the parser closes the tag at the end of the first
     fragment, so the list ends up beside its wrapper rather than in it.
     It looks almost right, which is the worst kind of almost. */
  const did = didOn(TODAY).length, kept = keptOn(TODAY).length, of = dueOn(TODAY).length;
  const p = of ? Math.min(1, kept / of) : (did ? 1 : 0);
  const C = 2 * Math.PI * 44;
  document.getElementById('hbNow').innerHTML =
    `<div class="hb-dial"><svg viewBox="0 0 100 100" role="img"
       aria-label="${did} done so far today">
       <circle class="tr" cx="50" cy="50" r="44" />
       <circle class="fl" cx="50" cy="50" r="44"
         stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" />
       <text class="mid" x="50" y="52">${did}</text>
       <text class="sub" x="50" y="64">DONE TODAY</text>
     </svg></div>
     <div class="hb-list">${items}</div>`;

  document.getElementById('hbToday').textContent =
    of ? `${of} due today` : 'nothing due today';
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
      : dd.map(id => `<s class="${DAYS[k].done[id] ? '' : 'off'}" title="${BY_ID[id].name}"></s>`).join('')
        /* The split rides along on its own mark rather than replacing a
           habit's — the workout is never due on a given day, so it has
           no pip of its own to colour. */
        + (DAYS[k].split ? `<s style="background:${splitVar(DAYS[k].split)}"></s>` : '');
    const n = ahead || !DAYS[k] ? '' : didOn(k).length;
    return `<div class="hb-day"${k === TODAY ? ' data-today="1"' : ''}${ahead ? ' data-ahead="1"' : ''}
        role="group" aria-label="${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric' })}${
          ahead ? ', still to come' : `, ${n} kept`}">
      <span class="wd">${d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
      <span class="dn">${d.getDate()}</span>
      <span class="hb-pips">${pips}</span>
      <span class="n">${n === '' ? '' : n}</span>
    </div>`;
  }).join('');

  const done = days.filter(d => iso(d) <= TODAY).reduce((a, d) => a + didOn(iso(d)).length, 0);
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

/* ── the log, five ways ──
   All five read the same window so the only thing being judged is the
   shape. Twenty-eight days: four clean weeks, which is what makes the
   grid and the month legible and is about as far back as any of this is
   worth looking. */
const WINDOW = 28;
const recent = () => dayList.filter(k => k <= TODAY).slice(-WINDOW);
/* Three states, and the third one is the whole reason the grid works:
     on    due and done, or done anyway
     miss  due and not done
     na    nothing was asked of you — drawn BLANK rather than empty,
           because a gap you can see through is not a miss

   A perWeek habit is never due on a particular DAY, so without a case
   for it the whole workout row came out blank: due() said no for all
   twenty-eight, and the days it was actually done vanished with them. It
   owes the week, so a day is either one it happened on or one nothing
   was asked. */
const state = (id, k) => {
  const h = BY_ID[id];
  if (h.perWeek) return DAYS[k] && DAYS[k].done[id] ? 'on' : 'na';
  return !due(id, k) ? 'na' : (DAYS[k].done[id] ? 'on' : 'miss');
};

/* A · rows, as they stand. */
function logRows() {
  const rows = recent().slice().reverse();
  let html = '', month = '';
  for (const k of rows) {
    const d = new Date(k + 'T00:00:00');
    const m = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (m !== month) { month = m; html += `<div class="hb-month"><b>${m}</b><i></i></div>`; }
    const kept = didOn(k);
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
          <span class="lg-r">${dueOn(k).length === kept.length ? 'all of them' : ''}</span>
        </span>
        ${note ? `<p class="lg-note">${note}</p>` : ''}
      </span>
      <span class="lg-noshot"></span>
    </div>`;
  }
  return html;
}

/* The month, and only the month. The calendar's own shape, so a habit
   month and a trading month are read the same way and neither has to be
   learned twice.

   The other four treatments are in the history if they are ever wanted:
   a grid, a chain per habit, rows, and a notable-only filter. */
function logMonth() {
  const days = recent();
  const first = new Date(days[0] + 'T00:00:00');
  const pad = (first.getDay() + 6) % 7;            // Monday-first
  const head = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    .map(d => `<span class="hd">${d}</span>`).join('');
  const cells = Array.from({ length: pad }, () => '<div class="cell pad"></div>')
    .concat(days.map((k) => {
      const d = new Date(k + 'T00:00:00');
      /* Due OR done — dueOn alone drops the workout, which is never due
         on a given day and so would never appear on any of them. */
      const pips = HABITS.filter(h => !h.perWeek && (due(h.id, k) || DAYS[k].done[h.id]))
        .map(h => `<i class="${DAYS[k].done[h.id] ? '' : 'off'}"></i>`).join('');
      /* And the split, as a bar across the foot of the cell. Its own
         row rather than a sixth pip: it is a different KIND of fact
         from "did you keep this", and the two would be read as one. */
      const sp = DAYS[k].split;
      return `<div class="cell"${k === TODAY ? ' data-today="1"' : ''}>
        <b>${d.getDate()}</b><span class="pips">${pips}</span>
        <span class="sp"${sp ? ` style="background:${splitVar(sp)}"` : ''}></span></div>`;
    })).join('');
  return `<div class="mon">${head}${cells}</div>`;
}

function renderLog() {
  document.getElementById('hbLogs').innerHTML = logMonth();
  const days = recent();
  const n = days.filter(k => DAYS[k].split && DAYS[k].split !== 'rest').length;
  document.getElementById('hbLogMeta').textContent =
    `${days.length} days · ${n} ${n === 1 ? 'session' : 'sessions'}`;
}

/* ── paint ── */
function renderAll() {
  renderNow(); renderStrip(); renderRadars(); renderLog();
  /* All six share one state, so a click on any of them has to repaint
     the other five or they disagree with the screen and with each
     other. */
  if (document.getElementById('hbDecs').children.length) renderDecs();
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
  const sp = e.target.closest('[data-split]');
  if (sp) {
    const id = sp.dataset.split;
    /* Pressing the one already chosen clears it — otherwise a mistaken
       tap on a four-way control has no way back. */
    DAYS[TODAY].split = DAYS[TODAY].split === id ? null : id;
    DAYS[TODAY].done.workout = !!DAYS[TODAY].split && DAYS[TODAY].split !== 'rest';
    renderAll();
    return;
  }
  const tick = e.target.closest('[data-tick]');
  if (!tick) return;
  const id = tick.dataset.tick;
  DAYS[TODAY].done[id] = !DAYS[TODAY].done[id];
  renderAll();
});

/* The month, folded. Shut on a machine that has never opened it, and
   remembered after that — the same terms as every other fold in the
   app, because a control that forgets is a control you stop using. */
(function () {
  const K = 'habits.month.v1';
  const btn = document.getElementById('hbMoreT');
  const body = document.getElementById('hbMoreB');
  const fold = (on) => {
    btn.setAttribute('aria-expanded', String(on));
    body.hidden = !on;
    try { localStorage.setItem(K, on ? '1' : '0'); } catch (e) {}
  };
  btn.addEventListener('click', () => fold(btn.getAttribute('aria-expanded') !== 'true'));
  let was = null;
  try { was = localStorage.getItem(K); } catch (e) {}
  fold(was === '1');
})();

/* ══ the two decisions, asked six ways ═══════════════════════════
   The pair of buttons is the app's `.side` group and it is everywhere,
   so this is a house pattern being chosen rather than preview
   furniture. All six share ONE state — click any and the screen moves
   and the other five agree, because a control you can only look at
   tells you nothing about whether you would use it. */
const DECS = [
  { k: 'anchor', q: 'Every 2 days counts from',
    a: [{ v: 'roll',  t: 'Last time you did it',
          why: 'A late day never cascades into being permanently late.',
          pic: ['','gap','','gap','gap','','gap',''] },
        { v: 'fixed', t: 'A fixed grid',
          why: 'The schedule stays honest and one slip costs you twice.',
          pic: ['','gap','','gap','','gap','','gap'] }] },
  { k: 'miss', q: 'A missed day is',
    a: [{ v: 'none', t: 'An absence',
          why: 'Nothing is drawn. A gap you can see through is not a mark.',
          pic: ['','o','','','o','','o',''] },
        { v: 'red',  t: 'Marked red',
          why: 'You are told. Harder to ignore, harder to look at daily.',
          pic: ['','r','','','r','','r',''] }] },
];
const DEC = { anchor: 'roll', miss: 'none' };
const pic = (cls) => `<span class="t-pic">${cls.map(c =>
  `<i class="${c}"></i>`).join('')}</span>`;
const cur = (d) => d.a.find(x => x.v === DEC[d.k]);
const other = (d) => d.a.find(x => x.v !== DEC[d.k]);

const TREATS = [
  ['A', 'The segmented pair', 'What is on the screen now, and in the log’s filters. '
    + 'Compact, and the pressed one is a fill you have to look for.',
   (d) => `<span class="t-seg" role="group" aria-label="${d.q}">${d.a.map(x =>
     `<button type="button" data-k="${d.k}" data-v="${x.v}"
        aria-pressed="${DEC[d.k] === x.v}">${x.t}</button>`).join('')}</span>`],

  ['B', 'A sliding thumb', 'One track, and the answer is where the thumb IS rather than '
    + 'which half is shaded. Movement reads faster than a fill.',
   (d) => {
     const i = d.a.findIndex(x => x.v === DEC[d.k]);
     return `<span class="t-slide" role="group" aria-label="${d.q}">
       <i style="left:${i ? '50%' : '3px'};width:calc(50% - 3px)"></i>${d.a.map(x =>
       `<button type="button" data-k="${d.k}" data-v="${x.v}"
          aria-pressed="${DEC[d.k] === x.v}">${x.t}</button>`).join('')}</span>`;
   }],

  ['C', 'A switch', 'The two answers either side of it, both clickable. Familiar to the point '
    + 'of invisible — and the weakest of the six when neither answer is the "on" one.',
   (d) => `<span class="t-sw">${
     `<span class="${DEC[d.k] === d.a[0].v ? 'on' : ''}" data-k="${d.k}" data-v="${d.a[0].v}">${d.a[0].t}</span>`
     }<button type="button" role="switch" data-k="${d.k}" data-v="${
       DEC[d.k] === d.a[0].v ? d.a[1].v : d.a[0].v}"
       aria-checked="${DEC[d.k] === d.a[1].v}" aria-label="${d.q}"><i></i></button>${
     `<span class="${DEC[d.k] === d.a[1].v ? 'on' : ''}" data-k="${d.k}" data-v="${d.a[1].v}">${d.a[1].t}</span>`
     }</span>`],

  ['D', 'Two rows', 'Full width, one dot each, and room to say what the answer MEANS. '
    + 'Costs the most height and is the only one that explains itself.',
   (d) => `<span class="t-rows" role="group" aria-label="${d.q}">${d.a.map(x =>
     `<button type="button" data-k="${d.k}" data-v="${x.v}" aria-pressed="${DEC[d.k] === x.v}">
        <s aria-hidden="true"></s><span><b>${x.t}</b><em>${x.why}</em></span></button>`).join('')}</span>`],

  ['E', 'A sentence', 'The setting reads as prose and the choice is the only emphasised part. '
    + 'The quietest, and the one that stops looking like a form.',
   (d) => `<span class="t-say">${d.q.replace(/^E/, 'e')} <b>${cur(d).t.toLowerCase()}</b>.
     <button type="button" data-k="${d.k}" data-v="${other(d).v}">use ${
       other(d).t.toLowerCase()}</button></span>`],

  ['F', 'Two pictures', 'Each answer shows what it DOES. Both of these decisions are about how '
    + 'something looks, and a picture of the answer beats naming it.',
   (d) => `<span class="t-cards" role="group" aria-label="${d.q}">${d.a.map(x =>
     `<button type="button" data-k="${d.k}" data-v="${x.v}" aria-pressed="${DEC[d.k] === x.v}">
        ${pic(x.pic)}<b>${x.t}</b></button>`).join('')}</span>`],
];

function renderDecs() {
  document.getElementById('hbDecs').innerHTML = TREATS.map(([k, name, why, fn]) =>
    `<section class="dc"><h4><b>${k}</b>${name}</h4><p>${why}</p>
       <div class="body">${DECS.map(d =>
         `<div><span class="q">${d.q}</span>${fn(d)}</div>`).join('')}</div></section>`).join('');
}

document.getElementById('hbDecs').addEventListener('click', (e) => {
  const b = e.target.closest('[data-k][data-v]');
  if (!b) return;
  DEC[b.dataset.k] = b.dataset.v;
  ANCHOR = DEC.anchor;
  document.documentElement.dataset.miss = DEC.miss;
  renderAll();
});
renderDecs();
