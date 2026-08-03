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
      title: `8 in Core Character — Justice`,
      tagline: `A Design of the Reading Room`,
      mastery: `You read fairness and imbalance before anyone says a word, and you hold yourself to the same standard you hold everyone else to. That's steadiness people can actually rely on.`,
      shadow: `You judge everyone by a standard you quietly exempt yourself from. You keep score, complain the world isn't fair, and never turn the same ledger on your own conduct.`,
      invitation: `Apply your own standard to yourself once today, out loud, before you apply it to anyone else.`,
    },

    // ── 1 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '1_A': {
      title: `1 in Core Character — The Magician`,
      tagline: `A Design of Instant Competence`,
      mastery: `You radiate competence before you've done anything. People trust you with things that matter because something in you simply reads as capable.`,
      shadow: `You become everyone's default problem-solver and let the mask do all the work, never showing the days you have nothing left. People stop checking if you're okay because you never look like you're not.`,
      invitation: `Let one person see you not have it handled today.`,
    },

    // ── 2 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '2_A': {
      title: `2 in Core Character — The High Priestess`,
      tagline: `A Design of the Held Depth`,
      mastery: `You hold real depth, and people sense there's more to you without needing it explained. That quiet reserve reads as substance, not distance.`,
      shadow: `You guard so completely it reads as cold instead of deep. People stop trying to get past a wall that never signals anything's worth reaching for.`,
      invitation: `Let one true thing show on your face today, even briefly, without explaining it.`,
    },

    // ── 3 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '3_A': {
      title: `3 in Core Character — The Empress`,
      tagline: `A Design of the Room That Exhales`,
      mastery: `People relax the moment you walk in. Your warmth is real, and it makes space for others without you having to try.`,
      shadow: `You become everyone's landing pad by default, holding space for everyone and rarely being held yourself. The tiredness never announces itself, it just accumulates.`,
      invitation: `Say "I don't have capacity for that right now" once today, and mean it.`,
    },

    // ── 4 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '4_A': {
      title: `4 in Core Character — The Emperor`,
      tagline: `A Design of Assumed Command`,
      mastery: `A room organizes itself around your steadiness before you've said a word. That's real, earned authority, not performance.`,
      shadow: `People stop bringing you their actual thoughts because you look like you've already decided. Agreement arrives too fast to be trustworthy.`,
      invitation: `Ask a real question today and actually wait for the answer.`,
    },

    // ── 5 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '5_A': {
      title: `5 in Core Character — The Hierophant`,
      tagline: `A Design of Assumed Rightness`,
      mastery: `People trust your read on things before you've proven anything. You carry the presence of someone who already knows how things are properly done.`,
      shadow: `You get boxed into always having to be right. People stop bringing you their doubts because they've cast you as already settled.`,
      invitation: `Say "I don't know" out loud today, to someone who expects you to.`,
    },

    // ── 6 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '6_A': {
      title: `6 in Core Character — The Lovers`,
      tagline: `A Design of the Meaningful Yes`,
      mastery: `Your attention isn't handed out freely, so being chosen by you actually means something. People want in specifically because you don't pick everyone.`,
      shadow: `You read as constantly evaluating people against a standard they can't see. Closeness with you starts to feel like an audition instead of a place to land.`,
      invitation: `Let your warmth arrive first today, before any sense of being weighed.`,
    },

    // ── 7 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '7_A': {
      title: `7 in Core Character — The Chariot`,
      tagline: `A Design of Visible Momentum`,
      mastery: `You carry visible direction before you've said where you're headed. People sense momentum in you, and it's real.`,
      shadow: `You look so busy that people stop bringing you the ordinary, casual stuff. You end up isolated inside your own momentum.`,
      invitation: `Let yourself be seen doing nothing today, unhurried, on purpose.`,
    },

    // ── 9 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '9_A': {
      title: `9 in Core Character — The Hermit`,
      tagline: `A Design of Presumed Solitude`,
      mastery: `People give you space without being asked, because you clearly process things internally. That's a real gift, not standoffishness.`,
      shadow: `People stop including you at all, assuming you'd rather be alone even on the days you wouldn't. Invitations just quietly dry up.`,
      invitation: `Tell someone explicitly today that you want to be included.`,
    },

    // ── 10 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '10_A': {
      title: `10 in Core Character — The Wheel of Fortune`,
      tagline: `A Design of the Watched Shift`,
      mastery: `You're genuinely interesting to watch — things move around you, and people are curious what's next for you.`,
      shadow: `You get typecast as unreliable simply because you're associated with change. People hedge their bets and hesitate to build anything long-term with you.`,
      invitation: `Show someone one thread in your life that's stayed exactly the same for years.`,
    },

    // ── 11 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '11_A': {
      title: `11 in Core Character — Strength`,
      tagline: `A Design of the Safe Weight`,
      mastery: `People bring you their hardest moments without asking, because something about you reads as able to hold weight without cracking.`,
      shadow: `You become everyone's shock absorber. Your own hard moments go completely unnoticed because your mask never visibly cracks.`,
      invitation: `Let your composure visibly slip once today, in front of someone you trust.`,
    },

    // ── 12 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '12_A': {
      title: `12 in Core Character — The Hanged Man`,
      tagline: `A Design of the Different Clock`,
      mastery: `You're not moved by the same urgency as everyone else, and you see angles they miss. That patience is a real advantage.`,
      shadow: `You get read as detached or checked-out because your pace doesn't match the room. People leave you out of urgent decisions assuming you won't engage.`,
      invitation: `Say the sharp observation you're holding today, out loud, instead of just holding it.`,
    },

    // ── 13 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '13_A': {
      title: `13 in Core Character — Transformation`,
      tagline: `A Design of Grounded Gravity`,
      mastery: `You carry the grounded gravity of someone who's already survived something real. People sense it without you saying a word.`,
      shadow: `People handle you too carefully, assuming you're always processing something deep. You get starved of the light, easy, trivial stuff.`,
      invitation: `Bring one genuinely trivial joy into a conversation today, without earning it first.`,
    },

    // ── 14 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '14_A': {
      title: `14 in Core Character — Temperance`,
      tagline: `A Design of the Trusted Middle`,
      mastery: `You can hold two opposing views in the same room without dismissing either side. People trust you specifically because you're good in the middle of tension.`,
      shadow: `You become the designated peacekeeper in every group, smoothing things over even when you're the one who needs smoothing. Your own conflicts go unaddressed.`,
      invitation: `Land somewhere today. Give one clear, unmixed opinion.`,
    },

    // ── 15 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '15_A': {
      title: `15 in Core Character — The Devil`,
      tagline: `A Design of the Compelling Edge`,
      mastery: `People sense something compelling and a little dangerous about you. That magnetic edge is real, and it draws people in.`,
      shadow: `People either chase the intensity for the wrong reasons or keep a wary distance, deciding you're "too much." Your actual gentleness keeps getting missed.`,
      invitation: `Let your softness show today, right alongside the edge, not instead of it.`,
    },

    // ── 16 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '16_A': {
      title: `16 in Core Character — The Tower`,
      tagline: `A Design of the Truth-Jolt`,
      mastery: `You cut straight through polite fictions the rest of the room is maintaining. That electric honesty is a real gift.`,
      shadow: `People start managing information around you and bracing for disruption before you've done anything. You get pre-emptively excluded from delicate moments.`,
      invitation: `Say one honest thing gently today, on purpose, to prove the honesty doesn't have to detonate.`,
    },

    // ── 17 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '17_A': {
      title: `17 in Core Character — The Star`,
      tagline: `A Design of Unhardened Hope`,
      mastery: `You carry hope that hasn't hardened into naivety. People feel safe being discouraged around you, because your optimism is real, not performed.`,
      shadow: `You become everyone's designated source of encouragement, expected to stay hopeful on demand. Your own low days feel like a betrayal of the role, so you hide them.`,
      invitation: `Let your own doubt be visible today, without rushing to reassure anyone it'll be fine.`,
    },

    // ── 18 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '18_A': {
      title: `18 in Core Character — The Moon`,
      tagline: `A Design of the Weather Behind the Eyes`,
      mastery: `You carry a rich, shifting interior life that draws people in with real curiosity about who you actually are.`,
      shadow: `People guess at your mood instead of asking, and they usually guess toward the worst. Your silence gets filled with their own anxieties.`,
      invitation: `Name what you're actually feeling today, out loud, in one sentence.`,
    },

    // ── 19 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '19_A': {
      title: `19 in Core Character — The Sun`,
      tagline: `A Design of Instant Warmth`,
      mastery: `People feel lighter just being near you. That warmth is genuine, and it's one of the most immediately likable things about you.`,
      shadow: `People assume the brightness is constant and unconditional, and they get confused instead of caring on the days you're actually struggling.`,
      invitation: `Let one bad day show today, without apologizing for it.`,
    },

    // ── 20 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '20_A': {
      title: `20 in Core Character — Judgement`,
      tagline: `A Design of Imminent Arrival`,
      mastery: `You carry the charge of someone actively becoming something bigger. People sense the momentum, and it's real.`,
      shadow: `People relate to who you're becoming instead of who you actually are right now. You end up half-seen, waiting alongside everyone else for the "real" you to show up.`,
      invitation: `Let someone meet exactly who you are today, not who you're on your way to becoming.`,
    },

    // ── 21 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '21_A': {
      title: `21 in Core Character — The World`,
      tagline: `A Design of Presumed Completion`,
      mastery: `You carry real wholeness — the ease of someone who's already arrived somewhere most people are still working toward.`,
      shadow: `People assume you don't need anything, since you don't look like you're missing anything. Your actual struggles stay invisible, and support stops reaching you.`,
      invitation: `Show one still-forming, unfinished part of yourself to someone today.`,
    },

    // ── 22 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '22_A': {
      title: `22 in Core Character — The Fool`,
      tagline: `A Design of Unrehearsed Presence`,
      mastery: `You meet every moment fresh, with no rehearsed social mask. People feel like they don't have to perform around you either.`,
      shadow: `That same openness reads as naivety. People underestimate your experience and leave you out of conversations that assume a gravity you clearly carry but don't display.`,
      invitation: `Let your actual depth show through the ease once today, on purpose.`,
    },

    // ── 5 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '5_B': {
      title: `5 in Sky Line — The Hierophant`,
      tagline: `A Design of Received Structure`,
      mastery: `You sense the deeper structure underneath things before anyone explains it to you. That's a real aptitude for wisdom — study that turns into devotion, understanding you can actually pass on.`,
      shadow: `Your reverence for structure curdles into certainty there's exactly one right way. You lecture when you meant to teach, and the channel that should receive stops receiving.`,
      invitation: `Ask one person today what they see differently than you do about something you're certain of. Actually listen.`,
    },

    // ── 1 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '1_B': {
      title: `1 in Sky Line — The Magician`,
      tagline: `A Design of the Direct Line`,
      mastery: `You catch inspiration and immediately know how to give it shape. That translation — turning the invisible into something usable — is a real spiritual gift.`,
      shadow: `You claim as personal genius what actually moved through you, and hoard half-finished downloads because starting the next one feels more alive than finishing the last.`,
      invitation: `Finish one spiritual idea you've been sitting on today, instead of reaching for a new one.`,
    },

    // ── 2 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '2_B': {
      title: `2 in Sky Line — The High Priestess`,
      tagline: `A Design of the Unspoken Knowing`,
      mastery: `You sense what's forming before it's announced — real fluency in symbol and undercurrent, access to meaning most people walk past.`,
      shadow: `You guard the veil instead of lifting it. Your insight stays too sacred to offer, and people sense you know something you're not saying.`,
      invitation: `Say "here's what I'm sensing" out loud today, even without proof.`,
    },

    // ── 3 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '3_B': {
      title: `3 in Sky Line — The Empress`,
      tagline: `A Design of Generative Presence`,
      mastery: `Things come alive around you just by your being present. That's a genuine spiritual gift, not a skill you perform.`,
      shadow: `You can't tolerate anything staying dormant, and you resent when the fertility you spark in others doesn't get credited back to you.`,
      invitation: `Let one thing near you stay fallow today. Don't push it to grow.`,
    },

    // ── 4 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '4_B': {
      title: `4 in Sky Line — The Emperor`,
      tagline: `A Design of Sacred Architecture`,
      mastery: `You take something vast and formless and give it a structure sturdy enough to actually hold. That's architecture in service of the sacred.`,
      shadow: `You defend the frame long after the spirit inside it has moved on. Your spiritual life starts running on maintenance instead of discovery.`,
      invitation: `Ask today whether one of your spiritual structures is still serving what it was built to protect.`,
    },

    // ── 6 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '6_B': {
      title: `6 in Sky Line — The Lovers`,
      tagline: `A Design of the True Frequency`,
      mastery: `You feel the difference between what's spiritually true for you and what's merely appealing, even when the appealing version is louder.`,
      shadow: `You stay suspended at the crossroads, feeling both paths so acutely that choosing either one feels like betrayal. Nothing gets committed to.`,
      invitation: `Choose the resonance you actually feel today, even imperfectly, and let the other path go.`,
    },

    // ── 7 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '7_B': {
      title: `7 in Sky Line — The Chariot`,
      tagline: `A Design of Spiritual Perseverance`,
      mastery: `You keep a spiritual practice moving on will alone, long after the initial inspiration has faded. That's real perseverance.`,
      shadow: `You insist on driving alone, refusing teachers or community because receiving help feels like losing control. Discipline becomes a substitute for actual encounter.`,
      invitation: `Let someone else in on your practice today — a teacher, a book, a conversation.`,
    },

    // ── 8 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '8_B': {
      title: `8 in Sky Line — Justice`,
      tagline: `A Design of Hollowness Detection`,
      mastery: `You sense when something claiming to be sacred has actually gone hollow. That discernment is real and rare.`,
      shadow: `You turn that clarity into permanent suspicion, unable to rest inside any practice because you're always auditing it for hypocrisy.`,
      invitation: `Let one small imperfection in a spiritual community or practice be ordinary humanness today, not proof of hollowness.`,
    },

    // ── 9 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '9_B': {
      title: `9 in Sky Line — The Hermit`,
      tagline: `A Design of Contemplative Range`,
      mastery: `Left alone with enough quiet, you access a different register of consciousness. That contemplative range is a genuine gift.`,
      shadow: `You chase the peak state again and again, retreating further from ordinary life because it can't compete with what solitude gives you.`,
      invitation: `Bring one thing back from your solitude today and actually share it with someone.`,
    },

    // ── 10 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '10_B': {
      title: `10 in Sky Line — The Wheel of Fortune`,
      tagline: `A Design of Divine Timing`,
      mastery: `You have an instinct for when the moment has actually arrived, even when nothing external has announced it. That's a rare gift of trust, not prediction.`,
      shadow: `You use "it's not the right time yet" as a permanent excuse, always sensing a better season just ahead while the present stays untouched.`,
      invitation: `Trust one "yes" today, right now, instead of deferring it to a better-timed future.`,
    },

    // ── 11 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '11_B': {
      title: `11 in Sky Line — Strength`,
      tagline: `A Design of the Tamed Wild`,
      mastery: `You can stay present with raw, unruly inner states without needing to suppress or be ruled by them. That's real, hard-won spiritual strength.`,
      shadow: `You perform calm instead of achieving it. The suppressed intensity moves underground and surfaces later as tension or eruptions that surprise you.`,
      invitation: `Let one feeling be fully felt today before you try to manage it.`,
    },

    // ── 12 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '12_B': {
      title: `12 in Sky Line — The Hanged Man`,
      tagline: `A Design of Skilled Surrender`,
      mastery: `You can stop pushing and let revelation arrive through release. That comfort with not-knowing is a real spiritual skill.`,
      shadow: `You confuse surrender with permanent inaction, staying suspended because the pause feels safer than descending back into choice.`,
      invitation: `Take what your last surrender revealed and actually act on it today.`,
    },

    // ── 13 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '13_B': {
      title: `13 in Sky Line — Transformation`,
      tagline: `A Design of Real Initiation`,
      mastery: `You've survived genuine ego-death before, and something truer rose in its place. That's a real aptitude for spiritual initiation.`,
      shadow: `You engineer crisis after crisis because ordinary growth feels unconvincing next to dramatic collapse.`,
      invitation: `Let one piece of growth happen quietly today, with no crisis required to make it feel real.`,
    },

    // ── 14 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '14_B': {
      title: `14 in Sky Line — Temperance`,
      tagline: `A Design of the Poured Vessel`,
      mastery: `You hold different truths at the meeting point without needing either to collapse. That's genuine mediator's work, real spiritual healing.`,
      shadow: `You lose your own footing holding everyone else's. You pour outward endlessly and never let yourself be healed in return.`,
      invitation: `Receive one act of care today instead of only offering it.`,
    },

    // ── 15 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '15_B': {
      title: `15 in Sky Line — The Devil`,
      tagline: `A Design of Fearless Looking`,
      mastery: `You can look directly at darkness — your own or the collective's — without flinching or bypassing it. That's genuine depth work.`,
      shadow: `You circle the same dark material because the intensity of looking has become its own reward, mistaking proximity to darkness for actual freedom from it.`,
      invitation: `Turn one thing you've been looking at into an actual action toward freedom today, not just more insight.`,
    },

    // ── 16 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '16_B': {
      title: `16 in Sky Line — The Tower`,
      tagline: `A Design of Lightning Revelation`,
      mastery: `You receive revelation as lightning — sudden, restructuring clarity that arrives all at once. That's a real spiritual gift.`,
      shadow: `You need the collapse to feel like growth is real, sometimes provoking crisis in your own beliefs just to feel the jolt again.`,
      invitation: `Let one truth land gently today instead of through demolition.`,
    },

    // ── 17 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '17_B': {
      title: `17 in Sky Line — The Star`,
      tagline: `A Design of the Living Wellspring`,
      mastery: `Your faith stays lit without needing proof, and it's contagious. You're a real source other people draw hope from.`,
      shadow: `You treat your faith as a private reserve instead of a wellspring, performing hope you don't feel because you're known as the one who's always fine.`,
      invitation: `Let your own doubt be witnessed today, honestly, by someone who cares about you.`,
    },

    // ── 18 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '18_B': {
      title: `18 in Sky Line — The Moon`,
      tagline: `A Design of the Threshold at Home`,
      mastery: `You're fluent in liminal space — dreams, the unseen, the threshold most people find disorienting. You feel at home there.`,
      shadow: `You lose the thread back to consensus reality. Ordinary daylight functioning starts to feel thin compared to what the threshold offers.`,
      invitation: `Bring one thing back from your inner world today and ground it in something physical or relational.`,
    },

    // ── 19 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '19_B': {
      title: `19 in Sky Line — The Sun`,
      tagline: `A Design of Effortless Clarity`,
      mastery: `Clarity arrives for you light and immediate, without needing struggle first. Ease itself is a real spiritual practice for you.`,
      shadow: `You feel pressure to manufacture struggle so your insight seems more credible, dimming your natural clarity to fit a world that equates depth with difficulty.`,
      invitation: `Offer something you know today exactly as lightly as it arrived. No harder story attached.`,
    },

    // ── 20 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '20_B': {
      title: `20 in Sky Line — Judgement`,
      tagline: `A Design of Vocational Hearing`,
      mastery: `You recognize a genuine calling when it arrives, distinct from noise or wishful thinking. That's real vocational discernment.`,
      shadow: `You mistake every strong feeling for a divine instruction, chasing missions that don't hold up, or pressuring other people toward awakenings they're not ready for.`,
      invitation: `Let one "calling" prove itself over time today before committing to it fully.`,
    },

    // ── 21 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '21_B': {
      title: `21 in Sky Line — The World`,
      tagline: `A Design of Whole-Life Synthesis`,
      mastery: `You weave different traditions and practices into one coherent whole instead of experiencing them as competing systems. That's real spiritual synthesis.`,
      shadow: `You collect breadth without depth, gathering more frameworks in the name of wholeness without letting any one of them actually change you.`,
      invitation: `Stay with one dimension of your understanding today, instead of reaching for something new to add.`,
    },

    // ── 22 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '22_B': {
      title: `22 in Sky Line — The Fool`,
      tagline: `A Design of the Natural Passport`,
      mastery: `You have direct, unmediated access to the sacred, without needing a doctrine or credential first. That openness is rare and real.`,
      shadow: `You trust every experience equally as sacred, with no discernment, leaping toward the next revelation before the last one taught you anything durable.`,
      invitation: `Let one thing you learned in your last spiritual leap actually carry into today's decision.`,
    },

    // ── 4 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '4_C': {
      title: `4 in Earth Line — The Emperor`,
      tagline: `A Design of Constructed Security`,
      mastery: `You build real, durable material security — wealth constructed through discipline, not luck. You can stay with unglamorous foundational work others abandon.`,
      shadow: `You grip resources so tightly nothing new can get in, mistaking control for prosperity. Money that won't move isn't protected, it's scarce on purpose.`,
      invitation: `Let one dollar move today that you'd normally hold onto out of caution.`,
    },

    // ── 1 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '1_C': {
      title: `1 in Earth Line — The Magician`,
      tagline: `A Design of Instant Origination`,
      mastery: `You spot an opening and turn it into income before anyone else finishes thinking. Real entrepreneurial instinct, real material result.`,
      shadow: `Your financial life is built entirely on starts. Money made fast leaves just as fast because nothing's built to hold it.`,
      invitation: `Pick one income stream today and commit to staying with it past the exciting part.`,
    },

    // ── 2 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '2_C': {
      title: `2 in Earth Line — The High Priestess`,
      tagline: `A Design of Quiet Financial Instinct`,
      mastery: `You have a felt sense for financial timing that outperforms the visible data. Quiet material intelligence, not loud but reliable.`,
      shadow: `You second-guess your own gut into silence, deferring to louder, more "rational" advice, and watch your instinct get overridden every time.`,
      invitation: `Act on one quiet financial certainty today before asking anyone else's opinion.`,
    },

    // ── 3 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '3_C': {
      title: `3 in Earth Line — The Empress`,
      tagline: `A Design of Cultivated Wealth`,
      mastery: `You cultivate material resources patiently, the way you'd tend something alive. Real, generative wealth, not transactional.`,
      shadow: `You pour resources into something that's stopped growing out of attachment, and give your abundance away too freely, undervaluing your own work.`,
      invitation: `Prune one thing today that's stopped growing, and price one thing you've been giving away for free.`,
    },

    // ── 5 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '5_C': {
      title: `5 in Earth Line — The Hierophant`,
      tagline: `A Design of Inherited Discipline`,
      mastery: `You absorb how wealth actually gets built from people who've done it, and apply that with real discipline.`,
      shadow: `You cling to an inherited financial system past the point it fits your actual life, following the rules exactly even when conditions have changed.`,
      invitation: `Name one inherited money rule today that's quietly expired for the life you actually live.`,
    },

    // ── 6 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '6_C': {
      title: `6 in Earth Line — The Lovers`,
      tagline: `A Design of Aligned Income`,
      mastery: `You build wealth only through work that reflects your actual values. Real material discernment, not just idealism.`,
      shadow: `You weigh every financial choice so exhaustively against your values that you never commit, watching opportunities pass while you deliberate.`,
      invitation: `Commit fully to one values-aligned choice today, even if it's not perfect.`,
    },

    // ── 7 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '7_C': {
      title: `7 in Earth Line — The Chariot`,
      tagline: `A Design of Willed Momentum`,
      mastery: `You set a material goal and steer through setbacks that would derail most people. Real sustained, willed momentum.`,
      shadow: `You grip the plan so tightly you can't adapt when things genuinely change, and refuse help even when it would get you there faster.`,
      invitation: `Let one capable person help carry a financial load today instead of doing it alone.`,
    },

    // ── 8 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '8_C': {
      title: `8 in Earth Line — Justice`,
      tagline: `A Design of Fair Dealing`,
      mastery: `You build wealth through balanced, fair dealing — real, durable security through honesty, not advantage taken.`,
      shadow: `You over-scrutinize every deal for hidden unfairness until you hesitate to invest or commit even when the deal is genuinely sound.`,
      invitation: `Move forward on one opportunity today instead of auditing it further.`,
    },

    // ── 9 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '9_C': {
      title: `9 in Earth Line — The Hermit`,
      tagline: `A Design of Rare Depth`,
      mastery: `You build material security through deep, solitary mastery of a specific craft. Real expertise, rare because you went deeper than most.`,
      shadow: `Your expertise stays private, undervalued, because putting yourself forward as an expert feels like a departure from the solitude that built it.`,
      invitation: `Price or offer one piece of your expertise publicly today instead of keeping it to yourself.`,
    },

    // ── 10 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '10_C': {
      title: `10 in Earth Line — The Wheel of Fortune`,
      tagline: `A Design of Financial Seasons`,
      mastery: `You sense when a financial cycle is turning — when to invest, when to hold. Real timing intelligence, not guesswork.`,
      shadow: `You treat a downturn as proof your luck has run out permanently, or chase every upswing without discernment, mistaking motion for a real turn.`,
      invitation: `Name which phase of your money cycle you're actually in right now, and act accordingly.`,
    },

    // ── 11 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '11_C': {
      title: `11 in Earth Line — Strength`,
      tagline: `A Design of Financial Endurance`,
      mastery: `You hold steady through financial pressure that would rattle most people, without panicking into rash decisions.`,
      shadow: `You endure financial strain quietly for far too long, refusing to ask for help because your identity is tied to handling it alone.`,
      invitation: `Ask for one piece of financial support today, before the pressure becomes a crisis.`,
    },

    // ── 12 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '12_C': {
      title: `12 in Earth Line — The Hanged Man`,
      tagline: `A Design of the Unconventional Path`,
      mastery: `Your financial breakthroughs come from stepping back from the expected route. Real material patience for an unconventional path.`,
      shadow: `You stay suspended in the wait-and-see posture indefinitely, because it's more comfortable than actually committing to the different path.`,
      invitation: `Convert one unconventional financial idea you've been sitting on into an actual move today.`,
    },

    // ── 13 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '13_C': {
      title: `13 in Earth Line — Transformation`,
      tagline: `A Design of Deliberate Ending`,
      mastery: `You release material security that's become familiar but limiting, in service of something bigger. Real financial reinvention.`,
      shadow: `You hold onto a dying income stream out of fear, not function, because the uncertain gap between old and new feels more dangerous than slow decline.`,
      invitation: `Name one financial chapter that's already ended except on paper, and release it today.`,
    },

    // ── 14 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '14_C': {
      title: `14 in Earth Line — Temperance`,
      tagline: `A Design of Patient Blending`,
      mastery: `You blend multiple income streams and strategies into one sustainable whole, patiently, rather than betting everything on one method.`,
      shadow: `You spread so thin across strategies that nothing ever compounds into something substantial. Diversification becomes dilution.`,
      invitation: `Pick two of your financial approaches today and go deeper into them instead of spreading wider.`,
    },

    // ── 15 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '15_C': {
      title: `15 in Earth Line — The Devil`,
      tagline: `A Design of Unflinching Material Truth`,
      mastery: `You understand exactly how money and power actually work on people, including yourself. Real, unflinching material intelligence.`,
      shadow: `You grip money and status so tightly that "enough" never arrives, because the attachment was never really about the number.`,
      invitation: `Name today what the accumulation is actually trying to provide you, and ask honestly if more will deliver it.`,
    },

    // ── 16 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '16_C': {
      title: `16 in Earth Line — The Tower`,
      tagline: `A Design of Sudden Material Clarity`,
      mastery: `You see a failing financial structure before anyone else admits it's failing. Real, sudden material clarity.`,
      shadow: `You provoke collapse before it's actually necessary, walking away from something at the first crack out of impatience, not evidence.`,
      invitation: `Reinforce one financial structure today instead of demolishing it on reflex.`,
    },

    // ── 17 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '17_C': {
      title: `17 in Earth Line — The Star`,
      tagline: `A Design of Rebuilt Renewal`,
      mastery: `You can restore your material life even from real loss — hope translated into the patient reconstruction of your resources.`,
      shadow: `You wait passively for renewal to arrive, treating hope as a strategy instead of a starting point, without doing the rebuilding work.`,
      invitation: `Take one concrete rebuilding step today, not just a hopeful one.`,
    },

    // ── 18 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '18_C': {
      title: `18 in Earth Line — The Moon`,
      tagline: `A Design of Sensitive Financial Instinct`,
      mastery: `You sense hidden financial risk or opportunity long before it shows up in any data. Real, sensitive material intuition.`,
      shadow: `Your financial anxiety runs unmoored from actual signal, making it hard to tell real warning from simple fear. You freeze or chase illusory security.`,
      invitation: `Check one financial feeling against a real number today — a budget, an account, something tangible.`,
    },

    // ── 19 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '19_C': {
      title: `19 in Earth Line — The Sun`,
      tagline: `A Design of Uncomplicated Ease`,
      mastery: `You build wealth most easily through work that genuinely feels like you. Real, uncomplicated ease with money.`,
      shadow: `You underprice joyful work because it didn't feel like enough of a struggle to be worth real money.`,
      invitation: `Raise the price on one thing today that you've been undercharging for because it comes easily to you.`,
    },

    // ── 20 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '20_C': {
      title: `20 in Earth Line — Judgement`,
      tagline: `A Design of the Financial Summons`,
      mastery: `You recognize when it's time to leave a financially adequate but outgrown position for one that actually fits. Real vocational courage.`,
      shadow: `You spend years preparing to answer that summons instead of actually answering it — upskilling and researching instead of moving.`,
      invitation: `Take one real step today toward the truer income source, not another round of research.`,
    },

    // ── 21 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '21_C': {
      title: `21 in Earth Line — The World`,
      tagline: `A Design of Recognized Enough`,
      mastery: `You can actually feel and recognize when a level of material security has been reached, instead of endlessly redefining "enough."`,
      shadow: `You treat arrival as dangerous, always needing one more milestone before you'll let yourself feel secure.`,
      invitation: `Name one number or state today as genuinely enough, and let yourself land in it.`,
    },

    // ── 22 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '22_C': {
      title: `22 in Earth Line — The Fool`,
      tagline: `A Design of Unproven Courage`,
      mastery: `You start a financial venture without needing a guarantee first. Real, uncommon material courage — trust as strategy.`,
      shadow: `You repeat the same fresh start without absorbing what the last one taught you, so the same mistakes recur in new disguises.`,
      invitation: `Name one concrete lesson from your last financial leap and carry it into your next decision today.`,
    },

    // ── 17 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ───
    '17_D': {
      title: `17 in Karmic Tail — The Star`,
      tagline: `A Design of Reclaimed Light`,
      mastery: `You carry real, luminous conviction — you're meant to shine, and when you let it, you offer real hope to people around you.`,
      shadow: `You dim your own light on reflex, staying half-developed so it can never be judged, undercharging and underselling what you're actually worth.`,
      invitation: `Let one piece of your work or talent be fully visible today, at full brightness, with no hedging.`,
    },

    // ── 1 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '1_D': {
      title: `1 in Karmic Tail — The Magician`,
      tagline: `A Design of the Finished Start`,
      mastery: `You generate real capability and can build something durable with it, once you actually stay.`,
      shadow: `You start with real force and abandon it the moment the initial spark fades. Income streams and relationships alike get left half-built.`,
      invitation: `Finish one thing today you already started, especially now that a new idea looks more appealing.`,
    },

    // ── 2 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '2_D': {
      title: `2 in Karmic Tail — The High Priestess`,
      tagline: `A Design of the Spoken Knowing`,
      mastery: `You have real, accurate inner knowing. When you speak it, people trust it because it's earned.`,
      shadow: `You sense things clearly and say nothing, letting other people arrive at the same conclusion slower, alone, over and over.`,
      invitation: `Say one true thing out loud today that you'd normally keep to yourself.`,
    },

    // ── 3 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '3_D': {
      title: `3 in Karmic Tail — The Empress`,
      tagline: `A Design of Received Care`,
      mastery: `You give generously, and it's a real gift — capacity for care that's already proven.`,
      shadow: `You give until you're empty and can't let yourself be cared for in return. Exhaustion becomes normal.`,
      invitation: `Let someone take care of you in one specific way today, without deflecting or repaying it immediately.`,
    },

    // ── 4 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '4_D': {
      title: `4 in Karmic Tail — The Emperor`,
      tagline: `A Design of Trusted Authority`,
      mastery: `You can hold real, steady authority — neither gripping it too hard nor giving it away.`,
      shadow: `You either grip control rigidly or abandon authority altogether, uncomfortable in the space between.`,
      invitation: `Own one decision today, gently but firmly, without either gripping it or handing it off.`,
    },

    // ── 5 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '5_D': {
      title: `5 in Karmic Tail — The Hierophant`,
      tagline: `A Design of Examined Belief`,
      mastery: `You can examine a belief you inherited and consciously choose what actually stays. Real, lived wisdom, not installed doctrine.`,
      shadow: `You swing between rigid certainty and total skepticism, rarely landing on a belief you've actually tested and kept.`,
      invitation: `Examine one inherited belief today — about money, love, or authority — and decide, on purpose, whether it's actually yours.`,
    },

    // ── 6 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '6_D': {
      title: `6 in Karmic Tail — The Lovers`,
      tagline: `A Design of the Kept Choice`,
      mastery: `You can make a real choice from your own values and stay inside it. Commitment that actually holds.`,
      shadow: `You keep one foot out the door on decisions that matter, holding relationships and paths loosely enough to exit without cost.`,
      invitation: `Recommit fully today to one choice you've been keeping half-made.`,
    },

    // ── 7 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '7_D': {
      title: `7 in Karmic Tail — The Chariot`,
      tagline: `A Design of Trusted Direction`,
      mastery: `You can hold direction firmly without gripping it — steady, trusting forward motion.`,
      shadow: `You either force your way through everything or drift without any real momentum, rarely finding the steady middle.`,
      invitation: `Loosen your grip on one thing you've been forcing today, or choose direction on one thing you've let drift.`,
    },

    // ── 8 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '8_D': {
      title: `8 in Karmic Tail — Justice`,
      tagline: `A Design of the Settled Account`,
      mastery: `You can make an honest accounting — an apology, a boundary, a debt repaid — and actually settle it.`,
      shadow: `You carry a persistent, hard-to-place sense of owing or being owed that never resolves, especially around money and unspoken relational ledgers.`,
      invitation: `Settle one small account today — an apology, a repayment, a boundary you've been avoiding.`,
    },

    // ── 9 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '9_D': {
      title: `9 in Karmic Tail — The Hermit`,
      tagline: `A Design of the Offered Lantern`,
      mastery: `You gather real wisdom in solitude, and when you offer it, it genuinely helps someone.`,
      shadow: `You withdraw past what reflection requires, using solitude to avoid rather than gather, and keep hard-won expertise entirely to yourself.`,
      invitation: `Share one thing you've learned in solitude today with someone who could actually use it.`,
    },

    // ── 10 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '10_D': {
      title: `10 in Karmic Tail — The Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `You can let a natural cycle turn — a season ending, a role changing — without gripping against it.`,
      shadow: `You dread the downswing and grip hardest exactly at the high point, refusing to let a cycle complete naturally.`,
      invitation: `Let one cycle in your life turn today without resisting it.`,
    },

    // ── 11 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '11_D': {
      title: `11 in Karmic Tail — Strength`,
      tagline: `A Design of Gentle Endurance`,
      mastery: `You can meet a hard moment with patient, embodied calm — real strength, not force or collapse.`,
      shadow: `You either overpower situations that needed patience or collapse under pressure that gentleness could have held.`,
      invitation: `Meet one difficult moment today with calm instead of force or giving up.`,
    },

    // ── 12 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '12_D': {
      title: `12 in Karmic Tail — The Hanged Man`,
      tagline: `A Design of Voluntary Release`,
      mastery: `You can release something voluntarily, before you're forced to, and actually mean it.`,
      shadow: `You grip control until circumstances force your hand, or perform sacrifice while privately resenting it.`,
      invitation: `Release one thing today on your own terms, before you're forced to.`,
    },

    // ── 13 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '13_D': {
      title: `13 in Karmic Tail — Transformation`,
      tagline: `A Design of the Complete Ending`,
      mastery: `You can let an ending actually finish — completely, with nothing lingering.`,
      shadow: `You leave things half-ended, one foot still in a door you've already decided to walk through.`,
      invitation: `Let one lingering ending in your life actually finish today, fully.`,
    },

    // ── 14 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '14_D': {
      title: `14 in Karmic Tail — Temperance`,
      tagline: `A Design of Held Extremes`,
      mastery: `You can hold two opposing things at once without collapsing into either extreme. Real, patient synthesis.`,
      shadow: `You swing between all-or-nothing states — total immersion or total withdrawal, reckless spending or fear-driven restriction.`,
      invitation: `Hold the middle on one thing today instead of swinging to either extreme.`,
    },

    // ── 15 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '15_D': {
      title: `15 in Karmic Tail — The Devil`,
      tagline: `A Design of Loosened Chains`,
      mastery: `You can name an attachment honestly and take one real step to loosen it. Real, conscious liberation.`,
      shadow: `You recreate dynamics of control — being controlled or controlling — without seeing the pattern while it's happening.`,
      invitation: `Name one attachment or control dynamic honestly today, and take one step to loosen it.`,
    },

    // ── 16 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '16_D': {
      title: `16 in Karmic Tail — The Tower`,
      tagline: `A Design of the Finished Collapse`,
      mastery: `You can let a structure that's already failing actually fall, on your own terms, instead of propping it up.`,
      shadow: `You maintain beliefs, relationships, or identities long past the point they're standing on solid ground, out of fear of collapse.`,
      invitation: `Let one thing that's already failing fall today, deliberately, instead of propping it up further.`,
    },

    // ── 18 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '18_D': {
      title: `18 in Karmic Tail — The Moon`,
      tagline: `A Design of the Faced Fog`,
      mastery: `You can walk directly into an uncertain situation and let real clarity come from actually being inside it.`,
      shadow: `You carry free-floating anxiety that doesn't attach to anything specific, and avoid situations that would require facing something head-on.`,
      invitation: `Walk toward one uncertain thing today instead of avoiding it — check the number, have the conversation.`,
    },

    // ── 19 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '19_D': {
      title: `19 in Karmic Tail — The Sun`,
      tagline: `A Design of Undimmed Joy`,
      mastery: `You can let joy be fully, visibly felt — real vitality offered without apology.`,
      shadow: `You downplay good news and mute your own excitement, feeling guilty when things are genuinely going well.`,
      invitation: `Let one piece of good news be fully celebrated today, at full volume, no minimizing.`,
    },

    // ── 20 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '20_D': {
      title: `20 in Karmic Tail — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `You can answer a call you've been postponing, even before you feel ready.`,
      shadow: `You get close to something important and stall just short of the actual leap, again and again.`,
      invitation: `Answer one call you've been postponing today, imperfectly, before you feel ready.`,
    },

    // ── 21 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '21_D': {
      title: `21 in Karmic Tail — The World`,
      tagline: `A Design of the Closed Circle`,
      mastery: `You can let something nearly-finished actually complete, resisting the old pull to stop short.`,
      shadow: `You stop just short of finishing — projects, relationships, goals that get to nearly-there and quietly stall.`,
      invitation: `Complete one nearly-finished thing today instead of letting it stay at "almost."`,
    },

    // ── 22 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '22_D': {
      title: `22 in Karmic Tail — The Fool`,
      tagline: `A Design of the Considered Leap`,
      mastery: `You can take a real leap deliberately, with your eyes open — genuine trust, not recklessness or total caution.`,
      shadow: `You either leap without any real consideration or refuse to leap at all, rarely finding trust that includes awareness.`,
      invitation: `Take one real, considered leap today — not reckless, not avoided, just chosen.`,
    },

    // ── 7 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '7_E': {
      title: `7 in Soul Center — The Chariot`,
      tagline: `A Design of the Trusted Compass`,
      mastery: `You navigate. Not speed, not achievement — the sustained, disciplined ability to keep moving in a chosen direction no matter what shows up. Real, internally generated direction.`,
      shadow: `You believe you have to figure everything out alone. Self-sufficiency becomes a very specific kind of loneliness, and help that arrives late isn't proof people can't be trusted — it's proof you decided long ago that receiving wasn't safe.`,
      invitation: `Take one piece of help today without immediately fixing or repaying it.`,
    },

    // ── 1 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '1_E': {
      title: `1 in Soul Center — The Magician`,
      tagline: `A Design of the Sacred Beginning`,
      mastery: `You feel most like yourself in the act of beginning. You're a source — someone through whom things get started and brought into form.`,
      shadow: `You believe only the beginning counts. You scatter across a lifetime of starts, chasing the high of originating, never settling into what you actually started to prove.`,
      invitation: `Finish one thing today instead of starting something new.`,
    },

    // ── 2 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '2_E': {
      title: `2 in Soul Center — The High Priestess`,
      tagline: `A Design of Quiet Certainty`,
      mastery: `You feel most like yourself in quiet certainty — knowing before your mind catches up. Real, undemanding inner truth.`,
      shadow: `You stay so private with your knowing that it never meets the world. A rich inner life that never translates into anything visible.`,
      invitation: `Let your inner knowing direct one real choice today, not just private reflection.`,
    },

    // ── 3 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '3_E': {
      title: `3 in Soul Center — The Empress`,
      tagline: `A Design of Rooted Cultivation`,
      mastery: `You feel most like yourself actively growing something — tending it with real care rather than rushing it.`,
      shadow: `You lose your own purpose inside everyone else's growth, nurturing outward so consistently that nothing of your own ever gets planted.`,
      invitation: `Give yourself today the same patient attention you give everyone else's growth.`,
    },

    // ── 4 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '4_E': {
      title: `4 in Soul Center — The Emperor`,
      tagline: `A Design of Purposeful Structure`,
      mastery: `You feel most like yourself constructing something meant to last — real, durable structure that holds weight over time.`,
      shadow: `You confuse the structure with the purpose, maintaining rigid systems long after they've stopped serving anyone, including you.`,
      invitation: `Ask today what one of your structures is actually for, and stay loyal to that answer.`,
    },

    // ── 5 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '5_E': {
      title: `5 in Soul Center — The Hierophant`,
      tagline: `A Design of Living Transmission`,
      mastery: `You feel most like yourself learning or teaching something real — part of a lineage that runs through you.`,
      shadow: `You hold wisdom so tightly it never actually moves through you to anyone else. Purpose that stays private stops being purpose.`,
      invitation: `Teach or share one thing today, even before you feel fully qualified.`,
    },

    // ── 6 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '6_E': {
      title: `6 in Soul Center — The Lovers`,
      tagline: `A Design of Lived Alignment`,
      mastery: `You feel most like yourself in a clean, values-driven choice, even a hard one. Real alignment, not mere comfort.`,
      shadow: `You treat every choice as equally weighty, exhausting yourself with deliberation until fatigue masquerades as depth.`,
      invitation: `Let one small choice today be small. Save your full attention for the one that actually matters.`,
    },

    // ── 8 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '8_E': {
      title: `8 in Soul Center — Justice`,
      tagline: `A Design of Grounded Integrity`,
      mastery: `You feel most like yourself being genuinely honest, even when it costs you. Real integrity, held steady.`,
      shadow: `You turn that integrity into a permanent audit of everyone else, using your own honesty to judge the world instead of just living it.`,
      invitation: `Let your integrity be demonstrated today, not enforced on anyone else.`,
    },

    // ── 9 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '9_E': {
      title: `9 in Soul Center — The Hermit`,
      tagline: `A Design of Depth in Motion`,
      mastery: `You feel most like yourself in quiet, unhurried reflection. Real clarity that comes from solitude.`,
      shadow: `You mistake permanent withdrawal for purpose itself, staying so deep in reflection the insight never gets tested against an actual life.`,
      invitation: `Bring one thing the quiet showed you back out into your actual life today.`,
    },

    // ── 10 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '10_E': {
      title: `10 in Soul Center — The Wheel of Fortune`,
      tagline: `A Design of the Steady Center`,
      mastery: `You feel most like yourself moving with change, not despite it. Real equanimity through life's cycles.`,
      shadow: `You tie your sense of purpose to the wheel's current position — purposeful when things go well, purposeless the moment they turn.`,
      invitation: `Find your footing today in your relationship to the turning, not in where the wheel currently sits.`,
    },

    // ── 11 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '11_E': {
      title: `11 in Soul Center — Strength`,
      tagline: `A Design of Purposeful Endurance`,
      mastery: `You feel most like yourself holding something difficult without fighting or fleeing it. Real, embodied endurance.`,
      shadow: `You confuse endurance itself with the purpose, holding weight indefinitely as an identity instead of a means to something else.`,
      invitation: `Let your steadiness serve something beyond itself today — a relationship, a piece of work, not just the holding.`,
    },

    // ── 12 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '12_E': {
      title: `12 in Soul Center — The Hanged Man`,
      tagline: `A Design of the Returned Surrender`,
      mastery: `You feel most like yourself once you've stopped forcing an answer and let one arrive. Real meaning through voluntary surrender.`,
      shadow: `You stay suspended indefinitely, treating the not-knowing itself as the purpose instead of a passage toward one.`,
      invitation: `Take the new angle your last surrender revealed and actually act on it today.`,
    },

    // ── 13 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '13_E': {
      title: `13 in Soul Center — Transformation`,
      tagline: `A Design of Genuine Becoming`,
      mastery: `You feel most like yourself in the act of becoming — willing to let old versions of yourself die for a truer one.`,
      shadow: `You manufacture endings for their own sake, mistaking constant reinvention for the deeper transformation this actually asks for.`,
      invitation: `Let one transformation today be slow and quiet instead of dramatic.`,
    },

    // ── 14 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '14_E': {
      title: `14 in Soul Center — Temperance`,
      tagline: `A Design of Earned Synthesis`,
      mastery: `You feel most like yourself in the space between extremes, where genuine synthesis happens over time.`,
      shadow: `You use the blending as an excuse to avoid fully engaging either side, staying so centered that nothing gets lived with any intensity.`,
      invitation: `Fully inhabit one side of something today before trying to blend it.`,
    },

    // ── 15 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '15_E': {
      title: `15 in Soul Center — The Devil`,
      tagline: `A Design of Metabolized Shadow`,
      mastery: `You feel most like yourself metabolizing your own darker material instead of denying it. Real honesty, real liberation.`,
      shadow: `You get fascinated with the darkness itself, circling your own shadow material without ever working it through to freedom.`,
      invitation: `Take one honest look at something you've been circling today, and let it actually free something.`,
    },

    // ── 16 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '16_E': {
      title: `16 in Soul Center — The Tower`,
      tagline: `A Design of Earned Clarity`,
      mastery: `You feel most like yourself in the aftermath of a real reorganization, once the dust settles and you can see clearly.`,
      shadow: `You need the collapse itself to feel purposeful, provoking crisis because gradual clarity feels less convincing than a dramatic one.`,
      invitation: `Let one piece of clarity arrive gently today instead of waiting for collapse to force it.`,
    },

    // ── 17 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '17_E': {
      title: `17 in Soul Center — The Star`,
      tagline: `A Design of Reciprocal Hope`,
      mastery: `You feel most like yourself actively replenishing something — trusting the process before there's proof it's working.`,
      shadow: `You pour hope outward so consistently your own reserves run dry, offering renewal to everyone except yourself.`,
      invitation: `Let yourself be replenished by someone today instead of only replenishing others.`,
    },

    // ── 18 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '18_E': {
      title: `18 in Soul Center — The Moon`,
      tagline: `A Design of Trusted Feeling`,
      mastery: `You feel most like yourself honoring what you sense rather than only what you can prove. Real intuition, trusted.`,
      shadow: `You get lost in the depths without a way back to functioning, letting the felt sense override any grounded engagement with reality.`,
      invitation: `Anchor one intuition today to something concrete — a number, a conversation, a real decision.`,
    },

    // ── 19 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '19_E': {
      title: `19 in Soul Center — The Sun`,
      tagline: `A Design of Uncomplicated Radiance`,
      mastery: `You feel most like yourself in unguarded joy — simply radiating who you already are. Real, uncomplicated purpose.`,
      shadow: `You believe purpose this simple can't be enough, searching for something more complicated and dimming your natural radiance in the process.`,
      invitation: `Let one moment of simple joy today count as purpose, with no bigger mission required to justify it.`,
    },

    // ── 20 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '20_E': {
      title: `20 in Soul Center — Judgement`,
      tagline: `A Design of the Ongoing Awakening`,
      mastery: `You feel most like yourself rising to meet a call you could have easily ignored. Real, ongoing awakening.`,
      shadow: `You hear the call and endlessly prepare to answer it, using self-improvement as a substitute for the actual leap.`,
      invitation: `Answer one call today before you feel fully ready.`,
    },

    // ── 21 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '21_E': {
      title: `21 in Soul Center — The World`,
      tagline: `A Design of Earned Arrival`,
      mastery: `You feel most like yourself in a moment of real, earned arrival, however temporary. Genuine completion, genuinely felt.`,
      shadow: `You refuse to ever call anything complete, treating wholeness as a permanently receding goal because arriving means facing what comes next.`,
      invitation: `Let yourself actually land in one "this is whole" moment today, before the next cycle begins.`,
    },

    // ── 22 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '22_E': {
      title: `22 in Soul Center — The Fool`,
      tagline: `A Design of Accumulating Trust`,
      mastery: `You feel most like yourself at the edge of something new, stepping forward without needing a guarantee first.`,
      shadow: `You treat every fresh start as an escape from whatever the last one asked of you, so nothing ever accumulates into a deeper self.`,
      invitation: `Carry one lesson from your last beginning into whatever you start today.`,
    },

    // ── 5 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '5_LOVE': {
      heading: `Substance Over Spark`,
      why: `You're not drawn to a connection just because it feels good in the moment — you fall in love with substance. The Hierophant governs your relationship channel, which means intimacy runs on the frequency of the seeker and keeper of codes: earned structure, depth, the difference between a connection that's been tested against real standards and one that's just easy. You're drawn to partners who carry some kind of depth, tradition, or hard-won knowledge — loyal, value-oriented, spiritually or morally aligned with you, genuinely ready for real commitment — and in return you offer something rare — genuine reverence, the willingness to actually study another person, to learn the specific architecture of how they work, and to honor what it took them to become who they are. For you, relationship is one of the primary places you expect to be taught something true about how life actually works.`,
      shadow: `The risk is love organized around an unspoken exam. You might find yourself measuring a partner against a standard of what a relationship is "supposed" to look like — inherited from family, culture, or an idealized version of commitment — while quietly holding back your full arrival until they pass. A subtler trap is treating a partner like a student rather than an equal: correcting, instructing, holding the position of the one who knows how this is done. And because you respect earned authority, you might also defer to a partner's confidence over your own read of what's actually happening between you, mistaking their certainty for correctness. If your relationships keep handing you partners who feel like they're auditioning for you, or who audition you right back, that's often a sign intimacy hasn't yet been allowed to exist without a passing grade.`,
      path: `Try letting the relationship itself become the sacred text, instead of measuring it against one you inherited somewhere else. That's the harder, more exposing shift — it means letting go of an external rulebook and trusting what's actually true between the two of you, even when it doesn't match the tradition you were handed. Practice offering your attention and reverence without requiring the relationship to earn it first. The standard that actually matters is the one you build together, not the one you bring in ahead of time. Once love stops being graded, it finally has room to teach you something no book ever could. You are allowed to want depth and delight in the same person. Where has substance already been quietly winning over spark in your life?`,
      positive: `The gift for loving substance and earned depth hasn't changed — reverence for what it took a partner to become who they are was always real. What's different is that you now let the relationship itself become the sacred text, instead of measuring it against a rulebook you inherited elsewhere. That shift is what finally lets love stop being graded.`,
      negative: `The respect for depth and earned trust you bring to love is completely real, and it keeps organizing intimacy around an unspoken exam, partners arriving to audition or auditioning you right back. That grading isn't discernment. It's an intimacy still waiting to exist without first passing a test.`,
    },

    // ── 1 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '1_LOVE': {
      heading: `Momentum Over Comfort`,
      why: `You're drawn to partners with real agency, people who turn intention into action, and in return you offer a rare gift: the ability to make a relationship feel alive, to generate momentum in a connection that might otherwise stall. The Magician governs your relationship channel, meaning intimacy runs on the frequency of origination. Your ideal partner tends to be confident and proactive, someone intellectually stimulating who genuinely supports your independence rather than needing to constrain it, inspiring real growth in you the way you inspire it in them. For you, love often starts with genuine excitement, a spark that both people can feel building something together in real time.`,
      shadow: `The risk is loving the spark more than the substance — chasing the electric feeling of a new connection's beginning and losing interest once it settles into the quieter, steadier stage that follow-through requires. You might also fall for potential rather than the actual person, drawn to what a partner could become rather than who they currently are. If your relationships keep fizzling right after the exciting start, that's the shadow of origination without staying power.`,
      path: `Try letting a relationship's quieter chapter feel as alive as its beginning. The real magic isn't only in the spark — it's in what you're both willing to keep building once the initial charge settles. Staying is its own kind of magic, one you're fully capable of. You are allowed to be pursued too, not just impressed. What would it feel like to be the one someone moves mountains toward?`,
      positive: `The gift for generative energy in relationships hasn't changed — the ability to make a connection feel alive was always real. What's different is that you now let a relationship's quieter chapter feel as alive as its beginning. That maturing is what keeps love building instead of flaming out after the exciting start.`,
      negative: `The spark you bring to new connection is completely real, and it keeps fizzling right when the quieter, more durable stage was about to begin. That fizzling isn't loss of interest exactly. It's an origination still waiting for the staying power that turns a beginning into something lasting.`,
    },

    // ── 2 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '2_LOVE': {
      heading: `Depth Over Surface`,
      why: `You're drawn to partners who carry real interiority, and you offer something rare in return: patient, perceptive attention that makes people feel truly seen rather than just looked at. The High Priestess governs your relationship channel, meaning intimacy for you runs on depth and quiet knowing rather than surface chemistry. Your ideal partner tends to be emotionally sensitive and intuitive themselves, patient with you, genuinely respectful of your need for personal space, someone capable of deeply understanding rather than just accompanying you. Your love tends to build slowly, through accumulated trust rather than instant certainty.`,
      shadow: `The risk is staying so guarded yourself that intimacy becomes one-directional — you perceive your partner deeply while remaining genuinely unreadable to them, which can leave them feeling like they're loving a mystery instead of a person. If your relationships keep stalling at a certain depth without ever going further, that's often your own guardedness setting the ceiling.`,
      path: `Let yourself be known at the same pace you come to know someone else. Depth in a relationship has to run both directions to actually become intimacy. Your perceptiveness is a real gift — pair it with equal visibility, and closeness stops having a ceiling. You are allowed to say what you sense in a partner instead of only holding it. What have you perceived in your closest bond that deserves daylight?`,
      positive: `The gift for perceiving a partner deeply hasn't changed — patient, quiet knowing was always real. What's different is that you now let yourself be known at the same pace you come to know someone else. That mutual visibility is what lets intimacy build in both directions instead of stalling.`,
      negative: `The depth of perception you bring to a partner is completely real, and it keeps staying one-directional, you fully known to no one while knowing everyone else fully. That imbalance isn't privacy. It's an intimacy still capped, still waiting for you to let yourself be seen at the same depth.`,
    },

    // ── 3 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '3_LOVE': {
      heading: `Tending Over Chasing`,
      why: `You're drawn to people you can pour into, and your gift for creating warmth and abundance in a relationship is real and rare. The Empress governs your relationship channel, meaning love for you is expressed through nurturing — genuine, generous care that makes a partner feel tended to in a way they may never have experienced before. Your ideal partner meets that generosity with their own — nurturing and affectionate in return, genuinely appreciative of beauty, emotionally available enough to actually receive what you're offering rather than simply absorbing it.`,
      shadow: `The risk is a relationship organized entirely around your giving, where your own needs quietly go unspoken because tending to your partner has become the whole shape of the connection. You might attract partners who are comfortable receiving endlessly without reciprocating, because the dynamic never asked them to. If you're always the one nurturing and rarely the one being nurtured, that's an imbalance worth naming out loud.`,
      path: `Let yourself be tended to as openly as you tend to others. Real intimacy requires you to actually need something and let your partner meet it — not just be the reliable source of care. Receiving isn't a departure from your gift; it completes it. You are allowed to be tended to with the same completeness you offer. Who could you let take care of you this week without supervising them?`,
      positive: `The gift for generous, tending care hasn't changed — real warmth and abundance offered to a partner were always genuine. What's different is that you now let yourself be tended to as openly as you tend to others. That receiving is what makes the nurturing mutual instead of one-directional.`,
      negative: `The care you pour into a relationship is completely real, and it keeps organizing the whole connection around your giving, your own needs staying unspoken. That silence isn't selflessness. It's a nurturing still waiting to flow back toward the person creating it.`,
    },

    // ── 4 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '4_LOVE': {
      heading: `Building Over Chemistry`,
      why: `You're drawn to partners who value real solidity, and you build relationships the way you'd build anything meant to last, with real commitment to the container itself: consistency, follow-through, a partner who can trust exactly where they stand with you. The Emperor governs your relationship channel, meaning love for you is expressed through structure and reliability. Your ideal partner is reliable and strong in their own right, responsible and protective, genuinely capable of providing the same stability and leadership you bring, rather than simply admiring it in you.`,
      shadow: `The risk is prioritizing the structure of the relationship over its actual aliveness — maintaining the form (the routines, the roles, the commitment) even after the genuine connection inside it has started to fade. You might also try to control the relationship's shape more than a partner can comfortably live inside. If your relationship feels stable but quietly stagnant, structure may have outpaced intimacy.`,
      path: `Let the container flex sometimes. Real stability doesn't require rigid form — it requires trust strong enough to survive some genuine change in how the relationship looks. Build something solid enough to bend without breaking. You are allowed to rest inside what you've built together instead of endlessly maintaining it. What would love feel like on a day you weren't the load-bearing wall?`,
      positive: `The gift for building solid, reliable love hasn't changed — real commitment to the container, consistency, follow-through, was always genuine. What's different is that you now let the container flex sometimes instead of maintaining rigid form. That flexibility is what keeps the relationship alive, not just structurally intact.`,
      negative: `The structure you build in love is completely real, and it keeps getting maintained even after the genuine connection inside it has started to fade. That maintaining isn't commitment. It's a relationship still waiting to feel as alive as it looks stable.`,
    },

    // ── 6 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '6_LOVE': {
      heading: `Values Over Surface`,
      why: `You're drawn to partners whose core principles genuinely match yours, and the relationship itself becomes an ongoing series of aligned choices rather than one initial spark. The Lovers governing your relationship channel is almost too on the nose — but what it actually means is that your love is built on genuine alignment: shared values, a real sense of choosing each other deliberately rather than falling together by convenience. Your ideal partner is romantic and genuinely communicative, emotionally open rather than guarded, someone who chooses the relationship consciously alongside you rather than drifting into it.`,
      shadow: `The risk is treating every disagreement as evidence of misalignment, testing a partner's values so exhaustively that the relationship starts to feel like an audit rather than a partnership. You might also idealize a partner's values early on and feel betrayed when they turn out to be an actual, imperfect person. If your relationships keep ending over values gaps that seem small in hindsight, the standard may be set too high to survive real intimacy.`,
      path: `Let alignment be a direction you're both moving in, not a static test a partner has to pass upfront. Real values-alignment is built through actually living together, choice by choice, not verified before you begin. You are allowed to be loved for your values, not despite them. Which of your core convictions deserves a partner who shares its weight?`,
      positive: `The gift for loving someone's actual values hasn't changed — genuine alignment, choosing each other deliberately, was always the real foundation. What's different is that you now let alignment be a direction you're both moving in, not a static test a partner has to pass upfront. That shift is what lets love deepen through lived choices.`,
      negative: `The standard you hold for shared values is completely real, and it keeps auditing a partner against an idealized version, small gaps starting to feel like betrayals. That auditing isn't discernment. It's an alignment still waiting to be built together instead of verified in advance.`,
    },

    // ── 7 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '7_LOVE': {
      heading: `Momentum Shared, Not Carried`,
      why: `You're drawn to partners who are also going somewhere, who bring their own momentum to the relationship rather than needing you to supply all of it. The Chariot governing your relationship channel means love for you thrives on shared direction. Your ideal partner is ambitious and active, genuinely goal-driven, someone who actively supports real movement, growth, and shared victories rather than just tolerating your drive. At your best, love feels like navigating life together, two people steering a shared course with mutual respect for each other's will.`,
      shadow: `The risk is turning the relationship into a solo drive with a passenger — setting the direction and expecting your partner to simply come along, rather than actually steering together. You might also struggle with a partner whose pace differs from yours, experiencing their need to pause as a threat to your forward motion. If your relationships keep feeling like you're pulling the weight alone, the reins may need to be shared more evenly.`,
      path: `Let your partner actually hold some of the reins. Real partnership means occasionally slowing to their pace, or trusting their read on the terrain even when it differs from yours. Shared direction requires two hands on the wheel, not one driver and one passenger. You are allowed to slow the journey to let the togetherness catch up. What destination are you racing toward that might matter less than who's beside you?`,
      positive: `The gift for shared direction hasn't changed — momentum, navigating life together, was always the real draw. What's different is that you now let your partner actually hold some of the reins instead of setting the pace alone. That shared steering is what turns the drive into a genuine partnership.`,
      negative: `The momentum you bring to a relationship is completely real, and it keeps turning into a solo drive with a passenger, direction set and a partner expected to simply follow. That solo driving isn't leadership. It's a partnership still waiting for two hands on the wheel instead of one.`,
    },

    // ── 8 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '8_LOVE': {
      heading: `Word Kept, Trust Built`,
      why: `You're drawn to partners who follow through on what they say, who hold themselves accountable the way you hold yourself, and you offer a relationship built on genuine reciprocity rather than unspoken imbalance. Justice governing your relationship channel means intimacy for you runs on fairness. Your ideal partner is fair and honest in their own right, emotionally balanced, genuinely respectful of your boundaries, someone reliable in the agreements you make together. Trust, for you, is built transaction by transaction, promise by kept promise.`,
      shadow: `The risk is keeping an internal ledger of who's done more, who owes what, turning intimacy into an accounting exercise rather than a felt connection. You might also struggle to forgive a partner's genuine mistake, holding them to a standard of consistency no real relationship can maintain perfectly. If your relationships keep feeling like negotiations, the fairness may have crowded out the warmth.`,
      path: `Let some imbalance be human rather than a violation. Real fairness in love isn't a perfectly even ledger — it's mutual good faith over time. Let go of tracking every exchange and trust the overall pattern instead. You are allowed to relax once someone has proven their word. Whose kept promises have you not yet let yourself fully trust?`,
      positive: `The gift for fairness and reciprocity hasn't changed — trust built promise by kept promise was always real. What's different is that you now let some imbalance be human instead of tracking every exchange. That release is what lets fairness support warmth instead of replacing it.`,
      negative: `The fairness you bring to love is completely real, and it keeps keeping an internal ledger of who's done more, turning intimacy into an accounting exercise. That accounting isn't integrity. It's a warmth still waiting for the tracking to stop.`,
    },

    // ── 9 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ──
    '9_LOVE': {
      heading: `Silence Without Distance`,
      why: `You're drawn to partners who have their own rich inner life and don't need constant togetherness to feel connected. The Hermit governing your relationship channel means intimacy for you includes real respect for solitude. Your ideal partner is wise and mature, emotionally self-sufficient in their own right, genuinely respectful of solitude rather than threatened by it, deep and thoughtful the way you are. Your love is patient and deep rather than constant and loud, built in the quiet moments as much as the shared ones.`,
      shadow: `The risk is using your need for space as a way to avoid real vulnerability, retreating into solitude precisely when a relationship asks for more closeness than feels comfortable. A partner can end up feeling shut out rather than respected. If you notice your partner repeatedly asking for more presence than you're offering, the withdrawal may be protecting you from intimacy rather than honoring a genuine need.`,
      path: `Let your partner know when solitude is genuine need versus avoidance, and practice staying present even when closeness feels exposing. Real intimacy includes some discomfort — the solitude that protects you can't be the whole relationship. You are allowed to share the silence instead of guarding it. Who in your life already knows how to be quiet with you?`,
      positive: `The gift for respecting solitude hasn't changed — patient, deep love built in the quiet moments was always real. What's different is that you now let your partner know when solitude is genuine need versus avoidance, and stay present when closeness is asked for. That honesty is what keeps a partner feeling respected instead of shut out.`,
      negative: `The need for space you carry is completely real, and it keeps functioning as a way to avoid real vulnerability, retreating precisely when the relationship asks for more closeness. That retreat isn't a boundary. It's an intimacy still waiting for you to stay present through the exposing part.`,
    },

    // ── 10 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '10_LOVE': {
      heading: `Seasons, Not Straight Lines`,
      why: `Your love life genuinely moves in cycles — periods of real connection followed by periods of solitude or change, relationships that seem to arrive right when you're ready for them. The Wheel of Fortune governing your relationship channel names exactly this pattern. Your ideal partner is flexible and adaptable themselves, genuinely optimistic, open to change rather than braced against it, someone capable of actually growing through life's cycles alongside you instead of resisting them. You have a real gift for meeting a relationship's current season honestly, rather than forcing permanence on something that's naturally shifting.`,
      shadow: `The risk is treating a relationship's downswing as proof it's over, bailing at the first sign of a natural low rather than riding the cycle through to see what's on the other side. You might also chase the excitement of new connections whenever an existing one settles into a quieter phase. If your relationships keep ending right as they'd naturally deepen, the fear of the turn may be causing it.`,
      path: `Let a relationship's low season be a season, not a verdict. Real partnership survives more than one turn of the wheel. Stay through at least one full cycle before deciding what a relationship actually is. You are allowed to trust a winter without declaring the garden dead. Which season is your love actually in right now — and what does that season need?`,
      positive: `The gift for meeting a relationship's seasons honestly hasn't changed — real cycles of connection and solitude were always the true pattern. What's different is that you now let a low season be a season, not a verdict, staying through at least one full cycle. That trust is what lets connections survive to deepen.`,
      negative: `The honesty about a relationship's seasons is completely real, and it keeps treating a downswing as proof it's over, bailing at the first natural low. That bailing isn't self-protection. It's a connection still waiting to be given a full cycle before being judged.`,
    },

    // ── 11 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '11_LOVE': {
      heading: `Steadiness Over Spark`,
      why: `You're the partner who can hold a hard conversation, a difficult season, or a partner's raw emotion without flinching or needing to fix it immediately. Strength governing your relationship channel means love for you is expressed through embodied calm. Your ideal partner meets that calm with their own passion and emotional strength — genuinely supportive, actively encouraging your confidence the way you encourage theirs, so the relationship runs on mutual empowerment rather than your steadiness alone. Partners often feel safest with you specifically because your steadiness doesn't waver under real pressure.`,
      shadow: `The risk is holding all the relationship's difficulty yourself, becoming the strong one so consistently that your partner never learns to hold weight for you in return. You might also suppress your own hard feelings to maintain the calm, leaving your own needs quietly invisible inside the relationship. If you're always the one being steady, that steadiness may be costing you real reciprocity.`,
      path: `Let your own difficulty be visible sometimes, on purpose. Real intimacy needs both people to be held, not just one person holding. Your calm is a gift — it becomes a trap if it never includes your own turn to lean. You are allowed to wobble and still be the steady one. Who gets to hold you on the days the room leans on you hardest?`,
      positive: `The gift for embodied calm hasn't changed — holding a hard conversation without flinching was always real strength. What's different is that you now let your own difficulty be visible sometimes, on purpose. That visibility is what lets the relationship carry weight both ways instead of only through you.`,
      negative: `The steadiness you offer a relationship is completely real, and it keeps holding all the difficulty yourself, your own hard feelings staying invisible. That invisibility isn't strength. It's a reciprocity still waiting for your own turn to lean.`,
    },

    // ── 12 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '12_LOVE': {
      heading: `Ease Over Force`,
      why: `Real connection tends to show up once you've released your grip on how or when it's supposed to happen. The Hanged Man governing your relationship channel means intimacy for you often arrives through surrender rather than pursuit. Your ideal partner is compassionate and patient in their own right, genuinely empathetic, willing to actually support your emotional and spiritual growth rather than just waiting for you to arrive somewhere. You have a genuine gift for seeing a relationship from an angle a partner hadn't considered, patient enough to let understanding unfold rather than forcing resolution.`,
      shadow: `The risk is passivity dressed as patience — waiting indefinitely for a relationship to clarify itself rather than ever actually engaging directly, leaving a partner uncertain where they stand. If your relationships stay suspended in ambiguity for a long time, the patience may have become avoidance of a real decision.`,
      path: `Let your patience have a deadline. Real surrender in love means releasing control over outcome, not avoiding the actual choice in front of you. At some point, come down from the suspension and commit to what the waiting revealed. You are allowed to stop forcing and see what arrives. What might come toward you the moment you put the effort down?`,
      positive: `The gift for surrendering the grip on how connection should happen hasn't changed — real intimacy arriving through release rather than pursuit was always true for you. What's different is that you now let your patience have a deadline and commit to what the waiting revealed. That commitment is what moves ambiguity into real partnership.`,
      negative: `The patience you bring to relationships is completely real, and it keeps waiting indefinitely for clarity rather than ever actually engaging directly. That waiting isn't surrender. It's a partnership still suspended, still waiting for the patience to resolve into an actual choice.`,
    },

    // ── 13 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '13_LOVE': {
      heading: `Change Invited, Not Feared`,
      why: `Real relationships change who you are, and you're drawn to partners capable of that same depth of transformation rather than people who'll keep you exactly as you were. Transformation governing your relationship channel means love for you is genuinely metamorphic. Your ideal partner is genuinely ready for deep transformation themselves, honest and courageous, someone actively open to change and renewal rather than clinging to who they already were. You bring real intensity and a willingness to actually grow because of a connection, not just alongside it.`,
      shadow: `The risk is needing every relationship to be transformative to feel real, which can make ordinary, steady affection feel unsatisfying by comparison, or push you to manufacture intensity where genuine ease would actually serve you better. If your relationships keep running hot and dramatic, the transformation may be getting confused with turbulence.`,
      path: `Let some relationship growth happen quietly. Real transformation doesn't require constant intensity — some of your deepest changes will come through steady, undramatic companionship. Depth doesn't need to be loud to be real. You are allowed to be changed by love without losing yourself to it. What has loving deeply already transformed in you that you're grateful for?`,
      positive: `The gift for metamorphic love hasn't changed — real intensity and willingness to grow because of a connection was always genuine. What's different is that you now let some relationship growth happen quietly, without needing constant drama. That quiet growth is what lets depth register without needing to be loud.`,
      negative: `The capacity for transformation through love is completely real, and it keeps needing every relationship to feel dramatic to count as real. That drama isn't depth. It's a transformation still waiting to be found in steady, undramatic companionship too.`,
    },

    // ── 14 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '14_LOVE': {
      heading: `Blending Two Into One`,
      why: `You're genuinely skilled at blending two different lives, temperaments, or even value systems into something that works for both people, without either partner losing themselves in the process. Temperance governing your relationship channel means love for you is expressed through patient integration. Your ideal partner is calm and harmonious in their own right, emotionally balanced, genuinely supportive of healing and the kind of long-term harmony you're building rather than resisting the pace of it. Your relationships tend to feel balanced, considerate, genuinely fair to both sides.`,
      shadow: `The risk is over-moderating the relationship to avoid real friction, smoothing over genuine differences so consistently that neither partner's true needs actually get met directly. Real intimacy sometimes needs tension before it needs balance. If your relationship feels calm but strangely unsatisfying, the blending may be avoiding real contact rather than achieving it.`,
      path: `Let real differences surface and stay long enough to be genuinely worked through, rather than smoothed over immediately. Balance built after real friction is sturdier than balance that avoided it. You are allowed to take the blending slowly and call the slowness devotion. What part of your two lives is ready for its next gentle weave?`,
      positive: `The gift for patient integration hasn't changed — blending two lives without either partner losing themselves was always real skill. What's different is that you now let real differences surface and stay long enough to be genuinely worked through. That friction is what makes the balance sturdy instead of just smooth.`,
      negative: `The patience you bring to blending two lives is completely real, and it keeps smoothing over genuine differences so consistently that real needs never get met directly. That smoothing isn't harmony. It's a balance still waiting for the friction real intimacy requires.`,
    },

    // ── 15 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '15_LOVE': {
      heading: `Chemistry Undeniable`,
      why: `Your romantic connections run on real, undeniable magnetism — physical chemistry, material compatibility, an intensity that's honest about desire rather than polite about it. The Devil governing your relationship channel names exactly this. You're drawn to partners who match that intensity — passionate and sensual, emotionally intense in their own right, genuinely capable of conscious desire without sliding into dependency — and you offer a rare willingness to actually engage with the less "acceptable" parts of intimacy: desire, power, need.`,
      shadow: `The risk is mistaking intensity for genuine compatibility, staying bound to a chemistry-heavy relationship that doesn't actually serve you outside the bedroom. You might also use material or physical control as a substitute for emotional vulnerability. If your relationships feel magnetic but ultimately unfree, the chain may be tighter than the connection requires.`,
      path: `Let the chemistry be honest evidence, not the whole verdict. Ask what the relationship offers outside its intensity. Real freedom here means enjoying the magnetism without needing it to be the only thing holding you there. You are allowed to have the undeniable chemistry and ask for tenderness too. What would this intensity become if it also felt completely safe?`,
      positive: `The gift for undeniable magnetism hasn't changed — real, honest desire, intensity that doesn't apologize for itself, was always genuine. What's different is that you now let the chemistry be honest evidence, not the whole verdict, asking what the relationship offers outside its intensity. That question is what turns magnetism into freedom.`,
      negative: `The chemistry you feel is completely real, and it keeps getting mistaken for the whole compatibility, keeping you bound to a connection that doesn't actually serve you once the intensity is set aside. That binding isn't passion. It's a freedom still waiting to be claimed alongside the magnetism.`,
    },

    // ── 16 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '16_LOVE': {
      heading: `Truth Before Convenience`,
      why: `You sense when something's fundamentally not working well before it would be convenient to admit it, and you're capable of ending things decisively once that clarity fully lands. The Tower governing your relationship channel gives you real, often unwelcome clarity about your relationships. Your ideal partner is honest and emotionally mature in their own right, genuinely able to rebuild after a real crisis, actively supportive during change rather than destabilized by it. This honesty, while disruptive, spares you years spent inside a slowly failing connection.`,
      shadow: `The risk is provoking a relationship's collapse prematurely, out of impatience with the discomfort of uncertainty rather than genuine evidence the connection can't hold. You might also carry a reputation for sudden, dramatic breakups that could have been gentler conversations instead. If your relationships keep ending in upheaval, some of that ending may not have needed to be so abrupt.`,
      path: `Let your clarity inform a deliberate conversation before it becomes a sudden exit. Not every relationship in trouble needs demolition — some genuinely can be rebuilt if you bring the truth to the table instead of just acting on it alone. You are allowed to know the truth early and act on it kindly. What has your clarity already told you that patience keeps overruling?`,
      positive: `The gift for early relational clarity hasn't changed — sensing what's fundamentally not working before it's convenient to admit it was always real perception. What's different is that you now let that clarity inform a deliberate conversation before it becomes a sudden exit. That conversation is what turns disruption into honest repair.`,
      negative: `The clarity you carry about a relationship's truth is completely real, and it keeps acting alone on that clarity instead of bringing it to the table first. That solitary acting isn't decisiveness. It's an ending still waiting to become a conversation instead of an upheaval.`,
    },

    // ── 17 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '17_LOVE': {
      heading: `Hope Over Certainty`,
      why: `You're drawn to partners you can believe in, and you offer a rare, real gift in return: unwavering faith in who they're capable of becoming, offered without needing proof upfront. The Star governing your relationship channel means love for you is deeply tied to genuine hope. Your ideal partner is inspiring and gentle in their own right, genuinely emotionally supportive, hopeful the way you are, someone who actively encourages your dreams and authenticity rather than quietly doubting them. Your relationships often function as a source of renewal for both people, a place where discouragement gets met with real, structural hope rather than empty reassurance.`,
      shadow: `The risk is loving someone's potential more than who they actually, currently are — staying in relationships that keep disappointing the present moment because your hope is pointed at who they could be instead of who they're actually showing up as. If your relationships keep feeling like an act of faith rather than a present-tense connection, the hope may be substituting for honest assessment.`,
      path: `Try letting your hope meet a partner exactly where they currently are, not just where you believe they're headed. Real love here offers renewal to what's actually present, not just to potential. You are allowed to be hoped for the way you hope for others. Who sees a future in you that you haven't dared to see yourself?`,
      positive: `The gift for hoping in a partner hasn't changed — unwavering faith in who they're capable of becoming, offered without proof, was always real. What's different is that you now let your hope meet a partner exactly where they currently are, not just where you believe they're headed. That meeting is what turns hope into presence.`,
      negative: `The hope you bring to love is completely real, and it keeps loving someone's potential more than who they actually, currently are. That aspiration isn't faith. It's a love still waiting to meet the present person instead of the future one.`,
    },

    // ── 18 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '18_LOVE': {
      heading: `Feeling Over Explanation`,
      why: `You sense a connection's truth before you can articulate it, drawn to partners who can meet you in a felt, sometimes wordless understanding. The Moon governing your relationship channel means intimacy for you runs on emotional and intuitive depth. Your ideal partner is emotionally deep and intuitive themselves, genuinely sensitive, someone who feels safe to navigate emotion alongside without either of you needing to fear what surfaces. Your relationships carry real emotional richness, a shared inner world that doesn't always need explaining.`,
      shadow: `The risk is letting unprocessed fear or anxiety color how you read a partner, projecting old wounds onto present behavior and reacting to a story rather than what's actually happening. Jealousy or suspicion can arise from an internal weather system rather than any real evidence. If you keep misreading a partner's intentions, the fog may need more grounding, not more feeling.`,
      path: `Check your emotional read against something concrete — an actual conversation, not just the felt sense. Your intuition about a relationship is genuinely valuable; it just needs occasional reality-testing so it doesn't drift into anxious projection. You are allowed to follow the inexplicable feeling and still keep your feet. What is the feeling actually pointing to, beneath the mystery of it?`,
      positive: `The gift for sensing a connection's truth hasn't changed — felt, sometimes wordless understanding was always real. What's different is that you now check your emotional read against something concrete, an actual conversation. That reality-testing is what lets intuition strengthen the connection instead of drifting into anxious projection.`,
      negative: `The emotional depth you bring to a relationship is completely real, and it keeps letting unprocessed fear color how you read a partner, projecting old wounds onto present behavior. That projection isn't insight. It's an intuition still waiting for grounding, not more feeling.`,
    },

    // ── 19 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '19_LOVE': {
      heading: `Relief Over Performance`,
      why: `You're drawn to partners who can be fully themselves around you, and you offer the same unguarded warmth in return. The Sun governing your relationship channel means love for you is meant to feel genuinely light — real, sustainable relationships for you run on authentic joy and ease rather than struggle or proving yourself. Your ideal partner is warm and joyful in their own right, open-hearted, genuinely positive, someone who actively supports shared happiness and creativity rather than dimming either.`,
      shadow: `The risk is avoiding relationships, or specific hard conversations within one, the moment they stop feeling easy — mistaking necessary friction for incompatibility because your radar is tuned to joy above all else. If you keep leaving relationships the moment things get genuinely difficult, the ease may be masking an avoidance of real depth.`,
      path: `Let a relationship include hard, unglamorous moments without deciding those moments mean it's wrong. Real joy in love can coexist with real effort — the two aren't actually opposites. You are allowed to choose the love that feels like relief without suspecting it. Where has ease been trying to convince you it's real?`,
      positive: `The gift for authentic joy and ease hasn't changed — real, sustainable relationships running on lightness rather than struggle was always what you wanted. What's different is that you now let a relationship include hard, unglamorous moments without deciding those moments mean it's wrong. That inclusion is what lets ease and depth grow together.`,
      negative: `The joy you bring to a relationship is completely real, and it keeps avoiding relationships, or hard conversations within one, the moment they stop feeling easy. That avoidance isn't lightness. It's a depth still waiting for the friction it actually requires.`,
    },

    // ── 20 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '20_LOVE': {
      heading: `Becoming, Together`,
      why: `You're drawn to people who see a fuller version of you than you've fully claimed yet, and you offer that same recognition in return. Judgement governing your relationship channel means your romantic connections tend to function as genuine catalysts — partners who call something larger out of you, relationships that coincide with real periods of personal awakening. Your ideal partner is purpose-driven and emotionally mature in their own right, genuinely spiritually aware, someone who actively supports the growth of your soul rather than just observing it.`,
      shadow: `The risk is staying in a relationship past its natural end because it once served as a catalyst, holding onto the growth it represented rather than the actual connection as it currently is. You might also expect every partner to keep triggering growth, exhausting a relationship that's simply allowed to be steady for a while. If a relationship feels stagnant, the calling may have already moved on.`,
      path: `Let a relationship be honored for the growth it already gave you, even if it's time to let it go. Not every phase of love needs to keep summoning you forward — some of it is allowed to just be restful. You are allowed to become who you're becoming without apologizing to who you were. What is your closest relationship currently calling you toward?`,
      positive: `The gift for catalytic love hasn't changed — connections that call something larger out of you were always real. What's different is that you now honor a relationship for the growth it already gave you, even while letting it go if it's time. That honesty is what lets the calling keep moving instead of getting stuck.`,
      negative: `The growth you seek through relationship is completely real, and it keeps staying in a connection past its natural end because it once served as a catalyst. That staying isn't gratitude. It's a calling still waiting to be released so it can actually move on.`,
    },

    // ── 21 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '21_LOVE': {
      heading: `Expansion Over Containment`,
      why: `You have a real capacity for mature, mutual love, but it thrives specifically when it isn't asked to stay small or contained — a shared life that can genuinely expand, cross borders, absorb new places and people rather than settling into one fixed, narrow shape. The World governing your relationship channel means you're oriented toward real relational expansiveness. Your ideal partner is open-minded and genuinely globally oriented, someone who actively supports growth, freedom, and a shared vision of life bigger than either of you would build alone.`,
      shadow: `The risk is staying in a relationship that's quietly closed the world down — a shared life that's contracted to the smallest, safest version of itself, freedom and expansion traded for a comfortable routine neither of you actually chose on purpose. If your relationship feels stable but has stopped genuinely growing or reaching outward, that containment may be the thing worth naming.`,
      path: `Let the relationship actually expand — a new place, a shared vision genuinely built together, room for both of you to keep growing rather than settling for what's already familiar. Real partnership here is meant to open outward, not just hold steady. You are allowed to love at the scale you were built for. What bigger life is your love waiting for permission to inhabit?`,
      positive: `The gift for relational expansiveness hasn't changed — love that thrives when it isn't asked to stay small was always real. What's different is that you now let the relationship actually expand, a new place, a shared vision genuinely built together. That expansion is what love was built for.`,
      negative: `The expansiveness you carry into love is completely real, and it keeps quietly closing the world down, freedom traded for a comfortable routine neither of you chose on purpose. That contraction isn't stability. It's an expansiveness still sitting unused, still waiting to be named and reopened.`,
    },

    // ── 22 in RELATIONSHIP (Love channel — Ideal Partner / Relationship Harmony) ─
    '22_LOVE': {
      heading: `Faith Over Proof`,
      why: `You carry a genuine, uncommon openness to love — a willingness to step into a real connection without needing certainty about where it'll lead. The Fool governing your relationship channel names exactly this. Your ideal partner is genuinely free-spirited and playful themselves, open to new experiences, trusting rather than guarded, someone who actively supports your authenticity instead of asking you to tame it. You offer partners real freshness: presence without an agenda, trust extended before it's been fully earned, which lets intimacy begin faster and more genuinely than caution usually allows.`,
      shadow: `The risk is repeating the same relational pattern with new people, leaping into connection with the same openness each time but no accumulated wisdom about what's actually worked or not. If your relationships keep starting fresh and ending the same way, the openness may need a partner in genuine reflection.`,
      path: `Let each relationship teach you something concrete you actually carry into the next one. Your openness to love is a real gift — pairing it with real self-knowledge is what turns repeated beginnings into an actual, growing capacity for lasting love. You are allowed to leap into love and learn as you fall. What would you say yes to this month if certainty stopped being the price of entry?`,
      positive: `The gift for falling in love without needing proof hasn't changed — real openness, presence without an agenda, was always genuine. What's different is that you now let each relationship teach you something concrete you actually carry into the next one. That accumulated wisdom is what turns repeated beginnings into a growing capacity for lasting love.`,
      negative: `The openness you bring to new love is completely real, and it keeps repeating the same relational pattern with new people, no accumulated wisdom carried forward. That repetition isn't freshness. It's a capacity for lasting love still waiting for genuine reflection to join the openness.`,
    },

    // ── 17 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '17_MON': {
      heading: `Visibility Pays`,
      why: `Your most abundant income tends to show up exactly when you're operating from genuine visibility — sharing your real gift, letting your actual light be seen in your work — rather than following a strategy borrowed from someone else's idea of a stable career. The Star governs your money channel, tying your financial flow directly to hope and authentic radiance rather than to grinding, joyless effort. This tends to look like work built around being seen at all — blogging or influencing, art and creative work released publicly, media and online projects, a personal brand monetized directly rather than folded into someone else's — money that arrives almost as a byproduct of authenticity, once you actually offer the authenticity instead of rehearsing it in private.`,
      shadow: `The risk is income that stays conditional on approval before it's allowed to flow — a launch you keep delaying until every condition feels perfect, a rate you quietly undercut because charging full price for something so personal feels like too much, a body of work you keep private until it's "ready" in a way that never quite arrives. Because your gift is genuine, withholding it is expensive: a thin, sporadic bank account is often a light that's still being kept low rather than freely offered to a market that would gladly pay for it.`,
      path: `Try treating visibility itself as the transaction — letting your work be seen at the stage it's actually in, rather than the stage you wish it had reached. That's uncomfortable, because it removes the comfort of staying private while you perfect things, and it puts the responsibility on what you're willing to show right now. Start with the smallest real offer: a rate that reflects the actual value of your work, a piece released before it feels fully polished. The financial flow you're waiting to feel ready for is, for you, directly downstream of the visibility you're willing to allow today. You are allowed to be seen at the scale of your actual gift. What work would you show publicly this month if visibility paid what it actually pays?`,
      positive: `Money arrives in rhythm with genuine visibility — the more authentically you let your work be seen at the stage it's actually in, the more consistently and generously it gets paid for.`,
      negative: `Income stays sporadic and undervalued when your light is still being kept low — a launch delayed, a rate undercut, a body of work withheld until conditions that never quite arrive.`,
    },

    // ── 1 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '1_MON': {
      heading: `Building From Nothing`,
      why: `You're not suited to a fixed, pre-built role; your income flows most freely when your profession gives you real room to generate something new rather than maintain something already built. The Magician governs your money channel, meaning your wealth potential is tied directly to work that lets you originate — building something from nothing, launching, creating, initiating. This tends to look like entrepreneurship in its most direct form: founding something yourself, running projects rather than being run by them, selling or speaking on your own initiative, even coaching others in exactly this kind of self-starting.`,
      shadow: `The risk is chasing the excitement of a new venture at the expense of ever letting one mature into steady income — jumping between projects, ideas, or roles before any of them has had time to actually pay off. If your income feels inconsistent despite real talent, the pattern may be starting more than sustaining.`,
      path: `Let your ideal work include at least one long-running thread you don't abandon. The initiating gift is real; pairing it with follow-through is what turns a string of launches into an actual, sustainable livelihood. You are allowed to build from scratch again, even after finished things. What would you start building tomorrow if the blank page were an invitation instead of a test?`,
      positive: `Your income through origination hasn't changed — work that lets you generate something new was always the real fuel. What's different is that you now let your ideal work include at least one long-running thread you don't abandon. That follow-through is what turns launches into a sustainable livelihood.`,
      negative: `Your income through origination is completely real, and it keeps chasing the excitement of a new venture before any one matures. That chasing isn't ambition. It's an income still waiting for one thread to actually be sustained long enough to pay off.`,
    },

    // ── 2 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '2_MON': {
      heading: `Trusting Before Proving`,
      why: `You're suited to roles that trust your read on a situation, even before it's fully explainable. The High Priestess governs your money channel, meaning your ideal profession draws on intuitive, often behind-the-scenes insight — work where your instinct for what's true or what's coming matters more than loud, visible credentials. This tends to look like work built entirely around depth of perception: psychology or therapeutic work, numerology or other intuitive disciplines, research and analysis, advisory or consulting roles, writing and editing — professions that pay you specifically for seeing what's underneath the surface.`,
      shadow: `The risk is undervaluing that intuitive skill precisely because it's hard to quantify, staying in the background so consistently that your actual contribution goes unrecognized and underpaid. If your income doesn't reflect your real insight, the quietness of your gift may be costing you its market value.`,
      path: `Let your intuitive contribution be named and priced, even if it's hard to fully explain in a resume. Your insight is a real professional asset — it just needs to be claimed out loud to actually be compensated. You are allowed to be paid for perception, not just production. Where does your unproven sense keep being right at work — and who needs to know that?`,
      positive: `Your income through intuitive insight hasn't changed — trusting your read on a situation before it's fully explainable was always a real professional asset. What's different is that you now let that contribution be named and priced, even if it's hard to fully explain. That claiming is what finally lets income reflect the real value.`,
      negative: `Your insight is completely real, and it keeps staying undervalued precisely because it's hard to quantify, background work going unrecognized. That quietness isn't humility. It's an income still waiting for the gift to be claimed out loud.`,
    },

    // ── 3 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '3_MON': {
      heading: `Growing Something Real`,
      why: `Your income thrives when your profession lets you actually create — creative fields, caregiving, cultivation of any kind, roles where you get to grow something (a project, a person, a body of work) rather than simply manage an existing system. The Empress governs your money channel, meaning your wealth potential flows through generative, nurturing work. This tends to look like design in any of its forms — graphic, interior, fashion — the beauty industry, content creation, art direction, or a business built around and for women specifically, anywhere beauty and cultivation are the actual product.`,
      shadow: `The risk is undercharging for generative work because it doesn't feel like conventional "labor," or giving so much creative energy away for free that your professional output never converts into real income. If you're prolific but underpaid, the generosity of your gift may need a price tag.`,
      path: `Let your creative or nurturing output be priced at its real value, not discounted because it comes easily to you. Ease of creation doesn't mean it's worth less — it means you're well-suited to it. You are allowed to grow something at its own pace and call that productivity. What have you been cultivating professionally that's closer to harvest than it looks?`,
      positive: `Your income through generative, nurturing work hasn't changed — creating, growing something real, was always the true source. What's different is that you now let your creative output be priced at its real value, not discounted because it comes easily. That pricing is what finally converts prolific output into real income.`,
      negative: `Your creative gift is completely real, and it keeps being undercharged because it doesn't feel like conventional labor. That discounting isn't modesty. It's an income still waiting for a price tag that matches the actual value.`,
    },

    // ── 4 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '4_MON': {
      heading: `Systems Over Roles`,
      why: `You thrive financially when you're given real authority to organize — leadership, management, systems-building, work where your capacity for order and responsibility is actually put to use rather than boxed in by someone else's framework. The Emperor governs your money channel, meaning your wealth potential flows through roles that let you build or govern structure. This tends to look like ownership and executive command directly — running a business, holding a CEO or senior administrative role, leading within government or corporate structure, or building material wealth through something as concrete as real estate development.`,
      shadow: `The risk is staying in a role that under-uses your capacity for structure, following someone else's system so completely that your own gift for building never gets exercised, or applied for financial value. If you feel financially capped despite real capability, the structure you're operating inside may not be yours to shape.`,
      path: `Seek or create roles where you actually get to build the system, not just staff it. Your financial ceiling tends to lift the moment your capacity for structure has somewhere real to go. You are allowed to design the system instead of surviving inside one. What structure would you build if someone finally handed you the blueprint pen?`,
      positive: `Your income through structure hasn't changed — real authority to organize, lead, build was always the true source. What's different is that you now seek or create roles where you actually get to build the system, not just staff it. That authority is what lifts the financial ceiling.`,
      negative: `Your capacity for structure is completely real, and it keeps staying boxed inside someone else's system, your own gift for building never exercised. That boxing isn't stability. It's an income still capped, still waiting for a system that's actually yours to shape.`,
    },

    // ── 5 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '5_MON': {
      heading: `Passing It On`,
      why: `Your income thrives when your profession includes passing something on — teaching, mentoring, or tradition-rooted work, professions where you're transmitting real, earned knowledge to someone else, whether formally (education, training) or informally (mentorship within any field). The Hierophant governs your money channel, meaning your wealth potential flows through exactly this kind of work. This tends to look like teaching and mentorship directly, spiritual guidance or coaching, HR or consulting roles built around developing people, training and lecturing, or a business built specifically around education itself.`,
      shadow: `The risk is staying a perpetual student, accumulating credentials and knowledge without ever stepping into the teaching role that would actually convert it into income. If your expertise feels real but your income doesn't reflect it, the transmission side of the equation may be missing.`,
      path: `Let yourself teach before you feel fully ready. The financial version of your gift activates once knowledge starts moving through you to someone else, not just accumulating in you. You are allowed to teach while you're still learning. What knowledge of yours is ready to be passed on exactly as it is?`,
      positive: `Your income through transmission hasn't changed — passing on real, earned knowledge was always the true source. What's different is that you now let yourself teach before you feel fully ready. That teaching is what activates the financial version of your gift.`,
      negative: `Your expertise is completely real, and it keeps accumulating without ever converting into teaching or mentoring. That accumulation isn't preparation. It's an income still undervalued, still waiting for the transmission side to begin.`,
    },

    // ── 6 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '6_MON': {
      heading: `Work Through People`,
      why: `Your income thrives specifically through people — connecting them, choosing well between them, building the kind of partnership that makes a deal or a relationship actually work. The Lovers governing your money channel means your wealth potential is tied to work built around relationship itself, not simply values in the abstract: relationship coaching, HR or recruiting, sales management, brand partnerships, PR and communications — any profession where reading and choosing well between people is the literal product.`,
      shadow: `The risk is perpetual indecision when a professional choice feels like it involves people or values in conflict, weighing every option so exhaustively that you never commit long enough to actually build income in any one direction. If your career feels stalled at the crossroads, discernment may need to resolve into an actual choice.`,
      path: `Choose a direction built around genuine connection and commit to it fully, even without perfect certainty. Income builds through sustained commitment to a people-centered path, not through endlessly comparing options. You are allowed to make people the work, not the interruption of it. Where does your gift for connection already produce what no process could?`,
      positive: `Your income through connection hasn't changed — reading and choosing well between people was always the real asset. What's different is that you now choose a direction built around genuine connection and commit to it fully, even without perfect certainty. That commitment is what lets income actually build.`,
      negative: `Your gift for connection is completely real, and it keeps weighing every option so exhaustively that you never commit long enough to build income in one direction. That weighing isn't discernment. It's a career still stalled at the crossroads, still waiting for commitment.`,
    },

    // ── 7 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '7_MON': {
      heading: `Driving Your Own Direction`,
      why: `Your income thrives when your career has genuine forward motion you control — a profession where you're visibly moving toward a goal you've set, not just executing someone else's static task list. The Chariot governs your money channel, meaning your wealth potential flows through work with exactly this real, self-directed momentum. This tends to look like logistics or transportation, the sports industry, event management, travel, or operations roles — any field built around literal movement, results, and getting something across a finish line.`,
      shadow: `The risk is staying in a role with no real trajectory, generating internal frustration that shows up as burnout even when the workload itself is manageable — the problem isn't the effort, it's the absence of visible direction. If your income feels stuck despite real effort, the role may lack the momentum this profile actually needs to thrive.`,
      path: `Seek or build a professional path with a visible trajectory you're steering. Your financial growth tracks your sense of forward motion more than it tracks raw hours worked. You are allowed to drive hard toward what's actually yours. What professional destination would justify the full force of your momentum?`,
      positive: `Your income through momentum hasn't changed — genuine forward motion you control was always the true fuel. What's different is that you now seek or build a professional path with a visible trajectory you're steering. That visible direction is what drives income forward, not raw hours.`,
      negative: `Your drive is completely real, and it keeps landing in roles with no real trajectory, generating burnout even when the workload is manageable. That burnout isn't overwork. It's an income still stalled, still waiting for a visible direction to move toward.`,
    },

    // ── 8 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '8_MON': {
      heading: `Honesty as Currency`,
      why: `Your income thrives in roles where integrity is actually rewarded, not just expected — law, mediation, ethics-driven business, any profession where your reputation for honest dealing is itself a professional asset. Justice governs your money channel, meaning your wealth potential flows through work grounded in fairness and accountability. This tends to look like law and legal consulting directly, accounting and auditing, financial analysis, compliance work, or contract management — professions where accuracy and fairness aren't just personal virtues but the literal job.`,
      shadow: `The risk is staying in environments where your honesty goes financially unrewarded, or even punished, while less scrupulous colleagues advance faster. If integrity keeps costing you opportunities, the environment may not be matched to the gift.`,
      path: `Seek out or build professional environments that actually reward fairness, rather than staying somewhere your integrity is merely tolerated. Your financial growth depends on being somewhere honest dealing is genuinely valued. You are allowed to profit from your honesty rather than despite it. Where has being the truthful one already become your quiet competitive edge?`,
      positive: `Your income through integrity hasn't changed — honest dealing as an actual professional asset was always the real strength. What's different is that you now seek out or build environments that actually reward fairness, rather than staying somewhere it's merely tolerated. That environment is what lets integrity translate into income.`,
      negative: `Your honesty is completely real, and it keeps staying in environments where it goes unrewarded, even punished, while less scrupulous colleagues advance. That staying isn't loyalty. It's a fairness still waiting for financial recognition in the right environment.`,
    },

    // ── 9 in MONEY (Wealth Potential / Ideal Profession channel) ───────────
    '9_MON': {
      heading: `Depth Over Range`,
      why: `Your income thrives in roles that let you work with real autonomy, converting solitary mastery into a valuable, sought-after skill — work that rewards how deep you've gone in one specific area rather than how broadly you network or collaborate. The Hermit governs your money channel, meaning your wealth potential flows through exactly this kind of specialized, independent expertise. This tends to look like niche consulting, strategic analysis, therapeutic or healing work, research, or running your own solo practice entirely — professions built to reward depth over reach.`,
      shadow: `The risk is staying so independent that your expertise never gets marketed or made visible enough for anyone to actually pay for it. Deep knowledge, kept private, doesn't automatically convert into income — it has to be offered. If your income doesn't reflect your actual depth, visibility may be the missing piece.`,
      path: `Let your specialized expertise be visibly offered — published, priced, put forward — rather than just quietly possessed. The depth is already valuable; it needs a way to actually reach the people who'd pay for it. You are allowed to go deep alone and surface with something valuable. What mastery are you building in private that the world hasn't priced yet?`,
      positive: `Your income through solitary mastery hasn't changed — deep, specialized expertise built in autonomy was always genuinely valuable. What's different is that you now let it be visibly offered, published, priced, put forward, rather than just quietly possessed. That offering is what converts depth into income.`,
      negative: `Your mastery is completely real, and it keeps staying too private to be marketed, never made visible enough for anyone to pay for it. That privacy isn't discretion. It's an income still waiting for the depth to be offered, not just possessed.`,
    },

    // ── 10 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '10_MON': {
      heading: `Working With Seasons`,
      why: `You thrive financially when your career has room to change shape as circumstances turn, rather than punishing you for needing to pivot — work that can adapt to cycles and shifting conditions rather than professions demanding rigid permanence. The Wheel of Fortune governs your money channel, meaning your wealth potential flows through exactly this kind of career flexibility. This tends to look like marketing work that shifts with trends, trading and investment, business development, the tourism industry, or freelance work spread across multiple projects at once — income built to move with the cycle rather than resist it.`,
      shadow: `The risk is staying locked into a rigid career path out of fear of the instability that change might bring, even once that path has clearly stopped serving you. If your income feels stagnant despite the world around you clearly shifting, the rigidity of the role may be the actual constraint.`,
      path: `Build genuine flexibility into your career — multiple skills, adaptable income streams, willingness to pivot with the cycle rather than against it. Your financial resilience comes from adaptability, not from forcing permanence onto something naturally cyclical. You are allowed to work with your seasons instead of against your calendar. What would your career look like if timing became a tool instead of an obstacle?`,
      positive: `Your income through adaptability hasn't changed — career flexibility, room to shift with circumstances, was always the true source of resilience. What's different is that you now build genuine flexibility, multiple skills, adaptable streams, willingness to pivot with the cycle. That adaptability is what keeps income resilient.`,
      negative: `Your adaptability is completely real, and it keeps staying locked into a rigid career path out of fear of instability. That rigidity isn't safety. It's an income still stagnant, still waiting for the flexibility that was always available to you.`,
    },

    // ── 11 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '11_MON': {
      heading: `Presence as Payment`,
      why: `Your income thrives where your charisma is the actual asset being paid for — not quiet steadiness in the background, but a magnetic, public-facing presence that draws people in and moves them. Strength governs your money channel, meaning your wealth potential flows through work that puts your influence and energy directly on display: coaching or motivating others, building a personal brand around yourself specifically, the fitness and wellness industry, performing or holding public-figure visibility, and leadership roles that depend on presence as much as position.`,
      shadow: `The risk is burning that same energy in rooms and roles that don't actually pay for it, performing charisma for free until the well runs dry, or leaning so hard on presence that the underlying substance never gets built. If you're widely admired but underpaid, the energy may need a more direct professional container.`,
      path: `Let your natural charisma become the explicit center of your professional offer, not just a pleasant side effect of it. Name the influence you carry, and build or seek work that pays for it directly. You are allowed to count your presence as labor. What rooms change when you enter them — and are you being valued for that yet?`,
      positive: `Your income through presence hasn't changed — magnetic, public-facing energy was always the real asset. What's different is that you now let your natural charisma become the explicit center of your professional offer, not just a pleasant side effect. That naming is what finally gets influence compensated.`,
      negative: `Your charisma is completely real, and it keeps getting spent in rooms and roles that don't actually pay for it, performed for free until the well runs dry. That performing isn't generosity. It's an income still waiting for the presence to be counted as labor.`,
    },

    // ── 12 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '12_MON': {
      heading: `Staying Through the Slow`,
      why: `Your income thrives in roles built around patient, sustained service to people in genuine difficulty — not a quick fix, but the willingness to remain present through something slow. The Hanged Man governs your money channel, meaning your wealth potential flows through work like counseling or psychology, medical or caregiving professions, social work, spiritual service, or long-term transformational projects that don't resolve quickly — anywhere depth of presence matters more than speed of result.`,
      shadow: `The risk is staying suspended in the idea of this kind of service without actually committing to the training, credentialing, or sustained practice it demands, treating the calling as a nice thought rather than an actual career. If your income feels stuck in potential, the service needs to become a real professional commitment.`,
      path: `Let the pull toward sustained, patient service resolve into an actual professional path, even a modest first step into it. The depth only pays off once you build real practice around it. You are allowed to do the staying work and let it sustain you too. Whose pain have you stayed with lately — and who stays with yours?`,
      positive: `Your income through sustained service hasn't changed — the willingness to remain present through something slow was always the true offer. What's different is that you now let the pull toward patient service resolve into an actual professional path, even a modest first step. That commitment is what converts calling into income.`,
      negative: `Your capacity for service is completely real, and it keeps staying suspended in the idea of it without ever committing to real training or practice. That suspension isn't humility. It's an income still stuck in potential, still waiting for the actual practice to begin.`,
    },

    // ── 13 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '13_MON': {
      heading: `Old Career, Let Die`,
      why: `You thrive financially in fields or roles that reward genuine change rather than punishing it — real financial growth for you tends to require releasing an outdated career identity or income source so a better-fitting one can take its place. Transformation governs your money channel, meaning your wealth potential flows through exactly this kind of professional reinvention. This tends to look like crisis management, psychotherapy, transformation coaching, medical work centered on renewal (surgery, rehabilitation), or change management directly — professions built entirely around guiding an ending into a genuine new beginning.`,
      shadow: `The risk is clinging to a professional identity that's already run its course, staying in a dying career lane out of fear of the uncertain gap between old and new. If your income feels stuck in decline, something professional may need to be actively released rather than further optimized.`,
      path: `Let a professional ending be deliberate. Identify what's actually complete in your career, and release it on your own terms before it forces the issue. The reinvention happens in the gap you're willing to walk through. You are allowed to bury the old career with honors and walk on. What professional identity has already served its full term?`,
      positive: `Your income through professional reinvention hasn't changed — genuine change, not punishment for it, was always the real reward. What's different is that you now let a professional ending be deliberate, releasing what's complete on your own terms. That release is what makes room for the reinvention.`,
      negative: `Your capacity for reinvention is completely real, and it keeps clinging to a career identity that's already run its course, out of fear of the gap. That clinging isn't loyalty. It's an income still stuck in decline, still waiting for a clean ending.`,
    },

    // ── 14 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '14_MON': {
      heading: `Blending What Others Separate`,
      why: `Your income thrives when you're not forced to specialize narrowly, but allowed to synthesize — combining skills, fields, or roles that other people keep siloed, into one integrated career that plays to your full range. Temperance governs your money channel, meaning your wealth potential flows through exactly this kind of professional blending. This tends to look like holistic healing work, nutrition or wellness coaching, mediation, integrative consulting, or lifestyle consulting — fields that exist specifically at the intersection other professions leave unaddressed.`,
      shadow: `The risk is spreading across so many skills or roles that none of them develops enough depth to actually be paid for at a professional level. Balance can become an excuse to avoid committing seriously to any one thing. If your income feels thin, the blend may need fewer ingredients, held longer.`,
      path: `Let a few of your combined skills go deep enough to actually be marketable, rather than staying broadly competent at everything. Real integration still requires depth in its component parts. You are allowed to be the blend the industry didn't have a title for. Which of your combined skills is actually the product?`,
      positive: `Your income through synthesis hasn't changed — combining fields other people keep siloed was always the real strength. What's different is that you now let a few of your combined skills go deep enough to actually be marketable, instead of staying broadly competent at everything. That depth is what makes income substantial.`,
      negative: `Your versatility is completely real, and it keeps spreading across so many skills that none develops enough depth to be paid for. That spreading isn't balance. It's an income still thin, still waiting for a few ingredients to be held longer.`,
    },

    // ── 15 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '15_MON': {
      heading: `Power Named Honestly`,
      why: `You thrive financially in roles that don't pretend money and leverage aren't real forces — negotiation, finance, sales, any field where understanding what actually drives people materially is the genuine skill being paid for. The Devil governs your money channel, meaning your wealth potential flows through work that engages directly with material power. This tends to look like business and finance broadly, sales and negotiation specifically, the entertainment industry, the luxury market, or work built directly around understanding what compels people materially and psychologically.`,
      shadow: `The risk is using that understanding to grip control over colleagues, clients, or resources rather than to genuinely serve a transaction, eventually costing you trust and reputation. If wealth keeps arriving alongside growing isolation, the leverage may be gripped tighter than the work requires.`,
      path: `Use your honest read on material power in service of genuinely good deals, not just personal control. Real mastery here builds wealth and keeps trust intact at the same time. You are allowed to understand power without being owned by it. What could your honest read of money and influence build if you aimed it somewhere clean?`,
      positive: `Your income through understanding material power hasn't changed — an honest read on what drives people materially was always the real skill. What's different is that you now use that read in service of genuinely good deals, not personal control. That service is what builds wealth while keeping trust intact.`,
      negative: `Your understanding of leverage is completely real, and it keeps being used to grip control over colleagues or resources rather than serve a transaction. That gripping isn't mastery. It's a wealth still arriving alongside isolation, still waiting for the grip to loosen.`,
    },

    // ── 16 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '16_MON': {
      heading: `Seeing the Collapse First`,
      why: `You thrive financially in roles that value sudden, decisive clarity over slow, incremental process — crisis management, innovation, any field that pays for the ability to see a failing structure clearly and reorganize fast. The Tower governs your money channel, meaning your wealth potential flows through exactly this kind of disruption-facing work. This tends to look like engineering or architecture, IT and cybersecurity, crisis and risk management, construction, or roles built around genuinely transforming a system rather than patching it.`,
      shadow: `The risk is generating unnecessary disruption to feel financially useful, provoking crises in stable systems because your gift needs somewhere to apply itself. If your professional life feels chaotic even in calm periods, the disruption may be self-generated rather than genuinely needed.`,
      path: `Save your gift for structures that actually need reorganizing, rather than manufacturing instability elsewhere. Real financial value here comes from precision, not from constant upheaval. You are allowed to say the structure is failing before it's polite. What collapse do you currently see coming that your integrity wants named?`,
      positive: `Your income through disruption-facing clarity hasn't changed — the ability to see a failing structure and reorganize fast was always the real value. What's different is that you now save that gift for structures that actually need reorganizing, rather than manufacturing instability elsewhere. That precision is what makes the work valuable.`,
      negative: `Your clarity is completely real, and it keeps generating unnecessary disruption to feel financially useful, provoking crises in stable systems. That provoking isn't vision. It's a gift still waiting for a structure that genuinely needs it.`,
    },

    // ── 18 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '18_MON': {
      heading: `Instinct Before Certainty`,
      why: `You thrive financially in roles that don't demand you justify every insight with hard data before it's trusted — work that draws on intuitive or emotionally attuned insight, creative fields, therapeutic work, anything where reading an unspoken undercurrent is the actual skill. The Moon governs your money channel, meaning your wealth potential flows through exactly this kind of work. This tends to look like psychology or therapeutic work, filmmaking or other visual art, photography, esoteric practice, or creative healing professions — any field built around what can be sensed before it can be proven.`,
      shadow: `The risk is staying in unstable, ungrounded professional territory because the intuitive gift never gets paired with any concrete structure — inconsistent income, vague offerings, real insight that never becomes a sellable service. If your income feels foggy, the gift may need more grounding, not more mystique.`,
      path: `Pair your intuitive professional gift with something concrete — a clear offering, a defined process, a tangible deliverable. The insight is real; it needs a container to actually be paid for. You are allowed to follow the professional hunch past the explainable. What direction keeps tugging that your resume can't justify yet?`,
      positive: `Your income through intuitive insight hasn't changed — reading an unspoken undercurrent, sensing before proving, was always the real skill. What's different is that you now pair that gift with something concrete, a clear offering, a defined process. That container is what finally lets insight convert into income.`,
      negative: `Your intuitive gift is completely real, and it keeps staying in unstable, ungrounded territory, never paired with any concrete structure. That fogginess isn't mystique. It's an income still unmonetized, still waiting for grounding instead of more mystery.`,
    },

    // ── 19 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '19_MON': {
      heading: `Work That Feels Like You`,
      why: `You thrive financially in professions where your natural personality is actually the asset, not something to suppress for professionalism's sake — work that genuinely feels like you, authentic, visible, offered without the heaviness of grinding through something that doesn't fit. The Sun governs your money channel, meaning your wealth potential flows most easily through exactly this kind of work. This tends to look like public speaking, teaching children specifically, the entertainment industry, creative leadership roles, or a personal brand business built around simply being visibly, genuinely yourself.`,
      shadow: `The risk is undervaluing work that comes easily and joyfully, assuming real professional value requires more struggle than you're actually experiencing. If you're underpaid for work that lights you up, the ease may be masking its own worth.`,
      path: `Let joy and price coexist. Work that feels easy to you can still be genuinely valuable — the ease of your gift doesn't lower what it's worth to someone else. You are allowed to earn from work that feels like being yourself. Where does your labor still require a costume?`,
      positive: `Your income through authenticity hasn't changed — work that genuinely feels like you, visible and unforced, was always the real asset. What's different is that you now let joy and price coexist, pricing the work honestly instead of discounting it for feeling easy. That honesty is what makes the ease sustainable income.`,
      negative: `Your natural fit for the work is completely real, and it keeps being undervalued, assumed to be worth less because it doesn't feel like struggle. That assumption isn't humility. It's an income still underpriced, still waiting for ease to be counted as real value.`,
    },

    // ── 20 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '20_MON': {
      heading: `The Calling, Not the Comfortable`,
      why: `You thrive financially once you actually answer a genuine vocational calling rather than settling for merely adequate — a career that keeps summoning you, growing harder to ignore, even if the practical version of it feels riskier than staying put. Judgement governs your money channel, meaning your wealth potential flows most freely through exactly this kind of work. This tends to look like coaching or mentoring, public service, work on social projects, speaking on subjects that genuinely matter, or transformational education — professions that function less like a job and more like an answer.`,
      shadow: `The risk is hearing the calling and spending years preparing to answer it, staying in the adequate-but-outgrown role while endlessly upskilling instead of actually making the leap. If your income has stagnated despite real effort, the effort may be going into preparation rather than the actual move.`,
      path: `Answer the professional call before you feel fully ready. Financial growth tends to arrive in the moving, not the endless preparing. You are allowed to answer the calling that keeps calling. What work do you keep returning to in your mind — and what is one real step toward it?`,
      positive: `Your income through vocational calling hasn't changed — a career that keeps summoning you, growing harder to ignore, was always real. What's different is that you now answer the professional call before you feel fully ready, instead of endlessly upskilling. That answering is what lets financial growth arrive.`,
      negative: `Your calling is completely real, and it keeps being met with years of preparation instead of an actual leap, staying in the adequate-but-outgrown role. That preparing isn't diligence. It's an income still stagnant, still waiting for the actual move.`,
    },

    // ── 21 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '21_MON': {
      heading: `Beyond One System`,
      why: `You thrive financially once your work is allowed to cross borders rather than stay contained inside one local system — real wealth potential for you tends to open up specifically through global reach, not through going deeper into one fixed place. The World governs your money channel, meaning your career grows through international business and global trade, online platforms and digital ecosystems that don't respect borders, cross-border projects, travel, tourism or relocation services, or work embedded in genuinely large systems and networks rather than a single local one.`,
      shadow: `The risk is staying confined to a local or narrowly-scoped version of your field long after your actual capacity has outgrown it, mistaking a comfortable boundary for a necessary one. If your income feels capped despite real skill, the ceiling may simply be geographic or systemic rather than personal.`,
      path: `Let one part of your work deliberately cross a border — a client, a platform, a market — rather than assuming your reach has to stay local. Your financial growth tends to track how far your work is actually allowed to travel. You are allowed to work at the size of the whole map. What border — literal or invented — is your work ready to cross?`,
      positive: `Your income through global reach hasn't changed — wealth potential opening through crossing borders, not staying contained locally, was always the real pattern. What's different is that you now let one part of your work deliberately cross a border, a client, a platform, a market. That crossing is what lets income grow past its old ceiling.`,
      negative: `Your capacity for global-scale work is completely real, and it keeps staying confined to a narrow, local version of the field. That confinement isn't caution. It's an income still capped, still waiting for the border it's actually ready to cross.`,
    },

    // ── 22 in MONEY (Wealth Potential / Ideal Profession channel) ──────────
    '22_MON': {
      heading: `Starting Without Guarantee`,
      why: `You thrive financially in careers or ventures that reward genuine courage, letting you access opportunities that people requiring more proof simply never reach — a willingness to start a new venture, role, or path without needing certainty first. The Fool governs your money channel, meaning your wealth potential flows through exactly this kind of professional risk-taking. This tends to look like freelancing, creative entrepreneurship, working as a digital nomad, joining or building genuine startups and experimental projects, or any non-standard profession that didn't exist as a fixed category before you found it.`,
      shadow: `The risk is repeating the same fresh professional start without absorbing what the last one taught you, leaping into new ventures with the same openness every time but no accumulating wisdom underneath it. If your career keeps resetting instead of building, the openness may need a partner in discernment.`,
      path: `Let each professional leap teach you something concrete you actually carry into the next one. The courage to start fresh is real — pairing it with genuine reflection is what turns repeated starts into accumulating expertise and income. You are allowed to begin before the guarantee arrives. What venture would you open this year if faith counted as capital?`,
      positive: `Your income through professional courage hasn't changed — the willingness to start without certainty was always the real edge. What's different is that you now let each professional leap teach you something concrete you actually carry into the next one. That reflection is what turns repeated starts into accumulating expertise.`,
      negative: `Your courage to start is completely real, and it keeps repeating the same fresh professional start without absorbing what the last one taught you. That repeating isn't boldness. It's a career still resetting, still waiting for the openness to be paired with discernment.`,
    },

    // ── 13 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '13_F': {
      title: `13 in Paternal Spiritual — Transformation`,
      tagline: `A Design of Reworked Inheritance`,
      mastery: `You take the belief system inherited from your father's line and actually transform it into something that fits who you became, instead of receiving it intact.`,
      shadow: `You either swallow the inheritance whole or reject it entirely — both ways of avoiding the actual work of sorting what's genuinely yours.`,
      invitation: `Name one specific belief from your father's line today, and decide honestly whether it's actually yours.`,
    },

    // ── 1 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '1_F': {
      title: `1 in Paternal Spiritual — The Magician`,
      tagline: `A Design of Active Faith`,
      mastery: `You treat faith as active — proven through initiative and real spiritual agency, not passive acceptance.`,
      shadow: `You inherit the compulsion without the discernment, believing spiritual worth must be constantly proven through visible effort.`,
      invitation: `Let your faith rest today instead of working. Do nothing spiritually and call it enough.`,
    },

    // ── 2 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '2_F': {
      title: `2 in Paternal Spiritual — The High Priestess`,
      tagline: `A Design of Spoken Intuition`,
      mastery: `You carry real intuitive capacity — inner knowing that doesn't need to be proven to be trusted.`,
      shadow: `You inherit the silence along with the sensitivity, downplaying your own knowing around authority figures.`,
      invitation: `Say your intuitive sense out loud today, in a context where you'd normally stay quiet.`,
    },

    // ── 3 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '3_F': {
      title: `3 in Paternal Spiritual — The Empress`,
      tagline: `A Design of Unearned Ease`,
      mastery: `You carry real capacity for spiritual abundance and ease.`,
      shadow: `You inherit the belief that spiritual peace has to be earned through struggle, making genuine ease feel suspicious.`,
      invitation: `Let one spiritual ease be legitimate today, with no struggle attached to earn it.`,
    },

    // ── 4 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '4_F': {
      title: `4 in Paternal Spiritual — The Emperor`,
      tagline: `A Design of Chosen Structure`,
      mastery: `You carry real respect for spiritual structure — something worth building and defending.`,
      shadow: `You either submit entirely to inherited spiritual authority or reject all structure reflexively, never landing anywhere of your own.`,
      invitation: `Name one piece of spiritual structure today that's actually yours, chosen, not inherited or reacted against.`,
    },

    // ── 5 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '5_F': {
      title: `5 in Paternal Spiritual — The Hierophant`,
      tagline: `A Design of Examined Doctrine`,
      mastery: `You carry real, concrete spiritual teaching — an actual doctrine you can examine and use.`,
      shadow: `You treat the doctrine as non-negotiable simply because it arrived so formally packaged, afraid that questioning it means betrayal.`,
      invitation: `Examine one specific piece of inherited doctrine today, on its own merits, not its packaging.`,
    },

    // ── 6 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '6_F': {
      title: `6 in Paternal Spiritual — The Lovers`,
      tagline: `A Design of Chosen Devotion`,
      mastery: `You carry real capacity for spiritual devotion and commitment.`,
      shadow: `You stay loyal to an inherited spiritual path out of obligation, not genuine, examined alignment.`,
      invitation: `Choose one spiritual commitment today consciously, instead of assuming the inherited one.`,
    },

    // ── 7 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '7_F': {
      title: `7 in Paternal Spiritual — The Chariot`,
      tagline: `A Design of Earned Stillness`,
      mastery: `You carry genuine spiritual discipline and forward motion.`,
      shadow: `You inherit the drive without questioning it, feeling guilty resting or going still in your spiritual life.`,
      invitation: `Let your spiritual practice include real stillness today, with no guilt attached.`,
    },

    // ── 8 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '8_F': {
      title: `8 in Paternal Spiritual — Justice`,
      tagline: `A Design of the Honest Ledger`,
      mastery: `You carry a real sense of spiritual integrity and fairness.`,
      shadow: `You inherit a harsh standard of spiritual accountability, feeling constantly "in debt" spiritually.`,
      invitation: `Examine one spiritual debt you've been repaying today, and ask honestly if it's actually owed.`,
    },

    // ── 9 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ───────────
    '9_F': {
      title: `9 in Paternal Spiritual — The Hermit`,
      tagline: `A Design of Shared Insight`,
      mastery: `You carry real capacity for deep, solitary spiritual reflection.`,
      shadow: `You inherit the isolation along with the depth, keeping your deepest spiritual questions to yourself by default.`,
      invitation: `Share one piece of solitary spiritual insight with someone today.`,
    },

    // ── 10 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ──────────
    '10_F': {
      title: `10 in Paternal Spiritual — The Wheel of Fortune`,
      tagline: `A Design of Reclaimed Say`,
      mastery: `You carry a real relationship to spiritual timing and cycles.`,
      shadow: `You inherit either fatalism or over-control around fate, without ever testing which one actually fits you.`,
      invitation: `Claim one piece of say in your own fate today that your inherited belief said you didn't have.`,
    },

    // ── 11 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '11_F': {
      title: `11 in Paternal Spiritual — Strength`,
      tagline: `A Design of Visible Strain`,
      mastery: `You carry real spiritual resilience and endurance.`,
      shadow: `You inherit the belief that struggle should stay hidden, making your own spiritual crises feel shameful to admit.`,
      invitation: `Let one real spiritual struggle be visible to someone you trust today.`,
    },

    // ── 12 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '12_F': {
      title: `12 in Paternal Spiritual — The Hanged Man`,
      tagline: `A Design of the Honest Yes`,
      mastery: `You carry real capacity for spiritual surrender and release.`,
      shadow: `You inherit martyrdom instead of genuine surrender, feeling obligated to suffer for your faith to count.`,
      invitation: `Examine one spiritual sacrifice today and ask honestly if it was ever actually asked for.`,
    },

    // ── 14 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '14_F': {
      title: `14 in Paternal Spiritual — Temperance`,
      tagline: `A Design of Earned Balance`,
      mastery: `You carry real capacity for balanced spiritual integration.`,
      shadow: `You inherit neutrality without genuine integration, staying so moderate that real intensity never shows up at all.`,
      invitation: `Let one real spiritual intensity in today, fully, before you moderate it.`,
    },

    // ── 15 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '15_F': {
      title: `15 in Paternal Spiritual — The Devil`,
      tagline: `A Design of Held Desire`,
      mastery: `You carry real spiritual depth alongside real desire — capable of holding both.`,
      shadow: `You inherit shame around desire, feeling spiritual guilt around ordinary human wants.`,
      invitation: `Let one desire and one devotion sit in the same hands today, without treating them as enemies.`,
    },

    // ── 16 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '16_F': {
      title: `16 in Paternal Spiritual — The Tower`,
      tagline: `A Design of the Named Collapse`,
      mastery: `You carry real capacity for spiritual clarity, even through rupture.`,
      shadow: `You inherit an unprocessed collapse — a vague, hard-to-place distrust of spiritual structures whose source predates you.`,
      invitation: `Name today, even speculatively, what collapsed in your father's line's faith, and what clarity should have followed.`,
    },

    // ── 17 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '17_F': {
      title: `17 in Paternal Spiritual — The Star`,
      tagline: `A Design of Full-Sized Hope`,
      mastery: `You carry real capacity for spiritual renewal and hope.`,
      shadow: `You inherit a caution against hoping too visibly, hedging every spiritual hope with a disclaimer.`,
      invitation: `Let one spiritual hope be fully, visibly held today, with no hedge attached.`,
    },

    // ── 18 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '18_F': {
      title: `18 in Paternal Spiritual — The Moon`,
      tagline: `A Design of the Named Fear`,
      mastery: `You carry real spiritual sensitivity and depth.`,
      shadow: `You inherit a diffuse, unnamed spiritual dread that doesn't attach to anything specific in your own life.`,
      invitation: `Trace one spiritual anxiety back today, even speculatively, and give it an actual name.`,
    },

    // ── 19 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '19_F': {
      title: `19 in Paternal Spiritual — The Sun`,
      tagline: `A Design of Legitimate Joy`,
      mastery: `You carry real capacity for radiant, joyful faith.`,
      shadow: `You inherit the belief that seriousness is what makes faith legitimate, muting your own genuine spiritual joy.`,
      invitation: `Let one moment of spiritual joy be fully legitimate today, with no gravity required to justify it.`,
    },

    // ── 20 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '20_F': {
      title: `20 in Paternal Spiritual — Judgement`,
      tagline: `A Design of the Answered Pull`,
      mastery: `You carry real capacity to answer a larger spiritual calling.`,
      shadow: `You inherit the postponement itself, sensing a summons and setting it aside the way your line always did.`,
      invitation: `Answer one spiritual pull today, your own way, instead of postponing it again.`,
    },

    // ── 21 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '21_F': {
      title: `21 in Paternal Spiritual — The World`,
      tagline: `A Design of the Closed Cycle`,
      mastery: `You carry real capacity for genuine spiritual wholeness and completion.`,
      shadow: `You inherit near-completion — stopping just short of real spiritual wholeness, echoing a pattern that predates your choices.`,
      invitation: `Let one spiritual cycle actually complete today instead of stopping just short of it.`,
    },

    // ── 22 in PATERNAL SPIRITUAL (Ancestral Square, Age-10 anchor) ─────────
    '22_F': {
      title: `22 in Paternal Spiritual — The Fool`,
      tagline: `A Design of the Untested Leap`,
      mastery: `You carry real capacity for spiritual openness and trust in the unknown.`,
      shadow: `You inherit caution around anything unproven, staying within familiar, approved spiritual territory out of a hesitation that isn't yours.`,
      invitation: `Take one small, genuine spiritual leap today that your inherited caution would have avoided.`,
    },

    // ── 9 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '9_G': {
      title: `9 in Maternal Spiritual — The Hermit`,
      tagline: `A Design of the Spoken Depth`,
      mastery: `You carry real, inherited depth — the capacity to sit with the unanswerable, modeled through your mother's line's quiet.`,
      shadow: `You inherit the assumption that deep things aren't discussed, staying entirely private with wisdom that could actually help someone.`,
      invitation: `Speak one piece of your inward wisdom out loud today, to someone who could use it.`,
    },

    // ── 1 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '1_G': {
      title: `1 in Maternal Spiritual — The Magician`,
      tagline: `A Design of the Named Capability`,
      mastery: `You carry real spiritual capability, modeled through quiet confidence rather than explanation.`,
      shadow: `The capability stays instinctual because it was never given language — you sense your own agency but struggle to claim it.`,
      invitation: `Name your own capability out loud today, instead of just quietly demonstrating it.`,
    },

    // ── 2 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '2_G': {
      title: `2 in Maternal Spiritual — The High Priestess`,
      tagline: `A Design of Tested Trust`,
      mastery: `You carry real, embodied trust in your inner sense of things.`,
      shadow: `That certainty was never taught to self-correct, so you can hold a wrong intuition as unquestionable.`,
      invitation: `Test one intuition against the world today instead of assuming it's automatically right.`,
    },

    // ── 3 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '3_G': {
      title: `3 in Maternal Spiritual — The Empress`,
      tagline: `A Design of the Named Warmth`,
      mastery: `You carry real, warm spiritual generativity — a presence that nurtures without needing to explain itself.`,
      shadow: `The warmth stays purely atmospheric because it was never put into words, so you can't offer it deliberately.`,
      invitation: `Put words to the spiritual warmth you carry today, and offer it to one specific person on purpose.`,
    },

    // ── 4 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '4_G': {
      title: `4 in Maternal Spiritual — The Emperor`,
      tagline: `A Design of Visible Authority`,
      mastery: `You carry real spiritual steadiness and order, held quietly rather than announced.`,
      shadow: `The quietness goes so far your own authority never gets recognized, including by you.`,
      invitation: `Let your quiet spiritual authority be visible today, even if it feels like breaking a pattern.`,
    },

    // ── 5 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '5_G': {
      title: `5 in Maternal Spiritual — The Hierophant`,
      tagline: `A Design of Credited Wisdom`,
      mastery: `You carry real wisdom, absorbed through relationship and lived example rather than formal teaching.`,
      shadow: `You dismiss that wisdom as "just how she was," undervaluing it because it never arrived with formal credibility.`,
      invitation: `Name one piece of relational wisdom today as real knowledge, worth passing on deliberately.`,
    },

    // ── 6 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '6_G': {
      title: `6 in Maternal Spiritual — The Lovers`,
      tagline: `A Design of Examined Values`,
      mastery: `You carry real values, demonstrated through the choices your mother's line actually made.`,
      shadow: `You repeat the same relational choices automatically, without ever examining whether they're genuinely yours.`,
      invitation: `Name one value you actually watched get modeled today, and consciously decide if you're keeping it.`,
    },

    // ── 7 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '7_G': {
      title: `7 in Maternal Spiritual — The Chariot`,
      tagline: `A Design of Chosen Direction`,
      mastery: `You carry real, quiet, sustained spiritual will — determination without drama.`,
      shadow: `You push forward without questioning whether the direction was actually chosen or just the only path modeled.`,
      invitation: `Pause today and ask whether your current spiritual direction is genuinely yours.`,
    },

    // ── 8 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ───────────
    '8_G': {
      title: `8 in Maternal Spiritual — Justice`,
      tagline: `A Design of the Updated Standard`,
      mastery: `You carry a real, felt sense of right and wrong, absorbed by watching consistent action.`,
      shadow: `You apply that inherited standard rigidly, even in situations it wasn't actually built for.`,
      invitation: `Check one inherited standard of fairness today against your own actual circumstances.`,
    },

    // ── 10 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ──────────
    '10_G': {
      title: `10 in Maternal Spiritual — The Wheel of Fortune`,
      tagline: `A Design of Active Trust`,
      mastery: `You carry real, quiet trust that hard seasons pass — cyclical resilience modeled without drama.`,
      shadow: `That patience arrives without its complementary agency — you endure passively instead of actively navigating.`,
      invitation: `Take one active step today in a hard season you've just been waiting out.`,
    },

    // ── 11 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '11_G': {
      title: `11 in Maternal Spiritual — Strength`,
      tagline: `A Design of Named Softness`,
      mastery: `You carry real gentle endurance — strength that never needed to look fierce to be real.`,
      shadow: `You mistake your own quiet resilience for weakness because it doesn't look like conventional toughness.`,
      invitation: `Name your gentle endurance as real strength today, out loud, even just to yourself.`,
    },

    // ── 12 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '12_G': {
      title: `12 in Maternal Spiritual — The Hanged Man`,
      tagline: `A Design of the Resolved Wait`,
      mastery: `You carry real comfort with not having answers yet — receptive patience that lets understanding arrive in its own time.`,
      shadow: `That waiting never resolves into action — you can stay suspended indefinitely with no modeled return.`,
      invitation: `Give one piece of your patience a deliberate endpoint today — choose to act.`,
    },

    // ── 13 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '13_G': {
      title: `13 in Maternal Spiritual — Transformation`,
      tagline: `A Design of Chosen Reinvention`,
      mastery: `You carry real capacity for quiet reinvention — becoming who you need to become.`,
      shadow: `That change only happens reactively, under pressure, instead of through your own conscious choice.`,
      invitation: `Initiate one change deliberately today, instead of waiting for pressure to force it.`,
    },

    // ── 14 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '14_G': {
      title: `14 in Maternal Spiritual — Temperance`,
      tagline: `A Design of the Named Contradiction`,
      mastery: `You carry real ease holding contradictions — duty and desire, strength and softness, without treating them as crisis.`,
      shadow: `That ease can mean calmly holding a contradiction that's actually causing harm, avoiding real tension that needs addressing.`,
      invitation: `Name one contradiction today that actually needs resolving, not just patient holding.`,
    },

    // ── 15 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '15_G': {
      title: `15 in Maternal Spiritual — The Devil`,
      tagline: `A Design of Reclaimed Wanting`,
      mastery: `You carry real desire and material want, worth naming plainly.`,
      shadow: `You inherit an unspoken restraint that makes wanting openly feel inappropriate, so your desires stay hidden even from yourself.`,
      invitation: `Name one genuine want out loud today, plainly, with no hedge attached.`,
    },

    // ── 16 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '16_G': {
      title: `16 in Maternal Spiritual — The Tower`,
      tagline: `A Design of the Told Story`,
      mastery: `You carry real capacity for clarity, even through past rupture.`,
      shadow: `You carry a diffuse unease around instability whose actual story was never told.`,
      invitation: `Ask today, even just of yourself, what happened in your mother's line that was never spoken about.`,
    },

    // ── 17 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '17_G': {
      title: `17 in Maternal Spiritual — The Star`,
      tagline: `A Design of Unhedged Hope`,
      mastery: `You carry real optimism and hope.`,
      shadow: `You inherit a caution against hoping too visibly, hedging every hope with a disclaimer.`,
      invitation: `Let one hope be fully, visibly held today, with no hedge.`,
    },

    // ── 18 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '18_G': {
      title: `18 in Maternal Spiritual — The Moon`,
      tagline: `A Design of Sorted Feeling`,
      mastery: `You carry a rich, deep inner and intuitive life.`,
      shadow: `You carry unprocessed emotional atmosphere that was never named, feelings that may not actually be yours.`,
      invitation: `Sort one feeling today — decide honestly whether it's actually yours or something you absorbed.`,
    },

    // ── 19 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '19_G': {
      title: `19 in Maternal Spiritual — The Sun`,
      tagline: `A Design of Generated Warmth`,
      mastery: `You carry real vitality and joy, radiating simply through how you show up.`,
      shadow: `You stand in the glow of that warmth without becoming a source of it yourself, treating joy as received, not generated.`,
      invitation: `Let your own warmth be a source for someone today, not just a reflection of what you received.`,
    },

    // ── 20 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '20_G': {
      title: `20 in Maternal Spiritual — Judgement`,
      tagline: `A Design of the Named Pull`,
      mastery: `You carry a real, felt pull toward something larger than your current circumstances.`,
      shadow: `That pull stays wordless — you sense a bigger calling without ever naming or moving toward it.`,
      invitation: `Name your calling as specifically as you can today, even if it feels presumptuous.`,
    },

    // ── 21 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '21_G': {
      title: `21 in Maternal Spiritual — The World`,
      tagline: `A Design of Claimed Enoughness`,
      mastery: `You carry a real, settled sense of being enough, modeled through simply living rather than declared.`,
      shadow: `You wait for that wholeness to simply arrive instead of actively claiming it in your own circumstances.`,
      invitation: `Actively name your own sense of "enough" today, instead of waiting for it to arrive.`,
    },

    // ── 22 in MATERNAL SPIRITUAL (Ancestral Square, Age-30 anchor) ─────────
    '22_G': {
      title: `22 in Maternal Spiritual — The Fool`,
      tagline: `A Design of the Grieved Restart`,
      mastery: `You carry real resilience through fresh starts — the sense that beginning again is simply possible.`,
      shadow: `You inherit the willingness to restart without ever grieving what each fresh start actually cost.`,
      invitation: `Let yourself grieve one thing a past fresh start required leaving behind, today.`,
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
      heading: `Steering Without Asking for Help`,
      why: `The practical, material navigation skill passed down through your mother's line was one of directed forward motion under difficult conditions — women who kept moving, kept the household or the finances or the family's practical survival on a chosen course, often without the luxury of stopping to ask whether the direction was actually sustainable. The Chariot sits in your Maternal Material corner, a real inheritance of resourcefulness and determination. What often comes bundled with it is an equally inherited belief that the only way to keep the material vehicle moving is to drive it entirely alone.`,
      shadow: `This can show up as a material life organized around solo endurance — inherited specifically from the maternal line's survival strategy, the assumption that asking for help, sharing the load, or admitting the current direction isn't working would be a kind of failure the women before you didn't allow themselves either. You might notice chronic overextension around money and logistics, a reflexive refusal of support even when it's genuinely offered, an exhausting sense that everything practical depends on you continuing to steer alone. A financial or logistical life that feels perpetually solo, even when people are actually available to help, is often this maternal navigation pattern still running on old terrain.`,
      path: `Try steering the vehicle your mother's line handed you while actually letting other hands touch the reins. This isn't a rejection of the pattern — you keep the real skill of directed, resourceful movement, but you update the belief that it requires total solitude. Practically: let one material task — a bill, a decision, a piece of the load — be shared instead of solely carried, and notice that the vehicle keeps moving anyway. The maternal line's resourcefulness was real. The solo-driving belief was circumstance, not law, and you're free to update it. You are allowed to ask for a hand and keep the wheel. What are you steering alone right now that was never designed for one driver?`,
      positive: `The real material resourcefulness and directed determination hasn't changed — what's different is that you now let other hands actually touch the reins. You keep the real skill of directed, resourceful movement, but you've updated the belief that it requires total solitude. One material task, a bill, a decision, a piece of the load, gets shared instead of solely carried, and the vehicle keeps moving anyway, because it was never actually designed for one driver.`,
      negative: `The real material resourcefulness and directed determination inherited through your mother's line is completely genuine, and it arrived bundled with a belief that the only way to keep the material vehicle moving is to drive it entirely alone. A financial or logistical life that feels perpetually solo, even when people are actually available to help, is often this maternal navigation pattern still running on old terrain, not evidence help isn't actually available.`,
    },

    // ── 1 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '1_I': {
      heading: `Real From Very Little`,
      why: `Women in your mother's line likely made real, tangible things happen with whatever was actually available, not waiting for ideal conditions. The Magician sits in your Maternal Material corner, marking this generational transmission of resourceful improvisation. You inherited this as embodied capability: a felt sense that you can generate material results from modest means, modeled through action rather than explanation.`,
      shadow: `The trap is inheriting the improvisation without permission to ever want more resources — a habit of making do so consistently that asking for adequate support feels like admitting failure. If you catch yourself stretching too thin rather than requesting what's actually needed, that's often inherited resourcefulness without its complementary permission to want enough.`,
      path: `Try asking for adequate resources before you're forced to improvise. The gift for making something from little is real — it doesn't have to mean refusing more when more is genuinely available. You are allowed to make from abundance too, not only from scraps. What could your resourcefulness build if it finally had full materials?`,
      positive: `The real capability for resourceful improvisation hasn't changed — what's different is that you now ask for adequate resources before you're forced to improvise. The gift for making something from little stays real; it just doesn't have to mean refusing more when more is genuinely available. What your resourcefulness could build with full materials finally gets to be built, instead of always being stretched from scraps.`,
      negative: `The real capability for resourceful improvisation, inherited from women who made things happen with whatever was actually available, is completely genuine, and it arrived without permission to ever want more resources — making do so consistently that asking for adequate support feels like admitting failure. Stretching too thin rather than requesting what's actually needed is often inherited resourcefulness without its complementary permission to want enough.`,
    },

    // ── 2 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '2_I': {
      heading: `Instinct Ahead of Numbers`,
      why: `Women in your mother's line likely managed household or material affairs through a felt sense of what was needed, often ahead of any obvious sign. The High Priestess sits in your Maternal Material corner, marking this generational transmission of intuitive practical management. You inherited this as embodied instinct: practical foresight transmitted through watching, not being taught explicitly.`,
      shadow: `The trap is inheriting the instinct without ever voicing it, managing material matters quietly and alone because that's the model you watched, even when sharing the load or the reasoning would genuinely help. If people are surprised by decisions that felt obvious to you, that's often an inherited habit of silent practical management.`,
      path: `Try voicing your practical instinct before acting on it sometimes, letting people in on the reasoning rather than just the result. This doesn't diminish the gift — it makes it something others can actually learn from and support. You are allowed to trust the practical instinct and let the numbers catch up. Where has that inherited gut-sense already saved you recently?`,
      positive: `The intuitive practical management hasn't changed — what's different is that you now voice your practical instinct before acting on it sometimes, letting people in on the reasoning rather than just the result. This doesn't diminish the gift; it makes it something others can actually learn from and support. The inherited gut-sense that's already saved you finally gets to be shared, instead of leaving people surprised by decisions that felt obvious only to you.`,
      negative: `The intuitive practical management inherited through your mother's line, felt ahead of any obvious sign, is completely real, and it's staying entirely silent — managed quietly and alone because that's the model watched, even when sharing the reasoning would genuinely help. People being surprised by decisions that felt obvious to you is often an inherited habit of silent practical management, not evidence your instincts are unclear.`,
    },

    // ── 3 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '3_I': {
      heading: `Everyone Fed and Held`,
      why: `Women in your mother's line likely made sure practical needs were met for everyone around them, often quietly and without acknowledgment, as an unquestioned part of daily life. The Empress sits in your Maternal Material corner, marking this generational transmission of material nurturing. You inherited this as embodied duty: material care transmitted through consistent action.`,
      shadow: `The trap is inheriting the duty without ever examining whether it's sustainable, providing for others' practical needs so automatically that your own go unnoticed even by you. If you're depleted from material caretaking that no one asked you to take on, that's often an inherited pattern of automatic provision.`,
      path: `Try letting your own material needs be as visible and tended-to as everyone else's. The gift for practical nurturing is real — it holds up better when it includes you. You are allowed to be fed and held too, not just to make sure of it. Who checks whether you've eaten, rested, been carried lately?`,
      positive: `The material nurturing hasn't changed — what's different is that your own material needs are now as visible and tended-to as everyone else's. The gift for practical nurturing is real, and it holds up better now that it includes you. Someone finally checks whether you've eaten, rested, been carried lately, because you've finally let yourself be part of the caretaking instead of only ever its source.`,
      negative: `The material nurturing inherited through your mother's line, making sure practical needs were met for everyone around them, is completely real, and the duty arrived without ever being examined for sustainability — providing for others' practical needs so automatically that your own go unnoticed even by you. Depletion from material caretaking no one asked you to take on is often an inherited pattern of automatic provision, not evidence you're actually incapable of receiving care too.`,
    },

    // ── 4 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '4_I': {
      heading: `Keeping Things Organized, Unasked`,
      why: `Women in your mother's line likely held the practical organization of the household or family's material life together, a real authority exercised without formal recognition. The Emperor sits in your Maternal Material corner, marking this generational transmission of quiet material structure. You inherited this as embodied responsibility: structural competence transmitted through simply watching someone keep things running.`,
      shadow: `The trap is inheriting the responsibility without the recognition — carrying real material organizational weight that goes unacknowledged, including by you, because it was never framed as leadership. If you're doing significant practical management that no one, including you, credits as real authority, that's often an inherited pattern of invisible structural labor.`,
      path: `Try naming your material organizational role as the real authority it actually is, out loud, to yourself first. Invisible competence is still competence — it deserves to be seen. You are allowed to resign from the unasked-for job sometimes. What would happen if the organizing waited for you to be actually willing?`,
      positive: `The material organizational structure hasn't changed — what's different is that you now name your role as the real authority it actually is, out loud, to yourself first. Invisible competence is still competence, and it finally gets to be seen as such. What would happen if the organizing waited for you to be actually willing finally gets tested, because the job stops being something you carry silently by default.`,
      negative: `The material organizational structure inherited through your mother's line, real authority exercised without formal recognition, is completely genuine, and the responsibility arrived without the recognition attached — carrying real organizational weight that goes unacknowledged, including by you, because it was never framed as leadership. Doing significant practical management that no one credits as real authority is often an inherited pattern of invisible structural labor, not evidence the labor itself isn't real.`,
    },

    // ── 5 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '5_I': {
      heading: `Skills Never Formally Taught`,
      why: `Women in your mother's line likely passed down real, useful material skills through doing rather than teaching: how to stretch a budget, fix something, manage a household, absorbed by watching rather than instruction. The Hierophant sits in your Maternal Material corner, marking this generational transmission of informal practical wisdom. You inherited this as embedded competence: practical knowledge transmitted through proximity.`,
      shadow: `The trap is undervaluing skills that arrived this informally, treating them as "just common sense" rather than the real, valuable competence they actually are. If you dismiss your own practical capability because no one ever certified it, that's often an inherited pattern of undervaluing informally-transmitted skill.`,
      path: `Try naming your practical skills as real expertise, worth the same respect as anything formally credentialed. What you absorbed by watching is still genuine knowledge. You are allowed to own the skills nobody formally certified. What untaught competence of yours deserves to be named as expertise?`,
      positive: `The practical skills absorbed by proximity hasn't changed — what's different is that you now name them as real expertise, worth the same respect as anything formally credentialed. What you absorbed by watching is still genuine knowledge, and the untaught competence that deserved to be named as expertise finally gets called exactly that, instead of dismissed as common sense.`,
      negative: `The practical skills absorbed by proximity, real and useful competence passed down through doing rather than teaching, are completely genuine, and they're being undervalued as merely "common sense" rather than the real competence they actually are. Dismissing your own practical capability because no one ever certified it is often an inherited pattern of undervaluing informally-transmitted skill, not an accurate measure of the skill's actual worth.`,
    },

    // ── 6 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '6_I': {
      heading: `What Matters When Limited`,
      why: `Women in your mother's line likely made real, values-based choices about where limited resources actually went, demonstrating priorities through allocation rather than declaration. The Lovers sit in your Maternal Material corner, marking this generational transmission of values-driven material priority. You inherited this by watching: a felt sense of what genuinely matters materially, transmitted through observed choice.`,
      shadow: `The trap is inheriting the priorities without ever examining whether they're actually yours, defaulting to the same material allocations because that's the pattern you watched, not because you've consciously chosen it. If your spending or resource choices feel automatic rather than examined, that's often inherited priority standing in for your own.`,
      path: `Try naming the material priorities you actually watched get modeled, and consciously deciding which ones you're keeping for yourself. You are allowed to keep the clarity about what matters even when resources aren't limited. What essential thing does your inheritance help you see that abundance tends to blur?`,
      positive: `The values-driven material priority hasn't changed — what's different is that you've named the specific priorities you watched get modeled and consciously kept the ones that are actually yours. Real clarity about what matters is still there; it's just chosen now, not simply repeated. The essential thing your inheritance helps you see, the one abundance tends to blur, finally gets protected on purpose, not by accident.`,
      negative: `The values-driven material priority, inherited by watching real choices about where limited resources actually went, is completely genuine, and it's running unexamined — defaulting to the same material allocations because that's the pattern watched, not because it's been consciously chosen. Spending or resource choices that feel automatic rather than examined are often inherited priority standing in for your own, not evidence you lack values of your own.`,
    },

    // ── 8 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '8_I': {
      heading: `A Careful Sense of Fairness`,
      why: `Women in your mother's line likely managed limited resources with a real, consistent sense of equitable distribution, making sure everyone got their genuine share even when there wasn't much to go around. Justice sits in your Maternal Material corner, marking this generational transmission of careful material fairness. You inherited this as embodied conviction: a felt commitment to material fairness, transmitted through consistent practice.`,
      shadow: `The trap is applying that careful fairness so rigidly to your own life that you undercount your own genuine needs, always making sure others get their share first even when resources genuinely allow for your own. If you consistently shortchange yourself in the name of fairness, that's often an inherited pattern that needs to include you too.`,
      path: `Try applying your genuine sense of material fairness to yourself as consistently as you apply it to others. You're included in the equation, not just its administrator. You are allowed to include yourself in the fair share. When the careful dividing is done — what portion have you been leaving off your own plate?`,
      positive: `The careful material fairness hasn't changed — what's different is that you now include yourself in the equation you administer so faithfully for everyone else. The commitment to equitable distribution is real, and it finally gets applied to you too. The portion you've been leaving off your own plate, out of habit, finally gets served, without anyone else's share shrinking to make room for it.`,
      negative: `The careful material fairness inherited through your mother's line, making sure everyone got their genuine share even when there wasn't much to go around, is completely real, and it's applied so rigidly that you exclude yourself from it — always making sure others get their share first, even when resources genuinely allow for your own. Consistently shortchanging yourself in the name of fairness is often an inherited pattern that forgot to include its own author.`,
    },

    // ── 9 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ────────────
    '9_I': {
      heading: `Competence, Handled Alone`,
      why: `Women in your mother's line likely developed real, practical self-sufficiency, quietly handling material needs without much outside support because that was simply the reality they navigated. The Hermit sits in your Maternal Material corner, marking this generational transmission of self-reliant material competence. You inherited this as embodied capability: genuine practical independence, transmitted through demonstrated necessity.`,
      shadow: `The trap is inheriting the self-reliance as a permanent requirement rather than a circumstance-driven skill, refusing material help even when your actual circumstances no longer demand total independence. If you feel unable to accept practical support that's genuinely available, that's often an inherited necessity outliving its original conditions.`,
      path: `Try accepting practical material help when it's genuinely available, recognizing that the self-reliance was a real skill built by circumstance, not a permanent law about how material life has to go. You are allowed to be competent and accompanied. What material task could you let someone witness, or even share, this week?`,
      positive: `The real practical self-sufficiency hasn't changed — what's different is that you now accept material help when it's genuinely available, recognizing the self-reliance was a skill built by circumstance, not a permanent law. Competence and accompaniment coexist fine. One material task this week finally gets witnessed, maybe even shared, and the independence stays intact precisely because it's no longer defended past the point it's needed.`,
      negative: `The real practical self-sufficiency inherited through your mother's line, quietly handling material needs without much outside support because that was simply the reality navigated, is completely genuine, and it's being maintained as a permanent requirement rather than a circumstance-driven skill — refusing material help even when your actual circumstances no longer demand total independence. Feeling unable to accept genuinely available support is often an inherited necessity outliving the conditions that created it.`,
    },

    // ── 10 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '10_I': {
      heading: `Enduring the Ups and Downs`,
      why: `Women in your mother's line likely weathered real financial or practical instability without being undone by it, adapting to each turn as it came. The Wheel of Fortune sits in your Maternal Material corner, marking this generational transmission of material resilience. You inherited this as embodied adaptability: a felt capacity to navigate material change, transmitted through watching someone actually survive it.`,
      shadow: `The trap is inheriting the adaptability without ever expecting genuine material stability, staying braced for the next downturn even during periods of real security. If you can't relax into material good fortune when it's genuinely present, that's often inherited vigilance outliving its necessity.`,
      path: `Try letting yourself actually trust a period of material stability while it's happening, rather than staying braced for its end. The adaptability is a real skill — it doesn't require constant anticipation of collapse to stay sharp. You are allowed to expect good stretches, not just endure hard ones. What upswing might you be bracing against instead of receiving?`,
      positive: `The real material resilience hasn't changed — what's different is that you now let yourself actually trust a period of stability while it's happening, rather than staying braced for its end. The adaptability stays a genuine skill; it just doesn't require constant anticipation of collapse to stay sharp. The upswing you'd normally brace against instead of receiving finally gets to be received, fully, for as long as it lasts.`,
      negative: `The real material resilience inherited through your mother's line, weathering financial or practical instability without being undone by it, is completely genuine, and it arrived without an off switch — staying braced for the next downturn even during periods of real security. Being unable to relax into material good fortune when it's genuinely present is often inherited vigilance that's outlived its necessity, not an accurate read of your current risk.`,
    },

    // ── 11 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '11_I': {
      heading: `Soft Yet Never Broken`,
      why: `Women in your mother's line likely held real financial or practical hardship with a soft, embodied steadiness rather than hardened toughness, modeling resilience that never needed to look fierce. Strength sits in your Maternal Material corner, marking this generational transmission of gentle material endurance. You inherited this as felt permission: the sense that gentleness and material endurance aren't opposites.`,
      shadow: `The trap is inheriting the softness without recognizing its actual strength, mistaking your own gentle material resilience for fragility because it doesn't look like conventional toughness. If people underestimate your capacity to handle real material pressure, that's often maternal strength that was never named as strength.`,
      path: `Try naming your gentle material endurance as the real strength it is. It doesn't need to look hard to be genuinely unbreakable. You are allowed to stay soft — the strain already proved it doesn't break you. Where is your gentleness quietly outlasting circumstances that were supposed to harden you?`,
      positive: `The gentle material endurance hasn't changed — what's different is that you now name it as the real strength it actually is, out loud, so it stops being mistaken for fragility. It doesn't need to look hard to be genuinely unbreakable. The strain that already proved it doesn't break you finally gets witnessed as evidence of strength, not overlooked as evidence of softness.`,
      negative: `The gentle material endurance inherited through your mother's line, holding real financial or practical hardship with soft, embodied steadiness rather than hardened toughness, is completely genuine, and it's going unrecognized as strength — mistaken for fragility because it doesn't look like conventional toughness. People underestimating your capacity to handle real material pressure is often maternal strength that was simply never named as strength, not an accurate read of your actual capacity.`,
    },

    // ── 12 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '12_I': {
      heading: `Patience for Slow Change`,
      why: `Women in your mother's line likely endured real practical constraint with a kind of suspended waiting, trusting that circumstances would eventually shift even without a clear timeline. The Hanged Man sits in your Maternal Material corner, marking this generational transmission of material patience. You inherited this as embodied endurance: patience with material limitation, transmitted through watching someone wait it out.`,
      shadow: `The trap is inheriting the waiting without ever questioning whether action might actually be available now that wasn't available then — staying suspended in material limitation out of inherited habit rather than genuine current necessity. If your material circumstances feel stuck despite new options being available, the patience may have outlived its usefulness.`,
      path: `Try checking whether your current material situation actually still requires the waiting, or whether it's inherited habit. Circumstances change; the patience should be able to update with them. You are allowed to nudge the slow circumstances instead of only waiting them out. What patient situation of yours might respond to one small push?`,
      positive: `The real material patience hasn't changed — what's different is that you've checked whether your current situation actually still requires the waiting, or whether it's simply inherited habit. Circumstances change, and the patience finally gets to update with them. The one small push a stuck situation was actually ready for finally gets tried, instead of being outwaited indefinitely.`,
      negative: `The real material patience inherited through your mother's line, enduring practical constraint through suspended waiting, trusting circumstances would eventually shift, is completely genuine, and it's running past its usefulness — staying suspended in material limitation out of inherited habit rather than genuine current necessity. Feeling stuck despite new options being available is often patience that's outlived the situation it was built for, not evidence action still isn't possible.`,
    },

    // ── 13 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '13_I': {
      heading: `Rebuilding From Almost Nothing`,
      why: `Women in your mother's line likely faced genuine material loss and found a way to reconstruct a practical life afterward, more than once if necessary. Transformation sits in your Maternal Material corner, marking this generational transmission of material rebuilding. You inherited this as embodied resilience: real capacity for material reinvention, transmitted through watching someone actually survive and rebuild.`,
      shadow: `The trap is inheriting the capacity for rebuilding without ever questioning why loss keeps happening in the first place, treating repeated material collapse as simply normal rather than something worth actively preventing. If your material life keeps requiring rebuilding rather than sustaining, that pattern deserves direct attention, not just more resilience.`,
      path: `Try applying some of your real rebuilding capacity toward prevention instead — securing what you've built, not just trusting your ability to reconstruct it later. Both skills matter. You are allowed to rebuild without waiting for the ruin. What could you renovate now, while things still stand?`,
      positive: `The real capacity for material rebuilding hasn't changed — what's different is that you now apply some of it toward prevention too, securing what you've built instead of only ever trusting your ability to reconstruct it later. Both skills matter, and the thing you could renovate now, while it still stands, finally gets renovated, instead of waiting for the ruin that would justify rebuilding.`,
      negative: `The real capacity for material rebuilding, inherited from facing genuine material loss and finding a way to reconstruct a practical life afterward, more than once if necessary, is completely genuine, and it arrived without ever questioning why the loss kept happening — treating repeated material collapse as simply normal rather than something worth actively preventing. A material life that keeps requiring rebuilding rather than sustaining deserves direct attention to its cause, not just more resilience in its aftermath.`,
    },

    // ── 14 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '14_I': {
      heading: `Stretching What's Limited`,
      why: `Women in your mother's line likely developed real skill at making limited material resources cover genuine needs, blending and stretching with patient, practical ingenuity. Temperance sits in your Maternal Material corner, marking this generational transmission of resourceful balance. You inherited this as embodied competence: material balance transmitted through watching someone actually make it work.`,
      shadow: `The trap is inheriting the stretching as a permanent necessity rather than a skill to be used when actually needed, staying in scarcity-mode financial habits even once your actual resources have genuinely grown. If you're still stretching resources that don't need stretching anymore, that pattern may need updating.`,
      path: `Try letting your actual current resources inform your material habits, rather than defaulting to inherited scarcity mode regardless of your real circumstances now. You are allowed to have enough that nothing needs stretching. What would you do with margin — actual, unstretched margin?`,
      positive: `The real skill for stretching limited resources hasn't changed — what's different is that you now let your actual current resources inform your habits, instead of defaulting to inherited scarcity mode regardless of your real circumstances. What you'd do with genuine, unstretched margin finally gets tried, because the skill stays available for when it's actually needed, rather than running constantly out of old reflex.`,
      negative: `The real skill for stretching limited resources, inherited from making limited material resources cover genuine needs with patient, practical ingenuity, is completely genuine, and it's running as permanent necessity rather than situational skill — staying in scarcity-mode financial habits even once your actual resources have genuinely grown. Still stretching resources that don't need stretching anymore is often an inherited habit outliving the scarcity that created it, not an accurate read of your present means.`,
    },

    // ── 15 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '15_I': {
      heading: `A Complicated Dependence`,
      why: `Women in your mother's line likely navigated real dependence, whether financial reliance on someone else or being relied upon in ways that felt binding, without much room to fully examine the dynamic. The Devil sits in your Maternal Material corner, marking this generational transmission of material entanglement. You inherited this as felt familiarity: a real, complicated relationship to material dependence, whichever direction it ran.`,
      shadow: `The trap is repeating the inherited dynamic without examining it — either accepting material dependence you'd rather not have, or resisting genuinely helpful interdependence out of an inherited wariness. If your material relationships keep echoing an old bind, that pattern deserves direct examination.`,
      path: `Try naming the specific material dependence dynamic you inherited, and consciously deciding what healthy interdependence would actually look like for you now. You are allowed to depend and remain whole. What support could you accept this season without it costing your self-respect?`,
      positive: `The real, complicated relationship to material dependence hasn't disappeared — what's different is that you've named the specific dynamic you inherited and consciously decided what healthy interdependence would actually look like for you now. The support you could accept this season, without it costing your self-respect, finally gets accepted, because the dynamic in play was chosen, not simply repeated on autopilot.`,
      negative: `The real, complicated relationship to material dependence, inherited from navigating financial reliance or being relied upon in ways that felt binding, without much room to fully examine the dynamic, is completely genuine, and it's repeating without examination — either accepting material dependence you'd rather not have, or resisting genuinely helpful interdependence out of inherited wariness. Material relationships that keep echoing an old bind need direct examination, not automatic repetition of the pattern.`,
    },

    // ── 16 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '16_I': {
      heading: `A Loss Survived, Undiscussed`,
      why: `Women in your mother's line likely survived a real financial or practical collapse that reshaped their circumstances, its story passed down as atmosphere rather than narrative. The Tower sits in your Maternal Material corner, marking this generational transmission of unprocessed material rupture. You inherited this as unnamed residue: real material resilience tangled with an inherited, unspoken upheaval.`,
      shadow: `The trap is inheriting the aftershock without the story — carrying disproportionate anxiety around material stability that doesn't match your own current situation. If sudden financial change triggers outsized dread, that's often an inherited rupture still circling without its story fully told.`,
      path: `Try asking, even speculatively, what material collapse might have happened in your mother's line that was never fully discussed. Naming what you can helps the inheritance finally settle. You are allowed to speak about the loss that was only survived. What might your money worries lose their grip on once the old story is finally told?`,
      positive: `The real material resilience hasn't changed — what's different is that you've asked, even speculatively, what collapse might have happened in your mother's line that was never fully discussed, and let naming what you can help the inheritance finally settle. The money worry that might lose its grip once the old story is finally told finally gets to loosen, because the aftershock has a story attached to it now, not just atmosphere.`,
      negative: `The real material resilience inherited through your mother's line, surviving a financial or practical collapse that reshaped their circumstances, its story passed down as atmosphere rather than narrative, is completely genuine, and it arrived without the story attached — carrying disproportionate anxiety around material stability that doesn't match your own current situation. Sudden financial change triggering outsized dread is often an inherited rupture still circling without its story fully told, not an accurate read of your present risk.`,
    },

    // ── 17 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '17_I': {
      heading: `A Modest Hope for Better`,
      why: `Women in your mother's line likely held real hope for practical improvement, expressed modestly rather than boldly, perhaps to protect against disappointment during genuinely hard circumstances. The Star sits in your Maternal Material corner, marking this generational transmission of guarded material hope. You inherited this as felt aspiration: material renewal transmitted alongside an inherited caution about hoping too visibly.`,
      shadow: `The trap is inheriting the modesty without questioning whether your own material hopes need to stay that small. If you catch yourself pre-emptively scaling down real material aspirations, that's often an inherited caution rather than an accurate read of what's actually possible for you.`,
      path: `Try letting a material hope be fully-sized, tested against your actual current circumstances rather than automatically scaled down. What was modest out of necessity for her may not need to be modest for you. You are allowed to hope at a size she couldn't afford. What better-than-modest future would you name out loud if hope were free?`,
      positive: `The real capacity for material hope hasn't changed — what's different is that you now let one hope be fully-sized and tested against your actual current circumstances, rather than automatically scaled down out of inherited caution. What was modest out of necessity for her doesn't have to be modest for you, and the better-than-modest future you'd name if hope were free finally gets named, at its real size.`,
      negative: `The real capacity for material hope, inherited from expressing practical improvement modestly rather than boldly, perhaps to protect against disappointment during genuinely hard circumstances, is completely genuine, and the modesty arrived without question — pre-emptively scaling down real material aspirations regardless of what's actually possible for you now. Catching yourself shrinking a hope before it's even tested is often inherited caution standing in, not an accurate read of your current odds.`,
    },

    // ── 18 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '18_I': {
      heading: `Worry Felt, Never Explained`,
      why: `Women in your mother's line likely carried real financial or practical worry that was felt intensely but rarely discussed directly, transmitted as atmosphere rather than explanation. The Moon sits in your Maternal Material corner, marking this generational transmission of unprocessed material anxiety. You inherited this as felt inheritance: material sensitivity tangled with an inherited, unnamed unease.`,
      shadow: `The trap is inheriting the worry without its actual cause, carrying diffuse material anxiety that doesn't clearly attach to your own current circumstances. If financial unease surfaces disproportionately to your real situation, that's often inherited worry still circling.`,
      path: `Try distinguishing your own material concerns from what you may have simply absorbed. Naming what's genuinely yours versus what was present around you growing up is real, valuable work. You are allowed to translate the felt worry into words and check it. What is the inherited unease actually about — and does your present life still match it?`,
      positive: `The material sensitivity hasn't changed — what's different is that you've done the real work of distinguishing your own material concerns from what you simply absorbed growing up. Naming what the inherited unease is actually about, and checking it against your present life, is valuable work, and the financial worry that surfaces now finally corresponds to something real and current, rather than circling from an unnamed source.`,
      negative: `The material sensitivity inherited through your mother's line, carrying real financial or practical worry that was felt intensely but rarely discussed directly, transmitted as atmosphere rather than explanation, is completely genuine, and it arrived without its actual cause attached — diffuse material anxiety that doesn't clearly attach to your own current circumstances. Financial unease surfacing disproportionately to your real situation is often inherited worry still circling, not an accurate signal about your present finances.`,
    },

    // ── 19 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '19_I': {
      heading: `Warmth Through Hardship`,
      why: `Women in your mother's line likely maintained real vitality and joy even through genuine material difficulty, modeling that hardship doesn't have to extinguish lightness. The Sun sits in your Maternal Material corner, marking this generational transmission of resilient warmth. You inherited this as felt permission: the sense that material struggle and real joy can coexist.`,
      shadow: `The trap is inheriting the warmth as a requirement to perform positivity even when material circumstances genuinely call for more direct acknowledgment of difficulty. If you find yourself staying determinedly upbeat about real financial strain instead of addressing it directly, that's often inherited warmth being used to mask rather than coexist with hardship.`,
      path: `Try letting your material difficulty be named directly sometimes, without the inherited requirement to stay visibly warm through it. Real resilience includes honest acknowledgment, not just maintained brightness. You are allowed to trust that your warmth survives hardship — it already has for generations. Who needs that intact warmth from you right now?`,
      positive: `The resilient warmth hasn't changed — what's different is that you now let material difficulty be named directly sometimes, without the inherited requirement to stay visibly warm through it. Real resilience includes honest acknowledgment as well as maintained brightness, and the person who needs your intact warmth right now finally gets both the truth of the hardship and the warmth that's survived generations of it.`,
      negative: `The resilient warmth inherited through your mother's line, maintaining real vitality and joy even through genuine material difficulty, is completely genuine, and it's being used as a requirement to perform positivity even when circumstances genuinely call for more direct acknowledgment — staying determinedly upbeat about real financial strain instead of addressing it directly. Warmth that masks hardship rather than coexisting with it is often an inherited performance, not evidence the difficulty isn't real.`,
    },

    // ── 20 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '20_I': {
      heading: `Potential Circumstances Never Allowed`,
      why: `Women in your mother's line likely sensed real practical or financial possibility that circumstances (time, resources, permission) never actually allowed them to pursue fully. Judgement sits in your Maternal Material corner, marking this generational transmission of unclaimed material potential. You inherited this as felt momentum: material capability passed down alongside its own historical postponement.`,
      shadow: `The trap is inheriting the postponement itself — sensing your own material potential and, without examining why, holding back the same way, as though delay were simply the pattern. If you keep almost-pursuing a material opportunity that circumstances would actually now support, that's often unfinished maternal work.`,
      path: `Try claiming the material potential your circumstances actually do allow, even if hers didn't. You're not obligated to repeat a postponement that was originally about circumstance, not capability. You are allowed to pursue what her circumstances forbade. What material possibility would live twice if you lived it — once for you, once for her?`,
      positive: `The real material potential hasn't changed — what's different is that you now claim it under circumstances that actually allow it, even if hers never did. You're not obligated to repeat a postponement that was originally about circumstance, not capability, and the material possibility that would live twice, once for you, once for her, finally gets pursued instead of sensed and set aside again.`,
      negative: `The real material potential inherited through your mother's line, sensing genuine practical or financial possibility that circumstances never actually allowed her to pursue fully, is completely genuine, and the postponement got inherited right alongside it — sensing your own potential and, without examining why, holding back the same way, as though delay were simply the pattern. Almost-pursuing an opportunity that current circumstances would actually now support is often unfinished maternal work, not evidence the potential isn't real.`,
    },

    // ── 21 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '21_I': {
      heading: `Enough, Quietly Sensed`,
      why: `Women in your mother's line likely found a real, settled sense of having enough, even within genuine practical constraint, modeling contentment as something achievable rather than dependent on abundance. The World sits in your Maternal Material corner, marking this generational transmission of material sufficiency. You inherited this as felt permission: material wholeness that doesn't require excess to be real.`,
      shadow: `The trap is inheriting the sufficiency as resignation rather than genuine contentment — settling for less than what's actually available now because "enough" was calibrated to circumstances that no longer apply. If you're satisfied with material conditions that could genuinely improve, that calibration may need updating.`,
      path: `Try checking whether your sense of "enough" reflects genuine contentment or an inherited ceiling that no longer fits your actual circumstances. Real sufficiency should be able to grow with genuine opportunity. You are allowed to feel the enoughness now, not after the next milestone. What do you already have that, honestly counted, is enough?`,
      positive: `The material sufficiency hasn't changed — what's different is that you've checked whether your sense of "enough" reflects genuine contentment or an inherited ceiling that no longer fits your actual circumstances, and let it grow accordingly. Real sufficiency can expand with genuine opportunity without losing its wholeness, and what you already have, honestly counted, finally gets to feel like enough right now, not after the next milestone.`,
      negative: `The material sufficiency inherited through your mother's line, a real, settled sense of having enough even within genuine practical constraint, is completely genuine, and it's calibrated to circumstances that may no longer apply — settling for less than what's actually available now because "enough" was set by a different generation's limits. Being satisfied with material conditions that could genuinely improve is often an inherited ceiling mistaken for contentment, not an accurate measure of what's possible.`,
    },

    // ── 22 in MATERNAL MATERIAL (Ancestral Square, Age-70 anchor) ───────────
    '22_I': {
      heading: `A Risk Taken When It Mattered`,
      why: `Women in your mother's line likely took genuine practical chances when circumstances demanded it, moving somewhere new, trying something unproven, trusting that a fresh material start was survivable. The Fool sits in your Maternal Material corner, marking this generational transmission of material risk-taking. You inherited this as embodied courage: real material openness, transmitted through watching someone actually leap.`,
      shadow: `The trap is inheriting the courage without its accompanying discernment, taking material risks reactively the way circumstance once forced, rather than choosing them deliberately from a place of actual stability. If your material risks feel driven by old urgency rather than current, considered choice, that pattern is worth examining.`,
      path: `Try taking your next material risk from genuine choice rather than inherited urgency. The courage is real — pairing it with deliberate timing is what makes it work for you now. You are allowed to take the practical risk when it matters — it's a family skill. What is the mattering moment in front of you right now?`,
      positive: `The real material courage hasn't changed — what's different is that you now take the next risk from genuine, deliberate choice rather than inherited urgency, pairing the courage with considered timing that makes it actually work for you. The mattering moment in front of you finally gets met on your own terms, and the family skill of taking a practical risk when it matters gets exercised by choice, not by old necessity.`,
      negative: `The real material courage inherited through your mother's line, taking genuine practical chances when circumstances demanded it, trusting a fresh material start was survivable, is completely genuine, and it's missing its discernment — taking material risks reactively, the way circumstance once forced, rather than choosing them deliberately from a place of actual stability. Risks that feel driven by old urgency rather than current, considered choice are worth examining before they're taken, not proof the courage itself is misplaced.`,
    },

    // ── 1 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '1_MK': {
      heading: `Starting Over, Not Building`,
      why: `Something in your relationship to material security carries an old, unresolved pattern of initiation without follow-through — a new plan, a fresh financial start, a different approach, each one arriving with real energy. The Magician sits in your Material Karma, meaning your unresolved material task centers specifically on origination: you're genuinely gifted at starting something from nothing, but the security that comes from letting one thing compound over time hasn't yet been claimed.`,
      shadow: `The risk is mistaking the next fresh start for progress, when what's actually needed is staying with the one already in motion. If your financial position keeps resetting to zero right before it would have compounded into something real, that's this pattern still unresolved.`,
      path: `This may shift by choosing the material plan already underway and deliberately not starting a new one until this one has had real time to mature. You are allowed to build on what's already there instead of clearing the ground again. What existing foundation deserves your next brick more than a fresh start does?`,
      positive: `The unresolved karmic pull toward fresh starts hasn't changed — genuine gift for origination was always real. What's different is that you now choose the material plan already underway and deliberately don't start a new one until it's had real time to mature. That staying is what finally lets compounding happen.`,
      negative: `The karmic pattern of initiation without follow-through is completely real, and it keeps resetting your material position right before it would have compounded. That resetting isn't fresh energy. It's a security still waiting to be built on, not cleared and started over.`,
    },

    // ── 2 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '2_MK': {
      heading: `Numbers Kept Quiet`,
      why: `Something in your relationship to material security carries an old pattern of concealment — a preference for not looking too closely, not saying the real numbers out loud, keeping your actual financial state private even from people close to you. The High Priestess sits in your Material Karma, meaning your unresolved material task centers on bringing hidden financial reality into the light rather than continuing to sense it privately.`,
      shadow: `The risk is that what stays unexamined stays unmanaged — material security built on a foundation you've never actually looked at directly. If you can sense your financial position more than you can state it plainly, that avoidance may be the pattern still active.`,
      path: `This may shift by writing down your actual financial numbers once, in full, and letting them be seen — by yourself first, and then by one trusted other person. You are allowed to look at the full picture without it becoming a verdict. What single number could you gently look at this week that you've been avoiding?`,
      positive: `The karmic pattern of concealment hasn't changed — the preference for not looking too closely was always the old comfort. What's different is that you now write down your actual financial numbers once, in full, and let them be seen. That seeing is what finally lets security be built on a real foundation.`,
      negative: `The pattern of hidden financial reality is completely real, and it keeps staying unexamined even by you. That hiddenness isn't privacy. It's a security still built on a foundation that's never actually been looked at.`,
    },

    // ── 3 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '3_MK': {
      heading: `Giving Over Keeping`,
      why: `Something in your relationship to material security carries an old pattern of giving that outpaces keeping — real warmth expressed through material generosity, resources shared freely, comfort extended to others before it's secured for yourself. The Empress sits in your Material Karma, meaning your unresolved material task centers on letting your own reserve grow alongside what you give.`,
      shadow: `The risk is that generosity, unchecked, becomes its own form of depletion — a pattern of material abundance flowing outward while your own foundation stays thin. If you're generous with others while quietly under-resourced yourself, that imbalance is the unresolved piece.`,
      path: `This may shift by setting aside a portion of any material gain for your own security first, before it gets extended to anyone else. You are allowed to cushion yourself with the same generosity you extend. What would giving to your own future self look like this month?`,
      positive: `The karmic pattern of giving that outpaces keeping hasn't changed — real warmth expressed through material generosity was always genuine. What's different is that you now set aside a portion of any material gain for your own security first. That setting-aside is what finally lets your own reserve grow too.`,
      negative: `The pattern of generosity outpacing your own security is completely real, and it keeps flowing outward while your own foundation stays thin. That thinness isn't generosity's fault. It's a reserve still waiting to be included in the abundance you already create.`,
    },

    // ── 4 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '4_MK': {
      heading: `Control Over Trust`,
      why: `Something in your relationship to material security carries an old pattern of control — structure, oversight, and a firm hand over every financial detail, as though security depends entirely on your direct management of it. The Emperor sits in your Material Karma, meaning your unresolved material task centers on finding out whether real security can exist without total personal control over every part of it.`,
      shadow: `The risk is that the control itself becomes exhausting to maintain, and delegating or trusting a system you didn't build yourself feels like real danger rather than a reasonable option. If you can't imagine your material security holding without your constant oversight, that's the pattern still active.`,
      path: `This may shift by handing one specific piece of financial management to a trusted system or person, and observing whether the structure holds without your constant hand on it. You are allowed to loosen the grip without losing the money. What small financial delegation could prove the holding doesn't all depend on your hands?`,
      positive: `The karmic pattern of tight control hasn't changed — a firm hand over every financial detail was always the old strategy for safety. What's different is that you now hand one specific piece of financial management to a trusted system or person and observe whether it holds. That test is what finally proves security beyond your own grip.`,
      negative: `The pattern of controlling every detail is completely real, and it keeps making delegation feel like danger rather than a reasonable option. That danger-framing isn't prudence. It's a security still fragile, still waiting to be trusted without your constant hand on it.`,
    },

    // ── 5 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '5_MK': {
      heading: `Inherited Rules, Still Running`,
      why: `Something in your relationship to material security carries an old pattern of deference to inherited financial rules — beliefs about money passed down from family, tradition, or authority, followed carefully even when they no longer fit your actual circumstances. The Hierophant sits in your Material Karma, meaning your unresolved material task centers on testing those inherited rules against your own direct experience.`,
      shadow: `The risk is following an outdated financial rule simply because it's familiar, even when it's quietly working against your actual security. If a "should" about money keeps overriding what your own numbers are telling you, that's the pattern still unresolved.`,
      path: `This may shift by naming one inherited belief about money directly and testing it against your current, actual circumstances rather than assuming it still applies. You are allowed to retire the old money rules that no longer describe your life. Which inherited 'should' about money would you strike from the record first?`,
      positive: `The karmic deference to inherited financial rules hasn't changed — beliefs passed down through family or tradition were always followed carefully. What's different is that you now name one inherited belief directly and test it against your current, actual circumstances. That testing is what finally lets guidance serve your real security.`,
      negative: `The pattern of deferring to old financial rules is completely real, and it keeps overriding what your actual numbers are telling you. That overriding isn't respect for tradition. It's a security still governed by a should that's never been examined.`,
    },

    // ── 6 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '6_MK': {
      heading: `Peace Over Decision`,
      why: `Something in your relationship to material security carries an old pattern of indecision at real financial forks — a choice that would actually serve your security, deferred in favor of whatever keeps things comfortable in the moment. The Lovers sits in your Material Karma, meaning your unresolved material task centers on making the financial choice that reflects genuine preference, even when it isn't the easiest one.`,
      shadow: `The risk is that deferred financial choices don't actually disappear — they just accumulate, leaving your material security shaped more by avoidance than by decision. If you're still weighing the same financial choice long after enough information has arrived, that's the pattern still active.`,
      path: `This may shift by making one specific, deferred financial decision this week, even without full certainty, and letting the choice actually stand. You are allowed to make the financial choice even if it disturbs the peace. What decision have you been trading away, payment by payment, for calm?`,
      positive: `The karmic pattern of indecision at financial forks hasn't changed — deferring a real choice to keep the peace was always the old habit. What's different is that you now make one specific, deferred financial decision this week, even without full certainty. That decision is what finally lets security reflect an actual choice.`,
      negative: `The pattern of deferred financial choice is completely real, and it keeps accumulating instead of disappearing, security shaped more by avoidance than decision. That avoidance isn't peace-keeping. It's a choice still open, still waiting to actually be made.`,
    },

    // ── 7 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '7_MK': {
      heading: `Motion Without Arrival`,
      why: `Something in your relationship to material security carries an old pattern of forward motion without arrival — real drive toward financial goals, one after another, with the sense of "enough" always sitting just past the next milestone. The Chariot sits in your Material Karma, meaning your unresolved material task centers on recognizing security you've actually already reached, rather than continuously pushing past it.`,
      shadow: `The risk is that genuine financial progress never registers as progress, because the goalpost keeps moving the moment it's reached. If you can't name a point at which you'd actually feel secure, that restlessness is the pattern still unresolved.`,
      path: `This may shift by naming one specific, concrete financial milestone as "enough," and pausing there deliberately once it's reached, rather than immediately setting the next one. You are allowed to notice the security you've already reached. If you paused the pursuit for one honest moment — how safe are you, actually, right now?`,
      positive: `The karmic pattern of forward motion without arrival hasn't changed — real drive toward financial goals was always genuine. What's different is that you now name one specific financial milestone as enough and pause there deliberately once reached. That pausing is what finally lets progress register as security.`,
      negative: `The pattern of pushing past every milestone is completely real, and it keeps moving the goalpost the moment it's reached. That moving isn't ambition working. It's a security still unfelt, still waiting for a point to actually be called enough.`,
    },

    // ── 8 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '8_MK': {
      heading: `Old Unfairness, Still Shaping`,
      why: `Something in your relationship to material security carries an old imbalance around fairness — a sense, not always articulated, that you were once shorted, overlooked, or unfairly treated in material terms, now shaping present-day vigilance around every financial exchange. The Justice sits in your Material Karma, meaning your unresolved material task centers on settling that old imbalance rather than continuing to guard against its repeat.`,
      shadow: `The risk is treating every current financial exchange as a potential repeat of the old unfairness, creating friction in transactions that have nothing to do with what actually happened before. If you feel disproportionately alert to being shortchanged, that history may still be running underneath it.`,
      path: `This may shift by naming, specifically, what the original financial unfairness was, and separating it consciously from whatever current exchange is actually in front of you. You are allowed to handle today's money without yesterday's injustice at the table. What old unfairness is still countersigning your financial decisions?`,
      positive: `The karmic imbalance around fairness hasn't changed — a sense of once being shorted or overlooked was always real history. What's different is that you now name, specifically, what the original financial unfairness was and separate it consciously from what's actually in front of you. That naming is what settles the old imbalance.`,
      negative: `The pattern of vigilance around fairness is completely real, and it keeps treating every current exchange as a potential repeat of the old unfairness. That vigilance isn't discernment. It's a history still uncountersigned, still waiting to be named and released.`,
    },

    // ── 9 in MATERIAL KARMA (Money Channel) ─────────────────────────────────
    '9_MK': {
      heading: `Avoidance Over Engagement`,
      why: `Something in your relationship to material security carries an old pattern of withdrawal from financial engagement — a preference for not looking too closely at bills, statements, or planning, retreating into other matters rather than confronting material reality head-on. The Hermit sits in your Material Karma, meaning your unresolved material task centers on engaging directly with money matters rather than continuing to avoid them.`,
      shadow: `The risk is that unexamined finances tend to drift, and the avoidance that once felt like peace becomes its own source of quiet financial stress. If you can't say clearly what your current financial state actually is, that avoidance may be costing you more than the discomfort of looking would.`,
      path: `This may shift by setting aside one specific, limited block of time to look directly at your actual financial state, without retreating from it partway through. You are allowed to face money matters in small, survivable doses. What fifteen-minute money task would shrink the dread most if done this week?`,
      positive: `The karmic withdrawal from financial engagement hasn't changed — the preference for not looking too closely was always the old peace. What's different is that you now set aside one specific, limited block of time to look directly at your actual financial state. That looking is what finally replaces avoidance with clarity.`,
      negative: `The pattern of retreating from money matters is completely real, and it keeps letting unexamined finances drift. That drifting isn't peace. It's a stress still quietly accumulating, still waiting for the avoidance to be faced directly.`,
    },

    // ── 10 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '10_MK': {
      heading: `Cycles, Unpredicted`,
      why: `Something in your relationship to material security carries an old pattern of instability — real upswings and real downturns, financial fortune that seems to move in cycles rather than settling into something steady. The Wheel of Fortune sits in your Material Karma, meaning your unresolved material task centers on building consistency underneath the cycle, rather than simply riding it up and down.`,
      shadow: `The risk is treating every upswing as permanent and every downturn as catastrophic, making decisions from whichever extreme you happen to be in rather than from a steadier, longer view. If your financial choices swing as widely as your circumstances do, the cycle may be running the decisions instead of the other way around.`,
      path: `This may shift by building one small, consistent financial habit that holds steady regardless of which phase of the cycle you're currently in. You are allowed to learn your own cycle instead of being surprised by it. Looking back honestly — when does money tend to arrive for you, and when does it leave?`,
      positive: `The karmic instability of arriving and vanishing cycles hasn't changed — real upswings and downturns were always the actual pattern. What's different is that you now build one small, consistent financial habit that holds steady regardless of which phase you're in. That consistency is what stops the cycle from driving the decisions.`,
      negative: `The pattern of cyclical instability is completely real, and it keeps treating every upswing as permanent and every downturn as catastrophic. That extremity isn't realism. It's a stability still out of reach, still waiting for a steadier habit underneath the cycle.`,
    },

    // ── 11 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '11_MK': {
      heading: `Silence Over Naming`,
      why: `Something in your relationship to material security carries an old pattern of silent endurance — real financial hardship or pressure, held quietly and managed alone, without it ever being said plainly to anyone who might help. The Strength sits in your Material Karma, meaning your unresolved material task centers on naming financial strain directly rather than continuing to carry it in silence.`,
      shadow: `The risk is that silently-carried financial strain never gets the chance to be actually addressed, since no one close to you knows the real extent of it. If people would be surprised to learn how much financial pressure you're actually under, that silence is the pattern still active.`,
      path: `This may shift by naming your actual financial strain out loud to one trusted person this week, rather than continuing to manage it alone. You are allowed to say the strain out loud before it becomes an emergency. Who could hear one true sentence about your finances without flinching?`,
      positive: `The karmic pattern of silent endurance hasn't changed — real financial hardship held quietly and managed alone was always the old habit. What's different is that you now name your actual financial strain out loud to one trusted person. That naming is what finally lets support in.`,
      negative: `The pattern of carrying financial strain in silence is completely real, and it keeps staying unaddressed because no one close to you knows its real extent. That silence isn't strength. It's a strain still unaddressed, still waiting to be spoken before it becomes an emergency.`,
    },

    // ── 12 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '12_MK': {
      heading: `Suspended, Not Decided`,
      why: `Something in your relationship to material security carries an old pattern of self-imposed limbo — a financial decision or change left unmade, material comfort quietly sacrificed while waiting for a clarity that hasn't fully arrived. The Hanged Man sits in your Material Karma, meaning your unresolved material task centers on actually making the suspended decision rather than continuing to wait inside it.`,
      shadow: `The risk is mistaking the wait itself for necessary patience, when it may have quietly become its own form of avoidance. If the same financial decision has stayed unmade well past the point where the underlying uncertainty was resolved, the suspension may no longer be serving you.`,
      path: `This may shift by naming the specific financial decision that's been left suspended, and setting a real point by which it gets made, ready or not. You are allowed to decide — suspension has costs too. What would choosing, either way, finally release in you?`,
      positive: `The karmic pattern of self-imposed limbo hasn't changed — a decision left unmade while waiting for clarity was always the old suspension. What's different is that you now name the specific decision and set a real point by which it gets made, ready or not. That deadline is what finally releases the limbo.`,
      negative: `The pattern of suspended financial decision is completely real, and it keeps mistaking the wait for necessary patience. That waiting isn't caution. It's a comfort still sacrificed, still waiting for the decision it's been quietly deferring.`,
    },

    // ── 13 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '13_MK': {
      heading: `Resistance to Necessary Change`,
      why: `Something in your relationship to material security carries an old fear of material loss — a resistance to endings, even financial ones that are clearly due, because letting go of a current arrangement feels like losing the security itself. The Death sits in your Material Karma, meaning your unresolved material task centers on recognizing that some financial endings are what actually make room for real security, not a threat to it.`,
      shadow: `The risk is holding onto a financial arrangement well past its useful life simply because ending it feels dangerous, even when the arrangement itself has stopped serving your actual security. If you're maintaining something financial mainly out of fear of what ending it might mean, that fear is the pattern still unresolved.`,
      path: `This may shift by identifying one financial arrangement that's clearly run its course, and letting it end deliberately rather than continuing to resist the ending. You are allowed to let the financial change happen while it's still gentle. What shift are you resisting that will only grow less optional?`,
      positive: `The karmic fear of material loss hasn't changed — resistance to endings that feel dangerous was always the old protection. What's different is that you now identify one financial arrangement that's clearly run its course and let it end deliberately. That ending is what finally opens room for real security.`,
      negative: `The pattern of resisting necessary financial change is completely real, and it keeps holding onto arrangements past their useful life out of fear. That holding isn't security. It's a room still blocked, still waiting for the ending it's resisting.`,
    },

    // ── 14 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '14_MK': {
      heading: `Restriction, Then Release`,
      why: `Something in your relationship to material security carries an old pattern of extremes — strict financial discipline followed by periods of full release, each framed as the necessary correction for the one before it. The Temperance sits in your Material Karma, meaning your unresolved material task centers on finding a sustainable middle, rather than continuing to alternate between opposite poles.`,
      shadow: `The risk is that neither extreme, held alone, ever actually produces lasting security — restriction that eventually breaks, followed by release that undoes the restriction's progress. If your financial habits look more like a pendulum than a steady practice, that swing is the pattern still active.`,
      path: `This may shift by choosing one small, moderate financial habit and holding it consistently, resisting the pull toward either extreme. You are allowed to spend steadily instead of in penance and release. What would a middle-path week of spending actually look like?`,
      positive: `The karmic swing between full restriction and full release hasn't changed — each extreme framed as correction for the other was always the old pattern. What's different is that you now choose one small, moderate financial habit and hold it consistently. That moderation is what finally lets security compound instead of resetting.`,
      negative: `The pattern of financial extremes is completely real, and it keeps alternating, restriction breaking into release and release undoing restriction's progress. That alternating isn't discipline. It's a security still resetting, still waiting for a sustainable middle.`,
    },

    // ── 15 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '15_MK': {
      heading: `Bound, Not Held`,
      why: `Something in your relationship to material security carries an old pattern of compulsive attachment — a felt sense of being bound to financial obligations, possessions, or a particular lifestyle rather than genuinely choosing them. The Devil sits in your Material Karma, meaning your unresolved material task centers on examining that felt bondage directly, rather than continuing to experience it as simply how things are.`,
      shadow: `The risk is mistaking a compulsive material attachment for a fixed reality, when it may actually be a pattern that hasn't yet been questioned. If you feel trapped by a financial obligation without having genuinely examined whether it's still required, that unexamined bind is the pattern still unresolved.`,
      path: `This may shift by naming, honestly, one specific material attachment that feels like a trap, and asking directly what it would actually take to loosen it. You are allowed to hold money instead of being held by it. What one act would shift you from trapped to steward, even slightly?`,
      positive: `The karmic sense of compulsive material attachment hasn't changed — feeling bound to obligations rather than genuinely choosing them was always the old bind. What's different is that you now name, honestly, one specific attachment that feels like a trap and ask what it would take to loosen it. That examination is what turns the trap into stewardship.`,
      negative: `The pattern of feeling trapped by money is completely real, and it keeps being mistaken for fixed reality rather than an unquestioned pattern. That mistaking isn't fate. It's a bind still unexamined, still waiting to be looked at directly.`,
    },

    // ── 16 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '16_MK': {
      heading: `Warning Signs, Missed`,
      why: `Something in your relationship to material security carries an old pattern of denial toward early financial strain — signs of instability quietly maintained as "fine" until a sudden, more disruptive reckoning forces the issue. The Tower sits in your Material Karma, meaning your unresolved material task centers on taking early financial warning signs seriously, rather than waiting for a forced, sudden correction.`,
      shadow: `The risk is that maintaining the appearance of financial stability, rather than addressing what's actually straining underneath it, sets up exactly the sudden collapse the denial was meant to avoid. If financial reversals in your life tend to feel sudden despite visible signals beforehand, that pattern of delayed reckoning may be active.`,
      path: `This may shift by identifying, specifically, one financial strain currently being minimized, and addressing it directly before it forces a more disruptive correction. You are allowed to see the warning early and respond softly. What financial signal is currently blinking that deserves ten calm minutes?`,
      positive: `The karmic pattern of missing early warning signs hasn't changed — quietly maintaining fine as the label was always the old denial. What's different is that you now identify one financial strain currently being minimized and address it directly. That early action is what replaces sudden collapse with chosen correction.`,
      negative: `The pattern of denying early strain is completely real, and it keeps maintaining an appearance of stability instead of addressing what's underneath. That maintaining isn't calm. It's a collapse still being set up, still waiting for the early signal to be read.`,
    },

    // ── 17 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '17_MK': {
      heading: `Hope Without Action`,
      why: `Something in your relationship to material security carries an old pattern of passive hope — a genuine, sustaining belief that things will get better financially, held without yet converting into the concrete action that hope was meant to inspire. The Star sits in your Material Karma, meaning your unresolved material task centers on pairing real hope with real, specific action toward material improvement.`,
      shadow: `The risk is that hope alone, however genuine, doesn't move a financial position on its own — and waiting for improvement to simply arrive can substitute for the action that would actually produce it. If your financial hope hasn't yet translated into a concrete step, that gap is the pattern still unresolved.`,
      path: `This may shift by naming one small, concrete action your financial hope is actually pointing toward, and taking it this week. You are allowed to act on the hope, not just keep it warm. What is the first concrete move your financial hope has been waiting on?`,
      positive: `The karmic pattern of passive hope hasn't changed — a genuine, sustaining belief that things will improve was always real. What's different is that you now name one small, concrete action your financial hope is actually pointing toward and take it. That action is what finally moves the hope into improvement.`,
      negative: `The pattern of hope without action is completely real, and it keeps waiting for improvement to simply arrive. That waiting isn't faith working. It's a position still unmoved, still waiting for the hope to be paired with something concrete.`,
    },

    // ── 18 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '18_MK': {
      heading: `Vague Over Clear`,
      why: `Something in your relationship to material security carries an old pattern of anxious avoidance — a preference for a vague, felt sense of your financial position over a clear, examined one, because clarity itself feels like it might confirm something feared. The Moon sits in your Material Karma, meaning your unresolved material task centers on replacing that anxious haze with an actual, examined look at where things stand.`,
      shadow: `The risk is that the anxiety persists precisely because it's never actually checked against real numbers — a vague fear is harder to resolve than a specific, known one. If you feel more anxious about money than your actual numbers would justify, that gap between feeling and fact is the pattern still active.`,
      path: `This may shift by looking directly at one specific, avoided financial number this week, and letting the actual figure replace the anxious guess. You are allowed to trade the haze for one clear fact at a time. Which unknown, once known, would quiet the most background noise?`,
      positive: `The karmic pattern of anxious avoidance hasn't changed — a vague, felt sense of your position over a clear one was always the old preference. What's different is that you now look directly at one specific, avoided financial number and let the actual figure replace the anxious guess. That look is what clears the haze.`,
      negative: `The pattern of financial anxiety is completely real, and it keeps persisting precisely because it's never actually checked against real numbers. That persisting isn't caution. It's a fear still vague, still waiting for one clear fact to replace it.`,
    },

    // ── 19 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '19_MK': {
      heading: `Confidence, Performed`,
      why: `Something in your relationship to material security carries an old pattern of performed ease — an outward financial confidence maintained consistently, even in stretches where the underlying picture feels genuinely uncertain. The Sun sits in your Material Karma, meaning your unresolved material task centers on letting real uncertainty be visible sometimes, rather than maintaining brightness regardless of what's actually happening underneath.`,
      shadow: `The risk is that the performed confidence prevents anyone, including you, from actually addressing the uncertainty underneath it — a bright surface that keeps real financial concerns from getting real attention. If you'd never let anyone see you worried about money, that consistent brightness may be costing you the support that naming it would bring.`,
      path: `This may shift by letting one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual confidence. You are allowed to be privately unsure and say so somewhere safe. Who could know the real financial picture without your confidence collapsing?`,
      positive: `The karmic pattern of performed ease hasn't changed — outward financial confidence maintained consistently was always the old habit. What's different is that you now let one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual brightness. That visibility is what finally lets real concerns get attention.`,
      negative: `The pattern of performed confidence is completely real, and it keeps preventing anyone, including you, from addressing the uncertainty underneath. That performing isn't strength. It's a concern still unaddressed, still waiting behind a brightness that's costing you support.`,
    },

    // ── 20 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '20_MK': {
      heading: `Reckoning, Delayed`,
      why: `Something in your relationship to material security carries an old pattern of delay at the point of reckoning — a financial truth that's already become clear, met with more preparation, more waiting, one more condition before it's actually faced. The Judgement sits in your Material Karma, meaning your unresolved material task centers on acting on financial clarity that has, in most cases, already arrived.`,
      shadow: `The risk is that further preparation, past a certain point, functions as delay rather than genuine diligence — a reckoning kept perpetually one step away. If you already know what the financial situation actually calls for and still haven't acted, that delay is the pattern still unresolved.`,
      path: `This may shift by naming the specific action the financial clarity is already calling for, and taking a first concrete step this week rather than gathering more certainty first. You are allowed to have the reckoning on your own terms, now, gently. What would facing it this month cost — and what is postponement already costing?`,
      positive: `The karmic pattern of delay at reckoning hasn't changed — a financial truth met with more waiting was always the old habit. What's different is that you now name the specific action the clarity is already calling for and take a first concrete step. That step is what finally closes the reckoning.`,
      negative: `The pattern of delaying financial reckoning is completely real, and it keeps meeting arrived clarity with more preparation instead of action. That preparing isn't diligence anymore. It's a reckoning still one step away, still waiting for the first move.`,
    },

    // ── 21 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '21_MK': {
      heading: `Never Fully Finished`,
      why: `Something in your relationship to material security carries an old pattern of extending completion — a financial goal reached in practical terms, but immediately relativized, expanded, or set alongside a new condition before it's allowed to actually count as done. The World sits in your Material Karma, meaning your unresolved material task centers on letting a genuinely reached financial goal be named complete.`,
      shadow: `The risk is that material security never gets to be felt, because the finish line keeps moving the moment it's actually crossed. If you can't recall the last time a financial goal felt fully, simply done, that pattern of continuous extension is still active.`,
      path: `This may shift by identifying one financial goal that is, in practical terms, already reached, and deliberately naming it complete rather than adding one more condition first. You are allowed to let a financial goal be reached and felt. Which target have you already hit that never got its moment?`,
      positive: `The karmic pattern of extending completion hasn't changed — relativizing a reached goal before it counts as done was always the old habit. What's different is that you now identify one financial goal that's practically already reached and deliberately name it complete. That naming is what finally lets the security be felt.`,
      negative: `The pattern of extending financial completion is completely real, and it keeps moving the finish line the moment it's actually crossed. That moving isn't ambition. It's a security still unfelt, still waiting for a goal to be allowed to count as done.`,
    },

    // ── 22 in MATERIAL KARMA (Money Channel) ────────────────────────────────
    '22_MK': {
      heading: `Leap Before Net`,
      why: `Something in your relationship to material security carries an old pattern of leaping first — genuine openness to material risk, acted on with real courage, but often before the groundwork that would make the risk sustainable has actually been laid. The Fool sits in your Material Karma, meaning your unresolved material task centers on pairing that real courage with enough preparation to let the leap actually land.`,
      shadow: `The risk is that the leap itself becomes the whole story, with the landing left to chance — material risks taken freely, but rarely with a safety net considered in advance. If your financial risks tend to work out through luck rather than preparation, that gap is the pattern still unresolved.`,
      path: `This may shift by building one small piece of safety net before the next financial leap, rather than trusting the landing entirely to courage alone. You are allowed to weave the net before the next leap. What would a minimum floor look like that keeps your boldness alive and survivable?`,
      positive: `The karmic pattern of leaping first hasn't changed — genuine openness to material risk, acted on with real courage, was always the old strength. What's different is that you now build one small piece of safety net before the next financial leap. That preparation is what finally lets the leap land.`,
      negative: `The pattern of leaping before the net is completely real, and it keeps leaving the landing to chance, rarely considered in advance. That leaving isn't boldness alone. It's a risk still dependent on luck, still waiting for the groundwork that would make it sustainable.`,
    },

    // ── 1 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '1_RWM': {
      heading: `Earned Over Given`,
      why: `Your subconscious relationship to money runs through active generation — earning feels legitimate, deserved, real, while money that arrives without your direct effort (a gift, a windfall, unearned interest) can feel oddly uncomfortable to simply receive. The Magician governs your Relationship with Money, meaning your instinct is to keep initiating income rather than letting it also just come to you.`,
      shadow: `The risk is turning down or minimizing genuinely available resources — support, gifts, easier income — because only self-generated money feels legitimate to hold onto. If you find yourself working harder for money you could have simply accepted, that discomfort with receiving may be the pattern still running.`,
      path: `This may shift by accepting one piece of unearned financial ease this week — a gift, an easier path, help offered — without converting it into something you have to justify through extra effort. You are allowed to receive money you didn't visibly sweat for. What arrived easily lately that you could practice simply keeping?`,
      positive: `Your trust in actively made money hasn't changed — earning through initiation was always genuine and legitimate. What's different is that you now accept one piece of unearned financial ease, a gift, an easier path, without converting it into something to justify through extra effort. That acceptance is what widens the flow.`,
      negative: `Your instinct to keep initiating income is completely real, and it keeps discounting money that arrives without direct effort, turning down real ease because only self-generated income feels legitimate. That discounting isn't discipline. It's a flow still narrower than it needs to be, still waiting for receiving to feel as legitimate as earning.`,
    },

    // ── 2 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '2_RWM': {
      heading: `Sensing, Not Naming`,
      why: `Your subconscious relationship to money runs through quiet intuition — a real sense for when a financial opportunity is right, paired with real discomfort stating plainly what your work or time is actually worth. The High Priestess governs your Relationship with Money, meaning your financial insight tends to stay private, felt rather than spoken aloud in the transactional terms money actually requires.`,
      shadow: `The risk is that unclaimed insight goes uncompensated — you sense the right move, make it quietly, and let the value of that instinct go unnamed and underpaid. If your income doesn't reflect what you actually know, the silence around your own worth may be the pattern still active.`,
      path: `This may shift by stating one specific price or value out loud this week, rather than letting your financial instinct stay an unspoken, unpaid asset. You are allowed to name your price out loud and let the silence sit. What number would you quote tomorrow if flinching weren't part of the transaction?`,
      positive: `Your quiet sense for financial opportunity hasn't changed — that intuition was always genuinely accurate. What's different is that you now state one specific price or value out loud, rather than letting the instinct stay an unspoken, unpaid asset. That naming is what finally lets income reflect the real value.`,
      negative: `Your financial insight is completely real, and it keeps staying private, felt rather than spoken aloud in the transactional terms money actually requires. That silence isn't modesty. It's an income still uncompensated, still waiting for the price to actually be named.`,
    },

    // ── 3 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '3_RWM': {
      heading: `Spending on Others, Not Self`,
      why: `Your subconscious relationship to money runs through generous, sensory expression — real ease spending on comfort, beauty, and care, for yourself and especially for others, with less natural pull toward accumulation or reserve. The Empress governs your Relationship with Money, meaning your financial flow is generative and warm, but not automatically protective of its own future.`,
      shadow: `The risk is that generosity, unchecked, leaves nothing set aside — real abundance moving freely outward while your own reserve stays thin. If you're comfortable and generous now but anxious about later, that imbalance may be the pattern still unresolved.`,
      path: `This may shift by setting aside a specific portion of any income for your own future before spending on comfort or generosity extends further. You are allowed to save for yourself with the same pleasure you spend on comfort. What would a beautiful act of saving look like?`,
      positive: `Your ease spending on comfort and beauty hasn't changed — generous, sensory expression was always genuine warmth. What's different is that you now set aside a specific portion of income for your own future before the comfort spending extends further. That reserve is what keeps the warmth from costing you your own security.`,
      negative: `Your generosity is completely real, and it keeps moving freely outward while your own reserve stays thin. That thinness isn't recklessness. It's a future still unprotected, still waiting for saving to feel as pleasurable as spending.`,
    },

    // ── 4 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '4_RWM': {
      heading: `Safety Through Control`,
      why: `Your subconscious relationship to money runs through control — structure, oversight, a firm hand on every account and decision, as though financial security depends entirely on your personal management of it. The Emperor governs your Relationship with Money, meaning your instinct is to build and defend systems rather than trust ones you didn't personally construct.`,
      shadow: `The risk is that the management itself becomes the source of stress, and delegating any part of your finances — even to a trustworthy system — feels like a genuine risk rather than a reasonable option. If you can't imagine your money being fine without your constant oversight, that's the pattern still active.`,
      path: `This may shift by handing one small piece of financial management to a system or person you trust, and observing whether it actually holds without you. You are allowed to let a detail go unmanaged and see it survive. Which piece of the money machinery could run a week without your eyes on it?`,
      positive: `Your instinct to build and defend financial structure hasn't changed — that firm hand was always real competence. What's different is that you now hand one small piece of financial management to a system or person you trust, and observe whether it holds. That test is what finally lets security extend beyond your own oversight.`,
      negative: `Your need for control is completely real, and it keeps making delegation feel like a genuine risk rather than a reasonable option. That risk-aversion isn't prudence. It's a security still exhausting to sustain, still waiting for a trusted system to be given the chance to hold.`,
    },

    // ── 5 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '5_RWM': {
      heading: `Guilt Over the "Right Way"`,
      why: `Your subconscious relationship to money runs through inherited rules about correctness — a real sense that there's a proper, sanctioned way to earn and spend, and quiet discomfort whenever money arrives or leaves outside that framework. The Hierophant governs your Relationship with Money, meaning your instinct is to check financial choices against tradition or authority before trusting them.`,
      shadow: `The risk is passing up genuinely good financial opportunities simply because they don't match an inherited idea of the "proper" way to earn or spend. If you feel guilty about money that came easily or unconventionally, even when nothing about it was actually wrong, that inherited rule may be the pattern still active.`,
      path: `This may shift by naming one inherited money rule directly and testing whether it actually reflects your own values, or just an old, unexamined authority. You are allowed to earn and spend outside the inherited 'right way' without guilt attending. Whose voice is the guilt actually speaking in — and is it still your authority?`,
      positive: `Your instinct to check financial choices against tradition hasn't changed — that framework was always genuinely meaningful. What's different is that you now name one inherited money rule directly and test whether it actually reflects your own values. That testing is what finally lets you earn and spend without guilt attached.`,
      negative: `Your sense that there's a proper, sanctioned way to handle money is completely real, and it keeps disqualifying genuinely good opportunities that don't match the inherited framework. That disqualifying isn't wisdom. It's an opportunity still passed up, still waiting for the old rule to be examined instead of simply obeyed.`,
    },

    // ── 6 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '6_RWM': {
      heading: `Weighed Against Someone Else`,
      why: `Your subconscious relationship to money runs through relational weighing — earning and spending decisions filtered through what a partner or loved one would think, want, or need, sometimes before your own actual preference gets consulted. The Lovers governs your Relationship with Money, meaning your financial choices are genuinely relational, for better and for worse.`,
      shadow: `The risk is that your own financial preference gets perpetually deferred to someone else's, leaving you unsure what you'd actually choose if the decision were only yours. If you can't say clearly what you want financially, independent of what someone else wants, that deference may be the pattern still unresolved.`,
      path: `This may shift by making one financial decision based purely on your own preference this week, and letting it stand without checking it against anyone else's wants first. You are allowed to weigh your own want first sometimes. What financial choice is currently pending that is genuinely yours alone to make?`,
      positive: `Your relational weighing of financial choices hasn't changed — genuinely considering a partner's wants was always real care. What's different is that you now make one financial decision based purely on your own preference, and let it stand without checking it against anyone else's first. That choice is what turns deference into true collaboration.`,
      negative: `Your relational instinct around money is completely real, and it keeps filtering every choice through what someone else would want first. That filtering isn't consideration. It's a preference still unexamined, still waiting for your own want to be weighed first sometimes.`,
    },

    // ── 7 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '7_RWM': {
      heading: `Chasing Past Enjoying`,
      why: `Your subconscious relationship to money runs through forward drive — real ambition and momentum toward the next financial target, arriving so quickly after the last one that there's rarely a pause to actually register what's already been earned. The Chariot governs your Relationship with Money, meaning your financial motion is genuinely strong, but rest and enjoyment haven't kept pace with it.`,
      shadow: `The risk is that money earned never actually gets to feel earned — spent, saved, or invested toward the next goal before its arrival is even acknowledged. If you can't recall the last time you paused to genuinely enjoy an income milestone, that restlessness may be the pattern still active.`,
      path: `This may shift by deliberately pausing after the next financial milestone, before setting the next target, long enough to actually register what's been reached. You are allowed to enjoy the goal you just reached before chasing the next. What recent win deserves an actual celebration, however small?`,
      positive: `Your forward drive toward the next financial target hasn't changed — real ambition and momentum were always genuine strength. What's different is that you now pause deliberately after a milestone, before setting the next target, long enough to actually register what's been reached. That pause is what turns motion into felt progress.`,
      negative: `Your financial momentum is completely real, and it keeps chasing the next goal so quickly there's rarely time to register the last one. That chasing isn't ambition alone. It's a progress still unfelt, still waiting for a pause to let it actually land.`,
    },

    // ── 8 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '8_RWM': {
      heading: `A Precise Mental Ledger`,
      why: `Your subconscious relationship to money runs through fairness and precision — a sharp internal accounting of who owes what, whether compensation matches effort, whether an exchange was actually equal. The Justice governs your Relationship with Money, meaning your financial instinct is deeply oriented toward balance, sometimes at the cost of ease.`,
      shadow: `The risk is that the mental ledger never fully closes — small financial imbalances tracked and remembered long after they'd naturally resolve on their own, creating tension in relationships or transactions that could otherwise be simple. If you're still tallying a financial unfairness long after it stopped mattering to anyone else, that ledger may be the pattern still running.`,
      path: `This may shift by consciously closing one old financial account you're still mentally tracking, and letting the balance rest rather than continuing to tally it. You are allowed to close the ledger on exchanges that were already fair. Where could generosity replace precision without anything being lost?`,
      positive: `Your precise mental ledger hasn't changed — a sharp internal accounting of what's fair was always real orientation toward balance. What's different is that you now consciously close one old financial account you're still tracking, and let the balance rest. That closing is what lets fairness apply to what's current.`,
      negative: `Your instinct for fairness is completely real, and it keeps the ledger open indefinitely, small imbalances tracked long after they'd naturally resolve. That tracking isn't precision. It's a fairness still tangled in the past, still waiting for an old account to actually be closed.`,
    },

    // ── 9 in RELATIONSHIP WITH MONEY (Money Channel) ────────────────────────
    '9_RWM': {
      heading: `Alone Over Asking`,
      why: `Your subconscious relationship to money runs through self-sufficiency — a strong preference for earning and managing money independently, even when collaboration or support would genuinely increase what's available to you. The Hermit governs your Relationship with Money, meaning your financial instinct favors solitude over asking, even at a real cost.`,
      shadow: `The risk is undercharging or under-earning specifically to avoid the discomfort of financial interdependence — a self-sufficiency so strong it quietly limits your own income. If you'd rather make less alone than ask for help that could genuinely grow what you earn, that avoidance may be the pattern still active.`,
      path: `This may shift by asking for one specific piece of financial help or partnership this week, and noticing what actually becomes possible once you do. You are allowed to partner and still be self-made. What could you build with help that solitude has kept at half its size?`,
      positive: `Your self-sufficiency around money hasn't changed — earning and managing independently was always real capability. What's different is that you now ask for one specific piece of financial help or partnership, and notice what becomes possible. That asking is what finally lets income grow past solitude's ceiling.`,
      negative: `Your preference for earning alone is completely real, and it keeps limiting income specifically to avoid the discomfort of financial interdependence. That limiting isn't independence. It's an income still capped, still waiting for partnership to be allowed in.`,
    },

    // ── 10 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '10_RWM': {
      heading: `Waves, Not Steady`,
      why: `Your subconscious relationship to money runs through cycles — real feast-and-famine patterns, income that surges and recedes, an instinct that treats sudden financial luck as more familiar than slow, steady accumulation. The Wheel of Fortune governs your Relationship with Money, meaning your financial rhythm is genuinely cyclical, for better and worse.`,
      shadow: `The risk is that steady income gets unconsciously undermined — quietly sabotaged or simply not trusted — because the wave pattern feels more like "how money actually works" than something reliable ever could. If consistent income opportunities keep slipping away just as they start to stabilize, that instinct may be the pattern still active.`,
      path: `This may shift by deliberately protecting one steady income source through a full cycle, resisting the urge to disrupt it just because it feels unfamiliar. You are allowed to trust steady money — it isn't a trick. What would you do differently if predictable income finally felt safe?`,
      positive: `Your feast-and-famine financial rhythm hasn't changed — real cycles of surge and recede were always the familiar pattern. What's different is that you now deliberately protect one steady income source through a full cycle, resisting the urge to disrupt it. That protection is what lets stability become trustworthy too.`,
      negative: `Your cyclical financial instinct is completely real, and it keeps unconsciously undermining steady income because the wave pattern feels more like how money actually works. That undermining isn't caution. It's a stability still untrusted, still waiting for a full cycle to prove itself.`,
    },

    // ── 11 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '11_RWM': {
      heading: `Providing Before Provided For`,
      why: `Your subconscious relationship to money runs through quiet endurance — real capacity to earn, support, and carry financial responsibility for others, paired with a much weaker instinct to ask the same in return. The Strength governs your Relationship with Money, meaning your financial resilience is genuine, but one-directional by default.`,
      shadow: `The risk is that the giving becomes depleting precisely because it's never balanced by receiving — real financial strength quietly costing you the support you'd need to actually sustain it. If you can provide for everyone but struggle to ask anyone to provide for you, that imbalance may be the pattern still unresolved.`,
      path: `This may shift by naming one specific financial need out loud to someone capable of helping, rather than continuing to carry it alone by default. You are allowed to be provided for before the emergency makes it necessary. What support would you accept today if asking cost nothing?`,
      positive: `Your capacity to provide financially for others hasn't changed — that quiet endurance was always genuine strength. What's different is that you now name one specific financial need out loud to someone capable of helping, rather than carrying it alone by default. That naming is what makes the strength sustainable.`,
      negative: `Your financial resilience is completely real, and it keeps staying one-directional, giving without ever asking the same in return. That one-directionality isn't strength holding steady. It's a resilience still depleting, still waiting to be balanced by receiving.`,
    },

    // ── 12 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '12_RWM': {
      heading: `Self, Last in Line`,
      why: `Your subconscious relationship to money runs through self-denial — a real instinct to withhold financial comfort from yourself specifically, even while resources exist, as though waiting or sacrificing has its own quiet virtue. The Hanged Man governs your Relationship with Money, meaning your financial instinct suspends your own comfort more readily than it suspends anyone else's.`,
      shadow: `The risk is that the denial outlives whatever it was originally protecting — money available for your own comfort, held back indefinitely, well past the point where the sacrifice actually serves anything. If you consistently postpone spending on yourself specifically, that suspension may be the pattern still active.`,
      path: `This may shift by spending, deliberately and without justification, on one thing for your own comfort this week — not as a reward, just as a choice. You are allowed to spend on yourself specifically, on purpose, soon. What denied purchase is actually a postponed kindness?`,
      positive: `Your instinct to withhold financial comfort from yourself hasn't changed — that suspension was always a real, if costly, discipline. What's different is that you now spend, deliberately and without justification, on one thing for your own comfort. That spending is what finally gives the denial an end point.`,
      negative: `Your self-denial around money is completely real, and it keeps postponing your own comfort well past the point where the sacrifice actually serves anything. That postponing isn't virtue. It's a comfort still delayed, still waiting for permission to simply be spent on.`,
    },

    // ── 13 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '13_RWM': {
      heading: `Overhaul, Not Adjustment`,
      why: `Your subconscious relationship to money runs through transformation — real financial shifts that arrive as complete overhauls, a job left entirely, a whole system rebuilt from scratch, rather than gradual, incremental change. The Death governs your Relationship with Money, meaning your financial instinct favors the clean break over the slow adjustment.`,
      shadow: `The risk is that smaller, earlier course-corrections get skipped in favor of waiting for the big, dramatic reset — financial problems left unaddressed until they force a total overhaul that a gradual adjustment could have prevented. If your financial life keeps needing complete rebuilds rather than small tune-ups, that pattern may be the piece still unresolved.`,
      path: `This may shift by making one small, incremental financial adjustment now, rather than waiting for the situation to force a complete overhaul later. You are allowed to adjust gradually — not every change needs the wrecking ball. What small financial tweak could replace the next planned overhaul?`,
      positive: `Your instinct toward total financial overhaul hasn't changed — the clean break was always your real strength. What's different is that you now make one small, incremental adjustment now, rather than waiting for a situation to force a complete reset. That timing is what makes the transformation deliberate instead of forced.`,
      negative: `Your capacity for total financial transformation is completely real, and it keeps skipping the smaller, earlier course-corrections in favor of the dramatic reset. That skipping isn't decisiveness. It's an overhaul still more disruptive than it needed to be, still waiting for the small tweaks to be allowed too.`,
    },

    // ── 14 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '14_RWM': {
      heading: `Extremes Under Stress`,
      why: `Your subconscious relationship to money runs through balance — genuinely steady and moderate when centered, but prone to swinging into strict restriction or full indulgence the moment real stress enters the picture. The Temperance governs your Relationship with Money, meaning your natural equilibrium is real, but conditional on your overall state.`,
      shadow: `The risk is that stress-driven financial swings undo the very balance that's otherwise your real strength — a period of discipline followed by a release that erases its progress, or the reverse. If your spending habits seem to track your stress level more than your actual financial plan, that swing may be the pattern still active.`,
      path: `This may shift by noticing the moment stress starts pulling your spending toward an extreme, and consciously choosing the smaller, steadier version of the response instead. You are allowed to meet stress without the pendulum. When pressure hits next — what would the moderate move look like, decided now, in calm?`,
      positive: `Your natural financial equilibrium hasn't changed — genuinely steady and moderate when centered was always real strength. What's different is that you now notice the moment stress starts pulling spending toward an extreme, and consciously choose the smaller, steadier response. That noticing is what lets the balance hold under pressure.`,
      negative: `Your capacity for balance is completely real, and it keeps swinging into strict restriction or full indulgence the moment real stress enters. That swinging isn't a plan failing. It's a balance still conditional, still waiting to be chosen deliberately instead of overridden by pressure.`,
    },

    // ── 15 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '15_RWM': {
      heading: `Compulsion Over Choice`,
      why: `Your subconscious relationship to money runs through compulsion — a specific financial habit, whether spending, earning, or a particular relationship to a job or lifestyle, that feels less like an active choice and more like something you're bound to. The Devil governs your Relationship with Money, meaning at least one part of your financial life runs on autopilot rather than genuine decision.`,
      shadow: `The risk is mistaking the compulsive habit for simply how things are, never actually examining whether it's still necessary or just familiar. If a specific money habit feels like it's running you rather than the other way around, that unexamined grip may be the pattern still unresolved.`,
      path: `This may shift by naming the specific compulsive financial habit honestly, and asking directly what would actually happen if you loosened it. You are allowed to examine the compulsion with curiosity instead of shame. What is the habit actually purchasing for you, underneath the receipt?`,
      positive: `Your specific financial compulsion hasn't changed — a habit that feels bound rather than chosen was always real. What's different is that you now name the compulsive habit honestly and ask directly what would happen if you loosened it. That honesty is what turns autopilot back into genuine choice.`,
      negative: `Your compulsive financial habit is completely real, and it keeps being mistaken for simply how things are, never actually examined. That mistaking isn't acceptance. It's a habit still running you, still waiting to be looked at with curiosity instead of shame.`,
    },

    // ── 16 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '16_RWM': {
      heading: `Sudden, Despite the Signs`,
      why: `Your subconscious relationship to money runs through sudden disruption — real financial shifts that seem to hit abruptly, even in situations where warning signs were quietly present beforehand. The Tower governs your Relationship with Money, meaning your instinct is to maintain the current picture until it can no longer be maintained, rather than adjusting early.`,
      shadow: `The risk is that maintaining the appearance of financial stability, instead of addressing the strain underneath it, sets up exactly the sudden reversal the denial was meant to avoid. If financial surprises in your life tend to have visible signals in hindsight, that pattern of delayed reckoning may be active.`,
      path: `This may shift by identifying one financial strain currently being minimized, and addressing it directly before it forces a more disruptive, sudden correction. You are allowed to read the signs early and change course quietly. What current signal, honestly read, is asking for a small adjustment now?`,
      positive: `Your instinct to maintain the current financial picture hasn't changed — that steadiness was always a real, if costly, effort. What's different is that you now identify one financial strain currently being minimized and address it directly. That early action is what replaces sudden reversal with chosen adjustment.`,
      negative: `Your tendency toward sudden financial disruption is completely real, and it keeps maintaining an appearance of stability instead of addressing the strain underneath. That maintaining isn't calm. It's a reckoning still delayed, still waiting for the early signal to actually be read.`,
    },

    // ── 17 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '17_RWM': {
      heading: `Passion Monetized, Rest Hoped For`,
      why: `Your subconscious relationship to money runs through hope and natural talent — real ease turning creative or inspired work into income, paired with a more passive hope that other financial areas will simply improve on their own over time. The Star governs your Relationship with Money, meaning your gift for monetizing inspiration is real, but it hasn't yet extended to areas that need direct action instead.`,
      shadow: `The risk is that hope substitutes for action in exactly the financial areas that need a concrete step, while your genuine talent for monetizing passion continues unaffected. If parts of your financial life have stayed the same for years despite hoping they'd improve, that passivity may be the pattern still active.`,
      path: `This may shift by naming one financial area you've been hoping will improve, and taking one concrete action toward it this week instead of continuing to wait. You are allowed to apply your monetizing gift to the unglamorous parts too. Which neglected corner of your finances would transform under the attention you give your inspirations?`,
      positive: `Your gift for monetizing what inspires you hasn't changed — that natural ease was always real. What's different is that you now name one financial area you've been hoping will improve and take one concrete action toward it. That action is what finally gives the hope something to stand on.`,
      negative: `Your talent for monetizing inspiration is completely real, and it keeps staying passive in other financial areas, hoping they'll simply improve on their own. That passivity isn't faith. It's a financial area still unchanged, still waiting for the same attention your passions already get.`,
    },

    // ── 18 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '18_RWM': {
      heading: `Anxiety Louder Than the Numbers`,
      why: `Your subconscious relationship to money runs through anxious uncertainty — a real, felt worry about your financial state that's often more intense and less examined than the actual numbers would justify. The Moon governs your Relationship with Money, meaning your financial fear tends to run ahead of your financial facts.`,
      shadow: `The risk is that the anxiety perpetuates itself precisely because it's never actually checked against reality — a vague, unexamined fear is harder to resolve than a specific, known one. If you feel more anxious about money than your actual situation warrants, that gap between feeling and fact may be the pattern still active.`,
      path: `This may shift by looking directly at one specific, avoided financial number this week, and letting the actual figure replace the anxious guess. You are allowed to let the numbers be clearer than the anxiety. What would you find if you looked — and how often has looking actually been worse than dreading?`,
      positive: `Your anxious sense about your financial state hasn't changed in intensity — that worry was always real. What's different is that you now look directly at one specific, avoided financial number and let the actual figure replace the anxious guess. That look is what settles the fear into something workable.`,
      negative: `Your financial anxiety is completely real, and it keeps running ahead of the actual facts, more intense than the numbers would justify. That running ahead isn't caution. It's a fear still unexamined, still waiting for the real figures to replace the guess.`,
    },

    // ── 19 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '19_RWM': {
      heading: `Ease Performed, Worry Private`,
      why: `Your subconscious relationship to money runs through performed confidence — a natural, radiant ease around money maintained outwardly, even during periods where the underlying picture feels genuinely uncertain. The Sun governs your Relationship with Money, meaning your real gift for financial optimism sometimes covers concerns that could use real attention instead.`,
      shadow: `The risk is that the consistent brightness prevents anyone, including you, from actually addressing what's uncertain underneath it — genuine financial concerns that never get real attention because the surface always looks fine. If you'd rarely let anyone see you actually worried about money, that consistent performance may be costing you real support.`,
      path: `This may shift by letting one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual ease. You are allowed to drop the performance of ease with one trusted person. Who could hold the worried version of you without your ease becoming a lie?`,
      positive: `Your radiant ease around money hasn't changed — that natural optimism was always genuine gift. What's different is that you now let one specific financial worry be visible to someone trustworthy, instead of managing it entirely behind the usual brightness. That visibility is what finally lets the concern get real attention.`,
      negative: `Your projected financial ease is completely real, and it keeps covering concerns that could use direct attention instead. That covering isn't positivity. It's a worry still unaddressed, still waiting behind a performance of ease that's costing you real support.`,
    },

    // ── 20 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '20_RWM': {
      heading: `Reckoning, Later Than the Signs`,
      why: `Your subconscious relationship to money runs through delayed reckoning — a pattern of eventually facing financial truths fully and honestly, but usually well after the signs pointing toward them first appeared. The Judgement governs your Relationship with Money, meaning your eventual clarity is genuine, but the timing tends to lag behind the actual evidence.`,
      shadow: `The risk is that the delay itself has a cost — financial issues left unaddressed longer than necessary, simply because the eventual reckoning always seems to arrive, so there's less urgency to act on early signs. If you tend to face financial truths only once they can no longer be avoided, that lag may be the pattern still active.`,
      path: `This may shift by acting on a current financial sign now, before it becomes the kind of situation that eventually forces a full reckoning. You are allowed to wake up before the call comes. What sign from the last month deserves to be treated as the wake-up now?`,
      positive: `Your eventual honesty about financial truths hasn't changed — that clarity, once it arrives, was always genuine. What's different is that you now act on a current financial sign now, before it becomes the kind of situation that forces a full reckoning. That earlier timing is what makes the correction less costly.`,
      negative: `Your capacity for eventual financial clarity is completely real, and it keeps lagging behind the actual evidence, arriving only once things can no longer be avoided. That lagging isn't patience. It's a reckoning still delayed, still waiting for the early sign to be acted on instead of just noticed.`,
    },

    // ── 21 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '21_RWM': {
      heading: `Complete Only at Scale`,
      why: `Your subconscious relationship to money runs through a large-scale, big-picture standard — real financial progress measured against an ideal, comprehensive version of success, rather than felt as complete on its own more modest terms. The World governs your Relationship with Money, meaning genuine financial wins can feel unfinished simply because the full picture hasn't yet arrived.`,
      shadow: `The risk is that real, current financial success never gets to be felt as success, because it's constantly measured against a bigger picture that hasn't materialized yet. If you can't recall the last time a financial win felt genuinely complete, that big-picture standard may be the pattern still active.`,
      path: `This may shift by naming one financial win that's genuinely real right now, and letting it count as complete on its own terms, without measuring it against the larger picture. You are allowed to let real success count even when it's smaller than the ideal picture. What have you built that the dream keeps refusing to credit?`,
      positive: `Your big-picture standard for financial success hasn't changed — measuring against a comprehensive, ideal version was always part of your ambition. What's different is that you now name one financial win that's genuinely real right now and let it count as complete on its own terms. That naming is what finally lets success be felt.`,
      negative: `Your large-scale standard is completely real, and it keeps measuring every current win against a bigger picture that hasn't materialized yet. That measuring isn't ambition working right. It's a success still unfelt, still waiting to be allowed to count even when it's smaller than the dream.`,
    },

    // ── 22 in RELATIONSHIP WITH MONEY (Money Channel) ───────────────────────
    '22_RWM': {
      heading: `Trust Over Planning`,
      why: `Your subconscious relationship to money runs through spontaneous trust — real openness to financial risk and change, paired with a genuine belief that things will work out, more than a habit of building the structure that would make that outcome more certain. The Fool governs your Relationship with Money, meaning your financial optimism is real, but often unaccompanied by preparation.`,
      shadow: `The risk is that the trust alone gets asked to do the work that planning was meant to do — financial risks taken freely, with the landing left mostly to chance. If your financial life tends to work out through luck more than through preparation, that gap may be the pattern still unresolved.`,
      path: `This may shift by pairing your next financial risk with one small, concrete piece of preparation, rather than trusting the outcome entirely to optimism. You are allowed to keep the faith and also make the plan. What would trusting-with-a-spreadsheet look like for you this quarter?`,
      positive: `Your spontaneous trust that money will work out hasn't changed — that openness and belief were always genuine. What's different is that you now pair your next financial risk with one small, concrete piece of preparation, rather than trusting the outcome entirely to optimism. That preparation is what backs the trust with something solid.`,
      negative: `Your financial optimism is completely real, and it keeps asking trust alone to do the work planning was meant to do, risks taken freely with the landing left to chance. That trusting-without-planning isn't faith. It's an outcome still dependent on luck, still waiting for the plan to join the belief.`,
    },

    // ── 1 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '1_MEP': {
      heading: `Inherited, Not Invented`,
      why: `Your money entry point reflects a genuine, carried-over competence at starting ventures from scratch — earning through initiation, launching, building something new where nothing existed before. The Magician sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating the same old pattern alongside the competence — initiating a promising professional venture and then moving to the next before this one has actually paid off. If your career shows a string of strong starts without matching follow-through, that carried-over pattern may be worth addressing directly.`,
      path: `This may shift by choosing one current professional venture and deliberately staying with it well past the exciting starting phase. You are allowed to claim launching as a lineage skill, not a fluke. What would you start next if you treated beginning-from-nothing as your birthright?`,
      positive: `Your inherited competence at launching from nothing hasn't changed — that entry point was always real and well-practiced. What's different is that you now choose one current venture and deliberately stay with it well past the exciting starting phase. That staying is what finally lets the competence compound into growth.`,
      negative: `Your competence at starting ventures is completely real, and it keeps repeating the old pattern of moving to the next before this one has paid off. That moving isn't ambition. It's a career still waiting for one start to actually be followed through.`,
    },

    // ── 2 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '2_MEP': {
      heading: `Insight Inherited`,
      why: `Your money entry point reflects a genuine, carried-over competence in intuitive, discerning, or advisory work — earning through insight, counsel, or a quiet read on situations others find opaque. The High Priestess sits at your Money Entry Point, meaning your inner experience here is real and well-practiced, not a skill you're building for the first time.`,
      shadow: `The risk is repeating an old pattern of holding that insight back rather than offering it plainly, letting a genuinely marketable skill stay private and uncompensated. If your professional insight is often right but rarely credited or paid for directly, that old caution may be worth addressing.`,
      path: `This may shift by offering your intuitive read directly and explicitly in one professional context this week, rather than letting it stay implied. You are allowed to bill for the seeing, not just the doing. What do you routinely notice first that your work hasn't yet named as its edge?`,
      positive: `Your inherited competence at reading what others miss hasn't changed — that entry point was always real and well-practiced. What's different is that you now offer your intuitive read directly and explicitly, rather than letting it stay implied. That directness is what finally lets your career reflect its real value.`,
      negative: `Your competence at intuitive insight is completely real, and it keeps repeating the old pattern of holding it back rather than offering it plainly. That holding back isn't discretion. It's a career still waiting for the seeing to be billed, not just the doing.`,
    },

    // ── 3 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '3_MEP': {
      heading: `Empire From Instinct`,
      why: `Your money entry point carries real, inherited competence in nurturing and multiplying resources — the Empress in you knows how to delegate instead of carrying everything alone, and that's exactly what turns a small operation into an empire, whether that empire is a kitchen or a country. Professions touching beauty, hospitality, care, and cultivation — design, food, wellness, education, women- and family-centered work — tend to be where this instinct actually pays.`,
      shadow: `The risk is applying pressure instead of invitation: harshness, a quick temper, an inability to compromise or negotiate, which shuts down the very collaboration this abundance depends on.`,
      path: `This may shift by delegating one task you've been holding onto solely, this week, and letting someone else's contribution actually count toward the whole. You are allowed to build the empire by sharing it, not carrying it alone. What piece of your work is ready to be handed to someone else's capable hands?`,
      positive: `Your inherited competence in nurturing and multiplying resources hasn't changed — that entry point was always real and well-practiced. What's different is that you now delegate one task you've been holding onto solely, and let someone else's contribution actually count. That sharing is what finally lets the empire grow past what one person can carry.`,
      negative: `Your competence in nurturing, generative work is completely real, and it keeps repeating the old pattern of pressuring instead of inviting — harshness and a quick temper standing in for negotiation. That pressure isn't strength. It's an empire still capped at what one impatient hand can hold.`,
    },

    // ── 4 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '4_MEP': {
      heading: `Order Built to Last`,
      why: `Your money entry point carries real, inherited competence in structure and control — a capacity to make a system actually hold. That instinct tends to pay through physical craft and construction, or through roles that enforce order directly: management, law, and enforcement, anywhere control and order are genuinely required.`,
      shadow: `The risk is that the same control that builds the structure turns into pressure on the people inside it — harshness, a quick temper, an inability to compromise or negotiate — until the order starts costing you the cooperation it needs to actually function.`,
      path: `This may shift by loosening your grip on one specific system this week and letting it hold without your direct pressure on the people running it. You are allowed to lead the structure without gripping it. Where might negotiation get you further this week than control would?`,
      positive: `Your inherited competence in structure and control hasn't changed — that entry point was always real and well-practiced. What's different is that you now loosen your grip on one specific system and let it hold without your direct pressure. That release is what finally lets the order include the people inside it.`,
      negative: `Your competence in building order is completely real, and it keeps repeating the old pattern of pressuring the people the structure depends on — harshness standing in for negotiation. That pressure isn't leadership. It's a structure still costing you the cooperation it actually needs.`,
    },

    // ── 5 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '5_MEP': {
      heading: `Knowledge Shared, Money Moves`,
      why: `Your money entry point carries real, inherited competence in structured, transmittable knowledge — mathematics, systems, law, finance, methodology — money moves through this competence once it's actually taught and shared, not just accumulated for yourself.`,
      shadow: `The risk is holding the knowledge back, or letting the sharing curdle into preaching instead of teaching — lecturing at people rather than actually handing them something usable.`,
      path: `This may shift by teaching one specific piece of your expertise plainly this week, without turning it into a sermon. You are allowed to be both the student and the teacher of your own knowledge. What have you learned that's ready to be handed over, not preached?`,
      positive: `Your inherited competence in structured, transmittable knowledge hasn't changed — that entry point was always real and well-practiced. What's different is that you now teach one specific piece of it plainly, instead of holding it back or preaching. That sharing is what finally lets the knowledge earn.`,
      negative: `Your competence in knowledge and systems is completely real, and it keeps repeating the old pattern of withholding it, or delivering it as a sermon instead of a lesson. That preaching isn't teaching. It's a competence still uncompensated, still waiting to actually be shared.`,
    },

    // ── 6 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '6_MEP': {
      heading: `Love Turned Into Income`,
      why: `Your money entry point carries real, inherited competence in beauty and connection — creative and relational fields, design, styling, photography, sales built on real rapport, pay specifically when the love for the work outweighs the chase for the money itself.`,
      shadow: `The risk is idealizing — refusing a real opportunity, client, or collaborator because they don't match some invented image — and underneath that, a quieter block: not believing you're worthy of the money or the recognition, so you can't actually let it land.`,
      path: `This may shift by receiving one payment, compliment, or gift this week without deflecting it. You are allowed to be paid well for work you love. What good thing have you been quietly turning down because it felt like too much?`,
      positive: `Your inherited competence in beauty and connection hasn't changed — that entry point was always real and well-practiced. What's different is that you now receive one payment or gift without deflecting it. That receiving is what finally lets the love for the work translate into abundance.`,
      negative: `Your competence in creative, relational work is completely real, and it keeps repeating the old pattern of idealizing what should count, or deflecting what's actually offered. That deflecting isn't humility. It's an abundance still turned away, still waiting to be let in.`,
    },

    // ── 7 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '7_MEP': {
      heading: `Momentum, Aimed`,
      why: `Your money entry point carries real, inherited competence in decisive movement — fields built on motion and command, logistics, transport, sports, law enforcement, leadership, pay once you name a real number and drive toward it, not just move fast in general.`,
      shadow: `The risk is that the same warrior drive that wins goals turns into scheming against whoever's in the way — pressuring or out-maneuvering competitors instead of building a team that actually wants to follow you.`,
      path: `This may shift by naming one specific financial number you're driving toward this week, instead of vague ambition, and helping one competitor rather than out-maneuvering them. You are allowed to want a number and say it out loud. What amount have you been chasing without ever actually naming?`,
      positive: `Your inherited competence in decisive movement hasn't changed — that entry point was always real and well-practiced. What's different is that you now name one specific number you're driving toward, instead of vague ambition. That naming is what finally lets the momentum arrive somewhere.`,
      negative: `Your drive toward goals is completely real, and it keeps repeating the old pattern of pressuring or scheming against whoever's in the way. That scheming isn't strategy. It's a momentum still burning fuel on rivals instead of arriving at the number.`,
    },

    // ── 8 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '8_MEP': {
      heading: `Fair in Both Directions`,
      why: `Your money entry point carries real, inherited competence in fairness — professions built on law, accounting, tax, journalism, or genuinely helping people understand cause and effect are where this instinct actually earns, because it's built to keep taking and giving in balance.`,
      shadow: `The risk is that when the balance actually tips, it doesn't register as bad luck — it registers as everyone's a thief, everything's overpriced, debts pile up, and the whole exchange starts to feel rigged against you.`,
      path: `This may shift by naming one specific cause-and-effect chain in your own finances this week — not what happened to you, but what you actually did that led here. You are allowed to give and receive in the same fair measure. Where has "everyone's taking from me" actually been a debt you haven't named yet?`,
      positive: `Your inherited competence in fairness hasn't changed — that entry point was always real and well-practiced. What's different is that you now name one real cause-and-effect chain in your own finances instead of only the ones done to you. That naming is what restores the balance you're actually built for.`,
      negative: `Your instinct for fairness is completely real, and it keeps repeating the old pattern of feeling taken from — debts, distrust, everything overpriced — without naming the actual cause on your own side of the ledger. That suppression isn't proof of unfairness. It's a balance still waiting to be traced honestly.`,
    },

    // ── 9 in MONEY ENTRY POINT (Money Channel) ──────────────────────────────
    '9_MEP': {
      heading: `Depth Spent on Yourself`,
      why: `Your money entry point carries real, inherited competence in analysis and depth — translation, research, science, writing, IT, the kind of expertise built through solitary study — money flows through sharing that knowledge with the world, not just accumulating it privately.`,
      shadow: `The risk is a quiet intellectual pride — looking down on the material world or on people who know less — paired with an excessive frugality toward yourself, choosing the cheapest option even when you can afford better, which drains the very energy the expertise runs on.`,
      path: `This may shift by spending on yourself, once, with the same generosity you'd extend to sharing knowledge — no discount, no cheapest option by default. You are allowed to be both deeply knowledgeable and genuinely well cared for. What have you been denying yourself out of thrift rather than actual need?`,
      positive: `Your inherited competence in depth and analysis hasn't changed — that entry point was always real and well-practiced. What's different is that you now spend on yourself with real generosity instead of defaulting to the cheapest option. That generosity is what lets the flow of money actually include you.`,
      negative: `Your depth of knowledge is completely real, and it keeps repeating the old pattern of excessive frugality toward yourself, choosing less than you can afford. That thrift isn't wisdom. It's a flow of money still excluding the one person the expertise is supposed to serve.`,
    },

    // ── 10 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '10_MEP': {
      heading: `Ease, Once Allowed`,
      why: `Your money entry point carries real, inherited competence in flow and support — not the leader out front, but the deputy, the executor, the one who makes any team or project actually run, which means money genuinely does come easily once the work is right.`,
      shadow: `The risk is laziness masquerading as ease — but the deeper block is usually the opposite: an inability to actually relax and enjoy what's already flowing, so the ease this energy is built for never gets to be felt.`,
      path: `This may shift by taking one afternoon this week purely for pleasure, with no productive justification attached. You are allowed to let money come easily without needing to have earned the rest first. What would it look like to actually enjoy what's already arrived?`,
      positive: `Your inherited competence in flow and support hasn't changed — that entry point was always real and well-practiced. What's different is that you now let yourself actually relax and enjoy what's already arrived, instead of treating ease as something to earn first. That enjoyment is what keeps the flow moving.`,
      negative: `Your capacity to support and flow with any team is completely real, and it keeps repeating the old pattern of struggling to relax, unable to let the ease register as real. That struggle isn't diligence. It's a flow still waiting for you to actually receive it.`,
    },

    // ── 11 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '11_MEP': {
      heading: `Strength That Spares the Body`,
      why: `Your money entry point carries real, inherited competence in tireless, physical strength — athletics, rescue work, building, repair, enterprise leadership, anywhere real endurance and the ability to manage people through sheer effort are required.`,
      shadow: `The risk is workaholism — pressure turned inward instead of outward, striving so hard toward a goal that nothing else registers — and the block that follows is often illness, the body forcing a stop the mind wouldn't choose on its own.`,
      path: `This may shift by building one real rest day into this week before your body demands it. You are allowed to be strong without needing to prove it without pause. What would it cost you to stop one day before you absolutely have to?`,
      positive: `Your inherited competence in tireless strength hasn't changed — that entry point was always real and well-practiced. What's different is that you now build real rest into the week before your body demands it. That pacing is what keeps the financial flow from being cut off by illness.`,
      negative: `Your capacity for tireless work is completely real, and it keeps repeating the old pattern of workaholism, pressure turned entirely inward. That pressure isn't dedication. It's a flow still one illness away from being cut off completely.`,
    },

    // ── 12 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '12_MEP': {
      heading: `Charging for the Care You Give`,
      why: `Your money entry point carries real, inherited competence in seeing what others miss and caring for people directly — creative work, social work, medicine, education, work with animals or the vulnerable, wherever a genuinely different vision serves someone else.`,
      shadow: `The risk is the victim mentality — serving until feedback stops arriving and then feeling unseen — paired with a refusal to actually charge for the work, working free or near-free and then resenting the lack of appreciation that follows.`,
      path: `This may shift by naming a real price for one piece of service you've been giving away or undercharging for, this week. You are allowed to say no, and to charge, without it undoing the care. What service of yours has been free for so long that its value has gone quiet?`,
      positive: `Your inherited competence in seeing differently and caring for others hasn't changed — that entry point was always real and well-practiced. What's different is that you now name a real price for one piece of service you'd been giving away. That charging is what lets the exchange of energy actually complete.`,
      negative: `Your capacity for service is completely real, and it keeps repeating the old pattern of working for free and then resenting the silence that follows. That resentment isn't proof of exploitation. It's an exchange still incomplete, still waiting for a price to be named.`,
    },

    // ── 13 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '13_MEP': {
      heading: `Willing to Let It End`,
      why: `Your money entry point carries real, inherited competence in the threshold professions — the ones that live between life and death, medicine, emergency services, law enforcement, work with the newly born or the gravely ill — a genuine comfort with endings that most people flinch from.`,
      shadow: `The risk is stagnation — staying in a role or approach past the point it's still teaching you anything, because change itself feels like the very endings this competence is supposed to be comfortable with.`,
      path: `This may shift by naming one specific part of your current work that's gone stagnant, and deliberately changing it this month, even in a small way. You are allowed to let a version of your career end so a truer one can begin. What in your work has quietly finished without your permission yet?`,
      positive: `Your inherited competence at thresholds hasn't changed — that entry point was always real and well-practiced. What's different is that you now name one stagnant part of your work and deliberately change it. That willingness to end something is what finally lets the career keep evolving.`,
      negative: `Your comfort with endings and thresholds is completely real, and it keeps repeating the old pattern of staying in a stagnant role anyway, as if the competence didn't apply to your own career. That stagnation isn't stability. It's a change still overdue, still waiting for you to apply the gift to yourself.`,
    },

    // ── 14 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '14_MEP': {
      heading: `Creativity, Followed`,
      why: `Your money entry point carries real, inherited competence in intuitive, creative expression — art, healing, work touching water and nature, the kind of work that requires you to keep opening your soul rather than performing a role, and that pays specifically when compassion stays part of the work.`,
      shadow: `The risk is that the constant tests of whether you're truly engaged, rather than just going through the motions, get answered by drifting toward what's safe instead of what your soul actually wants, until the compassion, and the flow, quietly dries up.`,
      path: `This may shift by choosing one piece of your current work and asking honestly whether your heart is actually in it, then acting on the answer. You are allowed to follow your heart even when it costs you the safer choice. Where has compassion gone missing from work that used to have it?`,
      positive: `Your inherited competence in intuitive, creative expression hasn't changed — that entry point was always real and well-practiced. What's different is that you now ask honestly whether your heart is in a piece of your work, and act on the answer. That honesty is what keeps the financial flow open.`,
      negative: `Your creative, intuitive gift is completely real, and it keeps repeating the old pattern of drifting toward the safe choice instead of what your soul actually wants. That drifting isn't practicality. It's a flow still closing, still waiting for compassion to return to the work.`,
    },

    // ── 15 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '15_MEP': {
      heading: `How You Take It Matters`,
      why: `Your money entry point carries real, inherited competence in significant material power — this energy is capable of bringing serious money into your life, through fields that manage people, resources, or high stakes directly: business, finance, banking, casinos, public relations.`,
      shadow: `The risk is genuinely large, not a metaphor: money obtained through deception, broken agreements, or taking from others invites exactly the kind of reversal this energy is known for, the same force that gave it being fully capable of taking it back.`,
      path: `This may shift by naming, honestly, one financial decision you're currently facing where the easy path and the honest path diverge — and choosing the honest one, even if it's smaller. You are allowed to want significant money and still insist it arrive cleanly. Where is a shortcut currently tempting you toward something you'd regret?`,
      positive: `Your capacity for significant material power hasn't changed — that entry point was always real and well-practiced. What's different is that you now choose the honest path where it diverges from the easy one, even when it's smaller. That choice is what lets the money actually stay once it arrives.`,
      negative: `Your capacity to bring in real money is completely real, and it keeps being tested by the easy, dishonest shortcut. That shortcut isn't cleverness. It's a fortune still at risk, still waiting for the test of integrity it hasn't yet passed.`,
    },

    // ── 16 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '16_MEP': {
      heading: `Rebuilding, Not Patching`,
      why: `Your money entry point carries real, inherited competence in total transformation — builders, architects, crisis managers, directors, anyone with the energy to destroy what's outdated and build something genuinely new from the ground up.`,
      shadow: `The risk is entanglement in the material world for its own sake — wanting wealth becomes the whole focus rather than one part of a fuller life, and when money is missing, it's often because that entanglement, not fate, is what's actually blocking it.`,
      path: `This may shift by naming one area of your life outside of money that's gone neglected while you chased financial goals, and giving it real attention this week. You are allowed to want material wealth without it being the only thing you want. What non-financial part of your life is asking to matter again?`,
      positive: `Your inherited competence in total transformation hasn't changed — that entry point was always real and well-practiced. What's different is that you now give real attention to a part of your life outside of money that had gone neglected. That balance is what actually lets the rebuilding hold.`,
      negative: `Your capacity to destroy the outdated and build anew is completely real, and it keeps getting entangled in material pursuit for its own sake. That entanglement isn't ambition. It's a rebuilding still incomplete, still waiting for the rest of your life to be let back in.`,
    },

    // ── 17 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '17_MEP': {
      heading: `Creativity, Seen`,
      why: `Your money entry point carries real, inherited competence in creative visibility — dance, design, acting, art, journalism, coaching, healing — the ability to fold creativity directly into how you earn, realizing yourself both financially and artistically at once.`,
      shadow: `The risk is pride — once you start believing your creativity is the only worthwhile version and everyone else's is lesser, recognition tends to quietly diminish, as if the test exists specifically to correct that belief.`,
      path: `This may shift by genuinely appreciating one other person's creative work this week, out loud, without needing to rank it against your own. You are allowed to shine without needing to be the only light. Whose creative work have you been quietly dismissing that actually deserves your respect?`,
      positive: `Your inherited competence in creative visibility hasn't changed — that entry point was always real and well-practiced. What's different is that you now genuinely appreciate someone else's creative work out loud, instead of ranking it against your own. That generosity is what keeps recognition flowing toward you too.`,
      negative: `Your creative gift is completely real, and it keeps repeating the old pattern of pride, dismissing others' work as lesser. That dismissing isn't discernment. It's a recognition still diminishing, still waiting for the pride to loosen.`,
    },

    // ── 18 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '18_MEP': {
      heading: `Vision Made Real`,
      why: `Your money entry point carries real, inherited competence in visualization and the subconscious — psychology, illusion, photography, design, bioenergy work, anything that turns an internal image into something others can see and feel.`,
      shadow: `The risk is fear itself, specifically the fear of poverty — because this energy is so genuinely capable of manifesting what it holds, a fear held tightly enough can materialize just as easily as a vision can.`,
      path: `This may shift by naming, honestly, one financial fear you've been carrying and replacing it deliberately with one specific image of what you actually want instead. You are allowed to trust your visions more than your fears. What fear have you been unknowingly feeding the same energy you'd rather spend on a vision?`,
      positive: `Your inherited competence in visualization hasn't changed — that entry point was always real and well-practiced. What's different is that you now replace a carried financial fear with a deliberate, specific image of what you actually want. That redirection is what lets the gift manifest abundance instead of scarcity.`,
      negative: `Your capacity to manifest what you visualize is completely real, and it keeps being aimed, unconsciously, at fear of poverty instead of what you actually want. That fear isn't caution. It's the same gift, still pointed at the wrong picture.`,
    },

    // ── 19 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '19_MEP': {
      heading: `Light, Shared at Scale`,
      why: `Your money entry point carries real, inherited competence in illuminating people at scale — public speaking, leadership, the arts, sales, anywhere the ability to draw a crowd and make them feel good is the literal asset, and the flow only increases the more generously it's shared.`,
      shadow: `The risk is guilt — feeling wrong for doing well while others struggle — which curdles into nitpicking and hypercontrol over others, or a quiet pride that needs constant confirmation.`,
      path: `This may shift by creating one real opportunity for someone else this week — a job, a referral, a share of the spotlight — instead of managing your guilt about having more. You are allowed to shine brightly and still be generous, not either-or. Who could you actually bring up with you instead of feeling guilty in front of?`,
      positive: `Your inherited competence in illuminating people at scale hasn't changed — that entry point was always real and well-practiced. What's different is that you now create one real opportunity for someone else instead of managing guilt privately. That generosity is what multiplies the flow instead of just holding it.`,
      negative: `Your gift for drawing people toward the light you carry is completely real, and it keeps curdling into guilt, hypercontrol, or a quiet need for pride to be confirmed. That control isn't leadership. It's a flow still contracted, still waiting for genuine generosity to open it back up.`,
    },

    // ── 20 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '20_MEP': {
      heading: `Judgment Released, Money Opens`,
      why: `Your money entry point carries real, inherited competence in transmission — family business, communication, information passed hand to hand — and it opens fully once you actually examine what your parents believed about money instead of just inheriting the belief unexamined.`,
      shadow: `The risk is exactly that: an unexamined inherited belief, often something like "money is only obtained through hard work," running quietly underneath your own choices, made worse by judging your parents for having it, which blocks the flow further rather than freeing it.`,
      path: `This may shift by naming one specific belief about money you can trace directly to a parent, and asking whether it's actually true for you now. You are allowed to release the belief without needing to blame the person who gave it to you. What financial rule of theirs have you been obeying without ever examining it?`,
      positive: `Your inherited competence in transmission hasn't changed — that entry point was always real and well-practiced. What's different is that you now name one inherited belief about money and examine whether it's actually true for you. That examination, done without blame, is what finally lets the flow open.`,
      negative: `Your capacity to pass things forward is completely real, and it keeps running on an unexamined parental belief about money, made heavier by judging the parent who gave it. That judgment isn't clarity. It's a flow still blocked, still waiting to be forgiven loose.`,
    },

    // ── 21 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '21_MEP': {
      heading: `Reach Beyond Borders`,
      why: `Your money entry point carries real, inherited competence in scale and reach — this energy earns through setting genuinely significant financial goals and letting the work travel: diplomacy, journalism, human rights, geography, anywhere the horizon is allowed to actually expand.`,
      shadow: `The risk is compromising that reach for a quick or easy income — work whose real cost, to health or to conscience, contradicts the expansive, peacekeeping nature this competence is actually built for.`,
      path: `This may shift by naming one financial goal that's genuinely large, not modest by habit, and taking one real step toward it this month. You are allowed to want a horizon this wide and go get it. What border, literal or professional, have you been staying inside out of habit rather than necessity?`,
      positive: `Your inherited competence in scale and reach hasn't changed — that entry point was always real and well-practiced. What's different is that you now name a genuinely large financial goal instead of a modest one, and take one real step toward it. That scale is what the competence was actually built for.`,
      negative: `Your capacity for reach and expansion is completely real, and it keeps settling for income that's easy but costly — to health, to conscience, to the wide horizon this energy actually wants. That settling isn't practicality. It's a reach still narrowed, still waiting to be let out to its real size.`,
    },

    // ── 22 in MONEY ENTRY POINT (Money Channel) ─────────────────────────────
    '22_MEP': {
      heading: `Freedom, Protected`,
      why: `Your money entry point carries real, inherited competence in financial independence itself — not a fixed schedule or a boss, but passive income that exceeds your expenses, results-based work with no boundaries imposed from outside.`,
      shadow: `The risk is testing that freedom constantly without ever building the passive structure that would actually secure it — welcoming money in easily, then letting it go just as easily, so independence stays a feeling instead of becoming a fact.`,
      path: `This may shift by building one small piece of passive income this month, however modest, instead of relying entirely on active results. You are allowed to want total freedom and still build the floor underneath it. What fixed structure have you been avoiding that would actually protect the freedom you want?`,
      positive: `Your inherited competence in financial independence hasn't changed — that entry point was always real and well-practiced. What's different is that you now build one small piece of passive income instead of relying entirely on active results. That structure is what turns the feeling of freedom into an actual fact.`,
      negative: `Your instinct for independence is completely real, and it keeps testing the freedom without ever building the passive structure underneath it. That untested freedom isn't liberation. It's a fortune still passing through your hands, still waiting for a floor to actually hold it.`,
    },

    // ── Career Paths (Money Channel — Best Career Paths For Each Arcana) ──
    '1_CAREER': {
      heading: `Starting Things Yourself`,
      why: `Your career fit runs through initiative and origination — founding, launching, leading from the front: entrepreneur or startup founder, project manager, sales or marketing strategist, public speaker, business coach. The same energy shows up in hands-on craft too — jewellers, tailors, wood carvers, sculptors, blacksmiths — and in inventors, scientists, and practitioners of energy work: bioenergetic therapists, healers, anyone working with forces most people can't see. What ties them together isn't the trade, it's generating something from nothing.`,
      shadow: `The risk is taking a role built around someone else's system instead of your own initiative — the fit fails not because you lack skill, but because the container gives you nothing to originate.`,
      path: `Try naming one role or venture where you'd actually be the one starting things, not executing someone else's plan, and taking one real step toward it this month. You are allowed to want to lead from day one, not earn your way there. What would you build if the job description let you invent it?`,
      positive: `Your fit for initiative and origination hasn't changed — that pull to start things was always real. What's different is that you now name one role or venture where you'd actually be the one starting things, and take a real step toward it. That step is what finally lets the fit be tested.`,
      negative: `Your pull to originate is completely real, and it keeps landing in roles built around someone else's system instead of your own initiative. That landing isn't a skill problem. It's a fit still untested, still waiting for a container that actually lets you start things.`,
    },

    '2_CAREER': {
      heading: `Sensing Before Proving`,
      why: `Your career fit runs through depth and perception — psychologist or therapist, numerologist or astrologer, analyst or researcher, consultant or advisor, writer or editor. The same read-what's-underneath instinct fits diplomacy, medicine and healing, the natural sciences, meteorology and astronomy, even acting — and, less obviously, investigation: detective work, surveillance, forensics, anywhere the job is to notice what isn't being said.`,
      shadow: `The risk is taking a role that only rewards visible, provable output, leaving your real gift for reading what's underneath permanently uncredited.`,
      path: `Try naming one field where your intuition would actually be the qualification, not a hidden bonus, and researching one real path into it this month. You are allowed to be hired for what you sense, not only what you can prove. Where has your read on a situation already been quietly right?`,
      positive: `Your fit for depth and perception hasn't changed — that gift for sensing what's underneath was always real. What's different is that you now name one field where intuition is the actual qualification, and research a real path into it. That naming is what finally lets the gift be credited.`,
      negative: `Your gift for perception is completely real, and it keeps landing in roles that only reward provable output. That mismatch isn't a lack of skill. It's a fit still uncredited, still waiting for a field that actually pays for what you sense.`,
    },

    '3_CAREER': {
      heading: `Creating and Cultivating`,
      why: `Your career fit runs through generativity and beauty — designer (graphic, interior, fashion), the beauty industry, content creation, art direction, a business built around and for women. That same instinct for cultivation runs hospitality and care at scale too: house and estate management, nursery and beauty-salon direction, restaurant and kitchen leadership, chefs and confectioners — anywhere growth, craft, and genuine nurturing are the actual work.`,
      shadow: `The risk is taking a role that treats your creative or nurturing output as a hobby rather than a real profession, discounted the moment it starts to feel effortless.`,
      path: `Try pricing or pitching one piece of your creative work this month as an actual profession, not a side project. You are allowed to make a living from what comes naturally. Where has 'effortless' been quietly read as 'not serious work'?`,
      positive: `Your fit for generativity and beauty hasn't changed — that craft was always real work. What's different is that you now price or pitch one piece of it as an actual profession, not a side project. That pricing is what finally lets the craft be taken seriously.`,
      negative: `Your creative, nurturing gift is completely real, and it keeps getting treated as a hobby the moment it feels effortless. That discounting isn't accuracy. It's a fit still sidelined, still waiting to be priced as the real profession it is.`,
    },

    '4_CAREER': {
      heading: `Building Structure That Holds`,
      why: `Your career fit runs through ownership and command — business owner, executive or CEO, administrator or manager, leadership within government or corporate structure, real estate development. That same capacity for order shows up in construction and land: supervisors, architects, farm and estate management — and in hands-on mechanical control: machine operators, crane operators, mechanics — anywhere you actually get to build or run the system, not just staff it.`,
      shadow: `The risk is taking a subordinate role inside someone else's structure, where your genuine capacity for order gets boxed rather than used.`,
      path: `Try naming one place in your current work where you could actually own a system instead of just running it, and asking for that ownership directly. You are allowed to want to build the structure, not just maintain it. What would you organize if the authority were already yours?`,
      positive: `Your fit for ownership and command hasn't changed — that capacity for order was always real. What's different is that you now name one system you could actually own, and ask for that ownership directly. That asking is what finally lets the capacity be used instead of boxed.`,
      negative: `Your capacity for structure is completely real, and it keeps getting boxed inside a subordinate role. That boxing isn't a lack of readiness. It's a fit still unused, still waiting for the authority to actually be requested.`,
    },

    '5_CAREER': {
      heading: `Teaching What You Know`,
      why: `Your career fit runs through transmission — teacher or mentor, spiritual guide or coach, HR or consulting, trainer or lecturer, a business built around education itself. The same structured-knowledge instinct fits law directly (attorney, judge), finance and the stock market, real estate, programming and IT, and family counseling — anywhere passing a system of knowledge forward, not just holding it, is the literal job.`,
      shadow: `The risk is staying a permanent student, collecting credentials in a field that never actually asks you to teach, so the fit never gets tested.`,
      path: `Try teaching or mentoring one person this month in something you already know well. You are allowed to teach before you feel like the authority. What do you already know that someone else needs?`,
      positive: `Your fit for transmission hasn't changed — that pull to pass knowledge forward was always real. What's different is that you now teach or mentor one person in something you already know well. That teaching is what finally lets the fit get tested.`,
      negative: `Your pull toward teaching is completely real, and it keeps staying theoretical, credentials collected in a field that never actually asks you to teach. That collecting isn't preparation. It's a fit still untested, still waiting for one real student.`,
    },

    '6_CAREER': {
      heading: `People, Chosen Well`,
      why: `Your career fit runs through relationship — relationship coaching, HR or recruiting, sales management, brand partnerships, PR and communications. The same read-people-well instinct fits performance and hosting directly: concert and festival hosts, toastmasters, conductors, DJs, film directors — and beauty and design work built on client rapport: stylists, makeup artists, fashion designers — anywhere reading and choosing well between people is the actual product.`,
      shadow: `The risk is taking a role that treats people as a checklist rather than a relationship, flattening the exact skill that makes you good at this.`,
      path: `Try naming one role where the job is explicitly about people, not just processing them, and applying or pitching yourself for it this month. You are allowed to make relationship-building the whole job, not a side skill. Where has your read on people already produced something no process could?`,
      positive: `Your fit for reading people well hasn't changed — that skill was always real. What's different is that you now name one role where people are explicitly the job, not a checklist, and pitch yourself for it. That naming is what finally lets the skill be the whole job.`,
      negative: `Your read on people is completely real, and it keeps getting flattened into checklist work that doesn't actually use it. That flattening isn't a fit problem with you. It's a role still mismatched, still waiting for people to be the actual product.`,
    },

    '7_CAREER': {
      heading: `Motion With a Finish Line`,
      why: `Your career fit runs through movement and results — logistics or transportation, the sports industry, event management, travel, operations. Specifically: long-distance drivers, couriers, tour guides, martial arts and fitness coaching, military and law enforcement at any rank — anywhere the job is literally to get something, or someone, across a finish line.`,
      shadow: `The risk is a desk role with no visible destination, where drive with nowhere to point turns into restlessness instead of results.`,
      path: `Try naming one role with a visible finish line — a launch, a season, a delivery — and moving toward it this month. You are allowed to need momentum to feel like yourself at work. What destination would justify the drive you already have?`,
      positive: `Your fit for movement and results hasn't changed — that drive toward a finish line was always real. What's different is that you now name one role with a visible destination and move toward it. That destination is what finally gives the drive somewhere to go.`,
      negative: `Your drive is completely real, and it keeps landing in roles with no visible finish line. That mismatch isn't restlessness for its own sake. It's a fit still pointless, still waiting for a destination worth the momentum.`,
    },

    '8_CAREER': {
      heading: `Fairness Made Concrete`,
      why: `Your career fit runs through balance and accountability — law or legal consulting, accounting or auditing, financial analysis, compliance, contract management. Less expectedly, the same fairness instinct fits karmic and esoteric work directly — fortune-telling, destiny improvement, karmic healing — anywhere accuracy and fairness, whether in a ledger or a life, are the literal job.`,
      shadow: `The risk is a role where fairness is expected but never actually rewarded, so the exact skill that makes you good at this goes uncompensated.`,
      path: `Try naming one field where integrity is a paid asset, not just an expectation, and researching a real path into it. You are allowed to profit from being the honest one. Where has fairness already been your quiet advantage?`,
      positive: `Your fit for fairness hasn't changed — that accuracy was always real strength. What's different is that you now name one field where integrity is actually paid, not just expected, and research a real path into it. That naming is what finally lets fairness be compensated.`,
      negative: `Your sense of fairness is completely real, and it keeps landing in roles where it's expected but never rewarded. That expecting-without-paying isn't fair. It's a fit still uncompensated, still waiting for a field that actually pays for integrity.`,
    },

    '9_CAREER': {
      heading: `Depth Over Breadth`,
      why: `Your career fit runs through specialized mastery — niche consulting, strategic analysis, therapeutic or healing work, research, a solo practice. This same depth-over-breadth instinct runs surprisingly wide: archaeology, linguistics, veterinary science, beekeeping and gardening, even monastic or priestly life — anywhere going deep in one area, largely alone, matters more than a wide network.`,
      shadow: `The risk is a role that demands constant networking and visibility, pulling you away from exactly the solitary depth that's your real asset.`,
      path: `Try naming one narrow area you could go deeper in this year, and one way to make that depth visible to the people who'd pay for it. You are allowed to specialize instead of spreading thin. What have you already gone deeper into than almost anyone around you?`,
      positive: `Your fit for specialized depth hasn't changed — that mastery was always real. What's different is that you now name one narrow area to go deeper in, and one way to make it visible. That visibility is what finally lets the depth be found and paid for.`,
      negative: `Your depth is completely real, and it keeps getting pulled thin by roles demanding constant networking instead of mastery. That pulling isn't growth. It's a fit still diluted, still waiting for depth to be allowed to be the whole job.`,
    },

    '10_CAREER': {
      heading: `Adapting Faster Than Most`,
      why: `Your career fit runs through flexibility — marketing, trading and investments, business development, tourism, freelance work across multiple projects. That same instinct leans hard into team and motion work too: flight attendants, traffic controllers, telecommunications, team sports, restaurant and hospitality service, choirs and dance groups — anywhere reading and riding a changing situation alongside other people is the actual skill.`,
      shadow: `The risk is a rigid, single-track role that punishes exactly the adaptability that's your real strength, leaving you bored or stuck.`,
      path: `Try naming one part of your work you could deliberately diversify or make more freelance or project-based this year. You are allowed to build a career that moves instead of staying still. Where has adapting quickly already paid off for you?`,
      positive: `Your fit for adaptability hasn't changed — that flexibility was always real strength. What's different is that you now deliberately diversify or make one part of your work more project-based. That diversifying is what finally lets the adaptability be used.`,
      negative: `Your adaptability is completely real, and it keeps getting punished by a rigid, single-track role. That punishing isn't discipline. It's a fit still stuck, still waiting for a structure that actually moves with you.`,
    },

    '11_CAREER': {
      heading: `Presence as the Product`,
      why: `Your career fit runs through presence — coaching or motivating others, building a personal brand, fitness and wellness, performing or public-figure visibility, leadership roles that depend on presence as much as position. The same tireless-capacity instinct fits rescue and security work directly — lifeguard, Federal Rescue Services, security — and energetic healing, anywhere real physical or energetic force is genuinely required.`,
      shadow: `The risk is a background role that asks you to shrink your presence rather than use it, spending charisma where it's never actually the point.`,
      path: `Try naming one role or platform where your presence would be the explicit asset, not a bonus, and taking one visible step toward it this month. You are allowed to count your presence as real labor. What rooms change when you walk in — and are you being paid for that yet?`,
      positive: `Your fit for presence hasn't changed — that charisma was always a real asset. What's different is that you now name one role where presence is the explicit point, and take a visible step toward it. That step is what finally lets the presence be compensated.`,
      negative: `Your presence is completely real, and it keeps getting spent in background roles that ask you to shrink it. That shrinking isn't humility. It's a fit still uncompensated, still waiting for a room where your presence is actually the job.`,
    },

    '12_CAREER': {
      heading: `Sustained Service Over Speed`,
      why: `Your career fit runs through sustained service — counseling or psychology, medical or caregiving professions, social work, spiritual service, long-term transformational projects. Specifically: orphanages, retirement funds, disability services, animal and nature protection, homeopathic and herbal medicine — anywhere depth of presence with someone vulnerable matters more than speed of result.`,
      shadow: `The risk is a fast-turnaround role that never lets you actually stay with anyone long enough to do this work the way you're built for.`,
      path: `Try naming one field of sustained service you've been drawn to, and taking one real step — a course, a conversation, an application — toward it this month. You are allowed to build a career around staying, not just fixing quickly. Whose slow transformation would you want to be part of?`,
      positive: `Your fit for sustained service hasn't changed — that capacity to stay was always real. What's different is that you now name one field of sustained service and take a real step toward it. That step is what finally lets the capacity find its right pace.`,
      negative: `Your capacity to stay with people is completely real, and it keeps getting rushed by fast-turnaround roles. That rushing isn't efficiency. It's a fit still mismatched, still waiting for work paced to match the depth you actually bring.`,
    },

    '13_CAREER': {
      heading: `Guiding Real Endings`,
      why: `Your career fit runs through transformation — crisis management, psychotherapy, transformation coaching, medical work centered on renewal (surgery, rehabilitation), change management. It also runs through literal thresholds: obstetrics, forensic science, emergency medicine, firefighting, extreme sports — anywhere guiding an ending into a genuine new beginning, sometimes literally, is the job.`,
      shadow: `The risk is a role built entirely around maintaining the status quo, where your real gift for guiding change never gets used.`,
      path: `Try naming one field built around transformation rather than maintenance, and researching a real path into it this month. You are allowed to build a career around change, not stability for its own sake. What ending have you already guided someone else through?`,
      positive: `Your fit for guiding transformation hasn't changed — that comfort with endings was always real. What's different is that you now name one field built around transformation and research a real path into it. That naming is what finally lets the gift be used.`,
      negative: `Your gift for guiding change is completely real, and it keeps sitting unused inside a role built around maintaining the status quo. That sitting isn't patience. It's a fit still wasted, still waiting for work that actually needs an ending guided.`,
    },

    '14_CAREER': {
      heading: `Integration as a Career`,
      why: `Your career fit runs through integration — holistic healing, nutrition or wellness coaching, mediation, integrative consulting, lifestyle consulting. The blending instinct gets unusually specific too: perfumery, sauna and bath therapy, museum curation, epidemiological and lab work alongside theatre, dance, and music — anywhere combining disparate elements into something whole, physically or artistically, is the actual craft.`,
      shadow: `The risk is a narrowly specialized role that forces you to leave half your actual skill set at the door.`,
      path: `Try naming the two or three skills you keep being told to pick between, and researching one field where they're actually meant to combine. You are allowed to be the blend the industry didn't have a title for yet. Which of your combined skills is actually the product?`,
      positive: `Your fit for integration hasn't changed — that ability to blend was always real. What's different is that you now name the skills you keep being told to pick between, and research a field where they're meant to combine. That naming is what finally lets the blend be the product.`,
      negative: `Your ability to integrate is completely real, and it keeps getting forced into narrow roles that leave half your skill set at the door. That narrowing isn't focus. It's a fit still incomplete, still waiting for a field built for the blend.`,
    },

    '15_CAREER': {
      heading: `Understanding What Drives People`,
      why: `Your career fit runs through material power — business and finance, sales and negotiation, the entertainment industry, the luxury market, work built around understanding what compels people materially and psychologically. It extends into gaming and recreational business, brokerage, and addiction or narcology work directly — anywhere serious money and serious temptation sit in the same room.`,
      shadow: `The risk is a role where that understanding gets used to grip control over people rather than serve a genuine transaction, costing trust in the long run.`,
      path: `Try naming one field where your read on power and money could serve a genuinely good deal, not just a personal edge, and researching a real path into it. You are allowed to understand leverage without being owned by it. What could your honest read on influence build if you aimed it somewhere clean?`,
      positive: `Your fit for understanding material power hasn't changed — that read was always real. What's different is that you now name one field where it could serve a genuinely good deal, not just a personal edge, and research a real path into it. That aiming is what keeps the gift clean.`,
      negative: `Your read on material power is completely real, and it keeps being tempted toward gripping control rather than serving a genuine deal. That gripping isn't mastery. It's a fit still corroding trust, still waiting to be aimed somewhere clean.`,
    },

    '16_CAREER': {
      heading: `Rebuilding What's Broken`,
      why: `Your career fit runs through disruption and reconstruction — engineering or architecture, IT and cybersecurity, crisis and risk management, construction, system transformation. It gets vivid and literal too: demolition, mining, atomic science, steeplejacking, criminal investigation — anywhere reorganizing, or literally taking apart, a failing structure is the actual job.`,
      shadow: `The risk is a role that asks you to patch things quietly rather than actually rebuild them, leaving your real gift for structural change unused.`,
      path: `Try naming one system, at work or elsewhere, that's genuinely due for a rebuild rather than another patch, and proposing the real fix. You are allowed to say the structure is failing before it's polite. What collapse have you already seen coming that no one else named yet?`,
      positive: `Your fit for rebuilding hasn't changed — that gift for structural change was always real. What's different is that you now name one system due for a rebuild and propose the real fix, instead of another patch. That proposing is what finally lets the gift be used.`,
      negative: `Your gift for structural change is completely real, and it keeps being asked to patch things quietly instead of actually rebuilding them. That patching isn't tact. It's a fit still unused, still waiting for permission to name the collapse out loud.`,
    },

    '17_CAREER': {
      heading: `Seen While You Create`,
      why: `Your career fit runs through visible creativity — blogging or influencing, art and creative work released publicly, media and online projects, social initiatives, personal-brand monetization. It reaches into an unexpectedly wide range within that same visibility: polar research, astronomy, maritime and agricultural work, radio and TV hosting — anywhere hope and inspiration, shared publicly, are the literal product.`,
      shadow: `The risk is keeping the creative work private and unmonetized, waiting for it to be discovered instead of actively offering it.`,
      path: `Try publishing or pitching one piece of your creative work this month at the size it's actually at, not the size you wish it were. You are allowed to be seen before you feel fully ready. What would you release if visibility paid what it actually pays?`,
      positive: `Your fit for visible creativity hasn't changed — that gift for inspiring people was always real. What's different is that you now publish or pitch one piece of work at the size it's actually at. That releasing is what finally lets the gift be found.`,
      negative: `Your creative gift is completely real, and it keeps staying private, waiting to be discovered instead of actively offered. That waiting isn't humility. It's a fit still unmonetized, still waiting for the work to actually be released.`,
    },

    '18_CAREER': {
      heading: `Sensed, Not Always Proven`,
      why: `Your career fit runs through the intuitive and the felt — psychology or therapeutic work, filmmaking or visual art, photography, esoteric practice, creative healing professions. Specifically: fantasy and fairy-tale writing, puppetry, clairvoyance and soothsaying, orientalist and linguistic studies — and, less expectedly, criminal investigation and interpretation work — anywhere reading an unspoken undercurrent, real or fictional, is the actual skill.`,
      shadow: `The risk is a role that demands hard, provable data before anything is trusted, leaving your real gift for reading atmosphere and emotion sidelined.`,
      path: `Try naming one field where an intuitive read is the qualification, not an obstacle to prove around, and researching a real path in. You are allowed to follow a professional hunch past what you can fully explain. What direction keeps tugging that your resume can't justify yet?`,
      positive: `Your fit for the intuitive and the felt hasn't changed — that read on atmosphere was always real. What's different is that you now name one field where intuition is the qualification, not the obstacle, and research a real path in. That naming is what finally lets the gift be used.`,
      negative: `Your intuitive gift is completely real, and it keeps getting sidelined by roles that demand hard, provable data first. That demanding isn't rigor. It's a fit still sidelined, still waiting for a field that actually trusts what you sense.`,
    },

    '19_CAREER': {
      heading: `Genuinely Yourself, Publicly`,
      why: `Your career fit runs through visible warmth — public speaking, teaching children specifically, the entertainment industry, creative leadership, a personal-brand business built around simply being visibly, genuinely yourself. It also carries real institutional weight: military command, state governance, directing plants and enterprises, nuclear physics — anywhere your natural radiance is also trusted with genuine responsibility.`,
      shadow: `The risk is a role that requires a costume — professional distance, suppressed personality — draining exactly the natural ease that makes you good at this.`,
      path: `Try naming one part of your work where you're currently performing professionalism instead of being yourself, and letting more of the real you show there this month. You are allowed to earn from work that feels like being yourself. Where does your labor still require a costume?`,
      positive: `Your fit for visible warmth hasn't changed — that natural ease was always real. What's different is that you now let more of the real you show in one part of your work, instead of performing professionalism. That showing is what finally lets the ease be the asset.`,
      negative: `Your natural warmth is completely real, and it keeps getting drained by a role that requires a costume. That costume isn't professionalism. It's a fit still exhausting, still waiting for a version of the work that doesn't ask you to hide.`,
    },

    '20_CAREER': {
      heading: `The Work You're Called Back To`,
      why: `Your career fit runs through vocation — coaching or mentoring, public service, work on social projects, speaking on subjects that genuinely matter, transformational education. It runs directly into the threshold work underneath that calling too: pathology, funeral and cemetery service, work with problem teenagers, prison staff, and paranormal research — professions that function less like a job and more like an answer to something.`,
      shadow: `The risk is staying in an adequate-but-outgrown role, endlessly preparing to answer the calling instead of actually making the leap.`,
      path: `Try naming the work you keep returning to in your mind, and taking one real step toward it this month instead of more preparation. You are allowed to answer the calling that keeps calling. What is one real step, not another course, toward the work you keep circling?`,
      positive: `Your fit for vocation hasn't changed — that calling was always real. What's different is that you now name the work you keep returning to, and take one real step toward it instead of more preparation. That step is what finally lets the calling be answered.`,
      negative: `Your calling is completely real, and it keeps being met with more preparation instead of an actual leap. That preparing isn't readiness. It's a fit still unanswered, still waiting for a real step instead of another course.`,
    },

    '21_CAREER': {
      heading: `Work That Crosses Borders`,
      why: `Your career fit runs through global reach — international business and trade, online platforms and digital ecosystems, cross-border projects, travel and tourism or relocation services. It runs through peace-making and mineral industries specifically too: missionary and interfaith work, shipping and aviation, oil and geology — anywhere work is embedded in genuinely large systems and networks rather than one local one.`,
      shadow: `The risk is staying confined to a narrow, local version of your field long after your actual capacity has outgrown it.`,
      path: `Try letting one part of your work deliberately cross a border this year — a client, a platform, a market — rather than assuming your reach has to stay local. You are allowed to work at the size of the whole map. What border is your work actually ready to cross?`,
      positive: `Your fit for global reach hasn't changed — that capacity was always real. What's different is that you now let one part of your work deliberately cross a border, instead of assuming it has to stay local. That crossing is what finally lets the reach be used.`,
      negative: `Your capacity for global reach is completely real, and it keeps staying confined to a narrow, local version of your field. That confinement isn't caution. It's a fit still capped, still waiting for a border it's actually ready to cross.`,
    },

    '22_CAREER': {
      heading: `No Template Yet`,
      why: `Your career fit runs through original, unstructured paths — freelancing, creative entrepreneurship, working as a digital nomad, startups and experimental projects. It leans into the literally boundary-crossing too: paratrooper, mountaineer, astronaut, circus performer, illusionist, shaman — anywhere a job description would have to be invented to describe what you actually do.`,
      shadow: `The risk is forcing yourself into a fixed, conventional role that punishes exactly the originality that's your real asset, leaving you restless inside a template that was never built for you.`,
      path: `Try naming one unconventional shape your work could actually take, and taking one real step toward building it this year. You are allowed to build a career with no template. What venture would you start if 'that's not a real job' stopped being a reason not to?`,
      positive: `Your fit for original, unstructured work hasn't changed — that originality was always real. What's different is that you now name one unconventional shape your work could take, and take a real step toward building it. That step is what finally lets the originality lead.`,
      negative: `Your originality is completely real, and it keeps getting forced into a fixed, conventional role that punishes it. That forcing isn't discipline. It's a fit still restless, still waiting for a template-free shape it's actually allowed to take.`,
    },

    // ── Guardian Angel (Month of Birth / B) — Destiny Matrix: The 22
    // Ultimate Life-Changing Codes, pages 128-129: "The upper spot of the
    // diagonal square... is an energy of your personal guardian angel given
    // to you at birth... The spot of your guardian angel... stands for the
    // month of your birthday." Reuses B (Sky Line/birth-month) under its
    // own star identity, same technique as Career Paths reusing MON. ──
    '1_GA': {
      heading: `Guidance in the Urge to Begin`,
      why: `Your connection to guidance was given to you at birth through this energy of origination — the sudden, confident impulse to start something is often your guardian angel's nudge arriving as certainty rather than as a sign you have to interpret.`,
      shadow: `The risk is drowning that nudge in second-guessing, waiting for more proof before acting, until the opening the impulse pointed toward has already closed.`,
      path: `Try acting on one confident impulse this week without demanding proof first. You are allowed to trust a sudden certainty as real guidance. What clear urge to begin have you been quietly overriding?`,
      positive: `Your guidance through confident impulse hasn't changed — that certainty was always real protection. What's different is that you now act on one confident impulse without demanding proof first. That trust is what finally lets the guidance land in time.`,
      negative: `Your guardian-angel impulse is completely real, and it keeps getting drowned in second-guessing until the opening it pointed toward closes. That waiting isn't caution. It's a guidance still overridden, still waiting to be trusted at the moment it actually arrives.`,
    },

    '2_GA': {
      heading: `Guidance in What You Sense`,
      why: `Your connection to guidance arrives as quiet, wordless knowing — a felt certainty about a person or situation that turns out to be right before you can explain why.`,
      shadow: `The risk is dismissing that quiet knowing because it can't be justified out loud, so the guidance goes unacted on.`,
      path: `Try trusting one quiet certainty this week enough to act on it, even without a tidy explanation. You are allowed to follow guidance you can't fully justify. What have you sensed clearly that you've been waiting to be able to prove?`,
      positive: `Your guidance through quiet knowing hasn't changed — that felt certainty was always real. What's different is that you now act on one quiet certainty without needing a tidy explanation first. That trust is what finally lets the knowing be used.`,
      negative: `Your quiet knowing is completely real, and it keeps getting dismissed because it can't be justified out loud. That dismissing isn't rigor. It's a guidance still unacted on, still waiting for you to trust it without needing to prove it first.`,
    },

    '3_GA': {
      heading: `Guidance in What Nourishes You`,
      why: `Your connection to guidance arrives through a felt sense of abundance or depletion — what genuinely feeds you versus what only looks like it should.`,
      shadow: `The risk is overriding that felt sense to keep giving, missing the guidance embedded in your own exhaustion.`,
      path: `Try letting one signal of depletion this week actually change what you do, instead of pushing through it. You are allowed to treat your own exhaustion as real information. What has your body already been telling you that you've been overriding?`,
      positive: `Your guidance through felt abundance and depletion hasn't changed — that sense was always real information. What's different is that you now let one signal of depletion actually change what you do. That listening is what lets the guidance be used instead of overridden.`,
      negative: `Your felt sense of what nourishes you is completely real, and it keeps getting overridden so you can keep giving. That overriding isn't generosity. It's a guidance still ignored, still waiting for your own exhaustion to be treated as real information.`,
    },

    '4_GA': {
      heading: `Guidance in Knowing When`,
      why: `Your connection to guidance arrives as a clear, structural sense of right timing — knowing when to hold and when to move, protection built into your own instinct for order.`,
      shadow: `The risk is overriding that timing sense to force control before the moment is actually ready.`,
      path: `Try waiting for the moment your own instinct says is actually ready, rather than forcing action early. You are allowed to trust your sense of timing as real guidance. Where have you been forcing a moment that hasn't actually arrived yet?`,
      positive: `Your guidance through a sense of timing hasn't changed — that instinct for the right moment was always real. What's different is that you now wait for the moment your instinct says is ready, instead of forcing it early. That waiting is what lets the guidance actually work.`,
      negative: `Your sense of timing is completely real, and it keeps getting overridden by a need to force control early. That forcing isn't decisiveness. It's a guidance still ignored, still waiting for the moment it already knows is right.`,
    },

    '5_GA': {
      heading: `Guidance in What Rings True`,
      why: `Your connection to guidance arrives through recognition — a teaching, a person, a piece of knowledge that resonates as genuinely true the moment you encounter it, ahead of any argument for it.`,
      shadow: `The risk is following an outside authority's word over your own recognition, deferring guidance you actually already received.`,
      path: `Try trusting one thing that rang true to you this week over an outside authority's opposing opinion. You are allowed to recognize truth without external permission. What have you recognized as true that you've been waiting for someone else to confirm?`,
      positive: `Your guidance through recognition hasn't changed — that instant sense of truth was always real. What's different is that you now trust what rang true to you over an outside authority's opposing opinion. That trust is what lets the guidance stand on its own.`,
      negative: `Your recognition of what's true is completely real, and it keeps deferring to outside authority instead of trusting itself. That deferring isn't humility. It's a guidance still unconfirmed, still waiting for your own recognition to be enough.`,
    },

    '6_GA': {
      heading: `Guidance in the Pull Toward`,
      why: `Your connection to guidance arrives as a genuine pull — toward a person, a choice, a path — distinct from what merely looks convenient or expected.`,
      shadow: `The risk is choosing what looks correct on paper over the actual pull, muting the guidance to avoid disruption.`,
      path: `Try naming the pull you've been overriding for something more convenient, and giving it real weight this week. You are allowed to let a genuine pull outweigh a convenient option. What choice keeps quietly pulling at you despite the practical case against it?`,
      positive: `Your guidance through genuine pull hasn't changed — that draw was always real. What's different is that you now give the pull real weight instead of choosing what merely looks convenient. That weight is what lets the guidance actually be followed.`,
      negative: `Your genuine pull is completely real, and it keeps getting muted in favor of what looks correct on paper. That muting isn't practicality. It's a guidance still overridden, still waiting to outweigh the convenient option.`,
    },

    '7_GA': {
      heading: `Guidance in Aligned Momentum`,
      why: `Your connection to guidance arrives through motion itself — the difference between drive that feels aligned and effortless versus pushing that feels forced is often the signal.`,
      shadow: `The risk is confusing sheer forward motion with guidance, forcing a direction the momentum was never actually behind.`,
      path: `Try noticing this week where your drive feels aligned versus forced, and following the aligned direction even if it's slower. You are allowed to let ease be a sign, not just proof of laziness. Where has forcing it been covering for a direction that isn't actually right?`,
      positive: `Your guidance through aligned momentum hasn't changed — that distinction was always real. What's different is that you now follow the direction that feels aligned, even if it's slower than the forced one. That following is what lets the guidance actually lead somewhere.`,
      negative: `Your momentum is completely real, and it keeps getting aimed by force instead of alignment. That forcing isn't drive working correctly. It's a guidance still overridden, still waiting for ease to be trusted as a real signal.`,
    },

    '8_GA': {
      heading: `Guidance in a Clear Right`,
      why: `Your connection to guidance arrives as clarity about fairness — a clean, uncomplicated read on what's actually right in a situation, before the justifications and arguments arrive.`,
      shadow: `The risk is talking yourself out of that clean read with elaborate justification, muddying guidance that was actually simple.`,
      path: `Try trusting your first clear read on one fairness question this week before you argue yourself out of it. You are allowed to trust the simple version. Where has an elaborate justification been overriding a clear, simple read you already had?`,
      positive: `Your guidance through a clean read on fairness hasn't changed — that clarity was always real. What's different is that you now trust the first clear read before arguing yourself out of it. That trust is what keeps the guidance simple instead of muddied.`,
      negative: `Your clean read on what's fair is completely real, and it keeps getting muddied by elaborate justification. That justifying isn't rigor. It's a guidance still overridden, still waiting for the simple version to be trusted.`,
    },

    '9_GA': {
      heading: `Guidance in Solitude`,
      why: `Your connection to guidance arrives specifically in quiet, alone time — insight that doesn't come in a crowded room, only after you've actually withdrawn long enough to hear it.`,
      shadow: `The risk is staying so busy or social that the solitude this guidance depends on never actually arrives.`,
      path: `Try spending one real stretch of solitude this week with no agenda, and noticing what surfaces. You are allowed to need to be alone to actually hear your own guidance. What has been waiting for quiet you haven't given it yet?`,
      positive: `Your guidance through solitude hasn't changed — that insight was always real, arriving specifically in quiet. What's different is that you now spend one real stretch of solitude with no agenda and let it surface. That quiet is what finally lets the guidance be heard.`,
      negative: `Your capacity for insight in solitude is completely real, and it keeps being crowded out by constant busyness or company. That crowding isn't productivity. It's a guidance still unheard, still waiting for the quiet it actually needs.`,
    },

    '10_GA': {
      heading: `Guidance in Open Doors`,
      why: `This is the code named directly in the source material as guarded by fortune — lucky doors opening, the right people and information arriving right on time once you've actually made a decision and moved.`,
      shadow: `The risk is doubting the ease itself, assuming a door that opened easily can't be the real one, and passing it by looking for a harder path to prove yourself on.`,
      path: `Try walking through one door that opened easily this week instead of waiting for a harder one to prove it's real. You are allowed to trust luck as real guidance, not something to be suspicious of. What easy opening have you been distrusting simply because it wasn't hard-won?`,
      positive: `Your guidance through easy openings hasn't changed — that flow of fortune was always real. What's different is that you now walk through a door that opened easily instead of waiting for a harder one to feel earned. That trust is what finally lets the luck be used.`,
      negative: `Your flow of fortune is completely real, and it keeps getting distrusted simply for arriving easily. That suspicion isn't discernment. It's a guidance still declined, still waiting for ease to be trusted instead of second-guessed.`,
    },

    '11_GA': {
      heading: `Guidance in Quiet Resolve`,
      why: `Your connection to guidance arrives as an inner steadiness that doesn't need anyone else to witness it — a private certainty that you can hold something difficult, felt rather than proven.`,
      shadow: `The risk is needing that resolve confirmed by an audience before trusting it's real, delaying action until someone else validates the guidance.`,
      path: `Try acting on one private certainty this week without needing anyone else to confirm it first. You are allowed to trust your own resolve without a witness. What have you been waiting for someone else to validate that you already privately know?`,
      positive: `Your guidance through private resolve hasn't changed — that inner steadiness was always real. What's different is that you now act on a private certainty without needing it confirmed first. That trust is what finally lets the resolve be used.`,
      negative: `Your private resolve is completely real, and it keeps waiting for outside confirmation before it's trusted. That waiting isn't humility. It's a guidance still delayed, still waiting to be acted on without a witness.`,
    },

    '12_GA': {
      heading: `Guidance in a New Angle`,
      why: `This is one of the codes whose own affirmation names the guardian angels directly — guidance arrives here as a new perspective on a situation you'd stopped being able to see clearly, arriving right as you release your grip on the old view.`,
      shadow: `The risk is clinging to the old angle out of self-sacrifice, refusing the new view because it feels like giving something up.`,
      path: `Try deliberately releasing your current view of one stuck situation this week, and letting a new angle arrive. You are allowed to receive a new perspective without it costing you anything. Where have you been gripping an old view even though a new one is trying to arrive?`,
      positive: `Your guidance through a new angle hasn't changed — that perspective shift was always real and available. What's different is that you now deliberately release your grip on the old view of one stuck situation. That release is what finally lets the new angle arrive.`,
      negative: `Your access to a new perspective is completely real, and it keeps being blocked by clinging to the old angle out of self-sacrifice. That clinging isn't loyalty. It's a guidance still unreceived, still waiting for the old grip to loosen.`,
    },

    '13_GA': {
      heading: `Guidance in What Clears`,
      why: `Your connection to guidance arrives inside endings themselves — what becomes visible only once something old has actually been let go, protection built into the release itself, not despite it.`,
      shadow: `The risk is resisting the ending so hard that the clarity waiting on the other side of it never actually arrives.`,
      path: `Try letting one ending complete fully this week instead of prolonging it, and noticing what becomes visible. You are allowed to trust that what an ending clears is guidance, not just loss. What ending have you been resisting that might actually be trying to clear your view?`,
      positive: `Your guidance through what an ending clears hasn't changed — that clarity was always waiting on the other side of release. What's different is that you now let one ending complete fully instead of prolonging it. That completion is what finally lets the clarity arrive.`,
      negative: `Your capacity to find clarity through endings is completely real, and it keeps being blocked by resisting the ending itself. That resisting isn't protection. It's a guidance still hidden, still waiting for the release it needs to actually complete.`,
    },

    '14_GA': {
      heading: `Guidance Born In, Not Learned`,
      why: `This is one of the codes the source names as having a well-established, born-in connection to guidance — strong intuition and extrasensory perception that doesn't need to be built, only trusted and used.`,
      shadow: `The risk is doubting a sense this reliable simply because it arrived without effort, treating an inborn gift as if it needed to be earned before it counts.`,
      path: `Try trusting one intuitive read this week exactly because it came easily, not despite that. You are allowed to trust a gift you didn't have to work for. What have you been dismissing as too easy to be real guidance?`,
      positive: `Your inborn intuitive connection hasn't changed — that gift was always real, given at birth. What's different is that you now trust one intuitive read exactly because it came easily. That trust is what finally lets the gift be used instead of doubted.`,
      negative: `Your inborn intuition is completely real, and it keeps being doubted simply for arriving without effort. That doubting isn't discernment. It's a guidance still dismissed, still waiting to be trusted as the gift it actually is.`,
    },

    '15_GA': {
      heading: `Guidance in the Noticed Pull`,
      why: `Your connection to guidance arrives as the moment of noticing itself — the instant you catch a compulsion or temptation actually pulling at you is itself the protection, the awareness that lets you choose instead of just reacting.`,
      shadow: `The risk is ignoring that moment of noticing, letting the pull run unexamined because acknowledging it feels like admitting weakness.`,
      path: `Try naming one pull the moment you notice it this week, instead of letting it run silently. You are allowed to notice temptation without it meaning you've already failed. What pull have you been noticing and then pretending not to?`,
      positive: `Your guidance through noticing the pull hasn't changed — that awareness was always the real protection. What's different is that you now name the pull the moment you notice it, instead of letting it run silently. That naming is what lets the guidance actually work.`,
      negative: `Your capacity to notice the pull is completely real, and it keeps being ignored to avoid admitting weakness. That ignoring isn't strength. It's a guidance still unused, still waiting for the noticing to be named instead of silenced.`,
    },

    '16_GA': {
      heading: `Guidance Before the Fall`,
      why: `Your connection to guidance arrives as an early signal — a felt sense that something is about to give way, arriving well before the actual collapse, protection built into your own capacity to sense structural strain.`,
      shadow: `The risk is dismissing that early signal to maintain the appearance of stability, letting the warning go unheeded until the collapse forces the issue.`,
      path: `Try naming one early warning sign you've been minimizing this week, and addressing it directly. You are allowed to trust a warning before it's proven true. What signal have you already sensed that you've been calling paranoia?`,
      positive: `Your guidance through early warning hasn't changed — that capacity to sense strain was always real. What's different is that you now name one early warning sign and address it directly, instead of minimizing it. That naming is what lets the guidance prevent the collapse.`,
      negative: `Your capacity to sense an early warning is completely real, and it keeps getting dismissed to maintain the appearance of stability. That dismissing isn't calm. It's a guidance still unheeded, still waiting to be trusted before the collapse forces the issue.`,
    },

    '17_GA': {
      heading: `Guidance in Hope That Stays`,
      why: `Your connection to guidance arrives as a hope that persists even when the circumstances don't obviously justify it — a quiet, stubborn faith that something is still possible, which is itself the signal worth trusting.`,
      shadow: `The risk is dismissing that persistent hope as naive, talking yourself out of the one thing that was actually guidance.`,
      path: `Try letting one stubborn hope be real information this week instead of naivety to be managed. You are allowed to trust hope that has no obvious reason. What hope have you kept quietly alive that deserves to be trusted as guidance, not naivety?`,
      positive: `Your guidance through persistent hope hasn't changed — that stubborn faith was always real information. What's different is that you now let one stubborn hope be trusted instead of managed as naivety. That trust is what finally lets the guidance be followed.`,
      negative: `Your persistent hope is completely real, and it keeps being dismissed as naive. That dismissing isn't realism. It's a guidance still talked out of, still waiting to be trusted as the signal it actually is.`,
    },

    '18_GA': {
      heading: `Guidance in Dreams and Quiet`,
      why: `Your connection to guidance arrives through the felt and the dreamed — an image, a mood, an undercurrent that carries real information even though it can't be immediately explained.`,
      shadow: `The risk is letting fear masquerade as guidance, since this same sensitive channel can manifest what it fears as easily as what it hopes.`,
      path: `Try writing down one dream or felt undercurrent this week and checking whether it's guidance or fear before acting on it. You are allowed to trust the felt sense once you've checked which one it is. What has surfaced lately that you haven't yet sorted into fear versus guidance?`,
      positive: `Your guidance through dreams and felt undercurrents hasn't changed — that sensitive channel was always real. What's different is that you now check one felt sense against reality before acting, sorting fear from guidance. That checking is what makes the channel trustworthy.`,
      negative: `Your sensitive, dreaming channel is completely real, and it keeps letting fear masquerade as guidance unchecked. That confusion isn't the channel failing. It's a guidance still unsorted, still waiting to be checked before it's trusted.`,
    },

    '19_GA': {
      heading: `Guidance in What Lights You Up`,
      why: `Your connection to guidance arrives as unmistakable joy — the thing that makes your eyes actually sparkle is rarely random, it's usually protection pointing you toward exactly where your energy is meant to go.`,
      shadow: `The risk is dismissing joy as frivolous, requiring a more serious-sounding reason before trusting the guidance embedded in what actually delights you.`,
      path: `Try following one thing that genuinely lights you up this week without needing a serious justification for it. You are allowed to trust joy as real guidance, not just a nice feeling. What have you been delaying simply because it sounded too fun to be the real priority?`,
      positive: `Your guidance through genuine joy hasn't changed — that spark was always real direction. What's different is that you now follow what lights you up without needing a serious justification. That following is what lets the guidance be used instead of delayed.`,
      negative: `Your capacity for genuine joy is completely real, and it keeps being dismissed as frivolous until it earns a serious-sounding reason. That dismissing isn't maturity. It's a guidance still delayed, still waiting to be trusted as real direction.`,
    },

    '20_GA': {
      heading: `Guidance in the Repeated Call`,
      why: `Your connection to guidance arrives as a summons that keeps returning no matter how long you set it aside — the same call, in different forms, until it's finally answered.`,
      shadow: `The risk is treating the repetition as noise to manage rather than guidance insisting on being heard.`,
      path: `Try naming the call that keeps returning to you this week, and taking one real step toward answering it. You are allowed to trust a repeated summons as real guidance, not nagging. What keeps calling you back no matter how many times you've set it down?`,
      positive: `Your guidance through a repeated call hasn't changed — that summons was always real. What's different is that you now name the call and take one real step toward answering it, instead of managing it as noise. That step is what finally lets the guidance be heard.`,
      negative: `Your repeated call is completely real, and it keeps being managed as noise instead of heard as guidance. That managing isn't peace. It's a summons still unanswered, still waiting for one real step toward it.`,
    },

    '21_GA': {
      heading: `Guidance in Genuine Completion`,
      why: `Your connection to guidance arrives as a felt sense of arrival — knowing something is actually finished, not by external checklist but by an internal, protective sense of rightness.`,
      shadow: `The risk is overriding that felt completion with an external standard, refusing to let something count as done because it doesn't look finished enough.`,
      path: `Try trusting one felt sense of completion this week over an external checklist that says otherwise. You are allowed to know something is done because it feels done. What have you refused to call finished even though it genuinely feels complete?`,
      positive: `Your guidance through felt completion hasn't changed — that internal sense of rightness was always real. What's different is that you now trust one felt sense of completion over an external checklist. That trust is what finally lets the guidance be honored.`,
      negative: `Your felt sense of completion is completely real, and it keeps being overridden by an external standard of what counts as finished. That overriding isn't rigor. It's a guidance still dismissed, still waiting to be trusted on its own terms.`,
    },

    '22_GA': {
      heading: `Guidance in the Right Leap`,
      why: `Your connection to guidance arrives as trust itself — a leap that feels right despite having no proof attached, protection built into the willingness to begin without a guarantee.`,
      shadow: `The risk is demanding the guarantee anyway, refusing to move until certainty arrives, which this particular guidance was never going to offer.`,
      path: `Try taking one leap this week that feels right despite lacking proof, and trusting the protection that comes with actually moving. You are allowed to leap without the guarantee. What leap have you been delaying, waiting for a certainty that guidance like this doesn't actually give?`,
      positive: `Your guidance through the felt-right leap hasn't changed — that trust was always real protection. What's different is that you now take one leap that feels right despite lacking proof. That leap is what finally lets the guidance be lived instead of waited on.`,
      negative: `Your capacity to trust a leap without proof is completely real, and it keeps waiting for a guarantee this guidance was never going to give. That waiting isn't caution. It's a protection still untested, still waiting for the leap it was actually built for.`,
    },

    // ── Life Path (full birthdate digit sum, classical numerology reduction:
    // 1-9 or master numbers 11/22/33 — NOT this app's own base-22 Arcana
    // system, since Life Path is a real, externally-known number people
    // already check themselves against. See research/11-Research-Updates/32.
    // Content adapted from Numberolgy-data.pdf's Positive/Negative/
    // Destructive trait lists for each number. ──────────────────────────────
    '1_LIFEPATH': {
      heading: `Life Path 1 — The Original`,
      why: `Life Path 1 is often called The Leader, The Pioneer, or The Initiator. You're the one who moves first — not out of bravado, but because standing still while something needs to happen has never felt like an option to you. Other people wait for permission; you've never fully understood what that would even mean. This isn't ambition in the ordinary sense — it's closer to an inability to sit inside someone else's plan for very long.`,
      traits: `You're decisive to a fault, fiercely independent, and instinctively protective of your own ideas before anyone else has weighed in on them. You read as confident because you generally are — but the confidence is quieter than people expect, more conviction than performance. You'd rather be first and wrong than safe and second.`,
      shadow: `The lesson underneath all of it: leading a room and needing to win it are two different things, and you conflate them more than you'd admit. When someone challenges you, your instinct isn't curiosity, it's correction — and if that gets dismissed enough times, it curdles into needing to be right more than needing to be understood. The loneliness of this number is rarely spoken about: you can build something remarkable and still feel like nobody actually knows what it cost you.`,
      career: `You belong wherever the first move is yours to make — founding, not joining. Business ownership, invention, executive leadership, or any role where the direction of the thing is genuinely up to you. Give you a clear mandate and real room to move, and you'll outwork almost anyone; box you into someone else's process and you'll quietly start looking for the door.`,
      love: `You love with your whole hand on the wheel, which is generous right up until it isn't. What actually holds you is someone who won't be steered — a partner secure enough to disagree with you in front of other people, because you respect that far more than agreement. Getting there takes longer than it should, since trusting someone with the parts of you that aren't finished yet is the one thing initiative can't rush.`,
      path: `Try asking one real question this week instead of offering the answer first. You are allowed to lead and still not know something. Where has needing to be first cost you the chance to actually be curious?`,
    },

    '2_LIFEPATH': {
      heading: `Life Path 2 — The Diplomat`,
      why: `Life Path 2 is often called The Diplomat, The Peacemaker, or The Mediator. You process the world in pairs — this side and that side, what was said and what was meant — and you do it so automatically that most people never realize how much translating you're actually doing on their behalf. You're the person disputes get brought to, not because you asked for the job, but because you're constitutionally unable to hear only one side of anything.`,
      traits: `You're tactful, detail-oriented, and quietly perceptive in a way people mistake for shyness. Home and a few trusted people mean more to you than any wider circle ever will. You notice everything and announce almost none of it.`,
      shadow: `Here's what that gift costs: peace bought by staying quiet isn't peace, it's a debt with interest. You can watch both sides of a conflict clearly enough to see exactly what's true and still say nothing, because agreeing feels safer than being the reason it got harder. Do that long enough and the resentment doesn't disappear — it just moves underground, waiting for the moment your patience finally runs out.`,
      career: `You do your best work as half of something — a partnership, a team, a role built on precision and follow-through rather than solo command. Counseling, mediation, detail-heavy administrative or medical work, or anything where tact is actually the skill being paid for.`,
      love: `You give a relationship your whole attention, which is rare and genuinely worth something — but you also default to whatever keeps things smooth, even when smooth isn't honest. The partner who's good for you is the one who keeps asking what you actually think, until answering starts to feel normal instead of risky.`,
      path: `Try saying the plain version of what you want this week, once, before you've smoothed it into something more agreeable. You are allowed to have a side and say so out loud. Where have you been keeping the peace at the cost of being known?`,
    },

    '3_LIFEPATH': {
      heading: `Life Path 3 — The Expressive One`,
      why: `Life Path 3 is often called The Communicator, The Creative, or The Entertainer. Whatever's happening inside you doesn't stay inside for long — it wants a room, a page, a stage, someone to actually receive it. That need to be heard isn't vanity; it's closer to how you process being alive at all. Silence, for you, is where things go to rot.`,
      traits: `You're funny before you're serious, though the seriousness is real underneath it. Optimistic almost by reflex, quick with words, allergic to anything that smells like an evasive answer. People remember rooms you were in.`,
      shadow: `The catch is that expression without follow-through is just noise with good lighting. You can start ten things and finish the two that were still fun by week three, and mistake the resulting scatter for spontaneity rather than what it actually is — unfinished work with a great personality.`,
      career: `Anywhere your voice is the product — writing, performing, teaching, hosting, sales, marketing. You need real variety and at least a little audience, or the talent starts leaking out sideways as restlessness instead.`,
      love: `You love loudly and generously, and you mean it — but staying present through the boring, hard middle of a relationship is a different muscle than lighting up a room, and it's the one you've practiced least. The right partner laughs with you and still expects you to show up on the unglamorous Tuesday.`,
      path: `Try finishing one unglamorous obligation this month with nobody watching and no funny story to tell about it afterward. You are allowed to be the life of the party and still be someone people can rely on when it isn't fun. What have you been avoiding purely because it doesn't entertain you?`,
    },

    '4_LIFEPATH': {
      heading: `Life Path 4 — The Builder`,
      why: `Life Path 4 is often called The Builder, The Organizer, or The Foundation. You think in years, not weeks — laying one honest brick at a time toward something that's still standing long after the excitement of building it has worn off. Everyone else calls it patience. To you it just feels like the only way anything real gets made.`,
      traits: `You're disciplined, loyal, and stubbornly practical, with a private streak of unconventional thinking that surprises people who've filed you as "the reliable one." You'd rather be right in ten years than agreeable today.`,
      shadow: `The trouble is that the same conviction that lets you build something durable can harden into a refusal to be moved on anything, including the small stuff that was never worth the fight. You get so absorbed in the structure that the people standing inside it stop hearing from you — not because you stopped caring, but because caring and building started looking like the same task.`,
      career: `Engineering, architecture, operations, construction, or any field where the win is a system that still works five years from now. You need a long timeline and real ownership of the plan, not a seat inside someone else's rushed one.`,
      love: `You show love the way you show up to work — consistently, without asking for credit — which some partners read as distant simply because it's quiet. What you need is someone who can read reliability as devotion, and who'll gently pull you out from behind the project once in a while.`,
      path: `Try taking one afternoon this week for something with no productive purpose at all. You are allowed to be the reliable one and still be light today. What has staying so focused on the structure been costing you in warmth?`,
    },

    '5_LIFEPATH': {
      heading: `Life Path 5 — The Adventurer`,
      why: `Life Path 5 is often called The Adventurer, The Freedom Seeker, or The Catalyst. Stillness makes you itchy in a way that has nothing to do with discipline — your mind runs fast, and it wants new input the way lungs want air. You were never trying to be difficult; routine just genuinely starts to feel like a room with the windows painted shut.`,
      traits: `You're quick, curious, and unusually good at reading a room or a stranger within minutes. Change doesn't scare you — the absence of it does. You collect people and experiences faster than most collect anything at all.`,
      shadow: `The catch: motion without anything underneath it eventually stops being adventure and starts being avoidance. You can analyze a feeling so thoroughly that you talk yourself out of trusting it, and reach for something new the instant something old asks for real depth instead of more variety.`,
      career: `Writing, sales, travel, media, or any work with a genuinely different day attached to it — you think best moving, not sitting still at the same desk for a decade. Multiple streams of interest at once suit you better than one narrow lane.`,
      love: `You love easily and widely, which is real, but staying is the part that actually tests you — not because you don't care, but because leaving has always been the easier reflex. The partner who keeps you is the one who gives you room instead of trying to hold on tighter.`,
      path: `Try staying with one commitment this month past the point where you'd normally want to change course. You are allowed to crave freedom and still learn what staying actually teaches you. What have you kept moving away from before it had the chance to become something?`,
    },

    '6_LIFEPATH': {
      heading: `Life Path 6 — The Nurturer`,
      why: `Life Path 6 is often called The Nurturer, The Caregiver, or The Guardian. You walk into a space and start improving it without noticing you're doing it — softening an argument, fixing a meal, making a house feel like somewhere people want to stay. Caring for people isn't something you do; it's closer to your resting state.`,
      traits: `You're warm, protective, and genuinely happiest when the people around you are doing well. You have real taste — in beauty, in harmony, in what makes a place feel right — and a low tolerance for discord of any kind.`,
      shadow: `The line you keep crossing without meaning to: caring for someone and managing them feel identical from the inside, but only one of them is actually love. You set a standard for how people should be treated without saying it out loud, then feel quietly hurt when they miss a bar they never saw.`,
      career: `Teaching, counseling, healthcare, hospitality, design — anywhere your work visibly makes someone's life better. You wilt in cold, transactional settings with no room for the relationships you build without trying.`,
      love: `You are a genuinely devoted partner, protective and home-building almost by instinct — but the same devotion, unchecked, starts asking your partner to be cared for on your terms instead of theirs. What helps is a partner secure enough to take the care without needing rescuing, and honest enough to name it when it tips into control.`,
      path: `Try naming one place this week where you've been managing someone else's life out of love, and step back from it on purpose. You are allowed to care for people without needing to control how they receive it. Where has your devotion started asking for more control than it needs?`,
    },

    '7_LIFEPATH': {
      heading: `Life Path 7 — The Seeker`,
      why: `Life Path 7 is often called The Seeker, The Analyst, or The Mystic. You live a layer beneath where most conversations happen — genuinely more interested in why something is true than in how it looks. Solitude isn't a retreat from your life; for you, it's closer to where your actual life takes place.`,
      traits: `You're intuitive, private, and unusually calming to be around, even when you've said almost nothing. Crowds and small talk cost you real energy. You'd rather understand one thing completely than skim ten.`,
      shadow: `The line between privacy and isolation is thinner than you think, and you cross it more than you'd admit. Staying quiet long enough starts to read as cold to people who never got the context — not because you don't feel things, but because you decided, somewhere back, that feelings were safer kept private.`,
      career: `Research, analysis, writing, medicine, or any specialist field that rewards depth over speed. You do your best work alone or in a small trusted circle, with real solitude built into the role, not squeezed around its edges.`,
      love: `You love slowly, and trust is the actual price of admission to the parts of you nobody else gets to see. Once someone's earned it, the devotion is real and rarely announced. What you need is a partner who won't take the silence personally, and who's willing to wait for the door instead of knocking it down.`,
      path: `Try telling one trusted person a half-formed thought this week, before you've polished it into something worth saying. You are allowed to be known, not only respected for your depth. Where has your privacy been protecting you from something that actually needed to be shared?`,
    },

    '8_LIFEPATH': {
      heading: `Life Path 8 — The Executive`,
      why: `Life Path 8 is often called The Powerhouse, The Executive, or The Manifestor — the number this system treats as the bridge between the material and the spiritual, where ambition actually turns into something you can point to. You're quieter than the scale of what you build would suggest, patient in a way that looks like restraint but is really just confidence that the plan will pay off if you don't rush it.`,
      traits: `You're capable, composed, and a genuinely sharp judge of character. Compliments barely register on your face and land harder than you'll ever let show. You measure things — progress, people, yourself — more than almost any other number does.`,
      shadow: `Here's the trap: the same instinct that built everything you have also decides feelings can wait until after the task is done, and "after" has a way of never actually arriving. You measure your own worth by what you've produced, which means the version of you that hasn't accomplished anything today quietly doesn't feel like it counts.`,
      career: `Business, finance, law, operations, anywhere real authority and a visible scoreboard exist. You want autonomy and a role that actually matches the size of what you're capable of carrying — smaller than that, and you'll outgrow it fast.`,
      love: `You provide before you're asked to, and show love through action more naturally than through words — reliable in a way that's easy to underestimate as coldness. You need a partner strong enough not to be intimidated by your drive and honest enough to say when you've disappeared into work again.`,
      path: `Try naming one feeling out loud this week instead of routing straight past it into the next task. You are allowed to be capable and still be soft in front of someone. What have you been postponing feeling in the name of staying efficient?`,
    },

    '9_LIFEPATH': {
      heading: `Life Path 9 — The Humanitarian`,
      why: `Life Path 9 is often called The Humanitarian, The Old Soul, or The Giver. You arrive at things already knowing more than you should, the way someone does after they've already been through the hard version once. Giving isn't generosity for you so much as reflex — your first instinct in almost any situation is to hand over whatever's needed before anyone's had to ask.`,
      traits: `You're direct, warm, and refreshingly free of guile — what you feel is usually what shows on your face. You forgive fast, sometimes faster than the situation actually earned. Slow, indirect people test your patience more than you'd like to admit.`,
      shadow: `The cost of giving this freely is that you rarely notice when it's stopped being reciprocal, and by the time you do, the resentment has already been quietly accumulating for a while. You can mistake being needed for being loved, and keep giving to make sure you stay needed.`,
      career: `Nonprofit and humanitarian work, law, teaching, the arts, anything built around other people's wellbeing rather than your own advancement. You move people naturally, which suits public-facing and creative roles just as well as service ones.`,
      love: `You love generously, sometimes to a fault, giving before it's asked for and rarely keeping score — which is real, and also exactly how the imbalance starts. The partner who's good for you notices what you need before you say it, so the giving finally runs both ways.`,
      path: `Try asking directly for one thing you need this week, with the same plainness you'd use to offer it to someone else. You are allowed to receive at the same scale you give. What have you been waiting for someone to simply notice instead of asking for outright?`,
    },

    '11_LIFEPATH': {
      heading: `Master Number 11 — The Illuminator`,
      why: `Master Number 11 is often called The Intuitive, The Illuminator, or The Visionary. You read rooms and people faster than you can explain how, and you carry a pull toward meaning that ordinary routine has never quite satisfied. Where a 2 quietly supports, you're built to stand at the front of the thing you believe in — the difference is presence, not just sensitivity.`,
      traits: `You're inspired, magnetic without trying to be, and drawn to work that feels like more than a paycheck. Perfection isn't a burden to you, it's closer to a compass. People remember meeting you longer than you'd expect.`,
      shadow: `The gap you keep living in is between the size of what you can imagine and the size of what you've actually built. You can hold people, including yourself, to a standard the real world was never going to meet, and end up disappointed by everyone for failing at something you never said out loud.`,
      career: `Teaching, art, ministry, coaching, anything that functions as a calling rather than a job. Purely transactional work drains you fast, no matter how well it pays — you need the sense that what you're doing actually reaches someone.`,
      love: `You love with real intensity once you've found someone who meets you on the same frequency, but you can quietly hold the relationship to an ideal no ordinary Tuesday will live up to. What helps is a partner who can bring the vision back down to earth with you instead of just admiring it from a distance.`,
      path: `Try turning one piece of the vision into a single, small, concrete action this week — not the whole thing, just the first real step. You are allowed to let something this large begin modestly. Which idea have you been holding at full scale instead of letting it start small?`,
    },

    '22_LIFEPATH': {
      heading: `Master Number 22 — The Master Builder`,
      why: `Master Number 22 is often called The Master Builder, The Architect, or The Visionary Achiever. You're one of the rare numbers that can take something enormous in your head and actually finish building it in the world — not just imagine it, not just start it, finish it. That combination, vision plus follow-through at scale, is what sets you apart even from other ambitious numbers.`,
      traits: `You're tireless, organized, and quietly restless when you're not building something real. Your feelings run deep, even when your focus looks purely practical. People underestimate how much you're carrying until they see what you've actually finished.`,
      shadow: `The size of what you're capable of building doesn't leave much room in the budget for your own limits, and the body carrying all this ambition tends to lag behind the mind driving it. Left unmanaged, the gap between the scale of the vision and today's actual progress turns into a low hum of frustration that never quite goes away.`,
      career: `Architecture, engineering, large-scale construction, systems-building, civic leadership — anywhere the thing you make actually outlasts you. You need roles that let you both design and execute, not just hand the blueprint to someone else.`,
      love: `You build relationships the way you build everything else — for the long term, with real intention, wanting a partner who feels like part of the structure rather than a separate room in your life. What you need most is someone who can pull you back toward rest before the ambition costs you your health.`,
      path: `Try measuring this week's progress only against what you've actually built, not the full scale of what you eventually intend. You are allowed to build slowly and still be the one who finishes it. Where has impatience with your own pace been draining the purpose out of the work?`,
    },

    '33_LIFEPATH': {
      heading: `Master Number 33 — The Master Healer`,
      why: `Master Number 33 is often called The Master Teacher, The Healer, or The Selfless Servant. Something in you gives without waiting to be asked — not performed kindness, closer to a reflex you were built with. People tell you things they haven't told anyone else, and you generally already sensed it coming before they said a word.`,
      traits: `You're compassionate, gentle, and unusually attuned to what other people need, sometimes before they know it themselves. Whatever you teach or say tends to land with real weight. You give more naturally than you receive.`,
      shadow: `The risk hiding inside a gift this generous is that giving without limit slowly starts to look like disappearing — your needs quietly moved to the bottom of a list you never actually wrote down. Being needed and being loved can start to feel identical, and you keep giving partly to make sure the first one never runs out.`,
      career: `Teaching, counseling, ministry, hospice and healing work, nonprofit leadership — anywhere your presence is genuinely part of the service. Watch the same trap in every one of these: giving so much to the role that nothing's left for you after.`,
      love: `You love as an act of care, tuned to what someone needs before they've said it — which is real devotion, and also exactly how you end up depleted if nobody's giving it back. What you need, more than most numbers, is a partner who insists on taking care of you too.`,
      path: `Try letting one act of care land this week without deflecting it, minimizing it, or rushing to return the favor. You are allowed to be healed, not only to heal. What has your own selfless giving been quietly costing you?`,
    },

    // ── Birthday Number (classical, day-of-birth only — natural-talent
    // number, distinct from Life Path). See research build note for the
    // formula (js/matrix-engine.js's birthdayNumber()). ─────────────────────
    '1_BIRTHDAY': {
      heading: `Birthday Number 1 — A Talent for Starting Things`,
      why: `Of all the numbers folded into your chart, this is the one closest to instinct rather than lesson — a gift you arrived with, not one you had to earn. You were born knowing how to move first. Long before anyone taught you to wait your turn or build consensus, something in you already understood how to look at a gap nobody else was filling and simply step into it. This isn't your whole Life Path — it's the specific tool you were handed to walk it with, the flavor your ambition, your relationships, even your rest ends up taking on. Whatever your deeper number asks of you across a lifetime, this is the talent you get to bring to the task on any given day: the ability to begin.`,
      traits: `You act quickly and decisively, often before you've fully explained your reasoning to anyone, including yourself. You're comfortable being the only one who's raised their hand. Momentum genuinely excites you in a way that planning committees never will.`,
      shadow: `Left unrefined, this talent narrows into something much smaller than it should be — impatience with anyone whose pace doesn't match yours, a low tolerance for the parts of a project that come after the exciting beginning. You can mistake being first for being right, and start resenting people for needing more time to catch up to a decision you made instantly. The gift curdles when it stops including anyone but you.`,
      path: `Try using this instinct today on something genuinely small — a conversation you've been putting off, a task nobody's watching. You are allowed to lead in miniature, not only in the moments everyone can see. Where has this talent been waiting for permission to show up quietly?`,
    },
    '2_BIRTHDAY': {
      heading: `Birthday Number 2 — A Talent for Reading the Room`,
      why: `You arrived already fluent in something most people spend years learning, if they ever do — the ability to sense what's actually happening beneath what's being said. Before anyone explained tact to you, you already had it; before anyone taught you to read a room, you were already doing it instinctively, picking up the tension nobody named or the hurt nobody voiced. This gift doesn't run your whole Life Path, but it colors everything you do with an unusual sensitivity — you rarely blunder into a conversation blind, because part of you is always quietly gathering information nobody else has thought to look for.`,
      traits: `You notice tone shifts, unspoken discomfort, the gap between someone's words and their face. People find you easy to be honest with, even when they can't say why. You'd rather understand a situation fully before acting than move fast and get it wrong.`,
      shadow: `Left unrefined, this sensitivity turns into a kind of self-erasure — reading the room so well that you start shaping yourself entirely around what it wants, losing track of your own position in the process. You can become the person who always knows what everyone else needs and never quite says what you need. The gift shrinks the moment it stops being used on your own behalf too.`,
      path: `Try trusting one read on someone today instead of second-guessing it into silence. You are allowed to know things without needing outside proof. Where has this talent been used entirely in service of everyone but you?`,
    },
    '3_BIRTHDAY': {
      heading: `Birthday Number 3 — A Talent for Expression`,
      why: `You showed up already knowing how to make a room feel more alive, without ever being taught the mechanics of it. Words come easily to you — not just as communication, but as a kind of light you can hand people. Long before you understood irony or timing as concepts, you had a natural sense for both. This talent doesn't define your whole Life Path, but it's the specific brightness you carry into whatever that path turns out to be: the instinct to make things warmer, funnier, more alive than they'd otherwise be, simply by being present in them.`,
      traits: `You find the funny angle on things quickly, sometimes before you've processed the serious one underneath it. People are drawn to talk to you even in silence-heavy rooms. Self-expression genuinely energizes you in a way solitary tasks rarely do.`,
      shadow: `Left unrefined, this gift becomes a shield instead of a light — deflecting anything that asks for real vulnerability behind one more joke, one more bright deflection. You can become the person everyone enjoys and nobody quite knows, because the charm never lets anything land long enough to be examined. The gift narrows the moment it's only ever used to lighten a room instead of also being allowed to darken one honestly.`,
      path: `Try saying one unpolished, true thing today without dressing it up first. You are allowed to be funny and still be taken seriously in the same breath. What have you been keeping light because heavy felt too risky?`,
    },
    '4_BIRTHDAY': {
      heading: `Birthday Number 4 — A Talent for Building`,
      why: `You were born with an instinct most people have to develop through hard, repeated failure — the ability to take something formless and give it real structure. Before anyone explained the value of consistency to you, you already trusted it more than inspiration. This talent isn't your whole Life Path, but it's the reliable hands you bring to it: whatever that deeper path asks of you, you're the kind of person who can actually build the thing, brick by unglamorous brick, long after everyone else has lost interest in the plan.`,
      traits: `You default to practical solutions before creative ones, and you're rarely bothered by that. Long-term projects don't scare you the way they scare most people. You take real satisfaction in something simply working, reliably, without needing to be exciting.`,
      shadow: `Left unrefined, this steadiness calcifies into rigidity — one right way to do a thing, and real frustration with anyone who suggests another. You can become so committed to the process that you stop noticing when the process itself has stopped serving the goal. The gift shrinks the moment "solid" becomes indistinguishable from "unmovable."`,
      path: `Try loosening your grip on one process today that doesn't actually need to be so exact. You are allowed to build carefully and still adjust the blueprint mid-build. Where has your need for the right way been costing you a better one?`,
    },
    '5_BIRTHDAY': {
      heading: `Birthday Number 5 — A Talent for Adapting`,
      why: `You arrived already equipped with something most people spend a lifetime trying to develop — genuine ease with change. Where other people brace for disruption, some part of you has always leaned toward it, curious rather than afraid. This gift doesn't dictate your whole Life Path, but it's the resourcefulness you bring to it: whatever that deeper path throws at you, you're rarely the person left standing still, unable to adjust. You improvise well because some part of you never fully believed the plan was ever going to survive contact with reality anyway.`,
      traits: `You pick up new skills and situations quickly, often faster than the people around you expect. Boredom hits you sooner and harder than it hits most people. You genuinely enjoy the unplanned detour more than the itinerary.`,
      shadow: `Left unrefined, this adaptability becomes an excuse to never actually land anywhere — always mid-adjustment, never mid-commitment. You can mistake restlessness for growth, changing direction the instant something asks you to stay and actually finish it. The gift narrows the moment movement itself becomes the goal, instead of a means toward something worth staying for.`,
      path: `Try staying inside one uncomfortable moment today instead of adapting your way out of it immediately. You are allowed to be flexible and still commit to something long enough to see what it becomes. What have you kept changing before it had the chance to actually matter?`,
    },
    '6_BIRTHDAY': {
      heading: `Birthday Number 6 — A Talent for Care`,
      why: `You were born already knowing how to make a space feel held — an instinct for tending people and places that most people have to be taught, sometimes painfully, and you simply arrived with. Before anyone explained responsibility to you as a concept, you were already noticing what needed fixing, softening, or looked after. This talent doesn't define your entire Life Path, but it's the warmth you bring to it: whatever that deeper path eventually asks of you, you'll bring an instinct for making the people around it feel genuinely cared for along the way.`,
      traits: `You notice what a room or a person needs before they've asked. Comfort and harmony matter to you in a way that's hard to fully switch off. People tend to relax around you without quite knowing why.`,
      shadow: `Left unrefined, this caretaking becomes compulsive — responsibility you never actually agreed to, carried simply because you noticed the gap and couldn't stand to leave it unattended. You can end up exhausted from managing things nobody asked you to manage, while your own needs sit quietly unaddressed at the bottom of the list. The gift shrinks the moment it stops including you as someone worth caring for too.`,
      path: `Try letting one thing today go uncared-for that genuinely isn't yours to manage. You are allowed to care selectively instead of completely. Where has this talent been running on autopilot, tending things nobody actually handed you?`,
    },
    '7_BIRTHDAY': {
      heading: `Birthday Number 7 — A Talent for Depth`,
      why: `You arrived already pulled toward understanding things at their root, rather than settling for their surface — a genuine hunger for depth that most people build slowly, if at all, and you simply carried in from the start. Before anyone taught you to question the easy answer, you were already suspicious of it. This gift doesn't dictate your whole Life Path, but it's the quiet rigor you bring to it: whatever that deeper path asks you to figure out, you're the kind of person who keeps going past where most people stop, because stopping early has never actually satisfied you.`,
      traits: `You ask the follow-up question other people don't think to ask. Solitude restores you in a way company rarely does. You're drawn to whatever hasn't been fully explained yet, even when nobody else in the room seems to notice the gap.`,
      shadow: `Left unrefined, this depth becomes a hiding place — endless analysis standing in for actual rest, understanding pursued so relentlessly it starts replacing living. You can retreat into your own head so thoroughly that the people who care about you start to feel like they're chasing a closed door. The gift narrows the moment thinking about something quietly becomes a substitute for ever finishing with it.`,
      path: `Try letting one question stay genuinely unanswered today instead of chasing it down to the end. You are allowed to not fully understand something yet and still be at peace. What has needing to know everything been costing you in actually resting?`,
    },
    '8_BIRTHDAY': {
      heading: `Birthday Number 8 — A Talent for Execution`,
      why: `You were born with an instinct for turning ambition into something you can actually point to — a natural capability most people have to build through years of trial, and you simply arrived carrying. Before anyone explained follow-through to you as a virtue, you already understood the difference between an idea and a finished thing. This gift doesn't define your entire Life Path, but it's the executive muscle you bring to it: whatever that deeper path eventually asks you to build, you're rarely the person who leaves it half-formed.`,
      traits: `You default to action once a decision's been made, without much appetite for lingering in theory. Results matter to you in a way that's hard to fully quiet, even on days you'd like to rest. People trust you with things that actually need to get done.`,
      shadow: `Left unrefined, this capability turns into a scoreboard you can never stop checking — measuring a good day purely by what got produced, and quietly discounting anything, including feelings, that didn't show up as a tangible result. You can start treating rest itself as a failure to execute. The gift shrinks the moment output becomes the only thing that counts as worth doing.`,
      path: `Try counting today as good for a reason that has nothing to do with what you produced. You are allowed to rest and still genuinely call it a win. What have you stopped valuing simply because it doesn't show up on the scoreboard?`,
    },
    '9_BIRTHDAY': {
      heading: `Birthday Number 9 — A Talent for Compassion`,
      why: `You arrived already able to feel what other people are going through, almost before they've said it out loud — a generosity of feeling that most people have to cultivate deliberately, and you simply carried with you from the start. Before anyone taught you empathy as a discipline, you already had it as instinct. This gift doesn't run your whole Life Path, but it's the warmth you bring to it: whatever that deeper path ends up asking of you, some part of the work will always involve genuinely feeling for the people it touches, not just performing concern for them.`,
      traits: `You pick up on other people's pain quickly, sometimes before your own registers. Generosity feels natural to you, not effortful. You're drawn toward causes and people bigger than your own immediate circle.`,
      shadow: `Left unrefined, this compassion becomes depleting — giving until there's nothing left over, feeling everyone's pain so thoroughly that your own gets lost in the noise. You can end up resentful in a way you can't quite name, because the giving never included receiving anything back. The gift narrows the moment it stops including your own feelings as ones worth tending.`,
      path: `Try keeping one small thing today purely for yourself, unshared and unspent on anyone else. You are allowed to be generous and still hold something back. What have you been giving away that you actually needed to keep?`,
    },
    '11_BIRTHDAY': {
      heading: `Master Birthday Number 11 — A Talent for Insight`,
      why: `You were born carrying something heightened — an intuitive sensitivity that arrives before logic can catch up to it, sensing what's coming or what's true well ahead of the evidence most people wait for. This isn't a talent you built; it's one you showed up already holding, and it colors everything else about how you move through your deeper Life Path. Whatever that path eventually asks of you, part of the work will be trusting a download you can feel clearly but can't always immediately explain — and slowly learning that the explanation was never actually the requirement for acting on it.`,
      traits: `You sense shifts in a room, a plan, or a person before anyone names them out loud. Ordinary routine has never fully satisfied the part of you that's always scanning for what's next. Ideas arrive to you fully formed, sometimes faster than you can hold onto them.`,
      shadow: `Left unrefined, this heightened sensitivity stays trapped in your own head — insight that never gets spoken, vision that never gets built, because the intensity of it feels safer kept private than tested against the world. You can become someone who's clearly gifted and rarely understood, simply because the gift was never let out. The gift narrows the moment staying inspired quietly replaces actually acting on the inspiration.`,
      path: `Try following one instinct today before you can fully explain why. You are allowed to trust the download before the proof arrives. What insight have you been sitting on that's actually ready to be spoken?`,
    },
    '22_BIRTHDAY': {
      heading: `Master Birthday Number 22 — A Talent for Making Things Real`,
      why: `You arrived carrying a rare combination that most people never fully develop even in a lifetime — genuine vision paired with the practical capacity to actually build it. This isn't a skill you had to earn through years of trial; it's a gift you were simply born holding, and it shapes how you approach your entire Life Path. Whatever that deeper path asks of you, you carry the rare ability to take something enormous in your imagination and actually finish constructing it in the material world, not just describe it beautifully to other people.`,
      traits: `You think in systems and structures, not just isolated ideas. Ambition doesn't intimidate you the way it does most people — it energizes you. You're one of the few people who can hold a genuinely large vision and still care about the small, tedious steps that get it built.`,
      shadow: `Left unrefined, this rare capability stalls at the planning stage — ambition so large it never fully commits to a first, imperfect, small step. You can spend so long perfecting the blueprint that the building never actually begins. The gift narrows the moment the size of the vision becomes an excuse to never start something smaller than it.`,
      path: `Try turning one idea into a genuinely small, real first step today. You are allowed to start modestly on something enormous. What has waiting for the "right scale" been costing you in never actually beginning?`,
    },
    '33_BIRTHDAY': {
      heading: `Master Birthday Number 33 — A Talent for Healing`,
      why: `You were born with an unusually deep capacity for service — care so genuine that other people can feel it land, not as performance but as something structural to who you actually are. This isn't a talent you cultivated over time; it's one you arrived already carrying, and it colors your entire Life Path with a rare, selfless generosity. Whatever that deeper path eventually asks of you, part of the gift you bring to it is a kind of care most people spend a lifetime trying to learn and never quite reach.`,
      traits: `People bring you their real problems, sensing you'll actually hold them well. You give without keeping score, often without noticing you're doing it. Teaching, comforting, and healing come to you more naturally than almost anything else.`,
      shadow: `Left unrefined, this depth of care becomes self-erasing — giving so completely that your own needs quietly stop registering as needs at all. You can become the person everyone leans on, while nobody, including you, notices that you've stopped being held in return. The gift narrows the moment your own care never makes it back to you.`,
      path: `Try naming one thing you need today instead of assuming it can wait until everyone else's needs are met. You are allowed to be looked after too, not only to look after others. What have you been quietly postponing about your own care?`,
    },

    // ── Personal Year (classical, birth month + birth day + CURRENT year —
    // dynamic, changes annually). Distinct from the app's Arcana-based
    // Yearly Energy. ─────────────────────────────────────────────────────────
    '1_PYEAR': {
      heading: `Personal Year 1 — A Year for Starting Over`,
      why: `This particular turn of the calendar is asking something specific of you that last year wasn't: a real beginning. Not a small adjustment or a patch on something worn out, but an actual fresh start — a new project, a new direction, a version of your life that doesn't need the old one's permission to exist. Years like this arrive at the start of a longer nine-year cycle, which is part of why they can feel disproportionately significant; whatever gets planted now tends to set the tone for everything that follows it.`,
      traits: `Momentum feels more available to you right now than it usually does. New ideas arrive with unusual clarity. Old hesitations that used to hold you back can suddenly feel less convincing than they did last year.`,
      shadow: `The risk this year is mistaking motion for direction — starting things simply to feel the relief of movement, without checking whether they actually deserve the energy you're about to give them. Not every fresh start this year offers is one worth taking.`,
      path: `Try beginning one thing this month that you've been circling for a while, even before you feel fully ready for it. You are allowed to start imperfectly. What has been waiting on the other side of your hesitation?`,
    },
    '2_PYEAR': {
      heading: `Personal Year 2 — A Year for Partnership`,
      why: `After a year built around individual momentum, this one deliberately slows the pace and turns your attention toward other people — genuine cooperation, patience, and relationships that need real tending rather than quick decisions. It can feel like a step down in intensity compared to last year, but it isn't; it's asking for a different kind of skill, one built on timing and trust rather than speed.`,
      traits: `You're likely more sensitive to other people's needs and moods than usual right now. Diplomacy comes more easily this year, sometimes at the cost of your own directness. Partnerships — romantic, professional, or otherwise — carry unusual weight this year.`,
      shadow: `The risk is letting patience slide into passivity — waiting so thoroughly for the right moment that you forget to actually say what you think in the meantime. A relationship built entirely on your accommodation isn't the partnership this year is actually asking you to build.`,
      path: `Try being patient with one situation this month without giving up your own voice inside it. You are allowed to wait for the right timing and still speak up along the way. Where have you gone quiet in the name of cooperation?`,
    },
    '3_PYEAR': {
      heading: `Personal Year 3 — A Year for Being Seen`,
      why: `This year opens up real room for expression, creativity, and being visible in a way the previous two years didn't especially favor. Whatever you've been quietly building or holding back now has genuine social and creative momentum behind it — this is a good stretch to actually put your work, and yourself, out where people can see them.`,
      traits: `Your natural charm and expressiveness are more available this year than usual. Social opportunities tend to multiply. Creative work that felt stuck may suddenly find real traction.`,
      shadow: `The risk is scattering this abundant energy across too many fun, low-stakes distractions, leaving the actual creative work you care about unfinished underneath all the socializing. This year rewards output, not just activity.`,
      path: `Try sharing one thing you've made this month, even in an unfinished state. You are allowed to be seen before it's perfect. What have you been polishing privately that's actually ready for an audience?`,
    },
    '4_PYEAR': {
      heading: `Personal Year 4 — A Year for Groundwork`,
      why: `This year is less about excitement and more about consequence — the discipline and structure you put in place now tend to determine how solid the years that follow actually turn out to be. It can feel slower or duller than the years around it, but that's the point: this is a building year, not a showcase year, and what you lay down now matters more than it looks like it does in the moment.`,
      traits: `Patience for slow, unglamorous work tends to be higher this year than usual. Practical concerns — finances, health, routine — ask for more of your attention. Long-term thinking comes more naturally right now.`,
      shadow: `The risk is letting necessary structure tip into rigid over-control — becoming so committed to the plan that you can't adjust it even when the plan itself clearly needs revising. Discipline that can't bend eventually breaks.`,
      path: `Try sticking with one unglamorous task this month past the point where it stops feeling exciting. You are allowed to find it dull and keep showing up anyway. What foundation are you laying now that you won't see the value of for years?`,
    },
    '5_PYEAR': {
      heading: `Personal Year 5 — A Year for Change`,
      why: `After a year of steady groundwork, this one deliberately shakes things loose — genuine unpredictability arrives, in travel, relationships, work, or simply the shape of your days, and it rewards flexibility far more than it rewards resistance. Trying to hold this year to last year's structure will likely be the most exhausting way to live through it.`,
      traits: `Restlessness and curiosity both run higher than usual this year. New people and unfamiliar situations tend to find you more than usual. Your tolerance for routine is probably at its lowest point in the whole nine-year cycle right now.`,
      shadow: `The risk is chasing every new option this year offers without letting any single one have the time it needs to actually become something real. Change for its own sake, unanchored to any real direction, tends to leave this kind of year feeling busy but hollow in hindsight.`,
      path: `Try saying yes to one genuinely unplanned opportunity this month. You are allowed to let this year surprise you instead of trying to control it. What have you been resisting purely because it wasn't part of the plan?`,
    },
    '6_PYEAR': {
      heading: `Personal Year 6 — A Year for Home and Responsibility`,
      why: `This year turns your attention toward home, family, and the people closest to you — real responsibility tends to arrive, whether you asked for it or not, and so does the genuine reward of tending to what actually matters most to you. It's a heavier year in some ways than the one before it, but the weight is usually meaningful rather than random.`,
      traits: `Your instinct to care for people and spaces is stronger than usual this year. Domestic and family matters carry more weight than they typically would. You're likely to be leaned on more this year — and to lean on others more too, if you let yourself.`,
      shadow: `The risk is over-functioning for everyone around you until the whole year quietly gets spent managing other people's needs, with none of that same care coming back to you. A year built around responsibility isn't meant to be a year built around self-neglect.`,
      path: `Try asking someone for real help with one responsibility this month, instead of carrying all of it alone. You are allowed to be supported this year, not only supportive. Where has your caretaking gone one-directional?`,
    },
    '7_PYEAR': {
      heading: `Personal Year 7 — A Year for Reflection`,
      why: `This year pulls inward on purpose — study, solitude, and real reflection are favored over the outward-facing momentum of the years around it. It can feel like a quieter, slower stretch compared to what came before, but that quiet is doing real work: this is the year the rest of the nine-year cycle's meaning gets processed and understood, not just lived through.`,
      traits: `Your need for solitude and depth is stronger than usual this year. Superficial socializing may feel less satisfying than it normally does. Intuition and insight tend to sharpen considerably during a year like this.`,
      shadow: `The risk is retreating so far inward that needed rest turns into genuine disconnection from the people who actually care about you. Reflection that never resurfaces to be shared eventually just becomes isolation with a better excuse.`,
      path: `Try reaching out to one person this month even in the middle of a quieter season. You are allowed to reflect deeply and still stay reachable. What insight from this year is actually ready to be spoken out loud?`,
    },
    '8_PYEAR': {
      heading: `Personal Year 8 — A Year for Ambition`,
      why: `This year favors material progress in a way the quieter reflection of the year before it didn't — career, money, and real authority all tend to move more than usual, rewarding focused, deliberate effort rather than passive hope. This is generally considered one of the more consequential years in the nine-year cycle for anything you're trying to build at scale.`,
      traits: `Your drive and capacity for sustained effort are unusually high this year. Opportunities tied to money, status, or leadership tend to surface more often. You're likely to feel more comfortable claiming real authority than you typically do.`,
      shadow: `The risk is measuring the entire year purely by results, letting anything that doesn't show up on a scoreboard quietly stop counting — including rest, feeling, and connection. A powerful year built around ambition can still cost you plenty if nothing else is allowed to matter alongside it.`,
      path: `Try noting one non-material win this month alongside whatever material progress you're making. You are allowed to be ambitious and still count the parts that don't show up in a bank account. What has this year's drive been quietly crowding out?`,
    },
    '9_PYEAR': {
      heading: `Personal Year 9 — A Year for Letting Go`,
      why: `This year closes out the nine-year cycle it belongs to — endings, release, and clearing space for what's next are the actual work of a year like this, even when the letting go is genuinely hard. Nothing that leaves this year was meant to stay for the next cycle; the discomfort of that is part of how the closing gets done properly.`,
      traits: `A pull toward simplifying and releasing is stronger than usual this year. Old chapters — relationships, jobs, identities — may naturally start concluding on their own. Generosity and a wider perspective tend to come more easily during a year like this.`,
      shadow: `The risk is clinging to what this year is trying to close, dragging an ending out well past the point it needed to end, simply because letting go is harder than holding on. A resisted ending doesn't stop being an ending — it just gets more painful in the meantime.`,
      path: `Try releasing one thing this month that's already run its actual course. You are allowed to grieve it and still let it go completely. What is this year quietly asking you to finish?`,
    },
    '11_PYEAR': {
      heading: `Master Personal Year 11 — A Year of Heightened Intuition`,
      why: `This is a master year, carrying more charge than the single-digit years around it — inspiration and insight run ahead of logic this year, and genuine creative or spiritual downloads arrive asking to be acted on rather than simply noticed and set aside. Years like this can feel intense in a way that's hard to fully explain to people not going through the same cycle themselves.`,
      traits: `Your intuition is unusually sharp this year, sometimes almost uncomfortably so. Ideas and insights arrive with more force and frequency than usual. A sense of being at a genuine threshold tends to run underneath the whole year.`,
      shadow: `The risk is staying purely inspired without grounding any of it into something real — a whole year spent feeling electric and significant, but with nothing actually built to show for the intensity by the time it ends. Inspiration this strong needs an outlet, or it just becomes exhausting.`,
      path: `Try turning one insight this month into a real, concrete action, however small. You are allowed to be inspired and still be practical about it. What has this year's intensity been asking you to actually build?`,
    },
    '22_PYEAR': {
      heading: `Master Personal Year 22 — A Year for Building Big`,
      why: `This is a master year, and it carries a rare, potent combination — genuine capacity to build something large and lasting is unusually strong right now, pairing vision with the practical follow-through to actually finish what gets started. Years like this don't come around often, and what gets built during one tends to have real staying power.`,
      traits: `Your ability to combine big-picture vision with practical execution is heightened this year. Projects that felt too large to attempt before may suddenly feel genuinely achievable. Your energy and drive are considerable, though not infinite.`,
      shadow: `The risk is overextending past your actual capacity, letting the scale of what's possible this year outpace what your body and nervous system can actually sustain. A powerful year can still become a depleting one if pace never gets managed alongside ambition.`,
      path: `Try pacing one big project this month against your real energy, not just its potential scale. You are allowed to build big and still rest deliberately. Where has this year's ambition been outrunning your own limits?`,
    },
    '33_PYEAR': {
      heading: `Master Personal Year 33 — A Year of Deep Service`,
      why: `This is a master year, and it puts you in a position to genuinely help, teach, or heal others in a way that carries real weight — the capacity for deep, selfless service is heightened right now, more than in an ordinary year. What you offer people during a year like this tends to actually land, and to be remembered.`,
      traits: `Your instinct to care for and guide others is stronger than usual this year. People may seek you out for support more than they normally would. A sense of larger purpose tends to run underneath the year's ordinary events.`,
      shadow: `The risk is giving so completely to others this year that your own needs get quietly and repeatedly deprioritized, until the service that was meant to be sustainable becomes depleting instead. A year built around care for others still needs to include care for yourself.`,
      path: `Try keeping one part of this month purely for yourself, unspent on anyone else's needs. You are allowed to serve others deeply and still be replenished yourself. What has this year's generosity been quietly costing you?`,
    },

    // ── 1 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_F1': {
      heading: `Launching What He Couldn't`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Paternal Masculine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea. You are allowed to launch it for yourself, not only for them. What venture would feel like your own even as it completes theirs?`,
      positive: `The pull to start what your paternal line never launched hasn't changed — what's different is that you now follow it all the way through. You still feel that same charge toward the venture, but it's converting into something actually built now, instead of another almost-beginning. Every step you carry past the point they stalled finishes a little more of what was only ever wanted, not attempted.`,
      negative: `The pull to start what your paternal line never launched is completely real, and it keeps arriving without the follow-through attached — venture after venture almost-begun, each one carrying the same unexplained charge as the last. That repeated near-miss isn't a personal failure of commitment. It's an old incompleteness still looking for the one launch that actually gets finished.`,
    },

    // ── 2 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_F1': {
      heading: `Instinct Over Inheritance`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real inner knowing that circumstance, expectation, or a demand for constant rationality never allowed to be trusted or acted on. The High Priestess sits in your Paternal Masculine Line, meaning this generation's task may be to trust intuition the way that line never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it. You are allowed to trust the instinct they had to override. What is your gut currently saying that a man before you was never permitted to follow?`,
      positive: `The instinct itself hasn't changed — it was always sharp, always early, always more accurate than it had proof for. What's different is that you now act on it before you've built the rational case, letting a felt sense be reason enough sometimes. Each time you follow it and it lands, you're completing a permission the men in your line sensed but never let themselves take.`,
      negative: `The instinct is completely real, and it keeps getting overridden the moment it can't be logically justified — a true read set aside in favor of whatever can be proven instead. That habit of second-guessing what you already know isn't caution; it's the same silencing that kept your paternal line from ever trusting their own gut, still running through you unexamined.`,
    },

    // ── 3 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_F1': {
      heading: `Softness, Reclaimed`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for creativity, nurture, or open warmth that rigid expectations of masculinity never allowed to be expressed. The Empress sits in your Paternal Masculine Line, meaning this generation's task may be to live openly what that line had to keep hidden.`,
      shadow: `The risk is inheriting the same suppression in a new form — real creative or nurturing capacity present in you, but kept private or minimized out of an old, unexamined caution. If your gentler, more generative side rarely gets to show fully, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or warmth openly in one specific setting this week, without softening or hiding it as you might by habit. You are allowed to be soft in public, on the record. What creative tenderness could you live this month that the line kept indoors?`,
      positive: `The creativity and warmth were always genuinely there — what's different is that they're no longer kept indoors. One setting at a time, you let the softer, more generative side of yourself take up real space, instead of trimming it down before anyone can see it. Each time you do, you're living openly what your paternal line had to keep private.`,
      negative: `The creative and nurturing capacity is completely real, and it stays minimized or hidden more often than not, trimmed down out of an old, unexamined caution about what men in that line were allowed to show. That habit of shrinking your gentler side before it's fully expressed isn't modesty — it's the same suppression this task exists to finally end.`,
    },

    // ── 4 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_F1': {
      heading: `Authority, Rebalanced`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — real leadership potential either never claimed at all, or claimed in a way that curdled into harshness rather than genuine authority. The Emperor sits in your Paternal Masculine Line, meaning this generation's task may be to hold authority in a way that line never managed to.`,
      shadow: `The risk is repeating whichever half of the imbalance was more prominent — either avoiding authority entirely out of fear of becoming harsh, or gripping control too tightly the way an ancestor once did. If your relationship to leadership swings toward one of these extremes, that old imbalance may still be running.`,
      path: `This may shift by taking on one piece of real responsibility this week, leading it with firmness and genuine care held together, not one at the expense of the other. You are allowed to hold authority without repeating either the absence or the iron. What would balanced command look like in your actual week?`,
      positive: `Your capacity for real authority hasn't changed — what's different is that firmness and genuine care now show up together instead of one crowding out the other. Leading a piece of responsibility no longer means choosing between being effective and being kind. That combination is exactly the balance the men in your line either avoided or gripped too hard to find.`,
      negative: `The authority is completely real, and it keeps swinging to one extreme or the other — either avoided out of fear of becoming harsh, or gripped tightly the way it was once modelled. That oscillation isn't indecision about leadership. It's an old imbalance between claiming power and fearing its cost, still unresolved and still running its course through you.`,
    },

    // ── 5 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_F1': {
      heading: `A Calling, Answered`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected path. The Hierophant sits in your Paternal Masculine Line, meaning this generation's task may be to actually answer a calling that line had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such. You are allowed to guide before you feel qualified — the calling has waited long enough. Who is already learning from you informally?`,
      positive: `The pull toward teaching and guidance hasn't changed — what's different is that you now name it outright instead of offering it quietly on the side. One role claimed formally, instead of one more year of unofficial mentoring, completes something the men in your line had to set down for a more conventional path they felt safer taking.`,
      negative: `The calling toward teaching or guiding others is completely real, and it keeps arriving informally — advice given, wisdom shared, never actually named as the role it already functions as. That reluctance to claim it outright isn't humility. It's the same setting-aside your paternal line practiced, still shaping how much of the calling you'll let yourself own.`,
    },

    // ── 6 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_F1': {
      heading: `Choosing Love Freely`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Paternal Masculine Line, meaning this generation's task may be to choose love from genuine preference where that line couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice. You are allowed to choose love with your heart and let duty adjust. What would choosing freely look like in your closest bond right now?`,
      positive: `Your capacity for real partnership hasn't changed — what's different is that genuine desire now leads the choosing, with duty adjusting around it instead of the other way around. Naming what you actually want and choosing toward it, even when it costs some comfort, completes a freedom the men in your line never let themselves exercise.`,
      negative: `The capacity to love is completely real, and the choosing keeps running on duty and expectation rather than genuine wanting — a partner selected, or stayed with, because it satisfies what's expected rather than what's actually desired. That pattern isn't commitment. It's the same sacrifice your paternal line made, still shaping your closest bond from underneath.`,
    },

    // ── 7 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_F1': {
      heading: `Finishing What Stalled`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Paternal Masculine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted. You are allowed to finish it slowly, imperfectly, but actually. What interrupted goal in your life rhymes with theirs — and what is its next step?`,
      positive: `The drive toward the goal hasn't changed — what's different is that it now carries through to an actual finish instead of stopping short. One stalled ambition, pushed the last distance rather than left interrupted, resolves something the men in your line never got the circumstances to complete for themselves.`,
      negative: `The ambition and drive are completely real, and they keep stalling at nearly the same point every time — momentum spent, then quietly abandoned just short of the line. That pattern isn't a lack of stamina. It's an old interruption echoing forward, still stopping the pursuit exactly where circumstance once stopped it for someone before you.`,
    },

    // ── 8 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_F1': {
      heading: `Settling an Old Unfairness`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Paternal Masculine Line, meaning this generation's task may be to bring genuine resolution to something that line had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness in your paternal line actually was, and consciously choosing to resolve rather than continue carrying it. You are allowed to settle the account by living justly, not by re-litigating it. What would settled feel like in your body?`,
      positive: `The sensitivity to unfairness hasn't changed — it was always sharp and always real — but you've named what the original imbalance actually was and let yourself settle it by living justly rather than re-litigating it. That resolution is exactly what the men in your line had to leave standing, unable to close it in their own time.`,
      negative: `The sensitivity to injustice is completely real, and its intensity keeps outrunning whatever's actually happening in front of you — a present slight met with a reaction that belongs to something considerably older. That disproportion isn't oversensitivity. It's an unresolved unfairness from your paternal line still generating heat, waiting for someone to finally settle the account.`,
    },

    // ── 9 in PATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_F1': {
      heading: `Solitude, Finally Claimed`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Paternal Masculine Line, meaning this generation's task may be to claim the solitude that line was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first. You are allowed to take the solitude without apology or permission slip. What would one genuinely unaccountable afternoon give you?`,
      positive: `The need for real withdrawal hasn't changed — what's different is that you now take it without needing to justify it as productive first. One genuinely unaccountable afternoon, claimed outright, completes a permission the men in your line were never allowed to give themselves under the weight of constant duty.`,
      negative: `The need for solitude is completely real, and it keeps losing to an inherited compulsion to fill every available space with obligation to someone else. That inability to justify time alone, even when nothing urgent requires you, isn't diligence. It's the same relentless duty your paternal line carried, still deciding your schedule from underneath.`,
    },

    // ── 10 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_F1': {
      heading: `Peace With a Derailed Plan`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Paternal Masculine Line, meaning this generation's task may be to find peace with life's turns where that line couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it. You are allowed to make peace with what no one could have controlled. What derailed plan — theirs or yours — is ready to be grieved rather than fixed?`,
      positive: `The sensitivity to disruption hasn't changed — sudden turns still register — but you've named one circumstance genuinely beyond your control and chosen acceptance over continued resistance to it. That shift resolves a bitterness the men in your line carried toward a plan that was derailed by nothing they could have prevented.`,
      negative: `The sensitivity to disrupted plans is completely real, and every uncontrollable turn keeps landing as personal injustice rather than simply how life moves. That disproportionate unfairness isn't paranoia. It's an inherited resistance to circumstances no one could have controlled, still refusing to settle in you the way it never settled in the line before you.`,
    },

    // ── 11 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_F1': {
      heading: `Strength That Includes Softness`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for compassionate strength, overridden by a demand to appear tough, unaffected, or hardened instead. The Strength sits in your Paternal Masculine Line, meaning this generation's task may be to lead with a strength that line was only allowed to show as harshness.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as toughness, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it. You are allowed to let gentleness count as the strength. Where could softness succeed this week where toughness has been stalling?`,
      positive: `The strength was always real — what's different is that gentleness now stands alongside it instead of being hidden by it. Leading a difficult moment with visible compassion, not just toughness, completes a fuller resilience than the men in your line were ever permitted to show, since they were only allowed to harden.`,
      negative: `The capacity for real strength is completely genuine, and it keeps expressing itself only as toughness, cut off from the compassionate counterpart that was always available underneath. That hardening isn't who you actually are. It's the version of strength your paternal line was forced into, still standing in for the fuller one you're capable of.`,
    },

    // ── 12 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_F1': {
      heading: `Rebalancing a Life Given Away`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Paternal Masculine Line, meaning this generation's task may be to reclaim active choice for yourself where that line only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's. You are allowed to put your own needs on the ledger they left blank. What would you claim for yourself first if rebalancing started today?`,
      positive: `The capacity for genuine care and duty hasn't changed — what's different is that your own needs now get named and prioritized alongside it, instead of deferred indefinitely. Claiming something for yourself first, even briefly, completes a balance the men in your line never got the room to ask for.`,
      negative: `The devotion to others' needs is completely real, and your own keep going unconsidered underneath it, so thoroughly that you may struggle to even name what you currently need. That total deferral isn't selflessness. It's the same imbalance your paternal line lived inside, a life given entirely away with nothing set aside.`,
    },

    // ── 13 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_F1': {
      heading: `Completing What He Avoided`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Paternal Masculine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way that line did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it. You are allowed to walk into the change they turned from. What transition are you uniquely positioned to complete instead of inherit?`,
      positive: `The instinct to hold on hasn't disappeared — but you've identified one ending that's clearly due and chosen to meet it directly instead of continuing to resist it. That willingness to walk into necessary change completes a transformation the men in your line postponed until circumstance forced it on them anyway.`,
      negative: `The resistance to change is completely real, and it keeps gripping tightly to what's already finished, simply because letting go feels dangerous rather than simply overdue. That grip isn't loyalty to what was. It's an old avoidance from your paternal line, still refusing the ending that eventually arrives regardless.`,
    },

    // ── 14 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_F1': {
      heading: `Steadying a Life of Extremes`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, excess, or rigid self-denial. The Temperance sits in your Paternal Masculine Line, meaning this generation's task may be to find the steadiness that line's life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or excess, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme. You are allowed to live steadily without it feeling like a smaller life. What extreme are you ready to retire on the line's behalf?`,
      positive: `The capacity for real commitment hasn't changed — what's different is that it now runs at a sustainable pace instead of swinging between extremes. One small, steady practice, held rather than abandoned, completes a balance the men in your line's lives never actually managed to find between overwork and collapse.`,
      negative: `The intensity is completely real, and it keeps alternating between overexertion and equally intense collapse or excess, with nothing steady in between. That swing isn't a personality trait. It's an old imbalance from your paternal line, still running through you as the only two speeds available.`,
    },

    // ── 15 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_F1': {
      heading: `A Bind, Released`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real entrapment, whether addiction, compulsion, or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Paternal Masculine Line, meaning this generation's task may be to release a bind that line was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a substance, a pattern, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed. You are allowed to release the bind — your hands are freer than theirs were. What first loosening is actually available to you this month?`,
      positive: `The pull toward the bind hasn't necessarily vanished — but you've named your own version of it honestly and taken one real step toward loosening it, rather than accepting it as fixed. That step completes a freedom the men in your line sensed but were never able to actually reach.`,
      negative: `The bind is completely real, and it keeps being accepted as simply how things are, never questioned, never approached as something that could actually loosen. That acceptance isn't peace with your circumstances. It's an old entrapment from your paternal line, still running because it's never been named as something to release.`,
    },

    // ── 16 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_F1': {
      heading: `Finishing the Rebuild`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Paternal Masculine Line, meaning this generation's task may be to complete a reconstruction that line started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse. You are allowed to rebuild past where the rebuilding stopped. What would finished look like — not restored, but truly rebuilt?`,
      positive: `The caution after collapse hasn't fully disappeared — but you've fully invested in one area of stability instead of holding back in anticipation of its fall. That investment completes a reconstruction the men in your line survived enough to start and never had the chance to actually finish.`,
      negative: `The caution around stability is completely understandable, and it keeps holding you back from fully investing in what's actually solid, bracing for a collapse that already happened once, long ago. That hesitation isn't wisdom. It's an unfinished rebuilding from your paternal line, still treating stability as something that hasn't been earned back yet.`,
    },

    // ── 17 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_F1': {
      heading: `Restoring Abandoned Hope`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Paternal Masculine Line, meaning this generation's task may be to restore a hope that line felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it. You are allowed to hope again where the line went quiet. What abandoned hope of theirs feels strangely alive in you?`,
      positive: `The guardedness around hope hasn't fully lifted — but you've named one genuine hope out loud and let yourself act on it rather than defending against it. That willingness restores something the men in your line felt forced to abandon after a disappointment real enough to make hoping again feel unsafe.`,
      negative: `The guardedness against hope is completely understandable, and it keeps functioning as protection from disappointment at the cost of ever genuinely believing things could improve. That reflexive cynicism isn't realism. It's an old abandonment from your paternal line, still deciding what you'll let yourself want.`,
    },

    // ── 18 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_F1': {
      heading: `Seeing the Unfaced Fear`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Paternal Masculine Line, meaning this generation's task may be to see clearly what that line could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it. You are allowed to look at the fear in full light. If you faced it plainly once — what might stop being handed down?`,
      positive: `The unease hasn't necessarily disappeared — but you've named one fear as specifically as you can and looked at it directly instead of around it. That clarity is exactly what the men in your line were never able to reach, leaving the fear to operate in the background instead.`,
      negative: `The unease is completely real, and it keeps shaping decisions from the background without ever being examined directly, an anxiety with no clear name attached to it. That fog isn't confusion about what you want. It's an old, unfaced fear from your paternal line, still steering choices from somewhere just out of view.`,
    },

    // ── 19 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_F1': {
      heading: `Letting Joy Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real capacity for open joy and warmth, kept behind a wall of stoicism or emotional reserve considered proper or necessary. The Sun sits in your Paternal Masculine Line, meaning this generation's task may be to let visible joy exist where that line only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a controlled surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure. You are allowed to be visibly, audibly glad. What joy could you let show this week that stoicism would have swallowed?`,
      positive: `The joy was always genuinely there — what's different is that it's now visible, audible, let out from behind the usual composure. One moment of real happiness shown openly completes a warmth the men in your line actually felt but were never permitted to display.`,
      negative: `The capacity for real joy is completely genuine, and it keeps staying behind a controlled, stoic surface, felt more than it's ever shown. That restraint isn't dignity. It's an old inheritance from your paternal line, where visible gladness was considered improper, still deciding how much of your happiness reaches your face.`,
    },

    // ── 20 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_F1': {
      heading: `Taking Up the Calling`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Paternal Masculine Line, meaning this generation's task may be to answer a call that line heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it. You are allowed to take up the calling mid-life, mid-doubt. What would answering it look like at the smallest real scale?`,
      positive: `The calling hasn't changed — you've sensed it clearly for a while — but you've taken one concrete first step toward it instead of continuing to only recognize it. That step completes an awakening the men in your line heard just as clearly and were never able to actually take up.`,
      negative: `The calling is completely real, sensed clearly and specifically, and it keeps being delayed rather than acted on, as though recognizing it were the same as answering it. That delay isn't indecision. It's an old, unanswered call from your paternal line, still waiting for someone to move on it instead of just hearing it.`,
    },

    // ── 21 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_F1': {
      heading: `Completing the Unfinished`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Paternal Masculine Line, meaning this generation's task may be to reach a completion that line never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further. You are allowed to be the completion the line was waiting for. What unfinished thing, finished by you, would echo backward through generations?`,
      positive: `The capacity for real, sustained effort hasn't changed — what's different is that you've identified one near-complete piece of work and deliberately closed it out instead of extending it further. That closure resolves an incompletion the men in your line worked toward for a lifetime without ever getting to feel the finish.`,
      negative: `The effort and progress are completely real, and the finish line keeps moving just out of reach, treated as always one step further than wherever you currently are. That perpetual almost-there isn't a lack of capability. It's an old incompletion from your paternal line, still deciding that arrival isn't actually available to you.`,
    },

    // ── 22 in PATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_F1': {
      heading: `Reclaiming Traded Freedom`,
      why: `This Ancestral Task may carry an unfulfilled dream from the men in your father's direct line — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Paternal Masculine Line, meaning this generation's task may be to reclaim the freedom that line gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety. You are allowed to buy the freedom back — the trade wasn't permanent. What secure thing would you loosen first to breathe again?`,
      positive: `The pull toward the safer option hasn't necessarily vanished — but you've chosen the freer, less conventional path in one specific situation instead of defaulting to security again. That choice reclaims a freedom the men in your line traded away for a safety they felt they had no other option but to choose.`,
      negative: `The desire for real freedom is completely genuine, and it keeps losing to a reflexive pull toward the secure option, even in situations where the risk would actually be worth taking. That default isn't prudence. It's an old trade from your paternal line, still deciding that safety wins by default, whether or not it's actually needed.`,
    },

    // ── 1 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '1_G1': {
      heading: `Starting Where He Stalled`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Maternal Masculine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea. You are allowed to start what he could only imagine starting. What would the first week of that venture actually contain?`,
      positive: `The pull to start what your mother's father never launched hasn't changed — what's different is that you now follow it all the way through. You still feel that same charge toward the venture, but it's converting into something actually built now, instead of another almost-beginning. Every step you carry past the point he stalled finishes a little more of what was only ever wanted, not attempted.`,
      negative: `The pull to start what your mother's father never launched is completely real, and it keeps arriving without the follow-through attached — venture after venture almost-begun, each one carrying the same unexplained charge as the last. That repeated near-miss isn't a personal failure of commitment. It's an old incompleteness still looking for the one launch that actually gets finished.`,
    },

    // ── 2 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '2_G1': {
      heading: `Trusting What He Doubted`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real inner knowing that circumstance, expectation, or a demand for constant rationality never allowed to be trusted or acted on. The High Priestess sits in your Maternal Masculine Line, meaning this generation's task may be to trust intuition the way he never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it. You are allowed to follow your knowing where his had to defer. What decision is yours right now that instinct has already made?`,
      positive: `The instinct itself hasn't changed — it was always sharp, always early, always more accurate than it had proof for. What's different is that you now act on it before you've built the rational case, letting a felt sense be reason enough sometimes. Each time you follow it and it lands, you're completing a permission your mother's father sensed but never let himself take.`,
      negative: `The instinct is completely real, and it keeps getting overridden the moment it can't be logically justified — a true read set aside in favor of whatever can be proven instead. That habit of second-guessing what you already know isn't caution; it's the same silencing that kept your mother's father from ever trusting his own gut, still running through you unexamined.`,
    },

    // ── 3 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '3_G1': {
      heading: `Reclaiming a Softer Side`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for creativity, nurture, or open warmth that rigid expectations of masculinity never allowed him to express. The Empress sits in your Maternal Masculine Line, meaning this generation's task may be to live openly what he had to keep hidden.`,
      shadow: `The risk is inheriting the same suppression in a new form — real creative or nurturing capacity present in you, but kept private or minimized out of an old, unexamined caution. If your gentler, more generative side rarely gets to show fully, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or warmth openly in one specific setting this week, without softening or hiding it as you might by habit. You are allowed to live the creative side he kept in the drawer. What making, tending, or beautifying is asking to enter your ordinary days?`,
      positive: `The creativity and warmth were always genuinely there — what's different is that they're no longer kept indoors. One setting at a time, you let the softer, more generative side of yourself take up real space, instead of trimming it down before anyone can see it. Each time you do, you're living openly what your mother's father had to keep private.`,
      negative: `The creative and nurturing capacity is completely real, and it stays minimized or hidden more often than not, trimmed down out of an old, unexamined caution about what he was allowed to show. That habit of shrinking your gentler side before it's fully expressed isn't modesty — it's the same suppression this task exists to finally end.`,
    },

    // ── 4 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '4_G1': {
      heading: `Holding Authority Well`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — real leadership potential either never claimed at all, or claimed in a way that curdled into harshness rather than genuine authority. The Emperor sits in your Maternal Masculine Line, meaning this generation's task may be to hold authority in a way he never managed to.`,
      shadow: `The risk is repeating whichever half of the imbalance was more prominent — either avoiding authority entirely out of fear of becoming harsh, or gripping control too tightly the way he once did. If your relationship to leadership swings toward one of these extremes, that old imbalance may still be running.`,
      path: `This may shift by taking on one piece of real responsibility this week, leading it with firmness and genuine care held together, not one at the expense of the other. You are allowed to hold power in the proportion he never found. Where in your life does authority need neither raising nor abandoning — just holding?`,
      positive: `Your capacity for real authority hasn't changed — what's different is that firmness and genuine care now show up together instead of one crowding out the other. Leading a piece of responsibility no longer means choosing between being effective and being kind. That combination is exactly the balance your mother's father either avoided or gripped too hard to find.`,
      negative: `The authority is completely real, and it keeps swinging to one extreme or the other — either avoided out of fear of becoming harsh, or gripped tightly the way it was once modelled. That oscillation isn't indecision about leadership. It's an old imbalance between claiming power and fearing its cost, still unresolved and still running its course through you.`,
    },

    // ── 5 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '5_G1': {
      heading: `Answering a Set-Aside Calling`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected path. The Hierophant sits in your Maternal Masculine Line, meaning this generation's task may be to actually answer a calling he had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such. You are allowed to teach what he set aside teaching. What do you keep explaining to people that is actually a vocation knocking?`,
      positive: `The pull toward teaching and guidance hasn't changed — what's different is that you now name it outright instead of offering it quietly on the side. One role claimed formally, instead of one more year of unofficial mentoring, completes something your mother's father had to set down for a more conventional path he felt safer taking.`,
      negative: `The calling toward teaching or guiding others is completely real, and it keeps arriving informally — advice given, wisdom shared, never actually named as the role it already functions as. That reluctance to claim it outright isn't humility. It's the same setting-aside your mother's father practiced, still shaping how much of the calling you'll let yourself own.`,
    },

    // ── 6 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '6_G1': {
      heading: `Choosing Love, Not Duty`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Maternal Masculine Line, meaning this generation's task may be to choose love from genuine preference where he couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice. You are allowed to let the heart outvote the duty. What choice in love would honor him precisely by being freer than his?`,
      positive: `Your capacity for real partnership hasn't changed — what's different is that genuine desire now leads the choosing, with duty adjusting around it instead of the other way around. Naming what you actually want and choosing toward it, even when it costs some comfort, completes a freedom your mother's father never let himself exercise.`,
      negative: `The capacity to love is completely real, and the choosing keeps running on duty and expectation rather than genuine wanting — a partner selected, or stayed with, because it satisfies what's expected rather than what's actually desired. That pattern isn't commitment. It's the same sacrifice your mother's father made, still shaping your closest bond from underneath.`,
    },

    // ── 7 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '7_G1': {
      heading: `Finishing His Interrupted Goal`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Maternal Masculine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted. You are allowed to carry his interrupted goal across your own finish line. What does completing it — your way — actually require next?`,
      positive: `The drive toward the goal hasn't changed — what's different is that it now carries through to an actual finish instead of stopping short. One stalled ambition, pushed the last distance rather than left interrupted, resolves something your mother's father never got the circumstances to complete for himself.`,
      negative: `The ambition and drive are completely real, and they keep stalling at nearly the same point every time — momentum spent, then quietly abandoned just short of the line. That pattern isn't a lack of stamina. It's an old interruption echoing forward, still stopping the pursuit exactly where circumstance once stopped it for him.`,
    },

    // ── 8 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '8_G1': {
      heading: `Settling His Old Unfairness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Maternal Masculine Line, meaning this generation's task may be to bring genuine resolution to something he had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it. You are allowed to close his old unfairness by refusing to pass it on. What would justice done quietly, in your own conduct, look like?`,
      positive: `The sensitivity to unfairness hasn't changed — it was always sharp and always real — but you've named what the original imbalance actually was and let yourself settle it by living justly rather than re-litigating it. That resolution is exactly what your mother's father had to leave standing, unable to close it in his own time.`,
      negative: `The sensitivity to injustice is completely real, and its intensity keeps outrunning whatever's actually happening in front of you — a present slight met with a reaction that belongs to something considerably older. That disproportion isn't oversensitivity. It's an unresolved unfairness from your mother's father still generating heat, waiting for someone to finally settle the account.`,
    },

    // ── 9 in MATERNAL MASCULINE LINE (Ancestral Tasks) ──────────────────────
    '9_G1': {
      heading: `Claiming the Solitude He Never Had`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Maternal Masculine Line, meaning this generation's task may be to claim the solitude he was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first. You are allowed to take the stillness he never got. What would you hear in a solitude that no one could interrupt?`,
      positive: `The need for real withdrawal hasn't changed — what's different is that you now take it without needing to justify it as productive first. One genuinely unaccountable afternoon, claimed outright, completes a permission your mother's father was never allowed to give himself under the weight of constant duty.`,
      negative: `The need for solitude is completely real, and it keeps losing to an inherited compulsion to fill every available space with obligation to someone else. That inability to justify time alone, even when nothing urgent requires you, isn't diligence. It's the same relentless duty your mother's father carried, still deciding your schedule from underneath.`,
    },

    // ── 10 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '10_G1': {
      heading: `Making Peace With His Derailed Plan`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Maternal Masculine Line, meaning this generation's task may be to find peace with life's turns where he couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it. You are allowed to lay his derailed plan down with honor. What acceptance is available to you that circumstance never offered him?`,
      positive: `The sensitivity to disruption hasn't changed — sudden turns still register — but you've named one circumstance genuinely beyond your control and chosen acceptance over continued resistance to it. That shift resolves a bitterness your mother's father carried toward a plan that was derailed by nothing he could have prevented.`,
      negative: `The sensitivity to disrupted plans is completely real, and every uncontrollable turn keeps landing as personal injustice rather than simply how life moves. That disproportionate unfairness isn't paranoia. It's an inherited resistance to circumstances no one could have controlled, still refusing to settle in you the way it never settled in him.`,
    },

    // ── 11 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '11_G1': {
      heading: `Gentleness Where He Showed Toughness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for compassionate strength, overridden by a demand to appear tough, unaffected, or hardened instead. The Strength sits in your Maternal Masculine Line, meaning this generation's task may be to lead with a strength he was only allowed to show as harshness.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as toughness, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it. You are allowed to be gentle where he could only be hard. Who in your life would feel the difference first?`,
      positive: `The strength was always real — what's different is that gentleness now stands alongside it instead of being hidden by it. Leading a difficult moment with visible compassion, not just toughness, completes a fuller resilience than your mother's father was ever permitted to show, since he was only allowed to harden.`,
      negative: `The capacity for real strength is completely genuine, and it keeps expressing itself only as toughness, cut off from the compassionate counterpart that was always available underneath. That hardening isn't who you actually are. It's the version of strength your mother's father was forced into, still standing in for the fuller one you're capable of.`,
    },

    // ── 12 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '12_G1': {
      heading: `Rebalancing a Life Given to Others`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Maternal Masculine Line, meaning this generation's task may be to reclaim active choice for yourself where he only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's. You are allowed to keep some of the life for yourself. What need of yours goes on the list today, above the fold?`,
      positive: `The capacity for genuine care and duty hasn't changed — what's different is that your own needs now get named and prioritized alongside it, instead of deferred indefinitely. Claiming something for yourself first, even briefly, completes a balance your mother's father never got the room to ask for.`,
      negative: `The devotion to others' needs is completely real, and your own keep going unconsidered underneath it, so thoroughly that you may struggle to even name what you currently need. That total deferral isn't selflessness. It's the same imbalance your mother's father lived inside, a life given entirely away with nothing set aside.`,
    },

    // ── 13 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '13_G1': {
      heading: `Completing the Change He Resisted`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Maternal Masculine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way he did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it. You are allowed to say yes to the change he refused to the end. What door is open in front of you that stayed shut in front of him?`,
      positive: `The instinct to hold on hasn't disappeared — but you've identified one ending that's clearly due and chosen to meet it directly instead of continuing to resist it. That willingness to walk into necessary change completes a transformation your mother's father postponed until circumstance forced it on him anyway.`,
      negative: `The resistance to change is completely real, and it keeps gripping tightly to what's already finished, simply because letting go feels dangerous rather than simply overdue. That grip isn't loyalty to what was. It's an old avoidance from your mother's father, still refusing the ending that eventually arrives regardless.`,
    },

    // ── 14 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '14_G1': {
      heading: `Steadying What He Lost to Extremes`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, excess, or rigid self-denial. The Temperance sits in your Maternal Masculine Line, meaning this generation's task may be to find the steadiness his life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or excess, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme. You are allowed to live between the extremes he swung across. What steady rhythm could your days take that his never found?`,
      positive: `The capacity for real commitment hasn't changed — what's different is that it now runs at a sustainable pace instead of swinging between extremes. One small, steady practice, held rather than abandoned, completes a balance your mother's father's life never actually managed to find between overwork and collapse.`,
      negative: `The intensity is completely real, and it keeps alternating between overexertion and equally intense collapse or excess, with nothing steady in between. That swing isn't a personality trait. It's an old imbalance from your mother's father, still running through you as the only two speeds available.`,
    },

    // ── 15 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '15_G1': {
      heading: `Releasing a Bind He Couldn't Break`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real entrapment, whether addiction, compulsion, or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Maternal Masculine Line, meaning this generation's task may be to release a bind he was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a substance, a pattern, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed. You are allowed to walk out of the bind he died inside. What is the one strand of it you could cut this season?`,
      positive: `The pull toward the bind hasn't necessarily vanished — but you've named your own version of it honestly and taken one real step toward loosening it, rather than accepting it as fixed. That step completes a freedom your mother's father sensed but was never able to actually reach.`,
      negative: `The bind is completely real, and it keeps being accepted as simply how things are, never questioned, never approached as something that could actually loosen. That acceptance isn't peace with your circumstances. It's an old entrapment from your mother's father, still running because it's never been named as something to release.`,
    },

    // ── 16 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '16_G1': {
      heading: `Finishing His Unrebuilt Collapse`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Maternal Masculine Line, meaning this generation's task may be to complete a reconstruction he started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse. You are allowed to finish the rebuild he only began. What in your life is standing at half-height, waiting for your decision to complete it?`,
      positive: `The caution after collapse hasn't fully disappeared — but you've fully invested in one area of stability instead of holding back in anticipation of its fall. That investment completes a reconstruction your mother's father survived enough to start and never had the chance to actually finish.`,
      negative: `The caution around stability is completely understandable, and it keeps holding you back from fully investing in what's actually solid, bracing for a collapse that already happened once, long ago. That hesitation isn't wisdom. It's an unfinished rebuilding from your mother's father, still treating stability as something that hasn't been earned back yet.`,
    },

    // ── 17 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '17_G1': {
      heading: `Restoring Hope He Abandoned`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Maternal Masculine Line, meaning this generation's task may be to restore a hope he felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it. You are allowed to restore the hope past his disappointment. What would hoping again, carefully but truly, look like this year?`,
      positive: `The guardedness around hope hasn't fully lifted — but you've named one genuine hope out loud and let yourself act on it rather than defending against it. That willingness restores something your mother's father felt forced to abandon after a disappointment real enough to make hoping again feel unsafe.`,
      negative: `The guardedness against hope is completely understandable, and it keeps functioning as protection from disappointment at the cost of ever genuinely believing things could improve. That reflexive cynicism isn't realism. It's an old abandonment from your mother's father, still deciding what you'll let yourself want.`,
    },

    // ── 18 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '18_G1': {
      heading: `Facing the Fear He Avoided`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Maternal Masculine Line, meaning this generation's task may be to see clearly what he could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it. You are allowed to see the fear clearly that he only felt darkly. Named and measured — how big is it really?`,
      positive: `The unease hasn't necessarily disappeared — but you've named one fear as specifically as you can and looked at it directly instead of around it. That clarity is exactly what your mother's father was never able to reach, leaving the fear to operate in the background instead.`,
      negative: `The unease is completely real, and it keeps shaping decisions from the background without ever being examined directly, an anxiety with no clear name attached to it. That fog isn't confusion about what you want. It's an old, unfaced fear from your mother's father, still steering choices from somewhere just out of view.`,
    },

    // ── 19 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '19_G1': {
      heading: `Letting His Hidden Joy Be Seen`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real capacity for open joy and warmth, kept behind a wall of stoicism or emotional reserve considered proper or necessary. The Sun sits in your Maternal Masculine Line, meaning this generation's task may be to let visible joy exist where he only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a controlled surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure. You are allowed to let the gladness through the stoic gate. What happiness would you show today if showing it were a family repair?`,
      positive: `The joy was always genuinely there — what's different is that it's now visible, audible, let out from behind the usual composure. One moment of real happiness shown openly completes a warmth your mother's father actually felt but was never permitted to display.`,
      negative: `The capacity for real joy is completely genuine, and it keeps staying behind a controlled, stoic surface, felt more than it's ever shown. That restraint isn't dignity. It's an old inheritance from your mother's father, where visible gladness was considered improper, still deciding how much of your happiness reaches your face.`,
    },

    // ── 20 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '20_G1': {
      heading: `Taking Up His Unanswered Calling`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Maternal Masculine Line, meaning this generation's task may be to answer a call he heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it. You are allowed to answer the summons he heard and set down. What is it asking of you specifically — not of him, of you?`,
      positive: `The calling hasn't changed — you've sensed it clearly for a while — but you've taken one concrete first step toward it instead of continuing to only recognize it. That step completes an awakening your mother's father heard just as clearly and was never able to actually take up.`,
      negative: `The calling is completely real, sensed clearly and specifically, and it keeps being delayed rather than acted on, as though recognizing it were the same as answering it. That delay isn't indecision. It's an old, unanswered call from your mother's father, still waiting for someone to move on it instead of just hearing it.`,
    },

    // ── 21 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '21_G1': {
      heading: `Completing What He Left Undone`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Maternal Masculine Line, meaning this generation's task may be to reach a completion he never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further. You are allowed to write the ending he never reached. What completion in your hands would let something in the line finally rest?`,
      positive: `The capacity for real, sustained effort hasn't changed — what's different is that you've identified one near-complete piece of work and deliberately closed it out instead of extending it further. That closure resolves an incompletion your mother's father worked toward for a lifetime without ever getting to feel the finish.`,
      negative: `The effort and progress are completely real, and the finish line keeps moving just out of reach, treated as always one step further than wherever you currently are. That perpetual almost-there isn't a lack of capability. It's an old incompletion from your mother's father, still deciding that arrival isn't actually available to you.`,
    },

    // ── 22 in MATERNAL MASCULINE LINE (Ancestral Tasks) ─────────────────────
    '22_G1': {
      heading: `Reclaiming Freedom He Traded Away`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's father — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Maternal Masculine Line, meaning this generation's task may be to reclaim the freedom he gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety. You are allowed to reclaim the freedom his security cost. What reclaimed liberty would you actually use — and for what?`,
      positive: `The pull toward the safer option hasn't necessarily vanished — but you've chosen the freer, less conventional path in one specific situation instead of defaulting to security again. That choice reclaims a freedom your mother's father traded away for a safety he felt he had no other option but to choose.`,
      negative: `The desire for real freedom is completely genuine, and it keeps losing to a reflexive pull toward the secure option, even in situations where the risk would actually be worth taking. That default isn't prudence. It's an old trade from your mother's father, still deciding that safety wins by default, whether or not it's actually needed.`,
    },

    // ── 1 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_H1': {
      heading: `Launching Her Unstarted Venture`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Paternal Feminine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea. You are allowed to open the doors that stayed closed to her. What would you launch this year with the access she never had?`,
      positive: `The pull to start what your father's mother never launched hasn't changed — what's different is that you now follow it all the way through. You still feel that same charge toward the venture, but it's converting into something actually built now, instead of another almost-beginning. Every step you carry past the point she stalled finishes a little more of what was only ever wanted, not attempted.`,
      negative: `The pull to start what your father's mother never launched is completely real, and it keeps arriving without the follow-through attached — venture after venture almost-begun, each one carrying the same unexplained charge as the last. That repeated near-miss isn't a personal failure of commitment. It's an old incompleteness still looking for the one launch that actually gets finished.`,
    },

    // ── 2 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_H1': {
      heading: `Where She Doubted, You Trust`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real inner knowing that circumstance, expectation, or a demand for constant practicality never allowed to be trusted or acted on. The High Priestess sits in your Paternal Feminine Line, meaning this generation's task may be to trust intuition the way she never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it. You are allowed to act on the instinct she had to swallow. What are you sensing right now that deserves to become a decision?`,
      positive: `The instinct itself hasn't changed — it was always sharp, always early, always more accurate than it had proof for. What's different is that you now act on it before you've built the rational case, letting a felt sense be reason enough sometimes. Each time you follow it and it lands, you're completing a permission your father's mother sensed but never let herself take.`,
      negative: `The instinct is completely real, and it keeps getting overridden the moment it can't be logically justified — a true read set aside in favor of whatever can be proven instead. That habit of second-guessing what you already know isn't caution; it's the same silencing that kept your father's mother from ever trusting her own gut, still running through you unexamined.`,
    },

    // ── 3 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_H1': {
      heading: `Living Her Set-Aside Ambition`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for creativity, nurture, or generative abundance that circumstance or expectation never allowed her to fully express beyond the domestic sphere. The Empress sits in your Paternal Feminine Line, meaning this generation's task may be to live openly what she had to keep contained.`,
      shadow: `The risk is inheriting the same containment — real creative or nurturing capacity present in you, but kept small or minimized out of an old, unexamined caution. If your gifts rarely get to expand beyond what feels safely modest, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or generosity at full scale in one specific setting this week, without shrinking it as you might by habit. You are allowed to make the art she set aside for the household. What creative ambition of yours carries her fingerprints — and your signature?`,
      positive: `The creativity and generative capacity were always genuinely there — what's different is that they're no longer kept small on purpose. One setting at a time, you let your gifts expand to their actual scale, instead of trimming them down to something safely modest. Each time you do, you're living openly what your father's mother had to keep contained.`,
      negative: `The creative and nurturing capacity is completely real, and it stays small and contained more often than not, trimmed down out of an old, unexamined caution about how much space it was allowed to take. That habit of shrinking your gifts before they're fully expressed isn't modesty — it's the same suppression this task exists to finally end.`,
    },

    // ── 4 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_H1': {
      heading: `Claiming Authority She Couldn't`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — real leadership potential either never claimed at all, or exercised quietly behind the scenes rather than openly. The Emperor sits in your Paternal Feminine Line, meaning this generation's task may be to hold visible authority in a way she never got to.`,
      shadow: `The risk is repeating the same pattern of influence without visibility — real capability exercised behind the scenes, never claimed openly as leadership in its own right. If you tend to manage things quietly rather than lead them visibly, that old pattern may still be running.`,
      path: `This may shift by taking on one piece of real, visible responsibility this week, leading it openly rather than managing it from behind the scenes. You are allowed to claim the authority the era denied her. What role could you step into that she would have been brilliant in?`,
      positive: `Your capability was always genuinely there — what's different is that you now lead openly instead of managing quietly from behind the scenes. Taking one piece of real responsibility and claiming it visibly, by name, completes an authority your father's mother exercised in substance but was never allowed to claim in title.`,
      negative: `The capability for real leadership is completely genuine, and it keeps operating from behind the scenes, influence without ever being named as authority in its own right. That habit of managing quietly rather than leading visibly isn't humility. It's the same invisibility your father's mother lived inside, still deciding how much credit you'll let yourself claim.`,
    },

    // ── 5 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_H1': {
      heading: `A Teaching Role, Finally Answered`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected role. The Hierophant sits in your Paternal Feminine Line, meaning this generation's task may be to actually answer a calling she had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such. You are allowed to guide out loud where she guided only quietly. Who is already listening to you that she never got the chance to reach?`,
      positive: `The pull toward teaching and guidance hasn't changed — what's different is that you now name it outright instead of offering it quietly on the side. One role claimed formally, instead of one more year of unofficial mentoring, completes something your father's mother had to set down for a more conventional role she felt safer taking.`,
      negative: `The calling toward teaching or guiding others is completely real, and it keeps arriving informally — advice given, wisdom shared, never actually named as the role it already functions as. That reluctance to claim it outright isn't humility. It's the same setting-aside your father's mother practiced, still shaping how much of the calling you'll let yourself own.`,
    },

    // ── 6 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_H1': {
      heading: `Love by Choice, Not Duty`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Paternal Feminine Line, meaning this generation's task may be to choose love from genuine preference where she couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice. You are allowed to marry your heart to your choices. What would loving freely, in her honor, actually change in your life?`,
      positive: `Your capacity for real partnership hasn't changed — what's different is that genuine desire now leads the choosing, with duty adjusting around it instead of the other way around. Naming what you actually want and choosing toward it, even when it costs some comfort, completes a freedom your father's mother never let herself exercise.`,
      negative: `The capacity to love is completely real, and the choosing keeps running on duty and expectation rather than genuine wanting — a partner selected, or stayed with, because it satisfies what's expected rather than what's actually desired. That pattern isn't commitment. It's the same sacrifice your father's mother made, still shaping your closest bond from underneath.`,
    },

    // ── 7 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_H1': {
      heading: `Finishing Her Interrupted Goal`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Paternal Feminine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted. You are allowed to pick up her interrupted goal without carrying her whole life. What single thread of it belongs in your hands?`,
      positive: `The drive toward the goal hasn't changed — what's different is that it now carries through to an actual finish instead of stopping short. One stalled ambition, pushed the last distance rather than left interrupted, resolves something your father's mother never got the circumstances to complete for herself.`,
      negative: `The ambition and drive are completely real, and they keep stalling at nearly the same point every time — momentum spent, then quietly abandoned just short of the line. That pattern isn't a lack of stamina. It's an old interruption echoing forward, still stopping the pursuit exactly where circumstance once stopped it for her.`,
    },

    // ── 8 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_H1': {
      heading: `Settling an Old Unfairness of Hers`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Paternal Feminine Line, meaning this generation's task may be to bring genuine resolution to something she had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it. You are allowed to give her story the fairness her life never received. What repair — lived, not argued — would settle it?`,
      positive: `The sensitivity to unfairness hasn't changed — it was always sharp and always real — but you've named what the original imbalance actually was and let yourself settle it by living justly rather than re-litigating it. That resolution is exactly what your father's mother had to leave standing, unable to close it in her own time.`,
      negative: `The sensitivity to injustice is completely real, and its intensity keeps outrunning whatever's actually happening in front of you — a present slight met with a reaction that belongs to something considerably older. That disproportion isn't oversensitivity. It's an unresolved unfairness from your father's mother still generating heat, waiting for someone to finally settle the account.`,
    },

    // ── 9 in PATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_H1': {
      heading: `Claiming Solitude She Never Had`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Paternal Feminine Line, meaning this generation's task may be to claim the solitude she was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first. You are allowed to close the door and be unreachable — she never could. What would you do with an hour that belonged to no one?`,
      positive: `The need for real withdrawal hasn't changed — what's different is that you now take it without needing to justify it as productive first. One genuinely unaccountable afternoon, claimed outright, completes a permission your father's mother was never allowed to give herself under the weight of constant duty.`,
      negative: `The need for solitude is completely real, and it keeps losing to an inherited compulsion to fill every available space with obligation to someone else. That inability to justify time alone, even when nothing urgent requires you, isn't diligence. It's the same relentless duty your father's mother carried, still deciding your schedule from underneath.`,
    },

    // ── 10 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_H1': {
      heading: `Peace With Her Derailed Plan`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Paternal Feminine Line, meaning this generation's task may be to find peace with life's turns where she couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it. You are allowed to grieve her derailed plan instead of redeeming it. What peace becomes possible when rescue stops being your job?`,
      positive: `The sensitivity to disruption hasn't changed — sudden turns still register — but you've named one circumstance genuinely beyond your control and chosen acceptance over continued resistance to it. That shift resolves a bitterness your father's mother carried toward a plan that was derailed by nothing she could have prevented.`,
      negative: `The sensitivity to disrupted plans is completely real, and every uncontrollable turn keeps landing as personal injustice rather than simply how life moves. That disproportionate unfairness isn't paranoia. It's an inherited resistance to circumstances no one could have controlled, still refusing to settle in you the way it never settled in her.`,
    },

    // ── 11 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_H1': {
      heading: `Gentleness Where She Showed Toughness`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for compassionate strength, overridden by a demand to appear unshaken, endlessly capable, or hardened instead. The Strength sits in your Paternal Feminine Line, meaning this generation's task may be to lead with a strength she was only allowed to show as endurance.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as endurance, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it. You are allowed to soften where survival made her hard. What tenderness can you afford that she couldn't?`,
      positive: `The strength was always real — what's different is that gentleness now stands alongside it instead of being hidden by it. Leading a difficult moment with visible compassion, not just endurance, completes a fuller resilience than your father's mother was ever permitted to show, since she was only allowed to harden.`,
      negative: `The capacity for real strength is completely genuine, and it keeps expressing itself only as endurance, cut off from the compassionate counterpart that was always available underneath. That hardening isn't who you actually are. It's the version of strength your father's mother was forced into, still standing in for the fuller one you're capable of.`,
    },

    // ── 12 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_H1': {
      heading: `Rebalancing Her Life Given Away`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Paternal Feminine Line, meaning this generation's task may be to reclaim active choice for yourself where she only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's. You are allowed to keep a full share of your own life. What would she have wanted for you that you've been refusing on her old terms?`,
      positive: `The capacity for genuine care and duty hasn't changed — what's different is that your own needs now get named and prioritized alongside it, instead of deferred indefinitely. Claiming something for yourself first, even briefly, completes a balance your father's mother never got the room to ask for.`,
      negative: `The devotion to others' needs is completely real, and your own keep going unconsidered underneath it, so thoroughly that you may struggle to even name what you currently need. That total deferral isn't selflessness. It's the same imbalance your father's mother lived inside, a life given entirely away with nothing set aside.`,
    },

    // ── 13 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_H1': {
      heading: `Completing the Change She Resisted`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Paternal Feminine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way she did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it. You are allowed to welcome the change she barricaded against. What shift in your life is safer for you than it ever was for her?`,
      positive: `The instinct to hold on hasn't disappeared — but you've identified one ending that's clearly due and chosen to meet it directly instead of continuing to resist it. That willingness to walk into necessary change completes a transformation your father's mother postponed until circumstance forced it on her anyway.`,
      negative: `The resistance to change is completely real, and it keeps gripping tightly to what's already finished, simply because letting go feels dangerous rather than simply overdue. That grip isn't loyalty to what was. It's an old avoidance from your father's mother, still refusing the ending that eventually arrives regardless.`,
    },

    // ── 14 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_H1': {
      heading: `Steadying Her Extremes`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, self-denial, or relentless caretaking. The Temperance sits in your Paternal Feminine Line, meaning this generation's task may be to find the steadiness her life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or depletion, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme. You are allowed to build the steadiness her circumstances kept breaking. What daily rhythm would be your quiet answer to her chaos?`,
      positive: `The capacity for real commitment hasn't changed — what's different is that it now runs at a sustainable pace instead of swinging between extremes. One small, steady practice, held rather than abandoned, completes a balance your father's mother's life never actually managed to find between overwork and depletion.`,
      negative: `The intensity is completely real, and it keeps alternating between overexertion and equally intense collapse or depletion, with nothing steady in between. That swing isn't a personality trait. It's an old imbalance from your father's mother, still running through you as the only two speeds available.`,
    },

    // ── 15 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_H1': {
      heading: `Releasing a Bind She Couldn't`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real entrapment, whether a compulsion or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Paternal Feminine Line, meaning this generation's task may be to release a bind she was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a pattern, a role, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed. You are allowed to undo the bind with tools she never had. What resource — money, choice, voice — do you hold that changes the equation?`,
      positive: `The pull toward the bind hasn't necessarily vanished — but you've named your own version of it honestly and taken one real step toward loosening it, rather than accepting it as fixed. That step completes a freedom your father's mother sensed but was never able to actually reach.`,
      negative: `The bind is completely real, and it keeps being accepted as simply how things are, never questioned, never approached as something that could actually loosen. That acceptance isn't peace with your circumstances. It's an old entrapment from your father's mother, still running because it's never been named as something to release.`,
    },

    // ── 16 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_H1': {
      heading: `Finishing Her Unrebuilt Collapse`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Paternal Feminine Line, meaning this generation's task may be to complete a reconstruction she started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse. You are allowed to finish the rebuild with your name on the last beam. What does the completed structure look like in your imagination?`,
      positive: `The caution after collapse hasn't fully disappeared — but you've fully invested in one area of stability instead of holding back in anticipation of its fall. That investment completes a reconstruction your father's mother survived enough to start and never had the chance to actually finish.`,
      negative: `The caution around stability is completely understandable, and it keeps holding you back from fully investing in what's actually solid, bracing for a collapse that already happened once, long ago. That hesitation isn't wisdom. It's an unfinished rebuilding from your father's mother, still treating stability as something that hasn't been earned back yet.`,
    },

    // ── 17 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_H1': {
      heading: `Restoring Hope She Abandoned`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Paternal Feminine Line, meaning this generation's task may be to restore a hope she felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it. You are allowed to carry her hope past where she set it down. What restored hope would you tend this year as if it were hers and yours at once?`,
      positive: `The guardedness around hope hasn't fully lifted — but you've named one genuine hope out loud and let yourself act on it rather than defending against it. That willingness restores something your father's mother felt forced to abandon after a disappointment real enough to make hoping again feel unsafe.`,
      negative: `The guardedness against hope is completely understandable, and it keeps functioning as protection from disappointment at the cost of ever genuinely believing things could improve. That reflexive cynicism isn't realism. It's an old abandonment from your father's mother, still deciding what you'll let yourself want.`,
    },

    // ── 18 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_H1': {
      heading: `Facing a Fear She Wouldn't`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Paternal Feminine Line, meaning this generation's task may be to see clearly what she could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it. You are allowed to face the fear in conditions she never got. Looked at with your freedoms — what does it actually still have on you?`,
      positive: `The unease hasn't necessarily disappeared — but you've named one fear as specifically as you can and looked at it directly instead of around it. That clarity is exactly what your father's mother was never able to reach, leaving the fear to operate in the background instead.`,
      negative: `The unease is completely real, and it keeps shaping decisions from the background without ever being examined directly, an anxiety with no clear name attached to it. That fog isn't confusion about what you want. It's an old, unfaced fear from your father's mother, still steering choices from somewhere just out of view.`,
    },

    // ── 19 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_H1': {
      heading: `Letting Her Hidden Joy Show`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real capacity for open joy and warmth, kept behind quiet composure considered proper or necessary. The Sun sits in your Paternal Feminine Line, meaning this generation's task may be to let visible joy exist where she only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a composed surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure. You are allowed to show the joy she folded away. What happiness would you wear openly this week as a kind of inheritance?`,
      positive: `The joy was always genuinely there — what's different is that it's now visible, audible, let out from behind the usual composure. One moment of real happiness shown openly completes a warmth your father's mother actually felt but was never permitted to display.`,
      negative: `The capacity for real joy is completely genuine, and it keeps staying behind a controlled, composed surface, felt more than it's ever shown. That restraint isn't dignity. It's an old inheritance from your father's mother, where visible gladness was considered improper, still deciding how much of your happiness reaches your face.`,
    },

    // ── 20 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_H1': {
      heading: `Taking Up Her Unanswered Calling`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Paternal Feminine Line, meaning this generation's task may be to answer a call she heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it. You are allowed to answer the calling that outlived her. What first yes would set it finally in motion?`,
      positive: `The calling hasn't changed — you've sensed it clearly for a while — but you've taken one concrete first step toward it instead of continuing to only recognize it. That step completes an awakening your father's mother heard just as clearly and was never able to actually take up.`,
      negative: `The calling is completely real, sensed clearly and specifically, and it keeps being delayed rather than acted on, as though recognizing it were the same as answering it. That delay isn't indecision. It's an old, unanswered call from your father's mother, still waiting for someone to move on it instead of just hearing it.`,
    },

    // ── 21 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_H1': {
      heading: `Completing What She Left Undone`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Paternal Feminine Line, meaning this generation's task may be to reach a completion she never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further. You are allowed to finish it — not perfectly, but truly. What ending is yours to write that her life ran out of pages for?`,
      positive: `The capacity for real, sustained effort hasn't changed — what's different is that you've identified one near-complete piece of work and deliberately closed it out instead of extending it further. That closure resolves an incompletion your father's mother worked toward for a lifetime without ever getting to feel the finish.`,
      negative: `The effort and progress are completely real, and the finish line keeps moving just out of reach, treated as always one step further than wherever you currently are. That perpetual almost-there isn't a lack of capability. It's an old incompletion from your father's mother, still deciding that arrival isn't actually available to you.`,
    },

    // ── 22 in PATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_H1': {
      heading: `Reclaiming Freedom She Gave Up`,
      why: `This Ancestral Task may carry an unfulfilled dream from your father's mother — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Paternal Feminine Line, meaning this generation's task may be to reclaim the freedom she gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety. You are allowed to spend the freedom she saved everyone else instead. What would you do first, free?`,
      positive: `The pull toward the safer option hasn't necessarily vanished — but you've chosen the freer, less conventional path in one specific situation instead of defaulting to security again. That choice reclaims a freedom your father's mother traded away for a safety she felt she had no other option but to choose.`,
      negative: `The desire for real freedom is completely genuine, and it keeps losing to a reflexive pull toward the secure option, even in situations where the risk would actually be worth taking. That default isn't prudence. It's an old trade from your father's mother, still deciding that safety wins by default, whether or not it's actually needed.`,
    },

    // ── 1 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '1_I1': {
      heading: `The Venture Grandmother Left Undone`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real enterprise, idea, or independent undertaking that circumstance, resources, or timing never allowed to actually begin. The Magician sits in your Maternal Feminine Line, meaning this generation's task may be to finally initiate what was wanted but never launched.`,
      shadow: `The risk is feeling a persistent, unexplained pull to start something without ever following through, as though the incompleteness itself got inherited alongside the ambition. If you keep almost-launching something significant without quite committing, that unfinished thread may still be running.`,
      path: `This may shift by actually starting the venture your own instinct keeps pointing toward, treating it as the completion of something rather than a fresh, unrelated idea. You are allowed to begin the thing her world called impossible. What is the modern, possible version of her impossible venture?`,
      positive: `The pull to start what your mother's mother never launched hasn't changed — what's different is that you now follow it all the way through. You still feel that same charge toward the venture, but it's converting into something actually built now, instead of another almost-beginning. Every step you carry past the point she stalled finishes a little more of what was only ever wanted, not attempted.`,
      negative: `The pull to start what your mother's mother never launched is completely real, and it keeps arriving without the follow-through attached — venture after venture almost-begun, each one carrying the same unexplained charge as the last. That repeated near-miss isn't a personal failure of commitment. It's an old incompleteness still looking for the one launch that actually gets finished.`,
    },

    // ── 2 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '2_I1': {
      heading: `Instinct She Couldn't Trust`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real inner knowing that circumstance, expectation, or a demand for constant practicality never allowed to be trusted or acted on. The High Priestess sits in your Maternal Feminine Line, meaning this generation's task may be to trust intuition the way she never got permission to.`,
      shadow: `The risk is inheriting the same suppression — sensing something true and dismissing it in favor of what can be logically justified, repeating the exact silencing this task is meant to resolve. If you consistently override a strong instinct because it isn't provable, that old pattern may still be running.`,
      path: `This may shift by acting on one genuine instinct this week without first requiring full rational justification for it. You are allowed to let your knowing lead where hers had to follow. What choice would you make today by instinct alone?`,
      positive: `The instinct itself hasn't changed — it was always sharp, always early, always more accurate than it had proof for. What's different is that you now act on it before you've built the rational case, letting a felt sense be reason enough sometimes. Each time you follow it and it lands, you're completing a permission your mother's mother sensed but never let herself take.`,
      negative: `The instinct is completely real, and it keeps getting overridden the moment it can't be logically justified — a true read set aside in favor of whatever can be proven instead. That habit of second-guessing what you already know isn't caution; it's the same silencing that kept your mother's mother from ever trusting her own gut, still running through you unexamined.`,
    },

    // ── 3 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '3_I1': {
      heading: `An Ambition Deferred, Now Lived`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for creativity, nurture, or generative abundance that circumstance or expectation never allowed her to fully express beyond the domestic sphere. The Empress sits in your Maternal Feminine Line, meaning this generation's task may be to live openly what she had to keep contained.`,
      shadow: `The risk is inheriting the same containment — real creative or nurturing capacity present in you, but kept small or minimized out of an old, unexamined caution. If your gifts rarely get to expand beyond what feels safely modest, that inherited caution may still be running.`,
      path: `This may shift by expressing your creativity or generosity at full scale in one specific setting this week, without shrinking it as you might by habit. You are allowed to give the creative ambition a real room in your life. What set-aside making of hers is quietly alive in your hands?`,
      positive: `The creativity and generative capacity were always genuinely there — what's different is that they're no longer kept small on purpose. One setting at a time, you let your gifts expand to their actual scale, instead of trimming them down to something safely modest. Each time you do, you're living openly what your mother's mother had to keep contained.`,
      negative: `The creative and nurturing capacity is completely real, and it stays small and contained more often than not, trimmed down out of an old, unexamined caution about how much space it was allowed to take. That habit of shrinking your gifts before they're fully expressed isn't modesty — it's the same suppression this task exists to finally end.`,
    },

    // ── 4 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '4_I1': {
      heading: `Authority She Never Claimed`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — real leadership potential either never claimed at all, or exercised quietly behind the scenes rather than openly. The Emperor sits in your Maternal Feminine Line, meaning this generation's task may be to hold visible authority in a way she never got to.`,
      shadow: `The risk is repeating the same pattern of influence without visibility — real capability exercised behind the scenes, never claimed openly as leadership in its own right. If you tend to manage things quietly rather than lead them visibly, that old pattern may still be running.`,
      path: `This may shift by taking on one piece of real, visible responsibility this week, leading it openly rather than managing it from behind the scenes. You are allowed to hold the authority two generations prepared you for. Where are you still asking permission that she never even got to ask?`,
      positive: `Your capability was always genuinely there — what's different is that you now lead openly instead of managing quietly from behind the scenes. Taking one piece of real responsibility and claiming it visibly, by name, completes an authority your mother's mother exercised in substance but was never allowed to claim in title.`,
      negative: `The capability for real leadership is completely genuine, and it keeps operating from behind the scenes, influence without ever being named as authority in its own right. That habit of managing quietly rather than leading visibly isn't humility. It's the same invisibility your mother's mother lived inside, still deciding how much credit you'll let yourself claim.`,
    },

    // ── 5 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '5_I1': {
      heading: `A Guidance Role, Long Overdue`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real pull toward teaching, mentorship, or spiritual guidance, set aside in favor of a more conventional or expected role. The Hierophant sits in your Maternal Feminine Line, meaning this generation's task may be to actually answer a calling she had to set down.`,
      shadow: `The risk is feeling the pull toward guiding or teaching others without ever fully stepping into it, treating the calling as a hobby or side interest rather than something to actually claim. If you're regularly sought out for guidance but never formalize or fully own that role, that set-aside calling may still be running.`,
      path: `This may shift by claiming one specific teaching or mentoring role this week, rather than continuing to offer guidance informally without naming it as such. You are allowed to teach the wisdom she practiced in silence. What lesson of hers reaches further the moment you speak it?`,
      positive: `The pull toward teaching and guidance hasn't changed — what's different is that you now name it outright instead of offering it quietly on the side. One role claimed formally, instead of one more year of unofficial mentoring, completes something your mother's mother had to set down for a more conventional role she felt safer taking.`,
      negative: `The calling toward teaching or guiding others is completely real, and it keeps arriving informally — advice given, wisdom shared, never actually named as the role it already functions as. That reluctance to claim it outright isn't humility. It's the same setting-aside your mother's mother practiced, still shaping how much of the calling you'll let yourself own.`,
    },

    // ── 6 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '6_I1': {
      heading: `Choosing Heart Over Duty`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real partnership or love genuinely wanted, set aside in favor of an arrangement made for duty, family expectation, or practicality instead. The Lovers sits in your Maternal Feminine Line, meaning this generation's task may be to choose love from genuine preference where she couldn't.`,
      shadow: `The risk is inheriting the same deference — choosing a partner or staying in a relationship primarily to satisfy expectation rather than genuine desire, repeating exactly the sacrifice this task exists to resolve. If your relationship choices are shaped more by duty than by your own actual wanting, that pattern may still be running.`,
      path: `This may shift by naming, honestly, what you actually want in partnership, separate from what would be expected of you, and letting that genuine want guide the next choice. You are allowed to choose the heart's love she was never offered. What would your choosing freely give back to her story?`,
      positive: `Your capacity for real partnership hasn't changed — what's different is that genuine desire now leads the choosing, with duty adjusting around it instead of the other way around. Naming what you actually want and choosing toward it, even when it costs some comfort, completes a freedom your mother's mother never let herself exercise.`,
      negative: `The capacity to love is completely real, and the choosing keeps running on duty and expectation rather than genuine wanting — a partner selected, or stayed with, because it satisfies what's expected rather than what's actually desired. That pattern isn't commitment. It's the same sacrifice your mother's mother made, still shaping your closest bond from underneath.`,
    },

    // ── 7 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '7_I1': {
      heading: `Finishing What She Started`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real ambition pursued with genuine drive, but stalled or interrupted by circumstance before it could actually be completed. The Chariot sits in your Maternal Feminine Line, meaning this generation's task may be to carry a stalled pursuit all the way to its finish.`,
      shadow: `The risk is inheriting the drive without the completion — real momentum toward goals that keep getting interrupted or abandoned partway, echoing the original stall rather than resolving it. If your ambitions have a pattern of stopping just short of the finish line, that inherited interruption may still be running.`,
      path: `This may shift by identifying one goal currently stalled partway through, and deliberately pushing it to genuine completion rather than letting it stay interrupted. You are allowed to complete her goal in your own dialect. What does the finished version look like when it's genuinely yours?`,
      positive: `The drive toward the goal hasn't changed — what's different is that it now carries through to an actual finish instead of stopping short. One stalled ambition, pushed the last distance rather than left interrupted, resolves something your mother's mother never got the circumstances to complete for herself.`,
      negative: `The ambition and drive are completely real, and they keep stalling at nearly the same point every time — momentum spent, then quietly abandoned just short of the line. That pattern isn't a lack of stamina. It's an old interruption echoing forward, still stopping the pursuit exactly where circumstance once stopped it for her.`,
    },

    // ── 8 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '8_I1': {
      heading: `An Old Score, Finally Settled`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real wrong, injustice, or imbalance that was never actually resolved, whether suffered or caused, left standing rather than made right. The Justice sits in your Maternal Feminine Line, meaning this generation's task may be to bring genuine resolution to something she had to leave unsettled.`,
      shadow: `The risk is carrying a vigilant, unexplained sensitivity to unfairness that traces back further than your own experience, reacting to present situations with an intensity that belongs to something older. If a sense of injustice feels disproportionately personal in ways you can't fully explain, that unresolved history may still be active.`,
      path: `This may shift by naming, as specifically as you can, what the original unfairness was, and consciously choosing to resolve rather than continue carrying it. You are allowed to be the generation where the unfairness stops. What pattern ends with you — decided today?`,
      positive: `The sensitivity to unfairness hasn't changed — it was always sharp and always real — but you've named what the original imbalance actually was and let yourself settle it by living justly rather than re-litigating it. That resolution is exactly what your mother's mother had to leave standing, unable to close it in her own time.`,
      negative: `The sensitivity to injustice is completely real, and its intensity keeps outrunning whatever's actually happening in front of you — a present slight met with a reaction that belongs to something considerably older. That disproportion isn't oversensitivity. It's an unresolved unfairness from your mother's mother still generating heat, waiting for someone to finally settle the account.`,
    },

    // ── 9 in MATERNAL FEMININE LINE (Ancestral Tasks) ───────────────────────
    '9_I1': {
      heading: `Solitude She Was Denied`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real need for withdrawal, reflection, or solitary space, never permitted by relentless duty or responsibility to others. The Hermit sits in your Maternal Feminine Line, meaning this generation's task may be to claim the solitude she was never allowed to take.`,
      shadow: `The risk is inheriting the same relentless duty — filling every available space with obligation to others, unable to justify solitude even when it's genuinely needed. If you feel guilty taking real time alone, even when nothing urgent requires your attention, that inherited pattern may still be running.`,
      path: `This may shift by claiming one period of genuine, unapologetic solitude this week, without needing to justify it as productive or necessary first. You are allowed to take the solitude she was never once granted. What would a protected, regular stillness change in your weeks?`,
      positive: `The need for real withdrawal hasn't changed — what's different is that you now take it without needing to justify it as productive first. One genuinely unaccountable afternoon, claimed outright, completes a permission your mother's mother was never allowed to give herself under the weight of constant duty.`,
      negative: `The need for solitude is completely real, and it keeps losing to an inherited compulsion to fill every available space with obligation to someone else. That inability to justify time alone, even when nothing urgent requires you, isn't diligence. It's the same relentless duty your mother's mother carried, still deciding your schedule from underneath.`,
    },

    // ── 10 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '10_I1': {
      heading: `Making Peace With Her Derailment`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real plan or path, altered or ended by circumstances genuinely beyond anyone's control, rather than by any failure of effort or will. The Wheel of Fortune sits in your Maternal Feminine Line, meaning this generation's task may be to find peace with life's turns where she couldn't.`,
      shadow: `The risk is inheriting a bitterness or resistance toward circumstances beyond your control, treating every unpredictable turn as a personal injustice rather than simply part of how life moves. If unexpected change tends to provoke a disproportionate sense of unfairness in you, that old resistance may still be active.`,
      path: `This may shift by naming one current circumstance genuinely beyond your control, and consciously choosing acceptance over continued resistance to it. You are allowed to bless the derailed plan and walk on. What might flow easier once the old grief is honored instead of solved?`,
      positive: `The sensitivity to disruption hasn't changed — sudden turns still register — but you've named one circumstance genuinely beyond your control and chosen acceptance over continued resistance to it. That shift resolves a bitterness your mother's mother carried toward a plan that was derailed by nothing she could have prevented.`,
      negative: `The sensitivity to disrupted plans is completely real, and every uncontrollable turn keeps landing as personal injustice rather than simply how life moves. That disproportionate unfairness isn't paranoia. It's an inherited resistance to circumstances no one could have controlled, still refusing to settle in you the way it never settled in her.`,
    },

    // ── 11 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '11_I1': {
      heading: `Toughness Softened, At Last`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for compassionate strength, overridden by a demand to appear unshaken, endlessly capable, or hardened instead. The Strength sits in your Maternal Feminine Line, meaning this generation's task may be to lead with a strength she was only allowed to show as endurance.`,
      shadow: `The risk is inheriting the hardened version without its gentler counterpart — real resilience expressed only as endurance, cutting you off from the compassionate strength that was actually available underneath. If your version of strength rarely includes visible tenderness, that inherited hardening may still be running.`,
      path: `This may shift by leading with visible compassion in one difficult situation this week, letting it stand alongside your strength rather than being hidden by it. You are allowed to let gentleness be your version of her endurance. Where would soft persistence carry you now?`,
      positive: `The strength was always real — what's different is that gentleness now stands alongside it instead of being hidden by it. Leading a difficult moment with visible compassion, not just endurance, completes a fuller resilience than your mother's mother was ever permitted to show, since she was only allowed to harden.`,
      negative: `The capacity for real strength is completely genuine, and it keeps expressing itself only as endurance, cut off from the compassionate counterpart that was always available underneath. That hardening isn't who you actually are. It's the version of strength your mother's mother was forced into, still standing in for the fuller one you're capable of.`,
    },

    // ── 12 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '12_I1': {
      heading: `Reclaiming a Life Given Away`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a life shaped entirely around duty and sacrifice for others, with personal wants or needs never once prioritized or even considered. The Hanged Man sits in your Maternal Feminine Line, meaning this generation's task may be to reclaim active choice for yourself where she only ever gave it away.`,
      shadow: `The risk is inheriting the same total self-sacrifice — a life so oriented around others' needs that your own stay perpetually unconsidered, repeating exactly the imbalance this task exists to resolve. If you can't easily name your own current needs, that inherited pattern of total deferral may still be running.`,
      path: `This may shift by naming one of your own needs directly this week and prioritizing it, even briefly, rather than automatically deferring to someone else's. You are allowed to receive in a line of women who only gave. What would you accept this month, deliberately, in her name and yours?`,
      positive: `The capacity for genuine care and duty hasn't changed — what's different is that your own needs now get named and prioritized alongside it, instead of deferred indefinitely. Claiming something for yourself first, even briefly, completes a balance your mother's mother never got the room to ask for.`,
      negative: `The devotion to others' needs is completely real, and your own keep going unconsidered underneath it, so thoroughly that you may struggle to even name what you currently need. That total deferral isn't selflessness. It's the same imbalance your mother's mother lived inside, a life given entirely away with nothing set aside.`,
    },

    // ── 13 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '13_I1': {
      heading: `Finishing the Change She Feared`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a necessary ending or transformation, resisted and postponed rather than faced directly, until circumstance forced it regardless. The Death sits in your Maternal Feminine Line, meaning this generation's task may be to meet necessary change directly, rather than resisting it the way she did.`,
      shadow: `The risk is inheriting the same resistance — holding onto what's clearly finished simply because letting go feels dangerous, repeating exactly the avoidance this task exists to resolve. If you find yourself gripping tightly to something you already know has run its course, that inherited resistance may still be running.`,
      path: `This may shift by identifying one ending that's clearly due in your own life, and choosing to meet it directly rather than continuing to resist it. You are allowed to cross the threshold she stood at all her life. What is one concrete step over it this season?`,
      positive: `The instinct to hold on hasn't disappeared — but you've identified one ending that's clearly due and chosen to meet it directly instead of continuing to resist it. That willingness to walk into necessary change completes a transformation your mother's mother postponed until circumstance forced it on her anyway.`,
      negative: `The resistance to change is completely real, and it keeps gripping tightly to what's already finished, simply because letting go feels dangerous rather than simply overdue. That grip isn't loyalty to what was. It's an old avoidance from your mother's mother, still refusing the ending that eventually arrives regardless.`,
    },

    // ── 14 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '14_I1': {
      heading: `Steadying Her Swing to Extremes`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine desire for a balanced, moderate life, lost instead to extremes of overwork, self-denial, or relentless caretaking. The Temperance sits in your Maternal Feminine Line, meaning this generation's task may be to find the steadiness her life never actually held.`,
      shadow: `The risk is inheriting the same swing between extremes — periods of intense overexertion followed by equally intense collapse or depletion, repeating the very imbalance this task exists to resolve. If your own life alternates sharply between overdoing and depleting, that inherited pattern may still be running.`,
      path: `This may shift by choosing one small, sustainable, moderate practice and holding it steadily, resisting the pull toward either extreme. You are allowed to build a steadiness her life never permitted. What extreme are you ready to lay down for both of you?`,
      positive: `The capacity for real commitment hasn't changed — what's different is that it now runs at a sustainable pace instead of swinging between extremes. One small, steady practice, held rather than abandoned, completes a balance your mother's mother's life never actually managed to find between overwork and depletion.`,
      negative: `The intensity is completely real, and it keeps alternating between overexertion and equally intense collapse or depletion, with nothing steady in between. That swing isn't a personality trait. It's an old imbalance from your mother's mother, still running through you as the only two speeds available.`,
    },

    // ── 15 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '15_I1': {
      heading: `A Bind, Finally Broken`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real entrapment, whether a compulsion or a duty-bound obligation that felt impossible to escape, carried without ever being fully broken. The Devil sits in your Maternal Feminine Line, meaning this generation's task may be to release a bind she was never able to escape.`,
      shadow: `The risk is inheriting a compulsive attachment of your own — to a pattern, a role, or an obligation — that feels similarly impossible to question or release. If something in your life feels like it's simply how things are rather than an actual choice, that inherited bind may still be active.`,
      path: `This may shift by naming your own version of that bind honestly, and taking one concrete step toward loosening it rather than continuing to accept it as fixed. You are allowed to release the bind — the key was always going to reach your generation. What does turning it look like in practice?`,
      positive: `The pull toward the bind hasn't necessarily vanished — but you've named your own version of it honestly and taken one real step toward loosening it, rather than accepting it as fixed. That step completes a freedom your mother's mother sensed but was never able to actually reach.`,
      negative: `The bind is completely real, and it keeps being accepted as simply how things are, never questioned, never approached as something that could actually loosen. That acceptance isn't peace with your circumstances. It's an old entrapment from your mother's mother, still running because it's never been named as something to release.`,
    },

    // ── 16 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '16_I1': {
      heading: `Completing an Old Rebuild`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real loss or ruin that arrived suddenly and was survived, but never fully rebuilt from, the rebuilding left incomplete. The Tower sits in your Maternal Feminine Line, meaning this generation's task may be to complete a reconstruction she started but didn't finish.`,
      shadow: `The risk is inheriting a lingering bracing for disaster, treating stability itself with suspicion, as though rebuilding fully would only invite another collapse. If you hold back from fully investing in something stable because part of you is still waiting for it to fall apart, that inherited caution may still be running.`,
      path: `This may shift by fully investing in one area of stability in your life this week, without holding back in anticipation of its collapse. You are allowed to rebuild past survival into actual flourishing. What would flourishing — not just standing — look like for you?`,
      positive: `The caution after collapse hasn't fully disappeared — but you've fully invested in one area of stability instead of holding back in anticipation of its fall. That investment completes a reconstruction your mother's mother survived enough to start and never had the chance to actually finish.`,
      negative: `The caution around stability is completely understandable, and it keeps holding you back from fully investing in what's actually solid, bracing for a collapse that already happened once, long ago. That hesitation isn't wisdom. It's an unfinished rebuilding from your mother's mother, still treating stability as something that hasn't been earned back yet.`,
    },

    // ── 17 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '17_I1': {
      heading: `Reviving an Abandoned Hope`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine hope or faith in a better future, abandoned after a real disappointment made it feel foolish or unsafe to keep holding. The Star sits in your Maternal Feminine Line, meaning this generation's task may be to restore a hope she felt forced to give up.`,
      shadow: `The risk is inheriting the same guardedness against hope — a reflexive cynicism or resignation that protects against future disappointment at the cost of ever genuinely believing things could improve. If hope feels naive or dangerous to you specifically, that inherited protection may still be active.`,
      path: `This may shift by naming one genuine hope you actually hold, out loud, and letting yourself act on it rather than guarding against it. You are allowed to re-light the hope she had to blow out. What small daily act would keep it burning this time?`,
      positive: `The guardedness around hope hasn't fully lifted — but you've named one genuine hope out loud and let yourself act on it rather than defending against it. That willingness restores something your mother's mother felt forced to abandon after a disappointment real enough to make hoping again feel unsafe.`,
      negative: `The guardedness against hope is completely understandable, and it keeps functioning as protection from disappointment at the cost of ever genuinely believing things could improve. That reflexive cynicism isn't realism. It's an old abandonment from your mother's mother, still deciding what you'll let yourself want.`,
    },

    // ── 18 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '18_I1': {
      heading: `Naming a Fear She Wouldn't`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real fear or confusion, never faced directly, left to operate in the background rather than being brought into clear light. The Moon sits in your Maternal Feminine Line, meaning this generation's task may be to see clearly what she could never quite look at directly.`,
      shadow: `The risk is inheriting the same avoidance — an unnamed anxiety that shapes decisions from the background without ever being examined directly, repeating the very obscurity this task exists to resolve. If a persistent unease affects your choices without your being able to name its actual source, that inherited fog may still be active.`,
      path: `This may shift by naming, as specifically as possible, one fear that's been operating in the background, and looking at it directly rather than around it. You are allowed to name the fear she carried namelessly. Spoken in your voice — what is it, and is it still yours to keep?`,
      positive: `The unease hasn't necessarily disappeared — but you've named one fear as specifically as you can and looked at it directly instead of around it. That clarity is exactly what your mother's mother was never able to reach, leaving the fear to operate in the background instead.`,
      negative: `The unease is completely real, and it keeps shaping decisions from the background without ever being examined directly, an anxiety with no clear name attached to it. That fog isn't confusion about what you want. It's an old, unfaced fear from your mother's mother, still steering choices from somewhere just out of view.`,
    },

    // ── 19 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '19_I1': {
      heading: `Her Hidden Joy, Unhidden`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real capacity for open joy and warmth, kept behind quiet composure considered proper or necessary. The Sun sits in your Maternal Feminine Line, meaning this generation's task may be to let visible joy exist where she only ever allowed restraint.`,
      shadow: `The risk is inheriting the same reserve — genuine happiness felt but rarely shown, kept behind a composed surface out of old habit rather than actual preference. If you feel joy more than you show it, that inherited restraint may still be running.`,
      path: `This may shift by letting one moment of real joy be visibly, openly expressed this week, rather than kept behind your usual composure. You are allowed to let the hidden joy out into ordinary daylight. What delight of yours has waited generations for an audience?`,
      positive: `The joy was always genuinely there — what's different is that it's now visible, audible, let out from behind the usual composure. One moment of real happiness shown openly completes a warmth your mother's mother actually felt but was never permitted to display.`,
      negative: `The capacity for real joy is completely genuine, and it keeps staying behind a controlled, composed surface, felt more than it's ever shown. That restraint isn't dignity. It's an old inheritance from your mother's mother, where visible gladness was considered improper, still deciding how much of your happiness reaches your face.`,
    },

    // ── 20 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '20_I1': {
      heading: `A Calling She Set Down`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a real calling or awakening, sensed but never actually answered, set aside for a life that didn't fully account for it. The Judgement sits in your Maternal Feminine Line, meaning this generation's task may be to answer a call she heard but couldn't take up.`,
      shadow: `The risk is sensing your own version of that call and continuing to delay it, treating the recognition itself as enough without ever actually acting on it. If you already know what you're being called toward and still haven't moved, that inherited delay may still be running.`,
      path: `This may shift by taking one concrete first step toward the calling you already recognize, rather than continuing to only sense it. You are allowed to take up the calling as its rightful heir. What would honoring it this year actually require of you?`,
      positive: `The calling hasn't changed — you've sensed it clearly for a while — but you've taken one concrete first step toward it instead of continuing to only recognize it. That step completes an awakening your mother's mother heard just as clearly and was never able to actually take up.`,
      negative: `The calling is completely real, sensed clearly and specifically, and it keeps being delayed rather than acted on, as though recognizing it were the same as answering it. That delay isn't indecision. It's an old, unanswered call from your mother's mother, still waiting for someone to move on it instead of just hearing it.`,
    },

    // ── 21 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '21_I1': {
      heading: `The Ending She Never Reached`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine goal or life's work, left permanently incomplete, without ever reaching the sense of arrival it was working toward. The World sits in your Maternal Feminine Line, meaning this generation's task may be to reach a completion she never got to feel.`,
      shadow: `The risk is inheriting the same perpetual incompletion — real progress made, but the finish line never actually crossed, treated as always just out of reach. If your own significant efforts rarely get to feel finished, that inherited pattern may still be running.`,
      path: `This may shift by identifying one genuinely near-complete effort in your own life, and deliberately closing it out rather than extending it further. You are allowed to complete what her whole life circled. What is your next move on the unfinished thing — this week, not someday?`,
      positive: `The capacity for real, sustained effort hasn't changed — what's different is that you've identified one near-complete piece of work and deliberately closed it out instead of extending it further. That closure resolves an incompletion your mother's mother worked toward for a lifetime without ever getting to feel the finish.`,
      negative: `The effort and progress are completely real, and the finish line keeps moving just out of reach, treated as always one step further than wherever you currently are. That perpetual almost-there isn't a lack of capability. It's an old incompletion from your mother's mother, still deciding that arrival isn't actually available to you.`,
    },

    // ── 22 in MATERNAL FEMININE LINE (Ancestral Tasks) ──────────────────────
    '22_I1': {
      heading: `Freedom She Gave Up First`,
      why: `This Ancestral Task may carry an unfulfilled dream from your mother's mother — a genuine desire for freedom, adventure, or an unconventional path, traded away for the security of a safer, more expected route. The Fool sits in your Maternal Feminine Line, meaning this generation's task may be to reclaim the freedom she gave up.`,
      shadow: `The risk is inheriting the same trade — choosing safety reflexively over genuine freedom, even in situations where the risk would actually be worth taking. If you consistently pick the secure option over the one that would actually feel alive, that inherited trade may still be running.`,
      path: `This may shift by choosing the freer, less conventional option in one specific situation this week, rather than defaulting again to safety. You are allowed to live the freedom she only imagined. What imagined liberty of hers could become your Tuesday?`,
      positive: `The pull toward the safer option hasn't necessarily vanished — but you've chosen the freer, less conventional path in one specific situation instead of defaulting to security again. That choice reclaims a freedom your mother's mother traded away for a safety she felt she had no other option but to choose.`,
      negative: `The desire for real freedom is completely genuine, and it keeps losing to a reflexive pull toward the secure option, even in situations where the risk would actually be worth taking. That default isn't prudence. It's an old trade from your mother's mother, still deciding that safety wins by default, whether or not it's actually needed.`,
    },


    // ── Lineage Square Talents: Paternal Spiritual Talent (F2) ─────────────

    '1_F2': {
      heading: `A Spark, Half-Lit`,
      why: `Somewhere in your father's spiritual line, someone carried the raw ability to begin — to spark a conviction, a practice, a way of seeing, from nothing. The Magician sits in your Paternal Spiritual Talent, meaning the gift you inherited here is a genuine capacity to originate belief rather than simply receive it.`,
      shadow: `The risk is treating the spark as something to perform rather than tend. You may light new spiritual interests easily and let each one go cold the moment the initial charge fades, mistaking novelty for depth.`,
      path: `This talent asks you to finish one spiritual thread instead of starting ten. You are allowed to let a single practice mature past its exciting beginning. What belief, sparked long ago, is ready for you to actually build something on?`,
      positive: `The gift for spiritual initiation hasn't changed — you still light new belief and practice easily, faster than most people manage. What's different is that you now stay with one thread long enough to let it mature past its exciting opening, so the spark you inherited finally becomes a foundation instead of one more bright, brief start.`,
      negative: `The gift for spiritual initiation is completely real, and it keeps getting treated as disposable — a new practice lit easily, then let go cold the moment the initial charge fades. That pattern isn't fickleness. It's an inherited spark still waiting for the one thread you'll actually stay with long enough to build something on.`,
    },

    '2_F2': {
      heading: `Trusted Without Explanation`,
      why: `Somewhere back along your father's line, someone trusted an inner knowing they couldn't fully explain — and that trust, not the explanation, is what reached you. The High Priestess in your Paternal Spiritual Talent means your inheritance is intuitive certainty itself.`,
      shadow: `The risk is keeping the knowing so private it never gets tested or used, treating unexplainable as a reason to stay silent rather than simply undemonstrated.`,
      path: `This talent asks you to act on the knowing before you can defend it in words. You are allowed to trust what you sense before you can explain it. What is that inherited knowing telling you right now?`,
      positive: `The inner knowing hasn't changed — it was always accurate, always arriving before proof. What's different is that you now act on it before you can fully defend it in words, letting the certainty be used instead of only held. Each time you do, the inherited trust your father's line passed down wordlessly gets to actually prove itself.`,
      negative: `The inner knowing is completely real, and it keeps staying too private to ever be tested, treated as unexplainable rather than simply undemonstrated. That silence isn't humility. It's the gift staying theoretical, still waiting for the one time you'll act on it before you can defend it, the way it was originally meant to be used.`,
    },

    '3_F2': {
      heading: `Abundance, Carried Quietly`,
      why: `Somewhere in your father's spiritual line, someone held a real generosity of spirit — warmth, fertility of ideas, a hospitable inner life — that didn't need to announce itself to be real. The Empress in your Paternal Spiritual Talent means this abundance is yours to draw from.`,
      shadow: `The risk is keeping that abundance internal, tending your own rich inner world without ever letting it nourish anyone else, mistaking privacy for humility.`,
      path: `This talent asks you to let the abundance move outward. You are allowed to let your spiritual richness feed someone besides yourself. Who nearby is hungry for exactly the warmth you already carry?`,
      positive: `The abundance was always genuinely there — a real generosity of spirit, a rich inner life. What's different is that it now moves outward, reaching someone besides yourself, instead of staying tended in private. That movement is what turns an inherited spiritual richness into the shared gift it was quietly built to become.`,
      negative: `The abundance is completely real, and it keeps staying internal, tended carefully but never let out to nourish anyone else. That containment isn't humility. It's a generosity your father's line carried quietly, still waiting for someone to actually let it move toward another person.`,
    },

    '4_F2': {
      heading: `Built to Last`,
      why: `Somewhere back along your father's spiritual line, someone built a framework of belief sturdy enough to hold real weight — not a rigid cage, but scaffolding that let faith stand upright through hard seasons. The Emperor in your Paternal Spiritual Talent means structural steadiness is your inheritance.`,
      shadow: `The risk is mistaking the structure for the point, defending the framework itself rather than what it was built to hold, until the scaffolding starts to matter more than the faith inside it.`,
      path: `This talent asks you to keep the structure in service of the life, not the reverse. You are allowed to hold your convictions firmly without needing them unquestioned. Which spiritual structure of yours could flex without actually falling?`,
      positive: `The structural steadiness hasn't changed — the framework still holds real weight. What's different is that you now keep it in service of the faith it was built to hold, rather than defending the structure for its own sake. That flexibility is what lets an inherited steadiness outlast hard seasons instead of cracking or strangling what's inside it.`,
      negative: `The structural steadiness is completely real, and it keeps calcifying into something defended for its own sake, mattering more than the faith it was originally built to hold. That rigidity isn't strength. It's an inherited scaffolding your father's line built to hold weight, quietly strangling the very thing it was meant to support.`,
    },

    '5_F2': {
      heading: `A Doctrine, Handed Down Whole`,
      why: `Somewhere in your father's spiritual line, someone received and carried forward an actual body of teaching — not a vague sense of tradition, but real, specific doctrine passed hand to hand. The Hierophant in your Paternal Spiritual Talent means you inherited the whole transmission, not just its outline.`,
      shadow: `The risk is carrying the doctrine unexamined, teaching what you were taught without ever testing it against your own lived encounter with the sacred.`,
      path: `This talent asks you to keep what still serves and release what doesn't, on your own authority. You are allowed to inherit the teaching and still make it yours. Which part of what you were handed has actually proven true in your own life?`,
      positive: `The body of teaching hasn't changed — the actual doctrine your father's line handed down is still fully intact. What's different is that you've tested it against your own lived encounter with the sacred, keeping what holds and releasing what doesn't. That renewal is what makes the inheritance alive rather than merely recited.`,
      negative: `The body of teaching is completely real, carried whole from your father's line, and it keeps going untested against your own actual experience, recited rather than believed. That habit isn't reverence. It's a real transmission quietly stopping at you, never renewed enough to genuinely pass on to anyone after.`,
    },

    '6_F2': {
      heading: `Devotion, Freely Chosen`,
      why: `Somewhere back along your father's spiritual line, someone chose their faith rather than merely inheriting it — a real, examined devotion, arrived at rather than assumed. The Lovers in your Paternal Spiritual Talent means the gift you carry is the capacity to choose your beliefs on purpose.`,
      shadow: `The risk is going through the motions of choice while actually just accepting whatever was easiest or expected, mistaking inherited comfort for genuine conviction.`,
      path: `This talent asks you to actually examine what you believe and choose it again, deliberately. You are allowed to keep only the parts of your inherited faith that you would choose fresh today. What would you choose if no one before you had already chosen it?`,
      positive: `The devotion hasn't changed — the capacity to actually choose your beliefs, rather than merely receive them, was always the real inheritance. What's different is that you've examined what you believe and chosen it again, deliberately, instead of accepting it by default. That ownership is what makes faith durable under real pressure.`,
      negative: `The capacity for genuine, chosen devotion is completely real, and it keeps running on default acceptance instead of actual examination, faith carried because it's easiest rather than because it's been claimed. That default isn't peace with your tradition. It's an inheritance still waiting for you to choose it on purpose, the way your father's line once did.`,
    },

    '7_F2': {
      heading: `Aimed at Something Higher`,
      why: `Somewhere in your father's spiritual line, someone pointed real determination at a spiritual destination rather than letting it dissipate into mere busyness. The Chariot in your Paternal Spiritual Talent means directed spiritual will is your inheritance.`,
      shadow: `The risk is applying the drive without ever pausing to check the direction, moving hard toward a spiritual goal that was set for you rather than one you've actually examined.`,
      path: `This talent asks you to aim the inherited drive at a destination you've chosen yourself. You are allowed to slow down long enough to steer. What spiritual direction are you moving toward that you've actually chosen, not just inherited momentum toward?`,
      positive: `The drive hasn't changed — the determination itself was always real and considerable. What's different is that it's now aimed at a destination you've actually chosen, rather than one inherited and never examined. That alignment is what lets the momentum take you somewhere worth arriving, instead of just somewhere fast.`,
      negative: `The spiritual drive is completely real, and it keeps burning hard toward a destination that was set for you rather than chosen by you, momentum spent without ever quite arriving anywhere genuinely yours. That expenditure isn't wasted ambition. It's inherited direction still waiting for you to actually steer it somewhere your own.`,
    },

    '8_F2': {
      heading: `Fairness, Practiced Quietly`,
      why: `Somewhere back along your father's spiritual line, someone held a real, careful sense of moral balance — not loud judgment, but a quiet insistence on doing right by people. Justice in your Paternal Spiritual Talent means integrity itself is your inheritance.`,
      shadow: `The risk is turning that fairness outward only, auditing everyone else's conduct while your own goes unexamined, mistaking vigilance for virtue.`,
      path: `This talent asks you to apply the inherited standard to yourself first. You are allowed to receive the same fairness you extend to others. Where would your own verdict soften if you judged yourself as gently as you judge fairly?`,
      positive: `The integrity hasn't changed — the quiet insistence on doing right by people was always real. What's different is that the same standard now applies to you too, not just everyone else. That evenness is what turns an inherited fairness into something trusted rather than merely feared.`,
      negative: `The moral integrity is completely real, and it keeps applying only outward, auditing everyone else's conduct while your own goes quietly unexamined. That imbalance isn't virtue. It's an inherited fairness curdling into self-exemption, still waiting for you to extend the same standard to yourself.`,
    },

    '9_F2': {
      heading: `Wisdom Found Alone`,
      why: `Somewhere in your father's spiritual line, someone found real understanding through solitude — withdrawal that produced depth rather than isolation. The Hermit in your Paternal Spiritual Talent means contemplative wisdom is your inheritance.`,
      shadow: `The risk is staying in the solitude past its purpose, gathering wisdom that never gets carried back out to anyone who could actually use it.`,
      path: `This talent asks you to return from the quiet with something to offer. You are allowed to bring the solitary understanding into shared light. Who nearby could use what your withdrawal has already shown you?`,
      positive: `The capacity for solitary depth hasn't changed — real understanding still comes from withdrawal, the way it did for your father's line. What's different is that you now return from the quiet with something to offer, instead of keeping the wisdom entirely to yourself. That return is what turns it into a genuine gift.`,
      negative: `The capacity for contemplative depth is completely real, and it keeps staying in the solitude past its purpose, wisdom gathered but never carried back out to anyone who could use it. That withholding isn't introversion. It's an inherited depth still waiting for someone to bring it back into the light.`,
    },

    '10_F2': {
      heading: `Timing, Learned the Hard Way`,
      why: `Somewhere back along your father's spiritual line, someone learned to read the turning of a spiritual season rather than fighting every downturn as a catastrophe. The Wheel of Fortune in your Paternal Spiritual Talent means faith through cycles is your inheritance.`,
      shadow: `The risk is forgetting the lesson under real pressure, treating every low spiritual season as proof that everything is failing rather than simply turning.`,
      path: `This talent asks you to trust the turning even when you're currently on the downswing. You are allowed to meet a hard season with curiosity instead of panic. What might this current spiritual low actually be clearing space for?`,
      positive: `The trust in spiritual timing hasn't changed — the ability to read a season turning was always real. What's different is that you now meet a downswing with the earned patience your father's line learned the hard way, instead of treating every low as catastrophe. That patience is what lets the turning actually complete.`,
      negative: `The trust in cycles is completely real and hard-won, and it keeps getting forgotten exactly under pressure, an ordinary low season treated as proof everything is failing. That panic isn't a character flaw. It's inherited wisdom going unused precisely when it's needed most, still waiting for you to remember it mid-downturn.`,
    },

    '11_F2': {
      heading: `Strength Never Proven`,
      why: `Somewhere in your father's spiritual line, someone carried real inner steadiness that didn't need an audience to be true. Strength in your Paternal Spiritual Talent means quiet, unforced resilience is your inheritance.`,
      shadow: `The risk is performing the strength for others rather than simply holding it, turning an inward steadiness into something you feel you must constantly demonstrate.`,
      path: `This talent asks you to let the strength be private when it wants to be. You are allowed to be resilient without an audience or a test. Where in your spiritual life could you stop demonstrating and simply be steady?`,
      positive: `The inner steadiness hasn't changed — it never actually needed an audience to be real. What's different is that you now let it be private when it wants to be, instead of demonstrating it constantly. That quiet resilience is what makes an inherited strength durable rather than dependent on being witnessed.`,
      negative: `The inner steadiness is completely real, and it keeps getting performed rather than simply held, demonstrated for others until the strength starts depending on being seen. That performance isn't confidence. It's an inherited resilience still waiting to be trusted quietly, without needing a witness to make it count.`,
    },

    '12_F2': {
      heading: `Patience, Learned Upside Down`,
      why: `Somewhere back along your father's spiritual line, someone learned real patience through a season of genuine suspension — waiting that taught something standing still never could. The Hanged Man in your Paternal Spiritual Talent means patient perspective is your inheritance.`,
      shadow: `The risk is mistaking every pause for that same kind of productive suspension, staying in stuck situations indefinitely because waiting once paid off.`,
      path: `This talent asks you to tell the difference between a pause still doing work and one that's become avoidance. You are allowed to hang upside down a while longer only if the view is still teaching you. What is your current waiting actually showing you?`,
      positive: `The capacity for patient suspension hasn't changed — waiting really did teach your father's line something standing still never could. What's different is that you now tell a pause still doing work apart from one that's become avoidance. That discernment is what keeps the inherited patience producing insight instead of just delay.`,
      negative: `The capacity for patient suspension is completely real, and it keeps getting applied to every pause indiscriminately, a stuck situation endured indefinitely because waiting once paid off. That confusion isn't wisdom. It's an inherited patience that's outlived its purpose, still waiting for you to notice when it's actually become avoidance.`,
    },

    '13_F2': {
      heading: `Modeling How to End`,
      why: `Somewhere in your father's spiritual line, someone let a belief, a version of faith, or an old identity actually die when its time came, rather than propping it up past its natural end. Transformation in your Paternal Spiritual Talent means the capacity for real spiritual endings is your inheritance.`,
      shadow: `The risk is applying that willingness too readily, ending things prematurely just to avoid sitting with something difficult a little longer.`,
      path: `This talent asks you to let real endings complete without rushing them. You are allowed to let an old belief finish dying so something truer can be born. What version of your faith is quietly ready to be released?`,
      positive: `The capacity to let a belief actually die hasn't changed — that willingness was always your father's line's real inheritance. What's different is that you now let the ending complete fully, without rushing it just to escape the discomfort. That patience is what makes room for a truer faith to actually take its place.`,
      negative: `The capacity to let old beliefs end is completely real, and it keeps getting used to skip discomfort rather than complete the actual ending, a version of faith abandoned before it's genuinely finished dying. That haste isn't decisiveness. It's an inherited willingness to let go, still waiting to be used as real release instead of a quick exit.`,
    },

    '14_F2': {
      heading: `A Blend Without a Formula`,
      why: `Somewhere back along your father's spiritual line, someone found a genuine, working balance between devotion and daily life, discipline and ease, without needing a rulebook to get there. Temperance in your Paternal Spiritual Talent means integrated moderation is your inheritance.`,
      shadow: `The risk is treating the blend as fixed rather than living, applying an old formula for balance to a life that has since changed shape.`,
      path: `This talent asks you to keep re-blending rather than settling on one static mix. You are allowed to combine your spiritual practices slowly and call it mastery. What two parts of your faith are ready for a new blend?`,
      positive: `The gift for balance hasn't changed — the ability to blend devotion and daily life without a rulebook was always real. What's different is that you now keep re-blending as both evolve, instead of settling on one fixed mix. That ongoing calibration is what keeps an inherited integration genuinely working.`,
      negative: `The gift for balance is completely real, and it keeps applying an old, once-working formula to a life that's since changed shape, a mix that no longer actually balances anything. That rigidity isn't consistency. It's an inherited integration calcified into a static blend, still waiting for you to remix it.`,
    },

    '15_F2': {
      heading: `A Pull, Wrestled Honestly`,
      why: `Somewhere in your father's spiritual line, someone faced a real compulsion — toward power, control, or an old attachment — honestly enough to loosen its grip rather than pretend it wasn't there. The Devil in your Paternal Spiritual Talent means honest reckoning with spiritual shadow is your inheritance.`,
      shadow: `The risk is inheriting the pull itself without inheriting the honesty that faced it, repeating the compulsion while skipping the reckoning that actually worked.`,
      path: `This talent asks you to look at your own pull as directly as your line once did. You are allowed to examine the compulsion without shame. What is the pull actually protecting you from feeling?`,
      positive: `The pull hasn't disappeared — it was always real, inherited alongside the honesty that once faced it. What's different is that you've looked at your own version of it directly, the way your father's line once did, instead of pretending it wasn't there. That reckoning is what actually loosens its grip.`,
      negative: `The pull is completely real, and it keeps repeating itself unexamined, inherited without the honesty that once faced it down. That repetition isn't weakness. It's a compulsion still waiting for the same direct reckoning that loosened it once before, in the line that handed it to you.`,
    },

    '16_F2': {
      heading: `Rebuilt Truer From Collapse`,
      why: `Somewhere back along your father's spiritual line, a belief structure fell suddenly, and someone rebuilt afterward on more honest ground rather than reconstructing the same flawed shape. The Tower in your Paternal Spiritual Talent means resilience through spiritual collapse is your inheritance.`,
      shadow: `The risk is fearing collapse so much you avoid ever testing a belief that quietly needs it, propping up something you already suspect isn't sound.`,
      path: `This talent asks you to let a shaky structure fall on its own terms rather than defending it indefinitely. You are allowed to watch it fall without catching it this time. What belief of yours is already cracked and asking to be rebuilt honestly?`,
      positive: `The resilience through collapse hasn't changed — the capacity to rebuild on truer ground was always the real inheritance. What's different is that you now let a shaky structure fall on its own terms, instead of defending something you already suspect isn't sound. That willingness is what keeps your faith actually sound.`,
      negative: `The resilience through collapse is completely real, and it's being spent on defending a structure you already suspect is unsound, propping it up rather than letting it fall. That defense isn't faithfulness. It's an inherited resilience waiting to do its real work, delayed by a collapse you're postponing rather than allowing.`,
    },

    '17_F2': {
      heading: `Hope Without Proof`,
      why: `Somewhere in your father's spiritual line, someone kept faith burning through genuinely hard seasons, without needing evidence it would work out. The Star in your Paternal Spiritual Talent means unproven, durable hope is your inheritance.`,
      shadow: `The risk is keeping that hope modest and private, as if believing too openly or too largely would be tempting fate.`,
      path: `This talent asks you to let the hope be as large as it actually is. You are allowed to hope at full size. What immodest hope have you been quietly shrinking before anyone could hear it?`,
      positive: `The hope hasn't changed — the capacity to keep faith burning through hard seasons, without needing proof, was always real. What's different is that you now let it be as large and visible as it actually is, instead of keeping it modest. That visibility is what lets an inherited hope sustain the people around you too.`,
      negative: `The capacity for durable, unproven hope is completely real, and it keeps staying modest and private, as if believing too openly would be tempting fate. That caution isn't wisdom. It's an inherited faith shrunk to fit a fear it never actually needed, still waiting to be let out at its real size.`,
    },

    '18_F2': {
      heading: `Trusted Before Explained`,
      why: `Somewhere back along your father's spiritual line, someone trusted a felt spiritual undercurrent — a sensed presence, a hunch about meaning — before it could be proven or fully articulated. The Moon in your Paternal Spiritual Talent means trust in the unexplainable is your inheritance.`,
      shadow: `The risk is letting that trust curdle into anxious, unverified story, mistaking every strong feeling for confirmed spiritual truth.`,
      path: `This talent asks you to hold the sense as real without needing it verified. You are allowed to trust what you sense before you can explain it. What is that feeling actually pointing toward right now?`,
      positive: `The trust in unexplainable undercurrents hasn't changed — sensing meaning before it can be proven was always the real inheritance. What's different is that you now hold the sense as real without needing it verified, instead of letting every strong feeling curdle into anxious story. That discernment is what lets genuine intuition actually guide you.`,
      negative: `The sensitivity to spiritual undercurrents is completely real, and it keeps getting treated as certain fact rather than a felt hunch, curdling into anxious, unverified story. That confusion isn't intuition failing. It's a genuine sensitivity still waiting for you to sort what's actually sensed from what's simply worried.`,
    },

    '19_F2': {
      heading: `Joy as Part of Faith`,
      why: `Somewhere in your father's spiritual line, someone let genuine delight sit inside devotion rather than treating seriousness as the only proof of sincerity. The Sun in your Paternal Spiritual Talent means joyful faith is your inheritance.`,
      shadow: `The risk is hiding that joy behind a more solemn presentation, performing gravity because it feels like the more respectable way to be spiritual.`,
      path: `This talent asks you to let the joy be visible, not just felt. You are allowed to keep a joyful faith — reverence and laughter were never enemies. What delight might be the most serious spiritual practice available to you right now?`,
      positive: `The joy hasn't changed — genuine delight was always allowed to sit inside your father's line's devotion. What's different is that you now let it be visible, not just felt, instead of hiding it behind a more solemn presentation. That visibility is what makes an inherited faith contagious rather than merely respectable.`,
      negative: `The capacity for joyful faith is completely real, and it keeps hiding behind a more solemn performance, as though seriousness were the only proof of sincerity. That performance isn't reverence. It's an inherited warmth quietly drained out, still waiting for you to let the delight actually show.`,
    },

    '20_F2': {
      heading: `A Calling, Passed Along`,
      why: `Somewhere back along your father's spiritual line, someone heard an unmistakable spiritual summons — and whether or not they fully answered it, they passed the hearing of it down to you. Judgement in your Paternal Spiritual Talent means the capacity to recognize a real calling is your inheritance.`,
      shadow: `The risk is hearing the summons clearly and still finding sophisticated reasons to keep preparing instead of rising to meet it.`,
      path: `This talent asks you to answer before you feel fully ready. You are allowed to rise before you feel prepared. What is the calling asking of you this month, specifically?`,
      positive: `The capacity to recognize a real calling hasn't changed — you've heard it as clearly as your father's line once did. What's different is that you now answer before feeling fully ready, instead of finding sophisticated reasons to keep preparing. That responsiveness is what your line was hoping would finally happen.`,
      negative: `The capacity to hear a genuine calling is completely real, and it keeps being deferred for more preparation, heard clearly and still not answered. That delay isn't caution. It's an inherited summons still waiting for someone to rise to meet it before feeling fully ready.`,
    },

    '21_F2': {
      heading: `Never Quite Landed`,
      why: `Somewhere back along your father's spiritual line, someone came close to real spiritual arrival — an integration, a sense of having actually gotten there — and, for reasons lost to time, never quite let it be acknowledged as complete. The World in your Paternal Spiritual Talent means the capacity for genuine spiritual completion is your inheritance, waiting to actually be claimed.`,
      shadow: `The risk is repeating the same near-arrival, reaching real integration and still finding a reason it doesn't quite count as finished.`,
      path: `This talent asks you to let a spiritual arrival actually be called complete. You are allowed to call it finished and mean it. What spiritual milestone have you already reached that deserves to be named as arrived, not almost?`,
      positive: `The capacity for real spiritual arrival hasn't changed — you've reached genuine integration, the same way your father's line came close to. What's different is that you now let it actually be called complete, instead of finding a reason it doesn't quite count as finished. That naming is what finally lets the landing land.`,
      negative: `The capacity for genuine spiritual arrival is completely real, and it keeps reaching real integration and finding a reason it doesn't quite count as finished. That habit isn't humility. It's an inherited near-arrival repeating itself, still waiting for someone to call a real milestone complete instead of almost.`,
    },

    '22_F2': {
      heading: `Believed Before It Was Safe`,
      why: `Somewhere in your father's spiritual line, someone believed in spiritual freedom and possibility before circumstances made it safe to act on — faith as an act of daring, not just comfort. The Fool in your Paternal Spiritual Talent means the capacity for that kind of leap is your inheritance.`,
      shadow: `The risk is inheriting the belief in freedom without ever actually taking the leap it was pointing toward, keeping the possibility purely theoretical.`,
      path: `This talent asks you to actually take one leap this season. You are allowed to leap with open eyes and still call it faith. What would you begin if wisdom and boldness finally worked together instead of the boldness always waiting for permission?`,
      positive: `The belief in spiritual freedom hasn't changed — faith as an act of daring was always your father's line's real inheritance. What's different is that you now actually take the leap it was pointing toward, instead of keeping the possibility theoretical. That action is what turns inherited faith into inherited courage.`,
      negative: `The belief in spiritual freedom is completely real, and it keeps staying theoretical, a comforting idea that never becomes an actual leap. That hesitation isn't wisdom waiting for the right moment. It's inherited courage still waiting for a permission that was never actually required to begin with.`,
    },


    // ── Lineage Square Talents: Maternal Spiritual Talent (G2) ─────────────

    '1_G2': {
      heading: `Half-Lit, Passed Down`,
      why: `Somewhere in your mother's spiritual line, someone carried the raw ability to begin a belief, a practice, a way of seeing — and that initiating spark reached you intact. The Magician in your Maternal Spiritual Talent means origination itself is your inheritance.`,
      shadow: `The risk is treating the spark as entertainment, lighting new spiritual interests easily and letting each cool before it ever deepens into anything lasting.`,
      path: `This talent asks you to stay with one spiritual thread past its exciting opening. You are allowed to let a single practice mature past its beginning. What belief, sparked long ago in your line, is ready for you to actually build on?`,
      positive: `The gift for spiritual initiation hasn't changed — you still light new belief and practice easily, faster than most people manage. What's different is that you now stay with one thread long enough to let it mature past its exciting opening, so the spark you inherited finally becomes a foundation instead of one more bright, brief start.`,
      negative: `The gift for spiritual initiation is completely real, and it keeps getting treated as disposable — a new practice lit easily, then let go cold the moment the initial charge fades. That pattern isn't fickleness. It's an inherited spark still waiting for the one thread you'll actually stay with long enough to build something on.`,
    },

    '2_G2': {
      heading: `Knowing Without Words`,
      why: `Somewhere back along your mother's spiritual line, someone trusted an inner sense they couldn't fully explain, and passed down the trust itself rather than an explanation. The High Priestess in your Maternal Spiritual Talent means intuitive certainty is your inheritance.`,
      shadow: `The risk is keeping that knowing so guarded it never gets tested, treating the unexplainable as a reason to stay silent instead of simply unspoken.`,
      path: `This talent asks you to act on the knowing before it's provable. You are allowed to trust what you sense before you can explain it. What is the inherited knowing telling you right now?`,
      positive: `The inner knowing hasn't changed — it was always accurate, always arriving before proof. What's different is that you now act on it before you can fully defend it in words, letting the certainty be used instead of only held. Each time you do, the inherited trust your mother's line passed down wordlessly gets to actually prove itself.`,
      negative: `The inner knowing is completely real, and it keeps staying too guarded to ever be tested, treated as unexplainable rather than simply unspoken. That silence isn't humility. It's the gift staying theoretical, still waiting for the one time you'll act on it before you can defend it, the way it was originally meant to be used.`,
    },

    '3_G2': {
      heading: `Quiet Abundance`,
      why: `Somewhere in your mother's spiritual line, someone held real warmth and generative richness that didn't need to be announced to be true. The Empress in your Maternal Spiritual Talent means abundance of spirit is your inheritance.`,
      shadow: `The risk is keeping that abundance entirely internal, tending a rich inner world without ever letting it feed anyone beyond yourself.`,
      path: `This talent asks you to let the abundance move outward. You are allowed to let your spiritual richness nourish someone besides yourself. Who nearby is hungry for exactly the warmth you already carry?`,
      positive: `The abundance was always genuinely there — a real warmth, a rich generative inner life. What's different is that it now moves outward, reaching someone besides yourself, instead of staying tended in private. That movement is what turns an inherited spiritual richness into the shared gift it was quietly built to become.`,
      negative: `The abundance is completely real, and it keeps staying internal, tended carefully but never let out to nourish anyone else. That containment isn't humility. It's a generosity your mother's line carried quietly, still waiting for someone to actually let it move toward another person.`,
    },

    '4_G2': {
      heading: `A Structure Meant to Last`,
      why: `Somewhere back along your mother's spiritual line, someone built a framework of belief sturdy enough to hold real weight through hard seasons. The Emperor in your Maternal Spiritual Talent means structural steadiness is your inheritance.`,
      shadow: `The risk is mistaking the structure for the point, defending the framework rather than what it was built to hold, until the scaffolding matters more than the faith inside it.`,
      path: `This talent asks you to keep the structure in service of the life. You are allowed to hold your convictions firmly without needing them unquestioned. Which spiritual structure of yours could flex without actually falling?`,
      positive: `The structural steadiness hasn't changed — the framework still holds real weight. What's different is that you now keep it in service of the faith it was built to hold, rather than defending the structure for its own sake. That flexibility is what lets an inherited steadiness outlast hard seasons instead of cracking or strangling what's inside it.`,
      negative: `The structural steadiness is completely real, and it keeps calcifying into something defended for its own sake, mattering more than the faith it was originally built to hold. That rigidity isn't strength. It's an inherited scaffolding your mother's line built to hold weight, quietly strangling the very thing it was meant to support.`,
    },

    '5_G2': {
      heading: `A Whole Teaching, Inherited`,
      why: `Somewhere in your mother's spiritual line, someone received and carried forward real, specific teaching — not a vague tradition, but actual doctrine passed hand to hand. The Hierophant in your Maternal Spiritual Talent means the full transmission is your inheritance.`,
      shadow: `The risk is carrying the teaching unexamined, repeating what you were taught without testing it against your own lived encounter with the sacred.`,
      path: `This talent asks you to keep what still serves and release the rest, on your own authority. You are allowed to inherit the teaching and still make it yours. Which part of what you were handed has actually proven true in your own life?`,
      positive: `The body of teaching hasn't changed — the actual doctrine your mother's line handed down is still fully intact. What's different is that you've tested it against your own lived encounter with the sacred, keeping what holds and releasing what doesn't. That renewal is what makes the inheritance alive rather than merely recited.`,
      negative: `The body of teaching is completely real, carried whole from your mother's line, and it keeps going untested against your own actual experience, recited rather than believed. That habit isn't reverence. It's a real transmission quietly stopping at you, never renewed enough to genuinely pass on to anyone after.`,
    },

    '6_G2': {
      heading: `Freely Chosen Devotion`,
      why: `Somewhere back along your mother's spiritual line, someone chose their faith rather than simply inheriting it — a real, examined devotion, arrived at rather than assumed. The Lovers in your Maternal Spiritual Talent means the capacity to choose belief on purpose is your inheritance.`,
      shadow: `The risk is going through the motions of choice while actually just accepting whatever was easiest or expected, mistaking comfort for conviction.`,
      path: `This talent asks you to actually examine and reclaim what you believe. You are allowed to keep only the parts of your inherited faith you would choose fresh today. What would you choose if no one before you had already chosen it?`,
      positive: `The devotion hasn't changed — the capacity to actually choose your beliefs, rather than merely receive them, was always the real inheritance. What's different is that you've examined what you believe and chosen it again, deliberately, instead of accepting it by default. That ownership is what makes faith durable under real pressure.`,
      negative: `The capacity for genuine, chosen devotion is completely real, and it keeps running on default acceptance instead of actual examination, faith carried because it's easiest rather than because it's been claimed. That default isn't peace with your tradition. It's an inheritance still waiting for you to choose it on purpose, the way your mother's line once did.`,
    },

    '7_G2': {
      heading: `Drive Aimed Higher`,
      why: `Somewhere in your mother's spiritual line, someone pointed real determination at a spiritual destination rather than letting it dissipate into busyness. The Chariot in your Maternal Spiritual Talent means directed spiritual will is your inheritance.`,
      shadow: `The risk is applying the drive without checking the direction, moving hard toward a spiritual goal set for you rather than one you've actually examined.`,
      path: `This talent asks you to aim the inherited drive at a destination you've chosen yourself. You are allowed to slow down long enough to steer. What spiritual direction have you actually chosen, not just inherited momentum toward?`,
      positive: `The drive hasn't changed — the determination itself was always real and considerable. What's different is that it's now aimed at a destination you've actually chosen, rather than one inherited and never examined. That alignment is what lets the momentum take you somewhere worth arriving, instead of just somewhere fast.`,
      negative: `The spiritual drive is completely real, and it keeps burning hard toward a destination that was set for you rather than chosen by you, momentum spent without ever quite arriving anywhere genuinely yours. That expenditure isn't wasted ambition. It's inherited direction still waiting for you to actually steer it somewhere your own.`,
    },

    '8_G2': {
      heading: `Quiet Practice of Fairness`,
      why: `Somewhere back along your mother's spiritual line, someone held a real, careful sense of moral balance — quiet insistence on doing right rather than loud judgment. Justice in your Maternal Spiritual Talent means integrity itself is your inheritance.`,
      shadow: `The risk is turning that fairness outward only, auditing everyone else's conduct while your own goes unexamined.`,
      path: `This talent asks you to apply the standard to yourself first. You are allowed to receive the same fairness you extend to others. Where would your own verdict soften if you judged yourself as gently as you judge fairly?`,
      positive: `The integrity hasn't changed — the quiet insistence on doing right by people was always real. What's different is that the same standard now applies to you too, not just everyone else. That evenness is what turns an inherited fairness into something trusted rather than merely feared.`,
      negative: `The moral integrity is completely real, and it keeps applying only outward, auditing everyone else's conduct while your own goes quietly unexamined. That imbalance isn't virtue. It's an inherited fairness curdling into self-exemption, still waiting for you to extend the same standard to yourself.`,
    },

    '9_G2': {
      heading: `Wisdom Found in Solitude`,
      why: `Somewhere in your mother's spiritual line, someone found real understanding through solitude — withdrawal that produced depth, not isolation. The Hermit in your Maternal Spiritual Talent means contemplative wisdom is your inheritance.`,
      shadow: `The risk is staying in the solitude past its purpose, gathering wisdom that never gets carried back out to anyone who could use it.`,
      path: `This talent asks you to return from the quiet with something to offer. You are allowed to bring the solitary understanding into shared light. Who nearby could use what your withdrawal has already shown you?`,
      positive: `The capacity for solitary depth hasn't changed — real understanding still comes from withdrawal, the way it did for your mother's line. What's different is that you now return from the quiet with something to offer, instead of keeping the wisdom entirely to yourself. That return is what turns it into a genuine gift.`,
      negative: `The capacity for contemplative depth is completely real, and it keeps staying in the solitude past its purpose, wisdom gathered but never carried back out to anyone who could use it. That withholding isn't introversion. It's an inherited depth still waiting for someone to bring it back into the light.`,
    },

    '10_G2': {
      heading: `Timing Learned Hard`,
      why: `Somewhere back along your mother's spiritual line, someone learned to read a spiritual season's turning rather than fighting every downturn as catastrophe. The Wheel of Fortune in your Maternal Spiritual Talent means faith through cycles is your inheritance.`,
      shadow: `The risk is forgetting the lesson under real pressure, treating a low spiritual season as proof everything is failing rather than simply turning.`,
      path: `This talent asks you to trust the turning even mid-downswing. You are allowed to meet a hard season with curiosity instead of panic. What might this current spiritual low actually be clearing space for?`,
      positive: `The trust in spiritual timing hasn't changed — the ability to read a season turning was always real. What's different is that you now meet a downswing with the earned patience your mother's line learned the hard way, instead of treating every low as catastrophe. That patience is what lets the turning actually complete.`,
      negative: `The trust in cycles is completely real and hard-won, and it keeps getting forgotten exactly under pressure, an ordinary low season treated as proof everything is failing. That panic isn't a character flaw. It's inherited wisdom going unused precisely when it's needed most, still waiting for you to remember it mid-downturn.`,
    },

    '11_G2': {
      heading: `Unproven Strength`,
      why: `Somewhere in your mother's spiritual line, someone carried real inner steadiness that didn't need an audience to be true. Strength in your Maternal Spiritual Talent means quiet, unforced resilience is your inheritance.`,
      shadow: `The risk is performing that strength for others rather than simply holding it, turning inward steadiness into something you feel must be constantly demonstrated.`,
      path: `This talent asks you to let the strength be private when it wants to be. You are allowed to be resilient without an audience or a test. Where in your spiritual life could you stop demonstrating and simply be steady?`,
      positive: `The inner steadiness hasn't changed — it never actually needed an audience to be real. What's different is that you now let it be private when it wants to be, instead of demonstrating it constantly. That quiet resilience is what makes an inherited strength durable rather than dependent on being witnessed.`,
      negative: `The inner steadiness is completely real, and it keeps getting performed rather than simply held, demonstrated for others until the strength starts depending on being seen. That performance isn't confidence. It's an inherited resilience still waiting to be trusted quietly, without needing a witness to make it count.`,
    },

    '12_G2': {
      heading: `Patience From Upside Down`,
      why: `Somewhere back along your mother's spiritual line, someone learned real patience through a genuine season of suspension — waiting that taught something standing still never could. The Hanged Man in your Maternal Spiritual Talent means patient perspective is your inheritance.`,
      shadow: `The risk is mistaking every pause for that same productive suspension, staying in stuck situations indefinitely because waiting once paid off.`,
      path: `This talent asks you to tell a generative pause from mere stalling. You are allowed to hang upside down a while longer only if the view is still teaching you. What is your current waiting actually showing you?`,
      positive: `The capacity for patient suspension hasn't changed — waiting really did teach your mother's line something standing still never could. What's different is that you now tell a pause still doing work apart from one that's become avoidance. That discernment is what keeps the inherited patience producing insight instead of just delay.`,
      negative: `The capacity for patient suspension is completely real, and it keeps getting applied to every pause indiscriminately, a stuck situation endured indefinitely because waiting once paid off. That confusion isn't wisdom. It's an inherited patience that's outlived its purpose, still waiting for you to notice when it's actually become avoidance.`,
    },

    '13_G2': {
      heading: `Showing How to End Well`,
      why: `Somewhere in your mother's spiritual line, someone let a belief or old identity actually die when its time came, rather than propping it up past its natural end. Transformation in your Maternal Spiritual Talent means the capacity for real spiritual endings is your inheritance.`,
      shadow: `The risk is applying that willingness too readily, ending things prematurely just to avoid sitting with something difficult a little longer.`,
      path: `This talent asks you to let real endings complete without rushing them. You are allowed to let an old belief finish dying so something truer can be born. What version of your faith is quietly ready to be released?`,
      positive: `The capacity to let a belief actually die hasn't changed — that willingness was always your mother's line's real inheritance. What's different is that you now let the ending complete fully, without rushing it just to escape the discomfort. That patience is what makes room for a truer faith to actually take its place.`,
      negative: `The capacity to let old beliefs end is completely real, and it keeps getting used to skip discomfort rather than complete the actual ending, a version of faith abandoned before it's genuinely finished dying. That haste isn't decisiveness. It's an inherited willingness to let go, still waiting to be used as real release instead of a quick exit.`,
    },

    '14_G2': {
      heading: `A Formula-Free Blend`,
      why: `Somewhere back along your mother's spiritual line, someone found a genuine, working balance between devotion and daily life without needing a rulebook. Temperance in your Maternal Spiritual Talent means integrated moderation is your inheritance.`,
      shadow: `The risk is treating that blend as fixed, applying an old formula for balance to a life that has since changed shape.`,
      path: `This talent asks you to keep re-blending rather than settling on one static mix. You are allowed to combine your spiritual practices slowly and call it mastery. What two parts of your faith are ready for a new blend?`,
      positive: `The gift for balance hasn't changed — the ability to blend devotion and daily life without a rulebook was always real. What's different is that you now keep re-blending as both evolve, instead of settling on one fixed mix. That ongoing calibration is what keeps an inherited integration genuinely working.`,
      negative: `The gift for balance is completely real, and it keeps applying an old, once-working formula to a life that's since changed shape, a mix that no longer actually balances anything. That rigidity isn't consistency. It's an inherited integration calcified into a static blend, still waiting for you to remix it.`,
    },

    '15_G2': {
      heading: `An Honest Wrestling`,
      why: `Somewhere in your mother's spiritual line, someone faced a real compulsion — toward control, comfort, or an old attachment — honestly enough to loosen its grip. The Devil in your Maternal Spiritual Talent means honest reckoning with spiritual shadow is your inheritance.`,
      shadow: `The risk is inheriting the pull without inheriting the honesty that once faced it, repeating the compulsion while skipping the reckoning that actually worked.`,
      path: `This talent asks you to look at your own pull as directly as your line once did. You are allowed to examine the compulsion without shame. What is the pull actually protecting you from feeling?`,
      positive: `The pull hasn't disappeared — it was always real, inherited alongside the honesty that once faced it. What's different is that you've looked at your own version of it directly, the way your mother's line once did, instead of pretending it wasn't there. That reckoning is what actually loosens its grip.`,
      negative: `The pull is completely real, and it keeps repeating itself unexamined, inherited without the honesty that once faced it down. That repetition isn't weakness. It's a compulsion still waiting for the same direct reckoning that loosened it once before, in the line that handed it to you.`,
    },

    '16_G2': {
      heading: `Truer After Collapse`,
      why: `Somewhere back along your mother's spiritual line, a belief structure fell suddenly, and someone rebuilt afterward on more honest ground rather than reconstructing the same flawed shape. The Tower in your Maternal Spiritual Talent means resilience through spiritual collapse is your inheritance.`,
      shadow: `The risk is fearing collapse so much you avoid testing a belief that quietly needs it, propping up something you already suspect isn't sound.`,
      path: `This talent asks you to let a shaky structure fall on its own terms. You are allowed to watch it fall without catching it this time. What belief of yours is already cracked and asking to be rebuilt honestly?`,
      positive: `The resilience through collapse hasn't changed — the capacity to rebuild on truer ground was always the real inheritance. What's different is that you now let a shaky structure fall on its own terms, instead of defending something you already suspect isn't sound. That willingness is what keeps your faith actually sound.`,
      negative: `The resilience through collapse is completely real, and it's being spent on defending a structure you already suspect is unsound, propping it up rather than letting it fall. That defense isn't faithfulness. It's an inherited resilience waiting to do its real work, delayed by a collapse you're postponing rather than allowing.`,
    },

    '17_G2': {
      heading: `Hope Kept Without Proof`,
      why: `Somewhere in your mother's spiritual line, someone kept faith burning through genuinely hard seasons without needing evidence it would work out. The Star in your Maternal Spiritual Talent means unproven, durable hope is your inheritance.`,
      shadow: `The risk is keeping that hope modest and private, as if believing too openly would be tempting fate.`,
      path: `This talent asks you to let the hope be as large as it actually is. You are allowed to hope at full size. What immodest hope have you been quietly shrinking before anyone could hear it?`,
      positive: `The hope hasn't changed — the capacity to keep faith burning through hard seasons, without needing proof, was always real. What's different is that you now let it be as large and visible as it actually is, instead of keeping it modest. That visibility is what lets an inherited hope sustain the people around you too.`,
      negative: `The capacity for durable, unproven hope is completely real, and it keeps staying modest and private, as if believing too openly would be tempting fate. That caution isn't wisdom. It's an inherited faith shrunk to fit a fear it never actually needed, still waiting to be let out at its real size.`,
    },

    '18_G2': {
      heading: `Sensed Before Explained`,
      why: `Somewhere back along your mother's spiritual line, someone trusted a felt spiritual undercurrent before it could be proven or fully articulated. The Moon in your Maternal Spiritual Talent means trust in the unexplainable is your inheritance.`,
      shadow: `The risk is letting that trust curdle into anxious, unverified story, mistaking every strong feeling for confirmed spiritual truth.`,
      path: `This talent asks you to hold the sense as real without needing it verified. You are allowed to trust what you sense before you can explain it. What is that feeling actually pointing toward right now?`,
      positive: `The trust in unexplainable undercurrents hasn't changed — sensing meaning before it can be proven was always the real inheritance. What's different is that you now hold the sense as real without needing it verified, instead of letting every strong feeling curdle into anxious story. That discernment is what lets genuine intuition actually guide you.`,
      negative: `The sensitivity to spiritual undercurrents is completely real, and it keeps getting treated as certain fact rather than a felt hunch, curdling into anxious, unverified story. That confusion isn't intuition failing. It's a genuine sensitivity still waiting for you to sort what's actually sensed from what's simply worried.`,
    },

    '19_G2': {
      heading: `Faith With Room for Joy`,
      why: `Somewhere in your mother's spiritual line, someone let genuine delight sit inside devotion rather than treating seriousness as the only proof of sincerity. The Sun in your Maternal Spiritual Talent means joyful faith is your inheritance.`,
      shadow: `The risk is hiding that joy behind a more solemn presentation, performing gravity because it feels like the more respectable way to be spiritual.`,
      path: `This talent asks you to let the joy be visible, not just felt. You are allowed to keep a joyful faith — reverence and laughter were never enemies. What delight might be the most serious spiritual practice available to you right now?`,
      positive: `The joy hasn't changed — genuine delight was always allowed to sit inside your mother's line's devotion. What's different is that you now let it be visible, not just felt, instead of hiding it behind a more solemn presentation. That visibility is what makes an inherited faith contagious rather than merely respectable.`,
      negative: `The capacity for joyful faith is completely real, and it keeps hiding behind a more solemn performance, as though seriousness were the only proof of sincerity. That performance isn't reverence. It's an inherited warmth quietly drained out, still waiting for you to let the delight actually show.`,
    },

    '20_G2': {
      heading: `A Calling, Handed Forward`,
      why: `Somewhere back along your mother's spiritual line, someone heard an unmistakable spiritual summons and passed the hearing of it down to you, whether or not they fully answered it. Judgement in your Maternal Spiritual Talent means recognizing a real calling is your inheritance.`,
      shadow: `The risk is hearing the summons clearly and still finding sophisticated reasons to keep preparing instead of rising to meet it.`,
      path: `This talent asks you to answer before you feel fully ready. You are allowed to rise before you feel prepared. What is the calling asking of you this month, specifically?`,
      positive: `The capacity to recognize a real calling hasn't changed — you've heard it as clearly as your mother's line once did. What's different is that you now answer before feeling fully ready, instead of finding sophisticated reasons to keep preparing. That responsiveness is what your line was hoping would finally happen.`,
      negative: `The capacity to hear a genuine calling is completely real, and it keeps being deferred for more preparation, heard clearly and still not answered. That delay isn't caution. It's an inherited summons still waiting for someone to rise to meet it before feeling fully ready.`,
    },

    '21_G2': {
      heading: `A Completion That Never Landed`,
      why: `Somewhere in your mother's spiritual line, someone came close to real spiritual arrival and, for reasons lost to time, never quite let it be acknowledged as complete. The World in your Maternal Spiritual Talent means the capacity for genuine completion is your inheritance, waiting to be claimed.`,
      shadow: `The risk is repeating the same near-arrival, reaching real integration and still finding a reason it doesn't quite count as finished.`,
      path: `This talent asks you to let a spiritual arrival actually be called complete. You are allowed to call it finished and mean it. What spiritual milestone have you already reached that deserves to be named as arrived, not almost?`,
      positive: `The capacity for real spiritual arrival hasn't changed — you've reached genuine integration, the same way your mother's line came close to. What's different is that you now let it actually be called complete, instead of finding a reason it doesn't quite count as finished. That naming is what finally lets the landing land.`,
      negative: `The capacity for genuine spiritual arrival is completely real, and it keeps reaching real integration and finding a reason it doesn't quite count as finished. That habit isn't humility. It's an inherited near-arrival repeating itself, still waiting for someone to call a real milestone complete instead of almost.`,
    },

    '22_G2': {
      heading: `Belief Before Safety`,
      why: `Somewhere back along your mother's spiritual line, someone believed in spiritual freedom and possibility before circumstances made it safe to act on. The Fool in your Maternal Spiritual Talent means the capacity for that kind of leap is your inheritance.`,
      shadow: `The risk is inheriting the belief in freedom without ever actually taking the leap it was pointing toward, keeping the possibility purely theoretical.`,
      path: `This talent asks you to actually take one leap this season. You are allowed to leap with open eyes and still call it faith. What would you begin if wisdom and boldness finally worked together?`,
      positive: `The belief in spiritual freedom hasn't changed — faith as an act of daring was always your mother's line's real inheritance. What's different is that you now actually take the leap it was pointing toward, instead of keeping the possibility theoretical. That action is what turns inherited faith into inherited courage.`,
      negative: `The belief in spiritual freedom is completely real, and it keeps staying theoretical, a comforting idea that never becomes an actual leap. That hesitation isn't wisdom waiting for the right moment. It's inherited courage still waiting for a permission that was never actually required to begin with.`,
    },


    // ── Lineage Square Talents: Paternal Material Talent (H2) ───────────────

    '1_H2': {
      heading: `Making Something From Nothing`,
      why: `Somewhere in your father's material line, someone could start a venture, a trade, an income from bare circumstances — real, practical originating ability. The Magician in your Paternal Material Talent means launching from scratch is your inheritance.`,
      shadow: `The risk is starting many things and finishing few, spending the inherited spark on the exciting opening and losing interest once the harder building begins.`,
      path: `This talent asks you to carry one material venture past its beginning. You are allowed to finish something ordinary and let that count. What would you build if starting were the qualification, not finishing?`,
      positive: `The gift for material initiation hasn't changed — you can still start a venture from bare circumstances faster than most people manage. What's different is that you now carry one past its exciting opening, into the harder, less glamorous building. That persistence is what turns the inherited spark into something that actually lasts.`,
      negative: `The gift for material initiation is completely real, and it keeps getting spent entirely on beginnings — venture after venture launched, then quietly abandoned once the harder building starts. That pattern isn't a lack of ability. It's an inherited spark still waiting for the one start you'll actually carry through to a finish.`,
    },

    '2_H2': {
      heading: `Instinct Ahead of the Numbers`,
      why: `Somewhere back along your father's material line, someone read a financial or practical situation correctly before the facts could confirm it — instinct that outran the spreadsheet and was usually right. The High Priestess in your Paternal Material Talent means that instinct is your inheritance.`,
      shadow: `The risk is trusting the instinct so privately it never gets acted on, letting a correct read go unused because it can't yet be justified on paper.`,
      path: `This talent asks you to act on the instinct and let the numbers catch up. You are allowed to trust the practical read before you can explain it. Where has that inherited gut-sense already been right, quietly, without credit?`,
      positive: `The practical instinct hasn't changed — it still outruns the spreadsheet, and it's usually right. What's different is that you now act on it before it's fully provable, instead of confirming it privately after the fact. That willingness to move on the read is what makes an inherited instinct actually useful, not just accurate in hindsight.`,
      negative: `The practical instinct is completely real, and it keeps being trusted only privately, confirmed quietly after the fact rather than acted on when it mattered. That habit isn't caution. It's an inherited gut-sense still waiting for the one time you'll let it change a decision instead of just narrate one afterward.`,
    },

    '3_H2': {
      heading: `Ensuring Everyone's Provided For`,
      why: `Somewhere in your father's material line, someone made certain the people around them were fed, housed, and materially cared for — practical generosity as instinct, not effort. The Empress in your Paternal Material Talent means that provision is your inheritance.`,
      shadow: `The risk is providing for everyone except yourself, extending the generosity outward so consistently that your own material comfort quietly goes unattended.`,
      path: `This talent asks you to include yourself in the providing. You are allowed to be fed and held too, not just to make sure of it for others. Who checks whether you've eaten, rested, been materially cared for lately?`,
      positive: `The instinct to provide hasn't changed — making sure people are fed and cared for was always genuine, not effort. What's different is that you now let yourself be provided for too, instead of extending the generosity only outward. That reciprocity is what keeps an inherited gift sustainable rather than depleting.`,
      negative: `The instinct to provide is completely real, and it keeps running exclusively outward, extended to everyone except the person extending it. That imbalance isn't generosity working as intended. It's an inherited provision that's excluded its own source, still waiting for you to let yourself be included in the care.`,
    },

    '4_H2': {
      heading: `Structure Built to Hold Weight`,
      why: `Somewhere back along your father's material line, someone built systems — a business, a household economy, a way of organizing resources — sturdy enough to actually last. The Emperor in your Paternal Material Talent means structural competence is your inheritance.`,
      shadow: `The risk is building structures so rigid they become a burden to maintain, mistaking control for stability until the system exists mainly to be defended.`,
      path: `This talent asks you to let the structure serve rather than dominate. You are allowed to hold power in your material life gently. Where could steadiness replace either the grip or the absence?`,
      positive: `The structural competence hasn't changed — building systems sturdy enough to last was always the real inheritance. What's different is that you now let the structure serve the life inside it, rather than defending or managing it constantly. That ease is what makes an inherited competence actually livable.`,
      negative: `The structural competence is completely real, and the systems it builds keep becoming their own burden, controlled rather than lived inside, requiring constant management to hold. That weight isn't the price of stability. It's an inherited competence still waiting to serve rather than dominate.`,
    },

    '5_H2': {
      heading: `A Skill, Never Formally Taught`,
      why: `Somewhere in your father's material line, someone carried real practical know-how — a trade, a craft, a way of handling money or materials — learned by doing rather than by certificate. The Hierophant in your Paternal Material Talent means that untaught expertise is your inheritance.`,
      shadow: `The risk is undervaluing the skill precisely because it wasn't formally credentialed, treating something genuinely expert as merely ordinary.`,
      path: `This talent asks you to name the skill as real expertise. You are allowed to own the abilities nobody certified. What untaught competence of yours deserves to be named as expertise rather than a knack?`,
      positive: `The skill hasn't changed — the practical know-how absorbed by watching, not by certificate, was always genuine expertise. What's different is that you now name it as such, instead of treating it as merely a knack because it wasn't formally taught. That naming is what finally lets it be valued at its actual worth.`,
      negative: `The skill is completely real, learned by doing the way it always was in your father's line, and it keeps being dismissed as ordinary simply because no one certified it. That undervaluing isn't modesty. It's genuine expertise still waiting for someone to actually call it that.`,
    },

    '6_H2': {
      heading: `Sense for What Matters When Tight`,
      why: `Somewhere back along your father's material line, someone kept clear values intact even when money or resources were genuinely scarce — clarity about what mattered that didn't bend under pressure. The Lovers in your Paternal Material Talent means that clarity is your inheritance.`,
      shadow: `The risk is letting that clarity fade the moment resources become comfortable, forgetting under abundance the values that were so sharp under scarcity.`,
      path: `This talent asks you to keep the clarity active even when it isn't required. You are allowed to keep the essential things essential, scarce or not. What does your inheritance help you see that abundance tends to blur?`,
      positive: `The clarity about what matters hasn't changed — it held steady under real scarcity, the way it did for your father's line. What's different is that you now keep it active even when resources are comfortable, instead of letting it fade the moment pressure lifts. That consistency is what makes an inherited clarity durable rather than situational.`,
      negative: `The clarity about what matters is completely real, sharp and dependable under scarcity, and it keeps going dormant the moment resources become comfortable. That fading isn't relaxation. It's an inherited value that only activates under survival pressure, still waiting to stay switched on when things get easy.`,
    },

    '7_H2': {
      heading: `Determination Without a Co-Pilot`,
      why: `Somewhere in your father's material line, someone drove a material goal forward alone, without waiting for permission or partnership to move. The Chariot in your Paternal Material Talent means self-directed material drive is your inheritance.`,
      shadow: `The risk is refusing help even when it's genuinely offered, treating solo determination as the only legitimate way to reach a material goal.`,
      path: `This talent asks you to keep the drive and add a hand. You are allowed to ask for help and keep the wheel. What are you steering alone right now that was never designed for one driver?`,
      positive: `The self-directed determination hasn't changed — the drive to move a material goal forward alone was always real. What's different is that you now let a hand in when it's genuinely offered, instead of refusing help by default. That combination is what actually accelerates an inherited drive past what solo effort alone could reach.`,
      negative: `The self-directed determination is completely real, and it keeps refusing help even when it's genuinely available, treating solo effort as the only legitimate way forward. That refusal isn't independence. It's an inherited drive capping its own ceiling, still waiting for a hand it's never let itself accept.`,
    },

    '8_H2': {
      heading: `A Careful, Material Fairness`,
      why: `Somewhere back along your father's material line, someone divided resources, credit, and reward with real, careful fairness — not performative generosity, but actual balance. Justice in your Paternal Material Talent means that fairness is your inheritance.`,
      shadow: `The risk is applying that fairness to everyone except yourself, dividing carefully for others while leaving your own share consistently smallest.`,
      path: `This talent asks you to include yourself in the fair division. You are allowed to be part of your own fair share. When the careful dividing is done, what portion have you been leaving off your own plate?`,
      positive: `The sense of material fairness hasn't changed — dividing resources and credit carefully was always the real inheritance. What's different is that you now include yourself in that fair division, instead of consistently taking the smallest share. That inclusion is what makes an inherited fairness actually whole.`,
      negative: `The sense of material fairness is completely real, careful and consistent for everyone else, and it keeps excluding the person applying it. That exclusion isn't humility. It's an inherited integrity that's stayed incomplete, still waiting for you to put yourself on the ledger it so carefully balances for others.`,
    },

    '9_H2': {
      heading: `Handling Life Alone, Competently`,
      why: `Somewhere in your father's material line, someone managed real material responsibility in solitude and did it capably, without needing company to get it right. The Hermit in your Paternal Material Talent means solitary material competence is your inheritance.`,
      shadow: `The risk is staying solitary in it even when company would genuinely help, treating solo capability as the only trustworthy way to handle things.`,
      path: `This talent asks you to let a task be witnessed or shared sometimes. You are allowed to be competent and accompanied. What material task could you let someone witness, or even share, this week?`,
      positive: `The solitary material competence hasn't changed — handling real responsibility alone and doing it well was always genuine. What's different is that you now let a task be witnessed or shared sometimes, instead of defaulting to solitude out of habit. That openness deepens an inherited competence instead of threatening it.`,
      negative: `The solitary material competence is completely real, capable and self-sufficient, and it keeps staying solitary even when company would genuinely help. That isolation isn't necessity anymore. It's an inherited habit still waiting for you to notice when sharing the task would actually serve you better than carrying it alone.`,
    },

    '10_H2': {
      heading: `Enduring the Financial Tides`,
      why: `Somewhere back along your father's material line, someone weathered real financial or material cycles — booms and busts — without being wrecked by either extreme. The Wheel of Fortune in your Paternal Material Talent means that endurance is your inheritance.`,
      shadow: `The risk is bracing so hard against the next downturn that you can't actually receive or enjoy the current upswing.`,
      path: `This talent asks you to let the good stretch actually land as good. You are allowed to expect good stretches, not just endure hard ones. What upswing might you be bracing against instead of receiving?`,
      positive: `The endurance through material cycles hasn't changed — weathering real booms and busts without being wrecked by either was always the inheritance. What's different is that you now let a genuine upswing actually land as good, instead of bracing through it for the next downturn. That reception is what completes an inherited resilience.`,
      negative: `The endurance through material cycles is completely real, hard-won across real booms and busts, and it keeps bracing so hard against the next downturn that the current upswing never fully registers as good. That vigilance isn't resilience anymore. It's an inherited endurance still waiting to actually receive a good stretch instead of just surviving the hard ones.`,
    },

    '11_H2': {
      heading: `Unbroken Under Strain`,
      why: `Somewhere in your father's material line, someone stayed gentle through real material hardship — softness that endured rather than hardened. Strength in your Paternal Material Talent means that gentleness-under-pressure is your inheritance.`,
      shadow: `The risk is mistaking the gentleness for weakness under your own current strain, hardening reflexively instead of trusting the softness to hold.`,
      path: `This talent asks you to trust that the softness already proved itself. You are allowed to stay soft — the strain already proved it doesn't break you. Where is your gentleness quietly outlasting circumstances that were supposed to harden you?`,
      positive: `The gentleness under material pressure hasn't changed — staying soft through real hardship rather than hardening was always the genuine inheritance. What's different is that you now trust it to hold under your own current strain, instead of reflexively hardening. That trust is proof the softness was never actually fragile.`,
      negative: `The gentleness under material pressure is completely real, tested and proven across real hardship, and it keeps getting mistaken for weakness the moment strain arrives, hardened reflexively instead of trusted. That reflex isn't protection. It's an inherited softness that already proved it doesn't break, still waiting for you to trust it under your own pressure.`,
    },

    '12_H2': {
      heading: `Patience for Slow Circumstances`,
      why: `Somewhere back along your father's material line, someone waited out a slow material circumstance without forcing it, and it eventually resolved on its own timing. The Hanged Man in your Paternal Material Talent means that patience is your inheritance.`,
      shadow: `The risk is applying that patience to situations that actually need a push, mistaking every slow circumstance for one that just needs more waiting.`,
      path: `This talent asks you to nudge, sometimes, instead of only waiting. You are allowed to nudge the slow circumstances instead of only waiting them out. What patient situation of yours might respond to one small push?`,
      positive: `The patience for slow material circumstances hasn't changed — waiting out a situation without forcing it was always the real inheritance. What's different is that you now tell a circumstance that needs time apart from one that actually needs a nudge, instead of applying patience indiscriminately. That discernment is what makes it productive.`,
      negative: `The patience for slow material circumstances is completely real, and it keeps getting applied to every slow situation the same way, unable to distinguish genuine waiting from simple stalling. That confusion isn't wisdom. It's an inherited patience still waiting for you to notice which situations were actually asking for a small push instead.`,
    },

    '13_H2': {
      heading: `A Talent for Starting Over`,
      why: `Somewhere in your father's material line, someone lost real material ground and rebuilt from close to nothing, more than once if needed. Transformation in your Paternal Material Talent means that rebuilding capacity is your inheritance.`,
      shadow: `The risk is waiting for an actual collapse to use the gift, letting things get much worse than necessary before finally rebuilding.`,
      path: `This talent asks you to rebuild before ruin forces it. You are allowed to rebuild without waiting for the ruin. What could you renovate now, while things still stand?`,
      positive: `The rebuilding capacity hasn't changed — the ability to reconstruct from almost nothing was always real, proven more than once. What's different is that you now use it proactively, before ruin forces it, instead of waiting for collapse to justify rebuilding. That timing is what makes an inherited resilience protective rather than reactive.`,
      negative: `The rebuilding capacity is completely real, tested and proven across real loss, and it keeps waiting for an actual collapse before it activates, letting damage go further than it needed to. That waiting isn't patience. It's an inherited resilience still expecting an emergency it doesn't actually require to do its work.`,
    },

    '14_H2': {
      heading: `Making Limited Resources Stretch`,
      why: `Somewhere back along your father's material line, someone made scarce resources genuinely go further — not through deprivation, but through real practical skill. Temperance in your Paternal Material Talent means that stretching ability is your inheritance.`,
      shadow: `The risk is stretching resources even when stretching is no longer necessary, staying in scarcity-mode long after actual scarcity has passed.`,
      path: `This talent asks you to let margin be margin sometimes. You are allowed to have enough that nothing needs stretching. What would you do with real, unstretched margin?`,
      positive: `The skill for stretching resources hasn't changed — making scarce means genuinely go further was always real, practical ability. What's different is that you now let margin be margin when it's actually available, instead of stretching out of old habit. That flexibility is the inherited skill working at its fullest range.`,
      negative: `The skill for stretching resources is completely real, and it keeps running long after actual scarcity has passed, staying in scarcity-mode out of habit rather than necessity. That habit isn't prudence. It's an inherited talent manufacturing a scarcity that isn't actually there anymore, still waiting for you to notice the margin is real.`,
    },

    '15_H2': {
      heading: `A Complicated Relation to Power`,
      why: `Somewhere in your father's material line, someone wrestled honestly with material power — who should hold it, how it should be used — rather than pretending the question was simple. The Devil in your Paternal Material Talent means that honest wrestling is your inheritance.`,
      shadow: `The risk is inheriting the discomfort around power without inheriting the honest examination that once accompanied it, avoiding material authority altogether instead of examining it.`,
      path: `This talent asks you to hold power and examine it, rather than avoiding it. You are allowed to hold material power without fearing your own hands. What motive, named honestly, would make your next use of influence feel clean?`,
      positive: `The wrestling with material power hasn't changed — the honest questioning of who should hold it and how was always the real inheritance. What's different is that you now hold power and examine your own motives directly, instead of avoiding authority to sidestep the discomfort. That honesty is what lets it be used cleanly.`,
      negative: `The discomfort around material power is completely real, inherited alongside the honest examination that once accompanied it — except the examination got left behind, and only the avoidance came through. That avoidance isn't humility. It's an inherited authority left unclaimed, still waiting for the honest reckoning that was supposed to come with it.`,
    },

    '16_H2': {
      heading: `Rebuilt, Never Discussed`,
      why: `Somewhere back along your father's material line, a real financial or material collapse happened and was survived — but never fully talked through afterward. The Tower in your Paternal Material Talent means resilience through material collapse is your inheritance, alongside an unfinished conversation.`,
      shadow: `The risk is repeating a version of the same collapse because the original one was never actually processed, only survived.`,
      path: `This talent asks you to speak about the collapse that was never talked through. You are allowed to talk about the collapse that was never talked through. What might your money worries lose their grip on once the old story is finally told?`,
      positive: `The resilience through material collapse hasn't changed — surviving real financial loss was always the genuine inheritance. What's different is that you've actually spoken about the collapse that was only ever survived, not discussed. That processing is what finally lets the old pattern stop quietly repeating itself.`,
      negative: `The resilience through material collapse is completely real, survived once and carried forward, and it keeps staying unprocessed, felt but never actually talked through. That silence isn't strength. It's an inherited collapse still gripping through the story that was never finished, still waiting for someone to finally tell it.`,
    },

    '17_H2': {
      heading: `A Modest, Persistent Hope`,
      why: `Somewhere in your father's material line, someone held onto real hope for better material circumstances, sized modestly enough to feel safe. The Star in your Paternal Material Talent means that hope is your inheritance.`,
      shadow: `The risk is keeping the hope permanently modest even once circumstances could support something larger, out of an old habit of not expecting too much.`,
      path: `This talent asks you to let the hope grow to match what's actually possible now. You are allowed to hope for more than the line permitted itself. What material dream have you been pre-shrinking before it can even be spoken?`,
      positive: `The material hope hasn't changed — the genuine belief that things could get better was always real. What's different is that you now let it grow to match what's actually possible now, instead of keeping it sized for old, harder circumstances. That growth honors an inherited hope by finally giving it enough room.`,
      negative: `The material hope is completely real, genuinely held even through hard circumstances, and it keeps staying permanently modest regardless of what's actually possible now. That smallness isn't realism. It's an inherited hope shrunk to fit an old habit of not expecting too much, still waiting to be let grow.`,
    },

    '18_H2': {
      heading: `Worry Felt More Than Explained`,
      why: `Somewhere back along your father's material line, someone carried a real financial fear that was never given words, only felt and passed along as atmosphere. The Moon in your Paternal Material Talent means that unnamed worry is your inheritance, waiting to finally be named.`,
      shadow: `The risk is letting the felt worry run your decisions without ever checking it against your own actual, current circumstances.`,
      path: `This talent asks you to translate the felt worry into words and test it. You are allowed to name the fear so it stops steering. If the unnamed financial dread had a sentence — what would it say, and is it still true for you?`,
      positive: `The financial worry hasn't changed — the real fear passed down as atmosphere, never quite given words, was always there. What's different is that you've translated it into something plain and checked it against your actual current circumstances. That clarity is what finally lets it stop steering decisions from the shadows.`,
      negative: `The financial worry is completely real, inherited as feeling rather than explanation, and it keeps running decisions invisibly because it's never been translated into words. That silence isn't peace with money. It's an inherited fear still steering from the background, waiting for someone to finally name what it's actually about.`,
    },

    '19_H2': {
      heading: `Warmth That Held Through Hardship`,
      why: `Somewhere in your father's material line, someone stayed genuinely warm — generous, present, unguarded — even during real material hardship. The Sun in your Paternal Material Talent means that intact warmth is your inheritance.`,
      shadow: `The risk is assuming the warmth should be reserved until things are materially easier, holding back generosity as if it were conditional on comfort.`,
      path: `This talent asks you to let the warmth show now, regardless of current material conditions. You are allowed to trust that your warmth survives hardship — it already has, for generations. Who needs that intact warmth from you right now?`,
      positive: `The warmth hasn't changed — staying genuinely generous and present even through real material hardship was always the inheritance. What's different is that you now let it show regardless of current circumstance, instead of holding it back until things feel easier. That release proves the gift was never actually conditional on comfort.`,
      negative: `The warmth is completely real, intact through generations of real hardship, and it keeps getting reserved for whenever things feel materially easier, as though generosity required comfort first. That bargain isn't necessary. It's an inherited warmth still waiting to be shown now, exactly as it survived before.`,
    },

    '20_H2': {
      heading: `Potential Never Fully Claimed`,
      why: `Somewhere back along your father's material line, someone sensed a bigger material possibility than circumstances ever let them pursue. Judgement in your Paternal Material Talent means that unclaimed potential is now yours to actually take up.`,
      shadow: `The risk is sensing the same larger possibility in your own life and, out of old habit, still finding reasons to wait for better conditions.`,
      path: `This talent asks you to answer the material calling with what you actually have available now. You are allowed to claim the potential they never got to. What material ambition would honor your line precisely by exceeding it?`,
      positive: `The sensed material potential hasn't changed — the bigger possibility was always genuinely there. What's different is that you've claimed it with what you actually have available now, instead of waiting for the better conditions your line never got either. That claiming is what finally lives out what was only sensed before.`,
      negative: `The sensed material potential is completely real, felt clearly across generations, and it keeps waiting for conditions to improve before it's claimed. That waiting isn't prudence. It's an old deferral repeating itself, an inherited possibility still unclaimed exactly the way it stayed unclaimed the last time.`,
    },

    '21_H2': {
      heading: `A Completion the Line Awaited`,
      why: `Somewhere in your father's material line, a material goal came close to being reached and was never quite allowed to be called finished. The World in your Paternal Material Talent means genuine material completion is your inheritance, waiting to actually be claimed.`,
      shadow: `The risk is repeating the same near-completion, reaching real material success and still finding a reason it doesn't count as done.`,
      path: `This talent asks you to let a material goal actually be finished. You are allowed to be the one who finishes. What almost-done thing in your material life is asking you to break the family pattern and complete it?`,
      positive: `The capacity for real material achievement hasn't changed — you've come close to genuine completion, the same way your line once did. What's different is that you now let it actually be called finished, instead of finding a reason it doesn't quite count as done. That naming is what finally lets the arrival land.`,
      negative: `The capacity for real material achievement is completely real, reaching genuine success and still finding a reason it doesn't count as finished. That habit isn't humility. It's an old near-completion repeating itself, an inherited capacity for arrival still waiting for someone to call a real success exactly that.`,
    },

    '22_H2': {
      heading: `Risk, Passed Down Wisely`,
      why: `Somewhere back along your father's material line, someone took a real, well-placed material risk when it mattered, rather than playing every situation safe. The Fool in your Paternal Material Talent means that calculated boldness is your inheritance.`,
      shadow: `The risk is inheriting caution instead of the boldness, letting an old fear of loss override a genuinely good opportunity in front of you now.`,
      path: `This talent asks you to size the risk with your own eyes, not old caution. You are allowed to take the practical risk when it matters — it's a family skill. What is the mattering moment in front of you right now?`,
      positive: `The capacity for well-placed material risk hasn't changed — taking a calculated leap when it mattered was always the real inheritance. What's different is that you now size the risk with your own eyes, instead of defaulting to inherited caution. That judgment is what lets the family skill for boldness actually get used.`,
      negative: `The capacity for calculated material risk is completely real, a genuine family skill, and it keeps losing to an inherited caution that overrides good opportunities before they're even considered. That caution isn't wisdom. It's an old fear standing in for the actual boldness, still waiting for you to size the next risk yourself.`,
    },


    // ── Lineage Square Talents: Maternal Material Talent (I2) ───────────────

    '1_I2': {
      heading: `Very Little, Made Enough`,
      why: `Somewhere in your mother's material line, someone could start a venture, a household economy, an income from bare circumstances — real, practical originating ability. The Magician in your Maternal Material Talent means launching from scratch is your inheritance.`,
      shadow: `The risk is starting many things and finishing few, spending the inherited spark on the exciting opening and losing interest once the harder building begins.`,
      path: `This talent asks you to carry one material venture past its beginning. You are allowed to make from abundance too, not only from scraps. What could your resourcefulness build if it finally had full materials?`,
      positive: `The gift for material initiation hasn't changed — you can still start a venture from bare circumstances faster than most people manage. What's different is that you now carry one past its exciting opening, into the harder, less glamorous building. That persistence is what turns the inherited spark into something that actually lasts.`,
      negative: `The gift for material initiation is completely real, and it keeps getting spent entirely on beginnings — venture after venture launched, then quietly abandoned once the harder building starts. That pattern isn't a lack of ability. It's an inherited spark still waiting for the one start you'll actually carry through to a finish.`,
    },

    '2_I2': {
      heading: `Ahead of the Numbers`,
      why: `Somewhere back along your mother's material line, someone read a financial or practical situation correctly before the facts could confirm it. The High Priestess in your Maternal Material Talent means that instinct is your inheritance.`,
      shadow: `The risk is trusting the instinct so privately it never gets acted on, letting a correct read go unused because it can't yet be justified on paper.`,
      path: `This talent asks you to act on the instinct and let the numbers catch up. You are allowed to trust the practical instinct and let the numbers catch up. Where has that inherited gut-sense already saved you recently?`,
      positive: `The practical instinct hasn't changed — it still outruns the spreadsheet, and it's usually right. What's different is that you now act on it before it's fully provable, instead of confirming it privately after the fact. That willingness to move on the read is what makes an inherited instinct actually useful, not just accurate in hindsight.`,
      negative: `The practical instinct is completely real, and it keeps being trusted only privately, confirmed quietly after the fact rather than acted on when it mattered. That habit isn't caution. It's an inherited gut-sense still waiting for the one time you'll let it change a decision instead of just narrate one afterward.`,
    },

    '3_I2': {
      heading: `Feeding and Holding Everyone`,
      why: `Somewhere in your mother's material line, someone made certain the people around them were fed, housed, and materially cared for, as instinct rather than effort. The Empress in your Maternal Material Talent means that provision is your inheritance.`,
      shadow: `The risk is providing for everyone except yourself, extending the care outward so consistently that your own material comfort quietly goes unattended.`,
      path: `This talent asks you to include yourself in the providing. You are allowed to be fed and held too, not just to make sure of it for others. Who checks whether you've eaten, rested, been carried lately?`,
      positive: `The instinct to provide hasn't changed — making sure people are fed and cared for was always genuine, not effort. What's different is that you now let yourself be provided for too, instead of extending the generosity only outward. That reciprocity is what keeps an inherited gift sustainable rather than depleting.`,
      negative: `The instinct to provide is completely real, and it keeps running exclusively outward, extended to everyone except the person extending it. That imbalance isn't generosity working as intended. It's an inherited provision that's excluded its own source, still waiting for you to let yourself be included in the care.`,
    },

    '4_I2': {
      heading: `Organizing, Never Asked`,
      why: `Somewhere back along your mother's material line, someone quietly organized the household economy, the logistics, the practical structure everyone else relied on without ever formally being asked to. The Emperor in your Maternal Material Talent means that organizing competence is your inheritance.`,
      shadow: `The risk is holding the job forever without ever being relieved of it, keeping the organizing entirely on your own shoulders because no one else was ever asked to share it.`,
      path: `This talent asks you to let the job be shared sometimes. You are allowed to resign from the unasked-for job sometimes. What would happen if the organizing waited for you to be actually willing?`,
      positive: `The organizing competence hasn't changed — quietly holding the household economy together was always real skill. What's different is that you now let the job be shared when it's genuinely offered, instead of holding it alone indefinitely. That sharing is what makes an inherited competence sustainable rather than solitary.`,
      negative: `The organizing competence is completely real, and it keeps being carried alone, an unasked-for job never questioned or relieved. That solitude isn't necessity. It's an inherited burden still waiting for you to notice it was never actually meant to be held by one person forever.`,
    },

    '5_I2': {
      heading: `Skills Absorbed, Not Taught`,
      why: `Somewhere in your mother's material line, someone carried real practical know-how learned by doing rather than by certificate. The Hierophant in your Maternal Material Talent means that untaught expertise is your inheritance.`,
      shadow: `The risk is undervaluing the skill precisely because it wasn't formally credentialed.`,
      path: `This talent asks you to name the skill as real expertise. You are allowed to own the skills nobody formally certified. What untaught competence of yours deserves to be named as expertise?`,
      positive: `The skill hasn't changed — the practical know-how absorbed by watching, not by certificate, was always genuine expertise. What's different is that you now name it as such, instead of treating it as merely a knack because it wasn't formally taught. That naming is what finally lets it be valued at its actual worth.`,
      negative: `The skill is completely real, learned by doing the way it always was in your mother's line, and it keeps being dismissed as ordinary simply because no one certified it. That undervaluing isn't modesty. It's genuine expertise still waiting for someone to actually call it that.`,
    },

    '6_I2': {
      heading: `Knowing What Matters When Little`,
      why: `Somewhere back along your mother's material line, someone kept clear values intact even when money or resources were genuinely scarce. The Lovers in your Maternal Material Talent means that clarity is your inheritance.`,
      shadow: `The risk is letting that clarity fade the moment resources become comfortable, forgetting under abundance the values that were so sharp under scarcity.`,
      path: `This talent asks you to keep the clarity active even when it isn't required. You are allowed to keep the clarity even when resources aren't limited. What essential thing does your inheritance help you see that abundance tends to blur?`,
      positive: `The clarity about what matters hasn't changed — it held steady under real scarcity, the way it did for your mother's line. What's different is that you now keep it active even when resources are comfortable, instead of letting it fade the moment pressure lifts. That consistency is what makes an inherited clarity durable rather than situational.`,
      negative: `The clarity about what matters is completely real, sharp and dependable under scarcity, and it keeps going dormant the moment resources become comfortable. That fading isn't relaxation. It's an inherited value that only activates under survival pressure, still waiting to stay switched on when things get easy.`,
    },

    '7_I2': {
      heading: `Steering Solo`,
      why: `Somewhere in your mother's material line, someone drove a material goal forward alone, without waiting for permission or partnership to move. The Chariot in your Maternal Material Talent means self-directed material drive is your inheritance.`,
      shadow: `The risk is refusing help even when it's genuinely offered, treating solo determination as the only legitimate way to reach a material goal.`,
      path: `This talent asks you to keep the drive and add a hand. You are allowed to ask for a hand and keep the wheel. What are you steering alone right now that was never designed for one driver?`,
      positive: `The self-directed determination hasn't changed — the drive to move a material goal forward alone was always real. What's different is that you now let a hand in when it's genuinely offered, instead of refusing help by default. That combination is what actually accelerates an inherited drive past what solo effort alone could reach.`,
      negative: `The self-directed determination is completely real, and it keeps refusing help even when it's genuinely available, treating solo effort as the only legitimate way forward. That refusal isn't independence. It's an inherited drive capping its own ceiling, still waiting for a hand it's never let itself accept.`,
    },

    '8_I2': {
      heading: `Fair Shares, Carefully Judged`,
      why: `Somewhere back along your mother's material line, someone divided resources, credit, and reward with real, careful fairness. Justice in your Maternal Material Talent means that fairness is your inheritance.`,
      shadow: `The risk is applying that fairness to everyone except yourself, dividing carefully for others while leaving your own share consistently smallest.`,
      path: `This talent asks you to include yourself in the fair division. You are allowed to include yourself in the fair share. When the careful dividing is done, what portion have you been leaving off your own plate?`,
      positive: `The sense of material fairness hasn't changed — dividing resources and credit carefully was always the real inheritance. What's different is that you now include yourself in that fair division, instead of consistently taking the smallest share. That inclusion is what makes an inherited fairness actually whole.`,
      negative: `The sense of material fairness is completely real, careful and consistent for everyone else, and it keeps excluding the person applying it. That exclusion isn't humility. It's an inherited integrity that's stayed incomplete, still waiting for you to put yourself on the ledger it so carefully balances for others.`,
    },

    '9_I2': {
      heading: `Quiet Mastery, Alone`,
      why: `Somewhere in your mother's material line, someone managed real material responsibility in solitude and did it capably. The Hermit in your Maternal Material Talent means solitary material competence is your inheritance.`,
      shadow: `The risk is staying solitary in it even when company would genuinely help.`,
      path: `This talent asks you to let a task be witnessed or shared sometimes. You are allowed to be competent and accompanied. What material task could you let someone witness, or even share, this week?`,
      positive: `The solitary material competence hasn't changed — handling real responsibility alone and doing it well was always genuine. What's different is that you now let a task be witnessed or shared sometimes, instead of defaulting to solitude out of habit. That openness deepens an inherited competence instead of threatening it.`,
      negative: `The solitary material competence is completely real, capable and self-sufficient, and it keeps staying solitary even when company would genuinely help. That isolation isn't necessity anymore. It's an inherited habit still waiting for you to notice when sharing the task would actually serve you better than carrying it alone.`,
    },

    '10_I2': {
      heading: `Riding the Financial Waves`,
      why: `Somewhere back along your mother's material line, someone weathered real financial cycles without being wrecked by either extreme. The Wheel of Fortune in your Maternal Material Talent means that endurance is your inheritance.`,
      shadow: `The risk is bracing so hard against the next downturn that you can't actually receive or enjoy the current upswing.`,
      path: `This talent asks you to let the good stretch actually land as good. You are allowed to expect good stretches, not just endure hard ones. What upswing might you be bracing against instead of receiving?`,
      positive: `The endurance through material cycles hasn't changed — weathering real financial ups and downs without being wrecked by either was always the inheritance. What's different is that you now let a genuine upswing actually land as good, instead of bracing through it for the next downturn. That reception is what completes an inherited resilience.`,
      negative: `The endurance through material cycles is completely real, hard-won across real ups and downs, and it keeps bracing so hard against the next downturn that the current upswing never fully registers as good. That vigilance isn't resilience anymore. It's an inherited endurance still waiting to actually receive a good stretch instead of just surviving the hard ones.`,
    },

    '11_I2': {
      heading: `Strain Without Breaking`,
      why: `Somewhere in your mother's material line, someone stayed gentle through real material hardship — softness that endured rather than hardened. Strength in your Maternal Material Talent means that gentleness-under-pressure is your inheritance.`,
      shadow: `The risk is mistaking the gentleness for weakness under your own current strain, hardening reflexively instead of trusting the softness to hold.`,
      path: `This talent asks you to trust that the softness already proved itself. You are allowed to stay soft — the strain already proved it doesn't break you. Where is your gentleness quietly outlasting circumstances that were supposed to harden you?`,
      positive: `The gentleness under material pressure hasn't changed — staying soft through real hardship rather than hardening was always the genuine inheritance. What's different is that you now trust it to hold under your own current strain, instead of reflexively hardening. That trust is proof the softness was never actually fragile.`,
      negative: `The gentleness under material pressure is completely real, tested and proven across real hardship, and it keeps getting mistaken for weakness the moment strain arrives, hardened reflexively instead of trusted. That reflex isn't protection. It's an inherited softness that already proved it doesn't break, still waiting for you to trust it under your own pressure.`,
    },

    '12_I2': {
      heading: `Patience for What Takes Time`,
      why: `Somewhere back along your mother's material line, someone waited out a slow material circumstance without forcing it, and it eventually resolved on its own timing. The Hanged Man in your Maternal Material Talent means that patience is your inheritance.`,
      shadow: `The risk is applying that patience to situations that actually need a push.`,
      path: `This talent asks you to nudge, sometimes, instead of only waiting. You are allowed to nudge the slow circumstances instead of only waiting them out. What patient situation of yours might respond to one small push?`,
      positive: `The patience for slow material circumstances hasn't changed — waiting out a situation without forcing it was always the real inheritance. What's different is that you now tell a circumstance that needs time apart from one that actually needs a nudge, instead of applying patience indiscriminately. That discernment is what makes it productive.`,
      negative: `The patience for slow material circumstances is completely real, and it keeps getting applied to every slow situation the same way, unable to distinguish genuine waiting from simple stalling. That confusion isn't wisdom. It's an inherited patience still waiting for you to notice which situations were actually asking for a small push instead.`,
    },

    '13_I2': {
      heading: `Rebuilding From Nearly Nothing`,
      why: `Somewhere in your mother's material line, someone lost real material ground and rebuilt from close to nothing, more than once if needed. Transformation in your Maternal Material Talent means that rebuilding capacity is your inheritance.`,
      shadow: `The risk is waiting for an actual collapse to use the gift, letting things get much worse than necessary before finally rebuilding.`,
      path: `This talent asks you to rebuild before ruin forces it. You are allowed to rebuild without waiting for the ruin. What could you renovate now, while things still stand?`,
      positive: `The rebuilding capacity hasn't changed — the ability to reconstruct from almost nothing was always real, proven more than once. What's different is that you now use it proactively, before ruin forces it, instead of waiting for collapse to justify rebuilding. That timing is what makes an inherited resilience protective rather than reactive.`,
      negative: `The rebuilding capacity is completely real, tested and proven across real loss, and it keeps waiting for an actual collapse before it activates, letting damage go further than it needed to. That waiting isn't patience. It's an inherited resilience still expecting an emergency it doesn't actually require to do its work.`,
    },

    '14_I2': {
      heading: `Stretching the Little There Is`,
      why: `Somewhere back along your mother's material line, someone made scarce resources genuinely go further through real practical skill, not deprivation. Temperance in your Maternal Material Talent means that stretching ability is your inheritance.`,
      shadow: `The risk is stretching resources even when stretching is no longer necessary, staying in scarcity-mode long after actual scarcity has passed.`,
      path: `This talent asks you to let margin be margin sometimes. You are allowed to have enough that nothing needs stretching. What would you do with real, unstretched margin?`,
      positive: `The skill for stretching resources hasn't changed — making scarce means genuinely go further was always real, practical ability. What's different is that you now let margin be margin when it's actually available, instead of stretching out of old habit. That flexibility is the inherited skill working at its fullest range.`,
      negative: `The skill for stretching resources is completely real, and it keeps running long after actual scarcity has passed, staying in scarcity-mode out of habit rather than necessity. That habit isn't prudence. It's an inherited talent manufacturing a scarcity that isn't actually there anymore, still waiting for you to notice the margin is real.`,
    },

    '15_I2': {
      heading: `A Tangled Dependence`,
      why: `Somewhere in your mother's material line, someone wrestled honestly with material dependence — needing help, receiving support — rather than pretending independence was always possible or always required. The Devil in your Maternal Material Talent means that honest wrestling is your inheritance.`,
      shadow: `The risk is inheriting the discomfort around dependence without inheriting the honest examination that once accompanied it, refusing support altogether rather than examining the discomfort.`,
      path: `This talent asks you to depend and examine it honestly, rather than avoiding it outright. You are allowed to depend and remain whole. What support could you accept this season without it costing your self-respect?`,
      positive: `The wrestling with material dependence hasn't changed — the honest reckoning with needing help, and being needed, was always the real inheritance. What's different is that you now accept support when it's genuinely useful and examine the discomfort directly, instead of refusing it to avoid the feeling. That honesty turns dependence into collaboration.`,
      negative: `The discomfort around material dependence is completely real, inherited alongside the honest examination that once accompanied it — except the examination got left behind, and only the avoidance came through. That avoidance isn't self-sufficiency. It's real help left unclaimed, still waiting for the honest reckoning that was supposed to come with it.`,
    },

    '16_I2': {
      heading: `A Loss, Quietly Survived`,
      why: `Somewhere back along your mother's material line, a real financial loss happened and was survived — but never fully talked through afterward. The Tower in your Maternal Material Talent means resilience through material loss is your inheritance, alongside an unfinished conversation.`,
      shadow: `The risk is repeating a version of the same loss because the original one was never actually processed, only survived.`,
      path: `This talent asks you to speak about the loss that was only survived. You are allowed to speak about the loss that was only survived. What might your money worries lose their grip on once the old story is finally told?`,
      positive: `The resilience through material loss hasn't changed — surviving something real was always the genuine inheritance. What's different is that you've actually spoken about the loss that was only ever survived, not discussed. That processing is what finally lets the old pattern stop quietly repeating itself.`,
      negative: `The resilience through material loss is completely real, survived once and carried forward, and it keeps staying unprocessed, felt but never actually talked through. That silence isn't strength. It's an inherited loss still gripping through the story that was never finished, still waiting for someone to finally tell it.`,
    },

    '17_I2': {
      heading: `Hope Held Modestly`,
      why: `Somewhere in your mother's material line, someone held onto real hope for better material circumstances, sized modestly enough to feel safe. The Star in your Maternal Material Talent means that hope is your inheritance.`,
      shadow: `The risk is keeping the hope permanently modest even once circumstances could support something larger.`,
      path: `This talent asks you to let the hope grow to match what's actually possible now. You are allowed to hope at a size she couldn't afford. What better-than-modest future would you name out loud if hope were free?`,
      positive: `The material hope hasn't changed — the genuine belief that things could get better was always real. What's different is that you now let it grow to match what's actually possible now, instead of keeping it sized for old, harder circumstances. That growth honors an inherited hope by finally giving it enough room.`,
      negative: `The material hope is completely real, genuinely held even through hard circumstances, and it keeps staying permanently modest regardless of what's actually possible now. That smallness isn't realism. It's an inherited hope shrunk to fit an old habit of not expecting too much, still waiting to be let grow.`,
    },

    '18_I2': {
      heading: `Worry Beneath the Surface`,
      why: `Somewhere back along your mother's material line, someone carried a real financial fear that was never given words, only felt and passed along as atmosphere. The Moon in your Maternal Material Talent means that unnamed worry is your inheritance, waiting to finally be named.`,
      shadow: `The risk is letting the felt worry run your decisions without ever checking it against your own actual, current circumstances.`,
      path: `This talent asks you to translate the felt worry into words and test it. You are allowed to translate the felt worry into words and check it. What is the inherited unease actually about — and does your present life still match it?`,
      positive: `The financial worry hasn't changed — the real fear passed down as atmosphere, never quite given words, was always there. What's different is that you've translated it into something plain and checked it against your actual current circumstances. That clarity is what finally lets it stop steering decisions from the shadows.`,
      negative: `The financial worry is completely real, inherited as feeling rather than explanation, and it keeps running decisions invisibly because it's never been translated into words. That silence isn't peace with money. It's an inherited fear still steering from the background, waiting for someone to finally name what it's actually about.`,
    },

    '19_I2': {
      heading: `Warmth Intact Through Hardship`,
      why: `Somewhere in your mother's material line, someone stayed genuinely warm even during real material hardship. The Sun in your Maternal Material Talent means that intact warmth is your inheritance.`,
      shadow: `The risk is assuming the warmth should be reserved until things are materially easier, holding back generosity as if it were conditional on comfort.`,
      path: `This talent asks you to let the warmth show now, regardless of current material conditions. You are allowed to trust that your warmth survives hardship — it already has for generations. Who needs that intact warmth from you right now?`,
      positive: `The warmth hasn't changed — staying genuinely generous and present even through real material hardship was always the inheritance. What's different is that you now let it show regardless of current circumstance, instead of holding it back until things feel easier. That release proves the gift was never actually conditional on comfort.`,
      negative: `The warmth is completely real, intact through generations of real hardship, and it keeps getting reserved for whenever things feel materially easier, as though generosity required comfort first. That bargain isn't necessary. It's an inherited warmth still waiting to be shown now, exactly as it survived before.`,
    },

    '20_I2': {
      heading: `A Potential She Never Pursued`,
      why: `Somewhere back along your mother's material line, someone sensed a bigger material possibility than circumstances ever let them pursue. Judgement in your Maternal Material Talent means that unclaimed potential is now yours to actually take up.`,
      shadow: `The risk is sensing the same larger possibility in your own life and, out of old habit, still finding reasons to wait for better conditions.`,
      path: `This talent asks you to answer the material calling with what you actually have available now. You are allowed to pursue what her circumstances forbade. What material possibility would live twice if you lived it — once for you, once for her?`,
      positive: `The sensed material potential hasn't changed — the bigger possibility was always genuinely there. What's different is that you've claimed it with what you actually have available now, instead of waiting for the better conditions your line never got either. That claiming is what finally lives out what was only sensed before.`,
      negative: `The sensed material potential is completely real, felt clearly across generations, and it keeps waiting for conditions to improve before it's claimed. That waiting isn't prudence. It's an old deferral repeating itself, an inherited possibility still unclaimed exactly the way it stayed unclaimed the last time.`,
    },

    '21_I2': {
      heading: `Sensing Enough`,
      why: `Somewhere in your mother's material line, a material goal came close to being reached and was never quite allowed to be called finished, or enough. The World in your Maternal Material Talent means genuine material sufficiency is your inheritance, waiting to actually be claimed.`,
      shadow: `The risk is repeating the same near-completion, reaching real material stability and still finding a reason it doesn't count as enough.`,
      path: `This talent asks you to let what you have actually be counted as enough. You are allowed to feel the enoughness now, not after the next milestone. What do you already have that, honestly counted, is enough?`,
      positive: `The capacity for real material sufficiency hasn't changed — you've come close to genuine enough, the same way your line once did. What's different is that you now let it actually be counted as enough, instead of finding a reason it doesn't quite qualify. That naming is what finally lets the arrival land.`,
      negative: `The capacity for real material sufficiency is completely real, reaching genuine stability and still finding a reason it doesn't count as enough. That habit isn't humility. It's an old near-completion repeating itself, an inherited capacity for arrival still waiting for someone to call what's already there exactly enough.`,
    },

    '22_I2': {
      heading: `A Risk Worth Taking`,
      why: `Somewhere back along your mother's material line, someone took a real, well-placed material risk when it mattered, rather than playing every situation safe. The Fool in your Maternal Material Talent means that calculated boldness is your inheritance.`,
      shadow: `The risk is inheriting caution instead of the boldness, letting an old fear of loss override a genuinely good opportunity in front of you now.`,
      path: `This talent asks you to size the risk with your own eyes, not old caution. You are allowed to take the practical risk when it matters — it's a family skill. What is the mattering moment in front of you right now?`,
      positive: `The capacity for well-placed material risk hasn't changed — taking a calculated leap when it mattered was always the real inheritance. What's different is that you now size the risk with your own eyes, instead of defaulting to inherited caution. That judgment is what lets the family skill for boldness actually get used.`,
      negative: `The capacity for calculated material risk is completely real, a genuine family skill, and it keeps losing to an inherited caution that overrides good opportunities before they're even considered. That caution isn't wisdom. It's an old fear standing in for the actual boldness, still waiting for you to size the next risk yourself.`,
    },


    // ── Heart Zone: Spiritual Desire, vertical line (HZV) ──────────────────

    '1_HZV': {
      heading: `Authoring Its Own Reality`,
      why: `Underneath everything else, your heart wants to discover its own spiritual power and build a destiny that's actually authored by you — not one you're quietly living out on someone else's terms. The Magician here names a heart that wants mastery over its own becoming, guided by intuition rather than instruction.`,
      shadow: `When this desire gets blocked, you do what looks right instead of what feels true, and the gap between the two starts to feel like static — a low hum of not-quite-here-ness that no amount of external success actually quiets.`,
      path: `The way back is small: one choice this week made from your own intuitive pull rather than the expected script. You are allowed to want to author your own life. What would you create today if you trusted you were already spiritually equipped to?`,
      positive: `The desire to author your own destiny hasn't changed — it was always the real ask underneath everything else. What's different is that you now make one choice this week from your own intuitive pull, instead of the expected script. That choice is what turns life from something you're reading off someone else's page into something you're actually writing.`,
      negative: `The desire for a self-authored destiny is completely real, and it keeps getting answered with what looks right instead of what feels true. That gap isn't a small compromise. It's a quiet static running underneath everything, still waiting for one choice made from your own intuition instead of the script.`,
    },

    '2_HZV': {
      heading: `Harmony With Inner Knowing`,
      why: `Your heart's deepest wish is simple and rarely spoken: to trust its own intuition enough to actually live by it. The High Priestess here names a desire for inner wisdom to be believed, not just noticed in passing.`,
      shadow: `Blocked, this shows up as a persistent second-guessing — sensing something clearly and still waiting for outside confirmation before it counts as real.`,
      path: `The path is trusting one inner knowing today without asking anyone to confirm it first. You are allowed to believe your own intuition on its own authority. What do you already know that you're still waiting for permission to trust?`,
      positive: `The desire to trust your own inner knowing hasn't changed — it was always what your heart was actually asking for. What's different is that you now believe one knowing today without waiting for outside confirmation first. That trust is what finally lets your own wisdom stop living on probation.`,
      negative: `The desire to trust your own intuition is completely real, and it keeps waiting for outside confirmation before it's allowed to count. That waiting isn't humility. It's your own wisdom held permanently on probation, still waiting for the one time you'll believe it without a second opinion.`,
    },

    '3_HZV': {
      heading: `Beauty and Belonging`,
      why: `Your heart wants harmony with nature, with the people around it, with a creative force larger than any single achievement — a nurturing, productive life filled with love and beauty. The Empress here names desire for a rich, connected existence, not just a comfortable one.`,
      shadow: `Blocked, you can end up productive and surrounded by very little beauty at all — busy in a way that quietly starves the part of you that actually wanted connection and loveliness.`,
      path: `The path is letting one ordinary moment today be beautiful on purpose. You are allowed to want a life that's lovely, not just functional. Where has your life gotten productive at the cost of getting lovely?`,
      positive: `The desire for a beautiful, connected life hasn't changed — it was always underneath the busyness. What's different is that you now let one ordinary moment today actually be beautiful on purpose, instead of only functional. That choice is what starts letting loveliness back in.`,
      negative: `The desire for beauty and connection is completely real, and it keeps being starved by a life optimized purely for output. That starvation isn't a side effect of being productive. It's the very thing productivity was supposed to be in service of, still waiting for room to actually show up.`,
    },

    '4_HZV': {
      heading: `A Foundation Worth Trusting`,
      why: `Your heart wants a structured, solid spiritual foundation — to feel genuinely secure, managing life through conscious choice rather than reactive scrambling. The Emperor here names a desire for real, felt stability, not just the appearance of control.`,
      shadow: `Blocked, this can turn into controlling everything in sight because nothing underneath ever feels sturdy enough to relax into.`,
      path: `The path is building one small, real piece of structure rather than gripping the whole picture at once. You are allowed to want to feel secure without controlling everything. What structure, built rather than gripped, would let you actually rest?`,
      positive: `The desire for a sturdy foundation hasn't changed — real security, not just the appearance of control, was always what your heart wanted. What's different is that you now build one small, real piece of structure, instead of gripping the whole picture at once. That building is what finally lets you rest.`,
      negative: `The desire for real security is completely genuine, and it keeps getting answered with gripping instead of building, controlling everything because nothing underneath feels sturdy. That grip isn't safety. It proves, again, that nothing was ever actually secured, only held, still waiting for one real piece of foundation.`,
    },

    '5_HZV': {
      heading: `Wisdom Worth Passing On`,
      why: `Your heart wants to learn spiritual teachings, spread real wisdom, and receive guidance — fulfillment through being in harmony with tradition and shared meaning. The Hierophant here names a desire to belong to something larger and to hand something forward.`,
      shadow: `Blocked, this can turn into collecting teachings without ever letting any of them actually change you, wisdom accumulated like credentials rather than lived.`,
      path: `The path is choosing one teaching you've already collected and actually living by it this week. You are allowed to want guidance and belonging both. Which piece of wisdom have you learned but not yet lived?`,
      positive: `The desire for wisdom worth passing on hasn't changed — belonging to something larger and handing something forward was always the real want. What's different is that you now actually live one piece of wisdom you've already collected, instead of only gathering more. That embodiment is what turns learning into belonging.`,
      negative: `The desire for real wisdom and belonging is completely genuine, and it keeps being met with more collecting instead of more living, teachings accumulated like credentials rather than embodied. That accumulation isn't wisdom. It's a desire for belonging still waiting for one piece of learning to actually be lived.`,
    },

    '6_HZV': {
      heading: `Love in Its Highest Form`,
      why: `Your heart wants to find real, deep spiritual connection — a soulmate bond, love felt at its fullest rather than its most convenient. The Lovers here names a desire for genuine, chosen intimacy, not merely companionship.`,
      shadow: `Blocked, this can turn into settling for adequate connection while quietly starving for the deep kind, afraid that wanting more makes you ungrateful for what you have.`,
      path: `The path is naming, honestly, what depth of connection you actually want. You are allowed to want real spiritual intimacy, not just company. What would you ask for in love if wanting more didn't feel greedy?`,
      positive: `The desire for love at its highest form hasn't changed — real, chosen intimacy was always what your heart was asking for, not just company. What's different is that you now name, honestly, the depth of connection you actually want. That honesty is what finally makes real intimacy possible.`,
      negative: `The desire for deep, genuine connection is completely real, and it keeps settling for adequate instead, out of a guilt that wanting more makes you ungrateful. That settling isn't gratitude. It's a heart quietly starved for the depth it was actually built to want, still waiting to be named honestly.`,
    },

    '7_HZV': {
      heading: `Knowing Nothing Can Stop It`,
      why: `Your heart wants to discover its own inner strength and will — real spiritual progress, a path it's charting itself, and the felt certainty that no obstacle is actually final. The Chariot here names a desire for unstoppable, self-directed momentum.`,
      shadow: `Blocked, this can turn into constant motion that never actually proves the point, since proving requires stopping long enough to notice you've already arrived somewhere.`,
      path: `The path is letting one recent obstacle count as evidence you're already unstoppable. You are allowed to want proof of your own resilience. What difficulty have you already moved through that deserves to count as proof?`,
      positive: `The desire to know nothing can stop it hasn't changed — the want for unstoppable, self-directed momentum was always real. What's different is that you now let one recent obstacle actually count as evidence, instead of chasing more proof through constant motion. That registering is what finally lets the certainty land.`,
      negative: `The desire for proof of your own resilience is completely genuine, and it keeps chasing more motion instead of noticing what's already been overcome. That chase isn't ambition. It's a certainty already earned, still waiting for you to pause long enough to actually let it register.`,
    },

    '8_HZV': {
      heading: `A Life Guided by Fairness`,
      why: `Your heart wants harmony with truth and justice — to understand karma, and to guide its own life by real, felt fairness rather than convenient rules. Justice here names a desire for integrity as a way of living, not just a standard applied to others.`,
      shadow: `Blocked, this can turn into a private tally of everyone else's unfairness while your own conduct goes quietly unexamined.`,
      path: `The path is applying today's fairness standard to yourself first. You are allowed to want a genuinely fair life, starting with your own conduct. Where would your own verdict change if you judged yourself as carefully as you judge fairness in the world?`,
      positive: `The desire for a life guided by fairness hasn't changed — integrity as a way of living, not just a standard for others, was always the real want. What's different is that you now apply today's fairness standard to yourself first. That evenness is exactly what your heart was actually asking for.`,
      negative: `The desire for genuine fairness is completely real, and it keeps tracking everyone else's conduct while the self stays quietly exempt. That exemption isn't oversight. It's the heart's real desire for integrity still unmet, still waiting for the standard to finally include its own author.`,
    },

    '9_HZV': {
      heading: `Going Inward to Find Itself`,
      why: `Your heart wants a real inner journey — solitude deep enough to reach genuine spiritual understanding, not just a break from noise. The Hermit here names a desire for depth reached alone, on purpose.`,
      shadow: `Blocked, this can turn into staying busy specifically to avoid the solitude that would actually deliver what you're craving.`,
      path: `The path is one real hour of solitude, chosen rather than accidental. You are allowed to want to be alone with yourself on purpose. What would you find if you actually let yourself sit still long enough to look?`,
      positive: `The desire to go inward hasn't changed — real solitude, chosen on purpose, was always what your heart wanted. What's different is that you now take one real hour of it, instead of staying busy to avoid what it might deliver. That hour is what finally lets the depth you were craving actually arrive.`,
      negative: `The desire for real solitude is completely genuine, and it keeps getting avoided through busyness, specifically because sitting still might deliver exactly what it's asking for. That avoidance isn't productivity. It's the heart's real desire for depth, still deferred, still waiting for one chosen hour alone.`,
    },

    '10_HZV': {
      heading: `Trusting Its Own Cycles`,
      why: `Your heart wants harmony with universal timing — to accept change as it arrives and stay in the flow rather than fighting every shift. The Wheel of Fortune here names a desire for trust in cycles, not certainty about outcomes.`,
      shadow: `Blocked, this can turn into treating every downturn as a verdict, white-knuckling each low point instead of trusting it will actually turn.`,
      path: `The path is meeting today's specific change with curiosity instead of resistance. You are allowed to want to trust the timing instead of controlling it. What current shift might go easier if you actually trusted its timing?`,
      positive: `The desire to trust the turning hasn't changed — harmony with timing, not certainty about outcomes, was always the real want. What's different is that you now meet today's specific change with curiosity instead of resistance. That trust is what finally lets the flow your heart wanted become available.`,
      negative: `The desire to trust life's timing is completely real, and it keeps fighting every shift as though it were a verdict rather than simply a turn. That fighting isn't vigilance. It's the heart's own desire for trust, still unmet, still waiting for one change to be met with curiosity instead of resistance.`,
    },

    '11_HZV': {
      heading: `Transforming Fear Into Love`,
      why: `Your heart wants to discover its inner power, face its fears directly, and let real transformation happen through love rather than force. Strength here names a desire for patient, gentle courage, not aggressive conquest.`,
      shadow: `Blocked, this can turn into gripping harder at exactly the moments gentleness was actually being asked for.`,
      path: `The path is meeting one current fear with softness instead of force. You are allowed to want to be gentle with your own fear. What would change if you met your fear the way you'd meet someone you loved who was afraid?`,
      positive: `The desire to transform fear through love hasn't changed — patient, gentle courage, not aggressive conquest, was always what your heart was asking for. What's different is that you now meet one current fear with softness instead of force. That gentleness is what actually does the transforming.`,
      negative: `The desire for gentle courage is completely real, and it keeps meeting fear with a tighter grip instead of the softness it was actually asking for. That grip isn't strength. It's the heart's real desire for patient love, still unmet, still waiting to meet its fear the way it would meet someone afraid that it loved.`,
    },

    '12_HZV': {
      heading: `Surrender, Seeing Differently`,
      why: `Your heart wants to trust the flow completely and view its own life from a genuinely different angle — surrender, not as defeat, but as a change of vantage point. The Hanged Man here names a desire for perspective gained through letting go.`,
      shadow: `Blocked, this can turn into gripping the old vantage point precisely because surrendering it feels like losing control entirely.`,
      path: `The path is letting one current situation be seen from an angle you haven't tried yet. You are allowed to want a new perspective more than you want to be right. What might this situation look like from underneath instead of straight on?`,
      positive: `The desire to surrender and see differently hasn't changed — a genuinely new vantage point, not defeat, was always the real want. What's different is that you now let one current situation be seen from an angle you haven't tried yet. That letting-go is what finally delivers the new view.`,
      negative: `The desire for a new perspective is completely real, and it keeps gripping the familiar angle instead, because surrendering it feels like losing control entirely. That grip isn't clarity. It's the heart's real desire for a different view, still out of reach, still waiting for one release.`,
    },

    '13_HZV': {
      heading: `Leaving the Old Self Behind`,
      why: `Your heart wants to release old identities, attachments, and emotional weight, and be genuinely reborn — spiritual transformation as an active, wanted thing, not a crisis to survive. Transformation here names a desire for real, willing endings.`,
      shadow: `Blocked, this can turn into holding an identity long past its natural life simply because letting it go feels like losing yourself entirely.`,
      path: `The path is naming one identity that's actually ready to end. You are allowed to want to become someone new. What version of yourself is your heart already finished being?`,
      positive: `The desire to leave the old self behind hasn't changed — real, willing endings, not a crisis to survive, were always the want. What's different is that you now name one identity that's actually ready to end. That naming is what finally gives the rebirth your heart wanted room to begin.`,
      negative: `The desire for genuine rebirth is completely real, and it keeps waiting behind an identity held past its natural life, out of fear that releasing it means losing yourself entirely. That fear isn't self-preservation. It's the heart's real desire for renewal, still waiting on a permission it never actually needed.`,
    },

    '14_HZV': {
      heading: `Harmony, All at Once`,
      why: `Your heart wants inner peace and spiritual balance — a life where the different parts of you are actually working together rather than taking turns. Temperance here names a desire for integration, not just truce between opposites.`,
      shadow: `Blocked, this can turn into oscillating hard between extremes and calling the alternation 'balance,' when balance was actually being asked for the whole time.`,
      path: `The path is finding one small blend today instead of choosing one extreme. You are allowed to want genuine harmony, not just alternating extremes. What two parts of your life are ready to actually work together instead of taking turns?`,
      positive: `The desire for harmony hasn't changed — genuine integration, not just a truce between opposites, was always what your heart wanted. What's different is that you now find one small blend today, instead of choosing one extreme. That blend is exactly the harmony your heart was asking for.`,
      negative: `The desire for real integration is completely genuine, and it keeps getting answered with a hard swing between extremes mistaken for balance. That oscillation isn't harmony. It's the heart's actual desire for integration, still unmet, still waiting for two parts of your life to finally work together.`,
    },

    '15_HZV': {
      heading: `Facing Its Own Darkness`,
      why: `Your heart wants to explore its desires, its shadow, even its compulsions — to face its own darkness honestly rather than pretend it isn't there. The Devil here names a desire for real self-confrontation, not denial dressed as virtue.`,
      shadow: `Blocked, this can turn into performing a cleaner version of yourself while the actual desire or compulsion runs quietly, unexamined, underneath.`,
      path: `The path is naming one real desire or compulsion honestly, without judgment. You are allowed to want to know your own shadow. What part of yourself have you been performing past instead of actually looking at?`,
      positive: `The desire to look directly at your own darkness hasn't changed — real self-confrontation, not denial dressed as virtue, was always the want. What's different is that you now name one real desire or compulsion honestly, without judgment. That naming is exactly the self-knowledge your heart was asking for.`,
      negative: `The desire for honest self-confrontation is completely real, and it keeps getting answered with a cleaner performance instead, while the actual desire runs quietly underneath. That performance isn't peace. It's the heart's wish for real self-knowledge, still unmet, still waiting for one honest look.`,
    },

    '16_HZV': {
      heading: `A Complete Rebirth`,
      why: `Your heart wants significant transformation — freedom from old patterns and an actual spiritual rebirth, not a minor adjustment. The Tower here names a desire for real, structural change, even if it's disruptive.`,
      shadow: `Blocked, this can turn into making small, cosmetic changes that leave the old pattern's foundation completely intact.`,
      path: `The path is letting one old pattern actually fall rather than patching it again. You are allowed to want real change, not just the appearance of it. What pattern is your heart ready to let collapse for good?`,
      positive: `The desire for a complete spiritual rebirth hasn't changed — real, structural change, even disruptive change, was always what your heart wanted. What's different is that you now let one old pattern actually fall, instead of patching it again. That fall is what finally gives the rebirth room to happen.`,
      negative: `The desire for genuine rebirth is completely real, and it keeps getting answered with cosmetic changes that leave the old foundation fully intact. That patching isn't progress. It's the heart's real desire for structural change, still postponed, still waiting for one pattern to actually be let go.`,
    },

    '17_HZV': {
      heading: `An Inspiring Life`,
      why: `Your heart wants divine guidance and to remain filled with hope — to shine spiritually and actually live in a way that inspires the people around it. The Star here names a desire for visible, generous hope, not private optimism kept to yourself.`,
      shadow: `Blocked, this can turn into hoping quietly and privately, as if letting hope be seen would somehow be presumptuous or naive.`,
      path: `The path is letting one piece of your hope be visible today. You are allowed to want to inspire, not just privately hope. What hope of yours would actually help someone if you let them see it?`,
      positive: `The desire to live an inspiring life hasn't changed — visible, generous hope, not private optimism, was always the real want. What's different is that you now let one piece of your hope be visible today. That visibility is exactly the inspiring life your heart was asking for.`,
      negative: `The desire for an inspiring, hope-filled life is completely real, and it keeps staying private, as though letting hope be seen would somehow be presumptuous. That privacy isn't modesty. It's the heart's generous desire, still unmet, still waiting for one piece of hope to actually be shown.`,
    },

    '18_HZV': {
      heading: `Unraveling Its Mysteries`,
      why: `Your heart wants to explore the subconscious, strengthen its intuition, and actually understand its own spiritual mysteries rather than leave them unexamined. The Moon here names a desire for depth pursued deliberately, not just felt vaguely.`,
      shadow: `Blocked, this can turn into staying at the surface of a feeling because going deeper feels like it might reveal something you're not ready to see.`,
      path: `The path is following one recurring feeling all the way to its actual source. You are allowed to want to understand your own depths, not just feel them. What feeling keeps recurring that you haven't yet followed to where it actually comes from?`,
      positive: `The desire to unravel its own mysteries hasn't changed — depth pursued deliberately, not just felt vaguely, was always what your heart wanted. What's different is that you now follow one recurring feeling all the way to its actual source. That pursuit is exactly the self-understanding it was asking for.`,
      negative: `The desire for real self-understanding is completely genuine, and it keeps staying at the surface of a feeling, out of fear of what might be underneath. That surface-staying isn't safety. It's the heart's desire for depth, still unmet, still waiting for one feeling to actually be followed all the way down.`,
    },

    '19_HZV': {
      heading: `Pure, Unhidden Joy`,
      why: `Your heart wants real happiness and spiritual enlightenment — a life full of love where it gets to express itself completely, without editing. The Sun here names a desire for joy that's whole, not managed or rationed.`,
      shadow: `Blocked, this can turn into performing lightness while the real joy stays muted, as if full expression would be somehow too much for the room.`,
      path: `The path is letting one piece of real joy show today, unmanaged. You are allowed to want joy at full volume. What happiness have you been quietly editing down to something more acceptable?`,
      positive: `The desire for pure, unhidden joy hasn't changed — whole, unmanaged happiness was always what your heart wanted. What's different is that you now let one piece of real joy show today, unedited. That full expression is exactly what it was asking for.`,
      negative: `The desire for unhidden joy is completely real, and it keeps getting managed down to something more acceptable, as though full expression would be too much for the room. That editing isn't tact. It's the heart's real desire for whole happiness, still unmet, still waiting for one joy to show at its actual size.`,
    },

    '20_HZV': {
      heading: `Breaking Free for Good`,
      why: `Your heart wants to release the burdens of the past and reach a genuinely new level of consciousness — real spiritual awakening, not a partial, managed improvement. Judgement here names a desire for full release, not incremental relief.`,
      shadow: `Blocked, this can turn into carrying the same old weight while telling yourself you've already mostly dealt with it.`,
      path: `The path is naming one piece of the past that's actually still being carried. You are allowed to want full release, not partial relief. What burden are you still carrying that you've told yourself is already handled?`,
      positive: `The desire to break free from the past hasn't changed — full release, not incremental relief, was always what your heart wanted. What's different is that you now name one piece of the past that's actually still being carried. That naming is what finally gives the full awakening room to arrive.`,
      negative: `The desire for real release is completely genuine, and it keeps being told it's already handled while the weight is still quietly being carried. That belief isn't peace. It's the heart's desire for full awakening, still just out of reach, still waiting for one honest look at what's still there.`,
    },

    '21_HZV': {
      heading: `Feeling Genuinely Complete`,
      why: `Your heart wants integration, spiritual fulfillment, and the actual feeling of completion — merging with something larger, not just checking off another achievement. The World here names a desire for wholeness, felt, not just accomplished.`,
      shadow: `Blocked, this can turn into reaching real milestones and still feeling like something essential hasn't quite landed.`,
      path: `The path is letting one genuine accomplishment actually be felt as complete, today. You are allowed to want to feel done, not just be done. What milestone have you reached that you haven't yet let yourself feel complete?`,
      positive: `The desire to feel genuinely complete hasn't changed — felt wholeness, not just another achievement checked off, was always the real want. What's different is that you now let one genuine accomplishment actually be felt as complete today. That felt landing is exactly what your heart was asking for.`,
      negative: `The desire for genuine wholeness is completely real, and it keeps reaching real milestones without ever letting the completion actually be felt. That gap isn't ingratitude. It's the heart's desire for felt fulfillment, still unmet, still waiting for one accomplishment to actually land as done.`,
    },

    '22_HZV': {
      heading: `A Fearless Leap`,
      why: `Your heart wants to be completely free — to leap without a net, trust the flow, stay open to new experience, and keep its inner child's sense of wonder alive. The Fool here names a desire for genuine, faithful openness, not caution disguised as wisdom.`,
      shadow: `Blocked, this can turn into calling caution wisdom, closing off the very openness your heart was actually asking to keep alive.`,
      path: `The path is one small, real leap today, taken with open eyes. You are allowed to want freedom more than certainty. What would you leap toward this month if trust in the unknown were enough of a reason?`,
      positive: `The desire to take a fearless leap hasn't changed — genuine, faithful openness, not caution dressed as wisdom, was always what your heart wanted. What's different is that you now take one small, real leap today, with open eyes. That leap is what finally turns the longing into something lived.`,
      negative: `The desire for open, faithful freedom is completely real, and it keeps getting answered with caution called wisdom instead. That caution isn't prudence. It's the heart's real desire for a fearless leap, still deferred, still waiting for one small jump taken with open eyes.`,
    },


    // ── Heart Zone: Material Desire, horizontal line (HZH) ─────────────────

    '1_HZH': {
      heading: `A Solid Place in the World`,
      why: `Underneath the day-to-day, your heart wants tangible achievement — a real place in the world built through your own talent, wealth and status that are actually earned, not borrowed. The Magician here names a material desire for visible, self-made ground.`,
      shadow: `Blocked, this can turn into generating idea after idea while none of them ever becomes the actual solid place you were building toward.`,
      path: `The path is carrying one material venture past its beginning, all the way to something you can stand on. You are allowed to want a solid, self-made place in the world. What would 'solid ground' actually look like for you if you built it start to finish?`,
      positive: `The desire for a solid, self-made place in the world hasn't changed — visible, earned ground was always what your heart wanted. What's different is that you now carry one material venture past its beginning, all the way to something you can actually stand on. That completion is exactly the solid ground it was asking for.`,
      negative: `The desire for real, self-made ground is completely genuine, and it keeps generating idea after idea that never quite becomes the finished place to stand. That pattern isn't a lack of talent. It's the heart's material desire still under construction, still waiting for one venture to actually be carried through.`,
    },

    '2_HZH': {
      heading: `A Presence People Remember`,
      why: `Your heart wants to leave a real impression — a mysterious, intriguing presence in the physical world, knowledge held and shared carefully, real impact made even from behind the scenes. The High Priestess here names a material desire for quiet but unmistakable influence.`,
      shadow: `Blocked, this can turn into staying so guarded that the impression never actually lands, influence withheld until it stops being influence at all.`,
      path: `The path is sharing one piece of what you know with someone who's actually earned it. You are allowed to want to be remembered, not just mysterious. What impression are you capable of leaving that you've been withholding out of habit?`,
      positive: `The desire for a presence people remember hasn't changed — real, unmistakable influence was always what your heart wanted. What's different is that you now share one piece of what you know with someone who's actually earned it. That sharing is what finally lets the impression land.`,
      negative: `The desire to be genuinely remembered is completely real, and it keeps staying guarded so completely that the impression never actually reaches anyone. That guardedness isn't mystery. It's the heart's desire for real presence, still unmet, still waiting for one piece of knowledge to actually be offered.`,
    },

    '3_HZH': {
      heading: `A Beautiful, Abundant Home`,
      why: `Your heart wants family, home, and a peaceful, abundant physical life — comfort, luxury, and real beauty around it, not just enough to get by. The Empress here names a material desire for genuine domestic richness.`,
      shadow: `Blocked, this can turn into a home that runs efficiently but has nothing lovely in it, function standing in for the abundance that was actually wanted.`,
      path: `The path is adding one real piece of beauty to your home or daily life this week. You are allowed to want luxury and comfort, not just sufficiency. Where has your home gotten efficient at the cost of getting beautiful?`,
      positive: `The desire for a beautiful, abundant home hasn't changed — genuine domestic richness, not just sufficiency, was always what your heart wanted. What's different is that you now add one real piece of beauty to your home this week. That addition is exactly the abundance it was asking for.`,
      negative: `The desire for domestic richness is completely genuine, and it keeps being answered with pure efficiency instead, a home that runs well and holds little loveliness. That efficiency isn't wrong, but it's not what was asked for. The heart's desire for beauty is still waiting for one real piece to be added back in.`,
    },

    '4_HZH': {
      heading: `Authority and Security`,
      why: `Your heart wants power, authority, and financial security — a prestigious, controlled position in business and life, genuinely earned. The Emperor here names a material desire for durable, respected standing.`,
      shadow: `Blocked, this can turn into chasing the appearance of authority — the title, the office — while the actual financial security underneath stays thin.`,
      path: `The path is building one piece of real financial ground today, not just its appearance. You are allowed to want genuine security, not just its look. What would actual financial security require that mere status hasn't given you?`,
      positive: `The desire for real authority and security hasn't changed — durable, respected standing, genuinely earned, was always what your heart wanted. What's different is that you now build one piece of actual financial ground today, instead of chasing its appearance. That building is what makes the security real, not just visible.`,
      negative: `The desire for genuine financial security is completely real, and it keeps chasing the appearance of authority instead — the title, the office — while the actual ground underneath stays thin. That chase isn't ambition misapplied. It's the heart's real desire for security, still unmet beneath a prestigious surface.`,
    },

    '5_HZH': {
      heading: `Standing Rooted in Tradition`,
      why: `Your heart wants academic or spiritual leadership, real respect in society, and a strong position rooted in traditional values. The Hierophant here names a material desire for earned, structural credibility.`,
      shadow: `Blocked, this can turn into collecting credentials that look respectable without ever building the actual standing they were supposed to represent.`,
      path: `The path is using one credential you already have to actually do something respected, not just held. You are allowed to want real, earned standing. What credibility have you already earned that you haven't yet put to actual use?`,
      positive: `The desire for respected standing hasn't changed — real, earned credibility rooted in something larger than yourself was always what your heart wanted. What's different is that you now use one credential you already have to actually do something respected, instead of just holding it. That use is what makes the standing lived.`,
      negative: `The desire for genuine standing is completely real, and it keeps collecting credentials that look respectable without ever building the actual respect they were meant to represent. That collecting isn't achievement. It's the heart's desire for lived credibility, still on paper only, still waiting to be put to use.`,
    },

    '6_HZH': {
      heading: `A Deeply Bonded Life`,
      why: `Your heart wants a passionate relationship, real romance, deep bonds actually lived in the physical world. The Lovers here names a material desire for love that's felt, not just described.`,
      shadow: `Blocked, this can turn into a relationship that looks passionate from the outside while the actual bond underneath stays thin and untested.`,
      path: `The path is deepening one real bond today rather than performing its appearance. You are allowed to want a love that's actually deep, not just visibly passionate. Where is a bond of yours performing depth it hasn't actually built yet?`,
      positive: `The desire for a passionate, deeply bonded life hasn't changed — love that's actually felt, not just described, was always what your heart wanted. What's different is that you now deepen one real bond today, instead of performing its appearance. That deepening is what makes the passion genuinely lived.`,
      negative: `The desire for real depth in love is completely genuine, and it keeps being answered with a bond that looks passionate from the outside while staying thin and untested underneath. That performance isn't intimacy. It's the heart's desire for a truly bonded life, still unmet, still waiting for the depth to actually be built.`,
    },

    '7_HZH': {
      heading: `Victory and Forward Motion`,
      why: `Your heart wants success, travel, adventure — real victories won through motion, not a life spent standing still. The Chariot here names a material desire for visible, earned achievement in constant pursuit.`,
      shadow: `Blocked, this can turn into motion without any actual victories, momentum mistaken for the achievement it was supposed to produce.`,
      path: `The path is naming one concrete victory you're actually driving toward right now. You are allowed to want real wins, not just constant motion. What specific victory is your current momentum actually aimed at?`,
      positive: `The desire for victory and forward motion hasn't changed — real, earned achievement was always what your heart wanted. What's different is that you now name one concrete victory you're actually driving toward. That naming is what finally gives the momentum a destination.`,
      negative: `The desire for real victory is completely genuine, and it keeps generating motion without ever naming what it's actually for, momentum mistaken for the achievement it was supposed to produce. That exhaustion isn't laziness. It's the heart's desire for a named destination, still unmet, still waiting for one victory to be specified.`,
    },

    '8_HZH': {
      heading: `A Fairer World`,
      why: `Your heart wants a strong position in the world of law and rights — real fairness enacted, not just believed in privately. Justice here names a material desire for fairness that actually changes conditions.`,
      shadow: `Blocked, this can turn into holding strong opinions about fairness while never actually using your position to change anything.`,
      path: `The path is using whatever standing you have to correct one real unfairness this month. You are allowed to want to actually change something unfair, not just notice it. What position do you already hold that could make one situation more fair?`,
      positive: `The desire to make the world fairer hasn't changed — real fairness enacted, not just believed in privately, was always what your heart wanted. What's different is that you now use whatever standing you have to correct one real unfairness. That action is exactly what the desire for justice was asking for.`,
      negative: `The desire for real fairness is completely genuine, and it keeps holding strong private opinions without ever using actual standing to change anything. That restraint isn't humility. It's the heart's material desire for justice, still unmet, still waiting for one position to actually be used.`,
    },

    '9_HZH': {
      heading: `Retreat and Self-Discovery`,
      why: `Your heart wants a life away from the noise, in harmony with nature — real retreat into your own inner world, individual discovery actually pursued. The Hermit here names a material desire for solitude with a purpose.`,
      shadow: `Blocked, this can turn into staying constantly busy in the city of your own responsibilities, retreat postponed indefinitely as impractical.`,
      path: `The path is taking one real day of retreat, however small, this month. You are allowed to want actual solitude, not just a break from noise. What would a real retreat look like for you, sized to what's actually possible right now?`,
      positive: `The desire for retreat and self-discovery hasn't changed — real solitude with a purpose was always what your heart wanted. What's different is that you now take one real day of retreat, sized to what's actually possible. That sizing is what finally gives the discovery room to happen.`,
      negative: `The desire for genuine retreat is completely real, and it keeps getting postponed as impractical, staying busy in the noise instead. That postponement isn't responsibility. It's the heart's material desire for solitude, still deferred, still waiting for one small, real retreat to actually be taken.`,
    },

    '10_HZH': {
      heading: `Genuine Material Fortune`,
      why: `Your heart wants fortunate events and real material abundance — the sense of actually making the most of life's opportunities as they arrive. The Wheel of Fortune here names a material desire for good fortune met and used well.`,
      shadow: `Blocked, this can turn into good opportunities arriving and going unused because you're too busy bracing for the next downturn to actually receive them.`,
      path: `The path is receiving one current piece of good fortune fully, without immediately bracing for its opposite. You are allowed to want to actually enjoy good fortune when it arrives. What current good thing haven't you let yourself fully receive yet?`,
      positive: `The desire for genuine material fortune hasn't changed — good fortune actually met and used well was always what your heart wanted. What's different is that you now receive one current piece of good fortune fully, without immediately bracing for its opposite. That reception is what finally lets the abundance land.`,
      negative: `The desire for real material abundance is completely genuine, and it keeps going unreceived, good opportunities arriving while you're too busy bracing for the next downturn to notice them. That bracing isn't caution. It's the heart's desire for fortune, chronically unmet, still waiting for one good thing to actually be received.`,
    },

    '11_HZH': {
      heading: `A Charismatic Presence`,
      why: `Your heart wants real physical endurance, a healthy body, a presence strong enough to withstand life's challenges and inspire other people. Strength here names a material desire for embodied, magnetic resilience.`,
      shadow: `Blocked, this can turn into performing strength outwardly while your actual physical vitality goes quietly neglected underneath the performance.`,
      path: `The path is one real act of physical care today, not performance of strength but actual tending to it. You are allowed to want genuine vitality, not just the appearance of resilience. Where has physical performance replaced actual physical care?`,
      positive: `The desire for a strong, charismatic presence hasn't changed — real, embodied resilience was always what your heart wanted. What's different is that you now tend to your actual physical vitality with one real act of care, instead of only performing strength. That tending is what makes the resilience genuine instead of staged.`,
      negative: `The desire for genuine physical presence is completely real, and it keeps performing strength outwardly while actual vitality goes quietly neglected underneath. That performance isn't resilience. It's the heart's material desire for embodied strength, still unmet, still waiting for one act of real care.`,
    },

    '12_HZH': {
      heading: `A Pause to Transform`,
      why: `Your heart wants a genuine period of pause in the physical world — deep inner transformation, real freedom from old patterns, not a rushed-through interruption. The Hanged Man here names a material desire for suspension that's actually allowed to do its work.`,
      shadow: `Blocked, this can turn into rushing through the pause to get back to normal, skipping the transformation the suspension was actually there to produce.`,
      path: `The path is letting one current pause last exactly as long as it needs to. You are allowed to want the pause to actually finish its work. What transformation is this current pause trying to complete that rushing would cut short?`,
      positive: `The desire for a real pause to actually transform hasn't changed — genuine suspension allowed to do its work, not a rushed interruption, was always what your heart wanted. What's different is that you now let one current pause last exactly as long as it needs to. That patience is what lets the transformation actually complete.`,
      negative: `The desire for genuine transformative pause is completely real, and it keeps getting rushed through to get back to normal, skipping the work the suspension was actually there to do. That rushing isn't efficiency. It's the heart's material desire still unmet, still waiting for one pause to finish on its own timing.`,
    },

    '13_HZH': {
      heading: `Tearing Down to Build New`,
      why: `Your heart wants a major transformation in the material world — a completely renewed lifestyle, the old genuinely torn down to make room for something new. Transformation here names a material desire for real, structural change.`,
      shadow: `Blocked, this can turn into renovating the surface of your material life while the actual old structure underneath stays fully intact.`,
      path: `The path is tearing down one real piece of the old structure, not just its surface. You are allowed to want a genuinely rebuilt material life. What old structure is your heart actually ready to demolish, not just redecorate?`,
      positive: `The desire to tear down the old and build the new hasn't changed — real, structural change was always what your heart wanted. What's different is that you now tear down one real piece of the old structure, not just its surface. That demolition is what finally gives the new material life room to be built.`,
      negative: `The desire for genuine material renewal is completely real, and it keeps settling for redecorating the surface while the old structure underneath stays fully intact. That redecorating isn't renewal. It's the heart's desire for real change, still unmet, still waiting for one structure to actually come down.`,
    },

    '14_HZH': {
      heading: `Perfect Balance, Body to Spirit`,
      why: `Your heart wants a genuinely healthy life — real, felt balance across body, mind, and spirit, not just adequate function in each separately. Temperance here names a material desire for lived, integrated wellbeing.`,
      shadow: `Blocked, this can turn into managing each area separately and reasonably well while the actual felt integration between them never quite arrives.`,
      path: `The path is finding one place today where body, mind, and spirit could work together instead of being managed separately. You are allowed to want them integrated, not just each individually maintained. Where could one small act serve all three at once?`,
      positive: `The desire for perfect balance across body, mind, and spirit hasn't changed — real, felt integration, not just adequate function in each, was always what your heart wanted. What's different is that you now find one act today that serves all three together. That integration is exactly the balance it was asking for.`,
      negative: `The desire for genuine wellbeing is completely real, and it keeps managing each area competently but separately, with the actual felt integration between them never quite arriving. That management isn't wholeness. It's the heart's desire for real balance, still unmet, still waiting for one act to serve all three at once.`,
    },

    '15_HZH': {
      heading: `Power Honestly Held`,
      why: `Your heart wants real passion, pleasure, and material wealth — sometimes a life that pushes boundaries, held honestly rather than apologetically. The Devil here names a material desire for power and pleasure examined rather than denied.`,
      shadow: `Blocked, this can turn into either denying the desire for wealth and pleasure outright, or pursuing it so unconsciously it curdles into compulsion.`,
      path: `The path is naming your actual desire for power or pleasure honestly, then choosing consciously whether and how to pursue it. You are allowed to want wealth and pleasure without shame. What material desire have you been either denying or chasing unconsciously?`,
      positive: `The desire for pleasure, power, and material wealth hasn't changed — real desire, held honestly rather than apologetically, was always what your heart wanted. What's different is that you now name it plainly and choose consciously whether and how to pursue it. That honesty is exactly what was being asked for.`,
      negative: `The desire for wealth and pleasure is completely real, and it keeps getting either denied outright or chased so unconsciously it curdles into compulsion. Neither satisfies the heart. What's actually being asked for is neither denial nor compulsion, but one honest naming of what you actually want.`,
    },

    '16_HZH': {
      heading: `A Completely New Beginning`,
      why: `Your heart craves significant material change — the destruction of old structures and the chance for a genuinely new beginning, not incremental adjustment. The Tower here names a material desire for real, clean-slate renewal.`,
      shadow: `Blocked, this can turn into bracing against necessary collapse so hard that the new beginning never actually gets to arrive.`,
      path: `The path is letting one structure that's already failing actually finish falling. You are allowed to want a real new beginning, not a patched old one. What is already collapsing that you could stop propping up?`,
      positive: `The desire for a completely new material beginning hasn't changed — real, clean-slate renewal, not incremental adjustment, was always what your heart wanted. What's different is that you now let one already-failing structure actually finish falling, instead of propping it up. That release is what gives the new beginning room to start.`,
      negative: `The desire for genuine new beginning is completely real, and it keeps propping up a structure that's already failing, bracing against the collapse instead of letting it complete. That propping isn't stability. It's the heart's desire for renewal, still postponed, still waiting for one structure to be let go.`,
    },

    '17_HZH': {
      heading: `An Inspiring Creative Presence`,
      why: `Your heart wants art, creativity, a life lived close to nature — and to actually be an inspiring presence to the people around it, not just a private creative practice. The Star here names a material desire for creative work that's shared and seen.`,
      shadow: `Blocked, this can turn into making beautiful things privately while the inspiring, shared version of that creativity never actually gets offered.`,
      path: `The path is sharing one piece of your creative work with someone this week. You are allowed to want to inspire others, not just create privately. What creative work of yours is ready to stop being private?`,
      positive: `The desire to be an inspiring creative presence hasn't changed — creative work that's shared and seen, not just privately made, was always what your heart wanted. What's different is that you now share one piece of your work with someone this week. That sharing is what finally lets the inspiration actually reach someone.`,
      negative: `The desire for creative influence is completely real, and it keeps making beautiful things privately, with the inspiring, shared version never actually offered. That privacy isn't humility. It's the heart's material desire to inspire, still unmet, still waiting for one piece of work to leave the room.`,
    },

    '18_HZH': {
      heading: `A Life Intertwined With Mystery`,
      why: `Your heart wants dreams, artistic expression, mystical experience — a material life genuinely woven through with the supernatural and the strange, not scrubbed clean of it. The Moon here names a material desire for enchantment actually lived, not merely appreciated from a distance.`,
      shadow: `Blocked, this can turn into admiring mystery and art from a safe, tidy distance while never actually letting your own life be shaped by them.`,
      path: `The path is letting one real dream or mystical hunch actually influence a decision this week. You are allowed to want a life genuinely touched by mystery. What dream or hunch have you been admiring instead of actually following?`,
      positive: `The desire for a life intertwined with mystery hasn't changed — enchantment actually lived, not merely appreciated from a distance, was always what your heart wanted. What's different is that you now let one real dream or hunch actually influence a decision. That influence is what makes the mystery lived rather than admired.`,
      negative: `The desire for a mystery-touched life is completely genuine, and it keeps admiring dreams and hunches from a safe, tidy distance without ever letting them shape anything real. That distance isn't wisdom. It's the heart's desire for enchantment, still unmet, still waiting for one hunch to actually be followed.`,
    },

    '19_HZH': {
      heading: `Success, Health, and Love at Once`,
      why: `Your heart wants happiness, success, health, and love-filled relationships in the physical world — the whole picture, not one piece traded for another. The Sun here names a material desire for wholeness across every domain at once.`,
      shadow: `Blocked, this can turn into succeeding in one domain while quietly sacrificing another, treating the trade as inevitable rather than examined.`,
      path: `The path is naming one domain you've quietly sacrificed for another and giving it real attention this week. You are allowed to want all of it, not just one piece at a time. Which part of your wholeness have you been trading away as if it were required?`,
      positive: `The desire for success, health, and love all at once hasn't changed — the whole picture, not one piece traded for another, was always what your heart wanted. What's different is that you now give real attention to the domain you'd been quietly sacrificing. That attention is what finally makes the wholeness possible.`,
      negative: `The desire for a full, undivided life is completely genuine, and it keeps trading one domain for another as though the trade were required. That trade isn't inevitable. It's the heart's material desire for wholeness, still partial, still waiting for one sacrificed domain to get real attention again.`,
    },

    '20_HZH': {
      heading: `A Fresh Material Start`,
      why: `Your heart yearns for radical transformation — a completely fresh start and the release of every past material burden, not a lightened version of the old life. Judgement here names a material desire for total, not partial, renewal.`,
      shadow: `Blocked, this can turn into making moderate improvements while calling them a fresh start, when something more total was actually being asked for.`,
      path: `The path is naming what a truly fresh start would require, even if you only take one real step toward it now. You are allowed to want total renewal, not a moderate upgrade. What would an actually fresh material start require of you?`,
      positive: `The desire for a completely fresh material start hasn't changed — total, not partial, renewal was always what your heart wanted. What's different is that you now name what a truly fresh start would actually require, and take one real step toward it. That naming is what stops the fresh start from being a moderate substitute.`,
      negative: `The desire for total renewal is completely real, and it keeps settling for moderate improvement dressed up as a fresh start. That substitution isn't progress. It's the heart's desire for real renewal, quietly unmet, still waiting for something more total than what's currently being offered.`,
    },

    '21_HZH': {
      heading: `Traveling and Living It`,
      why: `Your heart wants to travel, experience different cultures, and build a genuinely successful, fulfilling material life — not just imagine one. The World here names a material desire for lived breadth, not deferred plans.`,
      shadow: `Blocked, this can turn into planning a bigger life indefinitely while the actual, lived version keeps getting pushed to some more convenient year.`,
      path: `The path is booking, planning, or starting one real piece of the bigger life this month. You are allowed to want to actually live the fuller life, not just plan it. What piece of the life you keep planning could you actually start now?`,
      positive: `The desire to travel the world and actually live it hasn't changed — lived breadth, not deferred plans, was always what your heart wanted. What's different is that you now book, plan, or start one real piece of the bigger life this month. That start is what finally makes the breadth lived instead of imagined.`,
      negative: `The desire for a genuinely lived, expansive life is completely real, and it keeps planning a bigger version indefinitely without ever starting it. That planning isn't preparation. It's the heart's material desire for lived breadth, still deferred, still waiting for one real piece to actually begin.`,
    },

    '22_HZH': {
      heading: `Adventure Without Rigid Systems`,
      why: `Your heart seeks constant new places, new people, living fully in the moment — an adventurous material life free from stereotypes and rigid systems, explored rather than merely imagined. The Fool here names a material desire for genuine freedom, lived.`,
      shadow: `Blocked, this can turn into staying inside a rigid system out of practicality while telling yourself the adventurous life is simply for later.`,
      path: `The path is one real, unplanned adventure this month, however small. You are allowed to want a genuinely free, unstructured life. What adventurous thing have you been postponing as impractical that's actually just overdue?`,
      positive: `The desire for an adventurous, free life hasn't changed — genuine freedom lived, not merely imagined, was always what your heart wanted. What's different is that you now take one real, unplanned adventure this month, however small. That leap is what finally makes the free life lived now instead of later.`,
      negative: `The desire for genuine adventure and freedom is completely real, and it keeps staying inside a rigid system out of practicality, calling the freer life a someday. That deferral isn't responsibility. It's the heart's material desire for real freedom, still unmet, still waiting for one overdue adventure.`,
    },


    // ── Chakra Map: Muladhara, Root Chakra (MUL) ────────────────────────────

    '1_MUL': {
      heading: `Ground From Starting, Not Arriving`,
      why: `Your sense of safety comes from motion — from knowing you can generate what you need out of nothing if you have to. The Magician grounds you through capability itself: as long as you can start something, you feel like you'll survive.`,
      shadow: `The risk is never actually letting the ground settle, staying in perpetual-start mode because stillness feels like the one thing your safety wasn't built to survive.`,
      path: `Try trusting that you're allowed to stop generating and just be held by what you've already built. You are allowed to feel safe without constantly proving you can begin again. What would it feel like to be grounded without needing to start something new to prove it?`,
      positive: `Your safety through capability hasn't changed — the ability to generate what you need from nothing is still real. What's different is that you now trust stillness too, letting yourself be held by what you've already built instead of needing to keep starting. That trust is what finally lets the ground settle.`,
      negative: `Your safety through capability is completely real, and it keeps existing only in motion, never quite landing, always one stop away from feeling unstable. That restlessness isn't ambition. It's a ground still waiting for you to discover it holds even when you're not generating something new to prove it.`,
    },

    '2_MUL': {
      heading: `Ground From Knowing First`,
      why: `Your sense of safety comes from your own internal read of a situation — sensing what's true before anyone confirms it. The High Priestess grounds you through trusted inner knowing, a felt security that doesn't need outside verification.`,
      shadow: `The risk is that the security stays entirely private, so ungrounded to anyone else that it can be mistaken for absence rather than depth.`,
      path: `Try letting your grounded knowing show occasionally, so it can actually be recognized as the stability it is. You are allowed to let your quiet certainty be visible. What would it look like to let someone see how grounded you actually are?`,
      positive: `Your safety through inner knowing hasn't changed — the felt certainty that doesn't need outside verification was always genuinely yours. What's different is that you now let it show occasionally, instead of keeping it entirely private. That visibility is what finally lets others recognize the ground you've actually been standing on.`,
      negative: `Your safety through inner knowing is completely real, and it keeps staying entirely private, so hidden it can be mistaken for absence rather than depth. That invisibility isn't protection. It's a genuine groundedness still waiting for you to let it be seen.`,
    },

    '3_MUL': {
      heading: `Ground From Belonging`,
      why: `Your sense of safety comes from resources, warmth, a home that actually holds you — material comfort as a real form of security, not excess for its own sake. The Empress grounds you through genuine, felt provision.`,
      shadow: `The risk is measuring your safety only by how much you're providing for others, letting your own basic needs go quietly unattended while you tend everyone else's.`,
      path: `Try including your own needs in the abundance you create. You are allowed to be as provided-for as you provide. What basic need of your own have you been quietly deferring while meeting everyone else's?`,
      positive: `Your safety through abundance and provision hasn't changed — genuine, felt security through resources and warmth was always real. What's different is that you now include your own needs in that abundance, instead of measuring safety only by what you provide others. That inclusion is what makes the ground whole.`,
      negative: `Your safety through provision is completely real, and it keeps flowing entirely outward, measured by how well everyone else is cared for while your own needs go quietly unattended. That imbalance isn't generosity working as intended. It's a foundation still waiting to include the person building it.`,
    },

    '4_MUL': {
      heading: `Ground From Reliable Structure`,
      why: `Your sense of safety comes from order — systems, routines, a structure sturdy enough that you don't have to constantly monitor it. The Emperor grounds you through built, dependable stability.`,
      shadow: `The risk is that maintaining the structure becomes a full-time job in itself, so exhausting to uphold that the security it was supposed to provide gets spent on defending it instead.`,
      path: `Try building one piece of structure durable enough that it holds itself, without your constant oversight. You are allowed to trust a system you built. What structure of yours could actually run without your constant management?`,
      positive: `Your safety through structure hasn't changed — dependable systems and routines were always the real foundation. What's different is that you now build one piece sturdy enough to trust without constant oversight, instead of monitoring it endlessly. That trust is what finally lets the security feel restful.`,
      negative: `Your safety through structure is completely real, and it keeps requiring constant vigilance to hold, exhausting to maintain in a way that quietly relocates the original anxiety rather than resolving it. That vigilance isn't security. It's a ground still waiting for a structure you can actually trust to hold itself.`,
    },

    '5_MUL': {
      heading: `Ground From Something Larger`,
      why: `Your sense of safety comes from tradition, community, a shared framework of meaning bigger than any one day's uncertainty. The Hierophant grounds you through belonging.`,
      shadow: `The risk is that the belonging becomes the whole foundation, so that questioning any part of the tradition feels like losing the ground itself.`,
      path: `Try separating your security from any single belief so the ground survives even when one part of it gets questioned. You are allowed to feel safe even while doubting a piece of what you were taught. What would still hold you up if you let one inherited belief be wrong?`,
      positive: `Your safety through belonging hasn't changed — a shared framework of meaning larger than any single day was always real ground. What's different is that you now separate your security from any one belief within it, so the ground survives even when a part gets honestly questioned. That separation is what makes doubt and groundedness coexist.`,
      negative: `Your safety through belonging is completely real, and it keeps depending on the whole tradition staying unquestioned, so any honest doubt threatens to take the ground down with it. That fragility isn't faith. It's a ground still waiting to be separated from any single belief within it.`,
    },

    '6_MUL': {
      heading: `Ground From Being Chosen`,
      why: `Your sense of safety comes from connection — knowing you're wanted, not just tolerated, by the people closest to you. The Lovers grounds you through felt, mutual belonging.`,
      shadow: `The risk is chasing that feeling of being chosen so hard you accept relationships that don't actually offer it, mistaking any attention for the real thing.`,
      path: `Try noticing where you already are genuinely chosen and let that be enough ground for now. You are allowed to feel secure in love without constantly re-auditioning for it. Where are you already wanted exactly as you are, if you actually looked?`,
      positive: `Your safety through connection hasn't changed — felt, mutual belonging was always the real ground. What's different is that you now notice where you're already genuinely chosen, letting that be enough instead of chasing more proof. That recognition is real ground, not a feeling you have to keep re-earning.`,
      negative: `Your safety through connection is completely real, and it keeps chasing the feeling of being chosen through relationships that don't actually offer it, mistaking any attention for the real thing. That chase isn't love. It's a ground still waiting for you to notice where you're already standing on solid, mutual belonging.`,
    },

    '7_MUL': {
      heading: `Ground From Forward Motion`,
      why: `Your sense of safety comes from momentum — as long as you're moving toward something, the ground under you feels solid. The Chariot grounds you through purposeful direction.`,
      shadow: `The risk is that stillness starts to feel like danger, so any pause reads as the ground itself giving way rather than a normal part of any journey.`,
      path: `Try resting for one real stretch and noticing that the ground is actually still there. You are allowed to feel safe while standing still. What would it take to trust that stopping doesn't undo your progress?`,
      positive: `Your safety through momentum hasn't changed — purposeful direction still makes the ground feel solid. What's different is that you now rest for one real stretch and notice the ground is still there. That trust is what turns momentum sustainable instead of compulsive.`,
      negative: `Your safety through momentum is completely real, and it keeps making stillness feel like danger, every pause registering as the ground giving way rather than a normal part of the journey. That fear isn't laziness catching up with you. It's a ground still waiting for you to discover it holds even while you're standing still.`,
    },

    '8_MUL': {
      heading: `Ground From Fairness`,
      why: `Your sense of safety comes from balance — knowing the scales are even, that what's owed gets paid and what's earned gets received. Justice grounds you through a world that behaves the way it's supposed to.`,
      shadow: `The risk is that any unfairness, even small, can feel like the whole ground shifting, because your security is tied to a world staying perfectly calibrated.`,
      path: `Try letting your ground rest in your own integrity rather than the world's fairness, since only one of those is actually within your control. You are allowed to feel secure even when the world is unfair. What would let your footing hold steady even through one unresolved injustice?`,
      positive: `Your safety through fairness hasn't changed — the desire for balance, for what's owed to be paid, was always real. What's different is that you now root your security in your own integrity rather than the world's cooperation. That shift is what finally makes the ground steady regardless of outside conditions.`,
      negative: `Your safety through fairness is completely real, and it keeps depending on the world staying perfectly calibrated, so every ordinary injustice shakes the ground. That instability isn't oversensitivity. It's a security still tied to a condition that was never actually guaranteed, still waiting to be rooted in something within your control.`,
    },

    '9_MUL': {
      heading: `Ground Built in Solitude`,
      why: `Your sense of safety comes from withdrawal — time alone to actually settle, away from the noise of other people's needs and opinions. The Hermit grounds you through chosen retreat.`,
      shadow: `The risk is that the retreat becomes permanent, security purchased at the price of connection you actually still need.`,
      path: `Try returning from your solitude with the ground intact and letting relationship not threaten it. You are allowed to be grounded in solitude and still stay connected. What would it look like to bring your settled self back into company without losing it?`,
      positive: `Your safety through solitude hasn't changed — chosen retreat, real time to settle, was always genuine ground. What's different is that you now return from it and stay grounded in company too, instead of needing the retreat to be permanent. That return proves the security was never actually dependent on staying alone.`,
      negative: `Your safety through solitude is completely real, and the retreat keeps threatening to become permanent, stability purchased at a cost of connection you actually still need. That permanence isn't peace. It's a ground still waiting to prove it can survive the return to other people.`,
    },

    '10_MUL': {
      heading: `Ground From Trusting the Turn`,
      why: `Your sense of safety comes from accepting that things cycle — the ability to trust a low point will actually turn, rather than needing certainty about outcomes. The Wheel of Fortune grounds you through faith in timing.`,
      shadow: `The risk is that every downturn still feels like proof the ground has given way, even when you know, intellectually, that it's just a phase.`,
      path: `Try meeting the next low point with the trust you already have in theory. You are allowed to feel grounded through a downturn, not just after it ends. What would it look like to feel secure while still mid-cycle, before the turn arrives?`,
      positive: `Your safety through trusting the turning hasn't changed — faith that a low point will actually turn was always real. What's different is that you now feel grounded through the downturn itself, not just once it resolves. That mid-cycle trust is what makes the security durable rather than retrospective.`,
      negative: `Your safety through trusting cycles is completely real in theory, and it keeps failing to land during the actual downturn, every low point still feeling like proof the ground gave way. That gap isn't hypocrisy. It's a trust still waiting to be felt mid-cycle, not just confirmed after the fact.`,
    },

    '11_MUL': {
      heading: `Ground From Quiet Endurance`,
      why: `Your sense of safety comes from your own capacity to withstand — real, quiet endurance that doesn't need an audience. Strength grounds you through inner resilience.`,
      shadow: `The risk is turning that endurance into a performance, needing witnesses to confirm the resilience is real, which quietly undermines the very quality it's meant to prove.`,
      path: `Try letting your endurance be private again, unwitnessed, and trust it's still real. You are allowed to feel grounded without anyone seeing how strong you are. What would it feel like to be resilient with no one watching?`,
      positive: `Your safety through endurance hasn't changed — real, quiet resilience was always genuine ground. What's different is that you now let it be private again, unwitnessed, and trust it's still real. That privacy is what confirms the strength was never actually dependent on an audience.`,
      negative: `Your safety through endurance is completely real, and it keeps needing a witness to feel confirmed, turning quiet resilience into a performance. That need isn't vanity. It's a genuine strength still waiting to be trusted on its own, without anyone watching to make it count.`,
    },

    '12_MUL': {
      heading: `Ground From Letting Go`,
      why: `Your sense of safety comes, paradoxically, from surrender — trusting the situation enough to stop gripping it. The Hanged Man grounds you through release rather than control.`,
      shadow: `The risk is that the surrender turns into passivity, a permanent suspension mistaken for the release that was actually needed.`,
      path: `Try releasing your grip on one specific thing today and noticing the ground holds anyway. You are allowed to feel secure without controlling the outcome. What would you have to let go of to find out the ground was there the whole time?`,
      positive: `Your safety through surrender hasn't changed — trusting a situation enough to stop gripping it was always the real ground, paradoxical as that is. What's different is that you now release your grip on one specific thing and notice the ground holds anyway. That discovery is what makes the surrender genuinely grounding.`,
      negative: `Your safety through surrender is completely real in principle, and it keeps losing to a grip that mistakes control for the only path to safety. That grip isn't security. It's a ground still waiting to be discovered, still there underneath, unreachable until something is finally released.`,
    },

    '13_MUL': {
      heading: `Ground From Letting Old Selves Die`,
      why: `Your sense of safety comes from your own capacity to actually end things and be renewed — real transformation as a source of stability, not a threat to it. Transformation grounds you through willingness to change.`,
      shadow: `The risk is ending things prematurely, mistaking any discomfort for a signal that the current chapter must be over, when it might just be difficult.`,
      path: `Try letting an ending complete at its actual pace rather than rushing it for the relief. You are allowed to feel grounded through change, not just after it's finished. What ending in your life deserves its full timeline instead of a rushed one?`,
      positive: `Your safety through transformation hasn't changed — the capacity to end things and be renewed was always a real source of stability. What's different is that you now let an ending complete at its actual pace, instead of rushing it for relief. That patience is what makes the ground genuine rather than just the appearance of change.`,
      negative: `Your safety through transformation is completely real, and it keeps rushing every ending to escape discomfort, skipping the actual work that would settle the ground. That haste isn't decisiveness. It's a transformation still waiting to be given its full timeline instead of a shortcut.`,
    },

    '14_MUL': {
      heading: `Ground From Real Balance`,
      why: `Your sense of safety comes from genuine integration — body, mind, and circumstance actually working together, not just alternating in turns. Temperance grounds you through real, felt equilibrium.`,
      shadow: `The risk is mistaking the alternation between extremes for balance itself, when true equilibrium was actually being asked for the whole time.`,
      path: `Try finding one small, actually blended version of two things you've been alternating between. You are allowed to want real balance, not managed extremes. What two things in your life are ready to work together instead of taking turns?`,
      positive: `Your safety through balance hasn't changed — genuine integration, body and mind and circumstance actually working together, was always the real ground. What's different is that you now find one small, actually blended version of two things you'd been alternating between. That blend is what finally provides the felt equilibrium.`,
      negative: `Your safety through balance is completely real, and it keeps mistaking alternation between extremes for balance itself. That oscillation isn't equilibrium. It's a ground still waiting for real integration, still asking for two things to actually work together instead of taking turns.`,
    },

    '15_MUL': {
      heading: `Ground From Facing Denial`,
      why: `Your sense of safety comes from honest reckoning with your own compulsions and desires — real security through self-knowledge, not through pretending the shadow isn't there. The Devil grounds you through confrontation, not denial.`,
      shadow: `The risk is performing a cleaner version of yourself while an unexamined pull runs quietly underneath, undermining the very ground the performance was meant to protect.`,
      path: `Try naming one real compulsion honestly, without judgment, today. You are allowed to feel grounded by facing your shadow instead of hiding it. What part of yourself have you been protecting the ground from instead of actually grounding it in?`,
      positive: `Your safety through honest reckoning hasn't changed — real security through self-knowledge, not through pretending the shadow isn't there, was always the ground. What's different is that you now name one real compulsion honestly, without judgment. That honesty is the actual ground your safety needed all along.`,
      negative: `Your safety through honest reckoning is completely real, and it keeps performing a cleaner version of yourself while an unexamined pull runs quietly underneath. That performance isn't safety. It's a ground still unaddressed, still waiting for the shadow to be faced instead of hidden from.`,
    },

    '16_MUL': {
      heading: `Ground From Surviving Collapse`,
      why: `Your sense of safety comes from having already survived structural collapse — proof, hard-won, that you can rebuild. The Tower grounds you through resilience tested by real crisis.`,
      shadow: `The risk is bracing permanently for the next collapse, so vigilant against instability that you can never actually rest in the ground you've already rebuilt.`,
      path: `Try trusting the current structure without constantly checking it for cracks. You are allowed to feel grounded without waiting for the next collapse. What would it feel like to trust what you've already rebuilt?`,
      positive: `Your safety through survived collapse hasn't changed — real, hard-won proof that you can rebuild was always genuine ground. What's different is that you now trust the current structure without constantly checking it for cracks. That trust is what lets the ground finally feel settled instead of perpetually tested.`,
      negative: `Your safety through survived collapse is completely real, and it keeps bracing permanently for the next one, so vigilant against instability that you never actually rest in what you've already rebuilt. That vigilance isn't wisdom anymore. It's a ground still waiting to be trusted, not just proven.`,
    },

    '17_MUL': {
      heading: `Ground From Hope Without Proof`,
      why: `Your sense of safety comes from faith in a better outcome — hope itself as a stabilizing force, not dependent on evidence it will pan out. The Star grounds you through trust in the future.`,
      shadow: `The risk is keeping that hope so modest and private it barely functions as ground at all, too small to actually hold your weight.`,
      path: `Try letting your hope be as large and visible as it actually is. You are allowed to feel grounded in a hope you haven't shrunk down. What would your hope look like at its actual, unshrunken size?`,
      positive: `Your safety through hope hasn't changed — faith in a better outcome, not dependent on evidence, was always a real stabilizing force. What's different is that you now let it be as large and visible as it actually is, instead of shrinking it down. That full size is what finally lets it function as load-bearing ground.`,
      negative: `Your safety through hope is completely real, and it keeps staying modest and private, too thin to actually hold any weight even though the capacity was always there. That smallness isn't humility. It's a ground still waiting to be let out at its real, unshrunken size.`,
    },

    '18_MUL': {
      heading: `Ground From the Undercurrent`,
      why: `Your sense of safety comes from a felt sense beneath the surface — intuition about atmosphere and undercurrent that turns out, again and again, to be accurate. The Moon grounds you through trust in the unseen.`,
      shadow: `The risk is that the felt sense curdles into anxious story, mistaking every strong feeling for confirmed danger rather than genuine signal.`,
      path: `Try checking one strong feeling against real evidence before treating it as settled fact. You are allowed to trust your intuition while still verifying it. What feeling have you been treating as certain that's actually still just a feeling?`,
      positive: `Your safety through the undercurrent hasn't changed — a felt sense beneath the surface, accurate again and again, was always real ground. What's different is that you now check one strong feeling against real evidence before treating it as settled fact. That verification is what turns intuition into trustworthy ground.`,
      negative: `Your safety through the undercurrent is completely real, and it keeps curdling into anxious story, every strong feeling treated as confirmed danger rather than genuine signal. That confusion isn't intuition failing. It's a ground still waiting for the noise to be sorted from the real signal underneath.`,
    },

    '19_MUL': {
      heading: `Ground From Genuine Warmth`,
      why: `Your sense of safety comes from vitality and open warmth — a felt sense that things are fundamentally good, not performed positivity but actual, lived brightness. The Sun grounds you through real joy.`,
      shadow: `The risk is that the warmth becomes a performance for other people's comfort, leaving your own harder feelings with nowhere safe to land.`,
      path: `Try letting one difficult feeling be visible alongside the warmth today. You are allowed to feel grounded even when you're not being bright. What would it feel like to be warmly received on a day you're not performing brightness at all?`,
      positive: `Your safety through warmth hasn't changed — a felt sense that things are fundamentally good, real and lived, was always genuine ground. What's different is that you now let a difficult feeling be visible alongside the warmth, instead of only performing brightness. That fuller honesty is what makes the ground genuinely stable.`,
      negative: `Your safety through warmth is completely real, and it keeps performing for other people's comfort while your own harder feelings go unwitnessed. That performance isn't dishonesty exactly. It's a ground still unaddressed underneath the glow, still waiting for the hard feelings to have somewhere safe to land too.`,
    },

    '20_MUL': {
      heading: `Ground From Answering the Known`,
      why: `Your sense of safety comes from clarity acted on — knowing exactly what needs to change and actually rising to do it, rather than staying in ambiguous preparation. Judgement grounds you through decisive alignment.`,
      shadow: `The risk is that the clarity arrives and gets endlessly deferred, prepared-for instead of acted on, leaving the ground perpetually pending.`,
      path: `Try taking one concrete action toward the calling you've already heard clearly. You are allowed to feel grounded by acting on what you know, not just by knowing it. What is the smallest real step the clarity you already have is asking for?`,
      positive: `Your safety through decisive alignment hasn't changed — clarity acted on, not just known, was always the real ground. What's different is that you now take one concrete action toward the calling you've already heard clearly, instead of staying in preparation. That action is what finally makes the ground solid rather than pending.`,
      negative: `Your safety through clarity is completely real, and it keeps getting deferred for more preparation, understood but never acted on. That deferral isn't caution. It's a ground still pending, still waiting for the smallest real step the clarity has already been asking for.`,
    },

    '21_MUL': {
      heading: `Ground From Letting Things Finish`,
      why: `Your sense of safety comes from completion — real, acknowledged arrival, not another goal appended before the current one gets to count. The World grounds you through genuine closure.`,
      shadow: `The risk is reaching real completion and immediately relativizing it, adding one more condition before it's allowed to actually count as done.`,
      path: `Try letting one already-finished thing in your life actually be named as complete today. You are allowed to feel grounded in genuine arrival. What have you already finished that deserves to be acknowledged as done, not almost?`,
      positive: `Your safety through completion hasn't changed — real, acknowledged arrival, not another goal appended before the current one counts, was always the ground. What's different is that you now let one already-finished thing actually be named as complete. That acknowledgment is what finally gives the ground somewhere solid to rest.`,
      negative: `Your safety through completion is completely real, and it keeps relativizing every finish by adding one more condition before it's allowed to count. That relativizing isn't ambition. It's a ground still permanently unfinished, still waiting for something already accomplished to actually be called done.`,
    },

    '22_MUL': {
      heading: `Ground From Trusting the Leap`,
      why: `Your sense of safety comes, unusually, from openness to the unknown — trusting the flow of life enough that not having a net doesn't feel like danger. The Fool grounds you through faith in your own adaptability.`,
      shadow: `The risk is that the openness becomes recklessness, leaping without any real discernment because the trust in adaptability has slipped into avoiding all preparation.`,
      path: `Try taking one real leap this season while still keeping your eyes open. You are allowed to feel grounded in trust rather than certainty. What would you leap toward if trusting your own adaptability were enough of a plan?`,
      positive: `Your safety through trusting the leap hasn't changed — openness to the unknown, faith in your own adaptability, was always the real, if unusual, ground. What's different is that you now take one real leap this season while still keeping your eyes open. That combination is what turns trust into genuine, lived ground.`,
      negative: `Your safety through openness is completely real, and it keeps tipping into recklessness, leaping without any real discernment because the trust in adaptability slipped into avoiding all preparation. That recklessness isn't faith. It's a ground that never actually forms, still waiting for the leap to be paired with open eyes.`,
    },


    // ── Chakra Map: Swadhisthana, Sacral Chakra (SWA) ───────────────────────

    '1_SWA': {
      heading: `Pleasure in Making Something New`,
      why: `Your creative and sensual energy flows most freely at the start of things — the charge of a fresh idea, a new attraction, an unbuilt possibility. The Magician moves your sacral energy through initiation.`,
      shadow: `The risk is that the pleasure fades exactly when things stop being new, so your emotional flow depends entirely on novelty rather than depth.`,
      path: `Try staying with one pleasure past its newness and noticing what's still there. You are allowed to find delight in something familiar. What familiar pleasure of yours might still have more in it if you actually stayed?`,
      positive: `Your pleasure through beginnings hasn't changed — the charge of a fresh idea, a new attraction, an unbuilt possibility, was always real fuel. What's different is that you now stay with one pleasure past its newness and notice what's still there. That staying is what lets creative flow deepen instead of just restarting.`,
      negative: `Your pleasure through novelty is completely real, and it keeps fading exactly when things stop being new, emotional flow staying shallow because it only moves to the next charge. That fading isn't boredom. It's a pleasure still waiting to be found in something familiar, still untested past its first excitement.`,
    },

    '2_SWA': {
      heading: `Pleasure in the Unspoken`,
      why: `Your creative and sensual energy flows through mystery — attraction and creativity that thrive on what's suggested rather than stated outright. The High Priestess moves your sacral energy through withheld intimacy.`,
      shadow: `The risk is that everything stays so veiled that pleasure never quite gets to fully arrive, mystery becoming distance instead of allure.`,
      path: `Try letting one desire be spoken plainly instead of only implied. You are allowed to enjoy pleasure you've actually named out loud. What longing have you been hinting at that deserves to just be said?`,
      positive: `Your pleasure through mystery hasn't changed — attraction and creativity that thrive on what's suggested rather than stated outright were always real. What's different is that you now let one desire be spoken plainly instead of only implied. That directness is what finally lets the pleasure fully arrive.`,
      negative: `Your pleasure through the unspoken is completely real, and it keeps staying so veiled that it never quite gets to arrive, mystery becoming distance instead of allure. That distance isn't intrigue. It's a pleasure still waiting for one longing to actually be said out loud.`,
    },

    '3_SWA': {
      heading: `Pleasure in Beauty and Abundance`,
      why: `Your creative and sensual energy flows through richness — nurturing, aesthetics, a body and life that feel genuinely fed. The Empress moves your sacral energy through embodied abundance.`,
      shadow: `The risk is that the abundance flows outward only, so you're generous with everyone's pleasure but your own, quietly, goes unattended.`,
      path: `Try including your own senses in the abundance you create for others. You are allowed to receive pleasure, not only produce it for other people. What sensory pleasure have you been offering everyone except yourself?`,
      positive: `Your pleasure through beauty and abundance hasn't changed — nurturing, aesthetics, a body and life that feel genuinely fed, were always real. What's different is that you now include your own senses in the abundance you create for others. That inclusion is what makes the flow genuinely abundant instead of one-directional.`,
      negative: `Your pleasure through abundance is completely real, and it keeps flowing outward only, generous with everyone's pleasure while your own goes quietly unattended. That imbalance isn't generosity working as intended. It's a richness still waiting to include the person creating it.`,
    },

    '4_SWA': {
      heading: `Pleasure in Trusted Control`,
      why: `Your creative and sensual energy flows through structure — knowing the container is sturdy enough to actually relax inside of. The Emperor moves your sacral energy through contained safety.`,
      shadow: `The risk is that the control itself becomes the point, so tightly managed that spontaneous pleasure never gets room to actually happen.`,
      path: `Try loosening your grip on one small pleasure and letting it be unplanned. You are allowed to enjoy something you didn't structure in advance. What would an unplanned pleasure feel like if you actually let it happen?`,
      positive: `Your pleasure through trustworthy control hasn't changed — knowing the container is sturdy enough to actually relax inside of was always real ground. What's different is that you now loosen your grip on one small pleasure and let it be unplanned. That release is what finally lets spontaneous joy arrive.`,
      negative: `Your pleasure through control is completely real, and it keeps managing every pleasure so tightly that the control becomes the point, spontaneity never getting room to happen. That management isn't safety. It's a pleasure still waiting for the grip meant to protect it to actually loosen.`,
    },

    '5_SWA': {
      heading: `Pleasure in Shared Meaning`,
      why: `Your creative and sensual energy flows through belonging to something with real values — creative expression that feels connected to purpose, not indulgence for its own sake. The Hierophant moves your sacral energy through meaningful creation.`,
      shadow: `The risk is that pleasure gets policed so hard by what's 'appropriate' that spontaneous enjoyment rarely survives the filter.`,
      path: `Try letting one pleasure be enjoyed simply because it feels good, without needing to justify its meaning. You are allowed to enjoy something just because it's pleasurable. What delight have you been requiring a justification for?`,
      positive: `Your pleasure through shared meaning hasn't changed — creative expression connected to purpose, not indulgence for its own sake, was always real. What's different is that you now let one pleasure be enjoyed simply because it feels good, without needing to justify its meaning. That permission is what finally lets spontaneous joy through.`,
      negative: `Your pleasure through meaning is completely real, and it keeps policing enjoyment so hard for what's 'appropriate' that spontaneous pleasure rarely survives the filter. That policing isn't discernment. It's a joy still waiting to be allowed without a justification attached.`,
    },

    '6_SWA': {
      heading: `Pleasure in Chosen Connection`,
      why: `Your creative and sensual energy flows through intimacy — genuine attraction and deep bonds, not performance of romance. The Lovers moves your sacral energy through chosen closeness.`,
      shadow: `The risk is confusing intensity with intimacy, chasing the charge of a connection rather than the depth actually available in it.`,
      path: `Try choosing depth over intensity in one connection this week and noticing what that actually feels like. You are allowed to want quiet intimacy more than exciting intensity. Which connection of yours might have more real depth than drama?`,
      positive: `Your pleasure through connection hasn't changed — genuine attraction and deep bonds, not performance of romance, were always what you wanted. What's different is that you now choose depth over intensity in one connection and notice what that actually feels like. That choice is what lets real intimacy flow.`,
      negative: `Your pleasure through connection is completely real, and it keeps confusing intensity with intimacy, chasing the charge of a connection rather than the depth available in it. That chase isn't passion. It's an intimacy still waiting to be chosen over drama.`,
    },

    '7_SWA': {
      heading: `Pleasure in Winning Forward`,
      why: `Your creative and sensual energy flows through achievement and motion — pleasure tied to victory, progress, actually getting somewhere. The Chariot moves your sacral energy through forward drive.`,
      shadow: `The risk is that pleasure only registers when you're winning, so ordinary, undramatic enjoyment barely counts as real to you.`,
      path: `Try enjoying one small, undramatic pleasure today without it needing to be a victory. You are allowed to feel good about something that isn't a win. What quiet, ordinary pleasure have you been dismissing as too small to count?`,
      positive: `Your pleasure through achievement hasn't changed — pleasure tied to victory, progress, actually getting somewhere, was always real fuel. What's different is that you now enjoy one small, undramatic pleasure without it needing to be a win. That shift lets ordinary joy actually register as real.`,
      negative: `Your pleasure through winning is completely real, and it keeps registering only when you're ahead, ordinary undramatic enjoyment barely counting. That filter isn't ambition. It's a pleasure still waiting for something small and quiet to be allowed to count.`,
    },

    '8_SWA': {
      heading: `Pleasure in Fairness`,
      why: `Your creative and sensual energy flows through balance — pleasure that feels earned and evenly distributed, not taken at someone else's expense. Justice moves your sacral energy through equitable exchange.`,
      shadow: `The risk is that you monitor fairness so closely you can't actually relax into pleasure without auditing whether you deserve it.`,
      path: `Try enjoying one pleasure today without checking whether it's been earned first. You are allowed to enjoy something simply because it feels good, not because you've calculated you deserve it. What pleasure have you been withholding pending an audit that isn't actually required?`,
      positive: `Your pleasure through fairness hasn't changed — pleasure that feels earned and evenly distributed, not taken at anyone's expense, was always what you wanted. What's different is that you now enjoy one pleasure without first auditing whether it's been earned. That release is what finally lets joy flow freely.`,
      negative: `Your pleasure through balance is completely real, and it keeps monitoring fairness so closely that relaxing into enjoyment requires an audit first. That auditing isn't integrity. It's a pleasure still on hold, still waiting to be allowed without a deserving-calculation attached.`,
    },

    '9_SWA': {
      heading: `Pleasure Found Alone`,
      why: `Your creative and sensual energy flows through solitude — real satisfaction found in your own inner world, not dependent on company. The Hermit moves your sacral energy through private depth.`,
      shadow: `The risk is that the solitude becomes so complete that shared pleasure, the kind that actually requires another person, gets avoided entirely.`,
      path: `Try letting one pleasure be shared rather than solitary this week. You are allowed to enjoy connection, not only depth found alone. What pleasure have you been keeping solitary that could actually be shared?`,
      positive: `Your pleasure through solitude hasn't changed — real satisfaction found in your own inner world, not dependent on company, was always genuine. What's different is that you now let one pleasure be shared rather than kept solitary. That sharing lets your sacral energy include connection alongside depth.`,
      negative: `Your pleasure through solitude is completely real, and it keeps staying so complete that shared pleasure gets avoided entirely. That avoidance isn't self-sufficiency. It's half of sacral energy still waiting to be tapped through someone else.`,
    },

    '10_SWA': {
      heading: `Pleasure in Trusted Waves`,
      why: `Your creative and sensual energy flows in cycles — periods of real abundance and enjoyment, followed by quieter stretches that are just as legitimate. The Wheel of Fortune moves your sacral energy through rhythm.`,
      shadow: `The risk is fighting the quiet stretches as though they were failures of pleasure, rather than trusting the rhythm to bring the fuller stretch back around.`,
      path: `Try meeting your current quiet stretch with patience instead of alarm. You are allowed to feel low pleasure sometimes without it being a crisis. What would it feel like to trust that this quiet season is simply a phase, not a verdict?`,
      positive: `Your pleasure through rhythm hasn't changed — periods of real abundance and enjoyment followed by quieter, equally legitimate stretches, was always the true cycle. What's different is that you now meet a current quiet stretch with patience instead of alarm. That trust lets the rhythm keep flowing instead of getting fought.`,
      negative: `Your pleasure through rhythm is completely real, and it keeps fighting the quiet stretches as though they were failures. That fighting isn't vigilance. It's a rhythm still waiting to be trusted to bring the fuller stretch back around on its own.`,
    },

    '11_SWA': {
      heading: `Pleasure Without Applause`,
      why: `Your creative and sensual energy flows through quiet resilience — a body and spirit that can hold real intensity without needing anyone to witness it. Strength moves your sacral energy through unshowy staying power.`,
      shadow: `The risk is performing that endurance for an audience, turning private resilience into something that needs external confirmation to feel real.`,
      path: `Try letting your resilience be unwitnessed today and trusting it's still real. You are allowed to feel good about your own staying power with no one watching. What would it feel like to be resilient with absolutely no audience?`,
      positive: `Your pleasure through endurance hasn't changed — a body and spirit that can hold real intensity without needing anyone to witness it, was always real strength. What's different is that you now let your resilience be unwitnessed today and trust it anyway. That privacy makes the pleasure genuinely yours.`,
      negative: `Your pleasure through endurance is completely real, and it keeps performing that endurance for an audience, needing external confirmation to feel real. That performing isn't strength. It's a pleasure still waiting to stand on its own with no one watching.`,
    },

    '12_SWA': {
      heading: `Pleasure in Letting Go of Control`,
      why: `Your creative and sensual energy flows best when you stop directing it — pleasure that arrives through release rather than management. The Hanged Man moves your sacral energy through letting go.`,
      shadow: `The risk is that the surrender turns into passivity, waiting indefinitely for pleasure to arrive rather than actually meeting it halfway.`,
      path: `Try releasing your grip on one specific outcome today and noticing what pleasure actually shows up. You are allowed to enjoy what arrives without controlling its shape. What might you feel if you stopped directing exactly how the pleasure has to go?`,
      positive: `Your pleasure through surrender hasn't changed — pleasure that arrives through release rather than management, once you stop directing it, was always real. What's different is that you now release your grip on one specific outcome and notice what pleasure actually shows up. That release is what finally lets it land.`,
      negative: `Your pleasure through surrender is completely real, and it keeps turning into passivity, waiting indefinitely instead of actually meeting pleasure halfway. That waiting isn't letting go. It's a flow still waiting for engagement to meet the release.`,
    },

    '13_SWA': {
      heading: `Pleasure Past Old Desire`,
      why: `Your creative and sensual energy flows through real transformation — letting an old want or old identity actually end so a truer one can take its place. Transformation moves your sacral energy through renewal.`,
      shadow: `The risk is clinging to an old source of pleasure well past its natural life, because ending it feels like losing access to joy altogether.`,
      path: `Try letting one outdated pleasure or desire actually complete its ending. You are allowed to let an old joy go so a truer one can arrive. What pleasure from an earlier chapter is your heart quietly finished with?`,
      positive: `Your pleasure through transformation hasn't changed — letting an old want or identity actually end so a truer one can take its place, was always real growth. What's different is that you now let one outdated pleasure or desire actually complete its ending. That release makes room for the truer joy.`,
      negative: `Your pleasure through transformation is completely real, and it keeps clinging to an old source past its natural life, ending feeling like losing access to joy altogether. That clinging isn't loyalty. It's a truer joy still waiting for the old one to finally be let go.`,
    },

    '14_SWA': {
      heading: `Pleasure in Real Blending`,
      why: `Your creative and sensual energy flows through actual integration — indulgence and discipline working together, not taking turns. Temperance moves your sacral energy through real balance.`,
      shadow: `The risk is swinging hard between full indulgence and total restriction, mistaking the alternation for the balance that was actually being asked for.`,
      path: `Try finding one small, genuinely blended pleasure today instead of choosing an extreme. You are allowed to want moderate, sustainable enjoyment, not just intense swings. What would a blended, sustainable pleasure actually look like this week?`,
      positive: `Your pleasure through balance hasn't changed — indulgence and discipline actually working together, not taking turns, was always the real goal. What's different is that you now find one small, genuinely blended pleasure instead of choosing an extreme. That integration finally produces sustainable enjoyment.`,
      negative: `Your pleasure through moderation is completely real, and it keeps swinging hard between full indulgence and total restriction, mistaking the alternation for balance. That swinging isn't temperance. It's a sustainable pleasure still waiting for real blending instead of taking turns.`,
    },

    '15_SWA': {
      heading: `Pleasure in Naming Desire`,
      why: `Your creative and sensual energy flows through honest confrontation with desire — real pleasure available once the craving is actually examined instead of denied. The Devil moves your sacral energy through reckoning.`,
      shadow: `The risk is either denying the desire entirely or chasing it so unconsciously that pleasure curdles into compulsion.`,
      path: `Try naming one real desire honestly, without judgment, and choosing consciously whether to pursue it. You are allowed to want pleasure and examine it at the same time. What craving have you been either denying or chasing on autopilot?`,
      positive: `Your pleasure through honest reckoning hasn't changed — real pleasure available once a craving is actually examined instead of denied, was always the path. What's different is that you now name one real desire honestly, without judgment, and choose consciously whether to pursue it. That awareness turns compulsion back into pleasure.`,
      negative: `Your pleasure through desire is completely real, and it keeps either being denied entirely or chased so unconsciously it curdles into compulsion. That extreme isn't honesty. It's a pleasure still waiting for the middle path of conscious, examined wanting.`,
    },

    '16_SWA': {
      heading: `Pleasure After Collapse`,
      why: `Your creative and sensual energy flows through renewal after upheaval — real pleasure rediscovered once an old structure has actually fallen and been rebuilt. The Tower moves your sacral energy through disruption and rebirth.`,
      shadow: `The risk is fearing pleasure itself after a collapse, treating enjoyment as risky because the last collapse arrived unannounced.`,
      path: `Try letting yourself enjoy one small thing today without waiting for proof it's safe. You are allowed to feel pleasure again after upheaval, without needing a guarantee first. What small joy have you been withholding until you feel fully safe again?`,
      positive: `Your pleasure through rebuilding hasn't changed — real pleasure rediscovered once an old structure has actually fallen and been rebuilt, was always available. What's different is that you now let yourself enjoy one small thing today without waiting for proof it's safe. That willingness lets real enjoyment return.`,
      negative: `Your pleasure through renewal is completely real, and it keeps fearing pleasure itself after a collapse, treating enjoyment as risky because the last one arrived unannounced. That fear isn't caution anymore. It's a joy still waiting to be trusted after the rebuilding has already happened.`,
    },

    '17_SWA': {
      heading: `Pleasure in Hope and Inspiration`,
      why: `Your creative and sensual energy flows through inspired hope — real joy found in making, dreaming, and believing in a better version of things. The Star moves your sacral energy through creative faith.`,
      shadow: `The risk is keeping that creative joy modest and private, as if letting it be seen fully would be too much or too naive.`,
      path: `Try letting one piece of your creative joy be visible today, at full size. You are allowed to enjoy your own inspiration in front of other people. What creative pleasure have you been keeping smaller than it actually is?`,
      positive: `Your pleasure through inspired hope hasn't changed — real joy found in making, dreaming, and believing in a better version of things, was always genuine. What's different is that you now let one piece of your creative joy be visible today, at full size. That visibility lets the pleasure be fully shared.`,
      negative: `Your pleasure through creative hope is completely real, and it keeps staying modest and private, as if being seen fully would be too much. That smallness isn't humility. It's a joy still waiting for the full, shared expression it was actually built for.`,
    },

    '18_SWA': {
      heading: `Pleasure Beyond Explanation`,
      why: `Your creative and sensual energy flows through the mysterious and the felt — pleasure connected to dreams, intuition, art that touches something beneath the surface. The Moon moves your sacral energy through enchantment.`,
      shadow: `The risk is that the mystery curdles into anxious uncertainty, so pleasure gets tangled up with unease instead of staying genuinely enchanting.`,
      path: `Try letting one mysterious pleasure just be enjoyed, without needing to fully explain or resolve it. You are allowed to enjoy something you can't fully articulate. What pleasure have you been over-analyzing instead of simply feeling?`,
      positive: `Your pleasure through mystery hasn't changed — pleasure connected to dreams, intuition, art that touches something beneath the surface, was always real enchantment. What's different is that you now let one mysterious pleasure just be enjoyed, without needing to fully explain it. That trust keeps the enchantment from curdling into anxiety.`,
      negative: `Your pleasure through the mysterious is completely real, and it keeps curdling into anxious uncertainty, tangled up with unease instead of staying enchanting. That unease isn't insight. It's a pleasure still waiting to simply be felt instead of resolved.`,
    },

    '19_SWA': {
      heading: `Pleasure, Visible and Open`,
      why: `Your creative and sensual energy flows through unguarded happiness — pleasure expressed fully and openly, not managed for anyone else's comfort. The Sun moves your sacral energy through radiant, shared delight.`,
      shadow: `The risk is performing lightness while your deeper pleasure stays private and unexpressed, as if full joy would be too much for the room.`,
      path: `Try letting one piece of real joy show at full volume today. You are allowed to enjoy something without dimming it for anyone else's comfort. What happiness have you been quietly managing down to something more acceptable?`,
      positive: `Your pleasure through open joy hasn't changed — pleasure expressed fully and openly, not managed for anyone else's comfort, was always the real gift. What's different is that you now let one piece of real joy show at full volume today. That openness lets your pleasure be genuinely shared.`,
      negative: `Your pleasure through radiance is completely real, and it keeps performing lightness while the deeper pleasure stays private and unexpressed. That performance isn't happiness. It's a joy still waiting to be let out at its actual brightness.`,
    },

    '20_SWA': {
      heading: `Pleasure in Answering the Call`,
      why: `Your creative and sensual energy flows through aligned action — real pleasure found in finally doing the thing you've sensed you should do for a while. Judgement moves your sacral energy through responsive alignment.`,
      shadow: `The risk is sensing the call clearly and still finding reasons to delay acting on it, leaving the pleasure of alignment permanently just out of reach.`,
      path: `Try taking one concrete step toward what you already feel called to enjoy or create. You are allowed to feel pleasure in finally answering a call you've been sensing. What creative or sensual calling have you been delaying acting on?`,
      positive: `Your pleasure through answering the call hasn't changed — real pleasure found in finally doing what you've sensed you should do, was always available. What's different is that you now take one concrete step toward what you already feel called to enjoy or create. That action is exactly the pleasure of alignment.`,
      negative: `Your pleasure through aligned action is completely real, and it keeps sensing the call clearly while finding reasons to delay acting on it. That delay isn't preparation. It's a pleasure of alignment still waiting just out of reach.`,
    },

    '21_SWA': {
      heading: `Pleasure in Feeling Complete`,
      why: `Your creative and sensual energy flows through real integration and arrival — pleasure that comes from a felt sense of wholeness, not another unmet want appended to the list. The World moves your sacral energy through fulfillment.`,
      shadow: `The risk is reaching a genuinely fulfilling moment and immediately looking for the next thing, never quite letting the completion register as pleasure in itself.`,
      path: `Try letting one already-fulfilling moment today actually be felt as enough. You are allowed to feel pleasure in completion, not only in pursuit. What moment of genuine fulfillment have you rushed past without actually feeling it?`,
      positive: `Your pleasure through completion hasn't changed — a felt sense of wholeness, not another unmet want appended to the list, was always what you were reaching for. What's different is that you now let one already-fulfilling moment actually be felt as enough. That felt completion is exactly the pleasure you were asking for.`,
      negative: `Your pleasure through fulfillment is completely real, and it keeps reaching a genuinely fulfilling moment only to immediately look for the next thing. That reaching isn't ambition. It's a completion still waiting to actually register as pleasure in itself.`,
    },

    '22_SWA': {
      heading: `Pleasure in Trusting Without a Net`,
      why: `Your creative and sensual energy flows through openness to the unknown — real joy found in spontaneity, new experience, and trusting the flow without needing certainty first. The Fool moves your sacral energy through faithful adventure.`,
      shadow: `The risk is that the openness turns into recklessness, chasing every new sensation without any real discernment about what actually nourishes you.`,
      path: `Try taking one real, spontaneous pleasure this month, chosen with open eyes rather than pure impulse. You are allowed to enjoy adventure and still exercise real discernment. What spontaneous joy would you choose if you trusted your own judgment enough to pick it consciously?`,
      positive: `Your pleasure through trust and openness hasn't changed — real joy found in spontaneity, new experience, trusting the flow without needing certainty first, was always genuine. What's different is that you now take one real, spontaneous pleasure this month, chosen with open eyes rather than pure impulse. That discernment makes the adventure genuinely nourishing.`,
      negative: `Your pleasure through openness is completely real, and it keeps chasing every new sensation without any real discernment about what actually nourishes you. That chasing isn't adventure. It's a nourishing joy still waiting for open eyes instead of pure impulse.`,
    },


    // ── Yearly Energy Forecast (YE) — the one time-varying position ─────────

    '1_YE': {
      heading: `A Season for Beginning`,
      why: `This stretch of your life is carrying Magician energy — a season built for starting things, not for finishing what's already comfortable. Whatever's been sitting half-formed in your mind may be more ready than you've been treating it as.`,
      shadow: `The risk this season is starting five things and staying with none of them, mistaking the charge of a new idea for evidence it's actually the right one.`,
      path: `Try picking one beginning and actually following it past its first exciting week. You are allowed to begin before you feel fully ready. What has this season been quietly nudging you to finally start?`,
      positive: `This season's charge to begin hasn't changed — a stretch built for starting things, not finishing what's already comfortable, was always the invitation. What's different is that you now pick one beginning and actually follow it past its first exciting week. That follow-through is what this chapter was asking of you.`,
      negative: `This season's push to begin is completely real, and it keeps producing five starts and no finishes, the charge of a new idea mistaken for evidence it's the right one. That scattering isn't ambition. It's a chapter still waiting for one beginning to actually be carried past its first week.`,
    },

    '2_YE': {
      heading: `A Season to Trust the Sense`,
      why: `This stretch of your life is carrying High Priestess energy — a season for listening inward rather than gathering more outside opinions. Whatever quiet certainty you've been sitting on may be more trustworthy right now than it usually gets credit for.`,
      shadow: `The risk this season is staying so private with your knowing that it never actually gets tested or acted on.`,
      path: `Try acting on one inner certainty this month before you can fully justify it to anyone else. You are allowed to trust what you sense before you can explain it. What has your intuition been quietly telling you during this stretch?`,
      positive: `This season's invitation to trust what you sense hasn't changed — listening inward rather than gathering outside opinions was always the real work. What's different is that you now act on one inner certainty before you can fully justify it to anyone else. That action is what the chapter was asking for.`,
      negative: `This season's quiet certainty is completely real, and it keeps staying so private it's never tested or acted on. That privacy isn't discretion. It's a knowing still waiting to prove itself, still unacted-on through the whole stretch.`,
    },

    '3_YE': {
      heading: `A Season for Growth`,
      why: `This stretch of your life is carrying Empress energy — a season built for nurturing, abundance, and letting something take its natural time to develop. Whatever you've been tending may be closer to bearing fruit than it looks.`,
      shadow: `The risk this season is rushing the growth, or pouring so much outward that your own reserves quietly run thin.`,
      path: `Try tending one thing patiently this season without forcing its pace, and make sure you're included in what gets nurtured. You are allowed to grow slowly and still be growing. What has been quietly developing during this stretch that deserves more patience?`,
      positive: `This season's invitation to let something grow hasn't changed — nurturing, abundance, natural timing were always the real offer. What's different is that you now tend one thing patiently without forcing its pace, and make sure you're included in what gets nurtured. That patience is exactly what this season rewards.`,
      negative: `This season's growth is completely real, and it keeps getting rushed, or poured outward until your own reserves run thin. That depletion isn't generosity. It's an abundance still waiting for its own natural pace, and for you to be included in it.`,
    },

    '4_YE': {
      heading: `A Season for Building Sturdy`,
      why: `This stretch of your life is carrying Emperor energy — a season for establishing real structure, not just holding things together improvised. Whatever system or foundation you've been meaning to formalize may finally have the conditions to actually hold.`,
      shadow: `The risk this season is gripping control so tightly that the structure becomes a burden rather than support.`,
      path: `Try building one piece of real, durable structure this season and then letting it hold without your constant oversight. You are allowed to build steadiness without needing to control everything within it. What foundation is this season asking you to finally make solid?`,
      positive: `This season's call to build hasn't changed — real structure, not improvised holding-together, was always the invitation. What's different is that you now build one piece of durable structure and let it hold without constant oversight. That steadiness is exactly what this chapter was making possible.`,
      negative: `This season's push toward structure is completely real, and it keeps gripping control so tightly the structure becomes a burden. That gripping isn't diligence. It's a stability still waiting to be trusted instead of managed.`,
    },

    '5_YE': {
      heading: `A Season to Learn or Teach`,
      why: `This stretch of your life is carrying Hierophant energy — a season for engaging seriously with tradition, mentorship, or a body of real knowledge, in whichever direction it moves for you. Whatever teaching or learning has been calling may be especially available right now.`,
      shadow: `The risk this season is treating the knowledge as something to collect rather than something to actually apply and pass on.`,
      path: `Try either learning one thing deeply or teaching one thing you already know, fully, this season. You are allowed to take guidance seriously without losing your own authority. What real knowledge is this stretch of life asking you to either receive or pass forward?`,
      positive: `This season's call to learn or teach hasn't changed — serious engagement with real knowledge, in whichever direction it moves for you, was always the offer. What's different is that you now either learn one thing deeply or teach one thing you already know, fully. That engagement is exactly what the chapter makes possible.`,
      negative: `This season's knowledge is completely real, and it keeps getting collected rather than applied or passed on. That collecting isn't learning. It's a transmission still waiting to actually move, in either direction, before the season closes.`,
    },

    '6_YE': {
      heading: `A Season to Choose, Not Feel`,
      why: `This stretch of your life is carrying Lovers energy — a season for making a real, examined choice about a relationship or a value, rather than drifting along an existing arrangement. Whatever connection has been asking for a decision may finally have the clarity to make one.`,
      shadow: `The risk this season is going through the motions of a choice you've actually already made by default, without ever consciously reclaiming it.`,
      path: `Try naming, out loud, one choice you've been making silently by default. You are allowed to choose deliberately what you've been accepting by habit. What relationship or value is this season asking you to actually choose rather than just continue?`,
      positive: `This season's push toward real choice hasn't changed — an examined decision about a relationship or value, not drifting along an existing arrangement, was always the invitation. What's different is that you now name, out loud, one choice you've been making silently by default. That ownership is exactly what the chapter was asking for.`,
      negative: `This season's clarity is completely real, and it keeps going through the motions of a choice already made by default, never consciously reclaimed. That drift isn't commitment. It's a clarity still waiting to be spoken out loud.`,
    },

    '7_YE': {
      heading: `A Season for Moving Forward`,
      why: `This stretch of your life is carrying Chariot energy — a season for directed momentum, not just staying busy. Whatever goal you've been circling may finally have real traction available if you actually aim at it.`,
      shadow: `The risk this season is moving hard without checking the direction, mistaking speed itself for progress.`,
      path: `Try naming one specific destination this season and aiming your current momentum at it deliberately. You are allowed to slow down just long enough to steer. What direction is this stretch of life actually asking your drive to move toward?`,
      positive: `This season's momentum hasn't changed — directed drive, not just staying busy, was always the real fuel. What's different is that you now name one specific destination and aim your current momentum at it deliberately. That direction is what lets this season's drive actually arrive somewhere.`,
      negative: `This season's drive is completely real, and it keeps moving hard without checking the direction, mistaking speed itself for progress. That speed isn't progress. It's a season's momentum still waiting for a destination to actually aim at.`,
    },

    '8_YE': {
      heading: `A Season to Set It Right`,
      why: `This stretch of your life is carrying Justice energy — a season for addressing an imbalance honestly, including one closer to home than you'd usually look. Whatever fairness question has been sitting unresolved may finally have the conditions to actually be settled.`,
      shadow: `The risk this season is applying that clarity outward only, auditing everyone else while your own conduct goes unexamined.`,
      path: `Try applying the same fair standard to yourself that you'd apply to anyone else, once, this season. You are allowed to receive the same fairness you extend to others. What imbalance is this stretch of life actually asking you to set right?`,
      positive: `This season's call for fairness hasn't changed — addressing an imbalance honestly, including one close to home, was always the real invitation. What's different is that you now apply the same fair standard to yourself that you'd apply to anyone else. That evenness is exactly what this season was asking you to settle.`,
      negative: `This season's clarity about fairness is completely real, and it keeps applying that clarity outward only, auditing everyone else while your own conduct goes unexamined. That one-sidedness isn't integrity. It's a season's real invitation still untouched.`,
    },

    '9_YE': {
      heading: `A Season Turned Inward`,
      why: `This stretch of your life is carrying Hermit energy — a season for withdrawal and depth, not constant availability to everyone else. Whatever understanding you've been circling may finally have room to actually settle if you give it real solitude.`,
      shadow: `The risk this season is staying in the withdrawal past its purpose, gathering depth that never gets carried back out.`,
      path: `Try taking real, chosen solitude this season, and then bringing back one thing you learn there to share. You are allowed to withdraw for a while and still plan to return. What understanding is this stretch of life asking you to sit with alone before you offer it to anyone?`,
      positive: `This season's pull inward hasn't changed — withdrawal and depth, not constant availability to everyone else, was always the real need. What's different is that you now take real, chosen solitude and bring back one thing you learn there to share. That return is exactly what this season's depth was for.`,
      negative: `This season's solitude is completely real, and it keeps outlasting its purpose, gathering depth that never gets carried back out. That overstaying isn't rest. It's an understanding still waiting to be returned to someone.`,
    },

    '10_YE': {
      heading: `A Season of Turning`,
      why: `This stretch of your life is carrying Wheel of Fortune energy — a season of genuine turning, where trusting the timing matters more than forcing an outcome. Whatever's currently shifting may be exactly on schedule, even if it doesn't feel that way.`,
      shadow: `The risk this season is treating a normal turn as a crisis, either bracing hard against a downturn or refusing to trust an upswing.`,
      path: `Try meeting whatever's currently turning — up or down — with curiosity instead of alarm. You are allowed to trust the timing even mid-turn. What is this season's turning actually clearing space for?`,
      positive: `This season's turning hasn't changed — genuine cyclical movement, timing that matters more than forcing an outcome, was always what was happening. What's different is that you now meet whatever's currently turning, up or down, with curiosity instead of alarm. That trust lets the cycle actually complete on its own timing.`,
      negative: `This season's turning is completely real, and it keeps getting treated as a crisis, braced against or refused instead of trusted. That bracing isn't caution. It's a cycle still waiting to be met with curiosity instead of alarm.`,
    },

    '11_YE': {
      heading: `A Season of Quiet Endurance`,
      why: `This stretch of your life is carrying Strength energy — a season for holding steady through real pressure, gently rather than by force. Whatever's currently demanding your resilience may be exactly the kind of test this quieter strength is built for.`,
      shadow: `The risk this season is performing unbreakability for an audience rather than simply, privately, holding steady.`,
      path: `Try letting your endurance be private this season and trusting it doesn't need to be witnessed to be real. You are allowed to be resilient without anyone seeing it. What is this stretch of life quietly asking you to hold with gentleness instead of force?`,
      positive: `This season's demand for endurance hasn't changed — holding steady through real pressure, gently rather than by force, was always the ask. What's different is that you now let your endurance be private and trust it doesn't need to be witnessed. That quiet holding is exactly what this season calls for.`,
      negative: `This season's resilience is completely real, and it keeps performing unbreakability for an audience rather than simply, privately holding steady. That performance isn't strength. It's an endurance still waiting to be trusted without being seen.`,
    },

    '12_YE': {
      heading: `A Season for a Real Pause`,
      why: `This stretch of your life is carrying Hanged Man energy — a season for suspension that's actually doing work, not stalling. Whatever's currently on hold may be gathering exactly the perspective it needs before it can move again.`,
      shadow: `The risk this season is mistaking every pause for permission to avoid a decision indefinitely.`,
      path: `Try checking whether your current pause is still teaching you something or has quietly become avoidance. You are allowed to stay in the pause a while longer if the view is still changing. What is this season's suspension actually showing you that standing still never could?`,
      positive: `This season's suspension hasn't changed — a pause actually doing work, not stalling, was always what was happening. What's different is that you now check whether the pause is still teaching you something or has quietly become avoidance. That check is exactly what lets the patience finish its real work.`,
      negative: `This season's pause is completely real, and it keeps being mistaken for permission to avoid a decision indefinitely. That avoidance isn't patience. It's a suspension still waiting to be checked for whether the view is still changing.`,
    },

    '13_YE': {
      heading: `A Season for an Ending`,
      why: `This stretch of your life is carrying Transformation energy — a season for a real ending, not a patched-over version of the same old thing. Whatever identity or arrangement has quietly run its course may finally have the conditions to actually complete.`,
      shadow: `The risk this season is rushing the ending to avoid discomfort, or refusing to let it happen at all.`,
      path: `Try naming one thing that's actually ready to end and letting it complete at its own pace. You are allowed to let something die so something truer can begin. What is this stretch of life asking you to finally let go of?`,
      positive: `This season's ending hasn't changed — a real completion, not a patched-over version of the same old thing, was always what was ready. What's different is that you now name one thing actually ready to end and let it complete at its own pace. That completion makes room for this season's renewal.`,
      negative: `This season's ending is completely real, and it keeps getting rushed to avoid discomfort, or refused outright. That refusal isn't loyalty. It's a renewal still blocked, still waiting for the ending it needs.`,
    },

    '14_YE': {
      heading: `A Season for Real Balance`,
      why: `This stretch of your life is carrying Temperance energy — a season for genuine integration between two things you've been treating as opposites. Whatever you've been alternating between may actually be ready to work together.`,
      shadow: `The risk this season is swinging hard between extremes and calling the alternation balance.`,
      path: `Try finding one small, actually blended version of two things you've been keeping separate. You are allowed to combine things slowly instead of choosing one extreme. What two parts of your life is this season asking you to finally integrate?`,
      positive: `This season's balance hasn't changed — genuine integration between two things treated as opposites was always the real invitation. What's different is that you now find one small, actually blended version of two things you've been keeping separate. That blend is exactly what this season's balance was asking for.`,
      negative: `This season's push toward balance is completely real, and it keeps swinging hard between extremes and calling the alternation balance. That swinging isn't integration. It's a season's real invitation still unanswered.`,
    },

    '15_YE': {
      heading: `A Season to Face the Pull`,
      why: `This stretch of your life is carrying Devil energy — a season for facing a compulsion or attachment honestly, rather than pretending it isn't there. Whatever pull has been quietly running things may finally be visible enough to actually examine.`,
      shadow: `The risk this season is denying the pull entirely, which only tightens its grip.`,
      path: `Try naming one real compulsion or attachment honestly, without shame, this season. You are allowed to examine the pull without judging yourself for having it. What is this stretch of life asking you to finally look at directly?`,
      positive: `This season's reckoning hasn't changed — facing a compulsion or attachment honestly, rather than pretending it isn't there, was always the invitation. What's different is that you now name one real compulsion or attachment honestly, without shame. That honesty is exactly what loosens its grip this season.`,
      negative: `This season's pull is completely real, and it keeps being denied, which only tightens its grip. That denial isn't peace. It's a pull still waiting to be looked at directly instead of avoided.`,
    },

    '16_YE': {
      heading: `A Season Rebuilding From the Fall`,
      why: `This stretch of your life is carrying Tower energy — a season of real collapse followed by real rebuilding, on more honest ground. Whatever's currently falling apart may have needed to, in order to make room for something sturdier.`,
      shadow: `The risk this season is defending a structure you already suspect isn't sound, just to avoid the collapse.`,
      path: `Try letting one shaky structure fall on its own terms instead of propping it up further. You are allowed to rebuild on more honest ground. What is this season asking you to stop defending so it can actually be rebuilt properly?`,
      positive: `This season's disruption hasn't changed — real collapse followed by real rebuilding, on more honest ground, was always what was happening. What's different is that you now let one shaky structure fall on its own terms instead of propping it up further. That willingness is exactly what this season's disruption was for.`,
      negative: `This season's collapse is completely real, and it keeps getting propped up out of fear of the fall. That propping isn't stability. It's a rebuilding still delayed, still waiting for the honest ground underneath.`,
    },

    '17_YE': {
      heading: `A Season to Hope at Full Size`,
      why: `This stretch of your life is carrying Star energy — a season for real, visible hope, not a modest, private version of it. Whatever faith you've been keeping small may be ready to actually take up its full space.`,
      shadow: `The risk this season is keeping that hope quiet and shrunken, as if believing too openly would be tempting fate.`,
      path: `Try letting one hope be as large and visible as it actually is this season. You are allowed to hope at full size. What hope has this stretch of life been asking you to stop shrinking?`,
      positive: `This season's hope hasn't changed — real, visible hope, not a modest private version of it, was always the invitation. What's different is that you now let one hope be as large and visible as it actually is. That full size is exactly what this season was making room for.`,
      negative: `This season's faith is completely real, and it keeps staying quiet and shrunken, as if believing openly would be tempting fate. That shrinking isn't caution. It's a hope still waiting for the room this season was actually offering.`,
    },

    '18_YE': {
      heading: `A Season to Trust the Unexplained`,
      why: `This stretch of your life is carrying Moon energy — a season for trusting an undercurrent before it's fully provable. Whatever feeling has been running beneath the surface may be worth taking seriously right now, even unverified.`,
      shadow: `The risk this season is letting that feeling curdle into anxious story instead of staying a genuine, worth-checking signal.`,
      path: `Try holding one strong feeling as real information this season, and checking it gently against what's actually happening. You are allowed to trust what you sense before you can explain it. What undercurrent is this stretch of life asking you to take seriously?`,
      positive: `This season's undercurrent hasn't changed — trusting a feeling before it's fully provable was always what was being asked. What's different is that you now hold one strong feeling as real information and check it gently against what's actually happening. That trust is exactly what this season's intuition was for.`,
      negative: `This season's feeling is completely real, and it keeps running unchecked, curdling into anxious story instead of staying a genuine signal. That anxiety isn't insight. It's an undercurrent still waiting to be checked, not just felt.`,
    },

    '19_YE': {
      heading: `A Season for Visible Joy`,
      why: `This stretch of your life is carrying Sun energy — a season for real, open happiness, not a managed or modest version of it. Whatever delight has been available may be more ready to be lived out loud than you've been letting it.`,
      shadow: `The risk this season is dimming the joy for other people's comfort, keeping it smaller than it actually is.`,
      path: `Try letting one real joy show at its full size this season, without managing it down. You are allowed to be openly happy without apologizing for it. What delight has this season been offering that you've been quietly dimming?`,
      positive: `This season's joy hasn't changed — real, open happiness, not a managed or modest version of it, was always available. What's different is that you now let one real joy show at its full size, without managing it down. That openness is exactly what this season's brightness was for.`,
      negative: `This season's happiness is completely real, and it keeps being dimmed for other people's comfort, kept smaller than it actually is. That dimming isn't consideration. It's a brightness still waiting to be let out at its real size.`,
    },

    '20_YE': {
      heading: `A Season to Answer the Call`,
      why: `This stretch of your life is carrying Judgement energy — a season for actually rising to something you've already heard clearly, rather than continuing to prepare for it indefinitely. Whatever summons has been sitting with you may finally have the conditions to be answered.`,
      shadow: `The risk this season is hearing the calling clearly and still finding sophisticated reasons to keep waiting.`,
      path: `Try taking one concrete step toward the calling you've already heard, this season, without waiting to feel fully ready. You are allowed to rise before you feel prepared. What is this stretch of life asking you to finally answer?`,
      positive: `This season's calling hasn't changed — actually rising to something already heard clearly, rather than preparing for it indefinitely, was always the invitation. What's different is that you now take one concrete step toward the calling without waiting to feel fully ready. That responsiveness is exactly what this season was for.`,
      negative: `This season's summons is completely real, and it keeps being heard clearly while sophisticated reasons for waiting pile up. That waiting isn't preparation. It's a season's real invitation still unanswered.`,
    },

    '21_YE': {
      heading: `A Season to Call It Finished`,
      why: `This stretch of your life is carrying World energy — a season for genuine completion, not another condition appended before something is allowed to count as done. Whatever you've already achieved may deserve to actually be named as arrived.`,
      shadow: `The risk this season is reaching real completion and immediately relativizing it, finding a reason it doesn't quite count yet.`,
      path: `Try letting one already-finished thing in your life actually be called complete this season. You are allowed to call it finished and mean it. What have you already accomplished that deserves to be named as done, not almost?`,
      positive: `This season's completion hasn't changed — genuine arrival, not another condition appended before something counts as done, was always the invitation. What's different is that you now let one already-finished thing actually be called complete. That acknowledgment is exactly what this season's arrival was for.`,
      negative: `This season's arrival is completely real, and it keeps getting relativized, a reason found for why it doesn't quite count yet. That relativizing isn't humility. It's a season's real invitation toward completion still unanswered.`,
    },

    '22_YE': {
      heading: `A Season for One Real Leap`,
      why: `This stretch of your life is carrying Fool energy — a season for beginning something with open eyes, trusting the unknown rather than waiting for full certainty. Whatever leap has been waiting for permission may have exactly the conditions it needs right now.`,
      shadow: `The risk this season is inheriting caution instead of the boldness, letting an old fear override a genuinely good opportunity in front of you.`,
      path: `Try taking one real leap this season, with your eyes open, rather than waiting for a guarantee that isn't coming. You are allowed to leap with open eyes and still call it wisdom. What would you begin this season if trust in the unknown were reason enough?`,
      positive: `This season's leap hasn't changed — beginning something with open eyes, trusting the unknown rather than waiting for full certainty, was always the invitation. What's different is that you now take one real leap, with your eyes open, rather than waiting for a guarantee that isn't coming. That courage is exactly what this season was making possible.`,
      negative: `This season's opportunity is completely real, and it keeps waiting on a guarantee that was never going to arrive, old caution overriding a genuinely good opening. That waiting isn't wisdom. It's a leap still unclaimed, still waiting for open eyes instead of certainty.`,
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
