/* The search field and the Add button, five ways each.
   Look only. Nothing here is saved and nothing here touches either app. */

const MAG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
  stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" />
  <path d="m20 20-3.6-3.6" /></svg>`;
const PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
  stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>`;

/* The neighbours it actually sits between. Without them a search field
   is judged against nothing, and every one of them looks fine. */
const REST = `<span class="ghost">System</span>
  <span class="ghost"><s></s>Grotto</span>
  <span class="a a1">${PLUS}Trade</span>`;

const SEARCH = [
  ['A', 'As it ships', 'a bordered box',
   'A one-pixel border and the panel fill. It reads as a box first and a field second, which '
   + 'is why it takes up more attention than it earns — nothing else in the topbar is drawn '
   + 'with a border.',
   (i) => `<span class="s s${i}">${MAG}<input type="search" placeholder="Search trades" /></span>`],

  ['B', 'A rule, not a box', 'three sides removed',
   'Only the line under it, which lights to the accent when you are typing. The lightest of '
   + 'the five and the closest to how the rest of the topbar is drawn &mdash; nothing else '
   + 'there has a border either.',
   (i) => `<span class="s s${i}">${MAG}<input type="search" placeholder="Search trades" /></span>`],

  ['C', 'A well', 'cut into the glass rather than sat on it',
   'No border at all: a darker inset with a hairline of shadow at the top, so it reads as a '
   + 'slot cut into the panel. Rounded fully, which is the only thing on the screen that '
   + 'would be &mdash; either a welcome break or an intruder.',
   (i) => `<span class="s s${i}">${MAG}<input type="search" placeholder="Search trades" /></span>`],

  ['D', 'With a key', 'and a reason to notice it',
   'The shipping box plus a key hint on the right. It gives the field a job you can see '
   + 'before you need it, and it is the only one of the five that makes the topbar teach you '
   + 'something. Costs a small piece of furniture that has to be kept true.',
   (i) => `<span class="s s${i}">${MAG}<input type="search" placeholder="Search trades" />
     <kbd>/</kbd></span>`],

  ['E', 'Collapsed to its icon', 'until you want it',
   'A magnifier that opens into a field when you click it. Hands the whole width back to the '
   + 'candle strip, which is the thing in that bar you actually read every day. The trade is '
   + 'a click before every search, and a field you cannot see is a field you forget is '
   + 'there.',
   (i) => `<button class="s s${i}" type="button" aria-label="Search trades">${MAG}
     <input type="search" placeholder="Search trades" tabindex="-1" /></button>`],
];

const ADD = [
  ['A', 'As it ships', 'the one white thing on the screen',
   'Pure white on glass. It is unmissable, which is the argument for it &mdash; and it is the '
   + 'brightest object in the app by a distance, including the figure that tells you what you '
   + 'made.',
   (i) => `<span class="a a${i}">${PLUS}Trade</span>`],

  ['B', 'The accent', 'the palette instead of white',
   'The same weight of statement in the backdrop’s own colour, so it changes with the '
   + 'palette instead of standing outside it. Quieter than white without becoming a ghost '
   + 'button.',
   (i) => `<span class="a a${i}">${PLUS}Trade</span>`],

  ['C', 'Outlined', 'an edge and nothing else',
   'No fill: an accent border and an accent plus. The quietest of the five and the one most '
   + 'likely to be missed on a screen you open in a hurry &mdash; which is exactly when you '
   + 'reach for it.',
   (i) => `<span class="a a${i}">${PLUS}Trade</span>`],

  ['D', 'A round plus', 'the word goes',
   'Icon only, and circular. Buys back the width of a word in a bar that is already crowded '
   + 'on a laptop, and the plus is the one glyph nobody has to be taught. Loses the word that '
   + 'says WHAT you are adding, which matters more here than in most apps.',
   (i) => `<span class="a a${i}" title="Trade">${PLUS}</span>`],

  ['E', 'Lit', 'the same treatment as the split marks',
   'A wash of accent with a bloom around it, the way the chosen split mark is drawn. It is '
   + 'the only option that ties the topbar to the language the rest of the app has just '
   + 'grown &mdash; and the only one that glows, which on a permanent control may be one '
   + 'thing too many.',
   (i) => `<span class="a a${i}">${PLUS}Trade</span>`],
];

const render = (id, set, kind) => {
  document.getElementById(id).innerHTML = set.map(([k, name, sub, why, fn], n) =>
    `<section class="opt">
       <div class="opt-h"><b>${k}</b><h2>${name}</h2><span>${sub}</span></div>
       <p class="why">${why}</p>
       <div class="bar">${kind === 'search'
         ? fn(n + 1) + REST
         : `<span class="s s1">${MAG}<input type="search" placeholder="Search trades" /></span>`
           + `<span class="ghost">System</span><span class="ghost"><s></s>Grotto</span>`
           + fn(n + 1)}</div>
     </section>`).join('');
};
render('searches', SEARCH, 'search');
render('adds', ADD, 'add');

/* E opens on click. A field you cannot see is a field you forget is
   there, so at least let it be one click away rather than two. */
document.querySelectorAll('.s5').forEach((el) => {
  el.addEventListener('click', () => {
    el.classList.add('open');
    el.querySelector('input').removeAttribute('tabindex');
    el.querySelector('input').focus();
  });
  el.querySelector('input').addEventListener('blur', (e) => {
    if (!e.target.value) el.classList.remove('open');
  });
});
