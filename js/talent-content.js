'use strict';

/**
 * Destiny Matrix — Talent Star Line Content
 * ──────────────────────────────────────────
 * Archetype-level readings, keyed by the 5-bucket `iconType` string
 * computed in js/matrix-engine.js (LEADER_ACTION, INTUITION_WISDOM,
 * CREATIVITY_ART, TEACHER_FREEDOM, TRANSFORMATION_POWER).
 *
 * One entry per bucket — not per-arcana — since the Talent Star Line
 * is presented through the archetype abstraction, not the raw number.
 *
 * API:
 *   DTalentContent.get(iconType) → { heading, why, shadow, path } or null
 */

window.DTalentContent = (function () {

  const archetypes = {

    LEADER_ACTION: {
      heading: 'You Move Before Anyone Else Is Ready To',
      why: `There is something you do that looks like courage to everyone else but feels, to you, like the only bearable option. When a room hesitates, you move. Hand you a half-formed plan and a circle of uncertain faces, and you'll be the one who steps across the threshold first — not because you're fearless, but because waiting sits in your body worse than acting ever has. People feel this in you almost immediately. They fall in behind your momentum without being asked, because something in the way you carry a decision tells them it's already happening. You are the starter, the closer, the steady hands a stalled moment has been waiting for.`,
      shadow: `The trouble begins when you push where you should have paused. You can mistake speed for progress, and control for leadership, driving a plan forward long after the moment that needed it has quietly closed behind you. When that happens, you burn through people faster than you realize — not because you meant to, but because your pace left no room for anyone to catch their breath. If people have been quietly dropping off, agreeing with you less than they used to, that isn't bad luck. It's an echo coming back to you. And underneath the compulsion to keep moving, there is often a younger you who learned that hesitating meant being overlooked or left behind — a child for whom constant motion became the only way to feel safe or seen. That child wasn't wrong to learn it. It worked. It kept you visible.`,
      blocks: `What can block this talent: imposing your pace on people who never agreed to it, and refusing to slow down even when the room is visibly asking you to.`,
      path: `You are allowed to pause without disappearing. That is the quiet threshold you're standing at now: the old rule said motion equals safety, and something in you is beginning to sense that it no longer has to. Try asking a second question before you move — not just "can I push this forward," but "should I, right now, like this." Your drive is real and it is rare; most people freeze where you act. The mastery isn't slowing down for its own sake. It's choosing your moments as carefully as you already execute them, so people stop bracing against you and start moving with you. When was the last time you let a moment pass without acting on it — and what did the stillness try to tell you?`,
      positive: `Here, your drive and your discernment are working together instead of one racing ahead of the other. You still move first — that hasn't changed, and it isn't supposed to — but now there's a half-second pause before the push, just long enough to ask whether this moment actually wants your speed or your stillness. People feel the difference immediately, even if they couldn't name it. Your momentum stops reading as pressure and starts reading as invitation. The room falls in behind you not because they've been swept along, but because they trust the read that got you moving in the first place. Projects you lead actually finish, because you're no longer abandoning the unglamorous middle for the next exciting start. And the people closest to you stop bracing for your next sudden shift, because your motion has become something they can plan their own lives around instead of something they have to survive. This is what the talent was always for — not constant motion, but motion that lands.`,
      negative: `Here, the same force that could move a room instead becomes the thing everyone in it is quietly organizing around avoiding. You push when the moment was asking for patience, and mistake the resulting friction for resistance to your vision rather than a signal about your timing. People stop offering their honest reservations, not because they agree, but because disagreeing with your momentum has stopped feeling worth the cost. Over time this creates a specific, lonely kind of leadership: you're technically followed, but no longer really joined — compliance standing in for the collaboration you actually wanted. Projects launch fast and stall in the same unglamorous middle every time, because the push that started them never learned to become the patience that would finish them. And underneath it, the same old fear keeps running the show: that stopping, even for a moment, means disappearing. It never quite lets you find out that the opposite might be true.`,
    },

    INTUITION_WISDOM: {
      heading: 'You Know Before You Can Explain How',
      why: `You sense what's true before anyone hands you the proof. A room shifts and you feel it in your body before a word is spoken. A pattern repeats and you've clocked it three instances before anyone else notices there is one. This isn't guessing, and it isn't luck — it's a genuine gift for depth: for research, for reading people, for holding a complicated situation open without needing to resolve it just to feel comfortable. Where this sits in your chart, it marks a talent for going below the surface and staying down there long enough to actually understand something. Most people can't tolerate that depth. You live in it.`,
      shadow: `The catch is what you do with what you know. It's easy to let your perception become a private world instead of something you share — to stay quiet when speaking up could genuinely help, because turning a felt sense into plain words feels like it will lose something in translation. You may prefer the certainty of working things out alone over the mess of working them out with people. And if it ever feels like nobody's really listening to you, it's worth asking gently whether you've actually said the thing out loud yet. Somewhere behind that silence there is often a child who spoke what they sensed and wasn't believed — who learned that voicing the invisible wasn't welcome, and so made quiet into a fortress long before it became a spiritual style. That fortress protected you once. It's allowed to have been necessary.`,
      blocks: `What can block this talent: keeping your perception entirely private, and treating the mess of saying it out loud as a reason not to try.`,
      path: `You are allowed to be heard — not just to know, but to be known for what you know. Your work now is translation: finding the words, the timing, the moment that lets what you already sense reach the people who need it. What you carry was never meant to stay entirely internal, and the recognition you've been quietly hoping for can only respond to something you've actually offered. The more you say the true thing out loud, in real time, the more the world finally has something of yours to answer. What is one thing you've known for a long time that you have never once said out loud?`,
      positive: `The knowing is exactly as sharp as it's always been — what's changed is that it no longer dies in the privacy of your own mind. You feel a room shift, and instead of quietly filing it away, you say the thing, even before you can fully justify it, and let people respond to something real instead of guessing at your silence. This changes what depth actually gets you. People stop experiencing you as unreadable and start experiencing you as someone whose read they can trust, because you've actually offered it enough times for them to test it against reality. Collaboration deepens, because insight that's spoken can be built on, argued with, refined — insight that's withheld can only ever be admired from a distance, if it's noticed at all. And the specific ache of feeling unseen starts to loosen, not because anyone finally looked hard enough, but because you finally gave them something real to look at.`,
      negative: `The perception is still there, running exactly as accurately as ever — it's just staying entirely inside you, which means it might as well not exist for anyone else. You sense what's true and say nothing, or say something so hedged and softened it barely counts as having spoken at all, and then feel the particular loneliness of being surrounded by people who have no idea how clearly you actually see them. Collaboration stays shallow, because no one can build on a read you never offered. Recognition never arrives, because it can't respond to a silence, however accurate that silence turns out to be later. And the old fear that first built the fortress — that speaking the invisible thing out loud will get it dismissed or disbelieved again — keeps getting a strange kind of confirmation: no one disbelieves you, because no one ever actually heard what you knew.`,
    },

    CREATIVITY_ART: {
      heading: 'You Make Things That Are Meant to Be Seen',
      why: `You have a gift for taking what's happening inside you and giving it a form other people can feel. Aesthetics, performance, public creative work — wherever this lands on your Talent Star Line, it marks a real talent for making things that move people, and for standing visible while you do it. This isn't vanity, whatever you may have been told. It's closer to translation: a private feeling finding its outer body, a thread pulled from somewhere wordless and woven into something someone else can hold.`,
      shadow: `Where this gets complicated is when you start needing the reaction more than you trust the work. You might notice yourself quietly shrinking a piece — making it safer, more predictable, more likely to be liked — trading its truth for its reception. Visibility starts to feel like the point instead of the natural echo of expressing something real. If audiences keep feeling lukewarm, it's worth asking whether the work got softened somewhere on its way out of you. And beneath that softening there is often a child whose creativity was only truly welcomed when it pleased — who learned early that being seen depended on being palatable first. That child made a reasonable bargain with the world it was given. You're allowed to grieve that it was ever the price.`,
      blocks: `What can block this talent: softening the work to make it more likeable, and needing the reaction more than you trust what you actually made.`,
      path: `You are allowed to make something true before you make it likeable. That's the threshold in front of you: letting being seen become a consequence of expression rather than its goal. Your talent is real, and it deserves an audience — but it doesn't need one to already be valid while you're making it. The more the work comes from genuine expression instead of approval-seeking, the more the audience it draws responds to something alive instead of something merely safe. If no one ever reacted to your work again — what would you make next, and for whom?`,
      positive: `The work still comes from the same private, wordless place it always has — what's different is that you stop editing it down before it's fully arrived. You make the true thing first and let it be seen second, instead of pre-shrinking it to something safer on its way out. This is where the actual gift lives, and people can feel the difference instantly, even if they can't say why one piece moves them and another merely impresses them. An audience built on genuine expression doesn't just admire the work, it recognizes something in itself through it — which is a different, deeper kind of response than approval, and it tends to be the kind that lasts. Visibility stops being the anxious goal and becomes what it was always meant to be: the natural, secondary echo of having made something real. And because the work isn't performing for reception anymore, making it again gets easier instead of harder each time.`,
      negative: `The instinct to create is still fully intact — it's just getting filtered through a question the work was never supposed to answer: will this be liked. Each piece gets quietly rounded off, softened, made a little safer than the version that first moved through you, and the audience — sensing something withheld even if they can't name it — responds with the same muted warmth the work was made with. This can look, from the outside, like steady output and reasonable reception, which makes the actual cost easy to miss: a slow substitution of truth for likability that eventually makes it hard to remember what the unshrunk version even sounded like. The old bargain that first taught you to please before you expressed keeps renewing itself here, one small edit at a time, and the applause it earns never quite reaches the place in you that was originally trying to be known.`,
    },

    TEACHER_FREEDOM: {
      heading: 'You Teach Best When You Let People Outgrow You',
      why: `You have a real talent for passing on what you know while leaving room for the other person to eventually go further than you did. It shows up as an aptitude for teaching, for building systems other people can actually use, for walking unconventional paths that others can later walk without you beside them. The best version of this gift was never about being needed. It's about building a container strong enough to hold people while they grow — and open enough that they can leave it when they're ready.`,
      shadow: `The risk here is subtle: a quiet need to stay necessary. You might catch yourself keeping a student, a team, or a system just slightly dependent on you continuing to show up — even while telling yourself, and them, that you're giving them freedom. The opposite trap exists too: rejecting structure so completely that nothing durable ever gets built or passed on. If the people you teach never quite launch on their own, it's worth asking gently whether the freedom you're offering is real or just the word you use for it. Underneath, there is often a child whose place in the family depended on being needed — for whom being indispensable became identity long before it became a teaching style. That child found belonging the only way that was offered. It made sense then.`,
      blocks: `What can block this talent: keeping people quietly dependent on you, or rejecting structure so completely that nothing durable ever gets passed on.`,
      path: `You are allowed to matter without being needed. That's the threshold: teaching yourself out of a job, building something — or someone — fully capable of standing without you, and discovering that your worth survives their independence. That's the true measure of this talent. Once the freedom you offer is genuine rather than managed, the people you teach actually take it and run, and what you built keeps compounding long after you've stepped back. If everyone you've ever taught outgrew you tomorrow, what would be left that's just yours?`,
      positive: `You still build the container the same way you always have — strong enough to actually hold someone while they grow. What's different is that you're also, deliberately, building the exit. You teach the thing and then step back far enough to let someone actually use it without you, resisting the old pull to stay just slightly indispensable. This is where the real measure of the gift shows up: not in how needed you are, but in how far the people and systems you built travel once you're no longer holding them up. Students launch. Teams run without your constant presence. Whatever you built keeps compounding on its own momentum, which is the only kind of legacy that was ever actually durable. And the specific fear underneath this talent — that your worth was tied to being needed — gets to quietly, finally, prove itself wrong.`,
      negative: `The teaching still happens, the systems still get built, but there's a small, consistent gap left in every one of them — a dependency, barely visible even to you, that keeps the whole structure oriented around your continued presence. You call it support. The people relying on it eventually feel it as something closer to a leash. Whatever you've built stops compounding on its own, because it was never actually designed to survive without you standing somewhere inside it. This can go on for a long time without anyone naming it, because it looks so much like generosity from the outside — until a student or a team finally attempts to stand alone and discovers how much of the structure was actually you. The old fear that first built this pattern, that being needed was the only guaranteed place in the family or the room, keeps recreating the exact conditions that let it stay true.`,
    },

    TRANSFORMATION_POWER: {
      heading: 'You Find Clarity Right Where Everyone Else Loses It',
      why: `You have a talent that only reveals itself when things fall apart. You step into collapse, crisis, real upheaval — and where other people freeze or scatter, something in you steadies. You can see what the breakdown is actually clearing space for while everyone around you is still grieving the rubble. This is a genuine capacity to turn a mess into a foundation, not just survive it. In the storm, you are the still point. People sense it, and they move toward you when everything else is moving away.`,
      shadow: `The risk is that crisis becomes your only comfortable terrain. Without quite meaning to, you can find yourself drawn toward drama or upheaval because stillness feels unfamiliar by comparison — even tearing down things that still had value, simply because tearing down is the move your hands know best. If upheaval keeps arriving in your life more often than seems reasonable, it's worth asking whether some part of you still doesn't trust the quiet. Often there's a child underneath this — one raised where only crisis reliably got attention, where calm was just the held breath before something broke. For that child, chaos was legible and peace was suspicious. Learning to read the storm was how you survived it. Of course calm still feels like a stranger.`,
      blocks: `What can block this talent: seeking out upheaval because stillness feels untrustworthy, and tearing down things that still had real value out of habit.`,
      path: `You are allowed to rest inside a life that isn't on fire. That's the threshold you're standing at: learning to tell the difference between change that's genuinely needed and change that's merely familiar. Your capacity for transformation is real — the mastery is saving it for the moments that actually call for it, and letting the quiet stretches be quiet. Once stillness stops registering as a threat, change gets to arrive on its own terms instead of needing a crisis to get your attention. When your life is finally calm — what do you notice yourself waiting for?`,
      positive: `The clarity you find inside real crisis is still exactly as sharp as it's always been — the difference is that crisis has stopped being the only place you can access it. You've learned to tell the difference between change that's genuinely needed and change that's just familiar, which means you no longer have to manufacture upheaval just to feel like yourself. When something actually does fall apart, you're still the still point everyone gravitates toward, steady while the room scatters. But now the quiet stretches between those moments get to stay quiet too, instead of being sacrificed to a restlessness that used to read as instinct. Change, when it comes, arrives on its own timeline instead of needing a crisis to summon it — deliberate instead of catastrophic, chosen instead of triggered. And stillness, once a stranger, starts to feel like something you can actually live inside.`,
      negative: `The gift for finding clarity in collapse hasn't gone anywhere — it's just that some part of you has quietly started arranging for collapse to keep arriving, because a life without it feels unfamiliar in a way that reads, wrongly, as unsafe. Stillness sits like a held breath waiting for the next disruption, and if one doesn't show up on its own, you may find yourself the one pulling something down that still had real value, just to have the reliable terrain back under your feet. This can look, for a long stretch, like resilience — you always handle the crisis well, so no one questions why there's always another one. Underneath it, the same old wiring keeps running: chaos is legible, and calm is the thing that can't yet be trusted. Until that trust is rebuilt, the quiet keeps getting interrupted before it ever has the chance to prove itself safe.`,
    },

  };

  /**
   * PER-POSITION, PER-ARCANA TIER (added 2026-07-28)
   * ─────────────────────────────────────────────────
   * The archetype tier above has only 5 entries, shared across 3-5 arcana
   * each — the last remaining spot in the app where genuinely different
   * readers could see identical copy. Two star positions actually render
   * this content: `pastLife` (P, "Hidden Past-Life Talent") and `personal`
   * (K, "Self-Expression & Social Interaction") — see js/matrix-engine.js's
   * TALENT STAR LINE comment for the naming correction this followed. Crown
   * (B) is not included here: it's already rendered as the Sky Line arcana
   * star with its own full micro-content.js position-specific reading.
   *
   * P and K happen to be the same raw values used as Ajna's and Vishuddha's
   * Physical/Energy inputs in js/chakra-content.js, but per NON_NEGOTIABLE_
   * RULES' Absolute System Isolation, this is written as its own distinct
   * content — a shared numeric source doesn't mean shared language. The
   * Talent Star Line asks a different question of the same number: not "how
   * does this chakra feel" but "what is this talent, and what blocks it."
   *
   * Field shape matches the archetype tier: heading / why / shadow / blocks
   * / path (written, not rendered — same decision as everywhere else) /
   * positive / negative.
   *
   * API: DTalentContent.getForPosition(key, arcanaNum) → entry or null
   */
  const positions = {

    pastLife: {
      1: {
        heading: `A Skill You Already Have, From Before You Learned It Here`,
        why: `Something in you can already initiate — decisively, without the usual runway most people need to work up to starting. It doesn't feel learned because it wasn't, not fully, not this time. You watch other people build up courage to begin something and feel a faint impatience, as though you're waiting for them to catch up to a starting line you were already standing past.`,
        shadow: `The risk is treating an inherited fluency as proof you should never need to prepare, so you skip the groundwork a genuinely new situation actually requires, trusting old instinct to carry you through unfamiliar terrain it was never built for.`,
        blocks: `What can block this talent: assuming the old fluency transfers automatically to situations it was never actually tested against.`,
        path: `Try pairing the instinct with real preparation, at least once, in a genuinely new arena. You are allowed to have a head start and still do the homework. Where have you skipped preparing because starting has always come easily?`,
        positive: `The inherited fluency for starting is still real and still yours — that hasn't changed — but you've paired it with real preparation in at least one genuinely new arena, instead of trusting old instinct alone to carry unfamiliar terrain. The head start compounds now, instead of occasionally running out from under you.`,
        negative: `The inherited ease with initiating is genuine, and it's being trusted past where it was actually tested, skipping preparation a new situation would benefit from. You might notice you've stumbled somewhere unfamiliar precisely because starting has always come so easily that preparing never occurred to you.`,
      },
      2: {
        heading: `A Perceptiveness You Brought With You, Already Trained`,
        why: `You read situations with an accuracy that outpaces your actual experience of them, as though some prior fluency in reading people and rooms simply carried over. It rarely feels like learning; it feels more like remembering something you already knew how to do.`,
        shadow: `The risk is trusting this inherited perceptiveness so completely that you stop checking it against present reality, treating an old, well-worn read as sufficient for a genuinely new situation it wasn't actually calibrated for.`,
        blocks: `What can block this talent: applying an old pattern-read to a new situation without checking whether it actually still fits.`,
        path: `Try verifying one inherited read against the actual present facts before acting on it. You are allowed to have deep perceptiveness and still fact-check it sometimes. Where have you trusted an old pattern that might not fit this particular situation?`,
        positive: `The inherited perceptiveness is still exactly as sharp as it's always been — that hasn't changed — but you've started checking it against present reality at least once, instead of trusting an old pattern-read automatically. Your accuracy is even higher now, because it's being tested, not just trusted.`,
        negative: `The inherited perceptiveness is genuine, and it's being trusted without verification, applying an old, well-worn read to situations it was never actually calibrated for. You might notice you've misjudged something specifically because the old pattern felt too familiar to question.`,
      },
      3: {
        heading: `A Capacity to Nurture That Arrived Already Fluent`,
        why: `You know how to tend, grow, and provide for people with a fluency that feels inherited rather than built — as though some prior lifetime of caretaking simply carried its skill forward into this one, already practiced.`,
        shadow: `The risk is that this inherited fluency makes you the automatic caretaker in any new situation, regardless of whether that role actually fits or whether anyone's asked for it, because providing is simply what the old skill knows how to do.`,
        blocks: `What can block this talent: stepping into the caretaker role automatically, whether or not it's actually needed or wanted.`,
        path: `Try entering one new situation without automatically becoming its caretaker. You are allowed to have deep nurturing fluency and not deploy it by default. Where have you taken on care nobody actually asked you for?`,
        positive: `The inherited fluency for nurturing is still real and still generous — that hasn't changed — but you've entered at least one situation without automatically becoming its caretaker, letting the role be chosen rather than defaulted into. Your care lands more precisely now, because it's offered rather than assumed.`,
        negative: `The inherited nurturing fluency is genuine, and it's deploying automatically in situations that never actually asked for it, making you the default caretaker whether or not the role fits. You might notice you've taken on care nobody requested, simply because providing is what the old skill knows how to do.`,
      },
      4: {
        heading: `A Command Over Structure That Feels Older Than Your Actual Practice`,
        why: `You can organize, direct, and hold authority with a steadiness that outpaces how much practice you've actually had at it in this life — as though some prior fluency in structure and command carried forward, already seasoned.`,
        shadow: `The risk is that this inherited authority applies itself to situations that were never actually yours to direct, an old command reflex reaching for control in territory that belongs to someone else.`,
        blocks: `What can block this talent: directing situations reflexively, out of old habit, that were never actually yours to control.`,
        path: `Try stepping back from one situation your inherited command reflex wants to direct, and checking whether it's actually yours. You are allowed to hold deep authority and still ask whose turn it is. Where have you taken charge out of old habit rather than actual invitation?`,
        positive: `The inherited command over structure is still real and still steadying — that hasn't changed — but you've checked at least once whether a situation was actually yours to direct, instead of reaching for control out of old reflex. Your authority lands better now, because it's invited more often than assumed.`,
        negative: `The inherited authority is genuine, and it's reaching reflexively into situations that were never actually yours to direct. You might notice you've taken charge somewhere out of old habit, only to find the control wasn't wanted or needed there.`,
      },
      5: {
        heading: `A Body of Knowledge That Feels Already Studied`,
        why: `You grasp frameworks, traditions, and teachings with a speed that suggests you've studied this before — some prior fluency in transmitted wisdom carrying forward, ready to be picked back up rather than learned from nothing.`,
        shadow: `The risk is treating inherited certainty as settled fact rather than as a starting hypothesis, defending an old framework more fiercely than the actual evidence in front of you currently warrants.`,
        blocks: `What can block this talent: defending an inherited framework out of old certainty, rather than testing it against present evidence.`,
        path: `Try testing one piece of your inherited certainty against something you're currently learning fresh. You are allowed to hold deep prior knowledge and still update it. What old certainty of yours might need a second look?`,
        positive: `The inherited fluency with frameworks and teachings is still real and still valuable — that hasn't changed — but you've tested at least one piece of old certainty against fresh evidence, instead of defending it automatically. Your knowledge is more alive now, because it's still being updated, not just inherited.`,
        negative: `The inherited body of knowledge is genuine, and it's being defended as settled fact rather than tested as a starting point, holding an old framework more fiercely than the current evidence warrants. You might notice you've resisted updating something simply because it arrived already feeling certain.`,
      },
      6: {
        heading: `A Way of Choosing That Feels Already Practiced`,
        why: `You choose people and paths with a discernment that feels inherited — as though some prior lifetime of relational decision-making carried its skill forward, already fluent at knowing what genuinely fits.`,
        shadow: `The risk is that this inherited discernment applies an old template to new people, reading someone through the shape of a prior choice rather than actually seeing who's in front of you now.`,
        blocks: `What can block this talent: reading a new person through an old relational template instead of actually seeing them fresh.`,
        path: `Try meeting one person without the inherited template, actually seeing them as new rather than as a variation on someone before. You are allowed to have deep relational instinct and still look freshly. Who have you been reading through an old pattern instead of actually seeing?`,
        positive: `The inherited discernment for choosing well is still real and still valuable — that hasn't changed — but you've met at least one person freshly, without the old template doing the reading for you. Your choices land better now, because they're based on who's actually there.`,
        negative: `The inherited relational discernment is genuine, and it's reading new people through an old template rather than actually seeing them. You might notice you've misjudged someone specifically because they resembled a prior pattern that didn't actually apply.`,
      },
      7: {
        heading: `A Drive That Already Knows How to Move`,
        why: `You move toward goals with a momentum that feels seasoned rather than newly built — some prior fluency in directed pursuit carrying forward, already knowing how to steer toward something.`,
        shadow: `The risk is that this inherited momentum keeps moving toward goals that mattered in some other context, without checking whether the current direction is actually the one that matters now.`,
        blocks: `What can block this talent: pursuing an old, inherited direction without checking whether it's actually where you want to go now.`,
        path: `Try pausing the momentum once to check whether the current direction is actually yours, not just familiar. You are allowed to have deep drive and still redirect it. Where might your momentum be pointed at an old goal rather than a current one?`,
        positive: `The inherited momentum for directed pursuit is still real and still considerable — that hasn't changed — but you've paused it at least once to check the direction was actually yours now, not just familiar. Your drive is more precisely aimed, because it's been recalibrated rather than assumed.`,
        negative: `The inherited momentum is genuine, and it keeps moving toward a direction that may have mattered in some other context, without being checked against what actually matters now. You might notice real energy being spent on a goal that no longer fits, simply because the drive toward it feels so familiar.`,
      },
      8: {
        heading: `A Sense of Fairness That Arrived Already Calibrated`,
        why: `You read what's fair and what isn't with a precision that feels inherited — some prior fluency with justice and balance carrying forward, already trained rather than newly developed.`,
        shadow: `The risk is applying an old standard of fairness to a present situation that actually calls for a different calibration, holding everyone to a bar set somewhere else, in some other context.`,
        blocks: `What can block this talent: applying an inherited fairness standard rigidly, without checking whether it actually fits the present situation.`,
        path: `Try checking one inherited fairness judgment against the actual specifics of your current situation. You are allowed to have deep moral instinct and still recalibrate it. Where might your sense of what's fair be set by an old standard rather than this particular case?`,
        positive: `The inherited sense of fairness is still real and still precise — that hasn't changed — but you've checked at least one judgment against the actual present situation, instead of applying an old standard automatically. Your fairness lands more accurately now, calibrated to what's actually in front of you.`,
        negative: `The inherited fairness calibration is genuine, and it's being applied rigidly to situations that actually call for different terms, holding a present case to a standard set somewhere else. You might notice a judgment that felt certain turned out to be measuring the wrong thing for this particular situation.`,
      },
      9: {
        heading: `A Depth You Already Know How to Reach`,
        why: `You can go inward and find real understanding with a fluency that feels practiced rather than newly discovered — some prior lifetime of solitary depth-work carrying forward, already knowing the way down.`,
        shadow: `The risk is that this inherited fluency for solitude makes withdrawal your automatic answer to anything difficult, reaching for the old, familiar depth instead of trying a genuinely new approach a current situation might actually need.`,
        blocks: `What can block this talent: retreating into old, familiar solitude by default, instead of trying an approach the current situation actually needs.`,
        path: `Try meeting one difficulty without your automatic retreat into solitude, at least at first. You are allowed to have deep inner resources and still try something else first. Where have you withdrawn out of old habit rather than genuine current need?`,
        positive: `The inherited fluency for depth and solitude is still real and still valuable — that hasn't changed — but you've met at least one difficulty without the automatic retreat, trying something else first. Your solitude is more chosen now, not just the old default.`,
        negative: `The inherited capacity for solitary depth is genuine, and it's become the automatic answer to anything difficult, reaching for old familiar withdrawal rather than trying what the current situation might actually need. You might notice you've retreated somewhere that could have used a different, less practiced response.`,
      },
      10: {
        heading: `An Adaptability That Already Knows the Turning`,
        why: `You move with change more fluently than your actual experience would predict, as though some prior lifetime of navigating cycles and reversals carried its skill forward, already knowing how circumstances turn.`,
        shadow: `The risk is that this inherited fluency with change makes you expect every situation to turn the way old ones did, missing that a genuinely new circumstance might follow a different pattern entirely.`,
        blocks: `What can block this talent: expecting a present situation to follow an old cyclical pattern that may not actually apply here.`,
        path: `Try treating one current change as genuinely new, rather than assuming it follows the old, familiar turning. You are allowed to have deep adaptive instinct and still check the pattern. Where might you be expecting an old cycle that this situation isn't actually following?`,
        positive: `The inherited fluency with change and cycles is still real and still useful — that hasn't changed — but you've treated at least one current situation as genuinely new, instead of assuming the old pattern applies. Your adaptability is sharper now, because it's checking rather than just assuming.`,
        negative: `The inherited adaptability is genuine, and it's assuming present situations follow old cyclical patterns that may not actually apply here. You might notice you braced for a turning that never came, because a new circumstance simply didn't follow the old shape.`,
      },
      11: {
        heading: `A Steadiness That Arrived Already Tested`,
        why: `You hold up under pressure with a calm that feels inherited rather than newly built — some prior lifetime of enduring real strain carrying its steadiness forward, already proven rather than freshly discovered.`,
        shadow: `The risk is that this inherited steadiness gets assumed to be limitless, so you keep absorbing new strain on old confidence without checking whether this particular load is actually within current capacity.`,
        blocks: `What can block this talent: assuming an inherited steadiness is limitless, absorbing new strain without checking your actual current capacity.`,
        path: `Try checking your actual current capacity before absorbing one more thing, rather than trusting the old steadiness automatically. You are allowed to have deep endurance and still have a limit today. What load are you carrying on old confidence rather than current capacity?`,
        positive: `The inherited steadiness under pressure is still real and still genuine — that hasn't changed — but you've checked your actual current capacity at least once, instead of trusting old confidence automatically. Your endurance is more sustainable now, because it's being measured, not just assumed.`,
        negative: `The inherited steadiness is genuine, and it's being assumed limitless, absorbing new strain on old confidence without checking actual current capacity. You might notice you're carrying more than you can currently sustain, simply because the steadiness has always held before.`,
      },
      12: {
        heading: `A Capacity for Stillness That Already Knows How to Wait`,
        why: `You can hold suspension and uncertainty with a patience that feels practiced rather than newly learned — some prior lifetime of waiting and reflecting carrying its skill forward, already fluent at not-yet.`,
        shadow: `The risk is that this inherited patience becomes an automatic response even to situations that actually need action now, mistaking old, comfortable waiting for the wisdom of the pause.`,
        blocks: `What can block this talent: waiting reflexively, out of old comfort with suspension, even when a situation actually calls for action.`,
        path: `Try acting on one thing you'd normally let sit in inherited patience, checking whether waiting is actually still called for. You are allowed to have deep capacity for stillness and still move when it's time. Where has your patience become avoidance rather than genuine waiting?`,
        positive: `The inherited capacity for patient stillness is still real and still valuable — that hasn't changed — but you've acted on at least one thing you'd normally let sit, checking whether the waiting was still actually needed. Your patience is more discerning now, not just a comfortable default.`,
        negative: `The inherited patience is genuine, and it's becoming an automatic response even where action is actually needed, mistaking old comfortable waiting for present wisdom. You might notice something has sat too long in stillness that actually needed you to move.`,
      },
      13: {
        heading: `A Fluency With Ending and Rebuilding That Feels Already Practiced`,
        why: `You move through endings and reconstructions with a fluency that outpaces your actual experience — some prior lifetime of transformation carrying its skill forward, already knowing how to let something die and build again.`,
        shadow: `The risk is that this inherited fluency with ending makes you end things prematurely, applying old transformation instinct to situations that might actually have more life left in them than the reflex assumes.`,
        blocks: `What can block this talent: ending things prematurely out of old reflex, before checking whether they actually still have life in them.`,
        path: `Try checking one thing your ending-instinct wants to close, to see whether it's actually finished. You are allowed to have deep transformative fluency and still ask if it's really over. What have you been ready to end that might not actually be done?`,
        positive: `The inherited fluency with ending and rebuilding is still real and still valuable — that hasn't changed — but you've checked at least one thing before closing it, finding it had more life left than the old reflex assumed. Your endings land more accurately now, timed to what's actually finished.`,
        negative: `The inherited fluency with ending is genuine, and it's closing things prematurely, applying old transformation instinct to situations that might have had more life in them. You might notice you've ended something that, checked more carefully, wasn't actually done.`,
      },
      14: {
        heading: `A Balance That Arrived Already Calibrated`,
        why: `You find equilibrium between competing demands with a fluency that feels inherited — some prior lifetime of blending and moderating carrying its skill forward, already practiced at finding the workable mix.`,
        shadow: `The risk is that this inherited calibration applies an old blend to a new situation that might actually need a different, less familiar proportion entirely.`,
        blocks: `What can block this talent: applying an old, familiar balance to a situation that might actually need a different proportion.`,
        path: `Try letting one situation find its own proportion, rather than defaulting to the old inherited blend. You are allowed to have deep calibration instinct and still recheck the mix. Where might your usual balance not actually fit this particular situation?`,
        positive: `The inherited fluency for balance is still real and still genuinely useful — that hasn't changed — but you've let at least one situation find its own proportion, instead of defaulting to the old blend. Your calibration is more precise now, fitted to what's actually in front of you.`,
        negative: `The inherited calibration is genuine, and it's applying an old, familiar blend to situations that might need a different proportion entirely. You might notice a balance that's always worked before isn't quite fitting this particular case.`,
      },
      15: {
        heading: `An Intensity You Already Know How to Hold`,
        why: `You carry strong appetite and desire with a fluency that feels inherited — some prior lifetime of wanting deeply carrying its intensity forward, already practiced at holding what most people find overwhelming.`,
        shadow: `The risk is that this inherited intensity gets treated as simply how you are, rather than examined for whether it's actually serving you now, letting an old pattern of wanting run unexamined.`,
        blocks: `What can block this talent: treating inherited intensity as simply fixed, rather than examining whether it's actually serving you now.`,
        path: `Try examining one piece of inherited intensity honestly, checking what it's actually serving. You are allowed to have deep capacity for wanting and still examine it. What intense pattern have you never questioned because it's simply always been there?`,
        positive: `The inherited intensity is still real and still considerable — that hasn't changed — but you've examined at least one piece of it honestly, checking what it's actually serving now. Your capacity for wanting is more consciously held, not just running on old, unexamined pattern.`,
        negative: `The inherited intensity is genuine, and it's running unexamined, treated as simply how you are rather than checked against whether it still serves you. You might notice a pattern of wanting that's never been questioned, simply because it arrived already this strong.`,
      },
      16: {
        heading: `A Resilience That Was Already Proven Before This Life`,
        why: `You come back from collapse with a speed that feels inherited — some prior lifetime of surviving sudden rupture carrying its resilience forward, already tested rather than newly discovered.`,
        shadow: `The risk is that this inherited resilience gets relied on so completely that you stop taking precautions against collapse, trusting the old recovery skill to handle whatever comes rather than working to prevent it.`,
        blocks: `What can block this talent: relying on inherited resilience instead of taking reasonable precautions against a collapse actually being preventable.`,
        path: `Try applying some of your rebuilding capacity toward prevention, for once, instead of only trusting recovery. You are allowed to have deep resilience and still build safeguards. What could you protect now, rather than trusting you'll rebuild it later?`,
        positive: `The inherited resilience after collapse is still real and still proven — that hasn't changed — but you've applied some of that capacity toward prevention too, instead of only trusting recovery. You're building safeguards now, not just trusting the old rebuilding skill to handle everything after the fact.`,
        negative: `The inherited resilience is genuine, and it's being relied on so completely that precautions against collapse go unconsidered, trusting old recovery skill over prevention. You might notice something fell that reasonable safeguards could have caught, because the recovery skill felt sufficient on its own.`,
      },
      17: {
        heading: `A Hope That Arrived Already Trusting`,
        why: `You carry an undertone of trust that things turn out well, a fluency that feels inherited — some prior lifetime of hoping through difficulty carrying its quiet trust forward, already practiced.`,
        shadow: `The risk is that this inherited hope stays deliberately modest, protecting itself from disappointment the way it may have needed to before, even when your current circumstances could actually support wanting more.`,
        blocks: `What can block this talent: keeping inherited hope modest out of old protective habit, even when current circumstances could support more.`,
        path: `Try letting the inherited hope be fully sized once, checking whether your current circumstances actually warrant the old caution. You are allowed to hope at full size now. What hope have you been keeping small out of an old habit that might not fit anymore?`,
        positive: `The inherited hope is still real and still genuinely yours — that hasn't changed — but you've let it be fully sized at least once, checking that your current circumstances actually warrant less caution than the old habit assumed. Your hope carries more weight now, matched to what's actually possible.`,
        negative: `The inherited hope is genuine, and it's staying deliberately modest out of old protective habit, even where current circumstances could support wanting more. You might notice you underclaim a hope that your actual situation would justify at full size.`,
      },
      18: {
        heading: `A Sensitivity That Arrived Already Attuned, Even If Foggy`,
        why: `You sense undercurrents and hidden material with a fluency that feels inherited — some prior lifetime of perceiving below the surface carrying its attunement forward, real even when it's hard to fully articulate.`,
        shadow: `The risk is that this inherited sensitivity stays entirely unsorted, so old, absorbed material and genuinely current perception blur together, making it hard to tell which fog belongs to now.`,
        blocks: `What can block this talent: leaving inherited and current sensitivity unsorted, so old absorbed material gets mistaken for present signal.`,
        path: `Try sorting one piece of foggy perception — asking whether it's genuinely current or something older you're still carrying. You are allowed to have deep sensitivity and still do the sorting work. What unease have you been carrying that might actually belong to somewhere else?`,
        positive: `The inherited sensitivity is still real and still genuinely attuned — that hasn't changed — but you've sorted at least one piece of fog, distinguishing what's actually current from what's older material still being carried. Your perception is clearer now, because some of it has been sorted.`,
        negative: `The inherited sensitivity is genuine, and it's staying entirely unsorted, blurring old absorbed material with current perception. You might notice an unease you can't quite place, because it may belong to something older than your present circumstances.`,
      },
      19: {
        heading: `A Warmth That Arrived Already Open`,
        why: `You carry vitality and open-heartedness with a fluency that feels inherited — some prior lifetime of resilient warmth carrying itself forward, already practiced at staying bright.`,
        shadow: `The risk is that this inherited warmth becomes a requirement rather than a genuine expression, staying visibly bright even in moments that would reasonably call for acknowledging real difficulty.`,
        blocks: `What can block this talent: performing inherited warmth even in moments that actually call for acknowledging real difficulty first.`,
        path: `Try letting one real difficulty be named plainly, before the inherited warmth automatically smooths it over. You are allowed to have deep vitality and still sit with something hard. What difficulty has your warmth been quietly covering?`,
        positive: `The inherited warmth is still real and still genuinely yours — that hasn't changed — but you've let at least one real difficulty be named plainly, before the warmth automatically smoothed it over. Your brightness includes honesty now, not just performance.`,
        negative: `The inherited warmth is genuine, and it's performing even in moments that actually call for acknowledging real difficulty first. You might notice a hard thing got smoothed over by old, automatic brightness before it was actually addressed.`,
      },
      20: {
        heading: `A Readiness to Answer a Call That Was Already Familiar`,
        why: `You sense a summons — a bigger purpose, a reckoning — with a fluency that feels inherited, some prior lifetime of answering a call carrying its readiness forward, already primed for this.`,
        shadow: `The risk is that this inherited readiness stays permanently primed without ever actually answering, since the sense of being called can feel complete on its own, without the corresponding action.`,
        blocks: `What can block this talent: staying inherited-ready to answer a call indefinitely, without the readiness ever converting into actual response.`,
        path: `Try converting the inherited readiness into one actual step, rather than letting the primed feeling stand in for the answer. You are allowed to act on the summons now, imperfectly. What call have you felt ready for, for a long time, without actually answering it?`,
        positive: `The inherited readiness to answer a call is still real and still primed — that hasn't changed — but you've converted it into an actual step at least once, instead of letting the readiness stand in for the response. The summons is being answered now, not just sensed.`,
        negative: `The inherited readiness is genuine, and it's staying permanently primed without converting into actual action, since feeling called can seem complete on its own. You might notice you've felt ready for something important for a long time without ever actually responding to it.`,
      },
      21: {
        heading: `A Sense of the Whole That Arrived Already Integrated`,
        why: `You see how pieces connect into a larger picture with a fluency that feels inherited — some prior lifetime of synthesizing and integrating carrying its wholeness forward, already practiced at seeing the whole system.`,
        shadow: `The risk is that this inherited need for wholeness delays action on things you're actually ready to do, waiting for a comprehensive picture that isn't always necessary before moving.`,
        blocks: `What can block this talent: waiting for the inherited whole-picture view before acting on something you're actually already ready for.`,
        path: `Try acting on one isolated thing you're ready for, without waiting for the inherited need for the whole picture first. You are allowed to have deep integrative capacity and still act on a fragment. What have you delayed because you were waiting to see how it all connects?`,
        positive: `The inherited capacity for seeing the whole picture is still real and still sophisticated — that hasn't changed — but you've acted on at least one isolated thing you were ready for, without waiting for full integration first. Your capability is more available now, not gated behind needing to see everything at once.`,
        negative: `The inherited need for wholeness is genuine, and it's delaying action on things you're actually ready for, waiting for a comprehensive picture that isn't always necessary. You might notice something you were ready to do got delayed simply because the full picture wasn't yet visible.`,
      },
      22: {
        heading: `A Trust in the Leap That Was Already Practiced`,
        why: `You move toward the unknown with a fluency that feels inherited — some prior lifetime of trusting uncertain leaps carrying its openness forward, already practiced at not needing the guarantee first.`,
        shadow: `The risk is that this inherited trust in leaping gets used to skip preparation that a genuinely new situation would actually benefit from, relying on old courage rather than building anything new to stand on.`,
        blocks: `What can block this talent: leaping on inherited courage alone, skipping preparation a genuinely new situation would actually benefit from.`,
        path: `Try pairing one leap with real preparation, rather than trusting the inherited openness alone. You are allowed to have deep trust in uncertainty and still prepare. What leap could use a little more groundwork than your old courage usually bothers with?`,
        positive: `The inherited trust in leaping is still fully real — that openness isn't going anywhere — but you've paired it with real preparation at least once, instead of relying on old courage alone. Your capacity for the unknown is more grounded now, not just braver.`,
        negative: `The inherited trust in leaping is genuine, and it's being used to skip preparation a genuinely new situation would actually benefit from, relying on old courage rather than building something new to stand on. You might notice a leap that could have used more groundwork than the old courage provided.`,
      },
    },

    personal: {
    },

  };

  function get(iconType) {
    return archetypes[iconType] || null;
  }

  function getForPosition(key, arcanaNum) {
    const group = positions[key];
    if (!group) return null;
    return group[Number(arcanaNum)] || null;
  }

  return { get, getForPosition };

})();
