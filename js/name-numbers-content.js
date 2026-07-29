'use strict';

/**
 * Destiny Matrix — Name-Based Numerology (Expression, Soul Urge,
 * Personality, Maturity)
 * ─────────────────────────────────────────────────────────────
 * Classical numerology numbers that require a full NAME, not just a
 * birthdate — the only content set in this app that does. See
 * js/matrix-engine.js's expressionNumber()/soulUrgeNumber()/
 * personalityNumber()/maturityNumber() for the Pythagorean-grid formulas,
 * and DestinyMatrix-v1.html's optional name input (inside #numerology-index)
 * for how a name gets collected — never required, never persisted.
 *
 * Each of the four systems gets its own consistent lens across all 12
 * classical values (1-9, 11, 22, 33), so the same underlying number reads
 * differently depending on which question is being asked:
 *   Expression   — HOW you act; your natural mode of doing things.
 *   Soul Urge    — WHAT you actually want, underneath the doing.
 *   Personality  — HOW you land on first impression, before anyone knows you.
 *   Maturity     — WHO you grow into, once Life Path and Expression converge.
 *
 * All content originally composed, deep and personalized (matching the
 * Life Path/Pinnacles rewrites' density), rendered under this app's
 * Numerology-specific subheading scheme (THE CORE VIBRATION / HOW IT LIVES
 * IN YOU / THE SHADOW SIDE / THE OPENING — see DestinyMatrix-v1.html's
 * openMicroCard() NAME_KEYS branch) — no positive/negative-state framing.
 *
 * API (all identical shape):
 *   DExpressionContent.get(num)  -> { heading, why, traits, shadow, path } or null
 *   DSoulUrgeContent.get(num)    -> { heading, why, traits, shadow, path } or null
 *   DPersonalityContent.get(num) -> { heading, why, traits, shadow, path } or null
 *   DMaturityContent.get(num)    -> { heading, why, traits, shadow, path } or null
 */

