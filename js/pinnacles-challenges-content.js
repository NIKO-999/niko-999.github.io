'use strict';

/**
 * Destiny Matrix — Pinnacles & Challenges (classical numerology)
 * ─────────────────────────────────────────────────────────────
 * Birthdate-only, name-free classical numerology systems, distinct from
 * this app's own base-22 Arcana system and from Life Path. See
 * js/matrix-engine.js's `pinnacles()`/`challenges()`/`pinnacleAgeRanges()`
 * for the formulas, and research/11-Research-Updates for the build note.
 *
 * Pinnacles range over the same 12 classical values as Life Path
 * (1-9, 11, 22, 33 — master numbers preserved). Challenges always reduce
 * to a single digit 0-8 (master numbers are never preserved for Challenges,
 * per standard convention), so that content set only needs 9 entries.
 *
 * Both are written generically per NUMBER, not per stage-and-number — the
 * card itself supplies which of the four life stages is active and its age
 * range, computed live from the chart (see DestinyMatrix-v1.html's
 * openMicroCard() PINNACLES/CHALLENGES branch). The prose here describes
 * what that number's energy asks of you wherever in life it shows up.
 *
 * All content originally composed (not adapted from any source text),
 * matching the same "impact over bloat" direction established for the
 * Life Path rewrite — tight, no positive/negative-state framing.
 *
 * API:
 *   DPinnaclesContent.get(num)  -> { heading, why, shadow, path } or null
 *   DChallengesContent.get(num) -> { heading, why, shadow, path } or null
 */

