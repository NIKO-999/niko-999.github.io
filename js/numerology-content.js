'use strict';

/**
 * Destiny Matrix — Numerology Data Matrix
 * ─────────────────────────────────────────
 * Replaces the retired Universal Law toggle. The Destiny Matrix system is
 * numerology at its foundation — every position on this chart is already a
 * birthdate reduced through arithmetic into a number. This view names that
 * plainly: it takes each core node's live Arcana number, reduces it a
 * second time through classical Pythagorean digital-root numerology (1-9,
 * plus the master numbers 11 and 22, which are never reduced further — and
 * which, in this 22-Arcana system, land exactly on Strength and The Fool),
 * and reads the blend of the Arcana's own archetype with that number's
 * established meaning.
 *
 * No new user input required — same technique as the Guardian Angel and
 * Career Paths stars, reusing a value already on screen under a fresh lens.
 * The digital root is a separate, parallel calculation from this project's
 * own base-22 Arcana reduction (CLAUDE.md: "1-22 stay as-is, 22 never
 * reduces to 4") — it doesn't touch or reinterpret that rule, it runs an
 * independent classical-numerology reduction alongside it purely for this
 * view.
 *
 * Digital roots of 1-22 (computed once, recorded here for verification):
 *   1→1  2→2  3→3  4→4  5→5  6→6  7→7  8→8  9→9  10→1  11→11(master)
 *   12→3 13→4 14→5 15→6 16→7 17→8 18→9 19→1 20→2 21→3  22→22(master)
 *
 * API:
 *   DNumerologyContent.get(numberKey, arcanaNum) → { heading, why, shadow, path } or null
 *   DNumerologyContent.getMatch(arcanaNum) → { numberKey, correlation, heading, why, shadow, path } or null
 */

