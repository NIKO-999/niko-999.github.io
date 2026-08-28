'use strict';
/*
 * purpose-content.js — second-generation overlay.
 *
 * Layered on top of js/purpose-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DPurposeContent — 66 records
(function () {
  const prev = window.DPurposeContent;
  const T = {
    "positions": {
      "PP": {
        "1": {
          "title": "1 in Personal Purpose — The Magician",
          "fields": [
            {
              "label": "THE DOOR STILL OPEN",
              "text": "Ideas arrive in you already whole, and you turn them into something real while more careful minds are still weighing the first objection. Your life keeps opening doors that stay open only for the person who walks through without a plan, and each one asks less about your ability than about whether you will own what follows. A false start registers as information rather than as evidence you should have stayed home, so you are moving again within days. What you sense is possible and what the calendar and the money allow are never the same size, and you work in the gap between them instead of complaining about it. You catch openings that would have shut by the time somebody else finished deliberating."
            },
            {
              "label": "STARTING INSTEAD OF FINISHING",
              "text": "Beginning is how you avoid finishing. The moment a piece of work stops being new the pull toward the next opening turns almost physical, and you are left holding a shelf of strong openings and not one finished thing. You also move fast enough that nothing gets a long look at you struggling, so being capable has quietly become a way of staying unknown. Your self-respect runs entirely on how quickly you can get something moving, which is why a slow fortnight lands as a verdict on your character instead of a description of a fortnight. Below that you dread that staying with one thing long enough for it to be tested would show more about you than any beginning ever has to."
            },
            {
              "label": "THE UNGLAMOROUS NEXT STEP",
              "text": "Pick the project that stopped being exciting some time ago and do its next dull step before you touch anything new. Give it forty minutes today, with the next opening left unopened on the other tab. Write the step after that at the bottom of the same page, and do that one tomorrow."
            }
          ]
        },
        "2": {
          "title": "2 in Personal Purpose — The High Priestess",
          "fields": [
            {
              "label": "THE READ BEFORE EVIDENCE",
              "text": "You arrived already knowing things, not facts so much as patterns, undercurrents, and the shape of whatever somebody is carefully not saying. Your read of a room turns out accurate long before anything surfaces to prove it, and the question underneath your life is whether you will move on your own perception before anything has confirmed it. You hold the provable and the felt side by side without forcing either one to collapse into the other. When you finally say what you sense, it lands with a weight that no amount of explaining could have manufactured. You act on information nobody has handed you a reason to trust yet."
            },
            {
              "label": "WATCHING FROM OUTSIDE REACH",
              "text": "What you know, you keep. Because it arrives without any chain of reasoning attached you learned to hold it back instead of defending it, and the holding back hardened into a habit of watching. You end up understanding somebody more accurately than they understand themselves while staying a full arm outside their reach, which feels safe and is lonely. The private proof that you count is being right where nobody can check the working, so an unshared correct read is worth more to you than a shared one. You would rather not discover that saying a thing plainly and getting it wrong costs more than the silence ever cost. So the accurate readings pile up unspoken and the habit gets a little more permanent each year."
            },
            {
              "label": "SPEAK IT UNJUSTIFIED",
              "text": "Speak something you sense today, out loud, to somebody likely to disagree, before you can lay out why. Put it as a statement rather than a question, and drop the qualifier that would turn it into an opinion. Stay in the conversation for two more minutes without retreating into evidence you do not have. Do the same again on Thursday with a different person."
            }
          ]
        },
        "3": {
          "title": "3 in Personal Purpose — The Empress",
          "fields": [
            {
              "label": "FERTILE AND PATIENT",
              "text": "Something in you keeps wanting to bring things into existence, whether that is work, a room, a meal, or another person's nerve. Your circumstances keep arranging themselves so that something could grow if you tended it, and what you are here to learn is that what you grow may carry your name. You cultivate at the pace of a living thing instead of shoving it toward a result, and you hold real plenty without hoarding any of it. You turn a sense of how life could feel into an actual object somebody can pick up."
            },
            {
              "label": "EVERYTHING FOR SOMEBODY ELSE",
              "text": "Everything you grow, you grow for somebody. You pour genuine, sustained making into another household or another person's project and file the whole thing under generosity, while your own unmade work sits where it has always sat, scheduled for after. What tells you that you are any good is how much of yourself went into something that was not for you, so a day spent on your own work carries a faint feeling of theft. What you will not risk is a thing made purely for yourself announcing what you actually care about, and that announcement is more exposing than any amount of giving. So the giving goes on and the exposure never arrives."
            },
            {
              "label": "MAKE IT UNADDRESSED",
              "text": "Make one thing this week that has no recipient at all, something that exists only because you wanted it to exist. Do not dedicate it, do not give it away, and do not explain it to anybody who asks. Keep it somewhere in your own house for a month before you decide anything else about it."
            }
          ]
        },
        "4": {
          "title": "4 in Personal Purpose — The Emperor",
          "fields": [
            {
              "label": "BUILT TO HOLD LIFE",
              "text": "Order arrives in you as an instinct and not as a discipline, so you see something disorganised and part of you is already fixing it. Responsibility keeps landing on you earlier than seems fair, and the first half of your life is where you find out that a structure exists to hold a life rather than to fence it in. You build in years while most of what happens around you is planned in weeks. The things you make are still standing long after the fast ones have gone, because you designed them for load and not for launch. You carry real authority without needing to sit on top of every decision inside it, which leaves room for other hands to build. You keep what a structure is for connected to what it costs in hours and hard calls."
            },
            {
              "label": "TIGHTENING WHEN UNCERTAIN",
              "text": "Control is what you offer when you mean care. Uncertainty makes you tighten, so there are more rules, more oversight, and more of the weight carried personally, and because you are genuinely good at this the tightening works well enough in the short term to keep itself going. Over years it builds a life where nothing moves unless you move it and every piece of it is bolted to you. Your steadiness inside depends on being the person the whole arrangement rests on, which is why handing over a small piece feels much larger than it is. You cannot stand the idea that loosening your grip by any amount is the thing that brings the arrangement down. So you keep holding it, and the holding is what makes it fragile."
            },
            {
              "label": "LEAVE THE BAD VERSION",
              "text": "Hand one thing that genuinely matters to somebody else this week and let it be run badly, without taking it back when you see how it is going. Say nothing about the parts you would have done differently, for the whole seven days. Write down on the last evening what actually broke and what merely offended you. Then hand over the next one."
            }
          ]
        },
        "5": {
          "title": "5 in Personal Purpose — The Hierophant",
          "fields": [
            {
              "label": "THE INHERITANCE UNDER TEST",
              "text": "A framework was handed to you early, whether religious, familial, cultural or professional, and you absorbed it thoroughly enough to speak it fluently. Life keeps setting you down in places where the inheritance does not quite fit, and sorting which parts of it are genuinely yours is the whole assignment. You examine what you were given and keep only what survives the examination, which is slower than following it and slower than throwing it out. What you eventually hand on has been through your own life instead of merely repeated from the source you got it from. You revise a doctrine by living against it and keep the parts that hold."
            },
            {
              "label": "CERTAINTY ON LOAN",
              "text": "Borrowed certainty comes out of your mouth as though you had earned it. The framework works and you can lay it out convincingly, so you spend years speaking with an authority that came from somewhere else, passing on answers that have never been put under pressure you personally applied. The settled answer in your mouth is what holds you upright, so a question you cannot field lands harder than its size warrants. You flinch from the thought that opening the inheritance would mean opening a case against the ones who gave it to you, and that reads as a betrayal you are not willing to commit. So the doctrine stays sealed and gets quoted. The parts of your own experience that contradict it get filed as your failure to apply it properly."
            },
            {
              "label": "ONE BELIEF UNDER SCRUTINY",
              "text": "Take one belief you have held since before you could examine it and put it under your own scrutiny this week. Find out who handed it to you and what it was protecting, before you decide whether it stays. Keep the parts that survive the questioning and say plainly which parts did not."
            }
          ]
        },
        "6": {
          "title": "6 in Personal Purpose — The Lovers",
          "fields": [
            {
              "label": "TWO REAL GOODS",
              "text": "Two genuinely good options keep presenting themselves at once, two paths or two people or two versions of the life you get, and both of them are defensible. Choosing at all is the assignment, and then staying with what you chose after the road you did not take starts looking better in memory. You hold competing pulls without pretending the losing one was never attractive, and once you have chosen you go in fully instead of keeping a foot in the corridor. You stop waiting for the decision that costs nothing and take one that costs something."
            },
            {
              "label": "KEEPING BOTH DOORS",
              "text": "Nothing gets chosen, and you call that fairness. Keeping every option breathing feels open and generous, and it functions as a way of never being answerable to any direction at all, so roles and commitments get held near enough to feel real and loose enough to leave. You count yourself decent by the fact that no door has been shut on your account, which makes a firm no cost you more than it costs most. You would sooner keep everything open than meet the version of yourself who has to live with a choice that went wrong. The unchosen options are not costing you nothing, though; they are costing you the years you spend keeping them warm. And the life you would have had by now is not one you can go back and begin."
            },
            {
              "label": "CLOSE THE OTHER ONE",
              "text": "Choose one of the open things this week and let the other go completely, not shelved and not saved for later. Tell one person the choice out loud, in a sentence that carries no conditions after it. Take the first action that only makes sense if the decision holds, within three days of saying it. Delete or return whatever belonged to the option you dropped. Do not check on it again this month."
            }
          ]
        },
        "7": {
          "title": "7 in Personal Purpose — The Chariot",
          "fields": [
            {
              "label": "MOMENTUM THAT OPENS THINGS",
              "text": "Movement is your default answer, and while other efforts are still weighing options you are already three moves in with the thing underway. Momentum opens routes that careful planning would never have found, and what you are here for is finding out what you drive toward, because force without a destination is only speed. You hold drive and rest together without letting either one take over the other. An obstacle registers as ground to cross and not as an insult, which is exactly what keeps you going through conditions that stop most attempts. You aim real force at something you actually chose rather than at whatever is nearest."
            },
            {
              "label": "SPEED INSTEAD OF STILLNESS",
              "text": "Going somewhere is how you avoid being anywhere. Motion reads as progress, and as long as you are moving you never have to sit still long enough to feel whatever is waiting underneath it, so the schedule stays full and nothing gets felt. The people nearest to you are dragged along behind instead of travelling with you, because your pace was never something they got to negotiate. You certify yourself by distance covered, which is why an empty afternoon feels less like rest and more like a small collapse. Speed is also how you stay ahead of anything slow enough to catch up with you. There is a dread under this: that if you stopped, whatever the movement has been outrunning would still be sitting there waiting. So you do not stop."
            },
            {
              "label": "STOP THE VEHICLE ONCE",
              "text": "Stop once this week, on purpose, and spend twenty minutes with nothing running, no list, no screen, no next thing lined up. Ask where you are going and who is still with you, and record whatever surfaces in the first five minutes of the stillness. Do not restart the moment it gets uncomfortable."
            }
          ]
        },
        "8": {
          "title": "8 in Personal Purpose — Justice",
          "fields": [
            {
              "label": "THE EXACT INTERNAL SCALE",
              "text": "Imbalance registers in you before it registers anywhere else, in a contract, a room, a friendship, a division of work nobody has remarked on yet. Your assignment is discovering what your own standard costs and choosing it deliberately instead of applying it on reflex. You apply to yourself the exact measure you use on everything else, which is where almost every fair-minded approach quietly stops. You can deliver a hard and accurate assessment without any need for it to wound, so the accuracy arrives intact. Partial information and mixed motives do not stop you reaching a usable judgement about what is genuinely fair here. You apply a real standard to an untidy world and come out with something that holds."
            },
            {
              "label": "THE ACCOUNT NEVER CLOSED",
              "text": "Mercy is the one thing your scale has never weighed. The same instrument that catches unfairness out in the world runs all day on your own conduct, and there is an old sense of having been treated unfairly that you are now quietly re-arguing on everybody else's behalf. You hold others to standards you would not say out loud, and you keep a running account of who owes what, which nobody agreed to and nobody can settle. Your footing depends on being demonstrably in the right, so an unfair thing you let pass sits in you for weeks. You cannot bear the thought that a world where accounts never balance makes the whole standard pointless, and that the exactness cost you something for nothing. So the auditing continues and the audit never closes."
            },
            {
              "label": "LEAVE ONE THING UNEVEN",
              "text": "Allow one genuine imbalance to stand this week without correcting it, naming it, or arranging for it to be corrected later. Choose one where you are the person shortchanged rather than one where somebody else is. Sit with it for the full seven days and record on the last day what it actually cost you. Then decide, once, whether it was worth the correction you did not make."
            }
          ]
        },
        "9": {
          "title": "9 in Personal Purpose — The Hermit",
          "fields": [
            {
              "label": "WHAT SOLITUDE PRODUCES",
              "text": "Solitude is a requirement in you rather than a preference, and you have had less of it than the requirement asks for. Your real processing happens alone and out of sight, and the point is not the going in but the coming back out with something. You can be entirely self-sufficient without it souring into isolation, genuinely content in your own company instead of merely putting up with it. What you find in there is sharper and more usable than anything you could produce under somebody watching a clock. You bring a piece of that back into ordinary language and hand it to somebody who needs it."
            },
            {
              "label": "SOLITUDE BECAME AN ADDRESS",
              "text": "The passage turned into a place you live. Withdrawal genuinely restores you, which is exactly what makes each longer stretch of it so easy to justify, and the re-entry costs more every time you postpone it. Your substance comes from being unreachable, so any long run of ordinary availability begins to feel like being thinned out into nothing. The thing you will not test is whether putting what you found into plain words would make it ordinary, and whether the depth was only depth because it had never been heard. So it stays in there with you, undiminished and unused."
            },
            {
              "label": "BRING ONE THING BACK",
              "text": "Tell one specific person this week what you actually worked out in there, in plain words, without the apparatus that got you to it. Say it to a face or a phone, not into a notebook and not into a post. Do it before this stretch of solitude has finished, while the version you have is still rough."
            }
          ]
        },
        "10": {
          "title": "10 in Personal Purpose — Wheel of Fortune",
          "fields": [
            {
              "label": "STEERING AND RIDING",
              "text": "Cycles show up in your life more plainly than in most, with things rising and falling on a schedule that has little to do with how hard you pushed. Telling apart what is yours to steer from what is yours to ride is the task, and spending your strength only on the first. You can read which phase you are actually in, rising or contracting, instead of treating every piece of noise as a signal about your future. You keep the long pattern and the specific month in view together and spend from both."
            },
            {
              "label": "GRIP OR GO SLACK",
              "text": "Both of your errors look like the opposite of each other. In one you grip, working variables that were never in your hands and reading every downturn as a personal verdict; in the other you go slack and hand the whole thing to fate, quietly abandoning the parts that genuinely were yours to move. Either way the work that actually needed your strength goes untended, and the phase turns anyway. Your confidence is funded by the feeling that you had a hand in how things went, so a good stretch you cannot explain unsettles you nearly as much as a bad one. Underneath the gripping is a dread that you have no real purchase on any of it, and that holding whatever you can touch is all that stands between you and nothing. That is why the grip tightens hardest exactly when it is least use."
            },
            {
              "label": "NAME THE UNCONTROLLED PIECE",
              "text": "Name one thing today that is genuinely outside your control, write it on paper, and stop spending anything on it. Move the hours you were giving it onto the one part of the same situation that does answer to you. Look at the paper again on Friday and mark whether you actually stopped. Keep the paper where the work happens."
            }
          ]
        },
        "11": {
          "title": "11 in Personal Purpose — Strength",
          "fields": [
            {
              "label": "SOFT AND UNBROKEN",
              "text": "Endurance in you does not look like endurance, because where most things harden under pressure you stay soft and simply fail to break. What you are here to recognise is that as strength, and not as fragility that has been lucky so far. You stay present with raw and unruly states in yourself without either suppressing them or handing them the controls. Gentleness and weakness are two different things to you, which is what lets you be soft without ever being walked over. You hold enormous pressure open-handed and come out of it still able to feel things."
            },
            {
              "label": "TOLERATING PAST THE END",
              "text": "Staying is the only strength you have ever practised. Your capacity to remain open under strain makes you extremely good at tolerating arrangements a harder person would have left years earlier, and the strength itself becomes the reason you are still inside them. Your self-regard is built almost entirely on being unbreakable, so an exit reads as the disproof of the one thing about yourself you were sure of. You also absorb the strain instead of naming it, so the weight of it never gets written down anywhere, including by you. You dread that walking out would prove the endurance was never strength at all, only a long inability to move. So you stay, and from the inside the staying looks like the same virtue it started as. The years it costs do not appear anywhere you are counting."
            },
            {
              "label": "LEAVE SOMETHING THIS WEEK",
              "text": "Use the strength this week to end something instead of to withstand it, and pick the one you have carried longest. Say it is finished in plain words on a day you choose rather than on a day it forces, and take the practical step that makes it real within forty-eight hours. Let the leaving be the demonstration this time."
            }
          ]
        },
        "12": {
          "title": "12 in Personal Purpose — The Hanged Man",
          "fields": [
            {
              "label": "THE ANGLE FROM SUSPENSION",
              "text": "Suspension is built into your life, in stretches where forward motion is simply not on offer and you are held in place while something reorders itself. Letting that change the angle you see from is the job, and treating the pause as the work rather than as time going to waste. You can hold a decision open without anxiety, trusting that the holding is doing something real. What you see from a standstill is unavailable to anything still travelling, which is why what you come back with is worth the interval. You read a situation from underneath it and find the thing no moving version of you could have found. You come down with something in your hands rather than with an explanation for the delay."
            },
            {
              "label": "THE PAUSE MOVED IN",
              "text": "Waiting stopped being a season and became who you are. What started as a genuine fallow period turned into the arrangement itself, so you wait for conditions, for clarity, for something that would count as permission. The waiting builds its own case for continuing, and the case gets more persuasive the longer it runs. Real time passes while it does and real openings close, and none of that registers as a cost because nothing you did caused it. Your sense of yourself as somebody serious depends on the pause meaning something, so calling it a stall would take away more than the stall itself takes. You cannot face the possibility that coming down into choice puts you back where being wrong about something is possible again. So the meaning keeps accumulating and nothing gets decided."
            },
            {
              "label": "SET THE CONDITION DOWN",
              "text": "Write down today, in concrete terms, what would have to be true for the waiting to be finished. Take one real step toward that condition before the weekend, something with a cost attached instead of another round of thinking. Put a date beside the condition and look at the page again in thirty days. Do not add a second condition in the meantime. Say the first one out loud to yourself before you start."
            }
          ]
        },
        "13": {
          "title": "13 in Personal Purpose — Transformation",
          "fields": [
            {
              "label": "RELEASE INSTEAD OF PRISING",
              "text": "Who you have been is not something this position lets you keep, because it ends things structurally, a career or an identity or a relationship, at intervals across your life. Learning to release rather than to be prised loose is what this asks, since the ending arrives either way and only the manner of it belongs to you. You can let an old version of yourself die so a truer one gets the room, and you recover quickly from genuine loss by taking in what it showed you. You close things while they are still closable and start the next one standing up."
            },
            {
              "label": "DEFENDING WHAT ALREADY ENDED",
              "text": "Long after something has actually ended you go on holding it upright. A role you outgrew, an arrangement finished in every way except formally, and you defend it as though defending were loyalty instead of avoidance, which is how a dead thing gets years of your attention. Calling it over would land on you as an admission that the entire thing failed, and that everything you put in was waste. How you rate yourself is tied to the things you have kept going, so an ending on your record reads as a mark against you. The energy that belongs to whatever comes next stays fully committed to something that is no longer there."
            },
            {
              "label": "CLOSE ONE THING PROPERLY",
              "text": "Close one finished thing this week: say out loud that it is over and do not fill the space with a replacement. Take the practical action that shuts it, the message or the cancellation or the handover, before the week ends. Keep the next fortnight empty where it used to be."
            }
          ]
        },
        "14": {
          "title": "14 in Personal Purpose — Temperance",
          "fields": [
            {
              "label": "BLENDING WITHOUT A FORMULA",
              "text": "Mixing things that do not obviously belong together is your actual skill, pace with patience, ambition with ease, what other lives need with what yours does. The judgement to keep adjusting, rather than arriving somewhere and calling it balanced for good, is what develops in you across these years. You blend in the proportion this particular situation asks for instead of applying a ratio you worked out years ago on a different problem, and you moderate your own extremes without effort. You hold a mix steady across decades while every ingredient in it changes underneath you."
            },
            {
              "label": "THE MIDDLE AS ESCAPE",
              "text": "The middle is where you go to avoid deciding. Because finding it comes easily, you use it to never fully back anything, so every position arrives hedged and every intensity gets diluted. A strong feeling is answered by its counterweight before it has finished being felt, which is why so little of what you feel ever reaches full size. Nothing in your life is badly out of proportion, and nothing in it is fully yours either. Your evenness is the trait you take the most pride in, so a week where you went too far at something would unsettle you more than a year of not going far enough. You cannot stand the thought that committing entirely to one thing would cost you everything else on the scale, permanently and without appeal. So the scale stays level and nothing on it gets any weight."
            },
            {
              "label": "LET ONE THING TIP",
              "text": "Let one thing this week be genuinely disproportionate and give it far more of you than its fair share, without balancing it afterwards. Pick something you already want rather than something that needs doing, and let the other commitments run thin for those days. Note on Sunday what actually suffered and by how much. Do not average the week out in your head."
            }
          ]
        },
        "15": {
          "title": "15 in Personal Purpose — The Devil",
          "fields": [
            {
              "label": "APPETITE SEEN STRAIGHT",
              "text": "Appetite runs in you at a higher volume than the version of yourself you show, for pleasure, for intensity, for power, for being wanted. Plain honesty is the entire assignment: knowing precisely what you want without acting it out compulsively and without pretending it is absent. You examine your own hunger head on, without flinching off it and without dressing it up as something more respectable. That unflinching accuracy, and not the pretending, is what makes any real freedom possible for you. You name what you want in the exact size it is and stay standing afterwards."
            },
            {
              "label": "SHAME KEEPS IT RUNNING",
              "text": "Something has you, and the direction of the relationship reversed a while ago without any announcement. A habit, a person, a hunger; you are serving it now, and the lucid part of you knows precisely that. The awareness running alongside the compulsion is what manufactures the shame, and the shame produces concealment, and the concealment is what protects the compulsion. Discipline is the word you would reach for about yourself first, so an honest inventory would take down considerably more than the habit. You would rather not say the attachment out loud, because saying it plainly makes it undeniable, and undeniable is the one condition you cannot manage around. Every account you give of yourself is edited around that single omission. So it stays unnamed and it stays exactly as it is."
            },
            {
              "label": "SAY THE TRUE WANT",
              "text": "Say the true thing about what you want this week, out loud, to one person who will not flinch at it. Give it the actual size instead of the manageable version, and attach no apology and no plan to fix it. Say it once, then stop talking. Stay where you are for whatever comes after, and do not fill the pause. Write the sentence out first if that helps you keep the size."
            }
          ]
        },
        "16": {
          "title": "16 in Personal Purpose — The Tower",
          "fields": [
            {
              "label": "WHAT THE COLLAPSE LEFT",
              "text": "A collapse sits somewhere early in your adult life, usually taking down the exact thing you had built most of your identity on. The work is not the collapse itself but what it teaches you about the difference between what fell and who was standing there afterwards. You recover fast from real upheaval, absorbing what it exposed rather than merely outlasting it. That is a different and rarer capacity than toughness, and it is why the fall left you with something usable. You can tell a necessary collapse from an unnecessary one, so the honesty the fall taught you does not turn into a habit of breaking things that were working. You rebuild on ground you have tested yourself rather than on ground you were handed."
            },
            {
              "label": "LIVING BRACED",
              "text": "After the fall you live braced, and the bracing has outlasted anything that justified it. You keep an exit in view at all times and treat stability as a trap you are far too clever to walk into, so nothing you have now is anything you would grieve. You respect yourself for the composure, so lowering the guard feels less like relief and more like giving something up. Investing fully in anything again would set up the identical collapse you already survived, and you carry a dread that a second one would leave nothing standing. The half of you that lost actual money and actual years is not wrong, and the half that can explain what the collapse revealed is not the entire account. So you stay braced, and the bracing costs you the years the collapse did not."
            },
            {
              "label": "BUILD SOMETHING LOSABLE",
              "text": "Build one thing this month you would genuinely grieve losing, and commit to it without keeping an exit in view. Pick something with real time in it rather than something you could walk away from on an afternoon. Give it ninety days before you reopen the question at all. Put the ninety-day date in the calendar today."
            }
          ]
        },
        "17": {
          "title": "17 in Personal Purpose — The Star",
          "fields": [
            {
              "label": "THE FULL SIZE",
              "text": "There is a clear picture in you of a better arrangement, for your own life or for something larger than it. You have looked straight at the hard parts, at what it would cost and what has already failed, and the hope survived that looking. That is why what you say lands as honest rather than sunny, and why it holds when somebody presses on it. Warmth of that kind spreads without any performance of cheerfulness behind it. You hold a hope at its true scale and the full account of its cost in one head, without letting either cancel the other."
            },
            {
              "label": "SHRUNK BEFORE TESTING",
              "text": "Shrinking the hope happens before anyone has a chance to test it, and it happens fast enough to feel like judgement. You state a smaller version, hedge the size of it, and leave yourself room to say you never expected much anyway. The second move is naming that shrinkage realism, or humility, or a refusal to jinx something, which makes it look like maturity. Being right about how little was coming is where your worth settles, rather than in having wanted it out loud. Underneath sits a fear that a hope said at full size and then disappointed would be more than you could carry. So the disappointment gets paid in advance, in small instalments, every time you describe something you want."
            },
            {
              "label": "SAID AT SCALE",
              "text": "Say one hope out loud this week, at its real size, to one person you actually talk to. Give it no qualifier in front and no escape clause behind, and hold off on the laugh that usually follows. Beforehand, write down what you are afraid would happen if you said it fully and it came to nothing. Read that page back the following day and mark which parts of it you still believe."
            }
          ]
        },
        "18": {
          "title": "18 in Personal Purpose — The Moon",
          "fields": [
            {
              "label": "SOURCE UNMARKED SIGNAL",
              "text": "You take in more than you can account for, moods and atmospheres and what somebody meant underneath what they actually said. It arrives with no label attached saying where it came from, which is the whole difficulty and the whole gift at once. Ambiguity does not force you into early certainty, so you work inside a situation that has not resolved and still trust what you pick up. You hold two contradictory feelings at the same time and act on the one that fits, without settling first which of them is true."
            },
            {
              "label": "FOG READ AS FACT",
              "text": "Fog gets treated as evidence, so an anxiety that arrived with no cause attached ends up with one built for it. The cause you build points at yourself almost every time, and the absorbed feeling gets filed as information about your character. Both moves feel like honesty, which is exactly why the pattern survives years of being looked at. What you are worth, in your own accounting, rests on having explained yourself correctly, so an unexplained state reads as a personal failure. The fear beneath it is that an anxiety left unattributed would be harder to bear than a false account blaming you."
            },
            {
              "label": "TRACE ONE BACK",
              "text": "Pick one anxiety that turns up regularly and spend twenty minutes this week writing down when it started and whose house it came from. Then set it against something concrete in your present circumstances and check, item by item, whether the facts match the feeling. Do that on paper instead of in your head, because the version in your head edits itself while you look at it."
            }
          ]
        },
        "19": {
          "title": "19 in Personal Purpose — The Sun",
          "fields": [
            {
              "label": "UNFORCED VITALITY",
              "text": "Warmth moves out of you into a room without any decision on your part to switch it on. It is vitality rather than technique, which is why it never reads as a performance to somebody standing in it. The real question underneath this position is whether you can be met as you are instead of as the version that reliably works. Confidence is available to you that does not need constant brightness underwriting it before it counts as legitimate. Being ordinary in company is also available, and the warmth is not spent by a stretch of hours when you stop supplying it. You bring life into a room by being in it and keep that light attached to the person producing it."
            },
            {
              "label": "THE MANAGED DIM",
              "text": "Brightness has stopped being an expression and become a duty you are on the hook for the moment you walk in. Because lifting the mood is your job, your own bad stretch has nowhere public to go and gets handled quietly on your own. There is a second piece to it too: a self that never runs dim in company, maintained so carefully that the effort disappears. Difficulty gets buried under that version rather than said out loud, and it stays buried long after it stops being manageable. You value yourself as the reliable source of lift instead of as a person entitled to unremarkable days. What sits below the management is a worry that one flat day would let down everyone who has arranged themselves around your light. So the light runs to schedule, and it hollows out at the rate anything does once it is being met as a quota."
            },
            {
              "label": "SEEN FLAT",
              "text": "Let somebody you see regularly get one ordinary hour of you this week, with no lift supplied and nothing manufactured. Not a crisis and not a confession, just a plain version that answers questions honestly and offers no extra energy. If the urge arrives to raise the temperature of the room, sit still and leave that moment as it is. Write down afterwards how many minutes you lasted before reaching for the lift, and put that figure somewhere visible. Repeat the same hour three days later with the same person."
            }
          ]
        },
        "20": {
          "title": "20 in Personal Purpose — Judgement",
          "fields": [
            {
              "label": "THE CALL ALREADY HEARD",
              "text": "Some direction in your life is already known to you, and the missing piece has never been clarity about what it is. It might be a body of work, a reckoning with something unfinished, or a single conversation you have been circling for months. You are able to move on a summons before rehearsing it, on the understanding that readiness assembles itself somewhere after the first step. You can also look over your own record and assess it accurately, without inflating what you did or flattening yourself for it. You act while the thing is still frightening, which is what turns a direction you know about into one that is underway."
            },
            {
              "label": "PERPETUAL ALMOST",
              "text": "Preparation is where the delay lives, and each round of it is reasonable enough to survive any honest audit. You gather further information, wait for better conditions, and take steps that are genuinely useful and cost you nothing irreversible. The other shape it takes is a running commentary about the call, kept alive well enough that discussing it stands in for answering. Worth arrives for you from the seriousness of your preparation rather than from what you have actually put at risk. Under all of it runs a fear that answering and then failing would confirm something worse than never having answered. Every move stays safe precisely because none of them is the one that shuts a door behind you."
            },
            {
              "label": "PAY FOR THE STEP",
              "text": "Take one action this week that costs something real: money that does not come back, a conversation that changes an arrangement, a door that shuts. Do it ahead of the next round of preparation, in whatever imperfect form it can take by Friday. Choose the smallest version that still carries a genuine cost, so that size is not what stops you. Tell one person the date you did it and what it cost you, in plain figures."
            }
          ]
        },
        "21": {
          "title": "21 in Personal Purpose — The World",
          "fields": [
            {
              "label": "BUILT TO CLOSE",
              "text": "Finishing is the part you are actually built for, the full arc rather than the promising opening stretch. You bring the difficult sections and the good ones into one completed whole, instead of keeping only what flatters the work. Completion satisfies you in itself, not merely as a gate to whatever comes next but as the thing you were after. You find out what it is to be somebody who closes things, and that changes how you start every one that follows."
            },
            {
              "label": "ONE MORE REGION",
              "text": "The frame keeps widening because you genuinely can see further, one more element, one more region, one more connection worth including. Scope creep works as evasion here, and it is convincing evasion because the additions are real improvements and not obvious stalling. You measure your own value by the size of what you can see rather than by what you have put down finished. Beneath the widening lies the worry that a finished piece of work faces a judgement the still-expanding version never has to meet. So it does not close, and the work sits permanently at the stage where it cannot yet be wrong."
            },
            {
              "label": "SHUT AT CURRENT SIZE",
              "text": "Close one piece of work this week at exactly the scope it has now, and hand it over in that state. Before you do, write the list of things you would have added, and keep the list instead of the additions. When the pull comes to widen it once more, put that item on the list and close the thing anyway."
            }
          ]
        },
        "22": {
          "title": "22 in Personal Purpose — The Fool",
          "fields": [
            {
              "label": "STEP BEFORE PROOF",
              "text": "Beginning without a guarantee is something you can genuinely do, and certain doors open only to somebody willing to move without proof. Freedom and exposure arrive in the same gesture here, and you take both instead of negotiating for one of them. What you have is trust and not blindness, because the risk is visible to you and you step regardless. That trust builds on itself the more it is used, so the next move comes from having moved before rather than from nerve alone. Exposure does not need resolving before you go, and the ground does not have to be in sight first. You start things on incomplete information and stay upright in the part where nothing has been promised yet."
            },
            {
              "label": "NOTHING ACCUMULATES",
              "text": "Movement becomes the whole point, so nothing gathers, and freedom turns into a kind of homelessness that is always new and never deep. You leave before a choice has been in place long enough to become anything, and the leaving is dressed up as the next opportunity. The reverse version is just as common: years of talking about leaping while arranging a life with no actual opening in it. Both of them leave you with the look of freedom and very little of the substance underneath. Your standing with yourself comes from how many beginnings you are capable of rather than from anything that has lasted. Fear of a different kind sits under the motion: that staying long enough to be tested would show the choice was less free than it looked. So the next leap gets taken early, before the current one has had time to say anything about you."
            },
            {
              "label": "STAY FOR THE TEST",
              "text": "Whatever you started most recently is the one to commit to now: stay with it for ninety days without beginning anything new. Put the end date in writing somewhere you will pass it, and treat every fresh opportunity as something to note down instead of take. Each week, write a single line about what staying taught you that leaving would have skipped over. When the pull to move on arrives, name in one sentence what exactly you would be moving away from. Keep those sentences together and read the whole set on the ninetieth day."
            }
          ]
        }
      },
      "SOP": {
        "1": {
          "title": "1 in Social Purpose — The Magician",
          "fields": [
            {
              "label": "THE PLAN CATCHES UP",
              "text": "You move before the plan is finished, and the plan turns up afterwards to describe something you have already started. Both sides of your family handed down a talent for making things happen, one of them pointed at the world and the other at the people inside it. Past forty those stop being two skills and the initiating force stops being about your own trajectory at all. What it is for now is ventures whose main beneficiary is somebody other than you. You generate momentum from a standing start, in roughly the time it takes most to organise the intention to help. You launch other work faster than the ones behind it can decide to begin."
            },
            {
              "label": "STILL YOUR OWN CAMPAIGN",
              "text": "You keep running a personal campaign long after its season closed, and because you are good at it, it keeps half working. Everything you start still routes back to your own advancement, and the ones who could have been launched by that same force stand just outside it. Your sense of your own standing is built out of momentum with your name on it, so a quiet month reads as a demotion. What keeps the campaign running is a private terror that force pointed away from yourself simply stops being force. So you initiate where the credit returns and call it drive, which is the second expression of the same habit. The energy is real, and almost all of it is spent on one person."
            },
            {
              "label": "LAUNCH IT UNSIGNED",
              "text": "Start something this week whose success will be recorded under a name that is not yours, and set it going before you argue yourself out of it. Hand the credit over at the beginning rather than afterwards, in writing, so there is nothing left to reclaim later on. Spend one working hour on it every day until Friday, on what they need rather than on what you would have chosen. Keep a note of every moment you wanted the credit back, and the hour of the day each one arrived."
            }
          ]
        },
        "2": {
          "title": "2 in Social Purpose — The High Priestess",
          "fields": [
            {
              "label": "TWO SILENCES MEET",
              "text": "You carry two kinds of knowing at once, the provable and the felt, and you move on the second without demanding the first. Both family lines gave you that perception together with an instruction to keep it to yourself, and past forty the instruction is the part that expires. Because it has been held so long, the moment you do speak it arrives with a weight that years of hinting never produced. You put words to the thing a whole room has sensed and nobody has been willing to say."
            },
            {
              "label": "HOLDING AS COMPLICITY",
              "text": "Your discretion has hardened into something much closer to complicity, and it happened slowly enough to still feel like tact. You watch a family pattern working on somebody, you see exactly what it is doing, and you hold it, because holding is what was modelled for you twice over. Being trustworthy beyond all reason is the standard you hold yourself to, so every disclosure feels like spending down the only thing you own. Under the holding sits something you would rather not name: the moment you say it aloud, whatever follows belongs to you. So the pattern goes on running, and your precise reading of it now works as its protection. You know more about it than anyone in the family, and you have done less with that knowledge than any of them."
            },
            {
              "label": "SAID WHERE IT COUNTS",
              "text": "Name one thing this week that you have been seeing privately for years, and say it to somebody with the standing to act on it. Give the plain version instead of the hint you would usually offer, in one sentence, at the start of the conversation rather than the end. Leave out the softening clause that hands them permission to do nothing about what you have just said."
            }
          ]
        },
        "3": {
          "title": "3 in Social Purpose — The Empress",
          "fields": [
            {
              "label": "FED BEYOND THE HOUSEHOLD",
              "text": "You grow things slowly and deliberately, giving whatever you tend the time it actually needs instead of forcing an early result. One line behind you understood provision as material and structural, the other understood it as warmth and attention. After forty those have to become a single practice, because provision without warmth repeats one inheritance and warmth that builds nothing durable repeats the other. The capacity that fed a household through your first half is meant now to feed something larger than a household. Abundance sits easily with you, and when there is plenty you give it away by instinct rather than by calculation. You build the thing that goes on producing after you have stopped tending it."
            },
            {
              "label": "THE ONE-WAY FLOW",
              "text": "Your providing has quietly organised everybody near you into dependence, and none of them can see that either. The flow runs outward from you and never back, so nobody within reach ever develops the capacity to make the thing themselves. You measure whether the day counted by how indispensable you were, and a week where nothing was asked of you feels like a week of being nothing. Beneath the one-way flow lies a horror of becoming unnecessary, of somebody learning to provide for themselves and then simply not coming back. So you keep making it rather than showing how, you keep the process slightly out of view, and you call the whole arrangement generosity."
            },
            {
              "label": "SHOW THE WHOLE PROCESS",
              "text": "Teach somebody this week to make what you have always simply handed over, and run the lesson at their pace rather than at yours. Stand beside them for the entire process, including the parts you normally do quickly while nobody is watching. When they get a step wrong, let the mistake finish before you say anything at all about it. Book the same session again for the following week and do none of it yourself."
            }
          ]
        },
        "4": {
          "title": "4 in Social Purpose — The Emperor",
          "fields": [
            {
              "label": "BUILT IN YEARS",
              "text": "You build in years while nearly everything around you is planned in weeks, and what you put up is still standing long afterwards. One line handed you authority as something formal and named, the other as something exercised constantly and never called power at all. You hold real authority without needing to sit inside every decision made underneath it. You become the structure a whole group can operate safely inside, and you carry that weight without visible strain."
            },
            {
              "label": "EVERYTHING ROUTES THROUGH YOU",
              "text": "Your authority does not distribute, and the arrangement has held so long that it now looks like the natural order of things. You hold the frame so completely that nobody near you has developed the capacity to hold any part of it. Competence is what has kept it running for decades, and that is precisely what has stopped you, or anybody else, from questioning it. Steadiness under weight is the only measure you accept for yourself, and an hour when nothing rests on you leaves you unmoored. What sits under the grip is the suspicion that the structure stays upright only because you are personally holding it there. So you absorb the next thing instead of teaching it, and the load grows in the one direction it always grows. You are load-bearing by choice and worn out by design."
            },
            {
              "label": "AUTHORITY WITH NO CHECKING",
              "text": "Hand a real piece of authority to somebody this week, including the right to run it in a way you would not choose. Say plainly what is now theirs and what is no longer yours, so the boundary is not left to be worked out. Then stay out of it for a full month, without asking how it is going and without wandering past to look. Put a date in the calendar for when you will next look at it, and keep to that date."
            }
          ]
        },
        "5": {
          "title": "5 in Social Purpose — The Hierophant",
          "fields": [
            {
              "label": "TESTED AGAINST YOUR LIFE",
              "text": "You test what was handed down against the way your own life actually went, and you keep only the parts that survived that. Two bodies of doctrine arrived in you from opposite sides of the family, sometimes agreeing and sometimes flatly contradicting each other. Past forty you have the standing to arbitrate between them, which nobody before you was in a position to do. What you hand on has been through a life rather than repeated from memory, and it carries differently for that reason. You decide which rules continue and which ones end where you are standing."
            },
            {
              "label": "THE WHOLE PACKAGE FORWARD",
              "text": "You pass the inheritance on whole, harmful parts included, because it arrived as one package and you have handled it as one. Sorting through it feels like an audit of the character of whoever raised you, so you do not begin the sorting. Loyalty is the quality about yourself you would defend without checking, and an hour of doubt about the doctrine registers as an hour of disloyalty. The thing you avoid saying is that pulling a single thread out would end your right to claim any of it. So the whole body of it travels down the line intact, and the damage inside it travels too. Both halves are one move: you protect the givers, and you hand on the harm."
            },
            {
              "label": "ONE RULE STOPS HERE",
              "text": "Pick one inherited rule and hold it up to daylight this week, then set down beside it the reason it no longer fits. Say to somebody younger, in a single sentence, that this rule ends with you, and give your actual reason for ending it. Do it out loud and to a person, before the month is over, rather than settling it privately in your own head."
            }
          ]
        },
        "6": {
          "title": "6 in Social Purpose — The Lovers",
          "fields": [
            {
              "label": "WHO YOU ARE FOR",
              "text": "You hold competing loyalties in view without pretending that the inconvenient one has stopped existing. One line taught you that loyalty is blood and obligation, the other that it is chosen affinity, and the decision about which governs is now yours to make case by case. The question shifts from who you love to who you are actually for, and that gets answered situation by situation rather than by rule. Once you have chosen, you go the whole way in instead of leaving a door propped open behind you. You choose your allegiances consciously, and you let the ones involved know a choice was made."
            },
            {
              "label": "EVERY DOOR LEFT AJAR",
              "text": "Every allegiance you hold is kept half open, and fairness is the word you have been using for it. A family faction, an obligation you inherited, and a newer set of people all hold partial claims, and not one of them has the whole thing. Being available in every direction is what holds your self-regard together, so a closed door anywhere reads as evidence that you have become somebody who abandons. Keeping the doors ajar runs on an alarm that says a full yes in one place is automatically a betrayal in all the others. So you stay warm and slightly out of reach on every side, and nobody quite has you. The cost lands on you as heavily as on them, because a life of partial commitments never adds up to a life you chose. You are loyal in six directions and you belong in none of them."
            },
            {
              "label": "THE ALLEGIANCE MADE EXPLICIT",
              "text": "Choose one allegiance this week and make it explicit to the person it concerns, naming plainly what the choice costs the other side. Say it without the qualifying clause you usually add to keep everybody comfortable while you speak. Then tell the side that loses something, directly, rather than leaving them to work it out from your behaviour later. Have both of those conversations inside the same seven days, not one now and one when it feels easier."
            }
          ]
        },
        "7": {
          "title": "7 in Social Purpose — The Chariot",
          "fields": [
            {
              "label": "MOVING A GROUP ACROSS",
              "text": "You take a group from where it currently sits to where it has to get to, and you hold the direction without gripping it. One line gave you drive and bearing, the other gave you attention to who is actually in the vehicle, and midlife needs the two running together. What is being asked now is not speed but responsibility for other arrivals, which is slower and harder than going fast alone. You set the pace by what a group can genuinely sustain rather than by what your own drive would prefer."
            },
            {
              "label": "ARRIVED ALONE, ON TIME",
              "text": "Your pace is set entirely by your own capacity, and anybody slower registers as friction working against the mission. You push forward without looking back, and whoever falls away gets filed as insufficiently serious rather than as left behind. Forward motion is the measure by which you decide you are doing well, so a stationary week feels like personal failure rather than a pause. The impatience is powered by something you will not test: that easing off would show the urgency was manufactured all along. So you go faster, you check behind you less, and you get somewhere genuinely worth reaching with nobody there to hold any of it up."
            },
            {
              "label": "PACED TO THE SLOWEST",
              "text": "Set this week's pace by the slowest person who genuinely has to arrive, and hold that pace even when the road opens up. Before every push forward, stop and work out who is still with the work and who has quietly come off the back. Ask the slowest one what would let them keep up, then change your own schedule instead of theirs. Run it that way for five working days without announcing the change to anybody. Do the checking before you accelerate, never after."
            }
          ]
        },
        "8": {
          "title": "8 in Social Purpose — Justice",
          "fields": [
            {
              "label": "STANDING TO SETTLE IT",
              "text": "You apply to yourself the exact standard you apply to everybody else, and that symmetry is the whole basis of your judgement. Two lines behind you carry opposite accounts of one old imbalance, a favouritism or a debt nobody acknowledged, and the accounts do not match. After forty you are the first to hold both versions at once, which makes you the first who cannot claim not to know. You can deliver an accurate reading of what happened without needing a single line of it to be cruel. You settle an account that has been open longer than you have been watching it."
            },
            {
              "label": "PRECISE AND UNFINISHED",
              "text": "You name the imbalance with real precision and then stop, as if the naming had been the contribution. You can say exactly who did what to whom and in what order, and not one part of that moves the situation an inch. Being accurate is the item you privately give yourself credit for, so being right has quietly taken the place of being useful. Stopping at precision spares you from finding out whether confronting the responsible party would take away the standing that lets you judge at all. So the account stays open, described perfectly, one year after another. You are the most reliable witness to the wrong and no part of its repair."
            },
            {
              "label": "DO THE REPAIRING PART",
              "text": "Take the oldest imbalance you can name and do the part that actually settles it, this week, not the part that describes it. Work out the concrete act, whether that is money returned, a sentence said to whoever was wronged, or a share redistributed. Do that one act by Sunday, and stop narrating the history while you are doing it. Watch which one you reach for when it gets uncomfortable, the act or the account of the act."
            }
          ]
        },
        "9": {
          "title": "9 in Social Purpose — The Hermit",
          "fields": [
            {
              "label": "DEPTH MADE REACHABLE",
              "text": "Solitude built something in you across decades that cannot be assembled any faster, and after forty it stops being private property. You can be entirely self-sufficient without that curdling into isolation, which is the harder half of the same skill. Both of the lines you came from handled things alone, one out of duty and one out of necessity, and neither made the result available to anybody. What you say from that depth carries more weight than a quick answer, because it was arrived at slowly and tested against a life. Opening it up is something nobody in either line has done, and it now falls to you. You make decades of inner work usable by somebody who needs it now."
            },
            {
              "label": "DISCERNMENT AS A DOOR",
              "text": "Your depth sits behind a door nobody has the address for, and you have been calling that arrangement discernment. You are respected, consulted rarely, and genuinely known by almost nobody, and those three facts are one fact. Being hard to reach is what keeps the work feeling significant to you, so easy access would feel like a devaluation of what it cost. Selectivity about who deserves your time is the story you tell about it, and it does the job of a lock. The distance is maintained by a quiet horror that if you were freely available, what you know would turn out to be ordinary. So the understanding accumulates and terminates here, in a private conclusion that is of use to nobody. You have more to hand over than almost anybody and you have arranged things so that it cannot be asked for."
            },
            {
              "label": "GO FIRST, UNASKED",
              "text": "Reach out this week to somebody who needs exactly what you spent years working out, before they have found the nerve to ask. Say what you know plainly and at full length, without the pause where you decide whether they have earned it. Give them a standing route back to you, a number or a fixed hour, rather than leaving it to chance. Do it again seven days later with the same person, whether or not they came back to you."
            }
          ]
        },
        "10": {
          "title": "10 in Social Purpose — Wheel of Fortune",
          "fields": [
            {
              "label": "SURVIVED A FEW TURNS",
              "text": "Cycles have turned under you often enough that you no longer mistake the current one for the permanent condition. You can tell whether a group is genuinely rising or genuinely contracting, rather than reacting to whatever the loudest week suggests. The two families behind you left different records of rise and fall, and between them you have evidence that neither total control nor total resignation matches how it goes. You let a good stretch be good without gripping it in place, and you stay steady through a bad one until it has finished turning."
            },
            {
              "label": "CALM THAT WAVES AWAY",
              "text": "Your calm has become a way of not arriving, and from where somebody else is standing it is indistinguishable from indifference. Because you know it turns, you meet a collapse with a philosophical steadiness that answers a question nobody asked you. Perspective is the possession you rate above everything else you have, so a situation gets processed into the long view before you have felt any of it. The thing you will not look at directly is whether sitting all the way inside somebody's crisis would strip out the distance that keeps you safe inside your own. So you offer the accurate observation and withhold the presence, and you end up right about the cycle and absent from the week."
            },
            {
              "label": "STAY IN THE DOWNTURN",
              "text": "Sit with somebody this week who is currently inside a bad turn, and do not tell them it will pass. Stay a full hour without offering the long view or the sentence about how these things always go. Let the silence run rather than filling it with what you already know about cycles. Book the hour now, at a fixed time, so it does not depend on how you feel on the day. Go back a second time the following week without being asked."
            }
          ]
        },
        "11": {
          "title": "11 in Social Purpose — Strength",
          "fields": [
            {
              "label": "CARRIED WITHOUT GOING HARD",
              "text": "You absorb weight that would turn most people brittle, without ever hardening into the shape of the load. Raw and unruly feeling in a room does not send you anywhere, and you stay with it without suppressing it or being run by it. One side of your family endured hard and visibly, the other softly and without remark, and neither managed the combination being asked of you. Gentleness and weakness are separate things to you, so you can be soft without ever being pushed around. You hold a situation open that most would have dropped, and you stay recognisably yourself the whole way through."
            },
            {
              "label": "ABSORBING KEEPS IT ALIVE",
              "text": "Your endurance is what allows a harmful arrangement to continue, and it has been continuing for years on exactly that fuel. You keep making an unbearable thing survivable instead of ending it, and every month you succeed buys it another month. The capacity to take it is the one quality you would not trade, so a limit feels like handing back the strongest part of yourself. Absorbing more is easier than finding out whether a line drawn here would mean the endurance was tolerance wearing the name of love. So you take on more of it, and the situation adapts around your capacity until your capacity is what holds it up. The second expression is quieter: you say nothing about what it costs, because saying that out loud feels like the first crack. You are the reason it has lasted this long."
            },
            {
              "label": "ONE LIMIT, THIS WEEK",
              "text": "State one limit this week inside the situation you keep holding open with no end date, and say it without any cushioning. Give the specific behaviour, the specific line and the specific consequence, in one conversation rather than spread across several. Write it out beforehand in the exact words you intend to use, read it back once, and hold to it for thirty days without renegotiating a clause."
            }
          ]
        },
        "12": {
          "title": "12 in Social Purpose — The Hanged Man",
          "fields": [
            {
              "label": "OUTSIDE THE CONSENSUS",
              "text": "You stand visibly outside the agreement a group has reached, neither leading nor following, and you hold that position calmly. From out there you reach angles that nobody still inside the thing can get to, because the view requires the discomfort of the position. Each of your lines contains a suspension of its own, an interrupted life or a long wait, and you can see what those pauses produced as well as what they took. You stop a decision mid-flight and hold it there without anxiety, because stepping outside is doing real work."
            },
            {
              "label": "THE BILL ATTACHED",
              "text": "Your outsider position gets performed rather than simply occupied, and the performance is doing more work than the position is. Everybody within range learns what standing apart has cost you, so the insight arrives with an invoice stapled to it. The cost is what makes the view feel worth having to you, and an angle given away easily reads as an angle worth nothing. Performing the price is insurance against discovering that the same angle, handed over plainly, would be worth no more than an ordinary opinion. There is a second version of it: you stay out there permanently, because coming down would end the arrangement altogether. A vantage point occupied forever stops being a vantage point and turns into the same unfinished suspension your lines were already carrying."
            },
            {
              "label": "HANDED OVER FREE",
              "text": "Offer the different angle once this week, plainly, with nothing attached about what seeing it took out of you. Leave out the preamble describing the position you occupy and the price of occupying it, and give only the observation. Then come down for a day and join one thing you would normally watch from outside, as an ordinary member of it. Do the second part inside the same week as the first."
            }
          ]
        },
        "13": {
          "title": "13 in Social Purpose — Transformation",
          "fields": [
            {
              "label": "WHERE THE PATTERN STOPS",
              "text": "You sit at the point where a pattern running in both your lines meets somebody who can finally see it as a pattern. That double inheritance is what makes it visible to you and what kept it invisible to everybody standing before you. You can let an old arrangement die properly, without waiting for a crisis to arrive and force the decision. You have enough standing in both lines to end something rather than merely to complain about it. You end a thing that everybody before you could only carry."
            },
            {
              "label": "PASSED ON BY SILENCE",
              "text": "Patterns travel by default, and this one is still travelling, because ending it requires saying out loud what it is. You have identified it and could describe it in a sentence, and you have chosen the description over the sentence every single time. Loyalty to the ones who carried it is the ground you privately stand on, so naming the pattern feels like turning on them. Underneath the silence is the calculation that ending it means implicating people you love, and you would rather carry it than do that. So it goes through you intact, and whoever comes next receives it in the shape it reached you."
            },
            {
              "label": "SAY IT STOPS HERE",
              "text": "Say out loud, to somebody in the family this week, what the pattern actually is, and state that it stops with you. Name the behaviour rather than the person who carried it, so the sentence stays about the thing rather than about them. Write the sentence first, cut every clause that softens who it implicates, and then say the cut version to their face."
            }
          ]
        },
        "14": {
          "title": "14 in Social Purpose — Temperance",
          "fields": [
            {
              "label": "MIXED BY PROPORTION",
              "text": "You blend things that do not naturally mix, and you get the proportion right for the particular case instead of applying a formula. Two family temperaments met in you, different values and possibly an old grievance, and you are the only one with genuine standing on both sides. You can keep two opposed parties in the same room without either of them feeling handled. You moderate your own extremes without effort, which is what lets you work with material this volatile without being pulled into it. Blending is not the same act as suspending, and you can feel which one you are doing. You mediate something that was already unreconciled long before you arrived in it."
            },
            {
              "label": "SUSPENDED, NEVER SETTLED",
              "text": "Your neutrality has stopped being a method and turned into the outcome, and nothing has moved for years. Because you see every side accurately, you decline to weight any of them, and the mediation becomes permanent custody of the positions. Being trusted by both sides at once is the achievement you privately measure yourself against, and that achievement requires never landing anywhere. Never landing protects you from a possibility you refuse to test: that stating a view would end the access both sides currently give you. So the conflict stays warm and open and carefully held apart, and you describe the holding as progress. The smaller daily version is that you round your own opinions down until nothing you say could be objected to. You have kept two things apart with great care and called it a blend."
            },
            {
              "label": "WEIGHT ONE SIDE",
              "text": "Declare where you actually stand this week, inside one conflict you keep holding neutrally, and have held that way for years. Say the position in one sentence to both sides, knowing one of them will not like it, and do not pair it with a concession. Give your reason once and then stop explaining, instead of talking until the disagreement smooths back over. Pick the conflict today and have that conversation before Friday. Lead with the sentence, ahead of any context you would normally lay down around it."
            }
          ]
        },
        "15": {
          "title": "15 in Social Purpose — The Devil",
          "fields": [
            {
              "label": "LOOKING WITHOUT FLINCHING",
              "text": "Every family keeps one arrangement it does not discuss, and both of your lines fed the same one until it looked like simply how things are. You can look at it directly, without flinching and without turning it into something more comfortable to hold. After forty you stand in view of the whole structure rather than the partial view available to everybody else. Saying it is not a step before the family gets free of this, it is the thing that frees them. You end the concealment doing the actual damage, without needing to destroy anything to do it."
            },
            {
              "label": "TACIT PARTICIPATION",
              "text": "Your silence has been reading as loyalty for years, and it reads that way to you most of all. You know exactly what is going on, you have known for a long time, and the arrangement runs on your quiet participation. Keeping the family intact is the job you have privately assigned yourself, so every year it holds is a year you did well. What you cannot afford to find out is whether saying it would make you the one who broke everything apart. So your knowledge has been absorbed into the machinery that protects the concealment, which is the opposite of what knowing it is for. You are the best informed person there and the most useful thing about you is that you say nothing."
            },
            {
              "label": "SAID TO ONE PERSON",
              "text": "Tell somebody with the power to act, this week, in plain words, what has been happening and how long it has been happening. Give them the whole thing rather than a hint they would have to decode, and take the question mark off the end of that sentence. Decide today who that person is and when you will speak, and keep the appointment even if the week turns bad."
            }
          ]
        },
        "16": {
          "title": "16 in Social Purpose — The Tower",
          "fields": [
            {
              "label": "PROOF TWICE OVER",
              "text": "Structures around you come apart during this stretch of life, and the task is to keep working while they do. Your mother's side and your father's side each carry a rupture, a lost home or a lost standing, often one that was never discussed properly. That hands you something neither generation had: proof, twice over, that the collapse was actually survived. You recover quickly from real upheaval and you keep what it showed you, rather than getting through it and shutting the door. You stay upright and working while the ground under somebody else gives way, and you can tell which collapses need catching and which only need naming."
            },
            {
              "label": "RIGHT FROM A DISTANCE",
              "text": "You forecast the failure instead of catching anybody inside it, and you are demonstrably right each time, which is the trouble. You saw the structure going before anybody did, and you spent the whole period saying so from somewhere safe. Being early about a collapse is how you keep proving your own footing is sound, so warning has become the version of help you offer. Staying at forecasting distance keeps you from discovering whether holding somebody would put you inside the same collapse with nothing under you either. So you predict, which costs you nothing, and almost nobody has been held by you through the worst of it."
            },
            {
              "label": "CLOSE ENOUGH TO CATCH",
              "text": "Pick a person this week whose structure is currently going and get physically close to it rather than commenting from outside. Turn up for something practical and unglamorous, a move, a form, a bad afternoon, and stay longer than you would normally stay. Say nothing at all about what you saw coming, for the whole of that day. Fix the day tonight and write it into your calendar where you will not quietly move it. Go back once more before the month ends."
            }
          ]
        },
        "17": {
          "title": "17 in Social Purpose — The Star",
          "fields": [
            {
              "label": "THE FUTURE YOU CARRY",
              "text": "Hope in your hands is a working part of other lives, not a mood you happen to be in. After forty you hold a future for a group that can no longer picture one, and the holding is the job. What you carry has already been through the hard facts, so it is not naivety and it needs no protection from information. Nobody has to be cheered up on purpose; the mood shifts because you are there, performing nothing. You keep a possibility alive years past the moment most people file it as finished."
            },
            {
              "label": "OPTIMISM THAT WON'T LOOK",
              "text": "Your optimism protects itself by refusing to look straight at the situation it is meant to be hopeful about. The second face of it: those close to you learn they cannot bring you the real state of anything, so they hand over an edited version and you believe it. Your worth rides on the hope staying intact, so an accurate report arrives feeling like an attack on the single thing you reliably hand over. Beneath it runs a suspicion that hope which has taken in the entire picture would not survive the contact, and would leave you holding nothing to give anybody. So the hard facts stay at arm's length and the result gets called faith. The hope you defend most carefully is the least tested one you have."
            },
            {
              "label": "THE TRUE ONE FIRST",
              "text": "Write out the worst accurate version of the situation you have been keeping at half information, and finish it before Thursday. Read the page through twice without adding one hopeful sentence anywhere on it. For the rest of that week, put the true sentence first and the hopeful one second, in that order. Then ask yourself what you had expected the whole picture to do to the hope you are carrying."
            }
          ]
        },
        "18": {
          "title": "18 in Social Purpose — The Moon",
          "fields": [
            {
              "label": "NAMING THE INHERITED MOOD",
              "text": "Both sides of your family passed down an atmosphere rather than a story — a dread, a shame, something everyone breathed in and nobody described. You are built to put that into language, and the years past forty are when that becomes possible. Ambiguity does not stall you: you name what you sense while it is half formed, and you hold two contradictory feelings about your family at once without collapsing them into one verdict. You say out loud the sentence three generations have been walking around."
            },
            {
              "label": "HOW THE FAMILY IS",
              "text": "You feel the inherited unease with total accuracy and then do nothing with it except live inside it alongside everyone else. Accuracy without a sentence is the first form; the second is that you defend the arrangement, explaining the mood as simply how your family has always been. You draw your worth from belonging to the people whose silence you would be breaking, which is why the words stay unsaid year after year. Under it lives an old fear that saying it plainly would commit you to a version of the family nobody there is prepared to hear. So the feeling gets absorbed rather than traced, and absorbing it keeps the whole thing running for another generation. The relatives who could tell you where it began are the same relatives you protect by not asking. You pay for that mood most weeks of your life and treat the paying as ordinary."
            },
            {
              "label": "PUT IT IN WORDS",
              "text": "Choose the oldest relative you can reach and ask them, inside the next three days, one direct question about the thing your family does not discuss. Ask it plainly, in one clear sentence, with no apology ahead of it and no softening added afterwards. Note beforehand what you expect the asking to cost you, and keep that note where it stays legible."
            }
          ]
        },
        "19": {
          "title": "19 in Social Purpose — The Sun",
          "fields": [
            {
              "label": "WARMTH THAT COHERES",
              "text": "After forty you become the point a family or community organises itself around, and that is the real work rather than a side effect. Your vitality is real and unmanufactured, which is why it carries across a room with no effort to make it visible. The warmth runs at full strength from the first minute and would do so in an empty house. Holding a group together by presence alone is heavier and rarer work than either providing for people or comforting them. None of it is performed, so it holds up on a bad day exactly as it does on a good one. You alter how a room feels within four minutes of walking into it."
            },
            {
              "label": "THE CENTRE GETS NOTHING",
              "text": "Everyone arranges themselves around your steadiness, which means your own bad month has nowhere to travel and simply stays inside you. That is one form of it; the other is skilled concealment, running the role at full brightness on the days there is nothing behind it. Your worth comes out of being the fixed thing others measure themselves against, so any visible need looks, to you, like the fixed thing moving. Underneath that lies a dread that letting them see you struggle would remove what the whole arrangement rests on. You know more about every person near you than any of them knows about you, and that gap widens each year the role keeps running."
            },
            {
              "label": "ONE NEED, UNMINIMISED",
              "text": "Choose something you genuinely need right now and tell the group about it on Wednesday, in a flat sentence with no joke attached. Choose the group where you have been the steady one longest, not whichever room is easiest this week. Do not shrink the need on its way out of your mouth, and add no reassurance afterwards that you are fine. Sit through whatever quiet arrives afterwards instead of filling it yourself. Ask for one specific piece of help rather than sympathy, and keep the request small enough to be answered that day."
            }
          ]
        },
        "20": {
          "title": "20 in Social Purpose — Judgement",
          "fields": [
            {
              "label": "STANDING TO CLOSE IT",
              "text": "Unfinished business runs in both of your family lines, and after forty you are the first person in either with the standing to end it. The work here is closure rather than construction — not a new thing built, but an old thing finished while it still shapes relatives who cannot say why. You weigh that unresolved history at its real size, neither inflating it into tragedy nor waving it off as ancient. You act on a summons before rehearsing it, and you walk straight into the stretch of the family record everyone else has stepped around for decades."
            },
            {
              "label": "WAITING CALLED RESPECT",
              "text": "You know exactly what is unresolved, you leave it exactly where it sits, and you call the leaving respect for the people involved. The second version is a timing argument: the moment is never quite right, so the matter waits for a better week that has failed to arrive in twenty years. How little pressure you put on anybody has become the test you apply to yourself, so moving on this would feel like becoming the sort of person you decided against being. Below that waits a dread that raising it now would prove it should have been raised years ago, and that the delay is yours. Meanwhile the thing stays live, working on relatives who have no idea what they are reacting to, and your restraint is what keeps it powered. Deference costs nothing you can see, and that is precisely why it has held this long."
            },
            {
              "label": "OPEN IT THIS MONTH",
              "text": "Put the unfinished matter into one sentence and take it to the oldest living person it belongs to, inside the next ten days. Say what you have seen and what was never settled, without asking permission and without cushioning the opening line. Book that conversation now, at a fixed hour on a fixed date, instead of holding out for a week that feels comfortable."
            }
          ]
        },
        "21": {
          "title": "21 in Social Purpose — The World",
          "fields": [
            {
              "label": "FINISHING WHAT THEY STARTED",
              "text": "Both of your lines were working on something and neither got it to an end, and after forty the finishing falls to you. Completion is a specific skill and you have it: you take what was begun and drive it to a genuine conclusion rather than a resting point. You assemble the whole inheritance, the ugly material alongside the good, instead of keeping only what flatters the family account. Satisfaction lands for you in the finishing itself, not in the next expansion that finishing makes available. You close an arc two generations left open."
            },
            {
              "label": "MORE SCOPE, NO END",
              "text": "Instead of finishing the inheritance you enlarge it, adding scope, adding scale, adding another generation of effort to something already near done. The subtler version is that you keep the project technically open by locating a further phase, so nothing ever has to be declared over. What you're worth is tied to the size of what you are carrying, and a finished thing is smaller than a live one, so completion reads to you as shrinkage. What you circle is the judgement folded inside completion: calling it done means calling their effort enough, and that verdict is yours alone. Nobody handed you that authority formally, and widening the work is how the verdict gets postponed. So the effort continues, taking your decades the way it took theirs, and the shape of the whole stays unclaimed. You spend your best years extending a thing whose only remaining need was an ending."
            },
            {
              "label": "END IT ON FRIDAY",
              "text": "Take the inherited project you have been extending and declare it finished on Friday, then stop working on it altogether. Tell the people still invested, in one plain sentence, that it is complete and that you are not carrying it further. Attach no next phase to that announcement, and offer no standing availability for the parts you privately think are unresolved. Move the hours it was taking onto something with no connection to either family line."
            }
          ]
        },
        "22": {
          "title": "22 in Social Purpose — The Fool",
          "fields": [
            {
              "label": "THE LEAP NOBODY TOOK",
              "text": "A leap sat untaken in each of your two lines, and taking it is now your work, visibly enough that it moves what those around you believe is permitted. Stepping forward without a guarantee in hand is genuine trust rather than naivety, and the position runs on that ability. You commit to something whose ending you cannot see, which is not the same act as gambling and does not feel like it from the inside. Doing it where it can be seen shifts the boundary for everyone present, and you carry that without turning it into a show. The standing to move arrives only after forty; at thirty the identical decision would have read as recklessness even to you. You take the risk two generations argued themselves out of, and you take it in the open."
            },
            {
              "label": "THE SENSIBLE VERSION",
              "text": "Caution came down to you from both sides and you have renamed it judgement, which is why arguing with it is so hard. You reach the age where the leap is genuinely available and produce excellent, accurate arguments against making it this year. The quieter form is that you take small risks resembling courage while the one that counts stays untouched. Your steadiness is what you prize most in yourself, and a visible failure would spend all of it at once, which is why fresh reasons keep arriving on schedule. Underneath sits a dread that leaping and landing badly would settle the old family argument in caution's favour, permanently, with you standing there as the evidence."
            },
            {
              "label": "TAKE IT IN PUBLIC",
              "text": "Pick the risk your family would call unnecessary and take the first irreversible step on it before this month ends. List the arguments against it on one page first, then go anyway and keep the page. Choose the version of the leap that cannot be quietly undone a fortnight later. Do it where those who need to see it done are present, rather than reporting it once it is safe. Put money, time or your name behind it at a level you would prefer to keep quiet about, and skip the explanation."
            }
          ]
        }
      },
      "SPP": {
        "1": {
          "title": "1 in Spiritual Purpose - The Magician",
          "fields": [
            {
              "label": "THE HANDED FIRE",
              "text": "The capacity to start things ran your whole life, first for yourself and then on behalf of other people. It operates in other hands now, and you watch them hold it differently without reaching over to correct the grip. When a handover goes badly you read it as information about the situation rather than proof that the person was not ready. Beginnings happen around you that you made possible and had no part in, and you do not need the credit routed back. You let a thing you began continue in a form you would never have chosen."
            },
            {
              "label": "TAKEN BACK AGAIN",
              "text": "Nobody carries it properly, so you keep hold of it, and you keep starting things long past the point where starting them is yours to do. Each time you take one back you confirm the very suspicion that made you take it back, and that loop is invisible from inside it. What makes you feel worthwhile is being the hand everything begins in, so a project running well without you lands as a small loss rather than a success. The people around you have stopped offering, and you read their quiet as evidence that you were right instead of as the consequence of being overruled. Underneath the reclaiming sits the fear that a capacity leaving your hands completely would die with you rather than carry on. So you hold tighter, and holding tighter is what brings about the ending you are afraid of."
            },
            {
              "label": "LET IT WOBBLE",
              "text": "Hand one thing over this week and let it be done worse than you would have done it, without stepping back in when it wobbles. Choose something that matters enough that watching it go sideways will genuinely cost you, not a task you were already bored of. Say nothing for a full fortnight afterwards, even when you can see precisely where it is heading. Let the wobble be somebody else's problem to sort out."
            }
          ]
        },
        "2": {
          "title": "2 in Spiritual Purpose - The High Priestess",
          "fields": [
            {
              "label": "TOLD THE WORST",
              "text": "A lifetime of noticing has resolved into something rarer than noticing, which is the ability to hear the worst of a situation without recoiling from it. Somebody tells you the thing they have told nobody, and they leave lighter rather than more exposed than when they sat down. You still see everything, in the same detail you always did, and you have simply stopped needing to prove that you see it. That restraint is what turned your perception into a place where things can be set down. You take in what somebody hands you and leave it exactly where they put it."
            },
            {
              "label": "SEEN STRAIGHT THROUGH",
              "text": "Decades of being right about people settle into a habit of seeing straight through them, and the person being seen through can feel it. The read arrives before they have finished the sentence, and out it comes, because a perception left unsaid feels to you like a perception wasted. How worthwhile you feel rests on the accuracy itself, so each confirmed read is a small proof and each unspoken one a small waste. You understand your own family better than anybody alive and are told less by them than almost anyone else is. What drives the telling is a worry that a perception kept to yourself was never worth having in the first place. The seeing has curdled into judgement, and judgement is not what anybody brings their worst news to."
            },
            {
              "label": "WRITE THE READ DOWN",
              "text": "For the next two weeks, when you are told something difficult, write your read of it on paper rather than saying it out loud. Give back attention only in the moment, and offer the plain sentence a person without your perception would have offered. Keep the pages somewhere private and go through them all at the end of the fortnight."
            }
          ]
        },
        "3": {
          "title": "3 in Spiritual Purpose - The Empress",
          "fields": [
            {
              "label": "OWNED BY OTHERS",
              "text": "What you made belongs to the people holding it now, and you treat their ownership as real rather than as something on loan from you. They alter it in directions you would not have picked, and watching that happen does not count in you as a loss. Patience across decades is how you built anything at all, and what you look after now includes the part where it stops needing you. You hand over the last piece of authority you were still quietly keeping."
            },
            {
              "label": "THE CLAIM THAT STAYS",
              "text": "The claim never lifts, so you keep offering guidance that leaves you as advice and arrives as ownership. A change made without asking you registers as a slight, and you either say something about it or say nothing in a way that is louder. Your standing, at least by your own measure, comes from being the origin of the thing, and an origin has to be acknowledged regularly or it stops feeling true. Those who inherited it spend their energy managing your feelings about their own inheritance, which is work they should never have been handed. Under the ownership lies a fear that anything which stops needing your approval was never really yours. So approval keeps being required, in small ways you would not describe as control. The thing you made stays half yours, and half of something is an awkward amount to hold."
            },
            {
              "label": "THIRTY DAYS SILENT",
              "text": "Let one thing you made change in a direction you dislike this month, and pass no comment on it at any point. Pick the alteration that irritates you most, leave it standing for thirty days, and neither correct it nor ask why it was done. Put the objection on paper and file it out of sight."
            }
          ]
        },
        "4": {
          "title": "4 in Spiritual Purpose - The Emperor",
          "fields": [
            {
              "label": "HOLDS WITHOUT YOU",
              "text": "Structures you built hold their shape when you are not there holding them, and that has been tested rather than assumed. Something running smoothly in your absence does not register to you as evidence that you have been made smaller. Decades are the unit you think in, so what you set up was built for a length of time that most planning never considers. What you are responsible for will outlast you in working order, not merely in memory or in somebody's fondness. You built the thing so that stepping away from it costs it nothing at all."
            },
            {
              "label": "DEPENDENCE AS PROOF",
              "text": "Indispensability gets defended right to the end, and from inside it the defending looks like diligence. You keep the arrangement dependent on you, because dependence is the evidence that you mattered, and that evidence has to be renewed constantly. Every time something falters without you there, you feel confirmed, and each confirmation is also proof that the work was left unfinished. Worth in you rests on being needed by the thing rather than on the thing being good, and those two separate the moment it runs well. Being away for any real length of time is not possible, and you have learned to call that commitment. Behind the defending is dread at the thought that stepping back would show the structure never needed you."
            },
            {
              "label": "A WEEK AWAY",
              "text": "Be genuinely absent from one thing you run for a fixed stretch you set in advance, and a week is long enough. Do not check in on it once, and switch off whatever tells you how it is doing while you are gone. Pick the part where your absence would cost the most rather than the safe one. Put the dates in writing now, before you can soften them."
            }
          ]
        },
        "5": {
          "title": "5 in Spiritual Purpose - The Hierophant",
          "fields": [
            {
              "label": "TAKEN UP AND TESTED",
              "text": "People you taught believe things you do not, and you let that stand instead of working quietly to bring them back round. What you passed on was taken up and tested, some kept and some discarded, which is what happens to anything transmitted rather than imposed. Your own framework gets examined by you with the same directness you once turned on what you inherited. Hearing someone you taught contradict you reads as the process working rather than as damage being done to something. You give away a set of ideas in a form that can survive being disagreed with."
            },
            {
              "label": "CORRECTED INTO AGREEMENT",
              "text": "Orthodoxy gets enforced well past the point where you hold any real authority to enforce it. The correcting carries on, and because you are usually right it works, producing people who repeat your framework without ever owning a word of it. Students and children agree with you loudly and think about the matter very little, and that agreement is what you take for transmission. You are worth something because the framework is sound, so a challenge to it lands on you personally rather than as a test it could pass. The correcting is powered by an anxiety that a revision made by someone you taught would prove the whole structure unsound. Being right is what you have instead of being argued with."
            },
            {
              "label": "HOLD THE CORRECTION",
              "text": "Let someone you taught be wrong about something that matters, and hold your correction for a full week before deciding whether it needs saying. Say nothing in the moment, including the qualifying remark or the raised eyebrow that does the same job. Write out their position in your own words, as strongly as they would put it themselves. Only then work out what you actually think about it. Do this with the disagreement you find hardest to leave alone."
            }
          ]
        },
        "6": {
          "title": "6 in Spiritual Purpose - The Lovers",
          "fields": [
            {
              "label": "NOTHING HELD BACK",
              "text": "Warmth arrives from you without terms attached, including toward the ones who went their own way. Somebody choosing another person, another place, or simply being unable to give you what you wanted does not cost them your affection. You hold the fact that they chose differently without needing to work out what it said about you. Coming back to you was never made conditional on anything, and that has changed the atmosphere of a whole family. There is no version of you that keeps something in reserve for later. You love the ones who disappointed you at full strength."
            },
            {
              "label": "A PRIVATE RANKING",
              "text": "A private count runs of who chose you sufficiently, and it governs how much warmth each person gets in ways you would deny if asked. Love stays priced to the end, at a rate set by an old disappointment that nobody involved has ever been told about. Your family can feel a ranking you have never said out loud, and the ones nearest the bottom of it have stopped trying. Having been chosen is where your standing with yourself comes from, so every person who chose otherwise took something that has to be made up elsewhere. Somewhere under the counting is the fear of finding that warmth given without repair means the old disappointments did not matter. So the distance stays in place around people who have no idea they are being kept at it. The love is genuine and it is also conditional, and both of those hold at once."
            },
            {
              "label": "FULL WARMTH FIRST",
              "text": "Give somebody who let you down your full warmth this week, before they have done anything to put it right and without mentioning that anything needs putting right. Choose whoever you have been keeping at half strength for longest, and make the contact yourself rather than waiting for an occasion to carry it. Keep it up for a month instead of one generous afternoon."
            }
          ]
        },
        "7": {
          "title": "7 in Spiritual Purpose - The Chariot",
          "fields": [
            {
              "label": "CAME TO REST",
              "text": "The drive that carried you, and then carried other people along with you, has come to rest without being defeated. You look at how far you went without needing to add to the figure or explain why it stopped where it did. A good stretch of your life is allowed to be good, without being held in place or extended past its natural end. You stopped on purpose, and that produced a settledness no further distance was ever going to give you."
            },
            {
              "label": "MOTION PAST USE",
              "text": "Momentum keeps going long past the point where it is any use, and there is always a fresh campaign available to keep it going. Stopping happens to you rather than being chosen by you, so every rest in your life so far arrived as an interruption. Stillness produces a specific dread, and within a day of it you have found something urgent that needs doing. Being the one still going is what your value is made of, which makes a period of rest read as a period of being nothing. At the bottom of it sits fear about arriving anywhere, because arriving means sitting with whatever the movement has been outrunning."
            },
            {
              "label": "TWO CLEAR DAYS",
              "text": "Stop before something stops you, and fix the dates now: two clear days in the coming fortnight with nothing scheduled into either of them. Stay stopped for the whole of it and turn down the next campaign, however reasonable it looks when it turns up. Write down what you feel on the second afternoon, in plain words. Leave the note somewhere you will come across it again later."
            }
          ]
        },
        "8": {
          "title": "8 in Spiritual Purpose - Justice",
          "fields": [
            {
              "label": "DEBTS LET GO",
              "text": "Debts that were never repaid have been let go, and apologies you owed were made for things you cannot undo. None of that required the other side to take part, which is what separates a real closing from a negotiated one. You hold yourself to the same standard you release other people by, so the mercy doesn't run one direction only. The precision never left you and works exactly as well as it always did. It simply stopped deciding who you are allowed to be close to. You end a matter by deciding it is ended, without waiting for anything to be settled fairly."
            },
            {
              "label": "KEPT OPEN FOREVER",
              "text": "Every account stays open, because closing one that was never settled feels like signing off on the injustice itself. What you are owed is carried item by item, and you are prepared to carry it to the grave rather than write any of it off. Your sense of fairness has become the reason you are estranged from people whose wrongs look, at this distance, fairly ordinary. You matter because you kept the standard when others let it slip, which makes any release feel like lowering that standard yourself. Keeping every account open is driven by fear that letting a real debt go would mean the wrong did not matter. So the wrong is kept alive to prove that it happened, and keeping it alive costs you the years you have left. Precision is doing a job it was never built to do."
            },
            {
              "label": "ONE ACCOUNT CLOSED",
              "text": "Close one account this week that will never be settled fairly, either by forgiving a debt nobody will ever repay or by apologising for your own part. Do it in writing, name the specific thing rather than the whole history, and decide before you start whether the letter is sent or burned. Set a date inside the next seven days and treat it as fixed."
            }
          ]
        },
        "9": {
          "title": "9 in Spiritual Purpose - The Hermit",
          "fields": [
            {
              "label": "ALONE, NOT LONELY",
              "text": "Being alone is the actual shape of your days, and there is nothing of loneliness in it. The interior life you built is still producing something, because you are genuinely working a question out rather than sitting quietly. Self-sufficiency in you has not hardened into keeping everyone at arm's length. The doors are open, and when somebody comes through one you let them, without the solitude feeling threatened by it. You go deep into your own company and come back out to answer the door."
            },
            {
              "label": "DOORS QUIETLY SHUT",
              "text": "Withdrawal gets mistaken for transcendence, and the late years become a slow shutting of doors that you describe to yourself as maturity. The solitude has stopped producing anything at all, no insight and no real attention, and is now simply the absence of company. Each closed door gets explained as a preference for depth, and the explanation is good enough that it has never been tested. Your value depends on the solitude being the productive sort, which is exactly why the question of what it has yielded lately goes unasked. The narration covers a fear of discovering that the aloneness has gone quiet and is now only isolation. The account you give of your own life is the most convincing thing in it."
            },
            {
              "label": "NAME A DAY",
              "text": "Keep one door genuinely open this week: pick a person, name a day, and make the arrangement yourself rather than leaving it available in principle. Let the interruption happen whether or not you feel like it when the day arrives. Arrange the same thing again a fortnight later, so it is a habit and not an exception you can point at. Put both dates somewhere you will see them daily."
            }
          ]
        },
        "10": {
          "title": "10 in Spiritual Purpose - Wheel of Fortune",
          "fields": [
            {
              "label": "NOT MADE EVEN",
              "text": "Long stretches where your effort produced nothing sit beside stretches where it produced far more than it should have, and you hold both without needing them to balance. The whole shape of a life is readable to you now in the way a single year once was. You have stopped going back over it hunting for proportion between what you put in and what came back. Neither the empty stretches nor the abundant ones get adjusted in the telling to make the other one make sense. What that produced is a steadiness that is not resignation, but the calm of having dropped the requirement that any of it be fair. You look at a life that did not add up and call it yours."
            },
            {
              "label": "AUDITED FOR FAIRNESS",
              "text": "The arc gets audited for fairness and comes up short every time you go back over it. You review it looking for proportion, marking where you were owed and where other people received what you did not, and the review never concludes. Bitterness arrives late in this pattern and attaches itself to matters you had long considered finished. The effort having been repaid in some proportion is what your sense of yourself rests on, so an unrewarded decade reads as a decade that meant nothing. What sits beneath the reviewing is fear that accepting the arc as genuinely unfair would make the effort wasted. The reckoning gets reopened most often at the hours of the day when there is nothing else to do."
            },
            {
              "label": "ONE SITTING THROUGH",
              "text": "Go through the whole shape of it once this month, unfair parts included, and change nothing in the telling to make it come out even. Say it aloud or write it out in a single sitting, from the beginning, without stopping to justify any stretch of it. Do it once and then leave it alone rather than going back to improve the version. Set aside an hour and pick the day now. Tell nobody you are doing it."
            }
          ]
        },
        "11": {
          "title": "11 in Spiritual Purpose - Strength",
          "fields": [
            {
              "label": "GENTLE AT NO COST",
              "text": "Softness in you was never going to change, and it no longer carries the weight of other people's unfinished business. Staying present with something difficult does not require you to take it inside and keep it there for them. What comes out of you is kindness rather than absorption, so being near a hard situation does not leave you emptied. You stay gentle at no cost, which is a different matter from being gentle and paying for it afterwards."
            },
            {
              "label": "STILL HOLDING IT",
              "text": "Carrying continues because carrying is what you know how to do, and because there is always somebody it helps. You are holding something right now that nobody ever asked whether you should be holding, and that includes you. The absorbing runs to the end of your life unless you interrupt it, since nothing in the arrangement produces a natural stopping point. Carrying the weight for everyone is the whole of your worth, so a stretch where nothing is asked of you feels like uselessness. Carrying on is held in place by the fear that setting something down would prove the strength was never real. Softness has quietly turned into a job. Nobody handed it to you and nobody is going to take it back."
            },
            {
              "label": "PUT IT DOWN",
              "text": "Put down one thing you are still carrying this week, and leave it down even if nobody else picks it up. Name it out loud first so you know exactly which weight is being released, then say so once, plainly, to whoever is involved. Take up no replacement in the same fortnight, however small and however reasonable the next one looks."
            }
          ]
        },
        "12": {
          "title": "12 in Spiritual Purpose - The Hanged Man",
          "fields": [
            {
              "label": "SEEN FROM THIS SIDE",
              "text": "The story you carried for decades has turned over, and from this side the losses did something other than only take. Nothing about them is redeemed, and that is not what changed; what changed is that they show you something they never used to. Your certainty about what your life meant can be suspended for an afternoon without anything in you panicking. You hold your own history without requiring it to mean the thing you insisted it meant. The old version and the newer one sit together without competing. You look straight at the worst parts and let them say something new."
            },
            {
              "label": "THE FIXED TELLING",
              "text": "Meaning got settled early, usually around a wound, and it has not been reopened since. You tell your history the same way you have told it for decades and arrive each time at the identical conclusion. A version held that long stops being a memory and becomes something you recite. Where your worth sits is inside that story, in the role it gives you, which is why altering one detail feels like losing all of it. The fixed telling is protected by a fear of making the suffering feel wasted by revising what it meant. So the conclusion stays where it was put, by somebody much younger than you, working with far less information."
            },
            {
              "label": "TELL IT DIFFERENTLY",
              "text": "Tell one part of your history this week with a different emphasis, and check whether that version is also true. Keep both accounts side by side rather than deciding which of them wins. Choose the episode you feel most certain about instead of a minor one. Give the retelling twenty minutes on paper, in one go."
            }
          ]
        },
        "13": {
          "title": "13 in Spiritual Purpose - Transformation",
          "fields": [
            {
              "label": "RELEASED, NOT TAKEN",
              "text": "Letting go happens before the thing is taken from you, which a lifetime of endings taught you and most people never learn. Releasing something on your own terms is a wholly different event from having it stripped out of your hands. You let a thing die when it is done, so that whatever is truer about the moment has room to arrive. None of it needs to be dramatic, and you do not stage the endings you choose. What leaves your life leaves cleanly, and you keep a dignity in it that has nothing to do with staying in control."
            },
            {
              "label": "HELD UNTIL PRIED",
              "text": "Everything gets held until circumstance takes it, so each ending arrives as a loss rather than as a decision you made. You are gripping something now that is already going, and the gripping feels like fighting for it rather than what it is. The difference between those two is invisible from the inside, which is why this pattern has survived so long. Your worth is tied to holding on, to outlasting the urge to quit, so any release registers as failure rather than as timing. Holding on that hard comes from fearing that a voluntary letting-go would be an admission it was already over. It is easier to be robbed than to decide, because being robbed asks nothing of you. Every ending you did not choose gets to be somebody else's fault."
            },
            {
              "label": "CHOOSE THE ENDING",
              "text": "Release one thing on your own terms this month, while keeping it is still genuinely an option, since that is the only window the choice exists in. Pick something real rather than the easiest candidate available. Name the day, and tell one person the day, so it is on the record. Do the releasing in one go instead of letting it thin out across a year. Mark it in the calendar before the week ends."
            }
          ]
        },
        "14": {
          "title": "14 in Spiritual Purpose - Temperance",
          "fields": [
            {
              "label": "THE WEIGHTING IS YOURS",
              "text": "The proportion has settled, and after a lifetime of adjustment the weighting you arrived at is genuinely your own. You stopped treating it as provisional, which is what turned a working arrangement into an actual answer. The balance you strike is right because it was tested across decades, not because a rule told you where it should sit. You let something be final, and that gave you the rest that constant adjustment was never going to produce."
            },
            {
              "label": "NOTHING EVER FINISHES",
              "text": "Adjustment never stops, so no stage of your life is allowed to simply be what it is. Every arrangement is provisional, held open in case a better weighting turns up, and not one of them gets to close. Feeling settled has not happened, and you describe that as staying responsive rather than as never arriving anywhere. You are valuable, in your own accounting, because you can still adjust, which makes anything final look like decline. Every recalibration is fed by a fear of losing the flexibility that has defined you for as long as you can remember."
            },
            {
              "label": "DECLARE ONE FINAL",
              "text": "Declare one arrangement in your life final this week and stop adjusting it, including the small adjustments you would not count as adjusting. Write down which one it is and the date you fixed it, so the decision has a record rather than an intention. Leave it entirely alone for three months before you allow yourself to look at it again."
            }
          ]
        },
        "15": {
          "title": "15 in Spiritual Purpose - The Devil",
          "fields": [
            {
              "label": "NO LONGER RUNNING YOU",
              "text": "Whatever gripped you across the decades has no purchase now, and it is not being held down by willpower. Your appetites, the ones you acted on and the ones you did not, can be looked at directly without you flinching away. There is no shame attached to knowing exactly what you are capable of wanting. None of it runs you, which is a different condition from having it beaten into submission. The knowing and the freedom arrived together rather than one after the other. You name your own wanting plainly and go about the day unaffected by having named it."
            },
            {
              "label": "THE RESPECTABLE VERSION",
              "text": "The bind is still maintained, in a quieter form that has earned itself a respectable name over the years. What was once a compulsion now looks like a resentment, or a habit of control, or a small private arrangement nobody questions. Something still has you, and you have stopped framing it as a thing that could ever end. Your worth is now bound up with the respectability that quiet version bought, so naming it plainly would cost you something decades in the making. The quiet form is guarded by fear that saying outright what it is would undo everything that respectability earned."
            },
            {
              "label": "SAY IT PLAINLY",
              "text": "Say what still has hold of you, out loud, in its current quiet form and by its plain name, within the next three days. Use one sentence with no justification attached, and say it to yourself before you consider saying it to anybody else. Write the same sentence down and keep it where you will read it again next month. Do not soften the wording when you write it."
            }
          ]
        },
        "16": {
          "title": "16 in Spiritual Purpose - The Tower",
          "fields": [
            {
              "label": "WHAT DIDN'T FALL",
              "text": "Something remained through every collapse you went through, and you can say what it is without reaching for comfort. It is not a consolation you offer yourself; it is the ground you were standing on the entire time. Recovery from a real collapse happens fast in you, and what the collapse showed gets taken in rather than merely survived. Very little frightens you now, since the worst has already run its course more than once and here you still are. You name the thing that did not fall and stand on it openly."
            },
            {
              "label": "ORGANISED AROUND COLLAPSE",
              "text": "A whole history gets organised around what fell, so the collapses are the landmarks and the rest is the space between them. You are still bracing, and you still identify first as somebody that things happened to. Listing your ruptures is easy and precise, and naming what came through them is a question you go blank at. Worth attaches to having survived rather than to anything you built, which means the collapses have to stay central for the account to hold. The bracing has outlived the danger, and it goes on out of habit rather than out of expectation. Bracing this long is kept up by a fear that naming what never went would jinx it into being taken too. So it stays unnamed, and a foundation you have not named is one you cannot feel yourself standing on."
            },
            {
              "label": "WRITE THE LIST",
              "text": "Name what has never gone, in plain words, and get it written down before the week is out, as fact rather than as reassurance. Go through each collapse in turn and mark what was still there afterwards, one line for each of them. Keep the list and read it again in a month without editing anything you wrote. Do the first pass in one go. Use paper rather than a screen."
            }
          ]
        },
        "17": {
          "title": "17 in Spiritual Purpose — The Star",
          "fields": [
            {
              "label": "HOPE THAT OUTLIVES YOU",
              "text": "Hope has somewhere to go once you stop being the only place it lives, and you have found that somewhere. You have taken what you want for the world and put it into younger hands, knowing they will hold it in a shape you would not have chosen. That change of shape is what makes it durable, and you can watch it happen without steering them back toward your own version. Your hope has stayed soft without ever going naive, which is a difficult pairing to keep intact across a long life. You give away the largest thing you carry and let it belong to somebody other than you."
            },
            {
              "label": "THE UNSHARED VISION",
              "text": "Kept private to the last, the vision goes when you go, and no part of it survives the person holding it. You describe what you want for the world in company and then take it home again, still entirely yours, still unassigned to anybody. Your private verdict on your own life rests on the vision staying in your hands, so releasing it reads as losing the thing that made all those years of carrying count. Harder to look at is the arithmetic underneath: naming somebody to hold it says out loud that the finish arrives without you there. So you keep carrying, long after carrying stopped being the useful half of the job. And the biggest thing you ever wanted exists in one location only, and that location has a lifespan."
            },
            {
              "label": "HAND IT ON NOW",
              "text": "Pick one specific person today and tell them plainly what you have wanted for the world, in your own words and at full size. Say the sentence that transfers it — that it is theirs to carry from here, and theirs to alter. Attach no instructions about what it should look like once somebody finishes it. Keep a note of the day you said it and leave everything after that alone."
            }
          ]
        },
        "18": {
          "title": "18 in Spiritual Purpose — The Moon",
          "fields": [
            {
              "label": "YOURS AND THEIRS SEPARATED",
              "text": "Two family lines handed you material that was never named out loud, and you can tell that material apart from what actually began in you. The distinction holds even while everything around it stays unresolved, because you do not require certainty before acting on something you already know. What you have set down was heavy and it belonged to somebody before you, and the drop in the load is measurable rather than imagined. You keep only what started with you, and you carry that at its real weight instead of the inherited one."
            },
            {
              "label": "SHAME ON LOAN",
              "text": "The sorting stops halfway through, and everything that came down those lines keeps your name attached to it for good. Both halves of that stay broken: the borrowed material never goes back, and the part genuinely yours never gets seen clearly on its own. You feel the dread arrive and file it as a fact about your character instead of as weight handed forward from two generations back. Your self-respect depends on understanding exactly where each thing in you originated, so an unsorted feeling reads as a personal failing and not an unfinished piece of work. What you will not do is follow the dread all the way home, because arriving there means living through the start of it a second time. So the shame stays running under an ordinary day, older than you are, still answering when your name is called."
            },
            {
              "label": "NAME THE BORROWED PART",
              "text": "Take an hour tomorrow and write out three things you believe about yourself that you have not yet examined for an owner. Follow each one back to the earliest point you can genuinely locate, and mark any that were already running before you got here. Say the words aloud for at least one of them: this is not mine, and I am putting it down. Then go about your day without checking whether the putting down took."
            }
          ]
        },
        "19": {
          "title": "19 in Spiritual Purpose — The Sun",
          "fields": [
            {
              "label": "LIT WITH NO JOB",
              "text": "Nothing hangs on your warmth any more — no role to prop up, no group to hold together, no expectation waiting to be met — and it is still there. That is how you know it was never a performance, because a performance ends the moment the reason for it does. You bring real vitality into a room with nobody needing to watch it and nothing needing to be justified by it. You can be flat, tired or difficult around the closest ones in your life, and the light comes back on its own without you working it. You run at full warmth with absolutely nothing resting on whether you do."
            },
            {
              "label": "BRIGHT ON SCHEDULE",
              "text": "The role went all the way down, and no version of the day exists where you get to be off duty inside it. You arrive lit regardless of what the morning was, and your own difficulty is handled somewhere private where it costs nothing. You grade yourself on whether the brightness held from the first hour to the last, so a dull afternoon lands as a lapse of duty rather than a normal Tuesday. The risk you will not take is a flat hour witnessed after this many years of steadiness, because that would read as a letdown you have no right to hand anybody. So the flatness goes behind a closed door and gets managed alone, on exactly the days there is least left to manage it with. Both halves cost the same thing: the warmth is never tested, and you never learn what sits underneath it."
            },
            {
              "label": "ONE FLAT AFTERNOON",
              "text": "Choose one afternoon this week and spend it with a single person while lifting nothing at all. Say how you actually are, including cool or tired or blank, and add nothing warm afterwards to smooth the edge off it. Let the silences sit exactly where they fall rather than filling them, for the whole afternoon and not just the opening ten minutes. Go home and do not review how any of it went."
            }
          ]
        },
        "20": {
          "title": "20 in Spiritual Purpose — Judgement",
          "fields": [
            {
              "label": "ANSWERED SMALL AND REAL",
              "text": "You answered, and not at the scale you once pictured or on any timetable that would have impressed a single soul. Nothing was riding on it except that it was yours to give, which is the only condition under which a response is genuinely your own. You act on what called you without needing the act witnessed, ranked or defended afterwards. The low hum of postponement that ran underneath so many of your years has gone quiet, and that quiet is not resignation. You give the answer at whatever size was actually within reach and let it stand there."
            },
            {
              "label": "THE DELAY DEFENDS ITSELF",
              "text": "The call already came, and you are still waiting on a clarity that was never going to arrive in the form you had in mind. You prepare, you collect one further piece of certainty, and the preparing has quietly become the entire activity. Your private standing rests on eventually doing it properly, so a small late response would be worth less to you than the enormous one you have not begun. What you keep well away from is the sum: replying now, imperfectly, proves the waiting bought you nothing. So you remain almost-ready, and almost-ready is a position that holds for decades without ever announcing itself as a choice."
            },
            {
              "label": "ANSWER AT TODAY'S SIZE",
              "text": "Name the thing you have been waiting to be certain about, and today give whatever answer is genuinely within reach — a paragraph, a phone call, one decision spoken aloud. Do it before you feel ready, and resist enlarging it to match the version you have been picturing for years. Put the date on it wherever you keep records, and then leave the whole question shut for a fortnight."
            }
          ]
        },
        "21": {
          "title": "21 in Spiritual Purpose — The World",
          "fields": [
            {
              "label": "COMPLETE WITHOUT BEING EXHAUSTIVE",
              "text": "The arc reads as whole to you even though it plainly contains everything you did not reach, and both of those sit in it without cancelling. Wholeness was never the same as exhaustiveness, and holding that difference is what lets you look at the unfinished parts without flinching from the total. You can state aloud what you completed, and the statement stands up when you examine it yourself later. You gather the done and the undone into one honest reckoning and call that reckoning finished."
            },
            {
              "label": "COUNTED ONLY BY GAPS",
              "text": "A running list of what you did not reach lies over the whole of your life, and it is the only list you can recite from memory. The breadth that let you see more than most is exactly what keeps that list growing, since a wider view finds more that was never started. You can enumerate the unfinished business precisely, down to the years and the names, and go blank on the plain question of what you finished. The esteem you hold for yourself depends on continuing to reach, so declaring the life complete would feel like filing a resignation. The part you keep out of sight is that calling it whole ends the striving, and the striving has been your shape for so long that stopping looks like vanishing. So nothing counts, the completed work included, and the account never closes. Both ends of that hurt: you cannot credit what is done, and you cannot forgive what is not."
            },
            {
              "label": "SAY WHAT YOU FINISHED",
              "text": "Sit down tonight and write the list you have not written before: the things you carried all the way through to done. Give each one a line with the year beside it, and stop at ten whether or not the page looks full. Read it back aloud, once, without opening the other list at any stage. Leave the unfinished business precisely where it stands and do not touch it tonight. Keep the page where you will come across it next month."
            }
          ]
        },
        "22": {
          "title": "22 in Spiritual Purpose — The Fool",
          "fields": [
            {
              "label": "WILLING AT THE LAST",
              "text": "A lifetime of stepping off before the ground was proven has produced exactly what it was always going to produce: you, facing an unknown that nobody will explain first. You go forward without a guarantee, on the same trust that carried every leap before this one. There is no bravado in it and there never had to be, because the willingness was never about looking brave to begin with. The unfamiliar does not have to be made safe before you will walk straight into it. That same readiness turns up now, unchanged, at the one place it was always going to be needed. You take the step that has no map, and you take it steadily."
            },
            {
              "label": "CLUTCHING AT CONTINUATION",
              "text": "The openness walks out precisely at the moment that needs it, and a life of leaping finishes in a grip. You clutch at certainty, at continuation, at any assurance whatsoever about what comes next, and the clutch tightens as the years narrow. Your whole account of yourself is somebody who moves without proof, so gripping now is a contradiction you will not say out loud. The thought you keep unfinished is that this leap has no far side anybody can describe, and every previous one did. So you have grown more frightened rather than less, and the fright arrives dressed as sensible caution."
            },
            {
              "label": "PRACTISE NOT KNOWING TODAY",
              "text": "Pick something small today and enter it deliberately unprepared — a route you did not check, a conversation you did not script, a call made without the final piece of information. Let the pull to look something up go unanswered for ten minutes, and carry on regardless. Do that once a day until Sunday, always in something that genuinely matters very little."
            }
          ]
        }
      }
    }
  };
  window.DPurposeContent = {
    get: function (posKey, arcanaNum) {
      const grp = T.positions[posKey];
      return (grp && grp[Number(arcanaNum)])
          || (prev && prev.get(posKey, arcanaNum)) || null;
    },
  };
})();
