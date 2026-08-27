'use strict';
/*
 * past-life-content.js — second-generation overlay for DPastLifeContent.
 *
 * Loaded AFTER js/past-life-content.js and layered on top of it. See
 * js/v2/README.md for the contract. Records carry their own three subheadings
 * in `fields`, so the page renders those instead of the fixed
 * MASTERY / THE SHADOW / INVITATION labels.
 *
 * DELIBERATE DEPARTURE FROM THE BASE FILE. js/past-life-content.js:11-13
 * mandates that all language be hedged ("This placement may suggest a
 * symbolic origin pattern organized around..."). This generation drops that
 * rule. The directness is the point of the rewrite. Nothing about anyone's
 * history is asserted in its place: the origin framing is carried entirely by
 * the title, and the prose speaks only about what the reader is like now.
 *
 * The voice is plain English. No metaphors, no images to decode, everyday
 * words, nothing routing the reader's worth through anyone else's reaction,
 * and a close they could act on this week.
 */
(function () {
  const prev = window.DPastLifeContent;

  const entries = {
    1: {
      title: "The Magician — An Origin Imprint of Beginning Without Finishing",
      fields: [
        { label: "STANDING START",
          text: "You start things other people are still thinking about. The gap between deciding and moving is short enough that a room is often still weighing the idea while you are three steps into it. You can talk that room into a plan and talk somebody into funding it from a standing start, with nothing in your hands but the idea itself. You make things exist where nothing existed, and you can do it again the moment you decide to." },
        { label: "SOLD NOT BUILT",
          text: "What you do with that is charm people into starting and then go once the charm stops being the job. The first weeks of anything belong to you; the months afterwards, when it needs maintenance and follow-through and nobody is impressed by any of it, are when you go looking for the next one. You want the return quickly, and if the work hasn't paid inside a few months you decide it was never going to, which saves you finding out. You would rather move on with the thing still unproven than stay long enough for somebody to tell you how it actually turned out." },
        { label: "FIND OUT WHAT HAPPENED",
          text: "Go back to something you left half-built and find out what became of it. Ask whoever took it over, or look at what it turned into without you, and write down the actual result rather than the version you have been carrying. Do it for the two you least want to check." },
      ],
    },
    2: {
      title: "The High Priestess — An Origin Imprint of Knowing Kept Private",
      fields: [
        { label: "YOU READ IT FIRST",
          text: "You can tell where a conversation is going before the people in it can. What somebody isn't saying reaches you as clearly as what they are, and you feel a room reorganise itself several seconds before anything visible happens in it. None of it comes as reasoning, so you can't show your working — and you are right anyway, often enough and over enough years that you now back yourself against the room." },
        { label: "HELD BACK",
          text: "You wait for somebody else to say it first, and then you agree. Speaking would put you in the middle of the room where you could be got wrong, and that has always felt worse than silence, so you advise and you notice and you stay just outside the thing. There is also something in you that likes being difficult to read, since not being known isn't only a cost, it's a comfort, and you'd sooner be a mystery than be somebody's mistaken first impression. Being trusted is as close as you let anyone get, and you settled for that years ago. People bring you their private lives and go home knowing almost nothing about yours." },
        { label: "SAY IT UNPROMPTED",
          text: "Today, say what you have noticed while the room is still working it out, and put it as a flat statement rather than a question, so nobody can soften it into an opinion afterwards. Pick a room where somebody is likely to disagree with you, and then stay in the disagreement." },
      ],
    },
    3: {
      title: "The Empress — An Origin Imprint of Abundance Without Circulation",
      fields: [
        { label: "MORE ALWAYS COMES",
          text: "You grow things. Money, work, a home, somebody else's belief in themselves: you set the conditions and hold steady while they take the time they take, and running out has never frightened you, because you have always been able to make more of whatever ran out. You can carry a great deal at once and keep producing the whole time you're carrying it." },
        { label: "IT NEVER MOVES",
          text: "It piles up, and very little of it ever leaves. You give in ways that keep a safe distance between you and whoever is receiving, so you fund it, you host it, you're the one who has enough. Calling that generosity has let you avoid noticing how rarely you feel generous while you're doing it. You were well looked after, so giving is a decision you make and not something that happens by itself. You'd sooner be the one with plenty than the one who needs something, and the second position is where being close to anybody actually starts. Somebody hands you something and you're already working out how to repay it before they've finished the sentence." },
        { label: "MAKE SOMETHING FOR NOBODY",
          text: "Make one thing this week that nobody will see and nobody will use — a drawing, a loaf, something badly built in an afternoon. Then the next time somebody offers you anything at all, take it, say thanks, and don't repay it or make a joke to cover the moment." },
      ],
    },
    4: {
      title: "The Emperor — An Origin Imprint of Authority Without Full Accountability",
      fields: [
        { label: "YOU BRING THE ORDER",
          text: "You give shape to situations that would otherwise drift, and the shape you give them holds. When nobody in the room knows what comes next you decide it, and people act on that — not because you argued for it but because you said it like it was already settled. Then you maintain the thing for years after the deciding is over. You build structures other people can stand on, and you keep standing underneath them." },
        { label: "OBEYED, NOT TRUSTED",
          text: "You would rather be obeyed than trusted, because obedience is faster and you can watch it working. So you keep people in line when earning their trust would make the lines unnecessary, and it has worked well enough to keep the question off the table. Some of what holds you up you did not build. The position was there before you were, and you could not honestly say whether you would have built one yourself. You hold your whole idea of who you are inside being competent and reliable, so being needed feels a lot safer than being questioned, and admitting you weren't sure has read as a threat to the position the whole time you have held one. When control slips even slightly you feel it in your body before you have worked out what happened." },
        { label: "LET SOMEONE ARGUE",
          text: "Ask the person at work who is least impressed by you to argue with a decision you have already made, and hear the whole argument before you answer any of it. Say out loud where you think you might be wrong before you defend the part you're sure about." },
      ],
    },
    5: {
      title: "The Hierophant — An Origin Imprint of Belief Inherited Rather Than Chosen",
      fields: [
        { label: "ALL THE WAY UNDER",
          text: "When you take a subject seriously you go the whole distance into it, past the point of usefulness and into how the thing works underneath. You hold some things as close to sacred. You have never felt the need to soften that for anybody. You can teach what you know and have it land in somebody else the way it sits in you. You take an idea and make it survive in another person." },
        { label: "RULES YOU DON'T LIVE BY",
          text: "You teach rules you don't entirely follow, and you hold lines because they are the lines, not because you went back and checked one. Your own experience keeps disagreeing with what you were taught, and when the two meet you side with the teaching. Being right and being on the inside have never come apart for you. Questioning it doesn't feel like thinking, it feels like walking out, so you don't. When honesty would let down the ones who taught you, you drop the honesty." },
        { label: "ACT ON YOUR OWN",
          text: "Choose one thing you're completely certain about and work out where you actually got it. If the honest answer is that you were taught it, then once this month, on one occasion, act on what you have seen for yourself instead. Write down afterwards exactly what happened — not the summary, the detail." },
      ],
    },
    6: {
      title: "The Lovers — An Origin Imprint of Choices Made for Approval",
      fields: [
        { label: "YOU FEEL IT TURNING",
          text: "You know what keeps a connection working, and you know it early. A relationship starts going wrong while it still looks fine from outside, and you feel it happen, and you're usually moving to head it off before the other person has noticed anything, because you hear what somebody needs underneath the thing they asked for. You keep relationships alive through the year that ends most of them." },
        { label: "THE SMOOTH YES",
          text: "You take whichever option causes the least trouble in the room. You'll agree out loud while keeping the preference back, so you end up signed up to something you privately didn't want, and nobody finds out because you're pleasant about all of it. You will not risk being difficult to be around, so you have quietly handed the job of being clear to everybody else, and after a decade of it you have stopped knowing what you would have chosen. Underneath is the thing you're avoiding: every real choice loses you the other one, and rather than feel that grief you wait until the decision makes itself." },
        { label: "DISAPPOINT SOMEBODY",
          text: "Say what you want to the person you'd least like to let down, this week, in a situation where it cannot possibly keep everybody happy, and say it as a statement rather than floating it as a question. Then let them be disappointed and don't step in and fix it for them." },
      ],
    },
    7: {
      title: "The Chariot — An Origin Imprint of Motion Without a Clear Destination",
      fields: [
        { label: "THE SECOND SETBACK",
          text: "You sustain effort well past the stage where most attempts collapse. The sixth week, the second setback, the stretch where it stops being interesting: none of it lands on you the way it lands on everybody who started alongside you, and you are still going when they have stopped. Once you're moving on something you are difficult to stop. You will outlast the thing itself." },
        { label: "NOTHING TO AIM AT",
          text: "All of it is pointed at whatever happens to be nearest. You're running from something rather than towards anything, and from outside the pace looks so much like ambition that you have never had to examine it. You can't sit still, so you fill every gap in the calendar the moment one opens. You've taken other people along at your speed and it suited you a good deal more than it ever suited them. You only believe you're all right when there is visible progress to point at, so slowing down feels like falling behind. The restlessness doesn't stop when you get the thing, and that is the piece of evidence you keep not looking at." },
        { label: "SAY WHAT IT IS FOR",
          text: "Before you take on anything else, say what the current work is actually for, in one sentence, out loud. If you can't finish that sentence, you have your answer. Then turn down whatever you were about to agree to next, and turn it down today." },
      ],
    },
    8: {
      title: "Justice — An Origin Imprint of Judgment Turned Outward",
      fields: [
        { label: "YOU SEE THE IMBALANCE",
          text: "You can see who is carrying more than their share, and you know the exact point an arrangement stopped being fair, usually months before anybody says so out loud. Nobody has to explain it to you, and the history is beside the point. You look at what people are giving each other and you get it right." },
        { label: "ONLY EVER OUTWARD",
          text: "You point it at everybody except yourself. You'll rule on somebody's conduct with real precision and demand from the world a consistency you haven't held yourself to, and the asymmetry doesn't register because you're not doing it on purpose. Unfairness hits you in the gut before you've had a thought about it, and that reaction is older than any of the situations that set it off. Being principled is the one description of yourself you would fight for, which is exactly what makes turning the same standard around expensive. So you don't look, and you haven't looked in years, and you will not do it by accident." },
        { label: "TURN IT AROUND",
          text: "Take the standard you've been holding somebody else to and measure yourself against it this week, privately, in writing. Look for where you fall short of it, not where you meet it. Write the list, then leave it a day before you do anything with it." },
      ],
    },
    9: {
      title: "The Hermit — An Origin Imprint of Wisdom Gathered Alone",
      fields: [
        { label: "YOU REACH THE BOTTOM",
          text: "You think your way through things alone and you get somewhere a conversation would never have taken you. An unresolved question sits comfortably with you, so you don't grab the first workable answer and you're fine without one. You stay in it until you reach the bottom of the thing. You reason where other people react. You come back from being on your own with something nobody could have handed you." },
        { label: "BEYOND RESTORING",
          text: "Past a certain point the solitude stops restoring anything and becomes where you live. You polish because unfinished means nobody can push back on it yet. Somebody arguing with you in real time, in front of you, with no chance to redraft, is the thing you have never been able to sit in. Underneath that, you decided early that keeping a distance would stop people misunderstanding you, and you've kept the distance so consistently that you have very little idea whether they would. You'd rather be respected from a way off than known close up, and you have built a life that mostly offers the first one." },
        { label: "SAY IT UNFINISHED",
          text: "Say something you've worked out before you think it's ready, out loud instead of in writing, to whoever would be quickest to find the hole in it. Let them come back at you, and stay in the conversation for the whole of their reply without going away to reconsider." },
      ],
    },
    10: {
      title: "The Wheel of Fortune — An Origin Imprint of Fortune Unexamined",
      fields: [
        { label: "BOTH ENDS ALREADY",
          text: "You have been all the way up and all the way down, twice over at least, and neither one convinces you any more. A good stretch doesn't make you careless and a bad one doesn't make you believe it's permanent. You have already survived the worst version of this, which means a collapse doesn't stop you moving. You keep working in conditions that put everybody else on hold." },
        { label: "CREDIT AND BLAME",
          text: "The good arrives by timing more than by effort and it goes the same way, and at the time you can never tell which was which. When something works you point at what you did; when it doesn't you point at the circumstances. Your sense of yourself rises and falls with the outcome, and the story adjusts fast enough that neither version teaches you anything. Even in a good stretch you're braced for it to turn, and you don't fully unclench at any point in the cycle. The undramatic middle bores you badly enough that you'll start something just to feel the swing again." },
        { label: "PREDICT THEN CHECK",
          text: "Before each of your next five decisions, write down what you expect to happen and why, and date it. When each one lands, go back and read what you wrote before you tell yourself the story of it. Keep the page where you'll see it." },
      ],
    },
    11: {
      title: "Strength — An Origin Imprint of Endurance Mistaken for Ease",
      fields: [
        { label: "NO DATE ON IT",
          text: "You hold weight that would flatten other people, and you keep functioning underneath it for as long as it takes. The slow kind of difficulty, with no end date and nothing improving for months, doesn't grind you down, and a situation doesn't have to improve for you to keep going in it. You can absorb an enormous amount without it stopping you, and that is not endurance — it's power you have never spent on anything." },
        { label: "OVERRIDING YOURSELF",
          text: "You use it on yourself. What you want, what you're angry about, what frightens you — you push all of it down and hold it there, and weeks later it comes out at somebody who had nothing to do with it, in a form you can't steer. Some of what you've read as respect over the years was people being slightly wary of you, and you have never wanted that difference settled. You would give up almost anything before you'd give up being unbreakable, so you don't ask, because asking would demonstrate that you're not, and you'd rather be exhausted than look like you're not in control of it." },
        { label: "GIVE IT A VOICE",
          text: "Notice one thing you're currently holding down and put it into actual words to yourself, without deciding to do anything about it. Then ask for help with something you could technically manage alone, from whoever you would least like to owe, and let them give it." },
      ],
    },
    12: {
      title: "The Hanged Man — An Origin Imprint of Sacrifice Performed Rather Than Chosen",
      fields: [
        { label: "YOU OUTLAST THE QUESTION",
          text: "Unresolved situations don't panic you. You can hold a question open for months while everybody around you forces something shut just to end the discomfort of not knowing, and you'll still be in there thinking when they've moved on to being wrong about it. You reach answers other people never get to, because you were willing to sit in the not-knowing until one turned up." },
        { label: "WAITING TO BE RELEASED",
          text: "But you're not waiting for the situation, you're waiting for a person. Somebody has to let you go, or you have to be given the feeling that it's finally allowed, and until that comes you stay exactly where you are. Everyone can see what you've given up; nobody can see that you resent it, and the resentment is the one thing in the situation you refuse to look at directly. Putting up with it feels like the better version of you and not the stuck one. You have been ready to move for years and you are standing in the same place." },
        { label: "NAME YOUR TERMS",
          text: "Say the thing you actually want out of this — not what would be fair, not what you would accept under pressure. Say it to the person you have been waiting on, this week, out loud, in one sentence." },
      ],
    },
    13: {
      title: "Transformation — An Origin Imprint of Endings Resisted or Forced",
      fields: [
        { label: "YOU CAME OUT INTACT",
          text: "You've been through change that genuinely took something from you, and you're here. You know what the far end of that feels like, and nobody acquires that knowledge by choice. Rebuilding isn't a theory for you. You have done it, and you could do it again tomorrow." },
        { label: "THE TIMING GOES WRONG",
          text: "Choosing when is the part you can't do. You hold on well past the point the thing is working, until it ends on its own terms and takes more with it than it needed to. Or you end it early, before you have to sit through watching it finish. Both are the same refusal. The middle stretch, where it isn't over and isn't working, is the part you'll do anything to stay out of. Nothing you have lost accounts for how frightened you are of losing things, or of dying, and that fear has been running longer than any single event explains. Being the one who lasts is what you have instead of a reason to stay, so an ending arrives as a judgement on you rather than as a stretch of your life closing." },
        { label: "CHOOSE THE ENDING",
          text: "End the thing you already know is finished, deliberately — tell the person, this month, in words. Say it once. Then don't chase it and don't reopen it." },
      ],
    },
    14: {
      title: "Temperance — An Origin Imprint of Extremes Never Fully Integrated",
      fields: [
        { label: "YOU DECIDE AND BECOME",
          text: "Committing halfway has never occurred to you. When you take something on you take all of it, and you get everything that total commitment pays out. Strict or loose, working or resting, whichever one you're in you are all the way in. You get results a careful, hedged version of the same effort would never come close to. Whatever you decide to be, you actually become." },
        { label: "ONE END AT A TIME",
          text: "You alternate instead of combining. Weeks of severe discipline, then weeks of the opposite, each one presented to yourself as the correction for the last. Or you pick a single version of yourself and hold it so hard that mixing anything in would feel like losing who you are. You'll settle somebody else's contradictions with real skill and leave your own exactly where they've always been. The word you're protecting is disciplined, so sitting in the middle feels like failing at strict and failing at loose at the same time. When a feeling turns up you flatten it out instead of going through the middle of it." },
        { label: "RUN AN ORDINARY WEEK",
          text: "Pick the middle of your two extremes and hold it for a week — the meals, the hours, the bedtime — and don't turn any of it into a system. Write down now what you expect that week to cost you. Write down at the end what it did." },
      ],
    },
    15: {
      title: "The Devil — An Origin Imprint of Bondage Unexamined",
      fields: [
        { label: "THE FULL APPETITE",
          text: "Wanting things has never embarrassed you. Power, comfort, pleasure, the good version of your life: the appetite is real and it is large, and you have let it move you. It has taken you further than caution ever would have. You go after what you want at full size. You don't apologise for the size of it." },
        { label: "WHO HOLDS WHAT",
          text: "You've used what you have to dominate rather than to build. There is also somebody in your life you've stopped being honest about — either they hold more over you than you'd admit out loud, or you hold it over them and they need you enough that they can't say so. Comfort has come to mean safety, so what you're defending is the arrangement and not yourself. You know the habits are there and you have registered every one of them. What you have not done is ask what any of them are protecting you from feeling, and you would sooner keep the habit than find out." },
        { label: "ASK WHAT IT GUARDS",
          text: "Name the habit — you already know which one — and instead of asking why it's bad, ask what you would have to feel if you stopped. Sit with the answer for ten minutes without doing anything about it." },
      ],
    },
    16: {
      title: "The Tower — An Origin Imprint of Structures Maintained Past Their Truth",
      fields: [
        { label: "YOU HOLD IT TOGETHER",
          text: "You keep standing what should have fallen over. A job, a relationship, a version of yourself under strain — you'll hold the structure up long past the point anybody else would have let it go, and you do it without adding panic to the room while you do. You are the reason things that should have come apart didn't." },
        { label: "YOU SET IT ASIDE",
          text: "The warning is early and it's unmistakable, and you put it down. You decide to deal with it later, and then you move later again, and again, until it comes apart on its own schedule instead of the one you could have chosen. Afterwards you rebuild it in the same shape, because you never went back and worked out which part was unstable. Looking solid is worth more to you than being solid. That is exactly why the early signs are unbearable: they are evidence against the thing you most need to be true. Sudden change hits you harder than you let anyone see." },
        { label: "RAISE IT NOW",
          text: "Warn one person about what you think is going to fall over, this week, while there is still time to act on it. You don't need proof first, and you don't need a solution ready before you open your mouth." },
      ],
    },
    17: {
      title: "The Star — An Origin Imprint of Light Kept Deliberately Low",
      fields: [
        { label: "PEOPLE LEAVE STEADIER",
          text: "People leave conversations with you in better shape than they arrived in. You say the thing that makes a situation survivable, and you say it plainly enough that they believe you, and it was never a technique you learned — it was happening long before you noticed it was happening. You change what somebody thinks is possible for them, in ordinary conversation, without trying." },
        { label: "KEPT LOW",
          text: "You've done work almost nobody has seen. You have also been told your light was too much, more than once and by more than one person, and you took it in. Ever since, you've said less than you think, undersold what you can do, and left things at ninety percent, where people can admire them and nobody can judge them. You get your sense of worth from being needed instead of from being seen, and when somebody sees you properly you change the subject inside about four seconds. Underneath all of it there is grief — not regret, grief — for the work you never made and never showed anybody." },
        { label: "FINISH IT AND SHOW IT",
          text: "Finish the thing you've been keeping at ninety percent and put it in front of the person you would most want to impress, without hedging as you hand it over. When they say something good about it, let them get to the end of the sentence, say thank you, and add nothing." },
      ],
    },
    18: {
      title: "The Moon — An Origin Imprint of Illusion Left Unquestioned",
      fields: [
        { label: "BEFORE IT SHOWS",
          text: "You pick up what is going on under the surface of a situation before it shows anywhere in the room. Mood, undercurrent, the gap between what somebody said and what they meant: you get all of it at once, fast and whole. None of it waits for anybody to say a word. You walk into a room and read it in the first ten seconds. You know which of two people is lying before either has finished a sentence. Nothing about a situation stays hidden from you for long." },
        { label: "FEAR WEARING ITS CLOTHES",
          text: "Sometimes you're not picking anything up at all, you're frightened, and from the inside you can't tell the two apart. You never dealt with a grief that is still in you, and you have been making decisions out of it for years without recognising where they came from. You'd rather be intuitively right than factually right, so you don't check, and checking feels like doubting the one thing about yourself you trust. There is something under the surface you keep half-noticing and keep not turning to face." },
        { label: "PUT IT IN TWO COLUMNS",
          text: "Write down the thing you're currently most convinced about. Underneath it make two lists: what you actually know, and what you have assumed. Then read the assumptions back on their own, without the knowns underneath them, and notice how you feel before you start explaining them away." },
      ],
    },
    19: {
      title: "The Sun — An Origin Imprint of Warmth Performed Rather Than Felt",
      fields: [
        { label: "THE ROOM IS BETTER",
          text: "You make things easier for whoever is in the room with you. You turn up warm, consistently, so people relax around you without deciding to. A difficult afternoon goes differently because you were in it. You can change how a room feels on purpose, and you can do it on a day when you feel nothing at all." },
        { label: "THE PERFORMANCE",
          text: "Somewhere along the way it became a thing you do rather than a thing you feel. From outside your life looks like it's going well, and privately a good deal of it is hollow. The two have sat side by side long enough that you've stopped finding it strange. You keep your grief out of the room — not hidden exactly, just never let in — along with anything else that would complicate the picture. You measure yourself by how much better a room feels when you're in it, so the dimmer parts stay off-stage, because you're not sure they'd be as welcome. You have been tired for years and nobody has any idea." },
        { label: "LET IT BE AWKWARD",
          text: "Tell the person who has only ever seen you in a good mood something that isn't fine, and don't make it funny while you're telling them. Don't manage their reaction afterwards and don't tidy the mood up when it's over. Let it be awkward for a minute." },
      ],
    },
    20: {
      title: "Judgement — An Origin Imprint of a Call Deferred",
      fields: [
        { label: "YOU KNOW IT'S OVER",
          text: "Something in your life ends and you know before there is any evidence for it, long before anybody around you has noticed. What needs to happen next comes to you whole, not as a conclusion you reasoned your way to, and you don't argue with it when it turns up. You always know what the next thing is." },
        { label: "HEARD AND NOT ANSWERED",
          text: "You know exactly what you're meant to do and you haven't done it. You live smaller than you're built for because you're afraid of what answering it would cost, and you can name the cost precisely, which is why not doing it takes so much out of you. Meanwhile you find yourself judging anybody who makes the change you won't make, and you dislike that in yourself more than anything else you do. You are diligent and you are well-prepared, and both of those have been standing in for an answer, so you keep preparing, and you have been calling it readiness for a long time." },
        { label: "MOVE WHILE STILL AFRAID",
          text: "Take one step towards the change you've been putting off, the one you'd name instantly if somebody asked. Make it small enough to do today and public enough that you can't quietly let it go. Do it while you're still frightened." },
      ],
    },
    21: {
      title: "The World — An Origin Imprint of Completion Withheld",
      fields: [
        { label: "THE LAST TEN PERCENT",
          text: "You take long, complicated work all the way to the end, including the late stages where the excitement has completely gone and only the boring competence is left. You do the last ten percent that decides whether any of the rest counted. You are still there when the work has stopped being interesting to anybody, including you. You have finished things that took years to finish. You end what you start, and you always have." },
        { label: "THE LINE KEEPS MOVING",
          text: "Then you move the line just before you reach it. When something is undeniably finished you discount it — it was easier than it looked, it doesn't really count, the next one is the real one — so the achievements pile up and you have barely felt one of them. You can't rest afterwards and you can't let it be celebrated, even when you have earned both. Finishing feels more exposed than being in the middle, because while you're still working nobody can tell you how good it was. So you start the next one the same afternoon." },
        { label: "COUNT WHAT YOU DID",
          text: "List the last five things you finished and what each one actually took out of you, in hours and in months, not in how it felt afterwards. Read the list back. Then take a day off that you haven't earned in advance." },
      ],
    },
    22: {
      title: "The Fool — An Origin Imprint of Beginnings Without a Middle",
      fields: [
        { label: "YOU JUMP EARLY",
          text: "You move before you're sure. New places, new work, new people: you commit on a fraction of the information other people need, and without the guarantee they would wait for. That willingness has put you in rooms and countries and situations that caution would have kept you out of entirely, and it is the single most useful thing about you." },
        { label: "UNCHECKED TRUST",
          text: "You extend it without checking, and that has cost you more than once. You also use the moving to stay ahead of being known, since being new to somebody is easier than letting the same people watch you across years, where they'd see the ordinary version of you. You think what you're worth is the newness, and you have not stayed anywhere long enough to find out what else there is. You've tied staying to losing your freedom so tightly that an ordinary uneventful year feels like something closing." },
        { label: "STAY PAST NEW",
          text: "Stay somewhere six months past the point it stops feeling new — one place, one set of people, long enough that they see you on an unimpressive Tuesday. Start nothing else in that time." },
      ],
    },
  };

  window.DPastLifeContent = {
    get: function (arcanaNum) {
      return entries[arcanaNum] || (prev && prev.get(arcanaNum)) || null;
    },
  };
})();
