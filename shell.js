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
let mode = readStore(KEY) || 'system';

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
/* id, name, description, section.

   The section is what the menu groups by, and the order here is the
   order it reads in. A section with no members is not drawn, so adding
   one is adding rows rather than editing the picker. */
const PALETTES = [
  ['grotto', 'Grotto', 'A marble grotto over a still pool',   'Nature'],
  ['dune',   'Dune',   'A dune rim-lit under a starfield',    'Nature'],
  ['fjord',  'Fjord',  'Rain on a green fjord',               'Nature'],
  ['shore',  'Shore',  'A sunset shore, pink over turquoise', 'Nature'],
  ['lagoon', 'Lagoon', 'Palm shadows on a lagoon, from above','Nature'],
];
const SECTIONS_ORDER = ['Nature', 'Abstract'];

const palBtn   = document.getElementById('palBtn');
const palMenu  = document.getElementById('palMenu');
const palLabel = document.getElementById('palLabel');
let palette = readStore(PKEY) || 'grotto';
/* salt was replaced by grotto; a stored 'salt' would otherwise select a
   theme with no CSS block and therefore no photograph. */
if (palette === 'salt') palette = 'grotto';

/* Grouped, but still ONE radiogroup. Splitting it into two would mean
   two tab stops and two arrow-key loops for what is one choice; putting
   headings inside a radiogroup as real elements would put non-radios
   among its options. So the headings are decoration the screen reader
   skips, and the section name is folded into each swatch's own name
   instead — "Dune, nature. A dune rim-lit under a starfield." */
SECTIONS_ORDER.forEach((section) => {
  const members = PALETTES.filter(p => (p[3] || 'Nature') === section);
  if (!members.length) return;

  const h = document.createElement('span');
  h.className = 'pal-sect';
  h.setAttribute('aria-hidden', 'true');
  h.textContent = section;
  palMenu.appendChild(h);

  members.forEach(([id, name, desc]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.setAttribute('role', 'radio');
    b.tabIndex = -1;
    b.dataset.palette = id;
    /* The dot paints from that scheme's own --sw-* token, so it always
       shows the real value rather than a copy that can drift. */
    b.innerHTML =
      `<span class="dot" data-swatch="${id}" aria-hidden="true"></span>${name}`
      + `<svg class="tick-mark" viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" stroke-width="2.6" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>`;
    b.title = desc;
    b.setAttribute('aria-label', `${name}, ${section.toLowerCase()} — ${desc}`);
    b.addEventListener('click', () => { setPalette(id); closePal(true); });
    palMenu.appendChild(b);
  });
});

function setPalette(id) {
  palette = id;
  writeStore(PKEY, id);
  document.documentElement.dataset.palette = id;
  const name = (PALETTES.find(p => p[0] === id) || [])[1] || id;
  palLabel.textContent = name;
  palBtn.setAttribute('aria-label', `Backdrop: ${name}`);
  /* Roving tabindex: exactly one radio is tabbable — the checked one —
     so Tab lands on the group once and arrows move within it. Without
     this, five tab stops and Tab walked OUT of the open menu. */
  palMenu.querySelectorAll('.swatch').forEach((s) => {
    const on = s.dataset.palette === id;
    s.setAttribute('aria-checked', String(on));
    s.tabIndex = on ? 0 : -1;
  });
  say.textContent = `Backdrop: ${name}.`;
}

function openPal() {
  palMenu.hidden = false;
  palBtn.setAttribute('aria-expanded', 'true');
  (palMenu.querySelector('[aria-checked="true"]') || palMenu.firstElementChild).focus();
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
  const items = [...palMenu.querySelectorAll('.swatch')];
  const i = items.indexOf(document.activeElement);
  const fwd  = e.key === 'ArrowDown' || e.key === 'ArrowRight';
  const back = e.key === 'ArrowUp'   || e.key === 'ArrowLeft';
  if (e.key === 'Escape') { e.preventDefault(); closePal(true); return; }
  let next = -1;
  if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = items.length - 1;
  else if (fwd || back) {
    if (i < 0) return;
    next = (i + (fwd ? 1 : -1) + items.length) % items.length;
  } else return;
  e.preventDefault();
  items[next].focus();
  setPalette(items[next].dataset.palette);   // radiogroups select on arrow
});
/* Focus leaving the widget closes it — otherwise Tab out of the open
   menu left it floating with Escape dead, since Escape was bound inside. */
document.querySelector('.pal').addEventListener('focusout', (e) => {
  if (!palMenu.hidden && !(e.relatedTarget && e.relatedTarget.closest('.pal'))) closePal(false);
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

/* Arrow-keying through the picker swaps data-palette per press, and each
   never-fetched photograph would flash flat --ground while it loaded.
   Warm the other four after first paint, at idle priority. */
const warm = () => PALETTES.forEach(([id]) => { new Image().src = asset(`arc/bg/${id}.jpg`); });
if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 });
else setTimeout(warm, 1200);
themeBtn .addEventListener('click', cycle);
themeRail.addEventListener('click', cycle);
media.addEventListener('change', () => { if (mode === 'system') paint(); });
paint();

})();
