'use strict';

/**
 * Destiny Matrix — Programs Database (Natalia Ladini system)
 * ----------------------------------------------------------
 * Each program is a 3-number combination found at specific
 * node intersections in the matrix. The `numbers` array is
 * order-independent — lookup matches any permutation.
 *
 * Content fields (Mastery/Shadow/Invitation voice):
 *   title      — position + numbers, e.g. "Pride — 6-5-17"
 *   tagline    — short, e.g. "A Design of Unbought Worth"
 *   mastery    — empowered, present-tense, standalone
 *   shadow     — same energy, standalone, not a continuation of mastery
 *   invitation — one concrete, doable action, not a reflection question
 *   health         — somatic / body manifestation (optional, kept as-is)
 *   indicators     — quick-scan bullet list (kept as-is)
 *   newStrategy    — one-line reframe (kept as-is)
 *   stepsToTake    — action list (kept as-is)
 */

window.DMPrograms = (function () {

  const programs = [

    // ── 1. SOCIAL STATUS & SELF-WORTH ──────────────────────────────────────

    {
      numbers: [16, 5, 7],
      name: 'Loss of Authority',
      category: 'Social Status & Self-Worth',
      title: `Loss of Authority — 16-5-7`,
      tagline: `A Design of Earned Doubt`,
      mastery: `You can tell the difference between real authority and a costume. Most people trust a title on sight. You don't — you watch what someone actually does before you hand them any weight, and that discernment protects you from following people who don't deserve it. When you do trust someone, it's real, because you made them earn it.`,
      shadow: `You punish every authority for what one of them did to you. You dismiss expertise on principle instead of on evidence, then wonder why capable people stop offering you their input. You quietly compete with every institution for the credibility they haven't proven they deserve — even when they have. That's not independence, that's an old betrayal running your calendar.`,
      invitation: `Pick one expert or authority figure you've been dismissing on reflex. Give them one real chance to be right this week, and actually check if they were.`,
      health: `This tends to show up in your neck and upper cervical spine — literally the place where your body holds the tension between "head" (authority, hierarchy, structure) and "body" (the felt sense of what's actually true). Watch for chronic tension headaches, jaw clenching especially at night, and a stiffness in your neck's range of motion. The pattern underneath is usually low-grade chronic activation rather than acute stress spikes — your body running a background vigilance program it's simply forgotten how to switch off.`,
      indicators: [
        `Distrust of experts and institutions`,
        `Quiet contempt for hierarchies you secretly still seek approval from`,
        `Entitlement around money without matching effort`,
        `Capability that stalls into near-misses`,
        `Gossip or devaluing of authority figures`,
        `Chronic neck and jaw tension`,
      ],
      newStrategy: `Separate the specific authority that failed you from authority itself, and let structures earn trust case by case again.`,
      stepsToTake: [
        `Name the exact authority figure or system that originally broke trust`,
        `Practice listening fully before preparing your rebuttal`,
        `Notice one moment this week you dismissed expertise reflexively`,
        `Let one capable person lead you without auditing them first`,
      ],
    },

    {
      numbers: [5, 17, 12],
      name: 'Public Disgrace / Fear of Shame',
      category: 'Social Status & Self-Worth',
      title: `Public Disgrace / Fear of Shame — 5-17-12`,
      tagline: `A Design of Unshakeable Exposure`,
      mastery: `You can be fully seen — flaws, past, everything — and not flinch. Most people spend their whole life managing what others might find out about them. You already let it out. You don't need people's approval to feel steady, so judgment just bounces off you instead of landing. That's not thick skin. That's actually being free.`,
      shadow: `You're on constant alert for the moment someone finds something to use against you. You stay ready to run before anyone even says a word. You punish yourself first, harder than anyone else could, just so no one gets the chance to do it for you. That's not confidence — that's hiding in plain sight and calling it strength.`,
      invitation: `Let one person see the part you'd normally manage or explain away — before you've cleaned it up first. Don't soften it, don't pre-apologize. Just let it sit there and watch that nothing actually happens.`,
      health: `Shame-based programs like this one tend to settle in the throat (where unspoken truth and suppressed expression live), the skin (your body's primary interface with the outside world and other people's gaze), and the immune system, which runs at a chronic low ebb in people maintaining high-tension presentation for long stretches. Watch for recurring tightness in the chest — your body's signal that the suspension is asking for release.`,
      indicators: [
        `Perpetual preparation that never quite launches`,
        `Strategic presentation instead of real exposure`,
        `Discernment used to avoid scrutiny rather than genuinely evaluate`,
        `Composure that hides constant low-level fear`,
        `Recurring chest tightness`,
        `Relationships or projects that never quite deepen`,
      ],
      newStrategy: `Treat public imperfection as the raw material of real credibility, not its opposite.`,
      stepsToTake: [
        `Share one true, unpolished thing this week`,
        `Notice the exact moment you reach for more preparation instead of action`,
        `Ask what would actually happen if you were seen unfinished`,
        `Let one 'almost ready' thing ship as-is`,
      ],
    },

    {
      numbers: [6, 5, 17],
      name: 'Pride',
      category: 'Social Status & Self-Worth',
      title: `Pride — 6-5-17`,
      tagline: `A Design of Unbought Worth`,
      mastery: `Your worth doesn't need a witness. You know what you value and you act from it, full stop — you're not performing integrity for anyone watching. That's real dignity, the kind that doesn't need defending because it was never up for debate in the first place.`,
      shadow: `Being wrong feels like being erased, so you fight corrections like they're attacks. You keep score of who's disrespected you and never put the ledger down. Your independence turns into an inability to be helped by anyone, because needing help feels like losing.`,
      invitation: `Let someone correct you today without defending yourself first. Just say "you're right" and leave it there. Nothing collapses. You'll notice that.`,
      health: `This pattern tends to concentrate in the throat and chest — the effort of constantly presenting yourself for an audience that may or may not be looking. Watch for tension tied to self-consciousness in social settings, and a restless, comparison-driven mental loop that disrupts real rest. The nervous system often runs in a low-grade performance mode, even in private, unwitnessed moments.`,
      indicators: [
        `Chasing visibility over developing actual skill`,
        `Blindly following trends instead of your own direction`,
        `Reading criticism as rejection instead of information`,
        `Private imposter feeling under outward reaching`,
        `Envy of others' recognition`,
        `Throat and chest tension from constant self-presentation`,
      ],
      newStrategy: `Redirect the energy spent being noticed into the patient development of something genuinely yours.`,
      stepsToTake: [
        `Pick one skill to develop quietly this month with no audience`,
        `Notice when you reach for an image instead of your own direction`,
        `Let one accomplishment go unannounced`,
        `Practice genuine curiosity about someone you'd normally dismiss`,
      ],
    },

    // ── 2. INTELLECTUAL & MINDSET ALIGNMENT ────────────────────────────────

    {
      numbers: [17, 22, 5],
      name: 'Academic Knowledge / Rigid Dogma',
      category: 'Intellectual & Mindset Alignment',
      title: `Academic Knowledge / Rigid Dogma — 17-22-5`,
      tagline: `A Design of the Mind That Updates`,
      mastery: `You build real understanding and then you're willing to tear it down the second better evidence shows up. That's rare. Most people defend what they already believe. You're one of the few who'll actually change your mind, which is exactly what makes your opinion worth having.`,
      shadow: `You use your own expertise as a wall instead of a bridge. "I've studied this, you haven't" becomes how you end a conversation instead of how you start one. What should update instead calcifies, and you start protecting the framework instead of the truth it was built to find.`,
      invitation: `Pick a belief you're certain about. Ask one person who disagrees why, and actually listen to the whole answer before you respond. Not to win. Just to hear it.`,
      health: `Cognitive rigidity tends to concentrate in your spinal column, especially your upper back and neck, where held positions literally show up in your musculature. Watch for tension headaches from the sustained effort of maintaining a complex internal certainty against a world that doesn't always conform to it, plus eye strain from hyperactive cognitive processing. The vagus nerve — your nervous system's flexibility regulator — can go chronically under-stimulated in people whose cognitive style leans heavily analytical and control-oriented.`,
      indicators: [
        `Defending a framework instead of examining new evidence`,
        `Intellectual contempt for other methodologies`,
        `Resistance to any departure from 'the correct approach'`,
        `Certainty so complete it leaves no room for new insight`,
        `Tension headaches from sustained cognitive control`,
        `Frustration collaborating with anyone who sees it differently`,
      ],
      newStrategy: `Let your own framework be dismantled and rebuilt periodically instead of defended indefinitely.`,
      stepsToTake: [
        `Sit with one idea you've already dismissed and find its genuine insight`,
        `Ask what evidence would actually change your mind`,
        `Practice saying 'I don't know yet' out loud once this week`,
        `Invite one person who disagrees with you into a real conversation`,
      ],
    },

    {
      numbers: [8, 13, 5],
      name: 'Displacement / In Someone Else\'s Place',
      category: 'Intellectual & Mindset Alignment',
      title: `Displacement / In Someone Else's Place — 8-13-5`,
      tagline: `A Design of the Uninvited Authority`,
      mastery: `You walk into rooms that weren't built for you and make them yours anyway. You don't need to have grown up somewhere to run it better than the people who did. Your read on a system beats the insiders' most of the time, because you're not blinded by "that's how it's always been."`,
      shadow: `You feel like a guest in your own life — like the seat could be taken back the second someone realizes you don't belong. You keep reshaping yourself to fit wherever you land until you lose track of which version is actually you. Waiting to be found out costs you the authority you've already earned.`,
      invitation: `Say "this is mine" about something you've been quietly treating as borrowed — a role, a title, a relationship. Say it out loud, even just to yourself. Stop waiting for permission you already have.`,
      health: `Displacement often shows up in your joints — specifically hips and knees, which in energetic anatomy govern flexibility and the direction of your path through life. Watch for chronic hip tension, knee instability under professional or relational stress, and lower back pain that correlates with avoiding a decision. Your digestive system can carry the unresolved feeling too, showing up as irritability in environments where feeling out of place is strongest.`,
      indicators: [
        `Persistent sense the current role or life doesn't fit`,
        `Analysis paralysis around a transition that's clearly needed`,
        `Unconsciously competing for a position someone else built`,
        `Sophisticated reasons for staying somewhere wrong`,
        `Chronic hip and knee tension`,
        `Confusing 'what I want' with 'what I'm owed'`,
      ],
      newStrategy: `Name what's already ended as ended, instead of propping it up with considerable endurance.`,
      stepsToTake: [
        `Say out loud, to yourself, one thing that's actually already over`,
        `Set a defined trial period for one new direction instead of requiring full commitment first`,
        `Notice one place you're measuring yourself against someone else's position`,
        `Take one small step toward a life shaped like you, not the role you inherited`,
      ],
    },

    {
      numbers: [9, 16, 7],
      name: 'The Program of Silence',
      category: 'Intellectual & Mindset Alignment',
      title: `The Program of Silence — 9-16-7`,
      tagline: `A Design of the Held Voice`,
      mastery: `You carry real depth most people never develop, because you actually sit with things instead of reacting to them out loud. When you do speak, it lands, because you don't waste words — everything you say has already been thought through completely. That weight is rare, and people feel it the moment you finally talk.`,
      shadow: `You've decided silence is safer, and you're wrong. You let a conversation stay shallow because going deeper once got you hurt, and you never updated the rule after that. You call it privacy. It's actually a wall, and it's costing you the exact recognition you're quietly starving for — because nobody can respond to a voice you never use.`,
      invitation: `Say one true, unpolished thing out loud this week to someone who's earned it. Not the safe version. The real one.`,
      health: `Unexpressed inner life almost always shows up in the throat — the literal architecture of your voice — and often extends into the thyroid, which governs your metabolic regulation and energetic output. Watch for recurring sore throats, voice loss under interpersonal stress, and thyroid irregularities. Your shoulders can hold unexpressed weight too, becoming chronically elevated when you're protecting your throat and chest from the vulnerability of real expression.`,
      indicators: [
        `Everything's fine' said while privately managing real complexity`,
        `Conversations that stay surface-level by habit`,
        `Interior richness that never gets offered`,
        `Old evidence that expression once got punished`,
        `Recurring sore throat or voice loss under stress`,
        `Contribution withheld because the moment felt too exposing`,
      ],
      newStrategy: `Rebuild evidence, gradually, that real expression is survivable and can be met well.`,
      stepsToTake: [
        `Write or record one true thing no one else needs to see yet`,
        `Say one real thing out loud to someone you trust completely`,
        `Notice the specific memory where speaking up went badly, and separate it from now`,
        `Let the radius of sharing expand one person at a time`,
      ],
    },

    // ── 3. ABUNDANCE & FINANCIAL FLOW BLOCKS ───────────────────────────────

    {
      numbers: [4, 21, 17],
      name: 'Focus vs. Distraction',
      category: 'Abundance & Financial Flow',
      title: `Focus vs. Distraction — 4-21-17`,
      tagline: `A Design of the Closed Loop`,
      mastery: `You finish what you start. You don't just launch things, you land them, and you cut loose the obligations that have already served their purpose instead of dragging them along out of guilt. That combination — starting and actually finishing — is rarer than people think.`,
      shadow: `You build elaborate systems and habits around the one thing you're actually avoiding, so it looks like productivity instead of what it is. You either scatter across forty things or lock onto the wrong one with everything you've got, and either way, the thing that matters most doesn't move.`,
      invitation: `Name the one task you've been "getting ready" to start for weeks. Give it twenty-five minutes today. Not planning it. Doing it.`,
      health: `This tends to show up in your nervous system's regulation — specifically in a pattern of overactivation followed by sudden depletion. Watch for adrenal fatigue from sustained multitasking, headaches tied to context-switching, and sleep disruption from a mind that won't release its multiple active threads. Your eyes can be affected too — a particular fatigue that comes not from lack of sleep but from the sustained effort of holding multiple focal points at once.`,
      indicators: [
        `Multiple half-finished projects at once`,
        `Energy crashes right as a project reaches its unglamorous middle`,
        `Expensive pivots that abandon the previous unfinished cycle`,
        `Genuinely too many good ideas to choose from`,
        `Adrenal fatigue and context-switching headaches`,
        `Resources scattering instead of compounding`,
      ],
      newStrategy: `Choose one primary direction and defend it against your own expansive intelligence long enough to finish.`,
      stepsToTake: [
        `Write down every new idea in a holding file instead of chasing it now`,
        `Name the one project future-you would thank you for finishing`,
        `Push through the boring middle phase of one thing this week`,
        `Track how it feels to bring one thing to actual completion`,
      ],
    },

    {
      numbers: [9, 14, 5],
      name: 'The Revenge Pattern',
      category: 'Abundance & Financial Flow',
      title: `The Revenge Pattern — 9-14-5`,
      tagline: `A Design of the Unpaid Debt`,
      mastery: `You can turn an injustice into forward motion instead of retaliation. You see the whole arc a grievance sits inside, not just the sting of the moment — and letting it go doesn't cost you anything, it's actually the win. You're not bound to anyone who hurt you by a debt you're still trying to collect.`,
      shadow: `You keep a ledger you never put down. Somewhere underneath the calm, you're still tracking what someone owes you and rehearsing the moment they finally get it. You call it justice. It's actually a leash, and you're the one holding both ends of it.`,
      invitation: `Pick the one grudge you've been carrying longest. Write down exactly what you're still waiting for from that person. Then ask yourself honestly if you're actually going to get it — and if not, let the waiting stop today.`,
      health: `Held resentment tends to concentrate in the liver — the organ traditionally associated across multiple systems with processing anger and injustice. Watch for recurring inflammatory conditions, skin irritations, and headaches tied to dwelling on the grievance. Your cardiovascular system carries the sustained load too — blood pressure irregularities and heart rate variability that track emotional activation rather than physical exertion are worth watching.`,
      indicators: [
        `A running internal case against someone who wronged you`,
        `Meticulous tracking of their standing or downfall`,
        `Patient effort redirected into grievance instead of building`,
        `Bitterness used as fuel but aimed backward`,
        `Inflammatory or liver-related health patterns`,
        `Hours spent monitoring an old wound`,
      ],
      newStrategy: `Redirect precision and patience toward building something of your own so clearly excellent the comparison stops mattering.`,
      stepsToTake: [
        `Name what you're actually still owed, and whether pursuing it serves you now`,
        `Redirect one hour of monitoring the old grievance into building something new`,
        `Practice the distinction between forgiveness and absolution`,
        `Notice when you're narrating the old case instead of living your current life`,
      ],
    },

    {
      numbers: [15, 19, 5],
      name: 'The Wealth Magnifier',
      category: 'Abundance & Financial Flow',
      title: `The Wealth Magnifier — 15-19-5`,
      tagline: `A Design of Raw Scale`,
      mastery: `You're built for scale most people can't handle — real magnetism, real authority, the kind of presence that makes rooms and resources organize around you without you forcing it. You don't need to manufacture influence. It comes to you, and when you aim it at something real, you can move more than most people will ever touch in a lifetime.`,
      shadow: `Your pull stops creating and starts controlling. People around you can't function without you, and you've quietly arranged it that way — a team that depends on you, a partner who's always the one with more to lose. Your warmth turns into a performance you run for effect. And no matter how much comes in, it's never enough, because what you're actually chasing was never money — it's the feeling of being untouchable.`,
      invitation: `Name, in writing, exactly what your power is actually for beyond your own comfort. Read it before your next big decision.`,
      health: `Under shadow conditions, this tends to concentrate in the cardiovascular system — where ambition and its cortisol load meet the physical demands of sustained high-intensity operation. Watch for blood pressure dysregulation, cardiac arrhythmias under competitive pressure, and inflammation-based conditions. This shadow also frequently expresses through your reproductive and endocrine systems, which govern your body's relationship to power, vitality, and primal energy.`,
      indicators: [
        `Accumulation without a clear purpose beyond comfort or status`,
        `Magnetic pull that creates dependency instead of empowerment`,
        `Performed generosity that's actually strategic`,
        `Cultivating relationships based on influence alone`,
        `Cardiovascular strain under competitive pressure`,
        `A hunger for being ungovernable rather than for money itself`,
      ],
      newStrategy: `Consciously decide what your power and resources are actually for, beyond your own comfort.`,
      stepsToTake: [
        `Write down what your material success is meant to accomplish for others`,
        `Notice one relationship maintained purely for its influence`,
        `Practice warmth that isn't strategic, at least once this week`,
        `Revisit that written purpose regularly, not just once`,
      ],
    },

    // ── 4. RELATIONSHIP & LOVE PROGRAMS ────────────────────────────────────

    {
      numbers: [6, 15, 3],
      name: 'The Love Addict',
      category: 'Relationship & Love',
      title: `The Love Addict — 6-15-3`,
      tagline: `A Design of Total Devotion`,
      mastery: `You love completely, and that's rare. You feel a connection with your whole body, you pour yourself into people without holding back, and when you build something with someone, it's real and generative, not performed. Most people love with one hand on the exit. You don't. That's an actual gift.`,
      shadow: `You need the relationship more than you want it, and you can't tell the difference. A new connection feels like relief, not joy, so you stop checking whether it's actually good for you. You stay in something harmful because familiar pain beats an unfamiliar calm. And you'll make yourself indispensable to someone just to guarantee they don't leave — which isn't love, it's insurance.`,
      invitation: `Next time a connection starts, ask yourself one plain question before going further: does this feel like relief, or does it feel like joy. Answer honestly.`,
      health: `Love addiction tends to concentrate in the heart center and the endocrine system — specifically the dopamine and oxytocin pathways that govern bonding and reward. Love withdrawal is neurologically similar to substance withdrawal: real anxiety, restlessness, sleep disruption, and appetite changes. Your skin — your body's primary contact boundary — can express the longing for merger through chronic conditions sensitive to the quality of your relational environment.`,
      indicators: [
        `New connections feel like relief more than joy`,
        `Lowering standards because the need for relief overrides judgment`,
        `Staying in familiar harm rather than risking unfamiliar health`,
        `Making yourself indispensable rather than genuinely wanted`,
        `Anxiety and restlessness resembling withdrawal between relationships`,
        `Relationship as the frame around your whole identity`,
      ],
      newStrategy: `Build a life genuinely satisfying independent of any one relationship, so intimacy replaces fusion.`,
      stepsToTake: [
        `Notice whether a new connection feels like relief or like joy`,
        `Build one source of satisfaction that has nothing to do with a partner`,
        `Practice tolerating a calm, low-drama connection without needing to escalate it`,
        `Name the difference between wanting fusion and wanting intimacy, out loud`,
      ],
    },

    {
      numbers: [3, 18, 12],
      name: 'Physical Suffering',
      category: 'Health & Vitality',
      title: `Physical Suffering — 3-18-12`,
      tagline: `A Design Built on an Old Wound`,
      mastery: `You know how to survive something hard and keep functioning. You don't fall apart, you carry it, and that resilience is real — most people would have folded under what you've been through. You've turned pain into proof that you can handle anything.`,
      shadow: `You never actually let the wound close, because some part of you doesn't know who you are without it. You lead with the hardship. You keep the story current in rooms that have nothing to do with it. And when things are finally going well, it feels wrong instead of earned — because wellness threatens the only identity you've built in years.`,
      invitation: `Introduce yourself once this week without mentioning what you went through. Just see who you are without the headline.`,
      health: `This program tends to concentrate in the tissue's memory of old injury — chronic tension patterns that outlast the event that caused them, and a nervous system that stays subtly braced around the site of an old wound even once it's physically healed. Watch for a body that seems to need the ache to still make sense of itself. Gentle movement and consistent, ordinary care help more than continued vigilance around the old site.`,
      indicators: [
        `Leading with hardship when introducing yourself`,
        `Discomfort when things are simply going well`,
        `Resisting closure on an old wound that's become load-bearing`,
        `Seeking sympathy more reliably than connection`,
        `Chronic tension around an old, already-healed injury site`,
        `An identity organized around what happened, long after it passed`,
      ],
      newStrategy: `Let a resolved wound actually stay resolved, and find out who you are without the story.`,
      stepsToTake: [
        `Notice one moment you reach for the old story to explain a current feeling`,
        `Introduce yourself once without mentioning the hardship`,
        `Let one good day be simply good, unearned by past difficulty`,
        `Ask what would be true about you if the story ended today`,
      ],
    },

    {
      numbers: [2, 11, 9],
      name: 'The Invisible Partner',
      category: 'Relationship & Love',
      title: `The Invisible Partner — 2-11-9`,
      tagline: `A Design of the Unreturned Gaze`,
      mastery: `You see people with real precision — what they need before they say it, what's true underneath what's performed. You hold space better than almost anyone, and you do it without needing credit. That's genuine emotional skill, not just niceness.`,
      shadow: `You give everyone else your full attention and you've stopped expecting it back. You pick people who take without noticing they're taking, because staying half-hidden feels safer than being fully seen and possibly rejected. You know exactly how one-sided it's gotten, and you never say it out loud — until it comes out sideways, as sudden distance or sudden anger nobody saw coming.`,
      invitation: `Ask one person directly for the kind of attention you're used to only giving. Out loud. Today.`,
      health: `This tends to show up in the kidneys — the organs energetic medicine associates with your deep reserves of vital energy, with fear, and with the exhaustion of sustained giving without enough replenishment. Watch for chronic fatigue disproportionate to physical exertion, lower back pain in the kidney region, and susceptibility to urinary tract issues under relational stress.`,
      indicators: [
        `Always the one giving perceptive attention, rarely receiving it`,
        `Partners engaged with their own world more than yours`,
        `Quiet precision about an imbalance you never say out loud`,
        `Being useful instead of being known`,
        `Chronic fatigue and lower back tension`,
        `Sudden loss of patience after long periods of unacknowledged giving`,
      ],
      newStrategy: `Actively create the conditions for someone else to have real access to your interior, not just your attention.`,
      stepsToTake: [
        `Disclose one real, unpolished piece of your own experience to someone who's earned it`,
        `Notice the belief that full visibility would reveal something insufficient`,
        `Ask directly for the attention you're used to only giving`,
        `Track whether reciprocity actually arrives once the veil drops`,
      ],
    },

    // ── 5. HEALTH & VITALITY PROGRAMS ──────────────────────────────────────

    {
      numbers: [18, 9, 4],
      name: 'The Self-Dissolution Pattern',
      category: 'Health & Vitality',
      title: `The Self-Dissolution Pattern — 18-9-4`,
      tagline: `A Design of the Steady Shore`,
      mastery: `You can sit in someone else's crisis, or your own deep feeling, without drowning in it. Most people either shut the feeling down or get completely swept away by it. You do neither — you stay standing while the wave moves through, which is exactly why people trust you in the hardest moments.`,
      shadow: `You disappear inside whatever you're feeling, or whoever you're caring for, until there's no "you" left in the room. You call it empathy. It's actually erasure. And underneath it, you start believing this is just permanent — "this is how it is" — instead of something that's actually moving through and will pass.`,
      invitation: `Next time you're deep in someone else's hard moment, pause and ask yourself one question: where do I end and this end. Say one true thing about your own state out loud, even if it feels selfish in that moment. It isn't.`,
      health: `The physical signatures here are some of the most varied in the matrix, precisely because your body is functioning as the primary expressive channel. Autoimmune conditions (a precise somatic metaphor for internalized conflict), chronic fatigue, hormonal shifts, skin conditions, and digestive issues are all common. The pattern usually correlates with psychosocial stress rather than simple physical causation — which doesn't mean the symptoms aren't real, just that treating them may need to include that psychosocial layer.`,
      indicators: [
        `Recurring symptoms with no clear physical cause`,
        `Illness as the only acceptable way to rest or set a limit`,
        `Not canceling, not complaining, not resting until forced to`,
        `Symptoms that improve substantially once rest finally happens`,
        `A gap between what you're carrying and what you've actually agreed to`,
        `Using the body as the only reliable message system`,
      ],
      newStrategy: `Build direct channels — chosen rest, spoken limits, expressed needs — so the body doesn't have to carry the message alone.`,
      stepsToTake: [
        `Schedule one non-negotiable rest period this week, before you're forced to`,
        `Say one need out loud instead of accumulating it silently`,
        `Check the actual gap between what you're carrying and what you agreed to`,
        `Notice a symptom and ask what boundary it might be standing in for`,
      ],
    },

    {
      numbers: [16, 7, 14],
      name: 'The Burnout Spiral',
      category: 'Health & Vitality',
      title: `The Burnout Spiral — 16-7-14`,
      tagline: `A Design of Relentless Output`,
      mastery: `You can push through what would stop most people cold — illness, exhaustion, loss — and keep moving forward without missing a beat. That drive is real, and it's rare. You get more done in a hard month than most people manage in a good year.`,
      shadow: `You've gotten so good at ignoring the warning signs that you don't notice them anymore. You keep going until your body makes the decision for you, because stopping voluntarily feels like failure instead of intelligence. Your identity is built entirely on output, so the moment you're not producing, you don't know who you are — and that fear is exactly what keeps driving you into the wall.`,
      invitation: `Cancel or skip one thing this week purely because you're tired. No justification needed. Just do it.`,
      health: `Burnout signatures are some of the most recognizable in the matrix: adrenal exhaustion (a system that ran on cortisol discovering the cortisol is gone), nervous system dysregulation (chronic hyperactivation finally tipping into collapse), thyroid disruption, and immune suppression. The heart is often the biggest concern here — both literally, from accumulated cardiovascular stress, and in the sense of the heart as the center of your relationship to your own worthiness.`,
      indicators: [
        `Working through illness, loss, or exhaustion as identity`,
        `Warning signs that quietly became background noise`,
        `Creativity and resilience going quiet rather than crashing suddenly`,
        `Shame at stopping, read as failure instead of wisdom`,
        `Adrenal exhaustion and cardiovascular strain`,
        `Worth tied entirely to constant output`,
      ],
      newStrategy: `Separate your worth from your output before the body forces the separation through collapse.`,
      stepsToTake: [
        `Name one belief equating rest with wasted time, out loud`,
        `Stop working through one instance of illness or exhaustion this month`,
        `Notice which parts of your identity would still be true if you produced nothing`,
        `Build one recovery practice as non-negotiable as a work commitment`,
      ],
    },

    {
      numbers: [13, 4, 8],
      name: 'The Chronic Resistance',
      category: 'Health & Vitality',
      title: `The Chronic Resistance — 13-4-8`,
      tagline: `A Design of the New Foundation`,
      mastery: `You don't fight change, you build the thing that lets it land safely. You can hold the scariest part of transformation — the part where the old form is gone and the new one isn't solid yet — and actually construct something in that gap instead of panicking through it.`,
      shadow: `The instant real change shows up, you dig in. You use your own strength to defend a structure that's already dead instead of building the one that's supposed to replace it. Change happens to you anyway — just slower, messier, and harder than it needed to be, because you spent your energy holding the door instead of walking through it.`,
      invitation: `Name one thing in your life you're defending purely out of habit, not because it's still working. Take one real step toward letting it go this week — not researching it, not thinking about it. An actual step.`,
      health: `This tends to show up in your musculoskeletal system especially — chronic muscle tension, joint inflammation, and connective tissue issues are the primary physical language. Your immune system is almost always involved too, often expressing as autoimmune activity. Digestive disruption, particularly in the large intestine (your organ of release), is common. Your skin, as your body's containment boundary, can express chronic conditions that mirror holding beyond capacity.`,
      indicators: [
        `Holding on to something past its natural end`,
        `Physical tension that mirrors psychological gripping`,
        `Accidents or injuries arriving exactly when release is most needed`,
        `Change read as collapse rather than possibility`,
        `Immune dysregulation or inflammation`,
        `Endurance redirected into resisting your own life's direction`,
      ],
      newStrategy: `Name exactly what you're holding and ask honestly what would actually be lost by letting it go.`,
      stepsToTake: [
        `Name the specific thing — relationship, role, belief — you're gripping right now`,
        `Ask what would genuinely be lost if you let it ease`,
        `Notice one place your body is holding tension that mirrors a decision you're avoiding`,
        `Let one small, safe thing end deliberately this week`,
      ],
    },

    // ── 6. PURPOSE & MISSION PROGRAMS ──────────────────────────────────────

    {
      numbers: [1, 10, 19],
      name: 'The Trailblazer',
      category: 'Purpose & Mission',
      title: `The Trailblazer — 1-10-19`,
      tagline: `A Design of the First Move`,
      mastery: `You go first. Nobody has to validate the direction before you move in it — you generate it from nothing, you read timing like a second language, and people follow you because your confidence is obviously real, not performed. Most people wait for a map. You draw one just by walking.`,
      shadow: `You're addicted to starting and allergic to staying. The moment a project gets unglamorous — the maintenance, the slow middle — you call it "the timing shifting" and you're gone, chasing the next beginning instead of finishing the one you're in. Nothing you build ever compounds, because you've never once stayed long enough to let it.`,
      invitation: `Pick one thing you'd normally abandon right now. Stay one more week past the point you'd usually leave.`,
      health: `The pioneer program tends to show up in the nervous system, especially in how the sympathetic activation that drives real innovation interacts with your body's need for recovery. Watch for chronic low-grade hyperarousal, difficulty with real rest (your mind keeps generating even when your body is technically still), and immune vulnerability in the post-peak phases of major creative or professional cycles. The heart — both as your physical pump and as the energetic center of your relationship to your own radiance — can be subject to arrhythmia and irregular load under the high-variability demands of a pioneering life.`,
      indicators: [
        `Addicted to the moment of beginning, not sustaining`,
        `Underinvesting in documentation or handoff`,
        `Leaving projects right as they reach the difficult middle`,
        `Using 'timing shifted' as an exit from real commitment`,
        `Chronic low-grade hyperarousal and poor rest`,
        `Ventures that never quite compound`,
      ],
      newStrategy: `Stay long enough past the exciting start to document the path so others — and the venture — can actually continue.`,
      stepsToTake: [
        `Write down the implicit map of your current project so someone else could follow it`,
        `Stay one week longer than your instinct says to leave`,
        `Notice if 'the timing shifted' is genuine or a convenient exit`,
        `Pick one unglamorous middle-phase task and actually finish it`,
      ],
    },

    {
      numbers: [20, 11, 2],
      name: 'The Awakening Teacher',
      category: 'Purpose & Mission',
      title: `The Awakening Teacher — 20-11-2`,
      tagline: `A Design of Lived Knowledge`,
      mastery: `You see people with total clarity — their actual state, their actual potential, the exact gap between the two — and that perception changes whoever's on the receiving end of it. You don't teach from a book. You teach from what you've actually survived, which is why it lands.`,
      shadow: `You're hardest on the exact flaw in other people that you haven't fixed in yourself. Your standards go rigid where they should stay human, and compassion gets crowded out by precision. You perform having it figured out instead of admitting you're still in it — and that performance is the one thing standing between you and the people you're actually trying to reach.`,
      invitation: `Tell one person you're teaching or leading that you're still working through the exact thing you're helping them with. Say it plainly.`,
      health: `This tends to involve the nervous system and the perceptual organs — especially the eyes, which in energetic anatomy are the instruments of clear seeing, and which can carry strain and sensitivity in people whose perceptual gifts run at high load. The throat and chest are significant too: the summons asks for voice, and the period before you fully integrate that voice can produce physical symptoms in the territory between the heart, where the knowing lives, and the throat, where it has to exit to become teaching.`,
      indicators: [
        `Teaching material not yet fully resolved in yourself`,
        `High standards for others calibrated to your own unresolved gap`,
        `Impatience with a student's pattern you haven't solved in yourself`,
        `Rigid moral standards that crowd out compassion`,
        `Eye strain and throat/chest tension`,
        `Pulling back from full presence when perception gets uncomfortable`,
      ],
      newStrategy: `Teach honestly from exactly where you are now, not from a fully resolved version of yourself.`,
      stepsToTake: [
        `Name one thing you teach that you're still personally working through`,
        `Notice the next time a student's pattern irritates you and check it against your own`,
        `Practice saying 'I'm still living this too' instead of performing resolution`,
        `Offer full presence once without needing to have all the answers`,
      ],
    },

    {
      numbers: [21, 12, 3],
      name: 'The Artist\'s Sacrifice',
      category: 'Purpose & Mission',
      title: `The Artist's Sacrifice — 21-12-3`,
      tagline: `A Design of the Withheld Work`,
      mastery: `You have real mastery in you — actual creative depth, not a hobby, an entire language you were built to speak. When you do share your work, it carries weight, because it comes from a well that's genuinely full, not from someone faking confidence they don't have.`,
      shadow: `You're always almost ready, and you've been almost ready for years. You call it standards. It's actually fear wearing a costume — you'd rather stay unseen and theoretical than risk being seen and ordinary. Your best work sits in a drawer while you wait for a feeling of "ready" that was never going to arrive on its own.`,
      invitation: `Share one unfinished piece of work this week, exactly as it is. Don't polish it first.`,
      health: `Blocked creative flow tends to concentrate in the sacral center — the lower abdomen and reproductive system, which in energetic anatomy govern creative and generative impulse. Watch for irregular cycles (in every sense), digestive sensitivity, and lower abdominal tension during periods of maximum creative suppression. Your hands — the instruments of making — can develop chronic tension, repetitive strain, and sensitivity that expresses the frustrated desire to create something that hasn't yet found its release.`,
      indicators: [
        `Work that's always almost ready to share`,
        `Waiting for a readiness that keeps receding as you approach it`,
        `Prolific private production that rarely gets released`,
        `'I won't share it until it's ready' as a shield against exposure`,
        `Sacral tension or creative-block-related physical symptoms`,
        `A whole inner world the outside hasn't been invited into`,
      ],
      newStrategy: `Release the work before it feels ready, since the feeling of readiness was never really about the work.`,
      stepsToTake: [
        `Share the smallest possible piece of work this week, unfinished`,
        `Notice the exact psychological threshold you're waiting to cross`,
        `Ask what 'ready' has actually meant for you versus what the work needs`,
        `Let one piece be met by an audience without further polishing`,
      ],
    },

  ]; // end programs


  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * find(a, b, c) — returns the program matching all three numbers
   * in any order, or undefined if none exists.
   */
  function find(a, b, c) {
    const query = [a, b, c];
    return programs.find(p =>
      query.every(n => p.numbers.includes(n)) &&
      p.numbers.every(n => query.includes(n))
    );
  }

  /** findByCategory(cat) — returns all programs in a category. */
  function findByCategory(cat) {
    return programs.filter(p => p.category === cat);
  }

  /** all() — returns the full array (read-only copy). */
  function all() { return programs.slice(); }

  return { find, findByCategory, all };

})();
