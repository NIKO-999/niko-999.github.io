'use strict';
/*
 * name-numbers-content.js — second-generation overlay.
 *
 * Layered on top of js/name-numbers-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DExpressionContent — 12 records
(function () {
  const prev = window.DExpressionContent;
  const T = {
    "data": {
      "1": {
        "title": "Expression 1 — You Act By Going First",
        "fields": [
          {
            "label": "STARTED BEFORE PERMISSION",
            "text": "Direction becomes clear and you are already moving, which is method rather than temperament and it holds under pressure. Hesitation around you registers as your signal to begin, not as a warning that the ground underneath is unsafe. A room waiting for somebody to open it gets opened by you, with no appointment and nobody asked first. Standing still while a decision waits is not a state you can hold for long. False starts cost you almost nothing, because you read them as data about the route and go again the same afternoon. You put the first working version of a thing into the world while the rest of the plan is still theoretical."
          },
          {
            "label": "THE LOAD STAYS YOURS",
            "text": "Handing work over feels more dangerous to you than absorbing it, so you absorb all of it and call that efficiency. You can lead a team on paper and cannot let one near anything that would genuinely hurt if it went wrong, which leaves the entire load stacked on one desk. Your worth sits in the fact that the thing held together and your hands were the ones holding it, so every task released is worth given away. Under that sits a plain dread that work you did not personally touch comes back short, and the shortfall belongs to you regardless. You are tired at a level that has stopped announcing itself, since tiredness registers for you as proof of commitment instead of a fault in how you operate. Nothing in your reckoning has a line for what the carrying costs."
          },
          {
            "label": "HAND ONE OVER TODAY",
            "text": "Pick one task on your plate today that somebody else could do, hand it across with the standard and the deadline stated once, and then stay off it entirely. Before you release it, write a single line naming what you expect to go wrong, and keep that line somewhere you can find it later. Do not ask for progress, do not open the file, and do not quietly rewrite any of it at eleven at night. Read your line back once the task lands, whatever condition it lands in."
          }
        ]
      },
      "2": {
        "title": "Expression 2 — You Act By Bringing People Together",
        "fields": [
          {
            "label": "THE ROOM'S REAL TEMPERATURE",
            "text": "Tension in a room reaches you before anybody has put words to it, and you read the actual temperature rather than the sentences being spoken over it. You build by getting people genuinely lined up, and that is a considered theory of how things get done rather than a reluctance to decide. A plan everybody believes in outruns a faster one nobody bought, and you have proved that to yourself often enough to trust it completely. You bring a group all the way to a decision it can actually carry out, which is slower at the front and much quicker everywhere afterwards."
          },
          {
            "label": "SANDED DOWN TO AGREEMENT",
            "text": "Your own position gets sanded down until it cannot be told apart from the room's, and you do the sanding before anyone has asked you to. The same skill that lines a group up is what removes you from it, because the stance you walked in with is the first thing traded away. Where you feel solid is inside a room that holds together, which means you are only worth something while the agreement holds. The fear running under that is simple enough to say plainly: name a clear position and you crack the harmony you consider yourself responsible for keeping. So the position never gets named, and over a long enough stretch nobody expects you to hold one at all. That arrangement suits how you already operate, and it slowly removes you from your own work."
          },
          {
            "label": "SAY IT UNSMOOTHED",
            "text": "State your actual position at the start of the next meeting you sit in this week, before you have smoothed it against anybody. Say it in one sentence, without the qualifiers you would normally attach to the front and the back of it. Then wait a full minute before you speak again, and spend none of that minute repairing what you just said."
          }
        ]
      },
      "3": {
        "title": "Expression 3 — You Act Through Words and Presence",
        "fields": [
          {
            "label": "SAID INTO EXISTENCE",
            "text": "A plan is not real to you until it has been spoken aloud and met a live reaction that gives it something to push against. Your enthusiasm is the most reliable thing you have for getting an idea out of the theoretical and into motion, because it moves at speed. Quieter methods take far longer to reach the same point, and you have watched that happen enough times to stop apologising for volume. Talking about what you want brings something alive in a room that was flat ten minutes earlier. You start things by describing them so vividly that the describing is already half the work."
          },
          {
            "label": "TOLD, NEVER BUILT",
            "text": "The plan gets talked into existence and then the thing underneath it never gets made, because the telling already delivered most of what building was for. Momentum lives in the account of the work rather than the work, and follow-through slides another week every time a better conversation turns up. Where you get the feeling of being any good is how alive a room goes while you are describing something, which is a supply you have to keep generating. Down underneath is a colder thought, that the quiet unglamorous version would be examined properly and description has never had to survive examination of that kind. So the next idea arrives before the last one is finished, and the unfinished ones stop getting mentioned. Each abandoned thing takes a little of your trust in your own follow-through with it. What you say converts into nothing anybody could pick up and use."
          },
          {
            "label": "TWO HOURS, NO TELLING",
            "text": "Finish something today that you have already described to somebody, and do the finishing without telling a single person it is happening. Keep it out of every conversation you have this week until it exists in a form somebody could pick up. Give it two solid hours in a room where talking to anybody about it is not available. Put the finished object where you will run into it on Monday morning."
          }
        ]
      },
      "4": {
        "title": "Expression 4 — You Act By Building the Structure",
        "fields": [
          {
            "label": "PARTS IN ORDER",
            "text": "Ideas arrive at you as sequence, meaning the actual steps, the actual order, and the actual weight each part will have to take. You will not trust a plan until you can list its parts in order, and that refusal has rescued more projects than any burst of enthusiasm. What you make is meant to be standing in ten years, so you think in the long run while the thinking around you happens in moments. You are the reason an exciting idea survives its first contact with a calendar and a budget. You turn loose momentum into something that can actually be carried out by ordinary people on ordinary days."
          },
          {
            "label": "PROOF WITHOUT A CEILING",
            "text": "Nothing starts until every detail is nailed down, far beyond the point at which additional certainty buys anything. A genuinely good plan sits still for months because it has not yet met your private standard of fully proven, and that standard has no upper limit. Whether the thing you made held is your real measure of yourself, so any part you cannot verify in advance is a threat to the only score you keep. What sits under the stalling is a failure that preparation was supposed to have removed, arriving anyway because you moved before the ground was solid. The waiting has a price and it appears on no list, least of all yours, because delay feels like diligence from the inside and diligence never gets counted as avoidance."
          },
          {
            "label": "MAKE THE FIRST PIECE",
            "text": "Start one structure today at the point you can already see, and make that first piece without knowing the shape of the last one. Give yourself an hour, produce something that exists when the hour closes, and accept in advance that some of it will be rebuilt. Write down, before you begin, the single question you were waiting to answer, then begin with that question still open."
          }
        ]
      },
      "5": {
        "title": "Expression 5 — You Act By Moving and Adapting",
        "fields": [
          {
            "label": "COURSE CHANGED SAME HOUR",
            "text": "Reality tells you something the plan never accounted for and you change course inside the hour, without the mourning period most approaches require first. That is a real theory of progress rather than inconsistency, one that puts responsiveness above loyalty to a document written before anybody knew anything. Sudden change reaches you as information about the terrain, so you handle the kind of week that flattens more rigid methods. Options keep appearing to you precisely because you were never locked onto the single path that hides them. A plan is a starting position to you, not a promise you owe anything to. You find the way through a situation that has already stopped behaving the way it was supposed to."
          },
          {
            "label": "PERMANENTLY MID-PIVOT",
            "text": "Direction changes often enough that nothing is left alone long enough to prove whether it works. Whole projects live permanently mid-pivot and never reach an ending, because a better-looking option turns up before the current one has had a fair run. You feel capable while you are moving, so a week spent grinding at one unglamorous thing reads as being stuck rather than as the job. Underneath every pivot is a result you have arranged never to receive, the plain finding that the first plan would not have worked. Motion is the one state in which that finding cannot reach you, and staying in motion is something you are extremely good at. From outside it looks like range, and from where you sit it is a way of not being told. The unfinished ones accumulate, and adding them up is a task that keeps sliding out of the week."
          },
          {
            "label": "SEVEN MORE DAYS",
            "text": "Stay on today's plan through the moment a better option appears, and log that option on paper instead of acting on it. Give the current thing seven more days before you allow yourself to reopen whether it was the right one. On the seventh evening, read the logged options back and mark which of them you still actually want. Cross out the ones you cannot now remember caring about. Keep that page for the next time a pivot presents itself."
          }
        ]
      },
      "6": {
        "title": "Expression 6 — You Act By Taking Care of Things",
        "fields": [
          {
            "label": "TENDING GETS YOU MOVING",
            "text": "Something needing attention gets you up and moving faster than any ambition of your own ever has, and that has always been the order. You push things forward by making sure the people and the details around the work are genuinely looked after rather than assumed. You notice what has been left too long and simply begin repairing it, without waiting for anybody to assign it. Your care stays care and does not curdle into control, so people get helped without being managed while it happens. You keep a whole situation upright by tending the parts of it nobody has thought about yet."
          },
          {
            "label": "PICKED UP UNASSIGNED",
            "text": "Responsibility nobody handed you gets picked up anyway, and your week fills with things that were never yours to run. Tasks other people were entirely able to do land on you because you reached them first, and reaching them first has become automatic. Being depended on holds your value steady in your own estimation, so putting something down feels like handing back the reason you are worth having around. What you dread is narrow and specific, that something left untended gets traced back and read as your neglect rather than as nobody's. So you cover more, and the covering shows up nowhere as a cost until you have nothing left to spend on it. None of it gets added up along the way."
          },
          {
            "label": "LEAVE ONE ALONE",
            "text": "Choose one thing today that is genuinely not yours to manage, and leave it entirely alone for the full day without checking once. Write that thing on a piece of paper in the morning so the choice is fixed before the urge to intervene arrives. Let the discomfort of not checking sit where it is, and do nothing about it until tomorrow."
          }
        ]
      },
      "7": {
        "title": "Expression 7 — You Act By Understanding First",
        "fields": [
          {
            "label": "TAKEN APART FIRST",
            "text": "Comprehension comes first for you, and it is the method itself rather than a delay standing in front of the real work. You commit to a direction once you have taken it apart far enough to know what it actually is, which is why your moves land where others slide. You can sit inside genuine uncertainty without forcing a clean answer onto it before one exists. While others are still working things out mid-flight, you are acting on thinking that finished weeks ago. You reach the accurate version of a problem before the situation has finished disguising itself."
          },
          {
            "label": "READING INSTEAD OF DECIDING",
            "text": "Research continues long past the moment you had enough to act, and the extra reading has quietly become the thing you do instead of deciding. It looks like rigour from every angle, including yours, which is exactly what has kept it in place this long. Knowing more than the situation requires is where you get your footing, so a decision made on partial information feels like being caught out. The fear is about handover, because to act is to be committed to an outcome that stops being yours to steer the moment it begins. More reading almost never moves the decision you eventually make, it moves the date instead, and the date was the only thing ever genuinely in question."
          },
          {
            "label": "TWENTY MINUTES, THEN CHOOSE",
            "text": "Act today on what you already understand, and pick the decision that has been open longest rather than the easiest one on the pile. Set a timer for twenty minutes, write the choice down when it goes off, and send or start whatever that choice requires. Read nothing further before you do it. Close the tabs you opened for the research and begin on the choice within the hour."
          }
        ]
      },
      "8": {
        "title": "Expression 8 — You Act By Executing at Scale",
        "fields": [
          {
            "label": "INTENTION MADE SOLID",
            "text": "Intention becomes an object with you, and until it has produced something you can point at or hand over it is not yet real. You are oriented toward the material result, which makes you unusually good at the conversion that most effort stalls at halfway. Ownership of an outcome is something you take before anybody thinks to assign it, and you do not put it down once the work turns unpleasant. You build the thing that still exists after the meeting is over."
          },
          {
            "label": "PAID ONLY IN OUTPUT",
            "text": "Everything gets measured by what it produced, and you apply that rule to yourself with no exemption written into it anywhere. A day that produced nothing you could hand somebody registers as a failed day, whatever else went on inside it. Output is where your worth is stored, so the account has to be topped up daily and nothing at all carries over from yesterday. The fear underneath concerns what remains when the producing stops, since stripped of visible results you are unsure there is a person there with a claim to anything. Rest gets quietly demoted, along with thinking time and hours that have no shape, because none of them post a number. You do not argue with any of this; you simply work through the evening again. The measure itself is what you leave off every list you keep."
          },
          {
            "label": "AN UNRECORDED HOUR",
            "text": "Do one thing today for a reason that has nothing to do with what it produces, and leave it unrecorded. Pick something that takes at least an hour, and do not photograph it, log it, or mention it to anybody afterwards. Let the day close with that hour unaccounted for, and go to bed anyway."
          }
        ]
      },
      "9": {
        "title": "Expression 9 — You Act On Behalf of Something Larger",
        "fields": [
          {
            "label": "AIMED PAST YOURSELF",
            "text": "Purpose beyond your own stake generates something in you that self-interest alone has never been able to produce on its own. You are most effective and most recognisably yourself when the work clearly serves something wider than what you personally take from it. That outward direction gives your action a reach which effort aimed at private gain rarely arrives at. You sustain a level of commitment on somebody else's behalf that you would abandon within a week if the only beneficiary were you. You carry work forward on the strength of what it is for rather than what it returns."
          },
          {
            "label": "YOUR TURN KEEPS WAITING",
            "text": "Action on your own behalf almost never gets taken, while action on everybody else's gets taken immediately and completely. Your needs are told to wait, and they wait indefinitely, because there is always a cause with a better claim on the hour. Serving something larger is the reason you count yourself worth the space you occupy, so an hour spent purely on yourself reads as a withdrawal. The dread is of the comparison, since your own want set beside the causes you carry looks small and self-serving. Because the pattern presents as strength, nothing about it gets flagged, and you are the last one likely to flag it. The depletion becomes visible only once it has already changed what you are able to do."
          },
          {
            "label": "ONE HOUR, NO CAUSE",
            "text": "Take one action today purely for your own benefit, carrying no cause whatsoever and no justification prepared in advance. Choose something you actually want rather than something defensible, and hand it a real slot in the day instead of the leftover end. Tell nobody what it was for. Do the same again next Wednesday, chosen the same way and defended to nobody."
          }
        ]
      },
      "11": {
        "title": "Master Expression 11 — You Act On Inspiration",
        "fields": [
          {
            "label": "MOVING ON THE HUNCH",
            "text": "Insight arrives at full intensity and you move on it before you could explain to anybody what you have just understood. Your best action follows that intensity rather than a slower deliberate plan, and the results have backed that choice up repeatedly. You act on a hunch that turns out later to have been exactly right, which is a genuine capacity and not luck arriving twice. Speed lets you take openings that everybody else is still discussing. Certainty arrives afterwards for you, once the move has been made and the ground has answered. You reach an opening inside the short window where it is actually available."
          },
          {
            "label": "PERFECT AND UNBUILT",
            "text": "Inspiration stays inspiration and the action below it never arrives, so the ideas pile up somewhere they cannot be used. That leaves you wired and restless and oddly unsatisfied, generating more insight than any week could absorb and finishing none of it. Seeing further than the room is where you find your own size, and an unbuilt idea keeps that seeing perfect. What stops you is the thought of the made version standing next to what you saw and being obviously smaller than it. So the distance between the sensed thing and the built thing widens, and the widening is its own steady frustration. Every unmade idea stays exactly as good as it was the moment it arrived."
          },
          {
            "label": "THIRTY MINUTES OF BUILDING",
            "text": "Turn today's insight into one concrete step before the day ends, however small and however far from the version you can see. Make the rough one, keep it, and refuse yourself the option of waiting for conditions that would produce the good one. Give it thirty minutes and stop when the thirty minutes are up."
          }
        ]
      },
      "22": {
        "title": "Master Expression 22 — You Act By Building at Scale",
        "fields": [
          {
            "label": "SIZE AND TEDIUM TOGETHER",
            "text": "Scale does not push you into abstraction and detail does not bore you out of the follow-through, which is a rare pairing to hold at once. You keep something enormous in your head and still care about the tedious steps that turn it into an actual object. Vision and discipline run alongside each other in you instead of trading off, so the big thing gets finished instead of merely described. You think in years where most thinking nearby happens in weeks, and you build accordingly. You finish work whose size would have stopped a lesser plan at the drawing stage."
          },
          {
            "label": "EXHAUSTION READ AS PROOF",
            "text": "More gets taken on than your actual capacity can hold, and the overload is read as confirmation that the method is correct. Exhaustion has been promoted from a warning into evidence, which is why it never triggers any change of plan. The size you can imagine has no body attached to it, and the body doing the work runs on a fixed and unimpressive supply of hours. Your worth is measured against what you are capable of at full stretch, so anything under full stretch registers as a smaller version of you. That is the fear stated plainly: pace yourself and you settle, and settling would mean the capacity was never as large as you believed. You find out otherwise late, well past the moment when easing off would have been the cheap option. The correction always costs you more than pacing yourself ever would."
          },
          {
            "label": "PACE IT IN WRITING",
            "text": "Set today's effort against the energy you actually have rather than the eventual size of the project, and choose the pace from that number. Take one commitment currently stretching you thin and reduce it this week, in writing, to a size that survives your real pace. Say the reduced version out loud once, then work to it. Diary the review for a fortnight out and hold the reduced pace until then."
          }
        ]
      },
      "33": {
        "title": "Master Expression 33 — You Act Through Service",
        "fields": [
          {
            "label": "CARE WITHOUT TECHNIQUE",
            "text": "Presence is the mode you act from rather than a technique you assembled, so care does not have to be performed to be delivered. Somebody living through something real gets the whole of your attention, and that attention is felt rather than merely offered. What most approaches have to learn deliberately, you arrive with, and it holds up in the situations that make other methods formal. You meet somebody at the worst hour of their year without flinching and without managing them."
          },
          {
            "label": "AVAILABLE UNTIL EMPTY",
            "text": "Service runs until there is nothing left in you, and then it runs a while longer on whatever sits underneath that. Other people's needs get met completely and in detail while your own sit unattended, not refused so much as never reached. Feeling completely available is what your own goodness rests on, and availability with a limit attached does not feel like the same thing. The fear concerns what the service would turn out to have been, since stopping to look after yourself would make it a job done well instead of devotion. So the deficit accumulates where it cannot be seen, because showing it is outside what you allow yourself. It becomes visible only in what you can no longer manage to give."
          },
          {
            "label": "SOMETHING PURELY YOURS",
            "text": "Give one hour today to your own care, chosen without reference to anybody else's need and connected to none of them. Put it in a real place in the day rather than the last twenty minutes before sleep, and keep it for you alone. Do the same thing again on Thursday."
          }
        ]
      }
    }
  };
  window.DExpressionContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DSoulUrgeContent — 12 records
(function () {
  const prev = window.DSoulUrgeContent;
  const T = {
    "data": {
      "1": {
        "title": "Soul Urge 1 — You Crave Independence",
        "fields": [
          {
            "label": "PERMISSION NOT REQUIRED",
            "text": "You run your life on your own judgement, and the decisions that matter get made without a permission step in front of them. This is not about having power over other people; it is a refusal to owe the shape of your days to anybody. The want sits deep enough that it has already organised your work, your money and where you live, without ever having been stated as such. You notice quickly when a situation starts asking you to hand over the steering, and you spot it in places most would never think to check. You defend the right to author your own days in rooms where the question has not occurred to a single person in them."
          },
          {
            "label": "EXPLAINING FEELS LIKE HANDOVER",
            "text": "You bristle when somebody asks you to check in, and how reasonable the request was does nothing to soften it. Ordinary accountability lands as an attempt to take something from you, so a two-line question gets met with the force a real threat would deserve. When the reaction cannot be justified out loud it comes out sideways instead, as late replies, vague answers and an irritation you cannot trace to anything that was actually done. Self-respect, for you, is a running count of how much of your life never had to be cleared with anybody, and each explanation given goes against that count. The part you avoid stating plainly is that one account of yourself leads to another, until the life is being run by committee and you are only staffing it."
          },
          {
            "label": "TELL THE PERSON ASKING",
            "text": "Before Friday, go to whoever last asked you for an account of yourself and tell them straight that you want to run this your own way. Say what the independence is actually for, in one sentence, so the want is on the table as a want rather than as resistance. Then answer their original question in full, the same day, without stretching it out or making them come back for it."
          }
        ]
      },
      "2": {
        "title": "Soul Urge 2 — You Crave Real Closeness",
        "fields": [
          {
            "label": "KNOWN RATHER THAN LIKED",
            "text": "Being liked is not the point; being known is, with the contradictions and the rough edges left in and chosen anyway. That want runs far below ordinary sociability, which is why a full week of easy company can leave you exactly where you started. You can spend an entire evening in a warm room and register that not one exchange in it reached the part of you that counts. When somebody does reach it, the difference lands immediately, and no amount of pleasant surface talk produces the same thing. You can tell inside one conversation whether you are being met or whether the agreeable version is, and the two never blur together. You go on holding out for the relationship that gets past the performance, and you pay for it in years of company that does not."
          },
          {
            "label": "YEARS OF AGREEING",
            "text": "You accommodate people to keep them near, agreeing well past your own comfort because losing closeness reads as worse than losing yourself. Whole years can pass with you shaped to whatever a relationship seemed to need, and the shaping is so practised that you barely register doing it. You count yourself a decent person by how little friction you have caused, and that count is the only measure you fully trust. Under the smoothing sits a private conviction that the unaccommodated version of you would not have been chosen, which is why it never gets put forward. So the strategy produces precisely the distance it was built to prevent: they stay, and the person they are staying with is not you."
          },
          {
            "label": "ASK, DO NOT HINT",
            "text": "Pick the person you most want to be close to and, within the next two days, tell them what you want more of from them, in plain words. Do not adjust the sentence to what you think they can take, and do not follow it with a reassurance that it is fine either way. Say the version that would be true if you were not managing anybody's comfort, and leave the sentence standing as you said it. Do it once, and do not make up for it afterwards by being especially easy to have around."
          }
        ]
      },
      "3": {
        "title": "Soul Urge 3 — You Crave to Be Truly Seen",
        "fields": [
          {
            "label": "SERIOUS UNDER THE JOKE",
            "text": "Delight aimed at your real self, rather than at the version that works a room, is the only kind that registers, and the gap between the two is obvious to you when it is invisible everywhere else. Being taken seriously matters far more to you than the easy laughs would suggest. The entertainer is not a fake, and that quickness genuinely belongs to you, but it is one slice of a person doing the work of the whole. You register the difference in the half-second after a laugh lands, when you know which of you it was aimed at. You lift the mood of an entire room while keeping the serious half of yourself completely intact underneath it."
          },
          {
            "label": "THE POLISH RUNS ITSELF",
            "text": "The performance runs so constantly, and so well, that the unpolished version of you has nowhere left to appear. From the inside the seam is hard to find, and you can finish an evening genuinely unsure which parts of it were you and which were the act. Warmth that comes back arrives addressed to the character, so it settles on nothing, and you privately decide you must be harder to satisfy than most. Your self-respect is pinned to being reliably good company, so an ordinary flat mood arrives as a duty you have failed. The polish goes on in rooms that would have been perfectly fine without it, and that is where the tiredness comes from. What you steer clear of is the possibility that the plain version could not hold a room the way the quick one does. Steering clear of it leaves the question open indefinitely, and you go on paying the running cost of an answer you have not gone looking for."
          },
          {
            "label": "NO JOKE AFTERWARDS",
            "text": "Choose one conversation this week where you say the serious thing you would normally convert into a bit, and hold the quiet after it. No joke tacked onto the sentence, no self-deprecating tag, and no change of subject at the four-second mark. Let the unpolished answer stand for the remainder of that conversation instead of steering back toward lighter ground. Do it on a day you would ordinarily be on form rather than one where you are already flat."
          }
        ]
      },
      "4": {
        "title": "Soul Urge 4 — You Crave Real Security",
        "fields": [
          {
            "label": "ENOUGH TO STOP BRACING",
            "text": "What you are after is something dependable enough that you can stop bracing for it to come apart, and that is a need rather than a taste for tidiness. Order by itself does not interest you, since the arrangement is only ever a means to the breath you finally let out. You can tell the difference between a life that looks stable and one that would actually take weight, and the first does not hold you long. Dependability is something you assess quickly and accurately, in a person, a job or a plan, well before it has proved itself either way. When something genuinely holds, you build on it patiently, across years, at a pace most give up on by the third month. You keep doing the dull maintenance that holds a life together long after the interest in doing it has worn off."
          },
          {
            "label": "TIGHTENING INSTEAD OF RESTING",
            "text": "Control is what you reach for when things feel uncertain, so you tighten the schedule, the house, the plan and the people inside them. Rigidity stands in for the security it cannot deliver, because no arrangement of external things promises what you are really buying with it. Feeling like a competent adult means, for you, that nothing has slipped and nothing has been left unattended, which turns an ordinary loose end into evidence against you. The vigilance costs more every year while the calm it was bought for keeps not arriving, so you buy more vigilance. Beneath the tightening is a certainty that if your hands came off for a week the whole thing would fall in, and it stays untested because your hands do not come off."
          },
          {
            "label": "NAME THE NEED ALOUD",
            "text": "Say it to one person who cares about you, before Sunday, in the form of a need: this is what would let me stop bracing. Name the specific thing rather than the general wish for stability, and do not turn it into a plan you can go away and execute alone. For that same week, leave one small arrangement unmanaged, the one you would ordinarily straighten on your way past it. Notice what you do with your hands instead, and put one line about it on paper each evening."
          }
        ]
      },
      "5": {
        "title": "Soul Urge 5 — You Crave Real Freedom",
        "fields": [
          {
            "label": "CHOSEN EVERY DAY",
            "text": "Room to move is the condition you need, and the door being open matters more to you than walking through it. This is not restlessness for its own sake; it comes from refusing to let a choice quietly harden into something you cannot leave. You know within days when a situation has begun closing around you, usually well before anything about it has visibly changed. Commitment itself is not the problem, since you can give yourself completely to work or to a person while staying goes on being chosen rather than assumed. You re-choose the same job, the same person and the same city on ordinary mornings, which is a harder way to stay than never wanting to go."
          },
          {
            "label": "DECLINED IN ADVANCE",
            "text": "Anything that resembles confinement gets declined before you have tried it, and the good ones go out with the bad because the sorting happens on appearance alone. Jobs you wanted, people you wanted and plans you had half-built get turned down in the first minute, with a reasonable explanation supplied afterwards. The avoiding now costs you more freedom than any of those commitments would have taken, because a life with nothing inside it is not open, only empty. How much room you have is your private measure of how well things are going, and every door shut in advance counts toward the total. The fear doing the work here is that staying long enough to test one would prove it was confinement after all. You keep the instinct unexamined for exactly that reason, and it goes on making decisions that you experience as freedom."
          },
          {
            "label": "TEST ONE DECLINED THING",
            "text": "Take the one commitment you turned down or postponed this year that you actually wanted, and re-open it within ten days with a real date attached. Give it a stated end point you choose yourself, three months or six, so that staying is a decision with an edge rather than an open sentence. On the day you start, write out exactly what would count as confinement, in terms specific enough to check against later."
          }
        ]
      },
      "6": {
        "title": "Soul Urge 6 — You Crave to Belong",
        "fields": [
          {
            "label": "A PLACE NOT EARNED",
            "text": "A real home is what you want: a small set of people, unmistakably yours, held together by care running both directions rather than by living nearby. Underneath all the looking after sits a plainer wish, for a place that does not have to be re-earned every week. You want to be counted in because you are you, and not because of what you carried through the door on your way in. You keep a handful of relationships alive across decades, through the long flat stretches where the care is all maintenance and no feeling."
          },
          {
            "label": "PAYING TO STAY",
            "text": "Giving is how you buy the place you have already been given, and the price quietly rises every year. Love and inclusion turn into something you pay for in lifts, meals, favours and remembered birthdays, and you never stop paying long enough to see whether the membership was conditional at all. Being needed is the proof that you still belong inside, so a week in which nothing is asked of you reads as the start of being dropped. What makes the paying compulsory is a private certainty that unearned belonging is real elsewhere and simply not on offer in your case. You drew this arrangement up yourself, and you enforce it on yourself more strictly than anybody would think to ask."
          },
          {
            "label": "RECEIVE AND STOP THERE",
            "text": "Ask one of your people for something you need this week, an evening, a lift, help with a job, and let them do it. Do not cook for them afterwards, do not send anything, and do not find a way to make it even by Sunday. Sit with whatever discomfort turns up in the days after and leave it there rather than working it off."
          }
        ]
      },
      "7": {
        "title": "Soul Urge 7 — You Crave Real Understanding",
        "fields": [
          {
            "label": "STILL ON THE QUESTION",
            "text": "Understanding something properly, yourself or another person or whatever is actually true under the surface of a situation, is a hunger rather than a hobby. It has real appetite behind it, and an unanswered question of the right kind keeps you up the way nothing else does. You stay on a problem for months after the sensible move is to call it settled and get on with your life. Because you built the answer yourself it survives being tested, while conclusions taken from somewhere else fall over the first time real pressure arrives. You turn a question over long after the reward for doing so has stopped being obvious, and you come back with something genuinely yours."
          },
          {
            "label": "PRIVATE UNTIL COMPLETE",
            "text": "The searching happens alone, and what you find stays where you found it, so years of thinking end up reaching nobody at all. Depth that could have connected you to somebody becomes the reason you are hard to get to, and from outside the two look identical. Solitude gets filed as the honest price of thinking carefully, when a fair amount of it is a habit that has simply gone uninterrupted. Seriousness, for you, is measured by how complete a thing is before it leaves your head, so an unfinished idea spoken aloud registers as a drop in rank. What you will not risk is discovering that understanding you are quietly proud of sounds thinner in the open than it does inside your own head. So it stays in your head, untried, and the pride and the doubt keep growing on the same unopened material."
          },
          {
            "label": "SAY IT HALF-FINISHED",
            "text": "Pick something you are still working out and say it to a specific person this week, out loud, with the gaps named as gaps. Choose somebody who will actually argue with it rather than the safest listener available, and give them the draft you would ordinarily keep for yourself. Do it before you have tidied it, and add no summary that makes the thing sound more settled than it is. Say the unfinished part first, so that it cannot be quietly dropped off the end."
          }
        ]
      },
      "8": {
        "title": "Soul Urge 8 — You Crave Real Impact",
        "fields": [
          {
            "label": "EFFECT YOU CANNOT DISMISS",
            "text": "Mattering at a size you cannot argue yourself out of is what you are actually after, and small private wins do not touch it. The question underneath is rawer than ambition: whether your existence has registered anywhere beyond your own thinking, in a form solid enough to name. You take on work at a scale most never attempt, because a smaller answer would not settle the question and you know that before you begin. You aim at the size of thing that outruns your own ability to dismiss it, and then you go and build it."
          },
          {
            "label": "THE NEXT ONE ALREADY",
            "text": "Achievement is how you keep proving you are allowed to be here, and the proof expires almost as quickly as you earn it. A finished thing buys about a week of relief before the question returns with a larger number attached, so the next build is underway before the last one has been enjoyed. Your worth is priced in output, plainly and without negotiation, which is why a quiet month lands on you as a verdict instead of a month. The calculation you avoid is what would actually be enough, since a specific answer might show that no figure ever closes it. So the number stays vague, and that vagueness is the only thing keeping the whole effort from ever being examined. You run on relief that has gone by the time you notice you earned it."
          },
          {
            "label": "WRITE THE ACTUAL SIZE",
            "text": "Write down the specific figure, or the specific piece of work, that would count as enough, this week, as a number rather than a direction. Say it out loud to somebody, so that it exists outside your own head where you cannot quietly revise it upward. Put today's date on the page and keep it where it will turn up again in a month."
          }
        ]
      },
      "9": {
        "title": "Soul Urge 9 — You Crave to Give Something That Matters",
        "fields": [
          {
            "label": "DONE, NOT MEANT WELL",
            "text": "Care counts for you only when the situation is actually better afterwards, not when you meant well while you were inside it. Your attention does not stop at your own household; need registers on you at a range most have learned to filter out. Noticing it produces something closer to a summons than a passing sympathy, and it does not switch off when the news moves on. Where most stop at intending to help, you turn up, repeatedly, over months, for situations you could have walked past without a word. You hold the difference between what would be nice and what would genuinely change things, and you spend your effort on the second. You carry other households' problems as though they sat on your own list, and you clear them."
          },
          {
            "label": "PAST YOUR OWN SUPPLY",
            "text": "You give long after there is anything left, carried by an obligation that outruns whatever you actually have to spend. Help that was meant to improve something turns into a slow drain, and its quality drops while its quantity stays high. Answering need is what makes a day count for you, so an evening spent on yourself has to be justified before any of it can be enjoyed. Stopping long enough to take something in feels like a small betrayal of everybody still waiting, so you do not stop, and the depletion goes unnamed because naming it sounds like self-pity. Under the obligation is a suspicion that a version of you who gives nothing has nothing left that counts, and you would rather run empty than find out."
          },
          {
            "label": "ASK FOR ONE THING",
            "text": "Identify something you need and ask a specific person for it directly this week, without adding a reason they should not bother. Take it without turning the conversation back toward whatever they need, and stay on your own request until it is finished. Spend an hour before the week ends on something purely for you, with nothing produced by it and no second purpose attached. Put the need in writing afterwards, so that the next request does not have to be built from nothing."
          }
        ]
      },
      "11": {
        "title": "Master Soul Urge 11 — You Crave to Illuminate Something",
        "fields": [
          {
            "label": "TRUE IS NOT ENOUGH",
            "text": "Seeing something clearly is only part of what you want; the rest is for it to arrive somewhere and change how a situation is being handled. When a true thing comes into focus, the pull to say it is close to physical, and holding it in costs you genuine effort. Being right on its own does very little for you, since an accurate read that never leaves you changes nothing about the situation. You put what you see into a form that can actually be taken in, which is a separate skill from having seen it. The good version of that does not add information so much as move the person holding the problem. You take something you have noticed and hand it over in words that shift how somebody sees their own situation."
          },
          {
            "label": "PUSHED UNTIL IT PRESSES",
            "text": "Everyone has to see exactly what you see, on your timing, so a person not ready yet becomes an obstacle rather than somebody moving at their own pace. The intensity is entirely well meant and it arrives as pressure, which turns the conversation into something to be got out of. An insight counts as real to you only once it has been received, so your sense of having anything worth saying rises and falls with whether the last one landed. What powers the pushing is the thought that an insight nobody took was never there at all, that the seeing itself was imagined. So you press harder, and pressing is what makes the thing easier to refuse, which you read as proof that you should press harder still. The move that would settle it, offering once and leaving it alone, is the one your fear will not permit."
          },
          {
            "label": "OFFER IT ONCE",
            "text": "Say the clearest thing you can see to somebody once, this week, and then stop talking about it entirely. Give no second version, no better wording and no follow-up message that evening dressed up as something else. Let the week end with the thing unrepeated, and keep your attention on your own work rather than on signs that it took."
          }
        ]
      },
      "22": {
        "title": "Master Soul Urge 22 — You Crave to Build Something Lasting",
        "fields": [
          {
            "label": "BUILT TO OUTLAST YOU",
            "text": "Leaving something standing after you is not an ambition you picked up along the way, it is closer to a condition of being able to settle at all. Real proof that you were here, at a size that outlives the year it was made in, is what the work is quietly for. It has organised more of your life than you consciously decided: the jobs taken, the hours kept, the things declined without much argument. Sustained effort across years is genuinely available to you, and the dull middle of a long build does not put you off the way it ends most attempts. You hold one piece of work steady for a decade and get it to the size it needs to be."
          },
          {
            "label": "NEVER YET BIG ENOUGH",
            "text": "Nothing you finish reaches the size that would let you stop, and the target moves outward every time you close on it. A milestone that should have paid out arrives, gives you an afternoon, then shows you the larger version behind it, which has become the new baseline by morning. Scale is the unit your own worth gets counted in, so a solid finished thing at ordinary size barely registers when you look over what you have done. You will not call anything enough because the moment you did, the building would be over and you would be left with whatever you had, permanently. So the size stays undefined, which keeps it safe from ever being met, and the working continues toward an ending that was never given a shape. The satisfaction that belongs to a finished build gets spent, in advance, on the next one. Each build closes with you already inside the following one, so no finished thing gets stood in for even a day."
          },
          {
            "label": "DECLARE ONE THING DONE",
            "text": "Settle on something you have already built and declare it finished this month, in writing, with the date of the declaration on it. Do not add a stage, a second version or a final round of improvements before you put your name to it as complete. Leave it alone for the thirty days that follow, and put the effort you would otherwise pour into extending it somewhere unrelated. Tell one person that it is done, using that word, rather than describing what you might still do to it. Read the declaration again once that month is over, on the date you wrote."
          }
        ]
      },
      "33": {
        "title": "Master Soul Urge 33 — You Crave to Heal Something",
        "fields": [
          {
            "label": "PAIN HELD, NOT HURRIED",
            "text": "Repair is what your care is for: a person put back together, a wound closed, a pattern broken long before you arrived finally stopping with you. Healing is not a pleasant idea you hold at a distance; it runs as a private mission underneath ordinary days and decides more than you admit. It shapes who you move toward, what you will put up with, and which rooms you will stay in when everybody sensible has gone. You sit with somebody in real pain without hurrying them through it, and you keep your attention steady across the stretch where nothing is improving."
          },
          {
            "label": "NO REST UNTIL FIXED",
            "text": "Rest is not available while somebody within reach is still broken, so it never quite arrives, because somebody always is. The mission attaches itself to whoever is nearest, including strangers and colleagues who have not asked for it and do not want it. Your own peace is held as conditional on other people's recovery, which hands the state of your inner life to whichever person nearby is doing worst. Mending is what gives a day its point, so seven days with nothing to fix leave you unsettled instead of rested. The possibility you keep away from is that with the mission switched off there would be nobody home, that fixing isn't a task you perform but the whole of what you are. And the repair you most need is the one you cannot perform on yourself, which is the arrangement that keeps you permanently busy elsewhere."
          },
          {
            "label": "LEAVE ONE THING UNFIXED",
            "text": "Pick one situation you would normally step into and stay out of it for a full week, including the moment the obvious fix occurs to you. Tell nobody that you are doing it, so that the restraint does not become another kind of helping. Keep a line each evening about what was hardest to hold off, written for yourself and read by nobody. Use the hour you would have given the repair on something with nothing in it for anybody but you."
          }
        ]
      }
    }
  };
  window.DSoulUrgeContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DPersonalityContent — 12 records
(function () {
  const prev = window.DPersonalityContent;
  const T = {
    "data": {
      "1": {
        "title": "Personality 1 — You Come Across as Confident",
        "fields": [
          {
            "label": "READ CAPABLE ON SIGHT",
            "text": "Decisiveness shows in how you hold yourself, and it registers with other people well before you have said anything of substance. Your bearing does the work of an introduction, so the assumption that you know your business arrives ahead of any proof. That assumption runs in your favour through the whole opening stretch of a situation, which is an advantage rather than luck. A room arranges itself around where you stand, which never requires you to claim the position out loud. You set the terms of a new situation by walking in and behaving as though the matter is already settled."
          },
          {
            "label": "CERTAINTY WITH NO DOOR",
            "text": "The cost is that you land as unapproachable, and nobody comes toward a surface that looks like it needs no help. Warmth is in there and it goes unseen, because nothing in those first minutes signals that reaching for it would be welcome. You also hold the certainty in place under pressure, refusing the words that would let anybody watch you work something out. Your footing with yourself rests on reading as the person who already has the answer, so an unsure moment costs far more than it should. You expect that one visible gap would strip the authority away in a single moment and leave nothing underneath holding it up. That guard costs you the ordinary, unimportant closeness that would show anybody you are easier to reach than you look."
          },
          {
            "label": "ONE UNSURE SENTENCE",
            "text": "Pick a conversation this week where you genuinely do not know the answer, and say so in the moment rather than afterwards. Use the plain words, I am not sure yet, and add no explanation afterwards that repairs the impression. Do it early in the exchange, before you have established that you are on top of the matter. Note that evening what happened in your body during the seconds after you said it."
          }
        ]
      },
      "2": {
        "title": "Personality 2 — You Come Across as Gentle",
        "fields": [
          {
            "label": "DISCLOSURE COMES EARLY",
            "text": "Ease arrives with you into a room, and a stranger works out within a minute that nothing said here will be judged. People tell you things at a speed they would not manage with somebody they had already known for a season. The calm is not a technique you assembled; it is how you are built and how you sit with another person. You dissolve the guard most people carry into a new conversation, and you do it before either of you has warmed up."
          },
          {
            "label": "SOFT DELIVERY, FIRM VIEW",
            "text": "Softness of delivery gets taken for softness of opinion, so your positions land as suggestions anybody is free to overwrite. You hold real views with real force, and they arrive without a trace of that force attached to them. The second half of the pattern is that you let a decision go the wrong way rather than sharpen your tone to stop it. You bank your value on how untroubled other people are near you, so friction of any kind reads as damage you caused. The dread is that a single firm sentence would end the ease permanently and leave you as somebody nobody relaxes around. You keep the delivery mild, and the strength of what you think stays invisible to everyone in the room. You then re-run the conversation later on, editing what you said into the version that carried the weight you actually had."
          },
          {
            "label": "ONE OPINION UNSOFTENED",
            "text": "Say one clear opinion out loud tomorrow, inside the first few minutes, using a flat declarative instead of a question. Leave off the softeners at both ends: no maybe at the front, no wondering aloud at the back. Keep the position in place for the remainder of that conversation, even if the room goes quiet for a beat."
          }
        ]
      },
      "3": {
        "title": "Personality 3 — You Come Across as Magnetic",
        "fields": [
          {
            "label": "THE PULL ARRIVES FIRST",
            "text": "Aliveness is the first thing anybody registers about you, and a room turns toward it before you have earned a single thing. Most people work for that kind of draw and assemble it deliberately over years, and it simply came with you. Doors open ahead of you on nothing more than an impression, which shortens the distance to almost everything you want. You are vivid inside ten minutes, and ordinary friendliness never manages it however hard anybody tries. You draw attention without spending anything to get it, and you keep drawing it in every new room you enter."
          },
          {
            "label": "ENTERTAINING, NOT KNOWN",
            "text": "Charm this strong overshadows whatever sits behind it, so your substance goes unnoticed while the surface is busy being engaging. You reach for the joke at exactly the moment a serious thought would have landed, and the moment closes over. Somebody can finish an hour with you thoroughly entertained and still leave without a single thing you believe. You price your value by how much life you bring into a room, which makes any flat stretch land as a personal failure. Under all of it you expect that depth would slow the draw down, and that whatever remained would not hold anyone. So the surface stays bright and you pay for it by not being taken seriously during the hour that decides things."
          },
          {
            "label": "ONE SERIOUS THOUGHT, PLAIN",
            "text": "Choose an exchange in the next five days and put one thought you actually hold into it, undecorated and unexplained. Say it near the start, while the talk is still light, rather than saving it until things have turned serious. Resist the reflex to close with a joke, and let the sentence sit there on its own. Notice what you do with your hands in the four or five seconds afterwards."
          }
        ]
      },
      "4": {
        "title": "Personality 4 — You Come Across as Solid",
        "fields": [
          {
            "label": "TRUSTED BEFORE TESTED",
            "text": "Dependability reads off you immediately, so your word gets treated as good before there has been any chance to test it. Responsibility lands in your hands on a timeline usually reserved for somebody with years of history behind them. The steadiness registers as real because it is real, not because you have practised looking like a safe pair of hands. You carry weight that other people put down, and you carry it without the checking that most arrangements need."
          },
          {
            "label": "RELIABLE AND UNPLAYED",
            "text": "Steadiness this visible gets mistaken for a missing sense of humour, and your actual range never comes up at all. You meet a new person in a formal register and stay there, even when something lighter would have been just as true. Being counted on is where you locate your own value, so anything unserious registers as a threat to that whole standing. You half expect that one playful remark would announce the reliability as a performance and stop anybody leaning on it. The formality holds in both directions, and the lighter half of you stays out of every early exchange you have."
          },
          {
            "label": "ONE LIGHT REMARK",
            "text": "Let one genuinely funny thing out of your mouth during a first meeting this week, not a polite line that fills a gap. Aim for something you would say to somebody you know well, at the point where the talk would normally stay flat. Do not follow it with a serious remark that restores the balance."
          }
        ]
      },
      "5": {
        "title": "Personality 5 — You Come Across as Exciting",
        "fields": [
          {
            "label": "UNPREDICTABLE ON ARRIVAL",
            "text": "Spontaneity comes through in how you talk about ordinary things, and a stranger reads your life as unpredictable in the good sense. Curiosity builds around what you might do next, and it holds up over months because you keep producing something genuinely new. Flat stretches that would normally end a conversation stay alive around you, since you keep finding another angle into them. The interest is not a performance you maintain; you actually want to know what happens next, every time. You make an ordinary Tuesday feel like it might turn into something, and you manage that without arranging anything in advance."
          },
          {
            "label": "LOYAL AND UNBELIEVED",
            "text": "Excitement takes up the entire first impression, and the commitments you have kept for years sit behind it unmentioned. You get treated as a poor bet for anything requiring you to show up repeatedly over a long stretch of time. You also leave the steady parts of your life out of the telling on purpose, because they sound dull in your own mouth. Your value registers to you through how interesting you are at any given moment, so a season of routine feels like decline. The worry underneath is that steadiness would make you ordinary, and that ordinary is the one condition nothing recovers from. The loyalty stays hidden, and it costs you exactly the sort of reliance that would actually suit you. You drop the long history from your own account of yourself as well, until you half believe the light version too."
          },
          {
            "label": "NAME THE LONG THING",
            "text": "Name one commitment you have held for years out loud during a talk with a stranger this week, straight, not as a throwaway. Give it a number, how long it has run, and do not chase it with a joke. Do it in the opening stretch rather than once the conversation has already turned serious."
          }
        ]
      },
      "6": {
        "title": "Personality 6 — You Come Across as Warm",
        "fields": [
          {
            "label": "CARE LANDS IMMEDIATELY",
            "text": "Care shows within minutes of meeting somebody, and it is plain that you already want things to go well for them. That puts a new person at ease faster than almost anything else available inside a short first exchange. The warmth is not switched on for effect, and it runs at the same level whether or not there is anything to gain. You notice what somebody needs before they have worked out how to ask for it themselves. Ordinary exchanges leave people steadier than they were, and none of that costs you any visible effort. You make a stranger feel looked after inside ten minutes, using nothing but attention and the way you ask a question."
          },
          {
            "label": "LEANED ON BY DEFAULT",
            "text": "Warmth that open invites weight, and people put more onto you than you ever agreed to carry for them. You take the extra load in silence, because refusing it early would interrupt the very thing that made them comfortable. The other expression is quieter: you keep offering after everything you had is already spent, and you call that generosity. Being needed is where you draw your self respect from, so a person who wants nothing from you leaves you unsettled. One stated limit would read to you as care being withdrawn, and the leaning has begun long before you signalled any capacity anyway."
          },
          {
            "label": "ONE LIMIT SAID EARLY",
            "text": "State one limit during the first hour of a new relationship this week, in plain words and beside the warmth rather than instead of it. Something small will do: what you cannot take on this month, or the hours when you do not answer messages. Say it once and do not spend the following two minutes explaining why it is reasonable. Choose the person before the conversation starts rather than deciding once you are already inside it. Keep the limit where you put it for the seven days afterwards."
          }
        ]
      },
      "7": {
        "title": "Personality 7 — You Come Across as Mysterious",
        "fields": [
          {
            "label": "SLOW TO OPEN",
            "text": "Reserve reads as depth rather than as emptiness, so a new person can tell there is more running than you are showing. Thoughtfulness is legible in you even when you say very little, which is unusual and does most of the early work. What you eventually hand over carries weight, partly because getting to it took patience from both sides. You keep your own counsel while a situation is still forming, and the reading you arrive at is better for the wait. You hold a room's curiosity without feeding it, and you decide yourself when any of it opens."
          },
          {
            "label": "THE WAIT FOR WARMTH",
            "text": "Distance is what gets recorded, and your genuine reserve gets filed as disinterest by anybody who has not stayed long. Warmth in you takes longer to become visible than it does in most people, and some of them stop looking before it appears. You also delay the first real disclosure past the moment where it would have been welcome, and then it never happens. The value you assign yourself sits in how much stays unspoken, so anything handed over quickly feels cheapened by the ease of it. Warmth offered before it was earned would look like a technique to you, and that possibility keeps the door shut. Trust never gets its chance to start, because the opening move belongs to you and you decline to make it."
          },
          {
            "label": "ONE EARLY DISCLOSURE",
            "text": "Offer something small and genuinely yours inside the first twenty minutes of a new interaction this week. Pick something real but cheap: what you were thinking about on the way there, or what you are reading now. Give it before the other person has done anything to earn it, and without explaining why you are telling them. Note afterwards how long you waited before you spoke."
          }
        ]
      },
      "8": {
        "title": "Personality 8 — You Come Across as Powerful",
        "fields": [
          {
            "label": "IN CHARGE WITHOUT TITLE",
            "text": "Command is legible in how you occupy space, and it needs no title or formal authority to register on anybody. Competence gets extended to you on sight, without the demonstration most people must give before anything is handed over. The credit is usually well placed, since you can generally do the thing that is being assumed of you. You take charge of a situation that has no leader yet, and nobody has to agree that you should."
          },
          {
            "label": "NOTHING FRAGILE COMES NEAR",
            "text": "Force of presence keeps the fragile things away, so nobody brings you a conversation with any real exposure in it. The care you have runs underneath and never surfaces early enough to change how you get approached. You also meet hardness with more hardness when a new meeting turns tense, which settles the matter and closes the room. You count yourself worth something in proportion to how much you can absorb without flinching, which makes softness expensive. You carry an expectation that a soft moment early would cost the authority permanently, so hardness stands in for the entire picture of you."
          },
          {
            "label": "ONE SOFT MOMENT SHOWN",
            "text": "Show one soft thing to a person you have just met this week, something you found difficult or something you are quietly pleased about. Say it in the same voice you use for everything else, without the small laugh that files it as unimportant. Do it early, ahead of any demonstration of what you can handle."
          }
        ]
      },
      "9": {
        "title": "Personality 9 — You Come Across as Generous",
        "fields": [
          {
            "label": "GOOD FAITH, GIVEN FIRST",
            "text": "Goodwill arrives early and unmistakably, and a stranger can tell in one short exchange that your concern reaches past your own interests. Openness of that kind draws out the guarded ones, and the warmth behind it does not thin once a first impression has worn off. You give a new person the benefit of the doubt before there is evidence either way, and you mean it. You extend good faith at a scale most people keep for a handful, and you go on extending it after being wrong about somebody."
          },
          {
            "label": "SHARP EYES, HIDDEN",
            "text": "Openness this wide reads as naivety, and the accuracy of your read on somebody never enters the conversation. You see a person clearly within minutes and then say the kind thing instead of the accurate one. How well you think of yourself depends on being the warm one in the room, so a sharp observation feels like a betrayal of that. You expect that showing what you actually see would contradict the openness and turn you into somebody guarded and unpleasant. The clarity stays private, and you get handled as easier to fool than you have ever been in your life. You carry the cost of being underestimated in exactly the situations where your read was the useful thing available. You defend that read privately and act on it in silence, so nothing you saw ever becomes usable between the two of you."
          },
          {
            "label": "ONE ACCURATE OBSERVATION",
            "text": "Speak one accurate observation about somebody out loud this week, early on and next to the warmth you would normally lead with. Choose something true and slightly uncomfortable rather than a compliment dressed up as insight. Say it plainly, and do not add the softening clause you can already hear yourself preparing."
          }
        ]
      },
      "11": {
        "title": "Master Personality 11 — You Come Across as Inspired",
        "fields": [
          {
            "label": "A DIFFERENT PACE ENTIRELY",
            "text": "Intensity comes off you immediately, and a new person feels it before there is any content to explain it by. You run at a different rate than the conversation around you, and it shows in how fast you reach the real subject. The impression you leave is specific and hard to put words around, which almost nothing else about a new meeting achieves. Doors open because of that intensity, which a measured and agreeable arrival would never have reached at all. Discomfort in a room does not deflect you, and you keep going at your own rate straight through it. You take an exchange past small talk inside two or three sentences, without waiting for permission to do it."
          },
          {
            "label": "TOO FAST TO JOIN",
            "text": "Pace is the problem, since whatever makes you memorable also leaves a new person nothing to hold while they catch up. You arrive at full strength and stay there, and the adjustment period most people need never gets offered to them. The electricity is what you understand your own value to consist of, so a slower version of yourself reads as diminished. You suspect that easing off would take the whole thing with it and leave behind somebody entirely ordinary. The withdrawal therefore happens early, before anybody has had the time your intensity actually requires of them. You then read that withdrawal as proof that the intensity is the only thing holding anybody there at all."
          },
          {
            "label": "ENTER AT HALF SPEED",
            "text": "Halve your pace in one first encounter this week, and hold that rate for the opening ten minutes of it. Ask a plain question and wait through the entire answer before adding the thing you already want to say. Keep your sentences shorter than they want to be, and leave the gaps you would normally fill. Pick the specific meeting in advance rather than waiting to see which one seems suitable."
          }
        ]
      },
      "22": {
        "title": "Master Personality 22 — You Come Across as Capable",
        "fields": [
          {
            "label": "BUILT WHAT OTHERS DISCUSS",
            "text": "Competence is obvious in you at the practical level, so people hand you the thing everybody else is still theorising about. Responsibility arrives on a first meeting at a size normally kept back for somebody with a long record behind them. The confidence is well placed, because you generally can carry whatever gets handed across to you. You work at the scale of the finished object rather than the plan for it, which is why plans stop mattering around you. You turn a discussion about what should exist into a schedule for building it, usually within the same sitting."
          },
          {
            "label": "ASSUMED TO NEED NOTHING",
            "text": "Capability read as limitless keeps help away, because nobody offers a hand to somebody who visibly does not require one. You are also the one who never asks, so half of the isolation is built out of your own silence. Your limits exist and they go unsaid, which means the load keeps arriving at precisely the same rate it always did. What you have to show for yourself is the entire basis of how you regard yourself, so an admitted ceiling costs more than the work ever did. You expect that naming that ceiling would end your standing for handling anything, so the reputation does the isolating while you quietly do more than you can."
          },
          {
            "label": "ADMIT THE CEILING",
            "text": "Admit one real limit at the opening of a talk with somebody new this week, without the workaround plan attached. Use a flat sentence, this part is beyond what I can do right now, and then stop. Choose something that actually costs you to say rather than a limit you were happy enough to concede anyway. Do it before the meeting has established what you are good for."
          }
        ]
      },
      "33": {
        "title": "Master Personality 33 — You Come Across as Deeply Caring",
        "fields": [
          {
            "label": "SAFE ON FIRST CONTACT",
            "text": "Safety builds fast around you, so somebody brings a real problem into a conversation that has barely got started. Presence, kindness and discretion are all readable in you together, and that combination usually takes years to establish. What gets told to you is held properly, and the speed of the trust is warranted rather than reckless. You listen without assembling your answer underneath, and the difference is audible to whoever is talking. Nothing about the care is a technique, since it is how you are with people you have known ten minutes. You take on somebody's real trouble on the day you meet them, and you ask for nothing back against it."
          },
          {
            "label": "AVAILABLE WITHOUT END",
            "text": "Availability appears unlimited, so the leaning that comes toward you is sized against a supply that does not exist. You keep receiving after your own capacity has run out, and the moment where you should have stopped goes unmarked. The second expression is that your needs never enter a new relationship, so the traffic only ever runs one way. Holding what others cannot hold is the job you take yourself to have, which makes asking for anything feel disqualifying. The fear sitting under it is that a stated need would break the safety you offer and make you another person making demands. You end up quietly overextended by exactly the warmth that made the whole arrangement work in the beginning."
          },
          {
            "label": "ONE NEED, SPOKEN FIRST",
            "text": "Tell one person something you need during an early conversation this week, alongside the care you are already giving them. Keep it ordinary and specific: an hour of time, a straight answer, a call moved to a different day. Use the same tone you take when you ask what somebody else needs. Do not attach a reason that makes the need smaller than it is. Do it inside the first half of that conversation rather than at the very end."
          }
        ]
      }
    }
  };
  window.DPersonalityContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();

// DMaturityContent — 12 records
(function () {
  const prev = window.DMaturityContent;
  const T = {
    "data": {
      "1": {
        "title": "Maturity 1 — Becoming Genuinely Self-Directed",
        "fields": [
          {
            "label": "AUTHORITY THAT RESTS",
            "text": "Authority over your own life has stopped being an argument you win and settled into the plain shape of how you live. The direction you chose is no longer a position held against anything, and because you are not braced, the people around you can take real decisions without that registering as a loss. You no longer need your fingerprints visible on a choice to feel secure that the choice was yours. You run your own life at a volume low enough that no one needs defeating for it to be true."
          },
          {
            "label": "GUARD NEVER STOOD DOWN",
            "text": "Nobody has come for your independence in a long stretch, and you are still standing over it with exactly the same readiness. One expression is the answer you have prepared before anybody has actually questioned you, and the other is the closeness you spend on somebody who was only ever asking. Your worth runs on the fact that nothing about this life was handed to you, and that none of it can be taken back. Underneath sits a certainty that the defending is the single reason the authority remains yours at all. So the cost of protection gets paid, year after year, against a challenge that stopped arriving."
          },
          {
            "label": "RUN IT UNEXPLAINED",
            "text": "Make one decision that is genuinely yours this month without circulating the reasoning to anybody first. When the urge arrives to set out why it was the right call, hold the explanation back and let the decision stand unaccompanied. Write down that evening the name of whoever you were about to justify yourself to."
          }
        ]
      },
      "2": {
        "title": "Maturity 2 — Becoming Genuinely Balanced",
        "fields": [
          {
            "label": "CLOSE AND STILL INTACT",
            "text": "Closeness no longer costs you your own voice, and that is the whole difference between the partnership you have now and the one you used to survive. You can be entirely present with somebody and still know, throughout, what you actually think about the thing being discussed. The cooperation you build holds two complete people rather than one person and one long accommodation. Agreement, when you reach it, is genuine agreement instead of the sound of you going quiet. You stay yourself right through the parts of a relationship that used to require dissolving."
          },
          {
            "label": "SMOOTHING PAST THE NEED",
            "text": "Adjusting for everybody else's comfort still happens automatically, long after the balance stopped depending on you doing it. It shows up as the preference you edit out before saying it, and again as the arrangement you accept while privately rebuilding your week around it. The reflex is old enough that it fires before you have registered having a preference at all. You gauge yourself by how even-keeled things remain wherever you are, and you sense that evenness the way someone else senses a pulse. Below it runs a suspicion that naming what you want would tip over the arrangement you spent years constructing. So the accommodating continues, and you stay the least demanding person in every room you are part of."
          },
          {
            "label": "SAY THE PREFERENCE",
            "text": "Choose one arrangement in the next ten days that you would usually leave to whatever suits everybody else, and state what you actually want instead. Say it once, plainly, without the reassuring clause you usually add at the end. Let the request sit there unmanaged while the conversation carries on around it. Do not return to the subject later with an offer to swap back."
          }
        ]
      },
      "3": {
        "title": "Maturity 3 — Becoming Genuinely Expressive",
        "fields": [
          {
            "label": "SUBSTANCE ALLOWED THROUGH",
            "text": "Substance and lightness now live in the same piece of work, and you no longer trade one away to get the other made. What you make can be serious without becoming heavy and funny without becoming small, because both registers genuinely belong to you. The performance is still available, but it has stopped being the toll you pay before anything real is allowed out. You know the difference now between warming a room and actually telling it something. Nothing you make has to earn its way past scrutiny by being charming first. You send the serious work out whole, with no joke attached to soften the landing."
          },
          {
            "label": "CHARM DOING OLD WORK",
            "text": "Charm still arrives first and does the job that the material underneath is more than ready to do by itself. One version is the joke dropped just before the serious sentence lands, and the other is the finished piece you describe casually rather than simply showing to somebody. The joke lands, the moment passes, and the sentence you meant to say goes unsaid. You are fluent enough at this that it happens without a decision being made anywhere. Your worth sits in being able to make any gathering easy, which is a genuine skill and a very good place to hide. Underneath it runs a doubt that the material, stripped of the delivery, would not be enough to carry the moment on its own. So the deeper work stays half-shown to a room that would have taken it seriously."
          },
          {
            "label": "NO PUNCHLINE ATTACHED",
            "text": "Take the most serious thing you have made recently and show it to somebody this week exactly as it stands. Say what it is in one flat sentence and then stop, without the self-deprecating line you would normally attach to cover the handover. Choose the person whose opinion you would find hardest to sit with afterwards. Do it while the safer, second draft is still unwritten. Leave the original where it is while you wait."
          }
        ]
      },
      "4": {
        "title": "Maturity 4 — Becoming Genuinely Grounded",
        "fields": [
          {
            "label": "SOLID AND STILL LIVEABLE",
            "text": "Stability is something you live inside now, not something enforced hourly against everybody's small deviations from the plan. The structures you build have enough room in them that other people can move about without knocking anything over. Somebody can bring you a changed arrangement and watch you take it in, which differs entirely from watching you absorb it politely. You take a change on the morning it arrives and keep the whole shape of your life steady around it."
          },
          {
            "label": "CHANGE FILED AS DANGER",
            "text": "Flexibility still registers somewhere in you as a failure of the structure, even where the structure would barely notice the movement. It comes out as the plan you defend past the point of caring about it, and as the irritation that arrives before you have heard what the change actually is. You count yourself worth something for being the fixed point, the one arrangement in anybody's life that does not move. Under that lies the dread of one shift starting everything shifting, with nothing available to halt it. You spend real effort holding a line that would cost you almost nothing to move."
          },
          {
            "label": "TAKE THE NEW PLAN",
            "text": "Say yes to one changed plan this month at the moment it is proposed, without negotiating it back toward the original version. Do not rebuild the rest of your week around absorbing it, and leave the disruption where it falls. Note down in writing what you were protecting when the first flush of resistance arrived."
          }
        ]
      },
      "5": {
        "title": "Maturity 5 — Becoming Genuinely Free",
        "fields": [
          {
            "label": "FREE INSIDE A COMMITMENT",
            "text": "Freedom is a thing you choose now, rather than a reflex firing at anything that resembles being committed to something. Staying somewhere has stopped feeling like a door closing, so you can be fully in a thing and still be entirely loose inside it. That kind of freedom survives contact with a mortgage, a partnership or a long project, which restless motion could never do. You can leave for a reason instead of leaving because leaving is the move you know best. You commit to something in full and keep every bit of the liberty you were protecting by running."
          },
          {
            "label": "LEAVING AS PROOF",
            "text": "Restlessness still passes itself off as freedom, and the old reflex to go fires whether or not anything is left to escape. You see it in the good arrangement you exit at the first dull month, and in the second option you keep warm so that nothing is ever fully chosen. Both moves feel like appetite from the inside, which is why neither has been examined. You rate yourself by how little can hold you, by knowing you could be gone on Friday with nothing collapsing behind you. The thought you avoid is that staying would show the freedom to have been nothing but distance. So you buy evidence, again and again, for something you already have and have had for years."
          },
          {
            "label": "CHOOSE THE STAYING",
            "text": "Name something you are currently inside and commit to it out loud for the next ninety days, with the end date written down somewhere. Take the exit you keep half-open and close it for that period, including the one you keep only in your head. Do the closing this week rather than the next time the pull to go arrives. Tell one person the length of the commitment so the number stops being adjustable."
          }
        ]
      },
      "6": {
        "title": "Maturity 6 — Becoming Genuinely Nurturing",
        "fields": [
          {
            "label": "CARE WITHOUT STEERING",
            "text": "Care no longer arrives attached to a plan for how the person receiving it ought to use their life. You can love somebody and leave the decisions entirely with them, including the ones you can already see going badly. The people closest to you get to live their actual lives rather than a version you have quietly curated in advance. Supervision and care feel nothing alike from the inside, and the difference registers on somebody within minutes. Trust is now the form your caring takes rather than the reward it offers once things go well. You give people the whole of your care and none of the instructions."
          },
          {
            "label": "MANAGING THE OUTCOME",
            "text": "Steering still happens underneath the caring, long after everybody involved stopped needing anybody to steer for them. One form is the advice that arrives before it was asked for, and the other is the arrangement you make quietly so that a harder result never reaches them at all. Neither move announces itself, because both are done with real love and at real cost to you. Things going well around you is the evidence you use on yourself, and decades of it have accumulated. Deeper down is the worry that releasing the outcome would show the caring to have been fairly ordinary all along. So you intervene in situations that were already being handled and file the intervention under love. The people involved feel the management long before they can name what it is."
          },
          {
            "label": "STAY OUT OF IT",
            "text": "Select one situation belonging to somebody you love where the mistake is already visible to you, and stay out of it for a fortnight. Say nothing, arrange nothing behind the scenes, and skip the leading question you would otherwise deploy to steer them back. Note what you wanted to do and keep the note until the fortnight is up. Read your own handwriting on day fourteen before deciding anything further. Leave their part of it entirely alone in the meantime."
          }
        ]
      },
      "7": {
        "title": "Maturity 7 — Becoming Genuinely Wise",
        "fields": [
          {
            "label": "UNDERSTANDING WORTH HANDING OVER",
            "text": "Understanding you worked out alone over years has become something other people could genuinely use, and it no longer needs privacy to feel safe. You can put a hard-won idea into plain language without feeling that the language has thinned it. Saying it does not spend it, because depth is not a limited quantity that leaks the moment you open the door. You hand over the thing you understand and keep every part of it yourself."
          },
          {
            "label": "KEPT BACK BY DEFAULT",
            "text": "Depth still stays in, by reflex, at exactly the moments it would be worth most to whoever is sitting opposite. It appears as the answer you shorten into something harmless, and as a decade of thinking compressed into a shrug. Knowing more than you say is where your worth is stored, which kept you safe and left the knowing entirely unused. What sits below is the prospect of that understanding examined in daylight, under a scrutiny privacy never had to survive. So the thing you spent years building reaches nobody at all, and you call the whole arrangement discretion."
          },
          {
            "label": "THE UNCUT VERSION",
            "text": "Find one person this month who could actually use something you understand, and give them the long version instead of the summary. Take twenty minutes over it, including the part you usually cut out because it sounds too involved to say aloud. Send it, or say it, without first deciding whether they have earned the whole thing."
          }
        ]
      },
      "8": {
        "title": "Maturity 8 — Becoming Genuinely Powerful",
        "fields": [
          {
            "label": "WEIGHT WITHOUT A TALLY",
            "text": "Power has settled into something you carry, not something manufactured fresh each week out of visible results. The authority is in how you handle a difficult room and a difficult decision, not in the list of what got produced. You are the same size on a slow Tuesday as on the day a large piece of work finally lands. Command sits easily enough on you now that it has stopped needing any announcement. You hold real weight in situations without producing a single thing to justify being there."
          },
          {
            "label": "NOTHING MADE TODAY",
            "text": "Output is still the only figure you actually count, and a day that produces nothing visible lands as a day you were nothing. There is the evening rescued with an hour of pointless work, and there is the rest you permit yourself only once something finished can be indicated. You price yourself by a running count of what got made, held in your head and updated hourly. A quiet week registers as a slow decline instead of as a quiet week. Further down there is dread of an unproductive stretch showing the standing was never secure, only recently purchased. So you go on paying for it daily, at a rate you long ago stopped noticing."
          },
          {
            "label": "TAKE THE SLOW DAY",
            "text": "Take one working day across the next two weeks and produce nothing on it that anybody would notice afterwards. Do not tidy the decks beforehand, and do not make up the ground next morning with a longer stretch than usual. Say to one person, in plain words, that you took the whole day and made nothing. Add no explanation of what the day was for."
          }
        ]
      },
      "9": {
        "title": "Maturity 9 — Becoming Genuinely Generous",
        "fields": [
          {
            "label": "GENEROSITY WITH A FLOOR",
            "text": "Generosity has stopped being something you fund by taking it directly out of yourself, and that is why there is more of it now. What you give away is not quietly costing you sleep, money, or the parts of the week you actually needed. Because it does not deplete you, the giving lasts across years instead of arriving in bursts followed by a long withdrawal. Somebody receives a whole thing from you, not the remains of a person who gave everything away by Thursday. The care reaches further than your own household and still leaves the household standing. You look after the wider world and count yourself among the people that care is meant to reach."
          },
          {
            "label": "FUNDED BY DEPLETION",
            "text": "Giving until nothing remains still runs automatically, even where the cost buys nobody anything they particularly wanted. One side of it is the help you offer while already overextended, and the other is a need of your own postponed until it quietly stopped counting as one. Both feel like virtue while they are happening, which is what keeps either from being questioned. You judge yourself on how much can be carried for other people without any strain becoming visible on you. Beneath it all lies the possibility that holding something back would make the generosity ordinary, an exchange instead of devotion. So you continue to pay a price that a sustainable method would never require. The emptiness that follows gets treated as tiredness rather than as the bill for a method."
          },
          {
            "label": "ONE THING UNSHARED",
            "text": "Decide on one thing this month, an amount of money or an afternoon or a piece of what you own, and spend it entirely on yourself. Do not convert it into something that also serves somebody else, and do not mention to anybody what you are doing with it. Book it in for a specific date before the month is halfway through. Treat the date as immovable when the requests arrive. Keep whatever is left over rather than distributing it."
          }
        ]
      },
      "11": {
        "title": "Master Maturity 11 — Becoming Genuinely Grounded Vision",
        "fields": [
          {
            "label": "BUILT FROM THE VISION",
            "text": "Inspiration now comes with a route from the first sensing of a thing to the finished, existing version of it. You trust the crossing between what you glimpse and what you build, and the crossing has become a habit instead of a lucky day. What you complete carries both halves, the strangeness of the original insight and the weight of an object that genuinely works. You finish the inspired thing and let the finished version be the one that counts."
          },
          {
            "label": "SAFE IN THE IDEA",
            "text": "Staying inside the idea is still the more comfortable place, because nothing conceptual has ever gone wrong in front of anybody. It shows as the project described often and begun rarely, and as the version in your head that keeps being improved instead of made. Your worth is the quality of what you can see coming, which is real and has been right often enough to trust. Behind the postponing lies dread of a built version coming out smaller than the vision, with the smallness belonging to you. So the finishing gets postponed indefinitely by somebody who has already proven capable of finishing things."
          },
          {
            "label": "TAKE ONE IDEA OUT",
            "text": "Pick the smallest of the ideas you are carrying and take it to a finished state within three weeks. Build the version that fits the time available rather than the version that matches what you first saw. Put a date on the calendar now for the day it is done, and treat that date as fixed."
          }
        ]
      },
      "22": {
        "title": "Master Maturity 22 — Becoming Genuinely Sustainable Power",
        "fields": [
          {
            "label": "SCALE WITHOUT THE COST",
            "text": "Large things get built now at a rate your body can actually go on producing, and that is the change that makes the scale real. Pacing has stopped being a concession you make once you are already ill and become part of how the work is designed. What you build lasts because it was not assembled out of exhaustion and does not need exhaustion to keep standing. You are upright and undepleted at the finish, available for whatever is next rather than recovering from what just ended. You build things at a size most people cannot hold, and you come out of them intact."
          },
          {
            "label": "SLOWING READS AS LOSING",
            "text": "Rest still registers as a threat to the size of what you are building, and slowing down still lands as falling behind. It turns up in the day off you fill with a smaller project, and in the tiredness treated as a fact about your discipline. You value yourself by the load carried without needing relief, and that measure was set a very long while ago. Nothing about the current scale requires it, which is the part that never gets through. Underneath, you carry the sense that a genuine stop would expose the whole thing as something held up by force. So the pace continues, set by somebody who no longer has anything left to prove."
          },
          {
            "label": "ONE DAY, FULLY STOPPED",
            "text": "Book one full day off inside the next three weeks and leave the largest project untouched from waking until sleeping. Do not prepare by working late the night before, and do not settle the backlog the day after. Put the date in now, while nothing is urgent, and hold it the way you would hold a commitment made to somebody else. Tell no one that it is available if things get difficult."
          }
        ]
      },
      "33": {
        "title": "Master Maturity 33 — Becoming Genuinely Whole Service",
        "fields": [
          {
            "label": "SERVICE WITH A RETURN",
            "text": "Service has become something with traffic running both ways, so what you give is topped up rather than steadily drawn down. Being cared for is part of how you do the caring now, which is why there is more of it available than there used to be. The people you look after get to give something back, and the relationship deepens rather than merely continuing. You are not the fixed point everything flows outward from, and the exchange includes you like it includes everybody else. Devotion has stopped requiring that your own life go unattended to prove it was devotion. You let somebody carry part of you and go on giving at full strength."
          },
          {
            "label": "YOUR TURN COMES LAST",
            "text": "Your own needs still get handled after everybody else's, and the queue is arranged so that your turn never quite comes round. It shows first as the offer you deflect within seconds of it being made, and then as the difficulty you solve privately so that nobody has to carry a share. Both look like strength and both are habits, formed at a time when there was genuinely nobody to ask. Requiring nothing is where your self-respect is anchored, a position held so long it now feels like a personality rather than a choice. What you will not look at directly is that accepting care would downgrade devotion into an exchange, something owed instead of freely given. So the help sits unused while you go on covering ground nobody asked you to cover alone. What is on offer around you is considerably more than you have let yourself take."
          },
          {
            "label": "TAKE THE OFFER",
            "text": "Accept the next piece of help offered to you, within the week, without adding anything back to level the thing out. Say thank you and stop the sentence there, rather than turning the moment around into a question about them. Let the imbalance stand for at least a fortnight before doing anything that squares it. Notice which offer you nearly refused on reflex. Take that one."
          }
        ]
      }
    }
  };
  window.DMaturityContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();
