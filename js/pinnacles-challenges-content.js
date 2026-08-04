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
 * Golden Standard voice (Mastery/Shadow/Invitation) — see js/micro-
 * content.js's header comment for the canonical reference block.
 *
 * API:
 *   DPinnaclesContent.get(num)  -> { title, mastery, shadow, invitation } or null
 *   DChallengesContent.get(num) -> { title, mastery, shadow, invitation } or null
 */

window.DPinnaclesContent = (function () {

  const pinnacles = {
    1: {
      title: `Pinnacle 1 — Stepping Into Your Own Lead`,
      mastery: `This particular era of your life is organized around one central lesson: learning to move first, without waiting for someone else's permission to make it official. New independence tends to open up during a stage like this — a project nobody handed you, a move nobody approved, a role you have to claim rather than get offered. Decisions tend to feel more urgent and more yours to make, and you're less inclined to defer to consensus than usual. Whatever chapter you're in when this Pinnacle is active, its real work is teaching you that leadership here isn't about being chosen. It's about deciding.`,
      shadow: `The trap of a stage like this is forcing independence before it's actually earned — picking fights with authority just to prove the point, mistaking rebellion for growth. The real work here is quieter than that: claiming genuine direction, not simply resisting whoever happens to be in charge. New beginnings can carry so much weight and momentum during this stretch that they get chased for their own sake, whether or not they're actually going anywhere. Momentum this strong can be mistaken for a plan, when it may just be motion.`,
      invitation: `There's likely something you've been quietly waiting for permission to do. Make one decision this season without consulting anyone first, and let it stand as genuinely yours. You are allowed to lead this chapter of your life. What have you been waiting for someone else to greenlight?`,
    },
    2: {
      title: `Pinnacle 2 — Learning to Move With Others`,
      mastery: `This era of your life deliberately slows your pace and puts real partnership in front of you — a relationship, a team, a negotiation that only actually works if you let someone else genuinely in. Sensitivity to other people's needs and timing runs higher during a stage like this, and patience becomes more available, sometimes to a fault. Whatever chapter surrounds this Pinnacle, its lesson is cooperation that doesn't cost you your own voice: learning that two people moving together, at the speed trust actually requires, can accomplish something individual momentum never could. That capacity for real partnership is rare, and worth recognizing as a genuine skill, not just circumstance.`,
      shadow: `The risk of a stage like this is mistaking accommodation for growth — agreeing so consistently that you eventually lose track of what you actually wanted from the partnership in the first place. Real cooperation still requires you to remain a full person inside it, not a mirror. Relationships of every kind carry disproportionate significance right now, which can make it especially easy to let someone else's preference quietly override your own. The harmony can feel like success even in the moments it's actually costing you something real.`,
      invitation: `Somewhere in this stage, cooperation may have quietly slid into self-erasure. Name one preference out loud this season instead of deferring by default, and let it stand even if it complicates the harmony. You are allowed to partner with someone without disappearing into the partnership. Where has cooperation quietly become self-erasure?`,
    },
    3: {
      title: `Pinnacle 3 — A Season for Being Seen`,
      mastery: `This era of your life hands you real creative and social opportunity — visibility, expression, a genuine chance to be enjoyed rather than merely useful. Charm and expressiveness tend to feel more natural and more available during a stage like this, and social and creative opportunities multiply. Whatever chapter you're in while this Pinnacle is active, its actual work is teaching you to take the stage instead of deflecting it, to let the thing you've made or the person you are be witnessed fully, without immediately undercutting it with a joke. This is a genuinely rare season, and the ease it offers is worth using rather than only enjoying.`,
      shadow: `What can go wrong during a stage like this is scattering the opportunity across too many directions at once, or hiding real talent behind constant lightness so it never actually gets taken seriously. A season built for visibility still needs something finished to actually show. Attention, when it arrives, can feel less threatening than usual, which paradoxically makes it easier to let real opportunities go unfinished rather than risk a serious verdict on them. The lightness that makes this season so pleasant can also be exactly what keeps anything from being taken all the way to completion.`,
      invitation: `Something during this stretch has probably been undersold. Finish one creative or social commitment this season all the way through, rather than letting it stay a charming fragment. You are allowed to be taken seriously and still be genuinely fun. What have you been underselling during this particular stretch of your life?`,
    },
    4: {
      title: `Pinnacle 4 — Laying Down Real Foundations`,
      mastery: `This era of your life rewards unglamorous, patient work — building something structural, whether that's career, finances, or a home, that won't show its full payoff for years but will hold real weight once it does. Discipline and a longer time horizon come more naturally during a stage like this, and practical concerns take up more of your attention than usual. Whatever chapter surrounds this Pinnacle, its lesson is that some of the most consequential work in a life doesn't look exciting while it's happening. It just needs to actually get done.`,
      shadow: `The danger of a stage like this is confusing rigidity with stability, refusing any adjustment to the plan even once it's clearly stopped working. A foundation is meant to hold weight, not to be so fixed it can never be corrected. Feeling steadied by structure at first can slide into feeling confined by it later, without the shift ever being clearly marked. The very solidity that makes this stage feel safe can also make it quietly resistant to any correction it actually needs.`,
      invitation: `At least one structure from this stage probably needs an honest update. Review one long-term plan this season and adjust the part that's stopped serving you. You are allowed to build carefully and still change course. What structure from this stage of your life needs an honest update?`,
    },
    5: {
      title: `Pinnacle 5 — A Season That Won't Sit Still`,
      mastery: `This era of your life brings real, sometimes unwelcome change — travel, a shift in direction, new people entering the picture whether you planned for them or not. Restlessness and appetite for novelty tend to run higher than usual during a stage like this, and adaptability becomes less a skill and more a survival requirement. Whatever chapter you're moving through while this Pinnacle is active, its lesson is meeting instability with curiosity instead of white-knuckling for a stillness this particular stage was never going to offer. That adaptability, once trusted, tends to become one of the most durable strengths this stage leaves behind.`,
      shadow: `A stage like this can go sideways when chasing the change itself, jumping from one new thing to the next before any single one has had the chance to actually teach you something. Motion isn't the same as growth, even during a season built around motion. Routine feels harder to sustain and less appealing even when it's available, which can make even genuinely worthwhile stability feel like a step backward. The appetite for novelty can start setting the agenda even when nothing about the current situation actually calls for change.`,
      invitation: `It may be worth naming what you're actually moving toward in this stage, not just away from. Let one change fully settle this season before reaching for the next one. You are allowed to want stability and still be genuinely excited by what's shifting. What are you actually moving toward in this stage, not just away from?`,
    },
    6: {
      title: `Pinnacle 6 — Responsibility to the People Close to You`,
      mastery: `This era of your life centers home, family, or a significant close relationship — real responsibility tends to arrive during a stage like this, and the actual growth is in showing up for it fully without quietly resenting the weight of it. Your instinct to nurture and protect the people around you intensifies during a stage like this, and domestic and family matters carry unusual weight. Whatever chapter surrounds this Pinnacle, it asks you to care for the people closest to you as a genuine act of maturity, not an imposition on a life you'd rather be living elsewhere. That capacity to show up fully for the people closest to you is real, and it's worth recognizing on its own terms.`,
      shadow: `The risk of a stage like this is over-functioning for everyone around you until your own needs quietly stop counting altogether. A season built around responsibility to others is not the same as a season built around erasing yourself. Being counted on this season more than at almost any other point can make it especially hard to notice when you've stopped being counted on to care for yourself as well. The weight of being needed can quietly crowd out any space to name what you need in return.`,
      invitation: `There's likely someone who could actually share this load with you right now. Ask for help with one responsibility this season instead of carrying all of it alone. You are allowed to be needed and still need things yourself during this stage. Who could actually share this load with you right now?`,
    },
    7: {
      title: `Pinnacle 7 — A Season Turned Inward`,
      mastery: `This era of your life pulls you toward solitude and real reflection — a stretch built for study, depth, and quietly working something out before you're ready to explain it to anyone else. Your appetite for solitude and depth increases noticeably during a stage like this, and intuition tends to sharpen considerably. Whatever chapter you're living through while this Pinnacle is active, its lesson is that some understanding can only be reached alone, and that this particular season is asking you to actually let it happen rather than rushing back out to the surface too soon. That sharpened intuition is a genuine resource, worth trusting rather than second-guessing.`,
      shadow: `What can go wrong during a stage like this is retreating so far inward that you miss the actual moment to rejoin the people waiting for you on the other side of it. Reflection that never resurfaces just becomes distance with a better excuse. Small talk and surface-level connection feel less satisfying than usual, which can quietly extend the retreat well past the point it was actually serving you. The depth this stage offers can start to feel safer than any return to the surface, even once the reflection has actually finished its work.`,
      invitation: `Something has probably been sitting with you alone for too long. Share one private conclusion this season before you've perfected how to explain it. You are allowed to think deeply during this stage and still stay reachable. What have you been sitting with alone for too long?`,
    },
    8: {
      title: `Pinnacle 8 — A Season of Real Consequence`,
      mastery: `This era of your life brings genuine authority and material stakes — a promotion, a business, a level of responsibility that actually counts in the world, not just in your own head. Ambition and capacity for sustained effort run higher than usual during a stage like this, and opportunities tied to authority, money, or leadership tend to surface more frequently. Whatever chapter surrounds this Pinnacle, its lesson is handling real power without hardening around it, staying a full person even as the outward stakes of this stage of your life get significantly larger. That capacity for sustained effort under real stakes is genuinely rare, and worth naming as a strength rather than simply endured.`,
      shadow: `The danger of a stage like this is measuring the whole season purely by output, and missing what it actually cost you emotionally to get there. Real consequence doesn't have to mean a life narrowed down to only what's countable. Being measured by results more than usual this season can make it genuinely difficult to notice, in real time, what the scoreboard is quietly leaving out. The bigger the stakes get, the easier it becomes to justify ignoring what the pursuit is actually costing you.`,
      invitation: `The scoreboard has probably been quietly drowning something out. Check in honestly on how you're feeling this season, not just on what you're accomplishing. You are allowed to be ambitious during this stage and still be soft underneath it. What has the scoreboard been quietly drowning out?`,
    },
    9: {
      title: `Pinnacle 9 — Letting Something Go So Something Else Can Begin`,
      mastery: `This era of your life asks you to release something — a role, an identity, a whole chapter — that's already served its purpose, so a wider, less self-centered version of your life can genuinely take its place. A pull toward completion and release runs stronger during a stage like this, and compassion and a broader perspective tend to deepen noticeably. Whatever stage surrounds this Pinnacle, its lesson is that some endings aren't failures. They're simply what has to happen before the next real thing can actually begin. That widening perspective is a genuine gain, even when the ending it's asking for is a hard one.`,
      shadow: `A stage like this can go sideways when clinging to what it's actually trying to close, prolonging an ending that's already quietly begun. Resisting a closing chapter doesn't stop it from closing — it just makes the closing harder. Old identities or commitments may start to feel like they no longer fit, and holding on past that point can cost more than the ending itself ever would have. The discomfort of letting go can feel like evidence the chapter isn't actually finished, when it's often the opposite.`,
      invitation: `Something is probably still being held onto that already left. Name one thing this season that's already over, even if you haven't fully let it go yet. You are allowed to grieve an ending during this stage and still walk into what's next. What are you still holding that already left?`,
    },
    11: {
      title: `Master Pinnacle 11 — An Intensified Calling`,
      mastery: `This era of your life carries real intuitive and creative charge — inspiration that genuinely wants an outlet, not just private daydreaming kept safely to yourself. Intuitive and creative sensitivity run especially high during a stage like this, and ideas and insight can arrive with unusual force. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is trusting the download enough to actually act on it, letting a heightened sense of what's true or possible actually reach the world instead of staying sealed inside you. That intensity of insight is a genuine gift, rare enough to be worth building around deliberately.`,
      shadow: `The risk of a stage like this is staying purely inspired without ever grounding the vision into something real, leaving you wired and unfulfilled by the end of it. A calling this intense still needs an actual outlet, or the intensity just becomes exhausting. A sense of standing at a genuine threshold can color the whole period so strongly that the threshold itself starts to feel like the destination. The charge itself can feel like enough, right up until the season ends and nothing concrete is left to show for it.`,
      invitation: `There's probably a vision that's been carried without ever being built. Turn one flash of inspiration this season into a single, concrete step. You are allowed to be intense during this stage and still be practical about it. What vision have you been carrying without building?`,
    },
    22: {
      title: `Master Pinnacle 22 — Building at a Larger Scale`,
      mastery: `This era of your life hands you a rare combination — genuine vision paired with the actual capability to build something that outlasts you. Your capacity to combine large vision with practical execution runs unusually high during a stage like this, and projects that once felt too big may suddenly feel genuinely achievable. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is finishing what you start rather than just imagining its full size, taking the scale of what's possible during this stage and actually constructing it, piece by real piece. That combination of vision and execution is genuinely rare, and worth pacing carefully enough to actually complete.`,
      shadow: `What can go wrong during a stage like this is burning out under the weight of your own ambition, mistaking exhaustion for proof you're doing it right. A season built for building something lasting still requires you to survive building it. Your ambition and your stamina are both considerable, though not unlimited, and this stage rarely announces the moment they've quietly stopped matching each other. The scale of what feels achievable can quietly outpace what's actually sustainable, long before it feels that way.`,
      invitation: `Ambition has probably been outrunning your body somewhere in this season. Pace this season's biggest project against your actual energy, not just its potential scale. You are allowed to build big during this stage and still rest deliberately. Where has ambition been outrunning your body?`,
    },
    33: {
      title: `Master Pinnacle 33 — A Season of Deep Service`,
      mastery: `This era of your life puts you in a position to genuinely help or heal at scale — teaching, caregiving, guiding others through something real and significant. Your instinct toward service and healing intensifies during a stage like this, and a sense of larger purpose tends to run underneath the ordinary events of this period. Whatever chapter surrounds this master-numbered Pinnacle, its lesson is doing that service sustainably, letting your own care for people be matched, at least sometimes, by care for yourself. That capacity for genuine service at this scale is rare, and worth protecting rather than spending down entirely.`,
      shadow: `The danger of a stage like this is giving so completely to this calling that your own life quietly empties out around it. A season built around deep service was never meant to be a season built around self-abandonment. People may seek you out for guidance more than usual, and the sheer volume of need directed your way can make it easy to lose track of what you'd need in return. The scale of what you're able to give can make it easy to mistake constant giving for the only acceptable version of this calling.`,
      invitation: `This calling has probably been costing you something that hasn't been named yet. Protect one hour this season purely for yourself, with nothing given to anyone else. You are allowed to serve deeply during this stage and still be replenished. What has this calling been costing you that you haven't named yet?`,
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
      title: `Challenge 0 — No Excuses Left`,
      mastery: `This is the rarest of all the challenges, and in some ways the strangest one to actually carry — it removes the built-in obstacle every other number gets handed automatically, and leaves you facing something harder to name: the requirement to choose your own path deliberately, on purpose, rather than reacting to whatever circumstance happens to hand you. You may notice fewer obvious obstacles blocking your way than people around you seem to face. There's no external friction to blame here, and no easy explanation for why something didn't happen. The lesson underneath this challenge is self-determination in its rawest form — you were given very little resistance, which turns out to be its own kind of difficulty.`,
      shadow: `The risk of a challenge this open is drifting simply because nothing is actively forcing a decision — freedom without a chosen direction can quietly curdle into aimlessness, and you can spend long stretches of time technically free and genuinely unmoored. Decisions can feel oddly weightier without a clear external push behind them, which can make even simple choices feel unexpectedly paralyzing. Freedom, in this challenge, tends to feel more disorienting than liberating at first. The absence of resistance can be mistaken for the absence of stakes, when the stakes are simply harder to see.`,
      invitation: `Something has probably stayed undecided simply because nothing was making it urgent. Pick one clear direction this season, on purpose, with no external push behind it. You are allowed to choose without being forced into it. What have you been leaving undecided simply because nothing was making you decide?`,
    },
    1: {
      title: `Challenge 1 — Standing on Your Own Judgment`,
      mastery: `This particular challenge tests something quieter than most obstacles — whether you can genuinely trust your own decisions without leaning on someone else's approval first, especially in the exact moments when the people around you disagree with you. It isn't about confidence in the abstract; it's specifically about holding your ground when holding it costs you something socially. There's likely a part of you that already knows the right call before you go looking for outside validation of it. The lesson underneath this challenge is that your own judgment has to become load-bearing at some point, not just a backup opinion you defer to other people's certainty over.`,
      shadow: `The risk of this challenge is swinging between two extremes — total self-doubt on one side, stubborn overcorrection on the other, refusing any input at all just to prove a point about independence. Neither extreme is actually the confidence this challenge is asking you to build. You may find yourself asking others for confirmation more than you'd like to admit, and disagreement from someone you respect can shake your resolve more than it should. The overcorrection can look like confidence from the outside while functioning, underneath, as the exact same self-doubt in reverse.`,
      invitation: `There's probably a decision waiting on approval it doesn't actually need. Make one call this season and hold it, even when someone genuinely pushes back on it. You are allowed to be confident without becoming closed off to input. Whose approval have you been quietly waiting for before you'd trust your own read?`,
    },
    2: {
      title: `Challenge 2 — Speaking Before Resentment Builds`,
      mastery: `This particular challenge tests your ability to say what you actually feel in the moment, instead of absorbing the tension to keep the surface smooth, especially with the people you're closest to. It's rarely about big confrontations — it's about the small, honest sentence that goes unsaid because saying it would disturb something. The lesson underneath this challenge is that peace bought through silence isn't actually peace; it's simply postponed, and it tends to compound interest the longer it's left unpaid. Conflict-avoidance likely feels safer to you than the alternative, even when avoidance costs more in the long run.`,
      shadow: `What can go wrong with this challenge is going quiet for so long that small, individually manageable hurts compound into something far bigger and harder to untangle than the original moment ever was. Resentment built this way rarely announces itself until it's already substantial. You may notice yourself agreeing faster than you actually feel settled about something, while small hurts linger longer in you than they show on the surface. Each individual silence feels like the reasonable choice, which is exactly what lets them accumulate unnoticed.`,
      invitation: `Something quietly absorbed lately was probably never actually that small. Name one small hurt this week while it's still genuinely small. You are allowed to disturb the peace in order to tell the truth. What have you been quietly absorbing that was never actually that small to begin with?`,
    },
    3: {
      title: `Challenge 3 — Saying the Real Thing`,
      mastery: `This particular challenge tests whether you can express what's actually true for you, not simply what's charming, easy, or well-received, especially when the honest version of a thought risks changing the mood of the room. It asks something specific of a naturally expressive nature: that expression stop being only entertainment, and start occasionally being real disclosure too. There's probably a gap between the version of your opinions you perform and the version you actually hold. The lesson underneath this challenge is that being liked and being known aren't the same accomplishment, and only one of them actually requires courage.`,
      shadow: `The danger of this challenge is performing so consistently and so well that even you lose track of what you actually think underneath the performance, until the charm becomes less a choice and more a wall you can't find your way back out from behind. You may find humor becoming your default response even to things that genuinely matter to you, and people likely enjoy your company without always knowing what you truly think. The performance can get so polished that even you start to lose track of where it ends and the real opinion begins. Being well-liked can start to substitute for being actually known, without that trade ever being consciously made.`,
      invitation: `Something has probably been dressed up specifically so it would be easier to hear. Say one genuinely unpolished thing this week instead of the version dressed up to land easier. You are allowed to be less charming and more true in the same sentence. What have you been dressing up specifically so it would be easier to hear?`,
    },
    4: {
      title: `Challenge 4 — Working Without a Guaranteed Payoff`,
      mastery: `This particular challenge tests your patience with slow, unglamorous effort — genuinely showing up for the long, uneventful middle of something before any results are visible to prove the effort was worth it. It has nothing to do with capability and everything to do with endurance through the part of any real undertaking that offers no applause. The lesson underneath this challenge is that most things worth building take longer to show their value than your patience wants them to. Immediate feedback likely matters more to your motivation than you'd prefer it to.`,
      shadow: `This challenge can go sideways when abandoning genuinely solid work right before it would have actually paid off, mistaking the difficulty of the unglamorous middle for proof that you're on the wrong path entirely, when the difficulty was simply part of the route. You may feel a strong pull to quit right around the point where progress becomes invisible, and long stretches without visible reward can feel disproportionately discouraging. The absence of feedback can feel identical to the absence of progress, even when the two have nothing to do with each other. The timing of a quit rarely announces itself as a mistake until well after the fact.`,
      invitation: `Something was probably abandoned too early before, only to be regretted later. Continue one difficult task this week for exactly one more session before deciding whether to quit it. You are allowed to find it hard and still keep going anyway. What have you nearly given up on too early before, only to regret the timing later?`,
    },
    5: {
      title: `Challenge 5 — Choosing Restraint on Purpose`,
      mastery: `This particular challenge tests whether you can commit to one thing fully, instead of scattering your attention across every available option, especially the instant something new and more exciting appears on the horizon. It isn't a challenge against curiosity itself, but against curiosity being allowed to override every commitment before that commitment has had the chance to actually mature. The lesson underneath this challenge is that restraint, chosen deliberately rather than imposed, is its own genuine form of freedom. Boredom probably arrives faster for you than it does for most people around you.`,
      shadow: `The risk of this challenge is confusing constant movement with actual freedom, and ending up with an impressive collection of beginnings and very few real completions to show for any of them. You may notice a strong, near-automatic pull toward whatever's newest in the room, and finishing things likely feels less satisfying to you than starting them. Restlessness can dress itself up as ambition, when it's often just the same avoidance wearing a more interesting outfit. Each new beginning offers a fresh hit of excitement that a continuation, by definition, can no longer provide.`,
      invitation: `Something has probably been restarted repeatedly instead of actually finished. Decline one appealing new option this week in favor of what you've already committed to. You are allowed to say no to something exciting in order to say yes to something already underway. What have you kept restarting instead of actually finishing?`,
    },
    6: {
      title: `Challenge 6 — Letting People Take Care of Themselves`,
      mastery: `This particular challenge tests your ability to care for people without quietly managing them, especially in the exact moments you're most convinced you already know what's genuinely best for them. It's rarely framed as controlling from the inside — it usually just feels like love with strong opinions attached. The lesson underneath this challenge is that real care includes trusting someone else's capacity to handle their own life, even when you could technically do it faster or better yourself. Watching someone struggle likely feels more uncomfortable to you than it should.`,
      shadow: `What can go wrong with this challenge is smothering the people you love under a standard of care they never actually requested, until your help starts to feel less like support and more like quiet supervision. You may find yourself stepping in before anyone's actually asked you to, and your help probably arrives with more instructions attached than most people are asking for. The care itself is real, but its volume can end up crowding out the other person's own sense of capability. Good intentions rarely register to the other person as clearly as the supervision does.`,
      invitation: `Your help has probably stopped actually being requested somewhere along the way. Let one person handle their own problem this week without stepping in to fix it for them. You are allowed to care deeply and still stay out of it. Where has your help stopped actually being requested?`,
    },
    7: {
      title: `Challenge 7 — Trusting What You Can't Fully Explain`,
      mastery: `This particular challenge tests your willingness to trust an intuitive sense of something, even when you can't yet prove it or fully put it into words. It sits directly against a natural preference for certainty, asking you to act on a feeling before the evidence has fully caught up to justify it. The lesson underneath this challenge is that some genuine knowing arrives ahead of proof, and waiting indefinitely for the proof can cost you the very thing the instinct was trying to point you toward. You may find yourself needing more evidence than most people before you'll commit to a belief.`,
      shadow: `The danger of this challenge is over-analyzing a genuinely real instinct into total silence, waiting for a certainty that this particular kind of knowing was simply never going to offer you. Genuine hunches likely get talked out of existence before you act on them, and certainty probably feels safer to you than trusting an unproven instinct, even a strong one. The demand for proof can quietly function as a way of never having to act on what you already sense. The window for acting on a hunch tends to close well before the proof would ever have arrived.`,
      invitation: `Something is probably already sensed clearly, even without the proof being demanded of it. Act on one hunch this week before you've fully justified it to yourself or anyone else. You are allowed to trust something you can't yet fully explain. What do you already sense clearly that you've been demanding hard proof for anyway?`,
    },
    8: {
      title: `Challenge 8 — Making Peace With Power`,
      mastery: `This particular challenge tests your relationship with authority, money, and responsibility directly — whether you can genuinely hold real power without either reaching compulsively for more of it or shrinking away from it entirely, refusing to claim what's actually yours to claim. It rarely sits at a comfortable middle; most people living this challenge default hard to one extreme or the other. The lesson underneath this challenge is that power itself isn't the danger — an unexamined relationship to it is. Responsibility likely lands on you more often than it does on people around you.`,
      shadow: `This challenge can go sideways when over-identifying with achievement on one side, or avoiding responsibility altogether on the other so you never have to be measured against it — both are ways of never actually making peace with power itself. You may feel unusually charged, either excited or uneasy, around questions of money and authority, and your comfort with claiming credit or visible success probably runs to an extreme in one direction or the other. Whichever extreme you default to, it likely feels like the safe option, even though both are equally avoiding the actual middle. Neither over-claiming nor deflecting actually requires you to hold power steadily, which is the part this challenge is really asking for.`,
      invitation: `Your relationship to authority has probably been pulled toward one extreme or the other. Take on one piece of real responsibility this week without either over-claiming the credit for it or deflecting it entirely. You are allowed to hold power carefully, at a genuine middle. Where has your relationship to authority been pulled to an extreme?`,
    },
  };

  function get(num) {
    return challenges[num] || null;
  }

  return { get };

})();