window.DPinnaclesContent = (function () {

  const pinnacles = {
    1: {
      heading: `Pinnacle 1 — Stepping Into Your Own Lead`,
      why: `This particular era of your life is organized around one central lesson: learning to move first, without waiting for someone else's permission to make it official. New independence tends to open up during a stage like this — a project nobody handed you, a move nobody approved, a role you have to claim rather than get offered. Whatever chapter you're in when this Pinnacle is active, its real work is teaching you that leadership here isn't about being chosen. It's about deciding.`,
      traits: `Decisions tend to feel more urgent and more yours to make during a stage like this. You're less inclined to defer to consensus than usual. New beginnings carry unusual weight and momentum right now.`,
      shadow: `The trap of a stage like this is forcing independence before it's actually earned — picking fights with authority just to prove the point, mistaking rebellion for growth. The real work here is quieter than that: claiming genuine direction, not simply resisting whoever happens to be in charge.`,
      path: `Try making one decision this season without consulting anyone first. You are allowed to lead this chapter of your life. What have you been waiting for someone else to greenlight?`,
    },
    2: {
      heading: `Pinnacle 2 — Learning to Move With Others`,
      why: `This era of your life deliberately slows your pace and puts real partnership in front of you — a relationship, a team, a negotiation that only actually works if you let someone else genuinely in. Whatever chapter surrounds this Pinnacle, its lesson is cooperation that doesn't cost you your own voice: learning that two people moving together, at the speed trust actually requires, can accomplish something individual momentum never could.`,
      traits: `Sensitivity to other people's needs and timing runs higher during a stage like this. Patience becomes more available, sometimes to a fault. Relationships — of every kind — carry disproportionate significance right now.`,
      shadow: `The risk of a stage like this is mistaking accommodation for growth — agreeing so consistently that you eventually lose track of what you actually wanted from the partnership in the first place. Real cooperation still requires you to remain a full person inside it, not a mirror.`,
      path: `Try naming one preference out loud this season instead of deferring by default. You are allowed to partner with someone without disappearing into the partnership. Where has cooperation quietly become self-erasure?`,
    },
    3: {
      heading: `Pinnacle 3 — A Season for Being Seen`,
      why: `This era of your life hands you real creative and social opportunity — visibility, expression, a genuine chance to be enjoyed rather than merely useful. Whatever chapter you're in while this Pinnacle is active, its actual work is teaching you to take the stage instead of deflecting it, to let the thing you've made or the person you are be witnessed fully, without immediately undercutting it with a joke.`,
      traits: `Charm and expressiveness tend to feel more natural and more available during a stage like this. Social and creative opportunities multiply. Attention, when it arrives, feels less threatening than it usually might.`,
      shadow: `The risk of a stage like this is scattering the opportunity across too many directions at once, or hiding real talent behind constant lightness so it never actually gets taken seriously. A season built for visibility still needs something finished to actually show.`,
      path: `Try finishing one creative or social commitment this season all the way through. You are allowed to be taken seriously and still be genuinely fun. What have you been underselling during this particular stretch of your life?`,
    },
    4: {
      heading: `Pinnacle 4 — Laying Down Real Foundations`,
      why: `This era of your life rewards unglamorous, patient work — building something structural, whether that's career, finances, or a home, that won't show its full payoff for years but will hold real weight once it does. Whatever chapter surrounds this Pinnacle, its lesson is that some of the most consequential work in a life doesn't look exciting while it's happening. It just needs to actually get done.`,
      traits: `Discipline and a longer time horizon come more naturally during a stage like this. Practical concerns take up more of your attention than usual. You're more likely to feel steadied by structure than confined by it, at least at first.`,
      shadow: `The risk of a stage like this is confusing rigidity with stability, refusing any adjustment to the plan even once it's clearly stopped working. A foundation is meant to hold weight, not to be so fixed it can never be corrected.`,
      path: `Try reviewing one long-term plan this season and adjusting the part that's stopped serving you. You are allowed to build carefully and still change course. What structure from this stage of your life needs an honest update?`,
    },
    5: {
      heading: `Pinnacle 5 — A Season That Won't Sit Still`,
      why: `This era of your life brings real, sometimes unwelcome change — travel, a shift in direction, new people entering the picture whether you planned for them or not. Whatever chapter you're moving through while this Pinnacle is active, its lesson is meeting instability with curiosity instead of white-knuckling for a stillness this particular stage was never going to offer.`,
      traits: `Restlessness and appetite for novelty tend to run higher than usual during a stage like this. Routine feels harder to sustain, and less appealing even when it's available. Adaptability becomes less a skill and more a survival requirement.`,
      shadow: `The risk of a stage like this is chasing the change itself, jumping from one new thing to the next before any single one has had the chance to actually teach you something. Motion isn't the same as growth, even during a season built around motion.`,
      path: `Try letting one change fully settle this season before reaching for the next one. You are allowed to want stability and still be genuinely excited by what's shifting. What are you actually moving toward in this stage, not just away from?`,
    },
    6: {
      heading: `Pinnacle 6 — Responsibility to the People Close to You`,
      why: `This era of your life centers home, family, or a significant close relationship — real responsibility tends to arrive during a stage like this, and the actual growth is in showing up for it fully without quietly resenting the weight of it. Whatever chapter surrounds this Pinnacle, it asks you to care for the people closest to you as a genuine act of maturity, not an imposition on a life you'd rather be living elsewhere.`,
      traits: `Your instinct to nurture and protect the people around you intensifies during a stage like this. Domestic and family matters carry unusual weight. You're more likely to be counted on this season than at almost any other point.`,
      shadow: `The risk of a stage like this is over-functioning for everyone around you until your own needs quietly stop counting altogether. A season built around responsibility to others is not the same as a season built around erasing yourself.`,
      path: `Try asking for help with one responsibility this season instead of carrying all of it alone. You are allowed to be needed and still need things yourself during this stage. Who could actually share this load with you right now?`,
    },
    7: {
      heading: `Pinnacle 7 — A Season Turned Inward`,
      why: `This era of your life pulls you toward solitude and real reflection — a stretch built for study, depth, and quietly working something out before you're ready to explain it to anyone else. Whatever chapter you're living through while this Pinnacle is active, its lesson is that some understanding can only be reached alone, and that this particular season is asking you to actually let it happen rather than rushing back out to the surface too soon.`,
      traits: `Your appetite for solitude and depth increases noticeably during a stage like this. Small talk and surface-level connection feel less satisfying than usual. Intuition tends to sharpen considerably.`,
      shadow: `The risk of a stage like this is retreating so far inward that you miss the actual moment to rejoin the people waiting for you on the other side of it. Reflection that never resurfaces just becomes distance with a better excuse.`,
      path: `Try sharing one private conclusion this season before you've perfected how to explain it. You are allowed to think deeply during this stage and still stay reachable. What have you been sitting with alone for too long?`,
    },
    8: {
      heading: `Pinnacle 8 — A Season of Real Consequence`,
      why: `This era of your life brings genuine authority and material stakes — a promotion, a business, a level of responsibility that actually counts in the world, not just in your own head. Whatever chapter surrounds this Pinnacle, its lesson is handling real power without hardening around it, staying a full person even as the outward stakes of this stage of your life get significantly larger.`,
      traits: `Ambition and capacity for sustained effort run higher than usual during a stage like this. Opportunities tied to authority, money, or leadership tend to surface more frequently. You're more likely to be measured by results this season than you typically are.`,
      shadow: `The risk of a stage like this is measuring the whole season purely by output, and missing what it actually cost you emotionally to get there. Real consequence doesn't have to mean a life narrowed down to only what's countable.`,
      path: `Try checking in honestly on how you're feeling this season, not just on what you're accomplishing. You are allowed to be ambitious during this stage and still be soft underneath it. What has the scoreboard been quietly drowning out?`,
    },
    9: {
      heading: `Pinnacle 9 — Letting Something Go So Something Else Can Begin`,
      why: `This era of your life asks you to release something — a role, an identity, a whole chapter — that's already served its purpose, so a wider, less self-centered version of your life can genuinely take its place. Whatever stage surrounds this Pinnacle, its lesson is that some endings aren't failures. They're simply what has to happen before the next real thing can actually begin.`,
      traits: `A pull toward completion and release runs stronger during a stage like this. Old identities or commitments may start to feel like they no longer fit. Compassion and a broader perspective tend to deepen noticeably.`,
      shadow: `The risk of a stage like this is clinging to what it's actually trying to close, prolonging an ending that's already quietly begun. Resisting a closing chapter doesn't stop it from closing — it just makes the closing harder.`,
      path: `Try naming one thing this season that's already over, even if you haven't fully let it go yet. You are allowed to grieve an ending during this stage and still walk into what's next. What are you still holding that already left?`,
    },
    11: {
      heading: `Master Pinnacle 11 — An Intensified Calling`,
      why: `This era of your life carries real intuitive and creative charge — inspiration that genuinely wants an outlet, not just private daydreaming kept safely to yourself. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is trusting the download enough to actually act on it, letting a heightened sense of what's true or possible actually reach the world instead of staying sealed inside you.`,
      traits: `Intuitive and creative sensitivity run especially high during a stage like this. A sense of standing at a genuine threshold tends to color the whole period. Ideas and insight can arrive with unusual force.`,
      shadow: `The risk of a stage like this is staying purely inspired without ever grounding the vision into something real, leaving you wired and unfulfilled by the end of it. A calling this intense still needs an actual outlet, or the intensity just becomes exhausting.`,
      path: `Try turning one flash of inspiration this season into a single, concrete step. You are allowed to be intense during this stage and still be practical about it. What vision have you been carrying without building?`,
    },
    22: {
      heading: `Master Pinnacle 22 — Building at a Larger Scale`,
      why: `This era of your life hands you a rare combination — genuine vision paired with the actual capability to build something that outlasts you. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is finishing what you start rather than just imagining its full size, taking the scale of what's possible during this stage and actually constructing it, piece by real piece.`,
      traits: `Your capacity to combine large vision with practical execution runs unusually high during a stage like this. Projects that once felt too big may suddenly feel genuinely achievable. Your ambition and your stamina are both considerable, though not unlimited.`,
      shadow: `The risk of a stage like this is burning out under the weight of your own ambition, mistaking exhaustion for proof you're doing it right. A season built for building something lasting still requires you to survive building it.`,
      path: `Try pacing this season's biggest project against your actual energy, not just its potential scale. You are allowed to build big during this stage and still rest deliberately. Where has ambition been outrunning your body?`,
    },
    33: {
      heading: `Master Pinnacle 33 — A Season of Deep Service`,
      why: `This era of your life puts you in a position to genuinely help or heal at scale — teaching, caregiving, guiding others through something real and significant. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is doing that service sustainably, letting your own care for people be matched, at least sometimes, by care for yourself.`,
      traits: `Your instinct toward service and healing intensifies during a stage like this. People may seek you out for guidance more than usual. A sense of larger purpose tends to run underneath the ordinary events of this period.`,
      shadow: `The risk of a stage like this is giving so completely to this calling that your own life quietly empties out around it. A season built around deep service was never meant to be a season built around self-abandonment.`,
      path: `Try protecting one hour this season purely for yourself, with nothing given to anyone else. You are allowed to serve deeply during this stage and still be replenished. What has this calling been costing you that you haven't named yet?`,
    },
  };

  function get(num) {
    return pinnacles[num] || null;
  }

  return { get };

})();

