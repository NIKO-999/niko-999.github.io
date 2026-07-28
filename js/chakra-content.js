'use strict';

/**
 * Destiny Matrix — Chakra Map content
 * ────────────────────────────────────
 * Source: research/07-Health-Interpretations/Chakra-Correspondence-and-
 * Meanings.md (pages 15-16 of DestinyMatrix-Sheet.pdf) for each chakra's body
 * location, colour and balanced-state description; and research/01-Foundation/
 * Destiny-Matrix-Calculation-Guide.extracted.md pages 6 and 14-15 for the
 * three-aspect model. Formula derivation and verification:
 * research/11-Research-Updates/24-chakra-map-solved-talent-line-corrected.md.
 *
 * The source's descriptions are keyword-ish and third-person; per
 * NON_NEGOTIABLE_RULES they are rewritten here into continuous second-person
 * Golden Standard prose. The substance is the source's — only the voice is
 * original.
 *
 * THIS IS THE CHAKRA-LEVEL TIER ONLY (7 entries). It describes what each
 * centre governs and what its three aspects mean. The per-arcana tier
 * (7 chakras x 22 arcana = 154 positional readings, the Gold Standard layer)
 * is NOT written yet — until it exists, a chakra card shows this tier plus the
 * reader's own three numbers, which is honest rather than padded.
 *
 * The three aspects, per the guide's "Classical Calculation":
 *   Physical  — the horizontal (earth line) value. How the centre shows up in
 *               the body and in material circumstance.
 *   Energy    — the vertical (sky line) value. How it runs as available force.
 *   Emotional — reduce(Physical + Energy). How it is actually felt.
 *
 * API:
 *   DChakraContent.get(key)   // 'muladhara' | 'swadhisthana' | ...
 *     → { where, governs, balanced, physical, energy, emotional } or null
 */

