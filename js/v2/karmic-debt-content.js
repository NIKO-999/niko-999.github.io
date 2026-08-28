'use strict';
/*
 * karmic-debt-content.js — second-generation overlay.
 *
 * Layered on top of js/karmic-debt-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DKarmicDebtContent — 48 records
(function () {
  const prev = window.DKarmicDebtContent;
  const T = {
    "nodes": {
      "1": {
        "title": "The Magician — The Tension of Starting Without Staying",
        "fields": [
          {
            "label": "IDEAS ARRIVE ON DEMAND",
            "text": "Beginnings come to you at a speed most people cannot match, and you can raise real momentum out of nothing on a flat afternoon. You see the shape of a thing before it exists, and the first stretch of building it runs on energy you never had to manufacture. Where somebody else needs a plan and a run-up, you already have three directions and the appetite to take one of them. That opening burst is a genuine capacity rather than luck; you produce it repeatedly, under conditions that stall other people. You start things that would not otherwise exist."
          },
          {
            "label": "THE MIDDLE GETS SKIPPED",
            "text": "Trouble arrives at the moment a thing stops being exciting and begins asking for discipline instead. Your attention slides toward the next idea right there, and the slide is quiet enough to never feel like quitting — it feels like a better opportunity showing up. The same shape repeats in work, in relationships, and in anything you make: a strong open, then fading interest exactly where consistency would begin to count. You feel capable when something comes out of nothing, so a project in its fourth month offers you no evidence of anything at all. Below that sits a worry that the opening burst is all the talent you have, and that a long middle would show the rest to be ordinary. So the burst stays on rotation, and the unfinished things stack up behind you."
          },
          {
            "label": "STAY PAST THE DROP",
            "text": "Pick the unfinished thing that is furthest along and give it four sessions this week, at fixed times you write into the calendar tonight. When the pull toward a new idea shows up during one of those sessions, put the idea on a separate page and go back to the work without acting on it. Keep that page closed until the four sessions are done. Begin nothing new before then."
          }
        ]
      },
      "2": {
        "title": "The High Priestess — The Tension of Knowing and Not Saying",
        "fields": [
          {
            "label": "SEEN BEFORE STATED",
            "text": "You read a situation accurately before anybody in it has put words to what is happening. The read arrives whole and early, usually well ahead of the conversation that eventually confirms it, and it is right often enough that you have stopped being surprised. You hold detail about the people near you that they have not told you, assembled out of how they move and what they leave out of a sentence. Depth is where you are comfortable: the surface version of a subject bores you within minutes and you go straight past it. Quiet does not make you anxious, so you can sit in a conversation without needing to fill it and pick up whatever fills it instead. You know what a room is doing before the room does."
          },
          {
            "label": "THE ACCURATE SILENCE",
            "text": "What you see stays inside, and the reason is reflex rather than a decision you make on the day. In a hard conversation you wait for somebody else to say the thing you saw twenty minutes earlier, and when nobody does, the decision goes ahead without the one piece that would have changed it. One-directional closeness is the other side of it: others hand you their inner lives while you hand back almost nothing, so you end up known far less than you know. You locate your value in understanding rather than in being understood, because one of those positions is safe and the other exposes you. Deeper down runs the worry that a perception said out loud would simply be argued with, and that the accuracy you depend on would stop feeling dependable once it could be contradicted. An unspoken read stays perfect precisely because nothing can test it, and you pay for that perfection with a life nobody has quite met."
          },
          {
            "label": "SPEAK IT LIVE",
            "text": "Choose one meeting or conversation this week and say your read out loud inside it, before the decision is taken rather than afterwards. Put it in one plain sentence, without softening the front of it or attaching a question to the end. Do the same again in the next conversation of that kind, within seven days, whatever happened the first time."
          }
        ]
      },
      "3": {
        "title": "The Empress — The Tension of Giving Without Receiving",
        "fields": [
          {
            "label": "WARMTH WITHOUT ARITHMETIC",
            "text": "Generosity runs out of you without calculation, which is rarer than it sounds and impossible to fake for any length of time. You give hours, money, attention and warmth without first working out what comes back, and nothing in it is a bid for something in return. Around you things grow — projects, households, whoever happens to be having a bad year — because you feed them without being asked twice. You notice what somebody needs before they have organised it into a request, and then you simply supply it. You keep other people upright through stretches they could not have held alone."
          },
          {
            "label": "THE CLOSED RETURN",
            "text": "Accepting anything is a different matter, and the distance between those two directions is where the damage sits. When somebody offers you help you convert it into a favour to repay inside about a minute, so the offer never lands as an offer. Under strain the response is to give more rather than to ask for something, even where the giving is the thing draining you. The arrangements around you therefore keep asking for more output than they return, not because anyone is unfair but because the receiving half has never been practised. You base your value on being the source, supplying rather than supplied, and a day where you needed something and said so feels like a day you failed at your own job. Underneath is a suspicion that you are wanted for what you provide, and that with nothing left to hand over you would watch the room empty. So the channel runs one way and leaves you resourced for everybody except yourself."
          },
          {
            "label": "RECEIVE WITHOUT REPAYING",
            "text": "The next time somebody offers you something — help, a compliment, a lift, money — take it, say thank you, and add nothing after the thank you. Do not return the favour that week, and do not name a future occasion on which you intend to. Then ask one person for something concrete you actually need before Sunday, and let the request stand at full size as you make it."
          }
        ]
      },
      "4": {
        "title": "The Emperor — The Tension of Control Under Pressure",
        "fields": [
          {
            "label": "ORDER OUT OF DRIFT",
            "text": "Structure comes naturally to you, so situations that would otherwise wander acquire a shape, a sequence and somebody responsible for each part. Walking into confusion, you can see what is missing and supply it inside the hour, and what you build holds under load. Responsibility sits easily on you where it sits heavily on most; you pick it up early and carry it without announcing that you have. You take a drifting situation and put a spine into it."
          },
          {
            "label": "THE GRIP TIGHTENS FIRST",
            "text": "Uncertainty makes your hands close rather than open, and the tightening happens before you have decided anything about it. You start managing a situation nobody asked you to manage, directing those already handling it, and the correction feels so obviously necessary that you cannot see it as a choice. Alongside that runs the second half: you are the fixed point everybody leans on, and you cannot delegate, rest, or leave a thing unwatched for a fortnight without looking. Being reliable is where your worth is stored, which means every hour you are not holding something up counts as slack. The fear is simpler than it looks — that the arrangement is held together by your attention, and letting go for a week would show you exactly how much of it comes apart. So you carry a load that was never entirely yours and call the exhaustion the price of doing it properly."
          },
          {
            "label": "SEVEN DAYS UNSUPERVISED",
            "text": "Pick something real that you currently oversee and give it to somebody else on Monday, with the outcome and the deadline stated and nothing else specified. For the following seven days do not ask about it, do not look at it, and do not build a private version of it in your head. On day three, write two lines about what not looking is costing you, and leave those two lines alone."
          }
        ]
      },
      "5": {
        "title": "The Hierophant — The Tension of Inherited Belief Meeting Direct Experience",
        "fields": [
          {
            "label": "TRADITION HELD SERIOUSLY",
            "text": "Inherited structure means something to you, and you will not throw away a rule simply because it is old or currently inconvenient. You can tell the difference between a practice tested by generations and one somebody invented last year in order to sound decisive. That respect gives you patience with systems, a long memory for why things were built the way they were, and real resistance to fashionable demolition. You carry knowledge that was handed to you and you keep it intact rather than letting it thin out through neglect. You hold a line that most abandon at the first inconvenience."
          },
          {
            "label": "THE OLD RULE WINS",
            "text": "When a rule you were given meets something your own life has plainly shown you, the rule wins, and it wins automatically. The deferral is quick enough that the disagreement barely registers as a disagreement; the familiar authority answers, and the quieter signal from your own experience gets filed as a mood. You also carry constant friction from it: what is correct according to the tradition and what is true according to your own evidence keep pulling apart, and you live in that gap. Your standing rests on doing it properly by the established measure, so trusting your own read would put you outside the only scoring system you recognise. The fear underneath is of being wrong with nothing to stand behind, because a borrowed rule takes the blame and a personal conclusion does not. You end up living inside rules that have never been checked against your own life."
          },
          {
            "label": "ONE RULE ON TRIAL",
            "text": "Write down one rule you follow that you did not choose, in the plainest words available, and beside it write what your own experience says instead. Pick a low-stakes situation in the next fortnight and act on your own evidence rather than on the rule, once, deliberately. Record what actually happened that same evening, in a few lines, and keep the record. Do this before you try it anywhere that matters."
          }
        ]
      },
      "6": {
        "title": "The Lovers — The Tension of Choosing to Keep the Peace",
        "fields": [
          {
            "label": "THE ROOM STAYS EASY",
            "text": "Discomfort in a room registers on you immediately, and you know what would settle it before anybody has named the problem. You can hold two people with opposite positions in the same conversation without either of them hardening, largely because you adjust the temperature as you go. That sensitivity is real skill rather than mere niceness; you are reading a dozen small signals at once and acting on them while the conversation continues. You are unusually good at finding the version of a plan that several different people can actually live with. Attention to how something lands, not only whether it is correct, is built into the way you speak. You keep situations survivable that would otherwise turn into a fight."
          },
          {
            "label": "THE EASY OPTION WINS",
            "text": "At an actual decision point, the option that keeps things calm quietly outcompetes the option you wanted, and you rarely notice the swap happening. Your preference does not get argued down; it gets left out of the discussion entirely, because raising it would introduce friction into a room you were busy keeping smooth. Look back over a year of choices and the shape shows: most were settled by what would cause the least disturbance rather than by what you were after. Your value is drawn from the room staying easy, so a moment of tension arrives as proof that you have failed at the single thing you are reliably good at. The dread underneath is that your preference, stated plainly, would turn out to be unwelcome, and then you would have to choose between the preference and the peace. Avoiding the question keeps both of them alive in theory. The cost is a life assembled out of everybody else's comfort, which you can feel and cannot easily point at."
          },
          {
            "label": "SAY THE PREFERENCE FIRST",
            "text": "This week, in three low-stakes situations — where to eat, which day, whose plan — state what you want first and before you know what anybody else wants. Say it as a plain preference, not as a suggestion with an escape route built into it. Then let the conversation go wherever it goes, without softening what you said or explaining why you said it."
          }
        ]
      },
      "7": {
        "title": "The Chariot — The Tension of Motion Without Pause",
        "fields": [
          {
            "label": "FORWARD UNDER OBSTRUCTION",
            "text": "Sustained forward motion is something you generate, not something you catch, and obstacles that stop other people barely slow you down. You keep going through stretches where the work has stopped being interesting and the finish is still a long way off. Given a target, you close the distance to it with an appetite for the effort itself, not only for the arrival. Setbacks get turned into the next attempt rather than into a review of whether to continue at all. You move things that have been sitting still for years."
          },
          {
            "label": "STILLNESS FEELS LIKE DANGER",
            "text": "The moment nothing urgent is happening you manufacture something urgent, and the manufacturing is quick enough to look like productivity. A free weekend gets filled before it starts, and a finished project produces the next one before the finish has been felt. Under real pressure this intensifies, because continuing to push forward feels safer than stopping to check whether the direction is still right. Output is the yardstick you judge yourself against, so an hour that advanced nothing becomes an hour in which you were nothing much. What the quiet would surface is the question you keep outrunning — whether the last three years of effort were pointed anywhere you actually chose. Motion answers that question by never letting it get asked, and the direction goes unexamined for years at a stretch."
          },
          {
            "label": "TWO HOURS, NOTHING QUEUED",
            "text": "Book two hours this week with nothing in them and no task waiting behind them. When the pull to start something arrives, and it will arrive inside about ten minutes, stay put and sit in the discomfort rather than solving it. Do not use the time to plan, to tidy, or to think usefully about work. Write one line afterwards about what those two hours were actually like. Repeat it the following week at the same hour."
          }
        ]
      },
      "8": {
        "title": "Justice — The Tension of a Standard Applied Unevenly",
        "fields": [
          {
            "label": "THE UNEVEN THING SHOWS",
            "text": "Unfairness registers on you the way a wrong note registers on a musician, immediately and without needing to be worked out. You can see who is carrying more than their share in an arrangement that everybody involved has agreed to call normal. Along with the seeing comes a real want to set it right, which is why you will spend energy on a correction that gains you nothing. You weigh things properly: what was promised against what was delivered, what was taken against what was given back. Your judgement holds up under examination because it was built from facts rather than from how you felt that morning. You name the imbalance in a room that has decided not to mention it."
          },
          {
            "label": "THE STANDARD POINTS OUTWARD",
            "text": "The judgement runs outward at full strength and inward at almost none, and the difference in resolution is the entire pattern. You can describe somebody else's inconsistency in detail while a matching version in your own conduct stays blurred, not hidden exactly, just never brought into focus. Personal unfairness lands differently too: the same lesson keeps arriving in new circumstances until it starts to look like being singled out by the world. Your worth is built on being fair, so examining your own account honestly threatens the one credential you do not question. You flinch from finding the same fault in yourself that you have been correcting everywhere else, because then the standard would have to be paid rather than administered. So the eye stays trained outward, sharp and busy. The sharper it gets out there, the more reliably a quiet matching version is running at home."
          },
          {
            "label": "THE SAME MEASURE INWARD",
            "text": "Take one specific situation where you are currently the wronged party and write out what you would say about your own conduct if it belonged to somebody else. Be as exact about it as you would be about them, including the parts that are inconvenient to your case. Do this within three days, on paper, and keep what you wrote. Then change one thing on your own side of it before the week finishes."
          }
        ]
      },
      "9": {
        "title": "The Hermit — The Tension of Withdrawing Instead of Reaching Out",
        "fields": [
          {
            "label": "PROCESSED WITHOUT COMPANY",
            "text": "Difficulty gets processed internally by you, thoroughly, and you emerge with something clear rather than something merely survived. You can sit with a problem for weeks without needing anybody to help you hold it, and the clarity that eventually arrives is genuinely yours. Solitude is productive rather than empty for you; the hours alone do actual work that many people cannot do without company in the room. You handle emotional weight with no external scaffolding at all, which is a capacity rather than a coping mechanism. You reach your own conclusions in conditions that leave most people needing somebody to check them."
          },
          {
            "label": "THE DOOR SHUTS FIRST",
            "text": "Hardship shuts the door, and the shutting is done before you have consciously considered any other option. The withdrawal is not refusal — nobody is being pushed away — it is that going inward is so fast and so familiar that reaching outward never gets a turn. Because you genuinely are good at solving things alone, the evidence keeps confirming that alone is correct, and outside support stays a theory nobody has run. Your worth is tied to needing nothing, so a week in which you asked somebody for help registers as a week you slipped, and below that runs a wariness about being met halfway and then dropped, which is a risk solitude removes completely. So you sit alone through exactly those stretches where company would have changed the shape of it."
          },
          {
            "label": "RETURN BEFORE IT RESOLVES",
            "text": "Pick one person and tell them about something you are currently inside, while it is unresolved and before you have reached your conclusion. Give the next retreat a limit — two days, three, whatever is honest — and come back out when the limit is reached whether or not the thinking is finished. Say the unfinished version aloud, including the part you would normally hold back until it was tidy. Do the first half of this before Friday."
          }
        ]
      },
      "10": {
        "title": "The Wheel of Fortune — The Tension of Reacting to Every Turn",
        "fields": [
          {
            "label": "CHANGE REGISTERS EARLY",
            "text": "Shifts in circumstance reach you early, while most people are still operating from last month's picture of things. You pick up the change in tone, the slowing order book, the thing that has quietly stopped working, well before any of it is announced. That attunement is not anxiety dressed up as insight; it is accurate information arriving ahead of the confirmation. You see the turn while it is small enough to do something about."
          },
          {
            "label": "DIP READS AS DISASTER",
            "text": "During a downturn your response is immediate and large: the change becomes an emergency, and an emergency demands that something be torn up today. Decisions taken in those low stretches are the ones you look back on with the least patience, because the urgency felt exactly like clarity while it was happening. The matching failure sits at the opposite end — when things go well you prepare for nothing, since the momentum feels as though it will simply carry on. Your worth is measured by how fast you respond, so sitting still through a bad month feels to you like negligence rather than judgement. The dread is of being caught flat by something you could have seen coming, so you move early and often, and the moving costs more than waiting would have. Both ends of the cycle get met at the wrong speed. You end up with a run of large decisions taken from the worst available vantage point."
          },
          {
            "label": "DELAY THE BIG MOVE",
            "text": "Set a rule now, in writing, that no decision above a size you define gets taken within seventy-two hours of bad news arriving. Put the number and the rule where they stay visible to you, and date the page today. In the next good stretch, do one piece of preparation for the next downturn — money set aside, a conversation had, an option kept open — while nothing is going wrong."
          }
        ]
      },
      "11": {
        "title": "Strength — The Tension of Holding Everything Alone",
        "fields": [
          {
            "label": "TESTED, NOT THEORETICAL",
            "text": "Real strain has been through you and you are still standing, which is not the same as being told that you are strong. When a situation gets heavy you steady rather than scatter, and those beside you can feel that happen in the room. Your resilience was tested rather than assumed, which is why it holds when circumstances stop being manageable by ordinary means. You hold difficult situations together while they are still moving."
          },
          {
            "label": "NOBODY SEES THE LOAD",
            "text": "Under pressure your hands close around all of it, and the possibility of letting anybody share the weight does not come up. Support gets offered and declined in the same breath, usually with a sentence about how it is fine, which you believe as you say it. Across every relationship the imbalance shows: you are steady for other people constantly and almost never on the receiving end of the same thing. Your value sits in being unbreakable, so admitting that you are struggling feels less like honesty and more like resigning from your position. Underneath is a quiet certainty that if you put the weight down it would not get picked up, and you would learn something you cannot unlearn. Because none of the strain shows on the outside, those closest to you have no idea how much you carry. The resilience everybody leans on gets spent down with nothing refilling it."
          },
          {
            "label": "PUT ONE CORNER DOWN",
            "text": "Identify something you actually need this week — not a preference, a need — and take it to somebody who could plausibly help with it. Say it once, plainly, and resist the reflex to explain straight afterwards that you could manage without it. Leave the sentence unqualified at both ends, with no joke attached to either one. Do it while the need is current rather than after you have handled it yourself."
          }
        ]
      },
      "12": {
        "title": "The Hanged Man — The Tension of Staying Suspended",
        "fields": [
          {
            "label": "WAITING THAT DOES WORK",
            "text": "You can leave something unresolved for a long stretch without forcing it, which most people cannot manage for a week. Where somebody else grabs at a premature answer to end the discomfort, you let a situation develop until it shows you what it actually is. That tolerance for the unfinished is genuine capacity: you are not avoiding the decision so much as declining to take it early. You can also hold a position that costs you something now, because you see further out than the immediate week. Suspension does not panic you, so information arriving late still finds you willing to use it. You let things ripen that a faster hand would have picked green."
          },
          {
            "label": "PAUSE OUTLIVES ITS USE",
            "text": "A decision comes due and you wait, and the waiting gets called patience, timing, or simply not being ready yet. All three explanations are available at any moment, and that availability is what makes the position so hard to argue with from the inside. Meanwhile the unresolved situation stays exactly where it is, well past the stage where whatever it had to teach you has clearly been learned. Your worth is bound up in not getting it wrong, and an unmade decision cannot be a mistake yet, so suspension protects the record. The wait itself becomes the safe place: choosing would end the ambiguity, and ambiguity is the last thing standing between you and a verdict. Whole chapters of your life stay open this way, neither running nor finished."
          },
          {
            "label": "DECIDE BY THAT DATE",
            "text": "Take whatever you have been holding open longest and put a date on the decision, no more than three weeks out, written where you keep your appointments. On that date, choose with whatever clarity you have then, and treat missing information as part of the conditions instead of a reason to move the date. Tell one person the date today, so it is recorded somewhere other than your own memory."
          }
        ]
      },
      "13": {
        "title": "Transformation — The Tension of Holding On or Letting Go Too Soon",
        "fields": [
          {
            "label": "SENSING THE ACTUAL END",
            "text": "Completion registers on you well before the evidence has assembled itself for anybody else, and the reading is usually accurate. Just as reliably, you can tell when a thing that looks finished still has life left in it and is being written off early. That double sense is a genuine instrument: an ending is something you feel directly rather than deduce from the circumstances around it. You have walked through several endings intact and come out the far side of them still yourself. You know what is over before it announces itself."
          },
          {
            "label": "GRIP OR CUT",
            "text": "Around endings the accurate instrument stops being consulted and anxiety takes the decision instead. One direction is holding hard to something clearly finished, feeding it, defending it, keeping a dead arrangement in motion because the ending has not been agreed to. The other direction is the early cut: ending a thing while it still has something left, purely to avoid sitting through the slow part where it comes apart while you watch. Your worth rides on handling transitions well, so an ending that got away from you lands as a failure of character rather than of timing. What you cannot face is being inside something while it dies with no power to stop it, and both moves, the grip and the cut, are ways of avoiding that position. Neither one lets an ending happen at its own moment. You are left holding endings that never quite landed where they should have."
          },
          {
            "label": "CHECK THE ACTUAL STATE",
            "text": "Choose the live situation where the impulse to cling or to cut is strongest right now, and write a page on what has genuinely completed in it and what has not. Do the writing before you take any action on it, and give yourself until Sunday to get it down. Separate what is finished from what you are merely tired of, in plain language and with no conclusions on the first pass. Read the page again two days later before deciding anything."
          }
        ]
      },
      "14": {
        "title": "Temperance — The Tension of Swinging Between Extremes",
        "fields": [
          {
            "label": "COMMITMENT WITHOUT A GESTURE",
            "text": "When you commit to something you commit completely, and a half-measure has never held much appeal for you. Rest, when you take it, is actual rest, and work, when you do it, gets everything you have available that day. That capacity for undivided attention is why your good stretches are genuinely good rather than diluted across six competing obligations. You give one thing at a time the whole of your attention and it shows in what comes out."
          },
          {
            "label": "THE CORRECTION OVERSHOOTS",
            "text": "Two needs that ought to share a week end up taking turns instead, each fully displacing the other for a stretch. A month of strict discipline gives way to a month of complete release, and then the release gets corrected by more discipline than the first round ever had. Every swing feels like the reasonable answer to the one before it, which is precisely what keeps the cycle running under its own power. You judge yourself by how completely you are doing whichever thing you are currently doing, so a moderate week reads as a week of not really trying. The unease underneath is that a middle position gives both things less than they deserve, and giving something less than everything feels like the start of not caring. The swinging costs more than either extreme was ever worth, and that arithmetic never gets done."
          },
          {
            "label": "TAKE THE SMALLER VERSION",
            "text": "Next time the pull to swing hard in either direction arrives, take the deliberately smaller move — one day rather than a month, an hour rather than a whole weekend. Write down what the full swing would have been and what you did instead, the same evening, so the two sit beside each other. Do this three times before the fortnight is out, whichever direction the pull comes from."
          }
        ]
      },
      "15": {
        "title": "The Devil — The Tension of an Unexamined Pull",
        "fields": [
          {
            "label": "CAPABLE OF HONEST LOOKING",
            "text": "Honest self-description comes more easily to you than it does to most, and it does not need softening before you can hear it. You can look at your own behaviour without immediately converting it into a story where you come out well, which is rare and uncomfortable and yours. Intensity is no problem for you either, since you can stay with something difficult at full strength rather than backing off to a safe distance. You can name what you are doing while you are still doing it."
          },
          {
            "label": "RESIST, RELAPSE, RESOLVE AGAIN",
            "text": "Under stress the pull gets acted on before it gets looked at, whether it points toward control, toward comfort, or toward one particular way of being with somebody. Afterwards comes the resolve to resist, held with real seriousness, and then the next difficult week, and then the same act again. The cycle has three positions and you occupy all of them in rotation, while the actual question of what the pull provides stays unasked the whole way round. Fighting the thing head-on gives it your full attention every single day, which is how a habit stays central to a life while being officially opposed. Your worth is staked on self-control, so each relapse arrives as evidence about your character rather than as information about a need. The reason the pull never gets examined is what examining it might reveal you have been going without for years. All that energy goes into the fight, and the answer never gets any of it."
          },
          {
            "label": "ASK WHAT IT SUPPLIES",
            "text": "Put the pattern into one plain sentence on paper, with no verdict attached and nothing added to soften how it reads. Underneath, write what you get in the ten minutes after acting on it — the actual relief, named exactly, not the version you would admit to. Do this once, this week, at a moment when the pull is quiet rather than active. Then leave the page where you can find it again next time it is loud."
          }
        ]
      },
      "16": {
        "title": "The Tower — The Tension of Ignoring the Warning Signs",
        "fields": [
          {
            "label": "KEEPING THE STRUCTURE UP",
            "text": "Keeping something functional under strain is a real skill and you have it, which is why arrangements around you survive conditions that should have finished them. You can run a household, a project or a commitment through a bad period without it visibly failing, absorbing the shocks yourself as they land. Stability is something you produce, not a place you happen to be standing inside. You know how a structure is actually held up, which parts are load-bearing and which parts are decoration. You keep things standing that would otherwise have come down."
          },
          {
            "label": "NOTHING IS WRONG HERE",
            "text": "Early signs of instability get met with maintenance of appearance rather than inspection of the fault. The crack is seen, since you are not blind to it, and then filed as a phase, a bad month, something that will settle if nothing is made of it. The reverse side of the pattern is how the collapses look afterwards: sudden from the outside, obviously signalled in hindsight, every warning legible in the record. You take your standing from things holding, so naming a crack out loud feels like causing the failure rather than reporting it. The fear is that a structure examined honestly proves unsound, and then you would have to act, and acting might mean losing it. Silence keeps open the possibility that it was fine all along. Each reckoning gets postponed until it is louder and more expensive than the one before."
          },
          {
            "label": "INSPECT THE WEAK JOINT",
            "text": "Identify one structure in your life that is currently showing strain — a plan, an arrangement, a commitment — and write down exactly what you have noticed and when you first noticed it. Say the same thing to one person involved in it within the next five days, in plain words and with no solution attached. Take one concrete step on the smallest fixable part of it this month, while it remains small enough to be dull. Do the writing tonight."
          }
        ]
      },
      "17": {
        "title": "The Star — The Tension of Dimming Right Before Being Seen",
        "fields": [
          {
            "label": "TAKEN FURTHER THAN MOST",
            "text": "Your work sits at a level of development most people never reach with anything, and that is a fact about the work rather than a hope about it. You hold insight and hope that would land on somebody the moment it was handed over at full strength. The material is already useful to a person struggling with exactly the thing it addresses. What is in question is only the handing over, never the quality of what you are holding. Offering it whole costs far less than the withholding has already cost you, and that comparison is not close. You reach somebody with the full-strength version the moment you stop trimming it down first."
          },
          {
            "label": "SMALL AT THE EDGE",
            "text": "The pull happens at one precise point: where something real of yours would become visible to another person. You offer a smaller version instead, cut back to whatever feels defensible, and you call that modesty. The second half of it is slower, because the ability itself stays half-grown, kept away from the exposure that developing it fully would demand. You value yourself for being safe rather than for being seen, so an unfinished thing nobody has judged still feels like an asset. Underneath sits the fear that at full brightness you turn out to be ordinary, and that the private version is then gone for good. The gift stays known to you alone, which is the outcome none of the protecting was ever aimed at."
          },
          {
            "label": "SHOW IT UNFINISHED",
            "text": "Take one real piece of your work and put it in front of one person this week, before it feels ready and without the sentence that lowers it first. Say what it is, hand it over at full size, and then stop talking. Write down afterwards what actually happened, in plain terms, and set that beside what you had braced for. Do the same again inside the same fortnight with something slightly larger than the first."
          }
        ]
      },
      "18": {
        "title": "The Moon — The Tension of Trusting an Unverified Story",
        "fields": [
          {
            "label": "READING UNDER THE SURFACE",
            "text": "You read situations underneath what is actually being said, and you arrive there well before facts turn up to confirm it. That perception is real information rather than nerves, and it catches the shape of something early enough to be worth having. Almost nothing gets past you at the level of tone, timing, and what somebody is carefully not saying. You pick up what is happening in a room long before anybody in it says so."
          },
          {
            "label": "FILLING IN THE GAP",
            "text": "Ambiguity is the trigger, and the gap between not knowing and needing to know closes in a matter of seconds. You fill it with the worst coherent version available and then treat that version as confirmed rather than as something you wrote. From there the decisions follow the story — you withdraw, you pre-empt, you turn down whatever looked risky — and afterwards it does not hold up against what was going on. Seeing it coming ahead of everyone else is what makes you feel competent, so a frightening reading feels like skill and a calm one feels like sloppiness. The fear driving it is that being caught unprepared is the single thing you could not survive, so real chances get spent on a version of events nobody ever checked."
          },
          {
            "label": "EVIDENCE AGAINST VOLUME",
            "text": "Write down the next anxious story in full, in one paragraph, on the day it arrives rather than a week later. Underneath it list only what you directly saw or heard with nothing added, and mark every line of the story that rests on none of it. Leave the marked lines alone for twenty-four hours before you act on any of them, and run the same exercise on the next three stories that turn up this month."
          }
        ]
      },
      "19": {
        "title": "The Sun — The Tension of Performing Brightness",
        "fields": [
          {
            "label": "EASE INTO A ROOM",
            "text": "Warmth comes off you reliably, and it works on the days when the circumstances give it nothing at all to work with. You bring the temperature of a hard situation down without making a project of it, which is a skill rather than a manner. It holds under real pressure, which is where most warmth stops being available. You steady somebody's worst hour just by staying in the room and sounding like yourself."
          },
          {
            "label": "BRIGHT ON HARD DAYS",
            "text": "Difficulty is exactly where the performance switches on, and the harder your day is the more convincingly easy you sound. One expression of it is the covering itself, an appearance of being fine held up in front of everybody including those closest to you. The second half is the imbalance underneath: you make room for whatever other people are carrying and build nothing equivalent for your own. So you end up genuinely alone on your worst days, in company that was never told anything was wrong. You get your value from being reliably fine, so admitting difficulty reads as failing at the only job you hold without effort. The fear underneath is that the unlit version of you is not something anybody would stay for."
          },
          {
            "label": "SAID WHILE IT HURTS",
            "text": "Let someone you trust know about a difficulty while it is still happening, rather than once it has resolved and become safe to report. Give it plainly, without the joke at the end, and without first checking whether this is a good moment. Sit through whatever pause follows instead of steering the conversation back toward them. Choose a day that is genuinely hard rather than one you picked because it was manageable. Do that inside the next seven days rather than waiting for a week that looks better."
          }
        ]
      },
      "20": {
        "title": "Judgement — The Tension of Preparing Instead of Rising",
        "fields": [
          {
            "label": "CLARITY LANDS EARLY",
            "text": "Clarity arrives for you well ahead of the moment you are willing to move on it, and it arrives accurate. You know what the decision is, what the direction is, what has to end, and you know it early. The knowing is not vague; it comes with detail, and it holds up when you look at it again months later. What you already have is enough to act on, and further gathering adds nothing that changes the answer. Your judgement about what needs to change is one of the sharpest things you own. You see the ending or the turn coming while everything still looks workable from outside."
          },
          {
            "label": "ONE MORE CONDITION",
            "text": "Something needs to change and you already know precisely what it is, which is the exact point where the stalling starts. One version of it looks like preparation: more reading, another opinion, one further condition that has to be met before anything can begin. The other version is cleverer, a set of genuinely good reasons for waiting that you would not accept from somebody else. What sits below it is a fear of acting on your own certainty and being wrong with no one available to carry that with you. Your standing with yourself rests on having never moved too soon, so delaying feels like rigour instead of what it actually is. Nothing ever arrives to release you, because the missing piece was never information in the first place. Clarity sits unused for months while you build a case for something you settled a long time ago."
          },
          {
            "label": "MOVE ON IT NOW",
            "text": "Name the single action your current clarity is pointing at, in one sentence, written somewhere you will see it. Take the first concrete step toward that before this week is out: the message sent, the form filed, the conversation opened. Gather nothing further beforehand, and treat what you know already as sufficient grounds for moving. Let the step itself be the next thing you learn from, and pick the one after it from there."
          }
        ]
      },
      "21": {
        "title": "The World — The Tension of Refusing to Call Something Finished",
        "fields": [
          {
            "label": "ALL THE WAY THROUGH",
            "text": "You care about doing a thing properly, right through to the parts nobody inspects, and you do not abandon work halfway. That thoroughness is genuine and it shows plainly in the things you make, which is why extending them feels responsible to you. You have patience for the unglamorous last twenty percent that most work never receives. Knowing the difference between done and perfect is the single piece missing, and the care underneath it is already there. You build things to a standard that would survive anybody's inspection, including your own."
          },
          {
            "label": "ALWAYS NEARLY DONE",
            "text": "The edge of completion is where this switches on, with the project nearly delivered and the goal nearly reached. You extend it instead, adding a stage, widening what counts, or complicating something that was ready to close an hour ago. Everything you make gathers just short of the line, and none of it is ever formally called finished by you. You measure your worth by having something still in progress, because an open thing cannot be judged and a closed one can. Below all of it runs a fear that a completed thing is a verdict on you, so almost nothing in your life ever gets to feel done."
          },
          {
            "label": "NAME THE FINISH",
            "text": "Pick something that is, in practical terms, already complete and say aloud today that it is finished, attaching no further condition to it. Write the date beside its name somewhere you keep records, and allow yourself no additions to it after that point. Mark the close in some ordinary way within the week, with a meal or an evening off or whatever you would give somebody else for theirs."
          }
        ]
      },
      "22": {
        "title": "The Fool — The Tension of Leaving Before Staying Gets Hard",
        "fields": [
          {
            "label": "COURAGE AT THE START",
            "text": "Beginnings find you ready in a way that most people never manage, with real nerve at the point where everything is still unknown. You will leap while others are still working out whether the ground holds, and that willingness is openness rather than recklessness. The courage in it is genuine courage, the same substance the middle of anything asks for. You start things that would not otherwise exist, and you start them without needing to be talked into it."
          },
          {
            "label": "PAST THE FIRST EXCITEMENT",
            "text": "The moment a thing stops being new is the moment the pull starts, and it arrives on schedule. A relationship, a project, a commitment moves past its opening stretch and begins asking for ordinary sustained presence instead of nerve. Something in you turns immediately toward the next fresh start, and the reasons for going arrive already dressed up as insight. Behind you the other half accumulates: a wide, colourful run of beginnings and very few things carried all the way through. You take your worth from the leap itself, from being somebody who can start anything, which leaves the unexciting middle feeling like proof of nothing. Deeper down you worry that staying long enough to be fully known would show the leaving to be the interesting part of you. So the middles stay untested, and so does the version of you that only a middle could build."
          },
          {
            "label": "STAY THROUGH THE FLAT",
            "text": "Choose one commitment you currently hold and set a date eight weeks out, written down, before which you will not decide anything about leaving. Keep going through the flattest stretch of it without reopening that question, even on days when the case for going feels obvious. When the urge to begin something else arrives, put the new idea on a list and leave it sitting there untouched. Watch what you do inside that commitment once excitement is no longer carrying any of it. Look at the whole thing again on the date you set, and not one day earlier."
          }
        ]
      }
    },
    "codes": {
      "The Wizard / Secret Knowledge": {
        "title": "The Wizard — The Tension of Protecting Unusual Ability",
        "fields": [
          {
            "label": "UNUSUAL AND USABLE",
            "text": "Something you can do sits well outside the ordinary range, and it is sharp enough to change how a hard situation turns out. You see the move that has not occurred to the room yet, and it arrives with the specificity of a thing practised rather than guessed at. Handed over instead of held, that capability does the exact good it was built to do, in the narrow moments that call for it. You take the rare thing you know, put it into the room, and the afternoon ends somewhere other than it was heading."
          },
          {
            "label": "GUARDED WHEN NEEDED",
            "text": "The moment that ability would genuinely help, your first instinct is to stay quiet and let the situation resolve without it. It shows as silence in the meeting where you hold the answer, and as leaving the rare skill off the table in the very place it was made for. Value that could have moved something real goes unspent, week after week, with only you aware it was ever there. Your worth sits in the unspent version of the ability, so it lives in the keeping and never in the use. What you cannot risk is offering it and watching it get weighed as ordinary, because the rarity itself is what you are actually protecting. The more unusual the thing you carry, the more isolating it becomes to carry it out of sight."
          },
          {
            "label": "OFFER IT SMALL",
            "text": "Pick the lowest-stakes situation on your calendar before Friday and put the unusual thing you know straight into it, without framing it as a favour. Watch what happens inside you in the ten minutes afterwards and write that down before you sleep rather than reconstructing it later. Do it again the following week in a situation one size larger."
          }
        ]
      },
      "Wasted Talent": {
        "title": "Wasted Talent — The Tension of Capability Left Undeveloped",
        "fields": [
          {
            "label": "STRONGER THAN TESTED",
            "text": "A real talent sits under this, and it holds up under full effort in a way you have quietly suspected for a long time. Your work is good at the stage you keep it, which is why the last stretch of it is the only part that feels risky. Tried openly rather than kept close, it turns into finished pieces that exist outside your own head and can be looked at. An honest attempt that falls short costs nothing of the talent itself, which is exactly as strong the morning after. You push the work beyond the stage where you usually stop and find out where the ability actually runs out."
          },
          {
            "label": "SHORT OF THE CEILING",
            "text": "The pattern fires when a piece of work is one step away from being seen at its real size, and your hand comes off it. That looks like a folder of near-finished things, each abandoned at the point just before judgement becomes possible. It also looks like using the skill at a level you know is under what you have, because a merely competent showing cannot fail. Your standing rests on potential, so you feel large in proportion to what an all-out attempt might one day produce. A full attempt that lands as merely decent is the outcome you will not have, since the untried version stays excellent indefinitely. So the ceiling remains a rumour, including to you. Real ability goes undiscovered by the one person who is in any position to test it."
          },
          {
            "label": "SEND IT UNFINISHED",
            "text": "Take the piece closest to done, stop working on it tonight, and hand it to one person by Thursday with no note explaining what it would have been. Allow yourself a fixed hour for the handover and spend none of that hour on repairs. Record the same evening what you actually felt in the hour after it left you. Repeat the whole thing with a second piece a fortnight later."
          }
        ]
      },
      "The Prisoner": {
        "title": "The Prisoner — The Tension of an Old Sense of Confinement",
        "fields": [
          {
            "label": "WALLS WORTH CHECKING",
            "text": "Your read on what is dangerous was built out of real experience, and it has carried you through conditions that deserved every bit of caution. You locate the edges of a situation faster than the situation announces them, and you organise around those edges without thinking about it. Checked against how things actually stand now, that same awareness sorts the limits that still hold from the ones that expired years ago. There is more room in your life than the old caution assumes, and it turns up by testing the walls one at a time. Most of what gets treated as fixed was fixed under conditions that have already moved on. You put your weight on a limit and find out which side of it you have been standing on."
          },
          {
            "label": "THE UNTESTED LIMIT",
            "text": "Around any real choice, the assumption arrives ahead of the evidence: the restriction is permanent, so there is nothing here to examine. That surfaces as a standing sense of confinement in one specific area, and as an explanation, ready before anyone asks, for why the situation cannot be otherwise. Years pass inside a boundary that was accurate once and has not been re-checked since. Knowing your limits precisely is where your competence sits, so accepting the wall reads as realism rather than defeat, which makes it unusually hard to hand back. The prospect you keep away from is pressing on one and finding it solid, because an assumed wall still leaves you the version of yourself who could have walked through it."
          },
          {
            "label": "PUSH ONE WALL",
            "text": "Name one restriction you have been treating as fact and put beside it the last date you genuinely checked. This week, take a single concrete step that only works if the limit is softer than you think: one email, one application, one direct request. Decide nothing in advance about what the result means, and log what happened within a day of doing it. Start with the smallest wall rather than the one that matters most."
          }
        ]
      },
      "World of Passions / Temptation": {
        "title": "World of Passions — The Tension of Appetite Outrunning Judgment",
        "fields": [
          {
            "label": "WANTING AT FULL STRENGTH",
            "text": "Appetite in you runs at a size that most spend their adult lives trying to get back rather than trim down. You want things vividly, the wanting registers in your body, and that intensity is why ordinary days have any charge in them at all. Set alongside a working sense of cost, the same intensity lets you want something completely and still decline it. Desire and judgement stop racing each other once judgement is given the few seconds it needs to arrive. You hold a want at full strength and choose against it without the wanting getting any smaller."
          },
          {
            "label": "THE PULL DECIDES",
            "text": "Put something intense within reach and the decision has already been taken before any weighing occurred. It surfaces as choices that felt unarguable at the time and, examined a month later, cost several times what they appeared to. It surfaces again as an inability to sit between the wanting and the taking, which is the only place the cost was ever visible. Feeling alive is tied for you to the strength of what you feel, so slowing down registers as a reduction in you rather than a decision. The force of the pull gets taken as evidence that the choice is correct, when it is only evidence that the pull is strong. What you back away from is a cooler, smaller life where nothing grips you like this again, and one deliberate pause feels like the first step into it."
          },
          {
            "label": "SIXTY SECONDS FIRST",
            "text": "For the next two weeks, put sixty seconds between the moment the pull arrives and the moment you act, timed rather than estimated. Use the minute to say out loud what this will have cost by next month, in money, hours or people, and be specific about the figure. Keep the want exactly as it is and move only the timing."
          }
        ]
      },
      "Family Betrayal": {
        "title": "Betrayal of Family — The Tension of Pride Over Loyalty",
        "fields": [
          {
            "label": "AMBITION AND BELONGING",
            "text": "The drive to get somewhere is real in you, and it is the reason you did not simply remain where you were put. Self-respect and ambition make you take positions and hold standards that nobody handed you at the start. Once advancement stops requiring distance from family to feel legitimate, both can be true in the same week without either one shrinking. You keep the ambition and stay close to the people you came from, and neither costs you the other."
          },
          {
            "label": "PRIDE ABOVE THE CLAIM",
            "text": "Inside family, the reflex is to defend position rather than stay loyal to people with a fair claim on your care. It plays out as friction that happens only there, while the identical conversation is handled easily in every other setting. It surfaces too as a distance you describe as necessary, maintained long after the reason for setting it stopped applying. The status you grant yourself comes from having risen, from being further along than the point you started at. Family relationships end up carrying a strain that nothing else in your life carries. Backing down feels like handing back the ground you covered, and the pride defended in those moments is guarding something far smaller than it claims to be. You will not risk being folded back into the person your family remembers, as though the whole climb had only ever been provisional."
          },
          {
            "label": "ONE APOLOGY, NO CONDITIONS",
            "text": "Choose one family relationship and make a single act of humility inside it this week: an apology, an admission, or a direct ask to repair something. Do it without a preface about what they did and without a condition attached anywhere in the sentence. Say the thing, then stop talking instead of filling the pause with the rest of your case."
          }
        ]
      },
      "Sorcerer, Hermit, Rejection of Knowledge": {
        "title": "The Guarded Hermit — The Tension of Trusting No One With What You Carry",
        "fields": [
          {
            "label": "REACHED AS YOU REACH",
            "text": "There is a depth to how you take things in, and it has been developing for years with almost none of it on display. You perceive what runs underneath a conversation and you usually know it early, which is why difficulty in another person rarely catches you out. Offered rather than kept back, that depth is what closeness is actually made of: being known as you are instead of managed into an acceptable shape. You already reach other people all the way in, and the return journey is the one that has not been made. Opening it costs you none of the perception, and it is the only way the perception gets used at close range. You let somebody reach as far into you as you routinely reach into them."
          },
          {
            "label": "CONFIDED IN, NEVER CONFIDING",
            "text": "Whenever trust is genuinely on the table, caution goes first and warmth follows a beat behind, and the gap between the two is the distance you keep. You end up as the person everyone brings things to while remaining, by any fair measure, hard to get at. It shows up equally in relationships that earned more than this long ago, where you still hand over the tidy version of what you think. Your standing comes from doing the understanding rather than receiving any, so being reached would move you out of the only position that has ever felt safe. What you steer around is saying something true and seeing it treated casually afterwards, so the caution stays permanently on and gets called discretion."
          },
          {
            "label": "TELL ONE UNREADY TRUTH",
            "text": "Tell the person who has already earned it one real thing about yourself this week, before you have finished working out how to say it. Choose something you would normally save for later rather than the safest item available. Do it in person or on a call, where you cannot quietly edit yourself back into the acceptable version. Give it thirty seconds and leave off the qualifier you will badly want to add. Afterwards, note what it was like in your own body rather than what they did with it."
          }
        ]
      },
      "Magical Sacrifice": {
        "title": "The Watchful Influence — The Tension of Power That Still Needs Checking",
        "fields": [
          {
            "label": "INFLUENCE THAT LANDS",
            "text": "What you notice about a situation carries weight, and when you put it into a negotiation or a piece of guidance, the situation moves. That is a genuine capacity and not a trick of confidence: you see what would actually change the outcome, and you are usually right about it. Held together with honest self-examination, that weight becomes something usable on purpose, at the size the moment really calls for. Your relationship with your own power settles the moment you can name what you want out of using it, before you use it. You exercise influence deliberately, in measured amounts, and you know exactly why you reached for it."
          },
          {
            "label": "GRABBING OR REFUSING",
            "text": "Anywhere your read could shape what happens, the response goes to one of two ends and rarely lands between them. One end is reaching for more sway than the moment asks for, pressing an outcome that was arriving on its own. The other is declining to weigh in at all, in the situations where what you see would plainly have helped the person asking. The same split runs through your interest in spiritual and esoteric material, drawn to it and wary of it in equal measure, unsettled about whether you are studying it or being pulled along by it. Beneath both ends is an open question about whether your motives are clean, and it stays open because it never gets put to you directly. Your self-respect is built on restraint, on not misusing what you hold, so a single overreach reads as confirmation of the worst account of you. The possibility you will not examine is that you would enjoy the power, so you swing wide of it rather than hold it steady."
          },
          {
            "label": "NAME THE MOTIVE ALOUD",
            "text": "Before your next act of real influence, say your actual motive to yourself in one spoken sentence, including the part you would rather leave out. Do this every time for a fortnight, whether the situation is large or completely trivial. Keep a running note of those sentences so there is something to read back once the fortnight closes. Change no decisions in the first week; only make the motive audible before you act."
          }
        ]
      },
      "Love Magic": {
        "title": "Love Magic — The Tension of Earning Love Through Self-Sacrifice",
        "fields": [
          {
            "label": "DEVOTION WORTH RECEIVING",
            "text": "Few things in you run deeper than the willingness to invest in the people you love, and it is not a performance. You give attention, effort and hours at a scale that keeps a relationship alive through stretches when nothing at all is coming back. Once the devotion stops having to buy its place, it becomes mutual: given freely because it also arrives freely. You state what you need plainly and remain just as devoted, and the two turn out to be one skill."
          },
          {
            "label": "PAYING FOR A PLACE",
            "text": "Wherever love feels uncertain, your answer is more, more accommodation, more adjusting, more of yourself removed to make room. It appears as relationships that require steadily heavier giving to stay upright, and as needs of your own that get traded for instead of spoken. It appears again as an emptiness that stays exactly the same size however much goes into it. You feel entitled to the relationship in step with what you have put in, which makes the giving the only proof you hold of your place in it. The emptiness then gets read as a shortfall in your effort rather than as the result of an arrangement that was never mutual. What you will not test is whether you would still be chosen when nothing is being added on top, so the giving never stops for long enough to find out."
          },
          {
            "label": "STATE THE NEED FLAT",
            "text": "State one specific need out loud to somebody this week, in a plain sentence, with nothing extra attached to soften the asking. Do nothing additional for them in the twenty-four hours either side of saying it. Say it once and leave it stated rather than converting it into a favour you now owe back. Write down what that day was actually like before the story about it settles into place."
          }
        ]
      },
      "Rebel": {
        "title": "The Rebel — The Tension of Opposing on Reflex",
        "fields": [
          {
            "label": "AUTONOMY WITHOUT THE FIGHT",
            "text": "Independence in you was earned rather than adopted, which is why expectations that were never yours slide off with so little effort. You can hold a position under pressure from somebody who wants a different one, and their agreement is not a condition of your sleeping. A refusal to be run by other people is a serious asset the moment it comes apart from automatic opposition. Closeness entered on purpose is a different thing from closeness accepted by default, and you are unusually well set up for the first. Independence and belonging stop competing as soon as you notice it was you entering them against each other. You choose the people you are close to deliberately, precisely because none of it is obligatory."
          },
          {
            "label": "OPPOSING BEFORE WEIGHING",
            "text": "Around family and around anyone holding authority, the pushing back begins before the expectation itself has been read. It runs as reflexive distance, rejecting the request or the plan or the invitation on principle, whether or not the request was reasonable. It runs equally as a feeling of being an outsider inside relationships that are genuinely close, held at a careful self-protective length. Your sense of yourself is built on being uncontrollable, so agreeing with somebody in authority feels like giving away a piece of who you are. Underneath sits a suspicion that one yes is the start of being managed permanently, so the reflex fires early and cuts you off from people with no interest in managing you at all."
          },
          {
            "label": "REACH FIRST, NO TERMS",
            "text": "Single out one relationship you are currently holding at a distance and make one direct, small move toward it before the weekend. Make that move without waiting for a sign they have earned it and without attaching any condition to it. Keep it concrete, a call, a visit, an invitation with a date on it, rather than a general softening of attitude."
          }
        ]
      },
      "Physical Suffering": {
        "title": "The Guarded Body — The Tension of Bracing Against Pain That Hasn’t Arrived",
        "fields": [
          {
            "label": "ATTENTION THE BODY WANTS",
            "text": "You notice what is happening in a body before most would, your own and those of anyone whose wellbeing sits with you. That attention is real information and it has protected people, which is how it earned the authority it now holds over you. Settled into ordinary consistency, the same attention becomes care that runs at one dependable level instead of in bursts. The body turns into something you can rely on rather than something under permanent review or entirely ignored. You give your body regular, unremarkable attention and let that be the whole of the arrangement."
          },
          {
            "label": "ALARM OR NOTHING",
            "text": "Around health, your own or that of somebody close and fragile, you go to hypervigilance or to complete avoidance, with almost nothing in between. One side is a low tolerance for ordinary discomfort, where a normal ache becomes a question that has to be settled today. The other side is skipping the appointment for a year and treating the whole subject as a luxury for those with time to spare. A minor health scare involving somebody you love takes on a size that has no relation to the facts of it. Staying vigilant is how you know the matter is being taken seriously, so easing off around the body reads as negligence rather than as trust. Peace of mind gets spent at both ends of that swing, and neither end gives the body the steady attention it is asking for. Underneath is an expectation that pain is coming, and bracing for it feels safer than living at the level of what is actually happening."
          },
          {
            "label": "SAME CARE, SEVEN DAYS",
            "text": "Settle on one moderate act of physical care, a walk, a meal, an hour of sleep, one appointment, and do exactly that, at the same size, every day for a week. Do not increase it on the days that frighten you and do not drop it when you feel fine. Keep the whole thing small enough that a bad week cannot break it. Mark each day off on paper somewhere the row of them stays visible. Book the appointment you have been putting off into that same week, whichever direction you were putting it off in."
          }
        ]
      },
      "Warrior": {
        "title": "The Warrior — The Tension of Meeting Every Challenge as Combat",
        "fields": [
          {
            "label": "COURAGE INSIDE CONFLICT",
            "text": "Conflict does not make you go quiet or vague, and you can make a decision while the disagreement is still live. You take responsibility for direction when no one wants to hold it, and you can say the unwelcome thing without your voice changing. Once winning stops being the requirement, that nerve becomes the ability to steer a disagreement toward a result that holds afterwards. You walk into hard conversations on purpose and bring them out the other side with the relationship intact."
          },
          {
            "label": "EVERY ROOM A CONTEST",
            "text": "Disagreement registers as something with a winner in it, and your response begins before the actual question has been understood. It shows as collaborations turning adversarial for reasons nobody, including you, could name afterwards. It shows as an ordinary difference of view hardening into a position you now have to hold, because easing off halfway would count against you. What you think of yourself is tied to not being beaten, so conceding a point feels like conceding something much larger. Trust gets spent in relationships that were never contests, and the leadership underneath all of it finds nowhere constructive to go. You cannot sit with being outmatched in front of yourself, so an ordinary disagreement gets converted into a fight you already know how to have."
          },
          {
            "label": "GO IN WITHOUT WINNING",
            "text": "Take one disagreement already scheduled this week and decide in advance, in writing, what a shared result would look like. State that intention at the start of the conversation instead of holding it as a private plan. When the urge arrives to close the point down, name it silently to yourself and keep asking questions for another two minutes. Write the result down the same day, including the parts you gave up."
          }
        ]
      },
      "The Solitary Woman": {
        "title": "The Solitary Woman — The Tension of Staying Just Out of Reach",
        "fields": [
          {
            "label": "OPEN WITH THE RISK",
            "text": "Self-protection in you is skilled rather than nervous, and it has held you together through the kind of loss that flattens most. You know precisely how far to let something in so that its ending would remain survivable, and that calculation runs without any effort. Allowed to sit alongside real closeness instead of replacing it, the same instinct lets you stay open while knowing exactly what the openness could cost. Relationships go as deep as they are capable of going once the distance stops being a standing arrangement. You let one relationship go further in than the safe measurement allows, on purpose, with a clear view of what you are risking."
          },
          {
            "label": "PLEASANT AND SEALED OFF",
            "text": "As soon as something begins to deepen, it gets held at a survivable distance, warm and reliable and never fully open. That looks like relationships which are perfectly good from outside and quietly incomplete from where you are sitting inside them. It looks as well like withholding the one piece of yourself that would make you properly reachable, kept as a reserve you never spend. Your steadiness has always come from needing nobody, so needing somebody would remove the very thing that holds you upright. The distance kept to prevent one loss is quietly producing a slower kind of it, and the possibility you keep out of reach is that the closeness was survivable the whole time."
          },
          {
            "label": "ONE INCH NEARER",
            "text": "Let one relationship currently kept at a comfortable distance move a single step closer than feels entirely safe this week. Make the step specific, one thing said, one plan made, one evening given, instead of a broad decision to be more open. Afterwards, write down what actually occurred rather than what you had expected would occur."
          }
        ]
      },
      "The Unborn Child": {
        "title": "The Unborn Child — The Tension of Withholding Warmth From Fear of Loss",
        "fields": [
          {
            "label": "CARE THAT RUNS DEEP",
            "text": "Tenderness toward family runs deeper in you than almost anything else does, and it is far quieter than it deserves to be. You think about continuity, about who comes after and what gets passed along, with a seriousness that few subjects ever get from you. The care is already at full size internally, and only the delivery of it is rationed. Handed over without rationing, that tenderness reaches the people it was always meant for and stops being something you carry by yourself. Closeness with family can match the depth of feeling that has been sitting under it the whole time. You give the warmth at the size it actually is, while the people it belongs to are here to take it."
          },
          {
            "label": "WARMTH ON RATION",
            "text": "Around children, around family continuity, around a parent you have stayed slightly cool toward, the response is quiet guardedness in place of open affection. It runs as overprotectiveness with the ones you love most, managing their safety rather than simply enjoying them. It shows up too as a difficulty being fully at ease within your own family, where part of you stays on duty throughout. Holding a portion back is what makes the love feel safe to have, so the reserve has become your evidence of handling it responsibly. The guardedness rations exactly the warmth it was set up to protect, and the reserve is in the room every time you are with them, named or not. You are protecting against loving without limit and losing them anyway, as though the warmth withheld would be the portion you got to keep."
          },
          {
            "label": "GIVE IT UNRATIONED",
            "text": "Give one person, a child, a parent, or yourself, one deliberate and unguarded act of warmth this week, with nothing kept in reserve. Make it something that takes an hour instead of a message, and do it on a day with no occasion attached to it. Notice the exact moment you want to pull part of it back, and finish the hour regardless."
          }
        ]
      },
      "The Oppressed Soul": {
        "title": "The Oppressed Soul — The Tension of Waiting for Permission",
        "fields": [
          {
            "label": "WEIGHING WITHOUT DEFERRING",
            "text": "Other people's views land properly with you, which is why you rarely act rashly and almost never make the loud, obvious mistake. You can hold three positions in mind at once and see accurately what is right about each of them. That consideration turns into discernment the moment it sits alongside trust in your own read instead of standing in for it. A life built around what you actually prefer is still informed by everyone you listened to; it simply stops requiring their signature. You take the whole picture into account and then decide the thing yourself."
          },
          {
            "label": "WAITING ON A SIGN-OFF",
            "text": "At every real decision point, the move is to defer, to check, to ask, to wait for direction that was not necessarily on its way. It appears as a life arranged around expectations that other people set, with your own preferences kept in the background and rarely priced. It appears as decisions already made privately and then held open for weeks while you look for somebody to confirm them. You give yourself credit for being considerate, so moving without the check would put the one quality you count on at risk. The waiting carries on long after anybody was actually asking you to wait. You will not carry a decision that goes badly without another name attached to it. Deferring keeps the responsibility shared, and a whole life gets shaped by permission instead of by preference."
          },
          {
            "label": "DECIDE IT ALONE",
            "text": "Make one real decision this week entirely on your own terms, and pick one large enough to be uncomfortable. Tell nobody until it is done and cannot be reopened. Resist explaining your reasoning afterwards to anyone who has not asked for it. Put a deadline of Friday on it so the deciding does not become another long stretch of considering."
          }
        ]
      },
      "The Emperor": {
        "title": "The Emperor — The Tension of Authority Without Balance",
        "fields": [
          {
            "label": "RESPONSIBILITY YOU CAN HOLD",
            "text": "You can take charge of a situation that needs it, which is a specific ability rather than simple confidence. Direction, decisions and the weight arriving with them are all things you can carry when carrying them is what the moment requires. Steadied between the two ends, that capacity becomes authority that is present without pressing down and available without going missing. You hold power at a constant level and stop treating it as something that must be either seized or dropped."
          },
          {
            "label": "GRIP THEN ABSENCE",
            "text": "Authority itself is the trigger, your own or a father's, and you land at one extreme or straight across at the other. One version is over-controlling everything within reach, down to details that would have been perfectly fine unattended. The other is stepping out of responsibility altogether and leaving the situation to sort itself, which reads from inside as generosity. The same instability shows in a relationship with a paternal figure that keeps catching on the identical recurring friction. Whichever end you are on feels like a sensible response to circumstances, when it is one unsettled question about power arriving in two different forms. Deciding for everybody is what steadies you, so the middle setting reads as holding no power at all, and you avoid discovering how much of your steadiness was only the grip."
          },
          {
            "label": "TRY THE MIDDLE ONCE",
            "text": "Pick one area where you currently either take over or check out, and run it at the middle setting for a single week. Decide beforehand what you will hold and what you will leave, and write both lists out before the week begins. When you feel the pull to take the whole thing back, wait an hour before acting on it. Separately, write one page about the father figure this friction attaches to and what forgiving him would cost you. Keep the page and send nothing."
          }
        ]
      },
      "The Spiritual Priest": {
        "title": "The Spiritual Priest — The Tension of Doubting a Knowing That Runs Deep",
        "fields": [
          {
            "label": "PERCEPTION AHEAD OF PROOF",
            "text": "Insight arrives in you well before the reasoning that would support it, and it is accurate at a rate that makes discounting it expensive. You perceive how a situation is actually put together, or how a person is, at a depth that most never develop the patience for. Spoken rather than kept, that perception becomes guidance which only comes into existence once somebody says it out loud. It does not have to be provable to be useful; it has to be true enough to give somebody a place to stand. You say the thing you sense before the proof exists, and it does its work in the open."
          },
          {
            "label": "DISCOUNTED IN ADVANCE",
            "text": "Whenever your own perception asks to be trusted in public, the retreat begins and the sentence stays unsaid. You mark your reading uncertain in your head at the moment it is most accurate, before anybody outside has had the chance to. The moment goes instead to somebody with less at stake and less to say, and the clarity remains private. Your credibility with yourself rests on having claimed no more than you could demonstrate, so speaking early would put that whole record at risk. Each unspoken instance confirms the verdict that the knowing was unreliable, and you cannot face saying it plainly, being wrong, and losing the one position you have always been able to retreat to."
          },
          {
            "label": "SAY IT UNPROVEN",
            "text": "Before Wednesday, tell one person out loud something you already know to be true, without waiting for proof you could offer. Mark it as a read rather than a fact, and then leave it there instead of taking it back. Note the date and the words you used, and look at that note again in a month. Do not add the sentence that turns the whole thing into a question."
          }
        ]
      },
      "Disappointment of the Lineage": {
        "title": "Disappointment of the Lineage — The Tension of Working Without Credit",
        "fields": [
          {
            "label": "EFFORT THAT OUTLASTS NOTICE",
            "text": "Long stretches of unrewarded work do not stop you, and that is unusual enough to state plainly. You put hours into something that has given you nothing back yet, and then you put in the same hours the following week. The effort is genuine and not a performance, which is why it holds up under conditions that quietly end most projects. There is a version of your working life where doing the thing is the entire payment, and you already know from the inside what that feels like. You keep building at a pace nobody outside you is setting."
          },
          {
            "label": "CREDIT THAT ARRIVES ELSEWHERE",
            "text": "Recognition is where this goes wrong, and it goes wrong in two directions at once. Your work meets delay, or slides past unnoticed, or arrives under somebody else's name, and the obstacles never look proportionate to what you actually put in. Meanwhile the wanting never switches off: praise lands, you feel it for an hour, and the hunger returns before the day ends. A resentment toward your family sits beside it, and you rarely say that part out loud. How you feel about yourself moves with whether the effort got seen, so a finished piece nobody mentions counts to you as a wasted month. Underneath the wanting is a dread that the work only amounts to something once somebody has said so, and that on its own it is nothing. That is why success itself can land hollow, because the part you needed from it was never the outcome."
          },
          {
            "label": "FOUR HOURS, NO MENTION",
            "text": "Choose the piece of work that interests you whether or not it ever gets mentioned, and put four hours into it before Sunday. Do the hours in the ordinary way, then note the date and the hours at the foot of the page and close it without telling a soul. Keep that page where only you will look, and add the next four hours to it the week after."
          }
        ]
      },
      "The Overseer": {
        "title": "The Overseer — The Tension of Managing What Isn’t Yours to Manage",
        "fields": [
          {
            "label": "TROUBLE SPOTTED EARLY",
            "text": "Trouble in a room reaches you early, usually before the person carrying it has admitted it to themselves. You notice the change in how somebody is speaking, and you know roughly what has gone wrong and what would ease it. The pull toward it is immediate and it comes from real care rather than nosiness or a wish to run things. Held until it is wanted, that same attention becomes company somebody can actually feel, because they reached for it themselves. You spot the person in difficulty and you move toward them without waiting to be told."
          },
          {
            "label": "HELP NOBODY REQUESTED",
            "text": "The moment somebody near you is struggling, you take over: direction, oversight, a plan they did not request, delivered before anybody asks whether they wanted one. The care behind it is real, and it does not change how the thing feels from the other side. What lands there is being watched and corrected by somebody who has decided they know better. Being useful is the price of admission you set for yourself, so an evening with nothing to fix leaves you strangely restless. That is the second half of it, because the helping is also how you stay necessary. Somebody who has stopped needing you is somebody you no longer know how to sit with. What you cannot bear is the thought that if you left them alone they would manage perfectly well without you. So the closeness you were building gets pushed off by the exact behaviour you were building it with."
          },
          {
            "label": "KEEP THE DIRECTION IN",
            "text": "Pick the relationship where you interfere most, and for six days keep every piece of direction you were about to give. Say the ordinary things, leave the fixing out, and each evening write down the one sentence you swallowed that day. On the seventh day read the six lines in a single go, and mark which were about them and which were about you."
          }
        ]
      },
      "Pride": {
        "title": "Pride — The Tension of Charm Curdling Into Superiority",
        "fields": [
          {
            "label": "CHARM ARRIVES FIRST",
            "text": "Presence is what you have, and it is working before you have said anything worth saying. You can hold the attention of a room without preparation and without effort, and you enjoy doing it, which is not a crime. Turned outward, that same pull makes the person opposite you feel larger rather than smaller, because your interest is a real force and it is not always aimed at yourself. You walk into a difficult situation and make it easier simply by being in it."
          },
          {
            "label": "ADMIRED AND UNKNOWN",
            "text": "There is a point where the ease hardens into a verdict, and the people it does not come easily to start looking small to you. You would deny the contempt, and it still runs quietly through how you treat almost everybody who cannot hold a room. Any setting where somebody else is the centre gets uncomfortable fast, and you leave those evenings early. The reverse shows up the moment admiration stops: warmth cools inside a week, and you start hunting for a livelier room where you are the most noticed thing present. How much you like yourself rises and falls with how much attention came your way today, which is a savage thing to hand to a random Tuesday. The dread you keep out of sight is that the charm is all there is, and that stripped of the effect you have on a room, nothing would be left worth staying for. So you end up with admiration in quantity and closeness in almost none, and the two get confused for long stretches."
          },
          {
            "label": "QUESTIONS FOR THE OVERLOOKED",
            "text": "Find the person you would normally write off as dull and give them a full hour this week, phone face down. Ask about the part of their life you know nothing about, and ask the second and third questions rather than only the first. Afterwards, note two things they said that you could not have guessed in advance. Do it again with the same person inside the month, since one hour is a sample and not an acquaintance."
          }
        ]
      },
      "Destruction and Death": {
        "title": "The Reckoning — The Tension of Disregarding the Human Cost",
        "fields": [
          {
            "label": "DRIVE THAT CLEARS OBSTACLES",
            "text": "Drive of this size is genuinely rare, and it keeps moving through the stretch where most efforts quietly stop. You hold a goal steadily across years, absorb setbacks that would end somebody else's attempt, and go at it again on the fourth morning. Obstacles tell you something about the route and never anything about whether the destination was right. Aimed with the human cost inside the calculation, that force lifts the situation of every person it passes, and it gets stronger for that rather than slower. You carry on well beyond where other efforts run out, and you hold your pace doing it."
          },
          {
            "label": "WINNING PAST THE DAMAGE",
            "text": "Whenever a goal is live, the harm done reaching it stops counting as part of the goal, as though the result and its cost were separate matters. The pull toward high-stakes situations belongs to the same pattern, because that is where the force in you has somewhere to go. Discomfort does arrive, late, at the point where damage to somebody becomes impossible to overlook, and by then it has cost trust the goal never required. A day counts for you when ground was gained, so a quiet week with nothing measurable in it registers as a week you were not properly alive. Beneath the drive is a dread of being ordinary, of finding that with the pursuit removed there is not much left in you that anybody, including you, would rate."
          },
          {
            "label": "COUNT THE DAMAGE TODAY",
            "text": "Take the pursuit you are most committed to and write down today the names of the people it has cost something, and what it cost each of them. Keep writing until the page holds the entries you would rather leave off it. Before Friday, change one thing about how you are running that pursuit, using the page as your reason. Keep the page, and ask it the same question again four weeks from now."
          }
        ]
      },
      "Physical Aggression": {
        "title": "The Coiled Response — The Tension of Meeting Stress With Force",
        "fields": [
          {
            "label": "STRENGTH THAT ARRIVES INSTANTLY",
            "text": "Real power sits close to the surface with you and arrives at full size the moment a situation calls for it, with no warm-up needed. You do not go blank when things turn hard; something in you rises to meet the moment, which is why you are still functioning when a situation gets ugly. Pointed at something that deserves it, that intensity becomes advocacy with weight behind it, the kind that changes what happens rather than merely registering an objection. You meet the worst moment in the room directly and stay standing inside it."
          },
          {
            "label": "FASTER THAN THE CHOICE",
            "text": "Stress lands and the surge is already moving before any calmer option has appeared on the list of things you might do. It comes out as an outburst, or as an edge in your voice that frightens a room with nothing raised. Afterwards you cannot account for how fast it went. Conflict has strained things around you more than once, and the charge that finds no way out stays in your body and shows up later as physical strain. Holding the harder line is how you know you were not walked over, and being walked over is the single outcome you treat as unsurvivable. Under the heat is an older hurt with no words attached, and the force stands over it so nothing gets close enough to press on it. The thing you cannot face is being that defenceless again with nothing quick enough to stop what happens next."
          },
          {
            "label": "SIXTY SECONDS FIRST",
            "text": "Learn your own two or three warning signs, the jaw or the heat or the change in your breathing, and name them silently as they appear. When they do appear, take sixty seconds and ten slow breaths before you say a word, and treat that minute as non-negotiable. Do this daily for seven days, in the small irritations as much as the large ones, because the small ones are where the practice actually happens."
          }
        ]
      },
      "The Dark Magician": {
        "title": "The Dark Magician — The Tension of Influence Without Consent",
        "fields": [
          {
            "label": "WHAT WOULD MOVE THEM",
            "text": "Reading what would move a person is close to automatic for you, and you are rarely wrong about which argument will land. Charisma does the rest, and a situation that would take weeks of argument resolves in an afternoon once you decide to work on it. Used on somebody who asked, that same skill is real help: you can get a person unstuck in one conversation on a problem they have been stuck on for a year. You shift a situation with words alone, and you feel the exact moment it turns."
          },
          {
            "label": "CONSENT NEVER REQUESTED",
            "text": "The skill goes to work whether or not anybody invited it, because the opening is there and using it costs you nothing you can see. Afterwards the shape shows: agreement was reached because you were persuasive, and not because the other person arrived anywhere under their own power. That is why the intensity keeps emptying out, since the thing looks charged and compelling from outside and from within you cannot locate a single decision that was fully theirs. How well you think of yourself depends on being able to turn any conversation your way, so a night where nothing moved leaves you feeling almost invisible. The dread is that with the steering switched off nobody would choose you unaided, and that what you have is technique where you wanted to be wanted."
          },
          {
            "label": "KEEP THE PITCH UNSPOKEN",
            "text": "For the next five conversations where you already know the sentence that would move somebody, write that sentence down instead of saying it. Carry on with the conversation without using it, and keep those sentences dated in one notebook until you have all five. On Sunday read the five together and mark the ones you would still say if somebody had asked you for them. Do the collecting in ordinary conversations rather than saving it for a difficult one."
          }
        ]
      },
      "The Sacrificed Soul": {
        "title": "The Sacrificed Soul — The Tension of Asking Without Words",
        "fields": [
          {
            "label": "CAREFUL NOT TO IMPOSE",
            "text": "Consideration runs deep in you, deep enough that you weigh the cost to somebody else before you have checked what you want yourself. You take up less room than you are entitled to, and you do it out of genuine regard rather than dislike of the person opposite. A need can sit in you for hours without being allowed to govern the conversation, which takes a discipline most would not manage. That restraint is not weakness, it is a real skill in reading what another person can carry right now. Paired with plain words, it becomes speech that is considerate and direct at once, and needs that get answered fully instead of partly. You put somebody else's comfort ahead of your own request without being asked to."
          },
          {
            "label": "HINTS INSTEAD OF SENTENCES",
            "text": "A need for care arrives and the words for it never do, so what goes out instead is the withdrawal, the small crisis, the meals visibly skipped. People answer the signal, generously and often, which is precisely the trouble. The answer comes close enough to make a plain request feel unnecessary and far enough away to leave the real thing untouched. The other expression is the self-neglect itself, where the ordinary upkeep of your life is allowed to slide until the state of you says what you will not. You feel entitled to a place in somebody's life in proportion to how little you cost them, so asking outright feels like taking more than your share. Deeper down is the dread of learning that the need was too much all along, and that the care you did get was politeness. So the real need stays chronically under-met, even by people willing to meet it."
          },
          {
            "label": "ONE SENTENCE, NO SIGNAL",
            "text": "Say the need you have been signalling longest to one person, in a single plain sentence with no explanation attached to it. Do it before Thursday, out loud rather than in writing, and let the sentence stop where it stops without trimming the last few words. Afterwards, do not withdraw the request or add that it was not really important. Repeat the same sentence later in the month if the need is still live."
          }
        ]
      },
      "The Warrior of Faith": {
        "title": "The Warrior of Faith — The Tension of Certainty That Leaves No Room",
        "fields": [
          {
            "label": "DECIDED, AND IT SHOWS",
            "text": "Your beliefs are settled to a degree most are not, worked out rather than borrowed, and they hold when things get loud. That gives you a stable centre, which is why an unresolved situation does not move you around according to whoever spoke last. Conviction of this kind does real work: it lets you commit early, act on it, and carry something through a long stretch where the reasons are invisible. You hold your position through pressure that shifts most people off theirs."
          },
          {
            "label": "THE CIRCLE QUIETLY NARROWS",
            "text": "A differing view appears and you are already assembling the reply rather than hearing the thing itself, and the conversation turns into something to be won. The strain shows in two places: relationships that have gone careful around you, and a circle narrowed until almost everybody in it already agrees with you. Being right is what you have instead of reassurance, so a lost argument does not feel like one point conceded, it feels like being wrong about everything. What you cannot allow is that a belief you organised your life around might not survive a serious objection. So the objection gets stopped before it is heard out. The narrowing costs you exactly the perspectives that would have tested that belief and made it stronger."
          },
          {
            "label": "READ THE OTHER CASE",
            "text": "Locate the strongest argument against a position you hold firmly, written by somebody who genuinely means it, and read it end to end this week. Then write three sentences summarising their case so accurately that they would put their name to it, leaving your own view off the page. Do it in a single sitting on a day when nothing has already irritated you."
          }
        ]
      },
      "Self-Destruction": {
        "title": "The Quiet Surrender — The Tension of Giving Up Before Trying the Next Step",
        "fields": [
          {
            "label": "HONEST ABOUT HOW BAD",
            "text": "Hard facts do not get softened on the way into you, and you carry the full weight of a bad stretch without dressing it up as a lesson. You know in detail what a difficult chapter is costing you while it runs, and that clarity is a capacity rather than a defect. Most manage discomfort by shrinking the story of it; you keep the size of the thing accurate even where accuracy hurts. Put together with actual care for yourself, that honesty is what recovery gets built out of, since nothing gets repaired by a person pretending things are fine. You state the true size of a hard month on the day it is happening."
          },
          {
            "label": "THE FIRST THING DROPPED",
            "text": "The same accuracy turns on you under hardship, where the difficulty stops being one obstacle and becomes proof that everything is finished. Maintenance goes first, the meals and the sleep and the walk and the message you meant to send, precisely where those small things were doing the most work. What you are worth, in your own reckoning, tracks how well things are going, so a rough season arrives as a verdict on you. The dread you never state is that the low reading is the accurate one, and that the hopelessness is the truth rather than a symptom of the hardship. Stopping early is quieter than trying and finding out, so the next step goes untested and a hard chapter becomes harder than it needed to be."
          },
          {
            "label": "ONE KINDNESS BEFORE TONIGHT",
            "text": "Do one concrete act of care for yourself today, before the evening: a proper meal, an hour of sleep you would have skipped, the walk you keep postponing. Then say the difficulty out loud to one person you trust, in the plain version, without the summary that makes it sound manageable. Do both today rather than when you feel more able, since feeling able is not the condition either of them runs on. Put the same two items on tomorrow's list, and on the list for the day after. Keep that list to three days and no further, since three days is as far as you can currently see."
          }
        ]
      },
      "The Dictator": {
        "title": "The Dictator — The Tension of a Confident Mask Over Real Doubt",
        "fields": [
          {
            "label": "NOTHING SHOWS ON YOU",
            "text": "Composure comes to you on demand and it holds in situations that visibly rattle everybody else present. You take bad news, keep your face level, and give the next instruction in a voice that has not moved, which is a real capacity and not a trick. Under genuine pressure your thinking stays available to you, so a decision still gets made while the situation is going sideways. You keep working at the exact point where things stop being manageable for the people around you."
          },
          {
            "label": "DOUBT NEVER SPOKEN ALOUD",
            "text": "Doubt arrives in you the way it does in everybody, and it goes straight behind the front. More certainty in the voice, tighter control of the details, nothing showing anywhere. The second expression is the swing, where you over-function for everybody nearby, carry more than your half without mentioning it, and then resent an imbalance you arranged yourself. You believe you are worth having around only while you are the capable one, which makes admitting uncertainty feel like withdrawing your own qualification. So the doubt stays private, worked through alone at night, and never said to the people closest to you. The dread is being seen mid-uncertainty and watched while somebody works out whether you are still worth listening to. The cost is closeness built entirely on the finished version of you, with the rest never shown. The front works well enough that you lose track of what sits behind it yourself."
          },
          {
            "label": "SAY THE DOUBT UNRESOLVED",
            "text": "Say one real and current doubt out loud this week to somebody you trust, without the framing that turns it into a problem already solved. Hand it over unfinished, including the part where you do not know what to do next, and stop talking before you start reassuring them. Pick the doubt that is most uncomfortable to give away rather than the safe one you have rehearsed. Do it before the week turns, in person, and without an agenda for the conversation afterwards. Notice what you do with your hands while you are saying it."
          }
        ]
      }
    }
  };
  window.DKarmicDebtContent = {
    get: function (arcanaNum) { return T.nodes[arcanaNum] || (prev && prev.get(arcanaNum)) || null; },
    getCode: function (name) { return T.codes[name] || (prev && prev.getCode(name)) || null; },
  };
})();
