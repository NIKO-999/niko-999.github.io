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
 * as literal fact — all language is hedged ("may", "can"), even in Golden
 * Standard voice. Every field is continuous prose. No arrays, no lists,
 * no bullet points.
 *
 * API:
 *   DSexualLineContent.getCode(name) → { title, mastery, shadow, invitation } or null
 */

window.DSexualLineContent = (function () {

  const codes = {

    'Gentle Lovers': {
      title: 'Gentle Lovers — The Tension of Needing Constant Reassurance',
      mastery: `Underneath this tension may sit a genuine capacity for closeness — real attentiveness to a relationship's emotional temperature, and a real desire to stay securely connected. That attentiveness, once it learns to trust reassurance already given, may become a settled kind of intimacy: love that doesn't need to be constantly re-proven to feel real. What may connect every expression of this placement is real relational sensitivity, a genuine gift for closeness. Integrated, this may look like reassurance finally trusted to still be true days after it was offered.`,
      shadow: `This placement may activate around intimacy itself, where closeness becomes the main evidence that you're genuinely loved and valued. The automatic response under pressure can be seeking repeated reassurance, even when it's already been offered, because the reassurance never quite settles as fully received. This may repeat as a pattern of measuring a relationship's health almost entirely by how often love is actively demonstrated. Over time, that pattern can leave a partner feeling like nothing they offer is ever quite enough, no matter how sincerely it's given.`,
      invitation: `Notice one moment reassurance is offered this week. Let it land and stay, rather than seeking it again shortly after. You are allowed to be loved without proof on demand. What might trusting yesterday's reassurance free up in you today?`,
    },

    'Seekers of Perfection': {
      title: 'Seekers of Perfection — The Tension of Discarding at the First Flaw',
      mastery: `Underneath this tension may sit a genuine capacity for high standards — real discernment about what a relationship could actually be at its best. That discernment, once turned toward the real person in front of you rather than an idealized one, may become the ability to see someone fully and choose them anyway. What may connect every expression of this placement is real relational vision, a genuine gift for imagining depth. Integrated, this may look like an actual, imperfect person finally chosen over the standard.`,
      shadow: `This placement may activate once real familiarity with a partner sets in, where the automatic response is to measure them against an idealized standard rather than to keep getting to know the actual person in front of you. This may repeat as connections that end quickly at the first sign of imperfection, alongside a persistent sense that no one quite measures up. Over time, that pattern can leave a string of promising early connections and very few that ever got the chance to actually deepen. The standard itself rarely gets questioned, even as it keeps ruling out person after otherwise-good person.`,
      invitation: `Stay curious about one specific imperfection in a current connection this week. Let it be information about a real person rather than proof the connection is wrong. You are allowed to love a real person instead of a standard. What imperfection in someone close might actually be a doorway rather than a flaw?`,
    },

    'Vengeful Dominators': {
      title: 'Vengeful Dominators — The Tension of Control Standing in for Closeness',
      mastery: `Underneath this tension may sit a genuine capacity for presence — real attentiveness to a partner's shifts and vulnerabilities that most people miss entirely. That attentiveness, once it moves toward ease rather than control, may become the ability to actually meet someone in a vulnerable moment rather than manage them through it. What may connect every expression of this placement is real relational awareness, a genuine sensitivity to a partner's state. Integrated, this may look like closeness built on mutual trust rather than command.`,
      shadow: `This placement may activate whenever a partner appears vulnerable or uncertain, where the automatic response is to press for more control rather than to ease the pressure. This may repeat as a pattern of reading closeness primarily through influence over a partner's response, rather than through actual mutual trust. Over time, that pattern can leave a partner complying rather than genuinely connecting, a difference that tends to surface eventually. Compliance can look like closeness for a while, right up until it doesn't.`,
      invitation: `Check a partner's actual comfort explicitly before pursuing what you want. Let their honest answer genuinely change your approach. You are allowed to be met, not just obeyed. What might closeness feel like if neither of you had to yield to it?`,
    },

    'Disillusioned Cynics': {
      title: 'Disillusioned Cynics — The Tension of Testing Through Contrast',
      mastery: `Underneath this tension may sit a genuine capacity for emotional range — real depth of feeling that most relationships never actually get to see. That range, once it stops being used as a test, may become genuine intimacy: consistency that lets a partner feel truly safe rather than perpetually assessed. What may connect every expression of this placement is real emotional depth, a genuine capacity for both warmth and edge. Integrated, this may look like a partner who no longer has to keep proving they'll stay.`,
      shadow: `This placement may activate as a relationship starts to feel secure, where the automatic response is to swing between warmth and sharpness as an unconscious test of whether a partner will stay regardless. This may repeat as a pattern of unpredictability used protectively, so that being taken for granted never quite becomes possible. Over time, that pattern can exhaust a partner who genuinely wanted to stay, and never actually needed the testing. The test rarely feels like a test from the inside — it just feels like being honest, even when it's actually strategy.`,
      invitation: `Choose consistency over contrast in one interaction this week. Do it even when the old instinct to unsettle things flares up. You are allowed to be stayed with — no tests required. What would it mean to let someone simply feel safe with you?`,
    },

    'Rebellious Servants': {
      title: 'Rebellious Servants — The Tension of Devotion That Erases the Self',
      mastery: `Underneath this tension may sit a genuine capacity for devotion — real, deep willingness to understand and support a partner who feels different or unconventional. That devotion, once it includes your own preferences too, may become intimacy built on two full people rather than one dissolved into the other. What may connect every expression of this placement is real relational commitment, a genuine gift for closeness. Integrated, this may look like an "us against the world" bond that still has room for your own voice inside it.`,
      shadow: `This placement may activate around a partner who feels genuinely different or unconventional, where the automatic response is to dissolve your own preferences entirely into understanding and serving them. This may repeat as an "us against the world" closeness that feels intense, while your own individual needs quietly disappear inside it. Over time, that pattern can leave you feeling more like a supporting role in your own relationship than a genuine partner in it. The intensity of the bond can make the self-erasure feel like devotion rather than what it actually is, a real cost.`,
      invitation: `Name one preference of your own this week. Hold it even inside a relationship built around total accommodation. You are allowed to exist inside your own devotion. What preference of yours has been quietly waiting to be counted?`,
    },

    'Forbidden Dreamers': {
      title: 'Forbidden Dreamers — The Tension of Love Shadowed by Possession',
      mastery: `Underneath this tension may sit a genuine capacity for deep attachment — real, considerable investment in a bond that actually matters to you. That attachment, once it trusts the bond rather than tries to control it, may become genuine security: love that can survive not gripping. What may connect every expression of this placement is real depth of feeling, a genuine capacity for love that matters. Integrated, this may look like a bond finally trusted enough to be left uncontrolled.`,
      shadow: `This placement may activate within an otherwise real bond, where the automatic response under pressure is a persistent fear of losing it — suspicion or jealousy arriving even without clear evidence, alongside a pull toward controlling the partner rather than trusting the connection itself. Over time, that pattern can slowly suffocate the very bond it was trying so hard to protect. The fear of losing it can end up producing exactly the distance it was so afraid of. Jealousy without evidence can feel like intuition, when it's often just an old fear speaking loudly.`,
      invitation: `Notice one moment jealousy arises without real evidence. Voice the underlying fear directly instead of acting to control the situation. You are allowed to love without gripping. If the fear were spoken instead of enforced, what might your partner finally get to offer you?`,
    },

    'Possessive Punishers': {
      title: 'Possessive Punishers — The Tension of Punishing Suspected Betrayal',
      mastery: `Underneath this tension may sit a genuine capacity for vigilance — real, sharp attentiveness to small signals in a relationship that most people miss entirely. That vigilance, once it's checked against real evidence rather than acted on immediately, may become genuine perceptiveness: the ability to notice something worth naming and actually ask about it. What may connect every expression of this placement is real relational attentiveness, a genuine sensitivity to small shifts. Integrated, this may look like suspicion finally checked honestly instead of punished.`,
      shadow: `This placement may activate around small, ambiguous signals from a partner, where the automatic response is to read them as proof of betrayal and respond with an urge to punish or control rather than to simply ask. This may repeat as cycles of suspicion followed by reactive control, rarely resolved by direct conversation. Over time, that pattern can create the exact distance and secrecy it was originally trying to prevent. Suspicion acted on before it's checked rarely gets the chance to be proven wrong.`,
      invitation: `Ask directly the next time suspicion flares. Let the honest answer, whatever it is, actually settle the moment. You are allowed to ask before you accuse. What would change if suspicion had to earn its evidence first?`,
    },

    'Detached Lovers': {
      title: 'Detached Lovers — The Tension of Staying One Step Removed',
      mastery: `Underneath this tension may sit a genuine capacity for self-possession — real, considerable steadiness that keeps you from losing yourself entirely inside a relationship. That steadiness, once it allows real vulnerability alongside it, may become intimacy that's both grounded and fully present. What may connect every expression of this placement is real emotional composure, a genuine capacity for staying whole. Integrated, this may look like closeness that finally risks the vulnerability it's always been capable of.`,
      shadow: `This placement may activate even within physical or romantic closeness, where the automatic response is to keep real emotional stakes at a careful distance, so intimacy stays interesting without becoming fully vulnerable. This may repeat as connections that look close from the outside while remaining, underneath, quietly guarded. Over time, that guardedness can leave both people technically together and quietly, mutually lonely. The distance that keeps things safe is often the exact thing keeping the closeness from ever becoming real.`,
      invitation: `Let one moment of genuine emotional stake show through this week. Choose it deliberately, rather than the usual practiced distance. You are allowed to want this fully and let it show. What might one undefended moment reveal that a hundred careful ones never have?`,
    },

    'Versatile Lovers': {
      title: 'Versatile Lovers — The Tension of Needing Constant Reinvention',
      mastery: `Underneath this tension may sit a genuine capacity for aliveness — real, considerable appetite for connection that keeps evolving rather than settling into routine. That appetite, once it finds depth as its own form of novelty, may become the ability to keep discovering someone you already know well. What may connect every expression of this placement is real relational vitality, a genuine gift for keeping connection alive. Integrated, this may look like stability finally read as security rather than stagnation.`,
      shadow: `This placement may activate once a relationship settles into a steady rhythm, where the automatic response is to read that stability as stagnation rather than as security. This may repeat as a pull toward reinventing the shape of a connection repeatedly, even when nothing about it has actually gone wrong. Over time, that pattern can unsettle a partner who was never actually looking for anything to be fixed. Stability this steady can start to feel, wrongly, like something has gone quiet that needs waking back up.`,
      invitation: `Notice one steady, unchanging part of a relationship this week. Let it be enough without reaching to reinvent it. You are allowed to let steadiness be a form of passion. What in this connection is quietly good exactly as it is?`,
    },

    'Vulnerable Rebels': {
      title: 'Vulnerable Rebels — The Tension of a Tough Front Over Real Tenderness',
      mastery: `Underneath this tension may sit a genuine capacity for real feeling — a tenderness that runs deeper than the tough front usually lets on. That tenderness, once it's actually shown to someone trustworthy, may become the foundation of a real, undefended intimacy. What may connect every expression of this placement is real emotional depth, a genuine capacity for softness. Integrated, this may look like the front finally lowered for someone who's earned it.`,
      shadow: `This placement may activate at the smallest criticism or provocation, where the automatic response is a defensiveness that lands far harder than the moment actually called for, protecting a tenderness that rarely gets shown directly. This may repeat as a pattern of appearing unshaken while something much softer sits just underneath. Over time, that pattern can leave even close partners unsure whether they're actually being let in. The toughness protects something real, but it can also quietly convince a partner there's nothing softer underneath to protect.`,
      invitation: `Let one piece of real vulnerability show to a partner this week. Choose it instead of meeting the moment with the usual toughened front. You are allowed to be soft with someone who's earned it. What tenderness have you been guarding that's ready to be seen?`,
    },

    'Aimless Lover': {
      title: 'Aimless Lover — The Tension of Drifting Without a Direction',
      mastery: `Underneath this tension may sit a genuine capacity for ease — real comfort with letting a connection unfold naturally, without forcing it into a premature shape. That ease, once it includes a real, chosen direction, may become the ability to let something flow and still actually choose it. What may connect every expression of this placement is real relational patience, a genuine comfort with unfolding time. Integrated, this may look like a connection finally named on purpose rather than simply continued.`,
      shadow: `This placement may activate once a connection has been going on for a while, where the automatic response is to continue alongside it without ever quite deciding what it actually is or where it's headed. This may repeat as relationships that stay pleasant but undefined, deferred rather than genuinely chosen. Over time, that pattern can leave both people investing in something neither of them ever actually agreed to. Undefined can feel safer than defined, right up until someone needs to know where they actually stand.`,
      invitation: `Name, out loud, what you actually want from one current connection. Do it rather than letting it remain undefined. You are allowed to choose on purpose instead of drifting. If you had to name what this connection is, what would you call it?`,
    },

    'Awakening Through Crisis': {
      title: 'Awakening Through Crisis — The Tension of Needing Turmoil to Feel Alive',
      mastery: `Underneath this tension may sit a genuine capacity for intensity — real, powerful aliveness that most relationships never actually access. That intensity, once it's found in calm as well as crisis, may become the ability to feel fully alive without needing difficulty to justify it. What may connect every expression of this placement is real emotional capacity, a genuine gift for depth of feeling. Integrated, this may look like calm finally recognized as its own kind of intensity.`,
      shadow: `This placement may activate specifically under stress, conflict, or drama, where connection and desire intensify sharply — while calm, stable stretches can start to feel flat by comparison. This may repeat as an unconscious pull toward difficulty, simply because it reliably brings the intensity back. Over time, that pull can quietly manufacture crises a genuinely good relationship never actually needed. Peace can start to feel like something's wrong, simply because it's unfamiliar.`,
      invitation: `Bring full, deliberate attention to one calm, uneventful moment with a partner this week. Do it rather than waiting for drama to feel engaged. You are allowed to feel alive in the quiet too. What might calm be offering you that crisis never could?`,
    },

    'Pioneer of Desire': {
      title: 'Pioneer of Desire — The Tension of Restlessness Toward Routine',
      mastery: `Underneath this tension may sit a genuine capacity for exploration — real, considerable appetite for discovery that keeps a connection genuinely interesting. That appetite, once it turns inward toward what's already familiar, may become the ability to keep discovering a person you think you already fully know. What may connect every expression of this placement is real curiosity, a genuine gift for finding new territory. Integrated, this may look like familiarity finally treated as its own frontier.`,
      shadow: `This placement may activate once a connection becomes familiar, where the automatic response is to register predictability as a loss of charge rather than as a sign of real security. This may repeat as a pattern of chasing what's unfamiliar, even in an otherwise good and stable relationship. Over time, that pattern can push you away from exactly the depth this kind of exploration was always capable of finding. Novelty is easy to chase and quick to fade, which is exactly what keeps the cycle running.`,
      invitation: `Bring genuine curiosity to one familiar, routine moment with a partner. Treat it as unexplored rather than already fully known. You are allowed to find the frontier inside familiarity. What is still undiscovered in the person you think you already know?`,
    },

    'Masked Provocateurs': {
      title: 'Masked Provocateurs — The Tension of a Public Self That Hides the Private One',
      mastery: `Underneath this tension may sit a genuine capacity for presentation — real skill at being seen and enjoyed by the people around you. That skill, once it extends to being genuinely known as well as seen, may become intimacy built on the whole person rather than the curated version of them. What may connect every expression of this placement is real social capability, a genuine gift for presence. Integrated, this may look like the private self finally let out to meet the light.`,
      shadow: `This placement may activate around the gap between how you present outwardly and what's actually true in private, where the automatic response is to let that gap widen rather than close, since it feels safer to be seen than to be fully known. This may repeat as intimacy that stays interesting through contrast, without ever becoming fully honest. Over time, that gap can leave you feeling admired but never quite met. Being seen this consistently can start to feel like enough, right up until it clearly isn't.`,
      invitation: `Let the gap between the two selves narrow slightly with one trusted person. Show a little more of what's usually kept private. You are allowed to be known, not just witnessed. What piece of your private self is ready to meet the light?`,
    },

    'Magnetic Seducers': {
      title: 'Magnetic Seducers — The Tension of Charm That Keeps Commitment at Bay',
      mastery: `Underneath this tension may sit a genuine capacity for magnetism — real, considerable charm that draws people in and makes connection feel exciting. That charm, once it's allowed to land somewhere, may become the ability to be both magnetic and actually committed at once. What may connect every expression of this placement is real relational charisma, a genuine gift for pursuit. Integrated, this may look like a connection finally allowed to land rather than perpetually chased.`,
      shadow: `This placement may activate once a connection starts moving toward something more defined, where the automatic response is to reintroduce a little distance or ambiguity, keeping the pursuit alive at the cost of ever fully landing anywhere. This may repeat as many drawn-in connections and comparatively few that deepen into something committed. Over time, that pattern can leave a genuinely promising connection unresolved simply to keep the charge going. The charge itself can start to feel like the actual relationship, rather than the doorway into one.`,
      invitation: `Choose one connection and deliberately let the ambiguity drop. Offer clarity instead of continued pursuit. You are allowed to land somewhere and still be magnetic. What might commitment give you that the chase keeps promising and never delivers?`,
    },

    'Nostalgics of the Past': {
      title: 'Nostalgics of the Past — The Tension of Measuring the Present Against a Memory',
      mastery: `Underneath this tension may sit a genuine capacity for memory and meaning — real, considerable value placed on connection that actually mattered. That capacity, once it lets the present be judged on its own terms, may become the ability to meet a current connection fully, without a ghost in the room. What may connect every expression of this placement is real relational depth, a genuine gift for meaning-making. Integrated, this may look like the present finally evaluated as itself.`,
      shadow: `This placement may activate within a current connection, where the automatic response is to measure it against an idealized version of a past one — a memory that's had time to be smoothed into something better than it actually was. This may repeat as a present relationship that rarely gets evaluated fully on its own terms. Over time, that comparison can quietly starve a genuinely good present connection of the credit it actually deserves. A memory smoothed by time is competing against a reality that was never going to look as clean.`,
      invitation: `Notice one moment of comparing a current connection to a past one. Deliberately let the present be judged only on its own terms. You are allowed to let the past be finished. What is present-tense love offering you right now that memory can't?`,
    },

    'Nostalgic Visionaries': {
      title: 'Nostalgic Visionaries — The Tension of Idealizing What Intimacy Should Feel Like',
      mastery: `Underneath this tension may sit a genuine capacity for vision — real, considerable imagination about what deep connection could actually feel like. That vision, once it's turned toward what's actually here, may become the ability to fully inhabit a real connection rather than continuously measure it. What may connect every expression of this placement is real relational imagination, a genuine gift for envisioning depth. Integrated, this may look like the real version finally allowed to be enough.`,
      shadow: `This placement may activate around an inner vision of what deep emotional resonance is supposed to feel like, where the automatic response is to measure real connections against that vision rather than to be fully present with what's actually here. This may repeat as good, genuine relationships that still quietly disappoint by comparison to the ideal. Over time, that comparison can quietly rob a genuinely good connection of the credit it deserves. An ideal never has to survive contact with real, ordinary days the way an actual relationship does.`,
      invitation: `Name one way a current connection is quietly being measured against an ideal. Choose to meet the real version of it instead. You are allowed to let the real thing be enough. Where is the actual connection quietly outperforming the ideal one?`,
    },

    'Changeable Explorers': {
      title: 'Changeable Explorers — The Tension of Novelty as a Requirement for Attraction',
      mastery: `Underneath this tension may sit a genuine capacity for curiosity — real, considerable appetite for discovery that makes connection genuinely exciting. That appetite, once it turns toward depth rather than only novelty, may become the ability to find as much to discover in an already-known connection as in a new one. What may connect every expression of this placement is real exploratory energy, a genuine gift for discovery. Integrated, this may look like depth finally recognized as its own kind of newness.`,
      shadow: `This placement may activate as familiarity with a partner grows, where the automatic response is a drift in attention toward what's next rather than a deepening of what's already here. This may repeat as a connection's appeal feeling closely tied to how new or unfamiliar it still is. Over time, that pattern can leave a genuinely good, deepening connection abandoned right at the point it was becoming most real. The familiar can start to feel used up simply because it's known, long before it's actually been fully explored.`,
      invitation: `Deliberately look for what's still unexplored in one already-familiar connection. Do it rather than looking outward for something new. You are allowed to go deeper instead of wider. What unopened room exists in the connection you already have?`,
    },

    'Unsatisfied Romantics': {
      title: 'Unsatisfied Romantics — The Tension of a Full Life That Still Feels Incomplete',
      mastery: `Underneath this tension may sit a genuine capacity for connection — real, considerable ability to draw people and experiences toward you. That capacity, once it's aimed at depth rather than quantity, may become the ability to actually reach the fulfillment that quantity alone never could. What may connect every expression of this placement is real relational abundance, a genuine gift for drawing people close. Integrated, this may look like one connection finally deepened instead of many kept wide.`,
      shadow: `This placement may activate even when relationships and experiences look vibrant and full from the outside, where an inner sense of genuine connection stays just out of reach, leaving a quiet dissatisfaction that's hard to name. This may repeat as more experience without more depth. Over time, that pattern can leave a genuinely full life feeling strangely hollow at its center. More connections rarely resolve what only real depth in one was ever going to reach.`,
      invitation: `Choose one existing connection and go deliberately deeper into it this week. Do it rather than adding something new to the mix. You are allowed to want depth and pursue it directly. If more experience isn't the answer, what is the one connection asking to be deepened?`,
    },

    'Devoted Servants': {
      title: 'Devoted Servants — The Tension of Wholeness Found Only in Total Giving',
      mastery: `Underneath this tension may sit a genuine capacity for devotion — real, deep willingness to invest fully in someone you love. That devotion, once it's matched by receiving, may become mutual, sustainable intimacy rather than a one-way current. What may connect every expression of this placement is real relational generosity, a genuine gift for commitment. Integrated, this may look like your own needs finally given the same devotion you offer everyone else.`,
      shadow: `This placement may activate within a committed bond, where the automatic response is a devotion so complete that your own identity and needs quietly dissolve into the partner's, leaving you feeling unmoored without someone to give to this fully. This may repeat as a pattern of giving that isn't matched by receiving. Over time, that imbalance can leave you feeling depleted in the exact relationship meant to sustain you. Total giving can feel like love while it's happening, even as it quietly empties out the person doing it.`,
      invitation: `Name one of your own needs directly to a partner this week. Do it rather than continuing to route all attention toward theirs. You are allowed to receive with the same fullness you give. What need of yours deserves the devotion you offer everyone else?`,
    },

    'Lovers of Contrasts': {
      title: 'Lovers of Contrasts — The Tension of Needing Opposite Forces to Feel Whole',
      mastery: `Underneath this tension may sit a genuine capacity for appreciation — real, considerable openness to qualities different from your own. That openness, once it turns inward as well as outward, may become the ability to feel whole regardless of who a partner turns out to be. What may connect every expression of this placement is real relational openness, a genuine gift for appreciating difference. Integrated, this may look like wholeness finally sourced from within rather than only supplied by contrast.`,
      shadow: `This placement may activate around a partner who embodies a strong contrast to your own nature, where the automatic response is to feel that only this contrast can make you feel complete. This may repeat as connections too similar to yourself starting to feel flat by comparison. Over time, that pattern can quietly rule out connections that were actually good, simply because they didn't supply the missing piece. Needing a partner to supply what feels missing can quietly outsource work that was always yours to do.`,
      invitation: `Notice one quality you usually seek in a contrasting partner. Practice developing a small piece of it in yourself directly. You are allowed to be whole on your own frequency. What quality you keep seeking in others is quietly waiting to grow in you?`,
    },

    'Extreme Lovers': {
      title: 'Extreme Lovers — The Tension of All-or-Nothing Intimacy',
      mastery: `Underneath this tension may sit a genuine capacity for intensity — real, considerable emotional range that most relationships never fully access. That range, once it makes room for the steady middle too, may become sustainable intimacy that's both alive and durable. What may connect every expression of this placement is real emotional capacity, a genuine gift for depth of feeling. Integrated, this may look like ordinary closeness finally counted as real intimacy.`,
      shadow: `This placement may activate around emotional intensity itself, where connection tends to run at full force or barely at all, with the calmer middle ground of ordinary, steady closeness feeling somehow insufficient. This may repeat as relationships marked by dramatic highs and equally dramatic ruptures. Over time, that pattern can wear out even a genuinely strong bond simply by never letting it rest. The middle can feel like settling, even when it's actually where the relationship would be safest to live.`,
      invitation: `Choose one moderate, undramatic act of closeness this week. Let it be enough without needing to escalate it. You are allowed to let ordinary closeness count as intimacy. What might the steady middle hold that the extremes keep drowning out?`,
    },

    'Idealistic Revolutionaries': {
      title: 'Idealistic Revolutionaries — The Tension of Needing a Partner Who Shares the Cause',
      mastery: `Underneath this tension may sit a genuine capacity for conviction — real, deep commitment to something larger than yourself. That conviction, once it makes room for real intimacy without full ideological agreement, may become a relationship that holds both closeness and genuine difference at once. What may connect every expression of this placement is real depth of belief, a genuine gift for purpose. Integrated, this may look like a partner's differing view finally met with curiosity instead of disqualification.`,
      shadow: `This placement may activate around shared belief or purpose, where the automatic response is to feel that a connection is only fully real when it's built around a shared ideal — making a partner without that same conviction harder to fully trust or invest in. This may repeat as intimacy conditioned on ideological alignment. Over time, that condition can quietly rule out a partner who was genuinely right for you in every way except one. One disagreement can start to represent the whole relationship, even when it's actually just one honest difference among many agreements.`,
      invitation: `Stay close through one area of genuine difference in belief with a partner this week. Do it rather than treating it as disqualifying. You are allowed to be loved by someone who sees the world differently. What might a differing conviction teach the connection rather than threaten it?`,
    },

    'Cycle of the Past': {
      title: 'Cycle of the Past — The Tension of Repeating What Hasn’t Been Released',
      mastery: `Underneath this tension may sit a genuine capacity for pattern recognition — real, considerable insight into your own relational history once you actually look at it directly. That insight, once it's actually acted on, may become the ability to finally interrupt a shape that's been repeating for a long time. What may connect every expression of this placement is real self-awareness, a genuine capacity to notice a repeating pattern. Integrated, this may look like the old shape finally recognized in real time, not just afterward.`,
      shadow: `This placement may activate even while genuinely wanting something new, where a familiar relational scenario keeps recreating itself — a different setting, a different person, but the same underlying shape. This may repeat as a pattern that feels consciously unwanted yet keeps returning anyway. Over time, that repetition can start to feel like fate rather than what it actually is, an unreleased pattern still waiting for a different response. The new setting and the new person can make the old shape genuinely hard to recognize until it's already well underway.`,
      invitation: `Name specifically which past pattern feels most familiar right now. Consciously choose one different response to it this time. You are allowed to leave the loop, even mid-turn. When this familiar scenario begins again, what will you do differently first?`,
    },

    'Disillusioned Hunter': {
      title: 'Disillusioned Hunter — The Tension of Losing Interest Once the Chase Ends',
      mastery: `Underneath this tension may sit a genuine capacity for pursuit — real, considerable energy and skill at drawing someone toward real connection. That energy, once it's redirected toward what comes after the capture, may become the ability to invest as fully in staying as you do in chasing. What may connect every expression of this placement is real relational drive, a genuine gift for pursuit. Integrated, this may look like the after finally treated as its own kind of adventure.`,
      shadow: `This placement may activate once a connection is genuinely secured, where the automatic response is a quiet fading of interest right at the point the pursuit resolves, leaving behind more disappointment than either person anticipated. This may repeat as many pursuits and comparatively few connections carried past the point of capture. Over time, that pattern can leave a trail of people who were genuinely won and then quietly lost interest in. The chase itself can start to feel like the only part of connection that actually holds your attention.`,
      invitation: `Choose one already-secured connection and deliberately invest in what comes after the chase. Do it rather than looking for the next pursuit. You are allowed to stay past the capture and be surprised. What might the after actually hold, if the chase was never the point?`,
    },

  };

  function getCode(codeName) {
    return codes[codeName] || null;
  }

  return { getCode };
})();
