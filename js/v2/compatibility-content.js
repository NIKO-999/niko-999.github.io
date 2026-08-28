'use strict';
/*
 * compatibility-content.js — second-generation overlay.
 *
 * Layered on top of js/compatibility-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DRelationshipContent — 12 records
(function () {
  const prev = window.DRelationshipContent;
  const T = {
    "data": {
      "1": {
        "title": "Relationship 1 — Built to Begin Things",
        "fields": [
          {
            "label": "FIRST MOVE BY DEFAULT",
            "text": "Between you there is a forward pull that neither of you generates alone, and it shows up as new projects, new directions, a life that keeps moving somewhere. You go first rather than waiting to see how a thing settles, and that combined push carries plans a single person, or a more careful pair, would leave sitting. Starting feels ordinary here instead of risky, which is why so much of what gets discussed actually gets underway. The longer this runs the more it compounds, until beginning things is simply how you operate. You turn an idea into a live commitment within days of first saying it aloud."
          },
          {
            "label": "WHO GOES FIRST",
            "text": "The push that moves things also sets you against each other over who is actually leading, quietly and without either of you naming it. Taking turns is nobody's instinct here, so an ordinary decision becomes a contest settled by whoever pushes hardest that day. The second version is a run of openings with nothing finished, one start abandoned the moment the next looks brighter. Each of you counts yourself as the driver of this relationship, and initiating is what makes belonging in it feel secure. Beneath that sits a dread of what following would prove: that you could be the passenger, and that something essential about your place here would be gone. So you both keep moving first, and the finishing waits for somebody who is never going to volunteer."
          },
          {
            "label": "ONE LEAD, ONE FINISH",
            "text": "Pick a project already underway and agree, in plain words, that a named one of you leads it to the end this month. The other follows completely, including through the parts they would have done differently, and stops steering from the side. Finish that project before either of you opens anything new, and mark the day it was done. Watch what following costs while you are inside it."
          }
        ]
      },
      "2": {
        "title": "Relationship 2 — Built for Partnership",
        "fields": [
          {
            "label": "MATCHED WITHOUT NEGOTIATION",
            "text": "Neither of you spends energy fighting for the lead, which makes this pairing genuinely restful rather than merely peaceful. You read each other's mood early and adjust to it unprompted, often without mentioning that you adjusted at all. Getting along matters more here than being individually correct, which sounds like a small preference until you notice how few pairs manage it. You make decisions as a single motion, so nobody has to lose for the other one to get their way."
          },
          {
            "label": "SMOOTHED UNTIL BLANK",
            "text": "The accommodation that makes you easy together also sands both of you down until very little is left to accommodate. Each of you adjusts so automatically that a preference disappears before it has been spoken, and neither can say when that began. The other half is stranger: you match so closely that neither is sure any more which pace was originally their own. Calm is the thing you each rate this relationship by, so a quiet evening reads as proof of doing it well. What gets avoided is the possibility that disagreement is not survivable here, that one honest objection would crack the harmony you both lean on. So the objection stays unsaid and gets renamed kindness. Every year of that costs one more piece of what either of you actually wanted."
          },
          {
            "label": "SAID BEFORE CHECKING",
            "text": "State a single want for this month before checking it against what the other person would prefer. Deliver it as a flat statement rather than a suggestion with an exit built into it, and do not soften it afterwards. Stay in the room for the ten minutes that follow."
          }
        ]
      },
      "3": {
        "title": "Relationship 3 — Built for Joy and Expression",
        "fields": [
          {
            "label": "EASE AS INTIMACY",
            "text": "Conversation moves here without anybody working at it, and the room you are in together is better than the rooms either of you walked out of. Jokes land between you the way they do not land elsewhere, which is a matter of fit rather than a talent for comedy. The lightness other pairs manufacture with effort is simply the temperature you start at. That ease is not a surface thing, and ordinary time together is worth having on its own rather than something to get through on the way to the good part. You make an unremarkable Tuesday evening into something neither of you would trade."
          },
          {
            "label": "THE JOKE AS EXIT",
            "text": "Laughter is also the door you leave through whenever a conversation starts to get expensive. A hard thing gets met with charm, the timing is good, everyone relaxes, and the hard thing sits exactly where it was. The other expression is slower: nothing is refused outright, it is only made funny, so a year of real complaints goes into storage as material. Being easy company is what each of you counts as evidence that this is healthy. Under that runs a fear that seriousness, once allowed in, will not get up and leave again, and that lightness is the only thing holding any of this together. What builds up is everything never said, and it does not evaporate because you are both good at changing the subject."
          },
          {
            "label": "ONE UNFUNNY HOUR",
            "text": "Choose a subject that has been sitting under the jokes and raise it this month with deflection ruled out in advance. Say all of it, and when the urge to lighten arrives about forty seconds in, let the silence run instead. Stay there until you have both said what you came to say, however uncomfortable the middle gets. Note down afterwards what you were most afraid of hearing."
          }
        ]
      },
      "4": {
        "title": "Relationship 4 — Built to Last",
        "fields": [
          {
            "label": "WHAT ACTUALLY GOT DONE",
            "text": "Plans made between you get carried out, which separates this pairing from most of the ones that talk well. Responsibility lands on both sides rather than settling quietly on whichever person minds the mess more. There is a practical solidity here that shows up in objects and arrangements, not only in how the relationship gets described. You keep your commitments to each other even through the weeks when keeping them is unrewarding and dull. The durability is not a hope about the future but a record of what has already been put in place. You build things that are still standing years after the enthusiasm that started them has gone."
          },
          {
            "label": "THE GROOVE NOBODY CHOSE",
            "text": "Solidity hardens into routine, and the routine keeps running long past the point where either of you would deliberately choose it. Structure that once felt like safety becomes a week nobody designed, repeated because rearranging it is more effort than living inside it. The second face is a slow refusal: anything unplanned gets declined on practical grounds that are really discomfort wearing a reason. Steadiness is what each of you takes as proof that this relationship is serious, so deviating feels like an admission that it is not. Under it runs a fear that one unplanned thing would loosen the whole structure you have spent years bolting down, and so the foundation stays while everything that might have gone on top of it does not."
          },
          {
            "label": "NO REASON REQUIRED",
            "text": "Do one thing together this month with no practical justification behind it and no place in the plan. Decide it the same week it happens, rather than scheduling it six weeks out where it becomes another commitment. Spend money or a Saturday on it without first working out whether the money or the Saturday was warranted. If one of you starts converting it into a project, say so at the time and let the thing stay pointless. Pay attention to what gets talked about on the way home."
          }
        ]
      },
      "5": {
        "title": "Relationship 5 — Built for Change",
        "fields": [
          {
            "label": "ALIVE ON SHORT NOTICE",
            "text": "Unplanned change lands between you as an opening rather than a threat, which is far rarer than it sounds. New places, new work, a plan that collapses on a Thursday: none of it shakes what you have, and it keeps this relationship awake instead of merely comfortable. Neither of you demands that the other stay predictable, so you are not holding anybody to a version that went out of date years ago. You keep meeting each other as somebody new, long after most pairs have finished deciding who the other person is."
          },
          {
            "label": "MOTION INSTEAD OF ROOTS",
            "text": "Restlessness keeps this alive and also keeps it shallow, because nothing stays put here long enough to get tested. Momentum stands in for depth, and the volume of shared experience gets mistaken for the weight of it. It shows up a second way as well: the moment a stretch of ordinary life arrives, one of you produces a reason to be somewhere else. How interesting the relationship currently is decides how each of you rates it, so a quiet month reads as a warning rather than as rest. What gets outrun is the question of what sitting still would show, that you might have less in common once there is nothing new to react to. So the plans keep changing and the record of what this has actually withstood stays thin. When strain does arrive, you find a great deal of movement and very little that holds weight."
          },
          {
            "label": "ONE PLAN, UNCHANGED",
            "text": "Keep a single plan this month exactly as first made, including the date, the place and the people. When a better option turns up halfway through, name it between you and keep the original anyway. Write down afterwards what the two of you did with the boredom."
          }
        ]
      },
      "6": {
        "title": "Relationship 6 — Built Around Care",
        "fields": [
          {
            "label": "LOOKED AFTER BY DEFAULT",
            "text": "Care arrives here before anybody has asked for it, and it comes out of instinct rather than duty. Home matters more in this pairing than in most, whatever shape home currently takes for the two of you. The relationship organises itself around a place where both people are actually looked after, down to the small practical things that usually go unnoticed. Neither of you keeps a tally of who did more, because the tally was never the point. You register what the other person needs about a day before they do, and you have usually dealt with it by then."
          },
          {
            "label": "CARE THAT SUPERVISES",
            "text": "Looking after each other slides into managing each other, and the slide is slow enough that nobody catches the day it happened. Corrections, arrangements, decisions taken on the other person's behalf: all of it done out of love, all of it starting to feel like supervision. The quieter version runs the other way, where one of you handles something so reliably that the other loses the ability to do it at all. Being needed is what each of you treats as the sign that this bond is solid, so stepping back feels like demotion rather than trust. Underneath the managing sits a worry: let go, and the other person is exposed, and anything that goes wrong afterward lands on you. Affection becomes a steady reduction of somebody's freedom, offered warmly and almost impossible to argue with."
          },
          {
            "label": "LEAVE IT TO THEM",
            "text": "Hand back one thing you have been handling that the other person has said they would rather do alone. State clearly that it is theirs now, then leave it untouched for the rest of the month, including the week it is obviously being done differently. Do not check on it, tidy its edges, or ask how it is going in a tone that means the same thing. Notice what you do with the hour it used to take."
          }
        ]
      },
      "7": {
        "title": "Relationship 7 — Built for Depth",
        "fields": [
          {
            "label": "PAST SMALL TALK FAST",
            "text": "Small talk between you runs out in the first few minutes and something real starts, which is how this has always worked. Understanding does the job that constant activity does elsewhere, so you can sit in a room doing nothing and be as close as in the middle of a good week. Quiet is not a gap that either of you feels obliged to fill with plans or conversation. You reach a depth in an ordinary evening that busier pairings spend years approaching and rarely arrive at."
          },
          {
            "label": "SEALED IN TOGETHER",
            "text": "Closeness turned inward far enough becomes a sealed room, and you stopped opening the door somewhere along the way. Retreat into each other is the pattern's first face; the second is that outside company reads as an interruption, so invitations get declined for reasons that sound sensible every single time. This understanding gets treated as the only reliable thing either of you has, which makes anything that dilutes it feel like a threat to your footing. Underneath the withdrawal runs a worry that a third person in the room would show this to be ordinary. Isolation dressed as intimacy is still isolation, and from inside it is indistinguishable from being close."
          },
          {
            "label": "MAKE ROOM FOR ONE",
            "text": "Invite somebody into an occasion you would normally keep between yourselves, this month, and make it real rather than token. Choose a person you have been quietly declining for a while and give them an actual date instead of a vague promise to sort something out. When the pull to protect the sealed room arrives on the day, go ahead and stay in the conversation anyway. Watch how you speak to each other with a third person present."
          }
        ]
      },
      "8": {
        "title": "Relationship 8 — Built to Achieve",
        "fields": [
          {
            "label": "BUILT, NOT DISCUSSED",
            "text": "Shared goals here get finished rather than discussed at length and quietly dropped. You work as an actual team, with a division of labour neither of you had to negotiate into existence. There is something concrete to point at from every year spent together, which gives this relationship a weight that talk alone never supplies. Difficulty arrives and you get organised instead of getting stuck. Competence at this level is uncommon between two people, and it holds through the months when neither of you feels like doing anything. You take on work that would be too large for either of you separately and carry it the whole distance."
          },
          {
            "label": "SCORED BY OUTPUT",
            "text": "Output becomes the measure of the relationship itself, and from then on the connection is graded on what it produced. How close you felt while building the thing stops being recorded anywhere, because closeness does not appear in the result. The other face is that rest has to be earned, so an unproductive weekend arrives with a faint sense of having got away with something. What this pairing has to show for itself decides how each of you rates it, which makes a quiet season feel like decline rather than depth. Sitting beneath is the possibility that a relationship producing nothing visible would turn out to be nothing much, and that the work has been the only glue. You can list what got built this year far faster than you can say how close you felt while building any of it. That gap is where the actual relationship has been going."
          },
          {
            "label": "COUNT THE CLOSENESS",
            "text": "Write down on the last day of this month how close you felt during it, without listing a single thing that got completed. Do it separately first, then read both versions aloud to each other in one sitting, including where they disagree. Keep the pages somewhere visible next month and add to them rather than starting again. Watch which of the two accounts you reach for when somebody asks how things are."
          }
        ]
      },
      "9": {
        "title": "Relationship 9 — Built to Give",
        "fields": [
          {
            "label": "CARE THAT REACHES PAST",
            "text": "Your care does not stop at the edge of this relationship; it goes out to people and causes with no connection to either of you. Shared meaning comes easily, because you find purpose in the same things without having to talk each other into them. That outward turn gives the pairing a scope well past two people keeping one another company through the decades. Generosity of this size is a genuine way to be paired, and it changes what the relationship is for. You put real weight behind things that will never repay you, and you keep doing it for years."
          },
          {
            "label": "NOTHING LEFT INSIDE",
            "text": "Generosity aimed everywhere leaves the middle of this relationship running low, and the two of you notice it last. So much goes outward that the care circulating between you is whatever happened to survive the day. There is a second shape to it: attention to each other gets postponed for being the least urgent item, and the postponement never ends. Usefulness to the wider world is what each of you takes as the reason this pairing deserves to exist, so an evening spent only on one another feels indulgent. Under that is a fear of looking selfish, and beneath the fear a harder one, that with nothing to serve you would have less to say than you think. What either of you receives here ends up being the remainder after everybody else has been dealt with."
          },
          {
            "label": "EACH OTHER FIRST",
            "text": "Give to each other first this month, on one specific day, before anybody outside gets any of your attention. Make it cost the thing you are shortest of, which is usually hours rather than money or effort. Do it early, while you are both still capable of registering that it happened."
          }
        ]
      },
      "11": {
        "title": "Master Relationship 11 — A Heightened Connection",
        "fields": [
          {
            "label": "READ WITHOUT SPEAKING",
            "text": "Moods register between you before either has said a word, usually before the person having the mood has worked out what it is. This connection runs on attunement rather than explanation, which is why so little of it ever needs spelling out. That charge is real, and it makes the relationship feel significant in a way two people who merely get on cannot manufacture. You arrive at an understanding in silence that most pairs never reach across a full evening of talking."
          },
          {
            "label": "TOO HIGH TO LAND",
            "text": "Intensity is what keeps this pairing above the ordinary work any shared life actually requires. You stay inside the feeling of being connected and never convert it into anything carrying a date, so the plans remain conversation. It appears again in what gets avoided, with money, logistics and dull household maintenance treated as beneath the connection rather than part of it. How alive this feels is what each of you measures it by, which makes a practical week read as the whole thing cooling. What is being guarded against is the discovery that grounded and ordinary would dim the charge, and that without the charge there is less here than either of you has claimed."
          },
          {
            "label": "ONE VISION, DATED",
            "text": "Take a shared idea you keep returning to and turn it into a plan with dates, costs and a first step, this month. Do the unglamorous half at the same table rather than splitting it so that one dreams and the other files. Book or pay for one part of it before the month ends, so that it exists outside the conversation. Sit with how it feels once the idea has become an ordinary task."
          }
        ]
      },
      "22": {
        "title": "Master Relationship 22 — Built to Build Something Lasting",
        "fields": [
          {
            "label": "SCALE YOU CAN FINISH",
            "text": "Vision and follow-through sit inside the same pairing here, a far rarer combination than either quality on its own. You can see something large and then do the unremarkable daily work that turns it into an actual thing. What gets built between you is substantial enough to keep running without either person standing over it. The scale is not aspirational, since there are finished things behind you that prove the capacity rather than promise it. Neither of you loses interest at the point where an idea stops being interesting and becomes a schedule. You take on projects the size of a decade and get them standing."
          },
          {
            "label": "PACED BY AMBITION",
            "text": "Capacity of this size invites overextension, and you take on more than the relationship can carry at once. Decisions get made against what this pairing could build rather than against the energy genuinely available in a given month. There is a quieter version too: rest gets deferred until the current build is done, and the current build is never done. The size of what you are attempting is what makes each of you feel this relationship is worth being in, so slowing down feels like shrinking. Beneath it lies a worry that slowing down would mean settling for less than you were capable of, and that the two of you are only remarkable while under strain. The relationship itself gets spent in service of its own ambition, and the ambition never notices."
          },
          {
            "label": "CUT ONE THING BACK",
            "text": "Cut a commitment this month that is stretching you thin, and cut it properly rather than pausing it. Work out first how many hours a week you actually have, counting sleep and the ordinary running of a house, then set the ambition against that number. Choose whichever commitment would be least missed and end it in writing this week, with a date on it. Leave the freed hours unfilled for at least a fortnight, however many good uses present themselves. Pay attention to what happens in an evening with nothing scheduled inside it."
          }
        ]
      },
      "33": {
        "title": "Master Relationship 33 — Built Around Mutual Healing",
        "fields": [
          {
            "label": "DEVOTION AS THE DEFAULT",
            "text": "Compassion runs deep in this pairing and extends past the pair of you without being asked to. Service to something larger is the ordinary operating mode here rather than an occasional project taken up when there is spare capacity. Neither of you performs any of it, which is why it holds through the stretches that are thankless and slow. Presence of that order is uncommon and it is what you are actually made of. You stay with somebody through the part where everybody else has quietly stopped coming."
          },
          {
            "label": "ALWAYS THE ONE GIVING",
            "text": "Giving completely in every direction leaves both of you running a permanent shortfall that neither will name. Each of you attends to the other, and to everybody outside, so thoroughly that your own needs never make the list inside this relationship. A second face of it is deflection: an offer of care gets returned so quickly that nothing is ever received. The giving is what each of you counts as the evidence that this devotion is real, so an hour of being looked after feels like a debt opening. Underneath sits a fear that stopping to receive would expose the devotion as something you needed rather than something you chose. Total attention pointed outward means nobody in this pairing is charged with checking whether you are all right. The shortfall builds quietly and surfaces years later as a tiredness neither of you can trace to anything."
          },
          {
            "label": "TAKE IT WITHOUT REPAYING",
            "text": "Let one act of care from the other person land this month without deflecting it, returning it, or offering something back within the hour. Say thank you, stop talking, and leave the balance uneven for at least a week before doing anything about it. Sit with how uncomfortable the unevenness has become by about day three."
          }
        ]
      }
    }
  };
  window.DRelationshipContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DCompatibilityGapContent — 9 records
(function () {
  const prev = window.DCompatibilityGapContent;
  const T = {
    "data": {
      "0": {
        "title": "Compatibility Gap 0 — Nearly Identical Core Natures",
        "fields": [
          {
            "label": "SAME WIRING THROUGHOUT",
            "text": "You recognise your own reasons inside this person, which is why almost nothing here needs translating before it can be understood. When one of you goes quiet or sharp, the other places the cause immediately and asks nothing further about it. The ease is not something either of you is imagining, and it holds on ordinary days as firmly as on hard ones. Living alongside each other feels closer to recognition than to negotiation, so the small daily decisions cost you almost nothing. You read this person's motive off a single reaction, correctly, before a word of explanation has been offered."
          },
          {
            "label": "AGREEMENT COUNTED AS TRUTH",
            "text": "The match that makes this easy also means neither of you brings a genuinely different angle to anything that matters. You share your blind spots as completely as you share your instincts, so whatever both of you overlook stays overlooked. Nothing about this pairing pushes either of you past the person you already were at the start of it. Being understood without effort is what you quietly treat as proof that you got this choice right. Speed of agreement gets taken as evidence of accuracy, and those two things have very little to do with each other. What you keep away from is the question of whether you would still know each other if one of you started wanting something different."
          },
          {
            "label": "ARGUE THE OTHER SIDE",
            "text": "Take one decision you both waved through without discussion this year and spend twenty minutes writing the strongest case against it. Put the sharpest version of that case into full sentences before Friday, rather than leaving it as a few notes. Read it back the following morning and mark the single line you cannot answer."
          }
        ]
      },
      "1": {
        "title": "Compatibility Gap 1 — An Easily Closed Distance",
        "fields": [
          {
            "label": "COMMON GROUND ARRIVES FAST",
            "text": "Common ground turns up quickly between you, even on subjects neither of you had thought about before that morning. There is one real difference in how you each approach things, and it sits near enough that ordinary attention covers it. Most days your two natures simply cooperate, without the deliberate effort that wider distances demand from a pairing. You close the space between your instincts in the course of a normal conversation, without ever calling it work."
          },
          {
            "label": "TOO SMALL TO SAY",
            "text": "A difference this minor is easy to stop looking at, and once you have stopped looking you do not start again. Because it almost never causes visible trouble, the single point you actually diverge on can go unmentioned for years. You assume something this slight could not possibly matter, which is what leaves it free to surface at the worst moment available. A run of weeks with nothing rough in it is the private mark you award yourself as a partner. Raising it now would mean admitting it has bothered you for a long time, and you would rather not learn how long."
          },
          {
            "label": "SAY THE MINOR ONE",
            "text": "Write out the one place your approaches genuinely diverge, in a single sentence, before this Sunday. Say that sentence aloud to the other person during the week, even though it will feel far too small to be worth mentioning. Do not build a case around it, and do not explain why you are raising it now. Leave the conversation there, at exactly the size the difference actually is."
          }
        ]
      },
      "2": {
        "title": "Compatibility Gap 2 — A Light, Manageable Distance",
        "fields": [
          {
            "label": "CAUGHT WITHIN MINUTES",
            "text": "Talking past each other registers with you fast, usually inside the same conversation rather than days afterwards. Correcting the course takes one exchange between you, not a week of careful repair. Friction turns up and then goes, rarely lasting long enough to build into anything with weight of its own. This is a genuinely manageable difference in temperament, and handling it has never taken much out of either of you. You spot the moment your two readings stopped matching, and you say so before the conversation has moved on."
          },
          {
            "label": "MANAGED IS NOT SETTLED",
            "text": "Because the difference is manageable, it gets managed instead of finished, over and over, for years at a time. Small unaddressed things stack up quietly, each one too slight on its own to justify raising. Managing something is not the same as attending to it; one buys an evening and the other ends the matter. Your private measure of doing well here is how few things needed handling in a given week. You get quietly skilled at working around the same difference, smoothly enough that neither of you registers the workaround any more. Underneath is a question you leave alone, which is whether the difference stays small once real words go onto it."
          },
          {
            "label": "CLOSE ONE PROPERLY",
            "text": "Pick the difference you have been working around longest and deal with the thing itself rather than the inconvenience it creates. Set aside half an hour this month for that single item, with nothing else on the agenda. Handle it through to the end, so that it does not need handling again in four weeks."
          }
        ]
      },
      "3": {
        "title": "Compatibility Gap 3 — A Real but Bridgeable Distance",
        "fields": [
          {
            "label": "TALKING ACTUALLY CLOSES IT",
            "text": "There are stretches where you genuinely want different things, and you feel that pull instead of smoothing it over. Rather than assuming understanding, you go and have the conversation, and that is a harder move than hoping it settles itself. The effort involved is real without being punishing, and it lands somewhere instead of disappearing into the same argument. This distance responds to being addressed head on, so what you put in goes to the cause and not the symptom. You have done it more than once, which is how you know the approach holds under pressure. You talk a real difference in temperament all the way down to nothing, and it stays down."
          },
          {
            "label": "SMALL PASSES, ADDED UP",
            "text": "Left alone, the small moments of missing each other do not stay small, because they collect. Each single instance is easy to excuse at the time, since on its own it barely registers as an incident. Six months of easy excuses becomes a distance neither of you chose or intended to open. You both hold the same quiet assumption that no individual moment justifies a full conversation about it. Handling things without turning them into an occasion is where you quietly give yourself credit. So one more gets let go, and then another, and each one costs less than the talk it replaces. The part you steer around is finding out that those moments were connected, and that together they pointed at one thing."
          },
          {
            "label": "ONE TALK, BOOKED EARLY",
            "text": "Name a specific recent moment when you spoke past each other, and raise it inside the next fortnight. Open with that moment itself rather than with the pattern behind it, and stay on the single example. Do it while nothing is currently wrong between you, instead of saving it for the next flare. Say what you understood at the time, then ask what they actually meant, in that order."
          }
        ]
      },
      "4": {
        "title": "Compatibility Gap 4 — A Genuine Structural Distance",
        "fields": [
          {
            "label": "STILL DOING THE WORK",
            "text": "Your instinctive approaches differ enough that you both notice it constantly, far more than a closer-matched pair ever would. Rather than looking for a single fix that settles everything, you keep applying steady intention to the same live difference. This is not dysfunction, it is simply a larger amount of relational work than most pairings are ever asked for. You keep doing the maintenance a difference this size demands, week after week, without deciding the other person is the problem."
          },
          {
            "label": "TWO SETS OF ASSUMPTIONS",
            "text": "Without steady attention, you settle into separate working assumptions and stop checking them against one another. Everything carries on functioning at surface level, which is precisely what makes the drift so hard to catch early. Each of you stays privately sure of understanding the other, while both of you run on different reasoning entirely. Not needing constant maintenance conversations is how you privately grade this relationship, and yourself inside it. Bringing the difference up on a schedule would make this look like more effort than either of you wants to call it. So the check never gets made, and the assumptions harden into the way things simply are around here."
          },
          {
            "label": "A STANDING CHECK-IN",
            "text": "Set a fixed twenty minutes on the same day each week and use it to compare how you each read the last seven days. Keep it short and keep it scheduled, so that it happens on flat weeks and not only on bad ones. Ask what the other person thought was going on in one specific situation, then say what it looked like from where you were standing. Note the date of each one somewhere you both look, and book the following slot before you get up. Run it for six weeks before deciding anything about whether it is worth continuing."
          }
        ]
      },
      "5": {
        "title": "Compatibility Gap 5 — A Wide Distance That Wants Real Attention",
        "fields": [
          {
            "label": "YOU EXPECTED THE WORK",
            "text": "How differently you are each built is obvious to you most days, instead of something you notice only now and then. You have taken on board that staying close here is ongoing work, not an understanding reached once and then kept. That acceptance is the strength itself, and it does more for a pairing this wide than any amount of natural fit. Nothing about the effort takes you by surprise, so you spend no energy resenting the fact that it costs something. You keep turning up for a gap this wide during stretches when nothing about it feels like it is paying off."
          },
          {
            "label": "ADJACENT AND UNSPOKEN",
            "text": "Unattended, this settles into something that looks like a working relationship while you experience daily life increasingly differently. The distance never announces itself, it simply adds a little each month to the pile neither of you has mentioned. You end up living two lives beside each other that only resemble one shared life from outside. Keeping the surface calm is what you have come to count as looking after this relationship properly. Saying the real size of the distance aloud would turn it into a serious thing rather than a manageable one, so it stays unsaid."
          },
          {
            "label": "SAY THE RECURRING ONE",
            "text": "Choose the friction that has come back three times or more this year and name it plainly within the coming fortnight. Describe what keeps happening, without offering a fix and without softening the description as you go. Say it once, in a single sitting, and stop when you have finished describing it."
          }
        ]
      },
      "6": {
        "title": "Compatibility Gap 6 — A Substantial Distance Between Two Natures",
        "fields": [
          {
            "label": "CHOSEN AGAIN EVERY WEEK",
            "text": "Handling the same situation, you each instinctively reach for opposite moves, and both of you feel that split clearly. You do not pretend the pull is absent, and you do not let it run the relationship unattended. The work is deliberate and repeated, which is what a split of this depth genuinely requires. This is one of the harder distances to sustain, and sustaining it takes attention during the weeks when nothing at all is wrong. Autopilot would be considerably easier, and you keep declining it. You choose this pairing again in small ways every week, deliberately, instead of staying in it because it is already running."
          },
          {
            "label": "ACCOMMODATION MISTAKEN FOR UNDERSTANDING",
            "text": "Without real attention, this drifts onto unspoken compromise, where each of you gives way on matters you never actually discussed. Neither of you is lying, and neither is being entirely straight either. Understanding gets replaced by accommodation, which is quicker, quieter and requires nobody to say anything uncomfortable. The shift is slow enough that the accommodating version becomes normal before either of you notices it happening. Being easy to live with is the credit you privately award yourself for the way you handle this. Full honesty about the split feels like more than the relationship could carry, so the honest version goes unsaid. You end up managing the other person's preferences accurately while knowing less and less about what sits behind them."
          },
          {
            "label": "THEIR WAY, ON PURPOSE",
            "text": "Pick one decision this month and take the route the other person's instinct would take, without agreeing with it first. Do it fully rather than halfway, and do not narrate the fact that you are doing it. Choose something with a real outcome attached, not a token you could undo again by Thursday. Write down beforehand what your own instinct wanted, and keep that note somewhere findable."
          }
        ]
      },
      "7": {
        "title": "Compatibility Gap 7 — A Deep Distance Worth Taking Seriously",
        "fields": [
          {
            "label": "PRACTISED, NOT SETTLED",
            "text": "Real tension sits between what comes naturally to each of you, and neither of you pretends one conversation dissolves it. You treat it as sustained practice, going back to the same difficulty repeatedly instead of expecting a decisive fix. Committing to the practice rather than to an outcome is the actual skill a distance this deep asks for. You stay inside a pairing that never becomes automatic, and you keep working at it long after the novelty of trying wore off."
          },
          {
            "label": "TAKING TURNS, NEVER MERGING",
            "text": "Left without attention, this turns into real disconnection, with two ways of thinking taking turns instead of ever combining. The relationship carries on, and the cooperation passes for closeness for months at a stretch. You work together accurately without ever being aligned, and those are two different states that feel alike day to day. Smooth cooperation is the proof you hold on to that both of you are doing this well. Merging your instincts properly would mean one of you giving up something essential, and neither wants to discover which one. The arrangement that works stays in place, and the question of alignment goes permanently unasked."
          },
          {
            "label": "STATE THE PULL PLAINLY",
            "text": "Identify one situation this month where your instincts are actively pulling in opposite directions, and say so directly to them. Describe the pull itself rather than proposing which of you ought to move, using one sentence for each side. Do it during a calm hour rather than while the situation is actually unfolding."
          }
        ]
      },
      "8": {
        "title": "Compatibility Gap 8 — The Widest Possible Distance",
        "fields": [
          {
            "label": "EVERY PIECE CONSTRUCTED",
            "text": "Almost nothing between you lines up without deliberate translation, and every piece of understanding here had to be built by hand. That is not a flaw in the pairing, it is why what you have made is unusually solid wherever it exists. Nothing runs on assumption, because assumption has never held between you for longer than about a day. What you know about each other is earned rather than inherited from a lucky similarity nobody had to work for. You do the translation most pairings never attempt, simply to reach the ordinary understanding other couples begin with."
          },
          {
            "label": "TWO PRIVATE ACCOUNTS",
            "text": "Completely unattended, this produces two relationships, the one you are actually living and a private version each of you narrates alone. You each assume your own account is the shared one, and neither has ever set it beside the other for comparison. The widest difference shows up as two people telling themselves separate stories about the same week. Being the person who does the translating is the role you draw your standing from here. Admitting aloud how different you actually are would shake more than the pair of you want shaken, so that admission never arrives."
          },
          {
            "label": "WRITE THE PRIVATE VERSION",
            "text": "Sit down before Wednesday and write out the account of this relationship you carry privately, including the parts you have never said. Put all of it down without editing it into something reasonable as you go. Go back to the pages the next day and underline every line the other person has not heard. Pick one underlined line and say it to them out loud before the month ends."
          }
        ]
      }
    }
  };
  window.DCompatibilityGapContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();