window.DExpressionContent = (function () {
  const data = {
    1: {
      heading: `Expression 1 — You Act By Going First`,
      why: `Expression is the number that answers a different question than Life Path does — not what your life is fundamentally about, but how you actually go about doing anything at all, the mode your action defaults to when nobody's telling you how to proceed. For you, that mode is initiation. You move things forward by stepping into the gap nobody else will fill, starting where other people are still waiting for permission or consensus. It shows up in small daily choices as much as big ones — you're the one who books the appointment, sends the first message, makes the call everyone else was quietly avoiding.`,
      traits: `You default to action once a direction feels clear, rarely lingering in extended deliberation. Other people's hesitation tends to read to you as an invitation to move. You'd rather be the one who tried and adjusted than the one who waited for a guarantee.`,
      shadow: `Unchecked, this mode of acting looks like doing everything yourself, because delegating feels slower and riskier than simply handling it. You can become someone who's technically capable of leading a team but functionally incapable of trusting one, quietly exhausted by carrying what you never actually had to carry alone.`,
      path: `Try handing one task to someone else today instead of doing it yourself. You are allowed to go first without also doing it entirely alone. Where has your instinct to initiate quietly turned into an inability to delegate?`,
    },
    2: {
      heading: `Expression 2 — You Act By Bringing People Together`,
      why: `Where Expression 1 moves by starting things alone, yours moves by alignment — you act most naturally in coordination with other people, rarely charging ahead without checking that the group is actually still with you. This isn't hesitation; it's method. Your instinct is that most things worth building are built better together, and so your natural mode of doing anything, whether it's a project, a relationship, or a decision, runs through some form of genuine cooperation rather than solo momentum.`,
      traits: `You notice group dynamics and unspoken tension quickly, often before anyone names it. Consensus tends to matter more to you than speed. You're more comfortable as the connector in a room than as its most visible voice.`,
      shadow: `Unchecked, this collaborative mode of acting looks like over-mediating everything, softening your own position repeatedly until it's no longer distinguishable from anyone else's. You can become so good at aligning people that your own actual stance quietly disappears from the process altogether.`,
      path: `Try stating your own position clearly today before smoothing it for the group's comfort. You are allowed to unite people and still remain distinctly one of them. Where has bringing people together started costing you your own voice?`,
    },
    3: {
      heading: `Expression 3 — You Act Through Words and Presence`,
      why: `Your natural mode of getting anything done runs through expression itself — speaking, writing, performing, simply being present in a way that turns an idea into something other people can actually feel and respond to. Where some numbers move through quiet structure, you move through visible aliveness; a plan doesn't feel real to you until it's been said out loud, shared, given some kind of voice. This is genuinely how you act, not a performance layered on top of the acting.`,
      traits: `You process thoughts more clearly by speaking or writing them than by holding them privately. Rooms tend to notice when you enter them. Enthusiasm is one of your most reliable tools for actually getting things moving.`,
      shadow: `Unchecked, this expressive mode of acting looks like talking a plan into existence and never quite building the thing underneath the talk — momentum that lives entirely in the telling, with the actual follow-through perpetually delayed by the next exciting conversation.`,
      path: `Try finishing one thing today that you already talked about starting, with no new audience involved. You are allowed to speak brilliantly and still be the one who follows through. What have you described so many times it's started to feel finished when it isn't?`,
    },
    4: {
      heading: `Expression 4 — You Act By Building the Structure`,
      why: `Your natural mode of acting is construction — taking a loose, unformed idea and giving it real shape, one deliberate, verifiable piece at a time. Where other Expression numbers move by inspiration or alignment, yours moves by architecture: you don't fully trust a plan until you can see its actual bones, and you're the one other people quietly rely on to make sure the exciting idea doesn't collapse the moment it meets reality.`,
      traits: `You default to practical, sequential thinking over abstract possibility. Reliability is something you take real pride in, sometimes more than recognition. You're genuinely comfortable with the unglamorous, repetitive work most people try to avoid.`,
      shadow: `Unchecked, this structural mode of acting looks like refusing to move until every detail is locked down, even well past the point that certainty is actually available or useful. You can stall a genuinely good plan simply because it hasn't yet met your own standard of fully proven.`,
      path: `Try starting one structure today before it's fully planned out. You are allowed to build carefully and still begin imperfectly. Where has your need for certainty been the actual obstacle, not the plan itself?`,
    },
    5: {
      heading: `Expression 5 — You Act By Moving and Adapting`,
      why: `Your natural mode of getting things done runs through motion itself — trying something, watching what happens, adjusting fast the moment it isn't working, rather than committing to one fixed approach and defending it regardless of feedback. This isn't inconsistency; it's a genuinely different theory of how progress actually happens, built on responsiveness rather than rigid planning. You act by staying loose enough to change course the instant reality tells you something the original plan didn't account for.`,
      traits: `You pick up new approaches and skills quickly when the old one stops serving. Boredom with a stagnant method arrives for you faster than it does for most people. Flexibility feels like competence to you, not compromise.`,
      shadow: `Unchecked, this adaptive mode of acting looks like changing direction so often that nothing gets the sustained time it actually needs to prove itself one way or the other — a whole project life spent perpetually mid-pivot, never quite finished.`,
      path: `Try staying with today's plan even when a better-looking option appears mid-stream. You are allowed to adapt and still finish what you started first. Where has changing course become a habit rather than a genuine response to new information?`,
    },
    6: {
      heading: `Expression 6 — You Act By Taking Care of Things`,
      why: `Your natural mode of doing anything runs through responsibility — you move things forward by making sure the people and details around a situation are genuinely looked after, not just by pursuing the goal in isolation. Where some numbers act for the sake of the outcome alone, you act because something or someone under your care actually needs tending, and that need is often what mobilizes you faster than personal ambition ever could.`,
      traits: `You notice what needs fixing or supporting before it's been named as a problem. Being useful to people you care about matters to you in a way that's hard to fully switch off. You take real satisfaction in things simply running smoothly under your attention.`,
      shadow: `Unchecked, this caretaking mode of acting looks like taking on responsibility nobody actually assigned you, quietly expanding your own workload by managing things that were never yours to manage in the first place.`,
      path: `Try letting one thing today go uncared-for that genuinely isn't yours to manage. You are allowed to care selectively rather than completely. What have you been tending purely out of habit rather than actual necessity?`,
    },
    7: {
      heading: `Expression 7 — You Act By Understanding First`,
      why: `Your natural mode of doing anything runs through comprehension — you move things forward by figuring them out fully before you commit to a direction, treating depth and precision as the actual method rather than a delay before the real action starts. Where other Expression numbers act through speed or presence, yours acts through the quiet confidence of having genuinely understood the terrain before stepping onto it.`,
      traits: `You ask the follow-up question most people skip past. Being right matters more to you than being first. Solitude tends to sharpen your thinking in a way that group brainstorming rarely does.`,
      shadow: `Unchecked, this understanding-first mode of acting looks like researching a decision long after you already had more than enough information to act on it — analysis that's quietly become its own form of avoidance, dressed up as diligence.`,
      path: `Try acting today on the understanding you already genuinely have. You are allowed to know enough without needing to know everything. What decision have you been postponing under the guise of needing more research?`,
    },
    8: {
      heading: `Expression 8 — You Act By Executing at Scale`,
      why: `Your natural mode of doing anything runs through material results — you move things forward by actually building the outcome, not by refining the idea of it indefinitely. Where some Expression numbers act through connection or reflection, yours acts through visible accomplishment: a plan isn't real to you until it's produced something you can point to, measure, or hand someone.`,
      traits: `You default to execution once a decision has been made, with little patience for extended theorizing. Tangible progress genuinely energizes you in a way abstract discussion doesn't. People trust you with things that actually need to get done, and you generally deliver.`,
      shadow: `Unchecked, this results-driven mode of acting looks like measuring every action purely by its output, including your own worth on any given day — a day that produced nothing measurable can start to feel, unfairly, like a day that failed.`,
      path: `Try doing one thing today for a reason that has nothing to do with the result it produces. You are allowed to act without a scoreboard running underneath it. What have you stopped valuing simply because it doesn't show up as an outcome?`,
    },
    9: {
      heading: `Expression 9 — You Act On Behalf of Something Larger`,
      why: `Your natural mode of doing anything runs through service beyond your own immediate interest — you move things forward on behalf of people, causes, or ideals larger than your own personal stake in the outcome. Where some Expression numbers act primarily for themselves, yours seems to need a wider "why" attached before the action fully mobilizes; self-interest alone rarely generates the same energy in you that genuine purpose does.`,
      traits: `You're drawn to causes and communities beyond your own immediate circle. Personal ambition alone tends to motivate you less than a shared or larger purpose does. Generosity with your time and effort comes to you more easily than it does to most people.`,
      shadow: `Unchecked, this outward-facing mode of acting looks like acting on everyone else's behalf and rarely on your own — a pattern of showing up fully for causes and people while your own needs quietly wait indefinitely for their turn.`,
      path: `Try taking one action today purely for your own benefit, with no larger cause attached to justify it. You are allowed to act in your own interest too. Where has "for something bigger" become an excuse to never act for yourself?`,
    },
    11: {
      heading: `Master Expression 11 — You Act On Inspiration`,
      why: `Your natural mode of doing anything runs through heightened insight — you move on what you sense before you can fully explain it, trusting a kind of download that arrives ahead of ordinary logic. This is a master-numbered Expression, meaning the charge behind it runs stronger than a typical single-digit one; when inspiration hits, it tends to hit with real intensity, and your most effective action almost always follows that intensity rather than a slower, more methodical plan.`,
      traits: `Ideas and insight tend to arrive to you fully formed, sometimes faster than you can act on them. Ordinary, uninspired routine drains you noticeably. You're unusually good at sensing what a moment or a person actually needs before it's been spoken.`,
      shadow: `Unchecked, this inspired mode of acting looks like staying purely inspired without ever grounding the action — brilliant, electric ideas that never quite make it into the material world, leaving you wired, restless, and strangely unsatisfied despite how much insight you're clearly generating.`,
      path: `Try turning today's insight into one concrete step, however small. You are allowed to be inspired and still be practical about the follow-through. What vision have you been carrying without ever building?`,
    },
    22: {
      heading: `Master Expression 22 — You Act By Building at Scale`,
      why: `Your natural mode of doing anything runs through large-scale construction — you move things forward by combining genuine vision with the discipline to actually finish building it, not just imagining its full size. This is a master-numbered Expression, carrying more charge than a typical single-digit one; you're one of the rare people capable of holding something genuinely enormous in your head and still caring about the tedious, unglamorous steps required to make it real.`,
      traits: `You think in systems and structures rather than isolated tasks. Ambition doesn't intimidate you the way it does most people — if anything, it energizes you. You're comfortable being the person responsible for something that will genuinely outlast the current moment.`,
      shadow: `Unchecked, this scale-driven mode of acting looks like taking on more than your actual capacity can sustain, treating exhaustion as evidence you're doing it correctly rather than as the warning it actually is.`,
      path: `Try pacing today's effort against your real energy, not the project's full eventual size. You are allowed to build big and still rest deliberately along the way. Where has ambition been outrunning your own limits?`,
    },
    33: {
      heading: `Master Expression 33 — You Act Through Service`,
      why: `Your natural mode of doing anything runs through direct care for other people — you move things forward by showing up for someone going through something real, offering a kind of presence most people have to learn deliberately and you carry as instinct. This is a master-numbered Expression, meaning the intensity behind it runs deeper than an ordinary single-digit one; your action, at its best, doesn't just help — it's genuinely felt by the people receiving it.`,
      traits: `People tend to bring you their real problems, sensing you'll actually hold them well. You give without keeping obvious score, often without fully noticing you're doing it. Comforting, teaching, and guiding come to you more naturally than almost anything else.`,
      shadow: `Unchecked, this service-driven mode of acting looks like acting in service of everyone until there's nothing left over for you — a pattern of showing up completely for other people's needs while your own quietly go unattended.`,
      path: `Try doing one thing today purely for your own care, unconnected to anyone else's need. You are allowed to serve others and still genuinely serve yourself. What has this mode of caring been costing you that you haven't yet named?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSoulUrgeContent = (function () {
  const data = {
    1: {
      heading: `Soul Urge 1 — You Crave Independence`,
      why: `Soul Urge answers a very different question than Expression does — not how you act, but what you actually want underneath all the acting, the private craving that motivates you even when nobody's watching or measuring the result. For you, that craving is genuine independence: to be the author of your own life, answering to your own judgment rather than someone else's approval, free to move without needing permission first. This desire often runs quieter than your outward confidence suggests — it's less about dominance and more about simply not wanting to owe your direction to anyone else.`,
      traits: `Being told what to do, even gently, tends to land harder on you than it does on most people. You feel most alive when a decision is genuinely, unambiguously yours. Independence, for you, isn't a phase — it's closer to an ongoing need.`,
      shadow: `Left unspoken, this craving turns into resentment toward anyone who asks you to check in, explain yourself, or wait for consensus — even when the request is entirely reasonable. You can start treating basic accountability as a threat to something much deeper than it actually is.`,
      path: `Try naming your want for independence directly today instead of just acting on it sideways through resistance. You are allowed to want autonomy out loud, without disguising it as something else. Where has this craving been expressed as friction instead of an honest request?`,
    },
    2: {
      heading: `Soul Urge 2 — You Crave Real Closeness`,
      why: `Underneath everything else you do, what you actually want is genuine partnership — to be truly known by someone, not merely agreeable with them, not simply liked, but actually seen and still chosen. This craving runs deeper than surface sociability; you can be warmly present in a room full of people and still feel privately unmet if none of them have reached the part of you this desire is actually about.`,
      traits: `You notice the difference between being around people and being truly close to someone, and the gap between them bothers you more than you usually say. Harmony in a relationship matters to you at a level that can be hard for others to fully register. You're drawn to depth over breadth in your closest connections.`,
      shadow: `Left unspoken, this craving turns into over-accommodating people just to keep them near you, agreeing past the point of your own comfort because the fear of losing closeness outweighs the discomfort of losing yourself inside it.`,
      path: `Try asking for the closeness you actually want directly today, rather than hoping it's noticed. You are allowed to want to be truly known, and to say so. Where has fear of losing someone kept you from actually asking to be seen by them?`,
    },
    3: {
      heading: `Soul Urge 3 — You Crave to Be Truly Seen`,
      why: `Underneath everything else you do, what you actually want is for your real self — not the performed, entertaining version, but the one underneath it — to be genuinely delighted in, not just enjoyed for the show. This craving can be confusing even to you, because you're often so good at the performance that people mistake it for the whole picture, and the gap between being enjoyed and being truly known can feel lonelier than it looks from the outside.`,
      traits: `You can feel most isolated in rooms where you're the most visible and entertaining. Being taken seriously matters to you more than the easy laughs suggest. There's likely a private, more vulnerable creative or emotional register you rarely let fully surface.`,
      shadow: `Left unspoken, this craving turns into performing so constantly and so well that the real version stays permanently hidden behind it, until even you start to lose clear track of where the performance ends and the actual person begins.`,
      path: `Try letting the unpolished version of yourself show today, at least to one person. You are allowed to want to be seen, not only found entertaining. What have you been performing instead of simply revealing?`,
    },
    4: {
      heading: `Soul Urge 4 — You Crave Real Security`,
      why: `Underneath everything else you do, what you actually want is solid ground — something dependable enough underfoot that you can finally stop quietly bracing for it to give way. This craving often gets mistaken, even by you, for a simple love of order or routine, but it runs deeper than preference: it's a genuine need for stability substantial enough that you don't have to keep testing whether it will hold.`,
      traits: `Unpredictability tends to unsettle you more than you let on. You likely find real comfort in structure, routine, and things that behave the way they're supposed to. Trust, once it's built with you, runs deep and steady.`,
      shadow: `Left unspoken, this craving turns into over-controlling your surroundings in an attempt to manufacture a safety that no external structure can actually guarantee — rigidity standing in for the security that was never going to come from control alone.`,
      path: `Try naming what actually makes you feel secure today, out loud, to someone who cares about you. You are allowed to want stability and to say so plainly. Where has controlling your environment become a substitute for actually asking to be steadied?`,
    },
    5: {
      heading: `Soul Urge 5 — You Crave Real Freedom`,
      why: `Underneath everything else you do, what you actually want is genuine room to move — the ability to not be locked into one fixed version of your life indefinitely, to keep the door open even when you're not currently walking through it. This craving isn't about instability for its own sake; it's about never wanting to discover, too late, that a choice quietly became a cage.`,
      traits: `Commitment can feel loaded to you in a way it doesn't for most people, even when you genuinely want the thing you're committing to. You likely need more unstructured time than the people around you expect. Variety feels less like a distraction to you and more like actual nourishment.`,
      shadow: `Left unspoken, this craving turns into avoiding any commitment that resembles a cage, even good ones, until the avoidance itself becomes the thing limiting your life more than any actual commitment ever would have.`,
      path: `Try naming what freedom would specifically look like for you today, in concrete terms. You are allowed to want room to move and still choose to stay somewhere. Where has fear of being trapped kept you from a commitment that was actually safe?`,
    },
    6: {
      heading: `Soul Urge 6 — You Crave to Belong`,
      why: `Underneath everything else you do, what you actually want is a real home — people who are unmistakably yours, and a place genuinely built around mutual care rather than mere proximity. This craving is often disguised, even to yourself, as simply being the person who takes care of everyone; underneath the caretaking is a quieter, more vulnerable wish to belong somewhere without having to earn your place in it every single day.`,
      traits: `You likely notice, more than most people, whether a space feels like it truly includes you. Being needed can feel reassuring, but being wanted for who you are, not just what you provide, matters even more. Home, in some form, is rarely a background concern for you.`,
      shadow: `Left unspoken, this craving turns into over-giving as a way to earn a belonging that was never actually meant to be conditional on your usefulness — love and inclusion quietly turned into something you have to keep purchasing.`,
      path: `Try asking to be cared for today instead of only providing care to others. You are allowed to want belonging without having to earn it first. Where have you been quietly proving your worth to people who never actually required proof?`,
    },
    7: {
      heading: `Soul Urge 7 — You Crave Real Understanding`,
      why: `Underneath everything else you do, what you actually want is to genuinely understand — yourself, the people around you, something true beneath whatever surface is currently being presented. This craving isn't idle curiosity; it's closer to a real hunger, one that isn't satisfied by easy explanations or comfortable half-truths, and that keeps you circling a question long after most people would have accepted the first plausible answer.`,
      traits: `Small talk likely feels less satisfying to you than a genuinely honest conversation, even a difficult one. Solitude tends to restore you more reliably than company does. You're probably drawn to whatever hasn't been fully explained yet, even when nobody else in the room has noticed the gap.`,
      shadow: `Left unspoken, this craving turns into isolating with the search for understanding rather than sharing what you're actually finding, until your depth becomes something private and unreachable rather than something that could also connect you to people.`,
      path: `Try sharing one thing you're still figuring out today, incomplete as it is. You are allowed to want understanding and still let yourself be interrupted mid-thought. What insight have you been keeping entirely to yourself that's actually ready to be spoken?`,
    },
    8: {
      heading: `Soul Urge 8 — You Crave Real Impact`,
      why: `Underneath everything else you do, what you actually want is to matter at a scale you can't dismiss — to build something whose effect on the world is undeniable, not merely appreciated in passing. This craving can be uncomfortable to admit, because it's easy to mistake for simple ambition or greed, when what's actually underneath it is often a much rawer question about whether your existence has genuinely registered.`,
      traits: `Small, invisible contributions likely satisfy you less than visible, measurable ones. You're probably drawn to positions and projects with real consequence attached. Being underestimated tends to bother you more sharply than it would most people.`,
      shadow: `Left unspoken, this craving turns into chasing achievement as proof you're allowed to exist at all, with each accomplishment offering only brief relief before the underlying question resurfaces, unanswered, demanding the next achievement to quiet it.`,
      path: `Try naming what impact would actually satisfy you today, honestly, without inflating or minimizing it. You are allowed to want to matter, and to say so plainly. What are you actually trying to prove, and to whom?`,
    },
    9: {
      heading: `Soul Urge 9 — You Crave to Give Something That Matters`,
      why: `Underneath everything else you do, what you actually want is for your care to genuinely help — to leave the people and situations you touch measurably better than you found them, not simply to feel generous in the moment. This craving runs wide rather than narrow; your giving rarely stays confined to your immediate circle, and part of what satisfies you is knowing the effect reaches further than you can personally see.`,
      traits: `You're likely drawn to causes and people beyond your own immediate self-interest. Witnessing suffering you can't address tends to affect you more than it would most people. Generosity feels less like a virtue you practice and more like simply who you are.`,
      shadow: `Left unspoken, this craving turns into giving well past the point you have anything left to give, running on a kind of moral momentum that outpaces your actual capacity, until the giving that was meant to help starts to genuinely deplete you instead.`,
      path: `Try noticing today what you actually need to receive, not only what you're able to give. You are allowed to want something back in return for your generosity. Where has giving become a one-directional habit that's quietly running you dry?`,
    },
    11: {
      heading: `Master Soul Urge 11 — You Crave to Illuminate Something`,
      why: `Underneath everything else you do, what you actually want is for your insight to genuinely reach someone — to matter beyond simply being correct, to actually illuminate something true for another person rather than staying a private realization you carry alone. This is a master-numbered Soul Urge, meaning the craving underneath it runs with more intensity than an ordinary single-digit one; when you sense something true, the wanting to share it can feel almost physical.`,
      traits: `You likely feel a strong pull to explain or reveal something once you've understood it clearly. Being fully understood matters to you at an unusually deep level. A sense of larger meaning or purpose tends to run underneath even your ordinary days.`,
      shadow: `Left unspoken, this craving turns into needing everyone to see exactly what you see, even in moments when they're genuinely not ready to — a well-intentioned intensity that can start to feel, to other people, like pressure rather than illumination.`,
      path: `Try sharing one insight today without needing it to land perfectly or be immediately understood. You are allowed to want to illuminate something and still let the timing be someone else's to choose. Where has this craving tipped from sharing into insisting?`,
    },
    22: {
      heading: `Master Soul Urge 22 — You Crave to Build Something Lasting`,
      why: `Underneath everything else you do, what you actually want is to leave something standing — real, tangible proof that you were genuinely here, built at a scale substantial enough that it outlasts the moment of its creation. This is a master-numbered Soul Urge, carrying more weight than a typical single-digit one; the craving to build something lasting isn't a passing ambition for you, it's closer to a defining need.`,
      traits: `Small, temporary accomplishments likely satisfy you less than something built to endure. You're probably drawn to legacy-scale thinking, even in ordinary conversations about your own future. The idea of your effort disappearing without a trace likely bothers you more than it would most people.`,
      shadow: `Left unspoken, this craving turns into never quite feeling like anything you've built is big enough yet, an endlessly receding finish line that keeps you working toward a scale of "enough" that never actually arrives.`,
      path: `Try naming what "enough" would specifically look like for you today, in concrete terms. You are allowed to want to build something lasting and still recognize when a piece of it is genuinely complete. Where has the scale of the goal kept you from feeling any of the progress?`,
    },
    33: {
      heading: `Master Soul Urge 33 — You Crave to Heal Something`,
      why: `Underneath everything else you do, what you actually want is for your care to genuinely repair something — a person, a wound, a pattern that's been broken for a long time before you arrived to it. This is a master-numbered Soul Urge, meaning the craving underneath it runs deeper and more urgently than an ordinary single-digit one; healing, for you, isn't a nice idea, it's closer to an ongoing, private mission.`,
      traits: `You're likely drawn toward whatever is hurting in a room before you're drawn toward whatever is comfortable. Other people's unresolved pain can occupy more of your attention than your own does. A sense of responsibility for making things better tends to follow you into situations that aren't technically yours to fix.`,
      shadow: `Left unspoken, this craving turns into needing to fix everyone around you before you can genuinely rest, treating your own peace as conditional on the healing of people who haven't asked you to carry that weight for them.`,
      path: `Try letting one thing today stay unfixed by you specifically. You are allowed to want to heal, and still not be responsible for everyone's healing. What have you been trying to repair that was never actually yours to mend?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DPersonalityContent = (function () {
  const data = {
    1: {
      heading: `Personality 1 — You Come Across as Confident`,
      why: `Personality answers yet another distinct question — not how you act or what you privately want, but how you land on someone before they actually know you, the surface impression that forms in the first few minutes of any new encounter. On first meeting, people read you as decisive and self-assured, someone who already seems to know where they're headed. This impression forms fast, often before you've said very much at all — something in your bearing simply reads as capable.`,
      traits: `Strangers likely defer to you faster than you'd expect, without quite knowing why. You probably don't have to work hard to be taken seriously in a new setting. First impressions of you tend to skew toward authority, even when that's not what you were going for.`,
      shadow: `The risk of this particular first impression is that it reads as unapproachable before anyone's had the chance to see the warmth that's actually underneath it — people can hold back from approaching you simply because your surface confidence looks like it doesn't need anyone.`,
      path: `Try letting one moment of genuine not-knowing show today, on purpose, in a new interaction. You are allowed to look confident and still be reachable. Where has your surface certainty been keeping people at a distance you didn't intend?`,
    },
    2: {
      heading: `Personality 2 — You Come Across as Gentle`,
      why: `On first meeting, people read you as easy to talk to — approachable, calm, someone who clearly won't judge whatever they end up saying. This impression forms almost immediately, often through nothing more than your tone or the quality of your attention, and it tends to make people comfortable disclosing things to you faster than they usually would to someone new.`,
      traits: `Strangers likely open up to you sooner than they open up to most people. You probably come across as a good listener before you've even said much. People tend to feel unusually safe around you on first contact.`,
      shadow: `The risk of this particular first impression is that it reads as a pushover before anyone's seen how much you actually think and hold underneath the gentleness — your softness can get mistaken for a lack of real opinion, simply because it arrives first.`,
      path: `Try voicing one clear opinion today, early, in a first conversation. You are allowed to be gentle and still be taken seriously in the same breath. Where has your calm exterior been read as having nothing underneath it?`,
    },
    3: {
      heading: `Personality 3 — You Come Across as Magnetic`,
      why: `On first meeting, people read you as fun and alive — the person a room naturally gravitates toward, even before you've done anything in particular to earn the attention. This impression tends to form instantly and effortlessly; something about your energy or expressiveness draws people in without requiring deliberate effort on your part.`,
      traits: `You likely become the center of a new room without trying to be. People probably remember meeting you longer than they remember meeting most people. Your presence tends to lift the energy of a space the moment you enter it.`,
      shadow: `The risk of this particular first impression is that it reads as lightweight before anyone's seen how much genuine substance is actually there — your magnetism can overshadow your depth simply because the surface is so immediately engaging.`,
      path: `Try letting one serious thought show through the charm today, early in an interaction. You are allowed to be magnetic and substantial in the same conversation. What depth have you been keeping behind the shine?`,
    },
    4: {
      heading: `Personality 4 — You Come Across as Solid`,
      why: `On first meeting, people read you as dependable — someone whose word can genuinely be trusted at face value, without needing to be tested first. This impression forms through something steady in how you carry yourself, and it tends to make people comfortable relying on you almost immediately, often before you've actually done anything to prove that reliability.`,
      traits: `Strangers likely hand you responsibility faster than they hand it to most new acquaintances. You probably come across as more serious than you actually feel on the inside. People tend to trust your follow-through before you've had the chance to demonstrate it.`,
      shadow: `The risk of this particular first impression is that it reads as rigid or humorless before anyone's seen your actual range — your steadiness can get mistaken for an absence of playfulness, simply because it's the first and most visible thing about you.`,
      path: `Try letting a little lightness show in a first meeting today. You are allowed to be solid and still be genuinely fun. Where has your dependable surface been hiding a lighter side people haven't gotten to meet yet?`,
    },
    5: {
      heading: `Personality 5 — You Come Across as Exciting`,
      why: `On first meeting, people read you as spontaneous and interesting — someone whose life clearly sounds unpredictable in a good way, even before you've shared many actual details about it. This impression forms through your energy and openness to novelty, and it tends to make people expect adventure from you almost immediately.`,
      traits: `Strangers likely ask you what you're up to next, assuming there's always something. You probably come across as more restless than you feel in your steadier moments. People tend to associate you with change and movement on first read.`,
      shadow: `The risk of this particular first impression is that it reads as unreliable before anyone's seen how deep your actual long-term commitments run — the excitement people sense first can eclipse the loyalty that's actually there underneath it.`,
      path: `Try mentioning one long-standing commitment in a first conversation today. You are allowed to be exciting and still be genuinely steady. What consistency have you been keeping quiet because the exciting version gets more attention?`,
    },
    6: {
      heading: `Personality 6 — You Come Across as Warm`,
      why: `On first meeting, people read you as caring and easy to be around — someone who already seems to want good things for them, sometimes within minutes of meeting you at all. This impression forms through something in your attentiveness or hospitality, and it tends to make people feel looked after almost immediately, before any actual relationship has had time to develop.`,
      traits: `Strangers likely feel comfortable asking you for help sooner than they'd ask most new acquaintances. You probably come across as nurturing before you've had the chance to actually demonstrate it. People tend to read you as safe and welcoming on first contact.`,
      shadow: `The risk of this particular first impression is that it reads as needing to be needed before anyone's seen your own boundaries — your warmth can invite people to lean on you more heavily than you'd actually chosen to offer.`,
      path: `Try stating one boundary today, early, in a new relationship. You are allowed to be warm and still have real limits. Where has your caring first impression been costing you the chance to set terms early?`,
    },
    7: {
      heading: `Personality 7 — You Come Across as Mysterious`,
      why: `On first meeting, people read you as thoughtful and a little unreachable — someone with clearly more going on beneath the surface than they're immediately being shown. This impression forms through your natural reserve, and it tends to make people curious about you, even while it keeps them at a slight, respectful distance until they've earned closer access.`,
      traits: `Strangers likely find you harder to read than most people they meet. You probably come across as more private than you actually feel once someone's earned your trust. People tend to sense depth in you before they've had any evidence of it.`,
      shadow: `The risk of this particular first impression is that it reads as cold before anyone's earned the trust to see past it — your genuine reserve can be mistaken for disinterest, simply because warmth, for you, takes longer to become visible.`,
      path: `Try offering one small, genuine piece of yourself early in a new interaction today. You are allowed to be private and still be warm on first contact. Where has your reserve been read as distance rather than depth?`,
    },
    8: {
      heading: `Personality 8 — You Come Across as Powerful`,
      why: `On first meeting, people read you as capable and in command — someone who's clearly used to being in charge of things, even in situations where you haven't actually claimed any formal authority yet. This impression forms through your bearing and presence, and it tends to make people defer to you or expect leadership from you almost immediately.`,
      traits: `Strangers likely assume you're more senior or in charge than you technically are. You probably come across as more intense than you feel in your softer moments. People tend to take your opinions seriously on first meeting, sometimes more seriously than you intended.`,
      shadow: `The risk of this particular first impression is that it reads as intimidating before anyone's seen how much you actually care underneath the command — your strength can keep people from approaching you with anything vulnerable, simply because the surface reads as too solid for it.`,
      path: `Try letting a moment of genuine softness show in a first meeting today. You are allowed to be powerful and still be gentle in the same interaction. Where has your commanding presence been keeping real closeness at arm's length?`,
    },
    9: {
      heading: `Personality 9 — You Come Across as Generous`,
      why: `On first meeting, people read you as warm and open-minded — someone who already seems to want good things for the world, not just for themselves, even in a brief first conversation. This impression forms through your natural broad-mindedness, and it tends to make people trust your intentions quickly, often before you've had the chance to demonstrate them in action.`,
      traits: `Strangers likely assume good faith from you faster than they assume it from most people. You probably come across as more idealistic than you feel in your more clear-eyed, practical moments. People tend to bring you their causes and concerns on first meeting, sensing you'll actually care.`,
      shadow: `The risk of this particular first impression is that it reads as naive before anyone's seen how sharp your actual read on people is — your generosity of spirit can get mistaken for a lack of discernment, simply because warmth arrives before wariness does.`,
      path: `Try naming one clear-eyed, discerning observation about someone today, early in the interaction. You are allowed to be generous and still be genuinely discerning. Where has your open-mindedness been mistaken for a lack of judgment?`,
    },
    11: {
      heading: `Master Personality 11 — You Come Across as Inspired`,
      why: `On first meeting, people read you as intense and a little electric — someone clearly operating on a different frequency than most, even before they can name exactly why they sense it. This is a master-numbered Personality, meaning the impression carries more charge than an ordinary single-digit one; people often remember meeting you specifically, in a way they don't remember most first encounters.`,
      traits: `Strangers likely feel a kind of charged energy around you they can't fully explain. You probably come across as more intense or unusual than you feel internally in ordinary moments. People tend to sense significance in you on first meeting, before any evidence has been given.`,
      shadow: `The risk of this particular first impression is that it reads as overwhelming before anyone's had time to catch up to your pace — the intensity that makes you memorable can also make new people slightly wary of getting close too quickly.`,
      path: `Try slowing your first impression down today, on purpose, in a new interaction. You are allowed to be inspired and still be easy to be around. Where has your natural intensity been outpacing the people trying to get to know you?`,
    },
    22: {
      heading: `Master Personality 22 — You Come Across as Capable`,
      why: `On first meeting, people read you as someone who could actually build the thing everyone else is only theorizing about — a rare, immediate impression of both vision and practical capability. This is a master-numbered Personality, carrying more weight than a typical single-digit one; people tend to hand you responsibility on first meeting that they'd normally reserve for someone they'd known much longer.`,
      traits: `Strangers likely trust your competence faster than they trust most new acquaintances'. You probably come across as more capable than you feel in your own private moments of doubt. People tend to assume you can handle more than you've actually volunteered for.`,
      shadow: `The risk of this particular first impression is that it reads as intimidating before anyone's seen your own real limits — your evident capability can make people assume you never need help, which quietly discourages them from ever offering it.`,
      path: `Try admitting one limit today, early, in a first conversation. You are allowed to look capable and still ask for help. Where has your competent first impression been keeping support from reaching you?`,
    },
    33: {
      heading: `Master Personality 33 — You Come Across as Deeply Caring`,
      why: `On first meeting, people read you as someone genuinely safe to bring their real problems to — present, kind, and trustworthy in a way that usually takes much longer to establish. This is a master-numbered Personality, meaning the impression lands with unusual depth for a first encounter; people often disclose more to you on first meeting than they'd planned to.`,
      traits: `Strangers likely open up to you faster and more fully than they open up to most people. You probably come across as more emotionally available than you actually have the bandwidth for in a given moment. People tend to seek you out for comfort almost immediately.`,
      shadow: `The risk of this particular first impression is that it reads as endless availability before anyone's seen that you have limits too — your evident care can invite an amount of leaning that isn't actually sustainable for you to hold.`,
      path: `Try naming one thing you need in a first conversation today, not only offering care. You are allowed to be cared for too, even on first meeting. Where has your caring first impression been costing you your own limits?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DMaturityContent = (function () {
  const data = {
    1: {
      heading: `Maturity 1 — Becoming Genuinely Self-Directed`,
      why: `Maturity is the number that answers the last of these four questions — not how you act, what you want, or how you land on first impression, but who you're actually growing into once your Life Path and Expression numbers have had the time to converge and settle. In the second half of life, you're growing into real, settled authority over your own path — leadership that no longer needs to prove itself to anyone, including you. What was once an urgent need to lead visibly tends to soften, over time, into a quieter, steadier confidence that doesn't require an audience to feel real.`,
      traits: `Later chapters of your life likely bring a noticeably calmer relationship to being in charge. You're probably less interested, over time, in convincing anyone of your capability. Decisiveness tends to remain intact, but the urgency underneath it usually eases.`,
      shadow: `The risk on the way to this maturity is arriving at real authority while still defending it like it's under constant threat — settled leadership that never fully stops bracing for challenge, long after the challenge has actually stopped coming.`,
      path: `Try leading one thing this season without needing to justify it to anyone. You are allowed to simply be in charge of your own life, without an ongoing case for it. Where is your leadership still performing certainty it no longer needs to perform?`,
    },
    2: {
      heading: `Maturity 2 — Becoming Genuinely Balanced`,
      why: `In the second half of life, you're growing into real partnership — cooperation that no longer requires losing yourself in order to sustain it. What may have once looked like constant accommodation tends to soften, over time, into a genuine, two-sided balance, where closeness with other people stops costing you your own voice in the process.`,
      traits: `Later chapters of your life likely bring more comfort stating a direct preference than earlier ones did. You're probably less afraid, over time, that disagreement will end a relationship. Diplomacy tends to remain a real strength, but it usually stops functioning as self-erasure.`,
      shadow: `The risk on the way to this maturity is arriving at real balance while still over-adjusting for everyone else's comfort out of old habit — genuine cooperation that hasn't yet fully let go of its earlier, more anxious form.`,
      path: `Try stating one need plainly this season instead of managing carefully around it. You are allowed to be balanced and still be direct. Where is old caution still shaping conversations that no longer need it?`,
    },
    3: {
      heading: `Maturity 3 — Becoming Genuinely Expressive`,
      why: `In the second half of life, you're growing into expression with real substance behind it — creativity and voice that are finally allowed to be serious as well as light, rather than defaulting permanently to charm. What may have once been a reflex to keep things entertaining tends to soften, over time, into a fuller range, where depth is allowed to sit right alongside the humor instead of being hidden behind it.`,
      traits: `Later chapters of your life likely bring more willingness to share unfinished or serious work. You're probably less reliant, over time, on humor as a shield in difficult conversations. Your expressive gift tends to remain intact, but it usually stops needing to constantly perform lightness.`,
      shadow: `The risk on the way to this maturity is still hiding behind the performance out of old habit, even once the deeper substance is genuinely ready to be shown — charm that hasn't yet learned it's allowed to step aside sometimes.`,
      path: `Try sharing one serious piece of work this season without softening it into a joke. You are allowed to be taken seriously, fully, not just as a performer. Where is old deflection still covering something that's actually ready to be seen?`,
    },
    4: {
      heading: `Maturity 4 — Becoming Genuinely Grounded`,
      why: `In the second half of life, you're growing into real stability — structure that finally has enough give in it for you, and the people around you, to actually live inside comfortably. What may have once looked like rigid insistence on the one right way tends to soften, over time, into a steadiness that can flex without feeling threatened by the flexing.`,
      traits: `Later chapters of your life likely bring more comfort adjusting a plan mid-course. You're probably less rattled, over time, by change that arrives without warning. Your reliability tends to remain intact, but it usually stops requiring rigid control to feel secure.`,
      shadow: `The risk on the way to this maturity is still treating flexibility as failure out of old habit, even once genuine stability no longer depends on everything staying exactly fixed.`,
      path: `Try changing one plan this season without treating it as a defeat. You are allowed to be grounded and still adapt easily. Where is old rigidity still protecting a stability that doesn't actually need that much protection anymore?`,
    },
    5: {
      heading: `Maturity 5 — Becoming Genuinely Free`,
      why: `In the second half of life, you're growing into freedom that's chosen on purpose, rather than restlessness reacting automatically against anything that resembles commitment. What may have once looked like constant motion tends to soften, over time, into a freedom that can actually choose to stay somewhere, because staying no longer feels like the same thing as being trapped.`,
      traits: `Later chapters of your life likely bring more genuine ease with roots and routine than earlier ones did. You're probably less anxious, over time, about a commitment closing off other options. Your love of variety tends to remain intact, but it usually stops requiring constant movement to feel satisfied.`,
      shadow: `The risk on the way to this maturity is still mistaking restlessness for actual freedom out of old habit, even once real, chosen freedom no longer needs to prove itself through perpetual motion.`,
      path: `Try choosing one form of stability on purpose this season. You are allowed to be free and still want roots. Where is old restlessness still running on reflex rather than genuine desire?`,
    },
    6: {
      heading: `Maturity 6 — Becoming Genuinely Nurturing`,
      why: `In the second half of life, you're growing into care that no longer needs control to feel complete — love that can genuinely let people be, trusting them with their own lives instead of quietly managing the outcome on their behalf. What may have once looked like anxious caretaking tends to soften, over time, into a steadier, more spacious kind of devotion.`,
      traits: `Later chapters of your life likely bring more comfort watching someone struggle without immediately intervening. You're probably less anxious, over time, about outcomes you can't personally control. Your instinct to care tends to remain intact, but it usually stops requiring management to feel like love.`,
      shadow: `The risk on the way to this maturity is arriving there while still needing to manage the outcome of your caring out of old habit, even once real trust in other people's capability has genuinely developed.`,
      path: `Try releasing one thing this season you'd normally have managed out of love. You are allowed to care and let go in the same gesture. Where is old anxiety still disguised as necessary caretaking?`,
    },
    7: {
      heading: `Maturity 7 — Becoming Genuinely Wise`,
      why: `In the second half of life, you're growing into understanding that's finally ready to be shared, not simply held privately as it may have been for most of your life. What may have once looked like guarded solitude tends to soften, over time, into a wisdom that's willing to actually reach other people, rather than staying sealed inside your own reflection.`,
      traits: `Later chapters of your life likely bring more willingness to teach or mentor than earlier ones did. You're probably less protective, over time, of insight you once would have kept entirely to yourself. Your depth tends to remain intact, but it usually stops needing total privacy to feel safe.`,
      shadow: `The risk on the way to this maturity is still keeping real depth to yourself out of old habit, even once that depth has become genuinely valuable to other people and ready to be offered.`,
      path: `Try teaching one thing you know this season instead of simply knowing it privately. You are allowed to be wise and still be generous with it. Where is old guardedness still withholding something that's actually ready to be given?`,
    },
    8: {
      heading: `Maturity 8 — Becoming Genuinely Powerful`,
      why: `In the second half of life, you're growing into authority that no longer needs to prove its worth through what it's produced — power that can simply exist, secure in itself, without an ongoing scoreboard attached to justify it. What may have once looked like relentless output tends to soften, over time, into a steadier confidence that doesn't require constant achievement to feel real.`,
      traits: `Later chapters of your life likely bring more genuine ease with rest than earlier, more driven ones did. You're probably less anxious, over time, about days that produced nothing measurable. Your capability tends to remain fully intact, but it usually stops needing to be constantly demonstrated.`,
      shadow: `The risk on the way to this maturity is still measuring your own value purely by output out of old habit, even once real authority no longer requires that particular kind of proof.`,
      path: `Try counting one thing this season as valuable that produced nothing measurable. You are allowed to matter without a metric attached. Where is old achievement-anxiety still running underneath a confidence that's actually already secure?`,
    },
    9: {
      heading: `Maturity 9 — Becoming Genuinely Generous`,
      why: `In the second half of life, you're growing into giving that's genuinely sustainable — care for the wider world that finally includes yourself as someone worth caring for too. What may have once looked like giving until there was nothing left tends to soften, over time, into a generosity with real limits, ones that let the giving continue without quietly hollowing you out.`,
      traits: `Later chapters of your life likely bring more comfort keeping something explicitly for yourself. You're probably less guilty, over time, about resources or time not spent on others. Your compassion tends to remain fully intact, but it usually stops requiring self-erasure to feel genuine.`,
      shadow: `The risk on the way to this maturity is still giving until there's nothing left over out of old habit, even once real generosity no longer requires depleting yourself completely to count as real.`,
      path: `Try keeping one thing this season purely for yourself. You are allowed to be generous and still be replenished. Where is old guilt still pushing you to give past the point that's actually sustainable?`,
    },
    11: {
      heading: `Master Maturity 11 — Becoming Genuinely Grounded Vision`,
      why: `In the second half of life, you're growing into inspiration that finally lands — insight that's actually built into something real in the world, rather than staying purely conceptual. This is a master-numbered Maturity, carrying more charge than a typical single-digit one; what may have once looked like brilliant, ungrounded ideas tends to soften, over time, into vision paired with real, completed follow-through.`,
      traits: `Later chapters of your life likely bring more finished projects than earlier, more purely inspired ones did. You're probably less restless, over time, once an idea has actually found its outlet. Your intuitive gift tends to remain fully intact, but it usually stops needing to stay abstract to feel meaningful.`,
      shadow: `The risk on the way to this maturity is still staying purely in the vision without finishing the build out of old habit, even once the capacity to actually complete something has genuinely developed.`,
      path: `Try completing one inspired idea this season, start to finish. You are allowed to be visionary and still be someone who finishes. Where is old restlessness still pulling you toward the next idea before the current one lands?`,
    },
    22: {
      heading: `Master Maturity 22 — Becoming Genuinely Sustainable Power`,
      why: `In the second half of life, you're growing into large-scale building that no longer costs you your own health to sustain — real capacity paired, finally, with real pacing. This is a master-numbered Maturity, meaning the shift carries more weight than an ordinary single-digit one; what may have once looked like relentless, unsustainable ambition tends to soften, over time, into ambition that includes genuine rest as part of the plan, not a departure from it.`,
      traits: `Later chapters of your life likely bring more deliberate rest than earlier, more driven ones did. You're probably less anxious, over time, about slowing down mid-project. Your capacity to build at scale tends to remain fully intact, but it usually stops requiring self-sacrifice to feel legitimate.`,
      shadow: `The risk on the way to this maturity is still treating rest as a threat to the scale of what you're building out of old habit, even once real sustainability has become genuinely possible for you.`,
      path: `Try resting for one full day this season without guilt attached to it. You are allowed to build big and still stop completely sometimes. Where is old urgency still overriding a pace that's actually sustainable now?`,
    },
    33: {
      heading: `Master Maturity 33 — Becoming Genuinely Whole Service`,
      why: `In the second half of life, you're growing into care for others that finally makes room for being cared for too — service that's become genuinely reciprocal rather than only ever flowing outward. This is a master-numbered Maturity, carrying more depth than a typical single-digit one; what may have once looked like complete self-sacrifice tends to soften, over time, into a fuller circle where your own needs are allowed equal standing.`,
      traits: `Later chapters of your life likely bring more comfort receiving help than earlier, more purely giving ones did. You're probably less resistant, over time, to letting someone else take care of you for once. Your instinct toward service tends to remain fully intact, but it usually stops requiring your own depletion to feel meaningful.`,
      shadow: `The risk on the way to this maturity is still treating your own needs as something to handle only after everyone else's out of old habit, even once real mutual care has actually become available to you.`,
      path: `Try receiving one act of care this season without deflecting it. You are allowed to serve others and genuinely be served in return. Where is old self-sacrifice still declining care that's actually being offered to you?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
