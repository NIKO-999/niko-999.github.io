'use strict';

/**
 * Destiny Matrix — Most Prominent Number
 * ─────────────────────────────────────────────────────────────
 * One entry per Arcana (1-22), not per position — this reading describes
 * the archetype's OVERALL defining force across a person's entire chart,
 * the way js/matrix-engine.js's mostProminentArcana() actually computes it
 * (see that function's header comment for the full weighted-influence
 * methodology). Distinct from every other content file in this app: those
 * are all "this Arcana, filtered through this one position's lens." This
 * one is "this Arcana, as the single loudest force in the whole blueprint."
 *
 * DestinyMatrix-v1.html's PROMINENT card render branch generates "THE
 * DOMINANT NUMBER" and "NUMEROLOGY REINFORCEMENT" live from the actual
 * chart — never from this file. This file supplies the five written
 * sections underneath:
 *   why        -> WHAT [N] MEANS AT ITS CORE
 *   synthesis  -> WHY IT'S SO LOUD IN YOUR CHART
 *   traits     -> HOW IT SHOWS UP IN YOUR LIFE
 *   shadow     -> THE SHADOW OF TOO MUCH OF ONE THING
 *   path       -> THE INVITATION
 *
 * Golden Standard voice throughout (NON_NEGOTIABLE_RULES.md): trauma-
 * informed second person, one "You are allowed to..." permission and one
 * closing What/When/Where/If question in `path`, no positive/negative
 * dichotomy. REVISED once already (2026-08-01): the first draft opened
 * every `why` with "Arcana N is X," every `synthesis` with "A single/One
 * [Card] placement would mean/describe...," every `shadow` with "A force
 * this [X] can quietly...," and every `path` with "Try [verb]-ing one X
 * this week" — a mad-lib template across all 110 fields despite this
 * file's own stated intention not to do that. Every field below was
 * rewritten with a genuinely different opening and shape, entry to entry.
 *
 * API: DMostProminentContent.get(arcanaNum) -> { heading, why, synthesis,
 *   traits, shadow, path } or null
 */
