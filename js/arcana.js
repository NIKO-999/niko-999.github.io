/**
 * Destiny Matrix — Arcana Psychological Database
 * ------------------------------------------------
 * 22 archetypes translated into behavioural psychology.
 * Each entry follows the reading template:
 *   identity → origin → shadow → healthy → masculine_feminine →
 *   money_power → integration
 *
 * Tone: deep, personal, confronting, grounded.
 * Not mystical. Not motivational. Psychologically precise.
 */

'use strict';

const ARCANA = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 1,
    name: 'The Magician',
    keywords: ['will', 'agency', 'resourcefulness', 'initiation'],

    identity: `You walk into a room and something in its energy shifts, almost without your trying. You have an almost compulsive drive to begin things — ideas fire fast, your mind moves at speed, and once you decide something should happen, you can usually make it happen. The complication is that you know this about yourself, which means you also know exactly when you're performing that capability and when it's real. That gap — between what you can do and what you're actually choosing to do — is where most of your internal friction lives.`,

    origin: `You probably learned early that your competence was the thing that kept you safe, or kept you loved. Doing, fixing, impressing, initiating — that's what earned you your place. So your nervous system wired agency to survival. Even now, stopping, resting, or simply not knowing something can feel unconsciously dangerous, like a threat you can't quite name.`,

    shadow: `When this tips into shadow, you can find yourself manipulating — not always maliciously, but strategically, moving people and situations like pieces toward an outcome you've already decided on. You might notice a pattern of starting many things and quietly abandoning them once the initial excitement fades, leaving a trail of half-built projects and promises you didn't quite deliver on. At its worst, your charm and capability become a way of distracting others — and yourself — from the fact that nothing of real depth is actually getting built.`,

    healthy: `At your best, your creative force is real and you've learned to direct it — you don't just spark, you see things through. Your intelligence serves something beyond your own stimulation. You understand that real power isn't in doing many things, it's in being someone who can do the one right thing, fully, at the right moment.`,

    masculine_feminine: `You likely run hot on masculine expression here — direction, initiation, doing. Your integration work is in developing the feminine side: receptivity, patience, letting things arrive instead of forcing them. Left unbalanced, you'll burn through people and situations, because you never quite learned how to receive.`,

    money_power: `You can generate money fast — and sometimes lose it just as fast, because your nervous system is built for initiation, not stewardship. There may be a quiet fear underneath that having real power makes you visible, and visible means accountable, so you sabotage yourself right at the threshold of actually arriving. Watch for a cycle of almost-making-it followed by a sudden reversal.`,

    integration: `Try letting go of performing competence and start choosing depth instead. Commit to one thing long enough to see what it becomes once the novelty wears off. The belief worth shifting: "I must always be capable" into "I'm allowed to not know." The behavior that anchors it: finishing what you start, even after the excitement is gone.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 2,
    name: 'The High Priestess',
    keywords: ['intuition', 'inner knowing', 'mystery', 'stillness'],

    identity: `You process the world in a way most people can't quite see or follow. You read subtext, sense what isn't said, know things before they're proven — and that gift has made you both remarkably perceptive and chronically misunderstood. You've probably spent a good part of your life either hiding your depth so you don't overwhelm people, or revealing it too fast and watching them quietly retreat. What you're left with is a pattern of emotional self-containment that feels like protection but actually functions as isolation.`,

    origin: `You likely learned early that the full expression of your inner world — your feelings, your perceptions, your knowing — wasn't safe or welcome. Maybe it got dismissed, laughed off, or just never met with the depth it deserved. So you went inward, building an extraordinarily rich interior life because the world outside wasn't big enough to hold you. The cost has been a growing gap between who you are inside and who you actually let people see.`,

    shadow: `In shadow, you withhold — not always on purpose, but systematically. You can create emotional distance through mystery, keeping people just far enough away that they never truly see you, and so can never truly hurt you either. There's also a pattern of passive guidance: knowing exactly what needs to happen but never quite saying it out loud, then feeling resentful when no one picks up the signal. At its worst, so much inner sensing builds up that taking action becomes almost impossible.`,

    healthy: `At your best, you've learned to trust your knowing enough to act on it. You're deeply intuitive without being frozen by that intuition. You speak your perception with grounded confidence instead of cryptic suggestion. You've come to understand that being truly seen by the right people isn't a risk — it's the whole point.`,

    masculine_feminine: `This lives in you as a deeply, sometimes almost exclusively feminine expression. The masculine — structure, boundaries, direct speech, decisive action — often stays underdeveloped or gets rejected outright. Integration means channeling your deep knowing into direct, actionable communication, and actually saying what your inner world has already understood.`,

    money_power: `Your financial behavior tends to be inconsistent and intuition-driven in ways that don't always translate into strategy. You might know exactly what you want but struggle to build the structured systems that hold wealth. There's often an unconscious belief lurking that money is somehow incompatible with depth or spirituality — a piece of conditioning worth identifying and consciously letting go of.`,

    integration: `Try letting go of making people earn access to your real self as a kind of worthiness test. That strategy protects you, but it also guarantees loneliness. The belief worth shifting: "My depth is too much for most people" into "The right people have been waiting for me to stop hiding." The behavior: say the first truthful thing, directly, before you have time to qualify it into nothing.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 3,
    name: 'The Empress',
    keywords: ['creation', 'abundance', 'nurturing', 'generativity'],

    identity: `You're someone things grow through. People feel more alive around you. You have an instinctive gift for creating environments — physical, emotional, relational — where others can expand. You're generous, often extravagantly so, and you take real pleasure in watching the people around you flourish. But underneath the giving, there's a question you might be afraid to ask out loud: does anyone give like this back to me? And underneath that: do I actually believe I deserve it?`,

    origin: `This pattern often forms when love was conditional on what you provided — care, beauty, harmony, emotional support. You learned your value was tied to your generosity. That created a loop: giving feels good and safe, while receiving feels uncomfortable, even suspicious. Over time, the ability to truly receive — without immediately reciprocating — can quietly wither.`,

    shadow: `In shadow, you give in order to control. The generosity carries strings you may not consciously notice, but they're structurally there. When the giving goes unappreciated, you might collapse inward or grow quietly resentful. You may tie your self-worth so tightly to productivity and creation that rest starts to feel like worthlessness. In relationships, this can look like nurturing people who can't or won't nurture you back — and calling it love.`,

    healthy: `At your best, you're genuinely generative — you create and give because it flows from abundance, not because you're trying to fill a deficit. You can receive with full presence. You know your worth isn't located in what you produce or provide. You create from fullness, not from fear.`,

    masculine_feminine: `This is a deeply feminine archetype for you — creation, flow, emotional nourishment. Your shadow feminine shows up as over-giving, losing yourself in service to others. The masculine integration you need is the ability to set clear boundaries, say no without guilt, and direct your creative force instead of simply releasing it toward whoever's nearest.`,

    money_power: `Your relationship with money can get complicated — either highly abundant and generous to the point of financial instability, or subtly blocked because somewhere underneath there's a belief that wanting more is selfish. The core wound worth examining: a fear that financial abundance might change how people see you, or make you somehow less connected to others. It won't — but that belief can run deep.`,

    integration: `Try letting go of taking responsibility for other people's emotional states. That's not generosity — it's control wearing the costume of love. The belief worth shifting: "My worth is what I provide" into "I am enough when I provide nothing." The behavior: practice receiving a compliment, a gift, or help without immediately deflecting or reciprocating. Let yourself actually be given to.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 4,
    name: 'The Emperor',
    keywords: ['structure', 'authority', 'stability', 'legacy'],

    identity: `You naturally organize things — people, systems, environments, ideas. You have a deep need for order, and when it's missing, a low-grade but persistent anxiety follows you around that rarely fully resolves. You're capable, responsible, and reliable in a way the people around you depend on. You carry a lot. You always have. The question no one asks you — and that you rarely ask yourself — is: who carries you?`,

    origin: `This pattern usually forms in a family system where structure was either missing and you stepped in to provide it, or oppressive, and you either absorbed it or rebelled against it and ended up reproducing it anyway. Either way, you learned that if you don't take charge, things fall apart. Your nervous system concluded: control is safety, vulnerability is exposure, emotion is disorder.`,

    shadow: `In shadow, you become rigid and controlling, building walls disguised as systems. Anything that can't be categorized, managed, or predicted makes you deeply uncomfortable — which ultimately means other people's full humanness, including your own, makes you uncomfortable too. There's often a suppressed emotional world underneath your structured exterior that's never been given permission to exist. At its worst, this becomes tyranny — imposing structure on others as a way of managing your own internal chaos.`,

    healthy: `At your best, you build things that outlast you. Your authority comes from genuine competence and trustworthiness, not fear-based control. You've learned to let your emotional world exist alongside your structural mind, not instead of it. You protect without smothering, lead without dominating. You understand real stability is internal, not external.`,

    masculine_feminine: `This is a strongly masculine archetype for you — structure, authority, discipline. Your integration work is learning to feel something without immediately fixing or restructuring it. Once you've integrated the feminine, you know when to hold the structure and when to let it dissolve. You become strong enough to be soft.`,

    money_power: `You typically have strong financial capacity, but money often gets tangled up with identity and status in a way that creates anxiety. The fear of losing financial stability can drive overwork and rigidity. You may struggle to spend on pleasure or anything without a measurable return, because part of you has never fully learned that enjoyment isn't irresponsibility.`,

    integration: `Try treating your emotional world as something other than a management problem. Feelings aren't inefficiencies. The belief worth shifting: "If I'm not in control, everything collapses" into "Others are capable, and I'm allowed to rest." The behavior: delegate something genuinely important and resist the urge to check on it. Let someone else carry something. See what actually happens.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 5,
    name: 'The Hierophant',
    keywords: ['wisdom', 'tradition', 'guidance', 'belonging'],

    identity: `You're a seeker of meaning who needs your understanding to actually mean something to other people. You have a deep need to belong to something larger than yourself — a system, a tradition, a framework — and an equally deep need to pass on what you've learned. Teaching, guiding, explaining: these aren't just things you do, they're how you make sense of your own existence. The friction shows up when the system you've inherited conflicts with what your own direct experience has taught you, and you have to choose between belonging and truth.`,

    origin: `This pattern tends to form in environments where belonging required conformity — where asking the wrong question or stepping outside the established framework had real social or emotional consequences. You learned there's safety in shared belief systems, and you've been building or living inside them ever since. Your instinct toward tradition started as a survival mechanism and became a worldview.`,

    shadow: `In shadow, you can enforce rules you no longer actually believe in, out of fear of the chaos that might follow if the structure got questioned. You may become dogmatic, not from conviction but from anxiety — the doctrine is load-bearing, and if it falls, what's left? There's also a version of this where you constantly seek authorities to defer to, always looking for someone who knows better, never quite trusting your own direct experience.`,

    healthy: `At your best, you've done the difficult work of separating genuine wisdom from inherited conditioning. You know which parts of your system are actually true, and you can hold those with conviction while honestly discarding what no longer serves. You transmit real insight without needing agreement. Your guidance comes from integrated knowing, not institutional authority.`,

    masculine_feminine: `In its healthy form, this carries strong masculine energy for you — clear transmission, principled guidance, structured wisdom. The shadow feminine here shows up as seeking approval for your beliefs from external authorities instead of trusting your direct experience. Integration means developing the courage of inner knowing alongside the discipline of outer systems.`,

    money_power: `Money and ethics tend to be closely entangled for you. There's often an unconscious belief that financial success achieved outside tradition or expectation is somehow wrong or destabilizing. That can produce either rigid financial conservatism or a complicated, morally ambiguous relationship with wealth. The work is separating your financial capacity from inherited moral frameworks about what counts as "acceptable" success.`,

    integration: `Try no longer outsourcing your authority to systems, traditions, or other people's approval. What you were given isn't the whole truth — it's a starting point. The belief worth shifting: "If I question the framework, I lose my people" into "My real people are the ones who can handle my honest questioning." The behavior: form one opinion publicly that contradicts something you've previously defended.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 6,
    name: 'The Lovers',
    keywords: ['choice', 'values', 'alignment', 'relationship'],

    identity: `Relationships aren't optional for you — they're the medium through which you understand yourself. You think in relation, feel in relation, define yourself in relation. That gives you extraordinary capacity for connection, and an equally powerful vulnerability to losing yourself inside it. The central tension of your life runs between the pull toward deep union and the pull toward your own distinct identity — and you've probably swung between those poles more than once, often painfully.`,

    origin: `This pattern develops when love and identity get confused early on. Maybe love was conditional on certain kinds of behavior, or the relational world around you was chaotic enough that you learned to shape yourself into whatever was needed to keep the connection. What you're left with is someone deeply relational who isn't always sure, underneath all that relating, who they actually are when no one's looking.`,

    shadow: `In shadow, you avoid genuine choice. You keep your options open, stay in ambivalence, commit just enough to feel connected but never enough to be truly responsible. That's not indecisiveness for its own sake — it's a real fear that making a genuine choice means losing something or someone, and that loss will reveal a self that isn't enough on its own. At its worst, this becomes chronic compromise of your own values for the sake of connection, justified as love.`,

    healthy: `At your best, you've clarified your own values clearly enough that your choices become obvious, even when they're painful. You can be fully in relationship without losing yourself. You understand real intimacy requires two distinct, complete people — and that the most generous thing you can offer someone else is your own uncompromised self.`,

    masculine_feminine: `You live in the tension between masculine (individual direction, autonomous choice, defined values) and feminine (connection, merger, relational flow). The integration work is holding both at once — being fully present in relationship and fully yourself within it. Neither has to cancel the other, even though that's the hardest thing for you to learn.`,

    money_power: `Your financial decisions are strongly shaped by relational dynamics — spending for love, avoiding success for fear it disrupts a connection, making choices based on what keeps the peace rather than what serves your real goals. Worth examining: where are you limiting your financial growth just to stay inside a relational comfort zone?`,

    integration: `Try treating your own preferences as non-negotiable. Every time you compromise a real preference for the sake of connection, you're training yourself and the other person that your preferences don't matter. The belief worth shifting: "Having my own needs will drive people away" into "The right people are drawn to the clarity of who I actually am." The behavior: state a real preference and let the other person respond to it without adjusting your answer based on their reaction.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 7,
    name: 'The Chariot',
    keywords: ['direction', 'will', 'mastery', 'forward movement'],

    identity: `You need to be going somewhere. Not busy for its own sake — genuinely moving toward something, with a clear destination and a real sense of momentum. When you have direction, you're almost unstoppable. When you don't, a restlessness sets in that can look like ambition but is actually closer to existential anxiety: without forward movement, you don't quite know who you are. The real question underneath your drive was never "where am I going?" It's "who am I when I'm not moving?"`,

    origin: `This pattern often forms in environments where stillness felt unsafe, or where achievement was the currency of love. You learned to associate forward movement with safety, worth, or identity, and you've been in motion ever since. Your nervous system knows how to drive; it's had much less practice being still and trusting that what you've already built is actually enough.`,

    shadow: `In shadow, you control everything — the pace, the outcome, the route — and call it discipline. You can steamroll people and situations in service of your goal without fully registering the damage, because the goal justifies the means. There's often a real disconnection from the emotions that would slow your momentum — grief, vulnerability, tenderness — because they get experienced as threats to your forward trajectory. At its worst, this looks like winning at everything except the things that actually matter.`,

    healthy: `At your best, you've learned to harness both your drive and your inner life as one unified force. You move with purpose, not rigidity. You know when to accelerate and when to stop and take stock. You've earned your momentum because you've also done the work of knowing what you're really trying to reach, and why.`,

    masculine_feminine: `This is a strongly masculine-energy archetype for you. Your shadow is the suppression of the feminine — emotion, receptivity, surrender — in service of forward motion. The integration work is recognizing that receiving, softening, and feeling aren't detours from the journey; they're fuel for it. Once you integrate the feminine, you actually move faster, because you're carrying less suppressed weight.`,

    money_power: `You likely have strong earning capacity, but your relationship with money mirrors your relationship with everything else: it has to be controlled. There may be a pattern of over-accumulating without ever enjoying it, or an inability to stop and actually inhabit the success you've built. Worth asking: is the financial driving in service of a life, or a substitute for one?`,

    integration: `Try treating pause as something other than failure. The thing you're most afraid to do — stop, not know, not be moving — is exactly what the next stage requires. The belief worth shifting: "I am what I achieve" into "I exist completely even when I'm achieving nothing." The behavior: take one full day with no goals, no productivity, and resist the urge to manufacture urgency. Notice what comes up.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 8,
    name: 'Strength',
    keywords: ['courage', 'patience', 'inner power', 'taming instinct'],

    identity: `You carry a quiet, sustained power that most people only ever access in emergencies. You can hold things together under pressure in a way that looks almost effortless — because you've done it so many times, it's become second nature. The cost is that you've trained yourself to never really let the pressure show. You're the person others lean on. Rarely the person you let yourself lean on. What people read as strength is partly genuine, and partly a very old decision not to need.`,

    origin: `This pattern tends to form in environments where expressing weakness or need had real consequences — being dismissed, overwhelming someone, or simply going unmet for so long that needing started to feel futile. You learned to manage your own emotional world silently. You built remarkable internal resilience, and alongside it, a quiet belief that your needs are too much, or not valid enough to voice.`,

    shadow: `In shadow, you suppress instinct in the name of control — not just anger or desire, but the animal intelligence of your own body: its tiredness, its grief, its joy, its alarm signals. You might also use your patient endurance as a form of quiet superiority: "I don't complain" can slide into "I'm better than the people who do." At its worst, rage that's been compressed for years finally moves, and by then it can't be directed.`,

    healthy: `At your best, your power is genuine and earned — not the brittle control of someone afraid to feel, but the deep resilience of someone who's been through things and knows they can survive them. You can be genuinely gentle because you're not afraid of your own force. You can ask for help because you know your strength doesn't require the performance of never needing anything.`,

    masculine_feminine: `Strength sits at the intersection of both polarities for you — holding real power (masculine) through gentleness and compassion rather than force (feminine). The integration work is learning that gentleness isn't weakness, and force isn't strength. Real power doesn't grip. It holds.`,

    money_power: `You're typically capable financially but often underearn relative to what you actually produce, because asking for what you're worth requires the same vulnerability as asking for anything else. There's often a pattern of doing more than expected and then resenting the lack of recognition or compensation — when the real issue was never asking clearly for what you needed.`,

    integration: `Try letting go of performing unbreakability. It's keeping people from actually knowing you, and it's slowly wearing you down. The belief worth shifting: "Needing is weakness" into "Being genuinely known, needs included, is what creates real connection." The behavior: tell one person something you actually need this week. Not a preference — a real need. See if the world ends.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 9,
    name: 'The Hermit',
    keywords: ['wisdom', 'solitude', 'inner lantern', 'the guide'],

    identity: `You need significant time alone — not because you dislike people, but because the outside world is loud and your internal world is where the real work happens. Often through real difficulty, you've built up a depth of understanding that feels genuinely hard to share, because most conversations seem to operate at a level that doesn't quite touch what you're carrying. What results is a particular kind of loneliness — not being unseen, but being un-met.`,

    origin: `This pattern usually develops through early disappointment in the relational world — either the environment couldn't hold your depth, or connection kept coming with conditions you couldn't meet without losing yourself. Solitude became the solution. Your inner life expanded to fill the relational space that felt too unsafe or too shallow to actually live in.`,

    shadow: `In shadow, you mistake isolation for wisdom. You withdraw not to integrate and return, but to avoid — the messiness of real relationship, the vulnerability of being wrong in front of others, the discomfort of having your perceptions challenged. There's often a hidden arrogance underneath: a belief that others simply can't understand you, which quietly protects you from the scarier possibility that you just haven't risked being understood.`,

    healthy: `At your best, you go inward to fill yourself up, and then you genuinely return — with something to offer, not just something to protect. Your solitude is generative. Your wisdom is earned and therefore real, not just accumulated and hoarded. You can be with people without losing yourself, because your inner world is stable enough not to feel threatened by the outer one.`,

    masculine_feminine: `This tends toward a closed energetic loop for you — not strongly masculine or feminine, but self-sufficient. The integration work is opening that loop: letting both giving and receiving move through you instead of keeping your internal world hermetically sealed. Wisdom that's never shared isn't wisdom. It's just knowledge.`,

    money_power: `Your relationship with material success can get complicated, often because success requires engaging with the external world in ways that feel draining or compromising. There's sometimes a belief that financial ambition is incompatible with depth or integrity. Worth asking: is your relationship with money genuinely values-aligned, or is disengaging from financial pursuit just another form of avoidance?`,

    integration: `Your wisdom isn't complete until you risk offering it. The belief worth shifting: "No one can really understand what I carry" into "I haven't yet found the right way to offer it." The behavior: share the thing you know most deeply with one person who hasn't asked for it, without waiting to refine it to perfection. Let it be imperfect. Let them respond.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 10,
    name: 'Wheel of Fortune',
    keywords: ['cycles', 'change', 'karma', 'turning points'],

    identity: `You understand, sometimes painfully, that life moves in cycles no amount of effort fully controls. You've probably had sudden, dramatic changes: moments where everything shifted, the rug pulled out, or a door opened you didn't even know you were standing in front of. Your life is built to rotate — comfort followed by disruption, disruption followed by unexpected opportunity — whether you choose it or not. The real question is whether you participate consciously, or just get carried.`,

    origin: `This pattern forms in environments marked by instability or unexpected change, where the predictable was unreliable and you learned to brace for the wheel's next turn. It can also form through one unusually dramatic personal turning point early in life that rewired how you understand how quickly and completely things can change. Either way, you carry a fundamental, early experience of impermanence.`,

    shadow: `In shadow, you develop victim consciousness — the belief that life just happens to you, that cycles are external forces you have no agency over. There's a tendency to outsource responsibility to fate, luck, timing, or other people's choices, waiting for the wheel to turn rather than recognizing your own consciousness and choices as what actually determines what rises and what falls.`,

    healthy: `At your best, you've developed a deep trust in cycles alongside genuine personal agency within them. You understand timing — when to move and when to let things settle — and carry an almost serene relationship with change, because you've learned every rotation eventually rights itself. You're resilient not because things don't fall apart, but because you know how to rebuild.`,

    masculine_feminine: `You live in the dynamic tension between control (masculine) and surrender (feminine). Integration means understanding which force each moment of the cycle actually calls for — when to act and when to allow. The tendency is to overcorrect: either trying to control the uncontrollable, or passively surrendering exactly when action is what's needed.`,

    money_power: `Your financial life often mirrors the wheel itself — dramatic highs followed by significant lows, with a recurring theme of almost-arriving. Watch for the unconscious repetition: each cycle of loss is often preceded by the same choices, the same signals being ignored. The work is becoming conscious of the moment right before the wheel turns downward, and asking: what am I not looking at right now?`,

    integration: `Try no longer treating every difficult phase as a sign something's gone wrong. The belief worth shifting: "When things are good, something bad is coming" into "I'm building the capacity to hold more, not just waiting for the fall." The behavior: notice the next time you're in an upswing, and consciously reinforce it instead of bracing against its end.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 11,
    name: 'Justice',
    keywords: ['truth', 'balance', 'accountability', 'integrity'],

    identity: `You have an acute sensitivity to fairness that operates almost like a physical sense. When something's unequal, untruthful, or out of balance, you register it immediately — in your body, in your emotional state, in a kind of quiet fury that builds until it's addressed, or you find some way to contain it. You're the person who can't let things go that others shrug off as "just the way things are." That's a real gift, and it also costs you: relationships, ease, and a huge amount of internal energy.`,

    origin: `This pattern often develops in environments where actual fairness was absent — where the rules got applied inconsistently, where truth was sacrificed for convenience, or where you experienced a real injustice that was never acknowledged or resolved. The system became both the wound and the solution: if you can understand the rules of what's fair, maybe you can prevent this from happening again.`,

    shadow: `In shadow, you become a judge — of others, of yourself, and most painfully of both at once, with different standards for each. You can get so committed to abstract fairness that you lose empathy for the human complexity of a real situation. There's often a hidden perfectionism underneath: a belief that if you were entirely fair, honest, and balanced, you'd somehow earn safety or love. That's an impossible standard wearing the costume of integrity.`,

    healthy: `At your best, you're genuinely honest — with yourself and others — in a way that's useful rather than punishing. Your truth-telling comes from real care, not a need to be right. You hold the balance not as an external standard you enforce, but as an internal reality you embody. You understand real justice includes compassion, and real accountability includes yourself.`,

    masculine_feminine: `This tends to lean heavily masculine in you — clear, cold, rational, principle-driven. The integration work is letting the feminine into the equation: context, emotion, nuance, the specific human being in front of you rather than the abstract principle they represent. Real justice isn't blind. It sees everything.`,

    money_power: `You often have a complicated relationship with money, rooted in a belief that wealth is somehow inherently unequal or unfair, and therefore something to avoid, minimize, or give away. There may also be a pattern of working far harder than you're compensated for, driven by an unconscious belief that claiming your financial worth is somehow unjust, or "not fair to others." That's the Justice wound turned on yourself.`,

    integration: `Try no longer holding yourself to a standard you'd instantly recognize as cruel if you applied it to anyone else. The belief worth shifting: "I must be entirely accountable before I can ask for anything" into "Asking for what I need isn't the opposite of fairness — it's part of it." The behavior: identify one place where you're applying a different standard to yourself than to others. Correct it.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 12,
    name: 'The Hanged Man',
    keywords: ['suspension', 'new perspective', 'surrender', 'waiting'],

    identity: `You know what it is to live in a liminal space — between what was and what's coming, unable to move forward and unwilling to go back. You've had periods of real suspension that felt like failure but actually functioned as transformation. You didn't choose to hang there — circumstance placed you. But how you inhabit that suspension, with resistance and suffering or with genuine openness, determines almost everything about what comes next.`,

    origin: `This pattern typically develops through some kind of forced stopping — illness, loss, failure, or circumstance that removed your option of forward motion and demanded a fundamental reorientation. You learned, often painfully, that some insight only comes through an involuntary pause. The wound is believing that being suspended means being helpless. The gift is a perspective no other position offers.`,

    shadow: `In shadow, suspension becomes your identity. You stay hung not because the situation requires it, but because you've found the position of willing sacrifice draws a particular kind of care and attention. There's also a pattern of self-martyrdom — sacrificing your genuine needs, desires, or direction in service of others or some abstract ideal, and then secretly waiting for a recognition that never quite comes.`,

    healthy: `At your best, you've learned surrender isn't weakness — it's actually the most advanced form of engaging with what is. You can pause without panicking. You can sit with not-knowing without manufacturing a false answer just to feel in control. You bring back something real from every liminal period, something that couldn't have been reached by pushing through.`,

    masculine_feminine: `This inverts the typical masculine drive for you. Healthy integration means learning that stopping, receiving, allowing, and waiting — all deeply feminine energies — aren't retreats from life but advances into it. The masculine shadow here is the compulsive pushing-through that bypasses the intelligence only stillness can offer.`,

    money_power: `You often experience involuntary financial suspension — periods of waiting, of resources not flowing, of effort not producing results — that feel like failure but actually function as reorientation. Worth examining: what does the suspension keep trying to show you about the direction you were heading? Your financial life becomes coherent once the suspension gets followed instead of fought.`,

    integration: `Try no longer treating every period of stillness as something to escape. The belief worth shifting: "Nothing is happening, therefore I'm failing" into "Something is being given to me that I can only receive if I stop trying to produce it." The behavior: identify the one thing you keep rushing past. Sit with it for a full hour without doing anything about it. Notice what it tells you.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 13,
    name: 'Death',
    keywords: ['transformation', 'endings', 'release', 'transition'],

    identity: `You're not afraid of endings in the abstract — you might even welcome them. But in practice, there's usually something you can't quite let go of, no matter how clearly you know it's already over. That's the paradox you carry: enormous capacity for transformation in principle, and an equally powerful unconscious resistance to it once it touches something you've identified with. The real work isn't surviving endings. It's learning what you are when the thing you called yourself is gone.`,

    origin: `This pattern forms in environments where loss was either traumatizing or never properly processed. Either way, your nervous system learned to grip what it has — relationships, identities, patterns, even suffering — because losing things without being able to mourn them properly leaves something in you unable to complete the cycle. The holding-on was never stubbornness. It's incomplete grief.`,

    shadow: `In shadow, you live in the past — attached to versions of reality that have already ended, identities that no longer fit, relationships that are done but not released. There's often a compulsive return to what was, dressed up as loyalty, love, or principle. At its worst, you might deliberately destroy things before they can leave you, so at least the ending stays under your control — destruction as a defense against the grief of natural endings.`,

    healthy: `At your best, you've developed a genuinely graceful relationship with change. You know how to end things consciously — relationships, chapters, habits, identities — and how to mourn what passes without pretending it didn't matter. You understand your capacity to release is exactly equal to your capacity for what's new. Nothing new enters without space being made.`,

    masculine_feminine: `This requires both polarities working together for you: the masculine ability to cut clearly and decisively, and the feminine capacity to mourn, to feel the loss fully, and to receive what follows. The shadow usually shows up as an imbalance — cutting without mourning (masculine excess), or mourning without being able to cut (feminine excess). Integration is the complete cycle.`,

    money_power: `Your financial patterns often involve holding onto situations, jobs, or income streams that have already ended in terms of alignment or growth, because the ending feels like loss rather than transition. Or the opposite: dramatic financial endings as a way of forcing change your self couldn't choose consciously. Worth asking: what financial structure are you maintaining just because you can't bear to let it end, even though you already know it's over?`,

    integration: `Identify what ended that you still haven't mourned. Not the thing you say you're over — the thing you haven't let yourself feel was actually lost. The belief worth shifting: "Letting go means it didn't matter" into "Fully releasing what has ended is the deepest respect I can pay to what it was." The behavior: consciously complete one ending that's still incomplete. Say goodbye to it. Out loud.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 14,
    name: 'Temperance',
    keywords: ['balance', 'integration', 'patience', 'the middle path'],

    identity: `You understand balance — in principle. You can see the extremes, spot where things have tipped too far in one direction, and know what the middle path looks like. What's harder is actually living inside it consistently. You may move through phases of overcorrection, swinging from one extreme to another in relationships, habits, or self-understanding, all in search of an equilibrium you can see clearly but find genuinely hard to hold onto. What you're after isn't the absence of extremes. It's what becomes possible once you've actually inhabited both.`,

    origin: `This pattern develops in environments of imbalance — where emotional, relational, or material excess or deprivation was the norm, and you learned to navigate by swinging between extremes, because the middle was never modeled as a real option. Or it can form the opposite way: an environment where the middle was demanded so rigidly that you never developed a genuine relationship with your own extremes at all.`,

    shadow: `In shadow, you avoid genuine emotion by processing everything into neutrality. You can get so committed to "not going too far in either direction" that you never fully feel anything, never fully commit to anything, and mistake management for integration. There's also a people-pleasing version of this shadow — using balance and moderation as a way of never fully occupying your own position, always available to be adjusted.`,

    healthy: `At your best, you've earned your balance through experiencing both extremes, not avoiding them. You're patient in a way that's grounded and generative, not passive or fearful. You can hold two opposing truths at once. You integrate contradictions instead of collapsing them into a false neutrality. Your equilibrium is dynamic, not static.`,

    masculine_feminine: `You live in the relationship between the polarities — the integration of masculine and feminine, direction and flow, structure and surrender. Your work isn't choosing a side, it's developing the fluency to move between them appropriately. This is one of the most sophisticated psychological tasks there is: genuine integration that doesn't erase either pole.`,

    money_power: `You often have complex spending or saving patterns that swing between excess and restriction, both driven by the same underlying anxiety about what the "right amount" even is. What you need is a genuinely relaxed relationship with financial flow — neither hoarding nor burning through, but letting money move through a life that's itself in motion.`,

    integration: `Try no longer waiting to get it perfectly balanced before engaging with it fully. The belief worth shifting: "I need to find the middle before I can commit" into "The middle is something I build by committing, not something I find beforehand." The behavior: fully commit to one position — in a relationship, a project, a belief — for thirty days without hedging or adjusting based on the response.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 15,
    name: 'The Devil',
    keywords: ['shadow', 'bondage', 'unconscious drives', 'liberation'],

    identity: `You're intimately familiar with your own compulsions — the patterns that run you even when you can see them running. That's not weakness; it's actually a form of self-knowledge. This doesn't mean you're ruled by darkness. It means your relationship with your own shadow is the central work of your life, and how much of that work you do determines how free or how trapped you feel. The chains are always there. What changes is whether you can see them.`,

    origin: `This pattern develops in environments where natural drives — pleasure, desire, anger, sexuality, ambition — got shamed, suppressed, or modeled in their most destructive forms. What gets suppressed doesn't disappear; it goes underground and runs from there. You may have become simultaneously fascinated by and afraid of your own intensity, your own desire, your own darkness.`,

    shadow: `In shadow, you're controlled by exactly what you won't look at. Addictions, compulsions, repetitive self-destructive patterns aren't character flaws — they're symptoms of disowned psychology. There's often a significant gap between the self you present publicly and the reality of your private patterns. The shame of that gap becomes its own driver of the compulsion: the more shameful it feels, the harder it pulls.`,

    healthy: `At your best, you've done the courageous work of turning toward your own darkness and sitting with what you find there without collapsing into self-loathing. You've integrated your shadow instead of trying to eliminate it, understanding that what you were once afraid of in yourself holds genuine power that, once owned, becomes extraordinary capacity. You're free not because the chains are gone, but because you can see them.`,

    masculine_feminine: `This requires the feminine capacity to accept and feel what's present without judgment — including the darkest contents of your own psyche — and the masculine capacity to make clear, boundaried choices about which drives to act on and which to integrate without expressing. Shadow work without structure becomes indulgence. Structure without shadow work becomes rigidity.`,

    money_power: `You often have complex relationships with money tied to shame, secrecy, or compulsion. Your financial patterns may include hidden spending, compulsive acquisition, or self-sabotage driven by an unconscious belief that you don't deserve real stability. Or the reverse: using financial power as a form of control in relationships, which is its own shadow expression. The work is separating financial behavior from shame.`,

    integration: `The specific shadow you're least willing to admit to yourself is usually the one with the most power over you. Naming it — to yourself, and to at least one other person who can hold it with you — isn't weakness. It's the beginning of actual freedom. The belief worth shifting: "If people knew this about me, they'd leave" into "The people who matter can hold this, and I can hold myself knowing it." The behavior: say the thing you've never said out loud.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 16,
    name: 'The Tower',
    keywords: ['disruption', 'revelation', 'breakdown', 'breakthrough'],

    identity: `You've experienced, probably more than once, a sudden, complete collapse of something you'd built your stability around — a relationship, a career, an identity, a belief system. It doesn't ask permission and doesn't come with a warning. What it does bring is clarity: after the collapse, you can see exactly what was false in what you were building on. This isn't a comfortable thing to carry. But someone who's been through it genuinely knows things others only theorize about.`,

    origin: `This pattern develops either through actual catastrophic life events — the foundation literally pulled out from under you — or through a psyche that's spent so long building on an unstable base (suppressed emotion, false identity, inherited beliefs that never fit) that the eventual collapse comes from inside rather than outside. Either way, it functions like an immune system, burning out what can't hold so that what comes next has a real foundation.`,

    shadow: `In shadow, you avoid all structures because you've been burned before. You resist commitment, refuse to build anything you're not prepared to lose, and call the constant dismantling "freedom" when it's really a fear of being inside something when it collapses again. There's also the opposite shadow — obsessively fortifying structures that are already internally compromised, spending huge energy defending what's quietly failing from within.`,

    healthy: `At your best, you build differently after the fall — not more defensively, more honestly. You've developed a higher-than-average tolerance for instability, because you know you can rebuild and survive. You're unusually good at seeing what's false or unstable in systems, in your own life and in the organizations and relationships around you. That's the gift: seeing clearly without needing to pretend.`,

    masculine_feminine: `This energy is violent in its masculine expression for you — sudden, forceful, tearing down what stands. The feminine integration is in what follows: the grief, the clearing, sitting with what remains. If you resist the feminine here, you'll rebuild the same thing on the same broken foundation. If you integrate it, you'll sit in the rubble long enough to understand why it fell.`,

    money_power: `You've likely had financial Tower experiences — sudden losses, unexpected collapses, situations that seemed stable turning dramatically. Worth examining: what was already unstable before the collapse? What weren't you looking at, or willing to address, that got exposed? The financial rebuild after a Tower experience only holds once the honest audit is actually done.`,

    integration: `Try no longer waiting for something external to force the change you already know needs to happen. You've had enough experience by now to recognize when you're building on a foundation that can't hold. The belief worth shifting: "Maybe if I reinforce it enough, it will hold" into "The honest collapse I choose is less costly than the one I avoid until it chooses me." The behavior: identify the structure in your life that's already quietly failing. Make the conscious choice.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 17,
    name: 'The Star',
    keywords: ['hope', 'renewal', 'inspiration', 'healing'],

    identity: `You carry something genuinely rare: the capacity for hope after things have fallen apart. Not naive optimism — the kind of hope that's been earned, that's been through the Tower or the darkness and come back with something luminous still intact. People feel it around you. You're often the one others look to when they've lost their direction, because you carry a quality of light that isn't performative and can't be faked. The challenge is that the same sensitivity to what's possible can make the gap between your vision and current reality feel unbearable.`,

    origin: `This pattern often develops through a significant period of darkness — loss, illness, betrayal, collapse — followed by an unexpected renewal that restructured your relationship with hope itself. Your hope isn't innocent, because it's been tested. It's earned, refined, and real. Some carry this as a natural gift from birth instead, which means your work is grounding the luminosity so it can actually function in the material world.`,

    shadow: `In shadow, you become an idealist who can't land — perpetually inspired by the possible while consistently disappointed by the actual. There's often a pattern of beginning things with enormous light and energy, then losing momentum once reality proves more resistant than the vision allowed for. Spiritual bypassing is the most common shadow expression here: using beauty, vision, and inspiration as an escape from the work of actual embodiment.`,

    healthy: `At your best, you've learned to bring the light all the way down — translating vision into action, inspiration into structure, hope into a specific next step. You stay luminous in a way that's functional rather than fugitive. You can be genuinely hopeful about the world while staying honest about what it currently is. The hope isn't a defense against reality — it's something to work toward within it.`,

    masculine_feminine: `This is deeply feminine in its primary expression for you — receptive, renewing, healing, inspirational. The masculine integration you need is the ability to structure the hope, commit the vision to specific action, build something that carries the light instead of just emitting it. Without that, the gift evaporates before it reaches anyone.`,

    money_power: `You often have a complicated relationship with material success — either deeply generous to the point of financial instability, or avoiding financial ambition because it feels incompatible with your luminous self-image. What you need to learn is that grounding your gifts in structures that generate real financial capacity isn't a betrayal of your nature. It's how the light actually reaches people.`,

    integration: `Your vision isn't complete until it has a specific, timed, committed action attached to it. The belief worth shifting: "The vision is enough" into "The vision is only the beginning. The embodiment is the work." The behavior: take your most held, longest-running vision and attach a specific, concrete first action to it. Do it before the end of this week.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 18,
    name: 'The Moon',
    keywords: ['unconscious', 'illusion', 'fear', 'emotional depth'],

    identity: `Your inner world is enormous and largely ungoverned by logic. You feel things other people can't quite name, pick up on undercurrents with no obvious source, and hold a relationship with your own unconscious that's simultaneously your greatest asset and your most significant source of suffering. This energy doesn't produce clear answers or straight lines. It produces depth, intensity, and a sometimes overwhelming awareness of what lives beneath the surface — in yourself, in others, in rooms, in relationships.`,

    origin: `This pattern develops in environments where emotional reality was uncertain or unsafe — an unpredictable atmosphere, people saying one thing and meaning another, or your own emotional experience getting consistently denied or distorted. Your nervous system became exquisitely tuned to the emotional undercurrent as a survival strategy. The cost is a mind that sometimes struggles to distinguish what's real from what it's projecting.`,

    shadow: `In shadow, you get consumed by anxiety, projection, and self-generated illusion. You see threat where there is none, build emotional narratives with no basis in actual events, and then respond to the narrative as if it were reality. At its worst: paranoia, an inability to trust your own perception, cycles of fear-based behavior that create the exact outcomes you were afraid of. The shadow version confuses depth with insight — but depth and accuracy aren't the same thing.`,

    healthy: `At your best, you've developed genuine emotional intelligence — the ability to navigate the unconscious without being submerged by it. You've learned to tell the difference between intuition (accurate) and anxiety (projection). You can sit with uncertainty, emotional complexity, and the not-yet-clear without needing to resolve it prematurely into a story. Your depth is a genuine resource: you see and feel what others miss.`,

    masculine_feminine: `This is a deeply feminine energy for you — fluid, cyclical, unconscious, emotionally resonant. The masculine integration you need is the ability to bring structure and discernment to the emotional material — not to control the feeling, but to think clearly within it. Without that, the emotional depth has nowhere to go and no way to be useful.`,

    money_power: `Your financial life often mirrors your unconscious cycles — inexplicable fluctuations, decisions driven by fear or emotional undercurrent rather than rational assessment. You're particularly susceptible to financial decisions made from anxiety instead of clarity. The discipline worth building: is this decision coming from what I know, or from what I fear?`,

    integration: `Try learning to distinguish between what you feel and what's true. Not all emotional intelligence is accurate intelligence. The belief worth shifting: "What I feel is what is real" into "What I feel is important data that still requires honest examination." The behavior: the next time you're certain of something based on feeling, pause and ask what evidence exists independently of your emotional state. Update your position accordingly.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 19,
    name: 'The Sun',
    keywords: ['vitality', 'joy', 'clarity', 'authentic expression'],

    identity: `There's something essentially life-giving about you — an energy that makes other people feel more alive, more possible, more themselves. You have a quality of presence that, at its best, isn't performed but simply is. Here's the part most people with this energy don't say out loud: it's exhausting to maintain when the light you're giving off doesn't feel connected to what you're actually experiencing inside. The performance of positivity and the genuine expression of it look identical from the outside. From the inside, only one of them is real.`,

    origin: `This pattern often develops in environments where your natural vitality and expressiveness were welcomed and depended on — where you became the light of the family, the energy in the room, the person whose visibility made everyone else more comfortable. Over time, shining can become a role rather than a state, and the performance of brightness can grow so habitual that you lose access to the authentic vitality underneath it.`,

    shadow: `In shadow, you need constant validation of your light. You perform positivity as a way of managing how others see you, which means genuine feelings — grief, fear, complexity, ambivalence — start to feel like threats to your identity. There's often deep vulnerability underneath the radiance that's never been allowed to exist publicly, because the risk feels too great: what if people only love the sun version, not the whole person?`,

    healthy: `At your best, you radiate from genuine fullness, not from a compulsion to maintain a certain image. You can be fully present in joy and fully present in difficulty without the difficulty threatening your core. You let people see you when you're not luminous, which paradoxically makes your light more trustworthy and more connecting. Real vitality isn't constant. It's renewable.`,

    masculine_feminine: `This is primarily a masculine archetype in its energy for you — clear, outward, radiant, directed. The feminine integration is letting your inner life — the cycles, the darkness, the rest — become part of what you express instead of hiding behind the light. Once you integrate the feminine, your light gets warmer, more complex, and ultimately more sustaining.`,

    money_power: `You often have genuine capacity for financial success, but it can get complicated by the gap between your performing self and your real self. If success was built on the performed version, there's often an underlying fear that the real person couldn't sustain it. Or the opposite: giving away resources to maintain the "generous, luminous" identity at the expense of actual financial stability. You need to earn and hold wealth as your whole person, not just the bright one.`,

    integration: `Let people see you when you're not shining. Not as vulnerability-performance — as a genuine sharing of what your actual experience is. The belief worth shifting: "If I show the difficult parts, I lose what makes me valuable" into "The people who matter want access to all of me, not just the easy part." The behavior: share something genuinely difficult with someone who only knows your bright side. See what it does.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 20,
    name: 'Judgement',
    keywords: ['reckoning', 'awakening', 'accountability', 'rebirth'],

    identity: `Honest self-assessment is both a gift and a perpetual source of difficulty for you. You can see yourself clearly — your patterns, your failures, your contradictions — with unusual precision. That gives you real self-awareness and genuine accountability. It also means you're capable of a level of self-judgment most people never subject themselves to. This energy is designed for honest reckoning. Its shadow is when reckoning turns into punishment.`,

    origin: `This pattern develops in environments where self-examination was used as a form of control — where constant self-monitoring and accountability were expected to produce safety, love, or belonging. You learned to internalize the judgment before it ever arrived from outside. Often this gets experienced as conscientiousness or responsibility. Underneath the surface, it's vigilance. Underneath that: the belief that if you judge yourself first, you can stop others from judging you worse.`,

    shadow: `In shadow, you can't forgive yourself. You rehearse failures, rerun past decisions, keep a permanent internal record of everything you've gotten wrong, and unconsciously punish yourself through the ongoing quality of your own choices. You might be very forgiving of others while being genuinely merciless with yourself. There's also the reverse — projecting the judgment outward, becoming highly critical of others as a way of getting ahead of it.`,

    healthy: `At your best, you've developed genuine accountability without punishment — the ability to look honestly at what's passed, take full responsibility for your role in it, make whatever repair is possible, and genuinely release it. You understand reckoning isn't an end state, it's a process. And you understand you can't awaken to your full capacity while still using your self-awareness as a weapon against yourself.`,

    masculine_feminine: `This requires both the masculine capacity for honest assessment and the feminine capacity for compassion and forgiveness. The most common imbalance is masculine excess — precision without mercy, accountability without tenderness. Integration means developing the ability to see everything clearly and respond to it with the same generosity you'd offer someone you genuinely love.`,

    money_power: `You often have a strong financial conscience but a complicated relationship with financial success. You may experience cycles of financial reckoning — periods where old decisions come due. Worth watching: unconsciously limiting your financial growth as a form of ongoing self-punishment for past mistakes. Worth sitting with: have you financially "paid" for the mistake long enough? Is the limitation still serving atonement, or has it become habit?`,

    integration: `You're allowed to be finished with it. The belief worth shifting: "If I release the judgment of myself, I'll repeat the pattern" into "I can be fully accountable and also fully forgiven — these aren't opposites." The behavior: identify one past decision you're still actively penalizing yourself for. Write down what you actually learned from it. Then close the file.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 21,
    name: 'The World',
    keywords: ['completion', 'wholeness', 'mastery', 'integration'],

    identity: `You've been working toward a sense of arrival — a feeling of completion, of having genuinely done something, of being whole rather than perpetually in process. You may have had moments of it: brief, unmistakable experiences of everything being exactly as it should be. But for you, the finish line keeps moving, the arrival keeps receding, and wholeness feels perpetually almost-there. This energy is about completion. Its shadow is a compulsion to never quite finish.`,

    origin: `This pattern develops in environments where completion was either never celebrated, constantly moved, or implicitly forbidden — where arriving looked like complacency, and there was always one more thing required before you were enough. You internalized the endless horizon as normal, and now you move it yourself whenever the destination comes into view. The search for wholeness became an identity because wholeness itself started to feel unsafe.`,

    shadow: `In shadow, you pursue completeness relentlessly while unconsciously ensuring you never actually reach it. You add one more requirement before you can call it a success, one more qualification before you're ready, one more thing to fix before the relationship can be fully accepted. That's not ambition — it's a form of self-protection: if you never arrive, you can never be found wanting once you get there. Perfectionism is this energy's shadow.`,

    healthy: `At your best, you know how to complete things — consciously, deliberately, with full presence. You can celebrate what's been built without immediately pivoting to what's next. You understand completion isn't the end of growth, it's the moment that makes the next beginning possible. You inhabit the present achievement instead of either clinging to it or immediately evacuating it for the next goal.`,

    masculine_feminine: `This asks for both polarities in their most mature forms: the masculine capacity to execute, complete, and claim what's been built, and the feminine capacity to receive, inhabit, and celebrate what is. The most common imbalance is executing without receiving — reaching the completion and then immediately moving past it before it can actually land.`,

    money_power: `You often have strong capacity to build to a point, followed by a pattern of moving the success threshold just before you reach it. You may have experienced near-arrival financially multiple times — almost at the number, almost at the stability — followed by circumstances or choices that reset the process. Worth examining: what happens right before that threshold? What are you doing in that moment, or not doing?`,

    integration: `Declare one thing complete. Not perfect — complete. The belief worth shifting: "I am not there yet" into "There is a version of 'there' I can reach, and it's enough to honor." The behavior: identify something in your life that's genuinely finished but that you haven't acknowledged as finished. Acknowledge it. Celebrate it in whatever way feels real. Then let it be done.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 22,
    name: 'The Fool',
    keywords: ['new beginnings', 'trust', 'spontaneity', 'the leap'],

    identity: `You make leaps. Not always impulsive ones — though sometimes those too — but genuine, committed steps into the unknown, into new territory with no guarantee attached. You carry a quality of beginner's mind that lets you approach things without the weight of accumulated expectation. That's your most significant gift and your most significant liability: the same openness that lets you begin anything also lets you abandon it before it's had time to become anything real.`,

    origin: `This pattern often develops in response to environments that were either highly restrictive, where the leap became your only available expression of freedom, or highly unstable, where new beginnings were the only constant. Either way, you developed a deep comfort with starting and a complicated, often avoidant relationship with the middle — the part after the exciting beginning and before actual completion.`,

    shadow: `In shadow, you live in perpetual beginning. You move through relationships, projects, places, and identities with a kind of restless lightness that looks like freedom but functions as avoidance. The question underneath it: "what am I when the excitement is gone?" There's also a spiritual-bypass version of this shadow — using the language of trust, flow, and surrender to avoid the specific, uncomfortable work the current moment actually requires.`,

    healthy: `At your best, you've learned genuine trust includes trusting the process through the difficult middle, not just the exhilarating beginning. You can begin, continue, and complete, bringing the same openness and lack of protective calculation to all three phases. You leap, and you commit to what you land in. Your freshness isn't naivety — it's a choice you make with full knowledge of what's come before.`,

    masculine_feminine: `You sit at the threshold of both — pure potential before masculine and feminine even divide into direction. Your integration work is developing the masculine capacity for commitment and sustained direction alongside the feminine capacity for receptivity and flow. Once you integrate both, you can be open and committed, free and present, spontaneous and actually showing up.`,

    money_power: `Your financial life often mirrors the leap-and-not-land pattern — strong income potential in new projects, followed by a loss of interest before the project becomes financially productive. There may be a history of excellent starts and inconsistent follow-through. Your financial discipline isn't about controlling the leap — it's deciding in advance what "staying" looks like, and committing to it before the excitement fades.`,

    integration: `The commitment is the leap. Not the start — the staying. The belief worth shifting: "Real freedom is always having the option to leave" into "Real freedom is being fully present in the thing I chose." The behavior: identify the thing you've already begun that most deserves your continued presence. Give it three months of consistent engagement without evaluating whether it's still working. Be there.`,
  },
];

