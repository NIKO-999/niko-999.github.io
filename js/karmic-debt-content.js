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
      heading: 'Strength — The Tension of Holding Everything Alone',
      pattern: `This placement may activate under real pressure or difficulty, where the automatic response is to grip tighter and manage the situation single-handedly rather than to let anyone else share the weight of it. This may repeat as a pattern of being reliably strong for other people while rarely, if ever, being the one who receives that same support in return — not because support isn't offered, but because accepting it doesn't come as naturally as providing it.`,
      lesson: `The core lesson being integrated may be learning that asking for help is not a departure from strength but an extension of it — that genuine resilience includes knowing when to let something be carried by more than one person.`,
      path: `This may shift through small, deliberate practice in naming a real need to someone else this week, rather than a preference, and allowing the request to stand without immediately managing or minimizing it.`,
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
      heading: 'Justice — The Tension of a Standard Applied Unevenly',
      pattern: `This placement may activate around situations involving fairness, where the automatic response is a sharp, almost immediate read of what's imbalanced — paired with a much quieter, harder-to-access awareness of where a similar imbalance might exist in your own conduct. This may repeat as recurring encounters with unfairness that can feel oddly personal, as though the same lesson keeps finding new circumstances to arrive in.`,
      lesson: `The core lesson being integrated may be learning to apply the same honest, careful standard to yourself that gets applied so readily to others — closing the gap between the fairness demanded of the world and the fairness practiced internally.`,
      path: `This may shift by choosing one specific situation and asking, deliberately, whether you're holding yourself to the same standard you're applying to someone else, and adjusting accordingly.`,
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

    'Betrayal of Family / Pride': {
      heading: 'Betrayal of Family — The Tension of Pride Over Loyalty',
      pattern: `This placement may activate specifically within family or origin-based relationships, where the automatic response under pressure is to protect pride or position rather than to stay loyal to the people with a legitimate claim on your care. This may repeat as a pattern of distance or friction in family contexts specifically, even when the same difficulty is handled easily elsewhere.`,
      lesson: `The core lesson being integrated may be learning that loyalty and personal advancement don't have to compete — and that humility toward family, specifically, doesn't cost what pride may be insisting it will.`,
      path: `This may shift by choosing one specific family relationship and practicing an act of humility there directly — an acknowledgment, an apology, a genuine ask for repair — rather than letting pride continue to hold the distance in place.`,
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
