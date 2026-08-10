/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE SIX LINES — 384 readings
 * ═══════════════════════════════════════════════════════════════════════════
 *  Every key is divided into six lines of 0.9375° each, and the line is the
 *  second axis of the system: it says HOW the key's energy operates, so two
 *  people holding the same key in the same sphere still do not read alike.
 *
 *  A line is a modifier, not a card. It sits under the key's own reading and
 *  never restates it — 1-3 words of keynote, then three sentences of what
 *  this line does to THIS key. The six lines keep a fixed character across
 *  all 64 keys (foundation, natural, trial, influence, projection,
 *  transition) but are written separately for each, so line 3 of Key 12 and
 *  line 3 of Key 41 are different trials.
 *
 *  Only a birth time can place a line: the Sun crosses one in about 23 hours.
 *  DGKProfile therefore returns line: null for a date-only profile and near a
 *  body's own error bar, and the UI shows nothing rather than a coin flip.
 *
 *  Written from the published Shadow/Gift/Siddhi triads and the line
 *  character alone. Checked mechanically for shape, for a present-tense
 *  "You <verb>" opening with no verb reused within a line, and for shared
 *  six-word runs across all 384.
 *
 *  API:
 *    DGKLines.get(keyNum, line) -> { keynote, body } | null
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.DGKLines = (function () {
  'use strict';
  const L = {
  "1": {
    "1": {
      "keynote": "Rooted Freshness",
      "body": "You need the roots of an idea visible before you trust it, and you check the origin before you build on top of it. Preparation is what keeps the work fresh — the reading, the practice, the hours nobody watches. The tradeoff is a long quiet stretch before anything visible appears, and work that stays unfinished until you're certain of it."
    },
    "2": {
      "keynote": "Accidental Originality",
      "body": "You produce original work without registering that you've made anything, because the best material comes out while your attention is somewhere else. Other people call it striking before the word occurs to you. Asked to perform originality on command, you go flat, because forcing your own output turns it into a task you're watching yourself do."
    },
    "3": {
      "keynote": "Ruined Drafts",
      "body": "You get to fresh material by wrecking drafts first — the version that dies, the direction you scrap halfway through. Repeated failure stops rattling you because you've already produced good work out of exactly this process before. What looks like a pile of wasted attempts from outside is the actual method, and nothing you've made well arrived any other way."
    },
    "4": {
      "keynote": "Creative Company",
      "body": "You create through people who already know your work, and your best material moves through that circle rather than to strangers. A friend asking the right question, or handing you a room to try something in, is what gets your best ideas out. A stale circle flattens your output fast, and one honest friendship is enough to bring it back."
    },
    "5": {
      "keynote": "Borrowed Freshness",
      "body": "You produce material other people want to borrow, and they come to you once their own work has stalled. Your ideas get taken up, repeated back to you credited to someone else. The output goes flat the moment you start making things to be seen making them — once the audience matters more than the work, the freshness leaves it."
    },
    "6": {
      "keynote": "Weathered Freshness",
      "body": "You run on long cycles, and the flat stretches in your life aren't failures — they're the trough before the next wave of output. People around you burn out chasing constant novelty while you go quiet for a year and come back with something whole. The cost is the quiet stretch itself, where nothing visible is happening and you start doubting the pattern is real."
    }
  },
  "2": {
    "1": {
      "keynote": "Known Direction",
      "body": "You map your surroundings before you move, and losing direction is what happens when that map isn't built yet. You orient through concrete facts — where you sleep, what you eat, which way the room faces — not through belief. The cost is looking stuck to other people while you're actually locating yourself, and clear direction that only arrives once the map is accurate."
    },
    "2": {
      "keynote": "Unmapped Bearings",
      "body": "You find direction without checking a map first, and the route you pick keeps turning out to be the right one. People follow you across unfamiliar territory and mention afterward that you never hesitated once, which surprises you when they say it. Pressed to explain the route out loud, you lose your thread — the disorientation shows up in the explaining, not in the dark itself."
    },
    "3": {
      "keynote": "Orientation by Detour",
      "body": "You find your bearings by going the wrong way and noticing where it left you. The detour isn't theoretical — you've taken the job, the city, the relationship pointed in the wrong direction, and the wrongness itself is what turned you around. Each of those reads like a lost stretch when you look back, and each one is exactly how you learned direction in your body instead of your head."
    },
    "4": {
      "keynote": "Steadied By Others",
      "body": "You orient through the company you keep, and your sense of direction settles among people who accept you without demanding an explanation. Losing direction shows up in a room of near-strangers, where nothing tells you which way to face or where to stand. Staying loyal to a group with no real warmth in it costs you your bearings, and clarity comes back through a small handful of people, never a crowd."
    },
    "5": {
      "keynote": "Orienting Others",
      "body": "You hold direction for people who've lost theirs, and they show up right when the ground under them stops making sense. Groups form around your read on where to go next, then hold you responsible for the route once they've followed it. Your own disorientation stays hidden under that role, because nobody asks the person holding the map whether they know where they are."
    },
    "6": {
      "keynote": "The Slow Homecoming",
      "body": "You orient over decades rather than days, and the disorientation you felt young turns out to be the first leg of a much longer process. People come to you for direction because you've been lost more thoroughly than they have. The cost is the middle stretch, when you're neither lost nor arrived and you just wait."
    }
  },
  "3": {
    "1": {
      "keynote": "Structured Beginnings",
      "body": "You test something new in small pieces before letting it run, because disorder with nothing underneath it unsettles you. Innovation shows up in you as method — change one variable, note the result, move to the next. Other people call this slow right up until your version is the one that holds, and things settle for you once the ground is proven."
    },
    "2": {
      "keynote": "Quiet Beginnings",
      "body": "You start things quietly, and the new form arrives while nobody's watching, including you. Your best innovation shows up in the mess of something half-finished, and a friend names it before you even register that anything happened. Left to your own timing you're productive; rushed into producing a result, the disorder stops being useful and turns into noise."
    },
    "3": {
      "keynote": "Productive Mess",
      "body": "You innovate by making a mess and then reading it. Disorder is where you actually work — you start without a plan, watch things tangle, and pull the one workable thread out of the wreckage. Other people see disorder and hold it against you, while the innovations you're proudest of all came directly out of a period you'd rather not describe."
    },
    "4": {
      "keynote": "Innovating Together",
      "body": "You innovate in company, and the new thing takes shape once somebody close catches the half-formed version and runs with it. Alone with disorder you stall for weeks; with two people who understand you, order appears inside an afternoon. Your breakthroughs wait on other people's timing, and things click back into place each time a friendship makes the mess feel workable again."
    },
    "5": {
      "keynote": "Innovator On Call",
      "body": "You turn other people's disorder into something workable, and they bring you the mess because none of it rattles you. Your innovations get adopted fast, then credited to whoever presented them upward. People read you two ways — a rescuer while the fix holds, reckless the week an experiment breaks down in front of an audience."
    },
    "6": {
      "keynote": "Late Innovation",
      "body": "You move through disorder in stages, and every chaotic period in your life has ended in a jump nobody around you saw coming. Your innovations arrive late and land whole, because you let the mess run its full course instead of forcing an answer early. The strain is watching people your age ship half-formed ideas while yours is still forming."
    }
  },
  "4": {
    "1": {
      "keynote": "Physicality (bones)",
      "body": "You check an answer against your body before you trust it, not just against the evidence — a conclusion that doesn't sit right physically doesn't get to stand. Impatience with a half-formed idea is what happens when it speaks before it's ready. Real understanding arrives once the logic and the gut agree, and letting go of an old position follows the same slow route."
    },
    "2": {
      "keynote": "Unearned Clarity",
      "body": "You arrive at understanding without working for it, which makes it hard to trust as real knowledge. Someone brings you a problem they've been chewing on for weeks and the answer is simply there, formed. Left alone your mind settles into that clarity; forced to defend it in argument, you harden, and defended understanding is what your impatience sounds like."
    },
    "3": {
      "keynote": "Answers Outgrown",
      "body": "You reach understanding by holding an answer, defending it, and watching it fail in front of you. Your impatience shows up as a certainty you argued hard for and later dropped, which is why you go easy on people still gripping theirs. You stay attached a long time before the collapse, and letting go arrives late but arrives real."
    },
    "4": {
      "keynote": "Friendship First",
      "body": "You understand people a relationship at a time, and your answers make sense inside a friendship before they make sense as theory. The mind that unlocks things for you belongs to somebody you already trust, worked out over a meal rather than across a table in a meeting. Impatience narrows your circle until nobody's left to think with, and it eases at the one connection you closed hardest."
    },
    "5": {
      "keynote": "The Answer Seat",
      "body": "You get asked for the answer, and your grasp of how a thing works is why people keep coming back with questions. Explanations land well when the situation is live and the person is genuinely stuck. Impatience leaks out when you're asked the same question by someone who hasn't done the thinking, and they hear contempt instead of correction."
    },
    "6": {
      "keynote": "Tested Understanding",
      "body": "You outgrow your own certainties in waves, and the answers you defended hardest at twenty are the ones you dismantled at forty. Understanding reached you by being wrong in public and living long enough to watch the correction land. You keep a distance from people still fighting over positions you already held and abandoned."
    }
  },
  "5": {
    "1": {
      "keynote": "Earned Rhythm",
      "body": "You learn your own timing by watching it, tracking what happens when you rush and what happens when you hold. Impatience shows up in your body first — the early start, the second cup, the checking. Patience settles in you as knowledge rather than virtue, and once you trust the rhythm, you stop negotiating with it."
    },
    "2": {
      "keynote": "Built-In Timing",
      "body": "You keep a rhythm nobody taught you, and it holds whether or not anyone approves of its speed. Other people notice that things ripen around you and chalk it up to luck instead of your waiting. Someone else's deadline disrupts that rhythm and impatience floods in — not from the situation, but from the borrowed clock."
    },
    "3": {
      "keynote": "Early Moves",
      "body": "You learn patience by moving early and paying for it. The pattern repeats: you force something before its time, it collapses, and the collapse teaches your body a rhythm no advice ever installed. Impatience doesn't leave you — it gets educated, and what looks like calm from outside is really a long list of moves you made too soon."
    },
    "4": {
      "keynote": "Kept Time Together",
      "body": "You wait alongside other people, and your own rhythm settles when the ones nearest you are steady enough to keep pace with. Impatience rises in you around a companion who rushes, cancels, and arrives late, far more than it does around any task. Your patience tracks the company you keep, and the gap between agitation and ease is the person sitting beside you."
    },
    "5": {
      "keynote": "Timing For Others",
      "body": "You set the pace for people who have no feel for timing, and your patience becomes what they lean on when they want to rush. Being the calm one in the room is a role handed to you rather than chosen. Impatience shows up privately, in the gap between how fast you see the answer and how long everyone else takes to arrive at it."
    },
    "6": {
      "keynote": "Generational Timing",
      "body": "You keep a longer clock than everyone around you, and what reads as patience in you is a different unit of measurement. Whole years pass where you're not visibly doing anything, then a rhythm you set quietly a decade ago comes due. The cost is explaining yourself to people who measure a life in quarters and want progress reports."
    }
  },
  "6": {
    "1": {
      "keynote": "Studied Boundaries",
      "body": "You study a disagreement down to its root cause, unwilling to make peace over something you haven't actually understood. Conflict bothers you less than a truce built on a misreading, so you keep asking questions after everyone else is finished. Your diplomacy rests on homework, not charm, and the peace you reach holds because you know exactly what it's made of."
    },
    "2": {
      "keynote": "Unspoken Diplomacy",
      "body": "You defuse tension without meaning to, and a room settles a few minutes after you walk into it. You've watched an argument dissolve around you and assumed the parties simply ran out of steam, never crediting your own presence. The pattern stays invisible to you until someone else says out loud what you did."
    },
    "3": {
      "keynote": "Fights Survived",
      "body": "You develop diplomacy inside actual fights, not around them. You've said the wrong thing at the worst moment, watched a relationship blow up, and come back later knowing exactly which sentence did the damage. Conflict is where you trained, so your peace isn't avoidance — it's a set of scars you've read carefully, and you keep walking into rooms other people leave."
    },
    "4": {
      "keynote": "Peace Through Allies",
      "body": "You negotiate through relationship rather than argument, and a conflict resolves because both sides already know you well enough to hold their fire. Strangers get your defenses and friends get your diplomacy, and you feel that switch happen in your body before you open your mouth. When a friendship breaks, the fight runs on far longer than it deserves, and it settles only after the personal tie repairs."
    },
    "5": {
      "keynote": "The Called Diplomat",
      "body": "You land in the middle of other people's arguments because your diplomacy is visibly useful there, and both sides come to you first. Each side reads you as sympathetic, then as a traitor the moment you make a point the other side likes. Conflict finds you last of all in your own life, where there's no third party to do for you what you do for everyone else."
    },
    "6": {
      "keynote": "Peace By Example",
      "body": "You withdraw from fights you would once have entered, and the retreat isn't avoidance — it's the shift from combatant to example. There was a stretch when you were in every conflict, then a stretch of watching from a distance, and now people bring you their disputes instead. The difficulty is that stepping back reads as indifference to whoever's still in it."
    }
  },
  "7": {
    "1": {
      "keynote": "Prepared Guidance",
      "body": "You read everything about a role before you accept it, and leading from half-knowledge keeps you up at night. A group nobody has bothered to understand properly looks fractured to you before anyone else notices. Your guidance carries weight because it comes with the reasoning attached, and people feel the difference long before they can name it."
    },
    "2": {
      "keynote": "Guidance Unasked",
      "body": "You lead by being in the room rather than by taking charge of it, and direction sets itself around you. Groups arrange themselves toward your view without a vote, which you notice only after the fact. Guidance you volunteer gets resisted, while the same words offered once you're asked land as leadership instead of interference."
    },
    "3": {
      "keynote": "Led Badly Once",
      "body": "You earn the right to guide by leading badly at least once. Somewhere behind you is a group you split instead of held — you pushed your view, the room divided, and you watched people walk. That failure is why your guidance carries weight now, though you still flinch when a room goes quiet, reading it as the same thing happening again."
    },
    "4": {
      "keynote": "Leading Your Own",
      "body": "You lead the people who already chose you, and your guidance carries weight in proportion to how well the group knows your character. In front of a room with no history with you, the same direction lands flat and the group fractures. Your influence runs on loyalty, and the moment somebody close stops believing you, everyone else feels it before a word is spoken."
    },
    "5": {
      "keynote": "Guidance On Demand",
      "body": "You lead by giving people a direction they hadn't seen, and groups pull you into the front position whether or not you asked for it. Guidance works when the group already trusts you; the same words sound like maneuvering to anyone who doesn't. Division follows the role — every leader collects a faction that wants them gone."
    },
    "6": {
      "keynote": "The Elder Guide",
      "body": "You lead in seasons — years out in front, years off to the side, then a return with something the group actually needs. Division inside a team reads to you as a phase rather than a crisis, because you've watched three of them resolve already. What that costs you is impatience from people who want a decision now instead of a longer view."
    }
  },
  "8": {
    "1": {
      "keynote": "Practised Style",
      "body": "You build your craft from the technical end, learning the rules thoroughly before you break a single one. Presenting something you haven't mastered yet feels flat to you the moment it leaves your hands. Style arrives late and stays, because it grew out of competence instead of taste."
    },
    "2": {
      "keynote": "Unnoticed Style",
      "body": "You carry a style that costs you nothing and reads to everyone else as deliberate. The way you build a sentence, arrange a shelf, choose a shirt — it's simply how you do it, and compliments land as though aimed at someone standing behind you. Any borrowed version of good taste flattens it, and the work goes generic the moment you dress for approval."
    },
    "3": {
      "keynote": "Borrowed Looks",
      "body": "You test styles by wearing them until they fall off. There's a stretch of your life you'd rather not see photographed — the borrowed look, the copied voice, the phase that fit nobody. Every one of those was a real experiment, and your own style exists because you tried the wrong version on directly instead of theorizing about it from a distance."
    },
    "4": {
      "keynote": "Style Passed On",
      "body": "You express what's distinct in you where it's already seen, and the people who know you put your work in front of others. Nobody discovers you cold; a friend says your name in the right room and the opportunity arrives dressed up as luck. Around people who never notice what's particular about you, you feel yourself dulling down to match them."
    },
    "5": {
      "keynote": "Style Made Visible",
      "body": "You wear your style where everyone sees it, and people copy the surface of what you do long before they understand it. Being imitated is flattering for about a month, then it starts feeling like theft. The moment you tune your work to what gets praised, the thing that made it yours quietly leaves it."
    },
    "6": {
      "keynote": "Late Style",
      "body": "You grow into your own style rather than arriving with it, and what looked unremarkable in your twenties was actually a slow assembly. Your taste sits out of sync with your generation, either years early or simply unbothered, and it settles into something unmistakable. The price is the long stretch of looking ordinary before anyone recognizes the shape."
    }
  },
  "9": {
    "1": {
      "keynote": "Detail First",
      "body": "You trace a large task back to its smallest workable piece and start there, because a vague plan stops you cold. Stalling out, for you, isn't laziness — it's a mind refusing to move until the detail is clear. Focus arrives the second the first step is genuinely defined, and from there almost nothing shifts you."
    },
    "2": {
      "keynote": "Unlabelled Discipline",
      "body": "You return to the small thing again and again without calling it discipline. Others watch you put in the hundredth repetition on a detail they abandoned at the third, and they name it determination while you experience it as ordinary. Handed someone else's tiny task, the same attention goes dead and you stall for the rest of the day."
    },
    "3": {
      "keynote": "Restarted Habits",
      "body": "You build determination out of small things you dropped and picked back up. The habit broke, the practice lapsed, the daily thing stopped for months — and you restarted it, which is the whole muscle. You stall constantly, so what reads as discipline from outside is a long record of stopping and beginning again without treating the gap as proof of anything."
    },
    "4": {
      "keynote": "Sustained By Presence",
      "body": "You focus beside other people, and detailed work that defeats you alone turns steady when somebody you like is busy in the same room. Your determination borrows its fuel from company — a partner in the next chair, a shared deadline, someone waiting on the result. You stall the week your people scatter, and the task itself never changed, only who was around while you did it."
    },
    "5": {
      "keynote": "The Detail Fixer",
      "body": "You focus on the small detail everyone else skipped, and that's what people call you in for when a project has stalled. Your value shows in narrow work with real stakes, not in broad advice. Attention on the task keeps you moving; attention on you turns the same task into a performance and you stall."
    },
    "6": {
      "keynote": "The Long Detail",
      "body": "You sustain attention on small things across spans that exhaust other people, and the stalled-out phases in between are how you refuel. There have been years where you did nothing visible, followed by years of grinding away at one detail until it gave. The strain is being read as either lazy or obsessive, depending on which phase somebody catches you in."
    }
  },
  "10": {
    "1": {
      "keynote": "Self Enquiry",
      "body": "You examine your own behavior the way other people examine a text, wanting to know why you do what you do. Watching yourself this closely is the trap — the examining loops and stops being about actually living. Ease comes when the questioning finishes and you simply act."
    },
    "2": {
      "keynote": "Already Yourself",
      "body": "You behave like yourself with no technique behind it, and people relax near you for reasons neither of you puts into words. It shows up most when you're unobserved and half-occupied, which is exactly when you fail to notice it happening. Watching yourself do it breaks it — self-consciousness here is ease under your own surveillance."
    },
    "3": {
      "keynote": "Performed Selves",
      "body": "You get to ease by trying on versions of yourself that don't hold. Each one starts convincing and ends embarrassing — the confident persona, the humble one, the reinvention announced to friends. The ease you have now came from exhausting the performances one at a time, not from being told to stop performing."
    },
    "4": {
      "keynote": "Ease Among Yours",
      "body": "You relax into yourself around people who make no demands, and it's visible only where you feel safely known. Among acquaintances you watch yourself, adjust your voice, check your face; with two or three old friends all of that drops away. Rooms where you're performing pull you back into self-monitoring, and the way out is one person who lets you be boring."
    },
    "5": {
      "keynote": "Ease Under Watch",
      "body": "You model a way of being that other people study without saying so, and they borrow your manner of moving through a day. Ease stops the instant you notice you're being watched, and self-consciousness fills the space it leaves. The trap here is subtle — you start behaving like the version of yourself that others find easy to be around."
    },
    "6": {
      "keynote": "Disappointment/Innocence",
      "body": "You carry a picture of how good things could be, and ordinary life keeps failing to match it — not because things go wrong, but because they merely go normally. The belief that the better version is possible is real and doesn't go away. Relief comes not from lowering the picture but from letting the ordinary version stand next to it unjudged."
    }
  },
  "11": {
    "1": {
      "keynote": "Tested Ideals",
      "body": "You gather proof for your ideas before you share them, since an idea that collapses under questioning embarrasses you deeply. A beautiful notion with no structure holding it up just reads as fog to you. Your vision becomes usable once you've worked out the mechanics, and it lands on people because it arrives with something solid underneath."
    },
    "2": {
      "keynote": "Private Vision",
      "body": "You hold whole worlds in private and assume everyone's inner life looks the same. The images arrive unbidden while you're staring out a window, and you rarely bring them out unless someone you trust asks a direct question. Explained too early to the wrong room, the vision sounds like fantasy and you file it away again."
    },
    "3": {
      "keynote": "Ideals Spent",
      "body": "You put your ideas into the world and let reality hit them. The vision that carried you for two years met an actual budget, an actual person, an actual Tuesday, and what survived that contact is the part worth keeping. Protecting an idea from contact is what keeps it vague, so you keep spending them, and you keep grieving the ones that don't come through."
    },
    "4": {
      "keynote": "Ideas Made Real",
      "body": "You dream out loud with people, and your ideas stay vague until somebody who loves you asks what you actually mean by them. Alone, the vision circles and never lands; in conversation it turns workable within the hour. The gap in you isn't a shortage of ideas but a shortage of the right listener, and you know at once when that person shows up."
    },
    "5": {
      "keynote": "The Vision Supplier",
      "body": "You paint the better version of a situation, and people who've gone flat come to you for exactly that lift. Your read on what's possible is genuinely useful to them, and genuinely hard to deliver on once they expect you to build what you described. The backlash lands the moment a vision goes unbuilt — dreamer becomes the word used about you."
    },
    "6": {
      "keynote": "The Long Vision",
      "body": "You dream in timescales that outrun your own life, and your ideas sit far enough ahead that the present rarely catches up. There were years when you burned with a vision, years when you stopped mentioning it entirely, then a return with something clearer. The edge is loneliness — your peers wanted things you found small, and you said so."
    }
  },
  "12": {
    "1": {
      "keynote": "Considered Speech",
      "body": "You weigh a sentence before it leaves you, and silence is what you choose while the words are still unproven. Talk that outruns its own substance is what you hear in yourself instantly and can't stand. Your judgment about what's worth saying grows out of that pause, not out of moral superiority — it's the accuracy of someone who refuses to speak past what they actually know."
    },
    "2": {
      "keynote": "Instinctive Taste",
      "body": "You reject the false note before you've worked out what's wrong with it. A phrase, a product, a tone of voice — something in you says no, and you've spent years apologizing for a judgment that turned out accurate. That instinct works cleanly in silence; performed for an audience, it turns into showing off, and everybody hears the difference, including you."
    },
    "3": {
      "keynote": "Words Misfired",
      "body": "You sharpen your judgment by speaking badly and hearing the result. Something left your mouth at the wrong moment, landed hard, and rearranged how you use language — that single misfire taught you more than a decade of restraint would have. The impulse that pushed the words out is what built the pause you have now, directly on top of the times you didn't have one."
    },
    "4": {
      "keynote": "Chosen Company",
      "body": "You choose your people carefully, and the quality of your speech, taste, and work rises or falls with whoever's nearby. One hour with somebody real clears a week of noise, and one evening with the wrong crowd leaves you sounding exactly like them. Staying for the status of a circle rather than the people in it is when you hear the compromise in your own voice."
    },
    "5": {
      "keynote": "The Weighted Word",
      "body": "You speak and it carries further than you intended, because your read on what's worth saying gives your words weight with other people. Silence from you reads as judgment; a single sentence reads as verdict. The pleasure of being quoted starts shaping what you say, and that's the first thing that costs you precision."
    },
    "6": {
      "keynote": "Words That Waited",
      "body": "You speak in seasons, and the years you spent silent taught you more about what to say than the years you spent talking. Your read on people and language sharpened through watching rather than arguing, and the few things you say now carry unasked-for weight. The difficulty is that silence from you gets read as judgment."
    }
  },
  "13": {
    "1": {
      "keynote": "Listening Deep",
      "body": "You listen for what sits underneath the words, and a conversation feels incomplete until you've found it. A room where something unspoken is running the whole exchange reaches you as physical discomfort. Your read on people develops through repetition, thousands of conversations sorted and filed, and what people get from you is built on evidence rather than sentiment."
    },
    "2": {
      "keynote": "Told Everything",
      "body": "You hear what people aren't saying and treat it as ordinary information. Strangers tell you things within ten minutes that their own families have never heard, and you've stopped asking why it happens to you. The listening drains you when it's demanded rather than offered, and the tension shows up the day you start collecting confidences instead of receiving them."
    },
    "3": {
      "keynote": "Trust Misplaced",
      "body": "You build discernment by trusting the wrong people and paying attention afterward. Secrets got handed to someone who spread them, or you carried a story you had no business carrying, and the fallout followed you home. Now you hear things in a register nobody taught you to hear, and part of you still wonders whether the lesson was worth the friendships it cost."
    },
    "4": {
      "keynote": "Trusted Listener",
      "body": "You listen people into telling the truth, and the confidences that reach you arrive because you're known as safe, not because you asked. Your role in any group forms without discussion — the one who hears everybody, holds what's said, and sees the pattern first. Carrying that much of other people's private material drains you, and it costs you the day you repeat something given to you in trust."
    },
    "5": {
      "keynote": "The Confided In",
      "body": "You hear what people are actually saying underneath the words, and they tell you things they've told nobody else. That skill makes you the one everybody confides in, which fills you with secrets and leaves you without a confidant of your own. Carrying too many versions of the same story means you know everyone's side and belong to none of them."
    },
    "6": {
      "keynote": "The Long Listening",
      "body": "You hold other people's stories for decades, and what you heard at twenty-five makes sense at fifty in a way it didn't then. Discord in a group registers early for you, and you step out of the room rather than argue, returning once the noise has burned down. The cost is carrying confidences with nowhere to set them down."
    }
  },
  "14": {
    "1": {
      "keynote": "Skill First",
      "body": "You master the work itself before you worry about what it pays, and shortcuts leave you uneasy. Taking a job you haven't earned the ability to do well feels like fraud to you, and you feel it immediately. Competence built at this depth pays for itself on its own — the money follows the skill, and the skill was never faked."
    },
    "2": {
      "keynote": "Easy Competence",
      "body": "You produce more than the people around you while working at what feels to you like half speed. Tasks that exhaust others come apart in your hands, and you assume the work was easy rather than that you're good at it. Taking a job purely for the money kills that flow — your competence gets spent on something you have no appetite for."
    },
    "3": {
      "keynote": "Misspent Years",
      "body": "You grow competence through work that turned out to be the wrong work. Years went into a role, a business, a direction that drained you, and the skill you took out of it is the skill you now use for something that actually pays off. What looks like the theme of your résumé was actually an apprenticeship nobody named."
    },
    "4": {
      "keynote": "Work Through Trust",
      "body": "You earn through the people who've seen your work, and money, projects, and resources travel to you along existing lines of trust. Cold approaches go nowhere, while a recommendation from somebody who's worked beside you closes in a single conversation. The cost is staying inside an arrangement past its life because the relationship matters more to you than the terms do."
    },
    "5": {
      "keynote": "Competence Attracts Money",
      "body": "You attract resources because your competence is visible, and people back you with money, time, and access before you ask. That backing brings expectation — the funders want returns, and their picture of your work stops matching what you're actually doing. Protecting the reputation that brought the resources, rather than the work that earned it, is where you start cutting corners."
    },
    "6": {
      "keynote": "Wealth In Waves",
      "body": "You build in long waves, with fallow periods that alarm everyone but you, followed by a stretch where the work pours out. Money and energy move through your life in cycles rather than a steady line, and you learned to trust the flat parts. The strain is other people reading a quiet year as decline and treating you accordingly."
    }
  },
  "15": {
    "1": {
      "keynote": "Rooted Magnetism",
      "body": "You keep to your own rhythms and your own ground, and being pulled off them flattens you faster than anything else. Living someone else's pattern instead of the one your body knows is what drains you. Your presence returns the moment you're back in your element — the same routine, the same soil."
    },
    "2": {
      "keynote": "Unworked Magnetism",
      "body": "You draw people without doing anything to attract them, and the pull works best when you've forgotten it exists. Someone describes the effect you have on a gathering and it sounds to you like a description of a stranger. The moment you turn it on deliberately it dies — managing your own presence is what flattens it."
    },
    "3": {
      "keynote": "Both Extremes",
      "body": "You swing between extremes and learn your range from the edges. A stretch of flatness, then a period of too much — you've overdone it and gone dead in the same year, more than once. You've lived inside the flat stretch enough that it doesn't scare you anymore, and your presence comes from having tested the whole spread instead of settling for a safe middle nobody remembers."
    },
    "4": {
      "keynote": "Magnetic Circle",
      "body": "You attract people in clusters, and your effect works on the ones who spend real time near you rather than on any audience. Your extremes make sense to friends and unsettle acquaintances, so the closer somebody gets, the more human your strangeness looks. Flattening yourself for a group that only tolerates the average version drains the life out of your days."
    },
    "5": {
      "keynote": "Magnetic To Strangers",
      "body": "You draw people without doing anything to draw them, and strangers decide quickly that you're either wonderful or too much. People read intent into your presence even when there was none, which makes ordinary friendliness get misread. Flattening yourself to avoid the reaction is what kills the room — the extremes of your nature are exactly what makes it warm."
    },
    "6": {
      "keynote": "Seasonal Magnetism",
      "body": "You run on a schedule nobody else follows, disappearing for stretches and then drawing people in effortlessly when you resurface. The quiet months aren't decline, they're winter, and you stopped apologizing for them somewhere along the way. What that costs is friends who only met you in one season and think they know which one you are."
    }
  },
  "16": {
    "1": {
      "keynote": "Practised Range",
      "body": "You practice a thing until the mechanics are boring, and only then does real enthusiasm arrive. Flatness in you is the residue of a skill you never took far enough to enjoy, abandoned at the awkward stage. The range people admire in you is mostly repetition they never watched you do."
    },
    "2": {
      "keynote": "Picked Up Fast",
      "body": "You pick up skills at a rate that embarrasses you to mention. An instrument, a language, a piece of software — you were competent inside a week and concluded the thing was simple rather than that you have a talent for it. Your range dries up under obligation, and flatness is what shows up when the enthusiasm was assigned to you instead of found."
    },
    "3": {
      "keynote": "Abandoned Instruments",
      "body": "You build range by picking things up, dropping them, and keeping what stuck to your hands. The guitar in the cupboard, the language half-learned, the six starts on the same project — each one deposited something even though you filed it as quitting. What looks like mastery in you is assembled out of abandonment, and flatness only shows up once you stop letting yourself begin badly."
    },
    "4": {
      "keynote": "Enthusiasm Shared",
      "body": "You light up around other people's projects, and your skill develops fastest inside a team that keeps handing you things to try. Your excitement is contagious in a group and almost impossible to sustain alone at a desk with nobody watching. Flatness arrives when the people around you stop caring, and your range is inseparable from having somebody worth being good for."
    },
    "5": {
      "keynote": "The Public Demonstration",
      "body": "You demonstrate, and people learn from watching you do the thing rather than from anything you explain about it. Your range puts you in front of audiences early, years before your skill has caught up with the enthusiasm around it. Once the crowd expects the trick, the practice underneath it stops being interesting, and the practice is where your skill actually lived."
    },
    "6": {
      "keynote": "Mastery By Phases",
      "body": "You master things on an arc measured in decades, dropping a skill for years and picking it up transformed. Enthusiasm comes and goes in you, and the flat periods are where the material quietly reorganizes itself. The difficulty is that people meet you in a fallow stretch and conclude you lost interest, when you'd actually gone underground."
    }
  },
  "17": {
    "1": {
      "keynote": "Checked Detail",
      "body": "You verify the small facts before you offer the big picture, and an unchecked claim in your own mouth bothers you all day. Opinion is what your mind produces when it moves ahead of its data. Far-sightedness in you is earned by detail work nobody sees, and the pattern you eventually point to holds up precisely because you hunted for its flaws first."
    },
    "2": {
      "keynote": "Seen In Advance",
      "body": "You spot the shape of what is coming before the evidence is in, and you say nothing about it for years. When the thing finally happens, someone remembers you mentioning it once and calls you far-sighted, which surprises you more than the event did. Pushed to give a view on demand, the seeing collapses into opinion, and opinion is where your accuracy goes to die."
    },
    "3": {
      "keynote": "Blown Forecasts",
      "body": "You form a view, commit to it publicly, and watch some of them blow up. Being wrong in front of witnesses is how your seeing got calibrated — the confident call that missed did more for you than the ten that landed. Opinion still comes fast and hard, and the far-sightedness people rely on is simply the residue of every forecast you have already got wrong."
    },
    "4": {
      "keynote": "Trusted Sight",
      "body": "You advise the people who already respect you, and your reading of what is coming lands only where there is history between you. Given to a stranger, the same observation sounds like arrogance; given to a friend, it sounds like foresight. Opinion hardens in a circle that agrees with everything you say, and far-sightedness survives only where one person argues back."
    },
    "5": {
      "keynote": "Early Sight",
      "body": "You see where a situation is heading well before the people inside it do, and they ask you for that read. Being right early is not the same as being believed early; you get dismissed, then quoted, then treated as though you engineered the outcome. Opinion is the shadow — the habit of being right hardens into pronouncement, and far-sightedness narrows to a single angle."
    },
    "6": {
      "keynote": "The Roof View",
      "body": "You see further out than the conversation you are standing in, and this has made you strange company since childhood. Your opinions arrive early and get proven right too late for anyone to remember, which stopped bothering you around the third time. The edge is a habit of watching rather than joining, even when joining is what you want."
    }
  },
  "18": {
    "1": {
      "keynote": "Grounded Critique",
      "body": "You inspect a system from the inside out, and your corrections land because you took the trouble to learn how it works. Judgement is the shortcut version — the flaw named before the structure is understood — and you recognise the difference in yourself. Integrity here is thoroughness, and the perfection you serve is not a standard you impose but one you uncovered."
    },
    "2": {
      "keynote": "Uninvited Accuracy",
      "body": "You notice the flaw in a system the way other people notice a smell in a room. It arrives unbidden, complete, and you have learned to keep half of it to yourself because saying it aloud costs you friends. Solicited, that eye is integrity and improves everything it touches; unsolicited, the identical remark lands as judgement and you get blamed for the accuracy."
    },
    "3": {
      "keynote": "Corrections That Cost",
      "body": "You calibrate your eye for what is broken by aiming it wrong first. You named a flaw in someone, were right about the flaw and wrong about everything around it, and the fallout stayed with you. Judgement is your raw material, and integrity showed up the day you started checking your corrections against what they actually did to a person standing in front of you."
    },
    "4": {
      "keynote": "Correction With Care",
      "body": "You improve things for the people you love, and your eye for what is wrong is a gift inside a relationship and an attack outside one. Family, close friends and long colleagues get your corrections, and they land because the person knows you are for them. Judgement turns corrosive the moment you aim it at somebody who never invited you in, and the friendship pays before the point is made."
    },
    "5": {
      "keynote": "The Named Flaw",
      "body": "You notice what is broken in a system and say so, and organisations bring you in precisely because your integrity makes you willing to name it. The same honesty that gets you hired gets you resented by whoever built the thing. Judgement is the edge — correction delivered without warmth reads as attack, and the flaw you named goes unfixed out of spite."
    },
    "6": {
      "keynote": "Judgement Retired",
      "body": "You retire your judgements the hard way, by watching them fail across enough years to distrust the reflex. What replaced it is a quieter accuracy — you name what is broken once and then leave it alone. The edge is that people keep bringing you their wreckage expecting a verdict, and delivering one is the part of it you no longer enjoy at all."
    }
  },
  "19": {
    "1": {
      "keynote": "Safe Base",
      "body": "You secure the basics first — shelter, food, the people who stay — and everything else waits behind that. Co-dependence appears when the base is shaky and you attach yourself to whoever seems to hold it. Sensitivity works properly once your own ground is settled, and the sacrifice you make then is chosen rather than extracted from you by fear."
    },
    "2": {
      "keynote": "Unfiltered Reception",
      "body": "You feel the mood of a house the second you step through the door. Nobody taught you this and you assume everyone has the same equipment, so you rarely allow for the fact that a crowded day leaves you flattened. Alone, the sensitivity is a clean instrument; overexposed and unnamed, it turns into co-dependence, and you start needing the people you were reading."
    },
    "3": {
      "keynote": "Distance Miscalculated",
      "body": "You work out your need for people by getting the distance wrong repeatedly. Too close and you lost yourself inside someone; too far and you went cold and called it independence — both were experiments, run at full cost. Co-dependence is not an abstraction to you, and the sensitivity you have now is the reading you took from being inside it and getting out."
    },
    "4": {
      "keynote": "Few And Deep",
      "body": "You bond deeply and with very few at a time, and your whole sense of wellbeing rests on the state of two or three connections. You know within minutes of walking in whether a group has room for you, and your body answers well ahead of your thinking. Co-dependence is the near miss here: wanting the bond so much that you agree to arrangements which leave you smaller."
    },
    "5": {
      "keynote": "Needs Made Plain",
      "body": "You sense what a group actually needs before anyone has articulated it, and you get pushed forward to say it out loud. Speaking for other people’s needs makes you their representative, and representatives get blamed when the need goes unmet. Co-dependence is the cost — your own sensitivity gets spent entirely on reading the room, and nobody in the room reads you."
    },
    "6": {
      "keynote": "The Weathered Nerve",
      "body": "You feel what a group needs before anyone in it says so, and you learned to step away rather than absorb all of it. Long stretches of solitude follow long stretches of closeness with everyone, and both are necessary to you. What costs you is being needed most at the exact point you have gone quiet to recover."
    }
  },
  "20": {
    "1": {
      "keynote": "Certain Words",
      "body": "You wait until you actually know something before you say it, which makes your speech rare and heavier than other people’s. Superficiality is the chatter you produce when you are nervous and filling space, and you hear the hollowness as it happens. Self-Assurance grows from a store of things you have genuinely verified, and presence is what remains when nothing unexamined is left to defend."
    },
    "2": {
      "keynote": "Unrehearsed Presence",
      "body": "You occupy a space without arranging yourself for it, and that is the whole of your authority. People report feeling met by you in conversations you barely remember having, because you were simply there and not composing a version of yourself. Preparation ruins it — the rehearsed line lands as superficiality, while the unplanned sentence carries every ounce of your self-assurance."
    },
    "3": {
      "keynote": "Spoken Too Soon",
      "body": "You practise presence by talking when there was nothing to say and feeling the room register it. The remark that covered a silence, the answer given before you had anything real behind it — superficiality is something you have heard in your own voice. Self-assurance grew out of those moments, not out of confidence training, and you still catch the impulse arriving a half-second ahead of the words."
    },
    "4": {
      "keynote": "Present With Yours",
      "body": "You show up whole in the presence of people you trust, and your words carry weight in exact proportion to how known you feel. In a room of acquaintances you talk about nothing and leave tired; with one real friend the same hour is alive. Superficiality is the tax on a wide circle, and self-assurance returns when you shorten the guest list rather than the conversation."
    },
    "5": {
      "keynote": "Presence On Show",
      "body": "You arrive and the room adjusts around you, which has nothing to do with effort and everything to do with presence. People decide about you in the first minute, and the decision holds regardless of what you do afterwards. Superficiality is the risk in that — self-assurance without anything behind it still works on a crowd, and you know the difference before they do."
    },
    "6": {
      "keynote": "Presence By Season",
      "body": "You arrive fully in a room or you are not there at all, and no version of you hovers politely at the edges. Years of engagement alternate with years of near-total retreat, and both look complete from the outside. The difficulty is that whoever met you in one phase feels abandoned when the other one starts."
    }
  },
  "21": {
    "1": {
      "keynote": "Earned Authority",
      "body": "You earn the right to lead by knowing the job better than the people you lead, and borrowed authority feels false in your hands. Control is what you reach for when the ground under your position is thin. Authority settles once your competence is unarguable, and the valour in you shows as the willingness to stand behind a decision you fully understand."
    },
    "2": {
      "keynote": "Unclaimed Authority",
      "body": "You take charge only when nobody else will, and then it looks like it cost you nothing. Your authority is most convincing in the moments you never asked for it — a crisis, a leaderless meeting, a decision everyone was avoiding. Claiming the role in advance flips it into control, and the people who followed you willingly start counting what you take."
    },
    "3": {
      "keynote": "Reins Dropped",
      "body": "You grip something too tightly, lose it, and find out what authority actually is. A team, a project, a person walked because you held the reins hard — that loss did the teaching no leadership book managed. Control is still your first reflex under pressure, and the difference now is that you notice the grip closing while there is time to open the hand."
    },
    "4": {
      "keynote": "Authority By Consent",
      "body": "You hold authority by consent, and people follow you because of the relationship first and the position a long way second. A team that likes you gives everything it has; a team assigned to you gives the minimum and calls that compliance. Control is what appears when you stop tending the relationships and start pulling rank, and everybody registers the change immediately."
    },
    "5": {
      "keynote": "Authority Conferred",
      "body": "You take charge when nobody else will, and people hand you authority they would resent in anyone else. That handover comes with a condition nobody states: stay useful, stay in front, keep delivering. Control is what the role becomes when you start defending the position instead of doing the job — and the same people who raised you up notice first."
    },
    "6": {
      "keynote": "Isolation/Care",
      "body": "You end up carrying a cause largely alone, not because nobody agrees with you but because agreeing quietly and actually devoting your life to it are two different commitments. The isolation isn't rejection, it's the natural distance between someone who has taken responsibility and everyone who is still deciding whether to. What sustains you through it is care outlasting the loneliness of holding it."
    }
  },
  "22": {
    "1": {
      "keynote": "Steady Manners",
      "body": "You hold your composure by knowing your limits, and you protect the conditions that keep you civil. Dishonour arrives on the days you are depleted and something slips out that stays with you long afterwards. Graciousness for you is a matter of conditions — sleep, space, the right amount of company — and grace becomes reliable once those stop being neglected."
    },
    "2": {
      "keynote": "Effortless Grace",
      "body": "You handle difficult people gracefully without any sense of having handled anything. A relative behaves badly at dinner and the evening survives it because of something in your manner that you would struggle to describe. That graciousness runs on its own current; asked to perform charm for a room that has not earned it, you feel the dishonour immediately."
    },
    "3": {
      "keynote": "Composure Lost",
      "body": "You lose composure somewhere visible and rebuild from there. Something ugly came out of you under strain — the tone, the outburst, the thing said in front of people who mattered — and dishonour stopped being a word. Graciousness in you carries the weight of that, which is why it steadies other people, and why you still replay the moment at odd hours."
    },
    "4": {
      "keynote": "Warmth In Company",
      "body": "You open easily with people, and your warmth moves through gatherings, shared meals and small kindnesses rather than through anything formal. Your graciousness is clearest where there is history: the friend in crisis, the relative nobody else has patience for. Dishonour comes from spreading yourself so wide that nobody gets the real thing, and you feel that emptiness before anyone mentions it."
    },
    "5": {
      "keynote": "Graciousness Watched",
      "body": "You steady other people simply by how you handle yourself when things go badly, and they watch you for the cue. Graciousness under pressure builds a reputation you then live inside, including on days when you have nothing to give. Dishonour arrives through performance — the charm still works when the heart is absent, and you feel the fraud long before anyone says it."
    },
    "6": {
      "keynote": "Grace Over Time",
      "body": "You carry your own history openly, including the parts that shamed you, because hiding them cost more than the shame ever did. Your graciousness came out of collapse rather than upbringing, which is why it holds under pressure that breaks the polished version. What this costs is patience with people performing composure they have not paid for."
    }
  },
  "23": {
    "1": {
      "keynote": "Reduced To Essentials",
      "body": "You break a complicated thing down until only the necessary part is left, and you refuse to speak before that point. Complexity overwhelms you not from any lack of capacity but because you go the whole distance through it. Simplicity in you is the residue of that labour, and quintessence is what survives when everything unnecessary has been removed."
    },
    "2": {
      "keynote": "The Plain Sentence",
      "body": "You strip things to the bone without effort and assume the plain version was obvious all along. In a meeting full of elaborate framing, one short sentence from you ends the discussion, and you leave believing you contributed nothing. Explanations exhaust you — pressed to unpack the simple thing at length, you produce complexity, and the original clarity disappears inside your own words."
    },
    "3": {
      "keynote": "Overexplained First",
      "body": "You say it complicated, watch eyes glaze, and cut. Every simple sentence you own now has a long overexplained ancestor that lost the room — you found the essence by talking past it repeatedly and noticing where attention died. Complexity is your default draft, and the compression people admire is the second or fifth attempt, never the thing that came out first."
    },
    "4": {
      "keynote": "Plain Speech",
      "body": "You simplify for people who already listen, and the clear thing you carry lands only when the person in front of you is ready. Said to the wrong audience, your plainness sounds blunt and the room closes before your point has been understood. Complexity is where you retreat when nobody is listening, and the simple version comes back the moment one person asks you honestly."
    },
    "5": {
      "keynote": "The Plain Sentence",
      "body": "You reduce a tangled thing to one plain sentence, and people come to you when they have stopped understanding their own situation. Timing decides everything: the same clear sentence delivered a beat too early sounds arrogant, delivered when asked it sounds like relief. Complexity returns when you elaborate to prove you did the work — and the simplicity that made you valuable disappears."
    },
    "6": {
      "keynote": "Distilled By Decades",
      "body": "You distil things down over years, and the sentence you say at fifty took three decades of complexity to become that short. People hear something obvious from you and miss entirely that it is the residue of everything you took out. The edge is being underestimated for saying little, by people who mistake volume for depth and never check."
    }
  },
  "24": {
    "1": {
      "keynote": "Known Patterns",
      "body": "You return to the same question until you have taken it apart, and half an answer leaves you restless. Addiction here is the loop you run when the underlying thing stays unexamined — the same comfort reached for at the same hour. Invention arrives once you have finally traced the pattern to its source, and the silence underneath is what you were circling all along."
    },
    "2": {
      "keynote": "Idle Invention",
      "body": "You invent in the gaps — showering, driving, lying awake — and never while sitting down to invent. The idea returns to you unfinished for weeks and then completes itself in a second, which makes your best thinking impossible to schedule. Filling every gap with input starves it, and addiction here is whatever you reach for to avoid the silence inventions come out of."
    },
    "3": {
      "keynote": "Loops Ridden Out",
      "body": "You ride the same loop until it wears through. A thought, a substance, a person, a pattern returned and returned — and the invention came out of the hundredth return, not the first. Addiction taught you its own shape from the inside, so you recognise a loop in someone else instantly, and you still catch yourself circling something and calling it thinking."
    },
    "4": {
      "keynote": "Habits Of Company",
      "body": "You return to the same people and the same patterns, and your mind repeats whatever the company around you keeps feeding it. A new circle rewrites your habits faster than any private resolve, and the old circle restores them just as quickly. Addiction here is relational as much as chemical, and invention arrives after you change who you spend your evenings with."
    },
    "5": {
      "keynote": "The Repeat Performance",
      "body": "You produce something genuinely new, and then everyone wants it again — the same insight, the same form, on demand. Invention runs on a rhythm of emptiness that an audience has no patience for, and the pressure to keep supplying is constant. Addiction takes hold there: you return to the well before it has refilled, and what comes up is a copy."
    },
    "6": {
      "keynote": "Cycles Of Silence",
      "body": "You cycle through the same material again and again, and each return brings you to the same place from a higher angle. Patterns you thought you had finished with reappear a decade later wearing different clothes, and you recognise them faster now. The cost is watching yourself repeat something while knowing exactly what it is."
    }
  },
  "25": {
    "1": {
      "keynote": "Named Wound",
      "body": "You face your own injury directly, wanting to know its exact shape instead of living around it. Constriction is the flinch that comes before that work, the small closing you notice in your chest when something touches the sore place. Acceptance arrives in you as understanding, never as surrender, and the universal love people feel from you rests on ground you dug yourself."
    },
    "2": {
      "keynote": "Unguarded Warmth",
      "body": "You love without deciding to, and it goes out to animals, strangers and difficult relatives at the same easy temperature. People describe you as open long before you experience yourself that way, since nothing about it feels like a virtue from the inside. One unkindness taken personally shuts the whole system down, and constriction sets in far faster than the acceptance returns."
    },
    "3": {
      "keynote": "Reopened Heart",
      "body": "You open, get hurt, close, and open again — that cycle is the curriculum. Constriction is familiar territory because you have gone into it after each injury and found your own way back out, without anyone talking you through it. Acceptance arrived through repetition rather than insight, and the part of you that hesitates before opening again has never fully stopped hesitating."
    },
    "4": {
      "keynote": "Love Through Few",
      "body": "You love through specific people, and the warmth in you reaches the world one relationship at a time rather than all at once. The wound in you was made in relationship and heals there: a friend who stays, a person who sees you at your worst. Constriction shows as a closed circle you defend, and acceptance widens the day somebody new gets past the door you kept shut."
    },
    "5": {
      "keynote": "The Open Door",
      "body": "You absorb people as they are, and the ones nobody else has room for come straight to you. Your acceptance gets read as endless supply, so it gets used without much thought about what it takes from you. Constriction is what closes afterwards — one betrayal too many and the door shuts, and everybody notices, because your openness was the thing they relied on."
    },
    "6": {
      "keynote": "The Old Wound",
      "body": "You absorb hard blows early and spend the middle of your life making sense of them rather than dodging the next. Acceptance arrived in you as an ordinary fact, not a breakthrough, somewhere after you stopped negotiating with what happened. What that costs is a quiet distance from anyone still convinced their own wound is unique."
    }
  },
  "26": {
    "1": {
      "keynote": "Honest Ground",
      "body": "You rehearse your case until every claim in it holds, because an inflated word from you collapses the whole thing. Pride is what fills the space where preparation is missing, and you sense the padding as you speak. Artfulness in you is accuracy about your own worth, neither more nor less, and invisibility becomes easy once there is nothing left to inflate."
    },
    "2": {
      "keynote": "Unstudied Persuasion",
      "body": "You persuade people while believing you merely described the situation. Something in your timing and your choice of words moves the outcome, and you put the result down to the merits of the case rather than to your handling of it. Self-consciousness is what brings pride in, and the artfulness that worked invisibly becomes a technique everyone sees through."
    },
    "3": {
      "keynote": "Overplayed Hand",
      "body": "You oversell something, get caught, and learn where the line sits. The pitch that stretched, the story improved slightly in the telling, the claim you could not back — pride pushed each one, and someone saw through it. Artfulness became real for you at the point of exposure, and you still feel the small pull to add one more detail than the truth holds."
    },
    "4": {
      "keynote": "Word Of Mouth",
      "body": "You persuade the people who trust you, and your influence spreads by word of mouth from those who have watched you deliver. Selling to strangers exhausts you, while a warm introduction turns the very same pitch into a conversation between friends. Pride shows up as trading on connections you stopped maintaining, and people withdraw their recommendation long before they tell you why."
    },
    "5": {
      "keynote": "The Persuader’s Mirror",
      "body": "You sell things — ideas, people, yourself — and your artfulness makes the case land where a plain argument would not. Audiences respond to the framing, then wonder afterwards whether they were handled, and that suspicion attaches to you personally. Pride is the hinge: you use the same skill on your own story until you no longer know which parts of it are true."
    },
    "6": {
      "keynote": "Chosen Invisibility",
      "body": "You vanish on purpose now, having spent years out in front of people and learned exactly what that visibility costs. Influence works better for you from outside the frame, and you stopped needing your name attached somewhere in your thirties. The difficulty is that disappearing at the right moment looks, to everyone still competing for room, like surrender."
    }
  },
  "27": {
    "1": {
      "keynote": "Own Reserves",
      "body": "You feed yourself properly before you feed anyone, having learned what happens when your own supply runs out. Selfishness and its opposite both look extreme from a distance, and you have measured your actual capacity instead of guessing at it. Altruism from a full store lasts, and the selflessness in you is a fact about your reserves, not a decision you keep making."
    },
    "2": {
      "keynote": "Automatic Care",
      "body": "You feed people before you have thought about whether you want to. The care goes out automatically — a lift arranged, a plate made up, a message sent at the right hour — and none of it registers with you as generosity. Nobody names the limit for you either, so you keep giving past the point where altruism turns into depletion and then resentment."
    },
    "3": {
      "keynote": "Miscalibrated Giving",
      "body": "You overgive, resent it, pull back entirely, and find the actual measure somewhere in between. Both errors were run at full scale — the years of feeding everyone until you were empty, and the season of guarding yourself so hard nobody got near. Selfishness and altruism are both familiar from the inside, and you calibrate the amount every single time."
    },
    "4": {
      "keynote": "Caring For Yours",
      "body": "You feed the people in your circle, and your care lands on the ones you know rather than on causes at a distance. Your generosity is practical and personal: the lift given, the meal cooked, the person checked on without being asked. Selfishness here is not meanness but depletion, and you go quiet on everybody in the week your own reserves run out."
    },
    "5": {
      "keynote": "Visible Giving",
      "body": "You feed people — literally, or with time, attention, care — and generosity is what your name means to them. Being known for it changes the act itself: help given in view of others carries a charge that help given quietly does not. Selfishness hides inside the role, because a reputation for altruism is a thing you protect, and protecting it is about you."
    },
    "6": {
      "keynote": "Rationed Giving",
      "body": "You feed people in seasons and pull the shutters down in between, because you learned what unlimited giving did to you. There was a stretch of taking, a stretch of giving everything away, and then a settled version that keeps something back. The cost is guilt when you say no, even though the no is what makes the yes real."
    }
  },
  "28": {
    "1": {
      "keynote": "Meaning Sought",
      "body": "You question the point of a thing before you commit your life to it, and hollow answers give you no rest. Purposelessness is not despair in you — it is the honest report of a mind that has not found bedrock yet. Totality arrives when you finally do, and everything you were withholding goes in at once, which is where immortality stops being an idea."
    },
    "2": {
      "keynote": "All In Already",
      "body": "You go all the way into things without noticing there was another option. Half-measures are foreign to you, and friends describe your intensity as a choice when it has always been the only setting you had. Left without something worth entering, that same totality has nowhere to land, and purposelessness arrives as a flat grey week you fail to explain."
    },
    "3": {
      "keynote": "Total Bets",
      "body": "You throw yourself all the way into things that do not work out. The venture, the move, the relationship you gave everything to and lost — and the giving-everything is the part that changed you, not the outcome. Purposelessness shows up hardest in the aftermath of one of these, and totality returns the moment you commit to the next thing without a guarantee."
    },
    "4": {
      "keynote": "Depth With Company",
      "body": "You risk everything alongside people, and the leaps that define your life are taken with somebody else in the room. The dark stretches move faster when one person stays close and refuses to be frightened by what you are going through. Purposelessness deepens in isolation, and totality returns through a relationship that survives the version of you nobody else wanted to meet."
    },
    "5": {
      "keynote": "Totality As Spectacle",
      "body": "You go all the way into things, and people watch that willingness with a mixture of admiration and alarm. Your totality gets held up as inspiration by people who have no intention of living that way themselves, which is lonely in a specific manner. Purposelessness bites hardest between commitments — with nothing to give yourself to, the audience is all that remains."
    },
    "6": {
      "keynote": "The Long Dark",
      "body": "You walk into the dark stretches instead of around them, and the purposelessness that flattened you in one decade became the ground of the next. Death and meaning have been ordinary subjects for you since you were young, which set you apart from your friends early. The edge is that people find your calm about endings unnerving rather than comforting."
    }
  },
  "29": {
    "1": {
      "keynote": "Informed Yes",
      "body": "You look hard at what you are agreeing to, because a promise made in ignorance costs you months. Half-heartedness follows a yes you gave without checking, and your body drags through everything after it. Commitment made from full knowledge runs differently — you stop reconsidering, you stop leaking energy — and devotion becomes the plainest state you know."
    },
    "2": {
      "keynote": "The Instant Yes",
      "body": "You say yes from somewhere below thought, and your body has agreed before your reasoning catches up. The commitments that hold are the ones nobody talked you into — the ones that simply arrived and felt like a fact rather than a decision. Every yes given to please someone drains halfway through, and half-heartedness is what a borrowed commitment feels like from inside."
    },
    "3": {
      "keynote": "Blind Leaps",
      "body": "You leap before you have the information and land wherever you land. Some of those jumps went nowhere, and the ones that failed taught you the difference between your true commitment and the half-hearted version you also know intimately. The cost is real time spent behind wrong doors, and you have stopped reading a bad outcome as an argument against jumping."
    },
    "4": {
      "keynote": "Promises To People",
      "body": "You commit to people before plans, and the yes that changes your life is said to a person rather than a project. Your energy holds while the relationship holds, and it drains the moment you are working for somebody you do not care about. Half-heartedness sets in where the promise was made out of loyalty to the wrong person, and your body knows before you admit it."
    },
    "5": {
      "keynote": "The Public Yes",
      "body": "You say yes in front of witnesses, and your commitment pulls other people in behind you — they join because you jumped. That makes every withdrawal public: leaving a thing you started is read as betrayal rather than as an honest ending. Half-heartedness is the trap, staying inside a commitment past its life because too many people are watching to back out cleanly."
    },
    "6": {
      "keynote": "Commitment In Cycles",
      "body": "You commit in whole chapters and then close them, and each yes of yours has had a natural end you honoured. Half-heartedness shows up as the signal that a phase is over rather than as a flaw in your character. What this costs is explaining to people that leaving something well is different from abandoning it."
    }
  },
  "30": {
    "1": {
      "keynote": "Known Desire",
      "body": "You watch your own wanting closely, learning which fires burn clean and which leave you wrecked. Desire is not the problem for you — desire you have not studied is, and the difference is written all over your past. Lightness comes from knowing your appetites well enough to stop fearing them, and rapture arrives on a night you were entirely ready for."
    },
    "2": {
      "keynote": "Native Lightness",
      "body": "You burn brightly with no idea that other people find you warming. Your appetite for a piece of music, a meal, a conversation runs hotter than most, and you have been told to calm down by people who were simply cooler by nature. Chasing the feeling deliberately converts lightness into desire, and the pursuit puts out precisely the fire it went looking for."
    },
    "3": {
      "keynote": "Desires Followed Down",
      "body": "You chase a desire the whole way down and discover what was at the bottom of it. Each one promised something, delivered less, and burned off a layer of illusion in the process — that is how lightness got built in you, not through renunciation. Desire still arrives at full strength, and you follow it now with your eyes open about where it ends."
    },
    "4": {
      "keynote": "Shared Longing",
      "body": "You burn for things in company, and your desires take their heat from the people who share them with you. A friend’s excitement pulls you into new appetites, and their loss of interest cools yours faster than any disappointment of your own. Desire turns heavy when you chase what a circle values instead of what moves you, and lightness returns among people who want the same things."
    },
    "5": {
      "keynote": "The Wanted Fire",
      "body": "You burn visibly, and other people put their own longing onto that fire — they want what you seem to have. Desire aimed at you from every direction is flattering and exhausting in equal parts, and it distorts every ordinary friendship. Lightness is what breaks the loop, and it goes first whenever you start managing the impression instead of feeling the thing."
    },
    "6": {
      "keynote": "Desire Burned Through",
      "body": "You burn through desires at a rate that alarms people, and what remains is a lightness they mistake for detachment. Whole appetites that ruled a decade of your life simply stopped, and you did not grieve them for long. The cost is that intensity still finds you, and you know precisely how the story ends before it starts."
    }
  },
  "31": {
    "1": {
      "keynote": "Backed Voice",
      "body": "You prepare before you speak in front of anyone, and an unsupported statement from your mouth haunts you. Arrogance is the tone that appears when confidence outruns groundwork, and you catch it in the recording afterwards. Leadership in you comes from having done the reading, so people follow the substance and not the volume, and humility stays because you know how the certainty was built."
    },
    "2": {
      "keynote": "The Unsought Voice",
      "body": "You speak and people move, which has never made much sense to you. The words arrive plainly, without campaigning behind them, and afterwards someone tells you that a whole room changed direction on a sentence you had forgotten saying. Leadership taken rather than given curdles here — arrogance is the sound of your voice used before anyone wanted to hear it."
    },
    "3": {
      "keynote": "Voice Ahead",
      "body": "You speak up, take the room, and later hear how it sounded. Arrogance is not a stranger — there was a period when your voice ran ahead of your understanding and people followed you somewhere you had not thought through. Humility came from that specific embarrassment, and it is why what you say now carries further than it did when you were louder."
    },
    "4": {
      "keynote": "Heard By Yours",
      "body": "You speak for the people already standing with you, and your voice carries because a group is behind it, not because of a title. Words that come out of real relationship move a room, and the same words from a platform with nothing behind them fall flat. Arrogance is talking past your own circle to an audience that never chose you, and the ones who did choose you stop answering."
    },
    "5": {
      "keynote": "The Spoken Word",
      "body": "You voice what a group has been thinking and had no words for, and that single act makes you their leader. Your influence lives entirely in the speaking, which means it evaporates the moment your words stop matching how you actually live. Arrogance is the near miss — believing the voice belongs to you rather than passing through you, and humility is what keeps it true."
    },
    "6": {
      "keynote": "The Quieter Voice",
      "body": "You quieten down after years of speaking too loudly, and the voice that came back carries further for having been withdrawn. Leadership reaches you as something people hand over rather than something you claim, which took a long humbling to arrange. The edge is a low tolerance for anyone still enjoying the sound of their own certainty."
    }
  },
  "32": {
    "1": {
      "keynote": "Proven Precedent",
      "body": "You research what has already been tried before you back anything, and untested enthusiasm makes you nervous. Failure in your life traces back to the thing you moved on before the groundwork was finished. Preservation is your instinct because you know what a foundation costs to lay, and veneration arrives naturally in someone who has counted the work that came before."
    },
    "2": {
      "keynote": "Instinct For Keeping",
      "body": "You know what is worth keeping without consulting a rule about it. In a room of enthusiasms you hold the one thread that survives the decade, and people call it caution when it is closer to a sense of smell. Nobody sees the instinct working until the discarded thing is missed — and the fear of failure arrives when you start defending rather than preserving."
    },
    "3": {
      "keynote": "Wrecks Sorted",
      "body": "You fail at things and keep the parts worth keeping. Failure is already the ground of this one, and you meet it twice over: the collapsed business, the ended line of work, the thing that did not survive, and the useful bones you carried forward from each. Preservation in you means knowing exactly what to save from a wreck, because you have sorted through several."
    },
    "4": {
      "keynote": "Kept Connections",
      "body": "You preserve relationships across decades, and what lasts in your life lasts because of the people who stayed inside it with you. Old friends, family lines and long working partnerships are the actual structure of your career, whatever the job title says. Failure here is a network left to fade, and you notice the loss years afterwards when there is nobody left to call."
    },
    "5": {
      "keynote": "The Trusted Keeper",
      "body": "You keep what matters going, and groups give you their traditions, records and institutional memory to hold. Being the custodian means everyone notices when something is lost, and nobody notices the hundred things you preserved without incident. Failure lands heavily in this role, because the reliability people assume in you leaves no space for the ordinary mistake anyone else would be forgiven."
    },
    "6": {
      "keynote": "The Long Memory",
      "body": "You outlive the things you build and keep what mattered from each one, which is why your failures read differently to you than to anyone watching. You think in generations — what came before you, what you hand on — and this made you old company at twenty-five. The cost is grief for things nobody else remembers well enough to mourn."
    }
  },
  "33": {
    "1": {
      "keynote": "Kept Record",
      "body": "You record what happens so it stays available to you, and losing the thread of your own history unsettles you. Forgetting is the shadow you fight with notebooks, dates, and the retelling of things you refuse to lose. Mindfulness in you is deliberate rather than serene, and revelation comes late, arriving as the pattern in material you kept for years without knowing why."
    },
    "2": {
      "keynote": "Retreat Without Reason",
      "body": "You withdraw at intervals you never planned, and something in you completes itself while you are out of contact. Friends notice the pattern before you do — weeks of full presence, then a stretch where you answer nothing, then a return with something clearly settled. An interrupted retreat loses the material, and what you were about to remember slips back into forgetting."
    },
    "3": {
      "keynote": "Second Passes",
      "body": "You forget what you already worked out and go through it a second time. The same mistake returns in a new outfit, you walk into it, and this time it lodges — the mindfulness you have is built out of second passes, never first ones. Forgetting keeps coming back, and each repeat costs you months you would rather have spent elsewhere."
    },
    "4": {
      "keynote": "Told To Someone",
      "body": "You retell your life to whoever is nearest, and hard experience turns usable the moment it is spoken to somebody who cares. Withdrawal is real for you, and every return is into the same few relationships that quietly waited it out. Forgetting is what happens while you keep the story to yourself, and the meaning of a hard year appears as you describe it to a friend."
    },
    "5": {
      "keynote": "The Told Story",
      "body": "You retell your own experience and other people take it as instruction, which turns private history into public material. What you lived through becomes a story with a shape, and each telling smooths it further from what actually happened. Forgetting works differently here — the polished version replaces the memory, and the revelation that came out of the real thing goes quiet."
    },
    "6": {
      "keynote": "The Retreat Cycle",
      "body": "You retreat on a rhythm that has run your whole life — full engagement, then a withdrawal nobody quite understands, then a return with something new. What you bring back from those absences is never the thing you originally went looking for. The difficulty is that the withdrawal reads as rejection to whoever is left standing there."
    }
  },
  "34": {
    "1": {
      "keynote": "Trained Strength",
      "body": "You train before you act, and raw power without technique behind it strikes you as an accident waiting to happen. Force is what your energy becomes when it moves before the preparation is done, and the wreckage afterwards is yours to clear. Strength in you is disciplined and therefore usable, and the majesty others notice is the visible part of years of unglamorous conditioning."
    },
    "2": {
      "keynote": "Unflexed Strength",
      "body": "You work at a level of physical and mental output that reads to you as normal Tuesday behaviour. Others get tired watching you, and the strength shows most when you are absorbed rather than trying — hauling, building, finishing something at midnight without noticing the hour. Directed at proving a point, the same energy turns into force, and force costs you the people nearby."
    },
    "3": {
      "keynote": "Walls That Held",
      "body": "You push hard in a direction that was wrong and feel the whole thing buckle. Force is native to you, so the lesson never came from being told to ease off — it came from a wall that did not move and something in you that broke instead. Strength now means knowing which walls are load-bearing, and the pushing reflex has not gone anywhere."
    },
    "4": {
      "keynote": "Strength For Others",
      "body": "You act in bursts, and your strength finds its direction through the people who ask you for something specific. With no one to serve, that power turns into busyness: motion without a point, energy spent on things that matter to nobody. Force is what strength becomes when you push straight past the people around you, and the room empties without anyone explaining why."
    },
    "5": {
      "keynote": "Strength On Display",
      "body": "You act, and people read power into the action whether or not you intended any display. Your strength gets recruited: others want you in front of their fight, arguing their case, carrying their weight. Force is the distortion — strength used to hold an image of yourself burns twice the energy and none of it goes into the actual work."
    },
    "6": {
      "keynote": "Tempered Force",
      "body": "You temper your own force over decades, and the strength you carry now moves at a fraction of its old speed. There were years of pushing through everything and years of deliberately doing nothing, and the second taught you more. What that costs is a body that remembers the first stretch and little patience for people still burning fuel that way."
    }
  },
  "35": {
    "1": {
      "keynote": "Prepared Departure",
      "body": "You plan the journey before you take it, and leaving without knowing what waits on the other end drains the pleasure out of it. Hunger drives you toward change, then strands you somewhere you researched nothing about. Adventure works for you when the groundwork is laid first, and boundlessness arrives to a person who knows exactly what they are stepping away from."
    },
    "2": {
      "keynote": "Wandering By Nature",
      "body": "You wander into experiences other people plan for months, and it happens without a single deliberate decision. A conversation turns into a trip, a trip turns into a year abroad, and you narrate all of it afterwards as though it simply occurred. Scheduled adventure goes flat in your hands — hunger arrives when you start pursuing the next thing instead of meeting it."
    },
    "3": {
      "keynote": "Dead Ends Walked",
      "body": "You go after the new thing, exhaust it, and go after another. Half your history is dead ends walked all the way to the end — the scene that emptied out, the business that stalled, the trip that solved nothing. Hunger drives every one of them, and adventure for you is not romance — it is a long line of things you started and left unfinished."
    },
    "4": {
      "keynote": "The Influential Mind (inflexible)",
      "body": "Your mind moves other people almost by accident — an idea said in passing gets repeated back to you months later, changed, in a room you weren't in. The same conviction that makes you persuasive can calcify into a position you won't reconsider, especially once other people have started quoting it back at you. Influence stays alive only as long as the mind that carries it does too."
    },
    "5": {
      "keynote": "The Watched Leap",
      "body": "You change course in ways other people find thrilling to watch and impossible to copy, and they live vicariously through your adventures. Your life becomes a story told at other people’s dinner tables, edited down to the exciting parts. Hunger is what the audience never sees — the restlessness that starts the next leap before the last one has finished teaching you anything."
    },
    "6": {
      "keynote": "Reverence/Alienation",
      "body": "You can see far enough ahead that the present moment sometimes looks small by comparison, and that distance can read to others as coldness rather than what it actually is — reverence for something larger than the room you're in. Alienation sets in when the vision stops including the people standing right next to you. The long view was only ever meant to widen the near one, not replace it."
    }
  },
  "36": {
    "1": {
      "keynote": "Lived Terrain",
      "body": "You absorb difficulty by studying it, turning each hard passage into something you understand instead of something you merely survived. Turbulence hits you hardest when it arrives before you have any framework for it, and the disorder feels bottomless. Humanity in you is knowledge of the terrain, gathered the slow way, and the compassion you offer carries the weight of someone who has been down there."
    },
    "2": {
      "keynote": "Fellow Feeling",
      "body": "You recognise the wreckage in another person instantly, having lived through enough of your own to stop being shocked by it. That recognition costs you nothing and does more for people than advice ever has, though you count it as no achievement. Left unnamed, the same openness takes on everyone’s turbulence as well as your own, and you lose track of which is which."
    },
    "3": {
      "keynote": "Crisis Survived",
      "body": "You pass through the hard thing rather than around it, and come out with something usable. Turbulence has already visited you at full strength — the period you do not describe at parties — and you are still here, which is the entire qualification. Humanity is not a philosophy for you, and the reason people bring you their worst news is that yours does not shock you."
    },
    "4": {
      "keynote": "Crisis With Company",
      "body": "You survive turbulence in company, and the hardest passages of your life are made bearable by whoever refused to leave. What you went through becomes useful to others personally, one friend at a time, in a kitchen rather than from a stage. Isolation makes the chaos worse than it is, and your humanity comes back the moment you tell one person the truth."
    },
    "5": {
      "keynote": "Crisis Consultant",
      "body": "You survive things, and people in the middle of their own crisis seek you out because you have been there. Your humanity is the credential, which means the worst period of your life is the part of you that gets asked about. Turbulence returns and you handle it privately now, because the people who lean on you have no picture of you falling apart."
    },
    "6": {
      "keynote": "Turbulence Behind You",
      "body": "You outlast turbulence that would define a smaller life, and it becomes the thing people come to you for. Crisis in someone else’s life does not frighten you, because you have already been there and come out the other side. The edge is being handed everyone else’s emergencies as a matter of course, while your own long quiet years go entirely unnoticed by the same people."
    }
  },
  "37": {
    "1": {
      "keynote": "Home Ground",
      "body": "You provide the practical base a family runs on, and a household with no reliable floor under it makes you anxious. Weakness in you is the promise made to keep the peace and quietly regretted afterwards. Equality arrives when you have worked out what you actually sustain, and the tenderness you offer stops being performance once the arrangement is honest."
    },
    "2": {
      "keynote": "Household Warmth",
      "body": "You warm a household simply by being in it, and no member of that household has ever explained this to you. The cooking, the small rituals, the way people relax at your table — it all runs on something you would call nothing special. Given away endlessly without acknowledgement, the same tenderness thins into weakness, and you agree to terms you never chose."
    },
    "3": {
      "keynote": "Bonds Broken",
      "body": "You break a family bond, live without it, and understand what it was made of. The falling-out, the years of silence, the reconciliation that took work on both sides — that is how equality got into your relationships instead of the old hierarchy. Weakness shows as the pull to smooth things over early, and some repairs in your life only held after the break."
    },
    "4": {
      "keynote": "Family Bonds",
      "body": "You belong to your people, and the family you gather, whether blood or chosen, is the ground everything else in your life stands on. Your agreements get made warmly and informally, sealed by affection instead of by anything written down. Weakness here is a bargain you keep out of loyalty long after it stopped being fair, and everyone in the house feels the imbalance."
    },
    "5": {
      "keynote": "The Family Hinge",
      "body": "You anchor a family or a team, and everyone in it brings you their disputes to settle. Warmth is your method, which works beautifully until people mistake your tenderness for an obligation and start expecting it on schedule. Weakness shows as the inability to disappoint anyone — equality means you belong to the group, not that the group owns your evenings."
    },
    "6": {
      "keynote": "The Returning Elder",
      "body": "You return to family after long periods away, and each return happens on different terms than the last. There was a time you needed them, a time you kept your distance entirely, and now you are the one holding the room. The cost is that your absences got recorded and your presence gets taken as permanent."
    }
  },
  "38": {
    "1": {
      "keynote": "Chosen Fight",
      "body": "You pick your battles by finding out what is genuinely worth the damage, and fighting on unclear ground exhausts you fast. Struggle becomes pointless when you have not established what you are defending. Perseverance is available to you in enormous quantities once the cause is verified, and honour is what other people call your refusal to quit something you understood before you started."
    },
    "2": {
      "keynote": "Built To Outlast",
      "body": "You outlast everyone in the room without experiencing yourself as tough. The thing that broke three other people is still on your desk, and you continue with it out of something closer to stubbornness than courage. Fights you pick yourself exhaust you — struggle sets in when the cause was chosen for effect, and perseverance only holds for what genuinely matters to you."
    },
    "3": {
      "keynote": "Battles Misjudged",
      "body": "You fight things worth fighting and things that were never worth it, and only afterwards tell which was which. The struggle you gave years to belonged to somebody else, and the perseverance you built there is real regardless of the cause. Struggle is how you find out what matters to you, and the bill arrives in time rather than money."
    },
    "4": {
      "keynote": "Fighting For Yours",
      "body": "You fight for people rather than for principles, and your perseverance holds as long as somebody you love is worth the effort. A cause with no face behind it drains you, while a friend in trouble gives you stamina you had no idea you had. Struggle turns pointless when you defend a relationship that stopped defending you, and honour asks who the fight is actually for."
    },
    "5": {
      "keynote": "Fixer",
      "body": "Groups hand you the thing nobody else could get moving, not because you volunteered but because you were visibly capable of it. You inherit responsibility by being competent in the room, which is a different mechanism than being asked, and it costs you the choice of whether to take it on. The risk is carrying every group's unfinished business as if it were yours to finish alone."
    },
    "6": {
      "keynote": "The Long Fight",
      "body": "You endure across timescales that make other people’s struggles look like sprints, and you have outlasted several things meant to break you. The fights you pick now are chosen rather than inherited, which took most of your youth to sort out. What this costs is a tiredness that shows up between rounds, in the years nobody is watching."
    }
  },
  "39": {
    "1": {
      "keynote": "Aimed Provocation",
      "body": "You aim your pressure at something specific, having worked out where the blockage actually sits before you push. Provocation without that homework makes noise and nothing else, and you feel the waste immediately afterwards. Dynamism in you is precise, applied at the one point that moves, and the liberation that follows surprises everyone except the person who located the weak seam."
    },
    "2": {
      "keynote": "Unintended Spark",
      "body": "You stir people up by existing, and half the time you have no idea what you said. A single remark lands like a match, the room comes alive, and the person who reacted hardest tells you later it changed something. Aimed on purpose, that spark becomes provocation and everybody feels the difference — the dynamism only works when it was not intended."
    },
    "3": {
      "keynote": "Provocation Backfired",
      "body": "You provoke, misjudge the moment, and take the return fire. There is a person you pushed before they were ready, or a room you lit up that turned on you — and that miss taught you timing nothing else would have. Provocation stays your instrument, and you now feel the difference between the push that opens someone and the one that just wounds."
    },
    "4": {
      "keynote": "Provoking Friends",
      "body": "You provoke the people close to you, and the pressure you apply frees them where the relationship is strong enough to hold it. Strangers experience you as difficult, and the ones who know you wait for the moment you say the thing nobody else says. Provocation without relationship costs you the connection and changes nothing, and you learn which friendships survive being told the truth."
    },
    "5": {
      "keynote": "Power and Projection",
      "body": "What you resolve privately becomes, without your choosing it, something other people watch and measure themselves against. Your own reckoning gets projected outward into a kind of public authority you never applied for, and your voice starts carrying more weight than you expect. The work is staying honest about the private struggle even once it has been read as strength."
    },
    "6": {
      "keynote": "Provocation With Purpose",
      "body": "You provoke less than you used to and land harder when you do, having spent years learning where pressure actually helps. The disruption you caused young was indiscriminate; now it is aimed, and people brace when you go quiet. The edge is a reputation built in an earlier phase that follows you into rooms where it no longer fits."
    }
  },
  "40": {
    "1": {
      "keynote": "Counted Energy",
      "body": "You guard your energy by knowing exactly how much of it exists, and vague demands on your time alarm you. Exhaustion arrives when you said yes without having counted the cost first. Resolve becomes solid once the boundary is based on real numbers instead of mood, and the divine will people sense in you moves through a body that is not depleted."
    },
    "2": {
      "keynote": "The Bodily No",
      "body": "You refuse things cleanly when the refusal rises from your body rather than your reasoning. The no arrives without drama and holds, and people respect it far more than the long justifications you attach to it afterwards. Every yes you talk yourself into costs a week — exhaustion here is the bill for resolve you overrode instead of trusted."
    },
    "3": {
      "keynote": "Emptied and Rebuilt",
      "body": "You run yourself into the ground, recover, and find out where your actual limit sits. Exhaustion is not a warning you read about — it happened, more than once, and each collapse moved the line you now hold. Resolve in you includes the word no, learned the expensive way, and you still test the edge to check whether it has moved again."
    },
    "4": {
      "keynote": "Chosen Loyalties",
      "body": "You give your energy to people, and the whole question of your health is who you have said yes to. Family and old friends take the largest share, and resentment builds quietly in the gap between what you offered and what was assumed. Exhaustion arrives from staying loyal past your limit, and resolve looks like one relationship where you finally state the terms out loud."
    },
    "5": {
      "keynote": "The Reliable One",
      "body": "You deliver, and that reliability makes you the person everyone routes their difficult tasks through. Your resolve is read as capacity without limit, so the requests keep arriving and the word no lands like a personal rejection. Exhaustion is the bill — the reputation was built on saying yes, and every refusal now costs a piece of it."
    },
    "6": {
      "keynote": "The Learned No",
      "body": "You reorganise your whole relationship to work after it breaks once, and the boundary you keep now was expensive. Long stretches of output alternate with genuine withdrawal, and you defend the withdrawal like it is a job. The difficulty is the people who knew you during your giving years and still turn up expecting that version of you to answer them."
    }
  },
  "41": {
    "1": {
      "keynote": "Grounded Beginning",
      "body": "You sit with a new impulse for a long time before acting on it, testing whether the feeling has anything under it. Fantasy is the version that stays in your head, elaborate and unbuilt, and you know the difference by the weight. Anticipation becomes reliable once you have checked the source, and what emanates from you then started as something you took entirely seriously first."
    },
    "2": {
      "keynote": "Early Weather",
      "body": "You sense a new chapter beginning before there is any external sign of one. The feeling shows up as restlessness with no object, weeks ahead of the phone call or the offer that explains it, and that gap is where you distrust yourself most. Filling the wait with elaborate imagined outcomes turns anticipation into fantasy, and the real beginning walks past unrecognised."
    },
    "3": {
      "keynote": "Fantasies Cashed",
      "body": "You take a fantasy all the way into reality and see what it actually was. The imagined future you chased for years arrived in some form, felt different than expected, and that gap did more work on you than any warning. Fantasy still starts every cycle, and anticipation is now something you sit inside rather than something that pulls you out of the present."
    },
    "4": {
      "keynote": "Waiting On Invitation",
      "body": "You begin through other people, and the fresh start you sense coming arrives as an invitation rather than your own initiative. The feeling builds for weeks with nowhere to put it, and then somebody calls and the whole thing has a direction. Fantasy fills that waiting with imagined versions of what is coming, and the real opening is smaller and more human than the one you pictured."
    },
    "5": {
      "keynote": "The Starting Signal",
      "body": "You start things, and other people wait for your signal before they move — your beginning gives them permission. Anticipation is your real material, and the moment before something begins is where you do your best work. Fantasy takes over when the audience wants a launch on schedule: you announce what has not arrived yet, and the pressure builds from there."
    },
    "6": {
      "keynote": "The Long Anticipation",
      "body": "You wait for beginnings that arrive on their own schedule, having learned young that forcing one produces nothing at all. Whole years pass in a holding pattern, then something starts in you and everything reorganises around it within weeks. The cost is the holding pattern itself, and the effort of convincing people that you are not stuck."
    }
  },
  "42": {
    "1": {
      "keynote": "Full Cycle",
      "body": "You finish what you start, and an ending you never understood keeps pulling at you years later. Expectation is what you attach to an outcome before you have grasped how the process actually works. Detachment arrives through completion rather than philosophy — you saw the whole arc once, from beginning to end — and celebration follows a cycle you closed properly."
    },
    "2": {
      "keynote": "Unceremonious Release",
      "body": "You release things without ceremony and are puzzled by how hard other people find it. A job ends, a friendship completes, a chapter closes, and you are already elsewhere while everyone else is still processing the loss. Nobody credits you for the skill until they watch you do it — and expectation is what creeps in whenever you script the ending in advance."
    },
    "3": {
      "keynote": "Endings Overstayed",
      "body": "You hang on past the ending, get dragged, and learn the shape of a clean finish. Jobs, relationships, chapters that were finished months before you let go — each overstay taught you something about expectation that leaving early never would. Detachment came to you the hard way rather than by temperament, and you still notice how long it takes you to admit a thing is over."
    },
    "4": {
      "keynote": "Endings Between People",
      "body": "You finish things through relationships, and the endings that matter in your life are endings with people rather than with projects. You stay in touch past the natural close, holding on to a group or a partnership that completed itself a year ago. Expectation makes the goodbye harder than it is, and detachment shows up as an ordinary last conversation that leaves nothing unsaid."
    },
    "5": {
      "keynote": "The Closer",
      "body": "You end things cleanly, and people bring you their unfinished business because your detachment makes the last step possible. Being useful at endings gets you called in at the worst moments and rarely at the good ones, which shapes how people picture you. Expectation does the damage here — everyone assumes you feel nothing about the closures, and you let them assume it."
    },
    "6": {
      "keynote": "Endings Made Clean",
      "body": "You end things properly, which set you apart from everyone you grew up with, most of whom let things trail off. Each phase of your life closed with a definite line, and you moved on without much looking back. What that costs is a coldness other people read into you when the closing is actually care."
    }
  },
  "43": {
    "1": {
      "keynote": "Slow Insight",
      "body": "You work an idea over for months before it becomes speakable, and rushing that process produces nothing you trust. Deafness is what the outside world calls your silence while the thinking is still underground. Insight arrives whole because it was assembled slowly, and the epiphany that lands on other people took you three years of private labour to reach."
    },
    "2": {
      "keynote": "Solitary Knowing",
      "body": "You think best with nobody else in the building, and the insight surfaces whole rather than in steps. Trying to walk someone through the reasoning frustrates you both, because there was no reasoning — the thing simply appeared and it was correct. Too much company for too long produces the deafness: the signal is still there, and the noise has covered the channel."
    },
    "3": {
      "keynote": "Advice Ignored",
      "body": "You ignore the good advice, hit the thing it warned about, and only then hear it. People told you plainly and it did not land: deafness here is literal, and the message arrives through the consequence instead. Insight when it comes is unmistakable and entirely yours, which is also why the same cycle keeps costing you the same amount."
    },
    "4": {
      "keynote": "Heard Insight",
      "body": "You think in leaps, and the insight stays private noise until a trusted person hears it and hands it back in ordinary words. Among strangers your timing is wrong and you interrupt; with two friends the identical idea arrives exactly when it is useful. Deafness runs both ways here, since you stop listening and then nobody listens to you, and the isolation makes your thinking stranger."
    },
    "5": {
      "keynote": "The Untimely Insight",
      "body": "You break something open in your own understanding, then hand it over to a room that is not ready for it. The insight is real and the delivery is badly timed, and the two get judged together as one thing. Deafness runs both directions — they stop listening, you stop bothering, and the epiphany sits unused between you."
    },
    "6": {
      "keynote": "Insight Held Back",
      "body": "You incubate an idea for years while everyone assumes you have nothing, and then it arrives whole and unarguable. Being out of step with your peers started early — what interested you at fifteen interested them at thirty. The edge is the deaf stretch in between, where you carry something you are not yet able to explain."
    }
  },
  "44": {
    "1": {
      "keynote": "Vetted Alliances",
      "body": "You vet the people you work with, wanting to know their history before you hand them anything that matters. Interference is what you get from a team assembled in a hurry, and you saw the flaw at the start. Teamwork built on real knowledge of each person holds under pressure, and synarchy is what that becomes when everyone’s ground has been checked."
    },
    "2": {
      "keynote": "Reading Character",
      "body": "You read people on contact and know within a minute who belongs in which role. The judgement is instantaneous and almost never wrong, yet you present it as a hunch because there is no evidence you would put in writing. Overriding that instinct to be fair or polite is how interference enters, and the team you assembled starts working against itself."
    },
    "3": {
      "keynote": "Soured Partnerships",
      "body": "You pick the wrong people to work with and find out why in the middle of a project. The partnership that soured, the hire who was never right, the collaboration where everybody interfered with everybody — those readings live in your body now. Interference is something you smell early because you have been inside it, and you still second-guess the instinct when you like someone."
    },
    "4": {
      "keynote": "Right People",
      "body": "You recognise people instantly, and your entire life turns on whether you act on that reading or talk yourself out of it. The teams that work for you were assembled by instinct, and the ones that fail contain somebody you knew was wrong on day one. Interference is what follows when you keep the wrong person out of loyalty, and everybody else quietly stops bringing their best."
    },
    "5": {
      "keynote": "The Team Builder",
      "body": "You assemble people who work well together, reading instantly who belongs where, and organisations pay you for that instinct. Your reputation travels through the people you placed, which means their successes and their failures both come back to your name. Interference is the shadow version — arranging people because the pattern is obvious to you, when nobody invited the arranging."
    },
    "6": {
      "keynote": "Faces From Before",
      "body": "You recognise people on first meeting in a way that has proven accurate more times than you are comfortable with. Teams form around you in phases — years inside one, years alone, then a return in a different role. The cost is knowing early how a working relationship ends and staying anyway because the timing is not yours."
    }
  },
  "45": {
    "1": {
      "keynote": "Open Ledger",
      "body": "You know what is in the store before you offer it around, and promising from an unmeasured supply frightens you. Dominance is what leadership becomes when the numbers are hidden, and you refuse to run a group that way. Synergy grows from shared accounting — everyone sees the same ledger — and communion arrives in a circle where nothing about the ground is concealed."
    },
    "2": {
      "keynote": "Gathering Without Trying",
      "body": "You gather people without issuing an invitation, and the group forms around whatever you happen to be doing. Others describe your house or your table as the centre of something, which strikes you as an odd thing to say about ordinary evenings. Formalising the role kills it — dominance appears the moment you start managing the gathering you used to simply host."
    },
    "3": {
      "keynote": "Room Emptied",
      "body": "You gather people, hold them badly, and watch the group come apart in your hands. Dominance was the first tool you reached for and it emptied the room — that emptying is where your feel for synergy actually began. You still carry the memory of a table that went quiet on you, and it is the reason you now ask before deciding."
    },
    "4": {
      "keynote": "Gathering Your People",
      "body": "You gather people, and whatever you build is held together by belonging rather than by structure, incentives or rules. The group forms around you without a plan, and its health is readable in whether people bring their own things into it. Dominance creeps in once you start managing the circle instead of hosting it, and attendance drops before anybody raises an objection."
    },
    "5": {
      "keynote": "The Gathering Point",
      "body": "You gather people, and the group that forms around you works better than the sum of the individuals in it. That synergy gets attributed to you personally, so the group’s identity fuses with yours and leaving becomes complicated for everyone. Dominance is what the position turns into when you start needing them gathered — the circle exists for you rather than through you."
    },
    "6": {
      "keynote": "The Older Circle",
      "body": "You gather people, disperse them, and gather again, and each circle you form is larger and less about you than the last. Leading a group stopped being about standing in front somewhere around the second cycle. What complicates it is that the people you gathered first still want the version of you who ran things."
    }
  },
  "46": {
    "1": {
      "keynote": "Body Knowledge",
      "body": "You inhabit your body as a subject worth studying, learning how it responds long before you trust it in public. Seriousness settles over you when you are working against your own physical grain without realising it. Delight returns the moment the instrument is understood, and ecstasy in you is not an escape from the body but the result of knowing it thoroughly."
    },
    "2": {
      "keynote": "Body Knows First",
      "body": "You settle into your body more easily than most people manage in a lifetime, and it has never looked like an accomplishment from where you stand. Food, movement, weather, touch — the pleasure is immediate and uncomplicated, and friends borrow your appetite for an afternoon. Duty is what dims it; seriousness settles over you when the day fills with tasks nobody delights in."
    },
    "3": {
      "keynote": "Odds Tested",
      "body": "You enter things with your whole body and learn them by doing. Seriousness clamped down after something went wrong physically or publicly, and delight came back only when you risked the next attempt anyway. Your luck is not passive — it is the arithmetic of showing up for far more experiences than most people, including the ones that went badly."
    },
    "4": {
      "keynote": "Luck Through People",
      "body": "You land in the right place through people, and what looks like luck in your life traces back to who you were close to. Your body knows when a room is good for you, and the opportunities that follow come from somebody in it, never from the plan. Seriousness shuts the whole mechanism down, and delight comes back in the week you spend an evening with people you enjoy."
    },
    "5": {
      "keynote": "Contagious Delight",
      "body": "You enjoy things out loud, and your delight is contagious enough that people invite you along to lift the mood. Good fortune follows you visibly, and others read it as proof of something or as plain unfairness, according to how their own week has gone. Seriousness sets in when the lightness becomes a job — being the one who makes it fun is heavy work nobody sees."
    },
    "6": {
      "keynote": "Delight Comes Later",
      "body": "You lighten up in the second half, having spent the first taking everything far more seriously than it deserved. Luck arrives for you in clusters after long flat stretches, and you stopped panicking during the flat parts a while ago. The edge is watching younger people grind at something you already know will resolve on its own timing."
    }
  },
  "47": {
    "1": {
      "keynote": "Bottom Ground",
      "body": "You endure the low passage by learning its architecture instead of waiting it out blindly. Oppression feels total from inside, and you refuse to climb out before you have understood how you arrived. Transmutation happens for you underground, in the dark and without witnesses, and transfiguration is the surface evidence of work that was done far below it."
    },
    "2": {
      "keynote": "Digesting Alone",
      "body": "You metabolise dark stretches in private and come out the other side with something usable. The process takes as long as it takes and looks from outside like doing nothing, which is why well-meaning people keep trying to pull you out of it early. Rushed, the transmutation stalls halfway — and oppression is that same material sitting in you undigested."
    },
    "3": {
      "keynote": "Bottom Mined",
      "body": "You hit bottom, sit in it longer than anyone recommends, and come up with material. Oppression is a place you have actually been — the flat grey months where nothing moved — and you went through rather than escaping. Transmutation happens in you slowly and without an audience, which is why the people around you have no idea how much of it you have already done."
    },
    "4": {
      "keynote": "Held Through It",
      "body": "You process the past with other people, and the low stretches turn into something usable when somebody stays in contact throughout them. The friend who keeps calling during your worst months does more for you than any amount of private analysis. Oppression deepens while you withdraw and let people assume you are fine, and the turn comes through a conversation you nearly avoided."
    },
    "5": {
      "keynote": "Proof Of Recovery",
      "body": "You emerge from dark stretches with something usable, and people who are still inside theirs come to you for evidence that it ends. Your transmutation becomes a public example, which puts pressure on you to look recovered before you are. Oppression is the weight of that expectation — the low period arrives again, and this time there is an audience waiting for the good ending."
    },
    "6": {
      "keynote": "Old Ground Reworked",
      "body": "You revisit dark periods of your life on purpose, because each pass through turns more of the raw material into something usable. The stretch that nearly buried you years ago became the thing you now speak about plainly and without drama. What this costs is going back down voluntarily while everyone around you is trying to stay up."
    }
  },
  "48": {
    "1": {
      "keynote": "Deep Well",
      "body": "You fill the well before anyone comes asking, reading and learning far past what the situation requires. Inadequacy is the fear that you arrived without enough, and it drives most of your preparation. Resourcefulness reveals itself as the depth you quietly stocked, and wisdom in you is never improvised — it is retrieved from ground you spent years digging."
    },
    "2": {
      "keynote": "Depth You Discount",
      "body": "You improvise solutions out of whatever is lying around and call it getting by. Under real pressure something deep in you opens and hands up exactly the right move, then closes again and leaves you with no memory of where it came from. Asked to guarantee that depth in advance, you find nothing there, and inadequacy fills the space the resourcefulness left."
    },
    "3": {
      "keynote": "Out of Depth",
      "body": "You accept things beyond your competence and figure them out mid-air. The job you were not qualified for, the problem nobody briefed you on — inadequacy showed up loudly each time and you solved it anyway, badly at first. What passes for confidence in you is nothing more than a memory of having been out of your depth and swum, and the fear arrives at full volume every time."
    },
    "4": {
      "keynote": "Depth On Request",
      "body": "You draw on unexpected depth when somebody you trust asks you for it, and the answer surprises you as much as them. Approached cold, you feel unqualified and say so; asked by a friend in trouble, the resourcefulness is simply there. Inadequacy is loudest before a relationship exists, and your wisdom appears the moment somebody has already decided you are worth asking."
    },
    "5": {
      "keynote": "Bottomless Expectation",
      "body": "You improvise a solution out of whatever is available, and people bring you problems that have already defeated somebody else. Your resourcefulness is treated as bottomless, so the questions arrive faster than the thinking behind them ever gets replenished. Inadequacy is the private counterweight — everyone assumes you have depth on tap, and you know exactly how close to empty you are."
    },
    "6": {
      "keynote": "The Deep Well",
      "body": "You draw on a depth that took decades to fill, and the inadequacy you felt young was accurate at the time. People bring you problems with no clean answer, and you sit with them longer than anyone else is willing to. The cost is that the well only fills in solitude, and solitude reads as unavailability."
    }
  },
  "49": {
    "1": {
      "keynote": "Stated Principles",
      "body": "You define your principles before the crisis arrives, and improvised values leave you feeling unmoored. Reaction is what happens when something violates a line you never actually articulated. Revolution in you is slow and structural — the arrangement changed at its base rather than shouted at — and rebirth follows because the new form rests on something you thought through."
    },
    "2": {
      "keynote": "The Clean Break",
      "body": "You end things in a single movement, and the decision was made somewhere in you weeks before you announced it. People experience it as sudden and describe you as ruthless; from inside it was simply the moment the thing finished. Broken off in heat rather than in that quiet certainty, the same act is reaction, and you spend a year repairing it."
    },
    "3": {
      "keynote": "Bridges Burned",
      "body": "You end things sharply and learn the difference between a clean cut and a wound afterwards. There are relationships and jobs behind you that finished in a single afternoon because you reacted — some of those endings were right and some cost you people you wanted. Reaction is your quick edge, and the revolutions you carry now come with a pause you built out of the ones that misfired."
    },
    "4": {
      "keynote": "Clean Breaks",
      "body": "You end relationships completely or not at all, and the shape of your life is set by who you keep and who you cut. A principle broken by somebody close forces a decision in you that surprises everyone, yourself included. Reaction makes the break sudden and total in place of a conversation, and you rebuild the circle for years afterwards."
    },
    "5": {
      "keynote": "Face Of Change",
      "body": "You name the change everyone has been circling, and people gather behind that naming because someone finally said it plainly. Once you are the face of a change, you become the target for everyone invested in things staying as they are. Reaction is the trap on your side — moving because you were pushed, rather than because the timing for the break is right."
    },
    "6": {
      "keynote": "Revolutions Behind You",
      "body": "You rebuild your life from the studs more than once, and each demolition looked reckless to everyone except you. Reaction has less grip on you now — you have watched enough upheavals to know which are actually the end of something. The edge is being the one people call during their first collapse, having had several."
    }
  },
  "50": {
    "1": {
      "keynote": "Clean Base",
      "body": "You uphold standards by understanding where they came from, and inherited rules you never examined sit uncomfortably with you. Corruption starts at the foundations, and you find it there because that is where you look first. Equilibrium in you rests on principles you tested yourself, and the harmony you bring to a group comes from having checked the beams rather than the paint."
    },
    "2": {
      "keynote": "Innate Standards",
      "body": "You maintain a set of standards you were never taught and rarely state. What is acceptable and what is not registers in you as physical certainty rather than as a rule, and the people who live or work with you calibrate quietly against it. Bending that instinct to keep a group comfortable is where corruption begins, and equilibrium leaves the whole house."
    },
    "3": {
      "keynote": "Rules Bent",
      "body": "You bend a rule to see whether it holds and watch what it costs the group. Somewhere you let a standard slide, or held one so rigidly it broke something, and the imbalance showed up in the people around you within weeks. Corruption is not abstract after that, and the equilibrium you keep now is maintained by hand rather than inherited from anybody."
    },
    "4": {
      "keynote": "Keeper Of Standards",
      "body": "You guard the standards of the groups you belong to, and people come to you when something in a family or a team has gone wrong. Your responsibility is unofficial and total: you notice the imbalance first and you carry it until the thing is settled. Corruption enters as an exception made for somebody you love, and the whole group’s trust in you moves on that single call."
    },
    "5": {
      "keynote": "The Standard Bearer",
      "body": "You uphold the standard a group lives by, and people look to you to say what is acceptable here. That role makes you the referee in disputes you had no part in, and every ruling costs you somebody. Corruption enters quietly through the exceptions — one bent rule for a friend, and the equilibrium you were trusted to hold stops being real."
    },
    "6": {
      "keynote": "The Standard Set",
      "body": "You steady whatever room you are in, not by intervening but by keeping to a standard long enough that it becomes the reference. There were years you enforced things and years you stepped out of the structure entirely, and both showed you where rot starts. What this costs is being held to your own standard by people who never agreed to it."
    }
  },
  "51": {
    "1": {
      "keynote": "Explained Shock",
      "body": "You steady yourself by understanding what hit you, and a shock you never explained keeps its power over you. Agitation is the state of a nervous system with no account of what just happened. Initiative returns once you have made sense of the blow, and the awakening in you is not the lightning itself but the ground it found waiting."
    },
    "2": {
      "keynote": "First Move",
      "body": "You move first while everyone is still discussing it, and the starting was never a decision you deliberated. Half the projects around you exist because you did the initial thing without asking permission, a fact you have never counted as courage. Pushed into starting something you have no feeling for, initiative turns into agitation and the energy goes at the walls instead."
    },
    "3": {
      "keynote": "Shocks Absorbed",
      "body": "You absorb a shock you did not see coming and start moving again from there. The accident, the diagnosis, the phone call that split your life into before and after — agitation is what you felt first, and initiative is what came out of it months later. Shock is your teacher whether you want it or not, and you have stopped bracing against the next one."
    },
    "4": {
      "keynote": "Shock Among Friends",
      "body": "You shock the people closest to you, and the disruption you bring works where there is enough love in the room to absorb it. Your sudden moves rearrange a whole friendship group, and the ones who stay end up changed by what you started. Agitation aimed at people with no bond to you lands as aggression and costs you the connection, and you find that out too late."
    },
    "5": {
      "keynote": "The Wake-Up Call",
      "body": "You shock people awake, and the ones whose lives changed after meeting you talk about it for years afterwards. That reputation precedes you into every room, so people arrive already braced, wanting the jolt and resenting it at once. Agitation is the misfire — initiative for its own sake, disturbing a situation that was already moving fine without you."
    },
    "6": {
      "keynote": "Shocks Already Taken",
      "body": "You weather shocks early that most people meet much later, and each one reset your life more thoroughly than the last. Now you initiate rather than react, and the agitation that used to run you shows up as a signal you read calmly. The difficulty is that your steadiness during someone else’s crisis lands as coldness."
    }
  },
  "52": {
    "1": {
      "keynote": "Still Base",
      "body": "You settle only when you understand what is pressing on you, and unnamed pressure keeps your body braced. Stress in you is the alertness of a system scanning for a threat it has not identified yet. Restraint becomes possible once the source is known, and the stillness you reach afterwards is not effort but the natural state of a mind with nothing outstanding."
    },
    "2": {
      "keynote": "Comfortable Doing Nothing",
      "body": "You sit still with a comfort that unnerves busier people. Doing nothing at all restores you, and you have never understood the compulsion others feel to fill an empty hour with activity. That stillness is the whole engine of your usefulness — filled with obligations and errands, it converts straight into stress, and the restraint everyone relies on disappears."
    },
    "3": {
      "keynote": "Timing Learned Hard",
      "body": "You act too early and hold too long, and both errors built the stillness you now have. Stress accumulated in your body until something gave — the back, the sleep, the temper — and the pause you take now was installed by that, not by a teacher. Restraint costs you opportunities you watch other people take, and you have made peace with the trade most days."
    },
    "4": {
      "keynote": "Stillness With Others",
      "body": "You settle a room by being still inside it, and your restraint reads as safety to people who already trust you. Friends bring their panic to you and leave calmer, without you having said much of anything useful. Stress accumulates from holding other people’s urgency, and your stillness stops working in the week you never get an hour alone."
    },
    "5": {
      "keynote": "The Still Centre",
      "body": "You stay still while everyone else moves, and that restraint looks like wisdom to half the room and obstruction to the other half. People come to you to slow down, then push you to act on their timeline. Stress accumulates unseen in this role, because stillness held for other people’s benefit is work, and nobody counts it as work."
    },
    "6": {
      "keynote": "The Practised Stop",
      "body": "You stop completely where others push through, and the stillness you drop into is a skill built over years of getting it wrong. Stress reads to you as information about pacing rather than as something to be beaten. The cost is a life that looks inactive from outside during exactly the periods where the most is settling."
    }
  },
  "53": {
    "1": {
      "keynote": "Right Beginnings",
      "body": "You start things properly or not at all, and a beginning made on shaky ground bothers you until you redo it. Immaturity is the rush to launch before the base is laid, and you recognise it from your own early attempts. Expansion happens for you on a long timescale, and superabundance is what a correctly planted thing produces once it has been left to grow."
    },
    "2": {
      "keynote": "Growth Without Push",
      "body": "You start things at a rate that alarms tidier people, and each beginning costs you almost nothing. The new interest simply arrives, fully alive, and you are three weeks into it before anyone notices there was a decision. Left to grow on its own schedule the thing matures; forced to show results early, it stays green and reads as immaturity."
    },
    "3": {
      "keynote": "Started Unready",
      "body": "You begin things before you are ready and grow into them halfway through. Half your projects launched underprepared, wobbled publicly, and matured in front of an audience — immaturity is visible in your early work and you would not trade the launching for more preparation. Expansion happens for you in the doing, and the wobble at the start of anything new is permanent."
    },
    "4": {
      "keynote": "Beginnings With Others",
      "body": "You start what other people finish, and the new ventures in your life come out of a conversation where somebody said yes with you. Beginnings excite you and the middle stretch drains you, so the projects that survive have a partner holding them steady. Immaturity is opening too many things with too many people, and the half-done ones sit there reminding you who you promised."
    },
    "5": {
      "keynote": "The Growth Starter",
      "body": "You begin things that grow past you, and people join early because your expansion has obvious momentum. Their picture of you is fixed at the moment they joined, and it never updates, which is why old collaborators speak about a version of you that no longer exists. Immaturity shows as starting again for the buzz of the start, before the last thing matured."
    },
    "6": {
      "keynote": "Growth In Stages",
      "body": "You expand in distinct stages with long plateaus between them, and the plateaus have always come before the biggest jumps. What started in you late compared with your peers now runs further than theirs, because you kept beginning things past the age people stop. The edge is starting over in public, at an age when starting over is supposed to be finished."
    }
  },
  "54": {
    "1": {
      "keynote": "Solid Rungs",
      "body": "You climb by making certain each level is secure before you reach for the next, and skipped steps make you dizzy. Greed is the urge to jump ahead of your own competence, and you have felt where that lands. Aspiration in you is structural instead of hungry, and the ascension people notice is a ladder you built one tested rung at a time."
    },
    "2": {
      "keynote": "Unplanned Ascent",
      "body": "You climb steadily without a plan pinned to the wall, and each level arrives before you had time to want it. Others describe your progress as ambitious; you experience it as having simply kept working while nobody was paying attention. The measuring is what turns it — greed enters the moment your rise becomes a number you compare with somebody else’s."
    },
    "3": {
      "keynote": "Empty Summits",
      "body": "You climb hard toward something, arrive, and discover it was not the thing. The promotion, the money, the position you wanted for years delivered exactly what it promised and left you looking upward again — greed showed itself at the top rather than on the way. Aspiration survived that discovery, redirected, and you check the destination more carefully before starting the next ascent."
    },
    "4": {
      "keynote": "Rise Through Contacts",
      "body": "You rise through the people you know, and every step up in your life traces to a relationship rather than to a qualification. Your ambition looks like networking from outside and feels like friendship from inside, and both descriptions are accurate. Greed shows as keeping people close for what they open, and they read that long before you do, then stop returning your messages."
    },
    "5": {
      "keynote": "The Visible Climb",
      "body": "You climb where people watch, and your aspiration is legible to everyone around you — they know exactly what you are reaching for. Sponsors appear who want to be part of the story, and rivals appear who want the story to fail. Greed is the substitution — status becomes the goal because status is what the audience rewards, and the actual ascent stops there."
    },
    "6": {
      "keynote": "The Slower Climb",
      "body": "You climb on a longer timeline than the people beside you, and you have already reached one summit and found it empty. Material ambition ran a full chapter of your life and then released its grip, replaced by something harder to describe. The cost is being asked what you are working towards by people who want a number."
    }
  },
  "55": {
    "1": {
      "keynote": "Traced Moods",
      "body": "You track your own moods until you know their shape, because a mood you have not accounted for runs your whole week. Victimisation is what happens when you blame the weather of your body on other people. Freedom arrives through that record-keeping rather than through escape, and the change you are waiting for meets a person who already understands their own chemistry."
    },
    "2": {
      "keynote": "Moods Left Alone",
      "body": "You run through moods like weather and have stopped apologising for the ones that arrive without cause. Left alone through a low stretch, you come out the far side intact and lighter, on a timetable nobody else had any part in setting. Managed by other people’s reassurance, the same passage stalls, and the freedom in it curdles into victimisation."
    },
    "3": {
      "keynote": "Exits Taken",
      "body": "You quit the thing, taste the freedom, and find the same trap waiting inside the new arrangement. The job you left, the country you moved to, the relationship you ended — each one delivered less liberty than advertised, and the pattern taught you where the cage actually sits. Victimisation is the story you catch yourself telling, and you notice it faster every year."
    },
    "4": {
      "keynote": "Freedom In Company",
      "body": "You change with the people around you, and your moods, appetites and direction move in step with your closest company. One relationship shifting rearranges your entire week, and you feel that in your body before you understand what happened. Victimisation is blaming the people you chose for the state you are in, and freedom starts where you own who you keep close."
    },
    "5": {
      "keynote": "The Free Example",
      "body": "You live in a way other people call free, and they say it with admiration or with an edge, depending on what their own life costs them. Your choices become a comment on theirs whether you meant that or not. Victimisation returns through the audience — building a life to demonstrate freedom is not freedom, and you feel the difference immediately."
    },
    "6": {
      "keynote": "The Long Unbinding",
      "body": "You shed identities the way other people change jobs, and each version of you that ended was complete before it went. The victim story ran its course in you and then stopped being interesting, which is not the same as being resolved. The edge is that freedom keeps costing you the company of whoever preferred the earlier version."
    }
  },
  "56": {
    "1": {
      "keynote": "Gathered Stories",
      "body": "You collect experiences deliberately, building a private stock of things you have actually lived rather than heard about. Distraction is the shallow version — a hundred tastes and nothing that took root — and you notice the emptiness afterwards. Enrichment comes from depth in a few places, and the intoxication others feel in your company is the overflow of a life properly stocked."
    },
    "2": {
      "keynote": "The Told Story",
      "body": "You tell a story and the room leans in, though you have never worked out what you are doing differently. The detail you pick, the pause before the ending — it is instinct rather than craft, and you credit the story rather than the telling. Performed to hold attention rather than to share something, it thins out, and distraction is what you are left entertaining."
    },
    "3": {
      "keynote": "Detours Sampled",
      "body": "You follow the shiny thing all the way and see what was inside it. Every distraction available has been sampled by you personally — the trips, the scenes, the obsessions that lasted a season — and the enrichment came from the sampling, not from restraint. Distraction is still the pull, and you have gained a reliable sense for which detours pay and which ones just eat months."
    },
    "4": {
      "keynote": "Stories Between Friends",
      "body": "You entertain people, and your best material comes out among friends who already know where the story is going. A room that likes you draws things out of you that no preparation produces, while a cold audience shuts the whole thing down. Distraction is chasing every new group for that lift, and the enrichment stays with the few who let you be uninteresting too."
    },
    "5": {
      "keynote": "The Storyteller",
      "body": "You tell it well, and people gather because your enrichment of an experience makes it better than the experience was. Audiences want the storyteller present at everything, which means you spend your life at other people’s occasions. Distraction is the occupational hazard — always collecting material, never quite inside the evening you are in, and the good stories cost you the night."
    },
    "6": {
      "keynote": "The Wandering Years",
      "body": "You wander widely enough that nothing you pick up feels wasted, and the detours turn out to be the real education. Stimulation comes to you in floods and then long drought, and you made peace with the drought part years ago. What this costs is a scattered-looking history that only makes sense when someone hears the whole arc."
    }
  },
  "57": {
    "1": {
      "keynote": "Solitude",
      "body": "Your intuition speaks clearest when nobody else's voice is in the room, which is why time alone reads to you as necessity rather than withdrawal. Unease shows up first as noise, before you have any language for what it's telling you, and company can drown the signal before you've heard it. Skip the solitude for long enough and the clarity simply stops arriving."
    },
    "2": {
      "keynote": "The First Impression",
      "body": "You register the truth of a room in the first three seconds and spend the next hour arguing yourself out of it. That initial reading is almost always right, and you have the history to prove it — the house that turned out wrong, the person you knew about immediately. Talked out of the signal by reasoning, you get unease instead of clarity."
    },
    "3": {
      "keynote": "Hunches Overridden",
      "body": "You override the gut feeling, watch the thing go exactly as your body warned, and trust it a little more next time. This has happened enough times to be a data set — the meeting you knew about, the person you sensed, the room you wanted to leave. Unease is now information rather than noise, and you still argue with it before believing it."
    },
    "4": {
      "keynote": "Intuition For Yours",
      "body": "You sense things about people you are close to, and your intuition is sharpest where there is real affection in the connection. You know a friend’s news before they tell you, and you pick up the mood of a house within seconds of walking in. Unease is that identical signal with no relationship to ground it, and clarity returns beside somebody who takes your instincts seriously."
    },
    "5": {
      "keynote": "Trusted Hunch",
      "body": "You know things before there is evidence, and people learn to ask you what your gut says about a decision. Being consulted for intuition puts you in the impossible position of explaining a knowing that arrived without reasons. Unease is what fills the gap — the pressure to produce clarity on request, when the clear signal comes on its own schedule."
    },
    "6": {
      "keynote": "Intuition Proven Out",
      "body": "You trust your first read now because you have watched it be right across enough years to stop arguing with it. Unease still arrives in your body before any information does, and you act on it earlier than you once did. The difficulty is having no evidence to offer people who want reasons, only a record they were not around for."
    }
  },
  "58": {
    "1": {
      "keynote": "Body First",
      "body": "You tune your physical life first, having found that everything else runs badly when the basics are neglected. Dissatisfaction in you is a signal from the foundation — sleep, movement, food — and not a complaint about your circumstances. Vitality arrives once that base is properly maintained, and the bliss underneath turns out to be what a well-kept body does when nothing is wrong."
    },
    "2": {
      "keynote": "Uncounted Energy",
      "body": "You wake with more life in you than the day requires, and it has always been that way. Other people find you exhausting to keep up with and you have never registered yourself as high-energy — this is simply the baseline you were issued. That vitality goes somewhere regardless; with no outlet and nobody naming it, it inverts into flat, chronic dissatisfaction."
    },
    "3": {
      "keynote": "Improvements Overshot",
      "body": "You try to improve something, overshoot, and find the right amount on the second pass. The fitness push that injured you, the system you optimised until it stopped working, the life change that swung too far — dissatisfaction drove each one and each one moved you forward regardless. Your vitality comes out of repeated attempts, not from getting the level right the first time."
    },
    "4": {
      "keynote": "Vitality From People",
      "body": "You thrive on company, and your energy is a direct readout of who you have been spending your time with. A day with the right friend leaves you charged for a week, and one obligation with the wrong crowd flattens you completely. Dissatisfaction builds while you keep improving things for people who never wanted the help, and the vitality drains out of the effort."
    },
    "5": {
      "keynote": "The Energy Source",
      "body": "You energise whatever you join, and groups invite you specifically for the lift your vitality gives them. The invitation carries an unspoken requirement to arrive charged, which turns a natural state into a performance obligation. Dissatisfaction is the underside — the same drive that improves everything around you refuses to leave a single thing alone, and that includes you and the people closest to you."
    },
    "6": {
      "keynote": "Vitality By Cycles",
      "body": "You recover your energy in cycles rather than holding it steady, and the low stretches have always preceded your strongest work. Dissatisfaction still shows up, though it points at something specific now instead of colouring everything. The cost is that people who met you at full output assume that is your baseline and wait for its return."
    }
  },
  "59": {
    "1": {
      "keynote": "Earned Closeness",
      "body": "You establish trust in stages, giving one true thing at a time and watching what happens to it. Dishonesty for you is the smoothness that appears when someone gets close before the ground is ready. Intimacy built this way holds under strain, and the transparency you eventually offer costs you nothing because it was never a leap, only the last step."
    },
    "2": {
      "keynote": "Barriers Drop",
      "body": "You open with people faster than is comfortable to admit, and the closeness happens without any technique behind it. Someone sits down beside you and within an hour the usual defences are gone on both sides, which you put down to them rather than to you. Performing that openness for effect is where dishonesty enters, and intimacy stops arriving at all."
    },
    "3": {
      "keynote": "Lies Found Out",
      "body": "You lie to someone close, get found out, and learn what intimacy actually costs. The omission, the story shaped to suit you, the thing you did not mention — dishonesty was run as an experiment and the result came back clear. Transparency in you is chosen rather than natural, rebuilt after damage, and the easier version still offers itself most weeks."
    },
    "4": {
      "keynote": "Barriers Down",
      "body": "You connect through closeness, and what you carry reaches people only after the barrier between you has come down. In groups you break the formality first, saying the honest thing that lets everybody else stop performing. Dishonesty here is a small withholding inside a close relationship, and it costs you the intimacy that made the connection worth having."
    },
    "5": {
      "keynote": "Intimacy As Skill",
      "body": "You open people up quickly, and they tell you the truth about themselves sooner than they meant to. That skill gets read as either extraordinary closeness or as a technique, and which reading you get depends entirely on what the person wanted from you. Dishonesty is the fine line — intimacy produced deliberately still feels real to them, and you are the only one who knows."
    },
    "6": {
      "keynote": "Intimacy On Terms",
      "body": "You open completely or not at all, and the middle setting other people run on has never worked for you. Long closed periods alternate with real intimacy, and both are genuine, which confuses anyone wanting consistency from you. The edge is that your honesty arrives with more force than the person asking for it expected."
    }
  },
  "60": {
    "1": {
      "keynote": "Measured Limits",
      "body": "You measure the constraint before you argue with it, and a rule you have not examined irritates you more than a hard one. Limitation crushes you when it is imposed without explanation, so you go looking for the reason underneath. Realism in you is the exact size of the box, established by testing, and the justice you fight for is built on measurements rather than outrage."
    },
    "2": {
      "keynote": "Practical By Default",
      "body": "You see the actual constraints of a situation the way other people see furniture. Budgets, timelines, what a body will physically do in a day — the real limits are visible to you at a glance, and you assume the room already knows. Called pessimism one time too many, you go quiet, and realism you keep to yourself hardens into your own limitation."
    },
    "3": {
      "keynote": "Limits Ignored",
      "body": "You probe a limit by ignoring it and taking the consequence. The budget, the body, the timeline, the rule you thought did not apply — each one held, and the holding is what gave you realism instead of a borrowed opinion about constraint. Limitation still feels like an insult on first contact, and you have stopped arguing with the ones you have already tried."
    },
    "4": {
      "keynote": "Limits With People",
      "body": "You accept limits through relationship, and the boundaries in your life are set by what the people around you make possible. Your best work happens inside constraints agreed with somebody else: a partner, a contract, a promise you made out loud. Limitation turns bitter when you blame a person for the wall instead of the situation, and the resentment outlasts the constraint itself."
    },
    "5": {
      "keynote": "The Reality Check",
      "body": "You define the edges of what is actually possible, and teams rely on your realism to stop them chasing something impossible. Delivering that assessment makes you the obstacle in the room, the one who killed the exciting idea. Limitation becomes your whole reputation when nobody remembers the projects your realism saved — only the ones you refused to endorse."
    },
    "6": {
      "keynote": "Limits Made Useful",
      "body": "You accept your limits rather than fight them, and the acceptance releases far more than the fighting ever did. Constraints that once flattened you have become the structure you work inside now, deliberately and without complaint. What this costs you is a bluntness about what is actually possible, delivered plainly to people who arrived hoping for encouragement instead."
    }
  },
  "61": {
    "1": {
      "keynote": "Anchored Inspiration",
      "body": "You anchor a revelation in something solid before you let it change your life, and untethered insight scares you. Psychosis is what waits when the mind runs ahead of any structure holding it. Inspiration lands safely in you because you built the vessel first, and sanctity is what an enormous idea becomes when it has somewhere sound to arrive."
    },
    "2": {
      "keynote": "Alone With It",
      "body": "You receive inspiration in solitude and lose the thread the moment there is company. The material arrives at four in the morning, complete and strange, and you have learned which people to tell and which to keep well clear of it. Held alone too long with nobody to ground it, the same current runs hot, and inspiration edges toward psychosis."
    },
    "3": {
      "keynote": "Edge Approached",
      "body": "You drive your mind further than is comfortable and come back with something. The obsessive stretch, the idea that took over a year, the period where the thinking got too loud — you have gone near the edge and returned, which is why inspiration in you has ballast. Psychosis is not a theoretical shadow here, and you recognise the exact signs that you have gone far enough."
    },
    "4": {
      "keynote": "Witnessed Inspiration",
      "body": "You receive sudden and strange knowing, and it becomes sane through the people who hear it out without flinching. Alone with it too long, the inner pressure builds and your thinking runs ahead of anything you are able to explain. Psychosis in this key is inspiration with no witness, and one grounded friendship keeps the whole thing usable rather than isolating."
    },
    "5": {
      "keynote": "The Given Message",
      "body": "You receive things that arrive whole and unasked for, and when you pass them on people treat you as either a source or a crank. Inspiration this direct has no evidence attached, so belief in it becomes belief in you, which is a heavy thing to be handed. Psychosis waits at that boundary — an audience of believers removes every check you had on your own certainty."
    },
    "6": {
      "keynote": "The Inner Seasons",
      "body": "You descend into long private stretches, and what you carry back from them resists every tidy explanation you attempt. The strangeness that frightened you when you were younger became, with enough time, the most reliable instrument you own. The difficulty is finding anyone to describe it to who will not immediately reach for a diagnosis."
    }
  },
  "62": {
    "1": {
      "keynote": "Exact Detail",
      "body": "You order the facts before you name anything, and a loose definition in your own work nags at you. Intellect becomes a shadow when the naming outpaces the checking, and you catch yourself sounding certain about a detail you skimmed. Precision in you is slow and verifiable, and impeccability is what happens when every small piece has been confirmed before assembly."
    },
    "2": {
      "keynote": "Exact By Nature",
      "body": "You name things exactly without labouring over the wording, and the right term is simply the one that arrives. Other people rewrite a sentence eleven times to reach where your first attempt landed, which is why you undervalue the ability entirely. Made to justify every choice of word, precision degrades into intellect, and the writing gets longer as it gets worse."
    },
    "3": {
      "keynote": "Details Botched",
      "body": "You botch a detail in public and rebuild your method around never repeating it. The wrong number in the report, the name misspelled, the fact you asserted and could not support — your precision was assembled from those exact moments of exposure. Intellect keeps offering you shortcuts, and the checking you do now takes longer than anyone watching would guess."
    },
    "4": {
      "keynote": "Precision For Friends",
      "body": "You explain things for the people you care about, and your precision serves a relationship rather than an argument. The facts, names and details you carry turn useful the moment a friend asks you the practical question. Intellect used to win instead of to help costs you the room, and people stop bringing you problems you already solved."
    },
    "5": {
      "keynote": "The Clear Explainer",
      "body": "You explain complicated things precisely, and your explanations get passed around, cited and built on by people you never met. Precision makes you the reference point, and being the reference point means every small error is found and remembered. Intellect is the shadow at the edges — correctness pursued for the standing it brings rather than for the person trying to understand."
    },
    "6": {
      "keynote": "Precision Earned Slowly",
      "body": "You name things precisely because you spent years being imprecise and watching the damage that caused. Your vocabulary for a subject grows narrower over time rather than wider, and the fewer words carry more. What this costs is impatience with loose talk, which reads as pedantry to anyone who has not done the same work."
    }
  },
  "63": {
    "1": {
      "keynote": "First Question",
      "body": "You chase a doubt to the bottom instead of living with it, and an unresolved question keeps you awake. Doubt turns corrosive in you when it has nowhere to go, aimed at yourself and not at the problem. Inquiry is the proper use of it, and the truth you arrive at is worth having precisely because you tried hardest to knock it over."
    },
    "2": {
      "keynote": "The Arriving Question",
      "body": "You ask the question that reframes the whole discussion and then apologise for interrupting. It surfaces on its own, unrehearsed, and you have moved two topics further on by the time someone tells you it was the important one. Turned inward with no external subject to work on, the same faculty runs on you, and inquiry becomes corrosive doubt."
    },
    "3": {
      "keynote": "Beliefs Dismantled",
      "body": "You believe something completely, dismantle it, and stand in the rubble for a while. That has happened with a teacher, a system, a worldview you had built a life around — and doubt was not an idea but a season you lived in. Your inquiry is genuine because of it, and each new certainty comes with a quiet expectation that this one will also come apart."
    },
    "4": {
      "keynote": "Doubt Aimed Inward",
      "body": "You question those nearest to you, and the sharpness of your mind lands hardest on the people who let you in. Your doubt is affection in a difficult form: the friend who checks the plan, the partner who finds the flaw first. Doubt aimed at a person rather than a proposal corrodes the bond quietly, and your inquiry loses the trust it depended on."
    },
    "5": {
      "keynote": "The Awkward Question",
      "body": "You question what everyone has agreed to stop questioning, and your inquiry exposes the weak joint in a plan before it breaks. People want that from you right up until it points at something they built, and then you become the problem. Doubt turned inward is the private cost — the same instrument that tests everything else finds no floor under you."
    },
    "6": {
      "keynote": "Doubt Outgrown",
      "body": "You question everything, including your own questioning, and you passed through the corrosive phase of that into something workable. Doubt used to eat your certainty; now it sharpens an inquiry and stops, because you learned where the useful part ends. What this costs is a reputation for taking apart things other people would rather leave whole."
    }
  },
  "64": {
    "1": {
      "keynote": "Sorted Images",
      "body": "You sort the mental noise into piles before you trust any of it, and an unfiltered head leaves you paralysed. Confusion is the raw material arriving faster than you file it, and the pressure is worst late in the day. Imagination works for you once the sorting is finished, and illumination comes as the moment the whole heap resolves into a single clear picture."
    },
    "2": {
      "keynote": "Pictures Unbidden",
      "body": "You picture things in a detail other people find hard to believe, and none of it was ever summoned deliberately. The images run all day at the back of your attention, so ordinary that you have never mentioned them to anyone. Any attempt to sort that stream into meaning while it is still moving produces confusion — the imagination resolves once you stop pushing."
    },
    "3": {
      "keynote": "Fog Waited Out",
      "body": "You sit inside not knowing until something resolves, and it resolves by being lived rather than solved. Long stretches of mental static have already come and gone in your life, and you have learned that imagination returns on its own schedule once you stop forcing it. Confusion still frightens you at the start, and you no longer treat it as evidence that something is wrong."
    },
    "4": {
      "keynote": "Sorted Out Loud",
      "body": "You sort your mind out loud, and the images crowding your head organise themselves while you are talking to somebody patient. Left alone with the noise you circle for days, and one unhurried conversation clears more than a week of private effort. Confusion is not a fault in your thinking but a sign you have been alone with it too long, and the picture resolves in company."
    },
    "5": {
      "keynote": "Sketch Or Promise",
      "body": "You imagine possibilities in vivid detail, and people ask you to picture their future for them because their own imagination has gone flat. What you offer is a sketch, and they hear a promise, which is where the disappointment starts. Confusion is your side of it — holding twenty versions of a future at once, while everyone around you waits for the one answer."
    },
    "6": {
      "keynote": "Confusion Given Time",
      "body": "You let confusion sit unresolved rather than forcing it into shape, having learned that the picture assembles itself in time. Long mental fog is followed, reliably, by an image arriving whole, and you gave up panicking during the fog long ago. What this costs is looking lost to people who resolve things faster and understand less."
    }
  }
};
  return {
    get(n, line) {
      const k = L[n];
      return (k && k[line]) || null;
    },
  };
})();
