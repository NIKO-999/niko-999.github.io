'use strict';

/**
 * Destiny Matrix — Karmic Debt Content
 * ─────────────────────────────────────
 * Present-life tension layer only. This star sits at the Inner Bottom
 * point, the midpoint between the Karmic Tail (D) and Soul Center (E)
 * stars. Value = reduce(D+E), matching matrix-engine.js's already-computed
 * karmic-tail-triplet middle value [D, reduce(D+E), E].
 *
 * This is strictly a present-life system: activation patterns, repeating
 * situations, automatic behavior under pressure, the lesson actively being
 * integrated, and how the pattern can shift. It must never reference
 * past-life origin — that material belongs entirely to the separate Past
 * Life Star (js/past-life-content.js). Symbolic and archetypal only,
 * never presented as literal fact — all language is hedged.
 *
 * Every field is continuous prose. No arrays, no lists, no bullet points.
 *
 * Two layers:
 *   nodes[NUM]     — one reading per arcana (1-22).
 *   codes[NAME]    — 5 deeper bonus readings for the named karmic seeds
 *                    matched via DMEngine.matchKarmicTailCode([D, K, E]).
 *
 * API:
 *   DKarmicDebtContent.get(arcanaNum)  → { heading, pattern, lesson, path } or null
 *   DKarmicDebtContent.getCode(name)   → { heading, pattern, lesson, path } or null
 */

