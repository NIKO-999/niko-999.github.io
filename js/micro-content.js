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