window.DChallengesContent = (function () {

  const challenges = {
    0: {
      heading: `Challenge 0 — No Excuses Left`,
      why: `This is the rarest of all the challenges, and in some ways the strangest one to actually carry — it removes the built-in obstacle every other number gets handed automatically, and leaves you facing something harder to name: the requirement to choose your own path deliberately, on purpose, rather than reacting to whatever circumstance happens to hand you. There's no external friction to blame here, and no easy explanation for why something didn't happen. The lesson underneath this challenge is self-determination in its rawest form — you were given very little resistance, which turns out to be its own kind of difficulty.`,
      traits: `You may notice fewer obvious obstacles blocking your way than people around you seem to face. Decisions can feel oddly weightier without a clear external push behind them. Freedom, in this challenge, tends to feel more disorienting than liberating at first.`,
      shadow: `The risk of a challenge this open is drifting simply because nothing is actively forcing a decision — freedom without a chosen direction can quietly curdle into aimlessness, and you can spend long stretches of time technically free and genuinely unmoored.`,
      path: `Try picking one clear direction this season, on purpose, with no external push behind it. You are allowed to choose without being forced into it. What have you been leaving undecided simply because nothing was making you decide?`,
    },
    1: {
      heading: `Challenge 1 — Standing on Your Own Judgment`,
      why: `This particular challenge tests something quieter than most obstacles — whether you can genuinely trust your own decisions without leaning on someone else's approval first, especially in the exact moments when the people around you disagree with you. It isn't about confidence in the abstract; it's specifically about holding your ground when holding it costs you something socially. The lesson underneath this challenge is that your own judgment has to become load-bearing at some point, not just a backup opinion you defer to other people's certainty over.`,
      traits: `You may find yourself asking others for confirmation more than you'd like to admit. Disagreement from someone you respect can shake your resolve more than it should. There's likely a part of you that already knows the right call before you go looking for outside validation of it.`,
      shadow: `The risk of this challenge is swinging between two extremes — total self-doubt on one side, stubborn overcorrection on the other, refusing any input at all just to prove a point about independence. Neither extreme is actually the confidence this challenge is asking you to build.`,
      path: `Try making one call this season and holding it, even when someone genuinely pushes back on it. You are allowed to be confident without becoming closed off to input. Whose approval have you been quietly waiting for before you'd trust your own read?`,
    },
    2: {
      heading: `Challenge 2 — Speaking Before Resentment Builds`,
      why: `This particular challenge tests your ability to say what you actually feel in the moment, instead of absorbing the tension to keep the surface smooth, especially with the people you're closest to. It's rarely about big confrontations — it's about the small, honest sentence that goes unsaid because saying it would disturb something. The lesson underneath this challenge is that peace bought through silence isn't actually peace; it's simply postponed, and it tends to compound interest the longer it's left unpaid.`,
      traits: `You may notice yourself agreeing faster than you actually feel settled about something. Small hurts can linger longer in you than they show on the surface. Conflict-avoidance likely feels safer to you than the alternative, even when avoidance costs more in the long run.`,
      shadow: `The risk of this challenge is going quiet for so long that small, individually manageable hurts compound into something far bigger and harder to untangle than the original moment ever was. Resentment built this way rarely announces itself until it's already substantial.`,
      path: `Try naming one small hurt this week while it's still genuinely small. You are allowed to disturb the peace in order to tell the truth. What have you been quietly absorbing that was never actually that small to begin with?`,
    },
    3: {
      heading: `Challenge 3 — Saying the Real Thing`,
      why: `This particular challenge tests whether you can express what's actually true for you, not simply what's charming, easy, or well-received, especially when the honest version of a thought risks changing the mood of the room. It asks something specific of a naturally expressive nature: that expression stop being only entertainment, and start occasionally being real disclosure too. The lesson underneath this challenge is that being liked and being known aren't the same accomplishment, and only one of them actually requires courage.`,
      traits: `You may find humor becoming your default response even to things that genuinely matter to you. People likely enjoy your company without always knowing what you truly think. There's probably a gap between the version of your opinions you perform and the version you actually hold.`,
      shadow: `The risk of this challenge is performing so consistently and so well that even you lose track of what you actually think underneath the performance, until the charm becomes less a choice and more a wall you can't find your way back out from behind.`,
      path: `Try saying one genuinely unpolished thing this week instead of the version dressed up to land easier. You are allowed to be less charming and more true in the same sentence. What have you been dressing up specifically so it would be easier to hear?`,
    },
    4: {
      heading: `Challenge 4 — Working Without a Guaranteed Payoff`,
      why: `This particular challenge tests your patience with slow, unglamorous effort — genuinely showing up for the long, uneventful middle of something before any results are visible to prove the effort was worth it. It has nothing to do with capability and everything to do with endurance through the part of any real undertaking that offers no applause. The lesson underneath this challenge is that most things worth building take longer to show their value than your patience wants them to.`,
      traits: `You may feel a strong pull to quit right around the point where progress becomes invisible. Immediate feedback likely matters more to your motivation than you'd prefer it to. Long stretches without visible reward can feel disproportionately discouraging.`,
      shadow: `The risk of this challenge is abandoning genuinely solid work right before it would have actually paid off, mistaking the difficulty of the unglamorous middle for proof that you're on the wrong path entirely, when the difficulty was simply part of the route.`,
      path: `Try continuing one difficult task this week for exactly one more session before deciding whether to quit it. You are allowed to find it hard and still keep going anyway. What have you nearly given up on too early before, only to regret the timing later?`,
    },
    5: {
      heading: `Challenge 5 — Choosing Restraint on Purpose`,
      why: `This particular challenge tests whether you can commit to one thing fully, instead of scattering your attention across every available option, especially the instant something new and more exciting appears on the horizon. It isn't a challenge against curiosity itself, but against curiosity being allowed to override every commitment before that commitment has had the chance to actually mature. The lesson underneath this challenge is that restraint, chosen deliberately rather than imposed, is its own genuine form of freedom.`,
      traits: `You may notice a strong, near-automatic pull toward whatever's newest in the room. Finishing things likely feels less satisfying to you than starting them. Boredom probably arrives faster for you than it does for most people around you.`,
      shadow: `The risk of this challenge is confusing constant movement with actual freedom, and ending up with an impressive collection of beginnings and very few real completions to show for any of them.`,
      path: `Try declining one appealing new option this week in favor of what you've already committed to. You are allowed to say no to something exciting in order to say yes to something already underway. What have you kept restarting instead of actually finishing?`,
    },
    6: {
      heading: `Challenge 6 — Letting People Take Care of Themselves`,
      why: `This particular challenge tests your ability to care for people without quietly managing them, especially in the exact moments you're most convinced you already know what's genuinely best for them. It's rarely framed as controlling from the inside — it usually just feels like love with strong opinions attached. The lesson underneath this challenge is that real care includes trusting someone else's capacity to handle their own life, even when you could technically do it faster or better yourself.`,
      traits: `You may find yourself stepping in before anyone's actually asked you to. Watching someone struggle likely feels more uncomfortable to you than it should. Your help probably arrives with more instructions attached than most people are asking for.`,
      shadow: `The risk of this challenge is smothering the people you love under a standard of care they never actually requested, until your help starts to feel less like support and more like quiet supervision.`,
      path: `Try letting one person handle their own problem this week without stepping in to fix it for them. You are allowed to care deeply and still stay out of it. Where has your help stopped actually being requested?`,
    },
    7: {
      heading: `Challenge 7 — Trusting What You Can't Fully Explain`,
      why: `This particular challenge tests your willingness to trust an intuitive sense of something, even when you can't yet prove it or fully put it into words. It sits directly against a natural preference for certainty, asking you to act on a feeling before the evidence has fully caught up to justify it. The lesson underneath this challenge is that some genuine knowing arrives ahead of proof, and waiting indefinitely for the proof can cost you the very thing the instinct was trying to point you toward.`,
      traits: `You may find yourself needing more evidence than most people before you'll commit to a belief. Genuine hunches likely get talked out of existence before you act on them. Certainty probably feels safer to you than trusting an unproven instinct, even a strong one.`,
      shadow: `The risk of this challenge is over-analyzing a genuinely real instinct into total silence, waiting for a certainty that this particular kind of knowing was simply never going to offer you.`,
      path: `Try acting on one hunch this week before you've fully justified it to yourself or anyone else. You are allowed to trust something you can't yet fully explain. What do you already sense clearly that you've been demanding hard proof for anyway?`,
    },
    8: {
      heading: `Challenge 8 — Making Peace With Power`,
      why: `This particular challenge tests your relationship with authority, money, and responsibility directly — whether you can genuinely hold real power without either reaching compulsively for more of it or shrinking away from it entirely, refusing to claim what's actually yours to claim. It rarely sits at a comfortable middle; most people living this challenge default hard to one extreme or the other. The lesson underneath this challenge is that power itself isn't the danger — an unexamined relationship to it is.`,
      traits: `You may feel unusually charged, either excited or uneasy, around questions of money and authority. Responsibility likely lands on you more often than it does on people around you. Your comfort with claiming credit or visible success probably runs to an extreme in one direction or the other.`,
      shadow: `The risk of this challenge is over-identifying with achievement on one side, or avoiding responsibility altogether on the other so you never have to be measured against it — both are ways of never actually making peace with power itself.`,
      path: `Try taking on one piece of real responsibility this week without either over-claiming the credit for it or deflecting it entirely. You are allowed to hold power carefully, at a genuine middle. Where has your relationship to authority been pulled to an extreme?`,
    },
  };

  function get(num) {
    return challenges[num] || null;
  }

  return { get };

})();

