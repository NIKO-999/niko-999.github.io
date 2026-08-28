'use strict';
/*
 * ideal-partner-content.js — second-generation overlay.
 *
 * Layered on top of js/ideal-partner-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DIdealPartnerContent — 22 records
(function () {
  const prev = window.DIdealPartnerContent;
  const T = {
    "data": {
      "1": {
        "title": "Ideal Partner 1 — Someone Who Also Moves First",
        "fields": [
          {
            "label": "MOTION MEETS MOTION",
            "text": "You move first without checking whether the moment is right, so plans you make with somebody arrive as events instead of topics. Independence in another person pulls you toward them instead of worrying you, and nothing in you wants a partner kept smaller for your own comfort. Conversation goes somewhere with you because you push on an idea instead of politely receiving it and changing the subject. You are at your best beside somebody who starts things too, since nothing between you then has to be dragged into existence. You build a shared life at full speed, and you grow inside a relationship instead of quietly settling into one."
          },
          {
            "label": "WHOSE PLAN WON",
            "text": "Two people set on moving first will eventually move opposite ways on the same afternoon, and the contest starts exactly there. Competition slips into the space partnership was meant to occupy, and you quietly track whose plan the week actually followed. The independence you both defend sets into two separate lives sharing an address, with neither of you slowing down to ask how the other is doing. Your standing as a partner rests on carrying your own weight and never being the drag on anybody's momentum. Below all of it you dread absorption, waking up as somebody's passenger with your own direction quietly retired. The relationship stops being tended long before either of you would call it finished."
          },
          {
            "label": "FOLLOW THEIR PLAN",
            "text": "Follow their plan once this week, exactly as they made it, without amending a single part of it along the way. Pick something large enough to have a wrong version, not a restaurant on a Thursday. Ask out loud before Sunday how they have actually been, and stay silent for the whole answer."
          }
        ]
      },
      "2": {
        "title": "Ideal Partner 2 — Someone Who Reads You Without Being Told",
        "fields": [
          {
            "label": "KNOWN WITHOUT NARRATION",
            "text": "Closeness with you gets built quietly, without either person having to narrate the relationship for it to be real. You register the shift in somebody before they have decided to mention it, and you wait instead of interrogating them. Space is something you give without withdrawing behind it, which is a specific skill and not simply a temperament. Understanding somebody deeply matters more to you than understanding them fast, so nothing needs explaining twice for you to stay close. Being unguarded is possible around a person who will not rush or flatten what they find in you. You reach a depth of safety inside a relationship that usually takes years, and you reach it in the first month."
          },
          {
            "label": "NOTICED, NEVER MENTIONED",
            "text": "Sensing everything and saying almost nothing is the failure available to you, and you are extremely good at the first half of it. Small hurts go unnamed because you assume they were noticed and forgiven, and instead they collect somewhere neither of you looks. Respect for space widens into distance nobody chose, and nothing is ever explicitly wrong enough to force the conversation. Your private worth rides on how little you require, on having understood before a single thing was explained. What you flinch from is being work, a plain request turning you into somebody's chore. You would rather sit inside a wrong assumption than check it and discover that you were needy after all. The relationship can drift for years while you feel every inch of the drift and mention none of it."
          },
          {
            "label": "USE ACTUAL WORDS",
            "text": "Name one small thing directly this week, in plain language, within a day of noticing it. Choose something you would normally file as too minor to raise, and say it as a sentence instead of a mood. Give it no preamble, no apology in front of it, and no offer to drop the subject. Mark the date you said it, then say the next one sooner than that."
          }
        ]
      },
      "3": {
        "title": "Ideal Partner 3 — Someone Whose Warmth Is Unmistakable",
        "fields": [
          {
            "label": "GENEROSITY WITHOUT RATIONING",
            "text": "You give warmth without keeping score of it, offering it first rather than saving it as a reward for good behaviour. You want a life with texture in it, so what gets built between you has beauty in it and not only function. Affection reaching you reliably works as a given and not a variable, and you stop bracing the moment it becomes dependable. Much of your own generosity only comes back once it stops being defended, and the change is obvious from the inside. You make a home with real texture in it, and you fill it without waiting to be asked twice."
          },
          {
            "label": "TOO NICE TO DISTURB",
            "text": "Care given this constantly stops being counted, by you first and then by everybody living in the house. Comfort turns into the purpose, and a partnership organised around pleasure loses its appetite for anything difficult. Difficult conversations get postponed because the atmosphere is too pleasant to spoil, and resentment sets underneath while nothing looks wrong. Warmth is the part of you that you privately count as valuable, and everything else about you feels negotiable beside it. Running under that is a suspicion that the giving is the only reason anybody stays, and that one cold week would settle the question. What was generous slowly becomes indulgent, and nobody in the house volunteers to say so."
          },
          {
            "label": "SAY IT WHILE GOOD",
            "text": "Raise the uncomfortable thing this week, while the mood is good and nothing has gone wrong enough to justify it. Pick the one you have been leaving unsaid specifically so the evening stays pleasant. Say it at the start of the evening instead of the end, and do not follow it with a joke. Give yourself a day for it now and keep that day even if everything is going well."
          }
        ]
      },
      "4": {
        "title": "Ideal Partner 4 — Someone Who Actually Holds",
        "fields": [
          {
            "label": "NO BACKGROUND CALCULATION",
            "text": "Reliability is what you actually require, meaning that what somebody says will happen is what then happens without further management. You stop running the constant calculation about whether the ground will hold, and that frees an enormous amount of attention for everything else. Steadiness beside you is not comfort, it is the base you take real risks from, which is the entire purpose of having one. You build things that survive contact with reality, and years in you hold something most couples are still trying to begin."
          },
          {
            "label": "ROLES NOBODY REVIEWED",
            "text": "Structure this dependable becomes the whole relationship, and the roles you each fell into stop being chosen at some point nobody marks. Neither of you notices when they stopped fitting, because so little is visibly wrong that the case for changing anything never gets made. Protectiveness runs in both directions, and yours slides into deciding things on somebody else's behalf that were never yours to decide. Stability starts to look exactly like nothing ever changing, and you defend that sameness as maturity. The evidence you keep of a decent life is that nothing has fallen over on your watch. Underneath is a horror of instability, of years of careful building coming apart across one bad season. You would rather live inside an arrangement that no longer fits than reopen it and watch it wobble."
          },
          {
            "label": "REOPEN A WORKING ARRANGEMENT",
            "text": "Reopen an arrangement this week that was settled years ago and has not been looked at since, even though nothing about it is broken. Say out loud which part of it you would write differently now, and give the sentence no cushioning at either end. Fix a specific evening for that conversation instead of leaving it to come up on its own."
          }
        ]
      },
      "5": {
        "title": "Ideal Partner 5 — Someone Who Means It",
        "fields": [
          {
            "label": "PROMISES THAT MEAN SOMETHING",
            "text": "Loyalty in the unglamorous sense is what actually holds you, and you mean it during the months when it costs something. Your values are explicit, you know what you believe, and you live close enough to it that the gap needs no managing. Commitment is something you are ready for instead of something you perform readiness about on the good weeks. Tradition carries weight with you, whether it came down to you or you built it from nothing beside somebody. You are not renegotiating the basics every season, which frees an extraordinary amount of energy for the actual living. You make a promise you can both rely on, and you go on knowing what the staying is for."
          },
          {
            "label": "SERVING THE FRAMEWORK",
            "text": "Principles end up receiving the devotion the person was meant to get, and you serve the arrangement instead of them. Questioning any part of the framework feels like betrayal instead of maintenance, so it goes unquestioned for years at a stretch. Duty replaces desire quietly, and a bond held together by conviction alone gets very tired without either of you admitting it. Your sense of yourself as a decent person rests on having honoured what you signed up to, whatever it has since become. Running beneath is the horror of turning into somebody who breaks things, so the commitment outlives the thing it was protecting."
          },
          {
            "label": "ASK WITHOUT THE RULE",
            "text": "Ask them this week what they would want between you both if no rule required anything at all. Sit with your own answer to that same question first, in writing, before the conversation happens. Give the answer you actually have instead of the one your principles would prefer you to hold. Do it on an ordinary evening with nothing currently going wrong and no anniversary attached. Keep what you wrote, and read it again when the next season starts."
          }
        ]
      },
      "6": {
        "title": "Ideal Partner 6 — Someone Who Chooses You On Purpose",
        "fields": [
          {
            "label": "WANTED ON PURPOSE",
            "text": "Deliberate wanting is what lands with you, and being chosen consciously registers where drifting into a default never will. You learn what a partner feels from them saying it, not from deduction, and you offer the same back without being asked. Romance matters to you when it is specific, and it survives ordinary life because you tend it instead of assuming it. Difficulty gets addressed with you while small, since a hard conversation is not an emergency in your hands. You can say exactly why you are in this, and you keep choosing it in language instead of by default."
          },
          {
            "label": "THE RELATIONSHIP UNDER REVIEW",
            "text": "Examining the relationship starts to replace living inside it, and every difficulty becomes a matter for discussion. Choosing each other daily turns into auditing each other daily, which exhausts both of you and is hard to tell apart from doubt. Romance starts requiring maintenance at a level that leaves neither of you resting in it for a single week. You judge yourself on how conscious you are, on never having sleepwalked into anything you had not examined first. Drift is what you cannot stomach, waking into a life nobody ever asked whether you wanted. So nothing gets left alone, and the examining eats the ordinary pleasure it was meant to protect."
          },
          {
            "label": "LEAVE ONE FRICTION ALONE",
            "text": "Let one small friction pass this week entirely unexamined, and see whether it is still there by Saturday. Choose which one on Monday, so the choosing is not a mood you talked yourself into on the night. Spend an evening where nothing about your relationship gets discussed at all."
          }
        ]
      },
      "7": {
        "title": "Ideal Partner 7 — Someone Going Somewhere",
        "fields": [
          {
            "label": "TOGETHER, NOT MERELY NEAR",
            "text": "Ambition is what you respond to in somebody, and you want a partner headed somewhere with the drive to actually arrive. Movement in you gets supported instead of resisted, and you give the same when a partner wants to change something large. Shared wins mean something real to you, since winning beside somebody is different from winning near them and you can feel the difference. You celebrate properly, which plenty of driven people never learn to do at all. Neither ambition has to be apologised for around you, so you operate closer to full capacity than you would alone. You point at real things that exist only because you were both aimed the same way."
          },
          {
            "label": "TIRED AND UNNOTICED",
            "text": "Progress becomes the only thing the relationship is organised around, and sitting still starts to register as a fault. Rest gets treated as a lull to be tolerated, and you lose the ability to simply be somewhere with nothing being achieved. When your directions diverge, and eventually they do, everything you built together was built for agreement and handles nothing else. A hard season with nothing to show for it lands as the relationship failing instead of a hard season. Achievement is the proof you keep for yourself that you are worth the space you take up in somebody's life. Under it sits a dread of being unremarkable, of learning what you are worth in a week when you produced nothing. Neither of you slows down long enough to notice how tired the other has become."
          },
          {
            "label": "AN EVENING WITHOUT PURPOSE",
            "text": "Take an evening this week with no purpose attached to it and refuse to fill it with planning. Fix it in the diary as an appointment, so it cannot be traded away for something more productive. Do nothing you could later describe as useful, and leave the subject of next week alone. Choose the day tonight, before the week fills itself with better uses for it."
          }
        ]
      },
      "8": {
        "title": "Ideal Partner 8 — Someone Straight With You",
        "fields": [
          {
            "label": "NOTHING TO DECODE",
            "text": "Fairness with you does not bend toward whoever is most upset in the room, and it holds when the fair answer costs you. Honesty is not a policy you announce, it is what you do on the occasions when the truthful version is expensive. Nothing about your mood needs decoding, so a disagreement stays about the actual disagreement and finishes there. You raise a difficult thing without setting off a week of fallout, and you keep every agreement exactly as it was made."
          },
          {
            "label": "SCRUPULOUS AND LONELY",
            "text": "Fairness held tightly enough turns into accounting, and the relationship starts running on who did what and whether it balanced. Generosity is the casualty, because a gift that settles a score is not a gift and both of you can tell. Balance turns into flatness, with both of you so committed to being reasonable that nothing is ever said with heat in it. Being right is what you would defend about yourself first, and it quietly outranks being close to anyone. Underneath is the prospect of owing somebody, of being called unfair and having them be right. Love is not an even exchange, and you can be exactly fair and still lonely for years inside it."
          },
          {
            "label": "GIVE WITHOUT EVENING IT",
            "text": "Give something this week that is not owed and settles nothing, then say nothing about it afterwards. Choose something inconvenient enough to cost you an hour you had planned to spend another way. Refuse to keep the mental note, and refuse to raise it next time something is unequal. Do it on a day when you are already slightly behind on everything else. Let the imbalance stand for a month without correcting it in either direction."
          }
        ]
      },
      "9": {
        "title": "Ideal Partner 9 — Someone Who Doesn't Need Filling",
        "fields": [
          {
            "label": "ARRIVING WITH SOMETHING",
            "text": "You arrive whole and expect the same of any partner, since being completed by somebody else is not the arrangement you want. Solitude gets respected in both directions with you, and a partner needing distance does not register as rejection. Time apart damages nothing, so time together is chosen on each occasion instead of required to keep anything alive. Your conversations arrive somewhere most relationships never get to, because you both turn up with something to bring. You build a connection that survives long gaps, and you build it without needing it to carry who you are."
          },
          {
            "label": "GOOD AT NOT NEEDING",
            "text": "Independence hardens into habit, and two self-sufficient adults can get so good at managing alone that they stop reaching at all. Contact thins month by month until there is barely anything left to maintain, and depth without frequency is occasional good company. Neither of you raises the alarm, because neither of you is uncomfortable, and that comfort is the actual danger. Requiring nothing is what you grade yourself on, the standing proof that you are nobody's weight to carry. Lying under it is a dread of dependence, of asking for something plainly and hearing no. You can lose a real connection this way without either person doing a single thing wrong."
          },
          {
            "label": "NEED THEM ALOUD",
            "text": "Reach for them this week at a moment you would normally handle alone and never mention. Say the need in the present tense, as a request, and attach no reason that lets them off. Pick the moment in advance, and let it be a small thing instead of a crisis."
          }
        ]
      },
      "10": {
        "title": "Ideal Partner 10 — Someone Who Bends With It",
        "fields": [
          {
            "label": "SURVIVING THE UNPLANNED",
            "text": "Flexibility is what you genuinely run on, so circumstances change and you change with them instead of digging in and calling it principle. Optimism in you is grounded, which keeps the hard stretches from calcifying into bitterness while you wait them out. A move, a loss, a reinvention: you reorganise and carry on where a great many couples fracture. Neither of you needs life to stay recognisable to feel secure, so a partner becoming somebody new does not end it. Shifts do not require a culprit with you, which removes most of the damage change usually does. You grow through the cycles beside somebody and come out the far end of decades still together."
          },
          {
            "label": "ABSORBED, NEVER SOLVED",
            "text": "Adapting around a problem is not the same as solving it, and you are very practised at the first thing. Every difficulty gets absorbed, reframed and moved past, so nothing gets dealt with properly and the matter never closes. Taking a firm position starts to feel rigid to you, which leaves the relationship without any shape at all. Your own measure of yourself is how little the year can break you, how much you absorb without complaint. Beneath it runs a dread of the fixed thing, of stating a position and being stuck holding it while everything else moves. You can weather a decade together and still never have the conversation that actually mattered."
          },
          {
            "label": "TAKE ONE FIRM POSITION",
            "text": "Name the problem this week that the two of you have adapted around so often you stopped calling it a problem. Put it as a position instead of an observation, using the word no if the word no is what you mean. Refuse the reframe for the length of that conversation, even when a kinder version is right there. Do it before Thursday, while the last adjustment is still recent enough to point at."
          }
        ]
      },
      "11": {
        "title": "Ideal Partner 11 — Someone With Real Heat",
        "fields": [
          {
            "label": "BOTH GET LARGER",
            "text": "Passion in you is warm-blooded instead of merely intense, and it attaches to particular things and particular people. You hold your own feelings and somebody else's at full volume without being knocked over by either. Support from you builds a partner instead of sheltering them, and you actively want the confidence you are encouraging. You get bigger when the person beside you does, and you live a larger life than you would have alone."
          },
          {
            "label": "ENCOURAGEMENT AS PRESSURE",
            "text": "Two strong adults escalate fast, since neither one backs down and both can take considerably more than most. Arguments go further than either of you intended, and the damage gets done by stamina instead of cruelty. Mutual encouragement turns into mutual pressure, where resting looks like letting the other one down. Peaceful weeks get read as something going wrong, so intensity gets manufactured to confirm the thing is still alive. Your own estimate of yourself runs on what you can withstand and how much you lift somebody while withstanding it. What you cannot look at is being weak in front of them, so you never ask for the gentler version of anything. You wear each other out while sincerely trying to build each other up."
          },
          {
            "label": "OFFER EASE INSTEAD",
            "text": "Offer ease this week instead of encouragement, without a single suggestion about how their day could be better spent. Take one evening where neither of you improves anything, and let the quiet stay unremarkable. Ask for the easy version of something yourself, out loud, once before the weekend."
          }
        ]
      },
      "12": {
        "title": "Ideal Partner 12 — Someone Who Can Sit With It",
        "fields": [
          {
            "label": "PRESENT WITHOUT FIXING",
            "text": "Compassion in you is practical, so you stay present to something hard without reaching immediately for the repair. Patience runs on a timescale most others cannot manage, and you hold a slow middle stretch without pushing it to move faster. Empathy is different from sympathy in your hands, because you go in beside somebody instead of commenting from a safe distance. A partner is allowed to be in process around you, and nothing about the mess disqualifies them from being loved. You go through things with somebody and stay through seasons that would finish most pairings."
          },
          {
            "label": "KINDNESS WITH NO DEADLINE",
            "text": "Patience with no end on it becomes permission for nothing to change, and the waiting turns into the entire relationship. The growth you were both being patient about quietly stops happening, and the patience carries on regardless. Compassion slides into carrying somebody who has stopped carrying themselves, and you take the extra weight without mentioning it once. Your worth attaches to how much you can hold, and naming a limit feels like the kindness itself failing. Below that you dread being the harsh one, the person who made a demand and broke something that was working. You can spend years beautifully supporting a situation that needed a deadline instead of an ally."
          },
          {
            "label": "ATTACH A REAL DATE",
            "text": "State plainly this week what you need to see change, and put an actual date on it. Choose whatever you have stayed patient about longest, and say the sentence straight, with nothing placed ahead of it to cushion the landing. Keep that date visible, and let it arrive without renegotiating the terms beforehand. Say the whole thing in one conversation instead of laying groundwork across three. Decide now what you will do on the day if nothing has moved."
          }
        ]
      },
      "13": {
        "title": "Ideal Partner 13 — Someone Unafraid of the Ending",
        "fields": [
          {
            "label": "RENEWED, NOT PRESERVED",
            "text": "Endings do not register as failure to you, so change that ends most couples finds you still standing in it. You let a version of things die without treating the death as catastrophe, and you say the sentence that changes the situation. Honesty at a level most relationships never reach is available with you, sometimes bluntly and usually usefully. A partner can become an entirely different person and still be with you, because the bond was never attached to a fixed version of them. You do the same in return, which is the freedom most couples quietly refuse each other. You renew what you have instead of preserving it, and you keep the thing alive by letting it change."
          },
          {
            "label": "DEMOLITION OVER REPAIR",
            "text": "Demolition arrives where repair would have done, and the reflex to transform takes down things that were working. Difficulty gets met as a signal to end instead of a thing to mend, and you reach fast for the clean break. Honesty without tenderness turns into a weapon, and it lands hard between two adults who can both absorb a hit. Courage is the trait you privately rank first in yourself, specifically the willingness to end what is easier to prolong. What you avoid is the slow stretch, the months where nothing is resolved and you have to sit inside it. The cycle of ending and rebuilding becomes the relationship itself, exciting and exhausting in roughly equal measure. Not everything hard is finished, and you are slow to tell those two apart."
          },
          {
            "label": "MEND ONE THING",
            "text": "Repair one thing this week that you would normally have torn down and started again from nothing. Choose whichever one you have already privately decided is over, and give it thirty days before acting on that decision. Write the date thirty days out and say nothing about ending it until you get there. Do the dull maintenance version instead of the dramatic one, even where the dramatic one is faster."
          }
        ]
      },
      "14": {
        "title": "Ideal Partner 14 — Someone Who Levels You Out",
        "fields": [
          {
            "label": "SETTLED IN THE BODY",
            "text": "Calm is what actually settles you, and it has to be genuine instead of a composed surface over something tense. Differences get blended into something workable around you instead of being sharpened into positions and defended. You support the slow kind of healing, the sort that takes years and never announces itself as progress. You build for the long run from the first week, and you steady somebody simply by being steady near them."
          },
          {
            "label": "PEACE THAT COSTS WANTING",
            "text": "Harmony maintained this carefully becomes avoidance with good manners on it, and the disagreement never gets its hearing. Real difference gets smoothed before it has fully surfaced, and you do the smoothing without noticing you decided to. Calm flattens into an absence of appetite, and neither of you willingly disturbs a peaceful evening. Balance quietly means nobody gets what they strongly want, because wanting strongly would unbalance what you are both protecting. You take pride in never being the source of trouble, and a peaceful house is the evidence you point to. What you cannot risk is rupture, the raised voice that does not come back down and takes everything with it. You can be entirely at peace and slowly bored, and you can both feel it long before either says so."
          },
          {
            "label": "SAY IT UNTRIMMED",
            "text": "Say the thing you softened this week at its original strength, without trimming it for the atmosphere. Pick something you actually want instead of something that needs fixing, and ask for it as a want. Let the discomfort sit through the whole evening without repairing it for anybody. Choose the day before Friday and hold to it even if the week has been lovely. Use the same volume you would use for a fact about the weekend."
          }
        ]
      },
      "15": {
        "title": "Ideal Partner 15 — Someone Who Wants Without Grasping",
        "fields": [
          {
            "label": "APPETITE WITHOUT STRINGS",
            "text": "Appetite is central with you, since you live embodied instead of from the neck up and never apologise for the force of it. Emotional intensity does not get diluted to seem reasonable, so what other couples suppress is simply available here. You want somebody fully and are not diminished by not having them at any particular moment, and the intensity stays safe because of that. There is real honesty about wanting in you, for a person and for things and for a life, and it is rare and freeing. You keep a relationship charged for years, and you meet somebody at full strength without losing yourself in the meeting."
          },
          {
            "label": "GRIPPED, NOT CLOSE",
            "text": "Intensity gets mistaken for closeness, and the charge becomes the measure of whether the relationship is any good. Quiet stretches read as decline and get inflamed on purpose, so calm weeks are never simply allowed to pass. Conscious desire slips into dependency, on each other and on whatever keeps the volume up between you. Possessiveness arrives dressed as passion and is very hard to name correctly from inside it. Wanting at that size is where you privately locate your own value, so a flat week arrives as a verdict. You dread being ordinary to somebody, the quiet affection that no longer needs you specifically to be there."
          },
          {
            "label": "AN UNCHARGED EVENING",
            "text": "Spend one evening this week where nothing is charged, and notice what is left in the room. Do not raise the temperature when it dips, and let a dull hour finish as a dull hour. Say one plain, unglamorous thing you appreciate that is unconnected to desire. Pick a night before Sunday and keep that night whatever kind of day it has been."
          }
        ]
      },
      "16": {
        "title": "Ideal Partner 16 — Someone Who Rebuilds",
        "fields": [
          {
            "label": "STEADY WHEN IT BREAKS",
            "text": "Collapse does not send you looking for the exit, and you stay in a room where the situation is coming apart. You rebuild after a crisis instead of being defined by one, and you support somebody during the change and not only afterwards. A hard truth does not make you flinch, whether it is yours or aimed squarely at you. Problems get named around you while they are still solvable, because honesty costs you less than comfort does. You hold something that has been tested, and you rebuild instead of scattering when it breaks."
          },
          {
            "label": "TURBULENCE ON DEMAND",
            "text": "Crisis is where you function best, and a pairing excellent in crisis starts needing one to feel like itself. Ordinary uneventful life goes strangely flat, and turbulence gets generated to restore the sense of purpose. Honesty without timing turns into bluntness that wounds more than it clarifies, and you deliver it anyway. Your value, as you count it, is what you can survive, so a calm month leaves you with nothing to point at. Under that is the terror of the flat version of yourself, the one with no emergency to be good in. Rebuilding constantly can mean never actually living inside the thing you built. You can be superb at surviving together and completely unpractised at being happy."
          },
          {
            "label": "AN UNEVENTFUL AFTERNOON",
            "text": "Do something together this week that contains no problem at all and requires nothing to be fixed. Choose an ordinary afternoon and refuse to spend it on repairs, planning, or a difficult subject. Notice how fast you want to introduce a problem, and let the afternoon end without one."
          }
        ]
      },
      "17": {
        "title": "Ideal Partner 17 — Someone Who Believes In You Out Loud",
        "fields": [
          {
            "label": "HANDED SOMETHING UNFINISHED",
            "text": "Encouragement lands on you the way instruction never does, and it changes what you attempt next. You can hand over something half-formed, a plan with holes in it, without making it presentable first. Hope that has been decided rather than merely felt is the kind you can use, because it survives contact with whatever is genuinely bad in the situation. You would rather be known accurately than admired for something tidier, and that preference decides who you keep close. You act on belief instead of storing it, which is why your plans keep getting larger."
          },
          {
            "label": "WARMTH INSTEAD OF SCRUTINY",
            "text": "Encouragement becomes automatic, and once automatic it carries no information, so a real problem meets warmth when it needed inspection. Gentleness runs both ways and costs both ways: the blunt sentence that would have saved months goes unsaid, and you stop expecting to hear it about yourself either. You grade yourself on how much lift you hand somebody in an hour, and a discouraging day lands as a personal failure. What you will not face is that your real opinion weighs more than people can hold, and stating it would end things. So you idealise, and are idealised back, which holds perfectly until one of you has an ordinary bad year. Constant belief is also a weight, and you carry the version pointed at you without ever saying it is heavy."
          },
          {
            "label": "THE REALISTIC SENTENCE",
            "text": "Pick the person whose plan you have been cheering for and work out, on paper, which part of it will not hold. Tell them that part inside two days, kindly, without a compliment wrapped around it to soften the landing. Say the hopeful thing afterwards if it is true, but say it second and say it as a separate sentence. Keep the encouragement everywhere else that week; the point is not withdrawing warmth, it is stopping warmth standing in for a view."
          }
        ]
      },
      "18": {
        "title": "Ideal Partner 18 — Someone Who Isn't Frightened By Depth",
        "fields": [
          {
            "label": "NOTHING TO TRANSLATE",
            "text": "Feeling is the register you live in, so a conversation held on the surface costs you more than one going straight down. You read what somebody means before they have finished finding words for it, and you are right often enough to trust the read. Complicated things need no simplifying before you sit with them, and heavy emotion, yours or somebody else's, does not send you out of the room. You take people to a depth most relationships have no equipment for, and you get there within the first few hours."
          },
          {
            "label": "EVERY MOOD IS EVIDENCE",
            "text": "Two people living this far down can lose the surface completely, and a relationship with no surface left has nowhere to rest. Everything acquires significance, every mood is read as a message, and the intensity that felt like closeness becomes exhausting. Intuition slides into assumption with no visible moment where it happened, and neither of you ever checks the reading. A bad fortnight becomes a verdict on the whole thing, because how it feels today is your most reliable information. Naming accurately what has not been said is how you know you are worth having near, and misreading somebody drains you further than an argument would. The suspicion you keep away from is that if you had to ask rather than simply know, you would be ordinary company. What was meant as closeness becomes something neither of you can leave, slowly enough that nothing announces it."
          },
          {
            "label": "ASK THE CERTAIN THING",
            "text": "Pick one thing you're sure a close person is feeling and say it to them directly this week, before acting on the reading. Ask as a real question, not a check on an answer already written, which means being willing to hear something that does not match. Note the gap between what they said and what you had assumed, in a line, on the same day."
          }
        ]
      },
      "19": {
        "title": "Ideal Partner 19 — Someone Genuinely Glad",
        "fields": [
          {
            "label": "GLADNESS WITHOUT A PROJECT",
            "text": "Happiness that costs nothing to maintain restores you, and you tell it from the manufactured version within minutes of arriving. Cheer produced on purpose registers as work, however well done, and leaves you tired where plain company does not. Around the uncomplicated kind you stop managing your own mood, and everything saved from that goes into making something. Play is not a reward scheduled after the serious business; it is how you think, so jokes and half-built projects share one source. You want happiness shared rather than run in parallel, so a good evening is one where both of you were actually in it. You put colour into ordinary weeks without being asked to."
          },
          {
            "label": "GRIEF GOES UNDERGROUND",
            "text": "A life arranged around gladness has nowhere to put the days that are not glad, so grief gets hidden instead of brought in. Positivity turns compulsory without anybody deciding it should, and the job of making an evening heavier falls to nobody. Depth gets traded for brightness a little at a time, and what remains is lovely, easy, and thinner than you want to admit. You treat being easy to be around as proof you are doing this correctly, and a flat week registers as a lapse in character. Underneath is something plainer and worse: the unhappy version of you seems less lovable, and showing it would settle the question."
          },
          {
            "label": "THE UNLIGHTENED VERSION",
            "text": "Tell one close person about the matter you have stayed cheerful about, this week, and stop before the part where you make it fine again. No summary at the end, no joke to release the pressure, no reassurance that you are basically all right. Do it in person if that is available and otherwise on a call, where tidying is harder than in writing."
          }
        ]
      },
      "20": {
        "title": "Ideal Partner 20 — Someone With a Reason",
        "fields": [
          {
            "label": "POINTED THE SAME WAY",
            "text": "Meaning is not a topic for you, it is what you organise around, and life with no reason behind it goes flat inside a month. You take the large questions seriously enough to let them change your arrangements, rather than only to discuss them well. Conversation with you reaches what matters early, and the detour does not have to be justified before it is allowed. You support somebody at the level of who they are becoming, not what they produce, and hold them there when comfort would be easier. You choose work that matters past the two people doing it, and you have arranged your life so that you can."
          },
          {
            "label": "COLLEAGUES IN MEANING",
            "text": "A relationship this purposeful forgets to be a relationship, and the forgetting looks like dedication from inside. The mission becomes the point, so the two of you turn into colleagues in significance rather than people delighting in each other. Growth hardens into an expectation, and an ordinary season where nothing in you transforms reads as time lost. Judgement creeps in, the hardest kind to name, about whether somebody is living up to what they said they were for. How much of you has changed this year is what settles whether the year counted, so a flat month feels like a moral problem instead of a rest. What you avoid looking at is that without the calling you would be unremarkable company, and plain affection is the consolation prize."
          },
          {
            "label": "AN AFTERNOON OFF DUTY",
            "text": "Book a Saturday afternoon this month for something with no return in it: a bad film, a game you are poor at. Choose it yourself instead of offering options and waiting to be steered, and block it out with a start time like anything else that matters. When you catch yourself asking what the afternoon is teaching you, notice the question and go back to the film. Do not write it up afterwards, for anybody, including yourself."
          }
        ]
      },
      "21": {
        "title": "Ideal Partner 21 — Someone With a Wide World",
        "fields": [
          {
            "label": "NOTHING SHRINKS TO FIT",
            "text": "Breadth holds your interest, and a world that stops at your own street loses your attention inside a year. Somebody else expanding does not read as a threat, so you watch a person grow without needing to be told where you fit. Freedom and commitment are not opposites in your hands: you promise years and still write no rule about where either of you goes. You keep choosing the version of a life that has somewhere further to go in it."
          },
          {
            "label": "ROOM THAT BECAME DISTANCE",
            "text": "Freedom protected this carefully turns into distance neither of you chose, and it arrives without an argument to mark the moment. The wide life leaves little that is specifically and daily shared, so the vision stays out ahead while ordinary closeness goes untended. Asking for more of somebody feels like asking them to be smaller, so the request goes unmade and silence passes for agreement. You count yourself well only while something is expanding, a plan or a route or an idea, and maintenance registers as having shrunk. The thing you will not look at is that being needed daily might be where being reduced begins, and you keep the room instead of finding out."
          },
          {
            "label": "ONE DOMESTIC REQUEST",
            "text": "Ask a close person for one small ordinary thing this week: a standing Wednesday dinner, ten minutes of their morning. Make it specific and repeating rather than large and one-off, because repetition is what you skip. Put it as a request in plain words and leave off the clause about how it is fine if they cannot. Notice, while the words come out, how much you want to convert it into a bigger and more interesting plan. Say the small version anyway, and say it before the weekend instead of when you actually need it."
          }
        ]
      },
      "22": {
        "title": "Ideal Partner 22 — Someone Still Open",
        "fields": [
          {
            "label": "LIGHT WITHOUT PERFORMING",
            "text": "Lightness in you is not a performance, which is why it works on somebody tired of being handled carefully. You are open to a thing you have not done before without needing the case made first, and that openness is temperamental. Trust arrives ahead of the evidence, unstrategised, and withholding it would cost you more than the occasional wrong call. You want the people near you authentic instead of presentable, and you manage that by being unfinished in front of them first. Play is genuinely available in you rather than scheduled, so it takes no persuading twice. You go first with your own softness, and you keep going first, week after week."
          },
          {
            "label": "STEERED PAST THE WEIGHT",
            "text": "Openness this unguarded skips whatever needs real weight, and from the inside the skipping does not feel like avoidance. Hard conversations get steered away from until humour is the dependable method of never landing, and you are very good at the method. Trust that skips discernment exposes you to what a little caution would have caught, and tightening up feels worse to you than the loss. Freedom of this kind means neither of you commits to anything specific enough to be disappointed by, which reads easy and is thin. You can be delightful with somebody for years and reach the end having built nothing either of you could name. You take the ease you create as your own measure, so an hour turning heavy in your hands feels like something you did wrong. Below that sits the suspicion that you are entertaining and not substantial, and a serious conversation is where that would come out."
          },
          {
            "label": "SAY THE UNDEFLECTED THING",
            "text": "Name the serious thing between you and somebody close that has been turned into a joke twice, and write it out before speaking. Say it this week using the plainest words you have, and hold the silence afterwards instead of filling it with a comfortable line. If the joke arrives in your mouth anyway, let it go past and repeat the plain sentence once. Decide beforehand what you want out of the conversation and say that part too, before it ends. Pick the day now and mark it in the calendar, not held back for a moment that feels right."
          }
        ]
      }
    }
  };
  window.DIdealPartnerContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();
