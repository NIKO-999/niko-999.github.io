/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — SPHERE-SPECIFIC LINE KEYNOTES
 * ═══════════════════════════════════════════════════════════════════════════
 *  A different axis from js/gk-lines.js, and a narrower one than an earlier
 *  version of this file assumed. gk-lines.js is keyed by (KEY, line) — what
 *  line 5 means when it belongs to Key 38, and that turns out to be the
 *  universal system genekeys.com itself uses (confirmed: screenshots of
 *  generic, non-personal keys — 21, 35, 10 — show the identical keynote
 *  style with no sphere framing at all). The Life's Work/Radiance/Purpose/
 *  etc. entries once here were really just (KEY, line) facts for whichever
 *  key a specific example person happened to carry, wrongly filed as
 *  sphere-specific — they've been moved into gk-lines.js as corrections.
 *
 *  What genuinely IS sphere-specific, in Rudd's own words: Vocation,
 *  Culture and Pearl are the "4 stages of the Money Sequence," each with
 *  its own named 6-line set regardless of which key occupies it — "stage 1
 *  of YOUR money sequence is called Talent," from his "Pearl Articles."
 *  That's what's left here: Vocation = "The Six Fields of Talent", Culture
 *  = "The Six Links of Culture", Pearl = "The Six Motivators" — all six
 *  lines given by name for exactly those three spheres, nowhere else.
 *
 *  A sphere+line pair with no entry falls back to the key-based line card
 *  in gk-lines.js.
 *
 *  API:
 *    DGKSphereLines.get(sphereId, line) -> { keynote, body } | null
 *    DGKSphereLines.tagline(sphereId)   -> string | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKSphereLines = (function () {
  'use strict';

  const D = {
    vocation: {
      1: { keynote: 'Production', body: "Your calling starts as a solitary act — something made alone, on your own terms, before it has an audience or a business model. Waiting for permission or partnership before you start is how the calling stays theoretical. The work you make by yourself first is the only proof anyone else needs." },
      2: { keynote: 'Marketing', body: "Your calling finds its shape through a duet — you and one other person, testing whether the work travels beyond your own head. This isn't yet the wide world, it's a single trusted mirror telling you what's actually landing. Skip this stage and you find out too late that nobody else could follow what you meant." },
      3: { keynote: 'Strategy', body: "Your calling gets found by trial, adjustment, and a fair amount of visible failure along the way. The plan that survives contact with reality was never going to be the first plan, and treating early missteps as verdicts rather than data is what stalls this stage the longest. Try, notice, adjust, again." },
      4: { keynote: 'Sales', body: "Your calling only becomes real once it reaches other people who weren't already looking for it. This is the stage where influence matters more than intention — the work has to travel through a network, not just exist. Talent that never gets carried anywhere stays a private fact, not a vocation." },
      5: { keynote: 'Management', body: "Your calling starts asking things of other people, not just of you — direction, coordination, the unglamorous work of making many hands move as one. Visibility arrives here whether you sought it or not, and with it the responsibility of being the one others now take their cue from." },
      6: { keynote: 'Philanthropy', body: "Your calling completes itself by leaving your own name out of the accounting. This isn't charity in the small sense — it's redesigning the system so the good doesn't depend on you personally continuing to do it. The sixth-line vocation ends by making itself unnecessary, on purpose." },
    },
    culture: {
      1: { keynote: 'Entrepreneur', body: "You build the culture around you from a standing start, alone, because nobody was going to build it for you. This is the founder's loneliness — real, and also exactly where the culture's first true shape gets decided. What gets built here sets the terms for everyone who joins later." },
      2: { keynote: 'Partnership', body: "Your culture is built two at a time before it's built any wider — one real partnership carrying weight the way a crowd never could. This isn't networking, it's a bond specific enough to actually hold responsibility. The culture that scales later is only as sound as this first pairing." },
      3: { keynote: 'Unit', body: "You find your natural role inside a small, dynamic team — a handful of people, not a movement — where trial and error gets to happen safely. Groups this size can absorb your mistakes and your discoveries both. Scaling too early costs you the exact conditions your gifts actually need." },
      4: { keynote: 'Network', body: "Your culture spreads by way of the people who already trust you carrying it to people who don't know you yet. This is influence as infrastructure — connections doing work you can't do by broadcasting alone. A network that never gets used stays a list of names, not a culture." },
      5: { keynote: 'Society', body: "Your culture operates at a scale where you're now shaping norms for people who will never meet you personally. This is real institutional weight, and it asks for a different kind of care than a founder's instinct alone can provide. What you normalise here, many people inherit." },
      6: { keynote: 'System', body: "Your culture becomes infrastructure — the invisible thing everything else runs on top of, rarely noticed exactly because it's working. This is the least personal and most consequential stage, where the point is no longer to be seen but to be relied upon without anyone having to think about it." },
    },
    pearl: {
      1: { keynote: 'Simplicity', body: "Prosperity, for you, is inseparable from having less to manage, not more. Money that arrives with complexity attached costs you something a simpler amount wouldn't, and chasing scale here is chasing the wrong metric. What you're actually after was never the number — it was the room to breathe." },
      2: { keynote: 'Recognition', body: "Prosperity, for you, is proof that what you did actually mattered to someone beyond yourself. You're built to be trusted with real resources, and the return you need isn't vanity, it's confirmation the effort landed somewhere real. Unwitnessed contribution starves this line even when the money still arrives." },
      3: { keynote: 'Celebration', body: "Prosperity, for you, exists to be spent, shared and enjoyed in the light rather than banked in the dark. Money that just sits stops meaning anything to this line — it was only ever a way of buying more life to actually live, for you and for whoever's around you." },
      4: { keynote: 'Charity', body: "Prosperity, for you, only completes itself by moving back out again. Wanting more here isn't greed, it's the fourth line's particular logic — you need more specifically so there's more to give away. Holding onto it past the point of usefulness is the one way this line goes wrong." },
      5: { keynote: 'Power', body: "Prosperity, for you, arrives bundled with real responsibility and real influence over how resources move through other people's lives. You're built to carry that weight, and the test is wielding it with the same restraint you'd want from anyone holding power over you." },
      6: { keynote: 'Nature', body: "Prosperity, for you, looks like never quite having to own or manage the resource yourself, and somehow always having what's needed anyway. This isn't luck, it's a transcendent relationship with provision itself. The irritation that seems to interrupt your life is usually the thing that was bringing this." },
    },
  };

  const TAGLINE = {
    lifesWork: "what I'm here to do",
    evolution: "what I'm here to learn",
    radiance: 'what keeps me healthy',
    purpose: 'what deeply fulfils me',
  };

  return {
    get(sphereId, line) {
      return (D[sphereId] && D[sphereId][line]) || null;
    },
    tagline(sphereId) {
      return TAGLINE[sphereId] || null;
    },
  };
})();
