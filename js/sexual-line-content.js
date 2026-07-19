'use strict';

/**
 * Destiny Matrix — Sexual Line Content
 * ────────────────────────────────────
 * A separate 26-combination naming system over the same (D, E) pair as the
 * Karmic Tail, sourced from a different section of the same source material
 * (`research/06-Relationship-Interpretations/Sexual-Line-Combinations.md`).
 *
 * The source's own prose-to-name pairing for this system is unconfirmed —
 * flagged as an extraction ambiguity, not resolved. Per explicit ruling,
 * every entry below is written fresh from the name + its implied theme
 * only; none of the ambiguous source paragraphs were used or matched to
 * a code, to avoid risking a misattributed description.
 *
 * Present-tension-only, same as every other layer in this app: activation
 * patterns, repeating relational dynamics, the lesson being integrated, and
 * how the pattern can shift. Symbolic and archetypal only, never presented
 * as literal fact — all language is hedged. Every field is continuous
 * prose. No arrays, no lists, no bullet points.
 *
 * API:
 *   DSexualLineContent.getCode(name) → { heading, pattern, lesson, path } or null
 */

window.DSexualLineContent = (function () {

  const codes = {

    'Gentle Lovers': {
      heading: 'Gentle Lovers — The Tension of Needing Constant Reassurance',
      pattern: `This placement may activate around intimacy itself, where closeness becomes the main evidence that you're genuinely loved and valued. The automatic response under pressure can be seeking repeated reassurance, even when it's already been offered, because the reassurance never quite settles as fully received. This may repeat as a pattern of measuring a relationship's health almost entirely by how often love is actively demonstrated.`,
      lesson: `The core lesson being integrated may be learning that reassurance already given can be trusted to still be true, rather than needing to be renewed constantly to feel real.`,
      path: `This may shift by noticing one moment reassurance is offered this week, and deliberately letting it land and stay, rather than seeking it again shortly after. You are allowed to be loved without proof on demand. What might trusting yesterday's reassurance free up in you today?`,
    },

    'Seekers of Perfection': {
      heading: 'Seekers of Perfection — The Tension of Discarding at the First Flaw',
      pattern: `This placement may activate once real familiarity with a partner sets in, where the automatic response is to measure them against an idealized standard rather than to keep getting to know the actual person in front of you. This may repeat as connections that end quickly at the first sign of imperfection, alongside a persistent sense that no one quite measures up.`,
      lesson: `The core lesson being integrated may be learning that real intimacy requires knowing an actual, imperfect person — not auditioning partners against a standard no one could fully meet.`,
      path: `This may shift by staying curious about one specific imperfection in a current connection this week, rather than filing it as proof the connection is wrong. You are allowed to love a real person instead of a standard. What imperfection in someone close might actually be a doorway rather than a flaw?`,
    },

    'Vengeful Dominators': {
      heading: 'Vengeful Dominators — The Tension of Control Standing in for Closeness',
      pattern: `This placement may activate whenever a partner appears vulnerable or uncertain, where the automatic response is to press for more control rather than to ease the pressure. This may repeat as a pattern of reading closeness primarily through influence over a partner's response, rather than through actual mutual trust.`,
      lesson: `The core lesson being integrated may be learning that real intimacy depends on consent and mutuality, not on how much command one person holds over the other.`,
      path: `This may shift by explicitly checking a partner's actual comfort before pursuing what you want, and letting their honest answer genuinely change your approach. You are allowed to be met, not just obeyed. What might closeness feel like if neither of you had to yield to it?`,
    },

    'Disillusioned Cynics': {
      heading: 'Disillusioned Cynics — The Tension of Testing Through Contrast',
      pattern: `This placement may activate as a relationship starts to feel secure, where the automatic response is to swing between warmth and sharpness as an unconscious test of whether a partner will stay regardless. This may repeat as a pattern of unpredictability used protectively, so that being taken for granted never quite becomes possible.`,
      lesson: `The core lesson being integrated may be learning that a partner who has to keep passing tests never gets to simply feel safe with you.`,
      path: `This may shift by choosing consistency over contrast in one interaction this week, even when the old instinct to unsettle things flares up. You are allowed to be stayed with — no tests required. What would it mean to let someone simply feel safe with you?`,
    },

    'Rebellious Servants': {
      heading: 'Rebellious Servants — The Tension of Devotion That Erases the Self',
      pattern: `This placement may activate around a partner who feels genuinely different or unconventional, where the automatic response is to dissolve your own preferences entirely into understanding and serving them. This may repeat as an "us against the world" closeness that feels intense, while your own individual needs quietly disappear inside it.`,
      lesson: `The core lesson being integrated may be learning that devotion costing your whole identity isn't intimacy — it's disappearance dressed as closeness.`,
      path: `This may shift by naming one preference of your own this week, and holding it even inside a relationship built around total accommodation. You are allowed to exist inside your own devotion. What preference of yours has been quietly waiting to be counted?`,
    },

    'Forbidden Dreamers': {
      heading: 'Forbidden Dreamers — The Tension of Love Shadowed by Possession',
      pattern: `This placement may activate within an otherwise real bond, where the automatic response under pressure is a persistent fear of losing it — suspicion or jealousy arriving even without clear evidence, alongside a pull toward controlling the partner rather than trusting the connection itself.`,
      lesson: `The core lesson being integrated may be learning that a bond has to be able to survive not being controlled in order to actually be trusted.`,
      path: `This may shift by noticing one moment jealousy arises without real evidence, and voicing the underlying fear directly instead of acting to control the situation. You are allowed to love without gripping. If the fear were spoken instead of enforced — what might your partner finally get to offer you?`,
    },

    'Possessive Punishers': {
      heading: 'Possessive Punishers — The Tension of Punishing Suspected Betrayal',
      pattern: `This placement may activate around small, ambiguous signals from a partner, where the automatic response is to read them as proof of betrayal and respond with an urge to punish or control rather than to simply ask. This may repeat as cycles of suspicion followed by reactive control, rarely resolved by direct conversation.`,
      lesson: `The core lesson being integrated may be learning that the suspicion usually needs to be named and checked honestly, not acted on before it's confirmed.`,
      path: `This may shift by asking directly the next time suspicion flares, and letting the honest answer — whatever it is — actually settle the moment. You are allowed to ask before you accuse. What would change if suspicion had to earn its evidence first?`,
    },

    'Detached Lovers': {
      heading: 'Detached Lovers — The Tension of Staying One Step Removed',
      pattern: `This placement may activate even within physical or romantic closeness, where the automatic response is to keep real emotional stakes at a careful distance, so intimacy stays interesting without becoming fully vulnerable. This may repeat as connections that look close from the outside while remaining, underneath, quietly guarded.`,
      lesson: `The core lesson being integrated may be learning that closeness which never risks real vulnerability stays safe, but also stays incomplete.`,
      path: `This may shift by letting one moment of genuine emotional stake show through this week, rather than the usual practiced distance. You are allowed to want this fully and let it show. What might one undefended moment reveal that a hundred careful ones never have?`,
    },

    'Versatile Lovers': {
      heading: 'Versatile Lovers — The Tension of Needing Constant Reinvention',
      pattern: `This placement may activate once a relationship settles into a steady rhythm, where the automatic response is to read that stability as stagnation rather than as security. This may repeat as a pull toward reinventing the shape of a connection repeatedly, even when nothing about it has actually gone wrong.`,
      lesson: `The core lesson being integrated may be learning that some of the deepest connection lives in the parts that don't need to keep changing to stay alive.`,
      path: `This may shift by noticing one steady, unchanging part of a relationship this week, and letting it be enough without reaching to reinvent it. You are allowed to let steadiness be a form of passion. What in this connection is quietly good exactly as it is?`,
    },

    'Vulnerable Rebels': {
      heading: 'Vulnerable Rebels — The Tension of a Tough Front Over Real Tenderness',
      pattern: `This placement may activate at the smallest criticism or provocation, where the automatic response is a defensiveness that lands far harder than the moment actually called for, protecting a tenderness that rarely gets shown directly. This may repeat as a pattern of appearing unshaken while something much softer sits just underneath.`,
      lesson: `The core lesson being integrated may be learning that the tenderness underneath the front is not a weakness that needs hiding from someone genuinely trustworthy.`,
      path: `This may shift by letting one piece of real vulnerability show to a partner this week, instead of meeting the moment with the usual toughened front. You are allowed to be soft with someone who's earned it. What tenderness have you been guarding that's ready to be seen?`,
    },

    'Aimless Lover': {
      heading: 'Aimless Lover — The Tension of Drifting Without a Direction',
      pattern: `This placement may activate once a connection has been going on for a while, where the automatic response is to continue alongside it without ever quite deciding what it actually is or where it's headed. This may repeat as relationships that stay pleasant but undefined, deferred rather than genuinely chosen.`,
      lesson: `The core lesson being integrated may be learning that giving a connection real direction requires choosing it on purpose, not simply continuing to drift alongside it.`,
      path: `This may shift by naming, out loud, what you actually want from one current connection, rather than letting it remain undefined. You are allowed to choose on purpose instead of drifting. If you had to name what this connection is — what would you call it?`,
    },

    'Awakening Through Crisis': {
      heading: 'Awakening Through Crisis — The Tension of Needing Turmoil to Feel Alive',
      pattern: `This placement may activate specifically under stress, conflict, or drama, where connection and desire intensify sharply — while calm, stable stretches can start to feel flat by comparison. This may repeat as an unconscious pull toward difficulty, simply because it reliably brings the intensity back.`,
      lesson: `The core lesson being integrated may be learning that intimacy doesn't require a crisis to justify its intensity — calm can carry its own aliveness once it's genuinely given the chance.`,
      path: `This may shift by bringing full, deliberate attention to one calm, uneventful moment with a partner this week, rather than waiting for drama to feel engaged. You are allowed to feel alive in the quiet too. What might calm be offering you that crisis never could?`,
    },

    'Pioneer of Desire': {
      heading: 'Pioneer of Desire — The Tension of Restlessness Toward Routine',
      pattern: `This placement may activate once a connection becomes familiar, where the automatic response is to register predictability as a loss of charge rather than as a sign of real security. This may repeat as a pattern of chasing what's unfamiliar, even in an otherwise good and stable relationship.`,
      lesson: `The core lesson being integrated may be learning that routine and aliveness aren't actually opposites — depth can be its own kind of unexplored territory.`,
      path: `This may shift by bringing genuine curiosity to one familiar, routine moment with a partner, treating it as unexplored rather than already fully known. You are allowed to find the frontier inside familiarity. What is still undiscovered in the person you think you already know?`,
    },

    'Masked Provocateurs': {
      heading: 'Masked Provocateurs — The Tension of a Public Self That Hides the Private One',
      pattern: `This placement may activate around the gap between how you present outwardly and what's actually true in private, where the automatic response is to let that gap widen rather than close, since it feels safer to be seen than to be fully known. This may repeat as intimacy that stays interesting through contrast, without ever becoming fully honest.`,
      lesson: `The core lesson being integrated may be learning that being known — front and private self both — tends to deepen intimacy more than the contrast between them ever could.`,
      path: `This may shift by letting the gap between the two selves narrow slightly with one trusted person, showing a little more of what's usually kept private. You are allowed to be known, not just witnessed. What piece of your private self is ready to meet the light?`,
    },

    'Magnetic Seducers': {
      heading: 'Magnetic Seducers — The Tension of Charm That Keeps Commitment at Bay',
      pattern: `This placement may activate once a connection starts moving toward something more defined, where the automatic response is to reintroduce a little distance or ambiguity, keeping the pursuit alive at the cost of ever fully landing anywhere. This may repeat as many drawn-in connections and comparatively few that deepen into something committed.`,
      lesson: `The core lesson being integrated may be learning that commitment doesn't require giving up what makes a connection magnetic — the charm doesn't have to be spent to keep someone close.`,
      path: `This may shift by choosing one connection and deliberately letting the ambiguity drop, offering clarity instead of continued pursuit. You are allowed to land somewhere and still be magnetic. What might commitment give you that the chase keeps promising and never delivers?`,
    },

    'Nostalgics of the Past': {
      heading: 'Nostalgics of the Past — The Tension of Measuring the Present Against a Memory',
      pattern: `This placement may activate within a current connection, where the automatic response is to measure it against an idealized version of a past one — a memory that's had time to be smoothed into something better than it actually was. This may repeat as a present relationship that rarely gets evaluated fully on its own terms.`,
      lesson: `The core lesson being integrated may be learning that every connection is genuinely unrepeatable — the present one was never actually competing with the past, only with an idealized version of it.`,
      path: `This may shift by noticing one moment of comparing a current connection to a past one, and deliberately letting the present be judged only on its own terms. You are allowed to let the past be finished. What is present-tense love offering you right now that memory can't?`,
    },

    'Nostalgic Visionaries': {
      heading: 'Nostalgic Visionaries — The Tension of Idealizing What Intimacy Should Feel Like',
      pattern: `This placement may activate around an inner vision of what deep emotional resonance is supposed to feel like, where the automatic response is to measure real connections against that vision rather than to be fully present with what's actually here. This may repeat as good, genuine relationships that still quietly disappoint by comparison to the ideal.`,
      lesson: `The core lesson being integrated may be learning that fully inhabiting the real connection, rather than the idealized one, is where the fulfillment being sought actually becomes available.`,
      path: `This may shift by naming one way a current connection is quietly being measured against an ideal, and choosing to meet the real version of it instead. You are allowed to let the real thing be enough. Where is the actual connection quietly outperforming the ideal one?`,
    },

    'Changeable Explorers': {
      heading: 'Changeable Explorers — The Tension of Novelty as a Requirement for Attraction',
      pattern: `This placement may activate as familiarity with a partner grows, where the automatic response is a drift in attention toward what's next rather than a deepening of what's already here. This may repeat as a connection's appeal feeling closely tied to how new or unfamiliar it still is.`,
      lesson: `The core lesson being integrated may be learning that depth is its own kind of novelty — there's more still to discover in an already-known connection than the restless instinct assumes.`,
      path: `This may shift by deliberately looking for what's still unexplored in one already-familiar connection, rather than looking outward for something new. You are allowed to go deeper instead of wider. What unopened room exists in the connection you already have?`,
    },

    'Unsatisfied Romantics': {
      heading: 'Unsatisfied Romantics — The Tension of a Full Life That Still Feels Incomplete',
      pattern: `This placement may activate even when relationships and experiences look vibrant and full from the outside, where an inner sense of genuine connection stays just out of reach, leaving a quiet dissatisfaction that's hard to name. This may repeat as more experience without more depth.`,
      lesson: `The core lesson being integrated may be learning that the missing piece is usually depth, not more experience — quantity of connection was never a substitute for its quality.`,
      path: `This may shift by choosing one existing connection and going deliberately deeper into it this week, rather than adding something new to the mix. You are allowed to want depth and pursue it directly. If more experience isn't the answer — what is the one connection asking to be deepened?`,
    },

    'Devoted Servants': {
      heading: 'Devoted Servants — The Tension of Wholeness Found Only in Total Giving',
      pattern: `This placement may activate within a committed bond, where the automatic response is a devotion so complete that your own identity and needs quietly dissolve into the partner's, leaving you feeling unmoored without someone to give to this fully. This may repeat as a pattern of giving that isn't matched by receiving.`,
      lesson: `The core lesson being integrated may be learning that mutual respect requires devotion to be received and reciprocated, not simply given without limit.`,
      path: `This may shift by naming one of your own needs directly to a partner this week, rather than continuing to route all attention toward theirs. You are allowed to receive with the same fullness you give. What need of yours deserves the devotion you offer everyone else?`,
    },

    'Lovers of Contrasts': {
      heading: 'Lovers of Contrasts — The Tension of Needing Opposite Forces to Feel Whole',
      pattern: `This placement may activate around a partner who embodies a strong contrast to your own nature, where the automatic response is to feel that only this contrast can make you feel complete. This may repeat as connections too similar to yourself starting to feel flat by comparison.`,
      lesson: `The core lesson being integrated may be learning that wholeness is available within yourself, not only through a partner who supplies what feels missing.`,
      path: `This may shift by noticing one quality you usually seek in a contrasting partner, and practicing developing a small piece of it in yourself directly. You are allowed to be whole on your own frequency. What quality you keep seeking in others is quietly waiting to grow in you?`,
    },

    'Extreme Lovers': {
      heading: 'Extreme Lovers — The Tension of All-or-Nothing Intimacy',
      pattern: `This placement may activate around emotional intensity itself, where connection tends to run at full force or barely at all, with the calmer middle ground of ordinary, steady closeness feeling somehow insufficient. This may repeat as relationships marked by dramatic highs and equally dramatic ruptures.`,
      lesson: `The core lesson being integrated may be learning that sustainable intimacy usually lives in the steady middle, not in the extremes that feel most alive in the moment.`,
      path: `This may shift by choosing one moderate, undramatic act of closeness this week, and letting it be enough without needing to escalate it. You are allowed to let ordinary closeness count as intimacy. What might the steady middle hold that the extremes keep drowning out?`,
    },

    'Idealistic Revolutionaries': {
      heading: 'Idealistic Revolutionaries — The Tension of Needing a Partner Who Shares the Cause',
      pattern: `This placement may activate around shared belief or purpose, where the automatic response is to feel that a connection is only fully real when it's built around a shared ideal — making a partner without that same conviction harder to fully trust or invest in. This may repeat as intimacy conditioned on ideological alignment.`,
      lesson: `The core lesson being integrated may be learning that a relationship can hold real intimacy even without full alignment on belief — shared values are not the only foundation for genuine closeness.`,
      path: `This may shift by staying close through one area of genuine difference in belief with a partner this week, rather than treating it as disqualifying. You are allowed to be loved by someone who sees the world differently. What might a differing conviction teach the connection rather than threaten it?`,
    },

    'Cycle of the Past': {
      heading: 'Cycle of the Past — The Tension of Repeating What Hasn’t Been Released',
      pattern: `This placement may activate even while genuinely wanting something new, where a familiar relational scenario keeps recreating itself — a different setting, a different person, but the same underlying shape. This may repeat as a pattern that feels consciously unwanted yet keeps returning anyway.`,
      lesson: `The core lesson being integrated may be learning that awareness and release of the old pattern, more than effort inside the new relationship, is what actually breaks the cycle.`,
      path: `This may shift by naming specifically which past pattern feels most familiar right now, and consciously choosing one different response to it this time. You are allowed to leave the loop, even mid-turn. When this familiar scenario begins again — what will you do differently first?`,
    },

    'Disillusioned Hunter': {
      heading: 'Disillusioned Hunter — The Tension of Losing Interest Once the Chase Ends',
      pattern: `This placement may activate once a connection is genuinely secured, where the automatic response is a quiet fading of interest right at the point the pursuit resolves, leaving behind more disappointment than either person anticipated. This may repeat as many pursuits and comparatively few connections carried past the point of capture.`,
      lesson: `The core lesson being integrated may be learning that what happens after the pursuit is where real intimacy actually starts — treating capture as the goal already met is what keeps costing you the connection.`,
      path: `This may shift by choosing one already-secured connection and deliberately investing in what comes after the chase, rather than looking for the next pursuit. You are allowed to stay past the capture and be surprised. What might the after actually hold, if the chase was never the point?`,
    },

  };

  function getCode(codeName) {
    return codes[codeName] || null;
  }

  return { getCode };

})();
