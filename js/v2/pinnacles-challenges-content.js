'use strict';
/*
 * pinnacles-challenges-content.js — second-generation overlay.
 *
 * Layered on top of js/pinnacles-challenges-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DPinnaclesContent — 12 records
(function () {
  const prev = window.DPinnaclesContent;
  const T = {
    "pinnacles": {
      "1": {
        "title": "Pinnacle 1 — Stepping Into Your Own Lead",
        "fields": [
          {
            "label": "DECIDING IS THE JOB",
            "text": "Right now your life turns on one thing: starting before the go-ahead has been issued by anybody. Something opens in this stretch that nobody handed you, a project you appointed yourself to or a direction you took without a vote. Decisions arrive faster and land harder, and checking them against the general mood stops feeling like care and starts feeling like delay. Leadership here is not conferred on you; it is whatever you settle on when no one has ruled. You appoint yourself to the thing, and the appointment holds from the moment you begin acting on it."
          },
          {
            "label": "PICKING FIGHTS FOR PROOF",
            "text": "The failure here is independence taken ahead of schedule, argued into existence rather than built. You contradict whoever holds authority for the pleasure of contradicting them, and file that under development. The other expression is beginnings collected for the charge they carry, one launch after another with nothing standing behind any of them. Speed convinces you a plan exists, when what you have is movement and a good story about it. You are legitimate to yourself only on the days you started something, so a quiet fortnight reads as a verdict. Underneath sits something you will not say out loud, that you are only ever reacting, and that nothing you claimed was yours to begin with."
          },
          {
            "label": "DECIDE ONE THING ALONE",
            "text": "Pick the decision you keep gathering opinions about, and make it before Sunday without running it past a single person. Put the date and your actual reasoning on one page, in your own words, the same evening you decide. Then carry it far enough that undoing it would cost you something, with no second round of consultation."
          }
        ]
      },
      "2": {
        "title": "Pinnacle 2 — Learning to Move With Others",
        "fields": [
          {
            "label": "TWO AT ONE SPEED",
            "text": "This stretch slows you deliberately and puts another person directly inside the work you are trying to do. You read what somebody needs and when they need it with more accuracy than usual, and your patience runs further than it normally would. Cooperation at this depth is not the same as going along with things, and it asks you to stay entirely yourself while making room. Two people moving at the pace trust actually takes will reach something no amount of solo drive gets to. You build a partnership that holds real weight, and that is a skill rather than an accident of who turned up."
          },
          {
            "label": "AGREEING PAST YOURSELF",
            "text": "Accommodation begins reading as progress, and you agree so consistently that you lose track of what you came in wanting. A quieter form of it keeps your preferences technically intact while never saying one out loud at the moment it would cost something. Every relationship carries extra weight right now, so somebody else's preference slides over yours without either of you noticing the swap. Smoothness is your private measure of doing this well, and a conversation ending without friction leaves you feeling competent. The thing you will not face is that no preference is left underneath the agreeing, only the habit of it. Harmony reads as success in the exact moments it is costing you something real."
          },
          {
            "label": "YOUR PREFERENCE, UNEDITED",
            "text": "Before Friday, tell the person you defer to most one thing you actually want, and say it plainly enough to be inconvenient. Leave off the sentence that makes it optional, and skip the alternative you would settle for. Let it stand unamended until that conversation ends, whatever happens to the mood."
          }
        ]
      },
      "3": {
        "title": "Pinnacle 3 — A Season for Being Seen",
        "fields": [
          {
            "label": "ENJOYED, NOT JUST USEFUL",
            "text": "Room opens in this period for the parts of you that are not useful, only good. Expression comes easily, charm arrives without manufacture, and chances to make something or join something multiply past what you can take on. The work is standing in that without deflecting, letting what you made be looked at properly before you crack the joke that shrinks it. A period handing you this much ease is rare, and using the ease is a different act from enjoying it. You take the space and hold it long enough for the thing you made to be seen whole."
          },
          {
            "label": "SCATTERED AND CHARMING",
            "text": "Opportunity spreads across six directions at once here, and not one of the six gets carried to a finish. The second habit is lightness used as cover, real ability kept behind a running commentary that stops it being taken seriously. Attention feels less dangerous than it usually does, which is precisely what makes leaving things unfinished so easy to justify. An unfinished thing cannot be judged, and you would rather be charming about a fragment than accurate about a failure. Being fun is the qualification you accept from yourself, so a flat day sends you scrambling to entertain again. The prospect you steer around is a serious verdict on something you attempted at full effort, with no joke to soften it."
          },
          {
            "label": "FINISH THE WHOLE THING",
            "text": "Take the most nearly finished thing you have and close it out within two weeks, dull final stretch included. Book two mornings for the section you keep skipping and put them in the calendar before you finish reading this. Hand it over with no preamble that turns it into a laugh, and no account of what it could have been."
          }
        ]
      },
      "4": {
        "title": "Pinnacle 4 — Laying Down Real Foundations",
        "fields": [
          {
            "label": "YEARS BEFORE IT PAYS",
            "text": "Patience pays across this period, and almost nothing it rewards will look impressive while you are doing it. You are building something structural in work or money or where you live, and it returns nothing for years before it holds everything. Discipline is easier to reach here than it usually is, and your attention keeps landing on practical questions rather than interesting ones. The most consequential stretch of a life is often the least interesting one to live through, and it still has to get built. You put in the years nobody watches and end up standing on something that does not move."
          },
          {
            "label": "FIXED, NOT STABLE",
            "text": "Rigidity gets mistaken for solidity, and a plan that stopped working keeps running because stopping it would feel like collapse. You defend the structure instead of the purpose it was built for, and the defence gets more elaborate the less sense it makes. Alongside that, the arrangement that steadied you a year ago is confining you now, and nothing announces the day it changed. Staying the course is how you certify yourself as serious, so revising the plan lands as proof you misjudged it. What you will not look at is how much of the structure exists to spare you from deciding anything again. Correction is not the failure of a foundation, it is what keeps one worth standing on at all."
          },
          {
            "label": "OPEN THE OLD PLAN",
            "text": "Open the longest-running plan you have this Sunday and read it against what is actually true now, line by line. Find the single part that stopped serving you and change it that evening, in writing, with the old version left visible underneath. Give the revision a review date ninety days out and enter that date in your diary before closing the document."
          }
        ]
      },
      "5": {
        "title": "Pinnacle 5 — A Season That Won't Sit Still",
        "fields": [
          {
            "label": "CHANGE ARRIVES ANYWAY",
            "text": "Change arrives on its own schedule through these years: a move, a new direction, people turning up mid-sentence. Restlessness runs high, novelty is genuinely appealing, and your ability to adjust stops being a nice quality and becomes what keeps you upright. The lesson is meeting all of it with interest rather than gripping for a stillness this particular run was never going to hand you. Adjusting well is not a consolation prize for a chaotic period, it is the durable thing you take out of it. You steer through conditions that stall other people, and you get better at it every time the situation turns over again."
          },
          {
            "label": "JUMPING BEFORE IT TEACHES",
            "text": "The pull is toward change for its own sake, one jump taken before the last one has taught you anything. Movement gets counted as development, and appetite sets the agenda even when nothing in the situation is asking you to leave. Running beside that, routine gets harder to hold and less attractive when it is available, so stability that would serve you reads as going backward. Appetite is the proof you are alive, so a settled month feels like something has gone wrong with you. The idea you cannot sit with is that staying put would show you precisely how much of you there is."
          },
          {
            "label": "STAY UNTIL IT SETTLES",
            "text": "Write down in one sentence what you are moving toward, then add a second line naming what you are leaving behind. Then take the change already underway and give it a full thirty days before touching anything else. If a new idea shows up inside that month, log it with the day you had it and go no further."
          }
        ]
      },
      "6": {
        "title": "Pinnacle 6 — Responsibility to the People Close to You",
        "fields": [
          {
            "label": "THE WEIGHT YOU TOOK",
            "text": "Home is where this period does its work: a family, a household, one relationship that has become the centre of your obligations. Real responsibility lands on you here, and the growth is carrying it fully without holding it against the people it belongs to. Your instinct to protect intensifies, domestic questions take up room they never used to, and the care starts being the life rather than an interruption to it. You show up entirely for the people nearest you, on the days it costs you something and on the days nothing is noticed."
          },
          {
            "label": "OVER-FUNCTIONING AS LOVE",
            "text": "Over-functioning is the failure here, and you take on parts nobody asked you for until your own requirements stop registering. There is a second face to it, resentment kept out of sight while the care still goes out on time. You are relied on more heavily than at almost any other point, which makes it hard to notice you dropped off your own list. Being indispensable is how you know you are good, so an hour when nothing needs you feels like a demotion. What you keep away from is the suspicion that carrying things is the only thing you know how to offer."
          },
          {
            "label": "SPLIT ONE DUTY",
            "text": "Choose one duty you are carrying alone and ask a named person for it out loud before this month ends. Say exactly which part and exactly which days, so there is nothing vague left for either of you to soften. Take the hour that frees up and give it to something with only your name on it. Do not fill it with the next task you were going to do anyway."
          }
        ]
      },
      "7": {
        "title": "Pinnacle 7 — A Season Turned Inward",
        "fields": [
          {
            "label": "THE LONG QUIET",
            "text": "Solitude does the work in this period, which is built for study and for thinking something through at length. Your appetite for being alone increases, and what you notice without trying gets noticeably more accurate. Some understanding is only reachable in a room with nobody in it, and you are being asked to stay there long enough to arrive at it. You reach conclusions in the quiet that no amount of discussion would ever have produced."
          },
          {
            "label": "STAYING UNDER TOO LONG",
            "text": "Retreat is the risk, and you go so far in that the moment for coming back out passes unnoticed. Reflection that never surfaces is distance with a respectable reason attached to it. Contempt for ordinary talk does the rest, making every shallow conversation easy to skip and stretching the withdrawal past its usefulness. Depth is what you credit yourself for, so a week of small exchanges leaves you feeling you squandered it. The part you avoid is discovering that what you worked out down there does not survive being said aloud to somebody."
          },
          {
            "label": "OUT LOUD, UNPOLISHED",
            "text": "Take one conclusion you have kept to yourself and say it to somebody this week, before the wording is right. Choose the rough one, not the polished account you would want quoted back at you. Say it in under a minute, and leave off the six qualifiers you had ready. Stay in that conversation ten minutes longer instead of going straight back to your own room."
          }
        ]
      },
      "8": {
        "title": "Pinnacle 8 — A Season of Real Consequence",
        "fields": [
          {
            "label": "STAKES THAT ACTUALLY COUNT",
            "text": "Authority with real consequences arrives now, the kind measured in money and in decisions that hold outside your own head. Ambition runs high, your capacity to keep working past the interesting part runs higher, and openings tied to leadership keep appearing. The work is holding that much weight without turning into someone harder, staying a whole person while the stakes get serious. You hold real consequence for weeks at a time without setting any part of it down."
          },
          {
            "label": "HARDENED BY THE STAKES",
            "text": "Output becomes the only measure, and whatever the period costs you underneath never enters your judgement of how it went. Narrowing follows, and you drop anything that cannot be counted until the life gets thinner as the numbers get better. You are judged on results more than is usual, which makes it genuinely hard to register in real time what is being left out. Producing is the whole basis on which you judge yourself, so a slow week turns into a verdict on your character. You will not test who you are on a day you make nothing, and the size of the stakes hands you a permanent reason to avoid finding out."
          },
          {
            "label": "ASK THE OTHER QUESTION",
            "text": "Each evening this week, write one line on how the day felt, and write it before the line about what got done. Keep it to a sentence and do not turn it into an assessment of whether the feeling was warranted. On Sunday read the seven lines in order, in one sitting, adding nothing to them. Notice which day you skipped, and write that one in late rather than leaving the gap."
          }
        ]
      },
      "9": {
        "title": "Pinnacle 9 — Letting Something Go So Something Else Can Begin",
        "fields": [
          {
            "label": "THE CHAPTER THAT CLOSES",
            "text": "Release is the business of these years: a role, a way of describing yourself, an entire chapter that has finished what it was for. Your pull toward completion gets stronger, compassion deepens, and your view widens past the version of events where you are the main subject. An ending here is not a failure at something, it is what has to occur before the next real thing can start. You finish chapters on purpose, and you walk into the next one carrying considerably less than you did."
          },
          {
            "label": "HOLDING PAST THE END",
            "text": "Clinging is the trap, and you hold a chapter open long after it quietly closed itself, then call the holding loyalty. Resisting an ending does not stop it, it only makes the same ending arrive later and cost more to get through. Then there is the identity you keep answering to after it stopped fitting, defended by habit rather than by belief. Continuity is your proof of being a person of substance, so ending something reads as proof you could not sustain it. The discomfort of release convinces you the chapter is unfinished, when that discomfort is exactly what finishing feels like. What you cannot face is the plain fact that the version of you built for that chapter goes with it. Grief is the accurate word for that, and you have been calling it indecision."
          },
          {
            "label": "NAME IT PAST TENSE",
            "text": "Write one sentence in the past tense about the thing that is already over, and date it today. Use the word ended, not paused, and not on hold. Then remove one physical trace of it from where you live before Saturday, and put nothing in its place. Keep the sentence where you will come across it again next month."
          }
        ]
      },
      "11": {
        "title": "Master Pinnacle 11 — An Intensified Calling",
        "fields": [
          {
            "label": "IDEAS THAT ARRIVE LOUD",
            "text": "Inspiration comes at unusual strength through these years, and it wants somewhere to go rather than somewhere to be stored. Your sensitivity to what is true and what is possible runs high, and ideas land with a force that is hard to ignore. The work is trusting one of them enough to act on it early, instead of admiring it privately until it goes cold. A charge this strong is rare, and it is worth arranging a life around rather than experiencing on the side. What you sense ahead of the evidence is a resource rather than a mood, and it holds up when it is tested. You reach the true answer before the evidence does, and you move on it without waiting for the argument to close."
          },
          {
            "label": "THE VERGE AS DESTINATION",
            "text": "Staying inspired is the whole failure, the period spent lit up with nothing set down where it can be touched. It shows up too as the sense of standing on the verge of something, which gets so pleasant that the verge becomes the place you live. A calling this strong needs an actual outlet, and without one the intensity turns into exhaustion with nothing to point at. The charge itself is your proof that you're exceptional, so an ordinary productive week feels like a downgrade. You refuse to put a vision against real materials, because a built thing can be judged and a carried one cannot. By the close of a period like this the intensity is still there and nothing concrete is. Wired, tired and empty-handed is the state this leaves you in when nothing gets grounded."
          },
          {
            "label": "BUILD THE FIRST PIECE",
            "text": "Choose the idea that has been loudest for the longest and build the smallest real version of it by Friday. Make it something with edges, a page or a working sketch or a message actually sent, rather than a plan to make one. Give it two hours and stop when the two hours are up, finished or not. Do the same next Friday with whichever idea is loudest then. Keep the built things in one place where you can count them."
          }
        ]
      },
      "22": {
        "title": "Master Pinnacle 22 — Building at a Larger Scale",
        "fields": [
          {
            "label": "BUILT PIECE BY PIECE",
            "text": "Two things that rarely occur together are both available now: a large idea and the hands to build it. Projects that used to be obviously beyond you read instead as a sequence of tasks with a start date. Your capacity to hold a big picture and do the small practical steps at once runs unusually high. The work is finishing rather than envisioning, and the gap between those two is where most periods like this get lost. Scale is not the achievement; scale that got built and still stands afterwards is. You take something the size of a life's work and turn it into this month's next three tasks."
          },
          {
            "label": "EXHAUSTION AS EVIDENCE",
            "text": "Burnout is what this costs, and the trap inside it is treating exhaustion as evidence the work is going well. You keep going long after the effort stopped adding anything, because stopping would mean the ambition was oversized. Scale creep is the other half, and what feels achievable keeps expanding while what you can sustain does not move. Your ambition and your stamina are both large, and the day they stopped matching each other went by unmarked. Being the person who could hold all of it is what stands in for liking yourself, so a normal week feels like giving up. You do not want to learn where your limit sits, so you arrange days that guarantee you never reach a stopping point you chose. A period built to make something lasting still requires you to survive the making of it."
          },
          {
            "label": "SET THE WEEKLY CEILING",
            "text": "Set a weekly ceiling in hours for your biggest project, and set it this Sunday before the week starts. Choose a number you could still hit in a bad week rather than a good one. Run the whole of next month against that number, logging the hours in one place as you go. Stop at the ceiling even on a day the work is moving well. Put the leftover hours nowhere, and do not lend them to a different project."
          }
        ]
      },
      "33": {
        "title": "Master Pinnacle 33 — A Season of Deep Service",
        "fields": [
          {
            "label": "PURPOSE UNDER THE ORDINARY",
            "text": "Real help moves through you in this period, at a size that changes the shape of somebody's situation. Teaching, caring for people, walking somebody through the worst part of something: the years keep putting you in that position. Your instinct toward service sharpens, and a larger purpose runs underneath days that would otherwise look unremarkable. Doing it sustainably is the whole lesson, and the care you send outward has to be matched sometimes by care aimed at yourself. Capacity at this size is uncommon, and protecting it matters more than spending it down to the last of it. You change what somebody can survive, repeatedly, and the ability stays with you as the years pass."
          },
          {
            "label": "THE VOLUME OF NEED",
            "text": "Giving completely is the failure mode, and your own life empties out quietly while the work itself stays genuinely good. Volume does the rest, and the sheer amount of need reaching you makes any account of your own needs look self-indulgent. A period built around service was never one built around abandoning yourself, though the two run identically for a long time. You are sought out for guidance far more than before, and volume alone erases any question of what you would want in return. Usefulness is the only reason you accept for taking up space, so an hour spent on your own life reads as stolen. What you avoid finding out is what remains of you on a day nothing is needed from you. The avoiding is why you make certain that day never arrives."
          },
          {
            "label": "AN UNGIVEN HOUR",
            "text": "Block one hour this week with nothing in it for anybody, and write it into the calendar under its own name. Use it for something you would do if no one ever heard about it. Do not use it for admin, for rest you need in order to give again, or for planning the next stretch of work. Book the same hour on the same day for the following three weeks. Treat a missed one as a debt and take it back within seven days."
          }
        ]
      }
    }
  };
  window.DPinnaclesContent = {
    get: function (num) { return T.pinnacles[num] || (prev && prev.get(num)) || null; },
  };
})();

// DChallengesContent — 9 records
(function () {
  const prev = window.DChallengesContent;
  const T = {
    "challenges": {
      "0": {
        "title": "Challenge 0 — No Excuses Left",
        "fields": [
          {
            "label": "NOTHING IN THE WAY",
            "text": "You move through situations that would stall somebody else, because the obstacles that shape most people's decisions are simply not standing in your way. Nothing external is arranged against you here, and there is no friction to push back on and no ready explanation for why a thing did not happen. That absence puts the entire weight of direction onto you, which is heavier than an obstacle would have been, because an obstacle at least tells you where to push. You generate your own momentum, with nothing behind you supplying it."
          },
          {
            "label": "FREE AND UNMOORED",
            "text": "Without anything forcing a decision, whole seasons pass in which you are entirely free and going nowhere you chose. The same emptiness makes ordinary choices feel enormous, so you stall for months over things that should take an afternoon, because nothing outside you will settle them. Your self-regard depends on having picked a direction deliberately, so a drifting stretch feels like proof of some defect in you. Beneath that is the suspicion that direction was never really in you, and that the reason nothing has happened is you rather than circumstance. You leave the options open a while longer, because an unmade choice cannot be judged yet."
          },
          {
            "label": "CHOOSE WITHOUT THE PUSH",
            "text": "Choose the direction you have been leaving open, and hand it the next ninety days before you let yourself reconsider it. Write the choice down today in one sentence, including what you are giving up by making it, and keep that sentence somewhere you look most mornings. Each time the question reopens in your head, spend that hour working on the thing you chose instead."
          }
        ]
      },
      "1": {
        "title": "Challenge 1 — Standing on Your Own Judgment",
        "fields": [
          {
            "label": "DECIDED BEFORE CONSULTING",
            "text": "Long before you ask anybody for a second opinion, you already know which way a decision should go. The knowing is quiet and it does not announce itself, but it arrives ahead of the conversation you have about it, and it is usually correct. This challenge asks that quiet knowing to become load-bearing, rather than a note you keep to one side of somebody else's certainty. Holding your ground has a social cost, and that cost is the whole point, since conviction is cheap in a room that agrees with you. You back your own read in the rooms where backing it makes you the difficult one."
          },
          {
            "label": "ASKING THEN REFUSING",
            "text": "Asked to hold a position, you either go hunting for confirmation you should not need, or you clamp shut and refuse all input to prove that nobody moves you. The second version looks like conviction from outside while running on exactly the doubt that produced the first. Disagreement from somebody you respect can unsettle a decision you were certain about an hour earlier, and you feel the ground go before you have even heard the argument. You are only solid with yourself while a call of yours is standing unchallenged, which puts your footing wherever the last conversation happened to leave it. Underneath is the worry that your judgment is unremarkable, and that all the checking is not a habit but a necessity. So the decisions get made twice, once by you and once by whoever you took them to."
          },
          {
            "label": "HOLD IT THROUGH DISAGREEMENT",
            "text": "Make one decision this week without running it past anybody first, and give the reason for it in a single sentence when it comes up. If somebody pushes back, hear the whole argument, then repeat the decision unchanged instead of negotiating it downward while they are still talking. Note in writing afterwards whether the pushback contained anything you had not already considered on your own. Do that for one call only, not for everything you decide this month."
          }
        ]
      },
      "2": {
        "title": "Challenge 2 — Speaking Before Resentment Builds",
        "fields": [
          {
            "label": "THE SMALL HONEST SENTENCE",
            "text": "You feel the small shift in a room at the moment it happens, and you usually know which sentence would name it. Keeping a surface smooth is something you do well, and it costs you almost no visible effort while you are doing it. That accuracy about what is passing between people is real skill, and it works just as well pointed at the awkward thing as at the pleasant one. The version of the skill this challenge wants is the same reading, said out loud, while the thing being named is still ordinary and small. Naming a minor hurt on the day it happens takes far less courage than the confrontation it prevents. You say the plain thing early, before it has had time to harden into a grievance."
          },
          {
            "label": "AGREEING TOO FAST",
            "text": "Agreement leaves your mouth before you have actually settled the question, and the unsettled part stays in you long after the conversation has moved on. Each individual silence is defensible on its own terms, which is precisely how twenty of them accumulate into something you can no longer raise without it sounding enormous. Small hurts last longer inside you than they ever show, and by the time one surfaces it carries everything that came before it. Being easy to be around is what you privately grade yourself on, so a plain objection registers as a personal defect rather than as ordinary maintenance. The peace bought this way is not peace at all, only a postponement that gets more expensive the longer you leave it. Beneath the quiet you carry a fear that closeness holds only while you stay agreeable, and that one honest sentence would test how conditional it has always been. The agreeing continues, the objections pile up unspoken, and the account between you grows without either side ever seeing the total."
          },
          {
            "label": "NAME IT WHILE SMALL",
            "text": "Take the smallest thing that has bothered you in the past fortnight and say it to the person involved within three days. Use one sentence, put no apology in front of it, and describe only what happened and what you felt about it. Stop talking once the sentence is finished, rather than filling the pause with reassurance. Do this while the thing is still minor enough that raising it feels almost silly. Pick a small one deliberately, and leave the large stored ones out of this week entirely."
          }
        ]
      },
      "3": {
        "title": "Challenge 3 — Saying the Real Thing",
        "fields": [
          {
            "label": "BUILT TO BE HEARD",
            "text": "Words come to you quickly and land where you aim them, and you can make almost any idea enjoyable to sit through. That fluency is genuine skill, and it does not desert you when you point it at something harder than entertainment. What this challenge asks is that the fluency occasionally carry real disclosure, the opinion you actually hold and not the smoothed one that performs well. You already know the distance between those two, because you catch yourself selecting the second one while the sentence is still forming. You put the unperformed version into words and let it sit there without a joke attached to soften it."
          },
          {
            "label": "POLISHED PAST RECOGNITION",
            "text": "Humour arrives automatically now, even in front of the things that matter most to you, and it takes the weight out before anyone can put any on. The performance has run so long and so well that you lose track of where it ends and the actual opinion starts, which makes the charm less a choice than a habit you cannot switch off. Good company is the standard you apply to yourself, so an evening where nobody was uncomfortable counts as a success however little of you was in it. Being liked has quietly taken the place of being known, and that exchange was never a decision you consciously made. Underneath it sits the suspicion that the honest opinions are duller than the performed ones, and that a plain version of you would be a downgrade. The charm keeps working, which is the difficulty, because nothing about it fails loudly enough to make you stop."
          },
          {
            "label": "SAY THE UNPOLISHED ONE",
            "text": "Pick one conversation this week where you would normally reach for the funny version, and give the plain one instead. Say the opinion at the length it actually takes, including the part with no joke available to close it. Hold the serious sentence in the air for a few seconds longer than feels comfortable before you move on. Write down afterwards which sentence you nearly softened, and what the softened version would have said in its place."
          }
        ]
      },
      "4": {
        "title": "Challenge 4 — Working Without a Guaranteed Payoff",
        "fields": [
          {
            "label": "THE UNEVENTFUL MIDDLE",
            "text": "Capability has never been the difficult part of this for you, and the work itself comes out at a standard that holds. What this challenge measures instead is endurance through the stretch where nothing visible comes back, the long uneventful middle that pays you nothing while it is under way. Progress during that stretch is genuinely happening and genuinely invisible, and both of those remain true on the days when you can feel neither of them. You put in the hours across the flat part, working from a decision you made months ago rather than from anything today handed you."
          },
          {
            "label": "QUITTING JUST BEFORE",
            "text": "The pull to stop arrives almost exactly where progress stops being visible, and it comes dressed as considered judgement rather than as fatigue. You read the difficulty of the unrewarded stretch as evidence that the route was wrong, when the difficulty was simply the route, and solid work gets abandoned one session short of paying. Long periods without anything to show for them flatten you out of all proportion to what is actually happening in the work. Visible movement is your proof that the effort counts, so a week that produced nothing you could show registers as a week you wasted. The fear you hold at a distance is that the whole effort will amount to nothing, and that staying longer would only enlarge the loss."
          },
          {
            "label": "ONE MORE SESSION",
            "text": "Give the work you are closest to abandoning one more full session this week, before you decide anything at all about its future. Run that session at the length you would have run it in month one, not the shortened version fatigue argues for. Record one line at the end naming what actually moved, however small, and leave the quitting decision until that line exists."
          }
        ]
      },
      "5": {
        "title": "Challenge 5 — Choosing Restraint on Purpose",
        "fields": [
          {
            "label": "CURIOSITY AT SPEED",
            "text": "Interest catches you faster than it catches most people, and you can be genuinely absorbed in something within an hour of meeting it. Starting costs you almost nothing, so you have begun a great number of things and several of them were worth beginning. Boredom also arrives early, well before the thing has had a chance to become whatever it was going to be. The challenge here is not aimed at curiosity itself, which is an asset, but at curiosity overruling every commitment before that commitment has matured. Restraint you pick for yourself is a different thing from restraint imposed on you, and only the first one is worth having. You choose one of them on purpose and keep going after the interest has drained out of it."
          },
          {
            "label": "STARTS WITHOUT FINISHES",
            "text": "Movement gets mistaken for freedom, and you end up holding an impressive collection of openings with almost nothing carried all the way through. Whatever is newest pulls at you almost automatically, and completion has never delivered the charge that beginning reliably does. Restlessness presents itself to you as ambition, and it is convincing because from inside the two are genuinely hard to separate. Feeling alive is what you check yourself against, so a stretch of steady unexciting work leaves you convinced you are wasting a life rather than building one. Every new start hands you an excitement that a continuation, by its nature, can no longer supply. What you avoid examining is whether you are actually building anything, and the next beginning is how that examination keeps getting postponed. The pile of beginnings grows steadily, and each addition to it looks like appetite rather than evasion."
          },
          {
            "label": "DECLINE THE NEW ONE",
            "text": "Turn down the next appealing new thing that appears this week, and put the hours it would have taken into what you already have running. Say the refusal out loud to yourself with the reason attached, so that it registers as a decision rather than a delay. Keep a short dated list of what you declined and add to it every time the pull returns. Work the existing commitment for two sessions in the same week, at the times you would have given the new thing. Do that even on the day the existing commitment feels dull."
          }
        ]
      },
      "6": {
        "title": "Challenge 6 — Letting People Take Care of Themselves",
        "fields": [
          {
            "label": "SEEING THE NEED EARLY",
            "text": "Need registers with you early, often before the person carrying it has found words for it themselves. You can usually see the practical fix as well, so stepping in feels like plain kindness rather than a decision that deserves examining. The care behind it is real and does not require defending, and what it requires instead is an edge you stop at. This challenge asks for the harder half of caring, which is trusting somebody to carry their own thing slowly and badly instead of quickly and well. You hold the fix back and let the other person work it out their own way."
          },
          {
            "label": "HELP ARRIVING UNASKED",
            "text": "Stepping in happens before anybody has requested it, and the help comes with more instructions attached than the situation ever called for. Held to a standard of care they never agreed to, the people you love end up managed rather than supported, and the love starts functioning as supervision. Watching somebody struggle with something you could have settled in ten minutes is close to unbearable, and that discomfort is what moves your hands, not their request. You draw your footing from being necessary, so an afternoon when nothing is needed of you feels less like rest than like being out of work. Your intentions are good, and the supervision is still the part that arrives. Underneath runs the fear that helping is all you actually have to give, and that stopping would leave you with nothing you recognise as love."
          },
          {
            "label": "LET IT GO WRONG",
            "text": "Pick somebody close to you whose problem you would normally take over, and leave it with them for a full week without offering a single suggestion. Each time you feel yourself about to step in, write the suggestion on paper and leave it there unsent. Spend one of the hours you would have spent fixing it on something of your own instead. Notice how long the discomfort lasts before it passes, and write that down beside the suggestions you did not give."
          }
        ]
      },
      "7": {
        "title": "Challenge 7 — Trusting What You Can't Fully Explain",
        "fields": [
          {
            "label": "AHEAD OF THE EVIDENCE",
            "text": "Something in you settles on the answer well before the evidence supporting it has assembled itself. You are rigorous by preference and you like a case you can defend, so a knowing that arrives first sits awkwardly against how you would rather operate. It is accurate anyway, and its accuracy does not depend on your being able to show the working behind it. You move on what you sense before the case for it exists, and that is a separate skill from having sensed it at all."
          },
          {
            "label": "PROOF AS A DELAY",
            "text": "Hunches get talked out of existence in the hours after they arrive, dismantled by the same analysis you are rightly proud of. By the time your standard of evidence has been met, the moment the instinct pointed at has usually closed, and you are left with a well-documented account of something you no longer get to do. Certainty feels safer to you than a strong unproven feeling ever does, and asking for more data quietly does the work of never having to act. You rate a day by whether you were correct in it, so being wrong out loud costs you far more than a missed opening ever has. What you avoid looking at is the possibility that the instinct is ordinary guessing, and that trusting it would prove you are not the careful person you take yourself for."
          },
          {
            "label": "ACT ON ONE HUNCH",
            "text": "Act this week on one thing you already sense, at a scale small enough that being wrong is survivable and large enough that it costs you something real. Write the read down before you move, in plain words, so that what you believed at the time is on record. Then leave it alone for a month before you go back and read what you wrote."
          }
        ]
      },
      "8": {
        "title": "Challenge 8 — Making Peace With Power",
        "fields": [
          {
            "label": "POWER HELD STEADY",
            "text": "Responsibility lands on you more often than it lands on the people around you, and you take it up without much fuss. Money, authority and who gets to decide are live matters for you rather than things you can comfortably ignore. Power itself is not the difficulty here, and this challenge does not ask you to want less of it. The difficulty is holding it at a steady size, without reaching for more the moment you have some and without handing it back the moment it weighs something. You take up the authority that is actually yours and carry the weight arriving with it."
          },
          {
            "label": "NO STEADY MIDDLE",
            "text": "Achievement becomes the whole of who you are on one side, and on the other you give responsibility away so that nothing can be measured against you. Whichever pole you default to feels like the reasonable option from inside it, and both are the same refusal to hold power steadily. Questions of money and standing arrive with an unusual charge, and you can feel yourself either reaching hard or stepping back before the conversation has finished. What settles your account with yourself is whether a situation left you with more or with less, so nothing involving authority is ever neutral for you. Both extremes protect you from the same thing, which is the ordinary work of deciding what belongs to you and holding exactly that. The fear kept out of view is that steady authority would show precisely how much you can handle, and neither reaching nor deflecting ever puts that to the test."
          },
          {
            "label": "CLAIM YOUR ACTUAL SHARE",
            "text": "Take on one piece of real responsibility this month and hold it at its true size, neither inflating it nor passing it along once it is done. Before you begin, write down how much authority the job actually carries and what parts of it are not yours. When it falls to you to say who did what, state your own part in one sentence and add nothing around it. Check what you wrote at the start against how you behaved once the thing was finished."
          }
        ]
      }
    }
  };
  window.DChallengesContent = {
    get: function (num) { return T.challenges[num] || (prev && prev.get(num)) || null; },
  };
})();

// DKarmicDebtNumberContent — 4 records
(function () {
  const prev = window.DKarmicDebtNumberContent;
  const T = {
    "debts": {
      "13": {
        "title": "Karmic Debt 13 — The Debt of Avoided Work",
        "fields": [
          {
            "label": "THE UNGLAMOROUS HOURS",
            "text": "Sustained, dull work is what this pattern keeps putting back in your path, and you handle it whenever you decide to. You can spread effort evenly across weeks instead of compressing it into one frantic push. Consistency rather than talent is the capacity being built here, and you know which of those two you lean on. You recognise the shape of a huge push followed by a flat, useless week, so the old habit stays visible to you. You finish work nobody finds interesting, on days when nothing whatsoever is forcing your hand."
          },
          {
            "label": "BURN THEN COLLAPSE",
            "text": "The scramble becomes the method: corners get cut under pressure, and effort stays parked until a date drags it out of you. Half-finished work sits in the background carrying weight, and it shapes what you agree to weeks before anything comes due. Something feels permanently close behind, whatever distance you believe you have built, and it does not lift when the work is handed over. You feel capable in the last night before a deadline and nowhere in the quiet fortnight preceding it. Every rescue landed on time teaches you again that this is simply how anything gets done. Underneath runs a private worry that pressure supplies the whole of your ability, and that the steady version of you would turn out ordinary."
          },
          {
            "label": "SEVEN UNRUSHED DAYS",
            "text": "Pick the piece of tedious work that is not due yet and take it to completion within three days. Give it a fixed start time on two of those days and stop when the session ends, even mid-flow, so the work gets paced. Note the date you finished beside the date it was actually owed."
          }
        ]
      },
      "14": {
        "title": "Karmic Debt 14 — The Debt of Unchecked Appetite",
        "fields": [
          {
            "label": "FREEDOM HELD KNOWINGLY",
            "text": "Freedom matters at the level most of your decisions get made from, and you would take an open week over a secure one. You handle temptation and instability at close range instead of arranging a life where neither ever shows up. Restraint you picked yourself reads as relief, and within a day you know whether a limit was chosen or handed down. You learn moderation deliberately, inside exactly the conditions that make moderation difficult."
          },
          {
            "label": "RESHUFFLED EVERY TIME",
            "text": "Impulse gets there before judgement does, and the freedom you guard turns into a life rearranging itself around choices you never quite made. Plans, habits, addresses and attachments change more often than they need to, and each single change has a reasonable account behind it. The appetite meant to keep you free manufactures the instability you were running from, one defensible decision at a time. You gauge yourself by how little is holding you down, so a cancelled commitment registers as health and a steady routine as decline. The dread underneath is of being pinned in place, waking inside a settled life and finding the person there has stopped wanting anything. Each impulsive turn feels like air at the moment you take it, which is why the pattern keeps outrunning any intention to stop it."
          },
          {
            "label": "ONE LIMIT, CHOSEN",
            "text": "Name a single restraint you are choosing for the next fortnight, and record that you picked it rather than owed it. It can be a bedtime, a spending ceiling, or one commitment you will not cancel. Hold it hardest when you least want to, and note in one line what you wanted to do instead. Add no second restraint while the first is still running."
          }
        ]
      },
      "16": {
        "title": "Karmic Debt 16 — The Debt of the Fallen Tower",
        "fields": [
          {
            "label": "WHAT SURVIVED THE FALL",
            "text": "Collapse of something you took as settled belongs to this pattern, and what comes after it holds far better than what went. You survive losing a standing you assumed was permanent, and you come out with an accurate account of what was ever genuinely yours. Being brought low does not finish you; you keep working through the stretch where nothing impressive is left to point at. Status resting on a story rather than on the labour underneath is plain to you once it goes. You rebuild from what is verifiably true instead of restoring the old picture, which is slower and much harder to knock over. You lower your claim to the exact size of what you can stand behind, then go on working at that size."
          },
          {
            "label": "THE IMAGE DEFENDED",
            "text": "Pride keeps the picture upright long after belief in it has drained away, and it guards most fiercely the part with least behind it. You get caught out again, and the correction looks sudden only because the shakiness under it went unexamined for months. Your worth sits in the position rather than in the labour that produced it, so an honest downgrade registers as a loss of self. The horror is a room where the gap between your claim and your actual ability becomes visible, and you would sooner be knocked over by an event than name it. So the picture goes on being defended, more quietly each year, and the correction gets arranged for you rather than by you."
          },
          {
            "label": "DROP ONE CLAIM",
            "text": "Pick a claim you make about yourself — a title, a level of skill, a role — and test it against the last twelve months of what you did. Where the evidence is thin, speak the smaller true version to somebody before Sunday, without softening it into a joke. Then live as the smaller version for a fortnight and build from there. Announce nothing more widely, and attach no plan for winning the bigger claim back."
          }
        ]
      },
      "19": {
        "title": "Karmic Debt 19 — The Debt of the Isolated King",
        "fields": [
          {
            "label": "CAPABLE ENTIRELY ALONE",
            "text": "Handling an entire situation single-handed is genuine here rather than a pose, and you carry loads built for more than one set of hands. Your self-reliance has been tested properly, so your confidence in it comes from having done the thing rather than dodged the test. You take real pride in requiring nothing, the pride is earned, and that is precisely why this pattern points at it. Accepting help is a separate skill from needing it, and you can learn that skill without surrendering what you can already do. You stand on your own and let somebody stand beside you, and both of those hold together."
          },
          {
            "label": "NO VISIBLE OPENING",
            "text": "Self-reliance runs past useful into a sealed room, where the life reads as competent and quietly runs short of whatever would hold it up. Asking costs you more than it costs most, so the request waits until the situation has resolved itself badly. Isolation arrives wearing the name independence, and by the time you notice, the distance is structural and no longer something a good week corrects. Your worth is counted by how much you can move without assistance, so every hand accepted lowers the figure and every solo rescue raises it. Underneath sits a horror of becoming an obligation, of finding that the hour you need something is the hour you stop being tolerable. Because you never leave a gap, your situation invites nothing, and the loneliness that follows gets filed as evidence that support was never available. The competence is real and it is also the wall."
          },
          {
            "label": "THE UNCOMFORTABLE ASK",
            "text": "Choose one item this week you would normally absorb without mentioning, and hand the actual work of it to somebody. Make the request in plain words, with a named task and a named day, instead of mentioning it sideways and hoping it gets picked up. Sit through how uncomfortable the twenty seconds after asking feel, and do not fill them by taking the job back. Choose an item with a real deadline attached rather than a vague standing chore. Do this once before Friday, and pick the item you would be most embarrassed to admit you cannot cover on your own."
          }
        ]
      }
    }
  };
  window.DKarmicDebtNumberContent = {
    get: function (num) { return T.debts[num] || (prev && prev.get(num)) || null; },
  };
})();
