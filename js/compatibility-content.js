'use strict';

/**
 * Destiny Matrix — Compatibility (Relationship Number & Compatibility Gap)
 * ─────────────────────────────────────────────────────────────
 * Birthdate-only for BOTH people — no second name required, keeping this
 * simple and not asking for a second person's full identity just to unlock
 * it. See js/matrix-engine.js's relationshipNumber()/compatibilityGapNumber()/
 * getCompatibility() for the formulas. Entered via a second, optional date
 * input inside #numerology-index (DestinyMatrix-v1.html), separate from the
 * name input everything else in this app's Compatibility-adjacent content
 * uses.
 *
 *   Relationship Number — classicalReduce(lifePathA + lifePathB), master
 *                         numbers preserved (same rule as Life Path itself).
 *                         What the two Life Paths create TOGETHER, read as
 *                         its own third thing, not a description of either
 *                         person individually.
 *   Compatibility Gap    — reduceToSingleDigit(|lifePathA - lifePathB|),
 *                         0-8, master numbers never preserved (same
 *                         reduction Bridge/Challenges use). How much
 *                         conscious bridging this specific pairing needs —
 *                         the interpersonal version of Bridge Number's
 *                         intrapersonal one.
 *
 * Voice: title/tagline/strength/friction/invitation, same 3-part shape as
 * Mastery/Shadow/Invitation but written from a shared "the two of you"
 * perspective — `strength` = what this pairing does well when aligned,
 * standalone; `friction` = the specific way that same combination rubs when
 * it's not, standalone (not a "but" continuation of strength); `invitation`
 * = one concrete, doable joint action.
 *
 * API:
 *   DRelationshipContent.get(num)      -> { title, tagline, strength, friction, invitation } or null
 *   DCompatibilityGapContent.get(num)  -> { title, tagline, strength, friction, invitation } or null
 */