/**
 * Karmic Debt Numbers (classical: 13, 14, 16, 19) — a bonus section on the
 * Life Path card, not a standalone star (most birthdates have none — see
 * js/matrix-engine.js's `karmicDebtFlags()`, and the "not a new star"
 * reasoning there). Distinct from `DKarmicDebtContent`
 * (js/karmic-debt-content.js), this app's own Arcana-based "Karmic Debt"
 * system (KARMA key) — a completely different system; this is the classical
 * numerology convention layered on top of Life Path specifically.
 *
 * Golden Standard voice (Mastery/Shadow/Invitation) — matching the rest of
 * the Numerology section.
 *
 * API: DKarmicDebtNumberContent.get(num) -> { title, mastery, shadow, invitation } or null
 */
window.DKarmicDebtNumberContent = (function () {

  const debts = {
    13: {
      title: `Karmic Debt 13 — The Debt of Avoided Work`,
      mastery: `Classical numerology reads this number as a pattern carried forward rather than started fresh — a history, somewhere back, of shortcuts taken, effort dodged, or promises made without the follow-through to back them up. This life tends to keep circling back to situations that demand the opposite: real, sustained, occasionally tedious effort, applied consistently rather than in scrambled last-minute bursts. Consistency, more than talent, tends to be the actual lesson this number keeps circling back to. You may notice a pattern of big pushes followed by real burnout, rather than a steady middle pace, which is itself useful information about where the old habit still lives.`,
      shadow: `Left unaddressed, the old pattern reasserts itself — corners cut under pressure, effort withheld until the deadline forces it, and a nagging sense that something is always catching up with you no matter how far ahead you think you've gotten. Deadlines and half-finished projects likely carry more weight for you than they do for most people, and that weight can quietly shape decisions long before any actual deadline is close. The scramble can start to feel like the only mode that actually produces results, even as it quietly costs more than steady effort would have. Each deadline met at the last minute quietly reinforces the belief that this is simply how work has to get done.`,
      invitation: `Avoided effort has probably been quietly compounding into something bigger than it needed to be. Finish one piece of unglamorous work this week before it becomes urgent. You are allowed to build steadily instead of scrambling at the deadline. Where has avoided effort been quietly compounding into something bigger than it needed to be?`,
    },
    14: {
      title: `Karmic Debt 14 — The Debt of Unchecked Appetite`,
      mastery: `Classical numerology reads this number as a pattern around freedom and restraint — a history, somewhere back, of appetite or impulse running further than it should have, without the discipline to hold it in check. This life tends to bring real temptation and real instability back into view, specifically so the lesson of moderation can finally be learned on purpose rather than avoided. Freedom likely matters to you intensely, sometimes more than stability does. Self-control, when you actually choose it, tends to feel less like restriction and more like relief than you'd expect.`,
      shadow: `Left unaddressed, the old pattern reasserts itself — impulse overriding judgment, freedom curdling into instability, and a life that keeps rearranging itself around you instead of moving in a direction you actually chose. Sudden shifts — in plans, relationships, habits, or location — may show up more often in your life than they do for most people, each one feeling individually reasonable even as the pattern accumulates. The appetite for freedom can end up producing exactly the instability it was trying to avoid. Each impulsive choice feels liberating in the moment, which is exactly what makes the pattern so hard to interrupt.`,
      invitation: `Unchecked appetite has probably been quietly running your life somewhere instead of you. Choose one form of restraint this week deliberately, not because you have to but because you're picking it. You are allowed to want freedom and still choose discipline on purpose. Where has unchecked appetite been quietly running your life instead of you?`,
    },
    16: {
      title: `Karmic Debt 16 — The Debt of the Fallen Tower`,
      mastery: `Classical numerology reads this number as a pattern around pride and position — a history, somewhere back, of ego or status built on a foundation that wasn't entirely honest. This life tends to include at least one sudden, humbling fall from something that felt secure — a reputation, a relationship, a sense of self — specifically so something truer can be rebuilt in its place. The rebuilding, when it happens, tends to be sturdier than what came before it. You may have already experienced at least one unexpected collapse of something you thought was stable that, in hindsight, cleared space for something more honest.`,
      shadow: `Left unaddressed, the old pattern reasserts itself — clinging to a self-image that was never quite true, and being caught off guard, again, when reality eventually insists on correcting it. Pride likely runs deeper in you than you'd readily admit, and it can keep quietly propping up the very self-image that's most due for an honest look. The correction, when it comes, tends to feel sudden only because the underlying instability was never actually addressed. Pride tends to defend the exact self-image most in need of an honest second look.`,
      invitation: `Rebuilding on more honest footing probably looks like something specific already. Let go of one piece of self-image this week that you suspect isn't entirely honest. You are allowed to release a version of yourself that was built on shaky ground. What would rebuilding on more honest footing actually look like?`,
    },
    19: {
      title: `Karmic Debt 19 — The Debt of the Isolated King`,
      mastery: `Classical numerology reads this number as a pattern around power and isolation — a history, somewhere back, of standing entirely on your own, sometimes by choice and sometimes by an unwillingness to lean on anyone else. This life tends to keep testing genuine self-reliance while also, quietly, asking you to relearn how to accept real help without treating it as weakness. You may take real pride in handling things entirely on your own, and that self-sufficiency is real, even as it's the exact thing this pattern is asking you to soften. That capability is a genuine strength, and it doesn't have to be surrendered for connection to also become possible.`,
      shadow: `Left unaddressed, the old pattern reasserts itself — self-reliance tipping into total isolation, and a life that looks capable from the outside while quietly running low on the support it actually needs. Asking for help likely costs you more than it costs most people, even when you clearly need it, and isolation can creep in disguised as independence, more easily for you than for most. The competence that lets you handle everything alone can also be exactly what keeps anyone from noticing you need help at all. Independence this reliable rarely leaves an obvious opening for anyone else to actually offer support.`,
      invitation: `Independence has probably been quietly costing you connection somewhere. Ask one person for real help this week with something you'd normally handle alone. You are allowed to be capable and still need people. Where has independence been quietly costing you connection?`,
    },
  };

  function get(num) {
    return debts[num] || null;
  }

  return { get };

})();
