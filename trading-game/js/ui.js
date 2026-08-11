/**
 * ui.js — UI helpers for Candle Quest. Zero dependencies. ES module.
 *
 * Public API:
 *   showScreen(id, {push=true})    — switch to screen id ('home'|'academy'|...); animates, syncs hash + nav
 *   getActiveScreen() -> string
 *   initRouter()                   — wire hash routing + [data-nav] clicks; call once at boot
 *   toast(msg, type?, ms?)         — type: 'info'|'success'|'error'|'xp'  (default 'info')
 *   openModal({title, body, onClose?}) — body: string (HTML) or Node; focus-trapped; returns close fn
 *   closeModal()
 *   lightbox(imgSrc, alt?)         — open image lightbox (Esc / click closes)
 *   confettiBurst(opts?)           — {count=90, colors?} celebratory rain
 *   animateNumber(el, to, {from?, ms?, decimals?, prefix?, suffix?})
 *   setXpBar({fillEl, current, needed, textEl?, barEl?})   — animated width + aria + label
 *   setRing(fillEl, fraction)      — level-ring stroke progress (0..1)
 *   trapFocus(container) -> release fn
 */

const $ = (id) => document.getElementById(id);
const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Screen router (hash-based)                                          */
/* ------------------------------------------------------------------ */

const SCREENS = ['home', 'academy', 'quiz', 'charts', 'replay', 'bosses', 'characters', 'inventory', 'settings'];
let activeScreen = 'home';

export function getActiveScreen() { return activeScreen; }

export function showScreen(id, { push = true } = {}) {
  if (!SCREENS.includes(id)) id = 'home';
  const next = $(`screen-${id}`);
  const prev = $(`screen-${activeScreen}`);
  if (!next || id === activeScreen && next.classList.contains('active')) {
    syncNav(id);
    return;
  }
  if (prev && prev !== next) {
    prev.classList.remove('active', 'screen-enter');
    prev.classList.remove('screen-exit');
  }
  next.classList.add('active');
  next.classList.remove('screen-enter');
  // restart enter animation
  void next.offsetWidth;
  next.classList.add('screen-enter');
  activeScreen = id;
  syncNav(id);
  if (push && location.hash !== `#${id}`) {
    history.pushState(null, '', `#${id}`);
  }
  window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  document.dispatchEvent(new CustomEvent('screenchange', { detail: { screen: id } }));
}

function syncNav(id) {
  document.querySelectorAll('.app-nav .nav-item').forEach((btn) => {
    const is = btn.dataset.nav === id;
    btn.classList.toggle('active', is);
    if (is) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
}

export function initRouter() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nav]');
    if (t) showScreen(t.dataset.nav);
  });
  const fromHash = () => showScreen((location.hash || '#home').slice(1), { push: false });
  window.addEventListener('popstate', fromHash);
  window.addEventListener('hashchange', fromHash);
  fromHash();
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

export function toast(msg, type = 'info', ms = 2800) {
  const stack = $('toast-stack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 320);
  }, ms);
  return el;
}