window.DRelationshipContent = (function () {
  const data = {
    1: {
      title: `Relationship 1 — Built to Begin Things`,
      tagline: `A Pairing of Pure Momentum`,
      strength: `You generate real momentum together. New projects, new directions — you go first instead of waiting to see what happens, and that combined drive moves things that would stall with either of you alone.`,
      friction: `You compete over who's actually leading, or chase one beginning after another without either of you slowing down to finish what the last one started.`,
      invitation: `Let one of you lead fully on something this month while the other genuinely follows. Then finish it before starting the next thing.`,
    },
    2: {
      title: `Relationship 2 — Built for Partnership`,
      tagline: `A Pairing of Shared Pace`,
      strength: `You move at each other's pace instead of competing for the lead. You read each other's moods fast, and harmony matters more here than either of you being individually right.`,
      friction: `You accommodate each other so much that neither of you says what you actually want anymore. The togetherness starts to blur into sameness.`,
      invitation: `Each name one clear preference this month, separately, without checking it against the other first.`,
    },
    3: {
      title: `Relationship 3 — Built for Joy and Expression`,
      tagline: `A Pairing That Stays Light`,
      strength: `You generate real lightness together — conversation that flows, humor that lands. This relationship is genuinely enjoyable to be near, not just to be in.`,
      friction: `You skate past real difficulty on charm. Humor becomes the way you avoid a hard conversation neither of you actually wants to have.`,
      invitation: `Have one genuinely serious conversation this month without deflecting it with a joke.`,
    },
    4: {
      title: `Relationship 4 — Built to Last`,
      tagline: `A Pairing With Real Durability`,
      strength: `You build something concrete together, not just a feeling. Plans get followed through on, and you take real, practical responsibility for what you're building.`,
      friction: `Stability calcifies into routine. Structure gets so solid it stops leaving room for anything new.`,
      invitation: `Try something genuinely new together this month, with no practical justification required.`,
    },
    5: {
      title: `Relationship 5 — Built for Change`,
      tagline: `A Pairing in Constant Motion`,
      strength: `You handle unplanned change together with real ease. New places, new experiences — this relationship doesn't sit still, and that keeps it alive.`,
      friction: `You never quite put down roots. Momentum substitutes for the kind of depth that only comes from staying somewhere long enough to be tested.`,
      invitation: `Stay with one plan this month exactly as originally made. Resist the pull to change it.`,
    },
    6: {
      title: `Relationship 6 — Built Around Care`,
      tagline: `A Pairing of Deep Devotion`,
      strength: `You default to taking care of each other without being asked. Home, in whatever form it takes for you two, matters here more than in most pairings.`,
      friction: `Caretaking curdles into control. You manage each other out of love until love starts to feel like supervision.`,
      invitation: `Let one thing go uncared-for this month that the other person actually wants to handle alone.`,
    },
    7: {
      title: `Relationship 7 — Built for Depth`,
      tagline: `A Pairing That Runs Private`,
      strength: `You go past small talk fast. This relationship runs on genuine understanding, not constant activity, and quiet time together feels as intimate as active time.`,
      friction: `You turn inward together so completely the relationship becomes a closed loop, isolated from everyone else.`,
      invitation: `Include one other person meaningfully in your world together this month.`,
    },
    8: {
      title: `Relationship 8 — Built to Achieve`,
      tagline: `A Pairing That Gets Results`,
      strength: `You actually build things together, not just talk about them. Shared goals get accomplished, and you function as a genuine team with something to show for it.`,
      friction: `You measure the relationship by what it's produced. Feeling gets quietly deprioritized behind results.`,
      invitation: `Measure this month's success by how connected you felt, not by what you accomplished.`,
    },
    9: {
      title: `Relationship 9 — Built to Give`,
      tagline: `A Pairing That Reaches Outward`,
      strength: `Your care reaches past the two of you, toward people and causes bigger than either partner alone. Shared meaning comes easily here.`,
      friction: `You give so much to everyone else that the relationship between the two of you quietly runs low on the same care.`,
      invitation: `Direct one act of this month's generosity specifically at each other, not the wider world.`,
    },
    11: {
      title: `Master Relationship 11 — A Heightened Connection`,
      tagline: `A Pairing of High Charge`,
      strength: `You sense each other's moods and needs faster than most pairings manage. This connection is intense, almost intuitive, at its best.`,
      friction: `You stay in the inspired feeling of the connection without grounding any of it into the ordinary, practical work relationships actually need.`,
      invitation: `Turn one shared vision into a concrete plan this month, however small.`,
    },
    22: {
      title: `Master Relationship 22 — Built to Build Something Lasting`,
      tagline: `A Pairing of Real Scale`,
      strength: `You combine vision with the practical follow-through to actually finish what you start together. This pairing can build something substantial enough to outlast the two of you.`,
      friction: `You overextend together — taking on more scale than either of you can sustainably carry, and burning out the relationship chasing what it could build.`,
      invitation: `Pace this month's shared ambition against both of your actual energy, not just its potential.`,
    },
    33: {
      title: `Master Relationship 33 — Built Around Mutual Healing`,
      tagline: `A Pairing of Total Devotion`,
      strength: `You show up for each other, and for others, with real depth of compassion. Service to something larger comes naturally to this pairing.`,
      friction: `You give so completely, to each other and everyone around you, that neither of your own needs get equal attention inside the relationship.`,
      invitation: `Receive one act of care from each other this month without immediately deflecting or returning it.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCompatibilityGapContent = (function () {
  const data = {
    0: {
      title: `Compatibility Gap 0 — Nearly Identical Core Natures`,
      tagline: `A Match With No Translation Needed`,
      strength: `You recognize your own instincts in the other person. Misunderstanding about core motivation is rare — the ease here is real, not imagined.`,
      friction: `There's too much sameness. Nobody consistently offers a genuinely different perspective, and shared blind spots go unnoticed because you share them.`,
      invitation: `Deliberately seek out one place this month where you actually see things differently.`,
    },
    1: {
      title: `Compatibility Gap 1 — An Easily Closed Distance`,
      tagline: `A Small Daily Adjustment`,
      strength: `You find common ground quickly, even on new topics. This pairing feels easy more often than effortful.`,
      friction: `A gap this small is easy to stop paying attention to. The one real difference between you goes unaddressed because it seems too minor to raise.`,
      invitation: `Name the one place this month where your approaches genuinely differ.`,
    },
    2: {
      title: `Compatibility Gap 2 — A Light, Manageable Distance`,
      tagline: `A Gap That Resolves Fast`,
      strength: `You notice fast when you've started talking past each other, and correcting course doesn't take long. Most days your two natures cooperate without much negotiation.`,
      friction: `A distance this manageable gets ignored precisely because it's manageable. Small unaddressed differences accumulate into something bigger than any one instance suggests.`,
      invitation: `Close one small gap this month between how you each naturally approach the same situation.`,
    },
    3: {
      title: `Compatibility Gap 3 — A Real but Bridgeable Distance`,
      tagline: `A Gap That Takes Real Effort`,
      strength: `You feel a real pull in different directions sometimes, and you bridge it with an actual conversation instead of assuming understanding. The effort is real but rarely overwhelming.`,
      friction: `Left unattended, small repeated moments of talking past each other add up, each one small enough to excuse, until the distance is bigger than either of you meant.`,
      invitation: `Have one deliberate conversation this month specifically about where your instincts differ.`,
    },
    4: {
      title: `Compatibility Gap 4 — A Genuine Structural Distance`,
      tagline: `A Gap That Wants Ongoing Work`,
      strength: `You notice, more than a closer-matched pairing would, that your instinctive approaches genuinely differ — and you bridge it with real, consistent intention. This isn't dysfunction, it's just more relational work.`,
      friction: `Without ongoing attention, this settles into two separate operating systems that stop actively communicating — technically functioning on two different sets of unstated assumptions.`,
      invitation: `Build one small, repeated practice this month that deliberately checks in on how you're each actually seeing things.`,
    },
    5: {
      title: `Compatibility Gap 5 — A Wide Distance That Wants Real Attention`,
      tagline: `A Gap That Doesn't Close Itself`,
      strength: `You feel the difference between your instincts often, and you know staying connected takes real, ongoing work, not a one-time understanding you assume is permanent.`,
      friction: `Left alone, a gap this wide produces a relationship that looks functional on the surface while you quietly grow further apart in how you actually experience things.`,
      invitation: `Name, honestly, one recurring point of friction this month.`,
    },
    6: {
      title: `Compatibility Gap 6 — A Substantial Distance Between Two Natures`,
      tagline: `A Gap That Needs Real Architecture`,
      strength: `You experience a genuine split in how you each instinctively want to handle things, and you bridge it with deliberate, ongoing work instead of ignoring the pull.`,
      friction: `Without real attention, this runs on autopilot and unspoken compromise, drifting from genuine understanding without either of you quite noticing.`,
      invitation: `Choose one action this month specifically because it honors the other person's different instinct, even when yours points elsewhere.`,
    },
    7: {
      title: `Compatibility Gap 7 — A Deep Distance Worth Taking Seriously`,
      tagline: `A Gap That Asks for Ongoing Practice`,
      strength: `You feel real tension between what comes naturally to each of you, and you meet it with deliberate, sustained practice instead of a single conversation.`,
      friction: `Left unattended, this produces real disconnection — a relationship that continues while quietly running two different operating logics taking turns instead of one shared one.`,
      invitation: `Name, plainly, one place this month where your instincts are actively pulling apart.`,
    },
    8: {
      title: `Compatibility Gap 8 — The Widest Possible Distance`,
      tagline: `A Gap Built Entirely on Purpose`,
      strength: `Your instincts rarely align without deliberate translation, and that's not a flaw — the understanding you do build is unusually strong precisely because it was never accidental.`,
      friction: `Left completely unattended, this produces two parallel relationships — the one you're actually living, and a private, unspoken version each of you assumes the other understands.`,
      invitation: `Build one deliberate bridge this month between something that comes naturally to you and something that comes naturally to them.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
