/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — THE GOLDEN PATH PATHWAYS
 * ═══════════════════════════════════════════════════════════════════════════
 *  Unlike Programming Partners and Codon Rings (js/gk-partners.js,
 *  js/codon-rings.js) — which connect two of YOUR keys only when they happen
 *  to coincide — the eleven Pathways are fixed. They connect POSITIONS, not
 *  keys: Life's Work always leads to Evolution through the Pathway of
 *  Challenge, whichever key of the 64 happens to sit at either end. Every
 *  profile has all eleven, in the same order, because they are what make
 *  the three sequences read as a path rather than a scattered list:
 *
 *    Activation (4 spheres, 3 pathways):
 *      Life's Work → Evolution   — Challenge
 *      Evolution   → Radiance    — Breakthrough
 *      Radiance    → Purpose     — Core Stability
 *
 *    Venus (5 spheres, 5 pathways, closing back on itself):
 *      Attraction → IQ     — Dharma
 *      IQ         → EQ     — Karma
 *      EQ         → SQ     — Intelligence
 *      SQ         → Core   — Love
 *      Core       → Attraction — Realisation
 *
 *    Pearl (4 spheres, 3 pathways):
 *      Vocation → Culture — Initiative
 *      Culture  → Brand   — Growth
 *      Brand    → Pearl   — Service
 *
 *  Original writing throughout — short, structural descriptions of what each
 *  named connection does, not a transcription of any published source.
 *
 *  API:
 *    DGKPathways.get(sphereId) -> { to, name, text } | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKPathways = (function () {
  'use strict';

  const D = {
    lifesWork: { to: 'evolution', name: 'Challenge', text: "The friction between what you're becoming known for and the pattern still asking to be worked through." },
    evolution: { to: 'radiance', name: 'Breakthrough', text: 'The point where a lesson you keep repeating finally clears enough to free real vitality underneath it.' },
    radiance: { to: 'purpose', name: 'Core Stability', text: 'Where raw energy settles into something steady enough to actually carry meaning.' },
    attraction: { to: 'iq', name: 'Dharma', text: "What draws close to you becomes the actual material your mind is built to work with." },
    iq: { to: 'eq', name: 'Karma', text: 'The way your mind processes a thing decides exactly how it lands in your body as feeling.' },
    eq: { to: 'sq', name: 'Intelligence', text: 'Feeling, followed all the way through rather than managed, is what finally uncovers what you already innately knew.' },
    sq: { to: 'core', name: 'Love', text: 'The tenderness carried from before experience is what makes the original wound bearable to actually face.' },
    core: { to: 'attraction', name: 'Realisation', text: 'What you finally face at your own root changes who and what you draw toward you next — closing the loop back to the start.' },
    vocation: { to: 'culture', name: 'Initiative', text: 'The instrument your wound built needs a room before it can do anything at all.' },
    culture: { to: 'brand', name: 'Growth', text: 'The right room is what turns quiet capability into something the world actually starts to recognise.' },
    brand: { to: 'pearl', name: 'Service', text: 'What precedes you into a room is exactly what finally comes back around as ease.' },
  };

  return {
    get(sphereId) { return D[sphereId] || null; },
  };
})();