window.DKarmicDebtContent = (function () {

  const nodes = {

    1: {
      heading: 'The Magician — The Tension of Starting Without Staying',
      pattern: `This placement may point to a present-life tension that activates most clearly at the exact moment a new undertaking moves past its exciting opening stretch and into the slower, less visible work of actually sustaining it. Under pressure, the automatic response can be reaching for the next idea rather than staying with the current one — a subtle but recognizable pull toward fresh momentum whenever the existing momentum starts to require more discipline than excitement. This may repeat across different areas of life — work, relationships, creative projects — with a similar shape each time: strong initiation, followed by a quiet loss of interest right where consistency would actually begin to matter.`,
      lesson: `The core lesson being actively integrated here may center on follow-through as its own form of mastery — learning that finishing something ordinary can matter more than starting something exciting, and that momentum sustained is a different, less immediately gratifying skill than momentum generated.`,
      path: `This pattern may shift through small, deliberate acts of staying — choosing, on purpose, to remain with one thing past the point where a new idea starts to feel more appealing, and noticing what actually happens when the follow-through is allowed to continue rather than interrupted.`,
    },

    2: {
      heading: 'The High Priestess — The Tension of Knowing and Not Saying',
      pattern: `This placement may activate most clearly in moments where an accurate read of a situation is available internally and stays unspoken, often out of a reflex toward caution rather than any active decision to withhold. Under pressure, the automatic response can be quiet observation rather than direct communication — a tendency to wait until someone else voices what's already been perceived, or to let a decision happen without offering the insight that might have shaped it. This may repeat as a recognizable pattern of being trusted with other people's inner lives while remaining comparatively unreadable yourself.`,
      lesson: `The core lesson being integrated may involve the risk of speaking a genuine perception out loud before it feels fully safe to do so — recognizing that clarity offered late is often less useful than clarity offered honestly, even when it's uncertain.`,
      path: `This may shift through small, repeated practice in voicing an accurate read in real time rather than after the fact, and by noticing that being known tends to deepen connection rather than threaten it, contrary to what the old caution may suggest.`,
    },

    3: {
      heading: 'The Empress — The Tension of Giving Without Receiving',
      pattern: `This placement may activate around the exchange of care — situations that call for both giving and receiving tend to surface a lopsidedness, where offering support, resources, or warmth comes far more easily than accepting them in return. Under pressure, the automatic response can be to give more rather than to ask for anything, even when the giving is quietly depleting. This may repeat as relationships or situations that keep requiring more output than they return, not because they're inherently unfair, but because receiving hasn't yet been practiced as comfortably as giving.`,
      lesson: `The core lesson being integrated may be learning that receiving is not a debt or a weakness but a genuine part of real exchange — that a relationship or situation can only become mutual once both directions are actually allowed to move.`,
      path: `This may shift through small, deliberate practice in receiving without immediately reciprocating — accepting help, a compliment, or support and letting it simply land, rather than converting it right away into an occasion to give something back.`,
    },

    4: {
      heading: 'The Emperor — The Tension of Control Under Pressure',
      pattern: `This placement may activate most clearly in moments of uncertainty, where the automatic response is to tighten control rather than to tolerate the discomfort of not knowing. Under pressure, this can show up as an instinct to manage, direct, or take charge of a situation even when doing so isn't actually necessary or wanted by the people involved. This may repeat as a pattern of being relied on for stability while quietly struggling to delegate, rest, or trust that things might hold together without direct oversight.`,
      lesson: `The core lesson being integrated may involve learning to distinguish between structures that genuinely need your hand and situations where loosening the grip would actually work better — recognizing that consistent control and genuine strength are not the same thing.`,
      path: `This may shift through small, repeated experiments in delegating something real and resisting the urge to check on it — noticing what happens when a structure is trusted to hold weight without your constant involvement.`,
    },

    5: {
      heading: 'The Hierophant — The Tension of Inherited Belief Meeting Direct Experience',
      pattern: `This placement may activate whenever a belief or rule you were taught comes into direct contact with something your own experience is suggesting instead. Under pressure, the automatic response can be to defer to the inherited structure — the familiar rule, the established authority — even when a quieter, more immediate signal is pointing somewhere else. This may repeat as recurring friction between what feels correct according to tradition and what feels true according to direct, lived experience.`,
      lesson: `The core lesson being integrated may be learning to test inherited belief against genuine, present experience rather than assuming the inherited version must be correct simply because it's familiar.`,
      path: `This may shift by deliberately naming, out loud or in writing, one place where an inherited rule and your own direct experience currently disagree, and allowing the disagreement to be examined rather than automatically resolved in favor of the inherited side.`,
    },

    6: {
      heading: 'The Lovers — The Tension of Choosing to Keep the Peace',
      pattern: `This placement may activate at genuine decision points — moments where a real choice is required and the easier, less disruptive option quietly competes with the option that actually reflects your own preference. Under pressure, the automatic response can be choosing whatever keeps the immediate situation calm, even at some cost to what you actually wanted. This may repeat as a pattern of decisions that, in hindsight, were shaped more by avoiding friction than by genuine alignment.`,
      lesson: `The core lesson being integrated may be learning that a choice made from genuine preference, even when it creates short-term friction, tends to hold better over time than a choice made primarily to avoid conflict.`,
      path: `This may shift through small, low-stakes practice in naming an actual preference out loud before defaulting to whatever seems easiest for everyone else, and noticing that a clearly stated preference is rarely as costly as it seemed in advance.`,
    },

    7: {
      heading: 'The Chariot — The Tension of Motion Without Pause',
      pattern: `This placement may activate whenever stillness becomes available — a finished project, a quiet weekend, a moment with nothing urgent to do — and instead of settling into it, the automatic response is to generate the next task or goal. Under pressure specifically, this often intensifies: continuing to push forward can feel safer than stopping to assess whether the current direction is actually still the right one. This may repeat as a recognizable discomfort with rest that persists even when rest is fully available and genuinely deserved.`,
      lesson: `The core lesson being integrated may be learning that pausing is not the same as losing ground — that real direction actually requires occasional stillness in order to be reassessed and trusted.`,
      path: `This may shift through small, deliberate practice in stopping before the next task is lined up, and staying with the resulting discomfort long enough to notice that it passes, and that momentum is usually still available afterward.`,
    },

    8: {
      heading: 'Justice — The Tension of a Standard Applied Unevenly',
      pattern: `This placement may activate around situations involving fairness, where the automatic response is a sharp, almost immediate read of what's imbalanced — paired with a much quieter, harder-to-access awareness of where a similar imbalance might exist in your own conduct. This may repeat as recurring encounters with unfairness that can feel oddly personal, as though the same lesson keeps finding new circumstances to arrive in.`,
      lesson: `The core lesson being integrated may be learning to apply the same honest, careful standard to yourself that gets applied so readily to others — closing the gap between the fairness demanded of the world and the fairness practiced internally.`,
      path: `This may shift by choosing one specific situation and asking, deliberately, whether you're holding yourself to the same standard you're applying to someone else, and adjusting accordingly.`,
    },

    9: {
      heading: 'The Hermit — The Tension of Withdrawing Instead of Reaching Out',
      pattern: `This placement may activate in moments of difficulty or overwhelm, where the automatic response is to retreat into solitude rather than to reach toward the people who might actually be able to help. This may repeat as a pattern of processing everything internally, often quite capably, while the option of external support goes largely untested — not out of active refusal, but out of a strong, familiar pull toward figuring things out alone first.`,
      lesson: `The core lesson being integrated may be learning that solitude used as ongoing avoidance functions differently than solitude used as genuine, temporary renewal — and that returning from withdrawal with something to offer is part of what makes the withdrawal generative rather than isolating.`,
      path: `This may shift by setting an intentional limit on how long a retreat lasts, and by practicing the specific, uncomfortable step of returning to share what was found there, even before it feels fully resolved or ready.`,
    },

    10: {
      heading: 'The Wheel of Fortune — The Tension of Reacting to Every Turn',
      pattern: `This placement may activate specifically during a downturn or unexpected shift, where the automatic response is to treat the change as a crisis requiring an immediate, often drastic reaction. This may repeat as a pattern of large decisions made during low points that, on reflection, might have benefited from more patience, alongside a tendency to under-prepare during high points because the momentum feels like it will simply continue.`,
      lesson: `The core lesson being integrated may be learning to recognize which phase of a cycle you're actually in, and to let that recognition inform the pace of any decision — treating a low point as a season to move through rather than a permanent verdict.`,
      path: `This may shift by pausing before any major decision made during a visible downturn, and asking whether the decision would still feel right from a calmer, more settled vantage point.`,
    },

    11: {
      heading: 'Strength — The Tension of Holding Everything Alone',
      pattern: `This placement may activate under real pressure or difficulty, where the automatic response is to grip tighter and manage the situation single-handedly rather than to let anyone else share the weight of it. This may repeat as a pattern of being reliably strong for other people while rarely, if ever, being the one who receives that same support in return — not because support isn't offered, but because accepting it doesn't come as naturally as providing it.`,
      lesson: `The core lesson being integrated may be learning that asking for help is not a departure from strength but an extension of it — that genuine resilience includes knowing when to let something be carried by more than one person.`,
      path: `This may shift through small, deliberate practice in naming a real need to someone else this week, rather than a preference, and allowing the request to stand without immediately managing or minimizing it.`,
    },

    12: {
      heading: 'The Hanged Man — The Tension of Staying Suspended',
      pattern: `This placement may activate in situations that call for a real decision, where the automatic response is to wait rather than to choose — often justified internally as patience, timing, or simply not being ready yet. This may repeat as a pattern of remaining in unresolved circumstances well past the point where the underlying lesson feels genuinely learned, with the actual choice continuing to be deferred.`,
      lesson: `The core lesson being integrated may be learning to distinguish between a pause that's genuinely still doing work and a pause that has quietly become its own kind of avoidance — and choosing, at some point, to act even without complete certainty.`,
      path: `This may shift by naming, specifically, what continued waiting is protecting against, and setting a real point at which a decision gets made regardless of whether full clarity has arrived by then.`,
    },

    13: {
      heading: 'Transformation — The Tension of Holding On or Letting Go Too Soon',
      pattern: `This placement may activate around endings — either resisting one that's clearly due, or rushing one that hasn't actually completed yet. Under pressure, the automatic response can go either direction: gripping tightly to what's familiar, or cutting something off abruptly to avoid the discomfort of watching it fully play out. This may repeat as a pattern of endings that arrive either too late or too fast, rarely at the moment that would have felt most genuinely complete.`,
      lesson: `The core lesson being integrated may be learning to sense actual completion rather than defaulting to either extreme — recognizing the difference between a difficult phase that still has value and a chapter that has, in fact, already ended.`,
      path: `This may shift by pausing at the edge of any ending — whether the impulse is to cling or to cut — and asking honestly whether the thing in question has actually finished its course yet.`,
    },

    14: {
      heading: 'Temperance — The Tension of Swinging Between Extremes',
      pattern: `This placement may activate around any effort to manage two competing needs — discipline and indulgence, rest and productivity — where the automatic response is to swing fully into one before overcorrecting into the other. This may repeat as recognizable cycles: a period of strict control followed by a period of full release, each one framed as the necessary correction for the one before it, without either settling into something sustainable.`,
      lesson: `The core lesson being integrated may be learning that genuine balance is an active blend rather than an alternation — that both needs can be met in the same stretch of time, rather than taking turns entirely displacing each other.`,
      path: `This may shift by noticing, in the moment, the pull toward either extreme, and deliberately choosing a smaller, more moderate version of the response instead of the full swing.`,
    },

    15: {
      heading: 'The Devil — The Tension of an Unexamined Pull',
      pattern: `This placement may activate around a specific compulsive pattern — toward control, comfort, or a particular relational dynamic — where the automatic response under stress is to act on the pull rather than to pause and examine it. This may repeat as a familiar cycle: resistance, relapse into the pattern, and a returning resolve to resist again, without the underlying pull ever being looked at directly.`,
      lesson: `The core lesson being integrated may be learning that honest examination of the craving — what it's actually providing, what it may be protecting against — tends to loosen its grip more effectively than willpower alone.`,
      path: `This may shift by naming the specific pattern honestly, without judgment, and asking what unmet need it might currently be standing in for, rather than continuing to meet it with pure resistance.`,
    },

    16: {
      heading: 'The Tower — The Tension of Ignoring the Warning Signs',
      pattern: `This placement may activate when a structure — a plan, a relationship, a commitment — starts showing early signs of instability. The automatic response under pressure can be denial: maintaining the appearance that everything is sound rather than examining what might actually be cracking underneath. This may repeat as a pattern of sudden reversals that, in hindsight, had visible signals well before the collapse actually arrived.`,
      lesson: `The core lesson being integrated may be learning to take early warning signs seriously rather than setting them aside, and to choose an honest, gradual reckoning over a denial that eventually forces a much more sudden one.`,
      path: `This may shift by identifying, specifically, one structure in current life that already shows signs of strain, and addressing it directly rather than waiting for the strain to resolve itself.`,
    },

    17: {
      heading: 'The Star — The Tension of Dimming Right Before Being Seen',
      pattern: `This placement may activate specifically at the edge of visibility — a chance to share real work, insight, or hope with other people. The automatic response under pressure can be to pull back right at that threshold, offering less than what's actually available. This may repeat as a pattern of genuine capability that stays underdeveloped, protected from the exposure that fully offering it would require.`,
      lesson: `The core lesson being integrated may be learning that visibility, while uncomfortable, is where the actual value of the gift gets to reach anyone at all — and that dimming it doesn't remove the discomfort, it only delays the offering.`,
      path: `This may shift by choosing one small, specific act of visibility this week — sharing something real before it feels fully ready — and noticing what actually happens, rather than what was anticipated.`,
    },

    18: {
      heading: 'The Moon — The Tension of Trusting an Unverified Story',
      pattern: `This placement may activate whenever ambiguity is present and a clear answer isn't immediately available. The automatic response under pressure can be to fill that ambiguity with an anxious narrative and treat it as though it were confirmed fact. This may repeat as decisions shaped by a compelling internal story that, on later reflection, doesn't fully hold up against what was actually happening.`,
      lesson: `The core lesson being integrated may be learning to hold the anxious narrative as one possibility rather than a certainty, and to check it against available evidence before acting on it.`,
      path: `This may shift by pausing, the next time a strong anxious story arrives, to ask specifically what evidence actually supports it, separate from how convincing it feels in the moment.`,
    },

    19: {
      heading: 'The Sun — The Tension of Performing Brightness',
      pattern: `This placement may activate in moments of genuine difficulty, where the automatic response is to maintain an outward appearance of ease rather than to let the difficulty be visible. This may repeat as a pattern of being the reliably warm, upbeat presence for other people while an equivalent space for your own harder feelings doesn't get offered as readily.`,
      lesson: `The core lesson being integrated may be learning that being fully known, difficulty included, tends to deepen connection rather than threaten it — and that constant brightness isn't required to remain likeable or valuable.`,
      path: `This may shift by letting one difficult feeling be visible to someone trustworthy this week, rather than managing it privately until it passes.`,
    },

    20: {
      heading: 'Judgement — The Tension of Preparing Instead of Rising',
      pattern: `This placement may activate once real clarity has already arrived about something that needs to change — a decision, a direction, an ending. The automatic response under pressure can be to keep preparing rather than to act: more research, more certainty-gathering, one more condition to be met first. This may repeat as a pattern of knowing exactly what's needed and still finding sophisticated reasons to delay it.`,
      lesson: `The core lesson being integrated may be learning that the clarity has, in most cases, already arrived — and that further preparation, past a certain point, functions as delay rather than genuine diligence.`,
      path: `This may shift by naming the specific action the current clarity is actually calling for, and taking a first, concrete step toward it this week, rather than continuing to gather more certainty first.`,
    },

    21: {
      heading: 'The World — The Tension of Refusing to Call Something Finished',
      pattern: `This placement may activate right at the edge of genuine completion — a project nearly done, a goal nearly reached. The automatic response under pressure can be to extend or complicate the situation rather than let it actually close. This may repeat as a pattern of near-completions that keep quietly avoiding the moment of being called finished.`,
      lesson: `The core lesson being integrated may be learning to let something be done — not perfect, but complete — and to let that completion be acknowledged rather than immediately relativized or extended.`,
      path: `This may shift by identifying one thing that is, in practical terms, already finished, and deliberately naming it as complete rather than adding one more condition before it counts.`,
    },

    22: {
      heading: 'The Fool — The Tension of Leaving Before Staying Gets Hard',
      pattern: `This placement may activate right as something — a relationship, a project, a commitment — moves past its exciting beginning and starts to require sustained presence. The automatic response under pressure can be a pull toward the next fresh start rather than toward staying through the harder, less exciting middle. This may repeat as a pattern of many promising beginnings alongside comparatively few things carried all the way through.`,
      lesson: `The core lesson being integrated may be learning that trust includes the ordinary middle, not just the exciting leap — and that staying, even when it's less immediately stimulating, is where real depth tends to accumulate.`,
      path: `This may shift by choosing one current commitment and deliberately continuing with it through a stretch of time that feels less exciting than usual, without evaluating in the middle of it whether to leave.`,
    },

  };

  // ── NAMED KARMIC SEEDS ─────────────────────────────────────────────────────
  // Deeper bonus layer for the 5 named triplets already defined in
  // matrix-engine.js's KARMIC_TAIL_CODES, matched via
  // DMEngine.matchKarmicTailCode([D, thisValue, E]). Present-tension-only,
  // same as the standard 22 above.

  const codes = {

    'The Wizard / Secret Knowledge': {
      heading: 'The Wizard — The Tension of Protecting Unusual Ability',
      pattern: `This placement may activate whenever an unusual capability or insight could genuinely help a situation, and the automatic response under pressure is to hold it back rather than offer it. This may repeat as a pattern of real, sometimes rare ability that stays quietly guarded, even in contexts where sharing it would clearly serve the people involved.`,
      lesson: `The core lesson being integrated may be learning that this particular ability is safe to offer now, in a way it may not always have felt safe to before — and that concealment, once perhaps protective, may no longer be serving its original purpose.`,
      path: `This may shift by offering the ability or insight in one specific, lower-stakes situation this week, and noticing whether the anticipated risk of exposure actually materializes.`,
    },

    'Wasted Talent': {
      heading: 'Wasted Talent — The Tension of Capability Left Undeveloped',
      pattern: `This placement may activate whenever real talent is close to being tested publicly — a piece of work ready to be shared, a skill ready to be used at its actual level. The automatic response under pressure can be to hold back, protecting the talent from the risk of falling short in view of other people. This may repeat as a pattern of near-completions, almost-finished work, and capability that stays close to but never quite at its actual ceiling.`,
      lesson: `The core lesson being integrated may be learning that the exposure of genuinely trying at full capacity is the actual price of finding out what that capacity can become.`,
      path: `This may shift by completing and sharing one piece of work at its current, honest stage, rather than holding it back until it feels fully ready.`,
    },

    'The Prisoner': {
      heading: 'The Prisoner — The Tension of an Old Sense of Confinement',
      pattern: `This placement may activate around situations that involve choice or freedom, where the automatic response is to assume the limitation is fixed rather than to test whether it still holds. This may repeat as a persistent sense of restriction in some specific area of life that doesn't always match the actual, current circumstances.`,
      lesson: `The core lesson being integrated may be learning to test the assumed boundary directly, rather than continuing to organize choices around a limitation that may no longer be as fixed as it once was.`,
      path: `This may shift by identifying one specific area where a limitation is assumed rather than confirmed, and taking one concrete step to test whether it's actually still there.`,
    },

    'World of Passions / Temptation': {
      heading: 'World of Passions — The Tension of Appetite Outrunning Judgment',
      pattern: `This placement may activate around situations involving strong desire or stimulation, where the automatic response under pressure is to act on the pull before pausing to weigh its actual cost. This may repeat as a pattern of decisions that felt irresistible in the moment and, in hindsight, cost more than they seemed to at the time.`,
      lesson: `The core lesson being integrated may be learning to let genuine aliveness and desire coexist with real discernment, rather than letting the appetite move faster than the judgment that would normally accompany it.`,
      path: `This may shift by building in one deliberate pause between the pull toward something intense and the decision to act on it, long enough to weigh the actual cost.`,
    },

    'Family Betrayal': {
      heading: 'Betrayal of Family — The Tension of Pride Over Loyalty',
      pattern: `This placement may activate specifically within family or origin-based relationships, where the automatic response under pressure is to protect pride or position rather than to stay loyal to the people with a legitimate claim on your care. This may repeat as a pattern of distance or friction in family contexts specifically, even when the same difficulty is handled easily elsewhere.`,
      lesson: `The core lesson being integrated may be learning that loyalty and personal advancement don't have to compete — and that humility toward family, specifically, doesn't cost what pride may be insisting it will.`,
      path: `This may shift by choosing one specific family relationship and practicing an act of humility there directly — an acknowledgment, an apology, a genuine ask for repair — rather than letting pride continue to hold the distance in place.`,
    },

    'Sorcerer, Hermit, Rejection of Knowledge': {
      heading: 'The Guarded Hermit — The Tension of Trusting No One With What You Carry',
      pattern: `This placement may activate whenever trust is on the table — sharing something real with another person, being vulnerable about what you actually know or sense. The automatic response under pressure can be caution first, warmth second: a guardedness that keeps real intimacy one careful step removed, even in relationships that have otherwise earned it. This may repeat as a pattern of being the one others confide in while remaining, by comparison, genuinely hard to reach — trusted with everything except your own inner world.`,
      lesson: `The core lesson being integrated may be learning that trust extended first, before it feels fully earned or safe, is what actually builds the closeness you might otherwise be protecting yourself out of.`,
      path: `This may shift through one small, deliberate act of unguarded honesty with someone already safe — sharing something real before it feels fully ready to be shared, and noticing that the closeness which follows outweighs the old risk.`,
    },

    'Magical Sacrifice': {
      heading: 'The Watchful Influence — The Tension of Power That Still Needs Checking',
      pattern: `This placement may activate around any situation where personal influence could shape an outcome — a negotiation, guidance someone is relying on, a relationship where one person's read of things quietly carries more weight. The automatic response under pressure can swing between two extremes: reaching for more influence than the moment actually calls for, or overcorrecting into refusing to use it at all, even when it would genuinely help. This may repeat as a pull toward spiritual or esoteric interests alongside a real wariness of them — an uncertainty about whether your own motives are fully clean.`,
      lesson: `The core lesson being integrated may be learning that personal influence isn't inherently dangerous — only unexamined influence is, and the real safeguard is bringing intention into full view rather than avoiding the influence altogether.`,
      path: `This may shift through a small, regular practice of naming your actual motive to yourself before acting on any real influence you hold, and letting that one honest pause be enough to keep the use of it clean.`,
    },

    'Love Magic': {
      heading: 'Love Magic — The Tension of Earning Love Through Self-Sacrifice',
      pattern: `This placement may activate anywhere love or approval feels uncertain, where the automatic response is to give more — more accommodation, more self-erasure, more compensating — rather than to simply ask whether the connection is actually mutual. This may repeat as relationships that require increasingly excessive giving to sustain, alongside a persistent inner emptiness that more giving never quite fills.`,
      lesson: `The core lesson being integrated may be learning that love earned through self-sacrifice isn't the same as love freely given and received — and that the emptiness underneath isn't solved by trying harder at the same strategy.`,
      path: `This may shift by naming one specific need directly to someone this week, instead of trying to earn its fulfillment through further accommodation, and noticing what happens when the need is simply stated.`,
    },

    'Rebel': {
      heading: 'The Rebel — The Tension of Opposing on Reflex',
      pattern: `This placement may activate specifically around family or authority, where the automatic response is opposition itself — pushing back, distancing, rejecting the expectation — regardless of whether the actual expectation was reasonable. This may repeat as a pattern of feeling like an outsider even in close relationships, with real connection kept at a careful, self-protective distance.`,
      lesson: `The core lesson being integrated may be learning to distinguish genuine autonomy from automatic opposition — recognizing that some closeness can be chosen without it costing your independence.`,
      path: `This may shift by choosing one relationship currently held at a distance and offering one small, direct gesture of reconnection, without waiting for the other person to prove they deserve it first.`,
    },

    'Physical Suffering': {
      heading: 'The Guarded Body — The Tension of Bracing Against Pain That Hasn’t Arrived',
      pattern: `This placement may activate around anything involving the body — your own health, or the health of someone vulnerable and close to you — where the automatic response under pressure is either hypervigilance or complete avoidance, rarely anything calmer in between. This may repeat as a low tolerance for ordinary discomfort, physical or emotional, and outsized alarm at minor health scares involving people you love.`,
      lesson: `The core lesson being integrated may be learning that the body can be trusted and cared for without either constant monitoring or total avoidance — that steady, ordinary attention is enough.`,
      path: `This may shift by choosing one consistent, moderate act of physical self-care this week, and practicing staying with it calmly rather than swinging toward vigilance or neglect.`,
    },

    'Warrior': {
      heading: 'The Warrior — The Tension of Meeting Every Challenge as Combat',
      pattern: `This placement may activate in any situation involving disagreement or competition, where the automatic response is to treat it as something to win rather than something to navigate. This may repeat as relationships and collaborations that become unnecessarily adversarial, alongside a genuine leadership capacity that struggles to find a constructive outlet.`,
      lesson: `The core lesson being integrated may be learning that real strength includes the choice not to fight — that leadership built on trust and collaboration holds up better than leadership built on winning.`,
      path: `This may shift by entering one upcoming disagreement with the explicit intention of finding a shared solution rather than a winner, and noticing whether the old urge to dominate the outcome softens.`,
    },

    'The Solitary Woman': {
      heading: 'The Solitary Woman — The Tension of Staying Just Out of Reach',
      pattern: `This placement may activate as a relationship starts to deepen, where the automatic response is to keep it at a survivable distance — pleasant, steady, but not fully open — rather than risk the kind of closeness that could actually be lost. This may repeat as relationships that look stable from the outside while remaining quietly guarded underneath.`,
      lesson: `The core lesson being integrated may be learning that closeness withheld to avoid future loss is still a loss, just a slower and less visible one — and that openness now doesn't require certainty about forever.`,
      path: `This may shift by allowing one relationship currently kept at a comfortable distance to move one step closer than feels entirely safe, and noticing what actually happens.`,
    },

    'The Unborn Child': {
      heading: 'The Unborn Child — The Tension of Withholding Warmth From Fear of Loss',
      pattern: `This placement may activate around children, family continuity, or a lingering coolness toward a parent, where the automatic response is quiet guardedness rather than open affection — as though warmth given fully might somehow be taken away. This may repeat as overprotectiveness toward the people you love most, or a persistent difficulty feeling fully at ease around family.`,
      lesson: `The core lesson being integrated may be learning that generosity toward the people you love, and toward yourself, doesn't need to be rationed against some anticipated future loss.`,
      path: `This may shift by offering one deliberate, unguarded act of warmth this week — toward a child, a parent, or yourself — without the usual instinct to hold part of it back.`,
    },

    'The Oppressed Soul': {
      heading: 'The Oppressed Soul — The Tension of Waiting for Permission',
      pattern: `This placement may activate at any real decision point, where the automatic response is to defer — to wait for someone else's approval or direction rather than trusting your own judgment. This may repeat as a pattern of living inside expectations set by other people, with your own preferences and ambitions quietly kept in the background.`,
      lesson: `The core lesson being integrated may be learning that your own judgment is trustworthy enough to act on directly, without first requiring someone else's sign-off.`,
      path: `This may shift by making one real decision this week entirely on your own terms, and letting it stand without seeking outside confirmation afterward.`,
    },

    'The Emperor': {
      heading: 'The Emperor — The Tension of Authority Without Balance',
      pattern: `This placement may activate around authority itself — your own, or a father figure's — where the automatic response swings between over-controlling everyone nearby and checking out of responsibility entirely, rarely landing in between. This may repeat as recurring friction in relationships with paternal figures, and a similar instability in how you hold power in your own life.`,
      lesson: `The core lesson being integrated may be learning that authority can be held steadily, without needing to dominate or abdicate it — and that forgiveness toward an imperfect father figure frees up energy currently spent managing that old friction.`,
      path: `This may shift by choosing one area where you currently either over-control or avoid responsibility, and consciously practicing the steadier middle version instead, just once, to see how it feels.`,
    },

    'The Spiritual Priest': {
      heading: 'The Spiritual Priest — The Tension of Doubting a Knowing That Runs Deep',
      pattern: `This placement may activate whenever your own spiritual or intuitive insight asks to be trusted publicly — teaching, guiding, or simply naming what you sense is true. The automatic response under pressure can be retreat: quietly discounting your own perception before anyone else gets the chance to, and letting the moment pass to someone with less to lose. This may repeat as private clarity that rarely becomes public voice.`,
      lesson: `The core lesson being integrated may be that your insight doesn't need to be fully resolved or provably "right" before it's allowed to be spoken — withholding it doesn't make it safer, only invisible.`,
      path: `This may shift by naming one thing you already sense is true, out loud, to one person, before it feels fully ready to be said.`,
    },

    'Disappointment of the Lineage': {
      heading: 'Disappointment of the Lineage — The Tension of Working Without Credit',
      pattern: `This placement may activate specifically around recognition, where genuine effort keeps meeting delay, being overlooked, or landing as someone else's success. The automatic response under pressure can be quiet resentment toward family, paired with a persistent hunger for praise that doesn't quite ease even when it arrives. This may repeat as obstacles that feel disproportionate to the actual effort involved.`,
      lesson: `The core lesson being integrated may be learning that genuine vocation, pursued for its own sake, restores a sense of worth that waiting for outside recognition never fully can.`,
      path: `This may shift by committing to one activity that genuinely inspires you, independent of whether it's noticed or credited by anyone else, and continuing it regardless.`,
    },

    'The Overseer': {
      heading: 'The Overseer — The Tension of Managing What Isn’t Yours to Manage',
      pattern: `This placement may activate whenever someone nearby is struggling, where the automatic response is to step in and manage the situation — offering direction, oversight, or unsolicited help — rather than waiting to be asked. This may repeat as strained relationships where people feel supervised rather than supported, even when the intention behind it was genuinely caring.`,
      lesson: `The core lesson being integrated may be learning that real help waits to be invited, and that stepping back from someone else's situation is not the same as abandoning them.`,
      path: `This may shift by identifying one relationship where you habitually manage or oversee, and consciously waiting to be asked before offering input, just this once.`,
    },

    'Pride': {
      heading: 'Pride — The Tension of Charm Curdling Into Superiority',
      pattern: `This placement may activate whenever charm, attractiveness, or influence over a room comes easily, where the automatic response is a quiet sense of being above the people who don't have it — a superiority that can slide into contempt without quite meaning to. This may repeat as relationships that cool once admiration stops being offered, and a discomfort with any environment where you're not the most noticed person in it.`,
      lesson: `The core lesson being integrated may be learning that a person's worth was never actually a competition, and that real value doesn't require anyone else's to be smaller by comparison.`,
      path: `This may shift by spending real time with someone you'd normally dismiss as unimpressive, and practicing genuine curiosity about them instead of quiet evaluation.`,
    },

    'Destruction and Death': {
      heading: 'The Reckoning — The Tension of Disregarding the Human Cost',
      pattern: `This placement may activate around any pursuit of power, control, or a goal, where the automatic response under pressure is to discount the cost to the people affected by it, treating outcomes as separate from the harm required to reach them. This may repeat as a pull toward high-stakes or high-consequence situations, paired with real discomfort when the human cost becomes impossible to ignore.`,
      lesson: `The core lesson being integrated may be learning that a goal and the wellbeing of the people it passes through are never actually separate — and that a life oriented toward protecting or improving others tends to resolve this tension more than winning does.`,
      path: `This may shift by choosing one current pursuit and naming, honestly, what or who its cost has been so far — then adjusting the approach accordingly.`,
    },

    'Physical Aggression': {
      heading: 'The Coiled Response — The Tension of Meeting Stress With Force',
      pattern: `This placement may activate under stress or provocation, where the automatic response is a surge toward aggression — an outburst, an intimidating edge, a struggle to stay level — before any calmer option gets a chance to register. This may repeat as strained relationships around conflict, and a body that carries old tension in ways that surface later as physical strain.`,
      lesson: `The core lesson being integrated may be learning that the aggression is usually protecting an older, unacknowledged pain — and that examining what's underneath it tends to soften the reflex more than sheer self-control does.`,
      path: `This may shift by noticing, in the moment stress first spikes, the physical warning signs that usually precede the reaction, and using one grounding practice deliberately before responding.`,
    },

    'The Dark Magician': {
      heading: 'The Dark Magician — The Tension of Influence Without Consent',
      pattern: `This placement may activate whenever personal charisma or insight could sway a situation in your favor, where the automatic response is to use it regardless of whether the other person actually invited the influence. This may repeat as relationships that feel unbalanced in hindsight — charged and compelling in the moment, but built on persuasion rather than mutual choice.`,
      lesson: `The core lesson being integrated may be learning that real influence only holds value when it's offered with consent, not exercised on someone who hasn't actually asked for it.`,
      path: `This may shift by waiting to be asked before offering guidance or persuasion in one relationship this week, even when you're confident you're right.`,
    },

    'The Sacrificed Soul': {
      heading: 'The Sacrificed Soul — The Tension of Asking Without Words',
      pattern: `This placement may activate whenever a real need for care or attention arises, where the automatic response is to signal it indirectly — through withdrawal, minor crises, or quiet self-neglect — rather than naming the need outright. This may repeat as people around you responding generously to the indirect signal while the actual need underneath goes unspoken and only partly met.`,
      lesson: `The core lesson being integrated may be learning that asking directly for what you need is a sign of maturity, not a burden on the people who care about you.`,
      path: `This may shift by naming one specific need in plain words to someone close, instead of waiting for it to be noticed.`,
    },

    'The Warrior of Faith': {
      heading: 'The Warrior of Faith — The Tension of Certainty That Leaves No Room',
      pattern: `This placement may activate whenever your own convictions meet a differing view, where the automatic response is to press the point rather than genuinely consider the other perspective. This may repeat as relationships strained by an insistence on being right, and a social circle that quietly narrows toward people who already agree.`,
      lesson: `The core lesson being integrated may be learning that another person's differing path doesn't threaten the validity of your own, and that real influence comes through example rather than insistence.`,
      path: `This may shift by listening fully to one differing view this week without arguing back, simply to understand it rather than to respond to it.`,
    },

    'Self-Destruction': {
      heading: 'The Quiet Surrender — The Tension of Giving Up Before Trying the Next Step',
      pattern: `This placement may activate under real hardship, where the automatic response is to treat the difficulty as confirmation that things are hopeless, rather than as one obstacle among others that might still be worked through. This may repeat as a pattern of neglecting basic self-care exactly when it matters most, and a persistent difficulty recognizing your own worth independent of how things are currently going.`,
      lesson: `The core lesson being integrated may be learning that a hard chapter is not a final verdict, and that caring for yourself through it is not optional — it's what makes reaching the other side of it possible.`,
      path: `This may shift by choosing one small, concrete act of self-care today, and by naming the difficulty out loud to one trusted person rather than carrying it alone.`,
    },

    'The Dictator': {
      heading: 'The Dictator — The Tension of a Confident Mask Over Real Doubt',
      pattern: `This placement may activate whenever real self-doubt surfaces, where the automatic response is to cover it with an outward show of confidence and control rather than let anyone see the uncertainty underneath. This may repeat as a pattern of swinging between over-functioning for others and quietly resenting the imbalance, with the genuine doubt underneath rarely getting spoken aloud.`,
      lesson: `The core lesson being integrated may be learning that real strength includes the parts that are still unsure — and that showing the uncertainty tends to build more trust than the polished mask does.`,
      path: `This may shift by sharing one genuine doubt with someone trustworthy this week, rather than resolving it privately behind a confident front.`,
    },

  };

  function get(arcanaNum) {
    return nodes[arcanaNum] || null;
  }

  function getCode(codeName) {
    return codes[codeName] || null;
  }

  return { get, getCode };

})();
