/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — ROLE FILE LOADER (lazy)
 * ═══════════════════════════════════════════════════════════════════════════
 *  The 13 role files (js/gk-lifeswork.js ... js/gk-core.js) total ~1.3MB.
 *  Every one of them used to load eagerly on page load, whether or not the
 *  visitor ever opened that sphere. This loads them on demand instead.
 *
 *  Safe to do because of two facts already true about this codebase:
 *    - Each role file is one self-contained statement,
 *      `DGKRoles.register(role, {...64 keys...})` — no dependency on
 *      anything except js/gk-roles.js already existing, and register()
 *      merges via Object.assign, so calling it late is safe.
 *    - The single place that reads role data (js/gk-mandala-page.js,
 *      roleSection()) already falls back to the universal reading
 *      (js/gene-keys-content.js) whenever a role hasn't registered yet —
 *      so a sphere is never blank while its file is in flight.
 *
 *  API:
 *    DGKRoleLoader.loadRole(roleId) -> Promise<void>  (resolves even on
 *      repeated failure — the universal-content fallback is the permanent
 *      safe landing state, never a thrown error surfaced to the visitor)
 *    DGKRoleLoader.preloadIdle()    -> void  (best-effort background
 *      prefetch of whatever hasn't loaded yet, once the page is idle)
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKRoleLoader = (function () {
  'use strict';

  const FILES = {
    lifesWork: 'js/gk-lifeswork.js',
    evolution: 'js/gk-evolution.js',
    radiance: 'js/gk-radiance.js',
    purpose: 'js/gk-purpose.js',
    attraction: 'js/gk-attraction.js',
    iq: 'js/gk-iq.js',
    eq: 'js/gk-eq.js',
    sq: 'js/gk-sq.js',
    core: 'js/gk-core.js',
    vocation: 'js/gk-vocation.js',
    culture: 'js/gk-culture.js',
    brand: 'js/gk-brand.js',
    pearl: 'js/gk-pearl.js',
  };

  const inFlight = new Map(); // roleId -> Promise<void>

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error('failed to load ' + src));
      document.head.appendChild(el);
    });
  }

  function loadRole(roleId) {
    if (window.DGKRoles && DGKRoles.has(roleId)) return Promise.resolve();
    if (inFlight.has(roleId)) return inFlight.get(roleId);
    const src = FILES[roleId];
    if (!src) return Promise.resolve();

    const p = injectScript(src)
      .catch(() => injectScript(src)) // one retry
      .catch(() => { /* give up quietly — universal-content fallback stays permanent */ })
      .then(() => { inFlight.delete(roleId); });
    inFlight.set(roleId, p);
    return p;
  }

  // Best-effort warm-up once the page is interactive — never competes with
  // an on-demand load, since it only starts what isn't already loading.
  function preloadIdle() {
    const remaining = Object.keys(FILES).filter(id => !(window.DGKRoles && DGKRoles.has(id)) && !inFlight.has(id));
    let i = 0;
    function next() {
      if (i >= remaining.length) return;
      const id = remaining[i++];
      loadRole(id).then(schedule);
    }
    function schedule() {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(next, { timeout: 2000 });
      } else {
        setTimeout(next, 300);
      }
    }
    schedule();
  }

  return { loadRole, preloadIdle };
})();
