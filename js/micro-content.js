'use strict';

/**
 * Destiny Matrix — Micro-Content Engine
 * ─────────────────────────────────────
 * Two content layers:
 *
 *  1. nodes["NUM_KEY"]  — position-specific deep reading.
 *     KEY is the NODES[i].key value: A, B, C, D, or E.
 *     Written for the exact psychological lens of each host star.
 *
 *  2. general[NUM]  — universal archetype fallback used when a
 *     position-specific entry doesn't yet exist.
 *
 * API:
 *   DMicroContent.get(arcanaNum, nodeKey)
 *     → { heading, why, shadow, path } or null
 *
 * ═══════════════════════════════════════════════════════════════════════
 * GOLDEN STANDARD — match this depth for every entry in this file.
 * ═══════════════════════════════════════════════════════════════════════
 * Confirmed by the user as the final voice/depth bar (session of 2026-08-04).
 * Three fields only: title, tagline, mastery, shadow, invitation.
 *
 *   mastery     4-6 sentences. NOT one trait restated — walks through 3-4
 *               DISTINCT capacities the person has at their best (e.g. for
 *               the Chariot below: clear direction, holding opposites
 *               without conflict, delegated leadership, resilience to
 *               obstacles). Present tense, flatly stated as settled fact.
 *               No hedging words ("can," "tends to," "sometimes").
 *   shadow      4-6 sentences. Opens FRESH — never a "but" continuation of
 *               mastery. Same rule: 3-4 DISTINCT failure modes of the same
 *               underlying energy, each tracing an actual mechanism (what
 *               triggers it, what it looks like from outside) and a real
 *               cost. At least one facet should surface what's underneath
 *               the pattern (a fear, a false belief) where true to the
 *               archetype.
 *   invitation  4-5 sentences. Opens with a direct, answerable question
 *               ("Are you driving your chariot with tense hands...?"),
 *               then ONE concrete action with enough shape to follow: what
 *               to do, rough scope/timing, what to watch for. Plain, not
 *               therapist-soft, no "why/path" framing.
 *
 * Rules: plain declarative sentences, no metaphor stacking, no repeated
 * openers across entries ("You think X," "Where others…"), shadow must
 * feel like the same energy misfiring (not a generic downside), no
 * positive/negative labels.
 *
 * Reference entry (verbatim, do not edit — copy this depth, not this text):
 *
 *   '7_E': {
 *     title: `7 in Soul Center — The Chariot`,
 *     tagline: `A Design of the Trusted Compass`,
 *     mastery: `You know exactly where you're headed, and you don't need
 *       every door pushed open before you'll trust the direction — you
 *       recognise the path that's actually aligned and you move on it. You
 *       hold opposing forces at once without either one hijacking you:
 *       drive and rest, instinct and plan, your own agenda and what a
 *       situation actually needs. You don't have to do everything yourself
 *       to feel like it's really yours; you can hand pieces to people and
 *       still feel the whole thing is moving because you're the one
 *       steering it. Obstacles stop registering as personal insults and
 *       start registering as terrain — real, but not a verdict on whether
 *       you should keep going.`,
 *     shadow: `The drive turns inward or outward as force instead of
 *       direction. You feel an overwhelming urge to control every variable
 *       and every person around you, and impatience with anyone moving
 *       slower than your internal tempo shows up as friction nobody asked
 *       for. Underneath that control is a real split — part of you wants
 *       to rush forward and part of you is quietly terrified, and the two
 *       pull against each other until the tension shows up as anxiety,
 *       sudden anger, or a burnout you didn't see building. When the
 *       pressure gets to be too much, the whole thing can invert into
 *       total stall: stuck, frustrated that nothing's moving, and
 *       unwilling to actually take the wheel. Your legs, your spine, your
 *       nervous system carry the tension of forcing a road that never
 *       needed forcing.`,
 *     invitation: `Ask yourself plainly: are you gripping the reins
 *       white-knuckled, fighting every turn, or are you letting a clear
 *       vision actually pull you forward? Set one decisive goal today and
 *       name it out loud. Delegate the piece that isn't actually yours to
 *       hold. Then let go of forcing the pace and trust that the road will
 *       keep unfolding whether or not you white-knuckle it.`,
 *   }
 * ═══════════════════════════════════════════════════════════════════════
 */

window.DMicroContent = (function () {

  // ── POSITION-SPECIFIC DEEP READINGS ──────────────────────────────────────
  // Keys: arcana number + "_" + node key  (e.g. "8_A", "5_B")

  const nodes = {

    // ── 8 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '8_A': {
      title: `8 in Core Character — Justice`,
      tagline: `A Design of the Reading Room`,
      mastery: `You read the balance of a room before anyone speaks — who's carrying more than their share, who's quietly taking, where an arrangement stopped being fair months ago and nobody said so. You hold yourself to the exact standard you measure everyone else by, which is the rare part most people who talk about fairness skip. You can deliver a hard, accurate verdict without needing it to be cruel, separating the correction from the punishment in a way few people manage. And you don't need the scales to tip in your favor to call something fair — you'll rule against your own interest if that's what's actually true.`,
      shadow: `The ledger stays open on everyone but you. You track every imbalance in how you're treated with total precision and build a running account of what you're owed, while your own column never gets audited with the same rigour. Fairness curdles into rigidity, where you apply the letter of a rule even when the moment plainly called for mercy, unable to feel the difference between the two anymore. Underneath the exemptions is usually an old, specific memory of being treated unfairly yourself, which you're now quietly re-litigating on everyone else's behalf. It reads, from outside, as someone who demands fairness constantly and practises it selectively.`,
      invitation: `Ask yourself honestly whose column you last actually audited — theirs, or your own. Take the standard you've been holding someone else to and apply it to yourself, out loud, today, in front of them. Name what you expect of them, then say plainly where you fall short of that same expectation. The point isn't apology, it's proving the measure runs both directions.`,
    },

    // ── 1 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '1_A': {
      title: `1 in Core Character — The Magician`,
      tagline: `A Design of Instant Competence`,
      mastery: `Competence comes off you before you've done a thing to prove it, and people hand you things that matter within minutes of meeting you because they're reading something real. You act first and let the plan catch up, which looks like recklessness to cautious people and is actually a working method — you generate momentum other people are still waiting on. You back the first impression up when tested, so it holds instead of collapsing the way it does for people who only perform capability. And you can hold four moving pieces at once without dropping any of them, converting an idea into something usable faster than almost anyone in the room.`,
      shadow: `The mask does all the work and you stop taking it off, becoming the default problem-solver in every group because you never once looked like you were struggling. The speed that makes you effective can tip into starting more than you finish, since the beginning is where your competence is most visible and the follow-through is where it's least fun. Underneath the constant readiness is often a fear that needing help would undo the whole impression, so the days you have nothing left look identical from outside to the days you're fine. When you finally did need someone, nobody was in the habit of asking, and you quietly took that as proof you were right to rely on yourself alone.`,
      invitation: `Ask yourself honestly what you're currently not admitting you don't have handled. Tell one person today, plainly, about something live and unresolved — not a past struggle already turned into a good story. Say the sentence without the recovery attached to it and then stop talking. Watch whether they move toward you, because they will, and that's the information you've been missing.`,
    },

    // ── 2 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '2_A': {
      title: `2 in Core Character — The High Priestess`,
      tagline: `A Design of the Held Depth`,
      mastery: `There is obviously more going on in you than you're showing, and people register it immediately without needing it explained. You perceive what's forming before it's announced — the undercurrent in a conversation, the thing about to shift — and you hold that perception privately until it's actually useful to name. You don't fill silence to make others comfortable, so when you finally speak, it carries weight most people can't generate no matter how loudly they talk. And you protect what's genuinely sacred to you without needing to justify the protection, and people sense the boundary and mostly respect it without being told why.`,
      shadow: `The guarding goes total and stops being a choice you're making — it becomes the only mode available. You withhold so consistently that the wall gives off no signal at all, no hint there's anything behind it worth the effort of reaching, and people try twice, get nothing legible back, and reclassify you from deep to simply cold. Underneath the sealed door is often a real fear that if you spoke plainly, what's inside might turn out to be smaller than the mystery suggested. The depth you were protecting ends up witnessed by no one, which was never the trade you meant to make.`,
      invitation: `Ask yourself honestly whether your silence is discernment or fear wearing a better costume. Let one true thing land on your face today and leave it there unexplained — a reaction you'd normally flatten, held for two seconds instead of erased. Don't narrate it afterward or apologise for it. You're testing whether being briefly readable actually costs you anything, and it won't.`,
    },

    // ── 3 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '3_A': {
      title: `3 in Core Character — The Empress`,
      tagline: `A Design of the Room That Exhales`,
      mastery: `Rooms exhale when you enter them, and people drop their shoulders around you without deciding to. None of this is technique — hospitality is closer to your resting state than a skill you deploy, which is exactly why it works on people immune to the performed version. You grow things patiently, tending a person or a project the way you'd tend something alive, giving it real time instead of rushing it toward a result. And you hold real abundance without hoarding it, generous by nature rather than by calculation, which makes people feel nourished rather than managed.`,
      shadow: `You become the landing pad and the arrangement never reverses — everyone brings their weight to you, you hold all of it, and it doesn't occur to a single one of them that you might need the same back. The generativity can turn compulsive, unable to tolerate anything staying dormant, so you push growth onto people and situations that actually needed a season of rest. There's no dramatic breaking point in any of this; the tiredness just compounds, week over week, entirely invisible because you keep receiving people exactly as warmly on the empty days. You end up surrounded by people who love you and have no real idea what's happening to you underneath it.`,
      invitation: `Ask yourself honestly when you last let your own life get the attention you give everyone else's. Say "I don't have capacity for that right now" out loud today, once, to someone who'll be surprised to hear it. Don't soften it with an explanation or an alternative time — the sentence works because it stops there. Watch what actually happens next, which is almost certainly nothing bad.`,
    },

    // ── 4 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '4_A': {
      title: `4 in Core Character — The Emperor`,
      tagline: `A Design of Assumed Command`,
      mastery: `A room organises itself around you before you've said anything, because you hold the weight without visible strain and don't flinch when a decision turns out to cost something. You build structures that actually last, thinking in years where most people think in weeks, and what you construct doesn't need constant repair to stay standing. You take ownership of outcomes without being asked to, and people feel the safety of that ownership even when they can't name where it's coming from. And you can hand real authority to someone else and let them run with it, rather than needing to control every decision underneath your own.`,
      shadow: `People stop telling you what they actually think, because you look decided before the conversation even starts, so they skip the disagreement and go straight to agreeing. Structure can harden into control — the frame you built to protect something living starts mattering more to you than the life inside it, and you defend systems long after they've stopped serving anyone. Underneath the control is often a real fear that without the frame, everything, including you, falls apart. The consensus around you gets faster and thinner every year, and you read the speed as alignment rather than what it actually is — a room that's learned arguing with you isn't worth the friction.`,
      invitation: `Ask yourself honestly when someone last told you something you didn't want to hear. Ask one real question today and stay silent long past the point it gets uncomfortable. Pick something you already have a view on and ask someone who defers to you what they'd do differently. Wait for the second answer, not the first — the first is the safe one.`,
    },

    // ── 5 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '5_A': {
      title: `5 in Core Character — The Hierophant`,
      tagline: `A Design of Assumed Rightness`,
      mastery: `You carry the bearing of someone who knows how things are properly done, and an uncertain room settles when you state your position, not because you argued well but because you sounded like someone who already found the floor. You absorb how something actually works from people who've genuinely done it, and you apply that understanding with real, sustained discipline rather than treating it as theory. You transmit what you know clearly enough that it actually sticks, giving people both the rule and the reason behind it. And you're the person others check their instinct against, a real form of authority you never had to ask for.`,
      shadow: `The role hardens into a cage — you get cast as the one who already knows, so people stop bringing you their doubts, their half-formed objections, the exact things that would have sharpened you. You start defending positions past the point you actually believe them, because reversing would break the character everyone's assigned you. Underneath the defended certainty is often a fear that if the framework flexed even once, it might not hold at all. The thinking that earned the authority quietly stops getting fed, and you're the very last person in the room who'll notice it happening.`,
      invitation: `Ask yourself honestly when you last changed your mind about something you're known for knowing. Say "I don't know" today to someone who fully expects you to have the answer. Pick a question inside your actual area of authority, not a safe one outside it, and let the sentence sit without following it with a theory. You're rebuilding the channel that brings you disagreement.`,
    },

    // ── 6 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '6_A': {
      title: `6 in Core Character — The Lovers`,
      tagline: `A Design of the Meaningful Yes`,
      mastery: `You don't hand your attention to everyone, so when someone actually gets it, they know it means something. You can hold two competing pulls — duty and desire, safety and passion — without pretending one of them doesn't exist, and still make a real choice. You commit fully once you've decided, rather than keeping a foot out the door in case something better turns up. And you choose people deliberately; it shows, and it's exactly what makes being chosen by you land differently than being liked by someone who likes everyone equally.`,
      shadow: `The discernment starts announcing itself before the warmth does, so being near you starts to feel like an audition rather than an arrival. People spend their energy performing worthiness instead of actually opening up, and the very thing that would have let you see them clearly never happens, because you made them earn it first. Underneath the constant evaluating is sometimes a fear of choosing wrong and being stuck with the consequence, so you keep assessing long after a decision should have been made. Every choice starts to feel equally weighty, and the deliberation itself becomes a way of avoiding commitment rather than a path toward it.`,
      invitation: `Ask yourself honestly whether you're discerning or stalling. Let your warmth go first today, before any read or assessment, with someone you'd normally size up before deciding how much to give. Give the warm version immediately, without waiting to see if they've earned it. Notice how much faster something real shows up when the evaluation isn't running first.`,
    },

    // ── 7 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '7_A': {
      title: `7 in Core Character — The Chariot`,
      tagline: `A Design of Visible Momentum`,
      mastery: `You carry direction before you've said a word about where you're headed, and it's not performed urgency — it's actual forward motion people can feel from across a room. You hold opposing pulls at once, drive and rest, instinct and plan, without either one hijacking the other. You don't need to do everything yourself to feel like the momentum is really yours; you can hand pieces to people and still feel like you're the one steering. And obstacles register as terrain to cross rather than personal insults, which is exactly what lets you keep moving when other people would stop.`,
      shadow: `The drive turns into force instead of direction, and impatience with anyone moving slower than your internal tempo shows up as friction nobody asked for. The momentum reads as unavailability, so people decide you're too busy for the low-stakes check-in that would have actually built the closeness, and they simply stop offering it. Underneath the drive is sometimes a real split — part of you wants to keep rushing forward and part of you is quietly exhausted, and the two pull against each other until it shows up as tension or a burnout you didn't see coming. You end up surrounded by people who assumed correctly you didn't have room, and the isolation doesn't register as isolation — it just feels like being productive, right up until it doesn't.`,
      invitation: `Ask yourself plainly whether you're actually going somewhere or just running from stillness. Let yourself be seen doing nothing today, deliberately, in front of someone who usually only sees you in motion. Sit still somewhere visible, no task in hand, no destination pending, long enough that it's obviously on purpose. You're proving you have room by demonstrating it, not announcing it.`,
    },

    // ── 9 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '9_A': {
      title: `9 in Core Character — The Hermit`,
      tagline: `A Design of Presumed Solitude`,
      mastery: `People give you space without needing to be asked, because it's obvious you process things internally rather than out loud, and that's a real gift, not distance. Left alone with enough quiet, you access a register of understanding most people only reach with years of trying. You return from solitude with something usable, not just a mood — actual clarity you can hand to someone else. And you rarely have to defend the space you need, because most people learn to offer it before you'd ever have to ask.`,
      shadow: `The default respect calcifies into permanent exclusion — people stop asking at all, assuming solitude is always the answer, and the assumption compounds silently until you're simply not on the list anymore. The self-sufficiency can tip into genuine withdrawal, where the world of other people starts to feel thin next to what solitude reliably gives you. Underneath the retreat is sometimes a fear that speaking plainly would let people see less than the mystery implied, so staying quiet protects the depth from ever being tested. Nobody made a single decision to leave you out — it accumulated, invitation by unissued invitation, and you're the only one who can feel the gap it left.`,
      invitation: `Ask yourself honestly whether the quiet is still restoring you or has become a place to hide. Tell one person directly today that you want to be included in something specific coming up, not a general statement. Say plainly you'd like to be asked next time without them having to guess. Watch their reaction — most people will be relieved to finally know.`,
    },

    // ── 10 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '10_A': {
      title: `10 in Core Character — The Wheel of Fortune`,
      tagline: `A Design of the Watched Shift`,
      mastery: `You're genuinely interesting to watch, because circumstances shift around you at a rate that keeps people curious rather than exhausted. You sense when a cycle is actually turning — when to hold and when to move — which reads as real timing intelligence rather than luck. Change doesn't unsettle you the way it unsettles most people; you move with it, and that ease reads as a kind of confidence others simply don't have. And you can let a good season end without gripping it, trusting that the wheel keeps turning whether or not you fight the turn.`,
      shadow: `The association hardens into a verdict — unreliable, simply because things move around you — and people hedge their bets before committing to anything long-term, assuming the next shift is already loading. You can treat a single downturn as proof your luck has run out permanently, or chase every upswing without discernment, mistaking motion itself for a genuine turn. Underneath the reactivity is often a fear that you have no real control over the cycle at all, so gripping the parts you can still touch feels like the only defense. You end up paying an unreliability tax for a season you're not even currently in, and nobody thinks to check whether the assumption still applies.`,
      invitation: `Ask yourself honestly which phase of your actual cycle you're in right now, separate from how you feel about it. Show one person today a single thread in your life that hasn't changed in years — a habit, a commitment kept without interruption. Put it in front of them plainly, without over-explaining why you're bringing it up. You're giving them evidence that contradicts the story they've built about you.`,
    },

    // ── 11 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '11_A': {
      title: `11 in Core Character — Strength`,
      tagline: `A Design of the Safe Weight`,
      mastery: `People bring you the worst moments of their lives without asking first whether you're up for it, because something about you reads as capable of holding real weight without cracking. You can stay present with raw, unruly states in yourself — real anger, real appetite — without needing to suppress them into nonexistence to feel safe. You lead through steadiness rather than force, and people follow because the calm is real, not performed for effect. And you know the difference between gentleness and weakness, so you can be soft without ever being a pushover.`,
      shadow: `You become the default shock absorber, and nobody ever checks whether you're absorbing too much, because your composure never visibly cracks in front of anyone. The suppression can go underground — you perform a calm you don't actually feel, until the pressure finds another way out as tension, a sudden eruption, or a body that starts breaking down from carrying what your voice never said. Underneath the performance is often a fear that the real intensity, if shown honestly, would be too much for the people around you. You end up the strongest person in every room and the least supported person in it, and both are true for the same reason.`,
      invitation: `Ask yourself honestly whether you're taming something in yourself or just suppressing it and calling it strength. Let your composure actually slip once today, in front of someone you trust, on purpose. Don't wait for a crisis big enough to justify it — pick an ordinary moment and stop holding it together for thirty seconds. You're testing whether you'll let them try to hold you.`,
    },

    // ── 12 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '12_A': {
      title: `12 in Core Character — The Hanged Man`,
      tagline: `A Design of the Different Clock`,
      mastery: `You run on a different clock than everyone else in the room, and that gap is where you see what they miss. You can stop pushing and let an answer arrive through release instead of effort, comfortable with not-knowing in a way most people never develop. You see an angle from where nobody else is looking, because you're willing to hang back and view a situation upside down for a while. And you can pause a decision without anxiety, trusting the pause itself is doing real work rather than treating stillness as failure.`,
      shadow: `The different pace reads as checked-out, and people stop waiting for you, leaving you out of urgent decisions entirely because nobody wants to slow down to your speed. The patience can tip into permanent suspension, where not-knowing becomes the whole purpose instead of a passage toward one, and you stay in the pause because it's safer than the risk of an actual choice. Underneath the suspension is often a real fear of being wrong once you commit, so staying undecided protects you from ever finding out. You watch decisions get made badly in real time and say nothing, because nobody asked, and you've stopped expecting them to.`,
      invitation: `Ask yourself honestly whether the pause is still doing real work or has become a comfortable place to avoid speaking. Say the sharp observation you're holding today, out loud, unprompted, before someone asks for it. Interrupt at your own speed instead of waiting for the room to slow down. Keep it to one clear sentence so it can't be dismissed as a tangent.`,
    },

    // ── 13 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '13_A': {
      title: `13 in Core Character — Transformation`,
      tagline: `A Design of Grounded Gravity`,
      mastery: `You carry the grounded weight of someone who has already survived something real, and people register it instantly without you explaining a thing. You can let an old version of yourself actually die so a truer one can take its place, and you don't need the process to be dramatic to trust it's real. Strangers open up to you faster than they open up to people they've known longer, because something in your presence signals you won't flinch at what they say. And you can release an identity that used to serve you the moment it stops fitting, without needing a crisis to force your hand.`,
      shadow: `People start handling you like glass, assuming there's always something heavy running underneath, and you get starved of the trivial — the small talk, the silliness, the ordinary texture of an unremarkable day. You can start manufacturing endings for their own sake, mistaking constant reinvention for the deeper transformation this actually asks of you. Underneath the compulsive reinvention is often a fear of staying still long enough to be fully known in one fixed form. The isolation from being treated as permanently deep is polite and well-intentioned and still isolation, and you end up missing the lightness you actually want.`,
      invitation: `Ask yourself honestly whether you're transforming or just running from being seen as finished. Bring one genuinely trivial joy into a conversation today without earning it first — no serious topic to justify the shift. Just say the small, silly thing out loud and let the room be surprised. You're teaching people that lightness is allowed with you.`,
    },

    // ── 14 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '14_A': {
      title: `14 in Core Character — Temperance`,
      tagline: `A Design of the Trusted Middle`,
      mastery: `You hold two opposing positions in the same room without dismissing either one, and that's a genuinely rare skill. You blend things in the right proportion for the specific situation, not by rote formula, which is why your mediation actually resolves things instead of just delaying them. Groups quietly funnel their tension toward you because you're the one who can metabolise it rather than escalate it further. And you moderate your own extremes naturally, neither all-in nor checked-out, which makes you unusually sustainable to be around over the long run.`,
      shadow: `You become the group's designated peacekeeper, and the role never comes off — you smooth over conflict on autopilot, even in the exact moments you're the one who actually needs smoothing. The blending can turn into an excuse to avoid fully engaging with either side of anything, staying so centered that nothing gets lived with real intensity or genuine commitment. Underneath the endless balancing is sometimes a fear of what full commitment to a side might cost you, so staying in the blend protects you from that risk. Your own disputes sit unresolved for years, since you've become so identified with fixing other people's tension that nobody, including you, imagines you might need the same service.`,
      invitation: `Ask yourself honestly whether your balance is real integration or a way of never having to choose. Land somewhere today — give one clear, unmixed opinion on something you'd normally hold in careful balance. State a side plainly, with no "but I also see the other view" attached. Pick something low-stakes enough that landing badly won't cost you much.`,
    },

    // ── 15 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '15_A': {
      title: `15 in Core Character — The Devil`,
      tagline: `A Design of the Compelling Edge`,
      mastery: `People feel something compelling and slightly dangerous about you before they can name it, a pull that more conventionally pleasant people simply cannot produce. You look directly at your own appetite — for pleasure, power, intensity — without flinching away or pretending it isn't there. You understand your own attachments well enough to use them deliberately rather than being quietly run by them from underneath. And you can hold real intensity without either suppressing it into shame or being consumed by it, which is precisely what makes the edge feel powerful rather than chaotic.`,
      shadow: `The intensity attracts exactly the wrong reasons or repels everyone before they get close enough to see past it, and people either chase the edge for a thrill that has nothing to do with actually knowing you, or decide from a distance you're too much. The appetite can start running the show instead of being run by you, and you become quietly ruled by a compulsion or a need for control without seeing the chain while it's actively happening. Underneath the compulsion is often shame you're avoiding by staying fixated on the symptom rather than the source. Your real gentleness gets buried under a first impression that reads far more extreme than you actually are.`,
      invitation: `Ask yourself honestly what currently has a genuine hold on you, and say it plainly, without softening it. Let your softness show today, right alongside the edge, not as a replacement for it. Say or do one gentle thing in the conversation where you'd normally let the intensity carry the whole room. People need to see the combination to stop mistaking the edge for the whole story.`,
    },

    // ── 16 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '16_A': {
      title: `16 in Core Character — The Tower`,
      tagline: `A Design of the Truth-Jolt`,
      mastery: `You cut through the polite fiction everyone else in the room is quietly protecting, and the thing nobody wanted to say, you say, clearing the air whether people wanted it cleared or not. You receive revelation as lightning — sudden, restructuring clarity that arrives all at once rather than accumulating slowly — and it changes you faster than gradual paths change other people. You can let a false structure fall rather than propping it up indefinitely, which takes a specific courage most people don't have. And you don't perform bluntness for effect; you simply refuse to maintain a fiction everyone else has quietly agreed to.`,
      shadow: `People start managing information around you before you've done anything at all, bracing for disruption preemptively and excluding you from delicate conversations on reflex. You can start needing the collapse itself to feel like anything real is happening, provoking crisis because gradual, quiet clarity feels unconvincing next to something dramatic. Underneath the compulsion is often a fear that nothing changes unless it's forced to, so you keep forcing it. The exclusion compounds — the less you're included, the more your rare appearances feel disruptive by contrast, confirming the very reputation that got you excluded in the first place.`,
      invitation: `Ask yourself honestly whether the thing you're about to say needs to detonate or could land gently instead. Say one honest thing today, gently, on purpose, specifically to prove the honesty doesn't have to explode. Choose something you'd normally hold back or deliver too sharply, and deliver it slowly. Watch the room's face for the moment they realise this isn't the blast they braced for.`,
    },

    // ── 17 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '17_A': {
      title: `17 in Core Character — The Star`,
      tagline: `A Design of Unhardened Hope`,
      mastery: `Your hope hasn't hardened into naivety, and people can feel the difference — they can be genuinely discouraged around you because your optimism has already absorbed the bad news and stayed intact anyway. You replenish what's depleted, trusting a process before there's proof it's working, and stay with it through the invisible stretch where nothing looks like it's changing yet. You inspire real optimism in other people just by being near them, without needing to perform positivity to do it. And that combination makes you a safe place to be honest about a bad day, which is rarer than simple positivity and worth far more.`,
      shadow: `You get cast as the group's permanent source of encouragement, expected to be hopeful more or less on schedule, so your own low days start to feel like a betrayal of the role. You pour hope outward so consistently that your own reserves run dry, offering renewal to everyone except yourself as though you alone were exempt from needing any back. Underneath the performance is often a real fear that if your own hope ever failed publicly, you'd have nothing left to offer anyone. The one place that might have handed hope back to you never gets the chance, because you never show it the need.`,
      invitation: `Ask yourself honestly when you last let someone replenish you instead of the other way around. Let your own doubt be visible today, out loud, without immediately following it with reassurance that it'll be fine. Tell someone specifically what you're actually unsure about right now. Resist the reflex to close the sentence with something comforting for their sake.`,
    },

    // ── 18 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '18_A': {
      title: `18 in Core Character — The Moon`,
      tagline: `A Design of the Weather Behind the Eyes`,
      mastery: `You carry a rich, shifting interior life that shows on your face before you say a word about it, and real curiosity follows you because of it. You navigate uncertainty and ambiguity without needing everything resolved before you'll move, so you act while other people are still waiting for clarity that hasn't arrived. You're genuinely comfortable in the unconscious, symbolic register that unsettles most people. And you can hold conflicting feelings — fear and desire, dread and hope — at the same time without needing to resolve the contradiction before you'll trust either one.`,
      shadow: `People start guessing at your mood instead of asking, and they guess toward the worst almost every time, letting a room fill with unnecessary tension over a mood you're not even in. Free-floating anxiety that doesn't attach to anything specific can take over, and you mistake the intensity of a feeling for its accuracy, when the two aren't the same thing at all. Illusion and self-deception become easy to fall into, because the fog itself can start to feel more truthful than anything solid. The gap between what you're actually feeling and what people assume widens the longer it goes unaddressed.`,
      invitation: `Ask yourself honestly whether what you're feeling is signal or unmoored anxiety wearing intuition's costume. Name what you're actually feeling today, out loud, in one plain sentence, to someone who's clearly guessing. Say it flat, the way you'd report a fact, the moment you notice someone reading your silence wrong. One accurate sentence does more to settle a room than an hour of guessing.`,
    },

    // ── 19 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '19_A': {
      title: `19 in Core Character — The Sun`,
      tagline: `A Design of Instant Warmth`,
      mastery: `People feel lighter just standing near you, and the warmth is genuine, not performed — it puts strangers at ease before you've done a single specific thing to earn it. You bring genuine vitality into a room just by being in it, and that energy is contagious rather than manufactured. You can be fully seen without flinching, comfortable with visibility in a way most people have to work at for years. And you find real, uncomplicated confidence that doesn't depend on constant achievement to feel legitimate — you're enough on an ordinary day, not just a productive one.`,
      shadow: `People start assuming the brightness is constant and unconditional, a fixed feature rather than a mood, so on the days you're actually struggling they get confused instead of concerned. The vitality can tip into needing to be the center of every room rather than simply present in it, ego creeping into what was once simple radiance. Underneath either extreme is often a fear that your unguarded self, offered too plainly, might not actually be wanted. You end up absorbing your own hard days alone, precisely because you're too consistently warm for anyone to think to check.`,
      invitation: `Ask yourself honestly whether you're radiating because it's true or performing brightness because you think it's required. Let one bad day actually show today, without apologising for it or performing your way back to brightness halfway through. Say, plainly, that today isn't a good one. Don't soften the landing with a joke to recover the mood.`,
    },

    // ── 20 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '20_A': {
      title: `20 in Core Character — Judgement`,
      tagline: `A Design of Imminent Arrival`,
      mastery: `You carry the charge of someone actively becoming something bigger, and people feel the unfolding whether or not you've announced any of it. You can genuinely evaluate yourself and your own past honestly, without either inflating it or tearing yourself down over it. You know how to release something that's completed its purpose and let it actually go, rather than carrying it forward out of habit. And you hear a real summons and trust it, distinct from noise or wishful thinking, which lets you act while others are still debating whether the call was real.`,
      shadow: `People start relating to who you're becoming instead of who you actually are right now, today, in front of them, leaving you half-seen while everyone waits for the finished version to arrive. Harsh, excessive self-judgment can take over instead of honest evaluation, where every past choice gets re-litigated instead of simply learned from. You can get stuck reliving an old failure or identity, unable to release it and move into who you're actually becoming now. Even your closest relationships can end up oriented toward your potential rather than your present, which leaves you strangely lonely inside all that anticipated arrival.`,
      invitation: `Ask yourself honestly whether you're becoming or avoiding being met as you already are. Let someone meet exactly who you are today, not who you're becoming. Tell them plainly, without qualifying it against future plans, what's true about you right now. Resist the pull to frame yourself as a permanent work in progress.`,
    },

    // ── 21 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '21_A': {
      title: `21 in Core Character — The World`,
      tagline: `A Design of Presumed Completion`,
      mastery: `You carry a genuine sense of wholeness — the ease of someone who's already arrived somewhere most people are still striving toward, and that settledness isn't a mask. You integrate everything, the hard parts and the good parts, into one coherent whole instead of only keeping what flatters you. You can see the wider context of your own journey clearly, understanding how the separate chapters actually connect. And you find genuine, uncomplicated satisfaction in completion itself, not just in the next milestone it opens up.`,
      shadow: `People assume you don't need anything at all, precisely because you don't look like you're missing anything, and support quietly stops reaching you as a result. You can become complacent once you do arrive somewhere, mistaking one completion for permanent safety and stopping the growth that got you there. Underneath the presumed completeness is sometimes a fear that admitting an unfinished part would undo the reputation you've built. You end up carrying real difficulty entirely alone inside a reputation for having already arrived.`,
      invitation: `Ask yourself honestly whether you're avoiding arrival or have gone numb to needing anything at all. Show one still-forming, unfinished part of yourself to someone today, plainly, without wrapping it in reassurance that you're still fine overall. Name something you're actually working through right now, not something already resolved into a lesson. You're giving people the opening to actually offer you something.`,
    },

    // ── 22 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '22_A': {
      title: `22 in Core Character — The Fool`,
      tagline: `A Design of Unrehearsed Presence`,
      mastery: `You meet every moment fresh, with no rehearsed social mask standing between you and whoever's actually in front of you, and people drop their own performance in response. You step forward into something new without needing a guarantee handed to you first, real trust rather than naivety about the risk. You bring genuine spontaneity and a willingness to take real risks that most people have talked themselves out of by adulthood. And you carry total presence in this exact moment, unburdened by the last leap or the next one, which lets you actually meet what's in front of you.`,
      shadow: `The same openness reads as naivety to people who haven't looked past the surface, and they underestimate what you've actually lived through, leaving you out of the heavier conversations. Naive risk-taking without real judgment can lead you toward genuine danger, mistaking recklessness for the same trust that once served you well. You can also become genuinely irresponsible, so focused on the next leap that commitments and people counting on you get left behind. Your ease doesn't advertise everything you've carried, so people mistake unguarded for uninformed.`,
      invitation: `Ask yourself honestly whether this leap is trust or a way of running from what the last one required of you. Let your actual depth show through the ease today, once, on purpose, in a conversation where you'd normally stay light. Say something that reveals what you've actually been through, without abandoning the openness to do it. People need to see both at once to stop underestimating you.`,
    },

    // ── 5 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '5_B': {
      title: `5 in Sky Line — The Hierophant`,
      tagline: `A Design of Received Structure`,
      mastery: `You sense the deeper structure underneath things before anyone has explained a word of it to you, and study turns into devotion for you, not obligation. Understanding doesn't stay locked in your own head — it becomes something you can hand to another person fully intact, structure and reasoning both. You examine a belief you've inherited and consciously choose what actually stays, so what you eventually teach has been tested, not just repeated. And you know how to meet someone exactly where they are, adjusting the teaching to the student rather than making the student adjust to you.`,
      shadow: `The reverence for structure curdles into certainty that there's exactly one right way to arrive at what you know, and you start lecturing when you meant to teach without noticing the tone shift. You can become rigid about the single correct path to understanding, unable to tolerate someone — including yourself — arriving at truth by a different route. Underneath the rigidity is often a fear that if the framework flexed even once, it might not hold. The channel that should be receiving new understanding closes, sealed by the very conviction that once made you such a good student.`,
      invitation: `Ask yourself honestly whether you're teaching from tested understanding or defending inherited doctrine you never actually examined. Ask one person today what they see differently than you do about something you're certain of, and let them finish completely. Don't correct the gaps in their view while they're still talking. Sit with their answer for a full minute before responding.`,
    },

    // ── 1 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '1_B': {
      title: `1 in Sky Line — The Magician`,
      tagline: `A Design of the Direct Line`,
      mastery: `Inspiration arrives and you know immediately how to give it a shape someone else can actually use, a translation most people spend years training themselves to reach. You spot the opening in a spiritual conversation and act on it before anyone else has finished thinking, turning the invisible into something workable in real time. You are a direct line between the idea and the thing, and very few people can move that fast without losing the signal along the way. And you originate rather than imitate — what moves through you arrives genuinely new, not recycled from somewhere else.`,
      shadow: `You start claiming as personal genius what actually just moved through you, and the credit quietly warps your relationship to your own gift. You hoard half-finished downloads because starting the next one feels more alive than finishing the last one ever will, and what accumulates behind you is a long trail of brilliant, abandoned beginnings. Underneath the compulsive starting is often a fear that finishing would expose the idea to judgment it might not survive. The gift for catching inspiration becomes, over time, a reason nothing you catch ever actually lands anywhere.`,
      invitation: `Ask yourself honestly what's stopping you from finishing the last thing that moved through you. Finish one spiritual idea you've been sitting on today instead of reaching for a new one. Pick the oldest one still in your notes and do the unglamorous last ten percent. Don't let yourself start anything new until this one is genuinely done.`,
    },

    // ── 2 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '2_B': {
      title: `2 in Sky Line — The High Priestess`,
      tagline: `A Design of the Unspoken Knowing`,
      mastery: `You sense what's forming before it's ever announced, a real fluency for symbol and undercurrent that most people walk straight past without noticing. You hold different truths at once without needing either to collapse — the seen and the unseen, the said and the sensed — and that capacity for paradox is where the perception actually lives. You honour what you sense rather than requiring only what you can prove outright, and you're usually right. People who spend time around you start noticing things they never used to see, simply because you pointed at what was forming before it fully arrived.`,
      shadow: `You guard the veil instead of lifting it, treating your own insight as too sacred to say out loud, and people sense you know something you're not telling them. You can get lost in the depths without a clear way back to actual functioning, letting the felt sense override any grounded engagement with what's genuinely in front of you. Underneath the withholding is often a fear that speaking plainly would make the insight ordinary, so staying veiled protects its specialness. The insight stays locked inside a private register only you can access, which means it helps exactly one person.`,
      invitation: `Ask yourself honestly whether your silence protects the insight or just protects you from being wrong in public. Say "here's what I'm sensing" out loud today, even without proof to back it up. Pick something you'd normally keep to yourself and offer it plainly, without a disclaimer that undercuts it first. Let the other person do something with it.`,
    },

    // ── 3 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '3_B': {
      title: `3 in Sky Line — The Empress`,
      tagline: `A Design of Generative Presence`,
      mastery: `Things come alive around you simply because you're present, and growth organises itself in your vicinity without your having to push, plan, or ask. You cultivate people and ideas the way you'd tend something genuinely alive, giving them real time rather than rushing them toward a result. You hold real spiritual abundance without hoarding it, generous by nature rather than by calculation. And people walk away from time with you carrying ideas and energy they didn't bring in, which is a genuine gift most people never learn to give.`,
      shadow: `You can't tolerate anything staying dormant, including things that genuinely need to rest before they can grow again, and you push growth onto people who actually needed a season of stillness. You start resenting it when the fertility you spark in others doesn't circle back with credit attached to your name. Underneath the resentment is often a fear that without visible output, the gift itself might not be real. What should be pure, unconditional generativity picks up a quiet expectation of acknowledgment that undercuts the very gift it's attached to.`,
      invitation: `Ask yourself honestly whose growth you've been tending, and whether anything of your own has been left dormant in the process. Let one thing near you stay fallow today, on purpose, without pushing it to grow. Notice the urge to intervene or nudge it forward, and don't act on it. You're practising the version of your gift that doesn't require constant output to feel real.`,
    },

    // ── 4 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '4_B': {
      title: `4 in Sky Line — The Emperor`,
      tagline: `A Design of Sacred Architecture`,
      mastery: `You take something vast and formless and build a structure sturdy enough to actually hold it, architecture in service of the sacred rather than a cage around it. You think in years where most spiritual seekers think in moods, and that long view produces frameworks that are actually durable. People rely on what you build because it's been tested against reality, not just imagined in a quiet moment. And you can hold real authority in a spiritual context without needing to dominate every decision underneath it, letting people build their own practice inside the frame you provided.`,
      shadow: `You defend the frame long after the life inside it has moved on, and your spiritual practice starts running on maintenance instead of discovery. Authority that isn't questioned can curdle into authority that refuses to be questioned, and you start experiencing genuine spiritual growth in someone else as a threat to the structure rather than evidence it's working. Underneath the control is often a fear that without the frame, the whole thing, including you, falls apart. You keep polishing the container while what it once held has already left.`,
      invitation: `Ask yourself honestly whether one of your spiritual structures is still serving what it was originally built to protect. Pick the practice you're most attached to and interrogate it directly. If the answer is no, don't wait for a better moment — adjust or retire it this week. Practise handing a piece of it to someone else and watching what they build.`,
    },

    // ── 6 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '6_B': {
      title: `6 in Sky Line — The Lovers`,
      tagline: `A Design of the True Frequency`,
      mastery: `You can feel the difference between what's actually spiritually true for you and what's simply appealing, even when the appealing version is louder and easier to justify to everyone around you. That discernment holds under real social pressure, not just in quiet moments alone. You commit fully once you've chosen a path, rather than keeping a foot on the other one in case it turns out better. And you don't confuse popularity with resonance, a clarity rarer than most people assume until they watch you decline something everyone else has chosen.`,
      shadow: `You stay suspended at the crossroads, feeling both paths so intensely that choosing either one starts to feel like betraying the other, and nothing actually gets committed to, year after year. The suspension itself starts masquerading as a spiritual practice rather than what it actually is — avoidance dressed in patient language. Underneath the endless weighing is often a fear of the version of yourself who'd have to live with choosing wrong, so staying undecided feels safer than committing. People around you watch you stand at the same fork for far longer than the decision should ever take.`,
      invitation: `Ask yourself honestly whether you're discerning or simply avoiding the loss that comes with any real choice. Choose the resonance you actually feel today, even if it's imperfect and you're not fully certain. Let the other path go, out loud, to someone who'll hold you to it. A real choice, even an imperfect one, teaches you more than another year of feeling both.`,
    },

    // ── 7 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '7_B': {
      title: `7 in Sky Line — The Chariot`,
      tagline: `A Design of Spiritual Perseverance`,
      mastery: `You keep a spiritual practice moving on will alone, long after the initial spark that started it has faded completely, real perseverance most people's practices don't survive without. You hold direction firmly without gripping it too tightly, trusting forward motion that doesn't need to force its way through everything. You show up on the flat, uninspiring days as reliably as you did on the exciting first one. And that consistency is what actually produces depth over time, far more than intensity ever could.`,
      shadow: `You insist on driving the whole practice alone, refusing teachers or community because receiving help feels like losing control of something you built yourself. Discipline quietly becomes a substitute for actual encounter with anything outside your own head, and impatience with anyone moving at a different spiritual pace shows up as friction nobody asked for. Underneath the solo driving is often a real fear that the practice might not survive contact with someone else's perspective. The solitude that once felt like strength starts to feel like a wall, and you can't always tell the difference from the inside.`,
      invitation: `Ask yourself honestly whether you're disciplined or just afraid of what receiving help might change. Let someone else into your practice today — a teacher, a challenging book, a real conversation about what you believe. Choose something that requires you to receive rather than perform your discipline for an audience. You're testing whether the practice can survive contact with another perspective, and it can.`,
    },

    // ── 8 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '8_B': {
      title: `8 in Sky Line — Justice`,
      tagline: `A Design of Hollowness Detection`,
      mastery: `You can sense when something claiming to be sacred has actually gone hollow underneath the performance, a discernment that's real, rare, and genuinely protective. You're not easily fooled by depth that's only being performed for an audience, and people trust your read on a teacher or community because your radar for hypocrisy is unusually well calibrated. You make judgments based on evidence rather than on who you like or who's most convincing. And you catch what others miss because you're not distracted by how good the surface looks.`,
      shadow: `That clarity turns into permanent suspicion, and you stop being able to rest inside any practice at all, constantly auditing everything for hypocrisy. Fairness curdles into rigidity — you apply the same unforgiving standard to a genuinely sincere but imperfect place as you would to actual fraud, unable to feel the difference anymore. Underneath the suspicion is often an old wound around being fooled once, which you're now protecting against everywhere, permanently. The gift that was meant to protect you from being fooled ends up isolating you from everything real too.`,
      invitation: `Ask yourself honestly whether you're detecting fraud or simply unable to tolerate imperfection anymore. Let one small imperfection in a spiritual community be ordinary humanness today, not proof of hollowness. Notice the exact moment your radar fires on something minor, and pause before reacting. Stay in the room a little longer than your instinct wants you to.`,
    },

    // ── 9 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '9_B': {
      title: `9 in Sky Line — The Hermit`,
      tagline: `A Design of Contemplative Range`,
      mastery: `Given enough quiet, you can access a register of consciousness that most people never reach in an entire lifetime, a genuine contemplative gift rather than a mere preference for being alone. You gather real wisdom in solitude, and when you actually offer it, it genuinely helps someone. You can be completely self-sufficient without it curdling into isolation, content in your own presence rather than merely tolerating it. And you return from real solitude with something usable — clarity, a settledness that outlasts the retreat itself.`,
      shadow: `You start chasing the peak state again and again, retreating further from ordinary life because it simply can't compete with what solitude reliably gives you. You withdraw past what reflection actually requires, using solitude to avoid rather than to gather, and hard-won insight stays entirely yours. Underneath the retreat is sometimes a real fear of being misunderstood if you spoke plainly, so staying quiet protects the depth from being tested. You end up spiritually rich and relationally starving, and it takes a long time to notice the second part.`,
      invitation: `Ask yourself honestly whether the solitude is still gathering something or has quietly become avoidance. Bring one thing back from your solitude today and actually share it with another person, out loud, while it's still a little raw. Choose someone who'll actually engage with it, not just nod along. The gift only becomes a gift once it leaves your own head.`,
    },

    // ── 10 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '10_B': {
      title: `10 in Sky Line — The Wheel of Fortune`,
      tagline: `A Design of Divine Timing`,
      mastery: `You have a real instinct for when the moment has actually arrived, even when nothing external has announced it yet, a rare gift of trust rather than prediction. You sense when a spiritual cycle is genuinely turning — when to hold and when to move — instead of forcing either through sheer effort. You act on that sense of rightness directly, and it's usually correct in ways that surprise people who only trust visible evidence. And you can let a period of dormancy end on its own natural timing rather than trying to accelerate it.`,
      shadow: `"It's not the right time yet" becomes a permanent excuse you deploy against anything you're actually afraid to do, and you keep sensing a better season just ahead while the actual present stays completely untouched. You can treat a spiritually dry season as proof the connection has failed permanently, or chase every fleeting high without discernment, mistaking motion for a genuine turn. Underneath the deferral is often a fear that acting now, imperfectly, would somehow disqualify the timing altogether. Genuine timing wisdom curdles into an endless postponement that never resolves into real action.`,
      invitation: `Ask yourself honestly whether you're actually waiting for timing or waiting to avoid a decision you're afraid of. Trust one "yes" today, right now, instead of pushing it off to some better-timed future. Pick the thing you've been waiting for a clearer sign about and act on it before the day ends. You already have the instinct — the only thing missing is letting it move you.`,
    },

    // ── 11 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '11_B': {
      title: `11 in Sky Line — Strength`,
      tagline: `A Design of the Tamed Wild`,
      mastery: `You can stay present with raw, unruly inner states without needing to suppress them or being ruled by them either, real hard-won spiritual strength. You can tame something wild in yourself — real appetite, real anger — without needing to suppress it into nonexistence to feel safe. You lead a spiritual community or a single conversation through steadiness rather than force, and people follow because the calm is real. And you know the difference between gentleness and weakness, so you can be soft without ever being a pushover.`,
      shadow: `You perform calm instead of actually reaching it, and the difference is invisible to everyone including you at first. What you think you've tamed moves underground and resurfaces later as tension, irritability, or a sudden eruption that catches you as off-guard as anyone else. Underneath the performance is often a fear that the real intensity, if shown honestly, would be too much for the people around you. What looks like strength from the outside is sometimes just deferral with better posture.`,
      invitation: `Ask yourself honestly whether you're taming something in yourself or just suppressing it and calling it strength. Let one feeling be fully felt today before you try to manage or contain it at all. Notice the moment your instinct reaches for control, and delay it by thirty seconds. You're finding out whether your strength holds when it isn't performing.`,
    },

    // ── 12 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '12_B': {
      title: `12 in Sky Line — The Hanged Man`,
      tagline: `A Design of Skilled Surrender`,
      mastery: `You can stop pushing entirely and let revelation arrive through release rather than through effort, comfort with not-knowing most people never develop. You see the world from an angle others miss precisely because you're willing to hang back and view a situation from where nobody else is looking. You can pause a decision without anxiety, trusting the pause itself is doing real work. And you know how to let something be sacrificed on purpose, for a real reason, without turning the sacrifice into a permanent identity.`,
      shadow: `You confuse surrender with permanent inaction, staying suspended indefinitely because the pause feels safer than descending back into the risk of an actual choice. What began as a genuine spiritual posture quietly becomes a way of never having to act on anything the suspension revealed. Underneath the suspension is often a fear of being wrong once you commit, so staying undecided protects you from finding out. You collect insight after insight from the stillness and let every single one of them go unused.`,
      invitation: `Ask yourself honestly whether the pause is still doing real work or has become a comfortable place to avoid choosing. Take what your last surrender revealed to you and actually act on it today, concretely. Name the insight plainly, then take one real step that puts it into motion. The surrender only means something once it changes what you actually do next.`,
    },

    // ── 13 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '13_B': {
      title: `13 in Sky Line — Transformation`,
      tagline: `A Design of Real Initiation`,
      mastery: `You've survived a genuine ego-death before, and something truer rose up in its place afterward, real aptitude for spiritual initiation earned through direct experience. You can let an old version of yourself actually die so a truer one can take its place, without needing the process to be dramatic to trust it's real. Most people fear that kind of dissolution instinctively, but you've been through it and come out more yourself. And you can release an identity that used to serve you the moment it stops fitting, without needing a crisis to force your hand.`,
      shadow: `You start engineering crisis after crisis because ordinary, gradual growth feels unconvincing next to the drama of collapse. The intensity of transformation becomes the proof you require before you'll believe anything real is happening, so quiet, undramatic change starts to feel like it doesn't count. Underneath the compulsive reinvention is often a fear of staying still long enough to be truly known in one fixed form. You end up addicted to your own reconstruction, unable to trust growth that doesn't require tearing something down first.`,
      invitation: `Ask yourself honestly whether you're transforming or just running from being seen as finished. Let one piece of growth happen quietly today, with absolutely no crisis required to make it feel real. Choose something small you've been meaning to shift, and change it without drama or announcement. You're proving transformation doesn't have to hurt to count.`,
    },

    // ── 14 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '14_B': {
      title: `14 in Sky Line — Temperance`,
      tagline: `A Design of the Poured Vessel`,
      mastery: `You hold different truths at their meeting point without needing either one to collapse into the other, genuine mediator's work that comes from containing contradiction rather than rushing to resolve it. You blend things in the exact right proportion for the specific situation, not by rote formula, which is why the healing you offer actually resolves things. People bring you their conflicting realities because you can hold both without picking a side too early. And you moderate your own extremes naturally, which makes you sustainable in a way people who burn hot rarely are.`,
      shadow: `You lose your own footing while holding everyone else's steady, pouring outward endlessly and rarely letting yourself be healed in return. The blending can turn into an excuse to avoid fully engaging with your own needs, staying so centered on others that nothing in your own life gets any real intensity or attention. Underneath the constant giving is often a fear that receiving would mean stepping outside the identity you've built as the one who holds. The mediator who never gets mediated for eventually runs completely dry.`,
      invitation: `Ask yourself honestly when you last let someone else hold something for you. Receive one act of care today instead of only offering it. Let a specific person do something for you without deflecting it or immediately returning the favour. You need proof that you can be held too, not just that you're good at holding.`,
    },

    // ── 15 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '15_B': {
      title: `15 in Sky Line — The Devil`,
      tagline: `A Design of Fearless Looking`,
      mastery: `You can look directly at darkness — your own or the collective's — without flinching away or spiritually bypassing it into something more comfortable, exactly the depth work most approaches actively avoid. You look directly at your own appetite for pleasure, power, or intensity without flinching away or pretending it isn't there. You understand your own attachments well enough to use them deliberately, rather than being quietly run by them. And you don't need the darkness dressed up as a lesson before you're willing to look at it — you just look.`,
      shadow: `You circle the same dark material again and again because the intensity of looking has quietly become its own reward, and proximity to darkness starts standing in for actual freedom from it. The appetite can start running the show instead of being run by you, and you become genuinely ruled by a compulsion without seeing the chain while it's happening. Underneath the compulsion is often shame you're avoiding by staying fixated on the symptom rather than the source. Years can pass with you deeply, admirably familiar with your own shadow and no more free of it than when you started.`,
      invitation: `Ask yourself honestly what currently has a real hold on you, and say it plainly. Turn one thing you've been looking at into an actual action toward freedom today, not just more insight about it. Take one concrete step that changes your behaviour around it. You already have the insight — what's missing is letting it cost you something to change.`,
    },

    // ── 16 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '16_B': {
      title: `16 in Sky Line — The Tower`,
      tagline: `A Design of Lightning Revelation`,
      mastery: `You receive revelation as lightning — sudden, restructuring clarity that arrives all at once rather than accumulating slowly, and it changes you faster than the gradual paths most people are stuck taking. You can let a false structure fall rather than propping it up indefinitely, a specific courage most people don't have. You recover fast from upheaval, not by suppressing what happened but by actually integrating what it showed you. And you can tell the difference between a necessary collapse and unnecessary destruction, so your honesty doesn't turn into a habit of breaking things that were fine.`,
      shadow: `You start needing the collapse before you'll believe growth is actually happening, sometimes provoking crisis in your own beliefs just to feel that jolt of clarity return. You can become genuinely destructive, tearing down beliefs or relationships that didn't actually need to fall, just to get the reorganizing jolt you've learned to associate with real insight. Underneath the compulsion is often a fear that nothing changes unless it's forced to. The lightning becomes something you chase rather than something that simply arrives.`,
      invitation: `Ask yourself honestly whether the thing you're about to blow up actually needs to fall. Let one truth land gently today instead of through demolition. Choose an understanding you've been circling and let it settle in slowly, without forcing the dramatic version. You're proving clarity doesn't need a crisis attached to be real.`,
    },

    // ── 17 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '17_B': {
      title: `17 in Sky Line — The Star`,
      tagline: `A Design of the Living Wellspring`,
      mastery: `Your faith stays lit without needing proof to keep it burning, and that quality is genuinely contagious to the people around you. You carry hope that hasn't hardened into naivety, because you've actually looked at the hard parts and kept the hope anyway. People can tell the difference between borrowed optimism and yours, and they gravitate toward the real thing. And you know how to receive renewal as well as offer it, letting your own reserves actually get refilled instead of only giving from them.`,
      shadow: `You start treating your faith as a private reserve to protect instead of a wellspring meant to keep flowing, performing hope you don't currently feel because you've become known as the one who's always fine. You pour hope outward so consistently that your own reserves run dry, offering renewal to everyone except yourself as though you alone were exempt from needing any back. Underneath the performance is often a fear that if your hope ever failed publicly, you'd have nothing left to offer anyone. The wellspring starts running on reserves instead of being fed, and nobody notices until it's nearly empty.`,
      invitation: `Ask yourself honestly when you last let someone replenish you instead of the other way around. Let your own doubt be witnessed today, honestly, by someone who actually cares about you. Say out loud, plainly, one thing you're currently unsure of. Don't rush to close the conversation with a hopeful reframe.`,
    },

    // ── 18 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '18_B': {
      title: `18 in Sky Line — The Moon`,
      tagline: `A Design of the Threshold at Home`,
      mastery: `You're fluent in liminal space — dreams, the unseen, the threshold territory most people find deeply disorienting, and you feel genuinely at home there. You engage the uncertain and ambiguous without needing everything resolved before you'll trust what you're sensing. You're genuinely comfortable in the symbolic, not-yet-formed register that unsettles almost everyone else. And you can hold conflicting feelings at once — dread and hope, fear and desire — without needing to resolve the contradiction before you'll trust either one.`,
      shadow: `You start losing the thread back to consensus reality, and the drift happens gradually enough you don't notice it happening. Free-floating anxiety that doesn't attach to anything specific can take over, and you mistake the intensity of a feeling for its accuracy. The pull toward the inner world leaves the practical, relational world quietly neglected — bills unpaid, people unanswered, plans left unmade. You become genuinely fluent in the unseen and increasingly fluent in nothing anyone else can actually share with you.`,
      invitation: `Ask yourself honestly whether what you're sensing is signal or unmoored anxiety in a mystical costume. Bring one thing back from your inner world today and ground it in something physical or relational. Take a symbol or insight and turn it into one concrete action in ordinary life. You're building the bridge back, one deliberate crossing at a time.`,
    },

    // ── 19 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '19_B': {
      title: `19 in Sky Line — The Sun`,
      tagline: `A Design of Effortless Clarity`,
      mastery: `Clarity arrives for you light and immediate, without needing a struggle first to earn its legitimacy, and ease itself functions as a real spiritual practice for you. You bring genuine vitality to spiritual life, and that energy is contagious to people who've only ever experienced it as effortful. You can be fully open about your own understanding without flinching, comfortable with visibility most people work at for years. And what comes to you effortlessly is not shallow simply because it was easy.`,
      shadow: `You start feeling pressure to manufacture struggle so your insight seems more credible to a world that equates depth with difficulty, and your natural clarity gets dimmed on purpose. The vitality can tip into needing to be the center of every spiritual conversation rather than simply present in it. Underneath either extreme is often a fear that your lightness, offered plainly, might not be taken seriously. The gift for ease becomes something you apologise for instead of something you simply offer.`,
      invitation: `Ask yourself honestly whether you're being light because it's true or performing weight because you think it's required. Offer something you know today exactly as lightly as it arrived, with no harder story attached. Say the simple version out loud, without padding it with difficulty you didn't experience. People can receive the easy truth just as fully as the hard-won one.`,
    },

    // ── 20 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '20_B': {
      title: `20 in Sky Line — Judgement`,
      tagline: `A Design of Vocational Hearing`,
      mastery: `You recognise a genuine calling when it arrives, clearly distinct from noise or ordinary wishful thinking, real vocational discernment few people have. You can genuinely evaluate your own past and choices honestly, without either inflating them or tearing yourself down over them. You know how to release something that's completed its purpose and let it actually go, rather than carrying it forward from habit. And what you commit to tends to hold up, because you didn't mistake urgency for truth to get there.`,
      shadow: `You start mistaking every strong feeling for a divine instruction, chasing missions that don't actually hold up once you slow down and examine them. Harsh, excessive self-judgment can take over instead of honest evaluation, re-litigating every past choice instead of simply learning from it. You end up pressuring other people toward awakenings they're not ready for, mistaking your certainty for theirs. Your credibility erodes exactly where it used to be strongest.`,
      invitation: `Ask yourself honestly whether you're discerning a call or manufacturing one to feel significant. Let one "calling" prove itself over time today before committing to it fully. Write down what you're feeling called toward, then set a real waiting period before you act. You're testing your own discernment against time.`,
    },

    // ── 21 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '21_B': {
      title: `21 in Sky Line — The World`,
      tagline: `A Design of Whole-Life Synthesis`,
      mastery: `You weave different traditions into one coherent whole instead of treating them as competing systems, real spiritual synthesis earned through actually living inside more than one rather than skimming several. You integrate everything, the hard parts and the good parts, into a single understanding instead of only keeping what flatters your worldview. People who feel torn between traditions come to you because you've already found the throughline they're still searching for. And you find genuine satisfaction in the wholeness itself, not just in adding the next framework to the pile.`,
      shadow: `You start collecting breadth without depth, gathering more frameworks in the name of wholeness without letting any single one of them actually change you. You can become complacent once you've assembled a working synthesis, mistaking the collection for genuine integration and stopping the deeper work that would actually transform you. Underneath the collecting is sometimes a fear that committing to depth in one place means admitting the others were never fully explored. You can explain how six traditions relate to each other and still be exactly the same person you were before.`,
      invitation: `Ask yourself honestly whether you're synthesizing or just collecting. Stay with one dimension of your understanding today instead of reaching for something new to add. Choose the framework you already know best and go one layer deeper into it. You're testing whether depth in one place changes you more than breadth ever has.`,
    },

    // ── 22 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '22_B': {
      title: `22 in Sky Line — The Fool`,
      tagline: `A Design of the Natural Passport`,
      mastery: `You have direct, unmediated access to the sacred, without needing a doctrine or a credential to grant you permission to enter, rare openness most adults lose. You step into spiritual experience without needing a guarantee first, real trust rather than naivety about what you might find. You bring genuine spontaneity to your own growth, willing to take real risks other people have talked themselves out of. And you carry total presence in each new experience, unburdened by the last leap or the next one.`,
      shadow: `You start trusting every experience as equally sacred, with no discernment between them, leaping toward the next revelation before the last one has taught you anything durable. Naive risk-taking without real judgment can lead you toward genuine danger, mistaking recklessness for the trust that once served you well. You can also become irresponsible, so focused on the next leap that commitments and people counting on you get left behind. You end up spiritually well-travelled and strangely unchanged.`,
      invitation: `Ask yourself honestly whether this leap is trust or a way of running from what the last one required. Let one thing you learned in your last spiritual leap actually carry into today's decision. Name the specific lesson before reaching for the next one. You're proving integration matters as much as the leap itself.`,
    },

    // ── 4 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '4_C': {
      title: `4 in Earth Line — The Emperor`,
      tagline: `A Design of Constructed Security`,
      mastery: `You build real, durable material security through discipline rather than luck, one unglamorous layer at a time. You take ownership of financial outcomes without being asked to, and people feel the safety of that ownership in how you handle money even when they can't name why. You stay with the foundational work — the boring maintenance, the unremarkable follow-through — long after most people have abandoned it out of boredom. And you can hand real financial authority to someone else and let them run with it, rather than needing to control every decision underneath your own.`,
      shadow: `You start gripping resources so tightly that nothing new can actually get in, control mistaken for prosperity. Structure can harden into control — the security you built starts mattering more to you than what it was actually meant to serve, and money that never moves isn't protected, it's simply scarce on purpose. Underneath the grip is often a fear that without total control, everything falls apart. The discipline that built your security quietly turns into the exact thing preventing it from growing any further.`,
      invitation: `Ask yourself honestly whether you're protecting the security or protecting your own need for control over it. Let one dollar move today that you'd normally hold onto purely out of caution. Choose something small enough that losing it wouldn't actually hurt. You're testing whether the world punishes you for loosening the grip, and it won't.`,
    },

    // ── 1 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '1_C': {
      title: `1 in Earth Line — The Magician`,
      tagline: `A Design of Instant Origination`,
      mastery: `You spot an opening and convert it into income before anyone else has even finished thinking it through, real entrepreneurial instinct that converts straight into material result. You act first and let the plan catch up, generating momentum other people are still waiting on. You back the instinct up when tested, so the opportunity holds instead of collapsing the way it does for people who only talk about ideas. And you can hold several financial threads at once without dropping any of them, moving an idea into income faster than almost anyone in the room.`,
      shadow: `Your financial life ends up built almost entirely on beginnings, money made fast leaving just as fast because nothing was ever built to hold it. The speed that makes you effective tips into starting more than you finish, since the beginning is where the instinct is most visible and the retention is where it's least fun. Underneath the constant starting is often a fear that staying with one thing too long would mean missing the next opening. You're highly skilled at generating opportunity and comparatively untrained in the slower work of retaining it.`,
      invitation: `Ask yourself honestly what you're currently not admitting you haven't finished retaining. Pick one income stream today and commit to staying with it specifically past the exciting part. Set a real minimum timeframe you won't abandon it before, and write it down. You're building the one skill your instinct for starting never had to develop.`,
    },

    // ── 2 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '2_C': {
      title: `2 in Earth Line — The High Priestess`,
      tagline: `A Design of Quiet Financial Instinct`,
      mastery: `You have a felt sense for financial timing that consistently outperforms the visible data everyone else is staring at, quiet material intelligence that's usually right. You hold different signals at once without needing to collapse them prematurely — the number and the feeling, the plan and the instinct. You sense the shift in a market before the numbers catch up and confirm it. And you protect your own read without needing to justify it constantly, letting the instinct do its work quietly.`,
      shadow: `You second-guess your own gut into complete silence, deferring instead to whoever sounds louder or more officially rational in the room. You watch your instinct get overridden again and again, often by counsel that turns out, in hindsight, to have been worse than what you already quietly knew. Underneath the deferral is often a fear that trusting yourself openly would mean being wrong in public. You end up with a track record of good instincts you didn't act on and bad advice you did.`,
      invitation: `Ask yourself honestly whether your silence about your own instinct is humility or fear of being wrong out loud. Act on one quiet financial certainty today before you ask anyone else's opinion. Choose something small enough that acting on it alone feels manageable. You're rebuilding trust in your own read.`,
    },

    // ── 3 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '3_C': {
      title: `3 in Earth Line — The Empress`,
      tagline: `A Design of Cultivated Wealth`,
      mastery: `You cultivate material resources patiently, tending them the way you'd tend something genuinely alive rather than something purely to be extracted from. You grow wealth slowly and let it actually compound instead of rushing it toward a result before it's ready. You hold real financial abundance without hoarding it, generous by nature rather than by calculation. And what you build tends to actually last, because you built it the way things that last are built.`,
      shadow: `You start pouring resources into something that's stopped growing, out of attachment to what it once was rather than what it's actually becoming. You give your abundance away too freely, undervaluing the real work behind it in a way that quietly erodes what you've spent years building. Underneath both habits is often a fear that stopping the flow — pruning the dead thing, charging the fair price — would make you less generous than you want to believe you are. The two habits reinforce each other, draining the same well from opposite directions.`,
      invitation: `Ask yourself honestly which of your habits is actually generosity and which is avoidance dressed as generosity. Prune one thing today that's stopped growing, and price one thing today you've been giving away for free. Name the dead thing plainly and let it go. Name a fair price for the live thing and say it out loud to someone.`,
    },

    // ── 5 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '5_C': {
      title: `5 in Earth Line — The Hierophant`,
      tagline: `A Design of Inherited Discipline`,
      mastery: `You absorb how wealth actually gets built by watching people who've genuinely done it, and you apply what you learn with real, sustained discipline rather than treating it as abstract theory. You examine a financial belief you inherited and consciously choose what actually stays, rather than following it blindly. What you take from others gets tested against your own life before you fully adopt it. And you take what works and actually use it, consistently, over years — rarer than people assume.`,
      shadow: `You start clinging to an inherited financial system long past the point it actually fits your current life, following the rules exactly as handed to you even after the conditions changed. You can become rigid about the one correct way to handle money, unable to update the rule even when your own evidence says it no longer applies. Underneath the rigidity is often a fear that questioning the inheritance would mean questioning the people who gave it to you. You end up financially correct by an outdated standard and quietly worse off by the one that actually matters now.`,
      invitation: `Ask yourself honestly whether you're following wisdom or defending inheritance you never actually tested. Name one inherited money rule today that's quietly expired for the life you actually live. Say it out loud, specifically, and where it came from. Replace it with one small action that reflects your actual current life.`,
    },

    // ── 6 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '6_C': {
      title: `6 in Earth Line — The Lovers`,
      tagline: `A Design of Aligned Income`,
      mastery: `You build wealth only through work that genuinely reflects your actual values, and you don't compromise that alignment just because a faster option appears. You hold competing pulls — ambition and principle, speed and integrity — without pretending one doesn't exist, and still make a real choice. You commit fully once you've decided, rather than keeping a foot out the door for something purer. And people trust that what you've built wasn't compromised to get there, which ends up being a genuine asset.`,
      shadow: `You weigh every financial choice so exhaustively against your values that you never actually commit to anything at all, and real opportunities pass by while you're still deliberating whether they're pure enough. The deliberation starts to function as a permanent excuse for inaction rather than genuine ethical care. Underneath the endless auditing is often a fear of the version of yourself who'd have to live with a choice that wasn't perfectly pure. You end up with impeccable values and very little to show for them.`,
      invitation: `Ask yourself honestly whether you're being principled or just stalling behind the language of principle. Commit fully to one values-aligned choice today, even if it isn't perfect. Pick the opportunity you've been circling and accept the version that's genuinely good enough. You're proving alignment doesn't require perfection, only honesty.`,
    },

    // ── 7 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '7_C': {
      title: `7 in Earth Line — The Chariot`,
      tagline: `A Design of Willed Momentum`,
      mastery: `You set a material goal and steer straight through setbacks that would fully derail most people, real sustained, willed momentum. You hold direction firmly without gripping it too tightly, trusting forward motion that doesn't need to force its way through everything. You don't have to carry the whole load yourself to feel like the progress is really yours; you can hand pieces to people and still feel like you're steering. And obstacles register as terrain to cross rather than personal insults, which is exactly what lets you keep moving.`,
      shadow: `You grip the plan so tightly you can't adapt when circumstances genuinely change around it, refusing help even when accepting it would clearly get you there faster. The willpower that drives you forward starts working against you the moment the terrain shifts and the original plan stops being right. Underneath the refusal to adapt is often a fear that changing course would mean admitting the original plan was wrong. You end up finishing a goal that no longer matches what actually would have served you.`,
      invitation: `Ask yourself plainly whether you're actually moving toward the right goal or just refusing to admit the terrain changed. Let one capable person help carry a financial load today instead of doing it entirely alone. Identify the piece you've been shouldering solo out of habit. You're testing whether the momentum survives being shared, and it does.`,
    },

    // ── 8 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '8_C': {
      title: `8 in Earth Line — Justice`,
      tagline: `A Design of Fair Dealing`,
      mastery: `You build wealth through balanced, fair dealing, earning real, durable security through honesty rather than advantage taken at someone else's expense. You hold yourself to the same standard you'd hold anyone else to in a deal, which is the rare part most people who talk about fairness skip. You can deliver a hard, accurate assessment without needing it to be exploitative, separating the correction from the extraction. And your reputation for fairness compounds quietly over years into opportunities that never would have reached someone who cut corners.`,
      shadow: `You start over-scrutinizing every deal for hidden unfairness, until you hesitate to invest or commit even when the deal in front of you is genuinely sound. Fairness curdles into rigidity, applying the same suspicious standard to a genuinely good deal as you would to an actual scam, unable to feel the difference anymore. Underneath the over-scrutiny is often an old memory of being taken advantage of, which you're now protecting against everywhere, permanently. Deals that should have closed easily die slowly under an audit nobody asked for.`,
      invitation: `Ask yourself honestly whether you're protecting against fraud or just unable to tolerate any risk at all. Move forward on one opportunity today instead of auditing it any further. Set a firm decision point and act on it once you reach it, no extending the deadline. The fear dressed as caution was the thing slowing you down.`,
    },

    // ── 9 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '9_C': {
      title: `9 in Earth Line — The Hermit`,
      tagline: `A Design of Rare Depth`,
      mastery: `You build material security through deep, solitary mastery of a specific craft, going further into it than nearly anyone else is willing to go alone. You gather real wisdom in solitude, and when you actually offer it, it genuinely helps someone. Nobody handed you shortcuts, so what you know actually holds up under pressure. And the depth is real, even on the days nobody's asking you to prove it.`,
      shadow: `Your expertise stays private and badly undervalued, because putting yourself forward as an expert feels like a betrayal of the very solitude that built it. You withdraw past what building the craft actually requires, using solitude to avoid the exposure of being seen as an expert. Underneath the withdrawal is often a fear that visibility would invite scrutiny the private mastery never had to survive. Nobody can pay for what they don't know you have.`,
      invitation: `Ask yourself honestly whether the privacy is protecting the craft or protecting you from being tested. Price or offer one piece of your expertise publicly today instead of keeping it entirely to yourself. Name an actual number or specific offer, out loud, to someone who could use it. Stepping into visibility doesn't cost you the depth.`,
    },

    // ── 10 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '10_C': {
      title: `10 in Earth Line — The Wheel of Fortune`,
      tagline: `A Design of Financial Seasons`,
      mastery: `You sense when a financial cycle is actually turning — when to invest, and just as importantly, when to hold — real timing intelligence, not guesswork dressed up as instinct. You can let a natural cycle turn without gripping against it or trying to hold the wheel in place by force. You move with change instead of merely surviving it, adjusting your behavior to match the actual phase you're in. And you can let a good period end without needing to grip it, trusting the wheel keeps turning either way.`,
      shadow: `You start treating a single downturn as proof your luck has run out permanently, or chase every upswing without discernment, mistaking motion for a genuine turn. You grip hardest exactly at the high point, dreading the coming downswing so much you can't actually enjoy the peak while you're in it. Underneath the gripping is a fear that you have no real control over the cycle, and white-knuckling the parts you can still touch feels like the only defense. You end up making your worst financial decisions exactly when your instinct should have been sharpest.`,
      invitation: `Ask yourself honestly which phase of your actual cycle you're in right now, separate from how you feel about it. Name it plainly, before you act on anything else. Check that assessment against what's actually driving it, not just how it feels. Act in line with that phase rather than your emotional reaction to it.`,
    },

    // ── 11 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '11_C': {
      title: `11 in Earth Line — Strength`,
      tagline: `A Design of Financial Endurance`,
      mastery: `You hold steady through financial pressure that would rattle almost anyone else, without panicking into the rash decisions that would only make it worse. You can stay present with raw financial fear without needing to suppress it or being ruled by it. You think clearly when the stakes are highest, precisely when most people's judgment collapses. And you know the difference between calm and denial, so your steadiness is real rather than a mask over panic.`,
      shadow: `You endure financial strain quietly, for far too long, refusing to ask for help because your identity has become tied to handling it completely alone. The composure can tip into performance — you look calm while the pressure moves underground and resurfaces as tension you don't connect to its source. Underneath the performed calm is often a fear that the real intensity would be too much for the people around you. You suffer through problems that a single honest conversation could have solved months earlier.`,
      invitation: `Ask yourself honestly whether you're staying calm or just refusing to let anyone see the strain. Ask for one piece of financial support today, before the pressure becomes an actual crisis. Name the specific thing you need and ask a specific person directly. You're testing whether your composure can include being helped, and it can.`,
    },

    // ── 12 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '12_C': {
      title: `12 in Earth Line — The Hanged Man`,
      tagline: `A Design of the Unconventional Path`,
      mastery: `Your financial breakthroughs come specifically from stepping back from the expected, obvious route entirely, real material patience in service of an unconventional path. You can see value in the pause that other people rush straight past on their way to the predictable choice. You can pause a financial decision without anxiety, trusting the pause itself is doing real work. And what looks like inaction from outside is often the exact thing that produces your best results later.`,
      shadow: `You stay suspended in a wait-and-see posture indefinitely, because it's genuinely more comfortable than committing to the different path you keep sensing but never step onto. The patience that once served you becomes a permanent holding pattern with no landing in sight. Underneath the suspension is often a real fear of being wrong once you commit, so staying undecided protects you from ever finding out. Years pass while the unconventional idea stays exactly that — an idea.`,
      invitation: `Ask yourself honestly whether the patience is still doing real work or has become a comfortable place to avoid choosing. Convert one unconventional financial idea you've been sitting on into an actual, concrete move today. Take the first real step toward it — one call, one message, one dollar. You're finding out whether the patience was strategic or just fear.`,
    },

    // ── 13 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '13_C': {
      title: `13 in Earth Line — Transformation`,
      tagline: `A Design of Deliberate Ending`,
      mastery: `You release material security that's become familiar but genuinely limiting, in service of something bigger you can already sense on the other side. You can let an old financial identity actually die so a truer one can take its place, without needing the process to be dramatic to trust it's real. You know the difference between a safety net and a ceiling, willing to let go of one to stop living under the other. And you can release something that used to serve you the moment it stops fitting, without needing a crisis to force your hand.`,
      shadow: `You hold onto a dying income stream out of fear rather than actual function, because the uncertain gap between the old and the new feels more dangerous than a slow, familiar decline. You can manufacture endings for their own sake in other areas, mistaking constant reinvention for the deeper reinvention this specific situation needs. Underneath the delay is often a fear that ending it would mean admitting it should have ended long ago. You mistake familiarity for safety long after the two have stopped meaning the same thing.`,
      invitation: `Ask yourself honestly whether you're preserving something functional or just avoiding an ending that's already happened. Name one financial chapter that's already ended except on paper, and release it today. Take one concrete step to actually close it — cancel it, sell it, stop funding it. You're removing the fiction keeping a dead thing technically alive.`,
    },

    // ── 14 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '14_C': {
      title: `14 in Earth Line — Temperance`,
      tagline: `A Design of Patient Blending`,
      mastery: `You blend multiple income streams and strategies into one sustainable whole, patiently, rather than betting everything on a single method that could fail all at once. You blend in the right proportion for the specific situation, not by rote formula, which is why your diversification actually works rather than just spreading you thin. You know how to let different sources support each other instead of competing for the same limited attention. And what you've built has real resilience precisely because it doesn't depend on any one thing working perfectly.`,
      shadow: `You spread so thin across strategies that nothing ever gets the chance to compound into something substantial. What looks like sensible diversification from the outside quietly becomes dilution from the inside, and none of it receives the sustained attention it would actually need to grow. Underneath the spreading is sometimes a fear of what full commitment to one strategy might cost if it failed. You mistake activity across many fronts for progress on any one of them.`,
      invitation: `Ask yourself honestly whether your diversification is strategy or a way of never fully committing to anything. Pick two of your financial approaches today and go deeper into them instead of spreading wider. Choose the two with the most real potential, not the safest ones. You're testing whether depth produces more than breadth ever did.`,
    },

    // ── 15 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '15_C': {
      title: `15 in Earth Line — The Devil`,
      tagline: `A Design of Unflinching Material Truth`,
      mastery: `You understand exactly how money and power actually operate on people, including precisely how they operate on you, real unflinching material intelligence. You look directly at your own appetite for accumulation without flinching away or pretending it isn't there. You understand your own attachments well enough to use them deliberately, rather than being quietly run by them. And this clarity makes you very hard to manipulate financially, because you see the mechanism other people are still unconsciously reacting to.`,
      shadow: `You grip money and status so tightly that "enough" never actually arrives, no matter how much accumulates. The attachment can start running the show instead of being run by you, and you become genuinely ruled by the chase without seeing the mechanism while it's happening to you specifically. Underneath the compulsion is often a fear that stopping the chase would mean confronting whatever the number was standing in for. The clarity you have about how money works on other people somehow never gets turned fully on yourself.`,
      invitation: `Ask yourself honestly what the accumulation is actually trying to provide you underneath the number itself. Say the real thing out loud — safety, worth, proof. Ask directly whether more money would actually deliver that thing. Sit with the answer instead of reaching for the next milestone to avoid it.`,
    },

    // ── 16 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '16_C': {
      title: `16 in Earth Line — The Tower`,
      tagline: `A Design of Sudden Material Clarity`,
      mastery: `You see a failing financial structure well before anyone else in the room is willing to admit it's actually failing, real sudden material clarity. You can let a structure that's genuinely failing actually fall, on your own terms, instead of propping it up long past its usefulness. You recover fast from a financial shock, integrating what it showed you rather than just surviving it. And you can tell the difference between a necessary collapse and unnecessary destruction, so you don't demolish things that are still fixable.`,
      shadow: `You start provoking collapse before it's actually necessary, walking away from something at the very first crack purely out of impatience rather than genuine evidence it can't be saved. You mistake your own restlessness for foresight, and things that could have been repaired get abandoned instead. Underneath the impatience is often a fear that staying with something imperfect means you're failing to see clearly. The clarity that once protected you starts destroying things that were still fixable.`,
      invitation: `Ask yourself honestly whether the thing you're about to abandon actually needs to fall. Reinforce one financial structure today instead of demolishing it on reflex. Look honestly at whether it's actually failed or just cracked. Take one concrete step to shore it up rather than exit it.`,
    },

    // ── 17 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '17_C': {
      title: `17 in Earth Line — The Star`,
      tagline: `A Design of Rebuilt Renewal`,
      mastery: `You can restore your material life even from real, significant loss, translating hope into patient, concrete reconstruction rather than letting it stay an abstract feeling. You replenish what's depleted, trusting the process before there's proof it's working, and stay with it through the invisible stretch. Renewal isn't theoretical for you — you've actually lived it, more than once. And that lived knowledge makes you steadier in a downturn than people who've only ever had good years.`,
      shadow: `You wait passively for renewal to simply arrive, treating hope itself as though it were a strategy instead of the starting point it's meant to be. You pour hope outward or inward without pairing it to action, so it stays purely a feeling that never converts into the rebuilding work that would make it real. Underneath the passivity is sometimes a fear that active rebuilding might fail again, so staying hopeful without acting protects you from that risk. Months or years can pass in this hopeful holding pattern with nothing concrete changing.`,
      invitation: `Ask yourself honestly whether you're hoping or actually rebuilding. Take one concrete rebuilding step today, not just a hopeful one. Choose a specific, physical, measurable action toward restoring what was lost, and do it today. You're proving hope is fuel for action, not a substitute for it.`,
    },

    // ── 18 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '18_C': {
      title: `18 in Earth Line — The Moon`,
      tagline: `A Design of Sensitive Financial Instinct`,
      mastery: `You sense hidden financial risk or opportunity long before it ever shows up in any hard data, real sensitive material intuition. You navigate financial uncertainty without needing everything resolved before you'll act on what you sense. You're genuinely comfortable holding an unclear financial picture without forcing false clarity onto it. And the difference between your sensitivity and simple worry shows in how often you're actually right.`,
      shadow: `Your financial anxiety starts running unmoored from any actual signal, making it genuinely hard to tell a real warning apart from simple, undirected fear. You mistake the intensity of a feeling for its accuracy, and the two aren't the same thing at all. Underneath the anxiety is sometimes a fear that hasn't found its real object yet, so it attaches to money because money is where fear usually lands. You spend energy defending against threats that were never there while the real ones go unnoticed.`,
      invitation: `Ask yourself honestly whether what you're feeling is signal or unmoored anxiety wearing intuition's costume. Check one financial feeling against a real number today — a budget, an account balance, something tangible. If the number contradicts the feeling, trust the number for today. You're building a habit that keeps the intuition without letting it run unchecked.`,
    },

    // ── 19 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '19_C': {
      title: `19 in Earth Line — The Sun`,
      tagline: `A Design of Uncomplicated Ease`,
      mastery: `You build wealth most easily through work that genuinely feels like an expression of who you are, real uncomplicated ease with money. You bring genuine vitality to the work, and that energy is part of what people are actually paying for. You can be fully visible about your own talent without flinching, comfortable with recognition in a way most people work at for years. And you've stopped needing to suffer for money to believe you've earned it.`,
      shadow: `You start underpricing joyful work because it didn't feel like enough of a struggle to justify real money in your own mind, difficulty mistaken for the true measure of value. The ease can also tip into overexposure, where you give away too much of the thing that comes naturally before anyone's asked you to charge for it. Underneath either extreme is often a fear that being paid well for something easy would somehow be dishonest. You charge less for the thing you're best at simply because it was easy for you to do.`,
      invitation: `Ask yourself honestly whether you're undercharging because it's fair or because you don't trust ease to be worth paying for. Raise the price on one thing today that you've been undercharging for specifically because it comes easily to you. Name a new number that reflects the actual result it produces. Say it out loud to the next person who asks.`,
    },

    // ── 20 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '20_C': {
      title: `20 in Earth Line — Judgement`,
      tagline: `A Design of the Financial Summons`,
      mastery: `You recognise when it's time to leave a financially adequate but genuinely outgrown position for one that actually fits who you've become, real vocational courage. You can genuinely evaluate your own career and choices honestly, without either inflating them or tearing yourself down. You know how to release a role that's completed its purpose and let it actually go. And most people ignore that call for years out of fear of losing what's stable — you've proven you can walk away from adequate to reach for right.`,
      shadow: `You spend years preparing to answer the summons instead of actually answering it, endlessly upskilling and refining a plan you already know the shape of. Harsh, excessive self-judgment can take over instead of honest evaluation, where every past career choice gets re-litigated instead of learned from. Underneath the preparation is often a fear that leaving would mean admitting years were spent in the wrong place. You end up more qualified than ever and no closer to actually making the change.`,
      invitation: `Ask yourself honestly whether you're preparing or avoiding. Take one real step today toward the truer income source, not another round of research. Choose the specific action that would move you forward — a conversation, an application, a resignation. You already know what you'd do if you weren't waiting to feel ready.`,
    },

    // ── 21 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '21_C': {
      title: `21 in Earth Line — The World`,
      tagline: `A Design of Recognized Enough`,
      mastery: `You can actually feel and recognise the moment a real level of material security has been reached, instead of endlessly redefining "enough" further out of reach. You integrate the whole picture — what you have and what you don't — into one honest assessment instead of only counting the gaps. That capacity to land, to actually stop and feel secure, is genuinely rare in a culture built around perpetual striving. And you find genuine satisfaction in arrival itself, not just in the next milestone it opens up.`,
      shadow: `You start treating arrival itself as dangerous, always needing one more milestone before you'll finally let yourself feel secure. You can also become complacent once you do arrive somewhere, mistaking one level of security for permanent safety and stopping the vigilance that got you there. Underneath either extreme is often a fear that admitting "enough" would mean losing your reason to keep striving. The goalpost keeps moving the instant you get close to it.`,
      invitation: `Ask yourself honestly whether you're avoiding arrival or have gone numb to what you've already built. Name one number or state today as genuinely enough, out loud, and let yourself land in it. Say it plainly to someone who'll hold you to it. Stay in the discomfort of stopping instead of setting the next target.`,
    },

    // ── 22 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '22_C': {
      title: `22 in Earth Line — The Fool`,
      tagline: `A Design of Unproven Courage`,
      mastery: `You start a financial venture without needing a guarantee handed to you first, real uncommon material courage rather than naivety about the risk. You bring genuine spontaneity and a willingness to take real financial risks most people have talked themselves out of. You move on real opportunity while people waiting for certainty are still waiting. And that willingness opens doors more cautious people never even see, let alone reach.`,
      shadow: `You repeat the same kind of fresh start without absorbing what the last one actually tried to teach you, so the same mistakes recur in new disguises. Naive risk-taking without real judgment can lead you toward genuine losses, mistaking recklessness for the same trust that once served you well. Underneath the repetition is often a fear that stopping to reflect would slow the momentum that feels like your whole identity. Years of ventures accumulate without the compounding wisdom that should have come from all of them.`,
      invitation: `Ask yourself honestly whether this leap is courage or a way of avoiding what the last one asked of you. Name one concrete lesson from your last financial leap and carry it into today's decision. Write down specifically what went wrong or right last time. You're building the habit that turns repeated leaps into growth instead of repetition.`,
    },

    // ── 17 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ───
    '17_D': {
      title: `17 in Karmic Tail — The Star`,
      tagline: `A Design of Reclaimed Light`,
      mastery: `You carry real, luminous conviction — you're meant to shine, and when you actually let yourself, you offer genuine hope to the people around you rather than a performance of it. You inspire real optimism in others just by being near them, without needing to perform positivity to do it. Your presence gives you a real head start on almost anything you attempt, before you've even proven the skill underneath it. And that's not vanity — it's a legitimate gift most people spend their whole lives learning to fake.`,
      shadow: `You dim your own light on reflex, staying deliberately half-developed so the work can never be fully judged in its finished form. You undercharge and undersell what you're actually worth, because full visibility itself feels like exposure rather than success. Underneath the dimming is often a fear that being seen at full brightness would invite a scrutiny half-finished work never has to survive. What should have shone brightest ends up permanently dimmed by your own hand.`,
      invitation: `Ask yourself honestly what finishing this thing at full brightness would actually risk. Let one piece of your work or talent be fully visible today, at full brightness, with no hedging. Finish the thing you've been keeping at 80% and put it in front of someone. You're finding out whether the exposure you fear actually costs you anything, and it won't.`,
    },

    // ── 1 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '1_D': {
      title: `1 in Karmic Tail — The Magician`,
      tagline: `A Design of the Finished Start`,
      mastery: `You generate real capability, and you can build something genuinely durable with it once you actually stay long enough to let the initial spark turn into something finished. You act first and let the plan catch up, generating momentum other people are still waiting on. The follow-through, once you actually commit to it, is reliable in a way most people's isn't. And when you do stay, the result holds — you have the raw material to build things that last.`,
      shadow: `You start with real force and abandon it the moment the initial spark fades into something more ordinary. The speed that makes you effective tips into starting more than you finish, since beginning is where you feel most alive and staying feels like a slow loss of that aliveness. Underneath the pattern is often a fear that staying would expose the work to a judgment the beginning never had to face. You end up with a long trail of beginnings and very few things you can point to as finished.`,
      invitation: `Ask yourself honestly what you're avoiding by reaching for something new instead of staying. Finish one thing today you already started, especially now that a new idea looks more appealing. Do the next unglamorous step on it before you let yourself think about anything new. You're proving that staying is where the spark actually becomes real.`,
    },

    // ── 2 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '2_D': {
      title: `2 in Karmic Tail — The High Priestess`,
      tagline: `A Design of the Spoken Knowing`,
      mastery: `You have real, accurate inner knowing, and when you actually speak it out loud, people trust it because it's genuinely earned. You perceive what's forming before it's announced and hold that perception privately until it's actually useful to name. It's not guessing or performance — it's earned knowledge, right more often than the loudest opinions in the room. People who've watched you be quietly correct for years start seeking you out specifically for that accuracy.`,
      shadow: `You sense things clearly and say absolutely nothing, letting other people arrive at the same conclusion slower, alone, and painfully, over and over. The silence starts to feel like humility, when it's actually withholding something people needed. Underneath the withholding is often a fear that speaking plainly and being wrong would cost more than staying quiet and being right in private. Years of accurate, unspoken observations accumulate behind you, helping no one but you.`,
      invitation: `Ask yourself honestly whether your silence is discernment or fear of being wrong out loud. Say one true thing out loud today that you'd normally keep to yourself. Choose something you've already privately concluded and say it plainly. Your accurate read is more useful spoken than silently held.`,
    },

    // ── 3 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '3_D': {
      title: `3 in Karmic Tail — The Empress`,
      tagline: `A Design of Received Care`,
      mastery: `You give generously, and it's a real gift — a capacity for care that's already proven itself many times over in the actual lives of the people around you. You cultivate people patiently, tending them the way you'd tend something alive rather than rushing them toward a result. You give freely, without needing to be asked first or thanked afterward. And people remember specific moments when you showed up for them without being prompted.`,
      shadow: `You give until you're completely empty and cannot let yourself be cared for in return, even when it's plainly offered. Exhaustion becomes your normal state, treated as the cost of being who you are rather than a signal something needs to change. Underneath the giving is often a fear that receiving would mean stepping outside the identity you've built as the one who cares. You end up the most generous person in every room and the least replenished one in it.`,
      invitation: `Ask yourself honestly when you last let someone actually take care of you. Let someone take care of you in one specific way today, without deflecting it or immediately repaying it. Name exactly what you need, out loud, to someone who's offered before. You're proving that being cared for doesn't cost you your identity.`,
    },

    // ── 4 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '4_D': {
      title: `4 in Karmic Tail — The Emperor`,
      tagline: `A Design of Trusted Authority`,
      mastery: `You can hold real, steady authority — neither gripping it too tightly nor giving it away the second it becomes uncomfortable to hold. You build things that actually last, thinking in years where most people think in weeks. You lead without needing to dominate, and you follow without disappearing. That middle ground is where trust actually forms, and you know how to stand in it.`,
      shadow: `You either grip control rigidly, refusing to let anyone else touch the decision, or abandon authority entirely, handing it off the moment it gets uncomfortable. The space between those two extremes feels foreign, as if command and surrender were the only two available modes. Underneath the swinging is often a fear that the steady middle doesn't actually exist for you, only extremes. People around you never quite know which version they'll get, and the unpredictability erodes trust faster than either extreme alone would.`,
      invitation: `Ask yourself honestly which extreme you default to and what you're protecting by staying there. Own one decision today, gently but firmly, without either gripping it too tightly or handing it off. State your position clearly and hold it through the first pushback. You're building the muscle for the steady middle.`,
    },

    // ── 5 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '5_D': {
      title: `5 in Karmic Tail — The Hierophant`,
      tagline: `A Design of Examined Belief`,
      mastery: `You can examine a belief you inherited from your family, culture, or upbringing and consciously choose what actually deserves to stay. You absorb what works from people who've genuinely tested it, and apply it with real discipline rather than treating it as theory. You're willing to keep what holds up and discard what doesn't, even when that means disagreeing with people who raised you. That capacity for genuine, independent evaluation is a rare form of maturity.`,
      shadow: `You swing between rigid certainty and total skepticism, rarely landing on a belief you've actually tested yourself and consciously decided to keep. Your convictions stay borrowed either way — uncritically inherited or uncritically rejected, with little of your own thinking applied to either. Underneath the swinging is often a fear that examining the inheritance too closely would mean questioning the people who gave it to you. This leaves you certain and unmoored at the same time.`,
      invitation: `Ask yourself honestly whether a belief you hold is tested or simply inherited. Examine one inherited belief today — about money, love, or authority — and decide on purpose whether it's actually yours. Trace where it came from and test it against your own experience. Keep it or discard it deliberately, out loud.`,
    },

    // ── 6 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '6_D': {
      title: `6 in Karmic Tail — The Lovers`,
      tagline: `A Design of the Kept Choice`,
      mastery: `You can make a real choice from your own values and actually stay inside it once the initial excitement fades. You hold competing pulls — duty and desire, safety and passion — without pretending one of them doesn't exist, and still choose. You commit fully once you've decided, rather than keeping a foot out the door in case something better appears. And people who choose you know they're getting the full version, not a conditional one.`,
      shadow: `You keep one foot out the door on decisions that actually matter, holding relationships and paths loosely enough to exit without much cost if things get hard. The half-commitment quietly prevents anything from ever becoming fully real, since nobody's building on ground that might shift. Underneath the hedging is often a fear of the version of yourself who'd have to live with a choice that turned out wrong. You tell yourself you're keeping options open, but you're actually withholding the full weight of your presence.`,
      invitation: `Ask yourself honestly what you're protecting by keeping this choice half-made. Recommit fully today to one choice you've been hedging. Say, out loud, to the person or situation involved, that you're in fully now. Remove the exit you'd quietly kept open.`,
    },

    // ── 7 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '7_D': {
      title: `7 in Karmic Tail — The Chariot`,
      tagline: `A Design of Trusted Direction`,
      mastery: `You can hold direction firmly without gripping it too tightly — steady, trusting forward motion that doesn't need to force its way through everything to actually arrive somewhere real. You hold opposing pulls at once, drive and rest, without either hijacking the other. People sense when someone's actually going somewhere versus performing busyness, and they trust the difference. Your direction is legible without being aggressive, and that combination is rare.`,
      shadow: `You either force your way through everything with unnecessary strain, or drift without any real momentum, rarely finding the steady middle. One mode exhausts you and everyone around you; the other leaves you going nowhere for long stretches. Underneath the oscillation is often a fear that trusting a steady pace would mean losing the urgency that's kept you moving at all. The switching between forcing and drifting costs you more energy than a steady pace ever would.`,
      invitation: `Ask yourself plainly whether you're forcing or drifting right now, and what that's protecting you from. Loosen your grip on one thing you've been forcing, or choose real direction on one thing you've let drift. Take a single concrete step in the steadier mode. You're testing whether unforced motion is actually possible for you.`,
    },

    // ── 8 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '8_D': {
      title: `8 in Karmic Tail — Justice`,
      tagline: `A Design of the Settled Account`,
      mastery: `You can make an honest accounting — an apology, a boundary, a debt repaid — and actually see it through to genuine settlement, rather than letting it sit half-acknowledged indefinitely. You hold yourself to the same standard you hold others to, which is what makes your accounting trustworthy. You understand that unresolved accounts quietly cost more the longer they're left open. And people trust you specifically because you don't let things fester between you unnamed.`,
      shadow: `You carry a persistent, hard-to-place sense of owing or being owed that never actually resolves, especially around money and unspoken relational ledgers. The feeling sits underneath ordinary interactions, quietly shaping how generous or guarded you are. Underneath the unsettled ledger is often a fear that naming the debt out loud would make the relationship itself feel transactional. The debt, real or imagined, never gets settled because it was never spoken.`,
      invitation: `Ask yourself honestly what's actually sitting unresolved between you and someone else. Settle one small account today — an apology, a repayment, a boundary you've been avoiding. Name the specific thing and take the concrete action that closes it. You're clearing an entry that's been running longer than it needed to.`,
    },

    // ── 9 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '9_D': {
      title: `9 in Karmic Tail — The Hermit`,
      tagline: `A Design of the Offered Lantern`,
      mastery: `You gather real wisdom in solitude, and when you actually offer it, it genuinely helps someone in a way faster advice rarely does. You can be completely self-sufficient without it curdling into isolation, content in your own presence rather than merely tolerating it. What you bring back from time alone has weight, because it was earned through patience. And people who receive your considered thoughts notice the difference from advice given on the fly.`,
      shadow: `You withdraw past what reflection actually requires, using solitude to avoid people rather than to genuinely gather insight. Hard-won expertise stays entirely locked inside you, long after it could have helped someone actively waiting for it. Underneath the withdrawal is often a fear that speaking plainly would make the depth ordinary. Years of quiet wisdom accumulate with almost nobody ever getting the benefit of it.`,
      invitation: `Ask yourself honestly whether the solitude is gathering something or has become a comfortable way to avoid people. Share one thing you've learned in solitude today with someone who could use it right now. Reach out and offer it plainly, without waiting to be asked. Your solitude was always meant to feed something beyond itself.`,
    },

    // ── 10 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '10_D': {
      title: `10 in Karmic Tail — The Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `You can let a natural cycle turn — a season ending, a role changing — without gripping against it or trying to hold the wheel in place through sheer force of will. You move with change instead of merely surviving it, adjusting rather than resisting. You trust the season rather than fighting it, which actually makes transitions gentler than they'd otherwise be. And you let yourself experience a good period fully instead of immediately bracing for its end.`,
      shadow: `You dread the downswing and grip hardest exactly at the high point, refusing to let a cycle complete naturally. This resistance usually only makes the eventual turn harder and more disruptive than it ever needed to be. Underneath the gripping is a fear that you have no real control over the cycle, so holding the parts you can touch feels like the only defense. You spend the good phase bracing for its end instead of living inside it, which quietly poisons the very thing you're afraid to lose.`,
      invitation: `Ask yourself honestly whether you're bracing for an ending that hasn't even started yet. Let one cycle in your life turn today without resisting it. Name the specific thing you can feel ending or shifting, and actively let go of one piece of control over it. You're practising trust in a process happening either way.`,
    },

    // ── 11 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '11_D': {
      title: `11 in Karmic Tail — Strength`,
      tagline: `A Design of Gentle Endurance`,
      mastery: `You can meet a hard moment with patient, embodied calm — real strength, distinct from both raw force and simple collapse, that people can feel and actually lean on. You can stay present with raw, unruly states in yourself without needing to suppress them or be ruled by them. Your calm isn't the absence of feeling; it's the capacity to stay present inside difficulty. And that specific quality makes you the person others quietly move toward in a crisis.`,
      shadow: `You either overpower situations that actually needed patience with sheer force, or collapse under pressure that gentleness alone could have held. You rarely find the steadier middle path, swinging from one extreme to the other depending on the day. Underneath the swinging is a fear that the steady middle doesn't actually exist for you. People around you can't predict which version of you they'll get, which erodes the trust your calm was supposed to build.`,
      invitation: `Ask yourself honestly which extreme you default to under pressure, and what that's protecting you from. Meet one difficult moment today with calm instead of force or giving up. Practise staying present without pushing through aggressively or checking out. The steady middle is available to you.`,
    },

    // ── 12 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '12_D': {
      title: `12 in Karmic Tail — The Hanged Man`,
      tagline: `A Design of Voluntary Release`,
      mastery: `You can release something voluntarily, before you're ever forced to, and actually mean it when you do. You can pause a decision to release something without anxiety, trusting the timing is yours to choose. It's a genuine act of will, not a concession made once you had no other option left. And people trust the things you release because they can tell you weren't cornered into it.`,
      shadow: `You grip control until circumstances eventually force your hand, or you perform sacrifice while privately resenting every second of it. That resentment quietly poisons what was supposed to be a genuine release into something worse than what you started with. Underneath the gripping is often a fear that releasing on your own terms would mean admitting it should have happened sooner. You end up letting go of things too late to feel any of the grace that timely release would have given you.`,
      invitation: `Ask yourself honestly what you're holding onto past its natural end, and why. Release one thing today on your own terms, before you're forced to give it up by circumstance. Let it go deliberately, on your own timing. You're claiming the release before it claims you.`,
    },

    // ── 13 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '13_D': {
      title: `13 in Karmic Tail — Transformation`,
      tagline: `A Design of the Complete Ending`,
      mastery: `You can let an ending actually finish — completely, with nothing lingering behind to quietly pull you back toward what's already over. You can let an old version of yourself die so a truer one can take its place, without needing the process to be dramatic to trust it's real. That completeness means the new life you build isn't competing with unfinished business from the old one. And you close doors fully, which is precisely what lets you walk through the new one.`,
      shadow: `You leave things half-ended, one foot still in a door you already decided to walk through, which keeps both the old and the new from ever fully becoming real. Neither life gets to fully start, because you're technically standing between the two of them. Underneath the suspension is often a fear that a clean ending would mean admitting something was actually over. Years can pass in this half-ended state without you noticing how long it's been.`,
      invitation: `Ask yourself honestly what ending you're still keeping technically open, and why. Let one lingering ending in your life actually finish today, fully. Take the concrete action that closes it completely — the conversation, the paperwork, the final word. Don't leave yourself a door back into it.`,
    },

    // ── 14 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '14_D': {
      title: `14 in Karmic Tail — Temperance`,
      tagline: `A Design of Held Extremes`,
      mastery: `You can hold two opposing things at once without collapsing into either extreme to resolve the tension too early. You blend things in the right proportion for the specific situation, not by rote formula. It shows up as genuinely steady judgment, the kind that doesn't need a quick answer to feel resolved. And people bring you their conflicts because you can actually hold both sides without flattening either one.`,
      shadow: `You swing between all-or-nothing states — total immersion or total withdrawal, reckless spending or fear-driven restriction — rarely landing anywhere in between. The middle ground almost never gets a real chance, because you overcorrect the instant one extreme starts to feel uncomfortable. Underneath the swinging is often a fear that the moderate response wouldn't actually be enough. You spend years oscillating instead of settling.`,
      invitation: `Ask yourself honestly which extreme you're currently in and what discomfort you're overcorrecting away from. Hold the middle on one thing today instead of swinging to either extreme. Deliberately pick a moderate response and stay with it. The middle is a real, livable place.`,
    },

    // ── 15 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '15_D': {
      title: `15 in Karmic Tail — The Devil`,
      tagline: `A Design of Loosened Chains`,
      mastery: `You can name an attachment honestly, without dressing it up as something nobler, and take one real step to loosen its grip. You look directly at your own appetite without flinching away or pretending it isn't there. You're willing to look at what actually has a hold on you instead of a more flattering version of it. And that honesty is the entire mechanism that lets real change happen.`,
      shadow: `You recreate dynamics of control — being controlled or controlling someone else — without seeing the pattern while it's unfolding in real time. You only recognise it after the fact, once it's already run its course and done its damage. Underneath the compulsion is often shame you're avoiding by staying fixated on the symptom rather than the source. You keep repeating a shape you can describe perfectly in hindsight and never catch while you're inside it.`,
      invitation: `Ask yourself honestly what currently has a real hold on you, right now, not in hindsight. Name one attachment or control dynamic honestly today, and take one concrete step to loosen it. Take one specific action that reduces the grip. You're catching the pattern while it's live.`,
    },

    // ── 16 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '16_D': {
      title: `16 in Karmic Tail — The Tower`,
      tagline: `A Design of the Finished Collapse`,
      mastery: `You can let a structure that's already failing actually fall, on your own terms, instead of propping it up long past the point it can genuinely hold any real weight. You recover fast from a collapse, integrating what it showed you rather than just surviving it. You'd rather face the collapse directly than keep pretending the structure is still sound. And people eventually respect the honesty of it more than the false stability of the alternative.`,
      shadow: `You maintain beliefs, relationships, or identities long past the point they're actually standing on solid ground, out of fear of what the collapse might mean about who you are. The structure gets propped up with more effort as the actual foundation erodes underneath it. Underneath the propping is often a fear that admitting failure would confirm something worse about yourself. You spend years defending something that was quietly finished long before you admitted it.`,
      invitation: `Ask yourself honestly what you're propping up that's already failed. Let one thing that's already failing fall today, deliberately, instead of propping it up further. Stop the maintenance you've been doing to keep it upright. Let the collapse happen on your terms.`,
    },

    // ── 18 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '18_D': {
      title: `18 in Karmic Tail — The Moon`,
      tagline: `A Design of the Faced Fog`,
      mastery: `You can walk directly into an uncertain situation and let real clarity come from actually being inside it, rather than requiring certainty before you'll move. You navigate ambiguity without needing everything resolved first. Being inside the fog gives you information that standing outside it never could. And you resolve uncertainty by entering it, not by circling it forever.`,
      shadow: `You carry free-floating anxiety that doesn't attach itself to anything specific, and you avoid the exact situations that would require facing something head-on. You mistake the intensity of a feeling for its accuracy, letting vague dread stand in for real signal. Underneath the avoidance is often a fear that looking directly would confirm the worst version rather than settle it. Years of low-grade anxiety accumulate around problems a single direct look could have resolved.`,
      invitation: `Ask yourself honestly whether what you're feeling is real signal or unmoored anxiety avoiding a direct look. Walk toward one uncertain thing today instead of avoiding it — check the number, have the conversation. Get the actual information today rather than continuing to guess. The fog was worse than whatever's inside it.`,
    },

    // ── 19 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '19_D': {
      title: `19 in Karmic Tail — The Sun`,
      tagline: `A Design of Undimmed Joy`,
      mastery: `You can let joy be fully, visibly felt — real vitality offered without apology, without needing to shrink it for anyone else's comfort. You bring genuine vitality into a room just by being in it, contagious rather than performed. Being around you when things are going well feels genuinely good, because your excitement is real. And that uncomplicated capacity for full joy is a gift most people have trained themselves out of.`,
      shadow: `You downplay good news and mute your own excitement, feeling a strange, unearned guilt whenever things are genuinely going well. Visible joy starts to feel like it requires justification you don't currently have. Underneath the minimizing is often a fear that your joy would cost someone else something, so shrinking it feels like generosity. You train everyone around you to underreact to your successes too, since you've modeled exactly how small they should be treated.`,
      invitation: `Ask yourself honestly what you're afraid your full joy would cost someone else. Let one piece of good news be fully celebrated today, at full volume, with no minimizing. Tell someone without immediately downplaying it. Let their excitement land instead of correcting it downward.`,
    },

    // ── 20 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '20_D': {
      title: `20 in Karmic Tail — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `You can answer a call you've been postponing, even before you feel fully ready, trusting that readiness will catch up once you've started moving. You can genuinely evaluate your own past honestly, without either inflating or tearing yourself down over it. You act on the summons before you've fully rehearsed it, and it works out more often than waiting did. That trust in your own capacity to grow into a decision is genuinely rare.`,
      shadow: `You get close to something important and stall just short of the actual leap, again and again, circling the same threshold without ever fully crossing it. Harsh, excessive self-judgment can take over instead of honest evaluation, re-litigating past attempts instead of learning from them. Underneath the circling is a fear that crossing and failing would confirm something worse than never crossing at all. Years of near-misses accumulate without a single actual leap taken.`,
      invitation: `Ask yourself honestly what crossing the threshold would actually risk confirming. Answer one call you've been postponing today, imperfectly, before you feel fully ready. Take the actual step today, even underprepared. Readiness was always going to arrive after the leap, not before it.`,
    },

    // ── 21 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '21_D': {
      title: `21 in Karmic Tail — The World`,
      tagline: `A Design of the Closed Circle`,
      mastery: `You can let something nearly-finished actually complete, resisting the old pull to stop short right before the end where the last effort matters most. You integrate everything, the hard parts and the good parts, into one finished whole instead of only keeping what flatters you. What you complete carries real weight because you saw it all the way through. And you find genuine satisfaction in completion itself, not just in the next thing it opens up.`,
      shadow: `You stop just short of finishing — projects, relationships, goals that get to nearly-there and then quietly stall for no clear reason. A long trail of almost-done things builds up behind you, weighing on you more than a finished one ever would. Underneath the stalling is often a fear that finishing would expose the work to a judgment "almost" never has to face. The almost becomes its own cluttered category of unresolved weight you carry indefinitely.`,
      invitation: `Ask yourself honestly what finishing this thing would actually risk exposing. Complete one nearly-finished thing today instead of letting it stay at "almost." Do the final, tedious step that would actually close it out. Mark it done somewhere visible so it's undeniable.`,
    },

    // ── 22 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '22_D': {
      title: `22 in Karmic Tail — The Fool`,
      tagline: `A Design of the Considered Leap`,
      mastery: `You can take a real leap deliberately, with your eyes fully open — genuine trust that includes awareness, distinct from both blind recklessness and the total caution that keeps you standing still. You step forward without needing a guarantee handed to you first. You weigh the risk honestly and still choose to move, a different thing from ignoring the risk or being paralysed by it. And people who watch you leap this way start trusting your judgment about their own leaps too.`,
      shadow: `You either leap without any real consideration, or refuse to leap at all, rarely finding the trust that includes awareness. Neither version teaches you much about your actual judgment, since one skips the thinking and the other skips the doing. Underneath the pattern is often a fear that a genuinely considered leap, if it failed, would leave you with no excuse left to hide behind. The considered leap keeps getting bypassed for the easier extreme.`,
      invitation: `Ask yourself honestly which extreme you default to, and what excuse it protects you from losing. Take one real, considered leap today — not reckless, not avoided, genuinely chosen. Name the risk plainly and weigh it for real. Act on a real timeline, not an indefinite one.`,
    },

    // ── 7 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '7_E': {
      title: `7 in Soul Center — The Chariot`,
      tagline: `A Design of the Trusted Compass`,
      mastery: `You know exactly where you're headed, and you don't need every door pushed open before you'll trust the direction — you recognise the path that's actually aligned and you move on it. You hold opposing forces at once without either one hijacking you: drive and rest, instinct and plan, your own agenda and what a situation actually needs. You don't have to do everything yourself to feel like it's really yours; you can hand pieces to people and still feel the whole thing is moving because you're the one steering it. Obstacles stop registering as personal insults and start registering as terrain — real, but not a verdict on whether you should keep going.`,
      shadow: `The drive turns inward or outward as force instead of direction. You feel an overwhelming urge to control every variable and every person around you, and impatience with anyone moving slower than your internal tempo shows up as friction nobody asked for. Underneath that control is a real split — part of you wants to rush forward and part of you is quietly terrified, and the two pull against each other until the tension shows up as anxiety, sudden anger, or a burnout you didn't see building. When the pressure gets to be too much, the whole thing can invert into total stall: stuck, frustrated that nothing's moving, and unwilling to actually take the wheel. Your legs, your spine, your nervous system carry the tension of forcing a road that never needed forcing.`,
      invitation: `Ask yourself plainly: are you gripping the reins white-knuckled, fighting every turn, or are you letting a clear vision actually pull you forward? Set one decisive goal today and name it out loud. Delegate the piece that isn't actually yours to hold. Then let go of forcing the pace and trust that the road will keep unfolding whether or not you white-knuckle it.`,
    },

    // ── 1 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '1_E': {
      title: `1 in Soul Center — The Magician`,
      tagline: `A Design of the Sacred Beginning`,
      mastery: `You're a genuine point of origination — the one through whom ideas actually get started and brought into form, not just imagined. You read an opening the instant it appears and act before the moment closes, and that decisiveness is a real skill, not impatience. You hold your own authorship without needing anyone's approval first: you don't wait to be appointed before you begin. And you recover fast from a false start, treating it as information rather than proof you shouldn't have tried, which is exactly what lets you keep beginning things other people would have stopped attempting long ago.`,
      shadow: `The origination turns compulsive, and only the beginning ever feels real to you. You chase the high of a fresh start over and over, and the compulsion can tip into using people or resources as raw material for the next idea rather than partners in it. Underneath the constant starting is often a real fear of being tested — as long as something's new, it can't fail yet, so staying in the beginning becomes a way of postponing judgment indefinitely. The accumulation of unfinished originations eventually reads, to you and everyone watching, as scattered rather than prolific.`,
      invitation: `Ask yourself honestly whether you're avoiding a verdict by staying permanently at the starting line. Pick the oldest beginning you're still carrying and take its next concrete step today, not a new one. Tell one person you're doing this, so there's a witness to the follow-through. Let finishing, however unglamorous it feels next to a fresh idea, be the thing you're proud of today.`,
    },

    // ── 2 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '2_E': {
      title: `2 in Soul Center — The High Priestess`,
      tagline: `A Design of Quiet Certainty`,
      mastery: `You know things before you can fully explain why, and you're right often enough that the pattern is undeniable to anyone paying attention. You hold two kinds of intelligence at once — the visible, provable kind and the felt, unspoken kind — without needing to collapse one into the other to feel legitimate. Silence, for you, is a real working mode, not withdrawal: you process fully before you speak, and what you eventually say has weight because of it. You protect what's sacred to you without needing to explain the protection, and people sense the boundary and mostly respect it without being told why.`,
      shadow: `The privacy that once felt like depth turns into a sealed room nobody, including you, can fully get into. You withhold insight that could genuinely help someone, mistaking silence for wisdom when it's actually just fear of being wrong in public. The gap between what you know and what you say widens until people stop asking you anything at all, correctly sensing they won't get a real answer. Underneath the mystery is often a quieter dread — that if you spoke plainly, the knowing might turn out to be less than everyone assumed, so staying veiled protects the reputation more than it protects the truth.`,
      invitation: `Ask yourself honestly whether your silence is discernment or fear wearing a more flattering name. Choose one thing you're currently sensing but haven't said, and say it today, out loud, to the person it actually concerns. Don't wrap it in hedges or plausible deniability. Let your knowing be tested in the open once, and notice that it survives contact with daylight.`,
    },

    // ── 3 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '3_E': {
      title: `3 in Soul Center — The Empress`,
      tagline: `A Design of Rooted Cultivation`,
      mastery: `You cultivate rather than force, and that patience is a real form of intelligence, not passivity. You read what a person or a project actually needs to grow — more room, more time, more nutrients — and you supply exactly that instead of what would be fastest. You hold abundance without hoarding it, generous by nature rather than by calculation, which makes people feel genuinely nourished around you instead of managed. And you know the difference between something dormant and something dead, so you don't waste your care on what's already finished, and you don't abandon what's simply resting.`,
      shadow: `The generativity turns compulsive, and you can't tolerate anything staying still — you push growth onto people and projects that actually needed a season of rest. Underneath that pushing is often a fear that stillness means failure, so you keep fertilizing what should be left fallow. At the same time, the nurturing runs so far outward that your own life goes completely untended; you can name everyone else's growth in detail and draw a blank on your own. Abundance without boundaries starts to look like self-erasure, dressed up as generosity so nobody, including you, questions it.`,
      invitation: `Ask yourself honestly whose growth you've actually been tending this year, and whether your own name is on that list. Choose one thing in your own life that's been left dormant while you tended everyone else's. Give it the same patient, undistracted attention you'd give someone else's project. Let one thing near you stay fallow today without pushing it, as practice for trusting that not everything needs your hand on it to be safe.`,
    },

    // ── 4 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '4_E': {
      title: `4 in Soul Center — The Emperor`,
      tagline: `A Design of Purposeful Structure`,
      mastery: `You build structure that actually holds weight, thinking in decades where most people think in weeks. You take responsibility for outcomes without needing to be asked, and people around you feel the safety of that ownership even when they can't name where it's coming from. You can hold real authority without needing to dominate every decision underneath it — you set the frame and then let people build inside it, rather than controlling every beam yourself. And you know how to say no to what would weaken the foundation, even when saying yes would be easier in the moment.`,
      shadow: `Structure hardens into control, and the frame you built to protect something living starts mattering more to you than the life inside it. You defend systems long after they've stopped serving anyone, mistaking rigidity for strength because dismantling something you built feels like admitting failure. Authority that isn't being challenged can curdle into authority that refuses to be challenged, and you start experiencing any pushback as a threat to the whole structure rather than useful information. Underneath the control is often a real fear that without the frame, everything — including you — falls apart.`,
      invitation: `Ask yourself plainly whether you're defending a structure or defending your own sense of having built something that matters. Pick the system you're most attached to maintaining and check honestly whether it still serves its original purpose. If it doesn't, take one real step toward loosening or retiring it today. Practise handing a piece of authority to someone else and watching, without intervening, what they do with it.`,
    },

    // ── 5 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '5_E': {
      title: `5 in Soul Center — The Hierophant`,
      tagline: `A Design of Living Transmission`,
      mastery: `You act as a genuine channel for understanding — receiving it fully and then passing it forward, so it doesn't stop with you. You test what you're taught against your own lived experience before you adopt it, which means what you eventually teach has actually been proven, not just repeated. You hold structure and meaning together, able to give someone both the rule and the reason behind it, so what you pass on actually sticks rather than just being memorised. And you know how to meet someone exactly where they are, adjusting the teaching to the student instead of making the student adjust to the teaching.`,
      shadow: `The transmission calcifies into dogma, and you start defending the doctrine instead of testing it against reality. You can become rigid about the one right way to understand something, unable to tolerate a student — or yourself — arriving at the truth by a different route. Underneath the rigidity is often a fear that if the framework flexes, it might not hold, so you enforce it harder rather than examine it. And wisdom that stays entirely private, hoarded rather than transmitted, quietly stops functioning as wisdom at all, since nothing it produces ever reaches anyone who needed it.`,
      invitation: `Ask yourself honestly whether you're teaching from tested understanding or defending inherited doctrine you never actually examined. Choose one thing you know well enough to be useful and share it today with someone who doesn't have it yet, even before you feel fully qualified. Let them ask a question that challenges it, and actually sit with the challenge instead of reflexively defending the framework. You're finding out whether what you hold can flex without breaking.`,
    },

    // ── 6 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '6_E': {
      title: `6 in Soul Center — The Lovers`,
      tagline: `A Design of Lived Alignment`,
      mastery: `You choose from your own values rather than from pressure or convenience, and you can name exactly why you chose what you chose. You hold two competing pulls — duty and desire, safety and passion — without needing to pretend one of them doesn't exist, and you make the call anyway. You commit fully once you've decided, rather than keeping a foot out the door in case the other option turns out better. And you can tell the difference between what's aligned and what's simply appealing, even when the appealing option is louder.`,
      shadow: `Every choice starts to feel equally weighty, and deliberation stretches out until exhaustion gets mistaken for depth. You can stay suspended between two options for so long that the choosing itself becomes a kind of avoidance, dressed up as care. Underneath the endless weighing is often a fear of the version of yourself who'd have to live with getting it wrong, so staying undecided feels safer than actually choosing. And once you finally do commit, guilt about the option you didn't choose can quietly undermine the one you did.`,
      invitation: `Ask yourself honestly whether this particular decision actually deserves the weight you're giving it, or whether you're using deliberation to avoid the discomfort of choosing. Let one small decision today be genuinely small — make it fast, on instinct, without a pro-and-con list. Save the deliberation for the one choice that actually matters, and commit to it fully once you've made it. Stop looking back at the door you didn't walk through.`,
    },

    // ── 8 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '8_E': {
      title: `8 in Soul Center — Justice`,
      tagline: `A Design of Grounded Integrity`,
      mastery: `You hold yourself to the same standard you hold everyone else to, and that double application is what actually earns trust rather than merely claiming it. You can see imbalance clearly — who's carrying more, who's taking advantage — and you act to correct it rather than just naming it. You make decisions based on evidence and fairness rather than on who you like more, even when fairness costs you something with a friend. And you can admit when you were wrong without collapsing your whole sense of self around the mistake, which is rarer than it sounds.`,
      shadow: `The clarity turns into a permanent audit of everyone around you, and you start using your own honesty as a ruler to measure the world by instead of simply living inside your own values. Fairness curdles into rigidity — you apply the letter of the rule even when the spirit of it would ask for mercy, and you can't always tell the two apart anymore. Underneath the judgment is often an old wound around being treated unfairly yourself, which you're now unconsciously re-litigating on everyone else's behalf. People start bracing around you instead of relaxing, because your presence has started arriving as verdict rather than company.`,
      invitation: `Ask yourself honestly whether you're holding a standard or running a permanent trial on the people around you. Apply the exact standard you hold others to, to yourself, out loud, before you apply it to anyone else today. Let one small imperfection in someone else pass without correction. Practise the difference between naming an imbalance and simply living fairly yourself.`,
    },

    // ── 9 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '9_E': {
      title: `9 in Soul Center — The Hermit`,
      tagline: `A Design of Depth in Motion`,
      mastery: `You access a depth of understanding in solitude that most people never reach even with company and years of trying. You can be completely self-sufficient without it curdling into isolation, content in your own presence rather than merely tolerating it. You return from reflection with something usable — a genuinely useful insight, not just a mood — and that translation from inner to outer is the actual skill, not the solitude itself. And you can hold your own counsel without needing constant outside validation to know you've reached something true.`,
      shadow: `The self-sufficiency tips into permanent withdrawal, and the world of other people starts to feel thin next to what solitude reliably gives you. You mistake staying deep in reflection for actual purpose, so the insight never gets tested against a real, lived life outside your own head. Underneath the retreat is sometimes a real fear of being misunderstood if you spoke plainly, so staying quiet protects the understanding from ever being challenged. People stop inviting you into things, correctly reading the signal, and the isolation that started as a gift starts costing you connection you didn't mean to give up.`,
      invitation: `Ask yourself honestly whether the solitude is still gathering something or has quietly become avoidance dressed as depth. Bring one specific thing the quiet showed you back out into your actual life today. Share it with a real person, out loud, and let them respond to it. You're testing whether your insight was always meant to move something beyond your own head.`,
    },

    // ── 10 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '10_E': {
      title: `10 in Soul Center — The Wheel of Fortune`,
      tagline: `A Design of the Steady Center`,
      mastery: `You move with change instead of merely surviving it, and that's real equanimity, not luck dressed up as calm. You can read the actual phase you're in — rising, peaking, contracting — and adjust your behavior to match it instead of fighting the wrong battle at the wrong time. You trust that a downturn is a season, not a verdict on your worth, and that trust lets you stay functional exactly when other people fall apart. And you can let go of a good period without needing to grip it, because you know the wheel keeps turning either way.`,
      shadow: `Your entire sense of purpose gets tied to the wheel's current position — meaningful when things go well, meaningless the instant they turn. You grip hardest exactly at the high point, dreading the coming downswing so much that you can't actually enjoy the peak while you're in it. Underneath the gripping is a fear that you have no control over the cycle at all, and rather than sit with that powerlessness, you white-knuckle the parts you can still touch. When the downturn does arrive, it costs you the very steadiness you'd need most, because you'd staked your whole sense of self on the good season lasting.`,
      invitation: `Ask yourself honestly which phase of your actual cycle you're in right now, separate from how you feel about it. Find your footing today in your relationship to the turning itself, not in wherever the wheel currently sits. Take one action that doesn't depend on the season cooperating with you. Practise letting a good moment be good without needing to grip it in place.`,
    },

    // ── 11 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '11_E': {
      title: `11 in Soul Center — Strength`,
      tagline: `A Design of Purposeful Endurance`,
      mastery: `You hold something genuinely difficult without either fighting it or collapsing under it, and that's real, embodied strength — patience with teeth, not passivity. You can tame something wild in yourself, real appetite or real anger, without needing to suppress it into nonexistence to feel safe. You lead through steadiness rather than force, and people follow because your calm is real, not performed. And you know the difference between gentleness and weakness, so you can be soft without ever being a pushover.`,
      shadow: `The endurance turns compulsive, and holding weight becomes an identity rather than a means to something else. You suppress what's actually wild in you instead of taming it, performing a calm you don't feel until the pressure finds another way out — tension, a sudden eruption, a body that starts breaking down from carrying what your voice never said. Underneath the performance is often a fear that if the intensity were shown honestly, it would be too much for the people around you. You keep carrying weight long after the reason for carrying it has disappeared, because putting it down would mean admitting you didn't need to hold it in the first place.`,
      invitation: `Ask yourself honestly whether you're actually taming something in yourself or just suppressing it and calling the suppression strength. Let one feeling be fully felt today, visibly, before you try to manage or contain it. Choose someone you trust and let your composure genuinely slip in front of them. You're finding out that real strength includes being witnessed, not just endured alone.`,
    },

    // ── 12 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '12_E': {
      title: `12 in Soul Center — The Hanged Man`,
      tagline: `A Design of the Returned Surrender`,
      mastery: `You can stop pushing and let an answer arrive through release instead of effort, and that comfort with not-knowing is a genuine skill most people never develop. You see the world from an angle others miss precisely because you're willing to hang upside down for a while, so to speak, and look at things from where nobody else is looking. You can pause a decision without anxiety, trusting that the pause itself is doing real work. And you know how to let something be sacrificed on purpose, for a real reason, without turning the sacrifice into a permanent identity.`,
      shadow: `The surrender turns into permanent suspension, and not-knowing becomes the whole purpose instead of a passage through to one. You stay in the pause because it's safer than descending back into the risk of an actual choice, and you can dress that avoidance up as patience or spiritual maturity so convincingly that even you believe it. Underneath the suspension is often a real fear of being wrong once you commit, so staying undecided protects you from ever finding out. You collect insight after insight from the waiting and let none of it change what you actually do, which means the surrender never resolves into anything.`,
      invitation: `Ask yourself honestly whether the pause is still doing real work or has become a comfortable place to avoid choosing. Take the insight your last period of surrender revealed and act on it today, concretely, not just internally. Name it plainly to someone else. Let the action be imperfect rather than waiting for the pause to resolve itself on its own.`,
    },

    // ── 13 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '13_E': {
      title: `13 in Soul Center — Transformation`,
      tagline: `A Design of Genuine Becoming`,
      mastery: `You can let an old version of yourself actually die so a truer one can take its place, and you don't need the process to be dramatic to trust that it's real. You metabolise loss rather than just surviving it — grief, an ending, a failure — and come out the other side changed rather than just older. You can release an identity that used to serve you the moment it stops fitting, without needing a crisis to force your hand. And you trust that what comes after the ending is genuinely worth arriving at, even before you can see the shape of it.`,
      shadow: `You manufacture endings for their own sake, mistaking constant reinvention for the deeper transformation this actually asks of you. You engineer crisis because ordinary, gradual growth feels unconvincing next to dramatic collapse, and you can find yourself provoking an ending that didn't need to happen yet. Underneath the compulsive reinvention is often a fear of staying still long enough to be truly known in one fixed form, so becoming someone new again and again keeps you permanently just out of reach. Reinvention starts to substitute for growth rather than produce it, and the pattern repeats without ever actually going anywhere new.`,
      invitation: `Ask yourself honestly whether you're transforming or just running from being seen as finished. Let one change today be slow and quiet instead of dramatic and announced. Choose something you'd normally turn into a big reinvention moment and shift it gradually instead, without telling anyone. You're testing whether real growth needs an audience to count, and it doesn't.`,
    },

    // ── 14 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '14_E': {
      title: `14 in Soul Center — Temperance`,
      tagline: `A Design of Earned Synthesis`,
      mastery: `You blend opposites into something whole instead of forcing a choice between them, and that patient synthesis is a genuine skill most people never develop. You moderate your own extremes naturally, neither all-in nor checked-out, which makes you unusually sustainable over the long run. You can act as a real bridge between two people or two positions that would otherwise talk past each other, translating rather than picking a side. And you know how to combine things in the right proportion — not equal parts, but the actual right mix for this specific situation.`,
      shadow: `The blending becomes an excuse to avoid fully engaging with either side of anything, and you stay so centered that nothing ever gets lived with real intensity or genuine commitment. You can spend years in careful moderation without ever fully entering an experience deeply enough to actually be changed by it. Underneath the endless balancing is sometimes a fear of what full commitment to either side might cost you, so staying in the blend protects you from that risk. What should be a genuine synthesis of two real things starts to look, from outside, like an unwillingness to ever actually choose.`,
      invitation: `Ask yourself honestly whether your balance is real integration or a way of never having to fully commit to anything. Fully inhabit one side of something today before trying to blend it with the other. Choose a tension you'd normally split down the middle and commit to one side completely, just for today. You're gathering the real material your synthesis has been missing by staying too centered to ever go deep.`,
    },

    // ── 15 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '15_E': {
      title: `15 in Soul Center — The Devil`,
      tagline: `A Design of Metabolized Shadow`,
      mastery: `You look directly at your own appetite, your own hunger for pleasure or power, without flinching away or pretending it isn't there. That unflinching honesty about what you actually want is a rare and genuinely freeing capacity. You understand your own attachments well enough to use them deliberately, rather than being quietly run by them from underneath. You can hold real intensity — sexual, material, ambitious — without either suppressing it into shame or being consumed by it. And you know precisely what has a hold on you, which is the entire precondition for ever actually being free of it.`,
      shadow: `The appetite runs the show instead of being run by you, and you become genuinely ruled by attachment, compulsion, or the need for control without seeing the chain while it's actively happening. You circle your own shadow material endlessly, fascinated by the looking itself, without ever converting the insight into the freedom it was supposed to lead toward. Underneath the compulsion is often shame you're avoiding by staying fixated on the symptom rather than the source. You can become skilled at describing your own patterns in detail and remain, functionally, exactly as bound by them as before.`,
      invitation: `Ask yourself honestly what currently has a real hold on you, and say it plainly, without softening it. Name the specific attachment or control dynamic today, out loud, to yourself or someone else. Take one concrete action that loosens its grip rather than another round of examining it. You already have the insight — what's missing is letting it cost you something to act on.`,
    },

    // ── 16 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '16_E': {
      title: `16 in Soul Center — The Tower`,
      tagline: `A Design of Earned Clarity`,
      mastery: `You can survive a sudden, restructuring shock and come out the other side with real clarity about what actually matters, stripped of what was only ever decoration. You can let a false structure fall rather than propping it up indefinitely, which takes a specific kind of courage most people don't have. You recover fast from upheaval, not by suppressing what happened but by actually integrating what it showed you. And you can tell the difference between a necessary collapse and unnecessary destruction, so your capacity for radical honesty doesn't turn into a habit of breaking things that were fine.`,
      shadow: `You start needing the collapse itself to feel like anything real is happening, provoking crisis because gradual, quiet clarity feels unconvincing next to something dramatic. You can become genuinely destructive, tearing down structures — relationships, plans, beliefs — that didn't actually need to fall, just to get the reorganizing jolt you've learned to associate with growth. Underneath the compulsion is often a fear that nothing changes unless it's forced to, so you keep forcing it. The pattern costs you stability that never needed to be sacrificed for insight you could have reached more gently.`,
      invitation: `Ask yourself honestly whether the thing you're about to blow up actually needs to fall, or whether you're addicted to the jolt of collapse itself. Let one piece of clarity arrive gently today instead of forcing a crisis to reveal it. Sit with an uncomfortable truth quietly rather than detonating something to make it undeniable. You're proving that clarity doesn't require demolition to be real.`,
    },

    // ── 17 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '17_E': {
      title: `17 in Soul Center — The Star`,
      tagline: `A Design of Reciprocal Hope`,
      mastery: `You carry hope that hasn't hardened into naivety, because you've actually looked at the hard parts and kept the hope anyway. You replenish what's been depleted — in yourself, in a project, in someone else — trusting the process before there's proof it's working, and you stay with it patiently through the invisible stretch. You inspire real optimism in other people just by being near them, without needing to perform positivity to do it. And you know how to receive renewal as well as offer it, letting your own reserves actually get refilled instead of just giving from them endlessly.`,
      shadow: `You pour hope outward so consistently that your own reserves run dry, offering renewal to everyone except yourself as though you alone were exempt from needing any back. You start performing hope you don't currently feel, because you've become known as the one who's always fine, and admitting doubt feels like it would let everyone down. Underneath the performance is often a real fear that if your own hope ever failed publicly, you'd have nothing left to offer anyone. The generosity that defines you becomes the exact thing quietly depleting you, and nobody notices because you never let the depletion show.`,
      invitation: `Ask yourself honestly when you last let someone replenish you instead of the other way around. Let your own doubt be visible today, honestly, to someone who cares about you, without rushing to reassure them it'll be fine. Receive one act of care today without deflecting it or immediately returning the favor. You're testing whether the well can be filled from outside, not just drawn from indefinitely.`,
    },

    // ── 18 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '18_E': {
      title: `18 in Soul Center — The Moon`,
      tagline: `A Design of Trusted Feeling`,
      mastery: `You honor what you sense rather than requiring only what you can prove with hard evidence first, and that sense consistently picks up something the visible facts alone don't capture. You navigate uncertainty and ambiguity without needing everything resolved before you'll move, which lets you act while other people are still waiting for clarity that hasn't arrived yet. You're genuinely comfortable in the unconscious, symbolic, or dreamlike register that unsettles most people. And you can hold conflicting feelings — fear and desire, dread and hope — at the same time without needing to resolve the contradiction before you'll trust either one.`,
      shadow: `You get lost in the depths without any clear way back to actual functioning, letting the felt sense override any grounded engagement with what's genuinely in front of you. Free-floating anxiety that doesn't attach to anything specific can take over, and you mistake the intensity of a feeling for its accuracy, when the two aren't the same thing at all. Illusion and self-deception become easy to fall into, because the fog itself starts to feel more truthful than anything solid. Decisions made purely from the depths, with no anchor, cost you in ways the depths themselves never warned you about.`,
      invitation: `Ask yourself honestly whether what you're feeling is signal or simply unmoored anxiety wearing the costume of intuition. Anchor one feeling today to something concrete — a real number, an actual conversation, a decision you can point to. If they align, act with full confidence. If they don't, investigate the gap before you move on the feeling alone.`,
    },

    // ── 19 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '19_E': {
      title: `19 in Soul Center — The Sun`,
      tagline: `A Design of Uncomplicated Radiance`,
      mastery: `You radiate who you already are, simply and unguarded, with nothing extra required to justify it or earn it beforehand. You bring genuine vitality into a room just by being in it, and that energy is contagious rather than performed. You can be fully seen without flinching, comfortable with visibility in a way most people have to work at for years. And you find real, uncomplicated confidence that doesn't depend on constant achievement to feel legitimate — you're enough on an ordinary day, not just a productive one.`,
      shadow: `You believe purpose this genuinely simple can't possibly be enough, so you go searching for something more complicated to prove yourself with instead. Ego and arrogance can creep into the radiance, where being seen turns into needing to be the center of every room rather than simply present in it. The vitality can also tip into a kind of naive overexposure, where you share more than a situation actually calls for and get burned by people who weren't holding it as carefully as you were. Underneath either extreme is often a fear that your unguarded self, offered too plainly, might not actually be wanted.`,
      invitation: `Ask yourself honestly whether you're radiating because it's true or performing brightness because you think it's required. Let one moment of simple joy today count as purpose, with no bigger mission required to justify it. Notice the pull to dress it up or make it bigger, and let it stand exactly as it is instead.`,
    },

    // ── 20 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '20_E': {
      title: `20 in Soul Center — Judgement`,
      tagline: `A Design of the Ongoing Awakening`,
      mastery: `You rise to meet a call you could have easily ignored, one that would have cost you nothing to walk past, and you answer it anyway. You can genuinely evaluate yourself and your own past honestly, without either inflating it or tearing yourself down over it. You know how to release something that's completed its purpose and let it actually go, rather than carrying it forward out of habit. And you hear a real summons and trust it, distinct from noise or wishful thinking, which lets you act while other people are still debating whether the call was real.`,
      shadow: `You hear the call clearly and then endlessly prepare to answer it, using self-improvement as a substitute for the actual leap you're supposed to be taking. Harsh, excessive self-judgment can take over instead of honest evaluation, where every past choice gets re-litigated instead of simply learned from. You can get stuck reliving an old failure or an old identity, unable to release it and move into who you're actually becoming now. The preparation and the self-judgment reinforce each other, and years pass in a state of almost-ready that never converts into answered.`,
      invitation: `Ask yourself honestly whether you're preparing or avoiding. Answer one call today before you feel fully ready to answer it, in whatever imperfect form is available right now. Release one old judgment about your own past instead of re-litigating it again. You're proving the call always mattered more than the readiness you kept substituting for it.`,
    },

    // ── 21 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '21_E': {
      title: `21 in Soul Center — The World`,
      tagline: `A Design of Earned Arrival`,
      mastery: `You feel real, earned arrival and let yourself land in it, however temporary that arrival eventually turns out to be. You integrate everything — the hard parts and the good parts — into one coherent whole instead of only keeping the pieces that flatter you. You can see the wider context of your own journey clearly, understanding how the separate chapters actually connect into a single, meaningful arc. And you find genuine, uncomplicated satisfaction in completion itself, not just in the next milestone that completion opens up.`,
      shadow: `You refuse to ever call anything truly complete, treating wholeness as a permanently receding goal that stays just out of reach no matter how close you actually get to it. Arriving would mean facing whatever comes right after it, so you quietly keep the finish line moving to avoid that confrontation. You can also become complacent once you do arrive somewhere, mistaking one completion for permanent safety and stopping the growth that got you there in the first place. Either way, you lose the actual satisfaction of the arrival — one version by never letting it happen, the other by not noticing it happened at all.`,
      invitation: `Ask yourself honestly whether you're avoiding arrival or have gone numb to it once you got there. Let yourself actually land in one "this is whole" moment today, before the next cycle begins. Name something genuinely complete, out loud, and resist the urge to immediately point toward what's next.`,
    },

    // ── 22 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '22_E': {
      title: `22 in Soul Center — The Fool`,
      tagline: `A Design of Accumulating Trust`,
      mastery: `You step forward into something new without needing a guarantee handed to you first, and that's real, uncommon trust rather than naivety about the risk. You bring genuine spontaneity and a willingness to take real risks that most people have talked themselves out of by adulthood. You carry an innocent, unjaded view of new possibilities without it curdling into ignorance about actual consequences. And you can hold total presence in this exact moment, unburdened by either the last leap or the next one, which lets you meet what's actually in front of you.`,
      shadow: `You treat every fresh start as an escape from whatever the last one asked of you, so nothing ever accumulates into a deeper, more tested version of yourself. Naive risk-taking without any real judgment can lead you straight toward genuine danger, mistaking recklessness for the same trust that once served you well. You can also become genuinely irresponsible, so focused on the next leap that commitments and people who were counting on you get left behind. The pattern repeats identically across years, dressed up each time as a new adventure, while very little cumulative wisdom actually builds underneath it.`,
      invitation: `Ask yourself honestly whether this leap is trust or a way of running from what the last one required of you. Carry one specific lesson from your last beginning into whatever you start today. Name what it actually taught you before you dive into the new thing. You're proving that beginnings can build on each other instead of resetting you back to zero every time.`,
    },

    // ── 5 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '5_LOVE': {
      title: `5 in Ideal Partner — The Hierophant`,
      tagline: `A Design of the Ungraded Bond`,
      mastery: `You fall in love with substance, offering genuine reverence for who a partner actually had to become to arrive where they are. You see the real story underneath the person, not just the surface presentation. That depth of regard is a genuine gift, rare enough that partners feel actually witnessed by it. And you can offer this reverence fully once you stop measuring it against a standard that was never actually about this relationship.`,
      shadow: `You measure a partner against an inherited standard, holding back your full arrival until they pass a test they never agreed to take. Underneath the measuring is often a fear that committing fully without the standard would mean settling for less than you deserve. You withhold complete presence while quietly grading the relationship against a rulebook that predates it. The grading costs you the very depth of connection your reverence is actually capable of producing.`,
      invitation: `Ask yourself honestly what inherited standard you've been measuring this relationship against. Let the relationship itself be the standard today, instead of measuring it against a rulebook you inherited. Show up fully, without the private grading. Notice that the connection doesn't need external validation to be real.`,
    },

    // ── 1 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '1_LOVE': {
      title: `1 in Ideal Partner — The Magician`,
      tagline: `A Design of the Quiet Chapter`,
      mastery: `You make a relationship feel alive, generating real momentum in a connection that might otherwise quietly stall. You initiate, you propose, you keep the energy moving forward rather than letting it drift. That capacity to actually animate a relationship is a genuine gift, not every partner has it. And you can bring that same aliveness to a settled chapter, not just a new one, once you actually try.`,
      shadow: `You chase the electric feeling of a new connection's beginning and lose interest once it actually settles into something steady. Underneath the chasing is often a fear that a quiet, settled chapter means the relationship has stopped being alive at all. You mistake calm for stagnation, pulling away right when a deeper, steadier intimacy is actually available. The pattern costs you relationships that would have deepened, traded for another electric beginning that will settle again too.`,
      invitation: `Ask yourself honestly whether this quiet chapter is actually stalled or just settled. Let one quiet chapter of your relationship today feel as alive as its beginning. Bring the same initiating energy to something ordinary. Notice that aliveness doesn't require novelty to exist.`,
    },

    // ── 2 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '2_LOVE': {
      title: `2 in Ideal Partner — The High Priestess`,
      tagline: `A Design of Mutual Depth`,
      mastery: `You offer patient, perceptive attention that makes a partner feel genuinely and accurately seen, not just noticed. You pick up on what's unspoken and hold it with real care. That perceptiveness is a rare gift, and partners generally recognize how deeply they're being understood. And you can receive the same depth of knowing you offer, once you let yourself actually be known back.`,
      shadow: `You stay so guarded yourself that intimacy becomes one-directional, flowing toward the partner but rarely back toward you. Underneath the guardedness is often a fear that being as known as you know others would leave you without the safety your perceptiveness currently provides. You study your partner closely while remaining genuinely opaque to them. The imbalance costs you a mutual depth your own capacity for intimacy is actually built for.`,
      invitation: `Ask yourself honestly what you've been keeping hidden while seeing your partner so clearly. Let yourself be known today at the same pace you come to know your partner. Share something real and unguarded, not just perceived. Notice that being known doesn't diminish the safety you've built.`,
    },

    // ── 3 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '3_LOVE': {
      title: `3 in Ideal Partner — The Empress`,
      tagline: `A Design of Received Tending`,
      mastery: `You create real warmth and abundance in a relationship, making a partner feel genuinely and consistently tended to. You notice what someone needs before they have to ask and provide it generously. That capacity for nurturing is a real gift, one that makes people feel cared for in a way that's rare and specific. And you can receive the same tending you give, once you actually let your own needs be spoken.`,
      shadow: `You organize the whole relationship around your giving, while your own needs stay unspoken, even to yourself. Underneath the imbalance is often a fear that voicing a need would compete with, or diminish, the tending you're known for providing. You give generously and receive almost nothing in return, not because it isn't offered, but because you never ask. The pattern leaves you quietly depleted in a relationship that otherwise runs on real warmth.`,
      invitation: `Ask yourself honestly what you need from this relationship that you've never actually voiced. Let yourself be tended to today, as openly as you tend to others. Name a specific need out loud, not just hint at it. Notice that asking doesn't make you less generous.`,
    },

    // ── 4 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '4_LOVE': {
      title: `4 in Ideal Partner — The Emperor`,
      tagline: `A Design of the Flexed Container`,
      mastery: `You build relationships with real commitment to the container itself, consistency and follow-through that partners can actually rely on. You show up when you said you would, keeping the structure of the relationship dependable. That reliability is a genuine gift, rare enough that partners often name it directly. And you can hold that same commitment while letting the container flex, once you notice the difference between structure and rigidity.`,
      shadow: `You prioritize the structure of the relationship over its actual aliveness, maintaining the form well after the connection inside it has faded. Underneath the maintenance is often a fear that flexing the structure would mean the whole relationship might unravel entirely. You keep the rituals and routines intact while the felt connection quietly erodes underneath them. The maintained form costs you the chance to notice, and address, what's actually missing.`,
      invitation: `Ask yourself honestly whether this structure is serving the relationship or replacing it. Let the container flex today in one small way, instead of maintaining rigid form. Change one routine deliberately and see what happens. Notice that flexibility doesn't dissolve the commitment underneath it.`,
    },

    // ── 6 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '6_LOVE': {
      title: `6 in Ideal Partner — The Lovers`,
      tagline: `A Design of Lived Alignment`,
      mastery: `Your love is built on genuine, deliberate alignment, shared values that were actually chosen rather than simply assumed. You can name precisely what you and a partner agree matters, and build the relationship on that real foundation. That deliberateness is a genuine strength, producing partnerships with unusual clarity about their own values. And alignment can stay a shared direction you're both moving toward, rather than a fixed bar either of you has to clear.`,
      shadow: `You treat every disagreement as evidence of misalignment, auditing a partner exhaustively for signs the shared values have failed. Underneath the auditing is often a fear that any real difference means the whole foundation was built on an illusion. You scrutinize ordinary disagreements as though they were verdicts on the relationship's viability. The scrutiny exhausts partners and manufactures instability where an ordinary difference of opinion was actually fine.`,
      invitation: `Ask yourself honestly whether this disagreement is actually a misalignment or just a normal difference. Let alignment today be a direction you're both moving in, not a static test to pass. Treat the disagreement as ordinary, not diagnostic. Notice that the relationship can hold real differences without losing its foundation.`,
    },

    // ── 7 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '7_LOVE': {
      title: `7 in Ideal Partner — The Chariot`,
      tagline: `A Design of Two Hands on the Wheel`,
      mastery: `You bring real momentum to a relationship, steering life together with a shared direction that actually moves. You initiate plans and keep the partnership progressing rather than idling. That drive is a genuine strength, and relationships with you rarely stagnate. And the momentum can actually include two sets of hands on the wheel, once you make room for it.`,
      shadow: `You turn the relationship into a solo drive with a passenger, setting the direction alone and expecting agreement rather than input. Underneath the solo driving is often a fear that shared steering would slow the momentum you've worked hard to build. You decide the destination and the pace without genuinely inviting a partner's direction into it. The pattern costs you a partner's real investment in a life that currently only reflects your own choices.`,
      invitation: `Ask yourself honestly what decision you've been making alone that actually belongs to both of you. Let your partner actually hold some of the reins today. Ask for their direction on something concrete, and follow it. Notice that shared steering doesn't cost you the momentum.`,
    },

    // ── 8 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '8_LOVE': {
      title: `8 in Ideal Partner — Justice`,
      tagline: `A Design of the Released Ledger`,
      mastery: `You build trust in love promise by kept promise, through genuine reciprocity that partners come to rely on. You do what you said you'd do, consistently, and that consistency accumulates into real trust over time. That reliability is a genuine strength, rare enough that it becomes the foundation of long-term intimacy. And trust can hold even through an ordinary, human imbalance, once you stop needing every exchange to be exactly even.`,
      shadow: `You keep an internal ledger of who's done more, turning intimacy into an accounting exercise instead of a felt connection. Underneath the ledger is often a fear that any real imbalance would mean you're being quietly taken advantage of. You track contributions with a precision that makes ordinary human unevenness feel like evidence of unfairness. The tracking costs you the ease and generosity that real intimacy actually requires.`,
      invitation: `Ask yourself honestly what imbalance you've been tracking that's actually just ordinary human unevenness. Let one imbalance today be human instead of tracked. Let it go without logging it. Notice that releasing the ledger doesn't put you at risk.`,
    },

    // ── 9 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '9_LOVE': {
      title: `9 in Ideal Partner — The Hermit`,
      tagline: `A Design of Shared Silence`,
      mastery: `Your love is patient and deep, including a real, healthy respect for solitude as part of genuine intimacy. You know how to hold space for yourself without it costing the relationship its closeness. That capacity for depth alongside independence is a real strength, producing a love that doesn't suffocate either person. And solitude can stay a genuine need rather than an escape, once you're honest about which one it actually is in the moment.`,
      shadow: `You use your need for space to avoid real vulnerability, retreating precisely when closeness is actually being asked for. Underneath the retreat is often a fear that staying present through vulnerability would cost you the autonomy solitude currently protects. You reach for the language of "needing space" at the exact moments intimacy requires you to stay. The retreat costs partners a level of trust that consistent presence, even through discomfort, would have built instead.`,
      invitation: `Ask yourself honestly whether this need for space is genuine or an avoidance of something uncomfortable. Tell your partner today whether your solitude is genuine need or avoidance, and stay present. Name it honestly, out loud, rather than just withdrawing. Notice that staying present through discomfort doesn't cost you your autonomy.`,
    },

    // ── 10 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '10_LOVE': {
      title: `10 in Ideal Partner — Wheel of Fortune`,
      tagline: `A Design of the Full Cycle`,
      mastery: `You meet a relationship's current season honestly, without forcing a false, permanent high onto something that naturally cycles. You can name that things are hard right now without needing that to mean something is fundamentally wrong. That honesty about seasons is a real strength, letting you stay grounded through natural ups and downs. And a low season can be met as exactly that, a season, once you resist reading it as a final verdict.`,
      shadow: `You treat a relationship's downswing as proof it's over, bailing at the first natural low rather than riding out the cycle. Underneath the bailing is often a fear that staying through a hard season would trap you in something permanently bad. You exit relationships at their first real dip, mistaking an ordinary low for a fatal sign. The pattern costs you relationships that would have naturally turned, the way seasons do, if you'd stayed through the cycle.`,
      invitation: `Ask yourself honestly whether this low is a season or something that's actually structurally broken. Let today's low season be a season, not a verdict, and stay through the full cycle. Commit to riding it out before deciding anything final. Notice that staying doesn't mean tolerating something genuinely harmful.`,
    },

    // ── 11 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '11_LOVE': {
      title: `11 in Ideal Partner — Strength`,
      tagline: `A Design of the Visible Wobble`,
      mastery: `You hold a hard conversation or a partner's raw emotion without flinching, staying present through what would make others retreat. You provide real steadiness in a relationship's hardest moments. That capacity to hold difficulty is a genuine strength, one partners come to depend on deeply. And your own difficulty can be visible too, without it undermining the steadiness you're known for.`,
      shadow: `You hold all the relationship's difficulty yourself, while your own hard feelings stay entirely invisible to your partner. Underneath the invisibility is often a fear that showing your own struggle would collapse the steadiness the relationship relies on you for. You absorb every hard moment without ever letting your partner see what it costs you. The invisibility leaves you carrying weight alone that could have been genuinely shared.`,
      invitation: `Ask yourself honestly what difficulty you've been carrying invisibly in this relationship. Let your own difficulty be visible today, on purpose. Show the wobble instead of hiding it. Notice that visible difficulty doesn't undo the steadiness your partner relies on.`,
    },

    // ── 12 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '12_LOVE': {
      title: `12 in Ideal Partner — The Hanged Man`,
      tagline: `A Design of the Patient Deadline`,
      mastery: `Real connection shows up for you once you release the grip on how or when exactly it's supposed to happen. You trust timing that isn't forced, and relationships that arrive this way tend to be genuinely right rather than rushed into. That patience is a real strength, distinct from passivity, letting the right thing actually take shape. And the patience can have a deadline attached, once you're willing to act on what it's already shown you.`,
      shadow: `You wait indefinitely for a relationship to clarify itself rather than ever actually engaging directly to move it forward. Underneath the waiting is often a fear that acting decisively and being wrong would be worse than staying in comfortable ambiguity. You let a relationship's status stay permanently unresolved, mistaking the waiting itself for patience. The indefinite wait costs you both the clarity and the relationship the waiting was meant to protect.`,
      invitation: `Ask yourself honestly what the waiting has already revealed that you haven't acted on. Give your patience a deadline today, and commit to what the waiting has already revealed. Set an actual date and act when it arrives. Notice that a deadline doesn't undo the patience, it just gives it a shape.`,
    },

    // ── 13 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '13_LOVE': {
      title: `13 in Ideal Partner — Transformation`,
      tagline: `A Design of Quiet Growth`,
      mastery: `Your love is genuinely metamorphic, bringing real intensity and a willingness to actually grow because of a connection. You let a relationship change you, in real, lasting ways, rather than staying the same person you were before it. That capacity for transformation through love is a genuine gift, not everyone lets themselves be changed this deeply. And the growth can happen quietly, without drama, and still be exactly as real.`,
      shadow: `You need every relationship to be transformative to feel real, manufacturing intensity where ease would actually serve you better. Underneath the manufacturing is often a fear that a calm, undramatic relationship wouldn't be deep enough to matter. You escalate ordinary moments into significant ones, needing the intensity to confirm the connection is genuine. The manufactured intensity costs you relationships that would have grown you just as much, quietly.`,
      invitation: `Ask yourself honestly whether this relationship needs the intensity or if you're supplying it. Let one piece of relationship growth today happen quietly, without drama. Let the change be undramatic and still count. Notice that quiet growth is no less real than the dramatic kind.`,
    },

    // ── 14 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '14_LOVE': {
      title: `14 in Ideal Partner — Temperance`,
      tagline: `A Design of Worked-Through Friction`,
      mastery: `You're genuinely skilled at blending two lives into something that actually works for both people, not just one. You find the workable middle between two different needs or habits without either person losing themselves. That blending skill is a real strength, and relationships with you tend to feel genuinely collaborative. And real differences can surface and get worked through, once you let friction do its actual job instead of smoothing past it.`,
      shadow: `You over-moderate the relationship to avoid real friction, smoothing over genuine differences before they've actually been addressed. Underneath the smoothing is often a fear that real friction, allowed to surface, would threaten the harmony you've worked hard to maintain. You default to compromise before the actual disagreement has even been named. The premature smoothing costs you resolutions that would have held, instead of differences that just get buried again.`,
      invitation: `Ask yourself honestly what real difference you've been smoothing over instead of addressing. Let one real difference surface today and stay long enough to be worked through. Don't rush to compromise before the disagreement is actually named. Notice that the friction doesn't have to threaten the relationship to be worth having.`,
    },

    // ── 15 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '15_LOVE': {
      title: `15 in Ideal Partner — The Devil`,
      tagline: `A Design of Chemistry Plus Tenderness`,
      mastery: `Your romantic connections run on real, undeniable magnetism and honest desire, not a diluted or apologetic version of wanting. You can hold real chemistry and real tenderness at once, without needing to choose between them. That capacity for full, honest desire is a genuine strength, rare enough that most people settle for one or the other. And the chemistry can be evaluated honestly for what else it offers, once you're willing to actually look.`,
      shadow: `You mistake intensity for genuine compatibility, staying bound to chemistry that doesn't actually serve you outside the physical pull. Underneath the mistake is often a fear that questioning the chemistry would mean losing the one thing about the connection that feels undeniably real. You stay in a relationship because the pull is strong, without examining whether anything else is actually working. The intensity costs you relationships that would have served you better, evaluated honestly.`,
      invitation: `Ask yourself honestly what this relationship offers you outside its intensity. Ask today what your relationship offers outside its intensity. Look at it clearly, without the chemistry doing the talking. Notice that the answer doesn't have to end the relationship, just inform it honestly.`,
    },

    // ── 16 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '16_LOVE': {
      title: `16 in Ideal Partner — The Tower`,
      tagline: `A Design of the Deliberate Conversation`,
      mastery: `You sense when something's fundamentally not working before it's convenient or comfortable to admit it out loud. You catch the real signal early, rather than needing an obvious crisis to notice something is wrong. That early perception is a genuine strength, letting you address a problem before it fully compounds. And the clarity you sense can go into a real conversation, rather than a decision made unilaterally in your own head.`,
      shadow: `You provoke a relationship's collapse prematurely, out of impatience with the uncertainty of letting things clarify naturally. Underneath the impatience is often a fear that sitting with ambiguity would be worse than forcing a resolution, even a destructive one. You act alone on a private read of the situation, ending or disrupting something before your partner even knows there's a problem. The premature action costs you a resolution that a real conversation might have actually produced.`,
      invitation: `Ask yourself honestly whether you're clarifying this or just ending the uncertainty by force. Bring one piece of relational clarity today to an actual conversation, before acting alone on it. Say what you've noticed and let your partner respond. Notice that a real conversation doesn't require you to already know the outcome.`,
    },

    // ── 17 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '17_LOVE': {
      title: `17 in Ideal Partner — The Star`,
      tagline: `A Design of Present-Tense Hope`,
      mastery: `You offer unwavering faith in who a partner is genuinely capable of becoming, seeing possibility others miss. You hold a real, sustaining hope for someone's growth, and that hope tends to actually help them get there. That capacity for faith in another person is a genuine gift, one that partners often credit for real change. And the hope can meet a partner exactly as they currently are, not only as who they might become.`,
      shadow: `You love someone's potential more than who they actually, currently are, right now, unfinished and imperfect. Underneath the preference is often a fear that loving the present-tense version would mean settling for less than what's possible. You stay attached to a future version of your partner while the actual person in front of you goes quietly under-appreciated. The preference costs a partner the felt experience of being loved as they already are, not just as a work in progress.`,
      invitation: `Ask yourself honestly whether you're loving who your partner is or who they might become. Let your hope today meet your partner exactly where they currently are. Appreciate the present version out loud, not just the potential one. Notice that meeting them where they are doesn't require giving up the hope.`,
    },

    // ── 18 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '18_LOVE': {
      title: `18 in Ideal Partner — The Moon`,
      tagline: `A Design of the Tested Feeling`,
      mastery: `You sense a connection's truth before you can fully articulate it, a felt, wordless understanding that usually turns out accurate. You pick up on the emotional undercurrent of a relationship before it's spoken out loud. That intuitive read is a genuine gift, and when tested it tends to hold up. And the read can be checked against an actual conversation, which sharpens the accuracy rather than undermining it.`,
      shadow: `You let unprocessed fear color how you read a partner, projecting an old wound onto present, unrelated behavior. Underneath the projection is often a fear that questioning the read would mean losing the protective vigilance the fear currently provides. You interpret a partner's ordinary behavior through the lens of a past hurt that has nothing to do with them. The projection costs you accurate perception of the actual person in front of you, replaced by an old story.`,
      invitation: `Ask yourself honestly whether this emotional read is about the present relationship or an old wound. Check one emotional read today against an actual conversation. Ask your partner directly rather than assuming your read is complete. Notice whether the read holds up once it's actually tested.`,
    },

    // ── 19 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '19_LOVE': {
      title: `19 in Ideal Partner — The Sun`,
      tagline: `A Design of Included Difficulty`,
      mastery: `Your love runs on authentic joy and ease rather than struggle or the need to constantly prove yourself worthy of it. You bring real warmth and lightness into a relationship, and that ease is genuine, not performed. That capacity for joyful love is a real strength, and partners generally feel it as relief rather than superficiality. And the ease can hold through a hard, unglamorous moment too, once you stop reading difficulty as a sign something's wrong.`,
      shadow: `You avoid a relationship, or hard conversations within it, the moment things stop feeling easy or light. Underneath the avoidance is often a fear that a hard moment means the joy was never real to begin with. You exit or deflect from difficulty, treating any friction as proof the relationship has gone wrong. The avoidance costs you relationships that would have deepened through the exact difficulty you were avoiding.`,
      invitation: `Ask yourself honestly whether this hard moment actually threatens the relationship or is just ordinary difficulty. Let one hard, unglamorous moment today stay in the relationship without deciding it's wrong. Stay through it instead of exiting or deflecting. Notice that difficulty doesn't erase the ease that's actually there.`,
    },

    // ── 20 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '20_LOVE': {
      title: `20 in Ideal Partner — Judgement`,
      tagline: `A Design of the Honored Growth`,
      mastery: `Your romantic connections function as genuine catalysts, calling something larger and truer out of you than you'd have found alone. You grow in real, lasting ways because of who you've loved, not just alongside them. That catalytic quality is a genuine gift, one that makes your relationships meaningful even beyond their duration. And a relationship can be honored for the growth it gave you while still being released if it's actually over.`,
      shadow: `You stay in a relationship past its natural end because it once served as a catalyst, and ending it feels like undoing the growth. Underneath the staying is often a fear that leaving would erase or invalidate everything the relationship already gave you. You hold on to a finished relationship, using its past catalytic value to justify a present that no longer serves you. The holding costs you the chance to actually carry the growth forward into something new.`,
      invitation: `Ask yourself honestly whether this relationship is still catalyzing growth or just holding you in place. Honor one relationship today for the growth it already gave you, even while letting it go if it's time. Separate gratitude for the past from obligation to the present. Notice that releasing it doesn't undo what it already gave you.`,
    },

    // ── 21 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '21_LOVE': {
      title: `21 in Ideal Partner — The World`,
      tagline: `A Design of the Open Life`,
      mastery: `Your love thrives when it isn't asked to stay small, a shared life that can genuinely expand rather than settle into a fixed routine. You want a relationship that grows in scope, not just in years. That desire for genuine expansion is a real strength, keeping love from calcifying into mere comfort. And the relationship can actually expand, one new place or shared vision at a time, once you stop trading it for routine by default.`,
      shadow: `You let the relationship quietly close the world down, real freedom traded for a comfortable, predictable routine. Underneath the trade is often a fear that keeping the world open would threaten the stability the routine currently provides. You settle into smaller and smaller shared horizons without ever deciding to. The narrowing costs you the expansive love your heart is actually built for.`,
      invitation: `Ask yourself honestly what the relationship's world has quietly shrunk down to. Let the relationship actually expand today, one new place or shared vision at a time. Propose something genuinely new, not just a variation on routine. Notice that expansion doesn't threaten the stability you've built.`,
    },

    // ── 22 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '22_LOVE': {
      title: `22 in Ideal Partner — The Fool`,
      tagline: `A Design of the Carried Lesson`,
      mastery: `You carry a genuine, uncommon openness to love, presence without an agenda or a script for how it should go. You meet someone new without the weight of expectations dictating the connection in advance. That openness is a real gift, letting relationships form freely rather than under pressure. And that same openness can carry real, accumulated wisdom forward, once you actually let a past lesson inform it.`,
      shadow: `You repeat the same relational pattern with new people, with no accumulated wisdom actually carried forward from what came before. Underneath the repetition is often a fear that carrying a lesson forward would taint the fresh openness each new connection deserves. You meet someone new with genuine presence, and then unknowingly repeat the same dynamic that didn't work last time. The repetition costs you the growth your openness should be compounding into.`,
      invitation: `Ask yourself honestly what pattern keeps recurring across your relationships, unexamined. Carry one concrete lesson today from your last relationship into how you love now. Name it specifically, not just as a vague sense of caution. Notice that carrying the lesson forward doesn't compromise your openness.`,
    },

    // ── 17 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '17_MON': {
      title: `17 in Wealth Potential — The Star`,
      tagline: `A Design of Paid Visibility`,
      mastery: `Your income arrives in rhythm with genuine visibility, sharing your real gift where it can actually be seen and paid for. You're capable of putting real work in front of people at the stage it's actually in, not waiting for a polished ideal. That rhythm between visibility and income is a genuine strength, and it compounds the more consistently you use it. And pricing the work at its real value, not a discounted one, is well within your capacity once you actually try it.`,
      shadow: `You keep income conditional on approval before it's allowed to flow, delaying a launch or undercutting a rate until conditions feel perfect. Underneath the delay is often a fear that visible, priced work would be judged and found wanting in public. You wait for a certainty that never fully arrives, and the income that depends on visibility stays stalled with it. The waiting costs you real revenue that a less-than-perfect, actually-shown version of the work would have already earned.`,
      invitation: `Ask yourself honestly what condition you're waiting to meet before you'll let this be seen. Show one piece of work publicly today at the stage it's actually in, priced at its real value. Post it, pitch it, or offer it now, not once it's flawless. Notice that visibility at this stage doesn't diminish the work's actual worth.`,
    },

    // ── 1 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '1_MON': {
      title: `1 in Wealth Potential — The Magician`,
      tagline: `A Design of the Sustained Launch`,
      mastery: `Your income flows most freely through work that lets you originate, building something real from nothing rather than maintaining what already exists. You generate ventures at a rate most people can't match, and each one carries genuine potential. That originating capacity is a real financial asset, distinct from mere idea generation. And you're capable of letting one venture mature into steady income once you actually commit past its exciting beginning.`,
      shadow: `You chase the excitement of a new venture at the expense of ever letting one mature into steady, compounding income. Underneath the chase is often a fear that staying with one thing past its novelty would mean facing the harder, less thrilling work of actually building it out. You start ventures at a rate that outpaces your capacity to finish any of them. The pattern costs you the steady income a matured venture would have eventually produced.`,
      invitation: `Ask yourself honestly which current venture you're already tempted to abandon for something newer. Commit today to one long-running thread you won't abandon for the next new idea. Choose it deliberately and give it real, sustained time. Notice that staying doesn't mean giving up your capacity to originate elsewhere later.`,
    },

    // ── 2 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '2_MON': {
      title: `2 in Wealth Potential — The High Priestess`,
      tagline: `A Design of the Priced Insight`,
      mastery: `Your income draws on intuitive, often behind-the-scenes insight, trusting a read before it's fully explainable in conventional terms. You catch what others miss, and that perception genuinely shapes outcomes even when it stays uncredited. That intuitive skill is a real financial asset, not a soft add-on to more "legitimate" expertise. And it can be named and priced explicitly, even without a full rational explanation, once you're willing to claim it.`,
      shadow: `You undervalue that intuitive skill precisely because it's hard to quantify, staying background and consistently underpaid for real contribution. Underneath the undervaluing is often a fear that pricing something you can't fully explain would expose it as illegitimate. You let the insight shape outcomes invisibly, while the credit and compensation go to more explainable work. The invisibility costs you income for a skill that's genuinely valuable, just harder to name.`,
      invitation: `Ask yourself honestly what intuitive contribution you've been making without ever pricing it. Name and price one intuitive contribution today, even if you can't fully explain it. State its value plainly, without over-justifying it. Notice that pricing it doesn't require making it fully rational first.`,
    },

    // ── 3 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '3_MON': {
      title: `3 in Wealth Potential — The Empress`,
      tagline: `A Design of the Priced Gift`,
      mastery: `Your income thrives when your profession lets you actually create and grow something real, not just maintain what already exists. You generate genuine output, whether creative or nurturing, that has real market value on its own terms. That generative capacity is a real financial asset, distinct from conventional productivity. And it can be priced at its actual worth once you stop treating it as something softer or less legitimate than other labor.`,
      shadow: `You undercharge for generative work because it doesn't feel like conventional labor, even though it produces real, valuable results. Underneath the undercharging is often a fear that pricing creative or nurturing work fairly would mark it as less genuine than harder, more visibly effortful work. You discount output that took real skill and energy to produce, treating it as though it should come cheap because it came naturally. The discounting costs you income for work that's genuinely worth its full price.`,
      invitation: `Ask yourself honestly what generative work you've been pricing below its actual value. Price one piece of your creative or nurturing output today at its real value, not discounted. Charge the full rate, without apologizing for it. Notice that the full price doesn't make the work less natural to produce.`,
    },

    // ── 4 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '4_MON': {
      title: `4 in Wealth Potential — The Emperor`,
      tagline: `A Design of the Built System`,
      mastery: `You thrive financially when given real authority to organize, lead, and actually build the structure others operate inside. You have a genuine capacity for architecting systems, not just executing within them. That structural authority is a real financial asset, and roles that grant it tend to compensate you accordingly. And you can actively seek or create that kind of role rather than waiting to be offered it.`,
      shadow: `You stay in a role that under-uses your capacity for structure, following someone else's system completely without ever building your own. Underneath the staying is often a fear that seeking real authority would expose you to a failure more visible than staying in an executing role. You operate inside systems you could design better, without ever proposing the better version. The under-use costs you both income and the sense of authority your actual capacity supports.`,
      invitation: `Ask yourself honestly what system you're currently just staffing that you could actually be building. Seek or create one role today where you actually get to build the system, not just staff it. Propose the structural change or the new role directly. Notice that claiming this authority doesn't require external permission to begin.`,
    },

    // ── 5 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '5_MON': {
      title: `5 in Wealth Potential — The Hierophant`,
      tagline: `A Design of the Taught Knowledge`,
      mastery: `Your income thrives when your profession includes passing on real, earned knowledge to someone else who needs it. You have genuine expertise worth transmitting, not just accumulating for its own sake. That teaching capacity is a real financial asset, and roles that let you use it tend to pay accordingly. And you're capable of stepping into the teaching role now, with what you already know, rather than waiting for more credentials first.`,
      shadow: `You stay a perpetual student, accumulating credentials without ever actually stepping into the teaching role they were meant to support. Underneath the accumulating is often a fear that teaching now would expose gaps a few more credentials might have covered. You keep learning instead of transmitting, deferring the income that teaching would actually generate. The deferral costs you both income and the actual impact your existing knowledge could already be having.`,
      invitation: `Ask yourself honestly what you already know well enough to teach right now. Teach one piece of knowledge today, exactly as it is, before you feel fully ready. Share it in its current, imperfect form. Notice that teaching it doesn't require having mastered everything first.`,
    },

    // ── 6 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '6_MON': {
      title: `6 in Wealth Potential — The Lovers`,
      tagline: `A Design of the Committed Direction`,
      mastery: `Your income thrives specifically through people, connecting them well and choosing your own professional alignments wisely. You have a genuine gift for matching the right people to the right opportunity. That relational skill is a real financial asset, and it compounds when you commit to a direction rather than staying uncommitted. And full commitment to one connection-based direction is well within your actual capacity, once you stop weighing every option indefinitely.`,
      shadow: `You weigh every professional option so exhaustively that you never actually commit long enough to build income in one direction. Underneath the exhaustive weighing is often a fear that choosing one path would mean missing a better connection somewhere else. You keep every option open indefinitely, and the relational income your gift is built for never gets the chance to compound. The indecision costs you the depth of connection that real commitment would have produced.`,
      invitation: `Ask yourself honestly what direction you've been weighing without ever actually choosing. Choose one direction built around genuine connection today, and commit to it fully. Close the other options deliberately, not by default. Notice that commitment doesn't require certainty, just a decision.`,
    },

    // ── 7 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '7_MON': {
      title: `7 in Wealth Potential — The Chariot`,
      tagline: `A Design of the Visible Trajectory`,
      mastery: `Your income thrives when your career has genuine forward motion that you're actually steering, not just riding. You need direction and progress to stay energized, and when you have it, your output reflects that drive. That need for visible trajectory is a real asset, not restlessness, because you actually deliver when moving toward something. And you're capable of building that trajectory deliberately, rather than waiting for it to appear.`,
      shadow: `You stay in a role with no real trajectory, generating burnout even when the actual workload itself is manageable. Underneath the burnout is often a fear that seeking a new trajectory would mean risking the stability of the role you already have. You stay static in a position that isn't going anywhere, and the lack of motion itself becomes exhausting. The staticness costs you the energy and output your career actually produces when it's moving.`,
      invitation: `Ask yourself honestly whether this role has real forward motion or just steady output. Seek or build one visible professional trajectory today that you're actually steering. Take one concrete step that moves you toward it. Notice that building the trajectory yourself doesn't require permission from the current role.`,
    },

    // ── 8 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '8_MON': {
      title: `8 in Wealth Potential — Justice`,
      tagline: `A Design of the Rewarded Honesty`,
      mastery: `Your income thrives in roles where integrity is actually rewarded financially, not just quietly expected of you for free. You bring genuine honesty into professional dealings, and that reliability is worth real money to the right employer or client. That integrity is a real asset, not a cost, when it's placed in an environment that actually values it. And you can actively seek or build that environment rather than settling for one that doesn't.`,
      shadow: `You stay in environments where your honesty goes financially unrewarded, sometimes even actively punished by comparison to less scrupulous colleagues. Underneath the staying is often a fear that seeking a better-aligned environment would mean an unstable transition you're not ready to risk. You keep providing the same integrity in a setting that doesn't compensate it, and the mismatch quietly costs you both income and morale. The staying costs you an income level your actual integrity, properly placed, would command.`,
      invitation: `Ask yourself honestly whether your current environment actually rewards the integrity you bring to it. Seek out or build one environment today that actually rewards fairness. Take one concrete step toward it, even a small one. Notice that your integrity doesn't need to shrink to fit an environment that undervalues it.`,
    },

    // ── 9 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '9_MON': {
      title: `9 in Wealth Potential — The Hermit`,
      tagline: `A Design of the Offered Mastery`,
      mastery: `Your income thrives in roles that convert solitary mastery into a valuable, genuinely sought-after skill others will pay for. You develop real depth, working alone, that ends up worth more than most collaborative expertise. That mastery is a real financial asset, but only once it's actually visible to the people who'd pay for it. And you're capable of putting it forward publicly, without needing to abandon the independence that produced it.`,
      shadow: `You stay so independent that your expertise never gets marketed or made visible enough for anyone to actually pay for it. Underneath the independence is often a fear that marketing the mastery would expose it to judgment the private version never had to face. You keep developing real depth in isolation while the income that depth could produce goes uncollected. The isolation costs you the value your actual expertise has already earned.`,
      invitation: `Ask yourself honestly what expertise you have that no one outside your own head actually knows about. Publish, price, or put forward one piece of your specialized expertise today. Make it visible in a concrete, sellable form. Notice that visibility doesn't require abandoning the solitary work that built the mastery.`,
    },

    // ── 10 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '10_MON': {
      title: `10 in Wealth Potential — Wheel of Fortune`,
      tagline: `A Design of the Built Flexibility`,
      mastery: `You thrive financially when your career has room to change shape as circumstances shift, rather than staying locked into one path. You adapt readily, and your income holds up through change because you built room for it in advance. That flexibility is a real financial asset, distinct from instability. And you can build that flexibility deliberately into your career or income streams, rather than only discovering it's missing under pressure.`,
      shadow: `You stay locked into a rigid career path out of fear of the instability that real change might actually bring. Underneath the rigidity is often a fear that flexibility itself would be the very instability you're trying to avoid. You commit fully to one narrow path, leaving no room to adapt when circumstances inevitably shift. The rigidity costs you resilience precisely when a flexible income structure would have protected you.`,
      invitation: `Ask yourself honestly what part of your income has zero built-in flexibility right now. Build one piece of real flexibility today into your career or income streams. Add a second thread or a genuine option, deliberately. Notice that flexibility built in advance isn't the same as instability.`,
    },

    // ── 11 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '11_MON': {
      title: `11 in Wealth Potential — Strength`,
      tagline: `A Design of Counted Presence`,
      mastery: `Your income thrives where your charisma and presence are the actual asset being paid for, not a byproduct of the work. You bring a magnetic quality that genuinely draws people, attention, and opportunity. That charisma is a real financial asset, worth naming explicitly rather than treating as incidental. And you can build an offer where that presence is the center of the value, once you claim it plainly.`,
      shadow: `You burn that same magnetic energy in rooms and roles that don't actually pay for it, performing generously for free. Underneath the free performance is often a fear that naming your charisma as a paid asset would come across as vain or self-important. You give the same compelling presence away in unpaid settings that would gladly compensate it elsewhere. The giving away costs you income for a genuine asset you're already using constantly.`,
      invitation: `Ask yourself honestly where you're currently performing this charisma for free. Name your charisma today as the explicit center of one professional offer. State plainly what your presence is worth. Notice that claiming it doesn't make the charisma itself feel less genuine.`,
    },

    // ── 12 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '12_MON': {
      title: `12 in Wealth Potential — The Hanged Man`,
      tagline: `A Design of the Committed Practice`,
      mastery: `Your income thrives in roles built around patient, sustained service to people navigating genuine difficulty. You have a real capacity for the kind of committed, unglamorous care this work requires. That patience is a real financial asset once it's actually converted into trained, practiced skill. And you're capable of committing to the training itself, not just holding the idea of the service as an aspiration.`,
      shadow: `You stay suspended in the idea of that service without ever actually committing to the training it genuinely demands. Underneath the suspension is often a fear that starting the training would confront you with how much work actually stands between the idea and the practice. You hold the calling as an identity while the concrete steps toward it stay indefinitely pending. The suspension costs you the income and impact the completed training would have already produced.`,
      invitation: `Ask yourself honestly what training you've been meaning to start but haven't. Take one modest, real step today into actual professional training or practice. Enroll, apply, or begin the smallest concrete piece. Notice that starting modestly doesn't require the full commitment to be settled first.`,
    },

    // ── 13 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '13_MON': {
      title: `13 in Wealth Potential — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You thrive financially in fields that reward genuine professional reinvention, releasing an outdated identity for one that actually fits. You can end a professional chapter deliberately, on your own terms, rather than waiting to be pushed out of it. That capacity for chosen reinvention is a real financial asset, letting you move toward roles that pay better before you're forced to. And you're capable of releasing what's finished now, rather than clinging past its natural end.`,
      shadow: `You cling to a professional identity that's already run its course, out of fear of the gap between who you were and who's next. Underneath the clinging is often a fear that the transition period would cost more than staying in a role that no longer fits. You maintain a title or specialty well past the point it was actually serving your income or your interest. The clinging costs you the reinvention your career actually rewards, replaced by a slow decline in relevance.`,
      invitation: `Ask yourself honestly what professional identity you're maintaining past its natural end. Release one completed professional identity today, deliberately, on your own terms. Name it as finished, out loud, before circumstances force the point. Notice that releasing it opens room for the reinvention your field actually rewards.`,
    },

    // ── 14 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '14_MON': {
      title: `14 in Wealth Potential — Temperance`,
      tagline: `A Design of the Marketable Blend`,
      mastery: `Your income thrives when allowed to synthesize skills or fields other people keep entirely separate. You see and build the connective tissue between disciplines that most specialists never combine. That synthesizing capacity is a real, rare financial asset, once it's actually developed to real depth rather than left broad. And you're capable of focusing that blend deliberately on one or two combinations, rather than spreading it thin across everything.`,
      shadow: `You spread across so many skills that none develops enough depth to actually be paid for at a professional rate. Underneath the spreading is often a fear that narrowing the blend would mean losing the very versatility that makes you distinctive. You stay broadly competent everywhere instead of developing genuine expertise anywhere. The spreading costs you the income depth in even one or two combined skills would actually produce.`,
      invitation: `Ask yourself honestly which one or two combined skills would actually be worth developing to real depth. Go deep today on one or two of your combined skills instead of staying broadly competent at everything. Choose the specific combination and invest there. Notice that narrowing the focus doesn't erase your broader versatility.`,
    },

    // ── 15 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '15_MON': {
      title: `15 in Wealth Potential — The Devil`,
      tagline: `A Design of Clean Leverage`,
      mastery: `You thrive financially in roles that engage directly and honestly with material power and leverage, not around it. You read a negotiation or a power dynamic accurately, and that clarity is worth real money in the right context. That honest engagement with power is a real financial asset, distinct from manipulation. And you're capable of directing that clarity toward genuinely good deals, deals that serve both sides.`,
      shadow: `You use that understanding to grip control over colleagues or resources rather than serve an actual mutually beneficial transaction. Underneath the gripping is often a fear that a fair deal would leave you with less leverage than you're used to holding. You wield your read on power to dominate a dynamic instead of navigating it honestly. The gripping costs you long-term trust and repeat business that fairer dealing would have earned instead.`,
      invitation: `Ask yourself honestly whether you're currently serving a deal or just gripping leverage in it. Use your honest read on material power today in service of one genuinely good deal. Structure it so both sides actually benefit. Notice that a fair deal doesn't require surrendering your read on the leverage.`,
    },

    // ── 16 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '16_MON': {
      title: `16 in Wealth Potential — The Tower`,
      tagline: `A Design of Precise Disruption`,
      mastery: `You thrive financially in roles that value the ability to see a failing structure clearly and reorganize it fast, before it fully collapses. You spot the actual weak point in a system others are still defending. That clarity about what's genuinely failing is a real financial asset, especially in crisis or turnaround work. And you're capable of aiming that clarity precisely at structures that actually need it, rather than everywhere at once.`,
      shadow: `You generate unnecessary disruption to feel financially useful, provoking crises in systems that were actually stable. Underneath the provoking is often a fear that without a visible crisis to solve, your particular skill has nothing to offer. You find or manufacture failure in structures that didn't need reorganizing, just to have something to fix. The manufactured disruption costs you credibility and trust that precise, well-aimed clarity would have built instead.`,
      invitation: `Ask yourself honestly whether this structure genuinely needs reorganizing or whether you're manufacturing the need. Save your clarity today for one structure that genuinely needs reorganizing. Leave stable systems alone, deliberately. Notice that restraint here doesn't diminish your value, it sharpens it.`,
    },

    // ── 18 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '18_MON': {
      title: `18 in Wealth Potential — The Moon`,
      tagline: `A Design of the Grounded Hunch`,
      mastery: `Your income thrives in roles that draw on intuitive, emotionally attuned insight, reading what's beneath the surface of a situation or a client. You sense what's actually going on before it's stated outright. That intuitive gift is a real financial asset, especially once paired with a concrete structure that makes it deliverable. And you're capable of building that structure around the gift, rather than leaving it as an unstructured hunch.`,
      shadow: `You stay in unstable, ungrounded professional territory because the gift never gets paired with a concrete offering or defined process. Underneath the ungrounded state is often a fear that structuring the intuitive gift would flatten or cheapen it. You let the insight stay fluid and undefined, which makes it hard for anyone to actually pay for consistently. The lack of structure costs you the stable income a well-packaged version of the same gift would produce.`,
      invitation: `Ask yourself honestly what structure could actually make this gift deliverable and payable. Pair your intuitive gift today with one concrete offering or defined process. Give it a name, a format, a price. Notice that structuring it doesn't diminish the intuitive quality underneath.`,
    },

    // ── 19 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '19_MON': {
      title: `19 in Wealth Potential — The Sun`,
      tagline: `A Design of Priced Joy`,
      mastery: `Your income thrives in work where your natural personality and warmth are actually the asset being paid for. You bring an ease and radiance to certain work that genuinely draws people and results. That natural quality is a real financial asset, not a lesser one just because it comes easily to you. And it can be priced at its full, honest value once you stop equating effort with worth.`,
      shadow: `You undervalue work that comes easily and joyfully, quietly assuming real value has to require more visible struggle. Underneath the undervaluing is often a fear that charging full price for effortless work would expose you as not really working hard enough to deserve it. You discount the exact work you're naturally best at, while charging full rate for harder, less joyful tasks. The discounting costs you income for the work that's actually your strongest asset.`,
      invitation: `Ask yourself honestly what easy, joyful work you've been pricing as though it were less legitimate. Price one piece of easy, joyful work today honestly, without discounting it. Charge the full rate specifically because it's your strength, not despite it. Notice that ease doesn't make the value any less real.`,
    },

    // ── 20 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '20_MON': {
      title: `20 in Wealth Potential — Judgement`,
      tagline: `A Design of the Answered Call`,
      mastery: `You thrive financially once you actually answer a genuine vocational calling, one that arrives with unusual clarity about what it's asking of you. You recognize the calling precisely, without needing to invent its shape. That clarity is a real financial asset once it's actually acted on, not just privately acknowledged. And you're capable of taking real steps toward it now, before every condition feels perfectly ready.`,
      shadow: `You spend years preparing to answer it, staying in the adequate-but-outgrown role that no longer actually fits your capacity. Underneath the prolonged preparation is often a fear that answering the calling and having it not work out would cost more than staying safely underused. You describe the calling accurately to anyone who asks, and keep collecting more preparation instead of stepping toward it. The prolonged preparation costs you years of income the calling, actually answered, would have already produced.`,
      invitation: `Ask yourself honestly what you're actually still preparing for that you're already capable of. Take one real step today toward the calling, before you feel fully ready. Do the concrete action, not another round of preparation. Notice that the step doesn't require full readiness to be worth taking.`,
    },

    // ── 21 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '21_MON': {
      title: `21 in Wealth Potential — The World`,
      tagline: `A Design of the Crossed Border`,
      mastery: `Your wealth potential opens up specifically through global reach, work or clients that cross a border rather than staying local. You have a genuine capacity to operate at a broader scope than most people attempt. That reach is a real financial asset once you actually build toward it. And you're capable of deliberately crossing one border in your work now, rather than waiting for the reach to arrive on its own.`,
      shadow: `You stay confined to a local or narrowly-scoped version of your field long after your actual capacity has outgrown it. Underneath the confinement is often a fear that expanding the scope would expose you to a competition or complexity the local version protects you from. You operate at a scale that no longer matches what you're actually capable of. The confinement costs you the wealth your broader capacity is already built to earn.`,
      invitation: `Ask yourself honestly what scope you've stayed within that your actual capacity has already outgrown. Let one part of your work today deliberately cross a border, a client, a platform, a market. Take the concrete step toward the wider scope. Notice that crossing it doesn't require abandoning the local foundation you've built.`,
    },

    // ── 22 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '22_MON': {
      title: `22 in Wealth Potential — The Fool`,
      tagline: `A Design of the Reflected Leap`,
      mastery: `You thrive financially in careers that reward genuine courage, starting a new venture without needing certainty first. You leap into professional risk that most people talk themselves out of, and that willingness genuinely pays off over time. That courage is a real financial asset, distinct from recklessness. And you're capable of carrying real, accumulated lessons into the next leap, rather than starting each one from zero.`,
      shadow: `You repeat the same fresh professional start without absorbing what the last one actually taught you about what works. Underneath the repetition is often a fear that carrying a lesson forward would slow down the exciting momentum of starting something new. You leap again and again with genuine courage, but very little cumulative wisdom compounds underneath the leaps. The repetition costs you income that a lesson-informed version of the same courage would have already earned.`,
      invitation: `Ask yourself honestly what your last professional leap actually taught you that you haven't applied yet. Carry one concrete lesson today from your last leap into whatever comes next. Name it specifically before you start the next venture. Notice that carrying the lesson forward doesn't slow down the courage, it sharpens it.`,
    },

    // ── 13 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '13_F': {
      title: `13 in Paternal Spiritual — Transformation`,
      tagline: `A Design of Reworked Inheritance`,
      mastery: `You take the belief system inherited from your father's line and actually transform it into something that fits who you became, instead of receiving it intact. You can let an inherited framework die so a truer, tested version can take its place. And what you eventually hold has been through your own reckoning, not simply handed down. That patience with paradox is a rare and genuinely inherited gift.`,
      shadow: `You either swallow the inheritance whole or reject it entirely, both ways of avoiding the actual work of sorting what's genuinely yours. Underneath the extreme is often a fear that questioning any part of it means betraying the whole line. Your belief system reflects your father's line intact, unexamined, or reflects a total rejection that's really just the inheritance in reverse. Real intensity waits at the door and rarely gets let all the way in.`,
      invitation: `Ask yourself honestly which piece of this inheritance you've never actually tested yourself. Name one specific belief from your father's line today, and decide honestly whether it's actually yours. Test it against your own real experience rather than the assumption behind it. Notice what holds up and what was only ever received.`,
    },

    // ── 1 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '1_F': {
      title: `1 in Paternal Spiritual — The Magician`,
      tagline: `A Design of Active Faith`,
      mastery: `You treat faith as active — proven through initiative and real spiritual agency, not passive acceptance. You act on a spiritual instinct the moment it arrives, translating it into something real rather than sitting on it. And that capacity for spiritual initiative was handed to you already-formed, a real inheritance you didn't have to earn from scratch. You don't have to prove your faith moving to know it's real.`,
      shadow: `You inherit the compulsion without the discernment, believing spiritual worth must be constantly proven through visible effort. Underneath the compulsion is often a fear that stillness would mean the faith itself wasn't real. You keep initiating spiritual practice past the point of usefulness, unable to tell productive devotion from restless proving. That restlessness rarely converts into anything deeper than motion.`,
      invitation: `Ask yourself honestly what resting spiritually would seem to prove about your faith. Let your faith rest today instead of working. Do nothing spiritually and call it enough. Notice that the faith survives a day without visible effort.`,
    },

    // ── 2 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '2_F': {
      title: `2 in Paternal Spiritual — The High Priestess`,
      tagline: `A Design of Spoken Intuition`,
      mastery: `You carry real intuitive capacity — inner knowing that doesn't need to be proven to be trusted. That knowing arrived in you already-formed, passed down rather than built from scratch. And when you do speak it, it tends to land with a weight explanation alone never produces. Strangers sense the depth before you've said a word to earn it.`,
      shadow: `You inherit the silence along with the sensitivity, downplaying your own knowing around authority figures. Underneath the downplaying is often a fear that trusting your own perception openly would mean challenging the line's actual authority. You withhold what you sense rather than defend it, exactly as the line modeled. The silence gets mistaken for having nothing to say.`,
      invitation: `Ask yourself honestly whose authority you're deferring to instead of your own perception. Say your intuitive sense out loud today, in a context where you'd normally stay quiet. Say it plainly, without softening it first. Notice that your knowing survives being tested against authority.`,
    },

    // ── 3 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '3_F': {
      title: `3 in Paternal Spiritual — The Empress`,
      tagline: `A Design of Unearned Ease`,
      mastery: `You carry real capacity for spiritual abundance and ease, a gift passed down rather than earned firsthand. You can let spiritual growth happen patiently, without needing to force or prove it. And what comes to you easily in this domain isn't shallow simply because it arrived without struggle. People around you feel the abundance without you performing it.`,
      shadow: `You inherit the belief that spiritual peace has to be earned through struggle, making genuine ease feel suspicious. Underneath the suspicion is often a fear that trusting ease would mean betraying a line that always paid for peace in difficulty. You manufacture struggle to make your own spiritual ease feel legitimate. The manufactured difficulty rarely produces anything the ease wouldn't have.`,
      invitation: `Ask yourself honestly what you're afraid unearned spiritual ease would say about you. Let one spiritual ease be legitimate today, with no struggle attached to earn it. Receive it without manufacturing difficulty first. Notice that the ease doesn't need justifying.`,
    },

    // ── 4 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '4_F': {
      title: `4 in Paternal Spiritual — The Emperor`,
      tagline: `A Design of Chosen Structure`,
      mastery: `You carry real respect for spiritual structure — something worth building and defending, inherited from a line that valued order in faith. You can build spiritual frameworks that actually hold weight over time. And you know how to hold that structure without needing to dominate everyone operating inside it. People trust the frame because it was actually tested, not just assumed.`,
      shadow: `You either submit entirely to inherited spiritual authority or reject all structure reflexively, never landing anywhere of your own. Underneath the extreme is often a fear that choosing your own structure would mean disowning the line that gave you one. You never land anywhere that's actually yours, chosen rather than inherited or reacted against. You end up loyal to a structure, or its absence, that was never fully yours.`,
      invitation: `Ask yourself honestly whether your spiritual structure is chosen or simply inherited by default. Name one piece of spiritual structure today that's actually yours, chosen, not inherited or reacted against. Say it plainly, distinct from what you were given. Notice that choosing your own doesn't require rejecting theirs.`,
    },

    // ── 5 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '5_F': {
      title: `5 in Paternal Spiritual — The Hierophant`,
      tagline: `A Design of Examined Doctrine`,
      mastery: `You carry real, concrete spiritual teaching — an actual doctrine you can examine and use, not vague inheritance. You test what you've been taught against your own lived experience before you fully adopt it. And what survives that testing becomes something you can actually transmit intact to someone else. What survives your testing carries real weight when you pass it on.`,
      shadow: `You treat the doctrine as non-negotiable simply because it arrived so formally packaged. Underneath the non-negotiable stance is often a fear that questioning any part of it means betraying the whole inheritance. You accept the doctrine wholesale rather than examining it on its own merits. The packaging determines your loyalty more than the substance does.`,
      invitation: `Ask yourself honestly what you're afraid examining this doctrine would reveal. Examine one specific piece of inherited doctrine today, on its own merits, not its packaging. Test it against your own experience directly. Notice that questioning it doesn't automatically betray where it came from.`,
    },

    // ── 6 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '6_F': {
      title: `6 in Paternal Spiritual — The Lovers`,
      tagline: `A Design of Chosen Devotion`,
      mastery: `You carry real capacity for spiritual devotion and commitment, passed down as a genuine gift for staying with something. You can hold competing spiritual pulls without pretending one doesn't exist, and still choose. And once you choose consciously, you commit fully, rather than defaulting to what was simply handed to you. People who receive that devotion know it's the full version, not a duty.`,
      shadow: `You stay loyal to an inherited spiritual path out of obligation, not genuine, examined alignment. Underneath the obligation is often a fear that choosing differently would mean betraying the people who gave you the path. Your loyalty runs on default rather than on anything you've actually tested and chosen. The obligation runs quietly under every choice you make in its name.`,
      invitation: `Ask yourself honestly whether your spiritual commitment is chosen or simply assumed. Choose one spiritual commitment today consciously, instead of assuming the inherited one. Say out loud that it's your choice, not just your inheritance. Notice that a conscious choice can land on the same path and still feel entirely different.`,
    },

    // ── 7 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '7_F': {
      title: `7 in Paternal Spiritual — The Chariot`,
      tagline: `A Design of Earned Stillness`,
      mastery: `You carry genuine spiritual discipline and forward motion, a real inheritance of momentum you didn't have to build alone. You keep a spiritual practice moving on will alone, long after the initial spark has faded. And that consistency produces depth over time, far more than intensity ever could. You show up on the flat, uninspiring days as reliably as the exciting ones.`,
      shadow: `You inherit the drive without questioning it, feeling guilty resting or going still in your spiritual life. Underneath the guilt is often a fear that stillness would mean the discipline, and the line behind it, wasn't real. You keep moving spiritually past the point of usefulness, unable to distinguish practice from restlessness. The guilt shows up exactly when rest would actually help most.`,
      invitation: `Ask yourself honestly what stillness in your spiritual practice would seem to prove about your discipline. Let your spiritual practice include real stillness today, with no guilt attached. Stop moving on purpose. Notice that the discipline survives a day of genuine rest.`,
    },

    // ── 8 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '8_F': {
      title: `8 in Paternal Spiritual — Justice`,
      tagline: `A Design of the Honest Ledger`,
      mastery: `You carry a real sense of spiritual integrity and fairness, an inherited scale that catches imbalance most people miss. You hold yourself to the same standard you'd hold anyone else to, which is what gives the inheritance credibility. And you can deliver an honest spiritual accounting without needing it to be punishing. That integrity holds even when nobody's checking your account.`,
      shadow: `You inherit a harsh standard of spiritual accountability, feeling constantly "in debt" spiritually. Underneath the debt is often a fear that questioning the harshness of the standard would mean abandoning fairness altogether. You keep a running ledger of spiritual obligation that was never actually yours to owe. The ledger runs in the background of nearly every choice you make.`,
      invitation: `Ask yourself honestly whether this spiritual debt is genuinely owed or simply inherited as a default. Examine one spiritual debt you've been repaying today, and ask honestly if it's actually owed. Release it if it isn't. Notice that questioning the debt doesn't undo your actual integrity.`,
    },

    // ── 9 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '9_F': {
      title: `9 in Paternal Spiritual — The Hermit`,
      tagline: `A Design of Shared Insight`,
      mastery: `You carry real capacity for deep, solitary spiritual reflection, a genuine inheritance of contemplative depth. You can be self-sufficient in your spiritual practice without it curdling into isolation. And what you bring back from that reflection tends to be sharper than anything generated under pressure or in company. Few people can go that deep into stillness and come back with anything at all.`,
      shadow: `You inherit the isolation along with the depth, keeping your deepest spiritual questions to yourself by default. Underneath the default silence is often a fear that sharing the insight would make it feel less sacred or less yours. Hard-won reflection stays entirely locked inside you, unshared. The depth accumulates and reaches exactly nobody.`,
      invitation: `Ask yourself honestly what sharing your solitary insight would actually cost its depth. Share one piece of solitary spiritual insight with someone today. Offer it plainly, while it's still a little raw. Notice that the insight survives being spoken.`,
    },

    // ── 10 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '10_F': {
      title: `10 in Paternal Spiritual — The Wheel of Fortune`,
      tagline: `A Design of Reclaimed Say`,
      mastery: `You carry a real relationship to spiritual timing and cycles, a genuine inherited instinct for when a moment has actually arrived. You can sense a spiritual shift before it's externally confirmed. And that instinct saves you from decisions made purely on inherited assumption about fate. You read the actual texture of a moment instead of just reacting to it.`,
      shadow: `You inherit either fatalism or over-control around fate, without ever testing which one actually fits you. Underneath the untested inheritance is often a fear that examining it would mean losing the certainty it provides. You default to whichever stance the line handed you, never checking it against your own real experience. Neither stance gets checked against what's actually happening in your life.`,
      invitation: `Ask yourself honestly whether your belief about fate is tested or simply inherited. Claim one piece of say in your own fate today that your inherited belief said you didn't have. Act on it directly. Notice whether the inherited fatalism or control actually held up.`,
    },

    // ── 11 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '11_F': {
      title: `11 in Paternal Spiritual — Strength`,
      tagline: `A Design of Visible Strain`,
      mastery: `You carry real spiritual resilience and endurance, a genuine inheritance of staying soft under pressure without breaking. You can stay present with raw spiritual doubt without needing to suppress it or be ruled by it. And that endurance was handed to you already-formed, not something you had to build entirely alone. People who know your history are surprised by how little it shows.`,
      shadow: `You inherit the belief that struggle should stay hidden, making your own spiritual crises feel shameful to admit. Underneath the hiding is often a fear that visible struggle would look like a failure of the inheritance itself. You perform spiritual steadiness while your actual crises go unspoken. The hiding costs you the support that would have made it lighter.`,
      invitation: `Ask yourself honestly what visible spiritual struggle would seem to say about the line you come from. Let one real spiritual struggle be visible to someone you trust today. Say it plainly, without managing it into something smaller. Notice that the struggle doesn't undo the inheritance of resilience.`,
    },

    // ── 12 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '12_F': {
      title: `12 in Paternal Spiritual — The Hanged Man`,
      tagline: `A Design of the Honest Yes`,
      mastery: `You carry real capacity for spiritual surrender and release, a genuine inherited comfort with not-knowing. You can pause a spiritual decision without anxiety, trusting the pause is doing real work. And that patience produces insight that inherited urgency never could have reached. You can let go long enough to find out what the release actually reveals.`,
      shadow: `You inherit martyrdom instead of genuine surrender, feeling obligated to suffer for your faith to count. Underneath the obligation is often a fear that a surrender without suffering wouldn't be taken seriously by the line that modeled it. You perform sacrifice rather than actually releasing anything. The performance costs you the freedom the surrender was supposed to produce.`,
      invitation: `Ask yourself honestly whether this spiritual sacrifice was ever actually asked for, or just assumed. Examine one spiritual sacrifice today and ask honestly if it was ever actually asked for. Release it if it wasn't. Notice that surrender without suffering still counts.`,
    },

    // ── 14 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '14_F': {
      title: `14 in Paternal Spiritual — Temperance`,
      tagline: `A Design of Earned Balance`,
      mastery: `You carry real capacity for balanced spiritual integration, an inherited gift for blending what doesn't obviously mix. You blend in the right proportion for the specific moment, not by rote formula. And you moderate your own extremes naturally, which makes your spiritual life sustainable in a way inherited intensity rarely is. That's a rare and genuinely useful combination to have been handed.`,
      shadow: `You inherit neutrality without genuine integration, staying so moderate that real intensity never shows up at all. Underneath the moderation is often a fear that full spiritual intensity would cost you the balance the line valued. You use the middle to avoid ever fully committing to anything intense. The shame outlives whatever originally justified it.`,
      invitation: `Ask yourself honestly what full spiritual intensity would actually cost the balance you've inherited. Let one real spiritual intensity in today, fully, before you moderate it. Don't dilute it immediately. Notice that intensity doesn't have to threaten the integration.`,
    },

    // ── 15 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '15_F': {
      title: `15 in Paternal Spiritual — The Devil`,
      tagline: `A Design of Held Desire`,
      mastery: `You carry real spiritual depth alongside real desire — capable of holding both, a genuine inherited capacity for appetite without shame. You look directly at your own wanting without flinching away or pretending it isn't there. And you understand your own attachments well enough to use them deliberately, rather than being run by inherited guilt about them. You notice the crack in a spiritual structure before anyone else admits it's there.`,
      shadow: `You inherit shame around desire, feeling spiritual guilt around ordinary human wants. Underneath the shame is often a fear that admitting desire plainly would mean the depth wasn't real devotion. You treat desire and devotion as enemies, exactly as the line modeled. The unnamed dread outlives the actual event that caused it.`,
      invitation: `Ask yourself honestly what you're afraid naming your actual desire would say about your devotion. Let one desire and one devotion sit in the same hands today, without treating them as enemies. Name both plainly, together. Notice that they don't cancel each other out.`,
    },

    // ── 16 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '16_F': {
      title: `16 in Paternal Spiritual — The Tower`,
      tagline: `A Design of the Named Collapse`,
      mastery: `You carry real capacity for spiritual clarity, even through rupture, a genuine inherited resilience for surviving collapse. You can let a false spiritual structure fall rather than propping it up indefinitely. And you recover fast from spiritual upheaval, integrating what it showed you rather than just surviving it. That hope tends to draw people toward you rather than away.`,
      shadow: `You inherit an unprocessed collapse — a vague, hard-to-place distrust of spiritual structures whose source predates you. Underneath the vague distrust is often a fear that tracing it to its actual source would mean reopening a wound that isn't even yours. You carry the aftershock of a rupture you never witnessed. The disclaimer undercuts the hope before anyone's had the chance to receive it.`,
      invitation: `Ask yourself honestly what collapsed in your father's line's faith that you've never actually named. Name today, even speculatively, what collapsed and what clarity should have followed. Say it plainly, even as a guess. Notice that naming it loosens its hold on your own spiritual life.`,
    },

    // ── 17 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '17_F': {
      title: `17 in Paternal Spiritual — The Star`,
      tagline: `A Design of Full-Sized Hope`,
      mastery: `You carry real capacity for spiritual renewal and hope, a genuine inheritance that hasn't hardened into naivety. You carry hope that's actually looked at the hard parts and stayed intact anyway. And you inspire real optimism in others just by being near them, without needing to perform positivity to do it. You can hold ambiguity without needing to resolve it prematurely.`,
      shadow: `You inherit a caution against hoping too visibly, hedging every spiritual hope with a disclaimer. Underneath the hedging is often a fear that a hope stated fully and disappointed would be unbearable, exactly as it may have been for the line before you. You pre-shrink every hope before anyone can test it. The unnamed dread keeps costing you long after its actual source has passed.`,
      invitation: `Ask yourself honestly what you're afraid would happen if the hope, stated fully, disappointed you. Let one spiritual hope be fully, visibly held today, with no hedge attached. Say it at its real size. Notice that stating it plainly doesn't make the risk any worse.`,
    },

    // ── 18 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '18_F': {
      title: `18 in Paternal Spiritual — The Moon`,
      tagline: `A Design of the Named Fear`,
      mastery: `You carry real spiritual sensitivity and depth, a genuine inherited fluency for the unseen and unspoken. You navigate spiritual uncertainty without needing everything resolved before you'll trust what you're sensing. And you can hold conflicting spiritual feelings at once without needing them reconciled first. People feel the warmth as real precisely because it doesn't need gravity to back it up.`,
      shadow: `You inherit a diffuse, unnamed spiritual dread that doesn't attach to anything specific in your own life. Underneath the diffuseness is often a fear that tracing it to its actual source would mean reliving something that isn't yours to relive. You mistake inherited fog for a fact about your own character. The muting costs you exactly the joy the faith was supposed to produce.`,
      invitation: `Ask yourself honestly whether this dread is signal from your own life or unmoored anxiety inherited from the line. Trace one spiritual anxiety back today, even speculatively, and give it an actual name. Check it against your own real circumstances. Notice how much of it was never actually about you.`,
    },

    // ── 19 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '19_F': {
      title: `19 in Paternal Spiritual — The Sun`,
      tagline: `A Design of Legitimate Joy`,
      mastery: `You carry real capacity for radiant, joyful faith, a genuine inherited vitality that doesn't need to be earned through struggle. You bring genuine warmth into a spiritual space just by being in it, contagious rather than performed. And that uncomplicated joy is not shallow simply because it arrived without difficulty. That discernment is a genuine gift, not just caution dressed up as wisdom.`,
      shadow: `You inherit the belief that seriousness is what makes faith legitimate, muting your own genuine spiritual joy. Underneath the muting is often a fear that visible joy would read as less devoted than the line's more solemn model. You dim your natural radiance to look appropriately grave. The pattern repeats until someone in the line finally breaks it.`,
      invitation: `Ask yourself honestly what your joy would seem to say about how seriously you take your faith. Let one moment of spiritual joy be fully legitimate today, with no gravity required to justify it. Let it be light, unearned, and real. Notice that joy doesn't undercut the depth of your faith.`,
    },

    // ── 20 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '20_F': {
      title: `20 in Paternal Spiritual — Judgement`,
      tagline: `A Design of the Answered Pull`,
      mastery: `You carry real capacity to answer a larger spiritual calling, a genuine inherited discernment for a real summons. You act on the call before you've fully rehearsed it, trusting readiness catches up once you've started. And you can genuinely evaluate the call honestly, without inflating or dismissing it. What you finish carries the weight of an entire lineage actually arriving somewhere.`,
      shadow: `You inherit the postponement itself, sensing a summons and setting it aside the way your line always did. Underneath the postponing is often a fear that answering differently than the line did would mean breaking from them entirely. You gather more information, wait for better conditions, prepare a little further, exactly as they did. The pattern of almost-there gets inherited right along with everything else.`,
      invitation: `Ask yourself honestly what answering this call your own way would risk about your standing in the line. Answer one spiritual pull today, your own way, instead of postponing it again. Take the step now, imperfectly. Notice that answering it doesn't require breaking from where you came from.`,
    },

    // ── 21 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '21_F': {
      title: `21 in Paternal Spiritual — The World`,
      tagline: `A Design of the Closed Cycle`,
      mastery: `You carry real capacity for genuine spiritual wholeness and completion, a genuine inherited gift for the full arc rather than the promising start. You integrate everything, the hard parts and the good parts, into one coherent spiritual whole. And you find genuine satisfaction in completion itself, not just in what it opens up next. That trust lets you access what a more cautious inheritance never would.`,
      shadow: `You inherit near-completion — stopping just short of real spiritual wholeness, echoing a pattern that predates your choices. Underneath the near-completion is often a fear that finishing where the line always stopped short would set you apart from them. You widen the scope indefinitely rather than closing it. The hesitation gets mistaken for wisdom simply because it's familiar.`,
      invitation: `Ask yourself honestly what completing this spiritual cycle would risk about your connection to the pattern before you. Let one spiritual cycle actually complete today instead of stopping just short of it. Close it deliberately. Notice that finishing doesn't sever you from where you came from.`,
    },

    // ── 22 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '22_F': {
      title: `22 in Paternal Spiritual — The Fool`,
      tagline: `A Design of the Untested Leap`,
      mastery: `You carry real capacity for spiritual openness and trust in the unknown, a genuine inherited willingness to step forward without a guarantee. You bring genuine spontaneity to your own spiritual growth, unafraid of what most people talk themselves out of. That trust compounds the more you use it, letting you access experiences a more cautious inheritance would never permit. And each leap builds a track record that makes the next one easier to take.`,
      shadow: `You inherit caution around anything unproven, staying within familiar, approved spiritual territory out of a hesitation that isn't yours. Underneath the hesitation is often a fear that stepping outside approved territory would mean losing standing with the line that approved it. You mistake inherited caution for your own considered wisdom. The territory you consider safe was mapped by someone else's fear, not yours.`,
      invitation: `Ask yourself honestly whether this caution is actually yours or simply inherited by default. Take one small, genuine spiritual leap today that your inherited caution would have avoided. Take it deliberately, with your eyes open. Notice that the leap doesn't cost you what the caution promised to protect.`,
    },

    // ── 9 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '9_G': {
      title: `9 in Maternal Spiritual — The Hermit`,
      tagline: `A Design of the Spoken Depth`,
      mastery: `You carry real, inherited depth — the capacity to sit with the unanswerable, modeled through your mother's line's quiet. That depth arrived in you already-formed, absorbed through presence rather than instruction. And what you find in solitude tends to be sharper than anything generated under pressure. People who spend real time with you sense that depth even in silence.`,
      shadow: `You inherit the assumption that deep things aren't discussed, staying entirely private with wisdom that could actually help someone. Underneath the privacy is often a fear that speaking it would break a silence the whole line kept. Hard-won understanding stays locked inside you, exactly as it did for the women before you. The knocking, if it ever comes, arrives from someone who never got the chance to hear it.`,
      invitation: `Ask yourself honestly what breaking this particular silence would risk about your place in the line. Speak one piece of your inward wisdom out loud today, to someone who could use it. Say it plainly, without wrapping it in disclaimers. Notice that the depth survives being spoken.`,
    },

    // ── 1 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '1_G': {
      title: `1 in Maternal Spiritual — The Magician`,
      tagline: `A Design of the Named Capability`,
      mastery: `You carry real spiritual capability, modeled through quiet confidence rather than explanation. You act on that capability the moment it's needed, translating instinct into something real without waiting for permission. And that capacity was handed to you already-formed, a genuine inheritance you didn't have to build from nothing. People rely on that quiet capability without ever having heard you claim it.`,
      shadow: `The capability stays instinctual because it was never given language, so you sense your own agency but struggle to claim it. Underneath the struggle is often a fear that naming it plainly would break with a line that always let it stay unspoken. You demonstrate the capability quietly rather than owning it out loud, exactly as it was modeled. The struggle to claim it costs you credit for work that was genuinely yours.`,
      invitation: `Ask yourself honestly what naming your own capability out loud would risk. Name your own capability out loud today, instead of just quietly demonstrating it. Say it plainly to someone who'd notice the difference. Notice that claiming it doesn't make it any less real.`,
    },

    // ── 2 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '2_G': {
      title: `2 in Maternal Spiritual — The High Priestess`,
      tagline: `A Design of Tested Trust`,
      mastery: `You carry real, embodied trust in your inner sense of things, a felt certainty passed down rather than argued into you. You act on what you sense without needing a chain of reasoning to justify it first. And that trust in your own perception was handed to you already-formed, a genuine gift most people spend years trying to build. That embodied trust moves you faster than deliberation ever could.`,
      shadow: `That certainty was never taught to self-correct, so you can hold a wrong intuition as unquestionable. Underneath the unquestionable stance is often a fear that testing it would mean doubting the very trust the line gave you. You mistake inherited confidence for accuracy, without ever checking the two against each other. The unquestioned intuition eventually costs you more than the testing would have.`,
      invitation: `Ask yourself honestly when you last actually tested your intuition instead of simply trusting it. Test one intuition against the world today instead of assuming it's automatically right. Check it against something concrete. Notice that testing it doesn't undo the trust the line handed you.`,
    },

    // ── 3 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '3_G': {
      title: `3 in Maternal Spiritual — The Empress`,
      tagline: `A Design of the Named Warmth`,
      mastery: `You carry real, warm spiritual generativity — a presence that nurtures without needing to explain itself, passed down through simply being near it. You cultivate what's around you patiently, without pushing or rushing it. And that abundance is real precisely because it was never performed, only modeled. People feel nourished around you without needing an explanation for why.`,
      shadow: `The warmth stays purely atmospheric because it was never put into words, so you can't offer it deliberately. Underneath the wordlessness is often a fear that naming the warmth would make it feel calculated rather than genuine. You can't direct that nurturing on purpose because nobody in the line ever showed you how to name it. The atmosphere stays vague and undirected, generous but unaimed.`,
      invitation: `Ask yourself honestly what naming your warmth out loud would risk about how genuine it feels. Put words to the spiritual warmth you carry today, and offer it to one specific person on purpose. Say it directly instead of just being present. Notice that naming it doesn't make it any less real.`,
    },

    // ── 4 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '4_G': {
      title: `4 in Maternal Spiritual — The Emperor`,
      tagline: `A Design of Visible Authority`,
      mastery: `You carry real spiritual steadiness and order, held quietly rather than announced, a genuine inheritance of authority that never needed to shout. You build spiritual structure that actually holds, even without anyone crediting you for it. And that steadiness was handed to you already-formed, real and dependable underneath the quiet. People quietly rely on that order without ever crediting where it comes from.`,
      shadow: `The quietness goes so far your own authority never gets recognized, including by you. Underneath the invisibility is often a fear that claiming the authority openly would break the pattern the line always kept. You hold real steadiness and let it go entirely uncredited, exactly as modeled. You end up the load-bearing structure nobody, including you, ever names as such.`,
      invitation: `Ask yourself honestly what making your authority visible would risk breaking. Let your quiet spiritual authority be visible today, even if it feels like breaking a pattern. Claim it plainly, once. Notice that visibility doesn't cost you the steadiness underneath it.`,
    },

    // ── 5 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '5_G': {
      title: `5 in Maternal Spiritual — The Hierophant`,
      tagline: `A Design of Credited Wisdom`,
      mastery: `You carry real wisdom, absorbed through relationship and lived example rather than formal teaching. You test what you absorbed against your own experience before treating it as true. And what survives that testing is genuinely transmittable, whether or not it ever came with credentials attached. People who received it firsthand know exactly how real it was.`,
      shadow: `You dismiss that wisdom as "just how she was," undervaluing it because it never arrived with formal credibility. Underneath the dismissal is often a fear that naming it as real knowledge would mean taking responsibility for passing it on deliberately. You let genuinely useful understanding go unclaimed simply because of how it arrived. You inherit the substance and discard the credibility it actually deserves.`,
      invitation: `Ask yourself honestly what you're actually dismissing as "just how she was" that deserves to be named as knowledge. Name one piece of relational wisdom today as real knowledge, worth passing on deliberately. Say it plainly, without the "just" attached. Notice that its lack of formal packaging never made it less true.`,
    },

    // ── 6 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '6_G': {
      title: `6 in Maternal Spiritual — The Lovers`,
      tagline: `A Design of Examined Values`,
      mastery: `You carry real values, demonstrated through the choices your mother's line actually made rather than simply spoken about. You can hold competing values at once without pretending one doesn't exist, and still choose. And once you consciously choose, you commit fully, rather than repeating what was simply modeled. What you choose consciously carries more weight than what simply repeats.`,
      shadow: `You repeat the same relational choices automatically, without ever examining whether they're genuinely yours. Underneath the automatic repeating is often a fear that examining the pattern would mean questioning the people who modeled it. Your values run on default rather than on anything you've actually tested and chosen. The unexamined pattern keeps running the same way it always has.`,
      invitation: `Ask yourself honestly which of your values you've never actually examined yourself. Name one value you actually watched get modeled today, and consciously decide if you're keeping it. Say the decision out loud, either way. Notice that examining it doesn't require rejecting where it came from.`,
    },

    // ── 7 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '7_G': {
      title: `7 in Maternal Spiritual — The Chariot`,
      tagline: `A Design of Chosen Direction`,
      mastery: `You carry real, quiet, sustained spiritual will — determination without drama, a genuine inheritance of steady forward motion. You keep moving on will alone, long after the initial spark has faded, exactly as the line before you did. And that consistency produces real depth over time, without needing to announce itself. That will carries you through stretches drama-driven momentum never survives.`,
      shadow: `You push forward without questioning whether the direction was actually chosen or just the only path modeled. Underneath the unquestioned momentum is often a fear that pausing to check would mean losing the drive itself. You keep moving in a direction you never actually tested against your own life. The unquestioned direction can run for years before anyone, including you, notices.`,
      invitation: `Ask yourself honestly whether your current spiritual direction is genuinely yours or simply the only path you were shown. Pause today and ask that question directly. Sit with the uncertainty instead of pushing past it. Notice that pausing doesn't cost you the will underneath it.`,
    },

    // ── 8 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '8_G': {
      title: `8 in Maternal Spiritual — Justice`,
      tagline: `A Design of the Updated Standard`,
      mastery: `You carry a real, felt sense of right and wrong, absorbed by watching consistent action rather than being told rules. You hold yourself to the same standard you'd hold anyone else to, which is what makes the inheritance credible. And you can deliver an honest assessment without needing it to be harsh. People trust your read precisely because it was built on real observation.`,
      shadow: `You apply that inherited standard rigidly, even in situations it wasn't actually built for. Underneath the rigidity is often a fear that adapting the standard would mean abandoning the fairness it was meant to protect. You enforce a rule that was fitted to a different life than the one you're actually living. The mismatch between rule and reality goes unnoticed until it costs someone.`,
      invitation: `Ask yourself honestly whether this standard actually fits your current circumstances or was just inherited whole. Check one inherited standard of fairness today against your own actual circumstances. Adjust it if it doesn't fit. Notice that adapting it doesn't undo the fairness underneath it.`,
    },

    // ── 10 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ──────────
    '10_G': {
      title: `10 in Maternal Spiritual — The Wheel of Fortune`,
      tagline: `A Design of Active Trust`,
      mastery: `You carry real, quiet trust that hard seasons pass — cyclical resilience modeled without drama, a genuine inheritance of faith in timing. You sense when a season is actually turning, without needing external proof first. And that trust makes the transitions gentler than they'd otherwise be. That trust makes even a hard season feel survivable rather than endless.`,
      shadow: `That patience arrives without its complementary agency — you endure passively instead of actively steering what's actually yours to steer. Underneath the passivity is often a fear that taking action would mean the modeled patience wasn't enough on its own. You wait out hard seasons that actually had a piece you could have influenced. The passive endurance runs longer than it ever needed to.`,
      invitation: `Ask yourself honestly what part of this hard season is actually yours to influence, not just endure. Take one active step today in a hard season you've just been waiting out. Act on the piece that's genuinely yours. Notice that action doesn't cancel the patience underneath it.`,
    },

    // ── 11 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '11_G': {
      title: `11 in Maternal Spiritual — Strength`,
      tagline: `A Design of Named Softness`,
      mastery: `You carry real gentle endurance — strength that never needed to look fierce to be real, a genuine inheritance of soft resilience. You can stay present with raw states without needing to suppress them or be ruled by them. And you know the difference between gentleness and weakness, so you can be soft without ever being a pushover. People who've leaned on it know exactly how much it can actually hold.`,
      shadow: `You mistake your own quiet resilience for weakness because it doesn't look like conventional toughness. Underneath the mistaking is often a fear that naming it as strength would require proving it the way the world expects strength to look. You devalue an inheritance that's actually been carrying real weight the whole time. The mislabeling costs you the credit an inheritance like this deserves.`,
      invitation: `Ask yourself honestly what your gentle endurance has actually carried that conventional toughness never could. Name your gentle endurance as real strength today, out loud, even just to yourself. Say it plainly, without hedging it. Notice that naming it doesn't require it to look fierce.`,
    },

    // ── 12 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '12_G': {
      title: `12 in Maternal Spiritual — The Hanged Man`,
      tagline: `A Design of the Resolved Wait`,
      mastery: `You carry real comfort with not having answers yet — receptive patience that lets understanding arrive in its own time, a genuine inherited gift for not-knowing. You can pause without anxiety, trusting the pause itself is doing real work. And that patience produces insight that force never could have reached. That patience produces understanding that force never could have reached.`,
      shadow: `That waiting never resolves into action — you can stay suspended indefinitely with no modeled return. Underneath the endless suspension is often a fear that acting would mean the patience wasn't the actual point. You wait past the point where waiting was ever doing anything. The suspension runs indefinitely, with no model for how it was ever meant to end.`,
      invitation: `Ask yourself honestly whether this waiting is still doing real work or has become a place to avoid choosing. Give one piece of your patience a deliberate endpoint today. Choose to act on it now. Notice that acting doesn't undo the receptivity that got you here.`,
    },

    // ── 13 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '13_G': {
      title: `13 in Maternal Spiritual — Transformation`,
      tagline: `A Design of Chosen Reinvention`,
      mastery: `You carry real capacity for quiet reinvention — becoming who you need to become, a genuine inherited fluency with change. You can let an old version of yourself die without needing the process to be dramatic. And you recover fast from real shifts, integrating what they showed you rather than just surviving them. What you become under your own choosing tends to actually last.`,
      shadow: `That change only happens reactively, under pressure, instead of through your own conscious choice. Underneath the reactivity is often a fear that initiating change deliberately would mean the reinvention wasn't forced, and therefore wasn't real. You wait for pressure to do the deciding for you. The reactive version of change keeps arriving on someone else's timeline, not yours.`,
      invitation: `Ask yourself honestly what change you've been waiting for pressure to force instead of choosing yourself. Initiate one change deliberately today, instead of waiting for pressure to force it. Choose it on your own timing. Notice that a chosen change counts just as much as a forced one.`,
    },

    // ── 14 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '14_G': {
      title: `14 in Maternal Spiritual — Temperance`,
      tagline: `A Design of the Named Contradiction`,
      mastery: `You carry real ease holding contradictions — duty and desire, strength and softness, without treating them as crisis. You blend in the right proportion for the specific moment, not by rote formula. And you moderate your own extremes naturally, which makes you sustainable in ways people who burn hot rarely are. That capacity makes you genuinely easier to be around during real tension.`,
      shadow: `That ease can mean calmly holding a contradiction that's actually causing harm, avoiding real tension that needs addressing. Underneath the calm holding is often a fear that naming the tension as a problem would mean the modeled ease had failed. You mistake patience for resolution, and the contradiction never actually gets settled. The harm sits underneath the calm, technically held and never actually addressed.`,
      invitation: `Ask yourself honestly which contradiction you've been patiently holding that actually needs resolving. Name one contradiction today that actually needs resolving, not just patient holding. Take a position instead of holding both sides equally. Notice that resolving it doesn't mean you've lost your capacity for ease.`,
    },

    // ── 15 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '15_G': {
      title: `15 in Maternal Spiritual — The Devil`,
      tagline: `A Design of Reclaimed Wanting`,
      mastery: `You carry real desire and material want, worth naming plainly, a genuine inheritance of appetite that doesn't need to apologize for itself. You look directly at your own wanting without flinching away or dressing it up. And that unflinching honesty is what actually makes real freedom possible. That plainness is a real form of honesty most people never reach.`,
      shadow: `You inherit an unspoken restraint that makes wanting openly feel inappropriate, so your desires stay hidden even from yourself. Underneath the restraint is often a fear that naming a want plainly would break with a line that always kept desire quiet. You keep wanting things you've never once said out loud, not even to yourself. The hidden wanting doesn't disappear — it just stops being available to you consciously.`,
      invitation: `Ask yourself honestly what you want that you've never actually said out loud. Name one genuine want out loud today, plainly, with no hedge attached. Say it without apologizing for it. Notice that naming it doesn't make you less like the women who came before you — it makes you more honest than they got to be.`,
    },

    // ── 16 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '16_G': {
      title: `16 in Maternal Spiritual — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real capacity for clarity, even through past rupture, a genuine inherited resilience for surviving collapse. You can let a false structure fall rather than propping it up indefinitely. And you recover fast from upheaval, integrating what it showed you rather than just enduring it. You notice the crack in a structure before anyone else admits it's there.`,
      shadow: `You carry a diffuse unease around instability whose actual story was never told. Underneath the diffuseness is often a fear that asking about it would reopen a wound that isn't even yours to reopen. You inherit the aftershock of a rupture you never actually witnessed. The unease outlives the actual event that caused it, generation after generation.`,
      invitation: `Ask yourself honestly what happened in your mother's line that was never spoken about. Ask today, even just of yourself, and see what you already sense the answer to be. Name it, even speculatively. Notice that naming it loosens its hold on your own life.`,
    },

    // ── 17 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '17_G': {
      title: `17 in Maternal Spiritual — The Star`,
      tagline: `A Design of Unhedged Hope`,
      mastery: `You carry real optimism and hope, an inheritance that hasn't hardened into naivety. You hold hope that's actually looked at the hard parts and stayed intact anyway. And you inspire real optimism in others just by being near them, without needing to perform it. That hope tends to draw people toward you rather than away.`,
      shadow: `You inherit a caution against hoping too visibly, hedging every hope with a disclaimer. Underneath the hedging is often a fear that a hope stated fully and disappointed would be unbearable, exactly as it may have been for the women before you. You pre-shrink every hope before anyone can test it. The disclaimer undercuts the hope before anyone's had the chance to receive it fully.`,
      invitation: `Ask yourself honestly what you're afraid would happen if the hope, stated fully, disappointed you. Let one hope be fully, visibly held today, with no hedge. Say it at its real size. Notice that stating it plainly doesn't make the risk any worse.`,
    },

    // ── 18 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '18_G': {
      title: `18 in Maternal Spiritual — The Moon`,
      tagline: `A Design of Sorted Feeling`,
      mastery: `You carry a rich, deep inner and intuitive life, a genuine inherited fluency for the unseen and unspoken. You navigate uncertainty without needing everything resolved before you'll trust what you're sensing. And you can hold conflicting feelings at once without needing them reconciled first. You can hold ambiguity without needing to resolve it prematurely.`,
      shadow: `You carry unprocessed emotional atmosphere that was never named, feelings that may not actually be yours. Underneath the unprocessed atmosphere is often a fear that sorting it would mean reliving something that belongs to someone else. You mistake inherited fog for a fact about your own character. The unsorted feeling keeps recurring, misfiled under your own name.`,
      invitation: `Ask yourself honestly whether this feeling is actually yours or something absorbed from the line before you. Sort one feeling today — decide honestly whether it's actually yours or something you absorbed. Trace it back if you can. Notice how much lighter the ones that were never yours become once named.`,
    },

    // ── 19 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '19_G': {
      title: `19 in Maternal Spiritual — The Sun`,
      tagline: `A Design of Generated Warmth`,
      mastery: `You carry real vitality and joy, radiating simply through how you show up, a genuine inheritance you didn't have to build alone. You bring genuine warmth into a room just by being in it, contagious rather than performed. And what comes to you easily in this domain isn't shallow simply because it arrived without effort. That warmth was always more available in you than you gave yourself credit for.`,
      shadow: `You stand in the glow of that warmth without becoming a source of it yourself, treating joy as received, not generated. Underneath the receiving-only stance is often a fear that generating your own warmth would mean you no longer needed the source you grew up standing near. You reflect the light instead of producing it. The reflection runs dim the moment the original source isn't in the room.`,
      invitation: `Ask yourself honestly what generating your own warmth, instead of just receiving it, would actually change. Let your own warmth be a source for someone today, not just a reflection of what you received. Offer it first, before waiting to feel it from someone else. Notice that you have more of it than you thought.`,
    },

    // ── 20 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '20_G': {
      title: `20 in Maternal Spiritual — Judgement`,
      tagline: `A Design of the Named Pull`,
      mastery: `You carry a real, felt pull toward something larger than your current circumstances, a genuine inherited discernment for a real summons. You sense the call clearly, distinct from noise or wishful thinking. And you can genuinely evaluate that pull honestly, without inflating or dismissing it. People sense there's a pull in you long before you name it yourself.`,
      shadow: `That pull stays wordless — you sense a bigger calling without ever naming or moving toward it. Underneath the wordlessness is often a fear that naming it plainly would make disappointment, if it came, feel worse. You feel the summons and let it stay unspoken, exactly as the line before you may have. The pull keeps returning at the same intensity, unresolved, year after year.`,
      invitation: `Ask yourself honestly what naming this calling specifically would risk if it turned out differently than hoped. Name your calling as specifically as you can today, even if it feels presumptuous. Say it out loud to someone. Notice that naming it doesn't obligate you to anything you're not ready for.`,
    },

    // ── 21 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '21_G': {
      title: `21 in Maternal Spiritual — The World`,
      tagline: `A Design of Claimed Enoughness`,
      mastery: `You carry a real, settled sense of being enough, modeled through simply living rather than declared out loud. You integrate everything, the hard parts and the good parts, into one honest sense of wholeness. And you can actually feel and recognize enoughness when it's present, rather than always redefining it further out of reach. That settledness reads as real precisely because it was never performed.`,
      shadow: `You wait for that wholeness to simply arrive instead of actively claiming it in your own circumstances. Underneath the waiting is often a fear that claiming it yourself would mean it wasn't genuinely modeled, only performed. You stay in a permanent almost-enough, never quite landing. The waiting can run an entire lifetime without the arrival ever actually happening.`,
      invitation: `Ask yourself honestly what you're waiting for before you'll call your own life enough. Actively name your own sense of "enough" today, instead of waiting for it to arrive. Say it plainly, out loud. Notice that claiming it doesn't require it to look like what was modeled for you.`,
    },

    // ── 22 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '22_G': {
      title: `22 in Maternal Spiritual — The Fool`,
      tagline: `A Design of the Grieved Restart`,
      mastery: `You carry real resilience through fresh starts — the sense that beginning again is simply possible, a genuine inherited trust that didn't need to be earned firsthand. You step forward without needing a guarantee handed to you first. And that trust compounds the more you use it, opening doors more cautious people never see. That resilience gets tested and proven every time you begin again.`,
      shadow: `You inherit the willingness to restart without ever grieving what each fresh start actually cost. Underneath the ungrieved restarting is often a fear that pausing to grieve would slow the momentum that's kept the line moving. You carry the resilience and skip the mourning that would have made each fresh start lighter. The ungrieved cost accumulates quietly behind every fresh beginning.`,
      invitation: `Ask yourself honestly what a past fresh start actually cost you that you never let yourself feel. Let yourself grieve one thing a past fresh start required leaving behind, today. Sit with the loss instead of moving past it. Notice that grieving it doesn't undo the resilience that carried you through.`,
    },

    // ── 21 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '21_H': {
      title: `21 in Paternal Material — The World`,
      tagline: `A Design of Claimed Progress`,
      mastery: `You inherited an orientation toward real material mastery — building all the way to genuine completion, not just partial success. You integrate everything, the finished pieces and the ongoing ones, into one honest picture of your progress. You find genuine satisfaction in what's actually done, not just in what's still ahead. And that thoroughness was handed to you already-formed, a real strength you didn't have to build alone.`,
      shadow: `You inherit a perfectionism where nothing counts as built until totally finished, leaving your material life feeling permanently one stage short of secure. Underneath the perfectionism is often a fear that calling something done, before it's total, would mean settling for less than the line demanded. You discount real progress because it doesn't match an inherited standard of complete. Your material life stays one stage short of secure no matter how much you've actually built.`,
      invitation: `Ask yourself honestly what "total completion" is actually costing you while you wait for it. Let one piece of material progress count as done today, even though it's not total. Name it as finished, out loud. Notice that calling it done doesn't undo the standard — it just lets you rest inside what you've already built.`,
    },

    // ── 1 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '1_H': {
      title: `1 in Paternal Material — The Magician`,
      tagline: `A Design of Accepted Help`,
      mastery: `You carry real capacity to build material security from nothing, through sheer resourcefulness passed down already-formed. You act first and let the plan catch up, generating momentum other people are still waiting on. You move on opportunity while people waiting for certainty are still waiting. And that speed lets you build things most people spend years talking themselves into.`,
      shadow: `You inherit the expectation of total self-reliance, so needing material help feels like personal failure. Underneath the expectation is often a fear that accepting help would mean the resourcefulness the line prized wasn't actually yours. You build everything alone, carrying weight that was never yours to carry solo. The exhaustion rarely registers as a problem — it just feels like the cost of being self-made.`,
      invitation: `Ask yourself honestly what accepting help right now would actually cost the story you tell about being self-made. Accept one piece of material help today instead of building it entirely alone. Let someone else carry a piece of it. Notice that the resourcefulness survives being shared.`,
    },

    // ── 2 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '2_H': {
      title: `2 in Paternal Material — The High Priestess`,
      tagline: `A Design of the Open Decision`,
      mastery: `You carry real intuitive capacity for material judgment and financial decisions, a felt sense passed down rather than argued into you. You sense the shift in a financial situation before the numbers confirm it. You act on that instinct directly, and it's usually right in ways spreadsheets alone couldn't have shown. And that trust in your own read was handed to you already-formed.`,
      shadow: `You make major material decisions in total isolation, even when transparency would genuinely help. Underneath the isolation is often a fear that opening the decision up would mean the private judgment wasn't trusted enough on its own. You keep financial matters sealed off from the people they actually affect. The isolation costs you counsel that could have caught something you missed alone.`,
      invitation: `Ask yourself honestly what you're protecting by keeping this financial decision entirely private. Bring one financial decision into the open today, before finalizing it. Share it with someone before it's locked in. Notice that opening it up doesn't undermine the judgment behind it.`,
    },

    // ── 3 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '3_H': {
      title: `3 in Paternal Material — The Empress`,
      tagline: `A Design of Received Care`,
      mastery: `You carry real material generosity — capacity to give abundantly as an expression of care, a genuine inheritance you didn't have to build alone. You give freely, without needing to be asked first or thanked afterward. You hold real abundance without hoarding it, generous by nature rather than by calculation. And people remember specific moments when you showed up for them materially without being prompted.`,
      shadow: `You equate giving with love so completely that receiving material help feels foreign or insufficient. Underneath the foreignness is often a fear that being on the receiving end would mean the love you've built your identity around wasn't reciprocal. You give until you're depleted rather than let someone else provide. The imbalance rarely registers as a problem — it just feels like being who you are.`,
      invitation: `Ask yourself honestly what receiving material care would actually threaten about the identity you've built around giving. Let someone show you care today in a way that costs you nothing to receive. Accept it without immediately repaying it. Notice that being cared for doesn't undo your capacity to give.`,
    },

    // ── 4 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '4_H': {
      title: `4 in Paternal Material — The Emperor`,
      tagline: `A Design of the Own Template`,
      mastery: `You carry real capacity for material leadership and responsible providing, an inheritance of order that came already-formed. You build structures that actually last, thinking in years where most people think in weeks. You take ownership of financial outcomes without being asked to, and people feel the safety of it. And you can hold real authority without needing to dominate every decision beneath it.`,
      shadow: `You measure your material life against a rigid, inherited template that was never built for your actual circumstances. Underneath the rigid measuring is often a fear that deviating from the template would mean failing at the role it defines. You judge your own providing against a standard that was fitted to a completely different life. The mismatch produces a quiet, chronic sense of falling short.`,
      invitation: `Ask yourself honestly whether the template you're measuring yourself against was ever actually built for your life. Define what responsible providing looks like today, on your own terms, not the inherited one. Write it down, specifically, in your own words. Notice how much closer you already are to it than the old template ever let you feel.`,
    },

    // ── 5 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '5_H': {
      title: `5 in Paternal Material — The Hierophant`,
      tagline: `A Design of the Tested Rulebook`,
      mastery: `You carry real, specific knowledge about how work and money actually function, absorbed from people who genuinely tested it. You examine what you inherited and consciously choose what actually deserves to stay. What you eventually hold has been through your own reckoning, not simply handed down intact. And that transmission of hard-won knowledge is a genuine strength, not blind imitation.`,
      shadow: `You follow inherited money rules without checking whether the conditions that made them true still apply. Underneath the unchecked following is often a fear that questioning the rule would mean questioning the person who gave it to you. The discipline that once served the line becomes rigidity applied to a life it was never designed for. You end up financially correct by an outdated standard and worse off by the one that actually matters now.`,
      invitation: `Ask yourself honestly which inherited money rule you've never actually tested against your own life. Test one inherited money rule today against your actual current circumstances. Keep it or discard it deliberately, based on what you find. Notice which parts hold up and which were only ever assumed.`,
    },

    // ── 6 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '6_H': {
      title: `6 in Paternal Material — The Lovers`,
      tagline: `A Design of the Own Definition`,
      mastery: `You carry real, values-driven judgment about which material pursuits are genuinely worthwhile, a genuine inheritance of discernment. You know precisely the difference between money you'd take and money you'd regret. You don't compromise that alignment just because a faster option appears. And that integrity ends up being a real asset, not just a principle.`,
      shadow: `You reject good opportunities because they don't match an inherited, unexamined definition of "worthy work." Underneath the rejection is often a fear that questioning the definition would mean betraying the values it was built to protect. You filter real opportunities through a standard you never actually tested yourself. The filter costs you more than it protects, because it was never actually calibrated to your own life.`,
      invitation: `Ask yourself honestly whether "worthy work" as you define it is genuinely yours or simply inherited. Reconsider one opportunity today you dismissed on an inherited value filter. Look at it fresh, on its own merits. Notice whether the rejection still holds once you've actually examined it.`,
    },

    // ── 7 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '7_H': {
      title: `7 in Paternal Material — The Chariot`,
      tagline: `A Design of the Enjoyed Win`,
      mastery: `You carry real material discipline and drive toward provision, a genuine inherited momentum most people never develop. You hold direction firmly without gripping it too tightly, trusting forward motion that doesn't need constant force. You set a material goal and steer through setbacks that would derail most people. And that willpower is genuine, not stubbornness dressed up as virtue.`,
      shadow: `You inherit the belief that stopping to enjoy a win counts as material failure, so success never gets to feel like anything. Underneath the belief is often a fear that pausing to celebrate would mean the drive itself had weakened. You push toward the next goal before the last one has had time to register as real. Every win gets absorbed into momentum instead of actually being felt.`,
      invitation: `Ask yourself honestly what stopping to enjoy this win would risk about your drive toward the next one. Let one material win be fully enjoyed today, before pushing toward the next goal. Sit with it instead of moving past it. Notice that the drive is still there once you let yourself feel the win.`,
    },

    // ── 8 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '8_H': {
      title: `8 in Paternal Material — Justice`,
      tagline: `A Design of Flexible Integrity`,
      mastery: `You carry real material integrity — an honest standard for fair dealing, a genuine inheritance most people never develop this clearly. You hold yourself to the same standard you'd hold anyone else to, which is what gives your dealing credibility. People come back to work with you specifically because your reputation for fairness precedes you. And that reputation compounds quietly over years into opportunities corner-cutters never reach.`,
      shadow: `You apply that standard so rigidly that ordinary negotiation feels like moral compromise, exhausting yourself with vigilance. Underneath the rigidity is often a fear that any flexibility would mean the integrity itself was never real. You mistake your own exhaustion for due diligence, unable to see the line between the two anymore. Deals that should close easily die slowly under scrutiny nobody asked for.`,
      invitation: `Ask yourself honestly whether this rigidity is protecting your integrity or just making ordinary negotiation exhausting. Let one negotiation today be flexible without treating it as a compromise of your integrity. Move forward without the extra audit. Notice that flexibility doesn't actually cost you the fairness underneath it.`,
    },

    // ── 9 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '9_H': {
      title: `9 in Paternal Material — The Hermit`,
      tagline: `A Design of Accepted Support`,
      mastery: `You carry real material self-sufficiency, capable of handling things independently, a genuine inheritance built through deep, solitary competence. You can be self-sufficient without it curdling into isolation, content in your own capability rather than merely tolerating it. Nobody handed you shortcuts, so what you know how to handle actually holds up under pressure. And that depth is real, even on the days nobody's watching you prove it.`,
      shadow: `You inherit the belief that needing material help signals failure, so you never actually let anyone assist. Underneath the refusal is often a fear that accepting help would undo the self-sufficiency the line prized above almost everything else. You handle everything alone, even the things that would genuinely go faster shared. The independence costs you real support that was freely available.`,
      invitation: `Ask yourself honestly what accepting help here would actually cost the self-sufficiency you've built. Accept one piece of practical or financial help today, even though you could handle it alone. Let someone in on it, without minimizing your need. Notice that the self-sufficiency survives being shared once.`,
    },

    // ── 10 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '10_H': {
      title: `10 in Paternal Material — Wheel of Fortune`,
      tagline: `A Design of Tested Timing`,
      mastery: `You carry a real relationship to material timing and cycles, a genuine inherited instinct for when to invest and when to hold. You sense the shift in a financial situation before the numbers catch up. You read the season correctly more often than not, and that accuracy compounds over a lifetime of decisions. And that timing intelligence was handed to you already-formed, not something you had to build entirely from scratch.`,
      shadow: `You inherit either fatalism or excessive control around money, without testing which actually fits your own experience. Underneath the untested inheritance is often a fear that examining it would mean losing whatever certainty it currently provides. You default to whichever stance the line handed you rather than checking it against your own life. Motion or stillness gets mistaken for genuine timing wisdom without ever being verified.`,
      invitation: `Ask yourself honestly whether your stance on financial control is tested or simply inherited by default. Take one action today that assumes your financial choices genuinely matter. Act as though the outcome is actually yours to influence. Notice whether the inherited fatalism or control actually held up.`,
    },

    // ── 11 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '11_H': {
      title: `11 in Paternal Material — Strength`,
      tagline: `A Design of Visible Strain`,
      mastery: `You carry real material resilience — the ability to provide through genuine hardship without breaking. You keep functioning when the financial situation gets hard, holding the household or the obligation together through the actual strain. That endurance was proven under real pressure, not assumed, so it holds when it's tested again. And you can do this work without needing anyone to witness it for it to count.`,
      shadow: `You carry financial stress silently because visible strain feels like failing the provider role your line modeled. Underneath the silence is often a fear that admitting difficulty would mean admitting you're not enough. You isolate under the hardest financial pressure precisely when support would help most. The strain compounds because you're carrying it entirely alone, unnecessarily.`,
      invitation: `Ask yourself honestly what showing this particular strain would actually cost you. Let one piece of real financial strain be visible to someone you trust today. Say the actual number or the actual worry out loud, not a softened version. Notice that being seen struggling doesn't collapse the resilience underneath it.`,
    },

    // ── 12 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '12_H': {
      title: `12 in Paternal Material — The Hanged Man`,
      tagline: `A Design of the Real Deadline`,
      mastery: `You carry real material patience, willing to hold off on the conventional move when the timing genuinely isn't right. You read the difference between a situation that needs more time and one you're just avoiding. That discernment lets you wait through pressure that would push someone else into a premature decision. And when you finally act, the delay has actually improved the outcome instead of just postponing it.`,
      shadow: `You stay suspended in "not yet" on a material decision indefinitely, with no deadline ever attached. Underneath the suspension is often a fear that committing to a real choice would foreclose some better option you haven't found yet. You mistake pure stalling for the patience your line modeled, unable to tell the two apart from inside it. Whole years pass with the decision technically still "pending."`,
      invitation: `Ask yourself honestly whether you're actually waiting for something or simply avoiding the decision. Give one material decision a real deadline today instead of waiting indefinitely. Pick an actual date and put it somewhere you'll see it. Notice how it feels to have a decision that can't drift forever.`,
    },

    // ── 13 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '13_H': {
      title: `13 in Paternal Material — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You carry real capacity for material reinvention, able to end a financial identity or strategy once it's stopped serving you. You read the difference between a role that's simply uncomfortable and one that's genuinely outdated. That discernment lets you release the outdated version deliberately, not just when circumstances force it. And what replaces it actually fits your present situation instead of repeating the same shape under a new name.`,
      shadow: `You cling to a financially outdated role or strategy because your line modeled endurance over release as the mark of character. Underneath the clinging is often a fear that ending it would mean admitting the original commitment was wrong. You keep maintaining a provider role or financial identity that no longer matches your actual circumstances. The cost is a life increasingly organized around something that stopped being true.`,
      invitation: `Ask yourself honestly what ending this outdated role would seem to say about the years you gave it. Let one outdated material identity or strategy actually end today, deliberately, not by drift. Name it as over out loud, to yourself or someone else. Notice that the ending doesn't erase what the role once gave you.`,
    },

    // ── 14 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '14_H': {
      title: `14 in Paternal Material — Temperance`,
      tagline: `A Design of the Worthwhile Risk`,
      mastery: `You carry real, sustainable material balance — the ability to blend saving and spending, risk and caution, into something that holds over time. You don't swing between extremes; you find the workable mix and stay in it. That steadiness was handed to you already-formed, a genuine inheritance of financial temperance. And it lets you weather ordinary volatility without the whole system tipping over.`,
      shadow: `You inherit such complete moderation that worthwhile material risk feels off-limits, even when it's actually warranted. Underneath the caution is often a fear that any imbalance, even a calculated one, would undo the equilibrium the line worked hard to maintain. You default to the safest option automatically, without weighing whether this particular moment calls for something bolder. Opportunities that required a real but reasonable risk pass by unclaimed.`,
      invitation: `Ask yourself honestly whether this caution is genuinely warranted or simply reflexive. Let one calculated, worthwhile material risk through today instead of defaulting to caution. Take the smaller version of the risk if the full version feels like too much at once. Notice that the balance survives one deliberate imbalance.`,
    },

    // ── 15 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '15_H': {
      title: `15 in Paternal Material — The Devil`,
      tagline: `A Design of the Named Dynamic`,
      mastery: `You carry a real, honest understanding of material power and leverage, able to name who actually holds control in a financial situation. You see the dynamic clearly instead of pretending it isn't there. That clarity lets you use leverage deliberately, on your own terms, rather than by default. And naming the dynamic out loud actually loosens its grip rather than tightening it.`,
      shadow: `You repeat an inherited power dynamic without examining it, either gripping control or accepting being controlled by default. Underneath the repetition is often a fear that questioning the dynamic would destabilize the whole arrangement it's embedded in. You slot into the same role, dominant or subordinate, in every financial relationship without checking whether it actually fits this one. The pattern runs unexamined because naming it feels riskier than living inside it.`,
      invitation: `Ask yourself honestly which role, controlling or controlled, you default into financially without deciding to. Name one material power dynamic today you've been repeating without examining it. Say it plainly, even just to yourself. Notice that naming it doesn't force an immediate change, only honesty.`,
    },

    // ── 16 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '16_H': {
      title: `16 in Paternal Material — The Tower`,
      tagline: `A Design of the Named Collapse`,
      mastery: `You carry real capacity for material clarity, able to see a financial structure accurately even after it's collapsed once. You don't need the illusion of stability to function; you can rebuild on solid ground once the old structure is actually gone. That clear-eyed rebuilding is a real inheritance, proven through what your line survived. And what you build afterward tends to be sturdier than what came before it.`,
      shadow: `You carry a disproportionate financial anxiety whose actual source, an unprocessed collapse, predates your own circumstances entirely. Underneath the anxiety is often a fear that stability itself is temporary, since it was for the line before you. You brace for a financial disaster that isn't actually coming, reading ordinary volatility as impending collapse. The bracing costs you a present-tense calm your real circumstances would otherwise support.`,
      invitation: `Ask yourself honestly whether this financial fear belongs to your present circumstances or an inherited past one. Name today, even speculatively, what happened materially in your father's line that was never discussed. Write it down or say it to someone, however incomplete the picture is. Notice whether the anxiety loosens once it has an actual source attached to it.`,
    },

    // ── 17 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '17_H': {
      title: `17 in Paternal Material — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry real capacity for material hope and renewal, able to imagine a genuinely better financial future without it feeling naive. You hold ambition and realism together instead of trading one for the other. That hopefulness was handed to you already-formed, a real inheritance rather than blind optimism. And it lets you keep building toward something larger even after a setback.`,
      shadow: `You cap your own material ambitions at an inherited, modest ceiling, even when your actual circumstances could support far more. Underneath the cap is often a fear that wanting more than the line ever had would be its own kind of betrayal. You round your goals down before you've even tested what's actually possible for you. The discount happens automatically, so quietly you may not notice you're applying it.`,
      invitation: `Ask yourself honestly what number or goal you'd name if the inherited ceiling didn't apply. Let one material dream be fully-sized today, with no inherited discount applied. Say the real number, not the modest one you'd normally offer. Notice whether the full-sized version actually feels impossible or just unfamiliar.`,
    },

    // ── 18 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '18_H': {
      title: `18 in Paternal Material — The Moon`,
      tagline: `A Design of the Traced Worry`,
      mastery: `You carry real material sensitivity, the ability to sense financial risk or opportunity before it's fully visible. You pick up on the early signal, the shift in a situation before the numbers confirm it. That instinct was inherited already-tuned, a genuine perceptual gift rather than generic worry. And when you trust it and check it against reality, it proves reliable more often than not.`,
      shadow: `You carry diffuse financial anxiety that doesn't attach to your actual current circumstances at all. Underneath the diffuseness is often a fear that naming the actual source would make it too real to manage. You feel unsettled about money without being able to say specifically why, cycling through vague worst-case scenarios. The anxiety never resolves because it was never actually about anything you could address.`,
      invitation: `Ask yourself honestly what this money worry is actually about, underneath the vague unease. Trace one money worry back today, even speculatively, and give it an actual name. Write down the real source, not the closest convenient one. Notice whether naming it makes the worry smaller or at least more workable.`,
    },

    // ── 19 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '19_H': {
      title: `19 in Paternal Material — The Sun`,
      tagline: `A Design of Genuine Lightness`,
      mastery: `You carry real capacity for a joyful, light relationship to material life, able to enjoy money without guilt or grim overtone. You can treat a financial win as simply good news, not something requiring caution or apology. That lightness is a genuine inheritance, not naivety about how money works. And it lets you make ordinary financial decisions without dragging unnecessary heaviness into them.`,
      shadow: `You treat money matters with more grim seriousness than they actually require, because that's the tone you inherited by default. Underneath the seriousness is often a fear that lightness around money would look like carelessness or disrespect for what the line struggled through. You add weight to decisions that don't need it, turning simple choices into heavy ones. The extra gravity costs you the actual ease your current circumstances would otherwise allow.`,
      invitation: `Ask yourself honestly whether this financial decision actually requires the weight you're giving it. Make one material decision today with genuine lightness, no extra gravity attached. Treat it as simple, because it may actually be simple. Notice that lightness here doesn't mean carelessness.`,
    },

    // ── 20 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '20_H': {
      title: `20 in Paternal Material — Judgement`,
      tagline: `A Design of the Answered Call`,
      mastery: `You carry real capacity to answer a bigger material calling, one that asks you to step into more than what's already familiar. You can hear the call clearly when it arrives, distinct from ordinary ambition. That capacity to actually answer, not just sense it, is a genuine inheritance. And once you step into it, the larger scope tends to fit rather than overwhelm you.`,
      shadow: `You inherit the postponement itself, sensing your own bigger potential and hesitating the same way your line always did. Underneath the hesitation is often a fear that answering the call would mean outgrowing the very people who modeled the hesitation. You hear the call clearly and then wait, indefinitely, for a readiness that never quite arrives. Years pass with the potential sensed but never actually pursued.`,
      invitation: `Ask yourself honestly what you're actually waiting to feel ready for. Take one real step today toward the material potential you've been sensing but not pursuing. Make it concrete and small enough to actually do today. Notice that the step doesn't require the full readiness you've been waiting for.`,
    },

    // ── 22 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '22_H': {
      title: `22 in Paternal Material — The Fool`,
      tagline: `A Design of the Reassessed Risk`,
      mastery: `You carry a real relationship to material trust and risk, capable of leaping into a financial decision without a total guarantee attached. You act on genuine readiness rather than waiting for certainty that never fully arrives. That willingness to leap was handed to you already-formed, a real inheritance of trust in your own judgment. And more often than not, the leap lands, because it was never actually blind.`,
      shadow: `You default to an inherited calibration of "too much" risk that may not actually fit your real circumstances at all. Underneath the borrowed calibration is often a fear that trusting your own read on risk would mean abandoning the caution the line relied on to survive. You measure every financial risk against a scale built for someone else's life, not yours. Opportunities your actual circumstances could support get declined on inherited terms.`,
      invitation: `Ask yourself honestly whether this risk feels too big by your own measure or by an inherited one. Reassess one material risk today with your own eyes, not the inherited caution. Run the actual numbers for your actual life before deciding. Notice whether the risk still looks the same once it's recalculated on your own terms.`,
    },

    // ── 7 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '7_I': {
      title: `7 in Maternal Material — The Chariot`,
      tagline: `A Design of Shared Steering`,
      mastery: `You carry real material resourcefulness and directed determination, keeping the practical vehicle of your life moving even under genuinely difficult conditions. You hold competing demands together and still get the household or the obligation where it needs to go. That drive was inherited already-formed, a real capacity from the maternal line. And you can sustain the momentum without it costing you everything else.`,
      shadow: `You inherit the belief that the only way to keep it moving is to drive it entirely alone, so real support goes reflexively refused. Underneath the refusal is often a fear that sharing the wheel would mean losing the control that's kept things from falling apart. You carry a load built for two hands as though it required only yours. The solo effort costs you an exhaustion that was never actually necessary.`,
      invitation: `Ask yourself honestly what letting someone else steer here would actually threaten. Let one material task today, a bill, a decision, a piece of the load, be shared instead of solely carried. Hand it over completely, not just partially. Notice that the vehicle keeps moving with someone else's hands on it too.`,
    },

    // ── 1 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '1_I': {
      title: `1 in Maternal Material — The Magician`,
      tagline: `A Design of Full Materials`,
      mastery: `You carry real capability for resourceful improvisation, generating material results from modest means without waiting for ideal conditions. You see the workable solution hiding inside limited resources faster than most. That capacity was handed to you already-formed, a genuine inheritance from a line that had to make things work. And you can produce real results this way without it ever feeling like scraping by.`,
      shadow: `You inherit a habit of making do so consistently that asking for adequate support feels like admitting failure. Underneath the refusal is often a fear that requesting enough would expose a need the line always managed silently. You improvise around a shortage that doesn't actually need to exist anymore. The workaround becomes the default even when the straightforward resource was available the whole time.`,
      invitation: `Ask yourself honestly what asking for adequate support would seem to say about your own capability. Ask for one adequate resource today before you're forced to improvise around its absence. Request the full amount, not the trimmed version you'd normally settle for. Notice that your resourcefulness survives having enough.`,
    },

    // ── 2 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '2_I': {
      title: `2 in Maternal Material — The High Priestess`,
      tagline: `A Design of the Shared Instinct`,
      mastery: `You carry real, intuitive practical management, a felt sense of what's needed before any obvious sign confirms it. You anticipate a material shortfall or opportunity while it's still forming. That instinct was inherited already-tuned, a genuine perceptual gift passed down the maternal line. And acting on it quietly still produces results that hold up when examined afterward.`,
      shadow: `You manage material matters quietly and alone, even when sharing the reasoning would genuinely help someone else understand or contribute. Underneath the silence is often a fear that explaining the instinct would somehow dissolve its accuracy. You announce the decision but withhold the thinking that produced it, leaving others unable to follow or challenge it. That opacity costs you real collaboration that was available.`,
      invitation: `Ask yourself honestly what explaining your reasoning here would actually risk. Voice one practical instinct out loud today before acting on it, instead of only announcing the result. Say the reasoning, not just the conclusion. Notice that the instinct doesn't lose its power by being spoken.`,
    },

    // ── 3 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '3_I': {
      title: `3 in Maternal Material — The Empress`,
      tagline: `A Design of Received Tending`,
      mastery: `You carry real material nurturing, an instinct for meeting practical needs for everyone around you before they have to ask. You notice what a household or family actually requires and supply it without fanfare. That capacity was handed to you already-formed, a genuine gift from the maternal line. And the people you tend this way are actually, materially, better off for it.`,
      shadow: `You provide for others' practical needs so automatically that your own go unnoticed, even by you. Underneath the blind spot is often a fear that naming your own needs would mean competing with the people you're supposed to be tending. You keep giving material care outward while your own account runs quietly empty. The depletion goes unaddressed because attending to it was never modeled as an option.`,
      invitation: `Ask yourself honestly what material need of your own you've stopped noticing you have. Let one of your own material needs be tended today, as visibly as you tend everyone else's. Name it out loud to someone, not just to yourself. Notice that meeting it doesn't take anything away from the people you usually tend.`,
    },

    // ── 4 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '4_I': {
      title: `4 in Maternal Material — The Emperor`,
      tagline: `A Design of Named Authority`,
      mastery: `You carry real material organizational authority, holding the practical structure of a household or family together through consistent, competent management. You track what needs to happen and make sure it does, without needing the title of "leader" to do it well. That capacity was inherited already-formed, a genuine strength passed down the maternal line. And the structure you maintain actually functions, whether or not anyone names it as leadership.`,
      shadow: `You carry that organizational weight unacknowledged, including by yourself, because it was never framed as leadership in the first place. Underneath the lack of acknowledgment is often a fear that claiming the authority openly would look like overreaching a role that was supposed to stay invisible. You do the actual work of running things while deferring credit or decision-making status to someone else. The mismatch between your real authority and its recognition costs you both respect and support.`,
      invitation: `Ask yourself honestly what naming this authority out loud would actually risk. Name your organizational role today, out loud, to yourself, as the real authority it actually is. Say it plainly to at least one other person too. Notice that claiming it doesn't make you less capable of holding it.`,
    },

    // ── 5 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '5_I': {
      title: `5 in Maternal Material — The Hierophant`,
      tagline: `A Design of Named Expertise`,
      mastery: `You carry real, embedded practical wisdom, skills passed down through doing rather than through formal teaching. You know how to handle real material situations because you watched them handled, over and over, until the knowledge became yours. That competence runs deep precisely because it was earned through lived repetition, not a course. And it holds up under pressure in ways certified knowledge sometimes doesn't.`,
      shadow: `You dismiss your own practical capability as "just common sense" because no one ever certified it as expertise. Underneath the dismissal is often a fear that claiming it as real skill would sound like overstating something ordinary. You undersell what you actually know how to do, deferring to people with credentials even when your judgment is sounder. That undervaluing costs you both recognition and the compensation your actual expertise would command.`,
      invitation: `Ask yourself honestly what this skill would be called if someone else had learned it in a classroom. Name one untaught skill of yours today as the real expertise it actually is. Say it in those exact terms, expertise, not just experience. Notice that naming it doesn't make it any less earned.`,
    },

    // ── 6 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '6_I': {
      title: `6 in Maternal Material — The Lovers`,
      tagline: `A Design of Chosen Priority`,
      mastery: `You carry a real, values-driven sense of what genuinely matters materially, able to direct resources toward what actually counts rather than what's merely urgent. You weigh competing needs and land on an allocation that reflects real priority. That discernment was inherited already-formed, a genuine gift from the maternal line. And the choices it produces tend to hold up well after the fact, not just in the moment.`,
      shadow: `You default to the same material allocations because that's the pattern you watched, not because you've consciously chosen it yourself. Underneath the default is often a fear that choosing differently would mean rejecting the values the pattern was built to express. You repeat the exact spending or saving priorities modeled for you without checking whether they fit your actual life. The unexamined repetition can quietly cost you years of misallocated resources.`,
      invitation: `Ask yourself honestly whether this material priority is genuinely yours or simply the one you watched modeled. Name today the one material priority you actually watched get modeled, and decide if it's genuinely yours. Adjust one allocation if it isn't. Notice that changing it doesn't dishonor where it came from.`,
    },

    // ── 8 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '8_I': {
      title: `8 in Maternal Material — Justice`,
      tagline: `A Design of the Included Share`,
      mastery: `You carry a real, careful sense of equitable material distribution, able to divide resources so everyone actually gets a fair share. You notice when an allocation is genuinely unbalanced and correct it. That fairness was inherited already-formed, a real ethical instinct from the maternal line. And the people around you can trust the distribution because it's actually accurate, not just well-intentioned.`,
      shadow: `You apply that fairness so rigidly to others that you consistently leave yourself off your own accounting. Underneath the omission is often a fear that including yourself in the fair share would tip the balance you're responsible for keeping. You track everyone else's portion with precision while your own goes uncounted. The pattern leaves you materially shorted by your own hand, repeatedly.`,
      invitation: `Ask yourself honestly when you last actually counted yourself in a fair division. Include yourself today in one fair share you'd normally give away first. Take the portion before offering the rest. Notice that including yourself doesn't make the distribution any less fair.`,
    },

    // ── 9 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '9_I': {
      title: `9 in Maternal Material — The Hermit`,
      tagline: `A Design of Accompanied Competence`,
      mastery: `You carry real practical self-sufficiency, handling material needs independently and competently, without it curdling into isolation. You manage what needs managing without waiting on anyone else to step in. That capacity was inherited already-formed, a genuine strength from the maternal line. And you can be self-sufficient while still letting people stay close to you.`,
      shadow: `You refuse material help even when your actual circumstances no longer demand total independence. Underneath the refusal is often a fear that accepting help would mean the self-sufficiency itself was never as solid as it seemed. You handle things alone that would genuinely go easier or better shared. The independence becomes a habit maintained past its usefulness, at real cost to you.`,
      invitation: `Ask yourself honestly what accepting help here would actually cost the self-sufficiency you've built. Let one material task today be witnessed or shared, instead of handled alone by default. Invite someone in on it explicitly. Notice that the self-sufficiency survives being shared once.`,
    },

    // ── 10 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '10_I': {
      title: `10 in Maternal Material — Wheel of Fortune`,
      tagline: `A Design of Received Stability`,
      mastery: `You carry real material resilience, weathering financial instability without being undone by it. You keep functioning through a downturn that would knock other people flat. That endurance was inherited already-proven, tested through real instability the maternal line actually survived. And when stability returns, you're able to use it rather than simply waiting for it to end.`,
      shadow: `You stay braced for the next downturn even during periods of genuine security, unable to relax into good fortune when it actually arrives. Underneath the bracing is often a fear that trusting stability would leave you unprepared when it inevitably breaks. You treat every calm period as merely the lull before collapse. The vigilance costs you a present-tense ease your actual circumstances would otherwise support.`,
      invitation: `Ask yourself honestly whether this bracing matches your current situation or an inherited expectation. Let yourself actually trust one piece of current material stability today, instead of bracing for its end. Spend or rest into it without the usual caveat. Notice that trusting it once doesn't summon the collapse you're expecting.`,
    },

    // ── 11 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '11_I': {
      title: `11 in Maternal Material — Strength`,
      tagline: `A Design of Named Softness`,
      mastery: `You carry real, gentle material endurance, a resilience that never needed to look fierce to be genuine. You hold steady through practical hardship without hardening into something brittle. That quiet strength was inherited already-formed, a real capacity from the maternal line. And it outlasts more visibly aggressive forms of toughness because it doesn't burn out the same way.`,
      shadow: `You mistake your own steadiness for fragility because it doesn't look like the conventional toughness you were taught to recognize as real strength. Underneath the mistake is often a fear that naming it as strength would sound like overclaiming something soft. You discount your own endurance every time it doesn't announce itself loudly. That discounting costs you the credit and confidence your actual resilience has earned.`,
      invitation: `Ask yourself honestly what you'd call this endurance if it showed up louder. Name your gentle endurance today as the real strength it is, to yourself, out loud. Use the word "strength" specifically, not a softer substitute. Notice that saying it doesn't make it any less gentle.`,
    },

    // ── 12 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '12_I': {
      title: `12 in Maternal Material — The Hanged Man`,
      tagline: `A Design of the Small Push`,
      mastery: `You carry real material patience, trusting that circumstances will shift even without a clear timeline attached. You can hold a difficult financial situation without forcing a premature resolution. That trust was inherited already-formed, a genuine steadiness from the maternal line. And when the moment to act actually arrives, you're able to recognize and take it.`,
      shadow: `You stay suspended in old waiting out of habit, even once new options have actually become available to you. Underneath the habit is often a fear that acting now would mean the earlier waiting was wasted or wrong. You keep treating a resolved situation as still stuck, missing the moment it quietly opened up. Real opportunities pass by while you're still waiting for a signal that already arrived.`,
      invitation: `Ask yourself honestly whether this situation is actually still stuck or just habitually treated that way. Give one stuck material situation today the small push it's actually ready for. Take the smallest possible action rather than the full leap. Notice that the situation moves once you stop waiting for permission.`,
    },

    // ── 13 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '13_I': {
      title: `13 in Maternal Material — Transformation`,
      tagline: `A Design of Early Renovation`,
      mastery: `You carry real capacity for material rebuilding, reconstructing a practical life after genuine loss without losing your footing entirely. You can start over from very little and produce something functional again. That rebuilding capacity was inherited already-proven, tested through real reconstruction the maternal line actually did. And what you rebuild tends to be sturdier for having been rebuilt deliberately.`,
      shadow: `You treat repeated collapse as simply normal, instead of something worth actively preventing before it happens again. Underneath the normalization is often a fear that trying to prevent it would be tempting a fate that seems to run in the line. You let structures erode because rebuilding, however costly, feels more familiar than maintaining. The pattern repeats because prevention was never actually modeled as an option.`,
      invitation: `Ask yourself honestly what maintaining, instead of eventually rebuilding, would actually require of you now. Renovate or secure one thing today that's still standing, before it needs rebuilding. Do the small maintenance now, while it's still cheap and easy. Notice that prevention doesn't require the same crisis energy rebuilding does.`,
    },

    // ── 14 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '14_I': {
      title: `14 in Maternal Material — Temperance`,
      tagline: `A Design of Unstretched Margin`,
      mastery: `You carry a real skill for stretching limited resources to cover genuine needs, making modest means go further than they should be able to. You can meet a real shortfall without panic, drawing on a resourcefulness that's been tested before. That skill was inherited already-formed, a genuine gift from the maternal line. And it means you're rarely caught with nothing when circumstances actually get tight.`,
      shadow: `You keep stretching resources that don't need stretching anymore, stuck in old scarcity-mode habits your current circumstances have outgrown. Underneath the habit is often a fear that spending normally would be tempting a shortage that's no longer actually present. You ration what's actually abundant, treating every purchase as though margin were still thin. The unnecessary stretching costs you a present-tense ease your real resources would support.`,
      invitation: `Ask yourself honestly whether this margin is actually needed or simply an old habit running unchecked. Let your actual current resources, not the old scarcity habit, decide one spending choice today. Spend the full, unstretched amount on it. Notice that spending normally once doesn't summon the shortage back.`,
    },

    // ── 15 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '15_I': {
      title: `15 in Maternal Material — The Devil`,
      tagline: `A Design of the Named Dependence`,
      mastery: `You carry a real, honest capacity to see material dependence clearly, whichever direction it actually runs in a given relationship. You can name who genuinely relies on whom instead of pretending the dynamic isn't there. That clarity lets you choose interdependence deliberately rather than falling into it by default. And naming the dynamic out loud tends to loosen its grip rather than tighten it.`,
      shadow: `You repeat an inherited dependence dynamic without examining it, either accepting unwanted dependence or resisting genuinely helpful support. Underneath the repetition is often a fear that questioning the pattern would destabilize the whole relationship it's embedded in. You slot into the same role, dependent or depended-upon, without checking whether it actually fits your current life. The pattern runs unexamined because naming it feels riskier than simply living inside it.`,
      invitation: `Ask yourself honestly which side of this dependence you default into without deciding to. Name the specific dependence dynamic you inherited today, and decide what healthy interdependence actually looks like now. Say it plainly, even just to yourself. Notice that naming it doesn't force an immediate change, only honesty.`,
    },

    // ── 16 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '16_I': {
      title: `16 in Maternal Material — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real material resilience, having survived, or descended from someone who survived, a genuine financial or practical collapse. You can rebuild on solid ground once an old structure is actually gone, without needing the illusion of permanence to function. That clear-eyed rebuilding is a real inheritance, proven through what the line actually endured. And what you build afterward tends to be sturdier than what came before it.`,
      shadow: `You carry disproportionate anxiety around material stability that doesn't match your own current situation at all. Underneath the anxiety is often a fear that stability itself is temporary, since it was for the line before you. You brace for a collapse that isn't actually coming, reading ordinary uncertainty as impending disaster. The bracing costs you a present-tense calm your real circumstances would otherwise support.`,
      invitation: `Ask yourself honestly whether this fear belongs to your present circumstances or an inherited past one. Ask today, even speculatively, what material collapse in your mother's line was never fully discussed. Write it down or say it to someone, however incomplete the picture is. Notice whether the anxiety loosens once it has an actual source attached to it.`,
    },

    // ── 17 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '17_I': {
      title: `17 in Maternal Material — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry real material hope, a genuine capacity for renewal even after hard circumstances have tested it. You can imagine a better financial future without it feeling naive or unearned. That hopefulness was handed to you already-formed, a real inheritance rather than blind optimism. And it lets you keep building toward something larger even after a setback.`,
      shadow: `You pre-emptively scale down your material aspirations to a modest ceiling that no longer fits your actual circumstances. Underneath the scaling-down is often a fear that wanting more than the line ever had would be its own kind of betrayal. You round your goals down before you've even tested what's actually possible for you now. The discount happens automatically, so quietly you may not notice you're applying it.`,
      invitation: `Ask yourself honestly what number or goal you'd name if the inherited ceiling didn't apply. Let one material hope be named today at its full, untrimmed size. Say the real version, not the modest one you'd normally offer. Notice whether the full-sized version actually feels impossible or just unfamiliar.`,
    },

    // ── 18 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '18_I': {
      title: `18 in Maternal Material — The Moon`,
      tagline: `A Design of the Distinguished Worry`,
      mastery: `You carry real material sensitivity, a felt attunement to financial risk before it's fully visible in the numbers. You pick up on the early signal, the shift in a situation before it's confirmed. That instinct was inherited already-tuned, a genuine perceptual gift rather than generic worry. And when you trust it and check it against reality, it proves reliable more often than not.`,
      shadow: `You carry diffuse material anxiety that doesn't clearly attach to your own current circumstances at all. Underneath the diffuseness is often a fear that naming the actual source would make it too real to manage. You feel unsettled about money without being able to say specifically why, absorbing worry that may have started with someone else. The anxiety never resolves because it was never actually about anything in your own life.`,
      invitation: `Ask yourself honestly which piece of this financial worry is actually yours. Distinguish today which piece of your financial worry is genuinely yours versus simply absorbed. Set down the part that was never actually yours to carry. Notice whether the remaining worry feels smaller and more workable.`,
    },

    // ── 19 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '19_I': {
      title: `19 in Maternal Material — The Sun`,
      tagline: `A Design of Honest Warmth`,
      mastery: `You carry real, resilient warmth, maintaining genuine vitality and joy even through material difficulty. You can hold hard financial circumstances and still access real lightness, not as denial but as an actual, sustained capacity. That warmth was inherited already-formed, a real strength from the maternal line. And it means hardship doesn't get to define the whole emotional tone of your life.`,
      shadow: `You perform positivity through real financial strain instead of naming the difficulty directly to the people around you. Underneath the performance is often a fear that showing the actual strain would extinguish the warmth that's supposed to hold everything together. You maintain a cheerful surface while the real difficulty goes unspoken and unaddressed. The gap between the performance and the reality leaves you carrying the strain alone.`,
      invitation: `Ask yourself honestly what naming this difficulty directly would actually cost the warmth you maintain. Name one material difficulty directly today, without covering it with performed warmth. Say the plain, unvarnished version to someone you trust. Notice that the warmth survives one honest, unperformed moment.`,
    },

    // ── 20 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '20_I': {
      title: `20 in Maternal Material — Judgement`,
      tagline: `A Design of the Claimed Potential`,
      mastery: `You carry real material potential, a capability that's been sensed clearly even where circumstance kept it from being fully claimed. You can hear the call to something bigger, distinct from ordinary ambition. That capacity to actually recognize it, not just sense it vaguely, is a genuine inheritance. And once your actual circumstances allow it, that potential is ready to be claimed rather than rebuilt from scratch.`,
      shadow: `You inherit the postponement itself, holding back on real potential the same way the line always did, without ever examining why. Underneath the hesitation is often a fear that claiming the potential would mean outgrowing the very circumstances that shaped you. You hear the call clearly and then wait, indefinitely, for a readiness that never quite arrives. Years pass with the potential sensed but never actually pursued.`,
      invitation: `Ask yourself honestly what you're actually waiting to feel ready for. Take one real step today toward the material potential your circumstances would actually now allow. Make it concrete and small enough to actually do today. Notice that the step doesn't require the full readiness you've been waiting for.`,
    },

    // ── 21 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '21_I': {
      title: `21 in Maternal Material — The World`,
      tagline: `A Design of Current Enoughness`,
      mastery: `You carry a real, settled sense of material sufficiency, able to feel genuine contentment without needing excess to get there. You recognize when you actually have enough instead of chasing a moving target. That settledness was inherited already-formed, a real wisdom from the maternal line. And it lets you enjoy what you have instead of perpetually reaching past it.`,
      shadow: `You settle for less than what's actually available now because "enough" was calibrated to circumstances that no longer apply. Underneath the miscalibration is often a fear that wanting more than the old "enough" would be a kind of ingratitude toward what the line survived on. You accept a smaller share than your current life could actually support. The old ceiling stays in place long after the circumstances that set it have changed.`,
      invitation: `Ask yourself honestly whether this "enough" reflects your current life or an old, inherited calibration. Recount today, honestly, what you already have that qualifies as enough right now. Let the number reflect your actual present circumstances, not the old one. Notice whether your real "enough" is larger than the one you've been living by.`,
    },

    // ── 22 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '22_I': {
      title: `22 in Maternal Material — The Fool`,
      tagline: `A Design of the Chosen Leap`,
      mastery: `You carry real material courage, capable of taking a practical chance when circumstances genuinely call for it. You act without needing every guarantee lined up first. That willingness to leap was handed to you already-formed, a real inheritance of trust in your own judgment. And more often than not, the leap lands, because it was never actually reckless.`,
      shadow: `You take risks reactively out of old urgency, rather than choosing them deliberately from a place of actual stability. Underneath the reactivity is often a fear that waiting for genuine stability would mean the opportunity, or the crisis, would pass you by regardless. You leap because something feels urgent, not because you've actually assessed the moment. The pattern costs you the steadier, more considered version of the same courage.`,
      invitation: `Ask yourself honestly whether this urgency is real or an old, inherited reflex. Meet one mattering moment today by genuine, deliberate choice rather than inherited urgency. Pause long enough to actually decide, rather than simply react. Notice that the courage still shows up even without the old urgency driving it.`,
    },

    // ── 1 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '1_MK': {
      title: `1 in Material Karma — The Magician`,
      tagline: `A Design of the Matured Plan`,
      mastery: `You carry a genuine gift for origination, starting something financial from nothing, again and again, when others hesitate. That capacity to generate a real venture from scratch is a rare, valuable skill. You can spot an opportunity and act on it before it's fully validated by anyone else. And you're capable of letting one plan actually mature into compounding value, once you commit to staying with it.`,
      shadow: `You mistake the next fresh start for progress, resetting your position right before it would have actually started to compound. Underneath the resetting is often a fear that staying with a maturing plan past its exciting beginning would mean facing the slower, harder work of building it out. You launch financial plans at a rate that outpaces your capacity to let any of them mature. The pattern costs you the compounding value a matured plan would have already produced.`,
      invitation: `Ask yourself honestly which financial plan you're already tempted to abandon for something newer. Choose today the material plan already underway, and don't start a new one until it's had real time to mature. Commit to it deliberately, past the point of novelty. Notice that staying doesn't cost you your capacity to originate elsewhere later.`,
    },

    // ── 2 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '2_MK': {
      title: `2 in Material Karma — The High Priestess`,
      tagline: `A Design of the Seen Numbers`,
      mastery: `You carry a quiet, private sense for your own financial reality, an intuitive read that's often more accurate than you credit it for. That inner sense tends to pick up something real about your situation before the numbers confirm it. You're capable of trusting that sense as a genuine signal, not just background noise. And writing the actual numbers down sharpens that sense rather than replacing it.`,
      shadow: `You keep the real numbers unexamined even by yourself, sensed vaguely but never looked at directly on paper. Underneath the avoidance is often a fear that seeing the actual figures would confirm something worse than the vague sense currently suggests. You let a private, sensed version of your finances stand in for the concrete facts. The avoidance costs you the clarity and control that seeing the real numbers would actually provide.`,
      invitation: `Ask yourself honestly what actual number you've been avoiding looking at directly. Write down your actual financial numbers today, in full, and let them be seen. Do it in writing, not just mentally. Notice whether the real numbers are more or less alarming than the sensed version.`,
    },

    // ── 3 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '3_MK': {
      title: `3 in Material Karma — The Empress`,
      tagline: `A Design of the Included Reserve`,
      mastery: `You carry real warmth expressed through material generosity, sharing resources freely and easily with people around you. That generosity is a genuine strength, and the richness you create for others is real, not performative. You're capable of extending that same generosity to your own future, not just the present moment. And setting aside a reserve for yourself doesn't require sacrificing the generosity you're actually good at.`,
      shadow: `That generosity flows outward while your own reserve stays thin and unattended, quietly under-tended relative to everyone else's. Underneath the thinness is often a fear that saving for yourself would compete with the generosity that feels like your core identity. You give easily to others while your own future goes unfunded. The thin reserve costs you a security your generosity, redirected slightly, could easily also build.`,
      invitation: `Ask yourself honestly what portion of your giving has gone outward without any going toward your own security. Set aside a portion of any material gain today for your own security first. Treat it with the same ease you'd apply to any other giving. Notice that saving for yourself doesn't make you less generous.`,
    },

    // ── 4 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '4_MK': {
      title: `4 in Material Karma — The Emperor`,
      tagline: `A Design of the Tested Structure`,
      mastery: `You carry a real, firm hand over every financial detail, keeping your accounts organized in a way that actually holds up. That structural discipline is a genuine strength, and your finances tend to be well-managed as a result. You're capable of delegating a piece of that management without the structure collapsing. And trusting a system or person with part of the oversight doesn't undo the discipline you've already built.`,
      shadow: `Delegating or trusting a system you didn't build yourself feels like real danger rather than a reasonable, low-stakes option. Underneath the fear is often a belief that anything you don't personally control will inevitably go wrong. You hold every financial thread yourself, even the ones a trusted system could easily and safely handle. The constant holding costs you time and ease that real, tested delegation would free up.`,
      invitation: `Ask yourself honestly what piece of financial management you could actually hand off. Hand one specific piece of financial management today to a trusted system or person, and observe whether it holds. Delegate it fully, not just partially. Notice that the structure holds even without your hand on every single piece.`,
    },

    // ── 5 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '5_MK': {
      title: `5 in Material Karma — The Hierophant`,
      tagline: `A Design of the Tested Belief`,
      mastery: `You carry a real deference to inherited financial rules and tradition, grounding your choices in something proven rather than impulse. That grounding is a genuine strength, keeping your financial decisions consistent with real, tested values. You're capable of testing an inherited rule honestly instead of following it automatically. And updating a rule that no longer fits doesn't mean abandoning the tradition underneath it.`,
      shadow: `You follow an outdated financial rule simply because it's familiar, even when it actively works against your current, real security. Underneath the following is often a fear that deviating from the inherited rule would mean betraying the tradition it came from. You apply an old standard automatically without checking whether it actually fits your present circumstances. The automatic application costs you outcomes a tested, updated rule would have actually allowed.`,
      invitation: `Ask yourself honestly which financial rule you follow automatically without ever having tested it. Name one inherited belief about money today, and test it against your current, actual circumstances. Examine it directly instead of assuming it. Notice that updating the rule doesn't mean discarding the tradition entirely.`,
    },

    // ── 6 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '6_MK': {
      title: `6 in Material Karma — The Lovers`,
      tagline: `A Design of the Standing Choice`,
      mastery: `You carry a real capacity to weigh a genuine financial choice thoughtfully, considering the real trade-offs rather than deciding blindly. That deliberateness is a genuine strength, and your financial choices tend to be well-reasoned when you actually make them. You're capable of committing to a decision without full certainty, once you notice you've been avoiding it. And a decided, imperfect choice serves you better than an indefinitely deferred one.`,
      shadow: `You defer the choice that would actually serve your security in favor of whatever keeps things comfortable in the short term. Underneath the deferring is often a fear that committing to a real choice would foreclose some better option you haven't found yet. You keep a decision technically pending indefinitely, mistaking the delay for careful weighing. The deferring costs you the security a decided, even imperfect, choice would already have provided.`,
      invitation: `Ask yourself honestly what financial decision you've been deferring under the guise of careful consideration. Make one specific, deferred financial decision today, even without full certainty, and let it stand. Pick an actual answer and commit to it. Notice that an imperfect decided choice beats an indefinitely deferred one.`,
    },

    // ── 7 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '7_MK': {
      title: `7 in Material Karma — The Chariot`,
      tagline: `A Design of the Named Enough`,
      mastery: `You carry real drive toward financial goals, one after another, sustaining momentum most people can't match. That drive is a genuine strength, and it means your financial trajectory rarely goes stagnant. You're capable of pausing at an actual milestone once reached, rather than needing to chase the next one immediately. And declaring a specific point as "enough" doesn't diminish the drive, it just gives it a place to actually land.`,
      shadow: `The sense of "enough" always sits just past the next milestone, so genuine progress never actually registers as progress. Underneath the constant relocation is often a fear that declaring something enough would mean the drive itself has nothing left to justify it. You hit a real financial target and immediately move the marker further out, before the achievement has registered. The relocation costs you the satisfaction real, already-reached milestones are actually capable of providing.`,
      invitation: `Ask yourself honestly which recent financial milestone you never actually let count as enough. Name one specific financial milestone today as "enough," and pause there deliberately once reached. Stop and register it before pursuing the next one. Notice that the pause doesn't cost you your future drive.`,
    },

    // ── 8 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '8_MK': {
      title: `8 in Material Karma — Justice`,
      tagline: `A Design of the Named Unfairness`,
      mastery: `You carry a real, sharp vigilance around fairness in financial exchange, noticing an imbalance others would miss entirely. That vigilance is a genuine strength, keeping your financial dealings honest and protecting you from real exploitation. You're capable of applying that vigilance accurately to the present situation, not an old one. And naming the original unfairness explicitly lets you separate it cleanly from what's actually happening now.`,
      shadow: `You treat every current exchange as a potential repeat of an old unfairness that has nothing to do with what's actually happening in front of you. Underneath the projection is often a fear that the original unfairness will never be acknowledged unless every echo of it gets fought as hard as the first one should have been. You escalate a minor present exchange with the full force of an old, unaddressed grievance. The projection costs you fair, ordinary financial relationships that don't deserve the old suspicion.`,
      invitation: `Ask yourself honestly whether this reaction fits the present exchange or an older one underneath it. Name, specifically, what the original financial unfairness was today, and separate it from what's actually in front of you. Write it down or say it out loud, however incomplete the picture is. Notice whether the present reaction settles once the old one has a name.`,
    },

    // ── 9 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '9_MK': {
      title: `9 in Material Karma — The Hermit`,
      tagline: `A Design of the Direct Look`,
      mastery: `You carry a real preference for withdrawing to think through a financial matter alone before engaging with it directly. That preference for reflection is a genuine strength, letting you approach money decisions from a settled place. You're capable of setting a limited, bounded time to actually look directly at your finances, rather than avoiding them indefinitely. And a real, direct look tends to be less unsettling than the avoidance that preceded it.`,
      shadow: `Unexamined finances drift, and the avoidance that once felt like peace becomes its own quiet, compounding stress over time. Underneath the drift is often a fear that a direct look would confirm something worse than the vague unease currently suggests. You retreat from financial engagement indefinitely, mistaking permanent avoidance for the healthy reflection it started as. The drift costs you the clarity a bounded, direct look would have already provided.`,
      invitation: `Ask yourself honestly what financial reality you've been avoiding by staying withdrawn from it. Set aside one specific, limited block of time today to look directly at your actual financial state. Bound it clearly, so it feels manageable rather than overwhelming. Notice that the direct look is usually less alarming than the avoidance made it seem.`,
    },

    // ── 10 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '10_MK': {
      title: `10 in Material Karma — Wheel of Fortune`,
      tagline: `A Design of the Steady Habit`,
      mastery: `You carry real financial cycles, genuine upswings and downturns, rather than a flat, unvarying line. You can work with that natural rhythm rather than fighting it, adapting to whichever phase you're actually in. That comfort with fluctuation is a genuine strength, letting you weather a downturn without panic. And you're capable of building one small, consistent habit that holds steady through the cycle, adding a floor underneath the natural rhythm.`,
      shadow: `You treat every upswing as permanent and every downturn as catastrophic, letting the cycle itself dictate every decision you make. Underneath the reactivity is often a fear that this particular fluctuation is different from all the others, the one that won't actually turn. You make major decisions based on wherever you currently are in the cycle, rather than on a steady, underlying plan. The reactivity costs you the consistency a habit-based floor would have provided regardless of the phase.`,
      invitation: `Ask yourself honestly what decision you're making based on the current cycle phase rather than a steady plan. Build one small, consistent financial habit today that holds steady regardless of which phase you're in. Choose something modest enough to actually maintain either way. Notice that the habit doesn't erase the natural rhythm, it just adds ground underneath it.`,
    },

    // ── 11 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '11_MK': {
      title: `11 in Material Karma — Strength`,
      tagline: `A Design of the Spoken Strain`,
      mastery: `You carry real financial hardship quietly, managed alone with genuine, tested endurance through difficult periods. That capacity to hold real strain without collapsing is a genuine strength, proven under actual pressure. You're capable of naming the strain out loud to someone trusted, without that undoing the resilience you've already shown. And visibility tends to bring help the quiet endurance alone never could.`,
      shadow: `That strain never gets addressed, since no one close to you actually knows the real extent of it. Underneath the silence is often a fear that revealing the strain would mean admitting the endurance was costing more than it looked like from outside. You carry the full weight privately, and the strain compounds because it's never actually shared or addressed. The silence costs you the support that was likely available the whole time.`,
      invitation: `Ask yourself honestly what financial strain you've been carrying without anyone actually knowing its real extent. Name your actual financial strain out loud today to one trusted person. Say the real number or the real worry, not a softened version. Notice that being seen struggling doesn't undo the endurance you've already proven.`,
    },

    // ── 12 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '12_MK': {
      title: `12 in Material Karma — The Hanged Man`,
      tagline: `A Design of the Real Deadline`,
      mastery: `You carry real patience with a financial decision, willing to hold off for genuine clarity rather than forcing a premature call. That patience is a real strength when the timing genuinely isn't right yet. You're capable of recognizing when the waiting has actually served its purpose and giving the decision a real deadline. And a deadline doesn't undo the value of the patience that preceded it.`,
      shadow: `Material comfort gets quietly sacrificed while the wait mistakes itself for necessary patience, rather than actual avoidance. Underneath the mistake is often a fear that committing to a real choice would foreclose some better option you haven't found yet. You leave a financial decision suspended indefinitely, with no deadline ever attached to it. The indefinite suspension costs you comfort and progress a decided, even imperfect, choice would already have provided.`,
      invitation: `Ask yourself honestly whether you're actually waiting for clarity or just avoiding the decision. Name the specific financial decision that's been suspended today, and set a real point by which it gets made. Pick an actual date and commit to deciding by then. Notice how it feels to have a decision that can't drift forever.`,
    },

    // ── 13 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '13_MK': {
      title: `13 in Material Karma — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You carry a real capacity for material reinvention, once you actually let a finished arrangement genuinely end. You can recognize precisely when a financial chapter is over, even when admitting it is uncomfortable. That capacity for deliberate endings is a real strength, correcting the instinct to resist them out of fear. And what replaces a released arrangement tends to serve you better than what you were protecting by holding on.`,
      shadow: `You hold onto a financial arrangement well past its useful life simply because ending it feels dangerous in a way you can't quite name. Underneath the fear is often a belief that any material loss, even a small or overdue one, threatens your whole financial footing. You maintain something you privately know is finished, avoiding a loss that's actually already happened in substance. The holding costs you the space and clarity a deliberate ending would free up.`,
      invitation: `Ask yourself honestly what financial arrangement you already privately know has run its course. Identify one financial arrangement today that's clearly run its course, and let it end deliberately. Name it as over, in plain terms, rather than letting it drift. Notice that ending it doesn't erase what it once gave you.`,
    },

    // ── 14 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '14_MK': {
      title: `14 in Material Karma — Temperance`,
      tagline: `A Design of the Sustainable Middle`,
      mastery: `You carry a real capacity for both strict financial discipline and full release, able to access either mode when it's actually needed. That range is a real strength, distinct from most people who only manage one extreme well. You're capable of finding the sustainable middle between the two, once you notice the alternation isn't producing lasting security. And a small, consistently held habit tends to beat either extreme held alone.`,
      shadow: `Neither extreme held alone ever actually produces lasting security, with restriction breaking into release and back again on repeat. Underneath the alternation is often a fear that the steady middle ground doesn't actually exist, that only swinging between the two poles is realistic. You cycle between strict control and full indulgence, never landing on a sustainable habit in between. The cycling costs you the compounding security a steady, moderate practice would have actually built.`,
      invitation: `Ask yourself honestly whether you're currently in restriction or release, and what a steady middle would look like. Choose one small, moderate financial habit today and hold it consistently, resisting either extreme. Pick something modest enough to actually maintain. Notice that the middle holds steadier ground than either extreme did alone.`,
    },

    // ── 15 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '15_MK': {
      title: `15 in Material Karma — The Devil`,
      tagline: `A Design of the Loosened Bind`,
      mastery: `You carry a real, honest capacity to notice when you're bound to a financial obligation or a lifestyle you didn't fully choose. That noticing is a genuine strength, letting you catch a pattern before it fully runs your finances. You're capable of naming the attachment plainly and asking what would actually be required to loosen it. And examining it honestly tends to loosen the grip rather than tightening it.`,
      shadow: `You mistake that compulsive attachment for a fixed reality, when it may actually be an unquestioned pattern you've never examined. Underneath the mistake is often a fear that naming the attachment honestly would mean confronting how much control it actually has over your choices. You live around the obligation, accommodating it, rather than questioning whether it's genuinely necessary. The unexamined attachment costs you the freedom that naming it would have already started to restore.`,
      invitation: `Ask yourself honestly what financial attachment feels like a trap that you've never actually questioned. Name honestly today one specific material attachment that feels like a trap, and ask what it would take to loosen it. Examine it directly instead of assuming it's fixed. Notice that examining it doesn't require escaping it immediately, just questioning it.`,
    },

    // ── 16 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '16_MK': {
      title: `16 in Material Karma — The Tower`,
      tagline: `A Design of the Early Correction`,
      mastery: `You carry a real instinct to maintain financial stability under pressure, projecting calm through genuinely difficult periods. That instinct for stability is a genuine strength, and it's kept real crises from developing in the past. You're capable of identifying the strain underneath a stable appearance and addressing it directly, before it forces a sudden reversal. And addressing the strain early actually protects the stability, rather than threatening it.`,
      shadow: `Maintaining the appearance of stability instead of addressing the strain underneath sets up exactly the collapse the maintaining was trying to avoid. Underneath the maintained appearance is often a fear that acknowledging the real strain would collapse the stability you've worked so hard to project. You keep the surface calm while an underlying financial problem compounds, unaddressed, until it can't be contained. The maintained appearance costs you the chance to address the strain while it was still manageable.`,
      invitation: `Ask yourself honestly what financial strain you've been minimizing under a stable-looking surface. Identify one financial strain being minimized today, and address it directly. Name it plainly and take one concrete action toward it. Notice that addressing it early doesn't cause the collapse you were protecting against.`,
    },

    // ── 17 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '17_MK': {
      title: `17 in Material Karma — The Star`,
      tagline: `A Design of the Acted Hope`,
      mastery: `You carry a genuine, sustaining belief that things will get better financially, hope that isn't naive but grounded in real possibility. That capacity for real hope is a genuine strength, keeping you moving through hard financial periods. You're capable of naming the concrete action the hope is actually pointing toward. And converting the hope into action, however small, tends to make it more, not less, likely to come true.`,
      shadow: `That hope hasn't yet converted into the concrete action it was actually meant to inspire, staying purely internal instead. Underneath the non-conversion is often a fear that acting on the hope and having it not pay off would be worse than simply holding the belief privately. You hold onto genuine optimism while the specific step it implies stays untaken. The non-conversion costs you the progress this hope, actually acted on, would have already produced.`,
      invitation: `Ask yourself honestly what concrete action your financial hope has been quietly pointing toward. Name one small, concrete action your financial hope is actually pointing toward today, and take it. Do the specific thing, not just hold the belief. Notice that acting on it doesn't risk the hope, it tests it.`,
    },

    // ── 18 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '18_MK': {
      title: `18 in Material Karma — The Moon`,
      tagline: `A Design of the Cleared Haze`,
      mastery: `You carry a real, felt sense of your financial position, an intuitive read that picks up on a shift before it's confirmed. That sensitivity is a genuine strength, an early-warning system that often catches something real. You're capable of checking that felt sense directly against the actual figures, which sharpens its accuracy rather than dismissing it. And looking directly at an avoided number tends to be less frightening than the anxiety about it.`,
      shadow: `The anxiety persists precisely because it's never actually checked against real numbers, staying vague and unresolved indefinitely. Underneath the persistence is often a fear that checking would confirm something worse than the vague dread currently suggests. You let the anxious sense run without ever comparing it to the actual, checkable facts. The avoidance costs you the relief that an accurate, checked number would likely provide.`,
      invitation: `Ask yourself honestly what specific financial number you've been avoiding looking at directly. Look directly today at one specific, avoided financial number, and let the actual figure replace the guess. Check it plainly, without a story attached in advance. Notice whether the actual number is less alarming than the anxiety about it.`,
    },

    // ── 19 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '19_MK': {
      title: `19 in Material Karma — The Sun`,
      tagline: `A Design of Visible Uncertainty`,
      mastery: `You carry a real, outward financial confidence, maintained consistently even through genuinely uncertain periods. That confidence is a real strength, keeping panic from taking over during ordinary financial fluctuation. You're capable of letting a real worry be visible too, without that undoing the confidence you're known for. And visible worry, shared with someone trustworthy, tends to get addressed faster than a hidden one ever could.`,
      shadow: `That performed confidence prevents anyone, including you, from actually addressing the uncertainty genuinely underneath it. Underneath the maintained performance is often a fear that showing real worry would undo the confidence that feels like your core identity. You project steadiness over a financial situation that actually needs direct, honest attention. The projected confidence costs you the help and clarity that visibility would have already provided.`,
      invitation: `Ask yourself honestly what financial worry you've been keeping hidden behind consistent confidence. Let one specific financial worry be visible today to someone trustworthy. Say the real concern plainly, without the usual reassuring gloss. Notice that visibility doesn't erase the confidence, it just makes room for honesty alongside it.`,
    },

    // ── 20 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '20_MK': {
      title: `20 in Material Karma — Judgement`,
      tagline: `A Design of the First Move`,
      mastery: `You carry a genuine financial truth that's already become clear, recognized precisely rather than left vague. That clarity is a real strength, and once it arrives, you're capable of acting on it decisively. You can rise to what the clarity is actually asking of you. And taking one concrete step now doesn't require every condition to feel perfectly ready first.`,
      shadow: `You meet that clarity with more preparation and waiting, one more condition appended before it's actually faced or acted on. Underneath the added conditions is often a fear that acting on the clarity would mean confronting something before you feel fully ready to handle it. You recognize the financial truth accurately and then collect more readiness instead of moving on it. The waiting costs you the progress the clarity, actually acted on, would have already produced.`,
      invitation: `Ask yourself honestly what you're actually still preparing for that you're already capable of doing. Name the specific action your financial clarity is already calling for today, and take a first concrete step. Do the real action, not another round of preparation. Notice that the step doesn't require full readiness to be worth taking.`,
    },

    // ── 21 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '21_MK': {
      title: `21 in Material Karma — The World`,
      tagline: `A Design of the Named Complete`,
      mastery: `You carry real financial goals reached in practical, tangible terms, actual arrival rather than perpetual approach. You know what genuinely finished looks like, and reaching it gives you real, felt ground. That capacity to recognize and claim completion is a genuine strength. And you can let an already-reached goal actually be named complete, without adding one more condition first.`,
      shadow: `You immediately relativize the reached goal, expanding it or setting a new condition before it's allowed to actually count as done. Underneath the relativizing is often a fear that claiming full completion would mean there's nothing left to strive toward. You hit a genuine financial target and move the goalposts before the achievement has even registered as real. The relativizing costs you the felt ground actual completion is supposed to provide.`,
      invitation: `Ask yourself honestly what financial goal you've never let yourself call complete. Identify one financial goal today that's practically already reached, and deliberately name it complete. Say it's done, without adding a further condition. Notice that naming it complete doesn't stop you from setting the next goal later.`,
    },

    // ── 22 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '22_MK': {
      title: `22 in Material Karma — The Fool`,
      tagline: `A Design of the Woven Net`,
      mastery: `You carry genuine openness to material risk, acted on with real courage most people talk themselves out of. That willingness to leap is a genuine strength, and it opens opportunities a more cautious approach would miss entirely. You're capable of pairing that courage with a small piece of preparation, without it dampening the openness. And a little groundwork tends to make the leap land more often, not less.`,
      shadow: `You leap before the groundwork that would make the risk actually sustainable has been laid, leaving the landing to chance. Underneath the unpaired leap is often a fear that adding preparation would somehow taint the purity of the courageous risk you're taking. You take the material risk on courage alone, without any concrete backup, and when it doesn't land, there's nothing to catch the fall. The unpaired leap costs you outcomes that even minimal preparation would have secured.`,
      invitation: `Ask yourself honestly what small piece of preparation you've been skipping in favor of pure courage. Build one small piece of safety net today before your next financial leap. Add the backup plan without abandoning the leap itself. Notice that preparation doesn't diminish the courage, it just gives it a floor.`,
    },

    // ── 1 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '1_RWM': {
      title: `1 in Relationship with Money — The Magician`,
      tagline: `A Design of the Kept Gift`,
      mastery: `You initiate income actively, and earning genuinely feels legitimate, deserved, and real to you, not something you have to justify. You start ventures and generate money from a place of real confidence rather than apology. That sense of earned legitimacy is a genuine strength, letting money move toward you without internal resistance. And unearned financial ease can be accepted just as freely, once you notice the double standard you apply to it.`,
      shadow: `You minimize genuinely available resources because only self-generated money feels legitimate enough to actually hold onto. Underneath the minimizing is often a fear that accepting unearned ease would mean the confident, self-made identity you've built isn't fully deserved. You decline or downplay a gift, inheritance, or windfall, treating it as somehow less real than earned income. The minimizing costs you real resources your own rule quietly disqualifies.`,
      invitation: `Ask yourself honestly what unearned resource you've been minimizing or declining. Accept one piece of unearned financial ease today without justifying it through extra effort. Receive it plainly, without needing to earn it retroactively. Notice that accepting it doesn't undo your capacity to earn.`,
    },

    // ── 2 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '2_RWM': {
      title: `2 in Relationship with Money — The High Priestess`,
      tagline: `A Design of the Named Price`,
      mastery: `You carry a real, quiet sense for when a financial opportunity is genuinely right, sensed before it's fully explainable in numbers. That instinct, when you actually voice it, tends to be accurate more often than not. It's a real financial asset, not just a private feeling to keep to yourself. And you're capable of stating a specific price or value plainly, out loud, rather than leaving it as an unspoken sense.`,
      shadow: `You leave that insight unclaimed and uncompensated, sensed accurately but never actually stated aloud to anyone. Underneath the silence is often a fear that naming a specific number would expose the sense to scrutiny it can't fully justify. You know the right price or the right call and let someone else name it, or let the opportunity pass unclaimed. The silence costs you the compensation your own accurate sense had already earned.`,
      invitation: `Ask yourself honestly what price or value you already sense but haven't said out loud. State one specific price or value out loud today. Say the number plainly, without hedging it. Notice that naming it doesn't require a fully rational justification first.`,
    },

    // ── 3 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '3_RWM': {
      title: `3 in Relationship with Money — The Empress`,
      tagline: `A Design of Pleasurable Saving`,
      mastery: `You spend with real ease on comfort, beauty, and care, for yourself and for the people around you. That generosity is a genuine strength, and the richness you create with money is real, not wasteful. You're capable of extending that same ease to your own future, not just the present moment. And setting aside a real reserve doesn't require sacrificing the pleasure you're actually good at creating.`,
      shadow: `Your generosity moves freely outward while your own reserve stays thin, under-tended relative to how well you tend everyone else's comfort. Underneath the thinness is often a fear that saving for yourself would compete with the generosity that feels like your actual identity. You spend easily on shared or others' comfort while your own future goes quietly unfunded. The thin reserve costs you a security your generosity, redirected slightly, could easily build.`,
      invitation: `Ask yourself honestly what portion of your spending has gone outward without any going toward your own reserve. Set aside one specific portion of income today for your own future. Treat it with the same ease you'd apply to any other pleasurable spending. Notice that saving for yourself doesn't make you less generous.`,
    },

    // ── 4 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '4_RWM': {
      title: `4 in Relationship with Money — The Emperor`,
      tagline: `A Design of Tested Delegation`,
      mastery: `You build and defend real financial structure, keeping a firm, competent hand on every account you manage. That structural discipline is a genuine strength, and your finances tend to be organized in a way that actually holds up. You're capable of delegating a piece of that management without the structure collapsing. And trusting a system or person with part of the oversight doesn't undo the discipline you've already built.`,
      shadow: `You can't imagine your money being fine without your constant, personal oversight of every single account and decision. Underneath the constant oversight is often a fear that delegating any piece would mean losing the control that's kept things stable. You hold every financial thread yourself, even the ones a trusted system could easily handle. The constant oversight costs you time and ease that real, tested delegation would free up.`,
      invitation: `Ask yourself honestly what piece of financial management you could actually hand off. Hand one small piece of financial management today to a system or person you trust. Delegate it fully, not just partially. Notice that the structure holds even without your hand on every single piece.`,
    },

    // ── 5 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '5_RWM': {
      title: `5 in Relationship with Money — The Hierophant`,
      tagline: `A Design of the Tested Rule`,
      mastery: `You check financial choices against a real, grounded sense of tradition and proper practice, not just impulse. That grounding is a genuine strength, keeping your financial choices consistent with values you actually hold. You're capable of testing an inherited rule honestly, rather than following it automatically. And updating the rule where it no longer fits doesn't mean abandoning the values underneath it.`,
      shadow: `You pass up genuinely good opportunities simply because they don't match an inherited "right way" of handling money. Underneath the passing up is often a fear that deviating from the inherited rule would mean betraying the tradition it came from. You apply an old standard automatically, without checking whether it actually reflects your own current values or circumstances. The automatic application costs you opportunities a tested, updated rule would have actually allowed.`,
      invitation: `Ask yourself honestly which money rule you follow automatically without ever having tested it. Name one inherited money rule today and test whether it reflects your own values. Examine it directly instead of assuming it. Notice that updating the rule doesn't mean discarding the tradition entirely.`,
    },

    // ── 6 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '6_RWM': {
      title: `6 in Relationship with Money — The Lovers`,
      tagline: `A Design of the Weighed Want`,
      mastery: `Your financial choices are genuinely relational, weighing what a partner would think or need alongside your own view. That relational consideration is a genuine strength, and it produces financial decisions that actually work for a shared life. You're capable of making a purely self-directed financial choice too, without that undermining the relationship. And weighing a partner's needs doesn't require permanently deferring your own.`,
      shadow: `Your own financial preference gets perpetually deferred to someone else's, quietly and by default, in nearly every decision. Underneath the deferring is often a fear that prioritizing your own preference would look selfish or threaten the relationship's harmony. You default to what a partner would want before even fully forming your own view. The perpetual deferring costs you a financial life that reflects your own actual preferences, not just accommodation of someone else's.`,
      invitation: `Ask yourself honestly what financial preference you've been deferring without even stating it. Make one financial decision today based purely on your own preference. State it and act on it without pre-negotiating it away. Notice that this doesn't damage the relational consideration you're actually good at.`,
    },

    // ── 7 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '7_RWM': {
      title: `7 in Relationship with Money — The Chariot`,
      tagline: `A Design of the Registered Milestone`,
      mastery: `You carry real ambition and momentum toward the next financial target, driving your income forward without stalling. That drive is a genuine strength, and it means your financial trajectory rarely goes stagnant. You're capable of pausing to actually register a milestone once you reach it, without that pause costing you the momentum. And registering the win doesn't slow down the next one.`,
      shadow: `Money earned never actually gets to feel earned, chased past before it's even fully acknowledged as a real accomplishment. Underneath the chasing is often a fear that stopping to register a win would mean losing the drive that got you there. You hit a financial target and immediately move to the next one, without the current one ever registering as complete. The unregistered milestones cost you the satisfaction your actual achievements have already earned.`,
      invitation: `Ask yourself honestly which recent financial milestone you never actually let yourself register. Pause today after one financial milestone, long enough to actually register it. Stop and name it as achieved before moving to the next target. Notice that the pause doesn't cost you your forward momentum.`,
    },

    // ── 8 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '8_RWM': {
      title: `8 in Relationship with Money — Justice`,
      tagline: `A Design of the Closed Account`,
      mastery: `You carry a sharp, real orientation toward financial fairness and precision, noticing an imbalance others would miss entirely. That precision is a genuine strength, and it keeps your financial dealings honest and accurate. You're capable of consciously closing an old account, even a small imbalance, once you decide it's actually resolved. And closing it doesn't require abandoning your underlying commitment to fairness.`,
      shadow: `Your mental ledger never fully closes, small imbalances tracked long after they'd naturally have resolved on their own. Underneath the perpetual tracking is often a fear that closing the ledger prematurely would mean letting an actual unfairness go unaddressed. You keep tabs on a small financial imbalance from years ago, unable to declare it settled. The perpetual tracking costs you mental space for something that's functionally already over.`,
      invitation: `Ask yourself honestly what old financial imbalance you're still mentally tracking that's actually resolved. Consciously close one old financial account today that you're still mentally tracking. Declare it settled, explicitly, even if it wasn't perfectly even. Notice that closing it doesn't mean you've abandoned fairness as a value.`,
    },

    // ── 9 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '9_RWM': {
      title: `9 in Relationship with Money — The Hermit`,
      tagline: `A Design of the Accepted Partnership`,
      mastery: `You carry real self-sufficiency, earning and managing money independently and competently without needing to lean on anyone. That independence is a genuine strength, and it means you can handle your own financial life reliably. You're capable of asking for real financial help or partnership without it undoing that self-sufficiency. And accepting interdependence, when it's actually useful, doesn't make you any less capable.`,
      shadow: `You undercharge or under-earn specifically to avoid the discomfort of financial interdependence that a bigger role might require. Underneath the undercharging is often a fear that needing anyone financially would mean losing the independence that defines you. You keep your financial footprint small enough to never require partnership or help from anyone. The self-imposed smallness costs you income and opportunity that real interdependence would unlock.`,
      invitation: `Ask yourself honestly what financial help you've avoided asking for out of a need to stay fully independent. Ask for one specific piece of financial help or partnership today. Make the request directly, without minimizing it. Notice that asking doesn't undo the self-sufficiency you've already proven.`,
    },

    // ── 10 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '10_RWM': {
      title: `10 in Relationship with Money — Wheel of Fortune`,
      tagline: `A Design of the Trusted Cycle`,
      mastery: `Your financial rhythm is genuinely cyclical, feast and famine, surge and recede, and you can actually work with that rhythm rather than fighting it. That comfort with natural fluctuation is a genuine strength, letting you weather a downturn without panic. You're capable of protecting a steady income stream through its full cycle, once you trust that steadiness isn't a threat. And stability doesn't erase the rhythm you're used to, it just adds a floor underneath it.`,
      shadow: `You unconsciously undermine steady income because the wave pattern feels more familiar and more like yourself than actual stability does. Underneath the undermining is often a fear that a truly steady income would mean losing the identity built around riding financial waves. You disrupt a source of consistent income right as it starts to actually stabilize. The disruption costs you the security a steady stream, protected through its cycle, would have provided.`,
      invitation: `Ask yourself honestly what steady income source you've been quietly undermining. Protect one steady income source today through its full cycle, without disrupting it. Let it run without interference this time. Notice that the stability doesn't erase the rhythm you're used to.`,
    },

    // ── 11 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '11_RWM': {
      title: `11 in Relationship with Money — Strength`,
      tagline: `A Design of the Named Need`,
      mastery: `You carry real capacity to earn, support, and provide financially for others, and that capacity is a genuine strength you can rely on. You show up for people who need financial support, consistently and without resentment. That providing capacity is real, not performative, and people around you actually depend on it well. And you're capable of naming your own financial need out loud, without that undermining your ability to keep providing.`,
      shadow: `That giving becomes depleting because it's never balanced by asking for the same kind of support in return. Underneath the imbalance is often a fear that voicing a need would compete with the provider identity you've built your worth around. You give financial support freely while your own needs go unspoken and unaddressed. The imbalance costs you the reciprocity that would let your own giving actually be sustainable.`,
      invitation: `Ask yourself honestly what financial need you've never actually voiced to anyone. Name one specific financial need out loud today to someone capable of helping. Say it plainly, without minimizing it or offsetting it with an apology. Notice that naming it doesn't make you less capable of providing for others.`,
    },

    // ── 12 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '12_RWM': {
      title: `12 in Relationship with Money — The Hanged Man`,
      tagline: `A Design of the Ended Denial`,
      mastery: `You carry a real instinct for financial discipline, capable of genuinely delaying gratification when it actually serves a larger purpose. That discipline is a real strength, letting you build toward something bigger than immediate comfort. You're capable of spending on your own comfort deliberately, without that undoing your underlying discipline. And discipline can coexist with real, unapologetic comfort, once you actually try it.`,
      shadow: `That denial outlives whatever it was originally protecting, continuing well past the point of actually serving any real purpose. Underneath the outlived denial is often a fear that spending on comfort now would mean the discipline itself was never really necessary. You withhold financial ease from yourself out of a habit that's disconnected from any current actual goal. The outlived denial costs you comfort your own resources have already earned and can afford.`,
      invitation: `Ask yourself honestly what this denial is currently protecting, if anything at all. Spend, deliberately and without justification, on one thing for your own comfort today. Choose it plainly, without needing a productivity reason to back it. Notice that spending once doesn't undo the discipline you've built.`,
    },

    // ── 13 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '13_RWM': {
      title: `13 in Relationship with Money — The Death`,
      tagline: `A Design of the Small Adjustment`,
      mastery: `Your financial shifts arrive as complete, real overhauls, transforming a whole system at once rather than nudging it incrementally. That capacity for total change is a genuine strength, letting you rebuild a financial life fundamentally when it's actually called for. You're capable of making a small, incremental adjustment too, without needing to wait for the dramatic version. And the small correction now can prevent needing the larger overhaul later.`,
      shadow: `You skip smaller, earlier course-corrections in favor of waiting for the dramatic reset that finally forces real change. Underneath the skipping is often a fear that a small adjustment wouldn't be significant enough to actually count as real change. You let a financial problem compound until it demands a complete overhaul, rather than addressing it early and incrementally. The waiting costs you the smoother, less disruptive path a small correction would have provided.`,
      invitation: `Ask yourself honestly what small financial adjustment you've been postponing in favor of a bigger eventual fix. Make one small, incremental financial adjustment today, rather than waiting for a forced overhaul. Take the modest action now, not the dramatic one later. Notice that the small correction still counts as real change.`,
    },

    // ── 14 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '14_RWM': {
      title: `14 in Relationship with Money — Temperance`,
      tagline: `A Design of the Chosen Middle`,
      mastery: `You carry a real, steady financial equilibrium when centered, blending saving and spending into something sustainable. That equilibrium is a genuine strength, and when you're grounded, your financial choices reflect real balance. You're capable of catching the moment stress starts to pull you toward an extreme, before it takes hold. And returning to the steadier middle doesn't require eliminating stress first, just noticing the pull.`,
      shadow: `You swing into strict restriction or full indulgence the moment real stress enters, abandoning the equilibrium you otherwise hold well. Underneath the swing is often a fear that staying centered under real pressure isn't actually possible, so the extreme feels more honest. You shift hard toward one pole the instant stress arrives, losing the steadiness that's usually your strength. The swing costs you the balance that would have actually served you better through the stress.`,
      invitation: `Ask yourself honestly whether you're currently swinging toward an extreme in response to stress. Notice today the moment stress pulls your spending toward an extreme, and choose the steadier response. Catch it before the swing fully takes hold. Notice that steadiness is still available even under real pressure.`,
    },

    // ── 15 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '15_RWM': {
      title: `15 in Relationship with Money — The Devil`,
      tagline: `A Design of the Honest Habit`,
      mastery: `You carry a real capacity to notice a specific financial compulsion running on autopilot, seeing the pattern for what it is. That honest noticing is a genuine strength, letting you catch a habit before it fully runs your finances. You're capable of naming the compulsion plainly and asking what would happen if you actually loosened it. And examining it honestly tends to reduce its grip rather than tightening it.`,
      shadow: `You mistake that compulsive habit for simply how things are, a fixed trait rather than an actual, examinable pattern. Underneath the mistaking is often a fear that naming the compulsion honestly would mean confronting how much control it actually has. You live around the habit, accommodating it, without ever really questioning whether it's necessary. The unexamined habit costs you the freedom that naming it would have already started to restore.`,
      invitation: `Ask yourself honestly what financial habit runs on autopilot without you ever questioning it. Name one compulsive financial habit honestly today, and ask what would happen if you loosened it. Actually test loosening it in a small, low-stakes way. Notice that examining it doesn't require eliminating it entirely, just questioning it.`,
    },

    // ── 16 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '16_RWM': {
      title: `16 in Relationship with Money — The Tower`,
      tagline: `A Design of the Early Signal`,
      mastery: `You carry a real instinct to maintain financial stability under pressure, holding steady when circumstances get genuinely difficult. That instinct for stability is a genuine strength, and it's kept real crises from developing in the past. You're capable of identifying the strain underneath a stable appearance and addressing it directly, before it forces a sudden reversal. And addressing the strain early doesn't undo the stability, it protects it.`,
      shadow: `You maintain the appearance of stability instead of addressing the actual strain underneath, until it eventually forces a sudden, disruptive reversal. Underneath the maintained appearance is often a fear that acknowledging the real strain would collapse the stability you're working so hard to project. You keep the surface calm while an underlying financial problem compounds, unaddressed, until it can't be contained anymore. The maintained appearance costs you the chance to address the strain while it was still manageable.`,
      invitation: `Ask yourself honestly what financial strain you've been minimizing under a stable-looking surface. Identify one financial strain being minimized today, and address it directly. Name it plainly and take one concrete action toward it. Notice that addressing it early doesn't cause the collapse you were protecting against.`,
    },

    // ── 17 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '17_RWM': {
      title: `17 in Relationship with Money — The Star`,
      tagline: `A Design of the Attended Corner`,
      mastery: `You carry real ease turning creative or inspired work into actual income, translating vision into something payable. That ease is a genuine strength, particularly in areas most people find harder to monetize. You're capable of applying the same active energy to other neglected financial areas, not just the inspired ones. And direct action in an under-attended area tends to move it faster than hoping ever would.`,
      shadow: `You hope other financial areas will simply improve on their own, without direct action, the way your inspired work naturally has. Underneath the hoping is often a fear that the active effort your creative work requires wouldn't transfer to areas that feel less inspired. You wait for a less exciting financial area to resolve itself while actively working only where the ease already exists. The hoping costs you improvement in exactly the areas that need deliberate attention, not luck.`,
      invitation: `Ask yourself honestly what financial area you've been hoping would improve without any direct action. Name one financial area you've been hoping will improve today, and take one concrete action toward it. Apply the same active energy you use elsewhere. Notice that direct action here doesn't require it to feel inspired first.`,
    },

    // ── 18 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '18_RWM': {
      title: `18 in Relationship with Money — The Moon`,
      tagline: `A Design of the Checked Number`,
      mastery: `You carry a real, felt sensitivity about your financial state, picking up on a shift before it's fully confirmed by the numbers. That sensitivity is a genuine strength, an early-warning system that often catches something real. You're capable of checking that felt sense directly against the actual numbers, which sharpens its accuracy rather than dismissing it. And looking directly at an avoided number tends to be less frightening than the anxiety about it.`,
      shadow: `Your financial anxiety runs ahead of the actual facts, more intense and more constant than the numbers would actually justify. Underneath the runaway anxiety is often a fear that checking the real numbers would confirm something worse than the vague dread currently suggests. You avoid a specific financial number, letting the anxiety fill in the gap with something scarier than reality. The avoidance costs you the relief that an accurate, checked number would likely provide.`,
      invitation: `Ask yourself honestly what specific financial number you've been avoiding looking at directly. Look directly today at one specific, avoided financial number. Check it plainly, without a story attached in advance. Notice whether the actual number is less alarming than the anxiety about it.`,
    },

    // ── 19 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '19_RWM': {
      title: `19 in Relationship with Money — The Sun`,
      tagline: `A Design of the Visible Worry`,
      mastery: `You carry a real, radiant ease around money, genuinely maintained even when the underlying situation is actually uncertain. That ease is a real strength, keeping panic from taking over during ordinary financial fluctuation. You're capable of letting a real worry be visible too, without that undoing the ease you're known for. And visible worry, shared with someone trustworthy, tends to get addressed faster than a hidden one ever could.`,
      shadow: `That consistent brightness prevents anyone, including you, from actually addressing what's genuinely uncertain underneath it. Underneath the maintained brightness is often a fear that showing real worry would undo the ease that feels like your core identity. You project confidence over a financial situation that actually needs direct, honest attention. The projected brightness costs you the help and clarity that visibility would have already provided.`,
      invitation: `Ask yourself honestly what financial worry you've been keeping hidden behind consistent brightness. Let one specific financial worry be visible today to someone trustworthy. Say the real concern plainly, without the usual reassuring gloss. Notice that visibility doesn't erase the ease, it just makes room for honesty alongside it.`,
    },

    // ── 20 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '20_RWM': {
      title: `20 in Relationship with Money — Judgement`,
      tagline: `A Design of the Early Wake-Up`,
      mastery: `You eventually face financial truths fully and honestly, without flinching once you actually get there. That capacity for full honesty is a genuine strength, and once you engage with a financial reality, you handle it well. You're capable of acting on a current sign now, before it forces the full reckoning you're already good at handling later. And acting early doesn't require waiting for the crisis point to arrive first.`,
      shadow: `That clarity arrives well after the signs pointing toward it had already appeared, sometimes long after. Underneath the delay is often a fear that acting on an early sign would mean confronting the truth before you feel ready to handle it. You notice the warning signs and let them accumulate rather than acting on them individually. The delay costs you the smaller, earlier interventions that would have prevented the eventual full reckoning.`,
      invitation: `Ask yourself honestly what current financial sign you've been noticing but not acting on. Act today on one current financial sign, before it forces a full reckoning. Take the small action now, while it's still manageable. Notice that acting early doesn't require the full clarity you'd eventually reach anyway.`,
    },

    // ── 21 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '21_RWM': {
      title: `21 in Relationship with Money — The World`,
      tagline: `A Design of the Counted Win`,
      mastery: `You measure real financial progress against a comprehensive, ideal version of success, keeping the bigger picture always in view. That comprehensive standard is a genuine strength, preventing you from settling for less than what's actually possible. You're capable of letting a current, real win count as complete on its own terms, without needing the entire picture to arrive first. And counting the current win doesn't lower the larger standard you're still working toward.`,
      shadow: `Real, current success never gets to feel like success because the bigger, comprehensive picture hasn't fully arrived yet. Underneath the non-feeling is often a fear that celebrating a partial win would mean settling for less than the whole vision requires. You reach genuine financial milestones and immediately measure them against what's still missing. The non-feeling costs you the satisfaction of wins that are, by any reasonable measure, already real and complete.`,
      invitation: `Ask yourself honestly which recent financial win you never let yourself count because the bigger picture wasn't finished. Name one financial win today that's genuinely real, and let it count as complete on its own terms. Stop measuring it against the unfinished whole. Notice that counting it doesn't lower your larger standard.`,
    },

    // ── 22 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '22_RWM': {
      title: `22 in Relationship with Money — The Fool`,
      tagline: `A Design of the Backed Trust`,
      mastery: `You carry a real, spontaneous openness to financial risk and a genuine belief that things will work out, more often than not backed by real evidence. That openness is a genuine strength, letting you take chances most people would talk themselves out of. You're capable of pairing that trust with one small, concrete piece of preparation, without it dampening the openness. And a little preparation tends to make the leap land more often, not less.`,
      shadow: `You ask trust alone to do the work planning was meant to do, leaving the actual landing entirely to chance. Underneath the reliance on trust alone is often a fear that adding preparation would somehow taint the purity of the leap of faith. You take the risk on belief without any concrete backup, and when it doesn't land, there's nothing to catch the fall. The unpaired trust costs you outcomes that even minimal preparation would have secured.`,
      invitation: `Ask yourself honestly what small piece of preparation you've been skipping in favor of pure trust. Pair your next financial risk today with one small, concrete piece of preparation. Add the backup plan without abandoning the leap itself. Notice that preparation doesn't diminish the trust, it just gives it a floor.`,
    },

    // ── Career Paths (Money Channel — Best Career Paths For Each Arcana) ──
    '1_CAREER': {
      title: `1 in Career Paths — The Magician`,
      tagline: `A Design of the Invented Role`,
      mastery: `Your career fit runs through initiative and origination, founding and launching things rather than maintaining what already exists. You thrive leading from the front, generating direction others follow. That capacity to originate is a real career asset, and roles that let you use it fully tend to fit you best. And you're capable of naming and pursuing that kind of role directly, rather than settling for one that gives you nothing to originate.`,
      shadow: `You take a role built around someone else's system, one that gives you nothing real to originate or lead. Underneath the settling is often a fear that pursuing a founding role would mean risking the stability a staffing role currently provides. You operate inside a structure you could build better, executing rather than originating. The settling costs you both fulfillment and the career trajectory your actual capacity supports.`,
      invitation: `Ask yourself honestly what role you're currently staffing that you could actually be founding or leading. Name one role or venture today where you'd actually be the one starting things, and take a real step toward it. Pursue it directly, not just as an idea. Notice that claiming this doesn't require external permission to begin.`,
    },

    '2_CAREER': {
      title: `2 in Career Paths — The High Priestess`,
      tagline: `A Design of the Credited Read`,
      mastery: `Your career fit runs through depth and perception, reading what's actually underneath what's said in a room or a situation. You pick up on the real dynamic before it's stated outright, and that perceptiveness is a genuine professional asset. That intuitive depth is real, not soft or secondary to more visible skills. And you're capable of finding a field where that intuition is the actual qualification, not an unrewarded side note.`,
      shadow: `You take a role that only rewards visible, provable output, leaving your real gift permanently uncredited and underused. Underneath the settling is often a fear that pursuing a field built around intuitive skill would expose it to demands for proof it can't fully provide. You perform well in a role that measures the wrong thing, while your actual strength goes unrecognized. The mismatch costs you the recognition and fit a better-aligned field would provide.`,
      invitation: `Ask yourself honestly what field would actually value your intuitive read as the core skill. Name one field today where your intuition would actually be the qualification, and research a real path into it. Take the concrete first step, not just the idea. Notice that pursuing this doesn't require abandoning your current stability all at once.`,
    },

    '3_CAREER': {
      title: `3 in Career Paths — The Empress`,
      tagline: `A Design of the Priced Craft`,
      mastery: `Your career fit runs through generativity and beauty, creating and cultivating something real as the actual center of your work. You produce genuine value through what you generate, and that output is worth building a career around directly. That generative capacity is a real professional asset, not a hobby-grade extra. And you're capable of pricing or pitching that work as an actual profession, not something secondary.`,
      shadow: `You take a role that treats your creative output as a hobby, discounted the moment it feels effortless rather than laborious. Underneath the discounting is often a fear that pricing the creative work seriously would expose it as less legitimate than harder, more visibly effortful labor. You keep the generative work as an unpaid or underpaid side project, while less fulfilling work earns the actual income. The discounting costs you a career built around the exact thing you're actually best at.`,
      invitation: `Ask yourself honestly what creative work you've been treating as a hobby that could actually be your profession. Price or pitch one piece of your creative work today as an actual profession, not a side project. Charge or propose the full, professional rate. Notice that the ease of the work doesn't make it less legitimate as a career.`,
    },

    '4_CAREER': {
      title: `4 in Career Paths — The Emperor`,
      tagline: `A Design of the Requested Ownership`,
      mastery: `Your career fit runs through ownership and command, building or running an entire system rather than just staffing a piece of it. You have real capacity to architect structure and hold genuine authority over it. That capacity for ownership is a real professional asset, and roles that grant it tend to compensate you well. And you're capable of naming a system you could actually own and asking for that ownership directly.`,
      shadow: `You take a subordinate role inside someone else's structure, where your genuine capacity for order gets boxed into a narrower function. Underneath the boxing is often a fear that seeking real ownership would expose you to a more visible kind of failure than staying subordinate does. You operate inside a system you could run better, without ever proposing to actually run it. The boxing costs you both income and the authority your actual capacity is built for.`,
      invitation: `Ask yourself honestly what system you're currently just staffing that you could actually be running. Name one system today you could actually own, and ask for that ownership directly. Make the request explicit, not implied. Notice that claiming this authority doesn't require external permission to begin considering it.`,
    },

    '5_CAREER': {
      title: `5 in Career Paths — The Hierophant`,
      tagline: `A Design of the Real Student`,
      mastery: `Your career fit runs through transmission, passing a system of real knowledge forward rather than only holding it privately. You have genuine expertise worth teaching, and roles built around transmission tend to suit you far better than ones that only ask you to accumulate more. That teaching capacity is a real professional asset. And you're capable of teaching or mentoring someone now, with what you already know, rather than waiting for more credentials first.`,
      shadow: `You stay a permanent student, collecting credentials in a field that never actually asks you to teach or transmit anything. Underneath the permanent studenthood is often a fear that stepping into the teaching role would expose gaps a few more credentials might have covered. You keep learning instead of transmitting, deferring the career fit that teaching would actually provide. The deferral costs you the professional role your existing knowledge already qualifies you for.`,
      invitation: `Ask yourself honestly what you already know well enough to teach right now. Teach or mentor one person today in something you already know well. Share it in its current, imperfect form. Notice that teaching it doesn't require having mastered everything first.`,
    },

    '6_CAREER': {
      title: `6 in Career Paths — The Lovers`,
      tagline: `A Design of the Whole Job`,
      mastery: `Your career fit runs through relationship, reading and choosing well between people as the actual center of the work. You have a genuine gift for matching, connecting, and discerning between people, and that skill is a real professional asset. Roles built explicitly around relationship tend to fit you far better than transactional ones. And you're capable of naming a role where people are explicitly the job and pitching yourself for it directly.`,
      shadow: `You take a role that treats people as a checklist rather than a genuine relationship, flattening the real skill you actually bring. Underneath the flattening is often a fear that a fully relational role would be harder to justify or measure than a transactional one. You operate in a position that undervalues your actual gift for reading and connecting people. The flattening costs you a career fit that would let your real skill be the whole job, not an unmeasured extra.`,
      invitation: `Ask yourself honestly what role would actually put your relational skill at the center, not the edges. Name one role today where people are explicitly the job, and pitch yourself for it. Make the pitch concrete and specific. Notice that this doesn't require abandoning stability you've already built elsewhere.`,
    },

    '7_CAREER': {
      title: `7 in Career Paths — The Chariot`,
      tagline: `A Design of the Visible Destination`,
      mastery: `Your career fit runs through movement and results, getting something, or someone, all the way across a real finish line. You bring genuine drive and follow-through, and roles with a clear destination let that capacity actually deliver. That capacity for results-driven momentum is a real professional asset. And you're capable of finding a role with a visible finish line and moving toward it deliberately.`,
      shadow: `You end up in a role with no visible destination, drive with nowhere to point, and that undirected energy turns into restlessness. Underneath the restlessness is often a fear that seeking a role with a clear finish line would mean risking a stable position without a defined endpoint. You stay in a static role, and the lack of a target itself becomes exhausting. The staticness costs you the energy and output your career actually produces when it has real direction.`,
      invitation: `Ask yourself honestly whether your current role has a real destination or just steady output. Name one role today with a visible finish line, and move toward it. Take one concrete step in that direction. Notice that seeking direction doesn't require abandoning the stability you have.`,
    },

    '8_CAREER': {
      title: `8 in Career Paths — Justice`,
      tagline: `A Design of the Paid Integrity`,
      mastery: `Your career fit runs through balance and accountability, accuracy and fairness functioning as the literal job description. You bring genuine reliability and integrity, and fields that actually pay for that quality suit you far better than ones that merely expect it for free. That integrity is a real professional asset in the right field. And you're capable of finding a field where it's actually a paid, valued qualification.`,
      shadow: `You end up in a role where fairness is expected but never actually rewarded financially or professionally, even when you deliver it consistently. Underneath the settling is often a fear that seeking a better-aligned field would mean an unstable transition you're not ready to risk. You provide the same integrity in an environment that doesn't compensate it accordingly. The mismatch costs you an income level and role fit your actual integrity would command elsewhere.`,
      invitation: `Ask yourself honestly whether your current field actually rewards the integrity you bring to it. Name one field today where integrity is a paid asset, and research a real path into it. Take one concrete step toward it. Notice that your integrity doesn't need to shrink to fit a field that undervalues it.`,
    },

    '9_CAREER': {
      title: `9 in Career Paths — The Hermit`,
      tagline: `A Design of the Visible Depth`,
      mastery: `Your career fit runs through specialized mastery, going genuinely deep in one narrow area, largely working alone. You develop real, deep expertise that ends up worth more than most broadly collaborative work. That mastery is a real professional asset once it's actually made visible to the people who'd pay for it. And you're capable of naming one narrow area to go deeper in, and one concrete way to make that depth visible.`,
      shadow: `You take a role demanding constant networking and visibility, pulling you away from the solitary depth that's actually your real asset. Underneath the pull is often a fear that a specialized, solitary role would leave you professionally invisible or overlooked. You spend energy on visibility work that doesn't build the depth your career fit actually depends on. The pull costs you the mastery a more solitary, focused role would have let you build.`,
      invitation: `Ask yourself honestly what narrow area you could go deeper in if you weren't spending energy on visibility instead. Name one narrow area today you could go deeper in, and one way to make that depth visible. Choose the specific area and the specific visibility action. Notice that depth doesn't require abandoning all visibility, just prioritizing it correctly.`,
    },

    '10_CAREER': {
      title: `10 in Career Paths — Wheel of Fortune`,
      tagline: `A Design of the Diversified Work`,
      mastery: `Your career fit runs through flexibility, reading and riding a changing situation well, alongside other people navigating the same shift. You adapt readily, and roles with room to change shape let that capacity actually shine. That flexibility is a real professional asset, distinct from instability. And you're capable of deliberately diversifying part of your work, building the room to adapt rather than only discovering its absence under pressure.`,
      shadow: `You end up in a rigid, single-track role that punishes exactly the adaptability that's actually your real professional strength. Underneath the rigidity is often a fear that seeking a more flexible structure would mean instability you're not prepared to handle. You stay locked into a narrow track, and your natural adaptability goes unused and undervalued there. The rigidity costs you the resilience and satisfaction a flexible, diversified role would provide.`,
      invitation: `Ask yourself honestly what part of your work has zero built-in flexibility right now. Name one part of your work today you could deliberately diversify or make more project-based. Add a second thread or a genuine variation. Notice that flexibility built in deliberately isn't the same as instability.`,
    },

    '11_CAREER': {
      title: `11 in Career Paths — Strength`,
      tagline: `A Design of Compensated Presence`,
      mastery: `Your career fit runs through presence, your charisma functioning as the literal, central professional asset. You bring a magnetic quality that genuinely draws attention, trust, and opportunity. That presence is a real professional advantage, worth naming explicitly rather than treating as incidental. And you're capable of finding a role or platform where that presence is the explicit asset, not a suppressed side effect.`,
      shadow: `You take a background role that asks you to shrink your presence rather than actually use it as the asset it is. Underneath the shrinking is often a fear that claiming your charisma as central would come across as vain or attention-seeking. You perform capably in a role that requires you to be smaller than you naturally are. The shrinking costs you a career fit that would let your natural presence do real professional work.`,
      invitation: `Ask yourself honestly where you're currently shrinking your presence rather than using it. Name one role or platform today where your presence would be the explicit asset, and take a visible step toward it. Show up more fully in that space. Notice that claiming this doesn't make the presence feel less genuine.`,
    },

    '12_CAREER': {
      title: `12 in Career Paths — The Hanged Man`,
      tagline: `A Design of the Right Pace`,
      mastery: `Your career fit runs through sustained service, real depth of presence with someone vulnerable, prioritized over speed. You have genuine capacity for the kind of committed, unglamorous care that requires staying with someone through real difficulty. That capacity for sustained presence is a real professional asset. And you're capable of naming a field of sustained service you're drawn to and taking one real step toward it.`,
      shadow: `You take a fast-turnaround role that never lets you actually stay with anyone long enough to use your real capacity for depth. Underneath the mismatch is often a fear that pursuing a field built around sustained service would require training or commitment you're not ready for yet. You perform capably in a role that rewards speed while your actual strength, depth of presence, goes unused. The mismatch costs you the fulfillment and fit sustained service work would actually provide.`,
      invitation: `Ask yourself honestly what field of sustained service you're drawn to but haven't pursued. Name one field of sustained service you're drawn to today, and take one real step toward it. Take the modest, concrete first step, not the full leap. Notice that starting doesn't require the full training to already be complete.`,
    },

    '13_CAREER': {
      title: `13 in Career Paths — Transformation`,
      tagline: `A Design of the Used Gift`,
      mastery: `Your career fit runs through transformation, guiding a real ending into a genuine new beginning for a person or a system. You have genuine capacity for reinvention work, releasing what's outdated and building what actually fits. That capacity for transformation is a real professional asset, distinct from maintenance skill. And you're capable of finding a field built around transformation and researching a real path into it.`,
      shadow: `You end up in a role built entirely around maintaining the status quo, where your genuine gift for transformation never actually gets used. Underneath the mismatch is often a fear that pursuing a transformation-based field would mean giving up the stability a maintenance role currently provides. You perform competently in a role that asks for upkeep while your real strength, guiding real change, sits unused. The mismatch costs you a career fit that would let your gift do actual work.`,
      invitation: `Ask yourself honestly what field would actually let you guide transformation rather than just maintain the status quo. Name one field today built around transformation rather than maintenance, and research a real path into it. Take the concrete first step. Notice that this doesn't require abandoning the stability you currently have all at once.`,
    },

    '14_CAREER': {
      title: `14 in Career Paths — Temperance`,
      tagline: `A Design of the Named Blend`,
      mastery: `Your career fit runs through integration, combining disparate skills or fields into something genuinely whole that most specialists never attempt. You see and build the connective tissue between disciplines that stay separate for other people. That synthesizing capacity is a real, rare professional asset once it's actually placed in a role that uses it fully. And you're capable of naming the skills you keep being told to pick between and finding a field where they actually combine.`,
      shadow: `You end up forced into a narrowly specialized role that leaves half your actual skill set sitting unused at the door. Underneath the forcing is often a fear that seeking a genuinely combined role would mean settling for competence in neither skill rather than mastery in one. You take the specialized role because it's clearer and more conventional, while your real, distinctive value goes underused. The forcing costs you the career fit that would let your full, combined skill set actually operate.`,
      invitation: `Ask yourself honestly which two or three skills you've been told to pick between instead of combining. Name the two or three skills you keep being told to pick between today, and research a field where they combine. Look specifically for the intersection, not the narrower single-skill role. Notice that combining them doesn't require abandoning depth in either.`,
    },

    '15_CAREER': {
      title: `15 in Career Paths — The Devil`,
      tagline: `A Design of the Clean Aim`,
      mastery: `Your career fit runs through material power, understanding accurately what compels people materially and psychologically. You read leverage and negotiation dynamics with real clarity, and that read is worth real money in the right field. That honest engagement with power is a genuine professional asset, distinct from manipulation. And you're capable of directing that clarity toward a field where it serves genuinely good, mutually beneficial deals.`,
      shadow: `That understanding gets used to grip control over people rather than serve a genuine, mutually beneficial transaction. Underneath the gripping is often a fear that a fair use of the skill would leave you with less advantage than you're used to holding. You wield your read on power to dominate dynamics instead of navigating them honestly in your career. The gripping costs you long-term trust and reputation that fair, honest dealing would have built instead.`,
      invitation: `Ask yourself honestly whether your career currently serves deals or just grips leverage in them. Name one field today where your read on power and money could serve a genuinely good deal. Research a path into work structured around mutual benefit. Notice that a fair-dealing field doesn't require surrendering your read on leverage.`,
    },

    '16_CAREER': {
      title: `16 in Career Paths — The Tower`,
      tagline: `A Design of the Proposed Rebuild`,
      mastery: `Your career fit runs through disruption and reconstruction, reorganizing a genuinely failing structure fast and effectively. You spot the actual weak point in a system that others are still defending, and you can rebuild it well. That clarity about what's failing is a real professional asset, especially in turnaround or crisis-response work. And you're capable of naming a system genuinely due for a rebuild and proposing the real fix directly.`,
      shadow: `You end up in a role that asks you to patch things quietly rather than actually rebuild them the way you're actually capable of. Underneath the settling is often a fear that proposing a full rebuild would be met with resistance a quiet patch avoids. You apply surface fixes in a role that could use your real capacity for structural reorganization. The quiet patching costs you the professional impact and recognition genuine rebuilding work would provide.`,
      invitation: `Ask yourself honestly what system you've been quietly patching that actually needs a full rebuild. Name one system today genuinely due for a rebuild, and propose the real fix. Make the proposal explicit, not just implied through minor adjustments. Notice that proposing it doesn't guarantee resistance, it might just get approved.`,
    },

    '17_CAREER': {
      title: `17 in Career Paths — The Star`,
      tagline: `A Design of the Released Work`,
      mastery: `Your career fit runs through visible creativity, hope and inspiration actually shared publicly rather than kept private. You generate genuinely inspiring work, and roles that put that work in front of people let it do what it's meant to do. That capacity for public, inspiring creativity is a real professional asset. And you're capable of publishing or pitching one piece of that work now, at the stage it's actually at.`,
      shadow: `You keep the creative work private and unmonetized, waiting to be discovered instead of actively offering it to anyone. Underneath the waiting is often a fear that offering the work publicly would expose it to judgment the private version never had to face. You produce inspiring work consistently while the actual career and income that visibility could generate stays untapped. The waiting costs you both income and the reach your work is genuinely capable of having.`,
      invitation: `Ask yourself honestly what creative work you've been keeping private, waiting to be discovered. Publish or pitch one piece of your creative work today at the size it's actually at. Offer it directly, not once it's flawless. Notice that offering it now doesn't diminish its actual value.`,
    },

    '18_CAREER': {
      title: `18 in Career Paths — The Moon`,
      tagline: `A Design of the Trusted Hunch`,
      mastery: `Your career fit runs through the intuitive and the felt, reading an unspoken undercurrent as the actual, central skill. You sense what's genuinely going on beneath a situation before it's confirmed by hard data. That intuitive read is a real professional asset in the right field, not a soft add-on to more measurable skills. And you're capable of naming a field where that intuitive read is the actual qualification and researching a real path in.`,
      shadow: `You end up in a role that demands hard, provable data first, leaving your real gift for intuitive reading sidelined and unused. Underneath the mismatch is often a fear that a field built around intuition wouldn't offer the same legitimacy as one built around measurable output. You perform capably in a data-first role while your actual strength stays permanently secondary. The mismatch costs you a career fit that would let your genuine gift do the primary work.`,
      invitation: `Ask yourself honestly what field would actually value your intuitive read as the primary skill. Name one field today where an intuitive read is the qualification, and research a real path in. Take the concrete first step toward it. Notice that pursuing this doesn't require abandoning analytical skill entirely.`,
    },

    '19_CAREER': {
      title: `19 in Career Paths — The Sun`,
      tagline: `A Design of the Uncostumed Self`,
      mastery: `Your career fit runs through visible warmth, being visibly and genuinely yourself as the actual professional asset. You bring a natural personality and radiance that draws people, and roles that let that show fully use you at your best. That authentic ease is a real professional advantage, not something to be managed down. And you're capable of letting more of the real you show in a part of your work currently hidden behind performed professionalism.`,
      shadow: `You end up in a role that requires a costume, draining the natural ease that's actually what makes you good at this in the first place. Underneath the costume is often a fear that showing your genuine personality would be read as unprofessional or too much. You perform a flattened, formal version of yourself, and the natural warmth that's your actual asset goes unused. The costume costs you the ease and connection your authentic presence would otherwise create.`,
      invitation: `Ask yourself honestly where you're currently performing professionalism instead of just being genuinely yourself. Let more of the real you show today in one part of your work where you're currently performing professionalism. Drop the costume in that one specific setting. Notice that authenticity here doesn't undermine how capable you already are.`,
    },

    '20_CAREER': {
      title: `20 in Career Paths — Judgement`,
      tagline: `A Design of the Real Step`,
      mastery: `Your career fit runs through vocation, work that functions less like a job and more like an answer to something clearly sensed. You recognize what's actually being asked of you with unusual precision, and you're capable of acting on it directly. That clarity about calling is a real professional asset once it's actually acted on. And you're capable of naming the work you keep returning to and taking one real step toward it now.`,
      shadow: `You stay in an adequate-but-outgrown role, endlessly preparing to answer the calling instead of actually leaping toward it. Underneath the endless preparation is often a fear that answering the calling and having it not work out would cost more than staying safely underused. You describe the calling accurately to anyone who asks while collecting more preparation instead of moving. The endless preparation costs you years the calling, actually answered, would have already used well.`,
      invitation: `Ask yourself honestly what work you keep returning to in your mind that you haven't actually pursued. Name the work you keep returning to in your mind today, and take one real step toward it. Do the concrete action, not another round of preparation. Notice that the step doesn't require full readiness to be worth taking.`,
    },

    '21_CAREER': {
      title: `21 in Career Paths — The World`,
      tagline: `A Design of the Crossed Border`,
      mastery: `Your career fit runs through global reach, work embedded in genuinely large systems and networks that cross borders. You have real capacity to operate at a broader scope than most people attempt professionally. That reach is a real career asset once you actually build toward it deliberately. And you're capable of letting one part of your work deliberately cross a border now, rather than waiting for the reach to arrive on its own.`,
      shadow: `You stay confined to a narrow, local version of your field long after your actual capacity has outgrown it professionally. Underneath the confinement is often a fear that expanding the scope would expose you to a competition or complexity the local version protects you from. You operate at a scale that no longer matches what you're actually capable of professionally. The confinement costs you the career growth your broader capacity is already built to earn.`,
      invitation: `Ask yourself honestly what professional scope you've stayed within that your actual capacity has already outgrown. Let one part of your work today deliberately cross a border, a client, a platform, a market. Take the concrete step toward the wider scope. Notice that crossing it doesn't require abandoning the local foundation you've built.`,
    },

    '22_CAREER': {
      title: `22 in Career Paths — The Fool`,
      tagline: `A Design of the Invented Job`,
      mastery: `Your career fit runs through original, unstructured paths, work a job description would practically have to be invented to describe. You thrive when the shape of the role isn't predetermined, generating value in ways conventional structures don't anticipate. That capacity for original, self-defined work is a real professional asset. And you're capable of naming an unconventional shape your work could take and building it directly.`,
      shadow: `You force yourself into a fixed, conventional role that punishes exactly the originality that's actually your real professional asset. Underneath the forcing is often a fear that pursuing an unconventional, self-invented path would be too unstable to actually risk. You perform adequately in a predefined role while your real capacity for original work stays constrained and underused. The forcing costs you the fit and fulfillment a self-defined path would actually provide.`,
      invitation: `Ask yourself honestly what unconventional shape your work could take if you weren't forcing it into a fixed role. Name one unconventional shape your work could actually take today, and take a real step toward building it. Take the concrete first step, not just the idea. Notice that building it doesn't require abandoning all structure, just inventing your own.`,
    },

    // ── Guardian Angel (Month of Birth / B) — Destiny Matrix: The 22
    // Ultimate Life-Changing Codes, pages 128-129: "The upper spot of the
    // diagonal square... is an energy of your personal guardian angel given
    // to you at birth... The spot of your guardian angel... stands for the
    // month of your birthday." Reuses B (Sky Line/birth-month) under its
    // own star identity, same technique as Career Paths reusing MON. ──
    // ── Life Path (full birthdate digit sum, classical numerology reduction:
    // 1-9 or master numbers 11/22/33 — NOT this app's own base-22 Arcana
    // system, since Life Path is a real, externally-known number people
    // already check themselves against. See research/11-Research-Updates/32.
    // Content adapted from Numberolgy-data.pdf's Positive/Negative/
    // Destructive trait lists for each number. ──────────────────────────────
    '1_LIFEPATH': {
      title: `Life Path 1 — The Original`,
      mastery: `You move first. Not out of bravado — standing still while something needs to happen has never felt like an option to you. You're not waiting for permission; that isn't how you're built. You're decisive to a fault, fiercely independent, and instinctively protective of your own ideas before anyone else has weighed in on them. You'd rather be first and wrong than safe and second.`,
      shadow: `You conflate leading a room with needing to win it. When someone challenges you, your instinct is correction, not curiosity, and it curdles into needing to be right more than needing to be understood. Disagreement can start to feel like a threat to your position rather than useful information. Over time, that pattern can leave people managing you carefully instead of actually telling you what they think.`,
      career: `You belong wherever the first move is yours to make — founding, not joining. Business ownership, invention, executive leadership, or any role where the direction is genuinely up to you.`,
      love: `You love with your whole hand on the wheel. What actually holds you is someone who won't be steered — a partner secure enough to disagree with you in front of other people.`,
      invitation: `Ask one real question today instead of offering the answer first. Let someone else's answer actually change what you do next. You are allowed to lead and still be genuinely curious about what someone else sees. What might you learn if you asked before you decided?`,
    },

    '2_LIFEPATH': {
      title: `Life Path 2 — The Diplomat`,
      mastery: `You process the world in pairs — this side and that side, what was said and what was meant. You're constitutionally unable to hear only one side of anything. You're tactful, detail-oriented, and quietly perceptive in a way people mistake for shyness. You notice everything and announce almost none of it.`,
      shadow: `Peace bought by staying quiet isn't peace — it's a debt with interest. You watch a conflict clearly enough to see what's true and still say nothing, because agreeing feels safer. That silence can read to others as agreement you never actually gave. Left unaddressed, the accumulated unsaid things can turn into a resentment nobody else even knows is there.`,
      career: `You do your best work as half of something — a partnership, a team, a role built on precision and follow-through. Counseling, mediation, or detail-heavy work where tact is the actual skill.`,
      love: `You give a relationship your whole attention, but you default to whatever keeps things smooth, even when smooth isn't honest.`,
      invitation: `Say the plain version of what you want today, once, before smoothing it into something more agreeable. Let it stand without immediately softening it. You are allowed to disturb the peace in order to tell the truth. What have you been quietly agreeing to that you don't actually agree with?`,
    },

    '3_LIFEPATH': {
      title: `Life Path 3 — The Expressive One`,
      mastery: `Whatever's happening inside you wants a room, a page, a stage, someone to actually receive it. Silence is where things go to rot for you. You're funny before you're serious, though the seriousness is real underneath it. Optimistic almost by reflex, quick with words. People remember rooms you were in.`,
      shadow: `Expression without follow-through is just noise with good lighting. You start ten things and finish the two still fun by week three. The charm that gets you into a project rarely shows up for the unglamorous middle of it. Given enough repetition, that pattern can leave real talent surrounded by a trail of bright, unfinished beginnings.`,
      career: `Anywhere your voice is the product — writing, performing, teaching, hosting, sales, marketing. You need real variety and at least a little audience.`,
      love: `You love loudly and generously and mean it, but staying present through the boring, hard middle of a relationship is the muscle you've practiced least.`,
      invitation: `Finish one unglamorous obligation today with nobody watching and no funny story to tell about it afterward. Let it be enough that it's done, not that it's entertaining. You are allowed to be taken seriously and still be genuinely fun. What have you been leaving unfinished once the fun part wore off?`,
    },

    '4_LIFEPATH': {
      title: `Life Path 4 — The Builder`,
      mastery: `You think in years, not weeks — laying one honest brick at a time toward something still standing long after the excitement wore off. You're disciplined, loyal, and stubbornly practical, with a private streak of unconventional thinking. You'd rather be right in ten years than agreeable today. Other people's urgency rarely moves you off a plan you actually trust.`,
      shadow: `The same conviction that builds something durable hardens into a refusal to be moved on anything, including the small stuff that was never worth the fight. Structure that once protected you can quietly become structure that confines the people around you too. Left unexamined, that rigidity can cost you exactly the flexibility a genuinely good plan sometimes needs. Being right in ten years is small comfort to the people who needed flexibility from you today.`,
      career: `Engineering, architecture, operations, construction — any field where the win is a system that still works five years from now.`,
      love: `You show love the way you show up to work — consistently, without asking for credit — which some partners read as distant simply because it's quiet.`,
      invitation: `Take one afternoon today for something with no productive purpose at all. Let it be unproductive on purpose, without justifying it afterward. You are allowed to build steadily and still let some hours be purely wasted. What would it feel like to let one afternoon simply be for nothing?`,
    },

    '5_LIFEPATH': {
      title: `Life Path 5 — The Adventurer`,
      mastery: `Your mind runs fast and wants new input the way lungs want air. Routine genuinely starts to feel like a room with the windows painted shut. You're quick, curious, and unusually good at reading a room or a stranger within minutes. Change doesn't scare you — the absence of it does.`,
      shadow: `Motion without anything underneath it eventually stops being adventure and starts being avoidance. You reach for something new the instant something old asks for real depth. That reflex can look like curiosity from the outside while functioning, underneath, as an exit before things get genuinely hard. Across enough repetitions, that pattern can leave a long, colorful trail of things you started and quietly left behind.`,
      career: `Writing, sales, travel, media — any work with a genuinely different day attached to it. Multiple streams of interest suit you better than one narrow lane.`,
      love: `You love easily and widely, but staying is the part that actually tests you, since leaving has always been the easier reflex.`,
      invitation: `Stay with one commitment today past the point where you'd normally want to change course. Notice what the discomfort of staying is actually made of. You are allowed to want freedom and still choose to stay. What might staying, just this once, teach you that leaving never could?`,
    },

    '6_LIFEPATH': {
      title: `Life Path 6 — The Nurturer`,
      mastery: `You walk into a space and start improving it without noticing — softening an argument, making a house feel like somewhere people want to stay. You're warm, protective, and genuinely happiest when the people around you are doing well. You have real taste in beauty and harmony. People tend to relax the moment you're in the room, often without knowing why.`,
      shadow: `Caring for someone and managing them feel identical from the inside, but only one of them is actually love. You set a standard for how people should be treated without saying it out loud. Faced with someone who wants to handle their own life differently than you would, the instinct to step in can be hard to resist. Unchecked, that instinct can leave the people you love feeling supervised rather than supported.`,
      career: `Teaching, counseling, healthcare, hospitality, design — anywhere your work visibly makes someone's life better.`,
      love: `You are a genuinely devoted partner, but the same devotion, unchecked, starts asking your partner to be cared for on your terms instead of theirs.`,
      invitation: `Name one place today where you've been managing someone else's life out of love, and step back from it on purpose. Let them handle it their own way, even imperfectly. You are allowed to trust people with their own struggles. Who might grow if you stepped back one pace?`,
    },

    '7_LIFEPATH': {
      title: `Life Path 7 — The Seeker`,
      mastery: `You live a layer beneath where most conversations happen — genuinely more interested in why something is true than in how it looks. You're intuitive, private, and unusually calming to be around, even when you've said almost nothing. You'd rather understand one thing completely than skim ten. Real understanding, for you, is worth more than being quick.`,
      shadow: `The line between privacy and isolation is thinner than you think. Staying quiet long enough starts to read as cold to people who never got the context. The depth that makes your thinking so good can also become a place to hide from the more exposing work of actually being known. Over time, that pattern can leave you respected from a distance and genuinely close to very few.`,
      career: `Research, analysis, writing, medicine — any specialist field that rewards depth over speed, with real solitude built into the role.`,
      love: `You love slowly, and trust is the actual price of admission to the parts of you nobody else gets to see.`,
      invitation: `Tell one trusted person a half-formed thought today, before you've polished it into something worth saying. Let it be unfinished and say it anyway. You are allowed to be known before you feel certain. What have you been keeping to yourself until it's fully figured out?`,
    },

    '8_LIFEPATH': {
      title: `Life Path 8 — The Executive`,
      mastery: `You're quieter than the scale of what you build would suggest, patient in a way that looks like restraint but is really confidence the plan will pay off. You're capable, composed, and a genuinely sharp judge of character. You measure things — progress, people, yourself — more than almost any other number does. People trust you with things that actually need to get done.`,
      shadow: `The same instinct that built everything you have also decides feelings can wait until after the task is done, and "after" has a way of never arriving. Real emotion gets filed under "later" often enough that later quietly becomes never. Left unaddressed, that pattern can leave you accomplished and privately unprocessed in equal measure. Composure this reliable can read as coldness to people who never see what it's actually costing you.`,
      career: `Business, finance, law, operations — anywhere real authority and a visible scoreboard exist.`,
      love: `You provide before you're asked to, and show love through action more naturally than through words — reliable in a way that's easy to underestimate as coldness.`,
      invitation: `Name one feeling out loud today instead of routing straight past it into the next task. Say it before the next task gets the chance to absorb it. You are allowed to be ambitious and still be soft underneath it. What feeling has been waiting for its turn?`,
    },

    '9_LIFEPATH': {
      title: `Life Path 9 — The Humanitarian`,
      mastery: `Giving isn't generosity for you so much as reflex — your first instinct is to hand over whatever's needed before anyone's had to ask. You're direct, warm, and refreshingly free of guile. You forgive fast, sometimes faster than the situation actually earned. People sense they can be honest with you without being punished for it.`,
      shadow: `You rarely notice when giving has stopped being reciprocal, and by the time you do, the resentment has already been quietly accumulating. The habit of giving without keeping score makes it genuinely hard to notice when the balance has tipped. Given enough repetition, that blind spot can leave you depleted in relationships that were never actually asking this much of you. Forgiving this quickly can also mean skipping the part where the actual harm gets acknowledged.`,
      career: `Nonprofit and humanitarian work, law, teaching, the arts — anything built around other people's wellbeing.`,
      love: `You love generously, sometimes to a fault, giving before it's asked for and rarely keeping score — which is exactly how the imbalance starts.`,
      invitation: `Ask directly today for one thing you need, with the same plainness you'd use to offer it to someone else. Let the request stand without immediately minimizing it. You are allowed to receive with the same fullness you give. What have you been needing that you've never actually said out loud?`,
    },

    '11_LIFEPATH': {
      title: `Master Number 11 — The Illuminator`,
      mastery: `You read rooms and people faster than you can explain how, and you carry a pull toward meaning that ordinary routine has never quite satisfied. You're inspired, magnetic without trying to be, and drawn to work that feels like more than a paycheck. People remember meeting you longer than you'd expect. Ideas and insight can arrive to you with unusual force, ahead of the reasoning that would normally justify them.`,
      shadow: `You live in the gap between the size of what you can imagine and the size of what you've actually built, holding people to a standard the real world was never going to meet. That gap can leave the vision feeling more real to you than the ordinary progress actually being made. Left unexamined, holding everything to an ideal can quietly rob real, solid progress of the credit it deserves. Ordinary days can feel like a letdown next to a vision this vivid.`,
      career: `Teaching, art, ministry, coaching — anything that functions as a calling rather than a job.`,
      love: `You love with real intensity once you've found someone who meets you on the same frequency, but you quietly hold the relationship to an ideal no ordinary Tuesday will live up to.`,
      invitation: `Turn one piece of the vision into a single, small, concrete action today, not the whole thing. Let that small piece be enough for today. You are allowed to be intense and still be practical about it. What vision have you been carrying without building?`,
    },

    '22_LIFEPATH': {
      title: `Master Number 22 — The Master Builder`,
      mastery: `You can take something enormous in your head and actually finish building it in the world — not just imagine it, finish it. You're tireless, organized, and quietly restless when you're not building something real. People underestimate how much you're carrying until they see what you've finished. Ambition energizes you rather than intimidating you, even at a scale that would overwhelm most people.`,
      shadow: `The size of what you're capable of building doesn't leave much room for your own limits, and the body carrying this ambition tends to lag behind the mind driving it. That mismatch rarely announces itself until it's already cost you something. Across enough repetitions, the scale of what feels achievable can quietly outpace what's actually sustainable to carry. Tirelessness this consistent can look like strength right up until it becomes the thing that finally breaks down.`,
      career: `Architecture, engineering, large-scale construction, systems-building, civic leadership — anywhere the thing you make outlasts you.`,
      love: `You build relationships the way you build everything else — for the long term, wanting a partner who feels like part of the structure.`,
      invitation: `Measure today's progress only against what you've actually built, not the full scale of what you eventually intend. Let that smaller measure be genuinely enough for today. You are allowed to build big and still rest deliberately. Where has ambition been outrunning your body?`,
    },

    '33_LIFEPATH': {
      title: `Master Number 33 — The Master Healer`,
      mastery: `Something in you gives without waiting to be asked — not performed kindness, closer to a reflex you were built with. You're compassionate, gentle, and unusually attuned to what other people need, sometimes before they know it themselves. People bring you their real problems, sensing correctly that you'll actually hold them well. That depth of care is rare enough to be worth naming as a genuine gift.`,
      shadow: `Giving without limit slowly starts to look like disappearing — your needs quietly moved to the bottom of a list you never actually wrote down. The scale of what you're able to give can make it easy to mistake constant giving for the only acceptable version of this gift. Unchecked, that pattern can leave you depleted in the exact role meant to feel like purpose. Gentleness this consistent rarely gets the same gentleness offered back to it.`,
      career: `Teaching, counseling, ministry, hospice and healing work, nonprofit leadership — anywhere your presence is genuinely part of the service.`,
      love: `You love as an act of care, tuned to what someone needs before they've said it, which is exactly how you end up depleted if nobody's giving it back.`,
      invitation: `Let one act of care land today without deflecting it, minimizing it, or rushing to return the favor. Simply receive it and let that be enough. You are allowed to receive with the same fullness you give. What need of yours deserves the devotion you offer everyone else?`,
    },

    // ── Birthday Number (classical, day-of-birth only — natural-talent
    // number, distinct from Life Path). See research build note for the
    // formula (js/matrix-engine.js's birthdayNumber()). ─────────────────────
    '1_BIRTHDAY': {
      title: `Birthday Number 1 — A Talent for Starting Things`,
      mastery: `You were born knowing how to move first. Something in you understands how to look at a gap nobody else is filling and simply step into it. You act quickly and decisively, often before you've fully explained your reasoning to anyone. Momentum genuinely excites you in a way planning committees never will.`,
      shadow: `You mistake being first for being right, and start resenting people for needing more time to catch up to a decision you made instantly. That impatience can read as dismissiveness to people who genuinely needed more time to think it through. Over time, moving first this consistently can leave you making calls other people never actually got a say in. Speed this natural rarely leaves room to notice when it's actually outrunning good judgment.`,
      invitation: `Use this instinct today on something genuinely small — a conversation you've been putting off, a task nobody's watching. Notice what it costs you to move first on something low-stakes. You are allowed to take credit for what comes easily. What has "it's just what I do" been talking you out of noticing?`,
    },
    '2_BIRTHDAY': {
      title: `Birthday Number 2 — A Talent for Reading the Room`,
      mastery: `You arrived already fluent in sensing what's actually happening beneath what's being said, picking up the tension nobody named. You notice tone shifts and the gap between someone's words and their face. People find you easy to be honest with, even when they can't say why. That perceptiveness lets you defuse tension most people never even register.`,
      shadow: `You shape yourself entirely around what a room wants, losing track of your own position, and never quite say what you need. Reading everyone else this closely can quietly crowd out the question of what you actually think. Left unaddressed, that pattern can leave you known for your perceptiveness and rarely known for anything else. Being trusted with everyone else's honesty rarely means anyone thinks to ask for yours.`,
      invitation: `Trust one read on someone today instead of second-guessing it into silence. Say it out loud rather than keeping it to yourself. You are allowed to call that a skill, not luck. Where has this sensitivity been doing real work with zero credit attached?`,
    },
    '3_BIRTHDAY': {
      title: `Birthday Number 3 — A Talent for Expression`,
      mastery: `You showed up already knowing how to make a room feel more alive, without ever being taught the mechanics of it. You find the funny angle on things quickly. People are drawn to talk to you even in silence-heavy rooms. Warmth arrives from you as instinct, not effort.`,
      shadow: `You deflect anything that asks for real vulnerability behind one more joke, becoming the person everyone enjoys and nobody quite knows. The charm works so well that even you can lose track of what's underneath the performance. Given enough repetition, that pattern can leave you well-liked and genuinely lonely at the same time. Being the fun one can quietly become the only role anyone expects you to play.`,
      invitation: `Say one unpolished, true thing today without dressing it up first. Let it land without the usual joke to soften it. You are allowed to be less charming and more true in the same sentence. What have you been dressing up specifically so it would be easier to hear?`,
    },
    '4_BIRTHDAY': {
      title: `Birthday Number 4 — A Talent for Building`,
      mastery: `You were born with the ability to take something formless and give it real structure, trusting consistency more than inspiration. You default to practical solutions before creative ones. Long-term projects don't scare you the way they scare most people. Follow-through comes to you as naturally as inspiration comes to other people.`,
      shadow: `Your steadiness calcifies into rigidity — one right way to do a thing, and real frustration with anyone who suggests another. That certainty about the right approach can shut down a genuinely useful alternative before it's even been considered. Left unexamined, that pattern can leave collaborators feeling managed rather than included. Consistency this reliable can be mistaken, even by you, for the only correct way to do things.`,
      invitation: `Loosen your grip today on one process that doesn't actually need to be so exact. Notice what happens when you let it be good enough instead of exactly right. You are allowed to build carefully and still leave room for another way. Where has your need for order stopped protecting something and started constraining it?`,
    },
    '5_BIRTHDAY': {
      title: `Birthday Number 5 — A Talent for Adapting`,
      mastery: `You arrived already equipped with genuine ease with change. Where other people brace for disruption, you lean toward it, curious rather than afraid. You pick up new skills and situations quickly. You genuinely enjoy the unplanned detour more than the itinerary.`,
      shadow: `Your adaptability becomes an excuse to never actually land anywhere, mistaking restlessness for growth. The ease of moving on can substitute for the harder work of actually staying with something difficult. Across enough repetitions, that pattern can leave a long trail of interesting starts and comparatively few things carried through. Novelty is easy to chase and quick to fade, which is exactly what keeps the pattern running.`,
      invitation: `Stay inside one uncomfortable moment today instead of adapting your way out of it immediately. Notice what's actually there once you stop moving past it. You are allowed to want stability and still be genuinely excited by what's shifting. What are you actually moving toward, not just away from?`,
    },
    '6_BIRTHDAY': {
      title: `Birthday Number 6 — A Talent for Care`,
      mastery: `You were born already knowing how to make a space feel held, noticing what needed fixing or softening before anyone explained it. You notice what a room or a person needs before they've asked. People tend to relax around you without quite knowing why. That instinct for care runs quietly in the background of almost everything you do.`,
      shadow: `Your caretaking becomes compulsive — responsibility you never actually agreed to, while your own needs sit unaddressed at the bottom of the list. That instinct to tend can override any sense of whether the tending was actually wanted. Unchecked, that pattern can leave you exhausted in ways nobody around you notices, because none of it ever looked like effort. Care this automatic can be extended to people who never actually reciprocate it.`,
      invitation: `Let one thing today go uncared-for that genuinely isn't yours to manage. Notice what happens when you don't step in. You are allowed to trust people with their own struggles. Who might grow if you stepped back one pace?`,
    },
    '7_BIRTHDAY': {
      title: `Birthday Number 7 — A Talent for Depth`,
      mastery: `You arrived already pulled toward understanding things at their root, suspicious of the easy answer before anyone taught you to be. You ask the follow-up question other people don't think to ask. Solitude restores you in a way company rarely does. Real, hard-won insight tends to arrive from you only after real, uninterrupted quiet.`,
      shadow: `Your depth becomes a hiding place — endless analysis standing in for actual rest, understanding pursued so relentlessly it replaces living. The search for a complete answer can quietly become a reason to keep postponing action. Over time, that pattern can leave real conclusions sitting fully formed and never actually acted on. Depth this consistent can start to look, from the outside, like distance.`,
      invitation: `Let one question stay genuinely unanswered today instead of chasing it down to the end. Notice what it's like to leave something unresolved on purpose. You are allowed to want understanding and still act before it's complete. Where has needing full clarity kept you from something worth taking anyway?`,
    },
    '8_BIRTHDAY': {
      title: `Birthday Number 8 — A Talent for Execution`,
      mastery: `You were born with an instinct for turning ambition into something you can actually point to, understanding the difference between an idea and a finished thing. You default to action once a decision's been made. People trust you with things that actually need to get done. Execution comes to you as naturally as dreaming comes to other people.`,
      shadow: `Your capability turns into a scoreboard you can never stop checking, quietly discounting anything that didn't show up as a tangible result. The measurable win can start to feel like the only kind of win that actually counts. Left unaddressed, that pattern can leave real, meaningful progress feeling hollow simply because it wasn't countable. Capability this reliable can quietly convince you that rest has to be earned first.`,
      invitation: `Count today as good for a reason that has nothing to do with what you produced. Name that reason specifically, out loud. You are allowed to want results and still count a soft success as real. Where has needing a measurable outcome discounted something that actually mattered?`,
    },
    '9_BIRTHDAY': {
      title: `Birthday Number 9 — A Talent for Compassion`,
      mastery: `You arrived already able to feel what other people are going through, almost before they've said it out loud. You pick up on other people's pain quickly, sometimes before your own registers. Generosity feels natural to you, not effortful. People sense they can bring you their real feelings without being managed or minimized.`,
      shadow: `Your compassion becomes depleting — giving until there's nothing left over, feeling everyone's pain so thoroughly your own gets lost in the noise. That sensitivity to other people can make your own needs genuinely hard to locate, let alone name. Given enough repetition, that pattern can leave you generous toward everyone except yourself. Feeling everything this fully rarely leaves much left over for feeling your own.`,
      invitation: `Keep one small thing today purely for yourself, unshared and unspent on anyone else. Let it be enough that it's just for you. You are allowed to take this gift seriously enough to actually use it on yourself too. What have you been feeling for everyone else without ever turning toward your own?`,
    },
    '11_BIRTHDAY': {
      title: `Master Birthday Number 11 — A Talent for Insight`,
      mastery: `You were born carrying an intuitive sensitivity that arrives before logic can catch up, sensing what's coming well ahead of the evidence others wait for. You sense shifts in a room, a plan, or a person before anyone names them out loud. Ideas arrive to you fully formed. That sensitivity is real, rare, and worth trusting even without the reasoning to back it up yet.`,
      shadow: `This heightened sensitivity stays trapped in your own head, insight that never gets spoken because the intensity of it feels safer kept private. Keeping it private can feel protective, but it also means the insight never actually gets to help anyone. Left unexamined, that pattern can leave real perception sitting unused, known only to you. The intensity of the knowing can make it feel too strange to say out loud, even when it's exactly right.`,
      invitation: `Follow one instinct today before you can fully explain why. Say what you sense out loud, even without the reasoning fully worked out. You are allowed to be known as deeply as you know. What have you known for a long time that you've simply never said?`,
    },
    '22_BIRTHDAY': {
      title: `Master Birthday Number 22 — A Talent for Making Things Real`,
      mastery: `You arrived carrying genuine vision paired with the practical capacity to actually build it, taking something enormous and finishing it in the material world. You think in systems and structures, not just isolated ideas. Ambition energizes you rather than intimidating you. Projects that would overwhelm most people genuinely excite you.`,
      shadow: `This rare capability stalls at the planning stage — ambition so large it never fully commits to a first, imperfect, small step. The scale of the vision can make any single starting move feel too small to matter. Across enough repetitions, that pattern can leave genuinely achievable projects stuck permanently at the blueprint stage. The bigger the vision, the easier it becomes to keep refining it instead of actually starting it.`,
      invitation: `Turn one idea into a genuinely small, real first step today. Take that step even though it's far smaller than the full vision. You are allowed to build big and still start small. What's the first, smallest real piece of this that could exist by tonight?`,
    },
    '33_BIRTHDAY': {
      title: `Master Birthday Number 33 — A Talent for Healing`,
      mastery: `You were born with an unusually deep capacity for service, care so genuine that other people can feel it land as something structural to who you are. People bring you their real problems, sensing you'll actually hold them well. You give without keeping score. That depth of care is rare enough to be worth naming as a genuine gift, not just a trait.`,
      shadow: `This depth of care becomes self-erasing — giving so completely that your own needs quietly stop registering as needs at all. The scale of what you're able to give can make it easy to mistake constant giving for the only acceptable version of this gift. Unchecked, that pattern can leave you depleted in the exact role that was meant to feel like purpose. Being this reliably needed rarely leaves room to notice when you need something back.`,
      invitation: `Name one thing you need today instead of assuming it can wait until everyone else's needs are met. Say it plainly, without minimizing it first. You are allowed to receive with the same fullness you give. What need of yours deserves the devotion you offer everyone else?`,
    },

    // ── Personal Year (classical, birth month + birth day + CURRENT year —
    // dynamic, changes annually). Distinct from the app's Arcana-based
    // Yearly Energy. ─────────────────────────────────────────────────────────
    '1_PYEAR': {
      title: `Personal Year 1 — A Year for Starting Over`,
      mastery: `This year is asking for a real beginning — a new project, a new direction, a version of your life that doesn't need the old one's permission. Momentum feels more available to you right now than usual. New ideas arrive with unusual clarity. Decisions carry more weight and more possibility than they have in a while.`,
      shadow: `You mistake motion for direction — starting things simply to feel the relief of movement, without checking whether they deserve the energy. That relief can feel like progress even when nothing about the direction has actually been chosen. Over time, this year's momentum can leave you further along without necessarily being further ahead. New beginnings can be chased for their own sake, whether or not they're actually going anywhere.`,
      invitation: `Begin one thing this month that you've been circling for a while, even before you feel fully ready. Choose it on purpose rather than reaching for whatever's simply available. You are allowed to lead this chapter of your life. What have you been waiting for someone else to greenlight?`,
    },
    '2_PYEAR': {
      title: `Personal Year 2 — A Year for Partnership`,
      mastery: `This year turns your attention toward other people — genuine cooperation, patience, and relationships that need real tending. You're more sensitive to other people's needs and moods than usual. Partnerships carry unusual weight this year. Two people moving together, at the speed trust actually requires, can accomplish something individual momentum never could.`,
      shadow: `Your patience slides into passivity — waiting so thoroughly for the right moment that you forget to actually say what you think. That waiting can feel like consideration even in the moments it's actually avoidance. Left unaddressed, this year's cooperative pull can leave your own preference quietly unspoken more often than it should be. Real cooperation still requires you to remain a full person inside it, not a mirror.`,
      invitation: `Be patient with one situation this month without giving up your own voice inside it. Say your actual preference even while staying patient. You are allowed to partner with someone without disappearing into the partnership. Where has cooperation quietly become self-erasure?`,
    },
    '3_PYEAR': {
      title: `Personal Year 3 — A Year for Being Seen`,
      mastery: `This year opens up real room for expression, creativity, and being visible in a way the previous years didn't especially favor. Your natural charm and expressiveness are more available this year. Social opportunities tend to multiply. This is a genuinely rare stretch, and the ease it offers is worth using rather than only enjoying.`,
      shadow: `You scatter this abundant energy across too many fun, low-stakes distractions, leaving the creative work you care about unfinished. The sheer number of appealing options this year can make any single one feel less urgent to actually finish. Given enough repetition, that pattern can leave a year full of activity and comparatively little to show for it. A season built for visibility still needs something finished to actually show.`,
      invitation: `Share one thing you've made this month, even in an unfinished state. Let it be seen before it feels fully ready. You are allowed to be taken seriously and still be genuinely fun. What have you been underselling this year?`,
    },
    '4_PYEAR': {
      title: `Personal Year 4 — A Year for Groundwork`,
      mastery: `This year is less about excitement and more about consequence — the discipline and structure you put in place now determine how solid the years ahead are. Patience for slow, unglamorous work tends to be higher than usual. Long-term thinking comes more naturally right now. Some of the most consequential work in a life doesn't look exciting while it's happening.`,
      shadow: `Necessary structure tips into rigid over-control — becoming so committed to the plan you can't adjust it even when it clearly needs revising. The seriousness of this year's work can make any deviation from the plan feel riskier than it actually is. Left unexamined, that rigidity can cost you exactly the flexibility a genuinely good plan sometimes needs. A foundation is meant to hold weight, not to be so fixed it can never be corrected.`,
      invitation: `Stick with one unglamorous task this month past the point where it stops feeling exciting. Notice what actually gets built once the excitement wears off. You are allowed to build carefully and still adjust the plan. What structure from this year needs an honest update?`,
    },
    '5_PYEAR': {
      title: `Personal Year 5 — A Year for Change`,
      mastery: `This year deliberately shakes things loose — genuine unpredictability arrives and rewards flexibility far more than resistance. Restlessness and curiosity both run higher than usual. Your tolerance for routine is probably at its lowest point in the whole cycle. Adaptability becomes less a skill and more the actual current this year runs on.`,
      shadow: `You chase every new option this year offers without letting any single one have the time it needs to actually become something real. The appeal of the next new thing can make whatever you already started feel finished before it actually is. Across enough repetitions, that pattern can leave this year full of beginnings and comparatively few things carried through. Motion isn't the same as growth, even during a stretch built around motion.`,
      invitation: `Say yes to one genuinely unplanned opportunity this month. Let one thing this year also actually finish, not just start. You are allowed to want stability and still be genuinely excited by what's shifting. What are you actually moving toward this year, not just away from?`,
    },
    '6_PYEAR': {
      title: `Personal Year 6 — A Year for Home and Responsibility`,
      mastery: `This year turns your attention toward home, family, and the people closest to you — real responsibility, and the reward of tending to what matters most. Your instinct to care for people and spaces is stronger than usual this year. You're likely to be leaned on more this year. Showing up fully for the people closest to you, this year, is a genuine act of maturity.`,
      shadow: `You over-function for everyone around you until the whole year gets spent managing other people's needs, with none of that care coming back. Being leaned on this consistently can make it genuinely hard to notice when your own needs have stopped counting. Unchecked, that imbalance can leave you depleted in the exact year meant to feel meaningful. A year built around responsibility to others is not the same as a year built around erasing yourself.`,
      invitation: `Ask someone for real help with one responsibility this month, instead of carrying all of it alone. Let the request stand without immediately minimizing it. You are allowed to be needed and still need things yourself. Who could actually share this load with you right now?`,
    },
    '7_PYEAR': {
      title: `Personal Year 7 — A Year for Reflection`,
      mastery: `This year pulls inward on purpose — study, solitude, and real reflection are favored over the outward-facing momentum of other years. Your need for solitude and depth is stronger than usual this year. Intuition and insight tend to sharpen considerably. Some understanding, this year, can only be reached alone.`,
      shadow: `You retreat so far inward that needed rest turns into genuine disconnection from the people who actually care about you. The depth this year offers can start to feel safer than any return to ordinary connection. Over time, that pattern can leave you quietly harder to reach than you meant to become. Reflection that never resurfaces just becomes distance with a better excuse.`,
      invitation: `Reach out to one person this month even in the middle of a quieter season. Let the reaching out happen before it feels fully necessary. You are allowed to need solitude and still stay reachable. What have you been sitting with alone for too long?`,
    },
    '8_PYEAR': {
      title: `Personal Year 8 — A Year for Ambition`,
      mastery: `This year favors material progress — career, money, and real authority all tend to move more than usual, rewarding focused, deliberate effort. Your drive and capacity for sustained effort are unusually high this year. You're likely to feel more comfortable claiming real authority. Opportunities tied to leadership and money tend to surface more frequently right now.`,
      shadow: `You measure the entire year purely by results, letting anything that doesn't show up on a scoreboard quietly stop counting. The bigger the stakes get this year, the easier it becomes to justify ignoring what the pursuit is actually costing you. Left unaddressed, that pattern can leave real, meaningful progress feeling hollow simply because it wasn't measurable. Real consequence doesn't have to mean a year narrowed down to only what's countable.`,
      invitation: `Note one non-material win this month alongside whatever material progress you're making. Let that softer win count for just as much. You are allowed to be ambitious and still be soft underneath it. What has the scoreboard been quietly drowning out this year?`,
    },
    '9_PYEAR': {
      title: `Personal Year 9 — A Year for Letting Go`,
      mastery: `This year closes out its nine-year cycle — endings, release, and clearing space for what's next are the actual work of a year like this. A pull toward simplifying and releasing is stronger than usual this year. Generosity and a wider perspective tend to come more easily. Some endings, this year, aren't failures — they're simply what has to happen before the next real thing can begin.`,
      shadow: `You cling to what this year is trying to close, dragging an ending out well past the point it needed to end. Resisting a closing chapter doesn't stop it from closing — it just makes the closing harder. Given enough repetition, that resistance can cost more than the ending itself ever would have. Old identities or commitments may start to feel like they no longer fit, and holding on past that point rarely serves you.`,
      invitation: `Release one thing this month that's already run its actual course. Name it plainly as finished rather than extending it further. You are allowed to grieve an ending and still walk into what's next. What are you still holding this year that already left?`,
    },
    '11_PYEAR': {
      title: `Master Personal Year 11 — A Year of Heightened Intuition`,
      mastery: `This master year carries real charge — inspiration and insight run ahead of logic, and genuine creative or spiritual downloads arrive asking to be acted on. Your intuition is unusually sharp this year. Ideas and insights arrive with more force and frequency than usual. A sense of standing at a genuine threshold tends to color the whole year.`,
      shadow: `You stay purely inspired without grounding any of it into something real, feeling electric all year with nothing actually built to show for it. The charge itself can feel like enough, right up until the year ends and little concrete is left to show for it. Left unexamined, that pattern can leave real insight sitting unused, sealed inside you. A calling this intense still needs an actual outlet, or the intensity just becomes exhausting.`,
      invitation: `Turn one insight this month into a real, concrete action, however small. Let that small action be enough for now. You are allowed to be intense this year and still be practical about it. What vision have you been carrying without building?`,
    },
    '22_PYEAR': {
      title: `Master Personal Year 22 — A Year for Building Big`,
      mastery: `This master year carries a rare combination — genuine capacity to build something large and lasting, pairing vision with the follow-through to finish it. Your ability to combine big-picture vision with practical execution is heightened this year. Your energy and drive are considerable, though not infinite. Projects that once felt too big may suddenly feel genuinely achievable.`,
      shadow: `You overextend past your actual capacity, letting the scale of what's possible outpace what your body and nervous system can sustain. That mismatch rarely announces itself until it's already cost you something. Across enough repetitions, the scale of what feels achievable this year can quietly outpace what's actually sustainable to carry. A year built for building something lasting still requires you to survive building it.`,
      invitation: `Pace one big project this month against your real energy, not just its potential scale. Let that pacing be deliberate, not an afterthought. You are allowed to build big this year and still rest deliberately. Where has ambition been outrunning your body?`,
    },
    '33_PYEAR': {
      title: `Master Personal Year 33 — A Year of Deep Service`,
      mastery: `This master year puts you in a position to genuinely help, teach, or heal others in a way that carries real weight. Your instinct to care for and guide others is stronger than usual this year. A sense of larger purpose runs underneath the year's ordinary events. People may seek you out for guidance more than usual right now.`,
      shadow: `You give so completely to others this year that your own needs get quietly deprioritized, until sustainable service becomes depleting instead. The scale of what you're able to give this year can make it easy to mistake constant giving for the only acceptable version of this calling. Unchecked, that pattern can leave you depleted in the exact year meant to feel purposeful. A year built around deep service was never meant to be a year built around self-abandonment.`,
      invitation: `Keep one part of this month purely for yourself, unspent on anyone else's needs. Let it be enough that it's just for you. You are allowed to serve deeply this year and still be replenished. What has this calling been costing you that you haven't named yet?`,
    },


    // ── Lineage Square Talents: Paternal Spiritual Talent (F2) ─────────────
    // Source: Destiny-Matrix-Calculation-Guide.extracted.md, Page 6 — "F2
    // represents the talent inherited from the paternal line," one of the
    // guide's three named core talents (alongside K/personal and G2/
    // maternal). F2 = reduce(F + L2), where F is the Paternal Spiritual
    // ancestral corner and L2 is the combined strength of the whole
    // ancestral square — a gift carried through the father's line,
    // specifically in the spiritual/inspirational register F already sits
    // in (vision, meaning, calling), distinct from H2's material register.

    '1_F2': {
      title: `1 in Paternal Spiritual Talent — The Magician`,
      tagline: `A Design of Inherited Initiative`,
      mastery: `The capacity to simply begin — to turn a thought into motion without waiting for anyone's go-ahead — arrived in you already built, carried down your father's line rather than assembled by your own trial and error. You didn't have to learn that hesitation is optional; some part of you has always known it. When you actually use it, you move first with a fluency that looks effortless to people who had to build that same courage from scratch. It shows up earliest in moments that call for someone to simply act, before the plan is fully formed.`,
      shadow: `A gift that arrived pre-made is easy to under-claim, since it never cost you anything to acquire and so can feel like it isn't really yours to take credit for. You may downplay your own decisiveness, treating it as luck or circumstance rather than a real inheritance you're free to use on purpose. Left unclaimed, it can also run on autopilot — initiating out of reflex rather than real intention, because you've never had to consciously choose it. The gift stays technically available to you without ever becoming something you deliberately wield.`,
      invitation: `Ask yourself what you'd attempt this week if you actually claimed this instinct as earned, not borrowed. Start one real thing on purpose, naming to yourself that the ease you feel doing it is a genuine inheritance. You are allowed to take credit for a gift you didn't personally build. What might change if you stopped treating this ease as accidental?`,
    },
    '2_F2': {
      title: `2 in Paternal Spiritual Talent — The High Priestess`,
      tagline: `A Design of Inherited Perception`,
      mastery: `A quiet, accurate read on what's happening beneath the surface of a room or a person came to you already formed, passed down your father's line as a genuine spiritual inheritance rather than something you had to train into existence. You sense the unspoken truth of a situation the way some people sense weather changing. When you trust it, that perception moves ahead of explanation, landing on what's actually true before anyone's said it aloud. It's most active in moments of real ambiguity, where other people are still guessing.`,
      shadow: `Because this knowing never had to be earned through visible effort, it's easy to treat it as unremarkable — just intuition, not a real inherited capacity worth naming. You may hold back what you perceive, unsure whether an unearned gift is allowed to carry real authority. Left unclaimed, the perception stays private, offered to no one, doing you no good beyond your own awareness. A spiritual inheritance kept entirely to yourself functions, in practice, as though it were never given at all.`,
      invitation: `Ask yourself what you already sense clearly but have never called a real gift. Voice one accurate perception out loud this week, plainly, as something you're entitled to trust. You are allowed to claim an inheritance you didn't personally earn. What might you notice if you treated this knowing as authority rather than guesswork?`,
    },
    '3_F2': {
      title: `3 in Paternal Spiritual Talent — The Empress`,
      tagline: `A Design of Inherited Generativity`,
      mastery: `A genuine capacity to nurture ideas, people, and possibilities into something real was handed to you through your father's line, already alive rather than something you had to cultivate from bare ground. Things grow near you with a naturalness that took no deliberate technique to develop. When you lean into it, that generative warmth moves through whatever you touch, spiritual in origin even when its results are entirely practical. It surfaces most clearly around anything still young and unformed that needs real encouragement to keep going.`,
      shadow: `A talent this easy to access can be mistaken for simple temperament rather than a real inheritance worth directing on purpose. You may let it run diffusely — a general warmth offered to everyone equally — instead of aiming it deliberately at what actually deserves this much cultivation. Left unclaimed, the gift can also feel slightly unreal to you, since it arrived without struggle, and what arrives without struggle can be quietly discounted as not fully earned or fully yours. Diffuse enough for long enough, it can end up growing very little of anything in particular.`,
      invitation: `Ask yourself what's currently growing near you that would benefit from this care directed on purpose rather than diffusely. Choose one specific person or project this week and give it your full generative attention. You are allowed to own a gift you never had to struggle for. Where could this inheritance do more if it were aimed rather than simply ambient?`,
    },
    '4_F2': {
      title: `4 in Paternal Spiritual Talent — The Emperor`,
      tagline: `A Design of Inherited Order`,
      mastery: `The ability to bring real structure to something formless arrived in you already whole, a spiritual inheritance from your father's line rather than a skill built through years of trial. You look at chaos and can already see the frame that would hold it steady, without having had to earn that clarity through repeated failure. When you use it fully, that instinct for order moves with an authority other people had to work much harder to develop. It shows up soonest in situations that are actively falling apart around everyone else.`,
      shadow: `Because this capacity never demanded visible struggle, you may treat it as ordinary rather than as the genuine gift it is, quietly assuming everyone can see the frame as clearly as you do. Left unclaimed, it can also default to rigidity rather than deliberate structure, imposing order out of reflex instead of considered judgment. An inheritance never consciously claimed tends to run on autopilot, structuring things whether or not structure was actually being asked for. Other people can end up living inside a frame they never actually agreed to.`,
      invitation: `Ask yourself where you've been building order out of habit rather than actual decision. Choose one situation this week and bring structure to it deliberately, naming to yourself that the clarity is a real, inherited strength. You are allowed to claim authority you didn't personally build from scratch. What might this gift do if you aimed it on purpose?`,
    },
    '5_F2': {
      title: `5 in Paternal Spiritual Talent — The Hierophant`,
      tagline: `A Design of Inherited Wisdom`,
      mastery: `A genuine feel for what's proven, tested, and worth passing on came to you already formed through your father's line — an inherited sense for real wisdom, not something you had to earn through your own long trial. You recognize a sound framework almost on contact, the way some people recognize a familiar voice. When trusted, that discernment moves with an authority that took other people real years to build. It's most active whenever something genuinely needs a tested structure rather than a fresh improvisation.`,
      shadow: `A wisdom that arrived without your own hard-won experience behind it can feel borrowed rather than truly yours, and borrowed authority is easy to underuse out of a quiet sense you haven't earned the right to speak with it. Left unclaimed, it can also calcify into rule-following for its own sake, deferring to the inherited framework even in the rare moment that actually calls for something new. An inheritance never examined stays a script rather than becoming genuine, owned understanding. What was meant to be a foundation can end up functioning as a ceiling instead.`,
      invitation: `Ask yourself which piece of inherited wisdom you've been sitting on without actually offering it. Share one piece of tested understanding this week as something you're genuinely entitled to teach. You are allowed to speak with authority you inherited rather than personally forged. Where might this gift matter more if you actually claimed it?`,
    },
    '6_F2': {
      title: `6 in Paternal Spiritual Talent — The Lovers`,
      tagline: `A Design of Inherited Discernment`,
      mastery: `The capacity to choose deliberately — values fully intact, rather than drifting into whatever's convenient — arrived in you already developed, a spiritual inheritance from your father's line rather than a discipline you had to build alone. You can tell, almost instantly, whether something actually aligns with what you believe. When trusted, that discernment moves ahead of second-guessing, landing on genuine alignment before you've had to reason your way there. It's sharpest at real forks, where the easy option and the true option visibly diverge.`,
      shadow: `Because this clarity never cost you visible struggle, you may not fully credit it as real judgment, treating your own alignment as luck rather than as a genuine capacity worth trusting on purpose. Left unclaimed, the gift can also go unused at the exact moments it matters most, deferred to convenience simply because using it deliberately never became a practiced habit. An inheritance you don't actively claim rarely shows up when the stakes are actually high. The choices that mattered most can end up being the ones this gift was never actually invited into. A devotion never consciously chosen can start to feel more like habit than genuine love.`,
      invitation: `Ask yourself which recent choice you made by default rather than by genuinely consulting this inherited discernment. Make one decision this week by deliberately checking it against what you actually value. You are allowed to trust a clarity you didn't personally have to earn. Where might this gift change your next real choice?`,
    },
    '7_F2': {
      title: `7 in Paternal Spiritual Talent — The Chariot`,
      tagline: `A Design of Inherited Drive`,
      mastery: `A capacity for sustained, directed momentum came to you already running, carried through your father's line as a genuine spiritual inheritance rather than motivation you had to manufacture from nothing. You move toward a chosen destination with a steadiness other people had to train themselves into over years. When fully claimed, that drive moves with a confidence that looks, from the outside, like natural talent rather than the inheritance it actually is. It's most alive whenever there's real distance left to cover and a clear direction to cover it in.`,
      shadow: `Because this drive never had to be built through visible effort, it's easy to treat it as simple personality rather than a real gift worth directing on purpose. Left unclaimed, it can run without a chosen destination, generating motion for its own sake rather than aimed at something you've actually decided matters. An inheritance never consciously steered tends to keep moving regardless of whether the direction still makes sense. Distance covered can be mistaken for progress made, even when the two have quietly stopped matching.`,
      invitation: `Ask yourself whether your current momentum is actually aimed at something you chose, or simply running on inherited habit. Name one real destination this week and direct this drive at it deliberately. You are allowed to claim momentum you didn't personally have to build. Where might this gift take you if you actually pointed it?`,
    },
    '8_F2': {
      title: `8 in Paternal Spiritual Talent — Justice`,
      tagline: `A Design of Inherited Fairness`,
      mastery: `A sharp, reliable sense of what's fair and what's out of balance arrived in you already calibrated, a spiritual inheritance from your father's line rather than an ethic you had to build from scratch through hard experience. You register imbalance almost involuntarily, the way some people register an off note in music. When claimed fully, that instinct moves with an authority other people spend years developing through trial. It's most active in situations everyone else is still calling merely "complicated." People come to trust your read on a situation precisely because it rarely needs revising later.`,
      shadow: `Because this clarity arrived without visible struggle, you may underclaim it, treating your own sense of fairness as simply personality rather than a real inheritance worth trusting with weight. Left unclaimed, it can also go rigid, applying an inherited standard mechanically rather than with the discernment a truly owned ethic would bring. An inheritance never examined can enforce fairness without actually understanding why the standard exists. A standard applied without that understanding can end up landing harder than it was ever meant to. Fairness this automatic still deserves the same scrutiny you'd give any conclusion you actually had to work for.`,
      invitation: `Ask yourself where you've applied this sense of fairness automatically rather than with real thought behind it. Bring this instinct to one situation this week deliberately, naming it as a genuine inherited strength rather than mere reflex. You are allowed to claim ethical clarity you didn't personally forge alone. Where might this gift matter more if you actually owned it?`,
    },
    '9_F2': {
      title: `9 in Paternal Spiritual Talent — The Hermit`,
      tagline: `A Design of Inherited Depth`,
      mastery: `A genuine capacity for solitary, unhurried understanding arrived in you already present, a spiritual gift from your father's line rather than a discipline you had to build through years of forced isolation. You reach real depth in your own thinking with a naturalness some people never manage even with real effort. When fully claimed, that depth moves toward insight other people take far longer to arrive at. It's most alive in the quiet, away from noise, when there's genuinely nowhere else you need to be.`,
      shadow: `Because this depth never required visible struggle to access, you may treat it as simple preference rather than a real inheritance worth protecting and using deliberately. Left unclaimed, the insight it produces can stay entirely private, offered to no one, doing good only inside your own head. A spiritual gift never shared functions, for everyone but you, as though it had never been given at all. The quiet you protect it inside can quietly become the thing that keeps it from ever proving useful to anyone.`,
      invitation: `Ask yourself what you've understood in solitude that's actually ready to be spoken aloud. Share one piece of hard-won understanding this week as something you're genuinely entitled to offer. You are allowed to claim depth you didn't have to force yourself into. Where might this inheritance matter if it finally left the room with you?`,
    },
    '10_F2': {
      title: `10 in Paternal Spiritual Talent — The Wheel of Fortune`,
      tagline: `A Design of Inherited Timing`,
      mastery: `A genuine feel for when a cycle is turning arrived in you already active, a spiritual inheritance from your father's line rather than a sensitivity you had to develop through years of watching patterns repeat. You sense a shift in fortune, mood, or circumstance before it's officially announced. When claimed fully, that timing moves with a confidence other people spend a lifetime trying to build. It's sharpest right at the edge of a genuine turn, before anyone else has named what's actually changing.`,
      shadow: `Because this sense of timing never had to be earned through visible trial and error, you may discount it as mere hunch rather than a real inheritance worth acting on deliberately. Left unclaimed, it can also breed a kind of passivity — sensing the turn accurately and still waiting instead of acting, because trusting an unearned gift with real consequences feels riskier than it should. An inheritance never actually used stays a private observation rather than becoming genuine advantage. The window a turn actually opens rarely stays open long enough to reward hesitation. An attunement this sharp still needs the follow-through of actually moving when it speaks.`,
      invitation: `Ask yourself what shift you've already sensed clearly but haven't yet acted on. Act on one piece of this timing sense this week, treating it as a real, trustworthy inheritance. You are allowed to claim a feel for timing you didn't personally have to earn. Where might this gift matter if you actually moved on it?`,
    },
    '11_F2': {
      title: `11 in Paternal Spiritual Talent — Strength`,
      mastery: `A genuine capacity to stay steady and gentle under real pressure arrived in you already whole, a spiritual inheritance from your father's line rather than composure you had to forge through years of hardship. You meet difficulty without needing to dominate it or flee it, a quality other people spend real effort trying to build. When claimed fully, that steadiness moves with a quiet authority that reads, to people who had to earn theirs the hard way, as effortless grace. It's most present in the exact moments that would rattle almost anyone else.`,
      shadow: `Because this composure never required visible struggle to acquire, you may underclaim it, treating your own steadiness as simple temperament rather than a real inheritance worth actively directing. Left unclaimed, it can also curdle into over-accommodation — staying calm on everyone else's behalf while your own needs quietly go unheard, because the gift was never consciously claimed as something that has limits too. What reads to everyone else as ease can be quietly costing you more than anyone realizes. The steadiness other people lean on you for still needs somewhere to land when it's your turn to need it.`,
      invitation: `Ask yourself where you've been staying calm automatically rather than by real, conscious choice. Let yourself claim this steadiness openly this week, and notice where it might also need a boundary. You are allowed to own a gentleness you didn't personally have to fight for. Where might this inheritance serve you better if you actually named it as yours?`,
    },
    '12_F2': {
      title: `12 in Paternal Spiritual Talent — The Hanged Man`,
      tagline: `A Design of Inherited Perspective`,
      mastery: `The capacity to find real insight through pause rather than force arrived in you already developed, a spiritual gift from your father's line rather than patience you had to build through years of forced waiting. You see things from an angle other people reach only after considerable effort. When fully claimed, that perspective moves with an ease that looks, from outside, like natural wisdom rather than the inheritance it actually is. It surfaces most clearly whenever everyone else is still pushing and you're the one who's already still.`,
      shadow: `Because this perspective never cost you visible struggle, it's easy to treat it as passivity rather than the real gift it is, and to let waiting substitute for eventually acting. Left unclaimed, the insight it produces can stay permanently theoretical, admired privately but never brought back down into an actual decision. An inheritance held only in reflection never becomes anything more than that. The angle you see so clearly from up there still has to be climbed down from eventually.`,
      invitation: `Ask yourself what insight you've already reached through stillness that's actually ready to be acted on. Act on one piece of that understanding this week, treating the perspective as a genuine, usable gift. You are allowed to claim wisdom you didn't personally have to suffer for. Where might this inheritance matter once it comes down off the pause?`,
    },
    '13_F2': {
      title: `13 in Paternal Spiritual Talent — Death`,
      tagline: `A Design of Inherited Renewal`,
      mastery: `A genuine capacity to let old versions of things end so something truer can begin arrived in you already active, a spiritual inheritance from your father's line rather than resilience you had to build through years of hard loss. You move through real transformation with a fluency other people spend a long time learning. When claimed fully, that capacity moves toward rebirth other people take far longer to reach. It's most alive right at the edge of an ending everyone else is still resisting.`,
      shadow: `Because this ease with transformation never required visible suffering to earn, you may not credit it as real strength, treating your own resilience as coincidence rather than genuine inheritance. Left unclaimed, it can also tip into constant reinvention for its own sake, ending things reflexively rather than because they'd actually finished their course. An inheritance never consciously directed can dismantle things that didn't need dismantling. Some of what got ended along the way might genuinely have still had more to give.`,
      invitation: `Ask yourself whether a recent ending was genuinely necessary or simply reflex. Let one thing this week actually finish, on purpose, rather than starting the next reinvention immediately. You are allowed to claim a resilience you didn't personally have to earn through suffering. Where might this gift matter if you aimed it deliberately?`,
    },
    '14_F2': {
      title: `14 in Paternal Spiritual Talent — Temperance`,
      tagline: `A Design of Inherited Balance`,
      mastery: `A genuine capacity to blend competing forces into something coherent arrived in you already whole, a spiritual inheritance from your father's line rather than a skill you had to build through years of trial. You hold two different truths at once with an ease other people spend real effort developing. When claimed fully, that integration moves toward synthesis other people take far longer to reach. It's most alive whenever two things that don't naturally want to sit together are placed directly in front of you.`,
      shadow: `Because this balance never cost you visible struggle to build, you may underclaim it as simple temperament rather than the genuine gift it is. Left unclaimed, it can also default to a permanent, exhausting neutrality — holding the middle out of habit rather than choosing it deliberately, because taking a real side has never felt like something the gift requires of you. The middle can start to feel like the only place this gift is allowed to stand. A balance this practiced can start to look, from outside, like an inability to actually decide.`,
      invitation: `Ask yourself where you've been staying neutral automatically rather than by actual, considered choice. Take one clear position this week, using this integrative gift on purpose rather than letting it default to the middle. You are allowed to claim a balance you didn't personally have to struggle to build. Where might this inheritance matter if you occasionally aimed it at a real stance?`,
    },
    '15_F2': {
      title: `15 in Paternal Spiritual Talent — The Devil`,
      tagline: `A Design of Inherited Clarity`,
      mastery: `A genuine capacity to see desire, power, and attachment clearly, without flinching from them, arrived in you already active, a spiritual inheritance from your father's line rather than honesty you had to earn through real struggle. You understand what actually drives people with a directness other people spend years developing. When claimed fully, that clarity moves toward real insight other people take far longer to reach. It's most alive in situations everyone else is still politely avoiding looking at directly.`,
      shadow: `Because this clarity never cost you visible effort, you may not credit it as a real gift, treating your own unflinching sight as simply cynicism rather than genuine insight worth using with care. Left unclaimed, it can also tip into entanglement — seeing the chain clearly while still being ruled by it, because clear sight was never actually converted into deliberate freedom. Naming a chain accurately is not the same thing as actually being free of it. The clarity can start to feel like the whole achievement, when it was only ever meant to be the first step.`,
      invitation: `Ask yourself what you've seen clearly about your own attachments that you haven't yet acted on. Name one honest truth this week using this clarity on purpose, rather than only privately. You are allowed to claim an honesty you didn't personally have to fight to acquire. Where might this inheritance matter if you actually used it?`,
    },
    '16_F2': {
      title: `16 in Paternal Spiritual Talent — The Tower`,
      tagline: `A Design of Inherited Directness`,
      mastery: `A genuine capacity to see a failing structure clearly and early, before anyone else admits it's cracking, arrived in you already sharp, a spiritual inheritance from your father's line rather than instinct you had to build through repeated collapse. You register instability almost involuntarily, ahead of the official signs. When claimed fully, that clarity moves toward honest reckoning other people take far longer to reach. It's most alive exactly where everyone else is still maintaining a comfortable appearance.`,
      shadow: `Because this clarity never cost you visible struggle to acquire, you may not credit it as real perception, treating your own early warnings as needless alarm rather than a genuine gift worth trusting. Left unclaimed, it can also tip into provoking collapse rather than waiting for one, because a truth this sharp is uncomfortable to simply sit with unused. Being right about the crack doesn't require you to be the one who causes it to fall. Timing the warning matters as much as having it in the first place.`,
      invitation: `Ask yourself what structure you've already sensed is unstable but haven't yet named aloud. Name one early warning this week, gently, using this clarity deliberately rather than letting it sit unused. You are allowed to claim a sharpness you didn't personally have to earn through repeated collapse. Where might this gift matter if you actually spoke it in time?`,
    },
    '17_F2': {
      title: `17 in Paternal Spiritual Talent — The Star`,
      tagline: `A Design of Inherited Hope`,
      mastery: `A genuine capacity for hope that doesn't wait for proof arrived in you already lit, a spiritual inheritance from your father's line rather than optimism you had to manufacture from nothing. You keep faith alive in situations that have given other people every reason to stop, with a steadiness that took them real effort to build. When claimed fully, that hope moves toward renewal other people take far longer to reach. It's most alive right where everyone else has already given up looking for it.`,
      shadow: `Because this hope never cost you visible struggle to sustain, you may underclaim it, treating your own optimism as naivety rather than the genuine gift it is. Left unclaimed, it can also function as avoidance — staying hopeful about something that has already, factually, ended, because facing the harder truth has never felt necessary while the hope keeps flowing so easily. The ease of staying hopeful can quietly outcompete the harder work of staying honest. A hope that never gets tested against reality stops being resilience and starts being denial.`,
      invitation: `Ask yourself whether your current hope is aimed at something still genuinely alive. Name one honest, difficult truth this week alongside the hope, rather than letting the hope substitute for it. You are allowed to claim an optimism you didn't personally have to fight to build. Where might this inheritance matter if you paired it with real honesty?`,
    },
    '18_F2': {
      title: `18 in Paternal Spiritual Talent — The Moon`,
      tagline: `A Design of Inherited Sensing`,
      mastery: `A genuine capacity to sense what's beneath the surface, before it can be fully explained, arrived in you already active, a spiritual inheritance from your father's line rather than intuition you had to train from scratch. You feel an undercurrent other people spend years learning to notice at all. When claimed fully, that sensing moves toward real insight other people take far longer to reach. It's most alive in ambiguous situations everyone else is still waiting for clear evidence to interpret.`,
      shadow: `Because this sensing never cost you visible effort to develop, you may not credit it as a real gift, treating your own perception as simple anxiety rather than genuine insight worth checking and trusting. Left unclaimed, it can also tangle with fear — unable to tell which feelings are accurate perception and which are just static, because the gift was never deliberately trained to tell the difference. A feeling this vivid can carry the full weight of certainty even in the moments it's actually just noise. The strength of the feeling was never actually proof of its accuracy.`,
      invitation: `Ask yourself which feeling you've been treating as pure anxiety that might actually be real perception. Check one felt sense this week against something concrete, using this sensing deliberately rather than dismissing it. You are allowed to claim an intuition you didn't personally have to train from nothing. Where might this inheritance matter if you trusted it enough to verify it?`,
    },
    '19_F2': {
      title: `19 in Paternal Spiritual Talent — The Sun`,
      tagline: `A Design of Inherited Radiance`,
      mastery: `A genuine capacity for warmth that's simply available, not hard-won, arrived in you already lit, a spiritual inheritance from your father's line rather than light you had to build through years of effort. You bring ease into a room without needing to perform it, a quality other people spend real energy trying to develop. When claimed fully, that radiance moves toward connection other people take far longer to reach. It's most alive around anyone who needs, right now, to feel genuinely welcome.`,
      shadow: `Because this warmth never cost you visible struggle to produce, you may underclaim it, treating your own radiance as simple personality rather than a real inheritance worth directing on purpose. Left unclaimed, it can also turn into a performance of constant ease, leaving no visible room for the parts of you that are genuinely having a harder day. The brighter the default setting, the more a genuinely bad day can feel like a betrayal of what people expect. Sustained brightness this consistent can quietly cost more than anyone watching ever accounts for.`,
      invitation: `Ask yourself where you've been performing brightness rather than actually feeling it. Let one hard thing be visibly hard this week, without dimming the rest of your natural warmth to compensate. You are allowed to claim a radiance you didn't personally have to earn through suffering. Where might this inheritance matter if it included your harder days too?`,
    },
    '20_F2': {
      title: `20 in Paternal Spiritual Talent — Judgement`,
      tagline: `A Design of Inherited Calling`,
      mastery: `A genuine capacity to recognize a real summons toward something larger arrived in you already active, a spiritual inheritance from your father's line rather than aptitude you had to develop through years of searching. You can tell a genuine call from noise or wishful thinking with a clarity other people spend a long time trying to build. When claimed fully, that recognition moves toward real growth other people take far longer to reach. It's most alive exactly when the current chapter has quietly finished and something new is asking to begin.`,
      shadow: `Because this recognition never cost you visible struggle to acquire, you may underclaim it, treating your own clarity about the call as coincidence rather than a genuine gift worth trusting. Left unclaimed, it can also mean chasing the next summons before the current chapter has actually been lived all the way through, since a gift this reliable rarely gives you a reason to sit still. The next calling can start to feel more real than the life you're actually living right now. A chapter never fully lived rarely teaches what it was actually there to teach.`,
      invitation: `Ask yourself whether you're fully inside your current chapter or already listening past it. Stay with what's actually in front of you this week before answering the next call. You are allowed to claim a clarity you didn't personally have to search hard to find. Where might this inheritance matter if you let the current chapter finish first?`,
    },
    '21_F2': {
      title: `21 in Paternal Spiritual Talent — The World`,
      tagline: `A Design of Inherited Wholeness`,
      mastery: `A genuine capacity to recognize when something has actually reached completion arrived in you already precise, a spiritual inheritance from your father's line rather than judgment you had to develop through years of finishing things yourself. You know the difference between finished and merely stopped with a clarity other people spend real time learning. When claimed fully, that recognition moves toward real closure other people take far longer to reach. It's most alive right at the edge of something that's actually, quietly, already done.`,
      shadow: `Because this recognition never cost you visible struggle to acquire, you may underclaim it, treating your own sense of completion as pickiness rather than a genuine gift worth trusting. Left unclaimed, it can also tip into an endless search for total integration, refusing to call anything finished because nothing ever quite meets the standard the gift itself was built to recognize. Genuine accomplishments can end up sitting permanently in a kind of almost-there. The standard for done can quietly keep moving just out of reach.`,
      invitation: `Ask yourself what you've been withholding completion from simply because it hasn't felt total enough. Declare one thing finished this week at genuinely good enough. You are allowed to claim a sense of wholeness you didn't personally have to earn through struggle. Where might this inheritance matter if you let something be complete before it's absolute?`,
    },
    '22_F2': {
      title: `22 in Paternal Spiritual Talent — The Fool`,
      tagline: `A Design of Inherited Trust`,
      mastery: `A genuine capacity for faith in what hasn't happened yet arrived in you already whole, a spiritual inheritance from your father's line rather than courage you had to build leap by leap. You approach a genuine unknown as an open beginning rather than a threat, with an ease other people spend years learning. When claimed fully, that trust moves toward real discovery other people take far longer to reach. It's most alive at the exact edge of something that has no guarantee attached to it yet.`,
      shadow: `Because this trust never cost you visible struggle to build, you may underclaim it, treating your own openness as naivety rather than the genuine gift it is. Left unclaimed, it can also avoid the depth that comes from actually settling into one thing, since a gift this comfortable with beginnings rarely gets tested by staying. The excitement of a new leap can quietly outcompete the slower reward of actually arriving somewhere. What looks like fresh courage each time can, in practice, be the same avoidance wearing a new outfit.`,
      invitation: `Ask yourself what open path you've been quietly considering that's actually a distraction from the one you're already living. Commit to one already-chosen path this week rather than eyeing the next leap. You are allowed to claim a trust you didn't personally have to build leap by leap. Where might this inheritance matter if you let it also apply to staying?`,
    },

    // ── Lineage Square Talents: Maternal Spiritual Talent (G2) ─────────────
    // Source: Destiny-Matrix-Calculation-Guide.extracted.md, Page 6 — "G2
    // represents the talent inherited from the maternal line," the second
    // of the guide's three named core talents. G2 = reduce(G + L2), where
    // G is the Maternal Spiritual ancestral corner — a gift carried through
    // the mother's line, in the same spiritual register G already sits in
    // (felt knowing, emotional attunement, soul-sense), distinct from F2's
    // paternal register and I2's maternal-material one.

    '1_G2': {
      title: `1 in Maternal Spiritual Talent — The Magician`,
      tagline: `A Design of Inherited Initiative`,
      mastery: `The capacity to act on a feeling the instant it arrives, before doubt gets a foothold, came to you already alive, carried through your mother's line as a felt, embodied readiness rather than something you had to argue yourself into. You move the moment something in you says now, with a fluency other people spend years learning to trust. When claimed fully, that readiness moves ahead of overthinking, landing on action while the impulse is still warm. It's most alive in the instant something needs to simply begin.`,
      shadow: `A readiness this immediate is easy to mistake for impulsiveness rather than the genuine inheritance it is, since it never had to be reasoned into existence the way other people's courage was. Left unclaimed, it can act without pausing to ask whether the felt urgency actually matches the moment's real stakes. An inheritance never consciously checked can move fast in directions that were never actually examined first. The impulse itself never asks whether it's actually right, only whether it's loud.`,
      invitation: `Ask yourself which recent impulse you acted on was a genuine felt-knowing versus simple restlessness. Trust one clear impulse this week, on purpose, and notice the difference. You are allowed to claim a readiness you didn't have to reason yourself into. Where might this gift serve you better with one breath of pause first?`,
    },
    '2_G2': {
      title: `2 in Maternal Spiritual Talent — The High Priestess`,
      tagline: `A Design of Inherited Knowing`,
      mastery: `An unproven, quiet certainty about what's actually true came to you already whole, a felt inheritance from your mother's line rather than a perception you had to train into existence. You know things before you can explain how, the way this specific knowing runs in families that carry it. When trusted fully, that certainty moves ahead of any evidence, landing on the truth of a situation before it's been spoken aloud. It's sharpest in the quiet, away from anyone asking you to justify it.`,
      shadow: `A knowing this immediate is easy to keep entirely private, since it arrived without proof and proof-less knowing can feel too fragile to offer anyone else. Left unclaimed, it stays unspoken, doing you good but reaching no one, because trusting an inheritance nobody asked you to prove has never felt like something you're fully entitled to insist on out loud. A knowing kept entirely private ends up helping only the one person who already believed it. Certainty this quiet still needs a listener before it can actually change anything.`,
      invitation: `Ask yourself what you know clearly but have never once said plainly to another person. Voice one piece of this inherited knowing out loud this week, without waiting for proof. You are allowed to claim a certainty you didn't personally have to earn through evidence. Where might this gift matter if it finally left the privacy of your own mind?`,
    },
    '3_G2': {
      title: `3 in Maternal Spiritual Talent — The Empress`,
      tagline: `A Design of Inherited Nurturing`,
      mastery: `A felt, natural instinct for what someone or something needs in order to flourish came to you already alive, carried through your mother's line as embodied care rather than a skill you had to consciously build. You sense what would help a person grow before they've had to ask, with a fluency other people spend real years developing. When claimed fully, that instinct moves toward real growth in whatever it's turned toward. It's most alive around anything still tender and unformed.`,
      shadow: `A nurturing instinct this automatic is easy to give away entirely, since it costs you so little that the imbalance of pouring it outward without receiving any back can go unnoticed for a long time. Left unclaimed, the same instinct that tends to everyone else can quietly forget to turn toward your own needs at all, because caring for you was never the gift's original assignment. The same warmth that grows everything around you can leave you personally unattended for a very long time. What tends everyone else so naturally rarely turns around to tend itself.`,
      invitation: `Ask yourself where this nurturing instinct has been flowing entirely outward without ever circling back to you. Direct one deliberate act of this same care toward yourself this week. You are allowed to claim a gift you didn't have to build and still let it include you. Where might this inheritance matter most if it finally came home?`,
    },
    '4_G2': {
      title: `4 in Maternal Spiritual Talent — The Emperor`,
      tagline: `A Design of Inherited Steadiness`,
      mastery: `A felt sense of what will actually hold, and what won't, came to you already formed, an embodied inheritance from your mother's line rather than structural knowledge you had to reason your way into. You can sense instability before it's visible, the way this steadiness runs in families that carry it. When trusted fully, that sense moves ahead of analysis, landing on what's genuinely solid before anyone's checked. It's most alive whenever something around you needs real grounding fast.`,
      shadow: `A steadiness this instinctive is easy to under-claim, treating your own felt sense of what holds as ordinary caution rather than the real gift it is. Left unclaimed, it can also default to over-control out of reflex, gripping structure automatically rather than by conscious, examined choice, because the instinct was never actually named as something you're allowed to direct on purpose. Gripping automatically and holding steady on purpose can look identical from the outside, but only one of them actually serves you. The people around a grip this constant rarely get the chance to test whether the structure would hold without it.`,
      invitation: `Ask yourself where you've been holding onto structure by pure reflex rather than deliberate decision. Loosen your grip on one thing this week, using this steadiness as an active choice rather than an automatic one. You are allowed to claim a sense of what holds that you didn't have to reason your way to. Where might this gift serve better as intention rather than reflex?`,
    },
    '5_G2': {
      title: `5 in Maternal Spiritual Talent — The Hierophant`,
      tagline: `A Design of Inherited Faith`,
      mastery: `A felt trust in what's been tested and proven true came to you already whole, carried through your mother's line as embodied conviction rather than belief you had to build through your own years of doubt. You recognize sound wisdom almost on contact, the way this trust runs in families that hold it closely. When claimed fully, that faith moves with a steadiness other people spend real time learning to build. It's most alive whenever something genuinely needs a tested foundation rather than a fresh guess.`,
      shadow: `A faith this automatic is easy to underclaim as simple habit rather than the real inheritance it is, and easy to defer to even in the rare moment your own direct experience is quietly suggesting something different. Left unclaimed, it can hold you to an inherited certainty past the point your own life has already outgrown it. What was once tested wisdom can quietly become an old answer to a question your life has already moved past. Faith this automatic can quietly outlive the very thing it was originally protecting.`,
      invitation: `Ask yourself where an inherited certainty and your own direct experience currently disagree. Name that disagreement honestly this week rather than automatically deferring to the inherited version. You are allowed to claim a faith you didn't personally have to build and still let your own life update it. Where might this gift matter if you actually tested it against your own experience?`,
    },
    '6_G2': {
      title: `6 in Maternal Spiritual Talent — The Lovers`,
      tagline: `A Design of Inherited Devotion`,
      mastery: `A felt capacity to choose someone or something with your values fully intact came to you already whole, an embodied inheritance from your mother's line rather than discernment you had to build through your own hard choices. You can feel real alignment the instant it's present, the way this clarity runs in families that carry it closely. When claimed fully, that felt sense moves ahead of second-guessing, landing on genuine devotion before you've had to reason your way there. It's sharpest at real forks between the easy option and the true one.`,
      shadow: `A devotion this instinctive is easy to underclaim, treating your own felt alignment as mere feeling rather than the real inherited discernment it is. Left unclaimed, it can also go unused at the moments it matters most, deferred to whatever's simply convenient because trusting it deliberately never became a practiced habit. The choices that mattered most can end up being the ones this gift was never actually invited into. A devotion never consciously chosen can start to feel more like habit than genuine love.`,
      invitation: `Ask yourself which recent choice you made from convenience rather than by consulting this felt inheritance. Make one decision this week by actually checking it against what you feel aligns. You are allowed to claim a devotion you didn't personally have to reason your way into. Where might this gift change your next real choice?`,
    },
    '7_G2': {
      title: `7 in Maternal Spiritual Talent — The Chariot`,
      tagline: `A Design of Inherited Resolve`,
      mastery: `A felt, sustained will to keep moving toward something chosen came to you already running, carried through your mother's line as embodied resolve rather than motivation you had to manufacture. You hold direction with a steadiness other people spend years training themselves into. When claimed fully, that resolve moves with a confidence that looks, from outside, like effortless drive. It's most alive whenever there's real distance left and a clear feeling of where you're actually headed.`,
      shadow: `A resolve this automatic is easy to treat as personality rather than a real inheritance worth aiming deliberately. Left unclaimed, it can keep running without a genuinely chosen destination, generating forward motion for its own sake rather than direction you actually decided on. An inheritance never consciously steered keeps moving whether or not the direction still makes sense. Distance covered can be mistaken for progress made, even when the two have quietly stopped matching.`,
      invitation: `Ask yourself whether your current momentum is aimed at something you chose or simply running on inherited habit. Name one real destination this week and direct this resolve at it on purpose. You are allowed to claim a drive you didn't personally have to build. Where might this gift take you if you actually pointed it?`,
    },
    '8_G2': {
      title: `8 in Maternal Spiritual Talent — Justice`,
      tagline: `A Design of Inherited Balance`,
      mastery: `A felt, immediate sense of what's fair came to you already calibrated, an embodied inheritance from your mother's line rather than an ethic you had to build through your own hard experience. You register imbalance almost physically, the way this sensitivity runs in families that carry it. When claimed fully, that sense moves with an authority other people spend real years developing. It's most active in situations everyone else is still calling merely complicated.`,
      shadow: `A fairness this instinctive is easy to underclaim, treating your own felt sense of balance as mood rather than a real inheritance worth trusting with weight. Left unclaimed, it can also apply the standard rigidly, since a felt sense never consciously examined enforces its own rule without necessarily understanding why the rule exists. A standard enforced without that understanding can land harder than it was ever meant to. A felt sense of fairness still benefits from being checked against the actual specifics of the situation.`,
      invitation: `Ask yourself where you've applied this sense of fairness automatically rather than with real thought behind it. Bring this instinct to one situation this week deliberately, naming it as a genuine inherited strength. You are allowed to claim a balance you didn't personally have to forge alone. Where might this gift matter if you actually owned it?`,
    },
    '9_G2': {
      title: `9 in Maternal Spiritual Talent — The Hermit`,
      tagline: `A Design of Inherited Stillness`,
      mastery: `A felt capacity for unhurried, solitary understanding came to you already present, an embodied inheritance from your mother's line rather than a discipline you had to force yourself into. You reach real inner quiet with a naturalness other people spend years trying to build. When claimed fully, that stillness moves toward insight other people take far longer to arrive at. It's most alive away from noise, when there's genuinely nowhere else you need to be.`,
      shadow: `A stillness this automatic is easy to treat as simple preference rather than a real gift worth protecting on purpose. Left unclaimed, the insight it produces can stay entirely private, offered to no one, doing good only inside your own inner life. A spiritual inheritance never shared functions, for everyone but you, as though it had never been given at all. The quiet you protect it inside can quietly become the thing that keeps it from proving useful to anyone.`,
      invitation: `Ask yourself what you've understood in stillness that's actually ready to be spoken aloud. Share one piece of that understanding this week as something you're genuinely entitled to offer. You are allowed to claim a depth you didn't have to force yourself into. Where might this inheritance matter if it finally left the quiet with you?`,
    },
    '10_G2': {
      title: `10 in Maternal Spiritual Talent — The Wheel of Fortune`,
      tagline: `A Design of Inherited Attunement`,
      mastery: `A felt sensitivity to when a cycle is turning came to you already active, an embodied inheritance from your mother's line rather than a sensitivity you had to build through years of watching patterns repeat. You sense a shift in mood or circumstance before it's officially announced, the way this attunement runs in families that carry it. When claimed fully, that sense moves with a confidence other people spend a lifetime trying to build. It's sharpest right at the edge of a genuine turn.`,
      shadow: `A timing sense this automatic is easy to discount as mere hunch rather than a real inheritance worth acting on. Left unclaimed, it can also breed a quiet passivity — sensing the turn accurately and still waiting, because trusting an unearned gift with real consequences has never quite felt safe enough to act on directly. The window a turn actually opens rarely stays open long enough to reward hesitation. An attunement this sharp still needs the follow-through of actually moving when it speaks.`,
      invitation: `Ask yourself what shift you've already sensed clearly but haven't yet acted on. Act on one piece of this timing sense this week, treating it as a real, trustworthy inheritance. You are allowed to claim a feel for timing you didn't personally have to earn. Where might this gift matter if you actually moved on it?`,
    },
    '11_G2': {
      title: `11 in Maternal Spiritual Talent — Strength`,
      mastery: `A felt capacity to stay soft and steady under real pressure came to you already whole, an embodied inheritance from your mother's line rather than composure you had to forge through hardship. You meet difficulty without needing to dominate it or flee it, a quality other people spend real effort trying to build. When claimed fully, that steadiness moves with a quiet authority that reads, from outside, as effortless grace. It's most present in exactly the moments that would rattle almost anyone else.`,
      shadow: `A gentleness this automatic is easy to underclaim, treating your own steadiness as simple temperament rather than a real inheritance worth actively directing. Left unclaimed, it can also curdle into over-accommodation — staying calm on everyone else's behalf while your own needs quietly go unheard, because the gift was never consciously claimed as something with limits too. What reads to everyone else as ease can be quietly costing you more than anyone realizes. The steadiness other people lean on you for still needs somewhere to land when it's your turn to need it.`,
      invitation: `Ask yourself where you've been staying calm automatically rather than by real, conscious choice. Let yourself claim this steadiness openly this week, and notice where it might also need a boundary. You are allowed to own a gentleness you didn't personally have to fight for. Where might this inheritance serve you better if you actually named it as yours?`,
    },
    '12_G2': {
      title: `12 in Maternal Spiritual Talent — The Hanged Man`,
      tagline: `A Design of Inherited Surrender`,
      mastery: `A felt capacity to find real insight through pause rather than force came to you already developed, an embodied inheritance from your mother's line rather than patience you had to build through forced waiting. You see things from an angle other people reach only after considerable effort. When claimed fully, that perspective moves with an ease that looks, from outside, like natural wisdom. It surfaces most clearly whenever everyone else is still pushing and you're already still.`,
      shadow: `A perspective this automatic is easy to treat as passivity rather than the real gift it is, letting waiting substitute for eventually acting. Left unclaimed, the insight it produces can stay permanently theoretical, admired privately but never brought back down into an actual decision. An inheritance held only in reflection never becomes anything more than that. The angle you see so clearly from up there still has to be climbed down from eventually.`,
      invitation: `Ask yourself what insight you've already reached through stillness that's actually ready to be acted on. Act on one piece of that understanding this week, treating the perspective as a genuine, usable gift. You are allowed to claim wisdom you didn't personally have to suffer for. Where might this inheritance matter once it comes down off the pause?`,
    },
    '13_G2': {
      title: `13 in Maternal Spiritual Talent — Death`,
      tagline: `A Design of Inherited Renewal`,
      mastery: `A felt capacity to let old versions of things end so something truer can begin came to you already active, an embodied inheritance from your mother's line rather than resilience you had to build through hard loss. You move through real transformation with a fluency other people spend a long time learning. When claimed fully, that capacity moves toward rebirth other people take far longer to reach. It's most alive right at the edge of an ending everyone else is still resisting.`,
      shadow: `An ease with transformation this automatic is easy to discount, treating your own resilience as coincidence rather than genuine inheritance. Left unclaimed, it can also tip into constant reinvention for its own sake, ending things reflexively rather than because they'd actually finished their course. An inheritance never consciously directed can dismantle things that didn't need dismantling. Some of what got ended along the way might genuinely have still had more to give.`,
      invitation: `Ask yourself whether a recent ending was genuinely necessary or simply reflex. Let one thing this week actually finish, on purpose, rather than starting the next reinvention immediately. You are allowed to claim a resilience you didn't personally have to earn through suffering. Where might this gift matter if you aimed it deliberately?`,
    },
    '14_G2': {
      title: `14 in Maternal Spiritual Talent — Temperance`,
      tagline: `A Design of Inherited Blending`,
      mastery: `A felt capacity to blend competing forces into something coherent came to you already whole, an embodied inheritance from your mother's line rather than a skill you had to build through years of trial. You hold two different truths at once with an ease other people spend real effort developing. When claimed fully, that integration moves toward synthesis other people take far longer to reach. It's most alive whenever two things that don't naturally want to sit together are placed directly in front of you.`,
      shadow: `A balance this automatic is easy to underclaim as simple temperament rather than the genuine gift it is. Left unclaimed, it can also default to a permanent, exhausting neutrality — holding the middle out of habit rather than choosing it deliberately, because taking a real side has never felt like something the gift requires of you. The middle can start to feel like the only place this gift is allowed to stand. A balance this practiced can start to look, from outside, like an inability to actually decide.`,
      invitation: `Ask yourself where you've been staying neutral automatically rather than by actual, considered choice. Take one clear position this week, using this integrative gift on purpose rather than letting it default to the middle. You are allowed to claim a balance you didn't personally have to struggle to build. Where might this inheritance matter if you occasionally aimed it at a real stance?`,
    },
    '15_G2': {
      title: `15 in Maternal Spiritual Talent — The Devil`,
      tagline: `A Design of Inherited Clarity`,
      mastery: `A felt capacity to see desire, power, and attachment clearly, without flinching, came to you already active, an embodied inheritance from your mother's line rather than honesty you had to earn through struggle. You understand what actually drives people with a directness other people spend years developing. When claimed fully, that clarity moves toward real insight other people take far longer to reach. It's most alive in situations everyone else is still politely avoiding.`,
      shadow: `A clarity this automatic is easy to discount, treating your own unflinching sight as simply cynicism rather than genuine insight worth using with care. Left unclaimed, it can also tip into entanglement — seeing the chain clearly while still being ruled by it, because clear sight was never actually converted into deliberate freedom. Naming a chain accurately is not the same thing as actually being free of it. The clarity can start to feel like the whole achievement, when it was only ever meant to be the first step.`,
      invitation: `Ask yourself what you've seen clearly about your own attachments that you haven't yet acted on. Name one honest truth this week using this clarity on purpose, rather than only privately. You are allowed to claim an honesty you didn't personally have to fight to acquire. Where might this inheritance matter if you actually used it?`,
    },
    '16_G2': {
      title: `16 in Maternal Spiritual Talent — The Tower`,
      tagline: `A Design of Inherited Foresight`,
      mastery: `A felt capacity to sense a failing structure early, before anyone else admits it's cracking, came to you already sharp, an embodied inheritance from your mother's line rather than instinct you had to build through repeated collapse. You register instability almost physically, ahead of the official signs. When claimed fully, that clarity moves toward honest reckoning other people take far longer to reach. It's most alive exactly where everyone else is still maintaining a comfortable appearance.`,
      shadow: `A foresight this automatic is easy to discount, treating your own early warnings as needless alarm rather than a genuine gift worth trusting. Left unclaimed, it can also tip into provoking collapse rather than waiting for one, because a truth this sharp is uncomfortable to simply sit with unused. Being right about the crack doesn't require you to be the one who causes it to fall. Timing the warning matters as much as having it in the first place.`,
      invitation: `Ask yourself what structure you've already sensed is unstable but haven't yet named aloud. Name one early warning this week, gently, using this clarity deliberately rather than letting it sit unused. You are allowed to claim a sharpness you didn't personally have to earn through repeated collapse. Where might this gift matter if you actually spoke it in time?`,
    },
    '17_G2': {
      title: `17 in Maternal Spiritual Talent — The Star`,
      tagline: `A Design of Inherited Hope`,
      mastery: `A felt capacity for hope that doesn't wait for proof came to you already lit, an embodied inheritance from your mother's line rather than optimism you had to manufacture. You keep faith alive in situations that have given other people every reason to stop, with a steadiness that took them real effort to build. When claimed fully, that hope moves toward renewal other people take far longer to reach. It's most alive right where everyone else has already given up looking for it.`,
      shadow: `A hope this automatic is easy to underclaim, treating your own optimism as naivety rather than the genuine gift it is. Left unclaimed, it can also function as avoidance — staying hopeful about something that has already, factually, ended, because facing the harder truth has never felt necessary while the hope keeps flowing so easily. The ease of staying hopeful can quietly outcompete the harder work of staying honest. A hope that never gets tested against reality stops being resilience and starts being denial.`,
      invitation: `Ask yourself whether your current hope is aimed at something still genuinely alive. Name one honest, difficult truth this week alongside the hope, rather than letting the hope substitute for it. You are allowed to claim an optimism you didn't personally have to fight to build. Where might this inheritance matter if you paired it with real honesty?`,
    },
    '18_G2': {
      title: `18 in Maternal Spiritual Talent — The Moon`,
      tagline: `A Design of Inherited Sensing`,
      mastery: `A felt capacity to sense what's beneath the surface, before it can be fully explained, came to you already active, an embodied inheritance from your mother's line rather than intuition you had to train from scratch. You feel an undercurrent other people spend years learning to notice at all. When claimed fully, that sensing moves toward real insight other people take far longer to reach. It's most alive in ambiguous situations everyone else is still waiting for clear evidence to interpret.`,
      shadow: `A sensing this automatic is easy to discount, treating your own perception as simple anxiety rather than genuine insight worth checking and trusting. Left unclaimed, it can also tangle with fear — unable to tell which feelings are accurate perception and which are just static, because the gift was never deliberately trained to tell the difference. A feeling this vivid can carry the full weight of certainty even in the moments it's actually just noise. The strength of the feeling was never actually proof of its accuracy.`,
      invitation: `Ask yourself which feeling you've been treating as pure anxiety that might actually be real perception. Check one felt sense this week against something concrete, using this sensing deliberately rather than dismissing it. You are allowed to claim an intuition you didn't personally have to train from nothing. Where might this inheritance matter if you trusted it enough to verify it?`,
    },
    '19_G2': {
      title: `19 in Maternal Spiritual Talent — The Sun`,
      tagline: `A Design of Inherited Warmth`,
      mastery: `A felt capacity for warmth that's simply available, not hard-won, came to you already lit, an embodied inheritance from your mother's line rather than light you had to build through years of effort. You bring ease into a room without needing to perform it, a quality other people spend real energy trying to develop. When claimed fully, that radiance moves toward connection other people take far longer to reach. It's most alive around anyone who needs, right now, to feel genuinely welcome.`,
      shadow: `A warmth this automatic is easy to underclaim, treating your own radiance as simple personality rather than a real inheritance worth directing on purpose. Left unclaimed, it can also turn into a performance of constant ease, leaving no visible room for the parts of you that are genuinely having a harder day. The brighter the default setting, the more a genuinely bad day can feel like a betrayal of what people expect. Sustained brightness this consistent can quietly cost more than anyone watching ever accounts for.`,
      invitation: `Ask yourself where you've been performing brightness rather than actually feeling it. Let one hard thing be visibly hard this week, without dimming the rest of your natural warmth to compensate. You are allowed to claim a radiance you didn't personally have to earn through suffering. Where might this inheritance matter if it included your harder days too?`,
    },
    '20_G2': {
      title: `20 in Maternal Spiritual Talent — Judgement`,
      tagline: `A Design of Inherited Calling`,
      mastery: `A felt capacity to recognize a real summons toward something larger came to you already active, an embodied inheritance from your mother's line rather than aptitude you had to develop through years of searching. You can tell a genuine call from noise or wishful thinking with a clarity other people spend a long time trying to build. When claimed fully, that recognition moves toward real growth other people take far longer to reach. It's most alive exactly when the current chapter has quietly finished.`,
      shadow: `A recognition this automatic is easy to underclaim, treating your own clarity about the call as coincidence rather than a genuine gift worth trusting. Left unclaimed, it can also mean chasing the next summons before the current chapter has actually been lived all the way through, since a gift this reliable rarely gives you a reason to sit still. The next calling can start to feel more real than the life you're actually living right now. A chapter never fully lived rarely teaches what it was actually there to teach.`,
      invitation: `Ask yourself whether you're fully inside your current chapter or already listening past it. Stay with what's actually in front of you this week before answering the next call. You are allowed to claim a clarity you didn't personally have to search hard to find. Where might this inheritance matter if you let the current chapter finish first?`,
    },
    '21_G2': {
      title: `21 in Maternal Spiritual Talent — The World`,
      tagline: `A Design of Inherited Wholeness`,
      mastery: `A felt capacity to recognize when something has actually reached completion came to you already precise, an embodied inheritance from your mother's line rather than judgment you had to develop through years of finishing things yourself. You know the difference between finished and merely stopped with a clarity other people spend real time learning. When claimed fully, that recognition moves toward real closure other people take far longer to reach. It's most alive right at the edge of something that's actually, quietly, already done.`,
      shadow: `A recognition this automatic is easy to underclaim, treating your own sense of completion as pickiness rather than a genuine gift worth trusting. Left unclaimed, it can also tip into an endless search for total integration, refusing to call anything finished because nothing ever quite meets the standard the gift itself was built to recognize. Genuine accomplishments can end up sitting permanently in a kind of almost-there. The standard for done can quietly keep moving just out of reach.`,
      invitation: `Ask yourself what you've been withholding completion from simply because it hasn't felt total enough. Declare one thing finished this week at genuinely good enough. You are allowed to claim a sense of wholeness you didn't personally have to earn through struggle. Where might this inheritance matter if you let something be complete before it's absolute?`,
    },
    '22_G2': {
      title: `22 in Maternal Spiritual Talent — The Fool`,
      tagline: `A Design of Inherited Trust`,
      mastery: `A felt capacity for faith in what hasn't happened yet came to you already whole, an embodied inheritance from your mother's line rather than courage you had to build leap by leap. You approach a genuine unknown as an open beginning rather than a threat, with an ease other people spend years learning. When claimed fully, that trust moves toward real discovery other people take far longer to reach. It's most alive at the exact edge of something that has no guarantee attached to it yet.`,
      shadow: `A trust this automatic is easy to underclaim, treating your own openness as naivety rather than the genuine gift it is. Left unclaimed, it can also avoid the depth that comes from actually settling into one thing, since a gift this comfortable with beginnings rarely gets tested by staying. The excitement of a new leap can quietly outcompete the slower reward of actually arriving somewhere. What looks like fresh courage each time can, in practice, be the same avoidance wearing a new outfit.`,
      invitation: `Ask yourself what open path you've been quietly considering that's actually a distraction from the one you're already living. Commit to one already-chosen path this week rather than eyeing the next leap. You are allowed to claim a trust you didn't personally have to build leap by leap. Where might this inheritance matter if you let it also apply to staying?`,
    },

    // ── Lineage Square Talents: Paternal Material Talent (H2) ───────────────
    // Source: Destiny-Matrix-Calculation-Guide.extracted.md, Page 10/6 —
    // H2 = reduce(H + L2), part of the same "energies labeled 2" family as
    // F2/G2/I2 (Page 10: "the energies labeled 2 ... are obtained by adding
    // the base energies to the energy of L2"). H is the Paternal Material
    // ancestral corner, so H2 carries the father's-line inheritance in the
    // material/practical register H already sits in — building, providing,
    // getting real things done — distinct from F2's spiritual register.

    '1_H2': {
      title: `1 in Paternal Material Talent — The Magician`,
      tagline: `A Design of Inherited Execution`,
      mastery: `The practical ability to turn an idea into something you can actually point to arrived in you already built, carried down your father's line as hands-on capability rather than a skill you had to teach yourself from zero. You move from concept to concrete result with a speed other people spend years developing. When claimed fully, that execution moves ahead of hesitation, producing something real while the idea's still fresh. It's most alive at the exact moment something needs to stop being a plan and start being a thing.`,
      shadow: `A capability this immediate is easy to under-credit, treating your own quick execution as luck rather than a genuine inheritance worth claiming on purpose. Left unclaimed, it can also run without real direction, producing results reflexively rather than aimed at something you've actually decided matters. An inheritance never consciously directed keeps building regardless of whether the building was actually needed. A finished thing isn't automatically the right thing simply because it got made quickly.`,
      invitation: `Ask yourself what you built recently out of pure habit rather than real decision. Point this ability at one thing this week you've actually chosen on purpose. You are allowed to claim a practical skill you didn't personally have to teach yourself. Where might this gift matter more if you aimed it deliberately?`,
    },
    '2_H2': {
      title: `2 in Paternal Material Talent — The High Priestess`,
      tagline: `A Design of Inherited Precision`,
      mastery: `A quiet, practical accuracy — knowing exactly how a real situation actually works underneath its surface — arrived in you already sharp, a material inheritance from your father's line rather than expertise you had to earn through years of trial. You read the mechanics of a system correctly on the first look. When trusted fully, that precision moves ahead of guesswork, landing on what's actually true about how something functions. It's sharpest whenever a practical problem is more complicated than it looks.`,
      shadow: `A precision this automatic is easy to keep to yourself, treating your accurate read as unremarkable rather than a real inherited advantage worth voicing. Left unclaimed, the insight it produces stays private, correcting nothing, helping no one but you. An inheritance never actually spoken functions, for everyone else, as though it had never been given at all. Precision this quiet still has to be said out loud to actually change anything.`,
      invitation: `Ask yourself what you already understand accurately about a practical situation that you haven't said aloud. Voice one precise, practical observation this week as something you're genuinely entitled to trust. You are allowed to claim an accuracy you didn't personally have to earn through trial. Where might this gift matter if it left your own head?`,
    },
    '3_H2': {
      title: `3 in Paternal Material Talent — The Empress`,
      tagline: `A Design of Inherited Provision`,
      mastery: `A practical instinct for making things comfortable, abundant, and genuinely well-provided-for arrived in you already alive, a material inheritance from your father's line rather than a skill you had to consciously build. You make real resources grow with a naturalness other people spend years developing. When claimed fully, that instinct moves toward tangible abundance in whatever it's turned toward. It's most alive around anything real that needs practical care to actually flourish.`,
      shadow: `A provision this automatic is easy to give away entirely, since it costs you so little that the imbalance of providing outward without receiving any back can go unnoticed for a long time. Left unclaimed, the same instinct that tends to everyone else's material needs can quietly forget to provide for your own, because caring for you was never the gift's original assignment. The same care that provides so easily for everyone else can leave you personally under-provided for indefinitely. Provision this automatic can be extended for years before anyone notices the imbalance, including you.`,
      invitation: `Ask yourself where this provision has been flowing entirely outward without circling back to you. Direct one deliberate act of this same practical care toward yourself this week. You are allowed to claim a gift you didn't have to build and still let it include you. Where might this inheritance matter most if it finally came home?`,
    },
    '4_H2': {
      title: `4 in Paternal Material Talent — The Emperor`,
      tagline: `A Design of Inherited Structure`,
      mastery: `The ability to build something that will actually stand — real, load-bearing structure, not just an idea of one — arrived in you already whole, a material inheritance from your father's line rather than skill you had to earn through years of trial. You look at disorder and already see the frame that would make it functional. When claimed fully, that instinct moves with an authority other people had to work much harder to develop. It shows up soonest wherever something practical is actively falling apart.`,
      shadow: `A structural instinct this automatic is easy to treat as ordinary rather than the genuine gift it is, quietly assuming everyone can see the frame as clearly as you do. Left unclaimed, it can also default to rigidity rather than deliberate structure, imposing order out of reflex instead of considered judgment. An inheritance never consciously claimed structures things whether or not structure was actually being asked for. Other people can end up living inside a frame they never actually agreed to.`,
      invitation: `Ask yourself where you've been building order out of habit rather than actual decision. Choose one situation this week and bring structure to it deliberately, naming to yourself that the clarity is a real, inherited strength. You are allowed to claim authority you didn't personally build from scratch. What might this gift do if you aimed it on purpose?`,
    },
    '5_H2': {
      title: `5 in Paternal Material Talent — The Hierophant`,
      tagline: `A Design of Inherited Method`,
      mastery: `A practical feel for the tested, proven way of doing something arrived in you already formed, a material inheritance from your father's line rather than know-how you had to earn through your own long trial. You recognize a sound method almost on contact, the way this practical sense runs in families that carry it. When trusted, that recognition moves with an authority that took other people real years to build. It's most active whenever something genuinely needs a proven approach rather than a fresh improvisation.`,
      shadow: `A method this automatic can feel borrowed rather than truly yours, and borrowed skill is easy to underuse out of a quiet sense you haven't earned the right to teach it. Left unclaimed, it can also calcify into rule-following for its own sake, sticking to the inherited method even in the rare moment that actually calls for something new. What was meant to be a foundation can end up functioning as a ceiling instead. A method this trusted rarely gets questioned, even in the one case it genuinely doesn't fit.`,
      invitation: `Ask yourself which piece of inherited practical know-how you've been sitting on without actually offering it. Share one piece of tested method this week as something you're genuinely entitled to teach. You are allowed to speak with authority you inherited rather than personally forged. Where might this gift matter more if you actually claimed it?`,
    },
    '6_H2': {
      title: `6 in Paternal Material Talent — The Lovers`,
      tagline: `A Design of Inherited Judgment`,
      mastery: `A practical capacity to choose the option that actually serves what you value, rather than the one that's simply convenient, arrived in you already developed, a material inheritance from your father's line rather than discernment you had to build alone. You can tell, almost instantly, which real-world option actually aligns with what matters. When trusted, that judgment moves ahead of second-guessing, landing on the genuinely better choice before you've had to reason your way there. It's sharpest at real forks, where the easy option and the true option visibly diverge.`,
      shadow: `A judgment this automatic is easy to under-credit, treating your own practical clarity as luck rather than a genuine capacity worth trusting on purpose. Left unclaimed, the gift can go unused at the exact moments it matters most, deferred to convenience simply because using it deliberately never became a practiced habit. The choices that mattered most can end up being the ones this gift was never actually invited into. Practical judgment this reliable still benefits from being checked, not just trusted by default.`,
      invitation: `Ask yourself which recent choice you made by default rather than by genuinely consulting this inherited judgment. Make one decision this week by deliberately checking it against what you actually value. You are allowed to trust a clarity you didn't personally have to earn. Where might this gift change your next real choice?`,
    },
    '7_H2': {
      title: `7 in Paternal Material Talent — The Chariot`,
      tagline: `A Design of Inherited Drive`,
      mastery: `A capacity for sustained, practical momentum toward a real, tangible goal arrived in you already running, a material inheritance from your father's line rather than motivation you had to manufacture from nothing. You move toward concrete results with a steadiness other people had to train themselves into over years. When fully claimed, that drive moves with a confidence that looks, from the outside, like natural talent. It's most alive whenever there's real, practical distance left to cover.`,
      shadow: `A drive this automatic is easy to treat as simple personality rather than a real gift worth directing on purpose. Left unclaimed, it can run without a chosen destination, generating effort for its own sake rather than aimed at a result you've actually decided matters. An inheritance never consciously steered keeps moving regardless of whether the direction still makes sense. Distance covered can be mistaken for progress made, even when the two have quietly stopped matching.`,
      invitation: `Ask yourself whether your current momentum is actually aimed at something you chose, or simply running on inherited habit. Name one real destination this week and direct this drive at it deliberately. You are allowed to claim momentum you didn't personally have to build. Where might this gift take you if you actually pointed it?`,
    },
    '8_H2': {
      title: `8 in Paternal Material Talent — Justice`,
      tagline: `A Design of Inherited Accountability`,
      mastery: `A sharp, practical sense of what's actually fair in real, material terms arrived in you already calibrated, an inheritance from your father's line rather than an ethic you had to build from scratch. You register imbalance in a deal, a division of labor, or a shared resource almost involuntarily. When claimed fully, that instinct moves with an authority other people spend years developing through trial. It's most active in situations everyone else is still calling merely complicated.`,
      shadow: `An accountability this automatic is easy to underclaim, treating your own sense of fairness as simply personality rather than a real inheritance worth trusting with weight. Left unclaimed, it can also go rigid, applying an inherited standard mechanically rather than with the discernment a truly owned ethic would bring. A standard enforced without that understanding can land harder than it was ever meant to. Fairness this instinctive still deserves the same scrutiny you'd give a conclusion you had to actually work for.`,
      invitation: `Ask yourself where you've applied this sense of fairness automatically rather than with real thought behind it. Bring this instinct to one situation this week deliberately, naming it as a genuine inherited strength. You are allowed to claim ethical clarity you didn't personally forge alone. Where might this gift matter more if you actually owned it?`,
    },
    '9_H2': {
      title: `9 in Paternal Material Talent — The Hermit`,
      tagline: `A Design of Inherited Self-Sufficiency`,
      mastery: `A practical capacity to handle real, material problems entirely on your own arrived in you already present, a material inheritance from your father's line rather than a skill you had to build through years of forced isolation. You solve real problems in solitude with a naturalness some people never manage even with real effort. When fully claimed, that self-sufficiency moves toward solutions other people take far longer to arrive at. It's most alive in the quiet, working through something practical without needing anyone else in the room.`,
      shadow: `A self-sufficiency this automatic is easy to treat as simple preference rather than a real inheritance worth protecting and using deliberately. Left unclaimed, the solutions it produces can stay entirely private, offered to no one, doing good only for your own situation. A material gift never shared functions, for everyone but you, as though it had never been given at all. The quiet you solve things in can quietly become the thing that keeps the solution from ever helping anyone else.`,
      invitation: `Ask yourself what practical solution you've worked out alone that's actually ready to be shared. Offer one piece of hard-won, practical understanding this week as something you're genuinely entitled to offer. You are allowed to claim a self-sufficiency you didn't have to force yourself into. Where might this inheritance matter if it finally left the room with you?`,
    },
    '10_H2': {
      title: `10 in Paternal Material Talent — The Wheel of Fortune`,
      tagline: `A Design of Inherited Timing`,
      mastery: `A practical feel for when material circumstances are actually turning — a market, an opportunity, a run of luck — arrived in you already active, a material inheritance from your father's line rather than a sensitivity you had to develop through years of watching patterns repeat. You sense a shift in fortune before it's officially announced. When claimed fully, that timing moves with a confidence other people spend a lifetime trying to build. It's sharpest right at the edge of a genuine practical turn.`,
      shadow: `A timing sense this automatic is easy to discount as mere hunch rather than a real inheritance worth acting on deliberately. Left unclaimed, it can also breed a kind of passivity — sensing the turn accurately and still waiting instead of acting, because trusting an unearned gift with real material consequences feels riskier than it should. The window a genuine turn actually opens rarely stays open long enough to reward hesitation. Sensing a shift correctly still counts for nothing if it's never actually acted on.`,
      invitation: `Ask yourself what shift you've already sensed clearly but haven't yet acted on. Act on one piece of this timing sense this week, treating it as a real, trustworthy inheritance. You are allowed to claim a feel for timing you didn't personally have to earn. Where might this gift matter if you actually moved on it?`,
    },
    '11_H2': {
      title: `11 in Paternal Material Talent — Strength`,
      mastery: `A practical capacity to keep working steadily under real material pressure — a heavy workload, a long project, a genuine strain — arrived in you already whole, a material inheritance from your father's line rather than endurance you had to forge through years of hardship. You carry weight without needing to dominate it or flee it, a quality other people spend real effort trying to build. When claimed fully, that steadiness moves with a quiet authority that reads, to people who had to earn theirs the hard way, as effortless. It's most present in exactly the stretches that would exhaust almost anyone else.`,
      shadow: `A steadiness this automatic is easy to underclaim, treating your own endurance as simple temperament rather than a real inheritance worth actively directing. Left unclaimed, it can also curdle into carrying more than your share indefinitely, because the gift was never consciously claimed as something that has limits too. What reads to everyone else as ease can be quietly costing you more than anyone realizes. The load other people assume you can always take on still needs somewhere to be set down.`,
      invitation: `Ask yourself where you've been carrying weight automatically rather than by real, conscious choice. Let yourself claim this endurance openly this week, and notice where it might also need a boundary. You are allowed to own a strength you didn't personally have to fight for. Where might this inheritance serve you better if you actually named it as yours?`,
    },
    '12_H2': {
      title: `12 in Paternal Material Talent — The Hanged Man`,
      tagline: `A Design of Inherited Patience`,
      mastery: `A practical capacity to wait for the right material moment, rather than forcing a decision too early, arrived in you already developed, an inheritance from your father's line rather than patience you had to build through years of forced waiting. You see the smarter, later move that other people miss by rushing. When fully claimed, that patience moves with an ease that looks, from outside, like natural wisdom. It surfaces most clearly whenever everyone else is pushing for a decision that isn't actually ready.`,
      shadow: `A patience this automatic is easy to treat as passivity rather than the real gift it is, letting waiting substitute for eventually acting. Left unclaimed, the insight it produces can stay permanently theoretical, admired privately but never brought back down into an actual, practical decision. The smarter move you already saw still has to actually be made at some point. Patience without an eventual decision just becomes a longer way of avoiding one.`,
      invitation: `Ask yourself what practical insight you've already reached through waiting that's actually ready to be acted on. Act on one piece of that understanding this week, treating the patience as a genuine, usable gift. You are allowed to claim wisdom you didn't personally have to suffer for. Where might this inheritance matter once it comes down off the pause?`,
    },
    '13_H2': {
      title: `13 in Paternal Material Talent — Death`,
      tagline: `A Design of Inherited Rebuilding`,
      mastery: `A practical capacity to dismantle something that's stopped working and rebuild it properly arrived in you already active, a material inheritance from your father's line rather than resilience you had to build through years of hard loss. You move through real, practical overhaul with a fluency other people spend a long time learning. When claimed fully, that capacity moves toward rebuilding other people take far longer to reach. It's most alive right at the edge of a system everyone else is still resisting letting go of.`,
      shadow: `An ease with rebuilding this automatic is easy to discount, treating your own resilience as coincidence rather than genuine inheritance. Left unclaimed, it can also tip into dismantling things reflexively rather than because they'd actually finished their usefulness. An inheritance never consciously directed can tear down things that didn't need tearing down. Some of what got dismantled along the way might genuinely have still had more use left in it.`,
      invitation: `Ask yourself whether a recent overhaul was genuinely necessary or simply reflex. Let one thing this week actually finish being rebuilt, on purpose, rather than starting the next teardown immediately. You are allowed to claim a resilience you didn't personally have to earn through loss. Where might this gift matter if you aimed it deliberately?`,
    },
    '14_H2': {
      title: `14 in Paternal Material Talent — Temperance`,
      tagline: `A Design of Inherited Calibration`,
      mastery: `A practical capacity to blend competing material demands into something sustainable arrived in you already whole, an inheritance from your father's line rather than a skill you had to build through years of trial. You hold two conflicting practical needs at once with an ease other people spend real effort developing. When claimed fully, that calibration moves toward genuine, workable balance other people take far longer to reach. It's most alive whenever two practical demands that don't naturally fit together land directly in front of you.`,
      shadow: `A balance this automatic is easy to underclaim as simple temperament rather than the genuine gift it is. Left unclaimed, it can also default to a permanent, exhausting neutrality — holding the middle out of habit rather than choosing it deliberately, because taking a real, practical stance has never felt like something the gift requires of you. The middle can start to feel like the only place this gift is allowed to stand. A balance held this consistently can start to look, from outside, like an inability to actually decide.`,
      invitation: `Ask yourself where you've been staying neutral automatically rather than by actual, considered choice. Take one clear, practical position this week, using this integrative gift on purpose. You are allowed to claim a balance you didn't personally have to struggle to build. Where might this inheritance matter if you occasionally aimed it at a real stance?`,
    },
    '15_H2': {
      title: `15 in Paternal Material Talent — The Devil`,
      tagline: `A Design of Inherited Realism`,
      mastery: `A practical capacity to see exactly what money, power, and material comfort actually require, without flinching, arrived in you already active, an inheritance from your father's line rather than honesty you had to earn through real struggle. You understand what actually drives material outcomes with a directness other people spend years developing. When claimed fully, that realism moves toward real advantage other people take far longer to reach. It's most alive in situations everyone else is still politely avoiding looking at directly.`,
      shadow: `A realism this automatic is easy to discount, treating your own unflinching sight as simply cynicism rather than genuine insight worth using with care. Left unclaimed, it can also tip into entanglement — seeing the material chain clearly while still being ruled by it, because clear sight was never actually converted into deliberate freedom. Naming the requirement accurately is not the same thing as actually being free of it. The clarity can start to feel like the whole achievement, when it was only ever meant to be the first step.`,
      invitation: `Ask yourself what you've seen clearly about your own material attachments that you haven't yet acted on. Name one honest truth this week using this realism on purpose. You are allowed to claim an honesty you didn't personally have to fight to acquire. Where might this inheritance matter if you actually used it?`,
    },
    '16_H2': {
      title: `16 in Paternal Material Talent — The Tower`,
      tagline: `A Design of Inherited Foresight`,
      mastery: `A practical capacity to see a failing structure clearly and early, before anyone else admits it's cracking, arrived in you already sharp, an inheritance from your father's line rather than instinct you had to build through repeated collapse. You register real, material instability almost involuntarily, ahead of the official signs. When claimed fully, that clarity moves toward honest reckoning other people take far longer to reach. It's most alive exactly where everyone else is still maintaining a comfortable appearance.`,
      shadow: `A foresight this automatic is easy to discount, treating your own early warnings as needless alarm rather than a genuine gift worth trusting. Left unclaimed, it can also tip into provoking collapse rather than waiting for one, because a truth this sharp is uncomfortable to simply sit with unused. Being right about the crack doesn't require you to be the one who causes it to fall. Timing the warning matters as much as having it in the first place.`,
      invitation: `Ask yourself what structure you've already sensed is unstable but haven't yet named aloud. Name one early warning this week, gently, using this clarity deliberately rather than letting it sit unused. You are allowed to claim a sharpness you didn't personally have to earn through repeated collapse. Where might this gift matter if you actually spoke it in time?`,
    },
    '17_H2': {
      title: `17 in Paternal Material Talent — The Star`,
      tagline: `A Design of Inherited Skill`,
      mastery: `A practical talent honed toward real, visible excellence arrived in you already forming, an inheritance from your father's line rather than skill you had to build entirely from scratch. You have a head start other people spend real years catching up to. When claimed fully, that skill moves toward professional recognition other people take far longer to reach. It's most alive whenever there's a real, tangible stage to actually perform this ability on.`,
      shadow: `A skill this early-arriving is easy to underclaim, treating your own head start as luck rather than the genuine gift it is. Left unclaimed, it can also stay underdeveloped simply because it never had to be earned through visible struggle, and what arrives easily is easy to leave unpolished past a certain point. A head start this real can quietly stall out well below what real, deliberate practice could still make of it. What came easily at the start rarely announces the exact point it stopped being enough.`,
      invitation: `Ask yourself where this skill has stalled simply because it came so easily. Push one piece of this ability further this week, on purpose, past where it naturally coasts. You are allowed to claim a head start you didn't personally have to earn. Where might this gift matter if you actually developed it further?`,
    },
    '18_H2': {
      title: `18 in Paternal Material Talent — The Moon`,
      tagline: `A Design of Inherited Instinct`,
      mastery: `A practical, gut-level instinct for real, material situations — reading a deal, a risk, a room — arrived in you already active, an inheritance from your father's line rather than intuition you had to train from scratch. You feel an undercurrent in a practical situation other people spend years learning to notice at all. When claimed fully, that instinct moves toward real advantage other people take far longer to reach. It's most alive in ambiguous, practical situations everyone else is still waiting for clear evidence to interpret.`,
      shadow: `An instinct this automatic is easy to discount, treating your own perception as simple anxiety rather than genuine insight worth checking and trusting. Left unclaimed, it can also tangle with fear — unable to tell which gut feelings are accurate and which are just static, because the gift was never deliberately trained to tell the difference. A feeling this vivid can carry the full weight of certainty even in the moments it's actually just noise. The strength of the gut feeling was never actually proof of its accuracy.`,
      invitation: `Ask yourself which gut feeling you've been treating as pure anxiety that might actually be real perception. Check one instinct this week against something concrete, using it deliberately rather than dismissing it. You are allowed to claim an intuition you didn't personally have to train from nothing. Where might this inheritance matter if you trusted it enough to verify it?`,
    },
    '19_H2': {
      title: `19 in Paternal Material Talent — The Sun`,
      tagline: `A Design of Inherited Vitality`,
      mastery: `A practical, physical vitality — real stamina and ease in the material world — arrived in you already active, an inheritance from your father's line rather than energy you had to build through years of effort. You bring genuine, sustained capability into practical work without needing to force it, a quality other people spend real energy trying to develop. When claimed fully, that vitality moves toward tangible accomplishment other people take far longer to reach. It's most alive in the middle of a long, demanding stretch that would wear most people down.`,
      shadow: `A vitality this automatic is easy to underclaim, treating your own capacity as simple personality rather than a real inheritance worth directing on purpose. Left unclaimed, it can also turn into a performance of constant capability, leaving no visible room for the days your energy is genuinely running lower. The brighter the constant output, the more a genuinely tired stretch can feel like a failure rather than simply being human. Capability this reliable still runs on a body that has genuine, real limits.`,
      invitation: `Ask yourself where you've been performing capability rather than actually resting when you need to. Let one hard, tiring stretch be visibly hard this week, without pushing through it to prove the vitality is endless. You are allowed to claim a vitality you didn't personally have to earn through suffering. Where might this inheritance matter if it included your lower-energy days too?`,
    },
    '20_H2': {
      title: `20 in Paternal Material Talent — Judgement`,
      tagline: `A Design of Inherited Readiness`,
      mastery: `A practical capacity to recognize exactly when it's time to act on a real, material opportunity arrived in you already active, an inheritance from your father's line rather than aptitude you had to develop through years of searching. You can tell a genuine practical opening from noise or wishful thinking with a clarity other people spend a long time trying to build. When claimed fully, that recognition moves toward real, tangible growth other people take far longer to reach. It's most alive exactly at the point most people are still hesitating to commit.`,
      shadow: `A readiness this automatic is easy to underclaim, treating your own clarity about the opening as coincidence rather than a genuine gift worth trusting. Left unclaimed, it can also mean chasing the next opportunity before the current one has actually been carried all the way through, since a gift this reliable rarely gives you a reason to sit still. The next opening can start to feel more real than the one you're actually standing inside right now. An opportunity never carried to completion rarely teaches what it was actually there to teach.`,
      invitation: `Ask yourself whether you're fully committed to your current opportunity or already eyeing the next one. Stay with what's actually in front of you this week before chasing the next opening. You are allowed to claim a readiness you didn't personally have to search hard to find. Where might this inheritance matter if you let the current one finish first?`,
    },
    '21_H2': {
      title: `21 in Paternal Material Talent — The World`,
      tagline: `A Design of Inherited Completion`,
      mastery: `A practical capacity to recognize when something real has actually reached completion arrived in you already precise, an inheritance from your father's line rather than judgment you had to develop through years of finishing things yourself. You know the difference between finished and merely stopped with a clarity other people spend real time learning. When claimed fully, that recognition moves toward real, tangible closure other people take far longer to reach. It's most alive right at the edge of something that's actually, quietly, already done.`,
      shadow: `A recognition this automatic is easy to underclaim, treating your own sense of completion as pickiness rather than a genuine gift worth trusting. Left unclaimed, it can also tip into an endless search for total polish, refusing to call a real, practical thing finished because nothing ever quite meets the standard the gift itself was built to recognize. Genuine, working results can end up sitting permanently in a kind of almost-there. The standard for done can quietly keep moving just out of reach.`,
      invitation: `Ask yourself what you've been withholding completion from simply because it hasn't felt polished enough. Declare one thing finished this week at genuinely good enough. You are allowed to claim a sense of completion you didn't personally have to earn through struggle. Where might this inheritance matter if you let something be done before it's perfect?`,
    },
    '22_H2': {
      title: `22 in Paternal Material Talent — The Fool`,
      tagline: `A Design of Inherited Boldness`,
      mastery: `A practical willingness to start something real without a guarantee it'll work arrived in you already whole, an inheritance from your father's line rather than courage you had to build risk by risk. You approach a genuine practical unknown as an open opportunity rather than a threat, with an ease other people spend years learning. When claimed fully, that boldness moves toward real, tangible discovery other people take far longer to reach. It's most alive at the exact edge of something that has no guarantee attached to it yet.`,
      shadow: `A boldness this automatic is easy to underclaim, treating your own openness as naivety rather than the genuine gift it is. Left unclaimed, it can also avoid the depth that comes from actually settling into one venture, since a gift this comfortable with starting rarely gets tested by staying through the harder middle. The excitement of a new venture can quietly outcompete the slower reward of actually seeing one through. What looks like fresh courage each time can, in practice, be the same avoidance wearing a new outfit.`,
      invitation: `Ask yourself what open venture you've been quietly considering that's actually a distraction from the one you're already committed to. Commit to one already-chosen path this week rather than eyeing the next leap. You are allowed to claim a boldness you didn't personally have to build risk by risk. Where might this inheritance matter if you let it also apply to staying?`,
    },

    // ── Lineage Square Talents: Maternal Material Talent (I2) ───────────────
    // Source: Destiny-Matrix-Calculation-Guide.extracted.md, Page 10 —
    // I2 = I + L2 (explicitly given, unlike F2/G2/H2 which follow the same
    // stated pattern). I is the Maternal Material ancestral corner, so I2
    // carries the mother's-line inheritance in the material/practical
    // register I already sits in — sustaining, resourcefulness, keeping
    // real things running day to day — distinct from G2's spiritual
    // register and H2's paternal-material one.

    '1_I2': {
      title: `1 in Maternal Material Talent — The Magician`,
      tagline: `A Design of Inherited Resourcefulness`,
      mastery: `A practical knack for making something out of whatever's actually available right now arrived in you already active, carried through your mother's line as hands-on resourcefulness rather than a skill you had to teach yourself from zero. You start with what's in front of you and move, with a fluency other people spend years developing. When claimed fully, that resourcefulness moves ahead of hesitation, producing a real result from real, limited materials. It's most alive whenever there's genuinely no perfect option available and something still needs to get done.`,
      shadow: `A resourcefulness this immediate is easy to under-credit, treating your own quick improvising as luck rather than a genuine inheritance worth claiming on purpose. Left unclaimed, it can also run without real direction, improvising reflexively rather than aimed at something you've actually decided matters. An inheritance never consciously directed keeps making do even when better options were actually available. Improvising well doesn't automatically mean improvising was actually necessary.`,
      invitation: `Ask yourself what you improvised recently out of pure habit rather than real decision. Point this ability at one thing this week you've actually chosen on purpose. You are allowed to claim a practical skill you didn't personally have to teach yourself. Where might this gift matter more if you aimed it deliberately?`,
    },
    '2_I2': {
      title: `2 in Maternal Material Talent — The High Priestess`,
      tagline: `A Design of Inherited Practical Sense`,
      mastery: `A quiet, practical accuracy about how a real household, budget, or day-to-day system actually runs arrived in you already sharp, a material inheritance from your mother's line rather than expertise you had to earn through years of trial. You read the mechanics of ordinary, sustaining life correctly on the first look. When trusted fully, that sense moves ahead of guesswork, landing on what's actually true about how something practical functions. It's sharpest whenever a domestic or logistical problem is more tangled than it looks.`,
      shadow: `A sense this automatic is easy to keep to yourself, treating your accurate read as unremarkable rather than a real inherited advantage worth voicing. Left unclaimed, the insight it produces stays private, correcting nothing, helping no one but you. An inheritance never actually spoken functions, for everyone else, as though it had never been given at all. Precision this quiet still has to be said out loud to actually change anything.`,
      invitation: `Ask yourself what you already understand accurately about a practical situation that you haven't said aloud. Voice one precise, practical observation this week as something you're genuinely entitled to trust. You are allowed to claim an accuracy you didn't personally have to earn through trial. Where might this gift matter if it left your own head?`,
    },
    '3_I2': {
      title: `3 in Maternal Material Talent — The Empress`,
      tagline: `A Design of Inherited Sustenance`,
      mastery: `A practical instinct for keeping a real, physical space and the people in it genuinely nourished arrived in you already alive, a material inheritance from your mother's line rather than a skill you had to consciously build. You make real, everyday comfort happen with a naturalness other people spend years developing. When claimed fully, that instinct moves toward tangible abundance in whatever it's turned toward. It's most alive around anything real that needs practical, sustained care to actually flourish.`,
      shadow: `A sustenance this automatic is easy to give away entirely, since it costs you so little that the imbalance of providing outward without receiving any back can go unnoticed for a long time. Left unclaimed, the same instinct that tends to everyone else's material comfort can quietly forget to tend to your own, because caring for you was never the gift's original assignment. The same care that sustains everything around you can leave you personally unattended for a very long time. Sustenance this automatic can be extended for years before anyone notices the imbalance, including you.`,
      invitation: `Ask yourself where this sustaining care has been flowing entirely outward without circling back to you. Direct one deliberate act of this same practical care toward yourself this week. You are allowed to claim a gift you didn't have to build and still let it include you. Where might this inheritance matter most if it finally came home?`,
    },
    '4_I2': {
      title: `4 in Maternal Material Talent — The Emperor`,
      tagline: `A Design of Inherited Order`,
      mastery: `The ability to keep a real, ongoing system — a household, a routine, a shared responsibility — actually running arrived in you already whole, a material inheritance from your mother's line rather than skill you had to earn through years of trial. You look at day-to-day disorder and already see the structure that would make it work. When claimed fully, that instinct moves with an authority other people had to work much harder to develop. It shows up soonest wherever something practical and ongoing is actively falling apart.`,
      shadow: `An order this automatic is easy to treat as ordinary rather than the genuine gift it is, quietly assuming everyone can see the structure as clearly as you do. Left unclaimed, it can also default to rigidity rather than deliberate structure, imposing order out of reflex instead of considered judgment. An inheritance never consciously claimed structures things whether or not structure was actually being asked for. Other people can end up living inside a routine they never actually agreed to.`,
      invitation: `Ask yourself where you've been maintaining order out of habit rather than actual decision. Choose one situation this week and bring structure to it deliberately, naming to yourself that the clarity is a real, inherited strength. You are allowed to claim authority you didn't personally build from scratch. What might this gift do if you aimed it on purpose?`,
    },
    '5_I2': {
      title: `5 in Maternal Material Talent — The Hierophant`,
      tagline: `A Design of Inherited Know-How`,
      mastery: `A practical feel for the tested, proven way of keeping something real actually functioning arrived in you already formed, a material inheritance from your mother's line rather than know-how you had to earn through your own long trial. You recognize a sound domestic or practical method almost on contact, the way this practical sense runs in families that carry it. When trusted, that recognition moves with an authority that took other people real years to build. It's most active whenever something genuinely needs a proven approach rather than a fresh improvisation.`,
      shadow: `A know-how this automatic can feel borrowed rather than truly yours, and borrowed skill is easy to underuse out of a quiet sense you haven't earned the right to teach it. Left unclaimed, it can also calcify into rule-following for its own sake, sticking to the inherited method even in the rare moment that actually calls for something new. What was meant to be a foundation can end up functioning as a ceiling instead. A method this trusted rarely gets questioned, even in the one case it genuinely doesn't fit.`,
      invitation: `Ask yourself which piece of inherited practical know-how you've been sitting on without actually offering it. Share one piece of tested method this week as something you're genuinely entitled to teach. You are allowed to speak with authority you inherited rather than personally forged. Where might this gift matter more if you actually claimed it?`,
    },
    '6_I2': {
      title: `6 in Maternal Material Talent — The Lovers`,
      tagline: `A Design of Inherited Discernment`,
      mastery: `A practical capacity to choose what actually serves the people and the life you're building, rather than what's simply convenient, arrived in you already developed, a material inheritance from your mother's line rather than discernment you had to build alone. You can tell, almost instantly, which practical option actually serves what matters. When trusted, that judgment moves ahead of second-guessing, landing on the genuinely better choice before you've had to reason your way there. It's sharpest at real forks, where the easy option and the true option visibly diverge.`,
      shadow: `A discernment this automatic is easy to under-credit, treating your own practical clarity as luck rather than a genuine capacity worth trusting on purpose. Left unclaimed, the gift can go unused at the exact moments it matters most, deferred to convenience simply because using it deliberately never became a practiced habit. The choices that mattered most can end up being the ones this gift was never actually invited into. Practical judgment this reliable still benefits from being checked, not just trusted by default.`,
      invitation: `Ask yourself which recent choice you made by default rather than by genuinely consulting this inherited discernment. Make one decision this week by deliberately checking it against what you actually value. You are allowed to trust a clarity you didn't personally have to earn. Where might this gift change your next real choice?`,
    },
    '7_I2': {
      title: `7 in Maternal Material Talent — The Chariot`,
      tagline: `A Design of Inherited Follow-Through`,
      mastery: `A capacity for sustained, practical momentum toward keeping real, everyday life actually moving forward arrived in you already running, a material inheritance from your mother's line rather than motivation you had to manufacture from nothing. You keep concrete responsibilities moving with a steadiness other people had to train themselves into over years. When fully claimed, that follow-through moves with a confidence that looks, from the outside, like natural discipline. It's most alive whenever there's real, ongoing distance left to cover.`,
      shadow: `A follow-through this automatic is easy to treat as simple personality rather than a real gift worth directing on purpose. Left unclaimed, it can run without a chosen destination, generating effort for its own sake rather than aimed at a result you've actually decided matters. An inheritance never consciously steered keeps moving regardless of whether the direction still makes sense. Distance covered can be mistaken for progress made, even when the two have quietly stopped matching.`,
      invitation: `Ask yourself whether your current momentum is actually aimed at something you chose, or simply running on inherited habit. Name one real destination this week and direct this follow-through at it deliberately. You are allowed to claim momentum you didn't personally have to build. Where might this gift take you if you actually pointed it?`,
    },
    '8_I2': {
      title: `8 in Maternal Material Talent — Justice`,
      tagline: `A Design of Inherited Balance`,
      mastery: `A sharp, practical sense of what's actually fair in real, everyday material terms — a shared chore, a divided cost, a fair turn — arrived in you already calibrated, an inheritance from your mother's line rather than an ethic you had to build from scratch. You register imbalance in ordinary, shared life almost involuntarily. When claimed fully, that instinct moves with an authority other people spend years developing through trial. It's most active in situations everyone else is still calling merely complicated.`,
      shadow: `A balance this automatic is easy to underclaim, treating your own sense of fairness as simply personality rather than a real inheritance worth trusting with weight. Left unclaimed, it can also go rigid, applying an inherited standard mechanically rather than with the discernment a truly owned ethic would bring. A standard enforced without that understanding can land harder than it was ever meant to. Fairness this instinctive still deserves the same scrutiny you'd give a conclusion you had to actually work for.`,
      invitation: `Ask yourself where you've applied this sense of fairness automatically rather than with real thought behind it. Bring this instinct to one situation this week deliberately, naming it as a genuine inherited strength. You are allowed to claim ethical clarity you didn't personally forge alone. Where might this gift matter more if you actually owned it?`,
    },
    '9_I2': {
      title: `9 in Maternal Material Talent — The Hermit`,
      tagline: `A Design of Inherited Self-Reliance`,
      mastery: `A practical capacity to handle real, everyday problems entirely on your own arrived in you already present, a material inheritance from your mother's line rather than a skill you had to build through years of forced isolation. You solve ordinary, real problems in solitude with a naturalness some people never manage even with real effort. When fully claimed, that self-reliance moves toward solutions other people take far longer to arrive at. It's most alive in the quiet, working through something practical without needing anyone else in the room.`,
      shadow: `A self-reliance this automatic is easy to treat as simple preference rather than a real inheritance worth protecting and using deliberately. Left unclaimed, the solutions it produces can stay entirely private, offered to no one, doing good only for your own situation. A material gift never shared functions, for everyone but you, as though it had never been given at all. The quiet you solve things in can quietly become the thing that keeps the solution from ever helping anyone else.`,
      invitation: `Ask yourself what practical solution you've worked out alone that's actually ready to be shared. Offer one piece of hard-won, practical understanding this week as something you're genuinely entitled to offer. You are allowed to claim a self-reliance you didn't have to force yourself into. Where might this inheritance matter if it finally left the room with you?`,
    },
    '10_I2': {
      title: `10 in Maternal Material Talent — The Wheel of Fortune`,
      tagline: `A Design of Inherited Adaptability`,
      mastery: `A practical feel for when everyday material circumstances are actually shifting — a routine, a household rhythm, a resource running low or newly available — arrived in you already active, a material inheritance from your mother's line rather than a sensitivity you had to develop through years of watching patterns repeat. You sense a shift before it's officially announced, the way this attunement runs in families that carry it. When claimed fully, that timing moves with a confidence other people spend a lifetime trying to build. It's sharpest right at the edge of a genuine, practical turn.`,
      shadow: `A timing sense this automatic is easy to discount as mere hunch rather than a real inheritance worth acting on deliberately. Left unclaimed, it can also breed a kind of passivity — sensing the shift accurately and still waiting instead of adjusting, because trusting an unearned gift with real consequences feels riskier than it should. The window a genuine shift actually opens rarely stays open long enough to reward hesitation. Sensing a change correctly still counts for nothing if it's never actually acted on.`,
      invitation: `Ask yourself what shift you've already sensed clearly but haven't yet acted on. Act on one piece of this timing sense this week, treating it as a real, trustworthy inheritance. You are allowed to claim a feel for timing you didn't personally have to earn. Where might this gift matter if you actually moved on it?`,
    },
    '11_I2': {
      title: `11 in Maternal Material Talent — Strength`,
      mastery: `A practical capacity to keep sustaining real, ongoing responsibility under real pressure — a long stretch of caretaking, a household under strain — arrived in you already whole, a material inheritance from your mother's line rather than endurance you had to forge through years of hardship. You carry weight without needing to dominate it or flee it, a quality other people spend real effort trying to build. When claimed fully, that steadiness moves with a quiet authority that reads, to people who had to earn theirs the hard way, as effortless. It's most present in exactly the stretches that would exhaust almost anyone else.`,
      shadow: `A steadiness this automatic is easy to underclaim, treating your own endurance as simple temperament rather than a real inheritance worth actively directing. Left unclaimed, it can also curdle into carrying more than your share indefinitely, because the gift was never consciously claimed as something that has limits too. What reads to everyone else as ease can be quietly costing you more than anyone realizes. The load other people assume you can always take on still needs somewhere to be set down.`,
      invitation: `Ask yourself where you've been carrying weight automatically rather than by real, conscious choice. Let yourself claim this endurance openly this week, and notice where it might also need a boundary. You are allowed to own a strength you didn't personally have to fight for. Where might this inheritance serve you better if you actually named it as yours?`,
    },
    '12_I2': {
      title: `12 in Maternal Material Talent — The Hanged Man`,
      tagline: `A Design of Inherited Patience`,
      mastery: `A practical capacity to wait for the right, real-world moment rather than forcing a domestic or material decision too early arrived in you already developed, an inheritance from your mother's line rather than patience you had to build through years of forced waiting. You see the smarter, later move that other people miss by rushing a practical decision. When fully claimed, that patience moves with an ease that looks, from outside, like natural wisdom. It surfaces most clearly whenever everyone else is pushing for a decision that isn't actually ready.`,
      shadow: `A patience this automatic is easy to treat as passivity rather than the real gift it is, letting waiting substitute for eventually acting. Left unclaimed, the insight it produces can stay permanently theoretical, admired privately but never brought back down into an actual, practical decision. The smarter move you already saw still has to actually be made at some point. Patience without an eventual decision just becomes a longer way of avoiding one.`,
      invitation: `Ask yourself what practical insight you've already reached through waiting that's actually ready to be acted on. Act on one piece of that understanding this week, treating the patience as a genuine, usable gift. You are allowed to claim wisdom you didn't personally have to suffer for. Where might this inheritance matter once it comes down off the pause?`,
    },
    '13_I2': {
      title: `13 in Maternal Material Talent — Death`,
      tagline: `A Design of Inherited Renewal`,
      mastery: `A practical capacity to let an old, worn-out way of sustaining daily life end so a truer one can begin arrived in you already active, a material inheritance from your mother's line rather than resilience you had to build through years of hard loss. You move through real, domestic transformation with a fluency other people spend a long time learning. When claimed fully, that capacity moves toward renewal other people take far longer to reach. It's most alive right at the edge of a routine everyone else is still resisting letting go of.`,
      shadow: `An ease with renewal this automatic is easy to discount, treating your own resilience as coincidence rather than genuine inheritance. Left unclaimed, it can also tip into constant reinvention for its own sake, ending routines reflexively rather than because they'd actually stopped serving anyone. An inheritance never consciously directed can dismantle things that didn't need dismantling. Some of what got ended along the way might genuinely have still had more use left in it.`,
      invitation: `Ask yourself whether a recent overhaul of routine was genuinely necessary or simply reflex. Let one thing this week actually finish being rebuilt, on purpose, rather than starting the next teardown immediately. You are allowed to claim a resilience you didn't personally have to earn through loss. Where might this gift matter if you aimed it deliberately?`,
    },
    '14_I2': {
      title: `14 in Maternal Material Talent — Temperance`,
      tagline: `A Design of Inherited Moderation`,
      mastery: `A practical capacity to blend competing everyday demands — rest and duty, spending and saving — into something sustainable arrived in you already whole, an inheritance from your mother's line rather than a skill you had to build through years of trial. You hold two conflicting practical needs at once with an ease other people spend real effort developing. When claimed fully, that calibration moves toward genuine, workable balance other people take far longer to reach. It's most alive whenever two practical demands that don't naturally fit together land directly in front of you.`,
      shadow: `A moderation this automatic is easy to underclaim as simple temperament rather than the genuine gift it is. Left unclaimed, it can also default to a permanent, exhausting neutrality — holding the middle out of habit rather than choosing it deliberately, because taking a real, practical stance has never felt like something the gift requires of you. The middle can start to feel like the only place this gift is allowed to stand. A balance held this consistently can start to look, from outside, like an inability to actually decide.`,
      invitation: `Ask yourself where you've been staying neutral automatically rather than by actual, considered choice. Take one clear, practical position this week, using this integrative gift on purpose. You are allowed to claim a balance you didn't personally have to struggle to build. Where might this inheritance matter if you occasionally aimed it at a real stance?`,
    },
    '15_I2': {
      title: `15 in Maternal Material Talent — The Devil`,
      tagline: `A Design of Inherited Practicality`,
      mastery: `A practical capacity to see exactly what real, day-to-day comfort and security actually require, without flinching, arrived in you already active, an inheritance from your mother's line rather than honesty you had to earn through real struggle. You understand what actually sustains ordinary life with a directness other people spend years developing. When claimed fully, that realism moves toward real, practical advantage other people take far longer to reach. It's most alive in situations everyone else is still politely avoiding looking at directly.`,
      shadow: `A practicality this automatic is easy to discount, treating your own unflinching sight as simply cynicism rather than genuine insight worth using with care. Left unclaimed, it can also tip into entanglement — seeing what sustains you clearly while still being ruled by the need for it, rather than converting that clear sight into deliberate freedom. Naming what sustains you accurately is not the same thing as actually being free of needing it. The clarity can start to feel like the whole achievement, when it was only ever meant to be the first step.`,
      invitation: `Ask yourself what you've seen clearly about your own material attachments that you haven't yet acted on. Name one honest truth this week using this practicality on purpose. You are allowed to claim an honesty you didn't personally have to fight to acquire. Where might this inheritance matter if you actually used it?`,
    },
    '16_I2': {
      title: `16 in Maternal Material Talent — The Tower`,
      tagline: `A Design of Inherited Foresight`,
      mastery: `A practical capacity to see a failing routine or household system clearly and early, before anyone else admits it's cracking, arrived in you already sharp, an inheritance from your mother's line rather than instinct you had to build through repeated collapse. You register real, everyday instability almost involuntarily, ahead of the official signs. When claimed fully, that clarity moves toward honest reckoning other people take far longer to reach. It's most alive exactly where everyone else is still maintaining a comfortable appearance.`,
      shadow: `A foresight this automatic is easy to discount, treating your own early warnings as needless alarm rather than a genuine gift worth trusting. Left unclaimed, it can also tip into provoking collapse rather than waiting for one, because a truth this sharp is uncomfortable to simply sit with unused. Being right about the crack doesn't require you to be the one who causes it to fall. Timing the warning matters as much as having it in the first place.`,
      invitation: `Ask yourself what structure you've already sensed is unstable but haven't yet named aloud. Name one early warning this week, gently, using this clarity deliberately rather than letting it sit unused. You are allowed to claim a sharpness you didn't personally have to earn through repeated collapse. Where might this gift matter if you actually spoke it in time?`,
    },
    '17_I2': {
      title: `17 in Maternal Material Talent — The Star`,
      tagline: `A Design of Inherited Skill`,
      mastery: `A practical, domestic talent honed toward real, visible excellence — the specific skill your household or family line is quietly known for — arrived in you already forming, an inheritance from your mother's line rather than skill you had to build entirely from scratch. You have a head start other people spend real years catching up to. When claimed fully, that skill moves toward real, domestic excellence other people take far longer to reach. It's most alive whenever there's a real, practical stage to actually perform this ability on.`,
      shadow: `A skill this early-arriving is easy to underclaim, treating your own head start as luck rather than the genuine gift it is. Left unclaimed, it can also stay underdeveloped simply because it never had to be earned through visible struggle, and what arrives easily is easy to leave unpolished past a certain point. A head start this real can quietly stall out well below what real, deliberate practice could still make of it. What came easily at the start rarely announces the exact point it stopped being enough.`,
      invitation: `Ask yourself where this skill has stalled simply because it came so easily. Push one piece of this ability further this week, on purpose, past where it naturally coasts. You are allowed to claim a head start you didn't personally have to earn. Where might this gift matter if you actually developed it further?`,
    },
    '18_I2': {
      title: `18 in Maternal Material Talent — The Moon`,
      tagline: `A Design of Inherited Instinct`,
      mastery: `A practical, gut-level instinct for real, everyday situations — knowing something's off in the house, the budget, the routine, before you can say why — arrived in you already active, an inheritance from your mother's line rather than intuition you had to train from scratch. You feel an undercurrent in ordinary, practical life other people spend years learning to notice at all. When claimed fully, that instinct moves toward real, practical advantage other people take far longer to reach. It's most alive in ambiguous, everyday situations everyone else is still waiting for clear evidence to interpret.`,
      shadow: `An instinct this automatic is easy to discount, treating your own perception as simple anxiety rather than genuine insight worth checking and trusting. Left unclaimed, it can also tangle with fear — unable to tell which gut feelings are accurate and which are just static, because the gift was never deliberately trained to tell the difference. A feeling this vivid can carry the full weight of certainty even in the moments it's actually just noise. The strength of the gut feeling was never actually proof of its accuracy.`,
      invitation: `Ask yourself which gut feeling you've been treating as pure anxiety that might actually be real perception. Check one instinct this week against something concrete, using it deliberately rather than dismissing it. You are allowed to claim an intuition you didn't personally have to train from nothing. Where might this inheritance matter if you trusted it enough to verify it?`,
    },
    '19_I2': {
      title: `19 in Maternal Material Talent — The Sun`,
      tagline: `A Design of Inherited Vitality`,
      mastery: `A practical, physical vitality — real, natural stamina for keeping ordinary, sustaining life running — arrived in you already active, an inheritance from your mother's line rather than energy you had to build through years of effort. You bring genuine, sustained capability into everyday practical life without needing to force it, a quality other people spend real energy trying to develop. When claimed fully, that vitality moves toward tangible accomplishment other people take far longer to reach. It's most alive in the middle of a long, demanding stretch that would wear most people down.`,
      shadow: `A vitality this automatic is easy to underclaim, treating your own capacity as simple personality rather than a real inheritance worth directing on purpose. Left unclaimed, it can also turn into a performance of constant capability, leaving no visible room for the days your energy is genuinely running lower. The brighter the constant output, the more a genuinely tired stretch can feel like a failure rather than simply being human. Capability this reliable still runs on a body that has genuine, real limits.`,
      invitation: `Ask yourself where you've been performing capability rather than actually resting when you need to. Let one hard, tiring stretch be visibly hard this week, without pushing through it to prove the vitality is endless. You are allowed to claim a vitality you didn't personally have to earn through suffering. Where might this inheritance matter if it included your lower-energy days too?`,
    },
    '20_I2': {
      title: `20 in Maternal Material Talent — Judgement`,
      tagline: `A Design of Inherited Readiness`,
      mastery: `A practical capacity to recognize exactly when it's time to act on a real, everyday opportunity for a better material arrangement arrived in you already active, an inheritance from your mother's line rather than aptitude you had to develop through years of searching. You can tell a genuine practical opening from noise or wishful thinking with a clarity other people spend a long time trying to build. When claimed fully, that recognition moves toward real, tangible improvement other people take far longer to reach. It's most alive exactly at the point most people are still hesitating to commit.`,
      shadow: `A readiness this automatic is easy to underclaim, treating your own clarity about the opening as coincidence rather than a genuine gift worth trusting. Left unclaimed, it can also mean chasing the next improvement before the current one has actually been carried all the way through, since a gift this reliable rarely gives you a reason to sit still. The next arrangement can start to feel more real than the one you're actually living inside right now. An improvement never carried to completion rarely teaches what it was actually there to teach.`,
      invitation: `Ask yourself whether you're fully committed to your current arrangement or already eyeing the next improvement. Stay with what's actually in front of you this week before chasing the next opening. You are allowed to claim a readiness you didn't personally have to search hard to find. Where might this inheritance matter if you let the current one finish first?`,
    },
    '21_I2': {
      title: `21 in Maternal Material Talent — The World`,
      tagline: `A Design of Inherited Completion`,
      mastery: `A practical capacity to recognize when something real and ongoing has actually reached a genuinely stable, complete rhythm arrived in you already precise, an inheritance from your mother's line rather than judgment you had to develop through years of finishing things yourself. You know the difference between finished and merely stopped with a clarity other people spend real time learning. When claimed fully, that recognition moves toward real, lasting closure other people take far longer to reach. It's most alive right at the edge of something that's actually, quietly, already working.`,
      shadow: `A recognition this automatic is easy to underclaim, treating your own sense of completion as pickiness rather than a genuine gift worth trusting. Left unclaimed, it can also tip into an endless search for a more perfect routine, refusing to call a real, working system finished because nothing ever quite meets the standard the gift itself was built to recognize. Genuine, working routines can end up sitting permanently in a kind of almost-there. The standard for done can quietly keep moving just out of reach.`,
      invitation: `Ask yourself what you've been withholding completion from simply because it hasn't felt polished enough. Declare one thing finished this week at genuinely good enough. You are allowed to claim a sense of completion you didn't personally have to earn through struggle. Where might this inheritance matter if you let something be done before it's perfect?`,
    },
    '22_I2': {
      title: `22 in Maternal Material Talent — The Fool`,
      tagline: `A Design of Inherited Openness`,
      mastery: `A practical willingness to try a genuinely new way of managing real, everyday life without a guarantee it'll work arrived in you already whole, an inheritance from your mother's line rather than courage you had to build attempt by attempt. You approach a genuine practical unknown as an open opportunity rather than a threat, with an ease other people spend years learning. When claimed fully, that openness moves toward real, tangible discovery other people take far longer to reach. It's most alive at the exact edge of something that has no guarantee attached to it yet.`,
      shadow: `An openness this automatic is easy to underclaim, treating your own willingness as naivety rather than the genuine gift it is. Left unclaimed, it can also avoid the depth that comes from actually settling into one real system, since a gift this comfortable with starting fresh rarely gets tested by staying through the harder middle. The excitement of a fresh approach can quietly outcompete the slower reward of actually seeing one through. What looks like fresh courage each time can, in practice, be the same avoidance wearing a new outfit.`,
      invitation: `Ask yourself what new arrangement you've been quietly considering that's actually a distraction from the one you're already committed to. Commit to one already-chosen approach this week rather than eyeing the next fresh start. You are allowed to claim an openness you didn't personally have to build attempt by attempt. Where might this inheritance matter if you let it also apply to staying?`,
    },

    // ── Heart Zone: Spiritual Desire, vertical line (HZV) ──────────────────

    '1_HZV': {
      title: `1 in Spiritual Desire — The Magician`,
      tagline: `A Design of the Self-Authored Life`,
      mastery: `Your heart wants to author its own destiny, guided by intuition rather than instruction handed down by someone else. It wants to originate a life, not simply execute a plan that was already written. That desire is genuine and specific, not vague restlessness — it knows exactly what self-authorship would feel like. And when you actually follow it, the resulting choices carry a clarity borrowed choices never quite have.`,
      shadow: `You do what looks right instead of what feels true, and the gap runs underneath everything as a quiet static. Underneath the static is often a fear that trusting your own authorship and being wrong would cost more than simply following the script. You keep making the expected move while some part of you registers, each time, that it wasn't actually your move. The static never resolves because the actual desire is never actually acted on.`,
      invitation: `Ask yourself honestly what your own instinct is telling you, underneath the expected script. Make one choice today from your own intuitive pull, rather than the expected script. Choose it even without external confirmation that it's right. Notice that following it doesn't require abandoning what looks sensible to everyone else.`,
    },

    '2_HZV': {
      title: `2 in Spiritual Desire — The High Priestess`,
      tagline: `A Design of the Believed Knowing`,
      mastery: `Your heart wants to trust its own intuition enough to actually live by it, not just privately register it. It wants the inner sense of knowing to carry real authority, equal to any outside evidence. That desire for self-trust is specific and genuine, not naive certainty — it's asking to be believed, not simply followed blindly. And when you do trust it, the knowing tends to hold up under later scrutiny.`,
      shadow: `You second-guess a clear sense and wait for outside confirmation before it counts as real. Underneath the second-guessing is often a fear that trusting your own knowing, unconfirmed, would leave you exposed if it turned out wrong. You feel the clear sense and then quietly shelve it until someone else validates it. The waiting costs you the timing when the knowing would have mattered most.`,
      invitation: `Ask yourself honestly what you already know, before you go looking for someone to confirm it. Believe one inner knowing today without asking anyone to confirm it first. Act on it as though it were already validated. Notice that the knowing doesn't need outside permission to be real.`,
    },

    '3_HZV': {
      title: `3 in Spiritual Desire — The Empress`,
      tagline: `A Design of Purposeful Loveliness`,
      mastery: `Your heart wants harmony, beauty, and connection, a nurturing life that feeds it, not just a productive one that keeps it busy. It wants ordinary moments to actually be lovely, not merely functional. That desire is specific and legitimate, not indulgent — beauty genuinely restores something productivity alone can't reach. And when you build it in deliberately, the nurturing actually sustains the productivity too.`,
      shadow: `You end up productive and surrounded by very little beauty, quietly starving the part that wanted loveliness. Underneath the starving is often a fear that prioritizing beauty over output would look frivolous or unearned. You defer the nurturing indefinitely, treating it as a reward for later that never actually arrives. The deferral costs you a sustained depletion that no amount of productivity resolves.`,
      invitation: `Ask yourself honestly what you've been postponing in the name of getting things done. Let one ordinary moment today be beautiful on purpose. Choose it deliberately, not as an afterthought. Notice that this doesn't cost you the productivity you were protecting.`,
    },

    '4_HZV': {
      title: `4 in Spiritual Desire — The Emperor`,
      tagline: `A Design of the Built Foundation`,
      mastery: `Your heart wants a real, felt stability, security built through conscious choice rather than through gripping everything at once. It wants ground sturdy enough to actually relax into, not just a wide perimeter to defend. That desire for genuine structure is specific, not a want for control disguised as calm. And when stability is actually built, deliberately, piece by piece, the relaxing that follows is real.`,
      shadow: `You control everything in sight because nothing underneath ever feels sturdy enough to relax into. Underneath the control is often a fear that letting go of any single piece would reveal the whole structure was never actually solid. You grip the entire picture instead of building the one piece that would genuinely hold. The gripping exhausts you without ever producing the stability it was meant to protect.`,
      invitation: `Ask yourself honestly which single piece of structure, if built, would actually let you relax. Build one small, real piece of structure today rather than gripping the whole picture. Focus the effort narrowly instead of spreading it everywhere. Notice that one solid piece does more for the felt stability than controlling everything at once.`,
    },

    '5_HZV': {
      title: `5 in Spiritual Desire — The Hierophant`,
      tagline: `A Design of the Lived Teaching`,
      mastery: `Your heart wants to belong to something larger than itself and hand real wisdom forward to someone else. It wants what it's learned to actually matter, transmitted rather than merely accumulated. That desire for meaningful belonging and legacy is specific, not generic curiosity about ideas. And once you actually live by what you've learned, the sense of belonging deepens rather than staying theoretical.`,
      shadow: `You collect teachings without ever letting any of them actually change you. Underneath the collecting is often a fear that being truly changed by a teaching would mean surrendering control over who you currently are. You accumulate wisdom as information while your actual behavior stays exactly the same. The collection grows while the belonging it was supposed to produce never quite arrives.`,
      invitation: `Ask yourself honestly which teaching you already know but haven't actually put into practice. Choose one teaching you've already collected and actually live by it today. Apply it concretely, not just intellectually. Notice that living by it, even once, feels different from simply knowing it.`,
    },

    '6_HZV': {
      title: `6 in Spiritual Desire — The Lovers`,
      tagline: `A Design of the Named Depth`,
      mastery: `Your heart wants real, deep spiritual connection, love felt at its fullest rather than at its most convenient or manageable. It knows the difference between adequate closeness and the kind that actually reaches it. That desire for real depth is specific and legitimate, not excessive longing. And naming it honestly tends to move you toward relationships that can actually meet it.`,
      shadow: `You settle for adequate connection while quietly starving for the deep kind, afraid that wanting more makes you ungrateful. Underneath the fear is often a belief that naming a deeper want would dishonor the connection you already have. You accept the manageable version and let the actual longing go unspoken, even to yourself. The unspoken longing doesn't disappear; it just keeps running as quiet dissatisfaction.`,
      invitation: `Ask yourself honestly what depth of connection you're actually settling below. Name today, honestly, what depth of connection you actually want. Say it to yourself in specific terms, not a vague sense of "more." Notice that naming the want doesn't make you ungrateful for what you already have.`,
    },

    '7_HZV': {
      title: `7 in Spiritual Desire — The Chariot`,
      tagline: `A Design of the Registered Proof`,
      mastery: `Your heart wants the felt certainty that no obstacle is actually final, proof it can register rather than just intellectually accept. It wants evidence of its own unstoppability, drawn from what it's actually already survived. That desire for felt proof, not just belief, is specific and earnable. And once you let the proof register, the certainty carries you differently through the next obstacle.`,
      shadow: `You stay in constant motion that never proves the point, since proving requires stopping to notice you've arrived. Underneath the constant motion is often a fear that stopping to register the proof would mean losing the momentum that got you this far. You clear obstacle after obstacle without ever letting any single one count as evidence. The proof never accumulates because you're never actually still long enough to log it.`,
      invitation: `Ask yourself honestly what recent obstacle you cleared without ever letting it count. Let one recent obstacle count today as evidence you're already unstoppable. Stop and actually register it as proof, not just as passed. Notice that pausing to register it doesn't cost you the momentum.`,
    },

    '8_HZV': {
      title: `8 in Spiritual Desire — Justice`,
      tagline: `A Design of the Included Standard`,
      mastery: `Your heart wants integrity as a way of living, a standard it holds itself to, not just one it applies outward to others. It wants its own conduct examined with the same rigor it uses to judge everyone else's. That desire for internal consistency is specific and demanding, not simple fairness for its own sake. And when you actually apply the standard to yourself, the integrity becomes real rather than performed.`,
      shadow: `You keep a private tally of everyone else's unfairness while your own conduct goes unexamined. Underneath the unexamined blind spot is often a fear that turning the standard inward would reveal you don't actually meet it either. You notice every inconsistency in others while your own goes conveniently unaudited. The double standard costs you the integrity you believe yourself to already have.`,
      invitation: `Ask yourself honestly where you'd fail the standard you apply so readily to others. Apply today's fairness standard to yourself first. Examine your own conduct before anyone else's. Notice that this scrutiny doesn't diminish you, it just makes the integrity real.`,
    },

    '9_HZV': {
      title: `9 in Spiritual Desire — The Hermit`,
      tagline: `A Design of the Chosen Hour`,
      mastery: `Your heart wants a real inner journey, solitude deep enough to actually reach genuine understanding, not just a break from noise. It wants the kind of stillness that produces insight, not simply rest. That desire for depth is specific and searching, not withdrawal for its own sake. And when you give it real, uninterrupted time, it tends to deliver exactly the clarity it was seeking.`,
      shadow: `You stay busy specifically to avoid the solitude that would actually deliver what you're craving. Underneath the busyness is often a fear that real stillness would surface something you're not ready to sit with. You fill every open hour with activity, keeping the deeper journey permanently postponed. The postponement costs you the understanding that only genuine solitude produces.`,
      invitation: `Ask yourself honestly what you're staying busy to avoid encountering. Take one real hour of chosen solitude today. Let it be uninterrupted, not squeezed between obligations. Notice what surfaces once the busyness stops.`,
    },

    '10_HZV': {
      title: `10 in Spiritual Desire — Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `Your heart wants to accept change as it arrives and stay in the flow of it, rather than fighting every shift as a threat. It wants to trust the turn of circumstance the way it trusts anything cyclical. That desire for genuine flow is specific, not passivity in disguise. And when you actually meet change with curiosity, the shift tends to move through you faster and with less damage.`,
      shadow: `You treat every downturn as a verdict, white-knuckling each low point instead of trusting it will turn. Underneath the white-knuckling is often a fear that trusting the turn would mean giving up the only control you have left. You resist ordinary fluctuation as though it were a permanent judgment on your worth. The resistance costs you the ease that trusting the cycle would have provided at no real loss.`,
      invitation: `Ask yourself honestly whether this downturn is actually a verdict or simply a turn. Meet today's specific change with curiosity instead of resistance. Ask what it's asking of you rather than immediately fighting it. Notice that curiosity moves you through it faster than resistance does.`,
    },

    '11_HZV': {
      title: `11 in Spiritual Desire — Strength`,
      tagline: `A Design of Gentle Courage`,
      mastery: `Your heart wants to let real transformation happen through love rather than force, believing gentleness can move something force can't. It wants to meet its own fear with softness and watch that actually work. That desire for a gentler kind of strength is specific, not weakness mistaken for kindness. And when you actually try softness at the moment force would normally kick in, it tends to move the fear further than force ever did.`,
      shadow: `You grip harder at exactly the moments gentleness was actually being asked for. Underneath the gripping is often a fear that softness, tried and failed, would leave you with no strength left to fall back on. You meet fear with more force the moment it intensifies, escalating rather than softening. The escalation costs you the transformation that gentleness, actually tried, might have produced instead.`,
      invitation: `Ask yourself honestly what would happen if you met this fear with softness instead of force. Meet one current fear today with softness instead of force. Choose the gentler response even though force feels more natural. Notice that softness doesn't leave you defenseless.`,
    },

    '12_HZV': {
      title: `12 in Spiritual Desire — The Hanged Man`,
      tagline: `A Design of the New Vantage`,
      mastery: `Your heart wants to view its own life from a genuinely different angle, treating surrender as a change of perspective rather than a defeat. It wants the relief of seeing a stuck situation completely differently. That desire for a new vantage point is specific, not resignation dressed up as insight. And once you actually shift the angle, the situation itself often stops looking stuck.`,
      shadow: `You grip the old vantage point precisely because surrendering it feels like losing control entirely. Underneath the grip is often a fear that seeing the situation differently would mean admitting the original view was wrong. You keep viewing a stuck situation from the same angle, expecting a different result from the identical vantage. The grip costs you the relief and clarity a new angle would have provided.`,
      invitation: `Ask yourself honestly what angle you haven't let yourself try yet. Let one current situation today be seen from an angle you haven't tried yet. Deliberately view it from the opposite perspective. Notice that trying the new angle doesn't require abandoning the old one for good.`,
    },

    '13_HZV': {
      title: `13 in Spiritual Desire — Transformation`,
      tagline: `A Design of the Willing Ending`,
      mastery: `Your heart wants to release old identities and be genuinely reborn, treating transformation as something desired rather than something merely survived. It wants the relief of actually becoming someone new. That desire for real rebirth is specific and active, not passive drift into change. And when you actually name and release what's ready to end, the new identity arrives faster than expected.`,
      shadow: `You hold an identity long past its natural life because letting it go feels like losing yourself entirely. Underneath the holding is often a fear that without this identity, there'd be nothing solid left underneath it. You maintain a version of yourself that's already finished, out of loyalty to who you used to be. The holding costs you the rebirth your heart is actually asking for.`,
      invitation: `Ask yourself honestly which identity you're still performing out of habit rather than truth. Name one identity today that's actually ready to end. Say it's over, plainly, even just to yourself. Notice that releasing it doesn't erase who you actually are underneath it.`,
    },

    '14_HZV': {
      title: `14 in Spiritual Desire — Temperance`,
      tagline: `A Design of the Working Blend`,
      mastery: `Your heart wants integration, the different parts of you actually working together instead of taking turns dominating. It wants a genuine blend, not a truce between opposing sides. That desire for real integration is specific, not indecision dressed up as flexibility. And when you actually find the blend, it holds steadier than either extreme ever did on its own.`,
      shadow: `You oscillate hard between extremes and call the alternation "balance." Underneath the oscillation is often a fear that a true, steady blend doesn't actually exist, that only alternating between opposites is realistic. You swing from one mode to its opposite, mistaking the swing itself for equilibrium. The oscillation costs you the actual stability a real blend would provide.`,
      invitation: `Ask yourself honestly whether this is genuine balance or simply alternating extremes. Find one small blend today instead of choosing one extreme. Combine the two options rather than picking one. Notice that the blend holds steadier than either extreme did alone.`,
    },

    '15_HZV': {
      title: `15 in Spiritual Desire — The Devil`,
      tagline: `A Design of the Honest Look`,
      mastery: `Your heart wants to face its own darkness honestly rather than pretend the harder parts of itself aren't there. It wants the relief of being fully known, compulsions and all, rather than presenting a curated version. That desire for honest self-confrontation is specific, not self-punishment disguised as insight. And when you actually name what's really there, it tends to lose most of its grip.`,
      shadow: `You perform a cleaner version of yourself while the actual desire or compulsion runs quietly underneath, unaddressed. Underneath the performance is often a fear that naming the real thing honestly would make it too real to manage. You present the acceptable version to everyone, including yourself, while the actual pattern operates in the dark. The performance costs you the honest self-knowledge that would have actually loosened the compulsion's grip.`,
      invitation: `Ask yourself honestly what you've been presenting a cleaner version of. Name one real desire or compulsion honestly today, without judgment. Say it plainly, to yourself first. Notice that naming it doesn't make you worse, it just makes it visible.`,
    },

    '16_HZV': {
      title: `16 in Spiritual Desire — The Tower`,
      tagline: `A Design of the Real Fall`,
      mastery: `Your heart wants real, structural change, an actual spiritual rebirth rather than a minor adjustment around the edges. It wants the old foundation to genuinely come down, not get quietly reinforced again. That desire for total change is specific and demanding, not drama for its own sake. And when you actually let the old structure fall, what rebuilds afterward is sturdier than any patch job would have been.`,
      shadow: `You make small, cosmetic changes that leave the old pattern's foundation completely intact underneath them. Underneath the cosmetic fixes is often a fear that a real structural change would be too destabilizing to survive intentionally. You patch the surface repeatedly, avoiding the deeper collapse the real change would require. The patching costs you the actual rebirth your heart is asking for, replaced by an endless maintenance cycle.`,
      invitation: `Ask yourself honestly whether this is real change or another cosmetic patch. Let one old pattern today actually fall, rather than patching it again. Let the collapse happen instead of propping it up one more time. Notice that what rebuilds afterward is sturdier than the patched version ever was.`,
    },

    '17_HZV': {
      title: `17 in Spiritual Desire — The Star`,
      tagline: `A Design of Visible Hope`,
      mastery: `Your heart wants to shine spiritually and actually live in a way that visibly inspires the people around it. It wants its hope to be seen, not just privately held as a comfort. That desire for visible inspiration is specific, not showing off dressed as spirituality. And when you actually let the hope show, it tends to genuinely move the people who see it.`,
      shadow: `You hope quietly and privately, as if letting hope be seen would be presumptuous or attention-seeking. Underneath the privacy is often a fear that visible hope would look naive or invite disappointment in front of witnesses. You keep the real hope hidden, offering a more guarded version to the world. The hiding costs you the inspiring effect your visible hope would actually have had.`,
      invitation: `Ask yourself honestly what hope you've been keeping strictly private. Let one piece of your hope be visible today. Say it out loud or show it in how you act. Notice that visible hope doesn't require it to be guaranteed.`,
    },

    '18_HZV': {
      title: `18 in Spiritual Desire — The Moon`,
      tagline: `A Design of the Followed Feeling`,
      mastery: `Your heart wants to actually understand its own spiritual mysteries, tracing a feeling all the way to its real source rather than leaving it vague. It wants genuine comprehension, not just an accumulation of unexamined sensations. That desire for depth is specific and courageous, not idle curiosity. And when you actually follow a feeling to its source, the mystery tends to resolve into something workable.`,
      shadow: `You stay at the surface of a feeling because going deeper feels like it might reveal too much. Underneath the surface-staying is often a fear that the actual source, once found, would be harder to face than the vague version currently is. You notice the recurring feeling and stop just short of asking what it's actually about. The habit of stopping short costs you the understanding your heart is actually asking for.`,
      invitation: `Ask yourself honestly what feeling keeps recurring that you've never traced to its source. Follow one recurring feeling today all the way to its actual source. Keep asking "and what's underneath that" until you reach something concrete. Notice that the source is usually less frightening than the vague version was.`,
    },

    '19_HZV': {
      title: `19 in Spiritual Desire — The Sun`,
      tagline: `A Design of Unmanaged Joy`,
      mastery: `Your heart wants joy that's whole, expressed completely and without editing it down for anyone watching. It wants delight to actually show, not just register privately as a pleasant feeling. That desire for full, unmanaged expression is specific, not excess or immaturity. And when you actually let the joy show unedited, it tends to spread rather than embarrass you.`,
      shadow: `You perform lightness while the real joy stays muted, as if full expression would be too much for the room to hold. Underneath the muting is often a fear that unmanaged joy would look excessive or unserious. You offer a tempered version of delight, editing it down before anyone sees the full thing. The editing costs you the actual aliveness your heart is asking to express.`,
      invitation: `Ask yourself honestly what joy you've been quietly editing down. Let one piece of real joy show today, unmanaged. Let it be as big as it actually is. Notice that the room can hold more of it than you assumed.`,
    },

    '20_HZV': {
      title: `20 in Spiritual Desire — Judgement`,
      tagline: `A Design of Full Release`,
      mastery: `Your heart wants to release the burdens of the past completely, not just enough to function while quietly still carrying them. It wants an actual, total accounting, not a partial resolution mistaken for closure. That desire for complete release is specific and honest, not perfectionism about healing. And when you actually name what's still being carried, the release that follows tends to be real, not just declared.`,
      shadow: `You carry the same old weight while telling yourself you've already mostly dealt with it. Underneath the telling is often a fear that a full accounting would reveal how much is actually still unresolved. You declare the past handled prematurely, so the ongoing weight goes unacknowledged and unaddressed. The premature declaration costs you the genuine lightness a complete release would actually provide.`,
      invitation: `Ask yourself honestly what piece of the past you've declared resolved but still feel the weight of. Name one piece of the past today that's actually still being carried. Say it plainly, without minimizing it. Notice the difference between this honest naming and the premature "I'm over it."`,
    },

    '21_HZV': {
      title: `21 in Spiritual Desire — The World`,
      tagline: `A Design of the Felt Landing`,
      mastery: `Your heart wants the actual feeling of completion, not just another achievement logged and moved past. It wants a genuine sense of arrival, felt in the body, not only confirmed on paper. That desire for real landing is specific and legitimate, not an inability to be satisfied. And when you actually let an accomplishment be felt as complete, the satisfaction it produces lasts longer than the achievement itself.`,
      shadow: `You reach real milestones and still feel like something essential hasn't quite landed. Underneath the non-landing is often a fear that fully feeling completion would mean there's nothing left to strive toward. You move immediately to the next goal before the current one has actually registered as finished. The immediate pivot costs you the felt satisfaction each milestone was supposed to provide.`,
      invitation: `Ask yourself honestly which recent accomplishment you never actually let yourself feel as complete. Let one genuine accomplishment today actually be felt as complete. Pause before moving to the next goal, and let it land. Notice that stopping to feel it doesn't stall your momentum.`,
    },

    '22_HZV': {
      title: `22 in Spiritual Desire — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `Your heart wants to be completely free, to leap without a net and stay genuinely open to new experience. It wants openness itself, not just the occasional calculated risk. That desire for real freedom is specific and alive, not recklessness mistaken for spirit. And when you actually take the leap with open eyes, it tends to deliver exactly the aliveness your heart was asking for.`,
      shadow: `You call caution wisdom, closing off the very openness your heart was actually asking to keep alive. Underneath the relabeling is often a fear that real freedom would mean losing the safety caution has provided. You justify each closed door as prudent, while the openness your heart wants quietly narrows. The narrowing costs you the aliveness that only genuine openness produces.`,
      invitation: `Ask yourself honestly what caution has actually been closing off, dressed up as wisdom. Take one small, real leap today, with open eyes. Choose it deliberately, seeing the risk clearly rather than ignoring it. Notice that the leap doesn't require abandoning good judgment, just loosening its grip.`,
    },


    // ── Heart Zone: Material Desire, horizontal line (HZH) ─────────────────

    '1_HZH': {
      title: `1 in Material Desire — The Magician`,
      tagline: `A Design of Earned Ground`,
      mastery: `Your heart wants tangible achievement, a real, self-made place in the world it can actually stand on. It wants an idea to become a solid result, not just another beginning. That desire for concrete ground is specific, not restlessness disguised as ambition. And when you actually carry one venture past its start, the solid place your heart wanted starts to materialize.`,
      shadow: `You generate idea after idea while none of them ever becomes the actual solid place you were building toward. Underneath the constant generating is often a fear that finishing one venture would mean facing whether it was actually good enough. You start fresh instead of following through, so the ground never gets to solidify under you. The pattern costs you the tangible achievement your heart is actually asking for.`,
      invitation: `Ask yourself honestly which idea you keep starting over instead of carrying forward. Carry one material venture today past its beginning, toward something you can actually stand on. Push it to the next real stage instead of starting something new. Notice that following through doesn't require the idea to be perfect.`,
    },

    '2_HZH': {
      title: `2 in Material Desire — The High Priestess`,
      tagline: `A Design of the Landed Impression`,
      mastery: `Your heart wants to leave a real, unmistakable impression, quiet influence that actually lands rather than staying invisible. It wants what you know to genuinely reach someone, not remain privately held. That desire for real, if understated, influence is specific, not a need for loud recognition. And when you actually share what you know, the impression lands exactly as intended.`,
      shadow: `You stay so guarded that the impression never actually lands, no matter how much genuine insight you're holding. Underneath the guardedness is often a fear that sharing what you know would make you vulnerable in a way silence protects you from. You withhold the exact insight that would create the influence you actually want. The withholding costs you the connection and impact your heart is quietly asking for.`,
      invitation: `Ask yourself honestly what you're holding back that would actually land if shared. Share one piece of what you know today with someone who's actually earned it. Offer it directly, not hinted at. Notice that sharing it doesn't cost you the quiet quality of your influence.`,
    },

    '3_HZH': {
      title: `3 in Material Desire — The Empress`,
      tagline: `A Design of Domestic Richness`,
      mastery: `Your heart wants a genuinely abundant home, comfort and real beauty, not simply a functional space that gets the job done. It wants surroundings that actually feel rich, not merely adequate. That desire for real domestic abundance is specific and legitimate, not extravagance for its own sake. And when you actually add real beauty to your space, the home starts to feel as abundant as your heart wants it to be.`,
      shadow: `You run an efficient home that has nothing lovely in it, function standing in for the abundance you actually wanted. Underneath the substitution is often a fear that prioritizing beauty over efficiency would look wasteful or unearned. You keep the home functional and spare, deferring the richness indefinitely. The deferral costs you the daily abundance your heart is actually asking for.`,
      invitation: `Ask yourself honestly what your home is missing that pure function can't provide. Add one real piece of beauty to your home or daily life today. Choose something genuinely lovely, not just useful. Notice that the addition doesn't undo the home's efficiency.`,
    },

    '4_HZH': {
      title: `4 in Material Desire — The Emperor`,
      tagline: `A Design of Real Ground`,
      mastery: `Your heart wants durable, respected standing, genuine financial security that's actually earned rather than merely displayed. It wants the real thing underneath, not just the outward signal of it. That desire for genuine ground is specific, not vanity about appearing successful. And when you actually build the real security, the respected standing follows without needing to be performed.`,
      shadow: `You chase the appearance of authority while the actual security underneath stays thin. Underneath the chase is often a fear that the real, slower work of building security wouldn't produce visible results fast enough. You invest in signals of standing that don't correspond to anything solid underneath them. The chase costs you the durable ground your heart actually wants, traded for its appearance.`,
      invitation: `Ask yourself honestly whether this is building real ground or just its appearance. Build one piece of real financial ground today, not just its appearance. Choose the substantive action over the visible one. Notice that the real version, even unseen, satisfies something the appearance never could.`,
    },

    '5_HZH': {
      title: `5 in Material Desire — The Hierophant`,
      tagline: `A Design of Lived Credibility`,
      mastery: `Your heart wants real, earned standing rooted in something larger than yourself, credibility that actually functions, not just displays well. It wants the credential to do real work, not sit unused as decoration. That desire for lived credibility is specific, not status-seeking for its own sake. And when you actually use what you've earned, the respect that follows is genuine rather than assumed.`,
      shadow: `You collect credentials that look respectable without ever building the actual respect they were meant to represent. Underneath the collecting is often a fear that putting the credential to real use would expose whether it's actually deserved. You accumulate qualifications while leaving them functionally unused. The accumulation costs you the lived credibility your heart is actually asking for.`,
      invitation: `Ask yourself honestly which credential you're holding but not actually using. Use one credential you already have today to actually do something respected. Put it to real, visible use, not just keep it listed. Notice that using it doesn't require you to feel fully ready first.`,
    },

    '6_HZH': {
      title: `6 in Material Desire — The Lovers`,
      tagline: `A Design of Built Depth`,
      mastery: `Your heart wants love that's felt, not just described, a real, deep bond actually lived rather than narrated. It wants the substance of connection, not its outward performance. That desire for genuinely felt depth is specific, not romantic idealism. And when you actually deepen a real bond, the felt connection your heart wants is what results, not just its appearance.`,
      shadow: `You keep a relationship that looks passionate from the outside while the actual bond underneath stays thin. Underneath the thinness is often a fear that pursuing real depth would risk the relationship that currently, at least, looks good. You maintain the appearance of connection while avoiding the vulnerability actual depth would require. The maintained appearance costs you the felt bond your heart is actually asking for.`,
      invitation: `Ask yourself honestly whether this connection is felt or simply performed for how it looks. Deepen one real bond today rather than performing its appearance. Say or do something that actually risks vulnerability. Notice that real depth doesn't require the relationship to look different from the outside.`,
    },

    '7_HZH': {
      title: `7 in Material Desire — The Chariot`,
      tagline: `A Design of the Named Victory`,
      mastery: `Your heart wants real, earned achievement, a specific victory reached through motion rather than motion for its own sake. It wants a defined target, not just perpetual forward momentum. That desire for a concrete, claimed win is specific, not restless drive without direction. And when you actually name the victory you're driving toward, the motion starts producing exactly that result.`,
      shadow: `You generate motion without any actual victories, momentum mistaken for the achievement it was supposed to produce. Underneath the substitution is often a fear that naming a specific victory and missing it would be worse than staying in undefined motion. You keep moving without ever declaring what you're actually trying to win. The undefined motion costs you the earned achievement your heart is actually asking for.`,
      invitation: `Ask yourself honestly what specific victory all this motion is actually in service of. Name one concrete victory today you're actually driving toward. Make it specific enough to know when you've reached it. Notice that naming it doesn't slow the momentum, it focuses it.`,
    },

    '8_HZH': {
      title: `8 in Material Desire — Justice`,
      tagline: `A Design of Enacted Fairness`,
      mastery: `Your heart wants real fairness enacted, actively used to correct something, not just believed in as a private value. It wants your position, whatever it is, to actually do something with that belief. That desire for enacted justice is specific and active, not moral conviction held quietly on the sidelines. And when you actually use your standing, the fairness your heart wants becomes real instead of theoretical.`,
      shadow: `You hold strong opinions about fairness while never actually using your position to change anything. Underneath the passivity is often a fear that acting on the conviction would cost you standing or comfort you're not willing to risk. You voice the belief while leaving the actual unfairness fully intact and unaddressed. The gap between belief and action costs you the enacted fairness your heart is actually asking for.`,
      invitation: `Ask yourself honestly what unfairness you have the standing to actually correct, right now. Use whatever standing you have today to correct one real unfairness. Take the concrete action, not just voice the opinion. Notice that acting on it doesn't require having maximum power first.`,
    },

    '9_HZH': {
      title: `9 in Material Desire — The Hermit`,
      tagline: `A Design of Sized Retreat`,
      mastery: `Your heart wants real retreat into its own inner world, individual discovery actually pursued rather than perpetually postponed. It wants dedicated time, sized realistically, not an idealized retreat that never fits into an actual schedule. That desire for genuine solitary discovery is specific and practical, not escapism. And when you actually take the sized retreat, it delivers real insight in proportion to the time given.`,
      shadow: `You stay constantly busy in the noise of your own responsibilities, retreat postponed as impractical indefinitely. Underneath the postponement is often a fear that even a realistically sized retreat would reveal how much you actually need more of it. You wait for an ideal, larger block of time that never actually materializes. The waiting costs you the discovery a modest, actually-taken retreat would have already provided.`,
      invitation: `Ask yourself honestly what size of retreat is actually achievable this month, not the ideal one. Take one real day of retreat this month, sized to what's actually possible. Schedule it concretely, not as a someday intention. Notice that a realistically sized retreat still delivers real discovery.`,
    },

    '10_HZH': {
      title: `10 in Material Desire — Wheel of Fortune`,
      tagline: `A Design of the Full Reception`,
      mastery: `Your heart wants to actually make the most of life's opportunities as they arrive, receiving good fortune fully rather than half-guarding against its loss. It wants to trust the good moment enough to actually use it. That desire for full reception is specific, not naive optimism about how long it will last. And when you actually receive an opportunity fully, you get more out of it than a half-guarded version ever would.`,
      shadow: `Good opportunities arrive and go unused because you're too busy bracing for the next downturn to actually take them. Underneath the bracing is often a fear that trusting the good fortune would make its eventual loss even more painful. You hold opportunities at arm's length, unwilling to fully invest in something you expect to end. The bracing costs you the actual use of opportunities your heart genuinely wants to receive.`,
      invitation: `Ask yourself honestly what current good fortune you're only half-receiving. Receive one current piece of good fortune today fully, without bracing for its opposite. Use it completely, as though it were simply yours. Notice that receiving it fully doesn't summon its ending any faster.`,
    },

    '11_HZH': {
      title: `11 in Material Desire — Strength`,
      tagline: `A Design of Real Vitality`,
      mastery: `Your heart wants embodied, magnetic resilience, real physical vitality that's actually tended, not just displayed. It wants the body itself to be strong, not merely to look capable. That desire for genuine embodied vitality is specific, not vanity about appearance. And when you actually tend the body directly, the resilience your heart wants becomes real rather than performed.`,
      shadow: `You perform strength outwardly while your actual physical vitality goes quietly neglected underneath the display. Underneath the performance is often a fear that admitting real physical need would undercut the image of resilience you've built. You project capability while skipping the actual rest, movement, or care the body needs. The neglect costs you the embodied vitality your heart is actually asking for.`,
      invitation: `Ask yourself honestly what your body actually needs that you've been skipping in favor of the performance. Do one real act of physical care today, actual tending rather than performance. Choose the concrete, private act, not the visible one. Notice that real tending doesn't undercut how capable you already look.`,
    },

    '12_HZH': {
      title: `12 in Material Desire — The Hanged Man`,
      tagline: `A Design of the Finished Pause`,
      mastery: `Your heart wants a genuine pause allowed to do its full transformative work, not cut short before it's finished. It wants the waiting itself to actually produce something, not just be endured. That desire for a completed pause is specific, not indecision disguised as reflection. And when you actually let a pause run its full length, the transformation it was meant to deliver arrives intact.`,
      shadow: `You rush through the pause to get back to normal, skipping the transformation it was there to produce. Underneath the rush is often a fear that a fully completed pause would reveal changes you're not ready to face. You cut the waiting short the moment it becomes uncomfortable, before the actual shift has happened. The rushed pause costs you the transformation your heart is actually asking to complete.`,
      invitation: `Ask yourself honestly which current pause you've been trying to rush past. Let one current pause today last exactly as long as it needs to. Resist the urge to force it toward resolution early. Notice what actually shifts once you stop rushing it.`,
    },

    '13_HZH': {
      title: `13 in Material Desire — Transformation`,
      tagline: `A Design of the Real Demolition`,
      mastery: `Your heart wants a completely renewed lifestyle, the old structure genuinely torn down rather than cosmetically updated. It wants demolition, not decoration, when demolition is what's actually called for. That desire for real, structural renewal is specific and demanding, not restlessness for its own sake. And when you actually tear down the real old structure, what replaces it fits your life far better than a renovation ever could.`,
      shadow: `You renovate the surface of your material life while the actual old structure stays fully intact underneath it. Underneath the surface renovation is often a fear that real demolition would be too destabilizing to survive intentionally. You update the appearance while the foundational pattern goes untouched. The surface renovation costs you the genuine renewal your heart is actually asking for.`,
      invitation: `Ask yourself honestly what old structure you've been renovating instead of actually tearing down. Tear down one real piece of an old structure today, not just its surface. Remove it entirely rather than redecorating around it. Notice that the demolition creates room for something that actually fits.`,
    },

    '14_HZH': {
      title: `14 in Material Desire — Temperance`,
      tagline: `A Design of the Serving Act`,
      mastery: `Your heart wants real, felt integration across body, mind, and spirit, a single act that serves all three at once rather than managing each in isolation. It wants wholeness, actually experienced, not just competent management of separate domains. That desire for genuine integration is specific, not a vague wish for "balance." And when you actually find the combined act, the felt integration your heart wants finally arrives.`,
      shadow: `You manage each area separately and reasonably well, but the actual felt integration never quite arrives. Underneath the separate management is often a fear that combining the domains would mean doing all of them less well individually. You keep body, mind, and spirit in their own lanes, competently tended but never actually unified. The separation costs you the felt wholeness your heart is actually asking for.`,
      invitation: `Ask yourself honestly what single act could genuinely serve all three at once. Find one act today that serves body, mind, and spirit together instead of separately. Choose the combined version over the three separate ones. Notice that the integrated act doesn't shortchange any of the three.`,
    },

    '15_HZH': {
      title: `15 in Material Desire — The Devil`,
      tagline: `A Design of the Honest Want`,
      mastery: `Your heart wants real passion, pleasure, and wealth, held honestly and openly rather than apologetically or in secret. It wants the desire named plainly, not hedged with guilt. That desire for honest wanting is specific and legitimate, not shame requiring correction. And when you actually name the desire consciously, you get to pursue it deliberately instead of it running you unconsciously.`,
      shadow: `You either deny the desire outright or chase it so unconsciously it curdles into compulsion. Underneath both extremes is often a fear that openly wanting pleasure or wealth would make you look ruled by appetite. You either perform disinterest or chase the desire in ways that feel out of your own control. Both extremes cost you the honest, consciously chosen relationship to desire your heart is actually asking for.`,
      invitation: `Ask yourself honestly what you actually want that you've been denying or chasing unconsciously. Name your actual desire for power or pleasure honestly today, and choose consciously how to pursue it. Say the real want out loud, without softening it. Notice that naming it honestly gives you more control over it, not less.`,
    },

    '16_HZH': {
      title: `16 in Material Desire — The Tower`,
      tagline: `A Design of the Let-Go Structure`,
      mastery: `Your heart craves a genuinely new beginning, old structures actually destroyed rather than incrementally adjusted around the edges. It wants the failing thing to finish falling, clearing space for what comes next. That desire for real collapse-then-rebuild is specific and demanding, not drama for its own sake. And when you actually let a failing structure finish falling, the new beginning your heart wants gets to genuinely start.`,
      shadow: `You brace against necessary collapse so hard that the new beginning never actually gets to arrive. Underneath the bracing is often a fear that letting the structure finish falling would mean losing more than the structure itself. You prop up something already failing, delaying an ending that's actually inevitable. The propping costs you the new beginning your heart is actually asking for.`,
      invitation: `Ask yourself honestly what structure you've been propping up that's actually already failing. Let one already-failing structure today actually finish falling, instead of propping it up. Stop the propping and let the collapse complete itself. Notice that the new beginning can't start until the old structure is actually gone.`,
    },

    '17_HZH': {
      title: `17 in Material Desire — The Star`,
      tagline: `A Design of Shared Creativity`,
      mastery: `Your heart wants to actually be an inspiring presence, sharing creative work rather than keeping it privately made and privately admired. It wants what you create to genuinely reach and move someone else. That desire for shared, visible creativity is specific, not a need for validation. And when you actually share the work, the inspiring effect your heart wants becomes real instead of hypothetical.`,
      shadow: `You make beautiful things privately while the inspiring, shared version never actually gets offered to anyone. Underneath the privacy is often a fear that sharing the work would expose it to judgment the private version never had to face. You create consistently while keeping the actual output unseen. The privacy costs you the inspiring impact your heart is actually asking to have.`,
      invitation: `Ask yourself honestly what creative work you've been keeping entirely private. Share one piece of your creative work today with someone. Offer it directly, not hedged or downplayed. Notice that sharing it doesn't diminish how meaningful it was to make.`,
    },

    '18_HZH': {
      title: `18 in Material Desire — The Moon`,
      tagline: `A Design of Lived Enchantment`,
      mastery: `Your heart wants enchantment actually lived, a life genuinely touched and shaped by mystery, not just admired from outside it. It wants a dream or hunch to actually influence something real. That desire for lived enchantment is specific, not escapism dressed as spirituality. And when you actually let a hunch shape a decision, the enchantment your heart wants becomes part of your actual life, not just its aesthetic.`,
      shadow: `You admire mystery and art from a safe, tidy distance without ever letting them shape anything real. Underneath the distance is often a fear that actually letting mystery influence your decisions would look irrational or unreliable. You appreciate the aesthetic of enchantment while keeping your actual choices strictly rational. The distance costs you the lived enchantment your heart is actually asking for.`,
      invitation: `Ask yourself honestly what real dream or hunch you've been admiring but not acting on. Let one real dream or hunch today actually influence a decision. Let it genuinely shape the choice, not just decorate it afterward. Notice that following it doesn't require abandoning good judgment.`,
    },

    '19_HZH': {
      title: `19 in Material Desire — The Sun`,
      tagline: `A Design of Undivided Wholeness`,
      mastery: `Your heart wants happiness, success, health, and love all at once, refusing to accept that one has to be traded for another. It wants genuine wholeness across every domain, not excellence in one purchased at another's expense. That desire for undivided wholeness is specific and demanding, not naive greed. And when you actually attend to the neglected domain, the wholeness your heart wants starts to become achievable.`,
      shadow: `You succeed in one domain while quietly sacrificing another, treating the trade as inevitable rather than examining it. Underneath the resignation is often a fear that refusing the trade would mean losing the success you've already built in the dominant domain. You accept the sacrifice as simply how life works, without testing whether it's actually necessary. The accepted trade costs you the wholeness your heart is actually asking for.`,
      invitation: `Ask yourself honestly which domain you've been quietly sacrificing for success in another. Give real attention today to the one domain you'd been quietly sacrificing. Invest in it directly, without treating it as secondary. Notice that attending to it doesn't require abandoning what you've already built elsewhere.`,
    },

    '20_HZH': {
      title: `20 in Material Desire — Judgement`,
      tagline: `A Design of Total Renewal`,
      mastery: `Your heart yearns for a completely fresh start, an actually new material chapter rather than a lightened version of the old one. It wants total renewal, not incremental improvement relabeled as reinvention. That desire for a genuinely fresh start is specific and demanding, not restlessness for novelty's sake. And when you actually name what a real fresh start requires, the renewal your heart wants becomes achievable rather than theoretical.`,
      shadow: `You make moderate improvements while calling them a fresh start, when they're actually just adjustments to the existing life. Underneath the relabeling is often a fear that a truly fresh start would cost more than you're currently willing to risk. You settle for the lightened version, satisfying the desire's language without its substance. The relabeling costs you the total renewal your heart is actually asking for.`,
      invitation: `Ask yourself honestly what you've been calling a fresh start that's actually just an improvement. Name what a truly fresh material start would require today, and take one real step toward it. Be specific about what "fresh" actually means here. Notice the difference between this and the moderate version you'd normally settle for.`,
    },

    '21_HZH': {
      title: `21 in Material Desire — The World`,
      tagline: `A Design of Lived Breadth`,
      mastery: `Your heart wants to actually travel and live a genuinely successful, fulfilling life, lived rather than merely imagined or planned indefinitely. It wants the bigger life realized in real time, not perpetually deferred. That desire for actual lived breadth is specific and achievable, not fantasy detached from action. And when you actually book or start one real piece of it, the bigger life your heart wants begins to become concrete.`,
      shadow: `You plan a bigger life indefinitely while the actual, lived version keeps getting pushed to some more convenient year. Underneath the pushing is often a fear that starting now would mean facing whether the bigger life is actually achievable, rather than staying a comfortable future plan. You refine the plan repeatedly without ever converting any of it into action. The endless planning costs you the lived breadth your heart is actually asking for.`,
      invitation: `Ask yourself honestly what piece of the bigger life you could actually start now, not someday. Book, plan, or start one real piece of the bigger life today. Take the concrete action, not another round of planning. Notice that starting small doesn't require the whole vision to be finalized first.`,
    },

    '22_HZH': {
      title: `22 in Material Desire — The Fool`,
      tagline: `A Design of the Overdue Adventure`,
      mastery: `Your heart seeks genuine freedom, lived, new places and people actually explored rather than merely imagined from inside a routine. It wants real, unplanned experience, not just the idea of adventure held for later. That desire for lived freedom is specific and overdue, not restlessness for its own sake. And when you actually take the small, unplanned adventure, the freedom your heart wants becomes something real rather than deferred.`,
      shadow: `You stay inside a rigid system out of practicality, telling yourself the adventurous life is simply for later. Underneath the deferral is often a fear that stepping outside the system now would cost you the stability it currently provides. You postpone every real adventure until some more convenient, fully-prepared future moment. The postponement costs you the lived freedom your heart is actually asking for, right now.`,
      invitation: `Ask yourself honestly what small adventure you've been telling yourself is for later. Take one real, unplanned adventure today, however small. Do it without the usual preparation or permission. Notice that the small version still delivers the freedom you've been postponing.`,
    },


    // ── Chakra Map: Muladhara, Root Chakra (MUL) ────────────────────────────

    '1_MUL': {
      title: `1 in Root Chakra — The Magician`,
      tagline: `A Design of Settled Ground`,
      mastery: `Your sense of safety comes from real capability, knowing you can generate what you need essentially out of nothing. You trust your own ability to originate a solution rather than depending on conditions being right first. That self-generated security is genuine and earned, proven across real situations where you had to start from scratch. And you can let that already-proven capability actually hold you, rather than needing constant fresh proof of it.`,
      shadow: `You stay in perpetual-start mode, never letting the ground actually settle, because stillness itself starts to feel unsafe. Underneath the perpetual starting is often a fear that stopping to rest on what you've built would reveal the ground was never solid. You launch a new venture the moment things get stable, as though stability were itself the threat. The pattern costs you the settled ground your own capability has already earned you.`,
      invitation: `Ask yourself honestly what you'd have to trust if you stopped starting something new right now. Let yourself be held today by what you've already built, without starting something new to prove it. Rest in the existing ground instead of generating another one. Notice that the ground holds even without a fresh project underneath it.`,
    },

    '2_MUL': {
      title: `2 in Root Chakra — The High Priestess`,
      tagline: `A Design of Visible Certainty`,
      mastery: `Your sense of safety comes from a trusted inner knowing that doesn't need outside verification to feel real. You can stand on a private certainty without requiring anyone else to confirm it first. That self-trust is a genuine, deep form of security, rare enough to be a real strength. And your certainty can be made visible without it losing any of its quiet solidity.`,
      shadow: `That security stays entirely private, so hidden that it can be mistaken by others, and sometimes even by you, for actual absence. Underneath the hiding is often a fear that voicing the certainty would expose it to challenge it was never built to survive out loud. You hold real, grounded knowing while presenting an outwardly uncertain or neutral face. The hiding costs you the recognition and connection your actual certainty would otherwise create.`,
      invitation: `Ask yourself honestly what quiet certainty you've never actually said out loud to anyone. Let your quiet certainty be visible today, to at least one person. Say it plainly, not hedged into a question. Notice that visibility doesn't make the certainty any less solid.`,
    },

    '3_MUL': {
      title: `3 in Root Chakra — The Empress`,
      tagline: `A Design of Included Needs`,
      mastery: `Your sense of safety comes from genuine, felt provision, resources and warmth and a home that actually holds you. You create real abundance, and that capacity to provide is a genuine strength, not a performance. That provision is tangible and consistent, not just a wish for comfort. And you can include your own basic needs inside that same abundance, rather than only extending it outward.`,
      shadow: `You measure your safety only by how much you're providing for others, while your own basic needs quietly go unattended. Underneath the imbalance is often a fear that attending to your own needs would compete with the provider identity your safety depends on. You create real abundance for everyone around you and let your own version of it stay thin. The imbalance costs you a security that includes you, not just the people you provide for.`,
      invitation: `Ask yourself honestly what basic need of your own has gone unattended while you tended everyone else's. Include one of your own basic needs today in the abundance you create for others. Provide for yourself with the same generosity you extend outward. Notice that including yourself doesn't diminish what you give others.`,
    },

    '4_MUL': {
      title: `4 in Root Chakra — The Emperor`,
      tagline: `A Design of Trusted Structure`,
      mastery: `Your sense of safety comes from order, systems and routines sturdy enough that you don't have to monitor them constantly to trust them. You build real structure, and when it's genuinely sturdy, it actually holds without your continuous attention. That capacity to build lasting order is a real strength, distinct from mere control. And you can trust a structure to hold itself, once you actually let it, rather than maintaining constant oversight.`,
      shadow: `Maintaining the structure becomes a full-time job, exhausting to uphold in a way that defeats the very safety it was meant to provide. Underneath the exhausting maintenance is often a fear that any structure left unattended would collapse the moment you looked away. You keep monitoring systems that are actually sturdy enough to run without you. The constant monitoring costs you the ease a truly trusted structure would provide.`,
      invitation: `Ask yourself honestly which structure you're monitoring that's actually sturdy enough not to need it. Build or trust one piece of structure today durable enough to hold itself, without your constant oversight. Step back from it deliberately and let it run. Notice that it holds even without your continuous attention.`,
    },

    '5_MUL': {
      title: `5 in Root Chakra — The Hierophant`,
      tagline: `A Design of Separated Belief`,
      mastery: `Your sense of safety comes from belonging, tradition, community, a shared framework larger than any single day. You draw real, sustaining ground from being part of something bigger than yourself. That capacity for belonging is a genuine strength, and it holds you through periods no individual effort could sustain alone. And your security can survive questioning any one specific belief, once you separate the ground from the particular tenet.`,
      shadow: `That belonging becomes the whole foundation, so questioning any part of the tradition feels like losing the ground entirely. Underneath the fusion is often a fear that examining even one belief would unravel the whole framework your safety depends on. You treat every piece of the shared framework as equally load-bearing, unable to question one part without the whole thing feeling threatened. The fusion costs you the freedom to actually examine and refine what you believe.`,
      invitation: `Ask yourself honestly which single belief you've never let yourself question because the ground felt too fused to it. Separate your security today from one single belief, so the ground survives it being questioned. Examine that one piece deliberately, apart from the whole. Notice that the larger belonging holds even when one part is questioned.`,
    },

    '6_MUL': {
      title: `6 in Root Chakra — The Lovers`,
      tagline: `A Design of Recognized Belonging`,
      mastery: `Your sense of safety comes from felt, mutual connection, knowing you're actually wanted rather than merely tolerated. You can sense real mutuality when it's present, and that accuracy protects you from settling for less. That discernment about genuine connection is a real strength, not neediness. And you can let already-existing, genuine connection actually be enough ground, without needing to keep chasing more proof of it.`,
      shadow: `You chase the feeling of being chosen so hard that you accept relationships that don't actually offer real mutuality. Underneath the chasing is often a fear that stopping the pursuit would mean admitting how uncertain the connection actually is. You settle for relationships that merely tolerate you, mistaking the pursuit itself for evidence of belonging. The chasing costs you the genuine, already-present connections you're not fully resting into.`,
      invitation: `Ask yourself honestly where you're already genuinely chosen but haven't let yourself fully rest in it. Notice today where you're already genuinely chosen, and let that be enough ground. Stop chasing further proof and settle into what's already real. Notice that resting there doesn't mean you've stopped being discerning.`,
    },

    '7_MUL': {
      title: `7 in Root Chakra — The Chariot`,
      tagline: `A Design of Trusted Stillness`,
      mastery: `Your sense of safety comes from momentum, purposeful direction that makes the ground itself feel solid underfoot. You feel most secure moving toward something, and that drive genuinely produces real progress. That capacity for direction is a real strength, not restlessness. And you can let the ground hold you through an actual pause, once you notice stillness isn't the same as collapse.`,
      shadow: `Stillness starts to feel like danger, every pause reading as evidence the ground itself is giving way underneath you. Underneath the fear of stillness is often a belief that momentum is the only thing actually holding you up. You keep moving specifically to avoid finding out whether the ground would hold without it. The constant motion costs you the rest your body and your actual security both need.`,
      invitation: `Ask yourself honestly what you're afraid would happen if you actually stopped moving for a while. Rest today for one real stretch, and notice the ground is still there. Let the pause run its full length without cutting it short. Notice that stillness doesn't collapse the ground the way you feared.`,
    },

    '8_MUL': {
      title: `8 in Root Chakra — Justice`,
      tagline: `A Design of Rooted Integrity`,
      mastery: `Your sense of safety comes from balance, a world where what's owed genuinely gets paid and accounts actually settle. You have a real, sharp instinct for fairness, and that instinct is a genuine strength when it's not asked to guarantee the world's cooperation. That capacity to sense imbalance is valuable on its own terms. And your security can be rooted in your own integrity, which you actually control, rather than the world's fairness, which you don't.`,
      shadow: `Any unfairness, even a small one, can feel like the whole ground shifting underneath you, disproportionate to what actually happened. Underneath the disproportion is often a fear that if the world isn't reliably fair, nothing underneath you is actually solid. You let an isolated instance of unfairness destabilize a sense of safety that shouldn't depend on the world's cooperation at all. The dependence costs you a steadiness that your own integrity, independent of outcomes, could actually provide.`,
      invitation: `Ask yourself honestly whether your ground depends on the world being fair or on your own conduct being sound. Root your security today in your own integrity, rather than the world's cooperation. Let your own conduct be the measure, not the outcome. Notice that this ground holds even when the world doesn't cooperate.`,
    },

    '9_MUL': {
      title: `9 in Root Chakra — The Hermit`,
      tagline: `A Design of the Held Return`,
      mastery: `Your sense of safety comes from chosen retreat, real time alone that lets you actually settle into yourself. You know precisely how much solitude you need, and taking it genuinely restores your ground. That capacity for chosen retreat is a real strength, distinct from avoidance. And you can return from solitude and stay just as grounded in company, once you trust that connection won't undo what the retreat built.`,
      shadow: `The retreat becomes permanent, a security purchased at the price of connection you still genuinely need. Underneath the permanence is often a fear that returning to company would cost you the settled ground the solitude worked hard to build. You extend the retreat well past the point it was actually restoring you, using it instead to avoid relationship. The permanence costs you a connection your ground doesn't actually require you to sacrifice.`,
      invitation: `Ask yourself honestly whether this retreat is still restoring you or has become an avoidance of connection. Return today from solitude and stay grounded in company, letting relationship not threaten it. Rejoin deliberately, testing that the ground holds. Notice that connection doesn't undo what the solitude built.`,
    },

    '10_MUL': {
      title: `10 in Root Chakra — Wheel of Fortune`,
      tagline: `A Design of Mid-Cycle Trust`,
      mastery: `Your sense of safety comes from accepting that things genuinely cycle, trusting that a low point will actually turn in time. You hold that trust even during an actual downturn, not just as an abstract belief. That acceptance of natural cycles is a real strength, letting you weather a low without panic. And you can meet today's specific low point with the trust you already hold in theory, applied to the present moment.`,
      shadow: `Every downturn still feels like proof the ground has genuinely given way, even when you rationally know it's just a phase. Underneath the feeling is often a fear that this particular low is the exception, the one that won't actually turn like the others did. You hold the belief about cycles abstractly while each real downturn still triggers the same alarm. The gap between the belief and the felt experience costs you the calm the trust is supposed to provide.`,
      invitation: `Ask yourself honestly whether this downturn is actually different or just feels that way while it's happening. Meet today's low point with the trust you already have in theory, before the turn arrives. Apply the belief now, not just after the fact. Notice that trusting the cycle doesn't require the turn to have already started.`,
    },

    '11_MUL': {
      title: `11 in Root Chakra — Strength`,
      tagline: `A Design of Unwitnessed Resilience`,
      mastery: `Your sense of safety comes from real, quiet endurance that doesn't require an audience to actually be true. You can hold steady through difficulty privately, without needing anyone to witness it for it to count. That unwitnessed resilience is a genuine strength, deeper than a version that depends on recognition. And your endurance stays just as real whether or not anyone's watching it happen.`,
      shadow: `You turn that endurance into a performance, needing witnesses to confirm the resilience is actually real. Underneath the performance is often a fear that unwitnessed strength might not actually exist, or might not count without confirmation. You showcase your resilience specifically so it can be seen and validated, rather than simply holding it. The performance costs you the quiet, self-sufficient version of the same strength you're actually capable of.`,
      invitation: `Ask yourself honestly whether you'd trust this resilience if no one ever saw it. Let your endurance be private again today, unwitnessed, and trust it's still real. Hold steady through something without telling anyone. Notice that the strength doesn't require an audience to be genuine.`,
    },

    '12_MUL': {
      title: `12 in Root Chakra — The Hanged Man`,
      tagline: `A Design of the Released Grip`,
      mastery: `Your sense of safety comes, somewhat paradoxically, from surrender, trusting a situation enough to actually stop gripping it. You can release control at the right moment and find that the ground holds anyway. That capacity for genuine release is a real strength, distinct from giving up. And you can release your grip on one specific thing today, testing that trust directly rather than only holding it in theory.`,
      shadow: `The surrender turns into passivity, a permanent suspension mistaken for the actual release that was needed at a specific moment. Underneath the permanence is often a fear that grabbing hold again, even briefly, would undo whatever peace the surrender produced. You stay indefinitely suspended, avoiding both grip and genuine forward movement. The permanent suspension costs you the active engagement that real trust would actually allow.`,
      invitation: `Ask yourself honestly what you're gripping that surrender would actually let go of safely. Release your grip today on one specific thing, and notice the ground holds anyway. Choose one concrete thing to release, not an indefinite general letting-go. Notice that releasing it doesn't mean permanent passivity afterward.`,
    },

    '13_MUL': {
      title: `13 in Root Chakra — Transformation`,
      tagline: `A Design of the Full Timeline`,
      mastery: `Your sense of safety comes from real transformation, the genuine capacity to end things and actually be renewed by it. You trust your own ability to survive an ending and become something sturdier on the other side of it. That capacity for transformation is a real strength, proven each time you've actually gone through one. And you can let an ending complete at its own real pace, rather than needing to rush it for immediate relief.`,
      shadow: `You end things prematurely, mistaking ordinary discomfort for a signal that the chapter must be fully over right now. Underneath the premature ending is often a fear that sitting with discomfort a moment longer would mean it never actually resolves. You cut a process short the instant it becomes uncomfortable, before the transformation has actually finished its work. The premature ending costs you the completed renewal a fully-paced ending would have provided.`,
      invitation: `Ask yourself honestly whether this discomfort actually means the chapter is over or just that it's hard right now. Let one ending today complete at its actual pace, rather than rushing it for relief. Stay with it a bit longer than feels comfortable. Notice that the discomfort doesn't necessarily mean it's time to stop.`,
    },

    '14_MUL': {
      title: `14 in Root Chakra — Temperance`,
      tagline: `A Design of the Actual Blend`,
      mastery: `Your sense of safety comes from genuine integration, body, mind, and circumstance actually working together rather than in separate lanes. You feel most secure when the different parts of your life cohere into one working whole. That desire for real integration is a genuine strength, not indecision. And you can find an actually blended version of two things you'd normally alternate between, producing a steadier ground than either extreme alone.`,
      shadow: `You mistake alternating between extremes for balance itself, when it's actually just oscillation without any real integration. Underneath the mistake is often a fear that true blending doesn't actually exist, that only swinging between poles is realistic. You swing hard between two modes, calling the swing "balance" without it ever cohering into something steadier. The oscillation costs you the actual integrated ground your sense of safety is built to want.`,
      invitation: `Ask yourself honestly whether this is genuine balance or just alternating between two extremes. Find one small, actually blended version today of two things you'd been alternating between. Combine them deliberately instead of switching between them. Notice that the blend holds steadier ground than either extreme did alone.`,
    },

    '15_MUL': {
      title: `15 in Root Chakra — The Devil`,
      tagline: `A Design of the Named Compulsion`,
      mastery: `Your sense of safety comes from honest reckoning with your own compulsions and desires, facing them rather than denying they exist. You can look directly at a difficult impulse without it destabilizing you. That capacity for honest self-confrontation is a genuine strength, rare enough to be a real asset. And naming a real compulsion honestly, without judgment, tends to loosen its grip rather than tighten it.`,
      shadow: `You perform a cleaner version of yourself while an unexamined pull runs quietly underneath the presented surface. Underneath the performance is often a fear that naming the real compulsion honestly would make it too real to manage. You maintain the acceptable version publicly while the actual pattern operates unaddressed in private. The performance costs you the honest self-knowledge that would have actually loosened the compulsion's hold.`,
      invitation: `Ask yourself honestly what compulsion you've been presenting a cleaner version of yourself to hide. Name one real compulsion honestly today, without judgment. Say it plainly, to yourself first. Notice that naming it doesn't make you worse, it just makes it visible.`,
    },

    '16_MUL': {
      title: `16 in Root Chakra — The Tower`,
      tagline: `A Design of Rested Reconstruction`,
      mastery: `Your sense of safety comes from having already survived a structural collapse and rebuilt something sturdier from it. You know, from direct experience, that you can reconstruct real ground after it's fallen. That proven resilience is a genuine strength, tested rather than theoretical. And you can actually rest in what you've already rebuilt, trusting it without needing to constantly check it for cracks.`,
      shadow: `You brace permanently for the next collapse, never actually resting in the sturdy structure you've already rebuilt. Underneath the permanent bracing is often a fear that trusting the rebuild would leave you unprepared if it also eventually falls. You keep checking the current, solid structure for cracks that aren't actually there. The permanent checking costs you the rest your already-proven rebuilding capacity has earned.`,
      invitation: `Ask yourself honestly whether this structure is actually cracking or whether you're just checking out of habit. Trust today's current structure without checking it for cracks. Let it stand without the inspection. Notice that trusting it doesn't undo your ability to rebuild if it ever did fall again.`,
    },

    '17_MUL': {
      title: `17 in Root Chakra — The Star`,
      tagline: `A Design of Full-Sized Hope`,
      mastery: `Your sense of safety comes from faith in a better outcome, hope itself functioning as a genuinely stabilizing force. You can hold real belief that things will improve, and that belief actually anchors you through hard periods. That capacity for stabilizing hope is a real strength, not naivety. And your hope can be as large and visible as it actually is, without that risking the stability it currently provides.`,
      shadow: `You keep that hope so modest and private that it barely functions as real ground for you at all. Underneath the modesty is often a fear that a large, visible hope would be too exposed if it turned out disappointed. You shrink the hope down to something safely unnoticeable, and it stops actually stabilizing anything. The shrinking costs you the ground your hope, at full size, is actually capable of providing.`,
      invitation: `Ask yourself honestly what your hope would look like if you let it be its actual size. Let your hope today be as large and visible as it actually is. Say it out loud, without the usual modesty. Notice that the larger version doesn't destabilize you, it grounds you more.`,
    },

    '18_MUL': {
      title: `18 in Root Chakra — The Moon`,
      tagline: `A Design of the Verified Feeling`,
      mastery: `Your sense of safety comes from a felt sense beneath the surface, an accurate intuition about the atmosphere of a room or situation. You pick up on something real before it's confirmed by any visible evidence. That intuitive read is a genuine strength, and when tested, it tends to hold up. And checking a strong feeling against real evidence sharpens the accuracy of that intuition rather than dismissing it.`,
      shadow: `That felt sense curdles into anxious story, every strong feeling treated as though it were already confirmed, settled danger. Underneath the curdling is often a fear that questioning the feeling would mean ignoring a real warning sign. You let an intuitive read escalate into a full narrative without ever checking it against what's actually true. The escalation costs you accuracy, and often peace, that a quick check against evidence would have restored.`,
      invitation: `Ask yourself honestly whether this strong feeling has actually been checked against real evidence. Check one strong feeling today against real evidence before treating it as settled fact. Look for the concrete facts, not just the felt sense. Notice whether the feeling holds up once it's actually tested.`,
    },

    '19_MUL': {
      title: `19 in Root Chakra — The Sun`,
      tagline: `A Design of Honest Warmth`,
      mastery: `Your sense of safety comes from vitality and open warmth, a felt, embodied sense that things are fundamentally good. You carry a real, sustaining brightness that makes hard periods more survivable. That capacity for warmth is a genuine strength, not denial of what's difficult. And your harder feelings can be visible alongside the warmth, without that warmth having to disappear to make room for them.`,
      shadow: `That warmth becomes a performance for others' comfort, leaving your own harder feelings with nowhere real to land. Underneath the performance is often a fear that showing difficulty would undo the brightness people rely on you for. You maintain the warm surface consistently, while genuine distress underneath goes unspoken and unaddressed. The performance costs you a place for your own harder feelings, which the warmth was never actually meant to replace.`,
      invitation: `Ask yourself honestly what difficult feeling you've been covering with performed warmth. Let one difficult feeling be visible today alongside the warmth. Show both at once, not one instead of the other. Notice that the warmth doesn't disappear when the harder feeling is visible too.`,
    },

    '20_MUL': {
      title: `20 in Root Chakra — Judgement`,
      tagline: `A Design of the Real Step`,
      mastery: `Your sense of safety comes from clarity acted on, rising decisively to actually do what a real calling asks of you. You recognize what needs doing with unusual precision, and you're capable of moving on it directly. That capacity to act on clarity is a genuine strength, distinct from mere recognition. And you can take one real, concrete step now, rather than needing every condition to feel perfectly ready first.`,
      shadow: `The clarity arrives and gets endlessly deferred, prepared-for indefinitely instead of actually acted on. Underneath the deferring is often a fear that acting on the clarity and it not working out would cost more than staying in preparation mode. You recognize the calling accurately and collect more readiness instead of stepping toward it. The deferring costs you years of ground that acting on the clarity would have already built.`,
      invitation: `Ask yourself honestly what you're actually still preparing for that you're already capable of doing. Take one concrete action today toward the calling you've already heard clearly. Do the real step, not another round of preparation. Notice that the action doesn't require full readiness to be worth taking.`,
    },

    '21_MUL': {
      title: `21 in Root Chakra — The World`,
      tagline: `A Design of the Named Completion`,
      mastery: `Your sense of safety comes from completion, real, acknowledged arrival at an actual endpoint rather than perpetual progress. You know what finished genuinely looks like, and reaching it gives you real, felt ground. That capacity to recognize and claim completion is a genuine strength, rare in a culture that prizes constant more. And you can let an already-finished thing actually be named as complete, without adding one more condition first.`,
      shadow: `You reach real completion and immediately relativize it, adding one more condition before it's allowed to actually count. Underneath the relativizing is often a fear that claiming full completion would mean there's nothing left to strive for. You hit a genuine finish line and move the goalposts before the achievement has even registered as real. The relativizing costs you the felt ground actual completion is supposed to provide.`,
      invitation: `Ask yourself honestly what already-finished thing you've never let yourself call complete. Let one already-finished thing today actually be named as complete. Say it's done, without adding a further condition. Notice that naming it complete doesn't stop you from starting the next thing later.`,
    },

    '22_MUL': {
      title: `22 in Root Chakra — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `Your sense of safety comes from openness to the unknown, real faith in your own adaptability to whatever arrives. You can step into uncertain territory trusting your capacity to handle what shows up. That adaptability is a genuine strength, tested each time you've actually navigated the unfamiliar. And a real leap can be taken with your eyes fully open, discernment intact, without that discernment undoing the trust.`,
      shadow: `That openness becomes recklessness, leaping without discernment because the trust slips quietly into avoiding preparation altogether. Underneath the recklessness is often a fear that discernment or preparation would somehow contaminate the purity of the trust you're leaping with. You take a risk on faith alone, skipping the discernment that would have made the leap safer without diminishing it. The recklessness costs you outcomes that a clear-eyed version of the same leap would have protected.`,
      invitation: `Ask yourself honestly what discernment you've been skipping in the name of pure openness. Take one real leap today while still keeping your eyes open. Assess it clearly before you go, without abandoning the leap itself. Notice that discernment doesn't shrink the trust, it just protects it.`,
    },


    // ── Chakra Map: Swadhisthana, Sacral Chakra (SWA) ───────────────────────


    // ── Yearly Energy Forecast (YE) — the one time-varying position ─────────

    '1_YE': {
      title: `1 in Yearly Energy — The Magician`,
      tagline: `A Design of the Carried Beginning`,
      mastery: `This stretch of your life is built for starting things, originating real momentum rather than maintaining what's already comfortable. You have unusual access to fresh initiative right now, ideas arriving with real energy behind them. That capacity to launch is a genuine strength of this period, not restlessness. And you can carry one beginning past its first exciting moment, letting the initiative actually mature into something real.`,
      shadow: `You start five things and stay with none of them, mistaking the charge of a new idea for proof that it's the right one. Underneath the pattern is often a fear that staying with any single beginning past its novelty would mean facing the harder, less thrilling work that follows. You generate momentum at a rate that outpaces your capacity to finish any of it. The pattern costs you the result a followed-through beginning would have actually produced this period.`,
      invitation: `Ask yourself honestly which beginning you're already tempted to abandon for something newer. Pick one beginning today and follow it past its first exciting moment. Commit to it deliberately, through the point where it's no longer novel. Notice that the initiative doesn't disappear once the beginning matures.`,
    },

    '2_YE': {
      title: `2 in Yearly Energy — The High Priestess`,
      tagline: `A Design of the Acted Sense`,
      mastery: `This stretch of your life calls for listening inward rather than gathering more outside opinions before deciding anything. Your own intuition is unusually sharp right now, worth trusting more than the usual amount of external input. That capacity for accurate inner knowing is a genuine strength of this period. And you can act on one certainty now, before it's fully justifiable to anyone else, and trust it to hold up.`,
      shadow: `You stay so private with your knowing that it never actually gets tested or acted on during this period at all. Underneath the privacy is often a fear that voicing or acting on an unproven certainty would expose it to challenge it can't yet survive. You sense the right answer clearly and keep it entirely to yourself, letting the window for using it pass. The privacy costs you the results this period's sharpened intuition was actually built to produce.`,
      invitation: `Ask yourself honestly what inner certainty you've been keeping to yourself instead of acting on. Act on one inner certainty today before you can fully justify it to anyone else. Move on it now, not once it's provable. Notice that acting on it doesn't require external validation first.`,
    },

    '3_YE': {
      title: `3 in Yearly Energy — The Empress`,
      tagline: `A Design of Included Growth`,
      mastery: `This stretch of your life is built for nurturing, abundance, and letting something genuinely take its natural time to grow. You have real access to a generative, patient energy right now, capable of tending something into real richness. That capacity for patient abundance is a genuine strength of this period. And you can include yourself in that same nurturing, not only extend it outward toward everything else.`,
      shadow: `You rush the growth, or pour so much outward that your own reserves quietly run thin during a period built for the opposite. Underneath the rushing or over-giving is often a fear that slowing down or keeping some abundance for yourself would waste this fertile window. You force a pace onto something that needed patience, or exhaust your own reserves tending everything but yourself. The pattern costs you the depth this period's generative energy was actually meant to produce.`,
      invitation: `Ask yourself honestly what you're rushing, or where your own reserves have gone quietly thin. Tend one thing patiently today, without forcing its pace, and include yourself in the nurturing. Give yourself the same patient care you're giving elsewhere. Notice that including yourself doesn't slow the growth you're tending.`,
    },

    '4_YE': {
      title: `4 in Yearly Energy — The Emperor`,
      tagline: `A Design of the Held Structure`,
      mastery: `This stretch of your life is for establishing real, durable structure, not just improvised, temporary holding-together. You have genuine capacity right now to build systems and routines sturdy enough to actually last beyond this period. That structural capability is a real strength of this stretch of time. And you can build a piece of it now and let it actually hold, rather than needing to grip it constantly.`,
      shadow: `You grip control so tightly that the structure you're building becomes a burden rather than the support it was meant to be. Underneath the gripping is often a fear that anything left unmonitored during this period would collapse without your constant attention. You build real structure and then can't let go of overseeing every piece of it. The gripping exhausts you and undermines the very durability this period is actually capable of producing.`,
      invitation: `Ask yourself honestly which piece of structure you're gripping that's actually sturdy enough to hold on its own. Build one piece of real, durable structure today, and let it hold without your constant oversight. Step back from it deliberately once it's built. Notice that it holds even without your continuous attention.`,
    },

    '5_YE': {
      title: `5 in Yearly Energy — The Hierophant`,
      tagline: `A Design of the Moved Knowledge`,
      mastery: `This stretch of your life is for engaging seriously with tradition, mentorship, or real, earned knowledge, in either direction. You're positioned right now to either learn deeply or teach meaningfully, and both are genuinely available to you. That capacity for real engagement with knowledge is a strength specific to this period. And you can move a piece of it, learned or taught, all the way to actual application rather than leaving it theoretical.`,
      shadow: `You treat the knowledge as something to collect rather than actually apply and pass on during a period built for exactly that. Underneath the collecting is often a fear that applying or teaching the knowledge now would expose gaps more study might have covered. You accumulate credentials or insight without ever putting any of it to real use. The collecting costs you the transmission and application this period is specifically suited to produce.`,
      invitation: `Ask yourself honestly what knowledge you're still just collecting instead of applying or teaching. Either learn one thing deeply today, or teach one thing you already know, fully. Choose the concrete version, not another round of gathering. Notice that acting on the knowledge doesn't require having mastered everything first.`,
    },

    '6_YE': {
      title: `6 in Yearly Energy — The Lovers`,
      tagline: `A Design of the Reclaimed Choice`,
      mastery: `This stretch of your life is for making a real, examined choice about a relationship or a value you've been living by. You have unusual clarity available right now to actually decide, rather than simply continue by momentum. That capacity for conscious choice is a genuine strength of this period. And you can name a default pattern out loud and actually reclaim it as a real decision, rather than letting it stay unexamined.`,
      shadow: `You go through the motions of a choice already made by default, never consciously reclaiming it as an actual decision during this window. Underneath the default is often a fear that examining it directly would force a change you're not ready to make. You live inside an unexamined pattern, treating it as settled when it was never actually chosen. The default costs you this period's specific capacity for real, deliberate choice.`,
      invitation: `Ask yourself honestly what choice you've been making silently, by default, without ever actually deciding it. Name out loud today one choice you've been making silently by default. Say it plainly, as a real decision, not a given. Notice that naming it doesn't require changing it, just claiming it as chosen.`,
    },

    '7_YE': {
      title: `7 in Yearly Energy — The Chariot`,
      tagline: `A Design of the Named Destination`,
      mastery: `This stretch of your life is for directed momentum, real forward motion aimed at something specific, not just staying busy. You have genuine drive available right now, and that drive is most powerful when it's actually pointed somewhere. That capacity for directed motion is a real strength of this period. And you can name one specific destination and aim the current momentum at it deliberately, rather than moving on motion alone.`,
      shadow: `You move hard without checking the direction, mistaking speed itself for progress during a period that actually rewards aim. Underneath the unchecked speed is often a fear that stopping to name a destination would slow down momentum you're afraid to lose. You generate real motion without a clear target, and the motion doesn't accumulate into anything specific. The unaimed speed costs you the progress this period's drive was actually capable of producing.`,
      invitation: `Ask yourself honestly what destination your current momentum is actually aimed at, if any. Name one specific destination today and aim your current momentum at it deliberately. Point the drive somewhere concrete, not just forward. Notice that naming the target doesn't slow the momentum, it focuses it.`,
    },

    '8_YE': {
      title: `8 in Yearly Energy — Justice`,
      tagline: `A Design of the Self-Applied Standard`,
      mastery: `This stretch of your life is for addressing an imbalance honestly, including one that's close to home and easy to avoid. You have unusually sharp access right now to seeing what's actually unfair, in your own conduct as much as anyone else's. That capacity for honest self-application is a genuine strength of this period. And you can apply the same fair standard to yourself that you'd apply to anyone else, without it feeling like self-punishment.`,
      shadow: `You apply that clarity outward only, auditing everyone else's conduct while your own goes conveniently unexamined this period. Underneath the outward-only application is often a fear that turning the standard inward would reveal you don't actually meet it either. You notice every inconsistency in others while your own imbalance stays exempt from the same scrutiny. The double standard costs you the integrity this period was specifically positioned to help you build.`,
      invitation: `Ask yourself honestly where you'd fail the standard you apply so readily to others right now. Apply today the same fair standard to yourself that you'd apply to anyone else. Examine your own conduct first, before anyone else's. Notice that this scrutiny doesn't diminish you, it makes the fairness real.`,
    },

    '9_YE': {
      title: `9 in Yearly Energy — The Hermit`,
      tagline: `A Design of the Shared Return`,
      mastery: `This stretch of your life is for withdrawal and depth, real solitude rather than constant availability to everyone else. You have genuine access right now to insight that only comes from stepping back and going inward. That capacity for depth through chosen withdrawal is a real strength of this period. And you can bring what you find there back out to actually share, rather than keeping the depth permanently to yourself.`,
      shadow: `You stay in the withdrawal past its purpose, gathering real depth that never actually gets carried back out to anyone. Underneath staying too long is often a fear that rejoining would mean losing the depth the solitude worked hard to produce. You extend the retreat indefinitely, treating the depth as something to protect rather than something to eventually share. The extended withdrawal costs you the impact this period's insight was actually meant to have.`,
      invitation: `Ask yourself honestly what you've learned in solitude that you haven't brought back to share yet. Take real, chosen solitude today, and bring back one thing you learn there to share. Return deliberately and offer it to someone. Notice that sharing the depth doesn't diminish it.`,
    },

    '10_YE': {
      title: `10 in Yearly Energy — Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `This stretch of your life is a genuine turning point, where trusting the timing matters more than forcing a particular outcome. You're positioned right now to actually work with the natural cycle rather than fight it. That trust in timing is a real strength specific to this period. And you can meet the current turn, whichever direction it moves, with curiosity instead of alarm.`,
      shadow: `You treat a normal turn as a crisis, bracing hard against a downturn or refusing to trust an upswing that's actually arriving. Underneath the bracing or the refusal is often a fear that this particular turn is the exception that won't resolve the way turns usually do. You resist the natural movement of this period, spending energy fighting a cycle that was always going to turn regardless. The resistance costs you the ease that trusting the timing would have provided at no real loss.`,
      invitation: `Ask yourself honestly whether this turn is actually a crisis or simply the natural movement of this period. Meet today's turn, up or down, with curiosity instead of alarm. Ask what it's asking of you rather than immediately resisting it. Notice that curiosity moves you through it faster than resistance does.`,
    },

    '11_YE': {
      title: `11 in Yearly Energy — Strength`,
      tagline: `A Design of the Private Holding`,
      mastery: `This stretch of your life is for holding steady through real pressure, gently rather than through sheer force. You have genuine resilience available right now, capable of enduring difficulty without needing to grip or perform. That quiet, gentle endurance is a real strength specific to this period. And your steadiness stays just as real whether or not anyone's actually watching it happen.`,
      shadow: `You perform unbreakability for an audience rather than simply, privately, holding steady during a period suited to quiet endurance. Underneath the performance is often a fear that unwitnessed strength wouldn't actually count, or might not be trusted as real. You showcase resilience specifically to be seen enduring, rather than simply enduring. The performance costs you the quiet, self-sufficient version of the same strength this period actually supports.`,
      invitation: `Ask yourself honestly whether you'd trust this resilience if no one ever saw it. Let your endurance be private today, and trust it doesn't need to be witnessed to be real. Hold steady through something without announcing it. Notice that the strength doesn't require an audience to be genuine.`,
    },

    '12_YE': {
      title: `12 in Yearly Energy — The Hanged Man`,
      tagline: `A Design of the Checked Pause`,
      mastery: `This stretch of your life is a suspension that's actually doing real work, not simply stalling while nothing changes. You have genuine capacity right now to let a pause do its actual job, producing insight rather than just delay. That trust in a working pause is a real strength specific to this period. And you can check whether the current suspension is still teaching you something or has quietly become avoidance instead.`,
      shadow: `You mistake every pause for permission to avoid a real decision indefinitely, letting the suspension run well past its usefulness. Underneath the mistake is often a fear that ending the pause would force a decision you're not ready to make. You stay suspended long after the pause has stopped producing any actual insight. The extended suspension costs you the clarity this period's real pause was originally meant to deliver.`,
      invitation: `Ask yourself honestly whether this pause is still teaching you anything or has become simple avoidance. Check today whether your current pause is still teaching you something, or has become avoidance. Be honest about which one it actually is right now. Notice that ending an avoidant pause doesn't waste the time already spent in it.`,
    },

    '13_YE': {
      title: `13 in Yearly Energy — Transformation`,
      tagline: `A Design of the Completed Ending`,
      mastery: `This stretch of your life is for a real ending, not a patched-over, cosmetically-refreshed version of the same old thing. You have genuine access right now to let something actually finish and be renewed by it. That capacity for complete, real transformation is a strength specific to this period. And you can let a genuine ending run its actual pace, neither rushed nor indefinitely avoided.`,
      shadow: `You rush the ending to avoid discomfort, or refuse to let it happen at all, missing the actual work this period is for. Underneath both extremes is often a fear that either the discomfort of ending or the vulnerability of what comes after is more than you can currently handle. You either force a premature close or hold on well past the natural end point. Either extreme costs you the genuine renewal this period's ending energy is actually built to produce.`,
      invitation: `Ask yourself honestly whether you're rushing an ending or refusing to let one happen at all. Name one thing today that's actually ready to end, and let it complete at its own pace. Neither force it nor delay it further. Notice that its own pace is usually neither as fast nor as slow as your instinct suggests.`,
    },

    '14_YE': {
      title: `14 in Yearly Energy — Temperance`,
      tagline: `A Design of the Working Blend`,
      mastery: `This stretch of your life is for genuine integration between two things you've been treating as separate opposites. You have real capacity right now to actually blend competing demands into something that works together. That capacity for integration is a strength specific to this period, not indecision. And you can find one actually blended version of two things you've been keeping apart, producing something steadier than either extreme.`,
      shadow: `You swing hard between extremes and call the alternation "balance," when it's actually just oscillation without real integration. Underneath the swing is often a fear that true blending doesn't actually exist, that only alternating between the two is realistic right now. You move between opposite modes without ever letting them cohere into something combined. The oscillation costs you the genuine integration this period is actually well-suited to produce.`,
      invitation: `Ask yourself honestly whether this is real balance or just alternating between two extremes. Find one small, actually blended version today of two things you've been keeping separate. Combine them deliberately instead of switching between them. Notice that the blend holds steadier than either extreme did alone.`,
    },

    '15_YE': {
      title: `15 in Yearly Energy — The Devil`,
      tagline: `A Design of the Honest Reckoning`,
      mastery: `This stretch of your life is for facing a compulsion or attachment honestly, rather than pretending it isn't actually there. You have real access right now to confront a pull directly, without it needing to destabilize you. That capacity for honest reckoning is a genuine strength of this period. And naming a real compulsion honestly, without shame, tends to loosen its grip rather than tightening it.`,
      shadow: `You deny the pull entirely, which only tightens its grip during a period specifically suited to loosening it through honesty. Underneath the denial is often a fear that naming the compulsion honestly would make it too real to manage. You maintain a cleaner surface while the actual pull operates unaddressed underneath it. The denial costs you this period's specific capacity to actually loosen what's been quietly running you.`,
      invitation: `Ask yourself honestly what compulsion or attachment you've been denying rather than facing. Name one real compulsion or attachment honestly today, without shame. Say it plainly, to yourself first. Notice that naming it doesn't make you worse, it just makes it visible.`,
    },

    '16_YE': {
      title: `16 in Yearly Energy — The Tower`,
      tagline: `A Design of the Honest Rebuild`,
      mastery: `This stretch of your life is real collapse followed by real rebuilding, landing on ground that's actually more honest than before. You have genuine capacity right now to let a failing structure fall and reconstruct something sturdier in its place. That capacity for honest collapse-then-rebuild is a real strength of this period. And letting a shaky structure fall on its own terms clears the ground for what this period is actually building toward.`,
      shadow: `You defend a structure you already suspect isn't sound, just to avoid the collapse this period is actually asking you to allow. Underneath the defending is often a fear that letting the structure fall now would cost more than propping it up temporarily. You maintain something you privately know is failing, delaying an ending that's actually inevitable. The defending costs you the honest rebuild this period is specifically positioned to help you complete.`,
      invitation: `Ask yourself honestly what structure you're propping up that you already suspect isn't sound. Let one shaky structure fall today on its own terms, instead of propping it up further. Stop the propping and let the collapse complete itself. Notice that the rebuild can't start until the old structure is actually gone.`,
    },

    '17_YE': {
      title: `17 in Yearly Energy — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `This stretch of your life is for real, visible hope, at its actual full size, not a modest, private version of it. You have genuine access right now to a hope specific enough and strong enough to actually stabilize you through this period. That capacity for full-sized, visible hope is a real strength of this time. And letting the hope be as large and visible as it actually is doesn't risk it, it strengthens it.`,
      shadow: `You keep that hope quiet and shrunken, as though believing too openly right now would somehow be tempting fate. Underneath the shrinking is often a fear that a large, visible hope would be too exposed if this period doesn't deliver on it. You reduce the hope down to something safely small, and it stops actually functioning as the ground this period is offering you. The shrinking costs you the stabilizing force this period's hope is actually capable of providing.`,
      invitation: `Ask yourself honestly what hope you've been keeping quiet and shrunken right now. Let one hope be as large and visible today as it actually is. Say it out loud, without the usual modesty. Notice that the larger version doesn't destabilize you, it grounds you more.`,
    },

    '18_YE': {
      title: `18 in Yearly Energy — The Moon`,
      tagline: `A Design of the Checked Undercurrent`,
      mastery: `This stretch of your life is for trusting an undercurrent before it's fully provable by concrete facts. You have unusually sharp access right now to a felt sense that's picking up something real before it's confirmed. That intuitive sensitivity is a genuine strength of this period. And holding a strong feeling as real information, then checking it gently against what's actually happening, sharpens its accuracy rather than dismissing it.`,
      shadow: `You let that feeling curdle into anxious story instead of letting it stay a genuine, worth-checking signal during this sensitive period. Underneath the curdling is often a fear that questioning the feeling would mean ignoring a real warning sign this period is trying to give you. You let an intuitive read escalate into a full narrative without checking it against what's actually true. The escalation costs you the accuracy this period's real sensitivity is actually capable of.`,
      invitation: `Ask yourself honestly whether this strong feeling has actually been checked against what's really happening. Hold one strong feeling today as real information, and check it gently against what's actually happening. Look for the concrete facts alongside the felt sense. Notice whether the feeling holds up once it's actually tested.`,
    },

    '19_YE': {
      title: `19 in Yearly Energy — The Sun`,
      tagline: `A Design of Undimmed Joy`,
      mastery: `This stretch of your life is for real, open happiness, expressed at its actual full size rather than a managed version of it. You have genuine access right now to a joy that's meant to be seen, not carefully modulated for others. That capacity for undimmed joy is a real strength specific to this period. And letting one real joy show at full size, unmanaged, doesn't cost you the composure people rely on you for.`,
      shadow: `You dim the joy for other people's comfort, keeping it smaller than it actually is during a period built for the opposite. Underneath the dimming is often a fear that full, visible happiness would be too much for the people around you to hold. You manage the joy down to a socially comfortable size, and it stops functioning as the aliveness this period is offering you. The dimming costs you the full expression this period's joy is actually capable of.`,
      invitation: `Ask yourself honestly what joy you've been dimming for someone else's comfort. Let one real joy show today at its full size, without managing it down. Let it be as big as it actually is. Notice that the room can hold more of it than you assumed.`,
    },

    '20_YE': {
      title: `20 in Yearly Energy — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `This stretch of your life is for actually rising to something you've already heard clearly, not just recognizing it. You have unusual clarity right now about what's being asked of you, and genuine capacity to act on it. That capacity to actually answer, not just sense, is a real strength of this period. And you can take one concrete step toward the calling now, rather than waiting for every condition to align first.`,
      shadow: `You hear the calling clearly and still find sophisticated reasons to keep waiting, even during a period built for answering it. Underneath the sophisticated reasons is often a fear that answering now would mean facing whatever the calling actually asks of you, unprepared. You describe the calling accurately to anyone who asks, while taking no further action toward it. The waiting costs you this period's specific window for actually answering rather than just recognizing.`,
      invitation: `Ask yourself honestly what you're actually still waiting for before you begin. Take one concrete step today toward the calling you've already heard. Do the real action, not another round of preparation. Notice that the step doesn't require full readiness to be worth taking.`,
    },

    '21_YE': {
      title: `21 in Yearly Energy — The World`,
      tagline: `A Design of the Named Arrival`,
      mastery: `This stretch of your life is for genuine completion, real arrival, not another condition appended before something counts as done. You have real access right now to recognize an actual endpoint and let it be one. That capacity to claim completion is a genuine strength specific to this period. And you can let an already-finished thing be actually called complete, without adding one more requirement first.`,
      shadow: `You reach real completion and immediately relativize it, finding a reason it doesn't quite count yet during a period built for claiming it fully. Underneath the relativizing is often a fear that full completion would mean there's nothing left to strive toward. You hit a genuine finish line and move the goalposts before the achievement has registered as real. The relativizing costs you the felt arrival this period's completion energy is actually capable of delivering.`,
      invitation: `Ask yourself honestly what already-finished thing you've never let yourself call complete. Let one already-finished thing today actually be called complete. Say it's done, without adding a further condition. Notice that naming it complete doesn't stop the next thing from beginning later.`,
    },

    '22_YE': {
      title: `22 in Yearly Energy — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `This stretch of your life is for beginning something with open eyes, real trust in the unknown that's actually informed, not blind. You have genuine capacity right now to step into uncertain territory and adapt well to whatever it brings. That capacity for open, clear-eyed risk is a real strength specific to this period. And you can take one real leap now, eyes open, rather than waiting for a guarantee this period isn't offering.`,
      shadow: `You inherit caution instead of boldness, letting an old fear override a genuinely good opportunity this period is actually offering. Underneath the inherited caution is often a fear that stepping into this unknown would repeat a risk that didn't pay off for someone before you. You default to the safe, familiar option automatically, without weighing whether this specific opportunity actually calls for it. The inherited caution costs you the leap this period is genuinely well-suited to support.`,
      invitation: `Ask yourself honestly whether this caution is genuinely yours or something inherited and reflexive. Take one real leap today, with your eyes open, rather than waiting for a guarantee. Assess it clearly, then go, without needing certainty first. Notice that this leap doesn't require abandoning good judgment, just loosening its grip.`,
    },

  }; // end nodes


  // ── GENERAL FALLBACK — ALL 22 ARCANA ─────────────────────────────────────

  const general = {

    1: {
      title: `The Magician — General`,
      tagline: `A Design of Pure Beginning`,
      mastery: `You bring things into existence just by starting. You don't wait for perfect conditions — you move, and the conditions catch up to you. That's real power, not luck.`,
      shadow: `You start brilliantly and finish nothing. You're on to the next idea before the first one has legs, and you call it inspiration instead of what it actually is — an inability to stay past the exciting part.`,
      invitation: `Pick one thing you started and abandoned. Do the next boring step today, not a new idea.`,
    },

    2: {
      title: `The High Priestess — General`,
      tagline: `A Design of the Held Knowing`,
      mastery: `You know things before you can explain them, and you're usually right. Most people need proof first. You trust the quiet certainty that arrives before the logic does.`,
      shadow: `You keep your knowing to yourself and call it privacy. You let people get close enough to sense your depth and never close enough to actually reach it — safe, but alone.`,
      invitation: `Say one thing you know to be true out loud today, before you've built the case for it.`,
    },

    3: {
      title: `The Empress — General`,
      tagline: `A Design of Overflow`,
      mastery: `You create and nurture from real abundance, not obligation. What you give, you give because it's full in you first — that's rare generosity, not self-sacrifice.`,
      shadow: `You give until you're empty and call it love. You need to be needed, so you keep finding people who require endless tending, and you never fill your own well first.`,
      invitation: `Make or do one thing this week purely for yourself. No one else benefits. Don't apologize for it.`,
    },

    4: {
      title: `The Emperor — General`,
      tagline: `A Design of the Real Container`,
      mastery: `You build structure strong enough to hold real weight. What you create doesn't collapse under pressure, because you understood, from the start, why the structure needed to exist.`,
      shadow: `You enforce rules because your own stability depends on people following them. Anything unpredictable feels like a threat, and you mistake control for strength.`,
      invitation: `Let one rule bend this week without enforcing it. Watch that nothing actually falls apart.`,
    },

    5: {
      title: `The Hierophant — General`,
      tagline: `A Design of Passed-On Knowledge`,
      mastery: `You carry real, hard-won knowledge and you're built to pass it on. When you teach, people actually learn, because what you're offering was earned, not memorized.`,
      shadow: `You need your students to stay students. Somewhere underneath the teaching is a quiet requirement that no one ever surpass you — and you'll never admit that's what's happening.`,
      invitation: `Tell someone you're teaching or mentoring that you want them to go further than you did. Mean it.`,
    },

    6: {
      title: `The Lovers — General`,
      tagline: `A Design of the Real Choice`,
      mastery: `You can make a real decision and live inside it completely — no half-commitment, no hedge. When you choose, you choose, and that's rarer than people think.`,
      shadow: `You keep every option open so you never have to grieve the one you didn't take. You let other people or circumstances decide for you, then call it flexibility.`,
      invitation: `Make one decision today you've been avoiding. Choose, and let the other option go completely — no reopening it.`,
    },

    7: {
      title: `The Chariot — General`,
      tagline: `A Design of the Held Direction`,
      mastery: `You hold a direction and drive it forward, even through resistance. You don't need everything sorted first — you move, and you correct course without losing the destination.`,
      shadow: `You grip so hard nothing else can move with you. You can't let anyone else touch the wheel, and you mistake control for mastery, then wonder why nobody sticks around to help.`,
      invitation: `Let someone else make one decision on something you're driving this week. Don't override it.`,
    },

    8: {
      title: `Justice — General`,
      tagline: `A Design of the Turned Scale`,
      mastery: `You see clearly and call things by their real name — fair, unfair, true, false. That precision is rare, and people trust you because you don't bend it to flatter anyone.`,
      shadow: `You hold everyone to your standard except yourself. You judge other people's fairness constantly and quietly exempt your own conduct from the same scale.`,
      invitation: `Apply your own standard to yourself once this week, out loud, before you apply it to anyone else.`,
    },

    9: {
      title: `The Hermit — General`,
      tagline: `A Design of the Carried Light`,
      mastery: `You gather real wisdom in solitude — the kind that only comes from actually sitting with something instead of skimming past it. What you know, you know deeply.`,
      shadow: `You keep what you've learned to yourself, convinced it's too much or too refined for anyone else to receive. That's not humility. That's a wall, and it's costing you the connection you claim to want.`,
      invitation: `Share one thing you learned alone with someone this week. Don't simplify it. Just offer it.`,
    },

    10: {
      title: `The Wheel of Fortune — General`,
      tagline: `A Design of the Still Center`,
      mastery: `You understand timing. You know things move in cycles and you don't panic at the downturn or cling to the peak — you stay steady at the center while the wheel turns.`,
      shadow: `You brace for collapse even in the middle of a good run, or you give up early because "it always falls apart anyway." Either way, you're broadcasting collapse, and you keep getting it back.`,
      invitation: `Notice one good thing happening right now and let yourself fully be in it, without bracing for when it ends.`,
    },

    11: {
      title: `Strength — General`,
      tagline: `A Design of the Tamed Force`,
      mastery: `You hold real power without needing to prove it through force. You can stay calm with something wild and dangerous because you trust your own steadiness more than you need to control the outcome.`,
      shadow: `You can't rest, and you can't receive help, because both feel like weakness. You carry everyone's weight and never let anyone carry yours — then wonder why nobody offers.`,
      invitation: `Ask someone for help with something small today. Let them actually help. Don't take it back.`,
    },

    12: {
      title: `The Hanged Man — General`,
      tagline: `A Design of the Chosen Pause`,
      mastery: `You can stop, suspend everything, and see from a completely different angle than everyone rushing past you. That patience gets you insight most people never slow down enough to find.`,
      shadow: `You never come back down. Waiting becomes an identity — the one who sacrifices, who's misunderstood, who's still not ready — and you've stopped actually expecting the return.`,
      invitation: `Name one thing you're "still figuring out" that's actually just stalling. Take one step back into motion this week.`,
    },

    13: {
      title: `Transformation — General`,
      tagline: `A Design of the Clean Ending`,
      mastery: `You can let something die completely and make room for what's next. You don't need a crisis to release what's already finished — you just release it.`,
      shadow: `You hold on to things long after they've ended, until the weight forces a collapse bigger than it needed to be. Or you manufacture chaos just to feel the intensity of change again.`,
      invitation: `Name one thing in your life that's already over. Actually let it go this week — don't just admit it, act on it.`,
    },

    14: {
      title: `Temperance — General`,
      tagline: `A Design of Patient Combination`,
      mastery: `You can combine things nobody else thinks belong together — ideas, people, opposing plans — and make something genuinely new out of the mix. That takes real patience most people don't have.`,
      shadow: `You rush the middle ground to avoid real tension, and it comes out watered-down instead of resolved. Nobody's actually satisfied, but nobody can say exactly why.`,
      invitation: `Let one disagreement stay unresolved a little longer instead of smoothing it over early. Let both sides be fully felt first.`,
    },

    15: {
      title: `The Devil — General`,
      tagline: `A Design of the Loose Chain`,
      mastery: `You can fully enjoy pleasure, power, and material life without needing any of it. You engage the world as a participant, not a hostage to it.`,
      shadow: `You're bound to something — money, status, a relationship pattern — that you know isn't serving you, and you mistake the grip for security. You call the chain a choice you haven't actually made yet.`,
      invitation: `Name the one thing you're most attached to right now. Ask honestly what it's actually giving you, and whether you still need it.`,
    },

    16: {
      title: `The Tower — General`,
      tagline: `A Design of the Necessary Collapse`,
      mastery: `You can see exactly what's built on a false foundation, and you're not afraid to let it fall. That clarity, even when it costs something, is real strength.`,
      shadow: `You keep manufacturing crisis because calm feels dangerous to you. You tear down things that were actually still working, just to feel the intensity of collapse again.`,
      invitation: `Name one structure in your life that's stable but boring. Resist the urge to shake it up this week. Let steady be enough.`,
    },

    17: {
      title: `The Star — General`,
      tagline: `A Design of Structural Hope`,
      mastery: `You generate real hope that doesn't need proof to exist. You keep believing in what's possible even when nothing outside you confirms it — that's rare and it's real.`,
      shadow: `You hold everyone to the potential you see in them instead of meeting them where they actually are. People feel like they're constantly falling short of your vision, even when they're doing fine.`,
      invitation: `Meet one person exactly where they are today — no mention of their potential, just where they actually stand right now.`,
    },

    18: {
      title: `The Moon — General`,
      tagline: `A Design of the Felt Truth`,
      mastery: `You sense what's true before you can explain it — through your body, your gut, your dreams. That intuition is real information, not just a feeling.`,
      shadow: `You can't tell your own projections from actual reality. An old fear gets laid over a neutral situation, and you find "proof" everywhere, because you're the one who put it there.`,
      invitation: `Next time a suspicion arises, name it as a feeling before treating it as fact. Check it against something real before acting on it.`,
    },

    19: {
      title: `The Sun — General`,
      tagline: `A Design of Natural Radiance`,
      mastery: `You shine because that's what you actually do, not because you're performing. Your warmth and vitality are real, and they lift the room without you trying.`,
      shadow: `You need to be the brightest thing in the room. Someone else's light feels like a threat, and the people closest to you get burned by an intensity that was never meant for them specifically.`,
      invitation: `Actively celebrate someone else's win or brightness this week, out loud, without adding yourself to the story.`,
    },

    20: {
      title: `Judgement — General`,
      tagline: `A Design of the Answered Call`,
      mastery: `You hear the call to become more, and you actually move on it. You don't wait for total readiness — you rise and let the rest sort itself out on the way.`,
      shadow: `You've been "getting ready" to answer the call for years. More learning, more preparing, more clearing — because actually moving means being fully seen, and that terrifies you.`,
      invitation: `Take the one real step you've been preparing to take. Today, not after one more round of getting ready.`,
    },

    21: {
      title: `The World — General`,
      tagline: `A Design of the Claimed Finish`,
      mastery: `You can call something finished and mean it. You stand inside your own completed work instead of immediately launching into the next thing.`,
      shadow: `You never let anything actually be done. One more revision, one more addition — because finishing means facing whatever uncertainty comes next, and that's scarier than staying in progress forever.`,
      invitation: `Declare one thing finished today, out loud, even if it's not perfect. Don't touch it again this week.`,
    },

    22: {
      title: `The Fool — General`,
      tagline: `A Design of the Open Beginning`,
      mastery: `You can start over completely, without the guaranteed outcome, and do it without dread. That fearlessness at the edge of the unknown is a real gift most people never access.`,
      shadow: `You keep starting over without learning anything from the last round. Same mistake, new setting, dressed up as a fresh start because a real fresh start would require sitting with what actually happened.`,
      invitation: `Before your next new beginning, name one specific thing the last cycle actually taught you. Carry it in, don't leave it behind.`,
    },

  }; // end general


  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * get(arcanaNum, nodeKey)
   * Returns the richest content available for this arcana in this position.
   * Falls back to general[arcanaNum] if no position-specific entry exists.
   */
  function get(arcanaNum, nodeKey) {
    return nodes[arcanaNum + '_' + nodeKey] || general[arcanaNum] || null;
  }

  return { get };

})();
