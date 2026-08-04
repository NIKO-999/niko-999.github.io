'use strict';

/**
 * Destiny Matrix — Three Life Purposes (Personal · Social · Spiritual)
 * ────────────────────────────────────────────────────────────────────
 * Source: research/01-Foundation/Destiny-Matrix-Calculation-Guide.extracted.md,
 * Page 11 — "Life Purpose: Personal, Social, and Spiritual", one of the
 * source's own top-level categories. Formula verification (including the
 * Earth Line A+C vs the source's garbled printed "A+D") is recorded in
 * research/11-Research-Updates/22-three-life-purposes-formula-verification.md.
 *
 *   PP  · Personal Purpose  (→ age 40)   = reduce(EarthLine + SkyLine)
 *   SOP · Social Purpose    (40–60)      = reduce(paternal + maternal diagonals)
 *   SPP · Spiritual Purpose (60+)        = reduce(Personal + Social)
 *
 * Each purpose is a SUM of positions the reader can already open elsewhere in
 * the app, which is why entries here carry an extra `synthesis` field that the
 * other content files don't have: it reads the arithmetic as psychology — what
 * it means for this particular purpose to be fed by two specific streams.
 * The renderer prepends a dynamically-built line naming the reader's own
 * contributing values (e.g. "Sky Line 14 · Temperance + Earth Line 9 · Hermit
 * → Personal Purpose 5"); that line is generated at render time from the live
 * chart and is deliberately NOT written into this file.
 *
 * Field shape (per NON_NEGOTIABLE_RULES.md's Golden Standard voice and
 * CLAUDE.md's ≥85% psychological-narrative ratio):
 *   heading · why · shadow · path · positive · negative · synthesis
 * `path` is written and kept here but is NOT rendered — same decision already
 * applied to the other four card renderers.
 *
 * There is deliberately NO general[] fallback tier. An unwritten purpose entry
 * returns null and the card renders nothing rather than fabricating a reading
 * — the same honest treatment as the Sexual Line's unmatched-pair case.
 *
 * API:
 *   DPurposeContent.get(posKey, arcanaNum)   // posKey: 'PP' | 'SOP' | 'SPP'
 *     → { heading, why, shadow, path, positive, negative, synthesis } or null
 */

