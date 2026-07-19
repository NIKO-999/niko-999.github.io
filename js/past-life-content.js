'use strict';

/**
 * Destiny Matrix — Past Life Star Content
 * ─────────────────────────────────────────
 * Origin-imprint layer only. This star sits beyond the Karmic Tail star
 * (D) on the same axis and reuses D's own value directly — D is already
 * canonically "past-life lessons" (see CLAUDE.md); this is the deep-dive
 * expansion of that same number, not a competing calculation.
 *
 * Symbolic and archetypal only — never presented as literal fact. All
 * language is hedged ("may suggest," "could indicate," "this pattern may
 * reflect"). Present-life behavior, activation, lessons, and growth paths
 * belong to the separate Karmic Debt Node (js/karmic-debt-content.js) —
 * this file must never cross into that territory.
 *
 * Every field is continuous prose. No arrays, no lists, no bullet points.
 *
 * API:
 *   DPastLifeContent.get(arcanaNum) → { heading, expressions, theme, imprint, today } or null
 */

window.DPastLifeContent = (function () {

  const nodes = {

    1: {
      heading: 'The Magician — An Origin Imprint of Beginning Without Finishing',
      expressions: `This placement may suggest a symbolic origin pattern organized around initiation — a past identity that could have moved fluidly between ventures, ideas, or influence without needing to see any of them through to completion. In one expression, this might reflect a lifetime of real talent used to charm or persuade rather than to build anything lasting. In another, it could point toward a life where beginning things again and again became its own form of identity, and where the harder, less visible work of staying with something never quite got learned. It may also suggest a pattern of wielding influence over people or circumstances without ever being asked to account for the effect of that influence, or a life where genuine capability was mistaken, by others and perhaps by the self, for a kind of permanent exemption from consequence.`,
      theme: `Across these possible expressions, what may connect them is a relationship with momentum that was never quite matched by a relationship with follow-through — the beginning consistently more developed than the completion. This is not framed as a flaw so much as an imbalance: real capacity for origination that could have outpaced the corresponding capacity for staying present once the initial spark had passed.`,
      imprint: `The emotional residue that may have carried forward from a pattern like this often centers on a subtle discomfort with delayed reward — a sense that the payoff for genuine effort should arrive quickly, or not at all, and a corresponding restlessness when it doesn't. There can also be a quiet, half-conscious attachment to being seen as capable or clever, which may function as a substitute for the slower, less immediately visible satisfaction of actually finishing something.`,
      today: `In the present, this may show up as a felt sense of familiarity around starting things — a comfort with beginnings that isn't quite matched anywhere else, and an instinctive restlessness whenever a project, relationship, or commitment moves into its less exciting middle stretch. It could also surface as a recognizable pull toward being the one who gets things moving, paired with a subtler discomfort whenever staying rather than starting is what's actually being asked for. You are allowed to let this imprint be an inheritance, not an instruction. What might staying, just once, feel like from the inside?`,
    },

    2: {
      heading: 'The High Priestess — An Origin Imprint of Knowing Kept Private',
      expressions: `This placement may point toward a symbolic origin pattern built around withheld perception — a past identity that could have held real insight, intuition, or spiritual knowledge and, for reasons tied to safety or belonging, kept much of it unspoken. In one expression, this might reflect a life spent quietly advising or perceiving without ever stepping fully into the visibility that offering that perception out loud would have required. In another, it could suggest a pattern of being trusted with the inner lives of others while remaining, by comparison, largely unknown yourself. It may also indicate a life where solitude became a genuine refuge, one that was never quite balanced by an equal willingness to be met.`,
      theme: `What may run through these possible expressions is a pattern of depth without full disclosure — real inner knowing that could have stayed contained rather than shared, not out of unwillingness exactly, but out of an old, protective instinct that speaking clearly once felt riskier than staying quiet.`,
      imprint: `The emotional imprint this may leave behind often includes a heightened sensitivity to being misunderstood, alongside a quiet comfort with mystery that can function as its own kind of armor. There can be a lingering association between visibility and vulnerability, and a validation pattern that leans toward being trusted rather than being fully known — the former can feel safer to receive than the latter.`,
      today: `This may show up today as an instinct to hold back an accurate read of a situation until someone else has said it first, or a familiar pull toward being the person others confide in without quite as much traffic moving in the other direction. There can also be a recognizable comfort in stillness and interior processing that, at times, may edge into a reluctance to be read as easily as you read others. You are allowed to be known as deeply as you know. If someone read you the way you read a room — what would you want them to find?`,
    },

    3: {
      heading: 'The Empress — An Origin Imprint of Abundance Without Circulation',
      expressions: `This placement may suggest an origin pattern shaped by material or emotional abundance that didn't fully move outward — a past identity that could have lived in genuine comfort, fertility, or resource, while remaining somewhat closed off from the people around it. In one expression, this might reflect a life of real generosity performed more than genuinely felt. In another, it could point to a life spent being cared for so consistently that the corresponding capacity to care for someone else in return never quite had room to develop. It may also suggest a pattern of building something beautiful that few people were ever truly welcomed into.`,
      theme: `Across these possibilities, the shared thread may be abundance held rather than circulated — resources, warmth, or creative overflow that could have stayed largely self-contained, whether through habit, protection, or simply never having practiced the alternative.`,
      imprint: `The imprint this may leave includes a subtle discomfort with vulnerability disguised as generosity, and a validation pattern oriented around being seen as plentiful or capable of providing, rather than around genuine mutual exchange. There can be a quiet unfamiliarity with receiving that mirrors, in reverse, an old comfort with giving from a safe distance.`,
      today: `In the present, this may surface as a pattern of accumulating — resources, relationships, creative work — without a fully matched instinct to let what's been built actually reach other people. It could also show up as generosity that arrives more easily than genuine receiving does, or a familiar guardedness that persists even inside apparent warmth. You are allowed to let what you've gathered move through you rather than stay stored in you. Where could something you're holding finally circulate?`,
    },

    4: {
      heading: 'The Emperor — An Origin Imprint of Authority Without Full Accountability',
      expressions: `This placement may indicate an origin pattern organized around structure and command — a past identity that could have held real authority, whether inherited, appointed, or simply assumed, without the corresponding weight of being genuinely accountable for how that authority was used. In one expression, this might reflect a life of leadership sustained more by control than by earned trust. In another, it could suggest a life protected so thoroughly by existing structure that building anything independently was never quite required. It may also point toward a pattern of being obeyed without necessarily being trusted.`,
      theme: `What may connect these expressions is power held at some distance from responsibility — real capacity for order and command that could have outpaced the slower, more exposing work of earning legitimacy through service to the people it affected.`,
      imprint: `This may leave behind a heightened sensitivity to losing control, alongside a validation pattern tied closely to competence and reliability — being needed can feel safer than being questioned. There can be a lingering discomfort with genuine vulnerability, since it may once have read as a threat to a position that depended on appearing unshakeable.`,
      today: `This may show up today as a familiar instinct to take charge in ambiguous situations, paired with a less comfortable relationship to being challenged once that charge has been taken. There can also be a recognizable pull toward building systems or structures that quietly depend on your continued presence to function, and a subtler unfamiliarity with the kind of authority that's freely given rather than assumed. You are allowed to be trusted rather than merely obeyed. What would your authority look like if it no longer needed defending?`,
    },

    5: {
      heading: 'The Hierophant — An Origin Imprint of Belief Inherited Rather Than Chosen',
      expressions: `This placement may suggest an origin pattern shaped by institutional or doctrinal belonging — a past identity that could have held real position within a tradition, faith, or system of knowledge, without always holding a fully examined, personal conviction behind it. In one expression, this might reflect a life of teaching rules that weren't entirely lived by. In another, it could point to a life spent enforcing structure out of loyalty rather than genuine belief. It may also indicate a pattern of belonging so completely to a group identity that direct, personal experience became secondary to it.`,
      theme: `Across these possibilities, what may run through them is authority borrowed from a system rather than built from direct experience — real devotion to structure that could have outpaced the quieter, more private work of actually examining what was true underneath it.`,
      imprint: `The emotional residue may include an old discomfort with questioning what's been inherited, alongside a validation pattern tied to belonging and correctness rather than to personal conviction. There can be a lingering tension between loyalty and honesty, one that may surface any time a held belief comes into contact with genuine doubt.`,
      today: `This may show up in the present as a familiar friction between what you were taught to believe and what direct experience keeps quietly suggesting instead. It could also surface as a comfort with structured, credentialed authority that isn't always matched by an equal trust in your own unmediated perception. You are allowed to believe what your own life keeps showing you. Where does an inherited certainty still outrank your direct experience?`,
    },

    6: {
      heading: 'The Lovers — An Origin Imprint of Choices Made for Approval',
      expressions: `This placement may point toward an origin pattern built around decisions shaped more by circumstance or approval than by genuine internal alignment — a past identity that could have partnered, allied, or committed based on what was safe or expected rather than what actually reflected its own values. In one expression, this might reflect a life of quiet, sustained compromise for the sake of harmony. In another, it could suggest a pattern of choosing the path that avoided visible conflict, again and again, until the original preference became difficult to locate.`,
      theme: `What may connect these expressions is choice deferred to outside approval — real capacity for discernment that could have been consistently overridden by a stronger pull toward keeping the peace or meeting expectation.`,
      imprint: `This may leave behind a heightened sensitivity to conflict, alongside a validation pattern oriented around being agreeable rather than being clear. There can be a lingering discomfort with the grief that accompanies any real choice — the sense that choosing one path always means quietly losing another.`,
      today: `In the present, this may show up as a familiar tendency to let significant decisions happen by default, or a subtler pattern of committing outwardly while withholding some genuine preference. There can also be a recognizable discomfort whenever a choice can't be made in a way that keeps everyone equally satisfied. You are allowed to choose and let the choice cost something. What preference of yours has been waiting the longest to be spoken?`,
    },

    7: {
      heading: 'The Chariot — An Origin Imprint of Motion Without a Clear Destination',
      expressions: `This placement may suggest an origin pattern centered on relentless forward motion — a past identity that could have achieved, competed, or conquered at a steady pace without pausing to examine what any of it was actually building toward. In one expression, this might reflect a life of real capability spent outrunning something rather than arriving anywhere in particular. In another, it could point to a pattern of leading others into ambition that served momentum more than genuine wellbeing.`,
      theme: `Across these possibilities, the shared thread may be drive without a fully examined direction — real capacity for sustained effort that could have outpaced the slower, more internal question of what that effort was actually in service of.`,
      imprint: `The imprint this may leave includes a discomfort with stillness that can read, on the surface, as ambition, and a validation pattern tied closely to achievement and visible progress. There can be a lingering unfamiliarity with rest, and a quiet association between slowing down and losing ground.`,
      today: `This may show up today as a restlessness that persists even amid genuine accomplishment, or a familiar instinct to fill any pause with the next goal before the current one has been fully metabolized. It could also surface as real difficulty answering, honestly, what a given pursuit is actually for. You are allowed to arrive somewhere and stay a while. If the motion stopped tomorrow — what would you discover you'd actually been running toward?`,
    },

    8: {
      heading: 'Strength — An Origin Imprint of Endurance Mistaken for Ease',
      expressions: `This placement may indicate an origin pattern organized around sustained force or control — a past identity that could have held real power, physical or otherwise, and used it more to dominate or suppress than to genuinely integrate. In one expression, this might reflect a life where being feared and being respected were not clearly distinguished from each other. In another, it could suggest a pattern of suppressing instinct so consistently that it eventually surfaced in ways that were harder to direct.`,
      theme: `What may run through these expressions is force used in place of integration — real capacity for endurance that could have outpaced the gentler, more patient work of actually meeting instinct rather than overriding it.`,
      imprint: `This may leave a heightened association between vulnerability and danger, alongside a validation pattern tied to being seen as unbreakable. There can be a lingering discomfort with asking for help, one that may read outwardly as independence but sits closer, underneath, to an old fear of appearing anything less than fully in control.`,
      today: `In the present, this may show up as a familiar instinct to grip tighter under pressure rather than to soften, or a pattern of handling difficulty alone even when support is genuinely available. It could also surface as a quiet discomfort with your own force, alongside real difficulty trusting that gentleness might work at least as well. You are allowed to be gentle and still be strong. Where might softening your grip hold more than tightening it ever did?`,
    },

    9: {
      heading: 'The Hermit — An Origin Imprint of Wisdom Gathered Alone',
      expressions: `This placement may suggest an origin pattern shaped by solitary depth — a past identity that could have gathered real understanding through withdrawal and inward attention, without a fully matched instinct to bring that understanding back out into relationship. In one expression, this might reflect a life of genuine insight that mostly stayed with the person who held it. In another, it could point toward a pattern of choosing distance as a form of protection against being misunderstood, one that was rarely actually tested.`,
      theme: `Across these possibilities, what may connect them is wisdom held privately — real depth that could have outpaced the more exposing, relational work of actually offering it to people who might have used it.`,
      imprint: `The residue this may leave includes a quiet certainty that solitude is safer than connection, alongside a validation pattern that can lean toward being respected from a distance rather than genuinely known up close. There can be a lingering discomfort with the specific vulnerability of being tested or challenged in real time.`,
      today: `This may show up today as a strong pull toward solitude that occasionally tips past what feels restorative into something more like permanent withdrawal, or a familiar reluctance to share hard-won insight until it feels fully, perhaps excessively, refined. You are allowed to bring what you've learned back into the room. Who might be waiting on wisdom you've been polishing in private?`,
    },

    10: {
      heading: 'The Wheel of Fortune — An Origin Imprint of Fortune Unexamined',
      expressions: `This placement may point toward an origin pattern shaped by cycles of rise and fall that were experienced more than they were understood — a past identity that could have moved through real reversals of circumstance without tracing what, if anything, connected them. In one expression, this might reflect a life where success arrived through timing rather than effort, and departed the same way. In another, it could suggest a pattern of attributing every high point entirely to the self and every low point entirely to chance.`,
      theme: `What may run through these expressions is an unexamined relationship with timing — real experience of fortune's movement that could have outpaced any genuine attempt to understand the pattern underneath it.`,
      imprint: `This may leave behind a heightened sensitivity to instability, alongside a validation pattern that can swing between taking full credit and taking none. There can be a lingering discomfort with the ordinary, unglamorous consistency that sits between dramatic highs and dramatic lows.`,
      today: `In the present, this may show up as a felt familiarity with cycles — financial, relational, or otherwise — that seem to repeat with a certain rhythm, alongside a subtler discomfort with the steady, undramatic middle ground that doesn't offer either a clear win or a clear loss. You are allowed to let the steady middle be enough. What could ordinary consistency build for you that the highs and lows never have?`,
    },

    11: {
      heading: 'Justice — An Origin Imprint of Judgment Turned Outward',
      expressions: `This placement may suggest an origin pattern built around discernment applied more consistently to others than to the self — a past identity that could have held real clarity about fairness and imbalance, while remaining somewhat exempt, in its own eyes, from that same standard. In one expression, this might reflect a life spent assessing or ruling on others' conduct without an equally rigorous look at its own. In another, it could point to a pattern of demanding consistency from the world that wasn't always matched internally.`,
      theme: `Across these possibilities, the shared thread may be a double measure — genuine clarity about fairness that could have been applied unevenly, sharper when turned outward than when turned toward the self.`,
      imprint: `The imprint this may leave includes a strong, almost physical sensitivity to unfairness, alongside a validation pattern tied to being seen as principled or correct. There can be a lingering discomfort with self-scrutiny, one that may quietly avoid the same precision so readily offered to everyone else.`,
      today: `This may show up today as a familiar sharpness around perceived unfairness in the world, paired with a subtler blind spot about where a similar inconsistency might exist closer to home. It could also surface as situations that seem to mirror exactly the kind of imbalance you're most attuned to noticing. You are allowed to turn that clear gaze inward with kindness rather than verdict. Where might the standard you hold the world to be asking to come home first?`,
    },

    12: {
      heading: 'The Hanged Man — An Origin Imprint of Sacrifice Performed Rather Than Chosen',
      expressions: `This placement may indicate an origin pattern shaped by suspension or self-denial — a past identity that could have remained in an unresolved position for an extended period, whether by circumstance or by a quieter, less examined choice to stay there. In one expression, this might reflect a life of visible sacrifice that carried private resentment underneath it. In another, it could suggest a pattern of waiting for permission or the right moment so consistently that the moment itself became difficult to recognize when it actually arrived.`,
      theme: `What may connect these expressions is stillness that wasn't fully chosen — real capacity for patience and surrender that could have shaded, at times, into martyrdom performed for its own sake.`,
      imprint: `This may leave a heightened discomfort with acknowledging one's own resentment, alongside a validation pattern tied to endurance and self-sacrifice. There can be a lingering tendency to frame ordinary waiting as something nobler than it may actually be.`,
      today: `In the present, this may show up as a familiar pattern of staying in unresolved situations well past the point where their lesson feels learned, or a quiet difficulty naming what you actually want rather than simply continuing to wait. You are allowed to come down from the waiting and choose. What would you name as wanted, right now, if waiting were no longer noble?`,
    },

    13: {
      heading: 'Transformation — An Origin Imprint of Endings Resisted or Forced',
      expressions: `This placement may suggest an origin pattern organized around a difficult relationship with change — a past identity that could have either clung to roles and structures well past their natural point of completion, or forced endings abruptly, out of impatience or fear, before they were genuinely ready. In one expression, this might reflect a life spent resisting necessary change until it arrived anyway, more disruptively than it needed to. In another, it could point to a pattern of ending things prematurely to avoid the discomfort of watching them complete on their own timing.`,
      theme: `Across these possibilities, what may run through them is timing around endings that was rarely fully trusted — real capacity for transformation that could have been either delayed past its moment or rushed ahead of it.`,
      imprint: `This may leave behind a heightened fear around loss or mortality that can feel disproportionate to any single explanation, alongside a validation pattern tied to stability and permanence. There can be a lingering discomfort with the specific uncertainty that surrounds any genuine transition.`,
      today: `This may show up today as a familiar tendency to hold on to roles or relationships longer than feels sustainable, or the opposite pattern of leaving abruptly the moment something becomes uncomfortable, before it's actually run its course. You are allowed to let endings take their true timing. What is asking to close in your life — neither rushed nor refused?`,
    },

    14: {
      heading: 'Temperance — An Origin Imprint of Extremes Never Fully Integrated',
      expressions: `This placement may point toward an origin pattern shaped by oscillation between excess and restriction — a past identity that could have lived fully in one extreme or another, discipline or indulgence, without developing the slower, more demanding synthesis of the two. In one expression, this might reflect a life spent mediating other people's conflicts while an internal imbalance stayed quietly unreconciled. In another, it could suggest a pattern of picking one extreme identity and remaining there, rather than risking the harder work of blending opposites.`,
      theme: `What may connect these expressions is balance approximated by alternation rather than genuinely achieved — real capacity for integration that could have been substituted, again and again, by simply swinging between two poles.`,
      imprint: `This may leave a subtle discomfort with genuine moderation, alongside a validation pattern tied to being seen as disciplined or in control. There can be a lingering tendency to manage feeling down to something neutral rather than to actually metabolize it.`,
      today: `In the present, this may show up as a familiar cycle between periods of strict discipline and periods of full release, each one framed as the correction for the other, without either settling into something genuinely sustainable. You are allowed to live between the poles without it being a loss of identity. What might a genuinely blended week — neither strict nor unbound — look like?`,
    },

    15: {
      heading: 'The Devil — An Origin Imprint of Bondage Unexamined',
      expressions: `This placement may suggest an origin pattern built around compulsion or control that was rarely looked at directly — a past identity that could have lived in real bondage to power, pleasure, or material comfort, mistaking that bondage, at times, for a kind of freedom. In one expression, this might reflect a life of real material influence used to dominate rather than to build. In another, it could point to a pattern of being bound to someone else's control, or quietly exercising that same control over someone who depended on you.`,
      theme: `Across these possibilities, the shared thread may be attachment that stayed unconscious — genuine desire or need that could have gone unexamined long enough to feel less like a choice and more like a fixed condition.`,
      imprint: `This may leave behind a heightened association between comfort and safety, alongside a validation pattern tied to control, whether held or submitted to. There can be a lingering discomfort with genuinely examining what a given craving or compulsion might actually be protecting against.`,
      today: `This may show up today as compulsive patterns — around control, comfort, or a particular relational dynamic — that register intellectually but haven't yet been looked at with much honesty. It could also surface as a familiar dynamic of either being controlled or quietly controlling someone else. You are allowed to look directly at what binds you without shame. If the chain loosened an inch — what would you reach for first?`,
    },

    16: {
      heading: 'The Tower — An Origin Imprint of Structures Maintained Past Their Truth',
      expressions: `This placement may indicate an origin pattern shaped by denial in the face of visible instability — a past identity that could have maintained an image, position, or structure that was privately known not to be sound, because the cost of admitting it felt too great. In one expression, this might reflect a life spent ignoring clear warning signs until collapse arrived on its own terms. In another, it could suggest a pattern of rebuilding, after a collapse, in exactly the same flawed shape, without examining what had actually been unstable.`,
      theme: `What may connect these expressions is truth deferred — real awareness of an unstable foundation that could have been set aside, again and again, in favor of the comfort of denial.`,
      imprint: `This may leave a heightened nervous-system sensitivity to sudden change, alongside a validation pattern tied to the appearance of stability. There can be a lingering discomfort with early warning signs, a tendency to notice them and quietly set them aside.`,
      today: `In the present, this may show up as a familiar pattern of sudden reversals that, in hindsight, had visible signals beforehand, or a subtler tendency to cling to structures you already suspect may not hold. You are allowed to tell the truth about a foundation before it tells it for you. What structure in your life already knows what you haven't said aloud?`,
    },

    17: {
      heading: 'The Star — An Origin Imprint of Light Kept Deliberately Low',
      expressions: `This placement may suggest an origin pattern organized around dimmed radiance — a past identity that could have carried a genuine gift for hope, healing, or inspiration and kept it deliberately low, out of an old association between visibility and danger. In one expression, this might reflect a life of quiet brilliance that few people around it ever fully witnessed. In another, it could point to a pattern of being told that your light was somehow too much, and believing it.`,
      theme: `Across these possibilities, the shared thread may be brilliance withheld — real capacity for light that could have stayed protected rather than offered, as a form of old, learned safety.`,
      imprint: `This may leave behind a quiet grief around gifts that were never fully shared, alongside a validation pattern tied to being needed rather than being seen. There can be a lingering discomfort whenever recognition becomes genuinely available.`,
      today: `This may show up today as a familiar instinct to shrink right at the moment visibility becomes possible, or a pattern of real talent that stays underdeveloped so it can never be fully judged. You are allowed to shine at full wattage and survive being seen. What gift of yours has waited long enough in the dark?`,
    },

    18: {
      heading: 'The Moon — An Origin Imprint of Illusion Left Unquestioned',
      expressions: `This placement may point toward an origin pattern shaped by unexamined fear or fantasy — a past identity that could have lived inside a story about itself or its circumstances that wasn't fully accurate, without developing the discipline to check it against real evidence. In one expression, this might reflect a life led by anxious projection mistaken for genuine intuition. In another, it could suggest a pattern of unprocessed grief that quietly shaped decisions from beneath conscious awareness.`,
      theme: `What may connect these expressions is perception left unverified — real sensitivity to undercurrent and atmosphere that could have gone untested against what was actually, verifiably true.`,
      imprint: `This may leave a heightened susceptibility to anxious narrative, alongside a validation pattern tied to being intuitively right rather than factually accurate. There can be a lingering discomfort with the specific discipline of checking a feeling against real evidence.`,
      today: `In the present, this may show up as convincing internal narratives that don't always hold up under closer examination, or a recurring, unsettled sense that something beneath the surface hasn't yet been fully faced. You are allowed to check the story against the daylight. Which convincing fear, examined honestly, might turn out to be an echo rather than an omen?`,
    },

    19: {
      heading: 'The Sun — An Origin Imprint of Warmth Performed Rather Than Felt',
      expressions: `This placement may suggest an origin pattern built around radiance offered as performance — a past identity that could have been the bright, reliable presence for everyone else, while its own inner life went largely unattended. In one expression, this might reflect a life of apparent success that felt privately hollow. In another, it could point to a pattern of using visible warmth to distract from grief or complexity that was never let fully into view.`,
      theme: `Across these possibilities, the shared thread may be vitality used to manage how others saw you — real light that could have been deployed more as image than as genuine, felt experience.`,
      imprint: `This may leave behind a validation pattern tied closely to how much brighter you could make a room, alongside a quiet fear that the less luminous parts of you might not be as welcome. There can be a lingering exhaustion underneath sustained positivity.`,
      today: `This may show up today as an instinct to manage your own difficulty so it doesn't disturb the people around you, or a familiar gap between the version of you that shows up publicly and the one that exists in private. You are allowed to be met in your dimmer hours too. Who could you let see you unlit, just once, this week?`,
    },

    20: {
      heading: 'Judgement — An Origin Imprint of a Call Deferred',
      expressions: `This placement may indicate an origin pattern shaped by a summons that was heard but not fully answered — a past identity that could have recognized, with real clarity, that a chapter had ended, and stayed inside it regardless. In one expression, this might reflect a life lived smaller than its actual capability, out of fear of what answering a deeper call might cost. In another, it could suggest a pattern of judging others for changes that felt too risky to make yourself.`,
      theme: `What may connect these expressions is clarity without rising — real recognition of what needed to change that could have been met with sophisticated, prolonged postponement rather than actual movement.`,
      imprint: `This may leave a heightened discomfort with decisive action once clarity has already arrived, alongside a validation pattern tied to diligence and preparation. There can be a lingering tendency to mistake more research or more waiting for genuine readiness.`,
      today: `In the present, this may show up as a familiar pattern of knowing exactly what needs to happen in a given situation and still finding reasons to delay, or a subtler impatience with other people's slowness to change that may echo your own history with the same hesitation. You are allowed to answer the call while still afraid of it. What is the summons you've already heard — and what would rising to it look like in one small step?`,
    },

    21: {
      heading: 'The World — An Origin Imprint of Completion Withheld',
      expressions: `This placement may suggest an origin pattern organized around unfinished arrival — a past identity that could have reached real mastery or accomplishment and refused to let it be acknowledged as complete. In one expression, this might reflect a life spent moving the finish line just before reaching it. In another, it could point to a pattern of discounting genuine success as somehow not quite enough, no matter how substantial it actually was.`,
      theme: `Across these possibilities, the shared thread may be completion that stayed just out of reach — real accomplishment that could have been consistently relativized rather than received.`,
      imprint: `This may leave behind a discomfort with rest or celebration that persists even after something has genuinely been achieved, alongside a validation pattern tied to the next goal rather than the current one. There can be a lingering sense that arrival itself is somehow risky.`,
      today: `This may show up today as a familiar pattern of nearly finishing things and then quietly extending or complicating them right before the natural end, or a real difficulty receiving acknowledgment for something genuinely accomplished. You are allowed to arrive, and to let arrival be celebrated. What have you finished that deserves to finally be called complete?`,
    },

    22: {
      heading: 'The Fool — An Origin Imprint of Beginnings Without a Middle',
      expressions: `This placement may point toward an origin pattern shaped by constant reinvention — a past identity that could have leapt into new paths, places, or identities often enough that few of them had time to become fully real. In one expression, this might reflect a life of trust extended without much discernment, and repeatedly costly because of it. In another, it could suggest a pattern of using spontaneity as a way of avoiding the more exposing vulnerability of being known in one place, by one set of people, over real time.`,
      theme: `What may connect these expressions is beginning without staying — real openness and courage that could have been used mainly for starting, rather than for the harder, less exciting work of continuing.`,
      imprint: `This may leave a validation pattern tied to freshness and possibility rather than to depth or continuity, alongside a subtle discomfort with the specific vulnerability of being known over time rather than met anew each time. There can be a lingering association between staying and losing freedom.`,
      today: `In the present, this may show up as a familiar pull toward the next fresh start exactly when something asks you to stay and continue, or a recognizable pattern of many promising beginnings alongside comparatively few things carried all the way through. You are allowed to stay long enough to be truly known. What might one continued path give you that a hundred beginnings never could?`,
    },

  };

  function get(arcanaNum) {
    return nodes[arcanaNum] || null;
  }

  return { get };

})();
