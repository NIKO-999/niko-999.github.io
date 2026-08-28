'use strict';
/*
 * career-paths-content.js — second-generation overlay.
 *
 * Layered on top of js/career-paths-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DCareerPathsContent — 22 records
(function () {
  const prev = window.DCareerPathsContent;
  const T = {
    "paths": {
      "1": {
        "title": "Money Moves Through Initiative and Leadership",
        "fields": [
          {
            "label": "STARTING IS THE SKILL",
            "text": "Beginning a thing before the conditions are settled is the part of you that earns. You move on an idea while it is still rough, and the roughness bothers you far less than it bothers everybody sitting around the same table. Running your own outfit, managing a project, selling, speaking to a room, coaching somebody through their business: the common thread is a moment where nothing happens until a person acts. You put the first step down and the whole situation starts moving behind it."
          },
          {
            "label": "A PILE OF STARTS",
            "text": "Starting is cheap for you and finishing is not, so there is a row of good beginnings behind you with the interesting part already taken out of them. The same drive shows up as taking charge of things nobody handed you, where you would rather run something badly than watch it sit still. The count of things you have set moving this quarter is the figure you check yourself against, which is why a quiet month feels like a verdict. Under that sits a fear of stillness itself, that if you stop there is nothing beneath the motion but a person waiting to be given a job. So you begin another thing on Monday and the fear goes quiet for roughly a week. Then it returns, slightly earlier than last time."
          },
          {
            "label": "FINISH THE OLDEST ONE",
            "text": "Go back to the oldest unfinished thing you began and carry it all the way to done before Sunday night. Do not restart it, do not improve the plan, and do not let a better idea take the hours this one needs. Give it two sittings of ninety minutes and treat the second sitting as the one that cannot move."
          }
        ]
      },
      "2": {
        "title": "Money Moves Through Depth and Quiet Perception",
        "fields": [
          {
            "label": "THE LAYER BELOW",
            "text": "Something in a situation registers with you well before the visible part of it makes any sense, and you go down after the cause instead of taking the surface at its word. Therapy and psychology, research, analysis, consulting, editing, the symbolic systems: those are all fields where depth itself is the product rather than a pleasant extra on top. You can sit with a half-formed pattern for weeks without forcing it into a shape, which is why the shape you arrive at holds weight later. Your accuracy comes out of that patience and not out of cleverness. Nothing you conclude arrives quickly, and nothing you conclude needs taking back afterwards. You reach the real reason a thing is happening while the agreed account of it is still being written."
          },
          {
            "label": "SEEN AND NEVER SAID",
            "text": "The read arrives whole and you keep it, so your sharpest thinking stays inside your own head where it costs nothing and earns nothing. The other face of the same habit is examining something long after it has stopped being useful, until the examining becomes the work and the conclusion never gets written down. You judge your own value by how accurately you see, so a shallow confident take from somebody careless lands as an insult to the one thing about yourself you are certain of. Being ordinary is the fear, not being disliked but ordinary, that if the depth turned out to be common you would hold nothing that was actually yours. So you go further down instead of speaking, and depth becomes the place you hide. None of it ever reaches anywhere it could be paid for."
          },
          {
            "label": "PRICE ONE READ",
            "text": "Take one situation you understood correctly in the last month and write the whole read out in plain sentences, stopping when it is legible rather than perfect. Give yourself ninety minutes on Thursday and send it to the person it concerns with a figure attached to it. Sending it while the last paragraph still bothers you is the part that matters here. Do not rewrite the opening more than once."
          }
        ]
      },
      "3": {
        "title": "Money Moves Through Creation and Nurturing Beauty",
        "fields": [
          {
            "label": "MADE, THEN TENDED",
            "text": "Making a thing and then keeping it alive afterwards are one job in your hands rather than two separate ones. Graphic, interior and fashion design, art direction, beauty work, content, ventures built for women: the money comes from an eye that catches the half-degree something is off by and a patience that stays with it once the exciting part has gone. You improve what is already there as readily as you start from nothing, and the improving is not a lesser form of the work. Neglect is visible to you as a specific condition rather than as general untidiness. Growth is the actual product, since something arrives in your hands unfinished or half-abandoned and leaves them better fed. You take a rough, workable, unlovely thing and make it worth looking at."
          },
          {
            "label": "NOTHING LEFT FOR YOURS",
            "text": "Attention flows outward automatically, so other work gets your eye and the project with your name on it keeps sliding to a week that never arrives. The same instinct turns into fussing, where you keep refining the surface of a thing that was ready a fortnight ago, because something still being improved cannot be called finished and judged. Being needed for your taste is what convinces you that you count, and taste is invisible, so the most valuable hours you spend are the least countable ones. The fear is plainness, that stripped of the beauty you bring into a room whatever remained of you would be unremarkable. Everything near you gets tended and the one piece that was yours stays half-made. So you go to bed tired and uncredited and you call that generosity."
          },
          {
            "label": "ONE THING WITH YOUR NAME",
            "text": "Set aside two hours on Saturday morning for a single piece of work that belongs to no one but you, and finish it in that one sitting. Keep it under the size that would let it turn into something you tend for a year. When it is finished, put it where your eye lands on it daily rather than storing it out of sight. Do not tidy anything else first."
          }
        ]
      },
      "4": {
        "title": "Money Moves Through Structure and Authority",
        "fields": [
          {
            "label": "THE WHOLE FRAME",
            "text": "Load that would flatten a normal week arrives and you sort it into parts, order them, and put somebody on each without the sorting costing you anything visible. Ownership, executive work, administration, running a department, government or corporate leadership, property development: each of those pays for a head that holds an entire structure and still knows what happens on Tuesday. You are more comfortable carrying the full weight than holding one piece of somebody else's plan, because the full weight is at least legible to you. You build the system you work inside instead of surviving in one that was handed to you."
          },
          {
            "label": "EVERY PART YOURS",
            "text": "Holding it all becomes holding it all yourself, and the structure quietly reorganises around the fact that only you know how it actually runs. The reverse shows up as rigidity, where a rule you wrote for conditions that ended two years ago still governs the place, and reopening it feels like weakness instead of maintenance. Control does the work reassurance would otherwise do, since as long as the whole shape sits in your mind nothing can arrive that you did not see coming. Every arrangement you inherit gets rebuilt to a design only you are carrying. What you are guarding against is collapse, the specific picture of the thing you built coming apart inside a week and proving to have been thinner than it looked. So you absorb more of it, which makes you more necessary, which makes the collapse more expensive, and you call the arrangement stability."
          },
          {
            "label": "ONE PART, NOT YOURS",
            "text": "Pick the single piece of the operation that only you understand and write down how it works, start to finish, this week. Hand that document to one person along with the decisions that go with it for a full month, with no review halfway through. Diary the day you might take it back, and leave open whether you ever do."
          }
        ]
      },
      "5": {
        "title": "Money Moves Through Teaching and Guidance",
        "fields": [
          {
            "label": "ALREADY ENOUGH TO TEACH",
            "text": "What you already carry is enough to hand on, and it has been enough for considerably longer than you have been willing to act on it. Teaching, mentoring, spiritual guidance, human resources, consulting, training, lecturing, an education business of your own: all of it rewards the ability to take what you know and make it usable by somebody standing further back. You explain a hard thing without shrinking it, so the person keeps the difficulty and gains a way to hold it. Learning does not have to close before the giving starts, and in your case it never will close. The material stays alive in your hands because you are still somewhere inside it yourself. You teach from the middle of the road rather than from its far end, and the teaching works."
          },
          {
            "label": "ONE MORE COURSE FIRST",
            "text": "One more course, one more year of practice, one more qualification, and then the teaching can begin properly, a sentence that has been running for years without an end attached to it. The opposite face of it is teaching from a distance you never step out of, where the material stays polished and general and none of what it cost you is in the room. Knowing more than whoever you are speaking to is what keeps you steady, so a question you cannot answer removes something much larger than the question. The frightening possibility is that the gap between you and the person learning is narrower than either of you assumes, and that it closes the moment you say something plain. So the studying continues, and the studying is genuine, and it is also the most respectable way you have found to not begin."
          },
          {
            "label": "TEACH IT UNFINISHED",
            "text": "Teach the thing you know best to one person this week, out loud, with the gaps still sitting in it. Say at the outset that there are parts you have not worked out, then carry on instead of preparing further. Sixty minutes is enough, and the version you would be ready to give in six months is not the one to hold out for. Do it before the weekend."
          }
        ]
      },
      "6": {
        "title": "Money Moves Through People and Genuine Connection",
        "fields": [
          {
            "label": "THE LINE STAYS OPEN",
            "text": "Trust is not a technique you learned, so relationships hold around you through material that would ordinarily break them. Relationship coaching, human resources, recruiting, running a sales team, partnerships, communications: every one of them runs on real connection where a process would be faster and worse. You register what somebody is not saying and adjust before the conversation goes wrong, without making a performance out of the adjusting. Work that would stall inside an email thread moves because you picked up the phone instead. You put a person and a situation together in your mind, and that pairing lands correctly at a rate no coincidence could explain."
          },
          {
            "label": "EVERY THREAD KEPT WARM",
            "text": "Keeping every connection warm is unpaid and endless and you do it anyway, so the week fills with maintenance that never shows up as work. The other side of it is avoidance, where a relationship going bad gets managed rather than settled, and you will absorb a real cost to keep the tone pleasant. Being trusted stands in place of a job title for you, so the moment somebody goes cool the ground shifts and you start hunting for what you did wrong. The fear is being disposable, that what you call closeness was a service you supply, and that you have not tested whether it holds once the supplying stops. Each year the list of relationships you maintain grows longer and nothing ever comes off it. So you answer everything the day it arrives, and the cost of that stays uncounted."
          },
          {
            "label": "SETTLE THE COOL ONE",
            "text": "Name the relationship that has gone quiet in a way you have been explaining away, and say the actual thing to that person this week. Use one sentence about what changed, with no apology in front of it and no softening at the close. Pick the day now and put it in the diary, because a conversation with no date attached is a decision to keep managing it."
          }
        ]
      },
      "7": {
        "title": "Money Moves Through Momentum and Results",
        "fields": [
          {
            "label": "THE THING GETS DONE",
            "text": "Finishing is where your money is, and it is a distinct skill from starting or planning, which is exactly why it is worth so much. Logistics, transport, sport, events, travel, operations: those reward forward motion directly, and none of them can be talked into being complete. You carry a job through the middle stretch, where the interest has gone and only the work remains, and you do not need it to stay interesting. Deadlines steady you rather than pressing on you, and the nearer one gets the clearer your head becomes. Momentum is something you generate rather than something you catch when it happens to arrive. You take a plan somebody else drew and land it."
          },
          {
            "label": "MOVING TO AVOID SITTING",
            "text": "Motion becomes the point in itself, so you accept work that is easy to complete over work that matters and would take a year of your life. The same push burns the middle, since you get to done by cutting the part of the job that needed thinking, and the result stands up until the day it does not. Output substitutes for a settled opinion of yourself, so an unproductive Sunday leaves you restless for reasons the task list cannot explain. What you are running from is the sensation of stopping, where the questions you have outrun for years catch up inside about ten minutes. So the calendar stays full, and full passes for fine."
          },
          {
            "label": "AN HOUR WITH NOTHING",
            "text": "Set aside sixty minutes on a weekday with no task in them, no phone, and nowhere you have to be afterwards. Sit through the restlessness that shows up around the fifteen-minute mark instead of finding something useful for your hands. Write down whatever turns up in the final ten minutes, in whatever state it arrives. Do this once, not as a new routine."
          }
        ]
      },
      "8": {
        "title": "Money Moves Through Fairness and Responsibility",
        "fields": [
          {
            "label": "STRAIGHT AS THE PRODUCT",
            "text": "Precision and honesty are not a temperament you have to work around here, they are the thing being bought. Law, legal consulting, accounting, auditing, financial analysis, compliance, contract work: each pays for somebody who reads every line and rounds nothing in their own favour. An imbalance registers with you physically, before you have located where it sits, and you go and find it. You would rather deliver an unwelcome figure than a comfortable one, and that preference is less courage than an inability to hold something false in your hands. You keep the account true when bending it would be easier, quieter and considerably better paid."
          },
          {
            "label": "THE RULE APPLIED TO YOU",
            "text": "The same standard that makes you good runs on you all day, and it grants you none of the allowances you would extend to somebody in your position. It also runs outward as coldness, where a rule gets broken for a human reason and you register the breach first and the person second, by which point the tone is set. Doing it correctly stands in for liking yourself, so an error with your name attached stays with you for months after everyone involved has forgotten there was one. A small lapse of your own is filed permanently and never written off. Underneath is a fear of being ordinary in the moral sense, that if you let one thing slide you would discover yourself capable of letting all of it slide, leaving no version of you that you would trust. So you hold the line on small things at full strength, and the strain never shows, and it is enormous."
          },
          {
            "label": "THE ALLOWANCE YOU GRANT",
            "text": "Treat one mistake of your own exactly as you would treat the same mistake in somebody else, starting with whichever one you are still carrying. Write the two sentences you would say to them, put your own name at the top of the page, and read it back the same day. Then close that mistake for good this week, rather than keeping it available for the next time you need something to hit. Do it on paper, not in your head."
          }
        ]
      },
      "9": {
        "title": "Money Moves Through Mastery Earned Alone",
        "fields": [
          {
            "label": "WORKED OUT UNSUPERVISED",
            "text": "Expertise you assembled on your own, with no course and no mentor and no room to check yourself against, is still expertise and it still sells. Niche consulting, strategy, analysis, healing and therapeutic work, research, running something entirely by yourself: those fields buy depth, and none of it asks to see where the depth came from. Solitude is your working condition rather than a stretch you endure between collaborations, and the hardest thinking you do happens inside it. You go further into a subject alone than a structured route would have taken you, and you can demonstrate it in an afternoon."
          },
          {
            "label": "PROOF THAT NEVER ARRIVES",
            "text": "Because nobody signed off on any of it, you keep hunting for the credential that would make the whole thing official, and you go on studying instead of charging. The other expression is refusal, where you will not put the work in front of a single soul, since a private thing cannot be marked down. Knowing something genuinely, all the way through, is the thing you own in place of standing, so a confident hollow account of your own subject is intolerable in a way that surprises you. Exposure is the fear underneath, that opening the work up would reveal a hole sitting in the middle of it that you cannot see, and the years would go with it. So the mastery keeps growing and stays unpriced, which is the single outcome that costs you every time."
          },
          {
            "label": "SELL IT UNCERTIFIED",
            "text": "Write down what you can do in terms of the result it produces rather than how you came to learn it, and hold it to five lines. Offer that to one person at a full rate before the end of next week, without mentioning anywhere that you taught yourself. If the pull toward one more qualification arrives while you are writing, note the date and carry on."
          }
        ]
      },
      "10": {
        "title": "Money Moves Through Trends and Adaptability",
        "fields": [
          {
            "label": "AHEAD OF THE SHIFT",
            "text": "A shift registers with you when it is still small enough that describing it aloud sounds like nothing much at all. Marketing, investment work, business development, tourism, freelance work spread across several jobs at once: all of that is paid for arriving early, and arriving early cannot be taught as a method. You change shape as conditions change without treating the change as a loss, so nothing you built last year holds you in position this year. Several unrelated projects running together is your comfortable state rather than a phase of overload. You commit your weight to the new thing while it still looks like a rumour, and you get there before it fills up."
          },
          {
            "label": "NOTHING HELD LONG ENOUGH",
            "text": "Adaptability turns into never completing a cycle, so you leave at the interesting part and the compounding, which only begins in year three, never happens to you. Flexibility also becomes shapelessness, where you can argue any position well and no longer know which one you would defend if defending it cost you something. Being early is the closest thing you have to a fixed identity, so falling visibly behind on something is worse to you than losing money on it. You leave clean, with good reasons, and the reasons are true every single time. Your list of openings runs far longer than the list of what still stands up. Underneath it is the dread of being stuck with one place, one job and one version of yourself while the doors close quietly around you. So you take the next thing, and the next thing is genuinely better, and the pattern stays exactly as it was."
          },
          {
            "label": "PAST THE DULL PART",
            "text": "Give the project of yours that is furthest along every working hour for the next thirty days, with nothing new begun inside that window. Write down on day one the reason you would normally leave, so you recognise it when it turns up around week two. Keep a single line each evening about what you did, and do not read the lines back until the month has finished. Start on the first working day of next week."
          }
        ]
      },
      "11": {
        "title": "Money Moves Through Charisma and Presence",
        "fields": [
          {
            "label": "WHAT YOU BRING IN",
            "text": "Walking into a room alters what happens in it, and that alteration is labour whether or not anybody has ever priced it. Coaching, motivational work, personal branding, fitness and wellness, performing, leadership that runs on presence rather than a job title: those pay directly for the thing you cannot take off. You lift the level of a flat situation deliberately rather than by accident, and you know afterwards what you did to lift it. You turn a dead hour into a live one on demand, and you do it while tired."
          },
          {
            "label": "SWITCHED ON REGARDLESS",
            "text": "The performance runs whether you have anything to give that day or not, so the lit version goes out and the bill arrives privately afterwards. The reverse is withdrawal, where the charge goes and you vanish completely, and the distance between those two states is wide enough to frighten you a little. The recovery takes longer each time, and you plan around it quietly rather than name it. Being the brightest thing present is how you decide the day counted, so a quiet stretch feels like a stretch in which you were absent. What you are afraid of is being unremarkable in a plain room, unlit, with nothing arriving to be handed out, and finding that the room carries on identically. So you switch it on again, and it works again, and nothing gets tested."
          },
          {
            "label": "A QUIET DAY ON PURPOSE",
            "text": "Spend one day this week lifting nothing for anybody and saying only what you actually mean to say. Notice what happens in you around the third or fourth hour, when the urge to perform arrives and you leave it where it is. Write one sentence that night about what stayed true about you with the charge switched off."
          }
        ]
      },
      "12": {
        "title": "Money Moves Through Patient, Devoted Service",
        "fields": [
          {
            "label": "STAYING IS THE JOB",
            "text": "Remaining with a slow, unglamorous process long after it stops being interesting is a real capacity, and anything that changes a life is built out of it. Counselling and psychology, medicine, caregiving, social work, spiritual service, long transformational work: those are paid for presence held across years rather than results delivered in a quarter. You can be with somebody through a bad stretch without needing them to improve on a schedule that suits you. Small repeated acts do not lose their meaning for you when nothing visible comes back for months. You stay through the part where nothing appears to be happening, which is where the change is actually made."
          },
          {
            "label": "NO LIMIT WRITTEN DOWN",
            "text": "There is no point at which you decide you have given enough, so you remain in situations years after they stopped moving anywhere. It looks like endurance from outside and feels like martyrdom from inside, carrying the load and quietly resenting the load, both running together and neither one admitted. Being needed steadily supplies the opinion you do not otherwise hold about yourself, so time off feels less like rest and more like abandoning a post. The fear is that everything you are worth is a function of the giving, and that stopping for a fortnight would teach you something you could not then un-know. So the giving continues, the question stays unasked, and both of those feel from the inside like loyalty."
          },
          {
            "label": "NAME THE END DATE",
            "text": "Put an actual end date on the commitment you have been holding longest, written somewhere you will see it, this week. It can sit six months away, and what matters is that a date exists where previously none did. Then take one full day away from all of it before the month closes and explain that day to nobody. Choose the date before you finish reading this."
          }
        ]
      },
      "13": {
        "title": "Money Moves Through Genuine Transformation",
        "fields": [
          {
            "label": "WHERE THINGS END",
            "text": "Something has to genuinely finish before a rebuild can start, and you are steady in the stretch between the two where most work stops dead. Crisis management, psychotherapy, transformation coaching, surgery, rehabilitation, change work inside organisations: each of those needs somebody who does not flinch at the ending itself. You can say the thing that closes a phase and then stay in the room for what follows, which is a different skill from being blunt. Wreckage does not look like failure to you, it looks like the middle. You are calm in the hours right after something has come down, when the decisions that matter get made. You take a situation apart deliberately and rebuild it into something that could not have existed without the taking apart."
          },
          {
            "label": "ENDING WHAT IS FINE",
            "text": "When nothing is ending you get restless, so you find something stable and test it until it breaks, then call the breaking honesty. The other face is precisely the opposite, sitting inside a dead arrangement for years because the one ending you know how to run is the one you keep postponing for yourself. You measure your own weight by what you have come through that would have flattened somebody else, so an ordinary settled period feels like a life going soft. Underneath it sits a horror of the plain middle, that with no crisis to be equal to you would turn out to be a person of no particular size. So you keep something burning, and there is always a good reason for the burning."
          },
          {
            "label": "LEAVE THE STABLE THING",
            "text": "Identify the one part of your life that is currently working and commit to changing nothing about it for thirty days. Write down the excuse you would give yourself for shaking it, now, while you are calm, so it is recognisable later. Separately, name the dead thing whose ending you have been postponing and put the first real step of that ending in the diary this week. Tell nobody about the thirty days, so the commitment has nothing propping it up. Mark the last day of the month on a calendar tonight."
          }
        ]
      },
      "14": {
        "title": "Money Moves Through Harmony and Integration",
        "fields": [
          {
            "label": "TWO FIELDS, ONE ANSWER",
            "text": "Holding two systems that are supposed to be incompatible and locating where they actually agree is the specific thing you do. Holistic healing, nutrition and wellness, mediation, integrative practice, lifestyle consulting: the join is the product, and a specialist in either half cannot make it. You do not water either side down to force the fit, which is why the result works instead of merely sounding balanced. Conflict between two positions looks to you like a question nobody has finished answering yet. You build the third answer that both halves can stand on, and you build it out of their own material."
          },
          {
            "label": "SMOOTHING INSTEAD OF CHOOSING",
            "text": "Integration slides into avoidance, where you find the middle position so quickly that you never have to say which side you were on. It slides into dilution as well, with enough half-blended things running at once that not one of them goes deep enough to charge properly for. Holding the whole picture together does duty for a position of your own, so being asked to pick a side takes more from you than the question deserves. Nothing you run ever gets the hours that a single chosen thing would need. Underneath it is a dread of fracture: stop mediating and the parts of your own life would drift into pieces that no longer speak to each other. So everything stays smoothed, and smoothed reads from the inside as peace."
          },
          {
            "label": "STATE THE UNBALANCED VIEW",
            "text": "Decide which side of one live disagreement you actually think is right and write that down in a single sentence. Say it to the people involved this week, without the balancing clause you would normally attach at the finish. Hold the sentence under twenty words so there is nowhere inside it to hide. Name the disagreement before Friday."
          }
        ]
      },
      "15": {
        "title": "Money Moves Through an Honest Relationship With Power",
        "fields": [
          {
            "label": "MONEY SEEN PLAINLY",
            "text": "Money and influence are legible to you as mechanics rather than as a moral question, and you work with both without being owned by either. Business and finance, sales, negotiation, entertainment, the luxury trade, work built on how persuasion actually operates: every one of those is paid for exactly that steadiness. You can want a large amount of money and also walk away from a deal, and neither of those states is a performance. What somebody is really after in a negotiation is usually obvious to you within a few minutes, and you price accordingly. You hold your own terms in a room where the money sits across the table from you."
          },
          {
            "label": "UNBOUGHT AS THE POINT",
            "text": "The clarity turns into leverage, since you see the pressure point in a negotiation and there are days you press it because pressing is available rather than because the deal needs it. It also runs as refusal, turning down money that was clean because accepting it would feel like being bought, and calling the loss integrity afterwards. Being unbuyable is the measure you actually run on, so the whole thing has to be demonstrated again inside every arrangement you enter. Underneath it runs a doubt about yourself, that at the right figure you would fold, and that the offer has simply never been large enough to find out. So you test the figure on yourself, in small ways, for years."
          },
          {
            "label": "SAY YES TO ONE",
            "text": "Find one piece of well-paid work you have been turning down on grounds you have never examined properly, and take it this month. Write out before you accept what you would genuinely be giving up, in plain terms, and check whether anything is on the list. Then do the work at your full figure, without discounting it as a gesture."
          }
        ]
      },
      "16": {
        "title": "Money Moves Through Rebuilding and Reform",
        "fields": [
          {
            "label": "SAYING IT IS FAILING",
            "text": "A structure that is quietly failing announces itself to you long before it shows up in any numbers, and you will say so while saying so is still unwelcome. Engineering, architecture, information security, risk and crisis management, construction, whole-system rebuilds: those pay for somebody willing to name the fault and then stay for the repair. Patching does not satisfy you, so what you replace comes back stronger than the original rather than merely working again. You hold the whole failing thing in mind, including the parts that are sound, and cut precisely where the cutting has to happen. You take a structure down to its foundation and put back something that will outlast the version you removed."
          },
          {
            "label": "CORRECT AND EXHAUSTING",
            "text": "Being right about the fault becomes the entire posture, and you carry the argument long after the useful part of it has finished. It also runs the other way, into demolition for no particular reason, where something that needed reinforcing gets taken down because bringing things down is the move you trust. Seeing what is broken before it has been named is what your self-regard is built on, so being wrong about a fault costs you more than the fault itself ever would. The dread sitting under it is complicity, that should you stop naming the failure you become part of the failing thing you can see. So you say it again, at a higher cost each time, and the saying quietly replaces the fixing."
          },
          {
            "label": "MEND WITHOUT REPLACING",
            "text": "Mend one thing you have already judged unfixable rather than replacing it, and give the mending a full week. Keep a list of what you actually had to change, and stop the moment the thing works instead of carrying on to whatever you would have built from scratch. Do this on something that matters slightly, not on nothing, so the restraint costs you something real."
          }
        ]
      },
      "17": {
        "title": "Money Moves Through Visibility and Inspiration",
        "fields": [
          {
            "label": "THE WORK CARRIES YOU",
            "text": "Your work only becomes itself once it leaves your hands and stands somewhere it can be looked at. You put your own face and your own opinion into what you make, and the thing gains weight from that rather than losing its seriousness. Interest is not a reward collected afterwards; it is the raw material the whole enterprise runs on, and you handle it without flinching. You turn plain notice into a living by making the public version of yourself the product itself."
          },
          {
            "label": "PERFORMING THE PART",
            "text": "There are two ways this goes wrong and you run both of them. One version has you shaping the work around what will land instead of around what you think, until it is a wrapper for a reaction with nothing inside. The other is a recoil: you go quiet for weeks, put nothing out, and call the silence integrity when it is closer to fright. What tells you the week was good is whether the last thing you made felt alive, so a flat stretch reads as a verdict on your whole ability. Beneath that sits a plainer suspicion: the interesting part of you is the surface, and a quieter life would hold nobody worth knowing. You keep moving so that question never gets asked."
          },
          {
            "label": "PUBLISH THE ROUGH ONE",
            "text": "Take the piece you have been polishing privately and put it out this week in the state it is in, with no caption apologising for it. Fix the day now and mark it on a calendar, instead of holding out for a version that finally feels defensible. Then begin the next piece on the same day the first one goes out, so your attention lands on the making rather than on what came back."
          }
        ]
      },
      "18": {
        "title": "Money Moves Through Emotion and the Subconscious",
        "fields": [
          {
            "label": "WORDS FOR THE WORDLESS",
            "text": "You pick up on what someone is carrying long before they've found words for it, and you can give that feeling a shape that holds. It is the basis of the work: therapy and psychology, film, photography, the practices dealing in what runs under the surface. You follow a hunch no document supports yet and it keeps proving to be the right thread. Feeling arrives first and the reasoning assembles behind it, which is backwards from how most work is taught and exactly why yours goes deeper. You make the inside of a person legible to them, and you charge for doing it."
          },
          {
            "label": "TAKING IT ALL HOME",
            "text": "Two things happen here and neither of them is the middle. Sometimes you absorb what somebody else feels so completely that you cannot locate where they end and you start, and you carry it home and lose the evening. Other times you shut the channel off entirely, go clinical, describe a person in categories instead of feeling them, and what you produce in that state is competent and dead. Neither version is you working properly, and both feel fully justified while you are inside them. The reading is what you have in place of a qualification, so being wrong about somebody costs you far more than the mistake is worth. Underneath sits a worry: if that instinct ever fails you, nothing else backs it up but a person with feelings and no way to price them. So you keep testing the sense, again and again, on situations that never asked for it."
          },
          {
            "label": "MAKE ONE FINISHED PIECE",
            "text": "Pick one hunch about your own life that you have not put anywhere yet, and give it a form before Sunday. Set an end point on the day you start, because material of this kind expands to fill whatever room it is given. Keep the making and the feeling apart: work for a fixed stretch, stop, then use your hands on something unrelated. Repeat it the following week at the same hour, even if the first attempt came out badly."
          }
        ]
      },
      "19": {
        "title": "Money Moves Through Joy and Open Success",
        "fields": [
          {
            "label": "NO COSTUME REQUIRED",
            "text": "Being straightforwardly yourself while a room watches is the part most grown adults find hardest, and it costs you almost nothing. That openness is not a personality trait sitting beside your career; in speaking, teaching, performing and creative leadership it is the working part. You hold a room of children and a room of strangers with the same equipment, because you are not managing an impression while you do it. Warmth of that kind is not effortful, so it survives long days and dull rooms that would flatten a manufactured version of the same thing. You do the work with nothing between you and it, and that plainness is what earns."
          },
          {
            "label": "DIMMED FOR SAFETY",
            "text": "The brightness goes two ways whenever it comes under any threat. You either turn it up into a performance you cannot get out of, holding a room afloat while feeling nothing yourself, or you pull it in hard and go flat and unreachable for days. A day where the openness arrives on its own reads as a good day, and a day it has to be forced reads as evidence that something in you has broken. The fear is small and exact: that the joy is the only good thing about you, and a serious version of you would be entirely ordinary. So you stay light long past the point it is honest, and the heavy thing goes unsaid for months."
          },
          {
            "label": "SAY THE DULL TRUTH",
            "text": "This week, in one conversation you would normally brighten, say the flat unglamorous thing instead and leave it sitting where it lands. Do not follow it with a joke, and do not check the reception by reading a face; move on to the next subject. Choose the conversation in advance so you are not relying on the moment to hand you an opening. Give it a day and a name, noted somewhere you will see it on the morning it falls. Do it once more before the month ends, with a different person and a heavier subject."
          }
        ]
      },
      "20": {
        "title": "Money Moves Through Calling and Awakening",
        "fields": [
          {
            "label": "WHAT KEEPS COMING BACK",
            "text": "One subject keeps returning to you through changes of job and changes of mind, and it does not get any quieter. Work of that kind pays you because the conviction behind it is real and cannot be manufactured: coaching, mentoring, public service, teaching meant to change somebody, speaking where the topic genuinely matters. You stand in front of a difficult question and give the answer you would still give if it cost you the room. The mission was not chosen off a list; it is what your attention does when nothing at all is forcing it anywhere. You take the thing you cannot put down and build a working life on top of it, rather than keeping it as a private interest. You put weight behind a sentence and move somebody from thinking about a change to making one."
          },
          {
            "label": "THE MISSION EATS EVERYTHING",
            "text": "Two failures live inside this and they take turns with each other. The first is that you burn your own resources for the cause and treat the exhaustion as proof it matters, until nothing is left to give and you resent the whole thing. The second is the stall: you wait to feel called clearly enough before starting, and ordinary useful work goes undone while you listen for a signal. Your own worth gets settled by whether the day served something larger, so an afternoon spent on your comfort registers as a small betrayal. Beneath it runs a fear you rarely say, that without a mission you are a normal person with normal appetites and normal would be unbearable. A second fear sits beside it: the calling was invented to spare you a smaller, more accountable life. So you keep the mission large enough that no week can ever satisfy it."
          },
          {
            "label": "BOOK ONE PAID SESSION",
            "text": "Name a price for one hour of the thing you would happily do free, and take money for it once before the month is out. Decide the figure and write it down before you offer anything, so the number is fixed while you are calm rather than negotiated mid-sentence. Put the hour into a specific day and treat it as unmoveable against whatever arrives for the cause."
          }
        ]
      },
      "21": {
        "title": "Money Moves Through Global Reach and Integration",
        "fields": [
          {
            "label": "BUILT FOR MORE ROOM",
            "text": "Scale is not a stretch for you; it is the size at which your thinking finally has enough to work with. Trade across borders, platforms running without you present, wide networks, projects living in several countries at once: that coordination is where you are comfortable. You hold many moving parts at once and you see where two apparently unrelated ones join. You build things that go on working in rooms you are not standing in."
          },
          {
            "label": "EVERYWHERE, NOWHERE FINISHED",
            "text": "The reach turns on you in two directions and both of them feel like ambition. You open fronts faster than you can staff them, so five promising things run at forty percent and not one reaches the state where it pays. Or you refuse to start until a plan covers every territory, and the small local version that would have taught you everything never gets built. Size is how you check that work counts, so something modest and finished reads as a hobby even when it is better. What frightens you sits lower than ambition: a life spent in one place doing one thing well would mean you were only ever capable of that one thing. So you add a country, a channel, a partner, and the unfinished middle stays unfinished."
          },
          {
            "label": "SHIP THE SMALL VERSION",
            "text": "Choose one of the open fronts and take it all the way to the point where it earns, this month, before touching any of the rest. List the others on a single sheet with a date ninety days out against each, which is where they wait instead of where they die. Tell nobody about the new idea that arrives in the second week; add it to the same sheet and carry on. Judge the chosen one by whether it is finished, never by how far it reaches."
          }
        ]
      },
      "22": {
        "title": "Money Moves Through Freedom and Original Work",
        "fields": [
          {
            "label": "NO TITLE FITS",
            "text": "Nothing on the standard list of jobs describes what you actually do, and that stopped being a problem to solve some time ago. Freelance work, ventures you invent, a life arranged around going where the work is: the absence of a template is the condition you think best in. You start before the guarantee arrives, which is not recklessness but different arithmetic, because waiting carries a cost too and you count it. Constraint imposed from outside makes you slow and awkward, while the identical task chosen freely gets done in a third of the time. Being wrong in public about the shape of your own work does not stop you, and you change the shape while it is running. You make a living out of an arrangement nobody wrote down for you."
          },
          {
            "label": "REFUSAL AS A HABIT",
            "text": "Freedom hardens into refusal, and it takes two different forms. You leave good arrangements early because staying began to feel like being owned, and you call the exit an instinct when it was a reflex. Or you keep everything so loose and unnamed that no version of the work is ever built solidly enough to pay you properly. Not being contained is what your self-respect runs on, so accepting a structure feels like admitting you are ordinary after all. The dread is specific: inside a fixed shape there would be nothing original left in you, and originality is the single quality you refuse to trade away."
          },
          {
            "label": "SET ONE FIXED HOUR",
            "text": "Commit to one piece of work with a real deadline and hold it for six weeks without renegotiating the terms halfway through. Put the hours into a calendar rather than into your head, and treat each slot as though somebody else had booked it. When the urge to restructure the whole arrangement arrives, note it on paper with the date and return to the task. Keep it small enough that six weeks genuinely finishes it, so the test is about staying rather than about scale. Write down in one line what the finished thing is, so the shape stops moving while you work."
          }
        ]
      }
    }
  };
  window.DCareerPathsContent = {
    get: function (arcanaNum) { return T.paths[arcanaNum] || (prev && prev.get(arcanaNum)) || null; },
  };
})();