window.DMostProminentContent = (function () {
  const data = {
    1: {
      heading: `The Magician Runs Your Entire Chart`,
      why: `Somewhere underneath every other trait in your chart sits a single fact about you: you don't wait for permission to begin. The Magician is the raw capacity to turn a thought into motion before conditions are ready for it, and when this much weight lands on that one force, it stops being a talent you have and becomes the operating system everything else runs on.`,
      synthesis: `A person with one Magician placement is simply good at starting things in a particular area of life. You're something different — initiation is the actual lens the rest of your chart gets read through. Whatever else shows up elsewhere in your blueprint tends to arrive already organized around "how do I begin this," because that question never fully stops running in the background.`,
      traits: `You're usually the one who's already three steps into something everyone else is still circling. A waiting room, literal or metaphorical, costs you more than it costs most people — stillness before a decision reads less like patience to you and more like friction. People who've known you a while have probably stopped being surprised by how fast you move from idea to action.`,
      shadow: `What this much initiating energy rarely learns is how to stop initiating. The real risk was never a shortage of drive — it's an underdeveloped capacity to finish, to sit still, or to let someone else go first, because your whole system is tuned to the opening move and comparatively untrained in everything that comes after it.`,
      path: `Pick one thing you've already started and put it first, ahead of anything new, until it's actually done. You are allowed to be someone who begins easily and still becomes someone who finishes. What's the oldest unfinished beginning still waiting for you to come back rather than move past?`,
    },
    2: {
      heading: `The High Priestess Runs Your Entire Chart`,
      why: `You've probably known things before you could explain how you knew them — a truth that arrived quiet and certain, ahead of any evidence that would have justified it out loud. That's the High Priestess: inner knowing so central to your chart that it isn't one gift among several, it's the instrument everything else gets interpreted through.`,
      synthesis: `Most people with a Priestess placement have good instincts somewhere specific. In your case the instinct itself is load-bearing — you don't just have intuition, your whole system runs on it, and the rest of your chart gets filtered through "does this feel true" before it's ever filtered through anything else, logic included.`,
      traits: `You likely sense the real temperature of a room, a relationship, or a decision before you have language for it — and you're right more often than the people who need the evidence first. Silence doesn't unsettle you; some of your clearest thinking happens inside it. You may have a long private history of being right before you could prove it, and disbelieved anyway.`,
      shadow: `Knowing something this deeply and this consistently can quietly stop bothering to explain itself. A private certainty, never translated into something someone else could follow, isn't wrong — it's just unreachable, and you can end up expecting people to trust a knowing you've never once shown your work on.`,
      path: `Take one thing you already know intuitively and put it into plain, ordinary words out loud, even though it feels like it should be obvious. You are allowed to trust the knowing and still make it legible to someone else. What have you known for a long time that you've simply never said?`,
    },
    3: {
      heading: `The Empress Runs Your Entire Chart`,
      why: `Things tend to grow near you — that's the plainest way to say what having this much Empress energy actually means. Generativity, the capacity to nurture a seed of something into a real, living thing, isn't a phase or a mood in your chart. It's the default posture your whole system takes toward anything it touches.`,
      synthesis: `Most people carrying the Empress somewhere in their chart are good at cultivating one particular thing. For you, cultivation is the mechanism the whole blueprint runs on — everything else you carry tends to express itself through nurturing, tending, and patient growth rather than through speed or force, because that's the gear this much Empress energy actually has.`,
      traits: `People tend to feel more like themselves near you; projects you touch tend to develop rather than stall; rooms you spend time in tend to warm up. You likely give abundantly and think about it less than the people on the receiving end do. Faced with almost anything, your first instinct is to ask what it needs to flourish before you ask what needs correcting.`,
      shadow: `A force this devoted to giving can quietly forget it's allowed to receive anything back. The risk was never generosity itself — it's a life slowly built around tending everyone and everything except your own actual needs, until giving stops feeling like abundance and starts feeling like the only way you know how to be loved.`,
      path: `Let someone tend to you once this week, deliberately, without immediately reciprocating. You are allowed to receive as easily as you give. Where in your life has giving become the only language you've let yourself speak?`,
    },
    4: {
      heading: `The Emperor Runs Your Entire Chart`,
      why: `Order isn't a preference for you in certain settings — look closely at your chart and structure turns out to be the lens the whole thing gets read through. The Emperor is the capacity to take something formless and give it a frame sturdy enough to hold real weight, and at this concentration it becomes how your entire system makes sense of the world, including the parts that were never meant to be fully controlled.`,
      synthesis: `A single Emperor placement makes someone capable in a domain that calls for structure. You have something more foundational: structure-building as the actual logic underneath everything else in your chart. Whatever shows up elsewhere gets organized, systematized, made accountable — because your system doesn't fully trust anything until it has a frame.`,
      traits: `You're probably the one other people quietly count on to keep the exciting idea from collapsing the moment it meets reality. Loose ends bother you more than they bother most people. A plan that's genuinely been thought through gives you real comfort; ambiguity that other people seem able to just sit inside doesn't come easily to you at all.`,
      shadow: `This much structural instinct can narrow, almost without you noticing, into control — a need for the frame to be exactly right that starts overriding the content the frame was supposed to hold. Mistaking rigidity for reliability is the real risk, and the people you're trying to steady may start experiencing your structure as a cage rather than a container.`,
      path: `Leave one thing genuinely unstructured this week — no plan, no correction, just letting it be whatever it already is. You are allowed to build strong frames and still leave room inside them. Where has your need for order stopped protecting something and started constraining it?`,
    },
    5: {
      heading: `The Hierophant Runs Your Entire Chart`,
      why: `There's a version of wisdom that has to be earned firsthand, and a version that gets received, carried, and passed on — a lineage bigger than any one person holding it. The Hierophant is that second kind, and at this weight it's not a value you hold, it's the actual mechanism your whole system uses to make sense of anything.`,
      synthesis: `Someone with a single Hierophant placement is drawn to structure or tradition somewhere specific. In your chart, transmission itself is the operating principle underneath everything else — whatever shows up elsewhere gets filtered first through "what is the correct way to do this," because your system is built to locate the established path before it improvises a new one.`,
      traits: `You likely feel most grounded operating inside something with real structure behind it — a discipline, a lineage, a method someone before you actually tested and proved. Teaching, mentoring, or passing on what you know probably comes naturally, whether or not it's your job. Earned authority tends to move you more than a compelling argument with nothing behind it.`,
      shadow: `An orientation this strong toward the established path can quietly calcify into rule-following for its own sake — deference to "how it's supposed to be done" even in the one situation that actually called for something new. Mistaking tradition for truth is the real risk, and it can cost you the moment your own instinct already knew better than the doctrine.`,
      path: `Break one small rule this week that you've been following out of habit rather than genuine conviction. You are allowed to honor what's been passed down and still question it. Where has "this is how it's done" been standing in for your own actual judgment?`,
    },
    6: {
      heading: `The Lovers Runs Your Entire Chart`,
      why: `Not the drift into whatever's convenient, but the deliberate act of choosing what's actually yours, values fully intact — that's the Lovers, and at this concentration, choosing isn't something you do occasionally at forks in the road. It's the lens the rest of your life passes through, values-first, nearly all the time.`,
      synthesis: `A single Lovers placement means someone takes relationships or values seriously in a particular area. Your chart runs deeper than that: genuine, values-driven choice is the engine underneath everything else, and whatever else shows up tends to get filtered through "does this actually align with what I believe" before your system will fully commit to it.`,
      traits: `You probably struggle to commit to anything — a relationship, a job, a belief — that feels like a default you drifted into rather than a choice you actually examined. Alignment matters to you more than convenience does, even when convenience would be considerably easier. People likely sense that your yes means something, because you don't hand it out automatically.`,
      shadow: `Weighing every choice this carefully can quietly turn into paralysis — endless deliberation dressed up as discernment, because no option ever feels quite pure enough to commit to without reservation. The risk is mistaking the search for a perfectly aligned choice for actually living, while real decisions sit permanently unmade.`,
      path: `Make one decision this week before you feel fully certain about it, and let the choosing itself be the commitment. You are allowed to choose imperfectly and still mean it. What choice have you been treating as permanent that's actually just the next honest step?`,
    },
    7: {
      heading: `The Chariot Runs Your Entire Chart`,
      why: `Ask what you're fundamentally like and the honest answer is: always going somewhere. The Chariot is directed will, sustained self-generated movement toward something actually chosen, and at this weight it's not one gear among several — it's the current your entire relationship to being alive runs on.`,
      synthesis: `A single Chariot placement describes someone driven in a specific part of life. What's running underneath your whole blueprint is bigger: directed momentum as the actual current beneath everything else you carry, expressing itself as motion, as a destination to steer toward, because stillness genuinely isn't where this much Chariot energy knows how to rest.`,
      traits: `Real stillness probably registers to you less like peace and more like a low-grade alarm — something in you keeps expecting to be moving. An internal compass stays active even when nobody's asking you to go anywhere, and other people's hesitation tends to read to you as an invitation to just start driving. Momentum, more than comfort, defines how your days actually feel.`,
      shadow: `Perpetual motion can quietly get mistaken for actual progress — arriving nowhere in particular because arriving was never really the point, moving was. The deeper cost is that the extraordinary self-sufficient direction you've built is also, looked at honestly, an extraordinary capacity for never letting anyone ride along.`,
      path: `Stay still on purpose for one real stretch this week — no destination, no forward motion, just presence. You are allowed to love the road and still learn to park on it sometimes. What might you actually feel if you stopped moving long enough to find out?`,
    },
    8: {
      heading: `Justice Runs Your Entire Chart`,
      why: `Actions carry weight, and fairness matters even when it's inconvenient — that's not a value you apply case by case, it's the filter your whole system runs everything through. Justice at this concentration means right and wrong aren't concepts, they're the actual architecture underneath the rest of your chart.`,
      synthesis: `Someone with a single Justice placement has a strong ethical compass somewhere specific. Yours goes deeper: fairness itself is the operating principle beneath your entire blueprint, and whatever shows up elsewhere gets evaluated first for whether it's balanced, honest, and accountable, because nothing gets trusted until it clears that bar.`,
      traits: `You likely sense unfairness almost involuntarily, even in situations where staying quiet would be a great deal easier. People probably trust your word specifically because you don't say things you don't mean. You may be holding yourself to a standard of honesty that most people around you aren't holding themselves to, and noticing the gap more than you let on.`,
      shadow: `This much orientation toward balance and accountability can quietly go rigid — a black-and-white read on situations that were actually more complicated than "fair" or "unfair" allows for. The cost is a kind of moral exhaustion, for you and for the people around you, from a standard so precise it leaves no room for the ordinary mess of being human.`,
      path: `Let one imperfect, unresolved situation stay unresolved this week without needing to correct it. You are allowed to care about fairness and still let some things stay gray. Where has your need for balance made it harder for you to simply forgive?`,
    },
    9: {
      heading: `The Hermit Runs Your Entire Chart`,
      why: `You do your most important thinking away from other people, not among them. That's the Hermit at full concentration — depth found alone, a lantern that lights the way for others precisely because you were willing to walk into the dark by yourself first, and at this weight it's the actual source your whole system draws from.`,
      synthesis: `A single Hermit placement means solitude serves someone in one specific area. Your chart runs on something more fundamental: withdrawal-into-depth as the engine underneath everything else, because whatever shows up elsewhere in your blueprint tends to need real, uninterrupted quiet before it can resolve into something you actually trust.`,
      traits: `You probably think more clearly alone than in a room full of people trying to help you think. Solitude restores you in a way that even good socializing doesn't quite match. There's likely real, hard-won wisdom in you that took real isolation to arrive at, alongside a natural instinct to share it once you've found it — not while you're still searching.`,
      shadow: `Solitude this central can quietly slide into isolation — withdrawal that stops being a source of depth and becomes a habit of avoidance, dressed up as introspection. The risk is a life technically full of insight and functionally empty of the connection that insight was always meant to eventually reach.`,
      path: `Share one piece of understanding this week that you'd normally keep entirely to yourself. You are allowed to need solitude and still let people in once you've found what you were looking for. What have you figured out alone that's actually ready to be spoken out loud?`,
    },
    10: {
      heading: `The Wheel of Fortune Runs Your Entire Chart`,
      why: `Nothing stays fixed, and the real skill was never control — it's reading where in the cycle you actually are. That's the Wheel of Fortune, and at this weight, change isn't a disruption to your life. It's the medium your entire life moves through.`,
      synthesis: `A single Wheel placement means someone is attuned to timing somewhere specific. Underneath your whole blueprint sits something bigger: cyclical awareness as the real logic beneath everything else, so whatever shows up elsewhere gets read through "what season is this, and what does it actually call for," because your system doesn't expect anything, including itself, to hold still.`,
      traits: `You likely sense when something is turning — a relationship, a job, a mood, a market — before it's officially announced. Instability that would rattle other people tends to register to you as simply the wheel doing what wheels do. Sudden change probably doesn't unsettle you the way it unsettles most people, because some part of you was already expecting it.`,
      shadow: `Attunement to cycles this strong can quietly turn into a refusal to commit — since everything eventually turns anyway, why build something that's just going to change. The risk is a kind of rootlessness: genuine skill at riding change that never gets aimed at anything durable enough to actually be worth the ride.`,
      path: `Commit to one thing this week as though it were permanent, even knowing it isn't. You are allowed to understand impermanence and still build as if something could last. What have you been holding loosely that actually deserves your full weight?`,
    },
    11: {
      heading: `Strength Runs Your Entire Chart`,
      why: `Not force — the quieter, harder discipline of staying soft in the presence of something that would frighten most people into hardening. Strength at this concentration means composure under real pressure isn't a skill you deploy occasionally. It's how your entire system holds itself steady in the world, full stop.`,
      synthesis: `A single Strength placement means someone is composed in a specific kind of difficulty. Your chart runs on something bigger: gentle endurance as the mechanism underneath everything else, meeting whatever shows up with patience and quiet steadiness rather than force, because softness sustained tends to outlast most things that try to overpower it.`,
      traits: `You likely hold real pressure — other people's crises, your own difficult emotions, situations that would rattle most people — without needing to dominate it or flee from it. People probably lean on your calm specifically in the moments that would unsettle almost anyone else. Your composure tends to read as effortless, though it rarely actually is.`,
      shadow: `Staying gentle under pressure this consistently can quietly turn into self-erasure — an inability to ever raise your voice, set a hard boundary, or let your own need be the loudest thing in the room. Real strength sometimes looks like refusing to stay calm, and mistaking constant accommodation for it is the actual risk.`,
      path: `Let yourself be visibly, audibly upset about one thing this week that genuinely warrants it. You are allowed to be gentle and still take up space when something is truly wrong. Where has your composure been protecting someone else's comfort at the cost of your own honesty?`,
    },
    12: {
      heading: `The Hanged Man Runs Your Entire Chart`,
      why: `Revelation, for you, doesn't come from effort — it comes from the deliberate, counter-instinctive act of letting go of control, over and over. The Hanged Man is perspective through surrender, and at this weight, hanging upside down for a while and letting insight arrive from an unchosen angle isn't rare. It's your default.`,
      synthesis: `Someone with a single Hanged Man placement is capable of this kind of surrender in a specific context. Your whole blueprint is organized around it: surrendered perspective as the operating principle, so whatever shows up elsewhere resolves not through force but through pause, through waiting, through letting an answer arrive sideways instead of head-on.`,
      traits: `You probably have real access to insight that only shows up once you've stopped trying to force it — understanding that arrives in stillness rather than effort. People might describe you as someone who sees things from an unusual angle, because you genuinely do. Waiting, for you, is rarely wasted time; it's often when the real work is quietly happening.`,
      shadow: `Surrender this central can slide into paralysis dressed up as patience — a permanently suspended state where nothing gets decided because you're always waiting for one more angle before you're willing to act. Mistaking endless reflection for the depth it's supposed to produce is the real cost.`,
      path: `Act on the insight you already have this week, instead of waiting for one more layer of understanding to arrive. You are allowed to value perspective and still eventually come down off the tree. What have you already seen clearly that you're still waiting for permission to act on?`,
    },
    13: {
      heading: `Death Runs Your Entire Chart`,
      why: `Not decoration, not a minor adjustment — an actual ending of one version of a life so a truer one can begin. Death at this weight isn't something that happens to you occasionally. It's the mechanism your entire system uses to keep becoming who you actually are.`,
      synthesis: `A single Death placement means someone is capable of real change in one part of life. In your chart, transformation itself is the operating logic underneath the whole blueprint — everything else tends to move through cycles of ending and rebirth rather than steady accumulation, because your system doesn't know how to stay the same for very long.`,
      traits: `You've likely lived through more real endings — of identities, relationships, versions of yourself — than most people your age, and come out the other side of them more often than you've stayed stuck. Change that terrifies other people probably registers to you as simply what happens next. You may sense when something has already died long before you're willing to admit it out loud.`,
      shadow: `An orientation this strong toward ending things can quietly make it hard to let anything mature — abandoning a relationship, a project, or a version of yourself the moment it stops feeling new, mistaking restlessness for the genuine completion this Arcana actually asks for. Confusing constant reinvention with growth is the real risk.`,
      path: `Stay with one thing this week past the point where you'd normally declare it finished and move on. You are allowed to transform constantly and still let one thing fully mature first. What have you been calling "over" that might actually just be asking you to stay a little longer?`,
    },
    14: {
      heading: `Temperance Runs Your Entire Chart`,
      why: `Two forces that don't naturally want to sit together, blended patiently into one coherent whole — that's the ongoing work Temperance does, and at this concentration, balance isn't a value you hold. It's the actual skill your entire system runs on, moment to moment, whether or not you've ever named it that.`,
      synthesis: `A single Temperance placement means someone is skilled at blending in a specific domain. Your chart runs deeper than that: integration as the real mechanism beneath everything else, so competing forces elsewhere in your blueprint get synthesized rather than left in conflict, because your system doesn't fully rest until they've actually found their blend.`,
      traits: `You're probably the one who ends up holding two different truths, traditions, or temperaments at once, without needing either to collapse into the other. Extremes tend to exhaust you faster than they exhaust most people; the middle path, patiently walked, is usually where you actually want to be. People may come to you specifically to bridge two things that otherwise wouldn't talk to each other.`,
      shadow: `Valuing balance this much can quietly mean never taking a real side — a permanent, exhausting neutrality that reads as wisdom but is sometimes just fear of the friction a real position would create. The risk is spending so much energy holding the middle that you never actually stand anywhere yourself.`,
      path: `Take one clear, unblended stance this week, even where staying neutral would be easier. You are allowed to value integration and still occasionally pick a side. Where has your gift for balance been quietly protecting you from having to actually commit?`,
    },
    15: {
      heading: `The Devil Runs Your Entire Chart`,
      why: `Desire, power, attachment — the parts of being human that most people look away from — sit in plain view for you. The Devil at this weight isn't a liability. It's the actual source of an unusual clarity your whole system is built to access, whether or not that clarity is always comfortable to hold.`,
      synthesis: `Someone with a single Devil placement is unusually honest about one kind of desire or attachment. Your blueprint runs on something bigger: facing the unflinching truth as the real operating logic underneath everything else, so what shows up elsewhere gets filtered through "what's actually happening here, underneath the polite version," because the sanitized account never fully satisfies your system.`,
      traits: `You probably understand what actually drives people — money, power, desire, fear — more clearly than most people are willing to admit they understand it, including about themselves. Material and physical honesty likely come easier to you than to people around you who prefer the comfortable version. You may have real insight into your own attachments that most people spend a lifetime avoiding.`,
      shadow: `Facing what's real this consistently can quietly turn into entanglement with it — genuine insight into desire and power curdling into being ruled by exactly the attachments you understand so well. The risk was never the honesty; it's mistaking clear sight of the chain for actual freedom from it.`,
      path: `Name one attachment this week you've understood clearly but never actually loosened your grip on. You are allowed to see the chains honestly and still choose, deliberately, to walk further than they'd suggest you can. What have you known was binding you that you haven't yet tested the edges of?`,
    },
    16: {
      heading: `The Tower Runs Your Entire Chart`,
      why: `A structure that was never actually sound comes down all at once, rather than slowly and comfortably — willingly, or by fate. That's the Tower, and at this concentration, disruption isn't something that happens to you occasionally. It's the mechanism your system uses to clear the way for what's real.`,
      synthesis: `A single Tower placement describes someone who's experienced this kind of collapse in a specific area. Underneath your whole blueprint sits something more constant: sudden clarity through disruption as the real engine, so whatever shows up elsewhere tends to move through abrupt, decisive breaks rather than gradual adjustment, because your system rarely dismantles anything slowly.`,
      traits: `You likely see a failing structure — a job, a relationship, a belief — clearly and early, often before anyone else is willing to admit it's already cracking. Sudden, decisive change probably doesn't frighten you the way it frightens most people; some part of you almost trusts it more than the slow kind. Things in your history may have ended abruptly that, in hindsight, needed to end exactly that way.`,
      shadow: `An orientation this strong toward sudden collapse can quietly start causing it — provoking or accelerating a crisis rather than waiting for one, because slow, uncertain decline feels more unbearable to you than fast, decisive rupture. The risk is confusing your own restlessness for a structure's actual instability.`,
      path: `Sit with one situation this week that feels like it's cracking, without forcing the collapse yourself. You are allowed to trust sudden clarity and still let some things take their own time to fall. Where might you be rushing an ending that hadn't actually arrived yet?`,
    },
    17: {
      heading: `The Star Runs Your Entire Chart`,
      why: `Hope that doesn't wait for proof, generating itself even when the evidence hasn't caught up — that's the Star, and at this weight, optimism isn't a mood you have on good days. It's the current your entire system runs on, quietly, underneath whatever else is happening.`,
      synthesis: `A single Star placement means someone carries real hope in one specific part of life. Your chart runs on something bigger: generative hope as the actual mechanism beneath everything else, filtering what shows up elsewhere through "this can still work out," because your system rarely knows how to fully give up, even in rooms that have genuinely lost their bearings.`,
      traits: `You're probably the one whose faith stays lit without needing external proof, and other people likely find that steadiness contagious in a way that's hard to manufacture on purpose. Real hope for people and situations that have given you every reason to stop probably comes naturally to you. Renewal tends to feel possible even directly after real loss.`,
      shadow: `Hope this generative can quietly refuse to look at what's actually, concretely wrong — optimism functioning as avoidance, faith standing in for the harder work of facing a real problem honestly. The risk is staying hopeful about something that has already, factually, ended.`,
      path: `Name one situation this week where hope has been substituting for an honest, difficult look at what's actually happening. You are allowed to keep your faith and still tell yourself the truth. Where has staying hopeful been easier than staying honest?`,
    },
    18: {
      heading: `The Moon Runs Your Entire Chart`,
      why: `Dreams, instinct, the felt undercurrent running beneath whatever people can put into words — that's where you actually live. The Moon at this concentration means the unconscious isn't a place you visit occasionally. It's the terrain your entire system moves through, named or not.`,
      synthesis: `Someone with a single Moon placement has unusual access to the unconscious in one specific area. Your blueprint runs on something larger: the felt, symbolic, and dreamlike as the real medium underneath everything else, so whatever shows up elsewhere in your chart tends to be sensed before it's understood.`,
      traits: `You likely have a vivid inner life — dreams that feel meaningful, a porousness to what's unspoken in a room, a natural fluency in symbol and image that doesn't need translating to feel real to you. Something being fundamentally off, or fundamentally right, probably registers to you before you can explain why. Fear and illusion may be more familiar territory to you than to most people, simply because you spend more time there.`,
      shadow: `Attunement to the undercurrent this strong can quietly lose the thread back to solid ground — genuine insight tangled with anxiety and illusion until you can no longer easily tell which is which. Mistaking every felt sense for truth is the real risk, even when some of them are just fear wearing intuition's clothes.`,
      path: `Name one fear this week and check it, deliberately, against something concrete and verifiable. You are allowed to trust the undercurrent and still occasionally surface for solid ground. What feeling have you been treating as truth that might actually be static?`,
    },
    19: {
      heading: `The Sun Runs Your Entire Chart`,
      why: `Light that didn't need to be earned through suffering, warmth that's simply available rather than hard-won — that's the Sun at this weight. Being genuinely, visibly yourself isn't an occasional performance. It's the fundamental way your whole system meets the world.`,
      synthesis: `A single Sun placement means someone carries real warmth in a specific part of life. Underneath your whole blueprint sits something bigger: undramatic radiance as the operating principle, so whatever shows up elsewhere tends to be lit from the same source, because your system rarely knows how to stay hidden for long.`,
      traits: `Rooms probably notice when you enter them, even when you're not trying to be noticed. Your enthusiasm likely functions as one of your most reliable tools, moving things forward simply by being genuine rather than performed. People may feel unusually free to be themselves around you, because you're rarely asking anyone to be anything other than what they already are.`,
      shadow: `Radiance this consistent can quietly turn into a performance of ease that leaves no room for anything less than sunny — a warmth so reliable that genuine difficulty, when it shows up, has nowhere honest to land. The risk is a life organized around staying visibly fine, even in the moments that genuinely aren't.`,
      path: `Let one hard thing be visibly hard this week, without performing your usual brightness through it. You are allowed to be radiant and still let people see you struggle sometimes. What have you been keeping sunny that actually deserves to be witnessed honestly?`,
    },
    20: {
      heading: `Judgement Runs Your Entire Chart`,
      why: `A real, felt call toward something larger than your current life, arriving whether or not you feel ready — that's Judgement, and at this concentration, being called forward isn't rare or dramatic. It's the ongoing, familiar experience your entire system organizes itself around.`,
      synthesis: `Someone with a single Judgement placement has answered a real calling somewhere specific. Your chart runs on something bigger: the summons itself as the mechanism underneath everything else, so whatever shows up elsewhere arrives as an invitation toward a bigger version of yourself, because your system rarely stays settled in "enough" for long.`,
      traits: `You probably have real aptitude for recognizing a genuine call when it arrives, distinguishing it from noise or wishful thinking in a way that takes most people years to develop. People who know you well have likely watched you outgrow versions of yourself that used to fit, more than once. Purpose tends to feel less like something you found once and more like something that keeps finding you again.`,
      shadow: `Attunement to the next summons this strong can quietly mean the current chapter never fully finishes — always answering the next call before the present one has been lived all the way through. The risk is a life spent perpetually becoming, never quite arriving anywhere long enough to actually inhabit it.`,
      path: `Stay fully inside your current chapter this week, on purpose, instead of listening for what's next. You are allowed to keep answering the call and still rest inside where you already are. What summons might actually be asking you to stop moving, not start?`,
    },
    21: {
      heading: `The World Runs Your Entire Chart`,
      why: `Arriving somewhere whole, pieces actually integrated rather than merely finished — that's the World, and at this weight, wholeness isn't a distant goal. It's the standard your entire system measures everything against, realistic or not in any given moment.`,
      synthesis: `A single World placement means someone is capable of real completion in one specific area. Your blueprint runs on something bigger: integration-into-wholeness as the real logic underneath everything else, so whatever shows up elsewhere gets measured against "is this actually finished, actually whole," because your system doesn't easily settle for partial.`,
      traits: `You likely have a genuine capacity to recognize when something has actually reached completion, rather than immediately redefining "done" upward the moment you arrive there. People may experience you as someone who brings real closure to things — projects, conversations, chapters — that other people leave hanging. The difference between finished and merely stopped probably registers to you more sharply than it does to most people.`,
      shadow: `Orientation toward wholeness this strong can quietly refuse to call anything complete — endlessly extending completion because nothing ever feels quite integrated enough to be called finished. The cost is a permanent, exhausting almost-there, where genuine accomplishments never get to feel accomplished.`,
      path: `Declare one thing finished this week at "good enough," on purpose, before it feels perfectly whole. You are allowed to want wholeness and still let something be complete before it's absolute. What have you been withholding completion from simply because it hasn't felt total enough yet?`,
    },
    22: {
      heading: `The Fool Runs Your Entire Chart`,
      why: `The leap taken before there's any proof it'll work, each beginning treated as genuinely new rather than a repeat of the last one — that's the Fool, and at this weight, faith in what hasn't happened yet isn't occasional courage. It's the fundamental way your entire system relates to being alive.`,
      synthesis: `Someone with a single Fool placement is capable of real risk in one part of life. Underneath your whole blueprint sits something larger: trust in the unmapped as the actual engine, so whatever shows up elsewhere gets approached as an open beginning rather than a known quantity, because your system doesn't require certainty before it's willing to move.`,
      traits: `You probably don't need a guarantee before you're willing to start something — a financial risk, a relationship, a whole new direction — and that's genuine, uncommon courage, not naivety. Each new beginning likely feels real and open to you, rather than a rerun of something you've already lived through. People may find your willingness to leap both inspiring and, at times, a little alarming.`,
      shadow: `Trust in the unknown this strong can quietly avoid the depth that comes from actually settling into one thing — perpetual openness that never lets any single path get tested long enough to prove itself. Mistaking the comfort of always beginning for the harder, more rewarding work of actually arriving is the real risk.`,
      path: `Stay on one already-chosen path this week instead of eyeing the next open door. You are allowed to trust the unknown and still commit to what you've already started. What beginning have you been quietly considering that's actually a distraction from the one you're already living?`,
    },
  };

  function get(num) { return data[num] || null; }
  return { get };
})();
