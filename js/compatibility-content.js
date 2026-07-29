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
 * Full depth, distinct openings per entry (same standard as the rest of
 * the Numerology section) — no positive/negative-state framing.
 *
 * API:
 *   DRelationshipContent.get(num)      -> { heading, why, traits, shadow, path } or null
 *   DCompatibilityGapContent.get(num)  -> { heading, why, traits, shadow, path } or null
 */

window.DRelationshipContent = (function () {
  const data = {
    1: {
      heading: `Relationship 1 — A Pairing Built to Begin Things`,
      why: `Add your two Life Paths together and reduce the result, and what this specific pairing produces is a 1 — the number of starting, leading, originating. Whatever the two of you individually carry, combined you tend to generate real momentum: new projects, new directions, a shared appetite for going first rather than waiting to see what happens.`,
      traits: `Plans made together tend to actually move, rather than stay theoretical. The two of you likely energize each other toward action more than toward rest. Idle stretches probably don't suit this pairing as well as active ones do.`,
      shadow: `The risk of a pairing this driven is competing over who's actually leading, or running from one beginning to the next without either of you slowing down to finish what the last one started.`,
      path: `Try letting one of you lead fully on something this month while the other genuinely follows. You are allowed to be a pairing built for momentum and still take turns. Where has this relationship been racing forward without pausing to complete something?`,
    },
    2: {
      heading: `Relationship 2 — A Pairing Built for Partnership`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 2 — the number of cooperation and genuine emotional attunement. Whatever else the two of you bring individually, together you tend to generate real sensitivity to each other, an instinct to move at a shared pace rather than a competing one.`,
      traits: `Decisions probably get made together more often than separately in this relationship. Both of you likely notice, and respond to, each other's moods faster than either would alone. Harmony tends to matter to this pairing more than being individually right does.`,
      shadow: `The risk of a pairing this attuned is losing individual voice inside the togetherness — so much mutual accommodation that neither of you quite says what you actually want anymore.`,
      path: `Try each naming one clear preference this month, separately, without checking it against the other first. You are allowed to be deeply attuned and still be two distinct people. Where has this relationship's harmony started to blur into sameness?`,
    },
    3: {
      heading: `Relationship 3 — A Pairing Built for Joy and Expression`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 3 — the number of expression, warmth, and genuine fun. Whatever either of you carries individually, together you tend to generate real lightness: conversation that flows, humor that lands, a relationship that other people notice is alive.`,
      traits: `Time together probably includes real laughter more consistently than most pairings manage. Creative or social plans likely come easily to the two of you as a unit. This relationship tends to be genuinely enjoyable to be near, not just to be in.`,
      shadow: `The risk of a pairing this expressive is skating past real difficulty on charm — using humor to avoid a hard conversation neither of you actually wants to have.`,
      path: `Try having one genuinely serious conversation this month without deflecting it with a joke. You are allowed to be a joyful pairing and still go somewhere heavier together. What has this relationship been keeping light because heavy felt riskier?`,
    },
    4: {
      heading: `Relationship 4 — A Pairing Built to Last`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 4 — the number of structure and staying power. Whatever either of you carries individually, together you tend to generate real durability: the kind of relationship that builds something concrete rather than staying in the realm of feeling alone.`,
      traits: `Plans made in this relationship probably tend to actually get followed through on. The two of you likely take real, practical responsibility for each other and for whatever you're building together. Reliability tends to define this pairing more than spontaneity does.`,
      shadow: `The risk of a pairing this steady is calcifying into routine that stops making room for anything new — structure so solid it forgets to leave space to grow.`,
      path: `Try trying something genuinely new together this month, with no practical justification required. You are allowed to be a durable pairing and still surprise each other. Where has this relationship's stability started crowding out spontaneity?`,
    },
    5: {
      heading: `Relationship 5 — A Pairing Built for Change`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 5 — the number of freedom and motion. Whatever either of you carries individually, together you tend to generate real appetite for variety: new places, new experiences, a relationship that doesn't sit still for long.`,
      traits: `Routine probably suits this pairing less than most relationships. The two of you likely handle unplanned changes together with more ease than either would expect. Adventure tends to define this relationship as much as intimacy does.`,
      shadow: `The risk of a pairing built for change is never quite putting down roots — momentum substituting for the kind of depth that only comes from staying somewhere long enough to be tested.`,
      path: `Try staying with one plan this month exactly as originally made, resisting the pull to change it. You are allowed to be a pairing built for freedom and still choose to stay put sometimes. What has this relationship been avoiding by always moving?`,
    },
    6: {
      heading: `Relationship 6 — A Pairing Built Around Care`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 6 — the number of responsibility and devotion. Whatever either of you carries individually, together you tend to generate real depth of care: a relationship organized around looking after each other, and often the people around you too.`,
      traits: `Home, in whatever form it takes for the two of you, probably matters more to this relationship than it does to most pairings. The two of you likely default to taking care of each other without being asked. Responsibility to one another tends to run deep here.`,
      shadow: `The risk of a pairing this devoted is the caretaking curdling into control — each of you managing the other out of love, until love starts to feel like supervision.`,
      path: `Try letting one thing go uncared-for this month that the other person actually wants to handle alone. You are allowed to be a caring pairing and still let each other be independent. Where has devotion started to look like management?`,
    },
    7: {
      heading: `Relationship 7 — A Pairing Built for Depth`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 7 — the number of depth and reflection. Whatever either of you carries individually, together you tend to generate a relationship that goes past small talk fast, one built on genuine understanding rather than constant activity.`,
      traits: `Quiet time together probably feels as intimate to this pairing as active time does. The two of you likely think and process things similarly, even when you disagree. This relationship tends to run private — not much performed for an outside audience.`,
      shadow: `The risk of a pairing this internal is turning inward together so completely that the relationship becomes isolated from everyone else, a closed loop that stops letting the wider world in.`,
      path: `Try including one other person meaningfully in your world together this month. You are allowed to be a deep, private pairing and still stay connected outward. Where has this relationship's depth started to look like isolation?`,
    },
    8: {
      heading: `Relationship 8 — A Pairing Built to Achieve`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is an 8 — the number of ambition and material result. Whatever either of you carries individually, together you tend to generate real capability: a relationship that can actually build something significant, not just talk about it.`,
      traits: `Shared goals in this relationship probably tend to actually get accomplished. The two of you likely take real responsibility together for outcomes, financial or otherwise. This pairing tends to function well as a genuine team with something to show for it.`,
      shadow: `The risk of a pairing this achievement-oriented is measuring the relationship itself by what it's produced, letting feeling get quietly deprioritized behind results.`,
      path: `Try measuring this month's success by how connected you felt, not by what you accomplished. You are allowed to be an achieving pairing and still count the soft wins. What has this relationship's drive been crowding out?`,
    },
    9: {
      heading: `Relationship 9 — A Pairing Built to Give`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 9 — the number of broad compassion. Whatever either of you carries individually, together you tend to generate a relationship whose care reaches past just the two of you, toward people and causes larger than either partner alone.`,
      traits: `Generosity toward others probably comes easily to this pairing, sometimes even more easily than tending each other. The two of you likely find shared meaning in something beyond your own relationship. Purpose tends to matter to this pairing as much as intimacy does.`,
      shadow: `The risk of a pairing this outward-facing is giving so much to everyone else that the relationship between the two of you quietly runs low on the same care.`,
      path: `Try directing one act of this month's generosity specifically at each other, not at the wider world. You are allowed to be a giving pairing and still give to one another first. Where has this relationship's outward focus left the two of you under-tended?`,
    },
    11: {
      heading: `Master Relationship 11 — A Pairing With a Heightened Connection`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is an 11 — a master number, carrying more charge than the single-digit numbers around it. Whatever either of you carries individually, together you tend to generate something genuinely intense: a connection that can feel intuitive, almost telepathic, at its best.`,
      traits: `The two of you probably sense each other's moods and needs faster than most pairings manage. Inspired plans and shared visions likely come easily together. This relationship tends to feel significant, even to outside observers, in a way that's hard to fully explain.`,
      shadow: `The risk of a pairing this intense is staying purely in the inspired feeling of the connection without grounding any of it into the ordinary, practical work relationships actually need.`,
      path: `Try turning one shared vision into a concrete plan this month, however small. You are allowed to have an intense connection and still handle the practical logistics of it. Where has inspiration outpaced follow-through in this relationship?`,
    },
    22: {
      heading: `Master Relationship 22 — A Pairing Built to Build Something Lasting`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 22 — a master number carrying real weight. Whatever either of you carries individually, together you tend to generate genuine capacity to build something at scale: a life, a family, a venture substantial enough to actually outlast the two of you.`,
      traits: `Shared long-term projects probably feel more achievable to this pairing than they would to most. The two of you likely combine vision with the practical follow-through to actually finish what you start together. Ambition tends to run high in this relationship, and so does capability.`,
      shadow: `The risk of a pairing this capable is overextending together, taking on more scale than either of you can sustainably carry, and burning out the relationship in the pursuit of what it could build.`,
      path: `Try pacing this month's shared ambition against both of your actual energy, not just its potential. You are allowed to build something big together and still rest together deliberately. Where has ambition been outrunning the relationship's real capacity?`,
    },
    33: {
      heading: `Master Relationship 33 — A Pairing Built Around Mutual Healing`,
      why: `Add your two Life Paths together and reduce the result, and what this pairing produces is a 33 — a master number, the most selfless in this system. Whatever either of you carries individually, together you tend to generate a relationship organized around genuine care — for each other, and often for people well beyond the two of you.`,
      traits: `The two of you probably show up for each other, and for others, with real depth of compassion. Service to something larger likely feels natural to this pairing. This relationship tends to be defined by devotion more than by almost anything else.`,
      shadow: `The risk of a pairing this selfless is giving so completely, to each other and to everyone around you, that neither partner's own needs get equal attention inside the relationship.`,
      path: `Try receiving one act of care from each other this month without immediately deflecting or returning it. You are allowed to be a healing pairing and still be healed yourselves. What has this relationship's generosity been costing the two of you?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DCompatibilityGapContent = (function () {
  const data = {
    0: {
      heading: `Compatibility Gap 0 — Nearly Identical Core Natures`,
      why: `Reduce the distance between your two Life Paths and it lands on zero — the same underlying number, showing up in both of you. This is a genuinely rare match: whatever drives one of you tends to drive the other in almost the same way, with very little translation required to understand where the other person is actually coming from.`,
      traits: `You likely recognize your own instincts in the other person more often than most pairings do. Misunderstandings about core motivation are probably rare between you. The ease of this match is real — you're not imagining the recognition.`,
      shadow: `The risk of a match this close is too much sameness — nobody in the relationship consistently offering a genuinely different perspective, and blind spots that go unnoticed because you share them.`,
      path: `Try deliberately seeking out one place this month where you actually see things differently. You are allowed to have deep recognition and still cultivate real difference. Where might this closeness be hiding a blind spot you share?`,
    },
    1: {
      heading: `Compatibility Gap 1 — An Easily Closed Distance`,
      why: `Reduce the distance between your two Life Paths and it comes out to almost nothing — a gap of one. Your core natures sit close enough together that understanding each other rarely takes much conscious effort; it's more like a small daily adjustment than a real crossing.`,
      traits: `You likely find common ground quickly, even on genuinely new topics. Small differences in approach show up occasionally but rarely cause real friction. This pairing probably feels easy more often than it feels effortful.`,
      shadow: `A gap this small is easy to stop paying attention to entirely, and the one real difference between you can go unaddressed simply because it seems too minor to raise.`,
      path: `Try naming the one place this month where your approaches genuinely differ. You are allowed to have an easy match and still tend to its one real gap. What small difference have you been letting slide?`,
    },
    2: {
      heading: `Compatibility Gap 2 — A Light, Manageable Distance`,
      why: `Reduce the distance between your two Life Paths and you land on two — a light, genuinely manageable gap. Your core natures are close enough that most differences resolve quickly, with a small, regular effort to keep understanding each other rather than anything approaching real conflict.`,
      traits: `You likely notice fairly fast when you've started talking past each other, and correcting course doesn't usually take long. The differences between you show up more as minor friction than deep disagreement. Most days, your two natures cooperate without much negotiation.`,
      shadow: `A distance this manageable can be ignored precisely because it's manageable, letting small unaddressed differences accumulate quietly into something bigger than any one instance suggests.`,
      path: `Try closing one small gap this month between how you each naturally approach the same situation. You are allowed to have an easy match and still work at it on purpose. Where has minor difference been quietly adding up?`,
    },
    3: {
      heading: `Compatibility Gap 3 — A Real but Bridgeable Distance`,
      why: `Reduce the distance between your two Life Paths and you get three — a real, noticeable gap between your core natures. It's not so wide that it defines the relationship, but it's wide enough that understanding each other takes a genuine, deliberate effort rather than happening automatically.`,
      traits: `You likely feel a real pull in different directions sometimes — one of you drawn toward one instinct, the other toward something different. Bridging the gap usually takes an actual conversation rather than assumption. The effort is real but rarely overwhelming.`,
      shadow: `A gap this size, left unattended, tends to widen slowly — small, repeated moments of talking past each other, each one small enough to excuse, until the distance is bigger than either of you meant it to become.`,
      path: `Try having one deliberate conversation this month specifically about where your instincts differ. You are allowed to need real effort here — it doesn't mean something's wrong. Where have you been assuming understanding instead of checking for it?`,
    },
    4: {
      heading: `Compatibility Gap 4 — A Genuine Structural Distance`,
      why: `Reduce the distance between your two Life Paths and you land on four — a real, structural gap. Your core natures aren't opposed, but they don't share a foundation either; building real mutual understanding takes sustained, ongoing effort rather than a passing conversation.`,
      traits: `You likely notice, more often than a closer-matched pairing would, that your instinctive approaches to the same situation genuinely differ. Bridging the two tends to require real intention, applied consistently. This isn't dysfunction — it's simply more relational work than some pairings have to do.`,
      shadow: `A gap this size, without ongoing attention, can settle into two separate operating systems that stop actively communicating — a relationship that technically functions while running on two different sets of unstated assumptions.`,
      path: `Try building one small, repeated practice this month that deliberately checks in on how you're each actually seeing things. You are allowed to need real structure here. What would a genuine bridge, built on purpose, actually look like for the two of you?`,
    },
    5: {
      heading: `Compatibility Gap 5 — A Wide Distance That Wants Real Attention`,
      why: `Reduce the distance between your two Life Paths and you get five — a wide gap. Left alone, your two core natures genuinely drift from each other; staying connected is real, ongoing work, not a one-time understanding reached and then assumed permanent.`,
      traits: `You likely feel the difference between your instincts fairly often, sometimes as real friction rather than mild inconvenience. What comes naturally to one of you doesn't automatically make sense to the other. Bridging the gap probably requires conscious, repeated effort from both sides.`,
      shadow: `Left unattended, a gap this wide tends to produce a relationship that looks functional on the surface while the two of you quietly grow further apart in how you actually experience things.`,
      path: `Try naming, honestly, one recurring point of friction this month. You are allowed to need real, ongoing attention here. What would it take to make your different instincts cooperate instead of compete?`,
    },
    6: {
      heading: `Compatibility Gap 6 — A Substantial Distance Between Two Natures`,
      why: `Reduce the distance between your two Life Paths and you land on six — a substantial gap. Your core natures aren't at odds, but they clearly aren't the same conversation either, and understanding each other takes real, deliberate architecture, not a quick patch.`,
      traits: `You likely experience a genuine split, at times, in how you each instinctively want to handle the same situation. The pull in different directions can feel strong enough that ignoring it isn't really an option. Bridging the two tends to be effortful, ongoing work rather than an occasional correction.`,
      shadow: `A gap this size, without real attention, can produce a relationship that runs on autopilot and unspoken compromise, drifting from genuine understanding without either of you quite noticing.`,
      path: `Try choosing one action this month specifically because it honors the other person's different instinct, even when yours points elsewhere. You are allowed to need real, sustained work on this bridge. Where has autopilot been standing in for actual understanding?`,
    },
    7: {
      heading: `Compatibility Gap 7 — A Deep Distance Worth Taking Seriously`,
      why: `Reduce the distance between your two Life Paths and you get seven — a deep gap. This isn't a small mismatch; it's a genuine, structural distance between your core natures that asks for real, ongoing attention if the two of you are going to understand each other reliably.`,
      traits: `You likely feel real tension, more often than not, between what comes naturally to you and what comes naturally to the other person. Your two instincts can feel like separate forces rather than a single shared pull. Bridging them tends to require deliberate, sustained practice — not a single conversation, but an ongoing one.`,
      shadow: `Left unattended, a gap this deep tends to produce real disconnection — a relationship that technically continues while quietly feeling like two different operating logics taking turns rather than one shared one.`,
      path: `Try naming, plainly, one place this month where your instincts are actively pulling apart. You are allowed to take this gap seriously without treating it as a crisis. What would it take to build one genuine plank of understanding, today?`,
    },
    8: {
      heading: `Compatibility Gap 8 — The Widest Possible Distance`,
      why: `Reduce the distance between your two Life Paths and you land on eight — the widest gap this reduction can produce. Your core natures sit about as far apart as this system allows, meaning real mutual understanding has to be built consciously, deliberately, and more or less continuously.`,
      traits: `You likely experience a real, recurring split between what comes naturally to each of you — instincts that rarely align without deliberate translation. This isn't a flaw in the match; it's simply more relational construction work than most pairings are asked to do. The upside is that the understanding you do build tends to be unusually strong, precisely because it was never accidental.`,
      shadow: `Left completely unattended, a gap this wide can produce two genuinely parallel relationships — the one you're actually living, and a private, unspoken version each of you assumes the other understands, with less and less traffic running between the two over time.`,
      path: `Try building one deliberate bridge this month between something that comes naturally to you and something that comes naturally to them. You are allowed to need constant, conscious work here — it's not a failure, it's the actual shape of this particular match. What's the first plank of that bridge?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
