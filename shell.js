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
const PALETTES = [
  ['grotto', 'Grotto', 'A marble grotto over a still pool'],
  ['dune',   'Dune',   'A dune rim-lit under a starfield'],
  ['fjord',  'Fjord',  'Rain on a green fjord'],
  ['shore',  'Shore',  'A sunset shore, pink over turquoise'],
  ['lagoon', 'Lagoon', 'Palm shadows on a lagoon, from above'],
];

/* ── your own photograph ──
   Per palette, not global: the colour tokens still come from the theme
   you picked, so a photograph swapped into Shore keeps Shore's pinks.
   That also means five slots rather than one, which is the difference
   between replacing a backdrop and losing the set.

   IndexedDB, because these are megabytes — localStorage would throw at
   the first 4K photograph and take the theme preference down with it.
   Stored as the file you chose, untouched: the entire point is that it
   is sharper than what ships here, and a re-encode would spend some of
   that on nothing. */
const BG = (() => {
  const NAME = 'shell-bg', STORE = 'bg';
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open(NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const run = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
      const t = db.transaction(STORE, mode), q = fn(t.objectStore(STORE));
      t.oncomplete = () => res(q ? q.result : undefined);
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error);
    });
  };
  return {
    get: id => run('readonly',  s => s.get(String(id))),
    put: (id, b) => run('readwrite', s => s.put(b, String(id))),
    del: id => run('readwrite', s => s.delete(String(id))),
  };
})();

/* IndexedDB cannot be read before the first paint, and the photograph
   it holds is megabytes besides. So a thumbnail of each one — 32px wide,
   a few hundred bytes — lives in localStorage, which CAN be read
   synchronously, and is painted immediately while the real file loads.

   It doubles as the flag that says a palette has been replaced at all,
   which is what lets the head script skip preloading the original. That
   preload was the bug: the shipped photograph was being fetched at high
   priority and painted before anything could override it, so replacing
   a backdrop meant watching the old one appear first, every load. */
const OWN = 'arc.bg.own';
const ownAll = () => { try { return JSON.parse(readStore(OWN) || '{}') || {}; } catch (e) { return {}; } };
const ownSet = (id, tiny) => {
  const m = ownAll();
  if (tiny) m[id] = tiny; else delete m[id];
  writeStore(OWN, JSON.stringify(m));
};
/* Small enough to sit in localStorage beside a theme preference, big
   enough to carry the photograph's colours. Upscaled to fill the window
   it is a soft wash of the right hues, which is what you want behind a
   panel for the fifty milliseconds before the real thing arrives. */
function tinyOf(file) {
  return new Promise((res) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const w = 32, h = Math.max(1, Math.round(32 * im.naturalHeight / im.naturalWidth));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(im, 0, 0, w, h);
      URL.revokeObjectURL(url);
      let out = null;
      try { out = c.toDataURL('image/jpeg', 0.5); } catch (e) {}
      res(out);
    };
    im.onerror = () => { URL.revokeObjectURL(url); res(null); };
    im.src = url;
  });
}

/* One URL alive at a time. An object URL that is never revoked holds
   the whole photograph in memory for the life of the tab, and swapping
   through five themes would hold five. */
let ownUrl = null;
let ownHas = false;
/* Declared here rather than where they are built, so paintOwn can check
   for them. `typeof` does not protect against a const's dead zone — it
   throws like any other read — so these are lets seeded with null. */
let ownRow = null, dropRow = null;

async function paintOwn(id) {
  /* Synchronous, so switching palette never shows the shipped photograph
     of one you have replaced — not even for a frame. */
  const tiny = ownAll()[id];
  if (tiny) document.documentElement.style.setProperty('--photo', `url("${tiny}")`);

  let blob = null;
  try { blob = await BG.get('bg:' + id); } catch (e) {}
  if (ownUrl) { URL.revokeObjectURL(ownUrl); ownUrl = null; }
  ownHas = !!blob;
  if (blob) {
    ownUrl = URL.createObjectURL(blob);
    /* Inline, so it beats the :root[data-palette] rule without either
       knowing about the other. Removing it hands the photograph back. */
    document.documentElement.style.setProperty('--photo', `url("${ownUrl}")`);
  } else {
    /* No blob means nothing of yours here — including the case where the
       thumbnail outlived the file it stood for. */
    if (tiny) ownSet(id, null);
    document.documentElement.style.removeProperty('--photo');
  }
  if (ownRow) syncOwn();
}

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
  paintOwn(id);
  say.textContent = `Backdrop: ${name}.`;
}

/* Below a rule, because they act on the selected theme rather than
   being another theme to select — and they are buttons, not radios, so
   the roving tabindex above does not reach them. */
const palRule = document.createElement('span');
palRule.className = 'pal-rule';
palRule.setAttribute('aria-hidden', 'true');
palMenu.appendChild(palRule);

const mkRow = (label, glyph) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'swatch pal-act';
  b.innerHTML = `<span class="pal-ic" aria-hidden="true">${glyph}</span>${label}`;
  palMenu.appendChild(b);
  return b;
};
ownRow = mkRow('Use my own photo',
  `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
     <path d="M12 16V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>`);
dropRow = mkRow('Restore the original',
  `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
     <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>`);

function syncOwn() {
  dropRow.hidden = !ownHas;
  ownRow.lastChild.textContent = ownHas ? 'Replace my photo' : 'Use my own photo';
}

const bgPick = Object.assign(document.createElement('input'),
  { type: 'file', accept: 'image/*', hidden: true });
document.body.appendChild(bgPick);

bgPick.addEventListener('change', async () => {
  const f = bgPick.files[0];
  bgPick.value = '';
  if (!f || !/^image\//.test(f.type)) return;
  try {
    await BG.put('bg:' + palette, f);
    ownSet(palette, await tinyOf(f));
  } catch (e) {
    say.textContent = 'That image could not be saved.';
    alert('This browser refused to store the image. It may be too large, '
        + 'or storage may be disabled.');
    return;
  }
  await paintOwn(palette);
  /* Say the size back, because "is it actually sharper" is the only
     question worth answering here and the file knows. */
  const im = new Image();
  im.onload = () => {
    const px = `${im.naturalWidth} x ${im.naturalHeight}`;
    say.textContent = `Backdrop: your own photograph, ${px}.`;
    URL.revokeObjectURL(im.src);
  };
  im.src = URL.createObjectURL(f);
});

ownRow.addEventListener('click', () => { bgPick.click(); closePal(true); });
dropRow.addEventListener('click', async () => {
  try { await BG.del('bg:' + palette); } catch (e) {}
  ownSet(palette, null);
  await paintOwn(palette);
  say.textContent = 'Backdrop: the original photograph.';
  closePal(true);
});

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
const warm = () => {
  /* Skip the ones standing in for a photograph of your own — fetching a
     file that will never be shown is the one thing worse than a flash. */
  const mine = ownAll();
  PALETTES.forEach(([id]) => {
    if (!mine[id]) new Image().src = asset(`arc/bg/${id}.jpg`);
  });
};
if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 });
else setTimeout(warm, 1200);
themeBtn .addEventListener('click', cycle);
themeRail.addEventListener('click', cycle);
media.addEventListener('change', () => { if (mode === 'system') paint(); });
paint();

})();
