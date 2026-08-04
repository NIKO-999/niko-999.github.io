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
      strength: `Together you generate momentum that neither of you produces alone — new projects, new directions, a life that's actually going somewhere instead of circling the same conversation. You go first instead of waiting to see what happens, and that combined drive moves things a single person, or a more cautious pairing, would let stall. Being around each other makes starting things feel natural rather than risky. And that compounds over time: the more you begin together, the more beginning becomes simply how the relationship operates.`,
      friction: `The same drive that moves things also puts you in competition over who's actually leading. Two people wired to go first don't naturally take turns, so decisions can turn into a quiet contest neither of you names out loud. Underneath the competition is often a fear that following, even once, would mean losing something essential about who you are in the relationship. The relationship can end up chasing one beginning after another without either of you slowing down long enough to finish what the last one started.`,
      invitation: `Ask yourselves honestly which of you has been quietly competing to lead lately. Let one of you lead fully on something this month while the other genuinely follows. Then finish it before starting the next thing. Notice whether following costs either of you anything real.`,
    },
    2: {
      title: `Relationship 2 — Built for Partnership`,
      tagline: `A Pairing of Shared Pace`,
      strength: `You move at each other's pace instead of competing for the lead, which makes this a genuinely restful kind of partnership. You read each other's moods quickly and adjust without being asked. Harmony matters here more than either of you being individually right, which sounds small until you notice how rare it actually is. And decisions get made together rather than won, so the relationship feels less like negotiation and more like one shared rhythm.`,
      friction: `The same accommodation that makes you easy together can quietly erase both of you. You adjust to each other so consistently that neither one says what they actually want anymore, preferences smoothed over before they're even spoken. Underneath the smoothing is often a fear that disagreement itself would threaten the harmony you both depend on. Over time the togetherness can blur into sameness, two people so synced to each other's pace that neither is entirely sure what their own pace would have been.`,
      invitation: `Ask yourselves honestly what you've each stopped saying to protect the harmony. Each name one clear preference this month, separately, without checking it against the other first. Say it plainly, without softening it into a suggestion. Notice that stating it doesn't actually break anything.`,
    },
    3: {
      title: `Relationship 3 — Built for Joy and Expression`,
      tagline: `A Pairing That Stays Light`,
      strength: `This relationship is genuinely enjoyable to be near, not just to be in. Conversation flows without effort, and humor lands the way it doesn't with most people. There's a lightness between you that other pairings actively work for and you seem to have by default. That ease isn't superficial — it's a real form of intimacy, the kind that makes ordinary time together feel worth having rather than something to get through.`,
      friction: `The same lightness that carries you through good times can carry you straight past the hard ones. Humor becomes the way you avoid a conversation neither of you actually wants to have, and real difficulty gets skated over on charm rather than met directly. Underneath the deflection is often a fear that seriousness, once let in, might not leave. What accumulates is whatever never got said, and it doesn't dissolve just because you're both good at changing the subject.`,
      invitation: `Ask yourselves honestly what's been sitting underneath the jokes lately. Have one genuinely serious conversation this month without deflecting it with a joke. Let the discomfort of it sit instead of resolving it with humor. Notice that the relationship survives being serious.`,
    },
    4: {
      title: `Relationship 4 — Built to Last`,
      tagline: `A Pairing With Real Durability`,
      strength: `You build something concrete together, not just a feeling. Plans get followed through on, and responsibilities get taken seriously by both of you. There's a real, practical solidity to this relationship that shows up in what actually gets done, not just what gets discussed. People can tell this pairing is built to last, because it visibly is: showing up, keeping commitments, constructing something durable.`,
      friction: `The same solidity that makes this durable can calcify into routine that stops leaving room for anything new. Structure that once felt like safety can start to feel like a groove neither of you chose. Underneath the routine is often a fear that spontaneity would threaten the stability you've both worked to build. What gets lost isn't the foundation — it's whatever might have been built on top of it if either of you had been willing to deviate from the plan.`,
      invitation: `Ask yourselves honestly what you've avoided trying because it wasn't in the plan. Try something genuinely new together this month, with no practical justification required. Let it be spontaneous rather than scheduled. Notice that the foundation holds even without a plan behind it.`,
    },
    5: {
      title: `Relationship 5 — Built for Change`,
      tagline: `A Pairing in Constant Motion`,
      strength: `You handle unplanned change together with real ease, which is rarer between two people than it sounds. New places, new experiences, a sudden shift in plans — this relationship doesn't sit still, and that keeps it genuinely alive rather than merely comfortable. Neither of you needs the other to stay predictable. And that means you get to keep discovering each other instead of settling into a fixed read on who the other person is.`,
      friction: `The same restlessness that keeps things alive can keep you from ever putting down roots. Momentum substitutes for the kind of depth that only comes from staying somewhere long enough for it to actually be tested. Underneath the constant motion is sometimes a fear that stillness would reveal something the movement has been letting you avoid. You may notice the relationship has a lot of motion and comparatively little built to withstand real strain.`,
      invitation: `Ask yourselves honestly what staying still together might actually reveal. Stay with one plan this month exactly as originally made. Resist the pull to change it, even when a better option appears. Notice what staying still actually feels like between you.`,
    },
    6: {
      title: `Relationship 6 — Built Around Care`,
      tagline: `A Pairing of Deep Devotion`,
      strength: `You default to taking care of each other without being asked, and that instinct runs deep rather than performed. Home, in whatever form it takes for you two, matters here more than in most pairings. This relationship organizes itself around making a space where both of you are genuinely looked after. And that devotion is felt by anyone who spends time around you.`,
      friction: `The same devotion can curdle into control without either of you quite noticing the shift. You manage each other out of love — correcting, arranging, deciding what's best for the other person — until love starts to feel like supervision. Underneath the managing is often a fear that letting go of control would mean the other person isn't actually looked after. What began as care becomes a quiet reduction of the other person's autonomy, dressed up as concern.`,
      invitation: `Ask yourselves honestly what you've been managing that was never yours to manage. Let one thing go uncared-for this month that the other person actually wants to handle alone. Resist the urge to check in on it. Notice that they handle it fine without you.`,
    },
    7: {
      title: `Relationship 7 — Built for Depth`,
      tagline: `A Pairing That Runs Private`,
      strength: `You go past small talk fast, and this relationship runs on genuine understanding rather than constant activity. Quiet time together feels as intimate as active time — you don't need to be doing something to feel close. That lets the relationship hold a kind of depth that busier pairings rarely reach. What you have with each other feels earned rather than assumed.`,
      friction: `The same depth that makes you close can turn inward so completely the relationship becomes a closed loop. You retreat into each other and away from everyone else, until the world outside the two of you starts to feel unnecessary or intrusive. Underneath the retreat is sometimes a fear that outside people would dilute what you've built together. Isolation dressed as intimacy is still isolation, and it tends to go unnoticed from the inside precisely because it feels like closeness.`,
      invitation: `Ask yourselves honestly who you've quietly stopped making room for. Include one other person meaningfully in your world together this month. Notice the instinct to protect your closed loop, and let it in anyway. Watch whether the closeness survives being shared.`,
    },
    8: {
      title: `Relationship 8 — Built to Achieve`,
      tagline: `A Pairing That Gets Results`,
      strength: `You actually build things together, not just talk about them. Shared goals get accomplished, and you function as a genuine team with something concrete to show for the time you've spent together. That competence is real, and it gives the relationship a kind of ballast most pairings don't have. You've proven, repeatedly, that you can follow through on what you set out to build.`,
      friction: `The same drive for results can quietly become the measure of the relationship itself. What you've produced together starts to matter more than how connected you actually felt while producing it. Underneath the drive is often a fear that a relationship without visible output isn't actually working. You may notice you can list what you built this year faster than you can say how close you felt while building it.`,
      invitation: `Ask yourselves honestly when you last measured this relationship by feeling instead of output. Measure this month's success by how connected you felt, not by what you accomplished. Say the answer out loud to each other, even if it's uncomfortable. Notice which measure actually matters more.`,
    },
    9: {
      title: `Relationship 9 — Built to Give`,
      tagline: `A Pairing That Reaches Outward`,
      strength: `Your care reaches past the two of you, toward people and causes bigger than either partner alone. Shared meaning comes easily here — you find purpose together in something larger. That outward orientation gives the relationship a scope beyond just the two of you keeping each other company. It's a genuinely generous way to be paired.`,
      friction: `The same generosity that reaches outward can leave the relationship itself running on empty. You give so much to everyone else that the care circulating between the two of you quietly runs short. Underneath the outward giving is sometimes a fear that focusing inward would look selfish by comparison. What's left over for each other can end up being whatever's left after everyone else has already been given to.`,
      invitation: `Ask yourselves honestly when you last gave to each other before giving to the wider world. Direct one act of this month's generosity specifically at each other, not the wider world. Do it first, before anyone else gets your care today. Notice that it doesn't take anything away from anyone else.`,
    },
    11: {
      title: `Master Relationship 11 — A Heightened Connection`,
      tagline: `A Pairing of High Charge`,
      strength: `You sense each other's moods and needs faster than most pairings manage, almost before either of you has said anything. This connection runs intuitive at its best, an attunement that feels less like communication and more like already knowing. That charge is real, and it makes the relationship feel significant in a way that's hard to fake. Few pairings reach this level of felt understanding.`,
      friction: `The same intensity that makes this connection feel significant can keep it floating above the ordinary work relationships actually need. You stay in the inspired feeling of being connected without grounding any of it into practical maintenance. Underneath the floating is sometimes a fear that the mundane parts of a shared life would dim the intensity you both love. Inspiration without grounding tends to burn bright and then burn out.`,
      invitation: `Ask yourselves honestly what practical thing you've been avoiding because it feels less alive than the connection itself. Turn one shared vision into a concrete plan this month, however small. Do the unglamorous logistics together, not just the dreaming. Notice that grounding it doesn't kill the charge.`,
    },
    22: {
      title: `Master Relationship 22 — Built to Build Something Lasting`,
      tagline: `A Pairing of Real Scale`,
      strength: `You combine vision with the practical follow-through to actually finish what you start together, a rarer combination than it sounds. This pairing can build something substantial enough to outlast the two of you individually. The scale you're capable of together is genuinely real, not aspirational. You've proven you can turn a large vision into something concrete.`,
      friction: `The same capacity for scale can tip into overextension. You take on more than either of you can sustainably carry, chasing what the relationship could build rather than checking what it currently has energy for. Underneath the overextension is often a fear that pacing yourselves would mean settling for less than you're capable of. The relationship itself can burn out in service of its own ambition.`,
      invitation: `Ask yourselves honestly whether your current pace matches your actual energy or just your ambition. Pace this month's shared ambition against both of your actual energy, not just its potential. Scale back one commitment that's stretching you thin. Notice that the vision survives a slower pace.`,
    },
    33: {
      title: `Master Relationship 33 — Built Around Mutual Healing`,
      tagline: `A Pairing of Total Devotion`,
      strength: `You show up for each other, and for others, with real depth of compassion. Service to something larger than the relationship itself comes naturally here, and that devotion isn't performed — it's the actual operating mode of this pairing. Being around you two, people feel genuinely cared for, not managed. That capacity for total presence is rare.`,
      friction: `The same devotion that makes you generous can leave both of you running a permanent deficit. You give so completely — to each other and to everyone around you — that neither person's own needs get equal attention inside the relationship. Underneath the giving is often a fear that pausing to receive would mean the devotion wasn't real. Total devotion outward can quietly mean nobody is devoted to making sure the two of you are actually okay.`,
      invitation: `Ask yourselves honestly when either of you last received care instead of only giving it. Receive one act of care from each other this month without immediately deflecting or returning it. Let it land without repaying it right away. Notice that receiving doesn't diminish the devotion.`,
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
      strength: `You recognize your own instincts in the other person, which makes this pairing unusually easy to be inside. Misunderstanding about core motivation is rare — when one of you reacts to something, the other already understands why, without needing it explained. The ease here is real, not imagined. And it makes daily life together feel less like negotiation and more like recognition.`,
      friction: `The same sameness that makes this easy also means nobody in the relationship consistently offers a genuinely different perspective. You share blind spots as completely as you share instincts, so the places where you're both missing something stay missing. Underneath the ease is a risk neither of you notices: nothing about this pairing forces either of you to grow past where you already were. A pairing this matched can mistake agreement for accuracy.`,
      invitation: `Ask yourselves honestly what you've never had to examine because you already agreed on it. Deliberately seek out one place this month where you actually see things differently. Sit with the difference instead of resolving it quickly. Notice what it teaches you that agreement never could.`,
    },
    1: {
      title: `Compatibility Gap 1 — An Easily Closed Distance`,
      tagline: `A Small Daily Adjustment`,
      strength: `You find common ground quickly, even on new topics, because the distance between your instincts is small enough to bridge without much effort. This pairing feels easy more often than effortful. A real difference between you exists, but it rarely requires the kind of deliberate work that wider gaps demand. Most days, your two natures simply cooperate.`,
      friction: `A gap this small is easy to stop paying attention to entirely. Because it rarely causes visible trouble, the one real difference between you can go unaddressed for years. Underneath the neglect is the assumption that anything this minor couldn't possibly matter, which is exactly what lets it resurface at the worst moment. It seems too minor to raise, so it never gets raised.`,
      invitation: `Ask yourselves honestly what small difference you've both agreed is too minor to mention. Name the one place this month where your approaches genuinely differ. Say it out loud, even though it feels unnecessary. Notice that naming it costs nothing and closes it for good.`,
    },
    2: {
      title: `Compatibility Gap 2 — A Light, Manageable Distance`,
      tagline: `A Gap That Resolves Fast`,
      strength: `You notice fast when you've started talking past each other, and correcting course doesn't take long. Most days your two natures cooperate without much negotiation. When friction does show up, it resolves quickly enough that it rarely accumulates into anything larger. This is a genuinely manageable distance, and you manage it well.`,
      friction: `Precisely because it's manageable, this distance gets ignored. Small unaddressed differences accumulate quietly, each one too minor on its own to bring up. Underneath the ease of managing it is the assumption that manageable means resolved, when it usually just means postponed. Manageable isn't the same as attended to, and the gap widens fastest when both of you assume it's too small to matter.`,
      invitation: `Ask yourselves honestly which small difference you've been managing instead of actually closing. Close one small gap this month between how you each naturally approach the same situation. Address it directly instead of just working around it. Notice the relief of one less thing quietly managed.`,
    },
    3: {
      title: `Compatibility Gap 3 — A Real but Bridgeable Distance`,
      tagline: `A Gap That Takes Real Effort`,
      strength: `You feel a real pull in different directions sometimes, and instead of assuming understanding, you bridge it with an actual conversation. The effort involved is real but rarely overwhelming. This is a distance that responds to being addressed, which means the work you put in actually pays off rather than just managing the symptom. You've proven, more than once, that talking it through actually closes the gap.`,
      friction: `Left unattended, small repeated moments of talking past each other add up. Each one is small enough to excuse in the moment, but they accumulate. Underneath the accumulation is often a shared assumption that any single moment isn't worth the effort of a real conversation. The distance ends up bigger than either of you meant it to become.`,
      invitation: `Ask yourselves honestly which recent small moment you both let pass instead of addressing. Have one deliberate conversation this month specifically about where your instincts differ. Don't wait for it to become a bigger issue first. Notice how much lighter it feels addressed early.`,
    },
    4: {
      title: `Compatibility Gap 4 — A Genuine Structural Distance`,
      tagline: `A Gap That Wants Ongoing Work`,
      strength: `You notice, more than a closer-matched pairing would, that your instinctive approaches genuinely differ, and you bridge it with real, consistent intention rather than a one-time fix. This isn't dysfunction; it's simply more relational work. And you've been willing to keep doing it, which is what actually makes a gap this size sustainable. The willingness itself is the achievement most pairings this different never manage.`,
      friction: `Without ongoing attention, this settles into two separate operating systems that quietly stop communicating with each other. You keep functioning, but on two different sets of unstated assumptions. Underneath the drift is a fear that surfacing the gap regularly would make the relationship feel more effortful than either of you wants to admit it is. Each of you stays privately certain you understand the other, while actually running parallel logic.`,
      invitation: `Ask yourselves honestly how long it's been since you actually checked whether you're seeing the same thing. Build one small, repeated practice this month that deliberately checks in on how you're each actually seeing things. Make it a regular habit, not a one-time fix. Notice how much drift a simple check-in prevents.`,
    },
    5: {
      title: `Compatibility Gap 5 — A Wide Distance That Wants Real Attention`,
      tagline: `A Gap That Doesn't Close Itself`,
      strength: `You feel the difference between your instincts often, and you've genuinely accepted that staying connected takes real, ongoing work, not a one-time understanding you can assume is permanent. That acceptance is itself the strength. You're not surprised by the effort this pairing requires, so you keep showing up for it. Most pairings this wide give up long before they ever accept that.`,
      friction: `Left alone, a gap this wide produces a relationship that looks functional on the surface while the two of you quietly grow further apart in how you actually experience things. Underneath the surface function is a fear that naming the real distance out loud would make it feel more serious than either of you wants it to be. The distance doesn't announce itself loudly — it just accumulates in the background. You end up living two adjacent lives that only look like one shared one.`,
      invitation: `Ask yourselves honestly what's grown further apart between you that neither has said out loud. Name, honestly, one recurring point of friction this month. Say it plainly instead of managing around it. Notice that naming it is less frightening than carrying it silently.`,
    },
    6: {
      title: `Compatibility Gap 6 — A Substantial Distance Between Two Natures`,
      tagline: `A Gap That Needs Real Architecture`,
      strength: `You experience a genuine split in how you each instinctively want to handle things, and rather than ignoring the pull, you bridge it with deliberate, ongoing work. This is one of the more demanding gaps to sustain. And the fact that you keep choosing to engage with it, rather than letting it run on autopilot, is what makes the relationship actually work. That deliberate choosing, repeated, is what most pairings this different never sustain.`,
      friction: `Without real attention, this runs on autopilot and unspoken compromise. You drift from genuine understanding into a kind of default accommodation, where neither of you is quite lying but neither is quite being fully honest either. Underneath the drift is often a fear that real honesty about the split would be more than the relationship could hold. The drift is gradual enough that it's hard to notice until the distance has become the norm.`,
      invitation: `Ask yourselves honestly where you've settled for accommodation instead of real understanding. Choose one action this month specifically because it honors the other person's different instinct, even when yours points elsewhere. Do it deliberately, not automatically. Notice what genuine honoring feels like compared to quiet compromise.`,
    },
    7: {
      title: `Compatibility Gap 7 — A Deep Distance Worth Taking Seriously`,
      tagline: `A Gap That Asks for Ongoing Practice`,
      strength: `You feel real tension between what comes naturally to each of you, and you meet it with deliberate, sustained practice rather than a single conversation you hope will settle it. That sustained commitment is exactly what a gap this size requires. Choosing to keep practicing it, rather than expecting it to resolve once, is the actual skill here. Few pairings this different stay committed to the practice as consistently as you do.`,
      friction: `Left unattended, this produces real disconnection — a relationship that continues while quietly running two different operating logics that take turns rather than merge. Underneath the parallel functioning is a fear that fully merging your instincts would mean one of you has to give up something essential. You may find yourselves cooperating without ever quite being aligned. The cooperation can look like closeness without actually being it.`,
      invitation: `Ask yourselves honestly what you're each afraid you'd lose if your instincts actually merged. Name, plainly, one place this month where your instincts are actively pulling apart. Say it directly instead of working around it. Notice that naming the pull doesn't force either of you to give anything up.`,
    },
    8: {
      title: `Compatibility Gap 8 — The Widest Possible Distance`,
      tagline: `A Gap Built Entirely on Purpose`,
      strength: `Your instincts rarely align without deliberate translation, and that's not a flaw — the understanding you do build is unusually strong precisely because it was never accidental. Nothing about this pairing runs on assumption. Everything has to be actively constructed, which means what you have together is genuinely earned rather than simply lucky. Few pairings do the deliberate work you two do simply to understand each other at all.`,
      friction: `Left completely unattended, this produces two parallel relationships — the one you're actually living, and a private, unspoken version each of you assumes the other understands. Underneath the parallel stories is a fear that admitting how different you actually are would be too destabilizing to say out loud. The widest gap shows up as two people quietly narrating different stories about the same relationship. Each convinced the other one already knows.`,
      invitation: `Ask yourselves honestly whether the story you're each privately telling about this relationship actually matches. Build one deliberate bridge this month between something that comes naturally to you and something that comes naturally to them. Construct it on purpose, not by accident. Notice that what you build this way tends to actually hold.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
