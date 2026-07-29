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
      why: `This stage asks you to stop waiting for someone else to go first. New independence opens up — a project, a move, a role — and the growth here comes specifically from claiming it as yours rather than asking permission.`,
      shadow: `The trap is forcing independence before you're ready for it, picking fights with authority just to prove you can. Real growth here is quieter than that.`,
      path: `Try making one decision this season without consulting anyone first. You are allowed to lead this chapter. What have you been waiting for someone else to greenlight?`,
    },
    2: {
      heading: `Pinnacle 2 — Learning to Move With Others`,
      why: `This stage slows you down on purpose, putting real partnership and cooperation in front of you — a relationship, a team, a negotiation that only works if you actually let someone else in.`,
      shadow: `The risk is mistaking accommodation for growth, agreeing so much that you lose track of what you actually wanted from the partnership in the first place.`,
      path: `Try naming one preference out loud this season instead of deferring by default. You are allowed to partner without disappearing. Where has cooperation quietly become self-erasure?`,
    },
    3: {
      heading: `Pinnacle 3 — A Season for Being Seen`,
      why: `This stage hands you real creative and social opportunity — visibility, expression, a chance to be genuinely enjoyed rather than just useful. The growth is in actually taking the stage instead of deflecting it.`,
      shadow: `The risk is scattering the opportunity across too many directions at once, or hiding real talent behind constant jokes so it never gets taken seriously.`,
      path: `Try finishing one creative or social commitment this season all the way through. You are allowed to be taken seriously and still be fun. What have you been underselling?`,
    },
    4: {
      heading: `Pinnacle 4 — Laying Down Real Foundations`,
      why: `This stage rewards unglamorous, patient work — building something structural (career, finances, a home) that won't show its payoff for years, but will actually hold weight once it does.`,
      shadow: `The risk is confusing rigidity with stability, refusing any change even when the plan clearly needs adjusting.`,
      path: `Try reviewing one long-term plan this season and adjusting the part that's stopped working. You are allowed to build carefully and still change course. What structure needs an honest update?`,
    },
    5: {
      heading: `Pinnacle 5 — A Season That Won't Sit Still`,
      why: `This stage brings real change, sometimes more than you asked for — travel, a shift in direction, new people. The growth is in meeting it with curiosity instead of white-knuckling for stability.`,
      shadow: `The risk is chasing the change itself, jumping from one new thing to the next before any of it actually teaches you something.`,
      path: `Try letting one change fully settle before reaching for the next one. You are allowed to want stability and still be excited. What are you moving toward, not just away from?`,
    },
    6: {
      heading: `Pinnacle 6 — Responsibility to the People Close to You`,
      why: `This stage centers home, family, or a close relationship — real responsibility arrives, and the growth is in showing up for it without resenting the weight of it.`,
      shadow: `The risk is over-functioning for everyone around you until your own needs quietly stop counting.`,
      path: `Try asking for help with one responsibility this season instead of carrying all of it alone. You are allowed to be needed and still need things yourself. Who could actually share this load?`,
    },
    7: {
      heading: `Pinnacle 7 — A Season Turned Inward`,
      why: `This stage pulls you toward solitude and real reflection — a period built for study, depth, and figuring something out privately before you're ready to explain it to anyone else.`,
      shadow: `The risk is retreating so far inward that you miss the moment to actually rejoin the people waiting for you.`,
      path: `Try sharing one private conclusion this season before you've perfected how to explain it. You are allowed to think deeply and still stay reachable. What have you been sitting with alone too long?`,
    },
    8: {
      heading: `Pinnacle 8 — A Season of Real Consequence`,
      why: `This stage brings genuine authority and material stakes — a promotion, a business, a level of responsibility that actually counts. The growth is in handling power without hardening around it.`,
      shadow: `The risk is measuring the whole season purely by results, and missing what it cost you emotionally to get them.`,
      path: `Try checking in on how you're actually feeling this season, not just what you're accomplishing. You are allowed to be ambitious and still be soft. What has the scoreboard been drowning out?`,
    },
    9: {
      heading: `Pinnacle 9 — Letting Something Go So Something Else Can Begin`,
      why: `This stage asks you to release something — a role, an identity, a chapter — that's served its purpose, so a wider, less self-centered version of your life can actually take its place.`,
      shadow: `The risk is clinging to what this stage is trying to close, prolonging an ending that's already begun.`,
      path: `Try naming one thing this season that's already over, even if you haven't let it go yet. You are allowed to grieve an ending and still walk into what's next. What are you still holding that already left?`,
    },
    11: {
      heading: `Master Pinnacle 11 — An Intensified Calling`,
      why: `This stage carries real intuitive and creative charge — inspiration that wants a genuine outlet, not just private daydreaming. The growth is in trusting the download enough to actually act on it.`,
      shadow: `The risk is staying purely inspired without ever grounding the vision into something real, leaving you wired and unfulfilled.`,
      path: `Try turning one flash of inspiration this season into a single concrete step. You are allowed to be intense and still be practical. What vision have you been carrying without building?`,
    },
    22: {
      heading: `Master Pinnacle 22 — Building at a Larger Scale`,
      why: `This stage hands you the rare combination of vision and capability to build something that genuinely outlasts you — the growth is in actually finishing it, not just imagining its size.`,
      shadow: `The risk is burning out under the weight of your own ambition, mistaking exhaustion for proof you're doing it right.`,
      path: `Try pacing this season's biggest project against your actual energy, not just its potential scale. You are allowed to build big and still rest. Where has ambition been outrunning your body?`,
    },
    33: {
      heading: `Master Pinnacle 33 — A Season of Deep Service`,
      why: `This stage puts you in a position to genuinely help or heal at scale — teaching, caregiving, guiding others through something real. The growth is in doing it sustainably.`,
      shadow: `The risk is giving so completely to this calling that your own life quietly empties out around it.`,
      path: `Try protecting one hour this season purely for yourself, with nothing given to anyone else. You are allowed to serve and still be replenished. What has this calling been costing you?`,
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
      why: `The rarest challenge — it removes the built-in obstacle other numbers get, and asks you to choose your own path deliberately rather than reacting to circumstance. The lesson is self-determination itself.`,
      shadow: `The risk is drifting simply because nothing is forcing a decision — freedom without direction can quietly become aimlessness.`,
      path: `Try picking one clear direction this season, on purpose, with no external push behind it. You are allowed to choose without being forced. What have you been leaving undecided simply because you could?`,
    },
    1: {
      heading: `Challenge 1 — Standing on Your Own Judgment`,
      why: `This challenge tests whether you can trust your own decisions without leaning on someone else's approval first, especially when the people around you disagree.`,
      shadow: `The risk is swinging between total self-doubt and stubborn overcorrection, refusing input just to prove independence.`,
      path: `Try making one call this season and holding it, even when someone pushes back. You are allowed to be confident without being closed off. Whose approval have you been quietly waiting for?`,
    },
    2: {
      heading: `Challenge 2 — Speaking Before Resentment Builds`,
      why: `This challenge tests your ability to say what you actually feel instead of absorbing tension to keep things smooth, especially with people close to you.`,
      shadow: `The risk is going quiet for so long that small hurts compound into something much bigger than the original moment.`,
      path: `Try naming one small hurt this week while it's still small. You are allowed to disturb the peace to tell the truth. What have you been quietly absorbing?`,
    },
    3: {
      heading: `Challenge 3 — Saying the Real Thing`,
      why: `This challenge tests whether you can express what's actually true for you, not just what's charming or easy to say, especially when the honest version risks the room's mood.`,
      shadow: `The risk is performing so consistently that even you lose track of what you actually think underneath it.`,
      path: `Try saying one genuinely unpolished thing this week instead of the polished version. You are allowed to be less charming and more true. What have you been dressing up to make it land easier?`,
    },
    4: {
      heading: `Challenge 4 — Working Without a Guaranteed Payoff`,
      why: `This challenge tests your patience with slow, unglamorous effort — showing up for the long, boring middle of something before any results are visible.`,
      shadow: `The risk is abandoning solid work right before it would have paid off, mistaking difficulty for the wrong direction.`,
      path: `Try continuing one difficult task this week for exactly one more session before deciding whether to quit it. You are allowed to find it hard and keep going. What have you almost given up on too early before?`,
    },
    5: {
      heading: `Challenge 5 — Choosing Restraint on Purpose`,
      why: `This challenge tests whether you can commit to one thing fully instead of scattering across every option available, especially when something new looks more exciting.`,
      shadow: `The risk is confusing constant movement with actual freedom, ending up with a lot of starts and very few finishes.`,
      path: `Try declining one appealing new option this week in favor of what you already committed to. You are allowed to say no to something exciting. What have you kept restarting instead of finishing?`,
    },
    6: {
      heading: `Challenge 6 — Letting People Take Care of Themselves`,
      why: `This challenge tests your ability to care for people without managing them, especially when you're convinced you know what's best for them.`,
      shadow: `The risk is smothering the people you love with a standard of care they never actually asked for.`,
      path: `Try letting one person handle their own problem this week without stepping in. You are allowed to care and still stay out of it. Where has your help stopped being requested?`,
    },
    7: {
      heading: `Challenge 7 — Trusting What You Can't Fully Explain`,
      why: `This challenge tests your willingness to trust an intuitive sense of something even when you can't yet prove or fully articulate it.`,
      shadow: `The risk is over-analyzing a real instinct into silence, waiting for certainty that was never going to arrive.`,
      path: `Try acting on one hunch this week before you've fully justified it. You are allowed to trust something you can't yet explain. What do you already sense that you've been demanding proof for?`,
    },
    8: {
      heading: `Challenge 8 — Making Peace With Power`,
      why: `This challenge tests your relationship with authority, money, and responsibility — whether you can hold real power without either grabbing for more or shrinking away from it entirely.`,
      shadow: `The risk is over-identifying with achievement, or avoiding responsibility altogether so you never have to be measured by it.`,
      path: `Try taking on one piece of real responsibility this week without either over-claiming credit or deflecting it. You are allowed to hold power carefully. Where has your relationship to authority gone to an extreme?`,
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