window.DPurposeContent = (function () {

  const positions = {

    // ═══════════════════════════════════════════════════════════════════
    // PP — PERSONAL PURPOSE (→ age 40)
    // Sky Line (spiritual potential, B+D) meeting Earth Line (material
    // reality, A+C). The first-half-of-life task: what you are here to
    // become in your own right, before the work turns outward.
    // ═══════════════════════════════════════════════════════════════════
    PP: {

      1: {
        title: `1 in Personal Purpose — The Magician`,
        tagline: `A Design of Ignition That Lands`,
        mastery: `You were built with unusual initiating force — ideas arrive fully formed, and you make them real faster than the people around you can react. Before forty, life keeps handing you openings that only work if you move first, and each one is less a test of your capability than of whether you'll take responsibility for what it sets in motion. You recover fast from a false start too, treating it as information rather than proof you shouldn't have tried. And that speed lets you catch doors that would have closed by the time a more cautious person finished deliberating.`,
        shadow: `You use starting as a substitute for finishing. The moment a project stops being new, the pull toward the next opening becomes almost physical, leaving you with a life of impressive first chapters and no completed books. Underneath the pattern is often a fear that staying with something long enough to be tested would expose more than starting ever has to. You can also use your quickness to stay ahead of anyone who might see you struggle, so competence becomes a way of never being known.`,
        invitation: `Ask yourself honestly what you're avoiding by reaching for the next opening instead of staying. Finish one thing today that stopped being exciting a while ago. Do the next unglamorous step on it before starting anything new. Notice that staying doesn't cost you the aliveness starting gave you.`,
        synthesis: `This purpose forms where your spiritual potential meets your material circumstances — and with the Magician, those two streams argue about speed. The Sky Line side of you senses what's possible almost instantly; the Earth Line side has to live inside timelines, budgets, and other people's readiness. Your first-half task isn't to make one win. It's to stop experiencing the gap between vision and execution as evidence that the material world is too slow for you, and start treating that gap as the actual medium you work in. The Magician who never touches ground stays a rumour about himself.`,
      },

      2: {
        title: `2 in Personal Purpose — The High Priestess`,
        tagline: `A Design of the Spoken Knowing`,
        mastery: `You arrived knowing things — not facts, but patterns, undercurrents, the shape of what someone isn't saying. Before forty, your read of a person or a room repeatedly turns out to be accurate long before any evidence surfaces, and the purpose is whether you'll act on your own perception when no one has validated it yet. You hold different kinds of knowing at once, the provable and the felt, without needing to collapse one into the other. And when you do finally speak what you sense, it tends to land with a weight explanation alone never produces.`,
        shadow: `You withhold what you know. Because it arrives without a chain of reasoning attached, you learn to keep it to yourself rather than defend it, and that privacy hardens into a habit of watching. Underneath the withholding is often a fear that speaking plainly and being wrong would cost more than staying quiet and being right in private. You end up understanding people more accurately than they understand themselves while staying just outside reach.`,
        invitation: `Ask yourself honestly whether your silence is discernment or fear of being wrong out loud. Say one thing you sense today, out loud, before you can fully justify it, to someone who might disagree. Say it plainly, without hedging it into a question. Notice that your knowing survives being tested in the open.`,
        synthesis: `Your spiritual potential and your material reality feed this purpose from opposite directions, and with the High Priestess they speak different languages entirely. The Sky Line half of you receives information whole, with no steps to show; the Earth Line half lives in a world that asks for steps. The first-half task isn't to translate perfectly. It's to stop waiting for a translation that will never fully exist, and to act from what you know while still building enough of a bridge that others can follow. Intuition that refuses to descend into evidence isn't protected — it's just unused.`,
      },

      3: {
        title: `3 in Personal Purpose — The Empress`,
        tagline: `A Design of the Claimed Creation`,
        mastery: `There's a generative quality in you that wants to bring things into existence — work, beauty, a home, other people's confidence. Before forty, your life keeps arranging conditions where something can grow if you tend it, and the purpose is learning that what you create is allowed to bear your name. You cultivate patiently, tending things the way you'd tend something alive rather than rushing them toward a result. And you hold real abundance without hoarding it, generous by nature rather than by calculation.`,
        shadow: `You create for others until there's nothing of your own. You pour real, sustained fertility into someone else's project or household and call it generosity. Underneath the generosity is often a fear that a thing made purely for yourself would expose what you actually value, and that exposure feels riskier than the giving. Your own unmade work sits untouched, always scheduled for after.`,
        invitation: `Ask yourself honestly what you're afraid making something purely for yourself would reveal. Make one thing today that has no recipient — something that exists because you wanted it to exist. Don't dedicate it to anyone. Notice what it feels like to let it simply be yours.`,
        synthesis: `This purpose is where your spiritual potential and your material reality meet, and the Empress makes that meeting unusually literal: you're here to bring the immaterial into form. The Sky Line half of you holds a sense of how things could be — warmer, more beautiful, more alive. The Earth Line half has hands, time, and a limited number of hours. The first-half task is not to protect the vision from the compromises of making. It's to accept that a real thing, imperfect and finished, feeds you in a way a perfect imagined one never will. Fertility that never touches matter becomes longing.`,
      },

      4: {
        title: `4 in Personal Purpose — The Emperor`,
        tagline: `A Design of the Shared Structure`,
        mastery: `You are here to make structure — order comes naturally to you, and you see what's disorganised and something in you moves to fix it. Life keeps giving you responsibility earlier than feels fair, and the purpose is discovering that structures exist to hold life, not to contain it. You build things that actually last, thinking in years where most people think in weeks. And you can hold real authority without needing to dominate every decision underneath it, letting people build inside the frame you set.`,
        shadow: `You mistake control for care. When things feel uncertain, you tighten — more rules, more oversight, more of the load carried personally. Because you're genuinely competent, tightening usually works short-term, which is exactly what keeps the pattern going. Underneath the tightening is often a fear that loosening even slightly would mean everything falls apart. Over years it produces a life where everything depends on you and nothing can move without you.`,
        invitation: `Ask yourself honestly what you're afraid would happen if you actually loosened your grip. Let one thing that matters be run badly by someone else today, without taking it back. Resist the urge to correct it. Notice that the structure holds even when you're not the one enforcing it.`,
        synthesis: `Your spiritual potential and your material reality converge here, and the Emperor is where that convergence has the highest stakes: you're building the container the rest of your life happens inside. The Sky Line half of you knows what the structure is *for* — the meaning it's meant to protect. The Earth Line half knows what it costs in hours, money, and hard decisions. The first-half task is to keep those two connected, because an Emperor who loses the Sky Line builds flawless structures around nothing, and one who loses the Earth Line has principles and no walls. Order without purpose is just control that hasn't admitted it yet.`,
      },

      5: {
        title: `5 in Personal Purpose — The Hierophant`,
        tagline: `A Design of the Tested Framework`,
        mastery: `You were handed a framework — religious, familial, cultural, professional — and absorbed it early and well. Before forty, life keeps testing that inheritance, usually by placing you somewhere it doesn't quite fit, and the purpose is working out which parts are genuinely yours. You examine what you inherited and consciously choose what actually stays, rather than following it blindly. And what you eventually teach or pass on has been tested, not merely repeated.`,
        shadow: `You transmit borrowed certainty. Because the framework works and you can articulate it convincingly, you spend years speaking with an authority you haven't personally earned. Underneath the borrowed confidence is often a fear that questioning the inheritance would mean questioning the people who gave it to you. You pass along answers that have never been stress-tested against your own experience.`,
        invitation: `Ask yourself honestly which of your beliefs you've never actually tested yourself. Take one belief you've always held today, and actually check it against your own scrutiny. Trace where it came from before you decide whether to keep it. Notice which parts hold up and which were only ever inherited.`,
        synthesis: `This purpose is the meeting point of your spiritual potential and your material reality, and with the Hierophant the tension is between what you were taught and what you've lived. The Sky Line half of you reaches toward meaning, structure, something larger to belong to. The Earth Line half keeps producing lived experience that doesn't always match the doctrine. The first-half task isn't to pick a side — it's to stop treating the mismatch as a problem to be suppressed. Every framework worth keeping has been revised by contact with a real life. Belief that has never met the ground is not faith; it's just inheritance you haven't opened.`,
      },

      6: {
        title: `6 in Personal Purpose — The Lovers`,
        tagline: `A Design of the Real Choice`,
        mastery: `Your first half of life is shaped by real choices between genuine goods — two paths, two people, two versions of yourself, both defensible. The purpose is learning to choose at all, and to stay with what you chose after the alternative starts looking better in hindsight. You hold competing pulls without pretending one doesn't exist, and still make a real choice. And once you choose, you commit fully, rather than keeping a foot out the door.`,
        shadow: `You stay unchosen. Keeping options alive feels like openness and fairness to everyone involved, but it functions as a way of never being accountable to a direction. Underneath the openness is often a fear of the version of yourself who'd have to live with a choice that turned out wrong. Relationships and roles get held close enough to feel real and far enough to leave.`,
        invitation: `Ask yourself honestly what you're protecting by keeping the other option alive. Choose one thing today and let the other genuinely go — not shelved, not maybe-later, gone. Say the choice out loud to someone who'll hold you to it. Notice that closing the door doesn't cost you what you feared.`,
        synthesis: `Where your spiritual potential meets your material reality, the Lovers make the meeting a decision rather than a discovery. The Sky Line half of you senses that there's a *right* path, something aligned and meant. The Earth Line half knows that in practice you get one life, one calendar, one set of finite years, and choosing anything means unchoosing the rest. The first-half task is to stop waiting for the choice that costs nothing — that's what keeps the two halves at war. Alignment isn't found before you commit. It's what commitment slowly produces.`,
      },

      7: {
        title: `7 in Personal Purpose — The Chariot`,
        tagline: `A Design of the Checked Direction`,
        mastery: `You move. Where other people deliberate, you're already three steps down the road, and momentum opens doors careful planning wouldn't have found. The purpose is discovering what you're actually driving toward, because directed force with no destination just becomes speed. You hold opposing pulls at once, drive and rest, without either hijacking the other. And obstacles register as terrain to cross rather than personal insults, which is exactly what lets you keep moving.`,
        shadow: `You use momentum as avoidance. Motion feels like progress, and as long as you're moving you never have to sit still long enough to feel what's underneath. Underneath the constant motion is often a fear that stillness would reveal something the movement has been letting you avoid. The people closest to you experience your drive as something they're dragged behind rather than travelling with.`,
        invitation: `Ask yourself honestly what stopping the vehicle might actually reveal. Stop the vehicle once today, on purpose, and ask where you're actually going and who's still in the car. Sit in the stillness instead of restarting immediately. Notice what surfaces once the motion stops.`,
        synthesis: `This purpose forms where your spiritual potential meets your material reality, and the Chariot turns that meeting into a question of steering. The Sky Line half of you has a sense of the destination — what all this effort is ultimately in service of. The Earth Line half has the engine, the road conditions, and the very real constraints of time and resource. The first-half task is to keep the hands on the wheel connected to the eyes on the horizon. Drive without vision is just displacement; vision without drive never leaves the driveway.`,
      },

      8: {
        title: `8 in Personal Purpose — Justice`,
        tagline: `A Design of the Priced Standard`,
        mastery: `You have an unusually exact internal scale, noticing imbalance in a room, a contract, a friendship often before anyone else does. The purpose is to learn what your own standard actually costs, and to choose it knowingly rather than reflexively. You hold yourself to the exact standard you measure everyone else by, which is the rare part most people who talk about fairness skip. And you can deliver a hard, accurate assessment without needing it to be cruel.`,
        shadow: `You judge without mercy, starting with yourself. The same scale that catches unfairness in the world runs constantly on your own conduct. Underneath the ledger is often an old wound around being treated unfairly yourself, which you're now quietly re-litigating on everyone else's behalf. You hold people to standards you'd never state out loud, and carry a running account of who owes what.`,
        invitation: `Ask yourself honestly whose column you last actually audited — theirs, or your own. Let one imbalance stand today, to find out whether your sense of order can survive something unresolved. Resist the urge to correct it immediately. Notice that the world doesn't collapse when one thing stays uneven.`,
        synthesis: `Where your spiritual potential meets your material reality, Justice makes the meeting a reckoning. The Sky Line half of you holds an ideal of how things ought to balance — clean, principled, true. The Earth Line half deals with a world of partial information, mixed motives, and outcomes that are never quite proportional. The first-half task is to stop treating that gap as proof the world is corrupt. Fairness applied to reality is always approximate; a standard that can only be met in principle isn't higher, it's just untested.`,
      },

      9: {
        title: `9 in Personal Purpose — The Hermit`,
        tagline: `A Design of the Completed Return`,
        mastery: `You need more solitude than you've been given permission to need. Something in you does its actual processing in private, and the purpose isn't the withdrawal — it's the return. You can be completely self-sufficient without it curdling into isolation, content in your own presence rather than merely tolerating it. And what you find in there tends to be sharper and more usable than anything generated under pressure.`,
        shadow: `Solitude stops being a passage and becomes an address. Withdrawal is genuinely restorative, which makes it easy to justify. Underneath the lengthening periods is often a fear that speaking plainly would make the depth ordinary. Re-entry gets harder, and the depth you've cultivated has no one to reach.`,
        invitation: `Ask yourself honestly whether the solitude is still gathering something or has become a way to avoid people. Bring one thing back today — tell someone what you actually worked out in there, in plain language. Say it to a specific person, not into the void. Notice that the depth survives being shared.`,
        synthesis: `This purpose sits where your spiritual potential meets your material reality, and the Hermit makes that meeting a question of return. The Sky Line half of you goes inward and finds genuine understanding — the kind that only silence produces. The Earth Line half lives among people, obligations, and the unglamorous business of being known. The first-half task is not to choose the inner life over the outer one. It's to build the bridge back, because insight that never touches another life stays a private possession, and this position was never meant to end in a locked room.`,
      },

      10: {
        title: `10 in Personal Purpose — Wheel of Fortune`,
        tagline: `A Design of the Sorted Effort`,
        mastery: `Your life moves in cycles more visibly than most people's — things rise, things fall, and the timing rarely correlates with how hard you worked. The purpose is learning the difference between what's yours to steer and what's yours to ride, and spending your strength only on the first. You can read which phase you're actually in, rising or contracting, rather than reacting to noise as if it were signal. And you can let a good period be good without needing to grip it in place against its own ending.`,
        shadow: `You either grip — trying to control variables that were never in your hands, reading every downturn as personal failure — or you go slack, treating everything as fate. Underneath the gripping is a fear that you have no real control at all, so holding what you can touch feels like the only defense. You quietly abandon the parts that genuinely were yours to influence. Either way, the actual work that needed your strength goes untended.`,
        invitation: `Ask yourself honestly which phase you're actually in right now, separate from how you feel about it. Name one thing today that is genuinely not yours to control, and stop spending on it. Redirect that energy toward the piece that's actually yours. Notice the relief of no longer fighting the wrong battle.`,
        synthesis: `Where your spiritual potential meets your material reality, the Wheel makes the meeting a lesson in timing. The Sky Line half of you can sense the larger pattern — that this is a phase, that it turns, that there's a shape to it. The Earth Line half is living inside the specific month, with the specific bills and the specific uncertainty, where "it's a cycle" is cold comfort. The first-half task is to let each half inform the other: perspective that doesn't dismiss the immediate, and immediacy that doesn't forget the pattern. Neither half alone can tell you where to spend your strength.`,
      },

      11: {
        title: `11 in Personal Purpose — Strength`,
        tagline: `A Design of the Recognized Softness`,
        mastery: `You have real endurance, and it doesn't look like endurance. Where others harden under pressure, something in you stays soft and simply doesn't break. The purpose is coming to recognise your own particular strength as strength, not fragility that's gotten away with it so far. You can stay present with raw, unruly states in yourself without needing to suppress them or be ruled by them. And you know the difference between gentleness and weakness, which lets you be soft without ever being a pushover.`,
        shadow: `You endure what should have been ended. Your capacity to stay open under strain makes you very good at tolerating situations a harder person would have walked out of years earlier. Underneath the endurance is often a fear that leaving would mean the strength wasn't real. Strength becomes the reason you're still there, long past the point it should have ended.`,
        invitation: `Ask yourself honestly what you're proving by staying in something that should have ended. Use your strength today to leave something, not just to withstand it. Let the leaving be the demonstration of strength instead of the staying. Notice that walking away doesn't undo what your endurance built.`,
        synthesis: `This purpose forms where your spiritual potential meets your material reality, and Strength makes the meeting a matter of what force is for. The Sky Line half of you knows that real power doesn't need to dominate — that there's something higher in restraint. The Earth Line half is dealing with actual pressure, actual people, actual situations that sometimes require a hard no. The first-half task is to stop letting the higher principle argue you out of the necessary refusal. Gentleness that cannot end anything isn't mastery over force; it's just force you haven't been willing to pick up.`,
      },

      12: {
        title: `12 in Personal Purpose — The Hanged Man`,
        tagline: `A Design of the Named Endpoint`,
        mastery: `Your life includes suspension — periods where forward motion simply isn't available and you're held in place while something reorganises. The purpose is letting it change your angle of view, treating the pause as the work rather than dead time. You can pause a decision without anxiety, trusting the pause itself is doing real work. And you see angles from the suspension that people still moving simply can't access.`,
        shadow: `Suspension becomes identity. What began as a genuine fallow period slowly becomes the arrangement — waiting for conditions, for clarity, for permission. Underneath the waiting is often a fear that descending back into choice means risking being wrong. The waiting acquires its own justification, indefinitely.`,
        invitation: `Ask yourself honestly whether the pause is still doing real work or has become a place to avoid choosing. Name today, in concrete terms, what would have to be true for the waiting to be over. Take one real step toward that condition. Notice that acting doesn't cost you what the suspension revealed.`,
        synthesis: `Where your spiritual potential meets your material reality, the Hanged Man makes the meeting an inversion. The Sky Line half of you can find meaning in the pause — can see that something is being reordered that couldn't be reordered in motion. The Earth Line half is watching real time pass, real opportunities close, real resources drain. The first-half task is to let both be true at once: to take the suspension seriously as teaching without letting the teaching become an excuse for never coming down. A pause with meaning is transformation. A pause with only meaning is just a stall you've made peace with.`,
      },

      13: {
        title: `13 in Personal Purpose — Transformation`,
        tagline: `A Design of the Held Ending`,
        mastery: `You will not get to keep who you were. This position tends to end things structurally — a career, an identity, a relationship — and the purpose is learning to release rather than be pried loose. You can let an old version of yourself die so a truer one can take its place, without needing the process to be dramatic to trust it's real. And you recover fast from real loss, integrating what it showed you rather than just surviving it.`,
        shadow: `You hold the corpse. You keep something alive well past its actual life — a role you've outgrown, a relationship that ended in every way but formally. Underneath the holding is often a fear that letting go would mean admitting the whole thing failed. You keep defending something that was quietly finished long before you admitted it.`,
        invitation: `Ask yourself honestly what you're keeping alive that's already actually over. Let one thing finish properly today — say it's over, out loud, and don't immediately replace it. Take the concrete action that closes it. Notice that naming it as finished doesn't mean the whole thing failed.`,
        synthesis: `This purpose forms where your spiritual potential meets your material reality, and Transformation makes that meeting a demolition. The Sky Line half of you understands that endings clear ground — that something has to close for anything to open. The Earth Line half is losing something specific: an income, a home, a person, a name people knew you by. The first-half task is to stop letting the spiritual framing skip the actual grief, and to stop letting the grief argue that the ending shouldn't happen. Both are true. The release is real and the loss is real, and this position only works when you hold them together.`,
      },

      14: {
        title: `14 in Personal Purpose — Temperance`,
        tagline: `A Design of the Deserved Excess`,
        mastery: `You're here to blend things that don't obviously go together — pace and patience, ambition and ease, other people's needs and your own. The purpose is developing the judgement to keep adjusting, not arriving at balance as a final destination. You blend in the right proportion for the specific situation, not by rote formula. And you moderate your own extremes naturally, which makes you sustainable in a way people who burn hot rarely are.`,
        shadow: `You use moderation as avoidance. Because you're genuinely good at finding the middle, you use the middle to never fully commit to anything. Underneath the hedging is often a fear that full commitment to any one thing would cost you everything else on the scale. Every position gets hedged, every intensity diluted, every strong feeling immediately balanced by its counterweight.`,
        invitation: `Ask yourself honestly what full commitment to one thing would actually cost you. Let one thing today be disproportionate — give it more than its fair share of you. Don't immediately balance it with its counterweight. Notice that the imbalance doesn't actually break anything.`,
        synthesis: `Where your spiritual potential meets your material reality, Temperance makes the meeting an act of mixing. The Sky Line half of you holds an ideal proportion — how things ought to sit together. The Earth Line half is dealing with the actual ingredients: limited time, uneven energy, people who won't cooperate with the recipe. The first-half task is to keep adjusting rather than to arrive. The blend that worked at thirty won't hold at forty, and treating any particular balance as final is how this position's real gift — ongoing calibration — turns into mere caution.`,
      },

      15: {
        title: `15 in Personal Purpose — The Devil`,
        tagline: `A Design of the Ended Concealment`,
        mastery: `You have appetites — for pleasure, intensity, power, being wanted — stronger than the version of yourself you present. The purpose is honesty: knowing exactly what you want, without acting it out compulsively or pretending it isn't there. You look directly at your own hunger without flinching away or dressing it up as something nobler. And that unflinching honesty is what actually makes real freedom possible, not the pretending.`,
        shadow: `Something has you — a habit, a person, a hunger — and the relationship has quietly inverted so you're serving it. You usually know, and the lucid awareness running alongside the compulsion produces shame. Underneath the shame is often a fear that naming the attachment plainly would make it undeniable. The shame produces concealment, and the concealment protects the compulsion.`,
        invitation: `Ask yourself honestly what currently has a real hold on you, without softening it. Say the true thing about what you want today, out loud, to one person who won't flinch. Say it plainly, without dressing it up. Notice that naming it loosens its grip rather than tightening it.`,
        synthesis: `This purpose sits where your spiritual potential meets your material reality, and the Devil makes the meeting a confrontation with appetite. The Sky Line half of you holds a picture of who you're meant to become — disciplined, free, above this. The Earth Line half has a body, real hungers, and a history of what actually happened. The first-half task is to stop using the higher vision as a reason to disown the lower facts. The gap between the two is where the concealment lives, and concealment is the whole engine of this position. Nothing here is transformed by being denied.`,
      },

      16: {
        title: `16 in Personal Purpose — The Tower`,
        tagline: `A Design of the Rebuilt Trust`,
        mastery: `Something in your first half of life collapses — suddenly, usually the thing you'd built the most identity on. The purpose isn't the collapse itself; it's what you learn about the difference between what fell and who you are. You recover fast from real upheaval, integrating what it showed you rather than just surviving it. And you can tell the difference between a necessary collapse and unnecessary destruction, so the honesty the fall taught you doesn't turn into a habit of breaking things that are fine.`,
        shadow: `You live braced. After the fall, you spend the rest of the half-life waiting for the next one, never fully committing to anything rebuildable. Underneath the bracing is often a fear that investing fully again would mean risking the exact collapse you already survived once. You keep an exit visible, treating stability itself as a trap you're too smart to fall for.`,
        invitation: `Ask yourself honestly what you're protecting by staying braced for the next collapse. Build one thing today you'd genuinely grieve — that's the only evidence the collapse didn't take your capacity to invest. Commit to it without keeping the exit visible. Notice that investing again doesn't guarantee another fall.`,
        synthesis: `Where your spiritual potential meets your material reality, the Tower makes the meeting a demolition you didn't schedule. The Sky Line half of you can eventually see what the collapse revealed — the false structure, the thing that was never load-bearing. The Earth Line half lost actual money, an actual home, actual years. The first-half task is to let the meaning-making happen without it becoming a way to skip the loss, and to let the loss be real without concluding that meaning is a consolation prize. Both halves have to survive this, not just the one that can explain it.`,
      },

      17: {
        title: `17 in Personal Purpose — The Star`,
        tagline: `A Design of the Full-Sized Hope`,
        mastery: `You carry a genuine sense of what could be — a clear picture of a better arrangement, for yourself or for the world. The purpose isn't achieving the vision — it's refusing to pre-shrink it. You carry hope that hasn't hardened into naivety, because you've actually looked at the hard parts and kept it anyway. And you inspire real optimism in other people just by being near them, without needing to perform positivity to do it.`,
        shadow: `You practice pre-emptive modesty. You scale the hope down before anyone can test it, so the disappointment can't reach you. Underneath the shrinking is often a fear that a hope stated at full size and then disappointed would be unbearable. You call it realism, or humility, or not wanting to jinx it.`,
        invitation: `Ask yourself honestly what you're afraid would happen if the hope, stated fully, disappointed you. Say one hope today at its real size, to one person, without the qualifiers. Don't pre-shrink it to protect yourself. Notice that saying it at full size doesn't make the disappointment, if it comes, any worse.`,
        synthesis: `This purpose forms where your spiritual potential meets your material reality, and the Star makes that meeting a question of scale. The Sky Line half of you sees what's possible with unusual clarity. The Earth Line half knows what's been tried, what it cost, and how much of the last attempt is still being paid for. The first-half task is to let the ground inform the size of the hope without letting it set the ceiling. A vision that has never been costed is a fantasy; a vision that has been pre-cut to fit the budget was never a vision. This position lives in the discipline of holding both.`,
      },

      18: {
        title: `18 in Personal Purpose — The Moon`,
        tagline: `A Design of the Sorted Feeling`,
        mastery: `You take in more than you can account for — moods, atmospheres, what someone means underneath what they said, arriving without a source label. The purpose is developing the discrimination to reliably ask: is this mine? You navigate uncertainty and ambiguity without needing everything resolved before you'll trust what you're sensing. And you can hold conflicting feelings at once without needing to resolve the contradiction before trusting either one.`,
        shadow: `You treat fog as fact. Anxiety arrives without a cause and you construct one, usually pointing at yourself. Underneath the self-blame is often a fear that unattributed anxiety, left unexplained, would feel even less bearable than a false explanation does. The inherited or absorbed feeling becomes evidence about your character.`,
        invitation: `Ask yourself honestly whether what you're feeling is real signal or unmoored anxiety looking for an owner. Take one recurring anxiety today and trace it — when did it start, whose is it, does your present life actually match it. Check it against something concrete before believing it. Notice how much of it was never actually yours.`,
        synthesis: `Where your spiritual potential meets your material reality, the Moon makes the meeting hard to see through. The Sky Line half of you receives genuine information below the threshold of evidence. The Earth Line half needs to make actual decisions in actual daylight, with consequences. The first-half task is to build the discrimination that lets the two work together — because unfiltered, this position's gift and its distortion arrive through exactly the same channel, feeling identical. Learning to tell them apart is not a refinement of the work here. It is the work.`,
      },

      19: {
        title: `19 in Personal Purpose — The Sun`,
        tagline: `A Design of the Unlit Room`,
        mastery: `There's a warmth in you that other people orient toward — you brighten rooms without especially trying. The purpose is finding out whether you can be seen as you actually are, rather than as the version that reliably gets a good response. You bring genuine vitality into a room just by being in it, contagious rather than performed. And you find real, uncomplicated confidence that doesn't depend on constant brightness to feel legitimate.`,
        shadow: `Brightness becomes an obligation rather than an expression. You're the one who lifts the mood, so your own difficulty has nowhere to go and gets managed privately. Underneath the management is often a fear that an unbright day would let people down who've come to depend on your light. It gets buried under a version of you that never runs dim in public.`,
        invitation: `Ask yourself honestly what you're afraid an ordinary, unbright day would cost the people around you. Let someone see you flat today — not in crisis, just unbright, ordinary, without the lift. Don't manufacture the lift for their sake. Notice that they stay, warmth or not.`,
        synthesis: `This purpose sits where your spiritual potential meets your material reality, and the Sun makes the meeting a question of exposure. The Sky Line half of you carries something genuinely radiant — a vitality that isn't manufactured. The Earth Line half lives among actual people, with actual expectations, who have come to depend on that radiance being available. The first-half task is to keep the light connected to the person producing it. A Sun that has to shine on schedule isn't expressing anything; it's meeting a quota, and the warmth eventually goes hollow in a way everyone senses and no one can name.`,
      },

      20: {
        title: `20 in Personal Purpose — Judgement`,
        tagline: `A Design of the Costly Step`,
        mastery: `There's a call in your life you already know about — a direction, a piece of work, a reckoning with something unfinished. The purpose isn't discovering it, since you're not actually unclear. It's answering. You act on the summons before you've fully rehearsed it, trusting that readiness catches up once you've started moving. And you can genuinely evaluate your own past honestly, without either inflating it or tearing yourself down over it.`,
        shadow: `You stay in perpetual almost. You gather more information, wait for better conditions, prepare a little further, and each delay is individually reasonable, which is what makes the pattern so durable. Underneath the delay is often a fear that answering and failing would confirm something worse than never answering at all. Each step feels safe precisely because none of them are the actual step.`,
        invitation: `Ask yourself honestly what answering the call would risk confirming if it went badly. Take one step today that's expensive enough to be real — money, a conversation, a door closing behind you. Do it now, imperfectly, not after the next round of preparation. Notice that the readiness was always going to arrive after the step, not before it.`,
        synthesis: `Where your spiritual potential meets your material reality, Judgement makes the meeting a summons. The Sky Line half of you hears the call clearly and has for a long time. The Earth Line half has a mortgage, dependents, a functioning arrangement, and a completely legitimate account of why not yet. The first-half task is not to let either side win outright. A call that never costs anything material was never answered; a material life that never bends toward the call is just a well-managed avoidance. This position ends when one concrete thing changes.`,
      },

      21: {
        title: `21 in Personal Purpose — The World`,
        tagline: `A Design of the Closed Scope`,
        mastery: `You're built for completion — for the full arc rather than the promising start. The purpose is discovering what it feels like to be someone who completes, because that changes your relationship to every future beginning. You integrate everything, the hard parts and the good parts, into one finished whole instead of only keeping what flatters you. And you find genuine satisfaction in completion itself, not just in the next thing it opens up.`,
        shadow: `You practice scope creep as evasion. Because you can genuinely see the bigger picture, you keep widening the frame, one more element, one more region. Underneath the widening is often a fear that closing the scope would expose the work to a judgment "still expanding" never has to face. The thing never closes.`,
        invitation: `Ask yourself honestly what finishing at the current scope would risk exposing. Close one thing today at its current scope, and let it be judged as it is. Resist the pull to widen it one more time. Notice that the closed version still counts.`,
        synthesis: `This purpose forms where your spiritual potential meets your material reality, and the World makes that meeting a question of closure. The Sky Line half of you sees the complete picture — everything the work could encompass. The Earth Line half has a deadline, a budget, and a finite amount of you. The first-half task is to let the material limit be the thing that makes completion possible rather than the thing that betrays the vision. Wholeness in this position isn't the largest possible version. It's the version that actually got finished and can therefore be lived inside.`,
      },

      22: {
        title: `22 in Personal Purpose — The Fool`,
        tagline: `A Design of the Tested Stay`,
        mastery: `You're here to begin without guarantees — some doors only open to someone willing to step through without proof. This position carries real freedom and real exposure in the same gesture. You step forward without needing a guarantee handed to you first, real trust rather than naivety about the risk. And that trust compounds the more it's used, building a track record of leaps that mostly worked out because you were willing to take them.`,
        shadow: `You leap constantly, so nothing accumulates and freedom becomes a kind of homelessness — always new, never deep. Underneath the constant leaping is often a fear that staying with one leap long enough to be tested would reveal it wasn't as free as it looked. Or you talk about leaping for years while arranging a life with no actual openness in it. Either version leaves you with the appearance of freedom and very little of its substance.`,
        invitation: `Ask yourself honestly whether you're leaping or just running from what staying would ask of you. Take one leap today, and commit to staying long enough for it to become something. Don't reach for the next one before this one has taught you what it had to teach. Notice what accumulates when you actually stay.`,
        synthesis: `Where your spiritual potential meets your material reality, the Fool makes the meeting an act of faith. The Sky Line half of you trusts that the ground appears — that the step comes before the proof. The Earth Line half has rent, a body, and a finite tolerance for starting over. The first-half task is to stop treating those as opposed. The leap that ignores the material entirely isn't freedom, it's just repetition; the material caution that never permits a leap isn't prudence, it's a life spent waiting for a certainty this position was never going to be given.`,
      },

    },

    // ═══════════════════════════════════════════════════════════════════
    // SOP — SOCIAL / CLAN PURPOSE (ages 40–60)
    // The paternal diagonal (F+H) meeting the maternal diagonal (G+I).
    // The middle-life task: what you are here to do with and for others,
    // carrying both lineages forward.
    // ═══════════════════════════════════════════════════════════════════
    SOP: {

      1: {
        title: `1 in Social Purpose — The Magician`,
        tagline: `A Design of the Given Launch`,
        mastery: `Somewhere after forty the initiating force stops being about your own trajectory. Both lineages handed you the capacity to make things happen, and the second half asks you to spend it on ventures whose main beneficiaries aren't you. You act first and let the plan catch up, generating momentum other people are still waiting on. And that speed lets you launch things for others faster than most people can even organize the intention to help.`,
        shadow: `You keep running a personal campaign past its season. You initiate for your own advancement, and because you're good at it, it keeps partially working. Underneath the continued campaigning is often a fear that redirecting the force outward would mean losing the momentum that's defined you. The people who could have been launched by that same energy stand slightly outside it.`,
        invitation: `Ask yourself honestly whose success you're actually still chasing at this stage of life. Start something today whose success won't be credited to you. Hand the credit away deliberately, on purpose. Notice that the force doesn't diminish when it's not about you.`,
        synthesis: `This purpose is fed by both your lineages at once — the paternal line and the maternal line meeting in you. With the Magician, what they hand over is force: the paternal side contributing whatever your father's line knew about making things happen in the world, the maternal side whatever your mother's line knew about making things happen for people. Your middle years are where those stop being separate skills. Initiative that only serves the family name repeats the paternal pattern; care that never initiates repeats the maternal one. This position asks for the fusion neither line completed.`,
      },

      2: {
        title: `2 in Social Purpose — The High Priestess`,
        tagline: `A Design of the Spoken Silence`,
        mastery: `Both lineages gave you perception, and probably a matching instruction to keep it to yourself. After forty, the social task is disclosure — becoming the person who names the thing everyone senses and no one has said. You hold different kinds of knowing at once, the provable and the felt, without needing proof before trusting it. And when you finally speak, it tends to land with a weight that vague hinting never produces.`,
        shadow: `Your discretion hardens into complicity. You see the dynamic clearly — the family pattern, the thing that's slowly harming someone — and you hold it, because holding is what your lines modelled. Underneath the holding is often a fear that naming it would make you responsible for what happens next. Your knowledge slowly becomes part of what protects the pattern.`,
        invitation: `Ask yourself honestly what you're protecting by staying silent about what you already see. Name one thing today you've been privately seeing for years, to someone with the standing to act on it. Say it plainly, not as a hint. Notice that the naming doesn't make you responsible for what happens after.`,
        synthesis: `Both lineages feed this purpose, and with the High Priestess they may well have taught the same lesson from opposite sides: the paternal line's version of what isn't discussed, and the maternal line's version of what's known but never said. Your middle years are where those two silences meet in one person who can finally see the whole shape. That's the opportunity and the burden. Perception inherited twice over isn't given so it can be stored — it accumulated across two lines precisely so that someone would eventually be equipped to speak it.`,
      },

      3: {
        title: `3 in Social Purpose — The Empress`,
        tagline: `A Design of the Grown Capacity`,
        mastery: `The generative capacity that ran through your first half turns communal after forty. Both lineages contributed something fertile — the ability to grow, tend, provide — and the social task is to build what nourishes a group rather than a household. You cultivate patiently, giving what you tend real time rather than rushing it. And you hold real abundance without hoarding it, generous by nature rather than by calculation.`,
        shadow: `Your nurturing keeps everyone dependent. Because providing is genuinely what you do, you build a system where the flow only runs one direction and nobody around you develops their own capacity. Underneath the one-way flow is often a fear that teaching someone to provide for themselves would make you less needed. Nobody around you develops the muscle that would let them stop relying on you.`,
        invitation: `Ask yourself honestly what you're afraid teaching someone else's independence would cost you. Teach one person today to make what you've been making for them. Show them the actual process, not just the result. Notice that being less needed doesn't mean being less valued.`,
        synthesis: `This purpose forms where your paternal and maternal lines meet, and with the Empress the two streams may carry very different ideas of what providing means — one line's version material and structural, the other's relational and warm. Your middle years are where they have to become one practice. Provision without warmth repeats one inheritance; warmth that never builds anything durable repeats the other. What this position asks for is the version neither line achieved alone: something that both holds people and feeds them, and continues after you.`,
      },

      4: {
        title: `4 in Social Purpose — The Emperor`,
        tagline: `A Design of the Distributed Frame`,
        mastery: `After forty you become load-bearing for a group. Both lineages contributed something about order and responsibility, and the social task is to provide the framework inside which other people can operate safely. You build structures that actually last, thinking in years where most people think in weeks. And you can hold real authority without needing to dominate every decision underneath it.`,
        shadow: `Your authority never distributes. You hold the frame so completely that no one else develops the capacity to hold anything. Underneath the holding is often a fear that distributing it would mean the structure collapses without you personally enforcing it. Because you're competent, the arrangement persists for decades, with everything still running through you.`,
        invitation: `Ask yourself honestly what you're afraid would happen if you actually distributed the authority. Give one piece of real authority away today — with the right to do it differently than you would. Let it go without checking in. Notice that the frame holds even when someone else runs part of it.`,
        synthesis: `Both lineages feed this purpose, and with the Emperor they may have handed you two incompatible models of authority — one line's structural and formal, the other's exercised without ever being named as power. Your middle years are the reconciliation. Authority that only knows the formal mode becomes rigid and unloved; authority that only knows the invisible mode does enormous work and is never credited or shared. The version this position asks for is explicit and distributed: real, named, and deliberately handed on.`,
      },

      5: {
        title: `5 in Social Purpose — The Hierophant`,
        tagline: `A Design of the Filtered Inheritance`,
        mastery: `You become a transmitter after forty. Both lineages handed down frameworks, and the social task is to pass on the parts that survived your own testing and let the rest stop with you. You examine what you inherited and consciously choose what actually deserves to continue. And what you eventually pass on has been tested against your own life, not merely repeated.`,
        shadow: `You transmit without filtering. You pass along the whole inheritance intact, including the parts that harmed people, because it arrived as a package. Underneath the wholesale passing-on is often a fear that questioning any part of it feels like betraying all of it. Questioning any of it feels disloyal to the people who handed it to you.`,
        invitation: `Ask yourself honestly which part of your inheritance you've never actually examined. Name one inherited rule today you're choosing not to pass on, and say why. Say it plainly to the next generation, not just to yourself. Notice that filtering the inheritance doesn't betray the people who gave it to you.`,
        synthesis: `This purpose sits where your paternal and maternal lines converge, and with the Hierophant they arrive as two bodies of doctrine — two sets of rules about what's right, possibly contradicting each other. Your middle years are where they meet in someone with the standing to arbitrate. That's the whole assignment. Passing both on unexamined leaves the next generation with your ancestors' unresolved argument; discarding both leaves them with nothing to stand on. What's asked here is the harder third thing: judgement, applied to your own inheritance, in public.`,
      },

      6: {
        title: `6 in Social Purpose — The Lovers`,
        tagline: `A Design of the Named Allegiance`,
        mastery: `After forty the question stops being who you love and becomes who you're actually for. Both lineages carried patterns about alliance and loyalty, and the social task is to make those choices consciously rather than inheriting them. You hold competing loyalties without pretending one doesn't exist, and still make a real choice. And once you choose, you commit fully, rather than keeping every door open.`,
        shadow: `You keep every allegiance half-open. You maintain loyalty to a family faction, an old obligation, and a new set of people all at once. Underneath the half-openness is often a fear that choosing one allegiance fully would mean betraying the others. Nobody quite realises they don't actually have you.`,
        invitation: `Ask yourself honestly what you're protecting by keeping every allegiance half-committed. Make one allegiance explicit today, including what it costs the other side. Say it out loud, plainly. Notice that a clear choice costs less than the years of half-commitment did.`,
        synthesis: `Both lineages feed this purpose, and with the Lovers they may hand you two competing definitions of loyalty — one line's version about blood and obligation, the other's about chosen affinity. Your middle years are where you decide which governs. Neither answer is free: honouring only inherited allegiance means a life of duties you never agreed to, while honouring only chosen ones can sever something that was actually holding people. The work here isn't picking a rule. It's making each specific choice consciously, and letting the people involved know it was made.`,
      },

      7: {
        title: `7 in Social Purpose — The Chariot`,
        tagline: `A Design of the Matched Pace`,
        mastery: `The drive both lineages gave you turns directional after forty — not your own advancement, but moving a group from where it is to where it needs to be. What's asked isn't speed; it's responsibility for other people's arrival. You hold direction firmly without gripping it too tightly, trusting forward motion that doesn't need to force its way through everything. And you can pace yourself to what a group actually needs rather than what your own drive prefers.`,
        shadow: `You drive without passengers. You move at your own pace and treat the people who can't keep up as a drag on the mission. Underneath the impatience is often a fear that slowing down would mean the mission itself was never actually urgent. You arrive somewhere real with almost no one behind you.`,
        invitation: `Ask yourself honestly what you're afraid slowing your pace would say about the mission's urgency. Set today's pace to the slowest person who genuinely has to arrive. Check behind you before you push forward again. Notice that arriving together matters more than arriving first.`,
        synthesis: `This purpose forms where your paternal and maternal lines meet, and with the Chariot they likely contributed different halves of the same competence — one line's drive and direction, the other's attention to who's actually in the vehicle. Your middle years require both operating together. Direction without that attention produces a leader with no followers; attention without direction produces a group that stays exactly where it is. The crossing this position asks for can't be made with only one lineage's gift.`,
      },

      8: {
        title: `8 in Social Purpose — Justice`,
        tagline: `A Design of the Repaired Account`,
        mastery: `After forty you become the one who can settle something. Both lineages carried imbalances — a favouritism, an unacknowledged debt — and the social task is to be the person with enough standing to address it. You hold yourself to the exact standard you'd hold anyone else to, which is what gives your judgment credibility. And you can deliver an accurate assessment without needing it to be cruel.`,
        shadow: `You judge without repairing. You see the imbalance with unusual precision, and precision alone becomes the whole contribution. Underneath the stopping-at-precision is often a fear that actually repairing it would require confronting the people responsible. Accurate about who wronged whom, and useless for actually resolving it.`,
        invitation: `Ask yourself honestly what you're avoiding by only naming the imbalance instead of fixing it. Take one long-standing imbalance today and do the repairing part, not just the naming part. Take the concrete action that actually settles it. Notice that repair costs less than the years of precision without resolution did.`,
        synthesis: `Both lineages feed this purpose, and with Justice they may well have handed you the two sides of an old imbalance — one line's account of what happened and the other's, not matching. Your middle years put both in one person for the first time. That's what makes resolution possible and what makes it hard: you're the first one positioned to see the whole thing, and therefore the first who can't claim ignorance. This position doesn't ask you to determine who was right. It asks you to end it.`,
      },

      9: {
        title: `9 in Social Purpose — The Hermit`,
        tagline: `A Design of the Reachable Depth`,
        mastery: `The depth you built alone becomes a public resource after forty. The social task inverts what both lineages likely modelled — being genuinely reachable by people who need what you spent decades understanding. You can be self-sufficient without it curdling into isolation. And what you offer from that depth tends to carry more weight than advice given on the fly.`,
        shadow: `Your wisdom stays kept at a distance. You remain the one who is respected, consulted rarely, and known by almost no one. Underneath the distance is often a fear that being reachable would make the depth seem ordinary. You frame that as discernment about who's worth your time.`,
        invitation: `Ask yourself honestly what being reachable would actually cost the depth you've built. Make yourself available today to one person who needs what you know, before they work up the nerve to ask. Reach out first. Notice that reachability doesn't dilute what you know.`,
        synthesis: `This purpose sits where your paternal and maternal lines converge, and with the Hermit they may have taught the same self-sufficiency in two different registers — one line handling things alone as duty, the other as necessity. Your middle years ask you to be the first in either line to make the inner work available. That's the assignment and it runs against both inheritances at once, which is why it feels less like growth and more like exposure. Depth accumulated over two lineages was not meant to terminate in a private conclusion.`,
      },

      10: {
        title: `10 in Social Purpose — Wheel of Fortune`,
        tagline: `A Design of the Attended Downturn`,
        mastery: `You've seen enough cycles by now to know they turn. The social task after forty is to be the person who holds perspective for a group in the middle of one — the steadiness that comes from having genuinely survived a few reversals. You can read which phase a group is actually in, rising or contracting, rather than reacting to noise. And you can let a good period be good without needing to grip it in place.`,
        shadow: `Your perspective dismisses. Because you know it turns, you wave away other people's crises with a philosophical calm that lands as indifference. Underneath the calm dismissal is often a fear that sitting fully inside someone else's crisis would cost you the perspective that protects you. Technically true and completely unhelpful to someone whose life is currently coming apart.`,
        invitation: `Ask yourself honestly what staying present in someone's crisis would actually cost your perspective. Sit with someone today in a downturn, without telling them it will pass. Just stay with them in it. Notice that your perspective survives being set aside for a moment.`,
        synthesis: `Both lineages feed this purpose, and with the Wheel they've contributed two separate records of rise and fall — different eras, different losses, possibly opposite conclusions about how much a person can control. Your middle years hold both. That's what allows genuine steadiness rather than mere optimism or mere fatalism: you have two lines' worth of evidence that neither total control nor total resignation matches how it actually goes. What this position offers a group is precisely that calibration, and it only works if you stay in the room while you offer it.`,
      },

      11: {
        title: `11 in Social Purpose — Strength`,
        tagline: `A Design of the Refusal Set`,
        mastery: `After forty you're asked to carry a situation that would make most people brittle, and to do it without becoming rigid. The social task is to demonstrate the endurance that stays open. You can stay present with raw, unruly states without needing to suppress them or be ruled by them. And you know the difference between gentleness and weakness, so you can be soft without ever being a pushover.`,
        shadow: `Your endurance enables. Your capacity to absorb difficulty without breaking makes it possible for a harmful situation to continue indefinitely. Underneath the absorbing is often a fear that setting a limit would mean the endurance, and the love behind it, wasn't real. You keep making it survivable rather than actually ending it.`,
        invitation: `Ask yourself honestly what setting a limit here would say about the endurance you've shown. Set one limit today inside something you've been holding open indefinitely. Say it plainly, without softening it. Notice that the limit doesn't undo the years of care.`,
        synthesis: `This purpose forms where your paternal and maternal lines meet, and with Strength they likely handed you two different endurances — one line's version hard and visible, the other's soft and unremarked. Your middle years are where those combine into something neither achieved: a steadiness that neither hardens nor simply absorbs. The paternal model alone becomes rigidity; the maternal model alone becomes limitless tolerance. What this position asks for is the gentleness that can still refuse, which is the version that actually protects people.`,
      },

      12: {
        title: `12 in Social Purpose — The Hanged Man`,
        tagline: `A Design of the Chosen Vantage`,
        mastery: `You become the one who sees it differently. After forty the social task is to be the perspective a group can't generate from inside itself — occupying a position not leading, not following, visibly outside the consensus. You see angles from that outside position that people still inside the group simply can't access. And you can pause a decision without anxiety, trusting that stepping outside is doing real work.`,
        shadow: `Your sacrifice gets performed rather than offered. You take the outsider's position and let everyone know what it costs you, so the perspective arrives wrapped in a bill. Underneath the performed cost is often a fear that offering the perspective freely would mean it wasn't valuable enough to charge for. It arrives with strings attached rather than simply as a gift.`,
        invitation: `Ask yourself honestly what you're afraid offering this angle for free would say about its worth. Offer the different angle today, once, plainly, without the cost attached. Give it without expecting acknowledgment of what it took. Notice that the perspective lands better without the bill.`,
        synthesis: `Both lineages feed this purpose, and with the Hanged Man they may each have contained a suspension of their own — an interrupted life, a sacrifice, a waiting that defined someone. Your middle years hold both, which is what makes the reframing possible: you can see what those pauses actually produced and what they merely cost. That's the perspective a group can't manufacture. But it only functions as a gift if you can also come down, because a position occupied permanently stops being a vantage point and becomes the same unfinished thing your lines were already carrying.`,
      },

      13: {
        title: `13 in Social Purpose — Transformation`,
        tagline: `A Design of the Family Terminus`,
        mastery: `You are positioned to stop a pattern. Both lineages carried something forward, and after forty you have enough standing and clarity to be the place it terminates. You can let an old pattern actually die so something truer can take its place. And you can release something that used to serve the family without needing a crisis to force your hand.`,
        shadow: `Transmission happens by default. Patterns continue unless someone actively ends them, and ending one means naming it. Underneath the reluctance to name it is often a fear that ending the pattern would mean implicating the people you love who carried it. So it passes through you intact.`,
        invitation: `Ask yourself honestly what naming this pattern would risk about the people who carried it before you. Name one inherited pattern today out loud, and state that it stops with you. Say it plainly, without softening who it implicates. Notice that ending it doesn't require condemning them.`,
        synthesis: `This purpose sits where your paternal and maternal lines converge, and with Transformation the convergence is the whole mechanism: a pattern that runs in both lines, meeting in one person who can finally see it as a pattern rather than as how things are. That double inheritance is what makes it visible to you and invisible to everyone before you. It's also what makes ending it possible, because you're the first with standing in both lines. This position is not asking for your personal reinvention. It's asking you to be a terminus.`,
      },

      14: {
        title: `14 in Social Purpose — Temperance`,
        tagline: `A Design of the Weighted Side`,
        mastery: `You're built to blend what doesn't naturally mix. After forty that becomes social work: being the person who can hold two opposed parties in the same room, mediating something unreconciled longer than you've been alive. You blend in the right proportion for the specific situation, not by rote formula. And you moderate your own extremes naturally, which is exactly what makes people trust you with something this volatile.`,
        shadow: `Your neutrality resolves nothing. Because you can see every side, you decline to weight any of them, and mediation becomes an endless holding of positions. Underneath the endless holding is often a fear that choosing a side would cost you the trust both sides currently extend to you. Rather than movement toward settlement, it just stays suspended.`,
        invitation: `Ask yourself honestly what you're protecting by never actually taking a side. Take a position today inside a conflict you've been holding neutrally. Say it plainly, knowing one side won't like it. Notice that the trust survives you actually having a position.`,
        synthesis: `Both lineages feed this purpose, and with Temperance the material is often literal: two family lines with different temperaments, different values, possibly an old grievance, meeting in you. Your middle years make you the only person with genuine standing on both sides. That's the qualification for reconciliation and the temptation toward permanent neutrality, since you're the one who'd lose most by choosing. But blending isn't the same as suspending. A mixture that never sets is just two things being held apart carefully.`,
      },

      15: {
        title: `15 in Social Purpose — The Devil`,
        tagline: `A Design of the Broken Concealment`,
        mastery: `Every family and institution has something it doesn't discuss. Both your lineages carried some version of this, and after forty you're positioned to be the one who says it — not to destroy anything, but to end the concealment doing the actual damage. You look directly at the pattern without flinching away or pretending it isn't there. And that unflinching honesty is the actual precondition for the family's liberation, not a detour on the way to it.`,
        shadow: `Your complicity feels like loyalty. You know exactly what's happening, you've known for years, and the arrangement continues with your tacit participation. Underneath the participation is often a fear that naming it would make you the one who broke the family apart. Your knowledge slowly becomes part of what protects the concealment.`,
        invitation: `Ask yourself honestly what you're afraid naming this would make you responsible for. Say the unsayable thing today, to one person who can act. Say it plainly, without softening it into a hint. Notice that naming the concealment isn't what breaks the family — the concealment already was.`,
        synthesis: `This purpose forms where your paternal and maternal lines meet, and with the Devil that convergence often means both lines contributed to the same accommodation — one side's version and the other's, reinforcing each other into something that looks like simply how the family is. Your middle years put you in view of the whole structure. That's the qualification and the trap: seeing all of it also means understanding exactly what naming it would cost, in a way no one with a partial view ever has to reckon with.`,
      },

      16: {
        title: `16 in Social Purpose — The Tower`,
        tagline: `A Design of the Proven Survival`,
        mastery: `Something structural breaks in the world around you during this period, and the social task is to be the one who stays functional while it does. What both lineages hand you is the knowledge that people do come through. You recover fast from real upheaval, integrating what it showed you rather than just surviving it. And you can tell the difference between a collapse that needs catching and one that just needs predicting.`,
        shadow: `You forecast instead of catch. Because you can see the structure failing before others can, you spend the whole period warning and being demonstrably right. Underneath the forecasting is often a fear that getting close enough to actually catch someone would mean risking the same collapse yourself. You do very little to actually hold anyone through it.`,
        invitation: `Ask yourself honestly what actually catching someone would risk exposing about your own footing. Pick one person today and be the thing that holds when their structure goes. Stay close instead of just predicting from a distance. Notice that catching them doesn't cost you your own stability.`,
        synthesis: `Both lineages feed this purpose, and with the Tower they likely each carry a rupture — a lost home, a lost fortune, a lost standing — that may never have been fully discussed in either line. Your middle years hold both, which gives you something neither generation had: proof, twice over, that the collapse was survived. That's precisely what a group needs from you when its own structure goes. Not the prediction, which anyone can eventually make. The demonstrated fact of coming out the other side.`,
      },

      17: {
        title: `17 in Social Purpose — The Star`,
        tagline: `A Design of the Load-Bearing Hope`,
        mastery: `After forty, hope becomes something you hold on behalf of others. The social task is to be the one who can see a future for a group that currently can't — the specific work of keeping a possibility alive. You carry hope that hasn't hardened into naivety, because you've actually looked at the hard parts and kept it anyway. And you inspire real optimism in others just by being near them, without needing to perform positivity to do it.`,
        shadow: `Your optimism refuses to look. You keep the hope alive by declining to fully acknowledge the situation. Underneath the refusal is often a fear that hope which has actually seen the full truth might not survive contact with it. People can't bring you the real state of things, because you've made clear you'd rather not hear it.`,
        invitation: `Ask yourself honestly what you're afraid the full truth would do to the hope you're holding. Say the hopeful thing today immediately after saying the true one, in that order. Hear the bad news fully before you offer the reframe. Notice that your hope survives hearing the whole truth.`,
        synthesis: `This purpose sits where your paternal and maternal lines converge, and with the Star they may each have carried hope in a guarded, quiet, deliberately modest form — the kind that protects against disappointment by never being said too loudly. Your middle years ask you to hold it at full size and out loud, for people who currently can't. That's what neither line quite managed. Hope kept small enough to be safe never helped anyone else; it only ever protected the person holding it.`,
      },

      18: {
        title: `18 in Social Purpose — The Moon`,
        tagline: `A Design of the Spoken Fog`,
        mastery: `Both lineages transmitted atmosphere — a dread, a shame, an unspoken thing everyone absorbed. After forty you're positioned to be the first to put it into words. You engage the unclear and ambiguous without needing everything resolved before you'll name what you sense. And you can hold conflicting feelings about the family at once without needing to resolve the contradiction first.`,
        shadow: `You stay inside the fog with everyone else. You feel the inherited unease as accurately as any of them and treat it as weather, as simply how the family is. Underneath the acceptance is often a fear that naming the fog would mean owning a version of the family story nobody's ready to hear. You absorb it rather than question where it started.`,
        invitation: `Ask yourself honestly what naming the family's unspoken feeling would risk revealing. Ask one older relative today a direct question about something that's never been discussed. Ask it plainly, without softening it. Notice that the question doesn't have to destroy anything to be worth asking.`,
        synthesis: `Both lineages feed this purpose, and with the Moon they've likely each contributed something unspoken — two separate silences, meeting in one person sensitive enough to feel both and detached enough to question them. Your middle years are when that combination becomes usable. Neither line could name its own material from the inside. You can, because you received both and belong entirely to neither, and that is the whole reason this position exists where it does.`,
      },

      19: {
        title: `19 in Social Purpose — The Sun`,
        tagline: `A Design of the Whole Centre`,
        mastery: `After forty you become a centre. The social task is to be the person whose warmth makes a family or community cohere — the one whose presence changes the temperature of a room. You bring genuine vitality into a room just by being in it, contagious rather than performed. And people trust you quickly, without needing your warmth demonstrated first.`,
        shadow: `Your centre can't be a person. Everyone organises around your warmth, which means your own difficulty has nowhere to go. Underneath the concealment is often a fear that showing need would destabilise the thing you've become for them. Showing it would destabilise the role you've settled into.`,
        invitation: `Ask yourself honestly what you're afraid the group would do if they saw you actually need something. Let the group see today that you need something. Say it plainly, without minimizing it. Notice that the group doesn't fall apart when the centre admits a need.`,
        synthesis: `This purpose forms where your paternal and maternal lines meet, and with the Sun they may each have carried a version of this role — one line's warmth expressed through provision, the other's through presence. Your middle years combine them, and the combination is what makes you a genuine centre rather than merely a provider or merely a comfort. The risk is inheriting both lines' unspoken rule at the same time: that the person at the centre doesn't get to need anything. Two lineages agreeing on that is very hard to notice from inside.`,
      },

      20: {
        title: `20 in Social Purpose — Judgement`,
        tagline: `A Design of the Timed Reckoning`,
        mastery: `There's unfinished business in your lines. After forty you're the one with enough standing to complete it — not to build something new, but to close something old. You act on the summons before you've fully rehearsed it, trusting that readiness catches up once you've started. And you can genuinely evaluate the family's unresolved history honestly, without inflating or dismissing it.`,
        shadow: `Your deference reads as respect. You know what's unresolved, and you leave it — out of deference to the people involved, or because the moment never seems right. Underneath the deference is often a fear that addressing it now would confirm it should have been addressed years earlier. It continues to shape people who don't know why.`,
        invitation: `Ask yourself honestly what waiting any longer is actually protecting you from confronting. Address the unfinished thing today, while the people involved are still alive to be part of it. Don't wait for a more comfortable moment. Notice that the timing was never actually going to feel perfect.`,
        synthesis: `Both lineages feed this purpose, and with Judgement the unfinished business often runs in both — two separate avoidances, or one shared silence that each line maintained from its own side. Your middle years are the first time both are held by someone with standing to act. That's why this lands here rather than earlier: at thirty you'd have lacked the position, and later the people needed to complete it may be gone. This position is time-bound in a way most aren't.`,
      },

      21: {
        title: `21 in Social Purpose — The World`,
        tagline: `A Design of the Declared Completion`,
        mastery: `Both lineages were working on something and neither finished. After forty your social task is completion: taking whatever they began and bringing it to an actual conclusion. You integrate everything, the hard parts and the good parts, into one finished whole instead of only keeping what flatters the family story. And you find genuine satisfaction in completion itself, not just in the next expansion it opens up.`,
        shadow: `You expand the inheritance rather than complete it. You add more scope, more scale, another generation of ongoing effort. Underneath the expanding is often a fear that declaring it complete would mean deciding the family's effort was, finally, enough. Because completing it would mean deciding it was enough, and that decision feels like yours alone to make.`,
        invitation: `Ask yourself honestly what declaring this complete would risk about the family's ongoing story. Declare one inherited project complete today, and stop working on it. Say it plainly, to the people still invested in it. Notice that closure doesn't diminish what was already built.`,
        synthesis: `This purpose sits where your paternal and maternal lines converge, and with the World that convergence is the completion itself: two separate arcs meeting in a person who can see both whole. Neither line could finish alone, because neither could see the shape of the other. Your middle years are the first vantage point from which the whole thing is visible — which is exactly what makes closure possible, and exactly what makes the temptation to keep building so strong. Seeing more has to end in finishing, not in widening.`,
      },

      22: {
        title: `22 in Social Purpose — The Fool`,
        tagline: `A Design of the Witnessed Leap`,
        mastery: `Both lineages had a leap they didn't take. After forty your social task is to take it, visibly enough that it changes what the people around you believe is permitted. You step forward without needing a guarantee handed to you first, real trust rather than naivety. And that visible leap tends to open something for the people watching, not just for you.`,
        shadow: `You inherit the caution and call it wisdom. You reach the age where the leap becomes possible and produce excellent reasons not to. Underneath the reasons is often a fear that taking the leap and failing would prove the family's caution was right all along. The same reasons both lines gave, recycled as your own.`,
        invitation: `Ask yourself honestly what failing at this leap would seem to confirm about the family's old caution. Take one visible risk today that your family would consider unnecessary. Take it in front of the people who need to see it's possible. Notice that the leap itself changes what's considered permitted, regardless of outcome.`,
        synthesis: `Both lineages feed this purpose, and with the Fool they may each have contained an untaken leap — two separate hesitations, arriving in one person who has both the capacity and, finally, the standing. Your middle years are when the accumulated caution of two lines either gets confirmed or gets broken. That's a heavier thing than a personal risk, and it's why this position sits in the social rather than the personal half: the leap here isn't for you. It's to show the people watching what the boundary actually was.`,
      },

    },

    // ═══════════════════════════════════════════════════════════════════
    // SPP — SPIRITUAL PURPOSE (60+), the "General Destiny Purpose"
    // Personal Purpose meeting Social Purpose — the integration of the
    // individual task and the collective one.
    // ═══════════════════════════════════════════════════════════════════
    SPP: {

      1: {
        heading: `In the End, You Are Meant to Hand the Fire Over`,
        why: `The late work is transmission. Everything you learned about making things happen — first for yourself, then for others — comes down to whether you can put that capacity into someone else's hands and let them use it badly at first. This is the final form of initiating force: not one more beginning of your own, but making beginnings possible after you. What you're actually passing on isn't skill. It's permission.`,
        shadow: `The distortion is holding the fire because no one will carry it properly. You keep initiating past the point where initiating is yours to do, and each time you take something back you confirm what you suspected — that they weren't ready. You may notice that people around you have stopped offering, and that you experience this as proof rather than as consequence.`,
        path: `Hand something over and let it be done worse than you'd do it. You are allowed to stop being the one who starts things. Who is waiting for you to let go of something you've held since you were young?`,
        positive: `You've handed it over. The capacity that ran your whole life is operating in other people now, and you can watch them use it differently without needing to correct the grip. What's most striking is how little you miss holding it — the fire being carried turns out to matter more than being the one carrying it. There are beginnings happening around you that you made possible and had no hand in.`,
        negative: `The initiating force is still real and it's still entirely yours. You may notice you're the one starting things well past the age where that was the assignment, that handovers keep reverting to you, and that you've quietly concluded no one else can be trusted with it. That conclusion is usually self-fulfilling. The specific loss here isn't your energy — it's that the capacity dies with you rather than continuing, which is the one outcome this position exists to prevent.`,
        synthesis: `This purpose is your Personal Purpose and your Social Purpose combined — the thing you were becoming and the thing you were doing for others, resolved into one. With the Magician, the resolution is release. The personal task was learning what your force was for; the social task was spending it on other people's beginnings. The late task is neither: it's letting the force leave your hands entirely. Everything before this was about wielding it well. This is about it outliving you, which is the only version that was ever going to last.`,
      },

      2: {
        heading: `In the End, You Are Meant to Be a Place People Can Bring Things`,
        why: `The late work is receptivity without agenda. A lifetime of perceiving what others miss, and then of naming it, resolves into simply being available — a person who can be told anything and will neither flinch nor advise. This is quieter than every stage before it. What people need from you at this point isn't your insight; it's the experience of being fully seen by someone who wants nothing from what they've disclosed.`,
        shadow: `The distortion is knowing that has curdled into judgement. Decades of accurate perception can settle into a habit of seeing through everyone, and people can feel it — so they stop bringing you things. You may notice you understand your family better than anyone and are told less than anyone, and that your accuracy has somehow made you unsafe to confide in.`,
        path: `Receive one disclosure without interpreting it. You are allowed to know something about someone and never mention it again. Who used to tell you things and stopped?`,
        positive: `People bring you things. A lifetime of perception has resolved into something rare — you can be told the worst of a person's situation and they leave feeling less alone rather than more exposed. You still see everything; you've simply stopped needing to demonstrate it. That restraint is what made you safe, and being safe is what this whole capacity was always for.`,
        negative: `The perception is intact and it's landing as judgement. You may notice people editing themselves around you, that confidences have thinned over the years, and that your understanding of others has become a private assessment rather than something they benefit from. This isn't unkindness. It's accuracy without enough restraint, and its cost arrives late and quietly: being the most perceptive person in the family and the last one anybody tells anything.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was trusting your own knowing; the social task was speaking it. With the High Priestess, the late resolution is neither trusting nor speaking but holding — becoming a place where things can be set down. That's why it comes last. You cannot safely receive what people are most ashamed of until you've stopped needing your perception to be acknowledged, and that stopping usually takes the first two stages to accomplish.`,
      },

      3: {
        heading: `In the End, You Are Meant to Let What You Grew Belong to Others`,
        why: `The late work is release of authorship. You made things — work, people, homes, communities — and the final task is letting them be fully theirs, including the right to change what you built. This is harder than making was. The generative capacity that defined your life resolves not into more creation but into blessing what you created and stepping back from its future.`,
        shadow: `The distortion is a claim that never lifts. You continue to hold what you grew — offering guidance that functions as ownership, taking changes to it personally — and the people who inherited it end up managing your feelings about their own inheritance. You may notice that your creations still route decisions through you, and that you'd describe this as care.`,
        path: `Let something you made change in a way you dislike, without comment. You are allowed to be proud of something that no longer resembles what you built. What are you still holding that has belonged to someone else for years?`,
        positive: `What you grew belongs to the people who have it now. You can watch them change it, in ways you wouldn't have chosen, without experiencing it as loss — because you've understood that a thing still requiring your approval was never actually given. The fertility of your whole life has ended in genuine handover, and what you made continues without needing you, which is the difference between a legacy and a monument.`,
        negative: `The creative claim hasn't lifted. You may find that what you built still defers to you, that alterations feel like repudiations, and that the people who received your work carry a low-level obligation to keep it recognisable. That obligation is heavier than it looks from your side. A creation that can never be altered isn't inherited — it's on loan, and it tends to be quietly abandoned once the lender is gone.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was making something that was yours; the social task was making something that fed people. With the Empress, the late task is the hardest of the three: letting it stop being yours at all. Everything you built was practice for this, because you cannot release what you never fully made or fully gave. Ownership is what has to end — not the work, and not the love for it.`,
      },

      4: {
        heading: `In the End, You Are Meant to Let the Structure Stand Without You`,
        why: `The late work is dissolution of your own necessity. A lifetime of building and then of holding structure for others resolves into a single question: does it work when you're not there. This is the completion of authority — not passing on the role, but discovering whether what you made can hold weight in your absence. Most people with this signature never test it, and never find out.`,
        shadow: `The distortion is indispensability defended to the end. You keep the structure dependent because dependence is evidence you mattered, and each demonstration that things falter without you confirms your value while proving your work incomplete. You may notice you cannot be away for long, and that you've come to read this as commitment rather than as a design flaw you introduced.`,
        path: `Be genuinely absent and let the results be what they are. You are allowed to build something that doesn't need you and to find that unflattering. What would actually break if you stepped away for a year?`,
        positive: `It stands without you. You built structures that hold when you're not holding them, and you've been able to watch that happen without reading it as diminishment. That took something most people with your capacity never manage: valuing the thing above being needed by it. What you're responsible for will outlast you functionally, not just sentimentally, which is the only real completion this position offers.`,
        negative: `The structure still runs on you. You may notice you can't step away, that things visibly degrade in your absence, and that some part of you is reassured by that. It usually presents as duty. What it actually is, is a structure built to require its builder — and the late cost is severe, because everything you spent your life constructing becomes something the next generation has to rebuild rather than inherit.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was building something that held; the social task was holding it for other people. With the Emperor, the final task inverts both: making yourself unnecessary to the thing you built. That can only come last, because it requires having actually built something and actually carried it — you cannot meaningfully step back from a structure you never bore the weight of. This is authority's completion, and it looks from the inside like being no longer needed.`,
      },

      5: {
        heading: `In the End, You Are Meant to Let Them Believe Differently`,
        why: `The late work is releasing the framework. You examined what you were given, then transmitted what survived — and the final task is watching the next generation keep some of it, discard some, and add things you find questionable, without intervening. This is the completion of the teaching function: your beliefs become theirs to use, which means theirs to change.`,
        shadow: `The distortion is orthodoxy enforced past your authority. You continue correcting, and because you're often right, the correcting works — producing people who repeat your framework without owning it, exactly as you once repeated your own inheritance. You may notice that your children or students agree with you conspicuously and think about it very little.`,
        path: `Let someone you taught be wrong about something important, and say nothing. You are allowed to have your framework revised by people who learned it from you. Whose disagreement have you been correcting instead of considering?`,
        positive: `They believe differently and you've let them. What you taught got taken up, tested, partly kept and partly discarded — which is what happens to any framework that was genuinely transmitted rather than imposed. You can hear someone you taught contradict you and recognise it as the process working. What you passed on is alive precisely because it's being argued with.`,
        negative: `The framework is still being defended. You may notice that agreement around you is broad and shallow, that people rehearse your positions rather than holding them, and that disagreement gets corrected quickly enough that it rarely surfaces twice. This produces the specific failure this position is built to prevent: a doctrine transmitted so successfully that nobody ever made it their own, which means it will be dropped entirely the moment you're not there to maintain it.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was finding out what you actually believed; the social task was transmitting only what survived that test. With the Hierophant, the late task completes the sequence: allowing the next generation to run the same test on you. That has to come last — you cannot let your framework be examined by others until you've examined it yourself, or the challenge feels like destruction rather than continuation.`,
      },

      6: {
        heading: `In the End, You Are Meant to Love Without Requiring the Choice Back`,
        why: `The late work is unconditional regard. A life spent learning to choose, and then to choose deliberately among people, resolves into loving people who did not choose you back in the way you wanted. Children who went elsewhere, friends who drifted, a partner who loved differently than you needed. This is the completion of the relational task: connection that no longer depends on being reciprocated in kind.`,
        shadow: `The distortion is love kept conditional to the end. You maintain a quiet ledger of who chose you sufficiently, and it governs your warmth in ways you'd deny — more available to the ones who stayed close, subtly cooler to the ones who didn't. You may notice that your family can sense a ranking you've never stated, and that the ones lower in it have stopped trying.`,
        path: `Be fully warm to someone who disappointed you relationally, without them having repaired it. You are allowed to love someone who chose differently. Who have you been loving at a discount?`,
        positive: `You love without terms. The people who went their own way, chose others, or simply couldn't give you what you wanted have your full warmth anyway — not as a performance of grace, but because you stopped requiring reciprocity to match. That's changed your whole family's atmosphere. People come back to someone who never made returning conditional, and many of them have.`,
        negative: `The love is real and it's still being priced. You may notice a difference in your warmth toward people based on how they chose, that you'd describe this as natural, and that the ones receiving less know it precisely. The ledger was earned honestly — those disappointments were real. But maintained into this stage of life, it tends to produce exactly the distance it was measuring, and the people you most wanted to choose you eventually stop trying to earn back a warmth that keeps being withheld.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was choosing at all; the social task was choosing consciously among competing loyalties. With the Lovers, the late task releases the mechanism entirely: loving without the choosing being the point. That can only come third, because you cannot give unconditionally what you never learned to give deliberately. Undiscriminating warmth at twenty is just avoidance; the same warmth at seventy, after a lifetime of costly choices, is something else entirely.`,
      },

      7: {
        heading: `In the End, You Are Meant to Stop and Let the Journey Have Been Enough`,
        why: `The late work is arrival. A life of momentum — first your own, then a group's — resolves into stopping, and finding that where you got to is where you were going. This is genuinely difficult for this position, because motion has been the identity, and stillness registers as failure long after it's become the actual task. What's asked is that you let the distance travelled count without needing to add to it.`,
        shadow: `The distortion is driving until you're stopped. You keep the momentum going past the point of usefulness, taking on new campaigns because arriving would mean facing what the movement has been outrunning. You may notice that stillness produces a specific dread, and that you've never once in your life stopped voluntarily.`,
        path: `Stop before something stops you, and stay stopped long enough to feel it. You are allowed to have arrived. What would you have to feel if you weren't moving?`,
        positive: `You stopped, and it was enough. The drive that carried you and then carried others has come to rest, and you can look at the distance without needing to extend it. What's most notable is that the stillness didn't turn out to be empty — the thing you spent decades outrunning was mostly the fear of finding out. There's a settledness in you now that no amount of further movement would have produced.`,
        negative: `The momentum hasn't stopped. You may notice you're still taking on campaigns, that rest produces something closer to dread than relief, and that you cannot quite say what you'd be if you weren't in motion. This isn't vitality, though it convincingly resembles it. It's a lifetime of movement that never resolved into arrival, and the risk specific to this stage is that the stopping, when it comes, will not be chosen — and everything you were outrunning arrives at once.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was finding a direction; the social task was bringing people with you. With the Chariot, the late task is the one neither prepared you for: stopping. It comes last because arrival is meaningless without a journey, and you had to have gone somewhere real, with others, before rest could be completion rather than surrender. The vehicle was always meant to reach somewhere and be left there.`,
      },

      8: {
        heading: `In the End, You Are Meant to Close the Accounts`,
        why: `The late work is settlement. A lifetime of noticing imbalance, and then of repairing it for others, resolves into clearing your own remaining ledger — forgiving what won't be repaid, apologising for what you can't undo, and releasing the accounts that will never be balanced. This is the completion of the just life: knowing that some debts don't settle, and choosing to close them anyway.`,
        shadow: `The distortion is the ledger carried to the grave. You keep the accounts open because closing them unresolved feels like endorsing the injustice, and so you die owed. You may notice that your sense of fairness has become the reason you're estranged from people whose wrongs were, at this distance, fairly ordinary.`,
        path: `Close one account that will never be settled fairly. Forgive it, or apologise for your part, without waiting for the other side. You are allowed to release a debt that was genuinely owed. What are you still owed that you're prepared to die holding?`,
        positive: `The accounts are closed. You've forgiven things that were never repaid and apologised for things you can't undo, without either requiring the other party to participate. That's the completion of a life organised around fairness — not achieving balance, but being willing to release the imbalance. The precision never left you; it simply stopped being the thing that governs who you can be close to.`,
        negative: `The ledger is still open. You may find that specific wrongs remain uncleared decades on, that your accuracy about them hasn't dimmed, and that closing them without acknowledgement would feel like a lie. That's an honest position and it has a late cost: the relationships in question run out of time before the debts run out of principle. This isn't bitterness. It's exactitude with no mechanism for release, and at this stage it mostly costs you the people rather than the point.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was learning what your standard actually costs; the social task was repairing imbalances larger than your own. With Justice, the late task is the release of the instrument itself — closing accounts by decision rather than by settlement. It can only come last, because forgiveness offered before you've fully reckoned with a wrong isn't mercy, it's avoidance. You had to keep the ledger accurately for decades to be able to close it meaningfully.`,
      },

      9: {
        heading: `In the End, You Are Meant to Be Alone Without Being Lonely`,
        why: `The late work is solitude that has stopped being a retreat. You went inward, then made what you found available — and now the aloneness returns, but changed: not withdrawal from people, simply the natural condition of a life that has become interior. This is the completion of the hermit's arc, and it's the one stage where the solitude is finally not costing anything.`,
        shadow: `The distortion is isolation dressed as arrival. You mistake having withdrawn for having transcended, and the late years become a slow closing of doors that you narrate as spiritual maturity. You may notice that your solitude has stopped producing anything — no insight, no writing, no attention — and has simply become the absence of people.`,
        path: `Keep one door genuinely open. Let one person interrupt the solitude regularly, whether or not you feel like it. You are allowed to be deeply alone and still be reachable. Is your solitude producing anything, or has it just become quiet?`,
        positive: `You're alone and it isn't loneliness. The interior life you built has become the actual shape of your days, and it's generative rather than merely quiet — you're still working something out, still attending to something. And the doors are open: people reach you, and you let them, without the solitude being threatened by it. That combination is what the whole arc was for.`,
        negative: `The solitude has stopped producing. You may notice that the aloneness which once yielded genuine understanding now mostly yields silence, that fewer people reach you each year, and that you've framed this as depth. The distinction that matters at this stage is whether the solitude is doing work. When it stops and the isolation continues, what's left isn't the hermit's completion — it's just a room, and the framing that calls it wisdom is the thing preventing anyone from knocking.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was going in and coming back; the social task was being findable. With the Hermit, the late task holds both simultaneously — a genuinely interior life that remains open. That's why it comes last: solitude before you've learned to return is escape, and availability before you've been genuinely alone is just company. Only after both does aloneness stop being a movement away from anything.`,
      },

      10: {
        heading: `In the End, You Are Meant to See the Whole Pattern and Not Need It to Be Fair`,
        why: `The late work is acceptance of the shape. You lived the cycles, then steadied others through theirs, and now you can see the entire arc — including the parts where effort and outcome had no relationship at all. The task is to hold that whole view without requiring it to have been just. This is the specific peace this position offers, and it isn't available earlier because you need the full length to see it.`,
        shadow: `The distortion is a life audited for fairness and found wanting. You review the whole arc looking for proportion — where you were owed, where others got what you didn't — and the review never resolves because the proportion isn't there to find. You may notice a bitterness that arrives late and attaches to things you'd long thought settled.`,
        path: `Look at the whole shape once, including the unfair parts, without adjusting the account. You are allowed to have had an arc that wasn't proportional. What are you still trying to make add up?`,
        positive: `You see the whole thing and you've stopped auditing it. The arc had stretches where effort produced nothing and stretches where it produced far more than it should have, and you can hold both without needing them reconciled. That's produced a genuine steadiness — not resignation, but the specific calm of someone who has stopped requiring the pattern to be fair before they'll accept it as theirs.`,
        negative: `The review is still running. You may find yourself going back over the arc, locating the places where the return didn't match the investment, and being unable to set the accounting down. This tends to surface late, after the active years, when there's time to think. It isn't ingratitude. It's a lifetime of pattern-recognition turned on your own life and finding no pattern, and the search for one can consume the years that were meant to be the settled ones.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was distinguishing what you steer from what you ride; the social task was steadying others through their own turns. With the Wheel, the late task requires both: enough distance to see the whole shape, and enough humility to stop demanding it be just. It comes last for the plainest reason — you cannot see the arc until it's nearly complete, and this position's peace was never available in the middle of it.`,
      },

      11: {
        heading: `In the End, You Are Meant to Be Gentle Without It Costing You Anything`,
        why: `The late work is softness that's finally free. A life of enduring, then of holding difficulty for others, resolves into gentleness that isn't absorbing anything — kindness that costs nothing because it's no longer compensating, tolerating, or holding a system together. This is the one stage where the softness is purely itself.`,
        shadow: `The distortion is absorbing to the end. You keep carrying, because carrying is what you know and because there's always someone who benefits, and the strength that was genuine becomes the reason your last years are spent on other people's unresolved difficulty. You may notice you're still the one holding something, and that no one has asked whether you should be.`,
        path: `Put down the thing you're still carrying, even if no one else picks it up. You are allowed to be gentle without it being useful to anyone. What are you still absorbing at this stage of your life?`,
        positive: `Your gentleness costs nothing now. You're still soft — that was never going to change — but it's stopped being load-bearing for anyone else's unresolved situation. What people receive from you is kindness rather than absorption, and the difference is that you're not depleted by it. After a lifetime of strength that looked like softness, this is softness that finally doesn't have to be strong.`,
        negative: `You're still holding something. You may notice that a family difficulty, a person, or an arrangement is still running on your tolerance at an age when it shouldn't be yours, and that stepping back feels like abandonment. The strength is real and it's been continuously spent since you were young. What this stage was supposed to offer is the first gentleness that isn't also a load, and it doesn't arrive on its own — it only arrives if something gets put down.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was recognising your gentleness as strength; the social task was holding difficulty without hardening. With Strength, the late task removes the function altogether: softness with nothing to withstand. It has to come last, because gentleness that has never been tested is just untried, and gentleness still being tested isn't free yet. Only after both does it become simply what you're like.`,
      },

      12: {
        heading: `In the End, You Are Meant to Let the Whole Thing Be Seen Differently`,
        why: `The late work is the final reversal. You learned from suspension, then held an outside angle for others, and now the task turns on your own life: seeing your whole story from a vantage point that inverts what you thought it meant. The losses read differently. The sacrifices reveal what they actually bought. This is the reframing the entire position was building toward, and it can only be done from the end.`,
        shadow: `The distortion is the story fixed in place. You reach this stage with the meaning of your life already settled — usually settled early, and usually around a wound — and decline the reframing because revising it now would make the suffering feel wasted. You may notice you tell your history the same way you've told it for forty years, with the same emphasis, arriving at the same conclusion.`,
        path: `Tell one part of your life story with a different emphasis and see whether it's also true. You are allowed to revise what your own suffering meant. What have you been certain your life was about?`,
        positive: `You see it differently now. The story you carried for decades has turned over, and from this angle the losses did something other than take — not redeemed exactly, but revealed. That reframing has loosened something that was fixed since you were young. You can hold your own history without needing it to mean what you always insisted it meant.`,
        negative: `The story hasn't moved. You may notice you narrate your life with the same emphasis you settled on long ago, that the meaning has been fixed since some early defining event, and that alternative readings feel like a betrayal of what it cost. That's an understandable defence and it forecloses the specific thing available now. The suspension you lived through was supposed to eventually produce a new angle. Held without one, it stays what it was: time spent, waiting to mean something.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was letting the pause teach you; the social task was holding a different angle for other people. With the Hanged Man, the late task turns that same capacity on your own history. It comes last necessarily — a life can't be reframed from the middle, because you need the whole shape before the inversion shows you anything. This is the one position where the final stage completes a movement the first two only rehearsed.`,
      },

      13: {
        heading: `In the End, You Are Meant to Let Go Without It Being Taken`,
        why: `The late work is voluntary release. You survived endings, then ended a pattern for the whole line, and the final task is releasing things before they're removed — roles, capacities, the body's reliability, the sense of yourself as the person who does. This position spends a lifetime learning that endings aren't defeats, and this is where that knowledge is actually needed.`,
        shadow: `The distortion is holding until it's pried away. You keep everything until circumstance takes it, so every ending arrives as a loss rather than a decision, and the accumulated experience of endings never converts into any ease with them. You may notice you're gripping things that are already going, and that this feels like fighting rather than what it is.`,
        path: `Release one thing on your own terms while you still could have kept it. You are allowed to end something before it ends itself. What are you holding that would be easier to put down than to have removed?`,
        positive: `You let go before it's taken. A lifetime of endings taught you something most people never learn — that releasing on your own terms is entirely different from being stripped — and you've applied it to your own late losses. What goes, goes cleanly. There's a dignity in that which has nothing to do with control, and everyone around you can feel it.`,
        negative: `Everything is being held until it's removed. You may notice you're gripping roles and capacities that are already leaving, that each loss arrives as a defeat, and that the endings you survived earlier taught you nothing transferable. That's the specific waste this position risks: a life full of transformation that never produced any ease with letting go. It doesn't require resignation. It requires releasing one thing deliberately, which is a different act entirely from losing it.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was letting your own old version die; the social task was ending a pattern for the whole line. With Transformation, the late task is the same movement applied to what you can't replace. It comes last because you need both prior endings to know the difference between release and loss — and this stage, more than any other, is where that distinction determines what the years actually feel like.`,
      },

      14: {
        heading: `In the End, You Are Meant to Have Found the Proportion That Was Yours`,
        why: `The late work is a settled ratio. You spent a life adjusting — between your own needs and others', ambition and ease, holding on and letting go — and finally the proportion stops needing constant correction. This is what all that calibration was for: not a formula, but a way of being that has found its own weighting and can rest in it.`,
        shadow: `The distortion is adjusting forever. The calibrating never stops, so there's no stage of the life that simply is what it is — every arrangement remains provisional, every commitment subject to rebalancing. You may notice you've never once felt settled, and that you'd describe this as staying responsive rather than as never arriving.`,
        path: `Let one arrangement in your life be final rather than provisional. You are allowed to stop adjusting. What have you been calibrating for so long that you've forgotten it could simply be settled?`,
        positive: `The proportion has settled. After a lifetime of adjustment you've found the weighting that's actually yours, and you've stopped treating it as provisional — which has produced something you never had while you were still calibrating, which is rest. The responsiveness is still available when it's needed. It's just no longer running constantly in the background.`,
        negative: `The adjusting hasn't stopped. You may notice that nothing in your life feels concluded, that every arrangement remains open to revision, and that the flexibility which served you so well has become an inability to let anything be final. Late in life this produces a particular restlessness — not dramatic, just the absence of ever having arrived anywhere. The blending was always supposed to eventually produce a mixture, not an indefinite process of mixing.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was finding proportions that worked; the social task was reconciling things outside yourself. With Temperance, the late task is to stop — to let the ratio you found be the answer rather than the current working hypothesis. It comes last because a settled proportion is only meaningful after decades of testing, and settling early would have been rigidity rather than resolution.`,
      },

      15: {
        heading: `In the End, You Are Meant to Be Free of the Thing That Had You`,
        why: `The late work is release from the grip. You looked at your own appetites honestly, then named what your circle wouldn't, and the final task is being genuinely unbound — not through suppression, but because the thing simply no longer has purchase. This position's whole arc is toward that, and this is the stage where it either happens or doesn't.`,
        shadow: `The distortion is the bind maintained to the end, usually in a quieter form. The compulsion may have softened into something respectable — a resentment, a control, a small private arrangement — and because it no longer looks dramatic, it never gets addressed. You may notice something still has you and that you've stopped even framing it as something that could end.`,
        path: `Name the thing that still has purchase, in its current quiet form. You are allowed to be free of it this late. What still owns a piece of you that you've stopped calling by its name?`,
        positive: `You're free of it. The thing that gripped you — in whatever form it took across the decades — no longer has purchase, and not because you're suppressing it. There's a specific lightness to this that people who were never bound don't have. You know exactly what you're capable of wanting, you're not ashamed of it, and none of it is running you.`,
        negative: `Something still has you. It may look nothing like it did at thirty — quieter, more respectable, easier to justify — but the mechanism is the same, and it's been running long enough that you've stopped naming it as a bind. That's what makes this stage risky for this position: the compulsion becomes indistinguishable from personality. It was always going to be concealment rather than the appetite itself that determined how this ended.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was honesty about your own wanting; the social task was naming what a whole system was accommodating. With the Devil, the late task closes the arc: being genuinely unbound. It comes last because freedom here isn't achieved by will — it's the residue of decades of not hiding, from yourself first and then from others. The concealment was always the engine, and this is where its absence finally shows.`,
      },

      16: {
        heading: `In the End, You Are Meant to Stand on What Didn't Fall`,
        why: `The late work is recognising the foundation. You survived a collapse, then held others through theirs, and the final task is identifying what has never gone — the thing that remained through every rupture. This position spends a lifetime losing structures, and the point of all of it is discovering what was never structural.`,
        shadow: `The distortion is a life defined by the falls. You reach this stage with your history organised around what collapsed, still bracing, still identifying primarily as someone things happened to. You may notice you can list your ruptures precisely and would struggle to name what survived them.`,
        path: `Name what has never gone, across every collapse you've been through. You are allowed to have a foundation. What's still here that nothing ever took?`,
        positive: `You know what didn't fall. Across every rupture something remained, and you can name it — not as consolation, but as the actual ground you've been standing on the whole time. That's the specific completion this position offers: a life full of collapse that produced, in the end, an unusually clear sense of what was never structural to begin with. Very little frightens you now.`,
        negative: `The falls are still the story. You may notice your history organises around what was lost, that the bracing never fully stopped, and that you'd find it easier to list your ruptures than to name what came through them. Something did come through — it always does, or you wouldn't be here to review it — but it goes unnamed, so it can't be stood on. That's the difference between having survived and knowing what survived, and only the second one is any use this late.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was discovering you weren't the structure that fell; the social task was being steady while others' structures went. With the Tower, the late task is naming the foundation both stages revealed. It comes last because it takes more than one collapse to distinguish what's genuinely permanent from what merely hadn't fallen yet — and this position, more than any other, is given the collapses required to find out.`,
      },

      17: {
        heading: `In the End, You Are Meant to Leave the Hope With Someone Else`,
        why: `The late work is transferring the vision. You learned to hope at full size, then to carry hope for people who'd lost it, and the final task is handing it to someone who'll still be here — a vision that continues without you holding it. This is what all that hoping was for: not fulfilment in your lifetime, but the possibility surviving into the next one.`,
        shadow: `The distortion is a hope that dies with you. You keep the vision personal to the end, and because it was always yours, no one else is carrying it when you stop. You may notice that what you most wanted for the world exists nowhere except in you, and that you've never actually asked anyone to take it up.`,
        path: `Give the vision to one specific person, explicitly, and let them hold it differently. You are allowed to hope for something you won't see. Who would carry what you've wanted, if you asked them plainly?`,
        positive: `The hope has somewhere to go. You handed the vision to people who'll outlive you, and they hold it differently than you did — which is what makes it theirs and what makes it durable. You've stopped needing to see it realised, which turns out to be the condition for it actually being passed on. What you wanted for the world is no longer contingent on your being here.`,
        negative: `The vision is still yours alone. You may notice that what you've most hoped for exists mainly in you, that you've never explicitly asked anyone to take it up, and that some part of you is holding it because handing it over would mean admitting you won't see it. That's a real grief and it has a cost beyond you: an unhanded hope simply stops. This position spends a lifetime learning to hope at full size, and this is where the size is finally tested against mortality.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was hoping without pre-shrinking it; the social task was carrying hope for others who couldn't. With the Star, the late task completes the sequence: releasing the hope to people who will outlast you. It comes last because you can only hand over a vision you've held at full size and already carried for someone else — anything smaller isn't worth transferring, and anything you've never carried for another person you don't yet know how to give away.`,
      },

      18: {
        heading: `In the End, You Are Meant to Be Clear About What Was Never Yours`,
        why: `The late work is the final sorting. You learned to distinguish your own feeling from what you absorbed, then named what your family only ever felt — and now the task is completing that separation for yourself, definitively, before the account closes. What of this long unease actually originated with you? Most of it, for this position, did not.`,
        shadow: `The distortion is dying inside the fog. The sorting never gets finished, so the inherited material stays attached to your name, and you go out carrying a shame or a dread that started two generations before you. You may notice you've assumed something was a fact about your character for so long that examining it now feels pointless.`,
        path: `Do the sorting once more, thoroughly, and set down what traces to someone else. You are allowed to die free of something you never generated. What have you believed about yourself that actually belongs to someone before you?`,
        positive: `The sorting is done. You can distinguish, with real clarity, between what originated in you and what you absorbed from two lines that never named anything — and you've set the second category down. What's left is genuinely yours, and it's a considerably lighter load than what you carried for most of your life. The sensitivity became, in the end, the exact instrument needed to free you from what it had been picking up.`,
        negative: `The fog never fully lifted. You may still carry a dread or a shame you've long assumed was a fact about your character, having never traced it, because in your family things were felt rather than examined. This late, the examination can feel futile — but the sorting is the specific work this position exists for, and it's the difference between ending as yourself and ending as the last carrier of something that was never about you at all.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was asking whether a feeling was yours; the social task was naming what the whole family only ever felt. With the Moon, the late task turns the instrument fully inward one final time. It comes last because you need both the discrimination and the family-level view to complete it — knowing what your lines carried is what finally lets you identify what, in you, was only ever theirs.`,
      },

      19: {
        heading: `In the End, You Are Meant to Be Warm With Nothing Required`,
        why: `The late work is warmth without function. You learned to be seen without performing, then became the centre a group organised around, and the final task is warmth that isn't holding anything together — no role, no obligation, no atmosphere to maintain. Just what you're actually like when nothing depends on it.`,
        shadow: `The distortion is performing to the last. The role became so total that there's no version of you available without it, and the late years are spent being what people expect rather than what you are. You may notice you cannot be flat around anyone, that even now your difficulty gets managed privately, and that you've genuinely forgotten what you'd be like if nothing were required.`,
        path: `Be entirely unperformed with one person, for one afternoon. You are allowed to be warm because you feel like it and cool because you don't. What would you be like if nothing at all depended on your brightness?`,
        positive: `The warmth is nothing but itself now. Nothing depends on it — no role, no group cohesion, no expectation — and it's still there, which is how you know it was always real. You can be flat, tired, or difficult in front of people who love you, and the light comes back on its own. A lifetime of being the centre resolved into simply being someone warm, which is a smaller and much better thing.`,
        negative: `The performance is still running. You may find you can't be low around anyone, that your own difficulty is still handled entirely alone, and that after all these decades you genuinely don't know what you'd be like unobserved. This isn't vanity. It's a real gift that got conscripted early and never released, and this stage is the last opportunity to find out what's underneath. The loneliness of it is specific: universally beloved, and never once met.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was being seen without performing; the social task was being the warmth a group formed around. With the Sun, the late task removes the audience entirely. It comes last for an obvious reason — you can only discover that the warmth is real once nothing depends on it, and that test isn't available while you're still holding a family or a community together with it.`,
      },

      20: {
        heading: `In the End, You Are Meant to Answer Without Anything Left to Prove`,
        why: `The late work is the final response. You answered a personal call, then settled what your family never finished, and now the task is answering with nothing riding on it — no career, no reputation, no outcome you'll be around to see. This is the purest version of the summons this position keeps issuing: doing the thing because it's yours to do, full stop.`,
        shadow: `The distortion is waiting for a call that already came. You reach this stage still anticipating clarity, still preparing, and the summons you've heard your whole life passes unanswered because it never arrived in the definitive form you were waiting for. You may notice you've been almost-ready for decades.`,
        path: `Answer it now, in whatever reduced form is actually available. You are allowed to respond too late and have it still count. What have you been waiting your whole life to be sure about?`,
        positive: `You answered. Not at the scale you once imagined and not on any schedule that would have impressed anyone, but genuinely — with nothing riding on it except that it was yours to do. That's the purest version this position ever offered. The low hum of postponement that ran under most of your life is gone, and what replaced it isn't triumph. It's something quieter and considerably better.`,
        negative: `The call is still unanswered. You may find you can describe it precisely, have been able to for decades, and are still waiting for a certainty that was never going to arrive in the form you wanted. The reasons have changed over the years and the position hasn't. What's specific to this stage is that the reasons are running out along with the time — and this position's entire structure is built around a summons that only ever required a response, never a guarantee.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was answering your own call; the social task was completing what your family left unfinished. With Judgement, the late task strips away every remaining external stake. It comes last because only now is there nothing to gain — no career it advances, no reputation it builds, no outcome you'll witness. Answering under those conditions is the only version that was ever really being asked for.`,
      },

      21: {
        heading: `In the End, You Are Meant to See It Whole and Call It Complete`,
        why: `The late work is declaring completion. You learned to finish things, then completed what two lines started, and the final task is your own life — seeing the entire arc and being willing to call it whole rather than unfinished. This position spends a lifetime on closure, and this is the closure it was always building toward.`,
        shadow: `The distortion is the life assessed as incomplete. You reach the end with a running list of what you didn't get to, and the breadth that let you see so much becomes the reason nothing ever measures up. You may notice you can enumerate the unfinished business precisely and struggle to state what you actually completed.`,
        path: `Name what you finished, out loud, and let the list of what you didn't stand unaddressed. You are allowed to call an incomplete life whole. What did you actually complete?`,
        positive: `You see it whole. The arc includes everything you didn't get to and you can still call it complete — not because the list is empty, but because you've understood that wholeness was never the same as exhaustiveness. That's the completion this position was pointed at from the beginning. You can name what you finished, and the naming holds.`,
        negative: `The life is being read as unfinished. You may find that your breadth of vision, which served you so well, now produces mainly an inventory of what didn't happen — and that calling any of it complete feels like a concession. This is the specific late risk for this position: the same capacity that let you see the whole picture makes any actual life look partial against it. Wholeness here was always going to be a decision rather than an achievement.`,
        synthesis: `Your Personal and Social Purposes resolve here. The personal task was finishing something at its actual scope; the social task was completing what two lineages began. With the World, the late task applies the same judgement to your own arc. It comes last necessarily — a life can only be called whole from its end, and this position's entire education has been in the difference between complete and exhaustive. Everything before was practice for this particular declaration.`,
      },

      22: {
        heading: `In the End, You Are Meant to Step Off Without Knowing`,
        why: `The late work is the last leap. You learned to begin without guarantees, then took the risk your lines wouldn't, and the final task is the one nobody prepares for: going forward into something you cannot see or verify. This position spends its whole life practising exactly this, and everything before it turns out to have been rehearsal.`,
        shadow: `The distortion is the openness deserting you precisely when it's needed. A life of leaping ends in gripping — clutching at certainty, at continuation, at any assurance about what comes next — and the freedom that defined you is absent from the one crossing it was built for. You may notice you've become more frightened rather than less as the years narrow.`,
        path: `Practise not knowing, deliberately, in something small. You are allowed to go forward without the map, one more time. What are you gripping that you spent a lifetime proving you didn't need?`,
        positive: `The openness held. A life spent stepping off before the ground was proven has produced exactly what it was always going to produce: someone who can face the last unknown without needing it explained first. There's no bravado in it. Just the same willingness you had at twenty, arriving where it was actually needed, which is what all the earlier leaps were quietly training.`,
        negative: `The gripping has started. You may notice that the openness which defined your whole life is thinning as the horizon closes, that you're reaching for certainties you once cheerfully did without, and that this frightens you more than any earlier risk did. That's not a failure of nerve — every leap before this had a visible other side. This one doesn't, and it's the only one the entire position was ever really preparing for.`,
        synthesis: `Your Personal and Social Purposes combine here. The personal task was leaping without justification; the social task was taking the risk your lines never would. With the Fool, the late task is the same movement with nothing on the far side that anyone can describe. It comes last for the plainest reason there is. Every earlier leap had ground you could eventually stand on and report back from — and each one, whether you knew it or not, was practice for the one that doesn't.`,
      },

    },

  };

  function get(posKey, arcanaNum) {
    const group = positions[posKey];
    if (!group) return null;
    return group[Number(arcanaNum)] || null;
  }

  return { get };

})();
