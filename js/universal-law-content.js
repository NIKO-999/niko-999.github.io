'use strict';

/**
 * Destiny Matrix — Universal Law Data Matrix (Part 14/15)
 * ────────────────────────────────────────────────────────
 * Bespoke readings that blend each of the Hermetic Universal Laws with
 * every one of the 22 Arcana. Used when the app's "Universal Law" view
 * is toggled on — showCard() swaps the standard position-specific
 * reading for the law-blended entry matching the currently-displayed
 * core node's law assignment and live arcana number.
 *
 * Depth/voice matches the `general[]` fallback tier in micro-content.js
 * (not the longer position-specific entries) for most combinations; the
 * 22 combinations that are the curated arcana↔law match (see
 * ARCANA_LAW_MATCH below, surfaced via getMatch()) carry the deeper,
 * fuller-length treatment since those are the only ones ever actually
 * shown to a user.
 *
 * API:
 *   DUniversalLawContent.get(lawKey, arcanaNum)
 *     → { heading, why, shadow, path } or null
 */

window.DUniversalLawContent = (function () {

  const laws = {

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF MENTALISM — "The universe is mental; thought is the first
    // material." Reads each arcana as a cognitive architecture: the
    // operating belief-template that literally furnishes what later
    // appears as circumstance.
    // ═══════════════════════════════════════════════════════════════════
    mentalism: {
      1: {
        heading: 'Mentalism & The Magician — You Draft Before You Build',
        why: `What you hold in focused attention doesn't stay in your head — it becomes the seed-template your reality later arranges itself around. Your mind isn't a passive observer of your life. It's the first draftsman.`,
        shadow: `You can draft a hundred templates and finish none, so your reality has no single coherent blueprint to build from — it produces a noisy compromise of all of them at once. Manifestation feels unreliable not because the Law fails you, but because your own mind keeps countermanding its own order mid-build.`,
        path: `Hold one template long enough, without contradicting yourself, for the build to actually complete. A single sustained thought outperforms a hundred flickering ones — your power was never volume, it was focus.`,
      },
      2: {
        heading: 'Mentalism & The High Priestess — Your Architecture Runs Beneath the Architecture',
        why: `Most of your mind's construction work happens below the visible waterline, in symbol and instinct rather than spoken plan. Your beliefs draft the blueprint whether or not you ever said them out loud.`,
        shadow: `You can mistake your own silence for absence — assuming that because a belief was never spoken aloud, it has no drafting power. Left unexamined, it just keeps running, uncontested.`,
        path: `Bring the unspoken blueprint into your conscious view so you can actually edit it. What you name, you can redraft. What stays veiled keeps building the same room.`,
      },
      3: {
        heading: 'Mentalism & The Empress — Your Mind Is Fertile Ground',
        why: `Your mind works like fertile soil — organize it around abundance and you produce abundant circumstance, because the template you're projecting is one of overflow rather than scarcity. What you believe the world has room for is what your world learns to grow.`,
        shadow: `You might run a scarcity-drafted mind while performing generosity outwardly — the two contradict, and your harvest matches the quieter, truer blueprint rather than the performed one.`,
        path: `Align your inner template with your outer gesture. Genuinely believe there's enough before you extend the generosity, and the field stops fighting itself.`,
      },
      4: {
        heading: 'Mentalism & The Emperor — You Engineer With Your Mind First',
        why: `Structure in your material world is never separate from the structural thinking that preceded it. A well-engineered mental blueprint of yours produces durable order; a chaotic one produces order that can't hold weight.`,
        shadow: `You can mistake rigidity for stability — holding a mental template so fixed it can't be redrafted even when conditions change, which produces structures that eventually crack rather than bend.`,
        path: `Build with a mind willing to revise its own blueprint. Your durable structure comes from a template flexible enough to be improved, not one too afraid to be touched.`,
      },
      5: {
        heading: 'Mentalism & The Hierophant — You Inherited a Template From Others',
        why: `You carry cognitive architecture handed down through teachers, tradition, and lineage — belief-templates you adopted as your own blueprint for reality long before you could evaluate them.`,
        shadow: `You can run someone else's draft as though you authored it yourself, mistaking loyalty to the transmission for truth of the template itself.`,
        path: `Study your inherited blueprint deliberately: keep what still serves your construction, consciously redraft what doesn't. A template earns its authority by being examined, not merely received.`,
      },
      6: {
        heading: 'Mentalism & The Lovers — Two Templates Choosing to Align',
        why: `Real union, for you, is a mental event before it's an emotional one — you and someone else deciding to draft from the same blueprint rather than running two private ones in parallel.`,
        shadow: `You can choose companionship while running a contradictory private blueprint — performing alignment while quietly drafting a different, incompatible future underneath.`,
        path: `Make the templates explicit. Name what each of you is actually building toward — alignment requires the blueprints to be spoken, not merely assumed shared.`,
      },
      7: {
        heading: 'Mentalism & The Chariot — Your Mind Holds the Direction',
        why: `You move forward because your mind holds a sustained template that doesn't waver mid-journey — direction held so continuously that circumstance has no real choice but to follow the line you've drawn.`,
        shadow: `You might redraft your destination every time conditions get difficult, so your vehicle never completes a single line — motion without arrival, because your own blueprint keeps changing.`,
        path: `Fix the destination in your mind before the terrain gets hard, and hold it through the difficulty instead of after it. Your template's stability is what makes the journey survivable.`,
      },
      8: {
        heading: 'Mentalism & Justice — Your Ledger Gets Kept in the Mind First',
        why: `The sense of fairness or its absence in your life is, first, an architecture of judgment running in your mind, and only afterward a set of external events matching it.`,
        shadow: `You might run an internal verdict-machine so constant it drafts a world perpetually on trial — every circumstance pre-judged before it's fully arrived, producing exactly the adversarial climate you expected.`,
        path: `Audit your internal ledger before you audit the world. A mind that stops pre-judging finds a world with far less that actually needs judging.`,
      },
      9: {
        heading: 'Mentalism & The Hermit — Your Solitude Is You Auditing Yourself',
        why: `Your withdrawal isn't a story about loneliness — it's a story about you auditing yourself. Every visible circumstance in your life is the outward crystallization of a cognitive architecture running somewhere beneath your conscious awareness, and you're wired specifically to go looking for it on purpose. While the rest of your life gets embedded in the noise of active living — building, choosing, colliding with other people's templates — you step deliberately outside of it, lantern raised, specifically to see what's actually drafting the blueprint of your own experience. This isn't escapism when you do it right. It's the most direct thing you can do with this Law: if thought really is the first material, no circumstance in your life can be meaningfully addressed until you've actually located and examined the template producing it in daylight. You intuitively know your answers live inward before they live outward — that your compulsion to withdraw, however socially costly it looks from outside, is a highly sophisticated act of investigation on your part. Where a habitual reactor asks "what happened to me," you're wired to ask "what belief was already running before this happened" — and that single reframe is the whole difference between a life that keeps recycling the same events and one where you finally edit the script generating them.`,
        shadow: `You might fall into a very seductive trap: mistaking the act of withdrawing for the achievement of insight. You can retreat from other people's noise and opinions and still never actually turn around to examine your own. You raise your lantern, but you point it outward, illuminating everyone else's failures rather than the specific architecture drafting your own disappointing blueprint. That produces a particular flavor of isolation for you — not the productive kind that clarifies, but the defensive kind that just distances you. You'll recognize it by a telltale sign: your retreat starts feeling less like inquiry and more like superiority, less like "let me go look at what I actually believe" and more like "I've already seen enough of people to know I'm better off away from them." There's also a subtler version waiting for you — using withdrawal itself as the template. If your unexamined belief is "understanding is found alone," you'll keep manufacturing situations that confirm it: collaborations that mysteriously fall apart, communities that mysteriously disappoint you, teachers who mysteriously turn out to have nothing left to teach you. Not because the world is genuinely emptying itself of value, but because your mind, convinced isolation is where truth lives, will selectively notice — and even provoke — exactly the evidence that keeps proving it to you.`,
        path: `This is uncomfortable because it removes your safety of blaming the noise. If your belief really does draft the blueprint your circumstances are built from, then the isolation or repeating pattern you've been quietly attributing to "everyone else" has actually been, in significant part, authored by a template you haven't yet turned around to face. That's harder to accept than "people let me down" — but it's also more genuinely empowering, because it means your fix was never waiting on other people changing. Start with a single honest audit: pick the pattern that recurs most in your life — the same kind of collaborator, the same kind of disappointment — and instead of cataloguing what they did to you, write down what you believed before it happened. Not what you concluded afterward. What you expected walking in. That belief, stated plainly, is very often the actual first draft your whole event was built from. Your real work isn't becoming permanently solitary — it's developing the discipline to withdraw on purpose, on a schedule, specifically to examine and revise your template, and then returning to engagement having actually redrafted your blueprint rather than merely distanced yourself from its consequences.`,
      },
      10: {
        heading: 'Mentalism & The Wheel of Fortune — You Mistake Cycles for Chance',
        why: `What looks like random fortune in your life is patterned by an underlying belief — the recurring cycle is being drafted by a recurring template, not by an impersonal roll of dice.`,
        shadow: `You might call the cycle "luck" specifically to avoid inspecting the template producing it — externalizing the pattern means you never get to redraft the blueprint generating it.`,
        path: `Trace the cycle back to the belief that keeps drafting it. Once the template is visible to you, the wheel can be redesigned rather than merely endured.`,
      },
      11: {
        heading: 'Mentalism & Strength — Your Quiet Architecture of Self-Command',
        why: `Your settled state is a template where impulse and intention are already aligned, so control never has to be visibly exercised.`,
        shadow: `You might perform calm on the surface while running a suppressed, unresolved instinct underneath — forced control rather than genuine integration, which eventually leaks out sideways.`,
        path: `Integrate rather than suppress. The template that actually holds for you is the one where instinct is befriended, not overridden.`,
      },
      12: {
        heading: 'Mentalism & The Hanged Man — The Blueprint Seen From Upside Down',
        why: `You deliberately invert your usual template — hanging your mind in an unfamiliar position long enough to see the blueprint from an angle your normal orientation would never reveal.`,
        shadow: `You can stay suspended without insight — stuck in the inverted position as a form of avoidance, mistaking prolonged discomfort for the wisdom it was supposed to produce.`,
        path: `Let the inversion do its actual work: extract the different view, then return and redraft. The position is a vantage point for you, not a permanent home.`,
      },
      13: {
        heading: 'Mentalism & Transformation — The Old Template Must Be Deleted, Not Edited',
        why: `Your cognitive architecture can get too structurally compromised to revise — the blueprint itself has to be retired entirely before you can draft a new template in its place.`,
        shadow: `You might try to patch a fundamentally obsolete template rather than releasing it — endless minor edits to a blueprint that needed full demolition, producing exhaustion without renewal.`,
        path: `Let the old template end cleanly. A genuinely new mental architecture can't be built on a foundation that refuses to be cleared.`,
      },
      14: {
        heading: 'Mentalism & Temperance — You Blend Your Own Contradictions',
        why: `You can hold two opposing templates simultaneously without collapsing into either extreme — literate enough to draft a synthesis rather than forcing a premature choice between opposites.`,
        shadow: `You might declare integration while one template quietly dominates the other — a synthesis that's really just one belief wearing a moderate costume.`,
        path: `Actually weigh both templates honestly before merging them. Real integration takes the harder work of genuine synthesis, not the appearance of balance.`,
      },
      15: {
        heading: 'Mentalism & The Devil — The Template That Convinced You It Was Permanent',
        why: `You carry a cognitive architecture installed so deeply it no longer feels like a belief at all — it feels like reality itself, which is exactly how a mental template maintains its grip.`,
        shadow: `You can forget the chains were ever a construction — treating an installed belief-template as an immovable law of nature rather than the editable draft it actually is.`,
        path: `Remember your own authorship. The moment you recognize a template as something that was built, it becomes something you can rebuild.`,
      },
      16: {
        heading: 'Mentalism & The Tower — The Forced Demolition of a False Blueprint',
        why: `Your mind's own architecture collapses under the weight of a template that was never structurally sound — the sudden event isn't random destruction, it's a false cognitive foundation finally failing under its own load.`,
        shadow: `You might rebuild identically on the same cracked foundation — reconstructing the exact same unstable template immediately after collapse because the false belief itself was never actually addressed.`,
        path: `Use the clearing the collapse gave you. Inspect what the old template got wrong before you lay a single new brick.`,
      },
      17: {
        heading: 'Mentalism & The Star — The Template of Deserved Hope',
        why: `You carry a cognitive architecture of genuine, evidence-based hope — a mind that's drafted a template where good outcomes are plausible, which is precisely what allows plausible outcomes to start appearing.`,
        shadow: `You might perform hope over a hidden despair-template — affirmations layered atop an unexamined belief that things won't actually work out, producing a fragile optimism that collapses at the first setback.`,
        path: `Rebuild the hope from the actual foundation, not just the surface language. Genuine templates of possibility need real evidence gathered, not just repeated wishing.`,
      },
      18: {
        heading: 'Mentalism & The Moon — When You Can\'t Tell Fear From Fact',
        why: `Your mind's templates can blur imagination with information, so anxiety gets drafted with the same authority as observed reality.`,
        shadow: `You might treat every anxious projection as accurate intelligence — unable to distinguish your own fear-generated template from what's actually happening in front of you.`,
        path: `Build a discipline of verification: before acting on the mental image, check it against the visible evidence. Clarity is a skill for you, not a given.`,
      },
      19: {
        heading: 'Mentalism & The Sun — The Effortless Template of Genuine Vitality',
        why: `Your cognitive architecture, at its most naturally aligned, doesn't manufacture joy — joy is simply the accurate output of a mind not fighting its own true nature.`,
        shadow: `You might perform radiance over a private exhaustion — a template of forced positivity papering over a mind that hasn't actually addressed what's draining it.`,
        path: `Let your vitality be real rather than displayed. A genuinely aligned template doesn't need to advertise its brightness — it simply produces it.`,
      },
      20: {
        heading: 'Mentalism & Judgement — Your Mind Finally Hears Its Own Summons',
        why: `Your Judgement describes a very specific cognitive event happening inside you: the moment a mental template you've quietly outgrown is finally, undeniably recognized as obsolete by the very mind that built it. You're not being punished, not judged in the courtroom sense — you're being summoned home to a truer version of yourself than the one you'd been sleepwalking through. Thought is the first material, the seed-template your circumstances are later built from — which means every "old self" you've eventually shed was never actually removed by outside events. It was a cognitive architecture that ran its course for you, that stopped matching who you'd actually become, and your own mind had already started signaling it was due for revision long before the summons became impossible to ignore. You experience growth less as a gradual drift and more as a series of unmistakable internal alarms: a sudden, total inability to keep believing what you used to believe, a mental clarity so sharp it feels almost externally imposed, even though you authored it entirely from within. Your gift is that your inner architecture won't let you live comfortably inside an outdated blueprint for very long.`,
        shadow: `Your shadow here doesn't look like denial to you — it looks like diligence. You hear the summons. You know, with total mental clarity, that your current template has expired. And instead of answering, you begin "preparing" to answer: more research, more certainty-gathering, more waiting for a signal somehow even clearer than the one you already received. This can go on for years. Your mind, having already done the actual cognitive work of recognizing the old blueprint is obsolete, starts manufacturing an elaborate, intellectually respectable holding pattern instead of acting on what it already, unmistakably knows. A mind stuck broadcasting "I'm not ready yet, I need more information" isn't neutrally waiting — it's actively continuing to draft a blueprint of delay, and your world keeps obligingly matching you with more ambiguous, inconclusive circumstances that never quite resolve into the clear permission you're unconsciously demanding before you'll move. You'll recognize this shadow in yourself by its specific emotional signature: not confusion, but a strange, guilty clarity — the sense that you already know exactly what needs to happen and are simply, elaborately, refusing yourself.`,
        path: `You don't need to gather more evidence, because the summons was never actually unclear to you — you need to accept that your mind has already rendered its verdict, and that further "preparation" is simply your old template's last, most convincing argument for its own survival. Begin by naming the exact obsolete belief out loud, in full, rather than continuing to act around it indirectly: not "I should probably think about changing this eventually," but the specific, complete sentence describing what you already know needs to end. Once you genuinely and consciously revise a mental template — not merely acknowledge it as outdated, but actually replace it — your circumstances begin shifting to match the new draft, often faster than seems reasonable given how long the old pattern held. The work here isn't intellectual; you've already done that, that's precisely why your trumpet is sounding. Your work is the single, decisive act of standing up inside your new understanding rather than continuing to lie in the coffin of the old one out of habit or fear of what rising actually requires of you.`,
      },
      21: {
        heading: 'Mentalism & The World — The Template Finally Allowed to Be Complete',
        why: `You've grown a cognitive architecture mature enough to register genuine completion — a mind capable of building a blueprint through to its actual finished state, rather than perpetually revising toward an imagined further version.`,
        shadow: `Your template might not know how to register "done" — endlessly redrafting a project that has, in reality, already achieved what it set out to achieve.`,
        path: `Practice recognizing completion as its own skill. Let your mind actually register "finished" rather than immediately drafting the next iteration.`,
      },
      22: {
        heading: 'Mentalism & The Fool — The Blank Template Before the First Draft',
        why: `Your mind, at its most architecturally open, holds no fixed blueprint yet — pure cognitive potential available to be drafted in any direction your will chooses.`,
        shadow: `You might mistake blankness for freedom from consequence — beginning draft after draft without ever letting any one template mature into something load-bearing.`,
        path: `Let the openness choose a direction and commit to it. A blank template is only valuable once you actually draft something onto it.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF CORRESPONDENCE — "As above, so below; as within, so without."
    // Reads each arcana as the pattern being reflected across scales — the
    // inner state and the outer mirror are read as one continuous system.
    // ═══════════════════════════════════════════════════════════════════
    correspondence: {
      1: {
        heading: 'Correspondence & The Magician — Your Hand Mirrors Your Will',
        why: `What your hands accomplish in the world is a precise reflection of what your will has actually resolved to do inside. Outer skill is never separate from inner intention.`,
        shadow: `You might perform outer competence over inner ambivalence — impressive action that doesn't match a genuinely resolved intention underneath, and the mismatch eventually surfaces as results that quietly undercut themselves.`,
        path: `Resolve your inner intention fully before you act outwardly. Once the inside and outside actually correspond, the action stops sabotaging itself.`,
      },
      2: {
        heading: 'Correspondence & The High Priestess — Your Outer Silence Mirrors Your Inner Knowing',
        why: `What you withhold from speech outwardly matches what remains unintegrated within you — the veil in the world is simply a reflection of the veil you haven't yet lifted internally.`,
        shadow: `You might mistake outer secrecy for inner depth — performing mystery externally while avoiding the actual internal work the mystery is supposed to represent.`,
        path: `Let your inner clarity come before your outer silence. The veil should reflect genuine depth, not simply hide its absence.`,
      },
      3: {
        heading: 'Correspondence & The Empress — Your Garden Reflects the Gardener',
        why: `Your outer abundance is a direct reflection of your inner sense of worth — the world grows what your own self-regard has already decided is deserved.`,
        shadow: `You might tend an outer garden lavishly while starving the inner one — generosity to others that masks an internal famine of self-worth the outer abundance can't actually correct.`,
        path: `Nurture your inner ground first. Outer abundance becomes sustainable once it corresponds to genuine inner sufficiency, not compensation for its lack.`,
      },
      4: {
        heading: 'Correspondence & The Emperor — Your Outer Order Mirrors Your Inner Command',
        why: `The order you can build outside is limited by the order you've actually established over your own impulses inside.`,
        shadow: `You might impose external control to compensate for internal chaos — rigid outer systems built to manage a disorder that was never actually addressed within.`,
        path: `Establish your inner command first. Outer structure holds when it corresponds to genuine internal order, not when it's built to disguise its absence.`,
      },
      5: {
        heading: 'Correspondence & The Hierophant — The Institution Mirrors the Devotion',
        why: `The outer tradition, ritual, or lineage you find yourself drawn to honor is never an arbitrary structure you stumbled onto — it's a precise reflection of an inner reverence already organizing itself in you before the outer form arrived to hold it. If you're drawn to structure, doctrine, mentorship, or the deep study of an inherited body of wisdom, that pull isn't incidental. It's your outer world correspondingly organizing itself to match an inner architecture of devotion that was seeking exactly this kind of container. You didn't stumble onto your tradition by accident — you recognized, at some pre-verbal level, an outer shape that finally matched an inner one you'd been carrying all along. That makes this one of the more genuinely reassuring placements you carry: the discipline you feel called to isn't a costume you're performing, it's a correspondence you're actually living.`,
        shadow: `Your outer form can persist long after the inner correspondence that once justified it has quietly gone missing. You can find yourself in the pew, at the lectern, wearing the robes of the role, using all the correct language of the tradition — and privately, underneath all of it, feeling almost nothing. This isn't hypocrisy in the dramatic sense; it's usually much quieter and much sadder, a kind of devotional autopilot that persists because your outer structure has enough of its own momentum to keep running without the inner state that used to power it. Because your inner and outer are one continuous system, an institution you maintain without corresponding inner devotion eventually starts to feel hollow from the outside too, and the very sacredness you're trying to protect by keeping up appearances is precisely what erodes as a result. The people around you sense it. Your deeper trap is using the outer form's continued existence as evidence your inner devotion must still be intact — mistaking the persistence of the ritual for proof of the reverence, when it actually runs the other direction: the ritual only ever meant anything because of what it was mirroring in you, and a ritual mirroring nothing is just choreography.`,
        path: `Take an honest, unflinching inventory: which parts of your outer devotional life still correspond to something genuinely alive within you, and which have become empty architecture you maintain out of habit, identity, or fear of what admitting the gap would cost you? This isn't a call to abandon structure — only to notice honestly whether anyone's still home inside it. Where your correspondence has been lost, your work isn't faking the feeling back into existence through more performance, but returning to whatever originally sparked your devotion and asking, with real curiosity, whether it's still true for you now. Where your correspondence is still alive, your work is protection — guarding your inner reverence from being slowly hollowed out by the demands of maintaining its outer form. Once your inner and outer states genuinely correspond, you become one of the most powerful transmitters available to you in this entire system — not because your tradition is impressive, but because everyone who meets you can feel, without being told, that what you're offering is real all the way through.`,
      },
      6: {
        heading: 'Correspondence & The Lovers — Your Partner Mirrors the Undone Work',
        why: `The partner who appears in your life corresponds, with striking precision, to the unresolved inner material you haven't yet fully faced.`,
        shadow: `You might blame the mirror for what it's reflecting — treating a partner's behavior as an isolated external fact rather than recognizing the corresponding inner pattern it's revealing.`,
        path: `Read the relationship as data about yourself, not just about the other person. What keeps appearing in a partner is what still needs your attention.`,
      },
      7: {
        heading: 'Correspondence & The Chariot — The Vehicle Mirrors the Driver',
        why: `The momentum of your outer life corresponds exactly to the coherence of the inner will steering it — a divided driver produces a vehicle pulled in two directions.`,
        shadow: `You might blame the terrain for a chariot that was never actually unified — crediting external obstacles for a stall that really originates in your own conflicted will.`,
        path: `Unify your inner driver first. External momentum corresponds to internal coherence, not to more favorable outer conditions.`,
      },
      8: {
        heading: 'Correspondence & Justice — The World Mirrors the Ledger',
        why: `External fairness or its absence corresponds directly to an internal ledger — a life that keeps encountering imbalance is often the external mirror reflecting unintegrated shadow elements around fairness, debt, or self-worth.`,
        shadow: `You might treat every instance of unfairness as purely external, refusing to check what internal account might be corresponding to it.`,
        path: `Audit the internal ledger honestly. Balancing it inwardly is what changes what your outer mirror has to reflect.`,
      },
      9: {
        heading: 'Correspondence & The Hermit — The Cave Mirrors the Inner Terrain',
        why: `Your outer withdrawal corresponds to an inward landscape still being mapped — a direct reflection of inner territory not yet fully explored.`,
        shadow: `You might prolong outer isolation past the point the inner mapping is complete — the correspondence breaks down when withdrawal continues out of habit rather than genuine unfinished work.`,
        path: `Let the outer retreat end when the inner territory has actually been charted. Track real completion, don't linger past it.`,
      },
      10: {
        heading: 'Correspondence & The Wheel of Fortune — Outer Cycles Mirror Inner Patterns',
        why: `Recurring outer circumstance corresponds precisely to a recurring inner pattern — the cycle in the world is simply displaying what you keep repeating inside.`,
        shadow: `You might call the outer cycle "fate" to avoid noticing the inner pattern it corresponds to — externalizing the wheel keeps the corresponding internal loop invisible.`,
        path: `Trace the outer cycle back to its inner counterpart. Changing the internal pattern is what finally turns the outer wheel differently.`,
      },
      11: {
        heading: 'Correspondence & Strength — Outer Gentleness Mirrors Inner Command',
        why: `The outer gentleness you can afford corresponds exactly to the degree of genuine command you hold over your own inner instinct — soft outwardly because settled inwardly.`,
        shadow: `You might perform gentleness outwardly over an inner instinct still unmastered — a gap that eventually shows up as the instinct breaking through despite the performance.`,
        path: `Let your outer softness be earned by actual inner mastery, not a substitute for it.`,
      },
      12: {
        heading: 'Correspondence & The Hanged Man — The Suspended View Mirrors an Inner Reversal',
        why: `Your outer circumstance and inner state are never actually separate. You hang upside down, suspended, appearing to the outside world as stuck or immobilized, while internally something entirely different happens: a genuine, deliberate reversal of perspective that couldn't have occurred from any other vantage point you might have taken. If your life keeps handing you situations that look, from the outside, like stagnation — a project on hold, a decision deferred — this asks you to examine whether an inner reversal is quietly underway that requires exactly this kind of outer suspension to complete itself. You may have learned, sometimes the hard way, that your most important shifts in understanding don't arrive while you're in motion, chasing the next thing, but specifically while you're paused, uncomfortable, and looking at your circumstances from an angle your usual orientation would never have permitted.`,
        shadow: `Your outer stillness can produce no inner movement at all — your suspension mistaken for transformation simply because it looks, superficially, like the classic image of the position. You can remain paused or stuck for a very long time while genuinely believing "something is happening internally," when in fact nothing has shifted; what should have been a temporary, purposeful inversion has calcified into a permanent holding pattern with no actual reversal occurring beneath it. This is a subtle trap because it borrows the language and posture of the real thing — you can tell yourself you're "integrating" indefinitely, using the appearance of stillness to excuse an avoidance that has nothing to do with genuine perspective work. Your tell is usually this: a real inner reversal, however uncomfortable, eventually produces a felt shift — a moment where something you were once certain of suddenly looks different. If months or years pass with no corresponding inner shift ever registering, your mirror has stopped reflecting anything real.`,
        path: `Use your outer suspension actively rather than passively — treating the pause not as something happening to you, but as raw material for the specific inner work it corresponds to. Concretely, this means deliberately inhabiting your reversed vantage point: if circumstances have stalled a plan, ambition, or relationship, use the stall to genuinely look at the situation from the opposite angle, rather than simply waiting for permission to move again. Ask what the person, project, or belief looks like from underneath rather than above, from behind rather than in front. This is uncomfortable because it requires surrendering the forward motion your ego would prefer — but your external suspension won't resolve until the internal reversal it was designed to enable has genuinely completed. Once you actually integrate that reversed view — not performed, but felt as a real shift — your outer stillness dissolves on its own, because the correspondence holding it in place no longer has anything left to mirror.`,
      },
      13: {
        heading: 'Correspondence & Transformation — Outer Ending Mirrors Inner Release',
        why: `Outer endings correspond precisely to an inner readiness to release — the world removes what an inner part of you has already, quietly, let go of.`,
        shadow: `You might resist the outer ending because the corresponding inner release hasn't actually happened yet — clinging outwardly to what was already relinquished within, or vice versa.`,
        path: `Let the inner release complete honestly. The outer ending settles cleanly once it truly corresponds to a finished inner process.`,
      },
      14: {
        heading: 'Correspondence & Temperance — Outer Balance Mirrors Inner Integration',
        why: `Visible equilibrium corresponds to a genuinely integrated inner state — outer moderation reflects an inner reconciliation of opposites, not merely a managed performance.`,
        shadow: `You might moderate outwardly as management rather than integration — appearing balanced while the corresponding inner opposites remain actively unreconciled.`,
        path: `Do the actual inner integration. Outer balance that corresponds to a real inner blend holds; balance performed over unresolved opposites does not.`,
      },
      15: {
        heading: 'Correspondence & The Devil — Outer Bondage Mirrors an Inner Belief',
        why: `The outer chain corresponds exactly to an inner belief in its necessity — circumstances that feel binding are mirroring a conviction still held within that this bondage is required or deserved.`,
        shadow: `You might fight the outer chain while leaving the corresponding inner belief completely untouched — it simply reappears in a new form because its actual root was never addressed.`,
        path: `Locate and release the corresponding inner belief. The outer chain loosens once its true internal counterpart is finally examined.`,
      },
      16: {
        heading: 'Correspondence & The Tower — Outer Collapse Mirrors an Already-Cracked Foundation',
        why: `An external collapse mirrors an internal structure that had already, quietly, become unstable — the outer event simply makes visible what corresponded to an inner condition long before it happened.`,
        shadow: `You might treat the collapse as pure misfortune, refusing to examine the corresponding inner instability it was actually revealing.`,
        path: `Use the outer collapse as diagnostic information about the inner foundation. Rebuilding both levels together prevents the correspondence from repeating.`,
      },
      17: {
        heading: 'Correspondence & The Star — Outer Hope Mirrors Inner Restoration',
        why: `Genuine outer renewal corresponds to real inner restoration having occurred — the healing you see reflected in your circumstances mirrors healing that's actually happened within first.`,
        shadow: `You might expect outer hope to arrive before doing the corresponding inner restoration — waiting for the mirror to change before the thing it reflects has actually shifted.`,
        path: `Do the inner restorative work first. The correspondence follows: outer renewal reliably mirrors genuine inner healing once it's real.`,
      },
      18: {
        heading: 'Correspondence & The Moon — Outer Ambiguity Mirrors Inner Fear',
        why: `An unclear outer situation is often the external mirror reflecting unintegrated fear — ambiguity outside corresponds to unexamined fear inside, not to genuine external deception.`,
        shadow: `You might trust the anxious projection as external fact, without checking whether it corresponds to an inner fear rather than an outer reality.`,
        path: `Examine the inner shadow the ambiguity is mirroring. Clarity returns to the outer situation once the corresponding inner fear is actually integrated.`,
      },
      19: {
        heading: 'Correspondence & The Sun — Outer Warmth Mirrors Inner Authenticity',
        why: `The warmth people feel from you corresponds directly to how authentically aligned you are within — genuine radiance outward requires a genuinely settled state inward.`,
        shadow: `You might perform warmth over inner disconnection — the gap shows up as relationships that feel bright but strangely hollow.`,
        path: `Let your outer warmth track your real inner authenticity. When the two genuinely correspond, the brightness stops feeling performed.`,
      },
      20: {
        heading: 'Correspondence & Judgement — The Outer Call Mirrors an Inner Readiness',
        why: `An outer summons corresponds precisely to an inner readiness that's quietly matured — the call arrives because something inside is actually prepared to answer it.`,
        shadow: `You might hear the outer call and insist the inner readiness isn't there yet, when the correspondence itself is the evidence that it already is.`,
        path: `Trust that the outer summons corresponds to genuine inner readiness. Answering it is simply acknowledging a correspondence that already exists.`,
      },
      21: {
        heading: 'Correspondence & The World — Outer Completion Mirrors Inner Wholeness',
        why: `A genuinely completed outer cycle corresponds to an inner sense of wholeness having been reached — the visible mastery mirrors an internal integration that's actually occurred.`,
        shadow: `You might claim outer completion while the corresponding inner wholeness is still missing — a finish line crossed without the internal integration it's supposed to represent.`,
        path: `Let your outer completion track your real inner wholeness. The mirror is honest — make sure what it reflects is actually there.`,
      },
      22: {
        heading: 'Correspondence & The Fool — Outer Beginning Mirrors Inner Openness',
        why: `A genuinely fresh outer start corresponds to real inner openness — the world offers new beginnings in proportion to how much space you've actually cleared for them within.`,
        shadow: `You might chase outer novelty while the corresponding inner openness hasn't actually been created — new starts that quietly recreate the same unexamined inner terrain.`,
        path: `Clear the inner ground genuinely before the outer leap. A beginning that mirrors real internal space outlasts one built on just outer motion.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF VIBRATION — "Nothing rests; everything moves and vibrates."
    // Reads each arcana as a frequency being emitted — the somatic
    // frequency calibration that regulates what a life expands toward
    // or contracts away from.
    // ═══════════════════════════════════════════════════════════════════
    vibration: {
      1: {
        heading: 'Vibration & The Magician — Your Frequency of Focused Will',
        why: `You emit a high, coherent frequency of directed intention — the world responds to the sheer clarity of your signal, not to force applied against it.`,
        shadow: `You might scatter the signal — a frequency splitting across too many directions at once, so the world receives a garbled transmission and answers with equally scattered results.`,
        path: `Sharpen your signal to a single coherent frequency. What you manifest is proportional to how undivided your transmission is.`,
      },
      2: {
        heading: 'Vibration & The High Priestess — The Frequency Beneath Hearing',
        why: `You carry a subtle, low-amplitude frequency — information moving beneath conscious detection, sensed rather than heard, requiring a stillness most lives don't make room for.`,
        shadow: `You might drown your subtle frequency in noise — running your life at such constant volume the quieter signal never has a chance to be received.`,
        path: `Create genuine quiet. The subtle frequency is always transmitting; the discipline is building enough stillness to actually receive it.`,
      },
      3: {
        heading: 'Vibration & The Empress — Your Frequency of Overflow',
        why: `You emit a frequency of generative abundance — a signal broadcasting "there is enough" that draws material and relational resources into resonance with it.`,
        shadow: `You might run a scarcity frequency beneath an outward display of abundance — the deeper signal is what the world actually answers, regardless of the surface performance.`,
        path: `Calibrate your true frequency to genuine sufficiency, not performed generosity. What resonates back matches the real signal, not the display.`,
      },
      4: {
        heading: 'Vibration & The Emperor — Your Frequency of Load-Bearing Order',
        why: `You carry a low, steady, weight-bearing frequency — the somatic calibration that lets structure hold without collapsing under pressure.`,
        shadow: `You might clench your frequency too tight — a contraction signal so constant nothing new can enter, mistaking rigidity for stability.`,
        path: `Loosen the frequency just enough to allow expansion alongside order. A structure that can breathe holds weight longer than one that can't.`,
      },
      5: {
        heading: 'Vibration & The Hierophant — Your Frequency of Transmitted Wisdom',
        why: `You carry a resonant frequency built for transmission — wisdom vibrating outward in a form other minds can actually receive and pass along.`,
        shadow: `Your frequency can harden into a single fixed pitch — dogma transmitted so rigidly it can no longer resonate with anyone whose frequency differs even slightly.`,
        path: `Keep your transmission flexible enough to resonate with new listeners. Living wisdom vibrates; frozen doctrine does not.`,
      },
      6: {
        heading: 'Vibration & The Lovers — The Frequency of Genuine Resonance',
        why: `Real connection for you is two frequencies finding actual resonance — not just proximity, but genuine harmonic alignment between two independently coherent signals.`,
        shadow: `You might mistake intensity for resonance — a loud, chaotic frequency confused for deep alignment, producing a connection that vibrates hard but doesn't actually harmonize.`,
        path: `Check for real resonance beneath the intensity. Lasting connection needs frequencies that align, not just ones that are loud together.`,
      },
      7: {
        heading: 'Vibration & The Chariot — Your Frequency of Sustained Momentum',
        why: `Your momentum is fundamentally acoustic rather than muscular: what actually propels you forward across distance and difficulty isn't brute force applied in bursts, but a signal of directed will held steady enough, for long enough, to translate into real, accumulating motion. Your integrated self isn't straining visibly against resistance — it's you once your internal frequency of intention has become so consistent that forward motion simply keeps happening, almost as a side effect of the signal itself, the way a tuning fork held at the right pitch sets anything nearby vibrating in sympathy. You likely already sense the difference between effort and frequency in your own life: the projects that actually moved for you were rarely the ones you pushed hardest on in short, dramatic bursts, and far more often the ones where you managed to hold a steady, unbroken signal of intention over an extended stretch of time. You don't need more intensity to arrive somewhere. You need a frequency you can actually sustain.`,
        shadow: `You might spike your frequency hard and then collapse completely, producing bursts of dramatic, visible motion that look like momentum from the outside but never actually accumulate into arrival. You throw everything at it for a week, a month, a sprint — and then your signal drops out entirely, sometimes for just as long, and the distance you covered in the burst gets largely undone by the distance you lose during the silence that follows. This is an especially seductive shadow because the bursts themselves feel like proof of your commitment; it's genuinely disorienting to realize intensity was never actually the variable that mattered. A spiking, inconsistent frequency doesn't accumulate for you the way a steady one does, no matter how high your peaks reach, because the troughs in between are where all your accumulated motion bleeds back out. You'll recognize this shadow by a familiar frustration — the sense of having worked "so hard" on something that nonetheless never seems to arrive anywhere, and the quiet suspicion, usually correct, that your problem was never effort but rhythm.`,
        path: `Deliberately trade intensity for consistency — choose a frequency you can genuinely sustain over one that merely looks impressive in short bursts. In practice this means scaling your daily or weekly signal down to something you can actually hold without collapsing afterward, even if it looks unglamorous compared to what a dramatic burst would produce; a small, unbroken frequency held for months will outperform an intense one that only survives for days. Treat the troughs — the moments your signal wants to drop out entirely — as the actual site of your work, rather than as failures to be ashamed of. Your discipline isn't never wavering, it's catching your waver quickly and returning to baseline before too much distance is lost. Over time, what looks from the outside like an ordinary, undramatic you quietly, steadily moving forward is the fullest expression of this available to you: a frequency held so consistently that momentum simply becomes the natural, almost inevitable consequence of your own signal.`,
      },
      8: {
        heading: 'Vibration & Justice — The Frequency the World Answers Honestly',
        why: `The frequency you emit is exactly what a fair world answers back, uninflected and unfiltered — your somatic calibration made visible as consequence.`,
        shadow: `You might emit a frequency braced for injustice and call the accurate reply "bad luck" — inescapable inertia from generational and past choices, mistaken for an external verdict rather than a resonant answer.`,
        path: `Recalibrate your frequency toward trust rather than bracing. The world answers whatever signal you're actually sending.`,
      },
      9: {
        heading: 'Vibration & The Hermit — Turning Your Frequency Inward to Calibrate',
        why: `You withdraw specifically to recalibrate your signal — turning your frequency inward long enough to hear what it's actually transmitting before returning to broadcast it outward again.`,
        shadow: `You might withdraw from the noise without ever actually recalibrating — silence without adjustment, so the same uncalibrated frequency simply resumes on return.`,
        path: `Use the withdrawal for genuine recalibration. The point of the quiet is adjustment for you, not just distance from the noise.`,
      },
      10: {
        heading: 'Vibration & The Wheel of Fortune — The Frequency That Cycles',
        why: `A downturn doesn't represent failure or interruption in an otherwise steady signal for you — since nothing without exception rests, a frequency that only ever moved in one direction wouldn't be a frequency at all, it'd be a flat line, another word for no signal whatsoever. Oscillation itself — the rise and the fall, the expansion and contraction — isn't a flaw in your fortune, it's the actual mechanism by which your fortune, as a living signal, is able to move at all. Your life has an unmistakably rhythmic quality: periods of visible flourishing followed, with eerie reliability, by periods of contraction that can feel alarming in the moment but that, viewed across enough cycles, reveal themselves as the necessary trough that makes your next rise possible. Once you recognize that your wheel's downturn isn't evidence your frequency has broken, you stop making panicked, contraction-phase decisions that would otherwise compound your low point instead of simply riding it through to your next turn.`,
        shadow: `You might treat every contraction as a crisis rather than a phase — reacting to the low point as though your entire signal has permanently failed, and making drastic, fear-driven decisions specifically during the part of your rhythm least suited to your good judgment. This is extremely common and extremely costly: abandoning a plan, a relationship, or a direction at exactly the moment your wheel is at its lowest turn, mistaking the trough for the destination rather than a predictable, temporary phase. There's also a subtler version during expansion — refusing to prepare for the inevitable contraction because your rise feels, in the moment, like it'll simply continue forever. No signal holds a single amplitude indefinitely; spend every high point as though it will never end, and you're setting yourself up to be blindsided by a contraction that was, in fact, entirely predictable if you'd been paying attention to the rhythm rather than only the current reading.`,
        path: `Develop a genuinely different relationship with timing — learn to read which phase of the cycle you're actually in, and calibrate your decisions to the phase rather than to the raw emotional intensity of the moment. During contraction, resist large, permanent decisions, and treat your low point as a season for consolidation and honest assessment rather than abandonment or panic — your trough isn't asking you to quit, it's asking you to conserve until your rhythm turns. During expansion, use your visible momentum to actually build reserves and structure for the contraction you now know, with confidence, is coming. Your mastery isn't learning to stop the wheel from turning, which you can't do, but learning to move with its rhythm skillfully enough that neither phase catches you unprepared — trusting your trough to be temporary, and trusting your crest to be earned rather than permanent.`,
      },
      11: {
        heading: 'Vibration & Strength — Your Frequency of Settled Power',
        why: `You emit a low, unshowy frequency of genuine command — power that doesn't need to spike or perform because it's already stable at its natural pitch.`,
        shadow: `Your frequency might spike to prove strength that isn't actually settled — dramatic displays of control masking an underlying instability in the true signal.`,
        path: `Let the frequency settle rather than spike. Real strength vibrates quietly for you; it doesn't need volume to be felt.`,
      },
      12: {
        heading: 'Vibration & The Hanged Man — Your Frequency Slowed Deliberately',
        why: `You intentionally slow your frequency — a deliberate reduction in signal speed that lets information normally missed at full velocity actually register.`,
        shadow: `Your frequency might slow from paralysis rather than intention — stillness that isn't producing any new information, just delay without insight.`,
        path: `Slow the frequency on purpose, not by default. The deceleration should serve your perception, not substitute for it.`,
      },
      13: {
        heading: 'Vibration & Transformation — A Frequency That Must Stop to Change Pitch',
        why: `Your frequency can wear so deeply into its current pitch that it has to fully cease before a new one can begin — some transitions require the old signal to go completely silent first.`,
        shadow: `You might try to shift pitch without ever letting the old frequency stop — layering a new signal over one still running, producing dissonance rather than genuine change.`,
        path: `Allow the old frequency to fully end. Clean silence between signals is what lets your next pitch actually take.`,
      },
      14: {
        heading: 'Vibration & Temperance — Your Frequency of Blended Harmonics',
        why: `You merge two frequencies into a genuinely third, harmonic signal — not compromise, but an actual synthesis vibrating at a rate neither original frequency could reach alone.`,
        shadow: `You might alternate rapidly between two unblended frequencies and call it balance — oscillation mistaken for the genuine harmonic merge you actually need.`,
        path: `Let the frequencies actually merge rather than alternate. True blending produces a new, steadier signal, not a fast switch between two old ones.`,
      },
      15: {
        heading: 'Vibration & The Devil — A Frequency Locked to a Single Compulsive Pitch',
        why: `Your signal can get stuck oscillating at a narrow, compulsive frequency — the same craving-pitch repeating because nothing has interrupted the loop long enough to let it shift.`,
        shadow: `You might mistake the compulsive pitch for the only available frequency — forgetting a different signal is possible once the loop is actually broken.`,
        path: `Interrupt the loop deliberately, even briefly. A single genuine break in the pitch is enough to prove a different frequency is reachable.`,
      },
      16: {
        heading: 'Vibration & The Tower — A Frequency That Shatters an Overloaded Structure',
        why: `A frequency spike so sudden fractures a structure that could no longer absorb the load — your collapse is the signal finally exceeding what the old form could carry.`,
        shadow: `You might rebuild the identical structure immediately, without recalibrating for the frequency that just proved it couldn't hold.`,
        path: `Rebuild at a frequency your new structure can actually sustain. The collapse was information about capacity, not just an event to recover from.`,
      },
      17: {
        heading: 'Vibration & The Star — Your Frequency of Restored Signal Clarity',
        why: `Your frequency returns to clarity after distortion — a clean, high signal of genuine hope re-establishing itself once the noise that muddied it has settled.`,
        shadow: `You might broadcast hope at a volume that doesn't match the actual signal underneath — performed brightness over a frequency that hasn't genuinely cleared yet.`,
        path: `Let the signal clarify honestly before broadcasting it. Real hope vibrates cleanly for you; it doesn't need to be amplified past what's true.`,
      },
      18: {
        heading: 'Vibration & The Moon — A Frequency Distorted by Unprocessed Static',
        why: `Your signal runs through interference — subconscious static distorting what would otherwise be an accurate transmission, so fear reads with the same amplitude as fact.`,
        shadow: `You might broadcast the distorted signal as though it were clear — acting on the static-laden frequency without checking it against a cleaner source.`,
        path: `Filter the static deliberately before you act on the signal. What clears the interference is patient, embodied grounding, not more analysis of the fear itself.`,
      },
      19: {
        heading: 'Vibration & The Sun — Your Frequency of Unforced Vitality',
        why: `Your vitality isn't an achievement — it's a resting state, the natural pitch your system settles into once nothing is actively obstructing it. Since everything, without exception, is in motion at some frequency, your radiance is what that motion looks like in you when it's finally unobstructed, when there's no interference, no suppressed signal, no effortful management of appearances standing between your system and its own true resonance. This matters, because it means the warmth and clarity you carry were never meant to be generated through effort. They're what remains once your effort of hiding, managing, or performing has simply stopped being necessary. Your most genuine, most magnetic state is very likely the one where you're not trying to be anything in particular — where the vitality other people find so inspiring is simply the sound of your system running clean, unobstructed, at its natural amplitude. Your goal was never to produce more brightness through willpower. It's to identify and remove whatever's been quietly damping your frequency down from its natural, resting pitch.`,
        shadow: `You might manufacture a high, bright frequency through sheer effort, specifically because your real signal underneath has quietly dropped, and use the performed brightness to mask — from others, and often from yourself — that your depletion is actually occurring. This is different from ordinary low energy, because it gets louder, not quieter; your forced frequency often intensifies and grows more visibly cheerful precisely as your underlying resource is running out, as though volume could compensate for what your amplitude has lost. This is exhausting in a way that's difficult to explain to people who haven't experienced it, because from the outside it looks like vitality, and only from the inside do you register it as a kind of increasingly effortful performance running on fumes. Your tell is usually a specific hollowness after the performance ends — a crash disproportionate to your actual output, because the output was never the expensive part. The expensive part was manufacturing a frequency that didn't match what your system actually had available.`,
        path: `Let your frequency drop, honestly, to whatever level actually reflects your current state, rather than forcing it upward to maintain an image. This will feel, initially, like a kind of failure — showing up dimmer, less immediately warm, less instantly magnetic — but a frequency you allow to rest honestly at its true, current level recovers far faster than one you keep forcing upward against real depletion, because rest is what actually restores your amplitude rather than merely disguising its absence. Build in real recovery before your forced-brightness pattern becomes habitual, and learn to recognize the specific, slightly manic quality your own performed vitality takes on when it's become compensation rather than genuine resonance. Trust that your unforced, resting frequency — even on an ordinary day, even without any performance attached — is already warm enough to be genuinely magnetic. Your real vitality was never about the volume. It was always about the health of the signal underneath it.`,
      },
      20: {
        heading: 'Vibration & Judgement — The Frequency That Finally Reaches Threshold',
        why: `Your frequency has been building until it crosses an audible threshold — the summons is simply the signal finally loud enough that it can no longer be ignored.`,
        shadow: `You might hear the threshold frequency and deliberately damp the volume back down rather than answering it.`,
        path: `Let the frequency be heard at full volume. The threshold was crossed for a reason; damping it back down only delays the same signal's return.`,
      },
      21: {
        heading: 'Vibration & The World — A Frequency at Full, Stable Resonance',
        why: `You've reached full, stable resonance across every part of your system — completion as a signal finally vibrating in total coherence.`,
        shadow: `You might declare resonance while one part of the system is still vibrating out of sync — premature completion that hasn't actually reached full coherence yet.`,
        path: `Confirm every part of the signal is genuinely in sync before calling it complete. Real resonance is total for you, not partial.`,
      },
      22: {
        heading: 'Vibration & The Fool — The Frequency of Unclaimed Potential',
        why: `You carry pure potential frequency — a signal not yet pitched in any direction, capable of resonating with anything your will chooses to align it toward.`,
        shadow: `Your frequency might never settle into any pitch at all — endless potential broadcast without ever actually resonating with anything real.`,
        path: `Let the open frequency choose a direction and commit to that pitch. Potential only becomes music once you actually sustain a note.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF CAUSE & EFFECT — "Every cause has its effect; every effect
    // has its cause." Reads each arcana as a causal chain — often
    // generational or karmic — producing a recurring pattern, and the
    // corrective action that changes what the chain produces next.
    // ═══════════════════════════════════════════════════════════════════
    causeEffect: {
      1: {
        heading: 'Cause & Effect & The Magician — Your Action Sets the Chain in Motion',
        why: `You're the originating cause itself — the deliberate first action a chain of consequence will trace back to. Nothing manifests here by accident; every result has this decisive first cause at its root.`,
        shadow: `You might take action without acknowledging it as a cause — disowning the origin once the effects arrive, treating consequence as though it appeared from nowhere.`,
        path: `Own the causal chain from its first link. Deliberate causes produce traceable, correctable effects; disowned ones just repeat.`,
      },
      2: {
        heading: 'Cause & Effect & The High Priestess — The Hidden Cause Behind the Visible Effect',
        why: `The visible effect in your life often has an invisible, unconscious cause — the true root of a pattern is frequently veiled until you deliberately uncover it.`,
        shadow: `You might treat only the visible surface as the cause, never excavating the deeper unconscious root that's actually generating the pattern.`,
        path: `Excavate the hidden cause rather than treating the surface symptom. Effects change permanently only when their real, often unseen root is addressed.`,
      },
      3: {
        heading: 'Cause & Effect & The Empress — Genuine Nurture Yields Genuine Growth',
        why: `What you nurture with real care produces real growth — your abundance is the effect of a specific, sustained causal input, not a matter of chance.`,
        shadow: `You might expect abundant effects from inconsistent or resentful nurturing — wanting the harvest without the corresponding cause of genuine, sustained care.`,
        path: `Match the cause to the effect you want, honestly. Real, sustained nurture is the actual cause abundance requires — there's no shortcut around it.`,
      },
      4: {
        heading: 'Cause & Effect & The Emperor — Your Disciplined Cause Produces Durable Structure',
        why: `Nothing happens to you by chance — every solid, load-bearing structure you can point to in your life was the traceable result of sustained causal effort you applied consistently over time. Every cause produces its effect; applied to your material world, this means the stability other people admire in you was never handed down to you. You built it, causally, brick by brick, through a specific chain of disciplined choices you repeated long enough that the resulting structure stopped needing your conscious effort to maintain. This is, in a sense, the most reassuring reading available to you: it means the security you're after has never been a matter of luck, birthright, or circumstance beyond your control. It's a mechanism you can operate directly, because you already understand, better than most, that cause reliably produces its matching effect for you.`,
        shadow: `You might want the effect — stability, authority, a structure that holds — while quietly hoping to skip the actual causal groundwork it's always required of you. This shows up as structures built in haste, under pressure, or through shortcuts: financial systems assembled without the discipline to sustain them, authority claimed without the sustained investment that would make it genuinely respected rather than merely asserted. Cause and effect doesn't forgive this gap: a structure erected without its proper causal foundation holds only as long as no real pressure tests it, and will collapse, often publicly and at the worst possible moment, precisely because the cause that should have produced lasting durability was never actually supplied. There's also a subtler version — building genuinely disciplined structure in one area while unconsciously assuming it will compensate for causal neglect somewhere else, as though the effect could be borrowed from a different account than the one it was actually earned in. It can't.`,
        path: `Identify, with total honesty, which of your current structures were actually built through sustained causal effort and which you assembled quickly and are quietly waiting for the pressure that will reveal their missing foundation. Where the gap exists, the only real solution is supplying the cause you skipped — not as punishment, but as simple mechanical necessity, the way a building missing its foundation can't be fixed by repainting the walls. This often means slowing down considerably, tolerating a period where your structure looks less impressive than you'd like while the actual disciplined groundwork gets laid underneath it. Your reward for that patience is a durability shortcuts can never produce: a structure built causally, over real time, through consistent discipline, doesn't require your constant vigilance to defend because it was never precarious to begin with.`,
      },
      5: {
        heading: 'Cause & Effect & The Hierophant — Transmission Is the Cause of Continuity',
        why: `What you deliberately teach and transmit becomes the cause of what continues into the future — wisdom passed on is the direct cause of a lineage's survival.`,
        shadow: `You might withhold transmission and then lament the effect of a lineage that fails to continue — the cause was never actually supplied.`,
        path: `Actively transmit what matters. Continuity is always the effect of a deliberate act of teaching, not an automatic inheritance.`,
      },
      6: {
        heading: 'Cause & Effect & The Lovers — A Choice Causes the Relationship\'s Trajectory',
        why: `A specific choice becomes the cause determining a relationship's entire future trajectory — the quality of union is the direct effect of the alignment chosen at the start.`,
        shadow: `You might choose out of convenience or fear and then treat the relationship's later difficulty as unrelated misfortune rather than its direct effect.`,
        path: `Choose deliberately, recognizing the choice as a cause with lasting effects. A relationship's trajectory can only be redirected by addressing its actual causal root.`,
      },
      7: {
        heading: 'Cause & Effect & The Chariot — Sustained Cause Produces Real Arrival',
        why: `Arrival is the accumulated effect of sustained directional cause — every mile you cover is the direct result of will consistently applied.`,
        shadow: `You might expect the effect of arrival without supplying the cause of consistent direction — frustration at a lack of progress that was never actually caused.`,
        path: `Supply the sustained cause your destination requires. Arrival is always the effect of consistency, not of wishing.`,
      },
      8: {
        heading: 'Cause & Effect & Justice — The Law Made Explicit',
        why: `None of your readings states this Law more literally than your Justice. It's the mechanism itself, rendered visible: an internal ledger, precise and unbribable, in which every circumstance you encounter is the traceable, calculable effect of a prior cause — sometimes recent and easy to name, but often generational, inherited, laid down long before you were in a position to consent to it. This makes an uncomfortable but ultimately liberating claim about your life: nothing that keeps recurring for you is unearned bad fortune arriving from nowhere. It's inescapable inertia resulting from generational and past choices — a chain reaching back further than your own decisions, still producing effect in your present because it's never actually been traced to its origin and resolved there. You likely already sense this: a persistent intuition that the imbalance you keep encountering isn't simply the world being unfair to you specifically, but something closer to an unpaid account, older than your current circumstances, quietly still generating interest against you.`,
        shadow: `You might treat every recurring effect in your life as isolated, unearned misfortune — a run of bad luck, an unfair world, a pattern with no traceable cause — specifically because tracing it honestly would require accepting a harder truth: that the chain producing it reaches back further than any single external villain you could blame it on. This shadow is seductive because it offers immediate relief; "the world is simply unfair to me" requires nothing further of you, while "there is a cause here, possibly generations old, that I haven't yet located" requires real, often uncomfortable excavation. But a cause you leave untraced doesn't stop producing its effect merely because you've declined to look at it. It keeps generating the same imbalance, the same recurring disappointment, precisely because the actual root has never been addressed, only endured. You'll recognize this shadow by its specific emotional flavor: a chronic, low-grade sense of being owed something by a world that never quite pays out, without ever asking the harder question of where the original imbalance in your ledger actually began.`,
        path: `Trace your recurring effect back to its actual cause, however many links in the chain that requires, and however uncomfortable it is to discover the cause may not be entirely, or even primarily, your own doing — inherited patterns, generational choices, timelines set in motion before you had any say in them, all of which still count as causes you must recognize before their effect can finally stop repeating. This isn't about assigning blame further back in the chain; it's about accurately locating where the imbalance actually originated so your correction can be applied at the right point rather than at a symptom several links downstream. Examine your family patterns, inherited beliefs about fairness and worth, and repeating relational or financial dynamics that predate your own choices, and ask honestly what cause, however old, is still quietly generating this effect. Your chain only ever breaks at its actual root. Once you genuinely identify and address it — not merely acknowledge it intellectually, but actively resolve it — your ledger finally, reliably, balances.`,
      },
      9: {
        heading: 'Cause & Effect & The Hermit — Withdrawal Causes Clarity',
        why: `Deliberate withdrawal is the specific cause producing the effect of clarity — insight doesn't arrive by accident for you, it's caused by the discipline of solitude.`,
        shadow: `You might withdraw without the corresponding cause of genuine reflection, then wonder why the expected effect of clarity never arrives.`,
        path: `Use the withdrawal as an actual cause, not just an absence. Clarity is the effect of engaged solitude, not merely of distance from others.`,
      },
      10: {
        heading: 'Cause & Effect & The Wheel of Fortune — The Cycle Is a Chain, Not an Accident',
        why: `The recurring cycle in your life has an identifiable cause — what looks like fate is a chain of consequence repeating because its originating cause hasn't yet been addressed.`,
        shadow: `You might call the recurring cycle luck, avoiding the harder work of tracing the actual cause that keeps producing it.`,
        path: `Identify the specific cause behind the recurring cycle. The wheel only turns differently once that root cause is actually changed.`,
      },
      11: {
        heading: 'Cause & Effect & Strength — Integration Causes Genuine Power',
        why: `Your settled inner power is the effect of genuinely integrating instinct rather than suppressing it — the calm is caused by real reconciliation, not by force.`,
        shadow: `You might suppress instinct and expect the effect of genuine strength, when suppression as a cause only produces eventual, more disruptive breakthrough.`,
        path: `Supply integration as the actual cause. Lasting strength is always the effect of reconciliation, never of ongoing suppression.`,
      },
      12: {
        heading: 'Cause & Effect & The Hanged Man — Surrender Causes a New Perspective',
        why: `Genuine surrender is the specific cause producing the effect of a transformed perspective — insight from suspension doesn't happen automatically, it's caused by actually releasing control.`,
        shadow: `You might remain suspended without ever actually surrendering control, so the expected effect of new perspective never has a cause to produce it.`,
        path: `Genuinely release control as the cause. Your new vantage point is the effect of real surrender, not of prolonged discomfort alone.`,
      },
      13: {
        heading: 'Cause & Effect & Transformation — The Ending Causes the Renewal',
        why: `A clean ending is the necessary cause for the effect of genuine renewal — nothing new can be effectively caused while the old cause is still technically running.`,
        shadow: `You might want the effect of renewal while refusing to supply the cause of a genuine ending — expecting rebirth from a death that was never actually allowed to complete.`,
        path: `Let the ending fully occur as the actual cause. Renewal is the direct effect of a completed release, not a partial one.`,
      },
      14: {
        heading: 'Cause & Effect & Temperance — Balanced Cause Produces Sustainable Effect',
        why: `Moderate, well-blended causes produce sustainable, lasting effects for you — extreme causes tend to produce effects that eventually collapse under their own imbalance.`,
        shadow: `You might apply extreme causes and expect balanced effects — all-or-nothing input producing exactly the volatile outcome that pattern always causes.`,
        path: `Moderate the cause deliberately. Sustainable effects require balanced causal input, not intermittent extremes.`,
      },
      15: {
        heading: 'Cause & Effect & The Devil — The Original Cause of the Compulsion Is Still Active',
        why: `Your compulsion is an effect whose original cause has never actually been addressed — the chain persists precisely because its root has stayed hidden and untreated.`,
        shadow: `You might treat only the compulsive effect, over and over, while the actual originating cause remains completely unexamined.`,
        path: `Locate and address the original cause, not just its recurring effect. The compulsion only ends once its true root is finally treated.`,
      },
      16: {
        heading: 'Cause & Effect & The Tower — The Collapse Is the Effect of an Ignored Cause',
        why: `Your sudden collapse is the effect of a cause that had been building, unaddressed, for far longer than the collapse itself — nothing about the fall is actually random.`,
        shadow: `You might treat the collapse as unrelated bad luck, missing the specific, traceable cause that had been accumulating toward exactly this effect.`,
        path: `Trace the collapse back to its accumulating cause and address that directly. Rebuilding without this step only recreates the same eventual effect.`,
      },
      17: {
        heading: 'Cause & Effect & The Star — Genuine Effort Causes Genuine Hope',
        why: `Your authentic hope is the effect of real restorative cause already supplied — healing that's genuinely occurred, not hope manufactured without a corresponding cause behind it.`,
        shadow: `You might generate the effect of hope without supplying the cause of actual restoration — optimism with no causal ground underneath it.`,
        path: `Supply the real restorative cause first. Durable hope is always the effect of genuine healing work, not a substitute for it.`,
      },
      18: {
        heading: 'Cause & Effect & The Moon — Unexamined Fear Causes Recurring Confusion',
        why: `Recurring confusion has a specific, addressable cause — an unexamined fear generating the effect of a foggy, hard-to-trust reality again and again.`,
        shadow: `You might treat the confusion itself as the problem, never tracing it back to the specific unexamined fear causing it.`,
        path: `Trace the confusion to its causal fear and examine it directly. Clarity is the effect of addressing the cause, not of waiting out the fog.`,
      },
      19: {
        heading: 'Cause & Effect & The Sun — Alignment Causes Genuine Vitality',
        why: `Your genuine vitality is the effect of living in real alignment with your own nature — the warmth is caused, not incidental.`,
        shadow: `You might perform vitality without the corresponding cause of real alignment, producing an effect that reads as brightness but runs on borrowed energy.`,
        path: `Supply real alignment as the cause. Sustainable vitality is always the effect of authenticity, not of performance.`,
      },
      20: {
        heading: 'Cause & Effect & Judgement — Accumulated Growth Causes the Summons',
        why: `Your summons is the effect of accumulated inner growth finally reaching a threshold — the call to rise is caused by real development that's already happened, not an arbitrary event.`,
        shadow: `You might hear the summons and treat it as a demand disconnected from any cause, rather than recognizing it as the natural effect of growth already achieved.`,
        path: `Recognize the summons as the effect of your own real progress. Answering it is simply acknowledging a cause that already exists within you.`,
      },
      21: {
        heading: 'Cause & Effect & The World — Sustained Cause Across a Full Cycle Produces Mastery',
        why: `Your mastery is the accumulated effect of consistent, sustained cause applied across an entire cycle — nothing about this completion is sudden or accidental.`,
        shadow: `You might expect the effect of mastery without having supplied the cause of sustained effort across the full cycle.`,
        path: `Trust the accumulated cause. Genuine completion is the effect of everything actually invested across the whole arc, not a shortcut to its ending.`,
      },
      22: {
        heading: 'Cause & Effect & The Fool — The First Cause of an Entirely New Chain',
        why: `You're the origin point of a brand-new causal chain — a genuine beginning, uncaused by the prior cycle's momentum, free to set an entirely different chain of effects in motion.`,
        shadow: `You might begin again without noticing the old chain's cause is still quietly running underneath — a new start that unconsciously carries the same old cause forward.`,
        path: `Consciously set a new cause rather than assuming a clean slate. A genuinely new chain requires a deliberately new first cause, not just a change of scenery.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF POLARITY — "Everything is dual; opposites are identical in
    // nature but different in degree; extremes meet." Reads each arcana
    // as a spectrum being lived at one pole, and the practice of
    // transmuting toward the integrated middle.
    // ═══════════════════════════════════════════════════════════════════
    polarity: {
      1: {
        heading: 'Polarity & The Magician — Between Powerlessness and Manipulation',
        why: `You sit on a spectrum running from powerlessness at one pole to manipulation at the other — your true mastery is neither extreme, but the integrated middle where will is exercised in service, not domination.`,
        shadow: `You might oscillate between the two poles — swinging from feeling entirely without agency to overcorrecting into controlling every outcome around you.`,
        path: `Locate the integrated middle: agency exercised with consent and clarity, neither withheld nor imposed.`,
      },
      2: {
        heading: 'Polarity & The High Priestess — Between Silence and Concealment',
        why: `You live on a spectrum from healthy discretion to defensive secrecy — the same withholding can be sacred boundary at one pole or avoidant hiding at the other.`,
        shadow: `You might default to concealment and call it mystery, when the actual difference is whether your silence protects something sacred or simply avoids something uncomfortable.`,
        path: `Discern which pole you're actually standing on. Genuine discretion serves depth; concealment serves fear — know which one is operating.`,
      },
      3: {
        heading: 'Polarity & The Empress — Between Depletion and Overextension',
        why: `You span a spectrum from giving until depleted to giving so much it becomes overextension — your true abundance is the integrated middle of sustainable, reciprocal generosity.`,
        shadow: `You might treat one pole as virtue — either total self-sacrifice or unbounded overgiving — without noticing both are imbalances of the same axis.`,
        path: `Find the sustainable center. Generosity that depletes you and generosity that overextends you are the same imbalance wearing different faces.`,
      },
      4: {
        heading: 'Polarity & The Emperor — Between Chaos and Tyranny',
        why: `You run a spectrum from formlessness to rigid control — your real authority is the integrated middle, structure firm enough to hold and flexible enough to adapt.`,
        shadow: `You might oscillate between total looseness and total control, mistaking each swing for a correction rather than recognizing both as the same unintegrated extreme.`,
        path: `Build structure at the actual midpoint: firm enough to hold weight, open enough to revise. Neither pole alone produces durable order.`,
      },
      5: {
        heading: 'Polarity & The Hierophant — Between Faithlessness and Dogma',
        why: `You span a spectrum from rejecting all tradition to rigidly worshipping it — your genuine wisdom lives at the integrated middle, honoring structure while remaining open to its evolution.`,
        shadow: `You might swing between total rebellion against inherited wisdom and total, uncritical submission to it.`,
        path: `Hold tradition at its living middle: neither discarded nor frozen, but honored and allowed to keep growing.`,
      },
      6: {
        heading: 'Polarity & The Lovers — Between Isolation and Fusion',
        why: `You run a spectrum from total independence to total merger — your real union is the integrated middle, two distinct selves choosing genuine connection without dissolving into each other.`,
        shadow: `You might oscillate between guarding total independence and losing all boundaries in fusion, mistaking each as the answer to the other's failure.`,
        path: `Choose the integrated middle: connection that preserves both selves intact. Neither isolation nor fusion is actually union.`,
      },
      7: {
        heading: 'Polarity & The Chariot — Between Passivity and Force',
        why: `You span a spectrum from drifting passivity to aggressive force — your genuine directed will is the integrated middle, momentum generated through steady command rather than either extreme.`,
        shadow: `You might swing between letting circumstance dictate everything and forcing outcomes that resist natural timing.`,
        path: `Find the middle of directed, unforced momentum. Real movement needs neither surrender to drift nor combat against the current.`,
      },
      8: {
        heading: 'Polarity & Justice — Between Harshness and Permissiveness',
        why: `You run a spectrum from punitive rigidity to boundaryless permissiveness — your true balance sits at the integrated middle, accountability held with compassion rather than either extreme alone.`,
        shadow: `You might swing between merciless judgment and refusing to hold any standard at all, mistaking each for the correction of the other's excess.`,
        path: `Hold the integrated middle: fair accountability delivered with genuine compassion. Neither harshness nor permissiveness alone produces real balance.`,
      },
      9: {
        heading: 'Polarity & The Hermit — Between Isolation and Enmeshment',
        why: `You span a spectrum from total withdrawal to total enmeshment in others' lives — your genuine solitude is the integrated middle, apart enough to hear yourself, connected enough to remain reachable.`,
        shadow: `You might swing between complete disappearance and an inability to ever be alone, treating each as the cure for the other's discomfort.`,
        path: `Locate the sustainable middle of solitude: enough distance for clarity, not so much that connection is severed entirely.`,
      },
      10: {
        heading: 'Polarity & The Wheel of Fortune — Between Resignation and Control',
        why: `You run a spectrum from passive resignation to the fantasy of total control over fate — your genuine navigation of cycles sits at the integrated middle, participating actively while accepting what can't be forced.`,
        shadow: `You might oscillate between giving up entirely on influencing outcomes and white-knuckling every turn of the wheel.`,
        path: `Find the integrated middle: engaged effort paired with real acceptance of the cycle's own timing.`,
      },
      11: {
        heading: 'Polarity & Strength — Between Suppression and Indulgence',
        why: `What looks in you like two entirely different conditions — total suppression of instinct on one end, total indulgence of impulse on the other — are in fact simply differing degrees of the same underlying energy, not two separate forces at war. The classical image of Strength, a figure gently closing the mouth of a lion rather than fighting or caging it, describes you exactly: your genuine power isn't the eradication of your instinctual pole, and it isn't surrender to it either. It's your integrated middle, the point on the spectrum where your instinct is neither denied nor unleashed but acknowledged, met, and gently guided in a direction you choose. Your deepest capability likely lives in exactly this integration — a settled command over your own impulses that doesn't require your constant vigilance because it was never built on suppression in the first place. You aren't fighting your lion. You've learned its language well enough that force has become unnecessary.`,
        shadow: `You might oscillate between the two poles, mistaking each swing as the correction for the failure of the other. Long stretches of rigid self-denial — willpower gritted against every instinct, every appetite, every impulse treated as a threat to be caged — eventually exhaust themselves and give way, often suddenly, to periods of unchecked indulgence, where the very instinct you suppressed for so long finally breaks loose with a force proportional to how long you denied it. Each phase looks, from inside your experience, like the reasonable correction to the excess of the other: after a period of indulgence, suppression feels like discipline finally being restored; after a period of suppression, indulgence feels like relief finally being permitted. But both poles are the same energy, merely at different degrees, and neither is actually your Strength — your genuine integration was never on this oscillating path, because both your suppression and your indulgence share the same underlying premise: that your instinct is an adversary to be managed through force rather than a native part of yourself to be met with a patient, ongoing relationship.`,
        path: `Recognize that your entire oscillation was built on a false premise, and locate the genuinely integrated middle where you no longer treat your instinct as an enemy at all. In practice, this means developing an ongoing, patient relationship with your instinct rather than a periodic war against it: noticing an impulse without either suppressing it reflexively or acting on it reflexively, staying present with it long enough to choose, deliberately, what to do next. This is slower and less dramatic than either pole, which is precisely why you tend to overlook it in favor of the more visible, more emotionally satisfying swings between denial and release. But it's also the only position that actually holds for you over time, because it isn't fighting anything. Your mastery looks, from the outside, remarkably calm — not because you've eliminated your instinct, but because you've finally met it with enough patience that it no longer needs you to cage or indulge it, only guide it.`,
      },
      12: {
        heading: 'Polarity & The Hanged Man — Between Rigid Certainty and Endless Doubt',
        why: `You span a spectrum from rigid certainty to permanent, paralyzing doubt — your genuine wisdom sits at the integrated middle, willing to see from new angles without losing the capacity to eventually decide.`,
        shadow: `You might swing between refusing to ever question a fixed view and never being able to settle on any view at all.`,
        path: `Find the middle: genuinely open to reversal, but capable of eventually landing on a conviction long enough to act.`,
      },
      13: {
        heading: 'Polarity & Transformation — Between Clinging and Premature Abandonment',
        why: `You span a spectrum from clinging to what's already ended to abandoning things before they've actually run their course — your genuine transformation sits at the integrated middle, releasing exactly when something is truly complete.`,
        shadow: `You might oscillate between holding on far too long and quitting far too early, mistaking each pattern for wisdom about timing.`,
        path: `Discern the actual completion point rather than defaulting to either extreme. Real release happens at true completion, not on a fixed schedule of either clinging or fleeing.`,
      },
      14: {
        heading: 'Polarity & Temperance — Between Rigid Discipline and Total Indulgence',
        why: `Your Temperance is the closest thing you carry to a direct, unmetaphorical statement of this Law itself: everything exists on a spectrum, apparent opposites are simply differing degrees of the same underlying energy rather than separate warring forces, and your mastery lives not at either extreme but in the genuine, sustained blend you locate at the exact midpoint between them. Pouring water between two vessels, neither hoarding nor spilling, finding the exact rate of exchange that keeps both containers of your life in continuous, dynamic balance rather than either one running dry or overflowing — this isn't moderation in the watered-down, compromise sense. It's an active, ongoing synthesis: discipline and indulgence, restriction and release, held together in a single sustained state rather than alternated between as though incompatible. Your particular gift is likely an intuitive sense for exactly how much of any given thing is enough — not too austere to be sustainable, not too loose to hold its shape, but a continuous, living blend most people only manage in occasional, unstable flashes.`,
        shadow: `You might mistake your rapid oscillation between the two extremes for the genuine midpoint you actually need. This looks, on the surface, like balance — a period of strict discipline followed by a period of full indulgence, followed by a return to discipline, cycling back and forth in a rhythm that can feel, from inside your experience, like a reasonable equilibrium maintained over time. But an average of two extremes isn't the same thing as genuinely occupying the midpoint, any more than alternating between freezing and scalding water produces something lukewarm. Your oscillating pattern never actually gives you the sustained, integrated blend you need; it gives you two increasingly exaggerated poles, each justified by the excess of the one before it, with the actual midpoint never once genuinely inhabited. You'll recognize this shadow by its exhausting rhythm — the sense of perpetually correcting course rather than ever actually arriving somewhere stable, cycling between "I need to be stricter" and "I deserve to let go" without either state ever settling into something sustainable.`,
        path: `Choose to actually occupy the midpoint as a continuous practice, rather than treating balance as something you achieve by averaging two extremes over time. In practice, this means resisting both the pull toward austere restriction and the pull toward full release in the same moment, finding instead the specific, sustainable rate of exchange — like water moving steadily between two vessels — that neither depletes nor floods either side of your life. This requires more moment-to-moment attention than either extreme, which is part of why the oscillating pattern is so tempting; picking a single pole, even temporarily, requires less continuous calibration than genuinely blending the two. But your reward is precisely what the shadow pattern can never produce: a stable, sustainable state that doesn't require exhausting correction of swinging back the other way, because it was never out of balance to begin with. Your mastery isn't a single achieved state but an ongoing, active blend — attention paid continuously rather than a destination reached once and then abandoned.`,
      },
      15: {
        heading: 'Polarity & The Devil — Between Denial and Total Surrender to Craving',
        why: `You span a spectrum from denying the craving exists to being fully ruled by it — your genuine freedom sits at the integrated middle, acknowledging the pull without either suppressing or obeying it.`,
        shadow: `You might oscillate between white-knuckled denial and total capitulation, mistaking each swing for progress against the other.`,
        path: `Hold the middle: honest acknowledgment of the craving paired with deliberate, non-punitive choice. Your freedom lives in that acknowledgment, not in either extreme.`,
      },
      16: {
        heading: 'Polarity & The Tower — Between False Stability and Chronic Instability',
        why: `You span a spectrum from a rigid structure pretending to be permanent to a life in constant, unaddressed upheaval — your genuine resilience sits at the integrated middle, stable enough to hold, honest enough to rebuild when needed.`,
        shadow: `You might swing between clinging to false permanence and living in perpetual, unprocessed collapse.`,
        path: `Build the integrated middle: structures honest about their own limits, revised before they're forced to shatter.`,
      },
      17: {
        heading: 'Polarity & The Star — Between Despair and Naive Optimism',
        why: `You span a spectrum from despair to unfounded, evidence-free optimism — your genuine hope sits at the integrated middle, grounded in real restoration rather than either extreme.`,
        shadow: `You might oscillate between hopelessness and a forced positivity that ignores real evidence, mistaking each for a cure for the other.`,
        path: `Ground hope in the integrated middle: real evidence of restoration, held honestly, without collapsing into either despair or denial.`,
      },
      18: {
        heading: 'Polarity & The Moon — Between Blind Trust and Total Suspicion',
        why: `You span a spectrum from naive trust in every appearance to total suspicion of everything — your genuine discernment sits at the integrated middle, intuitive without becoming paranoid.`,
        shadow: `You might swing between believing every surface at face value and distrusting every surface equally, mistaking each extreme for wisdom.`,
        path: `Locate the discerning middle: intuition checked against evidence, neither naive nor paranoid.`,
      },
      19: {
        heading: 'Polarity & The Sun — Between Dimmed Withholding and Overexposed Performance',
        why: `You span a spectrum from deliberately dimming your light to performing an exaggerated brightness — your genuine radiance sits at the integrated middle, warmth offered honestly at its natural, undramatized level.`,
        shadow: `You might oscillate between shrinking to avoid being seen and overperforming brightness to be seen, mistaking each for the cure for the other.`,
        path: `Let the light rest at its true, unforced level. Genuine radiance needs neither dimming nor performance.`,
      },
      20: {
        heading: 'Polarity & Judgement — Between Ignoring the Call and Manufacturing Urgency',
        why: `You span a spectrum from ignoring a genuine summons to manufacturing artificial urgency where none actually exists — your real awakening sits at the integrated middle, responding to what's actually calling, at its actual pace.`,
        shadow: `You might swing between chronic postponement and forced, premature action driven by anxiety rather than a genuine summons.`,
        path: `Discern the real timing of the actual call. Neither ignoring it nor manufacturing false urgency serves the genuine awakening underway.`,
      },
      21: {
        heading: 'Polarity & The World — Between Perpetual Striving and Premature Closure',
        why: `You span a spectrum from never allowing anything to be finished to declaring false completion too early — your genuine mastery sits at the integrated middle, recognizing real completion when it's actually arrived.`,
        shadow: `You might oscillate between chronic unfinished striving and premature, hollow declarations of "done."`,
        path: `Discern true completion honestly, at the integrated middle between endless striving and false closure.`,
      },
      22: {
        heading: 'Polarity & The Fool — Between Paralysis and Recklessness',
        why: `You span a spectrum from total paralysis before beginning to reckless leaping without any awareness at all — your genuine new beginning sits at the integrated middle, courageous but not blind.`,
        shadow: `You might swing between never starting and starting carelessly, mistaking each extreme for the correction of the other.`,
        path: `Begin from the integrated middle: real courage paired with real awareness. Neither paralysis nor recklessness is genuine freedom.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF ATTRACTION — "Like attracts like." Reads each arcana as the
    // specific emotional/relational magnetism it generates — what kind
    // of people, circumstance, and outcome that pattern draws toward it.
    // ═══════════════════════════════════════════════════════════════════
    attraction: {
      1: {
        heading: 'Attraction & The Magician — Magnetizing Through Decisive Intention',
        why: `You draw opportunity toward decisiveness — a mind that's genuinely chosen its aim becomes magnetic to the exact resources that aim requires.`,
        shadow: `You might attract scattered, half-formed opportunities because the intention behind them was never actually decided.`,
        path: `Decide cleanly, then let the magnetism of a settled aim do the rest of the drawing-in.`,
      },
      2: {
        heading: 'Attraction & The High Priestess — Magnetizing Through Inner Stillness',
        why: `Your quiet, receptive inner states draw in subtler, more accurate information than a noisy, anxious one ever could.`,
        shadow: `A mind too restless attracts nothing but more restlessness — noise calling in noise.`,
        path: `Cultivate real stillness. What you're magnetized to receive matches the quality of quiet you actually occupy.`,
      },
      3: {
        heading: 'Attraction & The Empress — Magnetizing Through Felt Abundance',
        why: `A genuinely felt sense of abundance draws in more abundance for you — the emotional state, not the current bank balance, is what's doing the attracting.`,
        shadow: `You might chase abundance from a felt state of lack, which keeps attracting exactly more lack to confirm it.`,
        path: `Generate the feeling of sufficiency first, deliberately, before the circumstance arrives. Attraction follows the feeling, not the other way around.`,
      },
      4: {
        heading: 'Attraction & The Emperor — Magnetizing Through Embodied Authority',
        why: `Genuine, settled authority draws in cooperation and respect — command that's felt internally, not merely asserted, is what people and circumstance respond to.`,
        shadow: `You might assert authority to compensate for a private sense of instability, which attracts resistance rather than respect.`,
        path: `Settle your authority internally first. What's genuinely embodied is what circumstance actually responds to.`,
      },
      5: {
        heading: 'Attraction & The Hierophant — Magnetizing Through Genuine Devotion',
        why: `You draw students and teachers alike toward genuine devotion — a real reverence for the material is what actually attracts serious engagement with it.`,
        shadow: `You might perform devotion for status, which attracts only others performing the same thing back.`,
        path: `Let the devotion be real. Genuine reverence draws in genuine transmission, not the performance of either.`,
      },
      6: {
        heading: 'Attraction & The Lovers — Magnetizing Through Self-Alignment',
        why: `Like attracts like, and the emotional frequency you sustain — not your stated preferences, not your conscious wish list, but the actual, felt relationship you hold with yourself — is what determines who and what you draw toward you in matters of the heart. Your Lovers is usually pictured as a choice between two options, a fork in the road requiring alignment; but your deeper reading is that the choice was never really external at all. The partner who appears in your life, the dynamic that unfolds, the quality of connection that becomes available, is a precise magnetic match for the frequency of alignment — or misalignment — you're already holding with yourself, quietly, underneath whatever you're consciously seeking in another person. You've likely noticed, sometimes with some discomfort, that the partners who arrive carry an uncanny resemblance to whatever internal state you were actually in at the time, regardless of what you told yourself you were looking for. Your self-relationship is the magnet, and your partnerships are simply what that magnet reliably pulls in.`,
        shadow: `You might look to a partner to resolve an internal misalignment you haven't yet addressed in yourself — seeking in another person the wholeness, validation, or settledness you haven't yet supplied for yourself, and then being genuinely baffled when the partner who arrives seems to carry, magnified, the exact same unresolved pattern you were hoping they'd fix for you. This isn't romantic bad luck. Like calls to like: an internal state still organized around lack, self-doubt, or unexamined wounding will reliably draw you a partner whose own frequency resonates with that same lack, doubt, or wound — not that you attract your opposite to complete you, but that you attract a mirror of whatever frequency you're actually emitting, wound and all. The exhausting cycle this produces is one you may already know well: a string of relationships that look, from the outside, like entirely different people, but carry, underneath the surface, a strikingly similar unresolved dynamic — because the magnet doing your attracting never actually changed.`,
        path: `Do the harder, less immediately gratifying work first: establish genuine alignment with yourself before you expect a partnership to provide it externally. This is uncomfortable because it removes the fantasy that the right partner will arrive and simply solve what internal work you haven't yet done — the right partner, in the sense of one who reflects genuine wholeness back to you, can't actually arrive until the frequency you're emitting has itself become one of genuine wholeness rather than unresolved need. Examine what you've historically sought from partnership and ask yourself honestly whether it was connection or compensation — whether you were looking for someone to meet you, or someone to complete a deficit you hadn't yet addressed on your own. Once you genuinely establish your internal alignment — not performed, not merely decided upon, but actually felt as a settled relationship with yourself — the quality of what shows up in your partnerships changes to match it, often dramatically, because your magnet itself has finally changed what it's calling in.`,
      },
      7: {
        heading: 'Attraction & The Chariot — Magnetizing Through Sustained Direction',
        why: `Consistent, held direction draws support toward you — people and resources get magnetized by visible momentum, not by scattered effort.`,
        shadow: `You might change direction so often that nothing coherent is ever attracted toward any of the partial momentums.`,
        path: `Hold one direction long enough for its magnetism to actually take effect. Support gathers around sustained motion, not flicker.`,
      },
      8: {
        heading: 'Attraction & Justice — Magnetizing Through an Honest Internal Ledger',
        why: `An internal sense of fairness and worth attracts external circumstances that match it, calibrated precisely rather than by chance.`,
        shadow: `You might attract repeated unfairness while calling it bad luck, without examining the internal ledger that's actually doing the attracting.`,
        path: `Balance the internal ledger honestly. What's attracted back matches that internal account, not an external verdict.`,
      },
      9: {
        heading: 'Attraction & The Hermit — Magnetizing Through Earned Insight',
        why: `Your genuine, hard-won insight draws in the right seekers at the right time — wisdom doesn't need to advertise itself to be found.`,
        shadow: `You might withdraw so completely that nothing is left available to attract toward, wisdom included.`,
        path: `Let the insight, once earned, become genuinely available. What's real doesn't need to chase; it only needs to be findable.`,
      },
      10: {
        heading: 'Attraction & The Wheel of Fortune — Magnetizing Through Trust in Timing',
        why: `Trusting a cycle's own timing draws in opportunity at its actual right moment for you, rather than forcing an outcome prematurely.`,
        shadow: `You might grasp at the wheel's every turn, which attracts more chaos than the trust-based patience would have.`,
        path: `Trust the timing. What's magnetized by patience arrives more cleanly than what's forced by grasping.`,
      },
      11: {
        heading: 'Attraction & Strength — Magnetizing Through Settled Power',
        why: `Your quiet, integrated power draws in genuine respect — it doesn't need to perform dominance to be recognized.`,
        shadow: `You might perform strength to attract validation, which draws in people testing the performance rather than respecting the substance.`,
        path: `Let the power be genuinely settled. What's real attracts recognition without needing to perform for it.`,
      },
      12: {
        heading: 'Attraction & The Hanged Man — Magnetizing Through a Willingness to See Differently',
        why: `Genuine openness to a new perspective draws in exactly the insight or person who can offer you that different view.`,
        shadow: `You might stay rigidly fixed in one perspective, which attracts only more confirmation of what's already known rather than anything new.`,
        path: `Stay genuinely open to reversal. What's magnetized by real openness is precisely the new information a fixed view would repel.`,
      },
      13: {
        heading: 'Attraction & Transformation — Magnetizing Through a Completed Release',
        why: `A genuinely completed ending draws in real renewal for you — the space cleared by an actual release is what makes room for what comes next.`,
        shadow: `You might hold onto what's already ended, which attracts stagnation into the space renewal was meant to occupy.`,
        path: `Complete the release fully. The clear space that follows draws in the actual new beginning.`,
      },
      14: {
        heading: 'Attraction & Temperance — Magnetizing Through Genuine Balance',
        why: `A genuinely blended, steady state draws in equally steady circumstance for you — volatility attracts volatility, and calm attracts calm.`,
        shadow: `You might alternate between extremes and wonder why the results feel equally erratic.`,
        path: `Settle into the actual middle. Steady internal states are what attract steady external ones.`,
      },
      15: {
        heading: 'Attraction & The Devil — Magnetizing Through an Unexamined Craving',
        why: `An unexamined compulsive pattern keeps attracting the exact circumstances that feed it — the craving is itself the magnet, however unconscious.`,
        shadow: `You might fight the outer temptation while leaving the inner craving completely unexamined, so it just attracts the same pattern in a new disguise.`,
        path: `Examine the craving directly. Once it's conscious rather than compulsive, it stops doing the attracting on its own.`,
      },
      16: {
        heading: 'Attraction & The Tower — Magnetizing Through an Unstable Foundation',
        why: `A structure built on an unstable premise eventually attracts the exact collapse needed to correct it.`,
        shadow: `You might rebuild on the identical unstable premise, attracting an eventual repeat of the same collapse.`,
        path: `Rebuild from a genuinely stable premise. What's magnetized by real stability doesn't need to be shattered to be corrected.`,
      },
      17: {
        heading: 'Attraction & The Star — Magnetizing Through Grounded Hope',
        why: `Like attracts like, and what actually functions as your magnet is not the appearance of optimism but the real, felt frequency underneath it — which means hope you've genuinely grounded in evidence, in actual restoration already underway, is magnetic in a way forced or performed positivity simply never is, no matter how convincingly you present it. Your Star follows your Tower for a reason: this isn't naive hope arriving before anything has actually healed, it's hope that emerges once you've done real work, carrying a settled, quiet confidence rather than a manufactured brightness. Attraction responds to what's actually true beneath your surface, not to what you're performing on top of it — which means your renewal draws in matching opportunity precisely because your hope is real, specific, and evidenced, rather than a hopeful mask stretched over a despair you haven't actually addressed. Your capacity for genuine, grounded hope is likely one of your most literally magnetic qualities, drawing in circumstances that resonate with a frequency that's actually, demonstrably true for you.`,
        shadow: `You might perform hope as a kind of overlay on top of an unaddressed, ungrounded despair — cultivating the language and posture of optimism while your actual underlying frequency remains organized around fear, loss, or unresolved grief you haven't genuinely metabolized. This is a very seductive shadow because it often comes from a good-faith desire to "manifest better circumstances," layering affirmations and positive language over a state that hasn't actually shifted underneath. But like calls to like, and a hope you perform sitting on top of a real, unaddressed despair doesn't attract the outcome you're hoping for — it attracts circumstances that quietly and persistently confirm your despair instead, because that's the frequency you're actually emitting beneath your surface language. This produces a particularly demoralizing pattern — genuine effort at "staying positive" that nonetheless keeps drawing in disappointing, confirming evidence, leaving you confused or self-blaming about why your manifestation "isn't working," when the real issue was never the words you were using but the unaddressed frequency underneath them.`,
        path: `Do the restorative work first, honestly, before you expect the hope built on top of it to function as a genuine magnet. Resist the urge to skip directly to positive language and instead actually address whatever grief, fear, or despair is present — grounding your eventual hope in real, felt evidence that something has genuinely shifted, rather than in a hopeful performance layered over unprocessed pain. This might mean naming your despair honestly rather than immediately reaching for its positive opposite, doing the actual restorative work — however slow it is — and allowing your hope to emerge organically once real healing has occurred, rather than manufacturing it in advance of the work. What's actually true attracts, not what's merely stated; once your hope is genuinely grounded rather than performed, it becomes exactly the magnetic signal your Star represents — drawing in opportunity and circumstance that resonate with a restoration that's actually, demonstrably happened.`,
      },
      18: {
        heading: 'Attraction & The Moon — Magnetizing Through Unexamined Fear',
        why: `An unexamined fear, held long enough, attracts circumstances that seem to confirm it — the fog itself becomes magnetic.`,
        shadow: `You might treat the attracted confirmation as proof the fear was accurate all along, deepening the loop.`,
        path: `Examine the fear directly rather than letting it run unconscious. What's brought into daylight stops attracting its own confirmation.`,
      },
      19: {
        heading: 'Attraction & The Sun — Magnetizing Through Authentic Vitality',
        why: `Your genuine, unforced vitality draws people and opportunity toward it effortlessly — real warmth doesn't need to try to attract anything.`,
        shadow: `You might perform brightness to attract attention, which draws people toward the performance rather than toward you.`,
        path: `Let the vitality be authentic. What's genuinely radiant attracts without needing to perform for it.`,
      },
      20: {
        heading: 'Attraction & Judgement — Magnetizing Through Answering the Summons',
        why: `Actually answering an inner call draws in the exact opportunities that call was pointing you toward.`,
        shadow: `You might hear the summons and stay put, which attracts only more of the same call repeating, unanswered.`,
        path: `Answer the summons. Movement toward it is what attracts the matching opportunity, not further waiting.`,
      },
      21: {
        heading: 'Attraction & The World — Magnetizing Through Genuine Completion',
        why: `Recognizing real completion draws in the next cycle cleanly for you — a finished chapter attracts a genuinely new one rather than a repeat.`,
        shadow: `You might refuse to call anything finished, which attracts more unfinished business into an already-crowded field.`,
        path: `Let completion be real and acknowledged. What's magnetized by genuine closure is a genuinely new beginning.`,
      },
      22: {
        heading: 'Attraction & The Fool — Magnetizing Through Genuine Openness',
        why: `You carry pure, unclaimed magnetism — an openness to any direction that draws in whatever your will eventually chooses to commit toward.`,
        shadow: `You might stay so open nothing is ever actually chosen, attracting endless options and no traction.`,
        path: `Let the openness commit to a direction. What's attracted by genuine commitment is traction; endless openness alone attracts only more openness.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF DIVINE ONENESS — "Everything is connected; no boundary
    // between self and the rest of existence is ultimately real." Reads
    // each arcana as revealing where separateness is being falsely
    // maintained, or genuine interconnection embraced.
    // ═══════════════════════════════════════════════════════════════════
    divineOneness: {
      1: {
        heading: 'Divine Oneness & The Magician — Your Will Serves the Whole',
        why: `Your intention ripples outward through a connected field — what you will into being never stays contained to you alone, it moves through everything it touches.`,
        shadow: `You might will outcomes as though you were operating in isolation, ignoring the ripple your action sends through everyone connected to it.`,
        path: `Will with the whole in view. Intention aligned with the connected field moves further than intention aimed only at private gain.`,
      },
      2: {
        heading: 'Divine Oneness & The High Priestess — Your Knowing Isn\'t Only Yours',
        why: `Your intuition isn't a private talent generated within your isolated individual mind — it's your reception from a field of connection far larger than you alone. The knowing that arrives through you was never manufactured privately; it was received, the way a radio receives a signal it didn't itself create. No boundary between you and the rest of existence is ultimately real, your separateness is a useful appearance rather than a final truth, and you sitting behind your veil are the clearest image of what happens when you become genuinely permeable to that larger, connected field rather than treating your own skull as the outer limit of what you can know. You've likely experienced insight that felt like it arrived from somewhere beyond your own deliberate thinking — a knowing that showed up whole, unearned by any conscious reasoning process, as though it had been received rather than generated. This isn't a flaw in your intuition. It's your individual mind quieted enough to stop insisting on its own separateness, and permeable enough to actually receive what the larger, connected field already holds for you.`,
        shadow: `You might claim private, individual ownership over insight that actually arrived through your connection — forgetting, once the knowing has landed, that it was ever received rather than personally generated, and beginning to treat your intuitive gift as evidence of isolated genius rather than of your genuine permeability to something larger than yourself. This shift is subtle but consequential: the moment you claim insight as purely private property, the very connection that made it available in the first place begins to close, because this Law isn't a resource that responds well to hoarding. If you begin to believe your knowing originates entirely from within you, rather than through you, you start to lose access to the field you were actually drawing from — your intuition becomes narrower, more effortful, more prone to error, precisely because the humility that kept your channel open has been replaced by a quiet, unexamined pride in your own supposed singular brilliance. This often shows up as a growing reluctance to share what you've received, a hoarding instinct that treats insight as scarce personal capital rather than as something that flows more freely the more openly you pass it along.`,
        path: `Receive the knowing with genuine gratitude rather than claiming it as private ownership — hold your intuitive gift the way you might hold water passing through your hands rather than water you've captured and sealed in a container. Actively acknowledge, at least to yourself, that the insight arriving through you is a reception rather than your private manufacture, and stay curious about its source rather than taking credit that quietly forecloses your further access to it. Share what you've received relatively freely rather than hoarding it as scarce personal capital, because circulation is rewarded, not accumulation — what moves through the connected field and back out into it stays available to you, often expanding in the process, while what you hoard in the name of private ownership tends to dry up precisely because the channel that made it available has been quietly, unconsciously closed. Your mastery here is a kind of humble permeability: staying open enough, consistently enough, that the knowing keeps arriving, and remembering, every time it does, that it was never only yours to begin with.`,
      },
      3: {
        heading: 'Divine Oneness & The Empress — Your Abundance Circulates',
        why: `Your abundance is a shared circulatory system — what nourishes you is meant to keep moving through the connected whole, not pool in one place.`,
        shadow: `You might hoard abundance as though it were separate from the system that produced it, interrupting the circulation that sustains everyone, including you.`,
        path: `Let abundance keep circulating. What flows through you and onward stays alive; what's dammed up stagnates.`,
      },
      4: {
        heading: 'Divine Oneness & The Emperor — Your Structure Serves the Collective',
        why: `You build structure in service of a connected whole, not a private fortress — your real authority understands its foundation belongs to everyone it supports.`,
        shadow: `You might build structure to separate yourself from the collective it should be serving, mistaking isolation for security.`,
        path: `Build in service of connection. Structure that supports the whole is more durable than structure that isolates from it.`,
      },
      5: {
        heading: 'Divine Oneness & The Hierophant — A Lineage Larger Than You',
        why: `You carry wisdom that belongs to an unbroken, connected lineage — you're a link, not the origin or the destination.`,
        shadow: `You might treat the transmission as personal property, severing it from the larger connected chain it's actually part of.`,
        path: `Hold the lineage as shared. Wisdom passed on stays connected to something larger than any one teacher.`,
      },
      6: {
        heading: 'Divine Oneness & The Lovers — Union Reveals There Was Never Real Separation',
        why: `Your genuine union is a direct experience that self and other were never as separate as they appeared — a glimpse of the underlying connection.`,
        shadow: `You might treat a partner as fundamentally separate, projecting distance onto a connection that was never actually as divided as it feels.`,
        path: `Meet a partner from the connection rather than the separation. What's approached as already-connected deepens; what's approached as foreign stays foreign.`,
      },
      7: {
        heading: 'Divine Oneness & The Chariot — Direction That Serves More Than the Self',
        why: `Your momentum gains real power when its direction serves something connected beyond you as the individual driver.`,
        shadow: `You might drive purely for private gain, disconnected from any larger purpose, and find the momentum harder to sustain.`,
        path: `Connect your direction to something larger than yourself. Momentum in service of the whole sustains longer than momentum in service of ego alone.`,
      },
      8: {
        heading: 'Divine Oneness & Justice — A Ledger Shared by Everyone',
        why: `Your fairness is a shared account, not a private one — imbalance anywhere in the connected field eventually touches every part of it, including you.`,
        shadow: `You might treat fairness as a personal transaction, ignoring the larger connected ledger your actions are actually contributing to.`,
        path: `Balance the ledger with the whole in mind. What restores fairness in the connected field restores it in you too.`,
      },
      9: {
        heading: 'Divine Oneness & The Hermit — Solitude That Serves Reconnection',
        why: `You withdraw not to escape the connected whole but to return to it with something worth offering.`,
        shadow: `You might mistake withdrawal for genuine separateness, forgetting that even solitude occurs within the same connected field.`,
        path: `Let the solitude serve eventual reconnection. Withdrawal that forgets the whole becomes isolation rather than insight.`,
      },
      10: {
        heading: 'Divine Oneness & The Wheel of Fortune — A Cycle Everyone Shares',
        why: `No cycle is purely private for you — your turn of fortune is entangled with a much larger, connected rhythm.`,
        shadow: `You might interpret your cycle as isolated fate, missing how deeply it's entangled with everything and everyone connected to it.`,
        path: `See the cycle as shared. Understanding your turn as part of a larger rhythm changes how you meet it.`,
      },
      11: {
        heading: 'Divine Oneness & Strength — Power That Doesn\'t Need to Separate to Feel Safe',
        why: `Your Strength is power settled enough to remain genuinely connected rather than needing distance or dominance to feel secure.`,
        shadow: `You might use strength to wall yourself off from the connected whole, mistaking separation for safety.`,
        path: `Let real strength stay connected rather than defended. Security doesn't require distance from the whole.`,
      },
      12: {
        heading: 'Divine Oneness & The Hanged Man — The View From the Whole, Not Just the Self',
        why: `Your inversion is a glimpse of the connected field from outside your isolated self's usual vantage point.`,
        shadow: `You might stay suspended without ever actually reaching the wider, connected view the position was meant to reveal.`,
        path: `Let the suspension actually reveal the connected whole. That wider view is the entire purpose of the inversion.`,
      },
      13: {
        heading: 'Divine Oneness & Transformation — The Ending That Returns You to the Whole',
        why: `What ends in your life dissolves back into the connected field it came from — nothing is truly lost, only returned.`,
        shadow: `You might grieve an ending as pure loss, forgetting it's a return to connection rather than an erasure.`,
        path: `Let the ending be a return, not just a loss. What dissolves rejoins the connected whole it never fully left.`,
      },
      14: {
        heading: 'Divine Oneness & Temperance — Your Blend Mirrors the Whole System',
        why: `Your internal integration reflects a larger truth — the connected field itself is a blend of countless opposites held together.`,
        shadow: `You might seek internal balance while staying disconnected from the larger system that balance is meant to mirror.`,
        path: `Let inner integration connect outward. A balanced self reflects and serves a balanced whole.`,
      },
      15: {
        heading: 'Divine Oneness & The Devil — The Isolation the Craving Depends On',
        why: `Your compulsion's grip depends on convincing you the craving is a private, isolated experience no one else could understand.`,
        shadow: `You might stay isolated with the compulsion, which is exactly the separation that lets it persist unchallenged.`,
        path: `Break the isolation around the craving. Reconnecting with others facing the same pattern is what actually loosens its grip.`,
      },
      16: {
        heading: 'Divine Oneness & The Tower — A Collapse That Reveals Hidden Connection',
        why: `Your structure of false separateness collapses, revealing how connected everything actually was underneath it all along.`,
        shadow: `You might rebuild the same separating walls immediately, missing what the collapse revealed about genuine connection.`,
        path: `Rebuild with the revealed connection in mind. Structures aligned with real interdependence hold better than walls built to separate.`,
      },
      17: {
        heading: 'Divine Oneness & The Star — Hope That Belongs to the Whole',
        why: `Your renewal isn't a private event — healing in one part of the connected field genuinely uplifts the rest of it.`,
        shadow: `You might treat your own restoration as separate from everyone else's, missing how connected the healing actually is.`,
        path: `Let your restoration ripple outward on purpose. Healing shared through connection multiplies rather than staying contained.`,
      },
      18: {
        heading: 'Divine Oneness & The Moon — Fear That Forgets the Connected Field',
        why: `Your confusion is the experience of feeling cut off from the connected whole — fear intensifies in perceived isolation.`,
        shadow: `You might believe the isolation is real, deepening the fog rather than reconnecting through it.`,
        path: `Reconnect deliberately when the fog thickens. Remembering the connected field is what actually clears the confusion.`,
      },
      19: {
        heading: 'Divine Oneness & The Sun — Radiance That Warms the Whole Field',
        why: `Your warmth is never contained to you as the individual — genuine vitality radiates through the entire connected field it touches.`,
        shadow: `You might hoard your own brightness as though it were separate from everyone it could actually warm.`,
        path: `Let the radiance spread on purpose. Warmth shared through connection multiplies; warmth hoarded just sits there.`,
      },
      20: {
        heading: 'Divine Oneness & Judgement — A Call That Comes From the Whole',
        why: `Your summons arises from something larger than the individual — the call is connected to a purpose beyond private ambition.`,
        shadow: `You might answer the call for purely personal gain, missing the connected purpose it was actually summoning you toward.`,
        path: `Answer the call in service of the connected whole. What serves more than yourself carries more weight than what serves only you.`,
      },
      21: {
        heading: 'Divine Oneness & The World — Completion That Includes Everyone',
        why: `Your genuine completion redefines what it actually means: not a private achievement you reach and hold in isolation, but mastery that remains connected to, and in service of, the larger whole it emerged from in the first place. No boundary between you and the rest of existence is ultimately real — your separateness is appearance, not final truth — and your World, the last card of your cycle, the figure dancing within the wreath held by the four elemental beings, is the clearest possible image of what your mastery looks like once you fully, consciously honor that connection rather than forget it. You're contained and free simultaneously, held by forces larger than yourself, dancing rather than standing alone in triumphant isolation. Your deepest sense of arrival is likely one that includes, rather than separates you from, everyone and everything that contributed to it — a felt understanding that whatever you've built or become was never achieved in a vacuum.`,
        shadow: `You might claim mastery as though you achieved it in total isolation — standing at the center of your own accomplishment and forgetting, deliberately or otherwise, the vast connected field of teachers, circumstances, ancestors, and unseen support that actually made your achievement possible. This is a very human and very tempting shadow, because claiming sole credit feels, in the moment, like a kind of validation — proof the mastery was truly, uniquely yours. But no accomplishment is ever actually separate from the whole system that produced it, and mastery claimed in isolation begins to feel, over time, strangely hollow — a completion that technically occurred but that somehow doesn't land the way genuine wholeness should, because you've severed it from the very connection that would have made it feel truly complete. Your isolation can also become a defensive posture: guarding the achievement, treating collaboration or acknowledgment of outside help as a threat to its legitimacy rather than as the actual source of its meaning.`,
        path: `Let your genuine completion connect back outward rather than sealing it off in private triumph — actively acknowledge the whole connected system, seen and unseen, that made your mastery possible, and let your completion serve that larger whole rather than existing purely for your own private satisfaction. Name, with real specificity, who and what contributed to whatever you've achieved, rather than letting the achievement be narrated as your solitary triumph. Use your completed mastery in service of something beyond yourself — teaching what you've learned, contributing what you've built, letting your finished cycle become a resource for the connected whole it emerged from rather than your private trophy. Your mastery is understanding that the deepest, most genuine sense of completion available to you is not the isolated kind, however impressive it might look from outside, but the connected kind — a wholeness that includes, rather than separates you from, everyone and everything that made it possible.`,
      },
      22: {
        heading: 'Divine Oneness & The Fool — A Beginning Already Connected to Everything',
        why: `Your beginning is never actually separate — even the freshest start is already woven into the connected field it steps into.`,
        shadow: `You might begin as though starting from total isolation, missing the support already available through connection.`,
        path: `Begin already connected. The freshest start still has access to the whole field's support, if it's actually received.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF ACTION — "Thought and desire require aligned physical
    // action to manifest; ideas alone move nothing." Reads each arcana
    // as the specific action-threshold it's asking to be crossed.
    // ═══════════════════════════════════════════════════════════════════
    action: {
      1: {
        heading: 'Action & The Magician — The Gesture That Completes the Intention',
        why: `This Law cuts directly against a very common and very comfortable illusion you might be carrying: that your clarity of intention is, by itself, a form of progress. Your thought and desire, however genuinely felt, require your aligned physical movement to manifest anything at all — an idea alone, no matter how well formed, moves nothing in your material world. Your table is famously set with every tool of manifestation: wand, cup, sword, pentacle, the full elemental range of what you could bring into being. But it only means anything once your hand actually reaches for one of them. Your entire archetype hinges on that single, decisive gesture — the moment your intention, however clear, converts into motion, because it's the motion, not the clarity, that you metaphysically require. You likely already sense the gap between your own considerable capacity for clear intention and how inconsistently that intention has historically converted into finished, tangible results. Your tools were never the problem. Your problem, when you had one, was always the moment before your hand moved.`,
        shadow: `You might fall into one of the most disguised forms of avoidance available, because it looks, and often feels, like diligence: refining your intention endlessly, gathering more information, perfecting your plan, clarifying your vision further and further — all while the actual physical gesture that would complete your manifestation keeps getting deferred, one more round of preparation at a time. This is seductive precisely because each individual round of refinement feels legitimate; there's always something you could, in principle, clarify further before acting. But this refinement, however sophisticated it becomes, doesn't substitute for the one thing you actually require — movement. A brilliantly clear intention that never converts into your physical gesture produces exactly the same result in your material world as no intention at all: nothing. You'll recognize this shadow by a specific, quiet frustration — a felt sense of having "worked" extensively on something that nonetheless has no tangible result to show for it, because the work was entirely upstream of the one action that actually completes the process.`,
        path: `Accept that the intention you're currently holding is very likely already clear enough — that further refinement is, at this point, simply your postponement wearing the costume of diligence — and take the physical, concrete action your intention has already justified. This doesn't require your plan to be perfect; the claim isn't that flawless planning produces your manifestation, it's that motion does, even imperfect motion, even a first attempt you'll clearly need to revise. Identify the single smallest physical gesture available to you right now that would move your intention from concept into the material world — sending the message, making the call, writing the first page, opening the account — and take it today rather than after one more round of preparation. Your mastery here is recognizing, finally and completely, that the tools on your table were never the missing ingredient. Your hand reaching for them always was.`,
      },
      2: {
        heading: 'Action & The High Priestess — The Action of Actually Listening',
        why: `Receptivity is itself an action for you — deliberately creating the stillness to actually hear the intuition is a physical, effortful choice.`,
        shadow: `You might wait passively for insight to arrive without ever taking the active step of creating space to receive it.`,
        path: `Actively build the stillness. Receptivity that's deliberately created is action, not passivity.`,
      },
      3: {
        heading: 'Action & The Empress — The Action of Actually Tending',
        why: `Your abundance requires the physical labor of tending — the garden grows because of consistent action, not because abundance was merely desired.`,
        shadow: `You might want the harvest without ever supplying the ongoing physical tending it actually requires.`,
        path: `Tend consistently and physically. Abundance is the effect of sustained action, not of wishing alone.`,
      },
      4: {
        heading: 'Action & The Emperor — The Action of Actually Building',
        why: `Your structure requires literal construction — the plan alone builds nothing until physical effort lays the actual foundation.`,
        shadow: `You might hold an elaborate structural vision while never actually laying the first physical brick.`,
        path: `Lay the first brick today. Structure exists only after the plan becomes physical action.`,
      },
      5: {
        heading: 'Action & The Hierophant — The Action of Actually Teaching',
        why: `Your wisdom only transmits through the physical act of teaching — knowledge held privately never reaches anyone.`,
        shadow: `You might accumulate wisdom endlessly without ever taking the action of actually offering it to someone else.`,
        path: `Take the action of transmission. Wisdom becomes useful only once it's actively taught, not merely held.`,
      },
      6: {
        heading: 'Action & The Lovers — The Action of Actually Choosing',
        why: `Your alignment stays theoretical until the choice is actually declared and acted on — a physical, spoken act.`,
        shadow: `You might feel aligned internally while never actually taking the outward action the alignment calls for.`,
        path: `Declare and act on the choice. Alignment becomes real through action, not through private feeling alone.`,
      },
      7: {
        heading: 'Action & The Chariot — The Action That Actually Moves the Vehicle',
        why: `You only travel because of continuous physical effort — direction alone, without sustained motion, goes nowhere.`,
        shadow: `You might know the destination clearly while never actually supplying the ongoing physical effort to reach it.`,
        path: `Supply the continuous action the direction requires. Arrival is the accumulated effect of motion, not of knowing where to go.`,
      },
      8: {
        heading: 'Action & Justice — The Action That Actually Restores Balance',
        why: `Your balance requires active correction — fairness doesn't restore itself passively, it requires the deliberate action of making amends or changing course.`,
        shadow: `You might recognize an imbalance clearly while never taking the actual corrective action it calls for.`,
        path: `Take the corrective action directly. Balance is restored through what's actually done, not through recognizing the imbalance alone.`,
      },
      9: {
        heading: 'Action & The Hermit — The Action of Actually Withdrawing',
        why: `Your insight requires the deliberate action of stepping away — clarity doesn't arrive passively in the middle of the noise.`,
        shadow: `You might wish for clarity while never actually taking the physical step of creating the necessary distance.`,
        path: `Take the actual step of withdrawing. Clarity requires the physical action of removing yourself from the noise, not just wanting quiet.`,
      },
      10: {
        heading: 'Action & The Wheel of Fortune — The Action Taken Within the Cycle',
        why: `Even within cycles beyond your control, the action you take at each turn still matters and shapes the outcome.`,
        shadow: `You might treat the cycle as an excuse for total passivity, forgetting that action within the cycle still changes its shape.`,
        path: `Act within the cycle rather than waiting it out. What you do at each turn still genuinely matters.`,
      },
      11: {
        heading: 'Action & Strength — The Action of Actually Practicing Patience',
        why: `Your Strength requires the ongoing, active practice of gentleness with your own instinct — patience is a repeated action, not a passive trait.`,
        shadow: `You might expect settled strength to simply appear without the ongoing action of actually practicing it.`,
        path: `Practice the gentleness actively and repeatedly. Strength is built through consistent action, not granted by default.`,
      },
      12: {
        heading: 'Action & The Hanged Man — The Action of Actually Choosing to Pause',
        why: `Your suspension is itself a deliberate action — choosing to stop is an active decision, not a passive default.`,
        shadow: `You might drift into stillness by accident rather than actively choosing it, and get none of the intended insight.`,
        path: `Choose the pause deliberately. An active decision to stop yields insight; an accidental stall usually doesn't.`,
      },
      13: {
        heading: 'Action & Transformation — The Action of Actually Letting Go',
        why: `Your ending requires the physical, active choice of release — it doesn't complete itself passively while you simply wait it out.`,
        shadow: `You might wait for the ending to resolve on its own rather than actively taking the steps that complete it.`,
        path: `Take the active steps that complete the release. Endings finish through action, not through passive waiting.`,
      },
      14: {
        heading: 'Action & Temperance — The Action of Actually Blending',
        why: `Your balance is an ongoing, active practice of moderation — it requires continuous small corrective actions, not a one-time decision.`,
        shadow: `You might decide to be balanced once and expect it to hold without any further active maintenance.`,
        path: `Maintain the blend through ongoing small actions. Balance requires continuous tending, not a single decision.`,
      },
      15: {
        heading: 'Action & The Devil — The Action That Actually Interrupts the Loop',
        why: `Your compulsion loosens its grip only through the deliberate action of interrupting the pattern — insight alone doesn't break the loop.`,
        shadow: `You might understand the pattern intellectually while never taking the actual action that interrupts it.`,
        path: `Take the concrete interrupting action. Understanding the craving isn't enough; the loop breaks through what's actually done differently.`,
      },
      16: {
        heading: 'Action & The Tower — The Action of Actually Rebuilding Differently',
        why: `Your rebuild calls for deliberately different action — repeating the old actions guarantees the old structure returns.`,
        shadow: `You might rebuild using the identical actions that produced the unstable structure in the first place.`,
        path: `Take genuinely different action this time. A new structure requires new action, not a repeat of the old process.`,
      },
      17: {
        heading: 'Action & The Star — The Action That Turns Hope Into Restoration',
        why: `Your hope becomes real restoration only once it's paired with the physical action of actually rebuilding.`,
        shadow: `You might hold onto hope passively without ever taking the concrete action that would make the hope real.`,
        path: `Pair the hope with concrete action. Restoration is hope combined with movement, not hope alone.`,
      },
      18: {
        heading: 'Action & The Moon — The Action of Actually Checking the Facts',
        why: `You need to take the active step of verifying the anxious projection against real evidence, rather than simply feeling through the fog.`,
        shadow: `You might stay passively lost in the confusion rather than taking the active step of gathering real information.`,
        path: `Take the active step of checking the facts. Clarity requires the action of verification, not just waiting for the fog to lift on its own.`,
      },
      19: {
        heading: 'Action & The Sun — The Action That Expresses the Vitality',
        why: `Your vitality needs an outlet — genuine joy wants the physical action of expression, not containment.`,
        shadow: `You might feel the vitality internally while never taking the action of actually expressing or sharing it.`,
        path: `Take the action of expressing the vitality outward. Joy contained indefinitely starts to feel like something else entirely.`,
      },
      20: {
        heading: 'Action & Judgement — The Action That Answers the Call',
        why: `Your summons requires physical response — hearing the call and taking no action leaves the awakening incomplete.`,
        shadow: `You might acknowledge the call intellectually while never taking the concrete action of actually rising and moving.`,
        path: `Take the physical action the call requires. Awakening completes through movement, not recognition alone.`,
      },
      21: {
        heading: 'Action & The World — The Action That Actually Completes the Cycle',
        why: `Your mastery requires the final, deliberate action of actually finishing — completion is an action, not just a feeling of readiness.`,
        shadow: `You might feel ready to complete something while never taking the final action that actually closes it.`,
        path: `Take the concrete closing action. Completion requires a final deliberate step, not just a sense of near-readiness.`,
      },
      22: {
        heading: 'Action & The Fool — The Action of Actually Taking the First Step',
        why: `Your potential, however abundant, remains entirely theoretical until you convert it into physical movement. The classical image — you at a cliff's edge, gazing upward, a small bundle of belongings slung over one shoulder, a single step away from either a leap or a lifetime spent admiring the view — is this Law's whole argument aimed at you in a single frame. All your potential, all your openness, all your readiness for a new beginning, changes nothing about your material world until your foot actually moves off the ledge. You carry no history yet here, no accumulated momentum, nothing but pure possibility, and possibility, no matter how vast, is not itself a form of progress. It's raw material waiting on your single, decisive gesture to become anything at all. You likely carry an unusually large reserve of potential — ideas, openings, capacities for beginning again — and your central life lesson, again and again, is discovering that none of it actually counts as a beginning until you take the physical step that converts it from theoretical to real.`,
        shadow: `You might remain at the edge indefinitely, mistaking the felt intensity of standing at the brink of something new for the thing itself — treating your potential energy, however electric it feels in the moment, as though it were equivalent to actual movement. This is an easy mistake to make because the edge itself can feel meaningful — there's real anticipation there, real possibility, real emotional charge. But your potential isn't credited any of the weight your motion is. If you've stood at the edge of the same leap for years, gathering more courage, waiting for more certainty, admiring the view further, you haven't been making incremental progress toward your jump — you've been accumulating time spent not jumping, which is a categorically different thing. You'll recognize this shadow by its specific emotional texture: a persistent, low-grade restlessness, the sense of being perpetually on the verge of something that never actually arrives, because your verge itself has quietly become your destination.`,
        path: `Take the actual physical step, today, in whatever small form is available to you, rather than continuing to gather potential at your edge. This doesn't require your leap to be large or your landing to be certain — motion itself, however modest, is what converts your potential into a genuine beginning, not the size or confidence of the motion. Identify the smallest concrete, physical action that would count as your actual first step rather than further preparation, and take it now rather than after gathering more courage, more certainty, or more perfect conditions, none of which are substitutes for the step itself. Your mastery here is understanding, finally, that your cliff's edge was never the place for you to stay. It was only ever the place for you to jump from.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF COMPENSATION — "Rewards, visible and invisible, are always
    // proportional to the energy, effort, and quality of what is given."
    // Reads each arcana as an accounting of investment versus return.
    // ═══════════════════════════════════════════════════════════════════
    compensation: {
      1: {
        heading: 'Compensation & The Magician — Your Return Matches the Focus Invested',
        why: `Your results are proportional to the focus you actually invest — a scattered effort returns scattered results, a focused one returns focused ones.`,
        shadow: `You might invest minimal, divided focus and expect a return proportional to what a fully focused effort would have earned.`,
        path: `Invest focus proportional to the return you want. Compensation is exact for you; it doesn't round up for good intentions.`,
      },
      2: {
        heading: 'Compensation & The High Priestess — Your Return Matches the Depth of Listening',
        why: `Your insight is proportional to how deeply you actually listened — shallow attention returns shallow understanding.`,
        shadow: `You might expect profound insight from only surface-level attention to your inner world.`,
        path: `Invest real depth of listening. The insight returned matches the quality of attention actually given.`,
      },
      3: {
        heading: 'Compensation & The Empress — Your Return Matches the Nurture Given',
        why: `Your abundance is an exact, proportional accounting rather than a matter of luck or fortune arriving disconnected from any cause — the rewards you receive, visible and invisible, are always calibrated precisely to the energy, effort, and quality of tending you actually invest, and nothing about your harvest exists independently of the care that preceded it. Your generative overflow isn't free-floating magic; it's the compounded return on real, sustained nurture you give, the way a garden's yield reflects, with almost mathematical precision, the quality and consistency of the tending it received across an entire season, not just your enthusiasm on a single planting day. Your natural gift is likely a genuine talent for tending — for nurturing people, projects, or resources with real, sustained attention — and the abundance you experience as a result was never an accident. It's the precise, earned return on the care you've actually, consistently supplied.`,
        shadow: `You might resent a thin, disappointing harvest while quietly having invested only thin, inconsistent tending to produce it — feeling genuinely aggrieved by your scarcity without examining honestly whether the nurture that would compensate into abundance was actually, consistently supplied. This is an easy shadow to fall into because your intention and your investment can feel, from the inside, remarkably similar; you can feel like a generous, attentive person while your actual pattern of tending has been sporadic, distracted, or withdrawn the moment it stopped feeling immediately rewarding. Your intention isn't what gets credited. What's credited is what you genuinely gave, consistently, over the time your harvest required — and if you tend inconsistently, however good your intentions, you'll receive a harvest that precisely mirrors that inconsistency, not the more generous harvest your intentions alone might seem to deserve. The particular pain of this shadow is the sense of unfairness it produces — "I care so much, why is there so little to show for it" — without ever tracing that feeling back to an honest accounting of what you actually, reliably invested versus merely felt.`,
        path: `Match your actual tending to the harvest you want, rather than expecting abundance to compensate for intention you never consistently converted into sustained care. This requires an honest audit: look clearly at whatever area of your life feels underwhelming or scarce, and ask yourself not whether you meant well, but whether your actual, ongoing nurture — attention, consistency, real presence — was genuinely supplied at the level your desired harvest requires. Where your tending has been thin, your only real path forward is investing more consistently, understanding that what you actually gave over time gets rewarded, not what you merely intended in a single burst of good feeling. Your mastery here is recognizing, with real clarity, that your abundance was never a matter of deserving. It's a matter of your tending — sustained, genuine, and matched to the harvest you actually desire.`,
      },
      4: {
        heading: 'Compensation & The Emperor — Your Return Matches the Discipline Invested',
        why: `Your structure is proportional to the discipline you actually sustain — durability is earned in direct proportion to the consistency invested.`,
        shadow: `You might want lasting structure while only sporadically supplying the discipline it requires.`,
        path: `Sustain the discipline consistently. Durable structure is compensation for consistent investment, not occasional effort.`,
      },
      5: {
        heading: 'Compensation & The Hierophant — Your Return Matches the Study Invested',
        why: `Your wisdom is proportional to the actual study you invest — depth of understanding is earned, not granted.`,
        shadow: `You might expect the authority of deep wisdom while having invested only shallow, occasional study.`,
        path: `Invest the actual study depth requires. What's rewarded is earned understanding, not claimed authority.`,
      },
      6: {
        heading: 'Compensation & The Lovers — Your Return Matches What You Actually Give',
        why: `Your relationship returns in proportion to what you genuinely give into it — connection compensates real investment, not performed effort.`,
        shadow: `You might invest performed care while expecting the return that only genuine investment earns.`,
        path: `Give genuinely rather than performatively. What the relationship returns matches what's actually, honestly invested.`,
      },
      7: {
        heading: 'Compensation & The Chariot — Your Return Matches the Sustained Effort',
        why: `Your arrival is proportional to the sustained effort you actually invest across the whole journey, not just the final stretch.`,
        shadow: `You might expect a full arrival while only having invested effort in short, inconsistent bursts.`,
        path: `Sustain effort across the whole distance. Arrival compensates the entire journey's investment, not just its ending.`,
      },
      8: {
        heading: 'Compensation & Justice — Your Return Matches the Ledger You Actually Keep',
        why: `What you receive is exactly proportional to what you've genuinely given, tracked with total precision — this is the clearest expression of this Law available to you.`,
        shadow: `You might feel under-compensated while ignoring how little was genuinely invested to earn a larger return.`,
        path: `Audit the actual ledger honestly. A fair return requires a genuinely fair investment first.`,
      },
      9: {
        heading: 'Compensation & The Hermit — Your Return Matches the Depth of the Retreat',
        why: `Your insight is proportional to how fully your withdrawal was actually used for reflection, not just for absence.`,
        shadow: `You might expect deep insight from a withdrawal that was mostly just distraction in a quieter setting.`,
        path: `Use the retreat for genuine reflection. Insight compensates real inner work, not simply time spent alone.`,
      },
      10: {
        heading: 'Compensation & The Wheel of Fortune — Your Return Matches What You Bring to Each Turn',
        why: `Each cycle compensates what you actually bring to it — preparation and presence during the turn shape what the cycle returns.`,
        shadow: `You might expect a favorable turn while bringing no genuine preparation or presence to it.`,
        path: `Bring real preparation to each turn. The cycle compensates what's actually invested in meeting it.`,
      },
      11: {
        heading: 'Compensation & Strength — Your Return Matches the Integration Invested',
        why: `Your settled power is proportional to the actual integration work you invest, not merely time passed.`,
        shadow: `You might expect genuine command over instinct without having invested the real work of integrating it.`,
        path: `Invest the actual integration work. Settled strength compensates real reconciliation, not just elapsed time.`,
      },
      12: {
        heading: 'Compensation & The Hanged Man — Your Return Matches the Willingness to Actually Surrender',
        why: `Your insight is proportional to how genuinely you released control, not merely how long you held the position.`,
        shadow: `You might expect the reward of new perspective from a surrender that was only partial or performed.`,
        path: `Surrender control genuinely. The new vantage point compensates real release, not merely time spent suspended.`,
      },
      13: {
        heading: 'Compensation & Transformation — Your Return Matches How Fully the Ending Was Allowed',
        why: `Your renewal is proportional to how completely the prior ending was actually allowed to finish.`,
        shadow: `You might expect full renewal from an ending that was only partially, reluctantly permitted.`,
        path: `Let the ending complete fully. Renewal compensates a genuine, full release, not a half-finished one.`,
      },
      14: {
        heading: 'Compensation & Temperance — Your Return Matches the Genuine Integration',
        why: `Your stability is proportional to how genuinely you actually blended two opposites, not merely alternated between them.`,
        shadow: `You might expect the reward of real balance while only ever alternating between two extremes.`,
        path: `Actually blend the opposites. Stability compensates genuine integration, not rapid alternation dressed up as balance.`,
      },
      15: {
        heading: 'Compensation & The Devil — Your Return Matches the Honesty Invested',
        why: `The return you get — genuine, lasting freedom from a pattern's grip on you — is always proportional to the honesty you actually invest in examining your craving, not to the sheer force of willpower you throw against it. Your rewards, visible and invisible, are exactly proportional to the quality of what you give; applied here, this means your white-knuckled resistance, however impressively sustained, is investing your effort in the wrong currency entirely. What's actually compensated is honest, unflinching examination — actually looking at what your craving is doing for you, what it's protecting you from, what unmet need it's learned to substitute for, rather than simply gritting your teeth against its pull. You've likely already discovered, sometimes painfully, that sheer discipline alone produces only temporary suppression, while genuine, honest insight into your pattern produces something that actually holds.`,
        shadow: `You might expect freedom to arrive through willpower alone, investing enormous energy in resistance and restraint while never actually supplying the honest examination that's your real, required currency. This produces an exhausting and demoralizing cycle: intense periods of white-knuckled control, genuinely impressive in their discipline, that nonetheless collapse — often suddenly, often at moments of stress or depletion — because your underlying pattern was never actually examined, only suppressed. Your suppression is a real investment, but it's the wrong one, and it doesn't compound into the freedom you meant to purchase. The relapse that follows isn't evidence of weak willpower; it's an accurate reflection that resistance alone was never the currency your freedom is actually priced in. This shadow is painful specifically because the effort you invested was real and often heroic — it simply wasn't invested in the thing that actually compensates you.`,
        path: `Redirect the enormous energy you currently spend on resistance toward honest, patient examination instead — ask yourself, without judgment, what your craving is actually doing, what it developed to protect you from, and what it would mean to meet that underlying need directly rather than merely denying its symptom. This is uncomfortable in a different way than resistance is uncomfortable; it requires curiosity and vulnerability rather than gritted-teeth control, and it often surfaces material — old fear, old grief, unmet need — that your resistance was specifically designed to avoid looking at. But this is the actual investment your freedom compensates: not the strength of your resistance, but the honesty of your examination. Your mastery is trading the exhausting, temporary currency of willpower for the slower, more demanding, but genuinely compensating currency of honest self-examination.`,
      },
      16: {
        heading: 'Compensation & The Tower — Your Return Matches What Was Learned From the Collapse',
        why: `Your rebuild is proportional to how much you genuinely learned from the collapse, not just how quickly you rebuilt.`,
        shadow: `You might rebuild fast without investing any actual reflection on what the collapse revealed.`,
        path: `Invest real reflection before rebuilding. A stronger structure compensates genuine learning, not speed alone.`,
      },
      17: {
        heading: 'Compensation & The Star — Your Return Matches the Restoration Actually Done',
        why: `Your hope is proportional to the real restorative work already invested — hope is earned, not simply felt.`,
        shadow: `You might expect deep hope while having invested little in the actual healing that would ground it.`,
        path: `Invest in the real restorative work. Grounded hope compensates genuine healing, not wishing alone.`,
      },
      18: {
        heading: 'Compensation & The Moon — Your Return Matches the Honesty Invested in Facing Fear',
        why: `Your clarity is proportional to how honestly you actually faced the underlying fear, not merely endured it.`,
        shadow: `You might expect clarity while only having endured the confusion without ever facing what's underneath it.`,
        path: `Face the fear honestly and directly. Clarity compensates genuine confrontation, not passive endurance.`,
      },
      19: {
        heading: 'Compensation & The Sun — Your Return Matches the Authenticity Invested',
        why: `Your warmth is proportional to how authentically it's actually lived, not how brightly it's performed.`,
        shadow: `You might expect genuine connection from a performed brightness that isn't backed by real authenticity.`,
        path: `Invest real authenticity. Genuine warmth compensates a genuinely lived vitality, not a performed one.`,
      },
      20: {
        heading: 'Compensation & Judgement — Your Return Matches How Fully the Call Was Answered',
        why: `Your next opportunity is proportional to how fully you actually answered the prior summons.`,
        shadow: `You might expect the next opportunity while having only partially, half-heartedly answered the last one.`,
        path: `Answer the call fully. The next opportunity compensates a complete response, not a partial one.`,
      },
      21: {
        heading: 'Compensation & The World — Your Return Matches the Full Cycle Invested',
        why: `Your mastery is proportional to everything you genuinely invested across the entire cycle, not just its final stretch.`,
        shadow: `You might expect the reward of mastery while having only invested effort near the very end of the cycle.`,
        path: `Invest across the whole cycle, not just its conclusion. Mastery compensates the full arc, start to finish.`,
      },
      22: {
        heading: 'Compensation & The Fool — Your Return Matches the Courage Actually Invested',
        why: `Your new beginnings are proportional to the genuine courage you actually invest in stepping off the edge, not merely in imagining it.`,
        shadow: `You might expect the reward of a fresh start while only ever imagining the leap rather than taking it.`,
        path: `Invest real courage in the actual step. A genuine beginning compensates a genuine leap, not a rehearsed one.`,
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // LAW OF PERPETUAL TRANSMUTATION — "Energy is always converting from
    // one state to another; nothing solid-seeming is truly static."
    // Reads each arcana as an energy currently mid-conversion, and what
    // it's transmuting from and into.
    // ═══════════════════════════════════════════════════════════════════
    perpetualTransmutation: {
      1: {
        heading: 'Transmutation & The Magician — Converting Raw Intention Into Form',
        why: `You're intention actively converting into material form — the energy hasn't stopped moving, it's mid-transformation from thought into thing.`,
        shadow: `You might expect the conversion to be instantaneous, and mistake the mid-transmutation stage for failure.`,
        path: `Trust the conversion is underway. Energy transmuting from idea to form takes real time to complete its transition.`,
      },
      2: {
        heading: 'Transmutation & The High Priestess — Converting Unconscious Into Conscious',
        why: `Your unconscious material is actively converting into conscious awareness — the energy of the unknown is mid-transition into the known for you.`,
        shadow: `You might resist the conversion, keeping the unconscious material frozen rather than letting it transmute into usable awareness.`,
        path: `Let the unconscious energy keep converting. Resisting the transmutation just stalls it in an uncomfortable in-between state.`,
      },
      3: {
        heading: 'Transmutation & The Empress — Converting Potential Into Growth',
        why: `Your raw potential is actively converting into visible growth — nothing about fertility is static, it's energy constantly becoming form.`,
        shadow: `You might expect growth without acknowledging the ongoing conversion process it actually requires time to complete.`,
        path: `Allow the potential to keep converting at its own pace. Growth is a transmutation in progress, not an instant result.`,
      },
      4: {
        heading: 'Transmutation & The Emperor — Converting Chaos Into Order',
        why: `Your chaotic energy is actively converting into structured order — the stability wasn't always there, it's a transmutation achieved through sustained effort.`,
        shadow: `You might treat the current order as permanently fixed, forgetting it's an ongoing conversion that requires continued maintenance.`,
        path: `Keep tending the conversion. Order is energy continuously transmuted from chaos, not a one-time achievement.`,
      },
      5: {
        heading: 'Transmutation & The Hierophant — Converting Raw Experience Into Wisdom',
        why: `Your lived experience is actively converting into transmissible wisdom — knowledge is energy that's undergone a real transformation.`,
        shadow: `You might try to transmit raw, unconverted experience as though it were already refined wisdom.`,
        path: `Let the experience finish converting before you transmit it. Wisdom is experience that's actually completed its transmutation.`,
      },
      6: {
        heading: 'Transmutation & The Lovers — Converting Attraction Into Genuine Union',
        why: `Your initial attraction is actively converting into something deeper — the energy of infatuation is mid-transition into real union.`,
        shadow: `You might expect the initial attraction-energy to stay unchanged, resisting its natural conversion into a steadier, deeper form.`,
        path: `Allow the attraction to convert into something deeper. Resisting the transmutation keeps the relationship stuck in its earliest, most volatile stage.`,
      },
      7: {
        heading: 'Transmutation & The Chariot — Converting Will Into Momentum',
        why: `Your raw will is actively converting into sustained momentum — the energy of desire transforming into the energy of motion.`,
        shadow: `You might hold your will as pure intention, never letting it transmute into the physical momentum that would actually move the vehicle.`,
        path: `Let the will keep converting into motion. Momentum is willpower that's actually completed its transmutation into action.`,
      },
      8: {
        heading: 'Transmutation & Justice — Converting Imbalance Into Restored Ledger',
        why: `Your imbalance is actively converting into restored equilibrium — the energy of an old wrong is transmuting into the energy of correction.`,
        shadow: `You might treat the imbalance as permanent rather than as energy already mid-conversion toward its own correction.`,
        path: `Trust the imbalance is transmuting. What's actively being corrected is energy in transition, not a fixed condition.`,
      },
      9: {
        heading: 'Transmutation & The Hermit — Converting Noise Into Insight',
        why: `Your scattered noise is actively converting into distilled insight — solitude is the chamber where that conversion actually happens.`,
        shadow: `You might expect insight instantly, without giving the noise-to-insight conversion the time it actually requires.`,
        path: `Give the conversion real time. Insight is noise that's genuinely finished transmuting, not an instant download.`,
      },
      10: {
        heading: 'Transmutation & The Wheel of Fortune — Converting One Phase Into the Next',
        why: `Your downturn is energy actively transmuting toward the next upswing — continuous conversion between phases, not a permanent state.`,
        shadow: `You might treat a downturn as a permanent state rather than as energy mid-conversion toward its next phase.`,
        path: `Trust the conversion between phases. The downturn is energy in transition for you, not a final destination.`,
      },
      11: {
        heading: 'Transmutation & Strength — Converting Raw Instinct Into Settled Power',
        why: `Your raw, untamed instinct is actively converting into settled, integrated power — nothing about calm was ever your starting state.`,
        shadow: `You might expect instant calm without acknowledging the real conversion process instinct has to undergo.`,
        path: `Let the instinct keep converting through patient integration. Settled power is raw energy that's genuinely finished transmuting.`,
      },
      12: {
        heading: 'Transmutation & The Hanged Man — Converting Old Perspective Into New',
        why: `Your old, fixed perspective is actively converting into a new one — the suspension is the conversion chamber itself.`,
        shadow: `You might remain suspended without letting the old perspective actually finish converting into the new one.`,
        path: `Let the perspective complete its conversion. The insight arrives once the transmutation, not just the suspension, is finished.`,
      },
      13: {
        heading: 'Transmutation & Transformation — The Law Made Most Literal',
        why: `None of your readings states this Law more directly than your Transformation. Your energy is always converting from one state into another, nothing in you is ever truly static no matter how solid or permanent it appears, and what looks, from the outside, like an ending, a death, a total cessation, is in fact your energy in the middle of a complete conversion from one form into another, with nothing actually destroyed in the process. This isn't a comforting metaphor layered on top of your loss; it's a precise, literal description of what's mechanically occurring in you. The old form in your life — a relationship, an identity, a chapter, a way of living — isn't being annihilated. It's being converted, the way ice becomes water and water becomes vapor without a single molecule ever ceasing to exist, simply changing the shape it's currently taking for you. Your endings likely feel, at some deep level, less final to you than they appear to everyone around you — an intuitive sense that something continues even as its current form dissolves, because your energy was never actually going anywhere. It was only ever changing shape.`,
        shadow: `You might grieve your ending as pure, total loss — treating your dissolving form as though it represents annihilation rather than conversion, and getting genuinely, sometimes overwhelmingly, stuck in a grief that assumes nothing survives your transition. This is understandable, because the form that's ending was often real, valued, and worth mourning in its own right; your mistake isn't in grieving, it's in grieving as though the energy itself has vanished along with the form it used to occupy. This produces a particular kind of stuckness — an inability to recognize or receive whatever your energy is converting into next, because your attention remains fixed entirely on what you've lost rather than on what you're currently, actively becoming. The tragedy of this shadow is that it can genuinely delay the very conversion you're grieving, because your energy still needs somewhere to go, and if you stay locked entirely in the loss of your old form you can inadvertently obstruct the emergence of your new one, prolonging your discomfort rather than letting the transition actually complete.`,
        path: `Learn to grieve your old form honestly while simultaneously staying alert for what it's actually converting into — holding both truths at once, that something real has ended and that your underlying energy hasn't vanished but is actively becoming something new. This requires you to resist the very natural urge to fixate entirely on the loss, and instead ask yourself, even in the middle of real grief, what this energy is transmuting into now. Concretely, this might mean noticing the first, tentative signs of your new form as it begins to emerge, rather than dismissing them because your attention is still entirely oriented toward what has ended. Your mastery here isn't skipping the grief — your old form was real, and its ending deserves to be honored — but refusing to mistake the ending for annihilation. The energy that built your old form is still here, mid-conversion, already beginning to take its next shape.`,
      },
      14: {
        heading: 'Transmutation & Temperance — Converting Two Opposites Into a Third Substance',
        why: `You're literal alchemy — two opposing energies actively converting into a genuinely new, blended substance neither could produce alone.`,
        shadow: `You might hold the two opposites separately, never letting them actually undergo the conversion into something new.`,
        path: `Let the opposites genuinely convert together. Real Temperance is a transmutation for you, not a careful separation of the two energies.`,
      },
      15: {
        heading: 'Transmutation & The Devil — Converting Compulsion Into Conscious Choice',
        why: `Your compulsive energy can actively convert into conscious, chosen energy once you recognize its pattern.`,
        shadow: `You might treat the compulsion as permanently fixed rather than as energy capable of being consciously transmuted.`,
        path: `Recognize the pattern to begin its conversion. Compulsion transmutes into choice once it's brought into conscious awareness.`,
      },
      16: {
        heading: 'Transmutation & The Tower — Converting an Old Form Into Raw Material',
        why: `Your sudden collapse isn't destruction in the final sense — it's a structure of yours being forcibly converted back into its constituent raw material, a shape that had locked your energy into an unstable, load-bearing form, released all at once so your energy can begin converting into something the old shape could never have accommodated. Your energy is never static, always mid-conversion between states, and your Tower is what that conversion looks like when it happens abruptly rather than gradually: lightning strikes, the structure that seemed permanent comes apart, and what's left isn't nothing, but raw, formless material — freed, momentarily chaotic, but genuinely available for you to become something new in a way it couldn't while still locked inside your old, now-revealed-as-unstable form. You've likely experienced collapse of this kind more than once, and if you look honestly at what followed, you may already sense that the collapse itself was never actually the end of your story — it was the release of material that had been trapped inside a structure that could no longer safely hold it.`,
        shadow: `You might attempt to salvage and rebuild the exact original form immediately after your collapse — treating your released raw material as though its only proper use is reconstructing precisely what just came apart, rather than letting it convert into something genuinely better suited to whatever comes next. This is an understandable impulse; your old structure was familiar, and rebuilding it exactly as it was feels, in the disoriented aftermath of collapse, like restoring your safety. But a structure that just proved itself unstable enough to collapse under its own load isn't worth reconstructing identically — doing so simply guarantees the same eventual failure, because you never actually addressed the underlying instability, only rebuilt it in the same shape that already failed you once. This shadow produces a demoralizing pattern of repeated collapse, each one feeling, in the moment, like fresh misfortune, when in fact it's the same insufficiently converted material being forced back into the same insufficient form, again and again.`,
        path: `Resist the urge to immediately rebuild the identical structure, and instead genuinely examine what raw material your collapse actually released, and what new form that material is now suited to become. This requires patience during the disorienting period right after your collapse, when your pull to restore the familiar old shape is strongest — sitting, uncomfortably, with your released material in its formless state long enough to actually understand what it wants to become next, rather than reflexively forcing it back into the shape that just proved unable to hold it. Your mastery here is trusting your collapse as a genuine conversion rather than a pure catastrophe — recognizing that the energy you released was never destroyed, only freed from a form that could no longer contain it, and is now, if you allow it the space to actually transmute, available to become something considerably more durable than what just came down.`,
      },
      17: {
        heading: 'Transmutation & The Star — Converting Grief Into Renewed Hope',
        why: `Your grief is actively converting into genuine hope — the energy of loss doesn't vanish, it transforms into the energy of renewal.`,
        shadow: `You might expect the hope without letting the grief genuinely convert first, skipping a necessary stage of the transmutation.`,
        path: `Let the grief fully convert before expecting the hope. Renewal is grief that's actually completed its transmutation, not bypassed it.`,
      },
      18: {
        heading: 'Transmutation & The Moon — Converting Fear Into Intuitive Clarity',
        why: `Your fear isn't a fixed, permanent condition — it's raw energy currently mid-conversion, capable, once you actually process it rather than avoid it, of transmuting into something genuinely valuable: intuitive clarity of a depth that calmer, less unsettled states rarely produce. Your energy is never truly static; every state you're in is simply energy in transition toward its next form, and the fog, confusion, and unease you carry is not a permanent destination but a phase — an unstable, in-between state of energy that hasn't yet completed its conversion into the clearer form it's actually capable of becoming. You likely carry a particularly rich, sensitive inner world, one that can feel, in its unprocessed state, genuinely destabilizing — vivid fears, ambiguous unease, a heightened sense that something beneath your surface deserves attention. Your gift, once you understand it, is that this very same raw material, once you actually engage with it rather than avoid it, is the specific energy your deepest intuitive clarity is made from. Your fog was never your enemy. It was unconverted material.`,
        shadow: `You might remain indefinitely in the raw fear stage — never actually engaging with what your fear is pointing toward, and instead either drowning in it or aggressively suppressing it, both of which leave your energy stuck exactly where it started rather than letting it convert into anything else. This is a subtle trap because both extremes feel, from the inside, like reasonable responses to genuine unease: either fully immersing in the anxious feeling as though it were simply accurate information about reality, or clamping down on it entirely and refusing to look at what's underneath. Neither response lets you access the actual conversion you're capable of; your energy stays locked in its rawest, most uncomfortable form precisely because you've either indulged it uncritically or avoided it entirely, rather than genuinely processing it. The particular cost of this shadow is a kind of chronic, low-grade fog that never lifts — the same anxious material recycling indefinitely because you never actually gave it the chance to complete its conversion into something clearer.`,
        path: `Engage with your fear directly and honestly — neither drowning in it nor suppressing it, but examining it closely enough to let its energy actually convert into the intuitive clarity it's capable of becoming. Treat your fog not as an emergency to escape or a truth to obey uncritically, but as raw material that rewards your patient, direct attention: what specifically is your fear pointing toward, what is it trying to protect you from, what does it know that your conscious mind hasn't yet acknowledged. This process takes real time, and your fog often gets denser before it clarifies, which is precisely why you might be tempted to abandon the process partway through, right before your conversion would have completed. Your mastery here is trusting that your intuitive clarity, when it finally arrives, isn't a different energy than the fear that preceded it — it's that same energy, fully transmuted, having finally been allowed to complete the conversion it was always capable of.`,
      },
      19: {
        heading: 'Transmutation & The Sun — Converting Effort Into Effortless Radiance',
        why: `Your vitality is effort that's fully converted into something that no longer feels like effort at all.`,
        shadow: `You might expect effortless radiance while the underlying effort hasn't actually finished its conversion yet.`,
        path: `Trust the conversion is underway. Effortless vitality is effort that's genuinely completed its transmutation, not skipped it.`,
      },
      20: {
        heading: 'Transmutation & Judgement — Converting the Old Self Into the Next',
        why: `Your old identity is actively converting into a new one — the summons is the signal that the conversion has reached completion.`,
        shadow: `You might try to keep the old identity intact even as the underlying energy has already converted past it.`,
        path: `Let the old self finish converting into the new. Resisting the completed transmutation just delays what's already underway.`,
      },
      21: {
        heading: 'Transmutation & The World — Converting a Full Cycle Into Mastery',
        why: `You're an entire cycle's worth of energy converted fully into settled mastery — nothing about it happened instantly.`,
        shadow: `You might expect mastery without honoring the full, gradual conversion an entire cycle actually required.`,
        path: `Honor the full conversion. Mastery is an entire cycle's energy that's genuinely finished transmuting, not a shortcut to the same place.`,
      },
      22: {
        heading: 'Transmutation & The Fool — Converting Potential Into an Actual Beginning',
        why: `You're pure potential energy actively converting into an actual, committed beginning the moment you take the first step.`,
        shadow: `You might hold the potential energy indefinitely, never letting it convert into anything actual.`,
        path: `Let the potential convert through the first real step. A beginning is potential that's actually completed its transmutation into motion.`,
      },
    },

  };

  // ── ARCANA → LAW MATCH ────────────────────────────────────────────────────
  // Each arcana has exactly one law that most authentically correlates with
  // its core energy (curated, not user-selectable). Used by getMatch() to
  // back the card's simple Standard/Law toggle.
  const ARCANA_LAW_MATCH = {
    1: 'action',          2: 'divineOneness',   3: 'compensation',
    4: 'causeEffect',     5: 'correspondence',   6: 'attraction',
    7: 'vibration',       8: 'causeEffect',      9: 'mentalism',
    10: 'vibration',      11: 'polarity',        12: 'correspondence',
    13: 'perpetualTransmutation', 14: 'polarity', 15: 'compensation',
    16: 'perpetualTransmutation', 17: 'attraction', 18: 'perpetualTransmutation',
    19: 'vibration',      20: 'mentalism',       21: 'divineOneness',
    22: 'action',
  };

  // ── CORRELATION — "why this law fits this arcana" ─────────────────────────
  // A dedicated paragraph per arcana naming the resonance directly, shown
  // above Why/Shadow/Path whenever Law view is active. Distinct from the
  // why/shadow/path prose above, which explores the pairing rather than
  // stating the match itself.
  const CORRELATION = {
    1: `You're matched to the Law of Action because before anything else, you're wired for intention completing itself through physical gesture — every tool on your table stays inert until your hand actually moves. No other law names what you do as precisely: your manifestation isn't belief or hope, it's the decisive, embodied step that converts your will into form.`,
    2: `You're matched to the Law of Divine Oneness because your knowing was never manufactured in isolation — it arrives through the veil that separates your individual mind from a far larger field of connected awareness. Where the rest of you builds or acts, you receive, and what you receive only makes sense once you recognize the boundary between "self" and "everything else" as far thinner than it appears.`,
    3: `You're matched to the Law of Compensation because your abundance was never random weather — it's the precise, proportional return on the nurture you actually give. You don't just represent overflow; you represent overflow as an earned outcome, which is exactly what this Law describes for you: reward mirroring investment, harvest mirroring tending.`,
    4: `You're matched to the Law of Cause and Effect because your durable structure is never accidental — it's the accumulated, traceable result of the sustained discipline you apply over time. You don't merely occupy order; you demonstrate the mechanism that produces it in you, which is the causal chain this Law describes with the least ambiguity of anything you carry.`,
    5: `You're matched to the Law of Correspondence because your sacred transmission depends entirely on your inner devotion mirroring your outer form — your ritual, your doctrine, your lineage are only as alive as the internal reverence they reflect in you. This is Correspondence's core claim made institutional in you: as within, so your tradition; as your tradition, so within.`,
    6: `You're matched to the Law of Attraction because your union, at its core, is never proximity or convenience for you — it's two frequencies genuinely drawing toward each other because of what each is actually emitting. Nothing you carry more directly demonstrates that like calls to like than this moment of aligned choice.`,
    7: `You're matched to the Law of Vibration because your directed momentum is, mechanically, a frequency you hold steady enough to move something forward — your will translated into a sustained signal rather than a single burst. You don't just travel; you demonstrate what a coherent, unwavering vibration actually produces for you over distance and time.`,
    8: `You're matched to the Law of Cause and Effect because you're arguably that Law's most literal embodiment you carry — an internal ledger precisely determining your external outcome, with no chance or exception permitted. Where the rest of what you carry merely illustrates cause and effect, you are the mechanism, weighed and exact.`,
    9: `You're matched to the Law of Mentalism because the entire purpose of your withdrawal is cognitive — you step out of the noise specifically to inspect which belief-templates are actually running your mind. Your solitude isn't escape; it's your deliberate audit of the architecture this Law says is drafting everything else in your life.`,
    10: `You're matched to the Law of Vibration because what looks to you like the unpredictability of fate is, underneath, a rhythmic frequency cycling between contraction and expansion — your wheel doesn't turn randomly, it oscillates the way any sustained vibration naturally does, rising and falling in a pattern you can read once you recognize it.`,
    11: `You're matched to the Law of Polarity because your entire achievement is holding two poles — untamed instinct and total suppression — without collapsing into either one. Your genuine strength isn't dominance over one pole; it's the integrated middle this Law names as the actual location of your mastery.`,
    12: `You're matched to the Law of Correspondence because the entire value of your inversion is that your outer suspension produces an inner reversal of view — what changes outside you directly mirrors, and enables, what shifts inside you. Your upside-down position isn't punishment; it's Correspondence demonstrated for you as a literal change of vantage point.`,
    13: `You're matched to the Law of Perpetual Transmutation because this pairing is closer to a definition than a metaphor for you — nothing you carry describes destruction, only energy converting completely from one form into another. Of everything you carry, nothing states this Law's central claim — that nothing is ever lost, only transmuted — more plainly than this.`,
    14: `You're matched to the Law of Polarity because you exist entirely to demonstrate the Law's central claim in your own life: that two opposites can blend into a genuinely new, integrated substance in you rather than merely alternate. You aren't the absence of extremes — you're Polarity's promised midpoint, actually reached.`,
    15: `You're matched to the Law of Compensation because your freedom from this Arcana's grip is always proportional to the honesty you actually invest in examining your craving, never to willpower alone — your chain loosens exactly as much as the real internal work you put into understanding it, no more and no less.`,
    16: `You're matched to the Law of Perpetual Transmutation because your sudden collapse isn't loss for you, it's a structure being forcibly converted back into raw material — energy that was locked into an unstable form in you, released so it can transmute into something your old shape could never have held.`,
    17: `You're matched to the Law of Attraction because the hope you carry is magnetic by nature — your genuine, evidence-grounded renewal doesn't simply feel good to you, it actively draws in circumstances that resonate with it. Nothing you carry better demonstrates that your authentic hope behaves as a signal the world responds to, not just a private feeling.`,
    18: `You're matched to the Law of Perpetual Transmutation because the fear and confusion you carry are not permanent conditions for you — they're energy mid-conversion in you, capable of transmuting into genuine intuitive clarity once you actually process it rather than avoid it. Your fog isn't your destination; it's a phase this Law says is always in transition for you.`,
    19: `You're matched to the Law of Vibration because the vitality you radiate is, at its root, a frequency in you — warmth and clarity you don't need to manufacture because they're simply your natural resting pitch once your system stops fighting itself. Nothing you carry demonstrates unforced, high-frequency signal more clearly than you do.`,
    20: `You're matched to the Law of Mentalism because the summons you represent is, first, a cognitive event in you — your mind finally admitting, consciously, that an old template has become obsolete for you. Your call doesn't arrive from outside; it's your mental architecture itself recognizing it has already outgrown its current draft.`,
    21: `You're matched to the Law of Divine Oneness because your genuine completion was never a private achievement for you — it's mastery that connects back to, and serves, the larger whole you emerged from. Your wholeness isn't isolated perfection; it's Divine Oneness demonstrated in you as a finished, integrated circle.`,
    22: `You're matched to the Law of Action because your pure potential, however open, means nothing to you until you actually take the physical step off the edge — your entire identity is the moment your potential energy converts into a real, committed beginning through movement rather than through further consideration.`,
  };

  /**
   * get(lawKey, arcanaNum)
   * Returns { heading, why, shadow, path } for the given law + arcana, or null.
   */
  function get(lawKey, arcanaNum) {
    const block = laws[lawKey];
    return (block && block[arcanaNum]) || null;
  }

  /**
   * getMatch(arcanaNum)
   * Returns the single curated law match for this arcana, blended with its
   * correlation paragraph: { lawKey, correlation, heading, why, shadow, path }
   * or null if the arcana number is unrecognized.
   */
  function getMatch(arcanaNum) {
    const lawKey = ARCANA_LAW_MATCH[arcanaNum];
    const content = lawKey && get(lawKey, arcanaNum);
    if (!content) return null;
    return { lawKey, correlation: CORRELATION[arcanaNum] || '', ...content };
  }

  return { get, getMatch };

})();
