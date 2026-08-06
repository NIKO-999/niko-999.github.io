'use strict';

/**
 * Destiny Matrix — Ideal Partner Archetype (Love Channel)
 * ─────────────────────────────────────────────────────────────
 * Source: research/01-Foundation/DestinyMatrix-Sheet.extracted.md
 * "Page 14 — Ideal Partner Alignment by Arcana (Love Channel)", a complete,
 * unambiguous 22-row table (Arcana → "Partner who is:"). The keyword traits
 * in that table are the substance of THE PARTNER field; per
 * NON_NEGOTIABLE_RULES they are rewritten into continuous second-person
 * Golden Standard prose rather than shipped as keyword lists, and the
 * remaining three fields are original psychological work built on top of
 * them. "Ideal Partner Archetype" is also one of the named positions on the
 * cheat-sheet label list (Destiny-Matrix-Calculation-Guide.extracted.md
 * lines 505-545).
 *
 * VALUE MAPPING — read research/11-Research-Updates/33 before changing this.
 * This position reuses `_vals.love`, the app's shipped Love Channel value.
 * That is a deliberate, user-ratified decision ("Option A"), not an
 * oversight:
 *   - The source (337pages pp.146-148) puts Ideal Partner at "point O" on
 *     the Prosperity Line, which runs M -> L. The engine's own chakra
 *     letters give M = D+E and L = C+E — exactly the endpoints of this
 *     app's Love/Money channel. `loveV` (the 1/3 point, between M and the
 *     midpoint) is where O falls. That is well-supported inference, NOT
 *     source-confirmed arithmetic — no formula for point O exists anywhere
 *     in the corpus.
 *   - js/matrix-engine.js's `channels.I` is labelled "Ideal Partner
 *     Archetype" but is NOT used here and must not be. It belongs to an
 *     orphaned scheme that contradicts the app's shipped values (for
 *     1990-06-15: channels.I = 16 vs loveV = 6). Wiring it up would put a
 *     number on screen that disagrees with the Love star beside it.
 * Sharing a numeric source with the LOVE star is explicitly permitted by
 * NON_NEGOTIABLE_RULES' Absolute System Isolation clause so long as each
 * position gets its own dedicated star and its own freshly-written content
 * — the same technique already used by CAREER/_vals.mon and GA/NODES[1].
 *
 * FOUR SECTIONS, per the user's explicit cap and chosen naming:
 *   partner    -> THE PARTNER    · who actually suits you
 *   attraction -> THE ATTRACTION · how the two of you mix when it works
 *   friction   -> THE FRICTION   · how this specific pairing strains
 *   invitation -> INVITATION     · standard Golden Standard close
 * `title`/`tagline` are heading chrome, not body sections.
 *
 * API:
 *   DIdealPartnerContent.get(num) -> { title, tagline, partner, attraction,
 *                                      friction, invitation } or null
 */

