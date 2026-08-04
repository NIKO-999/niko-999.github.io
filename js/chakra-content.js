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
 * (7 chakras x 22 arcana = 154 positional readings) exists separately below
 * as `nodes`, still in the legacy heading/why/shadow/path/positive/negative
 * voice — not yet converted to Open/Blocked/Invitation (queued alongside the
 * larger Arcana nodes[] rewrite in js/micro-content.js, not done here).
 *
 * This chakra-level tier (`chakras`, below) uses the Open/Blocked/Invitation
 * voice: `open` = the centre at its best, standalone; `blocked` = the same
 * centre's energy stuck or distorted, standalone (not a "but" continuation of
 * `open`); `invitation` = one concrete, doable practice for that centre.
 *
 * The three aspects, per the guide's "Classical Calculation":
 *   Physical  — the horizontal (earth line) value. How the centre shows up in
 *               the body and in material circumstance.
 *   Energy    — the vertical (sky line) value. How it runs as available force.
 *   Emotional — reduce(Physical + Energy). How it is actually felt.
 *
 * API:
 *   DChakraContent.get(key)   // 'muladhara' | 'swadhisthana' | ...
 *     → { where, governs, open, blocked, invitation, physical, energy, emotional } or null
 */

window.DChakraContent = (function () {

  const chakras = {

    sahasrara: {
      where: `At the crown of the head — the topmost point, where you meet whatever you understand to be larger than yourself.`,
      governs: `Spiritual connection, universal consciousness, and the sense of belonging to something beyond your own biography.`,
      open: `You hold a sense of connection that doesn't depend on belief being tidy. You feel part of something instead of adrift in it, and that produces real quiet — not detachment, just the absence of arguing with yourself about whether your life means anything.`,
      blocked: `You postpone meaning until the practical stuff is handled, so it never actually arrives. Connection feels like effortful work against your own scepticism, and you need proof before you'll let yourself feel part of anything.`,
      invitation: `Sit with one moment today where nothing needs justifying. Let it just be enough.`,
      physical: `How your sense of meaning shows up in ordinary material life — whether purpose is something you live inside or something you postpone until the practical parts are handled.`,
      energy: `How readily connection is actually available to you: whether reaching for something larger feels natural, or like effortful work against your own scepticism.`,
      emotional: `What that meeting actually feels like day to day — the felt experience of being connected, or of reaching and not quite arriving.`,
    },

    ajna: {
      where: `Between the eyebrows, at the centre of the forehead.`,
      governs: `Intuition, inner knowledge, mental clarity, and the imaginative faculty that lets you see what isn't in front of you yet.`,
      open: `You trust what you perceive before you can prove it, and you're usually right. Thinking feels clean instead of crowded, and you can hold an inner picture steady enough to actually work from.`,
      blocked: `You override your own read the moment someone else questions it. The signal arrives clearly, then gets buried under a need for outside confirmation before you'll act on it.`,
      invitation: `Next time you sense something is true before you can explain it, act on it once, in something small, before you talk yourself out of it.`,
      physical: `How your perception meets the concrete world — whether insight translates into decisions you actually act on, or stays a private commentary running alongside your life.`,
      energy: `The raw availability of intuition: how loudly the inner signal arrives, and how much interference sits between sensing something and knowing you sensed it.`,
      emotional: `How your own knowing feels to live with — clarifying and steadying, or unsettling in a way that makes you want to look away from it.`,
    },

    vishuddha: {
      where: `In the neck, around the throat and the thyroid.`,
      governs: `Communication, self-expression, creativity and honesty — the ability to make what's inside you legible to someone else.`,
      open: `What you mean and what you say are close to the same thing. You can say a hard truth without armoring it or dissolving into apology, and creative expression moves out instead of backing up.`,
      blocked: `You carry things you meant to say and never did. Speaking up costs more effort than it should, and being heard feels risky instead of safe.`,
      invitation: `Say the one thing you've been carrying, out loud, to the person it's actually for.`,
      physical: `How expression shows up in your actual life — the work you make, the conversations you have, whether your voice takes up real space in rooms that matter.`,
      energy: `How much expressive force is genuinely available: whether speaking comes easily or has to be pushed through resistance every time.`,
      emotional: `What expressing yourself costs or gives you emotionally — whether being heard feels safe, exposing, or something you've stopped expecting.`,
    },

    anahata: {
      where: `In the chest, at the centre of the heart.`,
      governs: `Love, compassion, empathy, attachment and emotional balance — your capacity to be connected to yourself and to other people at the same time.`,
      open: `Love moves in both directions without a toll being charged. You can be close to someone without losing your own outline, and kind to yourself with the same ease you extend outward.`,
      blocked: `You give care and rarely let yourself receive it, or you absorb other people's difficulty until it costs you your own outline. Either way, the exchange only runs one direction.`,
      invitation: `Let someone take care of you in one small way today. Don't deflect it.`,
      physical: `How connection shows up in your material life — the relationships you actually maintain, the people physically near you, whether care is something you give and receive or only administer.`,
      energy: `How much relational capacity is genuinely available to you: whether opening is something you can do, or something that costs more than you currently have.`,
      emotional: `What loving and being loved actually feels like from the inside — the felt temperature of your closest connections.`,
    },

    manipura: {
      where: `In the upper abdomen, just below the rib cage.`,
      governs: `Personal power, self-confidence, willpower, and your sense of yourself as someone who can act on the world.`,
      open: `You know your own strength without needing to test it against anyone. You can assert yourself without escalating, and yield without it feeling like losing, because your sense of self isn't riding on the outcome.`,
      blocked: `Every exchange feels like it's putting your worth on the line. You either force your way through or go quiet, because yielding feels like defeat and asserting feels like risk.`,
      invitation: `Make one decision today and follow through on it without needing anyone's approval first.`,
      physical: `How your will shows up in practice — what you actually initiate, finish and defend in the material world.`,
      energy: `The raw force available to you: how much drive you can call on, and whether it arrives when you need it or only under pressure.`,
      emotional: `How your own power feels to hold — steadying and clean, or tangled up with something that makes asserting yourself uncomfortable.`,
    },

    swadhisthana: {
      where: `In the lower abdomen, about two fingers below the navel.`,
      governs: `Creativity, sexuality, emotional balance, pleasure and the ordinary enjoyment of being alive.`,
      open: `Pleasure isn't something you have to earn first. Creativity moves without being forced, and desire reads as information, not a problem.`,
      blocked: `You need to justify enjoying anything before you'll let yourself have it. Creative energy backs up because it feels indulgent instead of natural.`,
      invitation: `Do one enjoyable thing today for no reason other than that it feels good.`,
      physical: `How pleasure and creativity show up in your actual life — what you make, what you enjoy, whether your body is somewhere you live or something you operate.`,
      energy: `How much creative and sensual force is genuinely available, and whether it flows or has to be unblocked each time.`,
      emotional: `What wanting things feels like for you — freeing, or complicated by something older than the wanting itself.`,
    },

    muladhara: {
      where: `At the very base of the spine, in the coccyx.`,
      governs: `Physical existence, security, survival, your basic needs and your roots — the ground everything else is built on.`,
      open: `You feel safe in a way you don't have to keep checking. There's real physical energy and endurance available, because the ground under you is actually steady.`,
      blocked: `You're braced for instability even when nothing's currently wrong. Safety feels like something to defend rather than something you already have.`,
      invitation: `Name one thing in your life that's actually stable right now. Let yourself believe it, just for today.`,
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
        title: `1 in Root Chakra — The Magician`,
        mastery: `Your security doesn't arrive as a gift from stable circumstances; it arrives as a byproduct of your own initiating force, the ground you build with your own hands under you. That's a real, demanding form of groundedness, and you're capable of adding at least one piece of it that holds without your continued output — savings you don't touch, a routine that runs itself, a relationship that holds you on your slow days. Stillness doesn't have to mean collapse. You can pause the momentum and notice the floor is actually still there.`,
        shadow: `The risk is a root system with no roots, safety that exists only while you're actively producing it, so the moment your momentum pauses, the ground feels like it's disappearing too. Underneath the compulsive need to always have a project moving is often a genuine fear that stillness means the floor drops out, not ambition. A quiet week doesn't feel peaceful, it feels precarious. It's a nervous system that's learned, accurately, that this particular ground disappears the moment you stop making it.`,
        invitation: `Ask yourself honestly what it would feel like to be safe for a week without producing anything. Build one piece of security that doesn't depend on your continued effort. Let it exist without checking on it. Notice that you're allowed to stand on ground you didn't just make.`,
      },
      2: {
        title: `2 in Root Chakra — The High Priestess`,
        mastery: `You sense whether ground is solid before you can point to why, and when you listen to that sense, it tends to be right. Your safety is real, built on a kind of knowing other people can't verify from outside, which makes it a private, sometimes lonely form of groundedness. You're capable of holding that instinct steady when someone else questions it, instead of abandoning it under pressure. Your groundedness can become something you stand on publicly, not just privately, once you start giving it words.`,
        shadow: `The risk is a security you can't defend out loud, so when someone challenges your sense of safety with logic or evidence you don't have on hand, you can be talked out of a groundedness that was actually accurate. You doubt your own settled feeling the moment someone else questions it, trading a correct private certainty for an anxious public uncertainty. The knowing was never the problem. The silence around it is.`,
        invitation: `Ask yourself what you know about your own safety that you've never said out loud. Name what your sense of safety is actually based on, even speculatively, so it can survive being questioned. Say it to someone, not just to yourself. Notice that trusting the felt sense before you can fully explain it doesn't make it less true.`,
      },
      3: {
        title: `3 in Root Chakra — The Empress`,
        mastery: `You root through what you can touch and taste and surround yourself with, good food, a comfortable space, people who are fed and warm because of you. That's a genuine, embodied form of security, built through nurturing rather than defended through vigilance. You're capable of including yourself as a recipient of that same care, not only its source. Your safety no longer has to depend on being needed once the nurturing runs in both directions.`,
        shadow: `The risk is grounding yourself entirely in what you provide for others, so your own safety quietly becomes contingent on being needed. If the nurturing stops being required, the ground can feel like it's going with it. Your own environment, your comfort, your rest, your fed and warm body, gets tended last, if at all. The security system runs almost entirely outward, leaving nothing in reserve for you.`,
        invitation: `Ask yourself what your own environment would look like if you tended it the way you tend everyone else's. Make your own comfort as non-negotiable as everyone else's, the good meal, the warm space, the tended body, meant for no one but you. Do it without it being in service of anyone else. Notice that you're allowed to be nurtured, not just nurturing.`,
      },
      4: {
        title: `4 in Root Chakra — The Emperor`,
        mastery: `You feel safe when things are organized and in control, and you're genuinely good at building the structures that create that stability, for yourself and for whoever depends on you. That's real, hard-won groundedness, built through governance rather than luck. You're capable of trusting a piece of your own structure to hold without checking on it constantly. The ground can stop being something you carry and become something you actually stand on.`,
        shadow: `The risk is a security that depends entirely on you continuing to hold the structure together, so the ground never actually gets to be underneath you, it's something you're perpetually carrying. Even genuinely stable circumstances don't register as safe, because some part of you can't stop monitoring for the moment the order requires your intervention. The structure is real. Your ability to trust it isn't.`,
        invitation: `Ask yourself what you've constructed that's actually solid enough to stand on without you watching it constantly. Trust one piece of your own structure to hold without checking on it. Let it run on its own for a real stretch of time. Notice that you're allowed to rest inside the order you built instead of only maintaining it.`,
      },
      5: {
        title: `5 in Root Chakra — The Hierophant`,
        mastery: `You feel secure when you know where you stand in relation to something established, and that groundedness is real, inherited from structures that have held other people before you. It's safety through membership rather than self-sufficiency. You're capable of locating a layer of ground that's actually yours, independent of the framework. Questioning the tradition doesn't have to threaten your footing, because your safety was never entirely the same thing as the institution's.`,
        shadow: `The risk is a security that collapses the moment the framework is questioned, because your ground was never separated from the institution itself. Doubting the tradition, even in small, reasonable ways, produces a disproportionate sense of unsafety, as though the structure and your own footing were the same thing rather than related but distinct. You avoid examining the structure too closely, not from blind loyalty but from an accurate fear that your footing depends on not looking. That avoidance is what actually keeps the ground on loan rather than owned.`,
        invitation: `Ask yourself what would still hold you up if the tradition let you down. Locate the ground that's actually yours, separate from the framework. Name it specifically, apart from the institution. Notice that you're allowed to belong to something and also have footing of your own.`,
      },
      6: {
        title: `6 in Root Chakra — The Lovers`,
        mastery: `Your sense of security shifts depending on who you're with and what's been chosen, a real relational sensitivity rather than instability. Your ground is genuinely affected by your closest bonds, and choosing well matters more to your safety than it does for most people. You're capable of building footing that holds even when a connection is uncertain. You can be unsettled in love and still be standing on something solid.`,
        shadow: `The risk is outsourcing your entire sense of security to whoever you're currently choosing, so an uncertain relationship produces an uncertain floor underneath you, regardless of your actual circumstances. Your footing rises and falls with the state of one connection, even when the rest of your life is genuinely stable. That's not weakness, it's a real relational sensitivity running with no independent floor underneath it. A single uncertain bond can make your whole life feel ungrounded, regardless of what else is actually stable.`,
        invitation: `Ask yourself what's solid in you on the days the connection feels uncertain. Locate a piece of ground that holds regardless of your relational status. Name it specifically, something secure whether or not the choosing is currently going well. Notice that you're allowed to be affected by your relationships without being entirely dependent on them for footing.`,
      },
      7: {
        title: `7 in Root Chakra — The Chariot`,
        mastery: `You feel secure when you're moving toward something, actively steering your circumstances rather than sitting still inside them. That's a real, active form of groundedness, safety through directed effort, and it works as long as you're going somewhere. You're capable of testing stillness deliberately enough to know the ground holds without the momentum. You can pause the vehicle and notice, with something like relief, that nothing was actually chasing you.`,
        shadow: `The risk is that stillness starts to feel like danger, because your security was never separated from your momentum. Stopping, even to rest, even when nothing is actually wrong, triggers a low-grade alarm, as though standing still means you're about to be run over by whatever you were successfully outrunning. You keep moving mainly to avoid finding out what stillness feels like. The ground has never actually been tested, so the alarm never gets a chance to prove itself wrong.`,
        invitation: `Ask yourself what your body actually feels thirty seconds after you stop moving. Stop the vehicle on purpose, for long enough to notice the ground is still there without the motion. Sit with it, even if it's uncomfortable at first. Notice that you're allowed to be safe while stationary.`,
      },
      8: {
        title: `8 in Root Chakra — Justice`,
        mastery: `You feel safe when things are equitable, when accounts are settled, when you haven't been wronged and haven't wronged anyone. That's a real form of groundedness, built on an internal sense of rightness rather than external comfort or connection. You're capable of releasing an account that will never be perfectly settled and letting the ground underneath it settle anyway. You can feel secure even holding some genuine unfairness, instead of needing every ledger closed first.`,
        shadow: `The risk is that any unresolved unfairness, even small, even old, keeps a piece of the ground unsettled, so your security stays contingent on a tally that's rarely fully closed. You can't fully relax while something feels unbalanced, even when it has nothing to do with your present circumstances. A background restlessness traces back to something that was never made right, not urgent, but present. It quietly prevents full security from ever actually arriving.`,
        invitation: `Ask yourself what unresolved unfairness you've been letting unsettle your ground. Close one account that will never be perfectly settled. Release the need for fairness on something that's simply over. Notice that you're allowed to feel safe even where the ledger doesn't balance.`,
      },
      9: {
        title: `9 in Root Chakra — The Hermit`,
        mastery: `Crowded, demanding environments genuinely destabilize you, while withdrawal restores your sense of footing. That's a real and valid form of groundedness, safety through distance rather than through connection, and it's not something you need to apologize for. You're capable of letting one person witness you while you're finding your ground, instead of only regrounding entirely alone. Your groundedness can stay self-sourced while no longer being entirely walled off from anyone else's presence.`,
        shadow: `Your security depends on withdrawal, and the isolation that grounds you is starting to cost you connections that could actually help. You disappear at the first sign of instability, even from people who wouldn't destabilize you further. The very thing that once restored your footing is now quietly narrowing your life. Underneath the retreat is often a fear that letting someone stay close during instability would undo the safety solitude currently provides.`,
        invitation: `Ask yourself who could sit with you in the unsteady moment without it costing you the retreat you need. Let one person witness you while you're finding your ground, instead of only regrounding entirely alone. Invite them in, even briefly. Notice that you're allowed to need solitude and still let someone stay nearby.`,
      },
      10: {
        title: `10 in Root Chakra — Wheel of Fortune`,
        mastery: `Nothing stays still, and your sense of security has to account for that. You're unusually attuned to cycles, rises, falls, the sense that circumstances are always in motion, which means your groundedness has to be built to survive change rather than depend on things staying the same. You're capable of letting a stable stretch actually register as stable while it's happening, instead of pre-bracing for its end. The ground under you today gets to be trusted today, regardless of what the wheel does next.`,
        shadow: `The risk is that this awareness of constant change prevents you from ever settling into safety at all, since you know intellectually that any current stability is temporary. You can't fully relax into a good stretch, already bracing for the turn, which means even genuine security gets undermined by anticipation of its ending. Genuinely good, stable periods don't produce real relief. You're too busy anticipating the change to actually stand on the ground that's currently there.`,
        invitation: `Ask yourself what good, steady thing in your life right now deserves to be fully received instead of braced against. Let a stable period actually feel stable while it's happening, without pre-grieving its end. Receive it fully, not partially. Notice that you're allowed to trust the ground under your feet today, regardless of what the wheel does tomorrow.`,
      },
      11: {
        title: `11 in Root Chakra — Strength`,
        mastery: `Your groundedness comes from an inner steadiness that doesn't need to harden to survive difficulty. You bend without breaking, and that flexibility is a genuine, durable form of safety, even though it doesn't look like the rigid kind most people associate with security. You're capable of naming your limit before you're forced to find it. The ground holds because you protect it, not just because you can withstand anything.`,
        shadow: `The risk is that this gentle steadiness gets mistaken, by you and by others, for fragility, so you end up absorbing more pressure than you should simply because your calm makes the load look manageable. People lean on you precisely because you don't visibly buckle, without anyone checking what that's actually costing you. You're carrying more than your actual limit because your calm has never announced where that limit is. The ground holds for now, but the cost is invisible and accumulating.`,
        invitation: `Ask yourself what load your calm has made look lighter than it actually is. Name your limit before you're forced to find it. Say it out loud, not just internally. Notice that your softness is real strength, and it doesn't need to prove that by absorbing everything indefinitely.`,
      },
      12: {
        title: `12 in Root Chakra — The Hanged Man`,
        mastery: `Your security deepens precisely when you stop trying to force your circumstances into a particular shape and let them be what they are. That's a genuinely counterintuitive but real form of groundedness, safety found in suspension, not in control. You're capable of naming what's actually yours to change and acting on it, while genuinely releasing the rest. Both capacities can work together, instead of one crowding out the other.`,
        shadow: `The risk is that this capacity for surrender tips into passivity, where you stop acting on things that are actually within your control because you've generalized "let go" into "do nothing." You've stayed too long in situations that needed your intervention, mistaking the wisdom of release for a reason not to act. Underneath the passivity is often a fear that acting would mean you never really trusted the surrender in the first place. That leaves you technically at peace and practically stuck.`,
        invitation: `Ask yourself what you've been passively enduring that was actually within your reach to shift. Name one thing in your current situation that's actually yours to change, and act on it. Release the rest genuinely, not resentfully. Notice that you're allowed to surrender some things and still move on others.`,
      },
      13: {
        title: `13 in Root Chakra — Transformation`,
        mastery: `Your sense of safety isn't static; it's renewed through periodic collapse and reconstruction, and you've likely already proven you can survive the fall and rebuild something real. That's a hard-won, genuine form of groundedness, resilience through actual practice, not theory. You're capable of letting one stable thing simply stay stable, without testing it or waiting for its collapse. Ground doesn't have to break to prove it's genuine.`,
        shadow: `Your groundedness has been built entirely through cycles of collapse and rebuild, so a stretch of uninterrupted stability feels foreign rather than safe, like something's missing, or overdue. You unconsciously test or unsettle things that are actually going fine. Stability without an eventual fall doesn't register as real to you yet. That sends you looking for the crack that isn't there instead of resting in what's actually solid.`,
        invitation: `Ask yourself what's currently working in your life that you could simply let keep working. Let one stable thing stay stable, without testing it or waiting for its collapse. Leave it alone this time. Notice that you're allowed to have ground that doesn't need to fall and rebuild to prove it's real.`,
      },
      14: {
        title: `14 in Root Chakra — Temperance`,
        mastery: `That balance genuinely grounds you, and you're skilled at the ongoing calibration it requires, adjusting continuously rather than settling into a fixed position and hoping it holds. Nothing in your life stays pushed to an extreme for long, because you catch and correct the drift early. You're capable of trusting one area of balance to hold without your continued adjustment. Balance can start to feel like a state you can rest inside, not only a project you're perpetually running.`,
        shadow: `The risk is that the constant calibrating never actually resolves into rest, because equilibrium requires ongoing attention rather than a state you can simply arrive at and stop monitoring. You can't fully relax even when things are balanced, since maintaining that balance still feels like active work. Underneath the vigilance is often a fear that stopping the calibration, even briefly, would let something tip too far. That turns your search for balance into a form of permanent low-grade work.`,
        invitation: `Ask yourself what in your life has been steady long enough that it might not need your constant calibration anymore. Trust one area of balance to hold without your continued adjustment. Let it be, instead of perpetually maintaining it. Notice that equilibrium doesn't require your active monitoring to keep holding.`,
      },
      15: {
        title: `15 in Root Chakra — The Devil`,
        mastery: `Your security is tangled with appetites or attachments you may judge yourself for, which makes groundedness harder to access cleanly, but the wanting itself isn't the problem. You're capable of naming, to yourself first, what you actually want without judging it. That honesty tends to do more for your actual safety than concealment ever did. The desire or dependency may still be there in some form, but it stops running things from underneath once it's no longer secret.`,
        shadow: `The risk is that hiding the tangled desire from yourself or others keeps it running the show from underneath, since concealment is what actually maintains a bind, not the appetite itself. Your sense of safety depends on nobody finding out about the thing you want or the pattern you're caught in, which means the ground is always partly false. That concealment, not the underlying want itself, is what keeps the bind in place. Underneath the hiding is often a fear that the wanting itself, seen clearly, would confirm something is genuinely wrong with you.`,
        invitation: `Ask yourself what you've never said out loud about what genuinely secures or destabilizes you. Name, to yourself first, what you actually want without judging it. Say it plainly, without the apology attached. Notice that you're allowed to have appetites that don't match your self-image.`,
      },
      16: {
        title: `16 in Root Chakra — The Tower`,
        mastery: `Something collapsed suddenly, and whatever safety you have now was built in the aftermath. That history is real, and the ground you've reconstructed since is genuinely yours, even though it carries the memory of how fast solid-seeming things can go. You're capable of letting the rebuilt ground be trusted without waiting for it to be tested again. You can register current safety as safety, instead of perpetually scanning for the next sudden failure.`,
        shadow: `The risk is staying braced for the next collapse indefinitely, so genuine current stability never gets to register as safe, you're too busy scanning for the next sudden failure to actually stand on the ground you've already rebuilt. You can't fully trust anything that hasn't already been tested by falling apart once. That keeps you defended against a threat that isn't currently present. Some part of you is always scanning for the next sudden failure, even when nothing points to one.`,
        invitation: `Ask yourself what you've rebuilt that deserves to be trusted now, on its own terms. Let the rebuilt ground be trusted without waiting for it to be tested again. Believe it's stable before it proves that by breaking. Notice that current safety doesn't need to survive a fall to count as real.`,
      },
      17: {
        title: `17 in Root Chakra — The Star`,
        mastery: `That hope genuinely grounds you, though you likely keep it deliberately small, protecting it from disappointment by never letting it get too big or too loud. It's a quiet, guarded trust that things will be okay, real even in its modest form. You're capable of letting your hope be fully sized, without the protective downgrade. Your sense of safety can have more substance once the hope underneath it is no longer deliberately kept small.`,
        shadow: `The risk is that the guardedness meant to protect your hope quietly shrinks your actual sense of safety, since a hope kept modest enough to survive disappointment is also too modest to fully ground you. Your security feels thinner than your circumstances would justify. That's because you've pre-limited how much you're willing to trust things will be okay. Underneath the shrinking is often a fear that a large, visible hope would be too exposed if it turned out disappointed.`,
        invitation: `Ask yourself what your sense of safety would look like if you stopped bracing your own hope against disappointment. Let your hope be fully sized once, at least privately, without the protective downgrade. Trust things will be okay at full volume. Notice that a fully sized hope survives disappointment as well as a small one does.`,
      },
      18: {
        title: `18 in Root Chakra — The Moon`,
        mastery: `The ground is genuinely harder to see clearly for you, and unease can arrive without an obvious cause. That's not a flaw in your perception; it's a real sensitivity to what's beneath the surface, even when you can't yet name what you're picking up on. You're capable of tracing a recurring unease back to its actual source and sorting what's genuinely yours from what you'd simply absorbed. Your sense of safety can be less haunted by unnamed dread than it used to be.`,
        shadow: `The risk is that unnamed unease gets treated as fact rather than signal, so diffuse anxiety about your safety accumulates without ever being sorted into what's actually yours versus what's simply atmosphere you've absorbed. Your sense of insecurity doesn't clearly attach to your real circumstances, which makes it hard to address directly. You can't tell whether a given worry is real signal or absorbed atmosphere. That leaves your ground perpetually foggier than it needs to be.`,
        invitation: `Ask yourself what insecurity you've been carrying that might not match your actual circumstances anymore. Trace one recurring unease back as far as you can, even speculatively. Find out whether it's actually about your present life. Notice that you're allowed to set down a fear that turns out not to be currently yours.`,
      },
      19: {
        title: `19 in Root Chakra — The Sun`,
        mastery: `A warmth and basic trust in things working out has survived real difficulty intact. That's genuine, hard groundedness, not naivety, you've likely been tested and the warmth held anyway. You're capable of letting a real difficulty be named plainly, without the immediate pivot to staying positive. The security underneath your warmth can survive honesty, which means the warmth gets to be a choice again, not an obligation.`,
        shadow: `The risk is that the warmth becomes an obligation rather than an expression, so you stay visibly bright through genuine difficulty instead of letting hardship be acknowledged directly. You perform security even in moments that would reasonably call for admitting things are hard, because staying warm has become the requirement rather than the choice. That's not dishonesty, it's a fear that the warmth itself is conditional on staying visibly bright. Real hardship gets smoothed over rather than acknowledged, again and again.`,
        invitation: `Ask yourself where you could tell the truth about a hard thing without losing the groundedness underneath it. Let a real difficulty be named plainly, without the immediate pivot to staying positive. Say it directly, without the silver lining attached. Notice that your warmth survives honesty about what's actually hard.`,
      },
      20: {
        title: `20 in Root Chakra — Judgement`,
        mastery: `Some part of your instability traces back to a call you've sensed but not answered, and your ground will settle more completely once you do. This isn't vague, you likely know exactly what the unanswered thing is. You're capable of taking one real step toward it before you feel fully ready. Your ground can settle measurably once you're finally moving instead of postponing.`,
        shadow: `The risk is treating the postponement as neutral, so the low background insecurity it produces gets attributed to everything except its actual source. A persistent sense that something is unresolved goes unconnected to the specific summons you've been putting off. That misattribution keeps the actual cause hidden from view. The insecurity keeps circling without ever landing on what it's actually about.`,
        invitation: `Ask yourself what you've sensed you're meant to do that you haven't moved on yet. Take one real step toward the thing you already know you're meant to answer. Move on it now, not once you feel fully ready. Notice that you're allowed to act on the call before certainty arrives.`,
      },
      21: {
        title: `21 in Root Chakra — The World`,
        mastery: `You feel safe when the pieces of your life connect into something coherent, when you can see the whole shape rather than disconnected fragments. That wholeness genuinely grounds you, and it's earned through the work of actually integrating your experiences, not simply accumulating them. You're capable of letting the whole be whole enough, even with one piece still unfinished. One incomplete area doesn't have to undermine a security that's genuinely present everywhere else.`,
        shadow: `The risk is that incompleteness anywhere makes the whole feel unstable, so one unfinished or disconnected piece of your life can undermine a sense of security that's otherwise well-earned. You can't feel fully safe while any part of your life still feels fragmented, even when the rest is genuinely whole. That leaves full groundedness contingent on total completion, which rarely arrives. You can't access full groundedness while any part still feels fragmented, even when the majority of your life is genuinely coherent.`,
        invitation: `Ask yourself what incomplete piece you've been letting undermine a security that's otherwise real. Let the whole be whole enough, even with one piece still unfinished. Set that piece aside deliberately, not as denial. Notice that you're allowed to feel grounded in a life that isn't perfectly integrated yet.`,
      },
      22: {
        title: `22 in Root Chakra — The Fool`,
        mastery: `Your groundedness is built on faith that you'll land able to handle whatever's there, which is a real and durable form of security, even though it looks like recklessness from outside. Safety comes from trusting the leap itself, not from certainty beforehand. You're capable of staying in one landing long enough to find out what it actually is, before leaping again. Something can finally accumulate underneath the motion, instead of everything staying perpetually in flight.`,
        shadow: `The risk is that this trust in leaping gets used to avoid the slower work of building anything that actually holds still, so your life stays perpetually in motion with nothing solid accumulating underneath the momentum. You leap again before finding out what the last landing actually offered. Nothing solid has accumulated despite years of real courage. Courage alone doesn't build ground, staying occasionally does.`,
        invitation: `Ask yourself what landing you've left too quickly to discover what was actually there. Stay in one landing long enough to find out what it actually is, before leaping again. Give it real time before moving on. Notice that you're allowed to trust the next leap and also let this one settle first.`,
      },
    },

    swadhisthana: {
      1: {
        title: `1 in Sacral Chakra — The Magician`,
        mastery: `Your enjoyment is tied to agency, to the felt charge of starting something and watching it take form. That's a real, embodied form of pleasure, distinct from simply consuming or receiving. You're capable of receiving pleasure you didn't create, letting something delight you that you had no hand in starting. Received pleasure can count now too, not only what you personally generate, which means enjoyment shows up in more of your life.`,
        shadow: `The risk is that pleasure becomes contingent on constant creation, so stillness or receiving, rather than initiating, stops registering as enjoyable at all. You struggle to simply enjoy something you didn't make happen yourself, as though pleasure that isn't self-generated doesn't fully count. Underneath that struggle is often a fear that receiving passively would mean you weren't actually in control of the good thing happening. You're a poor recipient of pleasure that isn't your own doing, which narrows your access to enjoyment more than your actual capacity for it would suggest.`,
        invitation: `Ask yourself what you've been unable to simply enjoy because you weren't the one who made it happen. Receive one piece of pleasure you didn't create today. Let something delight you that you had no hand in starting. Notice that you're allowed to enjoy what you didn't initiate.`,
      },
      2: {
        title: `2 in Sacral Chakra — The High Priestess`,
        mastery: `Your pleasure comes from atmosphere, from a felt sense of depth, from what you perceive rather than what's stated outright. That's real sensual intelligence, even when it can't always be explained to someone else. You're capable of naming what you find pleasurable in the moment you feel it, out loud, to someone present. The delight can stop being entirely solitary, even in company, once you let your private sensing be witnessed.`,
        shadow: `The risk is that this private, intuitive pleasure stays entirely unshared, so your enjoyment becomes a solitary experience even in company. You feel something delightful and simply hold it, rather than letting anyone else in on what you're actually sensing. Even the people close to you rarely know what's actually delighting you in a given moment. You enjoy things quietly and alone, even when you're not physically alone, because sharing the sensation has never become habit.`,
        invitation: `Ask yourself what delights you that you've never once said out loud while it was happening. Name one thing you find pleasurable in the moment you feel it, out loud, to someone present. Say it as it's happening, not after the fact. Notice that you're allowed to let your private sensing be witnessed.`,
      },
      3: {
        title: `3 in Sacral Chakra — The Empress`,
        mastery: `That capacity for pleasure is real and considerable, you're built for delight, and the question is simply whether you let yourself actually receive as much of it as you're capable of feeling. You're capable of directing some of that considerable capacity toward yourself specifically, the good meal, the comfort, the beauty, meant for no one but you. Your own sensory richness can be as tended as everyone else's. That's not a diminishment of your generosity toward others, it's an addition.`,
        shadow: `The risk is that this abundant capacity for pleasure gets directed almost entirely toward creating enjoyment for others, while your own sensory richness goes untended. You're skilled at making things pleasurable and comfortable for everyone around you, while your own appetite quietly goes underfed. You'd struggle to name the last pleasure you arranged purely for yourself. The considerable capacity stays directed almost entirely outward, leaving your own appetite for the same things quietly underfed.`,
        invitation: `Ask yourself what pleasure you've been arranging for everyone but yourself. Direct some of your considerable capacity for pleasure toward yourself specifically. Choose the good meal, the comfort, the beauty, meant for no one but you. Notice that you're allowed to be as indulged as you indulge others.`,
      },
      4: {
        title: `4 in Sacral Chakra — The Emperor`,
        mastery: `That's a genuine form of pleasure, competence and control actually feel good to you, not merely useful, and there's nothing wrong with that being your primary register of enjoyment. You're capable of letting one unstructured, unplanned moment be pleasurable without organizing it first. Spontaneous delight can start to reach you, not just the earned satisfaction of things under control. Both registers can coexist without either one crowding out the other.`,
        shadow: `The risk is that pleasure requiring control means spontaneous, unplanned delight rarely gets access to you, since anything you haven't structured or mastered doesn't register as safe to enjoy. You struggle to simply enjoy something messy or unplanned, even when it would otherwise genuinely delight you. You organize experiences before you can let yourself enjoy them, which filters out a whole category of spontaneous delight. Anything unplanned or messy struggles to register as enjoyable, even when it genuinely could be.`,
        invitation: `Ask yourself what you could let yourself enjoy exactly as it is, without needing to manage it into shape first. Let one unstructured, unplanned moment be pleasurable without organizing it first. Resist the urge to tidy it before you enjoy it. Notice that you're allowed to enjoy things you haven't put in order.`,
      },
      5: {
        title: `5 in Sacral Chakra — The Hierophant`,
        mastery: `There's genuine delight in doing something you believe is right, not merely permitted, though it means your access to pleasure runs partly through approval. You're capable of enjoying one thing that falls outside your usual framework, without checking whether it's sanctioned first. Your access to delight can be a little wider than what the tradition explicitly covers. That widening doesn't require abandoning the framework you actually trust.`,
        shadow: `The risk is that pleasure outside the sanctioned framework becomes hard to access at all, since your enjoyment has never been fully separated from whether it's approved. You check, even briefly, whether something is acceptable before you let yourself enjoy it, which delays or blocks pleasures that don't need permission. A reflexive check for acceptability quietly narrows what you're able to enjoy. Enjoyment outside your value framework is hard to access even when nothing about it is actually wrong.`,
        invitation: `Ask yourself what pleasure you've been withholding from yourself because it didn't come pre-approved. Enjoy one thing that falls outside your usual framework, without checking whether it's sanctioned first. Let yourself want it without the pre-approval. Notice that you're allowed to want something your tradition hasn't explicitly approved.`,
      },
      6: {
        title: `6 in Sacral Chakra — The Lovers`,
        mastery: `That sensitivity is real, shared experience actually changes how much you enjoy something, and it's not a dependency so much as an honest feature of how you're built. You're capable of enjoying one thing alone, on purpose, without waiting for the right company. Solitary delight can become available to you, alongside the relational kind. The relational weather still matters; it just stops being the only thing determining whether something's enjoyable.`,
        shadow: `The risk is that pleasure becomes entirely unavailable alone, so solitary enjoyment atrophies from disuse while you wait for the right company to unlock delight that's actually available to you regardless. You postpone pleasures indefinitely because the person you'd want to share them with isn't currently around. A growing list of things you'd enjoy but haven't accumulates, simply because you were waiting for the right person to be present first. Your capacity for pleasure stays almost entirely dependent on company.`,
        invitation: `Ask yourself what pleasure you've been postponing until you have someone to share it with. Enjoy one thing alone, on purpose, without waiting for the right company. Delight in it without another person present. Notice that you're allowed to delight in something on your own.`,
      },
      7: {
        title: `7 in Sacral Chakra — The Chariot`,
        mastery: `That's genuine pleasure, distinct from the satisfaction of having arrived, you're built to enjoy the reaching more than the resting. You're capable of staying with one arrival long enough to actually enjoy it, before starting the next pursuit. Having something can start to feel as good as wanting it. The charge of pursuit doesn't have to dull for arrival to also register as pleasurable.`,
        shadow: `The risk is that arrival itself starts to feel like a letdown, so you keep generating new pursuits rather than let yourself actually enjoy having gotten what you were chasing. Satisfaction fades fast once you've achieved something, sending you straight back into pursuit of the next thing. A pattern emerges of achieving things and feeling strangely little, because the satisfaction was never in the having. Your pleasure lives almost entirely in pursuit, so arrival tends to deflate fast.`,
        invitation: `Ask yourself what you've achieved recently that you moved past before letting yourself enjoy it. Stay with one arrival long enough to actually enjoy it, before starting the next pursuit. Rest in having gotten there, even briefly. Notice that you're allowed to rest in arrival, not just the chase.`,
      },
      8: {
        title: `8 in Sacral Chakra — Justice`,
        mastery: `When things feel fair, you can genuinely enjoy them, and when they don't, the enjoyment gets an asterisk on it. You're capable of enjoying one thing without first confirming you've earned it. Some pleasure can arrive uncomplicated now, without needing to prove itself deserved first. That sense of fairness doesn't have to disappear, it just doesn't need to gatekeep every pleasure.`,
        shadow: `The risk is that pleasure gets withheld pending a fairness audit that's rarely fully resolved, so even legitimate enjoyment carries a background question of whether you've truly earned it. You can't fully relax into something good without first mentally justifying that you deserve it. That delays or dilutes pleasure that should be simple. Your capacity for pleasure stays contingent on a background sense of having earned it, even when nothing about the situation actually calls that into question.`,
        invitation: `Ask yourself what you could enjoy right now if you set down the question of whether you deserve it. Enjoy one thing without first confirming you've earned it. Take the pleasure that hasn't passed a fairness check. Notice that you're allowed to take pleasure that hasn't passed a fairness check.`,
      },
      9: {
        title: `9 in Sacral Chakra — The Hermit`,
        mastery: `That's a real and legitimate form of enjoyment, not everyone's pleasure needs an audience, and yours genuinely doesn't. You're capable of letting one pleasure be shared, even briefly, without retreating from it. Some delight can actually be enhanced by company, not just tolerated. The quiet, solitary pleasure you protect doesn't have to be threatened by an occasional shared one.`,
        shadow: `The risk is that this need for solitary pleasure tips into avoiding shared enjoyment altogether, so you miss out on delight that would actually be enhanced by company, not diminished by it. You default to solitary pleasure even in situations where shared enjoyment was genuinely available and would have been good. You default to withdrawing even from enjoyable company, simply out of habit rather than actual preference. The retreat has generalized past what your actual need for quiet requires.`,
        invitation: `Ask yourself what pleasure you've been keeping solitary that could have included someone, this once. Let one pleasure be shared, even briefly, without retreating from it. Enjoy it with someone present, without it costing you the quiet you need. Notice that you're allowed to enjoy something with someone present.`,
      },
      10: {
        title: `10 in Sacral Chakra — Wheel of Fortune`,
        mastery: `That's not a flaw, it's an accurate read of how enjoyment actually moves for you, in seasons rather than a steady state. You're capable of reaching for one small pleasure during a low turn, even without expecting it to land the way it usually does. The down seasons can feel less pleasure-less once you learn to reach for small enjoyments even during the low stretches. That rhythm hasn't changed; you've just stopped writing off pleasure entirely until the cycle turns back up.`,
        shadow: `The risk is that during a low turn, you conclude your capacity for pleasure itself is gone, rather than recognizing it as temporarily quiet. You stop reaching for enjoyment during down periods, treating the current low as permanent instead of cyclical. That extends the low stretch longer than the actual cycle would otherwise require. Your pleasure moves in real cycles, and during the low turns you tend to conclude the capacity itself is gone rather than simply quiet for now.`,
        invitation: `Ask yourself what small pleasure you could try even though it's not currently your season for it. Reach for one small pleasure during a low turn, even without expecting it to land the way it usually does. Try it modestly, without high expectations. Notice that you're allowed to enjoy things modestly during the down cycles instead of waiting for the up ones.`,
      },
      11: {
        title: `11 in Sacral Chakra — Strength`,
        mastery: `That's a real gift, not everyone can access pleasure during difficulty, and you generally can, which makes your enjoyment durable rather than fair-weather. You're capable of letting the strain be acknowledged directly, alongside the pleasure, rather than the pleasure standing in for the acknowledgment. The pleasure can be honest now, not a cover. Your resilient capacity for pleasure under pressure stays real and valuable even once the strain is named openly.`,
        shadow: `The risk is that this resilient capacity for pleasure gets used to mask how much strain you're actually under, since your ability to still enjoy things reads to others, and sometimes to you, as evidence everything is fine. You keep accessing small pleasures right through periods that genuinely need more direct attention. Your capacity to find pleasure even under real strain is genuine, and it's being read as proof everything is actually fine, when it isn't. That misreading costs you the direct attention the actual difficulty needs.`,
        invitation: `Ask yourself what difficulty your steady capacity for pleasure has been quietly covering for. Let the strain be acknowledged directly, alongside the pleasure. Say both at once, not one instead of the other. Notice that you're allowed to enjoy something and also admit things are hard.`,
      },
      12: {
        title: `12 in Sacral Chakra — The Hanged Man`,
        mastery: `That's a real requirement for you, not a preference, your enjoyment doesn't survive being hurried. You're capable of slowing down deliberately before one pleasurable moment, on purpose, so you're actually present for it. You can be actually present for your own pleasure now, more often than not. That requirement hasn't changed and doesn't need to; it just needs the time it asks for.`,
        shadow: `The risk is that a life kept in constant motion never actually slows down enough to let pleasure land, so you end up moving through potentially enjoyable moments without ever fully arriving in them. You technically experience pleasurable things without registering them as pleasurable, because you never stopped moving long enough to feel it. You can list things that should have been pleasurable without being able to say you actually enjoyed them. Your capacity for pleasure requires a stillness your life rarely provides.`,
        invitation: `Ask yourself what pleasure you've been moving through too fast to actually feel. Slow down deliberately before one pleasurable moment, on purpose, so you're actually present for it. Give it the time it requires. Notice that you're allowed to take the time your enjoyment requires.`,
      },
      13: {
        title: `13 in Sacral Chakra — Transformation`,
        mastery: `Novelty and transformation actually delight you at a deep level, not just distract you, that's a real form of enjoyment tied to growth itself. You're capable of letting one stable pleasure stay exactly as it is, without needing to transform or refresh it. Steady enjoyment can become available alongside the transformative kind. Your pleasure in genuine reinvention stays real and alive even once you let something unchanging simply be.`,
        shadow: `The risk is that stable, unchanging pleasures start to feel flat by comparison, so you keep seeking transformation even in areas of your life that were already working, simply because change itself is what registers as pleasurable to you. You disrupt things that were fine, chasing the specific delight of reinvention. You've unsettled something that was fine, chasing a form of pleasure that didn't actually require it. Stable things that are genuinely working start to feel flat, tempting you to disrupt them.`,
        invitation: `Ask yourself what's working well in your life that doesn't need reinventing to still delight you. Let one stable pleasure stay exactly as it is, without needing to transform or refresh it. Leave it alone, on purpose. Notice that you're allowed to enjoy something unchanging.`,
      },
      14: {
        title: `14 in Sacral Chakra — Temperance`,
        mastery: `That's a real and sustainable form of enjoyment, you're built to appreciate the calibrated experience over the overwhelming one, and that's not a limitation. You're capable of letting one intense pleasure be intense, without moderating it toward something calmer. Some pleasures can actually be better at full strength. Your natural preference for the well-balanced stays real even once one intense experience gets to be fully intense.`,
        shadow: `The risk is that this preference for moderation filters out pleasures that are genuinely intense but still good, simply because they don't fit the calibrated register you're comfortable with. You avoid or dial down experiences that could have delighted you specifically because of their intensity. You moderate things reflexively, even when the intensity itself was what would have made something delightful. Genuinely intense experiences get filtered out or dialed down before you can fully enjoy them.`,
        invitation: `Ask yourself what pleasure you've been diluting that might have been better at full strength. Let one intense pleasure be intense, without moderating it toward something calmer. Let it stay at full strength this time. Notice that you're allowed to enjoy something that isn't balanced or blended.`,
      },
      15: {
        title: `15 in Sacral Chakra — The Devil`,
        mastery: `Your capacity for enjoyment runs deep and strong, and the question isn't whether the wanting is acceptable, it's whether you can access it without shame running the whole transaction. You're capable of naming one intense pleasure you want, without the accompanying judgment. Wanting something strongly doesn't require an apology once it's actually named. Your capacity for intense pleasure stays exactly as strong as it's always been; that was never the problem.`,
        shadow: `The risk is that shame about the intensity of your own wanting keeps the pleasure hidden, and concealment, not the desire itself, is what turns simple appetite into something that runs your life from underneath. You enjoy something and immediately manage how it looks, even to yourself. You enjoy things while simultaneously managing how that enjoyment looks, even in private. The concealment, not the desire, is doing the real damage.`,
        invitation: `Ask yourself what you actually want that you've never said without an apology attached. Name one intense pleasure you want, without the accompanying judgment. Say it plainly, without the apology. Notice that you're allowed to want something strongly without it meaning something is wrong with you.`,
      },
      16: {
        title: `16 in Sacral Chakra — The Tower`,
        mastery: `That rebuilding is real and ongoing, you haven't lost the capacity, you're recovering access to it. You're capable of letting one pleasure be as big as it actually wants to be, without pre-limiting it. Delight can start to feel safe to fully feel again once you let one enjoyment be its actual size. That recovery doesn't require the disruption to have never happened, it just requires trusting what's rebuilt.`,
        shadow: `The risk is staying braced against pleasure itself, treating enjoyment as something that gets disrupted again if you let it get too big, so you keep your own delight small and contained as a precaution. You limit how much you enjoy something, as if pleasure itself invites its own interruption. You limit how much you let yourself enjoy something, as though full pleasure itself is what invites the next interruption. Your relationship to pleasure was genuinely disrupted at some point, and you're still bracing against it getting too big again.`,
        invitation: `Ask yourself what you've kept small out of a learned caution that pleasure gets taken away. Let one pleasure be as big as it actually wants to be, without pre-limiting it. Let it be full-sized this time. Notice that you're allowed to enjoy something fully again.`,
      },
      17: {
        title: `17 in Sacral Chakra — The Star`,
        mastery: `That hopeful register genuinely delights you, even when you keep it modest, there's real enjoyment in trusting that good things are still coming. You're capable of letting one hopeful pleasure be fully sized, without the protective downgrade. The pleasure can have more range once the hope underneath it isn't automatically capped. Your hopeful, quiet pleasure in things possibly being good stays real and yours even at full size.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps the pleasure modest, so you experience a diluted version of an enjoyment that could actually be much fuller. You enjoy things at a lower intensity than you're capable of, because you've pre-limited the hope underneath the pleasure. You experience good things at a fraction of their potential intensity, because the hope that would let them land fully has been pre-limited. Your pleasure stays tied to a hope you keep deliberately modest, which means the enjoyment itself comes through diluted.`,
        invitation: `Ask yourself what pleasure you've been experiencing at a fraction of its actual size. Let one hopeful pleasure be fully sized, without the protective downgrade. Enjoy it at full hope, not just guarded hope. Notice that you're allowed to enjoy something at full hope.`,
      },
      18: {
        title: `18 in Sacral Chakra — The Moon`,
        mastery: `That's not a flaw in your capacity for enjoyment, it's an accurate reflection of how much of your pleasure lives below clear articulation. You're capable of tracking one pleasure after it happens, naming specifically what about it worked. You can seek out pleasure more deliberately now, not just receive it by surprise. Your relationship to pleasure stays genuinely harder to predict than most people's, and that's fine; naming it after the fact still makes it less foggy over time.`,
        shadow: `The risk is that the fog around what actually delights you leaves you unable to reliably seek out pleasure, so enjoyment happens to you rather than being something you can deliberately pursue. You're often surprised by what turns out to please you, without being able to predict it in advance. You're consistently surprised by your own pleasure, without a clear enough sense of your own patterns to predict it. Enjoyment mostly happens to you rather than being something you can pursue.`,
        invitation: `Ask yourself what recently delighted you that you could try to name more precisely. Track one pleasure after it happens, naming specifically what about it worked. Write down what specifically made it land. Notice that you're allowed to get clearer about your own enjoyment over time.`,
      },
      19: {
        title: `19 in Sacral Chakra — The Sun`,
        mastery: `That's a real gift, not everyone has straightforward access to enjoyment, and your delight tends to be visible, shared, and uncomplicated by guilt or hesitation. You're capable of staying with one difficult feeling before reaching for the pleasure that would skip past it. Pleasure can stay simple for you; it's just no longer your only strategy for handling something hard. Your easy, warm access to pleasure stays real and a genuine gift even once you let a hard feeling stay a moment longer.`,
        shadow: `The risk is that this easy access to pleasure makes it hard to sit with anything difficult, since your instinct is to move toward enjoyment rather than stay with discomfort that actually needs attention. You reach for pleasure to skip past a hard feeling rather than to simply enjoy something. You reach for something pleasurable specifically when a harder feeling shows up, before you've actually let yourself feel it. Enjoyment is so readily available to you that it doubles as an exit from anything difficult.`,
        invitation: `Ask yourself what discomfort you've been bypassing with easy pleasure instead of actually sitting with it. Stay with one difficult feeling before reaching for the pleasure that would skip past it. Let the hard feeling be there without an immediate exit. Notice that you're allowed to feel something hard without immediately moving to enjoyment.`,
      },
      20: {
        title: `20 in Sacral Chakra — Judgement`,
        mastery: `This isn't about external barriers, it's an internal summons toward enjoyment you haven't yet said yes to. You're capable of giving yourself the specific permission you've been withholding, for the pleasure you already know you're waiting on. That specific enjoyment can stop feeling just out of reach once you say yes to yourself. Nothing external needs to change first, only your own permission.`,
        shadow: `The risk is that the postponement of this permission produces a low-grade sense that pleasure is somewhere just out of reach, without the reach actually being blocked by anything external. You can name a pleasure you're waiting to allow yourself, without quite knowing why you haven't yet. You can name the pleasure you're withholding, without quite understanding what's stopping you from simply allowing it. Some pleasure you're genuinely allowed to have stays waiting on a permission you haven't given yourself.`,
        invitation: `Ask yourself what enjoyment you've been sensing is available to you, without yet letting yourself have it. Give yourself the specific permission you've been withholding, for the pleasure you already know you're waiting on. Say yes to it now, plainly. Notice that you're allowed to say yes to this now.`,
      },
      21: {
        title: `21 in Sacral Chakra — The World`,
        mastery: `That's a real and mature form of delight, satisfaction rooted in coherence rather than in individual pleasurable moments. You're capable of enjoying one small, isolated pleasure fully, without needing it to connect to the bigger picture. Minor delights can count now too, not just the integrated kind. Your pleasure in wholeness and integration stays real and mature even once a small, disconnected pleasure gets to count on its own.`,
        shadow: `The risk is that this need for wholeness before pleasure can register means isolated, smaller enjoyments get dismissed as insufficient, so you miss out on real delight simply because it didn't arrive as part of a bigger integrated picture. You undervalue small pleasures that don't connect to anything larger. You undervalue delight that doesn't connect to something larger, missing real pleasure simply because it arrived alone. Isolated smaller enjoyments get dismissed as insufficient, even when they're genuinely pleasurable on their own terms.`,
        invitation: `Ask yourself what small pleasure you've been dismissing because it felt too minor or disconnected to count. Enjoy one small, isolated pleasure fully, without needing it to connect to the bigger picture. Let it count entirely on its own. Notice that you're allowed to delight in something that isn't part of a larger wholeness.`,
      },
      22: {
        title: `22 in Sacral Chakra — The Fool`,
        mastery: `That's a real form of enjoyment, the not-knowing itself delights you, rather than being something you tolerate on the way to a known outcome. You're capable of enjoying one thing precisely because it's known and settled, without needing the uncertainty for it to count as pleasurable. Stability can have its own pleasure now, alongside the spontaneous kind. Your pleasure in openness and uncertainty stays real and delightful even once a settled, predictable thing also gets to count.`,
        shadow: `The risk is that this pleasure in uncertainty avoids the different, quieter pleasure of things that are settled and known, so anything predictable or planned starts to feel like it's missing the point. You undervalue the pleasure available in stability, chasing novelty even when something settled would genuinely delight you too. You chase novelty past the point it's actually serving you, underrating the quieter pleasure that stability offers. Settled, predictable enjoyments start to feel like they're missing something, even when they're genuinely good.`,
        invitation: `Ask yourself what settled, known pleasure you've been underrating in favor of the next uncertain one. Enjoy one thing precisely because it's known and settled, without needing the uncertainty for it to count as pleasurable. Let the predictable be pleasurable on its own terms. Notice that you're allowed to delight in the predictable.`,
      },
    },

    manipura: {
      1: {
        heading: `Your Power Comes From Starting Things Yourself`,
        why: `Manipura asks where your sense of personal power comes from — and the Magician answers through initiation: you feel powerful when you're the one making something begin. That's real, earned confidence, built through repeated proof that you can act on your own will and have it land.`,
        shadow: `The risk is that your power feels contingent entirely on being the initiator, so power that arrives through someone else's invitation or through simply continuing something already in motion doesn't register as yours. You might notice you struggle to feel capable in situations you didn't personally start.`,
        path: `Try claiming your capability inside something you didn't initiate. You are allowed to feel powerful without having started it. Where have you been underselling your own strength because someone else made the first move?`,
        positive: `Your power in initiating is still real and still a genuine source of confidence — that hasn't changed — but you've claimed your capability inside situations you didn't start too. Power feels like yours now regardless of who made the first move, not only when you did.`,
        negative: `Your sense of power stays tied almost entirely to initiating, so situations you didn't personally start leave you feeling less capable than you actually are. You might notice you undersell your own strength the moment you're not the one who began something.`,
      },
      2: {
        heading: `Your Power Is Quiet, and It Doesn't Need to Announce Itself`,
        why: `Manipura asks what makes you feel powerful — and the High Priestess answers through withheld knowledge: a confidence rooted in understanding more than you say. That's a real form of power — private, unshowy, but genuinely felt from the inside — and it doesn't require external proof to be true.`,
        shadow: `The risk is that this quiet power stays so private it never actually gets exercised in the world, so your capability accumulates internally without ever converting into visible impact. You might notice you feel powerful in your own understanding, while your actual influence on your circumstances stays minimal.`,
        path: `Try using one piece of your private understanding out loud, where it can actually change something. You are allowed to let quiet power show itself sometimes. What do you understand that could actually shift something if you said it?`,
        positive: `Your power is still quiet and internally rooted — that hasn't changed and doesn't need to — but you've let some of it out into the open, where it can actually shift things. Your understanding is converting into real impact now, not just private confidence.`,
        negative: `Your sense of power stays entirely internal and private, which means real understanding rarely converts into visible influence on your actual circumstances. You might notice you feel capable inside your own head while your outer life doesn't reflect that capability back to you.`,
      },
      3: {
        heading: `Your Power Is in What You Create and Sustain`,
        why: `Manipura asks what makes you feel powerful — and the Empress answers through generativity: your confidence comes from making things grow, from nurturing something into fullness. That's a real and considerable power — the ability to sustain and cultivate — even though it doesn't look like assertive, forceful strength.`,
        shadow: `The risk is that this generative power gets undervalued, including by you, because it doesn't resemble the more visible, assertive kind of strength. You might notice you don't fully credit yourself for the power it takes to sustain and grow something over time, treating it as merely caretaking rather than real capability.`,
        path: `Try naming your generative capacity as power, explicitly, not just as nurturing. You are allowed to call sustaining something a real strength. What have you grown or sustained that deserves to be recognized as genuine power?`,
        positive: `Your generative power — the capacity to grow and sustain things — is still exactly as real as it's always been, and now you're naming it as the strength it actually is, not just as caretaking. You credit yourself for what it actually takes to cultivate something over time.`,
        negative: `Your generative capacity is genuine power, and it's going uncredited, including by you, because it doesn't resemble more visible, assertive strength. You might notice you minimize what it took to sustain and grow something, treating real capability as though it were simply what you're supposed to do.`,
      },
      4: {
        heading: `Your Power Is Clear, Direct, and Fully Claimed`,
        why: `Manipura asks what makes you feel powerful — and the Emperor answers unambiguously: authority, control, the capacity to direct outcomes. That's a genuine and considerable strength — you're built for this centre more directly than most, and your confidence in your own capability tends to be real, not performed.`,
        shadow: `The risk is that this clear, direct power tips into control that doesn't leave room for anyone else's, so your strength expands into territory that actually belongs to other people. You might notice you take charge reflexively, even in situations that would be better served by someone else's authority.`,
        path: `Try stepping back from one situation you'd normally direct, and let someone else's authority stand. You are allowed to hold power without extending it into everything. Where have you been directing something that wasn't actually yours to control?`,
        positive: `Your direct, considerable power is still fully intact — that clarity hasn't diminished — but you've learned to step back from situations that aren't actually yours to direct, letting someone else's authority stand. Your strength has boundaries now, which makes it land better where it's actually needed.`,
        negative: `Your power is real and direct, and it's expanding into territory that isn't actually yours to control, taking charge reflexively even where someone else's authority would serve better. You might notice you struggle to let a situation be directed by anyone but you, regardless of whose it actually is.`,
      },
      5: {
        heading: `Your Power Comes From What You Know and Can Teach`,
        why: `Manipura asks what makes you feel powerful — and the Hierophant answers through mastery of a framework: your confidence comes from genuinely understanding something well enough to guide others through it. That's real power, earned through depth rather than force — the strength of someone who actually knows.`,
        shadow: `The risk is that this power feels contingent on staying the authority, so any real challenge to your understanding threatens your entire sense of capability, not just the specific point being questioned. You might notice you defend your expertise more fiercely than the situation actually calls for.`,
        path: `Try letting one piece of your expertise be genuinely questioned without your whole sense of capability wobbling. You are allowed to be wrong about a detail and still be powerful. What understanding of yours have you been defending harder than it needs?`,
        positive: `Your power through mastery and understanding is still real and well-earned — that hasn't changed — but you've let your expertise be questioned without your entire sense of capability shaking. You can be wrong about a detail now and still feel powerful, because your strength was never actually resting on being unchallengeable.`,
        negative: `Your power depends on staying the authority, so any real challenge to your understanding threatens more than the specific point in question — it threatens your whole sense of capability. You might notice you defend your expertise with more force than the actual stakes warrant, because so much rides on staying right.`,
      },
      6: {
        heading: `Your Power Shows Up Fully When You're Choosing, Not Deferring`,
        why: `Manipura asks what makes you feel powerful — and the Lovers answer through conscious choice: your strength is most present in the moment you actively decide, rather than in the moment you comply or defer. That's real power — the specific confidence of knowing you chose this — and it's tied closely to agency in relationship.`,
        shadow: `The risk is that deferring in a relationship — even reasonably, even sometimes — starts to feel like a loss of power itself, so you resist compromise that would actually serve the relationship because it registers as diminishment. You might notice choosing feels like the only powerful position, making genuine give-and-take harder to access.`,
        path: `Try deferring once, deliberately, without experiencing it as a loss of power. You are allowed to yield in a relationship and stay fully capable. Where have you resisted compromise because it felt like giving up strength rather than simply sharing a decision?`,
        positive: `Your power in actively choosing is still real and still central to your confidence — that hasn't changed — but you've found you can defer sometimes, in a relationship, without it costing you your sense of capability. Yielding has stopped meaning diminishment; it's just part of how two people decide things together now.`,
        negative: `Your sense of power stays tied to active choosing, so deferring in a relationship — even reasonably — registers as a loss of strength rather than simply part of give-and-take. You might notice you resist compromise more than the situation calls for, because yielding feels like it costs you something more than it actually does.`,
      },
      7: {
        heading: `Your Power Is Momentum, Fully Committed to a Direction`,
        why: `Manipura asks what makes you feel powerful — and the Chariot answers through directed force: strength that comes from committing fully to a course and moving on it without hesitation. That's real, embodied power — you feel most capable in motion, actively steering toward something.`,
        shadow: `The risk is that this power feels absent the moment you're not actively moving, so stillness or reflection reads as weakness rather than as a different, equally valid use of strength. You might notice you push forward on things that would actually benefit from a pause, because stopping feels like losing your power.`,
        path: `Try pausing deliberately in the middle of forward motion, and notice your capability is still there. You are allowed to be powerful while still. What would happen if you stopped moving on something, just to test whether your strength survives the stillness?`,
        positive: `Your power in committed forward motion is still real and still your natural mode — that hasn't changed — but you've tested stillness enough to know your capability doesn't disappear when you pause. You can stop moving on something now without it registering as a loss of strength.`,
        negative: `Your power feels present almost entirely in motion, so stillness or hesitation reads as weakness rather than as a legitimate pause. You might notice you keep pushing forward on things that would genuinely benefit from stopping, because you haven't tested whether your strength actually survives the stillness.`,
      },
      8: {
        heading: `Your Power Depends on Being in the Right`,
        why: `Manipura asks what makes you feel powerful — and Justice answers through rightness: your confidence is strongest when you know you're acting fairly, ethically, within bounds you believe in. That's real power — moral clarity is a genuine source of strength — and it tends to make you formidable when you're certain of your ground.`,
        shadow: `The risk is that any doubt about being in the right undermines your entire sense of power, not just the specific question at hand, so moral uncertainty can leave you feeling incapable even when you're otherwise perfectly competent. You might notice you need to resolve an ethical question before you can act with any confidence at all.`,
        path: `Try acting with some moral ambiguity still unresolved, and notice your capability doesn't actually disappear. You are allowed to be powerful even when you're not entirely certain you're right. Where have you stalled, waiting for ethical certainty that wasn't actually required to move?`,
        positive: `Your power through moral clarity is still real and still a genuine strength — that hasn't changed — but you've learned to act with some ethical ambiguity unresolved, without your whole sense of capability collapsing. You're powerful now even in the grey areas, not only when you're certain you're right.`,
        negative: `Your power depends heavily on moral certainty, so any doubt about being in the right can undermine your entire sense of capability, well beyond the specific question at hand. You might notice you stall on decisions waiting for ethical clarity that isn't actually necessary to act.`,
      },
      9: {
        heading: `Your Power Is Self-Contained, and It Doesn't Need Witnesses`,
        why: `Manipura asks what makes you feel powerful — and the Hermit answers through self-sufficiency: your strength comes from needing nothing external to validate it, from being genuinely capable on your own. That's real, durable power — quiet, unshowy, and not dependent on an audience.`,
        shadow: `The risk is that this self-contained power becomes so private that no one around you actually knows how capable you are, which can leave you underestimated or overlooked in situations where visible strength would have served you. You might notice you let your competence go unrecognized rather than let anyone witness it.`,
        path: `Try letting your capability be visible once, in a situation where being underestimated is actually costing you something. You are allowed to let people see your strength. Where has your self-sufficiency left you overlooked in a way that isn't actually serving you?`,
        positive: `Your self-contained power is still real and still doesn't require an audience to be true — that hasn't changed — but you've let your capability be visible in at least one situation where being underestimated was actually costing you something. Your strength gets recognized now when it matters, not only known privately.`,
        negative: `Your power stays entirely self-contained and unwitnessed, which means people around you can genuinely underestimate your capability, sometimes at real cost to you. You might notice you let your competence go unrecognized in situations where being seen would have actually served you.`,
      },
      10: {
        heading: `Your Power Rises and Falls, and You Feel Every Shift`,
        why: `Manipura asks what makes you feel powerful — and the Wheel answers honestly: your sense of capability isn't constant, it moves with circumstance and cycle. That's an accurate read of how your power actually works — strong in some seasons, quieter in others — rather than a flaw in your underlying strength.`,
        shadow: `The risk is that during a low turn, you interpret the quiet as evidence your power was never real, rather than recognizing it as temporarily dormant. You might notice you stop trusting your own capability during down periods, treating the current low as a verdict rather than a phase.`,
        path: `Try acting from capability during a low turn, even without the usual confidence backing it. You are allowed to be powerful even when you don't currently feel it. What could you do right now that doesn't require you to feel strong first?`,
        positive: `Your power still genuinely rises and falls with circumstance — that rhythm hasn't changed — but you've learned to act from capability even during the quieter turns, instead of waiting to feel strong before trusting yourself. The low seasons don't undermine your actual strength the way they used to.`,
        negative: `Your sense of power moves in real cycles, and during the low turns you tend to read the quiet as proof your capability was never real, rather than simply dormant for now. You might notice you stop trusting yourself during down periods, treating a temporary low as a permanent verdict.`,
      },
      11: {
        heading: `Your Power Is Gentle, and That Makes It Easy to Underestimate`,
        why: `Manipura asks what makes you feel powerful — and Strength answers through soft, sustained force: your capability doesn't need to be loud or forceful to be real. That's genuine power — the kind that holds under pressure without hardening — even though it's often mistaken for something weaker than it is.`,
        shadow: `The risk is that this gentle power gets underestimated by others, and eventually by you, so you end up absorbing more than your share simply because your calm makes the load look manageable. You might notice people lean on your capability without recognizing how much strength it's actually taking.`,
        path: `Try naming your own strength plainly, without softening the description of it. You are allowed to call your gentleness what it actually is — power. What capability of yours has been going unnamed because it doesn't look like force?`,
        positive: `Your gentle, sustained power is still exactly as real as it's always been — that hasn't changed — but you've started naming it plainly as strength, instead of letting its softness make it invisible. People credit your capability accurately now, because you've stopped underselling it yourself.`,
        negative: `Your power is genuine and it's consistently underestimated, including by you, because it doesn't announce itself the way forceful strength does. You might notice people lean on your capability without recognizing what it costs, since your calm makes a heavy load look easy.`,
      },
      12: {
        heading: `Your Power Is in Releasing, Not Only in Holding`,
        why: `Manipura asks what makes you feel powerful — and the Hanged Man answers counterintuitively: real strength shows in your capacity to let go, to stop forcing an outcome. That's a genuine and mature form of power — most people mistake control for strength, and you've found the release itself can be the stronger move.`,
        shadow: `The risk is that this capacity for release generalizes into giving up on things that actually needed your active effort, mistaking passivity for the wisdom of letting go. You might notice you've stopped pushing on something that genuinely required more of your active capability, calling it surrender when it was actually avoidance.`,
        path: `Try naming one thing you've released that actually needed more active effort from you, and re-engage it. You are allowed to hold power actively on some things and release it on others. What have you let go of that wasn't actually meant to be released?`,
        positive: `Your capacity for power through release is still real and still a genuine strength — that hasn't changed — but you've re-engaged actively with at least one thing you'd mistakenly let go of, distinguishing real release from avoidance dressed up as wisdom. Both capacities are working together now.`,
        negative: `Your capacity for release is genuine power, and it's generalized into letting go of things that actually needed your active effort, mistaking passivity for wisdom. You might notice something has drifted because you called your disengagement surrender when it was closer to avoidance.`,
      },
      13: {
        heading: `Your Power Is Proven Through What You've Survived and Rebuilt`,
        why: `Manipura asks what makes you feel powerful — and Transformation answers through demonstrated resilience: your confidence is earned, specifically, through having been through real collapse and rebuilt something afterward. That's hard-won, credible power — not theoretical, actually tested.`,
        shadow: `The risk is that you start needing collapse to keep proving your power exists, so stable periods feel like they're not testing you, and some part of you unconsciously seeks out disruption just to keep demonstrating a strength that's already been proven. You might notice stability makes you restless in a way that isn't really about boredom.`,
        path: `Try trusting your power during a stable period, without needing a collapse to reconfirm it. You are allowed to already know you're strong. What would it feel like to believe your resilience is proven, even without a current crisis testing it?`,
        positive: `Your power, proven through real survival and rebuilding, is still hard-won and completely real — that hasn't changed — but you've learned to trust it during stable periods too, without needing a fresh collapse to reconfirm it. You already know you're strong; you don't need ongoing proof.`,
        negative: `Your power was genuinely proven through collapse and rebuilding, and some part of you keeps needing a fresh crisis to reconfirm it, which can make stability itself feel restless or untested. You might notice you're drawn toward disruption specifically during calm periods, unconsciously seeking a strength that's already been established.`,
      },
      14: {
        heading: `Your Power Is Steady, Calibrated, and Rarely Extreme`,
        why: `Manipura asks what makes you feel powerful — and Temperance answers through balance: your strength shows as consistency, as the capacity to stay calibrated rather than swing to extremes. That's real, sustainable power — less dramatic than forceful strength, but considerably more durable.`,
        shadow: `The risk is that this calibrated power feels less legitimate to you than more dramatic strength, so you undervalue your own steadiness, waiting for a more intense display before you'll credit yourself with real power. You might notice you don't recognize your consistency as strength, because it doesn't look like a peak moment.`,
        path: `Try naming your steadiness itself as power, without waiting for a more dramatic version to prove it. You are allowed to call consistency strength. What sustained, calibrated capability of yours has gone unrecognized because it wasn't a dramatic display?`,
        positive: `Your steady, calibrated power is still exactly as real as it's always been — that consistency hasn't changed — but you've started naming it as genuine strength, instead of waiting for a more dramatic version to count. Your sustained capability gets credited now, not just the occasional peak moment.`,
        negative: `Your power shows up as steady consistency, and it goes uncredited, including by you, because it doesn't look like a dramatic display of strength. You might notice you undervalue your own sustained capability, waiting for a more intense proof of power that was never actually necessary.`,
      },
      15: {
        heading: `Your Power Is Tangled With Wanting Control Over Others`,
        why: `Manipura asks what makes you feel powerful — and the Devil answers honestly: some of your sense of strength is tied to control or dominance over someone or something, in a way you may not fully admit to. That desire for power is real, and the question is whether you can look at it clearly rather than disowning it.`,
        shadow: `The risk is that shame about wanting control keeps that desire hidden, and concealment — not the wanting itself — is what turns a normal appetite for power into something that runs your relationships from underneath. You might notice you exercise control in ways you'd deny if asked directly.`,
        path: `Try naming, to yourself, where you actually want control over someone or something. You are allowed to want power without it making you a bad person. Where have you been exercising control while telling yourself you weren't?`,
        positive: `Your desire for power and control is still exactly as real as it's always been — that was never the actual problem — but you've named it honestly to yourself, which has taken most of its unconscious grip away. You can want control now without needing to deny it, which makes it far easier to use responsibly.`,
        negative: `Your desire for control over someone or something is genuine, and shame about admitting it keeps it operating underneath your awareness, which is what actually makes it dangerous. You might notice you exercise power in ways you'd deny if asked directly, because the denial is doing more damage than the wanting itself.`,
      },
      16: {
        heading: `Your Power Was Shaken, and You're Rebuilding Your Trust in It`,
        why: `Manipura asks what makes you feel powerful — and the Tower answers from disruption: something sudden once undermined your sense of your own capability, and you've been rebuilding trust in your own power since. That rebuilding is real progress, not evidence the power itself was ever false.`,
        shadow: `The risk is staying braced against trusting your own strength fully, hedging your capability as a precaution against another sudden collapse. You might notice you undersell yourself preemptively, as if claiming full power invites its own disruption.`,
        path: `Try claiming your capability fully, once, without the hedge. You are allowed to trust your power completely again. Where have you been underselling your own strength as a precaution against a collapse that already happened?`,
        positive: `You're still rebuilding trust in your own power after a real disruption — that process continues, and that's fine — but you've claimed your capability fully in at least one place, without the reflexive hedge. Trusting your own strength is starting to feel safe again.`,
        negative: `Your sense of power was genuinely undermined at some point, and you're still hedging your capability as an unconscious precaution against another sudden collapse. You might notice you undersell your own strength preemptively, as though claiming it fully would invite the next disruption.`,
      },
      17: {
        heading: `Your Power Is Hopeful, Quiet, and Waiting to Be Trusted`,
        why: `Manipura asks what makes you feel powerful — and the Star answers through quiet hope: your capability is real, held with a guarded trust that things — and you — will turn out okay. That hopeful register is a genuine form of power, even though you tend to keep it modest.`,
        shadow: `The risk is that keeping your hope small to protect it also keeps your sense of your own power small, so you access a diluted version of a capability that's actually considerable. You might notice you underclaim your own strength because you've pre-limited the hope underneath it.`,
        path: `Try trusting your own power at full size, once, without the protective downgrade. You are allowed to believe fully in your own capability. What strength of yours have you been hoping for quietly instead of claiming outright?`,
        positive: `Your hopeful, quiet trust in your own capability is still real and still yours — but you've let that trust be fully sized at least once, instead of pre-guarded against disappointment. You're claiming more of your actual power now, not just hoping quietly that it's there.`,
        negative: `Your sense of power stays tied to a hope you keep deliberately modest, which means you access a diluted version of a capability that's actually considerable. You might notice you underclaim your own strength, because the hope underneath it has been pre-limited to protect against disappointment.`,
      },
      18: {
        heading: `Your Power Is Real but Hard to Locate Clearly`,
        why: `Manipura asks what makes you feel powerful — and the Moon answers honestly: your relationship to your own capability is genuine but often foggy, harder to name or trust than it is for most people. That's not a deficit in actual strength — it's an accurate reflection of how much of your power lives below clear articulation.`,
        shadow: `The risk is that this fog around your own capability leaves you unable to reliably act from power, since you can't always locate it clearly enough to trust it in the moment. You might notice you're often surprised by your own strength after the fact, without being able to call on it predictably beforehand.`,
        path: `Try naming one moment your power actually showed up, specifically, after it happened. You are allowed to get clearer about your own capability over time. What strength of yours became visible recently that you could try to name more precisely?`,
        positive: `Your relationship to your own capability is still genuinely harder to locate than most people's — that hasn't fully changed — but you've started naming your power after it shows up, which has made it less foggy over time. You can call on your own strength more reliably now, not just recognize it in hindsight.`,
        negative: `Your power is real, and the fog around locating it clearly leaves you unable to reliably act from it, since you often can't find it in the moment you actually need it. You might notice you're surprised by your own strength after the fact, without a clear enough sense of it to call on beforehand.`,
      },
      19: {
        heading: `Your Power Is Warm, Visible, and Easy to Access`,
        why: `Manipura asks what makes you feel powerful — and the Sun answers simply: your capability comes easily and visibly, without much internal struggle to access it. That's a real gift — not everyone has straightforward access to their own strength — and your power tends to be generous rather than guarded.`,
        shadow: `The risk is that this easy, visible power makes it hard to acknowledge the moments you're genuinely not capable of something, since your instinct is toward confident action rather than honest limitation. You might notice you push forward on things past the point your actual capability supports, because doubt feels foreign to your usual mode.`,
        path: `Try naming one real limit honestly, without immediately pivoting to confidence. You are allowed to acknowledge where your power actually runs out. What have you pushed past your genuine capability on, because admitting a limit felt unfamiliar?`,
        positive: `Your easy, visible access to your own power is still real and still a genuine gift — that hasn't changed — but you've learned to name real limits honestly instead of defaulting to confidence past the point it's warranted. Your strength is more accurately calibrated now, because it includes knowing where it actually ends.`,
        negative: `Your easy access to your own capability is genuine, and it makes real limitation hard to acknowledge, since confident action is so much more your default mode than honest doubt. You might notice you push past your actual capability on things, because admitting a limit feels unfamiliar rather than simply true.`,
      },
      20: {
        heading: `Your Power Is Waiting on a Call You Haven't Fully Answered`,
        why: `Manipura asks what makes you feel powerful — and Judgement answers through an unanswered summons: some of your capability is waiting to be claimed once you respond to a call you already sense. This isn't about external permission — it's an internal readiness you haven't fully stepped into yet.`,
        shadow: `The risk is that the postponement of this response produces a persistent sense of untapped capability, a strength you know is there but haven't yet claimed by acting on the call. You might notice you feel more powerful than your current actions reflect, without connecting the gap to the specific summons you've been deferring.`,
        path: `Try taking one real step toward the call you already sense, and notice how much more capable that makes you feel. You are allowed to claim the power that's waiting on your response. What have you sensed you're ready for that you haven't yet acted on?`,
        positive: `You've taken a real step toward the call you'd been sensing, and the capability that was waiting on it is now genuinely claimed — not because anything external changed, but because you finally acted. You feel as powerful now as you actually are.`,
        negative: `Some of your capability is waiting on a call you've sensed clearly and haven't yet answered, which produces a persistent sense of untapped strength you can't quite locate the source of. You might notice you feel more capable than your actions currently reflect, without connecting it to the specific summons you've been deferring.`,
      },
      21: {
        heading: `Your Power Comes From Seeing the Whole Picture`,
        why: `Manipura asks what makes you feel powerful — and the World answers through integration: your confidence is strongest when you can see how everything connects, when your capability operates on the whole system rather than an isolated piece. That's real, sophisticated power — strength that comes from perspective.`,
        shadow: `The risk is that this need for the whole picture before you'll trust your own power means you hesitate on things you're actually capable of, simply because you can't yet see how they connect to everything else. You might notice you underact on isolated opportunities, waiting for a bigger integrated view that isn't actually required.`,
        path: `Try acting from capability on one isolated thing, without needing to see how it fits the whole picture first. You are allowed to be powerful in a single, disconnected moment. What have you held back on because you couldn't yet see how it connected to everything else?`,
        positive: `Your power through seeing the whole, integrated picture is still real and still a sophisticated strength — that hasn't changed — but you've acted from capability on isolated things too, without needing the full connected view first. Your power is more available now, not gated behind needing to see everything at once.`,
        negative: `Your sense of power stays tied to seeing how everything connects, so you hesitate on things you're actually capable of simply because the bigger integrated picture isn't yet visible. You might notice you underact on isolated opportunities, waiting for a wholeness that isn't actually required to move.`,
      },
      22: {
        heading: `Your Power Comes From Trusting You'll Handle Whatever's Next`,
        why: `Manipura asks what makes you feel powerful — and the Fool answers through faith in the unknown: your capability shows most clearly in your willingness to act without certainty, trusting you'll be equal to whatever the leap reveals. That's genuine power — courage functioning as strength, not recklessness.`,
        shadow: `The risk is that this trust in your own adaptability gets used to avoid the slower work of building capability through preparation, so you keep leaping without ever developing skills that would make the landings easier. You might notice you rely on raw adaptability rather than building competence that would reduce how much you need it.`,
        path: `Try preparing for one leap in advance, building actual capability rather than trusting adaptability alone. You are allowed to combine your courage with real preparation. What skill could you build now that would make your next leap require less improvisation?`,
        positive: `Your trust in your own adaptability is still fully real — that courage isn't going anywhere — but you've paired it with real preparation on at least one front, building capability rather than relying purely on improvisation. Your power is more grounded now, not just braver.`,
        negative: `Your trust in your own adaptability is genuine, and it's being used to skip the slower work of building actual capability, so you keep leaping on raw courage without ever developing skills that would ease the landing. You might notice you rely on improvisation in situations where real preparation was actually available to you.`,
      },
    },

    anahata: {
      1: {
        heading: `You Love by Making Things Happen for the People You Care About`,
        why: `Anahata asks how you actually express love — and the Magician answers through action: you show care by initiating, fixing, making things real for the people you're close to. That's genuine love, expressed through capability rather than words, and it lands as real devotion to the people receiving it.`,
        shadow: `The risk is that love-as-action leaves little room for simply being present without doing something, so stillness with someone you love can feel like you're failing to love them properly. You might notice you struggle to just sit with someone, reflexively looking for something to fix or start instead.`,
        path: `Try being present with someone you love without initiating anything. You are allowed to love someone by simply staying, not only by acting. Who could you sit with today without trying to make anything happen?`,
        positive: `Your love through action and initiation is still exactly as real as it's always been — that hasn't changed — but you've learned to simply be present with someone too, without needing to fix or start something. Love shows up now in stillness as well as in motion.`,
        negative: `Your love shows up almost entirely through doing, so simply being present with someone, without acting, can feel like you're failing to love them properly. You might notice you reflexively look for something to fix or initiate the moment you're with someone you care about, unable to just stay.`,
      },
      2: {
        heading: `You Love Through Deep Understanding, More Than Through Words`,
        why: `Anahata asks how you love — and the High Priestess answers through intuitive knowing: you show care by deeply perceiving someone, by understanding them at a level they may not have articulated themselves. That's genuine intimacy — quiet, perceptive, and real.`,
        shadow: `The risk is that this understanding stays unspoken, so the people you love deeply may never actually know how well you see them, because the perception doesn't get translated into words. You might notice you know someone intimately without ever telling them what you know.`,
        path: `Try saying one thing you understand about someone you love, out loud, directly to them. You are allowed to let your quiet knowing be spoken. What do you understand about someone close to you that you've never actually told them?`,
        positive: `Your love through deep, intuitive understanding is still real and still your natural mode — that hasn't changed — but you've started speaking some of what you perceive, letting the people you love actually hear how well you see them. The intimacy is voiced now, not only felt.`,
        negative: `Your love shows up as deep, quiet understanding that stays largely unspoken, so the people closest to you may never fully know how well you actually see them. You might notice you carry rich private knowledge of someone you love without ever translating it into words they can hear.`,
      },
      3: {
        heading: `You Love Generously, and It's Meant to Come Back to You Too`,
        why: `Anahata asks how you love — and the Empress answers abundantly: warmth, nurturing, generous care that makes people feel fed and held. That's real, considerable love — you're built to give it richly — and the question is simply whether you let yourself receive it back in equal measure.`,
        shadow: `The risk is that this generous love flows almost entirely outward, so you become extremely well-practiced at nurturing others while your own need to be nurtured goes quietly unmet. You might notice you're the one who holds everyone else, with no one holding you back in the same way.`,
        path: `Try letting yourself be nurtured by someone you love, receiving rather than only giving. You are allowed to be held as generously as you hold others. Who could you let take care of you, the way you take care of them?`,
        positive: `Your generous, abundant love for others is still fully real — that hasn't changed and doesn't need to — but you've let yourself receive nurturing too, not only give it. Being held has become part of your experience of love now, not just holding.`,
        negative: `Your love flows generously outward, and it's rarely coming back to you in the same measure, because you've become the one who holds everyone else without anyone holding you the same way. You might notice you're skilled at nurturing and quietly unpracticed at being nurtured.`,
      },
      4: {
        heading: `You Love by Protecting and Providing Structure`,
        why: `Anahata asks how you love — and the Emperor answers through protection: you show care by creating stability and safety for the people you love, by being the reliable structure they can count on. That's genuine devotion, expressed through steadiness rather than sentiment.`,
        shadow: `The risk is that love-as-structure can crowd out emotional openness, so the people you love get safety and reliability from you without necessarily getting your vulnerability. You might notice you provide for someone thoroughly while rarely letting them see you unguarded.`,
        path: `Try letting yourself be emotionally open with someone you love, not just structurally reliable. You are allowed to be vulnerable, not only protective. Who could you let see you unguarded, the way you've let them rely on your steadiness?`,
        positive: `Your love through protection and steady structure is still real and still deeply felt by the people who receive it — that hasn't changed — but you've let yourself be emotionally open too, not just reliably strong. The people you love get your vulnerability now, alongside your protection.`,
        negative: `Your love shows up as protection and structure, and emotional openness rarely accompanies it, so the people you love get your reliability without necessarily getting your vulnerability. You might notice you provide thoroughly for someone while staying largely unguarded around them only in the practical sense, not the emotional one.`,
      },
      5: {
        heading: `You Love Through Shared Values and Committed Loyalty`,
        why: `Anahata asks how you love — and the Hierophant answers through commitment: you show care by staying loyal, by building love on shared values and tradition. That's genuine, durable love — the kind that holds over years precisely because it's rooted in something beyond momentary feeling.`,
        shadow: `The risk is that love conditioned on shared values makes it hard to stay open to someone whose values genuinely differ from yours, so real connection can get filtered through whether someone fits the framework first. You might notice you hold back from people you're drawn to simply because they don't share your values exactly.`,
        path: `Try staying open to someone whose values differ from yours, without the difference automatically limiting the connection. You are allowed to love across a values gap. Who have you held at a distance simply because they didn't fit your framework?`,
        positive: `Your love through shared values and steady commitment is still real and still meaningful to you — that hasn't changed — but you've stayed open to at least one connection that doesn't perfectly fit your framework, without the difference automatically limiting how close you'll let it get. Love has more room in it now.`,
        negative: `Your love stays conditioned on shared values and commitment to a framework, so genuine connection with someone whose values differ can get filtered or limited before it has a chance. You might notice you hold back from people you're actually drawn to, simply because they don't fit your existing framework.`,
      },
      6: {
        heading: `You Love Fully, Once You've Actually Chosen`,
        why: `Anahata asks how you love — and the Lovers answer through conscious choice: your love is deepest and most present in the relationships you've actively, deliberately chosen, rather than simply drifted into. That's real, intentional love — and it tends to be considerable once the choosing has actually happened.`,
        shadow: `The risk is that the choosing itself becomes a perpetual threshold you don't cross, so love stays in a held, uncommitted state while you keep evaluating whether this is really the choice, rather than being fully inside it. You might notice you love someone and still haven't quite chosen them, even after considerable time.`,
        path: `Try naming, to yourself, that you've actually chosen someone you've been loving from a distance. You are allowed to cross the threshold instead of circling it. Who have you been loving without quite letting yourself choose?`,
        positive: `Your love is still deepest in the relationships you've actively chosen — that hasn't changed — but you've actually crossed the threshold in at least one place you'd been circling, choosing fully instead of continuing to evaluate. The love has landed now, instead of staying held at the edge of commitment.`,
        negative: `Your love tends to stay in a held, uncommitted state, circling the choice rather than actually making it, even in relationships that have gone on for considerable time. You might notice you love someone genuinely and still haven't quite let yourself choose them outright.`,
      },
      7: {
        heading: `You Love Actively, by Moving Toward Someone`,
        why: `Anahata asks how you love — and the Chariot answers through pursuit: you show care by actively moving toward someone, by putting real effort and momentum behind a connection you want. That's genuine, energetic love — not passive at all, and considerable once it's aimed at someone.`,
        shadow: `The risk is that this active pursuit doesn't know how to slow down once the relationship is actually established, so you keep chasing even after arrival, unable to simply rest inside a connection that's already secure. You might notice you generate unnecessary momentum in relationships that don't actually need more pursuing.`,
        path: `Try resting inside one relationship that's already secure, without generating new momentum to sustain it. You are allowed to have arrived and stop chasing. Where have you kept pursuing a connection that's already yours?`,
        positive: `Your active, energetic pursuit of connection is still real and still part of how you love — that hasn't changed — but you've learned to rest inside relationships that are already secure, instead of generating unnecessary momentum to sustain what's already yours. Arrival feels like arrival now.`,
        negative: `Your love shows up as active pursuit, and it doesn't know how to stop once a relationship is actually secure, so you keep chasing connections you've already got. You might notice you generate unnecessary effort and momentum in relationships that don't actually need more pursuing.`,
      },
      8: {
        heading: `You Love Fairly, and You Need the Give-and-Take to Balance`,
        why: `Anahata asks how you love — and Justice answers through balance: your love includes a real sense of what's fair, of reciprocity, of the give-and-take actually evening out over time. That's a legitimate form of care — you love people well and expect the relationship to be mutual, not one-sided.`,
        shadow: `The risk is that this need for balance turns into quiet score-keeping, so love gets measured against a running tally rather than simply given. You might notice you track what you've given versus received in a relationship, even when you'd rather not be counting.`,
        path: `Try giving something in a relationship without tracking whether it's been matched. You are allowed to love without the ledger running, at least sometimes. Where have you been counting in a relationship you'd rather just be present in?`,
        positive: `Your sense of fairness and reciprocity in love is still real and still matters to you — that hasn't changed — but you've let yourself give in at least one relationship without tracking whether it's been matched. The love feels less audited now, even where the ledger genuinely does need attention.`,
        negative: `Your love includes a real need for balance, and it's tipped into quiet score-keeping, so care gets measured against a running tally rather than simply given. You might notice you track what you've given versus received, even in relationships you'd rather experience without counting.`,
      },
      9: {
        heading: `You Love From a Distance That Feels Safe to You`,
        why: `Anahata asks how you love — and the Hermit answers through space: you show care while maintaining real independence, loving people without merging into them. That's genuine love — undiminished by the distance — and the space is often what makes the connection sustainable for you.`,
        shadow: `The risk is that the distance you need for safety reads to the people you love as coldness or absence, so your genuine care doesn't always land the way you intend it to. You might notice someone you love deeply experiences your independence as a lack of closeness, even though the love itself is real.`,
        path: `Try closing the distance slightly, once, with someone you love, and staying in it longer than feels automatically comfortable. You are allowed to let someone in closer without losing yourself. Who might benefit from a little less space than you'd naturally give them?`,
        positive: `Your need for real independence within love is still genuine and still yours to protect — that hasn't changed — but you've closed the distance slightly with someone you love, staying present longer than felt automatically comfortable. Your care lands more clearly now, without you losing the space you actually need.`,
        negative: `Your love includes real distance, and that distance can read to the people you love as coldness rather than as the independence it actually is. You might notice someone close to you experiences less closeness than you're actually feeling, because the space you need doesn't translate as love from their side.`,
      },
      10: {
        heading: `Your Love Rises and Falls With the Turning`,
        why: `Anahata asks how you love — and the Wheel answers honestly: your capacity for openness in love isn't constant, it moves with circumstance and cycle. That's an accurate read of how you actually love — sometimes fully open, sometimes more guarded — rather than a flaw in your underlying capacity for connection.`,
        shadow: `The risk is that during a closed turn, you or the people who love you interpret the distance as a verdict on the relationship, rather than recognizing it as a temporary phase. You might notice a guarded stretch gets read as loss of feeling, when it's actually just where you are in the cycle.`,
        path: `Try naming the cycle to someone you love, so a closed period doesn't get misread as loss of feeling. You are allowed to move through open and closed seasons without it meaning something's wrong. Could you tell someone close to you that this is a quieter season, not an ending?`,
        positive: `Your capacity for openness in love still genuinely rises and falls with the cycle — that rhythm hasn't changed — but you've named it to the people close to you, so a quieter season doesn't get misread as loss of feeling. The relationship survives the turning better now, because it's understood rather than guessed at.`,
        negative: `Your openness in love moves in real cycles, and a closed or guarded stretch can get misread — by you or by the people who love you — as a verdict on the relationship rather than a temporary phase. You might notice distance during a low turn causes more alarm than the actual situation warrants.`,
      },
      11: {
        heading: `You Love Steadily, Without Needing to Harden Under Strain`,
        why: `Anahata asks how you love — and Strength answers through gentle endurance: you can stay soft and present with someone even through real difficulty, without your care turning brittle or defensive under pressure. That's a genuine and rare form of love — resilient without becoming hard.`,
        shadow: `The risk is that this steady gentleness under strain gets taken for granted, so the people you love keep bringing you difficulty without checking what it's costing you to stay soft through all of it. You might notice you absorb relational strain that would harden almost anyone else, without anyone noticing the toll.`,
        path: `Try naming the cost of staying soft through something difficult, to the person who's been bringing you the difficulty. You are allowed to be steady and still say this is asking a lot of me. What relational strain have you been absorbing without anyone knowing what it takes?`,
        positive: `Your steady, gentle endurance through relational difficulty is still real and still a genuine strength — that hasn't changed — but you've named the cost of it at least once, to someone who needed to know what staying soft was actually asking of you. Your love holds, and now so does an honest limit.`,
        negative: `Your capacity to stay soft and present through relational difficulty is genuine, and it's being taken for granted, absorbing strain that would harden almost anyone else without anyone checking what it costs you. You might notice you keep receiving difficulty from someone you love without ever naming what that steadiness requires of you.`,
      },
      12: {
        heading: `You Love Most Fully Once You've Released Control of the Outcome`,
        why: `Anahata asks how you love — and the Hanged Man answers through surrender: your deepest love shows up once you've stopped trying to control how the relationship goes, once you can simply be present without steering the outcome. That's a mature, real form of love — trust rather than management.`,
        shadow: `The risk is that this surrender generalizes into passivity about things that actually need your active participation, so you stop advocating for what you need in a relationship, mistaking that silence for the wisdom of letting go. You might notice you've released a need that was actually reasonable to voice.`,
        path: `Try voicing one need in a relationship you've been silently releasing. You are allowed to surrender the outcome and still ask for what you need. What have you let go of in love that was actually reasonable to ask for?`,
        positive: `Your capacity to love through genuine surrender — releasing control of the outcome — is still real and still meaningful — that hasn't changed — but you've started voicing needs you'd been silently letting go of, distinguishing real surrender from unnecessary silence. Both trust and honest need are present now.`,
        negative: `Your capacity for surrender in love is genuine, and it's generalized into a passivity that keeps you from voicing needs that were actually reasonable to ask for. You might notice you've released things in a relationship that weren't meant to be released, calling it acceptance when it was closer to going quiet.`,
      },
      13: {
        heading: `Your Love Has Survived Real Endings and Rebuilt Itself`,
        why: `Anahata asks how you love — and Transformation answers through demonstrated resilience: your capacity for love has been tested by real loss or rupture, and it's proven itself capable of reopening afterward. That's hard-won, credible love — not naive, actually tested and still willing.`,
        shadow: `The risk is that you start expecting every love to eventually rupture, so you hold new connections slightly braced, waiting for the collapse that would prove the pattern again, rather than letting a new relationship simply be stable. You might notice you test connections that are actually going fine, unconsciously anticipating an ending.`,
        path: `Try letting one relationship stay stable without testing it. You are allowed to love something that doesn't need to prove it can survive collapse. What connection in your life is actually going well, that you could simply let keep going well?`,
        positive: `Your love, proven resilient through real loss and rebuilding, is still hard-won and completely real — that hasn't changed — but you've let at least one relationship simply stay stable, without testing it or bracing for an ending that isn't coming. Not every love needs to prove it can survive collapse.`,
        negative: `Your capacity to love again after real rupture is genuine, and some part of you expects every connection to eventually test that resilience, holding new relationships slightly braced for a collapse that hasn't actually arrived. You might notice you unconsciously test connections that are genuinely going fine.`,
      },
      14: {
        heading: `You Love in Careful Balance, Rarely Losing Yourself in It`,
        why: `Anahata asks how you love — and Temperance answers through equilibrium: you love while staying calibrated, keeping your own centre even inside a close relationship. That's a real and sustainable form of love — you don't disappear into someone else, and that balance protects the relationship over the long run.`,
        shadow: `The risk is that this careful equilibrium can read as emotional distance, so the intensity someone else might want from love feels withheld, even though your steadiness is actually a form of care. You might notice a partner wants more visible intensity than your calibrated love naturally offers.`,
        path: `Try letting your love be a little more intense than feels automatically comfortable, at least once. You are allowed to lose a little balance in love without it undoing you. Where could you let more visible feeling through, even briefly?`,
        positive: `Your balanced, calibrated way of loving is still real and still protects the relationship over the long run — that hasn't changed — but you've let more visible intensity through at least once, without it costing you your centre. Your love reads as warmer now, without losing the steadiness that made it sustainable.`,
        negative: `Your love stays carefully calibrated, and that equilibrium can read as emotional distance to someone who wants more visible intensity from you. You might notice a person close to you experiences your steadiness as withholding, even though the balance is actually a genuine form of care.`,
      },
      15: {
        heading: `Your Love Is Intense, Possessive, and Something You May Not Fully Admit`,
        why: `Anahata asks how you love — and the Devil answers honestly: your love runs deep and can carry real possessiveness or intensity you may not fully acknowledge. That intensity is genuine — you love hard — and the question is whether you can look at the possessive edge clearly rather than disowning it.`,
        shadow: `The risk is that shame about the intensity or possessiveness keeps it hidden, and concealment — not the feeling itself — is what turns real love into something that constricts the person receiving it. You might notice you manage or control in ways you'd deny wanting to, even to yourself.`,
        path: `Try naming, to yourself, where your love tips into wanting to possess or control. You are allowed to love intensely without needing to grip. Where has your love been tightening into control you haven't fully named?`,
        positive: `Your love is still exactly as intense as it's always been — that was never the actual problem — but you've named the possessive edge honestly to yourself, which has loosened its unconscious grip. You can love hard now without it needing to constrict the person receiving it.`,
        negative: `Your love is genuinely intense, and shame about its possessive edge keeps that part hidden, which means the concealment — not the intensity itself — is what's actually constricting the relationship. You might notice you manage or control in small ways you'd deny wanting to, even to yourself.`,
      },
      16: {
        heading: `Your Love Was Ruptured Once, and You're Relearning How to Open`,
        why: `Anahata asks how you love — and the Tower answers from disruption: something sudden once broke your trust in love, and you've been rebuilding your capacity to open since. That rebuilding is real and ongoing — the capacity for love was never destroyed, only guarded since the rupture.`,
        shadow: `The risk is staying braced against ever being fully open again, keeping love contained as a precaution against another sudden break. You might notice you hold back the full extent of how you feel, as if declaring it fully would invite the next rupture.`,
        path: `Try letting one feeling be fully expressed, without the hedge you've built in since the break. You are allowed to love completely again. What have you been holding back out of a learned caution that love gets taken away?`,
        positive: `You're still rebuilding your capacity to love fully open after a real rupture — that process is ongoing and that's fine — but you've let at least one feeling be fully expressed, without the protective hedge. Opening is starting to feel survivable again, not just theoretically possible.`,
        negative: `Your trust in love was genuinely broken at some point, and you're still bracing against full openness as an unconscious precaution against another rupture. You might notice you hold back the true extent of your feeling, as though declaring it fully would invite the next break.`,
      },
      17: {
        heading: `Your Love Is Hopeful, Even When You Keep It Quiet`,
        why: `Anahata asks how you love — and the Star answers through quiet hope: your love carries a guarded trust that connection will be good, that people are worth opening to. That hopeful register is genuine and central to how you love, even when you don't say it loudly.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps your love modest, so the people you care about receive a diluted, guarded version of a feeling that's actually considerable. You might notice you love someone at a fraction of the intensity you're actually capable of, because the hope underneath it has been pre-limited.`,
        path: `Try letting your hope in a relationship be fully sized, at least once, without the protective downgrade. You are allowed to love someone at full hope. Who could receive the full-sized version of what you actually feel?`,
        positive: `Your hopeful, trusting love is still real and still genuinely yours — but you've let it be fully sized at least once, instead of pre-guarded against disappointment. The people you love get more of your actual feeling now, not the deliberately modest version.`,
        negative: `Your love carries real hope, kept deliberately modest to protect against disappointment, which means the people you care about often receive a diluted version of what you actually feel. You might notice you love someone at a fraction of your actual capacity, because the hope underneath has been pre-limited.`,
      },
      18: {
        heading: `Your Love Is Real but Hard to Fully Name`,
        why: `Anahata asks how you love — and the Moon answers honestly: your feelings run deep but are often foggy, harder to articulate clearly than they are for most people. That's not a deficiency in how much you love — it's an accurate reflection of how much of your love lives below clear language.`,
        shadow: `The risk is that this fog keeps you from telling the people you love what you actually feel, since you can't always locate it clearly enough to say it. You might notice someone close to you doesn't fully know the depth of your feeling, simply because you've never quite found the words.`,
        path: `Try naming one feeling, imperfectly, to someone you love, rather than waiting until you can articulate it clearly. You are allowed to speak love before it's fully sorted. What do you feel for someone that you've never said, even in an imperfect form?`,
        positive: `Your feelings are still genuinely harder to fully name than most people's — that hasn't fully changed — but you've spoken at least one of them imperfectly, rather than waiting for full clarity first. The people you love know more of what you actually feel now, even in unpolished form.`,
        negative: `Your love runs deep and stays foggy, hard to articulate clearly, which keeps the people you love from fully knowing the extent of what you feel. You might notice you wait for clarity that doesn't come, while someone close to you goes without hearing something real.`,
      },
      19: {
        heading: `Your Love Is Warm, Open, and Easy to Feel`,
        why: `Anahata asks how you love — and the Sun answers simply: your love comes easily and warmly, visible and generous without much internal struggle to access it. That's a real gift — not everyone has such straightforward access to open-hearted love — and the people close to you feel it clearly.`,
        shadow: `The risk is that this easy warmth makes it hard to sit with the harder parts of love — conflict, disappointment, someone's difficult feelings — since your instinct moves toward warmth rather than staying present with what's uncomfortable. You might notice you soften or brighten a hard moment in a relationship before it's actually been fully felt.`,
        path: `Try staying with a difficult moment in a relationship before moving to warmth. You are allowed to sit with something hard in love without rushing to repair it. What conflict or disappointment have you smoothed over before it was actually resolved?`,
        positive: `Your easy, open warmth in love is still real and still a genuine gift — that hasn't changed — but you've learned to stay with the harder moments too, before moving to repair. The people you love get your warmth and your willingness to sit with difficulty now, not just the brightness.`,
        negative: `Your easy access to warmth in love is genuine, and it makes the harder parts of relationship — conflict, disappointment — difficult to actually sit with, since your instinct moves toward brightening things before they're fully felt. You might notice you smooth over a hard moment before it's actually been resolved.`,
      },
      20: {
        heading: `Your Love Is Waiting on a Truth You Haven't Fully Spoken`,
        why: `Anahata asks how you love — and Judgement answers through an unanswered call: there's something true about how you feel that you sense you're meant to say, and haven't yet. This isn't vague — you likely know exactly what the unspoken truth is and who it's for.`,
        shadow: `The risk is that the postponement produces a persistent incompleteness in the relationship, a sense that something real is being withheld, without the withholding ever being named directly. You might notice a connection feels unfinished in a way you can't quite explain, without connecting it to the specific truth you haven't spoken.`,
        path: `Try saying the true thing you've sensed you're meant to say, to the person it's actually for. You are allowed to speak it before you feel fully ready. What do you already know you need to say, and to whom?`,
        positive: `You've said the true thing you'd been sensing you were meant to say, and the relationship it was for has settled measurably because of it — not because everything is resolved, but because the withholding has ended. The incompleteness that traced back to the unspoken truth has eased.`,
        negative: `Some truth about how you feel is waiting to be spoken, and the postponement is producing a persistent sense of incompleteness in the relationship it concerns. You might notice a connection feels unfinished in a way you can't quite explain, without connecting it to the specific thing you already know you haven't said.`,
      },
      21: {
        heading: `You Love Most Fully When Everything Feels Connected`,
        why: `Anahata asks how you love — and the World answers through integration: your deepest love comes when a relationship feels woven into the whole fabric of your life, rather than existing as an isolated piece. That's a mature, real form of love — connection that means more because it's integrated.`,
        shadow: `The risk is that this need for integration makes it hard to fully invest in a relationship that stays somewhat separate from the rest of your life, so genuinely good connections that haven't yet woven in get undervalued. You might notice you hold back from someone simply because the relationship hasn't yet connected to everything else.`,
        path: `Try investing fully in one relationship that hasn't yet integrated into the rest of your life. You are allowed to love something that stays separate for now. Who have you held at partial distance because the connection hadn't fully woven in yet?`,
        positive: `Your love through integration and connection to the whole is still real and still a mature form of care — that hasn't changed — but you've invested fully in at least one relationship that hasn't yet woven into everything else. Love counts now even before it's fully integrated.`,
        negative: `Your love tends to deepen with integration, so a relationship that stays somewhat separate from the rest of your life can get undervalued, even when it's genuinely good. You might notice you hold back from someone simply because the connection hasn't yet connected to everything else.`,
      },
      22: {
        heading: `Your Love Is Open, Trusting, and Willing to Not Know What Happens Next`,
        why: `Anahata asks how you love — and the Fool answers through openness: you love by staying willing to not know how it turns out, trusting the connection rather than needing certainty about its future. That's real, courageous love — vulnerable in the best sense.`,
        shadow: `The risk is that this openness to uncertainty avoids the different kind of intimacy that comes from actually settling into something known and committed, so relationships stay perpetually early, never quite landing into the deeper trust that stability offers. You might notice you undervalue the intimacy available in a settled, known connection.`,
        path: `Try letting one relationship settle into something known and committed, without needing the openness of not-knowing to keep it alive. You are allowed to love something certain. What connection could you let become settled, rather than perpetually open?`,
        positive: `Your open, trusting way of loving without needing certainty is still real and still courageous — that hasn't changed — but you've let at least one relationship settle into something known and committed too. Love has depth available in stability now, not only in the openness of not-knowing.`,
        negative: `Your love stays open to uncertainty, and it can avoid the different intimacy that comes from a relationship actually settling into something known, so connections stay perpetually early rather than landing into deeper trust. You might notice you undervalue the intimacy that a settled, committed connection could offer.`,
      },
    },

    vishuddha: {
      1: {
        heading: `You Express Yourself Best When You're Making Something Happen`,
        why: `Vishuddha asks how you actually get your inner life out into the world — and the Magician answers through action: you express yourself most fully by initiating, by making something real that carries your voice. That's genuine self-expression, even when it doesn't look like conventional speaking.`,
        shadow: `The risk is that your voice stays tied to doing, so the moments that call for simply speaking — without a project or action attached — can leave you feeling oddly mute. You might notice you can build or start something eloquently while struggling to just say a feeling out loud with nothing behind it.`,
        path: `Try expressing one thing purely in words, with no action attached to it. You are allowed to speak without also doing. What have you been unable to say because you kept waiting to express it through action instead?`,
        positive: `Your expression through action and initiation is still real and still a genuine voice — that hasn't changed — but you've said things purely in words too, without needing an action attached. You can speak plainly now, not only build eloquently.`,
        negative: `Your self-expression stays tied almost entirely to doing, so moments that call for simply speaking — with no project behind them — can leave you strangely mute. You might notice you can initiate something articulately while struggling to just say a feeling out loud.`,
      },
      2: {
        heading: `You Express Yourself Sparingly, and Mostly to the Right Person`,
        why: `Vishuddha asks how you communicate — and the High Priestess answers through selective disclosure: you don't say everything to everyone, but what you do share tends to be genuinely deep. That's a real form of expression — quality over volume — and it protects something real in you.`,
        shadow: `The risk is that the selectivity becomes so tight that almost no one gets the depth you're actually capable of sharing, so your real voice stays mostly unheard even by people who've earned your trust. You might notice you withhold from someone who's genuinely shown they can be trusted with more.`,
        path: `Try sharing something deep with one person who's already proven trustworthy, without the usual additional vetting. You are allowed to let your guard down faster than feels automatic. Who has already earned more of your voice than they're currently getting?`,
        positive: `Your selective, careful way of sharing is still real and still protects something genuine in you — that hasn't changed — but you've let your voice reach someone who's already proven trustworthy, without the usual extended vetting. More people get the depth you're actually capable of now.`,
        negative: `Your expression stays tightly selective, and the vetting process is so extensive that even people who've genuinely earned your trust rarely get the depth you're capable of sharing. You might notice you withhold from someone who's already shown they can be trusted with more.`,
      },
      3: {
        heading: `You Express Yourself Through What You Create and Share`,
        why: `Vishuddha asks how you communicate — and the Empress answers through generative expression: you say what's inside you by making something beautiful, nurturing, tangible — art, a meal, a space — rather than only through direct speech. That's genuine expression, embodied rather than only verbal.`,
        shadow: `The risk is that direct verbal expression atrophies from disuse, so when something can't be expressed through creation, you struggle to simply say it plainly. You might notice you can make something that communicates volumes while being unable to state the same thing outright in words.`,
        path: `Try saying one thing directly, in plain words, that you'd normally express by making something. You are allowed to speak plainly, not only create expressively. What have you been expressing through making that could also just be said?`,
        positive: `Your expression through creating and making is still real and still a genuine voice — that hasn't changed — but you've said things directly in plain words too, when creation wasn't the right vehicle. You have both registers available now, not just the generative one.`,
        negative: `Your expression flows almost entirely through creating and making, so direct verbal statement has atrophied, leaving you able to communicate volumes through a made thing while struggling to just say the same thing in plain words.`,
      },
      4: {
        heading: `You Express Yourself Clearly, Directly, and Without Much Hedging`,
        why: `Vishuddha asks how you communicate — and the Emperor answers through directness: you say what you mean, clearly and without excessive softening. That's genuine, valuable expression — people generally know exactly where they stand with you, which is a real form of respect.`,
        shadow: `The risk is that this directness doesn't always leave room for the other person's more tentative or uncertain way of communicating, so conversations can feel one-directional, structured around your clarity rather than genuinely shared. You might notice you state things so definitively that there's little room left for someone else's ambiguity.`,
        path: `Try leaving deliberate room in a conversation for someone else's less certain, less direct way of expressing something. You are allowed to be clear and still leave space. Where has your directness crowded out someone else's more tentative voice?`,
        positive: `Your clear, direct way of expressing yourself is still real and still valuable — that hasn't changed — but you've learned to leave deliberate room for someone else's more tentative voice, instead of your clarity structuring the whole exchange. Conversations feel more mutual now.`,
        negative: `Your directness is genuine, and it doesn't always leave room for someone else's more uncertain way of expressing themselves, so conversations can end up organized entirely around your clarity. You might notice you state things definitively enough that there's little space left for anyone else's ambiguity.`,
      },
      5: {
        heading: `You Express What You Believe, Clearly and With Conviction`,
        why: `Vishuddha asks how you communicate — and the Hierophant answers through conviction: you speak from a framework you believe in, and that gives your expression real weight and consistency. That's genuine, grounded communication — people know your voice reflects something you've actually thought through.`,
        shadow: `The risk is that expressing genuine uncertainty or a belief still in progress feels harder than stating something settled, so you can present more certainty than you actually feel, simply because your voice defaults to conviction. You might notice you speak more definitively than your actual internal state warrants.`,
        path: `Try expressing one belief that's still genuinely unsettled, out loud, without dressing it up as more certain than it is. You are allowed to speak from uncertainty, not only conviction. What do you actually think but haven't said because it isn't fully settled yet?`,
        positive: `Your expression through genuine conviction is still real and still carries weight — that hasn't changed — but you've spoken from real uncertainty too, at least once, instead of defaulting to more settled-sounding language than you actually felt. Your voice includes the unfinished thoughts now, not only the resolved ones.`,
        negative: `Your expression tends toward conviction, so genuine uncertainty gets dressed up as more settled than it actually is, simply because that's your voice's default register. You might notice you speak more definitively than your actual internal state warrants, especially about things still genuinely in progress.`,
      },
      6: {
        heading: `You Express Yourself Most Fully in Close Relationship`,
        why: `Vishuddha asks how you communicate — and the Lovers answer through intimacy: your voice opens most completely with someone you're genuinely close to, in relationship rather than in general company. That's a real and valid form of expression — your best communication happens one-to-one.`,
        shadow: `The risk is that this relational dependence means you go relatively quiet in group settings or with people you're not closely bonded to, so your actual voice and thinking stay largely unheard outside your closest relationships. You might notice you have real things to say in a group and don't say them, waiting for a one-to-one setting that isn't currently available.`,
        path: `Try saying one real thing in a group setting, without waiting for the intimacy of a one-to-one conversation. You are allowed to express yourself outside your closest relationships too. What have you been saving for a private conversation that could actually be said now?`,
        positive: `Your fullest expression still happens in close, one-to-one relationship — that's real and it's not going anywhere — but you've spoken up in a group setting too, without waiting for the usual intimacy first. Your voice reaches further now than just your closest bonds.`,
        negative: `Your voice opens most fully in close relationship, which means you tend to go relatively quiet in groups or with people you're not closely bonded to, leaving real thinking unheard outside your closest connections. You might notice you hold back things in a group that you'd say easily one-to-one.`,
      },
      7: {
        heading: `You Express Yourself With Momentum, Once You've Decided to Speak`,
        why: `Vishuddha asks how you communicate — and the Chariot answers through directed force: once you've decided to say something, you say it with real momentum and commitment, rarely half-heartedly. That's genuine, energetic expression — your voice carries weight because it's fully behind what it says.`,
        shadow: `The risk is that this momentum makes it hard to pause mid-expression, to revise or reconsider once you're speaking, so you can commit to a position out loud before you've actually finished thinking it through. You might notice you say things with full conviction that you're still genuinely working out.`,
        path: `Try pausing mid-expression, deliberately, to check whether what you're saying still matches what you think. You are allowed to stop and revise while speaking. Where have you committed out loud to something you hadn't actually finished thinking through?`,
        positive: `Your momentum once you've decided to speak is still real and still gives your voice genuine weight — that hasn't changed — but you've learned to pause mid-expression sometimes, checking whether what you're saying still matches your actual thinking. Your voice is as forceful and more accurate now.`,
        negative: `Your expression carries real momentum once it starts, which makes it hard to pause or revise mid-stream, so you can commit out loud to positions you haven't actually finished thinking through. You might notice you speak with full conviction about something still genuinely unsettled in you.`,
      },
      8: {
        heading: `You Express What's Fair, and You Need to Be Accurate When You Speak`,
        why: `Vishuddha asks how you communicate — and Justice answers through precision and fairness: you care about saying things accurately, about representing situations truthfully rather than exaggerating or distorting. That's genuine integrity in expression — people can generally trust that what you say reflects what's actually true.`,
        shadow: `The risk is that this need for accuracy can delay expression indefinitely, since you may withhold speaking until you're certain you've got it exactly right, missing the moment when a rougher, timelier statement would have served better. You might notice you stay quiet rather than risk saying something slightly imprecise.`,
        path: `Try saying something slightly imperfect, in the moment it's needed, rather than waiting for full accuracy. You are allowed to speak roughly and correct later. Where has your need for precision cost you the timing that mattered more?`,
        positive: `Your commitment to accurate, fair expression is still real and still genuinely valuable — that hasn't changed — but you've said something imperfectly, in the moment it mattered, rather than waiting for full precision. Your voice is timely now, as well as trustworthy.`,
        negative: `Your need for accuracy in what you say can delay your expression indefinitely, withholding speech until you're certain it's exactly right, and missing moments where a rougher, timelier statement would have actually served better. You might notice you stay quiet rather than risk imprecision.`,
      },
      9: {
        heading: `You Express Yourself Best in Writing or in Solitude First`,
        why: `Vishuddha asks how you communicate — and the Hermit answers through solitary processing: you find your clearest voice alone, working out what you actually think before you say it to anyone. That's a real and legitimate way to express yourself — considered rather than reactive.`,
        shadow: `The risk is that the need to process alone first delays real-time expression so much that spontaneous conversation becomes difficult, since your best thinking hasn't happened yet in the moment someone's actually asking. You might notice you go quiet in live conversation, only to have the perfect response hours later, alone.`,
        path: `Try saying something in real time, unpolished, before you've had the chance to process it alone first. You are allowed to speak before your thinking is fully worked out. What conversation have you gone quiet in, where an imperfect in-the-moment answer would have been better than none?`,
        positive: `Your need to process alone before speaking is still real and still produces your clearest thinking — that hasn't changed — but you've said something unpolished in real time too, instead of waiting for solitary processing first. You can show up in live conversation now, not only after you've had time alone.`,
        negative: `Your clearest expression requires solitary processing first, which delays real-time conversation so much that spontaneous exchange becomes genuinely hard. You might notice you go quiet when someone needs a response now, with your best answer arriving only later, alone.`,
      },
      10: {
        heading: `Your Voice Rises and Falls With the Turning`,
        why: `Vishuddha asks how you communicate — and the Wheel answers honestly: your capacity for expression isn't constant, it moves with circumstance and cycle. That's an accurate read of how you actually communicate — sometimes fluent and open, sometimes quieter — rather than a flaw in your underlying voice.`,
        shadow: `The risk is that during a quiet turn, you interpret the silence as evidence you've lost your voice altogether, rather than recognizing it as a temporarily quieter season. You might notice you stop trying to express yourself during down periods, treating the current quiet as permanent.`,
        path: `Try saying one small thing during a quiet turn, even without your usual fluency behind it. You are allowed to express yourself imperfectly during the low seasons instead of waiting for the articulate ones. What could you say now, even in a smaller voice than usual?`,
        positive: `Your voice still genuinely rises and falls with the cycle — that rhythm hasn't changed — but you've learned to say something even during the quieter turns, instead of waiting for full fluency to return. The low seasons don't silence you completely anymore.`,
        negative: `Your capacity for expression moves in real cycles, and during the quiet turns you tend to interpret the silence as having lost your voice entirely, rather than simply being in a quieter season. You might notice you stop trying to express yourself during down periods, extending the silence longer than the cycle requires.`,
      },
      11: {
        heading: `You Express Yourself Gently, Even When Saying Something Hard`,
        why: `Vishuddha asks how you communicate — and Strength answers through soft, sustained honesty: you can say difficult things without your voice hardening into attack or your words losing their care. That's genuine, rare expression — honest and gentle in the same breath.`,
        shadow: `The risk is that this gentle delivery can soften a hard truth so much that it doesn't actually land, so important things you've said get missed or minimized because the packaging was so careful. You might notice someone genuinely didn't register how serious something was, because your gentleness made it too easy to overlook.`,
        path: `Try saying one hard thing slightly more plainly than feels comfortable, trusting the gentleness is still there without needing to soften every edge. You are allowed to be direct and still be kind. What hard truth have you softened so much it didn't actually land?`,
        positive: `Your gentle, careful way of saying hard things is still real and still genuinely kind — that hasn't changed — but you've said something more plainly at least once, trusting your underlying gentleness didn't need extra softening to still be kind. Hard truths land now, without losing their care.`,
        negative: `Your gentle delivery of difficult things is genuine, and it can soften a hard truth so much that it doesn't actually register with the person receiving it. You might notice something important you said got missed or minimized, because the packaging made it too easy to overlook.`,
      },
      12: {
        heading: `You Express Yourself Most Honestly Once You've Let Go of the Outcome`,
        why: `Vishuddha asks how you communicate — and the Hanged Man answers through release: your most honest expression happens once you've stopped trying to control how it's received, once you can simply say the true thing without steering the reaction. That's mature, courageous expression — truth over management.`,
        shadow: `The risk is that this release generalizes into not speaking at all in situations that actually needed you to advocate clearly for something, mistaking silence for the wisdom of non-attachment. You might notice you've stayed quiet about something you had every reason to voice, calling it surrender when it was closer to avoidance.`,
        path: `Try voicing one thing you've been silently releasing, and this time actually say it. You are allowed to release the outcome and still speak clearly. What have you stayed quiet about that was actually worth saying?`,
        positive: `Your capacity for honest expression once you've released the outcome is still real and still genuinely mature — that hasn't changed — but you've voiced at least one thing you'd been silently sitting on, distinguishing real release from unnecessary silence. Your truth gets said now, not just privately held.`,
        negative: `Your capacity for release in expression is genuine, and it's generalized into staying silent in situations that actually needed you to speak clearly, mistaking quiet for wisdom. You might notice you've withheld something you had every reason to voice, calling it acceptance when it was closer to avoidance.`,
      },
      13: {
        heading: `Your Voice Has Been Silenced Before, and It's Rebuilding Itself`,
        why: `Vishuddha asks how you communicate — and Transformation answers through demonstrated resilience: your voice has likely been suppressed or dismissed at some point, and you've been rebuilding your willingness to speak since. That rebuilding is real and ongoing — the capacity to express was never destroyed, only guarded.`,
        shadow: `The risk is that you keep expecting your voice to be silenced again, so you hedge what you say preemptively, softening or qualifying things before anyone's actually pushed back. You might notice you pre-soften a statement out of anticipation, rather than in response to any actual resistance.`,
        path: `Try saying one thing without the preemptive hedge, and notice whether the silencing you're braced for actually happens. You are allowed to speak fully before you know how it'll be received. What have you been qualifying in advance, out of a caution that's no longer necessary?`,
        positive: `You're still rebuilding your willingness to speak fully after real past silencing — that process is ongoing and that's fine — but you've said at least one thing without the preemptive hedge, and found the silencing you were braced for didn't actually happen. Speaking is starting to feel safer again.`,
        negative: `Your voice was genuinely silenced or dismissed at some point, and you're still bracing for that to happen again, hedging what you say before anyone's actually pushed back. You might notice you pre-soften your statements out of anticipation rather than in response to real resistance.`,
      },
      14: {
        heading: `You Express Yourself in Careful, Calibrated Measure`,
        why: `Vishuddha asks how you communicate — and Temperance answers through balance: you say things in measured, well-calibrated amounts, rarely swinging to extremes of either oversharing or complete silence. That's real, sustainable expression — consistent rather than dramatic.`,
        shadow: `The risk is that this calibration filters out expression that's genuinely meant to be intense or urgent, tempering things down to your usual measured register even when a situation actually calls for more force. You might notice you soften an urgent message into something calmer than the moment required.`,
        path: `Try letting one expression be as intense as it actually needs to be, without automatically calibrating it down. You are allowed to say something at full volume when it matters. What urgent thing have you tempered down to your usual measured register?`,
        positive: `Your calibrated, measured way of expressing yourself is still real and still your natural register — that hasn't changed — but you've let at least one thing be said at full intensity, when the moment actually called for it. Your voice can match the urgency now, not just the usual calm register.`,
        negative: `Your expression stays carefully calibrated, which can filter out the intensity a genuinely urgent moment needs, tempering things down to your usual measured tone regardless of the actual stakes. You might notice you've softened something important into a calmer register than it deserved.`,
      },
      15: {
        heading: `Your Voice Says Things You May Not Fully Admit to Meaning`,
        why: `Vishuddha asks how you communicate — and the Devil answers honestly: some of what you express carries an intensity or edge you don't always acknowledge — provocation, control, a sharper meaning underneath the words. That intensity in your voice is real, and the question is whether you can own it rather than disowning it after the fact.`,
        shadow: `The risk is that not fully owning this edge lets it slip out sideways, in comments you'd deny meaning the way they landed, so the people you're speaking to feel something you won't acknowledge saying. You might notice you say things with a sharper edge than you'd admit to intending.`,
        path: `Try naming, to yourself, the edge in something you actually meant to say sharply. You are allowed to own the intensity in your own voice. Where have you said something pointed and then claimed you didn't mean it that way?`,
        positive: `Your voice's capacity for real intensity and edge is still exactly as present as it's always been — that was never the problem — but you've started owning it honestly, which has taken away most of its unconscious, sideways leakage. You can say a sharp thing now and actually mean it out loud.`,
        negative: `Your voice carries a real edge or intensity you don't always acknowledge, and the lack of ownership lets it slip out sideways, in comments you'd deny meaning the way they landed. You might notice people react to something in your tone that you'd insist wasn't there.`,
      },
      16: {
        heading: `Your Voice Went Quiet Once, and It's Relearning How to Speak`,
        why: `Vishuddha asks how you communicate — and the Tower answers from disruption: something sudden once made speaking feel dangerous, and you've been rebuilding your willingness to use your voice since. That rebuilding is real progress — the capacity was never gone, only guarded after the rupture.`,
        shadow: `The risk is staying braced against speaking fully, keeping your expression contained as a precaution against another sudden consequence. You might notice you hold back the full extent of what you'd say, as if speaking completely would invite the disruption again.`,
        path: `Try saying one thing at full volume, without the hedge you've built in since the disruption. You are allowed to speak completely again. What have you been holding back out of a learned caution that speaking gets punished?`,
        positive: `You're still rebuilding your willingness to speak fully after a real disruption — that process continues, and that's fine — but you've said something at full volume at least once, without the protective hedge. Speaking is starting to feel survivable again, not just risky.`,
        negative: `Your voice was genuinely disrupted at some point, and you're still bracing against speaking fully, keeping your expression contained as an unconscious precaution. You might notice you hold back the full extent of what you'd say, as though full expression would invite the same consequence again.`,
      },
      17: {
        heading: `Your Voice Carries Hope, Even When You Keep It Quiet`,
        why: `Vishuddha asks how you communicate — and the Star answers through quiet hope: what you say tends to carry an undertone of trust that things can be good, even when you express it modestly. That hopeful register is genuine, even when you keep the volume low.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps your expression modest, so you say less than you actually believe is possible, diluting your own message before it's heard. You might notice you undersell your own hope when you speak, out of habit rather than genuine doubt.`,
        path: `Try saying your actual hope at full size, once, without the protective downgrade. You are allowed to speak hopefully at full volume. What hopeful thing have you been saying quietly that deserves to be said at its real size?`,
        positive: `Your hopeful undertone is still real and still genuinely yours — but you've said it at full size at least once, instead of pre-guarded against disappointment. Your voice carries more of your actual hope now, not the deliberately modest version.`,
        negative: `Your expression carries real hope, kept deliberately modest to protect against disappointment, which means you often say less than you actually believe is possible. You might notice you undersell your own hope out of habit, diluting your message before anyone's even heard it.`,
      },
      18: {
        heading: `Your Voice Is Real but Hard to Fully Articulate`,
        why: `Vishuddha asks how you communicate — and the Moon answers honestly: what you have to say is genuine but often foggy, harder to put into clear words than it is for most people. That's not a deficiency in what you have to express — it's an accurate reflection of how much of it lives below clear language.`,
        shadow: `The risk is that this fog keeps important things unsaid indefinitely, since you're waiting for clarity that may not arrive before you speak. You might notice something you've needed to say for a long time is still unsaid, simply because you haven't found the exact words yet.`,
        path: `Try saying one thing imperfectly, in whatever words are currently available, rather than waiting for full clarity. You are allowed to speak before you've fully articulated it. What have you needed to say that could be said imperfectly, right now?`,
        positive: `What you have to express is still genuinely harder to articulate clearly than it is for most people — that hasn't fully changed — but you've said something imperfectly at least once, rather than waiting for full clarity first. Important things are getting said now, even in unpolished form.`,
        negative: `What you have to say is real, and the fog around articulating it clearly keeps important things unsaid indefinitely, waiting for a clarity that may not arrive before it matters. You might notice something you've needed to say for a long time is still unsaid, simply because the exact words haven't come.`,
      },
      19: {
        heading: `You Express Yourself Warmly, Openly, and Without Much Struggle`,
        why: `Vishuddha asks how you communicate — and the Sun answers simply: expression comes easily and warmly to you, visible and generous without much internal struggle. That's a real gift — not everyone has such straightforward access to their own voice — and people generally receive what you say clearly and warmly.`,
        shadow: `The risk is that this easy warmth makes it hard to say something genuinely difficult or unwelcome, since your instinct moves toward keeping things light rather than staying with something that needs to land seriously. You might notice you soften a necessary hard message before it's actually been fully delivered.`,
        path: `Try saying one difficult thing without the warmth softening it into something easier to hear than it should be. You are allowed to deliver something serious without brightening it. What hard message have you diluted before it actually landed?`,
        positive: `Your easy, warm way of expressing yourself is still real and still a genuine gift — that hasn't changed — but you've delivered at least one difficult message without softening it into something easier than it needed to be. Your voice can carry weight now, not just warmth.`,
        negative: `Your easy access to warm expression is genuine, and it makes delivering something genuinely difficult or unwelcome harder, since your instinct moves toward lightness rather than letting something serious actually land. You might notice you've diluted a hard message before it was fully delivered.`,
      },
      20: {
        heading: `Your Voice Is Waiting to Say the Thing You Already Know`,
        why: `Vishuddha asks how you communicate — and Judgement answers through an unanswered call: there's something you already know you're meant to say, and you haven't fully said it yet. This isn't vague — you likely know exactly what it is and who needs to hear it.`,
        shadow: `The risk is that the postponement produces a persistent sense of something unfinished, a message waiting to be delivered, without the waiting ever being connected to the specific thing you already know. You might notice a nagging sense that you haven't said something you're meant to say.`,
        path: `Try saying the thing you already know you're meant to say, to the person it's actually for. You are allowed to speak it before you feel fully ready. What have you sensed you're meant to say that you haven't yet said?`,
        positive: `You've said the thing you'd already known you were meant to say, and something has settled because of it — not because everything is resolved, but because the waiting has ended. The nagging sense of unfinished business has quieted.`,
        negative: `Something you already know you're meant to say is still unsaid, and the postponement is producing a persistent, nagging sense of unfinished business. You might notice you feel that something's incomplete, without quite connecting it to the specific thing you already know you haven't said.`,
      },
      21: {
        heading: `You Express Yourself Most Fully When You Can See the Whole Picture`,
        why: `Vishuddha asks how you communicate — and the World answers through integration: you say things most completely once you understand how they fit into the larger context, rather than expressing an isolated fragment. That's genuine, sophisticated expression — communication that comes from a wide view.`,
        shadow: `The risk is that this need for the whole picture delays expression on things you're actually ready to say, waiting for a comprehensive context that isn't always necessary. You might notice you hold back a straightforward statement because you haven't yet worked out how it connects to everything else.`,
        path: `Try saying one isolated thing plainly, without needing to first explain how it fits the larger picture. You are allowed to express a fragment without the whole context. What simple thing have you delayed saying because you were waiting to explain how it all connects?`,
        positive: `Your expression through the whole, integrated picture is still real and still sophisticated — that hasn't changed — but you've said something isolated and plain too, without needing the full context first. Your voice is more available now, not gated behind needing to see everything at once.`,
        negative: `Your expression tends to wait for the whole picture, so straightforward things you're actually ready to say get delayed while you work out how they connect to everything else. You might notice you hold back a simple statement because the larger context isn't yet clear to you.`,
      },
      22: {
        heading: `You Express Yourself Freely, Trusting the Words Will Come`,
        why: `Vishuddha asks how you communicate — and the Fool answers through openness: you speak without needing to know exactly how it'll land, trusting the words as you go rather than scripting them fully in advance. That's genuine, courageous expression — spontaneous and alive.`,
        shadow: `The risk is that this spontaneous trust avoids the different value of careful, prepared expression, so situations that actually needed forethought get the same improvisational approach as everything else. You might notice you wing something that genuinely deserved preparation, and it shows.`,
        path: `Try preparing one important thing you'd normally say spontaneously. You are allowed to combine your natural openness with real preparation sometimes. What upcoming conversation could use more forethought than your usual improvisation?`,
        positive: `Your spontaneous, trusting way of speaking is still fully real — that openness isn't going anywhere — but you've prepared at least one important conversation in advance instead of relying purely on improvisation. Your voice is more grounded now for the moments that actually needed it.`,
        negative: `Your trust in spontaneous expression is genuine, and it's being applied even to situations that actually needed forethought, so something that deserved preparation gets the same improvisational approach as everything else. You might notice a conversation that could have used real preparation instead got winged, and it showed.`,
      },
    },

    ajna: {
      1: {
        heading: `Your Insight Arrives Ready to Act On`,
        why: `Ajna asks how clarity actually shows up for you — and the Magician answers through immediate application: your intuition arrives already pointed toward action, less a quiet knowing than a felt directive to do something. That's real perceptive intelligence, expressed through initiative rather than contemplation.`,
        shadow: `The risk is that insight you haven't yet verified gets acted on with the same confidence as insight you have, since your instinct is to move on a perception rather than sit with it first. You might notice you've acted on a hunch that turned out to be wrong, simply because it arrived with the same urgency as your accurate ones.`,
        path: `Try sitting with one piece of insight before acting on it, checking whether it holds up under a moment's scrutiny. You are allowed to pause between perceiving and doing. What have you acted on recently that deserved a beat of verification first?`,
        positive: `Your insight still arrives with real urgency, pointed toward action — that hasn't changed — but you've started giving at least the significant ones a beat of verification before moving. Your intuition is landing more accurately now, because it's not acted on quite so automatically.`,
        negative: `Your insight arrives fused with an urge to act immediately, so unverified perceptions get the same confident follow-through as your accurate ones. You might notice you've moved on a hunch that turned out wrong, simply because it felt exactly as urgent as the ones that were right.`,
      },
      2: {
        heading: `Your Insight Is Deep, and It Mostly Stays With You`,
        why: `Ajna asks how clarity shows up for you — and the High Priestess answers at full strength: this is your native register, perception that runs well below the surface and arrives with real accuracy. That depth is genuinely yours, and the question is less about having insight than about what you do with it.`,
        shadow: `The risk is that this deep perceptiveness stays entirely internal, so the accuracy of your insight benefits only you, never reaching the people or situations it could actually help. You might notice you see something clearly and simply hold it, rather than letting it inform anyone beyond yourself.`,
        path: `Try letting one piece of deep insight actually reach someone else, spoken plainly rather than kept private. You are allowed to let your perception be useful beyond your own understanding. What have you seen clearly that could help someone if you actually said it?`,
        positive: `Your deep, accurate insight is still exactly as real as it's always been — that hasn't changed — but you've let some of it reach other people now, instead of keeping the perception entirely internal. Your clarity is doing work in the world, not just informing your own private understanding.`,
        negative: `Your insight runs genuinely deep and stays almost entirely private, which means its accuracy benefits only you, never reaching people or situations that could use it. You might notice you perceive something important and simply hold it, rather than letting it inform anyone beyond yourself.`,
      },
      3: {
        heading: `Your Insight Comes Through What You Sense in a Room or a Body`,
        why: `Ajna asks how clarity shows up for you — and the Empress answers through embodied perception: you read situations through atmosphere, through what you sense in the physical and relational field around you, rather than through abstract analysis. That's real intelligence, felt through the body rather than reasoned through the head.`,
        shadow: `The risk is that this embodied knowing doesn't always translate into language other people can follow, so your accurate perceptions can come across as vague feelings rather than as the substantive insight they actually are. You might notice people dismiss something you sensed correctly because you couldn't yet explain why you knew it.`,
        path: `Try translating one embodied perception into concrete, specific language, even if the translation feels approximate. You are allowed to put words to what you sense, imperfectly. What have you correctly felt in a room that you've never been able to actually articulate?`,
        positive: `Your embodied, felt perception is still real and still accurate — that hasn't changed — but you've translated more of it into concrete language now, so people can actually follow what you sensed instead of dismissing it as vague. Your insight lands as substance now, not just atmosphere.`,
        negative: `Your embodied perception is genuinely accurate, and it stays largely untranslated into language, so what you correctly sense gets received as a vague feeling rather than as real insight. You might notice people dismiss something you knew was true simply because you couldn't yet explain why.`,
      },
      4: {
        heading: `Your Insight Comes Through Structure and Pattern`,
        why: `Ajna asks how clarity shows up for you — and the Emperor answers through systems: you see clearly by identifying structure, by understanding how the pieces of a situation organize into a pattern. That's real analytical intelligence, and it tends to be reliable — you rarely misread the underlying shape of things.`,
        shadow: `The risk is that this pattern-based clarity can dismiss information that doesn't fit the structure you've already identified, so a genuinely relevant outlier gets filtered out simply because it breaks the pattern. You might notice you've discounted something true because it didn't match the system you'd already mapped.`,
        path: `Try taking one piece of information that doesn't fit your current pattern seriously, instead of filtering it out. You are allowed to let an outlier revise the structure. What have you dismissed because it broke a pattern you were confident in?`,
        positive: `Your ability to see structure and pattern clearly is still real and still generally reliable — that hasn't changed — but you've let at least one genuine outlier revise your understanding, instead of filtering it out because it didn't fit. Your clarity includes the exceptions now, not just the pattern.`,
        negative: `Your pattern-based clarity is genuine, and it can dismiss information that doesn't fit the structure you've already mapped, filtering out a relevant outlier simply because it breaks the shape. You might notice you've discounted something true because it didn't match the pattern you were confident in.`,
      },
      5: {
        heading: `Your Insight Is Filtered Through What You Already Believe`,
        why: `Ajna asks how clarity shows up for you — and the Hierophant answers through interpretation: you understand situations by running them through a framework you trust, and that framework genuinely sharpens your perception most of the time. That's real, grounded clarity — insight with context behind it.`,
        shadow: `The risk is that anything the framework didn't anticipate becomes hard to actually see clearly, since your perception is filtered through a lens that wasn't built to register it. You might notice you've missed something obvious to someone outside your framework, simply because your own lens had no place for it.`,
        path: `Try perceiving one situation without running it through your usual framework first. You are allowed to see something the framework wasn't built to notice. What might you be missing that simply doesn't fit the lens you usually use?`,
        positive: `Your framework-sharpened clarity is still real and still generally reliable — that hasn't changed — but you've perceived at least one thing without running it through the usual lens first, catching something your framework wasn't built to register. Your insight has more range now.`,
        negative: `Your clarity is filtered through a framework that sharpens most of your perception, and anything the framework didn't anticipate becomes genuinely hard to see, since your lens has no place for it. You might notice you've missed something that was obvious to someone without your particular framework.`,
      },
      6: {
        heading: `Your Insight Sharpens in Relationship, Dulls in Isolation`,
        why: `Ajna asks how clarity shows up for you — and the Lovers answer through connection: your perception genuinely gets clearer when you're talking something through with someone you trust, rather than when you're working it out entirely alone. That's a real and valid mode of insight — relational rather than solitary.`,
        shadow: `The risk is that without someone to think alongside, your clarity noticeably dims, leaving you less confident in situations that require you to perceive something on your own. You might notice you doubt an insight you'd trust completely if you'd arrived at it in conversation, simply because you got there alone.`,
        path: `Try trusting one piece of insight you arrived at entirely alone, without needing to verify it through conversation first. You are allowed to perceive clearly by yourself. What have you doubted simply because no one else was there when you figured it out?`,
        positive: `Your clarity through relationship and shared thinking is still real and still one of your genuine strengths — that hasn't changed — but you've trusted at least one insight you reached entirely alone, without needing conversation to verify it. Your perception works solo now too, not only in dialogue.`,
        negative: `Your clarity genuinely sharpens through relationship and dims in isolation, which leaves you less confident in insight you arrive at on your own. You might notice you doubt a perception you'd trust completely if someone else had helped you reach it, simply because you got there by yourself.`,
      },
      7: {
        heading: `Your Insight Comes Fast, in the Middle of Moving`,
        why: `Ajna asks how clarity shows up for you — and the Chariot answers through momentum: your best perception often arrives mid-action, while you're already moving toward something, rather than during deliberate stillness. That's real, dynamic intelligence — clarity generated by motion, not despite it.`,
        shadow: `The risk is that insight generated in motion doesn't get the scrutiny that stiller perception would, so you can act on a fast read that would have benefited from a second look. You might notice you've committed to something based on a mid-motion insight that a moment's pause would have caught wasn't quite right.`,
        path: `Try pausing the motion once, briefly, to check a fast insight before committing to it fully. You are allowed to stop moving long enough to verify what you just perceived. What fast read have you acted on that deserved one more moment of scrutiny?`,
        positive: `Your clarity generated in motion is still real and still genuinely valuable — that hasn't changed — but you've paused at least once to check a fast insight before fully committing to it. Your perception is as quick and more accurate now, because it occasionally gets that extra moment.`,
        negative: `Your insight arrives fast, mid-motion, and it doesn't always get the scrutiny that stiller perception would, so you can act on a read that a pause would have caught wasn't quite right. You might notice you've committed to something based on a fast insight that needed one more moment of checking.`,
      },
      8: {
        heading: `Your Insight Sees Where Things Are Out of Balance`,
        why: `Ajna asks how clarity shows up for you — and Justice answers through discernment: you perceive imbalance, unfairness, or misalignment with real accuracy, often before anyone else names it. That's genuine analytical strength — a sharp eye for what doesn't add up.`,
        shadow: `The risk is that this accuracy about what's wrong can crowd out equal attention to what's actually working, so your clarity skews toward problems and imbalances while missing what's genuinely fine. You might notice your read on a situation is almost entirely about what's off, with little room left for what's solid.`,
        path: `Try naming one thing that's actually balanced or working well in a situation you're assessing, with the same precision you'd give to what's wrong. You are allowed to perceive what's fine, not only what's off. What in your current situation deserves credit your usual scan tends to skip?`,
        positive: `Your sharp eye for imbalance and misalignment is still real and still valuable — that hasn't changed — but you've started naming what's actually working too, with the same precision you give to what's off. Your read on situations is more complete now, not just more critical.`,
        negative: `Your accuracy in spotting imbalance is genuine, and it crowds out equal attention to what's actually working, so your clarity skews toward what's wrong while missing what's genuinely fine. You might notice your assessment of a situation is almost entirely about the problems, with little credit given to what's solid.`,
      },
      9: {
        heading: `Your Insight Requires Real Solitude to Fully Form`,
        why: `Ajna asks how clarity shows up for you — and the Hermit answers through withdrawal: your best perception needs quiet, needs distance from other people's input, to actually crystallize. That's a real and legitimate mode of insight — you think most clearly alone.`,
        shadow: `The risk is that this need for solitude to think clearly makes real-time, in-conversation insight difficult to access, so you can go quiet in exactly the moments someone needs your perception immediately. You might notice your best thinking arrives well after the conversation that needed it has ended.`,
        path: `Try offering a rougher, real-time version of your insight in conversation, rather than waiting for the solitary clarity that comes later. You are allowed to think out loud imperfectly. Where has your best insight arrived too late because you needed to be alone to find it first?`,
        positive: `Your need for solitude to reach your clearest thinking is still real and still produces your best insight — that hasn't changed — but you've offered a rougher, real-time version of your perception in conversation too, instead of always waiting for the solitary clarity. You can contribute in the moment now, not only afterward.`,
        negative: `Your clearest insight requires real solitude to form, which makes real-time perception difficult to access, leaving you quiet in exactly the moments someone needed your read immediately. You might notice your best thinking consistently arrives after the conversation that needed it has already ended.`,
      },
      10: {
        heading: `Your Clarity Rises and Falls With the Turning`,
        why: `Ajna asks how clarity shows up for you — and the Wheel answers honestly: your capacity for insight isn't constant, it moves with circumstance and cycle. That's an accurate read of how your perception actually works — sharp in some seasons, foggier in others — rather than a flaw in your underlying intelligence.`,
        shadow: `The risk is that during a foggy turn, you interpret the unclear stretch as evidence your insight was never reliable, rather than recognizing it as a temporarily quieter season. You might notice you distrust your own perception during down periods, treating a current fog as a permanent verdict on your clarity.`,
        path: `Try trusting a smaller insight during a foggy turn, even without your usual confidence behind it. You are allowed to perceive imperfectly during the low seasons instead of waiting for full clarity to return. What could you trust yourself to notice right now, even in a quieter register than usual?`,
        positive: `Your clarity still genuinely rises and falls with the cycle — that rhythm hasn't changed — but you've learned to trust smaller insights even during the foggier turns, instead of waiting for full sharpness to return. The quiet seasons don't undermine your actual perceptiveness the way they used to.`,
        negative: `Your insight moves in real cycles, and during the foggy turns you tend to read the unclear stretch as evidence your perception was never reliable, rather than simply quieter for now. You might notice you distrust yourself during down periods, treating a temporary fog as a permanent judgment on your clarity.`,
      },
      11: {
        heading: `Your Insight Stays Steady, Even Under Real Pressure`,
        why: `Ajna asks how clarity shows up for you — and Strength answers through gentle endurance: your perception holds up even when a situation is genuinely stressful, without your mind hardening into panic or shutting down. That's a real and rare gift — clarity that survives pressure.`,
        shadow: `The risk is that this steady clarity under strain gets taken for granted, so people rely on your calm perception in crisis without checking what maintaining it is actually costing you. You might notice you're the clear-headed one in every difficult situation, with no one noticing what that steadiness requires.`,
        path: `Try naming the effort it takes to stay clear under pressure, to someone who relies on that steadiness. You are allowed to be calm and still say this is asking something of me. What crisis have you stayed clear-headed through without anyone knowing what it cost you?`,
        positive: `Your steady clarity under real pressure is still real and still a genuine gift — that hasn't changed — but you've named the cost of it at least once, to someone who needed to know what staying clear-headed actually required of you. Your perception holds, and now so does an honest limit.`,
        negative: `Your steady clarity under pressure is genuine, and it's being taken for granted, with people relying on your calm perception in crisis without checking what maintaining it is costing you. You might notice you're the clear-headed one repeatedly, without anyone recognizing what that steadiness requires.`,
      },
      12: {
        heading: `Your Clarity Arrives Once You've Stopped Trying to Force It`,
        why: `Ajna asks how clarity shows up for you — and the Hanged Man answers through surrender: your best insight often comes precisely when you stop actively pursuing an answer, when you let the question rest instead of grinding on it. That's a real, mature form of perception — clarity through release rather than effort.`,
        shadow: `The risk is that this reliance on release generalizes into passivity about questions that actually need active investigation, so you wait for insight to arrive on its own in situations that would benefit from you actually pursuing an answer. You might notice you've been waiting for clarity on something that needed research or direct inquiry instead.`,
        path: `Try actively investigating one question you've been waiting to receive clarity on passively. You are allowed to pursue an answer sometimes, not only wait for it to arrive. What have you been waiting to understand that actually needs you to go looking?`,
        positive: `Your capacity for clarity through release — letting an answer arrive rather than forcing it — is still real and still often works — but you've actively pursued at least one answer that actually needed investigation, instead of waiting passively. Both modes are available to you now.`,
        negative: `Your reliance on clarity arriving through release has generalized into passivity about questions that actually need active investigation, so you wait for insight on things that would benefit from you actually pursuing an answer. You might notice you've been waiting to understand something that needed direct inquiry instead.`,
      },
      13: {
        heading: `Your Insight Was Tested by Real Loss, and It Proved Itself`,
        why: `Ajna asks how clarity shows up for you — and Transformation answers through demonstrated resilience: your perception has been tested by genuine upheaval, and it held — you saw clearly enough, during real difficulty, to find your way through. That's hard-won, credible insight.`,
        shadow: `The risk is that you start expecting every clarity to require that level of crisis to prove itself, so a calm, ordinary insight feels somehow less trustworthy than one forged under pressure. You might notice you discount a clear, quiet perception simply because it didn't arrive through struggle.`,
        path: `Try trusting one piece of insight that arrived easily, without needing it to have been earned through difficulty. You are allowed to have clarity that didn't cost you anything. What clear, easy perception have you discounted because it wasn't forged in crisis?`,
        positive: `Your insight, tested and proven through real difficulty, is still hard-won and completely credible — that hasn't changed — but you've trusted at least one piece of clarity that arrived easily too, without needing it to be earned through struggle. Insight counts now, even when it didn't cost you anything.`,
        negative: `Your capacity for insight was genuinely proven through real difficulty, and some part of you now expects every clarity to require that level of crisis, discounting a calm or easy perception as somehow less trustworthy. You might notice you dismiss a clear read that arrived without struggle.`,
      },
      14: {
        heading: `Your Insight Comes From Weighing Multiple Angles at Once`,
        why: `Ajna asks how clarity shows up for you — and Temperance answers through synthesis: your best perception comes from holding several perspectives simultaneously and finding the balanced read between them. That's real, sophisticated intelligence — clarity through integration rather than a single sharp angle.`,
        shadow: `The risk is that this need to weigh multiple angles slows your perception down considerably, so situations that actually call for a fast, single-angle read get delayed while you're still synthesizing. You might notice you're still weighing perspectives on something that needed an immediate call.`,
        path: `Try trusting a single-angle read on one situation, without waiting to synthesize every perspective first. You are allowed to perceive quickly sometimes, not only thoroughly. What decision needed a fast call that your usual synthesis has been delaying?`,
        positive: `Your synthesized, multi-angle clarity is still real and still your natural strength — that hasn't changed — but you've trusted a fast, single-angle read at least once, when the situation actually called for speed over synthesis. You have both registers available now.`,
        negative: `Your need to weigh multiple angles before reaching clarity slows your perception down considerably, so situations that actually call for a fast, single read get delayed while you're still synthesizing. You might notice you're still weighing perspectives on something that needed an immediate call.`,
      },
      15: {
        heading: `Your Insight Sees What You May Not Want to Admit You See`,
        why: `Ajna asks how clarity shows up for you — and the Devil answers honestly: some of your sharpest perception is about things you'd rather not acknowledge — your own patterns, someone's manipulation, a truth that implicates you too. That accuracy is real, and the question is whether you can look at what you see rather than looking away.`,
        shadow: `The risk is that looking away from an accurate but uncomfortable perception doesn't make it stop being true, it just means you're acting without acknowledging what you already know. You might notice you've perceived something clearly and then behaved as though you hadn't.`,
        path: `Try naming, to yourself, one uncomfortable thing you've clearly seen and been avoiding acknowledging. You are allowed to know something without it meaning you have to act on it immediately. What have you perceived accurately and quietly refused to admit you saw?`,
        positive: `Your capacity to see uncomfortable truths clearly is still exactly as sharp as it's always been — that was never the problem — but you've started acknowledging what you see instead of looking away from it, which has taken most of its unconscious grip away. Knowing something now means actually knowing it.`,
        negative: `Your insight sees uncomfortable truths accurately, and looking away from them doesn't make them stop being true, it just means you're acting without acknowledging what you already know. You might notice you've perceived something clearly and then behaved as though you hadn't.`,
      },
      16: {
        heading: `Your Clarity Was Shaken, and You're Rebuilding Trust in It`,
        why: `Ajna asks how clarity shows up for you — and the Tower answers from disruption: something sudden once proved a perception of yours badly wrong, and you've been rebuilding your trust in your own insight since. That rebuilding is real progress, not evidence your perception was ever fundamentally unreliable.`,
        shadow: `The risk is staying braced against trusting your own clarity fully, hedging your insight as a precaution against being wrong again the way you once were. You might notice you undersell a perception you're actually confident in, as if claiming it fully would invite another collapse.`,
        path: `Try trusting one insight fully, without the hedge you've built in since being wrong before. You are allowed to trust your own clarity completely again. Where have you been underselling a perception you're actually sure of?`,
        positive: `You're still rebuilding trust in your own clarity after a real past collapse — that process continues, and that's fine — but you've trusted an insight fully at least once, without the protective hedge. Trusting your own perception is starting to feel safe again.`,
        negative: `Your trust in your own clarity was genuinely shaken by a real past mistake, and you're still hedging your insight as an unconscious precaution against being wrong again. You might notice you undersell perceptions you're actually confident in, as though claiming them fully would invite the same collapse.`,
      },
      17: {
        heading: `Your Insight Is Hopeful, Even When It's Quiet About It`,
        why: `Ajna asks how clarity shows up for you — and the Star answers through quiet hope: your perception carries an undertone of trust that things will work out, even when you don't say that hope loudly. That hopeful register genuinely colors how you read situations, even at low volume.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps your insight modest, so you perceive possibility at a fraction of what you're actually capable of seeing. You might notice you read a situation more cautiously than your actual sense of it, because the hope underneath has been pre-limited.`,
        path: `Try letting your hopeful read of a situation be fully sized, at least once, without the protective downgrade. You are allowed to perceive possibility at full volume. What hopeful insight have you been keeping quiet that deserves to be trusted at its real size?`,
        positive: `Your hopeful, quietly trusting way of perceiving is still real and still genuinely yours — but you've let it be fully sized at least once, instead of pre-guarded against disappointment. Your insight includes more of your actual sense of possibility now.`,
        negative: `Your perception carries real hope, kept deliberately modest to protect against disappointment, which means you often read situations more cautiously than your actual sense of them. You might notice you underclaim your own perceived possibility, because the hope underneath has been pre-limited.`,
      },
      18: {
        heading: `Your Insight Is Real but Hard to Fully Trust`,
        why: `Ajna asks how clarity shows up for you — and the Moon answers honestly: your perception is genuine but often foggy, harder to distinguish from anxiety or projection than it is for most people. That's not a flaw in your actual perceptiveness — it's an accurate reflection of how much of your insight arrives tangled with other material.`,
        shadow: `The risk is that this fog keeps you from acting on insight that's actually accurate, since you can't always tell it apart from fear or absorbed atmosphere. You might notice you second-guess a perception that turns out to have been correct, simply because you couldn't verify it was insight rather than anxiety in the moment.`,
        path: `Try tracing one piece of foggy perception back to its source — checking whether it's genuine insight or something else you've absorbed. You are allowed to trust clarity you've actually sorted from noise. What insight have you doubted that might have been more accurate than you gave it credit for?`,
        positive: `Your perception is still genuinely harder to sort from anxiety or projection than most people's — that hasn't fully changed — but you've traced at least one foggy insight back to its source, and found it was accurate. You can trust more of your own clarity now, because you've done the sorting work.`,
        negative: `Your insight is real, and the fog around distinguishing it from anxiety or projection keeps you from acting on perception that's actually accurate. You might notice you second-guess a read that later turns out correct, because you couldn't verify in the moment it was genuine insight.`,
      },
      19: {
        heading: `Your Insight Comes Easily, Warm and Confident`,
        why: `Ajna asks how clarity shows up for you — and the Sun answers simply: perception comes readily to you, without much internal struggle, and you tend to trust what you see without excessive second-guessing. That's a real gift — not everyone has such straightforward access to confident clarity.`,
        shadow: `The risk is that this easy confidence in your own perception makes it hard to acknowledge the moments you're genuinely uncertain, since doubt feels foreign to your usual mode. You might notice you present a read as more certain than it actually is, because admitting uncertainty feels unfamiliar.`,
        path: `Try naming one genuine uncertainty honestly, without dressing it up as confident insight. You are allowed to not know something clearly, sometimes. What perception have you presented as more certain than it actually was?`,
        positive: `Your easy, confident access to your own perception is still real and still a genuine gift — that hasn't changed — but you've named real uncertainty honestly at least once, instead of defaulting to confidence past the point it was warranted. Your clarity is more accurately calibrated now.`,
        negative: `Your easy confidence in your own perception is genuine, and it makes real uncertainty hard to acknowledge, since doubt feels unfamiliar to your usual mode. You might notice you present a read as more certain than it actually is, because admitting you're unsure doesn't come naturally.`,
      },
      20: {
        heading: `Your Insight Is Waiting on a Conclusion You Haven't Fully Reached`,
        why: `Ajna asks how clarity shows up for you — and Judgement answers through an unanswered call: there's something you already sense you're meant to understand or conclude, and you haven't fully let yourself land there yet. This isn't vague — you likely know exactly what you're circling.`,
        shadow: `The risk is that the postponement produces a persistent sense of unresolved thinking, a conclusion hovering just out of reach, without the hovering ever being connected to the specific thing you already sense. You might notice a nagging incompleteness in your own understanding of something important.`,
        path: `Try letting yourself actually reach the conclusion you've been circling. You are allowed to land on the understanding before you feel fully certain. What have you sensed you're meant to conclude that you haven't yet let yourself fully land on?`,
        positive: `You've let yourself reach the conclusion you'd been circling, and something has settled in your own understanding because of it — not because everything is resolved, but because the circling has ended. The nagging incompleteness has quieted.`,
        negative: `Something you already sense you're meant to conclude is still unreached, and the postponement is producing a persistent incompleteness in your own understanding. You might notice a nagging sense that your thinking on something important is unresolved, without connecting it to the specific conclusion you're actually circling.`,
      },
      21: {
        heading: `Your Insight Is Most Complete When You Can See the Whole System`,
        why: `Ajna asks how clarity shows up for you — and the World answers through integration: your deepest perception comes when you can see how everything connects, understanding a situation as a whole system rather than an isolated fragment. That's genuine, sophisticated clarity — insight through wholeness.`,
        shadow: `The risk is that this need for the whole system delays perception on things you're actually ready to understand, waiting for comprehensive context that isn't always necessary. You might notice you withhold a straightforward read because you haven't yet worked out how it fits everything else.`,
        path: `Try trusting a single, isolated insight, without needing to first see how it connects to the whole system. You are allowed to perceive a fragment clearly. What simple read have you delayed trusting because the larger context wasn't yet clear?`,
        positive: `Your integrated, whole-system clarity is still real and still sophisticated — that hasn't changed — but you've trusted an isolated insight too, without needing the full context first. Your perception is more available now, not gated behind needing to see everything at once.`,
        negative: `Your clarity tends to wait for the whole system, so straightforward perceptions you're actually ready to trust get delayed while you work out how they connect to everything else. You might notice you withhold a simple, accurate read because the larger context isn't yet clear to you.`,
      },
      22: {
        heading: `Your Insight Trusts What It Can't Yet Explain`,
        why: `Ajna asks how clarity shows up for you — and the Fool answers through faith: you trust a perception before you can fully justify it, willing to act on insight that hasn't been proven yet. That's genuine, courageous clarity — perception as an act of faith in your own knowing.`,
        shadow: `The risk is that this trust in unproven insight avoids the different value of verified, tested understanding, so you keep acting on fresh hunches without ever building the deeper, confirmed knowledge that would make future insight more reliable. You might notice you rarely circle back to check whether a past hunch was actually right.`,
        path: `Try verifying one past insight after the fact, checking whether it actually held up. You are allowed to trust your intuition and also build a track record of it. What hunch from your past could you check now, to learn something about how your own insight actually performs?`,
        positive: `Your trust in unproven, fresh insight is still fully real — that courage isn't going anywhere — but you've started verifying past hunches too, building an actual track record of how your perception performs. Your clarity is more grounded now, not just braver.`,
        negative: `Your trust in unproven insight is genuine, and it's being used to skip the slower work of building verified understanding, so you keep acting on fresh hunches without ever checking whether past ones actually held up. You might notice you rarely circle back to learn how your own intuition actually performs over time.`,
      },
    },

    sahasrara: {
      1: {
        heading: `You Connect to Meaning by Actively Creating It`,
        why: `Sahasrara asks how you access a sense of something larger than yourself — and the Magician answers through initiation: you find meaning by making it, by generating purpose through your own action rather than discovering it already present. That's genuine spiritual connection, built rather than received.`,
        shadow: `The risk is that meaning entirely self-generated never gets to simply rest, since you can't stop producing purpose long enough to trust that connection might exist without your continued effort. You might notice stillness feels like disconnection, because your sense of meaning has never been tested apart from your own initiative.`,
        path: `Try sitting in stillness without generating any meaning, just to notice whether connection is there anyway. You are allowed to be part of something larger without actively making it happen. What would it feel like to simply belong, for a moment, without producing anything?`,
        positive: `Your capacity to generate meaning through action is still real and still yours — that hasn't changed — but you've tested stillness enough to find that connection doesn't actually require your constant production. You can simply belong now, sometimes, without needing to make it happen.`,
        negative: `Your sense of meaning stays entirely self-generated, so stillness feels like disconnection rather than rest, because you've never tested whether connection exists apart from your own continued effort. You might notice you can't stop producing purpose long enough to find out.`,
      },
      2: {
        heading: `You Connect to Something Larger Through Quiet, Inner Knowing`,
        why: `Sahasrara asks how you access meaning — and the High Priestess answers at full strength: this is your native register, a felt sense of connection that arrives through stillness and inner perception rather than through belief you can argue for. That depth is genuinely yours.`,
        shadow: `The risk is that this connection stays entirely private, so what you know about meaning and belonging never gets shared with anyone, leaving you spiritually rich and relationally solitary in that particular way. You might notice you've never told anyone what you actually sense about your place in things.`,
        path: `Try naming one piece of your inner sense of connection out loud, to someone you trust. You are allowed to let your private knowing be witnessed. What do you understand about meaning that you've never said to another person?`,
        positive: `Your quiet, inner sense of connection is still real and still deeply yours — that hasn't changed — but you've spoken some of it out loud now, to someone you trust. Your spiritual life has become a little less solitary, without losing any of its depth.`,
        negative: `Your connection to something larger runs genuinely deep and stays almost entirely private, so what you understand about meaning never actually reaches another person. You might notice you've never told anyone what you sense about your own place in things.`,
      },
      3: {
        heading: `You Connect to Something Larger Through Beauty and Abundance`,
        why: `Sahasrara asks how you access meaning — and the Empress answers through the tangible: you feel connected to something larger through beauty, through nature, through the sheer abundance of being alive in a body in the world. That's genuine spiritual connection, embodied rather than abstract.`,
        shadow: `The risk is that this embodied connection gets treated as less legitimate than more austere or abstract forms of meaning, so you undervalue your own real spiritual experience because it doesn't look like traditional contemplation. You might notice you dismiss a moment of genuine connection simply because it happened through pleasure rather than discipline.`,
        path: `Try naming a moment of beauty-based connection as genuinely spiritual, without qualifying it. You are allowed to find meaning through delight, not only through discipline. What experience of beauty have you had that you've never let yourself call sacred?`,
        positive: `Your connection to something larger through beauty and abundance is still real and still genuinely spiritual — that hasn't changed — but you've stopped qualifying it, naming it plainly as meaningful instead of a lesser cousin to more austere connection. Your sense of the sacred includes delight now, fully.`,
        negative: `Your connection through beauty and abundance is genuine, and it gets undervalued, including by you, because it doesn't resemble more austere or contemplative forms of meaning. You might notice you dismiss a real experience of connection simply because it arrived through pleasure.`,
      },
      4: {
        heading: `You Connect to Something Larger Through Order and Purpose`,
        why: `Sahasrara asks how you access meaning — and the Emperor answers through structure: you find connection through a sense of purposeful order, through believing your life has a coherent direction within something larger. That's genuine, grounded meaning — you're not adrift, you're oriented.`,
        shadow: `The risk is that this need for coherent order makes it hard to find meaning in genuine mystery or uncertainty, so anything that doesn't resolve into a clear purpose feels spiritually unsettling rather than simply unknown. You might notice you struggle to sit with a question that has no structure to offer yet.`,
        path: `Try sitting with one genuine spiritual uncertainty without needing it to resolve into order yet. You are allowed to find meaning in the unresolved. What question about your place in things could you let stay open, without forcing it into structure?`,
        positive: `Your connection through purposeful order is still real and still genuinely grounding — that hasn't changed — but you've let one real uncertainty stay open, without forcing it into structure before it was ready. Meaning includes the unresolved now, not only the ordered.`,
        negative: `Your connection depends on a sense of coherent order, which makes genuine mystery or uncertainty hard to sit with, since anything unresolved feels unsettling rather than simply unknown. You might notice you struggle with a real question that doesn't yet offer any structure to hold onto.`,
      },
      5: {
        heading: `You Connect to Something Larger Through Tradition and Belonging`,
        why: `Sahasrara asks how you access meaning — and the Hierophant answers through inheritance: you find connection through belonging to something established, a tradition or framework that others have found meaning in before you. That's genuine, real connection — meaning through membership rather than solitary discovery.`,
        shadow: `The risk is that meaning tied to the tradition can't easily survive real doubt about the tradition, so questioning the framework feels like losing connection itself, rather than examining one particular vessel for it. You might notice you avoid honest questions about your inherited framework because the questioning itself feels spiritually dangerous.`,
        path: `Try questioning one piece of your tradition honestly, and notice whether your actual sense of connection survives the questioning. You are allowed to doubt the framework without losing what it pointed you toward. What have you avoided examining because doubting it felt like losing your connection to meaning itself?`,
        positive: `Your connection through tradition and belonging is still real and still meaningful — that hasn't changed — but you've questioned one piece of the framework honestly, and found your actual sense of connection survived the doubt. You can examine the vessel now without fearing you'll lose what it pointed toward.`,
        negative: `Your connection is tied closely to your tradition, so honest doubt about the framework feels like it threatens meaning itself, rather than simply examining one vessel for it. You might notice you avoid real questions about your inherited framework, because the questioning feels spiritually dangerous.`,
      },
      6: {
        heading: `You Connect to Something Larger Through Love and Chosen Relationship`,
        why: `Sahasrara asks how you access meaning — and the Lovers answer through connection: you find your sense of something larger most clearly through deep relationship, through the experience of genuinely choosing and being chosen. That's real spiritual connection, relational rather than solitary.`,
        shadow: `The risk is that your sense of meaning becomes entirely contingent on the state of your closest relationship, so a rupture or uncertainty there can shake your entire spiritual footing, not just the relationship itself. You might notice your sense of connection to something larger rises and falls with how a single bond is currently going.`,
        path: `Try locating a sense of meaning that doesn't depend on your closest relationship's current state. You are allowed to be affected by love without your entire spiritual footing depending on it. What connects you to something larger that would hold even if that one relationship changed?`,
        positive: `Your connection through love and chosen relationship is still real and still central to how you find meaning — that hasn't changed — but you've located a sense of connection that holds independent of any single relationship's current state. Your spiritual footing is steadier now, less contingent on one bond.`,
        negative: `Your sense of meaning stays closely tied to your closest relationship, so a rupture or uncertainty there can shake your entire spiritual footing, well beyond the relationship itself. You might notice your connection to something larger rises and falls with how one bond is currently going.`,
      },
      7: {
        heading: `You Connect to Something Larger Through Purposeful Momentum`,
        why: `Sahasrara asks how you access meaning — and the Chariot answers through directed motion: you feel connected to something larger when you're actively moving toward a purpose, when your life has clear forward direction. That's genuine, active meaning — connection through pursuit rather than through stillness.`,
        shadow: `The risk is that stillness starts to feel like disconnection, since your sense of meaning is tied so closely to forward motion that pausing can register as spiritually adrift rather than simply at rest. You might notice you can't feel connected to anything larger during a period when you're not actively pursuing a direction.`,
        path: `Try finding a sense of connection during stillness, without needing forward motion to access it. You are allowed to feel part of something larger while stationary. What would meaning feel like if you weren't currently moving toward anything?`,
        positive: `Your connection through purposeful momentum is still real and still genuinely meaningful — that hasn't changed — but you've found a sense of connection during stillness too, without needing forward motion to access it. Meaning holds now, even when you're not currently pursuing a direction.`,
        negative: `Your connection to something larger is tied closely to forward motion, so stillness can register as spiritually adrift rather than simply restful. You might notice you can't access a sense of meaning during a period when you're not actively moving toward a purpose.`,
      },
      8: {
        heading: `You Connect to Something Larger Through a Sense of Rightness`,
        why: `Sahasrara asks how you access meaning — and Justice answers through moral clarity: you feel connected to something larger when you're acting in alignment with what you believe is right, when your life reflects genuine fairness and integrity. That's real spiritual grounding — meaning through ethical coherence.`,
        shadow: `The risk is that any perceived moral failing, even small, can disrupt your entire sense of connection, since meaning is tied so closely to rightness that falling short of it feels like a spiritual rupture rather than an ordinary human lapse. You might notice a minor ethical stumble shakes your sense of meaning disproportionately.`,
        path: `Try letting one ordinary moral imperfection exist without it disrupting your sense of connection to something larger. You are allowed to fall short sometimes and still be spiritually grounded. What small lapse have you let disproportionately unsettle your sense of meaning?`,
        positive: `Your connection through moral clarity and rightness is still real and still genuinely grounding — that hasn't changed — but you've let an ordinary imperfection exist without it disrupting your larger sense of meaning. Your spiritual footing survives small human lapses now.`,
        negative: `Your connection is tied closely to a sense of rightness, so even a small perceived moral failing can disrupt your entire sense of meaning, treating an ordinary lapse as a spiritual rupture. You might notice a minor ethical stumble shakes your connection disproportionately to its actual weight.`,
      },
      9: {
        heading: `You Connect to Something Larger in Solitude, Away From Everyone`,
        why: `Sahasrara asks how you access meaning — and the Hermit answers through withdrawal: your clearest sense of connection to something larger comes in solitude, away from other people's noise and expectation. That's real, legitimate spiritual access — you meet the larger thing alone.`,
        shadow: `The risk is that this need for solitude to access meaning makes shared spiritual experience feel diluted or unnecessary, so you miss out on the real, different value of finding connection alongside other people. You might notice you avoid communal or shared spiritual moments, assuming solitude is the only legitimate path for you.`,
        path: `Try seeking connection to something larger in the presence of other people, at least once, without retreating into solitude first. You are allowed to find meaning alongside someone else, not only alone. What shared spiritual experience have you avoided, assuming it wouldn't offer what solitude does?`,
        positive: `Your solitary access to connection is still real and still your clearest register — that hasn't changed — but you've sought meaning alongside other people too, at least once, instead of assuming solitude was the only legitimate path. Connection can be shared now, as well as solitary.`,
        negative: `Your connection to something larger comes most clearly in solitude, and that need makes shared or communal spiritual experience feel unnecessary, so you miss out on a real, different value that comes from finding meaning alongside others. You might notice you avoid communal moments by default.`,
      },
      10: {
        heading: `Your Sense of Connection Rises and Falls With the Turning`,
        why: `Sahasrara asks how you access meaning — and the Wheel answers honestly: your sense of connection to something larger isn't constant, it moves with circumstance and cycle. That's an accurate read of how it actually works for you — vivid in some seasons, quieter in others — rather than a flaw in your underlying spiritual capacity.`,
        shadow: `The risk is that during a quiet turn, you interpret the distance as evidence connection was never real, rather than recognizing it as a temporarily quieter season. You might notice you stop reaching for meaning during down periods, treating the current distance as a permanent verdict.`,
        path: `Try reaching for a small sense of connection during a quiet turn, even without your usual vividness behind it. You are allowed to stay spiritually engaged during the low seasons instead of waiting for the vivid ones. What small connection could you try to access now, even in a quieter register?`,
        positive: `Your sense of connection still genuinely rises and falls with the cycle — that rhythm hasn't changed — but you've learned to reach for meaning even during the quieter turns, instead of waiting for vividness to return. The low seasons don't feel like total disconnection anymore.`,
        negative: `Your sense of connection to something larger moves in real cycles, and during the quiet turns you tend to read the distance as evidence it was never real, rather than simply quieter for now. You might notice you stop reaching for meaning during down periods, extending the distance longer than the cycle requires.`,
      },
      11: {
        heading: `Your Connection Stays Steady, Even Through Real Difficulty`,
        why: `Sahasrara asks how you access meaning — and Strength answers through gentle endurance: your sense of connection to something larger holds even during genuine hardship, without hardening into bitterness or collapsing into despair. That's a real and rare spiritual gift — faith that survives difficulty gently.`,
        shadow: `The risk is that this steady connection through hardship gets mistaken for not actually being affected by the difficulty, so people around you assume you're fine when you're genuinely struggling, simply because your faith hasn't visibly cracked. You might notice your steadiness lets people miss how hard something actually is for you.`,
        path: `Try naming the difficulty directly, alongside the steady connection, so people don't mistake your faith for an absence of struggle. You are allowed to be spiritually grounded and still say this is genuinely hard. What hardship has your steadiness been quietly masking from the people around you?`,
        positive: `Your steady connection through real difficulty is still genuine and still a rare gift — that hasn't changed — but you've named the underlying hardship directly at least once, so people don't mistake your faith for an absence of struggle. Your steadiness is honest now, not a cover.`,
        negative: `Your connection to something larger holds steady even through genuine hardship, and that steadiness gets mistaken — by others and sometimes by you — for not actually struggling, since your faith hasn't visibly cracked. You might notice people miss how hard something actually is for you, because your spiritual footing looks unshaken.`,
      },
      12: {
        heading: `You Connect to Something Larger Once You've Stopped Trying to Control the Outcome`,
        why: `Sahasrara asks how you access meaning — and the Hanged Man answers through surrender: your deepest sense of connection arrives once you've released your grip on how things are supposed to go, once you can simply trust rather than manage. That's mature, real spiritual connection — meaning through letting go.`,
        shadow: `The risk is that this capacity for surrender generalizes into a spiritual bypass, where you stop engaging with practical decisions that actually need your active participation, mistaking passivity for faith. You might notice you've spiritually "released" something that was actually yours to act on.`,
        path: `Try acting on one practical matter you've been spiritually releasing instead of addressing directly. You are allowed to surrender the outcome and still take the necessary action. What have you framed as letting go that was actually avoidance?`,
        positive: `Your capacity for connection through genuine surrender is still real and still meaningful — that hasn't changed — but you've acted on at least one practical matter you'd been spiritually releasing instead of addressing, distinguishing real surrender from avoidance dressed up as faith. Both trust and action are present now.`,
        negative: `Your capacity for spiritual surrender is genuine, and it's generalized into a bypass where practical matters that actually need your active participation get labeled as things to release. You might notice you've spiritually "let go" of something that was actually yours to act on.`,
      },
      13: {
        heading: `Your Connection to Something Larger Was Tested by Real Loss, and It Held`,
        why: `Sahasrara asks how you access meaning — and Transformation answers through demonstrated resilience: your sense of connection has survived genuine collapse, and you know — not theoretically, but through actual experience — that meaning can be rebuilt after real rupture. That's hard-won, credible faith.`,
        shadow: `The risk is that you start expecting connection to require that level of testing to be genuine, so a calm, untested season of faith feels somehow less real than one forged through crisis. You might notice you discount a peaceful stretch of spiritual connection simply because it hasn't been proven by collapse.`,
        path: `Try trusting one period of untested, easy connection, without needing it to have survived a crisis to count. You are allowed to have faith that didn't cost you anything. What calm spiritual connection have you discounted because it wasn't forged in difficulty?`,
        positive: `Your connection, tested and proven through real loss, is still hard-won and completely credible — that hasn't changed — but you've trusted a calm, untested season of faith too, without needing it to be forged in crisis. Connection counts now, even when it arrived easily.`,
        negative: `Your connection to something larger was genuinely proven through real loss, and some part of you now expects every faith to require that level of testing, discounting a calm season as somehow less real. You might notice you dismiss peaceful connection that hasn't been proven by collapse.`,
      },
      14: {
        heading: `You Connect to Something Larger Through Balance and Integration`,
        why: `Sahasrara asks how you access meaning — and Temperance answers through synthesis: you find connection through holding multiple spiritual perspectives at once, blending rather than choosing a single tradition or framework exclusively. That's real, sophisticated meaning-making — connection through integration.`,
        shadow: `The risk is that this need for balance can prevent you from committing fully to any single spiritual practice or framework, so you stay perpetually blending without the depth that comes from real commitment to one path. You might notice you sample broadly without ever going deep into any single practice.`,
        path: `Try committing to one spiritual practice fully, for a real stretch of time, without blending in alternatives. You are allowed to go deep into one thing instead of wide across many. What single practice could you commit to fully, at least for a season?`,
        positive: `Your connection through balance and integration across multiple perspectives is still real and still sophisticated — that hasn't changed — but you've committed to one practice fully, for a real stretch, without immediately blending in alternatives. You have depth now, alongside your natural breadth.`,
        negative: `Your need for balance across spiritual perspectives can prevent full commitment to any single practice, so you stay perpetually blending without the depth that comes from going deep into one path. You might notice you sample broadly without ever fully committing to any single practice.`,
      },
      15: {
        heading: `Your Connection Is Tangled With Something You May Not Fully Admit`,
        why: `Sahasrara asks how you access meaning — and the Devil answers honestly: your spiritual life is tangled with something you may not fully acknowledge — a need for control, an attachment you can't quite name as spiritual. That complexity is real, and the question is whether you can look at it clearly.`,
        shadow: `The risk is that not fully owning this tangled attachment lets it run your spiritual life from underneath, disguised as devotion when it's actually something else. You might notice a practice or belief that looks like faith but is actually serving a need you haven't named.`,
        path: `Try naming, honestly to yourself, what a particular spiritual attachment is actually serving in you. You are allowed to have a complicated relationship to meaning without it disqualifying your faith. What spiritual practice or belief might be serving a need you haven't looked at directly?`,
        positive: `Your spiritual life's complexity is still exactly as real as it's always been — that was never disqualifying — but you've named what a particular attachment was actually serving, which has loosened its unconscious grip. Your faith is more honest now, because it's no longer running on something unexamined.`,
        negative: `Your spiritual life carries a real, unexamined attachment, and not naming it lets it run things from underneath, disguised as devotion when it's actually serving something else. You might notice a practice or belief that looks like faith but is quietly meeting a need you haven't acknowledged.`,
      },
      16: {
        heading: `Your Connection Was Shattered Once, and You're Rebuilding Your Faith`,
        why: `Sahasrara asks how you access meaning — and the Tower answers from disruption: something sudden once broke your sense of connection to something larger, and you've been rebuilding your faith since. That rebuilding is real and ongoing — the capacity for connection was never destroyed, only shaken.`,
        shadow: `The risk is staying braced against trusting connection fully again, hedging your faith as a precaution against another sudden collapse. You might notice you hold back the full extent of your spiritual trust, as if declaring it fully would invite the next rupture.`,
        path: `Try trusting one piece of connection fully, without the hedge you've built in since the collapse. You are allowed to have faith completely again. What have you been holding back spiritually out of a learned caution?`,
        positive: `You're still rebuilding your faith after a real spiritual collapse — that process is ongoing and that's fine — but you've trusted connection fully at least once, without the protective hedge. Faith is starting to feel survivable again, not just theoretically possible.`,
        negative: `Your sense of connection was genuinely shattered at some point, and you're still bracing against trusting it fully again, hedging your faith as an unconscious precaution against another collapse. You might notice you hold back the full extent of your spiritual trust.`,
      },
      17: {
        heading: `Your Connection Is Hopeful, Even When You Keep It Quiet`,
        why: `Sahasrara asks how you access meaning — and the Star answers through quiet hope: your sense of connection to something larger carries a guarded trust that things — and you — are ultimately held by something good. That hopeful register is genuine, even when you don't say it loudly.`,
        shadow: `The risk is that keeping the hope modest to protect it also keeps your sense of connection modest, so you experience a diluted version of a faith that's actually considerable. You might notice you underclaim your own spiritual trust, because the hope underneath it has been pre-limited.`,
        path: `Try letting your spiritual hope be fully sized, at least once, without the protective downgrade. You are allowed to trust fully that things are held by something good. What hopeful connection have you been keeping quiet that deserves to be claimed at its real size?`,
        positive: `Your hopeful, quietly trusting connection to something larger is still real and still genuinely yours — but you've let it be fully sized at least once, instead of pre-guarded against disappointment. Your faith carries more of your actual hope now, not the deliberately modest version.`,
        negative: `Your connection carries real hope, kept deliberately modest to protect against disappointment, which means you experience a diluted version of a faith that's actually considerable. You might notice you underclaim your own spiritual trust, because the hope underneath has been pre-limited.`,
      },
      18: {
        heading: `Your Connection Is Real but Hard to Fully Trust`,
        why: `Sahasrara asks how you access meaning — and the Moon answers honestly: your sense of connection to something larger is genuine but often foggy, harder to distinguish from wishful thinking or fear than it is for most people. That's not a deficiency in your actual faith — it's an accurate reflection of how much of it lives below clear certainty.`,
        shadow: `The risk is that this fog keeps you from trusting a connection that's actually real, since you can't always tell it apart from something else you're feeling. You might notice you doubt a genuine spiritual experience simply because you couldn't verify it was real connection rather than something else.`,
        path: `Try trusting one experience of connection without needing to fully verify it first. You are allowed to have faith you've sorted from doubt, even imperfectly. What spiritual experience have you dismissed that might have been more real than you gave it credit for?`,
        positive: `Your connection is still genuinely harder to distinguish from doubt or projection than most people's — that hasn't fully changed — but you've trusted at least one experience without needing full verification first, and found it held. You can trust more of your own faith now, because you've done some of the sorting.`,
        negative: `Your connection to something larger is real, and the fog around distinguishing it from wishful thinking or fear keeps you from trusting experiences that are actually genuine. You might notice you dismiss a real spiritual moment simply because you couldn't verify it in the moment it happened.`,
      },
      19: {
        heading: `Your Connection Is Warm, Open, and Easy to Access`,
        why: `Sahasrara asks how you access meaning — and the Sun answers simply: your sense of connection to something larger comes easily and warmly, without much internal struggle. That's a real gift — not everyone has such straightforward access to faith — and your spiritual life tends to feel generous rather than effortful.`,
        shadow: `The risk is that this easy access to connection makes it hard to sit with genuine spiritual doubt or dark periods, since your instinct moves toward warmth and trust rather than staying present with real uncertainty. You might notice you brighten a spiritual crisis before it's actually been fully felt.`,
        path: `Try sitting with one moment of real spiritual doubt before moving to your usual warmth and trust. You are allowed to feel spiritually uncertain without rushing past it. What doubt have you smoothed over before it was actually resolved?`,
        positive: `Your easy, warm access to connection is still real and still a genuine gift — that hasn't changed — but you've sat with real spiritual doubt at least once, before moving to your usual trust. Your faith includes the dark periods now, not just the bright ones.`,
        negative: `Your easy access to spiritual connection is genuine, and it makes real doubt or dark periods hard to actually sit with, since your instinct moves toward warmth rather than staying present with uncertainty. You might notice you brighten a spiritual crisis before it's been fully felt.`,
      },
      20: {
        heading: `Your Connection Is Waiting on a Truth You Haven't Fully Answered`,
        why: `Sahasrara asks how you access meaning — and Judgement answers through an unanswered call: there's something you already sense about your own spiritual path or purpose that you haven't fully answered yet. This isn't vague — you likely know exactly what you're being asked to reckon with.`,
        shadow: `The risk is that the postponement produces a persistent sense of spiritual incompleteness, a summons hovering just out of reach, without the hovering ever being connected to the specific thing you already sense. You might notice a nagging feeling that something about your path is unresolved.`,
        path: `Try answering the spiritual call you already sense, in some concrete form, rather than waiting to feel fully ready. You are allowed to respond before certainty arrives. What have you sensed you're meant to reckon with that you haven't yet addressed?`,
        positive: `You've answered the call you'd already sensed, and something has settled in your spiritual life because of it — not because everything is resolved, but because you're finally responding instead of postponing. The nagging incompleteness has quieted.`,
        negative: `Something about your own spiritual path is waiting to be answered, and the postponement is producing a persistent sense of incompleteness. You might notice a nagging feeling that something is unresolved, without connecting it to the specific thing you already know you're meant to reckon with.`,
      },
      21: {
        heading: `Your Connection Is Most Complete When Everything Feels Integrated`,
        why: `Sahasrara asks how you access meaning — and the World answers through wholeness: your deepest sense of connection comes when your spiritual life feels woven into everything else — your relationships, your work, your ordinary days — rather than existing as a separate compartment. That's mature, real connection through integration.`,
        shadow: `The risk is that this need for full integration makes it hard to access meaning in a moment that stays separate from the rest of your life, so a genuine spiritual experience that hasn't yet connected to everything else gets undervalued. You might notice you dismiss a real moment of connection simply because it felt isolated.`,
        path: `Try trusting one isolated spiritual moment as meaningful, without needing it to connect to your whole life first. You are allowed to find connection in a moment that stays separate. What spiritual experience have you undervalued because it hadn't yet woven into everything else?`,
        positive: `Your connection through full integration is still real and still a mature form of meaning — that hasn't changed — but you've trusted an isolated spiritual moment too, without needing it to connect to everything else first. Meaning counts now even before it's fully integrated.`,
        negative: `Your connection tends to deepen through integration, so a spiritual moment that stays separate from the rest of your life can get undervalued, even when it's genuinely meaningful. You might notice you dismiss a real experience of connection simply because it felt isolated rather than woven in.`,
      },
      22: {
        heading: `Your Connection Comes From Trusting the Unknown Itself`,
        why: `Sahasrara asks how you access meaning — and the Fool answers through faith in mystery: you connect to something larger precisely by trusting what you can't explain or predict, staying open to meaning that arrives without warning. That's genuine, courageous spiritual openness.`,
        shadow: `The risk is that this comfort with mystery avoids the different value of settled, examined belief, so you stay perpetually open without ever developing the depth that comes from actually working through a spiritual question to some kind of resting place. You might notice you rarely land anywhere, always staying open to the next possibility instead.`,
        path: `Try letting one spiritual question actually settle into something you believe, at least for now, rather than keeping it perpetually open. You are allowed to trust mystery and also arrive somewhere. What spiritual question could you let rest into a real, if provisional, conclusion?`,
        positive: `Your openness to mystery and the unknown is still fully real — that trust isn't going anywhere — but you've let at least one spiritual question actually settle into something you believe, rather than keeping it perpetually open. Your faith has landing places now, alongside its openness.`,
        negative: `Your comfort with spiritual mystery is genuine, and it's being used to avoid the different value of settled belief, so you stay perpetually open without ever developing the depth that comes from actually working a question through to a resting place. You might notice you rarely land anywhere spiritually, always staying open to the next possibility instead.`,
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
