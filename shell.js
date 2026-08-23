/* ═══════════════════════════════════════════════════════════════
   ARC SHELL — appearance and backdrop, shared.

   Expects the standard shell markup: #themeBtn, #themeRail, #palBtn,
   #palMenu, #palLabel and a #say live region. Any app that includes
   the shell gets light/dark, the five photographs and the picker
   without re-implementing them.
   ═══════════════════════════════════════════════════════════════ */
'use strict';
(function () {
const say = document.getElementById('say') || { textContent: '' };

/* Photographs are resolved against THIS FILE, not against the page that
   included it. A bare `bg/…` looked for /trading/bg/ and 404'd all five,
   so a second app got no backdrop at all — the one thing the shell
   exists to keep identical. Captured now: currentScript is null by the
   time the idle callback runs. */
const HERE = (document.currentScript && document.currentScript.src) || location.href;
const asset = (p) => new URL(p, HERE).href;

/* ── theme ──
   Three states, not two: System follows the phone, and the two explicit
   choices override it. Stored so it survives a reload. */
/* localStorage can throw on ACCESS (private browsing, sandboxed frames).
   Reading it bare at the top of this block would take out everything
   below — palette, picker, layout — and leave a black page. */
function readStore(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function writeStore(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

const KEY = 'arc.theme';
const MODES = ['system', 'light', 'dark'];
const LABEL = { system: 'System', light: 'Light', dark: 'Dark' };
/* All three drawn to the same 18-unit ink box as every other rail glyph,
   centred on 12,12 — otherwise the appearance control reads a size
   smaller than the tabs above it. */
const ICON = {
  system: 'M3 4.5h18v11H3zM8.5 20.5h7M12 15.5v5',
  light:  'M12 3v2M12 19v2M5 12H3M21 12h-2M6.9 6.9 5.5 5.5M18.5 18.5l-1.4-1.4'
        + 'M17.1 6.9l1.4-1.4M5.5 18.5l1.4-1.4M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Z',
  dark:   'M21 13.2A9.4 9.4 0 1 1 10.8 3a7.3 7.3 0 0 0 10.2 10.2Z',
};

const media = window.matchMedia('(prefers-color-scheme: dark)');
const themeBtn  = document.getElementById('themeBtn');
const themeRail = document.getElementById('themeRail');
/* Validated, not taken at face value. A stored value this does not
   know reaches dataset.resolved verbatim — so no theme rule matches,
   the appearance label renders empty, and ICON[mode] is undefined,
   which SVG reports as two `<path d="undefined">` errors a load. The
   palette beside it has always been checked; this was not. */
let mode = MODES.includes(readStore(KEY)) ? readStore(KEY) : 'system';

function paint() {
  const resolved = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
  document.documentElement.dataset.resolved = resolved;
  const path = `<path d="${ICON[mode]}" />`;
  document.getElementById('themeLabel').textContent = LABEL[mode];
  document.getElementById('themeIcon').innerHTML = path;
  themeRail.querySelector('svg').innerHTML = path;
  /* The visible label already says which mode it is; the button needs a
     name that says WHAT it is. aria-live on the control itself made
     screen readers announce the name change twice, or not at all. */
  themeBtn .setAttribute('aria-label', `Appearance: ${LABEL[mode]}`);
  themeRail.setAttribute('aria-label', `Appearance: ${LABEL[mode]}`);
}

function cycle() {
  mode = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
  writeStore(KEY, mode);
  paint();
  say.textContent = `Appearance: ${LABEL[mode]}.`;
}

/* ── colour schemes ──
   Orthogonal to light/dark: every scheme has both, so the two controls
   never fight. The swatch dot reads its colour from the live token
   rather than a hard-coded hex, so a scheme can never drift out of sync
   with the swatch that claims to show it. */
const PKEY = 'arc.palette';
/* A backdrop and a palette are no longer the same thing. Fourteen
   photographs share eight palettes between them — the two canyons take
   the same warm accent, the four waters take the same cyan — so the
   colour is named separately and pointed at.

   id, name, description, section, palette. */
const BACKDROPS = [
  ['turtle',    'Turtle',    'A sea turtle in near-black water',      'Nature',   'slate'],
  ['canyon',    'Canyon',    'Slot canyon walls, lit orange',         'Nature',   'ember'],
  ['desert',    'Desert',    'Red sand under a dusk sky',             'Nature',   'ember'],
  ['nightfall', 'Nightfall', 'A canyon opening onto a starfield',     'Nature',   'cyan'],
  ['iceberg',   'Iceberg',   'Turquoise ice over still water',        'Nature',   'cyan'],
  ['delta',     'Delta',     'A river delta from orbit',              'Nature',   'cyan'],
  ['curve',     'Curve',     'A pale curve under a warm light',       'Abstract', 'vellum'],
  ['cobalt',    'Cobalt',    'Folded blue forms',                     'Abstract', 'cobalt'],
  ['abyss',     'Abyss',     'Teal waves in the dark',                'Abstract', 'cyan'],
  ['jade',      'Jade',      'A green ribbon, almost black',          'Abstract', 'jade'],
  ['violet',    'Violet',    'Deep violet, one fold of light',        'Abstract', 'violet'],
  ['iris',      'Iris',      'Pale petals against black',             'Abstract', 'violet'],
  ['umber',     'Umber',     'Warm brown, a single highlight',        'Abstract', 'umber'],
  ['silk',      'Silk',      'Grey silk, folded and lit',             'Abstract', 'slate'],
];
const SECTIONS_ORDER = ['Nature', 'Abstract'];
const bgOf = (id) => BACKDROPS.find(b => b[0] === id);

const palBtn   = document.getElementById('palBtn');
const palMenu  = document.getElementById('palMenu');
const palLabel = document.getElementById('palLabel');
let palette = readStore(PKEY) || 'nightfall';
/* The old five are gone. Anything stored from them names a backdrop
   that no longer exists, which would leave the page with no photograph
   at all, so it falls back rather than failing. */
if (!bgOf(palette)) palette = 'nightfall';

/* ── the menu, in two levels ──
   Fourteen in one list is a scroll and a hunt. So the first level is the
   two sections and the second is the backdrops inside one of them, with
   a way back. The radiogroup lives on the second level only — the
   sections are a route to the choice, not the choice.

   Which means #palMenu cannot itself be the radiogroup any more; it is
   a container, and the group is built inside it. */
palMenu.removeAttribute('role');
palMenu.removeAttribute('aria-label');

let level = null;          // null = the section list, else a section name

function sectionMembers(name) {
  return BACKDROPS.filter(b => (b[3] || 'Nature') === name);
}

function drawSections() {
  level = null;
  palMenu.innerHTML = '';
  palMenu.className = 'pal-menu';
  SECTIONS_ORDER.forEach((name) => {
    const members = sectionMembers(name);
    if (!members.length) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pal-cat';
    b.dataset.section = name;
    const here = members.some(m => m[0] === palette);
    b.innerHTML = `<span class="dot" aria-hidden="true"></span>${name}`
      + `<span class="pal-n">${members.length}</span>`
      + `<svg class="pal-chev" viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>`;
    /* The section's dot shows the palette of whatever is selected inside
       it, or of its first member — so the row carries a colour rather
       than being a word with a grey circle. */
    /* The section's dot shows whichever backdrop is selected inside it,
       or its first, so the row carries a picture rather than a word and
       a grey circle. */
    b.querySelector('.dot').dataset.bg = (here ? bgOf(palette) : members[0])[0];
    b.setAttribute('aria-label', `${name}, ${members.length} backdrops`);
    b.addEventListener('click', () => drawSection(name));
    palMenu.appendChild(b);
  });
  const first = palMenu.querySelector('.pal-cat');
  if (first) first.focus();
}

function drawSection(name) {
  level = name;
  palMenu.innerHTML = '';
  palMenu.className = 'pal-menu pal-deep';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'pal-back';
  back.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none"
      stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>${name}`;
  back.setAttribute('aria-label', 'Back to sections');
  back.addEventListener('click', () => drawSections());
  palMenu.appendChild(back);

  const group = document.createElement('div');
  group.className = 'pal-group';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', `${name} backdrops`);
  sectionMembers(name).forEach(([id, label, desc, sect, pal]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.setAttribute('role', 'radio');
    b.tabIndex = -1;
    b.dataset.palette = id;
    b.innerHTML =
      `<span class="dot" aria-hidden="true"></span>${label}`
      + `<svg class="tick-mark" viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2.6" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>`;
    /* The picture, not the palette — see .dot[data-bg] in shell.css. */
    b.querySelector('.dot').dataset.bg = id;
    b.title = desc;
    b.setAttribute('aria-label', `${label}, ${sect.toLowerCase()} — ${desc}`);
    b.addEventListener('click', () => { setPalette(id); closePal(true); });
    group.appendChild(b);
  });
  palMenu.appendChild(group);
  markChecked();
  (group.querySelector('[aria-checked="true"]') || group.firstElementChild).focus();
  /* Only what is on screen gets fetched. Warming all fourteen would pull
     seven megabytes to show one. */
  sectionMembers(name).forEach(([id]) => { new Image().src = asset(`arc/bg/${id}.jpg`); });
}

function markChecked() {
  palMenu.querySelectorAll('.swatch').forEach((sw) => {
    const on = sw.dataset.palette === palette;
    sw.setAttribute('aria-checked', String(on));
    sw.tabIndex = on ? 0 : -1;
  });
}

function setPalette(id) {
  const row = bgOf(id) || bgOf('nightfall');
  palette = row[0];
  writeStore(PKEY, palette);
  /* Two attributes now: one chooses the photograph and the glass behind
     the panel, the other chooses the colour. */
  document.documentElement.dataset.bg = palette;
  document.documentElement.dataset.palette = row[4];
  palLabel.textContent = row[1];
  palBtn.setAttribute('aria-label', `Backdrop: ${row[1]}`);
  markChecked();
  say.textContent = `Backdrop: ${row[1]}.`;
}

function openPal() {
  palMenu.hidden = false;
  palBtn.setAttribute('aria-expanded', 'true');
  /* Open where you are: the section holding the current backdrop, so the
     tick is on screen rather than two clicks away. */
  drawSection((bgOf(palette) || [])[3] || SECTIONS_ORDER[0]);
}
/* Focus goes back to the trigger on close, or a keyboard user is dumped
   at the top of the document every time they pick a scheme. */
function closePal(refocus) {
  palMenu.hidden = true;
  palBtn.setAttribute('aria-expanded', 'false');
  if (refocus) palBtn.focus();
}

palBtn.addEventListener('click', () => {
  palMenu.hidden ? openPal() : closePal(true);
});
palMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    /* Escape steps back out of a section first, and only closes from the
       top — otherwise the way in has no matching way out. */
    if (level) drawSections(); else closePal(true);
    return;
  }
  const items = [...palMenu.querySelectorAll('.swatch, .pal-cat')];
  if (!items.length) return;
  const i = items.indexOf(document.activeElement);
  const fwd  = e.key === 'ArrowDown' || e.key === 'ArrowRight';
  const back = e.key === 'ArrowUp'   || e.key === 'ArrowLeft';
  let next = -1;
  if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = items.length - 1;
  else if (fwd || back) {
    if (i < 0) return;
    next = (i + (fwd ? 1 : -1) + items.length) % items.length;
  } else return;
  e.preventDefault();
  items[next].focus();
  /* A radiogroup selects on arrow; the section list only moves focus. */
  if (items[next].classList.contains('swatch')) setPalette(items[next].dataset.palette);
});
/* Focus leaving the widget closes it — otherwise Tab out of the open
   menu left it floating with Escape dead, since Escape was bound inside.

   Checked a tick later, and against where focus actually ENDED UP rather
   than against relatedTarget. Stepping between the two levels empties
   the menu, which drops focus to <body> with a null relatedTarget — read
   literally that is indistinguishable from tabbing away, so Back closed
   the picker instead of going back. A frame later the redraw has put
   focus inside again and the difference is obvious. */
const pal = document.querySelector('.pal');
pal.addEventListener('focusout', () => {
  setTimeout(() => {
    if (!palMenu.hidden && !pal.contains(document.activeElement)) closePal(false);
  }, 0);
});
document.addEventListener('pointerdown', (e) => {
  if (!palMenu.hidden && !e.target.closest('.pal')) closePal(false);
});

setPalette(palette);

/* The backdrop picker is gone, and so is what it stored: a 4K photograph
   left in IndexedDB would sit there for good, unreachable and costing
   real disk. Nothing is lost — the file it copied is still wherever you
   chose it from. */
(function () {
  try {
    if (localStorage.getItem('arc.bg.own') !== null) localStorage.removeItem('arc.bg.own');
    if (indexedDB.databases) {
      indexedDB.databases().then(ds => {
        if (ds.some(d => d.name === 'shell-bg')) indexedDB.deleteDatabase('shell-bg');
      }).catch(() => {});
    } else {
      indexedDB.deleteDatabase('shell-bg');
    }
  } catch (e) {}
})();

themeBtn .addEventListener('click', cycle);
themeRail.addEventListener('click', cycle);
media.addEventListener('change', () => { if (mode === 'system') paint(); });
paint();

})();
