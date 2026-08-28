'use strict';
/*
 * talent-content.js — second-generation overlay.
 *
 * Layered on top of js/talent-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DTalentContent — 49 records
(function () {
  const prev = window.DTalentContent;
  const T = {
    "archetypes": {
      "LEADER_ACTION": {
        "title": "You Move Before Anyone Else Is Ready To",
        "fields": [
          {
            "label": "FIRST FOOT DOWN",
            "text": "Your body registers a stalled moment as pressure, and you relieve it by moving first while the room is still weighing whether to. Hand you a half-formed plan and uncertain faces and you commit, because waiting costs you more than a wrong move does. You start things and also close them, and the unglamorous middle is work you hold instead of trading for a fresher beginning. A half-second sits before the push, long enough to weigh whether this moment wants speed or stillness, and it is what makes the speed usable. You turn a stalled plan into a moving one by beginning it before the argument about it has finished."
          },
          {
            "label": "PACE NOBODY AGREED TO",
            "text": "Speed becomes its own justification, and you drive a plan forward long after the moment that needed driving has closed. Control starts passing for leadership, so you set the tempo and do not ease off even when the room asks plainly. Motion is where you locate your own worth, so a day where nothing moved feels like a day where you amounted to nothing. A week where nothing shifted becomes an indictment of your character rather than a fact about the work. Underneath sits a dread of standing still, because stillness registers to you as disappearing from the room altogether. So you keep pushing, and the agreement around you thins out long before anybody says a word about it. That thinning is not bad luck arriving; it is your own tempo coming back to you with a delay."
          },
          {
            "label": "ONE MOMENT LEFT ALONE",
            "text": "Pick one decision you would normally force through by Wednesday, and deliberately leave it untouched until Friday morning, hands off, no side project substituted in. Before every push after that, ask not whether you can move it forward but whether this hour wants moving. Sit through the delay without filling it, and log in one line what the untouched decision looks like by Friday."
          }
        ]
      },
      "INTUITION_WISDOM": {
        "title": "You Know Before You Can Explain How",
        "fields": [
          {
            "label": "THE READ ARRIVES EARLY",
            "text": "The read lands in you before any evidence exists, and it arrives whole rather than as the last step of an argument. A room changes and you register the change in your body before anyone has said the sentence that changed it. You hold a complicated situation open without forcing it shut early, which is what lets you see the third and fourth thing inside it. Research suits you for the same reason, since you stay with one question well past where most patience runs out. You read what is actually going on in a situation before it has finished forming, and you are usually right about it."
          },
          {
            "label": "THE KNOWING STAYS IN",
            "text": "Perception kept entirely inside you stops being a talent and becomes a habit of withholding, loudest exactly when speaking would help. Turning a felt sense into plain words costs some of its precision, and you treat that cost as sufficient reason to leave the whole thing unsaid. You would rather work something out alone and be exactly right than work it out in front of somebody and be halfway. Your worth rests on an accuracy that has never been put in front of anything, which is an unbeatable position and also an empty one. Below that runs a dread of offering the true thing and watching it fail, of the sensing meeting a blank look. So the sharpest thing about you stays indoors, and it feels to you like being ignored when the sentence was never actually spoken."
          },
          {
            "label": "SAY THE OLD ONE",
            "text": "Choose whatever you have known for months and never stated, and put it to the person it concerns before Sunday. Give it one plain sentence, with no preamble about how hard it is to explain and no invitation to argue first. Say it at full size, once, and resist the pull to immediately explain it a second way. Rehearse it twice at most, then go."
          }
        ]
      },
      "CREATIVITY_ART": {
        "title": "You Make Things That Are Meant to Be Seen",
        "fields": [
          {
            "label": "INSIDE GIVEN A FORM",
            "text": "Something private in you finds an outer shape, and the shape carries the feeling accurately enough to survive the trip out. Aesthetics, performance, work made to stand in the open: this is craft, not vanity, whatever it has been called at you. The material starts somewhere wordless and you pull a thread of it into an object that can be handled, which is nearer to translation than to display. You can stay visible beside what you made rather than putting it out and stepping away from the moment it arrives. That steadiness is what lets the difficult version get finished instead of abandoned at the point it starts costing something. You make the true version first and hand it over second."
          },
          {
            "label": "SANDED DOWN TO SAFE",
            "text": "Somewhere between making it and showing it you shrink the work, rounder and safer, and you file that under editing. Then the response starts mattering more than the object, until being visible becomes the aim instead of a by-product. Your worth tracks the temperature of that response, so a warm one settles you briefly and a flat one rewrites the finished piece as a failure. You notice the shrinking while your hand is doing it, and you finish the pass anyway, which is the part that costs. What sits under the softening is a conviction that the unedited version is not welcome, and that being wanted was always conditional on being palatable. So the work leaves you already softened, and the lukewarm feeling coming back is your own edit returning on time."
          },
          {
            "label": "MAKE THE UNLIKEABLE ONE",
            "text": "Make one piece this month with no plan to show it to anybody, allowing it to be as strange or as unflattering as it insists on being. Block a single evening for it in advance and stop only when it is finished, never at the earlier point where it turns presentable. While you work, watch for the moment your hand moves to make it easier to like, and carry on past it. Keep it unshown for thirty days before deciding anything about its future."
          }
        ]
      },
      "TEACHER_FREEDOM": {
        "title": "You Teach Best When You Let People Outgrow You",
        "fields": [
          {
            "label": "TAUGHT WITH AN EXIT",
            "text": "Handing over what you know comes easily, and it goes whole rather than in instalments that keep somebody returning for the rest. You build arrangements another person can pick up and run without you standing beside them narrating the parts. The unusual route you took is one you can describe accurately enough that somebody else walks it without you anywhere near them. You teach the thing and then step back far enough that it gets used without you in the room."
          },
          {
            "label": "SLIGHTLY INDISPENSABLE",
            "text": "A quiet arrangement forms where a student, a team or a system stays dependent enough to require you again next week, and you call that freedom. The reverse version costs you as much: you refuse structure so thoroughly that nothing solid ever gets passed on, and openness is the word you use for it. What makes you feel needed is where your worth lives, so a stretch when nothing needs holding up feels less like rest and more like being written out of the picture. Under it is a plain fear that need is the whole of your place, and that nothing leaning on you leaves no reason to be there. So the last piece of the explanation stays with you, launches keep not quite happening, and you read that delay as their pace."
          },
          {
            "label": "TEACH YOURSELF OUT",
            "text": "Set a date within three weeks when one person or team stops needing you for something they currently bring you weekly. Write out everything currently living only in your head, including the part you normally hold back to deliver in person, and pass it across in full. Do the writing in one sitting so nothing is left over as a reason for a later conversation."
          }
        ]
      },
      "TRANSFORMATION_POWER": {
        "title": "You Find Clarity Right Where Everyone Else Loses It",
        "fields": [
          {
            "label": "CLEAREST INSIDE THE WRECK",
            "text": "Collapse does something to you that it does not do to most people, in that your thinking sharpens as the situation deteriorates. You walk into upheaval and find the actual shape of it while everyone else is still absorbing that it happened at all. You see what the breakdown has cleared room for, early enough to use the space rather than only mourn what was standing in it. Real crisis is where your judgement is sharpest, which is an unusual place for a person to keep it. Endings do not frighten you the way they frighten most people, so you name one out loud early instead of negotiating. You convert a wrecked situation into a workable starting point, and you begin that conversion while everybody around you is still stunned."
          },
          {
            "label": "PEACE READS AS WARNING",
            "text": "Upheaval becomes the only condition you feel competent inside, so you drift toward it, start it quietly, or stay near instability. You pull down arrangements that were working, because dismantling is the move your hands reach for first and a functioning thing offers you nothing to do. Your worth gets measured by what you have survived, so a calm month registers as one where you proved nothing at all. Beneath that sits a certainty that quiet is only the pause before the next break, which turns rest into negligence. So the calm stretches never get to stay calm, and a fair share of the upheaval that keeps arriving is work you did yourself."
          },
          {
            "label": "AN UNBROKEN QUIET WEEK",
            "text": "Book three evenings over the next two weeks with nothing in them, no problem to solve, no repair scheduled. Keep them even when something urgent turns up that you could plainly handle, and leave somebody else's emergency with them for the night. Halfway through each of those evenings, notice what you find yourself waiting for and put it into a single sentence for yourself. When the urge arrives to start, change or finish something, mark the time it turned up and leave it unacted on. Sit all three evenings out even if the first one is close to unbearable."
          }
        ]
      }
    },
    "positions": {
      "pastLife": {
        "1": {
          "title": "A Skill You Already Have, From Before You Learned It Here",
          "fields": [
            {
              "label": "STARTING WITHOUT THE RUN-UP",
              "text": "Beginning costs you almost nothing, where the same first step takes most people a long private build-up. It never felt like something you picked up, because the decisive part was working before you had any cause to practise it. A faint impatience shows up when somebody is still gathering nerve for a thing you would have begun ten minutes ago. Standing in front of a decision you cannot yet enter is a posture you have very little experience of. You move first, from cold, into situations that most efforts need a running start to enter."
            },
            {
              "label": "THE PREPARATION SKIPPED",
              "text": "The ease turns into a liability the moment it stands as proof that groundwork is for other kinds of effort. You walk into unfamiliar territory carrying an instinct that was never tested there, and you learn halfway through that it does not reach that far. The second version is quieter: the old fluency is assumed to transfer, so the question of whether it fits this ground is never actually put. Speed off the mark is your private measure of whether you are any good, so slowing down to prepare reads as an admission of being ordinary. Under that: if preparation were required of you like everybody else, the head start was never real and the advantage was only timing. So you keep leaping, and the falls arrive in exactly the places you knew least about."
            },
            {
              "label": "DO THE HOMEWORK ANYWAY",
              "text": "Pick the one thing on your list that is genuinely new, then give it two hours of preparation before you touch it. Set those two hours on a named day this week and treat them as part of the job instead of a delay before it. Begin only once the two hours are spent, even if the urge to move arrives at minute ten."
            }
          ]
        },
        "2": {
          "title": "A Perceptiveness You Brought With You, Already Trained",
          "fields": [
            {
              "label": "ACCURATE BEFORE THE FACTS",
              "text": "Situations come to you already sorted, and the sorting is right more often than your hours in rooms like that would explain. It arrives closer to recall than to reasoning, as though you had met this shape of thing before and only had to name it again. Half a minute in, you have the read: who is holding back, where the real disagreement sits, which way this is going to go. You name what is actually happening in a room before you have the experience that would entitle you to know it."
            },
            {
              "label": "THE READ LEFT UNCHECKED",
              "text": "Accuracy this good stops getting checked, so you act on the first impression at full confidence, skipping the ten minutes of asking that would show whether this case matches the pattern it resembles. The other expression is narrower: a situation gets slotted into a shape you already hold, and everything after that is read to confirm the slot. Getting there first, without being told, is how you rate your own mind, so checking feels like conceding you needed the check. The scare underneath is that the seeing is not yours at all, and that with the facts in hand you would be as slow as anybody. So the read stays unexamined, and when it misses it misses in the places that looked most familiar."
            },
            {
              "label": "TEST ONE READ FRIDAY",
              "text": "Take the strongest read you are currently holding about a live situation and write the three facts it rests on. Spend twenty minutes before Friday finding out whether those three are true right now, rather than true in general. Hold off acting on the read until that is done, even where a day of waiting costs you something. Change the read in writing if the facts do not support it."
            }
          ]
        },
        "3": {
          "title": "A Capacity to Nurture That Arrived Already Fluent",
          "fields": [
            {
              "label": "TENDING COMES FIRST",
              "text": "Feeding, steadying and growing things runs in you at a level nobody had to teach you. You see what a person needs before they have finished describing the problem, and your hands are already moving toward it. The skill came fluent rather than assembled, which is why it passes for effortless and rarely gets counted as work. Nothing about it feels like generosity from the inside; it is simply what you do with your attention when something is struggling. Left alone with something small and failing, you know what to change first, what to change second, and what to leave. You make the conditions in which things recover, working from no method you could set down for anybody."
            },
            {
              "label": "THE ROLE NOBODY ASSIGNED",
              "text": "The fluency picks the role for you: whatever the room is, you become the one looking after it, asked for or not. Care goes out to situations that never requested any, and it continues well beyond the point where it made a difference. The second shape is what it costs you, because your own needs come last in every arrangement you have made yourself responsible for. You know what everybody in your life needs this week and could not say what you need with anything like the same accuracy. Providing is your entire case for taking up space, so an evening when nothing needs you feels like being out of work. The frightening version is that with nothing to tend you would be unnecessary, and you keep enough of it around you that the question stays shut. You arrive everywhere already carrying something, and the tending goes on long after anybody would have asked for it."
            },
            {
              "label": "HOLD THE HELP BACK",
              "text": "Go into one gathering this week, a meal or a visit, and take responsibility for nobody's comfort while you are there. Bring nothing you could hand out, and offer no solution to a problem that is not yours to solve. Notice the pull to start helping, let it go past, and stay sitting down for the length of it. Choose the day in advance, and leave at the end without having repaired anything. Write two lines that evening about what the hour felt like from where you were sitting."
            }
          ]
        },
        "4": {
          "title": "A Command Over Structure That Feels Older Than Your Actual Practice",
          "fields": [
            {
              "label": "COMMAND WITHOUT THE PRACTICE",
              "text": "Order comes out of you under conditions where most of a room is still working out who decides what. You hold authority steadily, without the strain of somebody performing it, and with more composure than your actual years at it account for. Structure is obvious to you: who owes what, where the work stalls, which decision has to be settled before anything else can move. The role fits before you have grown into it, which is why stepping into it costs you no visible effort. You put a shape on a disorganised situation and run it while the discussion about how to run it is still going."
            },
            {
              "label": "TAKING GROUND NOT YOURS",
              "text": "The reflex does not check the boundary, so your hands land on decisions that were somebody else's to make. Direction gets given where none was requested, and the correction comes later and awkwardly, once the territory has already been rearranged. There is a second cost, which is that you carry choices that were never yours and then resent the weight of them. Your self-respect rests on whether what you touched is running properly, so standing back reads as agreeing to be nothing much. Under it sits something plainer: with nothing depending on your direction, you would have no idea what you are for. You keep reaching for control where none was offered, and every reach adds a job you did not want."
            },
            {
              "label": "ASK WHOSE CALL IT IS",
              "text": "Choose one situation this week where the urge to direct is loudest, and give the decision to whoever it belongs to. Say once, out loud, that it is their call, then stay quiet through the part where you would normally correct the method. Sit with the discomfort for the full length of the meeting instead of resolving it by taking the thing back. Do this on the first day it comes up, and do it without a running commentary."
            }
          ]
        },
        "5": {
          "title": "A Body of Knowledge That Feels Already Studied",
          "fields": [
            {
              "label": "RESUMING AN OLD STUDY",
              "text": "Frameworks open for you faster than they should, and the structure of a teaching is visible while the first chapter is still being read. Learning a tradition works more like picking up a book you had put down than starting one you had never held. Several systems sit in your head at once, and you see where they agree without having to set them side by side. You reach the working core of a body of thought in a season, where the usual route runs to years."
            },
            {
              "label": "CERTAINTY THAT STOPPED MOVING",
              "text": "Certainty that arrives already formed does not feel like an opinion, so it never goes through the testing an opinion would face. You defend the old framework harder than current evidence warrants, and the defending gets sharpest exactly where you are least sure. The quieter form is refusal, where new material that does not fit is set aside as beneath comment instead of answered. Argument becomes performance rather than inquiry, and you catch yourself reaching for the strongest available answer instead of the true one. Holding the correct account of how things work is what your composure rests on, so an error on substance lands as something much larger. Beneath it is the chance that the certainty was never earned, that a conclusion was handed to you and you have been guarding it since. So the framework hardens, and the parts of it that no longer describe anything stay in place untested."
            },
            {
              "label": "READ THE OPPOSING CASE",
              "text": "Find the strongest written case against a position you hold firmly and read it through this week without arguing back in the margins. Give it two sittings if two are needed, and write one paragraph on the part that was hardest to dismiss. Leave the position alone for seven days after that, and keep the paragraph where you can read it again."
            }
          ]
        },
        "6": {
          "title": "A Way of Choosing That Feels Already Practiced",
          "fields": [
            {
              "label": "KNOWING WHO FITS",
              "text": "Whether a person or a path actually suits you registers early, well before the reasons for it are available to say. The judgement is unusually good, and it was running at full strength before you had the years of company that would build it. You can tell the difference between somebody pleasant and somebody who will still be standing there in a hard month. Choosing badly is rare for you and choosing slowly is rarer, because the answer is usually there inside the first hour. You settle on a person in an afternoon and are still right about them five years later."
            },
            {
              "label": "THE OLD SHAPE OVERLAID",
              "text": "The same instinct runs a template over somebody new, and the template was cut to fit a different person entirely. Someone gets read through a resemblance, and everything they do afterwards is counted as more of the same instead of as anything about them. The reverse costs more: a person is ruled out inside a minute for resembling a shape that was never about them. Reading people accurately is your main claim on being a serious adult, so a misread registers as a demotion rather than a mistake. The unwelcome thought is that you have been meeting the same handful of shapes for years and calling it discernment. You keep the template because dropping it means arriving at somebody with nothing prepared, which is slower and much less comfortable."
            },
            {
              "label": "THREE QUESTIONS, NO CONCLUSION",
              "text": "Spend one conversation this week with somebody you have already categorised, asking three questions whose answers you cannot predict. Ask them early, before the conversation has settled into the pattern it usually takes. Keep your own summary of the person out of it while they are still talking. Leave the conclusion open until Sunday instead of testing whether the old shape still fits them. Write four sentences afterwards about what you heard that the shape had no room for."
            }
          ]
        },
        "7": {
          "title": "A Drive That Already Knows How to Move",
          "fields": [
            {
              "label": "MOTION ALREADY POINTED",
              "text": "Pursuit is your resting state, and you were fluent at it well before you had anything particular to pursue. Where other efforts stall at the unglamorous middle, yours keeps its pace, because the pace does not depend on the goal staying interesting. Long projects do not lose you at month four, since interest was never the thing carrying them along. You know how to turn a want into a sequence of days and then run the days without renegotiating them. Setbacks slow you without stopping you, and you are moving again before you have decided to move. You cover ground in a bad week that most efforts do not cover in a good one."
            },
            {
              "label": "CHASING THE OLD TARGET",
              "text": "The trouble is that the drive keeps going whether or not the thing at the far end still matters to you. Years go into a target chosen under conditions that have since gone, and the going is never questioned because the going feels right. Pausing itself reads as decline, so a new pursuit begins before the last one has been asked what it was for. Progress is your evidence of being alive, and a week without visible ground covered leaves you feeling like a smaller person. Stopping is unbearable for what it might show, that the movement was the whole substance and there is not much underneath it. So real energy goes into a goal that no longer fits, on nothing more than familiarity with pushing toward it."
            },
            {
              "label": "SATURDAY, BEFORE YOU MOVE",
              "text": "Block ninety minutes on Saturday and move no project at all during them. Write the goal you are currently pushing hardest, the date you chose it, and what you wanted from it then. Then write what you want now, in the same detail, without looking back at the first page. Mark anything that survives only because you are used to carrying it."
            }
          ]
        },
        "8": {
          "title": "A Sense of Fairness That Arrived Already Calibrated",
          "fields": [
            {
              "label": "WHAT IS OWED, SEEN",
              "text": "An uneven arrangement registers with you immediately, before you have identified which part of it is uneven. Weighing what each side put in and what each side took out is something you do without deciding to begin. The calibration was accurate on arrival rather than built up through years of being short-changed and learning from it. You state the fair version of an arrangement while everybody in it is still describing their own position."
            },
            {
              "label": "THE BAR SET ELSEWHERE",
              "text": "The standard was set somewhere else and gets applied here at full stiffness, so everybody near you is held to a bar they never agreed to. The judgement lands before their side has been heard, and it lands with the confidence of a rule rather than a reading. The reverse runs as well, since the same rigid terms get turned inward and you pay a price this arrangement never asked of you. Being straight about what is owed is the part of yourself you would defend last, so a fairness call that goes wrong unsettles you for a fortnight. The uncomfortable thought is that the standard is borrowed rather than reasoned, and that you have been enforcing something you never examined. So the terms get imposed instead of set, and the specifics of the case in hand go unread."
            },
            {
              "label": "TERMS FOR THIS CASE",
              "text": "Write out the terms of the arrangement that currently feels unfair, exactly as they stand rather than as they should be. Then, before Thursday, write what fair terms would be if this were the first arrangement of its kind you had seen. Mark every line where the old standard did the work instead of the facts of this case. Change one of those lines before you argue any of it with the other side."
            }
          ]
        },
        "9": {
          "title": "A Depth You Already Know How to Reach",
          "fields": [
            {
              "label": "THE WAY DOWN KNOWN",
              "text": "Going inward is a route you already know, and you reach something true down there while other attempts are still settling in. Sitting alone with a hard question is not deprivation for you, it is the condition under which your thinking actually works. The depth was not developed through practice you can name; it was fluent the first time you needed it. You come back from a few days alone with an answer that no amount of discussion would have produced."
            },
            {
              "label": "WITHDRAWAL AS FIRST ANSWER",
              "text": "Because the route down is so well known, it becomes the answer to everything, including the problems that needed a conversation. Difficulty arrives and you are already gone, and the leaving happens so fast that it never registers as a choice. A slower cost follows, since the situations you left carry on without you and settle into an arrangement you had no say in. Distance also gets read as strength, so the withdrawal is stored as principle rather than as the reflex it actually is. Self-sufficiency is the one trait you would keep if you had to give up all the others, so needing something from somebody registers as a personal failure. Under it is a plain worry: that the depth is a way of staying unavailable, and that being available is what you cannot manage. The retreat repeats, and the response a situation actually needed goes untried."
            },
            {
              "label": "TWENTY-FOUR HOURS BEFORE RETREATING",
              "text": "The next time something difficult lands, stay in the situation for a full day before you go anywhere on your own. Use that day to say one true sentence about the difficulty to somebody inside it, and say it within the first hour. Take the solitude afterwards, deliberately, instead of taking it as the first move you make."
            }
          ]
        },
        "10": {
          "title": "An Adaptability That Already Knows the Turning",
          "fields": [
            {
              "label": "READING THE CHANGE COMING",
              "text": "Change does not knock you sideways, because you recognise the movement of it before the movement has finished happening. You adjust while a situation is still turning, so your adjustment is complete by the time the turn is obvious to anybody. This was not built through a long history of upheaval; the fluency was there the first time conditions moved under you. Reversals hold no particular horror for you, and you plan on the assumption that nothing will stay as it currently is. You are quicker than the situation is, which means a new arrangement finds you already standing inside it. You keep working through the stretch of a change where everything is unclear and nothing has settled into place."
            },
            {
              "label": "THE TURN THAT NEVER CAME",
              "text": "Fluency with turning hardens into an expectation that this turn will run like the last ones, and expectation then does the reading. You brace early for a downswing this situation was never going to have, and the bracing costs you every month you spend in it. The reverse loss is larger, because a genuinely new pattern gets pressed into an old sequence and its real shape never gets seen. Knowing what comes next is what keeps the ground firm under you, so being surprised arrives as an insult rather than as information. Below that lies a suspicion that you cannot read change at all, only recognise repeats, and that a first-of-its-kind event would find you with nothing. The prediction gets made from memory, and the situation that does not repeat gets met with the wrong preparation."
            },
            {
              "label": "LIST WHAT IS DIFFERENT",
              "text": "List three ways the change currently underway differs from the last one that looked like it, and do it on Wednesday. Keep the list where you can find it again, with the day you wrote it at the top. Choose one action you would take only if those differences were real, and take it before the weekend. Leave the old sequence alone for that week, even while it is telling you what happens next. Add to the list on Sunday if the week showed you a fourth difference."
            }
          ]
        },
        "11": {
          "title": "A Steadiness That Arrived Already Tested",
          "fields": [
            {
              "label": "WEIGHT ALREADY CARRIED",
              "text": "Pressure that scatters most efforts leaves you working at the rate you were working at the day before. The calm is not performed, and it does not cost you a private collapse afterwards to pay for the composure. Long strain suits you better than sudden shocks, and you keep a difficult arrangement steady well past the week it stops being interesting. You keep going through stretches that stop other efforts entirely, and you carry on without mentioning that you are doing it."
            },
            {
              "label": "NO CEILING ASSUMED",
              "text": "Steadiness that has always held gets treated as having no upper figure, so the next load is accepted without a look at what is already on you. Nothing gets weighed, because weighing was never necessary before, and the limit announces itself only from the far side of it. Strain is absorbed without report, so the load keeps growing while every visible sign says you are fine. Rest gets postponed to a quieter month that the year never actually contains. Not buckling sits above every other quality in your own ranking, which turns asking for relief into a downgrade you hand yourself. The frightening thought is simple: that steadiness is all you actually bring, and it has a bottom you have not located. So you carry more than this season can sustain, on confidence collected in a different year."
            },
            {
              "label": "COUNT THE LOAD MONDAY",
              "text": "On Monday, write out everything you are currently carrying, including the parts nobody has ever named as work. Put a number beside each for the hours it actually takes, and add the numbers up honestly. Say out loud what your real capacity is this month, in hours, and take one thing off the list before Friday. Do the removal yourself and put no replacement in its place."
            }
          ]
        },
        "12": {
          "title": "A Capacity for Stillness That Already Knows How to Wait",
          "fields": [
            {
              "label": "AT EASE IN THE NOT-YET",
              "text": "Unfinished situations do not itch at you, and you leave a question open for months without forcing it shut early. Suspension is somewhere you can live rather than a stretch to be survived on the way through. Waiting is active in your hands: you watch the thing develop and notice what shifts while the pressure to act builds. The patience was fluent from the start rather than assembled out of disappointments that taught you to slow down. You sit inside uncertainty long enough for the real answer to arrive instead of the first one that fits."
            },
            {
              "label": "PATIENCE DOING OTHER WORK",
              "text": "Comfort with waiting becomes the standard answer, applied even to situations that needed a decision two months ago. Something sits, and goes on sitting, and the sitting is called patience while it is functioning as a way of not choosing. The option you were holding open closes on its own, and delay makes the choice in your place. Not being rushed is what you like best about yourself, so moving fast feels like agreeing to be one of the panicked. The part you avoid looking at is that some of the waiting is fear of choosing wrongly, and it has been calling itself timing for a long time. So the moment passes, and the thing that needed you to move gets settled without your hand in it."
            },
            {
              "label": "ACT ON THE STALLED ONE",
              "text": "Name the thing that has been sitting longest and act on it before Friday, at a size smaller than you would like. One phone call, one message sent, one payment made: the size matters far less than the date does. Put that date in writing tonight and hold it as fixed instead of as a first estimate."
            }
          ]
        },
        "13": {
          "title": "A Fluency With Ending and Rebuilding That Feels Already Practiced",
          "fields": [
            {
              "label": "AN ENDING YOU CAN RUN",
              "text": "Endings hold no terror for you, and you take apart a thing that other efforts would keep alive out of habit. The rebuilding afterwards is fluent as well, so the finish of one arrangement is already the beginning of the next. Loss leaves you organised, and you see the shape of what comes next while the old thing is still coming down. Grief does not stop you functioning, and you run the practical half of an ending in the days when it still hurts. The skill was not assembled out of a run of disasters; it worked the first time something of yours ended. You close what is finished and start its replacement inside the same season."
            },
            {
              "label": "CLOSED WHILE STILL ALIVE",
              "text": "Closure arrives early, so things get shut that had another year in them, and the shutting looks decisive from the inside. A difficulty appears, the ending presents itself as the clean answer, and the checking of whether it is genuinely over does not happen. Pre-emption is the other version, where you finish something before it can finish itself and keep the timing in your own hands. Being able to walk away is your proof that nothing owns you, so staying through a bad stretch feels like being trapped instead of committed. What you keep clear of is the thought that ending comes easily because attachment never went in very deep. The closures accumulate, and some of them were performed on things that were not done."
            },
            {
              "label": "THIRTY DAYS BEFORE CLOSING",
              "text": "Give whatever you are currently ready to end thirty days before you say anything final about it. Write one paragraph today setting out what would have to be true for it to be genuinely finished. Read that paragraph on the thirtieth day and check the actual evidence against it, line by line. Put the paragraph away for another month if the evidence is not there yet."
            }
          ]
        },
        "14": {
          "title": "A Balance That Arrived Already Calibrated",
          "fields": [
            {
              "label": "THE WORKABLE MIX",
              "text": "Competing demands resolve into a workable proportion in your hands, and the proportion usually holds when the pressure comes on. Moderating is not a compromise you negotiate with yourself; it is the first thing you see when two things pull opposite ways. The calibration arrived working, so you were finding the middle at an age when the middle is normally invisible. You find the mix that lets two incompatible demands each get most of what they need."
            },
            {
              "label": "ONE BLEND FOR EVERYTHING",
              "text": "The mix that worked before gets applied to a case that wanted a different proportion entirely, and it arrives so fast that the specifics are never read. You split the difference where the situation was asking you to pick a side, and the split leaves both halves too thin to work. Getting the proportion right is the skill you would name first if you had to name one, so an unbalanced call keeps bothering you for days afterwards. The thought you avoid is that balancing is sometimes how you get out of choosing, and that a real choice would show which side you actually want. The familiar blend keeps being applied to cases it does not fit, and each one comes out slightly wrong."
            },
            {
              "label": "ONE SITUATION, UNBLENDED",
              "text": "Choose a side completely on one live decision this week, keeping nothing of the other in reserve. Write beforehand what full commitment to that side looks like, then do the version you wrote instead of a softened one. Hold that shape until Sunday, and note on Sunday what the unmixed version actually asked of you."
            }
          ]
        },
        "15": {
          "title": "An Intensity You Already Know How to Hold",
          "fields": [
            {
              "label": "BUILT FOR STRONG WANTING",
              "text": "Desire sits at a strength that would overwhelm most arrangements, and you carry it without it running your day. Wanting something badly is not a crisis in your hands, it is an ordinary condition you have always known how to hold. You stay in the presence of something you want for months without either grabbing at it or talking yourself out of it. The capacity came at full size instead of growing into itself across years of practice at restraint. You hold appetite at a level most efforts have to dilute in order to survive."
            },
            {
              "label": "NEVER PUT TO THE QUESTION",
              "text": "Intensity that has always been there stops being something you have and becomes a fact about who you are. The wanting is never asked what it is for, so it goes on collecting things that stopped serving you some time ago. Scale is the other problem, since everything is wanted at one volume and the small preferences are impossible to separate from the real hungers. Satisfaction stays brief, because the appetite moves to its next object before the previous one has been finished with. The strength of your wanting is the proof to you that you are fully alive, which makes any talk of moderating it sound like a request to be less. Sitting under that is a suspicion that without the appetite there would be no particular person left, only a set of habits. So the pattern runs at full power and takes its direction from wherever it took its direction years ago."
            },
            {
              "label": "LOOK AT THE STRONGEST ONE",
              "text": "Write down the strongest want you are carrying and three sentences on what having it would actually change. Do that by Thursday, in plain terms, with no reasons attached and no defence of the want. Keep the three sentences short enough to read again in under a minute. Show the page to nobody until the week is up. Read the sentences a week later and mark which of them are still accurate."
            }
          ]
        },
        "16": {
          "title": "A Resilience That Was Already Proven Before This Life",
          "fields": [
            {
              "label": "STANDING UP AGAIN FAST",
              "text": "Collapse does not finish you, and the recovery begins while the situation is still falling apart around you. You know the sequence for rebuilding: what to save, what to leave, and which piece has to stand before the others can. That knowledge was not earned across a documented series of disasters; it was ready the first morning something of yours broke. Sudden rupture finds you unusually functional, and you make decisions during it that most efforts can only make months afterwards. You rebuild from very little, quickly, and you start before you feel ready to start."
            },
            {
              "label": "NO PRECAUTIONS TAKEN",
              "text": "Recovery this reliable becomes a reason to take no precautions, so safeguards that would have cost an afternoon go unmade and the afternoon comes back many times over in repair work. Some part of you is more at home in the wreckage than in the maintenance that would have prevented it. Surviving what would end other arrangements is the strength you count on in yourself, and prevention offers no comparable proof. The unpleasant possibility is that you are only impressive in ruins, and that a well-kept ordinary life would leave you with nothing to be good at. Precautions stay unbuilt, and the skill gets exercised on damage that never needed to happen."
            },
            {
              "label": "ONE SAFEGUARD THIS MONTH",
              "text": "Protect the one thing that would hurt most to lose, with a single safeguard built this month. Give it one afternoon: a backup, a written agreement, or a conversation had early instead of late. Do it while nothing is wrong, on a date you set today, and finish it in that one sitting."
            }
          ]
        },
        "17": {
          "title": "A Hope That Arrived Already Trusting",
          "fields": [
            {
              "label": "TRUST WITHOUT A HISTORY",
              "text": "Something in you expects the thing to come out well, and that expectation was running before you had any evidence for it. It does not feel like a conclusion you reasoned your way to; it feels more like a setting you turned up with, already fluent. You hope through difficulty with the ease of long practice, so a hard stretch does not flatten your outlook. That steadiness gets sharper the moment you check it against what your situation now actually allows. You hope at the size your life can currently carry, and the hope holds weight because of it."
            },
            {
              "label": "SIZED DOWN IN ADVANCE",
              "text": "The hope stays deliberately small, trimmed early on a caution that made sense somewhere and does not fit the room you are standing in. That shows up twice: you ask for a modest version of what you want, and you privately shrink the wanting itself so the modest version feels honest. Feeling steady depends on never having overreached, on having wanted exactly as much as it was safe to want. So you underclaim what your circumstances would readily support, and you call the underclaiming realism. Below that sits the dread that a hope stated plainly would be met with nothing, and that the nothing would be a judgement on the hoping itself."
            },
            {
              "label": "SAY THE UNGUARDED VERSION",
              "text": "Take the hope you have kept in its small form and write out the full-sized version this week, without the qualifier you would normally attach. Read that line aloud to yourself twice at the size you wrote it rather than the size you usually speak it at. Then look at your circumstances now and list, in three lines, what would have to hold for that version to be reasonable. Do the whole thing on one evening, before Sunday."
            }
          ]
        },
        "18": {
          "title": "A Sensitivity That Arrived Already Attuned, Even If Foggy",
          "fields": [
            {
              "label": "WHAT MOVES UNDERNEATH",
              "text": "You read what is moving under a conversation before anybody puts it into words, and the reading arrives whole rather than assembled. None of it registers as training; it lands more like a sense you came in already using, even when it comes through half-formed and hard to say aloud. Fog is not the same as error here, because the material is genuinely there and simply arrives ahead of any language that would let you check it. You pick up the undertow in a room and stay in it long enough to work out what it is made of."
            },
            {
              "label": "OLD FOG, NEW ROOM",
              "text": "Nothing gets sorted, so what you absorbed years ago and what you are picking up right now arrive inside the same unlabelled feeling. That runs two ways: you treat an old ache as live information, and you dismiss a current signal as more of the usual background. Feeling competent rests on the accuracy of the sense, which is the one instrument you trust yourself to hold, so questioning one piece of it feels like questioning all of it. The sorting therefore never happens, because sorting admits that some of what you sensed was noise. Under that runs the worry that separating old from current would leave far less current material than you thought. Meanwhile you act on unease that belongs somewhere else entirely, and the decisions come out crooked in ways you cannot trace back. The sensitivity is real, and the mixing of eras is what leaves it unreliable."
            },
            {
              "label": "SORT ONE UNEASE",
              "text": "Pick one unease you have been carrying this week and sit with it for twenty minutes with a pen, asking a single question of it: does this belong to what is actually here now. Write down when you first remember the feeling in this particular shape, and what was going on around you then rather than now. Where the two do not match, mark the feeling as older material and put a date beside it. Do the same exercise with a second unease before the week runs out, so the sorting becomes a practice rather than a one-off experiment. Keep both pages together, dated, and look at them again a month from now."
            }
          ]
        },
        "19": {
          "title": "A Warmth That Arrived Already Open",
          "fields": [
            {
              "label": "BRIGHT BEFORE YOU TRIED",
              "text": "Warmth came with you rather than being worked up, and it holds through conditions that would flatten most versions of it. Difficulty does not dim you, because your vitality is not rationed and never waited to be earned before switching on. There was no point at which you learned this; it runs the way breathing runs, which is why you rarely notice it operating at all. It also survives being spent, so a long stretch of giving out does not leave you empty the following morning. You stay warm through a bad month and mean every bit of it."
            },
            {
              "label": "SMOOTHED BEFORE IT LANDED",
              "text": "That brightness turns into a duty, switching on in moments that were asking for something harder and slower instead. It works both directions: a difficulty gets softened before it has been stated plainly, and your own bad days get covered over so fast you barely register them. Feeling like a decent person depends on the warmth holding steady, on having kept things bearable rather than having said the hard sentence. So you handle a hard thing by lightening it, which changes the temperature of the moment and leaves the thing itself exactly where it stood. Underneath sits a quieter worry: that the warmth is the whole of what you bring, and that if you went flat for one afternoon there would be nothing else there. The warmth is genuine, and spending it to skip past difficulty is what wears it thin."
            },
            {
              "label": "SAY THE HARD PART",
              "text": "Choose one difficulty you have been smoothing over and name it plainly to the person it concerns, in flat language, with no reassurance attached to the end. Say the whole of the difficulty first and let the sentence stand for a few seconds before you add anything warm on top of it. Do this once before the coming weekend, on something currently live rather than on a hard thing already resolved."
            }
          ]
        },
        "20": {
          "title": "A Readiness to Answer a Call That Was Already Familiar",
          "fields": [
            {
              "label": "TUNED TO THE CALL",
              "text": "Some larger claim on your life registers clearly, and it registered well before you could have explained what it wanted from you. Recognition is the mode you meet it in, not discovery, because the shape of it was familiar the first time it surfaced. You hold that sense of being summoned without needing it explained, which takes a specific kind of nerve. It also survives contact with ordinary weeks, so the sense does not evaporate the moment life gets small and administrative. What you keep is a working orientation toward something large, held alive with nothing available to verify it. You hold open a summons with no evidence behind it, year after ordinary year."
            },
            {
              "label": "PRIMED AND PARKED",
              "text": "Readiness becomes the destination, and the feeling of being about to answer sits in for the answer itself, sometimes for years at a stretch. It appears in two forms: you rehearse and prepare and stay poised, and you turn down smaller real things because they are not the thing you were called toward. Your sense of yourself as a serious person rests on the size of what called you, a measure that does not require you to have started. So the call stays pristine and unattempted, and the primed feeling gets renewed each time you think about it rather than spent on anything. Below that runs a specific dread: that you would answer, do the work, and find the result was ordinary. An unanswered summons cannot come out ordinary, which is exactly what makes leaving it unanswered so comfortable. The readiness is real, and parking inside it keeps the whole matter permanently theoretical."
            },
            {
              "label": "ONE STEP, BADLY DONE",
              "text": "Write down the call in one plain line, then underneath it write the smallest action that would count as having begun, and make it something finishable in an hour. Do that hour on a named day this week, and do it badly rather than well, since the standard here is completion and not quality. Keep the written line and the hour's output together in one place you pass through often. Repeat the hour next week on the next smallest action, before you allow yourself to plan anything larger."
            }
          ]
        },
        "21": {
          "title": "A Sense of the Whole That Arrived Already Integrated",
          "fields": [
            {
              "label": "THE PICTURE ASSEMBLES ITSELF",
              "text": "Pieces arrange themselves into a system while you are still looking at them, and the link between two distant things shows up without being hunted for. Nothing about it feels like analysis; the whole appears first and the parts get named afterwards, which is the reverse of how most reasoning runs. You hold a large number of moving elements at once and keep their relationships straight over long spans, without the picture degrading into a list. You see how a thing is put together and you say plainly what it is for."
            },
            {
              "label": "WAITING FOR THE WHOLE",
              "text": "Wholeness turns into a precondition, so nothing gets acted on until the entire structure of it is visible and settled. Two versions of that: you delay a decision you already have enough information for, and you keep gathering context past the point it stops changing the answer. Solidity comes from comprehension, from having understood a situation completely before touching it, which is the bar you set before allowing yourself to move. Deeper down is a discomfort with acting on a fragment, because being wrong from partial sight would read as carelessness rather than bad luck. Meanwhile things you were ready for months ago sit untouched while the picture finishes arriving, and some of them stop being available. The synthesis is real, and using it as a gate is what keeps the moves from happening."
            },
            {
              "label": "MOVE ON THE FRAGMENT",
              "text": "Name something you delayed purely because you could not yet see how it fits the rest, and start it tomorrow with the information you currently hold. Give it ninety minutes and stop there, whether or not the larger shape has clarified during the work. Leave the gathering of context alone until those ninety minutes have actually been spent."
            }
          ]
        },
        "22": {
          "title": "A Trust in the Leap That Was Already Practiced",
          "fields": [
            {
              "label": "AT HOME IN UNKNOWNS",
              "text": "Uncertainty does not stop you, and you move into situations whose outcome could not be stated in advance without needing a guarantee first. The willingness arrives intact rather than being talked into existence each time, which is why the decision to go usually takes minutes instead of months. You are steady in the part of a project where there is nothing solid to stand on yet and no way to tell whether it works. That steadiness is a genuine capability rather than bravado, because it holds while the unknown is still unknown instead of arriving after it resolves. Most of what you have built started from a position with no floor under it. You step into things before the shape of them exists and keep functioning there."
            },
            {
              "label": "OLD NERVE, NEW GROUND",
              "text": "The same willingness gets spent skipping preparation that a genuinely new situation would have rewarded, on the assumption that nerve substitutes for groundwork. The pattern doubles: you enter something without learning the specifics it actually turns on, and you read your own comfort with risk as evidence the risk has been assessed. Feeling capable comes from going in unprepared and being fine regardless, so preparation starts to feel like an admission that this one might be beyond you. The result is that you keep arriving somewhere new carrying only what worked somewhere else, and the gap surfaces mid-project instead of before it. What you flinch from is the slow, unglamorous version of this that reads the manual first, because doing it that way looks like having lost your nerve. Sitting under all of it is a quieter thought: that the courage was all you ever actually had. The trust in leaping is real, and spending it as a substitute for groundwork is what leaves the landings rough."
            },
            {
              "label": "ONE HOUR OF GROUNDWORK",
              "text": "Before the next leap, spend one hour finding out the three things about this particular situation that your previous ones never asked you to know. Write those three down and answer them one at a time, rather than deciding they will become obvious once you are inside it. Book the hour on one weekday and treat it as part of the leap instead of a delay to it. Go on the schedule you already had, with the answers in hand and the timing unchanged. Spend the same hour before the leap after that one, so groundwork becomes part of how you go rather than a single concession."
            }
          ]
        }
      },
      "personal": {
        "1": {
          "title": "You Present Yourself by Simply Starting",
          "fields": [
            {
              "label": "THE MOVE ARRIVES FIRST",
              "text": "Movement is the first thing about you that anybody registers, because you commit to an action long before you describe it. Your sense of who you are gets built out of what you start rather than out of what you weigh up beforehand, and that makes your identity legible fast. There is a working motive behind every one of those starts, fully formed and almost never spoken. You can put that motive into plain words on either side of the action, which takes almost nothing out of you. You establish who you are by beginning things, and the beginning does the introducing on its own."
            },
            {
              "label": "THE WHY GOES UNSAID",
              "text": "Everything anybody learns about you arrives through the doing, and the reasoning that produced it stays inside your head where nothing can be checked against it. That plays out twice over: the decision goes unexplained while it is being made, and then no account of it comes afterwards either, so your life reads as a list of actions with the thinking stripped out. Nothing about that is deliberate secrecy; the explanation has simply never seemed like part of the job. Your worth sits entirely in the fact that you move while others are still weighing, and a day of explaining without starting anything feels like a day wasted. Underneath it sits the worry that the reasoning would not survive being said out loud, that the motive is thinner than the action makes it look. So you keep handing over results and letting them stand in for a person. Your competence gets trusted and you stay a stranger inside it."
            },
            {
              "label": "SAY THE REASON ALOUD",
              "text": "Choose something specific you intend to do in the next few days and give the reason for it, out loud, to somebody before you begin. Say the actual motive rather than the plan or the expected result, in a full sentence instead of a shrug. Do the same with something you already finished this month, describing what you were after when you started it."
            }
          ]
        },
        "2": {
          "title": "You Present Yourself Carefully, Revealing Only What's Been Earned",
          "fields": [
            {
              "label": "ACCESS GRANTED ON PURPOSE",
              "text": "Disclosure is a decision you make rather than something that happens to you halfway through a conversation. You hold a real interior and you open it deliberately, which is why the sense others get that there is more to you is simply accurate. Trust is something you read reliably, you already know which of the people around you have earned more of you than they currently hold, and the depth stays intact regardless of whether it is showing. You choose the moment somebody is let further in, and that choice is a real act rather than an accident."
            },
            {
              "label": "THE GATE THAT NEVER OPENS",
              "text": "Selection hardens into refusal without anything announcing the change, so the filter that was protecting something valuable ends up sealing it away. Two things happen at once: the ones who proved themselves years ago still stand exactly where they stood, and the reveal you keep planning gets postponed until the occasion for it has gone. You place your value in having something held in reserve that has not been handed out cheaply, and an edition of you available to everybody would feel like something already spent. The fear running under that is simpler than it looks: the interior might turn out to be ordinary once somebody finally examined it properly. So the door stays at exactly the angle it has always been, and somebody trustworthy knows only your surface, for reasons that are yours rather than theirs."
            },
            {
              "label": "OPEN ONE LEVEL EARLY",
              "text": "Name somebody this week who already holds more standing with you than the access they are actually getting. Tell them one real thing at a level you would normally have kept back for another year, in person or in a message you genuinely send. Say the thing itself rather than a description of the thing. Do it before it feels earned, and add nothing about the promotion while you are making it."
            }
          ]
        },
        "3": {
          "title": "You Present Yourself Through What You Provide",
          "fields": [
            {
              "label": "KNOWN THROUGH WHAT YOU MAKE",
              "text": "Care is the language your identity comes out in, so what you cook, arrange, fix and notice does the work that others do with sentences about themselves. That is genuine expression rather than a substitute for it, and the warmth you generate in a room is a real fact anybody standing in it can feel. Your attention runs outward automatically and it is accurate about what somebody actually needs rather than what they claim to. You spot the small missing piece in an arrangement and have usually dealt with it before anybody names it. You also hold opinions and wants of your own, every bit as specific as the care is. You express yourself most completely through provision, and everything you make carries your fingerprints on it."
            },
            {
              "label": "THE GIVER GETS INTRODUCED",
              "text": "Provision is so reliable that it stands in for all of you, and the wants underneath it never get their turn to be spoken. The habit runs in two directions: an opinion of yours arrives wrapped inside an offer rather than stated on its own, and a need of yours gets converted into a job you do for somebody else before it can be named. Your worth is measured by whether the room around you is fed, held and running, so an hour in which you provided nothing feels like an hour you have to account for. The fear beneath the giving is that the wanting part of you is unwelcome, that provision is the reason anybody stays and the raw appetite is not. So usefulness keeps going out under the name of closeness, and you end up thoroughly appreciated and only partly known."
            },
            {
              "label": "STATE ONE WANT UNWRAPPED",
              "text": "State something you want this week without attaching a service to it, with no offer, no favour and nothing made useful to somebody first. Six or seven words is enough, and the exercise is refusing to soften the sentence once it has landed. Choose something small and real rather than the large want you have been saving for a better occasion. Pick a moment when nothing is being asked of you, so the want arrives on its own. Let whatever silence follows belong to the other person."
            }
          ]
        },
        "4": {
          "title": "You Present Yourself as Someone in Command",
          "fields": [
            {
              "label": "STRUCTURE ARRIVES WITH YOU",
              "text": "Authority is something a room hands you within minutes, and the read is correct rather than generous, since you genuinely hold things together when they would otherwise come apart. You see the shape a situation needs and you supply it without waiting to be asked or appointed. Direction comes out of you at a steady rate under conditions that scatter almost everybody else. Uncertainty sits in you at the ordinary human rate, quietly, underneath all of that competence. You take charge of whatever needs holding together, as a matter of course, and the structure holds because you built it."
            },
            {
              "label": "IN CHARGE, PERMANENTLY",
              "text": "Competence becomes the only register available to you, and every situation gets met in it whether or not the situation deserves it. Both halves are visible: you answer a question you do not have the answer to instead of saying so, and you carry a need of your own through an entire conversation without letting it surface once. The finished answer is what leaves you and never the working, so whatever you are unsure about has nowhere to go. Worth comes to you from being the steadiest thing in a room and from very little else, so an hour of visible wobbling feels to you like a demotion. The fear sitting under it is that the capability is the whole offer, and that without it there is nothing here worth anybody's time. So you produce composure on demand and pay for it later, privately. Respect arrives on schedule and nobody can get near you."
            },
            {
              "label": "SHOW ONE WOBBLE",
              "text": "Pick a conversation this week in which you do not know the answer and say exactly that, in four words, before you start solving anything. Let the not-knowing sit in the room for a beat instead of covering it over with a plan. Request one thing you need in that same week, put as a need instead of a logistics problem."
            }
          ]
        },
        "5": {
          "title": "You Present Yourself Through What You Believe",
          "fields": [
            {
              "label": "PRINCIPLES YOU CAN NAME",
              "text": "Conviction organises you, and what you believe is available in plain sentences rather than buried somewhere it has to be inferred from. Your framework holds up under pressure because it was built rather than borrowed, and it gives anybody dealing with you something solid to push against. You apply it consistently, so your position on a Tuesday matches your position six months later, and the unfinished parts of your thinking are as real as the settled ones and considerably more interesting. You stand on what you believe and act on it where it can be tested."
            },
            {
              "label": "ALWAYS HAVING AN ANSWER",
              "text": "Certainty becomes your default output, and questions you are genuinely still chewing on come out sounding decided anyway. It runs two ways: a position gets stated firmly before you have finished forming it, and a doubt you have carried for months goes unvoiced in every room you enter. Worth, for you, rests on having a clear line while everybody else is still circling, so a shrug feels like a failure of nerve rather than an honest report. The dread underneath is that the framework is the reason you are worth listening to, and that unsettling one piece of it would loosen everything attached. So the answer arrives on time, every time, whether or not you actually have one. You get trusted for your certainty and rarely met while you are still working something out."
            },
            {
              "label": "SAY ONE UNRESOLVED THING",
              "text": "Pull out one belief you have been presenting as settled and admit this week, out loud, that you have not worked it out yet. Use the word unsure, name the specific piece that is still open, and stop there instead of arguing yourself back into a position. Leave the sentence sitting where it fell for the rest of that conversation. Choose the thing that would be least comfortable to leave hanging."
            }
          ]
        },
        "6": {
          "title": "You Present Yourself Most Fully in Chosen Relationship",
          "fields": [
            {
              "label": "FULLEST AT CLOSE RANGE",
              "text": "Intimacy is where your whole range becomes available, and the version of you inside a chosen bond is markedly fuller than the one that circulates elsewhere. The general-purpose version is not a fake, only a genuine and smaller sample of the same material. Choosing somebody is a deliberate act for you, and it opens a door that ordinary proximity never touches. You go a long way in with a small number, and that depth is unusual by any measure. You give your fullest self to the connections you actually pick, and the picking is what makes the depth possible."
            },
            {
              "label": "THE INNER CIRCLE HOLDS EVERYTHING",
              "text": "Almost everybody gets the guarded edition, because the fuller one has been reserved so tightly that nothing escapes the circle by accident. Two versions of one habit: a warm acquaintance stays an acquaintance for six years without ever being promoted, and a room full of decent company gets a polite sample and nothing underneath it. Your worth is anchored in the few bonds that go deep, so a wide, shallow week leaves you feeling as though you barely existed in it. Beneath it runs the fear that spreading yourself further would thin what the close ones get, as though there were a fixed quantity of you. So the gate stays shut, the count stays small, and you are liked broadly while being actually known by about four people."
            },
            {
              "label": "LEAK PAST THE GATE",
              "text": "Choose one setting this week that is not intimate, at work or in a group or in a passing conversation, and say something in it you would normally save for somebody close. One real sentence about what you think or what you feel is the entire task. Say it once, put no framing around it, and move the conversation along."
            }
          ]
        },
        "7": {
          "title": "You Present Yourself Through Forward Momentum",
          "fields": [
            {
              "label": "ALWAYS POINTED SOMEWHERE",
              "text": "Drive is visible on you from across a room, because you are nearly always mid-pursuit of something and the pursuit shows in how you stand and speak. That momentum is not a mood you happen to be in; it regenerates itself, which is why you are moving again within days of finishing anything. Your identity is bound up with going somewhere, and the going is genuinely satisfying rather than something endured on the way to an arrival. You begin the next thing before the last one has finished cooling, which is appetite rather than restlessness. Stillness exists in you as well, in stretches nobody has been shown. You pursue things continuously and cover more ground in a year than most manage in five."
            },
            {
              "label": "NOTHING TO SHOW AT REST",
              "text": "Rest never gets witnessed, so the mover is the only version in circulation and the remainder of you has no social existence at all. Two places show it: a free evening acquires a project within twenty minutes, and the times you genuinely stop happen alone, behind a closed door, where they count as recovery rather than as you. Even the stopping that does happen gets justified as preparation for the next stretch of moving. Your worth is tied to forward distance covered, so a week with nothing advanced in it registers as a week where you were nobody in particular. The fear under the motion is that the person left over, with nothing being chased, would not be interesting enough to hold anyone's attention. So something is kept in progress at all times. You know your own drive intimately and your own stillness barely at all."
            },
            {
              "label": "BE SEEN DOING NOTHING",
              "text": "Spend an hour this week with one person, in the same room, with no task, no plan and nothing you are working towards. Say at the start that there is no point to it, and then let it stay pointless for the full hour. Put your phone in another room so the emptiness is real instead of decorative. Let the conversation go wherever it goes, or nowhere at all. Choose somebody whose only picture of you is a picture of you moving."
            }
          ]
        },
        "8": {
          "title": "You Present Yourself as Someone Who Deals Fairly",
          "fields": [
            {
              "label": "EVEN-HANDED BY INSTINCT",
              "text": "Fairness runs through your dealings automatically, and the honesty attributed to you describes what you actually do rather than a reputation you set out to build. You notice an imbalance in an arrangement quickly and correct it even when correcting costs you the better side. Your reasoning stays open to inspection at any point, which is why agreements you make hold up years later, and you also want things for no reason beyond wanting them. You deal straight with everybody and carry the cost of that without complaining about it."
            },
            {
              "label": "WANT DRESSED AS JUSTICE",
              "text": "Every want gets a case built around it before it is allowed out, so what leaves your mouth is an argument about fairness rather than a plain statement of appetite. Both forms are present: you argue for something on the grounds that it is only right when the truth is you simply want it, and you abandon a want entirely once no fair-sounding case can be constructed for it. Being defensible is what you take your standing from, never having taken more than your share, so a bare selfish want feels like a crack in the only ground you trust. Underneath sits a worry that plain wanting is greed, and that greed would be the least forgivable thing in you. So the appetite gets translated before it is spoken, every single time. You have argued for something as just when you could have said you wanted it."
            },
            {
              "label": "DROP THE CASE",
              "text": "Ask this week for something using the words I want, and stop the sentence there without the reasoning that normally follows behind it. Choose something you could not justify on fairness grounds if somebody pushed you on it. Keep the request short enough that adding the argument would be obvious to both of you. Notice the pull to explain, and let the short version stand."
            }
          ]
        },
        "9": {
          "title": "You Present Yourself Sparingly, in Person and in Groups",
          "fields": [
            {
              "label": "SOLITUDE IS THE DEFAULT",
              "text": "Withdrawal is your resting state rather than a reaction, and what you bring when you do engage carries weight precisely because it was not spent in the meantime. Your thinking gets done alone, so whatever arrives in a room has already been through something first. You are legitimately known by a small amount of high-quality contact instead of by constant availability. Your energy is finite in a way you have measured accurately, and protecting it is a genuine requirement rather than an excuse. You choose your own company by default and get real work out of it."
            },
            {
              "label": "TOO LITTLE EXPOSURE",
              "text": "Absence compounds until there is simply not enough of you in circulation for anybody to form an accurate picture. It works two ways: the gathering you skip is reliably the one you would have been glad you went to, and the contact you do make stays short enough that the same surface impression gets refreshed instead of deepened. Self-sufficiency is what you price yourself by, needing nothing from anyone, so wanting to be known feels like a leak in the one arrangement that has always held. The fear is that turning up more would use you up and leave you nothing to withdraw into. So the protection keeps running long past the day it began costing more than it saves, and you remain unknown to several people you would genuinely like to be known by."
            },
            {
              "label": "TURN UP ONE MORE TIME",
              "text": "Say yes this week to something you would normally decline, in a setting where at least one person there matters to you. Stay a full hour rather than twenty minutes, and leave when the hour is up rather than at the first pull towards the door. Keep the rest of the week empty so the solitude stays intact around it."
            }
          ]
        },
        "10": {
          "title": "You Present Yourself Differently Depending on the Season",
          "fields": [
            {
              "label": "PRESENTATION MOVES WITH THE CYCLE",
              "text": "Variation is built into how you show up, and the difference between your loud months and your quiet ones reflects a genuine rhythm instead of a fault. You track your own cycle accurately and can usually say which part of it you are in without thinking hard about it. That flexibility lets you meet a season at the size it actually is instead of forcing a constant output that would eventually break you. Each version is genuine, the withdrawn one included, and none of them is the counterfeit. You live in cycles and get more out of a year by working with them than against them."
            },
            {
              "label": "JUDGED ON ONE SAMPLE",
              "text": "Anyone meeting you inside a single season takes that season for the whole of you, and nothing in how you present corrects the impression. The pattern doubles: you let a quiet stretch be read as your temperament without saying otherwise, and you avoid explaining the cycle because explaining sounds like an excuse prepared in advance. Accurate reading is where your self-regard stands, so an old and narrow verdict sitting uncorrected in somebody's head is genuinely painful to think about. Under that lies the suspicion that variation means instability rather than rhythm, and that naming it aloud would confirm something unreliable in you. The correction would take one sentence and you have never spent it. So the sample stands and you resent it privately. Somebody carries a small, wrong version of you for years over an accident of timing."
            },
            {
              "label": "NAME THE RHYTHM OUT LOUD",
              "text": "Tell somebody this week, in two sentences, that you run in cycles and which part of the cycle you are in right now. Put it as a plain fact about how you work instead of an apology or a warning. Choose a person whose entire impression of you came out of one register."
            }
          ]
        },
        "11": {
          "title": "You Present Yourself as Gentle, Which Can Be Mistaken for Simple",
          "fields": [
            {
              "label": "CALM WITH WEIGHT BEHIND IT",
              "text": "Softness is your natural register and it is not a strategy, since the steadiness others meet in you is the actual temperature you run at. That calm holds under conditions that make almost everybody sharp, which keeps you usable in exactly the moments when usefulness is scarce. There is considerable capability behind the gentleness, finished rather than waiting to be developed, and you simply do not announce it, because announcing has never been how you operate. You do difficult things quietly and finish them while the room is still debating whether they are possible."
            },
            {
              "label": "MISTAKEN FOR HARMLESS",
              "text": "Gentleness gets filed as an absence of force, and once that filing has happened your actual strength has no way to correct the record. It shows twice over: you get handed the easy version of a job because nobody guessed you could take the hard one, and you let an underestimation stand rather than doing the small ugly thing that would end it. You judge your own value by never having had to push anybody to get anywhere, so asserting yourself would spoil the one quality about which you are certain. Behind it lies a suspicion that force is in you somewhere, and that using any of it would cost you the softness permanently. So the capability stays unstated and the underestimation stays cheap to maintain. What you can actually do keeps arriving as a surprise, long after it should have been obvious."
            },
            {
              "label": "LET THE CAPABILITY SHOW",
              "text": "State something you are good at this week, flatly, in the room where it is relevant, without softening it into a maybe. Give a specific example instead of a general claim, and use the same quiet voice you always use. Pick the setting where it counts rather than the safest one within reach. Say it once and let the sentence be as large as it actually is."
            }
          ]
        },
        "12": {
          "title": "You Present Yourself Most Clearly After You've Had Time to Reflect",
          "fields": [
            {
              "label": "THE CONSIDERED VERSION",
              "text": "Reflection is where your thinking finishes, so the account you give a day later is sharper and truer than anything available in the first ten minutes. You are genuinely at your best with a gap in the middle, and the gap does real work rather than being a delay you are indulging in. What comes back after it is unusually well-built: the reasoning is complete, the qualifications sit in the right places, and the whole thing holds. You hold a question overnight without losing it, which is why the answer turns up assembled instead of in pieces. Your first reaction is not wrong either, only rougher and less arranged than what follows it. You reach accurate positions on hard things by giving them time, and the time is what makes them accurate."
            },
            {
              "label": "LIVE, YOU UNDERPERFORM",
              "text": "Real-time conversation catches you before the useful part of you has assembled, and the version that turns up in it is thinner than what you are capable of. Both sides are visible: you go quiet in the moment and lose the chance entirely, and you send the good version afterwards, where it lands as an afterthought rather than a contribution. Your worth is staked on being right rather than quick, so a half-formed sentence leaving your mouth feels like damage you will have to repair later. What sits under it is the thought that the unpolished version is the true one and the considered version a construction, that speed exposes you rather than distorting you. So you keep buying time you do not always get. The live room hears your worst material and the good material shows up once the room has gone."
            },
            {
              "label": "OFFER IT ROUGH",
              "text": "Put one unfinished thought into a live conversation this week, at the moment it turns up, with the qualifications missing. Flag it as a first pass in three words and then say it anyway rather than holding it until tonight. Keep the thought short so there is less of it to defend. Let the rough version be the only one you offer that day. Choose a low-stakes room and do it within the next three days."
            }
          ]
        },
        "13": {
          "title": "You Present Yourself as Someone Who's Been Remade",
          "fields": [
            {
              "label": "BUILT AFTER AN ENDING",
              "text": "Endings are something you have completed rather than merely survived, and the versions of you that finished made room for the ones that followed. That history is legible in how you carry yourself, which is why change does not read as a threat to you the way it does elsewhere. You can dismantle something you built and start again without the collapse that costs most people years of their lives. Each rebuild kept whatever was worth keeping, so nothing about you is starting from zero. You end what is finished and construct the next version deliberately, on a schedule you set."
            },
            {
              "label": "STABILITY FEELS UNFINISHED",
              "text": "A settled stretch cannot be taken as settled, because your whole reading of yourself runs through change and a period without any looks like a period where nothing happened. It comes out twice: you go hunting for the next thing to end while the current arrangement is working perfectly well, and you narrate a stable year to yourself as a pause between real chapters. Movement between versions is what your self-regard runs on, so ordinary continuity feels like a stall you will eventually be held to account for. Underneath lies the dread that a self which stops changing is a self that has run out, and that stability is where being interesting quietly ends. So a good arrangement gets tested for cracks it does not have, and you finish things that were not over, because finishing is the move you are most practised at."
            },
            {
              "label": "LET A GOOD YEAR STAND",
              "text": "Write down one part of your life that has been steady for over a year, and commit this week to keeping it unchanged for the next six months. Put a date on that decision and treat it as a commitment rather than a review. Change nothing about it in the meantime, improvements included."
            }
          ]
        },
        "14": {
          "title": "You Present Yourself as Balanced, Consistently",
          "fields": [
            {
              "label": "MEASURED ON PURPOSE",
              "text": "Calibration is genuine in you, since the level tone is where you actually live and not a lid held down over something louder trying to get out. You take in a situation and respond in proportion to it, which means your reactions can be trusted as information about the situation rather than about your mood. Extremes are within your reach and you decline them for good reasons, which makes you the one thing in a volatile week that needs no managing. You hold a level line through conditions that swing everybody else around, and you do it without gritting your teeth."
            },
            {
              "label": "THE FILTER RUNS ALWAYS",
              "text": "Proportion is applied to everything, including the handful of things each year that warranted a far bigger response than they got. Two forms of it: something important gets delivered in the same even tone as a schedule update, and a moment of real intensity gets moderated on its way out until it reads as mild interest. Your worth is built on being the reliable temperature wherever you are, so raising your voice even once feels like giving up the steadiness you organise everything else around. The fear beneath it is that unmoderated feeling would not stay proportionate in you, that once the level slips there is no obvious place for it to stop. So the dial stays where it is and the rare occasion pays for it. Something that mattered got announced in your ordinary voice and passed by without registering."
            },
            {
              "label": "ONE THING AT FULL VOLUME",
              "text": "Pick something you actually feel strongly about this week and say it at the size you feel it, not a notch below. Use a stronger word than you would normally choose, and leave it uncorrected in the sentence that follows. Let the volume stand for the remainder of that conversation. Pick a moment where the stakes are real instead of rehearsing it somewhere safe."
            }
          ]
        },
        "15": {
          "title": "You Present a Version of Yourself That Isn't the Whole Story",
          "fields": [
            {
              "label": "MORE APPETITE THAN SHOWN",
              "text": "Intensity runs at a level in you that the calibrated version never lets on, and the appetite underneath it is strong, specific and entirely real. What gets met is accurate as far as it goes, which is why nothing about your presentation feels false to anybody. You know exactly what you want and how much of it, with none of the vagueness that usually surrounds wanting. Managing that intensity is skilled work, and you have been doing it so long that it now happens without decisions. You carry a considerable appetite and you steer it, which is rarer than either having it or lacking it."
            },
            {
              "label": "THE COST OF THE GAP",
              "text": "Concealment rather than intensity is what actually costs you, because holding a distance between the presented version and the real one takes continuous low-level effort. There are two moves in it: you edit a reaction down in the half-second before it leaves you, and you avoid situations where the stronger version might surface without your permission. Nobody has asked you for this and the instruction is entirely your own. Self-command is where your worth actually sits, so a moment when the appetite showed through would feel like evidence against the whole arrangement. Under it lies a certainty that the intensity is too much, that seen at full size it would be received as a problem instead of as a person. So the distance gets maintained daily and the maintenance never gets counted as work. The effort of hiding is more tiring than the intensity itself ever was."
            },
            {
              "label": "THE REAL SIZE, ONCE",
              "text": "Give one person the actual scale of an appetite of yours over the next four days, without shrinking the description as you say it. Choose somebody close enough that the stakes are survivable, and hand over the unedited version rather than the summary. Say it in one go without stopping partway to check their face."
            }
          ]
        },
        "16": {
          "title": "You Present Yourself as Someone Who Survived Something",
          "fields": [
            {
              "label": "WHAT CAME AFTER THE RUPTURE",
              "text": "Disruption is part of your material now, and what got built on the far side of it is genuinely yours rather than a repair job on the old version. That history gets sensed before it is ever told, which is why you are trusted quickly by anybody who has been through something themselves. You know from the inside what holds and what does not when a life comes apart suddenly. Very little about upheaval frightens you now, since you have already lived through the worst version of it. The self that exists today is complete, not a provisional arrangement pending a return to how things were. You rebuilt yourself after something broke and you are living inside the result."
            },
            {
              "label": "THE HEDGE STAYS IN",
              "text": "A margin of yourself is held back at all times, as insurance against a rupture that is nowhere currently in view. Both expressions are running: you present a slightly reduced version even in conditions that are entirely safe, and you keep an exit half-built into situations you have no intention of leaving. Your worth rests on never being caught out again, on having seen it coming this time, so full presence feels like dropping the only guard that has ever worked. Underneath is the fear that being fully known is what invited the break, that visibility and rupture are connected and the connection would hold a second time. So the reserve stays in place and costs you the years it was built to protect. You hold back the whole of yourself against something that has already happened."
            },
            {
              "label": "DROP THE MARGIN ONCE",
              "text": "Walk into one conversation this week holding nothing in reserve, saying the whole of what you think instead of the safe ninety percent. Decide beforehand which part you normally keep back, so the thing being dropped is clear to you. Choose a real conversation with actual stakes rather than a practice run with somebody safe. Let the ten minutes afterwards be quiet if they turn out quiet. Stay put for those ten minutes without changing the subject."
            }
          ]
        },
        "17": {
          "title": "You Present Yourself With Quiet, Guarded Hope",
          "fields": [
            {
              "label": "THE TRIMMED HOPE",
              "text": "You believe things can come out well, and that belief holds through stretches where nothing on the outside supports it. It is not talk you have to work yourself up into; it sits under your ordinary judgement and stays there when the judgement turns dark. You speak it in a low register, so what reaches the air sounds like mild agreement rather than the conviction it actually is. The size you say it at is a habit of delivery, and it has never been the size of the thing itself. You carry a working trust in good outcomes through conditions that flatten it in most people."
            },
            {
              "label": "SHRUNK BEFORE SAYING",
              "text": "The trimming happens before the sentence leaves you, so any statement about what you hope for arrives one size down from what you hold. It costs twice over: the moment that wanted your real optimism gets a polite version of it, and the ordinary days leave you sounding more guarded than anything you feel. You grade yourself on never having overclaimed, on a clean record of never having said a big thing was coming and then stood there when it did not. Being unembarrassable is the standard, and a small hope is the cheapest way to meet it every time. Underneath, you dread the specific hour after a large hope of yours collapses, with your own words still hanging in the room where you said them. So the claim stays small enough that the drop could never be far."
            },
            {
              "label": "THE UNTRIMMED SENTENCE",
              "text": "Pick the thing you most want to come good this year and write one sentence saying how well you actually think it can go, with no hedge at either end. Speak that sentence to somebody before the weekend, at exactly the size you wrote it, and do not add the softener on the way past. If the softener comes out anyway, finish what you were saying and then repeat the unsoftened half once before you change the subject."
            }
          ]
        },
        "18": {
          "title": "You Present Yourself in a Way That's Hard to Fully Pin Down",
          "fields": [
            {
              "label": "DEPTH WITHOUT EDGES",
              "text": "What you show of yourself has real weight in it and soft edges around it, so it registers as atmosphere well before it registers as fact. The depth is genuine and so is the vagueness, and neither one is a screen for the other. You work in impressions rather than statements, which is why an early read of you comes out incomplete rather than wrong. The accurate version is reachable, only slowly, and it does not thin out the closer anybody gets to it. You hold more inside you than any short account of you manages to carry."
            },
            {
              "label": "THE PLAIN VERSION WITHHELD",
              "text": "The account of you that gets out is partial, and you register that partiality while it is happening. Two things keep it that way: the flat sentence about yourself never gets said, and on the rare run-up to saying it you hear how much drops away and swallow it. So the picture carried around of you sits a little to the side of the real one, and the correction stays permanently available and permanently unused. Your sense of your own worth depends on being larger than any brief description could hold, which makes plain speech feel like a demotion you volunteered for. You count lost nuance as lost substance, so being clear and being accurate have become opposites in your head. The thing you cannot stand the thought of is the flat version turning out to be the true one, with the depth you feel amounting to nothing more than the difficulty of pinning it down. Leaving the account unfinished is what keeps that question from ever getting settled."
            },
            {
              "label": "ONE FLAT SENTENCE",
              "text": "Take the one thing about yourself you have never put into a short sentence, and write it this week in under twelve words, cutting every clause that qualifies it. Read it back and let it be inadequate, because a sentence that loses some of the truth still moves more of it than silence does. Use it the next time you are asked what you do or what you are after, exactly as written. Say nothing else for a beat afterwards, even when the fuller version is right there."
            }
          ]
        },
        "19": {
          "title": "You Present Yourself as Warm and Easy to Be Around",
          "fields": [
            {
              "label": "NOT A TECHNIQUE",
              "text": "Warmth reaches other people from you before thought even gets involved, which is why your presence lands as easy and why the ease costs nothing to produce. You did not assemble this out of manners or practice, and it was running long before you had any use for it. It holds in conditions that make other people brittle, so a bad week does not switch it off, it only turns it down. Even the tired version of you is recognisably kind, and that is a real capacity rather than a social trick. Treating it as a trick undersells what it takes to run something every day without a break. You meet difficulty and hold the warmth through it, without ever choosing to."
            },
            {
              "label": "THE AUTOMATIC SOFTENING",
              "text": "The softening arrives before the words do, so a hard fact about your week leaves you already rounded down into something easy to hear. It shows twice: in the moment that genuinely wanted seriousness from you and got brightness instead, and in the ordinary hours when you said you were fine and were not. You hold your own conduct to being easy company, and a day when you were heavy going reads back later as a day you handled wrong. Costing nobody anything is the measure you apply, and what you flinch from is the picture of yourself as the difficulty in somebody's afternoon, taking up room and handing nothing back. So the light answer gets out first and the true one arrives late, or stays in."
            },
            {
              "label": "TELL IT UNSWEETENED",
              "text": "Choose one thing that is going genuinely badly for you now, and within four days put it into flat words to one person, with no joke on the end. Leave their face alone while it is landing, and leave the gap that follows exactly where it falls. Then sit with how exposed it feels for ten minutes, without doing a single thing to make the feeling smaller."
            }
          ]
        },
        "20": {
          "title": "You Present Yourself as Someone Waiting to Answer Something",
          "fields": [
            {
              "label": "POINTED AT SOMETHING",
              "text": "Something unfinished sits at the front of you, and it shapes how you come across long before you could put a name to it. You are aimed at a piece of work or a change you have not made yet, and the aim is steady rather than restless. This is not vague wanting; there is a specific direction in it, and you can feel when a day has moved along that direction or away from it. You measure your days against it privately, without ever announcing what the measure is. The pull has survived every distraction put in its path, which says more about its weight than any argument for it could. You have kept a large unstarted thing alive inside you for years without once letting go of it."
            },
            {
              "label": "STILL NOT ANSWERED",
              "text": "The waiting has stopped being a phase and turned into the way you are permanently set up, rather than how things stand for now. It runs in two directions: the answer stays permanently ahead as something you will get to, and the not-getting-to-it has become familiar enough now to be comfortable. You privately rank yourself by that unstarted thing, because nothing unbegun has yet been cut down to its actual size. Answering it would fix the size for good, and you dread finding out that the size is ordinary. Then you would be somebody with a small finished thing behind them and nothing large ahead, which is the position you are actually avoiding. So the sensing continues, year on year, and the sensing is easier to live in than the doing."
            },
            {
              "label": "ANSWER IT SMALL",
              "text": "Name a day inside the next fortnight and put two hours on it for the smallest real piece of what you keep sensing you are meant to do. Make it a piece of the work itself, not a plan for the work and not more reading around it. Whatever comes out of those two hours, keep it and date it, and do not weigh it against the version in your head. Book the following two hours before you get up from the desk."
            }
          ]
        },
        "21": {
          "title": "You Present Yourself Most Fully Once Everything Connects",
          "fields": [
            {
              "label": "COHERENCE IS THE SKILL",
              "text": "You see how the parts of your life bear on each other, and that seeing is what brings the fullest version of you out. A fact on its own gives you little, while the same fact laid beside three others opens up, and you are the one who lays it there. You work at that pace deliberately, holding pieces open until the pattern between them shows itself, and the pattern usually does show. You build a whole account of yourself out of parts that arrived years apart."
            },
            {
              "label": "NOTHING GOES OUT PARTIAL",
              "text": "Nothing leaves you until it has connected to everything around it, which means finished pieces sit inside you waiting on a context that was never required. The delay works on two levels: something plainly ready gets held back for the join, and simple things you could say today get postponed because the larger frame is still forming. You privately treat a partial offering as a poor one, so the readiness of any piece counts for less with you than the completeness of the picture. Being coherent all the way down is what you check yourself against, and an unconnected piece feels like evidence you have not thought hard enough. The worry sitting under it is that a fragment shown alone is what your thinking would then be taken for, and that the fragment is thin. Holding the piece back keeps that from ever getting tested. Meanwhile the piece stays exactly as ready as it was the day you decided to wait."
            },
            {
              "label": "SHOW THE LOOSE PIECE",
              "text": "Pull out something kept back because it has not linked up to anything yet, and give it to one person this month with none of the frame around it. Say the piece and stop, leaving off the paragraph that explains where it belongs in everything else. Do it while it still feels premature, because premature is the exact state you are trying to act inside. Write down the date you did it and what you left out."
            }
          ]
        },
        "22": {
          "title": "You Present Yourself Openly, Trusting the Reception as You Go",
          "fields": [
            {
              "label": "WHAT ARRIVES IS YOU",
              "text": "You show up as you actually are that day, with no version of yourself worked out in advance. There is no gap between what you feel and what comes out, so what lands is the real thing and not a draft of it. You trust the moment to hold you, and that trust is not naive, it is built on years of the moment doing it. You walk into a room unmanaged and let the situation take you exactly as you arrive."
            },
            {
              "label": "THE SAME OPENNESS EVERYWHERE",
              "text": "The same unguarded approach goes into every situation, including the few that would have paid for an hour of thought beforehand. You have watched one of those go wide, where a considered version would have carried and the spontaneous one did not, and the difference was visible as it happened. Preparation feels like insincerity to you, so you skip it on principle and then call the skipping honesty. You judge yourself on whether the thing that came out was true in the second it came out, which is a real standard and a narrow one, and what you will not risk is turning into somebody assembled in advance, running a worked-out edition of themselves. So every entrance stays improvised, and situations that needed more get precisely what the easy ones got."
            },
            {
              "label": "WRITE IT BEFOREHAND",
              "text": "Write out, ahead of the next thing that matters, what you are actually after in it and the two sentences you would regret not saying. Take twenty minutes for that the evening before, rather than on the walk in. Go in with the paper read once and then put away, and let everything after that happen the way it always does. Note afterwards which of those lines you used and which one you dropped. Keep that note where you can find it before the next occasion arrives."
            }
          ]
        }
      }
    }
  };
  window.DTalentContent = {
    get: function (iconType) { return T.archetypes[iconType] || (prev && prev.get(iconType)) || null; },
    getForPosition: function (key, arcanaNum) {
      const grp = T.positions[key];
      return (grp && grp[Number(arcanaNum)])
          || (prev && prev.getForPosition(key, arcanaNum)) || null;
    },
  };
})();
