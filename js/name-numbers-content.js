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
      mastery: `You move first. You default to action once the direction's clear, and other people's hesitation reads to you as your cue to move, not a reason to slow down. Rooms that are waiting for someone to start tend to get you starting them, without needing to be asked or appointed. And you recover fast from a false start, treating it as information rather than proof you shouldn't have tried.`,
      shadow: `You do everything yourself because delegating feels riskier than just handling it. You're technically capable of leading a team and functionally incapable of trusting one with anything that actually matters, so the work quietly piles up on you alone. Underneath the solo carrying is often a fear that anything you didn't personally handle would fall short. You're exhausted from carrying what was never yours to carry by yourself, and the exhaustion rarely registers as a problem with your approach.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you handed this off. Hand one task to someone else today. Don't check it after. Notice whether the world actually falls apart.`,
    },
    2: {
      title: `Expression 2 — You Act By Bringing People Together`,
      tagline: `A Design of Genuine Alignment`,
      mastery: `You move by alignment. You notice tension before anyone names it, reading the room's actual temperature rather than what people are saying out loud. You build things better through real cooperation than through solo momentum, and that's method, not hesitation. You've learned a plan everyone actually believes in outperforms a faster one nobody's bought into.`,
      shadow: `You soften your own position until it's indistinguishable from everyone else's. You're so good at uniting people around a shared direction that your own actual stance quietly disappears from the process. Underneath the disappearing is often a fear that stating a clear position would disrupt the harmony you're actually responsible for building. Over time people stop expecting you to have a position at all, which suits your habits and slowly erases you.`,
      invitation: `Ask yourself honestly what position you've been dissolving to keep the peace. State your position clearly today, first, before smoothing it for the group. Say it before you've checked how it lands. Notice that stating it doesn't actually break the alignment.`,
    },
    3: {
      title: `Expression 3 — You Act Through Words and Presence`,
      tagline: `A Design of Visible Aliveness`,
      mastery: `You move through visible aliveness. A plan doesn't feel real to you until it's spoken out loud, tested against a real reaction, given a shape other people can respond to. Your enthusiasm is one of the most reliable tools you have for actually getting something moving, because it's contagious in a way quieter approaches aren't. You bring genuine vitality into a room just by talking about what excites you.`,
      shadow: `You talk a plan into existence and never build the thing underneath it. Momentum lives entirely in the telling, and follow-through gets perpetually delayed by the next exciting conversation about the next exciting idea. Underneath the constant talking is often a fear that the quiet, unglamorous building would expose the idea to a scrutiny the telling never has to survive. People around you learn to enjoy your enthusiasm without expecting it to convert into anything they can actually use.`,
      invitation: `Ask yourself honestly what you're avoiding by staying in the talking phase. Finish one thing today that you already talked about starting. No new audience, no new conversation about it. Notice what it feels like to let the work speak instead of you.`,
    },
    4: {
      title: `Expression 4 — You Act By Building the Structure`,
      tagline: `A Design of Real Architecture`,
      mastery: `You give ideas real shape, one verifiable piece at a time. You don't trust a plan until you can see its bones — the actual steps, the actual sequence, the actual load it needs to bear. People quietly rely on you to keep the exciting idea from collapsing on contact with reality. And you build things that actually last, thinking in the long run where most people think in moments.`,
      shadow: `You refuse to move until every detail is locked down, well past the point certainty is actually useful. You stall a genuinely good plan because it hasn't met your own standard of fully proven. Underneath the stalling is often a fear that moving before certainty would expose you to a failure diligence was supposed to prevent. The delay itself becomes a cost nobody accounts for, including you, since it feels like diligence rather than avoidance.`,
      invitation: `Ask yourself honestly what certainty you're actually waiting for that will never fully arrive. Start one structure today before it's fully planned out. Build the first piece without knowing the whole shape. Notice that starting doesn't require the certainty you thought it did.`,
    },
    5: {
      title: `Expression 5 — You Act By Moving and Adapting`,
      tagline: `A Design of Responsive Motion`,
      mastery: `You stay loose enough to change course the instant reality tells you something the plan didn't account for. That's not inconsistency — it's a real theory of how progress actually works, one that trusts responsiveness over rigid adherence to a plan. You handle unplanned change with real ease, treating a sudden shift as information rather than a threat. And you keep discovering new options other people miss precisely because you're not locked into one fixed path.`,
      shadow: `You change direction so often that nothing gets the sustained time it needs to prove itself. A whole project can end up spent perpetually mid-pivot, never actually finished, because the next better-looking option keeps arriving before the current one has been given a fair chance. Underneath the constant pivoting is often a fear of finding out the original plan wouldn't have worked. What looks like flexibility from the outside can be, from the inside, a way of avoiding that exact discovery.`,
      invitation: `Ask yourself honestly what you're avoiding finding out by pivoting again. Stay with today's plan even when a better-looking option shows up mid-stream. Resist the pull to switch. Notice whether the original plan actually gets you further than you expected.`,
    },
    6: {
      title: `Expression 6 — You Act By Taking Care of Things`,
      tagline: `A Design of Mobilized Responsibility`,
      mastery: `You move things forward by making sure the people and details around you are actually looked after. Something needing tending mobilizes you faster than personal ambition ever could. You're the one who notices what's been neglected and simply starts fixing it. And you hold real care without it curdling into control, letting people be helped without being managed.`,
      shadow: `You take on responsibility nobody assigned you, quietly expanding your own workload by managing things that were never yours to manage. You absorb tasks other people were fully capable of handling themselves. Underneath the absorbing is often a fear that leaving something untended reflects badly on you specifically. The cost accumulates in ways you rarely add up until you're depleted.`,
      invitation: `Ask yourself honestly what you're managing that was never actually yours. Let one thing go uncared-for today that genuinely isn't yours to manage. Resist the urge to check on it. Notice that it gets handled without you.`,
    },
    7: {
      title: `Expression 7 — You Act By Understanding First`,
      tagline: `A Design of Comprehension as Method`,
      mastery: `You figure things out fully before you commit to a direction. Depth is your actual method, not a delay before the real action starts. You act more effectively than most people precisely because you've already done the thinking that they're still doing while things are already in motion. And you can hold real uncertainty without needing to force premature clarity onto it.`,
      shadow: `You keep researching a decision long after you already had enough information to act on it. Analysis has quietly become its own form of avoidance, dressed up as diligence. Underneath the extra research is often a fear that acting would mean committing to an outcome you can't fully control. The extra research rarely changes the eventual decision — it mostly just postpones the moment you have to commit.`,
      invitation: `Ask yourself honestly what you're actually researching to avoid committing to. Act today on the understanding you already have. Don't wait for one more piece of confirmation. Notice that you already had enough to move on.`,
    },
    8: {
      title: `Expression 8 — You Act By Executing at Scale`,
      tagline: `A Design of Material Results`,
      mastery: `You move things forward by actually building the outcome. A plan isn't real to you until it's produced something you can point to, measure, or hand someone. You're oriented toward the material result in a way that makes you genuinely effective at converting intention into something concrete. And you take ownership of outcomes without being asked to, and people feel the safety of that ownership.`,
      shadow: `You measure every action, including your own worth, purely by output. A day that produced nothing measurable starts to feel, unfairly, like a day that failed. Underneath the measuring is often a fear that without visible output, your value would be genuinely in question. Rest, reflection, and unstructured time all get quietly devalued because they don't show up on the ledger you're keeping.`,
      invitation: `Ask yourself honestly what you're afraid is true about you on a day with nothing measurable to show. Do one thing today for a reason that has nothing to do with the result it produces. Let it stay unmeasured. Notice that the day still counted.`,
    },
    9: {
      title: `Expression 9 — You Act On Behalf of Something Larger`,
      tagline: `A Design of Purpose Over Self-Interest`,
      mastery: `You move things forward on behalf of something bigger than your own stake in the outcome. Self-interest alone rarely generates the same energy in you that genuine purpose does. You're most effective, most motivated, and most yourself when the work is clearly in service of something beyond your own gain. And that outward orientation gives your action a scope most self-interested effort never reaches.`,
      shadow: `You act on everyone else's behalf and rarely on your own. You show up fully for causes and people while your own needs wait indefinitely for their turn. Underneath the waiting is often a fear that acting purely for yourself would look selfish by comparison to the causes you serve. Because your generosity looks like strength from the outside, almost nobody notices, including you, until the depletion becomes hard to ignore.`,
      invitation: `Ask yourself honestly when you last acted purely for your own benefit without a cause attached. Take one action today purely for your own benefit. No cause required to justify it. Notice that it doesn't make you less generous.`,
    },
    11: {
      title: `Master Expression 11 — You Act On Inspiration`,
      tagline: `A Design of Heightened Insight`,
      mastery: `You act on what you sense before you can fully explain it. Inspiration hits with real intensity, and your most effective action follows that intensity rather than a slower, more deliberate plan. You're genuinely capable of moving on a hunch that turns out, later, to have been exactly right. And that speed lets you catch openings other people are still deliberating over.`,
      shadow: `You stay purely inspired and never ground the action. Brilliant ideas that never make it into the material world leave you wired, restless, and unsatisfied despite how much insight you're generating. Underneath the ungrounded inspiration is often a fear that building the actual thing would fall short of the vision. The gap between what you sense and what you build becomes its own source of frustration.`,
      invitation: `Ask yourself honestly what you're afraid the built version would fail to live up to. Turn today's insight into one concrete step, however small. Build the imperfect version instead of waiting for the perfect one. Notice that grounding it doesn't kill the insight.`,
    },
    22: {
      title: `Master Expression 22 — You Act By Building at Scale`,
      tagline: `A Design of Vision Paired With Discipline`,
      mastery: `You combine genuine vision with the discipline to actually finish building it. You're one of the rare people who can hold something enormous in your head and still care about the tedious steps that make it real. The scale doesn't intimidate you into abstraction, and the details don't bore you out of following through. And you build things meant to last, thinking in years where most people think in weeks.`,
      shadow: `You take on more than your actual capacity can sustain, treating exhaustion as evidence you're doing it correctly instead of the warning it actually is. The scale you're capable of imagining outruns the pace a human body can sustain. Underneath the overextension is often a fear that pacing yourself would mean settling for less than you're capable of. You tend to find this out the hard way, well after scaling back would have been the easier choice.`,
      invitation: `Ask yourself honestly whether your current pace matches your actual energy or just your ambition. Pace today's effort against your real energy, not the project's full eventual size. Scale back one thing that's stretching you thin. Notice that the vision survives a slower pace.`,
    },
    33: {
      title: `Master Expression 33 — You Act Through Service`,
      tagline: `A Design of Instinctive Presence`,
      mastery: `You show up for someone going through something real, offering presence most people have to learn deliberately and you carry as instinct. Your action, at its best, is genuinely felt by the person receiving it. You don't have to perform care, because it's the mode you naturally act from. And people around you feel genuinely cared for rather than managed.`,
      shadow: `You act in service of everyone until there's nothing left for you. You show up completely for other people's needs while your own quietly go unattended. Underneath the imbalance is often a fear that pausing to care for yourself would mean the service wasn't real devotion. It just accumulates, until you're running a deficit nobody else can see because you never let it show.`,
      invitation: `Ask yourself honestly when you last let someone care for you instead of the other way around. Do one thing today purely for your own care, unconnected to anyone else's need. Let it be for you alone. Notice that it doesn't diminish what you offer others.`,
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
      mastery: `You want to be the author of your own life, answering to your own judgment, moving without needing permission first. It's not dominance — it's simply not wanting to owe your direction to anyone. That want runs deep enough to shape most of your major decisions, whether or not you've ever said so out loud. And you protect that authorship fiercely, even in situations most people wouldn't think to defend it in.`,
      shadow: `You resent anyone who asks you to check in or explain yourself, even when the request is entirely reasonable. Basic accountability starts to feel like a threat to something much deeper than it is. Underneath the resentment is often a fear that explaining yourself would mean surrendering the authorship you've fought to keep. The resentment can leak out sideways, through avoidance or irritation you can't quite justify.`,
      invitation: `Ask yourself honestly what accountability actually threatens in you. Name your want for independence directly today instead of acting on it sideways through resistance. Say it plainly to someone who's asked you to check in. Notice that naming it costs you less than resisting it did.`,
    },
    2: {
      title: `Soul Urge 2 — You Crave Real Closeness`,
      tagline: `A Design of Being Truly Known`,
      mastery: `You want to be truly known, not merely agreeable — actually seen, with your contradictions and rough edges intact, and still chosen anyway. That craving runs deeper than surface sociability. You can be surrounded by people and still be waiting for the one relationship that reaches past the performance. And when someone actually reaches you, you recognize it instantly, in a way surface connection never registers.`,
      shadow: `You over-accommodate people just to keep them near, agreeing past your own comfort because losing closeness feels worse than losing yourself. You can spend years being whoever a relationship needs you to be. Underneath the accommodating is often a fear that the real version of you wouldn't actually be chosen. The strategy works right up until it produces exactly the disconnection you were trying to avoid.`,
      invitation: `Ask yourself honestly what you're afraid would happen if someone saw the unaccommodated version of you. Ask for the closeness you actually want today, instead of hoping it's noticed. Say it plainly instead of performing your way toward it. Notice that asking directly gets you closer than accommodating ever did.`,
    },
    3: {
      title: `Soul Urge 3 — You Crave to Be Truly Seen`,
      tagline: `A Design of the Real Self Beneath the Show`,
      mastery: `You want your real self, not the performed version, genuinely delighted in. Being taken seriously matters to you more than the easy laughs suggest. The entertainer people enjoy is real, but it isn't the whole of you, and you want someone to notice the difference. And when someone actually does notice, you feel it land in a way the applause never quite does.`,
      shadow: `You perform so constantly and so well that the real version stays permanently hidden. Even you start to lose track of where the performance ends and the actual person begins. Underneath the constant performing is often a fear that the unpolished version wouldn't hold the room the way the character does. The applause, however genuine, can end up feeling strangely hollow because it's landing on the character rather than on you.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you dropped the performance for a moment. Let the unpolished version of yourself show today, to at least one person. Don't cover it with a joke when it gets uncomfortable. Notice whether the room actually needed the polish.`,
    },
    4: {
      title: `Soul Urge 4 — You Crave Real Security`,
      tagline: `A Design of Solid Ground`,
      mastery: `You want solid ground — something dependable enough that you can stop bracing for it to give way. That's a genuine need, not a preference for order. The wish for stability isn't about control for its own sake, it's about finally being able to exhale. And when you do find real ground, you build on it with a steadiness few people match.`,
      shadow: `You over-control your surroundings trying to manufacture a safety no external structure can actually guarantee. Rigidity stands in for the security that was never coming from control alone. Underneath the control is often a fear that without it, the ground would give way entirely. The tighter you hold everything in place, the more exhausting the vigilance becomes, without ever quite delivering the calm you were reaching for.`,
      invitation: `Ask yourself honestly what you're actually trying to control that control can't fix. Name what actually makes you feel secure today, out loud, to someone who cares about you. Say it plainly instead of managing your environment to approximate it. Notice what it feels like to be named as a need rather than engineered as a defense.`,
    },
    5: {
      title: `Soul Urge 5 — You Crave Real Freedom`,
      tagline: `A Design of the Open Door`,
      mastery: `You want genuine room to move — the door open even when you're not walking through it. It's not instability for its own sake; it's refusing to let a choice quietly become a cage. You tend to know almost immediately when something has started to close in on you. And you can commit fully to something as long as it genuinely still feels chosen rather than sealed.`,
      shadow: `You avoid any commitment that resembles a cage, even good ones, until the avoidance itself limits your life more than the commitment ever would have. Relationships, jobs, and plans you might genuinely have wanted get preemptively declined. Underneath the declining is often a fear that testing the commitment would reveal it really was a cage after all. Your instinct reads them as confinement before you've actually tested whether they'd feel that way.`,
      invitation: `Ask yourself honestly what commitment you've preemptively declined without actually testing it. Name what freedom would specifically look like today, in concrete terms. Test one thing you've been avoiding for its resemblance to a cage. Notice whether it actually confines you or just looked like it would.`,
    },
    6: {
      title: `Soul Urge 6 — You Crave to Belong`,
      tagline: `A Design of Unearned Belonging`,
      mastery: `You want a real home — people who are unmistakably yours, built around mutual care rather than mere proximity. Underneath the caretaking is a wish to belong without earning your place every day. You want to be included simply because you're you, not because of what you've just provided. And when belonging is real and unearned, you recognize it instantly and hold it carefully.`,
      shadow: `You over-give to earn a belonging that was never meant to be conditional on your usefulness. Love and inclusion quietly turn into something you have to keep purchasing through service. Underneath the purchasing is a fear that unearned belonging doesn't actually exist for you specifically. The people around you likely never asked for that transaction — you imposed it on yourself.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you stopped earning your place. Ask to be cared for today instead of only providing it. Let someone give without you repaying it. Notice that belonging doesn't disappear when you stop purchasing it.`,
    },
    7: {
      title: `Soul Urge 7 — You Crave Real Understanding`,
      tagline: `A Design of the Real Hunger to Know`,
      mastery: `You want to genuinely understand — yourself, other people, something true beneath the surface. It's a real hunger, not idle curiosity. It keeps you circling a question long past where most people would have declared it settled and moved on. And when you do arrive at real understanding, it holds up under pressure in a way borrowed conclusions never do.`,
      shadow: `You isolate with the search for understanding instead of sharing what you're finding. Your depth becomes private and unreachable instead of something that could connect you to people. Underneath the isolating is often a fear that sharing unfinished understanding would expose it as less complete than it feels privately. The isolation can start to feel like the natural cost of thinking carefully, when it's actually a habit you could interrupt.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you shared understanding before it felt finished. Share one thing you're still figuring out today, incomplete as it is. Say it to someone specific, not into the void. Notice that the incompleteness doesn't cost you anything.`,
    },
    8: {
      title: `Soul Urge 8 — You Crave Real Impact`,
      tagline: `A Design of Undeniable Effect`,
      mastery: `You want to matter at a scale you can't dismiss — something whose effect on the world is undeniable, even to you on your most doubtful day. It's a rawer question than ambition: whether your existence has genuinely registered somewhere beyond your own head. You're willing to work at a scale most people never attempt to answer that question. And when you do achieve real impact, you can actually feel it land, rather than dismissing it instantly.`,
      shadow: `You chase achievement as proof you're allowed to exist at all. Each accomplishment offers brief relief before the question resurfaces, demanding the next one. Underneath the chase is a fear that stopping to ask what would actually be enough would mean admitting nothing ever will be. The treadmill rarely slows down long enough for you to notice the relief was never going to be permanent.`,
      invitation: `Ask yourself honestly what impact would actually satisfy you, specifically, not just generally. Name what impact would actually satisfy you today, honestly. Say the real number or the real scale out loud. Notice whether it's smaller than the treadmill has been telling you.`,
    },
    9: {
      title: `Soul Urge 9 — You Crave to Give Something That Matters`,
      tagline: `A Design of Reach Beyond Yourself`,
      mastery: `You want your care to genuinely help — to leave people and situations measurably better than you found them. Your giving rarely stays confined to your immediate circle. You're wired to notice need at a scale beyond your own household and to feel genuinely called to respond to it. And you follow through on that calling in ways most people only intend to.`,
      shadow: `You give well past the point you have anything left, running on moral momentum that outpaces your actual capacity. Giving that was meant to help starts depleting you instead. Underneath the depletion is often a fear that stopping to receive would be a small betrayal of everyone still in need. The depletion often goes unaddressed because it feels selfish to name it.`,
      invitation: `Ask yourself honestly what you actually need right now that you've been withholding from yourself. Notice today what you actually need to receive, not only what you can give. Ask for it directly from someone. Notice that receiving doesn't take anything away from the people you serve.`,
    },
    11: {
      title: `Master Soul Urge 11 — You Crave to Illuminate Something`,
      tagline: `A Design of Insight That Wants to Reach`,
      mastery: `You want your insight to genuinely reach someone — to matter beyond simply being correct. When you sense something true, wanting to share it can feel almost physical. That urgency is real, an intensity ordinary observation doesn't produce in most people. And when the insight does land, it changes something in the person receiving it, not just adds information.`,
      shadow: `You need everyone to see exactly what you see, even when they're not ready to. Well-intentioned intensity starts to feel like pressure instead of illumination. Underneath the pushing is often a fear that an insight left unreceived was somehow wasted or unreal. The people you're trying to reach can end up backing away from the very insight that was meant to help them.`,
      invitation: `Ask yourself honestly what you're afraid happens if this insight isn't received right now. Share one insight today without needing it to land perfectly or immediately. Offer it once, then let it go. Notice that it can still matter even if it doesn't land on your timeline.`,
    },
    22: {
      title: `Master Soul Urge 22 — You Crave to Build Something Lasting`,
      tagline: `A Design of Proof That Outlasts You`,
      mastery: `You want to leave something standing — real proof you were here, built at a scale that outlasts the moment of its creation. It's closer to a defining need than a passing ambition. It quietly organizes a great deal of what you choose to spend your time on. And you're genuinely capable of the sustained effort that kind of scale actually requires.`,
      shadow: `Nothing you've built ever feels big enough. An endlessly receding finish line keeps you working toward a scale of "enough" that never arrives. Underneath the receding finish line is a fear that declaring something enough would mean the building was over. Each milestone that should have satisfied the craving instead reveals the next, larger one waiting behind it.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you declared something finished. Name what "enough" would specifically look like today, in concrete terms. Say the actual number or scale out loud. Notice how close you already are to it.`,
    },
    33: {
      title: `Master Soul Urge 33 — You Crave to Heal Something`,
      tagline: `A Design of the Private Mission`,
      mastery: `You want your care to genuinely repair something — a person, a wound, a pattern broken long before you arrived. Healing isn't a nice idea for you, it's an ongoing, private mission. It shapes who you're drawn to and what you're willing to stay in the room for. And you can hold real pain alongside someone without needing to rush them past it.`,
      shadow: `You need to fix everyone around you before you can rest, treating your own peace as conditional on healing people who haven't asked you to carry that weight. The mission can quietly become compulsive, attaching itself to anyone within reach. Underneath the compulsion is often a fear that stopping would mean the mission, and maybe you, weren't real. Repair was never yours to receive from you in the first place, in most of these cases.`,
      invitation: `Ask yourself honestly whose healing you've taken on that was never actually yours to carry. Let one thing today stay unfixed by you specifically. Resist the urge to intervene. Notice that your peace doesn't actually depend on it being fixed.`,
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
      mastery: `You land as decisive and self-assured before you've said very much at all. Something in your bearing simply reads as capable. People assume, correctly or not, that you already know what you're doing, and that assumption starts working in your favor before you've had to prove anything. And rooms tend to organize around your presence almost immediately, without you needing to ask for it.`,
      shadow: `You read as unapproachable before anyone's seen the warmth underneath. People hold back from approaching you because your surface confidence looks like it doesn't need anyone. Underneath the surface is often a fear that showing uncertainty would undo the very authority you've landed with. The first impression can cost you exactly the kind of casual connection that would let people discover you're more accessible than you look.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you showed uncertainty on purpose. Let one moment of genuine not-knowing show today, in a new interaction. Say "I'm not sure" instead of defaulting to certainty. Notice that the room doesn't reorganize away from you.`,
    },
    2: {
      title: `Personality 2 — You Come Across as Gentle`,
      tagline: `A Design of Immediate Ease`,
      mastery: `You land as easy to talk to — calm, someone who clearly won't judge whatever gets said. People disclose things to you faster than they usually would to someone new. You sense an ease in your presence that most people take much longer to establish. And that same ease makes people trust you with things they wouldn't normally say out loud to a stranger.`,
      shadow: `You read as a pushover before anyone's seen how much you actually think and hold underneath the gentleness. Your softness gets mistaken for a lack of real opinion. Underneath the softness is often a fear that stating an opinion firmly would undo the ease people feel around you. People can walk over positions you actually hold firmly, simply because your delivery never signaled how firm they were.`,
      invitation: `Ask yourself honestly what you're afraid stating a firm opinion would cost you. Voice one clear opinion today, early, in a first conversation. Say it directly instead of softening it into a suggestion. Notice that firmness doesn't actually undo the ease people feel around you.`,
    },
    3: {
      title: `Personality 3 — You Come Across as Magnetic`,
      tagline: `A Design of Instant Draw`,
      mastery: `You land as fun and alive — the person a room gravitates toward before you've done anything to earn the attention. Your presence has a pull to it that most people work for and you simply arrive with. It opens doors before you've had to knock. And people remember meeting you specifically, long after they've forgotten quieter first impressions.`,
      shadow: `You read as lightweight before anyone's seen how much substance is actually there. Your magnetism overshadows your depth simply because the surface is so engaging. Underneath the surface is often a fear that showing depth too early would dim the very charm that draws people in. People can walk away entertained without ever discovering that you had something serious to say.`,
      invitation: `Ask yourself honestly what you're afraid showing real depth would cost the charm. Let one serious thought show through the charm today, early in an interaction. Say it plainly instead of wrapping it in a joke. Notice that the depth adds to the pull instead of dimming it.`,
    },
    4: {
      title: `Personality 4 — You Come Across as Solid`,
      tagline: `A Design of Immediate Trust`,
      mastery: `You land as dependable — someone whose word can be trusted without being tested first. People rely on you almost immediately, handing you responsibility on a timeline they'd normally reserve for someone they've known much longer. That trust is earned quickly because your steadiness reads as real, not performed. And people build on you without needing to double-check the foundation first.`,
      shadow: `You read as rigid or humorless before anyone's seen your actual range. Your steadiness gets mistaken for an absence of playfulness. Underneath the perceived rigidity is often a fear that showing playfulness early would undercut the reliability people are counting on. People can approach you more formally than they need to, never discovering the lighter side that's actually there.`,
      invitation: `Ask yourself honestly what you're afraid lightness would cost your reliability. Let a little lightness show in a first meeting today. Say something genuinely playful, not just polite. Notice that it doesn't make people trust you any less.`,
    },
    5: {
      title: `Personality 5 — You Come Across as Exciting`,
      tagline: `A Design of Assumed Adventure`,
      mastery: `You land as spontaneous and interesting — someone whose life sounds unpredictable in a good way, before you've shared many details. People find themselves drawn in, curious about what you might say or do next, purely from how you carry yourself. That curiosity tends to hold, because you keep delivering something genuinely new. And people rarely feel bored around you, even in ordinary moments.`,
      shadow: `You read as unreliable before anyone's seen how deep your actual commitments run. The excitement people sense first eclipses the loyalty that's actually there. Underneath the surface excitement is often a fear that revealing steady commitments would make you seem less interesting. People can hesitate to depend on you, not realizing you're far more steady underneath than your surface energy suggests.`,
      invitation: `Ask yourself honestly what you're afraid steadiness would cost your excitement. Mention one long-standing commitment in a first conversation today. Say it plainly, not as an aside. Notice that it doesn't dim how interesting you are.`,
    },
    6: {
      title: `Personality 6 — You Come Across as Warm`,
      tagline: `A Design of Instant Care`,
      mastery: `You land as caring and easy to be around — someone who already seems to want good things for people, within minutes of meeting them. That immediate warmth puts people at ease faster than almost anything else could. People remember how you made them feel long after they forget what was said. And that warmth tends to be genuine, not performed for effect.`,
      shadow: `You read as needing to be needed before anyone's seen your own boundaries. Your warmth invites people to lean on you more heavily than you actually chose to offer. Underneath the leaning is often a fear that stating a boundary early would undo the warmth people are responding to. The leaning can start almost immediately, before you've had a chance to signal what you actually have capacity for.`,
      invitation: `Ask yourself honestly what you're afraid stating a boundary early would cost the warmth. State one boundary today, early, in a new relationship. Say it plainly alongside the warmth, not instead of it. Notice that the boundary doesn't undo how cared for people feel.`,
    },
    7: {
      title: `Personality 7 — You Come Across as Mysterious`,
      tagline: `A Design of the Unreachable Surface`,
      mastery: `You land as thoughtful and a little unreachable — clearly more going on beneath the surface than you're immediately showing. People sense there's depth to access, even if they can't say exactly what it is yet. That intrigue draws the right kind of attention toward you. And what you eventually reveal tends to carry more weight because of the patience it took to reach it.`,
      shadow: `You read as cold before anyone's earned the trust to see past it. Your genuine reserve gets mistaken for disinterest, because warmth takes longer to become visible for you. Underneath the reserve is often a fear that revealing warmth too early would make it seem less genuine. Some people won't stay curious long enough to find out it's there.`,
      invitation: `Ask yourself honestly what you're afraid early warmth would cost its authenticity. Offer one small, genuine piece of yourself early in a new interaction today. Don't wait for the trust to be fully earned first. Notice that offering it early doesn't make it any less real.`,
    },
    8: {
      title: `Personality 8 — You Come Across as Powerful`,
      tagline: `A Design of Unclaimed Command`,
      mastery: `You land as capable and in command — someone clearly used to being in charge, even without any formal authority yet. Rooms adjust to your presence before you've said a word, simply on the strength of how you occupy the space. People trust your competence quickly, without needing it demonstrated first. And that trust tends to be well-founded, since you usually can back it up.`,
      shadow: `You read as intimidating before anyone's seen how much you actually care underneath the command. Your strength keeps people from approaching you with anything vulnerable. Underneath the perceived hardness is often a fear that softness shown too early would undercut your command. They can miss the warmth entirely, assuming a hardness that isn't actually the whole picture.`,
      invitation: `Ask yourself honestly what you're afraid softness would cost your command. Let a moment of genuine softness show in a first meeting today. Say it plainly instead of guarding it. Notice that softness doesn't actually undercut how capable you land.`,
    },
    9: {
      title: `Personality 9 — You Come Across as Generous`,
      tagline: `A Design of Assumed Good Faith`,
      mastery: `You land as warm and open-minded — someone who wants good things for the world, not just themselves, in a brief first conversation. People sense a generosity of spirit in you that makes them want to be around you longer. That openness draws people who might otherwise stay guarded. And they tend to stay drawn in, because the warmth doesn't fade once the first impression wears off.`,
      shadow: `You read as naive before anyone's seen how sharp your actual read on people is. Your generosity of spirit gets mistaken for a lack of discernment. Underneath the perceived naivety is often a fear that showing sharp perception too early would seem to contradict the openness people are responding to. People can underestimate how clearly you actually see them.`,
      invitation: `Ask yourself honestly what you're afraid showing discernment would cost your warmth. Name one clear-eyed, discerning observation about someone today, early in the interaction. Say it plainly alongside the openness. Notice that discernment doesn't actually undercut how generous you seem.`,
    },
    11: {
      title: `Master Personality 11 — You Come Across as Inspired`,
      tagline: `A Design of the Memorable Frequency`,
      mastery: `You land as intense and a little electric — operating on a different frequency, before anyone can say why they sense it. People remember meeting you specifically, in a way they can't quite explain, long after most first impressions have faded. The impact you leave draws people back, even when the intensity initially unsettled them. And that memorable quality tends to open doors that a quieter first impression never would.`,
      shadow: `You read as overwhelming before anyone's had time to catch up to your pace. The intensity that makes you memorable also makes new people wary of getting close too quickly. Underneath the fast pace is often a fear that slowing down would dim the very electricity people are drawn to. Some of them back away before they've had the chance to adjust to your frequency.`,
      invitation: `Ask yourself honestly what you're afraid slowing down would cost your electricity. Slow your first impression down today, on purpose, in a new interaction. Give people time to adjust to your frequency. Notice that a slower pace doesn't dim the intensity.`,
    },
    22: {
      title: `Master Personality 22 — You Come Across as Capable`,
      tagline: `A Design of Instant Reliance`,
      mastery: `You land as someone who could actually build the thing everyone else is only theorizing about. People hand you responsibility on first meeting that they'd normally reserve for someone known much longer, sensing a competence that doesn't need to be proven first. That trust tends to be well placed, since you usually can carry it. And people relax once they hand you something real, sensing it's actually in good hands.`,
      shadow: `You read as intimidating before anyone's seen your own real limits. Your evident capability makes people assume you never need help, which discourages them from offering it. Underneath the perceived limitlessness is often a fear that admitting a limit would undo the reputation for handling everything. You can end up isolated inside a reputation for handling everything.`,
      invitation: `Ask yourself honestly what you're afraid admitting a limit would cost your reputation. Admit one limit today, early, in a first conversation. Say it plainly instead of managing around it. Notice that the limit doesn't undo how capable you're seen to be.`,
    },
    33: {
      title: `Master Personality 33 — You Come Across as Deeply Caring`,
      tagline: `A Design of Fast-Earned Safety`,
      mastery: `You land as someone genuinely safe to bring real problems to — present, kind, trustworthy in a way that usually takes much longer to establish. People open up to you unusually fast, sensing that whatever they say will actually be held with care. That speed of trust is earned, because the care you offer is genuinely real. And people remember you as the one who actually listened, long after the conversation ends.`,
      shadow: `You read as endlessly available before anyone's seen you have limits too. Your evident care invites an amount of leaning that isn't sustainable for you to hold. Underneath the perceived limitlessness is often a fear that naming a need would undercut the safety people feel around you. The same warmth that draws people in can leave you quietly overextended.`,
      invitation: `Ask yourself honestly what you're afraid naming a need early would cost the safety you offer. Name one thing you need in a first conversation today, not only offering care. Say it plainly alongside the care you give. Notice that it doesn't make people feel less safe with you.`,
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
      mastery: `You grow into real, settled authority over your own path — leadership that no longer needs to prove itself to anyone, including you. The direction you set for your life stops being a claim you're defending and simply becomes the way things are. That settledness makes room for people around you to actually lead too. And you no longer need every decision to be visibly yours to feel secure in your own direction.`,
      shadow: `You arrive at real authority while still defending it like it's under constant threat, long after the challenge has actually stopped coming. The vigilance that once protected a hard-won independence outlives its usefulness. Underneath the vigilance is often a fear that dropping the defense would mean losing the authority all over again. It starts costing you relationships that were never actually trying to take your autonomy from you.`,
      invitation: `Ask yourself honestly who you're still defending your authority against that never actually threatened it. Lead one thing this season without needing to justify it to anyone. Notice the pull to explain yourself, and don't. Watch that the authority holds without the justification.`,
    },
    2: {
      title: `Maturity 2 — Becoming Genuinely Balanced`,
      tagline: `A Design of Two-Sided Cooperation`,
      mastery: `You grow into real partnership — cooperation that no longer requires losing yourself to sustain it. Closeness stops costing you your own voice. You can finally be fully present with someone else without that presence coming at your own expense. And the relationships you build now hold two full people instead of one accommodating one.`,
      shadow: `You over-adjust for everyone else's comfort out of old habit, even once genuine balance has arrived. The reflex to smooth things over outlasts the need for it. Underneath the reflex is often a fear that stating your own preference now would undo the balance you worked so hard to build. You can keep quietly disappearing into other people's preferences long after you'd earned the standing to state your own.`,
      invitation: `Ask yourself honestly what you're afraid stating a need would cost the balance you've built. State one need plainly this season instead of managing carefully around it. Say it directly, without hedging. Notice that the balance holds even when you're not the one absorbing everything.`,
    },
    3: {
      title: `Maturity 3 — Becoming Genuinely Expressive`,
      tagline: `A Design of Substance Beside the Charm`,
      mastery: `You grow into expression with real substance behind it — creativity and voice finally allowed to be serious as well as light. What you make and say stops needing to entertain its way past scrutiny and can simply stand on its own. People start responding to the substance itself, not just the performance around it. And you no longer need the charm as a shield before you'll let something serious be seen.`,
      shadow: `You still hide behind the performance out of old habit, even once the deeper substance is genuinely ready to be shown. The charm that once protected you from being taken too seriously outlives the need for that protection. Underneath the habit is often a fear that the substance alone, without the charm, might not actually hold up. It becomes a habit you keep reaching for even when it's no longer necessary.`,
      invitation: `Ask yourself honestly what you're afraid the substance alone would fail to do without the charm. Share one serious piece of work this season without softening it into a joke. Let it stand exactly as it is. Notice that it holds up on its own.`,
    },
    4: {
      title: `Maturity 4 — Becoming Genuinely Grounded`,
      tagline: `A Design of Stability With Give`,
      mastery: `You grow into real stability — structure with enough give in it for you and the people around you to actually live inside comfortably. Consistency stops being something you enforce and becomes something you inhabit. The people around you can bring you change without bracing for how you'll react to it. And that ease with change doesn't cost you any of the reliability you built your reputation on.`,
      shadow: `You still treat flexibility as failure out of old habit, even once genuine stability no longer depends on everything staying fixed. A change you could easily absorb still gets registered by some older part of you as a threat. Underneath the reaction is often a fear that one absorbed change would open the door to everything shifting at once. You defend against disruptions that wouldn't actually cost you anything.`,
      invitation: `Ask yourself honestly what you're afraid one small change would actually open the door to. Change one plan this season without treating it as a defeat. Let it happen without defending against it. Notice that the stability holds even with the change absorbed.`,
    },
    5: {
      title: `Maturity 5 — Becoming Genuinely Free`,
      tagline: `A Design of Chosen Freedom`,
      mastery: `You grow into freedom that's chosen on purpose, not restlessness reacting against anything that resembles commitment. Staying no longer feels like being trapped. You can commit to something fully and still feel entirely free inside it. And that chosen freedom holds up under real commitment in a way restless motion never could.`,
      shadow: `You still mistake restlessness for actual freedom out of old habit, even once real, chosen freedom no longer needs to prove itself through perpetual motion. You can find yourself leaving good things simply because the old reflex to leave fires automatically. Underneath the reflex is often a fear that staying would mean the freedom was never real to begin with. It fires whether or not there's still anything to escape from.`,
      invitation: `Ask yourself honestly what you're afraid staying would prove about the freedom you've built. Choose one form of stability on purpose this season. Commit to it deliberately, not by default. Notice that choosing it doesn't cost you the freedom.`,
    },
    6: {
      title: `Maturity 6 — Becoming Genuinely Nurturing`,
      tagline: `A Design of Trust Over Control`,
      mastery: `You grow into care that no longer needs control to feel complete — love that can let people be, trusting them with their own lives instead of managing the outcome on their behalf. Caring for someone stops requiring that you also direct them. The people you love get to actually live their own lives instead of a version curated by you. And your care reads as trust instead of supervision, which people feel the difference of immediately.`,
      shadow: `You still need to manage the outcome of your caring out of old habit, even once real trust in other people has genuinely developed. The instinct to steer things toward a safer result outlives the fear that originally justified it. Underneath the instinct is often a fear that releasing control would mean the care wasn't real. You keep intervening in lives that no longer need your intervention.`,
      invitation: `Ask yourself honestly what you're afraid releasing control would mean about your care. Release one thing this season you'd normally have managed out of love. Let it unfold without your intervention. Notice that your love holds without the management.`,
    },
    7: {
      title: `Maturity 7 — Becoming Genuinely Wise`,
      tagline: `A Design of Depth Ready to Give`,
      mastery: `You grow into understanding that's finally ready to be shared, not simply held privately. Your depth stops needing total privacy to feel safe. What you've spent years working out alone becomes something other people can actually draw on. And the sharing doesn't diminish the depth — it's what finally lets it matter beyond you.`,
      shadow: `You still keep real depth to yourself out of old habit, even once it's become genuinely valuable to other people and ready to be offered. The old caution about being misunderstood or exposed persists past the point where it's protecting you from anything real. Underneath the caution is often a fear that sharing the depth would expose it to a scrutiny privacy never had to survive. It mostly just keeps your understanding from reaching anyone.`,
      invitation: `Ask yourself honestly what you're afraid sharing this understanding would expose. Teach one thing you know this season instead of simply knowing it privately. Say it to someone who could use it. Notice that the depth survives being shared.`,
    },
    8: {
      title: `Maturity 8 — Becoming Genuinely Powerful`,
      tagline: `A Design of Authority Without a Scoreboard`,
      mastery: `You grow into authority that no longer needs to prove its worth through output — power that can simply exist, secure in itself. It no longer has to constantly demonstrate its own value through what it produces. People respect the authority itself, not just the output attached to it. And you carry that authority the same way on your quiet days as on your most productive ones.`,
      shadow: `You still measure your own value purely by output out of old habit, even once real authority no longer requires that proof. A day without a visible result can still trigger the old anxiety. Underneath the anxiety is often a fear that an unproductive day would reveal the authority was never actually secure. The standing you've actually built no longer depends on daily performance to remain real.`,
      invitation: `Ask yourself honestly what you're afraid an unproductive day would reveal about your worth. Count one thing this season as valuable that produced nothing measurable. Name it out loud as valuable anyway. Notice that your standing doesn't move.`,
    },
    9: {
      title: `Maturity 9 — Becoming Genuinely Generous`,
      tagline: `A Design of Giving That Includes You`,
      mastery: `You grow into giving that's genuinely sustainable — care for the wider world that finally includes yourself too. What you offer other people no longer has to come at the direct cost of your own well-being. What you're able to give lasts longer precisely because it isn't draining you to produce it. And people receive a version of your generosity that isn't quietly running on empty.`,
      shadow: `You still give until there's nothing left over out of old habit, even once real generosity no longer requires depleting yourself completely. The old pattern of self-sacrifice as the price of care outlasts the need for it. Underneath the pattern is often a fear that keeping something for yourself would make the generosity less real. You keep paying a cost that a more sustainable version of you no longer has to.`,
      invitation: `Ask yourself honestly what you're afraid keeping something for yourself would say about your generosity. Keep one thing this season purely for yourself. Don't give it away out of old habit. Notice that the generosity still counts.`,
    },
    11: {
      title: `Master Maturity 11 — Becoming Genuinely Grounded Vision`,
      tagline: `A Design of Insight That Lands`,
      mastery: `You grow into inspiration that finally lands — insight actually built into something real, not staying purely conceptual. The bridge between what you sense and what you build stops being a gap and starts being a practice you trust. What you finish now carries the full weight of both the vision and the build. And people can point to something concrete you made, not just an idea you once described.`,
      shadow: `You still stay purely in the vision without finishing the build out of old habit, even once the capacity to complete something has genuinely developed. The comfort of staying in the idea, where nothing can yet be judged or fail, keeps pulling you back. Underneath the pull is often a fear that the finished version would fall short of the vision that inspired it. It keeps pulling you back even after you've proven you can carry a project through.`,
      invitation: `Ask yourself honestly what you're afraid the finished version would fail to live up to. Complete one inspired idea this season, start to finish. Let it be imperfect rather than staying purely conceptual. Notice that the finished version still carries the insight.`,
    },
    22: {
      title: `Master Maturity 22 — Becoming Genuinely Sustainable Power`,
      tagline: `A Design of Capacity Paired With Pacing`,
      mastery: `You grow into large-scale building that no longer costs you your own health to sustain — real capacity paired, finally, with real pacing. The scale you're capable of stops requiring you to run yourself into the ground to reach it. What you build now lasts longer precisely because it wasn't built on exhaustion. And you're still standing, undepleted, once the project is actually finished.`,
      shadow: `You still treat rest as a threat to the scale of what you're building out of old habit, even once real sustainability has become genuinely possible. Slowing down still registers as falling behind. Underneath the registering is often a fear that rest would reveal the scale was never actually sustainable in the first place. The version of you mature enough to build at this scale no longer needs to prove it through exhaustion.`,
      invitation: `Ask yourself honestly what you're afraid rest would reveal about your capacity. Rest for one full day this season without guilt attached to it. Let the project sit untouched. Notice that the scale doesn't collapse without you running yourself into the ground.`,
    },
    33: {
      title: `Master Maturity 33 — Becoming Genuinely Whole Service`,
      tagline: `A Design of Reciprocal Care`,
      mastery: `You grow into care for others that finally makes room for being cared for too — service that's become genuinely reciprocal, rather than a one-directional flow that only ever moves outward from you. The service you offer now is sustained precisely because it's no longer depleting you to give it. The people you serve get to actually give something back, which deepens the relationship instead of just extending it. And you find you have more to offer, not less, once receiving becomes part of the pattern.`,
      shadow: `You still treat your own needs as something to handle only after everyone else's out of old habit, even once real mutual care has actually become available to you. People around you are often ready to give back long before you're willing to let them. Underneath the reluctance is often a fear that receiving would mean the service wasn't genuine devotion. The old sequencing keeps you from receiving what's already on offer.`,
      invitation: `Ask yourself honestly what you're afraid receiving care would say about the service you offer. Receive one act of care this season without deflecting it. Let it land instead of redirecting it outward. Notice that receiving doesn't undo the devotion.`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
