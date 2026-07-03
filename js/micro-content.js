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
 */

window.DMicroContent = (function () {

  // ── POSITION-SPECIFIC DEEP READINGS ──────────────────────────────────────
  // Keys: arcana number + "_" + node key  (e.g. "8_A", "5_B")

  const nodes = {

    // ── 8 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '8_A': {
      heading: `You Arrived Already Keeping the Score`,
      why: `You were born with an instinct for fairness that most people spend a lifetime developing. Before you say a word, people sense a kind of moral gravity in you — the sense that you're quietly reading a room for what's true, what's owed, what's out of balance. As a child, you were probably the one who noticed the inconsistency, who felt an injustice land in your body before you could explain why, who couldn't let a broken promise pass without something in you registering it. That's not you being difficult. That's Justice — the 8th Arcana — sitting in your Core Character, the persona you project before you even say a word. It gives you real steadiness, an honesty people learn to rely on, and a gut sense that every action eventually comes back around.`,
      shadow: `The same instinct that reads a room so accurately can slide into something harder: a habit of quietly judging everyone, including yourself, against a standard no one actually meets. You might catch yourself complaining, out loud or just internally, that people don't play fair, that the world keeps breaking its own rules — and the complaint becomes its own trap, keeping you locked in a fight with a reality that won't bend to your ledger. Here's the harder question worth asking: what does it say about you that this keeps happening? A life that keeps handing you broken promises and unpunished unfairness usually isn't bad luck — it's often an echo of something in you that's still bracing for injustice, or still keeping score in ways that make people want to hide their own. You might even notice yourself doing, in small ways, the very thing you can't stand in others — withholding, controlling, keeping tabs — which only invites more of the same back.`,
      path: `Try turning the scales inward before you turn them on the world. Not to punish yourself — that's not the point — but to actually check your own calibration. This is the less comfortable path, because it puts the responsibility for what you keep running into on you instead of on everyone else. But it's also the more empowering one, because it means the fairness you're looking for doesn't have to wait on the world to hand it to you. Start by noticing where imbalance keeps showing up — money, relationships, work — and instead of treating each one as more proof the world is unfair, ask what it's telling you about what you're still carrying. Real justice isn't a pile of verdicts against people who've wronged you. It's restoring your own internal balance — and that's the part that actually changes what starts showing up for you.`,
      positive: `Fairness comes easily to you, because your own sense of integrity is settled — the people, deals, and situations that honor that integrity are what you consistently draw toward yourself.`,
      negative: `Repeated run-ins with unfair people and broken promises aren't just bad luck — they're often being pulled toward you by something unresolved inside, a part of you still braced for injustice that keeps recreating exactly what it's trying to avoid.`,
    },

    // ── 1 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '1_A': {
      heading: `People Read You As Capable Before You've Done Anything`,
      why: `People sense competence radiating off you before you've done anything — a coiled readiness, the sense that you could make things happen if you decided to. That's the very first impression you make, the persona you carry into a room before a single word is spoken. The Magician sits in your Core Character to produce exactly this: the mask of the doer, the one who looks like they already have a plan. It's not performance, exactly — it really is how you're wired — but it is the specific way your character presents itself to the world, distinct from what's actually happening underneath.`,
      shadow: `The risk is that the persona outruns the person — you get cast, again and again, as "the capable one" in every room, and the role calcifies into an expectation you have to keep performing even on days you have nothing left to give. People stop asking if you're okay because you never look like you're not. If you keep ending up as everyone's default problem-solver while your own needs go quietly unasked-after, that's the cost of a persona too convincing for its own good.`,
      path: `Let your persona occasionally show the gap between "looks capable" and "is currently capable." That's not weakness — it's accuracy, and it gives people permission to actually see you instead of just your competence. The mask doesn't need to be dropped, just loosened enough that something real can show through it.`,
      positive: `You walk into rooms read as capable and ready, and because you let people see past that persona sometimes, they actually know you rather than just relying on you.`,
      negative: `A persona too convincing to crack means people keep leaning on your competence and never think to ask how you're actually doing.`,
    },

    // ── 2 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '2_A': {
      heading: `You Read as Someone Holding Something Back`,
      why: `You give off quiet depth before you've said a word — an unreadable quality that makes people sense there's more to you than what's on the surface, without being able to say exactly what. That's the very first impression you make. The High Priestess in your Core Character produces this persona of the keeper: composed, observant, giving away only what you choose to. People often feel like they have to earn access to you, and most of the time, they're right.`,
      shadow: `The risk is a persona so guarded it starts reading as coldness instead of depth — people mistaking your natural reserve for disinterest, and quietly deciding not to bother trying to get past it. If you keep meeting people who never really push to know you, that's less about them and more about a mask that's stopped signaling there's anything worth pushing for.`,
      path: `Let your face occasionally show what you actually know or feel, even briefly. You don't have to explain the depth — just stop hiding that it's there. A little visible warmth is what turns "unreadable" from a wall into an invitation.`,
      positive: `Your natural depth reads as quiet magnetism, and because you let a little of it show, people feel invited to get closer instead of turned away.`,
      negative: `A guarded persona that never signals warmth gets mistaken for coldness, and people stop trying to close the distance you didn't mean to create.`,
    },

    // ── 3 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '3_A': {
      heading: `People Relax the Moment You Walk In`,
      why: `People relax the moment you walk in, feeling instinctively cared for, comfortable, like there's room for them around you — and that warmth is the very first thing anyone registers about you. The Empress in your Core Character produces this nurturer's mask: soft where others are guarded, generous with attention, the kind of presence that makes people exhale. It's a real gift.`,
      shadow: `The risk is becoming everyone's emotional landing pad by default, cast as the caretaker in every room whether or not you signed up for it. People bring you their needs before they even ask if you have room for them, because the persona itself seems to be offering. If you're perpetually the one holding space and rarely the one being held, that's the warmth of your mask outpacing anyone's awareness of what's underneath it.`,
      path: `Let your persona include visible limits, not just visible warmth. Saying "I don't have capacity for that right now" doesn't undo the nurturing — it makes it sustainable, and it teaches people to actually see you as a person with needs, not just a resource.`,
      positive: `Your natural warmth puts people instantly at ease, and because you pair it with visible limits, the care you give doesn't quietly drain you dry.`,
      negative: `A persona that reads as endlessly available invites endless need, and without visible limits, you become everyone's landing pad and no one's equal.`,
    },

    // ── 4 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '4_A': {
      heading: `You Read as the One Who's Already in Charge`,
      why: `People sense authority off you before you've claimed any — a solidity, a sense that you're someone who holds things together. The Emperor in your Core Character gives you this persona of natural command: steady posture, decisive presence, the kind of energy that makes a room quietly organize itself around you. People often defer to you by instinct, sometimes before you've even offered an opinion.`,
      shadow: `The risk is a mask so commanding that people stop bringing you their actual thoughts, assuming you've already got it handled or won't want the input. That isolates you inside your own authority — surrounded by deference instead of real collaboration. If people keep agreeing with you a little too fast, that's often the persona doing the talking before anyone's had a chance to actually weigh in.`,
      path: `Practice visibly inviting disagreement, not just tolerating it if it happens to arrive. Ask a real question and then actually wait. The authority isn't at risk — what changes is whether people believe you want their real answer, not just their compliance.`,
      positive: `You carry natural authority and actively invite real input, so the people around you bring you their honest thinking instead of just their agreement.`,
      negative: `A commanding persona that never visibly invites pushback trains people to defer by default, leaving you surrounded by compliance instead of real collaboration.`,
    },

    // ── 5 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '5_A': {
      heading: `People Assume You Already Know the Right Way`,
      why: `Your very presence reads as someone who knows how things are properly done — a persona of quiet authority on right and wrong, correct and incorrect, earned and unearned. The Hierophant in your Core Character makes you the one people come to instinctively for guidance, assuming before you've said anything that you'll have a grounded, reliable answer. It's the mask of the trusted elder, regardless of your actual age.`,
      shadow: `The risk is getting boxed into always having to be right, or always being expected to know — a persona that leaves no visible room for your own uncertainty. People stop offering you their doubts because they've cast you as the one who's already settled. If you feel quietly lonely in your own not-knowing, that's the cost of a mask that never shows it.`,
      path: `Let people see you genuinely unsure sometimes, out loud. It won't cost you the trust — if anything, it makes the guidance you do offer land as more real, because it's clearly coming from an actual person and not a fixed role.`,
      positive: `People trust your guidance because it's genuine, and because you let your own uncertainty show sometimes, that trust deepens instead of calcifying into a role you have to maintain.`,
      negative: `A persona that never shows doubt gets treated as a permanent authority, and the isolation of always appearing settled quietly builds behind it.`,
    },

    // ── 6 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '6_A': {
      heading: `People Feel Like Being Chosen By You Means Something`,
      why: `Your persona carries a quiet, magnetic quality of selectiveness — people sense that your attention and approval aren't handed out freely, which makes being genuinely chosen by you feel like it means something. The Lovers in your Core Character produce this mask of discernment: warm, but visibly weighing, visibly valuing. People want to be picked by you, specifically because it's clear you don't pick everyone.`,
      shadow: `The risk is a persona that reads as constantly auditioning people — friends and partners sensing they're being quietly evaluated against a standard they can't see, which can make closeness with you feel like a test rather than a resting place. If people keep trying a little too hard to earn your approval, that's often the mask of discernment showing more than the warmth underneath it.`,
      path: `Let your warmth be visible before your discernment is. People can feel evaluated and safe at the same time, but only if the safety comes first. Once someone knows they're wanted, being chosen by you becomes a gift instead of a verdict.`,
      positive: `Being chosen by you feels meaningful because your care is genuine and visible before any sense of evaluation, so people feel safe rather than assessed.`,
      negative: `A persona that reads as quietly auditioning people keeps closeness feeling like a test, and people work to earn something that should have felt freely given.`,
    },

    // ── 7 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '7_A': {
      heading: `You Read as Someone Already Headed Somewhere`,
      why: `People sense direction in you before you've said where you're headed — the impression of someone who's going somewhere and knows it, even in casual moments. The Chariot in your Core Character gives you this persona of visible momentum: purposeful posture, a kind of contained urgency. People often assume you're busy, driven, or already in the middle of something important, whether or not that's literally true in the moment.`,
      shadow: `The risk is a persona so oriented toward "going somewhere" that people hesitate to slow you down, even when you'd genuinely welcome the interruption. You can end up isolated inside your own momentum, rarely approached casually because you never look like you have time for casual. If people keep only ever bringing you urgent things, that's the mask filtering out the ordinary connection you might actually want.`,
      path: `Let your persona include visible stillness sometimes — being seen doing nothing, unhurried, available. That's not a contradiction of your drive; it's proof the drive is a choice and not a permanent state, which makes you far more approachable in the moments it's actually off.`,
      positive: `You read as purposeful and headed somewhere, and because you also let yourself be visibly unhurried sometimes, people feel free to approach you casually, not just urgently.`,
      negative: `A persona of constant momentum quietly filters out casual connection, since no one wants to interrupt someone who always looks like they're already busy.`,
    },

    // ── 9 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '9_A': {
      heading: `People Sense You Need Room Before You Ask For It`,
      why: `People can tell, almost immediately, that you process things internally and need space to do it. The Hermit in your Core Character gives off this persona of thoughtful reserve: measured, unhurried in conversation, giving the impression of someone with a rich internal world they're not in a rush to narrate. People often instinctively give you room without being asked.`,
      shadow: `The risk is a persona so associated with needing space that people stop actively including you, assuming you'd rather be left alone even on the occasions you wouldn't. Being given room can slide into being quietly left out. If invitations keep drying up, that's not necessarily your solitude working as intended — it might be a mask read a little too literally.`,
      path: `Let people know, explicitly sometimes, when you actually want to be included. The reserved persona will keep doing its job of protecting your space by default — your work is occasionally overriding it on purpose, so people learn the difference between your need for solitude and your want for connection.`,
      positive: `People respect your need for space without you having to ask, and because you speak up when you want inclusion instead, you get both the solitude and the connection you actually need.`,
      negative: `A persona read as permanently self-sufficient can quietly turn into being left out, as people stop extending invitations they've assumed you don't want.`,
    },

    // ── 10 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '10_A': {
      heading: `People Expect Things to Shift Around You`,
      why: `People sense that things move around you — that you're someone whose circumstances, moods, and plans turn more visibly than most. The Wheel of Fortune in your Core Character gives your persona this association with change: the mask of the mercurial, interesting, a little unpredictable, someone people watch with a kind of curiosity about what's coming next for you.`,
      shadow: `The risk is being typecast as unreliable simply because you're associated with flux — people hesitating to build long-term plans with you, assuming things will shift before you get there, even in situations where you're actually steady. If people keep hedging their bets around you, that's often the persona of change outrunning your actual consistency.`,
      path: `Let your follow-through be as visible as your changeability. You don't have to become predictable — just let people see the threads that do stay constant, so the mask of flux doesn't crowd out the evidence of your reliability.`,
      positive: `People find you genuinely interesting to watch, and because your follow-through is just as visible as your changeability, they trust you with long-term plans too.`,
      negative: `A persona associated purely with flux gets read as unreliable, and people quietly stop building anything long-term with someone they expect to shift.`,
    },

    // ── 11 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '11_A': {
      heading: `People Bring You Their Hardest Moments Without Asking`,
      why: `People bring you their hardest moments without asking, sensing almost physically that you can hold weight without cracking. Strength in your Core Character gives you this persona of quiet, embodied steadiness: not loud confidence, but a grounded presence that makes people feel safe bringing you difficult things. Others often confide in you faster than they mean to, simply because something about your presence tells them it's safe.`,
      shadow: `The risk is becoming everyone's emotional shock absorber by default — cast as unshakeable so consistently that people forget to check whether you're actually okay. Your own hard moments can go unnoticed because your mask never visibly cracks, even when you'd genuinely like it to. If no one ever asks how you're really doing, that's the steadiness of your persona working a little too well.`,
      path: `Let your composure visibly slip sometimes, on purpose, in front of people you trust. That's not a failure of the strength — it's proof there's a real person generating it, and it gives people permission to actually reciprocate the care they've been bringing you.`,
      positive: `People feel safe bringing you their hardest moments, and because you occasionally let your own composure show cracks, that safety runs both directions instead of just one.`,
      negative: `A persona that never visibly cracks trains people to stop checking on you, leaving your own hard moments quietly unattended.`,
    },

    // ── 12 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '12_A': {
      heading: `You Read as Someone Operating on a Different Clock`,
      why: `People sense you're not moved by the same urgency everyone else runs on, that you see situations from an angle they hadn't considered. The Hanged Man in your Core Character gives your persona this distinct, unhurried quality: the mask of the patient outlier, calm in chaos, faintly unconventional, the person whose stillness in a crisis reads as almost strange until it turns out to be useful.`,
      shadow: `The risk is being read as detached or checked-out simply because your pace doesn't match the room's — people mistaking your different angle for not caring, or your patience for passivity. If people keep leaving you out of urgent decisions, assuming you won't engage with the pressure, that's the mask of stillness being misread as absence.`,
      path: `Let your different perspective be spoken, not just held. Silence paired with an unusual pace reads as detachment; the same pace paired with an occasional sharp observation reads as exactly what it is — someone seeing clearly from an angle worth hearing.`,
      positive: `Your unhurried perspective reads as genuine clarity once you voice it, and people start actively seeking out your different angle instead of working around it.`,
      negative: `A calm, unconventional pace left unexplained gets mistaken for detachment, and people quietly stop including you in moments that actually needed your view.`,
    },

    // ── 13 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '13_A': {
      heading: `People Can Tell You've Already Been Rebuilt Once`,
      why: `People sense, without being told, that you've been through something that changed you — it shows in a kind of grounded gravity most people your age or in your position don't carry. Transformation in your Core Character gives your persona this quiet intensity: the mask of the survivor-turned-something-else, not fragile, not performing toughness, just visibly someone who's already met a version of collapse and kept going.`,
      shadow: `The risk is a persona so associated with heaviness that people handle you carefully, hesitant to bring you anything light, assuming you're always processing something deep. That can leave you starved for ease — treated as profound so consistently that no one offers you simple fun anymore. If your relationships keep feeling weightier than you actually want them to be, the mask of intensity may be doing more work than you intended.`,
      path: `Let your lightness be visible too. You don't have to perform depth to be taken seriously — the gravity is already there. Showing people your humor, your ease, your capacity for the trivial, rounds out the persona instead of undercutting it.`,
      positive: `Your grounded intensity reads as real depth, and because you also let your lightness show, people bring you both the profound and the fun.`,
      negative: `A persona read as permanently heavy invites only heavy conversation, leaving little room for the ease you might actually be craving.`,
    },

    // ── 14 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '14_A': {
      heading: `You're the One People Assume Will Keep the Peace`,
      why: `People read you as even-keeled, diplomatic, the one who can hold two opposing views in the same room without either side feeling dismissed. Temperance in your Core Character gives your persona this natural sense of balance: the mask of the mediator, easy to talk to, hard to offend, quietly trusted to keep things from tipping over. People often assume, correctly, that you're good in the middle of tension.`,
      shadow: `The risk is becoming the designated peacekeeper in every group, expected to smooth things over even when you're the one who needs smoothing yourself. The persona of balance can leave no visible room for you to actually take a side or have an unmixed feeling. If your own conflicts keep going unaddressed while you manage everyone else's, that's the mediator mask working overtime.`,
      path: `Let people see you land somewhere occasionally, instead of always holding the middle. A clear, unmediated opinion doesn't undo your gift for balance — it reminds people there's a whole person generating it, not just a permanently neutral function.`,
      positive: `People trust you to keep the peace, and because you also let yourself land clearly on a side sometimes, they see the full person behind the diplomacy.`,
      negative: `A persona of permanent balance gets recruited into every conflict as the fixer, leaving your own unmixed feelings and needs quietly unattended.`,
    },

    // ── 15 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '15_A': {
      heading: `People Sense an Edge in You They Can't Quite Name`,
      why: `People sense something compelling and a little dangerous about you, even if you're genuinely gentle underneath it. The Devil in your Core Character gives your persona this magnetic, slightly untamed edge: the mask of raw appeal, intensity that draws people in, a sense that you know something about desire, power, or the material world that most people keep more carefully hidden.`,
      shadow: `The risk is being cast as more reckless or unavailable than you actually are, simply because the persona reads as edgy — people either chasing the intensity for the wrong reasons or keeping a wary distance from someone they've decided is "too much." If your real gentleness keeps getting missed, that's the edge of the mask overshadowing what's actually underneath it.`,
      path: `Let your softness be visible alongside the intensity, not instead of it. The edge is real and it's yours — showing the tenderness that coexists with it gives people the fuller, more accurate picture instead of the magnetic silhouette.`,
      positive: `Your compelling edge draws people in, and because you also let your genuine gentleness show, what forms are real connections instead of people just chasing the intensity.`,
      negative: `An edge read without any visible softness gets people either chasing the wrong thing in you or keeping a distance from a person you're not actually being.`,
    },

    // ── 16 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '16_A': {
      heading: `People Half-Expect You to Say the Thing No One Else Will`,
      why: `People sense that you're capable of cutting straight through a polite fiction the rest of the room is maintaining. The Tower in your Core Character gives your persona this charged, unpredictable edge: the mask of the truth-jolt, not chaotic for its own sake, but carrying a kind of electric honesty that makes people both a little nervous around you and quietly relieved when you use it.`,
      shadow: `The risk is being pre-emptively excluded from delicate situations, people managing information around you because they expect disruption before you've done anything. That can leave you isolated from exactly the moments where your honesty would actually help. If people keep going quiet or careful the second you walk in, the mask of the jolt may be arriving louder than you are.`,
      path: `Let your steadiness be visible in the ordinary moments, so the intensity reads as something you can choose to use rather than something that's always simmering. The honesty stays available; the people around you just stop bracing for it by default.`,
      positive: `People trust your honesty precisely because it's not constant — the steadiness in between means the truth you do offer lands as a gift, not a threat.`,
      negative: `A persona that always seems on the verge of disruption gets people managing around you pre-emptively, cutting you out of exactly the moments your honesty could help.`,
    },

    // ── 17 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '17_A': {
      heading: `You Read as Someone Who Still Believes In Something`,
      why: `People sense hope in you that hasn't hardened into naivety — a warmth that makes you feel like a genuinely safe person to be discouraged around. The Star in your Core Character gives your persona this quiet, steady optimism: the mask of the believer, not blindly positive, but visibly unwilling to give up on things mattering, which draws people who are running low on their own hope.`,
      shadow: `The risk is becoming everyone's designated source of encouragement, expected to stay hopeful on demand even when your own light is running low. People can lean on your optimism so heavily that your discouraged days feel like a betrayal of the role, so you hide them. If you're always the one talking others off the ledge and never the one being talked down, that's the mask of hope working overtime.`,
      path: `Let your own doubt be visible sometimes, without rushing to reassure people it'll be fine. Real hope includes room for the days it flickers — showing that doesn't undercut your gift, it makes it something people can actually trust instead of a performance they depend on.`,
      positive: `Your genuine hope draws people who need it, and because you let your own discouraged days be visible too, they learn to hold you the way you hold them.`,
      negative: `A persona cast as permanently hopeful gets leaned on for encouragement nonstop, and your own flickers of doubt go unspoken to protect a role that was never meant to be constant.`,
    },

    // ── 18 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '18_A': {
      heading: `People Can Tell There's a Whole Weather System Behind Your Eyes`,
      why: `People sense there's a rich, shifting interior life behind your expression, even when you're not saying much. The Moon in your Core Character gives your persona this unmistakable emotional depth: the mask of the dreamer, a little mysterious, hard to fully predict, someone people intuit is feeling more than they're showing. It draws people in with genuine curiosity about who you really are underneath it.`,
      shadow: `The risk is a persona so associated with unpredictability that people start treating you as inherently confusing or hard to reach, hedging around you rather than approaching directly. If people keep guessing at your mood instead of just asking, that's the mystery of the mask outpacing your actual availability. You may also notice people project their own anxieties onto your silences, assuming the worst about what's behind your expression.`,
      path: `Name what you're actually feeling sometimes, out loud, even briefly. That doesn't dissolve the depth — it gives people something real to hold onto instead of guessing, and it stops the mystery from curdling into misunderstanding.`,
      positive: `Your emotional depth draws real curiosity, and because you name what you're feeling instead of leaving it to guesswork, people connect with the truth of you instead of their own projections.`,
      negative: `An unread mystery invites projection — people guessing at your mood and often assuming the worst, simply because the depth was never given any words.`,
    },

    // ── 19 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '19_A': {
      heading: `People Feel Better the Moment They're Near You`,
      why: `People feel lighter, more themselves, simply by being around you. The Sun in your Core Character means your persona radiates this genuine warmth and ease: the mask of natural brightness, unforced joy, an authentic openness that puts people at ease almost instantly. It's one of the most immediately likable presentations in the whole system, and it usually is exactly what it looks like.`,
      shadow: `The risk is people assuming the brightness is permanent and unconditional — expecting you to show up radiant regardless of what you're actually carrying, and quietly withdrawing or growing uncomfortable on the days you don't. If your harder moments get met with confusion instead of care, that's the persona of constant sunshine having convinced people there's nothing underneath it to tend to.`,
      path: `Let your bad days be visible sometimes, without apologizing for breaking character. The warmth doesn't need to be constant to be real — people who actually care about you will meet the full range, not just the bright half you've been offering by default.`,
      positive: `Your natural warmth genuinely lifts the people around you, and because you let your harder days be visible too, they learn to care for the whole person, not just the sunshine.`,
      negative: `A persona of constant brightness leaves people unequipped for your bad days, meeting them with confusion instead of care because they never saw them coming.`,
    },

    // ── 20 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '20_A': {
      heading: `People Sense You're Mid-Becoming Something`,
      why: `People sense you're in the middle of becoming someone, that a bigger version of you is actively arriving even if it isn't fully visible yet. Judgement in your Core Character gives your persona this distinct sense of unfinished momentum: the mask of imminent arrival, alert, a little restless, carrying the quiet charge of someone who's about to be called toward something larger.`,
      shadow: `The risk is people relating to you as perpetually "about to" rather than actually present — treating your current self as a placeholder for whoever you're becoming, which can leave you feeling half-seen even by people close to you. If you keep sensing that people are waiting for the "real" you to show up, that's the mask of imminent change eclipsing who you already, actually are right now.`,
      path: `Let people meet who you are today, not just who you're becoming. The arrival is real and it's coming — but you don't have to defer being known until it lands. Being fully present now doesn't cancel the unfolding; it just makes sure you're not missing your own life while it happens.`,
      positive: `People sense real momentum in you, and because you let yourself be fully known now, not just later, they connect with who you actually are, not just who you're becoming.`,
      negative: `A persona read as perpetually "about to arrive" leaves people relating to a future version of you, and the you that's already here goes quietly unseen.`,
    },

    // ── 21 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '21_A': {
      heading: `People Assume You've Already Figured It Out`,
      why: `People sense wholeness in you, an ease that reads as someone who's already arrived somewhere most people are still working toward. The World in your Core Character means your persona radiates this sense of completion: the mask of quiet mastery, put-together, self-possessed, the kind of presence people assume has already solved the things they're still struggling with.`,
      shadow: `The risk is people assuming you don't need anything, since you don't look like you're missing anything — leaving your own unfinished business, doubts, and struggles invisible behind a persona of arrival. If support stops being offered to you specifically, that's often the cost of looking too complete for anyone to think you might need it.`,
      path: `Let your actual in-progress parts be visible sometimes. Wholeness doesn't mean finished — showing people the parts of you that are still becoming makes the persona of completion accurate instead of a performance, and lets real support actually reach you.`,
      positive: `Your natural sense of wholeness reads as quiet mastery, and because you let your still-unfinished parts show too, real support reaches you instead of assuming you don't need it.`,
      negative: `A persona that reads as fully arrived quietly signals you need nothing, and support stops being offered to exactly the parts of you that are still working things out.`,
    },

    // ── 22 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '22_A': {
      heading: `People Feel Like They Can Just Be Themselves Around You`,
      why: `People sense there's no elaborate performance between you and them, that you meet each moment freshly rather than through a rehearsed social mask. The Fool in your Core Character gives your persona this genuine, unguarded openness: the persona of uncomplicated presence, approachable, easy, the kind of person who makes others feel like they don't need to perform either.`,
      shadow: `The risk is being underestimated — that same openness read as naivety, people assuming you're less experienced or less serious than you actually are, and quietly leaving you out of conversations that assume gravity you clearly carry but don't visibly display. If your input keeps going unweighted in rooms where it matters, the freshness of the mask may be obscuring the substance underneath it.`,
      path: `Let your actual experience and depth show through the openness sometimes, without needing to abandon the ease that makes you who you are. The freshness and the substance aren't in conflict — people just need occasional proof that both are really there.`,
      positive: `Your open, unguarded presence makes people feel safe being themselves around you, and because you also let your real depth show, they take your input as seriously as it deserves.`,
      negative: `An openness read as naivety gets your input quietly underweighted, even in rooms where your actual experience should carry real weight.`,
    },

    // ── 5 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '5_B': {
      heading: `You Were Born Suspecting There's a Deeper Order`,
      why: `Most people spend their whole lives looking for a framework that makes the world make sense. You arrived already suspecting one exists. The Hierophant sits at the top of your matrix, in your Sky Line — your spiritual potential — and it means your gift is one of transmission: an instinct for the codes underneath things, a sense that beyond the visible rules there's a deeper structure you can learn, hold, and eventually hand to someone else intact. That's what "divine talent" means in this position. Not that faith came easy to you, but that you have a real aptitude for wisdom itself — for study that turns into devotion, and hard-won understanding you can actually pass on.`,
      shadow: `The risk is that living spirit hardens into rigid doctrine. The same reverence that lets you honor structure can curdle into the conviction that there's exactly one right way up, and anyone doing it differently isn't just different — they're wrong. Notice what that actually does: a closed channel doesn't just teach badly, it stops receiving too. If you keep finding rooms full of people who resist your wisdom instead of taking it in, that's often a sign the channel has already narrowed, that some part of you has already decided it knows and stopped being genuinely open. You might catch yourself lecturing when you meant to teach, or defending a tradition instead of actually passing on its living core, treating spiritual authority as a position to hold instead of something you offer in service.`,
      path: `The best version of you becomes a rare kind of teacher — one who holds the codes lightly enough to let them keep evolving, who's genuinely glad when a student sees further than you do. Your work is keeping the channel open: treating every framework, even the sacred ones, as something alive rather than a finished monument. That's uncomfortable, because it means giving up the safety of certainty — it's much easier to defend a fixed answer than to keep asking what needs revising. But an open channel is also what determines what comes back to you. The teachers, students, and opportunities that reach you are responding to how open you actually are, not to how much you already know. Your gift reaches full strength not when you've mastered the law, but when you become someone others can genuinely climb through — and who keeps climbing back toward you in return.`,
      positive: `Your channel stays genuinely open, and the wisdom, teachers, and students who reach you reflect that back — real exchange in both directions, not a monologue delivered to a closed room.`,
      negative: `Once you've quietly decided you already know, the rooms you reach tend to resist rather than receive — the same defensiveness that hardens your teaching into dogma is what narrows the doors that open to you.`,
    },

    // ── 1 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '1_B': {
      heading: `You Were Given a Direct Line, Not Just a Head Start`,
      why: `Most people have to work to access inspiration. You were born with something closer to a direct line — a Sky Line gift for catching an idea, an insight, a flash of higher understanding, and immediately knowing how to give it shape. The Magician at the top of your matrix isn't about hustle or momentum in the world; it's about your capacity as a spiritual conduit, someone who can take what arrives from beyond ordinary thinking and translate it into something others can actually receive. Your divine talent is that translation itself — turning the invisible into the usable, almost on contact.`,
      shadow: `The danger is mistaking the channel for the source — claiming as personal genius what actually moved through you, and building an identity around being the one who "has it," rather than the one who receives it. That can curdle into using spiritual insight to impress rather than to serve, or into hoarding half-finished downloads because starting the next one feels more alive than doing the patient work of building out the last. If you keep finding your spiritual ideas admired but never actually landing anywhere real, that's often a channel that's stayed a spectacle instead of becoming a practice.`,
      path: `Try treating every insight you receive as something you're stewarding rather than something you own. The discipline isn't catching more — you already catch plenty — it's staying with one download long enough to give it a finished form before reaching for the next. Once you're actually building instead of just receiving, the channel opens wider, because it finally has somewhere real to empty into.`,
      positive: `You receive and translate insight almost effortlessly, and because you actually build with what arrives instead of just admiring it, real spiritual work gets finished and reaches people.`,
      negative: `Insight collected but never carried through keeps your spiritual gift looking like performance rather than practice — admired, then quietly forgotten, because nothing was ever finished for it to land in.`,
    },

    // ── 2 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '2_B': {
      heading: `Your Gift Is Fluency in What Hasn't Been Said Yet`,
      why: `You're built to sense what's forming before it's announced, to read the undercurrent in a room, a text, a life, before anyone else names it out loud — that's not a personality quirk, it's a genuine gift for interpretation, access to a layer of meaning most people walk straight past. The High Priestess lives in your Sky Line to name this precisely: fluency in symbol, dream, and the kind of knowing that arrives before language catches up to it.`,
      shadow: `The risk is guarding the veil instead of occasionally lifting it. Because this knowing feels sacred, private, almost too subtle to explain, you can end up hoarding it — treating your insight as too precious or too easily misunderstood to actually offer. That leaves your gift permanently unspoken, more mystique than contribution. If people keep sensing that you know something you're not saying, that's often exactly what's happening — and it tends to make people trust you less, not more.`,
      path: `Practice translating the unspoken into something offerable, even imperfectly. You don't need certainty to speak — you need willingness to say "here's what I'm sensing" without needing it to be complete or provable first. Every time you actually voice what you intuit, the gift moves from private atmosphere into something people can use.`,
      positive: `You sense what's forming before it's spoken, and because you're willing to voice it imperfectly rather than keep it veiled, people learn to trust and seek out your read on things.`,
      negative: `Insight kept permanently behind the veil reads as evasiveness rather than depth — people sense you're withholding something and quietly stop trusting the parts you do share.`,
    },

    // ── 3 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '3_B': {
      heading: `Things Come Alive Simply Because You're Near Them`,
      why: `Ideas that were stuck start moving in rooms you're in. People who felt creatively barren find themselves suddenly fertile around you, often without being able to explain why — your presence itself is generative. The Empress at the top of your matrix names this genuinely rare spiritual talent: not about what you produce, but what you activate in others simply by being fully, warmly present. Your divine gift is closer to a blessing than a skill — an ability to make things want to grow.`,
      shadow: `The shadow is becoming so identified with being the source of aliveness that you can't tolerate anything around you staying dormant — pushing growth, forcing bloom, unable to let a fallow season simply be fallow. It can also mean quietly resenting when your generative gift goes unacknowledged, expecting the fertility you spark in others to be credited back to you. If you find yourself surrounded by people who lean on your energy but never seem to generate their own, that's often the cost of a gift given without ever teaching people to source it themselves.`,
      path: `Try offering your presence without needing it to produce visible results. Let some things around you rest instead of grow, and trust that your gift doesn't disappear just because nothing bloomed this season. The deeper mastery is teaching people to access their own fertility instead of only ever borrowing yours — that's what turns a blessing into a lineage.`,
      positive: `Your presence activates real growth in others, and because you're teaching them to source their own aliveness rather than just borrow yours, what grows around you keeps growing after you leave the room.`,
      negative: `A need to see visible bloom everywhere you go leaves no room for natural dormancy, and people who only ever borrow your fertility stay dependent on your presence instead of learning to generate their own.`,
    },

    // ── 4 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '4_B': {
      heading: `You Give the Formless Something to Stand On`,
      why: `Where others have a spiritual experience and let it dissolve back into feeling, you have the instinct to organize it — into a discipline, a practice, a teachable system — so it can be returned to and built on rather than just remembered. The Emperor in your Sky Line names this spiritual talent for structure itself, not material ambition: the gift of taking something vast, formless, or purely felt and building it a frame sturdy enough to actually hold. Your divine talent is architecture in service of the sacred.`,
      shadow: `The risk is mistaking the frame for the thing it was built to hold — defending the structure of a practice long after the living spirit inside it has moved on, or requiring that every genuine spiritual experience conform to a system before you'll trust it. That can make you rigid around exactly the domain that should stay most alive. If your spiritual life feels increasingly like maintenance rather than discovery, that's usually a sign the container has quietly become the point.`,
      path: `Practice holding your structures loosely enough to rebuild them. Ask, regularly, whether the framework is still serving what it was built to protect, or whether it's calcified into something you're defending out of habit. Real mastery here is being willing to demolish and rebuild your own architecture the moment it stops actually holding anything alive.`,
      positive: `You give formless spiritual experience a structure sturdy enough to return to and build on, and because you keep rebuilding it when it stops serving, the framework stays genuinely alive rather than becoming a museum.`,
      negative: `Defending a structure past the point it's still holding anything living turns spiritual practice into maintenance — the frame outlasting the fire it was built to protect.`,
    },

    // ── 6 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '6_B': {
      heading: `You Can Feel the Difference Between Resonance and Attraction`,
      why: `You sense, almost bodily, the difference between a path that's spiritually true for you and one that's merely appealing — the pull of what looks impressive versus the quieter, harder-to-argue-with pull of what's actually yours to walk. The Lovers at the top of your matrix mark this genuine spiritual gift of discernment. Your divine talent is this exact clarity: an inner compass for calling, capable of distinguishing genuine resonance from borrowed conviction, even when the borrowed version is louder.`,
      shadow: `The shadow shows up as paralysis at the crossroads — feeling the difference between paths so acutely that committing to either one feels like a betrayal of the other, so you stay suspended, refusing to choose a spiritual direction because choosing means genuinely losing the alternatives. It can also look like chronic practice-hopping: sensing resonance everywhere briefly, never staying anywhere long enough for the choice to actually mean anything. If your spiritual path keeps feeling scattered across half-committed directions, that's often discernment without follow-through.`,
      path: `Try letting a choice be real even though it closes other doors — that closing isn't a loss of your gift, it's the gift finally being used for something. Discernment that never resolves into commitment stays a private talent instead of becoming a path. Choose the resonance you actually feel, even imperfectly, and let the unchosen paths go without needing them to have been wrong.`,
      positive: `You can genuinely tell resonance from attraction, and because you let that clarity resolve into real commitment, your spiritual path deepens instead of scattering across half-explored directions.`,
      negative: `Sensing the difference between paths without ever choosing keeps your spiritual life suspended at the crossroads — real discernment wasted on a decision that never actually gets made.`,
    },

    // ── 7 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '7_B': {
      heading: `Your Practice Is the Vehicle, Not the Proof`,
      why: `Where many people need continual proof that a spiritual path is "working" to stay on it, you carry something more durable: the capacity to keep moving on will alone, trusting the direction even through long stretches where nothing visibly confirms it. The Chariot in your Sky Line names this spiritual talent for sustained forward motion — the discipline to keep a practice going long after the initial inspiration that started it has faded. Your divine gift is spiritual perseverance: the ability to actually arrive somewhere, because you didn't stop.`,
      shadow: `The risk is turning discipline into a substitute for genuine encounter — logging the hours of practice as an achievement in itself, gripping the form so tightly that you stop actually noticing what the practice was for. It can also show up as spiritual solitude taken too far: insisting you have to drive this vehicle alone, refusing teachers, community, or guidance because receiving help feels like losing control of the direction. If your spiritual life feels disciplined but strangely empty, the vehicle may have quietly become the destination.`,
      path: `Loosen your grip on the form enough to let it actually take you somewhere, and let other people ride with you — a teacher, a community, a companion on the same road. The discipline was never meant to be proof of your own strength; it was meant to carry you toward something you couldn't reach standing still. Letting help in doesn't slow the journey. It's often what finally moves it.`,
      positive: `You sustain a spiritual practice through will alone, and because you let others accompany the journey, the discipline actually carries you somewhere instead of becoming its own destination.`,
      negative: `Gripping the practice so tightly that no one else can ride along turns spiritual discipline into a lonely holding pattern — plenty of motion, no real arrival.`,
    },

    // ── 8 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '8_B': {
      heading: `You Can Tell When Something Sacred Has Gone Hollow`,
      why: `You have an accurate, almost involuntary sense for when something claiming to be sacred has actually gone hollow — performance dressed as devotion, doctrine used to control rather than illuminate. Justice at the top of your matrix marks this spiritual talent most people don't have: truth-sensing in the specific domain of meaning itself. You're not easily fooled by spiritual spectacle, and you carry a real responsibility to hold a clear, honest line about what's genuine and what's borrowed authority.`,
      shadow: `The shadow is turning that clarity into a permanent posture of suspicion — unable to actually rest inside any spiritual practice or community because some part of you is always auditing it for hypocrisy, always ready to catch the flaw. That vigilance can leave you spiritually isolated, trusting nothing enough to actually belong to it. If every spiritual community you enter eventually disappoints your scrutiny, that's worth examining — sometimes the standard being applied has quietly become impossible for anything human to meet.`,
      path: `Try holding your discernment alongside genuine willingness to belong, rather than as a replacement for it. Not every imperfection is hypocrisy — sometimes it's just the ordinary unevenness of humans doing sincere work. Let your gift catch real hollowness without requiring flawlessness first, and you'll find there's more genuine ground to stand on than your vigilance has been allowing you to see.`,
      positive: `You can tell genuine devotion from performance without needing everything around you to be flawless, so you actually belong somewhere instead of standing permanently outside, auditing.`,
      negative: `A standard that catches every imperfection as hypocrisy leaves nothing sacred able to pass inspection — real discernment used so relentlessly that it forecloses genuine belonging.`,
    },

    // ── 9 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '9_B': {
      heading: `Solitude Isn't Where You Hide — It's Where You Actually Arrive`,
      why: `Left alone with enough quiet, you don't just think clearly, you access a different register of consciousness altogether: a felt sense of something larger than the personal self, available to you in a way it isn't for most people without years of trained practice. The Hermit in your Sky Line is naming something more specific than wisdom here — a capacity for direct communion. Your divine talent is contemplative range: a natural aptitude for the states mystics spend lifetimes trying to reach.`,
      shadow: `The risk is treating the capacity itself as the finish line — chasing the peak state again and again, retreating further and further from ordinary life because ordinary life can't compete with what solitude gives you access to. That can quietly become a spiritual bypass: using genuine mystical capacity as an escape hatch from the unglamorous, relational work everyone else has to do. If your life outside of solitude feels increasingly thin, that's often this gift being used to exit rather than to return and integrate.`,
      path: `Practice bringing something back. The measure of this gift isn't how deep you can go alone — it's whether what you find there changes how you show up once you return. Let the contemplative states be a resource that feeds an actual life, not a replacement for one. Return is the harder half of the gift, and it's the half that makes the solitude worth something beyond itself.`,
      positive: `You access genuine expanded states with real ease, and because you consistently bring something back from them into ordinary life, the gift enriches your days instead of pulling you away from them.`,
      negative: `Chasing the depth of solitude for its own sake, without ever returning to integrate it, leaves ordinary life feeling thin — a real spiritual capacity used to exit rather than to live more fully.`,
    },

    // ── 10 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '10_B': {
      heading: `You Sense the Season Before Anyone Announces It`,
      why: `You have an instinct for divine timing: knowing when to wait and when the moment has actually arrived, even when nothing external has announced it yet. Wherever the Wheel sits in your Sky Line, it marks this genuine talent for reading larger timing — not your own moods or rhythms, but the sense of an unfolding pattern bigger than any single event. This is closer to a gift of trust than a gift of prediction — faith that the larger pattern is intelligent, even from inside a turn that looks like descent.`,
      shadow: `The shadow is using "it's not the right time yet" as a permanent, unfalsifiable excuse — deferring real spiritual commitment indefinitely because you're always sensing a better season just ahead. It can also become fatalism: trusting the wheel so completely that you stop participating, waiting passively for the turn instead of actually meeting it. If your spiritual growth keeps feeling like it's always about to begin, the gift of timing may have quietly become a way of avoiding the present moment.`,
      path: `Practice trusting a "yes" that arrives right now, not just the ones you sense are coming later. Your timing sense is real — the work is letting it include the present as a legitimate season, not only the future one. Faith in the larger pattern is meant to support action, not replace it.`,
      positive: `You sense the true timing of your spiritual unfolding and act from it, so growth arrives in real seasons instead of staying permanently deferred to a better one.`,
      negative: `Treating "not yet" as a permanent answer turns real timing-sense into an excuse — spiritual growth that's always about to begin, and never quite does.`,
    },

    // ── 11 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '11_B': {
      heading: `Your Gift Is Staying Present With What Others Flee`,
      why: `You can stay present with raw, unruly inner states without needing to suppress or be ruled by them: fear you can sit inside without fleeing, desire you can feel fully without being driven by it, anger you can hold instead of either exploding or burying. Strength in your Sky Line — not physical toughness — names exactly this spiritual talent. Your divine gift is a gentle hand on your own wildness: the capacity to tame through presence and patience rather than force, which is a rarer and harder-won spiritual skill than it looks.`,
      shadow: `The shadow is performing calm rather than actually achieving it — a practiced serenity that's really just suppression with better posture, holding the lion's jaw shut instead of genuinely working with its nature. Over time that costs you: the unexpressed intensity doesn't disappear, it just moves underground, showing up as tension, numbness, or eruptions that seem to come from nowhere. If your composure keeps cracking in ways that surprise you, what's being tamed may be your expression of the feeling rather than the feeling itself.`,
      path: `Practice letting the intensity be fully felt before you try to work with it — presence before technique. The taming this position asks for isn't suppression dressed up as spiritual maturity; it's genuinely staying with what's wild in you long enough for it to soften on its own terms. That patience, applied to yourself first, is what makes the gift usable for anyone else.`,
      positive: `You can stay present with intense inner states without suppressing or being ruled by them, and that genuine steadiness — not performed calm — is what actually holds space for others in crisis.`,
      negative: `Suppression dressed as serenity doesn't dissolve intensity, it just buries it — until it resurfaces as tension or eruption that undoes the very calm it was meant to protect.`,
    },

    // ── 12 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '12_B': {
      heading: `You Access Revelation by Letting Go of the Wheel`,
      why: `You have a natural aptitude for the kind of stillness that isn't passive: choosing to stop pushing, stop directing, stop needing to understand from your usual angle, and finding that revelation arrives precisely in that release. The Hanged Man in your Sky Line marks this spiritual talent for genuine surrender — not helplessness, but the deliberate, skilled release of control that opens a channel most people can only reach by accident, in crisis. Your divine gift is comfort inside not-knowing: genuine ease with paradox and mystery that most spiritual seekers spend years trying to develop.`,
      shadow: `The shadow is confusing surrender with permanent inaction — treating "let go and see what's revealed" as a reason to never actually decide or move, staying suspended indefinitely because the suspended state itself has started to feel safer than descending back into ordinary choice-making. It can also become spiritual passivity dressed as depth: withdrawing from responsibility and calling it surrender. If insight keeps arriving but nothing in your life ever changes because of it, the gift may have stalled in perpetual suspension.`,
      path: `Let the surrender have an end point — receive what the stillness reveals, and then actually come down and use it. The gift isn't the hanging itself, it's the revelation that arrives there, and revelation only means something once it's carried back into action. Practice returning, deliberately, every time — proving to yourself that descent doesn't cancel out what you found while suspended.`,
      positive: `You can genuinely surrender control and receive real insight from that stillness, and because you consistently carry it back into action, revelation actually changes your life instead of just visiting it.`,
      negative: `Mistaking suspension for the destination keeps you permanently paused — real insight arriving again and again with nothing in your life ever actually moving because of it.`,
    },

    // ── 13 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '13_B': {
      heading: `You've Died and Come Back More Than Once, On Purpose`,
      why: `You likely carry more than one experience of genuine ego-death already, whether you have language for it or not — the kind of dissolution where an old sense of self actually ends, not metaphorically, and something truer rises in its place. Transformation in your Sky Line points to this specific spiritual talent. Your divine gift is a real aptitude for spiritual initiation, and often a corresponding gift for recognizing and accompanying that same process in other people going through their own.`,
      shadow: `The shadow is becoming addicted to the intensity of dissolution itself — engineering crisis after crisis because ordinary, gradual growth feels unconvincing compared to the dramatic clarity of a real death-rebirth passage. It can also show up as using your initiatory experience as spiritual credentialing — implying that your transformations make you more evolved than people who haven't had them. If your spiritual life keeps requiring bigger and bigger collapses to feel real, the gift for genuine initiation may have become a dependency on intensity.`,
      path: `Practice trusting the quiet, incremental transformations as real, not just the dramatic ones. Your gift for facilitating others through death-rebirth passages matters more when it's offered gently than when it's performed as proof of your own depth. Let some of your growth simply happen without needing it to look like a collapse first.`,
      positive: `You genuinely accompany people through real spiritual initiation, and because you no longer need transformation to look dramatic to count, both your own growth and theirs can happen without manufactured crisis.`,
      negative: `Needing every transformation to be a dramatic collapse to feel legitimate keeps manufacturing crisis where quiet growth would have done the same work — intensity mistaken for depth.`,
    },

    // ── 14 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '14_B': {
      heading: `You Were Built to Stand Between Two Worlds and Not Fall`,
      why: `You stand at the meeting point between different truths, different traditions, even the ordinary and the sacred, and hold both without needing either to collapse into the other. Temperance in your Sky Line marks this genuine mediator's gift. Where most people have to pick a side, you have real aptitude for the harder, rarer work: translating between worlds, carrying something true from one domain into a place that couldn't otherwise receive it. Your divine talent is genuine spiritual healing: the pouring between vessels that restores what's been separated.`,
      shadow: `The shadow is losing your own footing in the effort to hold everyone else's — mediating so consistently between opposing truths that you stop having convictions of your own, dissolving into pure accommodation. It can also look like healing everyone except yourself, pouring endlessly outward while your own vessel runs dry. If you keep finding yourself depleted after being the bridge for other people's reconciliation, that's worth noticing — the healer needs healing too, and this position doesn't exempt you from that.`,
      path: `Practice keeping one foot planted in your own conviction even while you hold space for someone else's. And let the pouring go both ways — receive healing as readily as you offer it. The gift isn't diminished by having limits; it's actually sustained by them, because a depleted vessel has nothing left to pour.`,
      positive: `You genuinely bridge opposing truths without losing your own footing, and because you let healing flow toward you as well as through you, the gift stays sustainable instead of draining you dry.`,
      negative: `Mediating everyone else's reconciliation while neglecting your own leaves the vessel empty — a real healing gift running dry from being poured only outward.`,
    },

    // ── 15 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '15_B': {
      heading: `You Can Look Directly at What Most Spiritual Paths Avoid`,
      why: `You can look directly at darkness — your own unconscious material, taboo desire, collective shadow — without flinching away or spiritually bypassing it. The Devil in your Sky Line names this unusual and genuinely valuable spiritual talent. Where many paths ask you to transcend the shadow before you've actually met it, your gift is meeting it first. Your divine talent is depth work: the willingness to go into the bound, the hidden, the disowned, and bring back something usable instead of just more fear.`,
      shadow: `The shadow of this gift is fascination without integration — circling the same dark material repeatedly because the intensity of looking at it has become its own reward, mistaking proximity to darkness for actual liberation from it. It can also curdle into using shadow-fluency as a kind of spiritual edge or performance, naming other people's unconscious material as a way of holding power over them rather than genuinely freeing them. If your depth work keeps generating insight but no actual freedom, the looking may have become the destination instead of the doorway.`,
      path: `Let every act of looking be in service of an actual unchaining — not just naming what's bound, but loosening it. The gift matures when insight into darkness reliably produces more freedom, in you and in whoever you're working with, rather than just more fluency in describing it. Depth without liberation is just another kind of bondage, dressed in insight.`,
      positive: `You can face real darkness without flinching and use that fluency to actually unchain what was bound, so your depth work produces genuine liberation, not just more insight about the chains.`,
      negative: `Circling dark material for the intensity of it, without ever loosening anything, turns real depth-capacity into its own kind of bondage — insight without the freedom it was supposed to lead to.`,
    },

    // ── 16 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '16_B': {
      heading: `Clarity Doesn't Knock Politely When It Comes for You`,
      why: `You're built to receive revelation as lightning rather than as slow accumulation — insight that arrives all at once, restructuring what you understood as true faster than gradual learning ever could. The Tower in your Sky Line marks this genuine gift for sudden spiritual clarity. Alongside it, you carry a real talent for seeing straight through false spiritual structures — dogma, borrowed belief, comfortable illusion — the instant they stop being true, even when everyone around you is still invested in them.`,
      shadow: `The shadow is becoming someone who needs the lightning to feel like growth is real — dismissing gradual, quiet spiritual development as somehow lesser, or unconsciously provoking collapse in your own belief systems just to feel the clarifying jolt again. It can also mean wielding your gift for seeing through illusion as a weapon, tearing down what other people still genuinely need to believe before they're ready to release it. If your spiritual insights keep leaving scorched ground behind them, the clarity may be arriving with more force than the moment actually required.`,
      path: `Practice letting some clarity land gently instead of only through collapse — trusting that not every true realization has to arrive as demolition. And when you do see through someone else's belief, ask whether they asked for that clarity before you deliver it. The gift is real. The timing and delivery are what turn it into either breakthrough or damage.`,
      positive: `You receive real revelation and can see straight through false belief, and because you deliver that clarity with genuine care for timing, it lands as breakthrough rather than damage.`,
      negative: `Delivering unrequested clarity like a strike, or needing collapse to feel like growth, leaves scorched ground where a gentler unveiling would have done the same true work.`,
    },

    // ── 17 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '17_B': {
      heading: `You Carry a Kind of Faith That Isn't Only Yours to Keep`,
      why: `In rooms that have lost their bearings, you're often the one whose faith stays lit without needing external proof, and that steadiness is contagious in a way that's hard to manufacture. The Star in your Sky Line marks this genuine wellspring gift — a capacity to generate hope and inspiration that isn't just a personal disposition, it's a resource other people are meant to draw from. Your divine talent is transmission: not just holding hope privately, but being a literal source other people can refill themselves from.`,
      shadow: `The shadow is treating your faith as a private reserve instead of a wellspring — staying quietly inspired while people around you run dry, because sharing it feels like it might diminish your own supply. It can also look like performing hope you don't actually feel, because you've become known as the one who's always fine, and admitting otherwise feels like letting people down. If people keep coming to you for inspiration and leaving you depleted, the well may need its own source, too.`,
      path: `Let your faith be witnessed honestly, including the moments it wavers — a wellspring that's allowed to be replenished stays more sustainable than one performing endless abundance. Practice actually pouring it out rather than guarding it, and let other sources refill you in turn. The gift was never meant to be a solo act.`,
      positive: `You genuinely transmit hope that other people can draw from, and because you let your own well be replenished too, the gift stays sustainable instead of quietly running you dry.`,
      negative: `Guarding your faith as a private reserve, or performing hope you don't feel, leaves you depleted by the very gift that was meant to flow — a wellspring treated like a finite resource.`,
    },

    // ── 18 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '18_B': {
      heading: `The Threshold Between Worlds Isn't Frightening to You — It's Native Ground`,
      why: `You likely have vivid, meaningful dream life, a natural medium-like porousness to what's unseen, and access to symbolic language that speaks directly rather than needing translation. The Moon in your Sky Line marks this real visionary talent — a sensitivity to threshold states, dreams, and the layer of reality that exists between waking and unconscious, where most people feel disoriented and you feel oddly at home. Your divine gift is fluency in liminal space: genuine comfort navigating what other people find disorienting or frightening.`,
      shadow: `The shadow is losing the thread back to consensus reality — spending so much time fluent in the symbolic and unseen that ordinary, daylight functioning starts to feel thin or unreal by comparison. It can also mean absorbing atmospheres and unseen material so readily that you lose track of what's actually yours versus what you've simply picked up from the collective psychic weather around you. If your inner world keeps feeling more vivid and trustworthy than your outer one, the gift may have started replacing your life instead of enriching it.`,
      path: `Build a genuine practice of return — a way of coming back from the threshold each time with something integrated, rather than staying dissolved in it. Ground the visionary material in your body, your relationships, your daylight commitments. The gift gets stronger, not weaker, when it has an anchored life to actually feed.`,
      positive: `You navigate dreams and unseen material with real fluency, and because you consistently ground what you find there in daylight life, the visionary gift enriches your reality instead of replacing it.`,
      negative: `Losing the thread back to ordinary life leaves the visionary gift ungrounded — vivid inner material with nowhere real to land, and a waking life that starts to feel thin by comparison.`,
    },

    // ── 19 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '19_B': {
      heading: `Your Spiritual Truth Doesn't Need to Hurt to Be Real`,
      why: `Where many spiritual paths are built around earning insight through suffering, you carry a natural aptitude for clarity that simply arrives — light, immediate, undramatic. The Sun in your Sky Line marks this rare gift: a direct, joyful connection to something larger that doesn't require struggle to access. Your divine talent is proof, by example, that depth and ease aren't opposites, that joy itself can be a genuine spiritual practice, not just a byproduct of having survived something hard.`,
      shadow: `The shadow is having that ease mistaken — by others, and sometimes by yourself — for shallowness, as if truth that didn't cost you enough pain can't be trusted. That can push you to manufacture struggle you don't actually need, dimming your natural clarity to seem more "credible" to a world that equates depth with difficulty. If you keep feeling pressure to suffer for your spiritual insight to be taken seriously, that pressure is worth questioning rather than obeying.`,
      path: `Let your joy stand as its own evidence. You don't owe anyone a harder story to make your clarity legitimate. Practice offering what you know exactly as lightly as it arrived — trusting that ease isn't a lesser path, just a less commonly modeled one.`,
      positive: `You access genuine spiritual clarity without needing struggle to earn it, and because you offer that joy without apology, it gives others real permission to stop treating suffering as the price of depth.`,
      negative: `Dimming your natural ease to seem more credible teaches everyone around you, including yourself, that joy isn't trustworthy — a real gift muted to fit a story about what depth is supposed to cost.`,
    },

    // ── 20 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '20_B': {
      heading: `You Hear the Summons Other People Have to Strain For`,
      why: `Where many people spend years trying to discern their purpose, you have a real aptitude for recognizing a summons when it arrives, distinguishing it from noise or wishful thinking. Judgement in your Sky Line marks this genuine gift for hearing calling clearly. That clarity is often a gift you can offer others too: something in you can recognize when someone nearby is being called toward their own awakening, sometimes before they can hear it themselves. Your divine talent is vocational hearing: genuine discernment of what's actually being asked of a life.`,
      shadow: `The shadow is hearing calls that were never actually meant for you — an oversensitive summons-detector that mistakes every strong feeling for a divine instruction, leading to a life of chasing missions that don't hold up under scrutiny. It can also show up as pressuring people toward awakenings they're not ready for, mistaking your clear hearing for permission to rush someone else's timing. If your "callings" keep changing every few months, or people keep resisting the awakening you're so sure they need, the gift may be firing on signals that aren't real.`,
      path: `Let a summons prove itself over time before you fully commit to it — real calling tends to survive scrutiny and patience, where noise usually doesn't. And when you sense someone else's awakening approaching, offer it rather than push it; their timing isn't yours to accelerate. Clear hearing is the gift. Discernment about whose voice you're actually hearing is the mastery.`,
      positive: `You hear genuine calling with real clarity and let it prove itself over time, so what you act on is authentic vocation rather than passing noise mistaken for a summons.`,
      negative: `Mistaking every strong feeling for a divine instruction, or pushing others toward awakenings on your timeline, turns real vocational hearing into constant, unreliable reinvention.`,
    },

    // ── 21 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '21_B': {
      heading: `You're Built to Hold the Whole Picture, Not Just One Piece of It`,
      why: `Where most spiritual growth happens piece by piece, you have a real aptitude for integration itself: weaving different practices, traditions, or ways of knowing into one coherent, embodied whole rather than experiencing them as competing systems. The World in your Sky Line marks this genuine talent for spiritual wholeness — the capacity to hold many different dimensions of understanding at once, rather than mastering one narrow lane and stopping there. Your divine talent is synthesis at the level of an entire life, not just a single insight.`,
      shadow: `The shadow is confusing breadth with completion — collecting more traditions, practices, and frameworks in the name of "wholeness" without ever actually letting any one of them go deep enough to change you. It can also show up as a subtle superiority, holding your integrated view as evidence you've arrived somewhere others haven't, when real wholeness has no need to be compared. If your spiritual life feels expansive but oddly unchanged by any of it, the gift for synthesis may be collecting rather than integrating.`,
      path: `Let depth catch up with breadth. Practice staying with one dimension of your understanding long enough for it to actually transform you before reaching to add another. Integration isn't the number of things you can hold — it's how thoroughly they've actually become one coherent life. The gift matures when what you've gathered starts showing up as how you live, not just what you know.`,
      positive: `You genuinely weave many dimensions of spiritual understanding into one coherent life, and because you let each one go deep before adding the next, the integration actually transforms how you live.`,
      negative: `Collecting traditions and frameworks without letting any go deep enough to change you turns a real gift for synthesis into accumulation — breadth mistaken for the wholeness it was supposed to produce.`,
    },

    // ── 22 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '22_B': {
      heading: `You Don't Need a Map to Be Let In`,
      why: `Where many spiritual seekers have to earn their way toward openness through years of study, you carry something closer to a natural passport — trust itself functioning as a spiritual technology, letting genuine experience reach you before you've built any framework to explain it. The Fool in your Sky Line marks this rare spiritual talent: direct, unmediated access to the sacred, without needing a doctrine, a teacher, or a credential to grant you permission first. Your divine talent is openness so complete it doesn't require proof.`,
      shadow: `The shadow is mistaking that openness for infallibility — trusting every experience as equally sacred without discernment, following whatever feels expansive in the moment without checking whether it's actually wise. That can leave you spiritually ungrounded, leaping toward the next revelation before the last one has taught you anything durable. If your spiritual life keeps feeling like a series of fresh starts with no accumulating wisdom, the openness may be missing its counterpart: a willingness to actually integrate what trust brings you.`,
      path: `Keep the openness, and pair it with just enough discernment to let experience actually accumulate into wisdom rather than dissolve into the next leap. You don't need a map to be let in — that part of the gift is real. But even the Fool eventually needs somewhere to land. Let each leap teach you something you carry into the next one.`,
      positive: `You access genuine spiritual openness without needing permission or proof first, and because you let each experience actually teach you something, your trust accumulates into real wisdom rather than resetting each time.`,
      negative: `Trusting every experience equally without discernment turns real openness into a string of unconnected leaps — spiritual freshness with nothing durable accumulating underneath it.`,
    },

    // ── 4 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '4_C': {
      heading: `You Were Built to Construct Security, Not Wait for It`,
      why: `You carry one of the most grounding energies in the whole system on your Earth Line — your material and financial potential, encoded from your year of birth. The Emperor speaks of a real capacity to build: to bring order to the physical world, raise structures that can actually hold weight, and turn a vision into something durable enough to generate real security. You understand, in your bones, that wealth and stability aren't luck — they're constructed, through discipline and a willingness to take responsibility for the outcome. You can hold a plan across time. You can stay with the unglamorous, foundational work most people abandon halfway through. And there's a quiet authority in you around money — a sense that you're meant to build the container, not wait around inside someone else's.`,
      shadow: `The shadow shows up as structure that's forgotten what it was built to serve. Sometimes that looks like financial stagnation dressed up as caution — an unwillingness to risk or expand or dismantle a system that technically still works but has stopped growing. Sometimes it looks like rigidity: gripping resources so tightly that nothing new can get in, mistaking a pile of order for actual prosperity. Money that won't move isn't being protected — it's being told, at a deep level, that there isn't enough of it to risk, and that exact scarcity is what a tight grip tends to keep pulling back toward itself. It can also show up as the opposite — a resistance to being the one in charge, leaving your material potential unbuilt while you wait for someone else's structure to come rescue you.`,
      path: `Your work isn't to tear the structure down — it's to become its conscious architect, building with confidence instead of fear. That means accepting the less comfortable half of this first: your current financial reality isn't something happening to you, it's the structure your own beliefs about money have quietly been building all along. Start with an honest audit: which structures genuinely protect what matters, and which have quietly turned into prison walls you're maintaining out of habit? Real authority over your material world doesn't need to grip. It can afford to be generous and flexible because it trusts its own ability to rebuild — and that trust, more than any single strategy, is what a healthy relationship to money is actually made of. You were built to construct security from the ground up. The mastery is building something strong enough to stay open, because an open structure is what abundance can actually move through.`,
      positive: `You build real, durable security from genuine trust in your own capacity — money and resources move toward you because your relationship to them is generous and open rather than gripped, so the flow keeps replenishing itself.`,
      negative: `Resources held too tightly leave no room for anything new to enter, and that scarcity-driven grip is exactly the frequency that keeps material stagnation in place — the fortress you're defending is the same structure keeping real abundance out.`,
    },

    // ── 1 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '1_C': {
      heading: `You Can Turn an Idea Into Income Faster Than Most`,
      why: `You have a real knack for spotting an opening and turning it into income before anyone else has finished thinking about it — entrepreneurial instinct at the level of your actual bank account. The Magician on your Earth Line means your material potential runs on origination: resourcefulness that converts attention and initiative directly into material result. Where others need infrastructure before they'll start, you can generate real value from very little.`,
      shadow: `The risk is a financial life built entirely on starts — new ventures, new streams, new schemes, each exciting until the follow-through required to make it durable kicks in, at which point you're already eyeing the next opportunity. Money made fast can leave just as fast if nothing's built to hold it. If your income keeps spiking and draining without ever compounding into real security, that's the shadow of origination without sustaining structure.`,
      path: `Pick one income stream and stay with it past the exciting part. You don't have to stop generating new ideas — just let at least one of them mature into something durable instead of being abandoned at the first sign of routine. Sustained follow-through is what turns your gift for starting into actual, lasting wealth.`,
      positive: `You generate real income from nothing more than a good idea and follow through far enough to let it compound, so your resourcefulness builds lasting security instead of just quick spikes.`,
      negative: `Money made fast and abandoned just as fast never compounds — a string of promising starts that drain before they ever build into real security.`,
    },

    // ── 2 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '2_C': {
      heading: `Your Gut Reads the Market Better Than Your Spreadsheets Do`,
      why: `You have a felt sense for when to act and when to hold that often outperforms whatever the visible data suggests — quiet certainty about a decision arriving before you can fully explain why. The High Priestess on your Earth Line gives you this genuinely intuitive relationship with material timing. Your financial instincts run deep rather than loud: this is real material intelligence, just not the kind that shows its work.`,
      shadow: `The risk is second-guessing that intuition into silence, deferring instead to louder, more "rational"-sounding advice from other people, and watching your own quiet certainty get overridden every time. If you keep noticing, after the fact, that your gut had it right all along, that's a signal you're not yet trusting the intelligence you actually have access to.`,
      path: `Practice acting on the quiet certainty before you look for permission or proof. Keep a private record of your instincts versus outcomes if it helps build trust in the pattern. Your material intelligence doesn't need to be loud to be reliable — it needs you to actually listen to it.`,
      positive: `You trust and act on your financial intuition, and because you do, your material decisions land with a consistency that spreadsheets alone couldn't have produced.`,
      negative: `Overriding your own quiet certainty with louder outside advice means watching, again and again, as your original instinct turns out to have been right.`,
    },

    // ── 3 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '3_C': {
      heading: `Your Money Grows the Way a Garden Does, Not a Machine`,
      why: `You have a real gift for cultivating material resources the way you'd cultivate anything alive: patiently, with genuine care for the process, not just the yield. The Empress on your Earth Line means your material abundance is generative rather than transactional — wealth that grows from something you tend and nurture over time, whether that's a creative practice, a business, or a body of work, rather than from a single transaction or grind.`,
      shadow: `The risk is over-nurturing something material that's no longer actually growing — pouring resources and energy into a venture or investment out of attachment rather than any real sign of life left in it. You can also give away material abundance too freely, undervaluing what you've grown because tending it never felt like "real work." If your generosity keeps outpacing your own security, that's this gift operating without its necessary boundary.`,
      path: `Learn to prune as readily as you plant — let go of what's stopped growing, and price your own generative output at what it's actually worth. Cultivation without occasional pruning becomes overgrowth, not abundance.`,
      positive: `You grow real, sustainable material abundance through patient cultivation, and because you also know when to prune, that abundance keeps compounding instead of being diluted.`,
      negative: `Tending things that have stopped growing, or undervaluing what your own cultivation produces, quietly drains the abundance this gift was actually capable of generating.`,
    },

    // ── 5 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '5_C': {
      heading: `You Build Wealth the Way Someone Taught You To, On Purpose`,
      why: `You have a genuine gift for absorbing how wealth actually gets built from people who've already done it, and applying that knowledge with real discipline. The Hierophant on your Earth Line means your material security is built through inherited or learned systems: proven structures, mentorship, tradition-tested methods rather than improvisation. This is material wisdom passed down and put into practice, not reinvented from scratch.`,
      shadow: `The risk is clinging to an inherited financial system past the point it still fits your actual circumstances — following the rules exactly as taught even when the market, the era, or your own life no longer matches the conditions those rules were built for. If your material strategy feels stuck despite real effort, the system you inherited may need updating, not just more devoted application.`,
      path: `Treat your financial education as a living inheritance, not a fixed rulebook — keep learning from new teachers as your circumstances change, and let proven structure evolve instead of calcifying. The discipline is the asset; the specific rules can update.`,
      positive: `You build real, durable material security by learning proven systems and applying real discipline, and because you keep updating that knowledge, the structure stays effective rather than outdated.`,
      negative: `Following an inherited financial rulebook past its relevance keeps effort from translating into results — devotion to the method outliving its fit for your actual circumstances.`,
    },

    // ── 6 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '6_C': {
      heading: `You Can't Build Real Wealth on a Choice You Don't Believe In`,
      why: `You build real, sustainable wealth only through work and investments that actually reflect your values, and you struggle, often visibly, to profit from anything that doesn't. The Lovers on your Earth Line means your material success is tied directly to alignment — a genuine material discernment: an instinct that steers you away from lucrative-looking options that would cost you something you're not willing to pay.`,
      shadow: `The risk is a chronic material crossroads — perpetually weighing every financial choice against your values so exhaustively that you delay committing to anything, watching viable opportunities pass while you deliberate. It can also show up as guilt-driven financial choices, picking the "values-aligned" option reflexively even when it's genuinely the weaker material decision. If your finances keep stalling at the decision point, that's discernment without commitment.`,
      path: `Let a values-aligned choice be good enough without needing to be perfect, and commit to it fully once made. Real alignment isn't found by endlessly comparing options — it's built by actually choosing one and living inside that choice long enough to see if it holds.`,
      positive: `You build real wealth from work that genuinely reflects your values, and because you commit fully once you choose, that alignment has time to actually compound into security.`,
      negative: `Endless deliberation over every financial choice's alignment keeps you stalled at the crossroads, letting viable opportunities pass while the perfect option never quite arrives.`,
    },

    // ── 7 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '7_C': {
      heading: `You Build Wealth By Simply Refusing to Stop`,
      why: `You have a genuine capacity to set a material goal and steer toward it through setbacks that would derail someone with less follow-through. The Chariot on your Earth Line means your material security comes from sustained, willed momentum — a financial life driven forward by real discipline rather than luck or windfall. This is wealth-building as an act of sustained navigation, not a single lucky break.`,
      shadow: `The risk is gripping the financial plan so tightly that you can't adapt when circumstances genuinely change — mistaking rigid adherence to the original goal for discipline, when real navigation sometimes calls for a course correction. It can also show up as refusing financial help or partnership, insisting on building alone even when collaboration would get you there faster. If your material progress feels like a lonely grind that never accelerates, that's control that's stopped serving the direction.`,
      path: `Hold the destination firmly and the route loosely — let your financial plan bend when the terrain actually changes, and let capable people help carry the load. Discipline that can adapt outperforms discipline that can only grip.`,
      positive: `You build real material security through sustained, disciplined momentum, and because you let the route adapt and let others help, the progress compounds instead of grinding alone.`,
      negative: `A financial plan gripped too tightly to adapt, pursued in total solitude, turns genuine discipline into a lonely grind that never quite accelerates.`,
    },

    // ── 8 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '8_C': {
      heading: `Your Money Reflects How Fairly You've Actually Dealt`,
      why: `You likely have a genuine, almost involuntary aversion to material gain that came at someone else's unfair expense, and a matching gift for structuring deals that are actually equitable. Justice on your Earth Line ties your material security directly to fairness: real, durable wealth for you comes through balanced transactions, honest dealing, and contracts that actually hold up, rather than through advantage taken or corners cut.`,
      shadow: `The risk is over-scrutinizing every material exchange for hidden unfairness, becoming so wary of being cheated that you hesitate to invest, partner, or commit even when the deal is genuinely sound. It can also show up as resentment toward others' unearned gains, energy better spent building your own. If you keep finding fault with every financial opportunity that crosses your path, the standard you're applying may have quietly become impossible to satisfy.`,
      path: `Apply your instinct for fairness to actually moving forward, not just to auditing what's in front of you. A genuinely fair deal doesn't need to be perfect to be worth taking. Let your discernment clear opportunities instead of only disqualifying them.`,
      positive: `You build real material security through fair, honest dealing, and because your discernment clears good opportunities instead of just disqualifying them, wealth actually gets to accumulate.`,
      negative: `A standard for fairness applied so strictly that no deal ever clears it leaves real opportunities stalled in perpetual audit, and resentment over others' gains eats the energy that could have built your own.`,
    },

    // ── 9 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '9_C': {
      heading: `Your Wealth Comes From Knowing One Thing Better Than Anyone Else`,
      why: `You have real material potential in the solitary mastery of a specific craft, subject, or skill, converted into income through the rarity of what you actually know. The Hermit on your Earth Line means your material security is built through depth rather than breadth — specialized expertise developed largely alone, which becomes genuinely valuable precisely because so few people have gone as deep as you have.`,
      shadow: `The risk is expertise that never gets marketed — knowledge so deep it stays private, undervalued because sharing it, pricing it, or putting yourself forward as an expert feels like a departure from the solitude that built it. If your income doesn't reflect the actual depth of what you know, that's often a lantern that's never been turned toward the marketplace.`,
      path: `Let your expertise be visibly offered, not just quietly possessed. Depth built in solitude still needs to be brought into relationship — priced, published, taught — before it can actually convert into material security. The knowledge is already valuable; it just needs to be seen.`,
      positive: `Your deep, specialized expertise becomes genuinely valuable once you offer it visibly, converting solitary mastery into real material security instead of private knowledge.`,
      negative: `Real expertise kept private because sharing it feels exposing means your income never reflects the actual depth of what you know.`,
    },

    // ── 10 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '10_C': {
      heading: `Your Money Moves in Cycles You're Built to Read`,
      why: `You have a genuine capacity to sense when a financial cycle is turning, when to invest and when to hold back, that outperforms rigid, fixed strategies. The Wheel of Fortune on your Earth Line ties your material fortune to timing. Your wealth doesn't arrive in a straight line; it arrives in identifiable seasons, and part of your real material gift is reading which season you're actually in.`,
      shadow: `The risk is fatalism about the downswings — treating a financial low as proof the wheel has turned against you permanently, and pulling back from genuine opportunity out of a belief that your luck has run out. It can also show up as chasing every apparent upswing without discernment, mistaking motion for a genuine turn. If your finances feel like they lurch between extremes rather than actually cycling upward over time, the timing sense may be running on fear instead of pattern.`,
      path: `Track your actual financial cycles instead of reacting to each swing individually — over time the pattern becomes visible, and the visible pattern is what turns instinct into strategy. Stability here comes from your relationship to the cycle, not from stopping it.`,
      positive: `You read your financial cycles accurately and act from the pattern rather than the fear, so what looks like luck is actually well-timed, repeatable material intelligence.`,
      negative: `Reacting to every downswing as permanent, or chasing every apparent upswing without discernment, keeps your finances lurching between extremes instead of genuinely compounding.`,
    },

    // ── 11 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '11_C': {
      heading: `You Can Hold Financial Pressure Other People Would Buckle Under`,
      why: `You can hold steady through financial pressure, downturns, or scarcity that would rattle most people, without panicking into rash decisions. Strength on your Earth Line gives you this genuine material endurance — real resilience at the level of your bank account: patience under material strain, and the steadiness to keep making sound decisions even when the numbers are frightening.`,
      shadow: `The risk is enduring financial strain quietly for far too long — refusing to ask for help, take a loan, or admit the pressure is real, because your identity has become tied to being the one who can handle it. That silent endurance can let a fixable problem compound into a much larger one before anyone, including you, addresses it directly.`,
      path: `Let your endurance include asking for support before the pressure becomes a crisis. Real strength here isn't never needing help — it's staying steady enough to recognize early when you do, and saying so.`,
      positive: `You handle real financial pressure with genuine calm, and because you ask for support before it becomes a crisis, that steadiness prevents small problems from compounding.`,
      negative: `Enduring financial strain silently, out of a need to always be the one who can handle it, lets fixable problems compound into much larger ones before anyone steps in.`,
    },

    // ── 12 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '12_C': {
      heading: `Your Financial Breakthroughs Come From the Path You Weren't Supposed to Take`,
      why: `Real financial breakthroughs for you tend to come from stepping back from the expected route, seeing your career or income differently than the standard advice would suggest. The Hanged Man on your Earth Line means your material path is genuinely unconventional. You have a real gift for material patience: the willingness to earn less by conventional measures for a while in exchange for a perspective that eventually pays off in ways a straight line wouldn't have.`,
      shadow: `The risk is suspension without a landing — staying indefinitely in the unconventional, wait-and-see posture because it's become more comfortable than actually committing to the different path you've been sensing. Financial patience can slide into financial paralysis if the insight gathered while suspended never gets converted into an actual move.`,
      path: `Let the unconventional view resolve into an unconventional action. The value of seeing differently only shows up once you actually build something from that different angle — the perspective was never the whole reward, just the necessary first half.`,
      positive: `You gain real financial insight from your willingness to see your path differently, and because you eventually act on it, that patience converts into breakthroughs a straight line wouldn't have found.`,
      negative: `Staying suspended in the different perspective without ever acting on it turns real financial patience into simple paralysis, with no breakthrough to show for the wait.`,
    },

    // ── 13 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '13_C': {
      heading: `Your Wealth Requires You to Actually Let the Old Version End`,
      why: `You have a real capacity most people lack: the willingness to release material security that's become familiar but limiting, in service of a bigger version that requires the old one to end first. Transformation on your Earth Line means your material growth happens through genuine reinvention — letting an outdated income source, career identity, or financial strategy actually die so a better-fitting one can take its place.`,
      shadow: `The risk is holding onto a dying income stream out of fear rather than function — maintaining a job, business, or strategy well past the point it's actually still working, because the uncertainty of the gap between old and new feels more dangerous than the slow decline. If your finances feel stuck in a holding pattern, something may need to be actively released rather than further optimized.`,
      path: `Let the ending be deliberate rather than something that happens to you. Identify what's actually complete, and release it on your terms before it forces the issue. The gap between old and new is uncomfortable, but it's also exactly where the reinvention happens.`,
      positive: `You let outdated income sources end deliberately, and that willingness to release what's complete is exactly what makes room for the reinvention that actually grows your wealth.`,
      negative: `Holding onto a dying income stream out of fear of the gap keeps real growth stuck in a slow decline that a clean ending could have resolved.`,
    },

    // ── 14 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '14_C': {
      heading: `Your Money Grows Best When You Stop Choosing Just One Strategy`,
      why: `You have real patience for letting a diversified financial life mature slowly, trusting that the combination will outperform any single aggressive bet. Temperance on your Earth Line gives you this genuine material gift for blending: combining multiple income streams, investment strategies, or financial approaches into one sustainable whole rather than betting everything on a single method.`,
      shadow: `The risk is a financial life so diversified it never develops real depth anywhere — spreading attention and resources so thin across strategies that none of them actually compounds into something substantial. Balance can become an avoidance of the more exposing choice of genuinely committing to one thing. If your finances feel diluted rather than diversified, the blend may need fewer ingredients, held longer.`,
      path: `Let a few of your financial streams go deep instead of keeping all of them shallow. Real temperance isn't spreading evenly across everything — it's patient, deliberate combination of the ingredients that actually matter, given enough time in the same vessel to actually blend.`,
      positive: `You build genuine, sustainable wealth by patiently combining a few well-chosen strategies, letting them actually deepen instead of spreading thin.`,
      negative: `Diversifying across too many strategies at once keeps every one of them shallow, diluting what patient depth in just a few could have actually compounded.`,
    },

    // ── 15 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '15_C': {
      heading: `You Understand Money's Pull in a Way Most People Don't Admit`,
      why: `You understand, more clearly than most people are willing to admit, exactly how money, status, and security actually work on people, including you. The Devil on your Earth Line gives you this unusually honest, unflinching relationship with material power — real material intelligence: a genuine gift for generating resources and building leverage, undistracted by the polite fictions other people tell themselves about wealth.`,
      shadow: `The risk is mistaking accumulation itself for security — gripping money, status, or control so tightly that the pursuit of "enough" never actually arrives, because the attachment was never really about the number. It can also show up as using material leverage over people close to you, mistaking control for care. If wealth keeps growing but the anxiety never eases, the chains may be tighter than the actual need for security requires.`,
      path: `Name plainly what the accumulation is actually trying to provide, and ask honestly whether more of it will ever really provide that. Real material mastery here isn't rejecting the drive — it's loosening its grip enough to actually enjoy what you've built instead of just defending it.`,
      positive: `You generate real material power with unflinching clarity, and because you've loosened the grip of compulsive accumulation, you actually get to enjoy the security you've built.`,
      negative: `Gripping wealth or control as a stand-in for security that never actually arrives keeps the anxiety constant no matter how much accumulates.`,
    },

    // ── 16 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '16_C': {
      heading: `You See a Failing Financial Structure Before Anyone Else Admits It's Failing`,
      why: `You can see, often well before other people are willing to, that a job, investment, or financial structure is built on a foundation that won't hold. The Tower on your Earth Line gives you this genuine gift for sudden material clarity. Your material breakthroughs tend to arrive fast rather than gradually: a sudden, decisive reorganization of your financial life once the illusion holding an unstable structure together finally becomes visible to you.`,
      shadow: `The risk is provoking the collapse before it's actually necessary — walking away from a financial structure the moment it shows any crack, out of an impatience with instability rather than genuine evidence it's unsalvageable. It can also mean recurring financial upheaval, if some part of you has come to associate real change with crisis and keeps generating one to feel like growth is happening.`,
      path: `Let your clarity about a failing structure inform a deliberate exit, not just a reactive one. Not every crack requires immediate demolition — some genuinely can be reinforced. Save the sudden reorganization for the structures that actually can't hold.`,
      positive: `You see failing financial structures early and act decisively, and because that action is deliberate rather than reactive, your material reorganizations land as real breakthroughs, not repeated crises.`,
      negative: `Treating every crack as a reason for immediate collapse creates recurring financial upheaval where patient reinforcement would have actually held.`,
    },

    // ── 17 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '17_C': {
      heading: `Your Financial Renewal Comes After You've Actually Rebuilt`,
      why: `You carry a real capacity to restore your material life even from genuine loss, generating fresh security the way the Star pours water onto both the parched earth and the flowing stream: replenishing what's dry and sustaining what's already moving. The Star on your Earth Line means genuine financial renewal is available to you, but specifically the kind that arrives after real material rebuilding — not luck falling from the sky, but hope translated into the patient reconstruction of your resources after a setback.`,
      shadow: `The risk is waiting passively for financial renewal to simply arrive, treating hope as a strategy instead of a starting point — a belief that things will "work out" materially without the corresponding rebuilding effort. It can also show up as chronic financial restarting, where each setback becomes an identity rather than a stage to move through. If your material life keeps needing "renewal" without ever consolidating into real stability, hope may be substituting for the rebuilding work it was meant to inspire.`,
      path: `Try pairing your genuine capacity for hope with concrete rebuilding steps — a real plan, not just faith that things will improve. The renewal is real, but it needs your hands in it to actually take material form.`,
      positive: `You pair genuine hope with real rebuilding effort, so financial renewal actually consolidates into lasting stability instead of just another hopeful restart.`,
      negative: `Waiting for financial renewal to simply arrive, without the rebuilding effort behind it, keeps you cycling through hopeful restarts that never quite consolidate.`,
    },

    // ── 18 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '18_C': {
      heading: `You Sense Financial Trouble Before There's Any Proof of It`,
      why: `You often know something is off (or promising) about a deal, a job, an investment, long before you could point to concrete evidence, and that instinct is frequently right. The Moon on your Earth Line gives you this genuinely sensitive material intuition — a felt sense for hidden risk or opportunity in a financial situation well before it shows up in any visible data.`,
      shadow: `The risk is financial anxiety that's actually unmoored from real signal — a free-floating unease about money that colors every decision, making it hard to tell genuine intuitive warning from simple fear. This can lead to either paralysis (never acting because something always feels uncertain) or chasing illusory security in things that only look stable. If your financial fears keep outrunning any actual evidence, the sensitivity may need more grounding, not more vigilance.`,
      path: `Pair your financial intuition with a concrete grounding practice — a real budget, a real number, something tangible to check the feeling against. The intuition is genuinely valuable; it just needs a tether to material reality so you can tell true signal from anxious noise.`,
      positive: `Your financial intuition catches real risk and opportunity early, and because it's grounded in concrete numbers, you can trust it instead of drowning it in undifferentiated anxiety.`,
      negative: `Ungrounded financial anxiety makes every decision feel uncertain, leading to paralysis or to chasing illusions of security that don't actually hold.`,
    },

    // ── 19 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '19_C': {
      heading: `Your Money Flows Easiest When the Work Actually Feels Like You`,
      why: `You build real, sustainable wealth most easily through work that genuinely feels like you, offered visibly and without the heaviness of grinding through something you don't believe in. The Sun on your Earth Line means your material abundance is tied directly to authenticity and joy. You have a natural, uncomplicated ease with money that most people spend years trying to develop.`,
      shadow: `The risk is that ease gets mistaken, by you or by others, for a lack of seriousness — underpricing joyful work because it didn't feel like enough of a struggle to be worth real money, or facing resistance from people who distrust wealth that came easily. If you're quietly undercharging for work that lights you up, that's the shadow of ease doing double duty as self-doubt.`,
      path: `Let the joy and the price coexist without needing to apologize for either. Work that feels easy to you can still be genuinely valuable to someone else — the ease of your gift doesn't lower what it's worth.`,
      positive: `You build real wealth through work that genuinely feels like you, and because you price that joy honestly, the ease becomes sustainable abundance instead of undervalued labor.`,
      negative: `Mistaking ease for a lack of value leads to underpricing the very work that lights you up, leaving real abundance on the table out of quiet self-doubt.`,
    },

    // ── 20 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '20_C': {
      heading: `A Truer Version of Your Income Is Already Calling You`,
      why: `Your current income source no longer matches who you've become, and something truer is asking to be answered — an inner sense, growing harder to ignore. Judgement on your Earth Line means your material life is oriented around a genuine vocational summons. This is a real material gift: the capacity to recognize when it's time to leave a financially adequate but personally outgrown position for one that actually fits.`,
      shadow: `The risk is hearing that summons and spending years preparing to answer it instead of actually answering — staying in the outgrown job or business while endlessly upskilling, researching, or waiting for more certainty, because the leap itself feels too exposing. If your income has felt stagnant despite real effort, the effort may be going into preparation rather than the actual move.`,
      path: `Answer the summons before you feel fully ready — the readiness tends to arrive in the moving, not before it. One deliberate step toward the truer income source is worth more than another year of research.`,
      positive: `You answer your vocational summons when it arrives rather than endlessly preparing, and the material life you actually build finally matches who you've become.`,
      negative: `Endless preparation instead of action keeps your income tied to a version of yourself you've already outgrown, stagnant despite real effort.`,
    },

    // ── 21 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '21_C': {
      heading: `You're Built to Actually Arrive at Security, Not Just Chase It`,
      why: `You have a real capacity most people lack: the ability to actually feel and recognize when a level of material security has been reached, rather than immediately redefining "enough" upward the moment you arrive. The World on your Earth Line means your material path is oriented toward genuine, lasting completion — real financial mastery that comes from seeing a plan through its full cycle rather than perpetually restarting.`,
      shadow: `The risk is fear of the next cycle showing up as an inability to ever call the current one complete — always one more milestone before you'll let yourself feel secure, treating arrival itself as dangerous because it means facing whatever comes next. If your finances feel expansive but you never actually feel secure, completion itself may be the thing you're avoiding.`,
      path: `Practice letting a real milestone count as real, even knowing another cycle will eventually begin. Security doesn't have to be permanent to be genuine — let yourself actually land in it before building toward the next one.`,
      positive: `You can recognize and receive genuine financial completion, letting real security land before the next cycle begins, instead of perpetually redefining "enough."`,
      negative: `Refusing to ever call a financial milestone complete keeps you expansive but never actually secure, avoiding the exposure of a genuine arrival.`,
    },

    // ── 22 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '22_C': {
      heading: `You're Willing to Bet On Yourself Before There's Any Proof It'll Work`,
      why: `You have a willingness to start a financial venture, a new income path, or a real risk without needing a guarantee first. The Fool on your Earth Line gives you this genuine, uncommon material courage. This is trust functioning as financial strategy: real openness to material possibility that isn't waiting for certainty before it moves, which lets you access opportunities that people requiring more proof simply never reach.`,
      shadow: `The risk is repeating the same fresh financial start without absorbing what the last one actually taught you — leaping into a new venture with the same openness every time, but no accumulating wisdom underneath it, so the same avoidable mistakes recur in new disguises. If your finances keep resetting instead of building, the openness may need a partner in discernment.`,
      path: `Let each financial leap teach you something concrete you actually carry into the next one. The willingness to start fresh is a real gift — pairing it with genuine reflection on what worked and what didn't is what turns repeated starts into accumulating wealth.`,
      positive: `You take real financial leaps without needing guarantees first, and because you let each one teach you something durable, your courage compounds into wealth instead of just repeating.`,
      negative: `Leaping into fresh financial starts without absorbing the last one's lessons keeps your finances resetting instead of ever actually building.`,
    },

    // ── 17 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ───
    '17_D': {
      heading: `The Light You Learned to Turn Down`,
      why: `Something in you carries a deep, wordless conviction that you're meant for something luminous — and, right alongside it, an equally strong instinct to shrink from exactly that exposure. Both of those are real, and they come from the same place. The Star sits at the base of your matrix, in your Karmic Tail — the deepest inherited work of the soul — and the lesson you carried into this life circles around visibility and light: the capacity to shine, to be seen, to offer hope and brilliance to the people around you. This is the one position in the matrix that arrives already in shadow. It's not a gift you were simply handed. It's a debt the soul came here to repay — the debt of dimmed light, a past pattern of brilliance traded away for safety, talent kept but never fully offered.`,
      shadow: `You might notice a quiet, structural belief that your light is dangerous — to you or to someone else — and safer kept low. It can show up as impostor feelings that arrive right when recognition is finally within reach, as a talent you've deliberately left half-developed so it can never really be judged, as a habit of pouring your belief into everyone else's potential while withholding it from your own. It's worth naming plainly: if life keeps handing you visibility and you keep quietly turning it down, that's not something happening to you — it's a signal you're broadcasting that being seen isn't safe, and the world is simply responding to that. Because this runs deeper than a personal habit, it can feel less like a choice and more like gravity — a pull back toward staying unseen every time you get close to the edge of being truly known.`,
      path: `This position is built for redemption — it's the one place in the matrix that explicitly asks you to move something out of shadow and into light, and finish something older than this lifetime. For you, that means practicing the uncomfortable thing: letting yourself be seen before you feel ready. Share the work. Take up the visibility. Let your light land on other people even when every old instinct says to dim it. You don't have to wait for the world to hand you a stage — the world tends to match whatever you're actually broadcasting, which means the visibility you want has to start with you before it can arrive from outside. You don't have to manufacture the brilliance. It's already yours, and it always was. You just have to stop hiding it. Every time you choose visible over vanished, you pay the debt down a little and reclaim the exact gift you came here to give.`,
      positive: `You're genuinely willing to be seen, and the world responds in kind — recognition, opportunity, and audience arrive because you've stopped signaling that your light needs to stay hidden.`,
      negative: `When some part of you is still broadcasting that visibility isn't safe, you keep meeting chances to be seen and then quietly declining them — matching the very signal you're actually sending.`,
    },

    // ── 1 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '1_D': {
      heading: `The Power You're Here to Finally Follow Through On`,
      why: `Something in you carries a deep, wordless unease around unfinished power — a sense that in some prior turn, real capability was wielded quickly and then abandoned before it could actually build anything lasting. The Magician sits at the base of your matrix, in your Karmic Tail — the deepest inherited work of the soul — and the lesson circles around origination without completion: gifts started, wielded, even impressive, but never carried all the way through to something durable. This debt isn't about lacking talent. It's about talent that was spent instead of built with.`,
      shadow: `You might notice a persistent pull to start over rather than stay — new projects feel more alive than old ones the moment the initial spark fades, and something in you treats finishing as almost beside the point. It's worth naming plainly: if life keeps handing you fresh starts that never quite land, that's not scattered luck, it's a debt still unpaid, a pattern of beginning that hasn't yet been matched by a pattern of staying.`,
      path: `This position is built for redemption through completion — the one thing the debt is actually asking for. Pick something you've already started and finish it, especially past the point where a new idea starts to look more appealing. Every time you choose staying over starting again, you pay the debt down and reclaim the real, durable power that was always yours to build with.`,
      positive: `You've learned to stay with what you start, and each completed thing you build repays an old debt of abandoned beginnings, converting real talent into something lasting.`,
      negative: `An old pattern of starting and abandoning keeps repeating when new beginnings are chosen over unfinished ones — power spent again and again, never quite becoming anything durable.`,
    },

    // ── 2 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '2_D': {
      heading: `The Knowing You're Here to Finally Speak Out Loud`,
      why: `Something in you carries a quiet, wordless caution around your own inner knowing — as though speaking it plainly once cost something, and the safer move has always been to keep it to yourself. The High Priestess sits at the base of your matrix, in your Karmic Tail, and the debt she marks is withheld knowing: real intuition that was kept private, perhaps hoarded, perhaps silenced, in whatever came before this life. What you're carrying isn't a lack of insight — it's insight that's still waiting for permission to be spoken.`,
      shadow: `You might notice yourself sensing things clearly and saying nothing, again and again, letting other people arrive at conclusions slower than you already have. It's worth naming plainly: if you keep feeling unseen or unheard despite knowing exactly what's true, that's not the world failing to notice you — it's an old debt of silence still being paid in the same coin.`,
      path: `This position asks for one specific redemption: speak the knowing before it's asked for. Not loudly, not all at once — just consistently, in small moments, trusting that voicing it won't cost what it apparently cost before. Every time you say the true thing instead of holding it, you pay the debt down and reclaim a voice that was always yours.`,
      positive: `You've learned to speak your inner knowing rather than guard it, and each time you do, an old debt of silence gets repaid, letting real insight finally reach the people who need it.`,
      negative: `A pattern of sensing the truth and staying quiet keeps repeating, leaving you feeling unseen in exactly the way silence was never going to prevent.`,
    },

    // ── 3 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '3_D': {
      heading: `The Abundance You're Here to Finally Receive, Not Just Give`,
      why: `Something in you carries an old, wordless imbalance around giving and receiving — a sense that generosity was once poured out until nothing was left, or that receiving was never really safe to do. The Empress sits at the base of your matrix, in your Karmic Tail, and the debt she marks is depleted generativity: a pattern, carried from before, of nurturing everyone and everything except the source doing the nurturing. What you're here to redeem isn't your capacity to give — that's already proven. It's your capacity to receive.`,
      shadow: `You might notice a reflexive discomfort with being cared for, a tendency to deflect help even when it's genuinely offered, an old exhaustion that never fully lifts no matter how much you give. It's worth naming plainly: if you keep meeting people who take more than they give, that's not just bad luck — it's an old pattern of depletion still finding the same shape to repeat itself in.`,
      path: `This position asks for one specific redemption: let yourself actually receive, without immediately reciprocating or deflecting. Practice taking in care, resources, and rest as though you've genuinely earned them — because you have. Every time you receive instead of just giving, you pay the debt down and restore the balance the abundance was always meant to run on.`,
      positive: `You've learned to receive as readily as you give, and that restored balance is what lets your generativity finally replenish instead of quietly running you dry.`,
      negative: `A pattern of giving until depleted keeps repeating when receiving is reflexively deflected, and the same imbalance draws people who take without giving back.`,
    },

    // ── 4 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '4_D': {
      heading: `The Authority You're Here to Finally Hold Steady`,
      why: `Something in you carries an old, wordless tension around authority — either wielded harshly once, or abdicated entirely, leaving a residue of discomfort with power itself. The Emperor sits at the base of your matrix, in your Karmic Tail, and the debt he marks is structure mishandled: order that was either imposed without care or never claimed at all in whatever came before this life. What you're here to redeem is steady, responsible authority — neither tyranny nor absence, but the middle ground you likely haven't fully trusted yet.`,
      shadow: `You might notice you either overcorrect into rigid control or avoid claiming authority altogether, uncomfortable with the space in between. It's worth naming plainly: if you keep finding yourself in either chaotic, structureless situations or oppressively controlled ones, that's not coincidence — it's an old imbalance around power still looking for its resolution.`,
      path: `This position asks for one specific redemption: practice holding authority gently but firmly, in small doses, until the middle ground stops feeling foreign. Build one structure, own one decision, without either gripping it or handing it away. Every time you do, you pay the debt down and reclaim authority as something safe to actually hold.`,
      positive: `You've learned to hold authority steadily, neither gripping nor abdicating it, and that balance repays an old debt of power mishandled or avoided.`,
      negative: `A pattern of overcontrolling or under-claiming authority keeps repeating, drawing either chaotic or oppressive situations that mirror the imbalance still unresolved.`,
    },

    // ── 5 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '5_D': {
      heading: `The Wisdom You're Here to Finally Make Your Own`,
      why: `Something in you carries an old, wordless tension with tradition and belief — either swallowed whole once without question, or rejected entirely out of rebellion. The Hierophant sits at the base of your matrix, in your Karmic Tail, and the debt he marks is inherited belief left unexamined: doctrine followed blindly, or discarded reflexively, in whatever came before this life, without ever actually being tested and chosen. What you're here to redeem is conscious belief — wisdom that's genuinely yours, not installed or reacted against.`,
      shadow: `You might notice yourself alternating between rigid certainty and total skepticism, rarely landing on a belief you've actually examined and kept on purpose. It's worth naming plainly: if you keep circling the same unresolved questions about faith, authority, or meaning, that's not indecision — it's an old debt of unexamined belief still waiting for its accounting.`,
      path: `This position asks for one specific redemption: actually examine a belief you've been carrying, whether inherited or rebelled against, and consciously choose what stays. Every time you do, you pay the debt down and replace installed or reactive belief with something genuinely, deliberately your own.`,
      positive: `You've learned to consciously examine and choose your beliefs rather than inherit or reject them wholesale, and that ownership repays an old debt of unexamined faith.`,
      negative: `A pattern of alternating between blind belief and blanket rejection keeps repeating, leaving the same unresolved questions circling without ever actually being settled.`,
    },

    // ── 6 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '6_D': {
      heading: `The Choice You're Here to Finally Make and Keep`,
      why: `Something in you carries an old, wordless ache around choosing — a sense that a real decision was once avoided, or made for the wrong reasons, leaving a residue that shows up as difficulty committing now. The Lovers sit at the base of your matrix, in your Karmic Tail, and the debt they mark is unmade or unowned choice: a crossroads from before that was left unresolved, or resolved for someone else's sake instead of your own. What you're here to redeem is a choice made cleanly, from your actual values, and then kept.`,
      shadow: `You might notice a pattern of one foot out the door in decisions that matter — relationships, paths, commitments held loosely enough to exit without much cost. It's worth naming plainly: if you keep finding yourself at crossroads that never quite resolve, that's not indecisiveness as a personality trait — it's an old unmade choice still looking for its resolution.`,
      path: `This position asks for one specific redemption: make a real choice, from your own values rather than obligation, and stay inside it long enough to see it through. Every time you do, you pay the debt down and prove to yourself that commitment doesn't cost what it apparently cost before.`,
      positive: `You've learned to choose cleanly from your own values and commit fully, and that follow-through repays an old debt of choices avoided or wrongly made.`,
      negative: `A pattern of half-committing, one foot always near the door, keeps repeating an old unresolved choice that's never actually been met and closed.`,
    },

    // ── 7 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '7_D': {
      heading: `The Direction You're Here to Finally Hold Without Gripping`,
      why: `Something in you carries an old, wordless struggle with direction — either driven so hard toward a goal that something important got run over, or so lost that no direction was ever actually chosen. The Chariot sits at the base of your matrix, in your Karmic Tail, and the debt it marks is navigation gone wrong: willpower applied with too much force, or never applied at all, in whatever came before this life. What you're here to redeem is steady, trusting forward motion — direction held firmly but without the old grip.`,
      shadow: `You might notice you either force your way through everything or drift without any real momentum, rarely finding the steady middle. It's worth naming plainly: if your progress keeps stalling or your momentum keeps costing you people and health, that's not just circumstance — it's an old pattern of misdirected will still running its course.`,
      path: `This position asks for one specific redemption: choose a direction and move toward it steadily, checking your grip regularly so force doesn't replace trust. Every time you do, you pay the debt down and prove that forward motion doesn't require the old extremes.`,
      positive: `You've learned to hold direction steadily without gripping or drifting, and that balanced momentum repays an old debt of navigation gone to either extreme.`,
      negative: `A pattern of forcing your way through or drifting without direction keeps repeating an old imbalance in will that hasn't yet found its steady middle.`,
    },

    // ── 8 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '8_D': {
      heading: `The Balance You're Here to Finally Restore`,
      why: `Something in you carries an old, wordless weight around fairness — a sense that a real imbalance, a debt or a wrong, was left unaddressed in whatever came before this life. Justice sits at the base of your matrix, in your Karmic Tail, and the debt she marks is unresolved accounting: a scale that never quite settled, whether you were the one wronged or the one who did the wronging. What you're here to redeem is honest restoration — not punishment, just genuine balance finally met.`,
      shadow: `You might notice a persistent, hard-to-place sense of owing or being owed, a discomfort that surfaces around fairness even in situations that don't fully explain it. It's worth naming plainly: if unfair situations keep finding you specifically, that's not just bad luck — it's an old unsettled account still looking for its resolution.`,
      path: `This position asks for one specific redemption: make one honest accounting in your current life — an apology owed, a boundary finally held, a debt actually repaid. Every time you do, you settle a little more of the old imbalance and free yourself from having to keep encountering its echo.`,
      positive: `You've learned to make honest accountings in your own life, and each one settles a little more of an old, unresolved imbalance, freeing you from its repeating echo.`,
      negative: `An old, unsettled account keeps finding new situations to surface in, as unaddressed imbalance looks for the restoration it never received.`,
    },

    // ── 9 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '9_D': {
      heading: `The Light You're Here to Finally Lend to Someone Else`,
      why: `Something in you carries an old, wordless caution around being fully seen in your wisdom — a sense that solitude was once used to hide rather than to genuinely gather insight, or that hard-won understanding was kept entirely to yourself. The Hermit sits at the base of your matrix, in your Karmic Tail, and the debt he marks is unshared wisdom: real knowing gathered in withdrawal, but never carried back out to actually help anyone. What you're here to redeem is offering the lantern, not just carrying it.`,
      shadow: `You might notice a pull toward isolation that goes past what genuine reflection requires — withdrawal used to avoid rather than to gather. It's worth naming plainly: if you keep feeling unseen despite carrying real depth, that's not bad luck — it's an old pattern of hidden wisdom still waiting to be offered.`,
      path: `This position asks for one specific redemption: share something you've learned in solitude with someone who could actually use it. Every time you do, you pay the debt down and prove that your light was never meant to stay only yours.`,
      positive: `You've learned to offer your hard-won wisdom rather than keep it hidden, and each time you do, an old debt of withheld insight gets repaid.`,
      negative: `A pattern of withdrawing into isolation rather than genuinely gathering insight keeps repeating an old debt of wisdom that was never actually offered.`,
    },

    // ── 10 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '10_D': {
      heading: `The Turning You're Here to Finally Stop Resisting`,
      why: `Something in you carries an old, wordless fear of the wheel's downswing — a sense that in whatever came before this life, a real turning was resisted, gripped against, or met with despair rather than trust. The Wheel of Fortune sits at the base of your matrix, in your Karmic Tail, and the debt it marks is resistance to cyclical change: an old belief that stability means stopping the wheel rather than learning to move with it. What you're here to redeem is trust in the turning itself.`,
      shadow: `You might notice a disproportionate dread around change, or a tendency to grip too hard at a high point, refusing to let a natural cycle complete. It's worth naming plainly: if collapse keeps arriving harder than it needs to, that's often resistance itself adding weight to a turn that could have moved more gently.`,
      path: `This position asks for one specific redemption: let one cycle in your current life turn without resisting it — a season ending, a role changing, a high point passing. Every time you do, you pay the debt down and prove the wheel doesn't require your grip to keep you safe.`,
      positive: `You've learned to trust the wheel's natural turning rather than resist it, and that trust repays an old debt of gripping against change that only made its arrival harder.`,
      negative: `An old fear of the downswing keeps gripping against natural cycles, and that resistance is often what turns an ordinary turning into a harder collapse.`,
    },

    // ── 11 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '11_D': {
      heading: `The Gentleness You're Here to Finally Trust as Strength`,
      why: `Something in you carries an old, wordless confusion about what real strength is — a sense that in whatever came before this life, force was mistaken for power, or collapse happened where steady gentleness was actually needed. Strength sits at the base of your matrix, in your Karmic Tail, and the debt it marks is a misunderstanding of power itself: domination or breakdown, rather than the tamed, patient endurance this card actually represents. What you're here to redeem is gentle, embodied resilience.`,
      shadow: `You might notice you either overpower situations that needed patience, or collapse under pressure that gentleness could have actually held. It's worth naming plainly: if you keep meeting people or situations that test your composure past its limits, that's often an old imbalance between force and collapse still looking for its middle ground.`,
      path: `This position asks for one specific redemption: meet one difficult moment with patient, embodied calm rather than force or collapse. Every time you do, you pay the debt down and prove that real strength was never about overpowering — it was always about staying, gently.`,
      positive: `You've learned to meet pressure with patient, embodied calm rather than force or collapse, and that tamed strength repays an old debt around power misunderstood.`,
      negative: `A pattern of either overpowering or collapsing under pressure keeps repeating an old confusion about strength that hasn't yet found its gentler middle.`,
    },

    // ── 12 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '12_D': {
      heading: `The Letting Go You're Here to Finally Mean`,
      why: `Something in you carries an old, wordless resistance to surrender — a sense that in whatever came before this life, release was either refused entirely, or performed as sacrifice without ever being genuinely felt. The Hanged Man sits at the base of your matrix, in your Karmic Tail, and the debt he marks is unfinished surrender: a suspension that was either avoided or turned into martyrdom rather than real, voluntary release. What you're here to redeem is letting go that's actually meant.`,
      shadow: `You might notice a pattern of gripping control until circumstances force your hand, or performing sacrifice publicly while privately resenting it. It's worth naming plainly: if you keep being forced into releases you didn't choose, that's often an old debt of resisted surrender finally collecting itself, one way or another.`,
      path: `This position asks for one specific redemption: choose to release something voluntarily, before you're forced to, and mean it rather than perform it. Every time you do, you pay the debt down and prove that surrender doesn't have to arrive as loss.`,
      positive: `You've learned to release things voluntarily and genuinely, rather than under duress or as performance, and that real surrender repays an old debt of resisted letting go.`,
      negative: `A pattern of gripping until forced to release, or performing sacrifice without meaning it, keeps repeating an old debt that surrender never actually resolved.`,
    },

    // ── 13 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '13_D': {
      heading: `The Ending You're Here to Finally Let Finish`,
      why: `Something in you carries an old, wordless resistance to letting things fully end — a sense that in whatever came before this life, a necessary release was interrupted, avoided, or only partially completed. Transformation sits at the base of your matrix, in your Karmic Tail — the deepest inherited work of the soul — and the debt it marks is unfinished ending: something that should have been allowed to fully die, but instead lingered, half-released, carried forward instead of completed.`,
      shadow: `You might notice a pattern of endings that never quite land — relationships, jobs, or identities that you leave without fully leaving, keeping one foot in a door you've already decided to walk through. It's worth naming plainly: if the same situation keeps almost-ending without ever actually closing, that's not just circumstance — it's an old, unfinished release still looking for its completion.`,
      path: `This position is built for redemption through completion — letting one ending in your current life actually finish, fully, without keeping a thread attached. Every time you let something genuinely die instead of half-releasing it, you pay the debt down and free the space for what's actually next.`,
      positive: `You've learned to let endings actually finish, fully, and each complete release repays an old debt of endings that were once only half-completed.`,
      negative: `A pattern of endings that never quite land — one foot still in a door already meant to be closed — keeps repeating an old, unfinished release that's still waiting for its completion.`,
    },

    // ── 14 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '14_D': {
      heading: `The Middle Path You're Here to Finally Walk`,
      why: `Something in you carries an old, wordless exhaustion from extremes — a sense that in whatever came before this life, you swung between opposing forces without ever finding the blend that could hold both. Temperance sits at the base of your matrix, in your Karmic Tail, and the debt she marks is unintegrated polarity: intensity without balance, or balance without ever actually engaging the intensity underneath it. What you're here to redeem is patient, genuine synthesis.`,
      shadow: `You might notice a pattern of oscillating between all-or-nothing states — total immersion or total withdrawal, rarely the sustained middle. It's worth naming plainly: if your life keeps feeling like a series of overcorrections, that's often an old imbalance still looking for the patient blend it never found before.`,
      path: `This position asks for one specific redemption: hold two seemingly opposed things at once, deliberately, without collapsing into either extreme. Every time you do, you pay the debt down and prove that the middle path isn't a compromise — it's mastery.`,
      positive: `You've learned to patiently hold opposing forces in genuine balance, and that integration repays an old debt of extremes that never found their blend.`,
      negative: `A pattern of oscillating between all-or-nothing extremes keeps repeating an old imbalance still searching for the middle path it never walked before.`,
    },

    // ── 15 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '15_D': {
      heading: `The Chains You're Here to Finally Notice Are Loose`,
      why: `Something in you carries an old, wordless familiarity with bondage — a sense that in whatever came before this life, you were bound to something, whether material excess, control over others, or being controlled, and never quite found your way to genuine freedom. The Devil sits at the base of your matrix, in your Karmic Tail, and the debt he marks is unexamined attachment: chains worn so long they stopped being noticed as chains at all. What you're here to redeem is conscious liberation.`,
      shadow: `You might notice a pattern of recreating dynamics of control, whether being controlled or controlling others, without quite seeing the pattern while it's happening. It's worth naming plainly: if you keep meeting people who seem to take advantage of you, or catch yourself doing the same to others, that's often an old, unexamined bind still playing itself out.`,
      path: `This position asks for one specific redemption: name one attachment or dynamic of control honestly, and take one real step to loosen it. Every time you do, you pay the debt down and prove the chains were never actually locked.`,
      positive: `You've learned to name and loosen old attachments to control, and that conscious liberation repays a debt of bondage that had gone unexamined for a long time.`,
      negative: `A pattern of controlling or being controlled keeps recreating itself when the underlying attachment goes unnamed and unexamined.`,
    },

    // ── 16 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '16_D': {
      heading: `The Collapse You're Here to Finally Let Finish`,
      why: `Something in you carries an old, wordless dread of structural collapse — a sense that in whatever came before this life, a necessary falling-apart was resisted, propped up, or interrupted before it could actually complete. The Tower sits at the base of your matrix, in your Karmic Tail, and the debt it marks is unfinished demolition: a structure that should have come down, but didn't, and so keeps threatening to fall in this life instead. What you're here to redeem is letting a necessary collapse actually finish.`,
      shadow: `You might notice a pattern of maintaining structures — beliefs, relationships, identities — well past the point they're actually still standing on solid ground, out of fear of what a real collapse would mean. It's worth naming plainly: if sudden upheavals keep arriving in your life, that's often an old, incomplete collapse still trying to finish what it started before.`,
      path: `This position asks for one specific redemption: let one structure that's already failing actually fall, on your own terms, rather than propping it up further. Every time you do, you pay the debt down and prove that collapse can be survived, and even useful.`,
      positive: `You've learned to let failing structures actually finish falling rather than propping them up, and that willingness repays an old debt of interrupted collapse.`,
      negative: `A pattern of propping up structures that are already failing keeps repeating an old, unfinished collapse that eventually forces its own completion, harder than it needed to.`,
    },

    // ── 18 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '18_D': {
      heading: `The Fog You're Here to Finally Walk Through, Not Around`,
      why: `Something in you carries an old, wordless familiarity with fear and illusion — a sense that in whatever came before this life, something frightening was never fully faced, just avoided, leaving a residue of vague dread that outlives any specific cause. The Moon sits at the base of your matrix, in your Karmic Tail, and the debt she marks is unprocessed fear: illusion that was never walked through, just circled around. What you're here to redeem is clarity earned by actually entering the fog instead of avoiding it.`,
      shadow: `You might notice free-floating anxiety that doesn't attach cleanly to anything in your current life, or a pattern of avoiding situations that would require facing something uncertain head-on. It's worth naming plainly: if unclear, unsettling situations keep finding you, that's often an old fear still waiting for the direct look it never got before.`,
      path: `This position asks for one specific redemption: walk directly into one uncertain, unsettling situation instead of avoiding it, and let the clarity come from actually being inside it. Every time you do, you pay the debt down and prove the fog was survivable all along.`,
      positive: `You've learned to walk directly into uncertainty instead of avoiding it, and that willingness repays an old debt of fear that was never fully faced before.`,
      negative: `A pattern of avoiding uncertain, unsettling situations keeps an old, unprocessed fear alive, circling instead of ever actually being walked through.`,
    },

    // ── 19 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '19_D': {
      heading: `The Joy You're Here to Finally Stop Dimming`,
      why: `Something in you carries an old, wordless caution around being fully, visibly happy — a sense that in whatever came before this life, authentic joy was dangerous, envied, or punished, and so it got dimmed down to something safer. The Sun sits at the base of your matrix, in your Karmic Tail, and the debt it marks is muted radiance: real vitality that learned to hide itself. What you're here to redeem is joy offered openly, without apology or self-editing.`,
      shadow: `You might notice a reflexive instinct to downplay good news, mute your own excitement, or feel guilty when things are genuinely going well. It's worth naming plainly: if your happiest moments keep feeling like they need to be hidden or minimized, that's often an old debt of dimmed radiance still running its old caution.`,
      path: `This position asks for one specific redemption: let one genuine moment of joy be fully visible, without minimizing it for anyone else's comfort. Every time you do, you pay the debt down and prove that your light was never actually the danger it once seemed to be.`,
      positive: `You've learned to let your joy be fully visible without minimizing it, and that openness repays an old debt of radiance that once had to hide.`,
      negative: `A pattern of muting your own joy or downplaying good fortune keeps an old debt of dimmed radiance in place, still running on caution that's no longer needed.`,
    },

    // ── 20 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '20_D': {
      heading: `The Call You're Here to Finally Stop Postponing`,
      why: `Something in you carries an old, wordless familiarity with a summons left unanswered — a sense that in whatever came before this life, a genuine call toward something larger was heard and set aside, whether from fear or circumstance. Judgement sits at the base of your matrix, in your Karmic Tail, and the debt it marks is a postponed awakening: a call that's still, in some sense, waiting to actually be answered. What you're here to redeem is response instead of further delay.`,
      shadow: `You might notice a recurring sense of almost-arriving at something important, without ever quite crossing the threshold — false starts toward a bigger version of yourself that keep stalling just short of the actual leap. It's worth naming plainly: if the same summons keeps returning in new forms, that's often an old debt of postponement still asking for its answer.`,
      path: `This position asks for one specific redemption: answer one call you've been postponing, even imperfectly, even before you feel ready. Every time you do, you pay the debt down and prove the summons was always meant to be met, not endlessly deferred.`,
      positive: `You've learned to answer the calls that arrive instead of postponing them, and that responsiveness repays an old debt of an awakening that was once set aside.`,
      negative: `A pattern of almost-answering a call and stalling short of it keeps an old debt of postponement in place, the same summons returning in new disguises.`,
    },

    // ── 21 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '21_D': {
      heading: `The Cycle You're Here to Finally Let Complete`,
      why: `Something in you carries an old, wordless discomfort with finishing — a sense that in whatever came before this life, a significant cycle was interrupted or abandoned before it could reach genuine completion. The World sits at the base of your matrix, in your Karmic Tail, and the debt it marks is unfinished wholeness: mastery that was close, but never quite claimed. What you're here to redeem is letting something actually, fully complete in this life.`,
      shadow: `You might notice a pattern of stopping just short of finishing — projects, relationships, or goals that get to nearly-there and then quietly stall, echoing an old interruption you may not consciously remember. It's worth naming plainly: if "almost" keeps being the shape your efforts take, that's often an old, unfinished cycle still looking for its ending.`,
      path: `This position asks for one specific redemption: choose one nearly-finished thing in your life and actually complete it, resisting the old pull to stop short. Every time you do, you pay the debt down and prove that this time, the cycle gets to close.`,
      positive: `You've learned to carry things all the way to genuine completion, and every finished cycle repays an old debt of a wholeness that was once interrupted.`,
      negative: `A pattern of stopping just short of finishing keeps an old, incomplete cycle in place, "almost" recurring instead of ever actually closing.`,
    },

    // ── 22 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '22_D': {
      heading: `The Leap You're Here to Finally Take With Your Eyes Open`,
      why: `Something in you carries an old, wordless relationship with risk — a sense that in whatever came before this life, a leap was taken recklessly and cost something real, or never taken at all out of fear of exactly that cost. The Fool sits at the base of your matrix, in your Karmic Tail, and the debt he marks is an unresolved relationship with beginning: either reckless disregard for consequence, or a caution so complete that nothing new ever actually got tried. What you're here to redeem is a leap taken wisely, with real trust.`,
      shadow: `You might notice you either leap without any real consideration, or refuse to leap at all, rarely finding the trust that includes genuine awareness. It's worth naming plainly: if your life keeps offering new beginnings that you either sabotage through recklessness or decline out of fear, that's often an old debt with risk itself still looking for its resolution.`,
      path: `This position asks for one specific redemption: take one real leap, deliberately, with your eyes open — not reckless, not avoided, just genuinely chosen. Every time you do, you pay the debt down and prove that beginning again doesn't have to cost what it once did.`,
      positive: `You've learned to take real leaps with genuine trust and open eyes, neither reckless nor avoidant, and that wisdom repays an old debt with risk itself.`,
      negative: `A pattern of either reckless leaps or refused ones keeps an old, unresolved relationship with risk in place, still waiting for the wiser middle it hasn't found yet.`,
    },

    // ── 7 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '7_E': {
      heading: `You're Here to Navigate, Not to Arrive`,
      why: `You might experience stillness as failure long before you learn to recognize it as preparation — and that's one of the clearest signs of where you are. The Chariot sits at the absolute center of your matrix, in your Soul Purpose, and it doesn't mean you're here to reach some fixed destination. It means your fundamental life current is navigation itself. You're here to master movement — not necessarily speed, not conventional achievement, but the sustained, disciplined, internally generated ability to keep going in a chosen direction no matter what conditions show up. That's both a real gift and real pressure. Your soul carries something like a built-in compass, an internal sense of true north that keeps working even when everyone else's map points somewhere different. The lifelong work is trusting that compass over the noise of everyone telling you what to do instead.`,
      shadow: `The deepest trap here is a belief you've probably never fully examined: that you have to figure everything out alone. The Chariot is a solitary image — powerful, contained, masterful — and over time, that image can quietly become an elegant prison. You've likely built an extraordinary capacity for self-sufficiency that, looked at honestly, is also an extraordinary capacity for a very particular kind of loneliness — the loneliness of someone who's learned that asking for help usually creates more complication than it solves. It's worth noticing: if help keeps arriving unreliable or too late to matter, that's rarely just proof that people can't be trusted. More often, the world is matching something you decided long before anyone actually let you down — that receiving isn't safe. You might not experience yourself as lonely. You might just experience yourself as efficient. But efficiency, in the domain of the soul, isn't a virtue — it's a coping strategy that's outlived its usefulness, and it quietly keeps real support at arm's length.`,
      path: `You'll likely discover, often through a moment that overrides your usual self-sufficiency, that the Chariot was never meant to be driven by one person alone. A chariot needs a driver, horses, and terrain — a collaboration between will, energy, and the actual world as it is. Your path forward is the uncomfortable, counter-instinctive practice of receiving: taking help without immediately fixing it, taking love without cataloguing its flaws, taking in the perspective of people who see you differently than you see yourself. This is the harder truth to sit with, because it removes the comfort of "people just aren't reliable" and puts the responsibility on what you're actually willing to receive — but change what you're open to, and what shows up to meet you changes right along with it. Your soul's purpose is movement, and the most meaningful movement right now might be the inward one — toward trust, toward letting your reliable compass be read by someone else alongside you.`,
      positive: `You move with a steady, self-generated sense of direction and a genuine openness to receiving support along the way — and because that openness is real, capable people and real help consistently show up to meet it.`,
      negative: `When some part of you has already decided receiving isn't safe, help tends to arrive unreliable, late, or absent — quietly confirming the belief that self-sufficiency is the only option, and deepening the isolation it was meant to protect you from.`,
    },

    // ── 1 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '1_E': {
      heading: `Your Soul's Purpose Is Simply to Begin`,
      why: `At the deepest level, you feel most like yourself not when you've arrived somewhere, but in the act of beginning something real — you're here to be a source: someone through whom things get started, willed into being, brought from idea into form. The Magician sits at the absolute center of your matrix, in your Soul Center — your foundation of purpose — and it means your core purpose isn't a fixed destination, it's origination itself.`,
      shadow: `The trap is believing that only the beginning counts, and that your soul's worth is tied to how many things you can originate rather than to the quality of what you're willing to sustain. You can end up scattered across a lifetime of starts, chasing the high of origination itself, never quite settling into the deeper purpose underneath it — which was never just to start things, but to prove that beginning, done honestly, actually changes reality.`,
      path: `Let your purpose include follow-through as sacred, not just secondary. One thing, seen through, is worth more to your soul than ten things merely sparked. The deepest version of your purpose isn't endless beginning — it's proving, to yourself most of all, that what you start actually matters enough to finish.`,
      positive: `You feel most like yourself in the act of beginning, and because you let some of what you start reach real completion, your purpose compounds into something lasting instead of scattering.`,
      negative: `A soul purpose reduced to endless starting leaves nothing enough time to matter, scattering real potential across beginnings that never got to prove themselves.`,
    },

    // ── 2 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '2_E': {
      heading: `Your Soul's Purpose Is to Trust What It Already Knows`,
      why: `At your core, you feel most like yourself in moments of quiet certainty, when something in you knows before your mind has caught up. The High Priestess at the center of your matrix means your foundation of purpose is inner knowing itself — you're here to develop and trust a relationship with truth that doesn't depend on outside confirmation. Your soul's work is learning to act from that knowing rather than waiting for permission to believe it.`,
      shadow: `The trap is staying so private with your knowing that your purpose never actually meets the world — a rich inner life that never translates into anything visible, leaving you feeling quietly purposeless despite carrying real depth. If your life feels like it's missing a "why" you can point to, that's often a knowing that hasn't yet been trusted enough to guide action.`,
      path: `Let your inner knowing direct real choices, not just private reflection. Your purpose isn't to accumulate more insight — it's to actually live from the insight you already have. Trust becomes purpose the moment it starts shaping what you do.`,
      positive: `You trust your inner knowing enough to let it guide real decisions, and that trust is what turns quiet certainty into a lived, felt sense of purpose.`,
      negative: `A knowing kept entirely private, never trusted enough to guide action, leaves purpose feeling abstract and out of reach despite real inner depth.`,
    },

    // ── 3 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '3_E': {
      heading: `Your Soul's Purpose Is to Help Things Grow`,
      why: `At your core, you feel most like yourself when you're actively growing something, tending it with real care rather than rushing its unfolding. The Empress at the center of your matrix means your foundation of purpose is generativity itself — you're here to nurture something into being, whether a creative body of work, a family, a community, or your own unfolding life. This is purpose as cultivation, not achievement.`,
      shadow: `The trap is losing your own purpose inside everyone else's growth — nurturing so consistently outward that you never actually plant anything of your own. If your life feels purposeful only when you're helping someone else become something, that's generativity without a root of its own to grow from.`,
      path: `Let yourself be the thing you're nurturing sometimes. Your own growth counts as much as anyone else's. Purpose here isn't just tending others — it's staying close enough to your own becoming to actually witness it.`,
      positive: `You nurture your own growth as readily as you nurture others', and that balance is what lets your purpose feel rooted instead of only ever outward-facing.`,
      negative: `A purpose expressed only through nurturing others, never your own becoming, leaves your own growth quietly unplanted and unattended.`,
    },

    // ── 4 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '4_E': {
      heading: `Your Soul's Purpose Is to Build Something That Holds`,
      why: `At your core, you feel most like yourself when you're constructing something meant to last, not chasing whatever's exciting in the moment. The Emperor at the center of your matrix means your foundation of purpose is structure itself — you're here to build something durable, whether a family, an institution, a body of work, or your own inner architecture, that can actually hold weight over time.`,
      shadow: `The trap is confusing the structure with the purpose — building rigid systems and mistaking their maintenance for the actual point, long after the structure has stopped serving anyone, including you. If your life feels dutiful but hollow, purpose may have quietly become upkeep instead of genuine building.`,
      path: `Regularly ask what the structure is actually for, and let that answer, not the structure itself, be the thing you're loyal to. Purpose here is building something that holds people, including you — not building for its own sake.`,
      positive: `You build durable structures that genuinely serve what they were meant to hold, and staying loyal to that purpose instead of the structure itself keeps it meaningful.`,
      negative: `Loyalty to maintaining a structure instead of the purpose it was meant to serve turns real building into hollow, dutiful upkeep.`,
    },

    // ── 5 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '5_E': {
      heading: `Your Soul's Purpose Is to Carry Something Forward`,
      why: `At your core, you feel most like yourself when you're either learning something deeply or teaching it, part of a lineage that runs through you rather than starting or ending with you. The Hierophant at the center of your matrix means your foundation of purpose is transmission — you're here to receive something real (wisdom, tradition, hard-won understanding) and carry it forward to whoever needs it next.`,
      shadow: `The trap is holding the wisdom so tightly, or so reverently, that it never actually moves through you to anyone else — a purpose that becomes about possessing knowledge rather than transmitting it. If your life feels purposeful in private but empty in practice, that's a channel that's stopped flowing.`,
      path: `Let your purpose be measured by what moves through you, not what you've accumulated. Teach, share, pass it on, even before you feel fully qualified. The transmission is the point, not the mastery.`,
      positive: `You let real wisdom flow through you to others rather than just accumulating in you, and that transmission is what makes your purpose feel alive instead of merely private.`,
      negative: `Wisdom held tightly rather than transmitted leaves purpose feeling like private accumulation instead of the living channel it was meant to be.`,
    },

    // ── 6 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '6_E': {
      heading: `Your Soul's Purpose Is Choosing What's Actually Yours`,
      why: `At your core, you feel most like yourself in the moment of a clean, values-driven choice, even a hard one. The Lovers at the center of your matrix means your foundation of purpose is alignment — you're here to keep choosing, again and again, whatever actually reflects your real values over what's simply easy or expected. Your soul's work is less about a single destination than about a lifetime of aligned decisions.`,
      shadow: `The trap is treating every choice as equally weighty, exhausting yourself with deliberation until decision fatigue starts masquerading as depth. If your life feels perpetually unsettled, purpose may be getting lost in endless comparison rather than found in actual commitment.`,
      path: `Let some choices be small enough not to need this much scrutiny, and save your full discernment for the ones that matter. Purpose is built through a pattern of aligned choices, not through perfecting any single one.`,
      positive: `You make values-aligned choices and commit to them, and that consistent pattern — not any single perfect decision — is what builds a felt sense of purpose over time.`,
      negative: `Treating every choice as equally weighty exhausts real discernment into decision fatigue, leaving purpose feeling perpetually unsettled instead of built.`,
    },

    // ── 8 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '8_E': {
      heading: `Your Soul's Purpose Is to Be Someone Whose Word Holds`,
      why: `At your core, you feel most like yourself when you're being genuinely honest, even when it costs you something. Justice at the center of your matrix means your foundation of purpose is integrity itself — you're here to be someone whose actions and words actually match, consistently, in a world where that's rarer than it should be. Your soul's deepest orientation is toward truth held steady, not truth wielded as a weapon.`,
      shadow: `The trap is turning that integrity into a permanent audit of everyone else, using your own honesty as a standard to judge the world by, rather than simply living it. If your purpose feels more like policing than embodying, the fairness has drifted outward when it was meant to stay grounded in you first.`,
      path: `Let your integrity be demonstrated, not enforced. Purpose here isn't correcting the world's imbalances — it's being, consistently, a fixed point of genuine fairness that other people can orient around if they choose to.`,
      positive: `You live your integrity consistently rather than policing others with it, and that steadiness is what makes your purpose felt rather than just argued for.`,
      negative: `Integrity turned outward into constant judgment of others loses its grounding, leaving purpose feeling like enforcement instead of the lived fairness it was meant to be.`,
    },

    // ── 9 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '9_E': {
      heading: `Your Soul's Purpose Is Found in the Quiet, Not the Noise`,
      why: `At your core, you feel most like yourself in quiet, unhurried reflection, and your sense of purpose tends to clarify in exactly those moments, not in the busy pursuit of it. The Hermit at the center of your matrix means your foundation of purpose is found through withdrawal — you're here to develop a genuine relationship with your own depths, in solitude, before that depth can mean anything to anyone else.`,
      shadow: `The trap is mistaking permanent withdrawal for purpose itself — staying so deep in solitary reflection that the insight never gets tested against an actual life. If your sense of purpose feels clear in theory but absent in practice, the lantern may need to be carried back out, not just refined further alone.`,
      path: `Let your solitude be in service of an eventual return. Purpose isn't just found in the quiet — it's proven in what you do with what the quiet gave you. Go inward to find it; come back out to live it.`,
      positive: `You find real clarity in solitude and consistently bring it back into an active life, so purpose becomes something lived, not just something reflected on.`,
      negative: `Purpose sought only in permanent withdrawal, never tested against actual life, stays theoretical instead of becoming something real and lived.`,
    },

    // ── 10 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '10_E': {
      heading: `Your Soul's Purpose Lives in How You Meet the Turning`,
      why: `At your core, you feel most like yourself not despite change, but through learning to move with it. The Wheel of Fortune at the center of your matrix means your foundation of purpose isn't a fixed point — it's your relationship to change itself. You're here to develop genuine equanimity through life's cycles, finding your sense of self not in any single circumstance but in how steadily you meet whatever's currently turning.`,
      shadow: `The trap is tying your sense of purpose to the current position of the wheel — feeling purposeful only when things are going well, and purposeless the moment they turn. If your sense of meaning keeps rising and collapsing with circumstance, purpose hasn't yet found its actual, steadier center.`,
      path: `Locate your purpose in your relationship to the turning, not in the position of the wheel at any given moment. That's the deeper, more durable version of meaning available here — one that survives the downswings instead of disappearing with them.`,
      positive: `You locate purpose in your relationship to change rather than in any single circumstance, so meaning survives the downswings instead of collapsing with them.`,
      negative: `Purpose tied to the wheel's current position rises and collapses with circumstance, never settling into anything more durable than the latest turn.`,
    },

    // ── 11 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '11_E': {
      heading: `Your Soul's Purpose Is Staying Gentle Under Real Pressure`,
      why: `At your core, you feel most like yourself in the quiet moments of holding something difficult without needing to fight it or flee it. Strength at the center of your matrix means your foundation of purpose is embodied endurance — you're here to develop the capacity to stay present, gentle, and steady under real pressure, rather than dominating it or collapsing beneath it.`,
      shadow: `The trap is confusing the endurance itself with the purpose, holding weight indefinitely as a kind of identity rather than a means to something else. If your life feels like an endless test of how much you can bear, purpose has drifted into proving capacity rather than living from it.`,
      path: `Let your endurance serve something beyond itself — a relationship, a piece of work, a version of yourself you're actually building toward. Purpose here isn't holding weight forever; it's what the steadiness makes possible once it's no longer being tested.`,
      positive: `Your capacity to stay gentle under pressure serves something real beyond the endurance itself, letting purpose grow from steadiness rather than getting stuck proving it.`,
      negative: `Endurance treated as the purpose itself, rather than a means to something further, turns your life into an endless, ungrounded test of how much you can bear.`,
    },

    // ── 12 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '12_E': {
      heading: `Your Soul's Purpose Is Revealed From an Angle You Didn't Choose`,
      why: `At your core, you feel most like yourself in the moments you've stopped forcing an answer and let one arrive instead. The Hanged Man at the center of your matrix means your foundation of purpose is discovered through voluntary surrender — you're here to find meaning not by pushing forward in the expected direction, but by occasionally releasing your grip entirely and letting a different orientation show you something new.`,
      shadow: `The trap is staying suspended indefinitely, treating the not-knowing itself as the purpose rather than a passage toward one. If your life feels perpetually paused, waiting for revelation that never quite resolves into action, the suspension may have outlived its usefulness.`,
      path: `Let each period of surrender have an actual return. Purpose here is proven not in the hanging, but in what you do once you come back down changed. Receive the new angle, then act from it.`,
      positive: `You let surrender genuinely reveal a new angle, and because you return and act on it, purpose gets built from the insight instead of staying suspended in it.`,
      negative: `Staying suspended indefinitely, mistaking the not-knowing for the purpose itself, leaves meaning perpetually paused instead of ever actually arriving.`,
    },

    // ── 13 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '13_E': {
      heading: `Your Soul's Purpose Requires You to Keep Ending Old Versions of Yourself`,
      why: `At your core, you feel most like yourself not in any fixed identity, but in the act of becoming, again and again, willing to release what you were for the sake of what's next. Transformation at the center of your matrix means your foundation of purpose is genuine metamorphosis — you're here to keep letting old versions of yourself actually die so a truer one can take their place.`,
      shadow: `The trap is manufacturing endings for their own sake, mistaking constant reinvention for the deeper transformation this purpose actually asks for. If your identity keeps shifting without anything underneath it ever actually settling, the change may be circumstantial rather than genuinely transformative.`,
      path: `Let some transformations be slow and quiet rather than dramatic. Purpose here isn't measured by how often you change, but by whether each change is a genuine release of something that's actually complete.`,
      positive: `You let old versions of yourself genuinely complete before releasing them, so each transformation deepens your purpose instead of just repeating change for its own sake.`,
      negative: `Manufacturing constant reinvention without genuine completion underneath it leaves identity shifting endlessly without ever actually settling into anything real.`,
    },

    // ── 14 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '14_E': {
      heading: `Your Soul's Purpose Is Held in the Blending, Not Either Side`,
      why: `At your core, you feel most like yourself in the space between extremes, where genuine synthesis happens slowly, over time. Temperance at the center of your matrix means your foundation of purpose is integration itself — you're here to hold seemingly opposed parts of yourself or your life in patient balance, rather than resolving the tension by picking a side.`,
      shadow: `The trap is using the blending as an excuse to avoid ever fully engaging either side, staying so centered that nothing actually gets lived with any intensity. If purpose feels vague or diluted, the balance may be avoiding real contact rather than genuinely integrating it.`,
      path: `Let yourself fully inhabit each side before blending them. Real integration requires actually meeting both extremes, not just hovering equidistant from them. Purpose deepens when the synthesis is earned, not avoided into.`,
      positive: `You fully engage each side of a real polarity before blending them, and that earned synthesis is what gives your purpose depth instead of vague neutrality.`,
      negative: `Hovering equidistant between extremes to avoid real engagement leaves purpose feeling diluted, a balance that was never actually earned.`,
    },

    // ── 15 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '15_E': {
      heading: `Your Soul's Purpose Is Facing What You'd Rather Not Look At`,
      why: `At your core, you feel most like yourself not in spite of your darker material, but through actually metabolizing it instead of denying it. The Devil at the center of your matrix means your foundation of purpose runs directly through your own shadow — you're here to face what's bound, hidden, or disowned in yourself with unusual honesty, and find genuine liberation on the other side of that honesty.`,
      shadow: `The trap is getting fascinated with the darkness itself, circling your own shadow material without ever actually working it through to freedom. If your sense of purpose feels heavy and stuck rather than deepening, the looking may have become its own attachment.`,
      path: `Let every honest look at your own shadow be in service of an actual unchaining. Purpose here isn't found in staying close to the darkness — it's found in what gets freed once you've genuinely faced it.`,
      positive: `You face your own shadow material honestly and let that honesty lead to real liberation, deepening your purpose instead of getting stuck circling the darkness.`,
      negative: `Fascination with your own shadow material, without ever working it through, leaves purpose feeling heavy and stuck rather than genuinely deepening.`,
    },

    // ── 16 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '16_E': {
      heading: `Your Soul's Purpose Arrives in the Moments Everything Reorganizes`,
      why: `At your core, you feel most like yourself in the aftermath of a real reorganization, once the dust settles and you can see clearly again. The Tower at the center of your matrix means your foundation of purpose gets clarified through sudden collapse and rebuilding — you're here to periodically let a false structure in your life come down fast, and to trust that the resulting clarity, however disorienting, is actually pointing you truer.`,
      shadow: `The trap is needing the collapse itself to feel purposeful, unconsciously provoking crisis because gradual clarity feels less convincing than a dramatic one. If your life keeps reorganizing in upheaval, purpose may be getting confused with intensity.`,
      path: `Let clarity arrive gently when it can. Purpose isn't proven by how much collapsed to get you there — it's proven by how true the resulting direction actually is. Save the lightning for the structures that genuinely can't hold.`,
      positive: `You let clarity arrive as gently as the situation allows, and the truth of your direction — not the drama of getting there — is what actually confirms your purpose.`,
      negative: `Needing collapse itself to feel purposeful confuses intensity with clarity, keeping your life reorganizing in crisis when gentler insight would have worked as well.`,
    },

    // ── 17 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '17_E': {
      heading: `Your Soul's Purpose Is Generating Hope Even Without Proof It's Warranted`,
      why: `At your core, you feel most like yourself when you're actively replenishing something — a person, a project, your own depleted reserves — trusting the process before there's outside evidence it's working. The Star at the center of your matrix means your foundation of purpose is genuine, structural hope — you're here to keep generating real renewal and light, for yourself and others, even in circumstances that don't yet confirm the hope is justified.`,
      shadow: `The trap is needing external proof before you'll let yourself hope, which cuts you off from your own deepest source of purpose. It can also show up as pouring hope outward so consistently that your own reserves run dry, offering renewal to everyone except yourself. If your purpose feels like it's always about lifting others and never about being lifted, the wellspring needs its own source too.`,
      path: `Let your hope be genuinely reciprocal — replenished as much as it replenishes. Purpose here isn't an inexhaustible personal resource; it's a real exchange that has to include you receiving, not just generating.`,
      positive: `You generate real hope and let it be reciprocal, replenished as much as it replenishes, so purpose stays sustainable instead of quietly draining you.`,
      negative: `Pouring hope outward without ever letting your own reserves be replenished turns a real gift for renewal into something that quietly runs you dry.`,
    },

    // ── 18 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '18_E': {
      heading: `Your Soul's Purpose Lives Beneath What You Can Explain`,
      why: `At your core, you feel most like yourself when you're honoring what you sense rather than only what you can prove. The Moon at the center of your matrix means your foundation of purpose runs through your emotional and unconscious depths — you're here to trust the parts of yourself that can't be fully explained or justified, letting dreams, feelings, and intuition guide you as much as logic does.`,
      shadow: `The trap is getting lost in the depths without a way back to functioning, letting the felt sense of things override any grounded engagement with actual circumstances. If your purpose feels real but ungraspable, the depth may need more of a tether to ordinary life.`,
      path: `Let your intuition inform real decisions, anchored by something concrete — a practice, a body, a routine. Purpose here isn't choosing feeling over reality; it's letting feeling and reality actually talk to each other.`,
      positive: `You trust your emotional depths while staying grounded in concrete life, letting intuition and reality inform each other so purpose feels real and actionable.`,
      negative: `Getting lost in unconscious depths without any tether to ordinary life leaves purpose feeling real but ungraspable, impossible to actually act from.`,
    },

    // ── 19 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '19_E': {
      heading: `Your Soul's Purpose Is Simply to Be Genuinely, Visibly Yourself`,
      why: `At your core, you feel most like yourself in moments of genuine, unguarded joy — not chasing a bigger mission, but simply radiating who you already are. The Sun at the center of your matrix means your foundation of purpose is uncomplicated in a way that can be hard to trust: you're here to be authentically, visibly yourself, and to let the resulting warmth and vitality do their own work in the world.`,
      shadow: `The trap is believing that purpose this simple can't be enough — searching for something more complicated, more effortful, more "worthy," and dimming your natural radiance in the process. If your search for purpose feels exhausting, it may be more elaborate than what your soul is actually asking for.`,
      path: `Let simple, authentic joy count as purpose, without needing to justify it with a bigger mission. Your radiance, offered honestly, is already doing real work in the lives it touches.`,
      positive: `You let authentic joy be enough, without needing a more complicated mission to justify it, and that radiance genuinely nourishes everyone it touches.`,
      negative: `Searching for a more complicated purpose than simple authenticity dims your natural radiance and turns an uncomplicated gift into an exhausting search.`,
    },

    // ── 20 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '20_E': {
      heading: `Your Soul's Purpose Keeps Calling You Toward a Bigger Version of Yourself`,
      why: `At your core, you feel most like yourself in the moments you actually rise to meet a call you could have easily ignored. Judgement at the center of your matrix means your foundation of purpose is an ongoing awakening — you're here to keep answering an inner summons toward a fuller version of yourself, again and again, rather than settling permanently into any single identity.`,
      shadow: `The trap is hearing the call and endlessly preparing to answer it, using self-improvement as a substitute for the actual leap. If your purpose feels perpetually almost-arrived, the summons may be waiting on an answer you keep deferring.`,
      path: `Answer the call before you feel fully ready. Purpose here is proven in the rising, not the readiness. Each time you actually move toward the bigger version of yourself, the purpose becomes real instead of theoretical.`,
      positive: `You answer your inner summons when it arrives instead of endlessly preparing, and that responsiveness is what makes purpose feel real and actively lived.`,
      negative: `Endless preparation instead of answering the call leaves purpose perpetually almost-arrived, summoned but never actually met.`,
    },

    // ── 21 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '21_E': {
      heading: `Your Soul's Purpose Is to Actually Arrive Somewhere Whole`,
      why: `At your core, you feel most like yourself in moments of real, earned arrival, however temporary. The World at the center of your matrix means your foundation of purpose is genuine completion — you're here to integrate the many pieces of your life and self into an actual, felt wholeness, not to chase achievement after achievement without ever letting yourself land.`,
      shadow: `The trap is refusing to ever call anything complete, treating wholeness as a permanently receding goal because arriving would mean facing whatever comes after. If purpose feels expansive but never satisfied, completion itself may be the thing being avoided.`,
      path: `Let yourself actually arrive sometimes. Purpose here isn't only the striving — it's also the willingness to stand inside a genuine sense of "this is whole" before the next cycle inevitably begins.`,
      positive: `You let yourself genuinely arrive at wholeness sometimes, and that willingness to land is what makes purpose feel satisfied rather than perpetually just out of reach.`,
      negative: `Refusing to ever call anything complete keeps purpose expansive but never satisfied, avoiding the arrival that would mean facing what comes next.`,
    },

    // ── 22 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '22_E': {
      heading: `Your Soul's Purpose Is Renewed Every Time You Choose to Begin Again`,
      why: `At your core, you feel most like yourself standing at the edge of something new, choosing to step forward without needing a guarantee first. The Fool at the center of your matrix means your foundation of purpose isn't a fixed destination at all — it's the ongoing willingness to begin again, with real trust, regardless of what the last chapter did or didn't resolve.`,
      shadow: `The trap is treating every fresh start as an escape from whatever the last one asked of you, so nothing ever accumulates into a deeper sense of self. If your life feels like a string of unconnected beginnings, purpose may be resetting instead of actually building.`,
      path: `Let each new beginning carry something forward from the last one — a lesson, a piece of wisdom, a scar that's actually healed. Purpose here is trust that accumulates, not trust that starts from zero every time.`,
      positive: `You begin again and again with real trust, carrying forward what each chapter taught you, so purpose accumulates into genuine depth instead of resetting each time.`,
      negative: `Treating every fresh start as an escape from the last chapter's lessons leaves purpose resetting endlessly instead of ever actually accumulating.`,
    },

    // ── 5 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '5_LOVE': {
      heading: `You Fall for Substance, Not Just Chemistry`,
      why: `You're not drawn to a connection just because it feels good in the moment — you fall in love with substance. The Hierophant governs your relationship channel, which means intimacy runs on the frequency of the seeker and keeper of codes: earned structure, depth, the difference between a connection that's been tested against real standards and one that's just easy. You're drawn to partners who carry some kind of depth, tradition, or hard-won knowledge, and in return you offer something rare — genuine reverence, the willingness to actually study another person, to learn the specific architecture of how they work, and to honor what it took them to become who they are. For you, relationship is one of the primary places you expect to be taught something true about how life actually works.`,
      shadow: `The risk is love organized around an unspoken exam. You might find yourself measuring a partner against a standard of what a relationship is "supposed" to look like — inherited from family, culture, or an idealized version of commitment — while quietly holding back your full arrival until they pass. A subtler trap is treating a partner like a student rather than an equal: correcting, instructing, holding the position of the one who knows how this is done. And because you respect earned authority, you might also defer to a partner's confidence over your own read of what's actually happening between you, mistaking their certainty for correctness. If your relationships keep handing you partners who feel like they're auditioning for you, or who audition you right back, that's often a sign intimacy hasn't yet been allowed to exist without a passing grade.`,
      path: `Try letting the relationship itself become the sacred text, instead of measuring it against one you inherited somewhere else. That's the harder, more exposing shift — it means letting go of an external rulebook and trusting what's actually true between the two of you, even when it doesn't match the tradition you were handed. Practice offering your attention and reverence without requiring the relationship to earn it first. The standard that actually matters is the one you build together, not the one you bring in ahead of time. Once love stops being graded, it finally has room to teach you something no book ever could.`,
      positive: `You bring real depth, respect, and earned trust into partnership — a relationship that functions like living wisdom, each of you genuinely teaching the other rather than performing for a standard.`,
      negative: `When intimacy hasn't been allowed to exist without first passing a test, love tends to stay organized around an unspoken exam — partners keep arriving who feel like they're auditioning, or who put you through one.`,
    },

    // ── 1 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '1_LOVE': {
      heading: `You Fall for Someone Who Makes Things Happen`,
      why: `You're drawn to partners with real agency, people who turn intention into action, and in return you offer a rare gift: the ability to make a relationship feel alive, to generate momentum in a connection that might otherwise stall. The Magician governs your relationship channel, meaning intimacy runs on the frequency of origination. For you, love often starts with genuine excitement, a spark that both people can feel building something together in real time.`,
      shadow: `The risk is loving the spark more than the substance — chasing the electric feeling of a new connection's beginning and losing interest once it settles into the quieter, steadier stage that follow-through requires. You might also fall for potential rather than the actual person, drawn to what a partner could become rather than who they currently are. If your relationships keep fizzling right after the exciting start, that's the shadow of origination without staying power.`,
      path: `Try letting a relationship's quieter chapter feel as alive as its beginning. The real magic isn't only in the spark — it's in what you're both willing to keep building once the initial charge settles. Staying is its own kind of magic, one you're fully capable of.`,
      positive: `You bring real, generative energy into relationships and let that energy mature into sustained closeness, so love keeps building instead of flaming out after the exciting start.`,
      negative: `Chasing only the electric beginning of connection leaves relationships fizzling right when the quieter, more durable stage was about to begin.`,
    },

    // ── 2 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '2_LOVE': {
      heading: `You Fall for What You Sense Beneath the Surface`,
      why: `You're drawn to partners who carry real interiority, and you offer something rare in return: patient, perceptive attention that makes people feel truly seen rather than just looked at. The High Priestess governs your relationship channel, meaning intimacy for you runs on depth and quiet knowing rather than surface chemistry. Your love tends to build slowly, through accumulated trust rather than instant certainty.`,
      shadow: `The risk is staying so guarded yourself that intimacy becomes one-directional — you perceive your partner deeply while remaining genuinely unreadable to them, which can leave them feeling like they're loving a mystery instead of a person. If your relationships keep stalling at a certain depth without ever going further, that's often your own guardedness setting the ceiling.`,
      path: `Let yourself be known at the same pace you come to know someone else. Depth in a relationship has to run both directions to actually become intimacy. Your perceptiveness is a real gift — pair it with equal visibility, and closeness stops having a ceiling.`,
      positive: `You perceive your partner deeply and let yourself be equally known in return, so intimacy builds in both directions instead of stalling at a guarded depth.`,
      negative: `Perceiving a partner deeply while staying unreadable yourself keeps real intimacy one-directional, capping how close the relationship can actually get.`,
    },

    // ── 3 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '3_LOVE': {
      heading: `You Love By Making Someone Feel Completely Tended To`,
      why: `You're drawn to people you can pour into, and your gift for creating warmth and abundance in a relationship is real and rare. The Empress governs your relationship channel, meaning love for you is expressed through nurturing — genuine, generous care that makes a partner feel tended to in a way they may never have experienced before.`,
      shadow: `The risk is a relationship organized entirely around your giving, where your own needs quietly go unspoken because tending to your partner has become the whole shape of the connection. You might attract partners who are comfortable receiving endlessly without reciprocating, because the dynamic never asked them to. If you're always the one nurturing and rarely the one being nurtured, that's an imbalance worth naming out loud.`,
      path: `Let yourself be tended to as openly as you tend to others. Real intimacy requires you to actually need something and let your partner meet it — not just be the reliable source of care. Receiving isn't a departure from your gift; it completes it.`,
      positive: `You give generous, genuine care and let yourself receive it in equal measure, so the relationship runs on mutual nurturing instead of one-directional giving.`,
      negative: `A relationship organized entirely around your giving leaves your own needs unspoken, drawing partners comfortable with receiving endlessly without giving back.`,
    },

    // ── 4 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '4_LOVE': {
      heading: `You Love By Building Something Solid to Stand Inside`,
      why: `You're drawn to partners who value real solidity, and you build relationships the way you'd build anything meant to last, with real commitment to the container itself: consistency, follow-through, a partner who can trust exactly where they stand with you. The Emperor governs your relationship channel, meaning love for you is expressed through structure and reliability.`,
      shadow: `The risk is prioritizing the structure of the relationship over its actual aliveness — maintaining the form (the routines, the roles, the commitment) even after the genuine connection inside it has started to fade. You might also try to control the relationship's shape more than a partner can comfortably live inside. If your relationship feels stable but quietly stagnant, structure may have outpaced intimacy.`,
      path: `Let the container flex sometimes. Real stability doesn't require rigid form — it requires trust strong enough to survive some genuine change in how the relationship looks. Build something solid enough to bend without breaking.`,
      positive: `You build genuinely stable, reliable love, and because you let its form flex when it needs to, the relationship stays alive instead of just structurally intact.`,
      negative: `Maintaining the structure of a relationship after its aliveness has faded leaves love feeling stable on the outside and quietly stagnant underneath.`,
    },

    // ── 6 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '6_LOVE': {
      heading: `You Fall in Love With Someone's Actual Values, Not Their Surface`,
      why: `You're drawn to partners whose core principles genuinely match yours, and the relationship itself becomes an ongoing series of aligned choices rather than one initial spark. The Lovers governing your relationship channel is almost too on the nose — but what it actually means is that your love is built on genuine alignment: shared values, a real sense of choosing each other deliberately rather than falling together by convenience.`,
      shadow: `The risk is treating every disagreement as evidence of misalignment, testing a partner's values so exhaustively that the relationship starts to feel like an audit rather than a partnership. You might also idealize a partner's values early on and feel betrayed when they turn out to be an actual, imperfect person. If your relationships keep ending over values gaps that seem small in hindsight, the standard may be set too high to survive real intimacy.`,
      path: `Let alignment be a direction you're both moving in, not a static test a partner has to pass upfront. Real values-alignment is built through actually living together, choice by choice, not verified before you begin.`,
      positive: `You build love on real, lived alignment rather than an idealized test, so the relationship deepens through shared choices instead of collapsing at the first sign of difference.`,
      negative: `Auditing a partner's values against an idealized standard turns intimacy into a test, and even small gaps start to feel like betrayals of an alignment that was never realistic to begin with.`,
    },

    // ── 7 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '7_LOVE': {
      heading: `You Love Best When You're Actually Going Somewhere Together`,
      why: `You're drawn to partners who are also going somewhere, who bring their own momentum to the relationship rather than needing you to supply all of it. The Chariot governing your relationship channel means love for you thrives on shared direction. At your best, love feels like navigating life together, two people steering a shared course with mutual respect for each other's will.`,
      shadow: `The risk is turning the relationship into a solo drive with a passenger — setting the direction and expecting your partner to simply come along, rather than actually steering together. You might also struggle with a partner whose pace differs from yours, experiencing their need to pause as a threat to your forward motion. If your relationships keep feeling like you're pulling the weight alone, the reins may need to be shared more evenly.`,
      path: `Let your partner actually hold some of the reins. Real partnership means occasionally slowing to their pace, or trusting their read on the terrain even when it differs from yours. Shared direction requires two hands on the wheel, not one driver and one passenger.`,
      positive: `You build a relationship with real shared momentum, actively sharing the reins so both people are steering, not just one person driving and one along for the ride.`,
      negative: `Driving the relationship's direction alone and expecting a partner to simply follow turns partnership into a lonely solo journey with company in the passenger seat.`,
    },

    // ── 8 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '8_LOVE': {
      heading: `You Love Someone Who Actually Keeps Their Word`,
      why: `You're drawn to partners who follow through on what they say, who hold themselves accountable the way you hold yourself, and you offer a relationship built on genuine reciprocity rather than unspoken imbalance. Justice governing your relationship channel means intimacy for you runs on fairness. Trust, for you, is built transaction by transaction, promise by kept promise.`,
      shadow: `The risk is keeping an internal ledger of who's done more, who owes what, turning intimacy into an accounting exercise rather than a felt connection. You might also struggle to forgive a partner's genuine mistake, holding them to a standard of consistency no real relationship can maintain perfectly. If your relationships keep feeling like negotiations, the fairness may have crowded out the warmth.`,
      path: `Let some imbalance be human rather than a violation. Real fairness in love isn't a perfectly even ledger — it's mutual good faith over time. Let go of tracking every exchange and trust the overall pattern instead.`,
      positive: `You build relationships on genuine mutual accountability without keeping a rigid ledger, so fairness supports warmth instead of replacing it.`,
      negative: `Tracking every exchange for balance turns intimacy into an ongoing negotiation, and even genuine mistakes get held to a standard no relationship can perfectly maintain.`,
    },

    // ── 9 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '9_LOVE': {
      heading: `You Love Someone Who Doesn't Need You to Fill Every Silence`,
      why: `You're drawn to partners who have their own rich inner life and don't need constant togetherness to feel connected. The Hermit governing your relationship channel means intimacy for you includes real respect for solitude. Your love is patient and deep rather than constant and loud, built in the quiet moments as much as the shared ones.`,
      shadow: `The risk is using your need for space as a way to avoid real vulnerability, retreating into solitude precisely when a relationship asks for more closeness than feels comfortable. A partner can end up feeling shut out rather than respected. If you notice your partner repeatedly asking for more presence than you're offering, the withdrawal may be protecting you from intimacy rather than honoring a genuine need.`,
      path: `Let your partner know when solitude is genuine need versus avoidance, and practice staying present even when closeness feels exposing. Real intimacy includes some discomfort — the solitude that protects you can't be the whole relationship.`,
      positive: `You honor genuine need for solitude while staying present when real closeness is being asked for, so a partner feels respected rather than shut out.`,
      negative: `Using solitude to avoid vulnerability rather than to genuinely recharge leaves a partner feeling shut out precisely when the relationship needed more presence.`,
    },

    // ── 10 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '10_LOVE': {
      heading: `Your Love Life Moves in Seasons, Not a Straight Line`,
      why: `Your love life genuinely moves in cycles — periods of real connection followed by periods of solitude or change, relationships that seem to arrive right when you're ready for them. The Wheel of Fortune governing your relationship channel names exactly this pattern. You have a real gift for meeting a relationship's current season honestly, rather than forcing permanence on something that's naturally shifting.`,
      shadow: `The risk is treating a relationship's downswing as proof it's over, bailing at the first sign of a natural low rather than riding the cycle through to see what's on the other side. You might also chase the excitement of new connections whenever an existing one settles into a quieter phase. If your relationships keep ending right as they'd naturally deepen, the fear of the turn may be causing it.`,
      path: `Let a relationship's low season be a season, not a verdict. Real partnership survives more than one turn of the wheel. Stay through at least one full cycle before deciding what a relationship actually is.`,
      positive: `You meet a relationship's natural seasons with trust rather than panic, letting connections survive their low points and deepen through more than one cycle.`,
      negative: `Treating a relationship's downswing as a verdict rather than a season causes real connections to end right before they would have deepened.`,
    },

    // ── 11 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '11_LOVE': {
      heading: `You Love By Being the Steadiest Person in the Room`,
      why: `You're the partner who can hold a hard conversation, a difficult season, or a partner's raw emotion without flinching or needing to fix it immediately. Strength governing your relationship channel means love for you is expressed through embodied calm. Partners often feel safest with you specifically because your steadiness doesn't waver under real pressure.`,
      shadow: `The risk is holding all the relationship's difficulty yourself, becoming the strong one so consistently that your partner never learns to hold weight for you in return. You might also suppress your own hard feelings to maintain the calm, leaving your own needs quietly invisible inside the relationship. If you're always the one being steady, that steadiness may be costing you real reciprocity.`,
      path: `Let your own difficulty be visible sometimes, on purpose. Real intimacy needs both people to be held, not just one person holding. Your calm is a gift — it becomes a trap if it never includes your own turn to lean.`,
      positive: `You hold real difficulty with genuine calm and also let yourself be held in return, so the relationship carries weight both ways instead of only through you.`,
      negative: `Holding all the relationship's hard moments yourself, without ever showing your own, leaves your needs invisible and the reciprocity one-directional.`,
    },

    // ── 12 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '12_LOVE': {
      heading: `Your Best Relationships Start After You Stop Forcing Them`,
      why: `Real connection tends to show up once you've released your grip on how or when it's supposed to happen. The Hanged Man governing your relationship channel means intimacy for you often arrives through surrender rather than pursuit. You have a genuine gift for seeing a relationship from an angle a partner hadn't considered, patient enough to let understanding unfold rather than forcing resolution.`,
      shadow: `The risk is passivity dressed as patience — waiting indefinitely for a relationship to clarify itself rather than ever actually engaging directly, leaving a partner uncertain where they stand. If your relationships stay suspended in ambiguity for a long time, the patience may have become avoidance of a real decision.`,
      path: `Let your patience have a deadline. Real surrender in love means releasing control over outcome, not avoiding the actual choice in front of you. At some point, come down from the suspension and commit to what the waiting revealed.`,
      positive: `You let real connection unfold at its own pace without forcing it, and because you eventually commit to what that patience reveals, relationships move from ambiguity into real partnership.`,
      negative: `Patience that never resolves into an actual decision leaves relationships suspended in ambiguity, a partner uncertain where they genuinely stand.`,
    },

    // ── 13 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '13_LOVE': {
      heading: `Your Relationships Change You, and You Know It Going In`,
      why: `Real relationships change who you are, and you're drawn to partners capable of that same depth of transformation rather than people who'll keep you exactly as you were. Transformation governing your relationship channel means love for you is genuinely metamorphic. You bring real intensity and a willingness to actually grow because of a connection, not just alongside it.`,
      shadow: `The risk is needing every relationship to be transformative to feel real, which can make ordinary, steady affection feel unsatisfying by comparison, or push you to manufacture intensity where genuine ease would actually serve you better. If your relationships keep running hot and dramatic, the transformation may be getting confused with turbulence.`,
      path: `Let some relationship growth happen quietly. Real transformation doesn't require constant intensity — some of your deepest changes will come through steady, undramatic companionship. Depth doesn't need to be loud to be real.`,
      positive: `You let real transformation happen through both intense and quiet connection, so love changes you without needing constant drama to feel genuine.`,
      negative: `Needing every relationship to feel dramatically transformative confuses intensity with depth, making steady, genuine affection feel unsatisfying by comparison.`,
    },

    // ── 14 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '14_LOVE': {
      heading: `You Love By Patiently Blending Two Whole Lives Into One`,
      why: `You're genuinely skilled at blending two different lives, temperaments, or even value systems into something that works for both people, without either partner losing themselves in the process. Temperance governing your relationship channel means love for you is expressed through patient integration. Your relationships tend to feel balanced, considerate, genuinely fair to both sides.`,
      shadow: `The risk is over-moderating the relationship to avoid real friction, smoothing over genuine differences so consistently that neither partner's true needs actually get met directly. Real intimacy sometimes needs tension before it needs balance. If your relationship feels calm but strangely unsatisfying, the blending may be avoiding real contact rather than achieving it.`,
      path: `Let real differences surface and stay long enough to be genuinely worked through, rather than smoothed over immediately. Balance built after real friction is sturdier than balance that avoided it.`,
      positive: `You blend two lives with genuine patience while still letting real differences surface and get worked through, so the resulting balance is sturdy rather than just smooth.`,
      negative: `Smoothing over every difference to keep the peace leaves a relationship calm on the surface but unsatisfying underneath, avoiding the friction real intimacy sometimes needs.`,
    },

    // ── 15 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '15_LOVE': {
      heading: `Your Chemistry With the Right Person Is Undeniable`,
      why: `Your romantic connections run on real, undeniable magnetism — physical chemistry, material compatibility, an intensity that's honest about desire rather than polite about it. The Devil governing your relationship channel names exactly this. You're drawn to partners who match that intensity, and you offer a rare willingness to actually engage with the less "acceptable" parts of intimacy: desire, power, need.`,
      shadow: `The risk is mistaking intensity for genuine compatibility, staying bound to a chemistry-heavy relationship that doesn't actually serve you outside the bedroom. You might also use material or physical control as a substitute for emotional vulnerability. If your relationships feel magnetic but ultimately unfree, the chain may be tighter than the connection requires.`,
      path: `Let the chemistry be honest evidence, not the whole verdict. Ask what the relationship offers outside its intensity. Real freedom here means enjoying the magnetism without needing it to be the only thing holding you there.`,
      positive: `You engage fully and honestly with real chemistry while making sure the relationship holds up outside its intensity too, so connection feels like abundance rather than compulsion.`,
      negative: `Mistaking intensity alone for compatibility keeps you bound to a magnetic connection that doesn't actually serve you once the chemistry is set aside.`,
    },

    // ── 16 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '16_LOVE': {
      heading: `You Know the Truth About a Relationship Faster Than You Want To`,
      why: `You sense when something's fundamentally not working well before it would be convenient to admit it, and you're capable of ending things decisively once that clarity fully lands. The Tower governing your relationship channel gives you real, often unwelcome clarity about your relationships. This honesty, while disruptive, spares you years spent inside a slowly failing connection.`,
      shadow: `The risk is provoking a relationship's collapse prematurely, out of impatience with the discomfort of uncertainty rather than genuine evidence the connection can't hold. You might also carry a reputation for sudden, dramatic breakups that could have been gentler conversations instead. If your relationships keep ending in upheaval, some of that ending may not have needed to be so abrupt.`,
      path: `Let your clarity inform a deliberate conversation before it becomes a sudden exit. Not every relationship in trouble needs demolition — some genuinely can be rebuilt if you bring the truth to the table instead of just acting on it alone.`,
      positive: `You see relationship truths clearly and bring them into honest conversation, so necessary endings or real repairs happen deliberately instead of through sudden upheaval.`,
      negative: `Acting on relationship clarity alone, without bringing it into conversation first, turns endings into sudden upheaval that a direct conversation might have avoided or softened.`,
    },

    // ── 17 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '17_LOVE': {
      heading: `You Fall in Love With People You Can Genuinely Hope For`,
      why: `You're drawn to partners you can believe in, and you offer a rare, real gift in return: unwavering faith in who they're capable of becoming, offered without needing proof upfront. The Star governing your relationship channel means love for you is deeply tied to genuine hope. Your relationships often function as a source of renewal for both people, a place where discouragement gets met with real, structural hope rather than empty reassurance.`,
      shadow: `The risk is loving someone's potential more than who they actually, currently are — staying in relationships that keep disappointing the present moment because your hope is pointed at who they could be instead of who they're actually showing up as. If your relationships keep feeling like an act of faith rather than a present-tense connection, the hope may be substituting for honest assessment.`,
      path: `Try letting your hope meet a partner exactly where they currently are, not just where you believe they're headed. Real love here offers renewal to what's actually present, not just to potential.`,
      positive: `You offer genuine hope and renewal to who a partner actually is right now, not just their potential, so your relationships feel met rather than perpetually aspirational.`,
      negative: `Loving a partner's potential more than their present reality keeps relationships feeling like an act of faith, perpetually disappointed by who they actually, currently are.`,
    },

    // ── 18 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '18_LOVE': {
      heading: `You Fall in Love With a Feeling You Can't Fully Explain`,
      why: `You sense a connection's truth before you can articulate it, drawn to partners who can meet you in a felt, sometimes wordless understanding. The Moon governing your relationship channel means intimacy for you runs on emotional and intuitive depth. Your relationships carry real emotional richness, a shared inner world that doesn't always need explaining.`,
      shadow: `The risk is letting unprocessed fear or anxiety color how you read a partner, projecting old wounds onto present behavior and reacting to a story rather than what's actually happening. Jealousy or suspicion can arise from an internal weather system rather than any real evidence. If you keep misreading a partner's intentions, the fog may need more grounding, not more feeling.`,
      path: `Check your emotional read against something concrete — an actual conversation, not just the felt sense. Your intuition about a relationship is genuinely valuable; it just needs occasional reality-testing so it doesn't drift into anxious projection.`,
      positive: `You trust your emotional depth about a relationship while checking it against real conversation, so intuition strengthens the connection instead of drifting into anxious projection.`,
      negative: `Reading a partner through unprocessed fear rather than actual evidence turns intuition into suspicion, misreading intentions that were never really there.`,
    },

    // ── 19 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '19_LOVE': {
      heading: `Your Best Relationships Feel Like Relief`,
      why: `You're drawn to partners who can be fully themselves around you, and you offer the same unguarded warmth in return. The Sun governing your relationship channel means love for you is meant to feel genuinely light — real, sustainable relationships for you run on authentic joy and ease rather than struggle or proving yourself.`,
      shadow: `The risk is avoiding relationships, or specific hard conversations within one, the moment they stop feeling easy — mistaking necessary friction for incompatibility because your radar is tuned to joy above all else. If you keep leaving relationships the moment things get genuinely difficult, the ease may be masking an avoidance of real depth.`,
      path: `Let a relationship include hard, unglamorous moments without deciding those moments mean it's wrong. Real joy in love can coexist with real effort — the two aren't actually opposites.`,
      positive: `You bring real, authentic joy into relationships and can also stay through the harder moments, so ease and depth grow together instead of ease being the only thing you'll tolerate.`,
      negative: `Leaving a relationship the moment it stops feeling easy avoids the real friction genuine depth sometimes requires, mistaking difficulty for incompatibility.`,
    },

    // ── 20 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '20_LOVE': {
      heading: `Your Relationships Keep Calling You Toward Who You're Becoming`,
      why: `You're drawn to people who see a fuller version of you than you've fully claimed yet, and you offer that same recognition in return. Judgement governing your relationship channel means your romantic connections tend to function as genuine catalysts — partners who call something larger out of you, relationships that coincide with real periods of personal awakening.`,
      shadow: `The risk is staying in a relationship past its natural end because it once served as a catalyst, holding onto the growth it represented rather than the actual connection as it currently is. You might also expect every partner to keep triggering growth, exhausting a relationship that's simply allowed to be steady for a while. If a relationship feels stagnant, the calling may have already moved on.`,
      path: `Let a relationship be honored for the growth it already gave you, even if it's time to let it go. Not every phase of love needs to keep summoning you forward — some of it is allowed to just be restful.`,
      positive: `You honor what a relationship's growth already gave you and let it evolve or end honestly, rather than clinging to a catalyst that's already done its work.`,
      negative: `Holding onto a relationship for the growth it once represented, past its natural end, keeps you tied to a calling that's actually already moved on.`,
    },

    // ── 21 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '21_LOVE': {
      heading: `You're Looking for a Partnership That Actually Feels Complete`,
      why: `You have a real capacity for mature, mutual love, built over time into something that actually feels whole. The World governing your relationship channel means you're oriented toward genuine relational wholeness — partnerships that feel complete in themselves, where both people bring their full, integrated selves rather than looking to the other to complete what's missing.`,
      shadow: `The risk is holding relationships to a standard of completeness so high that ordinary, still-developing love never measures up, leaving you perpetually searching for a wholeness that any real relationship takes time to build. If your relationships keep ending because they don't feel "complete" yet, the standard may be arriving before its time.`,
      path: `Let a relationship be genuinely good while still becoming whole. Completeness here is a direction, built together over time, not a bar a partner has to clear before you'll commit.`,
      positive: `You let a relationship develop toward genuine wholeness over time rather than demanding it upfront, so real partnerships get the chance to actually become complete.`,
      negative: `Demanding relational wholeness before a partnership has had time to develop it leaves you perpetually searching, ending connections that just needed more time.`,
    },

    // ── 22 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '22_LOVE': {
      heading: `You Fall in Love Without Needing Proof It'll Work Out`,
      why: `You carry a genuine, uncommon openness to love — a willingness to step into a real connection without needing certainty about where it'll lead. The Fool governing your relationship channel names exactly this. You offer partners real freshness: presence without an agenda, trust extended before it's been fully earned, which lets intimacy begin faster and more genuinely than caution usually allows.`,
      shadow: `The risk is repeating the same relational pattern with new people, leaping into connection with the same openness each time but no accumulated wisdom about what's actually worked or not. If your relationships keep starting fresh and ending the same way, the openness may need a partner in genuine reflection.`,
      path: `Let each relationship teach you something concrete you actually carry into the next one. Your openness to love is a real gift — pairing it with real self-knowledge is what turns repeated beginnings into an actual, growing capacity for lasting love.`,
      positive: `You fall in love with real trust and openness, and because you let each relationship teach you something durable, your capacity for lasting love keeps deepening instead of resetting.`,
      negative: `Leaping into new relationships with the same openness but no accumulated self-knowledge keeps the same pattern repeating with different people.`,
    },

    // ── 17 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '17_MON': {
      heading: `Your Money Follows Your Willingness to Be Seen`,
      why: `Your most abundant income tends to show up exactly when you're operating from genuine visibility — sharing your real gift, letting your actual light be seen in your work — rather than following a strategy borrowed from someone else's idea of a stable career. The Star governs your money channel, tying your financial flow directly to hope and authentic radiance rather than to grinding, joyless effort. This is one of the more luminous financial placements in the matrix: money that arrives almost as a byproduct of authenticity, once you actually offer the authenticity instead of rehearsing it in private.`,
      shadow: `The risk is income that stays conditional on approval before it's allowed to flow — a launch you keep delaying until every condition feels perfect, a rate you quietly undercut because charging full price for something so personal feels like too much, a body of work you keep private until it's "ready" in a way that never quite arrives. Because your gift is genuine, withholding it is expensive: a thin, sporadic bank account is often a light that's still being kept low rather than freely offered to a market that would gladly pay for it.`,
      path: `Try treating visibility itself as the transaction — letting your work be seen at the stage it's actually in, rather than the stage you wish it had reached. That's uncomfortable, because it removes the comfort of staying private while you perfect things, and it puts the responsibility on what you're willing to show right now. Start with the smallest real offer: a rate that reflects the actual value of your work, a piece released before it feels fully polished. The financial flow you're waiting to feel ready for is, for you, directly downstream of the visibility you're willing to allow today.`,
      positive: `Money arrives in rhythm with genuine visibility — the more authentically you let your work be seen at the stage it's actually in, the more consistently and generously it gets paid for.`,
      negative: `Income stays sporadic and undervalued when your light is still being kept low — a launch delayed, a rate undercut, a body of work withheld until conditions that never quite arrive.`,
    },

    // ── 1 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '1_MON': {
      heading: `Your Ideal Work Lets You Build Something From Scratch`,
      why: `You're not suited to a fixed, pre-built role; your income flows most freely when your profession gives you real room to generate something new rather than maintain something already built. The Magician governs your money channel, meaning your wealth potential is tied directly to work that lets you originate — building something from nothing, launching, creating, initiating.`,
      shadow: `The risk is chasing the excitement of a new venture at the expense of ever letting one mature into steady income — jumping between projects, ideas, or roles before any of them has had time to actually pay off. If your income feels inconsistent despite real talent, the pattern may be starting more than sustaining.`,
      path: `Let your ideal work include at least one long-running thread you don't abandon. The initiating gift is real; pairing it with follow-through is what turns a string of launches into an actual, sustainable livelihood.`,
      positive: `You thrive in self-directed, generative work, and because you sustain at least one long-running thread, your income compounds instead of resetting with every new launch.`,
      negative: `Chasing new ventures before any one matures leaves income inconsistent, real talent scattered across starts that never got the chance to actually pay off.`,
    },

    // ── 2 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '2_MON': {
      heading: `Your Ideal Work Trusts What You Sense Before You Can Prove It`,
      why: `You're suited to roles that trust your read on a situation, even before it's fully explainable. The High Priestess governs your money channel, meaning your ideal profession draws on intuitive, often behind-the-scenes insight — work where your instinct for what's true or what's coming matters more than loud, visible credentials.`,
      shadow: `The risk is undervaluing that intuitive skill precisely because it's hard to quantify, staying in the background so consistently that your actual contribution goes unrecognized and underpaid. If your income doesn't reflect your real insight, the quietness of your gift may be costing you its market value.`,
      path: `Let your intuitive contribution be named and priced, even if it's hard to fully explain in a resume. Your insight is a real professional asset — it just needs to be claimed out loud to actually be compensated.`,
      positive: `You claim and price your intuitive insight as a real professional asset, so your income finally reflects the genuine value of what you sense and know.`,
      negative: `Staying quietly behind the scenes with real insight that's never claimed or priced leaves your income undervalued relative to what you actually contribute.`,
    },

    // ── 3 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '3_MON': {
      heading: `Your Ideal Work Lets You Grow Something Real`,
      why: `Your income thrives when your profession lets you actually create — creative fields, caregiving, cultivation of any kind, roles where you get to grow something (a project, a person, a body of work) rather than simply manage an existing system. The Empress governs your money channel, meaning your wealth potential flows through generative, nurturing work.`,
      shadow: `The risk is undercharging for generative work because it doesn't feel like conventional "labor," or giving so much creative energy away for free that your professional output never converts into real income. If you're prolific but underpaid, the generosity of your gift may need a price tag.`,
      path: `Let your creative or nurturing output be priced at its real value, not discounted because it comes easily to you. Ease of creation doesn't mean it's worth less — it means you're well-suited to it.`,
      positive: `You price your generative, creative work at its real value, so professional output that comes naturally to you also translates into real income.`,
      negative: `Undercharging for generative work because it feels natural rather than laborious leaves real creative output chronically underpaid.`,
    },

    // ── 4 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '4_MON': {
      heading: `Your Ideal Work Lets You Build the System, Not Just Work Inside One`,
      why: `You thrive financially when you're given real authority to organize — leadership, management, systems-building, work where your capacity for order and responsibility is actually put to use rather than boxed in by someone else's framework. The Emperor governs your money channel, meaning your wealth potential flows through roles that let you build or govern structure.`,
      shadow: `The risk is staying in a role that under-uses your capacity for structure, following someone else's system so completely that your own gift for building never gets exercised, or applied for financial value. If you feel financially capped despite real capability, the structure you're operating inside may not be yours to shape.`,
      path: `Seek or create roles where you actually get to build the system, not just staff it. Your financial ceiling tends to lift the moment your capacity for structure has somewhere real to go.`,
      positive: `You work in roles where you actually get to build and govern structure, and that real authority is what lifts your financial ceiling instead of capping it.`,
      negative: `Operating entirely inside someone else's system, with no room to actually build one, keeps real structural capability financially capped and unused.`,
    },

    // ── 5 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '5_MON': {
      heading: `Your Ideal Work Passes Something On`,
      why: `Your income thrives when your profession includes passing something on — teaching, mentoring, or tradition-rooted work, professions where you're transmitting real, earned knowledge to someone else, whether formally (education, training) or informally (mentorship within any field). The Hierophant governs your money channel, meaning your wealth potential flows through exactly this kind of work.`,
      shadow: `The risk is staying a perpetual student, accumulating credentials and knowledge without ever stepping into the teaching role that would actually convert it into income. If your expertise feels real but your income doesn't reflect it, the transmission side of the equation may be missing.`,
      path: `Let yourself teach before you feel fully ready. The financial version of your gift activates once knowledge starts moving through you to someone else, not just accumulating in you.`,
      positive: `You actively teach or mentor from what you know, and that transmission is what converts real expertise into real income instead of just private accumulation.`,
      negative: `Staying a perpetual student without ever stepping into teaching or mentoring leaves genuine expertise financially undervalued, all accumulation and no transmission.`,
    },

    // ── 6 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '6_MON': {
      heading: `Your Ideal Work Has to Actually Reflect What You Believe`,
      why: `You simply cannot generate sustainable income from work that conflicts with what you actually believe, no matter how lucrative it looks on paper. The Lovers governing your money channel means your wealth potential is directly tied to values-alignment in your profession. Money flows most easily through career choices made from genuine conviction rather than convenience.`,
      shadow: `The risk is perpetual career indecision, weighing every professional option against your values so exhaustively that you never commit long enough to actually build income in any direction. If your career feels stalled at the crossroads, discernment may need to resolve into an actual choice.`,
      path: `Choose a values-aligned direction and commit to it fully, even without perfect certainty. Income builds through sustained commitment to an aligned path, not through endlessly comparing options.`,
      positive: `You commit fully to values-aligned work, and that sustained commitment is what lets real income actually build instead of stalling at endless comparison.`,
      negative: `Weighing every career option against your values without ever committing keeps professional income stalled at a crossroads that never resolves.`,
    },

    // ── 7 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '7_MON': {
      heading: `Your Ideal Work Lets You Actually Drive Toward Something`,
      why: `Your income thrives when your career has genuine forward motion you control — a profession where you're visibly moving toward a goal you've set, not just executing someone else's static task list. The Chariot governs your money channel, meaning your wealth potential flows through work with exactly this real, self-directed momentum.`,
      shadow: `The risk is staying in a role with no real trajectory, generating internal frustration that shows up as burnout even when the workload itself is manageable — the problem isn't the effort, it's the absence of visible direction. If your income feels stuck despite real effort, the role may lack the momentum this profile actually needs to thrive.`,
      path: `Seek or build a professional path with a visible trajectory you're steering. Your financial growth tracks your sense of forward motion more than it tracks raw hours worked.`,
      positive: `You work in roles with real, self-directed momentum toward a goal, and that visible trajectory is what drives your income forward, not just raw effort.`,
      negative: `Working in a role with no real trajectory generates burnout and stalled income regardless of effort, missing the forward motion this profile actually needs.`,
    },

    // ── 8 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '8_MON': {
      heading: `Your Ideal Work Rewards You for Being the Honest One`,
      why: `Your income thrives in roles where integrity is actually rewarded, not just expected — law, mediation, ethics-driven business, any profession where your reputation for honest dealing is itself a professional asset. Justice governs your money channel, meaning your wealth potential flows through work grounded in fairness and accountability.`,
      shadow: `The risk is staying in environments where your honesty goes financially unrewarded, or even punished, while less scrupulous colleagues advance faster. If integrity keeps costing you opportunities, the environment may not be matched to the gift.`,
      path: `Seek out or build professional environments that actually reward fairness, rather than staying somewhere your integrity is merely tolerated. Your financial growth depends on being somewhere honest dealing is genuinely valued.`,
      positive: `You work in environments that genuinely reward integrity, so your honest dealing becomes a real professional asset instead of a quiet disadvantage.`,
      negative: `Staying in environments where integrity goes unrewarded or costs you advancement keeps real fairness from ever translating into financial recognition.`,
    },

    // ── 9 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '9_MON': {
      heading: `Your Ideal Work Rewards Deep, Solitary Mastery`,
      why: `Your income thrives in roles that let you work with real autonomy, converting solitary mastery into a valuable, sought-after skill — work that rewards how deep you've gone in one specific area rather than how broadly you network or collaborate. The Hermit governs your money channel, meaning your wealth potential flows through exactly this kind of specialized, independent expertise.`,
      shadow: `The risk is staying so independent that your expertise never gets marketed or made visible enough for anyone to actually pay for it. Deep knowledge, kept private, doesn't automatically convert into income — it has to be offered. If your income doesn't reflect your actual depth, visibility may be the missing piece.`,
      path: `Let your specialized expertise be visibly offered — published, priced, put forward — rather than just quietly possessed. The depth is already valuable; it needs a way to actually reach the people who'd pay for it.`,
      positive: `You offer your deep, specialized expertise visibly, converting real solitary mastery into income instead of letting it stay privately impressive.`,
      negative: `Expertise kept too private to be marketed or offered never converts into income, no matter how genuinely deep the underlying mastery is.`,
    },

    // ── 10 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '10_MON': {
      heading: `Your Ideal Work Moves With the Seasons Instead of Fighting Them`,
      why: `You thrive financially when your career has room to change shape as circumstances turn, rather than punishing you for needing to pivot — work that can adapt to cycles and shifting conditions rather than professions demanding rigid permanence. The Wheel of Fortune governs your money channel, meaning your wealth potential flows through exactly this kind of career flexibility.`,
      shadow: `The risk is staying locked into a rigid career path out of fear of the instability that change might bring, even once that path has clearly stopped serving you. If your income feels stagnant despite the world around you clearly shifting, the rigidity of the role may be the actual constraint.`,
      path: `Build genuine flexibility into your career — multiple skills, adaptable income streams, willingness to pivot with the cycle rather than against it. Your financial resilience comes from adaptability, not from forcing permanence onto something naturally cyclical.`,
      positive: `You build real flexibility into your career, adapting with the cycle instead of fighting it, so your income stays resilient through natural shifts.`,
      negative: `Staying locked into a rigid career path out of fear of change leaves income stagnant exactly when the world around it is clearly shifting.`,
    },

    // ── 11 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '11_MON': {
      heading: `Your Ideal Work Rewards You for Not Cracking Under Pressure`,
      why: `Your income thrives where your composure is actually the asset being paid for — professions where staying calm and capable under real pressure is itself the valuable skill, whether that's crisis work, high-stakes coordination, or any role others burn out of faster than you do. Strength governs your money channel, meaning your wealth potential flows through work that draws on exactly this steady endurance.`,
      shadow: `The risk is absorbing more pressure than any role should reasonably require, becoming so associated with handling difficulty that your workload keeps expanding without matching compensation. If you're always the one holding it together, that steadiness deserves to be priced accordingly.`,
      path: `Let your capacity for pressure be explicitly compensated, not just assumed. Name the value of what you're actually absorbing, and make sure your income reflects it.`,
      positive: `Your steady endurance under real pressure is explicitly recognized and compensated, so the value of what you're holding actually shows up in your income.`,
      negative: `Absorbing ever-expanding pressure without matching compensation leaves your real, valuable steadiness quietly uncompensated.`,
    },

    // ── 12 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '12_MON': {
      heading: `Your Ideal Work Isn't on the Career Path You Were Told to Follow`,
      why: `Your income thrives when you trust an unconventional path rather than forcing yourself into a conventional one that doesn't actually fit — work you found by stepping back from the expected route and seeing your options from an angle other people hadn't considered. The Hanged Man governs your money channel, meaning your wealth potential flows through exactly this kind of professional path.`,
      shadow: `The risk is staying suspended in the "different perspective" indefinitely without ever committing to the unconventional path it's pointing toward, treating the alternative view as an idea rather than an actual career move. If your income feels stuck in potential, the perspective needs to become a decision.`,
      path: `Let the unconventional insight resolve into an actual professional move, even a small one. The different angle only pays off once you build something from it.`,
      positive: `You commit to the unconventional path your different perspective revealed, and that willingness to act is what finally converts insight into real income.`,
      negative: `Staying suspended in an unconventional perspective without ever committing to it keeps real income potential stuck in idea rather than reality.`,
    },

    // ── 13 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '13_MON': {
      heading: `Your Ideal Work Requires You to Actually Let the Old Career Die`,
      why: `You thrive financially in fields or roles that reward genuine change rather than punishing it — real financial growth for you tends to require releasing an outdated career identity or income source so a better-fitting one can take its place. Transformation governs your money channel, meaning your wealth potential flows through exactly this kind of professional reinvention.`,
      shadow: `The risk is clinging to a professional identity that's already run its course, staying in a dying career lane out of fear of the uncertain gap between old and new. If your income feels stuck in decline, something professional may need to be actively released rather than further optimized.`,
      path: `Let a professional ending be deliberate. Identify what's actually complete in your career, and release it on your own terms before it forces the issue. The reinvention happens in the gap you're willing to walk through.`,
      positive: `You let outdated career identities end deliberately, and that willingness to release what's complete is what makes room for the reinvention that actually grows your income.`,
      negative: `Clinging to a career identity that's already run its course, out of fear of the gap, keeps income stuck in a decline a clean ending could have resolved.`,
    },

    // ── 14 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '14_MON': {
      heading: `Your Ideal Work Blends What Other People Keep Separate`,
      why: `Your income thrives when you're not forced to specialize narrowly, but allowed to synthesize — combining skills, fields, or roles that other people keep siloed, into one integrated career that plays to your full range. Temperance governs your money channel, meaning your wealth potential flows through exactly this kind of professional blending.`,
      shadow: `The risk is spreading across so many skills or roles that none of them develops enough depth to actually be paid for at a professional level. Balance can become an excuse to avoid committing seriously to any one thing. If your income feels thin, the blend may need fewer ingredients, held longer.`,
      path: `Let a few of your combined skills go deep enough to actually be marketable, rather than staying broadly competent at everything. Real integration still requires depth in its component parts.`,
      positive: `You blend a few well-developed skills into an integrated career, and that combination of real depth and range is what makes your income substantial.`,
      negative: `Spreading across too many skills without developing real depth in any of them keeps professional income thin despite genuine versatility.`,
    },

    // ── 15 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '15_MON': {
      heading: `Your Ideal Work Understands Power and Money Honestly`,
      why: `You thrive financially in roles that don't pretend money and leverage aren't real forces — negotiation, finance, sales, any field where understanding what actually drives people materially is the genuine skill being paid for. The Devil governs your money channel, meaning your wealth potential flows through work that engages directly with material power.`,
      shadow: `The risk is using that understanding to grip control over colleagues, clients, or resources rather than to genuinely serve a transaction, eventually costing you trust and reputation. If wealth keeps arriving alongside growing isolation, the leverage may be gripped tighter than the work requires.`,
      path: `Use your honest read on material power in service of genuinely good deals, not just personal control. Real mastery here builds wealth and keeps trust intact at the same time.`,
      positive: `You use your honest understanding of material power to build genuinely good deals, generating real wealth without eroding the trust that sustains it.`,
      negative: `Using material insight to grip control rather than serve a transaction generates wealth alongside growing isolation and eroded trust.`,
    },

    // ── 16 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '16_MON': {
      heading: `Your Ideal Work Rewards You for Seeing the Collapse Coming`,
      why: `You thrive financially in roles that value sudden, decisive clarity over slow, incremental process — crisis management, innovation, any field that pays for the ability to see a failing structure clearly and reorganize fast. The Tower governs your money channel, meaning your wealth potential flows through exactly this kind of disruption-facing work.`,
      shadow: `The risk is generating unnecessary disruption to feel financially useful, provoking crises in stable systems because your gift needs somewhere to apply itself. If your professional life feels chaotic even in calm periods, the disruption may be self-generated rather than genuinely needed.`,
      path: `Save your gift for structures that actually need reorganizing, rather than manufacturing instability elsewhere. Real financial value here comes from precision, not from constant upheaval.`,
      positive: `You apply your gift for clarity and reorganization precisely where it's genuinely needed, and that precision is what makes the disruption-focused work actually valuable.`,
      negative: `Generating unnecessary crisis to feel useful turns a real gift for reorganization into chaos that doesn't actually need to exist.`,
    },

    // ── 18 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '18_MON': {
      heading: `Your Ideal Work Trusts the Sense You Can't Fully Explain Yet`,
      why: `You thrive financially in roles that don't demand you justify every insight with hard data before it's trusted — work that draws on intuitive or emotionally attuned insight, creative fields, therapeutic work, anything where reading an unspoken undercurrent is the actual skill. The Moon governs your money channel, meaning your wealth potential flows through exactly this kind of work.`,
      shadow: `The risk is staying in unstable, ungrounded professional territory because the intuitive gift never gets paired with any concrete structure — inconsistent income, vague offerings, real insight that never becomes a sellable service. If your income feels foggy, the gift may need more grounding, not more mystique.`,
      path: `Pair your intuitive professional gift with something concrete — a clear offering, a defined process, a tangible deliverable. The insight is real; it needs a container to actually be paid for.`,
      positive: `You pair genuine intuitive insight with a concrete, sellable offering, so real gift finally converts into consistent, actual income.`,
      negative: `Real intuitive insight left without any concrete container or offering stays foggy and unmonetized, impressive but not actually sellable.`,
    },

    // ── 19 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '19_MON': {
      heading: `Your Ideal Work Actually Feels Like You`,
      why: `You thrive financially in professions where your natural personality is actually the asset, not something to suppress for professionalism's sake — work that genuinely feels like you, authentic, visible, offered without the heaviness of grinding through something that doesn't fit. The Sun governs your money channel, meaning your wealth potential flows most easily through exactly this kind of work.`,
      shadow: `The risk is undervaluing work that comes easily and joyfully, assuming real professional value requires more struggle than you're actually experiencing. If you're underpaid for work that lights you up, the ease may be masking its own worth.`,
      path: `Let joy and price coexist. Work that feels easy to you can still be genuinely valuable — the ease of your gift doesn't lower what it's worth to someone else.`,
      positive: `You do work that genuinely feels like you and price it honestly, so the natural ease of your gift becomes sustainable income instead of undervalued labor.`,
      negative: `Assuming joyful, easy work must be worth less than struggle keeps genuinely valuable professional gifts chronically underpriced.`,
    },

    // ── 20 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '20_MON': {
      heading: `Your Ideal Work Is the One You Keep Being Called Back Toward`,
      why: `You thrive financially once you actually answer a genuine vocational calling rather than settling for merely adequate — a career that keeps summoning you, growing harder to ignore, even if the practical version of it feels riskier than staying put. Judgement governs your money channel, meaning your wealth potential flows most freely through exactly this kind of work.`,
      shadow: `The risk is hearing the calling and spending years preparing to answer it, staying in the adequate-but-outgrown role while endlessly upskilling instead of actually making the leap. If your income has stagnated despite real effort, the effort may be going into preparation rather than the actual move.`,
      path: `Answer the professional call before you feel fully ready. Financial growth tends to arrive in the moving, not the endless preparing.`,
      positive: `You answer your vocational calling when it arrives instead of endlessly preparing, and the income that follows finally matches who you've actually become.`,
      negative: `Endless preparation instead of answering a real calling keeps income tied to a role you've already outgrown, stagnant despite real effort.`,
    },

    // ── 21 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '21_MON': {
      heading: `Your Ideal Work Lets You Actually Master Something`,
      why: `You thrive financially once you've let yourself actually arrive at real competence in one domain, instead of constantly chasing the next credential. The World governs your money channel, meaning your wealth potential flows through professional mastery — a career built toward genuinely completing a body of work or expertise, rather than perpetually starting over.`,
      shadow: `The risk is never letting yourself feel like enough of a master to charge like one, always deferring recognition of your own expertise to some future, more finished version of yourself. If your income doesn't reflect your actual skill level, completion itself may be the thing being avoided.`,
      path: `Let your current mastery count as real, even knowing there's always more to learn. Price your expertise at what it's actually worth today, not at some future, fully-arrived version of it.`,
      positive: `You recognize and price your current mastery honestly, letting real expertise translate into real income instead of perpetually deferred recognition.`,
      negative: `Refusing to recognize your own mastery as real keeps income perpetually behind your actual skill level, deferred to a future version of yourself.`,
    },

    // ── 22 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '22_MON': {
      heading: `Your Ideal Work Starts Before You Have Any Guarantee It'll Work`,
      why: `You thrive financially in careers or ventures that reward genuine courage, letting you access opportunities that people requiring more proof simply never reach — a willingness to start a new venture, role, or path without needing certainty first. The Fool governs your money channel, meaning your wealth potential flows through exactly this kind of professional risk-taking.`,
      shadow: `The risk is repeating the same fresh professional start without absorbing what the last one taught you, leaping into new ventures with the same openness every time but no accumulating wisdom underneath it. If your career keeps resetting instead of building, the openness may need a partner in discernment.`,
      path: `Let each professional leap teach you something concrete you actually carry into the next one. The courage to start fresh is real — pairing it with genuine reflection is what turns repeated starts into accumulating expertise and income.`,
      positive: `You take real professional leaps without needing guarantees, and because you let each one teach you something durable, your career compounds into growing expertise and income.`,
      negative: `Leaping into fresh professional starts without absorbing the last one's lessons keeps your career resetting instead of ever actually building toward mastery.`,
    },

    // ── 13 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '13_F': {
      heading: `You Inherited Raw Material, Not a Finished Belief`,
      why: `The belief system, worldview, or spiritual inheritance passed down through your father's line was never meant to be received intact — it was meant to be transformed. Transformation, the 13th Arcana, sits in your Paternal Spiritual corner as a generational instruction: something in that lineage — a rigid faith, an unspoken code about how a man is supposed to relate to meaning, a belief about what's allowed to be questioned — reached the end of its natural life inside you specifically so it could be rebuilt into something that actually fits who you became. You didn't inherit a finished structure. You inherited raw material, and a mandate to remake it.`,
      shadow: `The trap is treating that inheritance as something to either swallow whole or reject entirely, rather than actually work through. Swallowed whole, it becomes belief you never examined, quietly running your life from behind the curtain. Rejected outright, it becomes an equally unexamined reaction — defining yourself by opposition to your father's worldview instead of by any actual position of your own. Both are ways of avoiding the harder work: taking what was given, letting the parts that no longer serve you actually die, and consciously choosing what's worth keeping. If you keep circling the same unresolved question about faith, authority, or meaning — showing up in new disguises but never quite settling — that's often the paternal line's spiritual inheritance still waiting for its ending.`,
      path: `Try a conscious inheritance audit: name, specifically, what belief or worldview arrived through your father's line, and ask honestly what part of it is genuinely yours versus what you've simply never gotten around to examining. This isn't a betrayal of your father — this isn't asking you to reject him, it's asking you to complete a transformation that was likely his to do as well, and may not have finished. What survives the audit becomes real conviction instead of inherited furniture. What doesn't survive gets released with respect instead of resentment — and the spiritual restlessness that's been following you finally has somewhere to land.`,
      positive: `You've separated your father's inherited worldview from your own genuine conviction — what you carry spiritually from that line is now consciously chosen, not simply installed.`,
      negative: `An unexamined paternal belief keeps running quietly in the background — either swallowed whole as unquestioned truth or rejected wholesale as pure reaction, with the same restless spiritual question resurfacing in new disguises.`,
    },

    // ── 1 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '1_F': {
      heading: `You Inherited a Belief That Faith Requires Doing Something`,
      why: `Something in your father's line treated spirituality as active rather than passive — faith proven through initiative, will, and the capacity to make things happen, rather than through quiet acceptance. The Magician sits in your Paternal Spiritual corner, marking this generational instruction about action and belief. You inherited raw material here, not a finished belief: an orientation toward spiritual agency that's yours to examine and consciously keep or release.`,
      shadow: `The trap is inheriting the compulsive half of that agency without the discernment — a belief that spiritual worth must be constantly proven through visible effort, that stillness or simply receiving is somehow a spiritual failure. If you keep feeling like your faith isn't "enough" unless you're actively doing something with it, that's often the paternal line's unexamined relationship to spiritual agency still running.`,
      path: `Try separating the genuine gift — real spiritual initiative — from the anxious compulsion to prove it constantly. Ask what your father's line was actually trying to protect by tying faith to action, and decide consciously how much of that tying-together is actually yours to keep.`,
      positive: `You've separated genuine spiritual initiative from anxious compulsion, keeping the real gift of active faith without needing to constantly prove it.`,
      negative: `An inherited, unexamined belief that faith must be constantly proven through action keeps spiritual worth feeling perpetually unearned no matter how much you do.`,
    },

    // ── 2 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '2_F': {
      heading: `You Inherited a Silence Around What Your Father's Line Sensed but Never Said`,
      why: `A paternal line more comfortable with what could be proven than what was simply sensed likely never gave intuitive knowing much open expression. The High Priestess sits in your Paternal Spiritual corner, marking this generational pattern. You inherited the raw material of that suppressed intuition: a real capacity for inner knowing that may have gone unspoken for at least a generation before you.`,
      shadow: `The trap is inheriting the silence along with the sensitivity — carrying real intuitive capacity but an unexamined belief that it shouldn't be voiced, especially not as confidently as more "provable" claims. If you find yourself downplaying your own inner knowing around authority figures, that's often the paternal line's suppressed mystery still running its old caution.`,
      path: `Try naming your intuitive sense out loud in contexts where your father's line would have stayed quiet. This isn't a rejection of him — it's completing a transmission that was likely his to voice as well, and may not have finished.`,
      positive: `You voice intuitive knowing that your father's line kept silent, completing a transmission of sensed wisdom that had gone unspoken for at least a generation.`,
      negative: `An inherited silence around intuition keeps real inner knowing suppressed, an unexamined caution about voicing what can't be proven still running from before you.`,
    },

    // ── 3 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '3_F': {
      heading: `You Inherited a Belief That Spiritual Abundance Has to Be Earned Hard`,
      why: `Something in your father's line treated spiritual nurturing or ease as scarce, perhaps something worked for rather than simply received. The Empress sits in your Paternal Spiritual corner, marking this generational instruction about generativity and spiritual abundance. You inherited raw material here: a real capacity for spiritual abundance that may have arrived wrapped in an old belief that it has to be difficult to be legitimate.`,
      shadow: `The trap is inheriting the scarcity without examining it — a belief that spiritual peace or generativity must be earned through struggle, making genuine ease around faith feel suspicious or unearned. If your spiritual life feels like it's always working uphill, that's often the paternal line's unexamined scarcity still running.`,
      path: `Try letting spiritual ease be legitimate, even if your father's line never modeled it as such. Ask what belief about earning was actually being protected, and consciously decide how much of that difficulty is genuinely yours to keep carrying.`,
      positive: `You've let spiritual ease and abundance be legitimate rather than something that must be earned through struggle, releasing an old paternal scarcity around faith.`,
      negative: `An inherited belief that spiritual abundance must be hard-won keeps genuine ease feeling suspicious, an old scarcity still running beneath conscious awareness.`,
    },

    // ── 4 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '4_F': {
      heading: `You Inherited a Belief About Who's Allowed to Define What's True`,
      why: `Your father's line likely held firm, hierarchical beliefs about how faith should be organized and who holds the right to define it. The Emperor sits in your Paternal Spiritual corner, marking this generational instruction about spiritual authority and structure. You inherited raw material here: a real respect for spiritual structure that arrived bundled with an unexamined belief about where authority is allowed to live.`,
      shadow: `The trap is inheriting the rigidity without the discernment — either submitting entirely to inherited spiritual authority without examining it, or rejecting all structure reflexively because the inherited version felt oppressive. If you keep circling questions of spiritual authority without landing anywhere, that's often unfinished paternal work.`,
      path: `Try building your own relationship to spiritual structure — neither fully inherited nor fully rejected, but consciously assembled from what actually serves you. This completes work your father's line likely didn't finish either.`,
      positive: `You've consciously built your own relationship to spiritual authority and structure, neither simply inheriting nor reflexively rejecting what your father's line held.`,
      negative: `An unexamined inheritance of rigid spiritual authority keeps you either submitting to structure without question or rejecting all structure reflexively, never landing anywhere of your own.`,
    },

    // ── 5 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '5_F': {
      heading: `You Inherited the Actual Doctrine, Not Just a General Orientation`,
      why: `You inherited an actual doctrine, formal tradition, or specific set of codified beliefs passed down through your father's line, not just a general spiritual orientation. The Hierophant sits in your Paternal Spiritual corner, marking the most literal version of this inheritance. You inherited raw material here in its most concrete form — real teachings, rules, or a specific framework that was handed to you largely intact.`,
      shadow: `The trap is treating the specific doctrine as non-negotiable simply because it arrived so formally packaged — mistaking the formality of the transmission for proof it doesn't need examining. If you feel unable to question a specific belief without feeling like you're betraying your father's line, that's the doctrine's packaging outweighing its actual content.`,
      path: `Try examining the specific doctrine piece by piece, the way you'd examine any teaching — some of it may hold up genuinely, some may not. The formality of how it arrived doesn't exempt it from your own honest evaluation.`,
      positive: `You've examined the specific doctrine you inherited piece by piece, keeping what genuinely holds up rather than treating its formal packaging as proof of its truth.`,
      negative: `Treating an inherited doctrine as beyond question, simply because of how formally it arrived, keeps you carrying beliefs you've never actually evaluated for yourself.`,
    },

    // ── 6 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '6_F': {
      heading: `You Inherited a Belief About What Spiritual Commitment Is Supposed to Look Like`,
      why: `Your father's line likely modeled a specific idea of what devoted, "correct" spiritual commitment looks like, perhaps built around loyalty to one path rather than genuine, examined alignment. The Lovers sit in your Paternal Spiritual corner, marking this generational instruction about spiritual choice and commitment. You inherited raw material here: real capacity for spiritual devotion that arrived with an inherited definition of what that devotion should look like.`,
      shadow: `The trap is inheriting the commitment without the choice — staying loyal to a specific spiritual path out of inherited obligation rather than genuine, examined alignment. If your spiritual commitment feels more like duty than devotion, that's often the paternal line's inherited definition still standing in for your own.`,
      path: `Try consciously choosing your spiritual commitments rather than assuming the inherited ones. This isn't necessarily rejecting your father's path — it's making sure whatever you keep is actually chosen, not simply carried forward by default.`,
      positive: `You've consciously chosen your own spiritual commitments rather than carrying your father's line's definition forward by default, making devotion genuine instead of dutiful.`,
      negative: `Inheriting a definition of spiritual commitment without ever consciously choosing it keeps devotion feeling like duty rather than genuine, examined alignment.`,
    },

    // ── 7 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '7_F': {
      heading: `You Inherited a Belief That Spiritual Growth Requires Constant Forward Push`,
      why: `Your father's line likely modeled faith as something actively steered and pushed toward, with real emphasis on willpower and forward motion. The Chariot sits in your Paternal Spiritual corner, marking this generational instruction about disciplined spiritual pursuit. You inherited raw material here: genuine spiritual discipline that arrived bundled with an unexamined belief that stillness or rest is a kind of spiritual failure.`,
      shadow: `The trap is inheriting the drive without ever questioning whether constant forward motion is actually what your own spiritual life needs. If you feel guilty resting from spiritual practice, or restless during genuinely still periods, that's often the paternal line's unexamined momentum still running.`,
      path: `Try letting your spiritual practice include real stillness without guilt. This completes work your father's line may not have finished — distinguishing disciplined pursuit from an inability to ever simply arrive.`,
      positive: `You've let your spiritual life include genuine stillness without guilt, distinguishing real discipline from an inherited inability to ever simply rest in your practice.`,
      negative: `An inherited belief that spiritual growth requires constant forward push keeps rest or stillness feeling like failure, discipline running without ever actually landing anywhere.`,
    },

    // ── 8 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '8_F': {
      heading: `You Inherited a Belief About How Strictly Spiritual Accounts Get Settled`,
      why: `Your father's line likely held firm beliefs about consequence, fairness, and what's owed in the spiritual ledger. Justice sits in your Paternal Spiritual corner, marking this generational instruction about moral and spiritual accountability. You inherited raw material here: a real sense of spiritual integrity that arrived with an inherited standard for exactly how harshly, or how precisely, accounts are supposed to be settled.`,
      shadow: `The trap is inheriting the harshness of the standard without questioning whether it's actually accurate — carrying an unexamined belief that spiritual failing demands strict, specific consequence, which can make your own relationship to faith feel more like fear of judgment than genuine integrity. If you feel constantly spiritually "in debt," that may be an inherited ledger, not an accurate one.`,
      path: `Try examining the specific standard of spiritual accountability you inherited, and consciously decide how much of its strictness actually reflects your own sense of what's fair.`,
      positive: `You've examined and consciously softened an inherited, overly harsh standard of spiritual accountability, replacing fear of judgment with your own genuine sense of integrity.`,
      negative: `An unexamined, inherited standard of strict spiritual consequence keeps faith feeling like perpetual debt rather than the genuine integrity it was meant to reflect.`,
    },

    // ── 9 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '9_F': {
      heading: `You Inherited a Belief That Spiritual Truth Is Found Alone`,
      why: `Your father's line likely modeled faith as something pursued in withdrawal, privately, without much communal sharing. The Hermit sits in your Paternal Spiritual corner, marking this generational instruction about solitary spiritual seeking. You inherited raw material here: a real capacity for deep, solitary spiritual reflection that arrived with an inherited assumption that spiritual matters simply aren't discussed.`,
      shadow: `The trap is inheriting the isolation along with the depth — carrying real spiritual insight but an unexamined belief that it should stay private, which can leave you feeling spiritually lonely even when connection is genuinely available. If you keep your deepest spiritual questions to yourself by default, that's often the paternal line's inherited withdrawal.`,
      path: `Try sharing a piece of your solitary spiritual insight with someone, breaking a silence that may have been inherited rather than chosen. This completes transmission your father's line may not have finished.`,
      positive: `You've broken an inherited silence around spiritual matters, sharing solitary insight instead of assuming by default it should stay private.`,
      negative: `An inherited assumption that spiritual truth is found and kept alone leaves real insight isolated, a spiritual loneliness that persists even when connection is available.`,
    },

    // ── 10 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '10_F': {
      heading: `You Inherited a Belief About How Much Say You Actually Have in Your Own Fate`,
      why: `Your father's line likely held a specific belief about how much control a person actually has over their own turning, whether leaning toward fatalism or toward active participation in one's fortune. The Wheel of Fortune sits in your Paternal Spiritual corner, marking this generational instruction about fate and spiritual cycles. You inherited raw material here: a real relationship to spiritual timing that arrived with an inherited answer to a question worth re-asking.`,
      shadow: `The trap is inheriting either the fatalism or the over-control without examining which one actually fits you. If you find yourself either passively accepting hardship as "meant to be" or gripping too tightly to control outcomes, that's often an inherited belief about fate still running rather than your own tested conclusion.`,
      path: `Try examining your actual, lived relationship to timing and fate, separate from what your father's line assumed. Some inherited fatalism, or some inherited need for control, may need updating to match your own experience.`,
      positive: `You've examined and updated an inherited belief about fate to match your own lived experience, neither passively fatalistic nor gripping for control by old default.`,
      negative: `An unexamined inheritance of fatalism or excessive control around spiritual timing keeps you running an inherited answer instead of your own tested relationship to fate.`,
    },

    // ── 11 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '11_F': {
      heading: `You Inherited a Belief That Spiritual Strength Means Never Showing Strain`,
      why: `Your father's line likely modeled faith as quiet, uncomplaining fortitude, strength shown through never visibly cracking. Strength sits in your Paternal Spiritual corner, marking this generational instruction about spiritual endurance. You inherited raw material here: real capacity for spiritual resilience that arrived bundled with an unexamined belief that struggle should stay hidden.`,
      shadow: `The trap is inheriting the suppression along with the endurance — carrying real spiritual strength but an inherited discomfort with visible doubt or difficulty, which can leave your own spiritual struggles feeling shameful to admit. If you hide your genuine crises of faith even from people who'd understand, that's often the paternal line's inherited stoicism.`,
      path: `Try letting a real spiritual struggle be visible to someone you trust. This completes work your father's line may not have finished — separating genuine strength from an inherited requirement to look unshaken.`,
      positive: `You've let genuine spiritual struggle be visible instead of hidden, separating real strength from an inherited requirement to always look unshaken.`,
      negative: `An inherited belief that spiritual strength means never showing strain keeps real struggles hidden even from people who could genuinely help.`,
    },

    // ── 12 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '12_F': {
      heading: `You Inherited a Belief About What Spiritual Sacrifice Is Supposed to Cost`,
      why: `Your father's line likely modeled a specific relationship to giving something up for faith, perhaps one that looked more like quiet martyrdom than genuine, chosen release. The Hanged Man sits in your Paternal Spiritual corner, marking this generational instruction about spiritual surrender and sacrifice. You inherited raw material here: a real capacity for spiritual surrender that arrived with an inherited belief about what that surrender is supposed to cost.`,
      shadow: `The trap is inheriting the martyrdom without examining whether real sacrifice is actually being asked, or whether suffering has simply been mistaken for spiritual depth. If your spiritual life feels weighted by an obligation to suffer for it to count, that's often unfinished paternal work.`,
      path: `Try examining whether your spiritual surrenders are genuinely chosen or inherited as obligation. Real release doesn't require performed suffering — it requires an honest yes.`,
      positive: `You've separated genuine, chosen spiritual surrender from an inherited belief that sacrifice must look like suffering to count.`,
      negative: `An inherited belief that spiritual depth requires visible sacrifice keeps surrender feeling like performed suffering rather than an honest, chosen release.`,
    },

    // ── 14 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '14_F': {
      heading: `You Inherited a Belief That Spiritual Balance Means Staying Neutral`,
      why: `Your father's line likely modeled faith as measured, careful, avoiding extremes, which may have shaded into genuine emotional distance from spiritual intensity altogether. Temperance sits in your Paternal Spiritual corner, marking this generational instruction about spiritual moderation. You inherited raw material here: a real capacity for balanced spiritual integration that arrived with an inherited caution against actually feeling anything too deeply.`,
      shadow: `The trap is inheriting the neutrality without the genuine integration — staying so moderate about spiritual matters that real intensity or passion never gets to show up at all. If your spiritual life feels calm but strangely flat, that's often inherited caution standing in for real balance.`,
      path: `Try letting real spiritual intensity in before you moderate it. Genuine temperance requires actually feeling both extremes, not avoiding them from the start.`,
      positive: `You've let real spiritual intensity and feeling in before moderating it, achieving genuine integration rather than an inherited, flat neutrality.`,
      negative: `An inherited caution against spiritual intensity, mistaken for balance, keeps faith feeling calm but flat, avoiding real feeling rather than genuinely integrating it.`,
    },

    // ── 15 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '15_F': {
      heading: `You Inherited a Belief That Spiritual Life and Real Desire Can't Coexist`,
      why: `Your father's line likely held tension between faith and material or bodily desire, perhaps resolved through denial rather than genuine integration. The Devil sits in your Paternal Spiritual corner, marking this generational instruction about spiritual repression. You inherited raw material here: real spiritual depth that arrived bundled with an inherited belief that desire itself is spiritually dangerous.`,
      shadow: `The trap is inheriting the repression without examining it — carrying an unexamined shame around desire, pleasure, or material want that quietly undermines your actual spiritual peace. If you feel spiritual guilt around ordinary human wants, that's often the paternal line's unresolved tension still running.`,
      path: `Try examining whether desire and faith actually have to be enemies, or whether that was simply your father's line's unresolved conflict. Genuine spiritual maturity can hold both.`,
      positive: `You've examined and released an inherited belief that desire and faith are enemies, allowing genuine spiritual maturity to hold both without shame.`,
      negative: `An inherited, unresolved tension between desire and faith keeps ordinary human wants shadowed by spiritual guilt that was never actually yours to carry.`,
    },

    // ── 16 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '16_F': {
      heading: `You Inherited an Unfinished Spiritual Collapse`,
      why: `Something in your father's line's faith likely underwent a genuine collapse or crisis that was never fully processed, leaving its aftershock to pass down instead of its resolution. The Tower sits in your Paternal Spiritual corner, marking this generational instruction shaped by real spiritual rupture. You inherited raw material here: real capacity for spiritual clarity that arrived tangled with an unfinished upheaval.`,
      shadow: `The trap is inheriting the instability without ever getting to actually process the original rupture — a free-floating spiritual unease whose source predates you. If you feel a vague, hard-to-place distrust of spiritual structures, that's often an inherited collapse still looking for its resolution.`,
      path: `Try naming the collapse, even speculatively — what belief in your father's line might have come down hard, and what clarity came, or should have come, after. Giving it words can finish what was left incomplete.`,
      positive: `You've named and processed an inherited, unfinished spiritual collapse, letting its clarity actually land instead of leaving the rupture unresolved.`,
      negative: `An unprocessed, inherited spiritual collapse leaves a vague, hard-to-place distrust of spiritual structures, its original rupture never actually given words.`,
    },

    // ── 17 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '17_F': {
      heading: `You Inherited a Belief That Spiritual Hope Has to Be Kept Modest`,
      why: `Your father's line likely modeled a modest, guarded relationship to spiritual optimism, hope kept quiet rather than fully expressed, perhaps to protect against disappointment. The Star sits in your Paternal Spiritual corner, marking this generational instruction about hope itself. You inherited raw material here: real capacity for spiritual renewal that arrived with an inherited caution against hoping too visibly.`,
      shadow: `The trap is inheriting the caution without questioning it — carrying real hope but an unexamined belief that expressing it fully invites disappointment. If you find yourself hedging every spiritual hope with a disclaimer, that's often the paternal line's dimmed light still running.`,
      path: `Try letting one spiritual hope be fully, visibly held, without the inherited hedge. This completes work your father's line may not have finished — separating wisdom from muted expectation.`,
      positive: `You've let spiritual hope be fully and visibly held, without the inherited hedge, completing a transmission of light your father's line kept modest.`,
      negative: `An inherited caution against visible hope keeps genuine spiritual optimism hedged and dimmed, protecting against a disappointment that was never actually guaranteed.`,
    },

    // ── 18 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '18_F': {
      heading: `You Inherited a Fear Your Father's Line Never Fully Named`,
      why: `Something in your father's line's spiritual life likely carried real unease that was never directly faced, just quietly passed down as vague unease instead of a fear with a name. The Moon sits in your Paternal Spiritual corner, marking this generational instruction shaped by unprocessed fear. You inherited raw material here: real spiritual sensitivity that arrived tangled with an inherited, unnamed dread.`,
      shadow: `The trap is inheriting the fog without the clarity — carrying a diffuse spiritual anxiety that doesn't attach to anything specific in your own life. If unease around faith or the unknown keeps surfacing without clear cause, that's often an inherited fear still circling, waiting for its name.`,
      path: `Try tracing the anxiety back as far as you can, even speculatively — what might your father's line have been afraid of spiritually that never got said aloud? Naming it, even provisionally, can finally give it somewhere to land.`,
      positive: `You've traced and named an inherited, unspoken spiritual fear, giving it somewhere to land instead of letting it circle as vague, unattached unease.`,
      negative: `An inherited, never-named spiritual fear keeps generating diffuse anxiety that doesn't attach to anything in your own actual life, circling without resolution.`,
    },

    // ── 19 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '19_F': {
      heading: `You Inherited a Belief That Spiritual Seriousness Rules Out Real Joy`,
      why: `Your father's line likely modeled spirituality as a serious, weighty matter, with genuine delight or lightness treated as somehow beside the point. The Sun sits in your Paternal Spiritual corner, marking this generational instruction about joy in faith. You inherited raw material here: real capacity for radiant, joyful faith that arrived with an inherited assumption that seriousness is what makes belief legitimate.`,
      shadow: `The trap is inheriting the heaviness without questioning it — muting your own genuine spiritual joy because it doesn't match the solemn tone modeled before you. If your faith feels dutiful rather than delightful, that's often an inherited seriousness standing in for actual reverence.`,
      path: `Try letting genuine joy be a legitimate part of your spiritual life, without needing to justify it with gravity. This completes work your father's line may not have finished — proving faith can be light and still be real.`,
      positive: `You've let genuine joy be a legitimate part of your spiritual life, proving faith can be light without needing constant gravity to feel real.`,
      negative: `An inherited belief that spiritual seriousness is required for legitimacy keeps faith feeling dutiful, muting a genuine joy that was always allowed to be there.`,
    },

    // ── 20 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '20_F': {
      heading: `You Inherited a Calling Your Father's Line Left Unanswered`,
      why: `Something in your father's line likely sensed a larger calling toward deeper faith or purpose and set it aside, whether from circumstance or fear. Judgement sits in your Paternal Spiritual corner, marking this generational instruction shaped by a postponed spiritual awakening. You inherited raw material here: a real capacity to answer that calling, passed down along with the fact that it was once left unaddressed.`,
      shadow: `The trap is inheriting the postponement itself — sensing a spiritual summons and, without quite knowing why, setting it aside the same way, as though delay were simply how this family relates to its deeper calls. If you keep almost-answering a spiritual pull without ever fully committing, that's often unfinished paternal work.`,
      path: `Try answering the call your own way, even if your father's line never did. You're not obligated to repeat the postponement — you're free to be the one who actually responds.`,
      positive: `You've answered a spiritual calling your father's line left unaddressed, becoming the one in the line who actually responded instead of postponing.`,
      negative: `An inherited pattern of postponing a spiritual summons keeps you almost-answering the same pull without ever fully committing, repeating an unfinished paternal pattern.`,
    },

    // ── 21 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '21_F': {
      heading: `You Inherited a Spiritual Cycle Your Father's Line Never Got to Close`,
      why: `Your father's line likely worked toward real spiritual wholeness or mastery but never quite arrived at it, the cycle interrupted before its natural end. The World sits in your Paternal Spiritual corner, marking this generational instruction shaped by unfinished spiritual completion. You inherited raw material here: real capacity for genuine spiritual integration, passed down along with the incompleteness that came before you.`,
      shadow: `The trap is inheriting the same near-completion — sensing yourself close to real spiritual wholeness and then, without clear cause, stopping just short, echoing a pattern that predates your own choices. If your spiritual growth keeps feeling almost-there, that's often an old, unfinished cycle looking for someone to finally close it.`,
      path: `Try being the one who lets the cycle actually complete. Your father's line got close — you're free to be the one who finishes it, on your own terms.`,
      positive: `You've let a spiritual cycle your father's line left almost-finished actually complete, becoming the one who closed what predated you.`,
      negative: `An inherited pattern of near-completion keeps spiritual growth feeling perpetually almost-there, echoing an unfinished cycle that started before you.`,
    },

    // ── 22 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '22_F': {
      heading: `You Inherited a Caution About Spiritual Leaps Your Father's Line Never Took`,
      why: `Your father's line likely held real caution around unproven spiritual paths, favoring the tested and familiar over genuine leaps into the unknown. The Fool sits in your Paternal Spiritual corner, marking this generational instruction about spiritual risk. You inherited raw material here: real capacity for spiritual openness and trust that arrived with an inherited wariness of anything too new.`,
      shadow: `The trap is inheriting the caution without examining it — staying spiritually within familiar, approved territory even when something genuinely new is calling you, out of a hesitation that isn't actually yours. If you feel a reflexive suspicion of unfamiliar spiritual paths, that's often the paternal line's unexamined wariness.`,
      path: `Try taking one small, genuine spiritual leap your father's line likely wouldn't have. This isn't disrespect — it's completing an openness that was likely his to explore as well.`,
      positive: `You've taken a genuine spiritual leap your father's line's caution never allowed, completing an openness to the new that predates your own choices.`,
      negative: `An inherited wariness of unfamiliar spiritual paths keeps you within tested, approved territory even when something genuinely new is calling you.`,
    },

    // ── 9 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '9_G': {
      heading: `You Learned Depth Before You Learned to Speak It`,
      why: `The spiritual inheritance passed down through your mother's line arrived mostly through silence rather than instruction — an inward, private relationship to meaning, faith, or inner knowing that was modeled more than it was taught. The Hermit sits in your Maternal Spiritual corner, and the gift here is real: you likely carry an inherited capacity for genuine solitary depth, an ability to sit with the unanswerable that most people never develop. But because it arrived wordlessly, you may have also inherited the assumption that the deepest spiritual matters aren't things you talk about — that the correct response to the sacred is to go quiet and go inward, the way the maternal line did before you.`,
      shadow: `This can show up as a spiritual life that stays entirely private by default — not because you chose that, but because the maternal lineage never modeled another option. You might have genuine wisdom that never gets offered to the people who could actually use it, or a quiet, generational loneliness — women in your line who each carried real inner depth alone, never quite realizing the people around them were carrying something similar in the same silence. If you keep feeling spiritually or emotionally unseen by the people closest to you, generation after generation, that's less a personal failing than an inherited pattern that was never given the chance to become spoken.`,
      path: `Try honoring the depth of what was passed down while consciously giving it a voice the generations before you may not have had access to. That doesn't mean abandoning your inward orientation — the solitary depth is a genuine gift — it means occasionally bringing what you find there back out into relationship, breaking a silence that was inherited rather than chosen. Every time you speak the maternal line's quiet wisdom out loud, you complete something that was waiting, for at least one generation, to finally be received.`,
      positive: `You carry the maternal line's genuine capacity for depth and inner knowing, and you've learned to voice it — sharing what was historically kept silent, so the wisdom actually reaches people instead of staying inherited-but-unspoken.`,
      negative: `A default, inherited silence keeps real depth from ever being offered — the same quiet, generational loneliness repeats itself because going inward was modeled, and speaking outward never was.`,
    },

    // ── 1 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '1_G': {
      heading: `You Inherited a Quiet, Unspoken Belief That You Can Make Things Happen`,
      why: `Women in your mother's line likely modeled real spiritual capability without ever framing it as such, simply moving through life with a kind of unspoken confidence that things could be willed into being. The Magician sits in your Maternal Spiritual corner, marking this generational transmission of quiet agency. You inherited this as a felt sense rather than a taught lesson: capability transmitted through example, not explanation.`,
      shadow: `The trap is inheriting the capability without the language to name or claim it — a quiet confidence that never gets spoken aloud, so it stays instinctual rather than becoming something you can consciously wield. If you sense you have real spiritual agency but struggle to explain or claim it, that's often maternal wisdom that was modeled but never voiced.`,
      path: `Try naming your own capability out loud, giving language to what was only ever demonstrated before you. Speaking it doesn't diminish it — it makes it usable in ways silent modeling never could.`,
      positive: `You've given voice to a quiet, inherited sense of spiritual agency, making usable and claimed what was previously only modeled in silence.`,
      negative: `An inherited, unspoken confidence in your own capability stays merely instinctual when it's never given language, limiting how consciously you can actually wield it.`,
    },

    // ── 2 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '2_G': {
      heading: `You Inherited a Way of Knowing That Never Needed Proof`,
      why: `Women in your mother's line likely trusted their inner sense of things without needing external validation, moving through cycles of clarity and mystery as simply how knowing worked. The High Priestess sits in your Maternal Spiritual corner, marking this generational transmission of intuitive knowing. You inherited this as an embodied trust: knowing that arrives without argument, modeled rather than explained.`,
      shadow: `The trap is inheriting the trust without ever testing it against the world — an intuitive certainty so deeply modeled that you never learned to distinguish genuine knowing from simple assumption. If your intuitions feel unquestionable even when they turn out wrong, that's often inherited certainty that was never actually taught how to self-correct.`,
      path: `Try holding your intuitive knowing as genuinely valuable and still open to being wrong sometimes. Real trust in your inner sense doesn't require it to be infallible — it requires you to keep listening even when it needs updating.`,
      positive: `You trust your inherited intuitive knowing while staying open to updating it, so it functions as genuine wisdom rather than unquestionable certainty.`,
      negative: `An inherited, unquestioned trust in intuition, modeled without ever being tested, can harden into certainty that resists correction even when it's actually wrong.`,
    },

    // ── 3 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '3_G': {
      heading: `You Inherited a Spiritual Warmth That Was Never Explained, Just Lived`,
      why: `Women in your mother's line likely modeled a warm, generative relationship to faith or meaning, simply living it rather than teaching it directly. The Empress sits in your Maternal Spiritual corner, marking this generational transmission of nurturing spiritual presence. You inherited this as felt atmosphere: spiritual abundance transmitted through presence, not instruction.`,
      shadow: `The trap is inheriting the warmth without the words for it — spiritual generativity that stays purely atmospheric, never becoming something you can consciously offer or teach to someone else. If your spiritual nurturing feels natural but hard to articulate, that's often maternal wisdom that was lived but never spoken.`,
      path: `Try putting words to the spiritual warmth you carry, even if it feels reductive at first. Naming it is what lets you offer it deliberately, not just radiate it by accident.`,
      positive: `You've found words for an inherited spiritual warmth, letting you offer it deliberately to others instead of only radiating it unconsciously.`,
      negative: `Spiritual warmth that stays purely felt, never given language, remains atmospheric rather than becoming something you can consciously offer or pass on.`,
    },

    // ── 4 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '4_G': {
      heading: `You Inherited an Authority That Never Had to Raise Its Voice`,
      why: `Women in your mother's line likely held real spiritual order and steadiness without ever asserting it loudly, maintaining structure through presence rather than proclamation. The Emperor sits in your Maternal Spiritual corner, marking this generational transmission of quiet structural authority. You inherited this as an unspoken model: authority that doesn't need to announce itself to be real.`,
      shadow: `The trap is inheriting the quietness without the actual claiming — a real capacity for spiritual leadership that stays so unassuming it never gets recognized, including by you. If your steadiness goes unnoticed and uncredited, that's often maternal authority that was modeled too quietly to be seen.`,
      path: `Try letting your quiet spiritual authority be visible sometimes, even if it feels like breaking a pattern. Real steadiness doesn't lose its power by being acknowledged.`,
      positive: `You let your quiet, inherited spiritual authority be visible and recognized, without losing the steadiness that made it real in the first place.`,
      negative: `Spiritual authority modeled too quietly to ever be claimed stays unnoticed and uncredited, including by the person who actually carries it.`,
    },

    // ── 5 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '5_G': {
      heading: `You Inherited Wisdom Passed Through Relationship, Not Rulebooks`,
      why: `Women in your mother's line likely passed down spiritual understanding through relationship and lived example rather than formal doctrine or codified teaching. The Hierophant sits in your Maternal Spiritual corner, marking this generational transmission of relational, informal wisdom. You inherited this as embedded knowledge: wisdom you absorbed by proximity rather than instruction.`,
      shadow: `The trap is inheriting wisdom so informally that it never gets recognized as a real body of knowledge, easy to dismiss as "just how mom was" rather than something genuinely worth carrying forward deliberately. If you undervalue what you learned this way, that's often because it never arrived with the credibility of formal teaching.`,
      path: `Try treating what you absorbed relationally as real, valuable knowledge, worth naming and passing on with the same seriousness as any formal teaching.`,
      positive: `You've recognized relationally-transmitted maternal wisdom as genuinely valuable, worth naming and passing on with real seriousness rather than dismissing it.`,
      negative: `Wisdom absorbed informally, without the credibility of formal teaching, often goes undervalued and unclaimed, dismissed as incidental rather than genuinely worth carrying forward.`,
    },

    // ── 6 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '6_G': {
      heading: `You Inherited a Sense of Spiritual Values Modeled Through Who She Chose to Be`,
      why: `Women in your mother's line likely demonstrated their spiritual priorities through the relationships and commitments they actually made, rather than stating those values outright. The Lovers sit in your Maternal Spiritual corner, marking this generational transmission of values shown through lived choice. You inherited this by watching: values transmitted through example rather than declaration.`,
      shadow: `The trap is absorbing the values without ever examining whether they're genuinely yours, simply repeating the same relational choices because that's the pattern you watched, not because you've actually chosen it. If your relationship choices feel automatic rather than examined, that's often inherited example standing in for your own values.`,
      path: `Try naming the values you actually watched get modeled, and consciously decide which ones you're keeping. Choosing deliberately what you'll otherwise inherit by default is the real work here.`,
      positive: `You've named and consciously chosen the spiritual values you inherited by watching, rather than simply repeating a pattern by default.`,
      negative: `Absorbing values purely by watching, without ever examining them, keeps relational choices feeling automatic rather than genuinely chosen.`,
    },

    // ── 7 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '7_G': {
      heading: `You Inherited a Determination That Never Needed to Announce Itself`,
      why: `Women in your mother's line likely kept a steady spiritual direction through real difficulty, modeling determination without drama. The Chariot sits in your Maternal Spiritual corner, marking this generational transmission of quiet, sustained spiritual will. You inherited this as embodied endurance: forward motion transmitted through simply watching someone keep going.`,
      shadow: `The trap is inheriting the endurance without ever questioning whether the direction itself was actually chosen, or simply the only path modeled. If you find yourself pushing forward spiritually without a clear sense of why, that's often inherited momentum running on autopilot.`,
      path: `Try pausing to ask whether your spiritual direction is genuinely yours, chosen consciously, or simply the shape of momentum you absorbed. Redirect if needed — the determination itself is a real gift regardless of where it's currently pointed.`,
      positive: `You've examined your inherited spiritual momentum and consciously chosen its direction, keeping the real gift of determination while making sure it's pointed where you actually want.`,
      negative: `Inherited momentum that's never questioned keeps spiritual direction running on autopilot, determination without a consciously chosen destination.`,
    },

    // ── 8 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '8_G': {
      heading: `You Inherited a Sense of Right and Wrong That Was Never Explained, Just Demonstrated`,
      why: `Women in your mother's line likely lived by a clear internal moral compass without ever spelling it out, letting their consistent actions speak for the standard. Justice sits in your Maternal Spiritual corner, marking this generational transmission of embodied fairness. You inherited this as felt conviction: a sense of right and wrong absorbed by watching, not by being told.`,
      shadow: `The trap is inheriting the conviction without ever examining its actual content, applying an unexamined standard that may not perfectly fit your own circumstances. If your sense of fairness feels rigid in situations it wasn't originally built for, that's often an inherited standard applied without adjustment.`,
      path: `Try naming the specific standard you absorbed, and checking whether it actually fits situations your mother's line never encountered. Update what needs updating; keep what genuinely holds.`,
      positive: `You've named and consciously adapted an inherited standard of fairness, making it fit your own circumstances rather than applying it rigidly by default.`,
      negative: `An unexamined, inherited sense of right and wrong can feel rigid or ill-fitting in situations it was never actually built for, applied without adjustment.`,
    },

    // ── 10 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ──────────
    '10_G': {
      heading: `You Inherited a Quiet Trust That Things Eventually Turn`,
      why: `Women in your mother's line likely moved through real hardship and renewal without dramatizing either, modeling a quiet trust that difficult seasons pass. The Wheel of Fortune sits in your Maternal Spiritual corner, marking this generational transmission of cyclical resilience. You inherited this as embodied patience: trust in cycles transmitted through simply watching someone endure and recover.`,
      shadow: `The trap is inheriting the patience without the active participation — a passive waiting-it-out that never quite engages with what could actually be done during a difficult season. If you find yourself simply enduring rather than actively navigating hard times, that's often inherited patience without its complementary agency.`,
      path: `Try pairing your inherited trust in cycles with active engagement — not just waiting for the turn, but participating in it. Both were likely present in your mother's line; make sure you inherited the whole picture, not just the waiting half.`,
      positive: `You pair inherited trust in life's cycles with active engagement, navigating hard seasons instead of just passively enduring them.`,
      negative: `Inheriting only the patience half of cyclical resilience, without the active participation, leaves you passively enduring hardship rather than genuinely navigating it.`,
    },

    // ── 11 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '11_G': {
      heading: `You Inherited a Softness That Was Somehow Also Unbreakable`,
      why: `Women in your mother's line likely held real difficulty with a soft, embodied steadiness rather than hardened toughness, modeling a strength that never needed to look fierce to be real. Strength sits in your Maternal Spiritual corner, marking this generational transmission of gentle endurance. You inherited this as felt permission: the sense that gentleness and real resilience aren't opposites.`,
      shadow: `The trap is inheriting the softness without recognizing its actual strength, mistaking your own gentle steadiness for weakness because it doesn't look like conventional toughness. If you undervalue your own resilience because it's quiet, that's often maternal strength that was never named as strength.`,
      path: `Try naming your gentle endurance as the real strength it is, out loud, to yourself if no one else. It doesn't need to look hard to be genuinely unbreakable.`,
      positive: `You've named your gentle, embodied endurance as real strength, recognizing resilience that doesn't need to look tough to actually be unbreakable.`,
      negative: `Failing to recognize inherited gentle strength as genuine resilience leaves real endurance undervalued simply because it never looked conventionally tough.`,
    },

    // ── 12 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '12_G': {
      heading: `You Inherited a Patience for Not Knowing Yet`,
      why: `Women in your mother's line likely modeled a genuine comfort with not having answers yet, letting understanding arrive in its own time rather than forcing it. The Hanged Man sits in your Maternal Spiritual corner, marking this generational transmission of receptive waiting. You inherited this as embodied patience: the sense that suspension itself can be productive.`,
      shadow: `The trap is inheriting the waiting without its eventual resolution — staying suspended indefinitely because that's the pattern you watched, without the corresponding modeled return to action. If your patience never seems to convert into actual movement, that's often inherited waiting without its other half.`,
      path: `Try letting your patience have a deliberate endpoint. The receptivity is a real gift — pairing it with an eventual, chosen return to action completes what may have only been partially modeled.`,
      positive: `You pair inherited patience with a deliberate return to action, letting genuine receptivity eventually convert into real movement.`,
      negative: `Inheriting only the waiting half of receptive patience, without its eventual resolution, leaves suspension feeling permanent rather than genuinely productive.`,
    },

    // ── 13 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '13_G': {
      heading: `You Inherited a Quiet Ability to Become Someone New When It Mattered`,
      why: `Women in your mother's line likely underwent real personal transformation without much fanfare, simply becoming who they needed to become as circumstances demanded. Transformation sits in your Maternal Spiritual corner, marking this generational transmission of quiet reinvention. You inherited this as embodied permission: change transmitted through watching someone quietly become new.`,
      shadow: `The trap is inheriting the capacity for change without ever consciously choosing your own transformations, simply reacting to circumstance the way you watched rather than actively directing your own becoming. If your changes feel like they happen to you rather than through your own choice, that's often inherited reactive transformation.`,
      path: `Try initiating a change deliberately, rather than only transforming under pressure. The capacity is real — direct it consciously instead of only accessing it in crisis.`,
      positive: `You initiate your own transformations deliberately, directing an inherited capacity for change rather than only accessing it reactively under pressure.`,
      negative: `Only transforming reactively, under pressure, without ever consciously choosing change, keeps genuine reinvention feeling like something that happens to you rather than through you.`,
    },

    // ── 14 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '14_G': {
      heading: `You Inherited a Way of Holding Contradictions Without Making a Fuss`,
      why: `Women in your mother's line likely held real contradictions (duty and desire, strength and softness) without ever treating them as a crisis, simply living the blend day to day. Temperance sits in your Maternal Spiritual corner, marking this generational transmission of quiet integration. You inherited this as embodied ease: the sense that holding two true things at once doesn't require resolution, just steadiness.`,
      shadow: `The trap is inheriting the quiet holding without ever actually examining the contradictions being held, absorbing an ease with paradox that can shade into avoiding real tension that actually needs addressing. If you find yourself calmly holding a contradiction that's genuinely causing harm, that's often inherited ease applied where real change was needed instead.`,
      path: `Try distinguishing which contradictions genuinely just need patient holding, and which ones need actual resolution. Your inherited ease is a real gift — it works best paired with discernment about when it's actually appropriate.`,
      positive: `You distinguish between contradictions that need patient holding and ones that need real resolution, applying an inherited ease with genuine discernment.`,
      negative: `Applying inherited calm to every contradiction, without discernment, can mean quietly holding tensions that actually needed real change instead.`,
    },

    // ── 15 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '15_G': {
      heading: `You Inherited an Unspoken Rule About What a Woman Is Allowed to Want`,
      why: `Women in your mother's line likely carried real desire or material want that went largely unvoiced, modeling restraint around wanting rather than open acknowledgment of it. The Devil sits in your Maternal Spiritual corner, marking this generational transmission of unspoken constraint. You inherited this as felt limitation: a sense of what's allowed to be wanted, absorbed without ever being explicitly taught.`,
      shadow: `The trap is inheriting the restraint without examining it — carrying an unspoken sense that wanting too openly is somehow inappropriate, which can leave your own genuine desires feeling like something to hide or minimize. If you struggle to name what you actually want, that's often an inherited, unspoken limitation still running.`,
      path: `Try naming a genuine want out loud, plainly, without the inherited hedge. This isn't a betrayal of your mother's line — it's completing a permission that may have been waiting for a generation to actually claim it.`,
      positive: `You've named genuine desires plainly, claiming a permission to want openly that your mother's line may not have had access to.`,
      negative: `An inherited, unspoken restraint around desire keeps genuine wants feeling like something to hide or minimize, a limitation absorbed rather than chosen.`,
    },

    // ── 16 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '16_G': {
      heading: `You Inherited an Upheaval That Was Never Spoken About Afterward`,
      why: `Something in your mother's line likely underwent a real spiritual or emotional collapse that was survived but never discussed, its aftershock passed down as atmosphere rather than story. The Tower sits in your Maternal Spiritual corner, marking this generational transmission of unprocessed rupture. You inherited this as unnamed residue: real capacity for clarity that arrived tangled with an inherited, silent upheaval.`,
      shadow: `The trap is inheriting the aftershock without the story — a diffuse unease around sudden change that doesn't connect to anything in your own actual life. If you feel disproportionate dread around instability, that's often an inherited rupture still circling, waiting for its story to be told.`,
      path: `Try asking, even if only of yourself, what might have happened in your mother's line that was never spoken about. Naming what you can, even speculatively, helps the inheritance finally settle.`,
      positive: `You've named or investigated an inherited, unspoken rupture, letting its story settle instead of continuing to circle as unnamed residue.`,
      negative: `An unprocessed, unspoken maternal rupture keeps generating disproportionate dread around instability, its original story never actually given words.`,
    },

    // ── 17 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '17_G': {
      heading: `You Inherited a Belief That Spiritual Hope Has to Be Kept Modest`,
      why: `Women in your mother's line likely carried real optimism kept close, quietly, rather than fully expressed, perhaps to protect against disappointment. The Star sits in your Maternal Spiritual corner, marking this generational transmission of guarded hope. You inherited this as felt caution: renewal transmitted alongside a hedge against hoping too visibly.`,
      shadow: `The trap is inheriting the caution without questioning it — carrying real hope but an unexamined restraint around expressing it fully. If you find yourself hedging every hope with a disclaimer, that's often the maternal line's dimmed light still running.`,
      path: `Try letting one hope be fully, visibly held, without the inherited hedge. This completes work your mother's line may not have finished — separating quiet wisdom from muted expectation.`,
      positive: `You've let hope be fully and visibly held, without the inherited hedge, completing a transmission of light your mother's line kept modest.`,
      negative: `An inherited caution against visible hope keeps genuine optimism hedged and dimmed, protecting against a disappointment that was never actually guaranteed.`,
    },

    // ── 18 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '18_G': {
      heading: `You Inherited an Emotional Depth That Was Never Fully Explained`,
      why: `Women in your mother's line likely carried a rich, sometimes overwhelming inner world, felt more than discussed, modeled through mood and atmosphere rather than explanation. The Moon sits in your Maternal Spiritual corner, marking this generational transmission of deep emotional and intuitive life. You inherited this as felt inheritance: sensitivity transmitted through emotional proximity, not instruction.`,
      shadow: `The trap is inheriting the depth without a way to process it, absorbing emotional atmosphere that was never actually named, which can leave you carrying feelings that aren't clearly your own. If your emotional world feels sometimes inexplicably heavy, that's often inherited, unprocessed feeling circulating without a name.`,
      path: `Try distinguishing your own feelings from what you may have absorbed. Naming and sorting what's genuinely yours from what was simply present around you as a child is real, valuable work here.`,
      positive: `You've learned to distinguish your own feelings from inherited emotional atmosphere, sorting what's genuinely yours from what you simply absorbed.`,
      negative: `Unprocessed, inherited emotional depth that's never sorted can leave you carrying heaviness that was never clearly named or actually your own.`,
    },

    // ── 19 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '19_G': {
      heading: `You Inherited a Warmth That Was Simply How She Showed Up`,
      why: `Women in your mother's line likely radiated real vitality and joy simply through how they showed up, without needing to explain or perform it. The Sun sits in your Maternal Spiritual corner, marking this generational transmission of genuine warmth. You inherited this as felt permission: joy transmitted through presence, modeled as simply available rather than earned.`,
      shadow: `The trap is inheriting the warmth without recognizing it as something you're allowed to also embody fully, staying in its glow rather than becoming a source of it yourself. If you feel like joy is something you receive rather than generate, that's often maternal radiance that was witnessed but not yet claimed as your own.`,
      path: `Try letting your own warmth be a source, not just a reflection of hers. The permission to radiate was always meant to be passed on, not just observed.`,
      positive: `You've claimed inherited warmth as your own source of radiance, rather than only ever standing in the glow of someone else's.`,
      negative: `Staying only in the glow of an inherited warmth, without claiming it as your own source, keeps genuine joy feeling like something received rather than generated.`,
    },

    // ── 20 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '20_G': {
      heading: `You Inherited a Summons That Was Sensed but Never Spoken Aloud`,
      why: `Women in your mother's line likely sensed a pull toward something larger than their circumstances allowed, a summons felt but rarely voiced or acted on fully. Judgement sits in your Maternal Spiritual corner, marking this generational transmission of a quiet, unspoken calling. You inherited this as felt momentum: an awakening passed down along with its own quiet postponement.`,
      shadow: `The trap is inheriting the sensing without the answering — feeling a persistent, wordless pull toward something more, without ever quite naming what it is or moving toward it. If you keep sensing a bigger calling you can't quite articulate, that's often an inherited summons still waiting for someone to actually name and answer it.`,
      path: `Try naming the pull as specifically as you can, even if it feels presumptuous. Voicing it is what starts turning inherited sensing into something you can actually act on.`,
      positive: `You've named an inherited, wordless calling specifically enough to actually act on it, turning quiet sensing into real movement.`,
      negative: `An inherited pull toward something larger, never named or voiced, stays a wordless sensation instead of ever becoming something you can actually answer.`,
    },

    // ── 21 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '21_G': {
      heading: `You Inherited a Sense of Enoughness That Was Never Loudly Declared`,
      why: `Women in your mother's line likely carried a real, settled sense of being enough, demonstrated through simply living without constant striving rather than declared outright. The World sits in your Maternal Spiritual corner, marking this generational transmission of quiet wholeness. You inherited this as felt permission: completeness modeled through presence, not proclaimed through achievement.`,
      shadow: `The trap is inheriting the sense of enoughness without recognizing it as something to actively claim, waiting for it to simply arrive the way it seemed to for the women before you, rather than actively cultivating it in your own different circumstances. If wholeness feels like something you're still waiting for, that's often an inherited state that needs conscious claiming, not just patience.`,
      path: `Try actively naming your own sense of "enough" rather than waiting for it to simply arrive the way it seemed to for the women who came before you. What was quietly embodied for them may need to be consciously claimed by you.`,
      positive: `You actively claim your own sense of wholeness rather than passively waiting for it, consciously embodying what was quietly modeled before you.`,
      negative: `Waiting for a sense of enoughness to simply arrive, rather than actively claiming it, leaves genuine wholeness feeling perpetually out of reach.`,
    },

    // ── 22 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '22_G': {
      heading: `You Inherited a Quiet Willingness to Start Over Without Complaint`,
      why: `Women in your mother's line likely faced real fresh starts, sometimes forced ones, with a kind of unspoken trust that beginning again was simply possible. The Fool sits in your Maternal Spiritual corner, marking this generational transmission of quiet resilience through new beginnings. You inherited this as embodied openness: the sense that starting over doesn't require fanfare or permission, just willingness.`,
      shadow: `The trap is inheriting the willingness without ever examining whether each fresh start was actually chosen or simply endured, absorbing a pattern of quiet restarting that may mask unprocessed grief about what was left behind each time. If your own fresh starts feel oddly hollow, that's often inherited resilience without its accompanying acknowledgment of loss.`,
      path: `Try letting yourself actually grieve what a fresh start requires leaving behind, rather than just quietly moving forward the way you watched. Real openness includes acknowledgment, not just forward motion.`,
      positive: `You let yourself acknowledge and grieve what a fresh start requires leaving behind, deepening an inherited resilience instead of just quietly repeating it.`,
      negative: `Quietly restarting without ever acknowledging what's being left behind repeats an inherited pattern that may be masking real, unprocessed loss.`,
    },

    // ── 21 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '21_H': {
      heading: `You Come From a Line That Kept Almost Finishing`,
      why: `The material legacy from your father's line — how to build, provide, and arrive at a durable, complete result — was oriented toward genuine mastery, not just survival. The World sits in your Paternal Material corner, and it points to a paternal lineage working, at some level, toward full arrival: a finished house, a business brought to maturity, a life's work rounded into something whole. Whether or not anyone in that line actually reached full completion, the orientation itself — build toward whole, not partial — is what arrived in you materially through your father's side.`,
      shadow: `The risk is an inherited material perfectionism: the sense that nothing truly counts as built until it's completely, unquestionably finished, which can make you reluctant to claim real progress that just isn't total yet. This can also show up as a generational pattern of almost-arrivals — a father's line where the business nearly succeeded, the property was nearly paid off, the plan nearly reached its full form, again and again, one generation handing the nearly-there quality to the next along with the unfinished project itself. A financial life that keeps feeling permanently one stage short of secure is often this inherited orientation toward totality, still waiting for someone in the line to actually let a cycle complete.`,
      path: `Try being the one who actually closes a cycle your paternal line kept almost-closing. Let material progress count as real before it's total — recognize a milestone as an actual arrival rather than a waypoint to some further, always-receding finish line. You inherited the orientation toward mastery. The specific gift you can offer your line now is completion itself — permission to say a stage of building is genuinely, currently done.`,
      positive: `You bring real material projects to genuine completion rather than permanent near-arrival — closing cycles your father's line kept almost-closing, and letting milestones count as real before they're total.`,
      negative: `An inherited material perfectionism keeps everything one stage short of finished — the family pattern of the nearly-there business, the nearly-paid-off property, repeating because completion itself was never modeled as achievable.`,
    },

    // ── 1 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '1_H': {
      heading: `You Inherited a Belief That You Should Be Able to Build Something From Nothing`,
      why: `Your father's line likely modeled real material initiative, an ability to generate opportunity or income through sheer will and resourcefulness. The Magician sits in your Paternal Material corner, marking this generational instruction about resourcefulness. You inherited raw material here: genuine capacity to build from scratch, passed down as an assumed baseline rather than a taught skill.`,
      shadow: `The trap is inheriting the expectation of resourcefulness without permission to ever need help — a belief that real material capability means never starting from anything but your own bare hands. If asking for material support feels like a personal failure, that's often an inherited standard about self-generated success still running unexamined.`,
      path: `Try separating the genuine gift for resourcefulness from an inherited shame around needing support. Building from nothing is a real skill — it doesn't have to mean building entirely alone.`,
      positive: `You've kept the real gift for resourceful building while releasing an inherited shame around needing material support, building both independently and collaboratively.`,
      negative: `An inherited belief that real capability means never needing help keeps material support feeling like failure, isolating a genuine gift for resourcefulness.`,
    },

    // ── 2 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '2_H': {
      heading: `You Inherited a Belief That Real Material Decisions Are Made Quietly, Alone`,
      why: `Your father's line likely made significant financial or practical decisions internally, without much outward deliberation or consultation. The High Priestess sits in your Paternal Material corner, marking this generational instruction about private material discernment. You inherited raw material here: real intuitive capacity for material judgment, passed down alongside an assumption that such decisions aren't discussed openly.`,
      shadow: `The trap is inheriting the privacy without examining whether it actually serves you — making major material decisions in isolation, even when input or transparency would genuinely help, because that's the model you watched. If your material choices keep surprising the people close to you, that's often an inherited pattern of quiet, undiscussed decision-making.`,
      path: `Try bringing a material decision into the open before finalizing it, even partially. This isn't a rejection of your own discernment — it's testing whether the privacy was actually necessary or simply inherited habit.`,
      positive: `You bring major material decisions into open conversation rather than making them entirely in private, testing an inherited habit rather than automatically repeating it.`,
      negative: `Making significant material decisions in total isolation, out of inherited habit, keeps the people close to you repeatedly surprised by choices they had no part in.`,
    },

    // ── 3 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '3_H': {
      heading: `You Inherited a Belief That Providing Generously Is How You Show Care`,
      why: `Your father's line likely equated genuine care with material provision, giving generously as the primary language of love. The Empress sits in your Paternal Material corner, marking this generational instruction about material generosity. You inherited raw material here: real capacity for material abundance and generosity, passed down alongside an assumption that giving is the main way care gets shown.`,
      shadow: `The trap is inheriting the equation between giving and love so completely that receiving, or expressing care in other ways, feels foreign or insufficient. If you find it hard to accept material help, or to express care without giving something material, that's often an inherited pattern worth examining.`,
      path: `Try letting care be expressed and received in ways beyond material giving. Your generosity is a real gift — it doesn't have to be the only language available to you.`,
      positive: `You express and receive care in multiple ways, not just material giving, broadening an inherited generosity rather than being limited by it as the only language of love.`,
      negative: `Equating care exclusively with material giving, inherited without examination, makes receiving help or expressing care non-materially feel foreign or insufficient.`,
    },

    // ── 4 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '4_H': {
      heading: `You Inherited a Very Specific Idea of What a Provider Is Supposed to Look Like`,
      why: `Your father's line likely modeled a very specific structure for what responsible providing looks like: a particular career shape, a particular relationship to control over resources. The Emperor sits in your Paternal Material corner, marking this generational instruction about material authority and provision. You inherited raw material here: real capacity for material leadership, passed down alongside a fairly rigid template for what that's supposed to look like.`,
      shadow: `The trap is inheriting the specific template without examining whether it actually fits your circumstances — measuring your own material life against a structure built for a different era or different person, and feeling like you're failing a standard that was never actually yours to meet. If you feel chronically behind on an inherited timeline, that template may need updating.`,
      path: `Try building your own definition of responsible providing, informed by but not identical to your father's line's template. What worked in a different context may need real adaptation now.`,
      positive: `You've built your own definition of responsible material providing, adapted from but not identical to an inherited template built for different circumstances.`,
      negative: `Measuring your material life against a rigid, inherited template built for a different context leaves you feeling chronically behind a standard that was never actually meant for your circumstances.`,
    },

    // ── 5 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '5_H': {
      heading: `You Inherited a Specific Set of Rules About How Money and Work Are Supposed to Go`,
      why: `Your father's line likely passed down specific, concrete rules about work and money: what a stable career looks like, what counts as responsible spending, which paths are trustworthy. The Hierophant sits in your Paternal Material corner, marking this generational instruction about proven material methods. You inherited raw material here in its most literal form: an actual, specific rulebook about material life.`,
      shadow: `The trap is following the specific rules without checking whether the conditions that made them true still apply. Economic and professional landscapes change; a rule that protected your father's line in their era might genuinely not serve you in yours. If following the inherited rules feels like it's not working despite real discipline, the rulebook may need updating, not just more devoted application.`,
      path: `Try treating the inherited material rules as a starting point for investigation, not a fixed law. Test each one against your actual current circumstances, and keep what genuinely still holds.`,
      positive: `You've tested inherited material rules against your actual circumstances, keeping what genuinely holds and updating what no longer fits a changed landscape.`,
      negative: `Following an inherited material rulebook without checking whether its underlying conditions still apply keeps discipline from translating into results in a genuinely different landscape.`,
    },

    // ── 6 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '6_H': {
      heading: `You Inherited a Belief About What Kind of Work Is Actually Worth Doing`,
      why: `Your father's line likely held clear convictions about which kinds of work or material pursuits were genuinely worthwhile versus merely lucrative. The Lovers sit in your Paternal Material corner, marking this generational instruction about values in material choices. You inherited raw material here: real capacity for values-driven material decisions, passed down alongside a specific, inherited definition of "worthwhile."`,
      shadow: `The trap is inheriting the definition without examining whether it fits your own actual values, potentially rejecting genuinely good material opportunities because they don't match an inherited category of "worthy work." If you keep passing on opportunities that would serve you, out of an unexamined values filter, that filter may need re-checking.`,
      path: `Try examining your inherited definition of worthwhile work against what you actually value now. Some of it may hold up genuinely; some may just be inherited categorization.`,
      positive: `You've examined and updated an inherited definition of "worthwhile work" to match your own actual values, rather than rejecting good opportunities on an unexamined filter.`,
      negative: `An unexamined, inherited definition of worthy work can filter out genuinely good material opportunities simply because they don't match a category you never actually chose.`,
    },

    // ── 7 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '7_H': {
      heading: `You Inherited a Belief That Real Material Success Requires Constant Forward Push`,
      why: `Your father's line likely modeled relentless forward motion toward material goals, real willpower applied to work and provision. The Chariot sits in your Paternal Material corner, marking this generational instruction about disciplined material pursuit. You inherited raw material here: genuine capacity for material discipline, passed down alongside an assumption that stopping or resting is a kind of material failure.`,
      shadow: `The trap is inheriting the drive without permission to ever actually arrive or rest — a belief that material worth is proven through continuous motion, making stillness or contentment feel like giving up. If you feel unable to enjoy material success once it arrives, that's often the paternal line's unexamined momentum still running.`,
      path: `Try letting a material win actually be enjoyed, fully, before pushing toward the next goal. Real discipline includes knowing when to pause — that's not the opposite of the gift, it's what makes the gift sustainable.`,
      positive: `You let yourself actually enjoy material wins before pushing toward the next goal, making an inherited discipline sustainable rather than endlessly driven.`,
      negative: `An inherited belief that material worth requires constant forward motion keeps success feeling unenjoyable, discipline running without ever actually landing anywhere.`,
    },

    // ── 8 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '8_H': {
      heading: `You Inherited a Very Specific Standard for What Counts as Honest Material Dealing`,
      why: `Your father's line likely held firm, specific beliefs about ethical work and honest dealing, a standard passed down as the correct way to handle money and resources. Justice sits in your Paternal Material corner, marking this generational instruction about material fairness. You inherited raw material here: real material integrity, alongside a specific, inherited version of what "fair" actually means.`,
      shadow: `The trap is applying the inherited standard so rigidly that ordinary material negotiation feels like a moral compromise, making you either overly rigid in deals or quietly resentful of anyone who negotiates more flexibly than your father's line modeled. If material fairness feels like a constant, exhausting vigilance, the standard may be stricter than actually necessary.`,
      path: `Try examining your inherited material fairness standard and checking whether its strictness genuinely reflects your own values, or simply an inherited, unexamined rule.`,
      positive: `You've examined an inherited standard of material fairness and adjusted its strictness to actually reflect your own values, rather than applying it rigidly by default.`,
      negative: `An unexamined, overly strict inherited standard of material fairness turns ordinary negotiation into exhausting moral vigilance.`,
    },

    // ── 9 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ────────────
    '9_H': {
      heading: `You Inherited a Belief That Real Material Security Means Handling It Alone`,
      why: `Your father's line likely modeled handling financial and practical matters independently, without much outward reliance on others. The Hermit sits in your Paternal Material corner, marking this generational instruction about material self-reliance. You inherited raw material here: real capacity for material self-sufficiency, passed down alongside an assumption that needing material help signals some kind of failure.`,
      shadow: `The trap is inheriting the self-reliance without permission to ever actually receive material support, even when it's genuinely available and would help. If asking for practical or financial help feels deeply uncomfortable regardless of how reasonable the need is, that's often the paternal line's inherited isolation.`,
      path: `Try accepting one piece of material help, deliberately, even when you could technically handle it alone. Self-sufficiency is a real strength — it doesn't have to mean permanent isolation.`,
      positive: `You've let yourself accept genuine material help when it's available, keeping real self-sufficiency without the inherited isolation that made asking feel like failure.`,
      negative: `An inherited belief that material security must be handled entirely alone keeps genuine, available help feeling uncomfortable to accept regardless of actual need.`,
    },

    // ── 10 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '10_H': {
      heading: `You Inherited a Belief About How Much Control You Actually Have Over Money`,
      why: `Your father's line likely held a specific belief about how much genuine control a person has over their financial circumstances, whether trusting active effort or leaning toward material fatalism. The Wheel of Fortune sits in your Paternal Material corner, marking this generational instruction about material fate. You inherited raw material here: a real relationship to material timing, alongside an inherited answer to a question worth re-examining.`,
      shadow: `The trap is inheriting either the fatalism or the excessive need for control without checking which actually fits your own experience. If you find yourself either passively accepting financial setbacks as inevitable or gripping too tightly to control every material variable, that's often an inherited belief still running.`,
      path: `Try examining your own actual, lived relationship to material timing and effort, separate from what your father's line assumed. Update what doesn't match your real experience.`,
      positive: `You've examined and updated an inherited belief about material fate to match your own lived experience, neither passively fatalistic nor gripping for control by default.`,
      negative: `An unexamined inheritance of material fatalism or excessive control keeps you running an inherited answer instead of your own tested relationship to financial timing.`,
    },

    // ── 11 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '11_H': {
      heading: `You Inherited a Belief That Real Providers Never Show the Strain`,
      why: `Your father's line likely modeled providing through real hardship without visibly cracking, quiet fortitude as the expected response to financial pressure. Strength sits in your Paternal Material corner, marking this generational instruction about material endurance. You inherited raw material here: genuine capacity for material resilience, passed down alongside an assumption that struggle should stay hidden.`,
      shadow: `The trap is inheriting the suppression along with the endurance — carrying real financial stress silently because visible strain feels like a failure of the provider role. If you hide material difficulty even from people who could genuinely help, that's often the paternal line's inherited stoicism.`,
      path: `Try letting real financial strain be visible to someone you trust, before it becomes a crisis. This completes work your father's line may not have finished — separating genuine strength from an inherited requirement to look unshaken.`,
      positive: `You let real financial strain be visible before it becomes a crisis, separating genuine strength from an inherited requirement to always look unshaken.`,
      negative: `An inherited belief that providers must never show strain keeps real financial difficulty hidden even from people who could genuinely help.`,
    },

    // ── 12 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '12_H': {
      heading: `You Inherited a Willingness to Wait Longer Than Most People for the Right Material Move`,
      why: `Your father's line likely modeled a willingness to hold off on conventional material moves, trusting a different timing than the expected path. The Hanged Man sits in your Paternal Material corner, marking this generational instruction about material patience. You inherited raw material here: real capacity for material patience, passed down alongside a caution about whether that patience always resolved into actual action.`,
      shadow: `The trap is inheriting the waiting without its resolution — staying suspended in "not yet" regarding a material decision indefinitely, because that's the pattern you watched, without a clear model for when patience should convert into action. If your finances feel perpetually paused, the inherited patience may need a deadline.`,
      path: `Try letting your material patience have an actual endpoint. The unconventional timing sense is a real gift — pairing it with an eventual, deliberate move is what makes it useful rather than just cautious.`,
      positive: `You pair inherited material patience with a deliberate, eventual action, turning genuine timing sense into real movement instead of permanent suspension.`,
      negative: `Inheriting only the waiting half of material patience, without ever converting it into action, leaves financial decisions perpetually paused.`,
    },

    // ── 13 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '13_H': {
      heading: `You Inherited a Belief About Whether It's Ever Really Safe to Start the Material Life Over`,
      why: `Your father's line either modeled genuine willingness to release an outdated career or financial strategy for a better one, or clung hard to material identities well past their natural end. Transformation sits in your Paternal Material corner, marking this generational instruction about material reinvention. You inherited raw material here: a real relationship to material change, alongside whichever version of that pattern was actually modeled.`,
      shadow: `The trap is inheriting resistance to material reinvention without examining it — staying in a financially outdated role or strategy because your father's line modeled endurance over release, even when release would genuinely serve you better now. If your material life feels stuck despite real effort, an old ending may be overdue.`,
      path: `Try letting one outdated material identity or strategy actually end, deliberately, rather than maintaining it out of inherited loyalty to endurance. The reinvention happens in the release.`,
      positive: `You've let an outdated material identity or strategy end deliberately, rather than maintaining it out of inherited loyalty to endurance alone.`,
      negative: `An inherited resistance to material reinvention keeps outdated strategies maintained past their natural end, out of loyalty to a pattern of endurance rather than genuine fit.`,
    },

    // ── 14 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '14_H': {
      heading: `You Inherited a Belief That Material Life Should Stay Carefully Moderate`,
      why: `Your father's line likely modeled careful moderation in work and money, avoiding material extremes in either direction. Temperance sits in your Paternal Material corner, marking this generational instruction about material balance. You inherited raw material here: real capacity for sustainable material balance, passed down alongside a caution against ever taking a bigger material risk.`,
      shadow: `The trap is inheriting the moderation so completely that genuine, worthwhile material risk feels off-limits, even when the potential reward would justify it. If you find yourself passing on real opportunities because they feel "too much," that's often inherited caution standing in for actual judgment.`,
      path: `Try letting one calculated, worthwhile material risk through the inherited caution. Real balance includes knowing when moderation itself has become the more limiting choice.`,
      positive: `You let calculated, worthwhile material risks through an inherited caution when they're genuinely justified, rather than defaulting to moderation regardless of opportunity.`,
      negative: `Inherited caution against any material risk, mistaken for balance, can filter out genuinely worthwhile opportunities simply because they feel "too much."`,
    },

    // ── 15 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '15_H': {
      heading: `You Inherited a Complicated Relationship to Who Gets to Hold the Power in Material Matters`,
      why: `Your father's line likely held real, sometimes uncomfortable dynamics around control, money, and leverage, whether wielding it heavily or being subject to someone else wielding it over them. The Devil sits in your Paternal Material corner, marking this generational instruction about material power. You inherited raw material here: a real, honest understanding of material power, alongside whatever specific dynamic was actually modeled.`,
      shadow: `The trap is repeating the inherited dynamic without examining it — either gripping control over material resources the way it was modeled, or unconsciously accepting being controlled the same way. If your material relationships keep echoing an old power imbalance, that pattern may need direct examination rather than automatic repetition.`,
      path: `Try naming the specific material power dynamic you inherited, and consciously deciding whether it's actually serving your current relationships or simply repeating an old pattern.`,
      positive: `You've named and consciously updated an inherited material power dynamic, choosing your own relationship to control and leverage rather than repeating an old pattern automatically.`,
      negative: `Repeating an inherited material power dynamic without examination — gripping control or unconsciously accepting it — echoes an old imbalance in your current relationships.`,
    },

    // ── 16 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '16_H': {
      heading: `You Inherited a Material Collapse That Was Never Fully Talked Through`,
      why: `Your father's line likely underwent a genuine financial or practical collapse that was survived but never fully processed, its aftershock passed down instead of its resolution. The Tower sits in your Paternal Material corner, marking this generational instruction shaped by real material rupture. You inherited raw material here: real capacity for material clarity, tangled with an unfinished upheaval.`,
      shadow: `The trap is inheriting the instability without ever processing the original collapse — a disproportionate financial anxiety whose source predates your own circumstances. If you feel a vague dread around money that doesn't match your actual situation, that's often an inherited rupture still looking for its resolution.`,
      path: `Try naming the collapse, even speculatively — what happened materially in your father's line that was never fully discussed, and what clarity should have followed. Giving it words can finish what was left incomplete.`,
      positive: `You've named and processed an inherited, unfinished material collapse, letting its clarity actually land instead of leaving the rupture unresolved.`,
      negative: `An unprocessed, inherited material collapse leaves a disproportionate financial anxiety that doesn't match your actual current circumstances, its original rupture never given words.`,
    },

    // ── 17 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '17_H': {
      heading: `You Inherited a Belief That Material Hope Should Stay Modest`,
      why: `Your father's line likely held modest, guarded material ambitions, hoping for security rather than fully allowing themselves to hope for abundance. The Star sits in your Paternal Material corner, marking this generational instruction about material hope. You inherited raw material here: real capacity for genuine material renewal and hope, passed down alongside an inherited ceiling on how big that hope was allowed to be.`,
      shadow: `The trap is inheriting the modest ceiling without questioning it — capping your own material aspirations at what felt safe for your father's line, even when your actual circumstances could support more. If you notice yourself downgrading real material dreams before you've even tested them, that's often an inherited caution against hoping too visibly.`,
      path: `Try letting one material hope be fully-sized, without the inherited discount. This completes work your father's line may not have finished — separating caution from an actual ceiling on what's possible.`,
      positive: `You've let a material hope be fully-sized rather than pre-emptively discounted, completing a permission your father's line's caution never fully extended.`,
      negative: `An inherited ceiling on material hope keeps genuine aspirations pre-emptively downgraded, capped at what felt safe for a previous generation's circumstances.`,
    },

    // ── 18 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '18_H': {
      heading: `You Inherited a Financial Fear That Was Never Given a Name`,
      why: `Your father's line likely carried real financial anxiety that was never directly named or discussed, passed down as vague unease rather than a specific, addressable concern. The Moon sits in your Paternal Material corner, marking this generational instruction shaped by unprocessed material fear. You inherited raw material here: real material sensitivity, tangled with an inherited, unnamed dread.`,
      shadow: `The trap is inheriting the fog without the clarity — carrying diffuse financial anxiety that doesn't attach to your actual current circumstances. If money worry surfaces disproportionately to your real situation, that's often an inherited fear still circling, waiting for its name.`,
      path: `Try tracing the anxiety back as far as you can, even speculatively. What might your father's line have actually feared financially that never got said aloud? Naming it, even provisionally, can finally give it somewhere to land.`,
      positive: `You've traced and named an inherited, unspoken financial fear, giving it somewhere to land instead of letting it circle as vague, disproportionate anxiety.`,
      negative: `An inherited, never-named financial fear keeps generating anxiety disproportionate to your actual circumstances, circling without ever being resolved.`,
    },

    // ── 19 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '19_H': {
      heading: `You Inherited a Belief That Money Is Too Serious a Matter for Real Joy`,
      why: `Your father's line likely treated financial and practical matters as weighty, effortful business, with genuine ease or delight around money treated as somehow inappropriate. The Sun sits in your Paternal Material corner, marking this generational instruction about material seriousness. You inherited raw material here: real capacity for a joyful, light relationship to material life, passed down alongside an inherited assumption that money has to be handled gravely.`,
      shadow: `The trap is inheriting the heaviness without questioning it — approaching your own material life with more grim seriousness than it actually requires, because that's the tone modeled before you. If financial conversations always feel weighty regardless of the actual stakes, that's often inherited gravity standing in for genuine caution.`,
      path: `Try letting a material decision be made with genuine lightness sometimes, without needing to justify the ease with extra gravity. This completes work your father's line may not have finished.`,
      positive: `You've let genuine lightness into material decisions, proving money matters can be handled with ease and still be handled well.`,
      negative: `An inherited belief that material seriousness is always required keeps financial life feeling weighty regardless of actual stakes, muting a genuine capacity for ease.`,
    },

    // ── 20 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '20_H': {
      heading: `You Inherited a Material Potential Your Father's Line Never Fully Claimed`,
      why: `Your father's line likely sensed a bigger financial or professional possibility and, for whatever reason, didn't fully pursue it. Judgement sits in your Paternal Material corner, marking this generational instruction shaped by unclaimed material potential. You inherited raw material here: real capacity to answer that call, passed down alongside the fact that it was once left unaddressed.`,
      shadow: `The trap is inheriting the postponement itself — sensing your own bigger material potential and, without quite knowing why, hesitating the same way, as though delay were simply the family pattern. If you keep almost-pursuing a material opportunity without ever fully committing, that's often unfinished paternal work.`,
      path: `Try answering the material call your own way, even if your father's line never did. You're not obligated to repeat the postponement — you're free to be the one who actually claims it.`,
      positive: `You've claimed a material potential your father's line left unaddressed, becoming the one in the line who actually pursued what was once set aside.`,
      negative: `An inherited pattern of postponing material potential keeps you almost-pursuing opportunities without ever fully committing, repeating an unfinished paternal pattern.`,
    },

    // ── 22 in PATERNAL MATERIAL (Ancestral Square, Age-50 anchor) ───────────
    '22_H': {
      heading: `You Inherited a Very Specific Idea of How Much Material Risk Is Actually Safe`,
      why: `Your father's line likely held a specific comfort level with financial or practical risk-taking, whether cautious or bold, that got passed down as the assumed baseline. The Fool sits in your Paternal Material corner, marking this generational instruction about material risk. You inherited raw material here: a real relationship to material trust and risk, alongside an inherited calibration of what counts as "too much."`,
      shadow: `The trap is inheriting the calibration without examining whether it fits your own actual circumstances — staying more cautious (or more reckless) than your current situation actually calls for, simply because that's the baseline you absorbed. If your material choices feel mismatched to your real risk tolerance, that calibration may need resetting.`,
      path: `Try examining your inherited sense of acceptable material risk against your own actual circumstances and goals, and adjust deliberately rather than defaulting to the inherited setting.`,
      positive: `You've examined and adjusted an inherited calibration of material risk to actually fit your own circumstances, rather than defaulting to a baseline absorbed from before you.`,
      negative: `An inherited, unexamined calibration of acceptable material risk can leave your actual choices mismatched to your real circumstances and goals.`,
    },

    // ── 7 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '7_I': {
      heading: `You Learned to Steer, Never to Ask for a Hand`,
      why: `The practical, material navigation skill passed down through your mother's line was one of directed forward motion under difficult conditions — women who kept moving, kept the household or the finances or the family's practical survival on a chosen course, often without the luxury of stopping to ask whether the direction was actually sustainable. The Chariot sits in your Maternal Material corner, a real inheritance of resourcefulness and determination. What often comes bundled with it is an equally inherited belief that the only way to keep the material vehicle moving is to drive it entirely alone.`,
      shadow: `This can show up as a material life organized around solo endurance — inherited specifically from the maternal line's survival strategy, the assumption that asking for help, sharing the load, or admitting the current direction isn't working would be a kind of failure the women before you didn't allow themselves either. You might notice chronic overextension around money and logistics, a reflexive refusal of support even when it's genuinely offered, an exhausting sense that everything practical depends on you continuing to steer alone. A financial or logistical life that feels perpetually solo, even when people are actually available to help, is often this maternal navigation pattern still running on old terrain.`,
      path: `Try steering the vehicle your mother's line handed you while actually letting other hands touch the reins. This isn't a rejection of the pattern — you keep the real skill of directed, resourceful movement, but you update the belief that it requires total solitude. Practically: let one material task — a bill, a decision, a piece of the load — be shared instead of solely carried, and notice that the vehicle keeps moving anyway. The maternal line's resourcefulness was real. The solo-driving belief was circumstance, not law, and you're free to update it.`,
      positive: `You carry your mother's line's real material resourcefulness and directed determination, while letting genuine help actually reach you — the vehicle keeps moving because more than one set of hands is finally on the reins.`,
      negative: `An inherited belief that material survival must be steered entirely alone keeps you chronically overextended — support goes reflexively refused even when it's genuinely available, echoing a pattern that was once circumstance, not law.`,
    },

    // ── 1 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '1_I': {
      heading: `You Inherited a Knack for Making Something Real Out of Very Little`,
      why: `Women in your mother's line likely made real, tangible things happen with whatever was actually available, not waiting for ideal conditions. The Magician sits in your Maternal Material corner, marking this generational transmission of resourceful improvisation. You inherited this as embodied capability: a felt sense that you can generate material results from modest means, modeled through action rather than explanation.`,
      shadow: `The trap is inheriting the improvisation without permission to ever want more resources — a habit of making do so consistently that asking for adequate support feels like admitting failure. If you catch yourself stretching too thin rather than requesting what's actually needed, that's often inherited resourcefulness without its complementary permission to want enough.`,
      path: `Try asking for adequate resources before you're forced to improvise. The gift for making something from little is real — it doesn't have to mean refusing more when more is genuinely available.`,
      positive: `You keep the real gift for resourceful improvisation while also asking for adequate support when it's available, rather than stretching thin by inherited default.`,
      negative: `An inherited habit of making do with too little keeps you stretching thin instead of requesting what's actually needed, refusing more even when it's genuinely available.`,
    },

    // ── 2 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '2_I': {
      heading: `You Inherited a Practical Instinct That Runs Ahead of the Numbers`,
      why: `Women in your mother's line likely managed household or material affairs through a felt sense of what was needed, often ahead of any obvious sign. The High Priestess sits in your Maternal Material corner, marking this generational transmission of intuitive practical management. You inherited this as embodied instinct: practical foresight transmitted through watching, not being taught explicitly.`,
      shadow: `The trap is inheriting the instinct without ever voicing it, managing material matters quietly and alone because that's the model you watched, even when sharing the load or the reasoning would genuinely help. If people are surprised by decisions that felt obvious to you, that's often an inherited habit of silent practical management.`,
      path: `Try voicing your practical instinct before acting on it sometimes, letting people in on the reasoning rather than just the result. This doesn't diminish the gift — it makes it something others can actually learn from and support.`,
      positive: `You voice your practical instincts rather than acting on them silently, letting others understand and support decisions instead of just encountering the results.`,
      negative: `Managing material matters through silent instinct, without ever voicing the reasoning, leaves others repeatedly surprised by decisions that felt obvious only to you.`,
    },

    // ── 3 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '3_I': {
      heading: `You Inherited a Belief That Making Sure Everyone's Fed and Held Is Simply What You Do`,
      why: `Women in your mother's line likely made sure practical needs were met for everyone around them, often quietly and without acknowledgment, as an unquestioned part of daily life. The Empress sits in your Maternal Material corner, marking this generational transmission of material nurturing. You inherited this as embodied duty: material care transmitted through consistent action.`,
      shadow: `The trap is inheriting the duty without ever examining whether it's sustainable, providing for others' practical needs so automatically that your own go unnoticed even by you. If you're depleted from material caretaking that no one asked you to take on, that's often an inherited pattern of automatic provision.`,
      path: `Try letting your own material needs be as visible and tended-to as everyone else's. The gift for practical nurturing is real — it holds up better when it includes you.`,
      positive: `You tend to your own material needs as consistently as you tend to others', making an inherited nurturing gift sustainable rather than automatically self-depleting.`,
      negative: `Automatically providing for everyone else's practical needs, without noticing your own, depletes an inherited gift that was never meant to exclude you.`,
    },

    // ── 4 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '4_I': {
      heading: `You Inherited the Job of Keeping Things Materially Organized, Without Ever Being Asked`,
      why: `Women in your mother's line likely held the practical organization of the household or family's material life together, a real authority exercised without formal recognition. The Emperor sits in your Maternal Material corner, marking this generational transmission of quiet material structure. You inherited this as embodied responsibility: structural competence transmitted through simply watching someone keep things running.`,
      shadow: `The trap is inheriting the responsibility without the recognition — carrying real material organizational weight that goes unacknowledged, including by you, because it was never framed as leadership. If you're doing significant practical management that no one, including you, credits as real authority, that's often an inherited pattern of invisible structural labor.`,
      path: `Try naming your material organizational role as the real authority it actually is, out loud, to yourself first. Invisible competence is still competence — it deserves to be seen.`,
      positive: `You've named your material organizational competence as the real authority it is, making invisible structural labor visible and credited.`,
      negative: `Carrying significant, unacknowledged material organizational weight, inherited as invisible duty, leaves real authority uncredited, including by the person holding it.`,
    },

    // ── 5 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '5_I': {
      heading: `You Inherited Practical Skills Nobody Ever Formally Taught You`,
      why: `Women in your mother's line likely passed down real, useful material skills through doing rather than teaching: how to stretch a budget, fix something, manage a household, absorbed by watching rather than instruction. The Hierophant sits in your Maternal Material corner, marking this generational transmission of informal practical wisdom. You inherited this as embedded competence: practical knowledge transmitted through proximity.`,
      shadow: `The trap is undervaluing skills that arrived this informally, treating them as "just common sense" rather than the real, valuable competence they actually are. If you dismiss your own practical capability because no one ever certified it, that's often an inherited pattern of undervaluing informally-transmitted skill.`,
      path: `Try naming your practical skills as real expertise, worth the same respect as anything formally credentialed. What you absorbed by watching is still genuine knowledge.`,
      positive: `You've named informally-inherited practical skills as real expertise, giving them the respect and recognition that formal credentials would have automatically granted.`,
      negative: `Dismissing genuinely valuable practical skills as "just common sense," simply because they arrived informally, leaves real competence undervalued and uncredited.`,
    },

    // ── 6 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '6_I': {
      heading: `You Inherited a Sense of What Actually Matters When Resources Are Limited`,
      why: `Women in your mother's line likely made real, values-based choices about where limited resources actually went, demonstrating priorities through allocation rather than declaration. The Lovers sit in your Maternal Material corner, marking this generational transmission of values-driven material priority. You inherited this by watching: a felt sense of what genuinely matters materially, transmitted through observed choice.`,
      shadow: `The trap is inheriting the priorities without ever examining whether they're actually yours, defaulting to the same material allocations because that's the pattern you watched, not because you've consciously chosen it. If your spending or resource choices feel automatic rather than examined, that's often inherited priority standing in for your own.`,
      path: `Try naming the material priorities you actually watched get modeled, and consciously deciding which ones you're keeping for yourself.`,
      positive: `You've named and consciously chosen your material priorities, rather than automatically repeating an inherited pattern of resource allocation.`,
      negative: `Defaulting to inherited material priorities without ever examining them keeps resource choices feeling automatic rather than genuinely, consciously chosen.`,
    },

    // ── 8 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '8_I': {
      heading: `You Inherited a Careful Sense of Fairness About Who Gets What`,
      why: `Women in your mother's line likely managed limited resources with a real, consistent sense of equitable distribution, making sure everyone got their genuine share even when there wasn't much to go around. Justice sits in your Maternal Material corner, marking this generational transmission of careful material fairness. You inherited this as embodied conviction: a felt commitment to material fairness, transmitted through consistent practice.`,
      shadow: `The trap is applying that careful fairness so rigidly to your own life that you undercount your own genuine needs, always making sure others get their share first even when resources genuinely allow for your own. If you consistently shortchange yourself in the name of fairness, that's often an inherited pattern that needs to include you too.`,
      path: `Try applying your genuine sense of material fairness to yourself as consistently as you apply it to others. You're included in the equation, not just its administrator.`,
      positive: `You apply your genuine sense of material fairness to yourself as consistently as to others, including yourself in the equation instead of just administering it.`,
      negative: `Applying material fairness rigidly to everyone but yourself, out of inherited habit, keeps your own genuine needs consistently shortchanged.`,
    },

    // ── 9 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '9_I': {
      heading: `You Inherited a Quiet Competence for Handling Material Life Alone`,
      why: `Women in your mother's line likely developed real, practical self-sufficiency, quietly handling material needs without much outside support because that was simply the reality they navigated. The Hermit sits in your Maternal Material corner, marking this generational transmission of self-reliant material competence. You inherited this as embodied capability: genuine practical independence, transmitted through demonstrated necessity.`,
      shadow: `The trap is inheriting the self-reliance as a permanent requirement rather than a circumstance-driven skill, refusing material help even when your actual circumstances no longer demand total independence. If you feel unable to accept practical support that's genuinely available, that's often an inherited necessity outliving its original conditions.`,
      path: `Try accepting practical material help when it's genuinely available, recognizing that the self-reliance was a real skill built by circumstance, not a permanent law about how material life has to go.`,
      positive: `You accept genuinely available material help, recognizing that inherited self-reliance was built by circumstance rather than being a permanent requirement.`,
      negative: `Refusing available material help out of inherited necessity, even when circumstances no longer demand total self-sufficiency, keeps you isolated in tasks that don't require it.`,
    },

    // ── 10 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '10_I': {
      heading: `You Inherited a Quiet Endurance for Material Life's Ups and Downs`,
      why: `Women in your mother's line likely weathered real financial or practical instability without being undone by it, adapting to each turn as it came. The Wheel of Fortune sits in your Maternal Material corner, marking this generational transmission of material resilience. You inherited this as embodied adaptability: a felt capacity to navigate material change, transmitted through watching someone actually survive it.`,
      shadow: `The trap is inheriting the adaptability without ever expecting genuine material stability, staying braced for the next downturn even during periods of real security. If you can't relax into material good fortune when it's genuinely present, that's often inherited vigilance outliving its necessity.`,
      path: `Try letting yourself actually trust a period of material stability while it's happening, rather than staying braced for its end. The adaptability is a real skill — it doesn't require constant anticipation of collapse to stay sharp.`,
      positive: `You let yourself trust genuine periods of material stability instead of staying perpetually braced, keeping real adaptability without constant anticipation of collapse.`,
      negative: `Staying braced for the next material downturn even during genuine stability keeps you unable to relax into good fortune when it's actually present.`,
    },

    // ── 11 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '11_I': {
      heading: `You Inherited a Softness That Somehow Never Actually Broke Under Material Strain`,
      why: `Women in your mother's line likely held real financial or practical hardship with a soft, embodied steadiness rather than hardened toughness, modeling resilience that never needed to look fierce. Strength sits in your Maternal Material corner, marking this generational transmission of gentle material endurance. You inherited this as felt permission: the sense that gentleness and material endurance aren't opposites.`,
      shadow: `The trap is inheriting the softness without recognizing its actual strength, mistaking your own gentle material resilience for fragility because it doesn't look like conventional toughness. If people underestimate your capacity to handle real material pressure, that's often maternal strength that was never named as strength.`,
      path: `Try naming your gentle material endurance as the real strength it is. It doesn't need to look hard to be genuinely unbreakable.`,
      positive: `You've named your gentle, embodied material endurance as real strength, letting others see resilience that doesn't need to look tough to actually be unbreakable.`,
      negative: `Failing to recognize gentle material resilience as genuine strength leaves real endurance underestimated, mistaken for fragility simply because it looks soft.`,
    },

    // ── 12 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '12_I': {
      heading: `You Inherited a Patience for Material Circumstances That Take Their Time to Change`,
      why: `Women in your mother's line likely endured real practical constraint with a kind of suspended waiting, trusting that circumstances would eventually shift even without a clear timeline. The Hanged Man sits in your Maternal Material corner, marking this generational transmission of material patience. You inherited this as embodied endurance: patience with material limitation, transmitted through watching someone wait it out.`,
      shadow: `The trap is inheriting the waiting without ever questioning whether action might actually be available now that wasn't available then — staying suspended in material limitation out of inherited habit rather than genuine current necessity. If your material circumstances feel stuck despite new options being available, the patience may have outlived its usefulness.`,
      path: `Try checking whether your current material situation actually still requires the waiting, or whether it's inherited habit. Circumstances change; the patience should be able to update with them.`,
      positive: `You've checked whether inherited material patience still fits your current situation, letting yourself act on new options rather than defaulting to old waiting.`,
      negative: `Inherited material patience applied out of habit, even when circumstances have genuinely changed, keeps you suspended in limitation that new options could have resolved.`,
    },

    // ── 13 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '13_I': {
      heading: `You Inherited a Real Capacity to Rebuild Materially From Almost Nothing`,
      why: `Women in your mother's line likely faced genuine material loss and found a way to reconstruct a practical life afterward, more than once if necessary. Transformation sits in your Maternal Material corner, marking this generational transmission of material rebuilding. You inherited this as embodied resilience: real capacity for material reinvention, transmitted through watching someone actually survive and rebuild.`,
      shadow: `The trap is inheriting the capacity for rebuilding without ever questioning why loss keeps happening in the first place, treating repeated material collapse as simply normal rather than something worth actively preventing. If your material life keeps requiring rebuilding rather than sustaining, that pattern deserves direct attention, not just more resilience.`,
      path: `Try applying some of your real rebuilding capacity toward prevention instead — securing what you've built, not just trusting your ability to reconstruct it later. Both skills matter.`,
      positive: `You apply real rebuilding capacity toward both reconstruction and prevention, securing what you've built instead of only ever trusting your ability to rebuild after loss.`,
      negative: `Treating repeated material collapse as normal, relying only on rebuilding capacity rather than addressing why the loss keeps recurring, leaves real prevention unaddressed.`,
    },

    // ── 14 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '14_I': {
      heading: `You Inherited a Real Skill for Making Limited Resources Actually Stretch`,
      why: `Women in your mother's line likely developed real skill at making limited material resources cover genuine needs, blending and stretching with patient, practical ingenuity. Temperance sits in your Maternal Material corner, marking this generational transmission of resourceful balance. You inherited this as embodied competence: material balance transmitted through watching someone actually make it work.`,
      shadow: `The trap is inheriting the stretching as a permanent necessity rather than a skill to be used when actually needed, staying in scarcity-mode financial habits even once your actual resources have genuinely grown. If you're still stretching resources that don't need stretching anymore, that pattern may need updating.`,
      path: `Try letting your actual current resources inform your material habits, rather than defaulting to inherited scarcity mode regardless of your real circumstances now.`,
      positive: `You let your actual current resources inform your material habits, rather than defaulting to inherited scarcity-stretching regardless of genuine circumstances now.`,
      negative: `Staying in scarcity-mode material habits inherited from real past necessity, even once resources have genuinely grown, keeps stretching what no longer needs to be stretched.`,
    },

    // ── 15 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '15_I': {
      heading: `You Inherited a Complicated Relationship to Material Dependence`,
      why: `Women in your mother's line likely navigated real dependence, whether financial reliance on someone else or being relied upon in ways that felt binding, without much room to fully examine the dynamic. The Devil sits in your Maternal Material corner, marking this generational transmission of material entanglement. You inherited this as felt familiarity: a real, complicated relationship to material dependence, whichever direction it ran.`,
      shadow: `The trap is repeating the inherited dynamic without examining it — either accepting material dependence you'd rather not have, or resisting genuinely helpful interdependence out of an inherited wariness. If your material relationships keep echoing an old bind, that pattern deserves direct examination.`,
      path: `Try naming the specific material dependence dynamic you inherited, and consciously deciding what healthy interdependence would actually look like for you now.`,
      positive: `You've named an inherited material dependence dynamic and consciously built your own healthier version of interdependence, rather than repeating the old bind.`,
      negative: `Repeating an inherited pattern of material dependence or resistance to it, without examination, echoes an old bind in your current material relationships.`,
    },

    // ── 16 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '16_I': {
      heading: `You Inherited a Material Loss That Was Survived but Never Fully Discussed`,
      why: `Women in your mother's line likely survived a real financial or practical collapse that reshaped their circumstances, its story passed down as atmosphere rather than narrative. The Tower sits in your Maternal Material corner, marking this generational transmission of unprocessed material rupture. You inherited this as unnamed residue: real material resilience tangled with an inherited, unspoken upheaval.`,
      shadow: `The trap is inheriting the aftershock without the story — carrying disproportionate anxiety around material stability that doesn't match your own current situation. If sudden financial change triggers outsized dread, that's often an inherited rupture still circling without its story fully told.`,
      path: `Try asking, even speculatively, what material collapse might have happened in your mother's line that was never fully discussed. Naming what you can helps the inheritance finally settle.`,
      positive: `You've named or investigated an inherited, unspoken material rupture, letting its story settle instead of continuing to generate disproportionate anxiety.`,
      negative: `An unprocessed, unspoken maternal material collapse keeps generating outsized dread around financial change that doesn't match your actual current circumstances.`,
    },

    // ── 17 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '17_I': {
      heading: `You Inherited a Quiet, Modest Hope That Things Would Materially Get Better`,
      why: `Women in your mother's line likely held real hope for practical improvement, expressed modestly rather than boldly, perhaps to protect against disappointment during genuinely hard circumstances. The Star sits in your Maternal Material corner, marking this generational transmission of guarded material hope. You inherited this as felt aspiration: material renewal transmitted alongside an inherited caution about hoping too visibly.`,
      shadow: `The trap is inheriting the modesty without questioning whether your own material hopes need to stay that small. If you catch yourself pre-emptively scaling down real material aspirations, that's often an inherited caution rather than an accurate read of what's actually possible for you.`,
      path: `Try letting a material hope be fully-sized, tested against your actual current circumstances rather than automatically scaled down. What was modest out of necessity for her may not need to be modest for you.`,
      positive: `You've let a material hope be fully-sized and tested against your actual circumstances, rather than automatically scaling it down out of inherited caution.`,
      negative: `An inherited habit of keeping material hope modest, regardless of actual current possibility, keeps genuine aspirations pre-emptively scaled down.`,
    },

    // ── 18 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '18_I': {
      heading: `You Inherited a Material Worry That Was Felt More Than It Was Ever Explained`,
      why: `Women in your mother's line likely carried real financial or practical worry that was felt intensely but rarely discussed directly, transmitted as atmosphere rather than explanation. The Moon sits in your Maternal Material corner, marking this generational transmission of unprocessed material anxiety. You inherited this as felt inheritance: material sensitivity tangled with an inherited, unnamed unease.`,
      shadow: `The trap is inheriting the worry without its actual cause, carrying diffuse material anxiety that doesn't clearly attach to your own current circumstances. If financial unease surfaces disproportionately to your real situation, that's often inherited worry still circling.`,
      path: `Try distinguishing your own material concerns from what you may have simply absorbed. Naming what's genuinely yours versus what was present around you growing up is real, valuable work.`,
      positive: `You've distinguished your own material concerns from inherited, absorbed anxiety, sorting what's genuinely yours from atmosphere that was simply present around you.`,
      negative: `Unprocessed, inherited material anxiety that's never sorted can generate financial unease disproportionate to your actual current circumstances.`,
    },

    // ── 19 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '19_I': {
      heading: `You Inherited a Warmth That Stayed Intact Even During Real Material Hardship`,
      why: `Women in your mother's line likely maintained real vitality and joy even through genuine material difficulty, modeling that hardship doesn't have to extinguish lightness. The Sun sits in your Maternal Material corner, marking this generational transmission of resilient warmth. You inherited this as felt permission: the sense that material struggle and real joy can coexist.`,
      shadow: `The trap is inheriting the warmth as a requirement to perform positivity even when material circumstances genuinely call for more direct acknowledgment of difficulty. If you find yourself staying determinedly upbeat about real financial strain instead of addressing it directly, that's often inherited warmth being used to mask rather than coexist with hardship.`,
      path: `Try letting your material difficulty be named directly sometimes, without the inherited requirement to stay visibly warm through it. Real resilience includes honest acknowledgment, not just maintained brightness.`,
      positive: `You let real material difficulty be named directly, pairing an inherited warmth with honest acknowledgment instead of using it to mask genuine hardship.`,
      negative: `An inherited requirement to stay warm and upbeat through material hardship can mask genuine difficulty that actually needs direct acknowledgment and action.`,
    },

    // ── 20 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '20_I': {
      heading: `You Inherited a Sense of Material Potential That Circumstances Never Let Her Pursue`,
      why: `Women in your mother's line likely sensed real practical or financial possibility that circumstances (time, resources, permission) never actually allowed them to pursue fully. Judgement sits in your Maternal Material corner, marking this generational transmission of unclaimed material potential. You inherited this as felt momentum: material capability passed down alongside its own historical postponement.`,
      shadow: `The trap is inheriting the postponement itself — sensing your own material potential and, without examining why, holding back the same way, as though delay were simply the pattern. If you keep almost-pursuing a material opportunity that circumstances would actually now support, that's often unfinished maternal work.`,
      path: `Try claiming the material potential your circumstances actually do allow, even if hers didn't. You're not obligated to repeat a postponement that was originally about circumstance, not capability.`,
      positive: `You've claimed material potential your circumstances now allow, becoming the one in the line who actually pursued what circumstance once prevented.`,
      negative: `An inherited pattern of postponing material potential, even when current circumstances would support pursuing it, keeps you repeating a delay that was originally about someone else's constraints.`,
    },

    // ── 21 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '21_I': {
      heading: `You Inherited a Quiet Sense That What You Have Can Actually Be Enough`,
      why: `Women in your mother's line likely found a real, settled sense of having enough, even within genuine practical constraint, modeling contentment as something achievable rather than dependent on abundance. The World sits in your Maternal Material corner, marking this generational transmission of material sufficiency. You inherited this as felt permission: material wholeness that doesn't require excess to be real.`,
      shadow: `The trap is inheriting the sufficiency as resignation rather than genuine contentment — settling for less than what's actually available now because "enough" was calibrated to circumstances that no longer apply. If you're satisfied with material conditions that could genuinely improve, that calibration may need updating.`,
      path: `Try checking whether your sense of "enough" reflects genuine contentment or an inherited ceiling that no longer fits your actual circumstances. Real sufficiency should be able to grow with genuine opportunity.`,
      positive: `You've checked and updated an inherited sense of material sufficiency to reflect genuine contentment rather than an outdated ceiling, letting it grow with real opportunity.`,
      negative: `An inherited sense of "enough," calibrated to past constraint, can become resignation that settles for less than what's genuinely available now.`,
    },

    // ── 22 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '22_I': {
      heading: `You Inherited a Willingness to Take a Real Practical Risk When It Mattered`,
      why: `Women in your mother's line likely took genuine practical chances when circumstances demanded it, moving somewhere new, trying something unproven, trusting that a fresh material start was survivable. The Fool sits in your Maternal Material corner, marking this generational transmission of material risk-taking. You inherited this as embodied courage: real material openness, transmitted through watching someone actually leap.`,
      shadow: `The trap is inheriting the courage without its accompanying discernment, taking material risks reactively the way circumstance once forced, rather than choosing them deliberately from a place of actual stability. If your material risks feel driven by old urgency rather than current, considered choice, that pattern is worth examining.`,
      path: `Try taking your next material risk from genuine choice rather than inherited urgency. The courage is real — pairing it with deliberate timing is what makes it work for you now.`,
      positive: `You take material risks from genuine, deliberate choice rather than inherited urgency, pairing real courage with considered timing.`,
      negative: `Taking material risks reactively, out of inherited urgency rather than genuine current choice, repeats an old pattern of forced leaps rather than deliberate ones.`,
    },

    // ── 1 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '1_MK': {
      heading: `You Keep Starting Over With Money Instead of Building on What's There`,
      why: `Something in your relationship to material security carries an old, unresolved pattern of initiation without follow-through — a new plan, a fresh financial start, a different approach, each one arriving with real energy. The Magician sits in your Material Karma, meaning your unresolved material task centers specifically on origination: you're genuinely gifted at starting something from nothing, but the security that comes from letting one thing compound over time hasn't yet been claimed.`,
      shadow: `The risk is mistaking the next fresh start for progress, when what's actually needed is staying with the one already in motion. If your financial position keeps resetting to zero right before it would have compounded into something real, that's this pattern still unresolved.`,
      path: `This may shift by choosing the material plan already underway and deliberately not starting a new one until this one has had real time to mature.`,
      positive: `You let one material plan run its full course, and the security that comes from genuine compounding finally becomes available to you.`,
      negative: `An old pull toward starting over keeps resetting your material position right before it would have compounded into real, lasting security.`,
    },

    // ── 2 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '2_MK': {
      heading: `Your Actual Financial Picture Stays Quietly Hidden, Even From You`,
      why: `Something in your relationship to material security carries an old pattern of concealment — a preference for not looking too closely, not saying the real numbers out loud, keeping your actual financial state private even from people close to you. The High Priestess sits in your Material Karma, meaning your unresolved material task centers on bringing hidden financial reality into the light rather than continuing to sense it privately.`,
      shadow: `The risk is that what stays unexamined stays unmanaged — material security built on a foundation you've never actually looked at directly. If you can sense your financial position more than you can state it plainly, that avoidance may be the pattern still active.`,
      path: `This may shift by writing down your actual financial numbers once, in full, and letting them be seen — by yourself first, and then by one trusted other person.`,
      positive: `You've brought your actual financial picture into full view, and the security that comes from truly knowing your position replaces the old comfort of not looking.`,
      negative: `Keeping your real financial numbers private, even from yourself, leaves material security built on a foundation that's never actually been examined.`,
    },

    // ── 3 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '3_MK': {
      heading: `Generosity Comes Easily, But Your Own Material Cushion Rarely Grows`,
      why: `Something in your relationship to material security carries an old pattern of giving that outpaces keeping — real warmth expressed through material generosity, resources shared freely, comfort extended to others before it's secured for yourself. The Empress sits in your Material Karma, meaning your unresolved material task centers on letting your own reserve grow alongside what you give.`,
      shadow: `The risk is that generosity, unchecked, becomes its own form of depletion — a pattern of material abundance flowing outward while your own foundation stays thin. If you're generous with others while quietly under-resourced yourself, that imbalance is the unresolved piece.`,
      path: `This may shift by setting aside a portion of any material gain for your own security first, before it gets extended to anyone else.`,
      positive: `Your generosity continues, but now alongside a genuinely growing personal reserve — abundance that includes you, not just what flows outward from you.`,
      negative: `Generosity that consistently outpaces your own material security keeps your foundation thin, no matter how much abundance passes through your hands.`,
    },

    // ── 4 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '4_MK': {
      heading: `You Hold Tight Control Over Money, As If Loosening It Means Losing It`,
      why: `Something in your relationship to material security carries an old pattern of control — structure, oversight, and a firm hand over every financial detail, as though security depends entirely on your direct management of it. The Emperor sits in your Material Karma, meaning your unresolved material task centers on finding out whether real security can exist without total personal control over every part of it.`,
      shadow: `The risk is that the control itself becomes exhausting to maintain, and delegating or trusting a system you didn't build yourself feels like real danger rather than a reasonable option. If you can't imagine your material security holding without your constant oversight, that's the pattern still active.`,
      path: `This may shift by handing one specific piece of financial management to a trusted system or person, and observing whether the structure holds without your constant hand on it.`,
      positive: `You've tested whether your material security holds without total personal control, and found real structures you can actually trust beyond your own oversight.`,
      negative: `A need for total control over every financial detail keeps security feeling fragile, entirely dependent on your constant, exhausting oversight.`,
    },

    // ── 5 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '5_MK': {
      heading: `Old Rules About How Money "Should" Work Still Quietly Run the Show`,
      why: `Something in your relationship to material security carries an old pattern of deference to inherited financial rules — beliefs about money passed down from family, tradition, or authority, followed carefully even when they no longer fit your actual circumstances. The Hierophant sits in your Material Karma, meaning your unresolved material task centers on testing those inherited rules against your own direct experience.`,
      shadow: `The risk is following an outdated financial rule simply because it's familiar, even when it's quietly working against your actual security. If a "should" about money keeps overriding what your own numbers are telling you, that's the pattern still unresolved.`,
      path: `This may shift by naming one inherited belief about money directly and testing it against your current, actual circumstances rather than assuming it still applies.`,
      positive: `You've tested an inherited financial rule against your real circumstances, and now follow only the guidance that actually serves your present security.`,
      negative: `An old, unexamined rule about how money "should" work can quietly override what your actual financial reality is telling you.`,
    },

    // ── 6 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '6_MK': {
      heading: `A Real Financial Choice Keeps Getting Deferred in Favor of Keeping the Peace`,
      why: `Something in your relationship to material security carries an old pattern of indecision at real financial forks — a choice that would actually serve your security, deferred in favor of whatever keeps things comfortable in the moment. The Lovers sits in your Material Karma, meaning your unresolved material task centers on making the financial choice that reflects genuine preference, even when it isn't the easiest one.`,
      shadow: `The risk is that deferred financial choices don't actually disappear — they just accumulate, leaving your material security shaped more by avoidance than by decision. If you're still weighing the same financial choice long after enough information has arrived, that's the pattern still active.`,
      path: `This may shift by making one specific, deferred financial decision this week, even without full certainty, and letting the choice actually stand.`,
      positive: `You make real financial choices from genuine preference rather than deferring them, and your material security reflects decisions actually made.`,
      negative: `A financial choice kept perpetually open, never quite decided, leaves material security shaped by avoidance rather than by an actual decision.`,
    },

    // ── 7 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '7_MK': {
      heading: `You're Always Pushing Toward More Security, Never Quite Arriving`,
      why: `Something in your relationship to material security carries an old pattern of forward motion without arrival — real drive toward financial goals, one after another, with the sense of "enough" always sitting just past the next milestone. The Chariot sits in your Material Karma, meaning your unresolved material task centers on recognizing security you've actually already reached, rather than continuously pushing past it.`,
      shadow: `The risk is that genuine financial progress never registers as progress, because the goalpost keeps moving the moment it's reached. If you can't name a point at which you'd actually feel secure, that restlessness is the pattern still unresolved.`,
      path: `This may shift by naming one specific, concrete financial milestone as "enough," and pausing there deliberately once it's reached, rather than immediately setting the next one.`,
      positive: `You recognize and rest in real financial milestones once they're reached, letting genuine progress actually register as security.`,
      negative: `A goalpost that keeps moving the instant it's reached means real financial progress never gets to feel like the security it actually is.`,
    },

    // ── 8 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '8_MK': {
      heading: `An Old Sense of Financial Unfairness Still Shapes How You Handle Money`,
      why: `Something in your relationship to material security carries an old imbalance around fairness — a sense, not always articulated, that you were once shorted, overlooked, or unfairly treated in material terms, now shaping present-day vigilance around every financial exchange. The Justice sits in your Material Karma, meaning your unresolved material task centers on settling that old imbalance rather than continuing to guard against its repeat.`,
      shadow: `The risk is treating every current financial exchange as a potential repeat of the old unfairness, creating friction in transactions that have nothing to do with what actually happened before. If you feel disproportionately alert to being shortchanged, that history may still be running underneath it.`,
      path: `This may shift by naming, specifically, what the original financial unfairness was, and separating it consciously from whatever current exchange is actually in front of you.`,
      positive: `You've named the old financial unfairness directly, and current exchanges get evaluated on their own terms instead of through that old lens.`,
      negative: `An unresolved sense of past financial unfairness can make present, unrelated transactions feel like a repeat of something that already happened once.`,
    },

    // ── 9 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '9_MK': {
      heading: `You'd Rather Not Deal With Money Matters Directly If You Can Help It`,
      why: `Something in your relationship to material security carries an old pattern of withdrawal from financial engagement — a preference for not looking too closely at bills, statements, or planning, retreating into other matters rather than confronting material reality head-on. The Hermit sits in your Material Karma, meaning your unresolved material task centers on engaging directly with money matters rather than continuing to avoid them.`,
      shadow: `The risk is that unexamined finances tend to drift, and the avoidance that once felt like peace becomes its own source of quiet financial stress. If you can't say clearly what your current financial state actually is, that avoidance may be costing you more than the discomfort of looking would.`,
      path: `This may shift by setting aside one specific, limited block of time to look directly at your actual financial state, without retreating from it partway through.`,
      positive: `You engage directly with your financial reality instead of retreating from it, and the clarity that follows replaces the old, quiet stress of not knowing.`,
      negative: `Avoiding direct engagement with money matters lets unexamined finances drift, turning old avoidance into a steady, quiet source of stress.`,
    },

    // ── 10 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '10_MK': {
      heading: `Money Seems to Arrive and Vanish in Cycles You Can't Quite Predict`,
      why: `Something in your relationship to material security carries an old pattern of instability — real upswings and real downturns, financial fortune that seems to move in cycles rather than settling into something steady. The Wheel of Fortune sits in your Material Karma, meaning your unresolved material task centers on building consistency underneath the cycle, rather than simply riding it up and down.`,
      shadow: `The risk is treating every upswing as permanent and every downturn as catastrophic, making decisions from whichever extreme you happen to be in rather than from a steadier, longer view. If your financial choices swing as widely as your circumstances do, the cycle may be running the decisions instead of the other way around.`,
      path: `This may shift by building one small, consistent financial habit that holds steady regardless of which phase of the cycle you're currently in.`,
      positive: `You've built consistent habits that hold steady through both ups and downs, so the natural cycle no longer dictates your financial decisions.`,
      negative: `Letting whichever phase of the cycle you're in — flush or lean — drive your financial decisions keeps real stability just out of reach.`,
    },

    // ── 11 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '11_MK': {
      heading: `You Carry Financial Strain Alone Rather Than Naming It Out Loud`,
      why: `Something in your relationship to material security carries an old pattern of silent endurance — real financial hardship or pressure, held quietly and managed alone, without it ever being said plainly to anyone who might help. The Strength sits in your Material Karma, meaning your unresolved material task centers on naming financial strain directly rather than continuing to carry it in silence.`,
      shadow: `The risk is that silently-carried financial strain never gets the chance to be actually addressed, since no one close to you knows the real extent of it. If people would be surprised to learn how much financial pressure you're actually under, that silence is the pattern still active.`,
      path: `This may shift by naming your actual financial strain out loud to one trusted person this week, rather than continuing to manage it alone.`,
      positive: `You've named real financial strain out loud, and the support that becomes available once it's spoken replaces the old weight of carrying it silently.`,
      negative: `Financial strain carried silently, never spoken aloud to anyone, stays unaddressed no matter how capably you manage it alone.`,
    },

    // ── 12 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '12_MK': {
      heading: `A Real Financial Decision Has Been Left Suspended for a Long Time`,
      why: `Something in your relationship to material security carries an old pattern of self-imposed limbo — a financial decision or change left unmade, material comfort quietly sacrificed while waiting for a clarity that hasn't fully arrived. The Hanged Man sits in your Material Karma, meaning your unresolved material task centers on actually making the suspended decision rather than continuing to wait inside it.`,
      shadow: `The risk is mistaking the wait itself for necessary patience, when it may have quietly become its own form of avoidance. If the same financial decision has stayed unmade well past the point where the underlying uncertainty was resolved, the suspension may no longer be serving you.`,
      path: `This may shift by naming the specific financial decision that's been left suspended, and setting a real point by which it gets made, ready or not.`,
      positive: `You've made the financial decision that had been left suspended, and material comfort no longer has to wait on a clarity that wasn't actually going to arrive.`,
      negative: `A financial decision left suspended indefinitely quietly costs material comfort, mistaking avoidance for patience the longer it goes unmade.`,
    },

    // ── 13 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '13_MK': {
      heading: `Necessary Financial Change Gets Resisted Longer Than It Needs To`,
      why: `Something in your relationship to material security carries an old fear of material loss — a resistance to endings, even financial ones that are clearly due, because letting go of a current arrangement feels like losing the security itself. The Death sits in your Material Karma, meaning your unresolved material task centers on recognizing that some financial endings are what actually make room for real security, not a threat to it.`,
      shadow: `The risk is holding onto a financial arrangement well past its useful life simply because ending it feels dangerous, even when the arrangement itself has stopped serving your actual security. If you're maintaining something financial mainly out of fear of what ending it might mean, that fear is the pattern still unresolved.`,
      path: `This may shift by identifying one financial arrangement that's clearly run its course, and letting it end deliberately rather than continuing to resist the ending.`,
      positive: `You let a financial arrangement that had run its course actually end, and real room opens up for security that fits your current life.`,
      negative: `Resisting a financial ending that's clearly due, out of fear rather than genuine need, blocks the room a real ending would otherwise create.`,
    },

    // ── 14 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '14_MK': {
      heading: `Your Spending Swings Between Full Restriction and Full Release`,
      why: `Something in your relationship to material security carries an old pattern of extremes — strict financial discipline followed by periods of full release, each framed as the necessary correction for the one before it. The Temperance sits in your Material Karma, meaning your unresolved material task centers on finding a sustainable middle, rather than continuing to alternate between opposite poles.`,
      shadow: `The risk is that neither extreme, held alone, ever actually produces lasting security — restriction that eventually breaks, followed by release that undoes the restriction's progress. If your financial habits look more like a pendulum than a steady practice, that swing is the pattern still active.`,
      path: `This may shift by choosing one small, moderate financial habit and holding it consistently, resisting the pull toward either extreme.`,
      positive: `You've replaced the swing between financial extremes with one sustainable, moderate habit, and real security compounds instead of resetting.`,
      negative: `Alternating between full financial restriction and full release keeps undoing whatever progress the other extreme managed to build.`,
    },

    // ── 15 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '15_MK': {
      heading: `Money Sometimes Feels Like Something You're Trapped By, Not Something You Hold`,
      why: `Something in your relationship to material security carries an old pattern of compulsive attachment — a felt sense of being bound to financial obligations, possessions, or a particular lifestyle rather than genuinely choosing them. The Devil sits in your Material Karma, meaning your unresolved material task centers on examining that felt bondage directly, rather than continuing to experience it as simply how things are.`,
      shadow: `The risk is mistaking a compulsive material attachment for a fixed reality, when it may actually be a pattern that hasn't yet been questioned. If you feel trapped by a financial obligation without having genuinely examined whether it's still required, that unexamined bind is the pattern still unresolved.`,
      path: `This may shift by naming, honestly, one specific material attachment that feels like a trap, and asking directly what it would actually take to loosen it.`,
      positive: `You've examined a felt material bind directly and found it more loosenable than it seemed, replacing compulsion with genuine, examined choice.`,
      negative: `A financial obligation felt as inescapable, but never actually examined, keeps functioning as a trap it may not need to be.`,
    },

    // ── 16 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '16_MK': {
      heading: `Financial Warning Signs Tend to Get Missed Until They Can't Be`,
      why: `Something in your relationship to material security carries an old pattern of denial toward early financial strain — signs of instability quietly maintained as "fine" until a sudden, more disruptive reckoning forces the issue. The Tower sits in your Material Karma, meaning your unresolved material task centers on taking early financial warning signs seriously, rather than waiting for a forced, sudden correction.`,
      shadow: `The risk is that maintaining the appearance of financial stability, rather than addressing what's actually straining underneath it, sets up exactly the sudden collapse the denial was meant to avoid. If financial reversals in your life tend to feel sudden despite visible signals beforehand, that pattern of delayed reckoning may be active.`,
      path: `This may shift by identifying, specifically, one financial strain currently being minimized, and addressing it directly before it forces a more disruptive correction.`,
      positive: `You address financial strain at its early signs, and a gradual, chosen correction replaces the sudden reckoning denial would otherwise have forced.`,
      negative: `Denying early financial warning signs to maintain an appearance of stability tends to produce exactly the sudden collapse the denial was trying to avoid.`,
    },

    // ── 17 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '17_MK': {
      heading: `You Keep Hoping Your Finances Will Improve Without Yet Acting on That Hope`,
      why: `Something in your relationship to material security carries an old pattern of passive hope — a genuine, sustaining belief that things will get better financially, held without yet converting into the concrete action that hope was meant to inspire. The Star sits in your Material Karma, meaning your unresolved material task centers on pairing real hope with real, specific action toward material improvement.`,
      shadow: `The risk is that hope alone, however genuine, doesn't move a financial position on its own — and waiting for improvement to simply arrive can substitute for the action that would actually produce it. If your financial hope hasn't yet translated into a concrete step, that gap is the pattern still unresolved.`,
      path: `This may shift by naming one small, concrete action your financial hope is actually pointing toward, and taking it this week.`,
      positive: `You've paired genuine financial hope with real action, and material improvement starts arriving because of what you did, not just what you believed.`,
      negative: `Hope for financial improvement, held without any concrete action behind it, doesn't move a material position on its own.`,
    },

    // ── 18 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '18_MK': {
      heading: `The Full Picture of Your Finances Feels Hazier Than It Probably Needs To Be`,
      why: `Something in your relationship to material security carries an old pattern of anxious avoidance — a preference for a vague, felt sense of your financial position over a clear, examined one, because clarity itself feels like it might confirm something feared. The Moon sits in your Material Karma, meaning your unresolved material task centers on replacing that anxious haze with an actual, examined look at where things stand.`,
      shadow: `The risk is that the anxiety persists precisely because it's never actually checked against real numbers — a vague fear is harder to resolve than a specific, known one. If you feel more anxious about money than your actual numbers would justify, that gap between feeling and fact is the pattern still active.`,
      path: `This may shift by looking directly at one specific, avoided financial number this week, and letting the actual figure replace the anxious guess.`,
      positive: `You've replaced anxious financial guesswork with an actual, examined look at your numbers, and the haze clears into something workable.`,
      negative: `An anxious, unexamined sense of your finances tends to persist and grow precisely because it's never actually checked against the real numbers.`,
    },

    // ── 19 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '19_MK': {
      heading: `You Project Financial Confidence Even in Moments You're Privately Unsure`,
      why: `Something in your relationship to material security carries an old pattern of performed ease — an outward financial confidence maintained consistently, even in stretches where the underlying picture feels genuinely uncertain. The Sun sits in your Material Karma, meaning your unresolved material task centers on letting real uncertainty be visible sometimes, rather than maintaining brightness regardless of what's actually happening underneath.`,
      shadow: `The risk is that the performed confidence prevents anyone, including you, from actually addressing the uncertainty underneath it — a bright surface that keeps real financial concerns from getting real attention. If you'd never let anyone see you worried about money, that consistent brightness may be costing you the support that naming it would bring.`,
      path: `This may shift by letting one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual confidence.`,
      positive: `You let real financial uncertainty be visible sometimes, and the support that follows replaces the effort of maintaining constant, performed confidence.`,
      negative: `Performing financial confidence regardless of what's actually happening underneath keeps real concerns from ever getting the attention they need.`,
    },

    // ── 20 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '20_MK': {
      heading: `A Real Financial Reckoning Keeps Getting Pushed a Little Further Out`,
      why: `Something in your relationship to material security carries an old pattern of delay at the point of reckoning — a financial truth that's already become clear, met with more preparation, more waiting, one more condition before it's actually faced. The Judgement sits in your Material Karma, meaning your unresolved material task centers on acting on financial clarity that has, in most cases, already arrived.`,
      shadow: `The risk is that further preparation, past a certain point, functions as delay rather than genuine diligence — a reckoning kept perpetually one step away. If you already know what the financial situation actually calls for and still haven't acted, that delay is the pattern still unresolved.`,
      path: `This may shift by naming the specific action the financial clarity is already calling for, and taking a first concrete step this week rather than gathering more certainty first.`,
      positive: `You've acted on financial clarity that had already arrived, closing a reckoning that delay had kept perpetually just out of reach.`,
      negative: `Financial clarity that's already arrived, but keeps being met with more preparation instead of action, turns necessary diligence into indefinite delay.`,
    },

    // ── 21 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '21_MK': {
      heading: `A Financial Goal Rarely Gets to Feel Fully Finished`,
      why: `Something in your relationship to material security carries an old pattern of extending completion — a financial goal reached in practical terms, but immediately relativized, expanded, or set alongside a new condition before it's allowed to actually count as done. The World sits in your Material Karma, meaning your unresolved material task centers on letting a genuinely reached financial goal be named complete.`,
      shadow: `The risk is that material security never gets to be felt, because the finish line keeps moving the moment it's actually crossed. If you can't recall the last time a financial goal felt fully, simply done, that pattern of continuous extension is still active.`,
      path: `This may shift by identifying one financial goal that is, in practical terms, already reached, and deliberately naming it complete rather than adding one more condition first.`,
      positive: `You let a genuinely reached financial goal be named complete, and the security it represents finally gets to be actually felt.`,
      negative: `A financial goal that's reached but never allowed to count as finished means material security never quite gets the chance to be felt.`,
    },

    // ── 22 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '22_MK': {
      heading: `Financial Risks Tend to Get Taken Before a Safety Net Is Actually in Place`,
      why: `Something in your relationship to material security carries an old pattern of leaping first — genuine openness to material risk, acted on with real courage, but often before the groundwork that would make the risk sustainable has actually been laid. The Fool sits in your Material Karma, meaning your unresolved material task centers on pairing that real courage with enough preparation to let the leap actually land.`,
      shadow: `The risk is that the leap itself becomes the whole story, with the landing left to chance — material risks taken freely, but rarely with a safety net considered in advance. If your financial risks tend to work out through luck rather than preparation, that gap is the pattern still unresolved.`,
      path: `This may shift by building one small piece of safety net before the next financial leap, rather than trusting the landing entirely to courage alone.`,
      positive: `You pair real financial courage with genuine preparation, so the leap lands on something solid instead of depending on luck.`,
      negative: `Taking financial risks freely, without ever building the safety net first, leaves the landing dependent on luck rather than preparation.`,
    },

    // ── 1 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '1_RWM': {
      heading: `You Trust Money You Actively Made More Than Money That Just Arrived`,
      why: `Your subconscious relationship to money runs through active generation — earning feels legitimate, deserved, real, while money that arrives without your direct effort (a gift, a windfall, unearned interest) can feel oddly uncomfortable to simply receive. The Magician governs your Relationship with Money, meaning your instinct is to keep initiating income rather than letting it also just come to you.`,
      shadow: `The risk is turning down or minimizing genuinely available resources — support, gifts, easier income — because only self-generated money feels legitimate to hold onto. If you find yourself working harder for money you could have simply accepted, that discomfort with receiving may be the pattern still running.`,
      path: `This may shift by accepting one piece of unearned financial ease this week — a gift, an easier path, help offered — without converting it into something you have to justify through extra effort.`,
      positive: `You receive both earned and unearned resources with equal ease, and your financial flow widens because you're no longer filtering out help that didn't require active generation.`,
      negative: `Discomfort with unearned money keeps you working harder than necessary, turning down real ease because only self-generated income feels legitimate to hold.`,
    },

    // ── 2 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '2_RWM': {
      heading: `You Sense Financial Opportunity Before You Can Explain It, But Rarely Name Your Price`,
      why: `Your subconscious relationship to money runs through quiet intuition — a real sense for when a financial opportunity is right, paired with real discomfort stating plainly what your work or time is actually worth. The High Priestess governs your Relationship with Money, meaning your financial insight tends to stay private, felt rather than spoken aloud in the transactional terms money actually requires.`,
      shadow: `The risk is that unclaimed insight goes uncompensated — you sense the right move, make it quietly, and let the value of that instinct go unnamed and underpaid. If your income doesn't reflect what you actually know, the silence around your own worth may be the pattern still active.`,
      path: `This may shift by stating one specific price or value out loud this week, rather than letting your financial instinct stay an unspoken, unpaid asset.`,
      positive: `You name your financial worth out loud, and your income finally reflects the real value of the instinct you've always quietly had.`,
      negative: `Financial insight that stays private and unspoken keeps going uncompensated, no matter how consistently accurate that quiet instinct actually is.`,
    },

    // ── 3 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '3_RWM': {
      heading: `Spending on Comfort and Beauty Comes Naturally; Saving for Yourself Does Not`,
      why: `Your subconscious relationship to money runs through generous, sensory expression — real ease spending on comfort, beauty, and care, for yourself and especially for others, with less natural pull toward accumulation or reserve. The Empress governs your Relationship with Money, meaning your financial flow is generative and warm, but not automatically protective of its own future.`,
      shadow: `The risk is that generosity, unchecked, leaves nothing set aside — real abundance moving freely outward while your own reserve stays thin. If you're comfortable and generous now but anxious about later, that imbalance may be the pattern still unresolved.`,
      path: `This may shift by setting aside a specific portion of any income for your own future before spending on comfort or generosity extends further.`,
      positive: `Your natural generosity continues, now paired with a genuine reserve set aside first, so warmth outward no longer comes at the cost of your own future.`,
      negative: `Spending easily on comfort and care for others, without setting anything aside first, keeps your own reserve thin no matter how much flows through your hands.`,
    },

    // ── 4 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '4_RWM': {
      heading: `Money Feels Safest When You're the One Managing Every Detail of It`,
      why: `Your subconscious relationship to money runs through control — structure, oversight, a firm hand on every account and decision, as though financial security depends entirely on your personal management of it. The Emperor governs your Relationship with Money, meaning your instinct is to build and defend systems rather than trust ones you didn't personally construct.`,
      shadow: `The risk is that the management itself becomes the source of stress, and delegating any part of your finances — even to a trustworthy system — feels like a genuine risk rather than a reasonable option. If you can't imagine your money being fine without your constant oversight, that's the pattern still active.`,
      path: `This may shift by handing one small piece of financial management to a system or person you trust, and observing whether it actually holds without you.`,
      positive: `You've tested whether your finances hold without total personal control, and found real systems worth trusting beyond your own constant oversight.`,
      negative: `A need to personally manage every financial detail keeps money feeling safe only under your direct control, which is exhausting to sustain indefinitely.`,
    },

    // ── 5 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '5_RWM': {
      heading: `You Feel Guilty About Money Earned or Spent Outside the "Right" Way`,
      why: `Your subconscious relationship to money runs through inherited rules about correctness — a real sense that there's a proper, sanctioned way to earn and spend, and quiet discomfort whenever money arrives or leaves outside that framework. The Hierophant governs your Relationship with Money, meaning your instinct is to check financial choices against tradition or authority before trusting them.`,
      shadow: `The risk is passing up genuinely good financial opportunities simply because they don't match an inherited idea of the "proper" way to earn or spend. If you feel guilty about money that came easily or unconventionally, even when nothing about it was actually wrong, that inherited rule may be the pattern still active.`,
      path: `This may shift by naming one inherited money rule directly and testing whether it actually reflects your own values, or just an old, unexamined authority.`,
      positive: `You've tested an inherited money rule against your own actual values, and now earn and spend according to what genuinely fits you, not just old convention.`,
      negative: `An unexamined rule about the "proper" way to handle money can quietly disqualify genuinely good opportunities that simply don't match the old convention.`,
    },

    // ── 6 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '6_RWM': {
      heading: `Financial Choices Get Weighed Against What Someone Else Wants, Not Just What You Do`,
      why: `Your subconscious relationship to money runs through relational weighing — earning and spending decisions filtered through what a partner or loved one would think, want, or need, sometimes before your own actual preference gets consulted. The Lovers governs your Relationship with Money, meaning your financial choices are genuinely relational, for better and for worse.`,
      shadow: `The risk is that your own financial preference gets perpetually deferred to someone else's, leaving you unsure what you'd actually choose if the decision were only yours. If you can't say clearly what you want financially, independent of what someone else wants, that deference may be the pattern still unresolved.`,
      path: `This may shift by making one financial decision based purely on your own preference this week, and letting it stand without checking it against anyone else's wants first.`,
      positive: `You make real financial choices from your own genuine preference, and relational money decisions become a true collaboration instead of a one-sided deference.`,
      negative: `Financial choices perpetually filtered through someone else's preference first leave your own actual financial wants quietly unexamined.`,
    },

    // ── 7 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '7_RWM': {
      heading: `You Chase the Next Income Goal Before Actually Enjoying the Last One`,
      why: `Your subconscious relationship to money runs through forward drive — real ambition and momentum toward the next financial target, arriving so quickly after the last one that there's rarely a pause to actually register what's already been earned. The Chariot governs your Relationship with Money, meaning your financial motion is genuinely strong, but rest and enjoyment haven't kept pace with it.`,
      shadow: `The risk is that money earned never actually gets to feel earned — spent, saved, or invested toward the next goal before its arrival is even acknowledged. If you can't recall the last time you paused to genuinely enjoy an income milestone, that restlessness may be the pattern still active.`,
      path: `This may shift by deliberately pausing after the next financial milestone, before setting the next target, long enough to actually register what's been reached.`,
      positive: `You pause to genuinely register each financial milestone before pushing toward the next, and the momentum starts to feel like progress instead of a treadmill.`,
      negative: `Chasing the next income goal before acknowledging the last one keeps real financial progress from ever actually registering as such.`,
    },

    // ── 8 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '8_RWM': {
      heading: `You Keep a Precise Mental Ledger of What's Fair in Every Financial Exchange`,
      why: `Your subconscious relationship to money runs through fairness and precision — a sharp internal accounting of who owes what, whether compensation matches effort, whether an exchange was actually equal. The Justice governs your Relationship with Money, meaning your financial instinct is deeply oriented toward balance, sometimes at the cost of ease.`,
      shadow: `The risk is that the mental ledger never fully closes — small financial imbalances tracked and remembered long after they'd naturally resolve on their own, creating tension in relationships or transactions that could otherwise be simple. If you're still tallying a financial unfairness long after it stopped mattering to anyone else, that ledger may be the pattern still running.`,
      path: `This may shift by consciously closing one old financial account you're still mentally tracking, and letting the balance rest rather than continuing to tally it.`,
      positive: `You let old, settled financial imbalances actually close, and your sharp sense of fairness applies to what's current instead of what's long past.`,
      negative: `A mental ledger that never closes keeps old, minor financial imbalances alive long after they'd naturally have stopped mattering to anyone else.`,
    },

    // ── 9 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '9_RWM': {
      heading: `You'd Rather Earn Less Alone Than Ask for Financial Help or Partnership`,
      why: `Your subconscious relationship to money runs through self-sufficiency — a strong preference for earning and managing money independently, even when collaboration or support would genuinely increase what's available to you. The Hermit governs your Relationship with Money, meaning your financial instinct favors solitude over asking, even at a real cost.`,
      shadow: `The risk is undercharging or under-earning specifically to avoid the discomfort of financial interdependence — a self-sufficiency so strong it quietly limits your own income. If you'd rather make less alone than ask for help that could genuinely grow what you earn, that avoidance may be the pattern still active.`,
      path: `This may shift by asking for one specific piece of financial help or partnership this week, and noticing what actually becomes possible once you do.`,
      positive: `You ask for financial help or partnership when it would genuinely help, and your income grows because self-sufficiency is no longer the only option you'll consider.`,
      negative: `Preferring to earn less entirely alone rather than ask for help quietly caps your income well below what real collaboration could unlock.`,
    },

    // ── 10 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '10_RWM': {
      heading: `Income Arrives in Waves, and Steady, Predictable Money Feels Almost Suspicious`,
      why: `Your subconscious relationship to money runs through cycles — real feast-and-famine patterns, income that surges and recedes, an instinct that treats sudden financial luck as more familiar than slow, steady accumulation. The Wheel of Fortune governs your Relationship with Money, meaning your financial rhythm is genuinely cyclical, for better and worse.`,
      shadow: `The risk is that steady income gets unconsciously undermined — quietly sabotaged or simply not trusted — because the wave pattern feels more like "how money actually works" than something reliable ever could. If consistent income opportunities keep slipping away just as they start to stabilize, that instinct may be the pattern still active.`,
      path: `This may shift by deliberately protecting one steady income source through a full cycle, resisting the urge to disrupt it just because it feels unfamiliar.`,
      positive: `You let one steady income source hold through a full cycle without disrupting it, and real stability becomes as trustworthy as the old, familiar waves.`,
      negative: `An instinct that only trusts feast-and-famine cycles can quietly undermine the steady income that would actually smooth them out.`,
    },

    // ── 11 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '11_RWM': {
      heading: `You Provide Financially for Others Long Before You'd Ask to Be Provided For`,
      why: `Your subconscious relationship to money runs through quiet endurance — real capacity to earn, support, and carry financial responsibility for others, paired with a much weaker instinct to ask the same in return. The Strength governs your Relationship with Money, meaning your financial resilience is genuine, but one-directional by default.`,
      shadow: `The risk is that the giving becomes depleting precisely because it's never balanced by receiving — real financial strength quietly costing you the support you'd need to actually sustain it. If you can provide for everyone but struggle to ask anyone to provide for you, that imbalance may be the pattern still unresolved.`,
      path: `This may shift by naming one specific financial need out loud to someone capable of helping, rather than continuing to carry it alone by default.`,
      positive: `You name real financial needs out loud instead of only ever meeting others', and the support that follows makes your strength sustainable instead of depleting.`,
      negative: `Providing financially for others while rarely asking to be provided for keeps real strength one-directional, and eventually, quietly depleting.`,
    },

    // ── 12 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '12_RWM': {
      heading: `Spending on Yourself Specifically Tends to Get Delayed or Denied`,
      why: `Your subconscious relationship to money runs through self-denial — a real instinct to withhold financial comfort from yourself specifically, even while resources exist, as though waiting or sacrificing has its own quiet virtue. The Hanged Man governs your Relationship with Money, meaning your financial instinct suspends your own comfort more readily than it suspends anyone else's.`,
      shadow: `The risk is that the denial outlives whatever it was originally protecting — money available for your own comfort, held back indefinitely, well past the point where the sacrifice actually serves anything. If you consistently postpone spending on yourself specifically, that suspension may be the pattern still active.`,
      path: `This may shift by spending, deliberately and without justification, on one thing for your own comfort this week — not as a reward, just as a choice.`,
      positive: `You spend on your own comfort without needing to justify or earn it first, and the old, indefinite self-denial finally has a real end point.`,
      negative: `Indefinitely postponing spending on your own comfort, even when resources exist, keeps a form of self-denial running well past any actual necessity.`,
    },

    // ── 13 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '13_RWM': {
      heading: `Your Finances Tend to Change Through Total Overhaul, Not Gradual Adjustment`,
      why: `Your subconscious relationship to money runs through transformation — real financial shifts that arrive as complete overhauls, a job left entirely, a whole system rebuilt from scratch, rather than gradual, incremental change. The Death governs your Relationship with Money, meaning your financial instinct favors the clean break over the slow adjustment.`,
      shadow: `The risk is that smaller, earlier course-corrections get skipped in favor of waiting for the big, dramatic reset — financial problems left unaddressed until they force a total overhaul that a gradual adjustment could have prevented. If your financial life keeps needing complete rebuilds rather than small tune-ups, that pattern may be the piece still unresolved.`,
      path: `This may shift by making one small, incremental financial adjustment now, rather than waiting for the situation to force a complete overhaul later.`,
      positive: `You make small financial adjustments as they're needed, and real transformation becomes something you choose deliberately, not something forced by neglect.`,
      negative: `Skipping small financial course-corrections in favor of waiting for a dramatic reset tends to make the eventual overhaul more disruptive than it needed to be.`,
    },

    // ── 14 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '14_RWM': {
      heading: `Under Stress, Your Spending Swings Hard Toward One Extreme or the Other`,
      why: `Your subconscious relationship to money runs through balance — genuinely steady and moderate when centered, but prone to swinging into strict restriction or full indulgence the moment real stress enters the picture. The Temperance governs your Relationship with Money, meaning your natural equilibrium is real, but conditional on your overall state.`,
      shadow: `The risk is that stress-driven financial swings undo the very balance that's otherwise your real strength — a period of discipline followed by a release that erases its progress, or the reverse. If your spending habits seem to track your stress level more than your actual financial plan, that swing may be the pattern still active.`,
      path: `This may shift by noticing the moment stress starts pulling your spending toward an extreme, and consciously choosing the smaller, steadier version of the response instead.`,
      positive: `You notice stress-driven financial swings as they start and choose the steadier response instead, letting your natural balance hold even under pressure.`,
      negative: `Financial habits that track your stress level more than your actual plan keep undoing, under pressure, the very balance that's otherwise your real strength.`,
    },

    // ── 15 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '15_RWM': {
      heading: `A Specific Spending or Earning Habit Feels More Compulsive Than Chosen`,
      why: `Your subconscious relationship to money runs through compulsion — a specific financial habit, whether spending, earning, or a particular relationship to a job or lifestyle, that feels less like an active choice and more like something you're bound to. The Devil governs your Relationship with Money, meaning at least one part of your financial life runs on autopilot rather than genuine decision.`,
      shadow: `The risk is mistaking the compulsive habit for simply how things are, never actually examining whether it's still necessary or just familiar. If a specific money habit feels like it's running you rather than the other way around, that unexamined grip may be the pattern still unresolved.`,
      path: `This may shift by naming the specific compulsive financial habit honestly, and asking directly what would actually happen if you loosened it.`,
      positive: `You've examined a compulsive money habit directly and found it more changeable than it seemed, replacing autopilot with genuine, examined choice.`,
      negative: `A financial habit that runs on autopilot, never actually questioned, keeps functioning as a compulsion rather than a choice you're still making.`,
    },

    // ── 16 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '16_RWM': {
      heading: `Financial Change Tends to Arrive Suddenly, Even When Signs Were There`,
      why: `Your subconscious relationship to money runs through sudden disruption — real financial shifts that seem to hit abruptly, even in situations where warning signs were quietly present beforehand. The Tower governs your Relationship with Money, meaning your instinct is to maintain the current picture until it can no longer be maintained, rather than adjusting early.`,
      shadow: `The risk is that maintaining the appearance of financial stability, instead of addressing the strain underneath it, sets up exactly the sudden reversal the denial was meant to avoid. If financial surprises in your life tend to have visible signals in hindsight, that pattern of delayed reckoning may be active.`,
      path: `This may shift by identifying one financial strain currently being minimized, and addressing it directly before it forces a more disruptive, sudden correction.`,
      positive: `You address financial strain at its early signs now, and gradual, chosen adjustment replaces the sudden reversals that used to catch you off guard.`,
      negative: `Maintaining an appearance of financial stability while ignoring early strain tends to produce exactly the sudden disruption the denial was trying to avoid.`,
    },

    // ── 17 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '17_RWM': {
      heading: `You Naturally Monetize What Inspires You, But Wait Passively for the Rest to Improve`,
      why: `Your subconscious relationship to money runs through hope and natural talent — real ease turning creative or inspired work into income, paired with a more passive hope that other financial areas will simply improve on their own over time. The Star governs your Relationship with Money, meaning your gift for monetizing inspiration is real, but it hasn't yet extended to areas that need direct action instead.`,
      shadow: `The risk is that hope substitutes for action in exactly the financial areas that need a concrete step, while your genuine talent for monetizing passion continues unaffected. If parts of your financial life have stayed the same for years despite hoping they'd improve, that passivity may be the pattern still active.`,
      path: `This may shift by naming one financial area you've been hoping will improve, and taking one concrete action toward it this week instead of continuing to wait.`,
      positive: `You pair your natural gift for monetizing inspiration with real action in the areas that needed it, and hope finally has something concrete behind it.`,
      negative: `Hoping a financial area will improve, without pairing that hope with any concrete action, tends to leave it exactly where it's always been.`,
    },

    // ── 18 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '18_RWM': {
      heading: `Your Actual Financial Numbers Feel Hazier Than the Anxiety About Them`,
      why: `Your subconscious relationship to money runs through anxious uncertainty — a real, felt worry about your financial state that's often more intense and less examined than the actual numbers would justify. The Moon governs your Relationship with Money, meaning your financial fear tends to run ahead of your financial facts.`,
      shadow: `The risk is that the anxiety perpetuates itself precisely because it's never actually checked against reality — a vague, unexamined fear is harder to resolve than a specific, known one. If you feel more anxious about money than your actual situation warrants, that gap between feeling and fact may be the pattern still active.`,
      path: `This may shift by looking directly at one specific, avoided financial number this week, and letting the actual figure replace the anxious guess.`,
      positive: `You've replaced anxious financial guesswork with an actual, examined look at your numbers, and the fear settles into something workable.`,
      negative: `An anxious, unexamined sense of your finances tends to grow precisely because it's never actually checked against the real, specific numbers.`,
    },

    // ── 19 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '19_RWM': {
      heading: `You Project Financial Ease Even in Stretches You're Privately Worried`,
      why: `Your subconscious relationship to money runs through performed confidence — a natural, radiant ease around money maintained outwardly, even during periods where the underlying picture feels genuinely uncertain. The Sun governs your Relationship with Money, meaning your real gift for financial optimism sometimes covers concerns that could use real attention instead.`,
      shadow: `The risk is that the consistent brightness prevents anyone, including you, from actually addressing what's uncertain underneath it — genuine financial concerns that never get real attention because the surface always looks fine. If you'd rarely let anyone see you actually worried about money, that consistent performance may be costing you real support.`,
      path: `This may shift by letting one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual ease.`,
      positive: `You let real financial uncertainty be visible sometimes, and the support that follows replaces the effort of maintaining constant, performed ease.`,
      negative: `Performing financial confidence regardless of what's actually happening underneath keeps real concerns from ever getting the attention they need.`,
    },

    // ── 20 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '20_RWM': {
      heading: `A Financial Wake-Up Call Tends to Arrive Later Than the Signs Did`,
      why: `Your subconscious relationship to money runs through delayed reckoning — a pattern of eventually facing financial truths fully and honestly, but usually well after the signs pointing toward them first appeared. The Judgement governs your Relationship with Money, meaning your eventual clarity is genuine, but the timing tends to lag behind the actual evidence.`,
      shadow: `The risk is that the delay itself has a cost — financial issues left unaddressed longer than necessary, simply because the eventual reckoning always seems to arrive, so there's less urgency to act on early signs. If you tend to face financial truths only once they can no longer be avoided, that lag may be the pattern still active.`,
      path: `This may shift by acting on a current financial sign now, before it becomes the kind of situation that eventually forces a full reckoning.`,
      positive: `You act on financial signs as they appear, and the eventual, delayed reckoning gets replaced by earlier, less costly course-corrections.`,
      negative: `Waiting for financial truths to become undeniable before facing them fully tends to make the eventual reckoning more costly than it needed to be.`,
    },

    // ── 21 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '21_RWM': {
      heading: `Financial Success Rarely Feels Complete Until It Matches a Bigger, Ideal Picture`,
      why: `Your subconscious relationship to money runs through a large-scale, big-picture standard — real financial progress measured against an ideal, comprehensive version of success, rather than felt as complete on its own more modest terms. The World governs your Relationship with Money, meaning genuine financial wins can feel unfinished simply because the full picture hasn't yet arrived.`,
      shadow: `The risk is that real, current financial success never gets to be felt as success, because it's constantly measured against a bigger picture that hasn't materialized yet. If you can't recall the last time a financial win felt genuinely complete, that big-picture standard may be the pattern still active.`,
      path: `This may shift by naming one financial win that's genuinely real right now, and letting it count as complete on its own terms, without measuring it against the larger picture.`,
      positive: `You let real, current financial wins count as complete on their own terms, and success finally gets to be felt instead of endlessly deferred to a bigger picture.`,
      negative: `Measuring every financial win against an ideal, bigger picture keeps real, current success from ever quite registering as success.`,
    },

    // ── 22 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '22_RWM': {
      heading: `You Trust That Money Will Work Out More Than You Plan for It To`,
      why: `Your subconscious relationship to money runs through spontaneous trust — real openness to financial risk and change, paired with a genuine belief that things will work out, more than a habit of building the structure that would make that outcome more certain. The Fool governs your Relationship with Money, meaning your financial optimism is real, but often unaccompanied by preparation.`,
      shadow: `The risk is that the trust alone gets asked to do the work that planning was meant to do — financial risks taken freely, with the landing left mostly to chance. If your financial life tends to work out through luck more than through preparation, that gap may be the pattern still unresolved.`,
      path: `This may shift by pairing your next financial risk with one small, concrete piece of preparation, rather than trusting the outcome entirely to optimism.`,
      positive: `You pair genuine financial optimism with real preparation, so the trust that things will work out is backed by something solid instead of chance alone.`,
      negative: `Trusting that money will simply work out, without building any structure to support that outcome, leaves real financial risk dependent on luck.`,
    },

    // ── 1 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '1_MEP': {
      heading: `You Carry Real, Inherited Competence at Launching Things From Nothing`,
      why: `Your money entry point reflects a genuine, carried-over competence at starting ventures from scratch — earning through initiation, launching, building something new where nothing existed before. The Magician sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating the same old pattern alongside the competence — initiating a promising professional venture and then moving to the next before this one has actually paid off. If your career shows a string of strong starts without matching follow-through, that carried-over pattern may be worth addressing directly.`,
      path: `This may shift by choosing one current professional venture and deliberately staying with it well past the exciting starting phase.`,
      positive: `You bring genuine, practiced skill to starting new ventures, and because you now stay through the follow-through phase too, that competence finally compounds into real career growth.`,
      negative: `Real, inherited skill at starting things loses its financial value if the same old pattern of moving on too soon keeps repeating alongside it.`,
    },

    // ── 2 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '2_MEP': {
      heading: `You Carry Real, Inherited Competence at Reading What Others Miss`,
      why: `Your money entry point reflects a genuine, carried-over competence in intuitive, discerning, or advisory work — earning through insight, counsel, or a quiet read on situations others find opaque. The High Priestess sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of holding that insight back rather than offering it plainly, letting a genuinely marketable skill stay private and uncompensated. If your professional insight is often right but rarely credited or paid for directly, that old caution may be worth addressing.`,
      path: `This may shift by offering your intuitive read directly and explicitly in one professional context this week, rather than letting it stay implied.`,
      positive: `You offer your genuine intuitive insight directly instead of holding it back, and your career finally reflects the real value of a competence you've always quietly had.`,
      negative: `Real, inherited insight stays financially undervalued if an old caution keeps it private instead of offered plainly in professional contexts.`,
    },

    // ── 3 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '3_MEP': {
      heading: `You Carry Real, Inherited Competence in Creative, Nurturing, or Abundant Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in creative, hospitable, or nurturing professions — earning through generativity, care, beauty, or cultivation, work that produces real comfort and abundance for others. The Empress sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of under-pricing that generosity, giving so freely in professional contexts that the actual market value of the work goes uncollected. If your creative or nurturing work is appreciated but underpaid, that old pattern may be the piece still active.`,
      path: `This may shift by naming a fair, specific price for your creative or nurturing work this week, and holding to it without discounting out of habit.`,
      positive: `You price your creative and nurturing work fairly, and real abundance flows back to match the genuine value you've always brought to it.`,
      negative: `A pattern of underpricing genuinely valuable creative or nurturing work keeps real professional abundance from actually reaching you.`,
    },

    // ── 4 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '4_MEP': {
      heading: `You Carry Real, Inherited Competence in Leadership and Building Structure`,
      why: `Your money entry point reflects a genuine, carried-over competence in organizational or leadership work — earning through building systems, directing effort, and creating the structure that lets an enterprise actually function. The Emperor sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of over-control, building structures so tightly held that they depend entirely on you, limiting how far your professional competence can actually scale. If your career growth keeps hitting a ceiling shaped by how much you can personally oversee, that old pattern may be worth addressing.`,
      path: `This may shift by building one system at work that runs correctly without your constant direct oversight, and trusting it to hold.`,
      positive: `You build structures that hold without requiring your constant oversight, and your real leadership competence finally scales past what you alone can manage.`,
      negative: `Real, inherited leadership skill hits a ceiling if an old need for total control keeps every structure dependent on your constant personal oversight.`,
    },

    // ── 5 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '5_MEP': {
      heading: `You Carry Real, Inherited Competence in Teaching and Passing Down Knowledge`,
      why: `Your money entry point reflects a genuine, carried-over competence in teaching, mentorship, or institutional work — earning through transmitting knowledge, upholding standards, and guiding others through established frameworks. The Hierophant sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of clinging to outdated methods simply because they're familiar, letting genuinely valuable teaching competence calcify instead of adapting to what's actually needed now. If your professional approach hasn't updated in a while despite the field around it changing, that old rigidity may be worth addressing.`,
      path: `This may shift by updating one specific teaching or mentoring method you rely on, testing it against what's actually needed today rather than what's simply familiar.`,
      positive: `You update your teaching and mentoring methods to match what's actually needed now, and your real competence stays relevant instead of calcifying.`,
      negative: `Real, inherited teaching skill loses relevance if an old attachment to familiar methods keeps it from adapting to what the field actually needs now.`,
    },

    // ── 6 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '6_MEP': {
      heading: `You Carry Real, Inherited Competence in Collaborative and Relational Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in partnership-based or relational professions — earning through discernment, matching, negotiating, or collaborative craft that depends on reading a relationship correctly. The Lovers sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of indecision at key professional forks, letting a genuinely valuable relational instinct stall out at the exact moments a clear choice was needed. If important collaborative decisions tend to sit unresolved longer than they should, that old hesitation may be worth addressing.`,
      path: `This may shift by making one pending collaborative or partnership decision this week, using your genuine relational instinct rather than continuing to defer it.`,
      positive: `You act decisively on your genuine relational instincts, and collaborative work finally moves forward instead of stalling at key decision points.`,
      negative: `Real, inherited relational skill stalls out if an old pattern of indecision keeps key collaborative choices perpetually unresolved.`,
    },

    // ── 7 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '7_MEP': {
      heading: `You Carry Real, Inherited Competence in Driven, High-Achievement Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in competitive or high-momentum professions — earning through drive, decisive action, and a real capacity to push toward a goal and win it. The Chariot sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of relentless pushing without pacing, letting genuinely valuable drive burn out the very career it's meant to build. If your professional momentum tends to end in exhaustion rather than sustainable success, that old pattern may be worth addressing.`,
      path: `This may shift by building one deliberate pause into your current professional push, treating rest as part of the strategy rather than a departure from it.`,
      positive: `You pair your genuine drive with real pacing, and sustainable career momentum replaces the old cycle of pushing hard and then burning out.`,
      negative: `Real, inherited drive burns out its own career gains if an old pattern of relentless pushing never builds in genuine pacing.`,
    },

    // ── 8 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '8_MEP': {
      heading: `You Carry Real, Inherited Competence in Fairness-Based and Judgment-Based Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in law, mediation, or standards-based professions — earning through a sharp, reliable sense of what's fair, balanced, and accountable. The Justice sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of applying that standard too rigidly or harshly, letting genuinely valuable judgment curdle into inflexibility that costs you professional goodwill. If your fairness sometimes reads as coldness to the people you work with, that old rigidity may be worth addressing.`,
      path: `This may shift by pairing one judgment call this week with visible compassion for the person on the other side of it, not just the correct standard.`,
      positive: `You apply your genuine sense of fairness with real compassion alongside it, and your professional judgment earns trust instead of just correctness.`,
      negative: `Real, inherited fairness curdles into costly rigidity if an old pattern of harsh application never softens into genuine compassion.`,
    },

    // ── 9 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '9_MEP': {
      heading: `You Carry Real, Inherited Competence in Deep, Solitary Expertise`,
      why: `Your money entry point reflects a genuine, carried-over competence in independent, research-driven, or expert work — earning through depth, focus, and knowledge built alone over real time. The Hermit sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of isolating that expertise so completely it never reaches the audience or collaborators who'd actually pay for it. If your deep knowledge rarely gets shared in ways that translate into professional recognition or income, that old withdrawal may be worth addressing.`,
      path: `This may shift by sharing one piece of your expert knowledge publicly or professionally this week, rather than continuing to develop it in isolation.`,
      positive: `You share your genuine expertise more openly, and real professional recognition finally reaches knowledge that used to stay developed in isolation.`,
      negative: `Real, inherited expertise stays professionally invisible if an old pattern of isolation keeps it from ever reaching the people who'd value it.`,
    },

    // ── 10 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '10_MEP': {
      heading: `You Carry Real, Inherited Competence in Adaptable, Cyclical Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in professions shaped by change, timing, or cycles — earning through adaptability, reading shifting conditions, and moving fluidly as circumstances turn. The Wheel of Fortune sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of relying on favorable timing instead of building consistency underneath it, letting real adaptability substitute for a steadier professional foundation. If your career success seems to depend heavily on lucky timing rather than built structure, that old pattern may be worth addressing.`,
      path: `This may shift by building one consistent professional practice that holds steady regardless of which phase of the cycle you're currently in.`,
      positive: `You pair your genuine adaptability with real consistency underneath it, and career success stops depending so heavily on lucky timing.`,
      negative: `Real, inherited adaptability stays fragile if an old reliance on favorable timing never gets paired with a steadier professional foundation.`,
    },

    // ── 11 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '11_MEP': {
      heading: `You Carry Real, Inherited Competence in Steady, Resilient, Caretaking Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in caretaking or endurance-based professions — earning through reliability, quiet strength, and a real capacity to hold difficult work steady over time. The Strength sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of carrying professional burdens entirely alone, letting genuinely valuable resilience turn into isolation rather than sustainable strength. If you're relied on professionally but rarely supported in return, that old pattern may be worth addressing.`,
      path: `This may shift by naming one specific professional burden out loud to a colleague or collaborator this week, rather than continuing to carry it silently.`,
      positive: `You name real professional burdens instead of carrying them silently, and your genuine resilience becomes sustainable instead of isolating.`,
      negative: `Real, inherited resilience becomes isolating if an old pattern of carrying every professional burden alone never gets named or shared.`,
    },

    // ── 12 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '12_MEP': {
      heading: `You Carry Real, Inherited Competence in Patient, Perspective-Shifting Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in service-oriented or reframing professions — earning through patience, a willingness to see situations from an unconventional angle, and a capacity to hold difficulty without rushing it. The Hanged Man sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of self-sacrifice past the point of usefulness, letting genuinely valuable patience curdle into professional self-neglect. If you consistently put your own professional needs last, that old pattern may be worth addressing.`,
      path: `This may shift by naming one professional need of your own this week and prioritizing it, rather than automatically deferring it again.`,
      positive: `You prioritize your own professional needs alongside your genuine patience for others, and the old self-sacrifice no longer costs you what you actually need.`,
      negative: `Real, inherited patience turns into costly self-neglect if an old pattern of self-sacrifice keeps overriding your own professional needs.`,
    },

    // ── 13 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '13_MEP': {
      heading: `You Carry Real, Inherited Competence in Transformative, Threshold-Crossing Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in change-oriented professions — earning through guiding transitions, endings, and rebirths, work that requires real comfort with what other people find frightening. The Death sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of forcing dramatic professional overhauls instead of allowing gradual evolution, letting genuinely valuable transformative skill skip over smaller, necessary adjustments. If your career keeps needing complete resets rather than incremental growth, that old pattern may be worth addressing.`,
      path: `This may shift by making one small, incremental professional change now, rather than waiting for circumstances to force a complete overhaul.`,
      positive: `You make small professional adjustments as they're needed, and your genuine transformative skill gets applied by choice, not just by crisis.`,
      negative: `Real, inherited transformative skill keeps getting used only in crisis if an old pattern of forcing dramatic resets skips over smaller, timely adjustments.`,
    },

    // ── 14 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '14_MEP': {
      heading: `You Carry Real, Inherited Competence in Integrative, Balance-Oriented Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in blending or integrative professions — earning through combining disparate elements into something coherent, work that requires real patience and a steady hand. The Temperance sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of losing that careful balance exactly when professional pressure rises, letting genuinely valuable moderation give way to extremes right when steadiness matters most. If your usual measured approach tends to break down under real deadline or client pressure, that old pattern may be worth addressing.`,
      path: `This may shift by identifying your specific pressure point at work and deliberately practicing the moderate response there, rather than the extreme one.`,
      positive: `You maintain your genuine integrative balance even under real professional pressure, and that steadiness becomes reliable rather than conditional.`,
      negative: `Real, inherited integrative skill breaks down under pressure if an old pattern of losing balance keeps surfacing exactly when steadiness matters most.`,
    },

    // ── 15 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '15_MEP': {
      heading: `You Carry Real, Inherited Competence in Persuasion and Influence-Based Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in professions built on influence — earning through persuasion, negotiation, and a real, magnetic capacity to move other people toward a decision. The Devil sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of using that influence manipulatively, letting genuinely valuable persuasive skill curdle into something that damages trust rather than building it. If your professional relationships tend to cool once the deal is closed, that old pattern may be worth addressing.`,
      path: `This may shift by using your persuasive skill in one upcoming situation with full transparency about your actual interest, rather than obscuring it.`,
      positive: `You use your genuine persuasive gift with real transparency, and professional trust deepens instead of eroding once the deal is done.`,
      negative: `Real, inherited persuasive skill damages professional trust if an old pattern of obscured motive keeps surfacing once the influence has done its work.`,
    },

    // ── 16 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '16_MEP': {
      heading: `You Carry Real, Inherited Competence in Crisis and Rebuilding Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in disruption-adjacent professions — earning through steadiness during upheaval and a real capacity to help rebuild what's collapsed. The Tower sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of ignoring early professional warning signs until a full collapse forces the issue, letting genuinely valuable crisis competence get used reactively instead of preventively. If disruptions in your career tend to feel sudden despite visible signals beforehand, that old pattern may be worth addressing.`,
      path: `This may shift by addressing one current professional warning sign directly now, rather than waiting for it to force a bigger disruption later.`,
      positive: `You address professional warning signs early, and your genuine crisis competence gets used preventively instead of only after things collapse.`,
      negative: `Real, inherited crisis skill only gets used reactively if an old pattern of ignoring early signs keeps letting situations collapse before you act.`,
    },

    // ── 17 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '17_MEP': {
      heading: `You Carry Real, Inherited Competence in Inspirational and Creative Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in inspired or visionary professions — earning through creative vision, natural encouragement of others, and a real gift for making hope feel tangible. The Star sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of waiting passively for recognition rather than actively offering your work, letting genuinely valuable inspiration stay underexposed. If your creative or inspirational work rarely reaches the audience that would actually value it, that old passivity may be worth addressing.`,
      path: `This may shift by actively sharing one piece of your inspired work this week, rather than waiting for it to be discovered on its own.`,
      positive: `You actively share your genuine creative gift instead of waiting to be discovered, and real recognition finally reaches work that's always deserved it.`,
      negative: `Real, inherited creative inspiration stays underexposed if an old pattern of passive waiting keeps it from actively reaching the people who'd value it.`,
    },

    // ── 18 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '18_MEP': {
      heading: `You Carry Real, Inherited Competence in Deep, Intuitive, Psychological Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in intuitive or psychologically deep professions — earning through perceiving what's beneath the surface, work that requires real comfort with ambiguity and the subconscious. The Moon sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of losing clarity in that depth, letting genuinely valuable intuitive skill blur into confusion that undermines professional confidence in your own read. If your deep insight sometimes gets clouded by anxious uncertainty rather than trusted, that old pattern may be worth addressing.`,
      path: `This may shift by grounding one intuitive professional read this week against concrete, checkable evidence before acting on it fully.`,
      positive: `You ground your genuine intuitive insight in concrete evidence, and deep perceptive skill becomes a trusted professional asset instead of a source of confusion.`,
      negative: `Real, inherited intuitive skill loses professional trust if an old pattern of unclear, anxious uncertainty keeps clouding an otherwise accurate read.`,
    },

    // ── 19 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '19_MEP': {
      heading: `You Carry Real, Inherited Competence in Joyful, Life-Affirming, Public Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in visible, celebratory, or life-affirming professions — earning through radiance, natural warmth, and a real gift for making people feel genuinely good. The Sun sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of performing that joy even when the underlying professional picture feels uncertain, letting genuine warmth cover concerns that need real attention. If you'd rarely let colleagues see you actually struggling professionally, that old performance may be worth addressing.`,
      path: `This may shift by letting one real professional difficulty be visible to a trusted colleague this week, instead of managing it entirely behind your usual brightness.`,
      positive: `You let real professional difficulty be visible sometimes, and the support that follows makes your genuine warmth sustainable instead of a constant performance.`,
      negative: `Real, inherited warmth becomes an exhausting performance if an old pattern of hiding professional struggle behind it never gets addressed directly.`,
    },

    // ── 20 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '20_MEP': {
      heading: `You Carry Real, Inherited Competence in Awakening and Advocacy Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in calling-oriented professions — earning through advocacy, spiritual guidance, or work that helps other people recognize something they'd been avoiding. The Judgement sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of delaying your own necessary professional calls to action, applying your gift for waking others up while leaving your own overdue changes untouched. If you can see clearly what a colleague or client needs to face but avoid facing your own equivalent, that old delay may be worth addressing.`,
      path: `This may shift by acting on one piece of professional clarity you've already reached about your own path, rather than continuing to delay it.`,
      positive: `You act on your own overdue professional clarity as readily as you help others act on theirs, and your genuine gift for advocacy finally includes yourself.`,
      negative: `Real, inherited skill at awakening others to what they're avoiding loses its full value if an old pattern of self-delay keeps your own equivalent untouched.`,
    },

    // ── 21 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '21_MEP': {
      heading: `You Carry Real, Inherited Competence in Large-Scale, Integrative Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in big-picture or synthesizing professions — earning through pulling disparate pieces into a coherent whole, work with real scope and reach. The World sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of never letting a project feel finished, relativizing genuine professional completions in favor of an ever-larger picture. If you can't recall the last time a big project felt fully, simply done, that old extension may be worth addressing.`,
      path: `This may shift by naming one large project that is, in practical terms, already complete, and letting it count as finished rather than extending it further.`,
      positive: `You let genuinely complete large-scale work actually count as finished, and your real integrative skill gets to be felt as the accomplishment it is.`,
      negative: `Real, inherited skill at large-scale synthesis rarely gets to feel complete if an old pattern of extension keeps relativizing every finish line.`,
    },

    // ── 22 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '22_MEP': {
      heading: `You Carry Real, Inherited Competence in Unconventional, Freedom-Based Work`,
      why: `Your money entry point reflects a genuine, carried-over competence in pioneering or independent professions — earning through courage, adaptability, and a real willingness to build a path that doesn't already exist. The Fool sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of leaping professionally without building the groundwork that would let the leap actually land, letting genuine courage substitute for preparation. If your unconventional career moves tend to work out through luck rather than groundwork, that old pattern may be worth addressing.`,
      path: `This may shift by pairing your next unconventional professional move with one concrete piece of preparation, rather than trusting the landing to courage alone.`,
      positive: `You pair your genuine pioneering courage with real preparation, and unconventional career moves land on solid ground instead of depending on luck.`,
      negative: `Real, inherited courage for unconventional paths depends too heavily on luck if an old pattern of leaping without groundwork never gets addressed.`,
    },

    // ── 1 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_F1': {
      heading: `A Venture Your Father's Male Line Never Got to Fully Launch Is Now Yours to Start`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Paternal Masculine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea.`,
      positive: `You launch what your paternal line only ever wanted to, turning an inherited unfinished dream into something real and actually built.`,
      negative: `An inherited pull to start something, never followed through, keeps repeating an old incompleteness instead of finally resolving it.`,
    },

    // ── 2 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_F1': {
      heading: `Trusting Your Own Instinct Where a Male Ancestor Couldn't Is Now Yours to Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real inner knowing that circumstance, expectation, or a demand for constant rationality never allowed to be trusted or acted on. The High Priestess sits in your Paternal Masculine Line, meaning this generation's task may be to trust intuition the way that line never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it.`,
      positive: `You trust and act on your own instinct freely, completing a permission the men in your line never got to give themselves.`,
      negative: `Consistently overriding real instinct in favor of what's provable repeats the same silencing this inherited task exists to finally resolve.`,
    },

    // ── 3 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_F1': {
      heading: `A Softer, More Creative Side of Yourself Was Denied Further Back and Is Now Yours to Live`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for creativity, nurture, or open warmth that rigid expectations of masculinity never allowed to be expressed. The Empress sits in your Paternal Masculine Line, meaning this generation's task may be to live openly what that line had to keep hidden.`,
      shadow: `The risk is inheriting the same suppression in a new form — real creative or nurturing capacity present in you, but kept private or minimized out of an old, unexamined caution. If your gentler, more generative side rarely gets to show fully, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or warmth openly in one specific setting this week, without softening or hiding it as you might by habit.`,
      positive: `You express real creativity and warmth openly, completing a permission the men in your line were never given to show that side of themselves.`,
      negative: `Keeping genuine creative or nurturing capacity minimized or hidden repeats the same old suppression this inherited task exists to finally resolve.`,
    },

    // ── 4 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_F1': {
      heading: `A Kind of Authority That Was Never Claimed, or Was Claimed Too Harshly, Is Now Yours to Balance`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — real leadership potential either never claimed at all, or claimed in a way that curdled into harshness rather than genuine authority. The Emperor sits in your Paternal Masculine Line, meaning this generation's task may be to hold authority in a way that line never managed to.`,
      shadow: `The risk is repeating whichever half of the imbalance was more prominent — either avoiding authority entirely out of fear of becoming harsh, or gripping control too tightly the way an ancestor once did. If your relationship to leadership swings toward one of these extremes, that old imbalance may still be running.`,
      path: `This may shift by taking on one piece of real responsibility this week, leading it with firmness and genuine care held together, not one at the expense of the other.`,
      positive: `You hold real authority with both firmness and care, completing a balance the men in your line never quite managed to find.`,
      negative: `Swinging toward either avoiding authority entirely or gripping it too tightly repeats an old imbalance this inherited task exists to finally resolve.`,
    },

    // ── 5 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_F1': {
      heading: `A Calling to Teach or Guide Others Was Set Aside and Is Now Yours to Answer`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected path. The Hierophant sits in your Paternal Masculine Line, meaning this generation's task may be to actually answer a calling that line had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such.`,
      positive: `You claim your calling to teach or guide fully, completing something the men in your line had to set aside for a more conventional path.`,
      negative: `Offering guidance informally without ever fully claiming the calling repeats the same setting-aside this inherited task exists to finally resolve.`,
    },

    // ── 6 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_F1': {
      heading: `A Love Chosen for Duty Instead of the Heart Is Now Yours to Choose Freely`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Paternal Masculine Line, meaning this generation's task may be to choose love from genuine preference where that line couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice.`,
      positive: `You choose partnership from genuine desire rather than duty, completing a freedom the men in your line never got to exercise for themselves.`,
      negative: `Choosing relationships primarily out of duty or expectation repeats the same sacrifice this inherited task exists to finally resolve.`,
    },

    // ── 7 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_F1': {
      heading: `A Goal Interrupted Partway Through Is Now Yours to Actually Finish`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Paternal Masculine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted.`,
      positive: `You carry a stalled ambition all the way to completion, resolving an interruption the men in your line never got the chance to finish.`,
      negative: `Ambitions that keep stalling just short of completion repeat an old interruption instead of finally carrying it through.`,
    },

    // ── 8 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_F1': {
      heading: `An Old Unresolved Unfairness in Your Father's Line Is Now Yours to Actually Settle`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Paternal Masculine Line, meaning this generation's task may be to bring genuine resolution to something that line had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness in your paternal line actually was, and consciously choosing to resolve rather than continue carrying it.`,
      positive: `You bring genuine resolution to an old, unresolved unfairness, settling something the men in your line had to leave standing.`,
      negative: `An unexamined, inherited sensitivity to unfairness keeps reacting to the present with an intensity that actually belongs to something older, unresolved.`,
    },

    // ── 9 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_F1': {
      heading: `A Need for Real Solitude, Never Once Permitted, Is Now Yours to Finally Claim`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Paternal Masculine Line, meaning this generation's task may be to claim the solitude that line was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first.`,
      positive: `You claim real solitude without guilt, completing a permission the men in your line were never able to give themselves.`,
      negative: `Filling every space with obligation, unable to justify solitude even when it's genuinely needed, repeats a pattern this inherited task exists to resolve.`,
    },

    // ── 10 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_F1': {
      heading: `A Plan Derailed by Circumstance Beyond Anyone's Control Is Now Yours to Make Peace With`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Paternal Masculine Line, meaning this generation's task may be to find peace with life's turns where that line couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it.`,
      positive: `You meet life's unpredictable turns with genuine acceptance, resolving a resistance the men in your line were never able to release.`,
      negative: `Treating every uncontrollable turn as personal injustice repeats an old resistance this inherited task exists to finally settle.`,
    },

    // ── 11 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_F1': {
      heading: `A Strength That Includes Gentleness, Not Just Toughness, Is Now Yours to Embody`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for compassionate strength, overridden by a demand to appear tough, unaffected, or hardened instead. The Strength sits in your Paternal Masculine Line, meaning this generation's task may be to lead with a strength that line was only allowed to show as harshness.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as toughness, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it.`,
      positive: `You lead with strength that includes real gentleness, completing a fuller version of resilience the men in your line were only allowed to harden.`,
      negative: `Expressing strength only as toughness, without its gentler counterpart, repeats an old hardening this inherited task exists to soften.`,
    },

    // ── 12 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_F1': {
      heading: `A Life Given Entirely to Others' Needs, Never His Own, Is Now Yours to Rebalance`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Paternal Masculine Line, meaning this generation's task may be to reclaim active choice for yourself where that line only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's.`,
      positive: `You prioritize your own needs alongside your care for others, completing a balance the men in your line never got the chance to claim.`,
      negative: `A life shaped entirely around others' needs, with your own perpetually unconsidered, repeats an imbalance this inherited task exists to resolve.`,
    },

    // ── 13 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_F1': {
      heading: `A Change Resisted Until the End Is Now Yours to Complete Instead of Avoid`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Paternal Masculine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way that line did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it.`,
      positive: `You meet necessary endings directly instead of resisting them, completing a transformation the men in your line were never able to face.`,
      negative: `Holding onto what's already finished simply because letting go feels dangerous repeats an old resistance this inherited task exists to resolve.`,
    },

    // ── 14 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_F1': {
      heading: `A Life Lost to Extremes Instead of Balance Is Now Yours to Steady`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, excess, or rigid self-denial. The Temperance sits in your Paternal Masculine Line, meaning this generation's task may be to find the steadiness that line's life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or excess, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme.`,
      positive: `You hold a genuinely steady, moderate rhythm, completing a balance the men in your line's lives were never actually able to find.`,
      negative: `Swinging between overexertion and collapse repeats an old imbalance this inherited task exists to finally settle.`,
    },

    // ── 15 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_F1': {
      heading: `A Bind That Felt Impossible to Break Is Now Yours to Actually Release`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real entrapment, whether addiction, compulsion, or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Paternal Masculine Line, meaning this generation's task may be to release a bind that line was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a substance, a pattern, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed.`,
      positive: `You actually release a bind that felt permanent, completing a freedom the men in your line were never able to reach.`,
      negative: `Accepting a compulsive bind as simply how things are, without ever questioning it, repeats an entrapment this inherited task exists to release.`,
    },

    // ── 16 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_F1': {
      heading: `A Sudden Collapse That Was Never Fully Rebuilt Is Now Yours to Finish Rebuilding`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Paternal Masculine Line, meaning this generation's task may be to complete a reconstruction that line started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse.`,
      positive: `You fully rebuild and invest in real stability, completing a reconstruction the men in your line were never able to finish.`,
      negative: `Holding back from real stability, bracing for a collapse that already happened once, repeats an incomplete rebuilding this task exists to finish.`,
    },

    // ── 17 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_F1': {
      heading: `A Hope Abandoned After Disappointment Is Now Yours to Restore`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Paternal Masculine Line, meaning this generation's task may be to restore a hope that line felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it.`,
      positive: `You restore genuine hope and act on it, completing something the men in your line felt they had to abandon after real disappointment.`,
      negative: `Guarding against hope as protection from disappointment repeats an old abandonment this inherited task exists to restore.`,
    },

    // ── 18 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_F1': {
      heading: `A Fear Never Faced Directly Is Now Yours to Finally See Clearly`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Paternal Masculine Line, meaning this generation's task may be to see clearly what that line could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it.`,
      positive: `You see a long-unexamined fear clearly and directly, completing a clarity the men in your line were never able to reach.`,
      negative: `An unnamed anxiety shaping decisions from the background, never faced directly, repeats an old obscurity this inherited task exists to clear.`,
    },

    // ── 19 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_F1': {
      heading: `A Joy Kept Hidden Behind Stoicism Is Now Yours to Let Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for open joy and warmth, kept behind a wall of stoicism or emotional reserve considered proper or necessary. The Sun sits in your Paternal Masculine Line, meaning this generation's task may be to let visible joy exist where that line only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a controlled surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure.`,
      positive: `You let real joy be openly visible, completing a warmth the men in your line felt but were never permitted to show.`,
      negative: `Keeping genuine happiness behind a controlled, stoic surface repeats an old restraint this inherited task exists to finally release.`,
    },

    // ── 20 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_F1': {
      heading: `A Calling Never Answered Is Now Yours to Finally Take Up`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Paternal Masculine Line, meaning this generation's task may be to answer a call that line heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it.`,
      positive: `You answer a calling directly, completing an awakening the men in your line sensed but were never able to fully take up.`,
      negative: `Sensing a real calling and continuing to delay acting on it repeats an old unanswered call this inherited task exists to finally take up.`,
    },

    // ── 21 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_F1': {
      heading: `Something Left Permanently Unfinished Is Now Yours to Actually Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Paternal Masculine Line, meaning this generation's task may be to reach a completion that line never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further.`,
      positive: `You complete something fully and let it be finished, resolving an incompletion the men in your line were never able to reach the end of.`,
      negative: `Real progress that never quite gets to feel finished repeats an old incompletion this inherited task exists to actually close out.`,
    },

    // ── 22 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_F1': {
      heading: `A Freedom Traded Away for Security Is Now Yours to Reclaim`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Paternal Masculine Line, meaning this generation's task may be to reclaim the freedom that line gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety.`,
      positive: `You reclaim real freedom in your own choices, completing something the men in your line traded away for security.`,
      negative: `Reflexively choosing safety over genuine freedom repeats an old trade this inherited task exists to finally reclaim.`,
    },

    // ── 1 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_G1': {
      heading: `A Venture Your Mother's Father Never Got to Fully Launch Is Now Yours to Start`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Maternal Masculine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea.`,
      positive: `You launch what your maternal grandfather only ever wanted to, turning an inherited unfinished dream into something real and actually built.`,
      negative: `An inherited pull to start something, never followed through, keeps repeating an old incompleteness instead of finally resolving it.`,
    },

    // ── 2 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_G1': {
      heading: `Trusting Your Own Instinct Where Your Mother's Father Couldn't Is Now Yours to Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real inner knowing that circumstance, expectation, or a demand for constant rationality never allowed to be trusted or acted on. The High Priestess sits in your Maternal Masculine Line, meaning this generation's task may be to trust intuition the way he never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it.`,
      positive: `You trust and act on your own instinct freely, completing a permission your mother's father never got to give himself.`,
      negative: `Consistently overriding real instinct in favor of what's provable repeats the same silencing this inherited task exists to finally resolve.`,
    },

    // ── 3 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_G1': {
      heading: `A Softer, More Creative Side of Your Mother's Father Was Denied and Is Now Yours to Live`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for creativity, nurture, or open warmth that rigid expectations of masculinity never allowed him to express. The Empress sits in your Maternal Masculine Line, meaning this generation's task may be to live openly what he had to keep hidden.`,
      shadow: `The risk is inheriting the same suppression in a new form — real creative or nurturing capacity present in you, but kept private or minimized out of an old, unexamined caution. If your gentler, more generative side rarely gets to show fully, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or warmth openly in one specific setting this week, without softening or hiding it as you might by habit.`,
      positive: `You express real creativity and warmth openly, completing a permission your mother's father was never given to show that side of himself.`,
      negative: `Keeping genuine creative or nurturing capacity minimized or hidden repeats the same old suppression this inherited task exists to finally resolve.`,
    },

    // ── 4 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_G1': {
      heading: `A Kind of Authority Your Mother's Father Never Balanced Is Now Yours to Hold Well`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — real leadership potential either never claimed at all, or claimed in a way that curdled into harshness rather than genuine authority. The Emperor sits in your Maternal Masculine Line, meaning this generation's task may be to hold authority in a way he never managed to.`,
      shadow: `The risk is repeating whichever half of the imbalance was more prominent — either avoiding authority entirely out of fear of becoming harsh, or gripping control too tightly the way he once did. If your relationship to leadership swings toward one of these extremes, that old imbalance may still be running.`,
      path: `This may shift by taking on one piece of real responsibility this week, leading it with firmness and genuine care held together, not one at the expense of the other.`,
      positive: `You hold real authority with both firmness and care, completing a balance your mother's father never quite managed to find.`,
      negative: `Swinging toward either avoiding authority entirely or gripping it too tightly repeats an old imbalance this inherited task exists to finally resolve.`,
    },

    // ── 5 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_G1': {
      heading: `A Calling to Teach or Guide Others Was Set Aside by Your Mother's Father and Is Now Yours to Answer`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected path. The Hierophant sits in your Maternal Masculine Line, meaning this generation's task may be to actually answer a calling he had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such.`,
      positive: `You claim your calling to teach or guide fully, completing something your mother's father had to set aside for a more conventional path.`,
      negative: `Offering guidance informally without ever fully claiming the calling repeats the same setting-aside this inherited task exists to finally resolve.`,
    },

    // ── 6 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_G1': {
      heading: `A Love Your Mother's Father Chose for Duty Instead of the Heart Is Now Yours to Choose Freely`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Maternal Masculine Line, meaning this generation's task may be to choose love from genuine preference where he couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice.`,
      positive: `You choose partnership from genuine desire rather than duty, completing a freedom your mother's father never got to exercise for himself.`,
      negative: `Choosing relationships primarily out of duty or expectation repeats the same sacrifice this inherited task exists to finally resolve.`,
    },

    // ── 7 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_G1': {
      heading: `A Goal Your Mother's Father Left Interrupted Is Now Yours to Actually Finish`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Maternal Masculine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted.`,
      positive: `You carry a stalled ambition all the way to completion, resolving an interruption your mother's father never got the chance to finish.`,
      negative: `Ambitions that keep stalling just short of completion repeat an old interruption instead of finally carrying it through.`,
    },

    // ── 8 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_G1': {
      heading: `An Old Unresolved Unfairness in Your Mother's Father's Life Is Now Yours to Actually Settle`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Maternal Masculine Line, meaning this generation's task may be to bring genuine resolution to something he had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it.`,
      positive: `You bring genuine resolution to an old, unresolved unfairness, settling something your mother's father had to leave standing.`,
      negative: `An unexamined, inherited sensitivity to unfairness keeps reacting to the present with an intensity that actually belongs to something older, unresolved.`,
    },

    // ── 9 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_G1': {
      heading: `A Need for Real Solitude Your Mother's Father Never Got Is Now Yours to Finally Claim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Maternal Masculine Line, meaning this generation's task may be to claim the solitude he was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first.`,
      positive: `You claim real solitude without guilt, completing a permission your mother's father was never able to give himself.`,
      negative: `Filling every space with obligation, unable to justify solitude even when it's genuinely needed, repeats a pattern this inherited task exists to resolve.`,
    },

    // ── 10 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_G1': {
      heading: `A Plan Your Mother's Father Saw Derailed Is Now Yours to Make Peace With`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Maternal Masculine Line, meaning this generation's task may be to find peace with life's turns where he couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it.`,
      positive: `You meet life's unpredictable turns with genuine acceptance, resolving a resistance your mother's father was never able to release.`,
      negative: `Treating every uncontrollable turn as personal injustice repeats an old resistance this inherited task exists to finally settle.`,
    },

    // ── 11 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_G1': {
      heading: `A Strength That Includes Gentleness Is Now Yours to Embody Where Your Mother's Father Only Showed Toughness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for compassionate strength, overridden by a demand to appear tough, unaffected, or hardened instead. The Strength sits in your Maternal Masculine Line, meaning this generation's task may be to lead with a strength he was only allowed to show as harshness.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as toughness, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it.`,
      positive: `You lead with strength that includes real gentleness, completing a fuller version of resilience your mother's father was only allowed to harden.`,
      negative: `Expressing strength only as toughness, without its gentler counterpart, repeats an old hardening this inherited task exists to soften.`,
    },

    // ── 12 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_G1': {
      heading: `A Life Your Mother's Father Gave Entirely to Others Is Now Yours to Rebalance`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Maternal Masculine Line, meaning this generation's task may be to reclaim active choice for yourself where he only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's.`,
      positive: `You prioritize your own needs alongside your care for others, completing a balance your mother's father never got the chance to claim.`,
      negative: `A life shaped entirely around others' needs, with your own perpetually unconsidered, repeats an imbalance this inherited task exists to resolve.`,
    },

    // ── 13 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_G1': {
      heading: `A Change Your Mother's Father Resisted Until the End Is Now Yours to Complete Instead of Avoid`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Maternal Masculine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way he did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it.`,
      positive: `You meet necessary endings directly instead of resisting them, completing a transformation your mother's father was never able to face.`,
      negative: `Holding onto what's already finished simply because letting go feels dangerous repeats an old resistance this inherited task exists to resolve.`,
    },

    // ── 14 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_G1': {
      heading: `A Life Your Mother's Father Lost to Extremes Is Now Yours to Steady`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, excess, or rigid self-denial. The Temperance sits in your Maternal Masculine Line, meaning this generation's task may be to find the steadiness his life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or excess, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme.`,
      positive: `You hold a genuinely steady, moderate rhythm, completing a balance your mother's father's life was never actually able to find.`,
      negative: `Swinging between overexertion and collapse repeats an old imbalance this inherited task exists to finally settle.`,
    },

    // ── 15 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_G1': {
      heading: `A Bind Your Mother's Father Never Broke Is Now Yours to Actually Release`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real entrapment, whether addiction, compulsion, or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Maternal Masculine Line, meaning this generation's task may be to release a bind he was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a substance, a pattern, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed.`,
      positive: `You actually release a bind that felt permanent, completing a freedom your mother's father was never able to reach.`,
      negative: `Accepting a compulsive bind as simply how things are, without ever questioning it, repeats an entrapment this inherited task exists to release.`,
    },

    // ── 16 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_G1': {
      heading: `A Collapse Your Mother's Father Never Fully Rebuilt From Is Now Yours to Finish Rebuilding`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Maternal Masculine Line, meaning this generation's task may be to complete a reconstruction he started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse.`,
      positive: `You fully rebuild and invest in real stability, completing a reconstruction your mother's father was never able to finish.`,
      negative: `Holding back from real stability, bracing for a collapse that already happened once, repeats an incomplete rebuilding this task exists to finish.`,
    },

    // ── 17 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_G1': {
      heading: `A Hope Your Mother's Father Abandoned Is Now Yours to Restore`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Maternal Masculine Line, meaning this generation's task may be to restore a hope he felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it.`,
      positive: `You restore genuine hope and act on it, completing something your mother's father felt he had to abandon after real disappointment.`,
      negative: `Guarding against hope as protection from disappointment repeats an old abandonment this inherited task exists to restore.`,
    },

    // ── 18 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_G1': {
      heading: `A Fear Your Mother's Father Never Faced Is Now Yours to Finally See Clearly`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Maternal Masculine Line, meaning this generation's task may be to see clearly what he could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it.`,
      positive: `You see a long-unexamined fear clearly and directly, completing a clarity your mother's father was never able to reach.`,
      negative: `An unnamed anxiety shaping decisions from the background, never faced directly, repeats an old obscurity this inherited task exists to clear.`,
    },

    // ── 19 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_G1': {
      heading: `A Joy Your Mother's Father Kept Hidden Behind Stoicism Is Now Yours to Let Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for open joy and warmth, kept behind a wall of stoicism or emotional reserve considered proper or necessary. The Sun sits in your Maternal Masculine Line, meaning this generation's task may be to let visible joy exist where he only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a controlled surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure.`,
      positive: `You let real joy be openly visible, completing a warmth your mother's father felt but was never permitted to show.`,
      negative: `Keeping genuine happiness behind a controlled, stoic surface repeats an old restraint this inherited task exists to finally release.`,
    },

    // ── 20 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_G1': {
      heading: `A Calling Your Mother's Father Never Answered Is Now Yours to Finally Take Up`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Maternal Masculine Line, meaning this generation's task may be to answer a call he heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it.`,
      positive: `You answer a calling directly, completing an awakening your mother's father sensed but was never able to fully take up.`,
      negative: `Sensing a real calling and continuing to delay acting on it repeats an old unanswered call this inherited task exists to finally take up.`,
    },

    // ── 21 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_G1': {
      heading: `Something Your Mother's Father Left Permanently Unfinished Is Now Yours to Actually Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Maternal Masculine Line, meaning this generation's task may be to reach a completion he never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further.`,
      positive: `You complete something fully and let it be finished, resolving an incompletion your mother's father was never able to reach the end of.`,
      negative: `Real progress that never quite gets to feel finished repeats an old incompletion this inherited task exists to actually close out.`,
    },

    // ── 22 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_G1': {
      heading: `A Freedom Your Mother's Father Traded Away Is Now Yours to Reclaim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Maternal Masculine Line, meaning this generation's task may be to reclaim the freedom he gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety.`,
      positive: `You reclaim real freedom in your own choices, completing something your mother's father traded away for security.`,
      negative: `Reflexively choosing safety over genuine freedom repeats an old trade this inherited task exists to finally reclaim.`,
    },

    // ── 1 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_H1': {
      heading: `A Venture Your Father's Mother Never Got to Fully Launch Is Now Yours to Start`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Paternal Feminine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea.`,
      positive: `You launch what your paternal grandmother only ever wanted to, turning an inherited unfinished dream into something real and actually built.`,
      negative: `An inherited pull to start something, never followed through, keeps repeating an old incompleteness instead of finally resolving it.`,
    },

    // ── 2 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_H1': {
      heading: `Trusting Your Own Instinct Where Your Father's Mother Couldn't Is Now Yours to Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real inner knowing that circumstance, expectation, or a demand for constant practicality never allowed to be trusted or acted on. The High Priestess sits in your Paternal Feminine Line, meaning this generation's task may be to trust intuition the way she never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it.`,
      positive: `You trust and act on your own instinct freely, completing a permission your father's mother never got to give herself.`,
      negative: `Consistently overriding real instinct in favor of what's provable repeats the same silencing this inherited task exists to finally resolve.`,
    },

    // ── 3 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_H1': {
      heading: `A Creative Ambition of Your Father's Mother Was Set Aside and Is Now Yours to Live`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for creativity, nurture, or generative abundance that circumstance or expectation never allowed her to fully express beyond the domestic sphere. The Empress sits in your Paternal Feminine Line, meaning this generation's task may be to live openly what she had to keep contained.`,
      shadow: `The risk is inheriting the same containment — real creative or nurturing capacity present in you, but kept small or minimized out of an old, unexamined caution. If your gifts rarely get to expand beyond what feels safely modest, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or generosity at full scale in one specific setting this week, without shrinking it as you might by habit.`,
      positive: `You express real creativity and abundance at full scale, completing a permission your father's mother was never given to expand into.`,
      negative: `Keeping genuine creative or nurturing capacity contained and small repeats the same old suppression this inherited task exists to finally resolve.`,
    },

    // ── 4 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_H1': {
      heading: `An Authority Your Father's Mother Never Got to Claim Is Now Yours to Hold Well`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — real leadership potential either never claimed at all, or exercised quietly behind the scenes rather than openly. The Emperor sits in your Paternal Feminine Line, meaning this generation's task may be to hold visible authority in a way she never got to.`,
      shadow: `The risk is repeating the same pattern of influence without visibility — real capability exercised behind the scenes, never claimed openly as leadership in its own right. If you tend to manage things quietly rather than lead them visibly, that old pattern may still be running.`,
      path: `This may shift by taking on one piece of real, visible responsibility this week, leading it openly rather than managing it from behind the scenes.`,
      positive: `You hold visible authority openly, completing a claim to leadership your father's mother was never able to make for herself.`,
      negative: `Managing real capability quietly from behind the scenes, rather than claiming visible leadership, repeats an old pattern this task exists to resolve.`,
    },

    // ── 5 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_H1': {
      heading: `A Calling to Teach or Guide Others Was Set Aside by Your Father's Mother and Is Now Yours to Answer`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected role. The Hierophant sits in your Paternal Feminine Line, meaning this generation's task may be to actually answer a calling she had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such.`,
      positive: `You claim your calling to teach or guide fully, completing something your father's mother had to set aside for a more conventional role.`,
      negative: `Offering guidance informally without ever fully claiming the calling repeats the same setting-aside this inherited task exists to finally resolve.`,
    },

    // ── 6 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_H1': {
      heading: `A Love Your Father's Mother Chose for Duty Instead of the Heart Is Now Yours to Choose Freely`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Paternal Feminine Line, meaning this generation's task may be to choose love from genuine preference where she couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice.`,
      positive: `You choose partnership from genuine desire rather than duty, completing a freedom your father's mother never got to exercise for herself.`,
      negative: `Choosing relationships primarily out of duty or expectation repeats the same sacrifice this inherited task exists to finally resolve.`,
    },

    // ── 7 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_H1': {
      heading: `A Goal Your Father's Mother Left Interrupted Is Now Yours to Actually Finish`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Paternal Feminine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted.`,
      positive: `You carry a stalled ambition all the way to completion, resolving an interruption your father's mother never got the chance to finish.`,
      negative: `Ambitions that keep stalling just short of completion repeat an old interruption instead of finally carrying it through.`,
    },

    // ── 8 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_H1': {
      heading: `An Old Unresolved Unfairness in Your Father's Mother's Life Is Now Yours to Actually Settle`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Paternal Feminine Line, meaning this generation's task may be to bring genuine resolution to something she had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it.`,
      positive: `You bring genuine resolution to an old, unresolved unfairness, settling something your father's mother had to leave standing.`,
      negative: `An unexamined, inherited sensitivity to unfairness keeps reacting to the present with an intensity that actually belongs to something older, unresolved.`,
    },

    // ── 9 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_H1': {
      heading: `A Need for Real Solitude Your Father's Mother Never Got Is Now Yours to Finally Claim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Paternal Feminine Line, meaning this generation's task may be to claim the solitude she was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first.`,
      positive: `You claim real solitude without guilt, completing a permission your father's mother was never able to give herself.`,
      negative: `Filling every space with obligation, unable to justify solitude even when it's genuinely needed, repeats a pattern this inherited task exists to resolve.`,
    },

    // ── 10 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_H1': {
      heading: `A Plan Your Father's Mother Saw Derailed Is Now Yours to Make Peace With`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Paternal Feminine Line, meaning this generation's task may be to find peace with life's turns where she couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it.`,
      positive: `You meet life's unpredictable turns with genuine acceptance, resolving a resistance your father's mother was never able to release.`,
      negative: `Treating every uncontrollable turn as personal injustice repeats an old resistance this inherited task exists to finally settle.`,
    },

    // ── 11 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_H1': {
      heading: `A Strength That Includes Gentleness Is Now Yours to Embody Where Your Father's Mother Only Showed Toughness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for compassionate strength, overridden by a demand to appear unshaken, endlessly capable, or hardened instead. The Strength sits in your Paternal Feminine Line, meaning this generation's task may be to lead with a strength she was only allowed to show as endurance.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as endurance, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it.`,
      positive: `You lead with strength that includes real gentleness, completing a fuller version of resilience your father's mother was only allowed to harden.`,
      negative: `Expressing strength only as endurance, without its gentler counterpart, repeats an old hardening this inherited task exists to soften.`,
    },

    // ── 12 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_H1': {
      heading: `A Life Your Father's Mother Gave Entirely to Others Is Now Yours to Rebalance`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Paternal Feminine Line, meaning this generation's task may be to reclaim active choice for yourself where she only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's.`,
      positive: `You prioritize your own needs alongside your care for others, completing a balance your father's mother never got the chance to claim.`,
      negative: `A life shaped entirely around others' needs, with your own perpetually unconsidered, repeats an imbalance this inherited task exists to resolve.`,
    },

    // ── 13 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_H1': {
      heading: `A Change Your Father's Mother Resisted Until the End Is Now Yours to Complete Instead of Avoid`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Paternal Feminine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way she did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it.`,
      positive: `You meet necessary endings directly instead of resisting them, completing a transformation your father's mother was never able to face.`,
      negative: `Holding onto what's already finished simply because letting go feels dangerous repeats an old resistance this inherited task exists to resolve.`,
    },

    // ── 14 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_H1': {
      heading: `A Life Your Father's Mother Lost to Extremes Is Now Yours to Steady`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, self-denial, or relentless caretaking. The Temperance sits in your Paternal Feminine Line, meaning this generation's task may be to find the steadiness her life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or depletion, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme.`,
      positive: `You hold a genuinely steady, moderate rhythm, completing a balance your father's mother's life was never actually able to find.`,
      negative: `Swinging between overexertion and collapse repeats an old imbalance this inherited task exists to finally settle.`,
    },

    // ── 15 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_H1': {
      heading: `A Bind Your Father's Mother Never Broke Is Now Yours to Actually Release`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real entrapment, whether a compulsion or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Paternal Feminine Line, meaning this generation's task may be to release a bind she was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a pattern, a role, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed.`,
      positive: `You actually release a bind that felt permanent, completing a freedom your father's mother was never able to reach.`,
      negative: `Accepting a compulsive bind as simply how things are, without ever questioning it, repeats an entrapment this inherited task exists to release.`,
    },

    // ── 16 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_H1': {
      heading: `A Collapse Your Father's Mother Never Fully Rebuilt From Is Now Yours to Finish Rebuilding`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Paternal Feminine Line, meaning this generation's task may be to complete a reconstruction she started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse.`,
      positive: `You fully rebuild and invest in real stability, completing a reconstruction your father's mother was never able to finish.`,
      negative: `Holding back from real stability, bracing for a collapse that already happened once, repeats an incomplete rebuilding this task exists to finish.`,
    },

    // ── 17 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_H1': {
      heading: `A Hope Your Father's Mother Abandoned Is Now Yours to Restore`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Paternal Feminine Line, meaning this generation's task may be to restore a hope she felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it.`,
      positive: `You restore genuine hope and act on it, completing something your father's mother felt she had to abandon after real disappointment.`,
      negative: `Guarding against hope as protection from disappointment repeats an old abandonment this inherited task exists to restore.`,
    },

    // ── 18 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_H1': {
      heading: `A Fear Your Father's Mother Never Faced Is Now Yours to Finally See Clearly`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Paternal Feminine Line, meaning this generation's task may be to see clearly what she could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it.`,
      positive: `You see a long-unexamined fear clearly and directly, completing a clarity your father's mother was never able to reach.`,
      negative: `An unnamed anxiety shaping decisions from the background, never faced directly, repeats an old obscurity this inherited task exists to clear.`,
    },

    // ── 19 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_H1': {
      heading: `A Joy Your Father's Mother Kept Hidden Is Now Yours to Let Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for open joy and warmth, kept behind quiet composure considered proper or necessary. The Sun sits in your Paternal Feminine Line, meaning this generation's task may be to let visible joy exist where she only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a composed surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure.`,
      positive: `You let real joy be openly visible, completing a warmth your father's mother felt but was never permitted to show.`,
      negative: `Keeping genuine happiness behind a controlled, composed surface repeats an old restraint this inherited task exists to finally release.`,
    },

    // ── 20 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_H1': {
      heading: `A Calling Your Father's Mother Never Answered Is Now Yours to Finally Take Up`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Paternal Feminine Line, meaning this generation's task may be to answer a call she heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it.`,
      positive: `You answer a calling directly, completing an awakening your father's mother sensed but was never able to fully take up.`,
      negative: `Sensing a real calling and continuing to delay acting on it repeats an old unanswered call this inherited task exists to finally take up.`,
    },

    // ── 21 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_H1': {
      heading: `Something Your Father's Mother Left Permanently Unfinished Is Now Yours to Actually Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Paternal Feminine Line, meaning this generation's task may be to reach a completion she never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further.`,
      positive: `You complete something fully and let it be finished, resolving an incompletion your father's mother was never able to reach the end of.`,
      negative: `Real progress that never quite gets to feel finished repeats an old incompletion this inherited task exists to actually close out.`,
    },

    // ── 22 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_H1': {
      heading: `A Freedom Your Father's Mother Traded Away Is Now Yours to Reclaim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Paternal Feminine Line, meaning this generation's task may be to reclaim the freedom she gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety.`,
      positive: `You reclaim real freedom in your own choices, completing something your father's mother traded away for security.`,
      negative: `Reflexively choosing safety over genuine freedom repeats an old trade this inherited task exists to finally reclaim.`,
    },

    // ── 1 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_I1': {
      heading: `A Venture Your Mother's Mother Never Got to Fully Launch Is Now Yours to Start`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Maternal Feminine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea.`,
      positive: `You launch what your maternal grandmother only ever wanted to, turning an inherited unfinished dream into something real and actually built.`,
      negative: `An inherited pull to start something, never followed through, keeps repeating an old incompleteness instead of finally resolving it.`,
    },

    // ── 2 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_I1': {
      heading: `Trusting Your Own Instinct Where Your Mother's Mother Couldn't Is Now Yours to Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real inner knowing that circumstance, expectation, or a demand for constant practicality never allowed to be trusted or acted on. The High Priestess sits in your Maternal Feminine Line, meaning this generation's task may be to trust intuition the way she never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it.`,
      positive: `You trust and act on your own instinct freely, completing a permission your mother's mother never got to give herself.`,
      negative: `Consistently overriding real instinct in favor of what's provable repeats the same silencing this inherited task exists to finally resolve.`,
    },

    // ── 3 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_I1': {
      heading: `A Creative Ambition of Your Mother's Mother Was Set Aside and Is Now Yours to Live`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for creativity, nurture, or generative abundance that circumstance or expectation never allowed her to fully express beyond the domestic sphere. The Empress sits in your Maternal Feminine Line, meaning this generation's task may be to live openly what she had to keep contained.`,
      shadow: `The risk is inheriting the same containment — real creative or nurturing capacity present in you, but kept small or minimized out of an old, unexamined caution. If your gifts rarely get to expand beyond what feels safely modest, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or generosity at full scale in one specific setting this week, without shrinking it as you might by habit.`,
      positive: `You express real creativity and abundance at full scale, completing a permission your mother's mother was never given to expand into.`,
      negative: `Keeping genuine creative or nurturing capacity contained and small repeats the same old suppression this inherited task exists to finally resolve.`,
    },

    // ── 4 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_I1': {
      heading: `An Authority Your Mother's Mother Never Got to Claim Is Now Yours to Hold Well`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — real leadership potential either never claimed at all, or exercised quietly behind the scenes rather than openly. The Emperor sits in your Maternal Feminine Line, meaning this generation's task may be to hold visible authority in a way she never got to.`,
      shadow: `The risk is repeating the same pattern of influence without visibility — real capability exercised behind the scenes, never claimed openly as leadership in its own right. If you tend to manage things quietly rather than lead them visibly, that old pattern may still be running.`,
      path: `This may shift by taking on one piece of real, visible responsibility this week, leading it openly rather than managing it from behind the scenes.`,
      positive: `You hold visible authority openly, completing a claim to leadership your mother's mother was never able to make for herself.`,
      negative: `Managing real capability quietly from behind the scenes, rather than claiming visible leadership, repeats an old pattern this task exists to resolve.`,
    },

    // ── 5 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_I1': {
      heading: `A Calling to Teach or Guide Others Was Set Aside by Your Mother's Mother and Is Now Yours to Answer`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected role. The Hierophant sits in your Maternal Feminine Line, meaning this generation's task may be to actually answer a calling she had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such.`,
      positive: `You claim your calling to teach or guide fully, completing something your mother's mother had to set aside for a more conventional role.`,
      negative: `Offering guidance informally without ever fully claiming the calling repeats the same setting-aside this inherited task exists to finally resolve.`,
    },

    // ── 6 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_I1': {
      heading: `A Love Your Mother's Mother Chose for Duty Instead of the Heart Is Now Yours to Choose Freely`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Maternal Feminine Line, meaning this generation's task may be to choose love from genuine preference where she couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice.`,
      positive: `You choose partnership from genuine desire rather than duty, completing a freedom your mother's mother never got to exercise for herself.`,
      negative: `Choosing relationships primarily out of duty or expectation repeats the same sacrifice this inherited task exists to finally resolve.`,
    },

    // ── 7 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_I1': {
      heading: `A Goal Your Mother's Mother Left Interrupted Is Now Yours to Actually Finish`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Maternal Feminine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted.`,
      positive: `You carry a stalled ambition all the way to completion, resolving an interruption your mother's mother never got the chance to finish.`,
      negative: `Ambitions that keep stalling just short of completion repeat an old interruption instead of finally carrying it through.`,
    },

    // ── 8 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_I1': {
      heading: `An Old Unresolved Unfairness in Your Mother's Mother's Life Is Now Yours to Actually Settle`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Maternal Feminine Line, meaning this generation's task may be to bring genuine resolution to something she had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it.`,
      positive: `You bring genuine resolution to an old, unresolved unfairness, settling something your mother's mother had to leave standing.`,
      negative: `An unexamined, inherited sensitivity to unfairness keeps reacting to the present with an intensity that actually belongs to something older, unresolved.`,
    },

    // ── 9 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_I1': {
      heading: `A Need for Real Solitude Your Mother's Mother Never Got Is Now Yours to Finally Claim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Maternal Feminine Line, meaning this generation's task may be to claim the solitude she was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first.`,
      positive: `You claim real solitude without guilt, completing a permission your mother's mother was never able to give herself.`,
      negative: `Filling every space with obligation, unable to justify solitude even when it's genuinely needed, repeats a pattern this inherited task exists to resolve.`,
    },

    // ── 10 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_I1': {
      heading: `A Plan Your Mother's Mother Saw Derailed Is Now Yours to Make Peace With`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Maternal Feminine Line, meaning this generation's task may be to find peace with life's turns where she couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it.`,
      positive: `You meet life's unpredictable turns with genuine acceptance, resolving a resistance your mother's mother was never able to release.`,
      negative: `Treating every uncontrollable turn as personal injustice repeats an old resistance this inherited task exists to finally settle.`,
    },

    // ── 11 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_I1': {
      heading: `A Strength That Includes Gentleness Is Now Yours to Embody Where Your Mother's Mother Only Showed Toughness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for compassionate strength, overridden by a demand to appear unshaken, endlessly capable, or hardened instead. The Strength sits in your Maternal Feminine Line, meaning this generation's task may be to lead with a strength she was only allowed to show as endurance.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as endurance, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it.`,
      positive: `You lead with strength that includes real gentleness, completing a fuller version of resilience your mother's mother was only allowed to harden.`,
      negative: `Expressing strength only as endurance, without its gentler counterpart, repeats an old hardening this inherited task exists to soften.`,
    },

    // ── 12 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_I1': {
      heading: `A Life Your Mother's Mother Gave Entirely to Others Is Now Yours to Rebalance`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Maternal Feminine Line, meaning this generation's task may be to reclaim active choice for yourself where she only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's.`,
      positive: `You prioritize your own needs alongside your care for others, completing a balance your mother's mother never got the chance to claim.`,
      negative: `A life shaped entirely around others' needs, with your own perpetually unconsidered, repeats an imbalance this inherited task exists to resolve.`,
    },

    // ── 13 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_I1': {
      heading: `A Change Your Mother's Mother Resisted Until the End Is Now Yours to Complete Instead of Avoid`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Maternal Feminine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way she did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it.`,
      positive: `You meet necessary endings directly instead of resisting them, completing a transformation your mother's mother was never able to face.`,
      negative: `Holding onto what's already finished simply because letting go feels dangerous repeats an old resistance this inherited task exists to resolve.`,
    },

    // ── 14 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_I1': {
      heading: `A Life Your Mother's Mother Lost to Extremes Is Now Yours to Steady`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, self-denial, or relentless caretaking. The Temperance sits in your Maternal Feminine Line, meaning this generation's task may be to find the steadiness her life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or depletion, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme.`,
      positive: `You hold a genuinely steady, moderate rhythm, completing a balance your mother's mother's life was never actually able to find.`,
      negative: `Swinging between overexertion and collapse repeats an old imbalance this inherited task exists to finally settle.`,
    },

    // ── 15 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_I1': {
      heading: `A Bind Your Mother's Mother Never Broke Is Now Yours to Actually Release`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real entrapment, whether a compulsion or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Maternal Feminine Line, meaning this generation's task may be to release a bind she was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a pattern, a role, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed.`,
      positive: `You actually release a bind that felt permanent, completing a freedom your mother's mother was never able to reach.`,
      negative: `Accepting a compulsive bind as simply how things are, without ever questioning it, repeats an entrapment this inherited task exists to release.`,
    },

    // ── 16 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_I1': {
      heading: `A Collapse Your Mother's Mother Never Fully Rebuilt From Is Now Yours to Finish Rebuilding`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Maternal Feminine Line, meaning this generation's task may be to complete a reconstruction she started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse.`,
      positive: `You fully rebuild and invest in real stability, completing a reconstruction your mother's mother was never able to finish.`,
      negative: `Holding back from real stability, bracing for a collapse that already happened once, repeats an incomplete rebuilding this task exists to finish.`,
    },

    // ── 17 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_I1': {
      heading: `A Hope Your Mother's Mother Abandoned Is Now Yours to Restore`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Maternal Feminine Line, meaning this generation's task may be to restore a hope she felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it.`,
      positive: `You restore genuine hope and act on it, completing something your mother's mother felt she had to abandon after real disappointment.`,
      negative: `Guarding against hope as protection from disappointment repeats an old abandonment this inherited task exists to restore.`,
    },

    // ── 18 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_I1': {
      heading: `A Fear Your Mother's Mother Never Faced Is Now Yours to Finally See Clearly`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Maternal Feminine Line, meaning this generation's task may be to see clearly what she could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it.`,
      positive: `You see a long-unexamined fear clearly and directly, completing a clarity your mother's mother was never able to reach.`,
      negative: `An unnamed anxiety shaping decisions from the background, never faced directly, repeats an old obscurity this inherited task exists to clear.`,
    },

    // ── 19 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_I1': {
      heading: `A Joy Your Mother's Mother Kept Hidden Is Now Yours to Let Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for open joy and warmth, kept behind quiet composure considered proper or necessary. The Sun sits in your Maternal Feminine Line, meaning this generation's task may be to let visible joy exist where she only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a composed surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure.`,
      positive: `You let real joy be openly visible, completing a warmth your mother's mother felt but was never permitted to show.`,
      negative: `Keeping genuine happiness behind a controlled, composed surface repeats an old restraint this inherited task exists to finally release.`,
    },

    // ── 20 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_I1': {
      heading: `A Calling Your Mother's Mother Never Answered Is Now Yours to Finally Take Up`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Maternal Feminine Line, meaning this generation's task may be to answer a call she heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it.`,
      positive: `You answer a calling directly, completing an awakening your mother's mother sensed but was never able to fully take up.`,
      negative: `Sensing a real calling and continuing to delay acting on it repeats an old unanswered call this inherited task exists to finally take up.`,
    },

    // ── 21 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_I1': {
      heading: `Something Your Mother's Mother Left Permanently Unfinished Is Now Yours to Actually Complete`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Maternal Feminine Line, meaning this generation's task may be to reach a completion she never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further.`,
      positive: `You complete something fully and let it be finished, resolving an incompletion your mother's mother was never able to reach the end of.`,
      negative: `Real progress that never quite gets to feel finished repeats an old incompletion this inherited task exists to actually close out.`,
    },

    // ── 22 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_I1': {
      heading: `A Freedom Your Mother's Mother Traded Away Is Now Yours to Reclaim`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Maternal Feminine Line, meaning this generation's task may be to reclaim the freedom she gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety.`,
      positive: `You reclaim real freedom in your own choices, completing something your mother's mother traded away for security.`,
      negative: `Reflexively choosing safety over genuine freedom repeats an old trade this inherited task exists to finally reclaim.`,
    },

  }; // end nodes


  // ── GENERAL FALLBACK — ALL 22 ARCANA ─────────────────────────────────────

  const general = {

    1: {
      heading: `You Bring Things Into Being Just by Beginning`,
      why: `You don't wait for conditions to be perfect. Some part of you understands, on a level that doesn't need rational explanation, that the right conditions tend to show up in response to the act of starting — not before it. Wherever the Magician lives in your matrix, it marks a place where you carry, or are still discovering, a real capacity to generate reality from attention and intention. This is the frequency of pure origination — the moment before the moment, where something that didn't exist becomes possible because you moved first.`,
      shadow: `Disconnected from its source, this energy can turn into manipulation — using a very real power to shape perception and direct attention toward outcomes that serve your ego rather than what's genuinely unfolding. You might also notice a pattern of scattered starts: beginning brilliantly and then dissipating, moving to the next idea before the first has taken root, because finishing takes a different kind of energy than starting, and you haven't quite learned to supply it yet. A life full of starts that never land isn't bad timing repeating itself — it's the frequency of "beginning" being sent out again and again, with no matching signal of "sustaining" for the world to actually respond to.`,
      path: `Try grounding the gift. Ask not just "what can I bring into being," but "what am I actually willing to sustain." The tools on the Magician's table aren't decorative — they represent all four elements, all four domains of a life. Mastery comes from working with all of them, not just the ones that come naturally. Once you're genuinely broadcasting follow-through, the collaborators and conditions that can match that frequency finally have something to respond to.`,
      positive: `You generate momentum from nothing more than clear intention, and the conditions for success assemble themselves in response to a frequency of genuine follow-through, not just enthusiasm for the start.`,
      negative: `A pattern of brilliant starts that never take root is the world matching the actual frequency being sent out — the energy of beginning, offered again and again, with no matching signal of sustained commitment for reality to respond to.`,
    },

    2: {
      heading: `Your Best Guidance Arrives in Stillness`,
      why: `You know things in a way that's hard to translate into the language the outside world tends to reward — the language of proof, certainty, explicit justification. Wherever the High Priestess lives in your matrix, it marks a place governed by depth, the intelligence of your interior, and cyclical rhythms that resist being forced into straight lines of logic. Your most reliable guidance is the kind that shows up in stillness — not the kind you can argue your way to.`,
      shadow: `The shadow here is passivity wearing the costume of wisdom. There's a real difference between genuine receptivity — which is actually an active, disciplined stance — and passive withdrawal that avoids the discomfort of acting by dressing itself up as "waiting for clarity." You might also use your sensitivity as a kind of privacy screen — perceiving other people so clearly that they can't perceive you back, which feels safe but costs you real connection. If your relationships keep stopping short of real intimacy, that's often just matching the actual signal you're sending: come close enough to be understood, not close enough to be truly known.`,
      path: `Try acting from your knowing, not despite the uncertainty that always comes with it. The High Priestess doesn't wait until the mystery resolves — she steps forward inside the mystery, with it. That's the lesson: your interior intelligence isn't a substitute for engaging with the world, it's a way of engaging with it that the world genuinely needs. The more visible you let that knowing be, instead of keeping it private, the more the world starts offering back the depth of connection it's been quietly withholding to match your own reserve.`,
      positive: `Your most reliable guidance arrives in stillness, and you act on it visibly enough that the world responds in kind — real depth and understanding meeting you back at the level you were willing to first extend it.`,
      negative: `Perceiving others clearly while staying unreadable yourself keeps genuine intimacy at a careful distance — the relationships that arrive stay shallow because that's precisely the depth your own guardedness has been signaling is safe.`,
    },

    3: {
      heading: `You Give Best When You're Giving From Overflow`,
      why: `You're capable of extraordinary generosity — and you're also, quietly, still learning the difference between giving from genuine abundance and giving to manage the anxiety of needing to be needed. Wherever the Empress lives in your matrix, it marks a position infused with creative abundance: not just artistic creativity, but the generative principle itself — the capacity to bring things into being, nurture them through their stages, and hold the conditions that let other living things flourish. The Empress doesn't create from scarcity. She creates from overflow.`,
      shadow: `The trap here is the codependency of the natural nurturer — your sense of self getting so wrapped up in caretaking, in creativity-in-service-of-others, that you lose touch with what you actually want to make for yourself. You might also notice a pull toward indulgence — using sensory pleasure or creative output as a buffer against sitting with an unprocessed feeling. If your life keeps handing you people and situations that need endless tending, that's not simply bad luck — it's often responding to a quiet equation you've made between being needed and being loved, and it will keep manifesting exactly the dependents required to confirm it.`,
      path: `Try figuring out what you want to create when the creation is entirely, unapologetically for you. Not for approval. Not for someone's growth. Not to prove your value. Just because it calls to you. That's where this energy reaches its full strength — and it's also what finally changes what you draw toward you: relationships built on genuine mutual generosity instead of one person's need to be needed.`,
      positive: `You create and nurture from genuine overflow, and the relationships that reach you mirror that abundance back — connection built on mutual generosity rather than on one person's need to be needed.`,
      negative: `When your worth quietly gets tied to being needed, life tends to keep sending you people and situations that require endless tending — obligingly supplying the dependents required to keep confirming that caretaking is the price of being loved.`,
    },

    4: {
      heading: `You Build the Container Others Grow Inside`,
      why: `Wherever the Emperor lives in your matrix, it marks a place where order, authority, and structural intelligence are asking to be integrated. This isn't about imposing structure for its own sake — the deepest version of this energy comes from someone who genuinely understands why structure exists: without it, what you're building can't hold its own weight. In this part of your life, you've either inherited a very specific set of rules about how things should work, or you're being asked to build the foundational container that lets something important actually grow.`,
      shadow: `Operating from fear, this energy turns into rigidity — maintaining structure as an end in itself, even once it's stopped serving life and started containing it instead. That can look like an inability to tolerate uncertainty, enforcing rules mainly because your own sense of stability depends on them being followed, treating genuine creativity or spontaneity as a threat rather than a resource. It's worth noticing: a life full of people resisting your authority rather than recognizing it usually isn't a coincidence of difficult personalities — it's the world matching a kind of control that's coming from fear, not from real strength.`,
      path: `Try learning to tell the difference between structures that protect and structures that imprison — and have the courage to renovate the second kind without tearing down the first. Real authority doesn't need to be enforced. It gets recognized. Your work is building things strong enough to also be genuinely flexible — and the more your own relationship to authority relaxes out of fear, the less resistance you'll find yourself needing to manage in the people and structures around you.`,
      positive: `You build containers strong enough to let something important grow, and because your authority comes from genuine stability rather than fear, the people around you recognize and cooperate with it rather than resisting it.`,
      negative: `Rigid rules enforced from fear keep drawing resistance rather than recognition — the more the grip tightens to manage an internal sense of instability, the more the external world seems to rebel against it.`,
    },

    5: {
      heading: `You Carry Knowledge That's Meant to Move`,
      why: `Wherever the Hierophant lives in your matrix, it marks a place shaped by an awareness of social and spiritual codes — not as arbitrary rules, but as the accumulated crystallization of what previous generations learned the hard way. This energy carries the frequency of transmission: knowledge that moves through relationship, through teaching, through the passing of something carefully cultivated from one generation or context to the next. Your gift here is a genuine respect for what took time and difficulty to earn.`,
      shadow: `The shadow is living transmission turning into static doctrine — knowledge you defend instead of offer, tradition you enforce instead of invite people into, spiritual authority that becomes a position rather than a service. A specific trap for you: needing the student to remain a student, because your identity depends on there being someone who knows less. If students quietly drift away, or never quite surpass you, that's not simply an unlucky run of unmotivated people — they're often meeting the actual frequency you're offering, which is transmission conditioned on staying beneath you rather than genuinely rising.`,
      path: `The best version of this is a teacher who genuinely celebrates when the student surpasses them — someone who understands that the real goal of teaching is to eventually become unnecessary. That's the most advanced expression of this gift, and it requires real freedom from the part of your ego that's organized around being the one who knows. Once that freedom is real, the caliber of student and the depth of relationship that reach you rises to match it.`,
      positive: `You offer what you know freely enough that students genuinely rise past you, and that same generosity is what draws deeper knowledge and better collaborators back toward you in turn.`,
      negative: `A need to keep the student dependent quietly caps the relationship's growth — the frequency of "stay beneath me" is what students eventually sense and drift away from, or simply never outgrow.`,
    },

    6: {
      heading: `Your Choices Are Asking for Your Real Values`,
      why: `Wherever the Lovers live in your matrix, it marks a place governed by the fundamental experience of choice — specifically, by what happens inside you in the moment of genuinely choosing. This isn't primarily about romance. It's about the crossroads — the moment two genuinely different paths diverge, where logic alone can't decide, and where choosing one thing necessarily means leaving another behind. Here, you're being asked, again and again, to make choices that reflect your actual values rather than your desire to avoid conflict.`,
      shadow: `The shadow is indecision dressed up as openness — keeping every option alive as a way of avoiding the grief of the roads not taken. There's also a specific pattern of leaning on other people, circumstances, or belief systems to tell you what the right choice is, because real self-determination feels too exposing. This can show up as chronic people-pleasing: quietly subordinating your own preferences to keep the peace, until you've lost touch with what you actually want. If life keeps handing you decisions made for you instead of with you, that's often the world honoring the vacancy you left where your own choice was supposed to be.`,
      path: `Try letting yourself grieve the unchosen path as a way of honoring the one you did choose. Every real decision is also a real loss. Becoming someone who can make a choice and fully commit to it — while acknowledging what got released in that commitment — is exactly what this position is asking of you. The more clearly you occupy your own preference, the less the world seems to need to choose for you.`,
      positive: `You make choices that genuinely reflect your values and commit to them fully, and because that decisiveness is real, the people and circumstances around you stop trying to fill a vacancy you no longer leave open.`,
      negative: `A pattern of others deciding for you is not simply pushy people — it is the world filling the exact space left by an unoccupied preference, matching the vacancy with decisions made on your behalf.`,
    },

    7: {
      heading: `You're Meant to Steer, Not Just Endure`,
      why: `Wherever the Chariot lives in your matrix, it marks a place infused with navigation, direction, and the disciplined application of will toward a chosen course. This is one of the most internally demanding energies in the system — not because it requires force, but because it requires a sustained kind of self-authorship most people only touch in brief moments. Here, you're being asked to steer — to hold a direction that comes from genuine inner knowing rather than from whatever your environment happens to be pulling you toward.`,
      shadow: `The shadow is control that's lost its relationship with trust — gripping the reins so tightly the horses can't move with their own intelligence, mistaking iron self-discipline for genuine mastery, treating any deviation from the plan as personal failure. There's also the shadow of the solitary driver: struggling to let anyone else contribute to the journey, convinced that collaboration will compromise your direction. If you keep ending up with unreliable collaborators, that's often just meeting a frequency that never actually left room for anyone else to drive.`,
      path: `Mastery here doesn't mean you never veer — it means you know how to find your true north again after you do. The work is flexibility within your direction: trusting the horses enough to loosen the reins when the terrain calls for it, knowing the destination remains. That same trust is what finally lets genuinely capable people show up to help, because you're no longer sending a signal that leaves no room for them.`,
      positive: `You steer with genuine self-authorship while trusting others enough to let them actually contribute — and because that trust is real, capable collaborators keep showing up to help carry the direction.`,
      negative: `A grip too tight for anyone else to help drive keeps attracting collaborators who never quite measure up — not because good help is scarce, but because the frequency never left room for it to arrive.`,
    },

    8: {
      heading: `Fairness Starts With How You Judge Yourself`,
      why: `Wherever Justice lives in your matrix, it marks a place governed by balance, accountability, and the precision of genuine truth — not the truth that wins arguments, but the kind that's still standing after the argument ends. Here, you carry both the capacity and the responsibility to see clearly, call things by their accurate names, and hold yourself and others to a standard grounded in real fairness rather than in preference.`,
      shadow: `The shadow is being the judge who's never turned the scales on themselves — holding others to an extraordinarily high standard while quietly exempting your own behavior. There's also a pull toward black-and-white thinking, compressing genuinely complicated situations into simple verdicts, which can hurt your relationships and leave you feeling perpetually caught between an impossible standard and the inevitable shortfall. If life keeps handing you people to judge, that's rarely bad luck — it's often unresolved self-judgment finding somewhere external to land.`,
      path: `Try applying this gift's own medicine, compassionately, to yourself first — turning that honest, precise gaze inward. Not to condemn yourself; that's not what this is about. It's about calibration — making sure what you're asking of the world, you're genuinely offering yourself too. Once the scales settle within you, the external verdicts you used to attract have a lot less material to work with.`,
      positive: `You see clearly and call things by their accurate names, holding yourself to the same honest standard you hold others to — and because the scales are settled internally, the world stops handing you so much to judge.`,
      negative: `An unconscious exemption for yourself keeps drawing people and situations that mirror exactly the imbalance you refuse to see in your own conduct — the world supplying fresh material for a verdict that was never really about them.`,
    },

    9: {
      heading: `What You Learned Alone Was Never Just for You`,
      why: `Wherever the Hermit lives in your matrix, it marks a place governed by deep internal wisdom — the kind that comes not just from study but from genuine solitary integration of what you've lived through. Some of your most important knowing was gathered in periods of withdrawal, quiet, choosing depth over surface. You carry a lantern here not for your own navigation — you already know the path — but to light the way for others still finding their footing in the dark.`,
      shadow: `The shadow is withholding that dresses itself up as wisdom — believing that what you've gathered alone is too refined, too hard-won, or just too hard to translate for people who haven't done the same work. This can shade into isolation that's no longer a chosen practice of renewal but a permanent state — a life organized around protecting the conditions of contemplation instead of actually engaging with people. If the world keeps feeling distant and unreachable, that's often just a lantern that's quietly turned inward instead of out.`,
      path: `You've gathered something real in your solitude. The real question is what you'll do with it — not in a utilitarian sense, but in the deeper sense of recognizing your light was never just for you. Practice translation: finding language that makes what you know available to people around you without watering it down. As the lantern turns outward, connection stops feeling scarce, because you've finally given it something to gather around.`,
      positive: `Deep, hard-won inner knowing becomes a lantern for others, and because you're genuinely willing to translate and share it, connection and recognition gather around you rather than staying just out of reach.`,
      negative: `A lantern kept turned inward is what keeps the world feeling distant — withholding what you've gathered in the name of humility only confirms the isolation it was meant to protect against.`,
    },

    10: {
      heading: `Your Stability Lives in the Center of the Wheel`,
      why: `Wherever the Wheel of Fortune lives in your matrix, it marks a place infused with cycles, timing, and the intelligence of turning. Everything in material reality moves in cycles — seasons, economies, relationships, creative work, even your own internal states. Here, you're being asked to build a relationship with the turning of things: to recognize that what goes down eventually comes back up, and that what's up isn't permanent either — and to find your stability not in the wheel's position, but in your relationship to its center.`,
      shadow: `The shadow is experiencing cyclical change as something happening to you rather than through you. Operating from fear, that shows up as either a desperate grip on control — trying to freeze the wheel at its high point — or a passive resignation that uses "what goes up must come down" as an excuse not to fully invest in the upswing. If life keeps confirming "things always fall apart for me," that's often just the belief being handed back to you exactly as it was sent out — expectation working as a self-fulfilling frequency.`,
      path: `The deepest lesson here is active surrender, not passive giving-up. You don't resist the current — you learn to read it well enough to navigate within it. Start by mapping your own cycles: your creative rhythms, your social energy, your motivation. Over time you'll see the pattern, and in seeing it you'll find the stability this position is actually offering — one that stops broadcasting "collapse is coming" and so stops calling it in.`,
      positive: `You locate your stability in your relationship to the cycle itself, and because you're not broadcasting a fear of the downswing, the upswings you invest in get to run their full, uninterrupted course.`,
      negative: `A belief that things always eventually fall apart becomes a self-fulfilling frequency — the anxious grip on the high point, or the passive resignation before the low, calls in the exact collapse it was bracing for.`,
    },

    11: {
      heading: `Real Strength Doesn't Need to Prove Itself`,
      why: `Wherever Strength lives in your matrix, it marks a place where genuine power — not dominance, not force, but the quiet, sustained, deeply embodied kind of strength that tames rather than breaks — is asking to be expressed. Think of the gentle hand at the jaw of the lion: not overpowering the animal, but working with its nature. Here, you have real capacity, real endurance, a real ability to hold what others can't. And here, the difference between strength-as-service and strength-as-armor is the central question your life keeps asking.`,
      shadow: `The shadow is an identity built entirely around capability — unable to rest because resting feels like weakness, unable to receive help because receiving feels like incompetence, unable to show vulnerability because somewhere early on, vulnerability had real consequences for you. The physical cost adds up: your jaw, your lower back, your heart working overtime against a baseline of suppressed effort. If life keeps handing you people who lean on you but never lift, that's often matching a frequency that's never actually signaled it wants to be helped.`,
      path: `Real strength at this level isn't the absence of vulnerability — it's the capacity to stay present with vulnerability, yours and other people's, without needing to fix it immediately. That's the lion tamed, not broken — trusted, not suppressed. Once vulnerability is genuinely welcomed instead of defended against, the people who show up start offering real reciprocity instead of just more weight to carry.`,
      positive: `You hold real weight for others with a quiet, embodied endurance, and because you're genuinely open to receiving in return, the people around you offer real reciprocity rather than simply more to carry.`,
      negative: `A capability that never signals it wants help keeps attracting people who lean without lifting — the world matching the exact frequency of a strength that has never once asked to be met halfway.`,
    },

    12: {
      heading: `Some of Your Best Growth Happens Upside Down`,
      why: `Wherever the Hanged Man lives in your matrix, it marks a place infused with voluntary suspension — the willingness to let go of a position, a certainty, or a direction of movement in order to see something a different orientation simply couldn't show you. He's not a victim; he chose his place on the tree, and in releasing the ground beneath his feet, he discovers the world looks entirely different upside down. Here, your most significant growth has come, or will come, through the willingness to stop pushing and let something be revealed.`,
      shadow: `The shadow is martyrdom that won't admit it's chosen — voluntary suffering that gets framed as circumstance, sacrifice offered publicly and tracked carefully, a suspension that's gone on well past its teaching moment because being "the one who waits, who endures, who is misunderstood" has become more comfortable than actually returning to active life. If the world keeps failing to notice your sacrifice, that's not cruelty — it's often responding to a frequency that's quietly stopped expecting the return to actually happen.`,
      path: `Try recognizing that the suspension has both a purpose and an endpoint. You don't hang forever. The Hanged Man eventually comes down — changed, expanded, carrying knowledge only that particular angle could have given him. Ask yourself: what am I seeing differently from here that I couldn't see before? And then: what do I do with this new sight once I return to the ground? The moment you genuinely expect the descent, the ground has a way of showing up to meet you.`,
      positive: `You can voluntarily release a certainty in order to see from a new angle, and because you genuinely expect the return to active life, the ground reliably reappears when it's time to come down.`,
      negative: `A suspension that has quietly stopped expecting its own end keeps the ground from reappearing — the world matches an identity that has stopped believing the waiting was ever going to conclude.`,
    },

    13: {
      heading: `What Needs to End Is Making Room for What's Next`,
      why: `Wherever Transformation lives in your matrix, it marks a place governed by metamorphosis — specifically, the kind that can't happen without a genuine release. Not the controlled, scheduled kind of change, but the deep, cellular kind: a form that's completed its function dissolving so something more aligned can take its place. Here, clinging to what's already ended is the specific obstacle, and letting something fully die — a belief, a relationship, a version of yourself, a strategy that once worked — is the exact doorway to what comes next.`,
      shadow: `The shadow is someone who's survived so many real endings that they develop a kind of unconscious pull toward crisis — recreating the intensity of transformation as drama because the stillness of settling down feels dangerously close to the stillness before collapse. There's also the opposite pattern: refusing any real ending, keeping things alive through sheer will past their natural completion, accumulating the weight of what should have been released. If life keeps delivering abrupt collapses, that's often just matching a frequency still bracing for one — refusing the quieter release that was actually available.`,
      path: `Real mastery here comes from developing discernment — being able to sit with something and honestly ask whether it's in a difficult phase that wants working through, or whether it's actually completed and wants to be honored and released. These call for very different responses, and learning to tell them apart is the work. Once genuine endings are allowed to complete quietly, reality stops needing to manufacture dramatic ones just to get your attention.`,
      positive: `You let things end cleanly when they've actually completed, and because your relationship to endings is calm rather than crisis-driven, transitions arrive gently instead of as sudden collapse.`,
      negative: `A refusal to let anything genuinely end keeps accumulating weight until reality manufactures a dramatic collapse to force the release that a quiet letting-go could have handled all along.`,
    },

    14: {
      heading: `Your Genius Is Patient Combination`,
      why: `Wherever Temperance lives in your matrix, it marks a place infused with integration — specifically, the alchemical kind that combines apparently incompatible elements into something genuinely new. Picture Temperance pouring liquid between two cups, endlessly, with total patience — not because she doesn't know what she's doing, but because combining things takes exactly as long as it takes, and rushing it produces something other than what was intended. Here, your particular kind of genius involves patiently synthesizing opposites — ideas, people, timelines, strategies — that others can't imagine coexisting.`,
      shadow: `The shadow is a false middle ground — avoiding the discomfort of real polarity by papering it over with a premature harmony that doesn't actually satisfy anyone. There's also a pattern of avoidance through perpetual balancing: staying so focused on managing the equilibrium that genuine depth — which sometimes requires tipping fully into one direction before you can know the other — never quite becomes available. Relationships and situations that keep feeling watered-down instead of resolved are often matching a frequency that's been avoiding real contact rather than genuinely blending anything.`,
      path: `Try fully inhabiting the extremes long enough to actually understand them from the inside before you try to combine them. You can't blend what you haven't genuinely encountered. Your work is to stop moderating your experience prematurely and trust that the combining will happen — it just needs the full intensity of each ingredient first. Once you allow that intensity, life stops handing you diluted, unresolved versions of what you actually want.`,
      positive: `You patiently synthesize things that seem incompatible into something genuinely new, and because you let each ingredient reach full intensity first, what you draw together actually holds.`,
      negative: `A premature, papered-over harmony keeps drawing situations that feel watered-down rather than resolved — the avoidance of real polarity showing up as relationships and outcomes that never quite land.`,
    },

    15: {
      heading: `What You're Bound To Isn't Locked — It's Loose`,
      why: `Wherever the Devil lives in your matrix, it marks a place where material power, primal attachment, and the shadow of your relationship to security are asking to be honestly faced. This isn't evil in a cartoonish sense — it's the very human experience of being bound to something — a substance, a relationship dynamic, a financial pattern, a belief — that you know isn't serving your highest self but that offers a comfort or stimulation you haven't yet found a real substitute for. In the classic image, the figures aren't locked in chains — they're loosely bound, and the chains could slip off at any moment. The real question is what it would mean to let them.`,
      shadow: `The shadow is using material power — money, status, physical dominance, sexual energy — as a substitute for genuine intimacy or self-worth. Caught here, you can mistake accumulation for security, and control for love. There's also a pattern of projection: putting your own shadow qualities onto other people, which keeps you stuck in repetitive cycles of resentment and feeling like a victim. A cycle of people who seem to consistently take advantage of you is often the frequency of an unexamined attachment recreating the exact dynamic it resents.`,
      path: `The liberation here isn't eliminating pleasure or material engagement — it's unchaining pleasure from compulsion. The ability to fully enjoy something without needing it. To engage with the material world as a genuine participant rather than someone in its service. Start by naming what you're actually attached to, and ask, with honest curiosity instead of self-judgment, what that attachment is actually providing you. As the compulsion loosens, the relationships and resources that show up stop mirroring the old bind back to you.`,
      positive: `You engage fully with pleasure, money, and the material world as a genuine participant, and because the chains are genuinely loose, the relationships and resources that arrive feel like abundance rather than compulsion.`,
      negative: `An unexamined attachment to control or security keeps recreating the exact dynamic it resents — the same bind, mistaken for love or safety, showing up again in a different disguise.`,
    },

    16: {
      heading: `Sometimes You Have to Watch It Fall to See It Clearly`,
      why: `Wherever the Tower lives in your matrix, it marks a place governed by sudden, lightning-strike revelation — clarity that restructures reality faster than the mind can process it. The Tower itself isn't the collapse — it's the clarity the collapse makes available. Whatever was built on a false foundation eventually reveals itself, not as punishment but as structural inevitability. Here, you've experienced — or will experience — a moment of radical reorganization that felt like destruction from the inside, but turned out, in hindsight, to be the most important reorientation of your path.`,
      shadow: `The shadow is identifying so deeply with the drama of collapse that you recreate it over and over — burning down structures that still worked, out of a compulsive need for the intensity of that moment, or the freedom from responsibility a real crisis temporarily hands you. There's also the opposite: staying so afraid of the Tower that you maintain increasingly fragile structures through sheer will, refusing to let anything naturally complete, so the eventual collapse carries far more weight than it needed to. A life of repeated dramatic upheaval is rarely bad fortune — it's often a frequency still identified with crisis as the only believable form of change.`,
      path: `Try initiating necessary endings before they initiate themselves — surveying your life honestly and asking which structures rest on true foundations and which are being held up by pure avoidance. This isn't nihilism. It's architectural intelligence applied to how you're building your life. Once change no longer has to arrive as crisis to feel real, reality stops needing to deliver it that way.`,
      positive: `Sudden clarity becomes a tool you can use deliberately, and because change no longer needs to arrive as crisis to feel real, transitions in your life get to unfold gradually instead of catastrophically.`,
      negative: `An identity still organized around crisis as the only believable form of change keeps summoning collapse to prove that change is actually happening — the drama becoming necessary rather than incidental.`,
    },

    17: {
      heading: `Your Light Was Built to Meet the Wound, Not Float Above It`,
      why: `Wherever the Star lives in your matrix, it marks a place infused with genuine hope — not the brittle, conditional kind that depends on outcomes, but the structural kind: the ability to keep generating light even when nothing outside confirms that the light is warranted. In the Tarot, the Star follows the Tower — she rises after the collapse, pouring water from two vessels onto the earth and the stream at once, healing what broke, replenishing what emptied out. Here, your capacity for renewal is one of your most genuine gifts to the people around you.`,
      shadow: `The shadow is idealism that hasn't yet learned to land — a vision of what's possible so luminous it perpetually outpaces the actual, present, imperfect moment in front of you. That creates a quiet, persistent grief — the gap between the world as it is and the world as you see it could be — which can make close relationships genuinely hard, because no actual person can sustain the frequency of their own highest potential without interruption. A life that keeps disappointing your vision of it isn't the world failing you — it's often a light permanently pointed at potential instead of what's actually here to be met.`,
      path: `Try bringing your light into the wound instead of holding it above it. Not pretending the wound isn't there, not transcending it, but literally pouring light into the broken place and trusting the process to regenerate from there. That means being willing to get close to what's damaged — including in yourself — instead of keeping the vision of wholeness at a safe distance. Once your light meets what's actually present, the world stops arriving as a disappointment and starts arriving as material to work with.`,
      positive: `You generate genuine hope and renewal by meeting what is actually present rather than only its potential, so relationships and circumstances feel met and nourished instead of quietly judged against a vision.`,
      negative: `A frequency permanently pitched toward potential rather than the present keeps the actual world arriving as a disappointment — no person or moment can ever quite satisfy a light that's aimed somewhere else.`,
    },

    18: {
      heading: `Trust What You Sense Before You Can Explain It`,
      why: `Wherever the Moon lives in your matrix, it marks a place governed by the deep unconscious — the psychic and emotional currents moving beneath daily awareness, and the cyclical, non-linear intelligence of your interior life. The Moon doesn't illuminate the way the Sun does. It offers a softer, more ambiguous light that outlines things without fully explaining them — and that's not a failure, it's the Moon's specific contribution. Here, your most reliable guidance arrives through dreams, through the body, through a felt sense that something is true before you can say why.`,
      shadow: `The shadow is confusion that comes when your inner and outer worlds stop being clearly distinguishable — when the emotional weather of your subconscious gets projected onto circumstances without you recognizing it as projection. This can look like paranoia, a sense that reality is fundamentally threatening or deceptive, a chronic difficulty trusting appearances because you're always sensing what might lie underneath them. There's also the shadow of escapism — using the Moon's gift for fantasy and interior richness as a substitute for actually showing up in your life. A world that keeps confirming your suspicion is often just an unexamined subconscious mood finding matching evidence wherever it looks.`,
      path: `Try learning to move through the deep water without being swept away by it — keeping a thread back to the surface even while you're diving. This takes practices that ground your interior world in the physical: movement, breath, the specific materiality of your body as an anchor point for the sensitivity you carry. The clearer that anchor gets, the less circumstance is available to be misread as confirmation of an old fear.`,
      positive: `You sense what's true before you can explain it, and because your interior world is genuinely anchored, that intuition reads real undercurrents rather than projecting old fears onto ambiguous circumstances.`,
      negative: `An unexamined subconscious atmosphere gets projected outward and then finds matching "evidence" everywhere it looks — deepening a suspicion of reality that was never actually about the present moment.`,
    },

    19: {
      heading: `You Shine Because That's Just What You Do`,
      why: `Wherever the Sun lives in your matrix, it marks a place infused with genuine vitality — the kind that radiates outward not as performance, but as the natural consequence of being authentically alive in the direction of your actual nature. The Sun doesn't try to shine. It shines because that's what it does. Here, your most natural state — when you're not managing how other people perceive you, not dimming yourself to avoid the discomfort of your own brightness — is warmth, clarity, and the kind of joyful engagement with life that other people find both inspiring and, sometimes, a little confronting.`,
      shadow: `The shadow is confusing your radiance with your worth — needing to be the brightest source of light in any room, and feeling genuinely destabilized when someone else brings a comparably vivid energy. There's also a pattern of "burning" people — projecting so much intensity onto the people closest to you that they can't actually grow in your light, because there's simply too much of it. Wilted relationships that keep resulting aren't bad luck — they're the world honestly reporting back the actual heat being given off.`,
      path: `Try being genuinely delighted by other people's light — expanding in the presence of someone else's brightness instead of competing with it. That's this energy at its most evolved: not a single sun, but part of a galaxy. Your vitality, when it's genuinely integrated, becomes a climate other things can grow in — and a climate that lets other things grow is what finally draws people who want to stay in it.`,
      positive: `Your natural warmth and vitality become a climate other people genuinely grow in, and because your light doesn't need to compete, the people closest to you flourish rather than shrink or scorch.`,
      negative: `A need to be the brightest source of light in every room scorches what it touches, and the wilted or distant relationships that result are the world accurately reflecting the actual heat being given off.`,
    },

    20: {
      heading: `The Call Rarely Waits for You to Feel Ready`,
      why: `Wherever Judgement lives in your matrix, it marks a place governed by awakening — the moment the old version of you becomes genuinely untenable, when the life you've been living stops fitting the person you've become, and the inner summons to something fuller can't be postponed much longer without real cost. Judgement isn't punishment — it's revelation. The figures rising from their coffins aren't being called to account for their failures; they're being called home to what they actually are. Here, you've heard, or are about to hear, exactly this kind of summons.`,
      shadow: `The shadow is hearing the call and then spending years preparing to answer it — reading more, learning more, clearing more, refining more — because actually answering means being seen in full, and being seen in full feels, from the inside, like risking everything. There's also a pattern of perpetual reckoning without resolution: using self-awareness to maintain constant self-examination that substitutes for actually moving. A life that keeps signaling "not yet ready" is broadcasting exactly that, and the world simply keeps agreeing.`,
      path: `Answering this call doesn't require perfection, and it doesn't require clearing everything that's come before. It requires one courageous act: rising from where you've been lying down and starting to move in the direction the trumpet's pointing. The rest reveals itself in the moving — and the moment you actually move, the opportunities that once seemed to be waiting on your readiness start meeting you partway.`,
      positive: `You answer the summons when it arrives rather than endlessly preparing for it, and because you're actually moving, the opportunities and recognition you were waiting to feel ready for start meeting you partway.`,
      negative: `Endless preparation broadcasts "not yet ready" more clearly than any spoken doubt could — and the world, quietly matching that frequency, keeps agreeing and withholding the very opening you're waiting for.`,
    },

    21: {
      heading: `You're Allowed to Call It Finished`,
      why: `Wherever the World lives in your matrix, it marks a place infused with genuine completion — not the artificial kind declared before the work is done, but the real kind that arrives once a full cycle has actually been lived through, integrated, and allowed to reach its natural end. The World is the last card of the Major Arcana before the cycle starts over with the Fool — its figure dances inside the wreath, held by four elemental beings, fully contained and fully free at once. Here, mastery — genuine, hard-won, quietly radiant mastery — is either already present or is exactly where this part of your life is heading.`,
      shadow: `The shadow is fearing completion itself — specifically, fearing that finishing something means facing the next beginning, and the next beginning carries all the uncertainty this cycle has already absorbed. This can look like perfectionism that blocks completion: always one more thing to refine, one more element to add, one more preparation before it's "done." It can also look like compulsively restarting — dismantling something nearly finished, not because it's wrong but because completion itself feels too exposing. A life full of unfinished projects is broadcasting "almost" as its steady frequency, and the world keeps handing back exactly that: near-misses, not arrivals.`,
      path: `Try standing fully in what you've already accomplished before launching the next cycle. Let something actually be finished. Receive the completion before you move on. That's one of the most underrated acts of courage in a culture that rewards constant motion — the willingness to stop, acknowledge that something real got built here, and let that acknowledgment land. The moment completion is genuinely permitted, "almost" stops being what the world keeps handing back to you.`,
      positive: `You can stand fully in genuine completion, and because "finished" is a frequency you actually permit, recognition and reward arrive as real arrivals rather than as another near-miss.`,
      negative: `A frequency stuck on "almost" — never letting anything be genuinely done — keeps drawing near-misses rather than arrivals, the world simply matching the incompletion being broadcast.`,
    },

    22: {
      heading: `You're at Your Best Beginning Again With Your Eyes Open`,
      why: `Wherever the Fool lives in your matrix, it marks a place infused with pure potential — the energy of a beginning that hasn't yet been shaped by outcome, the step taken before the foot knows where it will land. The Fool isn't naive in the way people mean that as an insult — he carries a very specific intelligence: the intelligence of the present moment, unweighted by the accumulated baggage of past experience. Here, your most generative quality is your willingness to begin — again, and again, and again — without needing the safety of a guaranteed outcome.`,
      shadow: `The shadow is recklessness that refuses to absorb what previous cycles have already taught you — leaping repeatedly not from genuine freedom, but from an unexamined avoidance of the responsibility that growing up actually requires. In shadow, you can become the eternal beginner, using freshness as an exemption from depth, mistaking the excitement of starting for the richness only sustained engagement can give you. A life that keeps repeating the same lesson in a new costume isn't bad luck — it's often a refusal to actually absorb what you already encountered.`,
      path: `The most paradoxical achievement here is bringing the freshness, fearlessness, and genuine openness of a beginning through the full weight of your experience, rather than despite it. Knowing everything the previous cycles have taught you, and beginning again anyway, with your eyes open. That's this energy at full power — not innocent of difficulty, but genuinely undeterred by it. Once a lesson is genuinely absorbed instead of skipped past, life stops needing to hand it back to you in a new disguise.`,
      positive: `You begin again and again with real lessons genuinely absorbed rather than skipped past, so each new beginning meets fresh terrain instead of the same lesson wearing a different costume.`,
      negative: `Skipping past a lesson instead of absorbing it keeps that same lesson returning in a new disguise — the thrill of another fresh start standing in for the depth that was actually being asked for.`,
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
