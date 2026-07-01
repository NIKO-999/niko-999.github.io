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

    identity: `You are someone who enters a room and shifts its energy without trying. You have an almost compulsive drive to begin things — ideas fire fast, your mind works at speed, and you can make almost anything happen when you decide to. The problem is you know this about yourself, which means you also know when you're performing it versus when it's real. That gap — between what you can do and what you're actually choosing to do — is the source of most of your internal friction.`,

    origin: `This pattern begins in an environment where your competence was the ticket to safety or love. You learned early that doing, fixing, impressing, or initiating earned you a place. So the nervous system wired agency as survival. Stopping, resting, or not knowing became unconsciously dangerous — even today, idleness can feel like a threat you can't quite name.`,

    shadow: `The shadow Magician manipulates. Not maliciously always, but strategically — moving people and situations like pieces to achieve a desired outcome. There is a tendency to start many things and quietly abandon them when the initiatory excitement fades, leaving a trail of half-built projects and underdelivered promises. Worst version: using charm and capability to distract others (and yourself) from the fact that nothing of depth is actually being built.`,

    healthy: `The healthy Magician is someone with genuine creative force who has learned to direct it. They don't just spark — they see things through. Their intelligence serves a purpose beyond their own stimulation. They understand that real power is not in doing many things but in being the person who can do the one right thing at the right moment with full commitment.`,

    masculine_feminine: `This archetype has a strongly overactive masculine expression — direction, initiation, doing. The integration work is in developing the feminine: receptivity, patience, allowing things to arrive rather than forcing them. The Magician who hasn't integrated the feminine will burn through people and situations because they never learned to receive.`,

    money_power: `High capacity to generate, but often erratic. Can produce money quickly and lose it just as fast because the nervous system is wired for initiation, not stewardship. There may be unconscious fear that having too much power makes you visible, and visible means accountable — so you self-sabotage just before the threshold of real arrival. Watch for cycles of almost-making-it followed by a sudden reversal.`,

    integration: `Stop performing competence and start choosing depth. Commit to one thing long enough to see what it becomes when you stop finding it exciting. The internal belief that must shift is: "I must always be capable" → "I am allowed to not know." The behaviour that anchors the higher version: finishing what you start, even when the novelty is gone.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 2,
    name: 'The High Priestess',
    keywords: ['intuition', 'inner knowing', 'mystery', 'stillness'],

    identity: `You process the world in a way most people can't see and can't follow. You read subtext, you sense what isn't said, you know things before they're proven — and this gift has made you both profoundly perceptive and chronically misunderstood. You've likely spent a significant portion of your life either hiding your depth to avoid overwhelming people or revealing it too fast and watching them retreat. The result is a pattern of emotional self-containment that feels like protection but functions as isolation.`,

    origin: `You learned early that the full expression of your inner world — your feelings, your perceptions, your knowing — was not safe or welcome. Perhaps it was dismissed, ridiculed, or simply never met with the depth it deserved. So you went inward. You built an extraordinarily rich interior life because the exterior wasn't large enough to hold you. The price: a growing gap between who you are inside and who you allow people to see.`,

    shadow: `The shadow High Priestess withholds — not always intentionally, but systematically. They create emotional distance through mystery, keeping people just far enough away to never be truly seen, and therefore never truly hurt. There is also a tendency toward passive guidance: knowing what needs to happen but never quite saying it, then feeling resentful when others don't pick up the signal. Worst case: paralysis — so much inner sensing that action becomes impossible.`,

    healthy: `The healthy High Priestess has learned to trust their knowing enough to act on it. They are deeply intuitive but not frozen by that intuition. They speak their perception with grounded confidence rather than cryptic suggestion. They have learned that being truly seen by the right people is not a risk — it is the point.`,

    masculine_feminine: `This archetype is deeply, sometimes exclusively feminine in its energetic expression. The masculine — structure, boundaries, direct speech, decisive action — is often underdeveloped or rejected. Integration means learning to channel the deep knowing into direct, actionable communication, and to say clearly what the inner world has already understood.`,

    money_power: `Financial behaviour tends to be inconsistent and intuition-driven in ways that don't always translate to strategy. The High Priestess may know what they want but struggle to build the structured systems required to hold wealth. There is often an unconscious belief that money is somehow incompatible with depth or spirituality — a conditioning that must be identified and consciously dismantled.`,

    integration: `Stop making people earn access to your real self as a test of worthiness. That strategy protects you but it also guarantees loneliness. The internal belief that must shift is: "My depth is too much for most people" → "The right people have been waiting for me to stop hiding." The behaviour: speaking the first truthful thing, directly, before you have time to qualify it into nothing.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 3,
    name: 'The Empress',
    keywords: ['creation', 'abundance', 'nurturing', 'generativity'],

    identity: `You are someone through whom things grow. People feel more alive around you. You have an instinctive capacity to create environments — physical, emotional, relational — where others can expand. You are generous, often extravagantly so, and you take deep pleasure in the flourishing of those around you. But somewhere underneath the giving is a question you've been afraid to ask directly: does anyone give like this back to me? And underneath that: do I believe I deserve it?`,

    origin: `The Empress pattern often forms in environments where love was conditional on what you provided — care, beauty, harmony, emotional support. You learned that your value was tied to your generosity. This created a loop: giving feels good and safe, receiving feels uncomfortable and even suspicious. Over time, the capacity to receive — truly receive, without immediately reciprocating — atrophies.`,

    shadow: `Shadow Empress gives to control. The generosity, below the surface, has strings attached — not necessarily consciously, but structurally. When the giving isn't appreciated, they collapse or become quietly resentful. There is a tendency to define self-worth through productivity and creation, which means rest feels like worthlessness. In relationships: a pattern of nurturing people who cannot or will not nurture back, and calling it love.`,

    healthy: `The healthy Empress is genuinely generative — they create and give because it flows from abundance, not from a deficit that needs filling. They can receive with full presence. They understand that their self-worth is not located in what they produce or provide. They create from fullness, not from fear.`,

    masculine_feminine: `This is a deeply feminine archetype — creation, flow, emotional nourishment. The shadow feminine here is over-giving, losing the self in service to others. The masculine integration required is the ability to set clear boundaries, to say no without guilt, to direct the creative force rather than simply releasing it toward whoever is nearest.`,

    money_power: `Complicated relationship with money — often either highly abundant and generous to the point of financial instability, or subconsciously blocking abundance because deep down there is a belief that wanting more is selfish. The core wound: believing that financial abundance might change how people see you, or that it would make you somehow less connected to others. Untrue, but deeply embedded.`,

    integration: `Stop taking responsibility for other people's emotional states. That is not generosity — it is control wearing the costume of love. The internal belief that must shift is: "My worth is what I provide" → "I am enough when I provide nothing." The behaviour: practise receiving a compliment, a gift, or help without immediately deflecting or reciprocating. Let yourself be given to.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 4,
    name: 'The Emperor',
    keywords: ['structure', 'authority', 'stability', 'legacy'],

    identity: `You are someone who naturally organises things — people, systems, environments, ideas. You have a deep need for order, and when order is absent you feel a low-grade but persistent anxiety that rarely fully resolves. You are capable, responsible, and reliable in a way that most people around you depend on. You carry a lot. You always have. The question no one asks the Emperor — and that you rarely ask yourself — is: who carries you?`,

    origin: `This pattern typically forms in a family system where structure was absent and you stepped in, or where structure was oppressive and you either internalised it or rebelled against it and then reproduced it. Either way, you learned that if you don't take charge, things fall apart. The nervous system concluded: control is safety. Vulnerability is exposure. Emotion is disorder.`,

    shadow: `The shadow Emperor is rigid and controlling. They build walls disguised as systems. They are deeply uncomfortable with anything that cannot be categorised, managed, or predicted — which ultimately means they are uncomfortable with other people's full humanness, including their own. There is often a suppressed emotional world beneath the structured exterior that has never been given permission to exist. Worst case: tyranny — imposing structure on others as a way of managing internal chaos.`,

    healthy: `The healthy Emperor builds things that outlast them. Their authority comes from genuine competence and trustworthiness, not from fear-based control. They have learned to let their emotional world exist alongside their structural mind, not instead of it. They protect without smothering. They lead without dominating. They understand that real stability is internal, not external.`,

    masculine_feminine: `This is a strongly masculine archetype — structure, authority, discipline. The integration work is in learning to feel without immediately fixing or restructuring the feeling. The Emperor who has integrated the feminine knows when to hold the structure and when to let it dissolve. They are strong enough to be soft.`,

    money_power: `Typically high financial capacity, but money is often tied to identity and status in a way that creates anxiety. The fear of losing financial stability can drive overwork and rigidity. There may be difficulty in spending on pleasure or anything that doesn't produce a measurable return — because the nervous system has never fully learned that enjoyment is not irresponsibility.`,

    integration: `Stop treating your emotional world like a management problem. Feelings are not inefficiencies. The internal belief that must shift is: "If I am not in control, everything collapses" → "Others are capable, and I am allowed to rest." The behaviour: delegate something genuinely important and resist the urge to check on it. Let someone else carry something. See what happens.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 5,
    name: 'The Hierophant',
    keywords: ['wisdom', 'tradition', 'guidance', 'belonging'],

    identity: `You are a seeker of meaning who needs their understanding to mean something to others. You have a deep need to belong to something larger than yourself — a system, a tradition, a framework — and an equally deep need to transmit what you've learned. Teaching, guiding, explaining: these are not just things you do, they are how you make sense of your own existence. The friction comes when the system you've inherited conflicts with what your direct experience has taught you, and you have to choose between belonging and truth.`,

    origin: `The Hierophant pattern forms in environments where belonging required conformity — where asking the wrong questions or stepping outside the established framework had social or emotional consequences. You learned that there is safety in shared belief systems, and you've been building or inhabiting them ever since. The instinct toward tradition is a survival mechanism that became a worldview.`,

    shadow: `The shadow Hierophant enforces rules they no longer believe in, out of fear of the chaos that might follow if the structure were questioned. They can become dogmatic, not from conviction but from anxiety — the doctrine is load-bearing and if it falls, what remains? There is also a shadow version that constantly seeks authorities to defer to, perpetually in search of someone who knows better, never trusting their own direct experience.`,

    healthy: `The healthy Hierophant has done the difficult work of separating genuine wisdom from inherited conditioning. They know which parts of the system they belong to are actually true, and they can hold those parts with conviction while honestly discarding what no longer serves. They are able to transmit genuine insight without requiring agreement. Their guidance comes from a place of integrated knowing, not institutional authority.`,

    masculine_feminine: `This archetype carries strong masculine energy in its healthy form — clear transmission, principled guidance, structured wisdom. The shadow feminine infiltration here is seeking approval for one's beliefs from external authorities, never fully trusting direct experience. Integration requires developing the courage of inner knowing alongside the discipline of outer systems.`,

    money_power: `Money and ethics are closely entangled for this archetype. There is often an unconscious belief that financial success in ways that deviate from tradition or expectation is somehow wrong or destabilising. This can produce either rigid financial conservatism or a complicated relationship with wealth that feels morally ambiguous. The work is separating financial capacity from inherited moral frameworks around what is "acceptable" success.`,

    integration: `Stop outsourcing your authority to systems, traditions, or the approval of others. The system you have been given is not the whole truth — it is a starting point. The internal belief that must shift is: "If I question the framework, I lose my people" → "My real people are those who can handle my honest questioning." The behaviour: form one opinion publicly that contradicts something you have previously defended.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 6,
    name: 'The Lovers',
    keywords: ['choice', 'values', 'alignment', 'relationship'],

    identity: `You are someone for whom relationships are not optional — they are the medium through which you understand yourself. You think in relation, feel in relation, define yourself in relation. This gives you extraordinary capacity for connection and an equally powerful vulnerability to losing yourself inside it. The central tension of your life is between the pull toward deep union and the pull toward your own distinct identity — and you have probably swung between these poles more than once, often painfully.`,

    origin: `The Lovers pattern develops in environments where love and identity became confused early. Perhaps love was conditional on certain kinds of behaviour, or the relational field was chaotic enough that you learned to shape yourself to whatever was needed to maintain connection. The result is a person who is deeply relational but not always sure — beneath all that relating — who they actually are when no one is looking.`,

    shadow: `The shadow Lovers avoids genuine choice. They keep options open, stay in ambivalence, and commit just enough to feel connected but never enough to be truly responsible. This is not indecisiveness for its own sake — it is a deep fear that making a real choice means losing something or someone, and that the loss will reveal a self that isn't enough on its own. Worst version: chronic compromise of values for the sake of connection, justified as love.`,

    healthy: `The healthy Lovers has done the work of clarifying their own values so clearly that their choices become obvious, even when painful. They can be fully in relationship without losing themselves. They understand that real intimacy requires two distinct, complete people — and that the most generous thing they can offer another person is their own uncompromised self.`,

    masculine_feminine: `This archetype lives in the tension between masculine (individual direction, autonomous choice, defined values) and feminine (connection, merger, relational flow). The integration work is in holding both simultaneously — to be both fully present in relationship and fully yourself within it. Neither cancels the other. This is the hardest thing the Lovers learns.`,

    money_power: `Financial decisions are strongly influenced by relational dynamics — spending for love, avoiding success for fear it will disrupt connection, making financial choices based on what maintains harmony rather than what serves real goals. The core pattern to examine: where are you limiting your financial growth to stay within a relational comfort zone?`,

    integration: `Stop treating your own preferences as negotiable. Every time you compromise your real preference for the sake of connection, you train yourself and the other person that your preferences don't matter. The internal belief that must shift is: "Having my own needs will drive people away" → "The right people are drawn to the clarity of who I actually am." The behaviour: state a real preference and let the other person respond to it without adjusting your answer based on their reaction.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 7,
    name: 'The Chariot',
    keywords: ['direction', 'will', 'mastery', 'forward movement'],

    identity: `You are someone who needs to be going somewhere. Not busy for the sake of it — but genuinely moving toward something, with a clear destination and a sense of momentum. When you have direction, you are almost unstoppable. When you don't, you feel a restlessness that can be mistaken for ambition but is actually closer to existential anxiety: without forward movement, you don't quite know who you are. The Chariot's deepest question is not "where am I going?" It is "who am I when I'm not moving?"`,

    origin: `This pattern often forms in environments where stillness was unsafe or where achievement was the currency of love. You learned to associate forward movement with safety, worth, or identity. You've been in motion ever since. The nervous system knows how to drive; it has much less practice with being still and trusting that what you've already built is enough.`,

    shadow: `The shadow Chariot controls everything — the pace, the outcome, the route — and calls it discipline. They can steamroll people and situations in the service of their goal without registering the damage, because the goal justifies the means. There is often a profound disconnection from emotions that slow the momentum — grief, vulnerability, tenderness — because these are experienced as threats to the forward trajectory. Worst case: winning at everything except the things that actually matter.`,

    healthy: `The healthy Chariot has learned to harness both their drive and their inner life as a unified force. They move with purpose but not rigidity. They know when to accelerate and when to stop and take stock. They have earned the right to their momentum because they have also done the work of knowing what they are really trying to reach, and why.`,

    masculine_feminine: `This is a strongly masculine-energy archetype. The shadow is the suppression of the feminine — emotion, receptivity, surrender — in the service of forward motion. The integration work is in recognising that receiving, softening, and feeling are not detours from the journey. They are fuel for it. The Chariot that has integrated the feminine moves faster because it carries less suppressed weight.`,

    money_power: `Strong earning capacity, but relationship with money mirrors the relationship with everything else: it must be controlled. There may be a pattern of over-accumulation without enjoyment, or an inability to stop and actually inhabit the success that has been built. The question to examine: is the financial driving in service of a life, or is it a substitute for one?`,

    integration: `Stop treating pause as failure. The thing you are most afraid to do — stop, not know, not be moving — is exactly what the next stage requires. The internal belief that must shift is: "I am what I achieve" → "I exist completely even when I am achieving nothing." The behaviour: take one full day with no goals, no productivity, and resist the urge to manufacture urgency. Notice what comes up.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 8,
    name: 'Strength',
    keywords: ['courage', 'patience', 'inner power', 'taming instinct'],

    identity: `You possess a quiet, sustained power that most people only access in emergencies. You can hold things together under pressure in a way that feels almost effortless — because you've done it so many times, it has become second nature. But the cost is that you have trained yourself to never really let the pressure show. You are the person others lean on. Rarely the person you allow yourself to lean on anyone else. What they see as strength is partly genuine, partly a very old decision not to need.`,

    origin: `This pattern forms in environments where expressing weakness or need had consequences — being dismissed, overwhelmed others, or simply went unmet for so long that needing felt futile. You learned to manage your own emotional world silently. You developed a remarkable internal resilience, but alongside it, a quiet belief that your needs are too much or not valid enough to voice.`,

    shadow: `The shadow Strength suppresses instinct in the name of control. Not just the instincts of anger or desire — but the animal intelligence of the body: its tiredness, its grief, its joy, its alarm signals. The shadow version can also use their patient endurance as a form of superiority: "I don't complain" can become "I am better than those who do." Worst case: rage that has been compressed for so long that when it finally moves, it cannot be directed.`,

    healthy: `The healthy Strength archetype has genuine, earned power — not the brittle control of someone who is afraid to feel, but the deep resilience of someone who has been through things and knows they can survive them. They can be genuinely gentle because they're not afraid of their own force. They can ask for help because they know their strength doesn't require the performance of never needing anything.`,

    masculine_feminine: `Strength sits at the intersection of both polarities — the capacity to hold power (masculine) with the capacity to do so through gentleness and compassion rather than force (feminine). The integration work is in learning that gentleness is not weakness and force is not strength. Real power does not grip. It holds.`,

    money_power: `Typically capable financially but often underearns relative to actual output and value provided, because asking for what they're worth requires the same vulnerability as asking for anything else. There is frequently a pattern of doing more than is expected and then resenting not being recognised or compensated adequately — when the real issue is not having asked clearly for what was needed.`,

    integration: `Stop performing unbreakability. It is keeping people from knowing you, and it is slowly breaking you. The internal belief that must shift is: "Needing is weakness" → "Being genuinely known, including in my needs, is what creates real connection." The behaviour: tell one person something you actually need this week. Not a preference — a real need. See if the world ends.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 9,
    name: 'The Hermit',
    keywords: ['wisdom', 'solitude', 'inner lantern', 'the guide'],

    identity: `You are a person who needs significant time alone — not because you dislike people, but because the external world is loud and your internal world is where the real work happens. You have accumulated, often through significant difficulty, a depth of understanding that feels genuinely hard to share because most conversations seem to operate at a level that doesn't quite touch what you carry. The result is a particular kind of loneliness: not being unseen, but being un-met.`,

    origin: `This pattern typically develops through early experiences of disappointment in the relational world — either because the environment couldn't hold your depth, or because connection repeatedly came with conditions you couldn't meet without losing yourself. Solitude became the solution. The Hermit's inner life expanded to fill the relational space that felt too unsafe or too shallow to inhabit.`,

    shadow: `The shadow Hermit mistakes isolation for wisdom. They withdraw not to integrate and return, but to avoid — the messiness of real relationship, the vulnerability of being wrong in front of others, the discomfort of having their perceptions challenged. There is often a hidden arrogance: a belief that others simply can't understand, which protects them from the scarier possibility that they simply haven't risked being understood.`,

    healthy: `The healthy Hermit goes inward to fill themselves up and then genuinely returns — with something to offer, not just something to protect. Their solitude is generative. Their wisdom is earned and therefore real, not just accumulated and hoarded. They can be with people without losing themselves because their inner world is stable enough to not be threatened by the outer one.`,

    masculine_feminine: `This archetype tends toward a closed energetic loop — neither strongly masculine nor feminine in expression, but self-sufficient. The integration work is in opening the loop: allowing both giving and receiving to move through the self rather than maintaining the hermetically sealed internal world. Wisdom that is never shared is not wisdom. It is just knowledge.`,

    money_power: `Complex relationship with material success, often because success requires engagement with the external world in ways that feel draining or compromising. There is sometimes a belief that financial ambition is incompatible with depth or integrity. The Hermit must examine whether their relationship with money is genuinely values-aligned, or whether the disengagement from financial pursuit is another form of avoidance.`,

    integration: `Your wisdom is not complete until you risk offering it. The internal belief that must shift is: "No one can really understand what I carry" → "I haven't yet found the right way to offer it." The behaviour: share the thing you know most deeply with one person who hasn't asked for it, without waiting until you've refined it to perfection. Let it be imperfect. Let them respond.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 10,
    name: 'Wheel of Fortune',
    keywords: ['cycles', 'change', 'karma', 'turning points'],

    identity: `You are a person who understands — sometimes painfully — that life moves in cycles that no amount of effort fully controls. You've likely had experiences of sudden, dramatic change: moments where everything shifted, the rug pulled out, or a door opened that you didn't even know you were standing in front of. The Wheel archetype means your life is designed to rotate — comfort followed by disruption, disruption followed by unexpected opportunity — whether you choose it or not. The question is whether you participate consciously or get carried.`,

    origin: `This pattern forms in environments marked by instability or unexpected change — where the predictable was unreliable and the person learned to brace for the wheel's next turn. Alternatively, it can form through an unusually dramatic personal turning point early in life that rewired the understanding of how quickly and completely things can change. Either way, the Wheel archetype carries a fundamental experience of impermanence.`,

    shadow: `The shadow Wheel of Fortune develops victim consciousness — the belief that life is something that happens to them, that cycles are external forces they have no agency over. There is a tendency to outsource responsibility to fate, luck, timing, or other people's choices. They wait for the wheel to turn rather than understanding that their own consciousness and choices are what determines what rises and what falls.`,

    healthy: `The healthy Wheel of Fortune has developed a deep trust in cycles combined with genuine personal agency within them. They understand timing, they know when to move and when to let things settle, and they carry an almost serene relationship with change because they have learned that every rotation eventually rights itself. They are resilient not because things don't fall apart — but because they know how to rebuild.`,

    masculine_feminine: `This archetype sits in the dynamic tension between control (masculine) and surrender (feminine). The integration is in understanding which force is called for at each moment of the cycle — when to act and when to allow. The tendency is to overcorrect: either trying to control the uncontrollable or passively surrendering when action is what the cycle requires.`,

    money_power: `Financial life often mirrors the wheel itself — dramatic highs followed by significant lows, with a recurring theme of almost-arriving. The pattern to watch is the unconscious repetition: each cycle of loss is often preceded by the same choices, the same signals being ignored. The work is becoming conscious of the moment just before the wheel turns downward and asking: what am I not looking at right now?`,

    integration: `Stop treating every difficult phase as a sign that something has gone wrong. The internal belief that must shift is: "When things are good, something bad is coming" → "I am building the capacity to hold more, not just waiting for the fall." The behaviour: notice the next time you are in an upswing and consciously reinforce it rather than bracing against its end.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 11,
    name: 'Justice',
    keywords: ['truth', 'balance', 'accountability', 'integrity'],

    identity: `You have an acute sensitivity to fairness that operates almost like a physical sense. When something is unequal, untruthful, or out of balance, you register it immediately — in your body, in your emotional state, in a kind of quiet fury that builds until it is addressed or you have to find a way to contain it. You are the person who cannot let things go that others shrug off as "just the way things are." This is a gift that also costs you: relationships, ease, and an enormous amount of internal energy.`,

    origin: `The Justice pattern often develops in environments where actual fairness was absent — where the rules were applied inconsistently, where truth was sacrificed for convenience, or where the person experienced a significant injustice that was never acknowledged or resolved. The system became both the wound and the solution: if I can understand the rules of what is fair, I can prevent this from happening again.`,

    shadow: `The shadow Justice archetype becomes a judge — of others, of themselves, and most painfully of both simultaneously with different standards. They can be so committed to abstract fairness that they lose empathy for the human complexity of real situations. There is often a hidden perfectionism: a belief that if you yourself were entirely fair, honest, and balanced, you would somehow earn safety or love. This is the pursuit of an impossible standard disguised as integrity.`,

    healthy: `The healthy Justice archetype is genuinely honest — with themselves and with others — in a way that is useful rather than punishing. Their truth-telling comes from genuine care, not from a need to be right. They hold the balance not as an external standard to enforce, but as an internal reality they embody. They understand that real justice includes compassion and that real accountability includes the self.`,

    masculine_feminine: `Justice tends to lean heavily masculine in expression — clear, cold, rational, principle-driven. The integration work is in allowing the feminine into the equation: context, emotion, nuance, the specific human being in front of you rather than the abstract principle they represent. Real justice is not blind. It sees everything.`,

    money_power: `Often a complex relationship with money rooted in the belief that wealth is somehow inherently unequal or unfair, and therefore to be avoided, minimised, or distributed away. There may also be a pattern of working far harder than they are compensated for, driven by an unconscious belief that claiming financial worth is somehow unjust or "not fair to others." This is the Justice wound applied to the self.`,

    integration: `Stop holding yourself to a standard you would immediately recognise as cruel if applied to anyone else. The internal belief that must shift is: "I must be entirely accountable before I can ask for anything" → "Asking for what I need is not the opposite of fairness — it is part of it." The behaviour: identify one place where you are applying a different standard to yourself than to others. Correct it.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 12,
    name: 'The Hanged Man',
    keywords: ['suspension', 'new perspective', 'surrender', 'waiting'],

    identity: `You are someone who knows what it is to be in a liminal space — between what was and what will be, unable to move forward and unwilling to go back. You have experienced periods of profound suspension that felt like failure but functioned as transformation. The Hanged Man does not choose to hang — they are placed there by circumstance. But how they inhabit that suspension — whether with resistance and suffering or with genuine openness — determines everything about what comes next.`,

    origin: `This pattern typically develops through experience of forced stopping — illness, loss, failure, or circumstance that removed the option of forward motion and required a fundamental reorientation. The person learned, often painfully, that some forms of insight only come through involuntary pause. The wound is the belief that being suspended means being helpless. The gift is the perspective that no other position offers.`,

    shadow: `The shadow Hanged Man turns suspension into identity. They stay hung not because the situation requires it but because they have found that the position of willing sacrifice attracts a particular kind of care and attention. There is also a pattern of self-martyrdom — sacrificing genuine needs, desires, or direction in service of others or of some abstract ideal, then secretly waiting for recognition that doesn't come.`,

    healthy: `The healthy Hanged Man has learned that surrender is not weakness — it is the most advanced form of engagement with what is. They can pause without panicking. They can sit with not-knowing without manufacturing a false answer just to feel in control. They bring back something real from every liminal period — something that could not have been reached by pushing through.`,

    masculine_feminine: `This archetype inverts the typical masculine drive. The healthy integration here is in learning that stopping, receiving, allowing, and waiting — all deeply feminine energies — are not retreats from life but advances into it. The masculine shadow here is the compulsive pushing-through that bypasses the intelligence available only in stillness.`,

    money_power: `Often experiences involuntary financial suspension — periods of waiting, of resources not flowing, of efforts not producing results — that are experienced as failure but function as reorientation. The pattern to examine: what does the suspension keep trying to show you about the direction you were heading? The Hanged Man's financial life becomes coherent when the suspension is followed, not fought.`,

    integration: `Stop treating every period of stillness as something to escape. The internal belief that must shift is: "Nothing is happening, therefore I am failing" → "Something is being given to me that I can only receive if I stop trying to produce it." The behaviour: identify the one thing you keep rushing past. Sit with it for a full hour without doing anything about it. Notice what it tells you.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 13,
    name: 'Death',
    keywords: ['transformation', 'endings', 'release', 'transition'],

    identity: `You are not afraid of endings in the abstract — you may even welcome them. But in practice, there is something you cannot let go of, no matter how clearly you know it has ended. This is the paradox of the Death archetype: enormous capacity for transformation in principle, and an equally powerful unconscious resistance to it when it touches something you have identified with. The work of this number is not surviving endings. It is learning what you are when the thing you called yourself is gone.`,

    origin: `The Death pattern forms in environments where loss was either traumatising or never properly processed. Either way, the nervous system learned to grip what it has — relationships, identities, patterns, even suffering — because losing things without being able to mourn them properly leaves the psyche unable to complete the cycle. The holding-on is not stubbornness. It is incomplete grief.`,

    shadow: `The shadow Death archetype lives in the past — attached to versions of reality that have ended, identities that no longer fit, relationships that are done but not released. There is often a compulsive return to what was, dressed up as loyalty, love, or principle. Worst case: deliberately destroying things before they can leave, so at least the ending is controlled. Destruction as a defence against the grief of natural endings.`,

    healthy: `The healthy Death archetype has developed a profound and graceful relationship with change. They know how to end things consciously — relationships, chapters, habits, identities — and they know how to mourn what passes without needing to pretend it didn't matter. They understand that their capacity to release is exactly equal to their capacity for what's new. Nothing new enters without space being made.`,

    masculine_feminine: `Death requires both polarities working in concert: the masculine ability to cut clearly and decisively, and the feminine capacity to mourn, to feel the loss fully, and to receive what follows. The shadow is usually an imbalance — either cutting without mourning (masculine excess) or mourning without being able to cut (feminine excess). Integration is the complete cycle.`,

    money_power: `Financial patterns often involve holding onto situations, jobs, or revenue streams that have ended in terms of their alignment or growth potential, because the ending feels like loss rather than transition. Alternatively: dramatic financial endings as a way of forcing change when the self cannot choose it consciously. The question to examine: what financial structure in your life are you maintaining because you can't bear to let it end, even though you already know it's over?`,

    integration: `Identify what ended that you still haven't mourned. Not the thing you say you're over — the thing you haven't allowed yourself to feel was actually lost. The internal belief that must shift is: "Letting go means it didn't matter" → "Fully releasing what has ended is the deepest form of respect for what it was." The behaviour: consciously complete one ending that is still incomplete. Say goodbye to it. Out loud.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 14,
    name: 'Temperance',
    keywords: ['balance', 'integration', 'patience', 'the middle path'],

    identity: `You are someone who understands balance — in principle. You can see the extremes, identify where things have gone too far in one direction, and know what the middle path looks like. What is harder is inhabiting it consistently. You may move through phases of overcorrection — swinging from one extreme to another in relationships, habits, or self-understanding — all in search of the equilibrium you can see but find elusive to maintain. Temperance is not the absence of extremes. It is what's possible after you've inhabited both.`,

    origin: `This pattern develops in environments of imbalance — where emotional, relational, or material excess or deprivation was the norm, and the person learned to navigate by swinging between extremes because the middle was never modelled as a viable option. Or alternatively: environments where the middle was demanded so rigidly that the person never developed a genuine relationship with their own extremes.`,

    shadow: `The shadow Temperance avoids genuine emotion by processing everything into neutrality. They can be so committed to "not going too far in either direction" that they never fully feel anything, never commit fully to anything, and mistake management for integration. There is also a people-pleasing shadow: using balance and moderation as a way of never fully occupying their own position, always available to be adjusted.`,

    healthy: `The healthy Temperance archetype has earned their balance through the experience of both extremes, not through the avoidance of them. They are patient in a way that is grounded and generative — not passive or fearful. They can hold two opposing truths simultaneously. They integrate contradictions rather than collapsing them into a false neutrality. Their equilibrium is dynamic, not static.`,

    masculine_feminine: `Temperance lives in the relationship between the polarities — the integration of masculine and feminine, direction and flow, structure and surrender. The archetype's work is not in choosing a side but in developing the fluency to move between them appropriately. This is one of the most sophisticated psychological tasks: genuine integration that does not erase either pole.`,

    money_power: `Often has complex spending or saving patterns that oscillate between excess and restriction, both driven by the same underlying anxiety about what the "right amount" is. The Temperance archetype needs to develop a genuinely relaxed relationship with financial flow — neither hoarding nor burning through, but allowing money to move through a life that is itself in motion.`,

    integration: `Stop trying to get it perfectly balanced before you engage with it fully. The internal belief that must shift is: "I need to find the middle before I can commit" → "The middle is something I build through committing, not something I find before I do." The behaviour: fully commit to one position — in a relationship, a project, or a belief — for thirty days without hedging or adjusting based on the response.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 15,
    name: 'The Devil',
    keywords: ['shadow', 'bondage', 'unconscious drives', 'liberation'],

    identity: `You are someone intimately familiar with your own compulsions — the patterns that run you even when you can see them running. This isn't weakness; it is actually a form of self-knowledge. The Devil archetype does not mean you are ruled by darkness. It means your relationship with your own shadow is the central work of your life, and the degree to which you do that work determines how free or how trapped you feel. The chains are always there. What changes is whether you see them.`,

    origin: `The Devil pattern develops in environments where natural drives — pleasure, desire, anger, sexuality, ambition — were either shamed, suppressed, or modelled in their most destructive forms. What gets suppressed doesn't disappear; it goes underground and runs from there. The person becomes simultaneously fascinated by and afraid of their own intensity, their own desire, their own darkness.`,

    shadow: `The shadow Devil is controlled by what they will not look at. Addictions, compulsions, repetitive self-destructive patterns — these are not character flaws, they are symptoms of disowned psychology. There is often a significant gap between the self they present publicly and the reality of their private patterns. The shame of this gap itself becomes a driver of the compulsion: the more shameful it feels, the more it pulls.`,

    healthy: `The healthy Devil archetype has done the courageous work of turning toward their own darkness and sitting with what they find there without collapsing into self-loathing. They have integrated their shadow rather than eliminating it — understanding that what they were afraid of in themselves contains genuine power that, once owned, becomes extraordinary capacity. They are free not because the chains are gone, but because they can see them.`,

    masculine_feminine: `The Devil archetype requires the feminine capacity to accept and feel what is present without judgment — including the darkest contents of the psyche — and the masculine capacity to make clear, boundaried choices about which drives to act on and which to integrate without expressing. Shadow work without structure becomes indulgence. Structure without shadow work becomes rigidity.`,

    money_power: `Often has complex relationships with money tied to shame, secrecy, or compulsion. Financial patterns may include hidden spending, compulsive acquisition, or financial self-sabotage driven by an unconscious belief that they don't deserve real stability. Alternatively: using financial power as a form of control in relationships, which is itself a shadow expression. The work is in separating financial behaviour from shame.`,

    integration: `The specific shadow you are least willing to admit to yourself is the one with the most power over you. Naming it — to yourself, and to at least one other person who can hold it with you — is not weakness. It is the beginning of actual freedom. The internal belief that must shift is: "If people knew this about me, they would leave" → "The people who matter can hold this, and I can hold myself knowing it." The behaviour: say the thing you have never said out loud.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 16,
    name: 'The Tower',
    keywords: ['disruption', 'revelation', 'breakdown', 'breakthrough'],

    identity: `You have experienced — probably more than once — a sudden, complete collapse of something you built your stability around. A relationship, a career, an identity, a belief system. The Tower doesn't ask permission and it doesn't come with a warning. What it does come with is clarity: after the collapse, you can see exactly what was false in what you were building on. This archetype is not comfortable to carry. But the person who has been through the Tower genuinely knows things that others only theorise about.`,

    origin: `The Tower pattern develops either through actual catastrophic life events (the foundation literally being pulled out), or through a psyche that has spent so long building on an unstable base — suppressed emotion, false identity, inherited beliefs that don't fit — that the eventual collapse is internal rather than external. Either way, the Tower experience is the psyche's immune system: burning out what cannot hold so that what comes next has a real foundation.`,

    shadow: `The shadow Tower avoids all structures because they've been burned before. They resist commitment, refuse to build anything they aren't prepared to lose, and call the constant dismantling "freedom" when it is actually a fear of being inside something when it collapses again. There is also the opposite shadow: obsessively fortifying structures that are already internally compromised, expending enormous energy defending what is quietly collapsing from within.`,

    healthy: `The healthy Tower archetype builds differently after the fall. Not more defensively — more honestly. They have a higher-than-average tolerance for instability because they know they can rebuild and survive. They are unusually good at seeing what is false or unstable in systems and structures — in their own life and in the organisations and relationships around them. This is the gift: the ability to see clearly without the need to pretend.`,

    masculine_feminine: `The Tower energy is violent in its masculine expression — sudden, forceful, destroying what stands. The integration of the feminine here is in what follows: the grief, the clearing, the sitting with what remains. Those who carry this archetype but resist the feminine will rebuild the same thing on the same broken foundation. Those who integrate it will sit in the rubble long enough to understand why it fell.`,

    money_power: `Financial Tower experiences are common — sudden losses, unexpected collapses, situations that seemed stable turning dramatically. The pattern to examine is what was already unstable before the collapse: what were you not looking at, or not willing to address, that the Tower exposed? The financial rebuild after a Tower experience is only durable when the honest audit has been completed.`,

    integration: `Stop waiting for something external to force the change you already know needs to happen. You have enough Tower experience by now to recognise when you are building on a foundation that cannot hold. The internal belief that must shift is: "Maybe if I reinforce it enough, it will hold" → "The honest collapse I choose is less costly than the one I avoid until it chooses me." The behaviour: identify the structure in your life that is already quietly failing. Make the conscious choice.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 17,
    name: 'The Star',
    keywords: ['hope', 'renewal', 'inspiration', 'healing'],

    identity: `You carry something that is genuinely rare: the capacity for hope after things have fallen apart. Not naive optimism — the kind of hope that has been earned, that has been through the Tower or the darkness and has come back with something luminous intact. People feel it around you. You are often someone others look to when they have lost their direction, because you have a quality of light that is not performative and cannot be faked. The challenge is that this same sensitivity to what's possible can make the gap between vision and current reality feel unbearable.`,

    origin: `The Star pattern often develops through a significant period of darkness — loss, illness, betrayal, or collapse — followed by an unexpected renewal that restructured the person's relationship with hope itself. The hope is not innocent because it has been tested. It is earned, refined, and real. Alternatively, some carry this archetype as a natural gift from birth, which means the work is in grounding the luminosity so it can actually function in the material world.`,

    shadow: `The shadow Star is an idealist who cannot land. They are perpetually inspired by the possible while consistently disappointed by the actual. There is often a pattern of beginning things with enormous light and energy, then losing momentum when reality proves more resistant than the vision allowed for. Spiritual bypassing is the most common shadow expression: using beauty, vision, and inspiration as an escape from the work of actual embodiment.`,

    healthy: `The healthy Star has learned to bring the light all the way down — to translate vision into action, inspiration into structure, hope into a specific next step. They remain luminous in a way that is functional rather than fugitive. They can be genuinely hopeful about the world while remaining honest about what it currently is. The hope is not a defence against reality. It is something to work toward within it.`,

    masculine_feminine: `The Star is deeply feminine in its primary expression — receptive, renewing, healing, inspirational. The masculine integration required is the ability to structure the hope, to commit the vision to specific action, to build something that carries the light rather than just emitting it. Without this, the Star's gift evaporates before it reaches anyone.`,

    money_power: `Often a complicated relationship with material success — either deeply generous to the point of financial instability, or avoiding financial ambition because it feels incompatible with the luminous self-image. The Star must learn that grounding their gifts in structures that generate real financial capacity is not a betrayal of their nature. It is the means by which the light actually reaches people.`,

    integration: `Your vision is not complete until it has a specific, timed, committed action attached to it. The internal belief that must shift is: "The vision is enough" → "The vision is only the beginning. The embodiment is the work." The behaviour: take your most held, longest-running vision and attach a specific, concrete first action to it. Do it before the end of this week.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 18,
    name: 'The Moon',
    keywords: ['unconscious', 'illusion', 'fear', 'emotional depth'],

    identity: `Your inner world is enormous and largely ungoverned by logic. You feel things that other people can't quite name, you pick up on undercurrents that have no obvious source, and you have a relationship with your own unconscious that is simultaneously your greatest asset and your most significant source of suffering. The Moon archetype does not produce clear answers or straight lines. It produces depth, intensity, and a sometimes overwhelming awareness of what lives beneath the surface — in yourself, in others, in rooms, in relationships.`,

    origin: `The Moon pattern develops in environments where emotional reality was uncertain or unsafe — where the atmosphere was unpredictable, where people said one thing and meant another, or where the person's own emotional experience was consistently denied or distorted. The nervous system became exquisitely tuned to the emotional undercurrent as a survival strategy. The cost is a mind that has difficulty distinguishing what is real from what it is projecting.`,

    shadow: `The shadow Moon is consumed by anxiety, projection, and self-generated illusion. They see threat where there is none, create emotional narratives that have no basis in actual events, and then respond to the narrative as if it were reality. Worst case: paranoia, inability to trust their own perception, cycles of fear-based behaviour that create the exact outcomes they were afraid of. The shadow Moon confuses its own depth with insight — but depth and accuracy are not the same thing.`,

    healthy: `The healthy Moon archetype has developed genuine emotional intelligence — the ability to navigate the unconscious without being submerged by it. They have learned to distinguish between intuition (accurate) and anxiety (projection). They can sit with uncertainty, emotional complexity, and the not-yet-clear without needing to resolve it prematurely into a story. Their depth is a genuine resource: they see and feel what others miss.`,

    masculine_feminine: `The Moon is a deeply feminine energy — fluid, cyclical, unconscious, emotionally resonant. The masculine integration required is the ability to bring structure and discernment to the emotional material: not to control the feeling, but to be able to think clearly within it. Without this integration, the emotional depth has nowhere to go and no way of being useful.`,

    money_power: `Financial life often mirrors the unconscious cycles — inexplicable fluctuations, decisions driven by fear or emotional undercurrent rather than rational assessment. The Moon archetype is particularly susceptible to financial decisions made from anxiety rather than clarity. The discipline required is always: is this decision coming from what I know, or from what I fear?`,

    integration: `Learn to distinguish between what you feel and what is true. Not all emotional intelligence is accurate intelligence. The internal belief that must shift is: "What I feel is what is real" → "What I feel is important data that still requires honest examination." The behaviour: the next time you are certain of something based on feeling, pause and ask — what is the evidence for this that exists independently of my emotional state? Update your position accordingly.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 19,
    name: 'The Sun',
    keywords: ['vitality', 'joy', 'clarity', 'authentic expression'],

    identity: `There is something essentially life-giving about you — an energy that makes other people feel more alive, more possible, more themselves. You have a quality of presence that, at its best, is not performed but simply is. And here is the thing most people with this archetype don't say out loud: it is exhausting to maintain when the light you're emitting doesn't feel connected to what you're actually experiencing inside. The performance of positivity and the genuine expression of it feel identical from the outside. From the inside, only one of them is real.`,

    origin: `The Sun archetype often develops in environments where the person's natural vitality and expressiveness were welcomed and depended upon — where they became the light of the family, the energy in the room, the person whose visibility made others more comfortable. Over time, shining became a role rather than a state. The performance of brightness can become so habitual that the person loses access to the authentic vitality underneath it.`,

    shadow: `The shadow Sun needs constant validation of its light. They perform positivity as a way of managing how others see them, which means genuine feelings — grief, fear, complexity, ambivalence — become threats to the identity. There is a deep vulnerability beneath the radiance that has never been allowed to exist publicly, because the risk feels too great: what if people only love the sun version, not the whole person?`,

    healthy: `The healthy Sun archetype radiates from genuine fullness — not from a compulsion to maintain a certain image. They can be fully present in joy and fully present in difficulty without the difficulty threatening the core. They allow people to see them when they are not luminous, which paradoxically makes their light more trustworthy and more connecting. Real vitality is not constant. It is renewable.`,

    masculine_feminine: `The Sun is primarily a masculine archetype in its energy — clear, outward, radiant, directed. The integration of the feminine is in allowing the inner life — the cycles, the darkness, the rest — to be part of what is expressed rather than hidden behind the light. The Sun that has integrated the feminine is warmer, more complex, and ultimately more sustaining.`,

    money_power: `Often has genuine capacity for financial success, but it may be complicated by the performing self versus the real self. If financial success has been built on the performed version, there is often an underlying fear that the real person couldn't sustain it. Alternatively: giving away resources as a way of maintaining the "generous, luminous" identity at the expense of actual financial stability. The Sun needs to earn and hold wealth as the whole person, not just the bright one.`,

    integration: `Let people see you when you are not shining. Not as vulnerability-performance — as genuine sharing of what your actual experience is. The internal belief that must shift is: "If I show the difficult parts, I lose what makes me valuable" → "The people who matter want access to the whole of me, not just the part that is easy to be around." The behaviour: share something genuinely difficult with someone who only knows your bright side. See what it does.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 20,
    name: 'Judgement',
    keywords: ['reckoning', 'awakening', 'accountability', 'rebirth'],

    identity: `You are someone for whom honest self-assessment is both a gift and a perpetual source of difficulty. You can see yourself clearly — your patterns, your failures, your contradictions — with unusual precision. This gives you an extraordinary capacity for self-awareness and genuine accountability. It also means you are capable of a level of self-judgment that most people never subject themselves to. The Judgement archetype is designed for honest reckoning. The shadow is that reckoning can become punishment.`,

    origin: `This pattern develops in environments where self-examination was used as a form of control — where the expectation was that constant self-monitoring and accountability would produce safety, love, or belonging. The person learned to internalise the judgment before it arrived from outside. This is often experienced as conscientiousness or responsibility. Below the surface, it is vigilance. Below that: the belief that if you judge yourself first, you can prevent others from judging you worse.`,

    shadow: `The shadow Judgement archetype cannot forgive themselves. They rehearse failures, rerun past decisions, maintain a permanent internal record of everything they have gotten wrong, and unconsciously punish themselves through the ongoing quality of their choices. They may be very forgiving of others while being genuinely merciless with themselves. There is also an opposite shadow: projecting the judgment outward, becoming highly critical of others as a way of pre-empting it.`,

    healthy: `The healthy Judgement archetype has developed genuine accountability without punishment — the ability to look honestly at what has passed, take full responsibility for their role in it, make whatever repair is possible, and genuinely release it. They understand that reckoning is not an end state; it is a process. And they understand that they cannot awaken to their full capacity while still using their self-awareness as a weapon against themselves.`,

    masculine_feminine: `Judgement requires both the masculine capacity for honest assessment and the feminine capacity for compassion and forgiveness. The most common imbalance is masculine excess: precision without mercy, accountability without tenderness. The integration is in developing the ability to see everything clearly and respond to it with the same generosity you would offer someone you genuinely love.`,

    money_power: `Often strong financial conscience but complicated relationship with financial success. May experience cycles of financial reckoning — periods where old decisions come due. The pattern to watch: unconsciously limiting financial growth as a form of ongoing self-punishment for past failures. The question to sit with: have you financially "paid" for the mistake long enough? Is the limitation still serving atonement, or has it become habit?`,

    integration: `You are allowed to be finished with it. The internal belief that must shift is: "If I release the judgment of myself, I will repeat the pattern" → "I can be fully accountable and also fully forgiven — these are not opposites." The behaviour: identify one past decision that you are still actively penalising yourself for. Write what you actually learned from it. Then close the file.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 21,
    name: 'The World',
    keywords: ['completion', 'wholeness', 'mastery', 'integration'],

    identity: `You are someone who has been working toward a sense of arrival — a feeling of completion, of having genuinely done something, of being whole rather than perpetually in process. You may have had moments of it: brief, unmistakable experiences of everything being exactly as it should be. But the pattern for this archetype is that the arrival keeps receding, the finish line keeps moving, and the sense of wholeness feels perpetually almost-there. The World is the archetype of completion. Its shadow is the compulsion to never quite finish.`,

    origin: `This pattern develops in environments where completion was either never celebrated, consistently moved, or implicitly forbidden — where arriving was seen as complacency, where there was always one more thing required before you were enough. The person internalised the endless horizon as normal, and now moves it themselves whenever the destination comes into view. The search for wholeness became an identity because wholeness itself felt unsafe.`,

    shadow: `The shadow World archetype pursues completeness relentlessly but unconsciously ensures they never reach it. They add one more requirement before they can declare success, one more qualification before they are ready, one more thing to fix before the relationship can be fully accepted. This is not ambition. It is a form of self-protection: if you never arrive, you can never be found wanting upon arrival. Perfectionism is the World's shadow.`,

    healthy: `The healthy World archetype knows how to complete things — consciously, deliberately, with full presence. They can celebrate what has been built without immediately pivoting to what is next. They understand that completion is not the end of growth; it is the moment that makes the next beginning possible. They inhabit the present achievement without either clinging to it or immediately evacuating it for the next goal.`,

    masculine_feminine: `The World asks for both polarities in their most mature forms: the masculine capacity to execute, complete, and claim what has been built, and the feminine capacity to receive, inhabit, and celebrate what is. The most common imbalance is executing without receiving — achieving the completion and then immediately moving past it before it can actually land.`,

    money_power: `Strong capacity to build to a point, followed by a pattern of moving the success threshold just before it's reached. May have experienced near-arrival in financial terms multiple times — almost at the number, almost at the stability — followed by circumstances or choices that reset the process. The work is in honestly examining what happens just before the threshold: what are you doing in that moment? What are you not doing?`,

    integration: `Declare one thing complete. Not perfect — complete. The internal belief that must shift is: "I am not there yet" → "There is a version of 'there' that I can reach and that is enough to honour." The behaviour: identify something in your life that is genuinely finished but that you have not acknowledged as finished. Acknowledge it. Celebrate it in whatever way feels real. Then let it be done.`,
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: 22,
    name: 'The Fool',
    keywords: ['new beginnings', 'trust', 'spontaneity', 'the leap'],

    identity: `You are someone who makes leaps. Not impulsive ones necessarily — though sometimes those too — but genuine, committed steps into the unknown, into the new, into territory that has no guarantee. You carry a quality of beginner's mind that allows you to approach things without the weight of accumulated expectation. This is your most significant gift and your most significant liability: the same openness that allows you to begin anything also allows you to abandon it before it has time to become anything real.`,

    origin: `The Fool archetype often develops in response to environments that were either highly restrictive (and the leap became the only expression of freedom available) or highly unstable (and new beginnings were the only constant). In either case, the person developed a deep comfort with starting and a complicated, often avoidant relationship with the middle — the part after the exciting beginning and before the completion.`,

    shadow: `The shadow Fool lives in perpetual beginning. They move through relationships, projects, places, and identities with a kind of restless lightness that looks like freedom but functions as avoidance. The question they are avoiding: "what am I when the excitement is gone?" There is also a spiritual bypass shadow — using the language of trust, flow, and surrender to avoid the specific, uncomfortable work that the current moment actually requires.`,

    healthy: `The healthy Fool has learned that genuine trust includes trusting the process through the difficult middle — not just the exhilarating beginning. They can begin and continue and complete, bringing the same openness and lack of protective calculation to all three phases. They leap and they commit to what they land in. Their freshness is not naivety; it is a choice they make in full knowledge of what has come before.`,

    masculine_feminine: `The Fool sits at the threshold of both — pure potential before the masculine and feminine divide into direction. The integration work for this archetype is in developing the masculine capacity for commitment and sustained direction alongside the feminine capacity for receptivity and flow. The Fool who integrates both can be both open and committed. Free and present. Spontaneous and showing up.`,

    money_power: `Financial life often mirrors the leap-and-not-land pattern — strong income potential in new projects, followed by loss of interest before the project is financially productive. There may be a history of excellent starts and inconsistent follow-through. The financial discipline of the Fool is not in controlling the leap — it is in deciding in advance what "staying" looks like and committing to it before the excitement fades.`,

    integration: `The commitment is the leap. Not the start — the staying. The internal belief that must shift is: "Real freedom is always having the option to leave" → "Real freedom is being fully present in the thing I chose." The behaviour: identify the thing you have already begun that most deserves your continued presence. Give it three months of consistent engagement without evaluating whether it is still working. Be there.`,
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
