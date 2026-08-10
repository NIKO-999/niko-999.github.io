/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — COMPATIBILITY ENGINE (two-profile comparison)
 * ═══════════════════════════════════════════════════════════════════════════
 *  Pure comparison logic, no DOM. Takes two `DGKProfile.profile(...).spheres`
 *  objects (the exact shape already used everywhere else on this page) and
 *  finds where the two charts actually connect:
 *
 *    exact    — the same key sitting in a sphere for both people
 *    rings    — a key of person A's shares a codon ring with a key of
 *               person B's (same-person ring shares are NOT included here —
 *               those already show in each person's own Profile Overview)
 *    partners — a key of person A's is the programming partner of a key of
 *               person B's
 *
 *  Reuses js/codon-rings.js's DCodonRings.shared() and js/hexagrams.js's
 *  DHexagrams.partner() completely unmodified — both are pure, person-
 *  agnostic functions over key numbers; this file supplies the only thing
 *  they don't have, which owner each key belongs to.
 *
 *  API:
 *    DGKCompat.compare(profileA, profileB) ->
 *      { exact: [{key, idA, idB}],
 *        rings: [{ring, keyA, idA, keyB, idB}],
 *        partners: [{keyA, idA, keyB, idB}] }
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKCompat = (function () {
  'use strict';

  function entries(profile) {
    return Object.keys(profile || {}).map(id => ({ id, key: profile[id].key })).filter(e => e.key != null);
  }

  function findExact(a, b) {
    const out = [];
    a.forEach(ea => {
      b.forEach(eb => {
        if (ea.key === eb.key) out.push({ key: ea.key, idA: ea.id, idB: eb.id });
      });
    });
    return out;
  }

  function findRings(a, b) {
    if (!(window.DCodonRings && DCodonRings.VALID)) return [];
    const tagged = a.map(e => ({ ...e, owner: 'A' })).concat(b.map(e => ({ ...e, owner: 'B' })));
    const uniqueKeys = [...new Set(tagged.map(t => t.key))];
    const shared = DCodonRings.shared(uniqueKeys);
    const out = [];
    shared.forEach(({ ring, keys }) => {
      keys.forEach(kA => {
        const ownersA = tagged.filter(t => t.key === kA && t.owner === 'A');
        keys.forEach(kB => {
          if (kA === kB) return;
          const ownersB = tagged.filter(t => t.key === kB && t.owner === 'B');
          ownersA.forEach(oa => ownersB.forEach(ob => {
            out.push({ ring, keyA: kA, idA: oa.id, keyB: kB, idB: ob.id });
          }));
        });
      });
    });
    return out;
  }

  function findPartners(a, b) {
    if (!(window.DHexagrams && DHexagrams.VALID)) return [];
    const out = [];
    a.forEach(ea => {
      const p = DHexagrams.partner(ea.key);
      if (p == null) return;
      b.forEach(eb => {
        if (eb.key === p) out.push({ keyA: ea.key, idA: ea.id, keyB: eb.key, idB: eb.id });
      });
    });
    return out;
  }

  function compare(profileA, profileB) {
    const a = entries(profileA), b = entries(profileB);
    return {
      exact: findExact(a, b),
      rings: findRings(a, b),
      partners: findPartners(a, b),
    };
  }

  return { compare };
})();