/* ------------------------------------------------------------------ */
/* Focus trap                                                          */
/* ------------------------------------------------------------------ */

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function trapFocus(container) {
  const prevFocus = document.activeElement;
  function onKey(e) {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
  container.addEventListener('keydown', onKey);
  const target = container.querySelector(FOCUSABLE);
  if (target) target.focus();
  return function release() {
    container.removeEventListener('keydown', onKey);
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  };
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

let modalRelease = null;
let modalOnClose = null;

export function openModal({ title = '', body = '', onClose = null } = {}) {
  const backdrop = $('modal-backdrop');
  const titleEl = $('modal-title');
  const bodyEl = $('modal-body');
  if (!backdrop) return () => {};
  titleEl.textContent = title;
  if (body instanceof Node) { bodyEl.replaceChildren(body); }
  else { bodyEl.innerHTML = body; }
  modalOnClose = onClose;
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  modalRelease = trapFocus($('modal'));
  return closeModal;
}

export function closeModal() {
  const backdrop = $('modal-backdrop');
  if (!backdrop || !backdrop.classList.contains('open')) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  if (modalRelease) { modalRelease(); modalRelease = null; }
  if (modalOnClose) { const fn = modalOnClose; modalOnClose = null; fn(); }
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

export function lightbox(imgSrc, alt = 'Chart diagram') {
  const box = $('lightbox');
  const img = $('lightbox-img');
  if (!box || !img) return;
  img.src = imgSrc;
  img.alt = alt;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  const box = $('lightbox');
  if (!box) return;
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
}

/* ------------------------------------------------------------------ */
/* Confetti                                                            */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = ['#2dd4a7', '#38bdf8', '#8b7bff', '#f2c14e', '#f4506c', '#eef2fb'];

export function confettiBurst({ count = 90, colors = CONFETTI_COLORS } = {}) {
  if (reducedMotion()) return;
  const layer = $('confetti-layer');
  if (!layer) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[(Math.random() * colors.length) | 0];
    p.style.setProperty('--drift', `${(Math.random() - 0.5) * 240}px`);
    p.style.setProperty('--spin', `${540 + Math.random() * 720}deg`);
    p.style.setProperty('--fall-dur', `${2 + Math.random() * 1.6}s`);
    p.style.setProperty('--fall-delay', `${Math.random() * 0.5}s`);
    if (Math.random() < 0.4) p.style.borderRadius = '50%';
    frag.appendChild(p);
  }
  layer.appendChild(frag);
  setTimeout(() => { layer.replaceChildren(); }, 4600);
}

/* ------------------------------------------------------------------ */
/* Animated number counter                                             */
/* ------------------------------------------------------------------ */

export function animateNumber(el, to, { from = null, ms = 700, decimals = 0, prefix = '', suffix = '' } = {}) {
  if (!el) return;
  const start = from !== null ? from : parseFloat(String(el.textContent).replace(/[^\d.-]/g, '')) || 0;
  if (reducedMotion() || ms <= 0) {
    el.textContent = prefix + to.toFixed(decimals) + suffix;
    return;
  }
  const t0 = performance.now();
  function frame(t) {
    const p = Math.min(1, (t - t0) / ms);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (start + (to - start) * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ */
/* XP bar + level ring                                                 */
/* ------------------------------------------------------------------ */

export function setXpBar({ fillEl, current, needed, textEl = null, barEl = null }) {
  if (!fillEl) return;
  const pct = needed > 0 ? Math.max(0, Math.min(100, (current / needed) * 100)) : 100;
  fillEl.style.width = `${pct}%`;
  if (textEl) textEl.textContent = `${Math.round(current)} / ${Math.round(needed)} XP`;
  if (barEl) {
    barEl.setAttribute('aria-valuenow', String(Math.round(pct)));
    barEl.setAttribute('aria-valuemax', '100');
  }
}

/** fraction 0..1 → level ring stroke progress. Works with any circle radius. */
export function setRing(fillEl, fraction) {
  if (!fillEl) return;
  const r = parseFloat(fillEl.getAttribute('r')) || 18;
  const circ = 2 * Math.PI * r;
  fillEl.setAttribute('stroke-dasharray', circ.toFixed(1));
  fillEl.setAttribute('stroke-dashoffset', (circ * (1 - Math.max(0, Math.min(1, fraction)))).toFixed(1));
}

/* ------------------------------------------------------------------ */
/* Global listeners (modal/lightbox close)                             */
/* ------------------------------------------------------------------ */

document.addEventListener('click', (e) => {
  if (e.target.id === 'modal-backdrop' || e.target.id === 'modal-close' || e.target.closest?.('#modal-close')) closeModal();
  if (e.target.closest?.('#lightbox')) closeLightbox();
  const img = e.target.closest?.('.lesson-img');
  if (img && img.src) lightbox(img.src, img.alt);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeLightbox(); }
});