// ── Lookup by number ─────────────────────────────────────────────────────────
function getArcana(number) {
  const a = ARCANA.find(a => a.number === number);
  if (!a) throw new Error(`No arcana found for number ${number}. Range is 1–22.`);
  return a;
}

// ── Generate a full reading for a matrix position ────────────────────────────
// positionLabel : e.g. 'A', 'G', 'firstPurpose'
// value         : the arcana number (1–22)
// Returns a structured object ready for display
function readPosition(positionLabel, value, positionNote) {
  const arcana = getArcana(value);
  return {
    position: positionLabel,
    note: positionNote,
    arcana,
    // Convenience flat fields for the UI
    number: arcana.number,
    name: arcana.name,
    keywords: arcana.keywords,
    sections: {
      identity:           arcana.identity,
      origin:             arcana.origin,
      shadow:             arcana.shadow,
      healthy:            arcana.healthy,
      masculine_feminine: arcana.masculine_feminine,
      money_power:        arcana.money_power,
      integration:        arcana.integration,
    },
  };
}

// ── Generate readings for all key positions in a matrix ──────────────────────
function readMatrix(matrix) {
  const out = {};
  // Core personal positions
  for (const [key, pos] of Object.entries(matrix.positions)) {
    out[key] = readPosition(key, pos.value, pos.note);
  }
  // Purposes
  for (const [key, pos] of Object.entries(matrix.purposes)) {
    out[key] = readPosition(key, pos.value, pos.note);
  }
  // Axes
  out.Sky   = readPosition('Sky',   matrix.axes.Sky.value,   matrix.axes.Sky.note);
  out.Earth = readPosition('Earth', matrix.axes.Earth.value, matrix.axes.Earth.note);
  return out;
}

// ── Export ───────────────────────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ARCANA, getArcana, readPosition, readMatrix };
} else {
  window.DMArcana = { ARCANA, getArcana, readPosition, readMatrix };
}
