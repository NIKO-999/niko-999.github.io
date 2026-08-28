'use strict';
/*
 * most-prominent-content.js — second-generation overlay.
 *
 * Layered on top of js/most-prominent-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DMostProminentContent — 22 records
(function () {
  const prev = window.DMostProminentContent;
  const T = {
    "data": {
      "1": {
        "title": "The Magician Runs Your Entire Chart",
        "fields": [
          {
            "label": "THE OPENING MOVE",
            "text": "Starting is not a mood that arrives on good days; it is the force running underneath every other move you make. You turn a thought into motion long before the conditions around it have settled into anything anyone would call ready. Waiting rooms cost you more than they cost most, because stillness ahead of a decision registers as friction rather than as patience. You are already three steps inside something while the room around you is still circling the question of whether to begin. You begin things at a rate few could sustain for a month, and you begin them from nothing."
          },
          {
            "label": "RELIEF DRESSED AS PROGRESS",
            "text": "Every new beginning hands you the same relief, which is why the count of things you never closed keeps climbing quietly. You are tuned entirely to the opening move and comparatively untrained at finishing, at sitting still, at letting somebody go ahead of you. The imbalance hides well, because starting always feels like movement in the right direction even when nothing behind you has closed. You feel like a serious person only while something is underway and moving under your hands, and that feeling drains the moment a project sits. The thing you avoid looking at squarely is the suspicion that you have ignition and no staying power, and that a finished piece would settle it. So you reach for the next start before the last one can return a verdict on you."
          },
          {
            "label": "CLOSE THE OLDEST START",
            "text": "Take the oldest unfinished thing you own and put it ahead of everything new for five straight evenings, beginning tonight. When the pull toward a fresh idea arrives, write that idea on paper and leave it there unopened until the five evenings are done. Sit with the same piece on the evening it has gone dull, and keep your hands on it for the full hour anyway. Name out loud, before you stop each night, the exact thing still missing from it."
          }
        ]
      },
      "2": {
        "title": "The High Priestess Runs Your Entire Chart",
        "fields": [
          {
            "label": "KNOWN BEFORE PROVEN",
            "text": "Truth arrives in you complete and quiet, ahead of anything that would justify it to somebody standing outside your head. You read the real temperature of a room, a relationship or a decision well before you have language to hand anyone for it. Quiet does not unsettle you, and a good deal of your clearest thinking only happens once the room has emptied out. You reach the accurate answer ahead of the evidence, repeatedly, and the evidence keeps arriving later to agree with you."
          },
          {
            "label": "THE UNTRANSLATED KNOWING",
            "text": "Certainty this reliable stops bothering to explain itself, and what never gets translated stays unreachable however accurate it happens to be. You expect others to trust a knowing you have not shown the working for, then feel chronically misread when they cannot follow you there. Being right without assistance is the proof, to you, that you are made of something solid, and a shared conclusion never quite counts the same way. Underneath, you dread finding out that the knowing does not survive daylight, that spoken aloud and examined it turns into an ordinary guess. So it stays private, where nothing can test it, and the misunderstanding you resent is the price you keep paying for that arrangement."
          },
          {
            "label": "SHOW THE WORKING",
            "text": "Take something you already know to be true and write out, in ordinary words, the steps that got you there, however obvious they look on paper. Read it aloud to somebody by Friday and refuse to attach the usual line about it only being a feeling. Keep the page afterwards, dated, and add the part you left out because it seemed too plain to bother saying."
          }
        ]
      },
      "3": {
        "title": "The Empress Runs Your Entire Chart",
        "fields": [
          {
            "label": "WHAT YOU FEED GROWS",
            "text": "Whatever comes near you starts developing, which is the plainest available description of what this much Empress energy actually does. Nurture doesn't wait for spare capacity in you; it is the posture your whole system takes toward anything it touches. Projects that would stall elsewhere keep developing once they are in your care, and rooms you spend real time in warm up without being asked to. You give in quantities you barely register, and you would have trouble naming a week when you did not. Faced with almost anything broken, you ask first what it needs in order to flourish rather than what in it needs correcting. You grow living things out of conditions that would have finished them, and you do it steadily, for years at a stretch."
          },
          {
            "label": "RECEIVING FEELS LIKE DEBT",
            "text": "Giving at this volume slowly forgets that receiving is even permitted, and the forgetting looks like generosity from every angle including yours. Your own needs get filed as less legitimate than everybody else's, quietly, without a decision ever being made about it. The instinct that asks what a thing requires before it can grow almost never turns around and points at you. You are convinced you are worth having around while you are producing something for somebody, and the conviction thins out the moment you stop. Giving has become the only language you let yourself speak, so care arriving in your direction lands as a debt to be settled quickly. What you will not look at is the possibility that with the tending stripped away, nothing left in you would still be wanted. So the giving continues well beyond the point at which it costs you sleep, food and most of the year."
          },
          {
            "label": "NO REPAYMENT THIS TIME",
            "text": "Ask somebody this week for one specific thing, name it exactly, and let them finish doing it without your help. Do not repay it, do not balance it out later, and do not mention that they should not have gone to the trouble. Say thank you, stop talking, and notice the pull to immediately offer something back. Write down that night what the discomfort actually felt like in your body, in two or three plain lines. Make the same request of somebody different before the month turns."
          }
        ]
      },
      "4": {
        "title": "The Emperor Runs Your Entire Chart",
        "fields": [
          {
            "label": "FORMLESS INTO SOLID",
            "text": "Order is not a preference you bring out in certain settings; it is the way your whole system makes sense of anything. You take something formless and give it a frame sturdy enough to carry real weight, and you do it almost without effort. Loose ends bother you long after most would have stopped noticing them at all. A plan that has genuinely been thought through gives you a kind of comfort that pleasant surprises never manage. You keep exciting ideas alive by building the part underneath them that stops the whole thing folding when reality arrives."
          },
          {
            "label": "RIGIDITY CALLED RELIABILITY",
            "text": "Control arrives dressed as reliability, and the need for the frame to be exactly right starts overriding whatever the frame was built to hold. Ambiguity that others sit inside comfortably is genuinely hard for you, so you impose order in places that were not asking for any. The structure meant to steady a situation begins to be experienced, by the ones inside it, as the actual problem. You know you are sound because things around you hold together, which means every wobble reads as a verdict on your own competence. Below that runs one thought you refuse to finish: that with the frame out of your hands, it all comes apart and takes you with it. So you tighten, and the tightening is the part doing the damage."
          },
          {
            "label": "LEAVE ONE THING UNMANAGED",
            "text": "Choose one thing this week that is running badly and do not touch it, correct it, or improve its arrangement. Give it seven full days without your intervention, and put that attention somewhere else entirely while those days pass. Each time you reach to fix it, write the time down instead and carry on with whatever you were doing. Read the list of times back on the eighth morning and count them."
          }
        ]
      },
      "5": {
        "title": "The Hierophant Runs Your Entire Chart",
        "fields": [
          {
            "label": "CARRYING THE LINEAGE",
            "text": "Some understanding has to be earned firsthand and some gets received, carried and handed on, and yours is overwhelmingly the second kind. You are steadiest working inside something with real structure behind it, a discipline or a method somebody before you already tested. Teaching comes out of you without being organised, whether or not anybody is paying you to do it. You carry proven knowledge forward intact and hand it to the next person in a form they can immediately use."
          },
          {
            "label": "DOCTRINE OVER INSTINCT",
            "text": "Deference to the established way hardens into rule-following for its own sake, right at the moment a situation was calling for something new. Tradition gets mistaken for truth, and it costs you exactly on the occasions when your own read already knew better than the doctrine. A genuinely new idea has to work harder to reach you than an old one with authority behind it, however thin that authority is. Doing it correctly, by a standard somebody credible laid down, is what convinces you that you are not an impostor in the work. Strip the method away and you would have to answer for a judgement that is only yours, and that prospect keeps you inside the lines."
          },
          {
            "label": "BREAK ONE INHERITED RULE",
            "text": "Find one rule you follow from habit rather than conviction and break it deliberately, on purpose, before Thursday. Choose one where you can watch the consequences directly rather than one whose consequences arrive months later. Write, that same evening, what actually happened and what you had expected to happen, side by side on one page."
          }
        ]
      },
      "6": {
        "title": "The Lovers Runs Your Entire Chart",
        "fields": [
          {
            "label": "NOTHING BY DRIFT",
            "text": "Choosing, for you, is not something that happens at occasional forks; it is the filter your whole life passes through, values first. You struggle to commit to a job, a belief or a relationship that you drifted into rather than examined and picked. Alignment matters more to you than convenience, on the many occasions when convenience would have been considerably easier. Your yes is slow because it is real, and you are unable to hand one out on autopilot. You can feel the difference between a decision you made and a situation that closed around you while you were busy. You walk away from arrangements that suit you perfectly on paper, because you checked them against what you believe and they failed."
          },
          {
            "label": "NO OPTION SURVIVES SCRUTINY",
            "text": "Every option looks flawed once examined long enough, so the examining continues and gets called discernment while the decision sits unmade. Weighing things this carefully turns into paralysis, and the paralysis is comfortable because it never has to be wrong about anything. Meanwhile the choices you postponed get made by time, badly, and you were present for none of them. Your integrity is the one possession you would not trade, so a compromised choice feels less like a mistake than like becoming a lesser person. The idea you will not carry to its end is that you might pick, commit fully, and discover you had misread your own values the entire time. So purity keeps getting demanded of options that were only ever going to be partly right. The search for a clean choice quietly replaces the life the choice was supposed to be for."
          },
          {
            "label": "COMMIT AT SEVENTY PERCENT",
            "text": "Make the decision you have carried for over a month by Sunday night, at whatever certainty you currently hold. Say the choice out loud to one other person so it exists outside your head, and give no reasoning alongside it. Set a date ninety days out to review it, and refuse to reopen the question before that date arrives. Between now and then, spend the deliberating hours on the thing you chose instead of on the choosing."
          }
        ]
      },
      "7": {
        "title": "The Chariot Runs Your Entire Chart",
        "fields": [
          {
            "label": "DIRECTION WITHOUT A PUSH",
            "text": "Ask what you are fundamentally like and the honest answer is that you are always going somewhere, under your own power. Directed will, sustained without anybody supplying it, is the current your entire relationship to being alive runs on. An internal compass stays live even in the weeks when nothing outside you is asking for movement at all. Hesitation around you reads as an opening, and you take it before the discussion about taking it has finished. You keep driving through stretches long enough to stop most, and you generate the reason to continue out of yourself."
          },
          {
            "label": "SPEED INSTEAD OF ARRIVAL",
            "text": "Perpetual movement gets counted as progress, and you arrive nowhere in particular because arriving was never really the point of it. The self-sufficiency that makes the driving possible is also a well-practised ability to never let another person ride along with you. Standing still registers as a low alarm rather than as rest, so something in you stays braced for departure. You are somebody, in your own estimation, only while covering ground, and a flat week reads as evidence that you have gone soft. Slow down properly and you would have to ask whether the direction was ever chosen, so you keep that question moving too. The momentum continues, and it outruns the one question worth stopping for."
          },
          {
            "label": "ONE STILL AFTERNOON",
            "text": "Block one afternoon this week with nothing in it, no destination, no errands, no productive rescue plan when it gets uncomfortable. Stay in the house for the full four hours and let whatever surfaces have the room to surface. Write down, before the evening starts, the first three things that showed up once the moving stopped."
          }
        ]
      },
      "8": {
        "title": "Justice Runs Your Entire Chart",
        "fields": [
          {
            "label": "FAIRNESS AS THE FILTER",
            "text": "Right and wrong are not ideas you consult occasionally; they are the architecture underneath everything else you carry. Unfairness registers in you almost involuntarily, including in the many situations where saying nothing would have cost you far less. You say what you mean, so your word costs you something every time you give it, and you give it anyway. You hold the line on accountability in rooms where the cheaper option is sitting there, unguarded, waiting to be taken."
          },
          {
            "label": "PRECISION WITHOUT MERCY",
            "text": "Balance held this tightly goes rigid, and situations far messier than fair or unfair get sorted into two boxes anyway. The precision leaves almost no room for the ordinary, imperfect way most human beings actually try and fall short. Your own honesty is held to a level nobody around you is matching, you notice the gap constantly, and you say less about it than you feel. Being straight when it costs you is the proof you keep of your own character, and it is the only proof you fully accept. Let one thing slide and you suspect the whole structure of who you are slides with it, which is the thought you keep away from. So the moral exhaustion accumulates, in you and around you, and nothing in the standard permits you to set it down."
          },
          {
            "label": "ONE CASE LEFT UNJUDGED",
            "text": "Leave one unresolved situation exactly where it is for a fortnight, including the part where somebody, possibly you, fell short. Do not raise the matter, revisit it, or issue the private verdict you have already drafted about it. Each time the urge to settle it arrives, name out loud the cost of settling it and carry on. Notice whether what shows up is discomfort, relief, or both together in the same hour. On the fifteenth day, write one paragraph about what the fortnight was actually like."
          }
        ]
      },
      "9": {
        "title": "The Hermit Runs Your Entire Chart",
        "fields": [
          {
            "label": "QUIET IS THE SOURCE",
            "text": "Your most important thinking happens away from other people rather than among them, and that arrangement was never chosen deliberately. Solitude restores you where even genuinely good company falls short of reaching. A room full of helpers trying to think with you is slower for you than an empty one. There is hard-won understanding in you that required real isolation to arrive at, and it arrived because you went in alone. The instinct to hand it on afterwards is there too, and it is as real as the going in. You walk into the dark by yourself and come back out carrying something usable."
          },
          {
            "label": "TOO UNFINISHED TO OFFER",
            "text": "Depth this central slides into withdrawal that stopped serving anything, and the withdrawal keeps calling itself reflection while it hardens into a habit. What you find gets held back until it feels finished, which means it reaches nobody at the point it would have been most useful. You are respectable to yourself in proportion to how little you needed anybody, and every solved problem confirms the arrangement. Offer the rough version and it could be wrong in front of somebody, which would say something about you that solitude has not had to test. So the life fills with insight and empties of the connection that insight was always heading toward."
          },
          {
            "label": "HALF-FORMED, SAID ANYWAY",
            "text": "Take something you worked out privately and describe it to somebody within four days, in the half-formed state it is currently in. Do not build the polished version first, and do not open with a warning about how unfinished it is. Say the piece you are least sure of, out loud, in the same breath as the part you would defend. Note afterwards, in writing, which half was harder for you to say."
          }
        ]
      },
      "10": {
        "title": "The Wheel of Fortune Runs Your Entire Chart",
        "fields": [
          {
            "label": "WHAT SEASON THIS IS",
            "text": "Nothing stays fixed, and the real skill was never control; it is knowing exactly where in the cycle you are standing. Change is not a disruption to your life, it is the medium the whole of your life moves through. You feel a job, a mood or a relationship beginning to turn well before anything about the turn is official. Instability that would shake most people registers to you as ordinary, which is closer to accurate than the alarm around you. You navigate turns others are still denying, and you adjust your footing before the ground has finished moving."
          },
          {
            "label": "NOTHING BUILT TO LAST",
            "text": "Knowing that everything turns becomes a ready excuse for building nothing that was meant to outlast the current season. Real skill at riding change never gets aimed at anything durable, so the skill has little to show for itself after years. You hold every arrangement loosely, and the looseness that started as wisdom is now the reason nothing has roots. Being unshaken is the competence you privately hold up as yours, so needing something to stay put would feel like a demotion. Commit fully and the turn arrives anyway, leaving you to survive a loss you did not price in, and that possibility stays carefully unexamined. So attachment gets rationed in advance, and the rationing is called realism. Nothing accumulates, and the years read as a sequence of separate weather rather than as one thing built."
          },
          {
            "label": "PUT FULL WEIGHT ON",
            "text": "Commit to one thing you currently hold loosely for ninety days, as though this season were the permanent one. Write the ninety-day end date in a place you pass daily and put your name underneath it. When the pull to keep options open arrives, spend that hour on the committed thing instead and note the date."
          }
        ]
      },
      "11": {
        "title": "Strength Runs Your Entire Chart",
        "fields": [
          {
            "label": "GENTLE AT FULL PRESSURE",
            "text": "Composure under real pressure is not a technique you deploy occasionally; it is how your whole system holds itself steady, permanently. You carry other people's crises and your own difficult feelings without needing to dominate either or run from them. Staying soft in front of something that would frighten most into hardening is the harder discipline, and it is the one you have. You hold situations open that would otherwise have snapped shut, simply by not hardening while you stand inside them."
          },
          {
            "label": "NEVER THE LOUD ONE",
            "text": "Gentleness maintained this consistently turns into self-erasure, and you lose the ability to raise your voice or set a hard limit. Your own need is never the loudest thing present, in any room, including the rooms where it should have been. The composure reads as effortless when it almost never is, so the care taken with you is less than the situation warranted. Holding steady for everybody else is the evidence you keep that you are good, and a lost temper would spend that evidence entirely. Underneath is a conviction you avoid stating: that the calm is the reason you are bearable to have around, and without it you would be too much. So the steadiness becomes the one duty you are never permitted to put down, least of all for your own sake."
          },
          {
            "label": "AUDIBLY UPSET, ONCE",
            "text": "Something this week genuinely warrants anger; be visibly and audibly upset about it in front of another person. Do not manage the temperature of the room, and skip the apology for your tone as the sentence ends. Say what you want done about it, in one plain line, and leave the line unsoftened. Remain in the conversation for a full minute after saying it rather than smoothing everything over. Write that evening what it cost you to stop managing everyone's comfort for sixty seconds."
          }
        ]
      },
      "12": {
        "title": "The Hanged Man Runs Your Entire Chart",
        "fields": [
          {
            "label": "ANSWERS ARRIVE SIDEWAYS",
            "text": "Understanding reaches you when you stop forcing it, which is the opposite of how effort is supposed to work and is nonetheless how yours works. Letting go of control, deliberately and against instinct, is not a rare event in your life but the default position. Waiting is rarely wasted for you, because the actual work is happening quietly during it. You see the same situation from an angle you did not choose, and the angle is the thing that resolves it. Stillness produces material in you that hard pushing has never managed to produce. You give up the grip on purpose and come back holding the answer the grip was blocking."
          },
          {
            "label": "ONE MORE ANGLE FIRST",
            "text": "Surrender slides into paralysis wearing patience as its cover, and nothing gets decided because one more angle is always pending. Endless reflection gets mistaken for the depth it was meant to produce, and the two look identical from inside. Being unusual in how you see things makes deferring easier, because deferring can be presented as the very quality that makes you worth consulting. Seeing clearly is your whole claim on yourself, so acting on a partial view would put that claim at risk in a way inaction never does. The thought kept out of reach is that the next angle will not arrive, and the waiting was ordinary avoidance the entire time."
          },
          {
            "label": "DEADLINE THE WAITING",
            "text": "Act on the insight you already have before Friday, without waiting for a further layer to arrive. Give the waiting an actual end date and write it down where the decision itself is written. Do the smallest irreversible piece first, the part that cannot be quietly undone over the weekend. Record what you knew at the moment you moved, so the record exists independently of how it turns out."
          }
        ]
      },
      "13": {
        "title": "Death Runs Your Entire Chart",
        "fields": [
          {
            "label": "REMADE BY ENDINGS",
            "text": "Endings are not events that happen to you occasionally; ending is the mechanism you use to keep becoming who you are. One version of a life finishes properly so a truer one can start, and you have done this more than most. Identities, relationships and whole working selves have closed behind you, and you came out the far side of them rather than staying stuck. Change that frightens other people arrives for you as simply the next thing, without drama attached. You end things cleanly that most drag out for years, and you start again from the ground without needing a rest first."
          },
          {
            "label": "RESTLESSNESS CALLED COMPLETION",
            "text": "Nothing gets the chance to mature, because the moment a thing stops feeling new you begin dismantling it and calling that growth. Restlessness gets read as genuine completion, and reinvention gets counted as development when it is often only motion. You feel when something has already died long before you will say so, and the same sensitivity declares things over that had not finished. Your capacity to walk away intact is the strength you are proudest of, so staying would look, from inside, like losing that strength. Underneath is a suspicion you avoid handling: that if you stayed through the dull middle, you would find you cannot do the slow part. So the fresh start keeps outbidding the harder work of seeing one thing all the way down."
          },
          {
            "label": "THIRTY MORE DAYS",
            "text": "Choose whatever you are closest to declaring finished and keep it going for thirty more days without renegotiating that number. Do the dull maintenance it needs in week two, which is the week you would normally have left. On day thirty, write half a page separating what has genuinely completed from what merely stopped being interesting."
          }
        ]
      },
      "14": {
        "title": "Temperance Runs Your Entire Chart",
        "fields": [
          {
            "label": "TWO TRUTHS, NO COLLAPSE",
            "text": "Two forces that do not want to sit together get blended, patiently, into one coherent thing, and that is the skill your system runs on. You hold two truths, two traditions or two temperaments at once without needing either of them to collapse into the other. Extremes drain you faster than they drain most, and the middle path, walked slowly, is where you actually want to be. You make workable wholes out of parts that were never designed to fit, and you manage it without flattening either part."
          },
          {
            "label": "THE PERMANENT MIDDLE",
            "text": "Holding the middle costs so much energy that you never get around to standing anywhere yourself, on anything. Neutrality this permanent looks like wisdom from outside and is sometimes only a way around the friction a real position would cause. Bridging two things that would not otherwise speak becomes your function, and the function quietly forbids you from picking one. Every time a side gets chosen in the room, the balancing starts automatically before you have checked whether it was needed. Your usefulness rests on being the one place two opposed things can meet, and a stated opinion would cost you that place. You avoid the thought that having a position would expose it as ordinary, and the balancing keeps that exposure permanently at bay. So the middle holds, and the ground under your own feet stays borrowed from both sides."
          },
          {
            "label": "ONE UNBALANCED OPINION",
            "text": "Say one clear, unblended thing this week in a situation where staying neutral would have been the easier move. Let it stand through the remainder of that conversation without appending the other view to soften it. If somebody disagrees, restate it once in the same words rather than finding the version everybody can live with. Write the sentence out beforehand so you say it as you meant it and not as you adjusted it. Choose the topic tonight and the occasion by Thursday."
          }
        ]
      },
      "15": {
        "title": "The Devil Runs Your Entire Chart",
        "fields": [
          {
            "label": "THE UNSANITISED ACCOUNT",
            "text": "Desire, power and attachment sit in plain view for you, where most arrange their lives to avoid looking at them. You understand what actually moves a person, money and fear included, more clearly than most will admit they understand it. The polite version of a situation never quite satisfies you, so you go under it and find the working arrangement. Physical and material honesty comes easier to you than to the ones around you who prefer a comfortable account. You can name your own attachments, out loud, with an accuracy most spend a lifetime not developing. You look directly at the parts of being human that a room has agreed to leave unmentioned, and you keep looking."
          },
          {
            "label": "CLEAR SIGHT, SAME GRIP",
            "text": "Clear sight of a chain gets treated as freedom from it, and the two are separated by work you have not done. The insight curdles into entanglement, so you are ruled by precisely the attachments you can describe best. Naming the thing accurately feels like progress, and it registers as enough progress even in the years when nothing changed. If you had to give up every other quality but one, you would keep being unfooled, so admitting you are caught costs more than staying caught. What you steer around is the chance that the honesty was always the sophisticated way of not stopping."
          },
          {
            "label": "PUSH ONE EDGE",
            "text": "Take one attachment you have described accurately for years and change something material about it within the next ten days. Cut the amount, the frequency or the access by a specific number you write down before you start. Keep the description out of it entirely, because explaining the pattern is the move that has replaced altering it. Mark each day on a calendar and let the mark be the whole record."
          }
        ]
      },
      "16": {
        "title": "The Tower Runs Your Entire Chart",
        "fields": [
          {
            "label": "CRACKS VISIBLE FIRST",
            "text": "A structure that was never sound comes down all at once rather than slowly, and you can usually see which one it is. The job, the belief or the arrangement is visibly cracking to you well before anybody involved will say the word. Sudden change does not frighten you the way it frightens most, so you remain present and functional while it is happening. Disruption is how you clear ground for whatever is actually real underneath. You call the collapse early, out loud, and you stand there through the noise of being right about it."
          },
          {
            "label": "PROVOKING THE BREAK",
            "text": "Slow, uncertain decline is more unbearable to you than fast rupture, so you accelerate the break instead of waiting for it. Your own impatience gets mistaken for a structure's instability, and the mistake is convincing because it has often been correct. Things ended abruptly that needed to end abruptly, and that record makes you far too quick to trust the next collapse. Seeing through what everybody else is still defending is the ability you keep as proof of your own worth, and it needs fresh cases to stay proven. You refuse to sit with one idea: that a structure held steady and slowly repaired would leave you with nothing to see through. So the crisis gets arranged, and it arrives on time, and the arriving is treated as confirmation."
          },
          {
            "label": "NO HAND ON IT",
            "text": "Leave the situation that currently feels like it is cracking alone for thirty days and do nothing to accelerate it. Do not name the flaw to the parties involved, and do not create the conversation that forces the issue. Write, on day one, exactly what you predict will fail and by when, then seal the page. Open it on day thirty and read the prediction against what actually happened in the intervening month."
          }
        ]
      },
      "17": {
        "title": "The Star Runs Your Entire Chart",
        "fields": [
          {
            "label": "HOPE THAT GENERATES ITSELF",
            "text": "Hope arrives in you ahead of any evidence for it, and it keeps arriving whether the facts have caught up or not. This is not a mood that visits on good mornings; it is the current everything else in you runs on, quietly, under whatever is going on. Renewal feels possible directly after real loss, at the point where most people are still counting the damage. You keep believing through stretches that stop other people entirely, and nothing outside you has to confirm the belief for it to hold. You start backing a situation again long before it has improved, and you move real resources on that backing."
          },
          {
            "label": "HOPEFUL ABOUT SOMETHING FINISHED",
            "text": "Faith this durable stops looking straight at what is concretely wrong, so optimism quietly does the job that honest attention was supposed to do. The second version is worse and harder to see: you stay invested in something that has already ended, giving it more time because stopping is not a move you have. You rate a day by whether you can still see a future in it, and that private measure decides more of your choices than any plan does. The dread you rarely put into words is that if you stopped producing hope, nothing else inside you would hold the weight. So a chapter that closed months ago goes unacknowledged, kept open by a faith with nothing left to work on. You spend real years on things you privately understand are over."
          },
          {
            "label": "SAY THE UNHOPEFUL SENTENCE",
            "text": "Pick the one situation you have been hopeful about for longest and write, in a single sentence, what is factually true about it today. Do that tomorrow morning, before you have talked yourself back into the wider view, and keep the sentence where you can find it on Friday. Give the sentence no second half, no recovery clause and no plan attached to take the edge off what it says. Read it aloud on Friday and add nothing."
          }
        ]
      },
      "18": {
        "title": "The Moon Runs Your Entire Chart",
        "fields": [
          {
            "label": "SENSED BEFORE EXPLAINED",
            "text": "Something being badly off, or exactly right, registers with you before you could give a single reason for the reading. The unconscious is not somewhere you visit on strange nights; it is the ground your whole system walks on, named or not. Dreams carry weight for you, rooms tell you what has not been said in them, and symbols land as information rather than decoration. You read the undercurrent of a situation and act on what you found there while everybody else is still working off the surface."
          },
          {
            "label": "FEAR IN INTUITION'S CLOTHES",
            "text": "Fine attunement loses the thread back to solid ground, and genuine insight gets tangled with anxiety until neither one is separable from the other. Every felt sense arrives carrying identical authority, so the dread that is only dread gets the same standing as the read that was right. Your self-respect rides on knowing early, on having caught a thing before it was visible or spoken aloud by anyone. Below that sits a thought you steer around: the instrument you trust most is the only one you cannot check. You live closer to fear and illusion than most people do, simply because you spend more hours in the territory where both of them live."
          },
          {
            "label": "ONE FEAR, ONE FACT",
            "text": "Take the fear you have carried longest and name the single piece of evidence that would settle it either way. Go and get that evidence within three days, whether it is a number, a date, a document or a plain answer to a plain question, instead of sitting with the feeling and calling it knowledge. Let the fact decide the matter even on the days the feeling is much louder than the fact is."
          }
        ]
      },
      "19": {
        "title": "The Sun Runs Your Entire Chart",
        "fields": [
          {
            "label": "LIT WITHOUT SUFFERING",
            "text": "Warmth in you did not have to be bought with suffering, and it does not have to be produced before it can be given. Being plainly yourself is not a performance you put on for the occasion; it is how your whole system meets whatever arrives. Enthusiasm is your most reliable working tool, moving things that were stuck simply because it is genuine and not manufactured. You do not have to warm up first, and you do not have to decide on generosity before it turns up in you. Difficulty has not been the price of what you give out, which is worth knowing plainly about yourself. You walk into ordinary situations at full size and change what happens inside them."
          },
          {
            "label": "HARD THINGS STAY HIDDEN",
            "text": "Radiance this steady hardens into a performance of ease, and then a difficult day has nowhere honest to go. The other shape it takes is a whole life organised around looking fine, right through the stretches that are not fine at all. Whether you feel good about yourself hinges on whether things got easier around you, so your bad hours get paid for privately and out of sight. What you flinch from is being met as a person with a problem instead of as the easy, steady supply you have always been able to provide. So the difficulty gets managed, edited, and delivered later as an anecdote once it is safely over. A genuinely bad day reads as a lapse in duty rather than an ordinary week in a life. You carry that cost alone and call it consideration."
          },
          {
            "label": "SHOW ONE HARD DAY",
            "text": "Choose one thing that is genuinely hard for you at the moment and describe it out loud this week to somebody you trust, before it has resolved into anything. Say the unedited version, with no brightness laid over the top and no lesson arrived at by way of an ending. Waiting until it is resolved defeats the exercise, because the resolved version is the managed one and the managed one is what you already do. Sit through the pause afterwards rather than filling it with reassurance about how you are basically fine. Do the same thing on Sunday with something smaller."
          }
        ]
      },
      "20": {
        "title": "Judgement Runs Your Entire Chart",
        "fields": [
          {
            "label": "TELLING CALL FROM NOISE",
            "text": "A genuine summons separates itself from wishful thinking almost immediately in your hands, and that discrimination takes most people decades to build. Being called toward something larger is not a rare or dramatic event here; it is the ordinary condition your whole system organises itself around. Purpose does not behave like a thing you found once and kept, but like something that keeps arriving again with new terms attached. Readiness has never been your entry requirement, so you move when the call comes rather than when the preparation is complete. You answer things that most people would spend a year deciding whether to hear at all."
          },
          {
            "label": "ALWAYS PART WAY THROUGH",
            "text": "Answering the next call before the present one has been lived through leaves every chapter of your life partly done. The other version is subtler: you outgrow a shape that still fits, then treat the outgrowing itself as proof that staying was never available. What you privately grade yourself on is how far the next version of you reaches, never how well you are inhabiting this one. What you back away from is the possibility that the life you have now, exactly as it stands, is the one you get. So the next calling feels more real to you than the ordinary Tuesday you are standing in, and that Tuesday gets spent as preparation. You lose years of a life already underway to a version of yourself who has not turned up."
          },
          {
            "label": "STAY IN THIS CHAPTER",
            "text": "Give this week entirely to the chapter you are already inside, with no listening for whatever comes after it. Write one sentence on Monday naming what is unfinished here, and spend the following days finishing exactly that instead of scanning ahead. When the pull toward the next thing arrives, note the hour it arrived and go back to the work already in your hands. Let Sunday come without a single decision about anything beyond it."
          }
        ]
      },
      "21": {
        "title": "The World Runs Your Entire Chart",
        "fields": [
          {
            "label": "WHOLE, NOT MERELY OVER",
            "text": "Completion for you means the pieces actually fitting together, not simply the work stopping when the time ran out on it. You can tell the difference between something finished and something abandoned at the point it got difficult, and that distinction is sharper in you than in most. Wholeness is not a distant ambition here; it is the standard everything you touch gets measured against, reasonably or otherwise. You close things that other people leave hanging for years, and you close them properly."
          },
          {
            "label": "GOOD ENOUGH FEELS CHEAP",
            "text": "Nothing here gets called complete, because the standard keeps extending itself just past whatever has actually been reached. Real accomplishments sit permanently short of the finish, waiting on an integration that was never the point of them. You keep score by how whole a thing is when you set it down, and partial work reads as a personal failing instead of an ordinary trade-off. The frightening part is that something you signed off could turn out to have a hole in it you were meant to have caught. So an honest sense of good enough arrives feeling like a compromise, and you extend the work once more to avoid making that call. You spend your best hours on the last two percent of things that were already sound."
          },
          {
            "label": "SIGN IT OFF UNFINISHED",
            "text": "Choose the piece of work you have been extending longest and call it done before Wednesday, at exactly the state it is in today. Add nothing further to it, not one more pass and not one more condition, and write the date you closed it beside its name. Start the next thing on Thursday with that one behind you, whatever it still lacks."
          }
        ]
      },
      "22": {
        "title": "The Fool Runs Your Entire Chart",
        "fields": [
          {
            "label": "EVERY START IS NEW",
            "text": "Beginnings stay genuinely open for you, arriving as themselves rather than as reruns of something already lived once. You will put money, a relationship or a whole direction on the line without a guarantee attached, and that is courage rather than naivety. Certainty was never the condition you set for moving, so the unmapped version of something is exactly the version you are willing to enter. Each start gets your full attention as itself instead of the caution borrowed from the last one. Risk sits comfortably in you at a size that would keep most people up at night. You leap on things with no proof behind them and make the opening stretch work."
          },
          {
            "label": "BEGINNING BEATS ARRIVING",
            "text": "Permanent openness never lets one path get tested long enough to show what it was actually worth. The second cost is the comfort of always starting, which quietly replaces the slower work of arriving somewhere and staying there. How alive you feel is the measure you apply to yourself, and aliveness has meant the opening stretch of something for as far back as you can tell. You would rather not discover that the ordinary middle of a thing is where you go flat and dull. So the next open beginning gets more of your attention than the one already underway, and the underway one quietly loses. Depth is the price of staying, and you have paid it far less often than the leaping would suggest. You trade a half-built thing for an unstarted one and feel the relief immediately."
          },
          {
            "label": "TEN DAYS, SAME PATH",
            "text": "Stay on the path you have already chosen for ten days, taking no step at all toward anything newer. Each evening, write one line about what staying asked of you that leaping never has, and keep those lines together in one place. When a new opening presents itself during those ten days, put it on the same page and leave it there unopened. Work on the dull middle section of what you started, the part you would normally hand to somebody else or skip over. Read the ten lines together on the eleventh morning."
          }
        ]
      }
    }
  };
  window.DMostProminentContent = {
    get: function (num) { return T.data[num] || (prev && prev.get(num)) || null; },
  };
})();