/**
 * Karmic Debt Numbers (classical: 13, 14, 16, 19) — a bonus flag on the Life
 * Path card, not a standalone star. Distinct from `DKarmicDebtContent`
 * (js/karmic-debt-content.js), this app's own Arcana-based "Karmic Debt"
 * system (KARMA key) — that's a completely different system; this is the
 * classical numerology convention layered on top of Life Path specifically.
 * See js/matrix-engine.js's `karmicDebtFlags()`.
 *
 * API: DKarmicDebtNumberContent.get(num) -> { heading, text } or null
 */
window.DKarmicDebtNumberContent = (function () {

  const debts = {
    13: {
      heading: `A Classical Karmic Debt: 13`,
      text: `This number traditionally points to a pattern of avoided work finally catching up — effort put off, corners cut, or promises made and not kept somewhere along the way. It's not a punishment; it's a nudge toward consistency. You are allowed to build steadily instead of scrambling at the deadline.`,
    },
    14: {
      heading: `A Classical Karmic Debt: 14`,
      text: `This number traditionally points to a pattern around freedom and self-control — appetite or impulse that's run unchecked before, asking to be met with more discipline this time around. You are allowed to want freedom and still choose restraint on purpose.`,
    },
    16: {
      heading: `A Classical Karmic Debt: 16`,
      text: `This number traditionally points to a pattern of ego or pride getting knocked down before something truer could be rebuilt in its place — often through an unexpected fall from a position that felt secure. You are allowed to let go of a self-image that was never quite honest.`,
    },
    19: {
      heading: `A Classical Karmic Debt: 19`,
      text: `This number traditionally points to a pattern of leaning too hard on others instead of standing on your own judgment — needing to relearn genuine self-reliance without swinging into total isolation. You are allowed to ask for help and still be capable.`,
    },
  };

  function get(num) {
    return debts[num] || null;
  }

  return { get };

})();
