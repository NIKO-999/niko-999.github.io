'use strict';

/**
 * Destiny Matrix — Chakra Map content
 * ────────────────────────────────────
 * Source: research/07-Health-Interpretations/Chakra-Correspondence-and-
 * Meanings.md (pages 15-16 of DestinyMatrix-Sheet.pdf) for each chakra's body
 * location, colour and balanced-state description; and research/01-Foundation/
 * Destiny-Matrix-Calculation-Guide.extracted.md pages 6 and 14-15 for the
 * three-aspect model. Formula derivation and verification:
 * research/11-Research-Updates/24-chakra-map-solved-talent-line-corrected.md.
 *
 * The source's descriptions are keyword-ish and third-person; per
 * NON_NEGOTIABLE_RULES they are rewritten here into continuous second-person
 * Golden Standard prose. The substance is the source's — only the voice is
 * original.
 *
 * THIS IS THE CHAKRA-LEVEL TIER ONLY (7 entries). It describes what each
 * centre governs and what its three aspects mean. The per-arcana tier
 * (7 chakras x 22 arcana = 154 positional readings, the Gold Standard layer)
 * is NOT written yet — until it exists, a chakra card shows this tier plus the
 * reader's own three numbers, which is honest rather than padded.
 *
 * The three aspects, per the guide's "Classical Calculation":
 *   Physical  — the horizontal (earth line) value. How the centre shows up in
 *               the body and in material circumstance.
 *   Energy    — the vertical (sky line) value. How it runs as available force.
 *   Emotional — reduce(Physical + Energy). How it is actually felt.
 *
 * API:
 *   DChakraContent.get(key)   // 'muladhara' | 'swadhisthana' | ...
 *     → { where, governs, balanced, physical, energy, emotional } or null
 */

