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
      strength: `Together you generate momentum that neither of you produces alone. New projects, new directions, a life that's actually going somewhere instead of circling the same conversation — you go first instead of waiting to see what happens, and that combined drive moves things a single person, or a more cautious pairing, would let stall. Being around each other makes starting things feel natural rather than risky, and that compounds: the more you begin together, the more beginning becomes simply how the relationship operates.`,
      friction: `The same drive that moves things also puts you in competition over who's actually leading. Two people wired to go first don't naturally take turns, so decisions can turn into a quiet contest neither of you names, and the relationship can end up chasing one beginning after another without either of you slowing down long enough to finish what the last one started. What gets lost is completion — the unglamorous second half of anything you start together.`,
      invitation: `Let one of you lead fully on something this month while the other genuinely follows. Then finish it before starting the next thing.`,
    },
    2: {
      title: `Relationship 2 — Built for Partnership`,
      tagline: `A Pairing of Shared Pace`,
      strength: `You move at each other's pace instead of competing for the lead, which makes this a genuinely restful kind of partnership. You read each other's moods quickly, adjust without being asked, and harmony matters here more than either of you being individually right — which sounds small until you notice how rare it actually is. Decisions get made together rather than won, and the relationship tends to feel less like two people negotiating and more like one shared rhythm.`,
      friction: `The same accommodation that makes you easy together can quietly erase both of you. You adjust to each other so consistently that neither one says what they actually want anymore — preferences get smoothed over before they're even spoken, because disagreement feels like a disruption to the harmony you both value. Over time the togetherness can blur into sameness, two people so synced to each other's pace that neither is entirely sure what their own pace would have been.`,
      invitation: `Each name one clear preference this month, separately, without checking it against the other first.`,
    },
    3: {
      title: `Relationship 3 — Built for Joy and Expression`,
      tagline: `A Pairing That Stays Light`,
      strength: `This relationship is genuinely enjoyable to be near, not just to be in. Conversation flows without effort, humor lands the way it doesn't with most people, and there's a lightness between you that other pairings actively work for and you seem to have by default. That ease isn't superficial — it's a real form of intimacy, the kind that makes ordinary time together feel worth having rather than something to get through.`,
      friction: `The same lightness that carries you through good times can carry you straight past the hard ones. Humor becomes the way you avoid a conversation neither of you actually wants to have, and real difficulty gets skated over on charm rather than met directly. What accumulates underneath is whatever never got said seriously — and it doesn't dissolve just because you're both good at changing the subject.`,
      invitation: `Have one genuinely serious conversation this month without deflecting it with a joke.`,
    },
    4: {
      title: `Relationship 4 — Built to Last`,
      tagline: `A Pairing With Real Durability`,
      strength: `You build something concrete together, not just a feeling. Plans get followed through on, responsibilities get taken seriously by both of you, and there's a real, practical solidity to this relationship that shows up in what actually gets done — not just what gets discussed. People can tell this pairing is built to last, because it visibly is: showing up, keeping commitments, constructing something durable instead of just enjoying each other in the moment.`,
      friction: `The same solidity that makes this durable can calcify into routine that stops leaving room for anything new. Structure that once felt like safety can start to feel like a groove neither of you chose, where spontaneity has nowhere left to happen and the relationship runs on schedule rather than aliveness. What gets lost isn't the foundation — it's whatever might have been built on top of it if either of you had been willing to deviate from the plan.`,
      invitation: `Try something genuinely new together this month, with no practical justification required.`,
    },
    5: {
      title: `Relationship 5 — Built for Change`,
      tagline: `A Pairing in Constant Motion`,
      strength: `You handle unplanned change together with real ease, which is rarer between two people than it sounds. New places, new experiences, a sudden shift in plans — this relationship doesn't sit still, and that keeps it genuinely alive rather than merely comfortable. Neither of you needs the other to stay predictable, which means you get to keep discovering each other instead of settling into a fixed read on who the other person is.`,
      friction: `The same restlessness that keeps things alive can keep you from ever putting down roots. Momentum substitutes for the kind of depth that only comes from staying somewhere — or with something — long enough for it to actually be tested. You may notice the relationship has a lot of motion and comparatively little that's been built to withstand a real strain, because neither of you has stayed still long enough to find out.`,
      invitation: `Stay with one plan this month exactly as originally made. Resist the pull to change it.`,
    },
    6: {
      title: `Relationship 6 — Built Around Care`,
      tagline: `A Pairing of Deep Devotion`,
      strength: `You default to taking care of each other without being asked, and that instinct runs deep rather than performed. Home, in whatever form it takes for you two, matters here more than in most pairings — this relationship organizes itself around making a space where both of you are genuinely looked after, and that devotion is felt by anyone who spends time around you.`,
      friction: `The same devotion can curdle into control without either of you quite noticing the shift. You manage each other out of love — correcting, arranging, deciding what's best for the other person — until love starts to feel like supervision. What began as care becomes a quiet reduction of the other person's autonomy, dressed up as concern.`,
      invitation: `Let one thing go uncared-for this month that the other person actually wants to handle alone.`,
    },
    7: {
      title: `Relationship 7 — Built for Depth`,
      tagline: `A Pairing That Runs Private`,
      strength: `You go past small talk fast, and this relationship runs on genuine understanding rather than constant activity. Quiet time together feels as intimate as active time — you don't need to be doing something to feel close, which lets the relationship hold a kind of depth that busier pairings rarely reach. What you have with each other feels earned rather than assumed.`,
      friction: `The same depth that makes you close can turn inward so completely the relationship becomes a closed loop. You retreat into each other and away from everyone else, until the world outside the two of you starts to feel unnecessary — or worse, intrusive. Isolation dressed as intimacy is still isolation, and it tends to go unnoticed from the inside precisely because it feels like closeness.`,
      invitation: `Include one other person meaningfully in your world together this month.`,
    },
    8: {
      title: `Relationship 8 — Built to Achieve`,
      tagline: `A Pairing That Gets Results`,
      strength: `You actually build things together, not just talk about them. Shared goals get accomplished, and you function as a genuine team with something concrete to show for the time you've spent together — a functioning household, a shared project, a track record of following through. That competence is real, and it gives the relationship a kind of ballast most pairings don't have.`,
      friction: `The same drive for results can quietly become the measure of the relationship itself. What you've produced together starts to matter more than how connected you actually felt while producing it, and feeling gets deprioritized behind output without either of you deciding that on purpose. You may notice you can list what you built this year faster than you can say how close you felt while building it.`,
      invitation: `Measure this month's success by how connected you felt, not by what you accomplished.`,
    },
    9: {
      title: `Relationship 9 — Built to Give`,
      tagline: `A Pairing That Reaches Outward`,
      strength: `Your care reaches past the two of you, toward people and causes bigger than either partner alone. Shared meaning comes easily here — you find purpose together in something larger, and that outward orientation gives the relationship a scope beyond just the two of you keeping each other company. It's a genuinely generous way to be paired.`,
      friction: `The same generosity that reaches outward can leave the relationship itself running on empty. You give so much to everyone else — causes, community, people who need you — that the care circulating between the two of you quietly runs short. What's left over for each other can end up being whatever's left after everyone else has already been given to.`,
      invitation: `Direct one act of this month's generosity specifically at each other, not the wider world.`,
    },
    11: {
      title: `Master Relationship 11 — A Heightened Connection`,
      tagline: `A Pairing of High Charge`,
      strength: `You sense each other's moods and needs faster than most pairings manage, almost before either of you has said anything. This connection runs intuitive at its best — a kind of attunement that feels less like communication and more like already knowing. That charge is real, and it makes the relationship feel significant in a way that's hard to fake.`,
      friction: `The same intensity that makes this connection feel significant can keep it floating above the ordinary work relationships actually need. You stay in the inspired feeling of being connected without grounding any of it into the practical, unglamorous maintenance — plans followed through on, logistics handled, the mundane parts of building a life together. Inspiration without grounding tends to burn bright and then burn out.`,
      invitation: `Turn one shared vision into a concrete plan this month, however small.`,
    },
    22: {
      title: `Master Relationship 22 — Built to Build Something Lasting`,
      tagline: `A Pairing of Real Scale`,
      strength: `You combine vision with the practical follow-through to actually finish what you start together, which is a rarer combination than it sounds. This pairing can build something substantial enough to outlast the two of you individually — a family, a shared body of work, a legacy neither of you could have built alone. The scale you're capable of together is genuinely real, not aspirational.`,
      friction: `The same capacity for scale can tip into overextension. You take on more than either of you can sustainably carry, chasing what the relationship could build rather than checking what it currently has the energy for — and the relationship itself can burn out in service of its own ambition. Bigger isn't automatically better if neither of you is left with anything when it's built.`,
      invitation: `Pace this month's shared ambition against both of your actual energy, not just its potential.`,
    },
    33: {
      title: `Master Relationship 33 — Built Around Mutual Healing`,
      tagline: `A Pairing of Total Devotion`,
      strength: `You show up for each other, and for others, with real depth of compassion. Service to something larger than the relationship itself comes naturally here, and that devotion isn't performed — it's the actual operating mode of this pairing. Being around you two, people feel genuinely cared for, not managed.`,
      friction: `The same devotion that makes you generous can leave both of you running a permanent deficit. You give so completely — to each other and to everyone around you — that neither person's own needs get equal attention inside the relationship. Total devotion outward can quietly mean nobody is devoted to making sure the two of you are actually okay.`,
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
      strength: `You recognize your own instincts in the other person, which makes this pairing unusually easy to be inside. Misunderstanding about core motivation is rare — when one of you reacts to something, the other already understands why, without needing it explained. The ease here is real, not imagined, and it makes daily life together feel less like negotiation and more like recognition.`,
      friction: `The same sameness that makes this easy also means nobody in the relationship consistently offers a genuinely different perspective. You share blind spots as completely as you share instincts, so the places where you're both missing something stay missing — there's no built-in corrective, because the other person doesn't see it either. A pairing this matched can mistake agreement for accuracy.`,
      invitation: `Deliberately seek out one place this month where you actually see things differently.`,
    },
    1: {
      title: `Compatibility Gap 1 — An Easily Closed Distance`,
      tagline: `A Small Daily Adjustment`,
      strength: `You find common ground quickly, even on new topics, because the distance between your instincts is small enough to bridge without much effort. This pairing feels easy more often than effortful — a real difference between you exists, but it rarely requires the kind of deliberate work that wider gaps demand. Most days, your two natures simply cooperate.`,
      friction: `A gap this small is easy to stop paying attention to entirely. Because it rarely causes visible trouble, the one real difference between you can go unaddressed for years — it seems too minor to raise, so it never gets raised, and small unspoken differences have a way of resurfacing at exactly the moments you can least afford them.`,
      invitation: `Name the one place this month where your approaches genuinely differ.`,
    },
    2: {
      title: `Compatibility Gap 2 — A Light, Manageable Distance`,
      tagline: `A Gap That Resolves Fast`,
      strength: `You notice fast when you've started talking past each other, and correcting course doesn't take long. Most days your two natures cooperate without much negotiation, and when friction does show up, it resolves quickly enough that it rarely accumulates into anything larger. This is a genuinely manageable distance, and you manage it well.`,
      friction: `Precisely because it's manageable, this distance gets ignored. Small unaddressed differences accumulate quietly — each one too minor on its own to bring up — until they've become something bigger than any single instance would suggest. Manageable isn't the same as attended to, and the gap widens fastest when both of you assume it's too small to matter.`,
      invitation: `Close one small gap this month between how you each naturally approach the same situation.`,
    },
    3: {
      title: `Compatibility Gap 3 — A Real but Bridgeable Distance`,
      tagline: `A Gap That Takes Real Effort`,
      strength: `You feel a real pull in different directions sometimes, and instead of assuming understanding, you bridge it with an actual conversation. The effort involved is real but rarely overwhelming — this is a distance that responds to being addressed, which means the work you put in actually pays off rather than just managing the symptom.`,
      friction: `Left unattended, small repeated moments of talking past each other add up. Each one is small enough to excuse in the moment, but they accumulate, and the distance ends up bigger than either of you meant it to become — not because of one large disagreement, but because of many small ones neither of you thought was worth a real conversation.`,
      invitation: `Have one deliberate conversation this month specifically about where your instincts differ.`,
    },
    4: {
      title: `Compatibility Gap 4 — A Genuine Structural Distance`,
      tagline: `A Gap That Wants Ongoing Work`,
      strength: `You notice, more than a closer-matched pairing would, that your instinctive approaches genuinely differ — and you bridge it with real, consistent intention rather than a one-time fix. This isn't dysfunction; it's simply more relational work, and you've been willing to keep doing it, which is what actually makes a gap this size sustainable.`,
      friction: `Without ongoing attention, this settles into two separate operating systems that quietly stop communicating with each other. You keep functioning, but on two different sets of unstated assumptions — each of you privately certain you understand the other, while actually running parallel rather than shared logic.`,
      invitation: `Build one small, repeated practice this month that deliberately checks in on how you're each actually seeing things.`,
    },
    5: {
      title: `Compatibility Gap 5 — A Wide Distance That Wants Real Attention`,
      tagline: `A Gap That Doesn't Close Itself`,
      strength: `You feel the difference between your instincts often, and you've genuinely accepted that staying connected takes real, ongoing work — not a one-time understanding you can assume is permanent. That acceptance is itself the strength: you're not surprised by the effort this pairing requires, so you keep showing up for it.`,
      friction: `Left alone, a gap this wide produces a relationship that looks functional on the surface while the two of you quietly grow further apart in how you actually experience things. The distance doesn't announce itself loudly — it just accumulates in the background until you notice you've been having two different relationships that happened to look like one.`,
      invitation: `Name, honestly, one recurring point of friction this month.`,
    },
    6: {
      title: `Compatibility Gap 6 — A Substantial Distance Between Two Natures`,
      tagline: `A Gap That Needs Real Architecture`,
      strength: `You experience a genuine split in how you each instinctively want to handle things, and rather than ignoring the pull, you bridge it with deliberate, ongoing work. This is one of the more demanding gaps to sustain, and the fact that you keep choosing to engage with it — rather than letting it run on autopilot — is what makes the relationship actually work.`,
      friction: `Without real attention, this runs on autopilot and unspoken compromise. You drift from genuine understanding into a kind of default accommodation, where neither of you is quite lying but neither is quite being fully honest either — and the drift is gradual enough that it's hard to notice until the distance has become the norm.`,
      invitation: `Choose one action this month specifically because it honors the other person's different instinct, even when yours points elsewhere.`,
    },
    7: {
      title: `Compatibility Gap 7 — A Deep Distance Worth Taking Seriously`,
      tagline: `A Gap That Asks for Ongoing Practice`,
      strength: `You feel real tension between what comes naturally to each of you, and you meet it with deliberate, sustained practice rather than a single conversation you hope will settle it. That sustained commitment is exactly what a gap this size requires, and choosing to keep practicing it — rather than expecting it to resolve once — is the actual skill here.`,
      friction: `Left unattended, this produces real disconnection — a relationship that continues while quietly running two different operating logics that take turns rather than merge into one shared one. You may find yourselves cooperating without ever quite being aligned, each operating from a different set of instincts that happens to coexist rather than combine.`,
      invitation: `Name, plainly, one place this month where your instincts are actively pulling apart.`,
    },
    8: {
      title: `Compatibility Gap 8 — The Widest Possible Distance`,
      tagline: `A Gap Built Entirely on Purpose`,
      strength: `Your instincts rarely align without deliberate translation, and that's not a flaw — the understanding you do build is unusually strong precisely because it was never accidental. Nothing about this pairing runs on assumption; everything has to be actively constructed, which means what you have together is genuinely earned rather than simply lucky.`,
      friction: `Left completely unattended, this produces two parallel relationships — the one you're actually living, and a private, unspoken version each of you assumes the other understands. The widest gap doesn't announce itself as conflict; it shows up as two people quietly narrating different stories about the same relationship, each convinced the other one knows.`,
      invitation: `Build one deliberate bridge this month between something that comes naturally to you and something that comes naturally to them.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
