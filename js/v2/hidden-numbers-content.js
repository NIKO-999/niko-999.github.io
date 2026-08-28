'use strict';
/*
 * hidden-numbers-content.js — second-generation overlay.
 *
 * Layered on top of js/hidden-numbers-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DHiddenPassionContent — 9 records
(function () {
  const prev = window.DHiddenPassionContent;
  const T = {
    "data": {
      "1": {
        "title": "Hidden Passion 1 — A Leadership You Keep Underselling",
        "fields": [
          {
            "label": "FIRST TO MOVE",
            "text": "Direction gets set by you before anybody hands you the job, and most of the time you do not notice the moment it happened. Starting something from nothing does not produce the pause in you that it produces in almost everyone around you, so you move while others are still weighing it up. You would leave this off any honest list of your strengths, because effort is what you look for when you judge whether something counts as a skill. Somewhere in every group you end up carrying the question of what happens next, and you carry it without being asked. You take the first step into unmapped work, over and over, and treat it as ordinary."
          },
          {
            "label": "COASTING ON INSTINCT",
            "text": "Raw instinct is what you run on, and because nothing has forced you to work at this, it has quietly stopped getting better. There is a second version of the same problem: you lead again and again while telling yourself it is not a skill, just a job that landed on you, and resentment builds under that story. You feel valuable because you are the one who acts, not because of any conclusion you have reached about yourself. So when there is nothing to start, you go looking for something, because standing still leaves you holding no evidence. Underneath it sits a worry that the ability was never truly earned, that it is just wiring rather than skill, and that saying so aloud would expose you as a fraud. What you have never trained, you also cannot fully trust."
          },
          {
            "label": "SAY IT COST SOMETHING",
            "text": "Pick one occasion from the past week where you set the direction and then filed it under nothing, and write down in a sentence what it actually took. Tell one person, before Friday, that you did that piece and that it required something real from you. Do not soften the sentence with a joke on the way out of your mouth. Keep the written line somewhere you can find it again next month."
          }
        ]
      },
      "2": {
        "title": "Hidden Passion 2 — A Diplomacy You Keep Underselling",
        "fields": [
          {
            "label": "TENSION READ EARLY",
            "text": "Strain in a room reaches you before anyone has put words to it, and you have usually adjusted for it before the room knows there was anything to adjust. Things get said to you that would not be said elsewhere, and the reason for that rarely occurs to you. Two other people in conflict settle faster with you simply present, which is rare work that you rate as ordinary. You steer entire conversations away from damage while believing you were only being polite."
          },
          {
            "label": "THE UNASKED POST",
            "text": "Sensitivity this fast never gets pushed further, so it sits at the level it arrived at and stops improving from there. The second cost is heavier: you take a room's tension as your own responsibility by default, nobody assigned it, and resentment collects around a post you were never appointed to. You gauge your own worth by how smoothly the evening went for the people in the room, so a rough one lands on you as a personal failure. None of this looks like work from the outside, so the exhaustion arrives without any visible cause attached to it. The fear underneath is that without your constant management the room would turn, and you would discover you were welcome only as the thing keeping it calm."
          },
          {
            "label": "NAME THE SAVE",
            "text": "Catch one moment in the next few days where the way you read a room is the reason it went smoothly, and put it in writing the same day. Use plain terms for what you actually did rather than calling it luck or good timing. Read the note back to yourself on Sunday evening."
          }
        ]
      },
      "3": {
        "title": "Hidden Passion 3 — A Creative Voice You Keep Underselling",
        "fields": [
          {
            "label": "THE ROOM LOOSENS",
            "text": "Rooms slacken once you start talking, and you almost never credit yourself as the reason the mood shifted. Making somebody laugh or feel something arrives without a run-up, no preparation and no warming into it. What you dismiss as fooling around is, more often than you would admit, genuine craft doing real work. Mood comes through to you and your delivery bends to meet it, which is precisely why the whole thing looks like nothing. There is a real instrument in your hands and you play it in the gaps between the things you consider serious. You turn an ordinary hour into one worth having, using timing you never studied."
          },
          {
            "label": "KEPT AS A TRICK",
            "text": "Ease like this rarely gets developed on purpose, so the voice stays a party trick and never becomes a practice with weight behind it. Structured work has felt unnecessary because the thing already works, and what already works is the hardest thing in the world to sit down and improve. A second cost follows: you never find out what this could do with real attention behind it, and you settle for a ceiling far lower than the true one. Your worth rides on whether the room lifted, so a flat evening lands on you as a verdict about you rather than about the evening. Enjoyment of the surface comes easily, and it lets you forget there is craft underneath at all. Underneath is a worry that giving it real effort and landing merely ordinary would strip away the last thing you could count on being sure of. Staying casual keeps the question permanently open."
          },
          {
            "label": "FINISH ONE PROPERLY",
            "text": "Pick a single piece of the work you do for fun and give it, for seven days, the same seriousness as anything else on your list. Give it two sittings you have actually scheduled rather than the leftovers of an evening. Bring it to a finished state, with the rough parts fixed rather than excused. Hand it to one person and describe it as work, not as something you knocked together. Say nothing that lowers it as you pass it over."
          }
        ]
      },
      "4": {
        "title": "Hidden Passion 4 — A Discipline You Keep Underselling",
        "fields": [
          {
            "label": "STILL THERE LATER",
            "text": "Routines hold in your hands the way they do not hold in most hands around you, and this has been true long enough that you stopped noticing. A long tedious stretch of work does not grind you down at the rate it grinds down everybody else on the same task. Describing yourself as disciplined would feel wrong, because willpower is not what this has ever felt like from the inside. The parts of a project that need somebody still standing there in month six land with you, and you read that as scheduling rather than as trust. You outlast the difficulty in things, quietly, month after month, and call it showing up."
          },
          {
            "label": "AIMED AT NOTHING",
            "text": "Something this automatic almost never gets pointed anywhere on purpose, so it runs in the background on whatever happens to be nearest. There is a second cost too: you stay inside a joyless routine well past its usefulness, treating mere continuation as if it were progress. Your standing with yourself comes from not having dropped anything, which makes stopping a thing feel like a moral failure rather than a decision. The steadiness never breaks, so nothing ever forces the question of whether it is carrying you anywhere you want to arrive. What you are afraid of is that the reliability is the whole of you, and that without a routine to keep there would be nothing left over. So you keep the routine and postpone the question indefinitely."
          },
          {
            "label": "POINT IT SOMEWHERE",
            "text": "Write down one goal that genuinely deserves the kind of sustained effort you already produce without thinking about it. Move today's block of work onto that goal, ahead of whatever was simply next in line. Do the same for five consecutive days and mark each one on paper where you can watch the row build. On the sixth morning, read the row and decide whether the goal still earns the slot."
          }
        ]
      },
      "5": {
        "title": "Hidden Passion 5 — An Adaptability You Keep Underselling",
        "fields": [
          {
            "label": "UNFAMILIAR IS FINE",
            "text": "New situations do not knock you sideways the way they knock the person standing next to you in the same doorway. Uncertainty shows up as interesting much more often than it shows up as a threat to get through. Temperament or luck is what you would call it, and it is neither, since this is a real skill running without any supervision. You walk into the unmapped version of a day and begin adjusting before the ground has finished moving."
          },
          {
            "label": "MISTAKEN FOR LUCK",
            "text": "Ease this consistent almost never gets refined, because you class it as personality rather than as something with a next level to reach. There is a second cost running the other way: you undersell your own steadiness in a crisis, assuming everybody finds it this straightforward when very few do. That mismatch leaves you genuinely puzzled when somebody describes change as frightening, and quietly impatient with a fear you have no map for. You take your worth from being unshakeable, which means the day something does shake you gets hidden rather than examined. Underneath that runs a worry: admit the ground feels unsteady, and the single thing you could always count on being good at disappears."
          },
          {
            "label": "SPELL OUT THE SAVE",
            "text": "Think back to a recent situation your own flexibility quietly rescued, and set down the specific moves you made, step by step. Describe those moves to one person within the next three days, in the same detail you would use for a piece of technical work. Cut the words luck and easy out of the account entirely."
          }
        ]
      },
      "6": {
        "title": "Hidden Passion 6 — A Devotion You Keep Underselling",
        "fields": [
          {
            "label": "TENDING BEFORE ASKED",
            "text": "What needs tending reaches you before anybody has had to ask, often before the need has fully formed for the person who has it. Looking after somebody takes visibly less out of you than it takes out of almost anyone else doing the same thing. Just how I am is how you would put it, and that framing gives you nothing like the credit the ability deserves. The small adjustments that keep a room or a person comfortable happen ahead of any decision to make them. There is genuine skill in the timing of it, in knowing which small thing to move and when to move it. You make a place bearable for somebody on a bad day, then forget by evening that you did anything at all."
          },
          {
            "label": "ONE WAY CARE",
            "text": "Care this automatic stays reactive instead of becoming something you aim, so good work goes out constantly and nobody, you included, is shaping where it lands. The second expression is harder: you extend it to those who return none of it, because giving costs you so little that the imbalance takes years to register. That one-way pattern hollows out the very relationships it was meant to hold together, slowly enough that no single moment looks like the problem. Feeling needed is what makes you feel valuable, so no longer being required reads as worthlessness instead of freedom. By the time resentment surfaces you are already deep in it, since none of the giving felt like sacrifice while it was happening. The fear driving all of it is that the care is the reason you are kept, and that stopping would show you what you amount to without it. That question stays unasked because you keep answering it in advance."
          },
          {
            "label": "COUNT WHAT GOES BACK",
            "text": "Take one week and keep a short list of every time you attended to somebody, with a mark beside each entry for whether anything came back. Do not change your behaviour while the list is running, because the point is the record and not the reform. On the eighth day, read it through and pick the single relationship where the marks are most lopsided. Say one plain sentence to that person about what you have been doing and that you noticed it. Keep the list afterwards rather than throwing it out."
          }
        ]
      },
      "7": {
        "title": "Hidden Passion 7 — An Insight You Keep Underselling",
        "fields": [
          {
            "label": "PAST THE FIRST ANSWER",
            "text": "Complicated things resolve for you faster than they resolve for most of the people you talk to, and the speed does not strike you as unusual. A surface answer leaves you visibly unsatisfied at a point where everybody else has already moved on to the next item. Just how your brain works is your own description of it, which is exactly the phrase that keeps it undervalued. The question you are still turning over an hour later is usually the one that actually decided the matter. You get to the bottom of things other minds abandon halfway, and you do it without treating it as an achievement."
          },
          {
            "label": "CONCLUSIONS KEPT IN",
            "text": "Understanding this automatic stays private, held rather than offered, so real thinking sits unused because handing it over has not felt necessary. A second cost is isolation: nothing you say carries any sign of the work behind it, so the distance between what you know and what reaches anybody keeps widening. Over time that gap starts to feel like being fundamentally misunderstood, when the fuller picture was simply never volunteered. Your worth sits in the quality of what you privately understand, which means you can go long stretches without any of it touching the world. The fear is that spelling out the whole thought would reveal it as thinner spoken than it felt inside your head. Keeping it in means it never has to survive that test."
          },
          {
            "label": "SAY THE LONG VERSION",
            "text": "Select one thing you have worked out and would ordinarily keep to yourself, and choose a person to hand it to this week. Give the whole reasoning rather than the compressed summary you would normally offer. Let it take the four or five minutes it genuinely needs instead of cutting it to thirty seconds. Notice, afterwards, the exact point at which you wanted to shorten it."
          }
        ]
      },
      "8": {
        "title": "Hidden Passion 8 — An Executive Capacity You Keep Underselling",
        "fields": [
          {
            "label": "THE GAP GETS CLOSED",
            "text": "Responsibility lands on you and gets handled without the visible strain the same weight puts on most people carrying it. Following an ambitious plan the whole way through does not intimidate you at the point where it starts intimidating everybody else. Getting things done is how you would describe it, and that phrase hides how uncommon the ability actually is. You are most comfortable exactly where an idea has to turn into a finished result, which is the stretch where nearly everybody stalls."
          },
          {
            "label": "SPENT ON SMALL WORK",
            "text": "Capability at this scale rarely gets aimed at anything matching it, so it goes into small safe jobs that were never worth this much of you. There is a further cost: people lean on your competence constantly, and since you never look like you are struggling, nobody stops to ask if the load has gotten unreasonable. You never bring it up yourself, because coping without complaint is exactly what makes you feel worth something. Admitting the weight would mean admitting a limit, and a limit is a thing you have never left space to have. The fear sitting under it is that the capacity is all you are, and that the day you cannot deliver you become nothing anybody has a use for."
          },
          {
            "label": "ONE AMBITIOUS TARGET",
            "text": "Name one genuinely ambitious goal, out loud, before you begin any work on it this week, and write the date beside it. Give that goal the first hour of your working day for five days rather than the hour left over at the end. When smaller safe jobs arrive mid-morning, let them wait until the hour is finished."
          }
        ]
      },
      "9": {
        "title": "Hidden Passion 9 — A Compassion You Keep Underselling",
        "fields": [
          {
            "label": "FEELING REACHES FURTHER",
            "text": "Feeling for a stranger comes to you more readily than it comes to most, and distance does not thin it out the way distance usually does. Causes far larger than your own life move you in ways that surprise anybody who only knows you a little. Just how you are wired is your account of it, and that account is precisely what keeps the thing undeveloped. Suffering that happens far away still lands on you as real, not as some distant fact to file away. Most compassion narrows sharply past its own front door, and yours does not, which is rarer than it can possibly feel from where you stand. You hold the weight of things that have nothing to do with your own day, and you hold it unasked."
          },
          {
            "label": "WIDE AND UNSPENT",
            "text": "Compassion this broad stays diffuse, widely felt and rarely acted on, because it has not been aimed at anything specific enough to build on. It also spreads you thin across every cause at once, so none of them gets the sustained attention that would actually shift something. Feeling for everybody can leave you close to nobody in particular, a cost that arrives quietly and takes a long time to name. What makes you feel worthwhile is the scale of your feeling, and since feeling costs less than committing, feeling is what you keep supplying. The breadth becomes a reason never to plant yourself anywhere, since choosing one thing means visibly failing the rest. Underneath is a worry that any one concrete effort would turn out too small to count, while the sweeping version never has to be tested and found wanting. Nothing untested can ever be found wanting."
          },
          {
            "label": "ONE NAME ONLY",
            "text": "Settle on a single person or a single cause, and give it one concrete action inside the next seven days. Make that action something with a date and a result you could point at, rather than a sum of goodwill. Turn down, for that week, every other appeal that arrives, however deserving it looks in the moment. Write the one you chose at the top of a page and leave the rest of the page empty. Return to the same choice the following week instead of moving on to another."
          }
        ]
      }
    }
  };
  window.DHiddenPassionContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DSubconsciousSelfContent — 9 records
(function () {
  const prev = window.DSubconsciousSelfContent;
  const T = {
    "data": {
      "1": {
        "title": "Subconscious Self 1 — A Narrow but Sharp Toolkit",
        "fields": [
          {
            "label": "FEW TOOLS, USED FULLY",
            "text": "Inside ground you already know, you decide fast and you do not go back over the decision afterwards. The small number of instincts you actually own get used at full strength rather than kept in reserve for a better occasion. There is no hesitation in you when a situation matches something you have handled before, because the match is unmistakable to you. Somebody carrying a wider and less tested range would still be weighing options while you have already committed. You put every tool you have into a situation the second you recognise what it is."
          },
          {
            "label": "THE EDGE ARRIVES EARLY",
            "text": "Step off that ground and the certainty drains away quicker than you expect from yourself, with nothing behind it to fall back on. A kit this size runs out precisely where the unfamiliar starts, so an occasion asking for an instinct you never built leaves you standing still. From outside it looks like inconsistency, commanding in one room and oddly stranded in the next, when it is only the honest boundary of a narrow set. You count yourself as capable only while you are unhesitating, so you have quietly arranged your days to keep landing where hesitation is not required. The commitments that would stretch you get declined early, with a reasonable-sounding explanation ready every time. Underneath sits a suspicion that the certainty is all there is of you, and that past its edge you are nobody in particular."
          },
          {
            "label": "PRACTISE THE MISSING ONE",
            "text": "Name the one kind of pressure that reliably catches you carrying nothing, and write it down in plain words instead of leaving it vague. Pick a single instinct out of that gap and rehearse it this month somewhere the cost of doing it badly is genuinely small. Get three attempts done before the month ends, on days you choose rather than days that force the issue."
          }
        ]
      },
      "2": {
        "title": "Subconscious Self 2 — A Compact but Real Toolkit",
        "fields": [
          {
            "label": "CERTAIN WITHIN LIMITS",
            "text": "Ordinary pressure passes through you without leaving much of a mark, and the tools you lean on hold every single time you lean on them. You carry an accurate reading of your own capability, which spares you the second-guessing that a broad untested range brings with it. Where the terrain is known you move with a certainty that is not performed, because it rests on things you have genuinely done. You built a small set properly instead of collecting a large one loosely."
          },
          {
            "label": "NO PRECEDENT, NO MOVE",
            "text": "Something genuinely new, with no precedent anywhere in what you have lived through, finds the seams in your composure faster than it would in somebody carrying more. The set runs out at the exact line where the unfamiliar begins, and that line sits closer in than a broader range would place it. So you narrow the world instead, filtering the invitations you accept and the problems you take on down to the ones you already have an answer for. Being reliably competent is what you cash in for self-respect, and a day spent out of your depth reads back to you as a day wasted. You treat an undeveloped instinct as a flaw in your character rather than as something you have simply not got round to building. Beneath that is a dread of being found ordinary the moment the ground shifts under you. You would sooner stay small and certain than be caught improvising badly."
          },
          {
            "label": "ONE REHEARSAL BEFORE NEEDED",
            "text": "Pick the situation from this week where your usual approach did not reach far enough, and describe it in two written sentences. Choose one instinct that would have covered it and practise that instinct once a week for the next month. Keep the stakes low enough that a poor attempt costs you nothing beyond the hour it took. Log each attempt with its date so the month leaves a record rather than an impression."
          }
        ]
      },
      "3": {
        "title": "Subconscious Self 3 — A Capable Working Range",
        "fields": [
          {
            "label": "MOST DAYS ARE COVERED",
            "text": "Most of what an ordinary week throws at you gets handled without any real cost, and the few places you are thin are already known to you by name. That knowledge of your own edges is a capability in itself, and it is one most people never trouble to develop. You rarely have to invent an approach out of nothing, because there is usually something real underneath the move you make. You do not promise cover in territory you understand you have not covered, which is why the promises you do make hold up. You map your own limits accurately enough to plan around them long before anything depends on the answer."
          },
          {
            "label": "SOLID READ AS TOTAL",
            "text": "The trap at this width is quietly rounding the range up to complete, then being genuinely startled the rare time the rounding turns out wrong. Solid gets filed as total because nothing in an ordinary month disagrees with the filing. The gaps you can already name sit untouched for years for the plain reason that nothing has forced them, and comfort finishes the job. Your evidence for yourself is a run of days that went fine, so the run has to keep going for you to feel steady in your own skin. A single occasion you could not meet then lands out of all proportion to its actual size. What you are actually afraid of is that the known gap is not a gap at all but the true measure of you."
          },
          {
            "label": "CLOSE A KNOWN GAP",
            "text": "Say out loud the gap you already know about, using its plain name rather than the softened version you usually reach for. Give it one deliberate session this week, an hour is plenty, practising exactly that instinct with nothing whatsoever riding on it. Book the hour in before Wednesday so it does not get eaten by whatever else turns up."
          }
        ]
      },
      "4": {
        "title": "Subconscious Self 4 — A Steady, Middle-Ground Toolkit",
        "fields": [
          {
            "label": "MIDDLE GROUND, EARNED",
            "text": "Everyday pressure meets a steadiness in you that was built rather than issued, and it holds across the whole span of what a normal week contains. The extremes still find real edges, though those edges sit considerably further out than a narrower set would place them. You are neither swamped nor bored by what an ordinary day asks of you, which is an unusual place to be standing. You cover what actually turns up in a life without stretching for it, and you carry that cover without any visible effort."
          },
          {
            "label": "NOTHING FORCES THE GROWTH",
            "text": "What a middle-sized set does to you is persuade you that it is finished, and the deliberate building stops without any decision ever being taken to stop it. Because the range meets most of what arrives, nothing arrives to point at what it misses. In private you run the other version of the same move, reading your own lack of panic as evidence that you have gone as far as the material allows. Being dependable is what you trade for your own approval, and a stretch in which nobody needed your steadiness leaves you oddly unsettled. Growth at this width has to be chosen, and choosing it means admitting you are not finished, which is the part you keep skirting. The quieter fear is that you stopped growing years ago and have simply never checked."
          },
          {
            "label": "AN HOUR ON THE WEAKEST",
            "text": "Identify the instinct you already suspect is the weakest of the set, specifically enough that you could describe it to somebody in a sentence. Give it one deliberate hour before the weekend, while nothing is riding on it and no crisis is asking for it. Put a second hour into next week at the same time on the same day. Treat both hours as the work itself rather than as preparation for some later real version."
          }
        ]
      },
      "5": {
        "title": "Subconscious Self 5 — A Genuinely Well-Rounded Toolkit",
        "fields": [
          {
            "label": "SURPRISE COMES RARELY",
            "text": "Familiar and unfamiliar pressure both tend to find you already holding something usable, and the shape of what arrives rarely startles you. Steadiness of this kind is not composure worn on the surface; it comes from having genuinely met a wide spread of situations already. You move through things that would rattle almost anybody at a pace that does not change much, and the pace is not an act. Very little turns up with nothing in you to meet it, and you can feel the gap between a case you have covered and one you have not. You walk into the rooms most people brace for and start working immediately."
          },
          {
            "label": "ONE GAP LEFT UNCHECKED",
            "text": "The danger at this width is the assumption that wide means total, so the single gap a broad set still leaves goes unexamined until the day it is the entire problem. The composure is real, and in rare moments it sits closer to overconfidence, hidden precisely because so much genuine capability surrounds it. Being right nearly always means that being wrong once costs you far more than it costs somebody who is used to it. You keep score against a record of not being caught, and any incident that breaks the record gets re-run in your head for weeks afterwards. Asking for help has become unfamiliar rather than routine, so you go without it in exactly the situations where it would count for most. Below all that scorekeeping runs a worry that without the capability there is nothing in you worth much."
          },
          {
            "label": "SIT WITH THE UNCOVERED CASE",
            "text": "Write down one situation that would still genuinely test you if it landed on Thursday, and make it an honest one rather than a flattering one. Spend twenty minutes working out what meeting it would actually require of you, step by step, instead of trusting yourself to improvise on the day. Do that before this week ends, and keep the notes where you will read them again."
          }
        ]
      },
      "6": {
        "title": "Subconscious Self 6 — A Broad and Dependable Toolkit",
        "fields": [
          {
            "label": "MANY KINDS OF PRESSURE",
            "text": "Almost nothing arrives in a form you have no answer for, and very different kinds of trouble meet the same footing in you. You move between wildly unlike situations and unlike people without altering anything essential about how you operate, which costs you far less than it would cost most. You take the unpredictable problem without flinching, since unpredictability itself is not the thing that unsettles you. Breadth like that is not a mood you happen to be in; it accumulated out of actually standing in a great many different circumstances. You hold your footing across a spread of pressure that would each demand a different person to absorb."
          },
          {
            "label": "WIDE AND UNDEEPENED",
            "text": "Spreading a wide kit evenly over everything is the price of owning it, and no single instinct gets driven far enough down to become excellent rather than merely sufficient. Passable at a great many things and formidable at none is a real position, and it is where unchosen breadth deposits you. Handling whatever turns up becomes so automatic that the question of what you actually want stops getting asked, including by you. Your worth arrives through usefulness, so a fortnight where nothing needed handling leaves you restless and faintly unreal. Repeated long enough, the role stops reading as a strength and starts reading as a job you never applied for and cannot resign from. Choosing to specialise feels like deliberately becoming less useful, which is exactly why you keep not choosing. What you are frightened of is that usefulness is your only claim, and that narrowing it leaves you holding less than you began with."
          },
          {
            "label": "SPEND THE WEEK NARROW",
            "text": "Choose one instinct out of the set and give this whole week to it, refusing the pull to cover every other angle as well. Turn down one request you could easily have absorbed, and put the time it frees straight into the instinct you picked. Watch what seven days of depth is actually like before you decide anything about the rest of the set."
          }
        ]
      },
      "7": {
        "title": "Subconscious Self 7 — A Rich, Nearly Complete Toolkit",
        "fields": [
          {
            "label": "READY FOR NEARLY ANYTHING",
            "text": "Real surprise has become a rare event, and most of what turns up meets something in you that was already there waiting for it. Almost any situation, familiar or otherwise, finds you with a usable move rather than a blank. Readiness this wide was assembled out of an unusual quantity of actual living, and none of it came free or by accident. The unfamiliar does not register as a threat to you; it registers as another case to work through, which is a wholly different relationship with the world. You meet the thing that has no template and start building one on the spot."
          },
          {
            "label": "THE ANSWER ALWAYS EXPECTED",
            "text": "Being this close to complete brings a pressure to always have something, including through the rare stretches when you genuinely do not. Saying plainly that you do not know has become harder than it ought to be for somebody this capable, so you manufacture an answer instead of an admission. Offers of help thin out around you, which suits you well enough, and you end up carrying alone a good deal more than the situation ever required. Having something to offer is what you hold up as proof of yourself, so an occasion where you had nothing gets carried around for months. The rare gap alarms you out of all proportion to its size, precisely because everything surrounding it works so smoothly. Underneath runs the worry that readiness is what holds the whole structure up, and that one honest blank brings the rest down with it."
          },
          {
            "label": "ADMIT ONE UNSOLVED THING",
            "text": "Choose the thing this week you do not yet know how to handle and say it, still unsolved, to somebody whose view of you matters. Say it in its plain form, without appending the plan you were already assembling to make it sound managed. Do it before Friday, while the not-knowing is still true and there is no fix available to hide behind."
          }
        ]
      },
      "8": {
        "title": "Subconscious Self 8 — An Unusually Comprehensive Toolkit",
        "fields": [
          {
            "label": "STOCKED FOR ALMOST ANYTHING",
            "text": "Your composure holds in the places where other people's gives out, and it holds because real material sits underneath it rather than a decision to look calm. Ground where you have no reference point whatsoever barely exists any more, which is why so very little actually stops you. What appears from outside to be effortlessness is an unusually deep store of instinct that took years of real living to lay down. You bring a reference point into nearly every situation you enter, including the ones with no precedent behind them."
          },
          {
            "label": "NO PRACTICE AT FAILING",
            "text": "A set this complete starts to feel like immunity, and that feeling is the problem rather than the capability which produced it. When the rare genuine failure does arrive it lands far harder on you than on somebody who meets their limits weekly and knows the shape of the drop. You have almost no practice at recovering, having almost never needed any, so an ordinary setback plays as a catastrophe in your head for days. Alongside that runs a second habit: talking yourself out of the failure entirely, filing it as a freak occurrence instead of information about a limit. Not being stopped is the evidence you keep for yourself, and a week where something genuinely beat you puts the entire record into doubt. The fear you rarely put words to is that the depth is what keeps you safe, and that one real limit would prove the rest was never solid."
          },
          {
            "label": "COUNT THE TIME IT BROKE",
            "text": "Recall the last occasion this kit genuinely was not enough, and write down what happened without shaping it into an account where you came out fine. Read it back once more before the week ends, treating it as information about a limit instead of an exception to be explained away. Name the specific thing you would do differently if the same occasion arrived on Monday."
          }
        ]
      },
      "9": {
        "title": "Subconscious Self 9 — The Complete Toolkit",
        "fields": [
          {
            "label": "NOTHING ENTIRELY MISSING",
            "text": "No instinct is entirely absent from you; the differences are all in how far each separate one has been taken. You rarely enter anything with nothing at all to draw on, and you find your footing across kinds of pressure that have very little in common with each other. Completeness of that sort is genuinely uncommon and worth naming as an asset instead of treating it as the ordinary background of your life. Whatever a situation turns out to want, some part of you has already met a version of it. You land on your feet in territory sharing nothing whatsoever with the last place you landed."
          },
          {
            "label": "BREADTH INSTEAD OF DEPTH",
            "text": "Having everything available makes it easy to run on width and never take one thing all the way down, so you stay capable of most things and formidable at none of them. Constant composure begins to feel like distance, as though none of this ever costs you anything, when the truth is that you are well equipped rather than untouched. That distance is convenient, because it means you are never handled gently and never have to say out loud that something landed on you. Landing on your feet everywhere is what you privately count as proof you are enough, so the times you wobbled get quietly left out of the reckoning. What looks easy from every angle can still be costing you, and you are the only person placed to say so and the least likely to bother. What you are afraid of, once you go looking, is that the width is a way of never being tested, and that untested is what you have always been."
          },
          {
            "label": "CHOOSE ONE TO MASTER",
            "text": "Take one instinct and go deliberately further into it this week than you have ever bothered to go, picking whichever would matter most if you were excellent at it. Spend three sessions on that one thing rather than a single burst, spaced across the seven days. Leave the other eight entirely alone in the meantime, even on the days when one of them would be far easier."
          }
        ]
      }
    }
  };
  window.DSubconsciousSelfContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DKarmicLessonContent — 9 records
(function () {
  const prev = window.DKarmicLessonContent;
  const T = {
    "data": {
      "1": {
        "title": "Karmic Lesson: 1 — Developing Independent Initiative",
        "fields": [
          {
            "label": "STARTED FROM STILL",
            "text": "Starting something with nothing behind you is work, and you do it as work rather than as impulse. Every beginning you make costs a decision, so you know precisely what a beginning weighs, which is knowledge that instinct hides from everybody it carries. You see the exact moment where a thing either gets going or quietly does not, because that moment is never taken out of your hands by reflex. You choose your beginnings one at a time, deliberately, and the ones you choose hold their shape because a choice is what made them."
          },
          {
            "label": "TIMING AS A COVER",
            "text": "The waiting looks like judgement from inside, and you call it timing or reading the situation, while the thing you meant to begin gets begun by somebody else or by nobody at all. A second version runs quieter and heavier, where you rule that the drive was simply never issued to you, and then stop testing whether it can be trained. Your value comes from handling well whatever lands on your desk, so competence inside a frame somebody else built keeps you steady, and an empty week leaves you weightless. Underneath runs a private worry that the opening move is where a character actually shows itself, and that yours would read thin under that light. So you arrange things so the question never comes up, and then you call the arrangement a personality."
          },
          {
            "label": "BEGIN IT WEDNESDAY",
            "text": "Choose something you keep postponing until a clearer moment, and start it on Wednesday morning without first settling whether the conditions are right. Give it forty minutes, stop wherever you have got to, and write the date on it. Do that again the following Wednesday with a different thing entirely."
          }
        ]
      },
      "2": {
        "title": "Karmic Lesson: 2 — Developing Patience and Partnership",
        "fields": [
          {
            "label": "PATIENCE ON PURPOSE",
            "text": "Patience for you is a thing you perform, not a thing you were issued, so every minute of it is a minute you have priced. You read where an arrangement is heading well before it arrives, and you move it toward that destination faster than most situations move on their own. No part of you softens a delay into comfort, which keeps a stalled thing visible at full size instead of letting it fade into the background. Staying inside something unresolved is therefore always a decision, taken again each morning rather than supplied by temperament. You hold a partnership through its slowest stretch on nothing but that repeated decision, and it holds for exactly that reason."
          },
          {
            "label": "PUSHED TO A CONCLUSION",
            "text": "Speed becomes the problem it was solving: you push a developing thing toward its ending before it has grown the parts that would have made the ending worth having, and the settled version comes out thin. The other side of it is the exit, where you decide cooperation is not in your build, name yourself the difficult one, and abandon the practice altogether. Your worth runs on completion, on a decision made and an outcome you could state by Friday, so a week with nothing settled in it reads as a week you were absent from. What you will not look at directly is how little you believe remains of you once the momentum stops and only presence is asked for. Below that runs a flat dread of being unnecessary wherever nothing needs deciding. So you keep something urgent running at all times, and the urgency saves you from finding out."
          },
          {
            "label": "SEVEN DAYS UNTOUCHED",
            "text": "Sit with one unresolved thing for a full week without moving it toward an answer, and mark on the calendar the day you are allowed to touch it again. Once a day during that week, write down the sentence you would have used to close it. None of those sentences get sent. On the eighth morning read all seven of them through, slowly, and then decide."
          }
        ]
      },
      "3": {
        "title": "Karmic Lesson: 3 — Developing Self-Expression",
        "fields": [
          {
            "label": "THE DRAFTED SELF",
            "text": "Every sentence you say out loud has already been through a draft, because putting yourself into a room was never automatic and you built a process instead. You know exactly what you are showing and what you are keeping back, which is a degree of control over your own visibility that instinctive talkers never acquire. Nothing gets out of you by accident. When you do put something forward it is finished and deliberate, carrying the weight of having been decided on rather than spilled. You can measure, precisely, how far the version currently on display sits from the whole of you. You speak the edited one on purpose, and the unedited one stays behind a hand that is yours."
          },
          {
            "label": "REFINED UNTIL COLD",
            "text": "The editing never stops, and that is the first cost, because a thought gets worked over long after the heat has gone out of it, and what finally leaves you is accurate and dead. The second cost is the silence, whole stretches where you offer nothing at all and afterwards tell yourself expression is simply not among your equipment, which closes the question and keeps you out of practice. You take your measure from how little of you has been exposed, so a day where none of your sentences could be turned against you counts as a day well run. Under that sits a conviction that the unedited version would come out both too much and too plain, and that finding out which is worse than never knowing. There is grief in this as well, not regret but grief, for the things you thought clearly and let go unsaid. So the drafts accumulate, and the spoken half of you stays permanently smaller than the part held back. That held-back part is the one you would most want heard."
          },
          {
            "label": "FIRST VERSION OUT LOUD",
            "text": "Say one unedited thing a day for five days, out loud, to whoever is in the room, keeping the first version rather than the third. Pick your moment before you have any idea how it will sound. Afterwards note the five down in the exact words you used, not the words you wish had come out. On the fifth evening read that list through once, without amending anything. Then take the one that cost the most and speak in that register again the next morning."
          }
        ]
      },
      "4": {
        "title": "Karmic Lesson: 4 — Developing Discipline and Structure",
        "fields": [
          {
            "label": "FINISHED WITHOUT MOMENTUM",
            "text": "Nothing carries you through the dull middle of a task, so whatever you finish, you finished on purpose and can account for every hour of. The feeling of momentum does not fool you, since it has rarely done any of your work. That leaves you honest about what a piece of work actually costs, which habit makes impossible for the people it carries along. You build structure from outside yourself, out of dates and limits and written steps, and structure you built is structure you can repair."
          },
          {
            "label": "THE FLAT MIDDLE",
            "text": "Enthusiasm carries the opening stretch and then leaves without notice, and what remains is a half-built thing you walk past daily and do not touch. The second form is harsher: you take the pile of unfinished starts as settled evidence about your character and stop starting, which costs you the ones that would have held. You feel like a solid person when the interest arrives, the lit hours, the fast opening, the sense of a thing cracking open, so the flat middle reads as the interest having been wrong about you. Below that is the thought that you are made entirely of beginnings, and that a life inspected closely would show nothing carried through to its end. You postpone the inspection by starting again, which supplies fresh evidence and buys another few weeks."
          },
          {
            "label": "NINETY MINUTES DAILY",
            "text": "Take the oldest unfinished thing you own and give it ninety minutes every weekday morning until it is done, beginning tomorrow, regardless of how the first hour goes. Write those sessions onto a paper calendar and cross each one off by hand as you complete it. Nothing new joins the list until that one is crossed all the way through."
          }
        ]
      },
      "5": {
        "title": "Karmic Lesson: 5 — Developing Adaptability",
        "fields": [
          {
            "label": "HELD UNDER PRESSURE",
            "text": "Change arrives and meets resistance in you first, which means you interrogate a new thing before adopting it and you find its flaws early. You hold a position under pressure that flexible temperaments lose within a week, and holding is a capacity with real uses. Your commitments outlast the mood that made them, because a mood was never what fixed them in place. When you do change course, you do it having actually been convinced, so the new position sits on ground instead of on novelty. You take on the unfamiliar as an act of will each time, and will can be repeated where instinct only fires when it feels like it."
          },
          {
            "label": "STEADINESS ON TRIAL",
            "text": "Resistance comes before the facts do, and by the time you have finished examining the new thing, the moment it belonged to has closed without you in it. It shows up again in the story told afterwards, that you are simply rigid, made that way, not up for renovation, which turns one slow reaction into a permanent settlement. Your steadiness is where your worth is stored: you did not panic, you did not chase, you did not rewrite your life on a rumour, and that record is what you hold up when you need to feel like yourself. So a change you did not choose lands as a mark against the record, and you dig in harder to keep the mark off it. What you cannot bear to consider is that the ground you are holding has already moved and only the holding is left. That thought stays out of range, and every refusal you make keeps it there."
          },
          {
            "label": "CHANGE A WORKING ROUTINE",
            "text": "Take one routine you keep without thinking and run it differently for seven days, changing the route, the order or the hour, something with a real cost to altering it. Note what shows up on day three, once the novelty has worn off and the discomfort has not. Do not pick a routine you already suspect is wrong; pick one that currently works fine. Put the seven days in the calendar tonight."
          }
        ]
      },
      "6": {
        "title": "Karmic Lesson: 6 — Developing Responsibility to Others",
        "fields": [
          {
            "label": "ATTENTION YOU AIMED",
            "text": "Showing up for the people nearest you is a decision you make rather than a pull you obey, so the showing up is genuine every single time it happens. You know what an hour given away costs, because nothing hands it over on your behalf and you have to move it yourself. That makes your attention specific, since it goes where you sent it rather than where habit dragged it. You can tell duty and care apart, which instinct blurs together in anyone it does the work for. Nothing you do for another person is done to discharge an obligation you have never examined. You give what you give with your eyes open, and you can name the reason behind each piece of it."
          },
          {
            "label": "INTENTION LEFT SITTING",
            "text": "Presence is the thing that slips: you mean to be there, you fully intend to be there, and the week passes with the intention still lying where you set it down. A second and colder form follows, where you read those missed weeks as proof that care is not in you, and the conclusion conveniently lets you stop building it. Your worth is calculated on output, on what got produced and solved and delivered, so hours spent simply sitting near somebody feel like hours that go unrecorded. Underneath sits a quiet certainty that constancy is the one measure you would fail, so you keep choosing measures you pass instead. The nearest people get whatever is left over at the end, and you know they do, which becomes another entry on the same account. That accounting is itself the trouble, because you are running closeness as a list of tasks, and the tasks get done while the closeness does not. You are the only one who can take it off that list."
          },
          {
            "label": "ONE IMMOVABLE HOUR",
            "text": "Put a standing hour in your calendar this week for one person you have been meaning to reach, and treat it as immovable as a work commitment. Spend it with no task attached, nothing to fix, deliver or arrange. Do it again the following week at the same hour, before you assess whether it was worth doing. Write both dates down now, wherever you keep the commitments you actually keep. Hold the hour even on the week it is inconvenient."
          }
        ]
      },
      "7": {
        "title": "Karmic Lesson: 7 — Developing Depth and Reflection",
        "fields": [
          {
            "label": "ANSWERED AND MOVING",
            "text": "Questions get answered fast in your hands, because sitting inside one is uncomfortable and you move to the first workable answer available. That speed is a genuine capacity: you produce a usable position while the question is still live, and a usable position early beats a perfect one that arrives late. You are practical about not knowing, filling the gap with a decision and adjusting as information comes in. You reach conclusions and then act on them, and the acting is the part reflection alone never gets round to."
          },
          {
            "label": "FOUR MINUTES, ONE YEAR",
            "text": "The first plausible answer becomes the permanent one, and a question that deserved a fortnight gets four minutes and a position you then defend for a year. It runs the other way too: you conclude depth is not your register, that thinking is for other temperaments, and you hand the hard questions to whoever will carry them. Your worth is drawn from usefulness at speed, from having something to offer while a matter is still open, so an unanswered question feels like a failure you are actively committing. Below that is your discomfort with whoever you become when there is nothing to solve, no answer to produce, no motion, only you and something you do not understand yet. You keep the queue full, and a full queue keeps that person outside the door."
          },
          {
            "label": "REOPEN A CLOSED QUESTION",
            "text": "Reopen one question you have already answered, for thirty minutes on Sunday, with nothing to write down and no conclusion required. Set a timer so the half hour is genuinely fixed and cannot be shortened by arriving somewhere. Repeat that next Sunday with the same question rather than a fresh one."
          }
        ]
      },
      "8": {
        "title": "Karmic Lesson: 8 — Developing a Healthy Relationship With Power",
        "fields": [
          {
            "label": "COUNTED, NOT SENSED",
            "text": "Money and authority never sink into the background for you, because no reflex was ever installed underneath to handle them quietly. You examine what most temperaments merely feel: whether to ask for more, whether to take the seat, what a figure genuinely means. That makes you honest about the size of what you hold, since you count it rather than sense it. A number and a question about who decides stay separate while you work, and each gets judged on its own facts. You choose what to do with power deliberately, and every arrangement you sit inside is one you could explain from its beginning."
          },
          {
            "label": "GRAB OR HAND BACK",
            "text": "Two moves are available and both are the same move: you take more than the situation asked for, or you give the thing back the moment it is placed with you. The grabbing looks like appetite while working as a check that the supply is real; the flinching looks like modesty and is actually a refusal to be responsible for an outcome. Your worth sits in never having been greedy and never having been careless, a clean record on the handling of money and of trust. The fear is specific rather than vague: that with something large actually in your keeping you would turn out to be someone who mishandles it, and that this would then be a fact instead of a worry. You stay just under the level at which the question gets asked. The record stays clean, and nothing large has ever been written on it."
          },
          {
            "label": "THE UNROUNDED FIGURE",
            "text": "Name a number this week you have been quietly rounding down, a rate, an ask, a share, and put the true figure in writing to the person it concerns, with no sentence of explanation attached to it. Write that figure on paper first and look at it for a full minute. Send it on a Tuesday rather than at the tail end of a week. Then send exactly what you wrote, unaltered."
          }
        ]
      },
      "9": {
        "title": "Karmic Lesson: 9 — Developing Broad Compassion",
        "fields": [
          {
            "label": "CARE THAT STAYS CLOSE",
            "text": "Care in you runs by decision rather than by pull, so none of it gets spread thin across every cause that asks for a piece. Your attention stays where you put it, which is usually close in, on the few situations you are actually answerable for. You know where the edge of your circle is, and knowing where an edge sits makes it a choice instead of an accident. The care you do give is therefore dense and specific, real hours on a real situation rather than concern held at a distance. Scale does not move you, so you never confuse the size of a problem with whether you can do anything real about it. You put your care exactly where your hands reach, and you reach the whole way in."
          },
          {
            "label": "THE EDGE PATROLLED",
            "text": "Your circle stays the size it has always been, and everything past its edge stops registering as real, so suffering at any distance arrives as information rather than as something happening to a person. A second expression is the verdict you pass on yourself once you notice that: that you are narrow, made narrow, and the narrowness is settled and permanent. Your worth is measured by how completely you cover what is yours, the household, the obligations, the accounts you personally keep square, so anything outside that ring reads as an assignment belonging to somebody else. What you dodge is the arithmetic that follows any genuine reach outward, because once you start counting past the ones you know, the number never closes and the obligation has no end to it. Beneath that is a straightforward dread of being swallowed by a demand with no floor under it. So the edge holds exactly where it was, patrolled and thoroughly reasoned about. The reasoning is good, and that is precisely why the edge never gives."
          },
          {
            "label": "AN HOUR OUTWARD",
            "text": "Give one hour this month to a situation with no connection to your own life, choosing it by reading about the thing properly first rather than taking whichever request reaches you soonest. Do the hour in a single block and put it in the calendar before the month turns over. Say nothing about it to anyone. Afterwards write four or five lines on what you noticed while you were inside it. Set that aside for a month before deciding whether to do another."
          }
        ]
      }
    }
  };
  window.DKarmicLessonContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DCornerstoneContent — 9 records
(function () {
  const prev = window.DCornerstoneContent;
  const T = {
    "data": {
      "1": {
        "title": "Cornerstone 1 — You Begin by Leading",
        "fields": [
          {
            "label": "FRONT POSITION TAKEN",
            "text": "You walk into unfamiliar territory and set a direction before anyone present has settled on one. An opening presents itself to you as an invitation instead of a hazard, so your instinct is to propose the plan rather than wait for somebody else's version. Confidence, not caution, is what unfamiliar ground pulls out of you, and it arrives early enough to be useful. Moving is how you think, which means your first steps happen while the thinking still looks unfinished from outside. You get things moving that would otherwise sit unstarted, and you do it from nothing, with no direction agreed and no permission given."
          },
          {
            "label": "EVERY START IS YOURS",
            "text": "Moving first often means moving before the context has reached you, and decisiveness passes for readiness until the difference surfaces at a price. You also go without the experience of being led well, since the front position is claimed before an offer to lead you can arrive. Every beginning lands on your own back, whether or not it was ever yours to carry, and the load compounds across years. Your self-respect is assembled out of being first in, first moving, first responsible, and a day spent following reads to you like a day wasted. Under all of it sits the harder possibility that without the initiative you are ordinary, and that starting is the only thing you actually bring. So you keep taking the front, because a stretch spent waiting feels like a stretch of being nobody in particular."
          },
          {
            "label": "ASK ONE MORE THING",
            "text": "Before your next new start, collect one more piece of information than you would normally bother to gather. Then take one task already on this month's list and run it on a plan you did not write, following that plan to its end without amending it. Write the date you handed the steering over and the date the task closed, and keep those two dates together. Do the whole thing once without renegotiating the terms partway through."
          }
        ]
      },
      "2": {
        "title": "Cornerstone 2 — You Begin by Listening",
        "fields": [
          {
            "label": "READ BEFORE ENTERING",
            "text": "You watch a room for a while before joining it, working out how it runs before you say a single word into it. A new environment gets an observation period, and by the end of that period you understand the dynamics instead of guessing at them. Patience at the opening means you arrive carrying an accurate read while quicker entrances are still working off a first impression. You see what a situation actually is before you commit anything to it, and you build your opening move on that."
          },
          {
            "label": "THE EDGE OF ROOMS",
            "text": "Watching from the sidelines outlasts its usefulness, and an opening closes while you collect information you already hold plenty of. Your particular form of care comes out looking like disinterest, so the room settles into a shape formed without you inside it. Across enough repetitions you end up a spectator in places you were fully entitled to walk straight into. Competence, to you, means holding the most accurate read available, and the unhurried entrance is your private proof that you have it. Under it is a dread of joining at the wrong moment and having the misjudgement visible, so gathering keeps feeling safer than arriving long after you have gathered enough."
          },
          {
            "label": "SET AN ENTRY DATE",
            "text": "Give the observation phase a fixed end before you begin it: name the hour you will stop watching and step in. This week, act on one read you already trust at least a full day earlier than your usual pace allows. Say that read out loud in the room it belongs to, in your own words, without prefacing it with how long you took to reach it."
          }
        ]
      },
      "3": {
        "title": "Cornerstone 3 — You Begin by Expressing",
        "fields": [
          {
            "label": "HEARD IN MINUTES",
            "text": "You speak early into a new room, and the connecting starts before anybody has properly settled into a seat. Talking is your way in, so warmth and humour do the work of introduction while slower approaches are still forming a sentence. You make a first impression happen inside a few minutes instead of letting it accumulate over weeks. Rapport is not a technique you assembled at some point; it is what happens as soon as you open your mouth somewhere new. Silence in an unfamiliar place does not frighten you, so you fill it and the temperature of the whole situation changes. You turn a cold opening into a real conversation within minutes of arriving."
          },
          {
            "label": "CHARM ARRIVES FIRST",
            "text": "Speaking before the situation is understood means an impression gets made about something you have not yet worked out. The charm lands first and sets the terms, so the substance underneath comes second and has to argue its way in. A quick read of you is hard to correct afterwards, even once the depth is plainly on show. Being underestimated on substance stings out of all proportion for somebody this fluent, and you carry it as a private insult you cannot answer without sounding defensive. You gauge your own standing by how fast a place warms to you, and a slow start feels like a sign that something is wrong with you today. The thought you sidestep is that the warmth is the entire offer and there is nothing behind it worth waiting for. So you keep leading with the part that works instantly, and the deeper part stays unproven because you never let anything reach it slowly."
          },
          {
            "label": "HOLD THE OPENING BEAT",
            "text": "Wait one full beat longer than is comfortable before speaking into the next unfamiliar room you enter. Choose one meeting this week where you say nothing for the opening ten minutes and take notes instead. Afterwards, put two lines on paper about what you understood by staying quiet that you would have talked straight past. Do it again on a second occasion the same week, somewhere you already know everybody in attendance. Keep both sets of notes in one place and read them against each other on a single sitting."
          }
        ]
      },
      "4": {
        "title": "Cornerstone 4 — You Begin by Planning",
        "fields": [
          {
            "label": "BONES BEFORE MOMENTUM",
            "text": "You build a framework before spending any real momentum, so a new project gets organised before it gets exciting. Beginning is comfortable once a rough structure exists, and deliberateness rather than eagerness sets the pace of your opening week. A half-formed idea leaves your hands with actual bones in it, not only the enthusiasm it started as. You think in sequence: what has to be true first, what follows from it, where the whole thing breaks if the order goes wrong. You hand over a plan that survives contact with the work, because you have already walked its weak joints in your head."
          },
          {
            "label": "THE PLAN AS SUBSTITUTE",
            "text": "Planning slides into stalling, and the plan quietly takes the place of the start it was meant to make possible. Windows that reward speed pass by while the structure is still being finished, and you watch them go with a good reason in hand. Preparation feels like progress even on days it is functioning purely as delay, and that confusion is precisely what hides the stall from you. You count a week good when the groundwork got tighter, so your regard for yourself is tied to how well prepared you were and not to what got built. The fear you work around is starting something unready and having the failure trace back to your own carelessness. A plan that is never finished can never be wrong, and that safety is the real reason the last section keeps needing one more pass."
          },
          {
            "label": "CUT THE PREPARATION SHORT",
            "text": "Begin one project this week on noticeably less preparation than you usually accept. Set a hard cutoff before you plan it at all: a number of hours, written down, after which the work starts in whatever state the plan has reached. Pick something with a real deadline inside the next fortnight so that cutoff has teeth. When the hours run out, open the actual work and take the first step you had drawn up, unfinished plan and all."
          }
        ]
      },
      "5": {
        "title": "Cornerstone 5 — You Begin by Exploring",
        "fields": [
          {
            "label": "THREE STEPS IN ALREADY",
            "text": "You learn a thing by handling it, so you are three steps into something while the decision to start is still being weighed around you. An opening gets an eager, hands-on response long before it gets a plan, and enthusiasm rather than caution shapes your earliest moves. Adjusting as you go is not a fallback; it is the method, and it works because you read a situation faster from inside it. You get further into unfamiliar work in a week than careful study manages in a month, and you come back holding information no amount of reading would have produced."
          },
          {
            "label": "NOVELTY RUNS THE START",
            "text": "Jumping in with nothing underneath looks like readiness and is actually appetite, a difference that surfaces well after it could have been fixed cheaply. A promising start gets abandoned once the novelty burns off, right at the boundary where the ordinary work begins. The follow-through you were excited enough to begin gets left for whoever is still standing there, and you finish each year with far less built than the year contained. The rush of a first day proves to you that you are alive and able, and a flat Tuesday deep inside a long project says nothing back. What you keep away from is the stretch where a thing is dull and you are still required, because staying through that would test whether the appetite was ever ability."
          },
          {
            "label": "ASK THE SKIPPED QUESTION",
            "text": "Ask the one question you always skip on your way in: what does this actually look like in week six? Take a project you started within the past year and left at the interesting part, then spend two hours this week on its dullest outstanding piece. Put those two hours in your calendar now, on a named day, and treat that block the way you would treat an opening day."
          }
        ]
      },
      "6": {
        "title": "Cornerstone 6 — You Begin by Considering Others",
        "fields": [
          {
            "label": "EVERYONE COUNTED IN",
            "text": "You run a beginning through the people it will land on before committing to it on your own terms. Their needs enter the calculation earlier than yours do, and thoughtfulness rather than self-interest sets the shape of your opening move. You can tell in advance which person a change will cost the most, and that knowledge is inside the plan before the plan is finished. A beginning of yours arrives already carrying its consequences, so what you hand over has been thought about from more than one side. You hold what a group needs alongside what the work needs, without dropping either one of them. You start things that account for the people inside them, and the accounting happens up front instead of arriving later as repair."
          },
          {
            "label": "VETO NOBODY REQUESTED",
            "text": "Consideration delays a beginning that was fully yours to make, deferring something good because it was not unanimously convenient. You also go years without discovering what you would choose if no reaction from anybody were part of the arithmetic. The habit hands veto power over your own life to a handful of others who never applied for it and would be startled to learn they hold it. Kindness and avoidance end up wearing the same face, and from inside you cannot always tell which of the two is talking. Being the person whose beginnings cost nobody anything props up your self-respect, and a decision made alone feels selfish before it feels like yours. What you cannot look at is the chance that a want held purely for yourself proves a hardness you have spent your whole life refusing to have. So the beginning waits for a permission that was never anybody's to give."
          },
          {
            "label": "DECIDE BEFORE CONSULTING",
            "text": "Choose one plan this week and start it because it is right for you, before you have checked with a single person. Take the first irreversible step of it, the booking or the payment or the message sent, within three days of deciding. Tell people afterwards, and tell them as information, not as a question. Write one line about what you noticed in the gap between deciding and telling. Keep that line and read it again before the next decision you are tempted to run past everybody."
          }
        ]
      },
      "7": {
        "title": "Cornerstone 7 — You Begin by Understanding",
        "fields": [
          {
            "label": "CLARITY BEFORE COMMITMENT",
            "text": "You question a thing thoroughly before you will commit, and the questioning goes further than the situation strictly asks for. An opportunity gets real scrutiny first, so whatever you finally agree to, you agree to with an understanding you actually earned. You find the assumption a proposal rests on and test whether it holds, usually before anybody has named it as an assumption. Thoughtfulness rather than speed governs your opening moves, and the questions you raise at the outset are the ones that would have surfaced painfully in month three. You commit with a clarity that survives the first hard week, because you paid for that clarity up front."
          },
          {
            "label": "DILIGENCE THAT HIDES",
            "text": "Analysis keeps running after it has stopped changing anything, and a genuinely good opportunity closes while the understanding is still being assembled. The search for understanding doubles as a respectable reason to postpone a decision you do not want to make yet. It looks like diligence from every angle, including your own, which is how the avoidance runs for years without ever being named. Knowing more than the situation requires is what stands in for competence in your private accounting, and being caught not understanding something feels like being caught out entirely. The thing you steer around is committing on partial information and being wrong where it shows, with the wrongness traceable to a gap you could have closed. So the research continues, and the decision keeps its appointment for a later date that never comes."
          },
          {
            "label": "CHOOSE BY THURSDAY",
            "text": "Commit to one new thing this week on less certainty than you would usually require. Name the day you will decide by, Thursday for instance, and set the research aside on that day whatever state it has reached. Put the decision on paper in one sentence, along with the specific thing you still do not know. Then act on it the same afternoon, so the distance between deciding and moving stays under a few hours."
          }
        ]
      },
      "8": {
        "title": "Cornerstone 8 — You Begin by Assessing the Stakes",
        "fields": [
          {
            "label": "WEIGHED BEFORE STARTED",
            "text": "You weigh what is genuinely at risk before spending real effort, and the weighing is practical instead of anxious. An opportunity gets measured for tangible value first, so seriousness rather than instinct governs the way you take things on. You see the cost structure of a plan quickly, including the costs that will only show up in its second year. You take on work that can carry its own weight, and you know the number that makes it viable before you begin."
          },
          {
            "label": "THE UNMEASURABLE POSTPONED",
            "text": "A sharp eye for stakes filters out something meaningful because its payoff refused to appear in material terms. Things you actually want sit waiting for a business case that certain beginnings will never be able to produce, and they wait indefinitely. Applied evenly, the standard rules out precisely those parts of a life that resist measurement, and a mind built to measure postpones them permanently. You keep score by what you have built and what it returned, so an unproductive month lands on you as proof of having gone slack. The possibility you avoid is that the things with no return were the ones that mattered, and that a life counted this carefully can still come out empty."
          },
          {
            "label": "START ONE UNPRICED THING",
            "text": "Start something this week purely because it matters to you, with no payoff you could defend to anybody. Give it a fixed place in the week, two hours on a named evening, and defend that slot as you would defend a paying commitment. Do not calculate its value at any point inside those two hours, and do not decide afterwards whether it earned its place."
          }
        ]
      },
      "9": {
        "title": "Cornerstone 9 — You Begin by Considering the Bigger Picture",
        "fields": [
          {
            "label": "SCALE READ FIRST",
            "text": "You measure a beginning against the larger thing it belongs to before measuring it against the week. An opportunity gets weighed for its broader meaning first, and idealism rather than pragmatism decides what you take on. You ask what something is in service of at a stage where that question has occurred to nobody around you. The connections between separate pieces of work are visible to you early, so what you start is rarely one isolated task. Meaning gets checked before anything else starts, never tacked on at the end, and a beginning that fails the check does not get your effort. You aim your work at something that outlasts the immediate task, and you keep aiming it there when the task turns small and tedious."
          },
          {
            "label": "GRAND FRAME, NO FLOOR",
            "text": "Width costs you the immediate detail, and a beginning ends up beautifully framed and poorly grounded. Ordinary, small-scale starts feel beneath your attention, and those are exactly the ones that need it most. Grand framing substitutes for unglamorous groundwork, so the vision stays a vision and the first practical step never gets taken. The larger the picture grows, the easier it becomes to look past the small thing that would actually begin it. How you rate yourself runs on how large the thing you serve is, and a small job finished properly leaves you feeling like the day was wasted. What you keep out of view is that the vision may be where you live because the groundwork is where the limits of your patience would show. So the frame keeps widening, and the first small task sits untouched at the bottom of the page."
          },
          {
            "label": "HANDLE THE SMALL DETAIL",
            "text": "Handle one small practical detail on the way into your next beginning: the form, the booking, the boring email that unblocks everything behind it. Pick the least interesting item currently attached to your largest plan and finish it today. Let one beginning this week count simply because it is here and needs doing, with no larger meaning attached to it at all. Put the detail you handled and the date on paper, in the same place you keep the big plan. Do that again on two more days this week, one detail each time."
          }
        ]
      }
    }
  };
  window.DCornerstoneContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DCapstoneContent — 9 records
(function () {
  const prev = window.DCapstoneContent;
  const T = {
    "data": {
      "1": {
        "title": "Capstone 1 — You Finish by Claiming It as Yours",
        "fields": [
          {
            "label": "THE NAME ON IT",
            "text": "Endings are real to you once one name is attached, and you want that name singular rather than spread across a list. Credit and responsibility are the same question in your hands, and you want both stated plainly once the work has actually stopped. A result satisfies you in proportion to how clearly it belongs to somebody, which is why your decisiveness arrives at the close. You put a full stop on projects that other people would have left quietly running for another six months."
          },
          {
            "label": "THE LAST WORD TAKEN",
            "text": "Owning the close tips into claiming a result four people built, and into refusing a late change because the idea was somebody else's. Both moves teach everyone around you to stop offering anything in the final stretch, so the last useful correction gets swallowed instead of said. You end up finishing alone much more often than the work ever required, and you read that solitude as evidence of stature and not as a cost. Your own value is tied to a result being traceable back to you specifically, and a shared credit line lands like a demotion. Under all that sits something plainer, which is that an outcome with four names on it seems to say nothing about any of them. A version of you nobody could pick out of a group has, by your own accounting, done nothing at all."
          },
          {
            "label": "SAY WHOSE PART",
            "text": "Pick one finished thing from last month and send a message by Friday naming exactly which part somebody else built, before your own. Name the person and the specific piece rather than thanking a room, and keep your own contribution to the back half. Say nothing at all about how the work was received."
          }
        ]
      },
      "2": {
        "title": "Capstone 2 — You Finish by Making Sure Everyone's Included",
        "fields": [
          {
            "label": "NOBODY LEFT OUT",
            "text": "Nothing is over for you while one person involved still looks uneasy about it, and that instinct is finer than it sounds. You want agreement stated out loud, not the silence that gets treated as agreement and then argued about later. Thoroughness about other people's input shows up strongest at the close, where most attention has already drifted somewhere else. You catch the objection nobody voiced and hold the door open until it has been said."
          },
          {
            "label": "THE LAST SIGNATURE",
            "text": "Waiting for full agreement turns into never closing anything, because one more approval is always outstanding and always sounds reasonable. The same care hands your timeline to whoever answers slowest, so somebody who has not read the thread sets the date. Seen from outside, real consensus and plain stalling are the same behaviour, and from where you sit you cannot always separate them either. You draw your worth from nobody being run over on your watch, so an unfinished project with everyone content beats a finished one with somebody unhappy. Closing over somebody's head and learning afterwards that it wounded them is the outcome your entire method has been built to prevent."
          },
          {
            "label": "CLOSE IT ON TIME",
            "text": "Set a date for input on one open thing, put that date in writing, and close on the day whether every reply has landed. Choose something small enough that the deadline can sit four days away instead of a month. Write the closing message yourself before you go and check who responded."
          }
        ]
      },
      "3": {
        "title": "Capstone 3 — You Finish With a Flourish",
        "fields": [
          {
            "label": "ENDINGS THAT LAND LOUD",
            "text": "A finish nobody marks feels slightly unreal to you, as though the work has not properly stopped happening. You want the close to be visible, and some acknowledgement, however small, is part of what makes it count as over. The size of a send-off is how you say the thing mattered, and you would sooner overdo that than underdo it. Showmanship arrives naturally when something closes, where other people go flat and administrative. You turn the last day of a project into an event instead of letting it trail off into a quiet afternoon."
          },
          {
            "label": "GRADED BY THE NOTICE",
            "text": "Wanting a bigger finish holds the real one open, so something that could have ended in March is still waiting on a moment worth staging. It turns sour from the other direction when a genuinely good ending passes unremarked and you find yourself resentful about attention nobody ever promised you. Privately you rank your finished work by how loudly it landed rather than by what it did, and the quiet ones slide down that list whatever their quality. Your worth is stored in the volume around a finish, which is why the silence afterwards feels like a judgement on the work itself. An unmarked ending seems not to have happened at all, and a year of unmarked endings would mean you spent that year doing nothing."
          },
          {
            "label": "END ONE WITHOUT TELLING",
            "text": "Let the next thing you complete end without announcement of any kind: no message, no post, nothing mentioned over dinner. Choose something you are quietly proud of instead of something minor enough that keeping silent costs you nothing. Note privately, in one sentence on the day, what the finish was worth to you. Leave that note where you will not reread it for a month."
          }
        ]
      },
      "4": {
        "title": "Capstone 4 — You Finish by Making It Solid",
        "fields": [
          {
            "label": "BUILT TO HOLD",
            "text": "Durability is your test for whether a thing is over, and it is a genuine test rather than a preference for tidiness. You want honest assurance that something will hold before you take your hands off it, and loose ends bother you at a volume most people never experience. Checking is not anxiety in your case, it is the last stage of building, and you can tell those two apart. Your endings are where the care goes, which reverses the order most work gets done in. You hand over things that come back to you rarely, because you closed the gaps before you let go."
          },
          {
            "label": "ONE MORE CHECK",
            "text": "The pursuit of solid keeps running long after the work became usable, since one more detail can always be strengthened and you will always find it. It shows up as well in keeping a finished thing back over a gap only you can see, for a completeness nobody asked for. That delay costs more than the flaw it was guarding against, and the gap moves anyway, because your standard rises to meet whatever you have just repaired. How little of what you build ever breaks is the figure you privately live by, and it has to stay at zero for you to feel competent. What you cannot have is a fault leaving your hands unnoticed and surfacing later with your name still on it."
          },
          {
            "label": "SOLID ENOUGH COUNTS",
            "text": "Send the next piece at the point where you would ordinarily begin the final pass. Put a note in your calendar for Thursday asking whether the flaw you feared turned out to matter. Choose something with a real recipient so the release is not reversible on a whim. Hand it over without telling anyone it is provisional."
          }
        ]
      },
      "5": {
        "title": "Capstone 5 — You Finish by Moving On",
        "fields": [
          {
            "label": "DONE AND GONE",
            "text": "Speed defines how you close things: the essential work gets done and then you are away, with no appetite for standing around afterwards. Restlessness arrives the moment a project is essentially wrapped, well before the tidying and the ceremony are over. Momentum instead of closure is what an ending feels like from inside your own head, because the next thing is already pulling at you. You are into the following project before the current one has cooled, and you carry that pace through stretches of work that stop most people flat."
          },
          {
            "label": "THE TAIL LEFT LOOSE",
            "text": "Momentum leaves the dull final tenth lying where it fell, so a whole stack of your work is technically complete and not actually finished. The remaining details are never the interesting ones, which is precisely why they sit untouched for months at a stretch. The same hurry cheats you out of the second half of finishing, the part where a completed thing registers as an accomplishment before you have left it behind. Every next project looks more alive than the last one did, which makes each unattended tail easy to excuse and easier to forget by the following week. How highly you rate yourself runs entirely on being underway, so a fortnight without something live registers as decline. Sitting still beside a completed thing raises a question you would rather keep shut: whether, stopped, there is anything to you beyond the next start."
          },
          {
            "label": "STAY TEN MINUTES LONGER",
            "text": "Sit with the next finished piece for twenty minutes before opening anything else, on the same day you finish it. Spend the first ten on the unglamorous remainder, the file renamed, the last message sent, the receipt filed where it belongs. Then stay for the other ten with nothing running and nothing queued. Pick a project you would already describe as closed."
          }
        ]
      },
      "6": {
        "title": "Capstone 6 — You Finish by Making Sure Everyone's Cared For",
        "fields": [
          {
            "label": "THE CIRCLE BACK",
            "text": "An ending is not complete for you while somebody involved is still shaken by it, and you keep working long after the practical part is settled. Checking on people matters to you past the logistics, and you begin doing it before anybody thinks to ask. Practical closure is the easy half of the job, and you treat the human half as the actual work. Tenderness rather than efficiency is what your closes are made of, which is why they take longer and land softer. A close that went badly for one person stays with you for weeks afterwards, in detail. You go back for whoever went quiet during a wind-down, and you keep going back until they are genuinely alright."
          },
          {
            "label": "SOFTENING INTO DELAY",
            "text": "Care about how an ending lands stretches it out well beyond its natural close, and the stretching does more harm than the news ever would have. It works the other way too: you pick up somebody else's discomfort about a decision as yours to repair, when it was never handed to you. Endings you did not cause leave you flattened for days, and there have been enough of those to make you tired of closing anything at all. Kindness and delay feel identical at the exact moment you have to choose between them, which is the one moment the difference would be useful. Whether you are a decent person is settled, in your own accounting, by how gently people come out of your endings. A fast clean close registers as a small cruelty, even on the occasions it is the kinder move. Underneath runs a plain horror of being the reason somebody is hurt, and that is heavier to carry than every delay it produces."
          },
          {
            "label": "SAY IT UNCUSHIONED",
            "text": "Deliver one piece of unwelcome news this week without the three sentences of padding you would usually lay down in front of it. Write your first sentence out beforehand so you are not composing it in the room. Say that sentence and then stop talking, leaving the gap that follows unfilled. Choose something real instead of a rehearsal: a refusal you have postponed, a date you have stayed vague about. Do not go back that evening to check how it was taken."
          }
        ]
      },
      "7": {
        "title": "Capstone 7 — You Finish by Fully Understanding It",
        "fields": [
          {
            "label": "WHAT ACTUALLY HAPPENED",
            "text": "Understanding is your condition for calling anything over, and until you know what happened and why, the thing stays live in your head regardless of its official status. Processing a finished project is not optional for you, it is the final stage of the work itself. Endings prompt reflection in you at a depth most people never reach on their own time. Depth is what you bring to a close where others bring speed and a clear diary. You pull the real lesson out of a finished project on your own, and you usually have it before the dust has settled."
          },
          {
            "label": "STILL TURNING IT OVER",
            "text": "Reflection outlives the ending it was meant to process, so a project that closed in spring is still being taken apart in your head in November. The private version is worse: you return to a chapter everybody else has genuinely left, and you call that return understanding when it is nearer to rehearsal. Meanwhile the practical close happened months ago without you, and nothing in the world is waiting on your verdict about it. The hunt for a final account is itself what holds the ending open, since an explanation that satisfies you completely is more than most events can produce. Some of what you want only arrives with distance, and no further round of thinking on a Tuesday night will bring it forward. A full account of what happened is where you locate your own competence, so an ending you cannot explain leaves you feeling careless rather than merely uninformed. What drives the whole cycle is the possibility that something went wrong where you could not see it, and that closing the file unexplained means meeting it again unrecognised."
          },
          {
            "label": "AN HOUR THEN STOP",
            "text": "Give yourself a fixed ninety minutes on the project you keep returning to, and write the account you have been trying to reach. Stop when the time is up, complete or not. Set the timer where you can see it so ninety minutes stay ninety. Choose the oldest one you are still turning over instead of the most recent. Put the file away that evening and leave it shut until the month ends."
          }
        ]
      },
      "8": {
        "title": "Capstone 8 — You Finish by Measuring the Result",
        "fields": [
          {
            "label": "PROOF BEFORE DONE",
            "text": "Evidence is what closes a project in your hands: a figure, a result, something specific that can be shown to have moved. Ambiguous outcomes unsettle you at a level most people do not experience, because an unmeasured result is functionally an unfinished one. Rigour, not sentiment, governs how you decide that something has finished, and a disappointing number sits better with you than a warm impression. You know whether a piece of work actually did what it was for, and you say so plainly, including the times the answer is that it did not."
          },
          {
            "label": "OFF THE SCOREBOARD",
            "text": "Needing a measurable result marks a genuinely important finish down to nothing, purely because nobody could put a figure against it. The second expression is speed: you move through the human part of a close, the conversation and the acknowledgement, to get to the part with numbers in it. Repeated enough, that leaves the act of completing something oddly flat, since the moment you were meant to feel it was spent checking a total. The figure begins to seem more real than the work it was only ever standing in for, and you start managing the figure instead. Your competence is settled for you by what the result measured, so a strong stretch with nothing countable to show for it reads as wasted. Without a number you cannot tell whether you are any good, and the chance that you have been lucky and calling it skill is intolerable."
          },
          {
            "label": "COUNT THE UNMEASURED ONE",
            "text": "Name the soft outcome of one finished thing out loud before Sunday: what it changed, who is different, what you can do now. Choose the project whose numbers were unremarkable instead of the one that performed. Say it flatly, as a fact about the work."
          }
        ]
      },
      "9": {
        "title": "Capstone 9 — You Finish by Considering What It Leaves Behind",
        "fields": [
          {
            "label": "WHAT OUTLASTS YOU",
            "text": "What you finish keeps working after you have gone, and that is the measure you are really applying when you decide something is done. The wider consequence of a project occupies you as much as its immediate result, and often a good deal more. Endings raise the question of where everybody involved goes next, not only where you go, and you sit with it seriously. Generosity rather than urgency shapes your closes, so you hand things on complete instead of merely delivered. You think about the people two steps away from the work, the ones who will pick it up years after you stopped touching it. You build the version of a thing that somebody else can carry on running without you."
          },
          {
            "label": "TOO WIDE TO CLOSE",
            "text": "A view that wide skips the small particulars of an actual close, so the ending is beautifully reasoned and ragged in every practical detail. It also stalls a close that needed to happen on Tuesday, while you weigh consequences three years out that were never yours to settle. The larger picture is genuinely more comfortable than the unglamorous ten minutes of tying off what remains, and it performs that job well. Thinking about what a thing leaves behind costs you nothing today, whereas finishing it properly costs an afternoon you would rather spend elsewhere. Meanwhile the untidy particulars accumulate behind you, each one small, each one now landing on somebody else. Your worth is measured, by you, in the reach of what outlives your involvement, so a job done well and forgotten by December barely registers as an achievement. What actually worries you is that everything you made stops mattering the moment you stop maintaining it, which would make the effort a way of passing time."
          },
          {
            "label": "THE BORING PART FIRST",
            "text": "Do the smallest unfinished piece of whatever you are closing before any thought about where it leads: the receipt, the handover note, the last file. Give it twenty minutes tomorrow morning, first, before anything else is opened. Choose the project where you already know which detail is outstanding. Keep a short list of these on paper and strike them off as they are done, one project at a time. Take the dull item ahead of the interesting one every day until Sunday."
          }
        ]
      }
    }
  };
  window.DCapstoneContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DBridgeContent — 9 records
(function () {
  const prev = window.DBridgeContent;
  const T = {
    "data": {
      "0": {
        "title": "Bridge 0 — What You Want and How You Act Are the Same Thing",
        "fields": [
          {
            "label": "SETTLED BEFORE YOU NOTICED",
            "text": "Your ordinary Tuesday already contains the thing you would name if somebody asked what you are here to do. There is no translation step between the deeper aim and the small decisions, so you spend almost nothing on holding the two together. Most people burn years teaching their behaviour to agree with their intentions, and that argument was over in you before you knew it had started. Where another person needs a plan to stay consistent, you simply move and find the movement already pointed the right way. Nothing in your week has to be argued into agreement with anything else in it. You live one continuous life rather than assembling a coherent one out of parts every morning."
          },
          {
            "label": "EASE WITH NO PRACTICE",
            "text": "Alignment this complete stops asking anything of you, and a capacity that goes unused is not there when you finally reach for it. That shows up twice over: you assume the fit will hold forever without inspection, and you have almost no practice at the ordinary repair work of moving aim or behaviour to meet the other. Your self-respect rests on being somebody who has never had to try, because the coherence came free and free is the part you quietly prize. So the day life demands a direction your present shape did not anticipate, the effort itself reads as evidence that something in you has broken. What another person handles as routine adjustment arrives for you as a question about who you actually are. Lower down sits a colder thought, that the fit was luck rather than character, and that luck can be withdrawn without notice. Testing it is what you decline, and you call the declining trust."
          },
          {
            "label": "TEST THE COMFORT SUNDAY",
            "text": "Pick one area of your life where the ease has gone unexamined for a year or more, and write down what real growth there would require you to change first, the aim or the behaviour. Sit with that answer for twenty minutes on Sunday without deciding anything at all. Then take the smaller of the two changes and do a first version of it before the following weekend. Keep the note where you will find it again in three months."
          }
        ]
      },
      "1": {
        "title": "Bridge 1 — A Narrow, Easily Closed Gap",
        "fields": [
          {
            "label": "THE LAST SHORT STRETCH",
            "text": "Instinct carries you most of the way toward what you actually want, and the last stretch closes with a nudge rather than an argument. Corrections, when they come at all, are small and quick, and you do not think of yourself as somebody who works at being consistent. What you reach for without thinking and what you would defend as important are, on most days, the identical thing. The fight between wanting one thing and doing another, which occupies whole decades elsewhere, does not occupy you. You shut that final sliver of distance so fast that it barely feels like a decision at all."
          },
          {
            "label": "ONE THREAD LEFT LOOSE",
            "text": "A gap this narrow stops being visible, and the single place it does surface gets waved off precisely because it is too minor to bother with. The pattern runs in two directions at once: you dismiss the one mismatch as trivial, and you assume the closeness will hold on its own with nobody checking on it. You rate yourself by how little friction your life produces, so admitting that one part of it does not work is a cost you decline to pay. Under that runs a quieter worry, that the loose thread is not small at all but only quiet, and that pulling on it would unpick more than you could afford. So it stays exactly where it is, year after year, growing at the speed of nothing being done. The smoothness everywhere else is what pays for the neglect in that one spot."
          },
          {
            "label": "THIRTY MINUTES ON IT",
            "text": "Name the single place where what you want and what you do fail to meet, and put it on one line with none of the wording softened. Give that line thirty minutes of proper attention on Wednesday evening, with the tidiness of everything else kept out of the argument. Decide on one adjustment small enough to make twice this week, then make it both times. Put a date fourteen days out to look at the line again. Change the wording then if the first version proved too polite."
          }
        ]
      },
      "2": {
        "title": "Bridge 2 — A Light, Manageable Distance",
        "fields": [
          {
            "label": "CAUGHT WHILE STILL SMALL",
            "text": "Drift registers early with you, and within a few days of your behaviour sliding away from what matters you have already felt the mismatch. The distance shows up as friction rather than conflict, so aim and action cooperate through most of a week without negotiation. Repair costs you an afternoon rather than a season, which is why upkeep here has never felt like a burden. You correct while the error is still measured in inches, long before it has taken anything from you."
          },
          {
            "label": "SLIPS IN A ROW",
            "text": "Manageable is exactly the reason it gets ignored, because nothing that small ever demands the front of your attention. Two things follow from that: each separate slip looks too minor to act on, and the accumulation stays invisible until six of them are standing together. Your regard for yourself runs on being low-maintenance, on being a person whose life does not need constant fixing, so saying a drift out loud feels like confessing to a defect. Beneath that, you half suspect the small ones are the only ones you can handle, and that a genuine misalignment would find you with no method at all. A correction that would have cost ten minutes in March is a fortnight of work by August, and you know that while you postpone it."
          },
          {
            "label": "TUESDAY, NOT THE WEEKEND",
            "text": "Close one gap this week between something you say matters and something your calendar actually shows, choosing whichever has been open longest. Do the closing act on Tuesday rather than saving it for a weekend, while reversing the drift is still cheap. Write the date beside it so the next one has a marker to be measured against."
          }
        ]
      },
      "3": {
        "title": "Bridge 3 — A Real but Bridgeable Gap",
        "fields": [
          {
            "label": "TWO PULLS, ONE DAY",
            "text": "Two pulls run through an ordinary day for you, one toward what you know is important and one toward whatever comes easily in the minute. The distance between them is real without running your life, and it simply refuses to close by itself. Joining them takes a decision rather than a reflex, and that decision costs something without ever costing everything. Most days you can tell, in the moment itself, which of the two you are currently following. That noticing is a skill, and it arrived through use rather than through anything handed to you. You pick between the two pulls consciously, several times a week, and long practice has made you good at picking."
          },
          {
            "label": "REASONS THAT STACK UP",
            "text": "Left alone, this distance widens by increments so small that every one of them has a perfectly good reason attached. The pattern has two faces: you take the easy option and file the justification afterwards, and you let a run of those justifications stand without ever adding them together. Given long enough it stops feeling like one person with a workable distance and starts feeling like two competing versions of you sharing an address. You count yourself a serious person on the strength of the hard calls, which is why a run of easy ones gets left unrecorded rather than examined. Each excuse holds up on its own, and holding up is precisely what keeps the run of them invisible. The colder thought underneath is that the easy version is the true one and the deliberate version is something you keep up for show. Hindsight is usually where all that accumulated distance finally becomes visible for what it is."
          },
          {
            "label": "ACT AGAINST THE DEFAULT",
            "text": "Make one choice this week specifically because it serves the thing you say matters, picking a day on which nothing external forces your hand. Note in advance which way you go when there is no witness and no deadline, then move against that default once. Give yourself until Friday, and afterwards write a sentence about what the harder option genuinely cost. Read that sentence back to yourself four weeks later."
          }
        ]
      },
      "4": {
        "title": "Bridge 4 — A Genuine Structural Gap",
        "fields": [
          {
            "label": "JOINED BY HAND",
            "text": "Structure is what joins your aim to your behaviour, since the two do not share a wall and were never going to. You register, more often than a person with a narrower distance ever would, that instinct and intention want different things in the same minute. Joining them takes effort applied on a schedule rather than effort applied once in a good week. The work is unglamorous and it is real, and you get on with it without waiting to feel like it. You rebuild that connection by hand every week, and the rebuilding has made you capable in a way an easier chart never teaches."
          },
          {
            "label": "TWO TRACKS STILL MOVING",
            "text": "Without upkeep the two settle into separate tracks that stop reporting to each other, and both tracks carry on running perfectly well. That is the trap in both of its forms, a life that functions on paper, and a quiet split into a side that wants and a side that does. From the inside the split is nearly invisible, because motion on both tracks stands in for a direction nobody has checked. You judge yourself on whether things are working, and things are working, so the disconnection never gets counted as a problem at all. What you flinch from is a plain accounting of the last five years, in case it shows a competent life pointed somewhere you never chose. So you keep both tracks busy, which is the most convincing method there is for avoiding a look at either one."
          },
          {
            "label": "SAME SLOT, THREE DAYS",
            "text": "Build one repeated act this week that touches both sides, something small enough to survive a bad Wednesday. Put it in the same slot on three separate days rather than treating it as a single grand gesture. Choose that slot tonight and write it wherever your week is already planned out. Run it for four weeks before you judge whether it was the right one. Log each time you do it with a single mark, nothing more."
          }
        ]
      },
      "5": {
        "title": "Bridge 5 — A Wide Gap That Wants Real Attention",
        "fields": [
          {
            "label": "OVERRIDE AS ROUTINE",
            "text": "Left to themselves, instinct and intention drift apart, so closing the distance is continuing work rather than a repair you complete. You feel the pull between the two often, and it lands as genuine friction rather than a mild inconvenience. What comes naturally does not automatically serve what you actually value, so the useful move is usually the chosen one. You spot the pull and override it, repeatedly, with a strength that most lives never demand of anybody."
          },
          {
            "label": "MOTION AS COVER",
            "text": "Unattended, a distance this wide makes a life that looks full and moves quickly while heading quietly away from anything you would call important. The busyness is the first half of the problem, and the second half is that it works as cover, since there is always visible activity to point at. Reassurance arrives from outside right on schedule and lands on entirely the wrong thing, confirming the motion instead of the heading. You measure your value in output, in the count of things you carried this month, so slowing down enough to check the heading feels like giving up ground. Underneath is a thought you hold at arm's length, that if the activity stopped there would be nothing left that you had actually chosen. Stopping is therefore the experiment you never run. The distance widens on schedule while the calendar stays full and every day keeps looking productive."
          },
          {
            "label": "ONE ACTION, ONE CHANGE",
            "text": "Name honestly one recurring action that pulls you away from the point of your own life, and be specific about the hours it takes from you. Choose a single repeatable change to it, and apply that change every time the action comes round this week. Add nothing else to the week while you are testing it."
          }
        ]
      },
      "6": {
        "title": "Bridge 6 — A Substantial Gap Between Purpose and Instinct",
        "fields": [
          {
            "label": "ARCHITECTURE, NOT A PATCH",
            "text": "Your instincts and your deeper aim are not at war, but they are plainly not in the same conversation either. Bridging them needs real architecture rather than a quick patch, and you have had to work that out with nothing to copy from. Some days the split is obvious, since you know exactly what matters and you reach for something else entirely. Picking the aligned option over the automatic one is effortful every single time, and you pick it anyway. That effort is not a flaw of character showing itself, it is the honest size of the job you were handed. You take the harder option often enough that it has become one of the things you do reliably."
          },
          {
            "label": "SMOOTH AND POINTED WRONG",
            "text": "Efficiency is the danger here, because a life run entirely on habit works beautifully while heading steadily toward a place you would regret in hindsight. It arrives as two things at once, instinct and aim pulling hard enough that ignoring the tension is not really available, and a smoothness that hides the pulling right up until it is late. You count yourself successful by how smoothly a month runs, so a smooth month reads as proof that the direction underneath must be fine. What you cannot look at squarely is the arithmetic, that the habits driving you may already be fixed, and that the meaning may have drained out of the whole arrangement without one day going visibly wrong. By the time emptiness registers as emptiness, the routine producing it has run unchallenged for years."
          },
          {
            "label": "MORNING, BEFORE HABIT",
            "text": "Choose one action this week purely because it serves what you say your life is about, choosing a day where instinct is pointing elsewhere entirely. Do it in the morning, before the habits of the day have taken hold of your schedule. Say beforehand what makes it the aligned choice, in one plain sentence, and keep that sentence to yourself. Repeat the same action next Monday instead of looking around for a different one."
          }
        ]
      },
      "7": {
        "title": "Bridge 7 — A Deep Gap Worth Taking Seriously",
        "fields": [
          {
            "label": "PRACTICE, NOT DECISION",
            "text": "Tension between what you are drawn toward and what your life is actually for runs most days rather than occasionally. This is not a small misalignment to be tidied away, it is structural distance, and it asks for attention on a continuing basis. Closing it takes a practice rather than a decision, something you go back to on the days it appeals least. You have kept going back to it, which is an entirely different thing from finding it easy. The distance has taught you patience with slow things, since nothing here has ever resolved in one go. You return to that practice on your worst days, which is exactly when it does the most work."
          },
          {
            "label": "TWO PEOPLE TAKING TURNS",
            "text": "Neglected, this distance produces genuine internal conflict, a life that works in every practical sense while feeling as though two people take turns at it. Both expressions land together: the two sides read as separate forces instead of one pull, and any single fix feels laughably small against the scale of what wants joining. That scale then convinces you the whole thing is permanent, when the truth is that it is a larger quantity of ordinary work. Your worth is tied to consistency, to being somebody whose inside and outside match, so the taking-turns feeling reads as a verdict rather than a workload. The idea you edge away from has a clear shape: neither of the two is really you, and nothing beneath them holds it together. Feeling like two people exhausts you long before you have any words for what is going on."
          },
          {
            "label": "ONE PIECE TODAY",
            "text": "Write down plainly the one place where instinct and aim are pulling opposite ways right now, in the fewest words that stay honest. Build a single small piece of the connection today, within the next few hours, rather than designing the whole thing first. Take the scale of it seriously enough to book the next piece for the same time next week."
          }
        ]
      },
      "8": {
        "title": "Bridge 8 — The Widest Possible Gap",
        "fields": [
          {
            "label": "BUILT ENTIRELY ON PURPOSE",
            "text": "About as far apart as this system permits is where your aim and your instincts sit, which means the connection has to be made consciously and more or less continuously. A real split turns up again and again, since actions that come easily rarely serve what you hold important unless you redirect them deliberately. The compensation is that a connection built wholly on purpose ends up unusually strong, because no part of it was ever accidental. Almost nobody is asked for this much conscious construction on their own life, and fewer still keep turning up for the work. You turn up for it anyway, week after week, and you have built something that was never going to arrive by itself."
          },
          {
            "label": "TWO LIVES, LESS TRAFFIC",
            "text": "Ignored entirely, the two halves become two separate lives, one lived on instinct and one held privately as the thing that counts, with less traffic between them every year. The second face of it is subtler, that skipping even a little of the upkeep shows up faster for you than it would for anybody whose two numbers sit closer. Your worth is bound up in the construction itself, in being a person who builds rather than one who coasts, so a fortnight of coasting feels like proof of something bad about you. You keep clear of one thought in particular, that the private half, the one holding what counts, may be a story you tell yourself and never a life you will live. Two lives begin to feel like two identities, and identities are far harder to reconcile than habits. None of this is a fault in the arrangement, it is simply more work than most people are handed. The work does not stop, and pretending otherwise costs you ground you have already gained."
          },
          {
            "label": "MAINTENANCE, NO END DATE",
            "text": "Connect one instinctive habit to one thing you genuinely care about this week, and make that connection something you can point to instead of something you merely feel. Treat it as maintenance with no finishing line, scheduled like anything else that happens whether or not you are in the mood. Set the first one for tomorrow and the second for the day after, so the pattern starts before your interest in it does. Review the whole arrangement on the same date each month."
          }
        ]
      }
    }
  };
  window.DBridgeContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();
