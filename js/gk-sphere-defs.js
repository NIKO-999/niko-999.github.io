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
      body: "The Sphere of Life's Work is the outer signature — how your genius is recognised in the world before anyone reads your résumé. It sits at the Sun of your birth chart, the most visible position in the whole profile, which is why this sphere so often gets mistaken for a job title rather than what it actually is: the frequency your work carries, regardless of what that work happens to be called.",
    },
    evolution: {
      title: 'Evolution',
      body: "The Sphere of Evolution is the pattern life keeps returning you to until you finally metabolise it. It sits opposite your Life's Work on the wheel, which is why growth here so often shows up disguised as an obstacle to the work rather than as part of it. What repeats here isn't punishment — it's the one lesson your particular life was actually built to teach you.",
    },
    radiance: {
      title: 'Radiance',
      body: "The Sphere of Radiance is the engine room — what your body and nervous system actually run on, beneath any story you tell about your energy. It is calculated from the Sun's position at your own conception, ninety-some days before you were born, which is why it often feels older and more automatic than anything you consciously decided about your health.",
    },
    purpose: {
      title: 'Purpose',
      body: "The Sphere of Purpose is the quiet floor underneath everything else in the profile — not a goal to achieve but a condition to stand on. It sits opposite Radiance, at the design Earth, which is why purpose here rarely announces itself loudly; it is closer to gravity than to ambition, present whether or not you are paying attention to it.",
    },
    attraction: {
      title: 'Attraction',
      body: "The Sphere of Attraction is the field that decides who actually gets close to you, well before conscious choice enters into it. Calculated from the Moon at your conception, it operates the way weight operates — invisibly, constantly, shaping the orbit of every relationship you will ever call significant.",
    },
    iq: {
      title: 'IQ',
      body: "The Sphere of IQ is not intelligence in the school sense, it's the actual shape your mind takes when it's solving something that matters to you — the tools it reaches for first, the kind of problem it finds interesting rather than exhausting. This is thinking as a fingerprint, not a score.",
    },
    eq: {
      title: 'EQ',
      body: "The Sphere of EQ is how feeling actually moves through you — not whether you have emotions, everyone does, but the particular grammar yours follow: what triggers them, how fast they arrive, what it takes for them to complete themselves rather than get stuck halfway.",
    },
    sq: {
      title: 'SQ',
      body: "The Sphere of SQ is sometimes called the love point — the tender, unguarded core formed in your earliest years, before any of the strategies that came later. It holds the memory of what unconditional actually felt like, which is why returning to it, even briefly, tends to soften everything built on top of it since.",
    },
    core: {
      title: 'Core',
      body: "The Sphere of Core holds the original wound — the specific place life first asked more of you than you were resourced to give. It is not a flaw to fix; it is the exact shape of the thing your life has been organised around ever since, for better and for worse, until it is finally read rather than avoided.",
    },
    vocation: {
      title: 'Vocation',
      body: "The Sphere of Vocation shares its key with Core, read forward instead of down — the wound becomes the precise instrument. It is the work only you are equipped to do because of what you have already survived, not despite it.",
    },
    culture: {
      title: 'Culture',
      body: "The Sphere of Culture is the setting your gifts actually need in order to function — the people, scale, and atmosphere your work either thrives inside of or quietly starves without. It is less about what you make and more about the room you need to be standing in while you make it.",
    },
    brand: {
      title: 'Brand',
      body: "The Sphere of Brand shares its key with Life's Work, read from the outside rather than the inside — not what you intend to put into the world but what other people actually recognise you by before you have said a word. It is reputation in the truest sense: the residue your work leaves behind, whether or not you are managing it on purpose.",
    },
    pearl: {
      title: 'Pearl',
      body: "The Sphere of Pearl is the harvest — the shape your prosperity takes once everything upstream in the profile has been genuinely lived rather than merely understood. It is not a reward for effort; it is what naturally accrues once the rest of the profile has stopped being resisted.",
    },
  };

  return {
    get(sphereId) { return D[sphereId] || null; },
  };
})();
