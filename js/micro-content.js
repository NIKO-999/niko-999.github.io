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
      mastery: `You read the balance of a room before anyone speaks. Who is carrying more than their share, who is quietly taking, where the arrangement stopped being fair three months ago and nobody said so — you clock all of it, fast, without effort. The rare part is that you turn the same instrument on yourself. You hold your own conduct to the standard you measure everyone else by, and that single fact is why people trust your judgment when they wouldn't trust someone smarter.`,
      shadow: `The ledger stays open on everyone but you. You track every imbalance in how you're treated with total precision, build a running account of what you're owed, and never once audit your own column with the same rigour. Your exemptions always feel justified in the moment — this was different, that was a special case, they don't understand the pressure you were under. From outside it reads as someone who demands fairness constantly and practises it selectively, and it costs you the exact credibility your accuracy should have earned.`,
      invitation: `Take the standard you've been holding someone else to and apply it to yourself out loud, today, in front of them. Pick a real one — a specific thing you've been quietly resenting them for. Say what you expect of them, then say plainly where you fall short of the same expectation. The point isn't apology, it's showing that the measure runs both directions, and you'll feel the room's posture toward you change the moment it does.`,
    },

    // ── 1 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '1_A': {
      title: `1 in Core Character — The Magician`,
      tagline: `A Design of Instant Competence`,
      mastery: `Competence comes off you before you've done a thing to prove it. People hand you things that matter within minutes of meeting you, and they're not being careless — they're reading something real. You back it up when tested, which is why the impression holds instead of collapsing the way it does for people who only perform capability. Rooms reorganise around you quickly because you're the one who looks like you'll actually handle it.`,
      shadow: `The mask does all the work and you stop taking it off. You become the default problem-solver in every group, and because you never once looked like you were struggling, nobody develops the habit of checking. The days you have nothing left look identical from outside to the days you're fine — same steady face, same handled tone. So when you finally needed someone, there was no one in the habit of asking, and you took that as proof you were right to rely on yourself.`,
      invitation: `Tell one person today, plainly, about something you currently don't have handled. Not a past struggle you've already resolved into a good story — a live one, still unresolved. Say the sentence without the recovery attached to it and then stop talking, which will be the hard part. What you're looking for is whether they move toward you, and they will, and that's the information you've been missing.`,
    },

    // ── 2 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '2_A': {
      title: `2 in Core Character — The High Priestess`,
      tagline: `A Design of the Held Depth`,
      mastery: `There is obviously more going on in you than you're showing, and people register it immediately. You don't fill silence to make others comfortable, so when you do speak, it lands with weight most people can't generate no matter how loudly they talk. Your reserve reads as consideration rather than absence — the sense that anything you say has already been through something before it reached the air. People lean toward you specifically because you're not handing yourself out.`,
      shadow: `The guarding goes total and stops being a choice. You withhold so consistently that the wall gives off no signal at all — no hint that there's something behind it worth the effort of reaching. People try twice, get nothing legible back, and reclassify you from deep to simply cold. The depth you were protecting ends up witnessed by no one, which was never the trade you thought you were making.`,
      invitation: `Let one true thing land on your face today and leave it there unexplained. A reaction you'd normally flatten, a flicker of what you actually thought — hold it for two seconds instead of erasing it. Don't narrate it afterward or apologise for it, because the explaining is how you take it back. You're testing whether being briefly readable costs you anything, and it won't.`,
    },

    // ── 3 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '3_A': {
      title: `3 in Core Character — The Empress`,
      tagline: `A Design of the Room That Exhales`,
      mastery: `Rooms exhale when you enter them. People drop their shoulders around you without deciding to, and they say things to you they hadn't planned on saying. None of this is technique — hospitality is closer to your resting state than a skill you deploy, which is exactly why it works on people who are immune to the performed version. You make others feel permitted, and that is a genuinely uncommon thing to do simply by being present.`,
      shadow: `You become the landing pad and the arrangement never reverses. Everyone brings their weight to you, you hold all of it, and it does not occur to a single one of them that you might need the same. There's no dramatic breaking point — the tiredness just compounds, week over week, entirely invisible because you keep receiving people exactly as warmly on the empty days. You end up surrounded by people who love you and have no idea what's happening to you.`,
      invitation: `Say "I don't have capacity for that right now" out loud today, once, to someone who will be surprised to hear it. Don't soften it with an explanation or offer an alternative time — the sentence works because it stops there. Watch what actually happens next, which is almost certainly nothing bad. You're gathering evidence that your capacity has a limit and the world tolerates it.`,
    },

    // ── 4 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '4_A': {
      title: `4 in Core Character — The Emperor`,
      tagline: `A Design of Assumed Command`,
      mastery: `A room organises itself around you before you've said anything. People look to you for the call, and they're right to — you hold the weight without visible strain and you don't flinch when a decision turns out to cost something. This isn't projected authority or borrowed rank. It's the specific steadiness of someone who can be relied on to still be standing there when the situation gets difficult, and everyone can feel it.`,
      shadow: `People stop telling you what they actually think. You look decided before the conversation starts, so they skip the part where they'd have disagreed and go straight to agreeing. The consensus around you gets faster and thinner every year, and you read the speed as alignment rather than what it is — a room that has learned arguing with you is not worth the friction. You end up making decisions on information that was quietly filtered before it ever got to you.`,
      invitation: `Ask one real question today and then stay silent long past the point it gets uncomfortable. Pick something you already have a view on and ask someone who reports to you or defers to you what they'd do instead. Do not respond to the first answer — wait, because the first answer is the safe one and the second is the true one. If nothing more honest surfaces, that itself tells you how long the filtering has been running.`,
    },

    // ── 5 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '5_A': {
      title: `5 in Core Character — The Hierophant`,
      tagline: `A Design of Assumed Rightness`,
      mastery: `You carry the bearing of someone who knows how things are properly done. People take your read before you've justified it, and an uncertain room settles when you state your position — not because you argued well, but because you sounded like someone who has already thought this through and found the floor. You're the person others check their instinct against. That's a real form of authority and you did not have to ask for it.`,
      shadow: `The role hardens into a cage. You get cast as the one who already knows, so people stop bringing you their doubts, their half-formed objections, the things that would have sharpened you. You start defending positions past the point you believe them because reversing would break the character everyone's assigned you. The thinking that earned the authority quietly stops getting fed, and you're the last person in the room who'll notice.`,
      invitation: `Say "I don't know" today to someone who fully expects you to. Pick a question inside your actual area of authority, not a safe one outside it, and let the sentence sit without immediately following it with a theory. Notice the pull to recover with a partial answer and refuse it. What you're rebuilding is the channel that brings you disagreement, and it only reopens if people see the certainty is optional.`,
    },

    // ── 6 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '6_A': {
      title: `6 in Core Character — The Lovers`,
      tagline: `A Design of the Meaningful Yes`,
      mastery: `You don't hand your attention to everyone, so when someone actually gets it, they know. People want your closeness precisely because you don't distribute it freely, and that scarcity is not coldness — it's discernment, and it gives whatever you offer real weight. You choose people. It shows, and it's part of what makes being chosen by you land differently than being liked by someone who likes everyone.`,
      shadow: `The discernment starts announcing itself before the warmth does. People feel evaluated against a standard they were never shown, so being near you starts to feel like an audition rather than an arrival. They spend their energy performing worthiness instead of actually opening up. The very thing that would have let you see them clearly never happens, because you made them audition for it first.`,
      invitation: `Let your warmth go first today, before any read or assessment. Pick someone you'd normally size up before deciding how much to give, and give the warm version immediately, without waiting to see if they've earned it. Notice how much faster something real shows up when the evaluation isn't running first. This is the one thing worth testing more than once.`,
    },

    // ── 7 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '7_A': {
      title: `7 in Core Character — The Chariot`,
      tagline: `A Design of Visible Momentum`,
      mastery: `You carry direction before you've said a word about where you're headed. People clock it instantly — you're going somewhere, and it's not performed urgency, it's actual forward motion they can feel from across a room. That legibility is what draws people to follow you before you've even made the ask. Nobody has to guess whether you're serious. It's visible in how you move.`,
      shadow: `The momentum reads as unavailability, and the small stuff stops arriving. People decide you're too busy for a low-stakes check-in, too focused for the casual conversation that would have actually built the closeness. So they simply stop offering it. You end up surrounded by people who assumed correctly that you didn't have room, and the isolation inside your own drive doesn't register as isolation — it just feels like being productive, right up until it doesn't.`,
      invitation: `Let yourself be seen doing nothing today, deliberately, in front of someone who usually only sees you in motion. Sit still somewhere visible, no task in hand, no destination pending. Let the stillness run long enough that it's obviously on purpose and not just a pause between things. What you're proving to the people watching is that you have room, and the fastest way to prove it is to demonstrate it, not announce it.`,
    },

    // ── 9 in CORE CHARACTER (A · Left / Day of Birth) ───────────────────────
    '9_A': {
      title: `9 in Core Character — The Hermit`,
      tagline: `A Design of Presumed Solitude`,
      mastery: `People give you space without needing to be asked, because it's obvious you process things internally rather than out loud. That's a real gift, not distance — it means the people around you have already learned to consider whether you actually want company before they impose. You're rarely crowded, and you rarely have to defend the solitude you need. Most people never earn that kind of default respect from a group.`,
      shadow: `The default respect calcifies into permanent exclusion. People stop asking at all, assuming solitude is always the answer, and the assumption compounds silently over months until you're simply not on the list anymore. Nobody made a decision to leave you out — it just accumulated, invitation by unissued invitation, and you're the only one who can feel the gap it left. By the time you notice, it looks less like a misunderstanding and more like a verdict.`,
      invitation: `Tell one person directly today that you want to be included in something specific — not a general statement, an actual thing coming up. Name it, and say plainly that you'd like to be asked next time without them having to guess. Watch their reaction, because most people will be relieved to finally know. This is the single sentence that undoes months of accumulated assumption.`,
    },

    // ── 10 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '10_A': {
      title: `10 in Core Character — The Wheel of Fortune`,
      tagline: `A Design of the Watched Shift`,
      mastery: `You're genuinely interesting to watch. Circumstances shift around you at a rate that keeps people curious rather than exhausted, and they stay engaged with your life over years because it never quite settles into something predictable. Change doesn't unsettle you the way it unsettles most people — you move with it, and that ease reads as a kind of confidence others don't have. People remember your story specifically because it keeps moving.`,
      shadow: `The association hardens into a verdict — unreliable, simply because things move around you. People hedge their bets before committing to anything long-term with you, assuming the next shift is already loading. This holds true even during the long stretches where you're actually completely steady. You end up paying an unreliability tax for a season you're not even currently in, and nobody thinks to check whether the assumption still applies.`,
      invitation: `Show one person today a single thread in your life that hasn't changed in years. A habit, a relationship, a commitment you've kept without interruption — pick something real and specific and put it in front of them plainly. Don't over-explain it or justify why you're bringing it up. You're giving them evidence that contradicts the story they've built about you, and evidence works faster than argument.`,
    },

    // ── 11 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '11_A': {
      title: `11 in Core Character — Strength`,
      tagline: `A Design of the Safe Weight`,
      mastery: `People bring you the worst moments of their lives without asking first whether you're up for it, because something about you reads as capable of holding real weight without cracking under it. That capacity is genuine, not performed toughness, and it's rare enough that you become the person a crisis actually gets handed to. You stay functional when other people would fold. That's not a small thing, and everyone around you knows it even if they've never said it out loud.`,
      shadow: `You become the default shock absorber and nobody ever checks whether you're absorbing too much. Your own hard moments go completely unnoticed, because your composure never visibly cracks in front of anyone, so there's no signal for people to respond to. The same steadiness that makes you trusted in a crisis is exactly what guarantees nobody offers the same back to you. You end up the strongest person in every room and the least supported person in it, and both are true for the same reason.`,
      invitation: `Let your composure actually slip once today, in front of someone you trust, on purpose. Don't wait for a big enough crisis to justify it — pick an ordinary moment and just stop holding it together for thirty seconds. Say what's actually hard right now instead of managing your face through it. You're not testing whether they can handle it. You're testing whether you'll let them try.`,
    },

    // ── 12 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '12_A': {
      title: `12 in Core Character — The Hanged Man`,
      tagline: `A Design of the Different Clock`,
      mastery: `You run on a different clock than everyone else in the room, and that gap is where you see what they miss. Urgency doesn't move you the way it moves other people, so you catch the angle that only shows up once the panic settles. This is a real advantage, not disengagement, even though it rarely looks like engagement to people sprinting past you. The observations you're sitting on are usually the ones the room needed most and asked for least.`,
      shadow: `The different pace reads as checked-out, and people stop waiting for you. You get left out of urgent decisions entirely, quietly, because nobody wants to slow down to your speed when the clock is running. Your actually valuable perspective never gets solicited, because asking would mean waiting, and waiting is exactly what the room has decided it can't afford. You watch decisions get made badly in real time and say nothing, because nobody asked, and you've stopped expecting them to.`,
      invitation: `Say the sharp observation you're holding today, out loud, unprompted, before someone asks for it. Don't wait for the room to slow down to your pace — interrupt at your own speed instead. Keep it to one clear sentence so it can't be dismissed as a tangent. You already know the thing that would change the decision. The only step left is saying it before it's too late to matter.`,
    },

    // ── 13 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '13_A': {
      title: `13 in Core Character — Transformation`,
      tagline: `A Design of Grounded Gravity`,
      mastery: `You carry the grounded weight of someone who has already survived something real, and people register it instantly without you explaining a thing. It earns you a trust most people spend years building and never quite reach. Strangers open up to you faster than they open up to people they've known longer, because something in your presence signals you won't flinch at what they say. That's not an accident of appearance — it's earned gravity, and it precedes you into every room.`,
      shadow: `People start handling you like glass, assuming there's always something heavy running underneath. You get starved of the trivial — the small talk, the silliness, the ordinary texture of an unremarkable day — because everyone around you has quietly decided you're too deep for it. The isolation is polite and well-intentioned and still isolation. You end up missing the lightness you actually want, simply because nobody thought to offer it to someone who looks like you.`,
      invitation: `Bring one genuinely trivial joy into a conversation today without earning it first — no serious topic to justify the shift, no meaningful segue. Just say the small, silly thing out loud. Watch the room's surprise, and let it be surprised. You're teaching people that lightness is allowed with you, and they will only learn it by watching you offer it first.`,
    },

    // ── 14 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '14_A': {
      title: `14 in Core Character — Temperance`,
      tagline: `A Design of the Trusted Middle`,
      mastery: `You hold two opposing positions in the same room without dismissing either one, and that's a genuinely rare skill. People trust you specifically because you're useful in the middle of a fight — you translate between sides that would otherwise just talk past each other and escalate. Groups quietly funnel their tension toward you because you're the one who can actually metabolise it. That's real value, and it's earned through years of staying steady when everyone else picked a side too fast.`,
      shadow: `You become the group's designated peacekeeper, and the role never comes off. You smooth over conflict on autopilot, even in the exact moments you're the one who actually needs smoothing, and nobody notices because you're too busy managing theirs. Your own disputes sit unresolved for years, since you've become so identified with fixing other people's tension that it doesn't occur to anyone — including you — that you might need the same service. You've mediated a hundred fights and never once let anyone mediate yours.`,
      invitation: `Land somewhere today. Give one clear, unmixed opinion on something you'd normally hold in careful balance. State a side, plainly, with no "but I also see the other view" attached to it. Pick something low enough stakes that landing badly won't cost you much, and use it to practise the muscle. You need proof that having a side doesn't collapse the trust people place in your fairness.`,
    },

    // ── 15 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '15_A': {
      title: `15 in Core Character — The Devil`,
      tagline: `A Design of the Compelling Edge`,
      mastery: `People feel something compelling and slightly dangerous about you before they can name it. That edge is real, and it generates a pull that more conventionally pleasant people simply cannot produce no matter how hard they try. You draw the kind of attention that isn't idle curiosity — it's genuine interest, sharpened by the sense that you're not entirely safe and entirely worth knowing anyway. That combination is rare and you carry it without needing to perform it.`,
      shadow: `The intensity attracts exactly the wrong reasons or repels everyone before they get close enough to see past it. People either chase the edge for a thrill that has nothing to do with actually knowing you, or they decide from a distance that you're too much and never test the theory. Your real gentleness — and it's real — gets buried under a first impression that reads far more extreme than you actually are. You end up either used or avoided, and rarely simply known.`,
      invitation: `Let your softness show today, right alongside the edge, not as a replacement for it. Say or do one gentle thing in the same conversation where you'd normally let the intensity carry the whole room. Don't apologise for the edge to make room for the softness — let both sit next to each other, visibly, at once. People need to see the combination to stop mistaking the edge for the whole story.`,
    },

    // ── 16 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '16_A': {
      title: `16 in Core Character — The Tower`,
      tagline: `A Design of the Truth-Jolt`,
      mastery: `You cut through the polite fiction everyone else in the room is quietly protecting. The thing nobody wanted to say out loud, you say, and it lands like a jolt of electricity that clears the air whether people wanted it cleared or not. That honesty is a real gift, not a personality flaw people tolerate — rooms are frequently better for what you said, once the initial shock passes and the truth has time to settle. You don't perform bluntness for effect. You simply refuse to maintain a fiction everyone else has quietly agreed to.`,
      shadow: `People start managing information around you before you've done anything at all. They brace for disruption preemptively, exclude you from delicate conversations on reflex, and treat you as a risk to be contained rather than a person who might, this particular time, have something careful to offer. The exclusion compounds — the less you're included, the more your rare appearances feel disruptive by contrast, which confirms the very reputation that got you excluded in the first place. You become the storm everyone plans around instead of the person occasionally in the room.`,
      invitation: `Say one honest thing today, gently, on purpose, specifically to prove the honesty doesn't have to detonate. Choose something true you'd normally hold back or deliver too sharply, and deliver it slowly, with care for how it lands. Watch the room's face for the moment they realise this isn't the blast they braced for. You're building a track record, one gentle truth at a time, and it's the only thing that will actually change how people brace around you.`,
    },

    // ── 17 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '17_A': {
      title: `17 in Core Character — The Star`,
      tagline: `A Design of Unhardened Hope`,
      mastery: `Your hope hasn't hardened into naivety, and people can feel the difference. They can be genuinely discouraged around you, because your optimism has already absorbed the bad news and stayed intact anyway — it's earned, not performed, and it doesn't need to look away from something hard to survive it. That combination makes you a safe place to be honest about a bad day, which is rarer than simple positivity and worth far more. People bring you their real state precisely because you won't flinch from it.`,
      shadow: `You get cast as the group's permanent source of encouragement, expected to be hopeful more or less on schedule. Your own low days start to feel like a betrayal of the role everyone's assigned you, so you hide them behind the same steady optimism you offer everyone else. The one place that might have handed hope back to you never gets the chance, because you never show it the need. You end up propping up everyone's morale on a reserve nobody is refilling.`,
      invitation: `Let your own doubt be visible today, out loud, without immediately following it with reassurance that it'll be fine. Tell someone specifically what you're actually unsure about right now. Resist the reflex to close the sentence with something comforting for their sake. You're finding out whether the hope people rely on from you can also be offered to you, and it can — but only if you stop hiding the doubt underneath it.`,
    },

    // ── 18 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '18_A': {
      title: `18 in Core Character — The Moon`,
      tagline: `A Design of the Weather Behind the Eyes`,
      mastery: `You carry a rich, shifting interior life that shows on your face before you say a word about it, and people notice. There's real curiosity generated by that visible depth — people want to know what's actually happening behind your eyes, even before they know you well enough to ask directly. That mystery isn't distance. It's the natural result of having a genuinely complex inner world that doesn't flatten itself for anyone's convenience.`,
      shadow: `People start guessing at your mood instead of asking, and they guess toward the worst almost every time. Your silence becomes a screen they project their own anxieties onto. A room can fill with unnecessary tension over a mood you're not even in, simply because nobody thought to check. The gap between what you're actually feeling and what people assume you're feeling widens the longer it goes unaddressed, and you end up managing other people's misreads of your own inner weather.`,
      invitation: `Name what you're actually feeling today, out loud, in one plain sentence, to someone who's clearly guessing. Don't dress it up or make it poetic — say it flat, the way you'd report a fact. Do this the moment you notice someone reading your silence wrong. One accurate sentence does more to settle a room than an hour of them guessing ever will.`,
    },

    // ── 19 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '19_A': {
      title: `19 in Core Character — The Sun`,
      tagline: `A Design of Instant Warmth`,
      mastery: `People feel lighter just standing near you, and it's not something you're producing on purpose. The warmth is genuine, not performed, and it's one of the most immediately likable things about you — it puts strangers at ease before you've done a single specific thing to earn it. You make rooms warmer by occupying them. That's a rare, real effect, and most people who have it never even notice they're generating it.`,
      shadow: `People start assuming the brightness is constant and unconditional, a fixed feature rather than a mood. On the days you're actually struggling, they get confused instead of concerned. The very thing that makes you easy to love also makes it nearly impossible for anyone to clock when you're not okay, because your baseline reads as fine even when it isn't. You end up absorbing your own hard days alone, precisely because you're too consistently warm for anyone to think to check.`,
      invitation: `Let one bad day actually show today, without apologising for it or performing your way back to brightness halfway through. Say, plainly, that today isn't a good one. Don't soften the landing for the people around you by cracking a joke to recover the mood. You're giving people the chance to finally notice, and they can't take that chance if you keep handing them the usual light instead.`,
    },

    // ── 20 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '20_A': {
      title: `20 in Core Character — Judgement`,
      tagline: `A Design of Imminent Arrival`,
      mastery: `You carry the charge of someone actively becoming something bigger, and it's not a story you're telling — people feel the unfolding whether or not you've announced any of it. There's a genuine sense of imminence around you, the feeling that something is arriving, and it makes people pay closer attention to your life than they typically would to someone else's. You're never quite finished, and that incompleteness reads as momentum rather than deficiency. People want to watch what you turn into next, because the trajectory is visibly real.`,
      shadow: `People start relating to who you're becoming instead of who you actually are right now, today, in front of them. You end up half-seen, waiting alongside everyone else for the finished version of you to arrive, while the current, actual you goes largely unmet in the meantime. Even your closest relationships can end up oriented toward your potential rather than your present, which leaves you strangely lonely inside all that anticipated arrival. You start to feel like a draft nobody's reading yet.`,
      invitation: `Let someone meet exactly who you are today, not who you're becoming. Tell them plainly, without qualifying it against future plans, what's true about you right now. Resist the pull to frame yourself as a work in progress or apologise for not being further along. You're asking to be met in the present tense for once, and the only way to get that is to stop selling the future version first.`,
    },

    // ── 21 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '21_A': {
      title: `21 in Core Character — The World`,
      tagline: `A Design of Presumed Completion`,
      mastery: `You carry a genuine sense of wholeness — the ease of someone who's already arrived somewhere most people are still striving toward. That settledness isn't a mask. People can feel that you're not visibly missing anything, and it makes you reassuring to be near in a way that's hard to fake. You don't radiate need, and in a world full of people performing that they're fine, your actual fine reads as something rarer and more grounding.`,
      shadow: `People assume you don't need anything at all, precisely because you don't look like you're missing anything. Your real struggles go completely invisible, and support quietly stops reaching you. It's not out of neglect — everyone around you has already decided, without ever checking, that you've got it covered. You end up carrying real difficulty entirely alone inside a reputation for having arrived, and asking for help starts to feel like it would contradict everything people believe about you.`,
      invitation: `Show one still-forming, unfinished part of yourself to someone today, plainly, without wrapping it in reassurance that you're still fine overall. Name something you're actually working through right now, not something already resolved into a tidy lesson. Let it sit as unfinished instead of rounding it off. You're giving people the opening to actually offer you something, which they can't do while they still believe you've arrived.`,
    },

    // ── 22 in CORE CHARACTER (A · Left / Day of Birth) ──────────────────────
    '22_A': {
      title: `22 in Core Character — The Fool`,
      tagline: `A Design of Unrehearsed Presence`,
      mastery: `You meet every moment fresh, with no rehearsed social mask standing between you and whoever's actually in front of you. People feel it immediately and drop their own performance in response, which makes you one of the genuinely easiest people to relax around in any room. You don't carry the accumulated weariness most people build up over time — each interaction gets your full, unguarded attention. That openness is rare enough that people remember it long after the conversation ends.`,
      shadow: `The same openness reads as naivety to people who haven't looked past the surface. They underestimate what you've actually lived through and leave you out of the heavier conversations, assuming a lightness that has nothing to do with your real depth. Your ease doesn't advertise everything you've carried, so people mistake unguarded for uninformed. You get quietly excluded from exactly the rooms where your perspective would matter most.`,
      invitation: `Let your actual depth show through the ease today, once, on purpose. In a conversation where you'd normally stay light, say something that reveals what you've actually been through. Don't abandon the openness to do it — let the depth sit right alongside the ease instead of replacing it. People need to see both at once to stop underestimating you.`,
    },

    // ── 5 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '5_B': {
      title: `5 in Sky Line — The Hierophant`,
      tagline: `A Design of Received Structure`,
      mastery: `You sense the deeper structure underneath things before anyone has explained a word of it to you. Study turns into devotion for you, not obligation, and understanding doesn't stay locked in your own head — it becomes something you can hand to another person fully intact. People come to you when they want the real architecture of an idea, not the simplified version. That transmission is a genuine spiritual gift, and it's rarer than raw intelligence.`,
      shadow: `The reverence for structure curdles into certainty that there's exactly one right way to arrive at what you know. You start lecturing when you meant to teach, and the tone shift is one only you don't notice. The channel that should be receiving new understanding closes, sealed by the very conviction that once made you such a good student. You become someone who defends a doctrine instead of someone still discovering one.`,
      invitation: `Ask one person today what they see differently than you do about something you're certain of, and actually let them finish. Don't correct the gaps in their view while they're still talking. Sit with their answer for a full minute before responding at all. You're checking whether your certainty can survive contact with someone else's honest disagreement, and it needs the practice.`,
    },

    // ── 1 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '1_B': {
      title: `1 in Sky Line — The Magician`,
      tagline: `A Design of the Direct Line`,
      mastery: `Inspiration arrives and you know immediately how to give it a shape someone else can actually use. That translation — turning the invisible into something workable — is a real spiritual gift, not a coincidence of timing. It happens at a speed most people spend years training themselves to reach. You are a direct line between the idea and the thing, and very few people can move that fast without losing the signal along the way.`,
      shadow: `You start claiming as personal genius what actually just moved through you, and the credit quietly warps your relationship to your own gift. You hoard half-finished downloads because starting the next one feels more alive than finishing the last one ever will. What accumulates behind you is a long trail of brilliant, abandoned beginnings that never got to become anything real for anyone. The gift for catching inspiration becomes, over time, a reason nothing you catch ever lands.`,
      invitation: `Finish one spiritual idea you've been sitting on today instead of reaching for a new one. Pick the oldest one still in your notes or your head, not the newest and most exciting. Do the unglamorous last ten percent that turns a download into something someone else can actually receive. Don't let yourself start anything new until this one is genuinely done.`,
    },

    // ── 2 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '2_B': {
      title: `2 in Sky Line — The High Priestess`,
      tagline: `A Design of the Unspoken Knowing`,
      mastery: `You sense what's forming before it's ever announced. There's a real fluency in you for symbol and undercurrent, an access to meaning that most people walk straight past without noticing it was even there. This isn't vague guessing dressed up as mysticism — it's a genuine perceptual skill, and it's usually right. People who spend time around you start noticing things they never used to see, simply because you point at what's forming before it fully arrives.`,
      shadow: `You guard the veil instead of lifting it, treating your own insight as too sacred to say out loud. People sense you know something you're not telling them, and it reads as withholding no matter how reverent your actual intention was. The insight stays locked inside a private register only you can access, which means it helps exactly one person. Your reverence for the mystery ends up functioning as a wall between what you see and everyone who could have used it.`,
      invitation: `Say "here's what I'm sensing" out loud today, even without proof to back it up. Pick something you'd normally keep to yourself because you can't fully justify it yet. Offer it plainly, without a disclaimer that undercuts it before anyone's heard it. Let the other person do something with it — that's the whole point of finally speaking it.`,
    },

    // ── 3 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '3_B': {
      title: `3 in Sky Line — The Empress`,
      tagline: `A Design of Generative Presence`,
      mastery: `Things come alive around you simply because you're present, and you're not performing this — it's your actual nature. Growth and possibility organise themselves in your vicinity without your having to push, plan, or ask. People walk away from time with you carrying ideas and energy they didn't bring in. This is a genuine spiritual gift, and it's one of the rarer ones, because it works on people who have no idea it's happening.`,
      shadow: `You can't tolerate anything staying dormant, including things that need to rest before they can grow again. You start resenting it when the fertility you spark in others doesn't circle back with credit attached to your name. What should be pure, unconditional generativity picks up a quiet expectation of acknowledgment, and that expectation undercuts the very gift it's attached to. People start feeling farmed instead of nurtured, even though you'd never describe it that way yourself.`,
      invitation: `Let one thing near you stay fallow today, on purpose, without pushing it to grow. Notice the urge to intervene, encourage, or nudge it forward, and don't act on it. Let it simply exist in its current, undeveloped state for the full day. You're practising the version of your gift that doesn't require constant output to feel real.`,
    },

    // ── 4 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '4_B': {
      title: `4 in Sky Line — The Emperor`,
      tagline: `A Design of Sacred Architecture`,
      mastery: `You take something vast and formless and build a structure sturdy enough to actually hold it. That's architecture in service of the sacred — the rare capacity to make the ineffable practicable without flattening it into something smaller. People rely on the frameworks you build because they've been tested against reality, not just imagined. You give shape to what would otherwise stay abstract forever, and that shape is a genuine gift to everyone who needed somewhere to stand.`,
      shadow: `You defend the frame long after the life inside it has moved on somewhere else. Your spiritual practice starts running on maintenance instead of discovery, because the structure you built to protect something living has quietly become more important to you than the life it was built to hold. You keep polishing the container while what it once held has already left. People around you can feel the difference between devotion and upkeep, even when you can't yet.`,
      invitation: `Ask today, honestly, whether one of your spiritual structures is still serving what it was originally built to protect. Pick the practice or ritual you're most attached to and interrogate it directly. If the answer is no, don't wait for a better moment to change it. Adjust or retire it this week, even if it means admitting the structure outlived its purpose before you noticed.`,
    },

    // ── 6 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '6_B': {
      title: `6 in Sky Line — The Lovers`,
      tagline: `A Design of the True Frequency`,
      mastery: `You can feel the difference between what's actually spiritually true for you and what's simply appealing, even when the appealing version is louder and easier to justify to everyone around you. That discernment holds under real social pressure, not just in quiet moments alone. You don't confuse popularity with resonance, and that clarity is rarer than most people assume until they watch you decline something everyone else has chosen. It's a genuine form of spiritual maturity, not stubbornness.`,
      shadow: `You stay suspended at the crossroads, feeling both paths so intensely that choosing either one starts to feel like betraying the other. Nothing actually gets committed to, year after year, and the suspension itself starts masquerading as a spiritual practice rather than what it actually is — avoidance. You mistake the intensity of feeling torn for depth, when it's really just fear of the loss that comes with any real choice. People around you watch you stand at the same fork for far longer than the decision should ever take.`,
      invitation: `Choose the resonance you actually feel today, even if the choice is imperfect and even if you're not fully certain. Pick between the two paths you've been holding open and let the other one go, out loud, to someone who'll hold you to it. Don't leave yourself a quiet way back to the option you didn't choose. A real choice, even an imperfect one, teaches you more than another year of feeling both.`,
    },

    // ── 7 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '7_B': {
      title: `7 in Sky Line — The Chariot`,
      tagline: `A Design of Spiritual Perseverance`,
      mastery: `You keep a spiritual practice moving on will alone, long after the initial spark that started it has faded completely. That's real perseverance, and it's the specific kind most people's practices simply don't survive without. You show up on the flat, uninspiring days as reliably as you did on the exciting first one. That consistency is what actually produces depth over time, far more than intensity ever could.`,
      shadow: `You insist on driving the whole practice alone, refusing teachers or community because receiving help feels like losing control of something you built yourself. Discipline quietly becomes a substitute for actual encounter with anything outside your own head. The solitude that once felt like strength starts to feel like a wall, and you can't always tell the difference between the two from the inside. You end up disciplined and isolated at the same time, mistaking one for proof against the other.`,
      invitation: `Let someone else into your practice today — a teacher, a book that actually challenges you, a real conversation about what you believe. Choose something that requires you to receive rather than simply perform your discipline for an audience. Sit with the discomfort of not being the one steering for once. You're testing whether the practice can survive contact with another person's perspective, and it can.`,
    },

    // ── 8 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '8_B': {
      title: `8 in Sky Line — Justice`,
      tagline: `A Design of Hollowness Detection`,
      mastery: `You can sense when something claiming to be sacred has actually gone hollow underneath the performance. That discernment is real, rare, and genuinely protective — you're not easily fooled by depth that's only being performed for an audience. People trust your read on a teacher, a community, or a practice, because your radar for hypocrisy is unusually well calibrated. You catch what others miss because you're not distracted by how convincing the surface looks.`,
      shadow: `That clarity turns into permanent suspicion, and you stop being able to rest inside any practice at all. You're constantly auditing everything for hypocrisy, and the gift for detecting real hollowness starts firing on genuinely sincere places that are simply human and imperfect. You end up alone with your discernment, unable to belong anywhere, because nothing survives the scrutiny of a standard built for detecting fraud rather than tolerating flaws. The gift that was meant to protect you from being fooled ends up isolating you from everything real too.`,
      invitation: `Let one small imperfection in a spiritual community or practice be ordinary humanness today, not proof of hollowness. Notice the exact moment your radar fires on something minor, and pause before reacting to it. Ask yourself whether this is actual fraud or simply a person being human inside something sincere. Stay in the room a little longer than your instinct wants you to, and see what happens.`,
    },

    // ── 9 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ─────
    '9_B': {
      title: `9 in Sky Line — The Hermit`,
      tagline: `A Design of Contemplative Range`,
      mastery: `Given enough quiet, you can access a register of consciousness that most people never reach in an entire lifetime. That's a genuine contemplative gift, not just an introverted preference for being alone. You return from real solitude with something usable — clarity, perspective, a settledness that outlasts the retreat itself. Few people can go that deep into stillness and come back with anything at all, let alone something worth bringing back.`,
      shadow: `You start chasing the peak state again and again, retreating further and further from ordinary life because it simply can't compete with what solitude reliably gives you. The world of other people starts to feel thin and unrewarding compared to what you find alone, so you keep going back for more of it. The retreat deepens past the point of being restorative and starts functioning as escape instead. You end up spiritually rich and relationally starving, and it takes a long time to notice the second part.`,
      invitation: `Bring one thing back from your solitude today and actually share it with another person, out loud. Don't wait until it's fully formed or perfectly articulated — offer it while it's still a little raw. Choose someone who won't just nod along, someone who'll actually engage with it. The gift only becomes a gift once it leaves your own head and does something in someone else's.`,
    },

    // ── 10 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '10_B': {
      title: `10 in Sky Line — The Wheel of Fortune`,
      tagline: `A Design of Divine Timing`,
      mastery: `You have a real instinct for when the moment has actually arrived, even when nothing external has announced it yet. That's a rare gift of trust rather than prediction — you're not calculating odds, you're reading the actual texture of the moment. You act on that sense of rightness directly, and it's usually correct in ways that surprise people who only trust visible evidence. Timing that other people force through analysis, you simply feel.`,
      shadow: `"It's not the right time yet" becomes a permanent excuse you can deploy against anything you're actually afraid to do. You keep sensing a better season just ahead, indefinitely, while the actual present stays completely untouched. Genuine timing wisdom curdles into an endless deferral that never once resolves into real action. Years pass while you wait for a signal that was never going to arrive any clearer than it already has.`,
      invitation: `Trust one "yes" today, right now, instead of pushing it off to some better-timed future. Pick the thing you've been waiting for a clearer sign about and act on it before the day ends. Don't ask for one more piece of confirmation first. You already have the instinct — the only thing missing is letting it actually move you instead of just informing you.`,
    },

    // ── 11 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '11_B': {
      title: `11 in Sky Line — Strength`,
      tagline: `A Design of the Tamed Wild`,
      mastery: `You can stay present with raw, unruly inner states without needing to suppress them or being ruled by them either. That's real, hard-won spiritual strength — the capacity to hold real intensity without fleeing it or drowning in it. Most people manage one side of that equation and fail badly at the other. You've built the rarer skill of standing steady inside a feeling that would flatten most people, and staying yourself the whole way through.`,
      shadow: `You perform calm instead of actually reaching it, and the difference is invisible to everyone including you at first. The intensity you think you've managed moves underground and resurfaces later as tension, irritability, or a sudden eruption that catches you as off-guard as anyone else in the room. This happens precisely because you'd convinced yourself the calm was real rather than borrowed against later. What looks like strength from the outside is sometimes just deferral with better posture.`,
      invitation: `Let one feeling be fully felt today before you try to manage or contain it at all. Notice the moment your instinct reaches for control, and delay that reach by even thirty seconds. Stay inside the raw version of the feeling without narrating it into something calmer than it is. You're finding out whether your strength holds when it isn't performing.`,
    },

    // ── 12 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '12_B': {
      title: `12 in Sky Line — The Hanged Man`,
      tagline: `A Design of Skilled Surrender`,
      mastery: `You can stop pushing entirely and let revelation arrive through release rather than through effort. That comfort with not-knowing is a real spiritual skill, and most people never develop it because it requires trusting something they can't control or verify in advance. You've learned that some answers only come once you stop chasing them, and you can actually let go long enough to find out. That patience produces insight that force never could have reached.`,
      shadow: `You confuse surrender with permanent inaction, staying suspended indefinitely because the pause feels safer than descending back into the risk of an actual choice. What began as a genuine spiritual posture quietly becomes a way of never having to act on anything the suspension revealed to you. You collect insight after insight from the stillness and let every single one of them go unused. The letting go that was supposed to lead somewhere becomes its own permanent destination.`,
      invitation: `Take what your last surrender revealed to you and actually act on it today, concretely. Name the insight plainly, then take one real step that puts it into motion. Don't let this become another thing you understand but never do anything with. The surrender only means something once it changes what you actually do next.`,
    },

    // ── 13 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '13_B': {
      title: `13 in Sky Line — Transformation`,
      tagline: `A Design of Real Initiation`,
      mastery: `You've survived a genuine ego-death before, and something truer rose up in its place afterward. That's a real aptitude for spiritual initiation — you know from direct, lived experience that total collapse can lead somewhere worth actually arriving at. Most people fear that kind of dissolution instinctively. You've been through it and come out more yourself, and that knowledge changes how you move through every difficulty afterward.`,
      shadow: `You start engineering crisis after crisis because ordinary, gradual growth feels unconvincing next to the drama of collapse. The intensity of transformation becomes the proof you require before you'll believe anything real is happening. Quiet, undramatic change starts to feel like it doesn't count, so you manufacture upheaval just to feel like you're still evolving. You end up addicted to your own reconstruction, unable to trust the version of growth that doesn't require tearing something down first.`,
      invitation: `Let one piece of growth happen quietly today, with absolutely no crisis required to make it feel real. Choose something small you've been meaning to shift, and change it without drama or announcement. Resist the urge to make it a bigger moment than it needs to be. You're proving to yourself that transformation doesn't have to hurt to count.`,
    },

    // ── 14 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '14_B': {
      title: `14 in Sky Line — Temperance`,
      tagline: `A Design of the Poured Vessel`,
      mastery: `You hold different truths at their meeting point without needing either one to collapse into the other. That's genuine mediator's work, real spiritual healing that comes from your capacity to contain contradiction rather than rushing to resolve it prematurely. People bring you their conflicting realities because you can actually hold both without picking a side too early. That patience with paradox is a rare and healing gift, and it works precisely because you don't force resolution before it's ready.`,
      shadow: `You lose your own footing while holding everyone else's steady. You pour outward endlessly and rarely let yourself be healed in return, because the role of healer has become so central to who you are that receiving care would feel like stepping outside your own identity. You keep giving from a well nobody's refilling, and you don't notice the depletion because you're too busy tending to everyone else's balance. The mediator who never gets mediated for eventually runs completely dry.`,
      invitation: `Receive one act of care today instead of only offering it to someone else. Let a specific person do something for you without deflecting it or immediately trying to return the favour. Sit with the discomfort of being on the receiving end instead of managing it away. You need proof that you can be held too, not just that you're good at holding.`,
    },

    // ── 15 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '15_B': {
      title: `15 in Sky Line — The Devil`,
      tagline: `A Design of Fearless Looking`,
      mastery: `You can look directly at darkness — your own or the collective's — without flinching away or spiritually bypassing it into something more comfortable. That's genuine depth work, exactly the kind most spiritual approaches actively avoid because it's uncomfortable to sit inside. You don't need the darkness dressed up as a lesson before you're willing to look at it. That fearless looking is rare, and it's the actual precondition for real liberation, not just a detour on the way to it.`,
      shadow: `You circle the same dark material again and again because the intensity of looking at it has quietly become its own reward. Proximity to darkness starts standing in for actual freedom from it, and the looking never converts into the liberation it was originally meant to produce. You mistake the courage of staring at something hard for the harder work of actually changing your relationship to it. Years can pass with you deeply, admirably familiar with your own shadow and no more free of it than when you started.`,
      invitation: `Turn one thing you've been looking at into an actual action toward freedom today, not just more insight about it. Name the specific pattern you've already examined enough times to understand. Take one concrete step that changes your behaviour around it, not your understanding of it. You already have the insight — what's missing is the part where it costs you something to change.`,
    },

    // ── 16 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '16_B': {
      title: `16 in Sky Line — The Tower`,
      tagline: `A Design of Lightning Revelation`,
      mastery: `You receive revelation as lightning — sudden, restructuring clarity that arrives all at once rather than accumulating slowly over months. That's a real spiritual gift, and it changes you faster than the gradual paths most people are stuck taking. When something breaks open for you, it breaks open completely, and you don't need years to integrate what you've just seen. Few people can absorb that much change that fast without shattering, and you can.`,
      shadow: `You start needing the collapse before you'll believe growth is actually happening, sometimes provoking crisis in your own beliefs just to feel that jolt of clarity return. Quiet, incremental understanding starts to feel unconvincing, almost fake, next to the dramatic restructuring you've come to associate with real insight. You keep breaking things that were fine so you can have the satisfaction of rebuilding them. The lightning becomes something you chase rather than something that simply arrives.`,
      invitation: `Let one truth land gently today instead of through demolition. Choose an understanding you've been circling and let it settle in slowly, without forcing the dramatic version. Notice the pull to make it bigger or more disruptive than it needs to be, and resist it. You're proving that clarity doesn't need a crisis attached to be real.`,
    },

    // ── 17 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '17_B': {
      title: `17 in Sky Line — The Star`,
      tagline: `A Design of the Living Wellspring`,
      mastery: `Your faith stays lit without needing proof to keep it burning, and that quality is genuinely contagious to the people around you. You become a real source other people draw hope from, not because you perform certainty convincingly but because the hope in you is actually alive and renewing itself. People can tell the difference between borrowed optimism and yours, and they gravitate toward the real thing. That living faith is a gift you give simply by staying near it yourself.`,
      shadow: `You start treating your faith as a private reserve to protect instead of a wellspring meant to keep flowing, performing hope you don't currently feel because you've become known as the one who's always fine. The role of being everyone's source of light leaves your own doubt with nowhere honest to go, so it gets buried under a version of you that never runs dry in public. People stop checking on you specifically because you've made your steadiness look effortless. The wellspring starts running on reserves instead of being fed, and nobody notices until it's nearly empty.`,
      invitation: `Let your own doubt be witnessed today, honestly, by someone who actually cares about you. Say out loud, plainly, one thing you're currently unsure of or struggling to have faith in. Don't rush to close the conversation with a hopeful reframe. You're finding out whether the people who lean on your hope can also hold you, and they can, if you let them see the real thing.`,
    },

    // ── 18 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '18_B': {
      title: `18 in Sky Line — The Moon`,
      tagline: `A Design of the Threshold at Home`,
      mastery: `You're fluent in liminal space — dreams, the unseen, the threshold territory that most people find deeply disorienting. You feel genuinely at home in exactly the terrain that unsettles almost everyone else around you. You navigate the unclear, the symbolic, the not-yet-formed with an ease that reads to others as unusual and slightly uncanny. That fluency lets you make sense of things long before they've become sense-able to anyone still standing in the daylight.`,
      shadow: `You start losing the thread back to consensus reality, and the drift happens gradually enough that you don't notice it in the moment. Ordinary daylight functioning starts to feel thin and unsatisfying compared to what the threshold reliably offers you. The pull toward the inner world leaves the practical, relational world quietly neglected — bills unpaid, people unanswered, plans left unmade. You become genuinely fluent in the unseen and increasingly fluent in nothing that anyone else can actually share with you.`,
      invitation: `Bring one thing back from your inner world today and ground it in something physical or relational. Take a symbol, a dream, or an insight from the threshold and turn it into one concrete action in ordinary life. Tell a real person about it in plain, un-mystical language. You're building the bridge back, one deliberate crossing at a time.`,
    },

    // ── 19 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '19_B': {
      title: `19 in Sky Line — The Sun`,
      tagline: `A Design of Effortless Clarity`,
      mastery: `Clarity arrives for you light and immediate, without needing a struggle first to earn its legitimacy. Ease itself functions as a real spiritual practice for you, and most traditions treat that kind of ease with suspicion — but it's genuinely, legitimately yours. Understanding doesn't have to hurt to be true, and you're proof of that in a way that makes people around you reconsider their own assumptions. What comes to you effortlessly is not shallow simply because it was easy.`,
      shadow: `You start feeling pressure to manufacture struggle so your insight seems more credible to a world that equates depth with difficulty. Your natural clarity gets dimmed on purpose, dressed up in more effortful, complicated language than it ever actually needed. You talk yourself out of trusting what arrived easily, assuming real wisdom must have cost more than it did. The gift for lightness becomes something you apologise for instead of something you simply offer.`,
      invitation: `Offer something you know today exactly as lightly as it arrived to you, with no harder story attached to make it sound earned. Say the simple version out loud, without padding it with difficulty you didn't actually experience. Notice the urge to add weight to make it sound legitimate, and resist it. You're finding out that people can receive the easy truth just as fully as the hard-won one.`,
    },

    // ── 20 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '20_B': {
      title: `20 in Sky Line — Judgement`,
      tagline: `A Design of Vocational Hearing`,
      mastery: `You recognise a genuine calling when it arrives, clearly distinct from noise or ordinary wishful thinking. That's real vocational discernment — you can tell the difference between an authentic summons and simply wanting something very badly. People trust your read on their own crossroads because you're not swayed by the loudest impulse in the room, including your own. What you commit to tends to hold up, because you didn't mistake urgency for truth to get there.`,
      shadow: `You start mistaking every strong feeling for a divine instruction, chasing missions that don't actually hold up once you slow down and examine them. You end up pressuring other people toward awakenings and changes they're not actually ready for, mistaking your certainty for theirs. The genuine gift for hearing a real call gets diluted by treating every passing impulse as one, so people stop being able to tell which of your calls to actually take seriously. Your credibility erodes exactly where it used to be strongest.`,
      invitation: `Let one "calling" prove itself over time today before committing to it fully or announcing it to anyone. Write down what you're feeling called toward, then set a real waiting period before you act. Watch whether the pull is still there once the initial intensity fades. You're testing your own discernment against time, which is the only test that actually separates a calling from a craving.`,
    },

    // ── 21 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '21_B': {
      title: `21 in Sky Line — The World`,
      tagline: `A Design of Whole-Life Synthesis`,
      mastery: `You weave different traditions and practices into one coherent whole instead of treating them as competing systems that must be chosen between. That's real spiritual synthesis — a genuine capacity to see how disparate frameworks actually fit together underneath their surface differences. People who feel torn between traditions come to you because you've already found the throughline they're still searching for. That integrative view is rare, and it's earned through actually living inside more than one system rather than skimming several.`,
      shadow: `You start collecting breadth without depth, gathering more frameworks in the name of wholeness without letting any single one of them actually change you. The synthesis stays theoretical, more about accumulation and clever connection-making than about being transformed by what you've gathered. You can explain how six traditions relate to each other and still be exactly the same person you were before you learned any of them. Wholeness becomes a collection, not a transformation.`,
      invitation: `Stay with one dimension of your understanding today instead of reaching for something new to add to the collection. Choose the framework or practice you already know best and go one layer deeper into it. Resist the pull toward the next book, teacher, or tradition that promises to complete the picture. You're testing whether depth in one place changes you more than breadth across many ever has.`,
    },

    // ── 22 in SKY LINE (B · Top / Spiritual Potential / Divine Talents) ────
    '22_B': {
      title: `22 in Sky Line — The Fool`,
      tagline: `A Design of the Natural Passport`,
      mastery: `You have direct, unmediated access to the sacred, without needing a doctrine or a credential to grant you permission to enter. That openness is rare and genuinely real, and it lets you encounter the sacred the way a child encounters anything entirely new — directly, without the layer of interpretation most adults can't get past. You leap toward experience before you've fully theorized it, and something in you trusts that the leap itself is a legitimate form of knowing. Very few people retain that kind of unguarded access once they've accumulated enough belief systems to filter through first.`,
      shadow: `You start trusting every experience as equally sacred, with no discernment between them, leaping toward the next revelation before the last one has taught you anything durable enough to keep. Openness without any filter leaves you collecting spiritual experiences rather than actually being changed by any single one of them. You mistake the volume of leaps for the depth of your growth, and the pattern repeats because nothing ever gets integrated long enough to matter. You end up spiritually well-travelled and strangely unchanged.`,
      invitation: `Let one thing you learned in your last spiritual leap actually carry into today's decision, concretely. Name the specific lesson from your most recent leap before reaching for the next one. Apply it to something ordinary happening right now, not another dramatic leap. You're proving to yourself that integration matters as much as the leap itself.`,
    },

    // ── 4 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '4_C': {
      title: `4 in Earth Line — The Emperor`,
      tagline: `A Design of Constructed Security`,
      mastery: `You build real, durable material security — wealth constructed through discipline rather than luck. You can stay with unglamorous foundational work that most people abandon well before it starts paying off.`,
      shadow: `You grip resources so tightly nothing new can get in, mistaking control for prosperity. Money that won't move isn't protected, it's scarce on purpose, and the same discipline that built your security can quietly become the thing that keeps it from growing further.`,
      invitation: `Let one dollar move today that you'd normally hold onto out of caution.`,
    },

    // ── 1 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '1_C': {
      title: `1 in Earth Line — The Magician`,
      tagline: `A Design of Instant Origination`,
      mastery: `You spot an opening and turn it into income before anyone else has finished thinking about it. That's real entrepreneurial instinct, converting straight into real material result, and it's a genuine edge most people never develop.`,
      shadow: `Your financial life is built entirely on starts. Money made fast leaves just as fast, because nothing's actually built to hold it — you're skilled at generating opportunity and comparatively untrained in the slower work of retaining it.`,
      invitation: `Pick one income stream today and commit to staying with it past the exciting part.`,
    },

    // ── 2 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '2_C': {
      title: `2 in Earth Line — The High Priestess`,
      tagline: `A Design of Quiet Financial Instinct`,
      mastery: `You have a felt sense for financial timing that outperforms the visible data. It's quiet material intelligence — not loud, not easily explained, but reliably right when you actually trust it.`,
      shadow: `You second-guess your own gut into silence, deferring to louder, more "rational" advice, and watch your instinct get overridden every time — often by counsel that turns out to have been worse than what you already knew.`,
      invitation: `Act on one quiet financial certainty today before asking anyone else's opinion.`,
    },

    // ── 3 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '3_C': {
      title: `3 in Earth Line — The Empress`,
      tagline: `A Design of Cultivated Wealth`,
      mastery: `You cultivate material resources patiently, the way you'd tend something alive rather than something to be extracted from. It produces real, generative wealth, not merely transactional gain.`,
      shadow: `You pour resources into something that's stopped growing out of attachment to what it once was, and you give your abundance away too freely, undervaluing your own work in a way that quietly erodes what you've built.`,
      invitation: `Prune one thing today that's stopped growing, and price one thing you've been giving away for free.`,
    },

    // ── 5 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '5_C': {
      title: `5 in Earth Line — The Hierophant`,
      tagline: `A Design of Inherited Discipline`,
      mastery: `You absorb how wealth actually gets built from people who've actually done it, and you apply what you learn with real, sustained discipline rather than treating it as theory. That transmission of hard-won knowledge is a genuine strength.`,
      shadow: `You cling to an inherited financial system past the point it fits your actual life, following the rules exactly even when the conditions that made them true have quietly changed underneath you.`,
      invitation: `Name one inherited money rule today that's quietly expired for the life you actually live.`,
    },

    // ── 6 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '6_C': {
      title: `6 in Earth Line — The Lovers`,
      tagline: `A Design of Aligned Income`,
      mastery: `You build wealth only through work that reflects your actual values. That's real material discernment, not simply idealism — you know the difference between money you'd take and money you'd regret.`,
      shadow: `You weigh every financial choice so exhaustively against your values that you never actually commit, watching real opportunities pass by while you're still deliberating whether they're pure enough.`,
      invitation: `Commit fully to one values-aligned choice today, even if it's not perfect.`,
    },

    // ── 7 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '7_C': {
      title: `7 in Earth Line — The Chariot`,
      tagline: `A Design of Willed Momentum`,
      mastery: `You set a material goal and steer through setbacks that would derail most people entirely. That's real, sustained, willed momentum — you don't stop just because the road got harder.`,
      shadow: `You grip the plan so tightly you can't adapt when things genuinely change, and you refuse help even when accepting it would get you there considerably faster and with less cost to you.`,
      invitation: `Let one capable person help carry a financial load today instead of doing it alone.`,
    },

    // ── 8 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '8_C': {
      title: `8 in Earth Line — Justice`,
      tagline: `A Design of Fair Dealing`,
      mastery: `You build wealth through balanced, fair dealing — real, durable security earned through honesty rather than advantage taken at someone else's expense. That reputation for fairness compounds over time.`,
      shadow: `You over-scrutinize every deal for hidden unfairness until you hesitate to invest or commit even when the deal is genuinely sound, and the caution that should protect you starts costing you opportunities that were never actually risky.`,
      invitation: `Move forward on one opportunity today instead of auditing it further.`,
    },

    // ── 9 in EARTH LINE (C · Right / Material & Money / Year of Birth) ──────
    '9_C': {
      title: `9 in Earth Line — The Hermit`,
      tagline: `A Design of Rare Depth`,
      mastery: `You build material security through deep, solitary mastery of a specific craft. That's real expertise, made rare precisely because you went further into it than most people are willing to.`,
      shadow: `Your expertise stays private and undervalued, because putting yourself forward as an expert feels like a departure from the very solitude that built it — so the depth you've earned goes largely unmonetized.`,
      invitation: `Price or offer one piece of your expertise publicly today instead of keeping it to yourself.`,
    },

    // ── 10 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '10_C': {
      title: `10 in Earth Line — The Wheel of Fortune`,
      tagline: `A Design of Financial Seasons`,
      mastery: `You sense when a financial cycle is actually turning — when to invest, when to hold. That's real timing intelligence, not guesswork dressed up as instinct, and it saves you from decisions made purely on momentum.`,
      shadow: `You treat a downturn as proof your luck has run out permanently, or you chase every upswing without discernment, mistaking motion itself for a genuine turn in the cycle rather than checking what's actually driving it.`,
      invitation: `Name which phase of your money cycle you're actually in right now, and act accordingly.`,
    },

    // ── 11 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '11_C': {
      title: `11 in Earth Line — Strength`,
      tagline: `A Design of Financial Endurance`,
      mastery: `You hold steady through financial pressure that would rattle most people, without panicking into rash decisions that would only make things worse. That composure under strain is a genuine, rare asset.`,
      shadow: `You endure financial strain quietly for far too long, refusing to ask for help because your identity has become tied to handling it entirely alone — even once asking would clearly be the faster, smarter move.`,
      invitation: `Ask for one piece of financial support today, before the pressure becomes a crisis.`,
    },

    // ── 12 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '12_C': {
      title: `12 in Earth Line — The Hanged Man`,
      tagline: `A Design of the Unconventional Path`,
      mastery: `Your financial breakthroughs come from stepping back from the expected route entirely. That's real material patience in service of an unconventional path other people wouldn't have the nerve to take.`,
      shadow: `You stay suspended in the wait-and-see posture indefinitely, because it's more comfortable than actually committing to the different path you keep sensing but never quite step onto.`,
      invitation: `Convert one unconventional financial idea you've been sitting on into an actual move today.`,
    },

    // ── 13 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '13_C': {
      title: `13 in Earth Line — Transformation`,
      tagline: `A Design of Deliberate Ending`,
      mastery: `You release material security that's become familiar but limiting, in service of something bigger you can already sense on the other side. That's real financial reinvention, not recklessness.`,
      shadow: `You hold onto a dying income stream out of fear rather than function, because the uncertain gap between the old and the new feels more dangerous to you than a slow, familiar decline.`,
      invitation: `Name one financial chapter that's already ended except on paper, and release it today.`,
    },

    // ── 14 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '14_C': {
      title: `14 in Earth Line — Temperance`,
      tagline: `A Design of Patient Blending`,
      mastery: `You blend multiple income streams and strategies into one sustainable whole, patiently, rather than betting everything on a single method that could fail all at once. That patience is a genuine financial skill.`,
      shadow: `You spread so thin across strategies that nothing ever compounds into something substantial. What looks like sensible diversification quietly becomes dilution, and none of it ever gets the sustained attention it would need to actually grow.`,
      invitation: `Pick two of your financial approaches today and go deeper into them instead of spreading wider.`,
    },

    // ── 15 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '15_C': {
      title: `15 in Earth Line — The Devil`,
      tagline: `A Design of Unflinching Material Truth`,
      mastery: `You understand exactly how money and power actually work on people, including yourself. That's real, unflinching material intelligence most people prefer not to look at directly, and it makes you very hard to manipulate.`,
      shadow: `You grip money and status so tightly that "enough" never arrives, because the attachment was never really about the number in the first place — it was standing in for something the accumulation can't actually provide.`,
      invitation: `Name today what the accumulation is actually trying to provide you, and ask honestly if more will deliver it.`,
    },

    // ── 16 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '16_C': {
      title: `16 in Earth Line — The Tower`,
      tagline: `A Design of Sudden Material Clarity`,
      mastery: `You see a failing financial structure before anyone else is willing to admit it's failing. That's real, sudden material clarity — you notice the crack long before the wall comes down, and you act on it while others still deny it.`,
      shadow: `You provoke collapse before it's actually necessary, walking away from something at the first crack purely out of impatience rather than genuine evidence it can't be saved, when reinforcing it might have worked just as well.`,
      invitation: `Reinforce one financial structure today instead of demolishing it on reflex.`,
    },

    // ── 17 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '17_C': {
      title: `17 in Earth Line — The Star`,
      tagline: `A Design of Rebuilt Renewal`,
      mastery: `You can restore your material life even from real loss — hope translated into the patient, concrete reconstruction of your resources rather than staying abstract. Renewal isn't theoretical for you; you've actually done it.`,
      shadow: `You wait passively for renewal to arrive, treating hope as a strategy in itself instead of the starting point it's meant to be, without ever doing the actual rebuilding work underneath it.`,
      invitation: `Take one concrete rebuilding step today, not just a hopeful one.`,
    },

    // ── 18 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '18_C': {
      title: `18 in Earth Line — The Moon`,
      tagline: `A Design of Sensitive Financial Instinct`,
      mastery: `You sense hidden financial risk or opportunity long before it shows up in any data. That's real, sensitive material intuition, picking up signal well ahead of the numbers — genuine sensitivity, not anxiety.`,
      shadow: `Your financial anxiety runs unmoored from actual signal, making it hard to tell a real warning from simple fear. You end up freezing, or chasing illusory security, based on feelings that were never actually tracking the real risk.`,
      invitation: `Check one financial feeling against a real number today — a budget, an account, something tangible.`,
    },

    // ── 19 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '19_C': {
      title: `19 in Earth Line — The Sun`,
      tagline: `A Design of Uncomplicated Ease`,
      mastery: `You build wealth most easily through work that genuinely feels like you. It's real, uncomplicated ease with money — the income arrives without the struggle other people assume has to come first.`,
      shadow: `You underprice joyful work because it didn't feel like enough of a struggle to be worth real money, as if difficulty were the actual measure of value rather than the result itself.`,
      invitation: `Raise the price on one thing today that you've been undercharging for because it comes easily to you.`,
    },

    // ── 20 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '20_C': {
      title: `20 in Earth Line — Judgement`,
      tagline: `A Design of the Financial Summons`,
      mastery: `You recognize when it's time to leave a financially adequate but outgrown position for one that actually fits who you've become. That's real vocational courage, not restlessness — you hear the summons clearly.`,
      shadow: `You spend years preparing to answer that summons instead of actually answering it — endlessly upskilling and researching instead of making the move you already know you're going to eventually make.`,
      invitation: `Take one real step today toward the truer income source, not another round of research.`,
    },

    // ── 21 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '21_C': {
      title: `21 in Earth Line — The World`,
      tagline: `A Design of Recognized Enough`,
      mastery: `You can actually feel and recognize when a level of material security has been reached, instead of endlessly redefining "enough" further and further out of reach. That capacity to land is genuinely rare.`,
      shadow: `You treat arrival as dangerous, always needing one more milestone before you'll let yourself feel secure — so the security you've genuinely already built never quite gets to register as real.`,
      invitation: `Name one number or state today as genuinely enough, and let yourself land in it.`,
    },

    // ── 22 in EARTH LINE (C · Right / Material & Money / Year of Birth) ─────
    '22_C': {
      title: `22 in Earth Line — The Fool`,
      tagline: `A Design of Unproven Courage`,
      mastery: `You start a financial venture without needing a guarantee first. That's real, uncommon material courage — trust used as an actual strategy rather than a leap of naivety, and it opens doors more cautious people never reach.`,
      shadow: `You repeat the same fresh start without absorbing what the last one actually taught you, so the same mistakes recur in new disguises, dressed up as a different opportunity each time.`,
      invitation: `Name one concrete lesson from your last financial leap and carry it into your next decision today.`,
    },

    // ── 17 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ───
    '17_D': {
      title: `17 in Karmic Tail — The Star`,
      tagline: `A Design of Reclaimed Light`,
      mastery: `You carry real, luminous conviction — you're meant to shine, and when you actually let yourself, you offer genuine hope to the people around you rather than a performance of it. It gives you a real head start on almost anything.`,
      shadow: `You dim your own light on reflex, staying half-developed so it can never be fully judged, undercharging and underselling what you're actually worth because visibility itself feels like exposure.`,
      invitation: `Let one piece of your work or talent be fully visible today, at full brightness, with no hedging.`,
    },

    // ── 1 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '1_D': {
      title: `1 in Karmic Tail — The Magician`,
      tagline: `A Design of the Finished Start`,
      mastery: `You generate real capability and can build something durable with it, once you actually stay long enough to let the initial spark turn into something finished. The follow-through, once you commit to it, is genuinely reliable.`,
      shadow: `You start with real force and abandon it the moment the initial spark fades. Income streams and relationships alike get left half-built, still carrying the promise of what they could have become, and the pattern repeats because starting is what feels most alive.`,
      invitation: `Finish one thing today you already started, especially now that a new idea looks more appealing.`,
    },

    // ── 2 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '2_D': {
      title: `2 in Karmic Tail — The High Priestess`,
      tagline: `A Design of the Spoken Knowing`,
      mastery: `You have real, accurate inner knowing. When you actually speak it, people trust it because it's earned — not guessed, not performed, genuinely known, and it tends to be right more often than the louder opinions in the room.`,
      shadow: `You sense things clearly and say nothing, letting other people arrive at the same conclusion slower, alone, over and over, when you could have simply told them what you already saw and spared them the delay.`,
      invitation: `Say one true thing out loud today that you'd normally keep to yourself.`,
    },

    // ── 3 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '3_D': {
      title: `3 in Karmic Tail — The Empress`,
      tagline: `A Design of Received Care`,
      mastery: `You give generously, and it's a real gift — a capacity for care that's already proven itself many times over in the lives of the people around you, freely and without needing to be asked.`,
      shadow: `You give until you're empty and can't let yourself be cared for in return. Exhaustion becomes normal, treated as simply the cost of who you are rather than a signal something needs to change, so the depletion just keeps compounding quietly.`,
      invitation: `Let someone take care of you in one specific way today, without deflecting or repaying it immediately.`,
    },

    // ── 4 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '4_D': {
      title: `4 in Karmic Tail — The Emperor`,
      tagline: `A Design of Trusted Authority`,
      mastery: `You can hold real, steady authority — neither gripping it too hard nor giving it away the moment it becomes uncomfortable. That balance is genuinely rare, and people around you can feel the difference.`,
      shadow: `You either grip control rigidly or abandon authority altogether, uncomfortable in the space between — as if the only two options were total command or total surrender, with nothing steady in the middle.`,
      invitation: `Own one decision today, gently but firmly, without either gripping it or handing it off.`,
    },

    // ── 5 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '5_D': {
      title: `5 in Karmic Tail — The Hierophant`,
      tagline: `A Design of Examined Belief`,
      mastery: `You can examine a belief you inherited and consciously choose what actually stays. That's real, lived wisdom, earned through your own testing rather than simply installed doctrine you never questioned.`,
      shadow: `You swing between rigid certainty and total skepticism, rarely landing on a belief you've actually tested and consciously decided to keep, so your convictions stay borrowed either way.`,
      invitation: `Examine one inherited belief today — about money, love, or authority — and decide, on purpose, whether it's actually yours.`,
    },

    // ── 6 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '6_D': {
      title: `6 in Karmic Tail — The Lovers`,
      tagline: `A Design of the Kept Choice`,
      mastery: `You can make a real choice from your own values and actually stay inside it. That's commitment that holds, not just a decision made in a good moment and abandoned once the mood changes.`,
      shadow: `You keep one foot out the door on decisions that matter, holding relationships and paths loosely enough to exit without much cost, which quietly prevents them from ever becoming fully real for either side.`,
      invitation: `Recommit fully today to one choice you've been keeping half-made.`,
    },

    // ── 7 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '7_D': {
      title: `7 in Karmic Tail — The Chariot`,
      tagline: `A Design of Trusted Direction`,
      mastery: `You can hold direction firmly without gripping it too tightly — steady, trusting forward motion that doesn't need to force its way through everything to actually arrive somewhere. It carries real weight in a room.`,
      shadow: `You either force your way through everything or drift without any real momentum, rarely finding the steady middle where direction and ease can actually coexist without one canceling the other.`,
      invitation: `Loosen your grip on one thing you've been forcing today, or choose direction on one thing you've let drift.`,
    },

    // ── 8 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '8_D': {
      title: `8 in Karmic Tail — Justice`,
      tagline: `A Design of the Settled Account`,
      mastery: `You can make an honest accounting — an apology, a boundary, a debt repaid — and actually settle it, rather than letting it sit half-acknowledged indefinitely, quietly costing more the longer it's left open.`,
      shadow: `You carry a persistent, hard-to-place sense of owing or being owed that never resolves, especially around money and unspoken relational ledgers nobody's ever actually named out loud to anyone.`,
      invitation: `Settle one small account today — an apology, a repayment, a boundary you've been avoiding.`,
    },

    // ── 9 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ──────
    '9_D': {
      title: `9 in Karmic Tail — The Hermit`,
      tagline: `A Design of the Offered Lantern`,
      mastery: `You gather real wisdom in solitude, and when you actually offer it, it genuinely helps someone — the reflection wasn't wasted, it just needed to leave the room eventually to matter to anyone else.`,
      shadow: `You withdraw past what reflection actually requires, using solitude to avoid rather than to gather, and keep hard-won expertise entirely to yourself long after it could have helped someone waiting on it.`,
      invitation: `Share one thing you've learned in solitude today with someone who could actually use it.`,
    },

    // ── 10 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '10_D': {
      title: `10 in Karmic Tail — The Wheel of Fortune`,
      tagline: `A Design of the Trusted Turn`,
      mastery: `You can let a natural cycle turn — a season ending, a role changing — without gripping against it or trying to hold the wheel in place by sheer force of will. You trust the season rather than fighting it.`,
      shadow: `You dread the downswing and grip hardest exactly at the high point, refusing to let a cycle complete naturally, which usually only makes the eventual turn harder and more disruptive than it needed to be.`,
      invitation: `Let one cycle in your life turn today without resisting it.`,
    },

    // ── 11 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '11_D': {
      title: `11 in Karmic Tail — Strength`,
      tagline: `A Design of Gentle Endurance`,
      mastery: `You can meet a hard moment with patient, embodied calm — real strength, distinct from both raw force and simple collapse, that people can feel and lean on. People notice the difference immediately.`,
      shadow: `You either overpower situations that actually needed patience or collapse under pressure that gentleness could have held instead, rarely landing on the steadier middle path between the two extremes.`,
      invitation: `Meet one difficult moment today with calm instead of force or giving up.`,
    },

    // ── 12 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '12_D': {
      title: `12 in Karmic Tail — The Hanged Man`,
      tagline: `A Design of Voluntary Release`,
      mastery: `You can release something voluntarily, before you're forced to, and actually mean it — a real, chosen letting go rather than a resignation dressed up as one to save face. It's a genuine choice, not a concession.`,
      shadow: `You grip control until circumstances force your hand, or you perform sacrifice while privately resenting it, which quietly poisons what was meant to be a genuine release into something else entirely.`,
      invitation: `Release one thing today on your own terms, before you're forced to.`,
    },

    // ── 13 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '13_D': {
      title: `13 in Karmic Tail — Transformation`,
      tagline: `A Design of the Complete Ending`,
      mastery: `You can let an ending actually finish — completely, with nothing lingering to quietly pull you back toward what's already over and done with. Nothing gets left half-resolved behind you.`,
      shadow: `You leave things half-ended, one foot still in a door you've already decided to walk through, which keeps both the old and the new from ever fully becoming real for you. Neither the old nor new life ever fully starts.`,
      invitation: `Let one lingering ending in your life actually finish today, fully.`,
    },

    // ── 14 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '14_D': {
      title: `14 in Karmic Tail — Temperance`,
      tagline: `A Design of Held Extremes`,
      mastery: `You can hold two opposing things at once without collapsing into either extreme. That's real, patient synthesis, not indecision dressed up as balance. It shows up as real, steady judgment.`,
      shadow: `You swing between all-or-nothing states — total immersion or total withdrawal, reckless spending or fear-driven restriction — rarely landing anywhere in between for very long. The middle ground rarely gets a real chance.`,
      invitation: `Hold the middle on one thing today instead of swinging to either extreme.`,
    },

    // ── 15 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '15_D': {
      title: `15 in Karmic Tail — The Devil`,
      tagline: `A Design of Loosened Chains`,
      mastery: `You can name an attachment honestly and take one real step to loosen it. That's genuine, conscious liberation, not simply talking about freedom while staying fully attached underneath.`,
      shadow: `You recreate dynamics of control — being controlled or controlling — without seeing the pattern while it's actually happening, only recognizing it clearly after the fact, once it's already run its course.`,
      invitation: `Name one attachment or control dynamic honestly today, and take one step to loosen it.`,
    },

    // ── 16 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '16_D': {
      title: `16 in Karmic Tail — The Tower`,
      tagline: `A Design of the Finished Collapse`,
      mastery: `You can let a structure that's already failing actually fall, on your own terms, instead of propping it up long past the point it can genuinely hold any real weight. You'd rather face it than keep pretending.`,
      shadow: `You maintain beliefs, relationships, or identities long past the point they're standing on solid ground, out of fear of what the collapse might actually mean about who you are. The eventual fall is only ever harder for the delay.`,
      invitation: `Let one thing that's already failing fall today, deliberately, instead of propping it up further.`,
    },

    // ── 18 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '18_D': {
      title: `18 in Karmic Tail — The Moon`,
      tagline: `A Design of the Faced Fog`,
      mastery: `You can walk directly into an uncertain situation and let real clarity come from actually being inside it, rather than needing certainty before you're willing to move at all. Being inside it beats waiting outside it.`,
      shadow: `You carry free-floating anxiety that doesn't attach to anything specific, and you avoid situations that would require facing something head-on, letting the fog stay undisturbed for far longer than it needs to.`,
      invitation: `Walk toward one uncertain thing today instead of avoiding it — check the number, have the conversation.`,
    },

    // ── 19 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '19_D': {
      title: `19 in Karmic Tail — The Sun`,
      tagline: `A Design of Undimmed Joy`,
      mastery: `You can let joy be fully, visibly felt — real vitality offered without apology, without needing to shrink it down to make it acceptable to anyone else in the room. It's a genuine, uncomplicated gift to be around.`,
      shadow: `You downplay good news and mute your own excitement, feeling a strange guilt when things are genuinely going well, as if visible joy required some kind of justification you haven't earned.`,
      invitation: `Let one piece of good news be fully celebrated today, at full volume, no minimizing.`,
    },

    // ── 20 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '20_D': {
      title: `20 in Karmic Tail — Judgement`,
      tagline: `A Design of the Answered Summons`,
      mastery: `You can answer a call you've been postponing, even before you feel fully ready, trusting that readiness will catch up once you've actually started moving toward it. Readiness was never actually the real requirement.`,
      shadow: `You get close to something important and stall just short of the actual leap, again and again, always circling the same threshold without ever quite crossing over it. The threshold stays exactly where it's always been.`,
      invitation: `Answer one call you've been postponing today, imperfectly, before you feel ready.`,
    },

    // ── 21 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '21_D': {
      title: `21 in Karmic Tail — The World`,
      tagline: `A Design of the Closed Circle`,
      mastery: `You can let something nearly-finished actually complete, resisting the old pull to stop short right before the very end where it actually matters most. The finishing is what actually counts.`,
      shadow: `You stop just short of finishing — projects, relationships, goals that get to nearly-there and quietly stall, leaving behind a long trail of almost-done things. Almost-done things quietly weigh more than finished ones.`,
      invitation: `Complete one nearly-finished thing today instead of letting it stay at "almost."`,
    },

    // ── 22 in KARMIC TAIL (D · Bottom / Past-Life Lessons / Core Karma) ─────
    '22_D': {
      title: `22 in Karmic Tail — The Fool`,
      tagline: `A Design of the Considered Leap`,
      mastery: `You can take a real leap deliberately, with your eyes open — genuine trust that includes awareness, distinct from both recklessness and total caution holding you back. That's the version worth actually building on.`,
      shadow: `You either leap without any real consideration or refuse to leap at all, rarely finding the trust that includes awareness rather than defaulting to one extreme or the other. Neither extreme teaches you very much.`,
      invitation: `Take one real, considered leap today — not reckless, not avoided, just chosen.`,
    },

    // ── 7 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '7_E': {
      title: `7 in Soul Center — The Chariot`,
      tagline: `A Design of the Trusted Compass`,
      mastery: `You steer your own life. Not speed, not achievement — the sustained, disciplined ability to keep moving in a chosen direction no matter what shows up. That's real, internally generated direction most people never develop.`,
      shadow: `You believe you have to figure everything out alone. Self-sufficiency becomes a very specific kind of loneliness, and help that arrives late isn't proof people can't be trusted — it's proof you decided long ago that receiving wasn't safe.`,
      invitation: `Take one piece of help today without immediately fixing or repaying it.`,
    },

    // ── 1 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '1_E': {
      title: `1 in Soul Center — The Magician`,
      tagline: `A Design of the Sacred Beginning`,
      mastery: `You feel most like yourself in the act of beginning. You're a source — someone through whom things get started and brought into form, and that origination is a genuine part of your purpose, not a phase to grow out of.`,
      shadow: `You believe only the beginning counts. You scatter across a lifetime of starts, chasing the high of originating something new, never settling long enough into what you actually started to find out what it was proving.`,
      invitation: `Finish one thing today instead of starting something new.`,
    },

    // ── 2 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '2_E': {
      title: `2 in Soul Center — The High Priestess`,
      tagline: `A Design of Quiet Certainty`,
      mastery: `You feel most like yourself in quiet certainty — knowing before your mind catches up to explain why. That's real, undemanding inner truth, and it's more trustworthy than it might seem from the outside.`,
      shadow: `You stay so private with your knowing that it never actually meets the world. A rich inner life accumulates, but it never translates into anything visible, so the depth stays entirely yours and reaches no one else.`,
      invitation: `Let your inner knowing direct one real choice today, not just private reflection.`,
    },

    // ── 3 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '3_E': {
      title: `3 in Soul Center — The Empress`,
      tagline: `A Design of Rooted Cultivation`,
      mastery: `You feel most like yourself actively growing something — tending it with real, patient care rather than rushing it toward a result before it's actually ready to arrive. That patience is the whole practice.`,
      shadow: `You lose your own purpose inside everyone else's growth, nurturing outward so consistently that nothing of your own ever actually gets planted, tended, or allowed to become anything of its own.`,
      invitation: `Give yourself today the same patient attention you give everyone else's growth.`,
    },

    // ── 4 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '4_E': {
      title: `4 in Soul Center — The Emperor`,
      tagline: `A Design of Purposeful Structure`,
      mastery: `You feel most like yourself constructing something meant to last — real, durable structure that holds weight over time rather than collapsing under the first real pressure it meets.`,
      shadow: `You confuse the structure with the purpose itself, maintaining rigid systems long after they've stopped serving anyone, including you, simply because dismantling them feels like admitting failure.`,
      invitation: `Ask today what one of your structures is actually for, and stay loyal to that answer.`,
    },

    // ── 5 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '5_E': {
      title: `5 in Soul Center — The Hierophant`,
      tagline: `A Design of Living Transmission`,
      mastery: `You feel most like yourself learning or teaching something real — part of a lineage of understanding that runs through you rather than stopping with you and going no further. It doesn't need to stop with you to matter.`,
      shadow: `You hold wisdom so tightly it never actually moves through you to anyone else. Purpose that stays entirely private eventually stops functioning as purpose at all, since nothing it produces ever reaches anyone who needs it.`,
      invitation: `Teach or share one thing today, even before you feel fully qualified.`,
    },

    // ── 6 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '6_E': {
      title: `6 in Soul Center — The Lovers`,
      tagline: `A Design of Lived Alignment`,
      mastery: `You feel most like yourself in a clean, values-driven choice, even a hard one that costs you something. That's real alignment, distinct from mere comfort or convenience. That's discernment, not indifference.`,
      shadow: `You treat every choice as equally weighty, exhausting yourself with deliberation until fatigue masquerades as depth, and the genuinely important decisions get no more real attention than the trivial ones do.`,
      invitation: `Let one small choice today be small. Save your full attention for the one that actually matters.`,
    },

    // ── 8 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '8_E': {
      title: `8 in Soul Center — Justice`,
      tagline: `A Design of Grounded Integrity`,
      mastery: `You feel most like yourself being genuinely honest, even when it costs you something real. That's integrity actually held steady under pressure, not merely claimed when it's easy. It's demonstrated, not merely believed.`,
      shadow: `You turn that integrity into a permanent audit of everyone else, using your own honesty as a standard to judge the world by instead of simply living inside it yourself, quietly. Living it is different from grading everyone else by it.`,
      invitation: `Let your integrity be demonstrated today, not enforced on anyone else.`,
    },

    // ── 9 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ──
    '9_E': {
      title: `9 in Soul Center — The Hermit`,
      tagline: `A Design of Depth in Motion`,
      mastery: `You feel most like yourself in quiet, unhurried reflection. That's real clarity, the kind that only comes from actually spending unhurried time in solitude with your own thoughts. The stillness is where the clarity actually forms.`,
      shadow: `You mistake permanent withdrawal for purpose itself, staying so deep in reflection that the insight you're generating never gets tested against an actual, lived life outside your own head.`,
      invitation: `Bring one thing the quiet showed you back out into your actual life today.`,
    },

    // ── 10 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '10_E': {
      title: `10 in Soul Center — The Wheel of Fortune`,
      tagline: `A Design of the Steady Center`,
      mastery: `You feel most like yourself moving with change, not despite it. That's real equanimity through life's cycles, rather than a hard-won tolerance you're constantly managing. The steadiness isn't conditional on the outcome.`,
      shadow: `You tie your sense of purpose to the wheel's current position — purposeful when things go well, purposeless the moment they turn, as if meaning itself rose and fell with circumstance alone.`,
      invitation: `Find your footing today in your relationship to the turning, not in where the wheel currently sits.`,
    },

    // ── 11 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '11_E': {
      title: `11 in Soul Center — Strength`,
      tagline: `A Design of Purposeful Endurance`,
      mastery: `You feel most like yourself holding something difficult without fighting it or fleeing it. That's real, embodied endurance, not mere stubbornness dressed up as calm. It holds because it's chosen, not just endured.`,
      shadow: `You confuse endurance itself with the purpose, holding weight indefinitely as an identity rather than as a means toward something else that actually needs it held for a while. Weight held forever stops serving anything real.`,
      invitation: `Let your steadiness serve something beyond itself today — a relationship, a piece of work, not just the holding.`,
    },

    // ── 12 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '12_E': {
      title: `12 in Soul Center — The Hanged Man`,
      tagline: `A Design of the Returned Surrender`,
      mastery: `You feel most like yourself once you've stopped forcing an answer and let one actually arrive on its own time. That's real meaning found through voluntary surrender, not passivity.`,
      shadow: `You stay suspended indefinitely, treating the not-knowing itself as the purpose instead of the passage toward one it was actually meant to be all along. Suspension on its own resolves nothing.`,
      invitation: `Take the new angle your last surrender revealed and actually act on it today.`,
    },

    // ── 13 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '13_E': {
      title: `13 in Soul Center — Transformation`,
      tagline: `A Design of Genuine Becoming`,
      mastery: `You feel most like yourself in the act of becoming — willing to let old versions of yourself die for a truer one, over and over, without needing to stay who you already were. The becoming doesn't need to be loud to be real.`,
      shadow: `You manufacture endings for their own sake, mistaking constant reinvention for the deeper transformation this actually asks for, when what's needed instead is patience. Reinvention isn't the same thing as growth.`,
      invitation: `Let one transformation today be slow and quiet instead of dramatic.`,
    },

    // ── 14 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '14_E': {
      title: `14 in Soul Center — Temperance`,
      tagline: `A Design of Earned Synthesis`,
      mastery: `You feel most like yourself in the space between extremes, where genuine synthesis happens gradually, over time, rather than through a single decisive choice made once. The middle is a real place, not a compromise.`,
      shadow: `You use the blending as an excuse to avoid fully engaging either side, staying so centered that nothing actually gets lived with any real intensity or commitment to it. Nothing centered ever gets lived at full intensity.`,
      invitation: `Fully inhabit one side of something today before trying to blend it.`,
    },

    // ── 15 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '15_E': {
      title: `15 in Soul Center — The Devil`,
      tagline: `A Design of Metabolized Shadow`,
      mastery: `You feel most like yourself metabolizing your own darker material instead of denying it exists at all. That's real honesty, and it leads to real liberation over time. That honesty is what actually frees you.`,
      shadow: `You get fascinated with the darkness itself, circling your own shadow material endlessly without ever actually working it through to the freedom it was supposed to lead toward eventually.`,
      invitation: `Take one honest look at something you've been circling today, and let it actually free something.`,
    },

    // ── 16 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '16_E': {
      title: `16 in Soul Center — The Tower`,
      tagline: `A Design of Earned Clarity`,
      mastery: `You feel most like yourself in the aftermath of a real reorganization, once the dust settles and you can finally see clearly what's actually still standing. The clarity was always going to arrive either way.`,
      shadow: `You need the collapse itself to feel purposeful, sometimes provoking crisis because gradual, quiet clarity feels less convincing to you than a dramatic one would. Manufactured crisis isn't the same as real change.`,
      invitation: `Let one piece of clarity arrive gently today instead of waiting for collapse to force it.`,
    },

    // ── 17 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '17_E': {
      title: `17 in Soul Center — The Star`,
      tagline: `A Design of Reciprocal Hope`,
      mastery: `You feel most like yourself actively replenishing something — trusting the process before there's any proof yet that it's working, and staying with it anyway, patiently. The trust itself is the practice.`,
      shadow: `You pour hope outward so consistently that your own reserves run dry, offering renewal to everyone except yourself, as though you alone were exempt from needing any back. Hope given only outward eventually runs out.`,
      invitation: `Let yourself be replenished by someone today instead of only replenishing others.`,
    },

    // ── 18 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '18_E': {
      title: `18 in Soul Center — The Moon`,
      tagline: `A Design of Trusted Feeling`,
      mastery: `You feel most like yourself honoring what you sense rather than only what you can prove outright with hard evidence. That's real intuition, genuinely trusted. The sense is worth trusting on its own terms.`,
      shadow: `You get lost in the depths without a clear way back to functioning, letting the felt sense override any grounded engagement with the reality actually in front of you right now. Feeling untethered from reality helps no one.`,
      invitation: `Anchor one intuition today to something concrete — a number, a conversation, a real decision.`,
    },

    // ── 19 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '19_E': {
      title: `19 in Soul Center — The Sun`,
      tagline: `A Design of Uncomplicated Radiance`,
      mastery: `You feel most like yourself in unguarded joy — simply radiating who you already are, with nothing extra required to justify it or earn it first. That's real, uncomplicated purpose.`,
      shadow: `You believe purpose this simple can't possibly be enough, searching for something more complicated to prove yourself with and dimming your natural radiance in the process of looking.`,
      invitation: `Let one moment of simple joy today count as purpose, with no bigger mission required to justify it.`,
    },

    // ── 20 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '20_E': {
      title: `20 in Soul Center — Judgement`,
      tagline: `A Design of the Ongoing Awakening`,
      mastery: `You feel most like yourself rising to meet a call you could have easily ignored instead. That's real, ongoing awakening, chosen again and again rather than granted once. The call doesn't wait for perfect readiness.`,
      shadow: `You hear the call and endlessly prepare to answer it, using self-improvement as a substitute for the actual leap, so the preparation itself quietly becomes a way of never arriving anywhere.`,
      invitation: `Answer one call today before you feel fully ready.`,
    },

    // ── 21 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '21_E': {
      title: `21 in Soul Center — The World`,
      tagline: `A Design of Earned Arrival`,
      mastery: `You feel most like yourself in a moment of real, earned arrival, however temporary it turns out to be afterward. Genuine completion, genuinely felt, not merely declared out loud. The arrival deserves to be actually felt.`,
      shadow: `You refuse to ever call anything complete, treating wholeness as a permanently receding goal, because arriving would mean facing whatever comes right after it. Nothing ever gets to just be finished.`,
      invitation: `Let yourself actually land in one "this is whole" moment today, before the next cycle begins.`,
    },

    // ── 22 in SOUL CENTER (E · Center / Comfort Zone / Foundation of Purpose) ─
    '22_E': {
      title: `22 in Soul Center — The Fool`,
      tagline: `A Design of Accumulating Trust`,
      mastery: `You feel most like yourself at the edge of something new, stepping forward without needing a guarantee first — real, uncommon trust rather than simple naivety. That trust compounds the more it's used.`,
      shadow: `You treat every fresh start as an escape from whatever the last one asked of you, so nothing ever actually accumulates into a deeper, more tested version of yourself. Nothing ever gets the chance to actually deepen.`,
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