window.DChakraContent = (function () {

  const chakras = {

    sahasrara: {
      where: `At the crown of the head — the topmost point, where you meet whatever you understand to be larger than yourself.`,
      governs: `Spiritual connection, universal consciousness, and the sense of belonging to something beyond your own biography.`,
      balanced: `When this centre is open, you can hold a sense of connection that doesn't depend on belief being tidy. You feel part of something rather than adrift in it, and that produces a particular quietness — not detachment, but the absence of the low background argument about whether your life means anything. People with an open crown tend to feel whole in a way that isn't contingent on circumstances cooperating.`,
      physical: `How your sense of meaning shows up in ordinary material life — whether purpose is something you live inside or something you postpone until the practical parts are handled.`,
      energy: `How readily connection is actually available to you: whether reaching for something larger feels natural, or like effortful work against your own scepticism.`,
      emotional: `What that meeting actually feels like day to day — the felt experience of being connected, or of reaching and not quite arriving.`,
    },

    ajna: {
      where: `Between the eyebrows, at the centre of the forehead.`,
      governs: `Intuition, inner knowledge, mental clarity, and the imaginative faculty that lets you see what isn't in front of you yet.`,
      balanced: `When this centre is clear, you trust what you perceive before you can fully justify it, and that trust turns out to be well-placed more often than not. Thinking feels clean rather than crowded. You can hold an inner picture steadily enough to work from it, and you move through decisions with a sense of direction that doesn't need constant external confirmation to stay steady.`,
      physical: `How your perception meets the concrete world — whether insight translates into decisions you actually act on, or stays a private commentary running alongside your life.`,
      energy: `The raw availability of intuition: how loudly the inner signal arrives, and how much interference sits between sensing something and knowing you sensed it.`,
      emotional: `How your own knowing feels to live with — clarifying and steadying, or unsettling in a way that makes you want to look away from it.`,
    },

    vishuddha: {
      where: `In the neck, around the throat and the thyroid.`,
      governs: `Communication, self-expression, creativity and honesty — the ability to make what's inside you legible to someone else.`,
      balanced: `When this centre is open, what you mean and what you say are close to the same thing. You can speak difficult truths without either armouring them or dissolving into apology, and creative expression flows out rather than backing up. There's a specific relief in it: you stop carrying the weight of things you've been meaning to say, because you say them.`,
      physical: `How expression shows up in your actual life — the work you make, the conversations you have, whether your voice takes up real space in rooms that matter.`,
      energy: `How much expressive force is genuinely available: whether speaking comes easily or has to be pushed through resistance every time.`,
      emotional: `What expressing yourself costs or gives you emotionally — whether being heard feels safe, exposing, or something you've stopped expecting.`,
    },

    anahata: {
      where: `In the chest, at the centre of the heart.`,
      governs: `Love, compassion, empathy, attachment and emotional balance — your capacity to be connected to yourself and to other people at the same time.`,
      balanced: `When this centre is open, love moves in both directions without a toll being charged. You can be close to people without losing your own outline, and you can be kind to yourself with the same ease you extend outward. It shows up as steadiness rather than intensity — the ability to stay present with someone's difficulty without either absorbing it or backing away from it.`,
      physical: `How connection shows up in your material life — the relationships you actually maintain, the people physically near you, whether care is something you give and receive or only administer.`,
      energy: `How much relational capacity is genuinely available to you: whether opening is something you can do, or something that costs more than you currently have.`,
      emotional: `What loving and being loved actually feels like from the inside — the felt temperature of your closest connections.`,
    },

    manipura: {
      where: `In the upper abdomen, just below the rib cage.`,
      governs: `Personal power, self-confidence, willpower, and your sense of yourself as someone who can act on the world.`,
      balanced: `When this centre is strong, you know your own strength without needing to test it against anyone. Decisions get made and followed through. There's a settledness in it — you can assert yourself without escalation, and you can yield without it feeling like defeat, because your sense of who you are isn't riding on the outcome of every exchange.`,
      physical: `How your will shows up in practice — what you actually initiate, finish and defend in the material world.`,
      energy: `The raw force available to you: how much drive you can call on, and whether it arrives when you need it or only under pressure.`,
      emotional: `How your own power feels to hold — steadying and clean, or tangled up with something that makes asserting yourself uncomfortable.`,
    },

    swadhisthana: {
      where: `In the lower abdomen, about two fingers below the navel.`,
      governs: `Creativity, sexuality, emotional balance, pleasure and the ordinary enjoyment of being alive.`,
      balanced: `When this centre is open, pleasure isn't something you have to earn first. Creativity moves without being forced, desire feels like information rather than a problem, and your emotional weather changes without knocking you over. There's a vitality to it that's easy to recognise from outside — people with an open sacral centre seem genuinely to inhabit their lives rather than manage them.`,
      physical: `How pleasure and creativity show up in your actual life — what you make, what you enjoy, whether your body is somewhere you live or something you operate.`,
      energy: `How much creative and sensual force is genuinely available, and whether it flows or has to be unblocked each time.`,
      emotional: `What wanting things feels like for you — freeing, or complicated by something older than the wanting itself.`,
    },

    muladhara: {
      where: `At the very base of the spine, in the coccyx.`,
      governs: `Physical existence, security, survival, your basic needs and your roots — the ground everything else is built on.`,
      balanced: `When this centre is stable, you feel safe in a way you don't have to keep checking. There's physical energy and endurance available, and a sense of belonging somewhere. The source calls this the most fundamental of the seven, and it means it structurally: the other centres tend to function well only to the degree this one is steady, because a nervous system braced for survival has little left over for anything higher up.`,
      physical: `How security shows up materially — housing, money, health, the concrete conditions of your safety.`,
      energy: `How much groundedness is actually available to you: whether steadiness is your baseline or something you have to manufacture.`,
      emotional: `What safety feels like from the inside — settled, or a vigilance that persists even when your circumstances no longer justify it.`,
    },

  };

  /**
   * PER-ARCANA TIER (Gold Standard layer, added 2026-07-28)
   * ─────────────────────────────────────────────────────────
   * Keyed on a chakra's EMOTIONAL value — reduce(physical + energy), "how it
   * is actually felt", the number already shown on the rail's spine dot —
   * because that is the one number this position resolves to, the same way
   * every other single-value position in the app (A-E, F-I, the Purposes)
   * gets one full reading. Physical and Energy are the two INPUTS to that
   * value, so they stay as short "what feeds this" lines naming the reader's
   * own arcana there (same pattern as js/purpose-content.js's generated feed
   * line), not full parallel write-ups — writing three full readings per
   * chakra per arcana would triple the volume for content that mostly repeats
   * itself, since Physical and Energy about to combine into Emotional are the
   * same psychological material seen from two angles.
   *
   * Field shape matches the rest of the app: heading / why / shadow / path
   * (written, not rendered — same decision as every other system) / positive
   * / negative. No `general[]` fallback: an unwritten (chakra, arcana) pair
   * renders the chakra-level tier above plus the reader's own numbers, honest
   * rather than fabricated, same as the Sexual Line's unmatched-pair case.
   *
   * API: DChakraContent.getForArcana(chakraKey, arcanaNum) → entry or null
   */
  const nodes = {

    muladhara: {
      1: {
        heading: `Your Ground Is Something You Build, Not Something You Wait For`,
        why: `Muladhara asks whether you feel safe enough in your own life to stand still — and the Magician's answer has always been to make the ground rather than search for it. Your security doesn't arrive as a gift from stable circumstances; it arrives as a byproduct of your own initiating force, the thing you built with your own hands under you. That's a real form of groundedness, and it's also a demanding one: it only holds as long as you keep generating it.`,
        shadow: `The risk is a root system with no roots — safety that exists only while you're actively producing it, so the moment your momentum pauses, the ground feels like it's disappearing too. You might notice a compulsive need to always have a project moving, not from ambition but from a genuine fear that stillness means the floor drops out. Rest doesn't feel restful; it feels like the ground going soft.`,
        path: `Try building one piece of security that doesn't depend on your continued effort — savings you don't touch, a routine that runs itself, a relationship that holds you even on your slow days. You are allowed to stand on ground you didn't just make. What would it feel like to be safe for a week without producing anything?`,
        positive: `Your safety is still self-generated — that's real, and it's not going away — but you've added at least one piece of ground that holds without your continued output. Stillness has stopped meaning collapse. You can pause the momentum and notice the floor is actually still there, because for the first time some of it wasn't built by you alone in the last six months.`,
        negative: `Your groundedness is entirely a function of your own output, and it's costing you the ability to ever fully stop. A quiet week doesn't feel peaceful, it feels precarious, because the root system has no roots of its own — only whatever you're currently generating. That isn't restlessness for its own sake. It's a nervous system that's learned, accurately, that this particular ground disappears the moment you stop making it.`,
      },
      2: {
        heading: `Your Security Depends on Trusting What You Can't Yet Prove`,
        why: `Muladhara asks whether you feel safe in your body and your circumstances — and the High Priestess answers from a place that runs ahead of evidence. You sense whether ground is solid before you can point to why, and when you listen to that sense, it tends to be right. Your safety is real, but it's built on a kind of knowing that other people can't verify from outside, which makes it a private, sometimes lonely form of groundedness.`,
        shadow: `The risk is a security you can't defend out loud, so when someone challenges your sense of safety with logic or evidence you don't have on hand, you can be talked out of a groundedness that was actually accurate. You might notice you doubt your own settled feeling the moment someone else questions it, trading a correct private certainty for an anxious public uncertainty.`,
        path: `Try naming what your sense of safety is actually based on, even speculatively, so it can survive being questioned. You are allowed to trust the felt sense of solid ground before you can fully explain it. What do you know about your own safety that you've never said out loud?`,
        positive: `You still feel your way to safety before you can prove it — that instinct is intact and it's usually right — but you've learned to hold it steady when someone else questions it instead of abandoning it under pressure. Your groundedness has become something you can stand on publicly, not just privately, because you've started giving it words.`,
        negative: `Your sense of safety is real and it's staying entirely private, which means it's fragile the moment anyone else pushes back on it. You can feel settled and secure right up until someone with a confident argument suggests you shouldn't be — and then the ground you were actually standing on correctly gets abandoned for their less accurate certainty. The knowing was never the problem. The silence around it is.`,
      },
      3: {
        heading: `Your Ground Is Made of the People and Comfort Around You`,
        why: `Muladhara asks what makes you feel physically and materially safe — and the Empress answers with abundance, warmth, a home that's actually tended to. You root through what you can touch and taste and surround yourself with: good food, a comfortable space, people who are fed and warm because of you. That's a genuine, embodied form of security, built through nurturing rather than defended through vigilance.`,
        shadow: `The risk is grounding yourself entirely in what you provide for others, so your own safety quietly becomes contingent on being needed. If the nurturing stops being required, the ground can feel like it's going with it. You might notice you're excellent at making everyone else's environment safe and comfortable while your own sense of security depends on staying indispensable to that process.`,
        path: `Try making your own comfort as non-negotiable as everyone else's — the good meal, the warm space, the tended body, without it being in service of anyone but you. You are allowed to be nurtured, not just nurturing. What would your own environment look like if you tended it the way you tend everyone else's?`,
        positive: `Your groundedness through comfort and abundance is still exactly as real — good food, a warm home, tended relationships — and now it includes you as a recipient, not only a source. You've noticed your safety no longer depends on being needed, because you've started needing and receiving too. The nurturing runs in both directions now, and it holds up better for it.`,
        negative: `Your sense of safety is built on providing comfort, and it's quietly contingent on staying needed for that role. If the nurturing isn't required, the ground can feel shakier than the actual circumstances warrant. Meanwhile your own environment — your comfort, your rest, your fed and warm body — gets tended last, if at all, because the security system runs almost entirely outward.`,
      },
      4: {
        heading: `Your Ground Is Structure, and You Built More of It Than You Rest In`,
        why: `Muladhara asks what makes the world feel stable under you — and the Emperor answers with order: systems, plans, a clear chain of responsibility. You feel safe when things are organized and in control, and you're genuinely good at building the structures that create that stability, for yourself and for whoever depends on you. That's real, hard-won groundedness, built through governance rather than luck.`,
        shadow: `The risk is a security that depends entirely on you continuing to hold the structure together, so the ground never actually gets to be underneath you — it's something you're perpetually carrying. You might notice you can't relax into safety even when everything is stable, because some part of you is still monitoring the structure, unable to trust it to hold without your active oversight.`,
        path: `Try trusting one piece of your own structure to hold without checking on it. You are allowed to rest inside the order you built instead of only maintaining it. What have you constructed that's actually solid enough to stand on without you watching it constantly?`,
        positive: `You still build real structure and real stability — that capacity hasn't changed — but you've started trusting some of it to hold without your constant oversight. The ground has stopped being something you carry and started being something you can actually stand on. You notice yourself relaxing inside systems you built instead of perpetually maintaining them from a stance of vigilance.`,
        negative: `Your groundedness depends entirely on you actively holding the structure together, which means you never get to simply stand on stable ground — you're always underneath it, bracing. Even genuinely stable circumstances don't register as safe, because some part of you can't stop monitoring for the moment the order requires your intervention. The structure is real. Your ability to trust it isn't.`,
      },
      5: {
        heading: `Your Ground Comes From Belonging to Something Larger Than You`,
        why: `Muladhara asks where your safety comes from — and the Hierophant answers through belonging: a tradition, an institution, a value system you can locate yourself inside. You feel secure when you know where you stand in relation to something established, and that groundedness is real, inherited from structures that have held other people before you. It's safety through membership rather than self-sufficiency.`,
        shadow: `The risk is a security that collapses the moment the framework is questioned, because your ground was never separated from the institution itself. You might notice that doubting the tradition — even in small, reasonable ways — produces a disproportionate sense of unsafety, as though the structure and your own footing were the same thing rather than related but distinct.`,
        path: `Try locating the ground that's actually yours, separate from the framework — what you'd still stand on if the institution changed or disappointed you. You are allowed to belong to something and also have footing of your own. What would still hold you up if the tradition let you down?`,
        positive: `You still find real security in belonging to something larger than yourself — that hasn't diminished — but you've located a layer of ground that's actually yours, independent of the framework. Questioning the tradition no longer threatens your footing, because your safety was never entirely the same thing as the institution's. You can disagree and still feel secure.`,
        negative: `Your sense of safety is fused with the framework you belong to, so any real doubt about the tradition registers as a threat to your own ground rather than a separate question. You might notice you avoid examining the structure too closely, not from blind loyalty but from an accurate fear that your footing depends on not looking. That's a security borrowed entirely from somewhere else.`,
      },
      6: {
        heading: `Your Ground Depends on Which Relationship You're Standing In`,
        why: `Muladhara asks what makes you feel physically and materially safe — and the Lovers answer through connection: your sense of security shifts depending on who you're with and what's been chosen. This isn't instability so much as relational sensitivity — your ground is genuinely affected by your closest bonds, and choosing well matters more to your safety than it does for most people.`,
        shadow: `The risk is outsourcing your entire sense of security to whoever you're currently choosing, so an uncertain relationship produces an uncertain floor underneath you, regardless of your actual circumstances. You might notice your footing rises and falls with the state of one connection, even when the rest of your life is genuinely stable.`,
        path: `Try locating a piece of ground that holds regardless of your relational status — something in you that's secure whether or not the choosing is currently going well. You are allowed to be affected by your relationships without being entirely dependent on them for footing. What's solid in you on the days the connection feels uncertain?`,
        positive: `Your relationships still genuinely shape your sense of ground — that sensitivity is real and it's not a flaw — but you've built footing that holds even when a connection is uncertain. The relational weather still matters to you; it's stopped being the only thing determining whether you feel safe. You can be unsettled in love and still standing on something solid.`,
        negative: `Your entire sense of security rises and falls with your closest relationship's current state, so a single uncertain bond can make your whole life feel ungrounded, regardless of what else is actually stable. That's not weakness — it's a real relational sensitivity running with no independent floor underneath it, which leaves you at the mercy of one connection's daily temperature.`,
      },
      7: {
        heading: `Your Ground Is Momentum, and Stopping Feels Like Falling`,
        why: `Muladhara asks what makes you feel safe — and the Chariot answers with forward motion. You feel secure when you're moving toward something, actively steering your circumstances rather than sitting still inside them. That's a real, active form of groundedness — safety through directed effort — and it works, as long as you're going somewhere.`,
        shadow: `The risk is that stillness starts to feel like danger, because your security was never separated from your momentum. You might notice that stopping — even to rest, even when nothing is actually wrong — triggers a low-grade alarm, as though standing still means you're about to be run over by whatever you were successfully outrunning.`,
        path: `Try stopping the vehicle on purpose, for long enough to notice the ground is still there without the motion. You are allowed to be safe while stationary. What does your body actually feel, thirty seconds after you stop moving?`,
        positive: `You still feel most alive in motion — that hasn't changed and doesn't need to — but you've tested stillness deliberately enough to know the ground holds without the momentum. Stopping has stopped triggering alarm. You can pause the vehicle and notice, with something like relief, that nothing was actually chasing you.`,
        negative: `Your sense of safety is inseparable from forward motion, so stopping — even briefly, even safely — produces a felt sense of danger that has nothing to do with your actual circumstances. You might notice you keep moving mainly to avoid finding out what stillness feels like, which means the ground has never actually been tested.`,
      },
      8: {
        heading: `Your Ground Depends on Things Being Fair`,
        why: `Muladhara asks what lets you feel secure — and Justice answers through balance: you feel safe when things are equitable, when accounts are settled, when you haven't been wronged and haven't wronged anyone. That's a real form of groundedness, built on an internal sense of rightness rather than external comfort or connection.`,
        shadow: `The risk is that any unresolved unfairness — even small, even old — keeps a piece of the ground unsettled, so your security stays contingent on a tally that's rarely fully closed. You might notice you can't fully relax while something feels unbalanced, even when it has nothing to do with your present circumstances.`,
        path: `Try closing one account that will never be perfectly settled — releasing the need for fairness on something that's simply over. You are allowed to feel safe even where the ledger doesn't balance. What unresolved unfairness have you been letting unsettle your ground?`,
        positive: `Your need for fairness is still real and it still matters to you — that hasn't gone away — but you've released at least one account that was never going to balance, and the ground underneath it has settled anyway. You've found you can feel secure even holding some genuine unfairness, instead of needing every ledger closed first.`,
        negative: `Your sense of safety stays tied to an internal tally of fairness that's rarely fully settled, so even small unresolved imbalances keep a portion of your ground unsteady. You might notice a background restlessness that traces back to something that was never made right — not urgent, but present, quietly preventing full security.`,
      },
      9: {
        heading: `Your Ground Is Something You Find Alone, Away From Everyone`,
        why: `Muladhara asks what makes you feel secure — and the Hermit answers with solitude. Crowded, demanding environments genuinely destabilize you, while withdrawal restores your sense of footing. That's a real and valid form of groundedness — safety through distance rather than through connection — and it's not something you need to apologize for.`,
        shadow: `The risk is that the solitude that grounds you slowly becomes isolation that ungrounds you differently, cutting you off from support you'd genuinely benefit from. You might notice you withdraw at the first sign of instability, even in situations where staying connected to someone would actually help you find footing faster.`,
        path: `Try letting one person witness you while you're finding your ground, instead of only regrounding entirely alone. You are allowed to need solitude and still let someone stay nearby. Who could sit with you in the unsteady moment without it costing you the retreat you need?`,
        positive: `You still need real solitude to find your footing — that hasn't changed and doesn't need to — but you've let at least one person stay close during the unsteady stretch without it undoing the retreat. Your groundedness is still self-sourced; it's just no longer entirely walled off from anyone else's presence.`,
        negative: `Your security depends on withdrawal, and the isolation that grounds you is starting to cost you connections that could actually help. You might notice you disappear at the first sign of instability, even from people who wouldn't destabilize you further — which means the very thing that once restored your footing is now quietly narrowing your life.`,
      },
      10: {
        heading: `Your Ground Shifts With the Turning, and You Feel Every Rotation`,
        why: `Muladhara asks what makes you feel safe — and the Wheel answers honestly: nothing stays still, and your sense of security has to account for that. You're unusually attuned to cycles — rises, falls, the sense that circumstances are always in motion — which means your groundedness has to be built to survive change rather than depend on things staying the same.`,
        shadow: `The risk is that this awareness of constant change prevents you from ever settling into safety at all, since you know intellectually that any current stability is temporary. You might notice you can't fully relax into a good stretch, already bracing for the turn, which means even genuine security gets undermined by anticipation of its ending.`,
        path: `Try letting a stable period actually feel stable while it's happening, without pre-grieving its end. You are allowed to trust the ground under your feet today, regardless of what the wheel does tomorrow. What good, steady thing in your life right now deserves to be fully received instead of braced against?`,
        positive: `You're still deeply attuned to how circumstances turn and shift — that awareness hasn't dulled, and it's genuinely useful — but you've learned to let a stable stretch actually register as stable while it's happening, instead of pre-bracing for its end. The ground under you today gets to be trusted today, regardless of what the wheel does next.`,
        negative: `Your acute sense of how things turn keeps you from ever fully settling into safety, because you're always partially braced for the next rotation. You might notice that even genuinely good, stable periods don't produce real relief — you're too busy anticipating the change to actually stand on the ground that's currently there.`,
      },
      11: {
        heading: `Your Ground Holds Because You're Soft Enough Not to Break`,
        why: `Muladhara asks what lets you feel secure under pressure — and Strength answers with gentleness rather than force. Your groundedness comes from an inner steadiness that doesn't need to harden to survive difficulty. You bend without breaking, and that flexibility is a genuine, durable form of safety, even though it doesn't look like the rigid kind most people associate with security.`,
        shadow: `The risk is that this gentle steadiness gets mistaken — by you and by others — for fragility, so you end up absorbing more pressure than you should simply because your calm makes the load look manageable. You might notice people lean on you precisely because you don't visibly buckle, without anyone checking what that's actually costing you.`,
        path: `Try naming your limit before you're forced to find it. Your softness is real strength — it doesn't need to prove that by absorbing everything indefinitely. You are allowed to say this is enough. What load has your calm made look lighter than it actually is?`,
        positive: `Your gentle steadiness under pressure is still fully intact — that's a genuine strength, not a performance — and now it comes with a limit you're willing to name before you're overloaded. People still lean on your calm; you've just stopped letting that calm absorb more than it should. The ground holds because you protect it, not just because you can withstand anything.`,
        negative: `Your steadiness under pressure gets read by everyone, including you, as bottomless capacity, so the load keeps growing precisely because you never visibly buckle. You might notice you're carrying more than your actual limit because your calm has never announced where that limit is — which means the ground holds for now, but the cost is invisible and accumulating.`,
      },
      12: {
        heading: `Your Ground Comes From Surrendering the Need to Control It`,
        why: `Muladhara asks what makes you feel safe — and the Hanged Man answers through release rather than grip. Your security deepens precisely when you stop trying to force your circumstances into a particular shape and let them be what they are. That's a genuinely counterintuitive but real form of groundedness: safety found in suspension, not in control.`,
        shadow: `The risk is that this capacity for surrender tips into passivity, where you stop acting on things that are actually within your control because you've generalized "let go" into "do nothing." You might notice you've stayed too long in situations that needed your intervention, mistaking the wisdom of release for a reason not to act.`,
        path: `Try naming one thing in your current situation that's actually yours to change, and act on it, while genuinely releasing the rest. You are allowed to surrender some things and still move on others. What have you been passively enduring that was actually within your reach to shift?`,
        positive: `Your capacity to release control and find safety in surrender is still real and still valuable — but you've paired it with the willingness to act where action is actually available to you. You're no longer confusing letting go of the ungovernable with doing nothing about the governable. Both capacities are working now, instead of one crowding out the other.`,
        negative: `Your instinct to release control has generalized into a broader passivity, so situations that genuinely needed your intervention get endured instead, filed under surrender. You might notice you've mistaken staying still for wisdom in circumstances that were actually asking you to move — which leaves you technically at peace and practically stuck.`,
      },
      13: {
        heading: `Your Ground Rebuilds Itself, Which Means It Also Has to Fall First`,
        why: `Muladhara asks what makes you feel secure — and Transformation answers through cycles of ending and rebuilding. Your sense of safety isn't static; it's renewed through periodic collapse and reconstruction, and you've likely already proven you can survive the fall and rebuild something real. That's a hard-won, genuine form of groundedness — resilience through actual practice, not theory.`,
        shadow: `The risk is that you start expecting collapse as the price of any real security, so you can't fully trust a stable period to simply continue — some part of you is waiting for the next necessary ending. You might notice you unconsciously destabilize things that are actually working, because stability without an eventual fall feels unfamiliar rather than safe.`,
        path: `Try letting one stable thing stay stable, without testing it or waiting for its collapse. You are allowed to have ground that doesn't need to fall and rebuild to prove it's real. What's currently working in your life that you could simply let keep working?`,
        positive: `Your capacity to rebuild after real collapse is still hard-won and real — that resilience isn't going anywhere — but you've let at least one stable thing simply stay stable, without testing it or bracing for its inevitable fall. You've found that ground doesn't have to break to prove it's genuine. Some of it just holds.`,
        negative: `Your groundedness has been built entirely through cycles of collapse and rebuild, so a stretch of uninterrupted stability feels foreign rather than safe — like something's missing, or overdue. You might notice you unconsciously test or unsettle things that are actually going fine, because stability without an eventual fall doesn't register as real to you yet.`,
      },
      14: {
        heading: `Your Ground Is Balance, Held Steady Between Extremes`,
        why: `Muladhara asks what makes you feel safe — and Temperance answers through moderation: a life kept in equilibrium, nothing pushed to its extreme. That balance genuinely grounds you, and you're skilled at the ongoing calibration it requires — adjusting continuously rather than settling into a fixed position and hoping it holds.`,
        shadow: `The risk is that the constant calibrating never actually resolves into rest, because equilibrium requires ongoing attention rather than a state you can simply arrive at and stop monitoring. You might notice you can't fully relax even when things are balanced, since maintaining that balance still feels like active work.`,
        path: `Try trusting one area of balance to hold without your continued adjustment. You are allowed to let equilibrium simply be, instead of perpetually maintaining it. What in your life has been steady long enough that it might not need your constant calibration anymore?`,
        positive: `You still find real security in a well-balanced life — that skill for calibration hasn't gone anywhere — but you've let at least one area of equilibrium hold without your constant active maintenance. Balance has started to feel like a state you can rest inside, not only a project you're perpetually running.`,
        negative: `Your groundedness depends on continuous calibration, which means genuine rest is hard to access — even a balanced life requires active maintenance in your experience, so the vigilance never actually stops. You might notice you can't trust equilibrium to hold on its own, which turns your search for balance into a form of permanent low-grade work.`,
      },
      15: {
        heading: `Your Ground Gets Complicated by What You're Not Supposed to Want`,
        why: `Muladhara asks what makes you feel secure — and the Devil answers honestly: something about desire, dependency, or a pattern you can't fully disown complicates your sense of safety. Your security is tangled with appetites or attachments you may judge yourself for, which makes groundedness harder to access cleanly, but the wanting itself isn't the problem.`,
        shadow: `The risk is that hiding the tangled desire from yourself or others keeps it running the show from underneath, since concealment is what actually maintains a bind, not the appetite itself. You might notice your sense of safety depends on nobody finding out about the thing you want or the pattern you're caught in, which means the ground is always partly false.`,
        path: `Try naming, to yourself first, what you actually want without judging it. You are allowed to have appetites that don't match your self-image. What have you never said out loud about what genuinely secures or destabilizes you?`,
        positive: `Whatever complicated your sense of ground is no longer hidden — you've named it, at least to yourself — and that honesty has done more for your actual safety than concealment ever did. The desire or dependency may still be there in some form, but it's stopped running things from underneath, because it's no longer secret.`,
        negative: `Your sense of safety stays tangled with something you're actively concealing, which means the ground is only ever partly real — built on the condition that this particular truth stays hidden. That concealment, not the underlying want itself, is what keeps the bind in place and keeps your groundedness feeling provisional.`,
      },
      16: {
        heading: `Your Ground Was Rebuilt After Something Fell Without Warning`,
        why: `Muladhara asks what makes you feel secure — and the Tower answers from experience: something collapsed suddenly, and whatever safety you have now was built in the aftermath. That history is real, and the ground you've reconstructed since is genuinely yours, even though it carries the memory of how fast solid-seeming things can go.`,
        shadow: `The risk is staying braced for the next collapse indefinitely, so genuine current stability never gets to register as safe — you're too busy scanning for the next sudden failure to actually stand on the ground you've already rebuilt. You might notice you can't fully trust anything that hasn't already been tested by falling apart once.`,
        path: `Try letting the rebuilt ground be trusted without waiting for it to be tested again. You are allowed to believe something is stable before it proves it by breaking. What have you rebuilt that deserves to be trusted now, on its own terms?`,
        positive: `You've rebuilt real ground after real collapse — that history is still part of you — but you've stopped needing the new stability to be tested by falling apart again before you'll trust it. You can register current safety as safety, instead of perpetually scanning for the next sudden failure.`,
        negative: `You're still braced for a collapse that already happened, which means current stability struggles to register as real safety — some part of you is always scanning for the next sudden failure. You might notice you can't relax into anything that hasn't already proven itself by surviving a fall, which keeps you defended against a threat that isn't currently present.`,
      },
      17: {
        heading: `Your Ground Is Hope, Kept Modest to Protect It`,
        why: `Muladhara asks what makes you feel secure — and the Star answers through hope: a quiet, guarded trust that things will be okay. That hope genuinely grounds you, though you likely keep it deliberately small, protecting it from disappointment by never letting it get too big or too loud.`,
        shadow: `The risk is that the guardedness meant to protect your hope quietly shrinks your actual sense of safety, since a hope kept modest enough to survive disappointment is also too modest to fully ground you. You might notice your security feels thinner than your circumstances would justify, because you've pre-limited how much you're willing to trust things will be okay.`,
        path: `Try letting your hope be fully sized once, at least privately, without the protective downgrade. You are allowed to trust things will be okay at full volume. What would your sense of safety look like if you stopped bracing your own hope against disappointment?`,
        positive: `Your hope is still genuinely what grounds you — that hasn't changed — but you've let it be fully sized instead of pre-shrunk to protect against disappointment. Your sense of safety has more substance now, because the hope underneath it is no longer deliberately kept small.`,
        negative: `Your groundedness depends on hope you've kept carefully modest, protecting it from the pain of disappointment by never letting it get large enough to fully secure you. You might notice your sense of safety feels thinner than it should, because you've pre-limited how much you're willing to trust that things will actually be okay.`,
      },
      18: {
        heading: `Your Ground Is Foggy, and the Unease Doesn't Always Have a Clear Source`,
        why: `Muladhara asks what makes you feel secure — and the Moon answers honestly: the ground is genuinely harder to see clearly for you, and unease can arrive without an obvious cause. That's not a flaw in your perception; it's a real sensitivity to what's beneath the surface, even when you can't yet name what you're picking up on.`,
        shadow: `The risk is that unnamed unease gets treated as fact rather than signal, so diffuse anxiety about your safety accumulates without ever being sorted into what's actually yours versus what's simply atmosphere you've absorbed. You might notice your sense of insecurity doesn't clearly attach to your real circumstances, which makes it hard to address directly.`,
        path: `Try tracing one recurring unease back as far as you can, even speculatively, to find out whether it's actually about your present life. You are allowed to set down a fear that turns out not to be currently yours. What insecurity have you been carrying that might not match your actual circumstances anymore?`,
        positive: `The fog hasn't fully lifted — some ground will probably always be harder for you to see clearly than for others — but you've traced at least one recurring unease back to its actual source, and sorted what's genuinely yours from what you'd simply absorbed. Your sense of safety is less haunted by unnamed dread than it used to be.`,
        negative: `Unease about your safety keeps arriving without a clear source, and because it's never been traced or sorted, it accumulates as a general sense of insecurity that doesn't match your actual circumstances. You might notice you can't tell whether a given worry is real signal or absorbed atmosphere, which leaves your ground perpetually foggier than it needs to be.`,
      },
      19: {
        heading: `Your Ground Is Warmth, and It's Held Up Even When Things Were Hard`,
        why: `Muladhara asks what makes you feel secure — and the Sun answers with resilient vitality: a warmth and basic trust in things working out that has survived real difficulty intact. That's genuine, hard groundedness, not naivety — you've likely been tested and the warmth held anyway.`,
        shadow: `The risk is that the warmth becomes an obligation rather than an expression, so you stay visibly bright through genuine difficulty instead of letting hardship be acknowledged directly. You might notice you perform security even in moments that would reasonably call for admitting things are hard, because staying warm has become the requirement rather than the choice.`,
        path: `Try letting a real difficulty be named plainly, without the immediate pivot to staying positive. You are allowed to trust that your warmth survives honesty about what's actually hard. Where could you tell the truth about a hard thing without losing the groundedness underneath it?`,
        positive: `Your resilient warmth is still real, and it's still yours — but you've let at least one genuine difficulty be named plainly instead of immediately smoothed over with brightness. The security underneath your warmth has proven it can survive honesty, which means the warmth itself finally gets to be a choice again, not an obligation.`,
        negative: `Your warmth has become something you maintain even through genuine difficulty, which means real hardship gets smoothed over rather than acknowledged. You might notice you perform security in moments that would reasonably call for admitting things are hard — not from dishonesty, but from a fear that the warmth itself is conditional on staying visibly bright.`,
      },
      20: {
        heading: `Your Ground Is Waiting on an Answer You Already Know`,
        why: `Muladhara asks what makes you feel secure — and Judgement answers with a summons you haven't fully responded to yet. Some part of your instability traces back to a call you've sensed but not answered, and your ground will settle more completely once you do. This isn't vague — you likely know exactly what the unanswered thing is.`,
        shadow: `The risk is treating the postponement as neutral, so the low background insecurity it produces gets attributed to everything except its actual source. You might notice a persistent sense that something is unresolved, without connecting it to the specific summons you've been putting off.`,
        path: `Try taking one real step toward the thing you already know you're meant to answer. You are allowed to act on the call before you feel fully ready. What have you sensed you're meant to do that you haven't moved on yet?`,
        positive: `You've taken a real step toward the call you'd been sensing, and your ground has settled measurably because of it — not because everything is resolved, but because you're finally moving instead of postponing. The background insecurity that traced back to the unanswered summons has quieted considerably.`,
        negative: `Some of your instability traces back to a call you've sensed clearly and haven't yet answered, and the postponement is producing a low background insecurity that gets misattributed to other things. You might notice a persistent sense that something is unresolved, without quite connecting it to the specific thing you already know you're meant to do.`,
      },
      21: {
        heading: `Your Ground Is Whole When You Can See the Full Shape of Your Life`,
        why: `Muladhara asks what makes you feel secure — and the World answers through integration: you feel safe when the pieces of your life connect into something coherent, when you can see the whole shape rather than disconnected fragments. That wholeness genuinely grounds you, and it's earned through the work of actually integrating your experiences, not simply accumulating them.`,
        shadow: `The risk is that incompleteness anywhere makes the whole feel unstable, so one unfinished or disconnected piece of your life can undermine a sense of security that's otherwise well-earned. You might notice you can't feel fully safe while any part of your life still feels fragmented, even when the rest is genuinely whole.`,
        path: `Try letting the whole be whole enough, even with one piece still unfinished. You are allowed to feel grounded in a life that isn't perfectly integrated yet. What incomplete piece have you been letting undermine a security that's otherwise real?`,
        positive: `Your sense of groundedness through integration and wholeness is still real and earned — but you've let the whole be whole enough, even with a piece or two still unfinished. One incomplete area no longer has the power to undermine a security that's genuinely present everywhere else.`,
        negative: `Your security depends on the pieces of your life feeling fully integrated, so one unfinished or disconnected piece can destabilize a sense of safety that's otherwise well-earned. You might notice you can't access full groundedness while any part still feels fragmented, even when the majority of your life is genuinely coherent.`,
      },
      22: {
        heading: `Your Ground Is Trust in the Leap Itself`,
        why: `Muladhara asks what makes you feel secure — and the Fool answers counterintuitively: safety comes from trusting the leap, not from certainty beforehand. Your groundedness is built on faith that you'll land able to handle whatever's there, which is a real and durable form of security, even though it looks like recklessness from outside.`,
        shadow: `The risk is that this trust in leaping gets used to avoid the slower work of building anything that actually holds still, so your life stays perpetually in motion with nothing solid accumulating underneath the momentum. You might notice you leap again before finding out what the last landing actually offered.`,
        path: `Try staying in one landing long enough to find out what it actually is, before leaping again. You are allowed to trust the next leap and also let this one settle first. What landing have you left too quickly to discover what was actually there?`,
        positive: `Your trust in the leap is still fully real — that's not changing, and it doesn't need to — but you've started staying in a landing long enough to find out what it actually offers before moving to the next one. Something is finally accumulating underneath the motion, instead of everything staying perpetually in flight.`,
        negative: `Your trust in leaping is genuine, and it's being used to avoid ever finding out what a landing actually holds, because you're already moving toward the next leap before the current one has settled. You might notice nothing solid has accumulated despite years of real courage, since courage alone doesn't build ground — staying occasionally does.`,
      },
    },

    swadhisthana: {
      1: {
        heading: `Your Pleasure Comes From Making Things Happen`,
        why: `Svadhisthana asks what actually delights you — and the Magician answers through creation itself: initiating, making, willing something into being. Your enjoyment is tied to agency, to the felt charge of starting something and watching it take form. That's a real, embodied form of pleasure, distinct from simply consuming or receiving.`,
        shadow: `The risk is that pleasure becomes contingent on constant creation, so stillness or receiving — rather than initiating — stops registering as enjoyable at all. You might notice you struggle to simply enjoy something you didn't make happen yourself, as though pleasure that isn't self-generated doesn't fully count.`,
        path: `Try receiving pleasure you didn't create — let something delight you that you had no hand in starting. You are allowed to enjoy what you didn't initiate. What have you been unable to simply enjoy because you weren't the one who made it happen?`,
        positive: `Your pleasure in creating and initiating is still fully alive — that hasn't changed — but you've let yourself genuinely enjoy things you didn't make happen too. Received pleasure counts now, not only self-generated pleasure, which means enjoyment shows up in more of your life than it used to.`,
        negative: `Your capacity for pleasure stays tied almost entirely to your own initiation, so anything you didn't personally create or start struggles to actually delight you. You might notice you're a poor recipient of pleasure that isn't your own doing, which narrows your access to enjoyment more than your actual capacity for it would suggest.`,
      },
      2: {
        heading: `Your Pleasure Lives in What You Sense, Not What You Can Prove`,
        why: `Svadhisthana asks what delights you — and the High Priestess answers through the intuitive and unseen: pleasure that comes from atmosphere, from a felt sense of depth, from what you perceive rather than what's stated outright. That's real sensual intelligence, even when it can't always be explained to someone else.`,
        shadow: `The risk is that this private, intuitive pleasure stays entirely unshared, so your enjoyment becomes a solitary experience even in company. You might notice you feel something delightful and simply hold it, rather than letting anyone else in on what you're actually sensing.`,
        path: `Try naming one thing you find pleasurable in the moment you feel it, out loud, to someone present. You are allowed to let your private sensing be witnessed. What delights you that you've never once said out loud while it was happening?`,
        positive: `Your pleasure still lives largely in the sensed and unspoken — that's real and it's not going anywhere — but you've started naming some of it out loud as it happens, letting people in on what you're actually enjoying. The delight has stopped being entirely solitary, even in company.`,
        negative: `Your capacity for intuitive, sensed pleasure is genuine, and it's staying completely private, so even the people close to you rarely know what's actually delighting you in a given moment. You might notice you enjoy things quietly and alone, even when you're not physically alone, because sharing the sensation has never become habit.`,
      },
      3: {
        heading: `Your Pleasure Is Abundant, and It's Meant to Include You`,
        why: `Svadhisthana asks what delights you — and the Empress answers generously: beauty, comfort, sensory richness, an appetite for enjoying life fully. That capacity for pleasure is real and considerable — you're built for delight — and the question is simply whether you let yourself actually receive as much of it as you're capable of feeling.`,
        shadow: `The risk is that this abundant capacity for pleasure gets directed almost entirely toward creating enjoyment for others, while your own sensory richness goes untended. You might notice you're skilled at making things pleasurable and comfortable for everyone around you, while your own appetite quietly goes underfed.`,
        path: `Try directing some of your considerable capacity for pleasure toward yourself specifically — the good meal, the comfort, the beauty, meant for no one but you. You are allowed to be as indulged as you indulge others. What pleasure have you been arranging for everyone but yourself?`,
        positive: `Your abundant capacity for pleasure is still fully real — that generosity toward the senses hasn't diminished — but you've started directing a real share of it toward yourself, not only toward everyone around you. Your own sensory richness is finally as tended as everyone else's.`,
        negative: `Your considerable capacity for pleasure stays directed almost entirely outward — making things beautiful and comfortable and enjoyable for others — while your own appetite for the same things goes quietly underfed. You might notice you'd struggle to name the last pleasure you arranged purely for yourself.`,
      },
      4: {
        heading: `Your Pleasure Comes From Things Being Under Control`,
        why: `Svadhisthana asks what delights you — and the Emperor answers through mastery: the satisfaction of order, of a plan executed well, of things being firmly in hand. That's a genuine form of pleasure — competence and control actually feel good to you, not merely useful — and there's nothing wrong with that being your primary register of enjoyment.`,
        shadow: `The risk is that pleasure requiring control means spontaneous, unplanned delight rarely gets access to you, since anything you haven't structured or mastered doesn't register as safe to enjoy. You might notice you struggle to simply enjoy something messy or unplanned, even when it would otherwise genuinely delight you.`,
        path: `Try letting one unstructured, unplanned moment be pleasurable without organizing it first. You are allowed to enjoy things you haven't put in order. What could you let yourself enjoy exactly as it is, without needing to manage it into shape first?`,
        positive: `Your pleasure in mastery and order is still real and still yours — that hasn't changed — but you've let at least one unplanned, unstructured moment be genuinely enjoyable without needing to organize it first. Spontaneous delight has started to reach you, not just the earned satisfaction of things under control.`,
        negative: `Your capacity for pleasure stays tied to control and mastery, so anything unplanned or messy struggles to register as enjoyable, even when it genuinely could be. You might notice you organize experiences before you can let yourself enjoy them, which filters out a whole category of spontaneous delight.`,
      },
      5: {
        heading: `Your Pleasure Is Sanctioned by Something Larger Than Your Own Wanting`,
        why: `Svadhisthana asks what delights you — and the Hierophant answers through what's sanctioned: pleasure that fits within a value system or tradition you trust. That's a real form of enjoyment — there's genuine delight in doing something you believe is right, not merely permitted — though it means your access to pleasure runs partly through approval.`,
        shadow: `The risk is that pleasure outside the sanctioned framework becomes hard to access at all, since your enjoyment has never been fully separated from whether it's approved. You might notice you check, even briefly, whether something is acceptable before you let yourself enjoy it, which delays or blocks pleasures that don't need permission.`,
        path: `Try enjoying one thing that falls outside your usual framework, without checking whether it's sanctioned first. You are allowed to want something your tradition hasn't explicitly approved. What pleasure have you been withholding from yourself because it didn't come pre-approved?`,
        positive: `Your pleasure in what's sanctioned and value-aligned is still genuine — that hasn't changed — but you've let yourself enjoy at least one thing that falls outside the usual framework, without needing pre-approval first. Your access to delight is a little wider now than what the tradition explicitly covers.`,
        negative: `Your capacity for pleasure stays tied to approval, so enjoyment outside your value framework is hard to access even when nothing about it is actually wrong. You might notice a reflexive check for acceptability before you let yourself want something, which quietly narrows what you're able to enjoy.`,
      },
      6: {
        heading: `Your Pleasure Depends on Who You're Sharing It With`,
        why: `Svadhisthana asks what delights you — and the Lovers answer through connection: pleasure that's genuinely relational, heightened or diminished by who you're with. That sensitivity is real — shared experience actually changes how much you enjoy something — and it's not a dependency so much as an honest feature of how you're built.`,
        shadow: `The risk is that pleasure becomes entirely unavailable alone, so solitary enjoyment atrophies from disuse while you wait for the right company to unlock delight that's actually available to you regardless. You might notice you postpone pleasures indefinitely because the person you'd want to share them with isn't currently around.`,
        path: `Try enjoying one thing alone, on purpose, without waiting for the right company. You are allowed to delight in something without another person present. What pleasure have you been postponing until you have someone to share it with?`,
        positive: `Your pleasure is still genuinely heightened by connection and shared experience — that's real and it's not changing — but you've let yourself enjoy some things alone too, instead of postponing them indefinitely for the right company. Solitary delight is available to you now, alongside the relational kind.`,
        negative: `Your capacity for pleasure stays almost entirely dependent on company, so solitary enjoyment gets postponed indefinitely, waiting for someone to share it with. You might notice a growing list of things you'd enjoy but haven't, simply because you were waiting for the right person to be present first.`,
      },
      7: {
        heading: `Your Pleasure Is in the Chase, Not Always the Arrival`,
        why: `Svadhisthana asks what delights you — and the Chariot answers through pursuit: the charge of moving toward something, the momentum of wanting and going after it. That's genuine pleasure, distinct from the satisfaction of having arrived — you're built to enjoy the reaching more than the resting.`,
        shadow: `The risk is that arrival itself starts to feel like a letdown, so you keep generating new pursuits rather than let yourself actually enjoy having gotten what you were chasing. You might notice satisfaction fades fast once you've achieved something, sending you straight back into pursuit of the next thing.`,
        path: `Try staying with one arrival long enough to actually enjoy it, before starting the next pursuit. You are allowed to rest in having gotten there. What have you achieved recently that you moved past before letting yourself enjoy it?`,
        positive: `Your pleasure in the chase is still real and vivid — that charge of pursuit hasn't dulled — but you've let yourself actually stay with an arrival long enough to enjoy it, instead of moving straight into the next pursuit. Having something has started to feel as good as wanting it.`,
        negative: `Your pleasure lives almost entirely in pursuit, so arrival tends to deflate fast, sending you back into the chase before you've let yourself enjoy what you actually got. You might notice a pattern of achieving things and feeling strangely little, because the satisfaction was never in the having.`,
      },
      8: {
        heading: `Your Pleasure Requires Things to Feel Fair First`,
        why: `Svadhisthana asks what delights you — and Justice answers through balance: pleasure that feels earned, proportionate, uncomplicated by guilt about whether you deserve it. When things feel fair, you can genuinely enjoy them — and when they don't, the enjoyment gets an asterisk on it.`,
        shadow: `The risk is that pleasure gets withheld pending a fairness audit that's rarely fully resolved, so even legitimate enjoyment carries a background question of whether you've truly earned it. You might notice you can't fully relax into something good without first mentally justifying that you deserve it.`,
        path: `Try enjoying one thing without first confirming you've earned it. You are allowed to take pleasure that hasn't passed a fairness check. What could you enjoy right now if you set down the question of whether you deserve it?`,
        positive: `Your sense that pleasure should feel fair and earned is still part of you — that hasn't disappeared — but you've let yourself enjoy at least one thing without first running the fairness audit. Some pleasure now arrives uncomplicated, without needing to prove itself deserved first.`,
        negative: `Your capacity for pleasure stays contingent on a background sense of having earned it, so even legitimate enjoyment carries a quiet audit of whether you actually deserve it. You might notice you can't fully relax into something good without first justifying it to yourself, which delays or dilutes pleasure that should be simple.`,
      },
      9: {
        heading: `Your Pleasure Is Quiet, and It Needs Room to Exist`,
        why: `Svadhisthana asks what delights you — and the Hermit answers through solitude: pleasure that's quiet, internal, undisturbed by other people's presence or expectations. That's a real and legitimate form of enjoyment — not everyone's pleasure needs an audience, and yours genuinely doesn't.`,
        shadow: `The risk is that this need for solitary pleasure tips into avoiding shared enjoyment altogether, so you miss out on delight that would actually be enhanced by company, not diminished by it. You might notice you default to solitary pleasure even in situations where shared enjoyment was genuinely available and would have been good.`,
        path: `Try letting one pleasure be shared, even briefly, without retreating from it. You are allowed to enjoy something with someone present, without it costing you the quiet you need. What pleasure have you been keeping solitary that could have included someone, this once?`,
        positive: `Your need for quiet, solitary pleasure is still real and still yours to protect — that hasn't changed — but you've let at least one enjoyment be shared instead of automatically retreating into solitude. You've found some delight is actually enhanced by company, not just tolerated.`,
        negative: `Your pleasure stays almost entirely solitary, and the retreat has generalized past what your actual need for quiet requires, so you miss out on shared delight that would have genuinely been good. You might notice you default to withdrawing even from enjoyable company, simply out of habit rather than actual preference.`,
      },
      10: {
        heading: `Your Pleasure Comes and Goes With the Turning`,
        why: `Svadhisthana asks what delights you — and the Wheel answers honestly: your capacity for pleasure isn't constant, it rises and falls with circumstance and cycle. That's not a flaw — it's an accurate read of how enjoyment actually moves for you, in seasons rather than a steady state.`,
        shadow: `The risk is that during a low turn, you conclude your capacity for pleasure itself is gone, rather than recognizing it as temporarily quiet. You might notice you stop reaching for enjoyment during down periods, treating the current low as permanent instead of cyclical.`,
        path: `Try reaching for one small pleasure during a low turn, even without expecting it to land the way it usually does. You are allowed to enjoy things modestly during the down cycles instead of waiting for the up ones. What small pleasure could you try even though it's not currently your season for it?`,
        positive: `Your capacity for pleasure still genuinely rises and falls with the turning — that rhythm hasn't changed — but you've learned to reach for small enjoyments even during the low stretches, instead of writing off pleasure entirely until the cycle turns back up. The down seasons feel less pleasure-less now.`,
        negative: `Your pleasure moves in real cycles, and during the low turns you tend to conclude the capacity itself is gone rather than simply quiet for now. You might notice you stop reaching for enjoyment during down periods, which extends the low stretch longer than the actual cycle would otherwise require.`,
      },
      11: {
        heading: `Your Pleasure Is Steady, Even Under Real Pressure`,
        why: `Svadhisthana asks what delights you — and Strength answers with resilience: a capacity to still find enjoyment even while under genuine strain. That's a real gift — not everyone can access pleasure during difficulty, and you generally can, which makes your enjoyment durable rather than fair-weather.`,
        shadow: `The risk is that this resilient capacity for pleasure gets used to mask how much strain you're actually under, since your ability to still enjoy things reads to others — and sometimes to you — as evidence everything is fine. You might notice you keep accessing small pleasures right through periods that genuinely need more direct attention.`,
        path: `Try letting the strain be acknowledged directly, alongside the pleasure, rather than the pleasure standing in for the acknowledgment. You are allowed to enjoy something and also admit things are hard. What difficulty has your steady capacity for pleasure been quietly covering for?`,
        positive: `Your resilient capacity for pleasure under pressure is still real and still valuable — that hasn't changed — but you've started naming the underlying strain directly instead of letting your steady enjoyment stand in for that acknowledgment. The pleasure is honest now, not a cover.`,
        negative: `Your capacity to find pleasure even under real strain is genuine, and it's being read — by you and by others — as evidence that everything is actually fine, when it isn't. You might notice you keep accessing small enjoyments right through a period that needs more direct attention than the pleasure alone provides.`,
      },
      12: {
        heading: `Your Pleasure Requires Slowing All the Way Down`,
        why: `Svadhisthana asks what delights you — and the Hanged Man answers through suspension: pleasure that only arrives once you've genuinely stopped rushing, once you've let yourself be still enough to actually feel it. That's a real requirement for you, not a preference — your enjoyment doesn't survive being hurried.`,
        shadow: `The risk is that a life kept in constant motion never actually slows down enough to let pleasure land, so you end up moving through potentially enjoyable moments without ever fully arriving in them. You might notice you technically experience pleasurable things without registering them as pleasurable, because you never stopped moving long enough to feel it.`,
        path: `Try slowing down deliberately before one pleasurable moment, on purpose, so you're actually present for it. You are allowed to take the time your enjoyment requires. What pleasure have you been moving through too fast to actually feel?`,
        positive: `Your pleasure still genuinely requires slowing down to land — that hasn't changed and doesn't need to — but you've started deliberately pausing before enjoyable moments instead of rushing through them. You're actually present for your own pleasure now, more often than not.`,
        negative: `Your capacity for pleasure requires a stillness your life rarely provides, so potentially enjoyable moments pass through you without landing, because you never stopped moving long enough to feel them. You might notice you can list things that should have been pleasurable without being able to say you actually enjoyed them.`,
      },
      13: {
        heading: `Your Pleasure Renews Itself Through Real Change`,
        why: `Svadhisthana asks what delights you — and Transformation answers through reinvention: pleasure that comes from genuine change, from becoming someone slightly different than you were. Novelty and transformation actually delight you at a deep level, not just distract you — that's a real form of enjoyment tied to growth itself.`,
        shadow: `The risk is that stable, unchanging pleasures start to feel flat by comparison, so you keep seeking transformation even in areas of your life that were already working, simply because change itself is what registers as pleasurable to you. You might notice you disrupt things that were fine, chasing the specific delight of reinvention.`,
        path: `Try letting one stable pleasure stay exactly as it is, without needing to transform or refresh it. You are allowed to enjoy something unchanging. What's working well in your life that doesn't need reinventing to still delight you?`,
        positive: `Your pleasure in genuine transformation and reinvention is still real and still alive — that hasn't diminished — but you've let at least one stable, unchanging pleasure simply stay as it is, without needing to disrupt it for the sake of novelty. Steady enjoyment has become available alongside the transformative kind.`,
        negative: `Your capacity for pleasure stays tied to change and reinvention, so stable things that are genuinely working start to feel flat, tempting you to disrupt them simply to access the delight of transformation again. You might notice you've unsettled something that was fine, chasing a form of pleasure that didn't actually require it.`,
      },
      14: {
        heading: `Your Pleasure Is Found in the Blend, Not the Extreme`,
        why: `Svadhisthana asks what delights you — and Temperance answers through balance: pleasure found in moderation, in the well-mixed rather than the intense. That's a real and sustainable form of enjoyment — you're built to appreciate the calibrated experience over the overwhelming one, and that's not a limitation.`,
        shadow: `The risk is that this preference for moderation filters out pleasures that are genuinely intense but still good, simply because they don't fit the calibrated register you're comfortable with. You might notice you avoid or dial down experiences that could have delighted you specifically because of their intensity.`,
        path: `Try letting one intense pleasure be intense, without moderating it toward something calmer. You are allowed to enjoy something that isn't balanced or blended. What pleasure have you been diluting that might have been better at full strength?`,
        positive: `Your pleasure in the well-balanced and moderate is still real and still your natural register — that hasn't changed — but you've let at least one intense experience be intense, without automatically diluting it toward something calmer. You've found some pleasures are actually better at full strength.`,
        negative: `Your capacity for pleasure stays tied to moderation, so genuinely intense experiences get filtered out or dialed down before you can fully enjoy them. You might notice you moderate things reflexively, even when the intensity itself was what would have made something delightful.`,
      },
      15: {
        heading: `Your Pleasure Is Intense, and You May Judge Yourself for Wanting It`,
        why: `Svadhisthana asks what delights you — and the Devil answers honestly: intense, possibly taboo pleasure that you may not fully admit to wanting. Your capacity for enjoyment runs deep and strong, and the question isn't whether the wanting is acceptable — it's whether you can access it without shame running the whole transaction.`,
        shadow: `The risk is that shame about the intensity of your own wanting keeps the pleasure hidden, and concealment — not the desire itself — is what turns simple appetite into something that runs your life from underneath. You might notice you enjoy something and immediately manage how it looks, even to yourself.`,
        path: `Try naming one intense pleasure you want, without the accompanying judgment. You are allowed to want something strongly without it meaning something is wrong with you. What do you actually want that you've never said without an apology attached?`,
        positive: `Your capacity for intense pleasure is still exactly as strong as it's always been — that was never the problem — but you've stopped hiding it from yourself, which has taken most of the shame's power away. Wanting something strongly doesn't require an apology anymore.`,
        negative: `Your capacity for intense pleasure is genuine, and shame about wanting it keeps much of it hidden, which means the concealment — not the desire — is doing the real damage. You might notice you enjoy things while simultaneously managing how that enjoyment looks, even in private, even to yourself.`,
      },
      16: {
        heading: `Your Pleasure Was Interrupted, and You're Relearning How to Access It`,
        why: `Svadhisthana asks what delights you — and the Tower answers from disruption: something sudden once interrupted your relationship to pleasure, and you've been rebuilding your capacity for enjoyment since. That rebuilding is real and ongoing — you haven't lost the capacity, you're recovering access to it.`,
        shadow: `The risk is staying braced against pleasure itself, treating enjoyment as something that gets disrupted again if you let it get too big, so you keep your own delight small and contained as a precaution. You might notice you limit how much you enjoy something, as if pleasure itself invites its own interruption.`,
        path: `Try letting one pleasure be as big as it actually wants to be, without pre-limiting it. You are allowed to enjoy something fully again. What have you kept small out of a learned caution that pleasure gets taken away?`,
        positive: `You're still rebuilding your relationship to pleasure after a real disruption — that process is ongoing and that's fine — but you've let at least one enjoyment be as big as it actually wanted to be, without pre-limiting it as a precaution. Delight is starting to feel safe to fully feel again.`,
        negative: `Your relationship to pleasure was genuinely disrupted at some point, and you're still bracing against enjoyment getting too big, keeping delight small and contained as an unconscious precaution. You might notice you limit how much you let yourself enjoy something, as though full pleasure itself is what invites the next interruption.`,
      },
      17: {
        heading: `Your Pleasure Is Hopeful, Even When It's Modest`,
        why: `Svadhisthana asks what delights you — and the Star answers through hope: quiet, guarded pleasure in the possibility that things will be good. That hopeful register genuinely delights you, even when you keep it modest — there's real enjoyment in trusting that good things are still coming.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps the pleasure modest, so you experience a diluted version of an enjoyment that could actually be much fuller. You might notice you enjoy things at a lower intensity than you're capable of, because you've pre-limited the hope underneath the pleasure.`,
        path: `Try letting one hopeful pleasure be fully sized, without the protective downgrade. You are allowed to enjoy something at full hope, not just guarded hope. What pleasure have you been experiencing at a fraction of its actual size?`,
        positive: `Your hopeful, quiet pleasure in things possibly being good is still real and still yours — but you've let at least one enjoyment be fully sized instead of pre-guarded against disappointment. The pleasure has more range now, because the hope underneath it isn't automatically capped.`,
        negative: `Your pleasure stays tied to a hope you keep deliberately modest, which means the enjoyment itself comes through diluted — smaller than what you're actually capable of feeling. You might notice you experience good things at a fraction of their potential intensity, because the hope that would let them land fully has been pre-limited.`,
      },
      18: {
        heading: `Your Pleasure Is Real but Hard to Name Clearly`,
        why: `Svadhisthana asks what delights you — and the Moon answers honestly: your relationship to pleasure is genuine but often foggy, harder to name or predict than it is for most people. That's not a flaw in your capacity for enjoyment — it's an accurate reflection of how much of your pleasure lives below clear articulation.`,
        shadow: `The risk is that the fog around what actually delights you leaves you unable to reliably seek out pleasure, so enjoyment happens to you rather than being something you can deliberately pursue. You might notice you're often surprised by what turns out to please you, without being able to predict it in advance.`,
        path: `Try tracking one pleasure after it happens, naming specifically what about it worked. You are allowed to get clearer about your own enjoyment over time. What recently delighted you that you could try to name more precisely?`,
        positive: `Your relationship to pleasure is still genuinely harder to predict than most people's — that hasn't fully changed — but you've started naming what actually delights you after the fact, which has made your own enjoyment less foggy over time. You can seek out pleasure more deliberately now, not just receive it by surprise.`,
        negative: `Your capacity for pleasure is real, and the fog around what specifically delights you keeps you unable to reliably seek it out, so enjoyment mostly happens to you rather than being something you can pursue. You might notice you're consistently surprised by your own pleasure, without a clear enough sense of your own patterns to predict it.`,
      },
      19: {
        heading: `Your Pleasure Is Warm, Open, and Genuinely Easy to Access`,
        why: `Svadhisthana asks what delights you — and the Sun answers simply: pleasure comes easily and warmly to you, without much complication. That's a real gift — not everyone has straightforward access to enjoyment — and your delight tends to be visible, shared, and uncomplicated by guilt or hesitation.`,
        shadow: `The risk is that this easy access to pleasure makes it hard to sit with anything difficult, since your instinct is to move toward enjoyment rather than stay with discomfort that actually needs attention. You might notice you reach for pleasure to skip past a hard feeling rather than to simply enjoy something.`,
        path: `Try staying with one difficult feeling before reaching for the pleasure that would skip past it. You are allowed to feel something hard without immediately moving to enjoyment. What discomfort have you been bypassing with easy pleasure instead of actually sitting with it?`,
        positive: `Your easy, warm access to pleasure is still real and still a genuine gift — that hasn't changed — but you've learned to sit with difficulty sometimes before reaching for the enjoyment that would skip past it. Pleasure is still simple for you; it's just no longer your only strategy for handling something hard.`,
        negative: `Your easy access to pleasure is genuine, and it's being used to move past difficult feelings rather than actually sit with them, since enjoyment is so readily available to you that it doubles as an exit. You might notice you reach for something pleasurable specifically when a harder feeling shows up, before you've actually let yourself feel it.`,
      },
      20: {
        heading: `Your Pleasure Is Waiting on Permission You Haven't Given Yourself`,
        why: `Svadhisthana asks what delights you — and Judgement answers through an unanswered call: some pleasure you sense you're allowed to have is still waiting on your own permission. This isn't about external barriers — it's an internal summons toward enjoyment you haven't yet said yes to.`,
        shadow: `The risk is that the postponement of this permission produces a low-grade sense that pleasure is somewhere just out of reach, without the reach actually being blocked by anything external. You might notice you can name a pleasure you're waiting to allow yourself, without quite knowing why you haven't yet.`,
        path: `Try giving yourself the specific permission you've been withholding, for the pleasure you already know you're waiting on. You are allowed to say yes to this now. What enjoyment have you been sensing is available to you, without yet letting yourself have it?`,
        positive: `You've given yourself the permission you'd been withholding, and the pleasure that was waiting on it is now genuinely available — not because anything external changed, but because you said yes to yourself. That specific enjoyment has stopped feeling just out of reach.`,
        negative: `Some pleasure you're genuinely allowed to have is still waiting on a permission you haven't given yourself, which produces a low background sense that enjoyment is just out of reach for no clear external reason. You might notice you can name the pleasure you're withholding, without quite understanding what's stopping you from simply allowing it.`,
      },
      21: {
        heading: `Your Pleasure Comes From Feeling Whole, Not From Any Single Thing`,
        why: `Svadhisthana asks what delights you — and the World answers through integration: pleasure that comes from a sense of everything fitting together, rather than from any one isolated enjoyment. That's a real and mature form of delight — satisfaction rooted in coherence rather than in individual pleasurable moments.`,
        shadow: `The risk is that this need for wholeness before pleasure can register means isolated, smaller enjoyments get dismissed as insufficient, so you miss out on real delight simply because it didn't arrive as part of a bigger integrated picture. You might notice you undervalue small pleasures that don't connect to anything larger.`,
        path: `Try enjoying one small, isolated pleasure fully, without needing it to connect to the bigger picture. You are allowed to delight in something that isn't part of a larger wholeness. What small pleasure have you been dismissing because it felt too minor or disconnected to count?`,
        positive: `Your pleasure in wholeness and integration is still real and still a mature form of satisfaction — that hasn't changed — but you've let yourself enjoy small, isolated pleasures too, without needing them to connect to a larger picture first. Minor delights count now, not just the integrated kind.`,
        negative: `Your capacity for pleasure stays tied to a sense of things fitting together as a whole, so isolated smaller enjoyments get dismissed as insufficient, even when they're genuinely pleasurable on their own terms. You might notice you undervalue delight that doesn't connect to something larger, missing real pleasure simply because it arrived alone.`,
      },
      22: {
        heading: `Your Pleasure Is Found in Not Knowing What Happens Next`,
        why: `Svadhisthana asks what delights you — and the Fool answers through openness: pleasure found in the unplanned, the spontaneous, the genuinely uncertain. That's a real form of enjoyment — the not-knowing itself delights you, rather than being something you tolerate on the way to a known outcome.`,
        shadow: `The risk is that this pleasure in uncertainty avoids the different, quieter pleasure of things that are settled and known, so anything predictable or planned starts to feel like it's missing the point. You might notice you undervalue the pleasure available in stability, chasing novelty even when something settled would genuinely delight you too.`,
        path: `Try enjoying one thing precisely because it's known and settled, without needing the uncertainty for it to count as pleasurable. You are allowed to delight in the predictable. What settled, known pleasure have you been underrating in favor of the next uncertain one?`,
        positive: `Your pleasure in openness and uncertainty is still real and still genuinely delightful to you — that hasn't changed — but you've let yourself enjoy at least one settled, predictable thing too, without needing the not-knowing for it to count. Stability has its own pleasure now, alongside the spontaneous kind.`,
        negative: `Your capacity for pleasure stays tied to uncertainty and the unplanned, so settled, predictable enjoyments start to feel like they're missing something, even when they're genuinely good. You might notice you chase novelty past the point it's actually serving you, underrating the quieter pleasure that stability offers.`,
      },
    },

  };

  function get(key) {
    return chakras[key] || null;
  }

  function getForArcana(key, arcanaNum) {
    const group = nodes[key];
    if (!group) return null;
    return group[Number(arcanaNum)] || null;
  }

  return { get, getForArcana };

})();
