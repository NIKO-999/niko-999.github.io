/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  GENE KEYS — "MY SPHERE OF X" — WHAT EACH SPHERE IS, INDEPENDENT OF KEY
 * ═══════════════════════════════════════════════════════════════════════════
 *  Every sphere has a fixed meaning that holds regardless of which of the
 *  64 keys you carry there — what genekeys.com calls "The Sphere of SQ" and
 *  so on. This is that layer: a short conceptual definition of the sphere
 *  itself, shown once per sphere, unrelated to key or line.
 *
 *  Original writing throughout — not sourced from or paraphrasing
 *  genekeys.com's own text, only the concept that each sphere has a fixed
 *  identity worth naming on its own.
 *
 *  API:
 *    DGKSphereDefs.get(sphereId) -> { title, body } | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKSphereDefs = (function () {
  'use strict';

  const D = {
    lifesWork: {
      title: "Life's Work",
      body: "This is the gift the world already sees in you, even on the days you can't see it yourself. It isn't a job title and it doesn't need permission — it's the quality you bring into any room, any task, any relationship, that only you bring in exactly that way. The more fully you let it move without apologising for it, the more unmistakably it becomes yours.",
    },
    evolution: {
      title: 'Evolution',
      body: "This is the ground you keep being led back to, not because you're failing, but because it's where your deepest growth actually lives. Every time it resurfaces, you're not starting over — you're arriving with more capacity than the last time. Trust what keeps returning; it's showing you exactly where your freedom is waiting to be claimed.",
    },
    radiance: {
      title: 'Radiance',
      body: "This is your true source of vitality, running far beneath willpower or routine. When you honour what it's actually asking for, your energy stops being something you have to manage and starts being something you can rely on. Health, for you, was never about forcing more — it's about finally listening to what was already true.",
    },
    purpose: {
      title: 'Purpose',
      body: "This is the quiet certainty underneath everything you do, whether or not you've ever put words to it. You don't have to chase it or prove it — it holds you even in the ordinary moments, steady as breath. The more you let yourself rest into it, the less anything else needs to be figured out first.",
    },
    attraction: {
      title: 'Attraction',
      body: "This is the pull that decides who truly enters your life and how deeply they're allowed to matter. It's older than any story you've told yourself about love, and wiser than any checklist. When you stop overriding it, it draws exactly the connections your life is actually ready for.",
    },
    iq: {
      title: 'IQ',
      body: "This is the particular brilliance of your mind — not a score, a signature. It's the way you naturally see what others miss, solve what others avoid, and make sense of what looks like noise to everyone else. Trusting how your own mind actually works is worth more than trying to think like anyone else's.",
    },
    eq: {
      title: 'EQ',
      body: "This is the true shape of your feeling life — not too much, not too little, exactly built for what you're here to move through. Your emotions were never the problem; needing to explain them away was. Let them run their full course and they'll keep showing you, faster than thought ever could, what actually matters.",
    },
    sq: {
      title: 'SQ',
      body: "This is the tender place inside you that already knows what unconditional feels like, untouched by anything that came after. It never actually left — it's just been waiting under everything you built to protect it. Returning here, even for a breath, is enough to soften what years of strategy hardened.",
    },
    core: {
      title: 'Core',
      body: "This is the exact place life once asked more of you than you had — and it is not broken, it is the origin of your depth. Everything that makes you real, felt, and trustworthy to others grew directly out of this ground. Facing it honestly doesn't diminish you; it's how you finally stand in your full strength.",
    },
    vocation: {
      title: 'Vocation',
      body: "This is the same ground as your Core, turned to face forward — what once hurt becomes exactly what you're equipped to give. Nobody else can offer the world what you can here, because nobody else has lived precisely what you've lived. This is calling built from survival, not despite it.",
    },
    culture: {
      title: 'Culture',
      body: "This is the atmosphere your gifts were built to flourish inside — the scale, the people, the tone that lets you actually come alive rather than merely cope. Choosing your surroundings on purpose changes what's possible for you. Put yourself in the right room and everything else you carry starts working the way it was always meant to.",
    },
    brand: {
      title: 'Brand',
      body: "This is what people feel in your presence before you've said a single word — the mark you leave simply by being fully yourself. It isn't a performance to manage; it's the natural residue of living your gift out loud. The less you try to control how you're seen, the truer this becomes.",
    },
    pearl: {
      title: 'Pearl',
      body: "This is what naturally comes back to you once you've actually lived the rest of your profile instead of just understanding it. Prosperity here was never about earning through struggle — it's what accumulates the moment you stop resisting your own nature. Trust the process fully, and this is where it pays you back.",
    },
  };

  return {
    get(sphereId) { return D[sphereId] || null; },
  };
})();
