/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — POSITION-SPECIFIC READING REGISTRY
 * ═══════════════════════════════════════════════════════════════════════════
 *  An archetype is never read in isolation — it is the archetype expressed
 *  through the position it occupies (docs/GOLDEN-STANDARD.md, "Position
 *  changes meaning"). Key 20 as your Life's Work and Key 20 as your Purpose
 *  are two different readings, written separately, never reworded from each
 *  other.
 *
 *  js/gene-keys-content.js holds the UNIVERSAL reading for each key — the
 *  archetype itself. That is what a key means when it is NOT one of your four
 *  primes (an energy you meet in the world rather than carry). This registry
 *  holds the four position-specific readings layered on top of it.
 *
 *  Each role ships as its own deferred file (js/gk-lifeswork.js, etc.) that
 *  calls register(). A role file that has not shipped yet simply returns null
 *  and the UI falls back to the universal reading — so the page is never
 *  broken by partial coverage.
 *
 *  Roles match the ROLES table in gene-keys.html and the keys of
 *  DGeneKeys.primes(): lifesWork | evolution | radiance | purpose
 *
 *  API:
 *    DGKRoles.register(role, entriesByKeyNumber)
 *    DGKRoles.get(role, keyNum) -> { wiring, root, defaultMode, blindSpot,
 *                                    underusedStrength } | null
 *    DGKRoles.has(role)         -> boolean
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKRoles = (function () {
  'use strict';

  const R = Object.create(null);

  return {
    register(role, entries) {
      R[role] = Object.assign(R[role] || Object.create(null), entries);
    },
    get(role, n) {
      return (R[role] && R[role][n]) || null;
    },
    has(role) {
      return !!R[role];
    },
  };
})();
