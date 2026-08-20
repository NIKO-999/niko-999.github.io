/* Reminders — five treatments of one list, and three of one dot.
   Look only. Nothing here is saved and nothing here touches the app. */

const REMS = [
  { t: 'Book the dentist',          d: -2 },
  { t: 'Renew the gym membership',  d: 0 },
  { t: 'Pay the car insurance',     d: 3 },
  { t: 'Order new running shoes',   d: null },
];

/* Urgency, and it has three states rather than a gradient. A gradient
   needs reading; three states are recognised. */
const urg = (d) => d === null ? 'none' : d < 0 ? 'late' : d <= 2 ? 'soon' : 'clear';
const say = (d) => d === null ? 'no date'
  : d === 0 ? 'today' : d === 1 ? 'tomorrow' : d === -1 ? 'yesterday'
  : d > 0 ? `in ${d} days` : `${-d} days ago`;
const uv = (u) => u === 'none' ? 'var(--ink-3)' : `var(--u-${u})`;
const stamp = (d) => {
  if (d === null) return ['—', '—'];
  const x = new Date(); x.setDate(x.getDate() + d);
  return [x.toLocaleDateString('en-GB', { month: 'short' }), String(x.getDate())];
};

const row = (r, inner) => {
  const u = urg(r.d);
  return `<div class="r" data-u="${u}" style="--u:${uv(u)}">${inner(r, u)}</div>`;
};
const tail = (r) => `<span class="when">${say(r.d)}</span>
  <button class="x" type="button" aria-label="Delete: ${r.t}">✕</button>`;

const OPTS = [
  ['A', 'As it ships', 'no colour at all',
   'One line per reminder, overdue lifted to full ink. Nothing wrong with it, and nothing '
   + 'about it makes you look. The complaint that started this.',
   () => REMS.map(r => row(r, (x) => `<p>${x.t}</p>${tail(x)}`)).join('')],

  ['B', 'A lit dot', 'one lamp per row',
   'The same row with a lamp on the left: red overdue, amber due within two days, green with '
   + 'time in hand, and an empty ring for one with no date. The dot is lit rather than filled '
   + '— a surface and a bloom, so it reads as ON rather than as a swatch.',
   () => REMS.map(r => row(r, (x, u) =>
     `<s class="lamp"${u === 'none' ? ' data-off="1"' : ''}></s><p>${x.t}</p>${tail(x)}`)).join('')],

  ['C', 'The edge', 'colour in the margin, not the row',
   'The same three states as a bar down the left edge of each row. It never sits inside the '
   + 'sentence you are reading, which makes it the quietest way to carry a colour — and the '
   + 'easiest to miss.',
   () => REMS.map(r => row(r, (x) => `<p>${x.t}</p>${tail(x)}`)).join('')],

  ['D', 'Grouped, with a date chip', 'the list becomes a shape',
   'Overdue, this week, later, someday — with a torn-calendar chip carrying the date and the '
   + 'colour together. The biggest change of the five: a flat list becomes something you scan '
   + 'by section, and the urgency is in the heading as much as in the colour.',
   () => {
     const G = [['Overdue', r => r.d !== null && r.d < 0],
                ['This week', r => r.d !== null && r.d >= 0 && r.d <= 7],
                ['Later', r => r.d !== null && r.d > 7],
                ['Someday', r => r.d === null]];
     return G.map(([name, f]) => {
       const rs = REMS.filter(f);
       if (!rs.length) return '';
       return `<div class="grp"><b>${name}</b><i></i><em>${rs.length}</em></div>`
         + rs.map(r => row(r, (x, u) => {
             const [m, dnum] = stamp(x.d);
             return `<span class="chip" data-u="${u}"><s>${m}</s><b>${dnum}</b></span>`
               + `<p>${x.t}</p>`
               + `<button class="x" type="button" aria-label="Delete: ${x.t}">✕</button>`;
           })).join('');
     }).join('');
   }],

  ['E', 'A countdown ring', 'how much time is left, drawn',
   'A small ring per row that empties as the date comes up, and fills solid once it has gone '
   + 'by. It rhymes with the dial on the habits screen. The only one of the five that shows a '
   + 'QUANTITY rather than a state — which is either the point or one detail too many.',
   () => REMS.map(r => row(r, (x, u) => {
     const C = 2 * Math.PI * 9;
     /* Fourteen days of lead is the full ring; anything longer is full
        and anything past due is solid. */
     const p = x.d === null ? 0 : x.d < 0 ? 1 : Math.min(1, x.d / 14);
     return `<span class="ring"><svg viewBox="0 0 24 24" aria-hidden="true">
         <circle class="tr" cx="12" cy="12" r="9" />
         ${x.d === null ? '' : x.d < 0
           ? `<circle class="dot" cx="12" cy="12" r="5" />`
           : `<circle class="fl" cx="12" cy="12" r="9"
                stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" />`}
       </svg></span><p>${x.t}</p>${tail(x)}`;
   })).join('')],
];

document.getElementById('opts').innerHTML = OPTS.map(([k, name, sub, why, fn]) =>
  `<section class="opt v${k}">
     <div class="opt-h"><b>${k}</b><h2>${name}</h2><span>${sub}</span></div>
     <p class="why">${why}</p>
     <div class="frame">${fn()}</div>
   </section>`).join('');

/* ── the little circles ── */
const SPL = [['push', '#'], ['pull', '#'], ['legs', '#'], ['rest', '#']];
document.getElementById('lamps').innerHTML = ['flat', 'lit', 'loud'].map(k =>
  `<div><span>${k}</span><span class="pick ${k}">${SPL.map(([id], i) =>
    `<button type="button" style="--c:var(--sp-${id})" aria-pressed="${i === 0}"
       aria-label="${id}"><i></i></button>`).join('')}</span></div>`).join('');

document.getElementById('lamps').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  [...b.parentElement.children].forEach(x => x.setAttribute('aria-pressed', String(x === b)));
});
