/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — TODAY'S RING ECHO  (transit shares a codon ring with you)
 * ═══════════════════════════════════════════════════════════════════════════
 *  When today's transiting key isn't an exact match to anything in a
 *  visitor's own profile, but shares a codon ring with one of their keys,
 *  that's still a real, checkable connection — not a coincidence, the same
 *  biochemical family. The previous version of this card used one generic
 *  sentence ("keys in the same ring run on the same underlying material...")
 *  for every ring, every visitor, every day. This file replaces that with
 *  one original passage per ring — 21 total, one per js/codon-rings.js
 *  entry — describing the actual felt quality of THAT ring specifically,
 *  not a restatement of the ring mechanism (the surrounding UI already
 *  explains what a shared ring is).
 *
 *  Keyed by amino code, matching js/codon-rings.js's own ring.amino field.
 *
 *  Original writing throughout — not sourced from or paraphrasing
 *  genekeys.com's or Richard Rudd's published material.
 *
 *  API:
 *    DGKTransitRings.get(amino) -> string | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKTransitRings = (function () {
  'use strict';

  const D = {
    Lys: "Fire doesn't announce itself politely — it just gets hotter. Whatever ignites easily in you has a little more oxygen around it today, not because anything new was lit, just because the same flame is catching a second draft.",
    Phe: "Water doesn't push, it finds the lowest point and fills it. Something in you that already knows how to move around an obstacle instead of through it is quietly more fluid today than usual.",
    Leu: "This ring runs on endings that are actually beginnings wearing a disguise. Whatever in you has been treating a closing chapter as a loss might, today, start reading a little more like a threshold.",
    Arg: "This is the ring that ties one person's private material to everyone else's. Something in you built to carry more than just your own weight is a little more awake today, whether or not anyone around you has noticed yet.",
    Ser: "This ring runs on appetite that hasn't found its object yet. Whatever restlessness already lives in you — the kind that wants more before it even knows more of what — has a bit more charge behind it today.",
    Ala: "This is the ring where raw material gets shaped into something that actually holds a form. Whatever discipline already lives in you around turning mess into structure is quietly more available today.",
    Thr: "Light in this ring is less about brightness and more about precision — the exact angle something needs to be seen from before it makes sense. Whatever clarity you already carry has a sharper edge on it today.",
    Gly: "This ring runs on transformation that doesn't ask permission first. Something in you that already knows how to turn one thing into a completely different thing is closer to the surface today than usual.",
    Pro: "This ring holds the discipline that outlasts the mood that started it. Whatever steadiness you already carry — the kind that doesn't need to feel inspired to keep going — is quietly reinforced today.",
    Stop: "This ring runs on the moment a story simply ends, cleanly, without needing to be resolved first. Whatever in you already knows how to let something stop rather than drag it out has a little more room to act today.",
    Ile: "This ring carries a loyalty to something larger than any one person's life — a planet, a lineage, a whole system. Whatever in you already answers to something bigger than your own agenda is a touch louder today.",
    Cys: "This ring holds the strange comfort of solitude that doesn't feel like loneliness. Whatever part of you already knows how to be alone without it costing you anything is a little easier to access today.",
    Asp: "This ring runs on totality — nothing held back, nothing kept in reserve for later. Whatever in you already goes all the way in rather than half-measuring has a bit more permission today.",
    Tyr: "This ring doesn't offer a way back to where you started, only forward into what you've actually become. Whatever in you has already crossed a line it can't uncross is a little more at peace with that today.",
    Asn: "This ring runs on a private discovery that changes how everything else reads in hindsight. Whatever quiet realization you've already had is a bit closer to the surface again today, asking to be taken seriously.",
    Glu: "This ring carries dissatisfaction that's actually a form of vision — seeing exactly how much better something could be. Whatever restlessness in you comes from accurate perception rather than complaint has a sharper edge today.",
    His: "This ring runs on trust extended before there's proof it's warranted. Whatever in you already knows how to believe in someone before they've earned it is quietly closer to the surface today.",
    Trp: "This ring holds appetite for the genuinely uncharted — not the next step, the whole unmapped territory. Whatever hunger for real newness you already carry has a bit more pull to it today.",
    Met: "This is the ring at the very start of the sequence — origin, not consequence. Whatever in you already knows how to begin something from nothing, without waiting for the right conditions, is a little more available today.",
    Gln: "This ring carries the ache of a want that hasn't been named yet. Whatever longing you've already been circling without quite landing on words for it is a bit closer to the surface today.",
    Val: "This ring runs on the quiet strength of standing your own ground without needing to defend it loudly. Whatever conviction you already hold, unforced, is a little steadier under you today.",
  };

  return {
    get(amino) { return D[amino] || null; },
  };
})();