window.DNumerologyContent = (function () {

  const numbers = {

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 1 — Leadership, independence, initiation, originality.
    // Arcana whose digital root is 1: Magician(1), Wheel of Fortune(10),
    // Sun(19).
    // ═══════════════════════════════════════════════════════════════════
    '1': {
      1: {
        heading: `Number 1 & The Magician — Pure Initiation, Twice Over`,
        why: `The Magician already carries origination as its whole identity — starting something from nothing. Numerology's 1 doubles down on exactly that: independence, the will to go first, the refusal to wait for permission. In you, these aren't two separate forces layered on top of each other, they're the same instinct expressed at both the archetypal and the numeric level — which is why beginning things doesn't just come easily to you, it's structurally who you are.`,
        shadow: `The risk of a doubled 1 is doubled isolation — leading so instinctively that you stop building the muscle of following anyone, ever, even when following would actually serve you.`,
        path: `Try letting someone else lead one thing this week, on purpose, and staying in the follower's seat the whole way through. You are allowed to originate constantly and still know how to be led. Where might letting someone else go first actually get you further?`,
      },
      10: {
        heading: `Number 1 & The Wheel of Fortune — Independence Inside the Turning`,
        why: `The Wheel moves in cycles you don't control, but Number 1 insists on independence and self-direction even inside that motion — the part of you that keeps choosing, deciding, initiating a new response at every turn of the wheel, rather than just being carried by it.`,
        shadow: `The risk is fighting the cycle itself to preserve the feeling of control, forcing an outcome instead of choosing your response to whatever the turn actually brings.`,
        path: `Try making one deliberate, independent choice within a cycle you can't otherwise control this week, instead of trying to stop the cycle. You are allowed to be both carried by fortune and the one steering your own response to it. Where has the turning been handing you real choices you've been too busy resisting the turn to notice?`,
      },
      19: {
        heading: `Number 1 & The Sun — Radiant, Original Joy`,
        why: `The Sun's joy in you was never borrowed from anyone else's version of happiness — Number 1's originality means your specific brand of light is genuinely, structurally your own, not a performance of what happiness is supposed to look like.`,
        shadow: `The risk is dimming that originality to make your joy more palatable or recognizable to other people, trading your own actual light for a more familiar-looking one.`,
        path: `Try letting your joy show in its actual, uncopied shape once this week, even if it looks nothing like anyone else's. You are allowed to be happy in a way no one else would recognize as happiness. Where have you been performing a more familiar joy instead of your own original one?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 2 — Partnership, diplomacy, sensitivity, cooperation.
    // Arcana whose digital root is 2: High Priestess(2), Judgement(20).
    // ═══════════════════════════════════════════════════════════════════
    '2': {
      2: {
        heading: `Number 2 & The High Priestess — Doubled Receptivity`,
        why: `The High Priestess already moves through quiet, receptive knowing — Number 2's whole meaning is partnership, sensitivity, and the patience to wait for the right moment rather than force one. In you these aren't separate qualities, they're the same receptive intelligence showing up twice, at the archetype level and the number level both.`,
        shadow: `The risk of doubled receptivity is doubled passivity — waiting so patiently for the moment to be right that you never actually test whether your knowing was correct.`,
        path: `Try acting on one piece of quiet knowing this week without waiting for further confirmation. You are allowed to be deeply receptive and still initiate sometimes. What have you been sensing clearly enough to finally test?`,
      },
      20: {
        heading: `Number 2 & Judgement — Partnership With What's Calling You`,
        why: `Judgement is a summons, and Number 2 is the number of partnership and cooperation — meaning the call you keep hearing was never meant to be answered entirely alone. Part of what you're being awakened to is who you're meant to answer it alongside.`,
        shadow: `The risk is treating the calling as a solo mission out of habit, missing the collaboration Number 2 says is actually part of how this answers itself.`,
        path: `Try naming one person who might actually be meant to answer this calling alongside you, and reaching out this week. You are allowed to need a partner for the thing you thought was yours alone to do. Who keeps appearing near the work you keep being called back to?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 3 — Creativity, self-expression, joy, communication.
    // Arcana whose digital root is 3: Empress(3), Hanged Man(12), World(21).
    // ═══════════════════════════════════════════════════════════════════
    '3': {
      3: {
        heading: `Number 3 & The Empress — Doubled Creative Abundance`,
        why: `The Empress already generates and nurtures; Number 3 is the number of creativity, self-expression, and joyful overflow. In you these aren't two separate gifts, they're the same generative force showing up at both levels — which is why your capacity to create and multiply abundance runs unusually deep.`,
        shadow: `The risk of doubled creative abundance is doubled diffusion — generating so much, in so many directions, that nothing gets the sustained attention it needs to actually mature.`,
        path: `Try choosing one creative or nurturing project this week and deliberately not starting anything new alongside it. You are allowed to let your abundance concentrate instead of always spreading. What one thing deserves all of your growing energy right now?`,
      },
      12: {
        heading: `Number 3 & The Hanged Man — Creative Perspective Found in Suspension`,
        why: `The Hanged Man's whole gift is a new angle of vision, and Number 3 is specifically the number of creative expression and communication — meaning what you find in suspension isn't just a private insight, it's something meant to be created and shared once you come down from the pause.`,
        shadow: `The risk is keeping the new perspective entirely private, treating the suspension as the whole point rather than the preparation for expressing what you found there.`,
        path: `Try creating or communicating one thing this week that came directly out of a recent period of stillness. You are allowed to let your pause produce something meant for other people. What insight from your suspension is actually ready to be expressed?`,
      },
      21: {
        heading: `Number 3 & The World — Creative Completion, Shared Widely`,
        why: `The World is genuine completion and integration; Number 3 adds creativity and joyful expression to that wholeness — meaning your completions in life aren't meant to be quiet, private achievements, they're meant to be shared, communicated, and celebrated with real joy.`,
        shadow: `The risk is completing something significant and then keeping it modest or unannounced, out of habit, when Number 3's expressive joy is specifically asking to be let out.`,
        path: `Try naming one genuine completion this week and sharing it with real, unshrunken joy instead of downplaying it. You are allowed to celebrate what you've actually finished. What completion have you been keeping quieter than it deserves?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 4 — Structure, stability, discipline, foundations.
    // Arcana whose digital root is 4: Emperor(4), Death(13).
    // ═══════════════════════════════════════════════════════════════════
    '4': {
      4: {
        heading: `Number 4 & The Emperor — Doubled Structural Mastery`,
        why: `The Emperor already builds order; Number 4 is the number of structure, discipline, and durable foundations. In you these aren't separate strengths, they're the same architectural instinct doubled — which is why what you build tends to actually hold.`,
        shadow: `The risk of doubled structure is doubled rigidity — building foundations so solid they stop being able to flex when circumstances genuinely change.`,
        path: `Try deliberately loosening one rule or structure this week that no longer fits, instead of reinforcing it out of habit. You are allowed to be the builder and still let something bend. What structure of yours needs updating rather than defending?`,
      },
      13: {
        heading: `Number 4 & Death — Rebuilding on Genuinely Solid Ground`,
        why: `Death's transformation only completes when something new gets built afterward, and Number 4 is specifically the number of solid, disciplined foundations — meaning your endings aren't just releases, they're clearing space for a structure sturdier than whatever came before.`,
        shadow: `The risk is rushing to rebuild before the old structure has actually finished ending, so the new foundation gets laid on ground that isn't fully cleared yet.`,
        path: `Try confirming one ending is genuinely complete before building anything new on top of it this week. You are allowed to take the time a real foundation actually needs. What are you building on that hasn't finished ending yet?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 5 — Freedom, change, versatility, adventure.
    // Arcana whose digital root is 5: Hierophant(5), Temperance(14).
    // ═══════════════════════════════════════════════════════════════════
    '5': {
      5: {
        heading: `Number 5 & The Hierophant — Doubled Wisdom in Motion`,
        why: `The Hierophant transmits established knowledge; Number 5 is the number of freedom, change, and versatility. In you these aren't in tension, they're doubled — you carry tradition specifically so you can adapt it, not just repeat it unchanged.`,
        shadow: `The risk of doubled 5 energy is scattering the teaching itself — adapting so freely and so often that no coherent body of knowledge ever gets to actually take root.`,
        path: `Try teaching or sharing one piece of knowledge this week in exactly the form you first received it, without adapting it yet. You are allowed to let tradition stay whole sometimes before you change it. What knowledge of yours deserves to be passed on unaltered, at least once?`,
      },
      14: {
        heading: `Number 5 & Temperance — Freedom Found Through Genuine Blending`,
        why: `Temperance integrates what looks like opposites into something whole; Number 5 is the number of freedom and versatility — meaning the blend you're capable of isn't a compromise, it's genuine freedom, the ability to move fluidly between what other people think has to be chosen between.`,
        shadow: `The risk is mistaking constant motion between extremes for the actual blend, when Number 5's freedom is meant to produce integration, not just variety.`,
        path: `Try finding one small, genuinely blended version of two things you keep alternating between this week, instead of switching between them again. You are allowed to let freedom produce a real mixture, not just more options. What two things of yours are actually ready to combine instead of alternate?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 6 — Harmony, responsibility, nurturing, devotion.
    // Arcana whose digital root is 6: Lovers(6), Devil(15).
    // ═══════════════════════════════════════════════════════════════════
    '6': {
      6: {
        heading: `Number 6 & The Lovers — Doubled Devotion to Real Connection`,
        why: `The Lovers already choose real, examined connection; Number 6 is the number of harmony, responsibility, and genuine care for the people closest to you. In you these aren't separate — your capacity for chosen, devoted relationship runs unusually deep because it's doubled.`,
        shadow: `The risk of doubled 6 energy is doubled self-sacrifice — caring for the relationship so completely that your own needs quietly stop counting inside it.`,
        path: `Try naming one need of your own inside a close relationship this week, out loud, instead of managing it privately. You are allowed to be devoted and still ask for something back. What have you been quietly going without to keep a relationship harmonious?`,
      },
      15: {
        heading: `Number 6 & The Devil — Responsibility for What You're Actually Attached To`,
        why: `The Devil names real attachment and compulsion honestly; Number 6 is the number of responsibility and harmony — meaning your task isn't to deny the pull, it's to take genuine responsibility for it, examining it with the same care Number 6 brings to anything it's devoted to.`,
        shadow: `The risk is either denying the attachment entirely or indulging it without responsibility, missing the harmonizing middle Number 6 is actually asking for.`,
        path: `Try taking one specific, honest piece of responsibility for a compulsion this week, without either denying it or excusing it. You are allowed to be attached to something and still be responsible about it. What pull of yours is asking for care rather than either denial or indulgence?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 7 — Introspection, analysis, spirituality, wisdom.
    // Arcana whose digital root is 7: Chariot(7), Tower(16).
    // ═══════════════════════════════════════════════════════════════════
    '7': {
      7: {
        heading: `Number 7 & The Chariot — Doubled Inner Discipline Behind the Drive`,
        why: `The Chariot's momentum looks external, but Number 7 is the number of introspection, analysis, and inner discipline — meaning your drive was never just raw force, it's directed by an unusually deep internal process, doubled at both the archetype and the number level.`,
        shadow: `The risk of doubled 7 energy is overthinking the direction until the momentum stalls entirely, analyzing the route so thoroughly that you never actually leave.`,
        path: `Try moving on one direction this week before you've fully finished analyzing it. You are allowed to trust a drive that hasn't been completely reasoned through yet. Where has analysis been substituting for the actual motion?`,
      },
      16: {
        heading: `Number 7 & The Tower — Introspection After the Collapse`,
        why: `The Tower breaks down what wasn't built to last; Number 7 is the number of introspection and genuine analysis — meaning the real value of the collapse in you isn't just the rebuilding, it's the honest internal examination of what the old structure actually revealed about you.`,
        shadow: `The risk is rebuilding immediately, skipping the introspective work Number 7 requires, so the new structure repeats the same unexamined flaw as the old one.`,
        path: `Try spending real time this week examining what the collapse actually revealed before building anything new. You are allowed to let the introspection take as long as it genuinely needs. What has the Tower's fall shown you that you haven't fully looked at yet?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 8 — Power, ambition, material mastery, abundance.
    // Arcana whose digital root is 8: Justice(8), Star(17).
    // ═══════════════════════════════════════════════════════════════════
    '8': {
      8: {
        heading: `Number 8 & Justice — Doubled Command of Material and Moral Balance`,
        why: `Justice already balances what's owed against what's given; Number 8 is the number of material power, authority, and abundance — meaning your capacity to hold both fairness and real material command runs unusually deep, doubled at the archetype and number level both.`,
        shadow: `The risk of doubled 8 energy is letting the pursuit of material mastery quietly outrun the fairness that was supposed to govern it.`,
        path: `Try checking one current pursuit of power or gain this week against whether it's still genuinely fair, not just legal or advantageous. You are allowed to want material command and still hold it accountable to fairness. Where has ambition been running ahead of the balance it's supposed to answer to?`,
      },
      17: {
        heading: `Number 8 & The Star — Material Realization of Genuine Hope`,
        why: `The Star carries hope and inspiration; Number 8 is the number of material power and tangible achievement — meaning your hope isn't meant to stay abstract, it's meant to actually materialize into real, visible results in the world.`,
        shadow: `The risk is keeping the hope purely inspirational, private and untested, when Number 8's material instinct is specifically asking you to build something real from it.`,
        path: `Try taking one concrete, material step toward a hope you've been holding privately this week. You are allowed to let inspiration become an actual, tangible result. What hope of yours is ready to stop being just a feeling?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // NUMBER 9 — Completion, compassion, humanitarianism, letting go.
    // Arcana whose digital root is 9: Hermit(9), Moon(18).
    // ═══════════════════════════════════════════════════════════════════
    '9': {
      9: {
        heading: `Number 9 & The Hermit — Doubled Completion Found in Solitude`,
        why: `The Hermit withdraws to find real understanding; Number 9 is the number of completion, universal compassion, and letting go. In you these are doubled — your solitude isn't just a search, it's a genuine process of finishing something internally before you're ready to share it.`,
        shadow: `The risk of doubled 9 energy is staying in the completing process so long that the wisdom never actually gets released back into the world it was meant for.`,
        path: `Try sharing one completed piece of understanding this week instead of continuing to refine it in private. You are allowed to let something be finished and given away. What insight of yours has actually reached completion and is ready to be offered?`,
      },
      18: {
        heading: `Number 9 & The Moon — Compassionate Completion of What You've Feared`,
        why: `The Moon holds fear and the felt undercurrent; Number 9 is the number of universal compassion and letting go — meaning your task with what frightens you isn't to eliminate it, it's to hold it with the same compassion Number 9 extends to everything, until you're genuinely ready to release it.`,
        shadow: `The risk is trying to force the fear to resolve before it's actually ready, skipping the compassionate patience Number 9 requires for real completion.`,
        path: `Try holding one current fear with real compassion this week, instead of trying to force it to resolve. You are allowed to let the releasing take exactly as long as it needs. What fear of yours might finally soften if you met it with compassion instead of urgency?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // MASTER NUMBER 11 — Heightened intuition, spiritual illumination.
    // Never reduced further. Arcana: Strength(11).
    // ═══════════════════════════════════════════════════════════════════
    '11': {
      11: {
        heading: `Master Number 11 & Strength — Illuminated Power, Held Gently`,
        why: `Strength is quiet resilience without needing to force anything; Master Number 11 is the number of heightened intuition and spiritual illumination — meaning your endurance was never just physical or willful, it's genuinely intuitive, a strength that knows exactly how much pressure to hold and when, without needing to prove it to anyone watching.`,
        shadow: `The risk of an unreduced master number is intensity that never gets grounded — illuminated insight and real strength both, held at a pitch so high it becomes exhausting to sustain without ever coming down to something usable.`,
        path: `Try grounding one piece of your intuitive strength into something concrete and small this week, instead of holding it at full intensity. You are allowed to let a master-level gift rest sometimes without it meaning less. What would it look like to use your strength quietly, at a size that doesn't exhaust you?`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // MASTER NUMBER 22 — The Master Builder: turning large vision into
    // real material structure. Never reduced further. Arcana: Fool(22).
    // ═══════════════════════════════════════════════════════════════════
    '22': {
      22: {
        heading: `Master Number 22 & The Fool — The Master Builder Leaping Anyway`,
        why: `The Fool leaps with open eyes and no guarantee; Master Number 22 is the number of the Master Builder — the rare capacity to turn a genuinely large vision into real, material structure. In you, the leap was never reckless, it's the opening move of building something at a scale most people never even attempt.`,
        shadow: `The risk of an unreduced master number is a vision so large it never gets a first concrete step, staying pure potential because starting small feels like a betrayal of the scale you actually see.`,
        path: `Try taking one small, genuinely concrete step this week toward the large vision you carry, instead of waiting to begin at full scale. You are allowed to build a master-level vision starting from something tiny. What is the smallest real brick you could lay toward the whole structure you actually see?`,
      },
    },

  };

  // ── ARCANA → NUMEROLOGY NUMBER MATCH ───────────────────────────────────
  // The digital root of each Arcana number (1-22), reducing repeatedly to a
  // single digit except for the two master numbers 11 and 22, which are
  // kept unreduced per standard Pythagorean numerology convention.
  const ARCANA_NUMBER_MATCH = {
    1: '1',   2: '2',   3: '3',   4: '4',   5: '5',
    6: '6',   7: '7',   8: '8',   9: '9',   10: '1',
    11: '11', 12: '3',  13: '4',  14: '5',  15: '6',
    16: '7',  17: '8',  18: '9',  19: '1',  20: '2',
    21: '3',  22: '22',
  };

  // ── CORRELATION — "why this number fits this arcana" ───────────────────
  // A dedicated paragraph per arcana naming the arithmetic directly, shown
  // above Why/Shadow/Path whenever Numerology view is active.
  const CORRELATION = {
    1: `You land on Number 1 because your reduction is exact — 1 stays 1 — meaning nothing about your numerology is inherited from a longer calculation. You are the number in its rawest, least diluted form, which is why the Magician's originating energy in you reads as unusually pure.`,
    2: `You land on Number 2 because your reduction is exact — 2 stays 2 — meaning nothing about your numerology is diluted by a longer calculation. Your receptivity is Number 2 in its purest, least-processed form.`,
    3: `You land on Number 3 because your reduction is exact — 3 stays 3 — meaning your creative abundance is Number 3 in its purest form, undiluted by a longer calculation.`,
    4: `You land on Number 4 because your reduction is exact — 4 stays 4 — meaning your structural instinct is Number 4 in its purest, least-diluted form.`,
    5: `You land on Number 5 because your reduction is exact — 5 stays 5 — meaning your adaptability is Number 5 in its purest form, undiluted by a longer calculation.`,
    6: `You land on Number 6 because your reduction is exact — 6 stays 6 — meaning your devotion is Number 6 in its purest, least-diluted form.`,
    7: `You land on Number 7 because your reduction is exact — 7 stays 7 — meaning your inner discipline is Number 7 in its purest form, undiluted by a longer calculation.`,
    8: `You land on Number 8 because your reduction is exact — 8 stays 8 — meaning your capacity for material mastery is Number 8 in its purest, least-diluted form.`,
    9: `You land on Number 9 because your reduction is exact — 9 stays 9 — meaning your capacity for completion is Number 9 in its purest, least-diluted form.`,
    10: `Your reduction runs 1+0=1 — Number 1 arriving through addition rather than staying whole, meaning your independence had to be assembled rather than given outright. That's exactly why the Wheel's cyclical nature and Number 1's self-direction coexist in you: your independence rebuilds itself with every turn.`,
    11: `Your Arcana number, 11, is one of only two numbers in this whole system that never reduces further — a master number held at full intensity rather than simplified down. That's exactly why Strength in you doesn't read as ordinary resilience. It's resilience amplified, illuminated, and genuinely rare.`,
    12: `Your reduction runs 1+2=3 — Number 3 arriving through addition, meaning your creative expression had to be assembled from the release and the new angle both. That's why the Hanged Man's insight in you so reliably wants to become something made and shared, not just privately known.`,
    13: `Your reduction runs 1+3=4 — Number 4 arriving through addition, meaning your discipline had to be assembled from the ending itself. That's why Death's transformation in you so consistently produces something more structurally sound than what it replaced.`,
    14: `Your reduction runs 1+4=5 — Number 5 arriving through addition, meaning your freedom had to be built from the full weight of your capacity to balance. That's why Temperance's integration in you carries such genuine versatility, not just careful moderation.`,
    15: `Your reduction runs 1+5=6 — Number 6 arriving through addition, meaning your responsibility had to be assembled from the full weight of the temptation itself. That's why the Devil's honest reckoning in you so often resolves into genuine, harmonizing care rather than either shame or excess.`,
    16: `Your reduction runs 1+6=7 — Number 7 arriving through addition, meaning your introspective depth had to be assembled from the full weight of the disruption. That's why the Tower's collapse in you tends to produce real insight, not just rubble.`,
    17: `Your reduction runs 1+7=8 — Number 8 arriving through addition, meaning your material power had to be assembled from the full weight of your inspiration. That's why the Star's hope in you carries such a strong, specific pull toward becoming something real.`,
    18: `Your reduction runs 1+8=9 — Number 9 arriving through addition, meaning your compassionate completion had to be assembled from the full weight of what you've felt beneath the surface. That's why the Moon's undercurrent in you so often resolves into genuine release rather than lingering fear.`,
    19: `Your reduction runs 1+9=10, then 1+0=1 — two full steps back to the same Number 1 that opened this whole sequence, meaning your radiance is independence in its most refined, most-processed form. Nothing about your Sun energy needs anyone else's permission to shine.`,
    20: `Your reduction runs 2+0=2 — Number 2 arriving through addition, meaning your cooperative instinct had to be assembled from the pieces of your full number rather than given outright. That's why Judgement's summons in you so often turns out to require a partner once you actually look.`,
    21: `Your reduction runs 2+1=3 — Number 3 arriving through addition, meaning your creative joy had to be built from the full weight of your completion. That's why the World's wholeness in you comes with such a strong, specific pull to actually express it.`,
    22: `Your Arcana number, 22, is the highest number in this entire system and one of only two that never reduces — the Master Builder held at full, unsimplified intensity. That's exactly why the Fool's leap in you isn't naive. It's the first move of the largest kind of building there is.`,
  };

  /**
   * get(numberKey, arcanaNum)
   * Returns { heading, why, shadow, path } for the given numerology number +
   * arcana, or null.
   */
  function get(numberKey, arcanaNum) {
    const block = numbers[numberKey];
    return (block && block[arcanaNum]) || null;
  }

  /**
   * getMatch(arcanaNum)
   * Returns the curated numerology match for this arcana (its own digital
   * root), blended with its correlation paragraph:
   * { numberKey, correlation, heading, why, shadow, path } or null.
   */
  function getMatch(arcanaNum) {
    const numberKey = ARCANA_NUMBER_MATCH[arcanaNum];
    const content = numberKey && get(numberKey, arcanaNum);
    if (!content) return null;
    return { numberKey, correlation: CORRELATION[arcanaNum] || '', ...content };
  }

  return { get, getMatch };

})();
