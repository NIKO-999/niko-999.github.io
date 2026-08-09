/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — SPHERE-SPECIFIC LINE KEYNOTES
 * ═══════════════════════════════════════════════════════════════════════════
 *  A different axis from js/gk-lines.js. That file is keyed by (KEY, line) —
 *  what line 5 means when it belongs to Key 38, regardless of which sphere
 *  Key 38 happens to occupy. This file is keyed by (SPHERE, line) — what
 *  line 5 means when it IS your Life's Work, regardless of which of the 64
 *  keys you carry there. Confirmed as the real system genekeys.com's own
 *  app displays: verified against two independent real Golden Path reports
 *  and Richard Rudd's "Pearl Articles" (Vocation = "The Six Fields of
 *  Talent", Culture = "The Six Links of Culture", Pearl = "The Six
 *  Motivators" — all six lines given by name for those three spheres).
 *
 *  Coverage is partial and stays partial on purpose: only sphere+line pairs
 *  with a keyword confirmed in real source material are here. A pair with
 *  no entry falls back to the key-based line card in gk-lines.js rather
 *  than inventing a keyword with no source.
 *
 *  API:
 *    DGKSphereLines.get(sphereId, line) -> { keynote, body } | null
 *    DGKSphereLines.tagline(sphereId)   -> string | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKSphereLines = (function () {
  'use strict';

  const D = {
    lifesWork: {
      5: { keynote: 'Fixer', body: "Groups hand you the thing nobody else could get moving, not because you volunteered but because you were visibly capable of it. You inherit responsibility by being competent in the room, which is a different mechanism than being asked. The risk is carrying every group's unfinished business as if it were yours to finish alone." },
    },
    evolution: {
      5: { keynote: 'Power and Projection', body: "What you resolve privately becomes, without your choosing it, something other people watch and measure themselves against. Your own reckoning gets projected outward into a kind of public authority you never applied for. The work is staying honest about the private struggle even once it has been read as strength." },
    },
    radiance: {
      1: { keynote: 'Solitude', body: "Your health runs on a private battery that group life can't recharge. Time alone isn't a withdrawal from your vitality, it's the source of it — skip it for long enough and the body starts billing you for the debt. What looks like isolation from outside is maintenance from inside." },
    },
    purpose: {
      1: { keynote: 'The Anchor', body: "You hold a fixed point that everyone else's movement gets measured against, whether or not you asked for the job. People orient off you before they orient off circumstances, which means your steadiness costs you flexibility you don't always get to have. The anchor doesn't get to drift, even when it wants to." },
    },
    attraction: {
      3: { keynote: 'Playfulness', body: "You draw people in through trial, error and a willingness to be a little reckless about how you find out what works. The relationships that last are the ones that survived being tested this way, not the ones that looked safest on the first date. Adventure is the actual filter, not a phase before the filter." },
    },
    iq: {
      5: { keynote: 'The Practical Mind', body: "Your intelligence gets deployed defensively by default — solving the problem in front of you rather than the one underneath it. It's a genuinely useful reflex under real pressure, and a genuinely limiting one once the pressure has passed and you're still bracing. The mind that can only defend can't yet build." },
    },
    eq: {
      1: { keynote: 'Self-Esteem', body: "Your emotional stability was built, or wasn't, in private, long before anyone else could see it happening. What looks like confidence to other people is really the residue of thousands of unwitnessed moments where you either backed yourself or didn't. The public version is only ever a report from that private ledger." },
    },
    sq: {
      3: { keynote: 'Pleasure', body: "Your body learns what it knows through direct experience, not through being told — pleasure and its aftermath are how the lesson actually lands. Adventure isn't indulgence here, it's data collection the only way your particular intelligence can run it. What you understand, you understand because you were in it." },
    },
    core: {
      1: { keynote: 'Honesty', body: "The wound gets managed in private long before it's ever named out loud, and the naming is the only thing that actually changes anything. Silence around it doesn't protect you from it, it just moves the cost somewhere less visible. Said plainly, once, it stops running the rest of the pattern." },
    },
    brand: {
      5: { keynote: 'Wisdom', body: "What people recognise you by eventually stops being a look and starts being a track record of solutions. Reputation here isn't built by being seen, it's built by being the one who actually fixed the thing, repeatedly, until people stopped being surprised by it. The image just caught up to the fact." },
    },
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
    radiance: 'what keeps me healthy',
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
