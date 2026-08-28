'use strict';
/*
 * archetype-content.js — second-generation overlay.
 *
 * Layered on top of js/archetype-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DArchetypeContent — 6 records
(function () {
  const prev = window.DArchetypeContent;
  const T = {
    "data": {
      "STRATEGIC_LEADERSHIP": {
        "title": "The Strategist",
        "fields": [
          {
            "label": "DECIDING BY DEFAULT",
            "text": "Command sits in you as a plain assumption rather than a raised voice: somebody has to decide, and it may as well be you. You read a situation for its pressure points before choosing to look, so you work on the conversation after the one being had. Instability sharpens you where it scatters everybody else, and the moment a thing slips you go quiet and start sequencing it. Responsibility gets handed over without anyone announcing the transfer, because you have picked it up by the time it is offered. You refuse to live at the mercy of circumstance, and you would carry the whole weight before sitting inside somebody else's handling of it."
          },
          {
            "label": "ONLY YOUR HANDS",
            "text": "Holding it together for long enough stops being a choice and becomes the only way you know to be in a room. Competence hardens into a conviction that your hands are the safe ones, so passing a task on registers as exposure, and you take it back early. The quieter version is that you absorb load nobody assigned you, then resent the arrangement you built yourself. Being indispensable is what you privately count as evidence that you are worth having around, so rest waits on conditions that never quite settle. Underneath sits an old equation you have not audited in years, that a person nobody needs is a person nobody wants. That equation is doing more work than any of your reasoning about why the handover has to wait."
          },
          {
            "label": "TEACH IT AND LEAVE",
            "text": "Pick one thing this month that only you can run, and spend an hour writing down how it works in enough detail for somebody to follow. Hand it over on a named day, and when the work comes back done differently, leave it alone for a month. Put the date of the handover in writing somewhere you will see it daily, so the deadline is not a private intention. Sit through the first afternoon it runs without you and notice what your body does with nothing to hold."
          }
        ]
      },
      "ESOTERIC_ANALYTICAL": {
        "title": "The Seeker",
        "fields": [
          {
            "label": "UNDER THE STATED REASON",
            "text": "Surfaces hold you for about as long as it takes to notice something behind them, and then you are under. You go for the mechanism, the motive, the pattern beneath the stated reason, and you forget that most exchanges end at the words spoken. Information arrives already sorted, so you catch the inconsistency in an account before you could explain how. Solitude is a working condition instead of deprivation, the room where the real thinking happens, and you go there on purpose. You hold the part of a story somebody could not say aloud, without flinching and without filing it smaller."
          },
          {
            "label": "EXAMINING INSTEAD OF FEELING",
            "text": "Understanding a feeling has taken the place of having one, and the examining runs indefinitely because it never has to resolve. Withholding is the second expression, done by default rather than by decision, so those closest to you know your conclusions and none of your uncertainty. Depth becomes a private standard, and you disqualify anybody content near the surface without mentioning that a test was running. Seeing further than the account you were handed is what settles the question of your worth, so an unexamined day leaves you uneasy. You would sooner be understood late and accurately than early and roughly, and the lateness has quietly become permanent. Underneath the whole method runs a conviction that being known plainly, before you have built any framing around it, would not be survivable."
          },
          {
            "label": "ONE PLAIN SENTENCE",
            "text": "Find something you understand completely but have still not said to anybody, and say it this week in plain words, without the framing you would normally build first. Give yourself sixty seconds afterwards without adding a qualifier, a joke, or the sentence that explains what you really meant. Write down that same evening what the plain version cost you and what it did not."
          }
        ]
      },
      "PUBLIC_VISIBILITY": {
        "title": "The Luminary",
        "fields": [
          {
            "label": "SEEN BEFORE YOU SPEAK",
            "text": "Attention arrives whether you went looking for it or not, and you worked out early what to do with it instead of shrinking. Warmth goes out of you without effort and comes back doubled, so connection has never been the laborious business it visibly is elsewhere. Atmosphere and beauty land on you as information instead of decoration, and conviction is audible whenever you speak about what you care about. You shape how a room feels within a minute of entering it, ahead of any choice you make about doing it."
          },
          {
            "label": "PRIVACY FEELS LIKE VANISHING",
            "text": "Visibility consumes the person underneath it slowly enough that the loss is difficult to date. The self you show is so practised that its join with the rest of you is gone, and solitude reads as disappearing. You take your reading of yourself from whatever response comes back, so a quiet stretch registers as failure instead of an ordinary flat month. Approval has slid in where your own judgement was, so being warm and being wanted have fused into one measure, and you adjust a position mid-sentence to hold a room. The fear you almost never state is that the warmth was for the version being shown, and that very little stands behind it."
          },
          {
            "label": "ONE UNDOCUMENTED WEEK",
            "text": "Take one week and do the thing you are best at without documenting it, mentioning it, or letting anybody watch. Choose the thing before the week begins, so you are not selecting it around whoever happens to be around. Keep a note each evening of how strong the pull to mention it was, scored out of ten, and leave the note unshared. On the third day, when the discomfort is loudest, stay inside it for a full hour rather than reaching for a phone. Once the seven days are done, read the scores back and mark the day the number moved."
          }
        ]
      },
      "SYSTEMIC_TEACHER": {
        "title": "The Teacher",
        "fields": [
          {
            "label": "HANDING OVER THE METHOD",
            "text": "Disorder registers as a problem with an obvious fix nobody has applied, so you sort things before noticing you started. Principle matters to you in a way that is out of fashion, and you can name what you stand for unrehearsed. What you know, you can hand over intact, which is a separate ability from knowing it and a considerably scarcer one. You give the framework, the ruling, the way to think about a thing, and you give it flat, with nothing condescending underneath. Unfairness lands in your body before it reaches your reasoning, so you catch it early and act while it is small. You transmit what you know so cleanly that it survives leaving you."
          },
          {
            "label": "DEFENDED PAST THE EVIDENCE",
            "text": "Certainty arrives early and gets defended long after the evidence moved, because being wrong feels like the whole structure going rather than one belief. You hold others to standards you have not stated aloud, then read their ordinary variation as a flaw in character. Teaching slides into correcting by small degrees, and the room around you gets quieter without your registering the day. You experience your own consistency as what keeps the ground level, so loosening a single rule feels wildly out of proportion. Being the steady one who has already worked it out is what you settle your own standing on, so you close questions early. Underneath the judgement sits something plainer: if the rules stop holding then nothing does, and you would be standing in that with no method at all."
          },
          {
            "label": "SOMEBODY ELSE'S WAY",
            "text": "Name a rule you run on that you inherited rather than tested, and say it aloud so you know which one is on trial. Spend the next fortnight doing that one thing another way, in full, without commentary and without a running defence of your own version. Do it past the first week, when it only feels wrong because it is unfamiliar. Keep a short dated record of what breaks and what quietly does not, so the review runs against notes."
          }
        ]
      },
      "INNOVATIVE_FREEDOM": {
        "title": "The Innovator",
        "fields": [
          {
            "label": "SIDEWAYS ARRIVALS",
            "text": "Constraint reads as a question rather than a verdict, and you cannot accept that a thing must be done the way it always has been. Ideas arrive sideways, two unrelated things joining without permission, and since you cannot reconstruct the route you trust the arrival. Freedom is a requirement instead of a preference, and a life closing its options down feels physically wrong before you can say why. You stay inside the open part of a problem while the pressure to shut it peaks, and you make things that resemble nothing else."
          },
          {
            "label": "LEAVING AT THE HARD PART",
            "text": "Openness stops being freedom the moment it can never be closed, and yours has not closed in a very long time. What began as protecting your options is now an inability to stay with anything until it turns real, and good beginnings pile up unfinished. Every limit registers as a threat, including a routine, a promise, or a person wanting to know where you will be, so closeness stays at arm's length. You mistake restlessness for vision and leave at precisely the point where the work stops being fun and starts being work. Having every door still open is the private proof that your life belongs to you, so you keep one hand off every commitment. Beneath that runs a bet that if you never fully arrive anywhere, nothing can trap you there. You pay for that bet in the finished version of nearly everything you start."
          },
          {
            "label": "TAKE ONE TO DONE",
            "text": "Go back to one thing you left at eighty percent and take it to done inside three weeks, dull final stretch included. Set the finish date now, in writing, and treat the last fifth as the actual work rather than admin. On the day it is finished, sit with the completed thing for ten minutes before starting anything new."
          }
        ]
      },
      "CRISIS_TRANSFORMATION": {
        "title": "The Alchemist",
        "fields": [
          {
            "label": "WHAT THE WRECKAGE BECOMES",
            "text": "Collapse holds no fear for you, and that is not bravado but what is left after going through several of them. Endings that would flatten another person are simply the part before the next thing, and you can stand inside one without needing it to stop. You see what somebody is concealing because you have concealed things yourself, and the recognition is immediate and entirely unsentimental. Your steadiness in an emergency is not calm; it comes from knowing the floor gives way and knowing what follows. Surviving is the common part and it is not the skill, because anybody survives and very few make anything of the remains. You build the next thing out of what the last one left, and you begin while the loss is still recent."
          },
          {
            "label": "ENDING IT FIRST",
            "text": "Stability starts to register as nothing happening, and a quiet month lands on you as the pause before something worse instead of as arrival. So you court intensity without meaning to, ending a thing early or introducing friction, because a wreck is familiar ground and peace is not. The old ruin has hardened into identity: you keep the damage close because it explains you, and explanation turns quietly into permission. You test whoever stays, needing evidence they can take your worst, since coming through what would have finished other people is the one credential you never doubt. Running under all of it is an expectation that everything ends, and it is more bearable to be the one ending it."
          },
          {
            "label": "A SEASON WITHOUT REPAIR",
            "text": "Let one arrangement that is currently fine stay as it is for a whole season, without improving, testing, or bracing against it. Write down at the start which arrangement it is and the date the season ends, so the agreement is with yourself. Each time you catch yourself reaching to adjust it, note the day and what you were about to change, in one line. Halfway through, read those lines back and count how many of them were about a real problem. In the final week, write down what has moved into the space the crisis used to take up."
          }
        ]
      }
    }
  };
  window.DArchetypeContent = {
    get: function (bucketKey) { return T.data[bucketKey] || (prev && prev.get(bucketKey)) || null; },
    NAMES: (prev && prev.NAMES) || {},
  };
})();