window.DIdealPartnerContent = (function () {
  const data = {
    1: {
      title: `Ideal Partner 1 — Someone Who Also Moves First`,
      tagline: `A Partner Who Sparks Motion`,
      partner: `The person who genuinely fits you arrives with their own direction already running. They're confident without needing to run the room, and proactive in a way that means you're never the only one starting things. They stimulate you mentally — conversation with them goes somewhere rather than circling. Crucially, they treat your independence as one of the things they like about you, not a problem to be managed. Being around them tends to make you want to grow rather than settle.`,
      attraction: `What works between you is momentum. Neither of you waits for permission, so plans actually happen instead of being discussed indefinitely. You sharpen each other — their ideas land on someone who engages rather than defers, and yours meet the same. There's real relief in not having to drag someone along, and in not being dragged. You get to be fully yourself at full speed, which is rarer than it sounds.`,
      friction: `Two people who both move first will eventually move in different directions at the same moment. Competition can slip in where partnership was meant to be, each of you quietly keeping score of whose plan won. The independence you both protect can harden into two parallel lives that share an address and little else. Neither of you is naturally the one who slows down and asks how the other is actually doing, so that question can go unasked for a long time. The relationship rarely fails loudly here — it just gradually stops being tended.`,
      invitation: `Ask yourself honestly whether you've been treating your closest relationship as a place to win rather than a place to be known. This week, let their plan be the one you follow, once, without amending it. You are allowed to want a strong, self-directed partner and still need to be softened by them. Where have you mistaken independence for intimacy?`,
    },
    2: {
      title: `Ideal Partner 2 — Someone Who Reads You Without Being Told`,
      tagline: `A Partner of Quiet Attunement`,
      partner: `Look for someone emotionally sensitive — a person who notices the shift in you before you've decided to mention it. They're intuitive rather than interrogating, patient in a way that doesn't feel like waiting, and genuinely respectful of your personal space. They understand deeply instead of quickly, which means they don't need everything explained to stay close. With them, being known doesn't require you to perform being open.`,
      attraction: `Closeness gets built here in the quiet. Neither of you needs the relationship narrated to believe in it, so a great deal gets communicated without much being said. They give you room without withdrawing, which is a specific and uncommon skill. You can be genuinely unguarded around someone who won't rush or flatten what they find. That combination tends to produce a kind of safety most people spend years looking for.`,
      friction: `Two people this attuned can become expert at sensing everything and saying nothing. Small hurts go unnamed because you both assume they've been noticed and forgiven, and they quietly accumulate instead. The respect for space can slowly widen into distance neither of you chose or admits to. Because nothing is ever explicitly wrong, there's rarely a moment that forces the conversation. The relationship can drift for a long time while both of you privately feel it.`,
      invitation: `Consider what you've been waiting for them to notice rather than say out loud. This week, name one small thing directly, in plain words, before it has a chance to settle. You are allowed to be deeply understood and still have to use sentences. What has gone unspoken between you simply because it was sensed?`,
    },
    3: {
      title: `Ideal Partner 3 — Someone Whose Warmth Is Unmistakable`,
      tagline: `A Partner of Open Abundance`,
      partner: `Warmth is the non-negotiable here, and it has to be nurturing in a way that's obvious rather than inferred. They're generous — with time, attention, affection — and they don't ration it to keep the upper hand. Beauty matters to them, so the life you build together has texture instead of only function. Above all they're emotionally available, which means you don't have to work to reach them. Their care arrives without you having to earn or request it.`,
      attraction: `You flourish with someone whose affection is a given rather than a variable. Being met that openly lets you stop bracing, and a lot of your own generosity becomes available once it isn't being defended. Together you tend to make things — a home, a table people want to sit at, a life with some pleasure in it. Neither of you treats warmth as weakness, so it never has to be smuggled in sideways. The relationship gives more than it costs, which changes what you're each capable of elsewhere.`,
      friction: `Abundance shared this freely can quietly stop being counted. Care becomes so constant that neither of you notices it's flowing mostly one way until resentment has already set in underneath the comfort. Comfort itself can become the point, and a partnership built for pleasure can lose its appetite for anything difficult. Hard conversations get postponed because the atmosphere is too nice to disturb. What was generous can slowly become indulgent, and neither of you is naturally the one to say so.`,
      invitation: `Name the uncomfortable thing you've been leaving unsaid to keep the mood intact. This week, raise it while things are good, rather than waiting for a moment bad enough to justify it. You are allowed to have real ease with someone and still tell them the truth. What has warmth been protecting you both from facing?`,
    },
    4: {
      title: `Ideal Partner 4 — Someone Who Actually Holds`,
      tagline: `A Partner of Real Ground`,
      partner: `You need someone reliable in the literal sense — what they say will happen, happens. They're strong without being severe, responsible by instinct rather than obligation, and genuinely protective of what matters to them. They can provide stability and take the lead when leading is called for. With them, you stop running the background calculation about whether the ground will hold.`,
      attraction: `What gets built between you lasts, and it lasts on purpose. Their steadiness gives you a base solid enough to take real risks from, which is the actual point of stability. You don't spend energy managing them, and they don't spend energy proving themselves to you. Plans made between you tend to survive contact with reality. That reliability compounds — years in, you'll have something most people are still trying to start.`,
      friction: `Structure this dependable can quietly become the whole relationship. The roles you each settle into stop being chosen and start being assumed, and neither of you notices when they've stopped fitting. Their protectiveness can slide into control, or into deciding things on your behalf that were yours to decide. Stability can start to look a lot like nothing changing, ever. And because so little is visibly wrong, the case for changing anything never quite gets made.`,
      invitation: `Think about which arrangement between you was decided years ago and has never been revisited since. This week, reopen one of them out loud, even though it's currently working. You are allowed to have solid ground and still want it rearranged. Where has stability quietly turned into a rut you both stopped questioning?`,
    },
    5: {
      title: `Ideal Partner 5 — Someone Who Means It`,
      tagline: `A Partner of Shared Conviction`,
      partner: `Loyalty is the thing that actually holds you, in the old-fashioned, unglamorous sense of the word. Their values are explicit — they know what they believe and live accordingly, and they're aligned with you spiritually or morally in a way that isn't negotiated case by case. They're genuinely ready for commitment rather than performing readiness. Tradition means something to them, whether inherited or built from scratch with you. You can trust the shape of the thing they're offering.`,
      attraction: `What holds between you is shared conviction. You're not constantly renegotiating the basics, which frees an enormous amount of energy for actually living. Their loyalty isn't conditional on the relationship being easy that month. You both take promises seriously enough that making one actually means something. That produces a rare kind of security: not just that they'll stay, but that you both know what staying is for.`,
      friction: `Two people this committed to a set of principles can end up serving the principles instead of each other. The framework becomes the authority, and questioning any part of it starts to feel like betrayal rather than maintenance. Duty can quietly replace desire, and a relationship held together by conviction alone gets very tired. Neither of you finds it easy to say the arrangement isn't working, because you both believe in honouring arrangements. The commitment survives long after the thing it was protecting has gone quiet.`,
      invitation: `Be honest about whether you're staying out of love or out of principle — and whether you know the difference right now. This week, ask them what they'd want between you if no rule required anything. You are allowed to keep your promises and still question the shape of them. What have you been honouring that you never actually chose?`,
    },
    6: {
      title: `Ideal Partner 6 — Someone Who Chooses You On Purpose`,
      tagline: `A Partner of Conscious Choosing`,
      partner: `Romance matters to you, but only the kind that's specific rather than vague, and communicative in a way that means things get said rather than implied. They're emotionally open — you learn what they feel from them, not from deduction. Most importantly, they choose the relationship consciously and keep choosing it, rather than drifting into it and staying by default. Being wanted deliberately is the thing that actually lands with you.`,
      attraction: `You two talk, and it works. Difficulty gets addressed while it's still small, because neither of you treats a hard conversation as an emergency. There's real romance here, and it survives contact with ordinary life because it's tended rather than assumed. Both of you know why you're in this, and can say so. That deliberateness gives the relationship a spine most affectionate pairings never develop.`,
      friction: `A relationship this conscious can turn into a relationship permanently under review. Every difficulty becomes a matter for discussion, and the discussing starts to eat the living. Choosing each other daily can quietly become re-auditing each other daily, which is exhausting and reads as doubt. The romance can start requiring maintenance at a level that leaves neither of you resting in it. Constantly examining whether something is right is not the same as being in it.`,
      invitation: `Notice whether you've been processing the relationship more than actually inhabiting it. This week, let one small friction pass unexamined and see whether it survives being ignored. You are allowed to choose someone consciously and still stop asking whether you're sure. When did you last simply enjoy them without evaluating anything?`,
    },
    7: {
      title: `Ideal Partner 7 — Someone Going Somewhere`,
      tagline: `A Partner of Shared Forward Motion`,
      partner: `Drive is what you respond to: someone ambitious and genuinely active, a person with somewhere they're headed and the drive to get there. They're goal-driven without being joyless, and they support movement rather than resisting it when you want to change something. Shared victories mean something real to them; they want to win with you, not merely near you. Their forward motion energises you instead of leaving you behind.`,
      attraction: `Progress happens between you, and it's genuinely fun. Ambition doesn't have to be apologised for or downplayed, so both of you operate closer to full capacity. You celebrate properly, which is a skill plenty of driven people never learn. Their momentum and yours compound rather than compete when you're aimed at the same thing. Years in, you'll be able to point at things that exist because you were together.`,
      friction: `A partnership organised around going somewhere struggles to sit still. Rest gets treated as a lull to be tolerated, and the relationship can lose the ability to simply be, with nothing being achieved. When your goals diverge — and eventually they will — the machinery you built for shared progress has no gear for that. Achievement can quietly become the only currency of the relationship, so a difficult season with nothing to show feels like failure. Neither of you naturally slows down long enough to notice how tired the other actually is.`,
      invitation: `Try to remember when the two of you last spent unproductive time together and enjoyed it. This week, take an evening with no purpose attached and don't fill it with planning. You are allowed to be ambitious together and still be worth something to each other at rest. What would you two be if you weren't building anything?`,
    },
    8: {
      title: `Ideal Partner 8 — Someone Straight With You`,
      tagline: `A Partner of Clean Dealing`,
      partner: `You need someone fair — a person whose sense of what's right doesn't bend to whoever's most upset in the room. They're honest, including when honesty costs them something. They're emotionally balanced rather than volatile, genuinely respectful of boundaries, and reliable in agreements: what you two decide is what actually happens. There's no hidden ledger with them, which is precisely what lets you relax.`,
      attraction: `Between you, things are clean. Neither of you plays games or expects the other to decode a mood, so conflict stays about the actual issue. Agreements hold, which means trust builds fast and doesn't have to be rebuilt after every disagreement. You can raise something difficult without triggering a week of fallout. That evenness is unglamorous and it's the reason this pairing tends to last.`,
      friction: `Fairness held too tightly turns into accounting. The relationship can start running on who did what and whether it balanced, which is a poor substitute for generosity. Emotional balance can become emotional flatness — both of you so committed to being reasonable that nothing is ever said with heat. Being right can quietly matter more than being close, and you can each be scrupulously fair and still lonely. Love isn't actually a fair exchange, and this pairing can take a long time to admit that.`,
      invitation: `Notice whether you've been keeping score with someone you're supposed to be on the same side as. This week, give something without it being owed or evening anything out. You are allowed to be treated fairly and still want to be indulged. Where has being fair to each other replaced being generous with each other?`,
    },
    9: {
      title: `Ideal Partner 9 — Someone Who Doesn't Need Filling`,
      tagline: `A Partner of Whole Solitude`,
      partner: `Self-sufficiency is the quality that matters most here — they arrive whole rather than looking to be completed. They're wise in a way that comes from having actually thought about things, and mature enough not to need constant reassurance. They respect solitude, yours and their own, and don't read your need for space as rejection. They're deep and thoughtful, so the time you do spend together carries real weight.`,
      attraction: `Neither of you is trying to fill a hole with the other, which changes everything. Time apart doesn't damage anything, so time together is chosen rather than required. Your conversations go where most relationships never get, because you both arrive with something to bring. There's no performance of neediness to keep the connection alive. What you have is unusually durable precisely because it isn't load-bearing for either of your identities.`,
      friction: `Two self-sufficient people can be so good at not needing each other that they stop reaching at all. Independence becomes the habit, and the relationship quietly runs on less and less contact until there's barely anything left to maintain. Depth without frequency isn't intimacy — it's occasional good company. Neither of you will raise the alarm, because neither of you is uncomfortable, and that's exactly the danger. You can lose a real connection here without either person doing a single thing wrong.`,
      invitation: `Think back to when you last needed them out loud, rather than simply appreciating them from a comfortable distance. This week, reach for them at a moment you'd normally handle alone. You are allowed to be entirely self-sufficient and still choose to depend on someone. What would change if you let them be necessary?`,
    },
    10: {
      title: `Ideal Partner 10 — Someone Who Bends With It`,
      tagline: `A Partner Who Turns With the Wheel`,
      partner: `Flexibility is what you need beside you: a person who adapts when circumstances change instead of digging in. They're optimistic in a grounded way, genuinely open to change rather than merely tolerant of it, and able to grow through life's cycles alongside you rather than resenting each turn. When things shift, they shift, and they don't need the shift to be anyone's fault. Their adaptability is what lets the two of you survive the parts nobody planned for.`,
      attraction: `You two ride change well. Where most couples fracture — a move, a loss, a reinvention — you tend to reorganise and carry on. Neither of you needs life to stay recognisable to feel secure, so you can each become someone new without it ending things. Their optimism keeps the hard stretches from calcifying into bitterness. Over a long enough timeline, this is one of the most survivable pairings there is.`,
      friction: `Two people this adaptable can adapt around problems instead of solving them. Every difficulty gets absorbed, reframed, and moved past, so nothing ever gets properly dealt with. Flexibility can become a refusal to hold any firm position, which leaves the relationship without a shape. Optimism can quietly turn into not looking directly at what's wrong. You can weather a decade of change together and still never have had the one conversation that actually mattered.`,
      invitation: `Identify the problem the two of you have adapted around so many times you've stopped calling it a problem. This week, name it plainly instead of adjusting to it again. You are allowed to be endlessly adaptable and still refuse to accept something. What have you been flexible about that actually needed a firm position?`,
    },
    11: {
      title: `Ideal Partner 11 — Someone With Real Heat`,
      tagline: `A Partner of Steady Fire`,
      partner: `You belong with someone passionate — not merely intense, but genuinely warm-blooded about what and who they love. They're emotionally strong, able to hold their own feelings and yours without being knocked over. They're supportive in a way that builds you rather than shelters you, and they actively encourage your confidence instead of quietly preferring you smaller. Mutual empowerment is the actual mode here: they get bigger when you do.`,
      attraction: `Each of you makes the other braver. Their belief in you isn't flattery, so it actually changes what you attempt. There's real passion here, and it holds up over time because it's rooted in respect rather than novelty. Neither of you is threatened by the other's strength, which is rarer than it should be. You end up living a larger life than either of you would have alone, and both of you know it.`,
      friction: `Two strong people generate real heat, and heat burns as easily as it warms. Arguments between you can escalate fast, because neither of you backs down and both of you can take it. The mutual encouragement can turn into mutual pressure, where rest looks like letting the other down. Passion can start to require intensity to feel real, so peaceful stretches get mistaken for something going wrong. You can wear each other out while sincerely trying to build each other up.`,
      invitation: `Consider whether you've been pushing them when what they actually needed was to be let alone. This week, offer them ease instead of encouragement, and see what it does. You are allowed to be strong together and still be gentle with each other. Where has your belief in them started to feel like a demand?`,
    },
    12: {
      title: `Ideal Partner 12 — Someone Who Can Sit With It`,
      tagline: `A Partner of Patient Presence`,
      partner: `Compassion in the practical sense is the requirement — able to be present to something hard without rushing to fix it. They're patient on a timescale most people can't manage, and genuinely empathetic rather than merely sympathetic. They're willing to support real emotional and spiritual growth, including the slow, unimpressive middle of it. With them, you're allowed to be in process rather than finished.`,
      attraction: `You two can go through things together. Neither of you panics when the other is struggling, so struggle doesn't have to be hidden. Their patience gives you room to change at your actual pace instead of a performed one. There's a depth of acceptance here that lets both of you be genuinely seen mid-mess. Very few pairings can hold that, and it's the reason this one can survive seasons that would end others.`,
      friction: `Patience this deep can become permission for nothing to ever change. Waiting turns into the whole relationship, and the growth you were both being patient about quietly stops happening. Compassion can slide into carrying someone who has stopped trying to carry themselves. Neither of you will name it, because naming it feels like a failure of the very kindness the relationship runs on. You can spend years being beautifully supportive of a situation that needed a deadline.`,
      invitation: `Name what you've been endlessly patient about that has genuinely stopped moving. This week, say plainly what you actually need to see change, with a real timeframe attached. You are allowed to be deeply compassionate and still expect something. Where has patience become a way of avoiding the harder conversation?`,
    },
    13: {
      title: `Ideal Partner 13 — Someone Unafraid of the Ending`,
      tagline: `A Partner Who Can Begin Again`,
      partner: `You need someone genuinely ready for transformation — a person who can let a version of things die without treating it as catastrophe. They're honest, sometimes bluntly, and courageous enough to say the thing that changes the situation. They're open to renewal rather than clinging to how it used to be. With them, the relationship is allowed to become something else instead of having to stay what it was.`,
      attraction: `Change that would end most couples doesn't end this, because neither of you confuses an ending with a failure. Honesty is possible here at a level most relationships never reach. You can each become an entirely different person and still be together, because the bond isn't attached to a fixed version of either of you. There's enormous freedom in that. What you have gets renewed rather than merely preserved.`,
      friction: `A pairing this comfortable with endings can start reaching for them too readily. Difficulty gets met with demolition when repair would have done, and the reflex to transform can dismantle things that were working. Honesty without tenderness becomes a weapon, especially between two people who can both take a hit. The cycle of ending and rebuilding can become the relationship itself, exciting and exhausting in equal measure. Not everything that's hard is finished, and this pairing can be slow to tell the difference.`,
      invitation: `Sit with whether the thing you're ready to end actually needs ending, or just needs attention. This week, repair one thing you'd normally have torn down and started over. You are allowed to be unafraid of endings and still fight for something. What have you been willing to lose that was worth keeping?`,
    },
    14: {
      title: `Ideal Partner 14 — Someone Who Levels You Out`,
      tagline: `A Partner of Long Harmony`,
      partner: `Calm is what settles you, and it has to be genuine — not as a performance over something tense. They're harmonious by instinct, emotionally balanced, and able to blend differences rather than sharpen them. They support healing, including the slow kind that takes years and doesn't announce itself. What they're building with you is meant for the long run, and they act like it from the beginning.`,
      attraction: `Between you, things settle. Neither of you needs drama to feel the relationship is alive, so an enormous amount of ordinary damage simply never happens. Their steadiness regulates you, and you can feel it in your body when you're around them. Differences get blended into something workable instead of being fought over. The result is a relationship that heals both of you slightly, just by being what it is.`,
      friction: `Harmony maintained too carefully becomes avoidance wearing good manners. Real disagreement gets smoothed before it's fully surfaced, so the actual issue never gets its hearing. Calm can flatten into an absence of passion, and neither of you is naturally the one to disturb the peace. Balance can quietly mean nobody ever gets what they strongly want, because wanting strongly would unbalance things. It's possible to be beautifully at peace and slowly bored.`,
      invitation: `Think of what you've wanted strongly and softened before saying, so as not to disturb the balance. This week, say it at full strength and let the peace absorb it. You are allowed to want harmony and still be a person with sharp edges. What has calm been costing the two of you?`,
    },
    15: {
      title: `Ideal Partner 15 — Someone Who Wants Without Grasping`,
      tagline: `A Partner of Conscious Desire`,
      partner: `Appetite is central here: someone passionate and sensual, genuinely embodied rather than living from the neck up. They're emotionally intense, and they don't apologise for the force of what they feel. The essential quality is the one the source names precisely: capable of conscious desire without dependency. They want you fully and are not diminished by not having you at any given moment. That combination is what makes intensity safe with them.`,
      attraction: `What you two have is charged, and it stays that way. Neither of you performs a smaller appetite to seem reasonable, so a great deal that other couples suppress is simply available here. There's real honesty about wanting — for each other, for things, for life — which is unusual and freeing. Their intensity doesn't come with strings, so you can meet it fully without losing yourself. Few pairings are this alive this far in.`,
      friction: `Intensity is the easiest thing in the world to mistake for intimacy. The heat can become the measure of the relationship, so quiet stretches read as decline and get inflamed on purpose. Conscious desire can slip, quietly, into dependency — on each other, on the charge itself, on whatever keeps the volume up. Possessiveness arrives dressed as passion and is hard to name for what it is. You can be gripped by each other and not actually close.`,
      invitation: `Look squarely at whether what you're calling passion has started to feel more like need. This week, spend an evening together with nothing charged about it and notice what's still there. You are allowed to want someone this much and still hold them loosely. Where has desire quietly become dependency?`,
    },
    16: {
      title: `Ideal Partner 16 — Someone Who Rebuilds`,
      tagline: `A Partner Who Stays Through Collapse`,
      partner: `You need someone honest and emotionally mature enough to stay in the room when things fall apart. They're able to rebuild after crises rather than being defined by them, and genuinely supportive during change instead of only afterward. They don't flinch from a hard truth, theirs or yours. What matters most is that upheaval doesn't send them looking for the exit — they're steady precisely when things aren't.`,
      attraction: `Crisis is where this pairing is at its best, which is worth more than being good on an easy day. Honesty between you means problems get named while they're still solvable. When something does collapse, neither of you treats it as proof the relationship was a mistake, so you rebuild rather than scatter. Their maturity means you're not managing them through your own hard seasons. What you have is tested, and both of you know it holds.`,
      friction: `A pairing that's excellent in crisis can become dependent on having one. Ordinary, uneventful life can feel strangely flat, and one of you may unconsciously generate turbulence to restore the sense of purpose. Honesty without timing becomes bluntness that wounds more than it clarifies. Constantly rebuilding can mean never actually living in the thing you've built. You can be superb at surviving together and unpractised at simply being happy.`,
      invitation: `Notice whether you two are better at surviving each other than enjoying each other. This week, do something together that has no problem in it at all. You are allowed to be strong in crisis and still want an ordinary, uneventful life. What would you be to each other with nothing to rebuild?`,
    },
    17: {
      title: `Ideal Partner 17 — Someone Who Believes In You Out Loud`,
      tagline: `A Partner of Gentle Hope`,
      partner: `Encouragement is what reaches you — someone inspiring without being demanding, and gentle in a way that's strength rather than softness. They're emotionally supportive by instinct, hopeful in a manner that survives contact with reality, and they actively encourage your dreams instead of quietly hoping you'll be more practical. They want you to be authentic more than they want you to be impressive. Being around them makes the future feel genuinely open.`,
      attraction: `They see who you actually are and want more of it, not less. That's rare enough to change a life, and it changes yours. Their hope isn't naive — it's a decision, and it lifts you without pressure attached. You can bring them something half-formed and fragile and it will be handled well. Between you there's real permission to become, which most people never get from anyone.`,
      friction: `Hope this consistent can drift away from what's actually happening. Encouragement can become a habit that neither of you can interrupt with a hard truth, so real problems get met with warmth instead of scrutiny. Gentleness can mean nobody ever says the blunt thing that would have helped. Idealising each other is lovely right up until one of you fails to be the idealised version, and then the fall is steep. Being believed in relentlessly can quietly become its own pressure.`,
      invitation: `Look at what you've been encouraging in them that actually needed honest pushback instead. This week, say the realistic thing kindly rather than the hopeful thing automatically. You are allowed to believe in someone completely and still tell them the truth. Where has gentleness kept you both from something real?`,
    },
    18: {
      title: `Ideal Partner 18 — Someone Who Isn't Frightened By Depth`,
      tagline: `A Partner of Safe Deep Water`,
      partner: `Depth is the requirement: someone emotionally deep and genuinely intuitive, a person at home in feeling rather than unnerved by it. They're sensitive without being fragile, and crucially, they're safe: what you show them is held rather than used. They can navigate strong emotion, theirs and yours, without fear or flight. With them, the parts of you that are complicated don't have to be simplified first.`,
      attraction: `Nothing is too deep to go into together. Neither of you needs feelings explained or justified, so an entire layer of translation just disappears. Their intuition means you're often understood before you've finished forming the thought. There's real safety here for things you've never risked showing anyone. What you have reaches a depth most relationships don't have the equipment for.`,
      friction: `Two people this deep can lose the surface entirely. Everything becomes significant, every mood gets read as meaning, and the relationship acquires an intensity that's exhausting to sustain. Intuition can slide into assumption — each of you sure you know what the other feels, and neither checking. Emotional weather can be mistaken for truth, and a bad week can feel like a verdict on the whole thing. You can drown together in what was meant to be intimacy.`,
      invitation: `Think about what you've assumed they were feeling lately without ever confirming it. This week, ask instead of reading, even though you're usually right. You are allowed to be this attuned and still get it wrong sometimes. Where has intuition replaced actually asking?`,
    },
    19: {
      title: `Ideal Partner 19 — Someone Genuinely Glad`,
      tagline: `A Partner of Uncomplicated Warmth`,
      partner: `Gladness is what you need near you, the uncomplicated kind — happy without it being a project. They're open-hearted, positive by disposition rather than by effort, and they actively want shared happiness rather than parallel contentment. Creativity matters to them, so there's play in the life you build. Their gladness is real, which means being around them is genuinely restorative rather than merely pleasant.`,
      attraction: `Life alongside them is light in the best sense. Joy is the default setting rather than an achievement, so both of you spend far less energy managing your own mood. You create things together — plans, jokes, a life with some colour in it. Their warmth is generous and doesn't need reciprocating on a schedule. People notice what the two of you are like together, which tells you something.`,
      friction: `A relationship organised around happiness struggles to make room for its absence. Grief, depression, or a genuinely bad season can feel like a betrayal of the arrangement, so it gets hidden rather than shared. Positivity can become mandatory, and neither of you wants to be the one who brings the weather down. Depth can get sacrificed to brightness, leaving the connection lovely and slightly thin. The harder feelings don't disappear — they just stop being welcome.`,
      invitation: `Be honest about what you've been keeping cheerful about with them that you're not actually cheerful about. This week, bring them the unhappy version and don't lighten it at the end. You are allowed to be a joyful pairing and still be sad in front of each other. What has brightness made unwelcome between you?`,
    },
    20: {
      title: `Ideal Partner 20 — Someone With a Reason`,
      tagline: `A Partner of Shared Calling`,
      partner: `You need someone purpose-driven — a person whose life is organised around something they'd call meaningful. They're emotionally mature, spiritually aware in whatever idiom is true for them, and genuinely supportive of your growth at the level of who you're becoming rather than what you're achieving. They take the deep questions seriously. With them, the relationship is part of a larger answer rather than a distraction from one.`,
      attraction: `Both of you are pointed the same way, and that's the whole foundation. Conversations go to what actually matters without either of you having to justify the detour. Their support is aimed at your becoming, not your comfort, which is a harder and better kind of love. You each hold the other to something. What you build together tends to matter beyond the two of you, and both of you want that.`,
      friction: `A relationship this purposeful can forget to be a relationship. The mission becomes the point, and the two of you become colleagues in meaning rather than people who delight in each other. Growth can become an expectation, so an ordinary stretch where neither of you is transforming feels like stalling. Judgement creeps in — subtle, spiritual, and hard to name — about whether the other is living up to it. You can be profoundly aligned and quietly starved of simple affection.`,
      invitation: `Try to recall when you last enjoyed them for no reason connected to growth or meaning at all. This week, do something together that serves no purpose whatsoever. You are allowed to share a calling and still be silly with each other. Where has purpose crowded out ordinary affection?`,
    },
    21: {
      title: `Ideal Partner 21 — Someone With a Wide World`,
      tagline: `A Partner of Shared Horizon`,
      partner: `Breadth is what keeps you interested: someone open-minded and genuinely wide-ranging, a person whose world extends well past their own street. They're globally oriented in outlook, supportive of expansion rather than nervous about it, and they hold freedom as a value for both of you. They want a shared life vision rather than merely shared logistics. With them, being together doesn't mean the world gets smaller.`,
      attraction: `There is real room in what you build. Neither of you experiences the other's growth as a threat, so both of you can keep expanding without it costing the relationship. Their breadth means there's always somewhere new to go together, literally or otherwise. Freedom and commitment aren't in tension here, which is the thing you most needed and rarely find. What you have has room in it.`,
      friction: `A relationship with this much room can end up mostly room. Freedom protected too carefully becomes distance nobody chose, and the wide-open life leaves little that's specifically, dailyly shared. Vision can stay permanently at the horizon while the ordinary business of being close goes untended. Neither of you is naturally the one to ask for more closeness, because asking feels like restriction. You can share an entire worldview and not much of an actual life.`,
      invitation: `Notice whether the freedom between you has quietly turned into distance. This week, ask for something small, specific and domestic from them. You are allowed to want a wide-open life and still need someone close in it. What has all this room been keeping you from asking for?`,
    },
    22: {
      title: `Ideal Partner 22 — Someone Still Open`,
      tagline: `A Partner of Unguarded Trust`,
      partner: `Lightness is what disarms you: someone free-spirited and playful, genuinely light rather than performing lightness. They're open to new experience, trusting in a way that hasn't been strategised, and they actively support your authenticity rather than your presentability. They haven't armoured up, which is what makes them so easy to be near. With them, you don't have to be a finished, defended version of yourself.`,
      attraction: `You two keep each other young in the way that actually matters. Play is genuinely available, and neither of you has to be talked into it. Their trust invites your own, so a great deal of ordinary self-protection just becomes unnecessary. There's real permission here to be unpolished, uncertain, and still fully wanted. What you have feels less like a negotiation than most relationships ever manage.`,
      friction: `Openness this unguarded can skip the parts that need actual weight. Difficult conversations get danced around, and playfulness becomes a very effective way of never landing on anything serious. Trust without discernment leaves both of you exposed to things a little caution would have caught. Freedom can quietly mean neither of you commits to anything specific enough to be disappointed by. You can be delightful together for years and never quite build something.`,
      invitation: `Name the serious thing between you that has been repeatedly deflected with humour. This week, say it plainly and resist the urge to lighten it. You are allowed to be playful together and still be substantial. What have you two never actually decided?`,
    },
  };
  function get(num) { return data[num] || null; }
  return { get };
})();