window.DChakraContent = (function () {

  const chakras = {

    sahasrara: {
      where: `At the crown of the head — the topmost point, where you meet whatever you understand to be larger than yourself.`,
      governs: `Spiritual connection, universal consciousness, and the sense of belonging to something beyond your own biography.`,
      balanced: `When this centre is open, you can hold a sense of connection that doesn't depend on belief being tidy. You feel part of something rather than adrift in it, and that produces a particular quietness — not detachment, but the absence of the low background argument about whether your life means anything. People with an open crown tend to feel whole in a way that isn't contingent on circumstances cooperating.`,
      physical: `How your sense of meaning shows up in ordinary material life — whether purpose is something you live inside or something you postpone until the practical parts are handled.`,
      energy: `How readily connection is actually available to you: whether reaching for something larger feels natural, or like effortful work against your own scepticism.`,
      emotional: `What that meeting actually feels like day to day — the felt experience of being connected, or of reaching and not quite arriving.`,
    },

    ajna: {
      where: `Between the eyebrows, at the centre of the forehead.`,
      governs: `Intuition, inner knowledge, mental clarity, and the imaginative faculty that lets you see what isn't in front of you yet.`,
      balanced: `When this centre is clear, you trust what you perceive before you can fully justify it, and that trust turns out to be well-placed more often than not. Thinking feels clean rather than crowded. You can hold an inner picture steadily enough to work from it, and you move through decisions with a sense of direction that doesn't need constant external confirmation to stay steady.`,
      physical: `How your perception meets the concrete world — whether insight translates into decisions you actually act on, or stays a private commentary running alongside your life.`,
      energy: `The raw availability of intuition: how loudly the inner signal arrives, and how much interference sits between sensing something and knowing you sensed it.`,
      emotional: `How your own knowing feels to live with — clarifying and steadying, or unsettling in a way that makes you want to look away from it.`,
    },

    vishuddha: {
      where: `In the neck, around the throat and the thyroid.`,
      governs: `Communication, self-expression, creativity and honesty — the ability to make what's inside you legible to someone else.`,
      balanced: `When this centre is open, what you mean and what you say are close to the same thing. You can speak difficult truths without either armouring them or dissolving into apology, and creative expression flows out rather than backing up. There's a specific relief in it: you stop carrying the weight of things you've been meaning to say, because you say them.`,
      physical: `How expression shows up in your actual life — the work you make, the conversations you have, whether your voice takes up real space in rooms that matter.`,
      energy: `How much expressive force is genuinely available: whether speaking comes easily or has to be pushed through resistance every time.`,
      emotional: `What expressing yourself costs or gives you emotionally — whether being heard feels safe, exposing, or something you've stopped expecting.`,
    },

    anahata: {
      where: `In the chest, at the centre of the heart.`,
      governs: `Love, compassion, empathy, attachment and emotional balance — your capacity to be connected to yourself and to other people at the same time.`,
      balanced: `When this centre is open, love moves in both directions without a toll being charged. You can be close to people without losing your own outline, and you can be kind to yourself with the same ease you extend outward. It shows up as steadiness rather than intensity — the ability to stay present with someone's difficulty without either absorbing it or backing away from it.`,
      physical: `How connection shows up in your material life — the relationships you actually maintain, the people physically near you, whether care is something you give and receive or only administer.`,
      energy: `How much relational capacity is genuinely available to you: whether opening is something you can do, or something that costs more than you currently have.`,
      emotional: `What loving and being loved actually feels like from the inside — the felt temperature of your closest connections.`,
    },

    manipura: {
      where: `In the upper abdomen, just below the rib cage.`,
      governs: `Personal power, self-confidence, willpower, and your sense of yourself as someone who can act on the world.`,
      balanced: `When this centre is strong, you know your own strength without needing to test it against anyone. Decisions get made and followed through. There's a settledness in it — you can assert yourself without escalation, and you can yield without it feeling like defeat, because your sense of who you are isn't riding on the outcome of every exchange.`,
      physical: `How your will shows up in practice — what you actually initiate, finish and defend in the material world.`,
      energy: `The raw force available to you: how much drive you can call on, and whether it arrives when you need it or only under pressure.`,
      emotional: `How your own power feels to hold — steadying and clean, or tangled up with something that makes asserting yourself uncomfortable.`,
    },

    swadhisthana: {
      where: `In the lower abdomen, about two fingers below the navel.`,
      governs: `Creativity, sexuality, emotional balance, pleasure and the ordinary enjoyment of being alive.`,
      balanced: `When this centre is open, pleasure isn't something you have to earn first. Creativity moves without being forced, desire feels like information rather than a problem, and your emotional weather changes without knocking you over. There's a vitality to it that's easy to recognise from outside — people with an open sacral centre seem genuinely to inhabit their lives rather than manage them.`,
      physical: `How pleasure and creativity show up in your actual life — what you make, what you enjoy, whether your body is somewhere you live or something you operate.`,
      energy: `How much creative and sensual force is genuinely available, and whether it flows or has to be unblocked each time.`,
      emotional: `What wanting things feels like for you — freeing, or complicated by something older than the wanting itself.`,
    },

    muladhara: {
      where: `At the very base of the spine, in the coccyx.`,
      governs: `Physical existence, security, survival, your basic needs and your roots — the ground everything else is built on.`,
      balanced: `When this centre is stable, you feel safe in a way you don't have to keep checking. There's physical energy and endurance available, and a sense of belonging somewhere. The source calls this the most fundamental of the seven, and it means it structurally: the other centres tend to function well only to the degree this one is steady, because a nervous system braced for survival has little left over for anything higher up.`,
      physical: `How security shows up materially — housing, money, health, the concrete conditions of your safety.`,
      energy: `How much groundedness is actually available to you: whether steadiness is your baseline or something you have to manufacture.`,
      emotional: `What safety feels like from the inside — settled, or a vigilance that persists even when your circumstances no longer justify it.`,
    },

  };

  function get(key) {
    return chakras[key] || null;
  }

  return { get };

})();
