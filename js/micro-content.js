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
      mastery: `You fall in love with substance, offering genuine reverence for who a partner had to become.`,
      shadow: `You measure a partner against an inherited standard, holding back your full arrival until they pass.`,
      invitation: `Let the relationship itself be the standard today, instead of measuring it against a rulebook you inherited.`,
    },

    // ── 1 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '1_LOVE': {
      title: `1 in Ideal Partner — The Magician`,
      tagline: `A Design of the Quiet Chapter`,
      mastery: `You make a relationship feel alive, generating momentum in a connection that might otherwise stall.`,
      shadow: `You chase the electric feeling of a new connection's beginning and lose interest once it settles.`,
      invitation: `Let one quiet chapter of your relationship today feel as alive as its beginning.`,
    },

    // ── 2 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '2_LOVE': {
      title: `2 in Ideal Partner — The High Priestess`,
      tagline: `A Design of Mutual Depth`,
      mastery: `You offer patient, perceptive attention that makes a partner feel truly seen.`,
      shadow: `You stay so guarded yourself that intimacy becomes one-directional.`,
      invitation: `Let yourself be known today at the same pace you come to know your partner.`,
    },

    // ── 3 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '3_LOVE': {
      title: `3 in Ideal Partner — The Empress`,
      tagline: `A Design of Received Tending`,
      mastery: `You create real warmth and abundance, making a partner feel genuinely tended to.`,
      shadow: `You organize the whole relationship around your giving, your own needs staying unspoken.`,
      invitation: `Let yourself be tended to today, as openly as you tend to others.`,
    },

    // ── 4 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '4_LOVE': {
      title: `4 in Ideal Partner — The Emperor`,
      tagline: `A Design of the Flexed Container`,
      mastery: `You build relationships with real commitment to the container itself: consistency and follow-through.`,
      shadow: `You prioritize the structure of the relationship over its actual aliveness, maintaining the form after connection fades.`,
      invitation: `Let the container flex today in one small way, instead of maintaining rigid form.`,
    },

    // ── 6 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '6_LOVE': {
      title: `6 in Ideal Partner — The Lovers`,
      tagline: `A Design of Lived Alignment`,
      mastery: `Your love is built on genuine, deliberate alignment — shared values chosen rather than assumed.`,
      shadow: `You treat every disagreement as evidence of misalignment, auditing a partner exhaustively.`,
      invitation: `Let alignment today be a direction you're both moving in, not a static test to pass.`,
    },

    // ── 7 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '7_LOVE': {
      title: `7 in Ideal Partner — The Chariot`,
      tagline: `A Design of Two Hands on the Wheel`,
      mastery: `You bring real momentum to a relationship, navigating life together with shared direction.`,
      shadow: `You turn the relationship into a solo drive with a passenger, setting the direction alone.`,
      invitation: `Let your partner actually hold some of the reins today.`,
    },

    // ── 8 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '8_LOVE': {
      title: `8 in Ideal Partner — Justice`,
      tagline: `A Design of the Released Ledger`,
      mastery: `You build trust in love promise by kept promise, through genuine reciprocity.`,
      shadow: `You keep an internal ledger of who's done more, turning intimacy into an accounting exercise.`,
      invitation: `Let one imbalance today be human instead of tracked.`,
    },

    // ── 9 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '9_LOVE': {
      title: `9 in Ideal Partner — The Hermit`,
      tagline: `A Design of Shared Silence`,
      mastery: `Your love is patient and deep, including real respect for solitude.`,
      shadow: `You use your need for space to avoid real vulnerability, retreating precisely when closeness is asked for.`,
      invitation: `Tell your partner today whether your solitude is genuine need or avoidance, and stay present.`,
    },

    // ── 10 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '10_LOVE': {
      title: `10 in Ideal Partner — Wheel of Fortune`,
      tagline: `A Design of the Full Cycle`,
      mastery: `You meet a relationship's current season honestly, without forcing false permanence.`,
      shadow: `You treat a relationship's downswing as proof it's over, bailing at the first natural low.`,
      invitation: `Let today's low season be a season, not a verdict, and stay through the full cycle.`,
    },

    // ── 11 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '11_LOVE': {
      title: `11 in Ideal Partner — Strength`,
      tagline: `A Design of the Visible Wobble`,
      mastery: `You hold a hard conversation or a partner's raw emotion without flinching.`,
      shadow: `You hold all the relationship's difficulty yourself, your own hard feelings staying invisible.`,
      invitation: `Let your own difficulty be visible today, on purpose.`,
    },

    // ── 12 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '12_LOVE': {
      title: `12 in Ideal Partner — The Hanged Man`,
      tagline: `A Design of the Patient Deadline`,
      mastery: `Real connection shows up for you once you release the grip on how or when it happens.`,
      shadow: `You wait indefinitely for a relationship to clarify itself rather than ever actually engaging directly.`,
      invitation: `Give your patience a deadline today, and commit to what the waiting has already revealed.`,
    },

    // ── 13 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '13_LOVE': {
      title: `13 in Ideal Partner — Transformation`,
      tagline: `A Design of Quiet Growth`,
      mastery: `Your love is genuinely metamorphic, bringing real intensity and willingness to grow because of a connection.`,
      shadow: `You need every relationship to be transformative to feel real, manufacturing intensity where ease would serve better.`,
      invitation: `Let one piece of relationship growth today happen quietly, without drama.`,
    },

    // ── 14 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '14_LOVE': {
      title: `14 in Ideal Partner — Temperance`,
      tagline: `A Design of Worked-Through Friction`,
      mastery: `You're genuinely skilled at blending two lives into something that works for both people.`,
      shadow: `You over-moderate the relationship to avoid real friction, smoothing over genuine differences.`,
      invitation: `Let one real difference surface today and stay long enough to be worked through.`,
    },

    // ── 15 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '15_LOVE': {
      title: `15 in Ideal Partner — The Devil`,
      tagline: `A Design of Chemistry Plus Tenderness`,
      mastery: `Your romantic connections run on real, undeniable magnetism and honest desire.`,
      shadow: `You mistake intensity for genuine compatibility, staying bound to chemistry that doesn't serve you otherwise.`,
      invitation: `Ask today what your relationship offers outside its intensity.`,
    },

    // ── 16 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '16_LOVE': {
      title: `16 in Ideal Partner — The Tower`,
      tagline: `A Design of the Deliberate Conversation`,
      mastery: `You sense when something's fundamentally not working before it's convenient to admit it.`,
      shadow: `You provoke a relationship's collapse prematurely, out of impatience with uncertainty.`,
      invitation: `Bring one piece of relational clarity today to an actual conversation, before acting alone on it.`,
    },

    // ── 17 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '17_LOVE': {
      title: `17 in Ideal Partner — The Star`,
      tagline: `A Design of Present-Tense Hope`,
      mastery: `You offer unwavering faith in who a partner is capable of becoming.`,
      shadow: `You love someone's potential more than who they actually, currently are.`,
      invitation: `Let your hope today meet your partner exactly where they currently are.`,
    },

    // ── 18 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '18_LOVE': {
      title: `18 in Ideal Partner — The Moon`,
      tagline: `A Design of the Tested Feeling`,
      mastery: `You sense a connection's truth before you can articulate it, a felt, wordless understanding.`,
      shadow: `You let unprocessed fear color how you read a partner, projecting old wounds onto present behavior.`,
      invitation: `Check one emotional read today against an actual conversation.`,
    },

    // ── 19 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '19_LOVE': {
      title: `19 in Ideal Partner — The Sun`,
      tagline: `A Design of Included Difficulty`,
      mastery: `Your love runs on authentic joy and ease rather than struggle or proving yourself.`,
      shadow: `You avoid a relationship, or hard conversations within it, the moment things stop feeling easy.`,
      invitation: `Let one hard, unglamorous moment today stay in the relationship without deciding it's wrong.`,
    },

    // ── 20 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '20_LOVE': {
      title: `20 in Ideal Partner — Judgement`,
      tagline: `A Design of the Honored Growth`,
      mastery: `Your romantic connections function as genuine catalysts, calling something larger out of you.`,
      shadow: `You stay in a relationship past its natural end because it once served as a catalyst.`,
      invitation: `Honor one relationship today for the growth it already gave you, even while letting it go if it's time.`,
    },

    // ── 21 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '21_LOVE': {
      title: `21 in Ideal Partner — The World`,
      tagline: `A Design of the Open Life`,
      mastery: `Your love thrives when it isn't asked to stay small — a shared life that can genuinely expand.`,
      shadow: `You let the relationship quietly close the world down, freedom traded for a comfortable routine.`,
      invitation: `Let the relationship actually expand today, one new place or shared vision at a time.`,
    },

    // ── 22 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '22_LOVE': {
      title: `22 in Ideal Partner — The Fool`,
      tagline: `A Design of the Carried Lesson`,
      mastery: `You carry a genuine, uncommon openness to love — presence without an agenda.`,
      shadow: `You repeat the same relational pattern with new people, with no accumulated wisdom carried forward.`,
      invitation: `Carry one concrete lesson today from your last relationship into how you love now.`,
    },

    // ── 17 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '17_MON': {
      title: `17 in Wealth Potential — The Star`,
      tagline: `A Design of Paid Visibility`,
      mastery: `Your income arrives in rhythm with genuine visibility, sharing your real gift where it can actually be seen.`,
      shadow: `You keep income conditional on approval before it's allowed to flow, delaying a launch or undercutting a rate until conditions feel perfect.`,
      invitation: `Show one piece of work publicly today at the stage it's actually in, priced at its real value.`,
    },

    // ── 1 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '1_MON': {
      title: `1 in Wealth Potential — The Magician`,
      tagline: `A Design of the Sustained Launch`,
      mastery: `Your income flows most freely through work that lets you originate — building something from nothing.`,
      shadow: `You chase the excitement of a new venture at the expense of ever letting one mature into steady income.`,
      invitation: `Commit today to one long-running thread you won't abandon for the next new idea.`,
    },

    // ── 2 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '2_MON': {
      title: `2 in Wealth Potential — The High Priestess`,
      tagline: `A Design of the Priced Insight`,
      mastery: `Your income draws on intuitive, often behind-the-scenes insight — trusting your read before it's fully explainable.`,
      shadow: `You undervalue that intuitive skill precisely because it's hard to quantify, staying background and underpaid.`,
      invitation: `Name and price one intuitive contribution today, even if you can't fully explain it.`,
    },

    // ── 3 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '3_MON': {
      title: `3 in Wealth Potential — The Empress`,
      tagline: `A Design of the Priced Gift`,
      mastery: `Your income thrives when your profession lets you actually create and grow something real.`,
      shadow: `You undercharge for generative work because it doesn't feel like conventional labor.`,
      invitation: `Price one piece of your creative or nurturing output today at its real value, not discounted.`,
    },

    // ── 4 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '4_MON': {
      title: `4 in Wealth Potential — The Emperor`,
      tagline: `A Design of the Built System`,
      mastery: `You thrive financially when given real authority to organize, lead, and build structure.`,
      shadow: `You stay in a role that under-uses your capacity for structure, following someone else's system completely.`,
      invitation: `Seek or create one role today where you actually get to build the system, not just staff it.`,
    },

    // ── 5 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '5_MON': {
      title: `5 in Wealth Potential — The Hierophant`,
      tagline: `A Design of the Taught Knowledge`,
      mastery: `Your income thrives when your profession includes passing on real, earned knowledge to someone else.`,
      shadow: `You stay a perpetual student, accumulating credentials without ever stepping into the teaching role.`,
      invitation: `Teach one piece of knowledge today, exactly as it is, before you feel fully ready.`,
    },

    // ── 6 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '6_MON': {
      title: `6 in Wealth Potential — The Lovers`,
      tagline: `A Design of the Committed Direction`,
      mastery: `Your income thrives specifically through people — connecting them, choosing well between them.`,
      shadow: `You weigh every professional option so exhaustively that you never commit long enough to build income in one direction.`,
      invitation: `Choose one direction built around genuine connection today, and commit to it fully.`,
    },

    // ── 7 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '7_MON': {
      title: `7 in Wealth Potential — The Chariot`,
      tagline: `A Design of the Visible Trajectory`,
      mastery: `Your income thrives when your career has genuine forward motion you control.`,
      shadow: `You stay in a role with no real trajectory, generating burnout even when the workload is manageable.`,
      invitation: `Seek or build one visible professional trajectory today that you're actually steering.`,
    },

    // ── 8 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '8_MON': {
      title: `8 in Wealth Potential — Justice`,
      tagline: `A Design of the Rewarded Honesty`,
      mastery: `Your income thrives in roles where integrity is actually rewarded, not just expected.`,
      shadow: `You stay in environments where your honesty goes financially unrewarded, even punished.`,
      invitation: `Seek out or build one environment today that actually rewards fairness.`,
    },

    // ── 9 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '9_MON': {
      title: `9 in Wealth Potential — The Hermit`,
      tagline: `A Design of the Offered Mastery`,
      mastery: `Your income thrives in roles that convert solitary mastery into a valuable, sought-after skill.`,
      shadow: `You stay so independent that your expertise never gets marketed or made visible enough to pay for.`,
      invitation: `Publish, price, or put forward one piece of your specialized expertise today.`,
    },

    // ── 10 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '10_MON': {
      title: `10 in Wealth Potential — Wheel of Fortune`,
      tagline: `A Design of the Built Flexibility`,
      mastery: `You thrive financially when your career has room to change shape as circumstances turn.`,
      shadow: `You stay locked into a rigid career path out of fear of the instability that change might bring.`,
      invitation: `Build one piece of real flexibility today into your career or income streams.`,
    },

    // ── 11 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '11_MON': {
      title: `11 in Wealth Potential — Strength`,
      tagline: `A Design of Counted Presence`,
      mastery: `Your income thrives where your charisma is the actual asset being paid for.`,
      shadow: `You burn that same energy in rooms and roles that don't actually pay for it, performing for free.`,
      invitation: `Name your charisma today as the explicit center of one professional offer.`,
    },

    // ── 12 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '12_MON': {
      title: `12 in Wealth Potential — The Hanged Man`,
      tagline: `A Design of the Committed Practice`,
      mastery: `Your income thrives in roles built around patient, sustained service to people in genuine difficulty.`,
      shadow: `You stay suspended in the idea of that service without ever committing to the training it demands.`,
      invitation: `Take one modest, real step today into actual professional training or practice.`,
    },

    // ── 13 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '13_MON': {
      title: `13 in Wealth Potential — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You thrive financially in fields that reward genuine professional reinvention.`,
      shadow: `You cling to a professional identity that's already run its course, out of fear of the gap.`,
      invitation: `Release one completed professional identity today, deliberately, on your own terms.`,
    },

    // ── 14 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '14_MON': {
      title: `14 in Wealth Potential — Temperance`,
      tagline: `A Design of the Marketable Blend`,
      mastery: `Your income thrives when allowed to synthesize skills or fields other people keep siloed.`,
      shadow: `You spread across so many skills that none develops enough depth to actually be paid for.`,
      invitation: `Go deep today on one or two of your combined skills instead of staying broadly competent at everything.`,
    },

    // ── 15 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '15_MON': {
      title: `15 in Wealth Potential — The Devil`,
      tagline: `A Design of Clean Leverage`,
      mastery: `You thrive financially in roles that engage directly and honestly with material power.`,
      shadow: `You use that understanding to grip control over colleagues or resources rather than serve a transaction.`,
      invitation: `Use your honest read on material power today in service of one genuinely good deal.`,
    },

    // ── 16 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '16_MON': {
      title: `16 in Wealth Potential — The Tower`,
      tagline: `A Design of Precise Disruption`,
      mastery: `You thrive financially in roles that value the ability to see a failing structure clearly and reorganize fast.`,
      shadow: `You generate unnecessary disruption to feel financially useful, provoking crises in stable systems.`,
      invitation: `Save your clarity today for one structure that genuinely needs reorganizing.`,
    },

    // ── 18 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '18_MON': {
      title: `18 in Wealth Potential — The Moon`,
      tagline: `A Design of the Grounded Hunch`,
      mastery: `Your income thrives in roles that draw on intuitive, emotionally attuned insight.`,
      shadow: `You stay in unstable, ungrounded professional territory because the gift never gets paired with concrete structure.`,
      invitation: `Pair your intuitive gift today with one concrete offering or defined process.`,
    },

    // ── 19 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '19_MON': {
      title: `19 in Wealth Potential — The Sun`,
      tagline: `A Design of Priced Joy`,
      mastery: `Your income thrives in work where your natural personality is actually the asset.`,
      shadow: `You undervalue work that comes easily and joyfully, assuming real value requires more struggle.`,
      invitation: `Price one piece of easy, joyful work today honestly, without discounting it.`,
    },

    // ── 20 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '20_MON': {
      title: `20 in Wealth Potential — Judgement`,
      tagline: `A Design of the Answered Call`,
      mastery: `You thrive financially once you actually answer a genuine vocational calling.`,
      shadow: `You spend years preparing to answer it, staying in the adequate-but-outgrown role.`,
      invitation: `Take one real step today toward the calling, before you feel fully ready.`,
    },

    // ── 21 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '21_MON': {
      title: `21 in Wealth Potential — The World`,
      tagline: `A Design of the Crossed Border`,
      mastery: `Your wealth potential opens up specifically through global reach.`,
      shadow: `You stay confined to a local or narrowly-scoped version of your field long after your capacity has outgrown it.`,
      invitation: `Let one part of your work today deliberately cross a border — a client, a platform, a market.`,
    },

    // ── 22 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '22_MON': {
      title: `22 in Wealth Potential — The Fool`,
      tagline: `A Design of the Reflected Leap`,
      mastery: `You thrive financially in careers that reward genuine courage — starting without certainty.`,
      shadow: `You repeat the same fresh professional start without absorbing what the last one taught you.`,
      invitation: `Carry one concrete lesson today from your last leap into whatever comes next.`,
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
      mastery: `You inherited an orientation toward real material mastery — building all the way to genuine completion, not just partial success.`,
      shadow: `You inherit a perfectionism where nothing counts as built until totally finished, leaving your material life feeling permanently one stage short of secure.`,
      invitation: `Let one piece of material progress count as done today, even though it's not total.`,
    },

    // ── 1 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '1_H': {
      title: `1 in Paternal Material — The Magician`,
      tagline: `A Design of Accepted Help`,
      mastery: `You carry real capacity to build material security from nothing, through sheer resourcefulness.`,
      shadow: `You inherit the expectation of total self-reliance, so needing material help feels like personal failure.`,
      invitation: `Accept one piece of material help today instead of building it entirely alone.`,
    },

    // ── 2 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '2_H': {
      title: `2 in Paternal Material — The High Priestess`,
      tagline: `A Design of the Open Decision`,
      mastery: `You carry real intuitive capacity for material judgment and financial decisions.`,
      shadow: `You make major material decisions in total isolation, even when transparency would genuinely help.`,
      invitation: `Bring one financial decision into the open today, before finalizing it.`,
    },

    // ── 3 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '3_H': {
      title: `3 in Paternal Material — The Empress`,
      tagline: `A Design of Received Care`,
      mastery: `You carry real material generosity — capacity to give abundantly as an expression of care.`,
      shadow: `You equate giving with love so completely that receiving material help feels foreign or insufficient.`,
      invitation: `Let someone show you care today in a way that costs you nothing to receive.`,
    },

    // ── 4 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '4_H': {
      title: `4 in Paternal Material — The Emperor`,
      tagline: `A Design of the Own Template`,
      mastery: `You carry real capacity for material leadership and responsible providing.`,
      shadow: `You measure your material life against a rigid, inherited template that was never built for your actual circumstances.`,
      invitation: `Define what responsible providing looks like today, on your own terms, not the inherited one.`,
    },

    // ── 5 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '5_H': {
      title: `5 in Paternal Material — The Hierophant`,
      tagline: `A Design of the Tested Rulebook`,
      mastery: `You carry real, specific knowledge about how work and money actually function.`,
      shadow: `You follow inherited money rules without checking whether the conditions that made them true still apply.`,
      invitation: `Test one inherited money rule today against your actual current circumstances.`,
    },

    // ── 6 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '6_H': {
      title: `6 in Paternal Material — The Lovers`,
      tagline: `A Design of the Own Definition`,
      mastery: `You carry real, values-driven judgment about which material pursuits are genuinely worthwhile.`,
      shadow: `You reject good opportunities because they don't match an inherited, unexamined definition of "worthy work."`,
      invitation: `Reconsider one opportunity today you dismissed on an inherited value filter.`,
    },

    // ── 7 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '7_H': {
      title: `7 in Paternal Material — The Chariot`,
      tagline: `A Design of the Enjoyed Win`,
      mastery: `You carry real material discipline and drive toward provision.`,
      shadow: `You inherit the belief that stopping to enjoy a win counts as material failure, so success never gets to feel like anything.`,
      invitation: `Let one material win be fully enjoyed today, before pushing toward the next goal.`,
    },

    // ── 8 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '8_H': {
      title: `8 in Paternal Material — Justice`,
      tagline: `A Design of Flexible Integrity`,
      mastery: `You carry real material integrity — an honest standard for fair dealing.`,
      shadow: `You apply that standard so rigidly that ordinary negotiation feels like moral compromise, exhausting yourself with vigilance.`,
      invitation: `Let one negotiation today be flexible without treating it as a compromise of your integrity.`,
    },

    // ── 9 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '9_H': {
      title: `9 in Paternal Material — The Hermit`,
      tagline: `A Design of Accepted Support`,
      mastery: `You carry real material self-sufficiency, capable of handling things independently.`,
      shadow: `You inherit the belief that needing material help signals failure, so you never actually let anyone assist.`,
      invitation: `Accept one piece of practical or financial help today, even though you could handle it alone.`,
    },

    // ── 10 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '10_H': {
      title: `10 in Paternal Material — Wheel of Fortune`,
      tagline: `A Design of Tested Timing`,
      mastery: `You carry a real relationship to material timing and cycles.`,
      shadow: `You inherit either fatalism or excessive control around money, without testing which actually fits your own experience.`,
      invitation: `Take one action today that assumes your financial choices genuinely matter.`,
    },

    // ── 11 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '11_H': {
      title: `11 in Paternal Material — Strength`,
      tagline: `A Design of Visible Strain`,
      mastery: `You carry real material resilience — the ability to provide through real hardship.`,
      shadow: `You carry financial stress silently because visible strain feels like failing the provider role.`,
      invitation: `Let one piece of real financial strain be visible to someone you trust today.`,
    },

    // ── 12 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '12_H': {
      title: `12 in Paternal Material — The Hanged Man`,
      tagline: `A Design of the Real Deadline`,
      mastery: `You carry real material patience, willing to hold off on the conventional move for better timing.`,
      shadow: `You stay suspended in "not yet" on a material decision indefinitely, with no deadline attached.`,
      invitation: `Give one material decision a real deadline today instead of waiting indefinitely.`,
    },

    // ── 13 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '13_H': {
      title: `13 in Paternal Material — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You carry real capacity for material reinvention — releasing what's outdated for something that actually fits.`,
      shadow: `You cling to a financially outdated role or strategy because your line modeled endurance over release.`,
      invitation: `Let one outdated material identity or strategy actually end today, deliberately.`,
    },

    // ── 14 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '14_H': {
      title: `14 in Paternal Material — Temperance`,
      tagline: `A Design of the Worthwhile Risk`,
      mastery: `You carry real, sustainable material balance.`,
      shadow: `You inherit such complete moderation that worthwhile material risk feels off-limits, even when it's actually warranted.`,
      invitation: `Let one calculated, worthwhile material risk through today instead of defaulting to caution.`,
    },

    // ── 15 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '15_H': {
      title: `15 in Paternal Material — The Devil`,
      tagline: `A Design of the Named Dynamic`,
      mastery: `You carry a real, honest understanding of material power and leverage.`,
      shadow: `You repeat an inherited power dynamic without examining it — either gripping control or accepting being controlled by default.`,
      invitation: `Name one material power dynamic today you've been repeating without examining it.`,
    },

    // ── 16 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '16_H': {
      title: `16 in Paternal Material — The Tower`,
      tagline: `A Design of the Named Collapse`,
      mastery: `You carry real capacity for material clarity, even through past collapse.`,
      shadow: `You carry a disproportionate financial anxiety whose actual source, an unprocessed collapse, predates your own circumstances.`,
      invitation: `Name today, even speculatively, what happened materially in your father's line that was never discussed.`,
    },

    // ── 17 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '17_H': {
      title: `17 in Paternal Material — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry real capacity for material hope and renewal.`,
      shadow: `You cap your own material ambitions at an inherited, modest ceiling, even when your actual circumstances could support more.`,
      invitation: `Let one material dream be fully-sized today, with no inherited discount applied.`,
    },

    // ── 18 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '18_H': {
      title: `18 in Paternal Material — The Moon`,
      tagline: `A Design of the Traced Worry`,
      mastery: `You carry real material sensitivity — the ability to sense financial risk or opportunity early.`,
      shadow: `You carry diffuse financial anxiety that doesn't attach to your actual current circumstances.`,
      invitation: `Trace one money worry back today, even speculatively, and give it an actual name.`,
    },

    // ── 19 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '19_H': {
      title: `19 in Paternal Material — The Sun`,
      tagline: `A Design of Genuine Lightness`,
      mastery: `You carry real capacity for a joyful, light relationship to material life.`,
      shadow: `You treat money matters with more grim seriousness than they actually require, because that's the tone you inherited.`,
      invitation: `Make one material decision today with genuine lightness, no extra gravity attached.`,
    },

    // ── 20 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '20_H': {
      title: `20 in Paternal Material — Judgement`,
      tagline: `A Design of the Answered Call`,
      mastery: `You carry real capacity to answer a bigger material calling.`,
      shadow: `You inherit the postponement itself — sensing your own bigger potential and hesitating the same way your line always did.`,
      invitation: `Take one real step today toward the material potential you've been sensing but not pursuing.`,
    },

    // ── 22 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '22_H': {
      title: `22 in Paternal Material — The Fool`,
      tagline: `A Design of the Reassessed Risk`,
      mastery: `You carry a real relationship to material trust and risk, capable of leaping without a total guarantee.`,
      shadow: `You default to an inherited calibration of "too much" risk that may not actually fit your real circumstances.`,
      invitation: `Reassess one material risk today with your own eyes, not the inherited caution.`,
    },

    // ── 7 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '7_I': {
      title: `7 in Maternal Material — The Chariot`,
      tagline: `A Design of Shared Steering`,
      mastery: `You carry real material resourcefulness and directed determination, keeping the practical vehicle of your life moving under difficult conditions.`,
      shadow: `You inherit the belief that the only way to keep it moving is to drive it entirely alone, so real support goes reflexively refused.`,
      invitation: `Let one material task today — a bill, a decision, a piece of the load — be shared instead of solely carried.`,
    },

    // ── 1 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '1_I': {
      title: `1 in Maternal Material — The Magician`,
      tagline: `A Design of Full Materials`,
      mastery: `You carry real capability for resourceful improvisation, generating material results from modest means.`,
      shadow: `You inherit a habit of making do so consistently that asking for adequate support feels like admitting failure.`,
      invitation: `Ask for one adequate resource today before you're forced to improvise around its absence.`,
    },

    // ── 2 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '2_I': {
      title: `2 in Maternal Material — The High Priestess`,
      tagline: `A Design of the Shared Instinct`,
      mastery: `You carry real, intuitive practical management — a felt sense of what's needed ahead of any obvious sign.`,
      shadow: `You manage material matters quietly and alone, even when sharing the reasoning would genuinely help.`,
      invitation: `Voice one practical instinct out loud today before acting on it, instead of only announcing the result.`,
    },

    // ── 3 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '3_I': {
      title: `3 in Maternal Material — The Empress`,
      tagline: `A Design of Received Tending`,
      mastery: `You carry real material nurturing — meeting practical needs for everyone around you.`,
      shadow: `You provide for others' practical needs so automatically that your own go unnoticed, even by you.`,
      invitation: `Let one of your own material needs be tended today, as visibly as you tend everyone else's.`,
    },

    // ── 4 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '4_I': {
      title: `4 in Maternal Material — The Emperor`,
      tagline: `A Design of Named Authority`,
      mastery: `You carry real material organizational authority, holding the practical structure of a household or family together.`,
      shadow: `You carry that weight unacknowledged, including by yourself, because it was never framed as leadership.`,
      invitation: `Name your organizational role today, out loud, to yourself, as the real authority it actually is.`,
    },

    // ── 5 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '5_I': {
      title: `5 in Maternal Material — The Hierophant`,
      tagline: `A Design of Named Expertise`,
      mastery: `You carry real, embedded practical wisdom — skills passed down through doing rather than teaching.`,
      shadow: `You dismiss your own practical capability as "just common sense" because no one ever certified it.`,
      invitation: `Name one untaught skill of yours today as the real expertise it actually is.`,
    },

    // ── 6 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '6_I': {
      title: `6 in Maternal Material — The Lovers`,
      tagline: `A Design of Chosen Priority`,
      mastery: `You carry a real, values-driven sense of what genuinely matters materially.`,
      shadow: `You default to the same material allocations because that's the pattern you watched, not because you've consciously chosen it.`,
      invitation: `Name today the one material priority you actually watched get modeled, and decide if it's genuinely yours.`,
    },

    // ── 8 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '8_I': {
      title: `8 in Maternal Material — Justice`,
      tagline: `A Design of the Included Share`,
      mastery: `You carry a real, careful sense of equitable material distribution.`,
      shadow: `You apply that fairness so rigidly to others that you consistently leave yourself off your own accounting.`,
      invitation: `Include yourself today in one fair share you'd normally give away first.`,
    },

    // ── 9 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '9_I': {
      title: `9 in Maternal Material — The Hermit`,
      tagline: `A Design of Accompanied Competence`,
      mastery: `You carry real practical self-sufficiency, handling material needs independently.`,
      shadow: `You refuse material help even when your actual circumstances no longer demand total independence.`,
      invitation: `Let one material task today be witnessed or shared, instead of handled alone by default.`,
    },

    // ── 10 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '10_I': {
      title: `10 in Maternal Material — Wheel of Fortune`,
      tagline: `A Design of Received Stability`,
      mastery: `You carry real material resilience, weathering financial instability without being undone by it.`,
      shadow: `You stay braced for the next downturn even during periods of genuine security, unable to relax into good fortune.`,
      invitation: `Let yourself actually trust one piece of current material stability today, instead of bracing for its end.`,
    },

    // ── 11 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '11_I': {
      title: `11 in Maternal Material — Strength`,
      tagline: `A Design of Named Softness`,
      mastery: `You carry real, gentle material endurance — resilience that never needed to look fierce.`,
      shadow: `You mistake your own steadiness for fragility because it doesn't look like conventional toughness.`,
      invitation: `Name your gentle endurance today as the real strength it is, to yourself, out loud.`,
    },

    // ── 12 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '12_I': {
      title: `12 in Maternal Material — The Hanged Man`,
      tagline: `A Design of the Small Push`,
      mastery: `You carry real material patience, trusting circumstances to shift even without a clear timeline.`,
      shadow: `You stay suspended in old waiting out of habit, even once new options have actually become available.`,
      invitation: `Give one stuck material situation today the small push it's actually ready for.`,
    },

    // ── 13 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '13_I': {
      title: `13 in Maternal Material — Transformation`,
      tagline: `A Design of Early Renovation`,
      mastery: `You carry real capacity for material rebuilding, reconstructing a practical life after genuine loss.`,
      shadow: `You treat repeated collapse as simply normal, instead of something worth actively preventing.`,
      invitation: `Renovate or secure one thing today that's still standing, before it needs rebuilding.`,
    },

    // ── 14 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '14_I': {
      title: `14 in Maternal Material — Temperance`,
      tagline: `A Design of Unstretched Margin`,
      mastery: `You carry a real skill for stretching limited resources to cover genuine needs.`,
      shadow: `You keep stretching resources that don't need stretching anymore, stuck in old scarcity-mode habits.`,
      invitation: `Let your actual current resources, not the old scarcity habit, decide one spending choice today.`,
    },

    // ── 15 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '15_I': {
      title: `15 in Maternal Material — The Devil`,
      tagline: `A Design of the Named Dependence`,
      mastery: `You carry a real, complicated relationship to material dependence, whichever direction it runs.`,
      shadow: `You repeat the inherited dynamic without examining it — accepting unwanted dependence, or resisting genuinely helpful support.`,
      invitation: `Name the specific dependence dynamic you inherited today, and decide what healthy interdependence actually looks like now.`,
    },

    // ── 16 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '16_I': {
      title: `16 in Maternal Material — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real material resilience, having survived a financial or practical collapse.`,
      shadow: `You carry disproportionate anxiety around material stability that doesn't match your own current situation.`,
      invitation: `Ask today, even speculatively, what material collapse in your mother's line was never fully discussed.`,
    },

    // ── 17 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '17_I': {
      title: `17 in Maternal Material — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry real material hope, capacity for genuine renewal even after hard circumstances.`,
      shadow: `You pre-emptively scale down your material aspirations to a modest ceiling that no longer fits your actual circumstances.`,
      invitation: `Let one material hope be named today at its full, untrimmed size.`,
    },

    // ── 18 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '18_I': {
      title: `18 in Maternal Material — The Moon`,
      tagline: `A Design of the Distinguished Worry`,
      mastery: `You carry real material sensitivity, a felt attunement to financial risk.`,
      shadow: `You carry diffuse material anxiety that doesn't clearly attach to your own current circumstances.`,
      invitation: `Distinguish today which piece of your financial worry is genuinely yours versus simply absorbed.`,
    },

    // ── 19 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '19_I': {
      title: `19 in Maternal Material — The Sun`,
      tagline: `A Design of Honest Warmth`,
      mastery: `You carry real, resilient warmth, maintaining vitality and joy even through material difficulty.`,
      shadow: `You perform positivity through real financial strain instead of naming the difficulty directly.`,
      invitation: `Name one material difficulty directly today, without covering it with performed warmth.`,
    },

    // ── 20 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '20_I': {
      title: `20 in Maternal Material — Judgement`,
      tagline: `A Design of the Claimed Potential`,
      mastery: `You carry real material potential, capability sensed but historically unclaimed by circumstance.`,
      shadow: `You inherit the postponement itself, holding back on real potential the same way, without examining why.`,
      invitation: `Take one real step today toward the material potential your circumstances would actually now allow.`,
    },

    // ── 21 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '21_I': {
      title: `21 in Maternal Material — The World`,
      tagline: `A Design of Current Enoughness`,
      mastery: `You carry a real, settled sense of material sufficiency, contentment achievable without excess.`,
      shadow: `You settle for less than what's actually available now because "enough" was calibrated to circumstances that no longer apply.`,
      invitation: `Recount today, honestly, what you already have that qualifies as enough right now.`,
    },

    // ── 22 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '22_I': {
      title: `22 in Maternal Material — The Fool`,
      tagline: `A Design of the Chosen Leap`,
      mastery: `You carry real material courage, taking practical chances when circumstances demand it.`,
      shadow: `You take risks reactively out of old urgency, rather than choosing them deliberately from actual stability.`,
      invitation: `Meet one mattering moment today by genuine, deliberate choice rather than inherited urgency.`,
    },

    // ── 1 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '1_MK': {
      title: `1 in Material Karma — The Magician`,
      tagline: `A Design of the Matured Plan`,
      mastery: `You carry a genuine gift for origination — starting something financial from nothing, again and again.`,
      shadow: `You mistake the next fresh start for progress, resetting your position right before it would have compounded.`,
      invitation: `Choose today the material plan already underway, and don't start a new one until it's had real time to mature.`,
    },

    // ── 2 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '2_MK': {
      title: `2 in Material Karma — The High Priestess`,
      tagline: `A Design of the Seen Numbers`,
      mastery: `You carry a quiet, private sense for your own financial reality.`,
      shadow: `You keep the real numbers unexamined even by yourself, sensed but never looked at directly.`,
      invitation: `Write down your actual financial numbers today, in full, and let them be seen.`,
    },

    // ── 3 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '3_MK': {
      title: `3 in Material Karma — The Empress`,
      tagline: `A Design of the Included Reserve`,
      mastery: `You carry real warmth expressed through material generosity, resources shared freely.`,
      shadow: `That generosity flows outward while your own reserve stays thin and unattended.`,
      invitation: `Set aside a portion of any material gain today for your own security first.`,
    },

    // ── 4 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '4_MK': {
      title: `4 in Material Karma — The Emperor`,
      tagline: `A Design of the Tested Structure`,
      mastery: `You carry a real, firm hand over every financial detail.`,
      shadow: `Delegating or trusting a system you didn't build yourself feels like real danger rather than a reasonable option.`,
      invitation: `Hand one specific piece of financial management today to a trusted system or person, and observe whether it holds.`,
    },

    // ── 5 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '5_MK': {
      title: `5 in Material Karma — The Hierophant`,
      tagline: `A Design of the Tested Belief`,
      mastery: `You carry a real deference to inherited financial rules and tradition.`,
      shadow: `You follow an outdated financial rule simply because it's familiar, even when it works against your actual security.`,
      invitation: `Name one inherited belief about money today, and test it against your current, actual circumstances.`,
    },

    // ── 6 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '6_MK': {
      title: `6 in Material Karma — The Lovers`,
      tagline: `A Design of the Standing Choice`,
      mastery: `You carry a real capacity to weigh a genuine financial choice.`,
      shadow: `You defer the choice that would actually serve your security in favor of whatever keeps things comfortable.`,
      invitation: `Make one specific, deferred financial decision today, even without full certainty, and let it stand.`,
    },

    // ── 7 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '7_MK': {
      title: `7 in Material Karma — The Chariot`,
      tagline: `A Design of the Named Enough`,
      mastery: `You carry real drive toward financial goals, one after another.`,
      shadow: `The sense of "enough" always sits just past the next milestone, so genuine progress never registers as progress.`,
      invitation: `Name one specific financial milestone today as "enough," and pause there deliberately once reached.`,
    },

    // ── 8 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '8_MK': {
      title: `8 in Material Karma — Justice`,
      tagline: `A Design of the Named Unfairness`,
      mastery: `You carry a real, sharp vigilance around fairness in financial exchange.`,
      shadow: `You treat every current exchange as a potential repeat of an old unfairness that has nothing to do with what's actually happening now.`,
      invitation: `Name, specifically, what the original financial unfairness was today, and separate it from what's actually in front of you.`,
    },

    // ── 9 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '9_MK': {
      title: `9 in Material Karma — The Hermit`,
      tagline: `A Design of the Direct Look`,
      mastery: `You carry a real preference for withdrawing from financial engagement, retreating rather than confronting it head-on.`,
      shadow: `Unexamined finances drift, and the avoidance that once felt like peace becomes its own quiet stress.`,
      invitation: `Set aside one specific, limited block of time today to look directly at your actual financial state.`,
    },

    // ── 10 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '10_MK': {
      title: `10 in Material Karma — Wheel of Fortune`,
      tagline: `A Design of the Steady Habit`,
      mastery: `You carry real financial cycles — genuine upswings and downturns rather than something steady.`,
      shadow: `You treat every upswing as permanent and every downturn as catastrophic, letting the cycle run the decisions.`,
      invitation: `Build one small, consistent financial habit today that holds steady regardless of which phase you're in.`,
    },

    // ── 11 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '11_MK': {
      title: `11 in Material Karma — Strength`,
      tagline: `A Design of the Spoken Strain`,
      mastery: `You carry real financial hardship quietly, managed alone with genuine endurance.`,
      shadow: `That strain never gets addressed, since no one close to you knows the real extent of it.`,
      invitation: `Name your actual financial strain out loud today to one trusted person.`,
    },

    // ── 12 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '12_MK': {
      title: `12 in Material Karma — The Hanged Man`,
      tagline: `A Design of the Real Deadline`,
      mastery: `You carry a real financial decision left in self-imposed limbo, waiting for clarity.`,
      shadow: `Material comfort gets quietly sacrificed while the wait mistakes itself for necessary patience.`,
      invitation: `Name the specific financial decision that's been suspended today, and set a real point by which it gets made.`,
    },

    // ── 13 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '13_MK': {
      title: `13 in Material Karma — Transformation`,
      tagline: `A Design of the Deliberate Ending`,
      mastery: `You carry a real fear of material loss, resisting endings even when they're clearly due.`,
      shadow: `You hold onto a financial arrangement well past its useful life simply because ending it feels dangerous.`,
      invitation: `Identify one financial arrangement today that's clearly run its course, and let it end deliberately.`,
    },

    // ── 14 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '14_MK': {
      title: `14 in Material Karma — Temperance`,
      tagline: `A Design of the Sustainable Middle`,
      mastery: `You carry a real pattern of strict financial discipline followed by full release.`,
      shadow: `Neither extreme held alone ever actually produces lasting security, restriction breaking into release and back.`,
      invitation: `Choose one small, moderate financial habit today and hold it consistently, resisting either extreme.`,
    },

    // ── 15 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '15_MK': {
      title: `15 in Material Karma — The Devil`,
      tagline: `A Design of the Loosened Bind`,
      mastery: `You carry a real, felt sense of being bound to financial obligations or a particular lifestyle.`,
      shadow: `You mistake that compulsive attachment for a fixed reality, when it may actually be an unquestioned pattern.`,
      invitation: `Name honestly today one specific material attachment that feels like a trap, and ask what it would take to loosen it.`,
    },

    // ── 16 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '16_MK': {
      title: `16 in Material Karma — The Tower`,
      tagline: `A Design of the Early Correction`,
      mastery: `You carry real instability quietly maintained as "fine" until a sudden reckoning forces the issue.`,
      shadow: `Maintaining the appearance of stability instead of addressing the strain underneath sets up exactly the collapse the denial tried to avoid.`,
      invitation: `Identify one financial strain being minimized today, and address it directly.`,
    },

    // ── 17 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '17_MK': {
      title: `17 in Material Karma — The Star`,
      tagline: `A Design of the Acted Hope`,
      mastery: `You carry a genuine, sustaining belief that things will get better financially.`,
      shadow: `That hope hasn't yet converted into the concrete action it was meant to inspire.`,
      invitation: `Name one small, concrete action your financial hope is actually pointing toward today, and take it.`,
    },

    // ── 18 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '18_MK': {
      title: `18 in Material Karma — The Moon`,
      tagline: `A Design of the Cleared Haze`,
      mastery: `You carry a real, felt sense of your financial position, sensed more than examined.`,
      shadow: `The anxiety persists precisely because it's never actually checked against real numbers.`,
      invitation: `Look directly today at one specific, avoided financial number, and let the actual figure replace the guess.`,
    },

    // ── 19 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '19_MK': {
      title: `19 in Material Karma — The Sun`,
      tagline: `A Design of Visible Uncertainty`,
      mastery: `You carry a real, outward financial confidence maintained consistently.`,
      shadow: `That performed confidence prevents anyone, including you, from actually addressing the uncertainty underneath.`,
      invitation: `Let one specific financial worry be visible today to someone trustworthy.`,
    },

    // ── 20 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '20_MK': {
      title: `20 in Material Karma — Judgement`,
      tagline: `A Design of the First Move`,
      mastery: `You carry a genuine financial truth that's already become clear.`,
      shadow: `You meet that clarity with more preparation and waiting, one more condition before it's actually faced.`,
      invitation: `Name the specific action your financial clarity is already calling for today, and take a first concrete step.`,
    },

    // ── 21 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '21_MK': {
      title: `21 in Material Karma — The World`,
      tagline: `A Design of the Named Complete`,
      mastery: `You carry real financial goals reached in practical terms.`,
      shadow: `You immediately relativize the reached goal, expanding it or setting a new condition before it counts as done.`,
      invitation: `Identify one financial goal today that's practically already reached, and deliberately name it complete.`,
    },

    // ── 22 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '22_MK': {
      title: `22 in Material Karma — The Fool`,
      tagline: `A Design of the Woven Net`,
      mastery: `You carry genuine openness to material risk, acted on with real courage.`,
      shadow: `You leap before the groundwork that would make the risk sustainable has actually been laid.`,
      invitation: `Build one small piece of safety net today before your next financial leap.`,
    },

    // ── 1 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '1_RWM': {
      title: `1 in Relationship with Money — The Magician`,
      tagline: `A Design of the Kept Gift`,
      mastery: `You initiate income actively — earning feels legitimate, deserved, and real.`,
      shadow: `You minimize genuinely available resources because only self-generated money feels legitimate to hold onto.`,
      invitation: `Accept one piece of unearned financial ease today without justifying it through extra effort.`,
    },

    // ── 2 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '2_RWM': {
      title: `2 in Relationship with Money — The High Priestess`,
      tagline: `A Design of the Named Price`,
      mastery: `You carry a real, quiet sense for when a financial opportunity is right.`,
      shadow: `You leave that insight unclaimed and uncompensated, sensed but never stated aloud.`,
      invitation: `State one specific price or value out loud today.`,
    },

    // ── 3 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '3_RWM': {
      title: `3 in Relationship with Money — The Empress`,
      tagline: `A Design of Pleasurable Saving`,
      mastery: `You spend with real ease on comfort, beauty, and care for yourself and others.`,
      shadow: `Your generosity moves freely outward while your own reserve stays thin.`,
      invitation: `Set aside one specific portion of income today for your own future.`,
    },

    // ── 4 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '4_RWM': {
      title: `4 in Relationship with Money — The Emperor`,
      tagline: `A Design of Tested Delegation`,
      mastery: `You build and defend real financial structure, a firm hand on every account.`,
      shadow: `You can't imagine your money being fine without your constant oversight.`,
      invitation: `Hand one small piece of financial management today to a system or person you trust.`,
    },

    // ── 5 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '5_RWM': {
      title: `5 in Relationship with Money — The Hierophant`,
      tagline: `A Design of the Tested Rule`,
      mastery: `You check financial choices against a real sense of proper, sanctioned tradition.`,
      shadow: `You pass up genuinely good opportunities simply because they don't match an inherited "right way."`,
      invitation: `Name one inherited money rule today and test whether it reflects your own values.`,
    },

    // ── 6 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '6_RWM': {
      title: `6 in Relationship with Money — The Lovers`,
      tagline: `A Design of the Weighed Want`,
      mastery: `Your financial choices are genuinely relational, considering what a partner would think or need.`,
      shadow: `Your own financial preference gets perpetually deferred to someone else's.`,
      invitation: `Make one financial decision today based purely on your own preference.`,
    },

    // ── 7 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '7_RWM': {
      title: `7 in Relationship with Money — The Chariot`,
      tagline: `A Design of the Registered Milestone`,
      mastery: `You carry real ambition and momentum toward the next financial target.`,
      shadow: `Money earned never actually gets to feel earned, chased past before it's acknowledged.`,
      invitation: `Pause today after one financial milestone, long enough to actually register it.`,
    },

    // ── 8 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '8_RWM': {
      title: `8 in Relationship with Money — Justice`,
      tagline: `A Design of the Closed Account`,
      mastery: `You carry a sharp, real orientation toward financial fairness and precision.`,
      shadow: `Your mental ledger never fully closes, small imbalances tracked long after they'd naturally resolve.`,
      invitation: `Consciously close one old financial account today that you're still mentally tracking.`,
    },

    // ── 9 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '9_RWM': {
      title: `9 in Relationship with Money — The Hermit`,
      tagline: `A Design of the Accepted Partnership`,
      mastery: `You carry real self-sufficiency, earning and managing money independently.`,
      shadow: `You undercharge or under-earn specifically to avoid the discomfort of financial interdependence.`,
      invitation: `Ask for one specific piece of financial help or partnership today.`,
    },

    // ── 10 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '10_RWM': {
      title: `10 in Relationship with Money — Wheel of Fortune`,
      tagline: `A Design of the Trusted Cycle`,
      mastery: `Your financial rhythm is genuinely cyclical, feast and famine, surge and recede.`,
      shadow: `You unconsciously undermine steady income because the wave pattern feels more familiar than stability.`,
      invitation: `Protect one steady income source today through its full cycle, without disrupting it.`,
    },

    // ── 11 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '11_RWM': {
      title: `11 in Relationship with Money — Strength`,
      tagline: `A Design of the Named Need`,
      mastery: `You carry real capacity to earn, support, and provide financially for others.`,
      shadow: `That giving becomes depleting because it's never balanced by asking for the same in return.`,
      invitation: `Name one specific financial need out loud today to someone capable of helping.`,
    },

    // ── 12 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '12_RWM': {
      title: `12 in Relationship with Money — The Hanged Man`,
      tagline: `A Design of the Ended Denial`,
      mastery: `You carry a real instinct to withhold financial comfort from yourself out of quiet discipline.`,
      shadow: `That denial outlives whatever it was originally protecting, well past the point of serving anything.`,
      invitation: `Spend, deliberately and without justification, on one thing for your own comfort today.`,
    },

    // ── 13 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '13_RWM': {
      title: `13 in Relationship with Money — The Death`,
      tagline: `A Design of the Small Adjustment`,
      mastery: `Your financial shifts arrive as complete, real overhauls rather than gradual change.`,
      shadow: `You skip smaller, earlier course-corrections in favor of waiting for the dramatic reset.`,
      invitation: `Make one small, incremental financial adjustment today, rather than waiting for a forced overhaul.`,
    },

    // ── 14 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '14_RWM': {
      title: `14 in Relationship with Money — Temperance`,
      tagline: `A Design of the Chosen Middle`,
      mastery: `You carry a real, steady financial equilibrium when centered.`,
      shadow: `You swing into strict restriction or full indulgence the moment real stress enters.`,
      invitation: `Notice today the moment stress pulls your spending toward an extreme, and choose the steadier response.`,
    },

    // ── 15 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '15_RWM': {
      title: `15 in Relationship with Money — The Devil`,
      tagline: `A Design of the Honest Habit`,
      mastery: `You carry a real capacity to notice a specific financial compulsion running on autopilot.`,
      shadow: `You mistake that compulsive habit for simply how things are, never actually examined.`,
      invitation: `Name one compulsive financial habit honestly today, and ask what would happen if you loosened it.`,
    },

    // ── 16 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '16_RWM': {
      title: `16 in Relationship with Money — The Tower`,
      tagline: `A Design of the Early Signal`,
      mastery: `You carry a real instinct to maintain financial stability under pressure.`,
      shadow: `You maintain the appearance of stability instead of addressing the strain underneath, until it forces a sudden reversal.`,
      invitation: `Identify one financial strain being minimized today, and address it directly.`,
    },

    // ── 17 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '17_RWM': {
      title: `17 in Relationship with Money — The Star`,
      tagline: `A Design of the Attended Corner`,
      mastery: `You carry real ease turning creative or inspired work into income.`,
      shadow: `You hope other financial areas will simply improve on their own, without direct action.`,
      invitation: `Name one financial area you've been hoping will improve today, and take one concrete action toward it.`,
    },

    // ── 18 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '18_RWM': {
      title: `18 in Relationship with Money — The Moon`,
      tagline: `A Design of the Checked Number`,
      mastery: `You carry a real, felt sensitivity about your financial state.`,
      shadow: `Your financial anxiety runs ahead of the actual facts, more intense than the numbers would justify.`,
      invitation: `Look directly today at one specific, avoided financial number.`,
    },

    // ── 19 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '19_RWM': {
      title: `19 in Relationship with Money — The Sun`,
      tagline: `A Design of the Visible Worry`,
      mastery: `You carry a real, radiant ease around money, maintained even under real uncertainty.`,
      shadow: `That consistent brightness prevents anyone, including you, from actually addressing what's uncertain.`,
      invitation: `Let one specific financial worry be visible today to someone trustworthy.`,
    },

    // ── 20 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '20_RWM': {
      title: `20 in Relationship with Money — Judgement`,
      tagline: `A Design of the Early Wake-Up`,
      mastery: `You eventually face financial truths fully and honestly.`,
      shadow: `That clarity arrives well after the signs pointing toward it first appeared.`,
      invitation: `Act today on one current financial sign, before it forces a full reckoning.`,
    },

    // ── 21 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '21_RWM': {
      title: `21 in Relationship with Money — The World`,
      tagline: `A Design of the Counted Win`,
      mastery: `You measure real financial progress against a comprehensive, ideal version of success.`,
      shadow: `Real, current success never gets to feel like success because the bigger picture hasn't arrived yet.`,
      invitation: `Name one financial win today that's genuinely real, and let it count as complete on its own terms.`,
    },

    // ── 22 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '22_RWM': {
      title: `22 in Relationship with Money — The Fool`,
      tagline: `A Design of the Backed Trust`,
      mastery: `You carry a real, spontaneous openness to financial risk and a genuine belief things will work out.`,
      shadow: `You ask trust alone to do the work planning was meant to do, leaving the landing to chance.`,
      invitation: `Pair your next financial risk today with one small, concrete piece of preparation.`,
    },

    // ── 1 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '1_MEP': {
      title: `1 in Money Entry Point — The Magician`,
      tagline: `A Design of the Sustained Launch`,
      mastery: `You carry a genuine, well-practiced competence at starting ventures from scratch.`,
      shadow: `You initiate a promising venture and move to the next before this one has actually paid off.`,
      invitation: `Choose one current professional venture today, and deliberately stay with it past the exciting starting phase.`,
    },

    // ── 2 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '2_MEP': {
      title: `2 in Money Entry Point — The High Priestess`,
      tagline: `A Design of the Named Edge`,
      mastery: `You carry a genuine, well-practiced competence in intuitive, discerning work.`,
      shadow: `You hold that insight back rather than offering it plainly, letting a marketable skill stay private and uncompensated.`,
      invitation: `Offer your intuitive read today directly and explicitly in one professional context.`,
    },

    // ── 3 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '3_MEP': {
      title: `3 in Money Entry Point — The Empress`,
      tagline: `A Design of the Shared Empire`,
      mastery: `You carry a genuine competence in nurturing and multiplying resources, delegating instead of carrying it all alone.`,
      shadow: `You apply pressure instead of invitation, harshness shutting down the collaboration this abundance depends on.`,
      invitation: `Delegate one task you've been holding onto solely today, and let someone else's contribution count.`,
    },

    // ── 4 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '4_MEP': {
      title: `4 in Money Entry Point — The Emperor`,
      tagline: `A Design of Structure That Holds Cooperation`,
      mastery: `You carry a genuine competence in structure and control, making a system actually hold.`,
      shadow: `That same control turns into pressure on the people inside it until it costs you the cooperation the structure needs.`,
      invitation: `Loosen your grip today on one specific system, and let it hold without your direct pressure.`,
    },

    // ── 5 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '5_MEP': {
      title: `5 in Money Entry Point — The Hierophant`,
      tagline: `A Design of the Handed Lesson`,
      mastery: `You carry a genuine competence in structured, transmittable knowledge.`,
      shadow: `You hold the knowledge back, or let the sharing curdle into preaching instead of teaching.`,
      invitation: `Teach one specific piece of your expertise plainly today, without turning it into a sermon.`,
    },

    // ── 6 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '6_MEP': {
      title: `6 in Money Entry Point — The Lovers`,
      tagline: `A Design of the Received Gift`,
      mastery: `You carry a genuine competence in beauty and connection, earning through real love for the work.`,
      shadow: `You refuse a real opportunity because it doesn't match an invented image, not believing you're worthy of the money.`,
      invitation: `Receive one payment, compliment, or gift today without deflecting it.`,
    },

    // ── 7 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '7_MEP': {
      title: `7 in Money Entry Point — The Chariot`,
      tagline: `A Design of the Named Number`,
      mastery: `You carry a genuine competence in decisive movement toward a real financial number.`,
      shadow: `The same drive that wins goals turns into scheming against whoever's in the way, out-maneuvering instead of leading.`,
      invitation: `Name one specific financial number you're driving toward today, instead of vague ambition.`,
    },

    // ── 8 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '8_MEP': {
      title: `8 in Money Entry Point — Justice`,
      tagline: `A Design of the Named Cause`,
      mastery: `You carry a genuine competence in fairness, built to keep taking and giving in balance.`,
      shadow: `When the balance tips, it registers as being cheated by everyone rather than as a debt you haven't named.`,
      invitation: `Name one specific cause-and-effect chain in your own finances today, not what happened to you.`,
    },

    // ── 9 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '9_MEP': {
      title: `9 in Money Entry Point — The Hermit`,
      tagline: `A Design of Generous Self-Care`,
      mastery: `You carry a genuine competence in analysis and depth built through solitary study.`,
      shadow: `You default to the cheapest option toward yourself even when you can afford better, draining the energy the expertise runs on.`,
      invitation: `Spend on yourself today, once, with the same generosity you'd extend to sharing knowledge.`,
    },

    // ── 10 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '10_MEP': {
      title: `10 in Money Entry Point — Wheel of Fortune`,
      tagline: `A Design of Enjoyed Ease`,
      mastery: `You carry a genuine competence in flow and support, making any team or project actually run.`,
      shadow: `You can't actually relax and enjoy what's already flowing, so the ease never gets to be felt.`,
      invitation: `Take one afternoon today purely for pleasure, with no productive justification attached.`,
    },

    // ── 11 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '11_MEP': {
      title: `11 in Money Entry Point — Strength`,
      tagline: `A Design of the Real Rest Day`,
      mastery: `You carry a genuine competence in tireless, physical strength and endurance.`,
      shadow: `Pressure turns inward into workaholism, striving so hard that nothing else registers until illness forces a stop.`,
      invitation: `Build one real rest day into this week, before your body demands it.`,
    },

    // ── 12 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '12_MEP': {
      title: `12 in Money Entry Point — The Hanged Man`,
      tagline: `A Design of the Named Price`,
      mastery: `You carry a genuine competence in seeing what others miss and caring for people directly.`,
      shadow: `You refuse to actually charge for the work, then resent the lack of appreciation that follows.`,
      invitation: `Name a real price today for one piece of service you've been giving away or undercharging.`,
    },

    // ── 13 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '13_MEP': {
      title: `13 in Money Entry Point — Transformation`,
      tagline: `A Design of the Applied Ending`,
      mastery: `You carry a genuine competence in threshold work, a real comfort with endings most people flinch from.`,
      shadow: `You stay in a role or approach past the point it's teaching you anything, as if change didn't apply to your own career.`,
      invitation: `Name one specific part of your current work that's gone stagnant today, and deliberately change it.`,
    },

    // ── 14 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '14_MEP': {
      title: `14 in Money Entry Point — Temperance`,
      tagline: `A Design of the Honest Heart-Check`,
      mastery: `You carry a genuine competence in intuitive, creative expression that pays when compassion stays part of the work.`,
      shadow: `You drift toward what's safe instead of what your soul actually wants, until the compassion quietly dries up.`,
      invitation: `Ask honestly today whether your heart is actually in one piece of your current work, and act on the answer.`,
    },

    // ── 15 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '15_MEP': {
      title: `15 in Money Entry Point — The Devil`,
      tagline: `A Design of the Clean Path`,
      mastery: `You carry a genuine capacity for significant material power, bringing serious money into your life.`,
      shadow: `Money obtained through deception or broken agreements invites exactly the kind of reversal this energy is known for.`,
      invitation: `Choose the honest path today where it diverges from the easy one, even if it's smaller.`,
    },

    // ── 16 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '16_MEP': {
      title: `16 in Money Entry Point — The Tower`,
      tagline: `A Design of the Given Attention`,
      mastery: `You carry a genuine competence in total transformation, building something genuinely new from the ground up.`,
      shadow: `Wanting wealth becomes the whole focus rather than one part of a fuller life, and that entanglement blocks it.`,
      invitation: `Name one area of your life outside money that's gone neglected today, and give it real attention.`,
    },

    // ── 17 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '17_MEP': {
      title: `17 in Money Entry Point — The Star`,
      tagline: `A Design of the Genuine Compliment`,
      mastery: `You carry a genuine competence in creative visibility, earning both financially and artistically at once.`,
      shadow: `You believe your creativity is the only worthwhile version, and recognition quietly diminishes as a result.`,
      invitation: `Genuinely appreciate one other person's creative work today, out loud, without ranking it against your own.`,
    },

    // ── 18 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '18_MEP': {
      title: `18 in Money Entry Point — The Moon`,
      tagline: `A Design of the Redirected Image`,
      mastery: `You carry a genuine competence in visualization, turning an internal image into something others can feel.`,
      shadow: `A fear of poverty, held tightly, materializes just as easily as a vision can.`,
      invitation: `Name one carried financial fear today, and replace it deliberately with a specific image of what you actually want.`,
    },

    // ── 19 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '19_MEP': {
      title: `19 in Money Entry Point — The Sun`,
      tagline: `A Design of Multiplied Generosity`,
      mastery: `You carry a genuine competence in illuminating people at scale, a flow that increases the more it's shared.`,
      shadow: `Guilt about doing well curdles into hypercontrol over others or a quiet need for pride to be confirmed.`,
      invitation: `Create one real opportunity for someone else today, instead of managing guilt privately.`,
    },

    // ── 20 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '20_MEP': {
      title: `20 in Money Entry Point — Judgement`,
      tagline: `A Design of the Examined Belief`,
      mastery: `You carry a genuine competence in transmission, information passed hand to hand.`,
      shadow: `An unexamined inherited belief about money runs quietly underneath your choices, worsened by judging the parent who gave it.`,
      invitation: `Name one specific belief about money today you can trace to a parent, and ask whether it's actually true for you now.`,
    },

    // ── 21 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '21_MEP': {
      title: `21 in Money Entry Point — The World`,
      tagline: `A Design of the Wide Horizon`,
      mastery: `You carry a genuine competence in scale and reach, earning by setting genuinely significant financial goals.`,
      shadow: `You compromise that reach for a quick income whose real cost contradicts the expansive nature this energy is built for.`,
      invitation: `Name one genuinely large financial goal today, not a modest one, and take one real step toward it.`,
    },

    // ── 22 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '22_MEP': {
      title: `22 in Money Entry Point — The Fool`,
      tagline: `A Design of the Built Floor`,
      mastery: `You carry a genuine competence in financial independence itself, results-based work with no imposed boundaries.`,
      shadow: `You test that freedom constantly without building the passive structure that would actually secure it.`,
      invitation: `Build one small piece of passive income today, however modest.`,
    },

    // ── Career Paths (Money Channel — Best Career Paths For Each Arcana) ──
    '1_CAREER': {
      title: `1 in Career Paths — The Magician`,
      tagline: `A Design of the Invented Role`,
      mastery: `Your career fit runs through initiative and origination — founding, launching, leading from the front.`,
      shadow: `You take a role built around someone else's system, one that gives you nothing to originate.`,
      invitation: `Name one role or venture today where you'd actually be the one starting things, and take a real step toward it.`,
    },

    '2_CAREER': {
      title: `2 in Career Paths — The High Priestess`,
      tagline: `A Design of the Credited Read`,
      mastery: `Your career fit runs through depth and perception — reading what's underneath what's said.`,
      shadow: `You take a role that only rewards visible, provable output, leaving your real gift permanently uncredited.`,
      invitation: `Name one field today where your intuition would actually be the qualification, and research a real path into it.`,
    },

    '3_CAREER': {
      title: `3 in Career Paths — The Empress`,
      tagline: `A Design of the Priced Craft`,
      mastery: `Your career fit runs through generativity and beauty — creating and cultivating as the actual work.`,
      shadow: `You take a role that treats your creative output as a hobby, discounted the moment it feels effortless.`,
      invitation: `Price or pitch one piece of your creative work today as an actual profession, not a side project.`,
    },

    '4_CAREER': {
      title: `4 in Career Paths — The Emperor`,
      tagline: `A Design of the Requested Ownership`,
      mastery: `Your career fit runs through ownership and command — building or running the system, not just staffing it.`,
      shadow: `You take a subordinate role inside someone else's structure, where your capacity for order gets boxed.`,
      invitation: `Name one system today you could actually own, and ask for that ownership directly.`,
    },

    '5_CAREER': {
      title: `5 in Career Paths — The Hierophant`,
      tagline: `A Design of the Real Student`,
      mastery: `Your career fit runs through transmission — passing a system of knowledge forward, not just holding it.`,
      shadow: `You stay a permanent student, collecting credentials in a field that never actually asks you to teach.`,
      invitation: `Teach or mentor one person today in something you already know well.`,
    },

    '6_CAREER': {
      title: `6 in Career Paths — The Lovers`,
      tagline: `A Design of the Whole Job`,
      mastery: `Your career fit runs through relationship — reading and choosing well between people as the actual product.`,
      shadow: `You take a role that treats people as a checklist rather than a relationship, flattening your real skill.`,
      invitation: `Name one role today where people are explicitly the job, and pitch yourself for it.`,
    },

    '7_CAREER': {
      title: `7 in Career Paths — The Chariot`,
      tagline: `A Design of the Visible Destination`,
      mastery: `Your career fit runs through movement and results — getting something, or someone, across a finish line.`,
      shadow: `You end up in a role with no visible destination, drive with nowhere to point turning into restlessness.`,
      invitation: `Name one role today with a visible finish line, and move toward it.`,
    },

    '8_CAREER': {
      title: `8 in Career Paths — Justice`,
      tagline: `A Design of the Paid Integrity`,
      mastery: `Your career fit runs through balance and accountability — accuracy and fairness as the literal job.`,
      shadow: `You end up in a role where fairness is expected but never actually rewarded.`,
      invitation: `Name one field today where integrity is a paid asset, and research a real path into it.`,
    },

    '9_CAREER': {
      title: `9 in Career Paths — The Hermit`,
      tagline: `A Design of the Visible Depth`,
      mastery: `Your career fit runs through specialized mastery — going deep in one area, largely alone.`,
      shadow: `You take a role demanding constant networking and visibility, pulling you from the solitary depth that's your asset.`,
      invitation: `Name one narrow area today you could go deeper in, and one way to make that depth visible.`,
    },

    '10_CAREER': {
      title: `10 in Career Paths — Wheel of Fortune`,
      tagline: `A Design of the Diversified Work`,
      mastery: `Your career fit runs through flexibility — reading and riding a changing situation alongside others.`,
      shadow: `You end up in a rigid, single-track role that punishes exactly the adaptability that's your real strength.`,
      invitation: `Name one part of your work today you could deliberately diversify or make more project-based.`,
    },

    '11_CAREER': {
      title: `11 in Career Paths — Strength`,
      tagline: `A Design of Compensated Presence`,
      mastery: `Your career fit runs through presence — your charisma is the literal asset.`,
      shadow: `You take a background role that asks you to shrink your presence rather than use it.`,
      invitation: `Name one role or platform today where your presence would be the explicit asset, and take a visible step toward it.`,
    },

    '12_CAREER': {
      title: `12 in Career Paths — The Hanged Man`,
      tagline: `A Design of the Right Pace`,
      mastery: `Your career fit runs through sustained service — depth of presence with someone vulnerable over speed.`,
      shadow: `You take a fast-turnaround role that never lets you actually stay with anyone long enough.`,
      invitation: `Name one field of sustained service you're drawn to today, and take one real step toward it.`,
    },

    '13_CAREER': {
      title: `13 in Career Paths — Transformation`,
      tagline: `A Design of the Used Gift`,
      mastery: `Your career fit runs through transformation — guiding an ending into a genuine new beginning.`,
      shadow: `You end up in a role built entirely around maintaining the status quo, where your gift never gets used.`,
      invitation: `Name one field today built around transformation rather than maintenance, and research a real path into it.`,
    },

    '14_CAREER': {
      title: `14 in Career Paths — Temperance`,
      tagline: `A Design of the Named Blend`,
      mastery: `Your career fit runs through integration — combining disparate elements into something whole.`,
      shadow: `You end up forced into a narrowly specialized role that leaves half your actual skill set at the door.`,
      invitation: `Name the two or three skills you keep being told to pick between today, and research a field where they combine.`,
    },

    '15_CAREER': {
      title: `15 in Career Paths — The Devil`,
      tagline: `A Design of the Clean Aim`,
      mastery: `Your career fit runs through material power — understanding what compels people materially and psychologically.`,
      shadow: `That understanding gets used to grip control over people rather than serve a genuine transaction.`,
      invitation: `Name one field today where your read on power and money could serve a genuinely good deal.`,
    },

    '16_CAREER': {
      title: `16 in Career Paths — The Tower`,
      tagline: `A Design of the Proposed Rebuild`,
      mastery: `Your career fit runs through disruption and reconstruction — reorganizing a failing structure.`,
      shadow: `You end up in a role that asks you to patch things quietly rather than actually rebuild them.`,
      invitation: `Name one system today genuinely due for a rebuild, and propose the real fix.`,
    },

    '17_CAREER': {
      title: `17 in Career Paths — The Star`,
      tagline: `A Design of the Released Work`,
      mastery: `Your career fit runs through visible creativity — hope and inspiration shared publicly.`,
      shadow: `You keep the creative work private and unmonetized, waiting to be discovered instead of actively offering it.`,
      invitation: `Publish or pitch one piece of your creative work today at the size it's actually at.`,
    },

    '18_CAREER': {
      title: `18 in Career Paths — The Moon`,
      tagline: `A Design of the Trusted Hunch`,
      mastery: `Your career fit runs through the intuitive and the felt — reading an unspoken undercurrent as the actual skill.`,
      shadow: `You end up in a role that demands hard, provable data first, leaving your real gift sidelined.`,
      invitation: `Name one field today where an intuitive read is the qualification, and research a real path in.`,
    },

    '19_CAREER': {
      title: `19 in Career Paths — The Sun`,
      tagline: `A Design of the Uncostumed Self`,
      mastery: `Your career fit runs through visible warmth — being visibly, genuinely yourself as the asset.`,
      shadow: `You end up in a role that requires a costume, draining the natural ease that makes you good at this.`,
      invitation: `Let more of the real you show today in one part of your work where you're currently performing professionalism.`,
    },

    '20_CAREER': {
      title: `20 in Career Paths — Judgement`,
      tagline: `A Design of the Real Step`,
      mastery: `Your career fit runs through vocation — work that functions less like a job and more like an answer.`,
      shadow: `You stay in an adequate-but-outgrown role, endlessly preparing to answer the calling instead of leaping.`,
      invitation: `Name the work you keep returning to in your mind today, and take one real step toward it.`,
    },

    '21_CAREER': {
      title: `21 in Career Paths — The World`,
      tagline: `A Design of the Crossed Border`,
      mastery: `Your career fit runs through global reach — work embedded in genuinely large systems and networks.`,
      shadow: `You stay confined to a narrow, local version of your field long after your capacity has outgrown it.`,
      invitation: `Let one part of your work today deliberately cross a border — a client, a platform, a market.`,
    },

    '22_CAREER': {
      title: `22 in Career Paths — The Fool`,
      tagline: `A Design of the Invented Job`,
      mastery: `Your career fit runs through original, unstructured paths — work a job description would have to be invented to describe.`,
      shadow: `You force yourself into a fixed, conventional role that punishes exactly the originality that's your real asset.`,
      invitation: `Name one unconventional shape your work could actually take today, and take a real step toward building it.`,
    },

    // ── Guardian Angel (Month of Birth / B) — Destiny Matrix: The 22
    // Ultimate Life-Changing Codes, pages 128-129: "The upper spot of the
    // diagonal square... is an energy of your personal guardian angel given
    // to you at birth... The spot of your guardian angel... stands for the
    // month of your birthday." Reuses B (Sky Line/birth-month) under its
    // own star identity, same technique as Career Paths reusing MON. ──
    '1_GA': {
      title: `1 in Guardian Angel — The Magician`,
      tagline: `A Design of the Trusted Impulse`,
      mastery: `Your connection to guidance was given at birth through origination — the sudden, confident impulse to start something arrives as certainty, not a sign you have to interpret.`,
      shadow: `You drown that nudge in second-guessing, waiting for more proof until the opening it pointed toward has already closed.`,
      invitation: `Act on one confident impulse today without demanding proof first.`,
    },

    '2_GA': {
      title: `2 in Guardian Angel — The High Priestess`,
      tagline: `A Design of the Acted Knowing`,
      mastery: `Your connection to guidance arrives as quiet, wordless knowing — a felt certainty that turns out right before you can explain why.`,
      shadow: `You dismiss that quiet knowing because it can't be justified out loud, so the guidance goes unacted on.`,
      invitation: `Act today on one quiet certainty, even without a tidy explanation.`,
    },

    '3_GA': {
      title: `3 in Guardian Angel — The Empress`,
      tagline: `A Design of the Listened Signal`,
      mastery: `Your connection to guidance arrives through a felt sense of abundance or depletion — what genuinely feeds you versus what only looks like it should.`,
      shadow: `You override that felt sense to keep giving, missing the guidance embedded in your own exhaustion.`,
      invitation: `Let one signal of depletion today actually change what you do.`,
    },

    '4_GA': {
      title: `4 in Guardian Angel — The Emperor`,
      tagline: `A Design of Trusted Timing`,
      mastery: `Your connection to guidance arrives as a clear, structural sense of right timing — knowing when to hold and when to move.`,
      shadow: `You override that timing sense to force control before the moment is actually ready.`,
      invitation: `Wait today for the moment your instinct says is actually ready, rather than forcing it early.`,
    },

    '5_GA': {
      title: `5 in Guardian Angel — The Hierophant`,
      tagline: `A Design of the Self-Confirmed Truth`,
      mastery: `Your connection to guidance arrives through recognition — something resonates as genuinely true the moment you encounter it, ahead of any argument for it.`,
      shadow: `You follow an outside authority's word over your own recognition, deferring guidance you actually already received.`,
      invitation: `Trust one thing today that rang true to you over an outside authority's opposing opinion.`,
    },

    '6_GA': {
      title: `6 in Guardian Angel — The Lovers`,
      tagline: `A Design of the Weighed Pull`,
      mastery: `Your connection to guidance arrives as a genuine pull, distinct from what merely looks convenient or expected.`,
      shadow: `You choose what looks correct on paper over the actual pull, muting the guidance to avoid disruption.`,
      invitation: `Name one pull you've been overriding today, and give it real weight.`,
    },

    '7_GA': {
      title: `7 in Guardian Angel — The Chariot`,
      tagline: `A Design of Aligned Ease`,
      mastery: `Your connection to guidance arrives through motion itself — drive that feels aligned and effortless is often the signal.`,
      shadow: `You confuse sheer forward motion with guidance, forcing a direction the momentum was never actually behind.`,
      invitation: `Notice today where your drive feels aligned versus forced, and follow the aligned direction.`,
    },

    '8_GA': {
      title: `8 in Guardian Angel — Justice`,
      tagline: `A Design of the Simple Read`,
      mastery: `Your connection to guidance arrives as a clean, uncomplicated read on what's actually right, before the justifications arrive.`,
      shadow: `You talk yourself out of that clean read with elaborate justification, muddying guidance that was actually simple.`,
      invitation: `Trust your first clear read today on one fairness question, before arguing yourself out of it.`,
    },

    '9_GA': {
      title: `9 in Guardian Angel — The Hermit`,
      tagline: `A Design of the Given Quiet`,
      mastery: `Your connection to guidance arrives specifically in quiet, alone time — insight that only comes once you've actually withdrawn long enough to hear it.`,
      shadow: `You stay so busy or social that the solitude this guidance depends on never actually arrives.`,
      invitation: `Spend one real stretch of solitude today with no agenda, and notice what surfaces.`,
    },

    '10_GA': {
      title: `10 in Guardian Angel — Wheel of Fortune`,
      tagline: `A Design of the Trusted Ease`,
      mastery: `Your connection to guidance arrives as open doors — lucky, well-timed openings once you've actually made a decision and moved.`,
      shadow: `You doubt the ease itself, passing by a door that opened easily to look for a harder path to prove yourself on.`,
      invitation: `Walk through one door today that opened easily, instead of waiting for a harder one.`,
    },

    '11_GA': {
      title: `11 in Guardian Angel — Strength`,
      tagline: `A Design of Unwitnessed Resolve`,
      mastery: `Your connection to guidance arrives as an inner steadiness that doesn't need anyone else to witness it.`,
      shadow: `You need that resolve confirmed by an audience before trusting it's real, delaying action until validated.`,
      invitation: `Act today on one private certainty, without needing anyone else to confirm it first.`,
    },

    '12_GA': {
      title: `12 in Guardian Angel — The Hanged Man`,
      tagline: `A Design of the Released View`,
      mastery: `Your connection to guidance arrives as a new perspective, arriving right as you release your grip on the old view.`,
      shadow: `You cling to the old angle out of self-sacrifice, refusing the new view because it feels like giving something up.`,
      invitation: `Release your current view today of one stuck situation, and let a new angle arrive.`,
    },

    '13_GA': {
      title: `13 in Guardian Angel — Transformation`,
      tagline: `A Design of the Completed Ending`,
      mastery: `Your connection to guidance arrives inside endings themselves — clarity that becomes visible only once something old has been let go.`,
      shadow: `You resist the ending so hard that the clarity waiting on the other side of it never actually arrives.`,
      invitation: `Let one ending complete fully today instead of prolonging it, and notice what becomes visible.`,
    },

    '14_GA': {
      title: `14 in Guardian Angel — Temperance`,
      tagline: `A Design of the Easy Trust`,
      mastery: `Your connection to guidance is well-established and born-in — strong intuition that doesn't need to be built, only trusted.`,
      shadow: `You doubt a sense this reliable simply because it arrived without effort, as if an inborn gift needed to be earned.`,
      invitation: `Trust one intuitive read today exactly because it came easily, not despite that.`,
    },

    '15_GA': {
      title: `15 in Guardian Angel — The Devil`,
      tagline: `A Design of the Named Moment`,
      mastery: `Your connection to guidance arrives as the moment of noticing itself — the instant you catch a pull is itself the protection.`,
      shadow: `You ignore that moment of noticing, letting the pull run unexamined because acknowledging it feels like admitting weakness.`,
      invitation: `Name one pull today the moment you notice it, instead of letting it run silently.`,
    },

    '16_GA': {
      title: `16 in Guardian Angel — The Tower`,
      tagline: `A Design of the Heeded Signal`,
      mastery: `Your connection to guidance arrives as an early signal, a felt sense that something is about to give way, well before the actual collapse.`,
      shadow: `You dismiss that early signal to maintain the appearance of stability, until the collapse forces the issue.`,
      invitation: `Name one early warning sign you've been minimizing today, and address it directly.`,
    },

    '17_GA': {
      title: `17 in Guardian Angel — The Star`,
      tagline: `A Design of the Trusted Hope`,
      mastery: `Your connection to guidance arrives as a hope that persists even when circumstances don't obviously justify it.`,
      shadow: `You dismiss that persistent hope as naive, talking yourself out of the one thing that was actually guidance.`,
      invitation: `Let one stubborn hope today be real information instead of naivety to manage.`,
    },

    '18_GA': {
      title: `18 in Guardian Angel — The Moon`,
      tagline: `A Design of the Sorted Signal`,
      mastery: `Your connection to guidance arrives through the felt and the dreamed — real information even before it can be explained.`,
      shadow: `You let fear masquerade as guidance, since this same sensitive channel can manifest what it fears as easily as what it hopes.`,
      invitation: `Write down one dream or felt undercurrent today, and check whether it's guidance or fear before acting.`,
    },

    '19_GA': {
      title: `19 in Guardian Angel — The Sun`,
      tagline: `A Design of the Followed Spark`,
      mastery: `Your connection to guidance arrives as unmistakable joy — what makes your eyes sparkle is protection pointing you where your energy is meant to go.`,
      shadow: `You dismiss joy as frivolous, requiring a more serious-sounding reason before trusting what actually delights you.`,
      invitation: `Follow one thing today that genuinely lights you up, without needing a serious justification.`,
    },

    '20_GA': {
      title: `20 in Guardian Angel — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `Your connection to guidance arrives as a summons that keeps returning until it's finally answered.`,
      shadow: `You treat the repetition as noise to manage rather than guidance insisting on being heard.`,
      invitation: `Name the call that keeps returning today, and take one real step toward answering it.`,
    },

    '21_GA': {
      title: `21 in Guardian Angel — The World`,
      tagline: `A Design of the Honored Rightness`,
      mastery: `Your connection to guidance arrives as a felt sense of arrival — an internal, protective sense of rightness, not an external checklist.`,
      shadow: `You override that felt completion with an external standard, refusing to let something count as done.`,
      invitation: `Trust one felt sense of completion today over an external checklist that says otherwise.`,
    },

    '22_GA': {
      title: `22 in Guardian Angel — The Fool`,
      tagline: `A Design of the Unguaranteed Leap`,
      mastery: `Your connection to guidance arrives as trust itself — a leap that feels right despite having no proof attached.`,
      shadow: `You demand the guarantee anyway, refusing to move until a certainty this guidance was never going to offer arrives.`,
      invitation: `Take one leap today that feels right despite lacking proof.`,
    },

    // ── Life Path (full birthdate digit sum, classical numerology reduction:
    // 1-9 or master numbers 11/22/33 — NOT this app's own base-22 Arcana
    // system, since Life Path is a real, externally-known number people
    // already check themselves against. See research/11-Research-Updates/32.
    // Content adapted from Numberolgy-data.pdf's Positive/Negative/
    // Destructive trait lists for each number. ──────────────────────────────
    '1_LIFEPATH': {
      title: `Life Path 1 — The Original`,
      mastery: `You move first. Not out of bravado — standing still while something needs to happen has never felt like an option to you. You're not waiting for permission; that isn't how you're built.`,
      traits: `You're decisive to a fault, fiercely independent, and instinctively protective of your own ideas before anyone else has weighed in on them. You'd rather be first and wrong than safe and second.`,
      shadow: `You conflate leading a room with needing to win it. When someone challenges you, your instinct is correction, not curiosity, and it curdles into needing to be right more than needing to be understood.`,
      career: `You belong wherever the first move is yours to make — founding, not joining. Business ownership, invention, executive leadership, or any role where the direction is genuinely up to you.`,
      love: `You love with your whole hand on the wheel. What actually holds you is someone who won't be steered — a partner secure enough to disagree with you in front of other people.`,
      path: `Ask one real question today instead of offering the answer first.`,
    },

    '2_LIFEPATH': {
      title: `Life Path 2 — The Diplomat`,
      mastery: `You process the world in pairs — this side and that side, what was said and what was meant. You're constitutionally unable to hear only one side of anything.`,
      traits: `You're tactful, detail-oriented, and quietly perceptive in a way people mistake for shyness. You notice everything and announce almost none of it.`,
      shadow: `Peace bought by staying quiet isn't peace — it's a debt with interest. You watch a conflict clearly enough to see what's true and still say nothing, because agreeing feels safer.`,
      career: `You do your best work as half of something — a partnership, a team, a role built on precision and follow-through. Counseling, mediation, or detail-heavy work where tact is the actual skill.`,
      love: `You give a relationship your whole attention, but you default to whatever keeps things smooth, even when smooth isn't honest.`,
      path: `Say the plain version of what you want today, once, before smoothing it into something more agreeable.`,
    },

    '3_LIFEPATH': {
      title: `Life Path 3 — The Expressive One`,
      mastery: `Whatever's happening inside you wants a room, a page, a stage, someone to actually receive it. Silence is where things go to rot for you.`,
      traits: `You're funny before you're serious, though the seriousness is real underneath it. Optimistic almost by reflex, quick with words. People remember rooms you were in.`,
      shadow: `Expression without follow-through is just noise with good lighting. You start ten things and finish the two still fun by week three.`,
      career: `Anywhere your voice is the product — writing, performing, teaching, hosting, sales, marketing. You need real variety and at least a little audience.`,
      love: `You love loudly and generously and mean it, but staying present through the boring, hard middle of a relationship is the muscle you've practiced least.`,
      path: `Finish one unglamorous obligation today with nobody watching and no funny story to tell about it afterward.`,
    },

    '4_LIFEPATH': {
      title: `Life Path 4 — The Builder`,
      mastery: `You think in years, not weeks — laying one honest brick at a time toward something still standing long after the excitement wore off.`,
      traits: `You're disciplined, loyal, and stubbornly practical, with a private streak of unconventional thinking. You'd rather be right in ten years than agreeable today.`,
      shadow: `The same conviction that builds something durable hardens into a refusal to be moved on anything, including the small stuff that was never worth the fight.`,
      career: `Engineering, architecture, operations, construction — any field where the win is a system that still works five years from now.`,
      love: `You show love the way you show up to work — consistently, without asking for credit — which some partners read as distant simply because it's quiet.`,
      path: `Take one afternoon today for something with no productive purpose at all.`,
    },

    '5_LIFEPATH': {
      title: `Life Path 5 — The Adventurer`,
      mastery: `Your mind runs fast and wants new input the way lungs want air. Routine genuinely starts to feel like a room with the windows painted shut.`,
      traits: `You're quick, curious, and unusually good at reading a room or a stranger within minutes. Change doesn't scare you — the absence of it does.`,
      shadow: `Motion without anything underneath it eventually stops being adventure and starts being avoidance. You reach for something new the instant something old asks for real depth.`,
      career: `Writing, sales, travel, media — any work with a genuinely different day attached to it. Multiple streams of interest suit you better than one narrow lane.`,
      love: `You love easily and widely, but staying is the part that actually tests you, since leaving has always been the easier reflex.`,
      path: `Stay with one commitment today past the point where you'd normally want to change course.`,
    },

    '6_LIFEPATH': {
      title: `Life Path 6 — The Nurturer`,
      mastery: `You walk into a space and start improving it without noticing — softening an argument, making a house feel like somewhere people want to stay.`,
      traits: `You're warm, protective, and genuinely happiest when the people around you are doing well. You have real taste in beauty and harmony.`,
      shadow: `Caring for someone and managing them feel identical from the inside, but only one of them is actually love. You set a standard for how people should be treated without saying it out loud.`,
      career: `Teaching, counseling, healthcare, hospitality, design — anywhere your work visibly makes someone's life better.`,
      love: `You are a genuinely devoted partner, but the same devotion, unchecked, starts asking your partner to be cared for on your terms instead of theirs.`,
      path: `Name one place today where you've been managing someone else's life out of love, and step back from it on purpose.`,
    },

    '7_LIFEPATH': {
      title: `Life Path 7 — The Seeker`,
      mastery: `You live a layer beneath where most conversations happen — genuinely more interested in why something is true than in how it looks.`,
      traits: `You're intuitive, private, and unusually calming to be around, even when you've said almost nothing. You'd rather understand one thing completely than skim ten.`,
      shadow: `The line between privacy and isolation is thinner than you think. Staying quiet long enough starts to read as cold to people who never got the context.`,
      career: `Research, analysis, writing, medicine — any specialist field that rewards depth over speed, with real solitude built into the role.`,
      love: `You love slowly, and trust is the actual price of admission to the parts of you nobody else gets to see.`,
      path: `Tell one trusted person a half-formed thought today, before you've polished it into something worth saying.`,
    },

    '8_LIFEPATH': {
      title: `Life Path 8 — The Executive`,
      mastery: `You're quieter than the scale of what you build would suggest, patient in a way that looks like restraint but is really confidence the plan will pay off.`,
      traits: `You're capable, composed, and a genuinely sharp judge of character. You measure things — progress, people, yourself — more than almost any other number does.`,
      shadow: `The same instinct that built everything you have also decides feelings can wait until after the task is done, and "after" has a way of never arriving.`,
      career: `Business, finance, law, operations — anywhere real authority and a visible scoreboard exist.`,
      love: `You provide before you're asked to, and show love through action more naturally than through words — reliable in a way that's easy to underestimate as coldness.`,
      path: `Name one feeling out loud today instead of routing straight past it into the next task.`,
    },

    '9_LIFEPATH': {
      title: `Life Path 9 — The Humanitarian`,
      mastery: `Giving isn't generosity for you so much as reflex — your first instinct is to hand over whatever's needed before anyone's had to ask.`,
      traits: `You're direct, warm, and refreshingly free of guile. You forgive fast, sometimes faster than the situation actually earned.`,
      shadow: `You rarely notice when giving has stopped being reciprocal, and by the time you do, the resentment has already been quietly accumulating.`,
      career: `Nonprofit and humanitarian work, law, teaching, the arts — anything built around other people's wellbeing.`,
      love: `You love generously, sometimes to a fault, giving before it's asked for and rarely keeping score — which is exactly how the imbalance starts.`,
      path: `Ask directly today for one thing you need, with the same plainness you'd use to offer it to someone else.`,
    },

    '11_LIFEPATH': {
      title: `Master Number 11 — The Illuminator`,
      mastery: `You read rooms and people faster than you can explain how, and you carry a pull toward meaning that ordinary routine has never quite satisfied.`,
      traits: `You're inspired, magnetic without trying to be, and drawn to work that feels like more than a paycheck. People remember meeting you longer than you'd expect.`,
      shadow: `You live in the gap between the size of what you can imagine and the size of what you've actually built, holding people to a standard the real world was never going to meet.`,
      career: `Teaching, art, ministry, coaching — anything that functions as a calling rather than a job.`,
      love: `You love with real intensity once you've found someone who meets you on the same frequency, but you quietly hold the relationship to an ideal no ordinary Tuesday will live up to.`,
      path: `Turn one piece of the vision into a single, small, concrete action today, not the whole thing.`,
    },

    '22_LIFEPATH': {
      title: `Master Number 22 — The Master Builder`,
      mastery: `You can take something enormous in your head and actually finish building it in the world — not just imagine it, finish it.`,
      traits: `You're tireless, organized, and quietly restless when you're not building something real. People underestimate how much you're carrying until they see what you've finished.`,
      shadow: `The size of what you're capable of building doesn't leave much room for your own limits, and the body carrying this ambition tends to lag behind the mind driving it.`,
      career: `Architecture, engineering, large-scale construction, systems-building, civic leadership — anywhere the thing you make outlasts you.`,
      love: `You build relationships the way you build everything else — for the long term, wanting a partner who feels like part of the structure.`,
      path: `Measure today's progress only against what you've actually built, not the full scale of what you eventually intend.`,
    },

    '33_LIFEPATH': {
      title: `Master Number 33 — The Master Healer`,
      mastery: `Something in you gives without waiting to be asked — not performed kindness, closer to a reflex you were built with.`,
      traits: `You're compassionate, gentle, and unusually attuned to what other people need, sometimes before they know it themselves.`,
      shadow: `Giving without limit slowly starts to look like disappearing — your needs quietly moved to the bottom of a list you never actually wrote down.`,
      career: `Teaching, counseling, ministry, hospice and healing work, nonprofit leadership — anywhere your presence is genuinely part of the service.`,
      love: `You love as an act of care, tuned to what someone needs before they've said it, which is exactly how you end up depleted if nobody's giving it back.`,
      path: `Let one act of care land today without deflecting it, minimizing it, or rushing to return the favor.`,
    },

    // ── Birthday Number (classical, day-of-birth only — natural-talent
    // number, distinct from Life Path). See research build note for the
    // formula (js/matrix-engine.js's birthdayNumber()). ─────────────────────
    '1_BIRTHDAY': {
      title: `Birthday Number 1 — A Talent for Starting Things`,
      mastery: `You were born knowing how to move first. Something in you understands how to look at a gap nobody else is filling and simply step into it.`,
      traits: `You act quickly and decisively, often before you've fully explained your reasoning to anyone. Momentum genuinely excites you in a way planning committees never will.`,
      shadow: `You mistake being first for being right, and start resenting people for needing more time to catch up to a decision you made instantly.`,
      path: `Use this instinct today on something genuinely small — a conversation you've been putting off, a task nobody's watching.`,
    },
    '2_BIRTHDAY': {
      title: `Birthday Number 2 — A Talent for Reading the Room`,
      mastery: `You arrived already fluent in sensing what's actually happening beneath what's being said, picking up the tension nobody named.`,
      traits: `You notice tone shifts and the gap between someone's words and their face. People find you easy to be honest with, even when they can't say why.`,
      shadow: `You shape yourself entirely around what a room wants, losing track of your own position, and never quite say what you need.`,
      path: `Trust one read on someone today instead of second-guessing it into silence.`,
    },
    '3_BIRTHDAY': {
      title: `Birthday Number 3 — A Talent for Expression`,
      mastery: `You showed up already knowing how to make a room feel more alive, without ever being taught the mechanics of it.`,
      traits: `You find the funny angle on things quickly. People are drawn to talk to you even in silence-heavy rooms.`,
      shadow: `You deflect anything that asks for real vulnerability behind one more joke, becoming the person everyone enjoys and nobody quite knows.`,
      path: `Say one unpolished, true thing today without dressing it up first.`,
    },
    '4_BIRTHDAY': {
      title: `Birthday Number 4 — A Talent for Building`,
      mastery: `You were born with the ability to take something formless and give it real structure, trusting consistency more than inspiration.`,
      traits: `You default to practical solutions before creative ones. Long-term projects don't scare you the way they scare most people.`,
      shadow: `Your steadiness calcifies into rigidity — one right way to do a thing, and real frustration with anyone who suggests another.`,
      path: `Loosen your grip today on one process that doesn't actually need to be so exact.`,
    },
    '5_BIRTHDAY': {
      title: `Birthday Number 5 — A Talent for Adapting`,
      mastery: `You arrived already equipped with genuine ease with change. Where other people brace for disruption, you lean toward it, curious rather than afraid.`,
      traits: `You pick up new skills and situations quickly. You genuinely enjoy the unplanned detour more than the itinerary.`,
      shadow: `Your adaptability becomes an excuse to never actually land anywhere, mistaking restlessness for growth.`,
      path: `Stay inside one uncomfortable moment today instead of adapting your way out of it immediately.`,
    },
    '6_BIRTHDAY': {
      title: `Birthday Number 6 — A Talent for Care`,
      mastery: `You were born already knowing how to make a space feel held, noticing what needed fixing or softening before anyone explained it.`,
      traits: `You notice what a room or a person needs before they've asked. People tend to relax around you without quite knowing why.`,
      shadow: `Your caretaking becomes compulsive — responsibility you never actually agreed to, while your own needs sit unaddressed at the bottom of the list.`,
      path: `Let one thing today go uncared-for that genuinely isn't yours to manage.`,
    },
    '7_BIRTHDAY': {
      title: `Birthday Number 7 — A Talent for Depth`,
      mastery: `You arrived already pulled toward understanding things at their root, suspicious of the easy answer before anyone taught you to be.`,
      traits: `You ask the follow-up question other people don't think to ask. Solitude restores you in a way company rarely does.`,
      shadow: `Your depth becomes a hiding place — endless analysis standing in for actual rest, understanding pursued so relentlessly it replaces living.`,
      path: `Let one question stay genuinely unanswered today instead of chasing it down to the end.`,
    },
    '8_BIRTHDAY': {
      title: `Birthday Number 8 — A Talent for Execution`,
      mastery: `You were born with an instinct for turning ambition into something you can actually point to, understanding the difference between an idea and a finished thing.`,
      traits: `You default to action once a decision's been made. People trust you with things that actually need to get done.`,
      shadow: `Your capability turns into a scoreboard you can never stop checking, quietly discounting anything that didn't show up as a tangible result.`,
      path: `Count today as good for a reason that has nothing to do with what you produced.`,
    },
    '9_BIRTHDAY': {
      title: `Birthday Number 9 — A Talent for Compassion`,
      mastery: `You arrived already able to feel what other people are going through, almost before they've said it out loud.`,
      traits: `You pick up on other people's pain quickly, sometimes before your own registers. Generosity feels natural to you, not effortful.`,
      shadow: `Your compassion becomes depleting — giving until there's nothing left over, feeling everyone's pain so thoroughly your own gets lost in the noise.`,
      path: `Keep one small thing today purely for yourself, unshared and unspent on anyone else.`,
    },
    '11_BIRTHDAY': {
      title: `Master Birthday Number 11 — A Talent for Insight`,
      mastery: `You were born carrying an intuitive sensitivity that arrives before logic can catch up, sensing what's coming well ahead of the evidence others wait for.`,
      traits: `You sense shifts in a room, a plan, or a person before anyone names them out loud. Ideas arrive to you fully formed.`,
      shadow: `This heightened sensitivity stays trapped in your own head, insight that never gets spoken because the intensity of it feels safer kept private.`,
      path: `Follow one instinct today before you can fully explain why.`,
    },
    '22_BIRTHDAY': {
      title: `Master Birthday Number 22 — A Talent for Making Things Real`,
      mastery: `You arrived carrying genuine vision paired with the practical capacity to actually build it, taking something enormous and finishing it in the material world.`,
      traits: `You think in systems and structures, not just isolated ideas. Ambition energizes you rather than intimidating you.`,
      shadow: `This rare capability stalls at the planning stage — ambition so large it never fully commits to a first, imperfect, small step.`,
      path: `Turn one idea into a genuinely small, real first step today.`,
    },
    '33_BIRTHDAY': {
      title: `Master Birthday Number 33 — A Talent for Healing`,
      mastery: `You were born with an unusually deep capacity for service, care so genuine that other people can feel it land as something structural to who you are.`,
      traits: `People bring you their real problems, sensing you'll actually hold them well. You give without keeping score.`,
      shadow: `This depth of care becomes self-erasing — giving so completely that your own needs quietly stop registering as needs at all.`,
      path: `Name one thing you need today instead of assuming it can wait until everyone else's needs are met.`,
    },

    // ── Personal Year (classical, birth month + birth day + CURRENT year —
    // dynamic, changes annually). Distinct from the app's Arcana-based
    // Yearly Energy. ─────────────────────────────────────────────────────────
    '1_PYEAR': {
      title: `Personal Year 1 — A Year for Starting Over`,
      mastery: `This year is asking for a real beginning — a new project, a new direction, a version of your life that doesn't need the old one's permission.`,
      traits: `Momentum feels more available to you right now than usual. New ideas arrive with unusual clarity.`,
      shadow: `You mistake motion for direction — starting things simply to feel the relief of movement, without checking whether they deserve the energy.`,
      path: `Begin one thing this month that you've been circling for a while, even before you feel fully ready.`,
    },
    '2_PYEAR': {
      title: `Personal Year 2 — A Year for Partnership`,
      mastery: `This year turns your attention toward other people — genuine cooperation, patience, and relationships that need real tending.`,
      traits: `You're more sensitive to other people's needs and moods than usual. Partnerships carry unusual weight this year.`,
      shadow: `Your patience slides into passivity — waiting so thoroughly for the right moment that you forget to actually say what you think.`,
      path: `Be patient with one situation this month without giving up your own voice inside it.`,
    },
    '3_PYEAR': {
      title: `Personal Year 3 — A Year for Being Seen`,
      mastery: `This year opens up real room for expression, creativity, and being visible in a way the previous years didn't especially favor.`,
      traits: `Your natural charm and expressiveness are more available this year. Social opportunities tend to multiply.`,
      shadow: `You scatter this abundant energy across too many fun, low-stakes distractions, leaving the creative work you care about unfinished.`,
      path: `Share one thing you've made this month, even in an unfinished state.`,
    },
    '4_PYEAR': {
      title: `Personal Year 4 — A Year for Groundwork`,
      mastery: `This year is less about excitement and more about consequence — the discipline and structure you put in place now determine how solid the years ahead are.`,
      traits: `Patience for slow, unglamorous work tends to be higher than usual. Long-term thinking comes more naturally right now.`,
      shadow: `Necessary structure tips into rigid over-control — becoming so committed to the plan you can't adjust it even when it clearly needs revising.`,
      path: `Stick with one unglamorous task this month past the point where it stops feeling exciting.`,
    },
    '5_PYEAR': {
      title: `Personal Year 5 — A Year for Change`,
      mastery: `This year deliberately shakes things loose — genuine unpredictability arrives and rewards flexibility far more than resistance.`,
      traits: `Restlessness and curiosity both run higher than usual. Your tolerance for routine is probably at its lowest point in the whole cycle.`,
      shadow: `You chase every new option this year offers without letting any single one have the time it needs to actually become something real.`,
      path: `Say yes to one genuinely unplanned opportunity this month.`,
    },
    '6_PYEAR': {
      title: `Personal Year 6 — A Year for Home and Responsibility`,
      mastery: `This year turns your attention toward home, family, and the people closest to you — real responsibility, and the reward of tending to what matters most.`,
      traits: `Your instinct to care for people and spaces is stronger than usual this year. You're likely to be leaned on more this year.`,
      shadow: `You over-function for everyone around you until the whole year gets spent managing other people's needs, with none of that care coming back.`,
      path: `Ask someone for real help with one responsibility this month, instead of carrying all of it alone.`,
    },
    '7_PYEAR': {
      title: `Personal Year 7 — A Year for Reflection`,
      mastery: `This year pulls inward on purpose — study, solitude, and real reflection are favored over the outward-facing momentum of other years.`,
      traits: `Your need for solitude and depth is stronger than usual this year. Intuition and insight tend to sharpen considerably.`,
      shadow: `You retreat so far inward that needed rest turns into genuine disconnection from the people who actually care about you.`,
      path: `Reach out to one person this month even in the middle of a quieter season.`,
    },
    '8_PYEAR': {
      title: `Personal Year 8 — A Year for Ambition`,
      mastery: `This year favors material progress — career, money, and real authority all tend to move more than usual, rewarding focused, deliberate effort.`,
      traits: `Your drive and capacity for sustained effort are unusually high this year. You're likely to feel more comfortable claiming real authority.`,
      shadow: `You measure the entire year purely by results, letting anything that doesn't show up on a scoreboard quietly stop counting.`,
      path: `Note one non-material win this month alongside whatever material progress you're making.`,
    },
    '9_PYEAR': {
      title: `Personal Year 9 — A Year for Letting Go`,
      mastery: `This year closes out its nine-year cycle — endings, release, and clearing space for what's next are the actual work of a year like this.`,
      traits: `A pull toward simplifying and releasing is stronger than usual this year. Generosity and a wider perspective tend to come more easily.`,
      shadow: `You cling to what this year is trying to close, dragging an ending out well past the point it needed to end.`,
      path: `Release one thing this month that's already run its actual course.`,
    },
    '11_PYEAR': {
      title: `Master Personal Year 11 — A Year of Heightened Intuition`,
      mastery: `This master year carries real charge — inspiration and insight run ahead of logic, and genuine creative or spiritual downloads arrive asking to be acted on.`,
      traits: `Your intuition is unusually sharp this year. Ideas and insights arrive with more force and frequency than usual.`,
      shadow: `You stay purely inspired without grounding any of it into something real, feeling electric all year with nothing actually built to show for it.`,
      path: `Turn one insight this month into a real, concrete action, however small.`,
    },
    '22_PYEAR': {
      title: `Master Personal Year 22 — A Year for Building Big`,
      mastery: `This master year carries a rare combination — genuine capacity to build something large and lasting, pairing vision with the follow-through to finish it.`,
      traits: `Your ability to combine big-picture vision with practical execution is heightened this year. Your energy and drive are considerable, though not infinite.`,
      shadow: `You overextend past your actual capacity, letting the scale of what's possible outpace what your body and nervous system can sustain.`,
      path: `Pace one big project this month against your real energy, not just its potential scale.`,
    },
    '33_PYEAR': {
      title: `Master Personal Year 33 — A Year of Deep Service`,
      mastery: `This master year puts you in a position to genuinely help, teach, or heal others in a way that carries real weight.`,
      traits: `Your instinct to care for and guide others is stronger than usual this year. A sense of larger purpose runs underneath the year's ordinary events.`,
      shadow: `You give so completely to others this year that your own needs get quietly deprioritized, until sustainable service becomes depleting instead.`,
      path: `Keep one part of this month purely for yourself, unspent on anyone else's needs.`,
    },

    // ── 1 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_F1': {
      title: `1 in Paternal Masculine Line — The Magician`,
      tagline: `A Design of the Finished Launch`,
      mastery: `You carry a real, inherited pull to initiate a venture your paternal line wanted but never actually began.`,
      shadow: `You keep almost-launching something significant without ever fully committing to it.`,
      invitation: `Take one real, committed step today on the venture you keep almost-starting.`,
    },

    // ── 2 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_F1': {
      title: `2 in Paternal Masculine Line — The High Priestess`,
      tagline: `A Design of the Trusted Gut`,
      mastery: `You carry real, sharp intuition, inherited from a line that was never given permission to trust its own instinct.`,
      shadow: `You override a strong instinct the moment it can't be logically justified, silencing exactly what should be trusted.`,
      invitation: `Act on one genuine instinct today without requiring a rational case for it first.`,
    },

    // ── 3 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_F1': {
      title: `3 in Paternal Masculine Line — The Empress`,
      tagline: `A Design of Visible Warmth`,
      mastery: `You carry real creative and nurturing capacity, inherited from a line that rigid masculinity never let express it.`,
      shadow: `You keep that gentler, generative side private or minimized out of an old, unexamined caution.`,
      invitation: `Express your creativity or warmth openly today, in one specific setting, without softening it.`,
    },

    // ── 4 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_F1': {
      title: `4 in Paternal Masculine Line — The Emperor`,
      tagline: `A Design of Balanced Command`,
      mastery: `You carry real leadership capacity, capable of holding authority with both firmness and genuine care.`,
      shadow: `You swing to one extreme — avoiding authority out of fear of harshness, or gripping control too tightly.`,
      invitation: `Lead one piece of real responsibility today with firmness and care held together, not one at the other's expense.`,
    },

    // ── 5 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_F1': {
      title: `5 in Paternal Masculine Line — The Hierophant`,
      tagline: `A Design of the Claimed Role`,
      mastery: `You carry a real pull toward teaching, mentorship, or guidance.`,
      shadow: `You offer that guidance informally, forever, without ever formally naming or claiming the role it already functions as.`,
      invitation: `Claim one specific teaching or mentoring role today instead of continuing to offer it informally.`,
    },

    // ── 6 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_F1': {
      title: `6 in Paternal Masculine Line — The Lovers`,
      tagline: `A Design of the Free Choice`,
      mastery: `You carry a real capacity for partnership chosen from genuine desire, not obligation.`,
      shadow: `You let your relationship choices run on duty and expectation rather than your own actual wanting.`,
      invitation: `Name today what you actually want in partnership, separate from what's expected of you.`,
    },

    // ── 7 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_F1': {
      title: `7 in Paternal Masculine Line — The Chariot`,
      tagline: `A Design of the Actual Finish`,
      mastery: `You carry real, genuine drive toward ambitious goals.`,
      shadow: `Your ambitions have a pattern of stalling or getting abandoned just short of the finish line.`,
      invitation: `Push one currently stalled goal forward today, toward its actual completion.`,
    },

    // ── 8 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_F1': {
      title: `8 in Paternal Masculine Line — Justice`,
      tagline: `A Design of the Settled Account`,
      mastery: `You carry a real, sharp sensitivity to unfairness.`,
      shadow: `That sensitivity reacts to present situations with an intensity that belongs to something older, unresolved, and unnamed.`,
      invitation: `Name, as specifically as you can today, what the original unfairness in your paternal line actually was.`,
    },

    // ── 9 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_F1': {
      title: `9 in Paternal Masculine Line — The Hermit`,
      tagline: `A Design of Unapologetic Solitude`,
      mastery: `You carry a real need for withdrawal, reflection, and solitary space.`,
      shadow: `You fill every available space with obligation to others, unable to justify solitude even when it's genuinely needed.`,
      invitation: `Claim one period of genuine solitude today without justifying it as productive first.`,
    },

    // ── 10 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_F1': {
      title: `10 in Paternal Masculine Line — Wheel of Fortune`,
      tagline: `A Design of Chosen Peace`,
      mastery: `You carry a real capacity to weather life's unpredictable turns.`,
      shadow: `You treat every uncontrollable turn as personal injustice rather than simply how life moves.`,
      invitation: `Name one circumstance today genuinely beyond your control, and choose acceptance over resistance to it.`,
    },

    // ── 11 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_F1': {
      title: `11 in Paternal Masculine Line — Strength`,
      tagline: `A Design of Visible Compassion`,
      mastery: `You carry real, genuine resilience and strength.`,
      shadow: `You express that strength only as toughness, cut off from the compassionate strength that's actually available underneath.`,
      invitation: `Lead one difficult moment today with visible compassion standing alongside your strength.`,
    },

    // ── 12 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_F1': {
      title: `12 in Paternal Masculine Line — The Hanged Man`,
      tagline: `A Design of the Named Need`,
      mastery: `You carry a real capacity for care and devotion to others.`,
      shadow: `Your own needs go perpetually unconsidered underneath that devotion, so thoroughly you struggle to even name them.`,
      invitation: `Name one of your own needs today, directly, and prioritize it, even briefly.`,
    },

    // ── 13 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_F1': {
      title: `13 in Paternal Masculine Line — Transformation`,
      tagline: `A Design of the Direct Ending`,
      mastery: `You carry a real capacity to meet necessary change directly.`,
      shadow: `You grip tightly to something you already know has run its course, simply because letting go feels dangerous.`,
      invitation: `Identify one ending that's clearly due in your life today, and meet it directly.`,
    },

    // ── 14 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_F1': {
      title: `14 in Paternal Masculine Line — Temperance`,
      tagline: `A Design of the Steady Middle`,
      mastery: `You carry a real capacity for commitment and sustained effort.`,
      shadow: `You alternate sharply between overexertion and equally intense collapse or excess, with nothing steady in between.`,
      invitation: `Choose one small, sustainable practice today and hold it steadily, resisting either extreme.`,
    },

    // ── 15 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_F1': {
      title: `15 in Paternal Masculine Line — The Devil`,
      tagline: `A Design of the First Loosening`,
      mastery: `You carry a real capacity to recognize and release what binds you.`,
      shadow: `You accept some compulsion, pattern, or obligation as simply how things are, never questioned, never approached as changeable.`,
      invitation: `Name your own version of the bind honestly today, and take one concrete step toward loosening it.`,
    },

    // ── 16 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_F1': {
      title: `16 in Paternal Masculine Line — The Tower`,
      tagline: `A Design of Full Investment`,
      mastery: `You carry a real capacity to rebuild fully after loss.`,
      shadow: `You hold back from fully investing in something stable, still bracing for a collapse that already happened once, long ago.`,
      invitation: `Fully invest in one area of stability today, without holding back in anticipation of its collapse.`,
    },

    // ── 17 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_F1': {
      title: `17 in Paternal Masculine Line — The Star`,
      tagline: `A Design of Spoken Hope`,
      mastery: `You carry a real capacity for genuine hope and faith in a better future.`,
      shadow: `You default to reflexive cynicism, protecting against disappointment at the cost of ever genuinely believing things could improve.`,
      invitation: `Name one genuine hope you actually hold today, out loud, and act on it.`,
    },

    // ── 18 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_F1': {
      title: `18 in Paternal Masculine Line — The Moon`,
      tagline: `A Design of Named Fear`,
      mastery: `You carry a real capacity to see clearly what's been operating in the background.`,
      shadow: `An unnamed anxiety shapes your decisions from the background without ever being examined directly.`,
      invitation: `Name, as specifically as possible, one fear that's been operating in the background, and look at it directly today.`,
    },

    // ── 19 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_F1': {
      title: `19 in Paternal Masculine Line — The Sun`,
      tagline: `A Design of Visible Gladness`,
      mastery: `You carry a real capacity for genuine joy and warmth.`,
      shadow: `You keep that joy behind a controlled, stoic surface, felt more than it's ever actually shown.`,
      invitation: `Let one moment of real joy today be visibly, openly expressed, without your usual composure.`,
    },

    // ── 20 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_F1': {
      title: `20 in Paternal Masculine Line — Judgement`,
      tagline: `A Design of the First Step`,
      mastery: `You carry a real, clearly sensed calling.`,
      shadow: `You keep delaying it, treating recognizing the call as though it were the same as answering it.`,
      invitation: `Take one concrete first step today toward the calling you already recognize.`,
    },

    // ── 21 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_F1': {
      title: `21 in Paternal Masculine Line — The World`,
      tagline: `A Design of Genuine Arrival`,
      mastery: `You carry real, sustained capacity for effort and progress.`,
      shadow: `The finish line keeps moving just out of reach, treated as always one step further than wherever you currently are.`,
      invitation: `Identify one genuinely near-complete effort today, and deliberately close it out.`,
    },

    // ── 22 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_F1': {
      title: `22 in Paternal Masculine Line — The Fool`,
      tagline: `A Design of Bought-Back Freedom`,
      mastery: `You carry a real, genuine desire for freedom, adventure, and an unconventional path.`,
      shadow: `You default to the secure option reflexively, even in situations where the risk would actually be worth taking.`,
      invitation: `Choose the freer, less conventional option today in one specific situation, instead of defaulting to safety.`,
    },

    // ── 1 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_G1': {
      title: `1 in Maternal Masculine Line — The Magician`,
      tagline: `A Design of the Started Venture`,
      mastery: `You carry a real, inherited pull to initiate a venture your mother's father wanted but never actually began.`,
      shadow: `You keep almost-launching something significant without ever fully committing to it.`,
      invitation: `Take one real, committed step today on the venture you keep almost-starting.`,
    },

    // ── 2 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_G1': {
      title: `2 in Maternal Masculine Line — The High Priestess`,
      tagline: `A Design of the Followed Knowing`,
      mastery: `You carry real, sharp intuition, inherited from a man who was never given permission to trust his own instinct.`,
      shadow: `You override a strong instinct the moment it can't be logically justified, silencing exactly what should be trusted.`,
      invitation: `Act on one genuine instinct today without requiring a rational case for it first.`,
    },

    // ── 3 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_G1': {
      title: `3 in Maternal Masculine Line — The Empress`,
      tagline: `A Design of the Open Softness`,
      mastery: `You carry real creative and nurturing capacity, inherited from a man rigid masculinity never let express it.`,
      shadow: `You keep that gentler, generative side private or minimized out of an old, unexamined caution.`,
      invitation: `Express your creativity or warmth openly today, in one specific setting, without softening it.`,
    },

    // ── 4 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_G1': {
      title: `4 in Maternal Masculine Line — The Emperor`,
      tagline: `A Design of Held Power`,
      mastery: `You carry real leadership capacity, capable of holding authority with both firmness and genuine care.`,
      shadow: `You swing to one extreme — avoiding authority out of fear of harshness, or gripping control too tightly.`,
      invitation: `Lead one piece of real responsibility today with firmness and care held together, not one at the other's expense.`,
    },

    // ── 5 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_G1': {
      title: `5 in Maternal Masculine Line — The Hierophant`,
      tagline: `A Design of the Claimed Vocation`,
      mastery: `You carry a real pull toward teaching, mentorship, or guidance.`,
      shadow: `You offer that guidance informally, forever, without ever formally naming or claiming the role it already functions as.`,
      invitation: `Claim one specific teaching or mentoring role today instead of continuing to offer it informally.`,
    },

    // ── 6 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_G1': {
      title: `6 in Maternal Masculine Line — The Lovers`,
      tagline: `A Design of the Heart's Vote`,
      mastery: `You carry a real capacity for partnership chosen from genuine desire, not obligation.`,
      shadow: `You let your relationship choices run on duty and expectation rather than your own actual wanting.`,
      invitation: `Name today what you actually want in partnership, separate from what's expected of you.`,
    },

    // ── 7 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_G1': {
      title: `7 in Maternal Masculine Line — The Chariot`,
      tagline: `A Design of the Crossed Line`,
      mastery: `You carry real, genuine drive toward ambitious goals.`,
      shadow: `Your ambitions have a pattern of stalling or getting abandoned just short of the finish line.`,
      invitation: `Push one currently stalled goal forward today, toward its actual completion.`,
    },

    // ── 8 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_G1': {
      title: `8 in Maternal Masculine Line — Justice`,
      tagline: `A Design of the Closed Account`,
      mastery: `You carry a real, sharp sensitivity to unfairness.`,
      shadow: `That sensitivity reacts to present situations with an intensity that belongs to something older, unresolved, and unnamed.`,
      invitation: `Name, as specifically as you can today, what the original unfairness in your maternal line actually was.`,
    },

    // ── 9 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_G1': {
      title: `9 in Maternal Masculine Line — The Hermit`,
      tagline: `A Design of Claimed Stillness`,
      mastery: `You carry a real need for withdrawal, reflection, and solitary space.`,
      shadow: `You fill every available space with obligation to others, unable to justify solitude even when it's genuinely needed.`,
      invitation: `Claim one period of genuine solitude today without justifying it as productive first.`,
    },

    // ── 10 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_G1': {
      title: `10 in Maternal Masculine Line — Wheel of Fortune`,
      tagline: `A Design of the Honored Peace`,
      mastery: `You carry a real capacity to weather life's unpredictable turns.`,
      shadow: `You treat every uncontrollable turn as personal injustice rather than simply how life moves.`,
      invitation: `Name one circumstance today genuinely beyond your control, and choose acceptance over resistance to it.`,
    },

    // ── 11 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_G1': {
      title: `11 in Maternal Masculine Line — Strength`,
      tagline: `A Design of the Gentle Difference`,
      mastery: `You carry real, genuine resilience and strength.`,
      shadow: `You express that strength only as toughness, cut off from the compassionate strength that's actually available underneath.`,
      invitation: `Lead one difficult moment today with visible compassion standing alongside your strength.`,
    },

    // ── 12 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_G1': {
      title: `12 in Maternal Masculine Line — The Hanged Man`,
      tagline: `A Design of the Named List`,
      mastery: `You carry a real capacity for care and devotion to others.`,
      shadow: `Your own needs go perpetually unconsidered underneath that devotion, so thoroughly you struggle to even name them.`,
      invitation: `Name one of your own needs today, directly, and prioritize it, even briefly.`,
    },

    // ── 13 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_G1': {
      title: `13 in Maternal Masculine Line — Transformation`,
      tagline: `A Design of the Open Door`,
      mastery: `You carry a real capacity to meet necessary change directly.`,
      shadow: `You grip tightly to something you already know has run its course, simply because letting go feels dangerous.`,
      invitation: `Identify one ending that's clearly due in your life today, and meet it directly.`,
    },

    // ── 14 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_G1': {
      title: `14 in Maternal Masculine Line — Temperance`,
      tagline: `A Design of the Steady Rhythm`,
      mastery: `You carry a real capacity for commitment and sustained effort.`,
      shadow: `You alternate sharply between overexertion and equally intense collapse or excess, with nothing steady in between.`,
      invitation: `Choose one small, sustainable practice today and hold it steadily, resisting either extreme.`,
    },

    // ── 15 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_G1': {
      title: `15 in Maternal Masculine Line — The Devil`,
      tagline: `A Design of the Cut Strand`,
      mastery: `You carry a real capacity to recognize and release what binds you.`,
      shadow: `You accept some compulsion, pattern, or obligation as simply how things are, never questioned, never approached as changeable.`,
      invitation: `Name your own version of the bind honestly today, and take one concrete step toward loosening it.`,
    },

    // ── 16 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_G1': {
      title: `16 in Maternal Masculine Line — The Tower`,
      tagline: `A Design of the Finished Rebuild`,
      mastery: `You carry a real capacity to rebuild fully after loss.`,
      shadow: `You hold back from fully investing in something stable, still bracing for a collapse that already happened once, long ago.`,
      invitation: `Fully invest in one area of stability today, without holding back in anticipation of its collapse.`,
    },

    // ── 17 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_G1': {
      title: `17 in Maternal Masculine Line — The Star`,
      tagline: `A Design of the Restored Hope`,
      mastery: `You carry a real capacity for genuine hope and faith in a better future.`,
      shadow: `You default to reflexive cynicism, protecting against disappointment at the cost of ever genuinely believing things could improve.`,
      invitation: `Name one genuine hope you actually hold today, out loud, and act on it.`,
    },

    // ── 18 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_G1': {
      title: `18 in Maternal Masculine Line — The Moon`,
      tagline: `A Design of the Measured Fear`,
      mastery: `You carry a real capacity to see clearly what's been operating in the background.`,
      shadow: `An unnamed anxiety shapes your decisions from the background without ever being examined directly.`,
      invitation: `Name, as specifically as possible, one fear that's been operating in the background, and look at it directly today.`,
    },

    // ── 19 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_G1': {
      title: `19 in Maternal Masculine Line — The Sun`,
      tagline: `A Design of the Family Repair`,
      mastery: `You carry a real capacity for genuine joy and warmth.`,
      shadow: `You keep that joy behind a controlled, stoic surface, felt more than it's ever actually shown.`,
      invitation: `Let one moment of real joy today be visibly, openly expressed, without your usual composure.`,
    },

    // ── 20 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_G1': {
      title: `20 in Maternal Masculine Line — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `You carry a real, clearly sensed calling.`,
      shadow: `You keep delaying it, treating recognizing the call as though it were the same as answering it.`,
      invitation: `Take one concrete first step today toward the calling you already recognize.`,
    },

    // ── 21 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_G1': {
      title: `21 in Maternal Masculine Line — The World`,
      tagline: `A Design of the Written Ending`,
      mastery: `You carry real, sustained capacity for effort and progress.`,
      shadow: `The finish line keeps moving just out of reach, treated as always one step further than wherever you currently are.`,
      invitation: `Identify one genuinely near-complete effort today, and deliberately close it out.`,
    },

    // ── 22 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_G1': {
      title: `22 in Maternal Masculine Line — The Fool`,
      tagline: `A Design of Reclaimed Liberty`,
      mastery: `You carry a real, genuine desire for freedom, adventure, and an unconventional path.`,
      shadow: `You default to the secure option reflexively, even in situations where the risk would actually be worth taking.`,
      invitation: `Choose the freer, less conventional option today in one specific situation, instead of defaulting to safety.`,
    },

    // ── 1 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_H1': {
      title: `1 in Paternal Feminine Line — The Magician`,
      tagline: `A Design of the Opened Door`,
      mastery: `You carry a real, inherited pull to initiate a venture your father's mother wanted but never actually began.`,
      shadow: `You keep almost-launching something significant without ever fully committing to it.`,
      invitation: `Take one real, committed step today on the venture you keep almost-starting.`,
    },

    // ── 2 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_H1': {
      title: `2 in Paternal Feminine Line — The High Priestess`,
      tagline: `A Design of the Swallowed Instinct`,
      mastery: `You carry real, sharp intuition, inherited from a woman who was never given permission to trust her own instinct.`,
      shadow: `You override a strong instinct the moment it can't be logically justified, silencing exactly what should be trusted.`,
      invitation: `Act on one genuine instinct today without requiring a rational case for it first.`,
    },

    // ── 3 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_H1': {
      title: `3 in Paternal Feminine Line — The Empress`,
      tagline: `A Design of Full-Scale Gifts`,
      mastery: `You carry real creative and generative capacity, inherited from a woman circumstance never let express beyond the domestic sphere.`,
      shadow: `You keep your gifts small and contained, trimmed down out of an old, unexamined caution.`,
      invitation: `Express your creativity or generosity today at its full scale, in one specific setting, without shrinking it.`,
    },

    // ── 4 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_H1': {
      title: `4 in Paternal Feminine Line — The Emperor`,
      tagline: `A Design of Named Leadership`,
      mastery: `You carry real leadership capability, capable of holding visible authority in your own name.`,
      shadow: `You exercise real capability from behind the scenes, never claiming it openly as leadership in its own right.`,
      invitation: `Take on one piece of real, visible responsibility today, and lead it openly rather than managing it quietly.`,
    },

    // ── 5 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_H1': {
      title: `5 in Paternal Feminine Line — The Hierophant`,
      tagline: `A Design of the Claimed Role`,
      mastery: `You carry a real pull toward teaching, mentorship, or guidance.`,
      shadow: `You offer that guidance informally, forever, without ever formally naming or claiming the role it already functions as.`,
      invitation: `Claim one specific teaching or mentoring role today instead of continuing to offer it informally.`,
    },

    // ── 6 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_H1': {
      title: `6 in Paternal Feminine Line — The Lovers`,
      tagline: `A Design of the Heart's Choice`,
      mastery: `You carry a real capacity for partnership chosen from genuine desire, not obligation.`,
      shadow: `You let your relationship choices run on duty and expectation rather than your own actual wanting.`,
      invitation: `Name today what you actually want in partnership, separate from what's expected of you.`,
    },

    // ── 7 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_H1': {
      title: `7 in Paternal Feminine Line — The Chariot`,
      tagline: `A Design of the Single Thread`,
      mastery: `You carry real, genuine drive toward ambitious goals.`,
      shadow: `Your ambitions have a pattern of stalling or getting abandoned just short of the finish line.`,
      invitation: `Push one currently stalled goal forward today, toward its actual completion.`,
    },

    // ── 8 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_H1': {
      title: `8 in Paternal Feminine Line — Justice`,
      tagline: `A Design of the Lived Repair`,
      mastery: `You carry a real, sharp sensitivity to unfairness.`,
      shadow: `That sensitivity reacts to present situations with an intensity that belongs to something older, unresolved, and unnamed.`,
      invitation: `Name, as specifically as you can today, what the original unfairness in your paternal feminine line actually was.`,
    },

    // ── 9 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_H1': {
      title: `9 in Paternal Feminine Line — The Hermit`,
      tagline: `A Design of the Unreachable Hour`,
      mastery: `You carry a real need for withdrawal, reflection, and solitary space.`,
      shadow: `You fill every available space with obligation to others, unable to justify solitude even when it's genuinely needed.`,
      invitation: `Claim one period of genuine solitude today without justifying it as productive first.`,
    },

    // ── 10 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_H1': {
      title: `10 in Paternal Feminine Line — Wheel of Fortune`,
      tagline: `A Design of the Grieved Plan`,
      mastery: `You carry a real capacity to weather life's unpredictable turns.`,
      shadow: `You treat every uncontrollable turn as personal injustice rather than simply how life moves.`,
      invitation: `Name one circumstance today genuinely beyond your control, and choose acceptance over resistance to it.`,
    },

    // ── 11 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_H1': {
      title: `11 in Paternal Feminine Line — Strength`,
      tagline: `A Design of the Affordable Tenderness`,
      mastery: `You carry real, genuine resilience and strength.`,
      shadow: `You express that strength only as endurance, cut off from the compassionate strength that's actually available underneath.`,
      invitation: `Lead one difficult moment today with visible compassion standing alongside your strength.`,
    },

    // ── 12 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_H1': {
      title: `12 in Paternal Feminine Line — The Hanged Man`,
      tagline: `A Design of the Full Share`,
      mastery: `You carry a real capacity for care and devotion to others.`,
      shadow: `Your own needs go perpetually unconsidered underneath that devotion, so thoroughly you struggle to even name them.`,
      invitation: `Name one of your own needs today, directly, and prioritize it, even briefly.`,
    },

    // ── 13 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_H1': {
      title: `13 in Paternal Feminine Line — Transformation`,
      tagline: `A Design of the Welcomed Shift`,
      mastery: `You carry a real capacity to meet necessary change directly.`,
      shadow: `You grip tightly to something you already know has run its course, simply because letting go feels dangerous.`,
      invitation: `Identify one ending that's clearly due in your life today, and meet it directly.`,
    },

    // ── 14 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_H1': {
      title: `14 in Paternal Feminine Line — Temperance`,
      tagline: `A Design of the Quiet Rhythm`,
      mastery: `You carry a real capacity for commitment and sustained effort.`,
      shadow: `You alternate sharply between overexertion and equally intense collapse or depletion, with nothing steady in between.`,
      invitation: `Choose one small, sustainable practice today and hold it steadily, resisting either extreme.`,
    },

    // ── 15 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_H1': {
      title: `15 in Paternal Feminine Line — The Devil`,
      tagline: `A Design of the New Resource`,
      mastery: `You carry a real capacity to recognize and release what binds you.`,
      shadow: `You accept some pattern, role, or obligation as simply how things are, never questioned, never approached as changeable.`,
      invitation: `Name your own version of the bind honestly today, and take one concrete step toward loosening it.`,
    },

    // ── 16 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_H1': {
      title: `16 in Paternal Feminine Line — The Tower`,
      tagline: `A Design of the Last Beam`,
      mastery: `You carry a real capacity to rebuild fully after loss.`,
      shadow: `You hold back from fully investing in something stable, still bracing for a collapse that already happened once, long ago.`,
      invitation: `Fully invest in one area of stability today, without holding back in anticipation of its collapse.`,
    },

    // ── 17 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_H1': {
      title: `17 in Paternal Feminine Line — The Star`,
      tagline: `A Design of the Carried Hope`,
      mastery: `You carry a real capacity for genuine hope and faith in a better future.`,
      shadow: `You default to reflexive cynicism, protecting against disappointment at the cost of ever genuinely believing things could improve.`,
      invitation: `Name one genuine hope you actually hold today, out loud, and act on it.`,
    },

    // ── 18 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_H1': {
      title: `18 in Paternal Feminine Line — The Moon`,
      tagline: `A Design of the Faced Fear`,
      mastery: `You carry a real capacity to see clearly what's been operating in the background.`,
      shadow: `An unnamed anxiety shapes your decisions from the background without ever being examined directly.`,
      invitation: `Name, as specifically as possible, one fear that's been operating in the background, and look at it directly today.`,
    },

    // ── 19 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_H1': {
      title: `19 in Paternal Feminine Line — The Sun`,
      tagline: `A Design of Worn Happiness`,
      mastery: `You carry a real capacity for genuine joy and warmth.`,
      shadow: `You keep that joy behind a composed surface, felt more than it's ever actually shown.`,
      invitation: `Let one moment of real joy today be visibly, openly expressed, without your usual composure.`,
    },

    // ── 20 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_H1': {
      title: `20 in Paternal Feminine Line — Judgement`,
      tagline: `A Design of the First Yes`,
      mastery: `You carry a real, clearly sensed calling.`,
      shadow: `You keep delaying it, treating recognizing the call as though it were the same as answering it.`,
      invitation: `Take one concrete first step today toward the calling you already recognize.`,
    },

    // ── 21 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_H1': {
      title: `21 in Paternal Feminine Line — The World`,
      tagline: `A Design of the Written Ending`,
      mastery: `You carry real, sustained capacity for effort and progress.`,
      shadow: `The finish line keeps moving just out of reach, treated as always one step further than wherever you currently are.`,
      invitation: `Identify one genuinely near-complete effort today, and deliberately close it out.`,
    },

    // ── 22 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_H1': {
      title: `22 in Paternal Feminine Line — The Fool`,
      tagline: `A Design of Spent Freedom`,
      mastery: `You carry a real, genuine desire for freedom, adventure, and an unconventional path.`,
      shadow: `You default to the secure option reflexively, even in situations where the risk would actually be worth taking.`,
      invitation: `Choose the freer, less conventional option today in one specific situation, instead of defaulting to safety.`,
    },

    // ── 1 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_I1': {
      title: `1 in Maternal Feminine Line — The Magician`,
      tagline: `A Design of the Possible Version`,
      mastery: `You carry a real, inherited pull to initiate a venture your mother's mother wanted but never actually began.`,
      shadow: `You keep almost-launching something significant without ever fully committing to it.`,
      invitation: `Take one real, committed step today on the venture you keep almost-starting.`,
    },

    // ── 2 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_I1': {
      title: `2 in Maternal Feminine Line — The High Priestess`,
      tagline: `A Design of the Choice by Instinct`,
      mastery: `You carry real, sharp intuition, inherited from a woman who was never given permission to trust her own instinct.`,
      shadow: `You override a strong instinct the moment it can't be logically justified, silencing exactly what should be trusted.`,
      invitation: `Act on one genuine instinct today without requiring a rational case for it first.`,
    },

    // ── 3 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_I1': {
      title: `3 in Maternal Feminine Line — The Empress`,
      tagline: `A Design of the Real Room`,
      mastery: `You carry real creative and generative capacity, inherited from a woman circumstance never let express beyond the domestic sphere.`,
      shadow: `You keep your gifts small and contained, trimmed down out of an old, unexamined caution.`,
      invitation: `Express your creativity or generosity today at its full scale, in one specific setting, without shrinking it.`,
    },

    // ── 4 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_I1': {
      title: `4 in Maternal Feminine Line — The Emperor`,
      tagline: `A Design of Unasked Permission`,
      mastery: `You carry real leadership capability, capable of holding visible authority in your own name.`,
      shadow: `You exercise real capability from behind the scenes, never claiming it openly as leadership in its own right.`,
      invitation: `Take on one piece of real, visible responsibility today, and lead it openly rather than managing it quietly.`,
    },

    // ── 5 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_I1': {
      title: `5 in Maternal Feminine Line — The Hierophant`,
      tagline: `A Design of the Spoken Lesson`,
      mastery: `You carry a real pull toward teaching, mentorship, or guidance.`,
      shadow: `You offer that guidance informally, forever, without ever formally naming or claiming the role it already functions as.`,
      invitation: `Claim one specific teaching or mentoring role today instead of continuing to offer it informally.`,
    },

    // ── 6 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_I1': {
      title: `6 in Maternal Feminine Line — The Lovers`,
      tagline: `A Design of the Heart's Love`,
      mastery: `You carry a real capacity for partnership chosen from genuine desire, not obligation.`,
      shadow: `You let your relationship choices run on duty and expectation rather than your own actual wanting.`,
      invitation: `Name today what you actually want in partnership, separate from what's expected of you.`,
    },

    // ── 7 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_I1': {
      title: `7 in Maternal Feminine Line — The Chariot`,
      tagline: `A Design of Her Goal in Your Dialect`,
      mastery: `You carry real, genuine drive toward ambitious goals.`,
      shadow: `Your ambitions have a pattern of stalling or getting abandoned just short of the finish line.`,
      invitation: `Push one currently stalled goal forward today, toward its actual completion.`,
    },

    // ── 8 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_I1': {
      title: `8 in Maternal Feminine Line — Justice`,
      tagline: `A Design of the Pattern That Ends`,
      mastery: `You carry a real, sharp sensitivity to unfairness.`,
      shadow: `That sensitivity reacts to present situations with an intensity that belongs to something older, unresolved, and unnamed.`,
      invitation: `Name, as specifically as you can today, what the original unfairness in your maternal feminine line actually was.`,
    },

    // ── 9 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_I1': {
      title: `9 in Maternal Feminine Line — The Hermit`,
      tagline: `A Design of the Granted Stillness`,
      mastery: `You carry a real need for withdrawal, reflection, and solitary space.`,
      shadow: `You fill every available space with obligation to others, unable to justify solitude even when it's genuinely needed.`,
      invitation: `Claim one period of genuine solitude today without justifying it as productive first.`,
    },

    // ── 10 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_I1': {
      title: `10 in Maternal Feminine Line — Wheel of Fortune`,
      tagline: `A Design of the Honored Grief`,
      mastery: `You carry a real capacity to weather life's unpredictable turns.`,
      shadow: `You treat every uncontrollable turn as personal injustice rather than simply how life moves.`,
      invitation: `Name one circumstance today genuinely beyond your control, and choose acceptance over resistance to it.`,
    },

    // ── 11 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_I1': {
      title: `11 in Maternal Feminine Line — Strength`,
      tagline: `A Design of Soft Persistence`,
      mastery: `You carry real, genuine resilience and strength.`,
      shadow: `You express that strength only as endurance, cut off from the compassionate strength that's actually available underneath.`,
      invitation: `Lead one difficult moment today with visible compassion standing alongside your strength.`,
    },

    // ── 12 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_I1': {
      title: `12 in Maternal Feminine Line — The Hanged Man`,
      tagline: `A Design of the Deliberate Receiving`,
      mastery: `You carry a real capacity for care and devotion to others.`,
      shadow: `Your own needs go perpetually unconsidered underneath that devotion, so thoroughly you struggle to even name them.`,
      invitation: `Name one of your own needs today, directly, and prioritize it, even briefly.`,
    },

    // ── 13 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_I1': {
      title: `13 in Maternal Feminine Line — Transformation`,
      tagline: `A Design of the Crossed Threshold`,
      mastery: `You carry a real capacity to meet necessary change directly.`,
      shadow: `You grip tightly to something you already know has run its course, simply because letting go feels dangerous.`,
      invitation: `Identify one ending that's clearly due in your life today, and meet it directly.`,
    },

    // ── 14 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_I1': {
      title: `14 in Maternal Feminine Line — Temperance`,
      tagline: `A Design of the Laid-Down Extreme`,
      mastery: `You carry a real capacity for commitment and sustained effort.`,
      shadow: `You alternate sharply between overexertion and equally intense collapse or depletion, with nothing steady in between.`,
      invitation: `Choose one small, sustainable practice today and hold it steadily, resisting either extreme.`,
    },

    // ── 15 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_I1': {
      title: `15 in Maternal Feminine Line — The Devil`,
      tagline: `A Design of the Turned Key`,
      mastery: `You carry a real capacity to recognize and release what binds you.`,
      shadow: `You accept some pattern, role, or obligation as simply how things are, never questioned, never approached as changeable.`,
      invitation: `Name your own version of the bind honestly today, and take one concrete step toward loosening it.`,
    },

    // ── 16 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_I1': {
      title: `16 in Maternal Feminine Line — The Tower`,
      tagline: `A Design of Actual Flourishing`,
      mastery: `You carry a real capacity to rebuild fully after loss.`,
      shadow: `You hold back from fully investing in something stable, still bracing for a collapse that already happened once, long ago.`,
      invitation: `Fully invest in one area of stability today, without holding back in anticipation of its collapse.`,
    },

    // ── 17 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_I1': {
      title: `17 in Maternal Feminine Line — The Star`,
      tagline: `A Design of the Relit Hope`,
      mastery: `You carry a real capacity for genuine hope and faith in a better future.`,
      shadow: `You default to reflexive cynicism, protecting against disappointment at the cost of ever genuinely believing things could improve.`,
      invitation: `Name one genuine hope you actually hold today, out loud, and act on it.`,
    },

    // ── 18 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_I1': {
      title: `18 in Maternal Feminine Line — The Moon`,
      tagline: `A Design of the Named Fear`,
      mastery: `You carry a real capacity to see clearly what's been operating in the background.`,
      shadow: `An unnamed anxiety shapes your decisions from the background without ever being examined directly.`,
      invitation: `Name, as specifically as possible, one fear that's been operating in the background, and look at it directly today.`,
    },

    // ── 19 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_I1': {
      title: `19 in Maternal Feminine Line — The Sun`,
      tagline: `A Design of the Waited Audience`,
      mastery: `You carry a real capacity for genuine joy and warmth.`,
      shadow: `You keep that joy behind a composed surface, felt more than it's ever actually shown.`,
      invitation: `Let one moment of real joy today be visibly, openly expressed, without your usual composure.`,
    },

    // ── 20 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_I1': {
      title: `20 in Maternal Feminine Line — Judgement`,
      tagline: `A Design of the Rightful Heir`,
      mastery: `You carry a real, clearly sensed calling.`,
      shadow: `You keep delaying it, treating recognizing the call as though it were the same as answering it.`,
      invitation: `Take one concrete first step today toward the calling you already recognize.`,
    },

    // ── 21 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_I1': {
      title: `21 in Maternal Feminine Line — The World`,
      tagline: `A Design of This Week's Move`,
      mastery: `You carry real, sustained capacity for effort and progress.`,
      shadow: `The finish line keeps moving just out of reach, treated as always one step further than wherever you currently are.`,
      invitation: `Identify one genuinely near-complete effort today, and deliberately close it out.`,
    },

    // ── 22 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_I1': {
      title: `22 in Maternal Feminine Line — The Fool`,
      tagline: `A Design of the Imagined Tuesday`,
      mastery: `You carry a real, genuine desire for freedom, adventure, and an unconventional path.`,
      shadow: `You default to the secure option reflexively, even in situations where the risk would actually be worth taking.`,
      invitation: `Choose the freer, less conventional option today in one specific situation, instead of defaulting to safety.`,
    },


    // ── Lineage Square Talents: Paternal Spiritual Talent (F2) ─────────────

    '1_F2': {
      title: `1 in Paternal Spiritual Talent — The Magician`,
      tagline: `A Design of the Finished Thread`,
      mastery: `You carry a genuine capacity to originate belief, sparking conviction and practice from nothing.`,
      shadow: `You light new spiritual interests easily and let each one go cold the moment the initial charge fades.`,
      invitation: `Let one existing spiritual thread mature today instead of starting a new one.`,
    },

    '2_F2': {
      title: `2 in Paternal Spiritual Talent — The High Priestess`,
      tagline: `A Design of the Acted Knowing`,
      mastery: `You carry real intuitive certainty, an inner knowing that doesn't need to be explained to be trusted.`,
      shadow: `You keep that knowing so private it never gets tested or used.`,
      invitation: `Act today on one inherited knowing before you can fully defend it in words.`,
    },

    '3_F2': {
      title: `3 in Paternal Spiritual Talent — The Empress`,
      tagline: `A Design of the Outward Gift`,
      mastery: `You carry a real generosity of spirit — warmth and fertility of ideas that doesn't need to announce itself.`,
      shadow: `You keep that abundance internal, tending your rich inner world without ever letting it nourish anyone else.`,
      invitation: `Let your spiritual richness feed someone besides yourself today.`,
    },

    '4_F2': {
      title: `4 in Paternal Spiritual Talent — The Emperor`,
      tagline: `A Design of Flexible Scaffolding`,
      mastery: `You carry a real, sturdy framework of belief that lets faith stand upright through hard seasons.`,
      shadow: `You defend the structure itself rather than what it was built to hold, until the scaffolding matters more than the faith inside it.`,
      invitation: `Let one spiritual structure of yours flex today, without treating that flexibility as collapse.`,
    },

    '5_F2': {
      title: `5 in Paternal Spiritual Talent — The Hierophant`,
      tagline: `A Design of the Tested Teaching`,
      mastery: `You carry a real, specific body of teaching passed hand to hand.`,
      shadow: `You carry the doctrine unexamined, teaching what you were taught without testing it against your own lived experience.`,
      invitation: `Test one part of what you were handed today against what's actually proven true in your own life.`,
    },

    '6_F2': {
      title: `6 in Paternal Spiritual Talent — The Lovers`,
      tagline: `A Design of the Chosen Faith`,
      mastery: `You carry the real capacity to choose your beliefs deliberately, rather than merely receive them.`,
      shadow: `You go through the motions of choice while actually just accepting whatever was easiest or expected.`,
      invitation: `Choose one part of your inherited faith today, deliberately, as if you were choosing it fresh.`,
    },

    '7_F2': {
      title: `7 in Paternal Spiritual Talent — The Chariot`,
      tagline: `A Design of the Chosen Destination`,
      mastery: `You carry real, directed spiritual will and determination.`,
      shadow: `You apply that drive without ever pausing to check the direction, moving hard toward a goal that was set for you.`,
      invitation: `Slow down today long enough to steer the inherited drive toward a destination you've actually chosen.`,
    },

    '8_F2': {
      title: `8 in Paternal Spiritual Talent — Justice`,
      tagline: `A Design of the Same Standard`,
      mastery: `You carry a real, careful sense of moral balance and integrity.`,
      shadow: `You turn that fairness outward only, auditing everyone else's conduct while your own goes unexamined.`,
      invitation: `Apply your inherited standard of fairness to yourself today, as gently as you apply it to others.`,
    },

    '9_F2': {
      title: `9 in Paternal Spiritual Talent — The Hermit`,
      tagline: `A Design of the Returned Wisdom`,
      mastery: `You carry real understanding gained through solitude — withdrawal that produces depth rather than isolation.`,
      shadow: `You stay in the solitude past its purpose, gathering wisdom that never gets carried back out to anyone who could use it.`,
      invitation: `Bring one piece of your solitary understanding today to someone nearby who could actually use it.`,
    },

    '10_F2': {
      title: `10 in Paternal Spiritual Talent — Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `You carry a real capacity to read the turning of a spiritual season rather than fighting every downturn.`,
      shadow: `You forget that lesson under real pressure, treating every low season as proof everything is failing.`,
      invitation: `Meet today's low with curiosity about what it's clearing space for, instead of panic.`,
    },

    '11_F2': {
      title: `11 in Paternal Spiritual Talent — Strength`,
      tagline: `A Design of Unwitnessed Steadiness`,
      mastery: `You carry real inner steadiness that doesn't need an audience to be true.`,
      shadow: `You perform that strength for others rather than simply holding it privately.`,
      invitation: `Let one piece of your spiritual steadiness stay private today, with no audience or proof required.`,
    },

    '12_F2': {
      title: `12 in Paternal Spiritual Talent — The Hanged Man`,
      tagline: `A Design of the Discerned Pause`,
      mastery: `You carry real, hard-won patience through genuine suspension — waiting that teaches what standing still never could.`,
      shadow: `You mistake every pause for that same productive suspension, staying in stuck situations indefinitely because waiting once paid off.`,
      invitation: `Ask today whether your current waiting is still teaching you something, or has quietly become avoidance.`,
    },

    '13_F2': {
      title: `13 in Paternal Spiritual Talent — Transformation`,
      tagline: `A Design of the Completed Ending`,
      mastery: `You carry a real capacity to let a belief or identity actually die when its time has come.`,
      shadow: `You apply that willingness too readily, ending things prematurely just to avoid sitting with discomfort a little longer.`,
      invitation: `Let one ending complete fully today, without rushing it just to escape the discomfort.`,
    },

    '14_F2': {
      title: `14 in Paternal Spiritual Talent — Temperance`,
      tagline: `A Design of the New Blend`,
      mastery: `You carry a genuine, working balance between devotion and daily life, without needing a rulebook.`,
      shadow: `You treat that blend as fixed rather than living, applying an old formula to a life that has since changed shape.`,
      invitation: `Remix one part of your spiritual practice today instead of settling for the old, static mix.`,
    },

    '15_F2': {
      title: `15 in Paternal Spiritual Talent — The Devil`,
      tagline: `A Design of the Honest Reckoning`,
      mastery: `You carry a real capacity to face compulsion honestly enough to loosen its grip.`,
      shadow: `You repeat the pull unexamined, inheriting the compulsion without inheriting the honesty that once faced it.`,
      invitation: `Look directly today at one pull you've been carrying, and name what it's actually protecting you from feeling.`,
    },

    '16_F2': {
      title: `16 in Paternal Spiritual Talent — The Tower`,
      tagline: `A Design of the Honest Rebuild`,
      mastery: `You carry a real capacity to rebuild on more honest ground after a belief structure falls.`,
      shadow: `You fear collapse so much you avoid ever testing a belief that quietly needs it, propping up something you already suspect isn't sound.`,
      invitation: `Let one shaky belief fall on its own terms today, instead of defending it indefinitely.`,
    },

    '17_F2': {
      title: `17 in Paternal Spiritual Talent — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry a real, durable hope that keeps faith burning through hard seasons without needing evidence.`,
      shadow: `You keep that hope modest and private, as if believing too openly would be tempting fate.`,
      invitation: `Let one immodest hope be spoken today at its real size.`,
    },

    '18_F2': {
      title: `18 in Paternal Spiritual Talent — The Moon`,
      tagline: `A Design of the Sorted Feeling`,
      mastery: `You carry a real trust in the unexplainable — a felt spiritual undercurrent sensed before it can be proven.`,
      shadow: `You let that trust curdle into anxious, unverified story, mistaking every strong feeling for confirmed truth.`,
      invitation: `Hold today's spiritual sense as real without needing it verified, and name what it's actually pointing toward.`,
    },

    '19_F2': {
      title: `19 in Paternal Spiritual Talent — The Sun`,
      tagline: `A Design of Visible Delight`,
      mastery: `You carry a real, genuine joy that sits comfortably inside devotion.`,
      shadow: `You hide that joy behind a more solemn presentation, performing gravity because it feels more respectable.`,
      invitation: `Let one piece of spiritual joy be visible today, not just felt.`,
    },

    '20_F2': {
      title: `20 in Paternal Spiritual Talent — Judgement`,
      tagline: `A Design of the Early Rise`,
      mastery: `You carry a real capacity to recognize an unmistakable spiritual summons.`,
      shadow: `You hear the summons clearly and still find sophisticated reasons to keep preparing instead of rising to meet it.`,
      invitation: `Answer the calling today before you feel fully ready, with one concrete action.`,
    },

    '21_F2': {
      title: `21 in Paternal Spiritual Talent — The World`,
      tagline: `A Design of the Named Arrival`,
      mastery: `You carry a real capacity for genuine spiritual completion.`,
      shadow: `You reach real integration and still find a reason it doesn't quite count as finished.`,
      invitation: `Name one spiritual milestone today as fully arrived, not almost.`,
    },

    '22_F2': {
      title: `22 in Paternal Spiritual Talent — The Fool`,
      tagline: `A Design of the Taken Leap`,
      mastery: `You carry a real capacity for faith as an act of daring — belief in possibility before it's safe to act on.`,
      shadow: `You inherit the belief in freedom without ever actually taking the leap it was pointing toward.`,
      invitation: `Take one real leap today with open eyes, and call it faith.`,
    },


    // ── Lineage Square Talents: Maternal Spiritual Talent (G2) ─────────────

    '1_G2': {
      title: `1 in Maternal Spiritual Talent — The Magician`,
      tagline: `A Design of the Matured Thread`,
      mastery: `You carry a genuine capacity to originate belief, sparking conviction and practice from nothing.`,
      shadow: `You light new spiritual interests easily and let each one cool before it ever deepens into anything lasting.`,
      invitation: `Let one existing spiritual thread mature today instead of starting a new one.`,
    },

    '2_G2': {
      title: `2 in Maternal Spiritual Talent — The High Priestess`,
      tagline: `A Design of the Trusted Sense`,
      mastery: `You carry real intuitive certainty, an inner knowing passed down as trust rather than explanation.`,
      shadow: `You keep that knowing so guarded it never gets tested.`,
      invitation: `Act today on one inherited knowing before it's provable.`,
    },

    '3_G2': {
      title: `3 in Maternal Spiritual Talent — The Empress`,
      tagline: `A Design of the Outward Warmth`,
      mastery: `You carry real warmth and generative richness that doesn't need to be announced to be true.`,
      shadow: `You keep that abundance entirely internal, tending your rich inner world without letting it feed anyone beyond yourself.`,
      invitation: `Let your spiritual richness nourish someone besides yourself today.`,
    },

    '4_G2': {
      title: `4 in Maternal Spiritual Talent — The Emperor`,
      tagline: `A Design of Flexible Structure`,
      mastery: `You carry a real, sturdy framework of belief that holds weight through hard seasons.`,
      shadow: `You defend the framework itself rather than what it was built to hold, until the scaffolding matters more than the faith inside it.`,
      invitation: `Let one spiritual structure of yours flex today, without treating that flexibility as collapse.`,
    },

    '5_G2': {
      title: `5 in Maternal Spiritual Talent — The Hierophant`,
      tagline: `A Design of the Renewed Teaching`,
      mastery: `You carry real, specific teaching, an actual doctrine passed hand to hand.`,
      shadow: `You carry the teaching unexamined, repeating what you were taught without testing it against your own lived experience.`,
      invitation: `Test one part of what you were handed today against what's actually proven true in your own life.`,
    },

    '6_G2': {
      title: `6 in Maternal Spiritual Talent — The Lovers`,
      tagline: `A Design of the Reclaimed Belief`,
      mastery: `You carry a real capacity to choose your beliefs deliberately, rather than merely receive them.`,
      shadow: `You go through the motions of choice while actually just accepting whatever was easiest or expected.`,
      invitation: `Choose one part of your inherited faith today, deliberately, as if choosing it fresh.`,
    },

    '7_G2': {
      title: `7 in Maternal Spiritual Talent — The Chariot`,
      tagline: `A Design of the Steered Momentum`,
      mastery: `You carry real, directed spiritual will and determination.`,
      shadow: `You apply that drive without checking the direction, moving hard toward a goal set for you rather than examined by you.`,
      invitation: `Slow down today long enough to steer the inherited drive toward a destination you've actually chosen.`,
    },

    '8_G2': {
      title: `8 in Maternal Spiritual Talent — Justice`,
      tagline: `A Design of the Gentle Verdict`,
      mastery: `You carry a real, careful sense of moral balance and integrity.`,
      shadow: `You turn that fairness outward only, auditing everyone else's conduct while your own goes unexamined.`,
      invitation: `Apply your inherited standard of fairness to yourself today, as gently as you apply it to others.`,
    },

    '9_G2': {
      title: `9 in Maternal Spiritual Talent — The Hermit`,
      tagline: `A Design of the Shared Depth`,
      mastery: `You carry real understanding gained through solitude — withdrawal that produces depth rather than isolation.`,
      shadow: `You stay in the solitude past its purpose, gathering wisdom that never gets carried back out to anyone who could use it.`,
      invitation: `Bring one piece of your solitary understanding today to someone nearby who could actually use it.`,
    },

    '10_G2': {
      title: `10 in Maternal Spiritual Talent — Wheel of Fortune`,
      tagline: `A Design of the Trusted Cycle`,
      mastery: `You carry a real capacity to read the turning of a spiritual season rather than fighting every downturn.`,
      shadow: `You forget that lesson under real pressure, treating every low season as proof everything is failing.`,
      invitation: `Meet today's low with curiosity about what it's clearing space for, instead of panic.`,
    },

    '11_G2': {
      title: `11 in Maternal Spiritual Talent — Strength`,
      tagline: `A Design of the Private Steadiness`,
      mastery: `You carry real inner steadiness that doesn't need an audience to be true.`,
      shadow: `You perform that strength for others rather than simply holding it privately.`,
      invitation: `Let one piece of your spiritual steadiness stay private today, with no audience required.`,
    },

    '12_G2': {
      title: `12 in Maternal Spiritual Talent — The Hanged Man`,
      tagline: `A Design of the Sorted Pause`,
      mastery: `You carry real, hard-won patience through genuine suspension — waiting that teaches what standing still never could.`,
      shadow: `You mistake every pause for that same productive suspension, staying stuck indefinitely because waiting once paid off.`,
      invitation: `Ask today whether your current waiting is still teaching you something, or has quietly become avoidance.`,
    },

    '13_G2': {
      title: `13 in Maternal Spiritual Talent — Transformation`,
      tagline: `A Design of the Full Ending`,
      mastery: `You carry a real capacity to let a belief or identity actually die when its time has come.`,
      shadow: `You apply that willingness too readily, ending things prematurely just to avoid sitting with discomfort a little longer.`,
      invitation: `Let one ending complete fully today, without rushing it just to escape the discomfort.`,
    },

    '14_G2': {
      title: `14 in Maternal Spiritual Talent — Temperance`,
      tagline: `A Design of the Remixed Balance`,
      mastery: `You carry a genuine, working balance between devotion and daily life, without needing a rulebook.`,
      shadow: `You treat that blend as fixed rather than living, applying an old formula to a life that has since changed shape.`,
      invitation: `Remix one part of your spiritual practice today instead of settling for the old, static mix.`,
    },

    '15_G2': {
      title: `15 in Maternal Spiritual Talent — The Devil`,
      tagline: `A Design of the Direct Look`,
      mastery: `You carry a real capacity to face compulsion honestly enough to loosen its grip.`,
      shadow: `You repeat the pull unexamined, inheriting the compulsion without inheriting the honesty that once faced it.`,
      invitation: `Look directly today at one pull you've been carrying, and name what it's actually protecting you from feeling.`,
    },

    '16_G2': {
      title: `16 in Maternal Spiritual Talent — The Tower`,
      tagline: `A Design of the Allowed Fall`,
      mastery: `You carry a real capacity to rebuild on more honest ground after a belief structure falls.`,
      shadow: `You fear collapse so much you avoid testing a belief that quietly needs it, propping up something you already suspect isn't sound.`,
      invitation: `Let one shaky belief fall on its own terms today, instead of defending it indefinitely.`,
    },

    '17_G2': {
      title: `17 in Maternal Spiritual Talent — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `You carry a real, durable hope that keeps faith burning through hard seasons without needing evidence.`,
      shadow: `You keep that hope modest and private, as if believing too openly would be tempting fate.`,
      invitation: `Let one immodest hope be spoken today at its real size.`,
    },

    '18_G2': {
      title: `18 in Maternal Spiritual Talent — The Moon`,
      tagline: `A Design of the Sorted Undercurrent`,
      mastery: `You carry a real trust in the unexplainable, sensing spiritual meaning before it can be proven.`,
      shadow: `You let that trust curdle into anxious, unverified story, mistaking every strong feeling for confirmed truth.`,
      invitation: `Hold today's spiritual sense as real without needing it verified, and name what it's actually pointing toward.`,
    },

    '19_G2': {
      title: `19 in Maternal Spiritual Talent — The Sun`,
      tagline: `A Design of Visible Delight`,
      mastery: `You carry a real, genuine joy that sits comfortably inside devotion.`,
      shadow: `You hide that joy behind a more solemn presentation, performing gravity because it feels more respectable.`,
      invitation: `Let one piece of spiritual joy be visible today, not just felt.`,
    },

    '20_G2': {
      title: `20 in Maternal Spiritual Talent — Judgement`,
      tagline: `A Design of the Early Rise`,
      mastery: `You carry a real capacity to recognize an unmistakable spiritual summons.`,
      shadow: `You hear the summons clearly and still find sophisticated reasons to keep preparing instead of rising to meet it.`,
      invitation: `Answer the calling today before you feel fully ready, with one concrete action.`,
    },

    '21_G2': {
      title: `21 in Maternal Spiritual Talent — The World`,
      tagline: `A Design of the Landed Arrival`,
      mastery: `You carry a real capacity for genuine spiritual completion.`,
      shadow: `You reach real integration and still find a reason it doesn't quite count as finished.`,
      invitation: `Name one spiritual milestone today as fully arrived, not almost.`,
    },

    '22_G2': {
      title: `22 in Maternal Spiritual Talent — The Fool`,
      tagline: `A Design of the Real Leap`,
      mastery: `You carry a real capacity for faith as an act of daring — belief in possibility before it's safe to act on.`,
      shadow: `You inherit the belief in freedom without ever actually taking the leap it was pointing toward.`,
      invitation: `Take one real leap today with open eyes, and call it faith.`,
    },


    // ── Lineage Square Talents: Paternal Material Talent (H2) ───────────────

    '1_H2': {
      title: `1 in Paternal Material Talent — The Magician`,
      tagline: `A Design of the Carried Venture`,
      mastery: `You carry real, practical originating ability — launching a venture from bare circumstances.`,
      shadow: `You start many things and finish few, spending the inherited spark on the exciting opening and losing interest once the harder building begins.`,
      invitation: `Carry one material venture past its beginning today, into the less glamorous part.`,
    },

    '2_H2': {
      title: `2 in Paternal Material Talent — The High Priestess`,
      tagline: `A Design of the Acted Read`,
      mastery: `You carry a real practical instinct that reads a financial situation correctly before the facts confirm it.`,
      shadow: `You trust that instinct so privately it never gets acted on.`,
      invitation: `Act on one practical instinct today and let the numbers catch up.`,
    },

    '3_H2': {
      title: `3 in Paternal Material Talent — The Empress`,
      tagline: `A Design of the Included Provider`,
      mastery: `You carry real, instinctive material generosity, making sure people are fed and cared for.`,
      shadow: `You provide for everyone except yourself, so your own material comfort quietly goes unattended.`,
      invitation: `Let yourself be materially cared for today, the way you care for others.`,
    },

    '4_H2': {
      title: `4 in Paternal Material Talent — The Emperor`,
      tagline: `A Design of the Serving Structure`,
      mastery: `You carry real structural competence, building systems sturdy enough to actually last.`,
      shadow: `You build structures so rigid they become a burden to maintain, existing mainly to be defended.`,
      invitation: `Let one material structure serve you today instead of requiring constant defense.`,
    },

    '5_H2': {
      title: `5 in Paternal Material Talent — The Hierophant`,
      tagline: `A Design of the Named Expertise`,
      mastery: `You carry real, practical know-how, learned by doing rather than by certificate.`,
      shadow: `You undervalue the skill precisely because it wasn't formally credentialed.`,
      invitation: `Name one untaught skill of yours today as the real expertise it actually is.`,
    },

    '6_H2': {
      title: `6 in Paternal Material Talent — The Lovers`,
      tagline: `A Design of the Kept Clarity`,
      mastery: `You carry a real clarity about what matters materially, one that held under genuine scarcity.`,
      shadow: `You let that clarity fade the moment resources become comfortable.`,
      invitation: `Keep one piece of hard-won clarity active today, even though it isn't currently required.`,
    },

    '7_H2': {
      title: `7 in Paternal Material Talent — The Chariot`,
      tagline: `A Design of the Added Hand`,
      mastery: `You carry real, self-directed material drive, moving a goal forward alone.`,
      shadow: `You refuse help even when it's genuinely offered, treating solo determination as the only legitimate way forward.`,
      invitation: `Let one hand in today on something you'd normally steer entirely alone.`,
    },

    '8_H2': {
      title: `8 in Paternal Material Talent — Justice`,
      tagline: `A Design of the Included Share`,
      mastery: `You carry a real, careful sense of material fairness, dividing resources and credit honestly.`,
      shadow: `You apply that fairness to everyone except yourself, leaving your own share consistently smallest.`,
      invitation: `Include yourself today in one fair division you'd normally shortchange yourself on.`,
    },

    '9_H2': {
      title: `9 in Paternal Material Talent — The Hermit`,
      tagline: `A Design of the Shared Task`,
      mastery: `You carry real, solitary material competence, managing responsibility capably alone.`,
      shadow: `You stay solitary in it even when company would genuinely help.`,
      invitation: `Let one material task be witnessed or shared today instead of carried alone.`,
    },

    '10_H2': {
      title: `10 in Paternal Material Talent — Wheel of Fortune`,
      tagline: `A Design of the Received Upswing`,
      mastery: `You carry real endurance through material cycles, weathering booms and busts without being wrecked.`,
      shadow: `You brace so hard against the next downturn that you can't actually receive or enjoy the current upswing.`,
      invitation: `Let one genuine upswing today actually land as good, instead of bracing through it.`,
    },

    '11_H2': {
      title: `11 in Paternal Material Talent — Strength`,
      tagline: `A Design of the Trusted Softness`,
      mastery: `You carry real gentleness under material pressure, softness that endures rather than hardens.`,
      shadow: `You mistake that gentleness for weakness under your own current strain, hardening reflexively instead.`,
      invitation: `Trust one piece of your gentleness today to hold, instead of hardening reflexively.`,
    },

    '12_H2': {
      title: `12 in Paternal Material Talent — The Hanged Man`,
      tagline: `A Design of the Small Push`,
      mastery: `You carry real patience for slow material circumstances that resolve on their own timing.`,
      shadow: `You apply that patience to situations that actually need a push, mistaking stalling for waiting.`,
      invitation: `Nudge one slow material circumstance today instead of only waiting it out.`,
    },

    '13_H2': {
      title: `13 in Paternal Material Talent — Transformation`,
      tagline: `A Design of Early Renovation`,
      mastery: `You carry a real capacity to rebuild material ground from close to nothing.`,
      shadow: `You wait for an actual collapse to use the gift, letting things get worse than necessary first.`,
      invitation: `Renovate or secure one material thing today, before ruin forces it.`,
    },

    '14_H2': {
      title: `14 in Paternal Material Talent — Temperance`,
      tagline: `A Design of Unstretched Margin`,
      mastery: `You carry a real, practical skill for making scarce resources genuinely go further.`,
      shadow: `You keep stretching resources even when stretching is no longer necessary, stuck in old scarcity-mode.`,
      invitation: `Let one piece of margin be margin today, without stretching it out of habit.`,
    },

    '15_H2': {
      title: `15 in Paternal Material Talent — The Devil`,
      tagline: `A Design of the Examined Power`,
      mastery: `You carry a real, honest capacity to wrestle with material power rather than pretend the question is simple.`,
      shadow: `You inherit the discomfort around power without the honest examination, avoiding material authority altogether.`,
      invitation: `Hold one piece of material power today and examine your own motive for using it, directly.`,
    },

    '16_H2': {
      title: `16 in Paternal Material Talent — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real resilience, having survived a genuine material or financial collapse.`,
      shadow: `You keep that collapse unprocessed, only survived, never actually talked through.`,
      invitation: `Speak today, even partially, about the collapse that was never talked through.`,
    },

    '17_H2': {
      title: `17 in Paternal Material Talent — The Star`,
      tagline: `A Design of the Grown Hope`,
      mastery: `You carry a real, persistent hope for better material circumstances.`,
      shadow: `You keep that hope permanently modest even once circumstances could support something larger.`,
      invitation: `Let one material hope grow today to match what's actually possible now.`,
    },

    '18_H2': {
      title: `18 in Paternal Material Talent — The Moon`,
      tagline: `A Design of the Named Dread`,
      mastery: `You carry a real, felt financial fear, passed down as atmosphere rather than explanation.`,
      shadow: `You let that felt worry run your decisions without ever checking it against your actual current circumstances.`,
      invitation: `Translate one financial worry into words today, and test it against your real current situation.`,
    },

    '19_H2': {
      title: `19 in Paternal Material Talent — The Sun`,
      tagline: `A Design of Unconditional Warmth`,
      mastery: `You carry real, intact warmth, generous and present even through material hardship.`,
      shadow: `You assume the warmth should be reserved until things are materially easier.`,
      invitation: `Let your warmth show today, regardless of current material conditions.`,
    },

    '20_H2': {
      title: `20 in Paternal Material Talent — Judgement`,
      tagline: `A Design of the Claimed Potential`,
      mastery: `You carry a real, sensed material potential, bigger than circumstances ever let your line pursue.`,
      shadow: `You keep finding reasons to wait for better conditions before claiming it yourself.`,
      invitation: `Answer the material calling today with what you actually have available now.`,
    },

    '21_H2': {
      title: `21 in Paternal Material Talent — The World`,
      tagline: `A Design of the Named Finish`,
      mastery: `You carry a real capacity to reach genuine material completion.`,
      shadow: `You reach real success and still find a reason it doesn't count as finished.`,
      invitation: `Let one almost-done material thing today actually be called finished.`,
    },

    '22_H2': {
      title: `22 in Paternal Material Talent — The Fool`,
      tagline: `A Design of the Own-Sized Risk`,
      mastery: `You carry a real, calculated boldness — a family skill for well-placed material risk.`,
      shadow: `You inherit caution instead of the boldness, letting old fear override a genuinely good opportunity.`,
      invitation: `Size today's material risk with your own eyes, not the inherited caution.`,
    },


    // ── Lineage Square Talents: Maternal Material Talent (I2) ───────────────

    '1_I2': {
      title: `1 in Maternal Material Talent — The Magician`,
      tagline: `A Design of the Carried Venture`,
      mastery: `You carry real, practical originating ability — launching a venture from bare circumstances.`,
      shadow: `You start many things and finish few, spending the inherited spark on the exciting opening and losing interest once the harder building begins.`,
      invitation: `Carry one material venture past its beginning today, into the less glamorous part.`,
    },

    '2_I2': {
      title: `2 in Maternal Material Talent — The High Priestess`,
      tagline: `A Design of the Acted Instinct`,
      mastery: `You carry a real practical instinct that reads a financial situation correctly before the facts confirm it.`,
      shadow: `You trust that instinct so privately it never gets acted on.`,
      invitation: `Act on one practical instinct today and let the numbers catch up.`,
    },

    '3_I2': {
      title: `3 in Maternal Material Talent — The Empress`,
      tagline: `A Design of the Included Provider`,
      mastery: `You carry real, instinctive material generosity, making sure people are fed and cared for.`,
      shadow: `You provide for everyone except yourself, so your own material comfort quietly goes unattended.`,
      invitation: `Let yourself be materially cared for today, the way you care for others.`,
    },

    '4_I2': {
      title: `4 in Maternal Material Talent — The Emperor`,
      tagline: `A Design of the Shared Job`,
      mastery: `You carry real organizing competence, quietly holding the household economy together.`,
      shadow: `You hold that job forever without ever being relieved of it, since no one else was ever asked to share it.`,
      invitation: `Let one piece of the organizing be shared today instead of held alone.`,
    },

    '5_I2': {
      title: `5 in Maternal Material Talent — The Hierophant`,
      tagline: `A Design of the Named Expertise`,
      mastery: `You carry real, practical know-how, learned by doing rather than by certificate.`,
      shadow: `You undervalue the skill precisely because it wasn't formally credentialed.`,
      invitation: `Name one untaught skill of yours today as the real expertise it actually is.`,
    },

    '6_I2': {
      title: `6 in Maternal Material Talent — The Lovers`,
      tagline: `A Design of the Kept Clarity`,
      mastery: `You carry a real clarity about what matters materially, one that held under genuine scarcity.`,
      shadow: `You let that clarity fade the moment resources become comfortable.`,
      invitation: `Keep one piece of hard-won clarity active today, even though it isn't currently required.`,
    },

    '7_I2': {
      title: `7 in Maternal Material Talent — The Chariot`,
      tagline: `A Design of the Added Hand`,
      mastery: `You carry real, self-directed material drive, moving a goal forward alone.`,
      shadow: `You refuse help even when it's genuinely offered, treating solo determination as the only legitimate way forward.`,
      invitation: `Let one hand in today on something you'd normally steer entirely alone.`,
    },

    '8_I2': {
      title: `8 in Maternal Material Talent — Justice`,
      tagline: `A Design of the Included Share`,
      mastery: `You carry a real, careful sense of material fairness, dividing resources and credit honestly.`,
      shadow: `You apply that fairness to everyone except yourself, leaving your own share consistently smallest.`,
      invitation: `Include yourself today in one fair division you'd normally shortchange yourself on.`,
    },

    '9_I2': {
      title: `9 in Maternal Material Talent — The Hermit`,
      tagline: `A Design of the Shared Task`,
      mastery: `You carry real, solitary material competence, managing responsibility capably alone.`,
      shadow: `You stay solitary in it even when company would genuinely help.`,
      invitation: `Let one material task be witnessed or shared today instead of carried alone.`,
    },

    '10_I2': {
      title: `10 in Maternal Material Talent — Wheel of Fortune`,
      tagline: `A Design of the Received Upswing`,
      mastery: `You carry real endurance through material cycles, weathering ups and downs without being wrecked.`,
      shadow: `You brace so hard against the next downturn that you can't actually receive or enjoy the current upswing.`,
      invitation: `Let one genuine upswing today actually land as good, instead of bracing through it.`,
    },

    '11_I2': {
      title: `11 in Maternal Material Talent — Strength`,
      tagline: `A Design of the Trusted Softness`,
      mastery: `You carry real gentleness under material pressure, softness that endures rather than hardens.`,
      shadow: `You mistake that gentleness for weakness under your own current strain, hardening reflexively instead.`,
      invitation: `Trust one piece of your gentleness today to hold, instead of hardening reflexively.`,
    },

    '12_I2': {
      title: `12 in Maternal Material Talent — The Hanged Man`,
      tagline: `A Design of the Small Push`,
      mastery: `You carry real patience for slow material circumstances that resolve on their own timing.`,
      shadow: `You apply that patience to situations that actually need a push, mistaking stalling for waiting.`,
      invitation: `Nudge one slow material circumstance today instead of only waiting it out.`,
    },

    '13_I2': {
      title: `13 in Maternal Material Talent — Transformation`,
      tagline: `A Design of Early Renovation`,
      mastery: `You carry a real capacity to rebuild material ground from close to nothing.`,
      shadow: `You wait for an actual collapse to use the gift, letting things get worse than necessary first.`,
      invitation: `Renovate or secure one material thing today, before ruin forces it.`,
    },

    '14_I2': {
      title: `14 in Maternal Material Talent — Temperance`,
      tagline: `A Design of Unstretched Margin`,
      mastery: `You carry a real, practical skill for making scarce resources genuinely go further.`,
      shadow: `You keep stretching resources even when stretching is no longer necessary, stuck in old scarcity-mode.`,
      invitation: `Let one piece of margin be margin today, without stretching it out of habit.`,
    },

    '15_I2': {
      title: `15 in Maternal Material Talent — The Devil`,
      tagline: `A Design of the Examined Dependence`,
      mastery: `You carry a real, honest capacity to wrestle with material dependence rather than pretend independence is always possible.`,
      shadow: `You inherit the discomfort around dependence without the honest examination, refusing support altogether.`,
      invitation: `Accept one piece of support today, and examine the discomfort directly instead of avoiding it.`,
    },

    '16_I2': {
      title: `16 in Maternal Material Talent — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real resilience, having survived a genuine material or financial loss.`,
      shadow: `You keep that loss unprocessed, only survived, never actually talked through.`,
      invitation: `Speak today, even partially, about the loss that was never talked through.`,
    },

    '17_I2': {
      title: `17 in Maternal Material Talent — The Star`,
      tagline: `A Design of the Grown Hope`,
      mastery: `You carry a real, persistent hope for better material circumstances.`,
      shadow: `You keep that hope permanently modest even once circumstances could support something larger.`,
      invitation: `Let one material hope grow today to match what's actually possible now.`,
    },

    '18_I2': {
      title: `18 in Maternal Material Talent — The Moon`,
      tagline: `A Design of the Named Unease`,
      mastery: `You carry a real, felt financial fear, passed down as atmosphere rather than explanation.`,
      shadow: `You let that felt worry run your decisions without ever checking it against your actual current circumstances.`,
      invitation: `Translate one financial worry into words today, and test it against your real current situation.`,
    },

    '19_I2': {
      title: `19 in Maternal Material Talent — The Sun`,
      tagline: `A Design of Unconditional Warmth`,
      mastery: `You carry real, intact warmth, generous and present even through material hardship.`,
      shadow: `You assume the warmth should be reserved until things are materially easier.`,
      invitation: `Let your warmth show today, regardless of current material conditions.`,
    },

    '20_I2': {
      title: `20 in Maternal Material Talent — Judgement`,
      tagline: `A Design of the Claimed Potential`,
      mastery: `You carry a real, sensed material potential, bigger than circumstances ever let your line pursue.`,
      shadow: `You keep finding reasons to wait for better conditions before claiming it yourself.`,
      invitation: `Answer the material calling today with what you actually have available now.`,
    },

    '21_I2': {
      title: `21 in Maternal Material Talent — The World`,
      tagline: `A Design of Counted Enough`,
      mastery: `You carry a real capacity to reach genuine material sufficiency.`,
      shadow: `You reach real stability and still find a reason it doesn't count as enough.`,
      invitation: `Count what you already have today, honestly, as enough right now.`,
    },

    '22_I2': {
      title: `22 in Maternal Material Talent — The Fool`,
      tagline: `A Design of the Own-Sized Risk`,
      mastery: `You carry a real, calculated boldness — a family skill for well-placed material risk.`,
      shadow: `You inherit caution instead of the boldness, letting old fear override a genuinely good opportunity.`,
      invitation: `Size today's material risk with your own eyes, not the inherited caution.`,
    },


    // ── Heart Zone: Spiritual Desire, vertical line (HZV) ──────────────────

    '1_HZV': {
      title: `1 in Spiritual Desire — The Magician`,
      tagline: `A Design of the Self-Authored Life`,
      mastery: `Your heart wants to author its own destiny, guided by intuition rather than instruction.`,
      shadow: `You do what looks right instead of what feels true, and the gap runs underneath everything as a quiet static.`,
      invitation: `Make one choice today from your own intuitive pull, rather than the expected script.`,
    },

    '2_HZV': {
      title: `2 in Spiritual Desire — The High Priestess`,
      tagline: `A Design of the Believed Knowing`,
      mastery: `Your heart wants to trust its own intuition enough to actually live by it.`,
      shadow: `You second-guess a clear sense and wait for outside confirmation before it counts as real.`,
      invitation: `Believe one inner knowing today without asking anyone to confirm it first.`,
    },

    '3_HZV': {
      title: `3 in Spiritual Desire — The Empress`,
      tagline: `A Design of Purposeful Loveliness`,
      mastery: `Your heart wants harmony, beauty, and connection — a nurturing life, not just a productive one.`,
      shadow: `You end up productive and surrounded by very little beauty, quietly starving the part that wanted loveliness.`,
      invitation: `Let one ordinary moment today be beautiful on purpose.`,
    },

    '4_HZV': {
      title: `4 in Spiritual Desire — The Emperor`,
      tagline: `A Design of the Built Foundation`,
      mastery: `Your heart wants a real, felt stability — security managed through conscious choice, not control.`,
      shadow: `You control everything in sight because nothing underneath ever feels sturdy enough to relax into.`,
      invitation: `Build one small, real piece of structure today rather than gripping the whole picture.`,
    },

    '5_HZV': {
      title: `5 in Spiritual Desire — The Hierophant`,
      tagline: `A Design of the Lived Teaching`,
      mastery: `Your heart wants to belong to something larger and hand real wisdom forward.`,
      shadow: `You collect teachings without ever letting any of them actually change you.`,
      invitation: `Choose one teaching you've already collected and actually live by it today.`,
    },

    '6_HZV': {
      title: `6 in Spiritual Desire — The Lovers`,
      tagline: `A Design of the Named Depth`,
      mastery: `Your heart wants real, deep spiritual connection — love felt at its fullest, not just its most convenient.`,
      shadow: `You settle for adequate connection while quietly starving for the deep kind, afraid wanting more makes you ungrateful.`,
      invitation: `Name today, honestly, what depth of connection you actually want.`,
    },

    '7_HZV': {
      title: `7 in Spiritual Desire — The Chariot`,
      tagline: `A Design of the Registered Proof`,
      mastery: `Your heart wants the felt certainty that no obstacle is actually final.`,
      shadow: `You stay in constant motion that never proves the point, since proving requires stopping to notice you've arrived.`,
      invitation: `Let one recent obstacle count today as evidence you're already unstoppable.`,
    },

    '8_HZV': {
      title: `8 in Spiritual Desire — Justice`,
      tagline: `A Design of the Included Standard`,
      mastery: `Your heart wants integrity as a way of living, not just a standard applied to others.`,
      shadow: `You keep a private tally of everyone else's unfairness while your own conduct goes unexamined.`,
      invitation: `Apply today's fairness standard to yourself first.`,
    },

    '9_HZV': {
      title: `9 in Spiritual Desire — The Hermit`,
      tagline: `A Design of the Chosen Hour`,
      mastery: `Your heart wants a real inner journey — solitude deep enough to reach genuine understanding.`,
      shadow: `You stay busy specifically to avoid the solitude that would actually deliver what you're craving.`,
      invitation: `Take one real hour of chosen solitude today.`,
    },

    '10_HZV': {
      title: `10 in Spiritual Desire — Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `Your heart wants to accept change as it arrives and stay in the flow rather than fighting every shift.`,
      shadow: `You treat every downturn as a verdict, white-knuckling each low point instead of trusting it will turn.`,
      invitation: `Meet today's specific change with curiosity instead of resistance.`,
    },

    '11_HZV': {
      title: `11 in Spiritual Desire — Strength`,
      tagline: `A Design of Gentle Courage`,
      mastery: `Your heart wants to let real transformation happen through love rather than force.`,
      shadow: `You grip harder at exactly the moments gentleness was actually being asked for.`,
      invitation: `Meet one current fear today with softness instead of force.`,
    },

    '12_HZV': {
      title: `12 in Spiritual Desire — The Hanged Man`,
      tagline: `A Design of the New Vantage`,
      mastery: `Your heart wants to view its own life from a genuinely different angle — surrender as perspective, not defeat.`,
      shadow: `You grip the old vantage point precisely because surrendering it feels like losing control entirely.`,
      invitation: `Let one current situation today be seen from an angle you haven't tried yet.`,
    },

    '13_HZV': {
      title: `13 in Spiritual Desire — Transformation`,
      tagline: `A Design of the Willing Ending`,
      mastery: `Your heart wants to release old identities and be genuinely reborn — transformation as a wanted thing.`,
      shadow: `You hold an identity long past its natural life because letting it go feels like losing yourself entirely.`,
      invitation: `Name one identity today that's actually ready to end.`,
    },

    '14_HZV': {
      title: `14 in Spiritual Desire — Temperance`,
      tagline: `A Design of the Working Blend`,
      mastery: `Your heart wants integration — the different parts of you actually working together.`,
      shadow: `You oscillate hard between extremes and call the alternation "balance."`,
      invitation: `Find one small blend today instead of choosing one extreme.`,
    },

    '15_HZV': {
      title: `15 in Spiritual Desire — The Devil`,
      tagline: `A Design of the Honest Look`,
      mastery: `Your heart wants to face its own darkness honestly rather than pretend it isn't there.`,
      shadow: `You perform a cleaner version of yourself while the actual desire runs quietly underneath.`,
      invitation: `Name one real desire or compulsion honestly today, without judgment.`,
    },

    '16_HZV': {
      title: `16 in Spiritual Desire — The Tower`,
      tagline: `A Design of the Real Fall`,
      mastery: `Your heart wants real, structural change — an actual spiritual rebirth, not a minor adjustment.`,
      shadow: `You make small, cosmetic changes that leave the old pattern's foundation completely intact.`,
      invitation: `Let one old pattern today actually fall, rather than patching it again.`,
    },

    '17_HZV': {
      title: `17 in Spiritual Desire — The Star`,
      tagline: `A Design of Visible Hope`,
      mastery: `Your heart wants to shine spiritually and actually live in a way that inspires others.`,
      shadow: `You hope quietly and privately, as if letting hope be seen would be presumptuous.`,
      invitation: `Let one piece of your hope be visible today.`,
    },

    '18_HZV': {
      title: `18 in Spiritual Desire — The Moon`,
      tagline: `A Design of the Followed Feeling`,
      mastery: `Your heart wants to actually understand its own spiritual mysteries, not leave them unexamined.`,
      shadow: `You stay at the surface of a feeling because going deeper feels like it might reveal too much.`,
      invitation: `Follow one recurring feeling today all the way to its actual source.`,
    },

    '19_HZV': {
      title: `19 in Spiritual Desire — The Sun`,
      tagline: `A Design of Unmanaged Joy`,
      mastery: `Your heart wants joy that's whole, expressed completely, without editing.`,
      shadow: `You perform lightness while the real joy stays muted, as if full expression would be too much.`,
      invitation: `Let one piece of real joy show today, unmanaged.`,
    },

    '20_HZV': {
      title: `20 in Spiritual Desire — Judgement`,
      tagline: `A Design of Full Release`,
      mastery: `Your heart wants to release the burdens of the past completely, not partially.`,
      shadow: `You carry the same old weight while telling yourself you've already mostly dealt with it.`,
      invitation: `Name one piece of the past today that's actually still being carried.`,
    },

    '21_HZV': {
      title: `21 in Spiritual Desire — The World`,
      tagline: `A Design of the Felt Landing`,
      mastery: `Your heart wants the actual feeling of completion, not just another achievement checked off.`,
      shadow: `You reach real milestones and still feel like something essential hasn't quite landed.`,
      invitation: `Let one genuine accomplishment today actually be felt as complete.`,
    },

    '22_HZV': {
      title: `22 in Spiritual Desire — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `Your heart wants to be completely free — to leap without a net and stay open to new experience.`,
      shadow: `You call caution wisdom, closing off the very openness your heart was actually asking to keep alive.`,
      invitation: `Take one small, real leap today, with open eyes.`,
    },


    // ── Heart Zone: Material Desire, horizontal line (HZH) ─────────────────

    '1_HZH': {
      title: `1 in Material Desire — The Magician`,
      tagline: `A Design of Earned Ground`,
      mastery: `Your heart wants tangible achievement — a real, self-made place in the world.`,
      shadow: `You generate idea after idea while none of them ever becomes the actual solid place you were building toward.`,
      invitation: `Carry one material venture today past its beginning, toward something you can actually stand on.`,
    },

    '2_HZH': {
      title: `2 in Material Desire — The High Priestess`,
      tagline: `A Design of the Landed Impression`,
      mastery: `Your heart wants to leave a real, unmistakable impression — quiet but genuine influence.`,
      shadow: `You stay so guarded that the impression never actually lands.`,
      invitation: `Share one piece of what you know today with someone who's actually earned it.`,
    },

    '3_HZH': {
      title: `3 in Material Desire — The Empress`,
      tagline: `A Design of Domestic Richness`,
      mastery: `Your heart wants a genuinely abundant home — comfort, luxury, and real beauty, not just enough to get by.`,
      shadow: `You run an efficient home that has nothing lovely in it, function standing in for the abundance you actually wanted.`,
      invitation: `Add one real piece of beauty to your home or daily life today.`,
    },

    '4_HZH': {
      title: `4 in Material Desire — The Emperor`,
      tagline: `A Design of Real Ground`,
      mastery: `Your heart wants durable, respected standing — genuine financial security, actually earned.`,
      shadow: `You chase the appearance of authority while the actual security underneath stays thin.`,
      invitation: `Build one piece of real financial ground today, not just its appearance.`,
    },

    '5_HZH': {
      title: `5 in Material Desire — The Hierophant`,
      tagline: `A Design of Lived Credibility`,
      mastery: `Your heart wants real, earned standing rooted in something larger than yourself.`,
      shadow: `You collect credentials that look respectable without ever building the actual respect they were meant to represent.`,
      invitation: `Use one credential you already have today to actually do something respected.`,
    },

    '6_HZH': {
      title: `6 in Material Desire — The Lovers`,
      tagline: `A Design of Built Depth`,
      mastery: `Your heart wants love that's felt, not just described — real, deep bonds actually lived.`,
      shadow: `You keep a relationship that looks passionate from the outside while the actual bond underneath stays thin.`,
      invitation: `Deepen one real bond today rather than performing its appearance.`,
    },

    '7_HZH': {
      title: `7 in Material Desire — The Chariot`,
      tagline: `A Design of the Named Victory`,
      mastery: `Your heart wants real, earned achievement — victories won through motion, not standing still.`,
      shadow: `You generate motion without any actual victories, momentum mistaken for the achievement it was supposed to produce.`,
      invitation: `Name one concrete victory today you're actually driving toward.`,
    },

    '8_HZH': {
      title: `8 in Material Desire — Justice`,
      tagline: `A Design of Enacted Fairness`,
      mastery: `Your heart wants real fairness enacted, not just believed in privately.`,
      shadow: `You hold strong opinions about fairness while never actually using your position to change anything.`,
      invitation: `Use whatever standing you have today to correct one real unfairness.`,
    },

    '9_HZH': {
      title: `9 in Material Desire — The Hermit`,
      tagline: `A Design of Sized Retreat`,
      mastery: `Your heart wants real retreat into its own inner world — individual discovery actually pursued.`,
      shadow: `You stay constantly busy in the noise of your own responsibilities, retreat postponed as impractical.`,
      invitation: `Take one real day of retreat this month, sized to what's actually possible.`,
    },

    '10_HZH': {
      title: `10 in Material Desire — Wheel of Fortune`,
      tagline: `A Design of the Full Reception`,
      mastery: `Your heart wants to actually make the most of life's opportunities as they arrive.`,
      shadow: `Good opportunities arrive and go unused because you're too busy bracing for the next downturn.`,
      invitation: `Receive one current piece of good fortune today fully, without bracing for its opposite.`,
    },

    '11_HZH': {
      title: `11 in Material Desire — Strength`,
      tagline: `A Design of Real Vitality`,
      mastery: `Your heart wants embodied, magnetic resilience — real physical endurance and vitality.`,
      shadow: `You perform strength outwardly while your actual physical vitality goes quietly neglected.`,
      invitation: `Do one real act of physical care today, actual tending rather than performance.`,
    },

    '12_HZH': {
      title: `12 in Material Desire — The Hanged Man`,
      tagline: `A Design of the Finished Pause`,
      mastery: `Your heart wants a genuine pause allowed to do its full transformative work.`,
      shadow: `You rush through the pause to get back to normal, skipping the transformation it was there to produce.`,
      invitation: `Let one current pause today last exactly as long as it needs to.`,
    },

    '13_HZH': {
      title: `13 in Material Desire — Transformation`,
      tagline: `A Design of the Real Demolition`,
      mastery: `Your heart wants a completely renewed lifestyle — the old genuinely torn down.`,
      shadow: `You renovate the surface of your material life while the actual old structure stays fully intact.`,
      invitation: `Tear down one real piece of an old structure today, not just its surface.`,
    },

    '14_HZH': {
      title: `14 in Material Desire — Temperance`,
      tagline: `A Design of the Serving Act`,
      mastery: `Your heart wants real, felt integration across body, mind, and spirit.`,
      shadow: `You manage each area separately and reasonably well, but the actual felt integration never quite arrives.`,
      invitation: `Find one act today that serves body, mind, and spirit together instead of separately.`,
    },

    '15_HZH': {
      title: `15 in Material Desire — The Devil`,
      tagline: `A Design of the Honest Want`,
      mastery: `Your heart wants real passion, pleasure, and wealth, held honestly rather than apologetically.`,
      shadow: `You either deny the desire outright or chase it so unconsciously it curdles into compulsion.`,
      invitation: `Name your actual desire for power or pleasure honestly today, and choose consciously how to pursue it.`,
    },

    '16_HZH': {
      title: `16 in Material Desire — The Tower`,
      tagline: `A Design of the Let-Go Structure`,
      mastery: `Your heart craves a genuinely new beginning — old structures destroyed, not incrementally adjusted.`,
      shadow: `You brace against necessary collapse so hard that the new beginning never actually gets to arrive.`,
      invitation: `Let one already-failing structure today actually finish falling, instead of propping it up.`,
    },

    '17_HZH': {
      title: `17 in Material Desire — The Star`,
      tagline: `A Design of Shared Creativity`,
      mastery: `Your heart wants to actually be an inspiring presence, sharing creative work rather than keeping it private.`,
      shadow: `You make beautiful things privately while the inspiring, shared version never actually gets offered.`,
      invitation: `Share one piece of your creative work today with someone.`,
    },

    '18_HZH': {
      title: `18 in Material Desire — The Moon`,
      tagline: `A Design of Lived Enchantment`,
      mastery: `Your heart wants enchantment actually lived, a life genuinely touched by mystery.`,
      shadow: `You admire mystery and art from a safe, tidy distance without ever letting them shape anything real.`,
      invitation: `Let one real dream or hunch today actually influence a decision.`,
    },

    '19_HZH': {
      title: `19 in Material Desire — The Sun`,
      tagline: `A Design of Undivided Wholeness`,
      mastery: `Your heart wants happiness, success, health, and love all at once, not one traded for another.`,
      shadow: `You succeed in one domain while quietly sacrificing another, treating the trade as inevitable.`,
      invitation: `Give real attention today to the one domain you'd been quietly sacrificing.`,
    },

    '20_HZH': {
      title: `20 in Material Desire — Judgement`,
      tagline: `A Design of Total Renewal`,
      mastery: `Your heart yearns for a completely fresh start, not a lightened version of the old life.`,
      shadow: `You make moderate improvements while calling them a fresh start.`,
      invitation: `Name what a truly fresh material start would require today, and take one real step toward it.`,
    },

    '21_HZH': {
      title: `21 in Material Desire — The World`,
      tagline: `A Design of Lived Breadth`,
      mastery: `Your heart wants to actually travel and live a genuinely successful, fulfilling life, not just imagine one.`,
      shadow: `You plan a bigger life indefinitely while the actual, lived version keeps getting pushed to some more convenient year.`,
      invitation: `Book, plan, or start one real piece of the bigger life today.`,
    },

    '22_HZH': {
      title: `22 in Material Desire — The Fool`,
      tagline: `A Design of the Overdue Adventure`,
      mastery: `Your heart seeks genuine freedom, lived — new places and people, explored rather than merely imagined.`,
      shadow: `You stay inside a rigid system out of practicality, telling yourself the adventurous life is simply for later.`,
      invitation: `Take one real, unplanned adventure today, however small.`,
    },


    // ── Chakra Map: Muladhara, Root Chakra (MUL) ────────────────────────────

    '1_MUL': {
      title: `1 in Root Chakra — The Magician`,
      tagline: `A Design of Settled Ground`,
      mastery: `Your sense of safety comes from real capability — knowing you can generate what you need out of nothing.`,
      shadow: `You stay in perpetual-start mode, never letting the ground actually settle, because stillness feels unsafe.`,
      invitation: `Let yourself be held today by what you've already built, without starting something new to prove it.`,
    },

    '2_MUL': {
      title: `2 in Root Chakra — The High Priestess`,
      tagline: `A Design of Visible Certainty`,
      mastery: `Your sense of safety comes from a trusted inner knowing that doesn't need outside verification.`,
      shadow: `That security stays entirely private, so hidden it can be mistaken for absence rather than depth.`,
      invitation: `Let your quiet certainty be visible today, to at least one person.`,
    },

    '3_MUL': {
      title: `3 in Root Chakra — The Empress`,
      tagline: `A Design of Included Needs`,
      mastery: `Your sense of safety comes from genuine, felt provision — resources, warmth, a home that holds you.`,
      shadow: `You measure your safety only by how much you're providing for others, your own needs going unattended.`,
      invitation: `Include one of your own basic needs today in the abundance you create for others.`,
    },

    '4_MUL': {
      title: `4 in Root Chakra — The Emperor`,
      tagline: `A Design of Trusted Structure`,
      mastery: `Your sense of safety comes from order — systems and routines sturdy enough that you don't have to monitor them constantly.`,
      shadow: `Maintaining the structure becomes a full-time job, exhausting to uphold in a way that defeats its own purpose.`,
      invitation: `Build or trust one piece of structure today durable enough to hold itself, without your constant oversight.`,
    },

    '5_MUL': {
      title: `5 in Root Chakra — The Hierophant`,
      tagline: `A Design of Separated Belief`,
      mastery: `Your sense of safety comes from belonging — tradition, community, a shared framework larger than any one day.`,
      shadow: `That belonging becomes the whole foundation, so questioning any part of the tradition feels like losing the ground.`,
      invitation: `Separate your security today from one single belief, so the ground survives it being questioned.`,
    },

    '6_MUL': {
      title: `6 in Root Chakra — The Lovers`,
      tagline: `A Design of Recognized Belonging`,
      mastery: `Your sense of safety comes from felt, mutual connection — knowing you're wanted, not just tolerated.`,
      shadow: `You chase the feeling of being chosen so hard you accept relationships that don't actually offer it.`,
      invitation: `Notice today where you're already genuinely chosen, and let that be enough ground.`,
    },

    '7_MUL': {
      title: `7 in Root Chakra — The Chariot`,
      tagline: `A Design of Trusted Stillness`,
      mastery: `Your sense of safety comes from momentum — purposeful direction that makes the ground feel solid.`,
      shadow: `Stillness starts to feel like danger, every pause reading as the ground itself giving way.`,
      invitation: `Rest today for one real stretch, and notice the ground is still there.`,
    },

    '8_MUL': {
      title: `8 in Root Chakra — Justice`,
      tagline: `A Design of Rooted Integrity`,
      mastery: `Your sense of safety comes from balance — a world where what's owed gets paid.`,
      shadow: `Any unfairness, even small, can feel like the whole ground shifting.`,
      invitation: `Root your security today in your own integrity, rather than the world's cooperation.`,
    },

    '9_MUL': {
      title: `9 in Root Chakra — The Hermit`,
      tagline: `A Design of the Held Return`,
      mastery: `Your sense of safety comes from chosen retreat — real time alone to actually settle.`,
      shadow: `The retreat becomes permanent, security purchased at the price of connection you still need.`,
      invitation: `Return today from solitude and stay grounded in company, letting relationship not threaten it.`,
    },

    '10_MUL': {
      title: `10 in Root Chakra — Wheel of Fortune`,
      tagline: `A Design of Mid-Cycle Trust`,
      mastery: `Your sense of safety comes from accepting that things cycle — trust that a low point will actually turn.`,
      shadow: `Every downturn still feels like proof the ground has given way, even when you know it's just a phase.`,
      invitation: `Meet today's low point with the trust you already have in theory, before the turn arrives.`,
    },

    '11_MUL': {
      title: `11 in Root Chakra — Strength`,
      tagline: `A Design of Unwitnessed Resilience`,
      mastery: `Your sense of safety comes from real, quiet endurance that doesn't need an audience.`,
      shadow: `You turn that endurance into a performance, needing witnesses to confirm the resilience is real.`,
      invitation: `Let your endurance be private again today, unwitnessed, and trust it's still real.`,
    },

    '12_MUL': {
      title: `12 in Root Chakra — The Hanged Man`,
      tagline: `A Design of the Released Grip`,
      mastery: `Your sense of safety comes, paradoxically, from surrender — trusting the situation enough to stop gripping it.`,
      shadow: `The surrender turns into passivity, a permanent suspension mistaken for the release that was actually needed.`,
      invitation: `Release your grip today on one specific thing, and notice the ground holds anyway.`,
    },

    '13_MUL': {
      title: `13 in Root Chakra — Transformation`,
      tagline: `A Design of the Full Timeline`,
      mastery: `Your sense of safety comes from real transformation — the capacity to end things and be renewed.`,
      shadow: `You end things prematurely, mistaking discomfort for a signal the chapter must be over.`,
      invitation: `Let one ending today complete at its actual pace, rather than rushing it for relief.`,
    },

    '14_MUL': {
      title: `14 in Root Chakra — Temperance`,
      tagline: `A Design of the Actual Blend`,
      mastery: `Your sense of safety comes from genuine integration — body, mind, and circumstance actually working together.`,
      shadow: `You mistake alternating between extremes for balance itself.`,
      invitation: `Find one small, actually blended version today of two things you'd been alternating between.`,
    },

    '15_MUL': {
      title: `15 in Root Chakra — The Devil`,
      tagline: `A Design of the Named Compulsion`,
      mastery: `Your sense of safety comes from honest reckoning with your own compulsions and desires.`,
      shadow: `You perform a cleaner version of yourself while an unexamined pull runs quietly underneath.`,
      invitation: `Name one real compulsion honestly today, without judgment.`,
    },

    '16_MUL': {
      title: `16 in Root Chakra — The Tower`,
      tagline: `A Design of Rested Reconstruction`,
      mastery: `Your sense of safety comes from having already survived structural collapse and rebuilt.`,
      shadow: `You brace permanently for the next collapse, never actually resting in what you've already rebuilt.`,
      invitation: `Trust today's current structure without checking it for cracks.`,
    },

    '17_MUL': {
      title: `17 in Root Chakra — The Star`,
      tagline: `A Design of Full-Sized Hope`,
      mastery: `Your sense of safety comes from faith in a better outcome, hope itself as a stabilizing force.`,
      shadow: `You keep that hope so modest and private it barely functions as ground at all.`,
      invitation: `Let your hope today be as large and visible as it actually is.`,
    },

    '18_MUL': {
      title: `18 in Root Chakra — The Moon`,
      tagline: `A Design of the Verified Feeling`,
      mastery: `Your sense of safety comes from a felt sense beneath the surface, an accurate intuition about atmosphere.`,
      shadow: `That felt sense curdles into anxious story, every strong feeling treated as confirmed danger.`,
      invitation: `Check one strong feeling today against real evidence before treating it as settled fact.`,
    },

    '19_MUL': {
      title: `19 in Root Chakra — The Sun`,
      tagline: `A Design of Honest Warmth`,
      mastery: `Your sense of safety comes from vitality and open warmth, a felt sense that things are fundamentally good.`,
      shadow: `That warmth becomes a performance for others' comfort, leaving your harder feelings nowhere to land.`,
      invitation: `Let one difficult feeling be visible today alongside the warmth.`,
    },

    '20_MUL': {
      title: `20 in Root Chakra — Judgement`,
      tagline: `A Design of the Real Step`,
      mastery: `Your sense of safety comes from clarity acted on, rising decisively to do what's needed.`,
      shadow: `The clarity arrives and gets endlessly deferred, prepared-for instead of acted on.`,
      invitation: `Take one concrete action today toward the calling you've already heard clearly.`,
    },

    '21_MUL': {
      title: `21 in Root Chakra — The World`,
      tagline: `A Design of the Named Completion`,
      mastery: `Your sense of safety comes from completion — real, acknowledged arrival.`,
      shadow: `You reach real completion and immediately relativize it, adding one more condition before it counts.`,
      invitation: `Let one already-finished thing today actually be named as complete.`,
    },

    '22_MUL': {
      title: `22 in Root Chakra — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `Your sense of safety comes from openness to the unknown, faith in your own adaptability.`,
      shadow: `That openness becomes recklessness, leaping without discernment because the trust slips into avoiding preparation.`,
      invitation: `Take one real leap today while still keeping your eyes open.`,
    },


    // ── Chakra Map: Swadhisthana, Sacral Chakra (SWA) ───────────────────────

    '1_SWA': {
      title: `1 in Sacral Chakra — The Magician`,
      tagline: `A Design of the Stayed Pleasure`,
      mastery: `Your creative and sensual energy flows most freely at the start of things, the charge of a fresh idea or new attraction.`,
      shadow: `That pleasure fades exactly when things stop being new, so your flow depends entirely on novelty.`,
      invitation: `Stay with one pleasure today past its newness, and notice what's still there.`,
    },

    '2_SWA': {
      title: `2 in Sacral Chakra — The High Priestess`,
      tagline: `A Design of the Spoken Desire`,
      mastery: `Your creative and sensual energy flows through mystery, attraction that thrives on what's suggested rather than stated.`,
      shadow: `Everything stays so veiled that pleasure never quite gets to fully arrive, mystery becoming distance instead of allure.`,
      invitation: `Let one desire be spoken plainly today instead of only implied.`,
    },

    '3_SWA': {
      title: `3 in Sacral Chakra — The Empress`,
      tagline: `A Design of Included Senses`,
      mastery: `Your creative and sensual energy flows through richness, a body and life that feel genuinely fed.`,
      shadow: `That abundance flows outward only, generous with everyone's pleasure while your own goes quietly unattended.`,
      invitation: `Include your own senses today in the abundance you create for others.`,
    },

    '4_SWA': {
      title: `4 in Sacral Chakra — The Emperor`,
      tagline: `A Design of the Loosened Grip`,
      mastery: `Your creative and sensual energy flows through structure, a container sturdy enough to actually relax inside.`,
      shadow: `The control itself becomes the point, so tightly managed that spontaneous pleasure never gets room to happen.`,
      invitation: `Loosen your grip today on one small pleasure, and let it be unplanned.`,
    },

    '5_SWA': {
      title: `5 in Sacral Chakra — The Hierophant`,
      tagline: `A Design of Unjustified Delight`,
      mastery: `Your creative and sensual energy flows through belonging to something with real values, creation connected to purpose.`,
      shadow: `Pleasure gets policed so hard by what's "appropriate" that spontaneous enjoyment rarely survives the filter.`,
      invitation: `Let one pleasure today be enjoyed simply because it feels good, without justifying its meaning.`,
    },

    '6_SWA': {
      title: `6 in Sacral Chakra — The Lovers`,
      tagline: `A Design of Chosen Depth`,
      mastery: `Your creative and sensual energy flows through intimacy, genuine attraction and deep bonds.`,
      shadow: `You confuse intensity with intimacy, chasing the charge of a connection rather than its actual depth.`,
      invitation: `Choose depth over intensity today in one connection, and notice what that actually feels like.`,
    },

    '7_SWA': {
      title: `7 in Sacral Chakra — The Chariot`,
      tagline: `A Design of the Ordinary Win`,
      mastery: `Your creative and sensual energy flows through achievement and motion, pleasure tied to actually getting somewhere.`,
      shadow: `Pleasure only registers when you're winning, so ordinary, undramatic enjoyment barely counts as real.`,
      invitation: `Enjoy one small, undramatic pleasure today without it needing to be a victory.`,
    },

    '8_SWA': {
      title: `8 in Sacral Chakra — Justice`,
      tagline: `A Design of Unaudited Joy`,
      mastery: `Your creative and sensual energy flows through balance, pleasure that feels earned and evenly distributed.`,
      shadow: `You monitor fairness so closely you can't actually relax into pleasure without auditing whether you deserve it.`,
      invitation: `Enjoy one pleasure today without checking whether it's been earned first.`,
    },

    '9_SWA': {
      title: `9 in Sacral Chakra — The Hermit`,
      tagline: `A Design of Shared Depth`,
      mastery: `Your creative and sensual energy flows through solitude, real satisfaction found in your own inner world.`,
      shadow: `That solitude becomes so complete that shared pleasure, the kind that requires another person, gets avoided entirely.`,
      invitation: `Let one pleasure today be shared rather than solitary.`,
    },

    '10_SWA': {
      title: `10 in Sacral Chakra — Wheel of Fortune`,
      tagline: `A Design of the Trusted Quiet`,
      mastery: `Your creative and sensual energy flows in cycles, real abundance followed by quieter, equally legitimate stretches.`,
      shadow: `You fight the quiet stretches as though they were failures of pleasure, rather than trusting the rhythm.`,
      invitation: `Meet today's quiet stretch with patience instead of alarm.`,
    },

    '11_SWA': {
      title: `11 in Sacral Chakra — Strength`,
      tagline: `A Design of Unwitnessed Resilience`,
      mastery: `Your creative and sensual energy flows through quiet resilience, holding real intensity without needing anyone to witness it.`,
      shadow: `You perform that endurance for an audience, needing external confirmation to feel real.`,
      invitation: `Let your resilience be unwitnessed today, and trust it's still real.`,
    },

    '12_SWA': {
      title: `12 in Sacral Chakra — The Hanged Man`,
      tagline: `A Design of the Met Release`,
      mastery: `Your creative and sensual energy flows best through release rather than management.`,
      shadow: `The surrender turns into passivity, waiting indefinitely instead of actually meeting pleasure halfway.`,
      invitation: `Release your grip today on one specific outcome, and notice what pleasure actually shows up.`,
    },

    '13_SWA': {
      title: `13 in Sacral Chakra — Transformation`,
      tagline: `A Design of the Completed Ending`,
      mastery: `Your creative and sensual energy flows through real transformation, letting an old want end so a truer one can arrive.`,
      shadow: `You cling to an old source of pleasure well past its natural life, because ending it feels like losing joy altogether.`,
      invitation: `Let one outdated pleasure or desire today actually complete its ending.`,
    },

    '14_SWA': {
      title: `14 in Sacral Chakra — Temperance`,
      tagline: `A Design of the Real Blend`,
      mastery: `Your creative and sensual energy flows through actual integration, indulgence and discipline working together.`,
      shadow: `You swing hard between full indulgence and total restriction, mistaking the alternation for balance.`,
      invitation: `Find one small, genuinely blended pleasure today instead of choosing an extreme.`,
    },

    '15_SWA': {
      title: `15 in Sacral Chakra — The Devil`,
      tagline: `A Design of the Examined Craving`,
      mastery: `Your creative and sensual energy flows through honest confrontation with desire.`,
      shadow: `You either deny the desire entirely or chase it so unconsciously that pleasure curdles into compulsion.`,
      invitation: `Name one real desire honestly today, without judgment, and choose consciously whether to pursue it.`,
    },

    '16_SWA': {
      title: `16 in Sacral Chakra — The Tower`,
      tagline: `A Design of the Trusted Return`,
      mastery: `Your creative and sensual energy flows through renewal after upheaval, pleasure rediscovered once a structure has been rebuilt.`,
      shadow: `You fear pleasure itself after a collapse, treating enjoyment as risky because the last one arrived unannounced.`,
      invitation: `Let yourself enjoy one small thing today without waiting for proof it's safe.`,
    },

    '17_SWA': {
      title: `17 in Sacral Chakra — The Star`,
      tagline: `A Design of Visible Delight`,
      mastery: `Your creative and sensual energy flows through inspired hope, real joy found in making and dreaming.`,
      shadow: `You keep that creative joy modest and private, as if letting it be seen fully would be too much.`,
      invitation: `Let one piece of your creative joy be visible today, at full size.`,
    },

    '18_SWA': {
      title: `18 in Sacral Chakra — The Moon`,
      tagline: `A Design of Unresolved Enchantment`,
      mastery: `Your creative and sensual energy flows through the mysterious and the felt, pleasure connected to dreams and intuition.`,
      shadow: `The mystery curdles into anxious uncertainty, so pleasure gets tangled up with unease.`,
      invitation: `Let one mysterious pleasure today just be enjoyed, without needing to fully explain it.`,
    },

    '19_SWA': {
      title: `19 in Sacral Chakra — The Sun`,
      tagline: `A Design of Undimmed Delight`,
      mastery: `Your creative and sensual energy flows through unguarded happiness, expressed fully and openly.`,
      shadow: `You perform lightness while your deeper pleasure stays private and unexpressed.`,
      invitation: `Let one piece of real joy show today at full volume.`,
    },

    '20_SWA': {
      title: `20 in Sacral Chakra — Judgement`,
      tagline: `A Design of the Answered Call`,
      mastery: `Your creative and sensual energy flows through aligned action, real pleasure in finally doing what you sensed.`,
      shadow: `You sense the call clearly and still find reasons to delay acting on it.`,
      invitation: `Take one concrete step today toward what you already feel called to enjoy or create.`,
    },

    '21_SWA': {
      title: `21 in Sacral Chakra — The World`,
      tagline: `A Design of the Felt Enough`,
      mastery: `Your creative and sensual energy flows through real integration and arrival, a felt sense of wholeness.`,
      shadow: `You reach a genuinely fulfilling moment and immediately look for the next thing.`,
      invitation: `Let one already-fulfilling moment today actually be felt as enough.`,
    },

    '22_SWA': {
      title: `22 in Sacral Chakra — The Fool`,
      tagline: `A Design of the Open-Eyed Adventure`,
      mastery: `Your creative and sensual energy flows through openness to the unknown, real joy in trusting the flow.`,
      shadow: `That openness turns into recklessness, chasing every new sensation without real discernment.`,
      invitation: `Take one real, spontaneous pleasure today, chosen with open eyes rather than pure impulse.`,
    },


    // ── Yearly Energy Forecast (YE) — the one time-varying position ─────────

    '1_YE': {
      title: `1 in Yearly Energy — The Magician`,
      tagline: `A Design of the Carried Beginning`,
      mastery: `This stretch of your life is built for starting things, not finishing what's already comfortable.`,
      shadow: `You start five things and stay with none of them, mistaking the charge of a new idea for proof it's right.`,
      invitation: `Pick one beginning today and follow it past its first exciting moment.`,
    },

    '2_YE': {
      title: `2 in Yearly Energy — The High Priestess`,
      tagline: `A Design of the Acted Sense`,
      mastery: `This stretch of your life calls for listening inward rather than gathering more outside opinions.`,
      shadow: `You stay so private with your knowing that it never actually gets tested or acted on.`,
      invitation: `Act on one inner certainty today before you can fully justify it to anyone else.`,
    },

    '3_YE': {
      title: `3 in Yearly Energy — The Empress`,
      tagline: `A Design of Included Growth`,
      mastery: `This stretch of your life is built for nurturing, abundance, and letting something take its natural time.`,
      shadow: `You rush the growth, or pour so much outward that your own reserves quietly run thin.`,
      invitation: `Tend one thing patiently today, without forcing its pace, and include yourself in the nurturing.`,
    },

    '4_YE': {
      title: `4 in Yearly Energy — The Emperor`,
      tagline: `A Design of the Held Structure`,
      mastery: `This stretch of your life is for establishing real structure, not just improvised holding-together.`,
      shadow: `You grip control so tightly that the structure becomes a burden rather than support.`,
      invitation: `Build one piece of real, durable structure today, and let it hold without your constant oversight.`,
    },

    '5_YE': {
      title: `5 in Yearly Energy — The Hierophant`,
      tagline: `A Design of the Moved Knowledge`,
      mastery: `This stretch of your life is for engaging seriously with tradition, mentorship, or real knowledge.`,
      shadow: `You treat the knowledge as something to collect rather than actually apply and pass on.`,
      invitation: `Either learn one thing deeply today, or teach one thing you already know, fully.`,
    },

    '6_YE': {
      title: `6 in Yearly Energy — The Lovers`,
      tagline: `A Design of the Reclaimed Choice`,
      mastery: `This stretch of your life is for making a real, examined choice about a relationship or value.`,
      shadow: `You go through the motions of a choice already made by default, never consciously reclaiming it.`,
      invitation: `Name out loud today one choice you've been making silently by default.`,
    },

    '7_YE': {
      title: `7 in Yearly Energy — The Chariot`,
      tagline: `A Design of the Named Destination`,
      mastery: `This stretch of your life is for directed momentum, not just staying busy.`,
      shadow: `You move hard without checking the direction, mistaking speed itself for progress.`,
      invitation: `Name one specific destination today and aim your current momentum at it deliberately.`,
    },

    '8_YE': {
      title: `8 in Yearly Energy — Justice`,
      tagline: `A Design of the Self-Applied Standard`,
      mastery: `This stretch of your life is for addressing an imbalance honestly, including one close to home.`,
      shadow: `You apply that clarity outward only, auditing everyone else while your own conduct goes unexamined.`,
      invitation: `Apply today the same fair standard to yourself that you'd apply to anyone else.`,
    },

    '9_YE': {
      title: `9 in Yearly Energy — The Hermit`,
      tagline: `A Design of the Shared Return`,
      mastery: `This stretch of your life is for withdrawal and depth, not constant availability to everyone else.`,
      shadow: `You stay in the withdrawal past its purpose, gathering depth that never gets carried back out.`,
      invitation: `Take real, chosen solitude today, and bring back one thing you learn there to share.`,
    },

    '10_YE': {
      title: `10 in Yearly Energy — Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `This stretch of your life is a genuine turning, where trusting the timing matters more than forcing an outcome.`,
      shadow: `You treat a normal turn as a crisis, bracing hard against a downturn or refusing to trust an upswing.`,
      invitation: `Meet today's turn, up or down, with curiosity instead of alarm.`,
    },

    '11_YE': {
      title: `11 in Yearly Energy — Strength`,
      tagline: `A Design of the Private Holding`,
      mastery: `This stretch of your life is for holding steady through real pressure, gently rather than by force.`,
      shadow: `You perform unbreakability for an audience rather than simply, privately, holding steady.`,
      invitation: `Let your endurance be private today, and trust it doesn't need to be witnessed to be real.`,
    },

    '12_YE': {
      title: `12 in Yearly Energy — The Hanged Man`,
      tagline: `A Design of the Checked Pause`,
      mastery: `This stretch of your life is a suspension actually doing work, not stalling.`,
      shadow: `You mistake every pause for permission to avoid a decision indefinitely.`,
      invitation: `Check today whether your current pause is still teaching you something, or has become avoidance.`,
    },

    '13_YE': {
      title: `13 in Yearly Energy — Transformation`,
      tagline: `A Design of the Completed Ending`,
      mastery: `This stretch of your life is for a real ending, not a patched-over version of the same old thing.`,
      shadow: `You rush the ending to avoid discomfort, or refuse to let it happen at all.`,
      invitation: `Name one thing today that's actually ready to end, and let it complete at its own pace.`,
    },

    '14_YE': {
      title: `14 in Yearly Energy — Temperance`,
      tagline: `A Design of the Working Blend`,
      mastery: `This stretch of your life is for genuine integration between two things you've been treating as opposites.`,
      shadow: `You swing hard between extremes and call the alternation balance.`,
      invitation: `Find one small, actually blended version today of two things you've been keeping separate.`,
    },

    '15_YE': {
      title: `15 in Yearly Energy — The Devil`,
      tagline: `A Design of the Honest Reckoning`,
      mastery: `This stretch of your life is for facing a compulsion or attachment honestly, rather than pretending it isn't there.`,
      shadow: `You deny the pull entirely, which only tightens its grip.`,
      invitation: `Name one real compulsion or attachment honestly today, without shame.`,
    },

    '16_YE': {
      title: `16 in Yearly Energy — The Tower`,
      tagline: `A Design of the Honest Rebuild`,
      mastery: `This stretch of your life is real collapse followed by real rebuilding, on more honest ground.`,
      shadow: `You defend a structure you already suspect isn't sound, just to avoid the collapse.`,
      invitation: `Let one shaky structure fall today on its own terms, instead of propping it up further.`,
    },

    '17_YE': {
      title: `17 in Yearly Energy — The Star`,
      tagline: `A Design of the Full-Sized Hope`,
      mastery: `This stretch of your life is for real, visible hope, not a modest, private version of it.`,
      shadow: `You keep that hope quiet and shrunken, as if believing too openly would be tempting fate.`,
      invitation: `Let one hope be as large and visible today as it actually is.`,
    },

    '18_YE': {
      title: `18 in Yearly Energy — The Moon`,
      tagline: `A Design of the Checked Undercurrent`,
      mastery: `This stretch of your life is for trusting an undercurrent before it's fully provable.`,
      shadow: `You let that feeling curdle into anxious story instead of staying a genuine, worth-checking signal.`,
      invitation: `Hold one strong feeling today as real information, and check it gently against what's actually happening.`,
    },

    '19_YE': {
      title: `19 in Yearly Energy — The Sun`,
      tagline: `A Design of Undimmed Joy`,
      mastery: `This stretch of your life is for real, open happiness, not a managed or modest version of it.`,
      shadow: `You dim the joy for other people's comfort, keeping it smaller than it actually is.`,
      invitation: `Let one real joy show today at its full size, without managing it down.`,
    },

    '20_YE': {
      title: `20 in Yearly Energy — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `This stretch of your life is for actually rising to something you've already heard clearly.`,
      shadow: `You hear the calling clearly and still find sophisticated reasons to keep waiting.`,
      invitation: `Take one concrete step today toward the calling you've already heard.`,
    },

    '21_YE': {
      title: `21 in Yearly Energy — The World`,
      tagline: `A Design of the Named Arrival`,
      mastery: `This stretch of your life is for genuine completion, not another condition appended before something counts as done.`,
      shadow: `You reach real completion and immediately relativize it, finding a reason it doesn't quite count yet.`,
      invitation: `Let one already-finished thing today actually be called complete.`,
    },

    '22_YE': {
      title: `22 in Yearly Energy — The Fool`,
      tagline: `A Design of the Open-Eyed Leap`,
      mastery: `This stretch of your life is for beginning something with open eyes, trusting the unknown.`,
      shadow: `You inherit caution instead of boldness, letting an old fear override a genuinely good opportunity.`,
      invitation: `Take one real leap today, with your eyes open, rather than waiting for a guarantee.`,
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
