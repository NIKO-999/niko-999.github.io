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
const ICON = {
  system: 'M4 5.5h16v10H4zM9 20h6M12 15.5V20',
  light:  'M12 3v1.6M12 19.4V21M4.6 12H3M21 12h-1.6M6.3 6.3 5.2 5.2M18.8 18.8l-1.1-1.1'
        + 'M17.7 6.3l1.1-1.1M5.2 18.8l1.1-1.1M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z',
  dark:   'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
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
const PALETTES = [
  ['grotto', 'Grotto', 'A marble grotto over a still pool'],
  ['dune',   'Dune',   'A dune rim-lit under a starfield'],
  ['fjord',  'Fjord',  'Rain on a green fjord'],
  ['shore',  'Shore',  'A sunset shore, pink over turquoise'],
  ['lagoon', 'Lagoon', 'Palm shadows on a lagoon, from above'],
];

const palBtn   = document.getElementById('palBtn');
const palMenu  = document.getElementById('palMenu');
const palLabel = document.getElementById('palLabel');
let palette = readStore(PKEY) || 'grotto';
/* salt was replaced by grotto; a stored 'salt' would otherwise select a
   theme with no CSS block and therefore no photograph. */
if (palette === 'salt') palette = 'grotto';

PALETTES.forEach(([id, name, desc]) => {
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
  b.setAttribute('aria-label', `${name} — ${desc}`);
  b.addEventListener('click', () => { setPalette(id); closePal(true); });
  palMenu.appendChild(b);
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

/* Arrow-keying through the picker swaps data-palette per press, and each
   never-fetched photograph would flash flat --ground while it loaded.
   Warm the other four after first paint, at idle priority. */
const warm = () => PALETTES.forEach(([id]) => { new Image().src = `bg/${id}.jpg`; });
if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 });
else setTimeout(warm, 1200);
themeBtn .addEventListener('click', cycle);
themeRail.addEventListener('click', cycle);
media.addEventListener('change', () => { if (mode === 'system') paint(); });
paint();

})();
