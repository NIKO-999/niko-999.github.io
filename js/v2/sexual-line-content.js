'use strict';
/*
 * sexual-line-content.js — second-generation overlay.
 *
 * Layered on top of js/sexual-line-content.js by DestinyMatrix-v1.html. Each getter
 * reproduces the original's addressing exactly and defers to the captured
 * `prev` on a miss, so anything not yet rewritten still reads as it did.
 *
 * Records carry their own three subheadings in `fields`; the page sniffs for
 * that shape and renders those labels instead of MASTERY / SHADOW / INVITATION.
 */

// DSexualLineContent — 25 records
(function () {
  const prev = window.DSexualLineContent;
  const T = {
    "codes": {
      "Gentle Lovers": {
        "title": "Gentle Lovers — The Tension of Needing Constant Reassurance",
        "fields": [
          {
            "label": "CLOSE RANGE ATTENTION",
            "text": "You register the smallest change in how a person is feeling toward you, often before they have named it themselves. Closeness is not a skill you had to study, and you have always wanted to stay joined to somebody instead of merely near them. You pay attention to a relationship the way most attention only shows up once something has already broken. That attentiveness is real capacity rather than anxiety by another name, and it makes you unusually good at keeping a bond in repair. You catch a small drift early and you move toward the person instead of away from them."
          },
          {
            "label": "ASKED AGAIN TOMORROW",
            "text": "Reassurance arrives and does not stay put, so you need it said again within a few hours of hearing it. You read the health of a relationship almost entirely through how often love is actively shown, which means a quiet week reads as a problem instead of a week. Whether you are lovable gets decided, day by day, on the evidence of the last warm thing somebody said to you. Below that is the conviction that affection not renewed out loud has already been withdrawn quietly. So you ask, and you ask in the way that is hard to refuse, and the answer never lands with enough weight to hold overnight. Each round of asking is a little heavier than the last, because the previous round proved nothing that stayed proved. The person opposite starts to feel that nothing they give is ever properly received."
          },
          {
            "label": "LET YESTERDAY COUNT",
            "text": "Write out tonight, word for word as best you can manage, the last three warm things somebody has said about who you are. For the following six days, whenever the pull to ask for it again arrives, read that page before you open your mouth. Ask anyway if you still want to after reading, because this is about the second ask and the third rather than the first. Keep the page private and add to it whenever something new gets said. Do the reading even on the days when nothing in you is asking."
          }
        ]
      },
      "Seekers of Perfection": {
        "title": "Seekers of Perfection — The Tension of Discarding at the First Flaw",
        "fields": [
          {
            "label": "DEPTH SEEN IN ADVANCE",
            "text": "Your eye for what a relationship could actually become at its best is unusually accurate, and it works from very early on. You see the depth available between two people while a connection is still mostly potential, and you are rarely wrong about it. That vision is discernment and not fantasy: you can tell apart a person with real range and a person who is merely pleasant company. Surface does not impress you, and a pleasant hour is not enough to convince you of anything. Few temperaments can hold a picture of what is possible and still stay interested in an ordinary Tuesday. You size up what two people could build together long before there is much evidence for it."
          },
          {
            "label": "DROPPED AT FIRST FAULT",
            "text": "Familiarity arrives and the measuring starts, so somebody stops being a person you are learning and turns into a case you are grading against a picture you made. Connections end fast at the first real flaw, and between the endings sits a steady private sense that nobody quite reaches the mark. The standard itself never gets questioned; it rules out one decent person after another and keeps its authority completely intact. Whether you are worth much yourself is settled by the calibre of who you would accept, so lowering the bar reads as a demotion of you. What you keep away from is the thought that a real person, chosen and lived with, would show you to be ordinary. Every flaw you find arrives as relief as much as disappointment."
          },
          {
            "label": "STAY WITH ONE FAULT",
            "text": "Choose one specific imperfection in somebody you are close to now and stay with it for ten days without acting on it. Treat it as a fact about a real person instead of a verdict on the whole connection, and keep noticing what else is true across those same days. Put one line on paper at the finish about what that imperfection is actually costing you, in plain terms and in numbers where you have them. Leave it unraised with them for the full ten days."
          }
        ]
      },
      "Vengeful Dominators": {
        "title": "Vengeful Dominators — The Tension of Control Standing in for Closeness",
        "fields": [
          {
            "label": "NOTHING SLIPS PAST YOU",
            "text": "Vulnerability in another person is visible to you the moment it appears, in the half-second before they have decided to show it. You track the shifts in somebody's state with an accuracy most temperaments never develop, and the tracking never looks like scrutiny. That sensitivity is genuine: you know when a person is frightened, when they are pretending, and when they have gone somewhere else in their head. It gives you real power in a room, and that power is not itself a fault. You meet a person at the exact point where they are least defended."
          },
          {
            "label": "OBEDIENCE MISTAKEN FOR CLOSENESS",
            "text": "Somebody near you softens and you press harder, because a partner who has gone open could go anywhere from there. How much they yield is how you read how much they care, which makes agreement the only proof you fully accept. Your own value gets settled by whether a person bends toward you under pressure, so a flat refusal lands as a judgement on you instead of a preference of theirs. The thought you refuse to finish is that a person free to leave would not stay. Pressure goes up at exactly the moment it should come down, and what comes back is compliance, which holds for a long time before it stops."
          },
          {
            "label": "ASK BEFORE YOU MOVE",
            "text": "Before you push for anything you want this week, stop and ask the other person plainly what they actually want right now. Let their answer change what happens next, including the times the answer is no and nothing whatsoever is wrong. Do this three separate times over the next ten days and note afterwards, in one line each, how easy the asking was."
          }
        ]
      },
      "Disillusioned Cynics": {
        "title": "Disillusioned Cynics — The Tension of Testing Through Contrast",
        "fields": [
          {
            "label": "WARM AND SHARP BOTH",
            "text": "Feeling runs at full strength in you, and both ends are available: real warmth and a real edge, neither of them performed. Most relationships never see a range this wide, because most temperaments flatten themselves into easy company and stay there. You can be tender without going vague and hard without going cold, and you know which one a moment actually calls for. You feel things at full size and you bring the whole range of it into a room."
          },
          {
            "label": "THE TEST NOBODY PASSES",
            "text": "Security settles in and something in you goes hunting for the edge, so warmth one day gets followed by sharpness the next for no stated reason. The swing is a test, run without ever being announced as one, of whether somebody will stay when you are difficult and not only when you are good. Anybody who passes gets no credit for passing, because a test that was survived only proves the test was too gentle. Being unpredictable keeps you out of reach of being taken for granted, and that guarantee is what you have quietly substituted for being loved. Whether you count as somebody worth staying for is settled by whether they stayed through the worst version, so a calm stretch leaves the question open. The fear is old and plain: anyone who finds you easy is already leaving. From the inside the test never feels like a test, it feels like honesty, and that is what keeps it running."
          },
          {
            "label": "SAME TEMPERATURE ALL WEEK",
            "text": "Hold one temperature for seven days straight with the person you are most tempted to unsettle, warm or plain, but the same one throughout. When the pull to introduce a jolt arrives, name it silently as the test it is and let that moment pass unacted on. Write one word each evening about whether you swung, and keep the seven days running even after a day you failed at it."
          }
        ]
      },
      "Rebellious Servants": {
        "title": "Rebellious Servants — The Tension of Devotion That Erases the Self",
        "fields": [
          {
            "label": "ALL IN FOR SOMEBODY",
            "text": "Loyalty of an unusual size lives in you, and it goes to the person others find too strange or too much to manage. You understand somebody from the inside instead of from a distance, and you keep understanding them long after that stops being easy. That willingness is genuine devotion and not weakness, and it builds a bond most connections never come close to. You give the whole of yourself to a thing you have decided matters, without needing the arrangement explained back to you. You hold a difficult person steady across years that would exhaust most kinds of patience."
          },
          {
            "label": "THE SUPPORTING ROLE",
            "text": "Your own preferences dissolve early, usually before you have noticed there was anything there to dissolve, and what remains is the shape of their life. The bond turns into two of you against everything outside it, which feels enormous from within and quietly costs you a whole side of yourself. You know what they want for dinner in fine detail and you have no live answer about what you want. Being indispensable to one person is how you settle the question of your own value, so wanting something separate registers as a small betrayal of the bond. Underneath that is a plain expectation that a version of you with its own appetites would be too much trouble to keep. Years pass in a supporting role inside your own relationship, and it goes on feeling like love precisely because it costs you so much."
          },
          {
            "label": "ONE PREFERENCE, KEPT",
            "text": "Say one preference of your own out loud this week, using the ordinary tone you would use for a fact, with no case attached. Pick something small and genuinely yours, the film or the evening or the food, and let it sit there unjustified. Repeat it on three separate days before Sunday, and note afterwards how long you lasted each time before explaining yourself. Say it once more if it gets talked around, in the same flat tone. Keep the preference itself unchanged across all three days."
          }
        ]
      },
      "Forbidden Dreamers": {
        "title": "Forbidden Dreamers — The Tension of Love Shadowed by Possession",
        "fields": [
          {
            "label": "ATTACHMENT AT FULL DEPTH",
            "text": "Attachment in you runs deep enough that a chosen bond becomes one of the few things you would rearrange an entire life around. You invest without holding a reserve back, and what you give has real weight in it instead of pleasant surface. One bond that matters is worth more to you than several convenient ones, and you are not confused about which you want. Nothing about your feeling is casual, and you have no interest in a connection that could be swapped out with nothing lost. That depth is the actual asset here, long before anything at all goes wrong with it. You commit to a person completely and you stay committed through stretches that thin most attachments out."
          },
          {
            "label": "SUSPICION WITHOUT A CAUSE",
            "text": "Losing them becomes the thought running underneath every good day, so ordinary happiness feels like time borrowed instead of time had. Suspicion turns up with nothing solid behind it and gets treated as information, and jealousy without a cause is hard to tell apart from insight in the moment it lands. You reach for control instead of trust, checking and steering and narrowing, and every move is defended as care because in your head it genuinely is. Being the person somebody would not leave is what decides whether you amount to anything, so a partner's separate life registers as a threat and not as a life. The dread sitting under all of it is that you are, on any honest accounting, replaceable. The grip goes on tightening and it produces the exact distance it was built to prevent."
          },
          {
            "label": "SAY THE FEAR ALOUD",
            "text": "Name the fear out loud the next time jealousy shows up with no facts behind it, and say the fear itself instead of the accusation it wants to become. Use plain words for it: that you expect to be left, and that the expectation is running today. Do this within the next four days, before you check anything, ask anything, or look at anything. Keep the checking at zero for those four days."
          }
        ]
      },
      "Possessive Punishers": {
        "title": "Possessive Punishers — The Tension of Punishing Suspected Betrayal",
        "fields": [
          {
            "label": "SMALL SIGNALS, READ FAST",
            "text": "Small signals reach you fast: a change of tone, a pause that ran a beat long, an answer that arrived pre-prepared. Your attention is sharp in exactly the places where most attention goes lazy, and what you pick up is usually there instead of invented. Vigilance like this is genuinely useful, and it means very little in a relationship gets past you unregistered. It also means you are rarely surprised, which counts for more than it sounds when something has actually started going wrong. You register a shift in somebody days before it becomes anything a person would say out loud."
          },
          {
            "label": "PUNISHED BEFORE CHECKED",
            "text": "Ambiguity gets read as guilt, so a short reply or a closed phone turns into a settled verdict inside about a minute. What follows is not a question but a penalty: the cold stretch, the withdrawal, the tightening of what they can do without friction. The cycle runs suspicion, punishment, quiet, and then repeats, and almost none of it reaches a direct conversation where somebody could simply answer. A question would end most of these episodes in under a minute, and asking one is the move that rarely gets made. Catching a betrayal before it lands is how you rate your own competence, which is why being wrong about one stings worse than being betrayed. What you refuse to test is the possibility that nothing is there to find and nothing ever was. Secrecy starts up in the person being watched, precisely because they are being watched, and then you have your proof."
          },
          {
            "label": "ASK THE PLAIN QUESTION",
            "text": "Put the suspicion into a plain question the next time one flares, and ask it inside the hour instead of after a day of collecting more of it. Say what you noticed and what you concluded from it, in that order, and stop talking once that sentence is finished. Ask it the way you would ask a stranger for directions, without the preamble that turns a question into an accusation. Take the answer as the answer for that day, with no second pass over it at midnight. Do this every time suspicion turns up between now and next Sunday."
          }
        ]
      },
      "Detached Lovers": {
        "title": "Detached Lovers — The Tension of Staying One Step Removed",
        "fields": [
          {
            "label": "STEADY AND UNSWALLOWED",
            "text": "Intimacy does not cost you yourself: you can be very close to somebody and still know where your own opinions end. You keep your footing in a relationship that a lot of temperaments get swallowed by, and the keeping costs you no visible effort. That steadiness is genuine composure and not coldness, and it lets you stay level when a situation gets emotionally loud. You hold your own shape inside a bond, so the bond never has to hold you up."
          },
          {
            "label": "CLOSE, NOT REACHABLE",
            "text": "Bodies get close and the stakes stay parked outside, so you keep intimacy at the interesting distance: near enough to enjoy, far enough that nothing could take a piece out of you. Both of you end up living in one house and quietly, separately, lonely in it. Needing nobody is how you decide you are doing well, so an evening when you wanted somebody badly registers as a slip and not as ordinary life. The thought you steer around is that letting a person all the way in would hand them the ability to end you. The guardedness that keeps this whole thing safe is the reason it never becomes real."
          },
          {
            "label": "ONE STAKE SHOWN",
            "text": "Show one real stake to your partner within the next five days, chosen in advance and not waited for. Pick a sentence you would normally keep, the one admitting you want something from them, and say it without the qualifier that usually follows. Say it when the room is calm rather than during a fight, and leave it unexplained afterwards. Give yourself a deadline of Friday and hold to it even if the week goes badly."
          }
        ]
      },
      "Versatile Lovers": {
        "title": "Versatile Lovers — The Tension of Needing Constant Reinvention",
        "fields": [
          {
            "label": "APPETITE THAT KEEPS MOVING",
            "text": "Appetite for a connection that keeps moving is something you have in real quantity, and it does not fade after the first year. You bring aliveness into a relationship that would otherwise settle into routine by month eight, and none of that is effortful for you. Change interests you instead of frightening you, which means you can be with one person through several versions of who they are. You keep discovering things in somebody, and discovering is what you are genuinely built for. You put life into a bond long after the first charge has worn off."
          },
          {
            "label": "STEADY READ AS DEAD",
            "text": "A steady rhythm arrives and you read it as something dying instead of something holding, and the reading happens before you have checked it. So you start rearranging the shape of the connection, the terms, the frequency, the definition, when nothing in it has actually broken. Feeling fully alive is what you use to decide the relationship is worth being in, which makes a calm month indistinguishable from a failing one. What you will not sit with is the suspicion that a quiet life would leave you looking unremarkable. Your partner gets asked to be new again and again, and after a while the asking is the thing unsettling them. Nothing is wrong, and you keep on fixing it."
          },
          {
            "label": "TWELVE DAYS UNCHANGED",
            "text": "Leave one steady part of your relationship completely alone for twelve days: no renegotiating it, no improving it, no fresh proposal about how it might work better. Choose the part that is currently working and therefore feels the most boring to you. Note in a line each day what is actually there once you stop rearranging it. Take the twelve days without shortening them when day four gets uncomfortable."
          }
        ]
      },
      "Vulnerable Rebels": {
        "title": "Vulnerable Rebels — The Tension of a Tough Front Over Real Tenderness",
        "fields": [
          {
            "label": "THE SOFTER MATERIAL",
            "text": "Tenderness is the actual material you are made of, and it runs deeper than the front you meet a room with suggests. You register feeling at a depth that would be obvious in somebody else and stays almost entirely private in you. The capacity for softness is fully intact and not lost, which is why the guarding takes as much effort out of you as it does. The toughness is a real part of you as well, and that is exactly why the two of them are so easy to confuse. When you do let it out, with a person you have decided is safe, it carries weight that a shallower temperament could never produce. You feel the whole thing and you keep feeling it, whatever the outside of you is doing."
          },
          {
            "label": "HIT BACK TOO HARD",
            "text": "A mild criticism arrives and the response comes back at three times the size the moment called for, before you have decided anything about it. The hardness is doing a job: it stands in front of something soft that has rarely had a good outcome from being shown directly. Meanwhile you look unshaken, entirely composed, and the composure makes it impossible for anybody to tell there is anything underneath at all. Being unhurtable is what keeps your own respect intact, so an obvious wince in front of another person feels like losing instead of like being human. The thing you cannot afford to look at is that the soft part, once seen, gets used against you. The front protects something real and it also teaches whoever is opposite you that nothing softer exists underneath."
          },
          {
            "label": "ONE SOFT SENTENCE",
            "text": "Say something soft to your partner inside the next two days, at a moment when nothing has gone wrong and nothing needs fixing. Pick one true sentence about what they mean to you, deliver it without the joke that usually follows, and stay in the quiet afterwards. Do not check how it landed, and do not repeat it in a lighter tone ten minutes later."
          }
        ]
      },
      "Aimless Lover": {
        "title": "Aimless Lover — The Tension of Drifting Without a Direction",
        "fields": [
          {
            "label": "NO RUSH IN YOU",
            "text": "Time is a thing you can let run, and a connection is allowed to become whatever it becomes without being hurried into shape. You are comfortable in the stage most temperaments rush to end, where nothing has been decided and everything is still available. That patience is genuine ease rather than a way of avoiding things, and it lets a bond find a form nobody imposed on it in week two. Very little in you demands a label before there is anything there to label. You let a relationship unfold at its own speed and you stay relaxed the whole way through."
          },
          {
            "label": "PLEASANT AND UNDECIDED",
            "text": "Months go by and nobody asks what this is between you, so it stays pleasant and undefined, comfortable for you and slowly expensive for the person spending their years inside it. You do not choose it and you do not end it, and the not-choosing quietly does the choosing for you. Keeping every option open is how you hold on to a sense that your life is still yours, so naming a thing feels like losing the rest of your options to it. You expect, without ever testing it, that a defined life would turn out smaller than an undefined one. Two people end up invested in something neither of them ever agreed to."
          },
          {
            "label": "SAY WHAT THIS IS",
            "text": "Decide what one current connection actually is, in a single sentence, and say that sentence out loud to the person inside it before Sunday. Say what you want it to be instead of what you think it currently is, and use a word with edges: together, finished, casual, exclusive. Keep it a statement and not a question, and skip the apology that usually opens this kind of sentence. Give yourself no more than four days to pick which connection."
          }
        ]
      },
      "Awakening Through Crisis": {
        "title": "Awakening Through Crisis — The Tension of Needing Turmoil to Feel Alive",
        "fields": [
          {
            "label": "INTENSITY YOU CAN REACH",
            "text": "Pressure brings out something in you that calm never reaches, and it is not performance: under strain you get sharper, warmer and more present at once. You reach a depth of feeling in one afternoon that a calmer arrangement would take years to approach. Difficulty does not hollow you out, and you stay in the heavy end of experience without needing to be talked down from it. You go the whole way into an experience and you come back carrying something from it."
          },
          {
            "label": "TROUBLE MAKES IT REAL",
            "text": "Conflict switches everything on: desire, attention, the sense that this matters, all of it arriving the moment things go wrong. A settled fortnight goes flat by comparison, and the flatness gets read as proof the relationship is failing instead of proof that a week was quiet. So difficulty gets found, or made, and the making is never conscious enough for you to catch yourself at it. Feeling this much is what you take as evidence the love is real, which leaves a peaceful month looking like the beginning of an end. The quiet certainty underneath is that a calm version of you would have nothing in it worth feeling. A perfectly good relationship gets handed a crisis it never needed, on a schedule you would deny setting."
          },
          {
            "label": "AN UNEVENTFUL HOUR",
            "text": "Give one uneventful hour with your partner your whole attention this week, phone away, nothing being solved, no topic carrying any charge. Stay in it for the entire hour even when the flatness begins to read as something going wrong between you. Put two lines on paper afterwards about what you actually noticed in that hour, and not about what you felt regarding it. Pick the day now and fix the hour in your calendar before Wednesday."
          }
        ]
      },
      "Pioneer of Desire": {
        "title": "Pioneer of Desire — The Tension of Restlessness Toward Routine",
        "fields": [
          {
            "label": "FIRST TO GO LOOKING",
            "text": "Curiosity is the strongest thing you bring to a relationship, and it does not run out after the first season of somebody. You want the parts of a person that have not been shown yet, and you have the nerve to go after them instead of waiting. Unfamiliar ground does not frighten you at all, so you will start conversations and try things a more careful temperament avoids for years. Boredom is information to you rather than a fact of life, so you keep asking what else is in there. That appetite is real, and it is what keeps a connection from going stale on your side of it. You find the unexplored part of a person and you head straight for it."
          },
          {
            "label": "FAMILIAR READ AS FINISHED",
            "text": "Predictability registers as loss, not as the security it actually is, so the month a relationship becomes reliable is the month it starts to feel dead to you. The chase moves outward, toward whoever is unfamiliar, even when the person you already have is good and nothing between you has broken. Feeling the charge of something new is how you know you are still fully alive, so a familiar face across the table reads as a verdict on you and not on the day. You half believe that a life inside one known relationship would be a smaller life than the one you were meant for. Depth is exactly what this appetite could reach, and it is the thing the chasing keeps you permanently short of. Novelty fades fast, which is precisely what keeps the cycle turning."
          },
          {
            "label": "ONE KNOWN THING, REOPENED",
            "text": "Take one routine part of your week with somebody you know well and go into it as though the setting were new to you. Ask them three questions you do not already know the answer to, inside that one setting, and let the answers run long. Do it twice before the month ends, in the same setting both times, and keep the questions off any subject already covered between you."
          }
        ]
      },
      "Masked Provocateurs": {
        "title": "Masked Provocateurs — The Tension of a Public Self That Hides the Private One",
        "fields": [
          {
            "label": "THE VERSION YOU RUN",
            "text": "Presentation is a genuine skill and you have it in quantity: you know which version of yourself a given moment wants and you can produce it on demand. The public self you have built is not a lie, it is a real and enjoyable part of you, sharpened by years of use. You are comfortable being looked at, which frees you up to be interesting while a warier temperament is busy being careful. Moving between the two costs you almost nothing, and the switch is quick enough that you barely register making it. There is a private self underneath as well, more particular and less polished, and it is fully formed and not absent. You control exactly how much of yourself reaches the air, down to the sentence."
          },
          {
            "label": "SEEN, NEVER MET",
            "text": "The gap between the outward version and the private one widens year on year, because widening it is easier than the alternative. Being looked at is safe where being known is not, and you have quietly picked the safe one every time the choice came up. Intimacy stays interesting through the contrast between the two selves and never becomes honest enough for the private one to be in the room. Being easy to enjoy is what holds your own opinion of yourself in place, which makes a plain, undecorated hour with somebody feel like exposure. The bad thought, rarely finished, is that the private version is the one that would be turned down. So the outward version keeps working, and the part of you that wanted meeting goes on waiting for it."
          },
          {
            "label": "ONE PRIVATE THING SHOWN",
            "text": "Let one true, unflattering thing about your private self reach one person you trust, before this week is finished. Pick something ordinary and not dramatic: what you actually do with your evenings, or the thing worrying you at the moment. Say it straight, without turning it into a story with a good ending, and stop there instead of moving on to something entertaining. Do not smooth it as you say it, and skip the line that turns it into a joke. Choose the person today and the moment by Friday."
          }
        ]
      },
      "Magnetic Seducers": {
        "title": "Magnetic Seducers — The Tension of Charm That Keeps Commitment at Bay",
        "fields": [
          {
            "label": "THE PULL YOU GENERATE",
            "text": "Pursuit is where you are most yourself: the opening moves, the read on what somebody wants, the knack of making an ordinary hour feel like something is starting. Charm this size is not a trick you learned, it runs on genuine interest, and that interest is why it works at all. You can create the conditions for a connection out of almost nothing, where another temperament needs months of groundwork. You enjoy the beginning of things without any of the nerves that usually come attached. You generate the pull between two people instead of waiting to be found by it."
          },
          {
            "label": "DISTANCE PUT BACK IN",
            "text": "The moment something starts turning into a defined thing, you put a little distance back in: slower replies, a joke where an answer belongs, a plan left deliberately vague. Pursuit stays alive that way and nothing ever lands, which is why connections accumulate and very few of them get deep. Being wanted while things are still unresolved is how you gauge your own standing, so a settled yes removes the only measure you trust. You are braced for the moment when somebody has you fully and stops finding you interesting. The charge becomes indistinguishable from the relationship itself, and each new beginning costs you the thing that only shows up later."
          },
          {
            "label": "DROP THE AMBIGUITY",
            "text": "Pick the connection you have kept deliberately vague and put one unambiguous sentence into it this week, naming what you are asking this to become. Send it or say it with no joke attached, and do not follow it with a lighter message an hour afterwards. Sit with whatever silence follows for a full day before you add anything more to it. Choose which connection tonight so that the week does not choose for you."
          }
        ]
      },
      "Nostalgics of the Past": {
        "title": "Nostalgics of the Past — The Tension of Measuring the Present Against a Memory",
        "fields": [
          {
            "label": "WHAT MATTERED STAYS",
            "text": "Nothing that mattered to you gets discarded: what a bond meant stays with you in detail, long after the bond itself has finished. You take connection seriously enough to keep a full record of it in your head, including the parts a lighter temperament would let go. That capacity for meaning is real depth and not sentimentality, which is why nothing you have been part of was ever disposable to you. You name exactly what a particular person changed in you, in specific terms, years afterwards."
          },
          {
            "label": "JUDGED AGAINST A MEMORY",
            "text": "Every current connection gets measured against one from before, and the one from before has had years to be smoothed into something it never actually was. The comparison runs quietly and constantly, so the person here now is judged by a standard assembled out of the best half of a memory. Whoever is present has to be excellent to compete, while whoever is gone only has to be remembered. What you have got rarely gets evaluated on its own terms, and it rarely gets the credit it has genuinely earned. The strength of what you once felt is the measure you use for your own capacity to love, so admitting the present is better would mean your peak has passed and that you got it wrong. Somewhere in you sits the verdict that nothing ahead will match what has already happened. The past keeps winning a contest the present was never told it had entered."
          },
          {
            "label": "PRESENT TENSE ONLY",
            "text": "Write one honest page about the relationship you keep measuring the present against, and include the parts you have stopped mentioning to yourself: the boredom, the fights, the days you wanted out. Read it back tonight and then again on Sunday, without editing it into something kinder. Across the next four evenings, when the comparison starts, name what was actually true in place of the smoothed version."
          }
        ]
      },
      "Nostalgic Visionaries": {
        "title": "Nostalgic Visionaries — The Tension of Idealizing What Intimacy Should Feel Like",
        "fields": [
          {
            "label": "IMAGINATION FOR CLOSENESS",
            "text": "You carry a detailed picture of what closeness at full depth would actually feel like, and it is not borrowed from anywhere. Most of what gets called romance is vague wanting; yours is specific, furnished, and it holds still long enough to be described. That same imagination, turned toward the person actually in the room, is what lets a real bond be lived rather than graded. You can hold an enormous idea of intimacy and a plain Tuesday evening in the same hands without either one shrinking. You build depth into a relationship by imagining it accurately enough to walk into."
          },
          {
            "label": "MEASURED AGAINST THE PICTURE",
            "text": "The picture does not sit in your head as a hope; it runs as a standard, and every real connection gets held against it before the evening is over. One expression is a comparison running quietly underneath ordinary closeness, where you are half present and half checking the score. The other arrives as a decent relationship that disappoints you without ever doing anything wrong, and you could not say aloud what it failed at. Your worth rides on the size of what you can envision, so the ideal has to stay larger than anything actual or you have shrunk with it. Below that is something colder — meeting the real version fully would show you it is smaller than the picture, and leave you nothing to hope toward. So the ideal stays untested, since an ideal never has to survive an ordinary week and a person does. That running comparison strips a genuinely good bond of credit it earned honestly."
          },
          {
            "label": "TAKE THE ACTUAL EVENING",
            "text": "Pick one connection you are currently grading and write down, this week, the exact place where the ideal is being used as the measuring stick. Then give that person a whole evening you have decided in advance is not being compared to anything at all. When the comparison starts up mid-conversation, put your attention back onto what they actually just said and carry on from there. Afterwards, note one thing the real version did that the picture in your head has never managed."
          }
        ]
      },
      "Changeable Explorers": {
        "title": "Changeable Explorers — The Tension of Novelty as a Requirement for Attraction",
        "fields": [
          {
            "label": "APPETITE FOR FINDING OUT",
            "text": "Curiosity is the strongest thing you bring to a connection, and it works as a real appetite rather than as restlessness dressed up. You go looking inside another person the way somebody else goes looking around an unfamiliar city, and you keep turning things up because you genuinely want to know. Aimed at depth instead of only at what is unfamiliar, that appetite finds more in the third year than the first fortnight ever offered. You open a person further than they are usually opened, simply by staying interested in them."
          },
          {
            "label": "NEW IS THE FUEL",
            "text": "The trouble starts once somebody becomes familiar, because your attention drifts outward exactly when what is in front of it was about to get interesting. It shows first as interest that tracks how much of a person remains unknown, so knowing them well registers as the relationship cooling. The second form is leaving something that was deepening at the moment it had become real, and calling that an absence of spark. Value arrives through discovery, so a season with nothing unfamiliar in it feels like a season where you stopped being alive. Underneath is a colder thought: a fully known person has nothing left to hold you, and you are the same once seen completely. Familiar starts meaning used up long before it has actually been explored."
          },
          {
            "label": "GO DOWN NOT ACROSS",
            "text": "Take the connection you already know best and set aside two evenings this week for the parts of that person you have never actually asked about — the years before you, the things they gave up, the opinions they hold and rarely say. Stay with one of those threads well beyond where you would normally move the conversation along, and add nothing new to your life this week to fill the gap. Keep a note of what turns up that a first meeting could not possibly have handed you."
          }
        ]
      },
      "Unsatisfied Romantics": {
        "title": "Unsatisfied Romantics — The Tension of a Full Life That Still Feels Incomplete",
        "fields": [
          {
            "label": "LIFE ARRIVES THICK",
            "text": "Connection comes to you at volume, and there has rarely been a shortage of people or experiences within your reach. That is capacity rather than luck — you are warm on contact, things start happening around you, and the days fill themselves. You hold a great deal of relationship without dropping any of it, which is its own kind of stamina. Pointed at depth rather than at count, the same pull that fills a room takes a single bond further down than most ever get. Quantity was never going to reach the fullness you are actually after, and one place gone into properly will. You get there by putting everything you have into a single connection instead of spreading it thin."
          },
          {
            "label": "FULL AND STILL HUNGRY",
            "text": "From the outside the life looks abundant, and inside it sits a low constant dissatisfaction you cannot point at or explain to anybody. You see it as reaching for one more person, one more experience, one more beginning, on the assumption that the missing thing is a matter of quantity. Then comes the flatness afterwards, when the new arrival lands and the gap is exactly where it was before. Worth reaches you through how much life you are holding, so a quiet month with few people in it reads as going backwards. Something harder sits under all of that — the emptiness has no connection to quantity at all, going deep with one person would expose exactly that, and it might not close. So the count stays high, because counting is something you can do and depth is something you would have to risk. More experience keeps arriving, and none of it touches what only real closeness was ever going to reach."
          },
          {
            "label": "ONE TAKEN FURTHER",
            "text": "Choose the single connection you would least like to lose and give it your undivided attention for the next fortnight. Add no new people, no new starts, nothing else to the pile. Tell that person something about yourself you have held back because it did not fit the version of you they already carry. Then put the blunter question to them, the one you usually route around, and stay for the entire answer rather than moving things along. Do all of this on ordinary days rather than saving it for an occasion."
          }
        ]
      },
      "Devoted Servants": {
        "title": "Devoted Servants — The Tension of Wholeness Found Only in Total Giving",
        "fields": [
          {
            "label": "GIVES WITHOUT MEASURING",
            "text": "Devotion is available to you at a depth most relationships never ask for, and you give it without needing to be persuaded. When you commit to somebody, the commitment is total — their difficulties become work you do, and you do it steadily rather than in bursts. That capacity is rare and it is not naivety; you know precisely what you are spending and you spend it anyway. Matched by somebody giving back at the same weight, it turns into an intimacy that holds for decades rather than a current running one way. You love somebody through the stretches of their life that most people politely wait out."
          },
          {
            "label": "DISSOLVED INTO THEIR LIFE",
            "text": "Inside a committed bond your own outline goes soft, until there is no answer to what you want that does not start with what they need. The first version: your needs stop being spoken, not out of martyrdom but because you genuinely lose track of where they went. The opposite shows up whenever there is nobody to pour into — you go unmoored, restless, unsure what a day is for without somebody at the centre of it. What makes you count is how much of you a relationship consumes, so a partner who asks for little leaves you feeling useless rather than rested. Below that, rarely looked at directly: without the giving there would be no reason for anybody to keep you, and stopping is how that gets tested. So the giving never pauses, and the bond meant to sustain you is the one leaving you empty."
          },
          {
            "label": "SAY YOUR OWN NEED",
            "text": "Identify something you actually want from your partner this week and say it as a plain request, not as a hint, a joke, or a question about them. Say it early in the conversation rather than at the end, and offer nothing in exchange for it. Let a silence follow instead of filling that silence with reassurance about how fine you are. Do it once more before the fortnight closes, with something slightly larger."
          }
        ]
      },
      "Lovers of Contrasts": {
        "title": "Lovers of Contrasts — The Tension of Needing Opposite Forces to Feel Whole",
        "fields": [
          {
            "label": "DRAWN TO THE UNLIKE",
            "text": "Difference interests you where it makes most people uneasy, and you admire a quality you do not have without feeling smaller beside it. Somebody built on an entirely different frequency strikes you as the most interesting thing in the room rather than something to guard against. That openness lets you get close to people whose temperament, pace and instincts match yours nowhere. You take in what is unlike you and come out larger for it."
          },
          {
            "label": "WHOLE ONLY IN CONTRAST",
            "text": "The appetite for difference hardens into a requirement, and feeling complete starts arriving only through somebody built as your opposite. Part of it is a pull toward partners carrying the exact quality you believe you lack, gripped hard for reasons that have little to do with who they are. Alongside that, anyone reasonably similar to you goes flat within weeks, ruled out for being insufficiently other. Wholeness gets supplied by the contrast, so alone you feel like half a thing rather than one whole person standing still. The harder part sits below that: if the missing quality is not out there in a person, it was always yours to build, and handing the job to a partner keeps it permanently undone while good connections get quietly disqualified."
          },
          {
            "label": "GROW THE MISSING PIECE",
            "text": "Write down the one quality you keep looking for in a partner — the boldness, the ease, the steadiness, whatever it turns out to be once you are specific. Pick the smallest version of it you could practise yourself, and do that version four times this week in situations with nothing to do with romance. Keep it small enough that a bad day does not cancel it, and note which attempt felt least like acting."
          }
        ]
      },
      "Extreme Lovers": {
        "title": "Extreme Lovers — The Tension of All-or-Nothing Intimacy",
        "fields": [
          {
            "label": "RANGE MOST NEVER REACH",
            "text": "Emotional intensity is native to you, and you reach a depth of feeling most relationships are not equipped to visit. None of it is performance — the highs are real, the closeness is real, and you are entirely inside it as it happens. You feel what a situation actually contains rather than a socially manageable version of it, and you can stay there without flinching. Other people run out of range long before you do, and that has never frightened you off going further. Given room for the steady middle as well, that range turns into intimacy that is alive and durable rather than one burning through itself. You take a relationship into places calmer people never find out exist."
          },
          {
            "label": "FULL FORCE OR NOTHING",
            "text": "Connection runs at full power or barely runs at all, and the register between those two feels to you like a room with the lights off. Escalation is half of it — a good evening gets pushed until it becomes an event, because level closeness reads as the bond going cold. Rupture is the rest, where the same force turns and something gets broken hard over what a calmer week would have absorbed. Feeling alive is the measure you go by, so a peaceful stretch registers as proof the feeling has drained out and taken you with it. What sits beneath is rarely said aloud: quiet, undramatic love would show plainly whether the bond is real, and at ordinary volume you might not hold anybody. So the volume stays up permanently. A strong bond wears out from never being allowed to rest."
          },
          {
            "label": "ONE PLAIN EVENING",
            "text": "Set aside one undramatic act of closeness this week — cooking together, a walk, sitting in the same room reading — and let it stay exactly that size. Add no conversation about where the relationship is going. Do not turn it into an occasion, and do not end it early on the grounds that it is quiet. Stay in the low register for the whole hour, paying attention to what is present in it rather than to what is absent. Put two more of them in the diary before Sunday."
          }
        ]
      },
      "Idealistic Revolutionaries": {
        "title": "Idealistic Revolutionaries — The Tension of Needing a Partner Who Shares the Cause",
        "fields": [
          {
            "label": "COMMITTED PAST YOURSELF",
            "text": "Conviction runs deep in you, and you are committed to something larger than your own comfort where most people only discuss it. Beliefs are not held loosely here — they organise your time, your money and where you spend your life, and that consistency is real. A shared purpose makes you an extraordinary partner, because the relationship is not only about the pair of you and never has to be. With room made for closeness that does not require agreement, the same conviction holds difference without treating it as betrayal. You bring your whole belief into a relationship and let somebody stand beside it without having to sign it."
          },
          {
            "label": "AGREEMENT AS ENTRY",
            "text": "Shared belief stops being a joy and becomes the gate, and love gets granted on ideological terms before anything else about a person is weighed. The reflex to test a partner's position early is one half of it, listening for the answer that permits investment rather than for what they actually think. The other is a slow withdrawal from somebody good, where one honest difference gets promoted until it stands in for the entire relationship. Your worth is bound to the purpose you serve, so a partner outside that purpose feels like a compromise of who you are. What you avoid looking at is quieter — closeness without alignment would mean being loved as a person rather than as a position, and that is far less practised ground. So the gate stays up, and somebody right for you in every respect but one gets ruled out."
          },
          {
            "label": "STAY THROUGH THE DIFFERENCE",
            "text": "Take one belief where you and your partner genuinely diverge, and spend twenty minutes this week asking how they arrived there without arguing any of it. Ask what holding that position has cost them and what they have seen that you have not. Say nothing that opens with a correction, and stay in the conversation for the full twenty minutes even after you want it finished. Do it again the following week with the same disagreement."
          }
        ]
      },
      "Cycle of the Past": {
        "title": "Cycle of the Past — The Tension of Repeating What Hasn’t Been Released",
        "fields": [
          {
            "label": "SEES THE REPEATING SHAPE",
            "text": "Once you turn and look at your own relational history directly, you see the shape of it with unusual clarity. You recognise the same setup wearing a different face, and you can name what happened, in order, without softening your own part in it. Acted on rather than only understood, that recognition interrupts an arrangement that has been running unchallenged for years. You catch the old shape as it assembles, and you break the sequence before it completes."
          },
          {
            "label": "THE SAME ROOM AGAIN",
            "text": "You want something new and mean it, and a familiar scenario rebuilds itself anyway — different person, different city, identical underlying shape. Recognition arriving late is the first form, months in, after the arrangement has set and the same roles are already being played. Naming it accurately and carrying on regardless is the second, because knowing what a pattern is turns out not to be the same as declining it. You get your sense of value from understanding, so the explanation gets treated as the work and the different response never gets made. Heavier underneath: the repetition reads as a verdict on what you are capable of, one genuinely different move is how that verdict gets tested, and so it keeps getting called fate instead."
          },
          {
            "label": "ONE DIFFERENT MOVE",
            "text": "Put the scenario that feels most familiar right now onto paper in four or five lines, including what you usually do at the point it turns. Decide one specific different response — the sentence you would normally swallow, the leaving you would normally postpone, the question you would normally skip. Use it the next time the sequence reaches that point, without waiting until you can prove the pattern is running."
          }
        ]
      },
      "Disillusioned Hunter": {
        "title": "Disillusioned Hunter — The Tension of Losing Interest Once the Chase Ends",
        "fields": [
          {
            "label": "BUILT FOR THE PURSUIT",
            "text": "Pursuit is a real talent in you — you close distance, hold attention, and make somebody feel found rather than hunted. There is skill in it and not only appetite: you read what a person responds to, and you commit fully to reaching them. That drive means you rarely end up somewhere by default, because you move toward what you want instead of waiting to be picked. Being obvious about wanting somebody costs you nothing, which most people cannot manage at all. Pointed at what follows the securing rather than only at the securing, the same energy makes staying worth doing well. You go and get the connection you want, and you can put that identical force into keeping it."
          },
          {
            "label": "INTEREST ENDS AT ARRIVAL",
            "text": "The moment a connection is genuinely secure, interest drains out of it, and the drop arrives faster than either of you had reason to expect. Flatness is one side of that — somebody you actively wanted a month ago barely registers now, and nothing about them has changed. The search starting up again is the rest, attention already moving toward the next pursuit and leaving behind people genuinely won and quietly abandoned. Wanting is where aliveness comes from for you, not having, so security lands as boredom instead of as arrival. What you avoid is plainer than it looks: being wanted back with nothing left to win means being known without the performance, and holding somebody from there is a different job entirely."
          },
          {
            "label": "INVEST AFTER THE WIN",
            "text": "Treat one connection you already have as the beginning of something rather than the end of a chase, starting this week. Plan something for it with the effort you would have spent on winning it. Give it two hours you would otherwise have put toward somebody new, and do something the two of you have never done. Skip telling yourself that you are testing whether the interest comes back; just do the work of the week. Book the second one before the first is finished."
          }
        ]
      }
    }
  };
  window.DSexualLineContent = {
    getCode: function (name) { return T.codes[name] || (prev && prev.getCode(name)) || null; },
  };
})();
