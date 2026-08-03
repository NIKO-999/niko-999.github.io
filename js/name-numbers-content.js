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
 * Voice: title/tagline/mastery/shadow/invitation, same shape and rules used
 * everywhere else in this rollout — mastery is empowered and present-tense,
 * shadow is standalone (not a "but" continuation of mastery), invitation is
 * one concrete, doable action.
 *
 * API (all identical shape):
 *   DExpressionContent.get(num)  -> { title, tagline, mastery, shadow, invitation } or null
 *   DSoulUrgeContent.get(num)    -> { title, tagline, mastery, shadow, invitation } or null
 *   DPersonalityContent.get(num) -> { title, tagline, mastery, shadow, invitation } or null
 *   DMaturityContent.get(num)    -> { title, tagline, mastery, shadow, invitation } or null
 */

window.DExpressionContent = (function () {
  const data = {
    1: {
      title: `Expression 1 — You Act By Going First`,
      tagline: `A Design of Pure Initiation`,
      mastery: `You move first. You default to action once the direction's clear, and other people's hesitation reads as your cue to move, not a reason to slow down.`,
      shadow: `You do everything yourself because delegating feels riskier than just handling it. You're technically capable of leading a team and functionally incapable of trusting one — and you're quietly exhausted from carrying what was never yours to carry alone.`,
      invitation: `Hand one task to someone else today. Don't check it after.`,
    },
    2: {
      title: `Expression 2 — You Act By Bringing People Together`,
      tagline: `A Design of Genuine Alignment`,
      mastery: `You move by alignment. You notice tension before anyone names it, and you build things better through real cooperation than solo momentum — that's method, not hesitation.`,
      shadow: `You soften your own position until it's indistinguishable from everyone else's. You're so good at uniting people that your own actual stance quietly disappears from the process.`,
      invitation: `State your position clearly today, first, before smoothing it for the group.`,
    },
    3: {
      title: `Expression 3 — You Act Through Words and Presence`,
      tagline: `A Design of Visible Aliveness`,
      mastery: `You move through visible aliveness. A plan doesn't feel real to you until it's spoken, and your enthusiasm is one of the most reliable tools you have for actually getting something moving.`,
      shadow: `You talk a plan into existence and never build the thing underneath it. Momentum lives entirely in the telling while follow-through gets perpetually delayed by the next exciting conversation.`,
      invitation: `Finish one thing today that you already talked about starting. No new audience.`,
    },
    4: {
      title: `Expression 4 — You Act By Building the Structure`,
      tagline: `A Design of Real Architecture`,
      mastery: `You give ideas real shape, one verifiable piece at a time. You don't trust a plan until you can see its bones, and people quietly rely on you to keep the exciting idea from collapsing on contact with reality.`,
      shadow: `You refuse to move until every detail is locked down, well past the point certainty is actually useful. You stall a genuinely good plan because it hasn't met your own standard of fully proven.`,
      invitation: `Start one structure today before it's fully planned out.`,
    },
    5: {
      title: `Expression 5 — You Act By Moving and Adapting`,
      tagline: `A Design of Responsive Motion`,
      mastery: `You stay loose enough to change course the instant reality tells you something the plan didn't account for. That's not inconsistency — it's a real theory of how progress works.`,
      shadow: `You change direction so often nothing gets the sustained time it needs to prove itself. A whole project spent perpetually mid-pivot, never finished.`,
      invitation: `Stay with today's plan even when a better-looking option shows up mid-stream.`,
    },
    6: {
      title: `Expression 6 — You Act By Taking Care of Things`,
      tagline: `A Design of Mobilized Responsibility`,
      mastery: `You move things forward by making sure the people and details around you are actually looked after. Something needing tending mobilizes you faster than personal ambition ever could.`,
      shadow: `You take on responsibility nobody assigned you, quietly expanding your own workload by managing things that were never yours to manage.`,
      invitation: `Let one thing go uncared-for today that genuinely isn't yours to manage.`,
    },
    7: {
      title: `Expression 7 — You Act By Understanding First`,
      tagline: `A Design of Comprehension as Method`,
      mastery: `You figure things out fully before you commit to a direction. Depth is your actual method, not a delay before the real action starts.`,
      shadow: `You keep researching a decision long after you already had enough information to act on it. Analysis has quietly become its own form of avoidance, dressed up as diligence.`,
      invitation: `Act today on the understanding you already have.`,
    },
    8: {
      title: `Expression 8 — You Act By Executing at Scale`,
      tagline: `A Design of Material Results`,
      mastery: `You move things forward by actually building the outcome. A plan isn't real to you until it's produced something you can point to, measure, or hand someone.`,
      shadow: `You measure every action, including your own worth, purely by output. A day that produced nothing measurable starts to feel, unfairly, like a day that failed.`,
      invitation: `Do one thing today for a reason that has nothing to do with the result it produces.`,
    },
    9: {
      title: `Expression 9 — You Act On Behalf of Something Larger`,
      tagline: `A Design of Purpose Over Self-Interest`,
      mastery: `You move things forward on behalf of something bigger than your own stake in the outcome. Self-interest alone rarely generates the same energy in you that genuine purpose does.`,
      shadow: `You act on everyone else's behalf and rarely on your own. You show up fully for causes and people while your own needs wait indefinitely for their turn.`,
      invitation: `Take one action today purely for your own benefit. No cause required to justify it.`,
    },
    11: {
      title: `Master Expression 11 — You Act On Inspiration`,
      tagline: `A Design of Heightened Insight`,
      mastery: `You act on what you sense before you can fully explain it. Inspiration hits with real intensity, and your most effective action follows that intensity, not a slower plan.`,
      shadow: `You stay purely inspired and never ground the action. Brilliant ideas that never make it into the material world leave you wired, restless, and unsatisfied despite how much insight you're generating.`,
      invitation: `Turn today's insight into one concrete step, however small.`,
    },
    22: {
      title: `Master Expression 22 — You Act By Building at Scale`,
      tagline: `A Design of Vision Paired With Discipline`,
      mastery: `You combine genuine vision with the discipline to actually finish building it. You're one of the rare people who can hold something enormous in your head and still care about the tedious steps that make it real.`,
      shadow: `You take on more than your actual capacity can sustain, treating exhaustion as evidence you're doing it correctly instead of the warning it actually is.`,
      invitation: `Pace today's effort against your real energy, not the project's full eventual size.`,
    },
    33: {
      title: `Master Expression 33 — You Act Through Service`,
      tagline: `A Design of Instinctive Presence`,
      mastery: `You show up for someone going through something real, offering presence most people have to learn deliberately and you carry as instinct. Your action, at its best, is genuinely felt by the person receiving it.`,
      shadow: `You act in service of everyone until there's nothing left for you. You show up completely for other people's needs while your own quietly go unattended.`,
      invitation: `Do one thing today purely for your own care, unconnected to anyone else's need.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DSoulUrgeContent = (function () {
  const data = {
    1: {
      title: `Soul Urge 1 — You Crave Independence`,
      tagline: `A Design of Self-Authored Direction`,
      mastery: `You want to be the author of your own life, answering to your own judgment, moving without needing permission first. It's not dominance — it's just not wanting to owe your direction to anyone.`,
      shadow: `You resent anyone who asks you to check in or explain yourself, even when the request is reasonable. Basic accountability starts to feel like a threat to something much deeper than it is.`,
      invitation: `Name your want for independence directly today instead of acting on it sideways through resistance.`,
    },
    2: {
      title: `Soul Urge 2 — You Crave Real Closeness`,
      tagline: `A Design of Being Truly Known`,
      mastery: `You want to be truly known, not merely agreeable — actually seen and still chosen. That craving runs deeper than surface sociability.`,
      shadow: `You over-accommodate people just to keep them near, agreeing past your own comfort because losing closeness feels worse than losing yourself.`,
      invitation: `Ask for the closeness you actually want today, instead of hoping it's noticed.`,
    },
    3: {
      title: `Soul Urge 3 — You Crave to Be Truly Seen`,
      tagline: `A Design of the Real Self Beneath the Show`,
      mastery: `You want your real self, not the performed version, genuinely delighted in. Being taken seriously matters to you more than the easy laughs suggest.`,
      shadow: `You perform so constantly and so well that the real version stays permanently hidden. Even you start to lose track of where the performance ends and the actual person begins.`,
      invitation: `Let the unpolished version of yourself show today, to at least one person.`,
    },
    4: {
      title: `Soul Urge 4 — You Crave Real Security`,
      tagline: `A Design of Solid Ground`,
      mastery: `You want solid ground — something dependable enough that you can stop bracing for it to give way. That's a genuine need, not a preference for order.`,
      shadow: `You over-control your surroundings trying to manufacture a safety no external structure can actually guarantee. Rigidity stands in for the security that was never coming from control alone.`,
      invitation: `Name what actually makes you feel secure today, out loud, to someone who cares about you.`,
    },
    5: {
      title: `Soul Urge 5 — You Crave Real Freedom`,
      tagline: `A Design of the Open Door`,
      mastery: `You want genuine room to move — the door open even when you're not walking through it. It's not instability for its own sake, it's refusing to let a choice quietly become a cage.`,
      shadow: `You avoid any commitment that resembles a cage, even good ones, until the avoidance itself limits your life more than the commitment ever would have.`,
      invitation: `Name what freedom would specifically look like today, in concrete terms.`,
    },
    6: {
      title: `Soul Urge 6 — You Crave to Belong`,
      tagline: `A Design of Unearned Belonging`,
      mastery: `You want a real home — people who are unmistakably yours, built around mutual care, not proximity. Underneath the caretaking is a wish to belong without earning your place every day.`,
      shadow: `You over-give to earn a belonging that was never meant to be conditional on your usefulness. Love and inclusion quietly turn into something you have to keep purchasing.`,
      invitation: `Ask to be cared for today instead of only providing it.`,
    },
    7: {
      title: `Soul Urge 7 — You Crave Real Understanding`,
      tagline: `A Design of the Real Hunger to Know`,
      mastery: `You want to genuinely understand — yourself, other people, something true beneath the surface. It's a real hunger, not idle curiosity, and it keeps you circling a question past where most people stop.`,
      shadow: `You isolate with the search for understanding instead of sharing what you're finding. Your depth becomes private and unreachable instead of something that could connect you to people.`,
      invitation: `Share one thing you're still figuring out today, incomplete as it is.`,
    },
    8: {
      title: `Soul Urge 8 — You Crave Real Impact`,
      tagline: `A Design of Undeniable Effect`,
      mastery: `You want to matter at a scale you can't dismiss — something whose effect on the world is undeniable. It's a rawer question than ambition: whether your existence has genuinely registered.`,
      shadow: `You chase achievement as proof you're allowed to exist at all. Each accomplishment offers brief relief before the question resurfaces, demanding the next one.`,
      invitation: `Name what impact would actually satisfy you today, honestly.`,
    },
    9: {
      title: `Soul Urge 9 — You Crave to Give Something That Matters`,
      tagline: `A Design of Reach Beyond Yourself`,
      mastery: `You want your care to genuinely help — to leave people and situations measurably better than you found them. Your giving rarely stays confined to your immediate circle.`,
      shadow: `You give well past the point you have anything left, running on moral momentum that outpaces your actual capacity, until giving that was meant to help starts depleting you instead.`,
      invitation: `Notice today what you actually need to receive, not only what you can give.`,
    },
    11: {
      title: `Master Soul Urge 11 — You Crave to Illuminate Something`,
      tagline: `A Design of Insight That Wants to Reach`,
      mastery: `You want your insight to genuinely reach someone — to matter beyond being correct. When you sense something true, wanting to share it can feel physical.`,
      shadow: `You need everyone to see exactly what you see, even when they're not ready to. Well-intentioned intensity starts to feel like pressure instead of illumination.`,
      invitation: `Share one insight today without needing it to land perfectly or immediately.`,
    },
    22: {
      title: `Master Soul Urge 22 — You Crave to Build Something Lasting`,
      tagline: `A Design of Proof That Outlasts You`,
      mastery: `You want to leave something standing — real proof you were here, built at a scale that outlasts the moment of its creation. It's closer to a defining need than a passing ambition.`,
      shadow: `Nothing you've built ever feels big enough. An endlessly receding finish line keeps you working toward a scale of "enough" that never arrives.`,
      invitation: `Name what "enough" would specifically look like today, in concrete terms.`,
    },
    33: {
      title: `Master Soul Urge 33 — You Crave to Heal Something`,
      tagline: `A Design of the Private Mission`,
      mastery: `You want your care to genuinely repair something — a person, a wound, a pattern broken long before you arrived. Healing isn't a nice idea for you, it's an ongoing, private mission.`,
      shadow: `You need to fix everyone around you before you can rest, treating your own peace as conditional on healing people who haven't asked you to carry that weight.`,
      invitation: `Let one thing today stay unfixed by you specifically.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DPersonalityContent = (function () {
  const data = {
    1: {
      title: `Personality 1 — You Come Across as Confident`,
      tagline: `A Design of Instant Authority`,
      mastery: `You land as decisive and self-assured before you've said very much at all. Something in your bearing simply reads as capable.`,
      shadow: `You read as unapproachable before anyone's seen the warmth underneath. People hold back from approaching you because your surface confidence looks like it doesn't need anyone.`,
      invitation: `Let one moment of genuine not-knowing show today, on purpose, in a new interaction.`,
    },
    2: {
      title: `Personality 2 — You Come Across as Gentle`,
      tagline: `A Design of Immediate Ease`,
      mastery: `You land as easy to talk to — calm, someone who clearly won't judge whatever gets said. People disclose things to you faster than they usually would to someone new.`,
      shadow: `You read as a pushover before anyone's seen how much you actually think and hold underneath the gentleness. Your softness gets mistaken for a lack of real opinion.`,
      invitation: `Voice one clear opinion today, early, in a first conversation.`,
    },
    3: {
      title: `Personality 3 — You Come Across as Magnetic`,
      tagline: `A Design of Instant Draw`,
      mastery: `You land as fun and alive — the person a room gravitates toward before you've done anything to earn the attention.`,
      shadow: `You read as lightweight before anyone's seen how much substance is actually there. Your magnetism overshadows your depth simply because the surface is so engaging.`,
      invitation: `Let one serious thought show through the charm today, early in an interaction.`,
    },
    4: {
      title: `Personality 4 — You Come Across as Solid`,
      tagline: `A Design of Immediate Trust`,
      mastery: `You land as dependable — someone whose word can be trusted without being tested first. People rely on you almost immediately.`,
      shadow: `You read as rigid or humorless before anyone's seen your actual range. Your steadiness gets mistaken for an absence of playfulness.`,
      invitation: `Let a little lightness show in a first meeting today.`,
    },
    5: {
      title: `Personality 5 — You Come Across as Exciting`,
      tagline: `A Design of Assumed Adventure`,
      mastery: `You land as spontaneous and interesting — someone whose life sounds unpredictable in a good way, before you've shared many details.`,
      shadow: `You read as unreliable before anyone's seen how deep your actual commitments run. The excitement people sense first eclipses the loyalty that's actually there.`,
      invitation: `Mention one long-standing commitment in a first conversation today.`,
    },
    6: {
      title: `Personality 6 — You Come Across as Warm`,
      tagline: `A Design of Instant Care`,
      mastery: `You land as caring and easy to be around — someone who already seems to want good things for people, within minutes of meeting them.`,
      shadow: `You read as needing to be needed before anyone's seen your own boundaries. Your warmth invites people to lean on you more heavily than you actually chose to offer.`,
      invitation: `State one boundary today, early, in a new relationship.`,
    },
    7: {
      title: `Personality 7 — You Come Across as Mysterious`,
      tagline: `A Design of the Unreachable Surface`,
      mastery: `You land as thoughtful and a little unreachable — clearly more going on beneath the surface than you're immediately showing.`,
      shadow: `You read as cold before anyone's earned the trust to see past it. Your genuine reserve gets mistaken for disinterest, because warmth takes longer to become visible for you.`,
      invitation: `Offer one small, genuine piece of yourself early in a new interaction today.`,
    },
    8: {
      title: `Personality 8 — You Come Across as Powerful`,
      tagline: `A Design of Unclaimed Command`,
      mastery: `You land as capable and in command — someone clearly used to being in charge, even without any formal authority yet.`,
      shadow: `You read as intimidating before anyone's seen how much you actually care underneath the command. Your strength keeps people from approaching you with anything vulnerable.`,
      invitation: `Let a moment of genuine softness show in a first meeting today.`,
    },
    9: {
      title: `Personality 9 — You Come Across as Generous`,
      tagline: `A Design of Assumed Good Faith`,
      mastery: `You land as warm and open-minded — someone who wants good things for the world, not just themselves, in a brief first conversation.`,
      shadow: `You read as naive before anyone's seen how sharp your actual read on people is. Your generosity of spirit gets mistaken for a lack of discernment.`,
      invitation: `Name one clear-eyed, discerning observation about someone today, early in the interaction.`,
    },
    11: {
      title: `Master Personality 11 — You Come Across as Inspired`,
      tagline: `A Design of the Memorable Frequency`,
      mastery: `You land as intense and a little electric — operating on a different frequency, before anyone can say why they sense it. People remember meeting you specifically.`,
      shadow: `You read as overwhelming before anyone's had time to catch up to your pace. The intensity that makes you memorable also makes new people wary of getting close too quickly.`,
      invitation: `Slow your first impression down today, on purpose, in a new interaction.`,
    },
    22: {
      title: `Master Personality 22 — You Come Across as Capable`,
      tagline: `A Design of Instant Reliance`,
      mastery: `You land as someone who could actually build the thing everyone else is only theorizing about. People hand you responsibility on first meeting that they'd normally reserve for someone known much longer.`,
      shadow: `You read as intimidating before anyone's seen your own real limits. Your evident capability makes people assume you never need help, which discourages them from offering it.`,
      invitation: `Admit one limit today, early, in a first conversation.`,
    },
    33: {
      title: `Master Personality 33 — You Come Across as Deeply Caring`,
      tagline: `A Design of Fast-Earned Safety`,
      mastery: `You land as someone genuinely safe to bring real problems to — present, kind, trustworthy in a way that usually takes much longer to establish.`,
      shadow: `You read as endlessly available before anyone's seen you have limits too. Your evident care invites an amount of leaning that isn't sustainable for you to hold.`,
      invitation: `Name one thing you need in a first conversation today, not only offering care.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();

window.DMaturityContent = (function () {
  const data = {
    1: {
      title: `Maturity 1 — Becoming Genuinely Self-Directed`,
      tagline: `A Design of Settled Authority`,
      mastery: `You grow into real, settled authority over your own path — leadership that no longer needs to prove itself to anyone, including you.`,
      shadow: `You arrive at real authority while still defending it like it's under constant threat, long after the challenge has actually stopped coming.`,
      invitation: `Lead one thing this season without needing to justify it to anyone.`,
    },
    2: {
      title: `Maturity 2 — Becoming Genuinely Balanced`,
      tagline: `A Design of Two-Sided Cooperation`,
      mastery: `You grow into real partnership — cooperation that no longer requires losing yourself to sustain it. Closeness stops costing you your own voice.`,
      shadow: `You over-adjust for everyone else's comfort out of old habit, even once genuine balance has arrived.`,
      invitation: `State one need plainly this season instead of managing carefully around it.`,
    },
    3: {
      title: `Maturity 3 — Becoming Genuinely Expressive`,
      tagline: `A Design of Substance Beside the Charm`,
      mastery: `You grow into expression with real substance behind it — creativity and voice finally allowed to be serious as well as light.`,
      shadow: `You still hide behind the performance out of old habit, even once the deeper substance is genuinely ready to be shown.`,
      invitation: `Share one serious piece of work this season without softening it into a joke.`,
    },
    4: {
      title: `Maturity 4 — Becoming Genuinely Grounded`,
      tagline: `A Design of Stability With Give`,
      mastery: `You grow into real stability — structure with enough give in it for you and the people around you to actually live inside comfortably.`,
      shadow: `You still treat flexibility as failure out of old habit, even once genuine stability no longer depends on everything staying fixed.`,
      invitation: `Change one plan this season without treating it as a defeat.`,
    },
    5: {
      title: `Maturity 5 — Becoming Genuinely Free`,
      tagline: `A Design of Chosen Freedom`,
      mastery: `You grow into freedom that's chosen on purpose, not restlessness reacting against anything that resembles commitment. Staying no longer feels like being trapped.`,
      shadow: `You still mistake restlessness for actual freedom out of old habit, even once real, chosen freedom no longer needs to prove itself through perpetual motion.`,
      invitation: `Choose one form of stability on purpose this season.`,
    },
    6: {
      title: `Maturity 6 — Becoming Genuinely Nurturing`,
      tagline: `A Design of Trust Over Control`,
      mastery: `You grow into care that no longer needs control to feel complete — love that can let people be, trusting them with their own lives.`,
      shadow: `You still need to manage the outcome of your caring out of old habit, even once real trust in other people has genuinely developed.`,
      invitation: `Release one thing this season you'd normally have managed out of love.`,
    },
    7: {
      title: `Maturity 7 — Becoming Genuinely Wise`,
      tagline: `A Design of Depth Ready to Give`,
      mastery: `You grow into understanding that's finally ready to be shared, not simply held privately. Your depth stops needing total privacy to feel safe.`,
      shadow: `You still keep real depth to yourself out of old habit, even once it's become genuinely valuable to other people and ready to be offered.`,
      invitation: `Teach one thing you know this season instead of simply knowing it privately.`,
    },
    8: {
      title: `Maturity 8 — Becoming Genuinely Powerful`,
      tagline: `A Design of Authority Without a Scoreboard`,
      mastery: `You grow into authority that no longer needs to prove its worth through output — power that can simply exist, secure in itself.`,
      shadow: `You still measure your own value purely by output out of old habit, even once real authority no longer requires that proof.`,
      invitation: `Count one thing this season as valuable that produced nothing measurable.`,
    },
    9: {
      title: `Maturity 9 — Becoming Genuinely Generous`,
      tagline: `A Design of Giving That Includes You`,
      mastery: `You grow into giving that's genuinely sustainable — care for the wider world that finally includes yourself too.`,
      shadow: `You still give until there's nothing left over out of old habit, even once real generosity no longer requires depleting yourself completely.`,
      invitation: `Keep one thing this season purely for yourself.`,
    },
    11: {
      title: `Master Maturity 11 — Becoming Genuinely Grounded Vision`,
      tagline: `A Design of Insight That Lands`,
      mastery: `You grow into inspiration that finally lands — insight actually built into something real, not staying purely conceptual.`,
      shadow: `You still stay purely in the vision without finishing the build out of old habit, even once the capacity to complete something has genuinely developed.`,
      invitation: `Complete one inspired idea this season, start to finish.`,
    },
    22: {
      title: `Master Maturity 22 — Becoming Genuinely Sustainable Power`,
      tagline: `A Design of Capacity Paired With Pacing`,
      mastery: `You grow into large-scale building that no longer costs you your own health to sustain — real capacity paired, finally, with real pacing.`,
      shadow: `You still treat rest as a threat to the scale of what you're building out of old habit, even once real sustainability has become genuinely possible.`,
      invitation: `Rest for one full day this season without guilt attached to it.`,
    },
    33: {
      title: `Master Maturity 33 — Becoming Genuinely Whole Service`,
      tagline: `A Design of Reciprocal Care`,
      mastery: `You grow into care for others that finally makes room for being cared for too — service that's become genuinely reciprocal.`,
      shadow: `You still treat your own needs as something to handle only after everyone else's out of old habit, even once real mutual care has actually become available to you.`,
      invitation: `Receive one act of care this season without deflecting it.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
